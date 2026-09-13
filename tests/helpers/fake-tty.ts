import { EventEmitter } from 'node:events';

export function createFakeInput({ isTTY = true }: { isTTY?: boolean } = {}) {
  const rawModeCalls: boolean[] = [];
  const streamCalls: string[] = [];
  const emitter = new EventEmitter();
  const input = Object.assign(emitter, {
    isTTY,
    isRaw: false,
    readableFlowing: null,
    rawModeCalls,
    streamCalls,
    setRawMode: (flag: boolean) => {
      rawModeCalls.push(flag);
      input.isRaw = flag;
      return input;
    },
    resume: () => {
      streamCalls.push('resume');
      return input;
    },
    pause: () => {
      streamCalls.push('pause');
      return input;
    },
    press: (name: string, value = '', ctrl = false) =>
      emitter.emit('keypress', value, { name, ctrl }),
  });
  return input;
}

export function createFakeOutput({ isTTY }: { isTTY: boolean }) {
  const chunks: string[] = [];
  return {
    isTTY,
    chunks,
    write: (chunk: string) => {
      chunks.push(chunk);
      return true;
    },
    text: () => chunks.join(''),
  };
}

export function withStdoutTTY<T>(isTTY: boolean, run: () => T): T {
  const previous = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY');
  Object.defineProperty(process.stdout, 'isTTY', { value: isTTY, configurable: true });
  try {
    return run();
  } finally {
    if (previous) Object.defineProperty(process.stdout, 'isTTY', previous);
    else Reflect.deleteProperty(process.stdout, 'isTTY');
  }
}
