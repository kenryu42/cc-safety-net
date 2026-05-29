import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { redactSecrets, sanitizeSessionIdForFilename, writeAuditLog } from '@/core/audit';
import type { AuditLogEntry } from '@/types';

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

describe('redactSecrets', () => {
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
    const tokens = [
      ['xoxb', '123456789012', '123456789012', 'abcdefghijklmnopqrstuvwx'].join('-'),
      ['npm', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('_'),
      ['sk', 'live', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('_'),
      ['sk', 'test', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('_'),
      ['rk', 'live', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('_'),
      ['pypi', 'abcdefghijklmnopqrstuvwxyz1234567890'].join('-'),
    ];
    const result = redactSecrets(tokens.join(' '));
    for (const token of tokens) {
      expect(result).not.toContain(token);
    }
    expect(result.split(' ')).toEqual(tokens.map(() => '<redacted>'));
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

  test('redacts cookie and API key headers', () => {
    const result = redactSecrets(
      'curl -H "Cookie: session=secret123" -H "X-API-Key: key123" https://example.com',
    );
    expect(result).not.toContain('secret123');
    expect(result).not.toContain('key123');
    expect(result).toContain('<redacted>');
  });

  test('redacts PEM private key blocks', () => {
    const result = redactSecrets(
      '-----BEGIN PRIVATE KEY-----\nsuper-secret-key\n-----END PRIVATE KEY-----',
    );
    expect(result).toBe('<redacted>');
  });

  test('redacts JWT tokens and AWS access key IDs', () => {
    const result = redactSecrets(
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature AKIAIOSFODNN7EXAMPLE',
    );
    expect(result).not.toContain('eyJhbGci');
    expect(result).not.toContain('AKIAIOSFODNN7EXAMPLE');
    expect(result).toContain('<redacted>');
  });

  test('redacts database connection env vars', () => {
    const result = redactSecrets('DATABASE_URL=postgres://user:password@db.example/app');
    expect(result).not.toContain('password');
    expect(result).toBe('DATABASE_URL=<redacted>');
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
    return join(testDir, '.cc-safety-net', 'logs', `${sessionId}.jsonl`);
  }

  function expectAuditLogStayedInLogsDir(escapedPath: string): void {
    expect(existsSync(escapedPath)).toBe(false);
    const logsDir = join(testDir, '.cc-safety-net', 'logs');
    if (!existsSync(logsDir)) return;
    const files = readdirSync(logsDir).filter((f) => f.endsWith('.jsonl'));
    expect(files.length).toBe(1);
    for (const file of files) {
      expect(join(logsDir, file).startsWith(logsDir)).toBe(true);
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

    expect(entries[0]?.decision).toBe('deny');
    expect(entries[0]?.cwd).toBe('/home/user/project');
    expect(entries[0]?.reason).toContain('git reset --hard');
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
  });

  test('truncates long commands', () => {
    const sessionId = 'test-session-long';
    const longCommand = `git reset --hard ${'x'.repeat(500)}`;
    writeAuditLog(sessionId, longCommand, longCommand, 'reason', null, {
      homeDir: testDir,
    });

    const entries = readLogEntries(sessionId);
    expect(entries.length).toBe(1);
    expect(entries[0]?.command.length).toBeLessThanOrEqual(300);
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
});
