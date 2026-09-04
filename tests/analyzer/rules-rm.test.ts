import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, parse, toNamespacedPath } from 'node:path';
import { textCommandWords } from '@/analyzer/command-words';
import {
  type AnalyzeRmOptions,
  analyzeRmMatch as analyzeRmMatchWithEnvironment,
} from '@/analyzer/rm';
import type { CommandWord } from '@/ir/command';
import { parseCommand } from '@/parser/command';
import { projectSegmentWords } from '@/parser/traversal';
import { TEST_ENVIRONMENT, testEnvironment } from '../helpers/environment.ts';
import {
  analyzeTestCommand,
  commandAnalysisPolicy,
  policySnapshot,
  type TestPolicyInput,
} from '../helpers/policy.ts';
import {
  assertAllowed,
  assertBlocked,
  assertStrictBlocked,
  runGuard,
  toShellPath,
  withEnv,
  withSymlinkedHomeCwd,
} from '../helpers.ts';

type RmTestOptions = Omit<AnalyzeRmOptions, 'environment' | 'protectedGitMetadata'> &
  Partial<AnalyzeRmOptions>;

const analyzeRmMatch = (words: readonly CommandWord[], options: RmTestOptions = {}) =>
  analyzeRmMatchWithEnvironment(words, {
    environment: TEST_ENVIRONMENT,
    protectedGitMetadata: null,
    ...options,
  });

const analyzeRm = (tokens: string[], options: RmTestOptions = {}) =>
  analyzeRmMatch(textCommandWords(tokens), options)?.reason ?? null;

describe('rm -rf blocked', () => {
  test('rm -rf blocked', () => {
    assertBlocked('rm -rf /some/path', 'rm -rf');
  });

  test('rm -Rf blocked', () => {
    assertBlocked('rm -Rf /some/path', 'rm -rf');
  });

  test('rm -R -f blocked', () => {
    assertBlocked('rm -R -f /some/path', 'rm -rf');
  });

  test('rm -rf ~/projects blocked', () => {
    assertBlocked('rm -rf ~/projects', 'rm -rf');
  });

  test('rm -fr blocked', () => {
    assertBlocked('rm -fr /some/path', 'rm -rf');
  });

  test('true & rm -rf blocked', () => {
    assertBlocked('true & rm -rf /some/path', 'rm -rf');
  });

  test('rm -rf /tmp/../Users/some/path blocked', () => {
    assertBlocked('rm -rf /tmp/../Users/some/path', 'rm -rf');
  });

  test('/bin/rm -rf blocked', () => {
    assertBlocked('/bin/rm -rf /some/path', 'rm -rf');
  });

  test('busybox rm -rf blocked', () => {
    assertBlocked('busybox rm -rf /some/path', 'rm -rf');
  });

  test('busybox rm -R -f blocked', () => {
    assertBlocked('busybox rm -R -f /some/path', 'rm -rf');
  });

  test("bash -c 'rm -rf /some/path' blocked", () => {
    assertBlocked("bash -c 'rm -rf /some/path'", 'rm -rf');
  });

  test('python -c rm -rf blocked', () => {
    assertBlocked('python -c \'import os; os.system("rm -rf /some/path")\'', 'dangerous');
  });

  test('python -c rm with mixed recursive and force options blocked', () => {
    assertBlocked('python -c \'import os; os.system("rm -r --force /some/path")\'', 'dangerous');
    assertBlocked(
      'python -c \'import os; os.system("rm --recursive -f /some/path")\'',
      'dangerous',
    );
  });

  test('echo $(rm -rf /some/path) blocked', () => {
    assertBlocked('echo $(rm -rf /some/path)', 'rm -rf');
  });

  test('TMPDIR=/Users rm -rf $TMPDIR/test-dir is strict-only', () => {
    const command = 'TMPDIR=/Users rm -rf $TMPDIR/test-dir';
    assertAllowed(command);
    assertStrictBlocked(command, 'rm -rf');
  });

  test('rm -rf / blocked (root)', () => {
    assertBlocked('rm -rf /', 'extremely dangerous');
  });

  test('classifies root-anchored wildcard-only paths as catastrophic', () => {
    for (const command of ['rm -rf /*/', 'rm -rf /*/*', 'rm -rf /*/*/', 'rm -rf /**']) {
      expect(analyzeTestCommand(command)?.ruleId, command).toBe('rm.recursive-force-root-or-home');
    }
    for (const command of ['rm -rf /etc/*', 'rm -rf /home/*', 'rm -rf /*.']) {
      expect(analyzeTestCommand(command)?.ruleId, command).not.toBe(
        'rm.recursive-force-root-or-home',
      );
    }
  });

  test('rm -rf ~ blocked (home)', () => {
    assertBlocked('rm -rf ~', 'extremely dangerous');
  });

  test('rm -rf -- / blocked', () => {
    assertBlocked('rm -rf -- /', 'extremely dangerous');
  });

  test('rm -rf $TMPDIR/../escape is strict-only', () => {
    const command = 'rm -rf $TMPDIR/../escape';
    assertAllowed(command);
    assertStrictBlocked(command, 'rm -rf');
  });

  test('rm -rf `pwd`/escape is strict-only', () => {
    const command = 'rm -rf `pwd`/escape';
    assertAllowed(command);
    assertStrictBlocked(command, 'rm -rf');
  });

  test('rm -rf ~someone/escape blocked', () => {
    assertBlocked('rm -rf ~someone/escape', 'rm -rf');
  });
});

describe('rm -rf allowed', () => {
  test('rm -rf /tmp/test-dir allowed', () => {
    assertAllowed('rm -rf /tmp/test-dir');
  });

  test('rm -rf /var/tmp/test-dir allowed', () => {
    assertAllowed('rm -rf /var/tmp/test-dir');
  });

  test('rm -rf $TMPDIR/test-dir allowed', () => {
    assertAllowed('rm -rf $TMPDIR/test-dir');
  });

  test('rm -rf ${TMPDIR}/test-dir allowed', () => {
    assertAllowed('rm -rf ${TMPDIR}/test-dir');
  });

  test('rm -rf "$TMPDIR/test-dir" allowed', () => {
    assertAllowed('rm -rf "$TMPDIR/test-dir"');
  });

  test('rm -rf $TMPDIR allowed', () => {
    assertAllowed('rm -rf $TMPDIR');
  });

  test('rm -rf /tmp allowed', () => {
    assertAllowed('rm -rf /tmp');
  });

  test('rm -rf temp path with dot-dot in filename allowed', () => {
    assertAllowed('rm -rf /tmp/foo..bar/file');
  });

  test('rm -r without force allowed', () => {
    assertAllowed('rm -r /some/path');
  });

  test('python -c rm -r path with hyphenated f suffix allowed', () => {
    assertAllowed('python -c \'import os; os.system("rm -r /builds/project-stuff")\'');
    assertAllowed('python -c \'import os; os.system("rm -r path/to/proof")\'');
    assertAllowed('python -c \'import os; os.system("rm -r -- -proof")\'');
  });

  test('rm -R without force allowed', () => {
    assertAllowed('rm -R /some/path');
  });

  test('rm -f without recursive allowed', () => {
    assertAllowed('rm -f /some/path');
  });

  test('/bin/rm -rf /tmp/test-dir allowed', () => {
    assertAllowed('/bin/rm -rf /tmp/test-dir');
  });

  test('busybox rm -rf /tmp/test-dir allowed', () => {
    assertAllowed('busybox rm -rf /tmp/test-dir');
  });

  test('rm -rf /tmp/foo 2>/dev/null allowed', () => {
    assertAllowed('rm -rf /tmp/foo 2>/dev/null', '/tmp');
  });

  test('echo $(rm -rf /tmp/foo 2>/dev/null) allowed', () => {
    assertAllowed('echo $(rm -rf /tmp/foo 2>/dev/null)', '/tmp');
  });
});

describe('POSIX function execution', () => {
  test('allows an inert destructive function definition', () => {
    assertAllowed('cleanup() { rm -rf ../outside; }', '/project');
  });

  test('analyzes a directly called function body', () => {
    assertBlocked('cleanup() { rm -rf ../outside; }; cleanup', 'outside cwd', '/project');
    assertBlocked('cleanup() { rm -rf ../outside; }; X=1 cleanup', 'outside cwd', '/project');
  });

  test('analyzes a called function keyword body', () => {
    assertBlocked('function cleanup { rm -rf ../outside; }; cleanup', 'outside cwd', '/project');
    assertBlocked('function cleanup() { rm -rf ../outside; }; cleanup', 'outside cwd', '/project');
  });

  test('allows an inert function keyword definition', () => {
    assertAllowed('function cleanup { rm -rf ../outside; }', '/project');
  });

  test('preserves function CWD changes for following commands', () => {
    assertBlocked(
      'cleanup() { cd ..; }; cleanup && rm -rf build',
      'outside cwd',
      '/project/subdir',
    );
  });

  test('uses the latest function definition', () => {
    assertAllowed(
      'cleanup() { rm -rf ../outside; }; cleanup() { rm -rf build; }; cleanup',
      '/project',
    );
  });

  test('does not leak a subshell-local function definition', () => {
    assertAllowed('( cleanup() { rm -rf ../outside; } ); cleanup', '/project');
  });

  test('shares brace-group function definitions', () => {
    assertBlocked('{ cleanup() { rm -rf ../outside; }; }; cleanup', 'outside cwd', '/project');
  });

  test('fails closed on recursive function execution', () => {
    assertBlocked('loop() { loop; }; loop', 'exceeds maximum recursion depth', '/project');
  });

  test('fails closed when branching function calls exhaust the work budget', () => {
    const definitions = Array.from(
      { length: 8 },
      (_, level) => `f${level + 1}() { ${Array(6).fill(`f${level}`).join('; ')}; }`,
    );

    assertBlocked(
      ['f0() { rm -rf build; }', ...definitions, 'f8'].join('; '),
      'work limit',
      '/project',
    );
  });

  test('analyzes a quoted or escaped call', () => {
    assertBlocked(`cleanup() { rm -rf ../outside; }; 'cleanup'`, 'outside cwd', '/project');
    assertBlocked('cleanup() { rm -rf ../outside; }; "cleanup"', 'outside cwd', '/project');
    assertBlocked('cleanup() { rm -rf ../outside; }; \\cleanup', 'outside cwd', '/project');
  });

  test('analyzes a call behind a time, time options, or ! prefix', () => {
    assertBlocked('cleanup() { rm -rf ../outside; }; time cleanup', 'outside cwd', '/project');
    assertBlocked('cleanup() { rm -rf ../outside; }; time -p cleanup', 'outside cwd', '/project');
    assertBlocked('cleanup() { rm -rf ../outside; }; time -- cleanup', 'outside cwd', '/project');
    assertBlocked(
      'cleanup() { rm -rf ../outside; }; time -p -- cleanup',
      'outside cwd',
      '/project',
    );
    assertBlocked(
      'cleanup() { rm -rf ../outside; }; time -p -- ! cleanup',
      'outside cwd',
      '/project',
    );
    assertBlocked('cleanup() { rm -rf ../outside; }; ! cleanup', 'outside cwd', '/project');
  });

  test('does not treat invalid prefix shapes as function calls', () => {
    assertAllowed('cleanup() { rm -rf ../outside; }; time "--" cleanup', '/project');
    assertAllowed('cleanup() { rm -rf ../outside; }; !cleanup', '/project');
    assertAllowed('cleanup() { rm -rf ../outside; }; X=1 time cleanup', '/project');
    assertAllowed('cleanup() { rm -rf ../outside; }; X=1 ! cleanup', '/project');
  });

  test('keeps function definitions visible to eval', () => {
    assertBlocked('cleanup() { rm -rf ../outside; }; eval cleanup', 'outside cwd', '/project');
    assertBlocked('cleanup() { rm -rf ../outside; }; eval "cleanup"', 'outside cwd', '/project');
  });

  test('does not leak function definitions into a child shell', () => {
    assertAllowed('cleanup() { rm -rf ../outside; }; sh -c cleanup', '/project');
  });

  test('blocks a deferred assignment executed inside a function body', () => {
    assertBlocked(`W='rm -rf ~'; f() { $W; }; f`, 'destructive pattern', '/project');
    assertAllowed(`W='rm -rf ~'; f() { echo "$W"; }; f`, '/project');
  });
});

describe('rm -rf allow paths', () => {
  const policy = { destructiveCommandAllowPaths: ['/some/allowed'] };

  test('target inside an allow path is allowed', () => {
    expect(runGuard('rm -rf /some/allowed/dir', undefined, policy)).toBeNull();
  });

  test('the allow path root itself is allowed', () => {
    expect(runGuard('rm -rf /some/allowed', undefined, policy)).toBeNull();
  });

  test('sibling paths sharing the allow path prefix stay blocked', () => {
    expect(runGuard('rm -rf /some/allowed-evil', undefined, policy)).toContain('rm -rf');
  });

  test('~ allow paths expand to home-relative targets', () => {
    expect(
      runGuard('rm -rf ~/cc-safety-net-sandbox/dist', undefined, {
        destructiveCommandAllowPaths: ['~/cc-safety-net-sandbox'],
      }),
    ).toBeNull();
  });

  test('home and home-containing allow entries are ignored at runtime', () => {
    expect(
      runGuard('rm -rf ~/projects', undefined, { destructiveCommandAllowPaths: ['~'] }),
    ).toContain('rm -rf');
    const root = parse(homedir()).root;
    expect(
      runGuard(`rm -rf ${toShellPath(join(root, 'some', 'path'))}`, undefined, {
        destructiveCommandAllowPaths: [root],
      }),
    ).toContain('rm -rf');
  });

  test('root and home targets stay blocked regardless of allow paths', () => {
    expect(
      runGuard('rm -rf ~', undefined, { destructiveCommandAllowPaths: ['~/sandbox'] }),
    ).toContain('extremely dangerous');
  });

  test('dynamic targets inside an allow path stay blocked in strict mode', () => {
    expect(
      analyzeTestCommand('rm -rf /some/allowed/$DIR', { strict: true, config: policy })?.reason,
    ).toContain('shell variables');
  });

  test('literal targets inside an allow path stay allowed in strict and paranoid mode', () => {
    expect(
      analyzeTestCommand('rm -rf /some/allowed/dir', { strict: true, config: policy }),
    ).toBeNull();
    expect(
      analyzeTestCommand('rm -rf /some/allowed/dir', {
        strict: true,
        paranoidRm: true,
        config: policy,
      }),
    ).toBeNull();
  });

  test('allow paths bypass paranoid rm checks like trusted temp roots', () => {
    expect(
      analyzeTestCommand('rm -rf /some/allowed/dir', { paranoidRm: true, config: policy }),
    ).toBeNull();
    expect(
      analyzeTestCommand('rm -rf dist', {
        cwd: '/some/allowed',
        paranoidRm: true,
        config: policy,
      }),
    ).toBeNull();
    expect(
      analyzeTestCommand('rm -rf dist', { cwd: '/some/allowed', paranoidRm: true })?.reason,
    ).toContain('safety policy');
  });

  test('symlinked targets escaping the allow path stay blocked', () => {
    const root = mkdtempSync(join(tmpdir(), 'cc-safety-net-allow-'));
    try {
      // Symlink to the repo checkout: a real directory that is never a trusted temp path.
      symlinkSync(process.cwd(), join(root, 'escape'));
      expect(
        runGuard(`rm -rf ${toShellPath(join(root, 'escape', 'projects'))}`, undefined, {
          destructiveCommandAllowPaths: [root],
        }),
      ).toContain('rm -rf');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('allow entries that are symlinks into home are ignored', () => {
    const root = mkdtempSync(join(tmpdir(), 'cc-safety-net-allow-'));
    try {
      symlinkSync(homedir(), join(root, 'escape'));
      expect(
        runGuard('rm -rf ~/projects', undefined, {
          destructiveCommandAllowPaths: [join(root, 'escape')],
        }),
      ).toContain('rm -rf');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('rm -rf cwd-aware', () => {
  let tmpDir: string;

  const setup = () => {
    tmpDir = mkdtempSync(join(tmpdir(), 'safety-net-test-'));
  };

  const cleanup = () => {
    if (tmpDir) {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  };

  test('rm -rf relative path in home cwd blocked', () => {
    setup();
    try {
      assertBlocked('rm -rf build', 'rm -rf', tmpDir, testEnvironment({ HOME: tmpDir }));
    } finally {
      cleanup();
    }
  });

  test('rm -rf bare glob in home cwd blocked in standard mode', () => {
    setup();
    try {
      assertBlocked(
        'rm -rf *',
        'targeting root or home',
        tmpDir,
        testEnvironment({ HOME: tmpDir }),
      );
    } finally {
      cleanup();
    }
  });

  test('rm -rf bare glob in home cwd blocked as root or home in strict and paranoid modes', () => {
    setup();
    try {
      const environment = testEnvironment({ HOME: tmpDir });
      for (const level of ['strict', 'paranoid'] as const) {
        expect(
          analyzeTestCommand('rm -rf *', {
            cwd: tmpDir,
            environment,
            config: { safety: { level } },
          })?.ruleId,
          level,
        ).toBe('rm.recursive-force-root-or-home');
      }
    } finally {
      cleanup();
    }
  });

  test("rm -rf quoted literal '*' in home cwd keeps home-cwd classification", () => {
    setup();
    try {
      expect(
        analyzeTestCommand("rm -rf '*'", {
          cwd: tmpDir,
          environment: testEnvironment({ HOME: tmpDir }),
        })?.ruleId,
      ).toBe('rm.recursive-force-home-cwd');
    } finally {
      cleanup();
    }
  });

  test('rm -rf bare glob outside home keeps its dynamic-target classification', () => {
    setup();
    const home = mkdtempSync(join(tmpdir(), 'safety-net-test-home-'));
    try {
      const environment = testEnvironment({ HOME: home });
      expect(analyzeTestCommand('rm -rf *', { cwd: tmpDir, environment })).toBeNull();
      expect(
        analyzeTestCommand('rm -rf *', { cwd: tmpDir, environment, strict: true })?.ruleId,
      ).toBe('rm.recursive-force-dynamic-target');
    } finally {
      rmSync(home, { recursive: true, force: true });
      cleanup();
    }
  });

  test('rm -rf relative path in symlinked home cwd blocked', () => {
    withSymlinkedHomeCwd('safety-net-rm-home-link-', (home, cwd) => {
      assertBlocked('rm -rf build', 'home directory', cwd, testEnvironment({ HOME: home }));
    });
  });

  test('rm -rf /tmp target in home cwd allowed', () => {
    setup();
    try {
      assertAllowed('rm -rf /tmp/test-dir', tmpDir, testEnvironment({ HOME: tmpDir }));
    } finally {
      cleanup();
    }
  });

  test('rm -rf /var/tmp target in home cwd allowed', () => {
    setup();
    try {
      assertAllowed('rm -rf /var/tmp/test-dir', tmpDir, testEnvironment({ HOME: tmpDir }));
    } finally {
      cleanup();
    }
  });

  test('rm -rf $TMPDIR target in home cwd allowed', () => {
    setup();
    try {
      assertAllowed('rm -rf $TMPDIR/test-dir', tmpDir, testEnvironment({ HOME: tmpDir }));
    } finally {
      cleanup();
    }
  });

  test('rm -rf mixed temp and home-relative targets in home cwd blocked', () => {
    setup();
    try {
      assertBlocked(
        'rm -rf /tmp/test-dir build',
        'home directory',
        tmpDir,
        testEnvironment({ HOME: tmpDir }),
      );
    } finally {
      cleanup();
    }
  });

  test('rm -rf relative path in subdir of home allowed', () => {
    setup();
    try {
      const repo = join(tmpDir, 'repo');
      require('node:fs').mkdirSync(repo);
      assertAllowed('rm -rf build', repo, testEnvironment({ HOME: tmpDir }));
    } finally {
      cleanup();
    }
  });

  test('classifies only the canonical literal home target as catastrophic', () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-rm-literal-home-'));
    try {
      const home = join(root, 'home');
      const cwd = join(root, 'workspace');
      mkdirSync(join(home, 'project'), { recursive: true });
      mkdirSync(cwd);
      const configs: TestPolicyInput[] = [
        {},
        { destructiveCommandProtectionEnabled: false },
        {
          destructiveCommandRuleOverrides: { 'rm.recursive-force-root-or-home': 'off' },
        },
      ];

      const environment = testEnvironment({ HOME: home });
      for (const config of configs) {
        expect(
          analyzeTestCommand(`rm -rf ${toShellPath(home)}`, { cwd, config, environment })?.ruleId,
        ).toBe('rm.recursive-force-root-or-home');
        expect(
          analyzeTestCommand(`find ${toShellPath(home)} -delete`, { cwd, config, environment })
            ?.ruleId,
        ).toBe('rm.recursive-force-root-or-home');
        expect(
          analyzeTestCommand(
            `find ${toShellPath(home)} -exec rm -f /tmp/cache \\; -exec rm -rf {} +`,
            { cwd, config, environment },
          )?.ruleId,
        ).toBe('rm.recursive-force-root-or-home');
        expect(
          analyzeTestCommand(`find ${toShellPath(home)} -exec rm -r {} +`, {
            cwd,
            config,
            environment,
          })?.ruleId,
        ).toBe('rm.recursive-force-root-or-home');
        expect(
          analyzeTestCommand(`find ${toShellPath(home)} -type f -exec rm -f {} +`, {
            cwd,
            config,
            environment,
          })?.ruleId,
        ).toBe('rm.recursive-force-root-or-home');
      }
      expect(
        analyzeTestCommand(`find ${toShellPath(home)} -maxdepth 0 -exec rm -f /tmp/cache \\;`, {
          cwd,
          environment,
        })?.ruleId,
      ).not.toBe('rm.recursive-force-root-or-home');
      expect(analyzeTestCommand('rm -rf ../home', { cwd, environment })?.ruleId).toBe(
        'rm.recursive-force-root-or-home',
      );
      expect(analyzeTestCommand('rm -r ../home', { cwd, environment })?.ruleId).toBe(
        'rm.recursive-force-root-or-home',
      );
      expect(analyzeTestCommand('rm --recursiv ../home', { cwd, environment })?.ruleId).toBe(
        'rm.recursive-force-root-or-home',
      );
      expect(
        analyzeTestCommand(`rm -rf ${toShellPath(home)}/*`, { cwd, environment })?.ruleId,
      ).toBe('rm.recursive-force-root-or-home');
      expect(analyzeTestCommand(`rm -rf ${toShellPath(home)}/`, { cwd, environment })?.ruleId).toBe(
        'rm.recursive-force-root-or-home',
      );
      expect(
        analyzeTestCommand(`rm -rf ${toShellPath(join(home, 'project'))}`, { cwd, environment })
          ?.ruleId,
      ).not.toBe('rm.recursive-force-root-or-home');
      expect(
        analyzeTestCommand(`find ${toShellPath(join(home, 'project'))} -delete`, {
          cwd,
          environment,
        })?.ruleId,
      ).not.toBe('rm.recursive-force-root-or-home');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('rm -rf relative path allowed', () => {
    setup();
    try {
      assertAllowed('rm -rf build', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf ./dist allowed', () => {
    setup();
    try {
      assertAllowed('rm -rf ./dist', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf symlinked directory outside cwd blocked', () => {
    const root = mkdtempSync(join(tmpdir(), 'safety-net-rm-symlink-'));
    try {
      const cwd = join(root, 'cwd');
      const outside = join(root, 'outside');
      mkdirSync(cwd);
      mkdirSync(outside);
      writeFileSync(join(outside, 'kept'), 'outside');
      symlinkSync(outside, join(cwd, 'escape'), 'dir');

      assertBlocked('rm -rf ./escape/', 'rm -rf outside cwd', cwd);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('rm -rf ../other blocked', () => {
    setup();
    try {
      assertBlocked('rm -rf ../other', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf brace expansion beyond the expansion limit fails closed as outside cwd', () => {
    setup();
    try {
      const alternatives = [...Array.from({ length: 64 }, (_, i) => `pad${i}`), '../escape'].join(
        ',',
      );
      expect(analyzeTestCommand(`rm -rf {${alternatives}}`, { cwd: tmpDir })?.ruleId).toBe(
        'rm.recursive-force-outside-cwd',
      );
    } finally {
      cleanup();
    }
  });

  test('rm -rf /other/path blocked', () => {
    setup();
    try {
      assertBlocked('rm -rf /other/path', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf absolute inside cwd allowed', () => {
    setup();
    try {
      const inside = join(tmpDir, 'dist');
      assertAllowed(`rm -rf ${toShellPath(inside)}`, tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf ./subdir 2>/dev/null allowed', () => {
    setup();
    try {
      assertAllowed('rm -rf ./subdir 2>/dev/null', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('attached io-number redirect does not become a numeric rm target', () => {
    assertAllowed('rm -rf 123>/dev/null');
  });

  test('rm -rf . blocked', () => {
    setup();
    try {
      assertBlocked('rm -rf .', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf cwd itself by explicit temp path allowed', () => {
    setup();
    try {
      assertAllowed(`rm -rf ${toShellPath(tmpDir)}`, tmpDir);
    } finally {
      cleanup();
    }
  });

  test('cd .. && rm -rf build blocked', () => {
    setup();
    try {
      assertBlocked('cd .. && rm -rf build', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('cd to current cwd keeps rm -rf relative path allowed', () => {
    setup();
    try {
      assertAllowed(`cd ${toShellPath(tmpDir)} && rm -rf build`, tmpDir);
    } finally {
      cleanup();
    }
  });

  test('paranoid rm blocks within cwd', () => {
    setup();
    try {
      withEnv({ SAFETY_NET_PARANOID_RM: '1' }, () => {
        assertBlocked('rm -rf build', 'active safety policy', tmpDir);
      });
    } finally {
      cleanup();
    }
  });

  test('global paranoid blocks within cwd', () => {
    setup();
    try {
      withEnv({ SAFETY_NET_PARANOID: '1' }, () => {
        assertBlocked('rm -rf build', 'active safety policy', tmpDir);
      });
    } finally {
      cleanup();
    }
  });

  test('rm -rf after builtin cd bypasses cwd allowlist blocked', () => {
    setup();
    try {
      assertBlocked('builtin cd .. && rm -rf build', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf after command substitution cd bypasses cwd allowlist blocked', () => {
    setup();
    try {
      assertBlocked('$( cd ..; rm -rf build )', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf after grouped cd bypasses cwd allowlist blocked', () => {
    setup();
    try {
      assertBlocked('{ cd ..; rm -rf build; }', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf after safe command substitution cd bypasses cwd allowlist blocked', () => {
    setup();
    try {
      assertBlocked('$( cd ..; echo ok ) && rm -rf build', 'outside cwd', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf after safe grouped cd bypasses cwd allowlist blocked', () => {
    setup();
    try {
      assertBlocked('{ cd ..; echo ok; } && rm -rf build', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf after subshell cd bypasses cwd allowlist blocked', () => {
    setup();
    try {
      assertBlocked('( cd ..; rm -rf build )', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf after time cd bypasses cwd allowlist blocked', () => {
    setup();
    try {
      assertBlocked('time cd .. && rm -rf build', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf after builtin time cd bypasses cwd allowlist blocked', () => {
    setup();
    try {
      assertBlocked('builtin time cd .. && rm -rf build', 'rm -rf', tmpDir);
      assertBlocked('builtin time -p cd .. && rm -rf build', 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('ANSI-C quoted rm command blocked', () => {
    setup();
    try {
      assertBlocked("$'\\x72\\x6d' -rf /", 'rm -rf', tmpDir);
      assertBlocked("bash -c $'rm -rf /'", 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('escaped rm with comment quote blocked in default mode', () => {
    setup();
    try {
      assertBlocked("r\\m -rf / #'", 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('TMPDIR= empty assignment is strict-only', () => {
    setup();
    try {
      const command = 'TMPDIR= rm -rf $TMPDIR/test-dir';
      assertAllowed(command, tmpDir);
      assertStrictBlocked(command, 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('TMPDIR=/tmp-malicious is strict-only', () => {
    setup();
    try {
      const command = 'TMPDIR=/tmp-malicious rm -rf $TMPDIR/test-dir';
      assertAllowed(command, tmpDir);
      assertStrictBlocked(command, 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('TMPDIR=/tmp/subdir allowed (subpath of /tmp)', () => {
    setup();
    try {
      assertAllowed('TMPDIR=/tmp/subdir rm -rf $TMPDIR/test-dir', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('TMPDIR symlink from temp to non-temp is strict-only', () => {
    setup();
    const outsideTemp = mkdtempSync(join(process.cwd(), 'outside-temp-'));
    const tempLink = join(tmpdir(), `safety-net-tmpdir-link-${Date.now()}`);
    symlinkSync(outsideTemp, tempLink, process.platform === 'win32' ? 'junction' : 'dir');
    try {
      const command = `TMPDIR=${toShellPath(tempLink)} rm -rf $TMPDIR/test-dir`;
      assertAllowed(command, tmpDir);
      assertStrictBlocked(command, 'rm -rf', tmpDir);
    } finally {
      rmSync(tempLink, { recursive: true, force: true });
      rmSync(outsideTemp, { recursive: true, force: true });
      cleanup();
    }
  });

  test('TMPDIR=/tmp/../root is strict-only', () => {
    setup();
    try {
      const command = 'TMPDIR=/tmp/../root rm -rf $TMPDIR/test-dir';
      assertAllowed(command, tmpDir);
      assertStrictBlocked(command, 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('TMPDIR=/var/tmp-malicious is strict-only', () => {
    setup();
    try {
      const command = 'TMPDIR=/var/tmp-malicious rm -rf $TMPDIR/test-dir';
      assertAllowed(command, tmpDir);
      assertStrictBlocked(command, 'rm -rf', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('TMPDIR statement assignment with a word-splitting value is strict-only', () => {
    setup();
    try {
      const command = 'TMPDIR="/tmp/safe /Users"; rm -rf $TMPDIR/literal';
      assertAllowed(command, tmpDir);
      assertStrictBlocked(command, 'rm -rf target contains shell variables', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('statement-assigned dynamic suffixes under literal temp roots are strict-only', () => {
    setup();
    try {
      for (const command of [
        'name=../Users; rm -rf /tmp/$name',
        'name=../Users; rm -rf /var/tmp/$name',
      ]) {
        assertAllowed(command, tmpDir);
        assertStrictBlocked(command, 'rm -rf target contains shell variables', tmpDir);
      }
    } finally {
      cleanup();
    }
  });

  test('brace traversal under a literal temp root is blocked in both modes', () => {
    setup();
    try {
      const command = 'rm -rf /tmp/{safe,../Users}';
      assertBlocked(command, 'rm -rf outside cwd', tmpDir);
      assertStrictBlocked(command, 'rm -rf outside cwd', tmpDir);
    } finally {
      cleanup();
    }
  });

  test('rm -rf numeric target before redirect stays blocked conservatively', () => {
    assertBlocked('rm -rf 7 > /dev/null', 'rm -rf');
  });

  test('spaced numeric target before redirect stays blocked conservatively', () => {
    assertBlocked('rm -rf 123 >/dev/null', 'rm -rf');
  });
});

describe('analyzeRm Windows path handling', () => {
  const isWindows = process.platform === 'win32';

  test('recognizes Windows absolute path with backslash', () => {
    // Windows-style absolute path should be recognized as absolute
    // and compared against cwd (blocked since C:\\other is outside C:\\Projects)
    expect(analyzeRm(['rm', '-rf', 'C:\\other\\path'], { cwd: 'C:\\Projects' })).toContain(
      'rm -rf outside cwd',
    );
  });

  test('recognizes Windows absolute path with forward slash', () => {
    expect(analyzeRm(['rm', '-rf', 'C:/other/path'], { cwd: 'C:\\Projects' })).toContain(
      'rm -rf outside cwd',
    );
  });

  // This test can only pass on Windows where path.normalize properly handles backslashes
  test.skipIf(!isWindows)('allows Windows absolute path within cwd', () => {
    expect(analyzeRm(['rm', '-rf', 'C:\\Projects\\dist'], { cwd: 'C:\\Projects' })).toBeNull();
  });

  test.skipIf(!isWindows)('[windows] allows an MSYS drive path within cwd', () => {
    expect(analyzeRm(['rm', '-rf', '/c/Projects/dist'], { cwd: 'C:\\Projects' })).toBeNull();
  });

  test.skipIf(!isWindows)('[windows] allows a lowercase MSYS path within native temp', () => {
    const nativeTarget = join(
      tmpdir(),
      'claude/C--Users-PasquAlb/8d6a8ecf-d281-4d02-9511-b3f31a53e527/scratchpad/eoltest',
    );
    const msysTarget = toShellPath(nativeTarget).replace(
      /^([A-Za-z]):\//,
      (_, drive: string) => `/${drive.toLowerCase()}/`,
    );

    expect(analyzeRm(['rm', '-rf', msysTarget])).toBeNull();
  });

  test.skipIf(!isWindows)('[windows] blocks MSYS paths outside cwd', () => {
    expect(analyzeRm(['rm', '-rf', '/c/Other/dist'], { cwd: 'C:\\Projects' })).toContain(
      'rm -rf outside cwd',
    );
    expect(analyzeRm(['rm', '-rf', '/d/Projects/dist'], { cwd: 'C:\\Projects' })).toContain(
      'rm -rf outside cwd',
    );
  });

  test.skipIf(!isWindows)('[windows] blocks MSYS drive root targets as catastrophic', () => {
    ['/c', '/c/', '/c/*'].forEach((target) => {
      expect(analyzeRm(['rm', '-rf', target], { cwd: 'C:\\Projects' })).toContain(
        'root or home directory',
      );
    });
  });

  test.skipIf(!isWindows)('[windows] blocks an MSYS HOME target as catastrophic', () => {
    const home = mkdtempSync(join(tmpdir(), 'safety-net-msys-home-'));
    const msysHome = toShellPath(home).replace(/^([A-Za-z]):\//, '/$1/');
    try {
      expect(
        analyzeRm(['rm', '-rf', msysHome], {
          cwd: dirname(home),
          environment: testEnvironment({ HOME: msysHome }),
        }),
      ).toContain('root or home directory');
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });

  test.skipIf(!isWindows)('[windows] allows a quoted Windows backslash path within cwd', () => {
    expect(analyzeTestCommand('rm -rf "C:\\Projects\\dist"', { cwd: 'C:\\Projects' })).toBeNull();
  });

  test.skipIf(!isWindows)(
    '[windows] tokenizes backslash targets exactly as Git Bash word-splits them',
    () => {
      const path = String.raw`C:\Users\PasquAlb\AppData\Local\Temp\claude\scratchpad\eoltest`;
      [path, `"${path}"`].forEach((spelling) => {
        const bashWord = Bun.spawnSync(['bash', '-c', `printf '%s' ${spelling}`]).stdout.toString();
        expect(projectSegmentWords(parseCommand(`rm -rf ${spelling}`))).toEqual([
          ['rm', '-rf', bashWord],
        ]);
      });
    },
  );

  test.skipIf(!isWindows)('[windows] allows a quoted backslash path within native temp', () => {
    const nativeTarget = join(
      tmpdir(),
      'claude',
      'C--Users-PasquAlb',
      '8d6a8ecf-d281-4d02-9511-b3f31a53e527',
      'scratchpad',
      'eoltest',
    );
    expect(analyzeTestCommand(`rm -rf "${nativeTarget}"`)).toBeNull();
  });

  test('allows relative path with backslash prefix', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'safety-net-win-'));
    try {
      // .\\dist is a relative path, should be allowed within cwd
      expect(analyzeRm(['rm', '-rf', '.\\dist'], { cwd })).toBeNull();
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test('allows path without any separators', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'safety-net-win-'));
    try {
      // 'dist' has no separators, should be treated as relative
      expect(analyzeRm(['rm', '-rf', 'dist'], { cwd })).toBeNull();
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});

describe('analyzeRm (unit)', () => {
  test('does not treat flags after -- as rm -rf', () => {
    expect(analyzeRm(['rm', '--', '-rf', '/'], { cwd: '/tmp' })).toBeNull();
  });

  test('blocks $HOME targets', () => {
    expect(analyzeRm(['rm', '-rf', '$HOME/*'], { cwd: '/tmp' })).toContain('extremely dangerous');
  });

  test('blocks ${HOME} targets', () => {
    expect(analyzeRm(['rm', '-rf', '${HOME}/*'], { cwd: '/tmp' })).toContain('extremely dangerous');
  });

  test('treats ${TMPDIR} paths as temp when allowed', () => {
    expect(
      analyzeRm(['rm', '-rf', '${TMPDIR}/test'], {
        cwd: '/tmp',
        allowTmpdirVar: true,
      }),
    ).toBeNull();
  });

  test('does not trust ${TMPDIR} when disallowed in strict mode', () => {
    const options = {
      cwd: '/tmp',
      allowTmpdirVar: false,
    };
    expect(analyzeRm(['rm', '-rf', '${TMPDIR}/test'], options)).toBeNull();
    expect(
      analyzeRm(['rm', '-rf', '${TMPDIR}/test'], {
        ...options,
        strict: true,
      }),
    ).toContain('shell variables');
  });

  test('blocks shell variable targets with dynamic-path reason in strict mode', () => {
    const tokens = ['rm', '-rf', '$tmpbase', '$outside'];
    expect(analyzeRm(tokens, { cwd: '/tmp' })).toBeNull();
    expect(analyzeRm(tokens, { cwd: '/tmp', strict: true })).toContain('shell variables');
  });

  test('blocks backtick targets with dynamic-path reason in strict mode', () => {
    const tokens = ['rm', '-rf', '`pwd`/escape'];
    expect(analyzeRm(tokens, { cwd: '/tmp' })).toBeNull();
    expect(analyzeRm(tokens, { cwd: '/tmp', strict: true })).toContain('shell variables');
  });

  test('handles non-string cwd defensively', () => {
    const badCwd = 1 as unknown as string;
    expect(analyzeRm(['rm', '-rf', 'foo'], { cwd: badCwd })).toContain('rm -rf outside cwd');
  });

  test('handles absolute-path checks defensively', () => {
    const badCwd = 1 as unknown as string;
    expect(analyzeRm(['rm', '-rf', '/abs'], { cwd: badCwd })).toContain('rm -rf outside cwd');
  });

  test('blocks tilde-prefixed paths (not cwd-relative)', () => {
    expect(analyzeRm(['rm', '-rf', '~/somewhere'], { cwd: '/tmp' })).toContain(
      'rm -rf outside cwd',
    );
  });

  test('blocks ../ paths', () => {
    expect(analyzeRm(['rm', '-rf', '../escape'], { cwd: '/tmp' })).toContain('rm -rf outside cwd');
  });

  test('allows nested relative paths within cwd', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'safety-net-rm-unit-'));
    try {
      expect(
        analyzeRm(['rm', '-rf', 'subdir/file'], {
          cwd,
          originalCwd: cwd,
        }),
      ).toBeNull();
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test('blocks rm -rf in home cwd via direct analyzeRm call', () => {
    const home = homedir();
    expect(analyzeRm(['rm', '-rf', 'somefile'], { cwd: home })).toContain('home directory');
  });

  test('rm -rf . falls back from home-cwd to cwd-self when the home-cwd rule is off', () => {
    const home = homedir();
    const match = analyzeRmMatch(textCommandWords(['rm', '-rf', '.']), {
      originalCwd: home,
      policy: commandAnalysisPolicy(
        policySnapshot({
          destructiveCommandRuleOverrides: { 'rm.recursive-force-home-cwd': 'off' },
        }),
      ),
    });
    expect(match?.id).toBe('rm.recursive-force-cwd-self');
  });

  test('handles paths with separators and bad cwd defensively', () => {
    // 'foo/bar' has separators but doesn't start with ./, hitting the final try-catch (line 317)
    const badCwd = 1 as unknown as string;
    expect(analyzeRm(['rm', '-rf', 'foo/bar'], { cwd: badCwd })).toContain('rm -rf outside cwd');
  });

  test.skipIf(process.platform !== 'win32')(
    '[windows] blocks Windows namespace targets before temp, home, cwd, or contained-path eligibility',
    () => {
      const cwd = mkdtempSync(join(tmpdir(), 'safety-net-rm-namespace-'));
      const child = join(cwd, 'dist');
      mkdirSync(child);
      const localNamespace = toNamespacedPath(child);
      try {
        for (const target of [
          localNamespace,
          String.raw`\\server\share`,
          String.raw`/\server\share`,
          String.raw`\/server/share`,
        ]) {
          const match = analyzeRmMatch(textCommandWords(['rm', '-rf', target]), {
            cwd,
            originalCwd: cwd,
          });
          expect(match?.id).toBe('rm.recursive-force-outside-cwd');
          expect(match?.reason).toContain('outside cwd is blocked');
        }

        expect(
          analyzeRmMatch(textCommandWords(['rm', '-rf', child]), { cwd, originalCwd: cwd }),
        ).toBeNull();
        expect(
          analyzeRmMatch(textCommandWords(['rm', '-rf', child, localNamespace]), {
            cwd,
            originalCwd: cwd,
          })?.id,
        ).toBe('rm.recursive-force-outside-cwd');

        const match = analyzeRmMatch(textCommandWords(['rm', '-rf', localNamespace]), {
          cwd: localNamespace,
          originalCwd: localNamespace,
          environment: testEnvironment({
            HOME: localNamespace,
            TEMP: localNamespace,
            TMP: localNamespace,
          }),
        });
        expect(match?.id).toBe('rm.recursive-force-outside-cwd');
        expect(match?.reason).toContain('outside cwd is blocked');
      } finally {
        rmSync(cwd, { recursive: true, force: true });
      }
    },
  );
});
