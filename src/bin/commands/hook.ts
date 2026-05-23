import type { Command } from './types';

export const hookCommand: Command = {
  name: 'hook',
  description: 'Run as an agent CLI hook (reads JSON from stdin)',
  usage: 'hook <platform>',
  subcommands: [
    { usage: 'install --opencode', description: 'Install OpenCode hook config' },
    { usage: 'install --kimi-cli', description: 'Install Kimi CLI hook config' },
    { usage: 'uninstall --opencode', description: 'Uninstall OpenCode hook config' },
    { usage: 'uninstall --kimi-cli', description: 'Uninstall Kimi CLI hook config' },
  ],
  options: [
    {
      flags: '-cc, --claude-code',
      description: 'Run as Claude Code PreToolUse hook',
    },
    {
      flags: '-cp, --copilot-cli',
      description: 'Run as Copilot CLI PreToolUse hook',
    },
    {
      flags: '-gc, --gemini-cli',
      description: 'Run as Gemini CLI BeforeTool hook',
    },
    {
      flags: '-kc, --kimi-cli',
      description: 'Run as Kimi CLI PreToolUse hook',
    },
    {
      flags: '-h, --help',
      description: 'Show this help',
    },
  ],
  examples: [
    'cc-safety-net hook -cc',
    'cc-safety-net hook --claude-code',
    'cc-safety-net hook -cp',
    'cc-safety-net hook --copilot-cli',
    'cc-safety-net hook -gc',
    'cc-safety-net hook --gemini-cli',
    'cc-safety-net hook -kc',
    'cc-safety-net hook --kimi-cli',
    'cc-safety-net hook uninstall --opencode',
  ],
};
