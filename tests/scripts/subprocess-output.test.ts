import { describe, expect, test } from 'bun:test';
import { formatSubprocessFailure } from '../../scripts/subprocess-output';

describe('subprocess output formatting', () => {
  test('includes stdout and stderr when a build subprocess fails', () => {
    expect(
      formatSubprocessFailure('build:types', {
        stdout: Buffer.from('type output'),
        stderr: Buffer.from('type error'),
      }),
    ).toBe('build:types failed\nstdout:\ntype output\nstderr:\ntype error');
  });

  test('omits empty streams from build subprocess failure output', () => {
    expect(
      formatSubprocessFailure('build:schema', {
        stdout: Buffer.from(''),
        stderr: Buffer.from('schema error'),
      }),
    ).toBe('build:schema failed\nstderr:\nschema error');
  });
});
