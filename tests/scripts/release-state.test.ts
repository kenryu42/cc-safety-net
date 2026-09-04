import { describe, expect, test } from 'bun:test';
import { assertReleaseVersion, classifyReleaseState } from '../../scripts/release-state';

describe('release state', () => {
  test('accepts stable semantic versions only', () => {
    expect(assertReleaseVersion('2.0.0')).toBe('2.0.0');
    expect(() => assertReleaseVersion('v2.0.0')).toThrow('stable semantic version');
    expect(() => assertReleaseVersion('2.0.0-beta.1')).toThrow('stable semantic version');
    expect(() => assertReleaseVersion('2.0')).toThrow('stable semantic version');
  });

  test('starts a release only when the version and tag are new', () => {
    expect(
      classifyReleaseState({
        requestedVersion: '2.0.0',
        packageVersion: '1.0.6',
        pluginVersion: '1.0.6',
        codexVersion: '1.0.6',
        kimiVersion: '1.0.6',
        headCommit: 'base',
        tagCommit: null,
        npmCommit: null,
      }),
    ).toEqual({ kind: 'prepare' });
  });

  test('resumes only the same immutable tag and commit', () => {
    expect(
      classifyReleaseState({
        requestedVersion: '2.0.0',
        packageVersion: '2.0.0',
        pluginVersion: '2.0.0',
        codexVersion: '2.0.0',
        kimiVersion: '2.0.0',
        headCommit: 'release',
        tagCommit: 'release',
        npmCommit: null,
      }),
    ).toEqual({ kind: 'resume', commit: 'release' });
  });

  test('rejects mismatched versions and mutable tag targets', () => {
    const matchingRelease = {
      requestedVersion: '2.0.0',
      packageVersion: '2.0.0',
      pluginVersion: '2.0.0',
      codexVersion: '2.0.0',
      kimiVersion: '2.0.0',
      headCommit: 'release',
      tagCommit: 'release',
      npmCommit: null,
    };
    expect(() =>
      classifyReleaseState({
        ...matchingRelease,
        pluginVersion: '1.9.0',
        kimiVersion: '1.9.0',
      }),
    ).toThrow('version files disagree');
    expect(() =>
      classifyReleaseState({
        ...matchingRelease,
        kimiVersion: '1.9.0',
      }),
    ).toThrow('version files disagree');
    expect(() =>
      classifyReleaseState({
        ...matchingRelease,
        codexVersion: '1.9.0',
      }),
    ).toThrow('version files disagree');
    expect(() =>
      classifyReleaseState({
        ...matchingRelease,
        headCommit: 'other',
      }),
    ).toThrow('immutable tag');
  });

  test('rejects an npm collision before a new tag can be created', () => {
    expect(() =>
      classifyReleaseState({
        requestedVersion: '2.0.0',
        packageVersion: '1.0.6',
        pluginVersion: '1.0.6',
        codexVersion: '1.0.6',
        kimiVersion: '1.0.6',
        headCommit: 'base',
        tagCommit: null,
        npmCommit: 'published-elsewhere',
      }),
    ).toThrow('npm version already exists');
  });

  test('rejects a recorded release version without its immutable tag', () => {
    expect(() =>
      classifyReleaseState({
        requestedVersion: '2.0.0',
        packageVersion: '2.0.0',
        pluginVersion: '2.0.0',
        codexVersion: '2.0.0',
        kimiVersion: '2.0.0',
        headCommit: 'release',
        tagCommit: null,
        npmCommit: null,
      }),
    ).toThrow('Release version is already recorded without its immutable tag');
  });

  test('rejects published package identity that differs from the immutable tag', () => {
    expect(() =>
      classifyReleaseState({
        requestedVersion: '2.0.0',
        packageVersion: '2.0.0',
        pluginVersion: '2.0.0',
        codexVersion: '2.0.0',
        kimiVersion: '2.0.0',
        headCommit: 'release',
        tagCommit: 'release',
        npmCommit: 'other',
      }),
    ).toThrow('Published package identity does not match the immutable tag');
  });

  test('accepts published resume only when npm, tag, and HEAD identify one commit', () => {
    expect(
      classifyReleaseState({
        requestedVersion: '2.0.0',
        packageVersion: '2.0.0',
        pluginVersion: '2.0.0',
        codexVersion: '2.0.0',
        kimiVersion: '2.0.0',
        headCommit: 'release',
        tagCommit: 'release',
        npmCommit: 'release',
      }),
    ).toEqual({ kind: 'published', commit: 'release' });
  });
});
