import { expect, test } from 'bun:test';
import portedAmpPlugin from '@/entries/amp';
import { CCSafetyNetPlugin as portedOpenCodePlugin } from '@/entries/index';
import portedPiExtension from '@/entries/pi';

function recordHostEvents(register: (host: never) => void): string[] {
  const events: string[] = [];
  register({
    on: (event: string) => events.push(event),
    registerCommand: (name: string) => events.push(name),
  } as never);
  return events;
}

test('the OpenCode entry exports a plugin factory', () => {
  expect(typeof portedOpenCodePlugin).toBe('function');
});

test('the Pi entry claims the tool call event and the builtin command', () => {
  expect(recordHostEvents(portedPiExtension)).toStrictEqual(['tool_call', 'cc-safety-net']);
});

test('the Amp entry claims the tool call event', () => {
  expect(recordHostEvents(portedAmpPlugin)).toStrictEqual(['tool.call']);
});
