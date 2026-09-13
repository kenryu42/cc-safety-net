import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import type { Environment } from '@/core/environment';

export function clearNpxSafetyNetCache(
  environment: Environment,
  platform: NodeJS.Platform = process.platform,
): void {
  const npxDir = join(
    environment.env.get('npm_config_cache') ||
      (platform === 'win32'
        ? join(
            environment.env.get('LOCALAPPDATA') || join(environment.home, 'AppData', 'Local'),
            'npm-cache',
          )
        : join(environment.home, '.npm')),
    '_npx',
  );

  if (!existsSync(npxDir)) return;
  readdirSync(npxDir)
    .filter((entry) => existsSync(join(npxDir, entry, 'node_modules', 'cc-safety-net')))
    .forEach((entry) => {
      rmSync(join(npxDir, entry), { recursive: true, force: true });
    });
}
