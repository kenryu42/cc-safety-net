import { describe, expect, test } from 'bun:test';
import { printInstallBanner as portedPrintInstallBanner } from '@/cli/install/banner';
import { createFakeInput, createFakeOutput } from '../../helpers/fake-tty';

type KeyPress = { name: string; value?: string; ctrl?: boolean };

async function runBanner(options: { inputTTY: boolean; outputTTY: boolean; keypress?: KeyPress }) {
  const input = createFakeInput({ isTTY: options.inputTTY });
  const output = createFakeOutput({ isTTY: options.outputTTY });
  const interrupts: string[] = [];
  let sleeps = 0;

  await portedPrintInstallBanner({
    input: input as unknown as NodeJS.ReadStream,
    onInterrupt: () => interrupts.push('interrupt'),
    output,
    seed: 7,
    sleep: async () => {
      sleeps += 1;
      const keypress = options.keypress;
      if (sleeps === 1 && keypress) input.press(keypress.name, keypress.value, keypress.ctrl);
    },
  });

  return {
    chunks: output.chunks,
    interrupts,
    rawModeCalls: input.rawModeCalls,
    streamCalls: input.streamCalls,
  };
}

const BEGIN_SYNC = '\x1b[?2026h';
const END_SYNC = '\x1b[?2026l';
const OPENING = '\x1b[?25l\n\n\x1b[2A\x1b7';
const CLOSING = ['\x1b8', '\x1b[2B', '\n\x1b[0m\x1b[?25h'];

const framesOf = (chunks: readonly string[]) => {
  const frames = chunks.slice(1, -3);
  for (const frame of frames) {
    expect(frame, frame).toStartWith(BEGIN_SYNC);
    expect(frame, frame).toEndWith(END_SYNC);
  }
  return frames;
};

const ENTER: KeyPress = { name: 'return', value: '\r' };
const CTRL_C: KeyPress = { name: 'c', value: '\x03', ctrl: true };

describe('cli/install/banner', () => {
  test('a non-TTY keyboard runs the animation to the end on both implementations', async () => {
    const ported = await runBanner({ inputTTY: false, outputTTY: true });
    expect(ported.rawModeCalls).toEqual([]);
    expect(ported.streamCalls).toEqual([]);
    expect(ported.chunks[0]).toBe(OPENING);
    expect(ported.chunks.slice(-3)).toEqual(CLOSING);
    expect(framesOf(ported.chunks)).toHaveLength(55);
  });

  test('Enter cuts the animation short and restores the keyboard on both implementations', async () => {
    const ported = await runBanner({ inputTTY: true, keypress: ENTER, outputTTY: true });
    expect(ported.rawModeCalls).toEqual([true, false]);
    expect(ported.streamCalls).toEqual(['resume', 'pause']);
    expect(ported.interrupts).toEqual([]);
    expect(framesOf(ported.chunks)).toHaveLength(2);
    expect(ported.chunks[0]).toBe(OPENING);
    expect(ported.chunks.slice(-3)).toEqual(CLOSING);
  });

  test('Ctrl-C reaches the caller once on both implementations', async () => {
    const ported = await runBanner({ inputTTY: true, keypress: CTRL_C, outputTTY: true });
    expect(ported.interrupts).toEqual(['interrupt']);
    expect(ported.rawModeCalls).toEqual([true, false]);
    expect(ported.streamCalls).toEqual(['resume', 'pause']);
    expect(framesOf(ported.chunks)).toHaveLength(2);
    expect(ported.chunks.slice(-3)).toEqual(CLOSING);
  });

  test('a non-TTY sink prints nothing on either implementation', async () => {
    const ported = await runBanner({ inputTTY: true, outputTTY: false });
    expect(ported).toEqual({
      chunks: [],
      interrupts: [],
      rawModeCalls: [],
      streamCalls: [],
    });
  });
});
