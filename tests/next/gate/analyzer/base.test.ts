import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { processPathResolver } from '@next/core/environment';
import { parseCommand } from '@next/core/shell/parse';
import { projectCommandViews } from '@next/core/shell/traversal';
import {
  analysisWordText,
  analyzedViewWords,
  isLiteralExecutionSourceWord,
  textCommandWords,
} from '@next/gate/analyzer/command-words';
import { isDataOnlyQuotedAssignment } from '@next/gate/analyzer/deferred-assignment';
import {
  createDerivedCommandWorkBudget,
  reserveDerivedCommandTokens,
} from '@next/gate/analyzer/derived-command-budget';
import { analyzeDeviceCommandMatch } from '@next/gate/analyzer/device';
import {
  getGitEnvValue,
  hasConfigAffectingEnvAssignment,
  hasGitSshEnvAssignment,
  isGitContextEnvOverrideName,
  isTrackedGitEnvName,
  parseGitContextAppendEnvAssignment,
  resolveGitConfigCount,
} from '@next/gate/analyzer/git/env';
import {
  extractGitSubcommandAndRest,
  hasGitCommandLineSshCommandConfig,
  splitAtDoubleDash,
} from '@next/gate/analyzer/git/parse';
import {
  isPersistentHeredocFilePath,
  MAX_TRACKED_HEREDOC_FILES,
  resolveTrackedHeredocPath,
} from '@next/gate/analyzer/heredoc-files';
import {
  createParallelAnalysisBudget,
  reserveParallelAnalysis,
} from '@next/gate/analyzer/parallel-budget';
import { hasRecursiveForceFlags, hasRecursiveOption } from '@next/gate/analyzer/rm-flags';
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
} from '@next/gate/analyzer/text-scanner';
import {
  analysisWordText as shippedAnalysisWordText,
  analyzedViewWords as shippedAnalyzedViewWords,
  isLiteralExecutionSourceWord as shippedIsLiteralExecutionSourceWord,
  textCommandWords as shippedTextCommandWords,
} from '@/analyzer/command-words';
import { isDataOnlyQuotedAssignment as shippedIsDataOnlyQuotedAssignment } from '@/analyzer/deferred-assignment';
import {
  createDerivedCommandWorkBudget as shippedCreateDerivedBudget,
  reserveDerivedCommandTokens as shippedReserveDerivedTokens,
} from '@/analyzer/derived-command-budget';
import { analyzeDeviceCommandMatch as shippedAnalyzeDeviceCommandMatch } from '@/analyzer/device';
import {
  getGitEnvValue as shippedGetGitEnvValue,
  hasConfigAffectingEnvAssignment as shippedHasConfigAffecting,
  hasGitSshEnvAssignment as shippedHasGitSshEnvAssignment,
  isGitContextEnvOverrideName as shippedIsGitContextEnvOverrideName,
  isTrackedGitEnvName as shippedIsTrackedGitEnvName,
  parseGitContextAppendEnvAssignment as shippedParseAppendAssignment,
  resolveGitConfigCount as shippedResolveGitConfigCount,
} from '@/analyzer/git/env';
import {
  extractGitSubcommandAndRest as shippedExtractSubcommand,
  hasGitCommandLineSshCommandConfig as shippedHasSshCommandConfig,
  splitAtDoubleDash as shippedSplitAtDoubleDash,
} from '@/analyzer/git/parse';
import {
  isPersistentHeredocFilePath as shippedIsPersistentHeredocFilePath,
  MAX_TRACKED_HEREDOC_FILES as shippedMaxTrackedHeredocFiles,
  resolveTrackedHeredocPath as shippedResolveTrackedHeredocPath,
} from '@/analyzer/heredoc-files';
import {
  createParallelAnalysisBudget as shippedCreateParallelBudget,
  reserveParallelAnalysis as shippedReserveParallel,
} from '@/analyzer/parallel-budget';
import {
  hasRecursiveForceFlags as shippedHasRecursiveForceFlags,
  hasRecursiveOption as shippedHasRecursiveOption,
} from '@/analyzer/rm-flags';
import {
  chargeNativeLinearPass as shippedChargeNativeLinearPass,
  chargeScan as shippedChargeScan,
  fixedAt as shippedFixedAt,
  hasWordBoundaryAfter as shippedHasWordBoundaryAfter,
  isAsciiWord as shippedIsAsciiWord,
  isEcmaWhitespace as shippedIsEcmaWhitespace,
  isJsLineTerminator as shippedIsJsLineTerminator,
  isPipeSemicolonStop as shippedIsPipeSemicolonStop,
  isRawStop as shippedIsRawStop,
  scanChar as shippedScanChar,
  scanLength as shippedScanLength,
  scannedText as shippedScannedText,
  wordAt as shippedWordAt,
} from '@/analyzer/text-scanner';
import { processPathResolver as shippedPathResolver } from '@/ir/environment';
import { parseCommand as shippedParseCommand } from '@/parser/command';
import { projectCommandViews as shippedProjectCommandViews } from '@/parser/traversal';
import { corpusCommands, fuzzShellSources } from '../../helpers/shell-inputs';

/** The leaf analyzer modules that carry no dispatch of their own, each against its shipped twin. */

function failure(call: () => void) {
  try {
    call();
    return 'no throw';
  } catch (error) {
    return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  }
}

function argvOf(line: string): string[] {
  return line.split(/\s+/).filter((word) => word.length > 0);
}

describe('text scanner', () => {
  const texts = ['', 'rm -rf /', 'a_b9 c\td\ne', 'söme text more', '|;&x', 'systemd'];

  test('character classification agrees for every code point in the sample texts', () => {
    for (const text of [...texts, fuzzShellSources(120, 0x0075_c001).join(' ')]) {
      for (const char of [...text, undefined]) {
        expect(isAsciiWord(char)).toBe(shippedIsAsciiWord(char));
        expect(isEcmaWhitespace(char)).toBe(shippedIsEcmaWhitespace(char));
        expect(isJsLineTerminator(char)).toBe(shippedIsJsLineTerminator(char));
        expect(isRawStop(char)).toBe(shippedIsRawStop(char));
        expect(isPipeSemicolonStop(char)).toBe(shippedIsPipeSemicolonStop(char));
      }
    }
  });

  test('the scanned-text readers agree and charge the same units', () => {
    for (const text of texts) {
      const work = { units: 0 };
      const shippedWork = { units: 0 };
      const scanned = scannedText(text, work);
      const shippedScanned = shippedScannedText(text, shippedWork);
      expect(scanned).toStrictEqual(shippedScanned);
      expect(scanLength(scanned)).toBe(shippedScanLength(shippedScanned));
      for (let index = -1; index <= text.length; index++) {
        expect(scanChar(scanned, index)).toBe(shippedScanChar(shippedScanned, index));
        expect(fixedAt(scanned, index, 'rm')).toBe(shippedFixedAt(shippedScanned, index, 'rm'));
        expect(wordAt(scanned, index, 'system')).toBe(
          shippedWordAt(shippedScanned, index, 'system'),
        );
        expect(hasWordBoundaryAfter(scanned, index)).toBe(
          shippedHasWordBoundaryAfter(shippedScanned, index),
        );
      }
      expect(work).toStrictEqual(shippedWork);
    }
  });

  test('the charge helpers agree, including saturation and the missing counter', () => {
    for (const text of texts) {
      for (const passes of [1, 3]) {
        const work = { units: Number.MAX_SAFE_INTEGER - 4 };
        const shippedWork = { units: Number.MAX_SAFE_INTEGER - 4 };
        chargeScan(work, text, passes);
        shippedChargeScan(shippedWork, text, passes);
        expect(work).toStrictEqual(shippedWork);
      }
      const linear = { units: 7 };
      const shippedLinear = { units: 7 };
      chargeNativeLinearPass(linear, text);
      shippedChargeNativeLinearPass(shippedLinear, text);
      expect(linear).toStrictEqual(shippedLinear);
      expect(chargeScan(undefined, text)).toBe(shippedChargeScan(undefined, text));
    }
  });
});

describe('rm flags', () => {
  const flagCases: readonly (readonly string[])[] = [
    [],
    ['rm'],
    ['rm', '-rf', '/tmp/x'],
    ['rm', '-fr', '/tmp/x'],
    ['rm', '-r', '-f', '/tmp/x'],
    ['rm', '-R', '--force', '/tmp/x'],
    ['rm', '--recursive', '--force'],
    ['rm', '--rec', '--for'],
    ['rm', '--r', '--f'],
    ['rm', '-r'],
    ['rm', '-f'],
    ['rm', '--', '-rf'],
    ['rm', '-rf', '--', '-r'],
    ['rm', '-i', '-rf'],
    ['rm', '--recursiv', 'x'],
    ['rm', '--recursively', 'x'],
    ['rm', '-vRf', 'x'],
    ['rm', '-Rv', 'x'],
    ['chmod', '-R', '777', '/'],
  ];

  test('both flag readers agree over the table and the corpus argv', () => {
    for (const argv of [...flagCases, ...corpusCommands().map(argvOf)]) {
      expect(hasRecursiveForceFlags(argv)).toBe(shippedHasRecursiveForceFlags(argv));
      expect(hasRecursiveOption(argv)).toBe(shippedHasRecursiveOption(argv));
    }
  });
});

describe('command words', () => {
  const sources = [
    'echo one two',
    'echo "$(id)" `hostname` $HOME',
    'echo \'literal\' "double"',
    'Remove-Item -Recurse $env:TEMP\\x',
    'rm -rf $(cat list)',
  ];

  test('the word projections agree for parsed and text-only words', () => {
    for (const source of sources) {
      for (const dialect of ['posix', 'powershell'] as const) {
        const views = projectCommandViews(parseCommand(source, dialect));
        const shippedViews = shippedProjectCommandViews(shippedParseCommand(source, dialect));
        expect(views.length).toBe(shippedViews.length);
        views.forEach((view, index) => {
          const shippedView = shippedViews[index];
          if (!shippedView) throw new Error('missing shipped view');
          expect(view.words.map(analysisWordText)).toStrictEqual(
            shippedView.words.map(shippedAnalysisWordText),
          );
          expect(analyzedViewWords(view.dialect, view.words)).toStrictEqual(
            shippedAnalyzedViewWords(shippedView.dialect, shippedView.words),
          );
          view.words.forEach((word, wordIndex) => {
            expect(isLiteralExecutionSourceWord(word, word.text)).toBe(
              shippedIsLiteralExecutionSourceWord(shippedView.words[wordIndex], word.text),
            );
          });
        });
      }
    }
  });

  test('text-only stand-ins carry no parser facts on either side', () => {
    for (const source of sources) {
      const tokens = source.split(' ');
      expect(textCommandWords(tokens)).toStrictEqual(shippedTextCommandWords(tokens));
      expect(isLiteralExecutionSourceWord(undefined, source)).toBe(
        shippedIsLiteralExecutionSourceWord(undefined, source),
      );
    }
  });
});

describe('deferred assignment', () => {
  const assignments = [
    "W='rm -rf ~'",
    "W='rm -rf ~'; echo $W",
    'W=\'rm -rf ~\'; echo "$W"',
    "W='rm -rf ~'; echo '$W'",
    "W='rm -rf ~'; $W",
    "W='rm -rf ~'; eval $W",
    "W='rm -rf ~'; echo ${W}",
    "W='rm -rf ~'; echo $WORD",
    "W='rm -rf ~'; echo \\$W",
    "W='rm -rf ~'; echo $(echo $W)",
    "W='rm -rf ~'; f() { echo $W; }; f",
    'W=\'rm -rf ~\'; { echo "$W"; }',
    "W='rm -rf ~' > out",
    "W='rm -rf ~'; cat > $W",
    "W='rm -rf ~'; cat <<EOF\n$W\nEOF",
    "W='rm -rf ~'; cat <<'EOF'\n$W\nEOF",
    'W="rm -rf ~"; echo "$W"',
    "W='rm -rf ~' X='echo'",
    "1W='rm -rf ~'; echo $1W",
  ];

  test('the data-only decision and its scan work agree over assignments and corpus commands', () => {
    for (const source of [...assignments, ...corpusCommands()]) {
      const program = parseCommand(source, 'posix');
      const shippedProgram = shippedParseCommand(source, 'posix');
      const views = projectCommandViews(program);
      const shippedViews = shippedProjectCommandViews(shippedProgram);
      expect(views.length).toBe(shippedViews.length);
      views.forEach((view, index) => {
        const shippedView = shippedViews[index];
        if (!shippedView) throw new Error('missing shipped view');
        const work = { units: 0 };
        const shippedWork = { units: 0 };
        expect(isDataOnlyQuotedAssignment(view, program, work)).toBe(
          shippedIsDataOnlyQuotedAssignment(shippedView, shippedProgram, shippedWork),
        );
        expect(work).toStrictEqual(shippedWork);
        expect(isDataOnlyQuotedAssignment(view, undefined)).toBe(
          shippedIsDataOnlyQuotedAssignment(shippedView, undefined),
        );
      });
    }
  });
});

describe('heredoc files', () => {
  let root = '';

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'next-heredoc-'));
    mkdirSync(join(root, 'dir'));
    writeFileSync(join(root, 'dir', 'file'), 'x');
    symlinkSync(join(root, 'dir'), join(root, 'link'));
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  test('the tracked-path resolution agrees for absolute, relative and unknown cwd sources', () => {
    for (const source of ['dir/file', 'link/file', 'missing/deep/file', './dir', '../escape', '']) {
      for (const cwd of [root, join(root, 'dir'), null, undefined]) {
        expect(resolveTrackedHeredocPath(source, cwd, processPathResolver)).toStrictEqual(
          shippedResolveTrackedHeredocPath(source, cwd, shippedPathResolver),
        );
      }
      const absolute = join(root, source);
      expect(resolveTrackedHeredocPath(absolute, null, processPathResolver)).toStrictEqual(
        shippedResolveTrackedHeredocPath(absolute, null, shippedPathResolver),
      );
    }
  });

  test('the persistence test and the tracking cap are the shipped ones', () => {
    for (const path of ['/dev', '/dev/null', '/devices/x', '/proc/1/fd/2', '/sys', '/tmp/out']) {
      expect(isPersistentHeredocFilePath(path)).toBe(shippedIsPersistentHeredocFilePath(path));
    }
    expect(MAX_TRACKED_HEREDOC_FILES).toBe(shippedMaxTrackedHeredocFiles);
  });
});

describe('device commands', () => {
  test('the device rules agree over the table', () => {
    const commands: readonly (readonly string[])[] = [
      ['dd', 'if=/dev/zero', 'of=/dev/sda'],
      ['dd', 'if=/dev/zero', 'of=/tmp/x'],
      ['dd', 'of=/dev/'],
      ['dd'],
      ['mkfs', '/dev/sda1'],
      ['mkfs.ext4', '/dev/sda1'],
      ['mkfs.ext4', 'image.img'],
      ['mkfsx', '/dev/sda1'],
      ['shred', 'secret'],
      ['shred'],
      ['rm', '-rf', '/dev/sda'],
    ];
    for (const argv of commands) {
      const head = argv[0] ?? '';
      expect(analyzeDeviceCommandMatch(head, argv)).toStrictEqual(
        shippedAnalyzeDeviceCommandMatch(head, argv),
      );
    }
  });
});

describe('analyzer budgets', () => {
  test('the derived-command budget breaches at the same reservation', () => {
    for (const amount of [0, 1, 16_383, 16_384, 16_385, -1, 1.5, Number.NaN]) {
      const budget = createDerivedCommandWorkBudget();
      const shippedBudget = shippedCreateDerivedBudget();
      expect(failure(() => reserveDerivedCommandTokens(budget, amount))).toBe(
        failure(() => shippedReserveDerivedTokens(shippedBudget, amount)),
      );
      expect(budget).toStrictEqual(shippedBudget);
    }
  });

  test('the derived-command budget breaches on the cumulative total', () => {
    const budget = createDerivedCommandWorkBudget();
    const shippedBudget = shippedCreateDerivedBudget();
    for (const amount of [8_192, 8_192, 1]) {
      expect(failure(() => reserveDerivedCommandTokens(budget, amount))).toBe(
        failure(() => shippedReserveDerivedTokens(shippedBudget, amount)),
      );
    }
    expect(budget).toStrictEqual(shippedBudget);
    expect(budget.derivedTokens).toBe(16_384);
  });

  test('every parallel counter breaches at its own cap', () => {
    const reservations = [
      { childAnalyses: 1_024 },
      { childAnalyses: 1_025 },
      { derivedTokens: 16_385 },
      { derivedBytes: 1024 * 1024 + 1 },
      { placeholderReplacements: 16_385 },
      { childAnalyses: 1, derivedTokens: 1, derivedBytes: 1, placeholderReplacements: 1 },
      {},
      { childAnalyses: -1 },
    ];
    for (const reservation of reservations) {
      const budget = createParallelAnalysisBudget();
      const shippedBudget = shippedCreateParallelBudget();
      expect(failure(() => reserveParallelAnalysis(budget, reservation))).toBe(
        failure(() => shippedReserveParallel(shippedBudget, reservation)),
      );
      expect(budget).toStrictEqual(shippedBudget);
    }
  });
});

describe('git environment', () => {
  test('the GIT_CONFIG_COUNT resolution agrees, cap included', () => {
    const counts = ['', '0', '1', '7', '1024', '1025', '9007199254740993', 'x', '-1', ' 1', '01'];
    for (const value of counts) {
      const env = new Map([['GIT_CONFIG_COUNT', value]]);
      expect(resolveGitConfigCount(env)).toStrictEqual(shippedResolveGitConfigCount(env));
      expect(resolveGitConfigCount(new Map(), env)).toStrictEqual(
        shippedResolveGitConfigCount(new Map(), env),
      );
    }
    expect(resolveGitConfigCount(new Map())).toStrictEqual(shippedResolveGitConfigCount(new Map()));
    expect(resolveGitConfigCount(new Map([['GIT_CONFIG_COUNT', '1025']])).state).toBe('invalid');
  });

  test('the tracked-name tests and value reads agree', () => {
    const names = [
      'GIT_DIR',
      'GIT_WORK_TREE',
      'GIT_COMMON_DIR',
      'GIT_INDEX_FILE',
      'GIT_CONFIG_COUNT',
      'GIT_CONFIG_PARAMETERS',
      'GIT_CONFIG_KEY_0',
      'GIT_CONFIG_VALUE_12',
      'GIT_CONFIG_KEY_X',
      'GIT_CONFIG_GLOBAL',
      'GIT_CONFIG_NOSYSTEM',
      'GIT_CONFIG_SYSTEM',
      'GIT_SSH',
      'GIT_SSH_COMMAND',
      'GIT_SSH_VARIANT',
      'HOME',
      'XDG_CONFIG_HOME',
      'PATH',
      '',
    ];
    const env = new Map([
      ['GIT_DIR', '/env/git'],
      ['HOME', '/env/home'],
    ]);
    const assignments = new Map([
      ['GIT_DIR', '/assigned/git'],
      ['GIT_SSH_COMMAND', 'ssh -o X'],
    ]);
    for (const name of names) {
      expect(isGitContextEnvOverrideName(name)).toBe(shippedIsGitContextEnvOverrideName(name));
      expect(isTrackedGitEnvName(name)).toBe(shippedIsTrackedGitEnvName(name));
      expect(getGitEnvValue(name, env, assignments)).toBe(
        shippedGetGitEnvValue(name, env, assignments),
      );
      expect(getGitEnvValue(name, env)).toBe(shippedGetGitEnvValue(name, env));
    }
    for (const candidate of [undefined, new Map<string, string>(), assignments, env]) {
      expect(hasGitSshEnvAssignment(candidate)).toBe(shippedHasGitSshEnvAssignment(candidate));
      expect(hasConfigAffectingEnvAssignment(candidate)).toBe(shippedHasConfigAffecting(candidate));
    }
  });

  test('append assignments agree for tracked and untracked names', () => {
    const tokens = [
      'GIT_DIR+=/extra',
      'GIT_CONFIG_COUNT+=2',
      'HOME+=/extra',
      'PATH+=:/extra',
      'TMPDIR+=/extra',
      'GIT_DIR=/plain',
      '+=/extra',
      '1BAD+=x',
      'GIT_DIR+=',
    ];
    const env = new Map([['GIT_DIR', '/env/git']]);
    const assignments = new Map([['GIT_DIR', '/assigned/git']]);
    for (const token of tokens) {
      expect(parseGitContextAppendEnvAssignment(token, env, assignments)).toStrictEqual(
        shippedParseAppendAssignment(token, env, assignments),
      );
      expect(parseGitContextAppendEnvAssignment(token, env)).toStrictEqual(
        shippedParseAppendAssignment(token, env),
      );
    }
  });
});

describe('git command line parsing', () => {
  const lines = [
    'git',
    'git status',
    'git -C /tmp -c a.b=c checkout -- .',
    'git --git-dir=/tmp/x --work-tree /tmp status',
    'git -- checkout',
    'git -- -x',
    'git --config-env core.sshCommand=SSH fetch',
    'git --config-env=core.sshCommand=SSH fetch',
    'git -c core.sshCommand=ssh clone url',
    'git -ccore.sshCommand=ssh clone url',
    'git -c CORE.SSHCOMMAND=ssh clone url',
    'git clone url -- extra -- more',
    'not-git -c core.sshCommand=ssh clone url',
  ];

  test('subcommand extraction and double-dash splitting agree', () => {
    for (const argv of [[], ...lines.map(argvOf), ...corpusCommands().map(argvOf)]) {
      expect(extractGitSubcommandAndRest(argv)).toStrictEqual(shippedExtractSubcommand(argv));
      expect(splitAtDoubleDash(argv)).toStrictEqual(shippedSplitAtDoubleDash(argv));
    }
  });

  test('the ssh-command config scan agrees for the command line and the environment', () => {
    const env = new Map([['SSH', 'ssh -o StrictHostKeyChecking=no']]);
    const assignments = new Map([['SSH', 'ssh -o X']]);
    for (const argv of lines.map(argvOf)) {
      expect(hasGitCommandLineSshCommandConfig(argv, env, assignments)).toBe(
        shippedHasSshCommandConfig(argv, env, assignments),
      );
      expect(hasGitCommandLineSshCommandConfig(argv, env)).toBe(
        shippedHasSshCommandConfig(argv, env),
      );
    }
  });
});
