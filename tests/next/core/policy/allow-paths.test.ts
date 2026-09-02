import { describe, expect, test } from 'bun:test';
import { homedir } from 'node:os';
import { dirname } from 'node:path';
import {
  expandAllowPathHome,
  getAllowPathHomeConflictError,
  getDestructiveAllowPathError,
  getSecretAllowPathError,
  getSecretDenyPathError,
} from '@next/core/policy/allow-paths';
import {
  expandAllowPathHome as shippedExpandAllowPathHome,
  getAllowPathHomeConflictError as shippedGetAllowPathHomeConflictError,
  getDestructiveAllowPathError as shippedGetDestructiveAllowPathError,
  getSecretAllowPathError as shippedGetSecretAllowPathError,
  getSecretDenyPathError as shippedGetSecretDenyPathError,
} from '@/policy/allow-paths';

const HOMES = [homedir(), '/srv/home/tester', '/srv/home/tester/'];

const VALUES: readonly unknown[] = [
  ' ',
  '',
  42,
  null,
  'rel/path',
  '~',
  '~/',
  '~/scratch',
  '$HOME',
  '${HOME}',
  '$HOME/..',
  '$HOME/x',
  '/',
  '/opt/x',
  homedir(),
  `${homedir()}/`,
  dirname(homedir()),
  `${homedir()}/.cc-safety-net`,
  `${homedir()}/.cc-safety-net/policy.json`,
  '~/.cc-safety-net',
  '**',
  'apps/*/.env',
  '.env.v?',
  '~/**/.ssh/config',
];

describe('allow path validators parity', () => {
  for (const home of HOMES) {
    test(`unknown values against ${home}`, () => {
      expect(
        VALUES.map((value) => ({
          destructive: getDestructiveAllowPathError(value, home),
          secretDeny: getSecretDenyPathError(value, home),
          secretAllow: getSecretAllowPathError(value, home),
        })),
      ).toStrictEqual(
        VALUES.map((value) => ({
          destructive: shippedGetDestructiveAllowPathError(value, home),
          secretDeny: shippedGetSecretDenyPathError(value, home),
          secretAllow: shippedGetSecretAllowPathError(value, home),
        })),
      );
    });

    test(`path strings against ${home}`, () => {
      const strings = VALUES.filter((value): value is string => typeof value === 'string');
      expect(
        strings.map((value) => ({
          expanded: expandAllowPathHome(value, home),
          conflict: getAllowPathHomeConflictError(value, home),
        })),
      ).toStrictEqual(
        strings.map((value) => ({
          expanded: shippedExpandAllowPathHome(value, home),
          conflict: shippedGetAllowPathHomeConflictError(value, home),
        })),
      );
    });
  }
});
