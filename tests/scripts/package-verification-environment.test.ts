import { describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import {
  getPackageVerificationEnv,
  requiresPackedModeVerification,
} from '../../scripts/verify-package';
import { withTempDir } from '../helpers';

describe('package verification environment', () => {
  test('skips Unix tar mode enforcement only on Windows', () => {
    expect(requiresPackedModeVerification('win32')).toBeFalse();
    expect(requiresPackedModeVerification('linux')).toBeTrue();
    expect(requiresPackedModeVerification('darwin')).toBeTrue();
  });

  test('isolates packaged hook homes and audit logs from the caller', async () => {
    await withTempDir('cc-safety-net-package-env-', (directory) => {
      const env = getPackageVerificationEnv(directory);

      expect(env.HOME).toBe(join(directory, 'home'));
      expect(env.USERPROFILE).toBe(join(directory, 'home'));
      expect(env.CC_SAFETY_NET_HOME).toBe(join(directory, '.cc-safety-net'));
      expect(env.CC_SAFETY_NET_AUDIT_HOME).toBe(join(directory, 'audit-home'));
      expect(env.CC_SAFETY_NET_AUDIT_HOME).not.toBe(process.env.CC_SAFETY_NET_AUDIT_HOME);
      const pathKey = Object.keys(process.env).find((key) => key.toLowerCase() === 'path');
      expect(pathKey).toBeDefined();
      if (!pathKey) throw new Error('Expected the process environment to contain PATH');
      expect(env[pathKey]).toBe(process.env[pathKey]);
    });
  });
});
