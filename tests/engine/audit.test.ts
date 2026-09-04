import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir, userInfo } from 'node:os';
import { dirname, join, sep } from 'node:path';
import {
  encodeCwdForLogDirname,
  getAuditLogHomeDir,
  redactSecrets,
  sanitizeSessionIdForFilename,
  writeAuditLog,
} from '@/engine/audit';
import type { AuditLogEntry } from '@/ir/audit';
import { withEnv } from '../helpers';

describe('sanitizeSessionIdForFilename', () => {
  test('returns valid session id unchanged', () => {
    expect(sanitizeSessionIdForFilename('test-session-123')).toBe('test-session-123');
  });

  test('replaces invalid characters with underscores', () => {
    expect(sanitizeSessionIdForFilename('test/session')).toBe('test_session');
    expect(sanitizeSessionIdForFilename('test\\session')).toBe('test_session');
    expect(sanitizeSessionIdForFilename('test:session')).toBe('test_session');
  });

  test('strips leading/trailing special chars', () => {
    expect(sanitizeSessionIdForFilename('.session')).toBe('session');
    expect(sanitizeSessionIdForFilename('session.')).toBe('session');
    expect(sanitizeSessionIdForFilename('-session-')).toBe('session');
    expect(sanitizeSessionIdForFilename('_session_')).toBe('session');
  });

  test('returns null for empty or invalid input', () => {
    expect(sanitizeSessionIdForFilename('')).toBeNull();
    expect(sanitizeSessionIdForFilename('   ')).toBeNull();
    expect(sanitizeSessionIdForFilename('...')).toBeNull();
    expect(sanitizeSessionIdForFilename('..')).toBeNull();
    expect(sanitizeSessionIdForFilename('.')).toBeNull();
  });

  test('truncates long session ids', () => {
    const longId = 'a'.repeat(200);
    const result = sanitizeSessionIdForFilename(longId);
    expect(result?.length).toBeLessThanOrEqual(128);
  });

  test('handles path traversal attempts', () => {
    const result = sanitizeSessionIdForFilename('../../etc/passwd');
    expect(result).not.toContain('/');
    expect(result).not.toContain('..');
  });
});

describe('encodeCwdForLogDirname', () => {
  test('encodes project paths for directory names', () => {
    expect(encodeCwdForLogDirname('/Users/kenryu/Developer/420024-lab/cc-safety-net')).toBe(
      '-Users-kenryu-Developer-420024-lab-cc-safety-net',
    );
  });

  test('uses no-cwd for null or empty cwd', () => {
    expect(encodeCwdForLogDirname(null)).toBe('no-cwd');
    expect(encodeCwdForLogDirname('')).toBe('no-cwd');
  });

  test('caps encoded paths at 180 characters', () => {
    expect(encodeCwdForLogDirname(`/tmp/${'a'.repeat(240)}`).length).toBe(180);
  });

  test('preserves non-empty symbol-only encodings', () => {
    expect(encodeCwdForLogDirname('///')).toBe('---');
  });
});

describe('redactSecrets', () => {
  function expectTokenRedacted(token: string): void {
    const result = redactSecrets(token);
    expect(result).toContain('<redacted>');
    expect(result).not.toContain(token);
  }

  function expectTokensRedacted(tokens: string[]): void {
    const result = redactSecrets(tokens.join(' '));
    for (const token of tokens) {
      expect(result).not.toContain(token);
    }
    expect(result.split(' ')).toEqual(tokens.map(() => '<redacted>'));
  }

  test('redacts TOKEN=value patterns', () => {
    const result = redactSecrets('TOKEN=secret123 git reset --hard');
    expect(result).toContain('<redacted>');
    expect(result).not.toContain('secret123');
  });

  test('redacts API_KEY patterns', () => {
    const result = redactSecrets('API_KEY=mysecretkey');
    expect(result).toContain('<redacted>');
    expect(result).not.toContain('mysecretkey');
  });

  test('redacts GitHub tokens', () => {
    const result = redactSecrets('ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    expect(result).toBe('<redacted>');
  });

  test('redacts raw provider token formats', () => {
    expectTokensRedacted([
      ['xoxb', '123456789012', '123456789012', 'abcdefghijklmnopqrstuvwx'].join('-'),
      ['npm', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('_'),
      ['sk', 'live', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('_'),
      ['sk', 'test', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('_'),
      ['rk', 'live', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('_'),
      ['pypi', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('-'),
    ]);
  });

  test('redacts URL credentials', () => {
    const result = redactSecrets('https://user:password@example.com');
    expect(result).not.toContain('password');
    expect(result).toContain('<redacted>');
  });

  test('redacts non-HTTP URL credentials', () => {
    const result = redactSecrets(
      'postgres://user:password@db.example/app mysql://admin:secret@db.example/app',
    );
    expect(result).not.toContain('password');
    expect(result).not.toContain('secret');
    expect(result).toContain('<redacted>');
  });

  test('redacts token-only URL credentials', () => {
    const result = redactSecrets('git://token123@example.com/repo https://token456@example.com');
    expect(result).not.toContain('token123');
    expect(result).not.toContain('token456');
    expect(result).toContain('<redacted>');
  });

  test('redacts signature values in assignments and URL queries', () => {
    expect(
      redactSecrets(
        'X-Amz-Signature=bare-aws X-Goog-Signature=bare-google sig=bare-short signature=bare-long https://example.com/object?X-Amz-Signature=url-aws&X-Goog-Signature=url-google&sig=url-short&signature=url-long&name=report.pdf',
      ),
    ).toBe(
      'X-Amz-Signature=<redacted> X-Goog-Signature=<redacted> sig=<redacted> signature=<redacted> https://example.com/object?X-Amz-Signature=<redacted>&X-Goog-Signature=<redacted>&sig=<redacted>&signature=<redacted>&name=report.pdf',
    );
    expect(
      redactSecrets("curl 'https://example.com/object?sig=url-secret'; sig=bare-secret;next"),
    ).toBe("curl 'https://example.com/object?sig=<redacted>'; sig=<redacted>;next");
    expect(redactSecrets('echo ok;sig=secret producer|signature=secret')).toBe(
      'echo ok;sig=<redacted> producer|signature=<redacted>',
    );
    expect(redactSecrets(`sig="double secret" signature='single secret'`)).toBe(
      'sig=<redacted> signature=<redacted>',
    );
  });

  test('preserves non-secret content', () => {
    const result = redactSecrets('git reset --hard');
    expect(result).toBe('git reset --hard');
  });

  test('redacts Authorization Bearer token', () => {
    const result = redactSecrets('curl -H "Authorization: Bearer abc123" https://example.com');
    expect(result).not.toContain('abc123');
    expect(result).toContain('<redacted>');
  });

  test('redacts Authorization Basic token', () => {
    const result = redactSecrets("curl -H 'Authorization: Basic abc123' https://example.com");
    expect(result).not.toContain('abc123');
    expect(result).toContain('<redacted>');
  });

  test('redacts unquoted Authorization header token', () => {
    const result = redactSecrets('curl -H Authorization:Bearer fake123 https://x.com');
    expect(result).not.toContain('fake123');
    expect(result).toContain('<redacted>');
  });

  test('redacts unquoted Authorization header token with spaces after colon', () => {
    const result = redactSecrets('Authorization: Bearer fake456');
    expect(result).not.toContain('fake456');
    expect(result).toContain('<redacted>');
  });

  test('redacts quoted Authorization header token in multiline text', () => {
    const result = redactSecrets('curl https://x.com\n-H "Authorization: Bearer fake789"');
    expect(result).not.toContain('fake789');
    expect(result).toContain('<redacted>');
  });

  test('redacts cookie and API key headers', () => {
    const result = redactSecrets(
      'curl -H "Cookie: session=secret123" -H "X-API-Key: key123" https://example.com',
    );
    expect(result).not.toContain('secret123');
    expect(result).not.toContain('key123');
    expect(result).toContain('<redacted>');
  });

  test('redacts paired quoted header values in structured text', () => {
    const cases = [
      {
        input: '{"Authorization":"Bearer compact-canary"}',
        expected: '{"Authorization":"<redacted>"}',
      },
      {
        input: '{  "Authorization" :  "Bearer whitespace-canary"  }',
        expected: '{  "Authorization" :  "<redacted>"  }',
      },
      {
        input: "{'Authorization':'Bearer single-canary'}",
        expected: "{'Authorization':'<redacted>'}",
      },
      {
        input: '{"aUtHoRiZaTiOn"   :   "Bearer case-canary"}',
        expected: '{"aUtHoRiZaTiOn"   :   "<redacted>"}',
      },
      {
        input: 'Authorization: "Bearer unquoted-canary"',
        expected: 'Authorization: "<redacted>"',
      },
      {
        input: String.raw`{"Authorization":"Bearer before\"after\\tail escaped-canary"}`,
        expected: '{"Authorization":"<redacted>"}',
      },
      {
        input: '{"Cookie":"session=cookie-canary"}',
        expected: '{"Cookie":"<redacted>"}',
      },
      {
        input: '{"X-API-Key":"x-api-key-canary"}',
        expected: '{"X-API-Key":"<redacted>"}',
      },
      {
        input: '{"API-Key":"api-key-canary"}',
        expected: '{"API-Key":"<redacted>"}',
      },
    ];

    for (const testCase of cases) {
      expect(redactSecrets(testCase.input)).toBe(testCase.expected);
    }
  });

  test('preserves existing plain and shell header redaction', () => {
    const cases = [
      'Authorization: Bearer plain-canary',
      'curl -H "Authorization: Bearer double-shell-canary" https://example.com',
      "curl -H 'Authorization: Basic single-shell-canary' https://example.com",
    ];

    for (const input of cases) {
      const result = redactSecrets(input);
      expect(result).toContain('<redacted>');
      expect(result).not.toContain('canary');
    }
  });

  test('redacts PEM private key blocks', () => {
    const result = redactSecrets(
      '-----BEGIN PRIVATE KEY-----\nsuper-secret-key\n-----END PRIVATE KEY-----',
    );
    expect(result).toBe('<redacted>');
  });

  test('redacts PEM private key blocks case-insensitively', () => {
    expect(
      redactSecrets('-----begin rsa private key-----\nabc\n-----end rsa private key-----'),
    ).toBe('<redacted>');
    expect(redactSecrets('-----Begin EC Private Key-----\nabc\n-----eNd EC Private Key-----')).toBe(
      '<redacted>',
    );
  });

  test('redacts JWT tokens and AWS access key IDs', () => {
    const result = redactSecrets(
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature AKIAIOSFODNN7EXAMPLE',
    );
    expect(result).not.toContain('eyJhbGci');
    expect(result).not.toContain('AKIAIOSFODNN7EXAMPLE');
    expect(result).toContain('<redacted>');
  });

  test('preserves dotted hostnames', () => {
    const input = 'ping elasticsearch-node.production-east.internal';
    expect(redactSecrets(input)).toBe(input);
  });

  test('preserves dotted file names', () => {
    const input = 'tar xf releasebundle.checksumverified.archivegz';
    expect(redactSecrets(input)).toBe(input);
  });

  test('redacts JWTs with short middle segment', () => {
    expect(redactSecrets('eyJabcdefghij.abcdefgh.abcdefgh')).toBe('<redacted>');
  });

  test('redacts database connection env vars', () => {
    const result = redactSecrets('DATABASE_URL=postgres://user:password@db.example/app');
    expect(result).not.toContain('password');
    expect(result).toBe('DATABASE_URL=<redacted>');
  });

  test('redacts database URI env vars', () => {
    expect(redactSecrets('DATABASE_URI=postgres://user:pass@db.internal:5432/mydb')).toBe(
      'DATABASE_URI=<redacted>',
    );
  });

  test('redacts database DSN env vars containing spaces', () => {
    expect(redactSecrets('POSTGRES_DSN=host=db user=me password=secret dbname=mydb')).toBe(
      'POSTGRES_DSN=<redacted>',
    );
  });

  test('redacts database connection string env vars', () => {
    expect(redactSecrets('DATABASE_CONNECTION_STRING=postgres://user:pass@db.example/app')).toBe(
      'DATABASE_CONNECTION_STRING=<redacted>',
    );
  });

  test('redacts quoted KEY=VALUE secrets containing spaces', () => {
    const result = redactSecrets(
      'PASSWORD="my fake phrase" ./deploy.sh TOKEN=\'another fake phrase\'',
    );
    expect(result).toContain('<redacted>');
    expect(result).not.toContain('my fake phrase');
    expect(result).not.toContain('fake phrase');
    expect(result).not.toContain('another fake phrase');
    expect(result).not.toContain('another');
  });

  test('redacts curl -u credentials', () => {
    const result = redactSecrets(
      'curl -u admin:fakepass https://x.com curl --user=admin:fakepass https://x.com',
    );
    expect(result).toContain('<redacted>');
    expect(result).not.toContain('fakepass');
  });

  test('does not redact sort -u operand', () => {
    expect(redactSecrets('sort -u names.txt')).toBe('sort -u names.txt');
  });

  test('redacts GitHub fine-grained PATs', () => {
    expectTokenRedacted(`github_pat_${'A'.repeat(40)}`);
  });

  test('redacts GitLab PATs', () => {
    expectTokenRedacted(`glpat-${'A'.repeat(20)}`);
  });

  test('redacts all Slack token families', () => {
    expectTokensRedacted(
      ['xoxp', 'xoxs', 'xoxa', 'xoxe'].map(
        (prefix) => `${prefix}-123456789012-123456789012-abcdefghijklmnopqrstuvwx`,
      ),
    );
  });

  test('redacts the sk- key family', () => {
    expectTokensRedacted([
      `sk-${'a'.repeat(32)}`,
      `sk-proj-${'A'.repeat(32)}`,
      `sk-ant-api03-${'A'.repeat(32)}`,
      `sk-or-v1-${'A'.repeat(32)}`,
      `sk-kimi${'A'.repeat(32)}`,
    ]);
  });

  test('redacts the sk_ underscore family', () => {
    expectTokensRedacted([`sk_${'a'.repeat(48)}`, `sk_${'A'.repeat(20)}`]);
  });

  test('redacts Groq keys', () => {
    expectTokensRedacted([`gsk_${'A'.repeat(52)}`, `gsk_${'A'.repeat(60)}`]);
  });

  test('redacts xAI keys', () => {
    expectTokensRedacted([`xai-${'A'.repeat(80)}`, `xai-${'A'.repeat(90)}`]);
  });

  test('redacts Perplexity keys', () => {
    expectTokenRedacted(`pplx-${'A'.repeat(20)}`);
  });

  test('redacts Baseten keys', () => {
    expectTokenRedacted(`bastn_${'A'.repeat(16)}`);
  });

  test('redacts Together AI keys', () => {
    expectTokenRedacted(`tgp_v1_${'A'.repeat(43)}`);
  });

  test('redacts FriendliAI keys', () => {
    expectTokenRedacted(`flp_${'A'.repeat(10)}`);
  });

  test('redacts Wafer keys', () => {
    expectTokenRedacted(`wfr_${'A'.repeat(20)}`);
  });

  test('redacts Fireworks keys', () => {
    expectTokensRedacted([`fw_${'A'.repeat(20)}`, `fwp_${'A'.repeat(20)}`]);
  });

  test('redacts Xiaomi MiMo keys', () => {
    expectTokenRedacted(`tp-${'A'.repeat(20)}`);
  });

  test('does not redact short tp- tokens', () => {
    expect(redactSecrets('tp-short')).toBe('tp-short');
  });

  test('redacts Parasail keys', () => {
    expectTokenRedacted(`psk-${'A'.repeat(8)}-${'B'.repeat(8)}`);
  });

  test('does not redact single-segment ps- tokens', () => {
    expect(redactSecrets('psk-short')).toBe('psk-short');
  });

  test('redacts Zhipu/Z.AI keys', () => {
    expectTokenRedacted(`${'a'.repeat(32)}.${'A'.repeat(16)}`);
  });

  test('does not redact arbitrary hex strings', () => {
    const token = 'a'.repeat(32);
    expect(redactSecrets(token)).toBe(token);
  });

  test('documents the sk- over-redaction floor', () => {
    const token = `sk-${'benign'.repeat(4)}`;
    expect(redactSecrets('sk-abc')).toBe('sk-abc');
    expect(redactSecrets(token)).toBe('<redacted>');
  });
});

describe('writeAuditLog', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(
      tmpdir(),
      `safety-net-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  function getLogFile(sessionId: string): string {
    return listLogFiles().find((file) => file.endsWith(`${sessionId}.jsonl`)) ?? '';
  }

  function getLogsDir(): string {
    return join(testDir, '.cc-safety-net', 'logs');
  }

  function listLogFiles(): string[] {
    if (!existsSync(getLogsDir())) return [];
    return readdirSync(getLogsDir(), { recursive: true, encoding: 'utf8' })
      .filter((file) => file.endsWith('.jsonl'))
      .map((file) => join(getLogsDir(), file));
  }

  function getOnlyLogFile(): string {
    const files = listLogFiles();
    expect(files.length).toBe(1);
    return files[0] ?? '';
  }

  function expectAuditLogStayedInLogsDir(escapedPath: string): void {
    expect(existsSync(escapedPath)).toBe(false);
    if (!existsSync(getLogsDir())) return;
    const files = listLogFiles();
    expect(files.length).toBe(1);
    for (const file of files) {
      expect(file.startsWith(getLogsDir())).toBe(true);
    }
  }

  function readLogEntries(sessionId: string): AuditLogEntry[] {
    const logFile = getLogFile(sessionId);
    if (!existsSync(logFile)) {
      return [];
    }
    const content = readFileSync(logFile, 'utf-8');
    return content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line) as AuditLogEntry);
  }

  test('denied command creates log entry', () => {
    const sessionId = 'test-session-123';
    writeAuditLog(
      sessionId,
      'git reset --hard',
      'git reset --hard',
      'git reset --hard destroys uncommitted changes',
      '/home/user/project',
      { homeDir: testDir },
    );

    const entries = readLogEntries(sessionId);
    expect(entries.length).toBe(1);
    expect(entries[0]?.command).toContain('git reset --hard');
  });

  test('writes project/month/date-prefixed log file and records session id', () => {
    const sessionId = 'test-session-layout';
    writeAuditLog(sessionId, 'git status', 'git status', 'reason', '/tmp/proj', {
      homeDir: testDir,
    });

    const logFile = getOnlyLogFile();
    const entry = JSON.parse(readFileSync(logFile, 'utf-8').trim()) as AuditLogEntry;
    const date = entry.ts.slice(0, 10);
    expect(logFile).toBe(
      join(
        testDir,
        '.cc-safety-net',
        'logs',
        '-tmp-proj',
        date.slice(0, 7),
        `${date}-${sessionId}.jsonl`,
      ),
    );
    expect(entry.sessionId).toBe(sessionId);
  });

  test('log format has correct fields', () => {
    const sessionId = 'test-session-789';
    writeAuditLog(
      sessionId,
      'git reset --hard',
      'git reset --hard',
      'git reset --hard destroys uncommitted changes',
      '/home/user/project',
      { homeDir: testDir },
    );

    const entries = readLogEntries(sessionId);
    expect(entries.length).toBe(1);

    expect(entries[0]).toHaveProperty('ts');
    expect(entries[0]).toHaveProperty('command');
    expect(entries[0]).toHaveProperty('segment');
    expect(entries[0]).toHaveProperty('reason');
    expect(entries[0]).toHaveProperty('cwd');
    expect(entries[0]).toHaveProperty('decision');
    expect(entries[0]?.id).toMatch(/^[a-f0-9]{16}$/);
    expect(entries[0]?.v).toBe('dev');

    expect(entries[0]?.decision).toBe('deny');
    expect(entries[0]?.cwd).toBe('/home/user/project');
    expect(entries[0]?.reason).toContain('git reset --hard');
  });

  test('log entry can include rule id and intent', () => {
    const sessionId = 'test-session-rule-metadata';
    writeAuditLog(
      sessionId,
      'git push --force',
      'git push --force',
      'git push --force destroys remote history.',
      '/home/user/project',
      {
        homeDir: testDir,
        ruleId: 'git.push-force',
        intent: 'use_alternative',
      },
    );

    const entries = readLogEntries(sessionId);
    expect(entries[0]?.ruleId).toBe('git.push-force');
    expect(entries[0]?.intent).toBe('use_alternative');
  });

  test('log entry can include bounded failure diagnostics', () => {
    const sessionId = 'test-session-failure-diagnostics';
    writeAuditLog(sessionId, 'echo ok', 'echo ok', 'failed closed', '/home/user/project', {
      homeDir: testDir,
      failureStage: 'secret-protection',
      errorCode: 'path-canonicalization-limit',
    });

    expect(readLogEntries(sessionId)).toMatchObject([
      {
        failureStage: 'secret-protection',
        errorCode: 'path-canonicalization-limit',
      },
    ]);
  });

  test('keeps the full command on failure-stage entries', () => {
    const sessionId = 'test-session-failure-full-command';
    const command = `echo ${'x'.repeat(12_000)}`;
    writeAuditLog(sessionId, command, 'y'.repeat(2_001), 'failed closed', null, {
      homeDir: testDir,
      failureStage: 'policy-protection',
      errorCode: 'path-canonicalization-limit',
    });

    const entry = readLogEntries(sessionId)[0];
    expect(entry?.command).toBe(command);
    expect(entry?.segment?.length).toBe(2_000);
    expect(entry?.truncated).toBe(true);
  });

  test('ordinary log entries omit failure diagnostics', () => {
    const sessionId = 'test-session-without-failure-diagnostics';
    writeAuditLog(sessionId, 'git status', 'git status', 'allowed', '/home/user/project', {
      homeDir: testDir,
      decision: 'allow',
    });

    const entry = readLogEntries(sessionId)[0];
    expect(entry).not.toHaveProperty('failureStage');
    expect(entry).not.toHaveProperty('errorCode');
  });

  test('log entry can include integration metadata', () => {
    const sessionId = 'test-session-agent-metadata';
    writeAuditLog(sessionId, 'git status', 'git status', 'allowed', '/home/user/project', {
      homeDir: testDir,
      agent: 'claude-code',
      shape: 'copilot-cli',
      level: 'paranoid',
      toolName: 'Bash',
    });

    const entries = readLogEntries(sessionId);
    expect(entries[0]?.agent).toBe('claude-code');
    expect(entries[0]?.shape).toBe('copilot-cli');
    expect(entries[0]?.level).toBe('paranoid');
    expect(entries[0]?.toolName).toBe('Bash');
  });

  test('omits optional metadata when not provided', () => {
    const sessionId = 'test-session-no-agent-metadata';
    writeAuditLog(sessionId, 'git status', 'git status', 'allowed', '/home/user/project', {
      homeDir: testDir,
    });

    const entries = readLogEntries(sessionId);
    expect('agent' in (entries[0] ?? {})).toBe(false);
    expect('shape' in (entries[0] ?? {})).toBe(false);
    expect('level' in (entries[0] ?? {})).toBe(false);
    expect('toolName' in (entries[0] ?? {})).toBe(false);
    expect('truncated' in (entries[0] ?? {})).toBe(false);
  });

  test('log redacts secrets', () => {
    const sessionId = 'test-session-redact';
    writeAuditLog(
      sessionId,
      'TOKEN=secret123 git reset --hard',
      'TOKEN=secret123 git reset --hard',
      'git reset --hard destroys uncommitted changes',
      null,
      { homeDir: testDir },
    );

    const entries = readLogEntries(sessionId);
    expect(entries.length).toBe(1);
    expect(entries[0]?.command).not.toContain('secret123');
    expect(entries[0]?.command).toContain('<redacted>');
  });

  test('redacts structured quoted headers in raw and parsed JSONL fields', () => {
    const sessionId = 'test-session-structured-redact';
    writeAuditLog(
      sessionId,
      '{"Authorization":"Bearer command-jsonl-canary"}',
      '{"X-API-Key":"segment-jsonl-canary"}',
      'reason',
      null,
      { homeDir: testDir },
    );

    const raw = readFileSync(getLogFile(sessionId), 'utf-8');
    const entries = readLogEntries(sessionId);
    expect(raw).not.toContain('jsonl-canary');
    expect(raw.match(/<redacted>/g)).toHaveLength(2);
    expect(raw).toContain(String.raw`{\"Authorization\":\"<redacted>\"}`);
    expect(raw).toContain(String.raw`{\"X-API-Key\":\"<redacted>\"}`);
    expect(entries[0]?.command).toBe('{"Authorization":"<redacted>"}');
    expect(entries[0]?.segment).toBe('{"X-API-Key":"<redacted>"}');
  });

  test('missing session id creates no log', () => {
    // Empty session ID
    writeAuditLog('', 'git reset --hard', 'git reset --hard', 'reason', null, {
      homeDir: testDir,
    });

    const logsDir = join(testDir, '.cc-safety-net', 'logs');
    if (existsSync(logsDir)) {
      const files = readdirSync(logsDir);
      expect(files.length).toBe(0);
    }
  });

  test('multiple denials append to same log', () => {
    const sessionId = 'test-session-multi';
    writeAuditLog(sessionId, 'git reset --hard', 'git reset --hard', 'reason1', null, {
      homeDir: testDir,
    });
    writeAuditLog(sessionId, 'git clean -f', 'git clean -f', 'reason2', null, {
      homeDir: testDir,
    });
    writeAuditLog(sessionId, 'rm -rf /', 'rm -rf /', 'reason3', null, {
      homeDir: testDir,
    });

    const entries = readLogEntries(sessionId);
    expect(listLogFiles().length).toBe(1);
    expect(entries.length).toBe(3);
    expect(entries[0]?.command).toContain('git reset --hard');
    expect(entries[1]?.command).toContain('git clean -f');
    expect(entries[2]?.command).toContain('rm -rf /');
  });

  test('session id path traversal does not escape logs dir', () => {
    const sessionId = '../../outside';
    writeAuditLog(sessionId, 'git reset --hard', 'git reset --hard', 'reason', null, {
      homeDir: testDir,
    });

    expectAuditLogStayedInLogsDir(join(testDir, 'outside.jsonl'));
  });

  test('session id absolute path does not escape logs dir', () => {
    const sessionId = join(testDir, 'escaped');
    writeAuditLog(sessionId, 'git reset --hard', 'git reset --hard', 'reason', null, {
      homeDir: testDir,
    });

    expectAuditLogStayedInLogsDir(join(testDir, 'escaped.jsonl'));
  });

  test('cwd null when not provided', () => {
    const sessionId = 'test-session-no-cwd';
    writeAuditLog(sessionId, 'git reset --hard', 'git reset --hard', 'reason', null, {
      homeDir: testDir,
    });

    const entries = readLogEntries(sessionId);
    expect(entries.length).toBe(1);
    expect(entries[0]?.cwd).toBeNull();
    expect(getOnlyLogFile()).toContain(`${join('logs', 'no-cwd')}${sep}`);
  });

  test.each([
    ['command', 10_000],
    ['segment', 2_000],
    ['toolName', 256],
    ['cwd', 32_768],
  ] as const)('caps %s only when it exceeds its persistence limit', (field, limit) => {
    const exact = 'x'.repeat(limit);
    const over = 'y'.repeat(limit + 1);
    const exactOptions = {
      homeDir: testDir,
      ...(field === 'toolName' ? { toolName: exact } : {}),
    };
    const overOptions = {
      homeDir: testDir,
      ...(field === 'toolName' ? { toolName: over } : {}),
    };

    writeAuditLog(
      `exact-${field}`,
      field === 'command' ? exact : '',
      field === 'segment' ? exact : '',
      'reason',
      field === 'cwd' ? exact : null,
      exactOptions,
    );
    writeAuditLog(
      `over-${field}`,
      field === 'command' ? over : '',
      field === 'segment' ? over : '',
      'reason',
      field === 'cwd' ? over : null,
      overOptions,
    );

    const exactEntry = readLogEntries(`exact-${field}`)[0];
    const overEntry = readLogEntries(`over-${field}`)[0];
    expect(exactEntry?.[field]?.length).toBe(limit);
    expect(exactEntry?.truncated).toBeUndefined();
    expect(overEntry?.[field]?.length).toBe(limit);
    expect(overEntry?.truncated).toBe(true);
  });

  test('redacts cwd before deriving the log path', () => {
    writeAuditLog('cwd-redaction', '', '', 'reason', '/tmp/API_TOKEN=cwd-redaction-canary', {
      homeDir: testDir,
    });

    const entry = readLogEntries('cwd-redaction')[0];
    expect(entry?.cwd).toBe('/tmp/API_TOKEN=<redacted>');
    expect(getOnlyLogFile()).not.toContain('cwd-redaction-canary');
  });

  test('redacts structured quoted headers before truncating persisted fields', () => {
    const sessionId = 'test-session-redact-before-truncate';
    const value = `Bearer truncation-canary-${'x'.repeat(320)}`;
    const structuredHeader = `{"Authorization":"${value}"}`;
    writeAuditLog(sessionId, structuredHeader, structuredHeader, 'reason', null, {
      homeDir: testDir,
    });

    const entries = readLogEntries(sessionId);
    expect(entries[0]?.command).toBe('{"Authorization":"<redacted>"}');
    expect(entries[0]?.segment).toBe('{"Authorization":"<redacted>"}');
    expect(entries[0]?.command).not.toContain('truncation-canary');
    expect(entries[0]?.segment).not.toContain('truncation-canary');
  });

  test('redacts tool names before applying the persistence cap', () => {
    const toolName = `TOKEN=tool-name-canary ${'x'.repeat(300)}`;
    writeAuditLog('tool-redaction', '', '', 'reason', null, {
      homeDir: testDir,
      toolName,
    });

    const entry = readLogEntries('tool-redaction')[0];
    expect(entry?.toolName).not.toContain('tool-name-canary');
    expect(entry?.toolName).toContain('<redacted>');
    expect(entry?.toolName?.length).toBe(256);
    expect(entry?.truncated).toBe(true);
  });

  test('persists injected time and id unchanged', () => {
    writeAuditLog('deterministic-entry', '', '', 'reason', null, {
      homeDir: testDir,
      now: () => new Date('2026-07-13T00:00:00.000Z'),
      createId: () => '0123456789abcdef',
    });

    expect(readLogEntries('deterministic-entry')[0]).toMatchObject({
      ts: '2026-07-13T00:00:00.000Z',
      id: '0123456789abcdef',
      command: '',
      segment: '',
    });
  });

  test('generates distinct content-independent ids for identical events', () => {
    writeAuditLog('random-ids', 'same command', 'same segment', 'same reason', null, {
      homeDir: testDir,
    });
    writeAuditLog('random-ids', 'same command', 'same segment', 'same reason', null, {
      homeDir: testDir,
    });

    const entries = readLogEntries('random-ids');
    expect(entries[0]?.id).toMatch(/^[a-f0-9]{16}$/);
    expect(entries[1]?.id).toMatch(/^[a-f0-9]{16}$/);
    expect(entries[0]?.id).not.toBe(entries[1]?.id);
  });

  test('can write allowed debug log entry', () => {
    const sessionId = 'test-session-allowed';
    writeAuditLog(sessionId, 'git status', 'git status', 'allowed', '/home/user/project', {
      homeDir: testDir,
      decision: 'allow',
    });

    const entries = readLogEntries(sessionId);
    expect(entries.length).toBe(1);
    expect(entries[0]?.decision).toBe('allow');
    expect(entries[0]?.reason).toBe('allowed');
  });

  test('creates logs dir with 0700', () => {
    if (process.platform === 'win32') return;

    writeAuditLog('test-session-dir-mode', 'git status', 'git status', 'reason', null, {
      homeDir: testDir,
    });

    expect(statSync(getLogsDir()).mode & 0o777).toBe(0o700);
    expect(statSync(dirname(getOnlyLogFile())).mode & 0o777).toBe(0o700);
  });

  test('creates log file with 0600', () => {
    if (process.platform === 'win32') return;

    const sessionId = 'test-session-file-mode';
    writeAuditLog(sessionId, 'git status', 'git status', 'reason', null, {
      homeDir: testDir,
    });

    expect(statSync(getLogFile(sessionId)).mode & 0o777).toBe(0o600);
  });

  test('empty HOME env falls back to os homedir', () => {
    expect(getAuditLogHomeDir('')).toBe(userInfo().homedir);
  });

  test('a test run without the audit home redirect resolves nowhere', () => {
    // bunfig.toml `preload` only runs when Bun starts in the repository root, so
    // `bun test` from any other directory loses the redirect tests/setup.ts sets
    // and every fixture entry lands in the developer's real home.
    withEnv({ CC_SAFETY_NET_AUDIT_HOME: undefined, NODE_ENV: 'test' }, () => {
      expect(getAuditLogHomeDir()).toBe(null);
      expect(getAuditLogHomeDir(userInfo().homedir)).toBe(null);
    });
  });

  test('a non-test run still resolves the real home', () => {
    withEnv({ CC_SAFETY_NET_AUDIT_HOME: undefined, NODE_ENV: 'production' }, () => {
      expect(getAuditLogHomeDir(userInfo().homedir)).toBe(userInfo().homedir);
    });
  });

  test('audit home env overrides HOME by default', () => {
    const originalAuditHome = process.env.CC_SAFETY_NET_AUDIT_HOME;
    const originalHome = process.env.HOME;
    const auditHome = join(tmpdir(), `safety-net-audit-home-${Date.now()}`);
    process.env.CC_SAFETY_NET_AUDIT_HOME = auditHome;
    process.env.HOME = join(tmpdir(), 'not-audit-home');

    try {
      expect(getAuditLogHomeDir()).toBe(auditHome);
    } finally {
      if (originalAuditHome === undefined) delete process.env.CC_SAFETY_NET_AUDIT_HOME;
      if (originalAuditHome !== undefined) process.env.CC_SAFETY_NET_AUDIT_HOME = originalAuditHome;
      if (originalHome === undefined) delete process.env.HOME;
      if (originalHome !== undefined) process.env.HOME = originalHome;
    }
  });
});
