import { describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  PATH_CANONICALIZATION_LIMITS,
  PathCanonicalizationLimitError,
} from '@/analyzer/path-canonicalization';
import {
  findSensitivePathTarget,
  findSensitiveTargetInCommand,
  findSensitiveTargetInToolInput as findSensitiveTargetWithRoute,
  getCommandFromToolInput,
} from '@/guards/secret-protection';
import type { ToolRoute } from '@/ir/invocation';
import type { SecretProtectionConfig } from '@/ir/policy';
import { getNonCommandToolInputKind, normalizeToolName } from '@/parser/tool-input';
import {
  SECRET_CODING_CLI_RULES,
  SECRET_PROTECTION_RULE_IDS,
  SECRET_PROTECTION_RULE_METADATA,
} from '@/rules/secret-protection-rules';
import { withEnv } from '../helpers.ts';

const COMMAND_TOOL_NAMES = new Set([
  'bash',
  'powershell',
  'runcommand',
  'runshellcommand',
  'shell',
]);

const CONFIG_WITH_CODING_CLI_RULES_DISABLED: SecretProtectionConfig = {
  disabledRules: new Set(
    SECRET_PROTECTION_RULE_IDS.filter((ruleId) => ruleId.startsWith('secret.cli.')),
  ),
  denyPaths: [],
};

function findSensitiveTargetInToolInput(
  toolName: string,
  input: unknown,
  cwd = process.cwd(),
  config?: SecretProtectionConfig,
) {
  const route: ToolRoute = COMMAND_TOOL_NAMES.has(normalizeToolName(toolName))
    ? { kind: 'command', shell: 'auto' }
    : { kind: getNonCommandToolInputKind(toolName) };
  return findSensitiveTargetWithRoute(input, route, cwd, config);
}

function expectAllowedOnlyInStandardMode(command: string, cwd: string) {
  expect(
    findSensitiveTargetInCommand(command, cwd, undefined, { strict: false }),
    command,
  ).toBeNull();
  expect(
    findSensitiveTargetInCommand(command, cwd, undefined, { strict: true }),
    command,
  ).not.toBeNull();
}

describe('secret protection rule metadata', () => {
  test('covers every stable per-pattern rule id', () => {
    expect(SECRET_PROTECTION_RULE_METADATA.map((entry) => entry.id).sort()).toEqual(
      [...SECRET_PROTECTION_RULE_IDS].sort(),
    );
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.basename.env');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.pattern.env-variant');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.home.ssh');
    expect(SECRET_PROTECTION_RULE_IDS).not.toContain('secret.dir.secrets');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.variant.id-rsa.pem');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.variant.id-dsa.separator');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.variant.id-dsa.bak');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.home.kube-config.bak');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.home.docker-config.bak');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.ext.pem');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.claude-code');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.claude-code.config');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.antigravity');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.codex');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.codex.config');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.gemini');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.gemini.config');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.copilot-cli');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.copilot-cli.config');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.kimi-code');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.kimi-code.config');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.opencode');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.opencode.config');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.pi');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.pi.config');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.amp');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.amp.config');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.cursor');
    expect(SECRET_PROTECTION_RULE_IDS).toContain('secret.cli.cursor.config');
    for (const entry of SECRET_PROTECTION_RULE_METADATA) {
      expect(entry.category).not.toBe('');
      expect(entry.label).not.toBe('');
      expect('paths' in entry ? entry.paths.length > 0 : entry.description !== '').toBe(true);
    }
  });

  test('separates coding CLI credential rules from coding CLI config rules', () => {
    for (const rule of SECRET_CODING_CLI_RULES) {
      // Antigravity has no file credential store, so its only tier is config.
      const configTier = rule.id.endsWith('.config') || rule.id === 'secret.cli.antigravity';
      expect(rule.category, rule.id).toBe(
        configTier ? 'Coding CLI config' : 'Coding CLI credential',
      );
    }
    expect(
      SECRET_CODING_CLI_RULES.find((rule) => rule.id === 'secret.cli.antigravity')?.label,
    ).toBe('Antigravity CLI hook config');
  });
});

describe('secret protection path matching', () => {
  test('reuses repeated canonicalization work across the complete target set', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'secret-protection-path-budget-'));
    try {
      expect(
        findSensitivePathTarget(
          Array(PATH_CANONICALIZATION_LIMITS.maxRealpathAttempts + 1).fill(cwd),
          cwd,
          CONFIG_WITH_CODING_CLI_RULES_DISABLED,
        ),
      ).toBeNull();
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test('shares one canonicalization budget across distinct targets', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'secret-protection-path-budget-'));
    try {
      const boundaryTargetCount = PATH_CANONICALIZATION_LIMITS.maxRealpathAttempts / 2 - 1;
      const targets = Array.from({ length: boundaryTargetCount }, (_, index) =>
        join(cwd, `ordinary-${index}.txt`),
      );
      expect(
        findSensitivePathTarget(targets, cwd, CONFIG_WITH_CODING_CLI_RULES_DISABLED),
      ).toBeNull();

      expect(() =>
        findSensitivePathTarget(
          [...targets, join(cwd, 'over-budget.txt')],
          cwd,
          CONFIG_WITH_CODING_CLI_RULES_DISABLED,
        ),
      ).toThrow(PathCanonicalizationLimitError);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  test('matches project env files without substring matching', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget(['.env'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['.env.local'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['src/env.ts'], cwd)).toBeNull();
  });

  test('returns rule id for project env files', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget(['.env'], cwd)?.ruleId).toBe('secret.basename.env');
  });

  test('blocks configured paths and descendants without matching sibling prefixes', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const config = {
      disabledRules: new Set<string>(),
      denyPaths: ['protected'],
    };

    for (const target of ['protected', 'protected/child.txt', 'protected/nested/child.txt']) {
      expect(findSensitivePathTarget([target], cwd, config)?.ruleId, target).toBe(
        'secret.deny-path',
      );
    }
    expect(findSensitivePathTarget(['protected-sibling/child.txt'], cwd, config)).toBeNull();
  });

  test('blocks descendants of configured home and filesystem root paths', () => {
    const home = mkdtempSync(join(tmpdir(), 'secret-protection-deny-home-'));
    try {
      withEnv({ HOME: home }, () => {
        expect(
          findSensitivePathTarget(['~/developer/projects/child.txt'], home, {
            disabledRules: new Set(),
            denyPaths: ['~/developer/projects'],
          })?.ruleId,
        ).toBe('secret.deny-path');
      });
      expect(
        findSensitivePathTarget([join(tmpdir(), 'ordinary.txt')], home, {
          disabledRules: new Set(),
          denyPaths: ['/'],
        })?.ruleId,
      ).toBe('secret.deny-path');
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });

  test('returns rule id for sensitive extensions', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget(['server.pem'], cwd)?.ruleId).toBe('secret.ext.pem');
  });

  test('allows common env template files', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget(['.env.example'], cwd)).toBeNull();
    expect(findSensitivePathTarget(['.env.sample'], cwd)).toBeNull();
    expect(findSensitivePathTarget(['.env.template'], cwd)).toBeNull();
    expect(findSensitivePathTarget(['.env.defaults'], cwd)).toBeNull();
  });

  test('matches home credential paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget(['~/.ssh'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['~/.ssh/id_rsa'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['~/.aws'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['~/.aws/credentials'], cwd)).not.toBeNull();
    expect(
      findSensitivePathTarget(['~/.config/gcloud/application_default_credentials.json'], cwd),
    ).not.toBeNull();
    expect(findSensitivePathTarget(['~/.kube/config'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['~/.docker/config.json'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['~/.npmrc'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['~/.pypirc'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['~/.netrc'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['~/.git-credentials'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['~/.config/gh/hosts.yml'], cwd)).not.toBeNull();
  });

  test('matches supported environment-expanded credential paths', () => {
    const home = join(tmpdir(), 'secret-protection-env-home');
    const codexHome = join(home, 'state', 'codex');
    const cwd = join(home, 'project');

    withEnv({ HOME: home, CODEX_HOME: codexHome }, () => {
      for (const target of [
        '$HOME/.ssh/id_rsa',
        '${HOME}/.aws/credentials',
        '$CODEX_HOME/auth.json',
        '${CODEX_HOME}/config.toml',
      ]) {
        expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
      }

      expect(findSensitiveTargetInCommand('cat $CODEX_HOME/auth.json', cwd)).not.toBeNull();
      expect(
        findSensitiveTargetInToolInput('Read', { file_path: '${CODEX_HOME}/config.toml' }, cwd),
      ).not.toBeNull();
    });
  });

  test('matches supported parameter-expanded credential paths', () => {
    const home = join(tmpdir(), 'secret-protection-param-home');
    const codexHome = join(home, 'state', 'codex');
    const cwd = join(home, 'project');

    withEnv({ HOME: home, CODEX_HOME: codexHome }, () => {
      for (const command of [
        'cat ${HOME:-/tmp}/.kube/config',
        'cat ${HOME:?missing}/.docker/config.json',
        'cat ${CODEX_HOME:-~/.codex}/auth.json',
      ]) {
        expect(findSensitiveTargetInCommand(command, cwd), command).not.toBeNull();
      }
    });
  });

  test('matches symlink aliases to coding CLI credential files', () => {
    const root = mkdtempSync(join(tmpdir(), 'secret-protection-symlink-'));

    try {
      const codexHome = join(root, 'codex-home');
      const cwd = join(root, 'project');
      const credentialPath = join(codexHome, 'auth.json');
      const aliasPath = join(cwd, 'session-cache.json');
      mkdirSync(codexHome, { recursive: true });
      mkdirSync(cwd, { recursive: true });
      writeFileSync(credentialPath, '{}');
      symlinkSync(credentialPath, aliasPath);

      withEnv({ CODEX_HOME: codexHome, HOME: join(root, 'home') }, () => {
        expect(findSensitivePathTarget([aliasPath], cwd)).not.toBeNull();
        expect(
          findSensitiveTargetInToolInput('Read', { file_path: aliasPath }, cwd),
        ).not.toBeNull();
        expect(findSensitiveTargetInCommand(`cat ${aliasPath}`, cwd)).not.toBeNull();
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('matches tilde-prefixed symlink aliases to credential files', () => {
    const root = mkdtempSync(join(tmpdir(), 'secret-protection-tilde-symlink-'));

    try {
      const home = join(root, 'home');
      const codexHome = join(home, 'codex');
      const cwd = join(home, 'project');
      const credentialPath = join(codexHome, 'auth.json');
      mkdirSync(codexHome, { recursive: true });
      mkdirSync(cwd, { recursive: true });
      writeFileSync(credentialPath, '{}');
      symlinkSync(credentialPath, join(cwd, 'session-cache.json'));

      withEnv({ CODEX_HOME: codexHome, HOME: home }, () => {
        expect(findSensitivePathTarget(['~/project/session-cache.json'], cwd)).not.toBeNull();
        expect(
          findSensitiveTargetInCommand('cat ~/project/session-cache.json', cwd),
        ).not.toBeNull();
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test('matches local file URIs for home and coding CLI credentials', () => {
    const home = join(tmpdir(), 'secret-protection-file-uri-home');
    const codexHome = join(home, 'state', 'codex');
    const cwd = join(home, 'project');

    withEnv({ HOME: home, CODEX_HOME: codexHome }, () => {
      for (const target of [
        pathToFileURL(join(home, '.kube', 'config')).href,
        pathToFileURL(join(home, '.docker', 'config.json')).href,
        pathToFileURL(join(codexHome, 'auth.json')).href,
      ]) {
        expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
      }
    });
  });

  test.skipIf(process.platform !== 'win32')(
    'normalizes Windows-style separators, including relative ones',
    () => {
      const cwd = join(tmpdir(), 'secret-protection-project');

      expect(
        findSensitivePathTarget(['protected\\child.txt'], cwd, {
          disabledRules: new Set(),
          denyPaths: ['protected'],
        }),
      ).not.toBeNull();
    },
  );

  // A relative backslash path and a POSIX regex are the same string: only what
  // follows the backslash differs, and `protected\child.txt` cannot be opened on
  // POSIX anyway. So off Windows the backslash keeps its POSIX meaning (an
  // escape) and only drive-qualified or UNC candidates are separator-normalized.
  test.skipIf(process.platform === 'win32')(
    'normalizes drive-qualified and UNC separators off Windows',
    () => {
      const cwd = join(tmpdir(), 'secret-protection-project');

      // Drive-qualified and UNC candidates still split on backslashes, so the
      // built-in basename rules keep matching them off Windows.
      expect(findSensitivePathTarget(['C:\\Users\\me\\.npmrc'], cwd)?.ruleId).toBe(
        'secret.basename.npmrc',
      );
      expect(findSensitivePathTarget(['\\\\server\\share\\.netrc'], cwd)?.ruleId).toBe(
        'secret.basename.netrc',
      );
      // A relative backslash candidate is a literal filename here, not a path.
      expect(
        findSensitivePathTarget(['protected\\child.txt'], cwd, {
          disabledRules: new Set(),
          denyPaths: ['protected'],
        }),
      ).toBeNull();
    },
  );

  test('allows generic secrets directories while preserving sensitive filename rules', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget(['src/secrets/index.ts'], cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('rg --files src/secrets', cwd)).toBeNull();
    expect(findSensitivePathTarget(['src/secrets/id_rsa.pub'], cwd)).toBeNull();
    expect(findSensitivePathTarget(['src/secrets/.env'], cwd)?.ruleId).toBe('secret.basename.env');
    expect(findSensitivePathTarget(['src/secrets/id_rsa'], cwd)).not.toBeNull();
  });

  test('ignores empty and unrelated path targets', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget([''], cwd)).toBeNull();
    expect(findSensitivePathTarget(['package.json'], cwd)).toBeNull();
  });
});

describe('secret protection per-pattern overrides', () => {
  test('disabled rule ids skip only the matching default pattern', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitivePathTarget(['server.pem'], cwd, {
        disabledRules: new Set(['secret.ext.pem']),
        denyPaths: [],
      }),
    ).toBeNull();
    expect(
      findSensitivePathTarget(['server.p12'], cwd, {
        disabledRules: new Set(['secret.ext.pem']),
        denyPaths: [],
      }),
    ).not.toBeNull();
    expect(
      findSensitivePathTarget(['id_rsa.pem'], cwd, {
        disabledRules: new Set(['secret.ext.pem']),
        denyPaths: [],
      }),
    ).not.toBeNull();
  });

  test('explicit deny paths still block when the default pattern is disabled', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitivePathTarget(['server.pem'], cwd, {
        disabledRules: new Set(['secret.ext.pem']),
        denyPaths: ['server.pem'],
      }),
    ).not.toBeNull();
  });
});

describe('secret protection command target extraction', () => {
  test('blocks recognized file operands and redirects', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('cat .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('env cat .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('sudo command cat .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('grep TOKEN .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand("sed -n '1,10p' .env", cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('cp .env /tmp/env-copy', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('tar -czf env.tgz .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('rm .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('> .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('cat README.md && cat .env', cwd)).not.toBeNull();
  });

  test('does not block display-only mentions', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('echo "Add .env to .gitignore"', cwd)).toBeNull();
    expect(
      findSensitiveTargetInCommand('printf ".env files should not be committed\\n"', cwd),
    ).toBeNull();
    expect(
      findSensitiveTargetInCommand('echo "Add .env to .gitignore" | xargs echo', cwd),
    ).toBeNull();
    expect(
      findSensitiveTargetInCommand(
        'printf ".env files should not be committed\\n" | xargs echo',
        cwd,
      ),
    ).toBeNull();
    expect(findSensitiveTargetInCommand("cat 'unterminated .env", cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('tar -czf secrets.tgz README.md', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('zip secrets.zip README.md', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('custom-tool README.md', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('VAR=value', cwd)).toBeNull();
  });

  test('treats commands passed to cc-safety-net explain as inert data', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      `cc-safety-net explain --json --cwd /tmp/project 'cat /tmp/project/.env'`,
      `bun src/cli/cc-safety-net.ts explain --json --cwd /tmp/project 'cat /tmp/project/.env'`,
      `node dist/bin/cc-safety-net.js explain 'cat .env'`,
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).toBeNull();
    }
  });

  test('keeps active paths around cc-safety-net explain protected', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      `cc-safety-net explain --cwd ~/.ssh 'git status'`,
      `cc-safety-net explain 'cat .env' && cat .env`,
      `cc-safety-net explain "$(cat .env)"`,
      `bun src/cli/other.ts explain .env`,
      `bun src/cli/cc-safety-net.ts run .env`,
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).not.toBeNull();
    }
  });

  test('blocks unlisted file readers reading sensitive operands', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('xxd .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('base64 .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('openssl enc -in .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('strings id_rsa', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('custom-tool .env', cwd)).not.toBeNull();
    // key=value operands (dd if=/of=) are unwrapped
    expect(findSensitiveTargetInCommand('dd if=.env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('dd of=.env', cwd)).not.toBeNull();
  });

  test('does not flag unlisted commands with benign operands', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('custom-tool README.md', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('make FOO=bar', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('xxd README.md', cwd)).toBeNull();
  });

  test('scans find path roots without flagging predicate patterns', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('find ~/.ssh -type f', cwd)).not.toBeNull();
    expect(
      findSensitiveTargetInCommand('find protected/child -type f', cwd, {
        denyPaths: ['protected'],
      }),
    ).not.toBeNull();
    // -name .env is a search pattern, not a read
    expect(findSensitiveTargetInCommand('find . -name .env', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('find src -type f', cwd)).toBeNull();
  });

  test('allows metadata-only discovery in standard mode and blocks it in strict mode', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of ['test -f ~/.ssh/id_rsa', 'find ~/.ssh -type f']) {
      expectAllowedOnlyInStandardMode(command, cwd);
    }
  });

  test('keeps sensitive content access blocked in standard mode', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      'cat ~/.ssh/id_rsa',
      'find ~/.ssh -type f -exec cat {} +',
      'find ~/.ssh -type f -fprint .env',
      'test -f ~/.ssh/id_rsa && cat ~/.ssh/id_rsa',
      'test -f "$(cat ~/.ssh/id_rsa)"',
    ]) {
      expect(
        findSensitiveTargetInCommand(command, cwd, undefined, { strict: false }),
        command,
      ).not.toBeNull();
    }
  });

  test('keeps explicit deny paths protected during metadata discovery', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitiveTargetInCommand(
        'test -f protected/child.txt',
        cwd,
        { denyPaths: ['protected'] },
        { strict: false },
      ),
    ).toMatchObject({ ruleId: 'secret.deny-path' });
  });

  test('blocks find exec readers over sensitive matched paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('find . -name .env -exec cat {} \\;', cwd)).not.toBeNull();
    expect(
      findSensitiveTargetInCommand('find . -name id_rsa -exec head -n 1 {} +', cwd),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand('find . -name .env -execdir rg TOKEN {} +', cwd),
    ).not.toBeNull();
  });

  test('blocks find exec readers with literal sensitive operands', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('find . -exec cat .env \\;', cwd)).not.toBeNull();
  });

  test('allows find exec readers over non-sensitive matched paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('find . -name README.md -exec cat {} \\;', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('find . -type f -exec cat {} +', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('find . -name .env -exec echo {} \\;', cwd)).toBeNull();
  });

  test('blocks interpreters reading sensitive paths from inline code', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitiveTargetInCommand(`python3 -c "print(open('.env').read())"`, cwd),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(
        `node -e "console.log(require('fs').readFileSync('.env','utf8'))"`,
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(
        `node -e "console.log(require('fs').readFileSync('private.pem'))"`,
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(`node -e 'require("fs").readFileSync(\`.env\`)'`, cwd),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(`node -e 'require("child_process").execSync("cat .env")'`, cwd),
    ).not.toBeNull();
    expect(findSensitiveTargetInCommand(`ruby -e 'puts File.read(".env")'`, cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand(`python3.11 -c "open('.env')"`, cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('bash -c "cat .env"', cwd)).not.toBeNull();
    // script-file positionals are still checked
    expect(findSensitiveTargetInCommand('python3 ~/.ssh/id_rsa', cwd)).not.toBeNull();
  });

  test('allows inert Node and Bun inline diagnostic data only in standard mode', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const diagnostic = `bun -e 'import { findSensitiveTargetInCommand } from "./src/guards/secret-protection.ts"; const cases = ["cat .env", "cat .env.example", "test -f .env", "find . -name .env", "find . -name .env -exec cat {} ;", "python3 -c \\"open(\\\\\\".env\\\\\\").read()\\"", "echo .env", "echo .env | xargs cat"]; for (const command of cases) console.log(JSON.stringify({ command, standard: findSensitiveTargetInCommand(command, process.cwd(), undefined, { strict: false }), strict: findSensitiveTargetInCommand(command, process.cwd(), undefined, { strict: true }) }))'`;

    for (const command of [
      diagnostic,
      `node -e 'const path = ".env"; console.log(path)'`,
      `bun -e 'const paths = [".env"]; for (const path of paths) console.log(path)'`,
      `node -e 'console.log("Bun.file(\\".env\\")")'`,
      "node -e 'console.log(`.env`)'",
    ]) {
      expectAllowedOnlyInStandardMode(command, cwd);
    }
  });

  test('keeps recognizable Node and Bun inline sensitive access blocked in standard mode', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      `node -e 'const path = ".env"; require("fs").readFileSync(path, "utf8")'`,
      `bun -e 'const path = ".env"; Bun.file(path).text()'`,
      `node -e 'const command = "cat .env"; require("node:child_process").execSync(command)'`,
      `bun -e 'const path = ".env"; const read = Bun.file; read(path)'`,
      `node -e 'const command = "cat .env"; eval(command)'`,
      `node -e 'const path = ".env"; console.log(path); require("fs").readFileSync("README.md")'`,
      'bun -e \'console.log(`${Bun.file(".env")}`)\'',
      "bun -e 'console.log(String.raw`.env`)'",
    ]) {
      expect(
        findSensitiveTargetInCommand(command, cwd, undefined, { strict: false }),
        command,
      ).not.toBeNull();
    }
  });

  test('keeps configured deny paths protected in inert Node inline data', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitiveTargetInCommand(
        `node -e 'console.log("protected.txt")'`,
        cwd,
        { denyPaths: ['protected.txt'] },
        { strict: false },
      ),
    ).toMatchObject({ ruleId: 'secret.deny-path' });
  });

  test('blocks clustered shell eval flags reading sensitive paths from inline code', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      'bash -c "cat .env"',
      'bash -lc "cat .env"',
      'zsh -fc "cat .env"',
      `python3 -vc "open('.env')"`,
      `node -pe "require('fs').readFileSync('.env')"`,
      `perl -wE "open('.env')"`,
      `php -nr "file_get_contents('.env')"`,
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd)?.target, command).toBe('.env');
    }
    expect(findSensitiveTargetInCommand('zsh -fl "cat .env"', cwd)).toBeNull();
  });

  test('blocks base64-decoded sensitive paths from inline interpreter literals', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitiveTargetInCommand(
        `python3 -c "import base64, os; b = base64.b64decode('LmVudg==').decode(); p = os.path.expanduser('~/Developer/420024-lab/test-cc/') + b; print(open(p).read())"`,
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(
        `node -e "const p = Buffer.from('fi8uc3NoL2lkX3JzYQ==', 'base64').toString(); require('fs').readFileSync(p, 'utf8')"`,
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(
        `ruby -e "require 'base64'; path = Base64.decode64('c2VjcmV0cy9wcm9kLmtleQ'); puts File.read(path)"`,
        cwd,
      ),
    ).not.toBeNull();
  });

  test('does not flag interpreters running benign code', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('python3 build.py', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand(`python3 -c "print('hello')"`, cwd)).toBeNull();
    expect(findSensitiveTargetInCommand(`node -e "console.log(1 + 1)"`, cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('bash -c "ls src"', cwd)).toBeNull();
    expect(
      findSensitiveTargetInCommand(
        `python3 -c "import base64; print(base64.b64decode('UkVBRE1FLm1k').decode())"`,
        cwd,
      ),
    ).toBeNull();
  });

  test('allows runtime metadata probes whose property names resemble sensitive extensions', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitiveTargetInCommand(
        `/opt/homebrew/bin/node -e 'const { DatabaseSync } = require("node:sqlite"); const database = new DatabaseSync(":memory:"); database.exec("CREATE VIRTUAL TABLE probe USING fts5(value)"); console.log(JSON.stringify({ node: process.versions.node, sqlite: process.versions.sqlite, limits: typeof database.limits })); database.close()'
for runtime in /Users/kenryu/.nvm/versions/node/v26.0.0/bin/node /Users/kenryu/.nvm/versions/node/v26.3.0/bin/node; do "$runtime" -e 'console.log(JSON.stringify({ node: process.versions.node, sqlite: process.versions.sqlite }))'; done`,
        cwd,
      ),
    ).toBeNull();
  });

  test('blocks awk system calls reading sensitive paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      `awk 'BEGIN{system("cat ~/.ssh/id_rsa")}'`,
      `gawk 'BEGIN { system("cat ~/.ssh/id_rsa") }'`,
      `nawk 'BEGIN { system("cat ~/.ssh/id_rsa") }'`,
      `mawk 'BEGIN { system("cat ~/.ssh/id_rsa") }'`,
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).not.toBeNull();
    }
  });

  test('blocks awk getline redirects reading sensitive paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitiveTargetInCommand(`awk 'BEGIN { getline < "~/.ssh/id_rsa" }'`, cwd),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(
        `gawk 'BEGIN { while ((getline line < ".env") > 0) print line }'`,
        cwd,
      ),
    ).not.toBeNull();
  });

  test('allows benign awk programs and non-sensitive reads', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand(`awk '/TODO/ { print }' README.md`, cwd)).toBeNull();
    expect(findSensitiveTargetInCommand(`awk 'BEGIN { system("cat README.md") }'`, cwd)).toBeNull();
    expect(findSensitiveTargetInCommand(`awk 'BEGIN { getline < "README.md" }'`, cwd)).toBeNull();
  });

  test('blocks variable indirection by capturing assignment values', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitiveTargetInCommand(`f=.env; python3 -c "print(open('$f').read())"`, cwd),
    ).not.toBeNull();
    expect(findSensitiveTargetInCommand('f=.env; cat $f', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('f=.env && cat "$f"', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('d=~/.ssh; cat $d/id_rsa', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('k=id_rsa; xxd $k', cwd)).not.toBeNull();
  });

  test('blocks base64-decoded sensitive paths in command substitutions', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitiveTargetInCommand('cat `echo fi8uc3NoL2lkX3JzYQ== | base64 -d`', cwd),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(
        `b64=$(echo LmVudg== | base64 -d); python3 -c "print(open('$b64').read())"`,
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(
        'key=$(printf %s fi8uc3NoL2lkX3JzYQ== | base64 --decode); cat "$key"',
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(
        'file=$(printf %s c2VjcmV0cy9wcm9kLmtleQ | base64 -d); cat "$file"',
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInCommand(
        'npmrc=$(base64 --decode <<< Lm5wbXJj); python3 -c "open(\'$npmrc\')"',
        cwd,
      ),
    ).not.toBeNull();
  });

  test('blocks legacy backtick substitutions that read sensitive operands', () => {
    const home = join(tmpdir(), 'secret-protection-backtick-home');
    const cwd = join(home, 'project');

    withEnv({ HOME: home }, () => {
      expect(findSensitiveTargetInCommand('echo `cat .env`', cwd)).not.toBeNull();
      expect(findSensitiveTargetInCommand('printf %s `cat $HOME/.ssh/id_rsa`', cwd)).not.toBeNull();
      expect(findSensitiveTargetInCommand('echo `cat README.md`', cwd)).toBeNull();
    });
  });

  test('blocks echo and printf path carriers into xargs readers', () => {
    const home = join(tmpdir(), 'secret-protection-home');
    const cwd = join(home, 'project');

    withEnv({ HOME: home }, () => {
      expect(
        findSensitiveTargetInCommand(`echo ${join(home, '.ssh', 'id_rsa')} | xargs cat`, cwd),
      ).not.toBeNull();
      expect(
        findSensitiveTargetInCommand(`printf %s ${join(home, '.ssh', 'id_rsa')} | xargs cat`, cwd),
      ).not.toBeNull();
    });
  });

  test('blocks display-fed stdin interpreter scripts reading sensitive paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      "printf 'cat .env' | bash",
      "printf 'cat .env' | bash -O extglob",
      `printf "print(open('.env').read())" | python3`,
      `printf "print(open('.env').read())" | python3 -W ignore`,
      `echo "require('fs').readFileSync('.env','utf8')" | node`,
      `echo "require('fs').readFileSync('.env','utf8')" | node --require fs`,
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).not.toBeNull();
    }

    expect(
      findSensitiveTargetInCommand(`printf "print(open('.env').read())" | python3 -m module`, cwd),
    ).toBeNull();
  });

  test('allows benign display-fed stdin interpreter scripts', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand("printf 'cat README.md' | bash", cwd)).toBeNull();
    expect(findSensitiveTargetInCommand("printf 'console.log(1)' | node", cwd)).toBeNull();
  });

  test('does not decode base64-looking text outside decoder substitutions', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('echo LmVudg==', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('note=LmVudg==; echo "$note"', cwd)).toBeNull();
    expect(
      findSensitiveTargetInCommand('file=$(printf %s UkVBRE1FLm1k | base64 -d); cat "$file"', cwd),
    ).toBeNull();
  });

  test('does not flag assignments of benign values', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('VAR=value', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('msg=hello; echo $msg', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('f=README.md; cat $f', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('DEBUG=1 node app.js', cwd)).toBeNull();
  });

  test('does not treat grep/rg search patterns as file targets', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('grep credentials README.md', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('rg id_rsa docs/', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('grep -i password config.yml', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('rg "API_KEY" src/', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('rg id_rsa', cwd)).toBeNull();
  });

  test('still blocks sensitive file operands after a grep/rg pattern', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('grep TOKEN .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('rg pattern ~/.ssh', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('grep -r foo id_rsa', cwd)).not.toBeNull();
  });

  test('blocks grep/rg pattern files read via -f/--file', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('grep -f .env README.md', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('rg -f ~/.ssh/id_rsa src', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('grep --file .env README.md', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('rg --file=.env src', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('grep -f.env README.md', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('grep -rf .env README.md', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('rg -if .env src', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('grep -nf .env README.md', cwd)).not.toBeNull();
  });

  test('treats positionals as files when the pattern comes from an option', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('grep -e TOKEN .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('grep --regexp TOKEN .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('grep --file patterns .env', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('rg -f pat .env src', cwd)).not.toBeNull();
    // getopt permutation: secretfile before -e is still a file read
    expect(findSensitiveTargetInCommand('grep .env -e foo', cwd)).not.toBeNull();
  });

  test('does not flag benign searches when the pattern comes from an option', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('grep -e TOKEN README.md', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('grep --regexp TOKEN config.yml', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('rg -e TODO src/', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('grep README.md -e foo', cwd)).toBeNull();
  });

  test('blocks rg --files targeting built-in sensitive paths (patternless mode)', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('rg --files ~/.ssh', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('rg --files ~/.aws', cwd)).not.toBeNull();
    expect(findSensitiveTargetInCommand('rg -i --files ~/.ssh', cwd)).not.toBeNull();
    // non-sensitive path enumeration stays allowed
    expect(findSensitiveTargetInCommand('rg --files src', cwd)).toBeNull();
  });

  test('does not flag patterns supplied via arg-consuming options', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitiveTargetInCommand('grep -A 2 credentials README.md', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('rg -C 3 id_rsa src/', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('grep -e credentials README.md', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('rg -m 5 credentials .', cwd)).toBeNull();
    expect(
      findSensitiveTargetInCommand('grep --after-context=2 credentials README.md', cwd),
    ).toBeNull();
  });
});

describe('treats quoted heredoc bodies as literal data', () => {
  // Commands below are analyzer input strings only; they are never executed in a shell.
  const cwd = join(tmpdir(), 'secret-protection-project');

  test('does not block sensitive filenames mentioned in quoted heredoc prose', () => {
    for (const command of [
      "cat <<'EOF'\nthe report mentions `cat .env` in prose\nEOF",
      "cat <<'EOF'\ntry cat .env later\nEOF",
      `git commit -m "$(cat <<'EOF'\nsee \`cat .env\` here\nEOF\n)"`,
      "cat <<E'O'F\ncat .env\nEOF",
      "cat <<'EOF'\nit's about cat .env\nEOF",
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).toBeNull();
    }
  });

  test('does not block sensitive filenames in a message sink body', () => {
    // A commit message or a PR body is stored or published, never resolved as a path,
    // so prose naming a credential file is inert. git apply is excluded on purpose:
    // its body names the files the patch writes.
    for (const command of [
      "git commit -q -F - <<'EOF'\nthe files carry credentials inline\nEOF",
      "git commit -F - <<'EOF'\nsee ~/.aws/credentials for the shape\nEOF",
      "gh pr create --body-file - <<'EOF'\nthis renames .env handling\nEOF",
      "gh issue create --body-file - <<'EOF'\nreading .env fails here\nEOF",
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).toBeNull();
      expect(
        findSensitiveTargetInCommand(command, cwd, undefined, { strict: true }),
        command,
      ).toBeNull();
    }
  });

  test('applies heredoc body masking in strict mode too', () => {
    expect(
      findSensitiveTargetInCommand(
        "cat <<'EOF'\nthe report mentions `cat .env` in prose\nEOF",
        cwd,
        undefined,
        { strict: true },
      ),
    ).toBeNull();
  });

  test('keeps scanning quoted bodies fed to executing or applying consumers', () => {
    for (const command of [
      "bash <<'EOF'\ncat .env\nEOF",
      "sh <<'EOF'\ncat .env\nEOF",
      "python3 <<'EOF'\nopen('.env')\nEOF",
      "git apply <<'EOF'\n--- a/.env\n+++ b/.env\nEOF",
      "cat <<'EOF' | bash\ncat .env\nEOF",
      "cat <<'EOF' > >(bash)\ncat .env\nEOF",
      "tee >(bash) <<'EOF'\ncat .env\nEOF",
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).not.toBeNull();
      expect(
        findSensitiveTargetInCommand(command, cwd, undefined, { strict: true }),
        command,
      ).not.toBeNull();
    }
  });

  test('stops matching deny paths named only in quoted heredoc prose', () => {
    const config = { disabledRules: new Set<string>(), denyPaths: ['secret-notes.txt'] };

    expect(
      findSensitiveTargetInCommand("cat <<'EOF'\nsee secret-notes.txt here\nEOF", cwd, config),
    ).toBeNull();
    expect(findSensitiveTargetInCommand('cat secret-notes.txt', cwd, config)?.ruleId).toBe(
      'secret.deny-path',
    );
  });

  test('still blocks substitutions expanded by unquoted heredoc bodies', () => {
    for (const command of ['cat <<EOF\n$(cat .env)\nEOF', 'cat <<EOF\n`cat .env`\nEOF']) {
      expect(findSensitiveTargetInCommand(command, cwd), command).not.toBeNull();
    }
  });

  test('still blocks real substitutions outside any heredoc', () => {
    expect(findSensitiveTargetInCommand('echo $(cat .env)', cwd)).not.toBeNull();
  });

  test('still blocks a quoted heredoc writing to a sensitive redirection target', () => {
    expect(findSensitiveTargetInCommand("cat <<'EOF' > .env\nbody\nEOF", cwd)?.ruleId).toBe(
      'secret.basename.env',
    );
  });

  test('does not choke on a JavaScript template literal carried in a heredoc body', () => {
    expect(
      findSensitiveTargetInCommand(
        'python3 - <<\'PY\'\ncode = """const dir = `${name}-${Date.now()}`;"""\nprint(code)\nPY',
        cwd,
      ),
    ).toBeNull();
    expect(findSensitiveTargetInCommand('node -e "console.log(`v${Date.now()}`)"', cwd)).toBeNull();
  });

  test('blocks active assignment fallbacks without failing closed on inert or benign text', () => {
    for (const strict of [false, true]) {
      for (const command of [
        'cat "${X:=.env}"',
        'cat "${X=.env}"',
        'cat ${X:=".env"}',
        'cat ${X:=.e"nv"}',
      ]) {
        expect(
          findSensitiveTargetInCommand(command, cwd, undefined, { strict })?.ruleId,
          command,
        ).toBe('secret.basename.env');
      }
    }

    expect(findSensitiveTargetInCommand("cat '${X:=.env}'", cwd)).toBeNull();
    expect(findSensitiveTargetInCommand('cat "${X:=README.md}"', cwd)).toBeNull();
    expect(findSensitiveTargetInCommand("echo '${X:=1}'", cwd)).toBeNull();
  });

  test('does not fail closed on a heredoc body the shell parser cannot project', () => {
    expect(
      findSensitiveTargetInCommand("python3 - <<'PY'\nvalue = ${incomplete\nprint(value)\nPY", cwd),
    ).toBeNull();
    // Nested template literals pair backticks lexically into a substitution body holding an
    // unclosed `${`.
    expect(
      findSensitiveTargetInCommand(
        'python3 - <<\'PY\'\ncode = """`${a ? `x${b}` : \'\'}`"""\nprint(code)\nPY',
        cwd,
      ),
    ).toBeNull();
    // Body lines before the unclosed expansion still execute under bash, so they stay scanned.
    expect(findSensitiveTargetInCommand("bash <<'EOF'\ncat .env\nx=${q\nEOF", cwd)).not.toBeNull();
  });

  test('still blocks a sensitive path beside an expansion holding a parenthesis', () => {
    expect(findSensitiveTargetInCommand('cat ${x:-$(true)} .env', cwd)?.ruleId).toBe(
      'secret.basename.env',
    );
    expect(findSensitiveTargetInCommand('echo "$(cat .env ${x:-$(true)})"', cwd)?.ruleId).toBe(
      'secret.basename.env',
    );
  });

  test('does not mask on delimiter or termination uncertainty', () => {
    for (const command of ['cat <<$(printf EOF)\ncat .env\nEOF', "cat <<'EOF'\ncat .env"]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).not.toBeNull();
    }
  });
});

describe('secret protection generic tool input extraction', () => {
  test('blocks sensitive patch targets identically across every patch text field', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const envFile = ['.', 'env'].join('');
    for (const testCase of [
      { target: envFile },
      { target: '~/.ssh/id_rsa' },
      {
        target: 'configured/private.txt',
        config: { disabledRules: new Set<string>(), denyPaths: ['configured/private.txt'] },
      },
    ]) {
      const patch = [
        '*** Begin Patch',
        `*** Update File: ${testCase.target}`,
        '*** End Patch',
      ].join('\n');

      for (const field of ['command', 'patch', 'diff', 'input', 'patchText']) {
        expect(
          findSensitiveTargetWithRoute({ [field]: patch }, { kind: 'patch' }, cwd, testCase.config),
          `${testCase.target}:${field}`,
        ).not.toBeNull();
      }
    }
  });

  test('blocks sensitive targets in binary git diffs without a/ and b/ prefixes', () => {
    expect(
      findSensitiveTargetWithRoute(
        { diff: 'diff --git .env .env\nGIT binary patch' },
        { kind: 'patch' },
        process.cwd(),
      )?.ruleId,
    ).toBe('secret.basename.env');
  });

  test('preserves real a/ paths in binary Git diffs generated with --no-prefix', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitiveTargetWithRoute(
        { diff: 'diff --git a/private.dat a/private.dat\nGIT binary patch' },
        { kind: 'patch' },
        cwd,
        { disabledRules: new Set(), denyPaths: ['a/private.dat'] },
      )?.ruleId,
    ).toBe('secret.deny-path');
  });

  test('blocks quoted Git rename targets configured as deny paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const patch = [
      'diff --git a/old.txt b/private secret.txt',
      'similarity index 100%',
      'rename from old.txt',
      'rename to "private secret.txt"',
    ].join('\n');

    expect(
      findSensitiveTargetWithRoute({ patch }, { kind: 'patch' }, cwd, {
        disabledRules: new Set(),
        denyPaths: ['private secret.txt'],
      })?.ruleId,
    ).toBe('secret.deny-path');
  });

  test('keeps SSH keys and configured deny paths protected through schema routes', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const blockedPath = join(cwd, 'blocked.txt');

    expect(
      findSensitiveTargetWithRoute(
        { file_path: '~/.ssh/id_rsa', content: '' },
        { kind: 'path' },
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetWithRoute({ path: blockedPath }, { kind: 'unknown' }, cwd, {
        disabledRules: new Set(),
        denyPaths: [blockedPath],
      })?.ruleId,
    ).toBe('secret.deny-path');
  });

  test('treats patch hunks and known non-command content fields as inert', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const envFile = ['.', 'env'].join('');
    const patch = [
      '*** Begin Patch',
      '*** Update File: README.md',
      '@@ -1 +1 @@',
      '-safe',
      '+rm -rf ~',
      '+Remove-Item -Recurse -Force C:\\',
      '+cat "unterminated',
      `+*** Update File: ${envFile}`,
      '+~/.ssh/id_rsa',
      '*** End Patch',
    ].join('\n');

    expect(findSensitiveTargetWithRoute({ command: patch }, { kind: 'patch' }, cwd)).toBeNull();
    expect(
      findSensitiveTargetWithRoute(
        { file_path: 'README.md', command: `cat ${envFile}`, new_string: envFile },
        { kind: 'path' },
        cwd,
      ),
    ).toBeNull();
    expect(
      findSensitiveTargetWithRoute({ path: 'src', pattern: envFile }, { kind: 'grep' }, cwd),
    ).toBeNull();
  });

  test('retains conservative command and path inspection for unknown routes', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const envFile = ['.', 'env'].join('');

    expect(
      findSensitiveTargetWithRoute(
        { command: ['cat', envFile].join(' ') },
        { kind: 'unknown' },
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetWithRoute({ path: envFile }, { kind: 'unknown' }, cwd),
    ).not.toBeNull();
  });

  test('resolves command and tool targets from the execution cwd', () => {
    const configCwd = mkdtempSync(join(tmpdir(), 'secret-protection-project-'));
    const executionCwd = join(configCwd, 'nested');
    mkdirSync(executionCwd);
    const blockedPath = join(configCwd, 'blocked');
    mkdirSync(blockedPath);
    symlinkSync(blockedPath, join(executionCwd, 'blocked-alias'));
    const config = { disabledRules: new Set<string>(), denyPaths: [blockedPath] };

    expect(
      findSensitiveTargetWithRoute(
        { path: 'blocked-alias/missing/child.txt' },
        { kind: 'path' },
        executionCwd,
        config,
      )?.ruleId,
    ).toBe('secret.deny-path');
    expect(
      findSensitiveTargetWithRoute(
        { command: 'cat blocked-alias/missing/child.txt' },
        { kind: 'command', shell: 'posix' },
        executionCwd,
        config,
      )?.ruleId,
    ).toBe('secret.deny-path');
    rmSync(configCwd, { recursive: true, force: true });
  });

  test('resolves relative configured deny paths from the config cwd', () => {
    const configCwd = mkdtempSync(join(tmpdir(), 'secret-protection-config-cwd-'));
    const executionCwd = join(configCwd, 'nested');
    mkdirSync(executionCwd);
    try {
      expect(
        findSensitiveTargetWithRoute(
          { path: join(configCwd, 'private/token.txt') },
          { kind: 'path' },
          executionCwd,
          { disabledRules: new Set(), denyPaths: ['private'] },
          configCwd,
        )?.ruleId,
      ).toBe('secret.deny-path');
    } finally {
      rmSync(configCwd, { recursive: true, force: true });
    }
  });

  test('blocks sensitive read and edit targets without scanning edit content', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const envFile = ['.', 'env'].join('');
    const keyName = ['id', 'rsa'].join('_');

    expect(findSensitiveTargetInToolInput('Read', { file_path: envFile }, cwd)).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput('Write', { path: envFile, content: '' }, cwd),
    ).not.toBeNull();
    expect(findSensitiveTargetInToolInput('Edit', { file_path: envFile }, cwd)).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput(
        'Edit',
        {
          file_path: 'tests/core/secret-protection.test.ts',
          old_string: keyName,
          new_string: envFile,
        },
        cwd,
      ),
    ).toBeNull();
  });

  test('treats search patterns and patch hunks as text, not file targets', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const envFile = ['.', 'env'].join('');
    const keyName = ['id', 'rsa'].join('_');

    expect(
      findSensitiveTargetInToolInput('Grep', { pattern: envFile, path: 'src' }, cwd),
    ).toBeNull();
    expect(findSensitiveTargetInToolInput('Glob', { pattern: envFile }, cwd)).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput('Glob', { path: '~/.ssh', pattern: '*' }, cwd),
    ).not.toBeNull();
    expect(findSensitiveTargetInToolInput('Glob', { path: 'src', pattern: '*' }, cwd)).toBeNull();
    expect(
      findSensitiveTargetInToolInput(
        'apply_patch',
        {
          patch: [
            '*** Begin Patch',
            '*** Update File: tests/core/secret-protection.test.ts',
            '@@',
            `+const sample = "${envFile} ${keyName}"`,
            `--- a/${envFile}`,
            `+++ b/${envFile}`,
            '*** End Patch',
          ].join('\n'),
        },
        cwd,
      ),
    ).toBeNull();
    expect(
      findSensitiveTargetInToolInput(
        'apply_patch',
        {
          patch: [
            '*** Begin Patch',
            `*** Update File: ${envFile}`,
            '@@',
            '+safe',
            '*** End Patch',
          ].join('\n'),
        },
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput(
        'patch',
        {
          patch: [
            '--- src/safe.txt',
            '+++ src/safe.txt',
            '@@ -1 +1 @@',
            `--- ${envFile}`,
            `+++ ${envFile}`,
          ].join('\n'),
        },
        cwd,
      ),
    ).toBeNull();
    expect(
      findSensitiveTargetInToolInput(
        'apply_patch',
        {
          patch: [
            '--- src/safe.txt',
            '+++ src/safe.txt',
            '@@ -1 +1 @@',
            '-safe',
            '+safe',
            '--- /dev/null',
            `+++ ${envFile}`,
            '@@ -0,0 +1 @@',
            '+TOKEN=secret',
          ].join('\n'),
        },
        cwd,
      ),
    ).not.toBeNull();
  });

  test('extracts commands and path-like values from nested tool input', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const envFile = ['.', 'env'].join('');
    const npmrcFile = ['.', 'npmrc'].join('');

    expect(
      findSensitiveTargetInToolInput('Bash', { command: ['cat', envFile].join(' ') }, cwd),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput('Read', { nested: [{ file_path: envFile }] }, cwd),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput('Glob', { nested: [{ pattern: envFile }] }, cwd),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput('Glob', { nested: [{ glob: npmrcFile }] }, cwd),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput('unknown', { nested: [{ pattern: envFile }] }, cwd),
    ).toBeNull();
    expect(
      findSensitiveTargetInToolInput('unknown', { nested: [{ glob: npmrcFile }] }, cwd),
    ).toBeNull();
    expect(
      findSensitiveTargetInToolInput('Read', { nested: { path: 'README.md' } }, cwd),
    ).toBeNull();
  });

  test('blocks command and path targets for unknown command-style tools', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const envFile = ['.', 'env'].join('');

    expect(
      findSensitiveTargetInToolInput(
        'execute_command',
        { command: ['cat', envFile].join(' ') },
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput(
        'mcp__shell__run',
        { command: ['cat', envFile].join(' ') },
        cwd,
      ),
    ).not.toBeNull();
    expect(
      findSensitiveTargetInToolInput('unknown', { command: 'true', path: envFile }, cwd),
    ).not.toBeNull();
  });

  test('ignores non-object tool input and non-string commands', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const envFile = ['.', 'env'].join('');

    expect(findSensitiveTargetInToolInput('Read', null, cwd)).toBeNull();
    expect(findSensitiveTargetInToolInput('Bash', ['cat', envFile].join(' '), cwd)).toBeNull();
    expect(getCommandFromToolInput(null)).toBeUndefined();
    expect(getCommandFromToolInput({ command: '' })).toBeUndefined();
    expect(getCommandFromToolInput({ command: 1 })).toBeUndefined();
  });
});

describe('secret protection case-insensitive matching', () => {
  test('flags uppercased and mixed-case sensitive paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      '.ENV',
      '.Env.Local',
      '/app/.ENV.STAGING',
      '~/.AWS',
      '/home/user/.AWS/CREDENTIALS',
      '/home/user/.SSH/ID_RSA',
      '/tmp/ID_RSA.BAK',
      '~/.NPMRC',
      '~/.NETRC',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
    expect(
      findSensitivePathTarget(['project/Protected/child.txt'], cwd, {
        disabledRules: new Set(),
        denyPaths: ['project/protected'],
      }),
    ).not.toBeNull();
  });

  test('keeps env exemptions case-insensitive', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of ['.ENV.EXAMPLE', '/app/.ENV.SAMPLE', '.ENV.TEMPLATE']) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });
});

describe('secret protection distinctive basenames anywhere', () => {
  test('blocks absolute paths to keys and credentials regardless of directory', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      '/home/user/.ssh/id_rsa',
      '/home/user/.ssh/id_ed25519',
      '/home/user/.aws/credentials',
      '/root/.ssh/id_rsa',
      '/etc/ssh/id_ecdsa',
      '/home/u/.ssh/id_rsa.copy',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('blocks DSA private key backup variants without blocking public keys', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of ['id_dsa.bak', 'id_dsa-old', 'id_dsa_old', '/tmp/id_dsa.backup']) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }

    expect(findSensitivePathTarget(['id_dsa.pub'], cwd)).toBeNull();
  });
});

describe('secret protection home-anchored credential locations', () => {
  test('blocks ~/.ssh, ~/.aws and sibling config files under ~', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      '~/.ssh',
      '~/.ssh/config',
      '~/.ssh/known_hosts',
      '~/.aws',
      '~/.aws/config',
      '~/.gcp',
      '~/.config/gcloud',
      '~/.config/gcloud/application_default_credentials.json',
      '~/.kube/config',
      '~/.docker/config.json',
      '~/.config/gh/hosts.yml',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('blocks home Kubernetes and Docker config backup files', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      '~/.kube/config.bak',
      '~/.kube/config.backup',
      '~/.kube/config.old',
      '~/.docker/config.json.bak',
      '~/.docker/config.json.backup',
      '~/.docker/config.json.old',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('blocks absolute current-home credential paths', () => {
    const home = join(tmpdir(), 'secret-protection-home');
    const cwd = join(home, 'project');

    withEnv({ HOME: home }, () => {
      for (const target of [
        join(home, '.ssh', 'config'),
        join(home, '.ssh', 'known_hosts'),
        join(home, '.kube', 'config'),
        join(home, '.docker', 'config.json'),
        join(home, '.config', 'gh', 'hosts.yml'),
      ]) {
        expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
      }
    });
  });

  test('blocks repeated slash home credential paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of ['~//.ssh/config', '~//.kube/config']) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('does not block home-only config paths outside ~ (avoids repo false positives)', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      '/home/user/.aws/config',
      '/home/user/.kube/config',
      '/home/user/.docker/config.json',
      '/home/user/.config/gh/hosts.yml',
      '/home/user/.config/gcloud',
      '/home/user/.config/gcloud/application_default_credentials.json',
      'tests/fixtures/.ssh/config',
      '.aws/README.md',
      'infra/.kube/config',
      'infra/.kube/config.bak',
      'docs/.docker/config.json',
      'docs/.docker/config.json.old',
      'deploy/.config/gh/hosts.yml',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });
});

describe('secret protection coding CLI credential locations', () => {
  const defaultCodingCliEnv = {
    CLAUDE_CONFIG_DIR: '',
    CODEX_HOME: '',
    GEMINI_CLI_HOME: '',
    COPILOT_HOME: '',
    KIMI_CODE_HOME: '',
    KIMI_SHARE_DIR: '',
    XDG_DATA_HOME: '',
    XDG_CONFIG_HOME: '',
    OPENCODE_CONFIG_DIR: '',
    OPENCODE_CONFIG: '',
    OPENCODE_DB: '',
    PI_CODING_AGENT_DIR: '',
    CURSOR_DATA_DIR: '',
    AMP_SETTINGS_FILE: '',
    GEMINI_CLI_SYSTEM_SETTINGS_PATH: '',
  };

  test('blocks every path the coding CLI rule metadata advertises', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const rule of SECRET_CODING_CLI_RULES) {
        for (const path of rule.paths) {
          const target = path.replace('<project>', cwd);
          expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe(rule.id);
        }
      }
    });
  });

  test('blocks default supported coding CLI credential paths under home', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const target of [
        '~/.claude/settings.json',
        '~/.claude/settings.local.json',
        '~/.claude/.credentials.json',
        '~/.claude.json',
        '~/.gemini/config/hooks.json',
        '~/.codex/config.toml',
        '~/.codex/auth.json',
        '~/.codex/.credentials.json',
        '~/.gemini/oauth_creds.json',
        '~/.gemini/mcp-oauth-tokens.json',
        '~/.gemini/a2a-oauth-tokens.json',
        '~/.gemini/google_accounts.json',
        '~/.gemini/settings.json',
        '~/.gemini/gemini-credentials.json',
        '~/.copilot/config.json',
        '~/.copilot/mcp-oauth-config/server.json',
        '~/.kimi-code/config.toml',
        '~/.kimi-code/mcp.json',
        '~/.kimi-code/server.token',
        '~/.kimi-code/credentials/kimi-code.json',
        '~/.kimi-code/credentials/mcp/context7.json',
        '~/.kimi/config.toml',
        '~/.kimi/mcp.json',
        '~/.kimi/credentials/kimi-code.json',
        '~/.kimi/mcp-oauth/context7.json',
        '~/.local/share/opencode/auth.json',
        '~/.local/share/opencode/mcp-auth.json',
        '~/.config/opencode/opencode.json',
        '~/.config/opencode/opencode.jsonc',
        '~/.pi/agent/auth.json',
      ]) {
        expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
      }
    });
  });

  test('blocks coding CLI secret directories and the legacy Kimi JSON config', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const [target, ruleId] of [
        ['~/.codex/secrets/codex_auth.age', 'secret.cli.codex'],
        ['~/.codex/.sandbox-secrets/sandbox_users.json', 'secret.cli.codex'],
        ['~/.copilot/mcp-secrets/server.json', 'secret.cli.copilot-cli'],
        ['~/.kimi/config.json', 'secret.cli.kimi-code.config'],
        ['~/.kimi/config.json.bak', 'secret.cli.kimi-code.config'],
      ] as const) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe(ruleId);
      }
    });
  });

  test('blocks Amp Code credential stores', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const target of ['~/.local/share/amp/secrets.json', '~/.amp/oauth/server.json']) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe('secret.cli.amp');
      }
    });
  });

  test('blocks Cursor credential stores', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const target of [
        '~/.cursor/auth.json',
        '~/.config/cursor/auth.json',
        '~/.cursor/projects/my-repo/mcp-auth.json',
      ]) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe('secret.cli.cursor');
      }
    });
  });

  test('blocks Amp Code user settings under both config roots', () => {
    const home = join(tmpdir(), 'secret-protection-amp-home');
    const cwd = join(home, 'project');
    const xdgConfig = join(home, 'xdg-config');

    withEnv({ ...defaultCodingCliEnv, HOME: home }, () => {
      for (const target of ['~/.config/amp/settings.json', '~/.config/amp/settings.jsonc']) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe(
          'secret.cli.amp.config',
        );
      }
    });

    withEnv({ ...defaultCodingCliEnv, HOME: home, XDG_CONFIG_HOME: xdgConfig }, () => {
      for (const target of [
        join(xdgConfig, 'amp', 'settings.json'),
        join(home, '.config', 'amp', 'settings.jsonc'),
      ]) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe(
          'secret.cli.amp.config',
        );
      }
    });
  });

  test('blocks Amp Code workspace settings at any ancestor directory', () => {
    const root = join(tmpdir(), 'secret-protection-amp-workspace');
    const cwd = join(root, 'packages', 'app');

    withEnv(defaultCodingCliEnv, () => {
      for (const target of [
        join(cwd, '.amp', 'settings.json'),
        join(cwd, '.amp', 'settings.jsonc'),
        join(root, '.amp', 'settings.json'),
      ]) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe(
          'secret.cli.amp.config',
        );
      }
    });
  });

  test('blocks the AMP_SETTINGS_FILE path only when the variable has a value', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const settings = join(tmpdir(), 'secret-protection-amp-settings', 'amp.json');

    withEnv({ ...defaultCodingCliEnv, AMP_SETTINGS_FILE: settings }, () => {
      expect(findSensitivePathTarget([settings], cwd)?.ruleId).toBe('secret.cli.amp.config');
    });

    withEnv(defaultCodingCliEnv, () => {
      expect(findSensitivePathTarget([settings], cwd)).toBeNull();
    });
  });

  test('blocks Cursor MCP config in the user and project roots', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const target of [
        '~/.cursor/mcp.json',
        join(cwd, '.cursor', 'mcp.json'),
        join(cwd, 'nested', 'repo', '.cursor', 'mcp.json'),
      ]) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe(
          'secret.cli.cursor.config',
        );
      }
    });
  });

  test('blocks mixed config files for the remaining coding CLI products', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const [target, ruleId] of [
        ['~/.gemini/config/mcp_config.json', 'secret.cli.antigravity'],
        ['~/.copilot/mcp-config.json', 'secret.cli.copilot-cli.config'],
        ['~/.pi/agent/models.json', 'secret.cli.pi.config'],
        [join(cwd, '.kimi-code', 'mcp.json'), 'secret.cli.kimi-code.config'],
        ['~/.codex/work.config.toml', 'secret.cli.codex.config'],
        [join(cwd, 'opencode.json'), 'secret.cli.opencode.config'],
        [join(cwd, 'opencode.jsonc'), 'secret.cli.opencode.config'],
        // The basename alone decides, so a nested repository config blocks too.
        [join(cwd, 'nested', 'repo', 'opencode.json'), 'secret.cli.opencode.config'],
        [join(cwd, '.gemini', 'settings.json'), 'secret.cli.gemini.config'],
        ['/Library/Application Support/GeminiCli/settings.json', 'secret.cli.gemini.config'],
        ['/etc/gemini-cli/settings.json', 'secret.cli.gemini.config'],
      ] as const) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe(ruleId);
      }
    });
  });

  test('blocks Windows ProgramData Gemini CLI system settings when available', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const programData = join(tmpdir(), 'secret-protection-program-data');

    withEnv({ ...defaultCodingCliEnv, ProgramData: programData }, () => {
      expect(
        findSensitivePathTarget([join(programData, 'gemini-cli', 'settings.json')], cwd)?.ruleId,
      ).toBe('secret.cli.gemini.config');
    });
  });

  test('honors relocation overrides for the coding CLI config files', () => {
    const home = join(tmpdir(), 'secret-protection-cli-config-home');
    const cwd = join(home, 'project');
    const env = {
      ...defaultCodingCliEnv,
      HOME: home,
      CODEX_HOME: join(home, 'state', 'codex'),
      COPILOT_HOME: join(home, 'state', 'copilot'),
      KIMI_CODE_HOME: join(home, 'state', 'kimi-code'),
      PI_CODING_AGENT_DIR: join(home, 'state', 'pi-agent'),
      GEMINI_CLI_SYSTEM_SETTINGS_PATH: join(home, 'managed', 'gemini-settings.json'),
    };

    withEnv(env, () => {
      for (const [target, ruleId] of [
        [join(env.CODEX_HOME, 'work.config.toml'), 'secret.cli.codex.config'],
        [join(env.COPILOT_HOME, 'mcp-config.json'), 'secret.cli.copilot-cli.config'],
        // The renamed root proves the user-root match survives when the directory
        // name no longer matches the .kimi-code segment test.
        [join(env.KIMI_CODE_HOME, 'mcp.json'), 'secret.cli.kimi-code.config'],
        [join(env.PI_CODING_AGENT_DIR, 'models.json'), 'secret.cli.pi.config'],
        [env.GEMINI_CLI_SYSTEM_SETTINGS_PATH, 'secret.cli.gemini.config'],
      ] as const) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe(ruleId);
      }
    });
  });

  test('blocks the OpenCode credential database and its support files', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const target of [
        '~/.local/share/opencode/opencode.db',
        '~/.local/share/opencode/opencode.db-wal',
        '~/.local/share/opencode/opencode.db-shm',
        '~/.local/share/opencode/opencode-nightly.db',
        '~/.local/share/opencode/opencode-nightly.db-wal',
        '~/.local/share/opencode/opencode-nightly.db-shm',
      ]) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe('secret.cli.opencode');
      }
    });
  });

  test('blocks the OPENCODE_DB database path and its support files', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const database = join(tmpdir(), 'secret-protection-opencode-db', 'state.db');

    withEnv({ ...defaultCodingCliEnv, OPENCODE_DB: database }, () => {
      for (const target of [database, `${database}-wal`, `${database}-shm`]) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe('secret.cli.opencode');
      }
    });
  });

  test('ignores an in-memory OPENCODE_DB value', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv({ ...defaultCodingCliEnv, OPENCODE_DB: ':memory:' }, () => {
      for (const target of [':memory:', ':memory:-wal']) {
        expect(findSensitivePathTarget([target], cwd), target).toBeNull();
      }
    });
  });

  test('does not block siblings that only share a prefix with a secret directory', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const target of [
        '~/.codex/secrets-backup/note.txt',
        '~/.copilot/mcp-secrets-old/x.json',
        '~/.amp/threads/thread.json',
        '~/.amp/oauth-backup/x.json',
        '~/.config/amp/mcp.log',
        join(tmpdir(), 'secret-protection-project', '.amp', 'threads', 'x.json'),
        '~/.cursor/mcp.json.bak',
        '~/.cursor/projects/my-repo/state.json',
        '~/.cursor/rules/team.md',
        '~/.cursor/extensions/x/package.json',
        '~/.local/share/opencode/sessions/x.db',
        join(tmpdir(), 'secret-protection-project', '.gemini', 'config.yaml'),
        join(tmpdir(), 'secret-protection-project', 'opencode.log'),
      ]) {
        expect(findSensitivePathTarget([target], cwd), target).toBeNull();
      }
    });
  });

  test('blocks project-level Claude Code local settings and MCP configs anywhere on disk', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    withEnv(defaultCodingCliEnv, () => {
      for (const target of [
        '.claude/settings.local.json',
        '.mcp.json',
        'nested/repo/.claude/settings.local.json',
        '/opt/work/repo/.mcp.json',
      ]) {
        expect(findSensitivePathTarget([target], cwd)?.ruleId, target).toBe(
          'secret.cli.claude-code.config',
        );
      }
    });
  });

  test('blocks absolute current-home coding CLI credential paths', () => {
    const home = join(tmpdir(), 'secret-protection-cli-home');
    const cwd = join(home, 'project');

    withEnv({ ...defaultCodingCliEnv, HOME: home }, () => {
      for (const target of [
        join(home, '.codex', 'auth.json'),
        join(home, '.gemini', 'oauth_creds.json'),
        join(home, '.copilot', 'mcp-oauth-config', 'server.json'),
        join(home, '.kimi-code', 'credentials', 'kimi-code.json'),
        join(home, '.local', 'share', 'opencode', 'auth.json'),
        join(home, '.config', 'opencode', 'opencode.json'),
        join(home, '.pi', 'agent', 'auth.json'),
      ]) {
        expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
      }
    });
  });

  test('honors coding CLI relocation environment variables', () => {
    const home = join(tmpdir(), 'secret-protection-cli-relocated-home');
    const cwd = join(home, 'project');
    const env = {
      HOME: home,
      CLAUDE_CONFIG_DIR: join(home, 'state', 'claude'),
      CODEX_HOME: join(home, 'state', 'codex'),
      GEMINI_CLI_HOME: join(home, 'state', 'gemini-home'),
      COPILOT_HOME: join(home, 'state', 'copilot'),
      KIMI_CODE_HOME: join(home, 'state', 'kimi-code'),
      KIMI_SHARE_DIR: join(home, 'state', 'kimi-legacy'),
      XDG_DATA_HOME: join(home, 'xdg-data'),
      XDG_CONFIG_HOME: join(home, 'xdg-config'),
      OPENCODE_CONFIG_DIR: join(home, 'state', 'opencode-config'),
      OPENCODE_CONFIG: join(home, 'managed', 'opencode.jsonc'),
      PI_CODING_AGENT_DIR: join(home, 'state', 'pi-agent'),
      CURSOR_DATA_DIR: join(home, 'state', 'cursor'),
    };

    withEnv(env, () => {
      for (const target of [
        join(env.CLAUDE_CONFIG_DIR, 'settings.json'),
        join(env.CLAUDE_CONFIG_DIR, 'settings.local.json'),
        join(home, '.claude.json'),
        join(env.CODEX_HOME, 'auth.json'),
        join(env.CODEX_HOME, 'secrets', 'codex_auth.age'),
        join(env.CODEX_HOME, '.sandbox-secrets', 'sandbox_users.json'),
        join(env.GEMINI_CLI_HOME, '.gemini', 'oauth_creds.json'),
        join(env.COPILOT_HOME, 'config.json'),
        join(env.COPILOT_HOME, 'mcp-oauth-config', 'server.json'),
        join(env.COPILOT_HOME, 'mcp-secrets', 'server.json'),
        join(env.KIMI_SHARE_DIR, 'config.json'),
        join(env.KIMI_SHARE_DIR, 'config.json.bak'),
        join(env.KIMI_CODE_HOME, 'server.token'),
        join(env.KIMI_CODE_HOME, 'credentials', 'kimi-code.json'),
        join(env.KIMI_SHARE_DIR, 'mcp-oauth', 'context7.json'),
        join(env.XDG_DATA_HOME, 'opencode', 'mcp-auth.json'),
        join(env.XDG_DATA_HOME, 'opencode', 'opencode.db'),
        join(env.XDG_DATA_HOME, 'opencode', 'opencode.db-wal'),
        join(env.XDG_DATA_HOME, 'opencode', 'opencode.db-shm'),
        join(env.XDG_DATA_HOME, 'opencode', 'opencode-nightly.db'),
        join(env.XDG_DATA_HOME, 'amp', 'secrets.json'),
        join(home, '.local', 'share', 'amp', 'secrets.json'),
        join(home, '.amp', 'oauth', 'server.json'),
        join(env.OPENCODE_CONFIG_DIR, 'opencode.json'),
        env.OPENCODE_CONFIG,
        join(env.PI_CODING_AGENT_DIR, 'auth.json'),
        join(env.XDG_CONFIG_HOME, 'cursor', 'auth.json'),
        join(env.CURSOR_DATA_DIR, 'projects', 'my-repo', 'mcp-auth.json'),
      ]) {
        expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
      }
    });
  });

  test('blocks OpenCode managed config paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      '/Library/Application Support/opencode/opencode.json',
      '/Library/Application Support/opencode/opencode.jsonc',
      '/etc/opencode/opencode.json',
      '/etc/opencode/opencode.jsonc',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('blocks Windows ProgramData OpenCode managed config when available', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const programData = join(tmpdir(), 'secret-protection-program-data');

    withEnv({ ProgramData: programData }, () => {
      expect(
        findSensitivePathTarget([join(programData, 'opencode', 'opencode.json')], cwd),
      ).not.toBeNull();
    });
  });

  test('does not block generic coding CLI filenames outside scoped roots', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'auth.json',
      'config.toml',
      'settings.json',
      'mcp.json',
      '/tmp/auth.json',
      '/tmp/config.toml',
      '/tmp/settings.json',
      'settings.local.json',
      '.claude/settings.json',
      'not.claude/settings.local.json',
      'my.mcp.json',
      '.mcp.json.bak',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });

  test('coding CLI rules can be disabled independently', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const config = { disabledRules: new Set(['secret.cli.codex']), denyPaths: [] };

    expect(findSensitivePathTarget(['~/.codex/auth.json'], cwd, config)).toBeNull();
    expect(findSensitivePathTarget(['~/.gemini/oauth_creds.json'], cwd, config)).not.toBeNull();
  });
});

describe('secret protection rename-shielded variants', () => {
  test('flags copied / renamed keys and credentials', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'id_rsa.bak',
      'id_rsa.backup',
      'id_rsa-old',
      'id_rsa_old',
      'id_rsa.key',
      'id_rsa.pem',
      'id_rsa.orig',
      'id_rsa.tmp',
      'id_ed25519-old',
      'id_ecdsa.bak',
      'credentials.backup',
      'credentials-old',
      '/tmp/id_rsa.save',
      '/home/u/.ssh/id_rsa.copy',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('does not flag public keys or unrelated lookalikes', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'id_rsa.pub',
      'id_ed25519.pub',
      'id_ecdsa.pub',
      'id_rsafoo',
      'credentials.json',
      'server.key.example',
      '.envrc',
      'environment.py',
      '.env_example',
      '.env.example',
      '.env.sample',
      '.env.template',
      '.env.defaults',
      '.env.example.production',
      '.env.sample.staging',
      'package.json',
      'README.md',
      'app.py',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });
});

describe('secret protection broad path signatures', () => {
  test('flags standalone sensitive extensions', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'server.pem',
      'vault.kdbx',
      'prod.ovpn',
      'wallet.keychain',
      'CERT.P12',
      '/tmp/archive.PKCS12',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('flags regex-style sensitive extensions', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'server.key',
      'deploy.keypair',
      'java.keystore',
      'gnome.keyring',
      'keepass.kdb',
      'keepass.kdbx',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('does not flag sql and sqlite database files', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of ['db/schema.sql', 'db/dump.sqldump', 'tmp/dev.sqlite']) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }

    expect(findSensitivePathTarget(['capture.pcap'], cwd)).not.toBeNull();
  });

  test('does not flag log files by default', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget(['application.log'], cwd)).toBeNull();
  });

  test('flags non-standard extensionless SSH key filenames', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'deploy_key_rsa',
      'github_ed25519',
      'staging_ecdsa',
      'backup_dsa',
      '/tmp/DEPLOY_KEY_RSA',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('does not flag public-key variants of broad SSH filenames', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of ['deploy_key_rsa.pub', 'github_ed25519.pub']) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });

  test('skips dependency and cache paths for broad signatures only', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'node_modules/pkg/server.pem',
      'vendor/cache/vault.kdbx',
      'vendor/bundle/prod.ovpn',
      'src/__pycache__/server.pem',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }

    for (const target of [
      'node_modules/pkg/.env',
      'vendor/cache/id_rsa',
      '.git/hooks/deploy_key_rsa',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });
});

describe('secret protection env variant coverage', () => {
  test('flags every .env.<environment> variant', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      '.env.staging',
      '.env.development',
      '.env.production',
      '.env.test',
      '.env.local',
      '.env.production.local',
      '.env.development.local',
      '/app/.env.ci',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });
});

describe('secret protection public keys in sensitive directories', () => {
  test('blocks public keys inside ~/.ssh', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of ['~/.ssh/id_rsa.pub', '~/.ssh/id_ed25519.pub', '~/.ssh/id_ecdsa.pub']) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });

  test('still exempts public keys outside sensitive directories', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'id_rsa.pub',
      '/tmp/id_rsa.pub',
      'keys/id_ed25519.pub',
      '/etc/ssh/id_ecdsa.pub',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });
});

describe('secret protection POSIX backslash handling', () => {
  // On POSIX a backslash is an escape character, not a path separator. Regex
  // arguments that survive shell quoting therefore reach the scanner with the
  // backslash intact, and normalizing it to `/` turned `process\.env` into
  // `process/.env`, whose basename is `.env`.
  test('does not treat a POSIX backslash as a path separator', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of ['process\\.env', 'fix\\.env', 'x\\.npmrc', 'a\\.netrc']) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });

  test('leaves regex arguments to unmodelled search tools alone', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      'git grep -n "process\\.env" -- .',
      'git log --grep "fix\\.env"',
      'git grep -n "\\.npmrc"',
    ]) {
      expect(
        findSensitiveTargetInCommand(command, cwd, undefined, { strict: false }),
        command,
      ).toBeNull();
    }
  });

  // Shell-level escapes are removed by the parser before matching, so dropping
  // the normalization must not reopen `cat \.env`.
  test('still blocks shell-escaped sensitive operands', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of ['cat \\.env', 'cat .en\\v', 'cat \\.npmrc']) {
      expect(
        findSensitiveTargetInCommand(command, cwd, undefined, { strict: false }),
        command,
      ).not.toBeNull();
    }
  });

  test('still treats Windows-shaped candidates as paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'C:\\Users\\me\\.npmrc',
      'D:/projects/app/.env',
      '\\\\server\\share\\.netrc',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });
});

describe('secret protection prefix rules require filename-shaped basenames', () => {
  // `.env.` matched as an unbounded prefix, so an English sentence beginning
  // with `.env.example)` was read as a path — and, because the exemption list
  // matches the basename exactly, the template name inside prose was blocked
  // while the template file itself is allowed.
  test('ignores prose that merely begins with a sensitive prefix', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      '.env.example) and then some prose here',
      '.env.production is documented in the README',
      'id_rsa-based auth is fine for this repo',
      'id_ed25519_or_similar keys are covered below',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });

  test('ignores interpreter string literals that are prose, not paths', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const command = 'python3 -c "x = \'.env.example) and then some prose here\'"';

    expect(findSensitiveTargetInCommand(command, cwd, undefined, { strict: false })).toBeNull();
  });

  test('still blocks real env variants and rename-shielded keys', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      '.env.production',
      '.env.production.local',
      '/app/.env.ci',
      'id_rsa-old',
      'id_rsa.bak',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).not.toBeNull();
    }
  });
});

describe('secret protection remote URLs are not local paths', () => {
  // Fetching a public template over https reads nothing on this machine, so a
  // remote URL must not be matched against local secret-path rules.
  test('ignores http and https URLs', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'https://raw.githubusercontent.com/o/r/main/.env.test',
      'https://example.com/x/.npmrc',
      'https://example.com/a/credentials',
      'http://example.com/keys/id_rsa',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });

  test('ignores remote URLs passed to a fetching command', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      'curl -sL https://raw.githubusercontent.com/o/r/main/.env.test',
      'wget https://example.com/a/credentials',
    ]) {
      expect(
        findSensitiveTargetInCommand(command, cwd, undefined, { strict: false }),
        command,
      ).toBeNull();
    }
  });

  test('still blocks file: URLs and local operands beside a URL', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget([pathToFileURL('/tmp/app/.env').href], cwd)).not.toBeNull();
    // `file://localhost/...` normalizes to an empty host, but any other file
    // host keeps it — so the scheme check, not the host check, is what keeps
    // these local.
    expect(findSensitivePathTarget(['file://localhost/tmp/app/.env'], cwd)).not.toBeNull();
    expect(findSensitivePathTarget(['file://otherhost/home/u/.env'], cwd)).not.toBeNull();
    expect(
      findSensitiveTargetInCommand('curl -sL https://example.com/x -o .env', cwd, undefined, {
        strict: false,
      }),
    ).not.toBeNull();
  });
});

describe('secret protection URL parsing is not pattern matching', () => {
  // `new URL()` accepts a drive letter as a scheme, so host emptiness — not the
  // scheme — is what separates a remote address from a Windows path.
  test('a drive-qualified Windows path is never mistaken for a remote URL', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget(['C:\\Users\\me\\.npmrc'], cwd)?.ruleId).toBe(
      'secret.basename.npmrc',
    );
    expect(findSensitivePathTarget(['c:/Users/me/.env'], cwd)?.ruleId).toBe('secret.basename.env');
  });

  test('scheme casing, userinfo and ports do not change the verdict', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const target of [
      'HTTPS://EXAMPLE.COM/x/.env.test',
      'https://user:pass@example.com/x/.npmrc',
      'https://example.com:8443/x/credentials',
    ]) {
      expect(findSensitivePathTarget([target], cwd), target).toBeNull();
    }
  });

  // http and https always resolve an authority (`http:///etc/x` parses with host
  // `etc`), so a genuinely hostless candidate needs a non-special scheme. Those
  // address nothing remote and must stay local paths.
  test('a hostless scheme is still treated as a local path', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(findSensitivePathTarget(['customscheme:/etc/.npmrc'], cwd)?.ruleId).toBe(
      'secret.basename.npmrc',
    );
  });

  test('user deny paths still apply to remote URLs', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    expect(
      findSensitivePathTarget(['https://example.com/internal/secret.txt'], cwd, {
        disabledRules: new Set(),
        denyPaths: ['https://example.com/internal/secret.txt'],
      }),
    ).not.toBeNull();
  });
});

describe('secret protection prefix rules trust the filesystem over shape', () => {
  // The whitespace heuristic must not lose a real duplicate: macOS names copies
  // `<file> copy`, so `.env.production copy` is a genuine secret on disk.
  test('an existing sensitive file with spaces is still matched', () => {
    const dir = mkdtempSync(join(tmpdir(), 'secret-protection-copy-'));
    try {
      writeFileSync(join(dir, '.env.production copy'), 'TOKEN=1');
      writeFileSync(join(dir, 'id_rsa-old copy'), 'KEY');

      expect(findSensitivePathTarget(['.env.production copy'], dir)?.ruleId).toBe(
        'secret.pattern.env-variant',
      );
      expect(findSensitivePathTarget(['id_rsa-old copy'], dir)).not.toBeNull();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test('prose that does not exist on disk is still ignored', () => {
    const dir = mkdtempSync(join(tmpdir(), 'secret-protection-prose-'));
    try {
      expect(findSensitivePathTarget(['.env.example) and then some prose here'], dir)).toBeNull();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('secret protection filesystem probe never throws out of the guard', () => {
  // `entryKind` uses lstat with `throwIfNoEntry: false`, which suppresses ENOENT
  // but NOT ENAMETOOLONG. An oversized candidate must answer "not a path"
  // instead of propagating an exception out of a security guard.
  test('an oversized candidate is answered, not thrown', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');
    const oversized = `.env.${'a b'.repeat(4000)}`;

    expect(() => findSensitivePathTarget([oversized], cwd)).not.toThrow();
    expect(findSensitivePathTarget([oversized], cwd)).toBeNull();
  });

  test('an unreadable or looping candidate is answered, not thrown', () => {
    const dir = mkdtempSync(join(tmpdir(), 'secret-protection-loop-'));
    try {
      symlinkSync(join(dir, 'loop'), join(dir, 'loop'));
      expect(() => findSensitivePathTarget(['.env.prod copy'], dir)).not.toThrow();
      expect(() => findSensitiveTargetInCommand('cat "loop/.env.a b"', dir)).not.toThrow();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('secret protection home rules survive a symlinked credential directory', () => {
  // Dotfile managers (chezmoi, stow), password managers and encrypted volumes
  // routinely make ~/.ssh and ~/.aws symlinks. Canonicalizing the candidate
  // rewrites it to the link TARGET, which no longer starts with `~/.ssh`, so
  // resolving the link silently defeated the rule that names it.
  function homeWithSymlinkedCredentials() {
    const home = mkdtempSync(join(tmpdir(), 'secret-protection-home-'));
    mkdirSync(join(home, 'vault', 'ssh'), { recursive: true });
    mkdirSync(join(home, 'vault', 'aws'), { recursive: true });
    symlinkSync(join(home, 'vault', 'ssh'), join(home, '.ssh'), 'dir');
    symlinkSync(join(home, 'vault', 'aws'), join(home, '.aws'), 'dir');
    writeFileSync(join(home, 'vault', 'ssh', 'config'), 'Host *');
    writeFileSync(join(home, 'vault', 'ssh', 'work_deploy_key'), 'KEY');
    writeFileSync(join(home, 'vault', 'aws', 'config'), '[default]');
    return home;
  }

  test('blocks credential files under a symlinked ~/.ssh and ~/.aws', () => {
    const home = homeWithSymlinkedCredentials();
    try {
      withEnv({ HOME: home }, () => {
        for (const target of [
          '~/.ssh',
          '~/.ssh/config',
          '~/.ssh/work_deploy_key',
          '~/.aws',
          '~/.aws/config',
        ]) {
          expect(findSensitivePathTarget([target], home), target).not.toBeNull();
        }
      });
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });

  test('blocks the same paths written absolutely rather than through ~', () => {
    const home = homeWithSymlinkedCredentials();
    try {
      withEnv({ HOME: home }, () => {
        expect(findSensitivePathTarget([join(home, '.ssh', 'config')], home)).not.toBeNull();
        expect(
          findSensitiveTargetInCommand(`cat ${join(home, '.ssh', 'config')}`, home, undefined, {
            strict: false,
          }),
        ).not.toBeNull();
      });
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });

  test('a real (unlinked) home directory keeps working', () => {
    const home = mkdtempSync(join(tmpdir(), 'secret-protection-realhome-'));
    try {
      mkdirSync(join(home, '.ssh'), { recursive: true });
      writeFileSync(join(home, '.ssh', 'config'), 'Host *');
      withEnv({ HOME: home }, () => {
        expect(findSensitivePathTarget(['~/.ssh/config'], home)?.ruleId).toBe('secret.home.ssh');
      });
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });

  test('an unrelated symlinked directory is still not sensitive', () => {
    const home = mkdtempSync(join(tmpdir(), 'secret-protection-unrelated-'));
    try {
      mkdirSync(join(home, 'vault', 'notes'), { recursive: true });
      symlinkSync(join(home, 'vault', 'notes'), join(home, 'notes'), 'dir');
      writeFileSync(join(home, 'vault', 'notes', 'todo.md'), '# todo');
      withEnv({ HOME: home }, () => {
        expect(findSensitivePathTarget(['~/notes/todo.md'], home)).toBeNull();
      });
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });
});

describe('secret protection exempts every documented explain invocation', () => {
  // `explain` analyses a command string; it never opens the path it is asked
  // about. The exemption existed only for the bare binary and the `bun <file>`
  // form, so the invocations CONTRIBUTING actually prints — `bunx cc-safety-net
  // explain ...` and the package script `bun run src/cli/cc-safety-net.ts
  // explain ...` — blocked on their own argument.
  test('allows explain through the runner forms the docs use', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    // The argument has to contain a separator: that is what makes its basename
    // match a rule, and it is the shape a developer actually debugs with.
    for (const command of [
      `cc-safety-net explain 'cat ~/.ssh/id_rsa'`,
      `bun dist/bin/cc-safety-net.js explain 'cat ~/.ssh/id_rsa'`,
      `node dist/bin/cc-safety-net.js explain 'cat ~/.ssh/id_rsa'`,
      `bun run src/cli/cc-safety-net.ts explain 'cat ~/.ssh/id_rsa'`,
      `bun run dist/bin/cc-safety-net.js explain --json 'cat ~/.ssh/id_rsa'`,
      `bunx cc-safety-net explain 'cat ~/.ssh/id_rsa'`,
      `npx cc-safety-net explain 'cat ~/.ssh/id_rsa'`,
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).toBeNull();
    }
  });

  test('does not widen the exemption beyond explain', () => {
    const cwd = join(tmpdir(), 'secret-protection-project');

    for (const command of [
      `bun run src/cli/other.ts explain ~/.ssh/id_rsa`,
      `bun run src/cli/cc-safety-net.ts hook --coding-cli ~/.ssh/id_rsa`,
      `bunx some-other-tool explain ~/.ssh/id_rsa`,
      `bun run src/cli/cc-safety-net.ts explain 'git status' && cat .env`,
      `bun run src/cli/cc-safety-net.ts run ~/.ssh/id_rsa`,
    ]) {
      expect(findSensitiveTargetInCommand(command, cwd), command).not.toBeNull();
    }
  });
});
