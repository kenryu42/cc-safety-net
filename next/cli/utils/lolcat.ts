/*
 * Rainbow rendering and animation behavior originally ported from lolcat:
 * https://github.com/busyloop/lolcat
 *
 * Copyright (c) 2016, moe@busyloop.net
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the lolcat nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

export type LolcatOutput = {
  readonly isTTY?: boolean;
  write(chunk: string): unknown;
};

export type LolcatSleep = (milliseconds: number) => Promise<void>;

/** @internal Exported for deterministic renderer tests. */
export type LolcatRenderOptions = {
  frequency?: number;
  seed?: number;
  spread?: number;
};

export type LolcatAnimationOptions = LolcatRenderOptions & {
  duration?: number;
  frameRate?: number;
  output?: LolcatOutput;
  signal?: AbortSignal;
  sleep?: LolcatSleep;
  speed?: number;
};

type Rgb = {
  blue: number;
  green: number;
  red: number;
};

type FrameCell = Rgb & {
  bold: boolean;
  character: string;
};

const ANSI_RESET = '\x1b[0m';
const ANSI_RESET_FOREGROUND = '\x1b[39m';
const BOLD_OFF = '\x1b[22m';
const BOLD_ON = '\x1b[1m';
const DEFAULT_DURATION = 12;
const DEFAULT_FRAME_RATE = 60;
const DEFAULT_FREQUENCY = 0.1;
const DEFAULT_SPEED = 40;
const DEFAULT_SPREAD = 3;
const CURSOR_DOWN = (rows: number) => `\x1b[${rows}B`;
const CURSOR_UP = (rows: number) => `\x1b[${rows}A`;
const HIDE_CURSOR = '\x1b[?25l';
const RESTORE_CURSOR = '\x1b8';
const SAVE_CURSOR = '\x1b7';
const SHOW_CURSOR = '\x1b[?25h';

// Synchronized output (DEC private mode 2026): terminals that support it (kitty, WezTerm,
// foot, Ghostty, iTerm2, Alacritty) buffer each frame and swap it atomically, eliminating
// tearing. ECMA-48 requires unsupported terminals to ignore unknown private modes.
const SYNC_BEGIN = '\x1b[?2026h';
const SYNC_END = '\x1b[?2026l';

// OKLCH rainbow: constant lightness and chroma keep luminance perceptually flat while the
// hue rotates, avoiding the loud yellow/cyan spikes of phased-sine rainbows.
const RAINBOW_CHROMA = 0.15;
const RAINBOW_LIGHTNESS = 0.72;

// Wavefront choreography: the front sweeps left to right on a smootherstep curve. Cells in a
// window around it flicker through scramble glyphs before settling, and a Gaussian glow with
// a bold peak rides the front like an energy beam.
const GLOW_AMPLITUDE = 0.8;
const GLOW_BOLD_THRESHOLD = 0.3;
const GLOW_SIGMA = 2.5;
const REVEAL_PORTION = 0.75;
const SCRAMBLE_LEAD = 2;
const SCRAMBLE_POOL = ['░', '▒', '▓', '╱', '╲', '┃', '━', '┏', '┓', '┗', '┛', '╋'];
const SCRAMBLE_TRAIL = 4;
const SETTLE_FLASH_AMPLITUDE = 0.35;

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

function waitForAnimationFrame(
  milliseconds: number,
  sleep: LolcatSleep,
  signal: AbortSignal | undefined,
) {
  if (!signal) return sleep(milliseconds);
  if (signal.aborted) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    const cleanup = () => signal.removeEventListener('abort', onAbort);
    const onAbort = () => {
      cleanup();
      resolve();
    };

    signal.addEventListener('abort', onAbort, { once: true });
    sleep(milliseconds).then(
      () => {
        cleanup();
        resolve();
      },
      (error: unknown) => {
        cleanup();
        reject(error);
      },
    );
  });
}

function positiveOrDefault(value: number | undefined, fallback: number) {
  return value && value > 0 ? value : fallback;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function byte(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function linearToSrgb(value: number) {
  return value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
}

function oklchToSrgb(lightness: number, chroma: number, hueDegrees: number): Rgb {
  const hueRadians = (hueDegrees * Math.PI) / 180;
  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return {
    blue: byte(linearToSrgb(clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)) * 255),
    green: byte(
      linearToSrgb(clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)) * 255,
    ),
    red: byte(linearToSrgb(clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)) * 255),
  };
}

function rainbow(frequency: number, offset: number): Rgb {
  const hueDegrees = ((((offset * frequency * 180) / Math.PI) % 360) + 360) % 360;
  return oklchToSrgb(RAINBOW_LIGHTNESS, RAINBOW_CHROMA, hueDegrees);
}

/** Truecolor escape for the rainbow at a given offset, for spinner accents. */
export function rainbowColorEscape(offset: number, frequency = DEFAULT_FREQUENCY) {
  const color = rainbow(frequency, offset);
  return `\x1b[38;2;${color.red};${color.green};${color.blue}m`;
}

function mixTowardWhite(color: Rgb, amount: number): Rgb {
  return {
    blue: byte(color.blue + (255 - color.blue) * amount),
    green: byte(color.green + (255 - color.green) * amount),
    red: byte(color.red + (255 - color.red) * amount),
  };
}

/** Deterministic per-cell noise so the animation is reproducible without Math.random. */
function hash01(a: number, b: number, c: number) {
  const mixed =
    Math.imul(a + 0x9e3779b9, 0x85ebca6b) ^
    Math.imul(b + 0xc2b2ae35, 0x27d4eb2f) ^
    Math.imul(c + 0x165667b1, 0x9e3779b1);
  const x1 = mixed ^ (mixed >>> 15);
  const x2 = Math.imul(x1, 0x2c1b3c6d);
  const x3 = x2 ^ (x2 >>> 12);
  const x4 = Math.imul(x3, 0x297a2d39);
  const x5 = x4 ^ (x4 >>> 15);
  return (x5 >>> 0) / 4294967296;
}

function scrambleGlyph(lineIndex: number, columnIndex: number, frame: number) {
  const index = Math.floor(hash01(lineIndex, columnIndex, frame) * SCRAMBLE_POOL.length);
  return SCRAMBLE_POOL[index] ?? '░';
}

/** Ken Perlin's smootherstep: C2-continuous, zero velocity and acceleration at both ends. */
function smootherstep(progress: number) {
  const t = clamp01(progress);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Emits SGR only when color or weight changes, instead of resetting every character. */
function buildLine(cells: readonly FrameCell[]) {
  if (cells.length === 0) return '';

  const parts: string[] = [];
  let activeBold = false;
  let activeColor = '';
  for (const cell of cells) {
    const color = `${cell.red};${cell.green};${cell.blue}`;
    if (cell.bold !== activeBold) {
      parts.push(cell.bold ? BOLD_ON : BOLD_OFF);
      activeBold = cell.bold;
    }
    if (color !== activeColor) {
      parts.push(`\x1b[38;2;${color}m`);
      activeColor = color;
    }
    parts.push(cell.character);
  }
  return `${parts.join('')}${BOLD_OFF}${ANSI_RESET_FOREGROUND}`;
}

function settledLineCells(
  line: readonly string[],
  lineIndex: number,
  frequency: number,
  seed: number,
  spread: number,
): FrameCell[] {
  return line.map((character, columnIndex) => ({
    ...rainbow(frequency, seed + lineIndex + columnIndex / spread),
    bold: false,
    character,
  }));
}

function wavefrontLineCells(
  line: readonly string[],
  lineIndex: number,
  frame: number,
  frameCount: number,
  width: number,
  frequency: number,
  seed: number,
  spread: number,
): FrameCell[] {
  const revealFrames = Math.max(1, frameCount * REVEAL_PORTION);
  const revealProgress = Math.min(1, frame / revealFrames);
  const front = width * smootherstep(revealProgress);
  const settleProgress = Math.max(
    0,
    (frame - revealFrames) / Math.max(1, frameCount - revealFrames),
  );
  const seedOffset = (1 - smootherstep(frame / frameCount)) * spread * 2;
  const settleFlash = SETTLE_FLASH_AMPLITUDE * Math.max(0, 1 - settleProgress * 2);
  const revealed = revealProgress >= 1;
  const cutoff = Math.min(line.length, Math.ceil(front + SCRAMBLE_LEAD + 1));

  return line.slice(0, cutoff).map((character, columnIndex) => {
    const base = rainbow(frequency, seed + lineIndex + columnIndex / spread + seedOffset);
    // Per-cell jitter gives the wavefront an organic, non-straight edge.
    const position = columnIndex + hash01(lineIndex, columnIndex, 7919) * 2 - 1;
    if (position > front + SCRAMBLE_LEAD) {
      return { ...base, bold: false, character: ' ' };
    }

    const distance = front - position;
    const glow = GLOW_AMPLITUDE * Math.exp(-(distance * distance) / (2 * GLOW_SIGMA ** 2));
    const boost = Math.min(0.9, glow + settleFlash);
    const scrambling = !revealed && position > front - SCRAMBLE_TRAIL;
    return {
      ...mixTowardWhite(base, boost),
      bold: boost > GLOW_BOLD_THRESHOLD,
      character: scrambling ? scrambleGlyph(lineIndex, columnIndex, frame) : character,
    };
  });
}

function buildFrame(cellsPerLine: readonly (readonly FrameCell[])[]) {
  return `${SYNC_BEGIN}${cellsPerLine
    .map(
      (cells, lineIndex) =>
        `${RESTORE_CURSOR}${lineIndex > 0 ? CURSOR_DOWN(lineIndex) : ''}${buildLine(cells)}`,
    )
    .join('')}${SYNC_END}`;
}

/** @internal Exported for deterministic renderer tests. */
export function renderLolcat(text: string, options: LolcatRenderOptions = {}) {
  if (!text) return '';

  const frequency = positiveOrDefault(options.frequency, DEFAULT_FREQUENCY);
  const seed = options.seed ?? 0;
  const spread = positiveOrDefault(options.spread, DEFAULT_SPREAD);

  return `${text
    .split('\n')
    .map((line, lineIndex) =>
      buildLine(settledLineCells(Array.from(line), lineIndex, frequency, seed, spread)),
    )
    .join('\n')}${ANSI_RESET}`;
}

/** @internal Exported for deterministic animation tests. */
export function createLolcatAnimationFrames(text: string, options: LolcatAnimationOptions = {}) {
  const duration = Math.max(1, Math.floor(positiveOrDefault(options.duration, DEFAULT_DURATION)));
  const spread = positiveOrDefault(options.spread, DEFAULT_SPREAD);

  return Array.from({ length: duration }, (_value, index) =>
    renderLolcat(text, {
      frequency: options.frequency,
      seed: (options.seed ?? 0) + (index + 1) * spread,
      spread,
    }),
  );
}

export async function writeAnimatedLolcat(text: string, options: LolcatAnimationOptions = {}) {
  if (!text) return;

  const output = options.output ?? process.stdout;
  const sleep = options.sleep ?? wait;
  const frequency = positiveOrDefault(options.frequency, DEFAULT_FREQUENCY);
  const seed = options.seed ?? 0;
  const speed = positiveOrDefault(options.speed, DEFAULT_SPEED);
  const spread = positiveOrDefault(options.spread, DEFAULT_SPREAD);
  const frameRate = positiveOrDefault(options.frameRate, DEFAULT_FRAME_RATE);
  const duration = Math.max(1, Math.floor(positiveOrDefault(options.duration, DEFAULT_DURATION)));
  const lines = text.split('\n').map((line) => Array.from(line));
  const width = Math.max(...lines.map((line) => line.length));
  const totalDuration = (1000 * duration * lines.filter((line) => line.length > 0).length) / speed;
  const frameCount = width > 0 ? Math.max(1, Math.ceil(totalDuration / (1000 / frameRate))) : 0;
  const frameDelay = frameCount > 0 ? totalDuration / frameCount : 0;

  output.write(
    `${HIDE_CURSOR}${lines.length > 1 ? `${'\n'.repeat(lines.length - 1)}${CURSOR_UP(lines.length - 1)}` : ''}${SAVE_CURSOR}`,
  );

  try {
    for (let frame = 1; frame <= frameCount; frame += 1) {
      if (options.signal?.aborted) break;
      output.write(
        buildFrame(
          lines.map((line, lineIndex) =>
            wavefrontLineCells(line, lineIndex, frame, frameCount, width, frequency, seed, spread),
          ),
        ),
      );
      await waitForAnimationFrame(frameDelay, sleep, options.signal);
    }
  } finally {
    output.write(
      buildFrame(
        lines.map((line, lineIndex) => settledLineCells(line, lineIndex, frequency, seed, spread)),
      ),
    );
    output.write(RESTORE_CURSOR);
    if (lines.length > 1) output.write(CURSOR_DOWN(lines.length - 1));
    output.write(`\n${ANSI_RESET}${SHOW_CURSOR}`);
  }
}
