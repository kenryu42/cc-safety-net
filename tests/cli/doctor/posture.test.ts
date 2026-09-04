import { describe, expect, test } from 'bun:test';
import { chmodSync, mkdirSync, statSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { getDoctorPosture } from '@/cli/doctor/posture';
import { withEnv, withTempDir } from '../../helpers.ts';

describe('getDoctorPosture', () => {
  // Windows does not expose Unix ownership or mode-bit integrity through chmod/stat.
  test.skipIf(process.platform === 'win32')(
    'collects directory integrity facts without changing permissions',
    async () => {
      await withTempDir('doctor-posture-', (home) =>
        withEnv({ HOME: home }, () => {
          const policy = join(home, '.cc-safety-net');
          const config = join(policy, 'rules');
          const audit = join(policy, 'logs');
          mkdirSync(config, { recursive: true });
          mkdirSync(audit);
          chmodSync(policy, 0o700);
          chmodSync(config, 0o770);
          chmodSync(audit, 0o700);

          const before = statSync(config).mode & 0o777;
          const posture = getDoctorPosture(join(config, 'rule.json'));

          expect(posture.directories).toEqual([
            { kind: 'policy', path: policy, status: 'safe', issues: [] },
            {
              kind: 'config',
              path: config,
              status: 'unsafe',
              issues: ['permissions'],
            },
            { kind: 'audit', path: audit, status: 'safe', issues: [] },
          ]);
          expect(statSync(config).mode & 0o777).toBe(before);
        }),
      );
    },
  );

  test('reports symlinks and missing directories as facts', async () => {
    await withTempDir('doctor-posture-', (home) =>
      withEnv({ HOME: home }, () => {
        const policy = join(home, '.cc-safety-net');
        const config = join(policy, 'rules');
        const target = join(home, 'audit-target');
        mkdirSync(policy, { mode: 0o700 });
        mkdirSync(target, { mode: 0o700 });
        symlinkSync(target, join(policy, 'logs'), 'dir');

        expect(getDoctorPosture(join(config, 'rule.json')).directories).toEqual([
          {
            kind: 'policy',
            path: policy,
            status: process.platform === 'win32' ? 'unknown' : 'safe',
            issues: [],
          },
          { kind: 'config', path: config, status: 'not-applicable', issues: [] },
          {
            kind: 'audit',
            path: join(policy, 'logs'),
            status: 'unsafe',
            issues: ['symlink'],
          },
        ]);
      }),
    );
  });
});
