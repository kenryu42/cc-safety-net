import type { Plugin, PluginInput } from '@opencode-ai/plugin';
import { analyzeCommand, loadConfig } from '@/core/analyze';
import { writeAuditLog } from '@/core/audit';
import { getCCSafetyNetEnvModes } from '@/core/env';
import { formatBlockedMessage } from '@/core/format';
import { loadBuiltinCommands } from '@/opencode/builtin-commands/index';

const REASON_SAFETY_NET_FAILED_CLOSED =
  'CC Safety Net failed closed because command analysis failed unexpectedly.';

type CCSafetyNetPluginInput = PluginInput & { homeDir?: string };

export const CCSafetyNetPlugin = (async ({ directory, homeDir }: CCSafetyNetPluginInput) => {
  const modes = getCCSafetyNetEnvModes();

  return {
    config: async (opencodeConfig: Record<string, unknown>) => {
      const builtinCommands = loadBuiltinCommands();
      const existingCommands = (opencodeConfig.command as Record<string, unknown>) ?? {};

      opencodeConfig.command = {
        ...builtinCommands,
        ...existingCommands,
      };
    },

    'tool.execute.before': async (input, output) => {
      if (input.tool === 'bash') {
        const command = output.args.command;
        let result: ReturnType<typeof analyzeCommand>;
        try {
          result = analyzeCommand(command, {
            cwd: directory,
            config: loadConfig(directory, { repairLocalRulebooks: true }),
            strict: modes.strict,
            paranoidRm: modes.paranoidRm,
            paranoidInterpreters: modes.paranoidInterpreters,
            worktreeMode: modes.worktreeMode,
          });
        } catch {
          throw new Error(
            formatBlockedMessage({
              reason: REASON_SAFETY_NET_FAILED_CLOSED,
              command,
              segment: command,
            }),
          );
        }
        if (result) {
          if (input.sessionID) {
            writeAuditLog(input.sessionID, command, result.segment, result.reason, directory, {
              homeDir,
            });
          }
          const message = formatBlockedMessage({
            reason: result.reason,
            command,
            segment: result.segment,
            manualPermissionAdvice: result.manualPermissionAdvice,
          });

          throw new Error(message);
        }
      }
    },
  };
}) satisfies Plugin;
