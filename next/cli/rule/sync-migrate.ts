import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Environment } from '@next/core/environment';
import { getProjectRulesConfigPath, getUserRulesConfigPath } from '@next/core/policy/paths';

/**
 * `rule sync`'s migration and every helper it needs is Phase 8's; doctor needs the leftover probe
 * alone. The two scope config paths spelled inline stand in for `getScopePaths`, which lands with
 * the rest of the file.
 */

const CACHE_DIR = 'cache';
const RULES_LOCK_FILE = 'rule.lock';

/** The leftovers doctor reports, in both scopes, without reading or removing anything. */
export function findRuleV2Leftovers(environment: Environment, cwd: string): string[] {
  return [
    ...new Set(
      [getProjectRulesConfigPath(cwd), getUserRulesConfigPath(environment)].flatMap(
        (configPath) => [
          join(dirname(configPath), RULES_LOCK_FILE),
          getV2CacheDir(dirname(configPath)),
        ],
      ),
    ),
  ].filter((path) => existsSync(path));
}

/** Where a v2 install cached rulebooks: a `cache` directory beside the scope's `rules` one. */
function getV2CacheDir(configDir: string): string {
  return join(dirname(configDir), CACHE_DIR);
}
