import type { Plugin } from '@opencode-ai/plugin';
import { analyzeCommand, loadConfig } from '@/core/analyze';
import { getSafetyNetEnvModes } from '@/core/env';
import { formatBlockedMessage } from '@/core/format';
import { loadBuiltinCommands } from '@/opencode/builtin-commands/index';

export const CCSafetyNetPlugin: Plugin = async ({ directory }) => {
  const modes = getSafetyNetEnvModes();

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
        const result = analyzeCommand(command, {
          cwd: directory,
          config: loadConfig(directory, { repairLocalRulebooks: true }),
          strict: modes.strict,
          paranoidRm: modes.paranoidRm,
          paranoidInterpreters: modes.paranoidInterpreters,
          worktreeMode: modes.worktreeMode,
        });
        if (result) {
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
};
