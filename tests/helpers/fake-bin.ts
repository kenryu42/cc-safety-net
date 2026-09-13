import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export type FakeScriptEntry = {
  command: string;
  args?: string[];
  stdout?: string;
  stderr?: string;
  exit?: number;
  delayMs?: number;
  seedDir?: string;
  seedInto?: string;
  snapshotTo?: string;
};

const FAKE_COMMAND = join(import.meta.dir, 'fake-command.ts');

let canonicalStub = '';

/**
 * @internal Called from the run-wide afterAll in tests/setup.ts: bun evaluates this module once per
 * process, so a module-scope afterAll would fire after the first file that imported it and delete
 * the stub every later file links to.
 */
export function removeCanonicalStub(): void {
  if (canonicalStub) rmSync(join(canonicalStub, '..'), { recursive: true, force: true });
}

function canonicalStubPath() {
  if (canonicalStub) return canonicalStub;
  const dir = mkdtempSync(
    join(process.env.CC_SAFETY_NET_TEST_TMPDIR ?? tmpdir(), 'cc-safety-net-fake-stub-'),
  );
  canonicalStub = join(dir, 'stub');
  writeFileSync(
    canonicalStub,
    `#!/bin/sh\nexec "${process.execPath}" "${FAKE_COMMAND}" "\${0##*/}" "$@"\n`,
    { mode: 0o755 },
  );
  return canonicalStub;
}

export function createFakeBin(
  root: string,
  script: readonly FakeScriptEntry[],
  extraCommands: readonly string[] = [],
) {
  const binDir = join(root, 'bin');
  const scriptPath = join(root, 'fake-script.json');
  const logPath = join(root, 'fake-log.txt');
  mkdirSync(binDir, { recursive: true });
  writeFileSync(scriptPath, JSON.stringify(script));
  for (const command of new Set([...script.map((entry) => entry.command), ...extraCommands])) {
    if (process.platform === 'win32') {
      writeFileSync(
        join(binDir, `${command}.cmd`),
        `@echo off\r\n"${process.execPath}" "${FAKE_COMMAND}" ${command} %*\r\n`,
      );
      continue;
    }
    symlinkSync(canonicalStubPath(), join(binDir, command));
  }
  return {
    binDir,
    logPath,
    env: {
      PATH: binDir,
      CC_SAFETY_NET_FAKE_LOG: logPath,
      CC_SAFETY_NET_FAKE_SCRIPT: scriptPath,
    },
    readLog: (): string[] =>
      (existsSync(logPath) ? readFileSync(logPath, 'utf-8') : '')
        .split('\n')
        .filter(Boolean)
        .map((line) =>
          line.replace(`\t${realpathSync(root)}`, '\t<root>').replace(`\t${root}`, '\t<root>'),
        ),
  };
}
