/**
 * Environment variable checking for the doctor command.
 */

import type { EnvVarInfo } from '@/bin/doctor/types';
import { ENV_FLAGS, type EnvFlag, envFlagIsSet, getEnvFlagValue } from '@/core/env';

const ENV_VARS: Array<{
  flag: EnvFlag;
  description: string;
  defaultBehavior: string;
}> = [
  {
    flag: ENV_FLAGS.strict,
    description: 'Fail-closed on unparseable commands',
    defaultBehavior: 'permissive',
  },
  {
    flag: ENV_FLAGS.paranoid,
    description: 'Enable all paranoid checks',
    defaultBehavior: 'off',
  },
  {
    flag: ENV_FLAGS.paranoidRm,
    description: 'Block rm -rf even within cwd',
    defaultBehavior: 'off',
  },
  {
    flag: ENV_FLAGS.paranoidInterpreters,
    description: 'Block interpreter one-liners',
    defaultBehavior: 'off',
  },
  {
    flag: ENV_FLAGS.worktree,
    description: 'Allow local git discards in linked worktrees',
    defaultBehavior: 'off',
  },
  {
    flag: ENV_FLAGS.debug,
    description: 'Log allowed hook commands for debugging',
    defaultBehavior: 'off',
  },
];

export function getEnvironmentInfo(): EnvVarInfo[] {
  return [
    ...ENV_VARS.map((v) => ({
      name: v.flag.name,
      value: getEnvFlagValue(v.flag),
      isSet: envFlagIsSet(v.flag),
      legacyName: v.flag.legacyName,
      legacyValue: v.flag.legacyName ? process.env[v.flag.legacyName] : undefined,
      legacyIsSet: v.flag.legacyName ? process.env[v.flag.legacyName] !== undefined : undefined,
      description: v.description,
      defaultBehavior: v.defaultBehavior,
    })),
    {
      name: 'CC_SAFETY_NET_HOME',
      value: process.env.CC_SAFETY_NET_HOME,
      isSet: process.env.CC_SAFETY_NET_HOME !== undefined,
      description: 'Override user-scope config/cache directory',
      defaultBehavior: '~/.cc-safety-net',
    },
  ];
}
