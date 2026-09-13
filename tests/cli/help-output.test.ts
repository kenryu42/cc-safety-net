import { expect, test } from 'bun:test';
import { findCommand } from '@/cli/commands';
import { printHelp, showCommandHelp } from '@/cli/help';
import { captureConsole } from '../helpers/console-capture';

test('global help lists commands, safety settings, and how to get command help', async () => {
  const result = await captureConsole(printHelp);
  expect(result.error).toEqual([]);
  expect(result.log).toHaveLength(1);
  expect(result.log[0]).toContain('cc-safety-net explain');
  expect(result.log[0]).toContain('cc-safety-net help <command>');
  expect(result.log[0]).toContain('CC_SAFETY_NET_LEVEL=standard|strict|paranoid');
});

test('command help is case insensitive and declines unknown names and option aliases', async () => {
  const found = await captureConsole(() => showCommandHelp('DoCtOr'));
  expect(found.returned).toBe(true);
  expect(found.log.join('\n')).toContain('--skip-update-check');
  expect(found.error).toEqual([]);
  for (const name of ['missing-command', '--doctor']) {
    const result = await captureConsole(() => showCommandHelp(name));
    expect(result.returned).toBe(false);
    expect(result.log).toEqual([]);
    expect(result.error).toEqual([]);
  }
  expect(findCommand('--DOCTOR')?.name).toBe('doctor');
});
