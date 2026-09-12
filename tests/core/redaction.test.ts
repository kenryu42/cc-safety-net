import { describe, expect, test } from 'bun:test';
import * as next from '@/core/redaction';

const PRIVATE_KEY =
  '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF8PbnGy0AYc5\n-----END RSA PRIVATE KEY-----';

const FIXED: readonly string[] = [
  'TOKEN=abc123 npm publish',
  'export GITHUB_TOKEN="ghp_abcdefghijklmnopqrstuvwxyz0123" gh auth status',
  "AWS_SECRET_ACCESS_KEY='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY' aws s3 ls",
  'DATABASE_URL=postgres://user:pw@db.internal:5432/app prisma migrate',
  'DATABASE_DSN=host=db user=app password=hunter2 sslmode=require psql',
  'CONNECTION_STRING="Server=db;User Id=app;Password=hunter2" dotnet run',
  'REDIS_URI=redis://:pw@cache:6379/0 node worker.js',
  'MY_API_KEY=$(cat ~/.secret) ./run',
  'TOKEN=$(printf \'%s\' "$(get-secret)") SAFE=value',
  'PASSWORD="with \\" escaped quote" ./login',
  "PASS='single quoted value' ./login",
  'CREDENTIALS= empty-then-space',
  'KEY=',
  'prefixTOKEN=value',
  'prefix-TOKEN=value',
  '(TOKEN=inside-parens) [KEY=brackets] {SECRET=braces}',
  'X=1 Y="two words" Z=$(echo three) W=`four`',
  'lower_case_token=abc mixed_Case=def',
  'FOO=bar\nSECRET_KEY=baz\nBAR=qux',
  'echo TOKEN=not-at-start-but-preceded-by-space',
  'A=B=C D==E =F G= H',
  '1TOKEN=digit-first _TOKEN=underscore-first',
  'curl -H "Authorization: Bearer ghp_abcdefghijklmnopqrstuvwxyz0123" https://api.github.com',
  "curl -H 'x-api-key: sk-ant-api03-abcdefghijklmnopqrstuvwxyz' https://api.example.com",
  'authorization: Basic dXNlcjpwYXNzd29yZA==',
  '{"authorization":"Bearer abc","cookie":"session=xyz; other=1"}',
  "{'api-key': 'value with spaces', 'x-api-key': \"v2\"}",
  'Cookie: a=b; c=d',
  'api-key: "<redacted>" cookie: \'<redacted>\'',
  'token eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
  'AKIAIOSFODNN7EXAMPLE and ASIAIOSFODNN7EXAMPLE',
  'gho_abcdefghijklmnopqrstuvwxyz0123 github_pat_11ABCDEFG0123456789abcdef',
  `glpat-abcdefghijklmnopqrstuv ${['xoxb', '1234567890', 'abcdefghijklmnop'].join('-')} npm_abcdefghijklmnopqrstuvwxyz`,
  'pypi-AgEIcHlwaS5vcmcCJDAwMDAwMDAw sk_live_abcdefghijklmnopqrstuv rk_test_abcdefghijklmnopqrstuv',
  'sk-proj-abcdefghijklmnopqrstuvwxyz sk_abcdefghijklmnopqrstuvwxyz',
  `gsk_${'a'.repeat(52)} xai-${'b'.repeat(80)} pplx-${'c'.repeat(20)}`,
  `bastn_${'d'.repeat(16)} tgp_v1_${'e'.repeat(43)} flp_${'f'.repeat(10)} wfr_${'g'.repeat(20)}`,
  `fw_${'h'.repeat(20)} fwp_${'i'.repeat(20)} tp-${'j'.repeat(20)} psk-${'k'.repeat(8)}-${'l'.repeat(8)}`,
  `${'0'.repeat(32)}.${'A'.repeat(16)} looks like a paired token`,
  'ghp_short xoxb-short sk-short',
  'git clone https://user:s3cr3t@github.com/org/repo.git',
  'git remote add origin https://token@github.com/org/repo.git',
  'curl ftp://anonymous:me@ftp.example.com/file',
  'wget "https://bucket.s3.amazonaws.com/key?X-Amz-Signature=abcdef0123456789&X-Amz-Date=1"',
  'curl "https://storage.googleapis.com/o?x-goog-signature=abc123"',
  'curl "https://cdn.example.com/f?sig=abc%2Fdef&sv=2024"',
  'curl -u admin:password https://example.com',
  'curl --user=admin:password https://example.com',
  'curl --user admin https://example.com',
  'mongodb+srv://app:pw@cluster0.example.net/db',
  `echo "${PRIVATE_KEY}" > key.pem`,
  `cat <<EOF > id_rsa\n${PRIVATE_KEY}\nEOF`,
  '-----BEGIN OPENSSH PRIVATE KEY-----\nabc\n-----END OPENSSH PRIVATE KEY-----',
  '-----BEGIN PRIVATE KEY----- unterminated',
  'TOKEN=ghp_abcdefghijklmnopqrstuvwxyz0123 curl -H "Authorization: Bearer $TOKEN" https://u:p@h/',
  'sh -c \'export API_KEY=xyz; curl -H "x-api-key: $API_KEY" https://api\'',
  'echo password=hunter2 | tee creds.txt',
  'docker run -e POSTGRES_PASSWORD=pw -e DB_URL=postgres://a:b@c/d image',
  '',
  'git status',
  'ls -la ~/projects',
  'echo hello world',
  'rm -rf ./build && npm run build',
  'the word token appears but no assignment',
  'https://example.com/path?query=1#frag',
  'echo 😀 é 日本語',
  'a=1',
  'x'.repeat(300),
];

describe('redaction', () => {
  test.each(['"', "'"])('diagnostics redact the entire unterminated %s assignment', (quote) => {
    expect(next.sanitizeDiagnosticText(`PASSWORD=${quote}first secret tail`)).toBe(
      'PASSWORD=<redacted>',
    );
  });

  test('assignment values are read and redacted whole, in every quoting form', () => {
    const rows: readonly {
      readonly text: string;
      readonly values: readonly string[];
      readonly redacted: string;
    }[] = [
      {
        text: 'TOKEN="part\\" two" NEXT=\'three four\'',
        values: ['"part\\" two"', "'three four'"],
        redacted: 'TOKEN=<redacted> NEXT=<redacted>',
      },
      {
        text: 'TOKEN=$(printf \'%s\' "$(get-secret)") SAFE=value',
        values: ['$(printf \'%s\' "$(get-secret)")', 'value'],
        redacted: 'TOKEN=<redacted> SAFE=<redacted>',
      },
      { text: 'prefixTOKEN=value', values: ['value'], redacted: 'prefixTOKEN=<redacted>' },
      { text: 'prefix-TOKEN=value', values: [], redacted: 'prefix-TOKEN=value' },
      { text: 'git reset --hard', values: [], redacted: 'git reset --hard' },
      {
        text: 'TOKEN=ghp_abcdefghijklmnopqrstuvwxyz0123',
        values: ['ghp_abcdefghijklmnopqrstuvwxyz0123'],
        redacted: 'TOKEN=<redacted>',
      },
    ];
    for (const row of rows) {
      expect(next.getEnvAssignmentValues(row.text), row.text).toStrictEqual([...row.values]);
      expect(next.redactEnvAssignmentValues(row.text), row.text).toBe(row.redacted);
    }
    for (const row of [
      { text: 'TOKEN=abc', might: true },
      { text: 'prefix-TOKEN=value', might: true },
      { text: 'git reset --hard', might: false },
      { text: 'rm -rf /tmp/x', might: false },
      { text: '', might: false },
    ]) {
      expect(next.mightContainEnvAssignment(row.text), row.text).toBe(row.might);
    }
  });

  test('secrets in command text are replaced wherever they are spelled', () => {
    const rows: readonly { readonly text: string; readonly redacted: string }[] = [
      { text: 'git reset --hard', redacted: 'git reset --hard' },
      { text: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', redacted: '<redacted>' },
      { text: 'TOKEN=secret123 git reset --hard', redacted: 'TOKEN=<redacted> git reset --hard' },
      {
        text: 'X-Amz-Signature=bare-aws sig=bare-short https://example.com/object?X-Goog-Signature=url-google&signature=url-long&name=report.pdf',
        redacted:
          'X-Amz-Signature=<redacted> sig=<redacted> https://example.com/object?X-Goog-Signature=<redacted>&signature=<redacted>&name=report.pdf',
      },
      {
        text: "curl 'https://example.com/object?sig=url-secret'; sig=bare-secret;next",
        redacted: "curl 'https://example.com/object?sig=<redacted>'; sig=<redacted>;next",
      },
      {
        text: 'echo ok;sig=secret producer|signature=secret',
        redacted: 'echo ok;sig=<redacted> producer|signature=<redacted>',
      },
      {
        text: 'sig="double secret" signature=\'single secret\'',
        redacted: 'sig=<redacted> signature=<redacted>',
      },
      {
        text: 'https://user:password@example.com',
        redacted: 'https://<redacted>:<redacted>@example.com',
      },
      {
        text: 'git://token123@example.com/repo https://token456@example.com',
        redacted: 'git://<redacted>@example.com/repo https://<redacted>@example.com',
      },
      {
        text: 'curl -H "Authorization: Bearer abc123" https://example.com',
        redacted: 'curl -H "Authorization: <redacted>" https://example.com',
      },
      {
        text: 'curl -H "Cookie: session=secret123" -H "X-API-Key: key123" https://example.com',
        redacted: 'curl -H "Cookie: <redacted>" -H "X-API-Key: <redacted>" https://example.com',
      },
      { text: PRIVATE_KEY, redacted: '<redacted>' },
    ];
    for (const row of rows) {
      expect(next.redactSecrets(row.text), row.text).toBe(row.redacted);
    }
    for (const token of [
      ['xoxb', '123456789012', '123456789012', 'abcdefghijklmnopqrstuvwx'].join('-'),
      'npm_abcdefghijklmnopqrstuvwxyz1234567890',
      ['sk', 'live', 'abcdefghijklmnopqrstuvwx'].join('_'),
      'pypi-AgEIcHlwaS5vcmcCJDAwMDAwMDAw',
      'AKIAIOSFODNN7EXAMPLE',
    ]) {
      expect(next.redactSecrets(token), token).toBe('<redacted>');
    }
  });

  test('the diagnostic sanitizer is the assignment pass followed by the non-assignment pass', () => {
    for (const text of [
      'TOKEN=ghp_abcdefghijklmnopqrstuvwxyz0123 curl -H "Authorization: Bearer abc123" https://example.com',
      'git reset --hard',
      'https://user:password@example.com',
      PRIVATE_KEY,
    ]) {
      expect(next.sanitizeDiagnosticText(text), text).toBe(
        next.redactNonAssignmentSecrets(next.redactEnvAssignmentValues(text)),
      );
    }
    expect(next.redactEnvAssignmentValues('curl -H "Authorization: Bearer abc123"')).toBe(
      'curl -H "Authorization: Bearer abc123"',
    );
  });

  test('the fixed table both redacts and leaves text alone', () => {
    const redacted = FIXED.filter((text) => next.redactSecrets(text) !== text);
    expect(redacted.length).toBeGreaterThanOrEqual(50);
    expect(FIXED.length - redacted.length).toBeGreaterThanOrEqual(10);
    for (const text of redacted) expect(next.redactSecrets(text)).toContain('<redacted>');
  });
});
