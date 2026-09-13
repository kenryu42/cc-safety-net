import { afterEach, expect, test } from 'bun:test';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { isPluginEnabled, printStatusline } from '@/cli/statusline';
import { HOOK_INPUT_MAX_BYTES } from '@/gate/intake';
import { PLUGIN_SETTINGS, RULE_SWITCHED_OFF } from '../helpers/cli-fixtures';
import { captureConsole } from '../helpers/console-capture';
import { writeTree } from '../helpers/fixture-tree';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
} from '../helpers/temp-home';

afterEach(removeTempRoots);

test.each([
  ['{}', false],
  ['{"enabledPlugins":{"unrelated":true}}', false],
  ['{"enabledPlugins":{"cc-safety-net@cc-marketplace":false}}', false],
  [PLUGIN_SETTINGS, true],
])('reads plugin activation from the explicit settings path: %s', (settings, expected) => {
  const home = createTempRoot('statusline-settings-');
  writeTree(home, { 'custom.json': settings });
  expect(
    isPluginEnabled(
      environmentFor(
        home,
        isolationEnv(home, {
          CLAUDE_SETTINGS_PATH: join(home, 'custom.json'),
        }),
      ),
    ),
  ).toBe(expected);
});

test('malformed settings disable the plugin and report the path in debug mode', async () => {
  const home = createTempRoot('statusline-settings-');
  writeTree(home, { '.claude/settings.json': '{' });
  const result = await captureConsole(() =>
    isPluginEnabled(
      environmentFor(
        home,
        isolationEnv(home, {
          CC_SAFETY_NET_DEBUG: '1',
        }),
      ),
    ),
  );
  expect(result.returned).toBe(false);
  expect(result.log).toEqual([]);
  expect(result.error).toHaveLength(1);
  expect(result.error[0]).toContain(
    `failed to read Claude settings: ${join(home, '.claude/settings.json')}:`,
  );
});

test.each([
  ['hello\n', 'hello | 🛡️ CC Safety Net ❌'],
  ['{"model":"x"}', '🛡️ CC Safety Net ❌'],
  [' \n', '🛡️ CC Safety Net ❌'],
])('renders streamed statusline input %j', async (input, expected) => {
  const home = createTempRoot('statusline-input-');
  const result = await captureConsole(() =>
    printStatusline(environmentFor(home, isolationEnv(home)), Readable.from([input])),
  );
  expect(result.log).toEqual([expected]);
  expect(result.error).toEqual([]);
});

test('oversized statusline input is discarded and its stream is closed', async () => {
  const home = createTempRoot('statusline-input-');
  const input = Readable.from([Buffer.alloc(HOOK_INPUT_MAX_BYTES + 1, 'x')]);
  const result = await captureConsole(() =>
    printStatusline(environmentFor(home, isolationEnv(home)), input),
  );
  expect(result.log).toEqual(['🛡️ CC Safety Net ❌']);
  expect(result.error).toEqual([]);
  expect(input.destroyed).toBe(true);
});

test('an effective rule override is shown as custom safety', async () => {
  const home = createTempRoot('statusline-policy-');
  writeTree(home, {
    '.claude/settings.json': PLUGIN_SETTINGS,
    '.cc-safety-net/policy.json': RULE_SWITCHED_OFF,
  });
  const cwd = process.cwd();
  try {
    process.chdir(home);
    const result = await captureConsole(() =>
      printStatusline(environmentFor(home, isolationEnv(home)), []),
    );
    expect(result.log).toEqual(['🛡️ CC Safety Net 🔧']);
    expect(result.error).toEqual([]);
  } finally {
    process.chdir(cwd);
  }
});
