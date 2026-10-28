import { delimiter, dirname } from 'node:path';
import pkg from '../package.json';

const pathKey = Object.keys(process.env).find((key) => key.toLowerCase() === 'path') ?? 'PATH';
const result = Bun.spawnSync(
  Bun.version === pkg.packageManager.slice(4)
    ? [process.execPath, ...process.argv.slice(2)]
    : [
        process.execPath,
        'x',
        '--silent',
        '--package',
        pkg.packageManager,
        'bun',
        ...process.argv.slice(2),
      ],
  {
    env: {
      ...process.env,
      [pathKey]: `${dirname(process.execPath)}${delimiter}${process.env[pathKey] ?? ''}`,
    },
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  },
);
process.exit(result.exitCode);
