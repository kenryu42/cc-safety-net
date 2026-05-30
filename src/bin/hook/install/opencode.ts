import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { stripJsonComments } from '@/bin/doctor/hooks';
import {
  findMatchingBracket,
  getLineIndent,
  removeArrayRangeItem,
  skipJsonComment,
  skipString,
  skipWhitespace,
  skipWhitespaceAndComments,
  type TextRange,
} from '@/bin/hook/config-edit';
import type { InstallResult } from '@/bin/hook/install/types';

const OPENCODE_PLUGIN = 'cc-safety-net@latest';

function getOpenCodeConfigDir(homeDir: string) {
  return (
    process.env.OPENCODE_CONFIG_DIR ??
    join(process.env.XDG_CONFIG_HOME ?? join(homeDir, '.config'), 'opencode')
  );
}

function getOpenCodeConfigPath(homeDir: string) {
  const configDir = getOpenCodeConfigDir(homeDir);
  const candidates = ['opencode.jsonc', 'opencode.json', 'config.json'].map((file) =>
    join(configDir, file),
  );

  return candidates.find((path) => existsSync(path)) ?? join(configDir, 'opencode.jsonc');
}

function findOpenCodeBracket(content: string, openIndex: number) {
  return findMatchingBracket(content, openIndex, {
    skipComment: skipJsonComment,
    stringError: 'Unterminated string in OpenCode config',
    bracketError: 'Unmatched bracket in OpenCode config',
  });
}

function findTopLevelPropertyValue(content: string, propertyName: string) {
  const rootStart = skipWhitespaceAndComments(content, 0);
  if (content[rootStart] !== '{') throw new Error('OpenCode config must be a JSON object');

  let depth = 0;
  let index = rootStart;
  while (index < content.length) {
    const nextIndex = skipJsonComment(content, index);
    if (nextIndex !== index) {
      index = nextIndex;
      continue;
    }

    if (content[index] === '"') {
      const endIndex = skipString(content, index, 'Unterminated string in OpenCode config');
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

function findOpenCodePluginArray(content: string): TextRange | undefined {
  const arrayStart = findTopLevelPropertyValue(content, 'plugin');
  if (arrayStart === undefined) return undefined;
  if (content[arrayStart] !== '[') throw new Error('OpenCode plugin must be an array');

  return { start: arrayStart, end: findOpenCodeBracket(content, arrayStart) };
}

function insertOpenCodePlugin(content: string, pluginRange: TextRange, plugins: string[]) {
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

function parseOpenCodePluginItems(content: string, pluginRange: TextRange) {
  const items: Array<{ value: string; start: number; end: number }> = [];
  let index = pluginRange.start + 1;

  while (index < pluginRange.end) {
    const nextIndex = skipJsonComment(content, index);
    if (nextIndex !== index) {
      index = nextIndex;
      continue;
    }

    if (content[index] !== '"') {
      index++;
      continue;
    }

    const endIndex = skipString(content, index, 'Unterminated string in OpenCode config');
    const value = JSON.parse(content.slice(index, endIndex)) as string;
    items.push({ value, start: index, end: endIndex });
    index = endIndex;
  }

  return items;
}

function removeOpenCodePlugin(content: string, pluginRange: TextRange) {
  return parseOpenCodePluginItems(content, pluginRange)
    .filter((plugin) => isManagedOpenCodePlugin(plugin.value))
    .reverse()
    .reduce((updated, plugin) => removeArrayRangeItem(updated, plugin), content);
}

function findRootObjectClose(content: string) {
  return findOpenCodeBracket(content, skipWhitespaceAndComments(content, 0));
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

export function installOpenCode(homeDir: string): InstallResult {
  const configPath = getOpenCodeConfigPath(homeDir);
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

export function uninstallOpenCode(homeDir: string): InstallResult {
  const configPath = getOpenCodeConfigPath(homeDir);
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
