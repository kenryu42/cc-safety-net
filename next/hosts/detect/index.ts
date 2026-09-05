/**
 * Hook discovery for the doctor command: one detector per catalog integration, composed in
 * doctor order.
 */

import type { Environment } from '@next/core/environment';
import { detect as detectAmp } from '@next/hosts/amp/detect';
import { detect as detectAntigravityCli } from '@next/hosts/antigravity-cli/detect';
import { doctorIntegrationOrder, type IntegrationId } from '@next/hosts/catalog';
import { detect as detectClaudeCode } from '@next/hosts/claude-code/detect';
import { detect as detectCodex } from '@next/hosts/codex/detect';
import { detect as detectCopilotCli } from '@next/hosts/copilot-cli/detect';
import { detect as detectCursor } from '@next/hosts/cursor/detect';
import type { DetectContext, HookDetection } from '@next/hosts/detect/context';
import type { HookStatus } from '@next/hosts/doctor-types';
import { detect as detectGeminiCli } from '@next/hosts/gemini-cli/detect';
import { detect as detectGrokBuild } from '@next/hosts/grok-build/detect';
import { detect as detectHermesAgent } from '@next/hosts/hermes-agent/detect';
import { detect as detectKimiCode } from '@next/hosts/kimi-code/detect';
import { detect as detectOpenClaw } from '@next/hosts/openclaw/detect';
import { detect as detectOpenCode } from '@next/hosts/opencode/detect';
import { detect as detectPi } from '@next/hosts/pi/detect';

/** A catalog entry without a detector fails typecheck here. */
const detectors = {
  amp: detectAmp,
  'antigravity-cli': detectAntigravityCli,
  'claude-code': detectClaudeCode,
  codex: detectCodex,
  'copilot-cli': detectCopilotCli,
  cursor: detectCursor,
  'gemini-cli': detectGeminiCli,
  'grok-build': detectGrokBuild,
  'hermes-agent': detectHermesAgent,
  'kimi-code': detectKimiCode,
  openclaw: detectOpenClaw,
  opencode: detectOpenCode,
  pi: detectPi,
} satisfies Record<IntegrationId, (context: DetectContext) => HookDetection>;

/**
 * Detect all hooks and inspect their configuration.
 */
export function detectAllHooks(
  environment: Environment,
  cwd: string,
  options?: Omit<DetectContext, 'cwd' | 'environment'>,
): HookStatus[] {
  const context = { ...options, cwd, environment };
  return doctorIntegrationOrder.map((platform) => toHookStatus(detectors[platform](context)));
}

function toHookStatus(detection: HookDetection): HookStatus {
  if (detection.status === 'not-inspected') {
    return {
      platform: detection.platform,
      detected: false,
      configured: false,
      inspectionStatus: 'not-inspected',
    };
  }

  return {
    platform: detection.platform,
    detected: detection.status !== 'n/a',
    configured: detection.status === 'configured',
    inspectionStatus:
      detection.status !== 'n/a'
        ? 'verified'
        : detection.errors && detection.errors.length > 0
          ? 'failed'
          : 'not-applicable',
    method: detection.method,
    configPath: detection.configPath,
    configPaths: detection.configPaths,
    errors: detection.errors,
  };
}
