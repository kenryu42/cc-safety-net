import { describe, expect, test } from 'bun:test';
import { getBundledOutputs, isPublicDeclarationOutput } from '../../scripts/build-output';

describe('getBundledOutputs', () => {
  test('finds bundled outputs with Windows paths', () => {
    const outputs = getBundledOutputs([
      { path: 'C:\\a\\cc-safety-net\\cc-safety-net\\dist\\index.js', size: 1000 },
      { path: 'C:\\a\\cc-safety-net\\cc-safety-net\\dist\\cli.js', size: 2000 },
      { path: 'C:\\a\\cc-safety-net\\cc-safety-net\\dist\\pi.js', size: 3000 },
    ]);

    expect(outputs.indexOutput?.size).toBe(1000);
    expect(outputs.cliOutput?.size).toBe(2000);
    expect(outputs.piOutput?.size).toBe(3000);
  });

  test('keeps both public declarations with Windows paths', () => {
    expect(isPublicDeclarationOutput('dist\\entries\\index.d.ts')).toBeTrue();
    expect(isPublicDeclarationOutput('dist\\entries\\api.d.ts')).toBeTrue();
    expect(isPublicDeclarationOutput('dist\\api.d.ts')).toBeFalse();
    expect(isPublicDeclarationOutput('dist\\entries\\pi.d.ts')).toBeFalse();
  });
});
