import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createBudget } from '@/core/budget';
import { processPathResolver } from '@/core/environment';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import { parseCommand } from '@/core/shell/parse';
import { projectCommandViews } from '@/core/shell/traversal';
import {
  analysisWordText,
  analyzedViewWords,
  isLiteralExecutionSourceWord,
  textCommandWords,
} from '@/gate/analyzer/command-words';
import { isDataOnlyQuotedAssignment } from '@/gate/analyzer/deferred-assignment';
import { analyzeDeviceCommandMatch } from '@/gate/analyzer/device';
import type { GitConfigCountResolution } from '@/gate/analyzer/git/env';
import {
  getGitEnvValue,
  hasConfigAffectingEnvAssignment,
  hasGitSshEnvAssignment,
  isGitContextEnvOverrideName,
  isTrackedGitEnvName,
  parseGitContextAppendEnvAssignment,
  resolveGitConfigCount,
} from '@/gate/analyzer/git/env';
import {
  extractGitSubcommandAndRest,
  hasGitCommandLineSshCommandConfig,
  splitAtDoubleDash,
} from '@/gate/analyzer/git/parse';
import {
  isPersistentHeredocFilePath,
  resolveTrackedHeredocPath,
} from '@/gate/analyzer/heredoc-files';
import { hasRecursiveForceFlags, hasRecursiveOption } from '@/gate/analyzer/rm-flags';
import {
  chargeNativeLinearPass,
  chargeScan,
  fixedAt,
  hasWordBoundaryAfter,
  isAsciiWord,
  isEcmaWhitespace,
  isJsLineTerminator,
  isPipeSemicolonStop,
  isRawStop,
  scanChar,
  scanLength,
  scannedText,
  wordAt,
} from '@/gate/analyzer/text-scanner';

/** The leaf analyzer modules that carry no dispatch of their own. */

function argvOf(line: string): string[] {
  return line.split(/\s+/).filter((word) => word.length > 0);
}

describe('text scanner', () => {
  test('each character class answers for the characters the scanners stop on', () => {
    const rows: readonly {
      readonly char: string | undefined;
      readonly ascii: boolean;
      readonly whitespace: boolean;
      readonly terminator: boolean;
      readonly raw: boolean;
      readonly pipe: boolean;
    }[] = [
      { char: 'a', ascii: true, whitespace: false, terminator: false, raw: false, pipe: false },
      { char: 'Z', ascii: true, whitespace: false, terminator: false, raw: false, pipe: false },
      { char: '9', ascii: true, whitespace: false, terminator: false, raw: false, pipe: false },
      { char: '_', ascii: true, whitespace: false, terminator: false, raw: false, pipe: false },
      { char: '-', ascii: false, whitespace: false, terminator: false, raw: false, pipe: false },
      { char: 'ö', ascii: false, whitespace: false, terminator: false, raw: false, pipe: false },
      { char: ' ', ascii: false, whitespace: true, terminator: false, raw: false, pipe: false },
      { char: '\t', ascii: false, whitespace: true, terminator: false, raw: false, pipe: false },
      { char: ' ', ascii: false, whitespace: true, terminator: false, raw: false, pipe: false },
      { char: '﻿', ascii: false, whitespace: true, terminator: false, raw: false, pipe: false },
      { char: '\n', ascii: false, whitespace: true, terminator: true, raw: true, pipe: false },
      { char: '\r', ascii: false, whitespace: true, terminator: true, raw: false, pipe: false },
      { char: ' ', ascii: false, whitespace: true, terminator: true, raw: false, pipe: false },
      { char: ';', ascii: false, whitespace: false, terminator: false, raw: true, pipe: true },
      { char: '|', ascii: false, whitespace: false, terminator: false, raw: true, pipe: true },
      { char: '&', ascii: false, whitespace: false, terminator: false, raw: true, pipe: false },
      {
        char: undefined,
        ascii: false,
        whitespace: false,
        terminator: false,
        raw: false,
        pipe: false,
      },
    ];
    for (const row of rows) {
      const label = JSON.stringify(row.char);
      expect(isAsciiWord(row.char), label).toBe(row.ascii);
      expect(isEcmaWhitespace(row.char), label).toBe(row.whitespace);
      expect(isJsLineTerminator(row.char), label).toBe(row.terminator);
      expect(isRawStop(row.char), label).toBe(row.raw);
      expect(isPipeSemicolonStop(row.char), label).toBe(row.pipe);
    }
  });

  test('a scanned text reads by index, charging one unit per character read', () => {
    const work = { units: 0 };
    const scanned = scannedText('rm -rf /', work);
    expect(scanLength(scanned)).toBe(8);
    expect(scanChar(scanned, 0)).toBe('r');
    expect(scanChar(scanned, -1)).toBeUndefined();
    expect(scanChar(scanned, 8)).toBeUndefined();
    expect(work.units).toBe(3);
  });

  test('a fixed string and a whole word are found only where they start', () => {
    const rows: readonly {
      readonly text: string;
      readonly index: number;
      readonly fixed: boolean;
      readonly word: boolean;
      readonly boundary: boolean;
    }[] = [
      { text: 'rm -rf /', index: 0, fixed: true, word: false, boundary: true },
      { text: 'rm -rf /', index: 1, fixed: false, word: false, boundary: false },
      { text: 'rm -rf /', index: 2, fixed: false, word: false, boundary: true },
      // Neither side of the index is a word character, so there is no boundary.
      { text: 'rm -rf /', index: 7, fixed: false, word: false, boundary: false },
      // A word must not run into a longer identifier.
      { text: 'systemd', index: 0, fixed: false, word: false, boundary: true },
      { text: 'x system(', index: 2, fixed: false, word: true, boundary: true },
      { text: 'x system(', index: 0, fixed: false, word: false, boundary: true },
    ];
    for (const row of rows) {
      const scanned = scannedText(row.text, undefined);
      const label = `${row.text}@${row.index}`;
      expect(fixedAt(scanned, row.index, 'rm'), label).toBe(row.fixed);
      expect(wordAt(scanned, row.index, 'system'), label).toBe(row.word);
      expect(hasWordBoundaryAfter(scanned, row.index), label).toBe(row.boundary);
    }
  });

  test('the charge helpers add one unit per character per pass and saturate', () => {
    const scan = { units: 0 };
    chargeScan(scan, 'abc', 3);
    expect(scan.units).toBe(9);

    const linear = { units: 7 };
    chargeNativeLinearPass(linear, 'abc');
    expect(linear.units).toBe(10);

    const saturating = { units: Number.MAX_SAFE_INTEGER - 4 };
    chargeScan(saturating, 'abcdef', 1);
    expect(saturating.units).toBe(Number.MAX_SAFE_INTEGER);

    expect(() => chargeScan(undefined, 'abc')).not.toThrow();
  });
});

describe('rm flags', () => {
  test('recursion and force are read from the options, never from an operand', () => {
    const rows: readonly {
      readonly argv: readonly string[];
      readonly recursiveForce: boolean;
      readonly recursive: boolean;
    }[] = [
      { argv: [], recursiveForce: false, recursive: false },
      { argv: ['rm'], recursiveForce: false, recursive: false },
      { argv: ['rm', '-rf', '/tmp/x'], recursiveForce: true, recursive: true },
      { argv: ['rm', '-fr', '/tmp/x'], recursiveForce: true, recursive: true },
      { argv: ['rm', '-r', '-f', '/tmp/x'], recursiveForce: true, recursive: true },
      { argv: ['rm', '-R', '--force', '/tmp/x'], recursiveForce: true, recursive: true },
      { argv: ['rm', '--recursive', '--force'], recursiveForce: true, recursive: true },
      // A long option may be abbreviated to any prefix, down to one letter.
      { argv: ['rm', '--rec', '--for'], recursiveForce: true, recursive: true },
      { argv: ['rm', '--r', '--f'], recursiveForce: true, recursive: true },
      // An abbreviation that is not a prefix names no option.
      { argv: ['rm', '--rf'], recursiveForce: false, recursive: false },
      { argv: ['rm', '--recursively', 'x'], recursiveForce: false, recursive: false },
      { argv: ['rm', '-r'], recursiveForce: false, recursive: true },
      { argv: ['rm', '-f'], recursiveForce: false, recursive: false },
      { argv: ['rm', '-i', '-rf'], recursiveForce: true, recursive: true },
      { argv: ['rm', '-vRf', 'x'], recursiveForce: true, recursive: true },
      // After `--` an option-shaped token is an operand.
      { argv: ['rm', '--', '-rf'], recursiveForce: false, recursive: false },
      { argv: ['rm', '-rf', '--', '-r'], recursiveForce: true, recursive: true },
      { argv: ['chmod', '-R', '777', '/'], recursiveForce: false, recursive: true },
    ];
    for (const row of rows) {
      expect(hasRecursiveForceFlags(row.argv), row.argv.join(' ')).toBe(row.recursiveForce);
      expect(hasRecursiveOption(row.argv), row.argv.join(' ')).toBe(row.recursive);
    }
  });
});

describe('command words', () => {
  const firstWords = (source: string, dialect: 'posix' | 'powershell' = 'posix') =>
    projectCommandViews(parseCommand(source, dialect))[0]?.words ?? [];

  test('a command substitution is analyzed as its source, every other word as its text', () => {
    const words = firstWords('echo "$(id)" one');
    expect(words.map(analysisWordText)).toStrictEqual(['echo', '"$(id)"', 'one']);
    expect(firstWords('echo \'literal\' "double"').map(analysisWordText)).toStrictEqual([
      'echo',
      'literal',
      'double',
    ]);
  });

  test('PowerShell words are analyzed as text-only stand-ins, POSIX words as parsed', () => {
    const posix = firstWords('echo one');
    expect(analyzedViewWords('posix', posix)).toBe(posix);
    const powershell = firstWords('Remove-Item -Recurse $env:TEMP\\x', 'powershell');
    const analyzed = analyzedViewWords('powershell', powershell);
    expect(analyzed.map((word) => word.text)).toStrictEqual(powershell.map((word) => word.text));
    expect(analyzed.every((word) => word.provenance === 'unknown')).toBeTrue();
  });

  test('an execution source is literal by provenance, or by its text when it has none', () => {
    const rows: readonly { readonly text: string; readonly literal: boolean }[] = [
      { text: 'rm', literal: true },
      { text: '/usr/bin/rm', literal: true },
      { text: '$X', literal: false },
      { text: '`hostname`', literal: false },
      { text: '*.sh', literal: false },
      { text: 'a?b', literal: false },
      { text: 'a[b]', literal: false },
    ];
    for (const row of rows) {
      expect(isLiteralExecutionSourceWord(undefined, row.text), row.text).toBe(row.literal);
    }
    const [literal, substitution] = firstWords('echo $(id)');
    expect(isLiteralExecutionSourceWord(literal, 'anything')).toBeTrue();
    expect(isLiteralExecutionSourceWord(substitution, 'rm')).toBeFalse();
  });

  test('text-only stand-ins carry no parser facts', () => {
    expect(textCommandWords([])).toStrictEqual([]);
    expect(textCommandWords(['rm', '-rf'])).toStrictEqual([
      {
        kind: 'word',
        text: 'rm',
        raw: 'rm',
        span: { start: 0, end: 0 },
        provenance: 'unknown',
        quoted: false,
        parts: [],
      },
      {
        kind: 'word',
        text: '-rf',
        raw: '-rf',
        span: { start: 0, end: 0 },
        provenance: 'unknown',
        quoted: false,
        parts: [],
      },
    ]);
  });
});

describe('deferred assignment', () => {
  test('a quoted assignment is data only while nothing can run its value', () => {
    const rows: readonly { readonly source: string; readonly dataOnly: boolean }[] = [
      { source: "W='rm -rf ~'", dataOnly: true },
      { source: 'W=\'rm -rf ~\'; echo "$W"', dataOnly: true },
      { source: "W='rm -rf ~'; echo '$W'", dataOnly: true },
      { source: "W='rm -rf ~'; echo \\$W", dataOnly: true },
      // A name the reference does not end on is a different variable.
      { source: "W='rm -rf ~'; echo $WORD", dataOnly: true },
      { source: "W='rm -rf ~'; cat <<'EOF'\n$W\nEOF", dataOnly: true },
      { source: 'W="rm -rf ~"; echo "$W"', dataOnly: true },
      // An unquoted expansion is field-split before it is used.
      { source: "W='rm -rf ~'; echo $W", dataOnly: false },
      { source: "W='rm -rf ~'; $W", dataOnly: false },
      { source: "W='rm -rf ~'; eval $W", dataOnly: false },
      { source: "W='rm -rf ~'; echo ${W}", dataOnly: false },
      { source: "W='rm -rf ~'; echo $(echo $W)", dataOnly: false },
      { source: "W='rm -rf ~'; cat <<EOF\n$W\nEOF", dataOnly: false },
      // Two words are not a lone assignment.
      { source: "W='rm -rf ~' X='echo'", dataOnly: false },
      { source: "1W='rm -rf ~'; echo $1W", dataOnly: false },
    ];
    for (const row of rows) {
      const program = parseCommand(row.source, 'posix');
      const view = projectCommandViews(program)[0];
      if (!view) throw new Error(`no command view for ${row.source}`);
      expect(isDataOnlyQuotedAssignment(view, program), row.source).toBe(row.dataOnly);
      // Without the surrounding program the later uses cannot be read, so nothing is data only.
      expect(isDataOnlyQuotedAssignment(view, undefined), `${row.source} (no program)`).toBeFalse();
    }
  });

  test('the decision charges two passes over the program source', () => {
    const source = 'W=\'rm -rf ~\'; echo "$W"';
    const program = parseCommand(source, 'posix');
    const view = projectCommandViews(program)[0];
    if (!view) throw new Error('no command view');
    const work = { units: 0 };
    expect(isDataOnlyQuotedAssignment(view, program, work)).toBeTrue();
    expect(work.units).toBe(source.length * 2);
  });
});

describe('heredoc files', () => {
  let root = '';

  beforeAll(() => {
    root = realpathSync(mkdtempSync(join(tmpdir(), 'heredoc-')));
    mkdirSync(join(root, 'dir'));
    writeFileSync(join(root, 'dir', 'file'), 'x');
    symlinkSync(join(root, 'dir'), join(root, 'link'));
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  test('a tracked path resolves against the directory the heredoc is written in', () => {
    const resolve = (source: string, cwd: string | null | undefined) =>
      resolveTrackedHeredocPath(source, cwd, processPathResolver, createBudget());

    expect(resolve('dir/file', root)).toBe(join(root, 'dir', 'file'));
    // A symlinked directory resolves to the directory it points at.
    expect(resolve('link/file', root)).toBe(join(root, 'dir', 'file'));
    expect(resolve('file', join(root, 'dir'))).toBe(join(root, 'dir', 'file'));
    // A tail that does not exist yet is kept as written.
    expect(resolve('missing/deep/file', root)).toBe(join(root, 'missing', 'deep', 'file'));
    expect(resolve(join(root, 'dir', 'file'), null)).toBe(join(root, 'dir', 'file'));
    expect(resolve(join(root, 'dir', 'file'), undefined)).toBe(join(root, 'dir', 'file'));
    // A relative path with no directory to resolve against is not a path.
    expect(resolve('dir/file', null)).toBeUndefined();
    expect(resolve('dir/file', undefined)).toBeUndefined();
    expect(resolve('dir/file', '')).toBeUndefined();
    expect(resolve('', root)).toBe(root);
  });

  test('a heredoc written to a device or kernel path leaves nothing behind', () => {
    const rows: readonly { readonly path: string; readonly persistent: boolean }[] = [
      { path: '/dev', persistent: false },
      { path: '/dev/null', persistent: false },
      { path: '/proc/1/fd/2', persistent: false },
      { path: '/sys', persistent: false },
      // A path that merely starts with the same letters is an ordinary file.
      { path: '/devices/x', persistent: true },
      { path: '/tmp/out', persistent: true },
    ];
    for (const row of rows) {
      expect(isPersistentHeredocFilePath(row.path), row.path).toBe(row.persistent);
    }
  });
});

describe('device commands', () => {
  test('a write to a /dev target is reported per tool', () => {
    const rows: readonly {
      readonly argv: readonly string[];
      readonly match: DestructiveCommandRuleMatch | null;
    }[] = [
      {
        argv: ['dd', 'if=/dev/zero', 'of=/dev/sda'],
        match: {
          id: 'dd.device-write',
          reason:
            'dd writing to a /dev device can destroy a disk or partition. Run device writes manually after confirming the target.',
          intent: 'manual_only',
        },
      },
      { argv: ['dd', 'if=/dev/zero', 'of=/tmp/x'], match: null },
      // The target has to name something under /dev.
      { argv: ['dd', 'of=/dev/'], match: null },
      { argv: ['dd'], match: null },
      {
        argv: ['mkfs', '/dev/sda1'],
        match: {
          id: 'mkfs.device',
          reason:
            'mkfs formatting a /dev device erases everything on it. Run the format manually after confirming the target.',
          intent: 'manual_only',
        },
      },
      {
        argv: ['mkfs.ext4', '/dev/sda1'],
        match: {
          id: 'mkfs.device',
          reason:
            'mkfs formatting a /dev device erases everything on it. Run the format manually after confirming the target.',
          intent: 'manual_only',
        },
      },
      { argv: ['mkfs.ext4', 'image.img'], match: null },
      { argv: ['mkfsx', '/dev/sda1'], match: null },
      {
        argv: ['shred', 'secret'],
        match: {
          id: 'shred.target',
          reason:
            'shred permanently destroys the given target. Use rm for ordinary deletes, or run shred manually.',
          intent: 'use_alternative',
        },
      },
      { argv: ['shred'], match: null },
      // Another tool writing to a device is not this module's rule.
      { argv: ['rm', '-rf', '/dev/sda'], match: null },
    ];
    for (const row of rows) {
      expect(analyzeDeviceCommandMatch(row.argv[0] ?? '', row.argv), row.argv.join(' ')).toEqual(
        row.match,
      );
    }
  });
});

describe('git environment', () => {
  test('GIT_CONFIG_COUNT is read only as a plain integer within the cap', () => {
    const rows: readonly {
      readonly value: string;
      readonly resolution: GitConfigCountResolution;
    }[] = [
      { value: '', resolution: { state: 'valid', count: 0 } },
      { value: '0', resolution: { state: 'valid', count: 0 } },
      { value: '7', resolution: { state: 'valid', count: 7 } },
      { value: '01', resolution: { state: 'valid', count: 1 } },
      { value: '1024', resolution: { state: 'valid', count: 1024 } },
      { value: '1025', resolution: { state: 'invalid' } },
      { value: '9007199254740993', resolution: { state: 'invalid' } },
      { value: 'x', resolution: { state: 'invalid' } },
      { value: '-1', resolution: { state: 'invalid' } },
      { value: ' 1', resolution: { state: 'invalid' } },
    ];
    for (const row of rows) {
      const env = new Map([['GIT_CONFIG_COUNT', row.value]]);
      expect(resolveGitConfigCount(env), row.value).toStrictEqual(row.resolution);
      // An assignment on the command line masks the inherited value.
      expect(resolveGitConfigCount(new Map(), env), `assigned ${row.value}`).toStrictEqual(
        row.resolution,
      );
    }
    expect(resolveGitConfigCount(new Map())).toStrictEqual({ state: 'absent' });
    expect(
      resolveGitConfigCount(
        new Map([['GIT_CONFIG_COUNT', '1']]),
        new Map([['GIT_CONFIG_COUNT', '']]),
      ),
    ).toStrictEqual({ state: 'valid', count: 0 });
  });

  test('the tracked names are the context overrides, the config inputs and the SSH hooks', () => {
    const rows: readonly {
      readonly name: string;
      readonly override: boolean;
      readonly tracked: boolean;
    }[] = [
      { name: 'GIT_DIR', override: true, tracked: true },
      { name: 'GIT_WORK_TREE', override: true, tracked: true },
      { name: 'GIT_COMMON_DIR', override: true, tracked: true },
      { name: 'GIT_INDEX_FILE', override: true, tracked: true },
      { name: 'GIT_CONFIG_COUNT', override: false, tracked: true },
      { name: 'GIT_CONFIG_PARAMETERS', override: false, tracked: true },
      { name: 'GIT_CONFIG_KEY_0', override: false, tracked: true },
      { name: 'GIT_CONFIG_VALUE_12', override: false, tracked: true },
      { name: 'GIT_CONFIG_GLOBAL', override: false, tracked: true },
      { name: 'GIT_SSH_COMMAND', override: false, tracked: true },
      { name: 'GIT_SSH_VARIANT', override: false, tracked: true },
      { name: 'HOME', override: false, tracked: true },
      { name: 'XDG_CONFIG_HOME', override: false, tracked: true },
      // A key index that is not a number names no config entry.
      { name: 'GIT_CONFIG_KEY_X', override: false, tracked: false },
      { name: 'PATH', override: false, tracked: false },
      { name: '', override: false, tracked: false },
    ];
    for (const row of rows) {
      expect(isGitContextEnvOverrideName(row.name), row.name).toBe(row.override);
      expect(isTrackedGitEnvName(row.name), row.name).toBe(row.tracked);
    }
  });

  test('a value is read from the assignments when they carry the name, else the environment', () => {
    const env = new Map([
      ['GIT_DIR', '/env/git'],
      ['HOME', '/env/home'],
    ]);
    const assignments = new Map([
      ['GIT_DIR', '/assigned/git'],
      ['GIT_SSH_COMMAND', ''],
    ]);
    expect(getGitEnvValue('GIT_DIR', env, assignments)).toBe('/assigned/git');
    expect(getGitEnvValue('GIT_DIR', env)).toBe('/env/git');
    expect(getGitEnvValue('HOME', env, assignments)).toBe('/env/home');
    // An assignment to the empty string is a value, not an absence.
    expect(getGitEnvValue('GIT_SSH_COMMAND', env, assignments)).toBe('');
    expect(getGitEnvValue('PATH', env, assignments)).toBeUndefined();

    expect(hasGitSshEnvAssignment(assignments)).toBeTrue();
    expect(hasGitSshEnvAssignment(new Map())).toBeFalse();
    expect(hasGitSshEnvAssignment(undefined)).toBeFalse();
    expect(hasConfigAffectingEnvAssignment(new Map([['HOME', '/tmp/home']]))).toBeTrue();
    expect(hasConfigAffectingEnvAssignment(assignments)).toBeFalse();
    expect(hasConfigAffectingEnvAssignment(undefined)).toBeFalse();
  });

  test('an append assignment extends the value the name already holds', () => {
    const env = new Map([['GIT_DIR', '/env/git']]);
    const assignments = new Map([['GIT_DIR', '/assigned/git']]);
    const rows: readonly {
      readonly token: string;
      readonly assigned: { name: string; value: string } | null;
      readonly plain: { name: string; value: string } | null;
    }[] = [
      {
        token: 'GIT_DIR+=/extra',
        assigned: { name: 'GIT_DIR', value: '/assigned/git/extra' },
        plain: { name: 'GIT_DIR', value: '/env/git/extra' },
      },
      {
        token: 'GIT_DIR+=',
        assigned: { name: 'GIT_DIR', value: '/assigned/git' },
        plain: { name: 'GIT_DIR', value: '/env/git' },
      },
      {
        token: 'GIT_CONFIG_COUNT+=2',
        assigned: { name: 'GIT_CONFIG_COUNT', value: '2' },
        plain: { name: 'GIT_CONFIG_COUNT', value: '2' },
      },
      {
        token: 'HOME+=/extra',
        assigned: { name: 'HOME', value: '/extra' },
        plain: { name: 'HOME', value: '/extra' },
      },
      // A name the analyzer does not track carries no Git meaning.
      { token: 'PATH+=:/extra', assigned: null, plain: null },
      { token: 'TMPDIR+=/extra', assigned: null, plain: null },
      { token: 'GIT_DIR=/plain', assigned: null, plain: null },
      { token: '+=/extra', assigned: null, plain: null },
      { token: '1BAD+=x', assigned: null, plain: null },
    ];
    for (const row of rows) {
      expect(
        parseGitContextAppendEnvAssignment(row.token, env, assignments),
        row.token,
      ).toStrictEqual(row.assigned);
      expect(parseGitContextAppendEnvAssignment(row.token, env), row.token).toStrictEqual(
        row.plain,
      );
    }
  });
});

describe('git command line parsing', () => {
  test('the subcommand is the first word that is not a global option or its value', () => {
    const rows: readonly {
      readonly line: string;
      readonly subcommand: string | null;
      readonly rest: readonly string[];
    }[] = [
      { line: 'git', subcommand: null, rest: [] },
      { line: 'git status', subcommand: 'status', rest: [] },
      { line: 'git -C /tmp -c a.b=c checkout -- .', subcommand: 'checkout', rest: ['--', '.'] },
      { line: 'git --git-dir=/tmp/x --work-tree /tmp status', subcommand: 'status', rest: [] },
      { line: 'git -- checkout', subcommand: 'checkout', rest: [] },
      { line: 'git -- -x', subcommand: null, rest: ['-x'] },
      { line: '/usr/bin/GIT.EXE status', subcommand: 'status', rest: [] },
      { line: 'not-git status', subcommand: null, rest: [] },
    ];
    for (const row of rows) {
      expect(extractGitSubcommandAndRest(argvOf(row.line)), row.line).toStrictEqual({
        subcommand: row.subcommand,
        rest: [...row.rest],
      });
    }
    expect(extractGitSubcommandAndRest([])).toStrictEqual({ subcommand: null, rest: [] });
  });

  test('the double-dash split reports the first separator only', () => {
    expect(splitAtDoubleDash(['a', '--', 'b', 'c'])).toStrictEqual({
      index: 1,
      before: ['a'],
      after: ['b', 'c'],
    });
    expect(splitAtDoubleDash(['a', 'b'])).toStrictEqual({
      index: -1,
      before: ['a', 'b'],
      after: [],
    });
    expect(splitAtDoubleDash(['--', '--', 'x'])).toStrictEqual({
      index: 0,
      before: [],
      after: ['--', 'x'],
    });
    expect(splitAtDoubleDash([])).toStrictEqual({ index: -1, before: [], after: [] });
  });

  test('a core.sshCommand set on the command line is found in every spelling', () => {
    const env = new Map([['SSH', 'ssh -o StrictHostKeyChecking=no']]);
    const rows: readonly { readonly line: string; readonly configured: boolean }[] = [
      { line: 'git -c core.sshCommand=ssh clone url', configured: true },
      { line: 'git -ccore.sshCommand=ssh clone url', configured: true },
      // The key is compared case-folded, as Git reads it.
      { line: 'git -c CORE.SSHCOMMAND=ssh clone url', configured: true },
      { line: 'git --config-env core.sshCommand=SSH fetch', configured: true },
      { line: 'git --config-env=core.sshCommand=SSH fetch', configured: true },
      { line: 'git status', configured: false },
      { line: 'git -C /tmp -c a.b=c checkout -- .', configured: false },
      { line: 'not-git -c core.sshCommand=ssh clone url', configured: false },
      // The scan stops at the subcommand, so a later `-c` is that subcommand's own option.
      { line: 'git clone url -c core.sshCommand=ssh', configured: false },
    ];
    for (const row of rows) {
      expect(hasGitCommandLineSshCommandConfig(argvOf(row.line), env), row.line).toBe(
        row.configured,
      );
    }
    expect(
      hasGitCommandLineSshCommandConfig(
        argvOf('git --config-env core.sshCommand=SSH fetch'),
        new Map(),
        new Map([['SSH', 'ssh -o X']]),
      ),
    ).toBeTrue();
  });
});
