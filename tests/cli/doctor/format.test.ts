import { afterEach, expect, test } from 'bun:test';
import { getActivitySummary } from '@/cli/doctor/activity';
import { getEnvironmentInfo } from '@/cli/doctor/environment';
import {
  formatActivitySection,
  formatEngineSelfTestSection,
  formatEnvironmentSection,
  formatFindingsSection,
  formatHooksSection,
  formatSystemInfoSection,
  formatUpdateSection,
} from '@/cli/doctor/format';
import {
  createTempRoot,
  environmentFor,
  isolationEnv,
  removeTempRoots,
} from '../../helpers/temp-home';

afterEach(removeTempRoots);

test('engine failures show the mismatched verdict and failing command', () => {
  const text = formatEngineSelfTestSection({
    passed: 0,
    failed: 1,
    total: 1,
    results: [
      {
        command: 'git reset --hard',
        description: 'hard reset',
        expected: 'blocked',
        actual: 'allowed',
        passed: false,
      },
    ],
  });
  expect(text).toContain('0/1 FAIL');
  expect(text).toContain('hard reset');
  expect(text).toContain('expected blocked, got allowed');
});

test('system info distinguishes available versions from missing programs', () => {
  const text = formatSystemInfoSection({
    version: '2.3.4',
    versions: { cursor: '1.2.3' },
    codexPluginListOutput: null,
    ampPluginListOutput: null,
    nodeVersion: '22.0.0',
    npmVersion: null,
    bunVersion: '1.4.2',
    platform: 'linux x64',
  });
  expect(text).toMatch(/Cursor\s+│ 1\.2\.3/);
  expect(text).toMatch(/Node\.js\s+│ 22\.0\.0/);
  expect(text).toMatch(/npm\s+│ not found/);
  expect(text).toContain('linux x64');
});

test('finding text renders terminal control characters literally', () => {
  const text = formatFindingsSection([
    {
      checkId: 'config.user-invalid',
      severity: 'error',
      title: 'invalid\x1b[2J',
      detail: 'line\nforged',
      path: '/tmp/\rpolicy',
      fixHint: 'remove\tfile',
    },
  ]);
  expect(text).toContain('[ERROR] config.user-invalid: invalid\\x1b[2J');
  expect(text).toContain('line\\x0aforged');
  expect(text).toContain('Path: /tmp/\\x0dpolicy');
  expect(text).toContain('Fix: remove\\x09file');
  expect(text).not.toContain('\x1b[2J');
});

test('failed hook inspection distinguishes configured warnings from unconfigured errors', () => {
  const text = formatHooksSection([
    {
      platform: 'cursor',
      detected: true,
      configured: true,
      inspectionStatus: 'failed',
      errors: ['cannot inspect hook'],
    },
    {
      platform: 'codex',
      detected: false,
      configured: false,
      inspectionStatus: 'failed',
      errors: ['cannot read config'],
    },
    { platform: 'amp', detected: false, configured: false, inspectionStatus: 'not-inspected' },
  ]);
  expect(text).toContain('Warning (Cursor): cannot inspect hook');
  expect(text).toContain('Error (Codex): cannot read config');
  expect(text).toContain('Not inspected');
  expect(text).toContain('Unknown');
});

test('an empty local audit tree reports no denials', () => {
  const home = createTempRoot('doctor-activity-');
  const summary = getActivitySummary(environmentFor(home, isolationEnv(home)));
  expect(summary.totalBlocked).toBe(0);
  expect(formatActivitySection(summary)).toContain('No blocked commands in the last 7 days');
});

test('activity display marks unreadable sources and flattens multiline commands', () => {
  const text = formatActivitySection({
    totalBlocked: 1,
    sessionCount: 1,
    unreadable: 1,
    recentEntries: [
      {
        timestamp: '2026-01-01T00:00:00Z',
        relativeTime: '1h ago',
        command: 'git\treset\n--hard\x1b[2J',
        reason: 'discard',
      },
    ],
  });
  expect(text).toContain('1 blocked / 1 sessions');
  expect(text).toContain('git reset ↵ --hard\\x1b[2J');
  expect(text).toContain('1 audit log source could not be read; this summary is incomplete');
});

test('environment output identifies an active legacy flag', () => {
  const home = createTempRoot('doctor-env-');
  const text = formatEnvironmentSection(
    getEnvironmentInfo(environmentFor(home, isolationEnv(home, { SAFETY_NET_STRICT: '1' }))),
  );
  expect(text).toMatch(/CC_SAFETY_NET_STRICT\s+│ ✓\s+│ SAFETY_NET_STRICT ✓/);
  expect(text).toMatch(/CC_SAFETY_NET_PARANOID\s+│ ✗/);
});

test.each([
  [{ currentVersion: '1.0.0', latestVersion: null, updateAvailable: false }, 'Skipped'],
  [
    {
      currentVersion: '1.0.0',
      latestVersion: null,
      updateAvailable: false,
      error: 'registry unavailable',
    },
    'registry unavailable',
  ],
  [
    { currentVersion: '1.0.0', latestVersion: '2.0.0', updateAvailable: true },
    'Run: bunx cc-safety-net@latest doctor',
  ],
  [{ currentVersion: '1.0.0', latestVersion: '1.0.0', updateAvailable: false }, 'Up to date'],
])('update display distinguishes the result %j', (update, expected) => {
  const text = formatUpdateSection(update);
  expect(text).toContain(expected);
  expect(text).toContain('1.0.0');
  expect(text.includes('Run:')).toBe(update.updateAvailable);
});
