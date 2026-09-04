import { afterEach, describe, expect, test } from 'bun:test';
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, parse, relative } from 'node:path';
import { analyzeCommand } from '@/analyzer';
import { loadPolicySnapshot } from '@/policy/snapshot';
import {
  getProjectRulesConfigPath,
  getProjectRulesDir,
  getUserRulesConfigPath,
  loadRulesPolicy,
  syncRulesConfig,
  writeDefaultRulesConfig,
  writeStarterRulebook,
} from '@/rules/policy';
import { withTempDir, writeVendoredGitHubRulebookPolicy } from '../helpers';
import { TEST_ENVIRONMENT } from '../helpers/environment';
import { testModes } from '../helpers/policy';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function rulebook(reason = 'Use targeted cleanup.') {
  return JSON.stringify({
    rulebook_version: 1,
    name: 'policy',
    version: '1.0.0',
    allowed_commands: ['docker'],
    rules: [
      {
        name: 'block-prune',
        command: 'docker',
        block_args: ['prune'],
        reason,
        intent: 'scope_down',
      },
    ],
    tests: [{ command: 'docker prune', expect: 'blocked', rule: 'block-prune' }],
  });
}

function treeState(root: string) {
  const entries: Record<string, { content?: string; mode: number; mtimeMs: number }> = {};
  const visit = (path: string) => {
    for (const name of readdirSync(path)) {
      const child = join(path, name);
      const stat = statSync(child);
      entries[relative(root, child).replaceAll('\\', '/')] = {
        ...(stat.isFile() ? { content: readFileSync(child, 'utf-8') } : {}),
        mode: stat.mode,
        mtimeMs: stat.mtimeMs,
      };
      if (stat.isDirectory()) visit(child);
    }
  };
  visit(root);
  return entries;
}

/** A strict user policy plus the project policy directory, in an isolated temp cwd. */
function writeStrictUserPolicy(cwd: string) {
  const userConfigDir = join(cwd, 'user', 'rules');
  mkdirSync(userConfigDir, { recursive: true });
  writeFileSync(
    join(cwd, 'user', 'policy.json'),
    JSON.stringify({ version: 1, safety: { level: 'strict' } }),
  );
  const projectPolicyPath = join(cwd, '.cc-safety-net', 'policy.json');
  mkdirSync(dirname(projectPolicyPath), { recursive: true });
  return { userConfigDir, projectPolicyPath };
}

describe('policy snapshots', () => {
  test('fails closed with fixed diagnostics for a linked project config file', async () => {
    await withTempDir('cc-safety-net-snapshot-linked-control-', (cwd) => {
      const userConfigDir = join(cwd, 'user', 'rules');
      const outside = join(cwd, 'config-TOPSECRET');
      writeFileSync(outside, 'TOPSECRET unexpected token payload');
      mkdirSync(getProjectRulesDir(cwd), { recursive: true });
      symlinkSync(outside, getProjectRulesConfigPath(cwd));

      const snapshot = loadPolicySnapshot({ cwd, userConfigDir });

      expect(snapshot.state).toBe('degraded');
      expect(snapshot.policy.rules).toEqual([]);
      expect(JSON.stringify(snapshot)).not.toContain('TOPSECRET');
      expect(JSON.stringify(snapshot)).not.toContain('unexpected token');
      expect(snapshot.diagnostics).toContain('Unable to access project policy filesystem safely.');
    });
  });

  test('fails closed before parsing linked rulebook bytes', async () => {
    await withTempDir('cc-safety-net-snapshot-linked-rulebook-', (cwd) => {
      const userConfigDir = join(cwd, 'user', 'rules');
      const configDir = getProjectRulesDir(cwd);
      const configPath = getProjectRulesConfigPath(cwd);
      const outside = join(cwd, 'TOPSECRET-rulebook');
      const externalBytes = 'TOPSECRET unexpected parser payload';
      writeFileSync(outside, externalBytes);
      mkdirSync(configDir, { recursive: true });
      writeDefaultRulesConfig(configPath, ['linked']);
      mkdirSync(join(configDir, 'linked'), { recursive: true });
      symlinkSync(outside, join(configDir, 'linked', 'rulebook.json'));

      const rules = loadRulesPolicy({ cwd, userConfigDir });
      expect(rules.rules).toEqual([]);
      expect(rules.errors).toContain('Unable to access project policy filesystem safely.');
      expect(JSON.stringify(rules.errors)).not.toContain('TOPSECRET');
      expect(JSON.stringify(rules.errors)).not.toContain('unexpected parser');
    });
  });
  test('loads deeply immutable plain data', async () => {
    await withTempDir('cc-safety-net-snapshot-ready-', (cwd) => {
      const snapshot = loadPolicySnapshot({ cwd, userConfigDir: join(cwd, 'user', 'rules') });

      expect(snapshot.state).toBe('ready');
      expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
      expect(Object.isFrozen(snapshot)).toBeTrue();
      expect(Object.isFrozen(snapshot.policy)).toBeTrue();
      expect(Object.isFrozen(snapshot.policy.rules)).toBeTrue();
      expect(Object.isFrozen(snapshot.policy.secretProtection.disabledRules)).toBeTrue();
      expect(() => (snapshot.policy.rules as unknown[]).push({})).toThrow();
    });
  });

  test('preserves the asymmetric invalid rules and user-policy composition', async () => {
    await withTempDir('cc-safety-net-snapshot-invalid-', (cwd) => {
      const userConfigDir = join(cwd, 'user', 'rules');
      mkdirSync(dirname(getProjectRulesConfigPath(cwd)), { recursive: true });
      writeFileSync(
        getProjectRulesConfigPath(cwd),
        JSON.stringify({ version: 1, rules: ['missing-rules'] }),
      );
      mkdirSync(dirname(userConfigDir), { recursive: true });
      writeFileSync(
        join(dirname(userConfigDir), 'policy.json'),
        JSON.stringify({ version: 1, safety: { level: 'strict' } }),
      );

      const snapshot = loadPolicySnapshot({ cwd, userConfigDir });

      expect(snapshot.state).toBe('degraded');
      if (snapshot.state !== 'degraded') return;
      expect(snapshot.policy.rules).toEqual([]);
      expect(snapshot.policy.safety.level).toBe('strict');
      const missingRulebook = `missing rulebook file ${join(cwd, '.cc-safety-net', 'rules', 'missing-rules', 'rulebook.json')} for missing-rules; create that file or remove that source from the rules config`;
      expect(snapshot.diagnostics).toEqual([missingRulebook]);
      expect(snapshot.reason).toBe(
        `${missingRulebook}. Those rule sources are not active; every other rule and all built-in protections still apply.`,
      );
    });

    await withTempDir('cc-safety-net-snapshot-invalid-policy-', (cwd) => {
      const userConfigDir = join(cwd, 'user', 'rules');
      writeVendoredGitHubRulebookPolicy(cwd, rulebook());
      mkdirSync(dirname(userConfigDir), { recursive: true });
      const policyPath = join(dirname(userConfigDir), 'policy.json');
      writeFileSync(policyPath, JSON.stringify({ version: 1, extra: true }));

      const snapshot = loadPolicySnapshot({ cwd, userConfigDir });

      expect(snapshot.state).toBe('degraded');
      if (snapshot.state !== 'degraded') return;
      expect(snapshot.policy.rules.map((rule) => rule.name)).toEqual(['policy/block-prune']);
      expect(snapshot.policy.safety).toEqual({ level: 'standard' });
      expect(snapshot.diagnostics).toEqual([`${policyPath}: unknown field "extra"`]);
      expect(snapshot.reason).toBe(
        `invalid policy config: ${policyPath}: unknown field "extra". Enforcing the salvaged policy with protective defaults; the invalid values are not active. Fix the policy file manually.`,
      );
    });
  });

  test('salvages recognized policy sections and names the built-in fallback', async () => {
    await withTempDir('cc-safety-net-snapshot-policy-salvage-', (cwd) => {
      const userConfigDir = join(cwd, 'user', 'rules');
      mkdirSync(dirname(userConfigDir), { recursive: true });
      const policyPath = join(dirname(userConfigDir), 'policy.json');
      writeFileSync(
        policyPath,
        JSON.stringify({
          version: 1,
          safety: { level: 'strict' },
          workflow: { worktree_mode: true },
          destructive_command_protection: {
            enabled: 'yes',
            overrides: { 'git.reset-hard': 'allow' },
            allow_paths: [parse(cwd).root],
          },
          secret_protection: { enabled: 'yes', overrides: { 'secret.ext.pem': 'allow' } },
        }),
      );

      const salvaged = loadPolicySnapshot({ cwd, userConfigDir });

      expect(salvaged.state).toBe('degraded');
      if (salvaged.state !== 'degraded') return;
      // Valid sections survive; every invalid section falls back to the
      // protective default instead of the value the file asked for.
      expect(salvaged.policy.safety.level).toBe('strict');
      expect(salvaged.policy.worktreeMode).toBeTrue();
      expect(salvaged.policy.destructiveCommandProtectionEnabled).toBeTrue();
      expect(salvaged.policy.destructiveCommandRuleOverrides).toEqual({});
      expect(salvaged.policy.destructiveCommandAllowPaths).toEqual([]);
      expect(salvaged.policy.secretProtection.enabled).toBeTrue();
      // The salvaged policy still applies the built-in default-off tier.
      expect(salvaged.policy.secretProtection.disabledRules).toContain('secret.cli.codex.config');
      expect(salvaged.policy.secretProtection.disabledRules).not.toContain('secret.cli.codex');
      expect(salvaged.reason).toContain('Enforcing the salvaged policy with protective defaults');

      writeFileSync(policyPath, '{"version":1,');
      const defaulted = loadPolicySnapshot({ cwd, userConfigDir });

      expect(defaulted.state).toBe('degraded');
      if (defaulted.state !== 'degraded') return;
      expect(defaulted.policy.destructiveCommandProtectionEnabled).toBeTrue();
      expect(defaulted.policy.secretProtection.enabled).toBeTrue();
      expect(defaulted.reason).toBe(
        `invalid policy config: ${policyPath}: Invalid JSON. Enforcing built-in protective defaults; the invalid values are not active. Fix the policy file manually.`,
      );
    });
  });

  test('honors the project policy and records its provenance on the snapshot', async () => {
    await withTempDir('cc-safety-net-snapshot-project-policy-', (cwd) => {
      const scope = writeStrictUserPolicy(cwd);
      writeFileSync(
        scope.projectPolicyPath,
        JSON.stringify({ version: 1, safety: { level: 'standard' } }),
      );

      const snapshot = loadPolicySnapshot({ cwd, userConfigDir: scope.userConfigDir });

      // A weakening project policy is honored as written, not a failure.
      expect(snapshot.state).toBe('ready');
      expect(snapshot.policy.safety.level).toBe('standard');
      expect(snapshot.policyScopes).toEqual({
        levelScope: 'project',
        weakenings: ['project policy lowers level: strict -> standard'],
      });
      expect(Object.isFrozen(snapshot.policyScopes)).toBeTrue();
    });
  });

  test('degrades naming the project policy file while the user policy stays in force', async () => {
    await withTempDir('cc-safety-net-snapshot-project-policy-invalid-', (cwd) => {
      const scope = writeStrictUserPolicy(cwd);
      writeFileSync(scope.projectPolicyPath, '{"version":1,');

      const snapshot = loadPolicySnapshot({ cwd, userConfigDir: scope.userConfigDir });

      expect(snapshot.state).toBe('degraded');
      if (snapshot.state !== 'degraded') return;
      expect(snapshot.diagnostics).toEqual([`${scope.projectPolicyPath}: Invalid JSON`]);
      expect(snapshot.reason).toContain(`${scope.projectPolicyPath}: Invalid JSON`);
      expect(snapshot.policy.safety.level).toBe('strict');
      // The user policy is still enforced, so the reason must not tell the reader
      // that built-in defaults replaced it.
      expect(snapshot.reason).toContain('Enforcing the salvaged policy with protective defaults');
      expect(snapshot.reason).not.toContain('Enforcing built-in protective defaults');
    });
  });

  test('salvages a deny path list by dropping only the home-covering entry', async () => {
    await withTempDir('cc-safety-net-snapshot-deny-path-salvage-', (cwd) => {
      const userConfigDir = join(cwd, 'user', 'rules');
      mkdirSync(dirname(userConfigDir), { recursive: true });
      writeFileSync(
        join(dirname(userConfigDir), 'policy.json'),
        '{"version":1,"secret_protection":{"deny_paths":["private/token.txt","~"]}}',
      );

      const snapshot = loadPolicySnapshot({ cwd, userConfigDir });

      expect(snapshot.state).toBe('degraded');
      if (snapshot.state !== 'degraded') return;
      // The usable entry survives the repair, the entry that would block every
      // command is dropped, and protection stays on.
      expect(snapshot.policy.secretProtection.denyPaths).toEqual(['private/token.txt']);
      expect(snapshot.policy.secretProtection.enabled).toBeTrue();
      expect(snapshot.reason).toContain(
        'secret_protection.deny_paths[1] cannot be the home directory or a path above it',
      );
    });
  });

  test('keeps verified rules from a healthy scope when another scope is dropped', async () => {
    await withTempDir('cc-safety-net-snapshot-containment-', async (cwd) => {
      const userConfigDir = join(cwd, 'user', 'rules');
      writeStarterRulebook(join(userConfigDir, 'user-rules', 'rulebook.json'), 'user-rules');
      writeDefaultRulesConfig(getUserRulesConfigPath({ userConfigDir }), ['user-rules']);
      expect((await syncRulesConfig({ cwd, userConfigDir, global: true })).ok).toBe(true);
      mkdirSync(getProjectRulesDir(cwd), { recursive: true });
      writeDefaultRulesConfig(getProjectRulesConfigPath(cwd), ['project-rules']);

      const snapshot = loadPolicySnapshot({ cwd, userConfigDir });

      expect(snapshot.policy.rules.map((rule) => rule.name)).toEqual([
        'user-rules/block-docker-system-prune',
      ]);
      expect(snapshot).toMatchObject({
        state: 'degraded',
        reason: expect.stringContaining('missing rulebook file'),
      });
    });
  });

  test('reads and validates vendored rulebooks without writes or network access', async () => {
    await withTempDir('cc-safety-net-snapshot-offline-', (cwd) => {
      const content = rulebook();
      writeVendoredGitHubRulebookPolicy(cwd, content);
      const userConfigDir = join(cwd, 'user', 'rules');
      const before = treeState(cwd);
      let fetchCalls = 0;
      globalThis.fetch = (() => {
        fetchCalls++;
        throw new Error('runtime snapshot loading must remain offline');
      }) as unknown as typeof fetch;

      const ready = loadPolicySnapshot({ cwd, userConfigDir });
      expect(ready.state).toBe('ready');
      expect(fetchCalls).toBe(0);
      expect(treeState(cwd)).toEqual(before);

      const vendored = Object.keys(before).find((path) => path.endsWith('/rulebook.json'));
      expect(vendored).toBeDefined();
      writeFileSync(join(cwd, vendored as string), '{ "rulebook_version": 1,');

      const invalid = loadPolicySnapshot({ cwd, userConfigDir });
      expect(invalid.state).toBe('degraded');
      if (invalid.state === 'degraded') expect(invalid.reason).toContain('invalid rulebook');
      expect(fetchCalls).toBe(0);
    });
  });

  test('analysis consumes the explicit snapshot instead of reloading configuration', async () => {
    await withTempDir('cc-safety-net-snapshot-analysis-', (cwd) => {
      writeVendoredGitHubRulebookPolicy(cwd, rulebook());
      const snapshot = loadPolicySnapshot({ cwd, userConfigDir: join(cwd, 'user', 'rules') });
      writeFileSync(getProjectRulesConfigPath(cwd), JSON.stringify({ version: 1, rules: [] }));

      const result = analyzeCommand('docker prune', {
        cwd,
        policySnapshot: snapshot,
        environment: TEST_ENVIRONMENT,
        effectiveCapabilities: testModes().capabilities,
        protectedGitMetadata: null,
      });

      expect(result?.reason).toBe('[policy/block-prune] Use targeted cleanup.');
      expect(result?.intent).toBe('scope_down');
    });
  });
});
