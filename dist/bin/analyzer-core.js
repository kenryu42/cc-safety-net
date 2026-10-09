var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toCommonJS = (from) => {
  var entry = (__moduleCache ??= new WeakMap).get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function") {
    for (var key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(entry, key))
        __defProp(entry, key, {
          get: __accessProp.bind(from, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  __moduleCache.set(from, entry);
  return entry;
};
var __moduleCache;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};

// src/bin/analyzer-core.ts
var exports_analyzer_core = {};
__export(exports_analyzer_core, {
  CHECKOUT_SHORT_OPTS_WITH_VALUE: () => CHECKOUT_SHORT_OPTS_WITH_VALUE,
  GIT_CONFIG_AFFECTING_ENV_NAMES: () => GIT_CONFIG_AFFECTING_ENV_NAMES,
  GIT_CONTEXT_ENV_OVERRIDES: () => GIT_CONTEXT_ENV_OVERRIDES,
  GIT_RULE_SUBCOMMANDS: () => GIT_RULE_SUBCOMMANDS,
  REASON_PARALLEL_RM: () => REASON_PARALLEL_RM,
  REASON_PARALLEL_SHELL: () => REASON_PARALLEL_SHELL,
  SWITCH_SHORT_OPTS_WITH_VALUE: () => SWITCH_SHORT_OPTS_WITH_VALUE,
  analyzeChildCommand: () => analyzeChildCommand,
  analyzeCommandInternal: () => analyzeCommandInternal,
  analyzeGitDetailed: () => analyzeGitDetailed,
  analyzeGitMatch: () => analyzeGitMatch,
  analyzeGitRule: () => analyzeGitRule,
  analyzeParallel: () => analyzeParallel,
  analyzeSegment: () => analyzeSegment,
  bindLiteralPositionalParameters: () => bindLiteralPositionalParameters,
  extractEvalSource: () => extractEvalSource,
  extractGitSubcommandAndRest: () => extractGitSubcommandAndRest,
  extractLiteralPrintfOutput: () => extractLiteralPrintfOutput,
  extractParallelChildStart: () => extractParallelChildStart,
  extractPositionalShellSource: () => extractPositionalShellSource,
  extractShellScriptOperandSource: () => extractShellScriptOperandSource,
  extractShellStdinSource: () => extractShellStdinSource,
  extractTrapSource: () => extractTrapSource,
  getGitConfigEntries: () => getGitConfigEntries,
  getGitEnvValue: () => getGitEnvValue,
  getGitExecutionContext: () => getGitExecutionContext,
  getGitTempRootRelaxationForMatch: () => getGitTempRootRelaxationForMatch,
  getGitWorktreeRelaxationForMatch: () => getGitWorktreeRelaxationForMatch,
  hasConfigAffectingEnvAssignment: () => hasConfigAffectingEnvAssignment,
  hasGitCommandLineSshCommandConfig: () => hasGitCommandLineSshCommandConfig,
  hasGitContextEnvOverride: () => hasGitContextEnvOverride,
  hasGitSshEnvAssignment: () => hasGitSshEnvAssignment,
  isGitContextEnvOverrideName: () => isGitContextEnvOverrideName,
  isNonRelaxableLocalDiscard: () => isNonRelaxableLocalDiscard,
  isTrackedGitEnvName: () => isTrackedGitEnvName,
  isVerifiableLocalGeneratorSource: () => isVerifiableLocalGeneratorSource,
  matchesGitLongOption: () => matchesGitLongOption,
  parseGitContextAppendEnvAssignment: () => parseGitContextAppendEnvAssignment,
  quoteShellWord: () => quoteShellWord,
  resolveCwdAfterCommandView: () => resolveCwdAfterCommandView,
  resolveGitCommandLineAliases: () => resolveGitCommandLineAliases,
  resolveGitConfigCount: () => resolveGitConfigCount,
  shellSourceHasDynamicExecutionCarrier: () => shellSourceHasDynamicExecutionCarrier,
  shellSourceHasUnresolvedDynamicExecutionCarrier: () => shellSourceHasUnresolvedDynamicExecutionCarrier,
  splitAtDoubleDash: () => splitAtDoubleDash
});
module.exports = __toCommonJS(exports_analyzer_core);

// src/gate/analyzer/git/env.ts
var import_worktree = require("./core.js");
var GIT_CONTEXT_ENV_OVERRIDES = [
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_COMMON_DIR",
  "GIT_INDEX_FILE"
];
var GIT_CONTEXT_ENV_OVERRIDE_NAMES = new Set(GIT_CONTEXT_ENV_OVERRIDES);
var MAX_GIT_CONFIG_COUNT = 1024;
var GIT_CONFIG_AFFECTING_ENV_NAMES = new Set([
  "GIT_CONFIG_GLOBAL",
  "GIT_CONFIG_NOSYSTEM",
  "GIT_CONFIG_SYSTEM",
  "HOME",
  "XDG_CONFIG_HOME"
]);
var GIT_SSH_ENV_NAMES = new Set([
  "GIT_SSH_COMMAND",
  "GIT_SSH",
  "GIT_SSH_VARIANT"
]);
var GIT_CONTEXT_APPEND_ASSIGNMENT_RE = /^([A-Za-z_][A-Za-z0-9_]*)\+=/;
function isGitContextEnvOverrideName(name) {
  return GIT_CONTEXT_ENV_OVERRIDE_NAMES.has(name);
}
function isTrackedGitEnvName(name) {
  return isGitContextEnvOverrideName(name) || GIT_CONFIG_AFFECTING_ENV_NAMES.has(name) || GIT_SSH_ENV_NAMES.has(name) || import_worktree.isGitConfigEnvName(name);
}
function getGitEnvValue(name, env, envAssignments) {
  return envAssignments?.has(name) ? envAssignments.get(name) : env.get(name);
}
function resolveGitConfigCount(env, envAssignments) {
  const value = getGitEnvValue("GIT_CONFIG_COUNT", env, envAssignments);
  if (value === undefined) {
    return { state: "absent" };
  }
  if (value === "") {
    return { state: "valid", count: 0 };
  }
  if (!/^\d+$/.test(value)) {
    return { state: "invalid" };
  }
  const count = Number(value);
  return Number.isSafeInteger(count) && count <= MAX_GIT_CONFIG_COUNT ? { state: "valid", count } : { state: "invalid" };
}
function parseGitContextAppendEnvAssignment(token, env, envAssignments) {
  const match = token.match(GIT_CONTEXT_APPEND_ASSIGNMENT_RE);
  const name = match?.[1];
  if (!name || !isTrackedGitEnvName(name)) {
    return null;
  }
  const eqIdx = token.indexOf("=");
  return {
    name,
    value: `${getGitEnvValue(name, env, envAssignments) ?? ""}${token.slice(eqIdx + 1)}`
  };
}
function hasGitSshEnvAssignment(envAssignments) {
  return hasAnyEnvAssignment(envAssignments, GIT_SSH_ENV_NAMES);
}
function hasConfigAffectingEnvAssignment(envAssignments) {
  return hasAnyEnvAssignment(envAssignments, GIT_CONFIG_AFFECTING_ENV_NAMES);
}
function hasAnyEnvAssignment(envAssignments, names) {
  if (!envAssignments) {
    return false;
  }
  for (const key of envAssignments.keys()) {
    if (names.has(key)) {
      return true;
    }
  }
  return false;
}
// src/gate/analyzer/shell-execution.ts
var import_constants = require("./core-shell.js");
var import_parse = require("./core-shell.js");
var import_tokens = require("./core-shell.js");
var import_command_words = require("./analyzer.js");
var import_shell_git_env = require("./analyzer.js");
var import_transparent_wrappers = require("./analyzer.js");
var import_wrapper_prelude = require("./analyzer.js");
var NO_SOURCE = { kind: "none" };
var DYNAMIC_SOURCE = { kind: "dynamic" };
var INPUT_REDIRECTIONS = new Set(["<", "<<", "<<-", "<<<", "<&", "<>"]);
var SHELL_PARAMETER_RE = /\$(?:([0-9]+|[@*]|[A-Za-z_][A-Za-z0-9_]*)|\{!?([0-9]+|[@*]|[A-Za-z_][A-Za-z0-9_]*))/g;
var POSITIONAL_SHELL_PARAMETER_RE = /^(?:[0-9]+|[@*])$/;
var MAX_POSITIONAL_EXPANSION_WORDS = import_parse.DEFAULT_COMMAND_PARSER_LIMITS.maxWords;
var MAX_POSITIONAL_EXPANSION_CHARACTERS = import_parse.DEFAULT_COMMAND_PARSER_LIMITS.maxInputLength;
function extractLiteralPrintfOutput(command) {
  if (!command || import_tokens.getBasename(import_tokens.normalizeCommandToken(command.words[0]?.text ?? "")) !== "printf") {
    return;
  }
  if (command.words.some((word) => word.provenance !== "literal"))
    return;
  const args = command.words.slice(command.words[1]?.text === "--" ? 2 : 1);
  const format = args[0]?.text;
  if (format === undefined)
    return "";
  const values = args.slice(1).map((word) => word.text);
  if (format === "%s")
    return values.join("");
  if (format === "%s\\n" || format === `%s
`)
    return `${values.join(`
`)}
`;
  if (format.includes("%") || /\\(?![\\nrt])/.test(format))
    return;
  return format.replaceAll("\\n", `
`).replaceAll("\\r", "\r").replaceAll("\\t", "\t").replaceAll("\\\\", "\\");
}
function extractEvalSource(words) {
  const start = wordText(words[1]) === "--" ? 2 : 1;
  if (words.length <= start)
    return NO_SOURCE;
  const args = words.slice(start);
  if (!args.every(isLiteralWord))
    return DYNAMIC_SOURCE;
  return { kind: "literal", source: args.map(import_command_words.analysisWordText).join(" ") };
}
function extractTrapSource(words) {
  const actionIndex = wordText(words[1]) === "--" ? 2 : 1;
  const action = words[actionIndex];
  const source = wordText(action);
  if (action === undefined || words.length <= actionIndex + 1 || source === "-" || source === "" || source === "-l" || source === "-p") {
    return NO_SOURCE;
  }
  if (!isLiteralWord(action))
    return DYNAMIC_SOURCE;
  return { kind: "literal", source };
}
function extractPositionalShellSource(words, script) {
  const scriptIndex = findShellScriptIndex(words);
  if (scriptIndex === -1)
    return NO_SOURCE;
  const carrier = parsePositionalCarrier(script);
  if (!carrier)
    return NO_SOURCE;
  const expanded = [];
  let expandedCharacters = carrier.command?.length ?? 0;
  for (const reference of carrier.references) {
    const values = expandPositionalReference(reference, words, scriptIndex, carrier.ifs);
    if (!values)
      return DYNAMIC_SOURCE;
    expandedCharacters += values.reduce((total, value) => total + value.length + 3, 0);
    if (expanded.length + values.length > MAX_POSITIONAL_EXPANSION_WORDS || expandedCharacters > MAX_POSITIONAL_EXPANSION_CHARACTERS) {
      return DYNAMIC_SOURCE;
    }
    expanded.push(...values);
  }
  if (carrier.command === "eval") {
    return { kind: "literal", source: expanded.join(" ") };
  }
  if (expanded.length === 0 || /\s/.test(expanded[0] ?? "")) {
    return { kind: "literal", source: "" };
  }
  return {
    kind: "literal",
    source: [
      carrier.command,
      carrier.command && carrier.optionTerminator ? "--" : null,
      ...expanded.map(quoteShellWord)
    ].filter((value) => value !== null).join(" ")
  };
}
function bindLiteralPositionalParameters(words, script) {
  const scriptIndex = findShellScriptIndex(words);
  const values = words.slice(scriptIndex + 1);
  const bodyCanChangeFieldSplitting = /\bIFS\b/.test(script);
  if (scriptIndex === -1 || !values.every(isLiteralWord) || bodyCanChangeFieldSplitting) {
    return script;
  }
  const texts = values.map(wordText);
  let bound = "";
  let quote = null;
  let index = 0;
  while (index < script.length) {
    const char = script[index] ?? "";
    const reference = quote === "'" ? null : /^\$(?:\{([0-9]+|[@*])\}|([0-9@*]))/.exec(script.slice(index));
    if (reference) {
      const parameter = reference[1] ?? reference[2];
      const fields = parameter === "@" || parameter === "*" ? texts.slice(1) : [texts[Number(parameter)] ?? ""];
      const unquotedValueWouldGlob = quote !== '"' && fields.some((field) => /[*?[]/.test(field));
      if (unquotedValueWouldGlob)
        return script;
      bound += quote === '"' ? fields.map((field) => field.replace(/["$`\\]/g, "\\$&")).join(parameter === "@" ? '" "' : " ") : fields.map((field) => field.split(/[ \t\n]+/).map((part) => part ? quoteShellWord(part) : "").join(" ")).join(" ");
      if (bound.length > MAX_POSITIONAL_EXPANSION_CHARACTERS)
        return script;
      index += reference[0].length;
      continue;
    }
    if (char === "\\" && quote !== "'") {
      bound += script.slice(index, index + 2);
      index += 2;
      continue;
    }
    if (char === "'" && quote !== '"' || char === '"' && quote !== "'") {
      quote = quote ? null : char;
    }
    bound += char;
    index++;
  }
  return bound;
}
function extractShellStdinSource(words, redirections, hasPipelineInput, literalPipelineInput) {
  if (!import_tokens.parseShellArgv(words.map(import_command_words.analysisWordText)).readsStdinAsCommands)
    return NO_SOURCE;
  const input = redirections.filter((redirection) => (redirection.fd === undefined || redirection.fd === 0) && INPUT_REDIRECTIONS.has(redirection.operator)).at(-1);
  if (input) {
    if (input.operator === "<<" || input.operator === "<<-")
      return NO_SOURCE;
    if (input.operator !== "<<<" || input.target?.provenance !== "literal") {
      return DYNAMIC_SOURCE;
    }
    return { kind: "literal", source: input.target.text };
  }
  if (!hasPipelineInput)
    return NO_SOURCE;
  return literalPipelineInput === undefined ? DYNAMIC_SOURCE : { kind: "literal", source: literalPipelineInput };
}
function extractShellScriptOperandSource(words, shellAssignments = new Map) {
  const scriptIndex = import_tokens.parseShellArgv(words.map(import_command_words.analysisWordText)).scriptIndex;
  if (scriptIndex === null)
    return NO_SOURCE;
  const word = words[scriptIndex];
  const source = wordText(word);
  if (import_command_words.isLiteralExecutionSourceWord(word, source))
    return { kind: "literal", source };
  const expanded = word ? import_shell_git_env.expandKnownVariableWord(word, shellAssignments) : null;
  return expanded === null ? DYNAMIC_SOURCE : { kind: "literal", source: expanded };
}
var REMOTE_FETCHERS = new Set([
  "curl",
  "wget",
  "fetch",
  "aria2c",
  "http",
  "https",
  "xh",
  "xhs",
  "nc",
  "ncat",
  "netcat"
]);
function isVerifiableLocalGeneratorSource(command) {
  if (command.words.length !== 2 || command.redirections.length !== 0 || command.nested.length !== 1) {
    return false;
  }
  const head = command.words[0];
  const operand = command.words[1];
  if (!head || head.provenance !== "literal" || head.quoted || head.raw !== head.text || !operand) {
    return false;
  }
  const hasExactOuterForm = head.text === "eval" && operand.quoted && operand.parts.length === 3 && operand.parts[0]?.raw === '"' && operand.parts[1]?.provenance === "command-substitution" && operand.parts[1].raw.startsWith("$(") && operand.parts[2]?.raw === '"' || head.text === "eval" && !operand.quoted && operand.parts.length === 1 && operand.parts[0]?.provenance === "command-substitution" && operand.parts[0].raw.startsWith("$(") || (head.text === "source" || head.text === ".") && !operand.quoted && operand.parts.length === 1 && operand.parts[0]?.provenance === "command-substitution" && operand.parts[0].raw.startsWith("<(");
  if (!hasExactOuterForm)
    return false;
  const program = command.nested[0];
  if (program?.status !== "complete" || program.nodes.length !== 1)
    return false;
  const inner = program.nodes[0];
  if (inner?.kind !== "command" || inner.redirections.length !== 0 || inner.nested.length !== 0 || inner.words.some((word) => word.provenance !== "literal" || word.parts.some((part) => part.provenance !== "literal"))) {
    return false;
  }
  const innerHead = inner.words[0]?.text;
  if (innerHead === undefined || import_wrapper_prelude.parseEnvAssignment(innerHead) !== null)
    return false;
  const basename = import_tokens.getBasename(import_tokens.normalizeCommandToken(innerHead));
  return !REMOTE_FETCHERS.has(basename) && !import_constants.SHELL_WRAPPERS.has(basename) && !import_transparent_wrappers.isStandardCommandWrapper(basename);
}
function findShellScriptIndex(words) {
  return import_tokens.parseShellArgv(words.map(import_command_words.analysisWordText)).commandIndex ?? -1;
}
function parsePositionalCarrier(script) {
  const ifsAssignment = /^IFS=(?:'([^']*)'|"([^"]*)"|([^;\s]*))\s*;\s*(.+)$/.exec(script.trim());
  const source = ifsAssignment?.[4] ?? script.trim();
  const command = /^(\.|bash|command|dash|exec|eval|ksh|sh|source|zsh)(?:\s+(--))?\s+(.+)$/.exec(source);
  const references = (command?.[3] ?? source).split(/\s+/).map(parsePositionalReference);
  if (references.length === 0 || references.some((reference) => reference === null))
    return null;
  return {
    command: command?.[1] ?? null,
    optionTerminator: command?.[2] !== undefined,
    references: references.filter((reference) => !!reference),
    ifs: ifsAssignment ? ifsAssignment[1] ?? ifsAssignment[2] ?? ifsAssignment[3] ?? "" : ` 	
`
  };
}
function parsePositionalReference(value) {
  const quoted = /^"\$(?:([0-9]+|[@*])|\{([0-9]+|[@*])\})"$/.exec(value);
  const unquoted = /^\$(?:([0-9]+|[@*])|\{([0-9]+|[@*])\})$/.exec(value);
  const match = quoted ?? unquoted;
  if (!match)
    return null;
  const parameter = match[1] ?? match[2];
  return {
    parameter: parameter === "@" || parameter === "*" ? parameter : Number(parameter),
    quoted: quoted !== null
  };
}
function expandPositionalReference(reference, words, scriptIndex, ifs) {
  const positional = words.slice(scriptIndex + 2);
  if (reference.parameter === "@") {
    return reference.quoted ? literalPositionalValues(positional) : splitLiteralPositionalValues(positional, ifs);
  }
  if (reference.parameter === "*") {
    const values = literalPositionalValues(positional);
    if (!values)
      return;
    const joined = values.join(ifs[0] ?? "");
    return reference.quoted ? [joined] : splitLiteralShellFields(joined, ifs);
  }
  const word = words[scriptIndex + 1 + reference.parameter];
  if (word && !isLiteralWord(word))
    return;
  const value = wordText(word);
  return reference.quoted ? [value] : splitLiteralShellFields(value, ifs);
}
function literalPositionalValues(words) {
  return words.every(isLiteralWord) ? words.map(import_command_words.analysisWordText) : undefined;
}
function splitLiteralPositionalValues(words, ifs) {
  const literal = literalPositionalValues(words);
  if (!literal)
    return;
  const fields = literal.map((value) => splitLiteralShellFields(value, ifs));
  return fields.some((value) => value === undefined) ? undefined : fields.flatMap((value) => value ?? []);
}
function splitLiteralShellFields(value, ifs) {
  if (["*", "?", "[", "]"].some((character) => value.includes(character)))
    return;
  if (ifs === "")
    return value === "" ? [] : [value];
  if (ifs === ` 	
`)
    return value.trim().split(/\s+/).filter(Boolean);
  if (ifs.length !== 1)
    return;
  return ifs === " " || ifs === "\t" || ifs === `
` ? value.trim().split(/\s+/).filter(Boolean) : value.split(ifs).filter(Boolean);
}
function isLiteralWord(word) {
  if (!word)
    return true;
  return word.provenance === "unknown" ? !/[$`]/.test(import_command_words.analysisWordText(word)) : word.provenance === "literal";
}
function wordText(word) {
  return word ? import_command_words.analysisWordText(word) : "";
}
function quoteShellWord(value) {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}
function shellSourceHasDynamicExecutionCarrier(source, dynamicEnvNames) {
  return programHasDynamicExecutionCarrier(import_parse.parseCommand(source, "posix"), dynamicEnvNames);
}
function shellSourceHasUnresolvedDynamicExecutionCarrier(source) {
  return shellSourceHasDynamicExecutionCarrier(source, new Set(Array.from(source.matchAll(SHELL_PARAMETER_RE)).flatMap((match) => {
    const parameter = match[1] ?? match[2];
    return parameter === undefined ? [] : [parameter];
  })));
}
function programHasDynamicExecutionCarrier(program, inheritedDynamicNames) {
  if (program.status === "invalid" || program.status === "limited")
    return false;
  const dynamicNames = new Set(inheritedDynamicNames);
  for (const node of program.nodes) {
    if (node.kind === "group") {
      if (programHasDynamicExecutionCarrier(node.body, dynamicNames))
        return true;
      continue;
    }
    if (node.kind !== "command")
      continue;
    if (node.nested.some((nested) => programHasDynamicExecutionCarrier(nested, dynamicNames)) || wordsHaveDynamicExecutionCarrier(node.words, dynamicNames)) {
      return true;
    }
    updateDynamicAssignments(node, dynamicNames);
  }
  return false;
}
function wordsHaveDynamicExecutionCarrier(words, dynamicNames) {
  const headIndex = words.findIndex((word) => import_wrapper_prelude.parseEnvAssignment(word.text) === null);
  if (headIndex === -1)
    return false;
  const head = words[headIndex];
  if (!head)
    return false;
  if (wordReferencesDynamicInput(head, dynamicNames))
    return true;
  const normalizedHead = import_tokens.normalizeCommandToken(head.text);
  if (normalizedHead === "source" || normalizedHead === ".") {
    const operandIndex = words[headIndex + 1]?.text === "--" ? headIndex + 2 : headIndex + 1;
    return wordSuppliesDynamicExecutionSource(words[operandIndex], dynamicNames);
  }
  if (import_constants.SHELL_WRAPPERS.has(normalizedHead)) {
    const shellWords = words.slice(headIndex);
    const parsed = import_tokens.parseShellArgv(shellWords.map((word) => word.text));
    const sourceIndex = parsed.commandIndex ?? parsed.scriptIndex;
    return !parsed.syntaxCheck && sourceIndex !== null && wordSuppliesDynamicExecutionSource(shellWords[sourceIndex], dynamicNames);
  }
  const carrierIndex = findCarrierCommandIndex(words, headIndex, dynamicNames);
  if (carrierIndex === null)
    return false;
  if (carrierIndex === -1)
    return true;
  return wordsHaveDynamicExecutionCarrier(words.slice(carrierIndex), dynamicNames);
}
function findCarrierCommandIndex(words, headIndex, dynamicNames) {
  const head = import_tokens.normalizeCommandToken(words[headIndex]?.text ?? "");
  if (head === "command")
    return findCommandBuiltinCommandIndex(words, headIndex + 1);
  if (head === "exec")
    return findExecCommandIndex(words, headIndex + 1);
  if (head === "env")
    return findEnvCommandIndex(words, headIndex + 1, dynamicNames);
  return null;
}
function findCommandBuiltinCommandIndex(words, start) {
  for (let index = start;index < words.length; index++) {
    const token = words[index]?.text ?? "";
    if (token === "--")
      return words[index + 1] ? index + 1 : null;
    if (/^-[p]*[vV][pvV]*$/.test(token))
      return null;
    if (/^-p+$/.test(token))
      continue;
    return index;
  }
  return null;
}
function findExecCommandIndex(words, start) {
  for (let index = start;index < words.length; index++) {
    const token = words[index]?.text ?? "";
    if (token === "--")
      return words[index + 1] ? index + 1 : null;
    if (token === "-a") {
      index++;
      continue;
    }
    if (/^-a.+/.test(token) || /^-[cl]+$/.test(token))
      continue;
    return index;
  }
  return null;
}
function findEnvCommandIndex(words, start, dynamicNames) {
  for (let index = start;index < words.length; index++) {
    const word = words[index];
    const token = word?.text ?? "";
    if (token === "--")
      return words[index + 1] ? index + 1 : null;
    if (token === "-S" || token === "--split-string") {
      return wordReferencesDynamicInput(words[index + 1], dynamicNames) ? -1 : index + 2;
    }
    if (token.startsWith("-S") || token.startsWith("--split-string=")) {
      return wordReferencesDynamicInput(word, dynamicNames) ? -1 : index + 1;
    }
    if (token === "-u" || token === "--unset" || token === "-C" || token === "--chdir" || token === "-P") {
      index++;
      continue;
    }
    if (token === "-i" || token === "-0" || token === "--null" || token.startsWith("-u=") || token.startsWith("--unset=") || token.startsWith("-C") || token.startsWith("--chdir=") || token.startsWith("-P")) {
      continue;
    }
    if (token.startsWith("-"))
      continue;
    if (import_wrapper_prelude.parseEnvAssignment(token))
      continue;
    return index;
  }
  return null;
}
function updateDynamicAssignments(command, dynamicNames) {
  if (!command.words.every((word) => import_wrapper_prelude.parseEnvAssignment(word.text) !== null))
    return;
  for (const word of command.words) {
    const assignment = import_wrapper_prelude.parseEnvAssignment(word.text);
    if (!assignment)
      continue;
    if (wordReferencesDynamicInput(word, dynamicNames)) {
      dynamicNames.add(assignment.name);
    }
  }
}
function wordReferencesDynamicInput(word, dynamicNames) {
  if (!word)
    return false;
  return word.parts.filter((part) => part.provenance === "variable").some((part) => Array.from(part.raw.matchAll(SHELL_PARAMETER_RE)).some((match) => {
    const parameter = match[1] ?? match[2];
    return parameter !== undefined && (POSITIONAL_SHELL_PARAMETER_RE.test(parameter) || dynamicNames.has(parameter));
  }));
}
function wordSuppliesDynamicExecutionSource(word, dynamicNames) {
  return !!word && (word.parts.some((part) => part.provenance !== "literal" && part.provenance !== "variable") || wordReferencesDynamicInput(word, dynamicNames));
}
// src/gate/analyzer/git/rules.ts
var import_destructive = require("./core-shell.js");
var import_tokens3 = require("./core-shell.js");

// src/gate/analyzer/git/parse.ts
var import_constants2 = require("./core-shell.js");
var import_tokens2 = require("./core-shell.js");
var import_traversal = require("./core-shell.js");
var MAX_GIT_ALIAS_EXPANSION_DEPTH = 5;
var REASON_GIT_ALIAS_CONFIG = "Git aliases supplied through command-line or environment config can hide or execute commands. Run git without Git alias overrides, or ask the user to run it manually.";
function splitAtDoubleDash(tokens) {
  const index = tokens.indexOf("--");
  if (index === -1) {
    return { index: -1, before: tokens, after: [] };
  }
  return {
    index,
    before: tokens.slice(0, index),
    after: tokens.slice(index + 1)
  };
}
function resolveGitCommandLineAliases(tokens, env, envAssignments) {
  const configEntries = getGitConfigEntries(tokens, env, envAssignments);
  const aliases = getGitConfigAliases(configEntries.entries);
  if (aliases.size === 0) {
    return { blockedReason: configEntries.blockedReason, expanded: false, tokens };
  }
  let currentTokens = tokens;
  let expanded = false;
  for (let depth = 0;depth < MAX_GIT_ALIAS_EXPANSION_DEPTH; depth++) {
    const { subcommand, rest } = extractGitSubcommandAndRest(currentTokens);
    const aliasName = subcommand?.toLowerCase();
    if (!aliasName || !aliases.has(aliasName)) {
      return { blockedReason: configEntries.blockedReason, expanded, tokens: currentTokens };
    }
    const aliasValue = aliases.get(aliasName);
    const aliasTokens = parseGitAliasValue(aliasValue);
    if (aliasTokens === null || aliasTokens.length === 0) {
      return { blockedReason: REASON_GIT_ALIAS_CONFIG, expanded: true, tokens: currentTokens };
    }
    currentTokens = ["git", ...aliasTokens, ...rest];
    expanded = true;
  }
  return { blockedReason: REASON_GIT_ALIAS_CONFIG, expanded: true, tokens: currentTokens };
}
function hasGitCommandLineSshCommandConfig(tokens, env, envAssignments) {
  return getGitConfigEntries(tokens, env, envAssignments).entries.some((entry) => entry.key.toLowerCase() === "core.sshcommand");
}
function extractGitSubcommandAndRest(tokens) {
  if (tokens.length === 0) {
    return { subcommand: null, rest: [] };
  }
  const firstToken = tokens[0];
  const command = firstToken ? import_tokens2.getBasename(firstToken).toLowerCase() : null;
  if (command !== "git") {
    return { subcommand: null, rest: [] };
  }
  let i = 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token)
      break;
    if (token === "--") {
      const nextToken = tokens[i + 1];
      if (nextToken && !nextToken.startsWith("-")) {
        return { subcommand: nextToken, rest: tokens.slice(i + 2) };
      }
      return { subcommand: null, rest: tokens.slice(i + 1) };
    }
    if (!token.startsWith("-")) {
      return { subcommand: token, rest: tokens.slice(i + 1) };
    }
    i += import_constants2.GIT_GLOBAL_OPTS_WITH_VALUE.has(token) ? 2 : 1;
  }
  return { subcommand: null, rest: [] };
}
function getGitConfigAliases(entries) {
  const aliases = new Map;
  for (const entry of entries) {
    const key = entry.key.toLowerCase();
    if (!key.startsWith("alias.")) {
      continue;
    }
    const name = key.slice("alias.".length);
    if (name !== "") {
      aliases.set(name, entry.value);
    }
  }
  return aliases;
}
function getGitConfigEntries(tokens, env, envAssignments) {
  if (tokens.length === 0) {
    return { blockedReason: null, entries: [] };
  }
  const firstToken = tokens[0];
  const command = firstToken ? import_tokens2.getBasename(firstToken).toLowerCase() : null;
  if (command !== "git") {
    return { blockedReason: null, entries: [] };
  }
  const envEntries = getGitEnvConfigEntries(env, envAssignments);
  return {
    blockedReason: envEntries.blockedReason,
    entries: [
      ...envEntries.entries,
      ...getGitCommandLineConfigEntries(tokens, env, envAssignments)
    ]
  };
}
function getGitCommandLineConfigEntries(tokens, env, envAssignments) {
  const entries = [];
  let i = 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token || token === "--" || !token.startsWith("-")) {
      return entries;
    }
    if (token === "-c") {
      const entry = parseGitConfigEntry(tokens[i + 1]);
      if (entry) {
        entries.push(entry);
      }
      i += 2;
      continue;
    }
    if (token.startsWith("-c") && token.length > 2) {
      const entry = parseGitConfigEntry(token.slice(2));
      if (entry) {
        entries.push(entry);
      }
      i++;
      continue;
    }
    if (token === "--config-env") {
      const entry = parseGitConfigEnvEntry(tokens[i + 1], env, envAssignments);
      if (entry) {
        entries.push(entry);
      }
      i += 2;
      continue;
    }
    if (token.startsWith("--config-env=")) {
      const entry = parseGitConfigEnvEntry(token.slice("--config-env=".length), env, envAssignments);
      if (entry) {
        entries.push(entry);
      }
      i++;
      continue;
    }
    if (import_constants2.GIT_GLOBAL_OPTS_WITH_VALUE.has(token)) {
      i += 2;
      continue;
    }
    i++;
  }
  return entries;
}
function getGitEnvConfigEntries(env, envAssignments) {
  const parameterEntries = getGitConfigParameterEntries(env, envAssignments);
  const countEntries = getGitConfigCountEntries(env, envAssignments);
  return {
    blockedReason: parameterEntries === null || countEntries === null ? REASON_GIT_ALIAS_CONFIG : null,
    entries: [...parameterEntries ?? [], ...countEntries ?? []]
  };
}
function getGitConfigParameterEntries(env, envAssignments) {
  const parameters = getGitEnvValue("GIT_CONFIG_PARAMETERS", env, envAssignments);
  if (parameters === undefined) {
    return [];
  }
  const entries = [];
  const parsed = import_traversal.parseSimpleWords(parameters);
  if (!parsed)
    return null;
  for (const token of parsed) {
    const configEntry = parseGitConfigEntry(token);
    if (!configEntry) {
      return null;
    }
    entries.push(configEntry);
  }
  return entries;
}
function getGitConfigCountEntries(env, envAssignments) {
  const resolution = resolveGitConfigCount(env, envAssignments);
  if (resolution.state === "absent") {
    return [];
  }
  if (resolution.state === "invalid") {
    return null;
  }
  const entries = [];
  for (let i = 0;i < resolution.count; i++) {
    const key = getGitEnvValue(`GIT_CONFIG_KEY_${i}`, env, envAssignments)?.trim();
    const value = getGitEnvValue(`GIT_CONFIG_VALUE_${i}`, env, envAssignments);
    if (!key || value === undefined) {
      return null;
    }
    entries.push({ key, value });
  }
  return entries;
}
function parseGitConfigEntry(config) {
  if (!config) {
    return null;
  }
  const eqIdx = config.indexOf("=");
  return {
    key: (eqIdx === -1 ? config : config.slice(0, eqIdx)).trim(),
    value: eqIdx === -1 ? undefined : config.slice(eqIdx + 1)
  };
}
function parseGitConfigEnvEntry(configEnv, env, envAssignments) {
  const eqIdx = configEnv?.indexOf("=") ?? -1;
  if (!configEnv || eqIdx === -1) {
    return null;
  }
  return {
    key: configEnv.slice(0, eqIdx).trim(),
    value: getGitEnvValue(configEnv.slice(eqIdx + 1), env, envAssignments)
  };
}
function parseGitAliasValue(value) {
  const trimmedValue = value?.trimStart();
  if (!trimmedValue || trimmedValue.startsWith("!")) {
    return null;
  }
  return import_traversal.parseSimpleWords(trimmedValue);
}

// src/gate/analyzer/git/rules.ts
var REASON_CHECKOUT_DOUBLE_DASH = "git checkout -- discards uncommitted changes permanently. Use 'git stash' first.";
var REASON_CHECKOUT_PATH = "git checkout <path> discards uncommitted changes permanently. Use 'git stash' first, or 'git switch' to change branches.";
var REASON_CHECKOUT_FORCE = "git checkout --force discards uncommitted changes. Use 'git stash' first.";
var REASON_CHECKOUT_REF_PATH = "git checkout <ref> -- <path> overwrites working tree with ref version. Use 'git stash' first.";
var REASON_CHECKOUT_PATHSPEC_FROM_FILE = "git checkout --pathspec-from-file can overwrite multiple files. Use 'git stash' first.";
var REASON_CHECKOUT_AMBIGUOUS = "git checkout with multiple positional args may overwrite files. Use 'git switch' for branches or 'git restore' for files.";
var REASON_SWITCH_DISCARD_CHANGES = "git switch --discard-changes discards uncommitted changes. Use 'git stash' first.";
var REASON_SWITCH_FORCE = "git switch --force discards uncommitted changes. Use 'git stash' first.";
var REASON_RESTORE = "git restore discards uncommitted changes. Use 'git stash' first, or use --staged to only unstage.";
var REASON_RESTORE_WORKTREE = "git restore --worktree explicitly discards working tree changes. Use 'git stash' first.";
var REASON_RESET_HARD = "git reset --hard destroys all uncommitted changes permanently. Use 'git stash' first.";
var REASON_RESET_MERGE = "git reset --merge can lose uncommitted changes. Use 'git stash' first.";
var REASON_CLEAN = "git clean -f removes untracked files permanently. Use 'git clean -n' to preview first.";
var REASON_RM_FORCE = "git rm --force removes tracked files from the working tree. Use 'git rm --cached' to keep the files, or 'git rm --dry-run' to preview first.";
var REASON_PUSH_FORCE = "git push --force destroys remote history. Use --force-with-lease for safer force push.";
var REASON_PUSH_DELETE = "git push deletes remote refs. Ask the user to run it manually if deletion is intended.";
var REASON_PUSH_MIRROR = "git push " + "--mirror can force-update and delete remote refs. Ask the user to run it manually if mirror push is intended.";
var REASON_BRANCH_DELETE = "git branch -D force-deletes without merge check. Use -d for safe delete.";
var REASON_REBASE_ABORT = "git rebase --abort discards rebase conflict resolutions. Use 'git status' first.";
var REASON_MERGE_ABORT = "git merge --abort discards merge conflict resolutions. Use 'git status' first.";
var REASON_TAG_DELETE = "git tag -d permanently deletes tags. Ask the user to run it manually if deletion is intended.";
var REASON_REFLOG_DELETE = "git reflog delete removes recovery history. Ask the user to run it manually if deletion is intended.";
var REASON_STASH_DROP = "git stash drop permanently deletes stashed changes. Consider 'git stash list' first.";
var REASON_STASH_CLEAR = "git stash clear deletes ALL stashed changes permanently. Use 'git stash list' to review; ask the user to run it manually if intended.";
var REASON_WORKTREE_REMOVE_FORCE = "git worktree remove --force can delete uncommitted changes. Remove --force flag.";
var CHECKOUT_OPTS_WITH_VALUE = new Set([
  "-b",
  "-B",
  "--orphan",
  "--conflict",
  "--inter-hunk-context",
  "--pathspec-from-file",
  "--unified"
]);
var CHECKOUT_OPTS_WITH_OPTIONAL_VALUE = new Set(["--recurse-submodules", "--track", "-t"]);
var CHECKOUT_SHORT_OPTS_WITH_VALUE = new Set(["-b", "-B", "-U"]);
var SWITCH_SHORT_OPTS_WITH_VALUE = new Set(["-c", "-C"]);
var RESTORE_OPTS_WITH_VALUE = new Set([
  "--source",
  "--conflict",
  "--unified",
  "--inter-hunk-context"
]);
function matchesGitLongOption(token, option) {
  const optionName = token.split("=", 1)[0] ?? token;
  return optionName.length >= 4 && option.startsWith(optionName) && optionName.startsWith("--") && optionName.slice(2).length >= 2;
}
var GIT_RULE_SUBCOMMANDS = new Set([
  "branch",
  "checkout",
  "clean",
  "merge",
  "push",
  "rebase",
  "reflog",
  "reset",
  "restore",
  "rm",
  "stash",
  "switch",
  "tag",
  "worktree"
]);
function analyzeGitRule(tokens, isCheckoutPath) {
  const { subcommand, rest } = extractGitSubcommandAndRest(tokens);
  if (!subcommand) {
    return null;
  }
  switch (subcommand.toLowerCase()) {
    case "checkout":
      return localDiscard(analyzeGitCheckout(rest, isCheckoutPath));
    case "switch":
      return localDiscard(analyzeGitSwitch(rest));
    case "restore":
      return localDiscard(analyzeGitRestore(rest));
    case "reset":
      return analyzeGitReset(rest);
    case "clean":
      return localDiscard(analyzeGitClean(rest));
    case "rm":
      return localDiscard(analyzeGitRm(rest));
    case "push":
      return sharedState(analyzeGitPush(rest));
    case "branch":
      return sharedState(analyzeGitBranch(rest));
    case "stash":
      return sharedState(analyzeGitStash(rest));
    case "worktree":
      return sharedState(analyzeGitWorktree(rest));
    case "rebase":
      return localDiscard(analyzeGitRebase(rest));
    case "merge":
      return localDiscard(analyzeGitMerge(rest));
    case "tag":
      return sharedState(analyzeGitTag(rest));
    case "reflog":
      return sharedState(analyzeGitReflog(rest));
    default:
      return null;
  }
}
function localDiscard(match) {
  return match ? { ...match, localDiscard: true } : null;
}
function sharedState(match) {
  return match ? { ...match, localDiscard: false } : null;
}
function analyzeGitCheckout(tokens, isCheckoutPath) {
  const { index: doubleDashIdx, before: beforeDash } = splitAtDoubleDash(tokens);
  const shortOpts = import_tokens3.extractShortOpts(beforeDash, {
    shortOptsWithValue: CHECKOUT_SHORT_OPTS_WITH_VALUE
  });
  if (beforeDash.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f")) {
    return import_destructive.destructiveCommandMatch("git.checkout-force", REASON_CHECKOUT_FORCE);
  }
  for (const token of tokens) {
    if (token === "-b" || token === "-B" || token === "--orphan") {
      return null;
    }
    if (matchesGitLongOption(token, "--pathspec-from-file")) {
      return import_destructive.destructiveCommandMatch("git.checkout-pathspec-from-file", REASON_CHECKOUT_PATHSPEC_FROM_FILE);
    }
  }
  if (doubleDashIdx !== -1) {
    const hasRefBeforeDash = beforeDash.some((t) => !t.startsWith("-"));
    if (hasRefBeforeDash) {
      return import_destructive.destructiveCommandMatch("git.checkout-ref-path", REASON_CHECKOUT_REF_PATH);
    }
    return import_destructive.destructiveCommandMatch("git.checkout-double-dash", REASON_CHECKOUT_DOUBLE_DASH);
  }
  const positionalArgs = getCheckoutPositionalArgs(tokens);
  if (positionalArgs.length >= 2) {
    return import_destructive.destructiveCommandMatch("git.checkout-ambiguous", REASON_CHECKOUT_AMBIGUOUS);
  }
  const operand = positionalArgs[0];
  if (operand === undefined || shortOpts.has("-d") || shortOpts.has("-t") || tokens.some((token) => matchesGitLongOption(token, "--detach") || matchesGitLongOption(token, "--track"))) {
    return null;
  }
  if (isPathspecShaped(operand) || isCheckoutPath(operand)) {
    return import_destructive.destructiveCommandMatch("git.checkout-double-dash", REASON_CHECKOUT_PATH);
  }
  return null;
}
function isPathspecShaped(operand) {
  return operand === "." || operand === ".." || /^\.\.?[/\\]/.test(operand) || /^([/\\]|[A-Za-z]:[/\\])/.test(operand) || operand.endsWith("/") || operand.startsWith(":") || /[*?[]/.test(operand);
}
function analyzeGitSwitch(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  if (before.some((token) => matchesGitLongOption(token, "--discard-changes"))) {
    return import_destructive.destructiveCommandMatch("git.switch-discard-changes", REASON_SWITCH_DISCARD_CHANGES);
  }
  const shortOpts = import_tokens3.extractShortOpts(before, {
    shortOptsWithValue: SWITCH_SHORT_OPTS_WITH_VALUE
  });
  if (before.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f")) {
    return import_destructive.destructiveCommandMatch("git.switch-force", REASON_SWITCH_FORCE);
  }
  return null;
}
function getCheckoutPositionalArgs(tokens) {
  const positional = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token)
      break;
    if (token === "--") {
      break;
    }
    if (!token.startsWith("-")) {
      positional.push(token);
      i++;
      continue;
    }
    if (CHECKOUT_OPTS_WITH_VALUE.has(token)) {
      i += 2;
      continue;
    }
    if (CHECKOUT_OPTS_WITH_OPTIONAL_VALUE.has(token)) {
      const nextToken = tokens[i + 1];
      const validModes = token === "--recurse-submodules" ? ["checkout", "on-demand"] : ["direct", "inherit"];
      i += nextToken && !nextToken.startsWith("-") && validModes.includes(nextToken) ? 2 : 1;
      continue;
    }
    i++;
  }
  return positional;
}
function analyzeGitRestore(tokens) {
  const facts = parseGitRestoreFacts(tokens);
  if (facts.isTerminal || !facts.hasPathspec && !facts.hasPatch || !facts.hasWorktree) {
    return null;
  }
  return facts.hasExplicitLocation ? import_destructive.destructiveCommandMatch("git.restore-worktree", REASON_RESTORE_WORKTREE) : import_destructive.destructiveCommandMatch("git.restore-unstaged", REASON_RESTORE);
}
function parseGitRestoreFacts(tokens) {
  let hasPathspec = false;
  let hasPatch = false;
  let hasWorktree = true;
  let hasExplicitLocation = false;
  const setLocation = (worktree) => {
    if (!hasExplicitLocation) {
      hasWorktree = false;
      hasExplicitLocation = true;
    }
    if (worktree !== undefined) {
      hasWorktree = worktree;
    }
  };
  for (let i = 0;i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined)
      break;
    if (token === "--") {
      hasPathspec ||= i + 1 < tokens.length;
      break;
    }
    if (token === "--pathspec-from-file") {
      hasPathspec = true;
      i++;
      continue;
    }
    if (token.startsWith("--pathspec-from-file=")) {
      hasPathspec = true;
      continue;
    }
    if (token === "-h" || token === "--help" || token === "--version") {
      return {
        hasPathspec,
        hasPatch,
        hasWorktree,
        hasExplicitLocation,
        isTerminal: true
      };
    }
    if (token === "--staged") {
      setLocation();
      continue;
    }
    if (token === "--no-staged") {
      setLocation();
      continue;
    }
    if (token === "--worktree") {
      setLocation(true);
      continue;
    }
    if (token === "--no-worktree") {
      setLocation(false);
      continue;
    }
    if (token === "--patch") {
      hasPatch = true;
      continue;
    }
    if (token === "--no-patch") {
      hasPatch = false;
      continue;
    }
    if (RESTORE_OPTS_WITH_VALUE.has(token)) {
      i++;
      continue;
    }
    if (token.startsWith("--")) {
      continue;
    }
    if (token === "-") {
      hasPathspec = true;
      continue;
    }
    if (!token.startsWith("-")) {
      hasPathspec = true;
      continue;
    }
    for (let j = 1;j < token.length; j++) {
      const option = token.charAt(j);
      if (option === "h") {
        return {
          hasPathspec,
          hasPatch,
          hasWorktree,
          hasExplicitLocation,
          isTerminal: true
        };
      }
      if (option === "S") {
        setLocation();
        continue;
      }
      if (option === "W") {
        setLocation(true);
        continue;
      }
      if (option === "p") {
        hasPatch = true;
        continue;
      }
      if (option === "s" || option === "U") {
        if (j === token.length - 1) {
          i++;
        }
        break;
      }
    }
  }
  return { hasPathspec, hasPatch, hasWorktree, hasExplicitLocation, isTerminal: false };
}
function analyzeGitReset(tokens) {
  let match = null;
  for (const token of tokens) {
    if (matchesGitLongOption(token, "--hard")) {
      match = import_destructive.destructiveCommandMatch("git.reset-hard", REASON_RESET_HARD);
      break;
    }
    if (matchesGitLongOption(token, "--merge")) {
      match = import_destructive.destructiveCommandMatch("git.reset-merge", REASON_RESET_MERGE);
      break;
    }
  }
  if (!match) {
    return null;
  }
  return resetHasRef(tokens) ? sharedState(match) : localDiscard(match);
}
function resetHasRef(tokens) {
  for (const token of tokens) {
    if (token === "--") {
      return false;
    }
    if (!token.startsWith("-")) {
      return true;
    }
  }
  return false;
}
function analyzeGitClean(tokens) {
  for (const token of tokens) {
    if (token === "-n" || matchesGitLongOption(token, "--dry-run")) {
      return null;
    }
  }
  const shortOpts = import_tokens3.extractShortOpts(tokens.filter((t) => t !== "--"));
  if (tokens.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f")) {
    return import_destructive.destructiveCommandMatch("git.clean-force", REASON_CLEAN);
  }
  return null;
}
function analyzeGitRm(tokens) {
  let hasForce = false;
  let hasCached = false;
  let hasDryRun = false;
  for (const token of splitAtDoubleDash(tokens).before) {
    if (matchesGitLongOption(token, "--no-force")) {
      hasForce = false;
      continue;
    }
    if (matchesGitLongOption(token, "--force")) {
      hasForce = true;
      continue;
    }
    if (matchesGitLongOption(token, "--no-cached")) {
      hasCached = false;
      continue;
    }
    if (matchesGitLongOption(token, "--cached")) {
      hasCached = true;
      continue;
    }
    if (matchesGitLongOption(token, "--no-dry-run")) {
      hasDryRun = false;
      continue;
    }
    if (matchesGitLongOption(token, "--dry-run")) {
      hasDryRun = true;
      continue;
    }
    const shortOpts = import_tokens3.extractShortOpts([token]);
    hasForce ||= shortOpts.has("-f");
    hasDryRun ||= shortOpts.has("-n");
  }
  return hasForce && !hasCached && !hasDryRun ? import_destructive.destructiveCommandMatch("git.rm-force", REASON_RM_FORCE) : null;
}
function analyzeGitPush(tokens) {
  const { before, after } = splitAtDoubleDash(tokens);
  const shortOpts = import_tokens3.extractShortOpts(before);
  if (before.some((token) => matchesGitLongOption(token, "--mirror"))) {
    return import_destructive.destructiveCommandMatch("git.push-mirror", REASON_PUSH_MIRROR);
  }
  const hasForce = before.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f") || getPushRefspecCandidates(before, after).some(isForcePushRefspec);
  if (hasForce) {
    return import_destructive.destructiveCommandMatch("git.push-force", REASON_PUSH_FORCE);
  }
  const hasDelete = before.some((token) => matchesGitLongOption(token, "--delete")) || shortOpts.has("-d") || getPushRefspecCandidates(before, after).some(isDeletePushRefspec);
  if (hasDelete) {
    return import_destructive.destructiveCommandMatch("git.push-delete", REASON_PUSH_DELETE);
  }
  return null;
}
function getPushRefspecCandidates(beforeDoubleDash, afterDoubleDash) {
  return [
    ...beforeDoubleDash.filter((token) => token !== "" && !token.startsWith("-")),
    ...afterDoubleDash
  ];
}
function isForcePushRefspec(token) {
  return token.startsWith("+") || token.includes(":+");
}
function isDeletePushRefspec(token) {
  return token.length > 1 && token.startsWith(":");
}
function analyzeGitBranch(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  const shortOpts = import_tokens3.extractShortOpts(before);
  const hasDelete = shortOpts.has("-D") || shortOpts.has("-d") || before.some((token) => matchesGitLongOption(token, "--delete"));
  const hasForce = shortOpts.has("-D") || shortOpts.has("-f") || before.some((token) => matchesGitLongOption(token, "--force"));
  if (hasDelete && hasForce) {
    return import_destructive.destructiveCommandMatch("git.branch-force-delete", REASON_BRANCH_DELETE);
  }
  return null;
}
function analyzeGitRebase(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  return before.some((token) => matchesGitLongOption(token, "--abort")) ? import_destructive.destructiveCommandMatch("git.rebase-abort", REASON_REBASE_ABORT) : null;
}
function analyzeGitMerge(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  return before.some((token) => matchesGitLongOption(token, "--abort")) ? import_destructive.destructiveCommandMatch("git.merge-abort", REASON_MERGE_ABORT) : null;
}
function analyzeGitTag(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  const shortOpts = import_tokens3.extractShortOpts(before);
  return shortOpts.has("-d") || before.some((token) => matchesGitLongOption(token, "--delete")) ? import_destructive.destructiveCommandMatch("git.tag-delete", REASON_TAG_DELETE) : null;
}
function analyzeGitReflog(tokens) {
  return tokens[0] === "delete" ? import_destructive.destructiveCommandMatch("git.reflog-delete", REASON_REFLOG_DELETE) : null;
}
function analyzeGitStash(tokens) {
  for (const token of tokens) {
    if (token === "drop") {
      return import_destructive.destructiveCommandMatch("git.stash-drop", REASON_STASH_DROP);
    }
    if (token === "clear") {
      return import_destructive.destructiveCommandMatch("git.stash-clear", REASON_STASH_CLEAR);
    }
  }
  return null;
}
function analyzeGitWorktree(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  const hasRemove = before.includes("remove");
  if (!hasRemove)
    return null;
  const shortOpts = import_tokens3.extractShortOpts(before);
  if (before.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f")) {
    return import_destructive.destructiveCommandMatch("git.worktree-remove-force", REASON_WORKTREE_REMOVE_FORCE);
  }
  return null;
}
// src/gate/analyzer/analyze-command.ts
var import_node_path4 = require("node:path");
var import_budget2 = require("./core.js");
var import_canonicalization2 = require("./core.js");
var import_effective_rules3 = require("./core.js");
var import_transparent_wrappers4 = require("./core.js");
var import_constants5 = require("./core-shell.js");
var import_destructive4 = require("./core-shell.js");
var import_model = require("./core-shell.js");
var import_parse6 = require("./core-shell.js");
var import_tokens6 = require("./core-shell.js");
var import_command_words5 = require("./analyzer.js");
var import_dangerous_text2 = require("./analyzer.js");
var import_deferred_assignment = require("./analyzer.js");
var import_heredoc_files2 = require("./analyzer.js");
var import_interpreters2 = require("./analyzer.js");
var import_remove_item = require("./analyzer.js");
var import_reasons2 = require("./analyzer.js");

// src/gate/analyzer/segment.ts
var import_budget = require("./core.js");
var import_canonicalization = require("./core.js");
var import_chdir2 = require("./core.js");
var import_tmpdir2 = require("./core.js");
var import_effective_rules2 = require("./core.js");
var import_transparent_wrappers2 = require("./core.js");
var import_constants4 = require("./core-shell.js");
var import_custom = require("./core-shell.js");
var import_destructive3 = require("./core-shell.js");
var import_tokens5 = require("./core-shell.js");
var import_awk = require("./analyzer.js");
var import_child_command = require("./analyzer.js");
var import_command_words4 = require("./analyzer.js");
var import_dangerous_text = require("./analyzer.js");
var import_derived_input = require("./analyzer.js");
var import_device = require("./analyzer.js");

// src/gate/analyzer/git/index.ts
var import_node_path3 = require("node:path");
var import_effective_rules = require("./core.js");
var import_destructive2 = require("./core-shell.js");
var import_command_words3 = require("./analyzer.js");

// src/gate/analyzer/git/temp-root-relaxation.ts
var import_node_path2 = require("node:path");
var import_tmpdir = require("./core.js");
var import_command_words2 = require("./analyzer.js");
var import_shell_git_env2 = require("./analyzer.js");

// src/gate/analyzer/git/worktree.ts
var import_node_path = require("node:path");
var import_chdir = require("./core.js");
var import_constants3 = require("./core-shell.js");
function hasGitContextEnvOverride(env, envAssignments) {
  return GIT_CONTEXT_ENV_OVERRIDES.some((name) => envAssignments?.has(name) || env.has(name));
}
function getGitExecutionContext(tokens, cwd, paths) {
  if (!cwd) {
    return { gitCwd: null, hasExplicitGitContext: false };
  }
  const startCwd = paths.realpath(import_node_path.resolve(cwd));
  if (startCwd === null || !paths.isDirectory(startCwd)) {
    return { gitCwd: null, hasExplicitGitContext: false };
  }
  let gitCwd = startCwd;
  let hasExplicitGitContext = false;
  let i = 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token)
      break;
    if (token === "--") {
      break;
    }
    if (!token.startsWith("-")) {
      break;
    }
    if (token === "-C") {
      const target = tokens[i + 1];
      if (!target) {
        return { gitCwd: null, hasExplicitGitContext };
      }
      const resolvedCwd = resolveGitCwd(gitCwd, target, paths);
      if (!resolvedCwd) {
        return { gitCwd: null, hasExplicitGitContext };
      }
      gitCwd = resolvedCwd;
      i += 2;
      continue;
    }
    if (token.startsWith("-C") && token.length > 2) {
      const resolvedCwd = resolveGitCwd(gitCwd, token.slice(2), paths);
      if (!resolvedCwd) {
        return { gitCwd: null, hasExplicitGitContext };
      }
      gitCwd = resolvedCwd;
      i++;
      continue;
    }
    if (token === "--git-dir" || token === "--work-tree") {
      hasExplicitGitContext = true;
      i += 2;
      continue;
    }
    if (token.startsWith("--git-dir=") || token.startsWith("--work-tree=")) {
      hasExplicitGitContext = true;
      i++;
      continue;
    }
    i += import_constants3.GIT_GLOBAL_OPTS_WITH_VALUE.has(token) ? 2 : 1;
  }
  return { gitCwd, hasExplicitGitContext };
}
function resolveGitCwd(baseCwd, target, paths) {
  try {
    const resolved = import_chdir.resolveChdirTarget(baseCwd, target, paths);
    return paths.isDirectory(resolved) ? resolved : null;
  } catch {
    return null;
  }
}

// src/gate/analyzer/git/worktree-relaxation.ts
var import_tokens4 = require("./core-shell.js");
function getGitWorktreeRelaxationForMatch(tokens, match, options) {
  if (!match.localDiscard || !options.worktreeMode || hasGitContextEnvOverride(options.environment.env, options.envAssignments)) {
    return null;
  }
  const context = getGitExecutionContext(tokens, options.cwd, options.environment.paths);
  if (!context.gitCwd || context.hasExplicitGitContext) {
    return null;
  }
  const facts = options.environment.worktreeFacts(context.gitCwd);
  if (!facts) {
    return null;
  }
  if (isNonRelaxableLocalDiscard(tokens, options, facts)) {
    return null;
  }
  return {
    kind: "worktree",
    originalReason: match.reason,
    gitCwd: context.gitCwd
  };
}
function isNonRelaxableLocalDiscard(tokens, options, facts) {
  const { subcommand, rest } = extractGitSubcommandAndRest(tokens);
  const normalizedSubcommand = subcommand?.toLowerCase();
  if (options.dynamicArguments || hasDynamicGitArgument(rest) || hasRecursiveSubmoduleConfig(tokens, options.environment.env, options.envAssignments, facts) || hasRecurseSubmodulesOption(rest) || isForcedBranchReset(normalizedSubcommand, rest)) {
    return true;
  }
  return normalizedSubcommand === "clean" && countCleanForceFlags(rest) > 1;
}
function hasDynamicGitArgument(tokens) {
  return tokens.some((token) => /[$*?[]/.test(token));
}
function isForcedBranchReset(subcommand, rest) {
  if (subcommand === "checkout") {
    const { before } = splitAtDoubleDash(rest);
    const shortOpts = import_tokens4.extractShortOpts(before, {
      shortOptsWithValue: CHECKOUT_SHORT_OPTS_WITH_VALUE
    });
    const hasForce = before.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f");
    const hasBranchReset = shortOpts.has("-B") || before.some((token) => token === "-B" || token.startsWith("-B"));
    return hasForce && hasBranchReset;
  }
  if (subcommand === "switch") {
    const { before } = splitAtDoubleDash(rest);
    const shortOpts = import_tokens4.extractShortOpts(before, {
      shortOptsWithValue: SWITCH_SHORT_OPTS_WITH_VALUE
    });
    const hasForce = before.some((token) => matchesGitLongOption(token, "--force")) || before.some((token) => matchesGitLongOption(token, "--discard-changes")) || shortOpts.has("-f");
    const hasForceCreate = before.some((token) => token === "-C" || token.startsWith("-C") || isForceCreateOption(token)) || shortOpts.has("-C");
    return hasForce && hasForceCreate;
  }
  return false;
}
function isForceCreateOption(token) {
  const optionName = token.split("=", 1)[0] ?? token;
  return optionName === "--force-create" || optionName.length >= "--force-c".length && "--force-create".startsWith(optionName);
}
function hasRecurseSubmodulesOption(tokens) {
  return tokens.some((token) => token.startsWith("--recurse-sub"));
}
function countCleanForceFlags(tokens) {
  let count = 0;
  for (const token of tokens) {
    if (token === "--force") {
      count++;
      continue;
    }
    if (token.startsWith("-") && !token.startsWith("--")) {
      for (const opt of token.slice(1)) {
        if (opt === "f") {
          count++;
        }
      }
    }
  }
  return count;
}
function hasRecursiveSubmoduleConfig(tokens, env, envAssignments, facts) {
  if (getGitEnvValue("GIT_CONFIG_PARAMETERS", env, envAssignments) !== undefined) {
    return true;
  }
  const resolution = getGitConfigEntries(tokens, env, envAssignments);
  if (resolution.blockedReason !== null) {
    return true;
  }
  const entries = resolution.entries.map((entry) => ({
    key: entry.key.toLowerCase(),
    value: entry.value
  }));
  if (entries.some((entry) => isIncludeConfigKey(entry.key))) {
    return true;
  }
  const recurse = entries.filter((entry) => entry.key === "submodule.recurse").at(-1);
  if (recurse) {
    return recurse.value === undefined || gitConfigValueEnablesRecursiveSubmodules(recurse.value);
  }
  if (hasConfigAffectingEnvAssignment(envAssignments)) {
    return true;
  }
  return facts.recursiveSubmodules;
}
function gitConfigValueEnablesRecursiveSubmodules(value) {
  const normalizedValue = value.toLowerCase();
  return normalizedValue !== "false" && normalizedValue !== "no" && normalizedValue !== "off" && normalizedValue !== "0";
}
function isIncludeConfigKey(key) {
  return key === "include.path" || key.startsWith("includeif.") && key.endsWith(".path");
}

// src/gate/analyzer/git/temp-root-relaxation.ts
function getGitTempRootRelaxationForMatch(words, match, options) {
  const tokens = words.map((word) => import_shell_git_env2.expandKnownVariableWord(word, options.shellAssignments ?? new Map) ?? import_command_words2.analysisWordText(word));
  const paths = options.environment.paths;
  const context = getGitExecutionContext(tokens, options.cwd, paths);
  const workspace = options.originalCwd ? paths.realpath(import_node_path2.resolve(options.originalCwd)) : null;
  if (match.id.startsWith("git.push-") || workspace === null || context.gitCwd === null || context.hasExplicitGitContext || hasGitContextEnvOverride(options.environment.env, options.envAssignments)) {
    return null;
  }
  const subject = match.id === "git.worktree-remove-force" ? worktreeRemoveOperand(words, options.shellAssignments, paths) : findGitRepositoryRoot(context.gitCwd, paths);
  if (subject === null || match.id !== "git.worktree-remove-force" && !isDisposableRepository(subject, tokens, match, options) || !import_tmpdir.isTrustedTempPath(subject, options.environment) || import_tmpdir.isTrustedTempRootPath(subject, options.environment) || import_tmpdir.isPathOrSubpath(workspace, subject) || import_tmpdir.isPathOrSubpath(subject, workspace)) {
    return null;
  }
  return { kind: "temp-root", originalReason: match.reason, gitCwd: context.gitCwd };
}
function isDisposableRepository(root, tokens, match, options) {
  const paths = options.environment.paths;
  const gitEntry = import_node_path2.join(root, ".git");
  if (paths.entryKind(gitEntry) !== "present")
    return false;
  const ownsItsGitDirectory = paths.isDirectory(gitEntry);
  if (ownsItsGitDirectory)
    return true;
  if (!match.localDiscard)
    return false;
  const linkedWorktreeWithMatchingBacklink = options.environment.worktreeFacts(root);
  return linkedWorktreeWithMatchingBacklink !== null && !isNonRelaxableLocalDiscard(tokens, options, linkedWorktreeWithMatchingBacklink);
}
function worktreeRemoveOperand(words, shellAssignments, paths) {
  const rest = extractGitSubcommandAndRest(words.map(import_command_words2.analysisWordText)).rest;
  const { before, after } = splitAtDoubleDash(rest.slice(rest.indexOf("remove") + 1));
  const operands = [...before.filter((token) => !token.startsWith("-")), ...after];
  const operand = operands.length === 1 ? operands[0] ?? "" : "";
  const operandWord = words.find((word) => word.text === operand);
  const expanded = (operandWord && import_shell_git_env2.expandKnownVariableWord(operandWord, shellAssignments ?? new Map)) ?? operand;
  if (!import_node_path2.isAbsolute(expanded) || /[\s$`*?[]/.test(expanded) || paths.entryKind(expanded) !== "present" || !paths.isDirectory(expanded)) {
    return null;
  }
  return paths.realpath(expanded);
}
function findGitRepositoryRoot(directory, paths) {
  if (paths.entryKind(import_node_path2.join(directory, ".git")) !== "missing")
    return directory;
  const parent = import_node_path2.dirname(directory);
  return parent === directory ? null : findGitRepositoryRoot(parent, paths);
}

// src/gate/analyzer/git/index.ts
var REASON_GIT_SSH_ENV = "Git SSH environment overrides can execute arbitrary commands during network operations. Run git without GIT_SSH/GIT_SSH_COMMAND overrides, or ask the user to run it manually.";
var GIT_NETWORK_SUBCOMMANDS = new Set([
  "clone",
  "fetch",
  "pull",
  "push",
  "ls-remote",
  "submodule"
]);
function analyzeGitMatch(words, options) {
  return evaluateGit(words, options);
}
function evaluateGit(words, options, onRelaxation) {
  const tokens = words.map(import_command_words3.analysisWordText);
  const aliasResolution = resolveGitCommandLineAliases(tokens, options.environment.env, options.envAssignments);
  const aliasConfigMatch = aliasResolution.blockedReason ? import_effective_rules.filterDestructiveCommandMatch(import_destructive2.destructiveCommandMatch("git.alias-config", aliasResolution.blockedReason), options.policy) : null;
  if (aliasConfigMatch)
    return aliasConfigMatch;
  const resolvedTokens = aliasResolution.tokens;
  if ((hasGitSshEnvAssignment(options.envAssignments) || hasGitCommandLineSshCommandConfig(tokens, options.environment.env, options.envAssignments)) && isGitNetworkOperation(resolvedTokens)) {
    return import_destructive2.destructiveCommandMatch("git.ssh-env", REASON_GIT_SSH_ENV);
  }
  const match = analyzeGitRule(resolvedTokens, (operand) => {
    const gitCwd = getGitExecutionContext(tokens, options.cwd, options.environment.paths).gitCwd;
    return gitCwd !== null && options.environment.paths.entryKind(import_node_path3.resolve(gitCwd, operand)) !== "missing";
  });
  if (!match) {
    return null;
  }
  if (aliasResolution.expanded || aliasResolution.blockedReason) {
    return match;
  }
  const relaxation = getGitWorktreeRelaxationForMatch(tokens, match, options) ?? getGitTempRootRelaxationForMatch(words, match, options);
  if (!relaxation)
    return match;
  onRelaxation?.(relaxation);
  return null;
}
function analyzeGitDetailed(words, options) {
  let relaxation = null;
  const match = evaluateGit(words, options, (value) => {
    relaxation = value;
  });
  return { match, relaxation };
}
function isGitNetworkOperation(tokens) {
  const { subcommand, rest } = extractGitSubcommandAndRest(tokens);
  const subcommandName = subcommand?.toLowerCase();
  if (!subcommandName) {
    return false;
  }
  if (GIT_NETWORK_SUBCOMMANDS.has(subcommandName)) {
    return true;
  }
  if (subcommandName === "archive") {
    return splitAtDoubleDash(rest).before.some((token) => matchesGitLongOption(token, "--remote"));
  }
  return subcommandName === "remote" && isGitRemoteUpdateOperation(rest);
}
function isGitRemoteUpdateOperation(tokens) {
  return tokens.find((token) => !isGitRemotePrefixOption(token))?.toLowerCase() === "update";
}
function isGitRemotePrefixOption(token) {
  return token === "-v" || matchesGitLongOption(token, "--verbose") || matchesGitLongOption(token, "--no-verbose");
}

// src/gate/analyzer/segment.ts
var import_heredoc_files = require("./analyzer.js");
var import_interpreters = require("./analyzer.js");
var import_reasons = require("./analyzer.js");
var import_rm_flags = require("./analyzer.js");
var import_rule = require("./analyzer.js");
var import_shell_git_env3 = require("./analyzer.js");
var import_shell_wrappers = require("./analyzer.js");
var import_transparent_wrappers3 = require("./analyzer.js");
var import_wrapper_prelude2 = require("./analyzer.js");
function findCommandAnalyzer(head) {
  return import_rule.ANALYZER_RULES.find((rule) => rule.heads.has(head))?.analyze;
}
function analyzeSegment(commandWords, depth, options) {
  let trace = options.trace;
  if (commandWords.length === 0) {
    return null;
  }
  const dialect = options.commandView?.dialect ?? "posix";
  const texts = (candidates) => candidates.map((word) => dialect === "posix" ? import_command_words4.analysisWordText(word) : word.text);
  const child = options.child;
  const stream = child !== undefined && !child.embedded;
  const embedded = child?.embedded === true;
  const cwdUnknown = options.effectiveCwd === null;
  const baseCwdForRm = child ? child.cwd : cwdUnknown ? undefined : options.effectiveCwd ?? options.cwd;
  const originalCwd = child ? child.originalCwd : cwdUnknown ? undefined : options.cwd;
  const leading = import_wrapper_prelude2.stripEnvAssignmentWords(commandWords);
  if (leading.envAssignments.size > 0) {
    trace?.recordSegment({
      type: "env-strip",
      input: texts(commandWords),
      envVars: [...leading.envAssignments.keys()],
      output: texts(leading.words)
    });
  }
  const prelude = import_wrapper_prelude2.stripWrapperWords(leading.words, options.environment, baseCwdForRm, new Map([...options.envAssignments ?? [], ...leading.envAssignments]));
  const envSplitValues = prelude.envSplitValues ?? [];
  if (envSplitValues.length > 0) {
    const splitCommandText = [...envSplitValues, ...texts(prelude.words)].join(" ");
    const dangerousSplitMatch = import_dangerous_text.dangerousInTextMatch(splitCommandText);
    if (dangerousSplitMatch) {
      trace?.recordSegment({
        type: "dangerous-text",
        token: splitCommandText,
        matched: true,
        reason: dangerousSplitMatch.reason
      });
      return blockResultFromMatch(dangerousSplitMatch);
    }
    if (options.strict) {
      return dynamicShellSourceResult(trace);
    }
    const spliced = import_wrapper_prelude2.reconstructEnvSplitWords(envSplitValues, texts(prelude.words));
    if (spliced) {
      options.budget.charge("derivedTokens", spliced.length);
      const splicedResult = options.analyzeNested(spliced.join(" "), {
        effectiveCwd: prelude.cwd === undefined ? options.effectiveCwd : prelude.cwd,
        envAssignments: new Map([
          ...options.envAssignments ?? [],
          ...leading.envAssignments,
          ...prelude.envAssignments
        ])
      });
      if (splicedResult)
        return splicedResult;
    }
  }
  const words = prelude.rewritten ? import_command_words4.textCommandWords(texts(prelude.words)) : import_command_words4.analyzedViewWords(dialect, prelude.words);
  const stripped = texts(words);
  const normalizedOptions = {
    ...options,
    wrapperNormalizationBudget: options.wrapperNormalizationBudget ?? { iterations: 0 }
  };
  if (trace && leading.words.length > words.length) {
    const strippedEnv = texts(leading.words);
    trace.recordSegment({
      type: "leading-tokens-stripped",
      input: strippedEnv,
      removed: strippedEnv.slice(0, strippedEnv.length - words.length),
      output: stripped
    });
  }
  const envAssignments = new Map([
    ...options.envAssignments ?? [],
    ...leading.envAssignments,
    ...prelude.envAssignments
  ]);
  const head = stripped[0];
  if (!head)
    return null;
  if (import_transparent_wrappers3.isStandardCommandWrapper(head)) {
    throw new import_budget.AnalysisLimit("wrapperPeelIterations");
  }
  const normalizedHead = import_tokens5.normalizeCommandToken(head);
  const cwdForRm = prelude.cwd === null ? undefined : prelude.cwd ?? baseCwdForRm;
  const originalCwdForRm = prelude.cwd === null ? undefined : originalCwd;
  const nestedEffectiveCwd = prelude.cwd === undefined ? options.effectiveCwd : prelude.cwd;
  const allowTmpdirVar = child ? child.allowTmpdirVar : !import_tmpdir2.isTmpdirOverriddenToNonTemp(envAssignments, options.environment);
  const dynamicCommandMatch = import_derived_input.analyzeDynamicCommandStructure(dialect, prelude.words, options.environment, depth === 0, options.strict, options.policy);
  if (dynamicCommandMatch) {
    trace?.recordSegment({
      type: "rule-check",
      rule: "analyzer/segment.ts:analyzeDynamicCommandStructure",
      matched: true,
      reason: dynamicCommandMatch.reason
    });
    return blockResultFromMatch(dynamicCommandMatch);
  }
  const transparentWrapper = import_transparent_wrappers3.unwrapTransparentWrapper(stripped, options.policy);
  if (transparentWrapper) {
    for (const childIndex of [
      transparentWrapper.childIndex,
      ...transparentWrapper.alternativeChildIndices
    ]) {
      reserveWrapperNormalization(normalizedOptions.wrapperNormalizationBudget);
      const candidateWords = words.slice(childIndex);
      trace?.recordSegment({
        type: "transparent-wrapper",
        wrapper: transparentWrapper.wrapper,
        output: texts(candidateWords)
      });
      const result = analyzeSegment(candidateWords, depth, {
        ...normalizedOptions,
        effectiveCwd: nestedEffectiveCwd,
        envAssignments
      });
      if (result)
        return result;
    }
    return null;
  }
  const shellBuiltinSource = embedded ? undefined : normalizedHead === "eval" ? extractEvalSource(words) : normalizedHead === "trap" && !stream ? extractTrapSource(words) : undefined;
  if (stream && child && normalizedHead === "eval") {
    if (shellBuiltinSource?.kind === "dynamic") {
      return childShellDynamicResult(child, options.policy);
    }
    if (shellBuiltinSource?.kind === "literal") {
      const result = options.analyzeNested(shellBuiltinSource.source, {
        effectiveCwd: nestedEffectiveCwd,
        envAssignments
      });
      if (result)
        return result;
    }
    return childDynamicSourceResult(child, options.policy);
  }
  if (shellBuiltinSource?.kind === "dynamic" && (options.strict || !options.commandView || !isVerifiableLocalGeneratorSource(options.commandView))) {
    return dynamicShellSourceResult(trace);
  }
  if (shellBuiltinSource?.kind === "literal") {
    trace?.recordSegment({
      type: "recurse",
      reason: normalizedHead === "eval" ? "shell-eval" : "shell-trap",
      innerCommand: shellBuiltinSource.source,
      depth: depth + 1
    });
    const result = options.analyzeNested(shellBuiltinSource.source, {
      effectiveCwd: nestedEffectiveCwd,
      envAssignments,
      functionDefinitions: options.functionDefinitions
    });
    if (result)
      return result;
  }
  const shellWrapperHead = stream ? import_constants4.SHELL_WRAPPERS.has(normalizedHead) : isShellWrapperCommand(head, normalizedHead);
  if (shellWrapperHead) {
    if (import_shell_wrappers.isShellSyntaxCheck(stripped))
      return null;
    if (stream && child) {
      const streamDashCArg = import_shell_wrappers.extractDashCArg(stripped);
      if (streamDashCArg) {
        if (child.dynamicSourceInput ?? child.dynamicInput) {
          const dynamic = childShellDynamicResult(child, options.policy);
          if (dynamic)
            return dynamic;
        }
        if (shellSourceHasUnresolvedDynamicExecutionCarrier(streamDashCArg)) {
          const dynamic = childShellDynamicResult(child, options.policy);
          if (dynamic)
            return dynamic;
        }
        return options.analyzeNested(streamDashCArg, {
          effectiveCwd: nestedEffectiveCwd,
          envAssignments
        });
      }
      const streamScript = extractShellScriptOperandSource(words);
      if (streamScript.kind === "dynamic")
        return childShellDynamicResult(child, options.policy);
      if (streamScript.kind === "literal") {
        return child.dynamicSourceInput ? childShellDynamicResult(child, options.policy) : null;
      }
      return child.dynamicSourceInput ?? child.dynamicInput ? childShellDynamicResult(child, options.policy) : null;
    }
    if (embedded) {
      const embeddedDashCArg = import_shell_wrappers.extractDashCArg(stripped);
      const embeddedResult = embeddedDashCArg ? options.analyzeNested(embeddedDashCArg, {
        effectiveCwd: nestedEffectiveCwd,
        envAssignments
      }) : extractShellScriptOperandSource(words).kind === "dynamic" ? dynamicShellSourceResult(trace) : null;
      if (embeddedResult)
        return embeddedResult;
    }
    if (child === undefined) {
      const startupResult = analyzeShellStartupSources(stripped, envAssignments, nestedEffectiveCwd, options, trace, depth);
      if (startupResult)
        return startupResult;
      const dashCArg = import_shell_wrappers.extractDashCArg(stripped);
      if (dashCArg) {
        const positionalSource = extractPositionalShellSource(words, dashCArg);
        if (positionalSource.kind === "dynamic")
          return dynamicShellSourceResult(trace);
        const source = positionalSource.kind === "literal" ? positionalSource.source : bindLiteralPositionalParameters(words, dashCArg);
        const traceInnerCommand = unwrapTraceQuotes(source);
        trace?.recordSegment({
          type: "shell-wrapper",
          wrapper: normalizedHead,
          innerCommand: traceInnerCommand
        });
        trace?.recordSegment({
          type: "recurse",
          reason: "shell-wrapper",
          innerCommand: traceInnerCommand,
          depth: depth + 1
        });
        const result = options.analyzeNested(source, {
          effectiveCwd: nestedEffectiveCwd,
          envAssignments
        });
        if (result)
          return result;
        return shellSourceHasUnresolvedDynamicExecutionCarrier(source) ? dynamicShellSourceResult(trace) : null;
      }
      const scriptSource = extractShellScriptOperandSource(words, options.strict ? undefined : options.shellAssignments);
      if (scriptSource.kind === "dynamic")
        return dynamicShellSourceResult(trace);
      if (scriptSource.kind === "literal") {
        return analyzeTrackedHeredocScript(scriptSource.source, nestedEffectiveCwd, envAssignments, options, trace, depth);
      }
      const stdinSource = extractShellStdinSource(words, options.commandView?.redirections ?? [], options.hasPipelineInput ?? false, options.literalShellInput);
      if (stdinSource.kind === "dynamic")
        return dynamicShellSourceResult(trace);
      if (stdinSource.kind === "literal") {
        trace?.recordSegment({
          type: "recurse",
          reason: "shell-stdin",
          innerCommand: stdinSource.source,
          depth: depth + 1
        });
        return options.analyzeNested(stdinSource.source, {
          effectiveCwd: nestedEffectiveCwd,
          envAssignments
        });
      }
    }
  }
  if (!child && (normalizedHead === "source" || normalizedHead === ".")) {
    const sourceSearchPathIndex = stripped[1] === "-p" ? 2 : null;
    if (sourceSearchPathIndex !== null) {
      const sourceSearchPath = options.commandView ? words[sourceSearchPathIndex] : undefined;
      if (!sourceSearchPath)
        return null;
      if (sourceSearchPath.provenance !== "literal")
        return dynamicShellSourceResult(trace);
    }
    const sourceCandidateIndex = sourceSearchPathIndex === null ? 1 : 3;
    const sourceOperandIndex = stripped[sourceCandidateIndex] === "--" ? sourceCandidateIndex + 1 : sourceCandidateIndex;
    const source = options.commandView ? words[sourceOperandIndex] : undefined;
    if (!source)
      return null;
    if (source.provenance === "literal") {
      return analyzeTrackedHeredocScript(source.text, nestedEffectiveCwd, envAssignments, options, trace, depth);
    }
    if (options.strict || !options.commandView || !isVerifiableLocalGeneratorSource(options.commandView)) {
      return dynamicShellSourceResult(trace);
    }
  }
  if (import_constants4.AWK_INTERPRETERS.has(normalizedHead) && !embedded) {
    if (!child && options.strict && import_derived_input.hasDynamicExecutableSource(import_awk.extractAwkExecutableSources(stripped), words)) {
      return dynamicShellSourceResult(trace);
    }
    const awkMatch = import_awk.analyzeAwkSystemCallMatch(stripped, (command) => import_rule.matchFromBlockResult(options.analyzeNested(command, {
      effectiveCwd: nestedEffectiveCwd,
      envAssignments
    })));
    const awkReason = import_effective_rules2.filterDestructiveCommandMatch(awkMatch, options.policy);
    if (awkReason) {
      trace?.recordSegment({
        type: "rule-check",
        rule: "awk:analyzeAwkSystemCallMatch",
        matched: true,
        reason: awkReason.reason
      });
      return blockResultFromMatch(awkReason);
    }
  }
  if (import_transparent_wrappers2.isInterpreterCommand(normalizedHead) && !embedded) {
    if (!child && options.strict && import_derived_input.hasDynamicExecutableSource(import_interpreters.extractInterpreterExecutableSources(stripped), words)) {
      return dynamicShellSourceResult(trace);
    }
    const codeArg = import_interpreters.extractInterpreterCodeArg(stripped);
    if (stream && child) {
      return analyzeStreamInterpreterChild(normalizedHead, codeArg, nestedEffectiveCwd, envAssignments, options, child);
    }
    if (codeArg) {
      const paranoidInterpreterRuleEnabled = import_effective_rules2.destructiveCommandRuleIsEnabled(options.policy, "interpreter.one-liner-paranoid", !!options.paranoidInterpreters);
      trace?.recordSegment({
        type: "interpreter",
        interpreter: normalizedHead,
        codeArg,
        paranoidBlocked: paranoidInterpreterRuleEnabled
      });
      if (paranoidInterpreterRuleEnabled) {
        const match = import_effective_rules2.filterDestructiveCommandMatch(import_destructive3.destructiveCommandMatch("interpreter.one-liner-paranoid", import_interpreters.REASON_INTERPRETER_BLOCKED), options.policy);
        if (match)
          return blockResultFromMatch(match);
      }
      if (import_interpreters.isInterpreterDisplayOnly(normalizedHead, codeArg))
        return null;
      trace?.recordSegment({
        type: "recurse",
        reason: "interpreter",
        innerCommand: codeArg,
        depth: depth + 1
      });
      const innerReason = options.analyzeNested(codeArg, {
        effectiveCwd: nestedEffectiveCwd,
        envAssignments
      });
      if (innerReason && !isInterpreterShellParseNoise(innerReason, codeArg))
        return innerReason;
      if (import_interpreters.containsDangerousCode(codeArg, undefined, !options.strict)) {
        const match = import_effective_rules2.filterDestructiveCommandMatch(import_destructive3.destructiveCommandMatch("interpreter.dangerous-command", import_interpreters.REASON_INTERPRETER_DANGEROUS), options.policy);
        if (match) {
          trace?.recordSegment({
            type: "dangerous-text",
            token: codeArg,
            matched: true,
            reason: import_interpreters.REASON_INTERPRETER_DANGEROUS
          });
          return blockResultFromMatch(match);
        }
      }
      trace = undefined;
    }
  }
  if (normalizedHead === "busybox" && stripped.length > 1) {
    reserveWrapperNormalization(normalizedOptions.wrapperNormalizationBudget);
    trace?.recordSegment({ type: "busybox", subcommand: stripped[1] ?? "unknown" });
    trace?.recordSegment({
      type: "recurse",
      reason: "busybox",
      innerCommand: stripped.slice(1).join(" "),
      depth: depth + 1
    });
    return analyzeSegment(words.slice(1), depth, {
      ...normalizedOptions,
      effectiveCwd: nestedEffectiveCwd,
      envAssignments
    });
  }
  const filteredDeviceMatch = child ? null : import_effective_rules2.filterDestructiveCommandMatch(import_device.analyzeDeviceCommandMatch(normalizedHead, stripped), options.policy);
  if (filteredDeviceMatch) {
    trace?.recordSegment({
      type: "rule-check",
      rule: "analyzer/device.ts:analyzeDeviceCommandMatch",
      matched: true,
      reason: filteredDeviceMatch.reason
    });
    return blockResultFromMatch(filteredDeviceMatch);
  }
  const analyzerOptions = trace === normalizedOptions.trace ? normalizedOptions : { ...normalizedOptions, trace };
  const commandContext = {
    words,
    parsedWords: prelude.words,
    head: normalizedHead,
    cwd: cwdForRm,
    originalCwd: originalCwdForRm,
    envAssignments,
    allowTmpdirVar,
    dynamicArguments: prelude.words.some((word) => word.provenance === "command-substitution"),
    depth,
    effectiveCwd: nestedEffectiveCwd,
    options: analyzerOptions,
    analyzeChildTokens: (childTokens, childCwd) => stream && child ? analyzeChildCommand(childTokens, depth, analyzerOptions, {
      ...child,
      cwd: childCwd ?? undefined,
      effectiveCwd: childCwd ?? undefined
    }) : import_rule.matchFromBlockResult(analyzeSegment(import_command_words4.textCommandWords(childTokens), depth + 1, {
      ...analyzerOptions,
      child: undefined,
      commandView: undefined,
      effectiveCwd: childCwd,
      envAssignments
    })) ?? import_custom.checkPolicyRuleMatch(childTokens, analyzerOptions.policy.rules),
    analyzeChild: (childTokens, childProvenance) => analyzeChildCommand(childTokens, depth, analyzerOptions, childProvenance)
  };
  const commandAnalyzer = child && (normalizedHead === "xargs" || normalizedHead === "parallel") ? undefined : findCommandAnalyzer(normalizedHead);
  if (normalizedHead === "rm" || normalizedHead === "xargs" || normalizedHead === "parallel") {
    trace?.recordSegment({
      type: "tmpdir-check",
      tmpdirValue: envAssignments.has("TMPDIR") || options.environment.env.has("TMPDIR") ? "<redacted>" : null,
      allowTmpdirVar
    });
  }
  const gitDetail = trace && normalizedHead === "git" ? analyzeGitDetailed(commandContext.words, import_rule.gitAnalyzeOptions(commandContext)) : undefined;
  const commandResult = filterBuiltInCommandMatch(gitDetail ? gitDetail.match : commandAnalyzer?.(commandContext) ?? null, options.policy);
  if (trace)
    recordCommandAnalyzerTrace(commandContext, commandResult, gitDetail?.relaxation ?? null);
  if (commandResult) {
    return blockResultFromMatch(commandResult);
  }
  if (stream && child && (normalizedHead === "rm" || normalizedHead === "rmdir")) {
    const dynamicRmPolicyApplies = normalizedHead === "rm" && (import_rm_flags.hasRecursiveForceFlags(stripped) || child.dynamicRmInput);
    if (!dynamicRmPolicyApplies)
      return null;
    return (child.dynamicRmInput ? childDynamicSourceResult(child, options.policy) : null) ?? childDynamicRmResult(child, options.policy);
  }
  const matchedKnown = commandAnalyzer !== undefined && !HEADS_STILL_SCANNED_FOR_EMBEDDED.has(normalizedHead);
  const scansForEmbedded = !child && !matchedKnown && !import_constants4.DISPLAY_COMMANDS.has(normalizedHead);
  const tokensScanned = trace && scansForEmbedded ? [] : undefined;
  if (scansForEmbedded) {
    for (let i = 1;i < stripped.length; i++) {
      const token = stripped[i];
      if (!token)
        continue;
      tokensScanned?.push(token);
      const match = filterBuiltInCommandMatch(analyzeEmbeddedSuffix(stripped, i, depth, analyzerOptions, cwdForRm, originalCwdForRm, nestedEffectiveCwd, envAssignments), options.policy);
      if (match) {
        trace?.recordSegment({
          type: "fallback-scan",
          tokensScanned: tokensScanned ?? [],
          embeddedCommandFound: import_tokens5.normalizeCommandToken(token)
        });
        return blockResultFromMatch(match);
      }
    }
  }
  trace?.recordSegment({ type: "fallback-scan", tokensScanned: tokensScanned ?? [] });
  if (embedded && child && !child.wrappedByTransparent)
    return null;
  const customResult = import_custom.checkPolicyRuleMatch(stripped, options.policy.rules);
  trace?.recordSegment({
    type: "custom-rules-check",
    rulesChecked: options.policy.rules.length > 0,
    matched: !!customResult,
    reason: customResult?.reason
  });
  if (customResult) {
    return blockResultFromMatch(customResult);
  }
  return stream && child ? childDynamicSourceResult(child, options.policy) : null;
}
function analyzeChildCommand(tokens, depth, options, child) {
  return import_rule.matchFromBlockResult(analyzeSegment(import_command_words4.textCommandWords(tokens), depth + 1, {
    ...options,
    trace: undefined,
    commandView: undefined,
    hasPipelineInput: undefined,
    literalShellInput: undefined,
    functionDefinitions: undefined,
    cwd: child.originalCwd,
    effectiveCwd: child.effectiveCwd,
    envAssignments: child.envAssignments,
    worktreeMode: child.dynamicInput ? false : child.worktreeMode,
    wrapperNormalizationBudget: { iterations: 0 },
    child
  }));
}
function analyzeEmbeddedSuffix(tokens, index, depth, options, cwd, originalCwd, effectiveCwd, envAssignments) {
  for (const childCommand of import_child_command.normalizeChildCommands(tokens.slice(index), {
    environment: options.environment,
    cwd,
    envAssignments,
    policy: options.policy
  })) {
    const token = childCommand.tokens[0];
    if (!token)
      continue;
    const head = import_tokens5.normalizeCommandToken(token);
    const dispatches = isShellWrapperCommand(token, head) || findCommandAnalyzer(head) !== undefined && head !== "xargs" && head !== "parallel";
    if (dispatches || childCommand.wrappedByTransparent && options.policy.rules.length > 0) {
      options.budget.charge("derivedTokens", tokens.length - index);
    }
    const result = analyzeChildCommand(childCommand.tokens, depth, options, {
      embedded: true,
      cwd: childCommand.cwd,
      originalCwd: childCommand.wrapperCwd === null ? undefined : originalCwd,
      effectiveCwd: childCommand.wrapperCwd === undefined ? effectiveCwd : childCommand.wrapperCwd,
      envAssignments: childCommand.envAssignments,
      allowTmpdirVar: !import_tmpdir2.isTmpdirOverriddenToNonTemp(childCommand.envAssignments, options.environment),
      worktreeMode: false,
      wrappedByTransparent: childCommand.wrappedByTransparent
    });
    if (result)
      return result;
  }
  return null;
}
function analyzeStreamInterpreterChild(normalizedHead, codeArg, effectiveCwd, envAssignments, options, child) {
  if (!codeArg)
    return childDynamicSourceResult(child, options.policy);
  if (import_effective_rules2.destructiveCommandRuleIsEnabled(options.policy, "interpreter.one-liner-paranoid", !!options.paranoidInterpreters)) {
    const paranoid = import_effective_rules2.filterDestructiveCommandMatch(import_destructive3.destructiveCommandMatch("interpreter.one-liner-paranoid", import_interpreters.REASON_INTERPRETER_BLOCKED), options.policy);
    if (paranoid)
      return blockResultFromMatch(paranoid);
  }
  if (import_interpreters.isInterpreterDisplayOnly(normalizedHead, codeArg)) {
    return childDynamicSourceResult(child, options.policy);
  }
  const nested = options.analyzeNested(codeArg, { effectiveCwd, envAssignments });
  if (nested && !isInterpreterShellParseNoise(nested, codeArg))
    return nested;
  if (import_interpreters.containsDangerousCode(codeArg, undefined, !options.strict)) {
    const dangerous = import_effective_rules2.filterDestructiveCommandMatch(import_destructive3.destructiveCommandMatch("interpreter.dangerous-command", import_interpreters.REASON_INTERPRETER_DANGEROUS), options.policy);
    if (dangerous)
      return blockResultFromMatch(dangerous);
  }
  return childDynamicSourceResult(child, options.policy);
}
function isInterpreterShellParseNoise(nested, codeArg) {
  const textHitRescannedAsCode = nested.ruleId === "raw-text.dangerous-command";
  const parseFailureOnBalancedQuotes = (nested.reason.startsWith(import_reasons.REASON_UNSUPPORTED_HEREDOC_SYNTAX) || nested.reason === import_reasons.REASON_STRICT_UNPARSEABLE) && !import_tokens5.hasUnclosedQuotes(codeArg);
  return textHitRescannedAsCode || parseFailureOnBalancedQuotes;
}
function childShellDynamicResult(child, policy) {
  const match = child.shellDynamicMatch ? import_effective_rules2.filterDestructiveCommandMatch(child.shellDynamicMatch, policy) : null;
  return match ? blockResultFromMatch(match) : null;
}
function childDynamicSourceResult(child, policy) {
  const match = child.dynamicSourceInput && child.dynamicSourceMatch ? import_effective_rules2.filterDestructiveCommandMatch(child.dynamicSourceMatch, policy) : null;
  return match ? blockResultFromMatch(match) : null;
}
function childDynamicRmResult(child, policy) {
  const match = child.dynamicInput && child.rmDynamicMatch ? import_effective_rules2.filterDestructiveCommandMatch(child.rmDynamicMatch, policy) : null;
  return match ? blockResultFromMatch(match) : null;
}
function analyzeShellStartupSources(tokens, envAssignments, effectiveCwd, options, trace, depth) {
  const startup = import_shell_wrappers.extractShellStartupLoaderMetadata(tokens);
  if (startup.argvSource?.kind === "absent")
    return dynamicShellSourceResult(trace);
  if (startup.argvSourceApplies && startup.argvSource) {
    const result = analyzeTrackedHeredocScript(startup.argvSource.value, effectiveCwd, envAssignments, options, trace, depth, true);
    if (result)
      return result;
  }
  if (!startup.envSourceApplies || !startup.envName)
    return null;
  const envSource = envAssignments.get(startup.envName);
  if (!envSource)
    return null;
  return analyzeTrackedHeredocScript(envSource, effectiveCwd, envAssignments, options, trace, depth, true);
}
function analyzeTrackedHeredocScript(source, effectiveCwd, envAssignments, options, trace, depth, failClosed = false) {
  if (failClosed && /[$`*?[\]]/.test(source))
    return dynamicShellSourceResult(trace);
  const path = import_heredoc_files.resolveTrackedHeredocPath(source, effectiveCwd, options.environment.paths, options.budget);
  const body = path ? options.literalHeredocFiles?.get(path) : undefined;
  if (body === undefined)
    return failClosed ? dynamicShellSourceResult(trace) : null;
  options.budget.charge("derivedTokens", 1);
  trace?.recordSegment({
    type: "recurse",
    reason: "heredoc-file",
    innerCommand: body,
    depth: depth + 1
  });
  return options.analyzeNested(body, { effectiveCwd, envAssignments });
}
function unwrapTraceQuotes(command) {
  const first = command[0];
  return command.length >= 2 && (first === '"' || first === "'") && command.at(-1) === first ? command.slice(1, -1) : command;
}
function recordCommandAnalyzerTrace(context, match, relaxation) {
  const rule = {
    git: "git:analyzeGitMatch",
    rm: "analyzer/rm.ts:analyzeRmMatch",
    cmd: "analyzer/cmd.ts:analyzeCmdMatch",
    powershell: "analyzer/powershell-wrapper.ts:analyzePowerShellWrapperMatch",
    pwsh: "analyzer/powershell-wrapper.ts:analyzePowerShellWrapperMatch",
    find: "analyzer/find.ts:analyzeFindMatch",
    xargs: "analyzer/xargs.ts:analyzeXargs",
    parallel: "analyzer/parallel.ts:analyzeParallel"
  }[context.head];
  if (!rule)
    return;
  context.options.trace?.recordSegment({
    type: "rule-check",
    rule,
    matched: !!match || !!relaxation,
    reason: match?.reason ?? relaxation?.originalReason
  });
  if (relaxation) {
    context.options.trace?.recordSegment({
      type: relaxation.kind === "worktree" ? "worktree-relaxation" : "temp-root-relaxation",
      originalReason: relaxation.originalReason,
      gitCwd: relaxation.gitCwd
    });
  }
}
function reserveWrapperNormalization(budget) {
  if (budget.iterations >= import_budget.LIMITS.wrapperPeelIterations.cap) {
    throw new import_budget.AnalysisLimit("wrapperPeelIterations");
  }
  budget.iterations++;
}
function blockResultFromMatch(match) {
  return { reason: match.reason, ruleId: match.id, intent: match.intent };
}
function dynamicShellSourceResult(trace) {
  trace?.recordSegment({ type: "error", message: import_reasons.REASON_DYNAMIC_SHELL_SOURCE });
  return blockResultFromMatch(import_reasons.dynamicShellSourceMatch());
}
function isShellWrapperCommand(head, normalizedHead) {
  return import_constants4.SHELL_WRAPPERS.has(normalizedHead) || head === "$SHELL" || head === "${SHELL}" || import_constants4.SHELL_WRAPPERS.has(import_tokens5.getBasename(normalizedHead));
}
function filterBuiltInCommandMatch(match, policy) {
  return match?.id.startsWith("custom.") || match?.id === "raw-text.dangerous-command" ? match : import_effective_rules2.filterDestructiveCommandMatch(match, policy);
}
var CWD_CHANGE_REGEX = /^\s*(?:\$\(\s*)?[({]*\s*(?:command\s+|builtin\s+)?(?:cd|pushd|popd)(?:\s|$)/;
var HEADS_STILL_SCANNED_FOR_EMBEDDED = new Set(["powershell", "pwsh"]);
var POWERSHELL_LOCATION_COMMANDS = new Set([
  "cd",
  "chdir",
  "pop-location",
  "popd",
  "push-location",
  "pushd",
  "set-location",
  "sl"
]);
function posixSegmentChangesCwd(segment, environment) {
  const unwrapped = getCwdChangeTokens(segment, environment);
  if (unwrapped.length === 0)
    return false;
  const head = unwrapped[getCdCommandIndex(unwrapped)];
  if (head === "cd" || head === "pushd" || head === "popd")
    return true;
  return CWD_CHANGE_REGEX.test(segment.join(" "));
}
function resolveCwdAfterCommandView(commandView, cwd, environment, shellAssignments, literalPipelineInput) {
  if (commandView.dialect === "powershell") {
    const effect = getPowerShellLocationEffect(commandView.words, literalPipelineInput);
    if (effect.kind === "none")
      return;
    if (!cwd || effect.kind === "unknown")
      return null;
    return resolveKnownCwdTarget(normalizePowerShellLocationTarget(effect.target), cwd, environment.paths);
  }
  const segment = commandView.words.map(import_command_words4.analysisWordText);
  const assignsCdpath = segment.some((token) => /^CDPATH\+?=/.test(token));
  if (!posixSegmentChangesCwd(segment, environment))
    return assignsCdpath ? null : undefined;
  if (!cwd)
    return null;
  const unwrapped = getCwdChangeTokens(segment, environment, cwd);
  const cdIndex = getCdCommandIndex(unwrapped);
  if (cdIndex === -1 || unwrapped[cdIndex] !== "cd") {
    return null;
  }
  const operands = unwrapped.slice(cdIndex + 1);
  const optionEnd = operands.findIndex((token) => token.length <= 1 || !token.startsWith("-") || token === "--");
  const options = optionEnd === -1 ? operands : operands.slice(0, optionEnd);
  if (options.some((token) => !/^-[LP]+$/.test(token)))
    return null;
  const rest = optionEnd === -1 ? [] : operands.slice(optionEnd);
  const targets = rest[0] === "--" ? rest.slice(1) : rest;
  if (targets.length > 1)
    return null;
  const rawTarget = targets[0];
  const home = shellAssignments.get("HOME") || environment.home;
  if (rawTarget === undefined) {
    return resolveKnownCwdTarget(import_canonicalization.normalizeMsysDrivePath(home), cwd, environment.paths);
  }
  const targetWord = commandView.words.find((word) => word.provenance === "variable" && word.text === rawTarget);
  const tildeWord = commandView.words.find((word) => word.text === rawTarget && /^~(?:\/|$)/.test(word.raw));
  const target = targetWord ? import_shell_git_env3.expandKnownVariableWord(targetWord, new Map([...shellAssignments, ["HOME", home]])) : tildeWord ? `${home}${rawTarget.slice(1)}` : rawTarget;
  if (target === null)
    return null;
  if (!/^(?:[./]|[A-Za-z]:[\\/])/.test(target) && (assignsCdpath || environment.env.has("CDPATH"))) {
    return null;
  }
  return resolveKnownCwdTarget(import_canonicalization.normalizeMsysDrivePath(target), cwd, environment.paths);
}
function resolveKnownCwdTarget(target, cwd, paths) {
  if (!target || target === "-" || target.startsWith("~") || target.includes("$") || target.includes("`")) {
    return null;
  }
  try {
    const resolved = import_chdir2.resolveChdirTarget(cwd, target, paths);
    return paths.isDirectory(resolved) ? resolved : null;
  } catch {
    return null;
  }
}
function getPowerShellLocationEffect(words, literalPipelineInput) {
  const commandIndex = isBarePowerShellCallOperator(words[0]) ? 1 : 0;
  const commandWord = words[commandIndex];
  if (!isStaticPowerShellCommandWord(commandWord, commandIndex === 1))
    return { kind: "none" };
  const command = commandWord.text.toLowerCase();
  const bareCommand = command.split(/[\\/]/).pop() ?? command;
  if (!POWERSHELL_LOCATION_COMMANDS.has(bareCommand))
    return { kind: "none" };
  if (command !== bareCommand || bareCommand === "pop-location" || bareCommand === "popd") {
    return { kind: "unknown" };
  }
  return getPowerShellLocationArgumentEffect(words.slice(commandIndex + 1), literalPipelineInput);
}
function isBarePowerShellCallOperator(word) {
  return word?.provenance === "literal" && !word.quoted && word.raw === word.text && (word.text === "&" || word.text === ".");
}
function isStaticPowerShellCommandWord(word, invoked) {
  return word?.provenance === "literal" && (invoked || !word.quoted && word.raw === word.text);
}
function getPowerShellLocationArgumentEffect(args, literalPipelineInput) {
  let target;
  for (const word of args) {
    if (word.provenance !== "literal" || target !== undefined)
      return { kind: "unknown" };
    target = word.text;
  }
  if (target !== undefined)
    return { kind: "target", target };
  return literalPipelineInput === undefined ? { kind: "unknown" } : { kind: "target", target: literalPipelineInput };
}
function normalizePowerShellLocationTarget(target) {
  return target.includes("::") ? undefined : target.replaceAll("\\", "/");
}
function getCdCommandIndex(tokens) {
  let headIndex = 0;
  if (tokens[0] === "builtin" && tokens.length > 1) {
    headIndex = 1;
  }
  if (tokens[headIndex] !== "time") {
    return headIndex;
  }
  let i = headIndex + 1;
  while (tokens[i]?.startsWith("-")) {
    i++;
  }
  return i;
}
function getCwdChangeTokens(segment, environment, cwd) {
  const stripped = stripLeadingGrouping(segment);
  return import_wrapper_prelude2.stripWrappers([...stripped], environment, cwd);
}
function stripLeadingGrouping(tokens) {
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token !== "{" && token !== "(" && token !== "$(")
      break;
    i++;
  }
  return tokens.slice(i);
}

// src/gate/analyzer/analyze-command.ts
var import_shell_git_env4 = require("./analyzer.js");
var import_shell_wrappers2 = require("./analyzer.js");
var import_wrapper_prelude3 = require("./analyzer.js");
var REASON_UNQUOTED_HEREDOC = "Unquoted heredoc input is not supported safely. Quote the delimiter or ask the user to verify.";
var REASON_UNSUPPORTED_HEREDOC = "This heredoc form or stdin consumer is not supported safely. Use a quoted heredoc with a supported consumer (cat, tee, git apply, git commit, gh pr create, gh issue create), or ask the user to verify.";
function analyzeCommandInternal(command, depth, options, parsedProgram) {
  if (depth >= import_budget2.LIMITS.recursionDepth.cap) {
    options.trace?.recordSegment({ type: "error", message: import_reasons2.REASON_RECURSION_LIMIT });
    return {
      reason: import_reasons2.REASON_RECURSION_LIMIT,
      segment: command,
      ruleId: "analysis.recursion-limit",
      intent: "stop_and_explain"
    };
  }
  const program = parsedProgram ?? options.factStore?.getCommandProgram(command, options.shell ?? "auto") ?? import_parse6.parseCommand(command, options.shell);
  if (program.status === "limited") {
    options.trace?.recordSegment({ type: "error", message: import_reasons2.REASON_RECURSION_LIMIT });
    return {
      reason: import_reasons2.REASON_RECURSION_LIMIT,
      segment: command,
      ruleId: "analysis.recursion-limit",
      intent: "stop_and_explain"
    };
  }
  if (program.status === "invalid") {
    const heredocIssue = program.issues.find((issue) => issue.code.includes("heredoc"));
    if (heredocIssue) {
      if (!options.strict)
        return analyzeUnparseableCommand(command, options);
      const reason = `${import_reasons2.REASON_UNSUPPORTED_HEREDOC_SYNTAX}: ${heredocIssue.message}`;
      options.trace?.recordGlobal({ type: "error", message: reason });
      return {
        reason,
        segment: command,
        ruleId: "analysis.unsupported-heredoc",
        intent: "stop_and_explain"
      };
    }
    recordStrictUnparseable(command, options);
    return {
      reason: import_reasons2.REASON_STRICT_UNPARSEABLE,
      segment: command,
      ruleId: "analysis.strict-unparseable",
      intent: "stop_and_explain"
    };
  }
  if (options.strict && program.status === "partial") {
    recordStrictUnparseable(command, options);
    return {
      reason: import_reasons2.REASON_STRICT_UNPARSEABLE,
      segment: command,
      ruleId: "analysis.strict-unparseable",
      intent: "stop_and_explain"
    };
  }
  const hasUnclosedQuote = program.issues.some((issue) => issue.code.includes("quote"));
  if (hasUnclosedQuote) {
    return analyzeUnparseableCommand(command, options);
  }
  const originalCwd = options.cwd;
  const effectiveCwd = options.effectiveCwd !== undefined ? options.effectiveCwd : options.cwd;
  const shellGitContextState = import_shell_git_env4.createShellGitContextEnvState(options.environment.env, options.envAssignments);
  return analyzeProgram(program, depth, { ...options, rootProgram: program }, originalCwd, [
    {
      effectiveCwd,
      shellGitContextState,
      literalHeredocFiles: new Map(options.literalHeredocFiles),
      functionDefinitions: new Map(options.functionDefinitions),
      createdDirectories: new Set,
      compoundBodies: []
    }
  ]).result;
}
function analyzeProgram(program, depth, options, originalCwd, initialStates) {
  let states = [...initialStates];
  let conditionalStates;
  let previousConnector;
  let pipelineOutcome;
  for (const [nodeIndex, node] of program.nodes.entries()) {
    if (node.kind === "connector") {
      previousConnector = node.operator;
      continue;
    }
    const nextNode = program.nodes[nodeIndex + 1];
    const nextConnector = nextNode?.kind === "connector" ? nextNode.operator : undefined;
    const isolated = isAnalysisNodeIsolated(program, nodeIndex, node, previousConnector, nextConnector);
    const conditional = previousConnector === "&&" || previousConnector === "||";
    const priorConditionalStates = conditional ? conditionalStates : undefined;
    const executionStates = previousConnector === "&&" ? priorConditionalStates?.success ?? states : previousConnector === "||" ? priorConditionalStates?.failure ?? states : states;
    const skippedSuccessStates = previousConnector === "||" ? priorConditionalStates?.success ?? [] : [];
    const skippedFailureStates = previousConnector === "&&" ? priorConditionalStates?.failure ?? [] : [];
    const connectorOutcome = {
      connector: previousConnector,
      skippedSuccessStates,
      skippedFailureStates
    };
    if (isPipelineConnector(nextConnector) && !isPipelineConnector(previousConnector)) {
      pipelineOutcome = connectorOutcome;
    }
    const outcome = isPipelineConnector(nextConnector) ? { connector: undefined, skippedSuccessStates: [], skippedFailureStates: [] } : isPipelineConnector(previousConnector) ? pipelineOutcome ?? connectorOutcome : connectorOutcome;
    const tracksCommandOutcome = isConditionalConnector(outcome.connector) || isConditionalConnector(nextConnector);
    if (node.kind === "function") {
      const successStates = executionStates.flatMap((state) => {
        const definedState = cloneAnalysisState(state);
        definedState.functionDefinitions.set(node.name, node.body);
        return getSuccessfulAnalysisStates(state, [definedState], isolated, nextConnector === "&", isConditionalConnector(nextConnector));
      });
      const next = finishControlFlowStep(successStates, [], outcome.skippedSuccessStates, outcome.skippedFailureStates, outcome.connector, nextConnector);
      states = next.states;
      conditionalStates = next.conditionalStates;
      previousConnector = undefined;
      continue;
    }
    if (node.kind === "group") {
      const successStates = [];
      const failureStates = [];
      for (const state of executionStates) {
        const analysis = analyzeProgram(node.body, depth, options, originalCwd, [
          cloneAnalysisState(state)
        ]);
        if (analysis.result)
          return analysis;
        successStates.push(...getSuccessfulAnalysisStates(state, analysis.states, isolated, nextConnector === "&", isConditionalConnector(nextConnector)));
        if (tracksCommandOutcome) {
          failureStates.push(state, ...isolated ? analysis.states.map((nextState) => isolateFilesystemState(state, nextState)) : analysis.states);
        }
      }
      const next = finishControlFlowStep(successStates, failureStates, outcome.skippedSuccessStates, outcome.skippedFailureStates, outcome.connector, nextConnector);
      states = next.states;
      conditionalStates = next.conditionalStates;
      previousConnector = undefined;
      continue;
    }
    if (node.kind !== "command")
      continue;
    const negated = isNegation(program.nodes[nodeIndex - 1]);
    const segmentIndex = options.trace?.flattenNested ? options.trace.currentSegmentIndex : options.trace?.allocateSegment();
    const pipelineSource = program.nodes[nodeIndex - 2];
    const literalShellInput = isPipelineConnector(previousConnector) && pipelineSource?.kind === "command" ? extractLiteralPrintfOutput(pipelineSource) ?? extractLiteralPowerShellPipelineOutput(pipelineSource) : undefined;
    const successStates = [];
    const failureStates = [];
    for (const state of executionStates) {
      const nestedAnalysis = analyzeCommandNestedPrograms(node, depth, options, originalCwd, [
        cloneAnalysisState(state)
      ]);
      if (nestedAnalysis.result)
        return { result: nestedAnalysis.result, states };
      const commandStates = program.dialect === "powershell" ? nestedAnalysis.states : nestedAnalysis.states.map((nestedState) => isolateFilesystemState(state, nestedState));
      for (const commandState of commandStates) {
        const analyzedState = cloneAnalysisState(commandState);
        const result = analyzeCommandView(node, depth, options.trace ? { ...options, trace: withTraceSegment(options.trace, segmentIndex) } : options, originalCwd, analyzedState, isPipelineConnector(previousConnector), literalShellInput);
        if (result)
          return { result, states };
        const functionBody = getCalledFunctionBody(node, analyzedState.functionDefinitions);
        if (functionBody) {
          options.budget.charge("derivedTokens", countCommandProgramWords(functionBody));
        }
        const functionAnalysis = functionBody ? depth + 1 >= import_budget2.LIMITS.recursionDepth.cap ? recursionLimitAnalysis(node.displayText, options, [analyzedState]) : analyzeProgram(functionBody, depth + 1, options, originalCwd, [analyzedState]) : {
          result: null,
          states: forkForLoopStates(node, analyzedState).flatMap((loopState) => forkUncertainCwdStates(node, commandState, loopState, negated))
        };
        if (functionAnalysis.result)
          return functionAnalysis;
        successStates.push(...getSuccessfulAnalysisStates(state, functionAnalysis.states, isolated, nextConnector === "&", isConditionalConnector(nextConnector)));
        const enteredExistingDirectory = typeof analyzedState.effectiveCwd === "string" && analyzedState.effectiveCwd !== commandState.effectiveCwd && node.redirections.every((redirection) => ["<", ">", ">>", ">|"].includes(redirection.operator) && redirection.target?.text === "/dev/null");
        if (tracksCommandOutcome && (negated || !enteredExistingDirectory)) {
          failureStates.push(state);
          failureStates.push(...functionAnalysis.states.map((functionState) => isolated ? isolateFilesystemState(state, functionState) : functionState));
        }
      }
    }
    const next = finishControlFlowStep(successStates, failureStates, outcome.skippedSuccessStates, outcome.skippedFailureStates, outcome.connector, nextConnector);
    states = next.states;
    conditionalStates = next.conditionalStates;
    previousConnector = undefined;
  }
  return { result: null, states };
}
function isAnalysisNodeIsolated(program, nodeIndex, node, previousConnector, nextConnector) {
  if (node.kind === "group" && node.style === "subshell")
    return true;
  if (program.dialect === "posix" && (isPipelineConnector(previousConnector) || isPipelineConnector(nextConnector))) {
    return true;
  }
  if (nextConnector === "&")
    return true;
  return program.dialect === "powershell" && node.kind === "group" && node.style === "brace" && powerShellBraceStateIsIsolated(program, nodeIndex);
}
function getSuccessfulAnalysisStates(initialState, analyzedStates, isolated, background, retainInitialFilesystemState) {
  const completedStates = isolated ? analyzedStates.map((state) => isolateFilesystemState(initialState, state)) : [...analyzedStates];
  const filesystemStates = retainInitialFilesystemState ? completedStates.flatMap((state) => optionalMapsEqual(initialState.literalHeredocFiles, state.literalHeredocFiles) ? [state] : [
    {
      ...state,
      literalHeredocFiles: new Map(initialState.literalHeredocFiles)
    },
    state
  ]) : completedStates;
  return background ? [initialState, ...filesystemStates] : filesystemStates;
}
function isolateFilesystemState(initialState, analyzedState) {
  return {
    ...initialState,
    literalHeredocFiles: new Map(analyzedState.literalHeredocFiles),
    createdDirectories: new Set(analyzedState.createdDirectories)
  };
}
function powerShellBraceStateIsIsolated(program, nodeIndex) {
  const header = program.nodes.slice(0, nodeIndex).reverse().find((node) => node.kind === "command" || node.kind === "connector");
  if (!header || header.kind !== "command")
    return true;
  const head = header.words[0]?.text.toLowerCase();
  if (head === "&" || head === ".")
    return false;
  if (head === "write-output" || head === "function" || head === "start-job")
    return true;
  if (getPowerShellScriptBlockAssignmentName(header))
    return true;
  return header.source.replaceAll(/\s/g, "").toLowerCase() === "if($false)";
}
function isPipelineConnector(connector) {
  return connector === "|" || connector === "|&";
}
function extractLiteralPowerShellPipelineOutput(command) {
  if (command?.dialect !== "powershell")
    return;
  if (command.words.length === 1 && command.words[0]?.quoted && command.words[0].provenance === "literal") {
    return command.words[0].text;
  }
  if (command.words[0]?.text.toLowerCase() === "write-output" && command.words.length === 2 && command.words[1]?.provenance === "literal") {
    return command.words[1].text;
  }
  return;
}
function isConditionalConnector(connector) {
  return connector === "&&" || connector === "||";
}
function finishControlFlowStep(successStates, failureStates, skippedSuccessStates, skippedFailureStates, previousConnector, nextConnector) {
  const outcomes = {
    success: deduplicateAnalysisStates([...skippedSuccessStates, ...successStates]),
    failure: deduplicateAnalysisStates([...skippedFailureStates, ...failureStates])
  };
  const conditionalStates = isConditionalConnector(nextConnector) ? outcomes : undefined;
  return {
    states: isConditionalConnector(previousConnector) || conditionalStates ? deduplicateAnalysisStates([...outcomes.success, ...outcomes.failure]) : outcomes.success,
    conditionalStates
  };
}
function withTraceSegment(trace, currentSegmentIndex, flattenNested = trace.flattenNested) {
  return {
    currentSegmentIndex,
    flattenNested,
    allocateSegment: trace.allocateSegment,
    getNextSegmentIndex: trace.getNextSegmentIndex,
    recordGlobal: trace.recordGlobal,
    recordSegment: (step, segmentIndex = currentSegmentIndex) => trace.recordSegment(step, segmentIndex)
  };
}
function analyzeCommandNestedPrograms(commandView, depth, options, originalCwd, initialStates) {
  const programs = commandView.nested.map((program) => ({
    program,
    depth
  }));
  if (commandView.dialect === "powershell") {
    const evaluatedSource = getLiteralPowerShellEvaluationSource(commandView);
    if (evaluatedSource) {
      if (depth + 1 >= import_budget2.LIMITS.recursionDepth.cap) {
        return recursionLimitAnalysis(evaluatedSource, options, initialStates);
      }
      const evaluatedProgram = import_parse6.parseCommand(evaluatedSource, "powershell");
      if (evaluatedProgram.status === "limited") {
        return recursionLimitAnalysis(evaluatedSource, options, initialStates);
      }
      if (evaluatedProgram.status !== "complete") {
        return analyzeNestedPrograms(programs, options, originalCwd, initialStates);
      }
      options.budget.charge("derivedTokens", countCommandProgramWords(evaluatedProgram));
      programs.push({ program: evaluatedProgram, depth: depth + 1 });
    }
  }
  return analyzeNestedPrograms(programs, options, originalCwd, initialStates);
}
function getPowerShellScriptBlockAssignmentName(commandView) {
  const variable = commandView.words[0];
  return variable?.provenance === "variable" && commandView.words.at(-1)?.text === "=" ? variable.text.toLowerCase() : undefined;
}
function analyzeNestedPrograms(programs, options, originalCwd, initialStates) {
  let states = [...initialStates];
  for (const target of programs) {
    const nextStates = [];
    for (const state of states) {
      const analysis = analyzeProgram(target.program, target.depth, options, originalCwd, [
        cloneAnalysisState(state)
      ]);
      if (analysis.result)
        return analysis;
      nextStates.push(...analysis.states);
    }
    states = deduplicateAnalysisStates(nextStates);
  }
  return { result: null, states };
}
function getLiteralPowerShellEvaluationSource(commandView) {
  const invoked = commandView.words[0]?.provenance === "literal" && !commandView.words[0].quoted && commandView.words[0].raw === commandView.words[0].text && (commandView.words[0].text === "&" || commandView.words[0].text === ".");
  const commandIndex = invoked ? 1 : 0;
  const command = commandView.words[commandIndex];
  if (command?.provenance !== "literal" || !invoked && (command.quoted || command.raw !== command.text) || !["iex", "invoke-expression"].includes(command.text.toLowerCase())) {
    return;
  }
  const args = commandView.words.slice(commandIndex + 1);
  const sourceIndex = args[0] && !args[0].quoted && args[0].raw === args[0].text && ["-c", "-command"].includes(args[0].text.toLowerCase()) ? 1 : 0;
  const source = args[sourceIndex];
  return args.length === sourceIndex + 1 && source?.quoted && source.provenance === "literal" ? source.text : undefined;
}
function countCommandProgramWords(program) {
  return program.nodes.reduce((count, node) => count + (node.kind === "command" ? node.words.length + node.nested.reduce((sum, nested) => sum + countCommandProgramWords(nested), 0) : node.kind === "group" || node.kind === "function" ? countCommandProgramWords(node.body) : 0), 0);
}
function recursionLimitAnalysis(segment, options, states) {
  options.trace?.recordSegment({ type: "error", message: import_reasons2.REASON_RECURSION_LIMIT });
  return {
    result: {
      reason: import_reasons2.REASON_RECURSION_LIMIT,
      segment,
      ruleId: "analysis.recursion-limit",
      intent: "stop_and_explain"
    },
    states: [...states]
  };
}
function analyzeCommandView(commandView, depth, inheritedOptions, originalCwd, state, hasPipelineInput, literalShellInput) {
  const options = {
    ...inheritedOptions,
    environment: {
      ...inheritedOptions.environment,
      env: state.shellGitContextState.env,
      paths: withCreatedDirectories(inheritedOptions.environment.paths, state.createdDirectories, inheritedOptions.budget)
    }
  };
  const heredocReason = getHeredocReason(commandView, !options.strict);
  if (heredocReason && options.strict) {
    options.trace?.recordSegment({ type: "error", message: heredocReason });
    return {
      reason: heredocReason,
      segment: commandView.source,
      ruleId: "analysis.unsupported-heredoc",
      intent: "stop_and_explain"
    };
  }
  invalidateLiteralHeredocFiles(commandView, state, "before-consumer", options.environment.paths, options.budget);
  const words = import_command_words5.analyzedViewWords(commandView.dialect, commandView.words);
  const segment = words.map(import_command_words5.analysisWordText);
  const segmentStr = commandView.displayText;
  const envSegment = import_shell_git_env4.segmentTokensWithExpandedAssignments(words, state.shellGitContextState);
  const segmentEnvAssignments = import_shell_git_env4.getSegmentGitContextEnvAssignments(envSegment, state.shellGitContextState);
  if (commandView.dialect === "powershell") {
    const match = import_effective_rules3.filterDestructiveCommandMatch(import_remove_item.analyzePowerShellCommandViewMatch(commandView, hasPipelineInput, getPowerShellRemoveItemOptions(options, state.effectiveCwd)), options.policy);
    options.trace?.recordSegment({
      type: "rule-check",
      rule: "analyzer/powershell/remove-item.ts:analyzePowerShellCommandViewMatch",
      matched: !!match,
      reason: match?.reason
    });
    if (match)
      return resultFromCommandMatch(segmentStr, match);
  }
  if (segment.length === 1 && segment[0]?.includes(" ") && !import_model.isDynamicExecutable(commandView.dialect, commandView.words)) {
    const textMatch = import_effective_rules3.filterDestructiveCommandMatch(import_dangerous_text2.dangerousInTextMatch(segment[0]), options.policy);
    const deferredToUseTime = textMatch !== null && !options.strict && import_deferred_assignment.isDataOnlyQuotedAssignment(commandView, options.rootProgram);
    if (textMatch && !deferredToUseTime) {
      options.trace?.recordSegment({
        type: "dangerous-text",
        token: segment[0],
        matched: true,
        reason: textMatch.reason
      });
      return {
        reason: textMatch.reason,
        segment: segmentStr,
        ruleId: textMatch.id,
        intent: textMatch.intent
      };
    }
    options.trace?.recordSegment({ type: "dangerous-text", token: segment[0], matched: false });
    const deferredResult = finalizeAnalyzedCommandView(commandView, heredocReason, state, segmentEnvAssignments, literalShellInput, options);
    if (deferredResult)
      return deferredResult;
    import_shell_git_env4.applyShellGitContextEnvSegment(envSegment, state.shellGitContextState);
    return null;
  }
  const result = analyzeSegment(commandView.words, depth, {
    ...options,
    commandView,
    cwd: originalCwd,
    effectiveCwd: state.effectiveCwd,
    envAssignments: segmentEnvAssignments,
    shellAssignments: state.shellGitContextState.shellAssignments,
    literalHeredocFiles: state.literalHeredocFiles,
    functionDefinitions: state.functionDefinitions,
    hasPipelineInput,
    literalShellInput,
    analyzeNested: (nestedCommand, overrides) => {
      const nestedEffectiveCwd = overrides && Object.hasOwn(overrides, "effectiveCwd") ? overrides.effectiveCwd : state.effectiveCwd;
      const nestedResult = analyzeCommandInternal(nestedCommand, depth + 1, {
        ...options,
        effectiveCwd: nestedEffectiveCwd,
        envAssignments: overrides?.envAssignments ?? segmentEnvAssignments,
        literalHeredocFiles: state.literalHeredocFiles,
        functionDefinitions: overrides?.functionDefinitions,
        worktreeMode: overrides?.worktreeMode ?? options.worktreeMode,
        shell: overrides?.shell ?? options.shell,
        trace: options.trace ? withTraceSegment(options.trace, options.trace.currentSegmentIndex, true) : undefined
      });
      return nestedResult ? {
        reason: nestedResult.reason,
        ruleId: nestedResult.ruleId,
        intent: nestedResult.intent
      } : null;
    }
  });
  if (result)
    return { ...result, segment: segmentStr };
  const postCommandResult = finalizeAnalyzedCommandView(commandView, heredocReason, state, segmentEnvAssignments, literalShellInput, options);
  if (postCommandResult)
    return postCommandResult;
  import_shell_git_env4.applyShellGitContextEnvSegment(envSegment, state.shellGitContextState);
  return null;
}
function finalizeAnalyzedCommandView(commandView, heredocReason, state, segmentEnvAssignments, literalShellInput, options) {
  const heredocResult = analyzeUnsupportedHeredoc(commandView, heredocReason, state, segmentEnvAssignments ?? new Map, options);
  if (heredocResult)
    return heredocResult;
  invalidateLiteralHeredocFiles(commandView, state, "after-consumer", options.environment.paths, options.budget);
  state.literalHeredocFiles.clear();
  trackLiteralHeredocFiles(commandView, heredocReason, state, options.environment.paths, options.budget);
  trackCreatedDirectories(commandView, state, options.environment.paths, options.budget);
  updateCwdAfterCommandView(commandView, state, literalShellInput, options.environment, options.trace);
  return null;
}
var FILE_NONTRUNCATING_WRITE_REDIRECTIONS = new Set([">>", "<>"]);
function invalidateLiteralHeredocFiles(commandView, state, phase, paths, budget) {
  for (const redirection of commandView.redirections) {
    const writesFile = phase === "before-consumer" ? isTruncatingFileRedirection(redirection) : FILE_NONTRUNCATING_WRITE_REDIRECTIONS.has(redirection.operator);
    if (!writesFile)
      continue;
    invalidateLiteralHeredocFile(redirection.target, state, paths, budget);
  }
  if (phase !== "before-consumer" || !isBareCommandWord(commandView.words[0], "tee"))
    return;
  const teeArguments = getTeeArguments(commandView.words.slice(1));
  if (!teeArguments)
    return;
  for (const operand of teeArguments.operands) {
    invalidateLiteralHeredocFile(operand, state, paths, budget);
  }
}
function isTruncatingFileRedirection(redirection) {
  if (redirection.operator === ">" || redirection.operator === ">|")
    return true;
  return redirection.operator === ">&" && redirection.fd === undefined && redirection.target?.provenance === "literal" && !/^(?:[0-9]+|-)$/.test(redirection.target.text);
}
function invalidateLiteralHeredocFile(target, state, paths, budget) {
  const path = target?.provenance === "literal" ? import_heredoc_files2.resolveTrackedHeredocPath(target.text, state.effectiveCwd, paths, budget) : undefined;
  if (!path)
    return;
  state.literalHeredocFiles.delete(path);
}
function trackLiteralHeredocFiles(commandView, heredocReason, state, paths, budget) {
  if (heredocReason)
    return;
  const heredoc = commandView.redirections.find((redirection) => redirection.operator === "<<" || redirection.operator === "<<-")?.heredoc;
  if (!heredoc)
    return;
  for (const target of getLiteralHeredocOutputTargets(commandView, state.shellGitContextState.shellAssignments)) {
    const path = import_heredoc_files2.resolveTrackedHeredocPath(target, state.effectiveCwd, paths, budget);
    if (!path || !import_heredoc_files2.isPersistentHeredocFilePath(path))
      continue;
    if (!state.literalHeredocFiles.has(path) && state.literalHeredocFiles.size >= import_budget2.LIMITS.trackedHeredocFiles.cap) {
      throw new import_budget2.AnalysisLimit("trackedHeredocFiles");
    }
    state.literalHeredocFiles.set(path, heredoc.body);
  }
}
function getLiteralHeredocOutputTargets(commandView, assignments) {
  const stdoutTarget = fileWordPath(getFinalStdoutRedirection(commandView.redirections)?.target, assignments);
  const stdoutTargets = stdoutTarget === undefined ? [] : [stdoutTarget];
  if (isBareCommandWord(commandView.words[0], "cat")) {
    return catWritesHeredocVerbatim(commandView.words) ? stdoutTargets : [];
  }
  if (!isBareCommandWord(commandView.words[0], "tee"))
    return [];
  const teeArguments = getTeeArguments(commandView.words.slice(1), assignments);
  if (!teeArguments || teeArguments.append || teeArguments.hasUnsupportedOptions)
    return [];
  const operandPaths = teeArguments.operands.map((operand) => fileWordPath(operand, assignments));
  if (!operandPaths.every((path) => path !== undefined))
    return [];
  return [...operandPaths, ...stdoutTargets];
}
function fileWordPath(word, assignments) {
  if (isTrackableLiteralFileWord(word))
    return word.text;
  return (word && import_shell_git_env4.expandKnownVariableWord(word, assignments)) ?? undefined;
}
function withCreatedDirectories(paths, created, budget) {
  if (created.size === 0)
    return paths;
  const isCreated = (path) => {
    const canonical = import_canonicalization2.resolveExistingPath(path, paths, budget);
    return [...created].some((leaf) => leaf === canonical || leaf.startsWith(`${canonical}${import_node_path4.sep}`));
  };
  return {
    realpath: (path) => paths.realpath(path) ?? (isCreated(path) ? import_canonicalization2.resolveExistingPath(path, paths, budget) : null),
    entryKind: (path) => {
      const kind = paths.entryKind(path);
      return kind === "missing" && isCreated(path) ? "present" : kind;
    },
    isDirectory: (path) => paths.isDirectory(path) || isCreated(path)
  };
}
function trackCreatedDirectories(commandView, state, paths, budget) {
  if (state.shellGitContextState.bodyDepth > 0 || !isBareCommandWord(commandView.words[0], "mkdir")) {
    return;
  }
  const args = commandView.words.slice(1).map((word) => fileWordPath(word, state.shellGitContextState.shellAssignments));
  if (!args.every((arg) => arg !== undefined))
    return;
  const optionEnd = args.findIndex((arg) => arg === "--" || arg === "-" || !arg.startsWith("-"));
  const options = args.slice(0, optionEnd);
  if (optionEnd === -1 || !options.every((option) => /^(?:-[pv]+|--parents|--verbose)$/.test(option))) {
    return;
  }
  const parents = options.some((option) => option === "--parents" || /^-v*p/.test(option));
  const cwd = state.effectiveCwd;
  for (const operand of args.slice(args[optionEnd] === "--" ? optionEnd + 1 : optionEnd)) {
    if (operand.split(/[\\/]/).includes("..") || !import_node_path4.isAbsolute(operand) && !cwd)
      continue;
    const leaf = import_canonicalization2.resolveExistingPath(import_node_path4.resolve(cwd ?? "", operand), paths, budget);
    const creates = parents ? mkdirParentsCreates(leaf, paths) : paths.isDirectory(import_node_path4.dirname(leaf)) && isMissing(leaf, paths);
    if (creates)
      state.createdDirectories.add(leaf);
  }
}
function mkdirParentsCreates(path, paths) {
  const root = import_node_path4.parse(path).root;
  const components = path.slice(root.length).split(/[\\/]+/).filter(Boolean);
  const prefixAt = (index) => import_node_path4.join(root, ...components.slice(0, index + 1));
  const firstNonDirectory = components.findIndex((_, index) => !paths.isDirectory(prefixAt(index)));
  return firstNonDirectory === -1 || isMissing(prefixAt(firstNonDirectory), paths);
}
function isMissing(path, paths) {
  try {
    return paths.entryKind(path) === "missing";
  } catch {
    return false;
  }
}
function catWritesHeredocVerbatim(words) {
  let optionTerminated = false;
  for (const word of words.slice(1)) {
    if (optionTerminated || word.provenance !== "literal")
      return false;
    if (word.text === "--") {
      optionTerminated = true;
      continue;
    }
    if (!/^-u+$/.test(word.text))
      return false;
  }
  return true;
}
function getFinalStdoutRedirection(redirections) {
  const redirection = redirections.findLast((candidate) => (candidate.fd ?? ([">", ">|", ">>", ">&"].includes(candidate.operator) ? 1 : 0)) === 1);
  return redirection?.operator === ">" || redirection?.operator === ">|" ? redirection : undefined;
}
function getTeeArguments(words, assignments = new Map) {
  const operands = [];
  let parsesOptions = true;
  let append = false;
  let hasUnsupportedOptions = false;
  for (const word of words) {
    if (word.provenance !== "literal" && import_shell_git_env4.expandKnownVariableWord(word, assignments) === null) {
      return;
    }
    if (parsesOptions && isBareCommandWord(word, "--")) {
      parsesOptions = false;
      continue;
    }
    if (parsesOptions && !word.quoted && word.raw === word.text && /^-[^-]/.test(word.text)) {
      append ||= word.text.slice(1).includes("a");
      hasUnsupportedOptions ||= Array.from(word.text.slice(1)).some((option) => option !== "a" && option !== "i");
      continue;
    }
    if (parsesOptions && !word.quoted && word.raw === word.text && word.text.startsWith("--")) {
      append ||= word.text === "--append";
      hasUnsupportedOptions ||= word.text !== "--append" && word.text !== "--ignore-interrupts";
      continue;
    }
    operands.push(word);
  }
  return { operands, append, hasUnsupportedOptions };
}
function isTrackableLiteralFileWord(word) {
  if (!word || word.provenance !== "literal" || word.text.length === 0)
    return false;
  if (word.quoted || word.raw !== word.text)
    return true;
  return !word.raw.startsWith("~") && !/[{}]/.test(word.raw);
}
function isBareCommandWord(word, value) {
  return word?.text === value && word.raw === value && word.provenance === "literal" && !word.quoted;
}
function isLiteralHeredoc(heredoc) {
  return heredoc.quotedDelimiter || !/[$`\\]/.test(heredoc.body);
}
function getHeredocReason(commandView, standard) {
  const heredocs = commandView.redirections.filter((redirection) => redirection.operator === "<<" || redirection.operator === "<<-");
  if (heredocs.length === 0)
    return;
  if (heredocs.length !== 1)
    return REASON_UNSUPPORTED_HEREDOC;
  const heredoc = heredocs[0];
  if (!heredoc?.heredoc)
    return REASON_UNSUPPORTED_HEREDOC;
  const bodyHasCommandSubstitution = /\$\(|`/.test(heredoc.heredoc.body);
  if (!isLiteralHeredoc(heredoc.heredoc) && (!standard || bodyHasCommandSubstitution)) {
    return REASON_UNQUOTED_HEREDOC;
  }
  if (heredoc.fd !== undefined && heredoc.fd !== 0)
    return REASON_UNSUPPORTED_HEREDOC;
  if (commandView.redirections.some((redirection) => redirection !== heredoc && ["<", "<<", "<<-", "<<<", "<&", "<>"].includes(redirection.operator))) {
    return REASON_UNSUPPORTED_HEREDOC;
  }
  const outputProcessSubstitution = commandView.redirections.some((redirection) => redirection !== heredoc && hasOutputProcessSubstitution(redirection.target));
  if (isBareCommandWord(commandView.words[0], "cat")) {
    return outputProcessSubstitution ? REASON_UNSUPPORTED_HEREDOC : undefined;
  }
  if (isBareCommandWord(commandView.words[0], "tee")) {
    return outputProcessSubstitution || commandView.words.slice(1).some(hasOutputProcessSubstitution) ? REASON_UNSUPPORTED_HEREDOC : undefined;
  }
  const head = commandView.words[0];
  const sub = commandView.words[1];
  if (isBareCommandWord(head, "git") && (isBareCommandWord(sub, "apply") || isBareCommandWord(sub, "commit"))) {
    return;
  }
  if (isBareCommandWord(head, "gh") && (isBareCommandWord(sub, "pr") || isBareCommandWord(sub, "issue")) && isBareCommandWord(commandView.words[2], "create")) {
    return;
  }
  return REASON_UNSUPPORTED_HEREDOC;
}
function hasOutputProcessSubstitution(word) {
  return word?.parts.some((part) => part.provenance === "command-substitution" && part.raw.startsWith(">(")) ?? false;
}
function analyzeUnsupportedHeredoc(commandView, reason, state, envAssignments, options) {
  if (!reason)
    return null;
  const heredocs = commandView.redirections.filter((redirection) => redirection.operator === "<<" || redirection.operator === "<<-");
  const bodies = heredocs.flatMap((redirection) => redirection.heredoc ? [redirection.heredoc.body] : []);
  if (isInertShellHeredoc(commandView, heredocs, state, envAssignments, options))
    return null;
  const interpreterMatch = analyzeInterpreterHeredocMatch(commandView, heredocs, options);
  if (interpreterMatch !== undefined) {
    return interpreterMatch ? {
      reason: interpreterMatch.reason,
      segment: commandView.displayText,
      ruleId: interpreterMatch.id,
      intent: interpreterMatch.intent
    } : null;
  }
  const result = analyzeUnparseableCommand(bodies.length === heredocs.length ? bodies.join(`
`) : commandView.source, options);
  return result ? { ...result, segment: commandView.displayText } : null;
}
function analyzeInterpreterHeredocMatch(commandView, heredocs, options) {
  const heredoc = heredocs.length === 1 ? heredocs[0] : undefined;
  if (!heredoc?.heredoc || !isLiteralHeredoc(heredoc.heredoc) || heredoc.fd !== undefined && heredoc.fd !== 0) {
    return;
  }
  const words = isBareCommandWord(commandView.words[0], "uv") && isBareCommandWord(commandView.words[1], "run") ? commandView.words.slice(2) : commandView.words;
  const head = words[0];
  if (head?.provenance !== "literal" || !import_transparent_wrappers4.isInterpreterCommand(head.text))
    return;
  const stdinMarker = words.findIndex((word) => isBareCommandWord(word, "-"));
  const stdinIsProgram = words.slice(1, stdinMarker === -1 ? undefined : stdinMarker).every((word) => word.provenance === "literal" && word.text.startsWith("-"));
  if (!stdinIsProgram)
    return;
  const body = heredoc.heredoc.body;
  const paranoidEnabled = import_effective_rules3.destructiveCommandRuleIsEnabled(options.policy, "interpreter.one-liner-paranoid", !!options.paranoidInterpreters);
  options.trace?.recordSegment({
    type: "interpreter",
    interpreter: head.text,
    codeArg: body,
    paranoidBlocked: paranoidEnabled
  });
  if (paranoidEnabled) {
    const filteredParanoidMatch = import_effective_rules3.filterDestructiveCommandMatch(import_destructive4.destructiveCommandMatch("interpreter.one-liner-paranoid", import_interpreters2.REASON_INTERPRETER_BLOCKED), options.policy);
    if (filteredParanoidMatch)
      return filteredParanoidMatch;
  }
  if (!import_interpreters2.containsDangerousCode(body, undefined, !options.strict))
    return null;
  const match = import_effective_rules3.filterDestructiveCommandMatch(import_destructive4.destructiveCommandMatch("interpreter.dangerous-command", import_interpreters2.REASON_INTERPRETER_DANGEROUS), options.policy);
  if (!match)
    return null;
  options.trace?.recordSegment({
    type: "dangerous-text",
    token: body,
    matched: true,
    reason: match.reason
  });
  return match;
}
function isInertShellHeredoc(commandView, heredocs, state, envAssignments, options) {
  const heredoc = heredocs.length === 1 ? heredocs[0] : undefined;
  if (!heredoc?.heredoc || !isLiteralHeredoc(heredoc.heredoc) || heredoc.fd !== undefined && heredoc.fd !== 0) {
    return false;
  }
  const stripped = import_wrapper_prelude3.stripWrapperWords(commandView.words, options.environment, state.effectiveCwd, envAssignments);
  const tokens = stripped.words.map(import_command_words5.analysisWordText);
  const head = import_tokens6.normalizeCommandToken(tokens[0] ?? "");
  if ((stripped.envSplitValues?.length ?? 0) > 0 || !import_constants5.SHELL_WRAPPERS.has(head) && !import_constants5.SHELL_WRAPPERS.has(import_tokens6.getBasename(head))) {
    return false;
  }
  return import_shell_wrappers2.isShellSyntaxCheck(tokens);
}
function updateCwdAfterCommandView(commandView, state, literalPipelineInput, environment, trace) {
  const nextCwd = resolveCwdAfterCommandView(commandView, state.effectiveCwd, environment, state.shellGitContextState.shellAssignments, literalPipelineInput);
  if (nextCwd === null) {
    trace?.recordSegment({
      type: "cwd-change",
      segment: commandView.words.map(import_command_words5.analysisWordText).join(" "),
      effectiveCwdNowUnknown: true
    });
  }
  if (nextCwd !== undefined)
    state.effectiveCwd = nextCwd;
}
var COMPOUND_BODY_CLOSERS = new Set(["fi", "done", "esac"]);
function isNegation(node) {
  return node?.kind === "command" && node.words.length === 1 && node.words[0]?.raw === "!";
}
function forkUncertainCwdStates(view, before, state, negated) {
  const head = view.words[0]?.text ?? "";
  const outerDepth = before.shellGitContextState.bodyDepth;
  const innerDepth = state.shellGitContextState.bodyDepth;
  const bodies = state.compoundBodies;
  if (innerDepth > outerDepth) {
    state.compoundBodies = [
      ...bodies.slice(0, outerDepth),
      {
        entryCwd: before.effectiveCwd,
        branchCwds: bodies[outerDepth]?.branchCwds ?? [],
        hasElse: false
      }
    ];
    return [state];
  }
  const body = outerDepth > 0 ? bodies[outerDepth - 1] : undefined;
  if (body && (head === "else" || head === "elif")) {
    state.compoundBodies = [
      ...bodies.slice(0, outerDepth - 1),
      {
        entryCwd: body.entryCwd,
        branchCwds: [...body.branchCwds, state.effectiveCwd],
        hasElse: head === "else"
      }
    ];
    state.effectiveCwd = body.entryCwd;
    return [state];
  }
  const closesBody = body !== undefined && COMPOUND_BODY_CLOSERS.has(head);
  if (closesBody)
    state.compoundBodies = bodies.slice(0, innerDepth);
  const possibleCwds = new Set([
    state.effectiveCwd,
    ...closesBody ? body.branchCwds : [],
    ...closesBody && !body.hasElse ? [body.entryCwd] : [],
    ...negated ? [before.effectiveCwd] : []
  ]);
  return [...possibleCwds].map((cwd) => {
    if (cwd === state.effectiveCwd)
      return state;
    const alternative = cloneAnalysisState(state);
    alternative.effectiveCwd = cwd;
    return alternative;
  });
}
function compoundBodiesEqual(left, right) {
  return left.length === right.length && left.every((body, index) => {
    const other = right[index];
    return other !== undefined && body.entryCwd === other.entryCwd && body.hasElse === other.hasElse && body.branchCwds.length === other.branchCwds.length && body.branchCwds.every((cwd, branch) => cwd === other.branchCwds[branch]);
  });
}
var FOR_LOOP_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
var FOR_LOOP_WORD_CAP = 8;
function forkForLoopStates(view, state) {
  const name = view.words[1]?.text;
  if (view.dialect !== "posix" || view.words[0]?.text !== "for" || name === undefined || !FOR_LOOP_NAME_RE.test(name)) {
    return [state];
  }
  const items = view.words.slice(3);
  const bindable = view.words[2]?.text === "in" && items.length >= 1 && items.length <= FOR_LOOP_WORD_CAP && items.every((word) => word.provenance === "literal" && !/[\s$`*?[{}~'"\\]/.test(word.text));
  if (!bindable) {
    state.shellGitContextState.shellAssignments.delete(name);
    return [state];
  }
  return items.map((word) => {
    const forked = cloneAnalysisState(state);
    forked.shellGitContextState.shellAssignments.set(name, word.text);
    return forked;
  });
}
function cloneAnalysisState(state) {
  return {
    effectiveCwd: state.effectiveCwd,
    shellGitContextState: import_shell_git_env4.cloneShellGitContextEnvState(state.shellGitContextState),
    literalHeredocFiles: new Map(state.literalHeredocFiles),
    functionDefinitions: new Map(state.functionDefinitions),
    createdDirectories: new Set(state.createdDirectories),
    compoundBodies: state.compoundBodies
  };
}
function deduplicateAnalysisStates(states) {
  const uniqueStates = [];
  for (const state of states) {
    if (!uniqueStates.some((candidate) => analysisStatesEqual(candidate, state))) {
      uniqueStates.push(state);
    }
    if (uniqueStates.length > import_budget2.LIMITS.controlFlowStates.cap) {
      throw new import_budget2.AnalysisLimit("controlFlowStates");
    }
  }
  return uniqueStates;
}
function analysisStatesEqual(left, right) {
  return left.effectiveCwd === right.effectiveCwd && compoundBodiesEqual(left.compoundBodies, right.compoundBodies) && optionalMapsEqual(left.shellGitContextState.env, right.shellGitContextState.env) && optionalMapsEqual(left.literalHeredocFiles, right.literalHeredocFiles) && optionalMapsEqual(left.functionDefinitions, right.functionDefinitions) && optionalMapsEqual(left.shellGitContextState.effectiveEnvAssignments, right.shellGitContextState.effectiveEnvAssignments) && optionalMapsEqual(left.shellGitContextState.shellAssignments, right.shellGitContextState.shellAssignments) && left.shellGitContextState.bodyDepth === right.shellGitContextState.bodyDepth && setsEqual(left.shellGitContextState.bodyAssignments, right.shellGitContextState.bodyAssignments) && setsEqual(left.createdDirectories, right.createdDirectories);
}
function setsEqual(left, right) {
  return left.size === right.size && [...left].every((value) => right.has(value));
}
function optionalMapsEqual(left, right) {
  if (left === right)
    return true;
  if (!left || !right || left.size !== right.size)
    return false;
  return [...left].every(([key, value]) => right.get(key) === value && right.has(key));
}
function getCalledFunctionBody(view, functions) {
  const name = import_model.getCalledCommandName(view);
  return name === undefined ? undefined : functions.get(name);
}
function resultFromCommandMatch(command, match) {
  if (!match)
    return null;
  return {
    reason: match.reason,
    segment: command,
    ruleId: match.id,
    intent: match.intent
  };
}
function getPowerShellRemoveItemOptions(options, effectiveCwd = options.effectiveCwd) {
  const cwdUnknown = effectiveCwd === null;
  return {
    environment: options.environment,
    cwd: cwdUnknown ? undefined : effectiveCwd ?? options.cwd,
    originalCwd: cwdUnknown ? undefined : options.cwd,
    strict: options.strict,
    paranoid: options.paranoidRm,
    allowTmpdirVar: options.allowTmpdirVar,
    protectedGitMetadata: options.protectedGitMetadata,
    policy: options.policy,
    budget: options.budget
  };
}
function analyzeUnparseableCommand(command, options) {
  const textMatch = import_effective_rules3.filterDestructiveCommandMatch(import_dangerous_text2.dangerousInTextMatch(command), options.policy);
  const segmentIndex = options.trace?.currentSegmentIndex ?? options.trace?.allocateSegment();
  const step = {
    type: "dangerous-text",
    token: command,
    matched: !!textMatch,
    reason: textMatch?.reason
  };
  options.trace?.recordSegment(step, segmentIndex);
  if (!textMatch && /^(?:cd|pushd)\s/.test(command)) {
    options.trace?.recordSegment({ type: "cwd-change", segment: command, effectiveCwdNowUnknown: true }, segmentIndex);
  }
  return textMatch ? {
    reason: textMatch.reason,
    segment: command,
    ruleId: textMatch.id,
    intent: textMatch.intent
  } : null;
}
function recordStrictUnparseable(command, options) {
  const step = {
    type: "strict-unparseable",
    rawCommand: command,
    reason: import_reasons2.REASON_STRICT_UNPARSEABLE
  };
  const segmentIndex = options.trace?.currentSegmentIndex;
  if (segmentIndex === undefined)
    options.trace?.recordGlobal(step);
  if (segmentIndex !== undefined)
    options.trace?.recordSegment(step);
}
// src/gate/analyzer/parallel.ts
var import_node_path5 = require("node:path");
var import_budget3 = require("./core.js");
var import_chdir3 = require("./core.js");
var import_tmpdir3 = require("./core.js");
var import_effective_rules4 = require("./core.js");
var import_transparent_wrappers5 = require("./core.js");
var import_constants6 = require("./core-shell.js");
var import_custom2 = require("./core-shell.js");
var import_destructive5 = require("./core-shell.js");
var import_tokens7 = require("./core-shell.js");
var import_traversal2 = require("./core-shell.js");
var import_awk2 = require("./analyzer.js");
var import_child_command2 = require("./analyzer.js");
var import_command_words6 = require("./analyzer.js");
var import_dangerous_text3 = require("./analyzer.js");
var import_dynamic_input = require("./analyzer.js");
var import_find = require("./analyzer.js");
var import_interpreters3 = require("./analyzer.js");
var import_rm = require("./analyzer.js");
var import_rm_flags2 = require("./analyzer.js");
var import_shell_wrappers3 = require("./analyzer.js");
var import_xargs = require("./analyzer.js");
var REASON_PARALLEL_RM = "parallel rm -rf with dynamic input is dangerous. Use explicit file list instead.";
var REASON_PARALLEL_SHELL = "parallel with shell -c can execute arbitrary commands from dynamic input. Run the inner command directly on an explicit file list instead.";
var REASON_PARALLEL_COMMAND_STREAM = "parallel without a command reads executable commands from dynamic input. Use an explicit command template or ::: arguments instead.";
var REASON_PARALLEL_UNSUPPORTED = "parallel command construction cannot be verified safely. Use the default ::: separator, literal arguments, and built-in replacement strings.";
var PARALLEL_PLACEHOLDER_RE = /\{[^{}\s]*\}/g;
var PARALLEL_RM_PLACEHOLDER_RE = /\{\}|\{-?\d+\}/g;
var SHELL_SOURCE_CHARACTER_RE = /[\s;&|<>()$`\\"']/;
var AWK_SOURCE_OPTION_INPUTS = ["e", "f", "source", "file", "-e", "-f", "--source", "--file"];
var INTERPRETER_SOURCE_OPTION_INPUTS = [
  "c",
  "e",
  "eval",
  "m",
  "r",
  "Mmodule",
  "import",
  "require",
  "-c",
  "-e",
  "-m",
  "-r",
  "--eval",
  "--import",
  "--require"
];
var PARALLEL_OPTIONS_WITH_VALUE = new Set([
  "-L",
  "-d",
  "-n",
  "--delay",
  "--delimiter",
  "--header",
  "--joblog",
  "--jl",
  "--max-args",
  "--max-lines",
  "--nice",
  "--results",
  "--result",
  "--res",
  "--tagstring",
  "--timeout"
]);
var PARALLEL_UNSUPPORTED_INPUT_OPTIONS = new Set([
  "--arg-file",
  "--colsep",
  "--rpl",
  "--arg-sep",
  "--arg-file-sep"
]);
var PARALLEL_REMOTE_OPTIONS = new Set(["-S", "--sshlogin", "--slf", "--sshloginfile"]);
var PARALLEL_WORKDIR_OPTIONS = new Set(["--workdir", "--wd"]);
var PARALLEL_APPENDED_SOURCE = "__CC_SAFETY_NET_PARALLEL_SOURCE__";
function firstMatch(values, analyze) {
  for (const value of values) {
    const result = analyze(value);
    if (result)
      return result;
  }
  return null;
}
function dangerousParallelEnvValue(values) {
  return firstMatch([...values], (value) => import_dangerous_text3.dangerousInTextMatch(value));
}
function analyzeParallel(words, context) {
  const tokens = words.map(import_command_words6.analysisWordText);
  const ambientOptions = context.envAssignments?.has("PARALLEL") ? context.envAssignments.get("PARALLEL") : context.environment.env.get("PARALLEL");
  if (ambientOptions?.trim()) {
    const reason = parallelUnsupportedReason(context);
    if (reason)
      return reason;
  }
  if (tokens.length === 2 && (tokens[1] === "--version" || tokens[1] === "--help")) {
    return null;
  }
  const parseResult = parseParallelCommand(tokens);
  const { template, jobs, runsRemotely, readsCommandsFromInput, unsupported, workdir, dryRun } = parseResult;
  if (unsupported) {
    const reason = parallelUnsupportedReason(context);
    if (reason)
      return reason;
    const dangerousEnvValue = dangerousParallelEnvValue(context.envAssignments?.values() ?? []);
    if (dangerousEnvValue)
      return dangerousEnvValue;
  }
  if (readsCommandsFromInput) {
    const reason = parallelCommandStreamDynamicReason(context);
    if (reason)
      return reason;
  }
  if (workdir !== undefined && runsRemotely) {
    const reason = parallelUnsupportedReason(context);
    if (reason)
      return reason;
  }
  const workdirCwd = resolveParallelWorkdir(workdir, context.cwd, context.environment.paths);
  if (workdirCwd === null) {
    const reason = parallelUnsupportedReason(context);
    if (reason)
      return reason;
  }
  const executionContext = runsRemotely ? { ...context, cwd: undefined, originalCwd: undefined } : workdirCwd === null || workdirCwd === undefined || workdirCwd === context.cwd ? context : { ...context, cwd: workdirCwd };
  if (dryRun) {
    const envValues = [...import_child_command2.normalizeChildCommands(template, executionContext)].flatMap((childCommand) => [...childCommand.envAssignments.values()]);
    if (envValues.some(hasExecutableParallelPlaceholder)) {
      const reason = parallelUnsupportedReason(context);
      if (reason)
        return reason;
    }
    return null;
  }
  if (template.length === 0) {
    const commands = jobs.map((job) => job[0] ?? "");
    context.budget.charge("derivedTokens", commands.length);
    const nestedOverrides = buildNestedOverrides(executionContext.envAssignments, executionContext.cwd, runsRemotely);
    return firstMatch(commands, (command) => context.analyzeNested(command, nestedOverrides));
  }
  return firstMatch(import_child_command2.normalizeChildCommands(template, executionContext), (childCommand) => analyzeParallelChildCommand(childCommand, parseResult, context, executionContext));
}
function analyzeParallelChildCommand(childCommand, parseResult, context, executionContext) {
  const { templateHasPlaceholder, runsRemotely, usesStdin } = parseResult;
  const childTokens = childCommand.tokens;
  const childEnvValues = [...childCommand.envAssignments.values()];
  if (childEnvValues.some(hasUnsupportedParallelPlaceholder)) {
    const reason = parallelUnsupportedReason(context);
    if (reason)
      return reason;
  }
  const dangerousChildEnvValue = dangerousParallelEnvValue(childEnvValues);
  if (dangerousChildEnvValue)
    return dangerousChildEnvValue;
  const envHasPlaceholder = childEnvValues.some(hasParallelPlaceholder);
  const hasPlaceholder = templateHasPlaceholder || envHasPlaceholder;
  const hasDynamicStdinPlaceholder = usesStdin && hasPlaceholder;
  const childOverrides = buildNestedOverrides(childCommand.envAssignments, childCommand.wrapperCwd, runsRemotely || hasDynamicStdinPlaceholder);
  const nestedOverrides = hasPlaceholder ? { ...childOverrides, worktreeMode: false } : childOverrides;
  const shellSource = childTokens.join(" ");
  const jobValuesRunAsCommand = hasParallelPlaceholder(shellSource.split(/[ \t\n=]/, 1)[0] ?? "");
  const runsAsShellSource = !parseResult.quotesCommand && (jobValuesRunAsCommand || childTokens.some((token) => SHELL_SOURCE_CHARACTER_RE.test(token)));
  const headIsShellSource = jobValuesRunAsCommand || SHELL_SOURCE_CHARACTER_RE.test(childTokens[0] ?? "");
  const wordsResult = runsAsShellSource && headIsShellSource && parseResult.jobs.length > 0 ? null : analyzeParallelChildWords(childCommand, parseResult, context, executionContext, nestedOverrides, envHasPlaceholder);
  if (wordsResult || !runsAsShellSource)
    return wordsResult;
  return analyzeParallelShellSource(hasParallelPlaceholder(shellSource) ? shellSource : `${shellSource} {}`, !jobValuesRunAsCommand, childCommand, parseResult, context, executionContext, nestedOverrides);
}
function analyzeParallelChildWords(childCommand, parseResult, context, executionContext, nestedOverrides, envHasPlaceholder) {
  const { jobs, templateHasPlaceholder, runsRemotely, usesStdin } = parseResult;
  const childTokens = childCommand.tokens;
  const hasPlaceholder = templateHasPlaceholder || envHasPlaceholder;
  if (import_constants6.SHELL_WRAPPERS.has(childCommand.head)) {
    const analyzeExpandedShellArgv = () => {
      if (!templateHasPlaceholder || jobs.length === 0)
        return null;
      return firstMatch(jobs, (job) => context.analyzeChild(expandParallelJob(childTokens, job, context.budget), import_child_command2.childProvenance(childCommand, executionContext)));
    };
    if (import_shell_wrappers3.isShellSyntaxCheck(childTokens))
      return analyzeExpandedShellArgv();
    const dashCArg = import_shell_wrappers3.extractDashCArg(childTokens);
    if (dashCArg) {
      if (isOnlyParallelPlaceholder(dashCArg)) {
        const reason = parallelShellDynamicReason(context);
        if (reason)
          return reason;
        if (jobs.length === 0)
          return null;
        return firstMatch(jobs, (job) => context.analyzeNested(expandParallelString(dashCArg, job, context.budget), nestedOverrides));
      }
      if (hasParallelPlaceholder(dashCArg)) {
        return analyzeParallelShellSource(dashCArg, false, childCommand, parseResult, context, executionContext, nestedOverrides);
      }
      const positionalSources = !envHasPlaceholder && (!templateHasPlaceholder || jobs.length > 0) ? (jobs.length > 0 ? jobs : [undefined]).map((job) => extractPositionalShellSource(import_command_words6.textCommandWords(job === undefined ? childTokens : templateHasPlaceholder ? childTokens.map((token) => replaceParallelJobPlaceholder(token, job)) : [...childTokens, ...job]), dashCArg)) : [];
      if (positionalSources.some((source) => source.kind === "dynamic")) {
        const reason = parallelShellDynamicReason(context);
        if (reason)
          return reason;
      }
      const literalPositionalSources = positionalSources.flatMap((source) => source.kind === "literal" ? [source.source] : []);
      if (literalPositionalSources.length > 0) {
        context.budget.charge("derivedTokens", literalPositionalSources.length);
        return firstMatch(literalPositionalSources, (source) => context.analyzeNested(source, nestedOverrides));
      }
      if (shellSourceHasUnresolvedDynamicExecutionCarrier(dashCArg)) {
        const dynamicReason = parallelShellDynamicReason(context);
        if (dynamicReason)
          return dynamicReason;
      }
      const reason = context.analyzeNested(dashCArg, nestedOverrides);
      if (reason) {
        return reason;
      }
      if (hasPlaceholder) {
        return parallelShellDynamicReason(context);
      }
      return null;
    }
    const scriptSource = extractShellScriptOperandSource(import_command_words6.textCommandWords(childTokens));
    if (scriptSource.kind === "dynamic" || scriptSource.kind === "literal" && hasParallelPlaceholder(scriptSource.source)) {
      const reason = parallelShellDynamicReason(context);
      return reason ?? analyzeExpandedShellArgv();
    }
    if (scriptSource.kind === "literal")
      return analyzeExpandedShellArgv();
    if (jobs.length > 0) {
      const reason = parallelShellDynamicReason(context);
      if (reason)
        return reason;
      const expandedArgvReason = analyzeExpandedShellArgv();
      if (expandedArgvReason)
        return expandedArgvReason;
      if (templateHasPlaceholder)
        return null;
      const sources = jobs.flatMap((job) => job[0] === undefined ? [] : [job[0]]);
      context.budget.charge("derivedTokens", sources.length);
      return firstMatch(sources, (source) => context.analyzeNested(source, nestedOverrides));
    }
    if (hasPlaceholder || usesStdin) {
      const reason = parallelShellDynamicReason(context);
      return reason ?? analyzeExpandedShellArgv();
    }
    return null;
  }
  if (childCommand.head === "rm" && import_rm_flags2.hasRecursiveForceFlags(childTokens)) {
    if (templateHasPlaceholder && jobs.length > 0) {
      return firstMatch(jobs, (job) => analyzeParallelRmExpansion(expandParallelJob(childTokens, job, context.budget, PARALLEL_RM_PLACEHOLDER_RE), childCommand.cwd, executionContext));
    }
    if (jobs.length > 0) {
      return firstMatch(jobs, (job) => analyzeParallelRmExpansion(appendParallelJob(childTokens, job, context.budget), childCommand.cwd, executionContext));
    }
    const staticResult = analyzeParallelRmExpansion(childTokens.flatMap((token, index) => {
      if (index === 0 || !hasParallelPlaceholder(token))
        return [token];
      return token.startsWith("-") ? [token.replace(PARALLEL_RM_PLACEHOLDER_RE, "")] : [];
    }), childCommand.cwd, executionContext);
    if (staticResult)
      return staticResult;
    return parallelRmDynamicReason(context);
  }
  const childJobs = jobs.length > 0 ? jobs : [undefined];
  return firstMatch(childJobs, (job) => {
    const tokens = job === undefined ? childTokens : templateHasPlaceholder ? expandParallelJob(childTokens, job, context.budget) : appendParallelJob(childTokens, job, context.budget);
    const shellDynamicMatch = import_destructive5.destructiveCommandMatch("parallel.shell-dynamic", REASON_PARALLEL_SHELL);
    const findDynamicInput = usesStdin && childCommand.head === "find" ? analyzeDynamicParallelFind(tokens, executionContext) : null;
    const dynamicCustomResult = matchParallelStdinPolicyRule(tokens, usesStdin, context) ?? findDynamicInput?.customResult ?? null;
    const normalizedHead = import_tokens7.normalizeCommandToken(childCommand.head);
    const dynamicRmInput = usesStdin && (normalizedHead === "rm" && parallelInputCanChangeRmOptions(tokens) || normalizedHead === "xargs" && nestedRmInputCanChangeOptions(tokens) || findDynamicInput?.rmOptions === true);
    const dynamicSourceInput = usesStdin && (dynamicRmInput || findDynamicInput?.executedSource === true || findDynamicInput === null && parallelInputCanChangeExecutedSource(tokens, normalizedHead));
    const result = context.analyzeChild(tokens, {
      ...import_child_command2.childProvenance(childCommand, executionContext),
      worktreeMode: runsRemotely || usesStdin || hasPlaceholder ? false : context.worktreeMode,
      dynamicInput: usesStdin || hasPlaceholder,
      dynamicRmInput,
      dynamicSourceInput: dynamicCustomResult !== null || dynamicSourceInput,
      shellDynamicMatch,
      dynamicSourceMatch: shellDynamicMatch,
      rmDynamicMatch: import_destructive5.destructiveCommandMatch("parallel.rm-recursive-force-dynamic", REASON_PARALLEL_RM)
    });
    if (dynamicSourceInput) {
      const parallelDynamic = import_effective_rules4.filterDestructiveCommandMatch(shellDynamicMatch, context.policy);
      if (parallelDynamic)
        return parallelDynamic;
    }
    return result ?? dynamicCustomResult ?? import_custom2.checkPolicyRuleMatch(tokens, context.policy?.rules ?? []);
  });
}
function analyzeParallelShellSource(source, quoteJobValues, childCommand, parseResult, context, executionContext, nestedOverrides) {
  if (parseResult.jobs.length > 0) {
    return firstMatch(parseResult.jobs, (job) => context.analyzeNested(expandParallelString(source, quoteJobValues ? job.map(quoteShellWord) : job, context.budget), nestedOverrides));
  }
  const scriptTokens = import_traversal2.parseSimpleWords(source);
  if (scriptTokens?.[0] && import_tokens7.normalizeCommandToken(scriptTokens[0]) === "rm" && import_rm_flags2.hasRecursiveForceFlags(scriptTokens)) {
    const reason = parallelRmDynamicReason(context);
    if (reason)
      return reason;
  }
  const dynamicReason = scriptTokens ? context.analyzeChild(scriptTokens, {
    ...import_child_command2.childProvenance(childCommand, executionContext),
    dynamicInput: parseResult.usesStdin,
    shellDynamicMatch: import_destructive5.destructiveCommandMatch("parallel.shell-dynamic", REASON_PARALLEL_SHELL),
    rmDynamicMatch: import_destructive5.destructiveCommandMatch("parallel.rm-recursive-force-dynamic", REASON_PARALLEL_RM)
  }) : null;
  return dynamicReason ?? context.analyzeNested(source, nestedOverrides);
}
function parallelInputCanChangeExecutedSource(tokens, childHead) {
  if (hasParallelPlaceholder(tokens[0] ?? ""))
    return true;
  if (childHead === "eval" || childHead === "source" || childHead === ".")
    return true;
  if (childHead === "parallel" || childHead === "xargs")
    return true;
  if (import_constants6.SHELL_WRAPPERS.has(childHead))
    return shellArgvHasParallelSource(tokens);
  if (childHead === "git") {
    return gitInputCanChangeProtectedOperation(tokens);
  }
  if (childHead === "find")
    return true;
  if (import_constants6.AWK_INTERPRETERS.has(childHead))
    return executableSourceCanChange(tokens, AWK_SOURCE_OPTION_INPUTS, import_awk2.extractAwkExecutableSources);
  if (import_transparent_wrappers5.isInterpreterCommand(childHead))
    return executableSourceCanChange(tokens, INTERPRETER_SOURCE_OPTION_INPUTS, import_interpreters3.extractInterpreterExecutableSources);
  return false;
}
function parallelInputCanChangeRmOptions(tokens) {
  const optionTerminator = tokens.indexOf("--");
  const optionTokens = tokens.slice(1, optionTerminator === -1 ? undefined : optionTerminator);
  const hasPlaceholder = tokens.some(hasParallelPlaceholder);
  if (!hasPlaceholder)
    return optionTerminator === -1;
  return optionTokens.some((token) => hasParallelPlaceholder(token) && (token.startsWith("-") || isOnlyParallelPlaceholder(token)));
}
function gitInputCanChangeProtectedOperation(tokens) {
  if (gitGlobalConfigCanChange(tokens))
    return true;
  const parsed = extractGitSubcommandAndRest(tokens);
  if (parsed.subcommand === null || hasParallelPlaceholder(parsed.subcommand))
    return true;
  if (!GIT_RULE_SUBCOMMANDS.has(parsed.subcommand.toLowerCase()))
    return false;
  const optionTerminator = parsed.rest.indexOf("--");
  const structuralTokens = parsed.rest.slice(0, optionTerminator === -1 ? undefined : optionTerminator);
  const hasPlaceholder = tokens.some(hasParallelPlaceholder);
  if (!hasPlaceholder)
    return optionTerminator === -1;
  return structuralTokens.some(hasParallelPlaceholder);
}
function gitGlobalConfigCanChange(tokens) {
  for (let index = 1;index < tokens.length; index++) {
    const token = tokens[index];
    if (!token || token === "--" || !token.startsWith("-"))
      return false;
    if (token === "-c" || token === "--config-env") {
      if (hasParallelPlaceholder(tokens[index + 1] ?? ""))
        return true;
      index++;
      continue;
    }
    if (token.startsWith("-c") && token.length > 2 || token.startsWith("--config-env=")) {
      if (hasParallelPlaceholder(token))
        return true;
      continue;
    }
    if (hasParallelPlaceholder(token))
      return true;
  }
  return false;
}
function shellArgvHasParallelSource(tokens) {
  if (import_shell_wrappers3.isShellSyntaxCheck(tokens))
    return false;
  const dashCArg = import_shell_wrappers3.extractDashCArg(tokens);
  if (dashCArg !== null)
    return hasParallelPlaceholder(dashCArg);
  const scriptSource = extractShellScriptOperandSource(import_command_words6.textCommandWords(tokens));
  if (scriptSource.kind === "literal")
    return hasParallelPlaceholder(scriptSource.source);
  if (scriptSource.kind === "dynamic")
    return true;
  return !tokens.some(hasParallelPlaceholder);
}
function executableSourceCanChange(tokens, candidates, extractSources) {
  const existingSources = extractSources(tokens);
  if (existingSources.some((source) => hasParallelPlaceholder(source.value)))
    return true;
  if (!tokens.some(hasParallelPlaceholder)) {
    return extractSources([...tokens, PARALLEL_APPENDED_SOURCE]).some((source) => source.value === PARALLEL_APPENDED_SOURCE);
  }
  return import_dynamic_input.substitutionAddsExecutableSource(existingSources, candidates, (candidate) => extractSources(tokens.map((token) => replaceParallelJobPlaceholder(token, [candidate]))));
}
function matchParallelStdinPolicyRule(tokens, usesStdin, context) {
  const rules = context.policy?.rules ?? [];
  if (!usesStdin || rules.length === 0)
    return null;
  const relevantRules = rules.filter((rule) => import_tokens7.normalizeCommandToken(rule.command) === import_tokens7.normalizeCommandToken(tokens[0] ?? ""));
  if (relevantRules.length === 0)
    return null;
  if (tokens.slice(1).some(hasParallelPlaceholder))
    return parallelShellDynamicReason(context);
  return firstMatch(relevantRules, (rule) => import_custom2.checkPolicyRuleMatch([...tokens, ...rule.subcommand ? [rule.subcommand] : [], ...rule.block_args], [rule]));
}
function analyzeDynamicParallelFind(tokens, context) {
  const analysis = {
    customResult: null,
    executedSource: !tokens.some(hasParallelPlaceholder),
    rmOptions: false
  };
  let inExpression = false;
  let expressionDataArgs = 0;
  let execTokens = null;
  const analyzeExec = () => {
    if (!execTokens?.some(hasParallelPlaceholder))
      return;
    for (const childCommand of import_child_command2.normalizeChildCommands(execTokens, context)) {
      analysis.executedSource ||= parallelInputCanChangeExecutedSource(childCommand.tokens, childCommand.head);
      analysis.rmOptions ||= childCommand.head === "rm" && parallelInputCanChangeRmOptions(childCommand.tokens) || childCommand.head === "xargs" && nestedRmInputCanChangeOptions(childCommand.tokens);
      analysis.customResult ??= matchParallelStdinPolicyRule(childCommand.tokens, true, context);
    }
  };
  for (const token of tokens.slice(1)) {
    if (!inExpression && !token.startsWith("-") && token !== "!" && token !== "(") {
      analysis.executedSource ||= hasParallelPlaceholder(token);
      continue;
    }
    inExpression = true;
    if (execTokens) {
      if (token === ";" || token === "+") {
        analyzeExec();
        execTokens = null;
        continue;
      }
      execTokens.push(token);
      continue;
    }
    if (expressionDataArgs > 0) {
      expressionDataArgs--;
      continue;
    }
    if (import_find.isFindExecPrimary(token)) {
      execTokens = [];
      analysis.executedSource ||= hasParallelPlaceholder(token);
      continue;
    }
    const arity = import_find.getFindPrimaryArity(token);
    if (arity > 0) {
      expressionDataArgs = arity;
      analysis.executedSource ||= hasParallelPlaceholder(token);
      continue;
    }
    analysis.executedSource ||= hasParallelPlaceholder(token);
  }
  analyzeExec();
  return analysis;
}
function nestedRmInputCanChangeOptions(tokens) {
  const childTokens = tokens.slice(import_xargs.extractXargsChildCommandWithInfo(tokens).childStart);
  return import_tokens7.normalizeCommandToken(childTokens[0] ?? "") === "rm" && parallelInputCanChangeRmOptions(childTokens);
}
function parallelReason(ruleId, reason) {
  return (context) => import_effective_rules4.filterDestructiveCommandMatch(import_destructive5.destructiveCommandMatch(ruleId, reason), context.policy);
}
var parallelShellDynamicReason = parallelReason("parallel.shell-dynamic", REASON_PARALLEL_SHELL);
var parallelCommandStreamDynamicReason = parallelReason("parallel.command-stream-dynamic", REASON_PARALLEL_COMMAND_STREAM);
var parallelUnsupportedReason = parallelReason("parallel.command-stream-dynamic", REASON_PARALLEL_UNSUPPORTED);
var parallelRmDynamicReason = parallelReason("parallel.rm-recursive-force-dynamic", REASON_PARALLEL_RM);
function analyzeParallelRmExpansion(tokens, cwd, context) {
  return import_effective_rules4.filterDestructiveCommandMatch(import_rm.analyzeRmMatch(import_command_words6.textCommandWords(tokens), {
    environment: context.environment,
    cwd,
    budget: context.budget,
    originalCwd: context.originalCwd,
    strict: context.strict,
    paranoid: context.paranoidRm,
    allowTmpdirVar: context.allowTmpdirVar,
    tmpdirWordSplittingUnsafe: import_tmpdir3.hasUnsafeTmpdirWordSplitting(context.envAssignments ?? new Map, context.environment),
    trustedTmpdirValue: import_tmpdir3.isTmpdirValueTrusted(context.envAssignments ?? new Map, context.environment),
    protectedGitMetadata: context.protectedGitMetadata,
    policy: context.policy
  }), context.policy);
}
function buildNestedOverrides(envAssignments, cwd, runsRemotely) {
  const overrides = {};
  if (envAssignments)
    overrides.envAssignments = envAssignments;
  if (runsRemotely) {
    overrides.effectiveCwd = null;
    overrides.worktreeMode = false;
    return overrides;
  }
  if (cwd !== undefined) {
    overrides.effectiveCwd = cwd;
  }
  return Object.keys(overrides).length > 0 ? overrides : undefined;
}
function replaceParallelJobPlaceholder(token, job) {
  return token.replace(PARALLEL_PLACEHOLDER_RE, (placeholder) => getParallelPlaceholderValue(placeholder, job));
}
function expandParallelJob(tokens, job, budget, placeholders = PARALLEL_PLACEHOLDER_RE) {
  budget.charge("derivedTokens", tokens.reduce((total, token) => total + 1 + Math.floor(token.length / 64), 0));
  return tokens.map((token) => token.replace(placeholders, (placeholder) => {
    const value = getParallelPlaceholderValue(placeholder, job);
    budget.charge("derivedTokens", Math.max(1, Math.ceil(value.length / 64)));
    return value;
  }));
}
function expandParallelString(value, job, budget) {
  return expandParallelJob([value], job, budget)[0] ?? "";
}
function appendParallelJob(tokens, job, budget) {
  budget.charge("derivedTokens", tokens.length + job.length);
  return [...tokens, ...job];
}
function getParallelPlaceholderValue(placeholder, job) {
  const position = /^\{(-?\d+)[^{}\s]*\}$/.exec(placeholder)?.[1];
  if (position === undefined) {
    return job[0] ?? "";
  }
  const parsed = Number(position);
  return job[parsed > 0 ? parsed - 1 : job.length + parsed] ?? "";
}
function hasParallelPlaceholder(token) {
  return token.search(PARALLEL_PLACEHOLDER_RE) !== -1;
}
function hasUnsupportedParallelPlaceholder(token) {
  if (hasExecutableParallelPlaceholder(token))
    return true;
  for (const match of token.matchAll(PARALLEL_PLACEHOLDER_RE)) {
    if (!/^(?:\{\}|\{\d+\})$/.test(match[0])) {
      return true;
    }
  }
  return false;
}
function hasExecutableParallelPlaceholder(token) {
  const perlStart = token.indexOf("{=");
  return perlStart !== -1 && token.indexOf("=}", perlStart + 2) !== -1;
}
function isOnlyParallelPlaceholder(token) {
  return /^\{[^{}\s]*\}$/.test(token);
}
function resolveParallelWorkdir(workdir, cwd, paths) {
  if (workdir === undefined) {
    return;
  }
  if (workdir === "..." || /^~|[{}$`*?[]/.test(workdir)) {
    return null;
  }
  if (!cwd && !import_node_path5.isAbsolute(workdir)) {
    return null;
  }
  try {
    return import_chdir3.resolveChdirTarget(cwd ?? workdir, workdir, paths);
  } catch {
    return null;
  }
}
function parseParallelCommand(tokens) {
  let i = 1;
  const templateTokens = [];
  let childStart = tokens.length;
  let markerIndex = -1;
  let runsRemotely = false;
  let quotesCommand = false;
  let usesPipe = false;
  let workdir;
  let dryRun = false;
  let unsupported = tokens.some((token) => token === "::::" || token === "::::+" || token === ":::+");
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === undefined)
      break;
    if (token === ":::") {
      markerIndex = i;
      break;
    }
    if (token === "--") {
      const template = import_child_command2.collectCommandTemplate(tokens, i + 1);
      templateTokens.push(...template.templateTokens);
      childStart = i + 1;
      markerIndex = template.markerIndex;
      break;
    }
    if (!token.startsWith("-")) {
      const template = import_child_command2.collectCommandTemplate(tokens, i);
      templateTokens.push(...template.templateTokens);
      childStart = i;
      markerIndex = template.markerIndex;
      break;
    }
    const nextToken = tokens[i + 1];
    const equalsIndex = token.indexOf("=");
    const optionName = equalsIndex === -1 ? token : token.slice(0, equalsIndex);
    const attachedValue = equalsIndex === -1 ? undefined : token.slice(equalsIndex + 1);
    if (token === "--dry-run") {
      dryRun = true;
      i++;
      continue;
    }
    if (token === "-I" || token.startsWith("-I") && token.length > 2) {
      unsupported ||= (token === "-I" ? nextToken : token.slice(2)) !== "{}";
      i += token === "-I" ? 2 : 1;
      continue;
    }
    if (token === "--replace" || token === "-i") {
      unsupported = true;
      i += 2;
      continue;
    }
    if (optionName === "--replace" || token.startsWith("-i") && token.length > 2) {
      const replacement = optionName === "--replace" ? attachedValue : token.slice(2);
      unsupported ||= replacement !== "" && replacement !== "{}";
      i++;
      continue;
    }
    if (token === "-a" || PARALLEL_UNSUPPORTED_INPUT_OPTIONS.has(optionName)) {
      unsupported = true;
      i += attachedValue === undefined ? 2 : 1;
      continue;
    }
    if (token === "-q" || token === "--quote") {
      quotesCommand = true;
      i++;
      continue;
    }
    if (token === "--pipe" || token === "--pipepart") {
      usesPipe = true;
      i++;
      continue;
    }
    if (optionName === "--env") {
      unsupported = true;
      i += attachedValue === undefined ? 2 : 1;
      continue;
    }
    if (PARALLEL_REMOTE_OPTIONS.has(optionName) || token.startsWith("-S") && token.length > 2) {
      runsRemotely = true;
      i += PARALLEL_REMOTE_OPTIONS.has(token) ? 2 : 1;
      continue;
    }
    if (PARALLEL_WORKDIR_OPTIONS.has(optionName)) {
      unsupported = true;
      const value = attachedValue ?? nextToken;
      if (value === undefined || value === ":::" || value === "--") {
        i++;
        continue;
      }
      workdir = value;
      i += attachedValue === undefined ? 2 : 1;
      continue;
    }
    if (token.startsWith("-j") && token.length > 2 && /^\d+$/.test(token.slice(2))) {
      i++;
      continue;
    }
    if (token.startsWith("--") && attachedValue !== undefined) {
      i++;
      continue;
    }
    if (PARALLEL_OPTIONS_WITH_VALUE.has(token)) {
      if (nextToken === undefined || nextToken === ":::" || nextToken === "--") {
        unsupported = true;
        i++;
        continue;
      }
      i += 2;
      continue;
    }
    i += token === "-j" || token === "--jobs" ? 2 : 1;
  }
  unsupported ||= templateTokens.some(dryRun ? hasExecutableParallelPlaceholder : hasUnsupportedParallelPlaceholder);
  const argumentGroups = [];
  if (markerIndex !== -1) {
    let group = [];
    for (let j = markerIndex + 1;j < tokens.length; j++) {
      const token = tokens[j];
      if (token === ":::") {
        argumentGroups.push(group);
        group = [];
        continue;
      }
      if (token !== undefined) {
        group.push(token);
      }
    }
    argumentGroups.push(group);
  }
  unsupported ||= argumentGroups.length > 1;
  const jobs = expandParallelJobs(argumentGroups);
  const templateHasPlaceholder = templateTokens.some(hasParallelPlaceholder);
  const readsCommandsFromInput = templateTokens.length === 0 && markerIndex === -1;
  return {
    template: templateTokens,
    jobs,
    childStart,
    templateHasPlaceholder,
    runsRemotely,
    quotesCommand,
    usesStdin: usesPipe || markerIndex === -1,
    readsCommandsFromInput,
    unsupported,
    workdir,
    dryRun
  };
}
function expandParallelJobs(argumentGroups) {
  if (argumentGroups.length === 0 || argumentGroups.some((group) => group.length === 0)) {
    return [];
  }
  let jobs = [[]];
  for (const [index, group] of argumentGroups.entries()) {
    if (group.length === 1) {
      const arg = group[0];
      if (arg === undefined)
        return [];
      for (const job of jobs)
        job.push(arg);
      if (jobs.length * (index + 1) > import_budget3.LIMITS.derivedTokens.cap) {
        throw new import_budget3.AnalysisLimit("derivedTokens");
      }
      continue;
    }
    const expanded = [];
    for (const job of jobs) {
      for (const arg of group) {
        if ((expanded.length + 1) * (index + 1) > import_budget3.LIMITS.derivedTokens.cap) {
          throw new import_budget3.AnalysisLimit("derivedTokens");
        }
        expanded.push([...job, arg]);
      }
    }
    jobs = expanded;
  }
  return jobs;
}
function extractParallelChildStart(tokens) {
  return parseParallelCommand(tokens).childStart;
}
