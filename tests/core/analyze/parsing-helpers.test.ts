/**
 * Targeted unit tests for helper parsers in the safety net.
 *
 * These focus on option-scanning branches that are hard to hit via end-to-end
 * command strings, improving confidence (and coverage) of the parsing logic.
 */

import { describe, expect, test } from 'bun:test';
import { realpathSync } from 'node:fs';
import { dangerousInText } from '@/core/analyze/dangerous-text';
import { containsDangerousCode } from '@/core/analyze/interpreters';
import { extractParallelChildCommand } from '@/core/analyze/parallel';
import { extractDashCArg } from '@/core/analyze/shell-wrappers';
import { extractXargsChildCommandWithInfo } from '@/core/analyze/xargs';
import {
  extractShortOpts,
  splitShellCommands,
  splitShellCommandsWithInfo,
  stripWrappersWithInfo,
} from '@/core/shell';
import { MAX_STRIP_ITERATIONS } from '@/types';
import { createLinkedWorktreeFixture } from '../../helpers.ts';

describe('shell parsing helpers', () => {
  describe('extractDashCArg', () => {
    test('returns null for empty tokens', () => {
      expect(extractDashCArg([])).toBeNull();
    });

    test('returns null for single token', () => {
      expect(extractDashCArg(['bash'])).toBeNull();
    });

    test('extracts arg after standalone -c', () => {
      expect(extractDashCArg(['bash', '-c', 'echo ok'])).toBe('echo ok');
    });

    test('extracts arg after bundled -lc', () => {
      expect(extractDashCArg(['bash', '-lc', 'echo ok'])).toBe('echo ok');
    });

    test('extracts arg after bundled -xc', () => {
      expect(extractDashCArg(['sh', '-xc', 'rm -rf /'])).toBe('rm -rf /');
    });

    test('returns null when -c has no following arg', () => {
      expect(extractDashCArg(['bash', '-c'])).toBeNull();
    });

    test('returns null when bundled option has no following arg', () => {
      expect(extractDashCArg(['bash', '-lc'])).toBeNull();
    });

    test('handles -- separator before -c (implementation scans past it)', () => {
      expect(extractDashCArg(['bash', '--', '-c', 'echo'])).toBe('echo');
    });

    test('ignores long options starting with --', () => {
      expect(extractDashCArg(['bash', '--rcfile', 'script'])).toBeNull();
    });

    test('returns null when next token starts with dash', () => {
      expect(extractDashCArg(['bash', '-lc', '-x'])).toBeNull();
    });

    test('handles -c appearing later in tokens', () => {
      expect(extractDashCArg(['bash', '-l', '-c', 'echo ok'])).toBe('echo ok');
    });
  });

  describe('extractShortOpts', () => {
    test('stops at double dash', () => {
      // given: tokens with -Ap after -- (a filename, not options)
      // when: extracting short options
      // then: A and p should NOT be in the result
      expect(extractShortOpts(['git', 'add', '--', '-Ap'])).toEqual(new Set());
      expect(extractShortOpts(['rm', '-r', '--', '-f'])).toEqual(new Set(['-r']));
    });

    test('extracts before double dash', () => {
      // given: tokens with options before --
      // when: extracting short options
      // then: only options before -- are extracted
      expect(extractShortOpts(['git', '-v', 'add', '-n', '--', '-x'])).toEqual(
        new Set(['-v', '-n']),
      );
    });

    test('stops after short options with attached values when configured', () => {
      expect(
        extractShortOpts(['git', 'switch', '-cfeature'], {
          shortOptsWithValue: new Set(['-c', '-C']),
        }),
      ).toEqual(new Set(['-c']));
      expect(
        extractShortOpts(['git', 'switch', '-qcfeature'], {
          shortOptsWithValue: new Set(['-c', '-C']),
        }),
      ).toEqual(new Set(['-q', '-c']));
      expect(
        extractShortOpts(['git', 'switch', '-Cfixup'], {
          shortOptsWithValue: new Set(['-c', '-C']),
        }),
      ).toEqual(new Set(['-C']));
    });

    test('accepts readonly token arrays', () => {
      const tokens: readonly string[] = ['git', '-v', 'switch', '-f'];

      expect(extractShortOpts(tokens)).toEqual(new Set(['-v', '-f']));
    });
  });

  describe('splitShellCommands', () => {
    test('returns whole command when quotes are unclosed', () => {
      expect(splitShellCommands('echo "unterminated')).toEqual([['echo "unterminated']]);
    });

    test('ignores trailing shell comments without creating extra segments', () => {
      expect(splitShellCommands('echo hi # comment')).toEqual([['echo', 'hi']]);
    });

    test('extracts arithmetic substitution segments (nested parens)', () => {
      expect(splitShellCommands('echo $((1+2))')).toEqual([['echo'], ['1+2']]);
    });

    test('keeps arithmetic comparisons and shifts intact inside substitutions', () => {
      expect(splitShellCommands('echo $((2>1))')).toEqual([['echo'], ['2>1']]);
      expect(splitShellCommands('echo $((123>>1))')).toEqual([['echo'], ['123>>1']]);
      expect(splitShellCommands('echo $((1*2))')).toEqual([['echo'], ['1*2']]);
    });

    test('extracts backtick substitution segments', () => {
      expect(splitShellCommands('echo `date`')).toEqual([['echo'], ['date']]);
    });

    test('extracts $() substitution segments split on operators', () => {
      expect(splitShellCommands('echo $(rm -rf /tmp/x && echo ok)')).toEqual([
        ['echo'],
        ['rm', '-rf', '/tmp/x'],
        ['echo', 'ok'],
      ]);
    });

    test('extracts multiple backtick substitutions from one token', () => {
      expect(splitShellCommands('echo `a`:`b`')).toEqual([['echo'], ['a'], ['b'], [':']]);
    });

    test('handles nested $(...) with operators', () => {
      const result = splitShellCommands('echo $(echo $(rm -rf /tmp/x))');
      expect(result.length).toBeGreaterThan(1);
      const flat = result.flat();
      expect(flat).toContain('rm');
      expect(flat).toContain('-rf');
    });

    test('treats grouped subshells inside command substitutions as commands, not arithmetic', () => {
      expect(splitShellCommands('echo $( (git reset --hard) )')).toEqual([
        ['echo'],
        ['git', 'reset', '--hard'],
      ]);
      expect(splitShellCommands('echo $( (rm -rf /) )')).toEqual([['echo'], ['rm', '-rf', '/']]);
    });

    test('handles deeply nested $(...) substitutions', () => {
      const result = splitShellCommands('echo $(a $(b $(c)))');
      expect(result.length).toBeGreaterThan(1);
    });

    test('handles $(...) with semicolon operators', () => {
      expect(splitShellCommands('echo $(cd /tmp; rm -rf .)')).toEqual([
        ['echo'],
        ['cd', '/tmp'],
        ['rm', '-rf', '.'],
      ]);
    });

    test('handles $(...) with pipe operators', () => {
      expect(splitShellCommands('echo $(cat file | rm -rf /)')).toEqual([
        ['echo'],
        ['cat', 'file'],
        ['rm', '-rf', '/'],
      ]);
    });

    test('handles unterminated $() substitution (no hang, still extracts tokens)', () => {
      expect(splitShellCommands('echo $(rm -rf /tmp/x')).toEqual([
        ['echo'],
        ['rm', '-rf', '/tmp/x'],
      ]);
    });

    test('drops plain redirect targets and attached fd prefixes', () => {
      expect(splitShellCommands('rm -rf ./foo 2>/dev/null')).toEqual([['rm', '-rf', './foo']]);
      expect(splitShellCommands('rm -rf ./foo 2>&1')).toEqual([['rm', '-rf', './foo']]);
      expect(splitShellCommands('rm -rf ./foo 2>>/tmp/log')).toEqual([['rm', '-rf', './foo']]);
    });

    test('keeps spaced numeric args and quoted redirect literals intact', () => {
      expect(splitShellCommands('rm -rf 123>/dev/null')).toEqual([['rm', '-rf']]);
      expect(splitShellCommands('rm -rf 7 > /dev/null')).toEqual([['rm', '-rf', '7']]);
      expect(splitShellCommands('rm -rf 123 >/dev/null')).toEqual([['rm', '-rf', '123']]);
      expect(splitShellCommands('rm -rf ./foo 2 > /dev/null')).toEqual([
        ['rm', '-rf', './foo', '2'],
      ]);
      expect(splitShellCommands("echo '2>/dev/null'")).toEqual([['echo', '2>/dev/null']]);
    });

    test('keeps nested command substitutions in redirect targets analyzable', () => {
      expect(splitShellCommands('echo x >$(git reset --hard)')).toEqual([
        ['echo', 'x'],
        ['git', 'reset', '--hard'],
      ]);
    });

    test('reports attached command substitution metadata generically', () => {
      expect(splitShellCommands('git reset --hard$(printf HEAD~1)')).toEqual([
        ['printf', 'HEAD~1'],
        ['git', 'reset', '--hard'],
      ]);
      expect(splitShellCommandsWithInfo('git reset --hard$(printf HEAD~1)')).toEqual([
        { tokens: ['printf', 'HEAD~1'], hasDynamicSubstitution: false },
        { tokens: ['git', 'reset', '--hard'], hasDynamicSubstitution: true },
      ]);
      expect(splitShellCommandsWithInfo('rm -rf /tmp/$(printf x)')).toEqual([
        { tokens: ['printf', 'x'], hasDynamicSubstitution: false },
        { tokens: ['rm', '-rf', '/tmp/'], hasDynamicSubstitution: true },
      ]);
    });

    test('drops glob redirect targets instead of treating them as args', () => {
      expect(splitShellCommands('echo > *.log')).toEqual([['echo']]);
    });

    test('drops glob redirect targets inside command substitutions', () => {
      expect(splitShellCommands('echo $(echo > *.log)')).toEqual([['echo'], ['echo']]);
    });

    test('keeps attached command substitutions in redirect targets analyzable', () => {
      expect(splitShellCommands('rm -rf /tmp/foo >file$(git reset --hard)')).toEqual([
        ['git', 'reset', '--hard'],
        ['rm', '-rf', '/tmp/foo'],
      ]);
      expect(splitShellCommands('rm -rf /tmp/foo >$TMPDIR/$(rm -rf /)')).toEqual([
        ['rm', '-rf', '/'],
        ['rm', '-rf', '/tmp/foo'],
      ]);
    });

    test('keeps operands after redirects in the same segment', () => {
      expect(splitShellCommands('rm -rf 2>/dev/null /')).toEqual([['rm', '-rf', '/']]);
      expect(splitShellCommands('git checkout 2>/dev/null -- foo')).toEqual([
        ['git', 'checkout', '--', 'foo'],
      ]);
    });

    test('keeps nested command substitutions visible inside arithmetic expansion', () => {
      const gitResult = splitShellCommands('echo $(( $(git reset --hard) + 1 ))');
      expect(gitResult).toContainEqual(['git', 'reset', '--hard']);

      const rmResult = splitShellCommands('echo $(( $(rm -rf /) + 1 ))');
      expect(rmResult).toContainEqual(['rm', '-rf', '/']);
    });

    test('keeps adjacent nested command substitutions visible inside arithmetic expansion', () => {
      const gitResult = splitShellCommands('echo $((foo+$(git reset --hard)))');
      expect(gitResult).toContainEqual(['git', 'reset', '--hard']);

      const rmResult = splitShellCommands('echo $((1+$(rm -rf /)))');
      expect(rmResult).toContainEqual(['rm', '-rf', '/']);
    });

    test('keeps backtick command substitutions visible inside arithmetic expansion', () => {
      expect(splitShellCommands('echo $((`git reset --hard` + 1))')).toContainEqual([
        'git',
        'reset',
        '--hard',
      ]);
      expect(splitShellCommands('echo $((foo`git reset --hard`bar))')).toContainEqual([
        'git',
        'reset',
        '--hard',
      ]);
    });

    test('flushes arithmetic text before a spaced nested command substitution', () => {
      expect(splitShellCommands('echo $((1 + $(git status)))')).toEqual([
        ['echo'],
        ['1+'],
        ['git', 'status'],
      ]);
    });

    test('keeps nested arithmetic parentheses intact', () => {
      expect(splitShellCommands('echo $(((1+2)))')).toEqual([['echo'], ['(1+2)']]);
    });

    test('handles malformed arithmetic substitutions without hanging', () => {
      expect(splitShellCommands('echo $((1+(2))')).toEqual([['echo'], ['1+(2)']]);
      expect(splitShellCommands('echo $((1+2)')).toEqual([['echo'], ['1+2']]);
    });

    test('handles arithmetic substitutions that reach EOF without a closing parenthesis', () => {
      expect(splitShellCommands('echo $((1+2')).toEqual([['echo'], ['1+2']]);
      expect(splitShellCommands('echo $((1+$(git status)')).toEqual([
        ['echo'],
        ['1+'],
        ['git', 'status'],
      ]);
    });

    test('does not treat quoted arithmetic expansion as command substitution', () => {
      expect(splitShellCommands('echo "$(( rm -rf /x ))"')).toEqual([['echo', '$(( rm -rf /x ))']]);
      expect(splitShellCommands('echo "$(( foo + bar ))"')).toEqual([['echo', '$(( foo + bar ))']]);
    });

    test('keeps backtick substitutions inside quoted redirect targets analyzable', () => {
      expect(splitShellCommands('echo x >"`git reset --hard`"')).toEqual([
        ['git', 'reset', '--hard'],
        ['echo', 'x'],
      ]);
    });

    test('keeps bare backtick redirect targets analyzable', () => {
      expect(splitShellCommands('rm -rf /tmp/foo >`git reset --hard`')).toEqual([
        ['rm', '-rf', '/tmp/foo'],
        ['git', 'reset', '--hard'],
      ]);
      expect(splitShellCommands('echo $(rm -rf /tmp/foo >`git reset --hard`)')).toEqual([
        ['echo'],
        ['rm', '-rf', '/tmp/foo'],
        ['git', 'reset', '--hard'],
      ]);
    });

    test('drops redirect targets inside nested command substitutions', () => {
      expect(splitShellCommands('echo $(rm -rf /tmp/foo 2>/dev/null)')).toEqual([
        ['echo'],
        ['rm', '-rf', '/tmp/foo'],
      ]);
    });

    test('ignores missing redirect targets without creating empty segments', () => {
      expect(splitShellCommands('echo >')).toEqual([['echo']]);
    });

    test('keeps process substitutions analyzable as separate segments', () => {
      expect(splitShellCommands('echo <(git reset --hard)')).toEqual([
        ['echo'],
        ['git', 'reset', '--hard'],
      ]);
      expect(splitShellCommands('cat >(git reset --hard)')).toEqual([
        ['cat'],
        ['git', 'reset', '--hard'],
      ]);
      expect(splitShellCommands('echo x > >(git reset --hard)')).toEqual([
        ['echo', 'x'],
        ['git', 'reset', '--hard'],
      ]);
      expect(splitShellCommands('echo foo < <(git reset --hard)')).toEqual([
        ['echo', 'foo'],
        ['git', 'reset', '--hard'],
      ]);
    });

    test('keeps arguments after quoted backticks in redirect targets visible', () => {
      expect(splitShellCommands("git checkout >'file`name' -- foo")).toEqual([
        ['git', 'checkout', '--', 'foo'],
      ]);
      expect(splitShellCommands("rm -rf >'file`name' /")).toEqual([['rm', '-rf', '/']]);
    });

    test('does not treat single-quoted backticks in redirect targets as commands', () => {
      expect(splitShellCommands("echo >'a`git reset --hard`b'")).toEqual([['echo']]);
    });

    test('keeps attached backtick substitutions analyzable outside redirect targets', () => {
      expect(splitShellCommands('echo foo`git reset --hard`bar')).toContainEqual([
        'git',
        'reset',
        '--hard',
      ]);
    });

    test('keeps quote boundary command substitutions analyzable', () => {
      expect(splitShellCommands("echo 'b\\'$(rm -rf /)'c'")).toContainEqual(['rm', '-rf', '/']);
      expect(splitShellCommands("echo 'b\\'$(printf ok)'c'")).toContainEqual(['printf', 'ok']);
    });

    test('does not treat escaped or quoted inline substitutions as executable commands', () => {
      expect(splitShellCommands('echo $(printf "x\\$(git status)y")')).toEqual([
        ['echo'],
        ['printf', 'x$(git status)y'],
      ]);
      expect(splitShellCommands('echo $(printf "x\'$(git status)\'y")')).toEqual([
        ['echo'],
        ['printf', "x'$(git status)'y"],
      ]);
      expect(splitShellCommands('echo $(printf "x\\"$(git status)\\"y")')).toEqual([
        ['echo'],
        ['printf', 'x"$(git status)"y'],
      ]);
    });

    test('tracks nested parentheses inside inline command substitutions', () => {
      expect(splitShellCommands('echo "x$(printf y(z))"')).toEqual([
        ['printf', 'y', 'z'],
        ['echo', 'x$(printf y(z))'],
      ]);
    });

    test('tracks quoted and escaped content while scanning inline command substitutions', () => {
      expect(splitShellCommands('echo "x$(printf \'y\')w"')).toEqual([
        ['printf', 'y'],
        ['echo', "x$(printf 'y')w"],
      ]);
      expect(splitShellCommands('echo \'x$(printf "y")w\'')).toEqual([
        ['printf', 'y'],
        ['echo', 'x$(printf "y")w'],
      ]);
      expect(splitShellCommands("echo 'x$(printf y\\(z\\))w'")).toEqual([
        ['printf', 'y(z)'],
        ['echo', 'x$(printf y\\(z\\))w'],
      ]);
      expect(splitShellCommands("echo 'x$(printf y(z)'")).toEqual([['echo', 'x$(printf y(z)']]);
    });

    test('preserves top level glob arguments', () => {
      expect(splitShellCommands('git add *.ts')).toEqual([['git', 'add', '*.ts']]);
    });

    test('preserves glob arguments inside command substitutions', () => {
      expect(splitShellCommands('echo $(git *.ts)')).toEqual([['echo'], ['git', '*.ts']]);
    });

    test('preserves glob arguments while reconstructing redirect target substitutions', () => {
      expect(splitShellCommands('echo >foo$(git *.ts)')).toEqual([['git', '*.ts'], ['echo']]);
    });

    test('handles escaped backticks in redirect targets without hanging', () => {
      expect(splitShellCommands('echo x >`a\\` b`')).toEqual([
        ['echo', 'x'],
        ['a`', 'b'],
      ]);
    });

    test('extracts process substitution inside command substitution', () => {
      const result = splitShellCommands('echo $(diff <(cat file1) file2)');
      expect(result).toContainEqual(['cat', 'file1']);
      expect(result).toContainEqual(['diff']);
      expect(result).toContainEqual(['file2']);
    });

    test('keeps attached backtick suffix inside command substitution', () => {
      const result = splitShellCommands('echo $(cd `pwd`/subdir)');
      const flat = result.flat();
      expect(flat).toContain('cd');
      expect(flat.some((t) => t.includes('/subdir'))).toBe(true);
    });

    test('extracts attached command substitution inside command substitution', () => {
      const result = splitShellCommands('echo $(echo prefix$(inner cmd))');
      expect(result).toContainEqual(['inner', 'cmd']);
      const flat = result.flat();
      expect(flat).toContain('echo');
      expect(flat.some((t) => t.includes('prefix'))).toBe(true);
    });

    test('handles unclosed backtick without hanging', () => {
      const result = splitShellCommands('echo `unclosed');
      expect(result.length).toBeGreaterThanOrEqual(1);
      const flat = result.flat();
      expect(flat).toContain('echo');
    });

    test('handles operator token inside parenthesized redirect target', () => {
      const result = splitShellCommands('echo >log$(echo x | wc)');
      expect(result).toContainEqual(['echo', 'x']);
    });
  });

  describe('stripWrappersWithInfo', () => {
    test('strips sudo options that consume a value', () => {
      const result = stripWrappersWithInfo(['sudo', '-u', 'root', 'rm', '-rf', '/tmp/a']);
      expect(result.tokens).toEqual(['rm', '-rf', '/tmp/a']);
    });

    test('strips sudo options that do not consume a value', () => {
      const result = stripWrappersWithInfo(['sudo', '-n', 'rm', '-rf', '/tmp/a']);
      expect(result.tokens).toEqual(['rm', '-rf', '/tmp/a']);
    });

    test('strips env -C=...', () => {
      const result = stripWrappersWithInfo(['env', '-C=/tmp', 'rm', '-rf']);
      expect(result.tokens).toEqual(['rm', '-rf']);
    });

    test('invalid env -S split string makes cwd unknown', () => {
      const result = stripWrappersWithInfo(['env', '-S', '"unterminated', 'git', 'status'], '/tmp');
      expect(result.tokens).toEqual(['git', 'status']);
      expect(result.cwd).toBeNull();
    });

    test('empty env chdir target makes cwd unknown', () => {
      const result = stripWrappersWithInfo(['env', '-C', '', 'git', 'status'], '/tmp');
      expect(result.tokens).toEqual(['git', 'status']);
      expect(result.cwd).toBeNull();
    });

    test('relative env chdir target with unknown cwd remains unknown', () => {
      const result = stripWrappersWithInfo(['env', '-C', 'relative', 'git', 'status'], null);
      expect(result.tokens).toEqual(['git', 'status']);
      expect(result.cwd).toBeNull();
    });

    test.skipIf(process.platform !== 'win32')(
      'resolves wrapper cwd with Windows separators',
      () => {
        const fixture = createLinkedWorktreeFixture();
        try {
          const result = stripWrappersWithInfo(
            ['env', '-C', fixture.mainWorktree, '-C', '..\\linked', 'git', 'status'],
            fixture.rootDir,
          );
          expect(result.tokens).toEqual(['git', 'status']);
          expect(result.cwd).toBe(realpathSync(fixture.linkedWorktree));
        } finally {
          fixture.cleanup();
        }
      },
    );

    test('strips command -pv and -- separator', () => {
      const result = stripWrappersWithInfo(['command', '-pv', '--', 'git', 'status']);
      expect(result.tokens).toEqual(['git', 'status']);
    });

    test('captures env assignments after hitting max strip iterations', () => {
      const tokens = Array.from({ length: MAX_STRIP_ITERATIONS }, () => 'sudo');
      tokens.push('FOO=bar', 'rm', '-rf');

      const result = stripWrappersWithInfo(tokens);
      expect(result.tokens).toEqual(['rm', '-rf']);
      expect(result.envAssignments.get('FOO')).toBe('bar');
    });

    test('strips nested wrappers across iterations and preserves env assignments', () => {
      const result = stripWrappersWithInfo([
        'sudo',
        'env',
        'FOO=1',
        'sudo',
        'command',
        '--',
        'rm',
        '-rf',
        '/tmp/a',
      ]);
      expect(result.tokens).toEqual(['rm', '-rf', '/tmp/a']);
      expect(result.envAssignments.get('FOO')).toBe('1');
    });

    test("drops leading tokens containing '=' that are not NAME=value assignments", () => {
      // Intentionally conservative: only strict NAME=value is treated as an env assignment.
      // Shell-legal forms like NAME+=value are dropped to reach the real command head.
      const result = stripWrappersWithInfo(['FOO+=bar', 'rm', '-rf']);
      expect(result.tokens).toEqual(['rm', '-rf']);
      expect(result.envAssignments.get('FOO')).toBeUndefined();
    });

    test('captures empty env assignment values', () => {
      const result = stripWrappersWithInfo(['FOO=', 'rm', '-rf']);
      expect(result.tokens).toEqual(['rm', '-rf']);
      expect(result.envAssignments.get('FOO')).toBe('');
    });
  });
});

describe('dangerousInText', () => {
  test('detects rm -rf variants', () => {
    expect(dangerousInText('rm -rf /tmp/x')).toBe('rm -rf');
    expect(dangerousInText('rm -R -f /tmp/x')).toBe('rm -rf');
    expect(dangerousInText('rm -fr /tmp/x')).toBe('rm -rf');
    expect(dangerousInText('rm -f -r /tmp/x')).toBe('rm -rf');
    expect(dangerousInText('rm --recursive --force /tmp/x')).toBe('rm -rf');
    expect(dangerousInText('rm --force --recursive /tmp/x')).toBe('rm -rf');
  });

  test('detects with leading whitespace (trimStart)', () => {
    expect(dangerousInText('   rm -rf /tmp/x')).toBe('rm -rf');
  });

  test('detects key git patterns', () => {
    expect(dangerousInText('git reset --hard')).toBe('git reset --hard');
    expect(dangerousInText('git clean -f')).toBe('git clean -f');
    expect(dangerousInText('git clean -fd')).toBe('git clean -f');
    expect(dangerousInText('git checkout -f')).toBe('git checkout --force');
    expect(dangerousInText('git checkout --force')).toBe('git checkout --force');
    expect(dangerousInText('git tag -d v1')).toBe('git tag -d');
    expect(dangerousInText('git branch --delete --force feature')).toBe('git branch -D');
    expect(dangerousInText('git branch --force --delete feature')).toBe('git branch -D');
  });

  test('allows checkout branch creation patterns with f in branch name', () => {
    expect(dangerousInText('git checkout -bfeature')).toBeNull();
    expect(dangerousInText('git checkout -Bfixup')).toBeNull();
  });

  test('skips find -delete when text starts with echo/rg', () => {
    expect(dangerousInText('echo "find . -delete')).toBeNull();
    expect(dangerousInText('rg "find . -delete')).toBeNull();
  });
});

describe('containsDangerousCode', () => {
  test('allows rm -r paths with hyphenated segments ending in f', () => {
    expect(containsDangerousCode('import os; os.system("rm -r /builds/project-stuff")')).toBe(
      false,
    );
    expect(containsDangerousCode('import os; os.system("rm -r path/to/proof")')).toBe(false);
  });

  test('detects rm recursive force option tokens', () => {
    expect(containsDangerousCode('import os; os.system("rm -rf /some/path")')).toBe(true);
    expect(containsDangerousCode('import os; os.system("rm -R -f /some/path")')).toBe(true);
    expect(containsDangerousCode('import os; os.system("rm --force --recursive /some/path")')).toBe(
      true,
    );
  });
});

describe('parallel parsing helpers', () => {
  describe('extractParallelChildCommand', () => {
    test('returns empty when ::: is first token after parallel', () => {
      // When ::: is the first token after parallel (and options),
      // it returns empty because args follow :::
      expect(extractParallelChildCommand(['parallel', ':::'])).toEqual([]);
    });

    test('extracts command with -- separator', () => {
      expect(extractParallelChildCommand(['parallel', '--', 'rm', '-rf'])).toEqual(['rm', '-rf']);
    });

    test('returns command and all following tokens', () => {
      // The function returns all tokens starting from the first non-option
      expect(extractParallelChildCommand(['parallel', 'rm', '-rf'])).toEqual(['rm', '-rf']);
    });

    test('returns command including ::: marker when command comes first', () => {
      // If command tokens appear before :::, all of them are returned
      expect(extractParallelChildCommand(['parallel', 'rm', '-rf', ':::', '/'])).toEqual([
        'rm',
        '-rf',
        ':::',
        '/',
      ]);
    });

    test('consumes options', () => {
      expect(extractParallelChildCommand(['parallel', '-j4', '--', 'rm', '-rf'])).toEqual([
        'rm',
        '-rf',
      ]);
    });

    test('consumes --option=value', () => {
      expect(extractParallelChildCommand(['parallel', '--foo=bar', 'rm', '-rf'])).toEqual([
        'rm',
        '-rf',
      ]);
    });

    test('consumes options that take a value', () => {
      expect(extractParallelChildCommand(['parallel', '-S', 'sshlogin', 'rm', '-rf'])).toEqual([
        'rm',
        '-rf',
      ]);
    });

    test('consumes -j value form', () => {
      expect(extractParallelChildCommand(['parallel', '-j', '4', 'rm', '-rf'])).toEqual([
        'rm',
        '-rf',
      ]);
    });

    test('skips unknown short option', () => {
      expect(extractParallelChildCommand(['parallel', '-X', 'rm', '-rf'])).toEqual(['rm', '-rf']);
    });

    test('empty for just parallel', () => {
      expect(extractParallelChildCommand(['parallel'])).toEqual([]);
    });
  });
});

describe('xargs parsing helpers', () => {
  test('replacement token from -I option', () => {
    const result = extractXargsChildCommandWithInfo(['xargs', '-I', '{}', 'rm', '-rf', '{}']);
    expect(result.replacementToken).toBe('{}');
  });

  test('replacement token from -I attached', () => {
    const result = extractXargsChildCommandWithInfo(['xargs', '-I%', 'rm', '-rf', '%']);
    expect(result.replacementToken).toBe('%');
  });

  test('replacement token from --replace defaults to braces', () => {
    const result = extractXargsChildCommandWithInfo(['xargs', '--replace', 'rm', '-rf', '{}']);
    expect(result.replacementToken).toBe('{}');
  });

  test('replacement token from --replace= empty defaults to braces', () => {
    const result = extractXargsChildCommandWithInfo(['xargs', '--replace=', 'rm', '-rf', '{}']);
    expect(result.replacementToken).toBe('{}');
  });

  test('replacement token from --replace=CUSTOM', () => {
    const result = extractXargsChildCommandWithInfo(['xargs', '--replace=FOO', 'rm', '-rf', 'FOO']);
    expect(result.replacementToken).toBe('FOO');
  });

  test('no replacement token when not specified', () => {
    const result = extractXargsChildCommandWithInfo(['xargs', 'rm', '-rf']);
    expect(result.replacementToken).toBeNull();
  });
});
