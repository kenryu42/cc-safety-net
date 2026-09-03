import { expect, test } from 'bun:test';
import portedAmpPlugin from '@next/entries/amp';
import { CCSafetyNetPlugin as portedOpenCodePlugin } from '@next/entries/index';
import portedPiExtension from '@next/entries/pi';
import { CCSafetyNetPlugin as shippedOpenCodePlugin } from '@/index';
import shippedAmpPlugin from '@/integrations/amp/index';
import shippedPiExtension from '@/integrations/pi/index';

/**
 * What each in-process entry claims from its host at load time. The entries do no work of their
 * own beyond registration, so the check is that the ported entry registers for the same events,
 * in the same order, as the shipped one.
 */

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
  expect(typeof portedOpenCodePlugin).toBe(typeof shippedOpenCodePlugin);
});

test('the Pi entry claims the tool call event and the builtin command', () => {
  const ported = recordHostEvents(portedPiExtension);

  expect(ported).toStrictEqual(recordHostEvents(shippedPiExtension));
  expect(ported).toStrictEqual(['tool_call', 'cc-safety-net']);
});

test('the Amp entry claims the tool call event', () => {
  const ported = recordHostEvents(portedAmpPlugin);

  expect(ported).toStrictEqual(recordHostEvents(shippedAmpPlugin));
  expect(ported).toStrictEqual(['tool.call']);
});
