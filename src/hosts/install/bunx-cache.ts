import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

export function clearBunxSafetyNetCache(
  tempDir: string,
  platform: NodeJS.Platform = process.platform,
  runningEntry?: string,
): void {
  if (!existsSync(tempDir)) return;
  const entryPattern =
    platform === 'win32'
      ? /^bunx-\d+-cc-safety-net@/
      : new RegExp(`^bunx-${process.getuid?.() ?? 0}-cc-safety-net@`);

  readdirSync(tempDir)
    .filter((entry) => entry !== runningEntry && entryPattern.test(entry))
    .forEach((entry) => {
      rmSync(join(tempDir, entry), { recursive: true, force: true });
    });
}
