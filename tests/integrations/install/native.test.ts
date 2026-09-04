import { describe, expect, test } from 'bun:test';
import { chmodSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runNativeCommand, runNativeCommands } from '../../../src/integrations/install/native';
import { withEnv, withTempDir } from '../../helpers';
import { makeTempHome } from '../hook-helpers';

function capturedFailureMessage(promise: Promise<string>): Promise<string> {
  return promise.then(
    () => '',
    (error: Error) => error.message,
  );
}

describe('runNativeCommand failures', () => {
  test('surfaces the spawn failure reason when the binary is missing', async () => {
    const command = ['cc-safety-net-no-such-binary-xyz', '--version'] as const;
    const message = await capturedFailureMessage(runNativeCommand(command));

    const lines = message.split('\n');

    expect(lines[0]).toBe('Failed to run cc-safety-net-no-such-binary-xyz --version.');
    expect(message).not.toContain('(exit');
    expect(lines[1]).toContain('cc-safety-net-no-such-binary-xyz');
  });

  test('reports the exit code, stdout and stderr on a nonzero exit', async () => {
    const script = 'console.log("out"); console.error("err"); process.exit(3)';
    const command = [process.execPath, '-e', script] as const;

    const message = await capturedFailureMessage(runNativeCommand(command));

    expect(message).toBe(`Failed to run ${process.execPath} -e ${script} (exit 3).\nout\n\nerr`);
  });

  test('kills a stalled command at the timeout and reports it as a failure', async () => {
    const message = await capturedFailureMessage(
      runNativeCommand([process.execPath, '-e', 'setTimeout(() => {}, 1e9)'] as const, {
        timeoutMs: 50,
      }),
    );

    expect(message).toContain(`Failed to run ${process.execPath} -e setTimeout(() => {}, 1e9).`);
    expect(message).toContain('Timed out after 50ms');
  });
});

describe('runNativeCommand on Windows', () => {
  test.skipIf(process.platform === 'win32')(
    'runs a PATH-installed cmd shim through COMSPEC',
    async () => {
      await withTempDir('safety-net-native-windows-cmd-', async (tmpDir) => {
        const comspecPath = join(tmpDir, 'cmd');
        writeFileSync(join(tmpDir, 'fake.CMD'), '');
        writeFileSync(comspecPath, '#!/bin/sh\nprintf "%s" "$3"\n');
        chmodSync(comspecPath, 0o755);

        const output = await withEnv(
          {
            COMSPEC: comspecPath,
            PATH: tmpDir,
            PATHEXT: '.CMD',
            _CC_SAFETY_NET_TEST_SPAWN_PLATFORM: 'win32',
          },
          () => runNativeCommand(['fake', 'arg with space'] as const),
        );

        expect(output).toContain(join(tmpDir, 'fake.CMD'));
        expect(output).toContain('"arg with space"');
      });
    },
  );
});

describe('runNativeCommands sequencing', () => {
  test('aborts at the first failing command and propagates its error', async () => {
    const dir = makeTempHome('safety-net-native-commands');
    const write = (path: string) => `require('node:fs').writeFileSync(${JSON.stringify(path)}, '')`;

    await expect(
      runNativeCommands([
        [process.execPath, '-e', write(join(dir, 'first'))],
        [process.execPath, '-e', 'process.exit(4)'],
        [process.execPath, '-e', write(join(dir, 'third'))],
      ]),
    ).rejects.toThrow(/exit 4/);

    expect(existsSync(join(dir, 'first'))).toBe(true);
    expect(existsSync(join(dir, 'third'))).toBe(false);
  });
});
