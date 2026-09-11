import { existsSync, lstatSync, readFileSync } from 'node:fs';
import type { Environment } from '@/core/environment';
import type { HookPlatform } from '@/hosts/doctor-types';

type HookDetectionStatus = 'configured' | 'n/a' | 'disabled' | 'not-inspected';

export interface HookDetection {
  platform: HookPlatform;
  status: HookDetectionStatus;
  method?: string;
  configPath?: string;
  configPaths?: readonly string[];
  errors?: string[];
}

export interface DetectContext {
  environment: Environment;
  cwd: string;
  ampPluginListOutput?: string | null;
  codexPluginListOutput?: string | null;
  copilotCliVersion?: string | null;
}

export function readStateFile(
  path: string,
  preprocess: (raw: string) => string = (raw) => raw,
): { kind: 'missing' } | { kind: 'unreadable' } | { kind: 'ok'; value: unknown } {
  if (!existsSync(path)) return { kind: 'missing' };

  try {
    return { kind: 'ok', value: JSON.parse(preprocess(readFileSync(path, 'utf-8'))) };
  } catch {
    return { kind: 'unreadable' };
  }
}

export function lstatOrUndefined(path: string) {
  try {
    return lstatSync(path);
  } catch {
    return undefined;
  }
}

export function inspectManagedPluginDir(
  platform: HookPlatform,
  configPath: string,
): HookDetection | undefined {
  const info = lstatOrUndefined(configPath);
  if (!info) return { platform, status: 'n/a', configPath };
  if (!info.isSymbolicLink() && info.isDirectory()) return undefined;
  return {
    platform,
    status: 'n/a',
    configPath,
    errors: [`${configPath} is a symlink or not a directory; move or remove it before installing`],
  };
}

export function readRecord(value: unknown, key: string): unknown {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)[key]
    : undefined;
}
