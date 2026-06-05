import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { MAX_REASON_LENGTH } from '@/types';
import { getRulebookSourceSyntaxError } from './sources';
import { DEFAULT_CONFIG, type RulesConfig, type SyncRulesConfigResult } from './types';

export function validateRulesConfig(config: unknown): { errors: string[]; sources: Set<string> } {
  const errors: string[] = [];
  const sources = new Set<string>();

  if (!config || typeof config !== 'object') {
    return { errors: ['Config must be an object'], sources };
  }

  const cfg = config as Record<string, unknown>;
  if (cfg.version !== 1) {
    errors.push('version must be 1');
  }
  if (cfg.rules === undefined) {
    // Missing rules is equivalent to an empty new-style config.
  } else if (!Array.isArray(cfg.rules)) {
    errors.push('rules must be an array of rulebook source strings');
  } else {
    for (let i = 0; i < cfg.rules.length; i++) {
      if (typeof cfg.rules[i] !== 'string') {
        errors.push(`rules[${i}]: must be a rulebook source string`);
        continue;
      }
      if (cfg.rules[i].trim() === '') {
        errors.push(`rules[${i}]: must be a non-empty rulebook source string`);
        continue;
      }
      if (sources.has(cfg.rules[i])) {
        errors.push(`rules[${i}]: duplicate rulebook source "${cfg.rules[i]}"`);
        continue;
      }
      const sourceError = getRulebookSourceSyntaxError(cfg.rules[i]);
      if (sourceError) {
        errors.push(`rules[${i}]: ${sourceError}`);
        continue;
      }
      sources.add(cfg.rules[i]);
    }
  }
  if (cfg.overrides !== undefined) {
    if (!cfg.overrides || typeof cfg.overrides !== 'object' || Array.isArray(cfg.overrides)) {
      errors.push('overrides must be an object if provided');
    } else {
      for (const [key, value] of Object.entries(cfg.overrides)) {
        if (!/^[^/]+\/[^/]+$/.test(key)) {
          errors.push(`overrides.${key}: must use <rulebook-name>/<rule-name>`);
        }
        if (value === 'off') {
          continue;
        }
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          errors.push(`overrides.${key}: must be "off" or an object`);
          continue;
        }
        const reason = (value as Record<string, unknown>).reason;
        if (typeof reason !== 'string' || reason === '') {
          errors.push(`overrides.${key}.reason: required non-empty string`);
        } else if (reason.length > MAX_REASON_LENGTH) {
          errors.push(`overrides.${key}.reason: must be at most ${MAX_REASON_LENGTH} characters`);
        }
      }
    }
  }

  return { errors, sources };
}

export function readRulesConfig(path: string): { config: RulesConfig | null; errors: string[] } {
  if (!existsSync(path)) {
    return { config: null, errors: [] };
  }

  try {
    const content = readFileSync(path, 'utf-8');
    if (!content.trim()) {
      return { config: null, errors: ['Config file is empty'] };
    }

    const parsed = JSON.parse(content) as unknown;
    const validation = validateRulesConfig(parsed);
    if (validation.errors.length > 0) {
      return { config: null, errors: validation.errors };
    }
    const cfg = parsed as RulesConfig;
    return {
      config: {
        version: 1,
        rules: cfg.rules ?? [],
        overrides: cfg.overrides ?? {},
      },
      errors: [],
    };
  } catch (error) {
    return {
      config: null,
      errors: [`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

export function readScopeRulesConfig(
  path: string,
): { ok: true; config: RulesConfig } | { ok: false; result: SyncRulesConfigResult } {
  const loaded = readRulesConfig(path);
  if (loaded.errors.length > 0) {
    return { ok: false, result: { ok: false, errors: loaded.errors, warnings: [], entries: [] } };
  }
  return { ok: true, config: loaded.config ?? DEFAULT_CONFIG };
}

export function writeDefaultRulesConfig(path: string, rules: string[] = []): void {
  writeJsonAtomic(path, { version: 1, rules, overrides: {} });
}

export function writeStarterRulebook(path: string, name = 'project-rules'): void {
  writeJsonAtomic(path, {
    rulebook_version: 1,
    name,
    version: '1.0.0',
    description:
      name === 'project-rules'
        ? 'Project-specific CC Safety Net rules.'
        : 'User-specific CC Safety Net rules.',
    author: name === 'project-rules' ? 'project' : 'user',
    allowed_commands: ['docker'],
    rules: [
      {
        name: 'block-docker-system-prune',
        command: 'docker',
        subcommand: 'system',
        block_args: ['prune'],
        reason: 'Use targeted cleanup instead.',
      },
    ],
    tests: [
      {
        command: 'docker system prune',
        expect: 'blocked',
        rule: 'block-docker-system-prune',
      },
    ],
  });
}

export function writeJsonAtomic(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  const tempPath = `${path}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8');
  renameSync(tempPath, path);
}
