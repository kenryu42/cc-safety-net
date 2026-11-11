import { expect, test } from 'bun:test';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = process.cwd();
const projectDir = mkdtempSync(join(tmpdir(), 'ccsn-codex-probe-'));
const payload = (command: string) =>
  JSON.stringify({
    hook_event_name: 'PreToolUse',
    tool_name: 'Bash',
    tool_input: { command },
    cwd: projectDir,
  });

const RAW = 'node "${PLUGIN_ROOT}/dist/bin/cc-safety-net.js" hook --codex';
const substituted = (pluginRoot: string) => RAW.replaceAll('${PLUGIN_ROOT}', pluginRoot);
const PROPOSED =
  '$r = if ($env:PLUGIN_ROOT) { $env:PLUGIN_ROOT } else { $env:CLAUDE_PLUGIN_ROOT }; if (-not $r) { [Console]::Error.WriteLine(\'cc-safety-net: PLUGIN_ROOT and CLAUDE_PLUGIN_ROOT are unset\'); exit 1 }; node "$r/dist/bin/cc-safety-net.js" hook --codex';

const run = async (shell: string, commandLine: string, stdin: string) => {
  const child = Bun.spawn([shell, '-NoProfile', '-Command', commandLine], {
    stdin: new Blob([stdin]),
    stdout: 'pipe',
    stderr: 'pipe',
    env: { ...process.env, PLUGIN_ROOT: root, CLAUDE_PLUGIN_ROOT: root },
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { exitCode, stdout: stdout.slice(0, 300), stderr: stderr.slice(0, 500) };
};

test.skipIf(process.platform !== 'win32')(
  'probe: the Codex hook command under PowerShell',
  async () => {
    const deny = payload('git reset --hard HEAD~5');
    const cases: [string, string, string, string][] = [
      ['ps5 raw placeholder, deny', 'powershell.exe', RAW, deny],
      ['ps5 substituted, deny', 'powershell.exe', substituted(root), deny],
      ['ps5 substituted, safe', 'powershell.exe', substituted(root), payload('git status')],
      [
        'ps5 substituted verbatim root, deny',
        'powershell.exe',
        substituted(`\\\\?\\${root}`),
        deny,
      ],
      ['ps5 proposed commandWindows, deny', 'powershell.exe', PROPOSED, deny],
      ['pwsh raw placeholder, deny', 'pwsh.exe', RAW, deny],
      ['pwsh substituted, deny', 'pwsh.exe', substituted(root), deny],
    ];
    const results: Record<string, unknown> = { root };
    for (const [name, shell, commandLine, stdin] of cases) {
      results[name] = { commandLine, ...(await run(shell, commandLine, stdin)) };
    }
    expect(results).toEqual({});
  },
  120_000,
);
