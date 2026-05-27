import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { stripJsonComments } from '@/bin/doctor/hooks';

const OPENCODE_PLUGIN = 'cc-safety-net@latest';
const KIMI_HOOK_COMMAND = 'npx -y cc-safety-net hook --kimi-cli';
const KIMI_HOOK_BLOCK = `[[hooks]]
event = "PreToolUse"
matcher = "Shell"
command = "${KIMI_HOOK_COMMAND}"`;
const KIMI_INLINE_HOOK = `{ event = "PreToolUse", matcher = "Shell", command = "${KIMI_HOOK_COMMAND}" }`;

type InstallResult = {
  path: string;
  alreadyInstalled: boolean;
};

type HookAction = 'install' | 'uninstall';

type JsonRange = {
  start: number;
  end: number;
};

function getHomeDir() {
  return process.env.HOME ?? homedir();
}

function getOpenCodeConfigDir() {
  return (
    process.env.OPENCODE_CONFIG_DIR ??
    join(process.env.XDG_CONFIG_HOME ?? join(getHomeDir(), '.config'), 'opencode')
  );
}

function getOpenCodeConfigPath() {
  const configDir = getOpenCodeConfigDir();
  const candidates = ['opencode.jsonc', 'opencode.json', 'config.json'].map((file) =>
    join(configDir, file),
  );

  return candidates.find((path) => existsSync(path)) ?? join(configDir, 'opencode.jsonc');
}

function getKimiConfigPath() {
  return join(process.env.KIMI_SHARE_DIR ?? join(getHomeDir(), '.kimi'), 'config.toml');
}

function isWhitespace(char: string | undefined) {
  return char !== undefined && /\s/.test(char);
}

function skipWhitespace(content: string, index: number) {
  let current = index;
  while (isWhitespace(content[current])) current++;
  return current;
}

function skipWhitespaceAndComments(content: string, index: number) {
  const whitespaceEnd = skipWhitespace(content, index);
  const commentEnd = skipComment(content, whitespaceEnd);
  if (commentEnd === whitespaceEnd) return whitespaceEnd;
  return skipWhitespaceAndComments(content, commentEnd);
}

function skipString(content: string, index: number) {
  let current = index + 1;
  let isEscaped = false;

  while (current < content.length) {
    const char = content[current];
    if (isEscaped) {
      isEscaped = false;
      current++;
      continue;
    }

    if (char === '\\') {
      isEscaped = true;
      current++;
      continue;
    }

    if (char === '"') return current + 1;
    current++;
  }

  throw new Error('Unterminated string in OpenCode config');
}

function skipComment(content: string, index: number) {
  if (content[index] === '/' && content[index + 1] === '/') {
    const newlineIndex = content.indexOf('\n', index + 2);
    return newlineIndex === -1 ? content.length : newlineIndex;
  }

  if (content[index] === '/' && content[index + 1] === '*') {
    const endIndex = content.indexOf('*/', index + 2);
    if (endIndex === -1) throw new Error('Unterminated comment in OpenCode config');
    return endIndex + 2;
  }

  return index;
}

function findMatchingBracket(content: string, openIndex: number) {
  const open = content[openIndex];
  const close = open === '[' ? ']' : '}';
  let depth = 0;
  let index = openIndex;

  while (index < content.length) {
    const nextIndex = skipComment(content, index);
    if (nextIndex !== index) {
      index = nextIndex;
      continue;
    }

    if (content[index] === '"') {
      index = skipString(content, index);
      continue;
    }

    if (content[index] === open) depth++;
    if (content[index] === close) {
      depth--;
      if (depth === 0) return index;
    }
    index++;
  }

  throw new Error('Unmatched bracket in OpenCode config');
}

function findTopLevelPropertyValue(content: string, propertyName: string) {
  const rootStart = skipWhitespaceAndComments(content, 0);
  if (content[rootStart] !== '{') throw new Error('OpenCode config must be a JSON object');

  let depth = 0;
  let index = rootStart;
  while (index < content.length) {
    const nextIndex = skipComment(content, index);
    if (nextIndex !== index) {
      index = nextIndex;
      continue;
    }

    if (content[index] === '"') {
      const endIndex = skipString(content, index);
      const colonIndex = skipWhitespace(content, endIndex);
      if (
        depth === 1 &&
        content[colonIndex] === ':' &&
        content.slice(index, endIndex) === JSON.stringify(propertyName)
      ) {
        return skipWhitespace(content, colonIndex + 1);
      }

      index = endIndex;
      continue;
    }

    if (content[index] === '{' || content[index] === '[') depth++;
    if (content[index] === '}' || content[index] === ']') depth--;
    index++;
  }

  return undefined;
}

function findOpenCodePluginArray(content: string): JsonRange | undefined {
  const arrayStart = findTopLevelPropertyValue(content, 'plugin');
  if (arrayStart === undefined) return undefined;
  if (content[arrayStart] !== '[') throw new Error('OpenCode plugin must be an array');

  return { start: arrayStart, end: findMatchingBracket(content, arrayStart) };
}

function getLineIndent(content: string, index: number) {
  const lineStart = content.lastIndexOf('\n', index) + 1;
  const match = /^[ \t]*/.exec(content.slice(lineStart));
  return match?.[0] ?? '';
}

function insertOpenCodePlugin(content: string, pluginRange: JsonRange, plugins: string[]) {
  const closingIndent = getLineIndent(content, pluginRange.end);
  const itemIndent = `${closingIndent}  `;

  if (plugins.length === 0) {
    return `${content.slice(0, pluginRange.start + 1)}\n${itemIndent}${JSON.stringify(
      OPENCODE_PLUGIN,
    )}\n${closingIndent}${content.slice(pluginRange.end)}`;
  }

  const beforeClose = content.slice(0, pluginRange.end).trimEnd();
  const separator = beforeClose.endsWith(',') ? '\n' : ',\n';
  return `${beforeClose}${separator}${itemIndent}${JSON.stringify(OPENCODE_PLUGIN)}${content.slice(
    pluginRange.end,
  )}`;
}

function parseOpenCodePluginItems(content: string, pluginRange: JsonRange) {
  const items: Array<{ value: string; start: number; end: number }> = [];
  let index = pluginRange.start + 1;

  while (index < pluginRange.end) {
    const nextIndex = skipComment(content, index);
    if (nextIndex !== index) {
      index = nextIndex;
      continue;
    }

    if (content[index] !== '"') {
      index++;
      continue;
    }

    const endIndex = skipString(content, index);
    const value = JSON.parse(content.slice(index, endIndex)) as string;
    items.push({ value, start: index, end: endIndex });
    index = endIndex;
  }

  return items;
}

function removeArrayRangeItem(content: string, item: JsonRange) {
  let removeStart = item.start;
  let removeEnd = item.end;
  let index = item.end;
  while (isWhitespace(content[index])) index++;

  if (content[index] === ',') {
    removeEnd = index + 1;
    if (content[removeEnd] === '\n') removeEnd++;
    return `${content.slice(0, removeStart)}${content.slice(removeEnd)}`;
  }

  index = item.start - 1;
  while (isWhitespace(content[index])) index--;

  if (content[index] === ',') {
    removeStart = index;
    const lineStart = content.lastIndexOf('\n', removeStart - 1);
    if (lineStart !== -1 && /^\s*$/.test(content.slice(lineStart + 1, removeStart))) {
      removeStart = lineStart;
    }
  }

  return `${content.slice(0, removeStart)}${content.slice(removeEnd)}`;
}

function removeOpenCodePlugin(content: string, pluginRange: JsonRange) {
  return parseOpenCodePluginItems(content, pluginRange)
    .filter((plugin) => isManagedOpenCodePlugin(plugin.value))
    .reverse()
    .reduce((updated, plugin) => removeArrayRangeItem(updated, plugin), content);
}

function findRootObjectClose(content: string) {
  return findMatchingBracket(content, skipWhitespaceAndComments(content, 0));
}

function addOpenCodePluginProperty(content: string, propertyCount: number) {
  const rootClose = findRootObjectClose(content);
  const closingIndent = getLineIndent(content, rootClose);
  const propertyIndent = `${closingIndent}  `;
  const itemIndent = `${propertyIndent}  `;
  const propertyText = `${propertyIndent}"plugin": [\n${itemIndent}${JSON.stringify(OPENCODE_PLUGIN)}\n${propertyIndent}]`;

  if (propertyCount === 0) {
    return `${content.slice(0, rootClose)}${propertyText}\n${closingIndent}${content.slice(rootClose)}`;
  }

  const beforeClose = content.slice(0, rootClose).trimEnd();
  return `${beforeClose},\n${propertyText}\n${closingIndent}${content.slice(rootClose)}`;
}

function parseOpenCodeConfig(content: string, configPath: string) {
  try {
    return JSON.parse(stripJsonComments(content)) as Record<string, unknown>;
  } catch (e) {
    throw new Error(`Failed to parse ${configPath}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function isManagedOpenCodePlugin(plugin: unknown) {
  return (
    typeof plugin === 'string' &&
    (plugin === 'cc-safety-net' || plugin.startsWith('cc-safety-net@'))
  );
}

function readOpenCodeConfig(configPath: string) {
  const content = readFileSync(configPath, 'utf-8');
  const config = parseOpenCodeConfig(content, configPath);
  const plugins = config.plugin;

  if (plugins !== undefined && !Array.isArray(plugins)) {
    throw new Error('OpenCode plugin must be an array');
  }

  return { content, config, plugins };
}

function installOpenCode(): InstallResult {
  const configPath = getOpenCodeConfigPath();
  mkdirSync(dirname(configPath), { recursive: true });

  if (!existsSync(configPath)) {
    writeFileSync(configPath, `${JSON.stringify({ plugin: [OPENCODE_PLUGIN] }, null, 2)}\n`);
    return { path: configPath, alreadyInstalled: false };
  }

  const opencode = readOpenCodeConfig(configPath);

  if (opencode.plugins?.some(isManagedOpenCodePlugin)) {
    return { path: configPath, alreadyInstalled: true };
  }

  if (opencode.plugins === undefined) {
    writeFileSync(
      configPath,
      addOpenCodePluginProperty(opencode.content, Object.keys(opencode.config).length),
    );
    return { path: configPath, alreadyInstalled: false };
  }

  const pluginRange = findOpenCodePluginArray(opencode.content);
  if (!pluginRange) throw new Error('OpenCode plugin property was not found');

  writeFileSync(configPath, insertOpenCodePlugin(opencode.content, pluginRange, opencode.plugins));
  return { path: configPath, alreadyInstalled: false };
}

function uninstallOpenCode(): InstallResult {
  const configPath = getOpenCodeConfigPath();
  if (!existsSync(configPath)) return { path: configPath, alreadyInstalled: false };

  const opencode = readOpenCodeConfig(configPath);

  if (!opencode.plugins?.some(isManagedOpenCodePlugin)) {
    return { path: configPath, alreadyInstalled: false };
  }

  const pluginRange = findOpenCodePluginArray(opencode.content);
  if (!pluginRange) throw new Error('OpenCode plugin property was not found');

  writeFileSync(configPath, removeOpenCodePlugin(opencode.content, pluginRange));
  return { path: configPath, alreadyInstalled: true };
}

function removeTopLevelEmptyHooksArray(content: string) {
  const result = content.split('\n').reduce<{ activeTable: boolean; lines: string[] }>(
    (state, line) => {
      if (/^\s*\[/.test(line)) {
        state.activeTable = true;
        state.lines.push(line);
        return state;
      }

      if (!state.activeTable && /^\s*hooks\s*=\s*\[\s*]\s*(?:#.*)?$/.test(line)) return state;

      state.lines.push(line);
      return state;
    },
    { activeTable: false, lines: [] },
  );

  return result.lines.join('\n');
}

function findTopLevelInlineHooksArray(content: string): JsonRange | undefined {
  let activeTable = false;
  let index = 0;

  while (index < content.length) {
    const lineEnd = content.indexOf('\n', index);
    const end = lineEnd === -1 ? content.length : lineEnd;
    const line = content.slice(index, end);
    if (/^\s*\[/.test(line)) activeTable = true;

    if (!activeTable) {
      const match = /^(\s*)hooks\s*=\s*\[/.exec(line);
      if (match) {
        const arrayStart = index + match[0].lastIndexOf('[');
        return { start: arrayStart, end: findTomlArrayClose(content, arrayStart) };
      }
    }

    index = lineEnd === -1 ? content.length : lineEnd + 1;
  }

  return undefined;
}

function findTomlArrayClose(content: string, openIndex: number) {
  let depth = 0;
  let index = openIndex;

  while (index < content.length) {
    if (content[index] === '#') {
      const newlineIndex = content.indexOf('\n', index + 1);
      index = newlineIndex === -1 ? content.length : newlineIndex + 1;
      continue;
    }

    if (content[index] === '"') {
      index = skipString(content, index);
      continue;
    }

    if (content[index] === '[') depth++;
    if (content[index] === ']') {
      depth--;
      if (depth === 0) return index;
    }
    index++;
  }

  throw new Error('Unmatched hooks array in Kimi CLI config');
}

function appendKimiInlineHook(content: string, hooksRange: JsonRange) {
  const beforeClose = content.slice(0, hooksRange.end).trimEnd();
  const closingIndent = getLineIndent(content, hooksRange.end);
  const itemIndent = closingIndent === '' ? '     ' : `${closingIndent}  `;
  const needsComma = !beforeClose.endsWith('[') && !beforeClose.endsWith(',');

  return `${beforeClose}${needsComma ? ',' : ''}\n${itemIndent}${KIMI_INLINE_HOOK}${content.slice(
    hooksRange.end,
  )}`;
}

function appendKimiHook(content: string) {
  const inlineHooksRange = findTopLevelInlineHooksArray(content);
  if (inlineHooksRange && content.slice(inlineHooksRange.start + 1, inlineHooksRange.end).trim()) {
    return appendKimiInlineHook(content, inlineHooksRange);
  }

  const trimmed = removeTopLevelEmptyHooksArray(content).trimEnd();
  if (trimmed === '') return `${KIMI_HOOK_BLOCK}\n`;
  return `${trimmed}\n\n${KIMI_HOOK_BLOCK}\n`;
}

function removeKimiTableHookBlocks(content: string) {
  const blocks = content.split(/(?=^\s*\[\[hooks]]\s*$)/m);
  return blocks
    .filter((block) => !/^\s*\[\[hooks]]\s*$/m.test(block) || !block.includes(KIMI_HOOK_COMMAND))
    .join('')
    .trimEnd();
}

function removeKimiInlineHook(content: string, hooksRange: JsonRange) {
  const itemStart = content.indexOf(KIMI_INLINE_HOOK, hooksRange.start);
  if (itemStart === -1 || itemStart > hooksRange.end) return content;

  return removeArrayRangeItem(content, {
    start: itemStart,
    end: itemStart + KIMI_INLINE_HOOK.length,
  });
}

function installKimiCli(): InstallResult {
  const configPath = getKimiConfigPath();
  mkdirSync(dirname(configPath), { recursive: true });

  if (!existsSync(configPath)) {
    writeFileSync(configPath, `${KIMI_HOOK_BLOCK}\n`);
    return { path: configPath, alreadyInstalled: false };
  }

  const content = readFileSync(configPath, 'utf-8');
  if (content.includes(KIMI_HOOK_COMMAND)) return { path: configPath, alreadyInstalled: true };

  writeFileSync(configPath, appendKimiHook(content));
  return { path: configPath, alreadyInstalled: false };
}

function uninstallKimiCli(): InstallResult {
  const configPath = getKimiConfigPath();
  if (!existsSync(configPath)) return { path: configPath, alreadyInstalled: false };

  const content = readFileSync(configPath, 'utf-8');
  if (!content.includes(KIMI_HOOK_COMMAND)) return { path: configPath, alreadyInstalled: false };

  const inlineHooksRange = findTopLevelInlineHooksArray(content);
  const updated = inlineHooksRange
    ? removeKimiInlineHook(content, inlineHooksRange)
    : `${removeKimiTableHookBlocks(content)}\n`;

  writeFileSync(configPath, updated);
  return { path: configPath, alreadyInstalled: true };
}

function parseInstallTarget(args: readonly string[], action: HookAction): 'opencode' | 'kimi-cli' {
  const targets = [
    args.includes('--opencode') ? 'opencode' : undefined,
    args.includes('--kimi-cli') ? 'kimi-cli' : undefined,
  ].filter((target): target is 'opencode' | 'kimi-cli' => target !== undefined);
  const unknownOption = args.find(
    (arg) => arg.startsWith('-') && !['--opencode', '--kimi-cli'].includes(arg),
  );

  if (unknownOption) throw new Error(`Unknown install option: ${unknownOption}`);
  const unexpectedArg = args.find((arg) => !arg.startsWith('-'));
  if (unexpectedArg) throw new Error(`Unexpected argument for hook ${action}: ${unexpectedArg}`);
  if (targets.length !== 1)
    throw new Error('Choose exactly one install target: --opencode or --kimi-cli');

  return targets[0] as 'opencode' | 'kimi-cli';
}

export function runHookInstallCommand(action: HookAction, args: readonly string[]): number {
  try {
    const target = parseInstallTarget(args, action);
    const result =
      target === 'opencode'
        ? action === 'install'
          ? installOpenCode()
          : uninstallOpenCode()
        : action === 'install'
          ? installKimiCli()
          : uninstallKimiCli();
    const name = target === 'opencode' ? 'OpenCode' : 'Kimi CLI';
    const pastTense = action === 'install' ? 'Installed' : 'Uninstalled';

    console.log(
      action === 'install' && result.alreadyInstalled
        ? `${name} hook already installed in ${result.path}`
        : action === 'uninstall' && !result.alreadyInstalled
          ? `${name} hook not installed in ${result.path}`
          : `${pastTense} ${name} hook ${action === 'install' ? 'in' : 'from'} ${result.path}`,
    );
    return 0;
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return 1;
  }
}
