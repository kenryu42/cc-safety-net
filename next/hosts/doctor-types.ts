/**
 * Type definitions for the doctor command.
 */

import type { IntegrationId } from '@next/hosts/catalog';

/** Hook platform identifiers */
export type HookPlatform = IntegrationId;

/**
 * Hook configuration inspection status.
 * `not-inspected` means the runtime's own state file exists but could not be read, so its
 * configuration is unknown rather than absent.
 */
type HookInspectionStatus = 'verified' | 'failed' | 'not-applicable' | 'not-inspected';

/** Hook discovery and configuration inspection result */
export interface HookStatus {
  platform: HookPlatform;
  detected: boolean;
  configured: boolean;
  inspectionStatus: HookInspectionStatus;
  method?: string;
  configPath?: string;
  configPaths?: readonly string[];
  errors?: string[];
}

/** Update check result */
export interface UpdateInfo {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  error?: string;
}

/** System information. */
export interface SystemInfo {
  /** cc-safety-net version */
  version: string;
  /** Per-integration version, keyed by id, from the catalog's `probeCommand`. Copilot's probe is
   * `copilot --binary-version`; `copilot --version` is never run because it downloads a ~160 MB
   * package cache. */
  versions: Partial<Record<IntegrationId, string | null>>;
  /** Codex plugin list output (from `codex plugin list`) */
  codexPluginListOutput: string | null;
  /** Amp plugin list output (from `amp plugins list`) */
  ampPluginListOutput: string | null;
  /** Node.js version (from `node --version`) */
  nodeVersion: string | null;
  /** npm version (from `npm --version`) */
  npmVersion: string | null;
  /** Bun version (from `bun --version`) */
  bunVersion: string | null;
  /** Platform (e.g., "darwin arm64") */
  platform: string;
}
