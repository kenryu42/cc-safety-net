import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import { createBudget } from '@/core/budget';
import { parseCommand } from '@/core/shell/parse';
import {
  ADOPT_AS_OPERAND,
  type GuardSyntax,
  type GuardWalkVisitor,
  readGuardSyntax,
  readGuardTokens,
  walkGuardSyntax,
} from '@/gate/guards/guard-walk';
import { writeTree } from '../../helpers/fixture-tree';
import { environmentFor } from '../../helpers/temp-home';

let root = '';
let home = '';
let workspace = '';

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'guard-walk-'));
  home = join(root, 'home');
  workspace = join(root, 'work');
  writeTree(root, { home: null, tmp: null, 'work/sub': null, 'work/other': null });
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

const environment = () => environmentFor(home, { HOME: home, TMPDIR: join(root, 'tmp') });

const canonical = (...parts: string[]) =>
  join(realpathSync(root), ...parts)
    .split(sep)
    .join('/');

const read = (source: string, dialect: 'posix' | 'powershell' = 'posix') =>
  readGuardSyntax(source, parseCommand(source, dialect));

function observe(
  source: string,
  overrides: Partial<GuardWalkVisitor> = {},
  cwd = workspace,
  dialect: 'posix' | 'powershell' = 'posix',
) {
  const observations: string[] = [];
  const result = walkGuardSyntax(read(source, dialect), cwd, environment(), createBudget(), {
    word: (text) => text,
    segment: (tokens, state, pipeProducer, boundary, shellWords) => {
      observations.push(
        `segment ${JSON.stringify(tokens)} cwd=${state.cwd} pipe=${JSON.stringify(pipeProducer)} boundary=${boundary}${shellWords.size === 0 ? '' : ` shell=${JSON.stringify([...shellWords])}`}`,
      );
      return null;
    },
    redirection: (redirection) => {
      observations.push(
        `redirect ${redirection.operator} ${redirection.role} ${redirection.targetOrder} ${redirection.target}`,
      );
      return null;
    },
    ...overrides,
  });
  return { observations, result };
}

const segments = (source: string) =>
  observe(source).observations.filter((observation) => observation.startsWith('segment '));

const words = (source: string) =>
  readGuardTokens(read(source)).flatMap((token) => (token.kind === 'word' ? [token.text] : []));

describe('gate/guards/guard-walk', () => {
  test('reports redirections with their operator, role and target order', () => {
    expect(
      observe('cat .env < input > output <<< data >| legacy').observations.filter((observation) =>
        observation.startsWith('redirect '),
      ),
    ).toStrictEqual([
      'redirect < file-read immediate input',
      'redirect > file-write immediate output',
      'redirect <<< here-data legacy-segment data',
      'redirect >| file-write legacy-segment legacy',
    ]);
    expect(observe('cmd 2>&1').observations).toStrictEqual([
      'redirect >& file-write immediate 1',
      `segment ["cmd","2"] cwd=${workspace} pipe=null boundary=null shell=[1]`,
    ]);
    expect(
      observe('cmd >| legacy arg', { redirection: () => ADOPT_AS_OPERAND }).observations,
    ).toStrictEqual([
      `segment ["cmd","legacy","arg"] cwd=${workspace} pipe=null boundary=null shell=[1]`,
    ]);
    expect(observe('cmd $(echo x) 2>&1 arg').observations).toStrictEqual([
      `segment ["cmd","${'${}'}","echo","x"] cwd=${workspace} pipe=null boundary=null`,
      'redirect >& file-write immediate 1',
      `segment ["cmd","${'${}'}","2","arg"] cwd=${workspace} pipe=null boundary=null shell=[2]`,
    ]);
    expect(segments('cmd 2>&1; next 1>&2')).toStrictEqual([
      `segment ["cmd","2"] cwd=${workspace} pipe=null boundary=; shell=[1]`,
      `segment ["next","1"] cwd=${workspace} pipe=null boundary=null shell=[1]`,
    ]);
    expect(observe('echo a > *.log').observations).toContain(
      'redirect > file-write immediate *.log',
    );
    for (const source of ['cat << data', 'cat<<data']) {
      expect(
        observe(source).observations.filter((observation) => observation.startsWith('redirect ')),
        source,
      ).toStrictEqual(['redirect << here-data legacy-segment data']);
    }
  });

  test('a group, a substitution and a glob shape the segment around their words', () => {
    expect(segments('{ rm -rf /project/cache; }')).toStrictEqual([
      `segment [] cwd=${workspace} pipe=null boundary={`,
      `segment ["rm","-rf","/project/cache"] cwd=${workspace} pipe=null boundary=;`,
      `segment [] cwd=${workspace} pipe=null boundary=}`,
      `segment [] cwd=${workspace} pipe=null boundary=null`,
    ]);
    expect(segments('cat $(pwd)/.env')).toStrictEqual([
      `segment ["cat","\${}","pwd"] cwd=${workspace} pipe=null boundary=null`,
      `segment ["cat","\${}","/.env"] cwd=${workspace} pipe=null boundary=null`,
    ]);
    expect(words('rm *.env')).toStrictEqual(['rm']);
    expect(words('$FOO/.env')).toStrictEqual(['${FOO}/.env']);
    expect(words("python -c open('.env')")).toContain('.env');
  });

  test('a function body is read only where the function is called', () => {
    expect(words('cleanup() { rm -rf /project/cache; }')).toStrictEqual([]);
    expect(words('cleanup() { rm -rf /project/cache; }; X=1 cleanup')).toStrictEqual([
      'X=1',
      'cleanup',
      'rm',
      '-rf',
      '/project/cache',
    ]);
    expect(words('cleanup() { rm -rf /project/cache; }; time -p cleanup')).toStrictEqual([
      'time',
      '-p',
      'cleanup',
      'rm',
      '-rf',
      '/project/cache',
    ]);
    expect(read('loop() { loop; }; loop').status).toBe('structural-limit');
  });

  test('a nested shell keeps its own directory, and nothing else does', () => {
    const cwdOf = (source: string) =>
      segments(source)
        .at(-1)
        ?.match(/cwd=(\S+)/)?.[1] ?? null;
    for (const source of [
      '(cd sub && pwd) && ls',
      'cat `cd sub; pwd`; ls',
      'cat <(cd sub; pwd); ls',
      'tee >(cd sub; cat); ls',
      'cat $(cd sub; pwd); ls',
    ]) {
      expect(cwdOf(source), source).toBe(workspace);
    }
    for (const source of [
      '{ cd sub; } && ls',
      'f() { cd sub; }; f; ls',
      'cd sub && ls',
      'X=$((1 + 2)); cd sub; ls',
    ]) {
      expect(cwdOf(source), source).toBe(canonical('work', 'sub'));
    }
    expect(cwdOf('cd sub && cd - && ls')).toBe(workspace);
    expect(cwdOf('cd - && ls')).toBe(workspace);
    expect(segments('cat $(cd sub; pwd)/x')).toStrictEqual([
      `segment ["cat","\${}","cd","sub"] cwd=${workspace} pipe=null boundary=;`,
      `segment ["pwd"] cwd=${workspace} pipe=null boundary=null`,
      `segment ["cat","\${}","/x"] cwd=${workspace} pipe=null boundary=null`,
    ]);
  });

  test('a heredoc body is read as its own segments, and its fallbacks are reported', () => {
    expect(segments('cat <<EOF\ncat .env\nEOF')).toStrictEqual([
      `segment ["cat"] cwd=${workspace} pipe=null boundary=;`,
      `segment ["cat",".env"] cwd=${workspace} pipe=null boundary=;`,
      `segment ["EOF"] cwd=${workspace} pipe=null boundary=null`,
    ]);
    expect(words("cat <<'EOF'\ncat .env\nEOF")).not.toContain('.env');
    expect(read("cat <<'EOF'\ncat .env\nEOF").source).not.toContain('.env');
    expect(words("bash <<'EOF'\ncat .env\nEOF")).toContain('.env');
    expect(words("cat <<'EOF'\ncat .env")).toContain('.env');
    expect(read('cat "${X:=proof-target}"').assignmentFallbacks).toStrictEqual(['proof-target']);
    expect(read("cat '${X:=proof-target}'").assignmentFallbacks).toStrictEqual([]);
  });

  test('a quoted heredoc to a code interpreter is handed over instead of read as shell', () => {
    expect(words("python3 - <<'EOF'\ncat .env\nEOF")).not.toContain('.env');
    expect(read("python3 - <<'EOF'\ncat .env\nEOF").source).not.toContain('.env');
    expect(words('python3 - <<EOF\ncat .env\nEOF')).toContain('.env');

    const bodies = (source: string) => {
      const seen: (string | undefined)[] = [];
      observe(source, {
        redirection: (redirection) => {
          seen.push(redirection.body);
          return null;
        },
      });
      return seen;
    };
    expect(bodies("python3 - <<'EOF'\ncat .env\nEOF")).toStrictEqual(['cat .env\n']);
    expect(bodies("bash <<'EOF'\ncat .env\nEOF")).toStrictEqual([undefined]);

    // The body travels with the words of the command that owns it, wrappers included.
    const consumers = (source: string) => {
      const seen: (readonly string[] | undefined)[] = [];
      observe(source, {
        redirection: (redirection) => {
          seen.push(redirection.consumer);
          return null;
        },
      });
      return seen;
    };
    expect(consumers("time python3 - <<'EOF'\ncat .env\nEOF")).toStrictEqual([['python3', '-']]);
    expect(consumers("env python3 - <<'EOF'\ncat .env\nEOF")).toStrictEqual([['python3', '-']]);
    expect(consumers("sudo -u root python3 - <<'EOF'\ncat .env\nEOF")).toStrictEqual([
      ['python3', '-'],
    ]);
    expect(consumers("env -P /usr/bin python3 - <<'EOF'\ncat .env\nEOF")).toStrictEqual([
      ['python3', '-'],
    ]);
    expect(consumers("command -p python3 - <<'EOF'\ncat .env\nEOF")).toStrictEqual([
      ['python3', '-'],
    ]);
    expect(consumers('echo "$(python3 - <<\'EOF\'\ncat .env\nEOF\n)"')).toStrictEqual([
      ['python3', '-'],
    ]);
  });

  test('reports the status a read could reach', () => {
    const rows: readonly { readonly source: string; readonly status: GuardSyntax['status'] }[] = [
      { source: 'echo ok', status: 'complete' },
      { source: 'echo $(foo', status: 'complete' },
      { source: 'echo "x', status: 'unclosed-quote' },
      { source: 'echo ${', status: 'invalid' },
      { source: 'fan() { fan; fan; }; fan', status: 'structural-limit' },
    ];
    for (const row of rows) {
      expect(read(row.source).status, row.source).toBe(row.status);
    }
    expect(words('echo "x')).toStrictEqual([]);
    expect(observe('echo "x').observations).toStrictEqual([
      `segment [] cwd=${workspace} pipe=null boundary=null`,
    ]);
  });

  test('a segment carries the one that piped into it', () => {
    expect(segments('cat secret | xargs rm')).toStrictEqual([
      `segment ["cat","secret"] cwd=${workspace} pipe=null boundary=|`,
      `segment ["xargs","rm"] cwd=${workspace} pipe=["cat","secret"] boundary=null`,
    ]);
    expect(segments('; cat secret')).toStrictEqual([
      `segment [] cwd=${workspace} pipe=null boundary=;`,
      `segment ["cat","secret"] cwd=${workspace} pipe=null boundary=null`,
    ]);
  });

  test('a visitor adopts a legacy-segment target as an operand, or reads it as a target', () => {
    const adopting = observe('cat <<< /home/agent/.ssh/config', {
      redirection: (redirection) =>
        redirection.targetOrder === 'legacy-segment' ? ADOPT_AS_OPERAND : null,
    });
    expect(adopting.observations).toStrictEqual([
      `segment ["cat","/home/agent/.ssh/config"] cwd=${workspace} pipe=null boundary=null shell=[1]`,
    ]);
    expect(segments('cat <<< /home/agent/.ssh/config')).toStrictEqual([
      `segment ["cat"] cwd=${workspace} pipe=null boundary=null`,
    ]);
  });

  test('the first target a callback returns is the walk answer, and stops the walk', () => {
    const stopped = observe('rm sub && rm other', {
      segment: (tokens) => (tokens.includes('sub') ? tokens.join(' ') : null),
    });
    expect(stopped.result).toBe('rm sub');
    expect(stopped.observations).toStrictEqual([]);
    const redirected = observe('echo hi > secret', {
      redirection: (redirection) => redirection.target,
    });
    expect(redirected.result).toBe('secret');
  });

  test('the word mapper runs before a token joins its segment, and the tracked cd reads it', () => {
    const mapped = observe('cd SUB && ls', { word: (text) => text.toLowerCase() });
    expect(mapped.observations).toStrictEqual([
      `segment ["cd","sub"] cwd=${workspace} pipe=null boundary=&&`,
      `segment ["ls"] cwd=${canonical('work', 'sub')} pipe=null boundary=null`,
    ]);
  });

  test('a PowerShell command follows PowerShell word rules', () => {
    expect(
      observe('Remove-Item -Recurse C:\\Temp', {}, workspace, 'powershell').observations,
    ).toStrictEqual([
      `segment ["Remove-Item","-Recurse","C:\\\\Temp"] cwd=${workspace} pipe=null boundary=null`,
    ]);
    expect(
      readGuardTokens(read('Remove-Item $env:USERPROFILE\\x', 'powershell')).flatMap((token) =>
        token.kind === 'word' ? [token.text] : [],
      ),
    ).toStrictEqual(['Remove-Item', '${env:USERPROFILE}\\x']);
  });
});
