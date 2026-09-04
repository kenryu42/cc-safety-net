import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, parse } from 'node:path';
import { getCCSafetyNetEnvModes } from '@/policy/env';
import {
  DEFAULT_GUI_POLICY,
  DESTRUCTIVE_COMMAND_RULE_METADATA,
  loadPolicyConfig,
  previewUserPolicyForGui,
  readUserPolicyForGui,
  repairUserPolicyForGui,
  SECRET_PROTECTION_RULE_METADATA,
  writeUserPolicyFromGui,
} from '@/policy/store';
import { resolveEffectiveDestructiveCommandRules } from '@/rules/destructive-command-rules';
import { withEnv } from '../helpers';

describe('policy GUI helpers', () => {
  let tempDir: string;
  let safetyNetHome: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'safety-net-policy-gui-'));
    safetyNetHome = join(tempDir, 'home', '.cc-safety-net');
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  test('missing user policy returns defaults without creating a file', () => {
    const result = readUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') });

    expect(result.exists).toBe(false);
    expect(result.errors).toEqual([]);
    expect(result.policy).toEqual(DEFAULT_GUI_POLICY);
    expect(result.policy.destructive_command_protection.enabled).toBe(true);
    expect(result.policy.secret_protection.enabled).toBe(true);
    expect(existsSync(join(safetyNetHome, 'policy.json'))).toBe(false);
  });

  test('empty user policy reports the error and returns editable defaults', () => {
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(join(safetyNetHome, 'policy.json'), '  \n', 'utf-8');

    const result = readUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') });

    expect(result).toEqual({
      path: join(safetyNetHome, 'policy.json'),
      exists: true,
      raw: '  \n',
      policy: DEFAULT_GUI_POLICY,
      errors: ['Config file is empty'],
    });
  });

  test('valid user policy reads and rewrites as canonical JSON', () => {
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(
      join(safetyNetHome, 'policy.json'),
      JSON.stringify({
        version: 1,
        safety: { level: 'strict', overrides: { paranoid_rm: true } },
        workflow: { worktree_mode: true },
        destructive_command_protection: {
          enabled: false,
          overrides: { 'git.reset-hard': 'off', 'shell.dynamic-executable': 'on' },
        },
        secret_protection: {
          enabled: true,
          overrides: { 'secret.ext.pem': 'off' },
          deny_paths: ['private/token.txt'],
        },
      }),
      'utf-8',
    );

    const readResult = readUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') });
    expect(readResult.errors).toEqual([]);
    expect(readResult.policy.safety).toEqual({
      level: 'strict',
      overrides: { paranoid_rm: true },
    });
    expect(readResult.policy.workflow.worktree_mode).toBe(true);
    expect(readResult.policy.destructive_command_protection.enabled).toBe(false);
    expect(readResult.policy.destructive_command_protection.overrides).toEqual({
      'git.reset-hard': 'off',
      'shell.dynamic-executable': 'on',
    });
    expect(readResult.policy.secret_protection.overrides).toEqual({ 'secret.ext.pem': 'off' });

    const writeResult = writeUserPolicyFromGui(readResult.policy, {
      userConfigDir: join(safetyNetHome, 'rules'),
    });

    expect(writeResult.errors).toEqual([]);
    expect(readFileSync(join(safetyNetHome, 'policy.json'), 'utf-8')).toBe(
      `${JSON.stringify(readResult.policy, null, 2)}\n`,
    );
  });

  test('rejects invalid secret overrides', () => {
    const invalidOverrides = writeUserPolicyFromGui(
      {
        ...DEFAULT_GUI_POLICY,
        secret_protection: {
          ...DEFAULT_GUI_POLICY.secret_protection,
          overrides: { 'secret.unknown': 'off', 'secret.ext.pem': 'allow' },
        },
      },
      { userConfigDir: join(safetyNetHome, 'rules') },
    );
    expect(invalidOverrides.errors).toContain('unknown secret protection rule id "secret.unknown"');
    expect(invalidOverrides.errors).toContain(
      'secret_protection.overrides.secret.ext.pem must be "on" or "off"',
    );
  });

  test('rejects invalid destructive command policy values', () => {
    const invalid = writeUserPolicyFromGui(
      {
        ...DEFAULT_GUI_POLICY,
        destructive_command_protection: {
          enabled: 'yes',
          overrides: { 'git.reset-hard': 'allow' },
        },
      },
      { userConfigDir: join(safetyNetHome, 'rules') },
    );

    expect(invalid.errors).toContain('destructive_command_protection.enabled must be a boolean');
    expect(invalid.errors).toContain(
      'destructive_command_protection.overrides.git.reset-hard must be "on" or "off"',
    );
  });

  test('invalid user policy can be read with errors and rejected on save', () => {
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(join(safetyNetHome, 'policy.json'), '{bad json', 'utf-8');

    const readResult = readUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') });
    expect(readResult.exists).toBe(true);
    expect(readResult.raw).toBe('{bad json');
    expect(readResult.errors[0]).toContain('Invalid JSON');

    const writeResult = writeUserPolicyFromGui(
      {
        ...DEFAULT_GUI_POLICY,
        destructive_command_protection: { enabled: true, overrides: { 'git.reset-hard': 'allow' } },
      },
      { userConfigDir: join(safetyNetHome, 'rules') },
    );

    expect(writeResult.errors).toContain(
      'destructive_command_protection.overrides.git.reset-hard must be "on" or "off"',
    );
    expect(readFileSync(join(safetyNetHome, 'policy.json'), 'utf-8')).toBe('{bad json');
  });

  test('reading a parseable invalid policy returns the salvaged projection', () => {
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(
      join(safetyNetHome, 'policy.json'),
      JSON.stringify({
        safety: { level: 'paranoid', overrides: { fail_closed: true, paranoid_rm: 'yes' } },
        destructive_command_protection: {
          enabled: 'yes',
          overrides: { 'git.reset-hard': 'off', 'git.clean-force': 'allow' },
        },
      }),
      'utf-8',
    );

    const result = readUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') });

    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.policy.safety).toEqual({ level: 'paranoid', overrides: { fail_closed: true } });
    expect(result.policy.destructive_command_protection.overrides).toEqual({
      'git.reset-hard': 'off',
    });
    // The invalid boolean is replaced by the protective default, not by whole-file defaults.
    expect(result.policy.destructive_command_protection.enabled).toBe(true);
    // The GUI read, the repair write, and the runtime read all project through one salvage path.
    expect(result.policy).toEqual(
      repairUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') }).policy,
    );
  });

  test('repair preserves valid fields from parseable invalid policy', () => {
    const scratchPath = join(parse(tempDir).root, 'opt', 'scratch');
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(
      join(safetyNetHome, 'policy.json'),
      JSON.stringify({
        version: 2,
        modes: { strict: true },
        safety: {
          level: 'paranoid',
          overrides: {
            fail_closed: true,
            paranoid_rm: 'yes',
            paranoid_interpreters: false,
            unknown: true,
          },
        },
        workflow: { worktree_mode: false },
        destructive_command_protection: {
          enabled: 'yes',
          overrides: {
            'git.reset-hard': 'off',
            'shell.dynamic-executable': 'on',
            'git.unknown': 'off',
            'git.clean-force': 'allow',
          },
          allow_paths: ['~', 'relative/path', scratchPath, 42],
        },
        secret_protection: {
          enabled: false,
          overrides: {
            'secret.ext.pem': 'off',
            'secret.unknown': 'off',
          },
          deny_paths: ['private/token.txt', '', 42, '~', parse(tempDir).root],
          allow_paths: ['**/.env.test', '~/projects/fixtures', '', 42, '~', '**'],
        },
        extra: true,
      }),
      'utf-8',
    );

    const result = repairUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') });

    expect(result.errors).toEqual([]);
    expect(result.policy).toEqual({
      version: 1,
      safety: {
        level: 'paranoid',
        overrides: {
          fail_closed: true,
          paranoid_interpreters: false,
        },
      },
      workflow: {
        worktree_mode: false,
      },
      destructive_command_protection: {
        enabled: true,
        overrides: { 'git.reset-hard': 'off', 'shell.dynamic-executable': 'on' },
        allow_paths: [scratchPath],
      },
      secret_protection: {
        enabled: false,
        overrides: { 'secret.ext.pem': 'off' },
        deny_paths: ['private/token.txt'],
        // The glob entry is repaired away: allow paths are literal only.
        allow_paths: ['~/projects/fixtures'],
      },
      // The fixture carries no audit section, so repair supplies the default.
      audit: { retention_days: 30 },
    });
    expect(readFileSync(join(safetyNetHome, 'policy.json'), 'utf-8')).toBe(
      `${JSON.stringify(result.policy, null, 2)}\n`,
    );
  });

  test('repair restores defaults when policy JSON cannot be parsed', () => {
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(join(safetyNetHome, 'policy.json'), '{bad json', 'utf-8');

    const result = repairUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') });

    expect(result.errors).toEqual([]);
    expect(result.policy).toEqual(DEFAULT_GUI_POLICY);
    expect(readFileSync(join(safetyNetHome, 'policy.json'), 'utf-8')).toBe(
      `${JSON.stringify(DEFAULT_GUI_POLICY, null, 2)}\n`,
    );
  });

  test('save writes only user policy with secret overrides', () => {
    const projectPolicyPath = join(tempDir, '.cc-safety-net', 'policy.json');
    mkdirSync(join(tempDir, '.cc-safety-net'), { recursive: true });
    writeFileSync(projectPolicyPath, JSON.stringify({ version: 1 }), 'utf-8');

    const result = writeUserPolicyFromGui(
      {
        ...DEFAULT_GUI_POLICY,
        secret_protection: {
          ...DEFAULT_GUI_POLICY.secret_protection,
          overrides: { 'secret.ext.pem': 'off' },
        },
      },
      { cwd: tempDir, userConfigDir: join(safetyNetHome, 'rules') },
    );

    expect(result.errors).toEqual([]);
    expect(readFileSync(projectPolicyPath, 'utf-8')).toBe(JSON.stringify({ version: 1 }));
  });

  test('destructive command metadata describes each rule', () => {
    for (const entry of DESTRUCTIVE_COMMAND_RULE_METADATA) {
      expect(entry.category).not.toBe('');
      expect(entry.label).not.toBe('');
      expect(entry.description).not.toBe('');
      expect(typeof entry.example).toBe('string');
      expect(entry.example.trim()).not.toBe('');
    }
    expect(
      DESTRUCTIVE_COMMAND_RULE_METADATA.filter((entry) => !entry.activationCapability),
    ).toHaveLength(51);
    expect(
      DESTRUCTIVE_COMMAND_RULE_METADATA.filter(
        (entry) => entry.activationCapability === 'fail_closed',
      ),
    ).toHaveLength(5);
    expect(
      DESTRUCTIVE_COMMAND_RULE_METADATA.filter(
        (entry) =>
          entry.activationCapability === 'paranoid_rm' ||
          entry.activationCapability === 'paranoid_interpreters',
      ),
    ).toHaveLength(3);
  });

  test('resolves master, rule override, capability, and built-in precedence', () => {
    const capabilities = getCCSafetyNetEnvModes({ safety: { level: 'standard' } }).capabilities;
    const states = resolveEffectiveDestructiveCommandRules(
      {
        destructiveCommandProtectionEnabled: true,
        destructiveCommandRuleOverrides: {
          'git.reset-hard': 'off',
          'shell.dynamic-executable': 'on',
        },
      },
      capabilities,
    );

    expect(states['git.clean-force']).toMatchObject({
      enabled: true,
      inheritedEnabled: true,
      source: 'built_in_default',
    });
    expect(states['git.reset-hard']).toMatchObject({
      enabled: false,
      inheritedEnabled: true,
      changesInherited: true,
      source: 'rule_override',
    });
    expect(states['shell.dynamic-structure']).toMatchObject({
      enabled: false,
      inheritedEnabled: false,
      source: 'preset',
    });
    expect(states['shell.dynamic-executable']).toMatchObject({
      enabled: true,
      inheritedEnabled: false,
      changesInherited: true,
      source: 'rule_override',
    });
    expect(Object.isFrozen(states)).toBe(true);
    expect(Object.isFrozen(states['shell.dynamic-executable'])).toBe(true);
    expect(states['rm.recursive-force-root-or-home']).toMatchObject({
      enabled: true,
      source: 'catastrophic',
      changesInherited: false,
    });

    expect(
      resolveEffectiveDestructiveCommandRules(
        {
          destructiveCommandProtectionEnabled: false,
          destructiveCommandRuleOverrides: { 'shell.dynamic-executable': 'on' },
        },
        capabilities,
      )['shell.dynamic-executable'],
    ).toMatchObject({ enabled: false, source: 'master_disabled', changesInherited: false });
    expect(
      resolveEffectiveDestructiveCommandRules(
        {
          destructiveCommandProtectionEnabled: false,
          destructiveCommandRuleOverrides: { 'rm.git-metadata': 'off' },
        },
        capabilities,
      )['rm.git-metadata'],
    ).toMatchObject({
      enabled: true,
      source: 'catastrophic',
      changesInherited: false,
      override: 'off',
    });
  });

  test('reports environment-raised capability provenance separately from the preset', () => {
    withEnv({ CC_SAFETY_NET_STRICT: '1' }, () => {
      const result = previewUserPolicyForGui(DEFAULT_GUI_POLICY);

      expect(result.errors).toEqual([]);
      expect(result.preview).toMatchObject({
        selectedPreset: 'standard',
        effectiveLevel: 'strict',
        capabilities: {
          fail_closed: {
            enabled: true,
            source: 'environment',
            sources: ['policy safety.level=standard', 'env CC_SAFETY_NET_STRICT'],
          },
        },
        rules: {
          'shell.dynamic-executable': {
            enabled: true,
            source: 'environment',
          },
        },
      });
    });
  });

  test('exports secret protection metadata for GUI responses', () => {
    expect(SECRET_PROTECTION_RULE_METADATA[0]).toMatchObject({
      id: 'secret.basename.env',
      category: 'Basename',
    });
  });

  describe('coding CLI config rules are off by default', () => {
    const idsInCategory = (category: string) =>
      SECRET_PROTECTION_RULE_METADATA.filter((rule) => rule.category === category).map(
        (rule) => rule.id,
      );
    const writePolicy = (overrides: Record<string, string>) => {
      mkdirSync(safetyNetHome, { recursive: true });
      writeFileSync(
        join(safetyNetHome, 'policy.json'),
        JSON.stringify({ version: 1, secret_protection: { enabled: true, overrides } }),
        'utf-8',
      );
    };
    const disabled = () =>
      loadPolicyConfig({ userConfigDir: join(safetyNetHome, 'rules') }).secretProtection
        .disabledRules ?? [];

    test('a missing policy file disables every coding CLI config rule', () => {
      const configIds = idsInCategory('Coding CLI config');
      const resolved = disabled();

      expect(configIds.length).toBeGreaterThan(0);
      for (const id of configIds) expect(resolved.includes(id), id).toBe(true);
    });

    test('a missing policy file leaves every other rule enabled', () => {
      const resolved = disabled();

      for (const id of idsInCategory('Coding CLI credential')) {
        expect(resolved.includes(id), id).toBe(false);
      }
      expect(resolved.includes('secret.basename.env')).toBe(false);
    });

    test('an on override re-enables a single coding CLI config rule', () => {
      writePolicy({ 'secret.cli.gemini.config': 'on' });
      const resolved = disabled();

      expect(resolved.includes('secret.cli.gemini.config')).toBe(false);
      expect(resolved.includes('secret.cli.codex.config')).toBe(true);
    });

    test('an off override still disables a credential rule', () => {
      writePolicy({ 'secret.cli.codex': 'off' });

      expect(disabled().includes('secret.cli.codex')).toBe(true);
    });

    test('reset restores the default, so config rules go back off', () => {
      writePolicy({ 'secret.cli.gemini.config': 'on' });
      writeUserPolicyFromGui(DEFAULT_GUI_POLICY, { userConfigDir: join(safetyNetHome, 'rules') });

      expect(disabled().includes('secret.cli.gemini.config')).toBe(true);
    });

    test('the GUI read keeps an on override', () => {
      writePolicy({ 'secret.cli.gemini.config': 'on' });

      expect(
        readUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') }).policy
          .secret_protection.overrides,
      ).toEqual({ 'secret.cli.gemini.config': 'on' });
    });

    test('a GUI save keeps an on override active', () => {
      writeUserPolicyFromGui(
        {
          ...DEFAULT_GUI_POLICY,
          secret_protection: {
            ...DEFAULT_GUI_POLICY.secret_protection,
            overrides: { 'secret.cli.gemini.config': 'on' },
          },
        },
        { userConfigDir: join(safetyNetHome, 'rules') },
      );

      expect(disabled().includes('secret.cli.gemini.config')).toBe(false);
    });

    test('repair keeps an on override active', () => {
      mkdirSync(safetyNetHome, { recursive: true });
      writeFileSync(
        join(safetyNetHome, 'policy.json'),
        JSON.stringify({
          version: 1,
          workflow: { worktree_mode: 'yes' },
          secret_protection: { enabled: true, overrides: { 'secret.cli.gemini.config': 'on' } },
        }),
        'utf-8',
      );

      repairUserPolicyForGui({ userConfigDir: join(safetyNetHome, 'rules') });

      expect(disabled().includes('secret.cli.gemini.config')).toBe(false);
    });
  });
});
