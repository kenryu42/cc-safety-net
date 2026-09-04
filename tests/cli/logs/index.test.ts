import { describe, expect, spyOn, test } from 'bun:test';
import * as fs from 'node:fs';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeAuditLog } from '@/engine/audit';
import type { AuditLogEntry } from '@/ir/audit';
import {
  mockReaddirError,
  withEnv,
  writeJsonlFixture,
  writeNestedAuditLogFixture,
} from '../../helpers';
import { writeDeniedLogFixture } from '../../helpers/denied-log-fixture';
import { captureLogsCommand } from '../../helpers/logs';

type LogsFixture = {
  cleanup: () => void;
  logsDir: string;
  projectA: string;
};

function createLogsFixture(): LogsFixture {
  const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-command-'));
  const logsDir = join(root, 'logs');
  const projectA = join(root, 'project-a');
  const projectB = join(root, 'project-b');
  const now = new Date();
  mkdirSync(logsDir, { recursive: true });
  writeNestedAuditLogFixture(logsDir, '-project-a', {
    ts: now.toISOString(),
    id: '1111111111111111',
    sessionId: 's1',
    decision: 'deny',
    agent: 'claude-code',
    level: 'strict',
    command: 'git reset --hard',
    segment: 'git reset --hard',
    reason: 'blocked',
    ruleId: 'git.reset-hard',
    failureStage: 'policy-protection',
    errorCode: 'path-canonicalization-limit',
    cwd: projectA,
  });
  writeNestedAuditLogFixture(logsDir, '-project-a', {
    ts: new Date(now.getTime() - 100).toISOString(),
    id: '2222222222222222',
    sessionId: 'allow-session',
    decision: 'allow',
    agent: 'claude-code',
    command: 'git status',
    segment: 'git status',
    reason: 'allowed',
    cwd: projectA,
  });
  writeNestedAuditLogFixture(logsDir, '-project-a', {
    ts: new Date(now.getTime() - 200).toISOString(),
    id: '3333333333333333',
    sessionId: 's2',
    decision: 'deny',
    agent: 'gemini-cli',
    command: 'cat .env',
    segment: '.env',
    reason: 'blocked',
    ruleId: 'secret.basename.env',
    cwd: join(projectA, 'subdir'),
  });
  writeJsonlFixture(join(logsDir, 'legacy-sess.jsonl'), [
    {
      ts: new Date(now.getTime() - 300).toISOString(),
      decision: 'deny',
      command: 'legacy blocked',
      segment: 'legacy blocked',
      reason: 'legacy',
      ruleId: 'legacy.rule',
      cwd: projectB,
    },
  ]);
  writeJsonlFixture(join(logsDir, 'old-sess.jsonl'), [
    {
      ts: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      id: '4444444444444444',
      decision: 'deny',
      sessionId: 'old-sess',
      command: 'old blocked',
      segment: 'old blocked',
      reason: 'old',
      ruleId: 'old.rule',
      cwd: projectB,
    },
  ]);
  return {
    cleanup: () => rmSync(root, { recursive: true, force: true }),
    logsDir,
    projectA,
  };
}

function writeControlLogFixture(logsDir: string, command: string, cwd: string): void {
  writeJsonlFixture(join(logsDir, 'controls.jsonl'), [
    {
      ts: new Date().toISOString(),
      decision: 'deny',
      agent: 'claude-code',
      command,
      segment: command,
      reason: 'blocked',
      ruleId: 'control.test',
      cwd,
    },
  ]);
}

function hasTerminalControlBytes(value: string): boolean {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || (code >= 0x7f && code <= 0x9f);
  });
}

describe('runLogsCommand', () => {
  test('reports unavailable audit storage without using a real log directory', async () => {
    await withEnv({ CC_SAFETY_NET_AUDIT_HOME: undefined, NODE_ENV: 'test' }, async () => {
      const human = await captureLogsCommand([]);
      const json = await captureLogsCommand(['--json']);
      const id = await captureLogsCommand(['--id', 'ffffffffffffffff']);

      expect(human).toEqual({
        exitCode: 0,
        stdout: 'No audit log entries found.',
        stderr: '',
      });
      expect(json).toEqual({ exitCode: 0, stdout: '[]', stderr: '' });
      expect(id).toEqual({
        exitCode: 0,
        stdout: 'No retained audit log entry found for id ffffffffffffffff.',
        stderr: '',
      });
    });
  });

  test('reads default logs from the configured audit home', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-command-default-'));
    const auditHome = join(root, 'audit-home');

    try {
      await withEnv({ CC_SAFETY_NET_AUDIT_HOME: auditHome }, async () => {
        writeAuditLog(
          'configured-home-session',
          'git reset --hard',
          'git reset --hard',
          'blocked',
          root,
        );

        const result = await captureLogsCommand(['--session', 'configured-home-session']);
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('git reset --hard');
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('prints blocked entries newest first by default', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand([], fixture.logsDir);
      const lines = result.stdout.split('\n');

      expect(result.exitCode).toBe(0);
      expect(lines.length).toBe(3);
      expect(lines[0]).toContain('git reset --hard');
      expect(lines[1]).toContain('↳ .env');
      expect(lines[2]).toContain('legacy blocked');
      expect(result.stdout).not.toContain('git status');
    } finally {
      fixture.cleanup();
    }
  });

  test('prints short timestamps in the user timezone for human output', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-command-timezone-'));
    const logsDir = join(root, 'logs');
    // Yesterday keeps the entry inside the default 30-day window; 01:42 UTC is
    // 10:42 in fixed-offset Asia/Tokyo on the same calendar day.
    const day = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const ts = `${day}T01:42:31.582Z`;
    try {
      mkdirSync(logsDir, { recursive: true });
      writeJsonlFixture(join(logsDir, 'timezone.jsonl'), [
        {
          ts,
          id: '9999999999999999',
          decision: 'deny',
          command: 'git reset --hard',
          segment: 'git reset --hard',
          reason: 'blocked',
        },
      ]);

      const table = await captureLogsCommand([], logsDir, 'Asia/Tokyo');
      const detail = await captureLogsCommand(['--id', '9999999999999999'], logsDir, 'Asia/Tokyo');
      const json = await captureLogsCommand(
        ['--id', '9999999999999999', '--json'],
        logsDir,
        'Asia/Tokyo',
      );

      expect(table.stdout).toContain(`${day} 10:42`);
      expect(detail.stdout).toContain(`ts:        ${day} 10:42`);
      expect((JSON.parse(json.stdout) as AuditLogEntry[])[0]?.ts).toBe(ts);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('prints readable entries when a nested child cannot be traversed', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-command-permissions-'));
    const logsDir = join(root, 'logs');
    const unreadableDir = join(logsDir, 'unreadable');

    try {
      mkdirSync(logsDir, { recursive: true });
      writeDeniedLogFixture(join(logsDir, 'readable.jsonl'), 'visible blocked');
      mkdirSync(unreadableDir);
      writeDeniedLogFixture(join(unreadableDir, 'hidden.jsonl'), 'hidden blocked');
      const spy = mockReaddirError(unreadableDir);

      try {
        const result = await captureLogsCommand([], logsDir);

        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('visible blocked');
        expect(result.stdout).not.toContain('hidden blocked');
      } finally {
        spy.mockRestore();
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('includes allow entries with --all', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--all'], fixture.logsDir);

      expect(result.stdout).toContain('git status');
    } finally {
      fixture.cleanup();
    }
  });

  test('limits output with --limit', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--limit', '1'], fixture.logsDir);

      expect(result.stdout.split('\n').length).toBe(1);
    } finally {
      fixture.cleanup();
    }
  });

  test('filters by recent days with --since', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--since', '7', '--all'], fixture.logsDir);

      expect(result.stdout).not.toContain('old blocked');
    } finally {
      fixture.cleanup();
    }
  });

  test('filters by agent', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--agent', 'claude-code'], fixture.logsDir);

      expect(result.stdout).toContain('git reset --hard');
      expect(result.stdout).not.toContain('↳ .env');
    } finally {
      fixture.cleanup();
    }
  });

  test('filters by rule id', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--rule', 'secret.basename.env'], fixture.logsDir);

      expect(result.stdout).toContain('↳ .env');
      expect(result.stdout).not.toContain('git reset --hard');
    } finally {
      fixture.cleanup();
    }
  });

  test('filters by project path including subdirectories', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--project', fixture.projectA], fixture.logsDir);

      expect(result.stdout).toContain('git reset --hard');
      expect(result.stdout).toContain('↳ .env');
      expect(result.stdout).not.toContain('legacy blocked');
    } finally {
      fixture.cleanup();
    }
  });

  test('filters by session id and legacy filename', async () => {
    const fixture = createLogsFixture();
    try {
      const sessionResult = await captureLogsCommand(['--session', 's1'], fixture.logsDir);
      const legacyResult = await captureLogsCommand(['--session', 'legacy-sess'], fixture.logsDir);

      expect(sessionResult.stdout).toContain('git reset --hard');
      expect(sessionResult.stdout).not.toContain('↳ .env');
      expect(legacyResult.stdout).toContain('legacy blocked');
    } finally {
      fixture.cleanup();
    }
  });

  test('prints JSON array with --json', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--agent', 'gemini-cli', '--json'], fixture.logsDir);
      const entries = JSON.parse(result.stdout) as AuditLogEntry[];

      expect(entries.length).toBe(1);
      expect(entries[0]?.command).toBe('cat .env');
    } finally {
      fixture.cleanup();
    }
  });

  test('renders ids in the table and preserves legacy entries without ids', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--all'], fixture.logsDir);

      expect(result.stdout).toContain('1111111111111111');
      expect(result.stdout).toContain('2222222222222222');
      expect(result.stdout).toContain('-                 ');
    } finally {
      fixture.cleanup();
    }
  });

  test.each([
    ['1111111111111111', 'git reset --hard'],
    ['2222222222222222', 'git status'],
    ['4444444444444444', 'old blocked'],
  ])('finds deny, allow, and historical entries by id', async (id, command) => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--id', id], fixture.logsDir);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain(`id:        ${id}`);
      expect(result.stdout).toContain(`command:   ${command}`);
      if (id === '1111111111111111') {
        expect(result.stdout).toContain('stage:     policy-protection');
        expect(result.stdout).toContain('level:     strict');
        expect(result.stdout).toContain('error:     path-canonicalization-limit');
        const json = await captureLogsCommand(['--id', id, '--json'], fixture.logsDir);
        expect(JSON.parse(json.stdout)).toMatchObject([
          {
            failureStage: 'policy-protection',
            errorCode: 'path-canonicalization-limit',
          },
        ]);
      } else {
        expect(result.stdout).toContain('stage:     -');
        expect(result.stdout).toContain('level:     -');
        expect(result.stdout).toContain('error:     -');
      }
    } finally {
      fixture.cleanup();
    }
  });

  test('keeps the table command bounded while detail and JSON retain persisted content', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-long-command-'));
    const logsDir = join(root, 'logs');
    const command = `${'x'.repeat(320)}complete-tail`;
    try {
      mkdirSync(logsDir, { recursive: true });
      writeJsonlFixture(join(logsDir, 'long.jsonl'), [
        {
          ts: new Date().toISOString(),
          id: '5555555555555555',
          decision: 'deny',
          command,
          segment: command,
          reason: 'blocked',
        },
      ]);

      const table = await captureLogsCommand([], logsDir);
      const detail = await captureLogsCommand(['--id', '5555555555555555'], logsDir);
      const json = await captureLogsCommand(['--id', '5555555555555555', '--json'], logsDir);

      expect(table.stdout).toContain(`${'x'.repeat(50)}…`);
      expect(table.stdout).not.toContain('x'.repeat(51));
      expect(table.stdout).not.toContain('complete-tail');
      expect(detail.stdout).toContain(command);
      expect((JSON.parse(json.stdout) as AuditLogEntry[])[0]?.command).toBe(command);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('shows the matched segment in the table and marks it as an excerpt', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-segment-'));
    const logsDir = join(root, 'logs');
    const now = Date.now();
    try {
      mkdirSync(logsDir, { recursive: true });
      writeJsonlFixture(join(logsDir, 'segments.jsonl'), [
        {
          ts: new Date(now).toISOString(),
          decision: 'deny',
          command: 'cp a.ts /tmp/a.bak && git restore src/x.ts && echo done',
          segment: 'git restore src/x.ts',
          reason: 'blocked',
        },
        {
          ts: new Date(now - 100).toISOString(),
          decision: 'deny',
          command: 'git reset --hard',
          segment: 'git reset --hard',
          reason: 'blocked',
        },
        {
          ts: new Date(now - 200).toISOString(),
          decision: 'deny',
          command: 'segmentless legacy entry',
          reason: 'blocked',
        },
      ]);

      const lines = (await captureLogsCommand([], logsDir)).stdout.split('\n');

      expect(lines[0]).toContain('↳ git restore src/x.ts');
      expect(lines[0]).not.toContain('cp a.ts');
      expect(lines[1]).toContain('git reset --hard');
      expect(lines[1]).not.toContain('↳');
      expect(lines[2]).toContain('segmentless legacy entry');
      expect(lines[2]).not.toContain('↳');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('returns zero-or-one JSON entries and a specific human miss message', async () => {
    const fixture = createLogsFixture();
    try {
      const found = await captureLogsCommand(
        ['--id', '1111111111111111', '--json'],
        fixture.logsDir,
      );
      const missingJson = await captureLogsCommand(
        ['--id', 'ffffffffffffffff', '--json'],
        fixture.logsDir,
      );
      const missingHuman = await captureLogsCommand(['--id', 'ffffffffffffffff'], fixture.logsDir);

      expect(JSON.parse(found.stdout)).toHaveLength(1);
      expect(JSON.parse(missingJson.stdout)).toEqual([]);
      expect(missingHuman.stdout).toBe(
        'No retained audit log entry found for id ffffffffffffffff.',
      );
    } finally {
      fixture.cleanup();
    }
  });

  test('ignores the default browse limit during id lookup', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-id-limit-'));
    const logsDir = join(root, 'logs');
    try {
      mkdirSync(logsDir, { recursive: true });
      writeJsonlFixture(join(logsDir, 'many.jsonl'), [
        {
          ts: new Date(0).toISOString(),
          id: '8888888888888888',
          decision: 'deny',
          command: 'target beyond browse limit',
          segment: 'target beyond browse limit',
          reason: 'blocked',
        },
        ...Array.from({ length: 25 }, (_, index) => ({
          ts: new Date(Date.now() - index).toISOString(),
          id: index.toString(16).padStart(16, '0'),
          decision: 'deny',
          command: `newer ${index}`,
          segment: `newer ${index}`,
          reason: 'blocked',
        })),
      ]);

      const result = await captureLogsCommand(['--id', '8888888888888888'], logsDir);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('target beyond browse limit');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test.each([
    '--agent',
    '--rule',
    '--session',
    '--project',
    '--suspect',
    '--since',
    '--limit',
  ])('rejects --id combined with %s', async (flag) => {
    const fixture = createLogsFixture();
    try {
      const value = flag === '--since' || flag === '--limit' ? '1' : 'value';
      const result = await captureLogsCommand(
        flag === '--suspect'
          ? ['--id', '1111111111111111', flag]
          : ['--id', '1111111111111111', flag, value],
        fixture.logsDir,
      );

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('--id cannot be combined');
    } finally {
      fixture.cleanup();
    }
  });

  test('--suspect keeps fail-closed denials and drops ordinary ones', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--suspect'], fixture.logsDir);

      expect(result.exitCode).toBe(0);
      // Blocked because analysis failed, not because the command was dangerous.
      expect(result.stdout).toContain('1111111111111111');
      // Blocked once, by a rule that matched: a catch, not a suspect.
      expect(result.stdout).not.toContain('3333333333333333');
      expect(result.stdout).not.toContain('legacy blocked');
    } finally {
      fixture.cleanup();
    }
  });

  test('--suspect never flags an allowed entry, even with --all', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--suspect', '--all'], fixture.logsDir);

      expect(result.stdout).not.toContain('2222222222222222');
    } finally {
      fixture.cleanup();
    }
  });

  test('--suspect flags a signature one session was blocked on twice', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-suspect-'));
    const logsDir = join(root, 'logs');
    const now = new Date();
    try {
      mkdirSync(logsDir, { recursive: true });
      writeJsonlFixture(join(logsDir, 'repeat.jsonl'), [
        {
          ts: now.toISOString(),
          id: 'aaaaaaaaaaaaaaaa',
          sessionId: 's1',
          decision: 'deny',
          command: 'git restore -h',
          segment: 'git restore -h',
          reason: 'blocked',
          ruleId: 'git.restore-unstaged',
        },
        {
          ts: new Date(now.getTime() - 10).toISOString(),
          id: 'bbbbbbbbbbbbbbbb',
          sessionId: 's1',
          decision: 'deny',
          command: 'git restore --staged app.ts',
          segment: 'git restore --staged app.ts',
          reason: 'blocked',
          ruleId: 'git.restore-unstaged',
        },
        {
          // Same signature, but a different session blocked on it only once.
          ts: new Date(now.getTime() - 20).toISOString(),
          id: 'cccccccccccccccc',
          sessionId: 's2',
          decision: 'deny',
          command: 'git restore other.ts',
          segment: 'git restore other.ts',
          reason: 'blocked',
          ruleId: 'git.restore-unstaged',
        },
      ]);

      const result = await captureLogsCommand(['--suspect'], logsDir);
      expect(result.stdout).toContain('aaaaaaaaaaaaaaaa');
      expect(result.stdout).toContain('bbbbbbbbbbbbbbbb');
      expect(result.stdout).not.toContain('cccccccccccccccc');

      // Counting has to span the matched window, not the truncated output: with
      // --limit 1 applied first, the surviving row would have a repeat count of
      // one and nothing would be flagged at all.
      const limited = await captureLogsCommand(['--suspect', '--limit', '1'], logsDir);
      expect(limited.stdout).toContain('aaaaaaaaaaaaaaaa');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('rejects malformed and ambiguous ids', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-duplicate-id-'));
    const logsDir = join(root, 'logs');
    try {
      mkdirSync(logsDir, { recursive: true });
      for (const name of ['first', 'second']) {
        writeJsonlFixture(join(logsDir, `${name}.jsonl`), [
          {
            ts: new Date().toISOString(),
            id: '6666666666666666',
            decision: 'deny',
            command: name,
            segment: name,
            reason: 'blocked',
          },
        ]);
      }

      const malformed = await captureLogsCommand(['--id', 'not-an-id'], logsDir);
      const duplicate = await captureLogsCommand(['--id', '6666666666666666'], logsDir);
      expect(malformed.exitCode).toBe(1);
      expect(malformed.stderr).toContain('--id must be 16 hexadecimal characters');
      expect(duplicate.exitCode).toBe(1);
      expect(duplicate.stderr).toContain(
        'Multiple audit log entries found for id 6666666666666666.',
      );
      expect(duplicate.stdout).toBe('');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('escapes every detail value and renders empty values as dashes', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-detail-controls-'));
    const logsDir = join(root, 'logs');
    const control = '\x1b]52;c;SGk=\x07';
    try {
      mkdirSync(logsDir, { recursive: true });
      writeJsonlFixture(join(logsDir, 'controls.jsonl'), [
        {
          ts: `2026-07-13T00:00:00.000Z${control}`,
          id: '7777777777777777',
          v: control,
          sessionId: control,
          decision: `deny${control}`,
          agent: control,
          shape: control,
          toolName: control,
          command: '',
          segment: '',
          truncated: true,
          reason: control,
          ruleId: control,
          intent: control,
          cwd: control,
        },
      ]);

      const result = await captureLogsCommand(['--id', '7777777777777777'], logsDir);
      expect(result.exitCode).toBe(0);
      expect(result.stdout.split('\n').some(hasTerminalControlBytes)).toBe(false);
      expect(result.stdout).toContain(String.raw`\x1b]52;c;SGk=\x07`);
      expect(result.stdout).toContain('command:   -');
      expect(result.stdout).toContain('segment:   -');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('prints writer-redacted structured headers in human and JSON output', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-command-redaction-'));
    const logsDir = join(root, '.cc-safety-net', 'logs');
    const command = 'curl -H \'{"Authorization":"Bearer command-output-canary"}\'';
    const segment = '{"Cookie":"session=segment-output-canary"}';

    try {
      writeAuditLog('structured-redaction', command, segment, 'blocked', root, { homeDir: root });

      const human = await captureLogsCommand([], logsDir);
      expect(human.exitCode).toBe(0);
      expect(human.stdout).toContain('↳ {"Cookie":"<redacted>"}');
      expect(human.stdout).not.toContain('output-canary');

      const json = await captureLogsCommand(['--json'], logsDir);
      const entries = JSON.parse(json.stdout) as AuditLogEntry[];
      expect(json.exitCode).toBe(0);
      expect(json.stdout).not.toContain('output-canary');
      expect(entries[0]?.command).toBe('curl -H \'{"Authorization":"<redacted>"}\'');
      expect(entries[0]?.segment).toBe('{"Cookie":"<redacted>"}');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('escapes terminal control bytes in human output', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-command-controls-'));
    const logsDir = join(root, 'logs');
    const command = 'printf \x1b]52;c;SGk=\x07 && rm \x1b[31m-rf\x1f/tmp';
    const cwd = '/tmp/\x1bproject\x7f';

    try {
      mkdirSync(logsDir, { recursive: true });
      writeControlLogFixture(logsDir, command, cwd);

      const result = await captureLogsCommand([], logsDir);

      expect(result.exitCode).toBe(0);
      expect(hasTerminalControlBytes(result.stdout)).toBe(false);
      expect(result.stdout).toContain(String.raw`printf \x1b]52;c;SGk=\x07`);
      expect(result.stdout).toContain(String.raw`rm \x1b[31m-rf\x1f/tmp`);
      expect(result.stdout).toContain(String.raw`[/tmp/\x1bproject\x7f]`);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('keeps raw terminal control bytes in JSON output', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-command-json-controls-'));
    const logsDir = join(root, 'logs');
    const command = 'printf \x1b]52;c;SGk=\x07';
    const cwd = '/tmp/\x1bproject';

    try {
      mkdirSync(logsDir, { recursive: true });
      writeControlLogFixture(logsDir, command, cwd);

      const result = await captureLogsCommand(['--json'], logsDir);
      const entries = JSON.parse(result.stdout) as AuditLogEntry[];

      expect(result.exitCode).toBe(0);
      expect(entries[0]?.command).toBe(command);
      expect(entries[0]?.cwd).toBe(cwd);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('prints empty message when no entries match', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--agent', 'missing-agent'], fixture.logsDir);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe('No audit log entries found.');
    } finally {
      fixture.cleanup();
    }
  });

  test('returns 1 for unknown flags and invalid limits', async () => {
    const fixture = createLogsFixture();
    try {
      const unknown = await captureLogsCommand(['--wat'], fixture.logsDir);
      const invalidLimit = await captureLogsCommand(['--limit', '0'], fixture.logsDir);

      expect(unknown.exitCode).toBe(1);
      expect(unknown.stderr).toContain('Unknown option for logs: --wat');
      expect(invalidLimit.exitCode).toBe(1);
      expect(invalidLimit.stderr).toContain('--limit must be a positive number');
    } finally {
      fixture.cleanup();
    }
  });
});

type PruneLegacyFixture = {
  cleanup: () => void;
  logsDir: string;
  legacyFiles: string[];
  survivors: string[];
  legacyBytes: number;
};

/**
 * Root-level `*.jsonl` files spanning every shape the explicit cleanup must
 * still delete (fresh, ancient, malformed, empty) alongside every neighbour it
 * must leave alone (nested v2, non-JSONL, a directory, and symlinks).
 */
function createPruneLegacyFixture(): PruneLegacyFixture {
  const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-prune-legacy-'));
  const logsDir = join(root, 'logs');
  const outside = join(root, 'outside');
  mkdirSync(logsDir, { recursive: true });
  mkdirSync(outside, { recursive: true });

  writeJsonlFixture(join(logsDir, 'fresh-sess.jsonl'), [
    {
      ts: new Date().toISOString(),
      decision: 'deny',
      command: 'legacy-secret-command',
      segment: 'legacy-secret-command',
      reason: 'blocked',
    },
  ]);
  writeJsonlFixture(join(logsDir, 'ancient-sess.jsonl'), [
    {
      ts: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      decision: 'allow',
      command: 'ancient-allowed-command',
      segment: 'ancient-allowed-command',
      reason: 'allowed',
    },
  ]);
  writeFileSync(join(logsDir, 'malformed.jsonl'), 'not json at all\n{"broken":');
  writeFileSync(join(logsDir, 'empty.jsonl'), '');

  const nestedTs = new Date().toISOString();
  writeNestedAuditLogFixture(logsDir, '-project-a', {
    ts: nestedTs,
    sessionId: 'nested-sess',
    id: '1111111111111111',
    decision: 'deny',
    command: 'nested-v2-command',
    segment: 'nested-v2-command',
    reason: 'blocked',
  });
  writeFileSync(join(logsDir, 'notes.txt'), 'keep me');
  mkdirSync(join(logsDir, 'directory.jsonl'));
  writeFileSync(join(outside, 'target.jsonl'), '{}');
  symlinkSync(join(outside, 'target.jsonl'), join(logsDir, 'linked.jsonl'));
  symlinkSync(outside, join(logsDir, 'linked-dir.jsonl'));

  const legacyFiles = [
    'fresh-sess.jsonl',
    'ancient-sess.jsonl',
    'malformed.jsonl',
    'empty.jsonl',
  ].map((name) => join(logsDir, name));
  return {
    cleanup: () => rmSync(root, { recursive: true, force: true }),
    logsDir,
    legacyFiles,
    survivors: [
      join(
        logsDir,
        '-project-a',
        nestedTs.slice(0, 7),
        `${nestedTs.slice(0, 10)}-nested-sess.jsonl`,
      ),
      join(logsDir, 'notes.txt'),
      join(logsDir, 'directory.jsonl'),
      join(logsDir, 'linked.jsonl'),
      join(logsDir, 'linked-dir.jsonl'),
      join(outside, 'target.jsonl'),
    ],
    legacyBytes: legacyFiles.reduce((total, file) => total + statSync(file).size, 0),
  };
}

describe('runLogsCommand --prune-legacy', () => {
  test('deletes every regular root-level JSONL file regardless of age or contents', async () => {
    const fixture = createPruneLegacyFixture();
    try {
      const result = await captureLogsCommand(['--prune-legacy'], fixture.logsDir);

      expect(result.exitCode).toBe(0);
      for (const file of fixture.legacyFiles) expect(existsSync(file)).toBe(false);
      expect(result.stdout).toBe(
        [
          `Removed 4 legacy audit log files (${fixture.legacyBytes} B).`,
          'Nested v2 audit logs were not changed.',
          'This deletion cannot be undone.',
        ].join('\n'),
      );
    } finally {
      fixture.cleanup();
    }
  });

  test('preserves nested v2 files, non-JSONL files, directories, and symlinks', async () => {
    const fixture = createPruneLegacyFixture();
    try {
      const result = await captureLogsCommand(['--prune-legacy'], fixture.logsDir);

      expect(result.exitCode).toBe(0);
      for (const survivor of fixture.survivors) {
        expect(lstatSync(survivor, { throwIfNoEntry: false })).toBeDefined();
      }
      expect(lstatSync(join(fixture.logsDir, 'linked.jsonl')).isSymbolicLink()).toBe(true);
      expect(lstatSync(join(fixture.logsDir, 'linked-dir.jsonl')).isSymbolicLink()).toBe(true);
    } finally {
      fixture.cleanup();
    }
  });

  test('reports no candidates with exit code 0 and creates nothing', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-prune-empty-'));
    const logsDir = join(root, 'logs');
    try {
      const missing = await captureLogsCommand(['--prune-legacy'], logsDir);
      expect(missing.exitCode).toBe(0);
      expect(existsSync(logsDir)).toBe(false);

      mkdirSync(logsDir, { recursive: true });
      const empty = await captureLogsCommand(['--prune-legacy'], logsDir);

      expect(empty.exitCode).toBe(0);
      expect(empty.stdout).toBe(
        ['No legacy audit log files found.', 'Nested v2 audit logs were not changed.'].join('\n'),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('is idempotent when repeated', async () => {
    const fixture = createPruneLegacyFixture();
    try {
      const first = await captureLogsCommand(['--prune-legacy'], fixture.logsDir);
      const second = await captureLogsCommand(['--prune-legacy'], fixture.logsDir);

      expect(first.exitCode).toBe(0);
      expect(second.exitCode).toBe(0);
      expect(second.stdout).toContain('No legacy audit log files found.');
    } finally {
      fixture.cleanup();
    }
  });

  test('emits only the summary object with --json', async () => {
    const fixture = createPruneLegacyFixture();
    try {
      const result = await captureLogsCommand(['--prune-legacy', '--json'], fixture.logsDir);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBe(
        `{"removedFiles":4,"removedBytes":${fixture.legacyBytes},"failedFiles":0}`,
      );
    } finally {
      fixture.cleanup();
    }
  });

  test('never prints command text or entry contents', async () => {
    const fixture = createPruneLegacyFixture();
    try {
      const human = await captureLogsCommand(['--prune-legacy'], fixture.logsDir);
      const json = await captureLogsCommand(['--prune-legacy', '--json'], fixture.logsDir);

      for (const output of [human.stdout, human.stderr, json.stdout, json.stderr]) {
        expect(output).not.toContain('legacy-secret-command');
        expect(output).not.toContain('ancient-allowed-command');
        expect(output).not.toContain('blocked');
      }
    } finally {
      fixture.cleanup();
    }
  });

  test('returns 1 with accurate counts when every deletion fails', async () => {
    const fixture = createPruneLegacyFixture();
    const spy = spyOn(fs, 'unlinkSync').mockImplementation(() => {
      throw new Error('EACCES: permission denied');
    });
    try {
      const result = await captureLogsCommand(['--prune-legacy', '--json'], fixture.logsDir);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toBe('{"removedFiles":0,"removedBytes":0,"failedFiles":4}');
      for (const file of fixture.legacyFiles) expect(existsSync(file)).toBe(true);
    } finally {
      spy.mockRestore();
      fixture.cleanup();
    }
  });

  test('returns 1 and reports the failed file when deletion partly fails', async () => {
    const fixture = createPruneLegacyFixture();
    const blocked = join(fixture.logsDir, 'malformed.jsonl');
    const blockedBytes = statSync(blocked).size;
    const real = fs.unlinkSync;
    const spy = spyOn(fs, 'unlinkSync').mockImplementation(((path: string) => {
      if (path === blocked) throw new Error('EACCES: permission denied');
      real(path);
    }) as typeof fs.unlinkSync);
    try {
      const result = await captureLogsCommand(['--prune-legacy'], fixture.logsDir);

      expect(result.exitCode).toBe(1);
      expect(result.stdout).toContain(
        `Removed 3 legacy audit log files (${fixture.legacyBytes - blockedBytes} B).`,
      );
      expect(result.stderr).toBe('Could not remove malformed.jsonl: EACCES: permission denied');
      expect(existsSync(blocked)).toBe(true);
    } finally {
      spy.mockRestore();
      fixture.cleanup();
    }
  });

  test.each([
    '--id 1111111111111111',
    '--limit 5',
    '--since 7',
    '--agent claude-code',
    '--rule legacy.rule',
    '--session s1',
    '--project .',
    '--suspect',
    '--all',
  ])('rejects --prune-legacy combined with %s', async (combination) => {
    const fixture = createPruneLegacyFixture();
    try {
      const result = await captureLogsCommand(
        ['--prune-legacy', ...combination.split(' ')],
        fixture.logsDir,
      );

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('--prune-legacy cannot be combined');
      for (const file of fixture.legacyFiles) expect(existsSync(file)).toBe(true);
    } finally {
      fixture.cleanup();
    }
  });
});

describe('runLogsCommand retained history window', () => {
  // No policy file in the fixture home, so the ceiling is the 30-day default.
  test.each([['0.5'], ['30']])('accepts --since %s', async (since) => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--since', since], fixture.logsDir);

      expect(result.exitCode).toBe(0);
    } finally {
      fixture.cleanup();
    }
  });

  test('rejects --since beyond the retained window', async () => {
    const fixture = createLogsFixture();
    try {
      const result = await captureLogsCommand(['--since', '30.1'], fixture.logsDir);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toBe('--since must be a positive number of days no greater than 30');
    } finally {
      fixture.cleanup();
    }
  });

  test('--id returns a physically retained entry that is already expired', async () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-logs-expired-id-'));
    const logsDir = join(root, 'logs');
    try {
      mkdirSync(logsDir, { recursive: true });
      // Freshly written, so opportunistic pruning keeps it, while its only
      // entry is far outside the configured retention window.
      writeJsonlFixture(join(logsDir, 'expired-sess.jsonl'), [
        {
          ts: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
          id: '9999999999999999',
          decision: 'deny',
          command: 'expired but retained',
          segment: 'expired but retained',
          reason: 'blocked',
        },
      ]);

      const found = await captureLogsCommand(['--id', '9999999999999999'], logsDir);
      const missing = await captureLogsCommand(['--id', 'ffffffffffffffff'], logsDir);

      expect(found.exitCode).toBe(0);
      expect(found.stdout).toContain('expired but retained');
      expect(missing.stdout).toBe('No retained audit log entry found for id ffffffffffffffff.');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
