import { spyOn } from 'bun:test';

export async function captureConsole<T>(run: () => T | Promise<T>) {
  const log: string[] = [];
  const error: string[] = [];
  const spies = [
    spyOn(console, 'log').mockImplementation((...parts: unknown[]) => {
      log.push(parts.map(String).join(' '));
    }),
    spyOn(console, 'error').mockImplementation((...parts: unknown[]) => {
      error.push(parts.map(String).join(' '));
    }),
  ];
  try {
    return { returned: await run(), log, error };
  } finally {
    for (const spy of spies) spy.mockRestore();
  }
}
