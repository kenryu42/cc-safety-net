import { describe, expect, test } from 'bun:test';
import { getBundledOutputs } from '../../scripts/build-output';

describe('getBundledOutputs', () => {
  test('finds bundled outputs with Windows paths', () => {
    const outputs = getBundledOutputs([
      { path: 'C:\\a\\cc-safety-net\\cc-safety-net\\dist\\index.js', size: 1000 },
      { path: 'C:\\a\\cc-safety-net\\cc-safety-net\\dist\\bin\\cc-safety-net.js', size: 2000 },
      { path: 'C:\\a\\cc-safety-net\\cc-safety-net\\dist\\pi\\index.js', size: 3000 },
    ]);

    expect(outputs.indexOutput?.size).toBe(1000);
    expect(outputs.binOutput?.size).toBe(2000);
    expect(outputs.piOutput?.size).toBe(3000);
  });
});
