import { describe, expect, test } from 'bun:test';
import {
  createLolcatAnimationFrames as portedCreateFrames,
  renderLolcat as portedRender,
  writeAnimatedLolcat as portedWriteAnimated,
} from '@/cli/utils/lolcat';
import { createFakeOutput } from '../../helpers/fake-tty';

const TEXT = 'ab\ncd';
const RENDER_OPTIONS = { seed: 5, frequency: 0.2, spread: 2 };
const BEGIN_SYNC = '\x1b[?2026h';
const END_SYNC = '\x1b[?2026l';

const ANSI_STYLE = new RegExp(`${'\x1b'}\\[[\\d;]*m`, 'g');

const plain = (frame: string) => frame.replace(ANSI_STYLE, '');

function captureAnimation(isTTY: boolean, signal?: AbortSignal) {
  const output = createFakeOutput({ isTTY });
  return portedWriteAnimated(TEXT, {
    duration: 2,
    output,
    seed: 5,
    signal,
    sleep: async () => {},
  }).then(() => output.chunks);
}

describe('cli/utils/lolcat', () => {
  test('renderLolcat paints one colour per character and resets at the end', () => {
    expect(portedRender(TEXT, RENDER_OPTIONS)).toBe(
      '\x1b[38;2;233;137;54ma\x1b[38;2;229;141;42mb\x1b[22m\x1b[39m\n' +
        '\x1b[38;2;224;144;29mc\x1b[38;2;219;148;13md\x1b[22m\x1b[39m\x1b[0m',
    );
    expect(portedRender('', RENDER_OPTIONS)).toBe('');
  });

  test('createLolcatAnimationFrames walks the seed the same way on both implementations', () => {
    const options = { duration: 3, seed: 5, speed: 2 };
    const frames = portedCreateFrames(TEXT, options);
    expect(frames).toHaveLength(3);
    expect(new Set(frames).size).toBe(3);
    expect(new Set(frames.map(plain))).toEqual(new Set([TEXT]));
    expect(frames).toEqual(
      [1, 2, 3].map((step) => portedRender(TEXT, { seed: 5 + step * 3, spread: 3 })),
    );
  });

  test('writeAnimatedLolcat writes the same frames to a TTY on both implementations', async () => {
    const ported = await captureAnimation(true);
    expect(ported[0]).toBe('\x1b[?25l\n\x1b[1A\x1b7');
    expect(ported.slice(-3)).toEqual(['\x1b8', '\x1b[1B', '\n\x1b[0m\x1b[?25h']);
    expect(ported).toHaveLength(11);
    for (const frame of ported.slice(1, -3)) {
      expect(frame, frame).toStartWith(BEGIN_SYNC);
      expect(frame, frame).toEndWith(END_SYNC);
    }
  });

  test('an aborted signal stops both implementations before the first frame', async () => {
    const ported = await captureAnimation(true, AbortSignal.abort());
    expect(ported).toHaveLength(5);
    expect(plain(ported[1] ?? '')).toBe(`${BEGIN_SYNC}\x1b8ab\x1b8\x1b[1Bcd${END_SYNC}`);
    expect(ported.at(-1)).toBe('\n\x1b[0m\x1b[?25h');
  });

  test('a non-TTY sink receives the same bytes as a TTY on both implementations', async () => {
    const ported = await captureAnimation(false);
    expect(ported).toEqual(await captureAnimation(true));
  });
});
