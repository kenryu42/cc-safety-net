import { describe, expect, test } from 'bun:test';
import {
  GIT_CONFIG_AFFECTING_ENV_NAMES,
  GIT_CONTEXT_ENV_OVERRIDES,
  hasConfigAffectingEnvAssignment,
  isGitConfigEnvName,
  isGitContextEnvOverrideName,
  isTrackedGitEnvName,
  parseGitContextAppendEnvAssignment,
} from '@/core/git/env';

describe('git env helpers', () => {
  test('identifies Git context env override names', () => {
    expect(GIT_CONTEXT_ENV_OVERRIDES).toEqual([
      'GIT_DIR',
      'GIT_WORK_TREE',
      'GIT_COMMON_DIR',
      'GIT_INDEX_FILE',
    ]);
    expect(isGitContextEnvOverrideName('GIT_DIR')).toBe(true);
    expect(isGitContextEnvOverrideName('GIT_WORK_TREE')).toBe(true);
    expect(isGitContextEnvOverrideName('GIT_COMMON_DIR')).toBe(true);
    expect(isGitContextEnvOverrideName('GIT_INDEX_FILE')).toBe(true);
    expect(isGitContextEnvOverrideName('GIT_CONFIG_COUNT')).toBe(false);
  });

  test('identifies Git config affecting env names', () => {
    expect(GIT_CONFIG_AFFECTING_ENV_NAMES.has('GIT_CONFIG_GLOBAL')).toBe(true);
    expect(GIT_CONFIG_AFFECTING_ENV_NAMES.has('GIT_CONFIG_NOSYSTEM')).toBe(true);
    expect(GIT_CONFIG_AFFECTING_ENV_NAMES.has('GIT_CONFIG_SYSTEM')).toBe(true);
    expect(GIT_CONFIG_AFFECTING_ENV_NAMES.has('HOME')).toBe(true);
    expect(GIT_CONFIG_AFFECTING_ENV_NAMES.has('XDG_CONFIG_HOME')).toBe(true);
  });

  test('identifies Git config env names', () => {
    expect(isGitConfigEnvName('GIT_CONFIG_COUNT')).toBe(true);
    expect(isGitConfigEnvName('GIT_CONFIG_PARAMETERS')).toBe(true);
    expect(isGitConfigEnvName('GIT_CONFIG_KEY_0')).toBe(true);
    expect(isGitConfigEnvName('GIT_CONFIG_VALUE_0')).toBe(true);
    expect(isGitConfigEnvName('GIT_CONFIG_KEY_X')).toBe(false);
  });

  test('tracks all Git env names that affect analysis', () => {
    expect(isTrackedGitEnvName('GIT_DIR')).toBe(true);
    expect(isTrackedGitEnvName('GIT_SSH_COMMAND')).toBe(true);
    expect(isTrackedGitEnvName('GIT_SSH')).toBe(true);
    expect(isTrackedGitEnvName('GIT_SSH_VARIANT')).toBe(true);
    expect(isTrackedGitEnvName('GIT_CONFIG_GLOBAL')).toBe(true);
    expect(isTrackedGitEnvName('GIT_CONFIG_VALUE_0')).toBe(true);
    expect(isTrackedGitEnvName('PATH')).toBe(false);
  });

  test('parses append assignments for tracked Git env names', () => {
    expect(parseGitContextAppendEnvAssignment('GIT_CONFIG_COUNT+=1')).toEqual({
      name: 'GIT_CONFIG_COUNT',
      value: '1',
    });
    expect(parseGitContextAppendEnvAssignment('GIT_DIR+=/tmp/repo/.git')).toEqual({
      name: 'GIT_DIR',
      value: '/tmp/repo/.git',
    });
  });

  test('rejects append assignments for untracked names', () => {
    expect(parseGitContextAppendEnvAssignment('PATH+=:/tmp/bin')).toBeNull();
    expect(parseGitContextAppendEnvAssignment('GIT_CONFIG_KEY_X+=submodule.recurse')).toBeNull();
  });

  test('detects config-affecting env assignments', () => {
    expect(hasConfigAffectingEnvAssignment(new Map([['HOME', '/tmp/home']]))).toBe(true);
    expect(hasConfigAffectingEnvAssignment(new Map([['GIT_CONFIG_COUNT', '1']]))).toBe(false);
    expect(hasConfigAffectingEnvAssignment(undefined)).toBe(false);
  });
});
