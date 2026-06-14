import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  findMatchingBracket,
  getLineIndent,
  removeArrayRangeItem,
  type TextRange,
} from '@/bin/hook/config-edit';
import type { InstallResult } from '@/bin/hook/install/types';

const KIMI_HOOK_COMMAND = 'npx -y cc-safety-net hook --kimi-code';
const KIMI_HOOK_BLOCK = `[[hooks]]
event = "PreToolUse"
matcher = "Bash"
command = "${KIMI_HOOK_COMMAND}"`;
const KIMI_INLINE_HOOK = `{ event = "PreToolUse", matcher = "Bash", command = "${KIMI_HOOK_COMMAND}" }`;

function getKimiConfigPath(homeDir: string) {
  return join(process.env.KIMI_CODE_HOME ?? join(homeDir, '.kimi-code'), 'config.toml');
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

function skipTomlComment(content: string, index: number) {
  if (content[index] !== '#') return index;

  const newlineIndex = content.indexOf('\n', index + 1);
  return newlineIndex === -1 ? content.length : newlineIndex + 1;
}

function findTomlArrayClose(content: string, openIndex: number) {
  return findMatchingBracket(content, openIndex, {
    skipComment: skipTomlComment,
    stringError: 'Unterminated string in Kimi Code config',
    bracketError: 'Unmatched hooks array in Kimi Code config',
  });
}

function findTopLevelInlineHooksArray(content: string): TextRange | undefined {
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

function appendKimiInlineHook(content: string, hooksRange: TextRange) {
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

function removeKimiInlineHook(content: string, hooksRange: TextRange) {
  const itemStart = content.indexOf(KIMI_INLINE_HOOK, hooksRange.start);
  if (itemStart === -1 || itemStart > hooksRange.end) return content;

  return removeArrayRangeItem(content, {
    start: itemStart,
    end: itemStart + KIMI_INLINE_HOOK.length,
  });
}

export function installKimiCode(homeDir: string): InstallResult {
  const configPath = getKimiConfigPath(homeDir);
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

export function uninstallKimiCode(homeDir: string): InstallResult {
  const configPath = getKimiConfigPath(homeDir);
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
