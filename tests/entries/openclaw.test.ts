import { expect, test } from 'bun:test';
import portedOpenClawEntry from '@/entries/openclaw';

test('the OpenClaw entry declares the same extension, with a register hook to call', () => {
  expect({
    ...portedOpenClawEntry,
    register: typeof portedOpenClawEntry.register,
  }).toEqual({
    id: 'cc-safety-net',
    name: 'CC Safety Net',
    description: 'Block destructive commands and secret-file access before OpenClaw runs a tool.',
    register: 'function',
  });
});
