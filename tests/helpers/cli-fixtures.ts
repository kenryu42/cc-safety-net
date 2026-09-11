export const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

export const USER_POLICY = 'home/.cc-safety-net/policy.json';
export const PROJECT_POLICY = 'project/.cc-safety-net/policy.json';

export const PLUGIN_SETTINGS = json({ enabledPlugins: { 'cc-safety-net@cc-marketplace': true } });

export const WEAKENED_BY_PROJECT = {
  [USER_POLICY]: json({ version: 1, safety: { level: 'strict' } }),
  [PROJECT_POLICY]: json({ version: 1, safety: { level: 'standard' } }),
};

export const RULE_SWITCHED_OFF = json({
  version: 1,
  destructive_command_protection: { overrides: { 'git.reset-hard': 'off' } },
});
