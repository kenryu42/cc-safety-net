import type { Environment } from '@/core/environment';
import { getUserPolicyPath, type UserScopeOptions } from './paths';
import { readPolicyFile } from './store';

export function readRetentionDays(
  environment: Environment,
  options: UserScopeOptions = {},
): number {
  return readPolicyFile(getUserPolicyPath(environment, options), environment.home).policy.audit
    .retention_days;
}
