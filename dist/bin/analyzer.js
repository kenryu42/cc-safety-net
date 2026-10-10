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

// src/bin/analyzer.ts
var exports_analyzer = {};
__export(exports_analyzer, {
  ANALYZER_RULES: () => ANALYZER_RULES,
  AWK_EXECUTABLE_SOURCE_SELECTORS: () => AWK_EXECUTABLE_SOURCE_SELECTORS,
  REASON_AWK_SYSTEM_DYNAMIC: () => REASON_AWK_SYSTEM_DYNAMIC,
  REASON_COMMAND_ANALYSIS_LIMIT: () => import_budget5.REASON_COMMAND_ANALYSIS_LIMIT,
  REASON_DYNAMIC_SHELL_SOURCE: () => REASON_DYNAMIC_SHELL_SOURCE,
  REASON_INTERPRETER_BLOCKED: () => REASON_INTERPRETER_BLOCKED,
  REASON_INTERPRETER_DANGEROUS: () => REASON_INTERPRETER_DANGEROUS,
  REASON_RECURSION_LIMIT: () => import_budget5.REASON_RECURSION_LIMIT,
  REASON_SAFETY_NET_FAILED_CLOSED: () => import_budget5.REASON_SAFETY_NET_FAILED_CLOSED,
  REASON_STRICT_UNPARSEABLE: () => REASON_STRICT_UNPARSEABLE,
  REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT: () => REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT,
  REASON_UNSUPPORTED_HEREDOC_SYNTAX: () => REASON_UNSUPPORTED_HEREDOC_SYNTAX,
  REASON_XARGS_RM: () => REASON_XARGS_RM,
  REASON_XARGS_SHELL: () => REASON_XARGS_SHELL,
  analysisWordText: () => analysisWordText,
  analyzeAwkSystemCallMatch: () => analyzeAwkSystemCallMatch,
  analyzeCmdMatch: () => analyzeCmdMatch,
  analyzeCommand: () => analyzeCommand,
  analyzeCommandWithProgram: () => analyzeCommandWithProgram,
  analyzeDeviceCommandMatch: () => analyzeDeviceCommandMatch,
  analyzeDynamicCommandStructure: () => analyzeDynamicCommandStructure,
  analyzeFindMatch: () => analyzeFindMatch,
  analyzeOrCapBreach: () => analyzeOrCapBreach,
  analyzePowerShellCommandViewMatch: () => analyzePowerShellCommandViewMatch,
  analyzePowerShellWrapperMatch: () => analyzePowerShellWrapperMatch,
  analyzeRmMatch: () => analyzeRmMatch,
  analyzeXargs: () => analyzeXargs,
  analyzedViewWords: () => analyzedViewWords,
  analyzerCapBreach: () => analyzerCapBreach,
  applyShellGitContextEnvSegment: () => applyShellGitContextEnvSegment,
  chargeNativeLinearPass: () => chargeNativeLinearPass,
  chargeScan: () => chargeScan,
  childProvenance: () => childProvenance,
  classifyRecursiveDeleteTarget: () => classifyRecursiveDeleteTarget,
  cloneShellGitContextEnvState: () => cloneShellGitContextEnvState,
  closingParenthesis: () => closingParenthesis,
  collectCommandTemplate: () => collectCommandTemplate,
  containsDangerousCode: () => containsDangerousCode,
  createRecursiveDeleteTargetContext: () => createRecursiveDeleteTargetContext,
  createShellGitContextEnvState: () => createShellGitContextEnvState,
  dangerousInTextMatch: () => dangerousInTextMatch,
  deleteTargetWordFacts: () => deleteTargetWordFacts,
  dynamicShellSourceMatch: () => dynamicShellSourceMatch,
  expandKnownVariableWord: () => expandKnownVariableWord,
  extractAwkExecutableSources: () => extractAwkExecutableSources,
  extractAwkSystemCommands: () => extractAwkSystemCommands,
  extractDashCArg: () => extractDashCArg,
  extractInterpreterCodeArg: () => extractInterpreterCodeArg,
  extractInterpreterExecutableSources: () => extractInterpreterExecutableSources,
  extractShellStartupLoaderMetadata: () => extractShellStartupLoaderMetadata,
  extractXargsChildCommandWithInfo: () => extractXargsChildCommandWithInfo,
  findExecRmDeletesFoundPaths: () => findExecRmDeletesFoundPaths,
  findHasDelete: () => findHasDelete,
  firstArgumentHasName: () => firstArgumentHasName,
  fixedAt: () => fixedAt,
  getFindExecCommand: () => getFindExecCommand,
  getFindPrimaryArity: () => getFindPrimaryArity,
  getFindStartingPoints: () => getFindStartingPoints,
  getInterpreterExecutableSourceSelectors: () => getInterpreterExecutableSourceSelectors,
  getSegmentGitContextEnvAssignments: () => getSegmentGitContextEnvAssignments,
  gitAnalyzeOptions: () => gitAnalyzeOptions,
  hasDynamicExecutableSource: () => hasDynamicExecutableSource,
  hasLinearDangerousText: () => hasLinearDangerousText,
  hasLinearInterpreterDanger: () => hasLinearInterpreterDanger,
  hasRecursiveForceFlags: () => hasRecursiveForceFlags,
  hasRecursiveOption: () => hasRecursiveOption,
  hasWordBoundaryAfter: () => hasWordBoundaryAfter,
  isAsciiWord: () => isAsciiWord,
  isDangerousRootOrHomeTarget: () => isDangerousRootOrHomeTarget,
  isDataOnlyQuotedAssignment: () => isDataOnlyQuotedAssignment,
  isDeviceCommand: () => isDeviceCommand,
  isEcmaWhitespace: () => isEcmaWhitespace,
  isFindExecPrimary: () => isFindExecPrimary,
  isInterpreterDisplayOnly: () => isInterpreterDisplayOnly,
  isJsLineTerminator: () => isJsLineTerminator,
  isLiteralExecutionSourceWord: () => isLiteralExecutionSourceWord,
  isPersistentHeredocFilePath: () => isPersistentHeredocFilePath,
  isPipeSemicolonStop: () => isPipeSemicolonStop,
  isRawStop: () => isRawStop,
  isShellSyntaxCheck: () => isShellSyntaxCheck,
  isStandardCommandWrapper: () => isStandardCommandWrapper,
  isTrustedTempDescendantTarget: () => isTrustedTempDescendantTarget,
  matchFromBlockResult: () => matchFromBlockResult,
  matchRecursiveDeleteClassification: () => matchRecursiveDeleteClassification,
  normalizeChildCommands: () => normalizeChildCommands,
  parseAwkArgv: () => parseAwkArgv,
  parseEnvAssignment: () => parseEnvAssignment,
  parseInterpreterArgv: () => parseInterpreterArgv,
  powerShellTargetForPolicy: () => powerShellTargetForPolicy,
  readPowerShellScript: () => readPowerShellScript,
  reconstructEnvSplitWords: () => reconstructEnvSplitWords,
  resolveTrackedHeredocPath: () => resolveTrackedHeredocPath,
  scanChar: () => scanChar,
  scanLength: () => scanLength,
  scannedText: () => scannedText,
  segmentTokensWithExpandedAssignments: () => segmentTokensWithExpandedAssignments,
  solveDynamicInput: () => solveDynamicInput,
  stripEnvAssignmentWords: () => stripEnvAssignmentWords,
  stripWrapperWords: () => stripWrapperWords,
  stripWrappers: () => stripWrappers,
  stripWrappersForPathScan: () => stripWrappersForPathScan,
  stripWrappersWithInfo: () => stripWrappersWithInfo,
  substitutionAddsExecutableSource: () => substitutionAddsExecutableSource,
  textCommandWords: () => textCommandWords,
  unwrapTransparentWrapper: () => unwrapTransparentWrapper,
  wordAt: () => wordAt
});
module.exports = __toCommonJS(exports_analyzer);

// src/gate/analyzer/wrapper-prelude.ts
var import_node_path = require("node:path");
var import_budget = require("./core.js");
var import_chdir = require("./core.js");
var import_tokens = require("./core-shell.js");

// src/gate/analyzer/command-words.ts
function analysisWordText(word) {
  return word.provenance === "command-substitution" ? word.raw : word.text;
}
function analyzedViewWords(dialect, words) {
  return dialect === "posix" ? words : textCommandWords(words.map((word) => word.text));
}
function isLiteralExecutionSourceWord(word, text) {
  return word && word.provenance !== "unknown" ? word.provenance === "literal" : !/[$`*?[\]]/.test(text);
}
function textCommandWords(tokens) {
  return tokens.map((text) => ({
    kind: "word",
    text,
    raw: text,
    span: { start: 0, end: 0 },
    provenance: "unknown",
    quoted: false,
    parts: []
  }));
}

// src/gate/analyzer/wrapper-prelude.ts
var import_env = require("./analyzer-core.js");
var ENV_ASSIGNMENT_RE = /^[A-Za-z_][A-Za-z0-9_]*=/;
function parseEnvAssignment(token) {
  if (!ENV_ASSIGNMENT_RE.test(token)) {
    return null;
  }
  const eqIdx = token.indexOf("=");
  return { name: token.slice(0, eqIdx), value: token.slice(eqIdx + 1) };
}
function stripEnvAssignmentWords(words) {
  const envAssignments = new Map;
  let i = 0;
  while (i < words.length) {
    const word = words[i];
    if (!word)
      break;
    const assignment = parseEnvAssignment(analysisWordText(word));
    if (!assignment)
      break;
    envAssignments.set(assignment.name, assignment.value);
    i++;
  }
  return { words: words.slice(i), envAssignments };
}
function hasWrapperPreludeHead(text) {
  const head = import_tokens.normalizeCommandToken(text);
  return text.includes("=") || head === "sudo" || head === "env" || head === "command" || head === "builtin";
}
function stripWrapperWords(words, environment, cwd, inheritedEnvAssignments) {
  if (!hasWrapperPreludeHead(headText(words))) {
    return { words, envAssignments: new Map, cwd, rewritten: false };
  }
  const parsed = new Set(words);
  let result = words;
  const allEnvAssignments = new Map;
  const effectiveEnvAssignments = new Map(inheritedEnvAssignments ?? []);
  const envSplitValues = [];
  let currentCwd = cwd;
  for (let iteration = 0;iteration < import_budget.LIMITS.wrapperPeelIterations.cap; iteration++) {
    const before = wordsText(result);
    const stripped = stripEnvAssignmentWords(result);
    for (const [k, v] of stripped.envAssignments) {
      allEnvAssignments.set(k, v);
      effectiveEnvAssignments.set(k, v);
    }
    result = stripped.words;
    if (result.length === 0)
      break;
    while (result.length > 0 && headText(result).includes("=") && !isEnvAssignment(result)) {
      const appendAssignment = parseTmpdirAppendEnvAssignment(headText(result), effectiveEnvAssignments, environment.env) ?? import_env.parseGitContextAppendEnvAssignment(headText(result), environment.env, effectiveEnvAssignments);
      if (appendAssignment) {
        allEnvAssignments.set(appendAssignment.name, appendAssignment.value);
        effectiveEnvAssignments.set(appendAssignment.name, appendAssignment.value);
      }
      result = result.slice(1);
    }
    if (result.length === 0)
      break;
    const head = import_tokens.normalizeCommandToken(headText(result));
    if (head !== "sudo" && head !== "env" && head !== "command" && head !== "builtin") {
      break;
    }
    if (head === "sudo") {
      const sudoResult = stripSudoWords(result, environment.paths, currentCwd);
      result = sudoResult.words;
      if (sudoResult.cwd !== undefined) {
        currentCwd = sudoResult.cwd;
      }
    }
    if (head === "env") {
      const envResult = stripEnvWords(result, currentCwd, effectiveEnvAssignments, environment);
      envSplitValues.push(...envResult.envSplitValues ?? []);
      result = envResult.words;
      if (envResult.cwd !== undefined) {
        currentCwd = envResult.cwd;
      }
      for (const [k, v] of envResult.envAssignments) {
        allEnvAssignments.set(k, v);
        effectiveEnvAssignments.set(k, v);
      }
    }
    if (head === "command") {
      result = stripCommandWords(result);
    }
    if (head === "builtin") {
      result = result.slice(wordText(result, 1) === "--" ? 2 : 1);
    }
    if (wordsText(result) === before)
      break;
  }
  const final = stripEnvAssignmentWords(result);
  for (const [k, v] of final.envAssignments) {
    allEnvAssignments.set(k, v);
    effectiveEnvAssignments.set(k, v);
  }
  return {
    words: final.words,
    envAssignments: allEnvAssignments,
    cwd: currentCwd,
    envSplitValues: envSplitValues.length > 0 ? envSplitValues : undefined,
    rewritten: hasSynthesizedWord(final.words, parsed)
  };
}
function hasSynthesizedWord(words, parsed) {
  return words.some((word) => !parsed.has(word));
}
function wordsText(words) {
  return words.map(analysisWordText).join(" ");
}
function headText(words) {
  const head = words[0];
  return head ? analysisWordText(head) : "";
}
function wordText(words, index) {
  const word = words[index];
  return word ? analysisWordText(word) : undefined;
}
function isEnvAssignment(words) {
  return ENV_ASSIGNMENT_RE.test(headText(words));
}
function parseTmpdirAppendEnvAssignment(token, envAssignments, env) {
  const prefix = "TMPDIR+=";
  if (!token.startsWith(prefix))
    return null;
  return {
    name: "TMPDIR",
    value: `${envAssignments.get("TMPDIR") ?? env.get("TMPDIR") ?? ""}${token.slice(prefix.length)}`
  };
}
var SUDO_OPTS_WITH_VALUE = new Set(["-u", "-g", "-C", "-D", "-h", "-p", "-r", "-t", "-T", "-U"]);
function stripSudoWords(words, paths, cwd) {
  let i = 1;
  let currentCwd = cwd;
  while (i < words.length) {
    const token = wordText(words, i);
    if (!token)
      break;
    if (token === "--") {
      return { words: words.slice(i + 1), cwd: currentCwd };
    }
    if (!token.startsWith("-")) {
      break;
    }
    if (token === "-D" || token === "--chdir") {
      const target = wordText(words, i + 1);
      currentCwd = target ? resolveWrapperCwd(currentCwd, target, paths) : null;
      i += 2;
      continue;
    }
    if (token.startsWith("--chdir=")) {
      currentCwd = resolveWrapperCwd(currentCwd, token.slice("--chdir=".length), paths);
      i++;
      continue;
    }
    if (token.startsWith("-D") && token.length > 2) {
      currentCwd = resolveWrapperCwd(currentCwd, token.slice(2), paths);
      i++;
      continue;
    }
    if (token === "-i" || token === "--login") {
      currentCwd = null;
      i++;
      continue;
    }
    if (SUDO_OPTS_WITH_VALUE.has(token)) {
      i += 2;
      continue;
    }
    i++;
  }
  return { words: words.slice(i), cwd: currentCwd };
}
var ENV_OPTS_NO_VALUE = new Set(["-i", "-0", "--null"]);
var ENV_OPTS_WITH_VALUE = new Set(["-u", "--unset", "-C", "--chdir", "-P"]);
function stripEnvWords(words, cwd, inheritedEnvAssignments, environment) {
  const envAssignments = new Map;
  const envSplitValues = [];
  let currentCwd = cwd;
  let i = 1;
  const result = (index) => ({
    words: words.slice(index),
    envAssignments,
    cwd: currentCwd,
    envSplitValues: envSplitValues.length > 0 ? envSplitValues : undefined
  });
  while (i < words.length) {
    const token = wordText(words, i);
    if (!token)
      break;
    if (token === "--") {
      return result(i + 1);
    }
    if (token === "-i" || token === "--ignore-environment" || token === "-") {
      envAssignments.clear();
      for (const name of inheritedEnvAssignments.keys())
        envAssignments.set(name, "");
      envAssignments.set("TMPDIR", "");
      i++;
      continue;
    }
    if (ENV_OPTS_NO_VALUE.has(token)) {
      i++;
      continue;
    }
    if (token === "-u" || token === "--unset") {
      const name = wordText(words, i + 1);
      if (name !== undefined) {
        envAssignments.set(name, "");
      }
      i += 2;
      continue;
    }
    if (token.startsWith("-u") && token.length > 2 && !token.startsWith("-u=")) {
      envAssignments.set(token.slice(2), "");
      i++;
      continue;
    }
    if (token.startsWith("--unset=")) {
      envAssignments.set(token.slice("--unset=".length), "");
      i++;
      continue;
    }
    const splitString = token === "-S" || token === "--split-string" ? { value: wordText(words, i + 1), consumed: 2 } : token.startsWith("-S") && token.length > 2 ? { value: token.slice("-S".length), consumed: 1 } : token.startsWith("--split-string=") ? { value: token.slice("--split-string=".length), consumed: 1 } : null;
    if (splitString) {
      if (splitString.value !== undefined)
        envSplitValues.push(splitString.value);
      currentCwd = null;
      return result(i + splitString.consumed);
    }
    if (ENV_OPTS_WITH_VALUE.has(token)) {
      if (token === "-C" || token === "--chdir") {
        const target = wordText(words, i + 1);
        currentCwd = target ? resolveWrapperCwd(currentCwd, target, environment.paths) : null;
      }
      i += 2;
      continue;
    }
    if (token.startsWith("-u=")) {
      i++;
      continue;
    }
    if (token.startsWith("-C") && token.length > 2 || token.startsWith("--chdir=")) {
      const target = token.startsWith("--chdir=") ? token.slice("--chdir=".length) : token.startsWith("-C=") ? token.slice("-C=".length) : token.slice("-C".length);
      currentCwd = resolveWrapperCwd(currentCwd, target, environment.paths);
      i++;
      continue;
    }
    if (token.startsWith("-P")) {
      i++;
      continue;
    }
    if (token.startsWith("-")) {
      i++;
      continue;
    }
    if (!parseEnvAssignment(token)) {
      break;
    }
    while (i < words.length) {
      const nextAssignment = parseEnvAssignment(wordText(words, i) ?? "");
      if (!nextAssignment)
        break;
      envAssignments.set(nextAssignment.name, nextAssignment.value);
      i++;
    }
    if (wordText(words, i) === "--")
      i++;
    return result(i);
  }
  return result(i);
}
function resolveWrapperCwd(cwd, target, paths) {
  if (target === "") {
    return null;
  }
  if (!cwd && !import_node_path.isAbsolute(target)) {
    return null;
  }
  const baseCwd = import_node_path.isAbsolute(target) ? import_node_path.parse(target).root : paths.realpath(cwd ?? "/");
  if (baseCwd === null)
    return null;
  try {
    return import_chdir.resolveChdirTarget(baseCwd, target, paths);
  } catch {
    return null;
  }
}
function stripCommandWords(words) {
  if (wordText(words, 1) === "-v")
    return [...textCommandWords(["type"]), ...words.slice(2)];
  let i = 1;
  while (i < words.length) {
    const token = wordText(words, i);
    if (!token)
      break;
    if (token === "-p" || token === "-v" || token === "-V") {
      i++;
      continue;
    }
    if (token === "--") {
      return words.slice(i + 1);
    }
    if (token.startsWith("-") && !token.startsWith("--") && token.length > 1) {
      if (!/^[pvV]+$/.test(token.slice(1))) {
        break;
      }
      i++;
      continue;
    }
    break;
  }
  return words.slice(i);
}
var ENV_SPLIT_NON_INERT_RE = /['"\\$`{}#]/;
function reconstructEnvSplitWords(envSplitValues, operands) {
  if (envSplitValues.some((value) => ENV_SPLIT_NON_INERT_RE.test(value)))
    return null;
  const words = [
    ...envSplitValues.flatMap((value) => value.split(/\s+/).filter((word) => word.length > 0)),
    ...operands
  ];
  return words.length <= 64 ? words : null;
}
function stripWrappers(tokens, environment, cwd) {
  return stripWrappersWithInfo(tokens, environment, cwd).tokens;
}
function splitPathScanWords(value) {
  const words = [];
  let current = "";
  let index = 0;
  while (index < value.length) {
    const char = value.charAt(index);
    if (char === '"' || char === "'") {
      const close = value.indexOf(char, index + 1);
      if (close === -1) {
        return value.split(/\s+/).map((word) => word.replace(/["']/g, "")).filter((word) => word.length > 0);
      }
      current += value.slice(index + 1, close);
      index = close + 1;
      continue;
    }
    if (/\s/.test(char)) {
      if (current.length > 0)
        words.push(current);
      current = "";
      index++;
      continue;
    }
    current += char;
    index++;
  }
  if (current.length > 0)
    words.push(current);
  return words;
}
function stripWrappersForPathScan(tokens, environment, cwd, depth = 0) {
  const stripped = stripWrappersWithInfo(tokens, environment, cwd);
  const splitWords = (stripped.envSplitValues ?? []).flatMap(splitPathScanWords);
  if (splitWords.length === 0)
    return stripped.tokens;
  const spliced = [...splitWords, ...stripped.tokens];
  if (depth >= 8)
    return spliced;
  return stripWrappersForPathScan(spliced, environment, cwd, depth + 1);
}
function stripWrappersWithInfo(tokens, environment, cwd, inheritedEnvAssignments) {
  if (!hasWrapperPreludeHead(tokens[0] ?? "")) {
    return { tokens: [...tokens], envAssignments: new Map, cwd };
  }
  const stripped = stripWrapperWords(textCommandWords(tokens), environment, cwd, inheritedEnvAssignments);
  return {
    tokens: stripped.words.map(analysisWordText),
    envAssignments: stripped.envAssignments,
    cwd: stripped.cwd,
    envSplitValues: stripped.envSplitValues
  };
}
// src/gate/analyzer/xargs.ts
var import_effective_rules3 = require("./core.js");
var import_transparent_wrappers3 = require("./core.js");
var import_constants5 = require("./core-shell.js");
var import_custom = require("./core-shell.js");
var import_destructive6 = require("./core-shell.js");
var import_tokens7 = require("./core-shell.js");

// src/gate/analyzer/awk.ts
var import_destructive = require("./core-shell.js");

// src/gate/analyzer/text-scanner.ts
function scannedText(value, work) {
  return { value, work };
}
function scanChar(text, index) {
  if (text.work)
    text.work.units = Math.min(Number.MAX_SAFE_INTEGER, text.work.units + 1);
  return text.value[index];
}
function scanLength(text) {
  return text.value.length;
}
function chargeScan(work, text, passes = 1) {
  if (work) {
    work.units = Math.min(Number.MAX_SAFE_INTEGER, work.units + text.length * passes);
  }
}
function chargeNativeLinearPass(work, text) {
  chargeScan(work, text);
}
function isAsciiWord(char) {
  if (!char)
    return false;
  const code = char.charCodeAt(0);
  return code >= 48 && code <= 57 || code >= 65 && code <= 90 || code === 95 || code >= 97 && code <= 122;
}
function isEcmaWhitespace(char) {
  if (!char)
    return false;
  const code = char.charCodeAt(0);
  return code === 9 || code === 10 || code === 11 || code === 12 || code === 13 || code === 32 || code === 160 || code === 65279 || code === 5760 || code >= 8192 && code <= 8202 || code === 8232 || code === 8233 || code === 8239 || code === 8287 || code === 12288;
}
function isJsLineTerminator(char) {
  return char === `
` || char === "\r" || char === "\u2028" || char === "\u2029";
}
function fixedAt(text, index, expected) {
  if (index + expected.length > scanLength(text))
    return false;
  for (let offset = 0;offset < expected.length; offset++) {
    if (scanChar(text, index + offset) !== expected[offset])
      return false;
  }
  return true;
}
function wordAt(text, index, word) {
  return !isAsciiWord(scanChar(text, index - 1)) && fixedAt(text, index, word) && !isAsciiWord(scanChar(text, index + word.length));
}
function hasWordBoundaryAfter(text, end) {
  return isAsciiWord(scanChar(text, end - 1)) !== isAsciiWord(scanChar(text, end));
}
function isRawStop(char) {
  return char === `
` || char === ";" || char === "&" || char === "|";
}
function isPipeSemicolonStop(char) {
  return char === "|" || char === ";";
}

// src/gate/analyzer/awk.ts
var AWK_SOURCE_VALUE_OPTIONS = new Set(["-e", "--source"]);
var AWK_DATA_VALUE_OPTIONS = new Set(["-F", "-v", "--assign", "--field-separator"]);
var AWK_FILE_VALUE_OPTIONS = new Set(["-f", "--file"]);
var AWK_REGEX_PREFIX_KEYWORDS = new Set(["print", "printf", "return"]);
var AWK_EXECUTABLE_SOURCE_SELECTORS = [
  { selector: "-e", kind: "inline-code", valueForm: "attached-or-separate" },
  { selector: "--source", kind: "inline-code", valueForm: "equals-or-separate" },
  { selector: "-f", kind: "program-file", valueForm: "attached-or-separate" },
  { selector: "--file", kind: "program-file", valueForm: "equals-or-separate" }
];
var REASON_AWK_SYSTEM_DYNAMIC = "Detected awk system(), pipe, or getline command with dynamic command that cannot be safely analyzed. Use a literal command or process the data without system(), pipes, or getline.";
function analyzeAwkSystemCallMatch(tokens, analyzeNested, scanWork) {
  let dynamic = false;
  for (const source of extractAwkSourceArgs(tokens)) {
    const commands = extractAwkExternalCommands(source, scanWork);
    if (!commands)
      continue;
    for (const command of commands.commands) {
      const result = analyzeNested(command);
      if (result)
        return result;
      if (command.includes("{}") || /[$`]/.test(command))
        dynamic = true;
    }
    dynamic ||= commands.dynamic;
  }
  return dynamic ? import_destructive.destructiveCommandMatch("awk.system-dynamic", REASON_AWK_SYSTEM_DYNAMIC) : null;
}
function parseAwkArgv(tokens) {
  const sources = [];
  let hasExplicitSource = false;
  let hasFileSource = false;
  let options = true;
  let valid = true;
  for (let i = 1;i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined)
      break;
    if (options && token === "--") {
      options = false;
      continue;
    }
    if (options && AWK_SOURCE_VALUE_OPTIONS.has(token)) {
      hasExplicitSource = true;
      const source = tokens[i + 1];
      valid &&= source !== undefined;
      if (source !== undefined) {
        sources.push({ tokenIndex: i + 1, kind: "inline-code", value: source });
      }
      i++;
      continue;
    }
    if (options && token.startsWith("--source=")) {
      hasExplicitSource = true;
      sources.push({
        tokenIndex: i,
        kind: "inline-code",
        value: token.slice("--source=".length)
      });
      continue;
    }
    if (options && token.startsWith("-e") && token.length > 2) {
      hasExplicitSource = true;
      sources.push({ tokenIndex: i, kind: "inline-code", value: token.slice(2) });
      continue;
    }
    if (options && (AWK_DATA_VALUE_OPTIONS.has(token) || AWK_FILE_VALUE_OPTIONS.has(token))) {
      const source = tokens[i + 1];
      valid &&= source !== undefined;
      if (AWK_FILE_VALUE_OPTIONS.has(token)) {
        hasFileSource = true;
        if (source !== undefined) {
          sources.push({ tokenIndex: i + 1, kind: "program-file", value: source });
        }
      }
      i++;
      continue;
    }
    if (options && (token.startsWith("-F") || token.startsWith("-v") && token.slice(2).includes("="))) {
      continue;
    }
    if (options && token.startsWith("-f") && token.length > 2) {
      hasFileSource = true;
      sources.push({ tokenIndex: i, kind: "program-file", value: token.slice(2) });
      continue;
    }
    if (options && (token.startsWith("--assign=") || token.startsWith("--field-separator="))) {
      continue;
    }
    if (options && token.startsWith("--file=")) {
      hasFileSource = true;
      sources.push({
        tokenIndex: i,
        kind: "program-file",
        value: token.slice("--file=".length)
      });
      continue;
    }
    if (options && token.startsWith("-") && token !== "-")
      continue;
    if (!hasExplicitSource && !hasFileSource) {
      sources.push({ tokenIndex: i, kind: "main-program", value: token });
    }
    return { sources, optionsOpen: false };
  }
  return { sources: valid ? sources : [], optionsOpen: options && valid };
}
function extractAwkExecutableSources(tokens) {
  return parseAwkArgv(tokens).sources;
}
function extractAwkSourceArgs(tokens) {
  return extractAwkExecutableSources(tokens).filter((source) => source.kind !== "program-file").map((source) => source.value);
}
function extractAwkExternalCommands(code, scanWork) {
  chargeNativeLinearPass(scanWork, code);
  const systemCommands = code.includes("system") ? extractAwkSystemCommands(code, scanWork) : null;
  const pipeCommands = extractAwkPipeCommands(code, scanWork);
  if (!systemCommands && !pipeCommands)
    return null;
  return {
    dynamic: !!systemCommands?.dynamic || !!pipeCommands?.dynamic,
    commands: [...systemCommands?.commands ?? [], ...pipeCommands?.commands ?? []]
  };
}
function extractAwkSystemCommands(code, scanWork) {
  chargeNativeLinearPass(scanWork, code);
  const commands = [];
  let sawSystem = false;
  let dynamic = false;
  let searchIndex = 0;
  while (searchIndex < code.length) {
    const char = code[searchIndex];
    if (char === '"' || char === "'") {
      searchIndex = readAwkStringLiteral(code, searchIndex, char)?.endIndex ?? searchIndex + 1;
      continue;
    }
    if (char === "#") {
      searchIndex = findAwkLineEnd(code, searchIndex + 1);
      continue;
    }
    if (char === "/" && isLikelyAwkRegexStart(code, searchIndex)) {
      searchIndex = findAwkRegexEnd(code, searchIndex + 1) ?? searchIndex + 1;
      continue;
    }
    if (!code.startsWith("system", searchIndex)) {
      searchIndex++;
      continue;
    }
    const systemIndex = searchIndex;
    searchIndex += "system".length;
    if (isAwkIdentifierChar(code[systemIndex - 1]) || isAwkIdentifierChar(code[searchIndex])) {
      continue;
    }
    let i = skipAwkWhitespace(code, searchIndex);
    if (code[i] !== "(")
      continue;
    i = skipAwkWhitespace(code, i + 1);
    const quote = code[i];
    if (quote !== '"' && quote !== "'") {
      sawSystem = true;
      dynamic = true;
      continue;
    }
    const parsed = readAwkStringLiteral(code, i, quote);
    if (!parsed) {
      sawSystem = true;
      dynamic = true;
      continue;
    }
    i = skipAwkWhitespace(code, parsed.endIndex);
    sawSystem = true;
    if (code[i] !== ")") {
      dynamic = true;
      searchIndex = parsed.endIndex;
      continue;
    }
    commands.push(parsed.value);
    searchIndex = i + 1;
  }
  if (!sawSystem)
    return null;
  return { dynamic, commands };
}
function extractAwkPipeCommands(code, scanWork) {
  chargeNativeLinearPass(scanWork, code);
  const commands = [];
  let dynamic = false;
  let sawPipeCommand = false;
  let i = 0;
  let statementStart = 0;
  let printKeywordIndex = null;
  let leadingString = null;
  let lastSignificantEnd = 0;
  while (i < code.length) {
    const char = code[i];
    if (!char)
      break;
    if (char === '"' || char === "'") {
      const parsed = readAwkStringLiteral(code, i, char);
      if (parsed && lastSignificantEnd === statementStart) {
        leadingString = { ...parsed, startIndex: i };
      }
      lastSignificantEnd = parsed?.endIndex ?? i + 1;
      i = parsed?.endIndex ?? i + 1;
      continue;
    }
    if (char === "#") {
      i = findAwkLineEnd(code, i + 1);
      statementStart = i;
      printKeywordIndex = null;
      leadingString = null;
      lastSignificantEnd = i;
      continue;
    }
    if (char === "/" && isLikelyAwkRegexStart(code, i)) {
      const regexEnd = findAwkRegexEnd(code, i + 1);
      lastSignificantEnd = regexEnd ?? i + 1;
      i = regexEnd ?? i + 1;
      continue;
    }
    if (`;
{}`.includes(char)) {
      i++;
      statementStart = i;
      printKeywordIndex = null;
      leadingString = null;
      lastSignificantEnd = i;
      continue;
    }
    if (printKeywordIndex === null && (startsAwkKeyword(code, i, "print") || startsAwkKeyword(code, i, "printf"))) {
      printKeywordIndex = i;
    }
    if (char !== "|" || code[i - 1] === "|" || code[i + 1] === "|") {
      if (!/\s/.test(char))
        lastSignificantEnd = i + 1;
      i++;
      continue;
    }
    const operatorEnd = code[i + 1] === "&" ? i + 2 : i + 1;
    const afterPipe = skipAwkWhitespace(code, operatorEnd);
    if (startsAwkKeyword(code, afterPipe, "getline")) {
      sawPipeCommand = true;
      const command = readAwkStringBeforePipe(statementStart, leadingString, lastSignificantEnd);
      dynamic ||= command === null;
      if (command !== null) {
        commands.push(command);
      }
      lastSignificantEnd = operatorEnd;
      i = operatorEnd;
      continue;
    }
    if (isAwkPrintPipe(statementStart, printKeywordIndex)) {
      sawPipeCommand = true;
      const parsed = readAwkStringAt(code, afterPipe);
      if (!parsed) {
        dynamic = true;
        lastSignificantEnd = operatorEnd;
        i = operatorEnd;
        continue;
      }
      if (!isAwkExpressionEnd(code, parsed.endIndex)) {
        dynamic = true;
        lastSignificantEnd = parsed.endIndex;
        i = parsed.endIndex;
        continue;
      }
      commands.push(parsed.value);
      lastSignificantEnd = parsed.endIndex;
      i = parsed.endIndex;
      continue;
    }
    lastSignificantEnd = operatorEnd;
    i++;
  }
  if (!sawPipeCommand)
    return null;
  return { dynamic, commands };
}
function isAwkIdentifierChar(char) {
  return !!char && /[A-Za-z0-9_]/.test(char);
}
function skipAwkWhitespace(code, index) {
  let i = index;
  while (/\s/.test(code[i] ?? "")) {
    i++;
  }
  return i;
}
function isAwkExpressionEnd(code, index) {
  let i = index;
  while (/[\t\f\v\r ]/.test(code[i] ?? "")) {
    i++;
  }
  const char = code[i];
  return !char || `;
}#`.includes(char);
}
function readAwkStringLiteral(code, startIndex, quote) {
  let value = "";
  let escaped = false;
  for (let i = startIndex + 1;i < code.length; i++) {
    const char = code[i];
    if (!char)
      break;
    if (escaped) {
      const decoded = decodeAwkEscape(code, i);
      if (!decoded)
        return null;
      value += decoded.value;
      i = decoded.endIndex;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === quote) {
      return { value, endIndex: i + 1 };
    }
    value += char;
  }
  return null;
}
function readAwkStringAt(code, index) {
  const quote = code[index];
  if (quote !== '"' && quote !== "'")
    return null;
  return readAwkStringLiteral(code, index, quote);
}
function readAwkStringBeforePipe(statementStart, leadingString, lastSignificantEnd) {
  if (!leadingString)
    return null;
  return leadingString.startIndex >= statementStart && leadingString.endIndex === lastSignificantEnd ? leadingString.value : null;
}
function decodeAwkEscape(code, index) {
  const char = code[index];
  if (!char)
    return null;
  if (char === "x") {
    const hex = code.slice(index + 1, index + 3);
    if (!/^[0-9A-Fa-f]{2}$/.test(hex))
      return null;
    return { value: String.fromCharCode(Number.parseInt(hex, 16)), endIndex: index + 2 };
  }
  if (/[0-7]/.test(char)) {
    const match = /^[0-7]{1,3}/.exec(code.slice(index));
    if (!match)
      return null;
    return {
      value: String.fromCharCode(Number.parseInt(match[0], 8)),
      endIndex: index + match[0].length - 1
    };
  }
  const simpleEscapes = {
    a: "\x07",
    b: "\b",
    f: "\f",
    n: `
`,
    r: "\r",
    t: "\t",
    v: "\v"
  };
  return { value: simpleEscapes[char] ?? char, endIndex: index };
}
function startsAwkKeyword(code, index, keyword) {
  return code.startsWith(keyword, index) && !isAwkIdentifierChar(code[index - 1]) && !isAwkIdentifierChar(code[index + keyword.length]);
}
function isAwkPrintPipe(statementStart, printKeywordIndex) {
  return printKeywordIndex !== null && printKeywordIndex >= statementStart;
}
function findAwkLineEnd(code, index) {
  const lineEnd = code.indexOf(`
`, index);
  return lineEnd === -1 ? code.length : lineEnd + 1;
}
function isLikelyAwkRegexStart(code, index) {
  const previousIndex = findPreviousAwkNonWhitespace(code, index);
  if (previousIndex === -1)
    return true;
  if ("{([,;!~=".includes(code[previousIndex] ?? ""))
    return true;
  let wordStart = previousIndex;
  while (isAwkIdentifierChar(code[wordStart - 1]))
    wordStart--;
  return AWK_REGEX_PREFIX_KEYWORDS.has(code.slice(wordStart, previousIndex + 1));
}
function findPreviousAwkNonWhitespace(code, index) {
  for (let i = index - 1;i >= 0; i--) {
    if (!/\s/.test(code[i] ?? ""))
      return i;
  }
  return -1;
}
function findAwkRegexEnd(code, index) {
  let escaped = false;
  for (let i = index;i < code.length; i++) {
    const char = code[i];
    if (!char)
      break;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "/") {
      return i + 1;
    }
  }
  return null;
}

// src/gate/analyzer/child-command.ts
var import_budget2 = require("./core.js");
var import_tokens3 = require("./core-shell.js");

// src/gate/analyzer/transparent-wrappers.ts
var import_transparent_wrappers = require("./core.js");
var import_constants = require("./core-shell.js");
var import_tokens2 = require("./core-shell.js");

// src/gate/analyzer/device.ts
var import_destructive2 = require("./core-shell.js");
var REASON_DD_DEVICE_WRITE = "dd writing to a /dev device can destroy a disk or partition. Run device writes manually after confirming the target.";
var REASON_MKFS_DEVICE = "mkfs formatting a /dev device erases everything on it. Run the format manually after confirming the target.";
var REASON_SHRED_TARGET = "shred permanently destroys the given target. Use rm for ordinary deletes, or run shred manually.";
function isDeviceCommand(head) {
  return head === "dd" || head === "shred" || head === "mkfs" || head.startsWith("mkfs.");
}
function analyzeDeviceCommandMatch(head, tokens) {
  const operands = tokens.slice(1);
  if (head === "dd" && operands.some((token) => /^of=\/dev\/.+/.test(token))) {
    return import_destructive2.destructiveCommandMatch("dd.device-write", REASON_DD_DEVICE_WRITE);
  }
  if ((head === "mkfs" || head.startsWith("mkfs.")) && operands.some((token) => token.startsWith("/dev/"))) {
    return import_destructive2.destructiveCommandMatch("mkfs.device", REASON_MKFS_DEVICE);
  }
  if (head === "shred" && operands.length > 0) {
    return import_destructive2.destructiveCommandMatch("shred.target", REASON_SHRED_TARGET);
  }
  return null;
}

// src/gate/analyzer/transparent-wrappers.ts
var STANDARD_COMMAND_WRAPPERS = new Set(["sudo", "env", "command", "builtin"]);
var EXEC_WRAPPERS = new Set([
  "caffeinate",
  "exec",
  "nice",
  "nohup",
  "setsid",
  "stdbuf",
  "time",
  "timeout"
]);
function unwrapTransparentWrapper(tokens, policy) {
  const head = tokens[0];
  if (!head || !isTransparentWrapper(import_tokens2.getBasename(head), policy)) {
    return null;
  }
  const wrapper = import_tokens2.getBasename(head);
  const startIndex = tokens[1] === "--" ? 2 : 1;
  const childIndices = findChildIndices(tokens, startIndex, wrapper, policy);
  const childIndex = childIndices[0];
  if (childIndex === undefined)
    return null;
  return {
    wrapper,
    tokens: tokens.slice(childIndex),
    childIndex,
    alternativeChildIndices: childIndices.slice(1)
  };
}
function findChildIndices(tokens, startIndex, wrapper, policy) {
  const explicitChild = tokens[1] === "--";
  const childIndices = [];
  for (let index = startIndex;index < tokens.length; index++) {
    const child = tokens[index];
    if (!child)
      continue;
    const protectable = import_tokens2.getBasename(child) !== wrapper && isProtectableCommand(child, policy);
    if (protectable)
      childIndices.push(index);
    if (!protectable && import_constants.DISPLAY_COMMANDS.has(import_tokens2.normalizeCommandToken(child)))
      break;
    if (explicitChild)
      break;
  }
  return childIndices;
}
function isProtectableCommand(token, policy) {
  const basename = import_tokens2.getBasename(token);
  const normalized = import_tokens2.normalizeCommandToken(token);
  return normalized === "git" || basename === "busybox" || isStandardCommandWrapper(token) || import_transparent_wrappers.BUILTIN_ANALYZED_COMMANDS.has(basename) || isDeviceCommand(normalized) || isTransparentWrapper(basename, policy) || import_constants.SHELL_WRAPPERS.has(normalized) || token === "$SHELL" || import_transparent_wrappers.isInterpreterCommand(normalized) || import_constants.AWK_INTERPRETERS.has(normalized) || policy.rules.some((rule) => rule.command === basename);
}
function isTransparentWrapper(command, policy) {
  return EXEC_WRAPPERS.has(command) || policy.transparentWrappers.includes(command);
}
function isStandardCommandWrapper(token) {
  return STANDARD_COMMAND_WRAPPERS.has(token.toLowerCase());
}

// src/gate/analyzer/child-command.ts
function childProvenance(childCommand, context) {
  return {
    embedded: false,
    cwd: childCommand.cwd,
    originalCwd: context.originalCwd,
    effectiveCwd: childCommand.cwd,
    envAssignments: childCommand.envAssignments,
    allowTmpdirVar: context.allowTmpdirVar,
    worktreeMode: context.worktreeMode,
    wrappedByTransparent: false
  };
}
function normalizeChildCommands(tokens, context) {
  const policy = context.policy ?? { rules: [], transparentWrappers: [] };
  return normalizeChildCommandCandidates([...tokens], context.environment, context.cwd, context.cwd, new Map, new Map(context.envAssignments ?? []), policy, { iterations: 0 }, false);
}
function* normalizeChildCommandCandidates(tokens, environment, wrapperCwd, cwd, wrapperEnvAssignments, envAssignments, policy, budget, wrappedByTransparent) {
  const wrapperInfo = stripWrappersWithInfo(tokens, environment, wrapperCwd, envAssignments);
  for (const [key, value] of wrapperInfo.envAssignments) {
    envAssignments.set(key, value);
    wrapperEnvAssignments.set(key, value);
  }
  const childTokens = wrapperInfo.tokens;
  const childWrapperCwd = wrapperInfo.cwd;
  if (wrapperInfo.envSplitValues) {
    const spliced = reconstructEnvSplitWords(wrapperInfo.envSplitValues, childTokens);
    if (!spliced)
      throw new import_budget2.AnalysisLimit("derivedCommandShape");
    reserveChildNormalization(budget);
    yield* normalizeChildCommandCandidates(spliced, environment, childWrapperCwd, cwd, wrapperEnvAssignments, envAssignments, policy, budget, wrappedByTransparent);
    return;
  }
  if (isStandardCommandWrapper(childTokens[0] ?? "")) {
    throw new import_budget2.AnalysisLimit("wrapperPeelIterations");
  }
  const transparentWrapper = unwrapTransparentWrapper(childTokens, policy);
  if (transparentWrapper) {
    for (const childIndex of [
      transparentWrapper.childIndex,
      ...transparentWrapper.alternativeChildIndices
    ]) {
      reserveChildNormalization(budget);
      yield* normalizeChildCommandCandidates(childIndex === transparentWrapper.childIndex ? transparentWrapper.tokens : childTokens.slice(childIndex), environment, childWrapperCwd, cwd, new Map(wrapperEnvAssignments), new Map(envAssignments), policy, budget, true);
    }
    return;
  }
  if (isBusyboxWrapper(childTokens)) {
    reserveChildNormalization(budget);
    yield* normalizeChildCommandCandidates(childTokens.slice(1), environment, childWrapperCwd, cwd, wrapperEnvAssignments, envAssignments, policy, budget, wrappedByTransparent);
    return;
  }
  yield normalizedChildCommand(childTokens, childWrapperCwd, cwd, wrapperEnvAssignments, envAssignments, wrappedByTransparent);
}
function normalizedChildCommand(tokens, wrapperCwd, cwd, wrapperEnvAssignments, envAssignments, wrappedByTransparent) {
  return {
    tokens,
    cwd: wrapperCwd === null ? undefined : wrapperCwd ?? cwd,
    wrapperCwd,
    wrapperEnvAssignments,
    envAssignments,
    head: import_tokens3.getBasename(tokens[0] ?? "").toLowerCase(),
    wrappedByTransparent
  };
}
function reserveChildNormalization(budget) {
  if (budget.iterations >= import_budget2.LIMITS.wrapperPeelIterations.cap) {
    throw new import_budget2.AnalysisLimit("wrapperPeelIterations");
  }
  budget.iterations++;
}
function isBusyboxWrapper(tokens) {
  return import_tokens3.getBasename(tokens[0] ?? "").toLowerCase() === "busybox" && tokens.length > 1;
}
function collectCommandTemplate(tokens, start) {
  const templateTokens = [];
  let i = start;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === undefined || token === ":::")
      break;
    templateTokens.push(token);
    i++;
  }
  return {
    markerIndex: i < tokens.length && tokens[i] === ":::" ? i : -1,
    templateTokens
  };
}

// src/gate/analyzer/dangerous-text.ts
var import_destructive3 = require("./core-shell.js");

// src/gate/analyzer/linear-danger-scanner.ts
var import_constants2 = require("./core-shell.js");
function hasLinearInterpreterDanger(code, kind, work) {
  const text = scannedText(code, work);
  if (kind === "rm")
    return hasInterpreterRm(text);
  if (kind === "dd")
    return hasInterpreterDd(text);
  return hasFindDelete(text, true);
}
function hasLinearDangerousText(text, kind, work) {
  const scanned = scannedText(text, work);
  if (kind === "rm")
    return hasRawRm(scanned);
  if (kind === "reset-hard")
    return hasResetOption(scanned, "--ha", "rd");
  if (kind === "reset-merge")
    return hasResetOption(scanned, "--me", "rge");
  if (kind === "clean")
    return hasCleanForce(scanned);
  if (kind === "checkout")
    return hasCheckoutForce(scanned);
  if (kind === "push-force")
    return hasPushForce(scanned);
  if (kind === "push-refspec")
    return hasPushForcedRefspec(scanned);
  if (kind === "push-delete")
    return hasPushDelete(scanned);
  if (kind === "branch")
    return hasBranchDeleteForce(scanned);
  if (kind === "tag")
    return hasTagDelete(scanned);
  if (kind === "restore")
    return hasRestoreWithoutExclusion(scanned);
  return hasFindDelete(scanned, false);
}
function hasInterpreterRm(text) {
  let active = false;
  let recursive = false;
  let force = false;
  let tokenStart = -1;
  for (let i = 0;i <= scanLength(text); i++) {
    const char = scanChar(text, i);
    if (!active) {
      const afterRm = scanChar(text, i + 2);
      if (wordAt(text, i, "rm") && isEcmaWhitespace(afterRm) && afterRm !== `
`) {
        active = true;
        i++;
      }
      continue;
    }
    const escapedLineFeedEnd = getInterpreterEscapedLineFeedEnd(text, i);
    if (char === `
` || escapedLineFeedEnd !== -1) {
      active = false;
      recursive = false;
      force = false;
      tokenStart = -1;
      if (escapedLineFeedEnd !== -1)
        i = escapedLineFeedEnd - 1;
      continue;
    }
    if (char === ";" || char === "&" || char === "|" || i === scanLength(text)) {
      if (tokenStart >= 0) {
        const flags = interpreterRmFlags(text, tokenStart, i);
        recursive ||= flags.recursive;
        force ||= flags.force;
      }
      if (recursive && force)
        return true;
      active = false;
      recursive = false;
      force = false;
      tokenStart = -1;
      continue;
    }
    if (isEcmaWhitespace(char)) {
      if (tokenStart < 0)
        continue;
      if (fixedAt(text, tokenStart, "--") && i - tokenStart === 2) {
        active = false;
        recursive = false;
        force = false;
        tokenStart = -1;
        continue;
      }
      const flags = interpreterRmFlags(text, tokenStart, i);
      recursive ||= flags.recursive;
      force ||= flags.force;
      if (recursive && force)
        return true;
      tokenStart = -1;
      continue;
    }
    if (tokenStart < 0)
      tokenStart = i;
  }
  return false;
}
function getInterpreterEscapedLineFeedEnd(text, index) {
  if (scanChar(text, index) !== "\\" || scanChar(text, index - 1) === "\\")
    return -1;
  if (fixedAt(text, index, String.raw`\n`))
    return index + 2;
  if (fixedAt(text, index, String.raw`\x0a`) || fixedAt(text, index, String.raw`\x0A`)) {
    return index + 5;
  }
  if (fixedAt(text, index, String.raw`\u000a`) || fixedAt(text, index, String.raw`\u000A`)) {
    return index + 7;
  }
  return fixedAt(text, index, String.raw`\012`) ? index + 4 : -1;
}
function interpreterRmFlags(text, start, end) {
  if (isScannedLongOptionAbbreviation(text, start, end, "recursive")) {
    return { recursive: true, force: false };
  }
  if (isScannedLongOptionAbbreviation(text, start, end, "force")) {
    return { recursive: false, force: true };
  }
  if (scanChar(text, start) !== "-" || scanChar(text, start + 1) === "-") {
    return { recursive: false, force: false };
  }
  let recursive = false;
  let force = false;
  for (let i = start + 1;i < end; i++) {
    const char = scanChar(text, i);
    recursive ||= char === "r" || char === "R";
    force ||= char === "f" || char === "F";
  }
  return { recursive, force };
}
function isScannedLongOptionAbbreviation(text, start, end, option) {
  const length = end - start - 2;
  if (length < 1 || length > option.length || !fixedAt(text, start, "--"))
    return false;
  for (let i = 0;i < length; i++) {
    if (scanChar(text, start + i + 2) !== option[i])
      return false;
  }
  return true;
}
function hasInterpreterDd(text) {
  let active = false;
  for (let i = 0;i < scanLength(text); i++) {
    if (isRawStop(scanChar(text, i))) {
      active = false;
      continue;
    }
    if (wordAt(text, i, "dd")) {
      active = true;
      i++;
      continue;
    }
    if (!active || !wordAt(text, i, "of") || !fixedAt(text, i, "of=/dev/"))
      continue;
    const valueStart = i + 8;
    if (valueStart < scanLength(text) && !isEcmaWhitespace(scanChar(text, valueStart)) && scanChar(text, valueStart) !== "'" && scanChar(text, valueStart) !== '"') {
      return true;
    }
  }
  return false;
}
function hasRawRm(text) {
  let active = false;
  let recursiveLong = false;
  let forceLong = false;
  for (let i = 0;i <= scanLength(text); ) {
    const char = scanChar(text, i);
    if (i === scanLength(text) || isRawStop(char)) {
      active = false;
      recursiveLong = false;
      forceLong = false;
      i++;
      continue;
    }
    const start = rawRmAt(text, i);
    if (start >= 0) {
      if (rawRmShortMatch(text, start))
        return true;
      let bodyStart = start;
      let crossedLf = false;
      while (isEcmaWhitespace(scanChar(text, bodyStart))) {
        crossedLf ||= scanChar(text, bodyStart) === `
`;
        bodyStart++;
      }
      if (crossedLf) {
        recursiveLong = false;
        forceLong = false;
      }
      active = true;
      i = bodyStart;
      continue;
    }
    if (!active) {
      i++;
      continue;
    }
    if (fixedAt(text, i, "--") && (i === 0 || isEcmaWhitespace(scanChar(text, i - 1))) && (!scanChar(text, i + 2) || isEcmaWhitespace(scanChar(text, i + 2)) || isRawStop(scanChar(text, i + 2)))) {
      active = false;
      recursiveLong = false;
      forceLong = false;
      i += 2;
      continue;
    }
    recursiveLong ||= fixedAt(text, i, "--recursive") && hasWordBoundaryAfter(text, i + 11) || hasRawLongOptionPrefix(text, i, "recursive");
    forceLong ||= fixedAt(text, i, "--force") && hasWordBoundaryAfter(text, i + 7) || hasRawLongOptionPrefix(text, i, "force");
    if (recursiveLong && forceLong)
      return true;
    i++;
  }
  return false;
}
function hasRawLongOptionPrefix(text, start, option) {
  if (!fixedAt(text, start, "--"))
    return false;
  let length = 0;
  while (length <= option.length) {
    const char = scanChar(text, start + length + 2);
    if (!char || isEcmaWhitespace(char) || isRawStop(char))
      break;
    if (char !== option[length])
      return false;
    length++;
  }
  return length > 0 && hasWordBoundaryAfter(text, start + length + 2);
}
function rawRmShortMatch(text, start) {
  let cursor = start;
  let recursive = false;
  let force = false;
  while (cursor < scanLength(text)) {
    while (isEcmaWhitespace(scanChar(text, cursor)))
      cursor++;
    const tokenStart = cursor;
    while (cursor < scanLength(text) && !isEcmaWhitespace(scanChar(text, cursor)))
      cursor++;
    if (scanChar(text, tokenStart) !== "-" || cursor - tokenStart === 2 && fixedAt(text, tokenStart, "--")) {
      return false;
    }
    const recursiveLong = hasRawLongOptionAt(text, tokenStart, "recursive");
    const forceLong = hasRawLongOptionAt(text, tokenStart, "force");
    if (recursive && forceLong || force && recursiveLong)
      return true;
    recursive ||= recursiveLong;
    force ||= forceLong;
    if (scanChar(text, tokenStart + 1) === "-")
      continue;
    const flags = summarizeRawShortToken(text, tokenStart, cursor);
    if (flags.combined || recursive && flags.forceAtBoundary || force && flags.recursiveAtBoundary) {
      return true;
    }
    recursive ||= flags.recursive;
    force ||= flags.force;
  }
  return false;
}
function hasRawLongOptionAt(text, start, option) {
  return fixedAt(text, start, `--${option}`) && hasWordBoundaryAfter(text, start + option.length + 2) || hasRawLongOptionPrefix(text, start, option);
}
function rawRmAt(text, index) {
  if (index > 0 && isAsciiWord(scanChar(text, index - 1)))
    return -1;
  let cursor = index;
  if (scanChar(text, cursor) === "\\")
    cursor++;
  if (scanChar(text, cursor) !== "r")
    return -1;
  cursor++;
  if (scanChar(text, cursor) === "\\")
    cursor++;
  if (scanChar(text, cursor) !== "m" || !isEcmaWhitespace(scanChar(text, cursor + 1)))
    return -1;
  return cursor + 1;
}
function summarizeRawShortToken(text, start, end) {
  let recursive = false;
  let force = false;
  let recursiveAtBoundary = false;
  let forceAtBoundary = false;
  let combined = false;
  if (scanChar(text, start) !== "-") {
    return { recursive, force, recursiveAtBoundary, forceAtBoundary, combined };
  }
  let previous = "";
  for (let i = start + 1;i < end; i++) {
    const char = scanChar(text, i) ?? "";
    const boundary = (char === "r" || char === "f") && hasWordBoundaryAfter(text, i + 1);
    recursive ||= char === "r";
    force ||= char === "f";
    recursiveAtBoundary ||= char === "r" && boundary;
    forceAtBoundary ||= char === "f" && boundary;
    combined ||= (previous === "r" && char === "f" || previous === "f" && char === "r") && boundary;
    previous = char;
  }
  return { recursive, force, recursiveAtBoundary, forceAtBoundary, combined };
}
function hasResetOption(text, prefix, optional) {
  return scanGitSuffix(text, "reset", isPipeSemicolonStop, true, (index) => scanChar(text, index) === "-" && isPartialLongOption(text, index, prefix, optional) ? true : index);
}
function hasCleanForce(text) {
  return scanGitSuffix(text, "clean", isPipeSemicolonStop, true, (index) => {
    if (scanChar(text, index) !== "-")
      return index;
    if (isPartialLongOption(text, index, "--fo", "rce"))
      return true;
    const end = tokenEnd(text, index, isPipeSemicolonStop);
    for (let cursor = index + 1;cursor < end; cursor++) {
      if (scanChar(text, cursor) === "f")
        return true;
    }
    return end - 1;
  });
}
function scanGitCommandAt(text, index, command) {
  if (!wordAt(text, index, "git"))
    return null;
  let cursor = index + 3;
  if (!isEcmaWhitespace(scanChar(text, cursor))) {
    return { commandEnd: -1, next: cursor };
  }
  while (isEcmaWhitespace(scanChar(text, cursor)))
    cursor++;
  while (cursor < scanLength(text)) {
    if (isRawStop(scanChar(text, cursor))) {
      return { commandEnd: -1, next: cursor };
    }
    const end = tokenEnd(text, cursor, isRawStop);
    if (wordAt(text, cursor, command)) {
      return { commandEnd: cursor + command.length, next: end };
    }
    if (scanChar(text, cursor) !== "-") {
      return { commandEnd: -1, next: end };
    }
    const doubleDash = end - cursor === 2 && fixedAt(text, cursor, "--");
    const consumesValue = matchesGitGlobalOptionWithValue(text, cursor, end);
    cursor = end;
    while (isEcmaWhitespace(scanChar(text, cursor)))
      cursor++;
    if (doubleDash) {
      const commandEnd = wordAt(text, cursor, command) ? cursor + command.length : -1;
      return { commandEnd, next: tokenEnd(text, cursor, isRawStop) };
    }
    if (!consumesValue)
      continue;
    if (cursor >= scanLength(text) || isRawStop(scanChar(text, cursor))) {
      return { commandEnd: -1, next: cursor };
    }
    cursor = tokenEnd(text, cursor, isRawStop);
    while (isEcmaWhitespace(scanChar(text, cursor)))
      cursor++;
  }
  return { commandEnd: -1, next: cursor };
}
function matchesGitGlobalOptionWithValue(text, start, end) {
  for (const option of import_constants2.GIT_GLOBAL_OPTS_WITH_VALUE) {
    if (end - start === option.length && fixedAt(text, start, option))
      return true;
  }
  return false;
}
function hasCheckoutForce(text) {
  return hasGitShortOption(text, {
    command: "checkout",
    longPrefix: "--fo",
    longOptional: "rce",
    shortFlag: "f",
    excludedShortStarts: "bBU"
  });
}
function hasPushForce(text) {
  return scanGitSuffix(text, "push", isPipeSemicolonStop, true, (i) => {
    if (scanChar(text, i) !== "-")
      return i;
    if (scanChar(text, i + 1) === "f" && !isAsciiWord(scanChar(text, i + 2)) && !fixedAt(text, i + 2, "-with-lease")) {
      return true;
    }
    const end = partialLongOptionEnd(text, i, "--fo", "rce");
    if (end >= 0 && !fixedAt(text, end, "-with-lease"))
      return true;
    return i;
  });
}
function hasPushForcedRefspec(text) {
  return scanGitSuffix(text, "push", isRawStop, false, (i) => {
    if (isEcmaWhitespace(scanChar(text, i)) && scanChar(text, i + 1) === "+" && i + 2 < scanLength(text) && !isRawStop(scanChar(text, i + 2)) && !isEcmaWhitespace(scanChar(text, i + 2)))
      return true;
    if (scanChar(text, i) === ":" && scanChar(text, i + 1) === "+")
      return true;
    return i;
  });
}
function hasPushDelete(text) {
  return scanGitSuffix(text, "push", isRawStop, false, (i) => {
    if (scanChar(text, i) === "-" && isPartialLongOption(text, i, "--de", "lete"))
      return true;
    if (isEcmaWhitespace(scanChar(text, i)) && scanChar(text, i + 1) === ":" && i + 2 < scanLength(text) && !isEcmaWhitespace(scanChar(text, i + 2)) && !isRawStop(scanChar(text, i + 2)))
      return true;
    return i;
  });
}
function hasBranchDeleteForce(text) {
  let active = false;
  let deletion = false;
  let force = false;
  for (let i = 0;i <= scanLength(text); i++) {
    if (i === scanLength(text) || isRawStop(scanChar(text, i))) {
      if (deletion && force)
        return true;
      active = false;
      deletion = false;
      force = false;
      continue;
    }
    if (!active) {
      const gitCommand = scanGitCommandAt(text, i, "branch");
      if (gitCommand) {
        active = gitCommand.commandEnd >= 0;
        i = Math.max(i, (active ? gitCommand.commandEnd : gitCommand.next) - 1);
        continue;
      }
    }
    if (!active || scanChar(text, i) !== "-")
      continue;
    const end = tokenEnd(text, i, isRawStop);
    const flags = branchTokenFlags(text, i, end);
    deletion ||= flags.deletion;
    force ||= flags.force;
    if (deletion && force)
      return true;
    i = end - 1;
  }
  return false;
}
function branchTokenFlags(text, start, end) {
  let deletion = false;
  let force = false;
  for (let i = start;i < end; i++) {
    if (scanChar(text, i) !== "-")
      continue;
    if (isPartialLongOption(text, i, "--de", "lete"))
      deletion = true;
    if (isPartialLongOption(text, i, "--fo", "rce"))
      force = true;
    if (scanChar(text, i + 1) === "-")
      continue;
    let cursor = i + 1;
    let clusterDeletion = false;
    let clusterForce = false;
    let clusterUpperD = false;
    while (cursor < end && isAsciiLetter(scanChar(text, cursor))) {
      const char = scanChar(text, cursor);
      clusterDeletion ||= char === "d" || char === "D";
      clusterForce ||= char === "f";
      clusterUpperD ||= char === "D";
      cursor++;
    }
    if (!hasWordBoundaryAfter(text, cursor))
      continue;
    deletion ||= clusterDeletion;
    force ||= clusterForce || clusterUpperD;
  }
  return { deletion, force };
}
function isAsciiLetter(char) {
  if (!char)
    return false;
  const code = char.charCodeAt(0);
  return code >= 65 && code <= 90 || code >= 97 && code <= 122;
}
function hasTagDelete(text) {
  return hasGitShortOption(text, {
    command: "tag",
    longPrefix: "--de",
    longOptional: "lete",
    shortFlag: "d",
    excludedShortStarts: ""
  });
}
function hasGitShortOption(text, options) {
  const contexts = [
    {
      outerActive: false,
      shortActive: false,
      hasShortFlag: false,
      depth: 0,
      quote: "",
      escaped: false
    }
  ];
  for (let i = 0;i < scanLength(text); i++) {
    const char = scanChar(text, i);
    const context = contexts[contexts.length - 1];
    if (!context)
      return false;
    const escaped = context.escaped;
    context.escaped = !escaped && context.quote !== "'" && char === "\\";
    if (!escaped && char === "'" && context.quote !== '"') {
      context.quote = context.quote === "'" ? "" : "'";
    }
    if (!escaped && char === '"' && context.quote !== "'") {
      context.quote = context.quote === '"' ? "" : '"';
    }
    if (char === "$" && scanChar(text, i + 1) === "(" && (contexts.length === 1 || !escaped && context.quote !== "'")) {
      contexts.push({
        outerActive: false,
        shortActive: false,
        hasShortFlag: false,
        depth: 1,
        quote: "",
        escaped: false
      });
      i++;
      continue;
    }
    if (!escaped && !context.quote && contexts.length > 1 && char === "(") {
      context.depth++;
      continue;
    }
    if (!escaped && !context.quote && contexts.length > 1 && char === ")") {
      context.depth--;
      if (context.depth === 0)
        contexts.pop();
      continue;
    }
    if (isEcmaWhitespace(char)) {
      context.shortActive = false;
      context.hasShortFlag = false;
    }
    if (!context.outerActive) {
      const gitCommand = scanGitCommandAt(text, i, options.command);
      if (gitCommand) {
        context.outerActive = gitCommand.commandEnd >= 0 && isEcmaWhitespace(scanChar(text, gitCommand.commandEnd));
        context.shortActive = false;
        context.hasShortFlag = false;
        i = Math.max(i, (context.outerActive ? gitCommand.commandEnd : gitCommand.next) - 1);
        continue;
      }
    }
    if (context.outerActive && char === "-") {
      if (isPartialLongOption(text, i, options.longPrefix, options.longOptional))
        return true;
      context.shortActive ||= !options.excludedShortStarts.includes(scanChar(text, i + 1) ?? "");
    }
    context.hasShortFlag ||= context.shortActive && char === options.shortFlag;
    if (context.hasShortFlag && hasWordBoundaryAfter(text, i + 1))
      return true;
    if (isPipeSemicolonStop(char))
      context.outerActive = false;
  }
  return false;
}
function scanGitSuffix(text, command, stop, requireTrailingWhitespace, inspect) {
  let active = false;
  for (let i = 0;i < scanLength(text); i++) {
    const char = scanChar(text, i);
    const stopped = stop(char);
    if (!active && !stopped) {
      const gitCommand = scanGitCommandAt(text, i, command);
      if (gitCommand) {
        active = gitCommand.commandEnd >= 0 && (!requireTrailingWhitespace || isEcmaWhitespace(scanChar(text, gitCommand.commandEnd)));
        i = Math.max(i, (active ? gitCommand.commandEnd : gitCommand.next) - 1);
        continue;
      }
    }
    if (active) {
      const result = inspect(i);
      if (result === true)
        return true;
      for (let cursor = i;cursor <= result; cursor++) {
        if (stop(scanChar(text, cursor)))
          active = false;
      }
      i = result;
    }
    if (stopped)
      active = false;
  }
  return false;
}
function hasRestoreWithoutExclusion(text) {
  let candidate = false;
  for (let i = 0;i < scanLength(text); i++) {
    if (isJsLineTerminator(scanChar(text, i))) {
      if (candidate)
        return true;
      candidate = false;
      continue;
    }
    if (!candidate) {
      const gitCommand = scanGitCommandAt(text, i, "restore");
      if (gitCommand) {
        candidate = gitCommand.commandEnd >= 0;
        i = Math.max(i, (candidate ? gitCommand.commandEnd : gitCommand.next) - 1);
        continue;
      }
    }
    if (candidate && scanChar(text, i) === "-" && scanChar(text, i + 1) === "-" && (fixedAt(text, i + 2, "staged") || fixedAt(text, i + 2, "help"))) {
      candidate = false;
    }
  }
  return candidate;
}
function hasFindDelete(text, interpreter) {
  let active = false;
  for (let i = 0;i < scanLength(text); i++) {
    const char = scanChar(text, i);
    const stopped = interpreter ? isJsLineTerminator(char) : isRawStop(char);
    if (active && isEcmaWhitespace(char) && scanChar(text, i + 1) === "-" && wordAt(text, i + 2, "delete")) {
      return true;
    }
    if (stopped) {
      active = false;
      continue;
    }
    if (wordAt(text, i, "find")) {
      active = true;
      i += 3;
    }
  }
  return false;
}
function tokenEnd(text, start, stop) {
  let end = start;
  while (end < scanLength(text) && !isEcmaWhitespace(scanChar(text, end)) && !stop(scanChar(text, end))) {
    end++;
  }
  return end;
}
function partialLongOptionEnd(text, start, prefix, optional) {
  if (!fixedAt(text, start, prefix))
    return -1;
  let end = start + prefix.length;
  for (let i = 0;i < optional.length && scanChar(text, end) === optional[i]; i++)
    end++;
  return hasWordBoundaryAfter(text, end) ? end : -1;
}
function isPartialLongOption(text, start, prefix, optional) {
  return partialLongOptionEnd(text, start, prefix, optional) >= 0;
}

// src/gate/analyzer/dangerous-text.ts
function dangerousInTextMatch(text, scanWork) {
  chargeScan(scanWork, text, 2);
  const lower = text.toLowerCase();
  const stripped = lower.trimStart();
  const isEchoOrRg = stripped.startsWith("echo ") || stripped.startsWith("rg ");
  const patterns = [
    { scan: "rm", label: "rm -rf" },
    { scan: "reset-hard", label: "git reset --hard" },
    { scan: "reset-merge", label: "git reset --merge" },
    { scan: "clean", label: "git clean -f" },
    { scan: "checkout", label: "git checkout --force" },
    { scan: "push-force", label: "git push --force" },
    { scan: "push-refspec", label: "git push --force" },
    { scan: "push-delete", label: "git push delete" },
    { scan: "branch", label: "git branch -D", caseSensitive: true },
    { scan: "tag", label: "git tag -d" },
    { regex: /\bgit\s+stash\s+(drop|clear)\b/, label: "git stash drop/clear" },
    { regex: /\bgit\s+checkout\s+--\s/, label: "git checkout --" },
    { scan: "restore", label: "git restore without --staged" },
    { scan: "find", label: "find -delete", skipForEchoRg: true },
    { regex: /\bdd\b[^\n|;&]*\bof=\/dev\/\S/, label: "dd of=/dev/", skipForEchoRg: true },
    { regex: /\bmkfs(?:\.[a-z0-9_-]+)?\s+\/dev\/\S/, label: "mkfs /dev/", skipForEchoRg: true },
    { regex: /\bshred\b\s+\S/, label: "shred", skipForEchoRg: true },
    {
      regex: /\b(?:curl|wget|fetch|aria2c|https?|xhs?|ncat|netcat|nc)\b(?:[^\n|;&]|\\\n)*\|(?:\s|\\\n)*(?:(?:sudo|env|command|builtin)(?:\s+(?:-\S+|\w+=\S*))*\s+)?(?:[^\s|;&]*\/)?(?:ba|da|z|k)?sh(?![^\s;&|])/,
      label: "download piped to shell",
      skipForEchoRg: true
    }
  ];
  for (const pattern of patterns) {
    if (pattern.skipForEchoRg && isEchoOrRg)
      continue;
    const target = pattern.caseSensitive ? text : lower;
    if (pattern.regex)
      chargeNativeLinearPass(scanWork, target);
    if ((pattern.regex?.test(target) ?? false) || pattern.scan && hasLinearDangerousText(target, pattern.scan, scanWork)) {
      return import_destructive3.destructiveCommandMatch("raw-text.dangerous-command", `Unparseable command text contains a destructive pattern (${pattern.label}). Rewrite as a plain, parseable command so it can be analyzed.`);
    }
  }
  return null;
}

// src/gate/analyzer/dynamic-input.ts
function solveDynamicInput(token, start, length, target) {
  const prefix = token.slice(0, start);
  const suffix = token.slice(start + length);
  return target.startsWith(prefix) && target.endsWith(suffix) ? target.slice(prefix.length, target.length - suffix.length) : null;
}
function substitutionAddsExecutableSource(existing, candidates, substituted) {
  const key = (source) => `${source.tokenIndex}\x00${source.kind}\x00${source.value}`;
  const known = new Set(existing.map(key));
  return Array.from(candidates).some((candidate) => substituted(candidate).some((source) => !known.has(key(source))));
}

// src/gate/analyzer/find.ts
var import_budget4 = require("./core.js");
var import_tmpdir2 = require("./core.js");
var import_effective_rules2 = require("./core.js");
var import_constants3 = require("./core-shell.js");
var import_destructive5 = require("./core-shell.js");
var import_tokens5 = require("./core-shell.js");
var import_git_metadata_protection2 = require("./gate.js");

// src/gate/analyzer/recursive-delete-targets.ts
var import_node_path2 = require("node:path");
var import_budget3 = require("./core.js");
var import_canonicalization = require("./core.js");
var import_tmpdir = require("./core.js");
var import_allow_paths = require("./core.js");
var import_effective_rules = require("./core.js");
var import_destructive4 = require("./core-shell.js");
var import_posix = require("./core-shell.js");
var import_git_metadata_protection = require("./gate.js");
var IS_WINDOWS = process.platform === "win32";
var BRACE_EXPANSION_LIMIT = 64;
var BRACE_EXPANDED_LENGTH_LIMIT = 16384;
function matchRecursiveDeleteClassification(classification, ctx, policy, table) {
  if (classification.kind === "temp_target")
    return null;
  const rule = table[classification.kind];
  if (classification.kind === "dynamic_target" && !import_effective_rules.destructiveCommandRuleIsEnabled(policy, rule.id, ctx.strict)) {
    return null;
  }
  if (classification.kind === "within_anchored_cwd" && !import_effective_rules.destructiveCommandRuleIsEnabled(policy, rule.id, ctx.paranoid)) {
    return null;
  }
  return import_destructive4.destructiveCommandMatch(rule.id, rule.reason);
}
function deleteTargetWordFacts(word) {
  const expansion = import_posix.expandPosixLiteralBraceWord(word, BRACE_EXPANSION_LIMIT, BRACE_EXPANSION_LIMIT, BRACE_EXPANDED_LENGTH_LIMIT);
  return {
    expandedTargets: expansion && "words" in expansion ? expansion.words : undefined,
    unsafeBraceExpansion: expansion !== undefined && "limited" in expansion,
    targetIsLiteral: expansion === undefined && word.provenance === "literal" && (word.quoted || word.raw !== word.text),
    tmpdirWordSplittingProtected: isTmpdirExpansionWordSplittingProtected(word)
  };
}
function isTmpdirExpansionWordSplittingProtected(word) {
  const tmpdirParts = word.parts.filter((part) => part.provenance === "variable" && /\$(?:TMPDIR(?![A-Za-z0-9_])|\{TMPDIR\})/.test(part.raw));
  return tmpdirParts.length > 0 && tmpdirParts.every((part) => isRawOffsetDoubleQuoted(word.raw, part.span.start - word.span.start));
}
function isRawOffsetDoubleQuoted(raw, offset) {
  let quote = null;
  let escaped = false;
  for (let index = 0;index < offset; index++) {
    const char = raw[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\" && quote !== "'") {
      escaped = true;
      continue;
    }
    if (quote === char) {
      quote = null;
      continue;
    }
    if (quote === null && (char === "'" || char === '"'))
      quote = char;
  }
  return quote === '"';
}
function createRecursiveDeleteTargetContext(options) {
  const homeDir = options.environment.home;
  const paths = options.environment.paths;
  const budget = options.budget ?? import_budget3.createBudget();
  return {
    anchoredCwd: options.originalCwd ?? options.cwd ?? null,
    resolvedCwd: options.cwd ?? null,
    strict: options.strict ?? false,
    paranoid: options.paranoid ?? false,
    trustTmpdirVar: options.allowTmpdirVar ?? true,
    posixShell: options.posixShell ?? false,
    tmpdirWordSplittingUnsafe: options.tmpdirWordSplittingUnsafe ?? false,
    trustedTmpdirValue: options.trustedTmpdirValue ?? options.allowTmpdirVar ?? true,
    environment: options.environment,
    allowRoots: resolveAllowRoots(options.allowPaths, homeDir, paths, budget),
    protectedGitMetadata: options.protectedGitMetadata,
    budget
  };
}
function classifyRecursiveDeleteTarget(target, ctx, options = {}) {
  const targetIsLiteral = options.targetIsLiteral ?? false;
  if (!targetIsLiteral && ctx.tmpdirWordSplittingUnsafe && !options.tmpdirWordSplittingProtected && containsTmpdirVariable(target)) {
    return { kind: "outside_anchored_cwd" };
  }
  const dynamic = !targetIsLiteral && isDynamicTarget(target, ctx.posixShell);
  if (import_canonicalization.isUnsupportedWindowsNamespacePath(target)) {
    return { kind: "outside_anchored_cwd" };
  }
  if (isDangerousRootOrHomeTarget(target, targetIsLiteral)) {
    return { kind: "root_or_home_target" };
  }
  if (isCanonicalHomeTarget(target, ctx, targetIsLiteral)) {
    return { kind: "root_or_home_target" };
  }
  if (ctx.resolvedCwd && import_git_metadata_protection.isProtectedGitDeleteTarget(target, ctx.resolvedCwd, ctx.protectedGitMetadata, true, ctx.environment, ctx.budget, !ctx.posixShell)) {
    return { kind: "git_metadata_target" };
  }
  if (isTempTarget(target, ctx.trustTmpdirVar, ctx.posixShell, dynamic, targetIsLiteral, options.tmpdirWordSplittingProtected ?? false, ctx.trustedTmpdirValue, ctx.environment)) {
    return { kind: "temp_target" };
  }
  if (dynamic) {
    return { kind: "dynamic_target" };
  }
  if (isAllowedPathTarget(target, ctx, targetIsLiteral)) {
    return { kind: "temp_target" };
  }
  const anchoredCwd = ctx.anchoredCwd;
  if (anchoredCwd) {
    if (!options.skipHomeCwd && isCwdHomeForRmPolicy(anchoredCwd, ctx.environment.home, ctx.environment.paths, ctx.budget)) {
      return { kind: "home_cwd_target" };
    }
    if (!options.skipCwdSelf && [ctx.resolvedCwd ?? anchoredCwd, anchoredCwd].some((self) => isCwdSelfTarget(target, ctx.resolvedCwd ?? anchoredCwd, ctx.environment.paths, ctx.budget, self))) {
      return { kind: "cwd_self_target" };
    }
    if (isTargetWithinCwd(target, anchoredCwd, ctx.resolvedCwd ?? anchoredCwd, dynamic, targetIsLiteral, ctx.environment.paths, ctx.budget)) {
      return { kind: "within_anchored_cwd" };
    }
  }
  if (isTrustedTempDescendantAfterCd(target, ctx, dynamic)) {
    return { kind: "temp_target" };
  }
  return { kind: "outside_anchored_cwd" };
}
function isTrustedTempDescendantAfterCd(target, ctx, dynamic) {
  const normalized = target.trim();
  if (dynamic || !ctx.resolvedCwd || !ctx.anchoredCwd || !normalized)
    return false;
  if (import_node_path2.isAbsolute(normalized) || normalized.startsWith("~"))
    return false;
  if (hasParentDirectoryComponent(normalized))
    return false;
  if (isWorkspaceWithinTarget(ctx.resolvedCwd, ctx.anchoredCwd, ctx.environment.paths, ctx.budget)) {
    return false;
  }
  return import_tmpdir.isTrustedTempPath(import_node_path2.resolve(ctx.resolvedCwd, normalized), ctx.environment);
}
function isTrustedTempDescendantTarget(target, ctx, options = {}) {
  const { containmentTarget, ...classificationOptions } = options;
  if (classifyRecursiveDeleteTarget(target, ctx, classificationOptions).kind !== "temp_target") {
    return false;
  }
  const normalized = target.trim();
  if (isTrustedTmpdirVariableRootTarget(normalized))
    return false;
  if (import_tmpdir.isTrustedTempRootPath(normalized, ctx.environment))
    return false;
  return ![ctx.anchoredCwd, ctx.resolvedCwd].some((workspace) => isWorkspaceWithinTarget(containmentTarget ?? normalized, workspace, ctx.environment.paths, ctx.budget));
}
function isDangerousRootOrHomeTarget(path, targetIsLiteral = false) {
  const trimmed = path.trim();
  const normalized = import_node_path2.posix.normalize(trimmed);
  const windowsNormalized = trimmed.replace(/\\/g, "/");
  const rootGlobTarget = normalized === "/" ? normalized : normalized.replace(/\/+$/, "");
  if (rootGlobTarget === "/" || rootGlobTarget.startsWith("/") && rootGlobTarget.slice(1).split("/").every((segment) => /^\*+$/.test(segment))) {
    return true;
  }
  if (/^[A-Za-z]:\/+\*?$/.test(windowsNormalized) || /^\/\/[^/]+\/+[^/]+(?:\/+\*?)?$/.test(windowsNormalized)) {
    return true;
  }
  if (!targetIsLiteral && (normalized === "~" || normalized === "~/" || normalized === "~/*")) {
    return true;
  }
  if (!targetIsLiteral && (normalized === "$HOME" || normalized === "$HOME/" || normalized === "$HOME/*")) {
    return true;
  }
  if (!targetIsLiteral && (normalized === "${HOME}" || normalized === "${HOME}/" || normalized === "${HOME}/*")) {
    return true;
  }
  return false;
}
function isCanonicalHomeTarget(target, ctx, targetIsLiteral) {
  const trimmed = target.trim();
  const candidate = targetIsLiteral ? trimmed : trimmed === "*" ? "." : trimmed.endsWith("/*") ? trimmed.slice(0, -2) : trimmed;
  if (!candidate)
    return false;
  try {
    const base = import_node_path2.isAbsolute(candidate) ? candidate : ctx.resolvedCwd ? import_node_path2.resolve(ctx.resolvedCwd, candidate) : null;
    if (!base)
      return false;
    const resolved = normalizePathForComparison(import_canonicalization.resolveExistingPath(base, ctx.environment.paths, ctx.budget));
    if (resolved === import_node_path2.parse(resolved).root)
      return true;
    return resolved === normalizePathForComparison(import_canonicalization.resolveExistingPath(ctx.environment.home, ctx.environment.paths, ctx.budget));
  } catch {
    return false;
  }
}
function normalizePathForComparison(p) {
  let normalized = import_node_path2.normalize(p);
  if (IS_WINDOWS) {
    normalized = normalized.replace(/\//g, "\\").toLowerCase();
    if (normalized.length > 3 && normalized.endsWith("\\")) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  }
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}
function isTempTarget(path, allowTmpdirVar, posixShell, dynamic, targetIsLiteral, tmpdirWordSplittingProtected, trustedTmpdirValue, environment) {
  const normalized = path.trim();
  if (hasParentDirectoryComponent(normalized)) {
    return false;
  }
  if (!dynamic && import_tmpdir.isTrustedTempPath(normalized, environment)) {
    return true;
  }
  return (allowTmpdirVar || tmpdirWordSplittingProtected && trustedTmpdirValue) && posixShell && !targetIsLiteral && isTrustedTmpdirVariableTarget(normalized, posixShell);
}
function isTrustedTmpdirVariableTarget(path, posixShell) {
  return ["$TMPDIR", "${TMPDIR}"].some((prefix) => {
    if (path === prefix)
      return true;
    if (!path.startsWith(`${prefix}/`))
      return false;
    return !isDynamicTarget(path.slice(prefix.length + 1), posixShell);
  });
}
function isTrustedTmpdirVariableRootTarget(path) {
  const match = /^(?:\$TMPDIR|\$\{TMPDIR\})(?:\/(.*))?$/.exec(path);
  if (!match)
    return false;
  return import_node_path2.posix.normalize(`/${match[1] ?? ""}`) === "/";
}
function hasParentDirectoryComponent(path) {
  return path.split(/[\\/]+/).includes("..");
}
function resolveAllowRoots(allowPaths, homeDir, paths, budget) {
  if (!allowPaths?.length)
    return [];
  return allowPaths.flatMap((path) => {
    const expanded = import_allow_paths.expandAllowPathHome(path.trim(), homeDir);
    if (!import_node_path2.isAbsolute(expanded))
      return [];
    try {
      const canonical = import_canonicalization.resolveExistingPath(expanded, paths, budget);
      if (import_allow_paths.getAllowPathHomeConflictError(canonical, import_canonicalization.resolveExistingPath(homeDir, paths, budget))) {
        return [];
      }
      return [normalizePathForComparison(canonical)];
    } catch {
      return [];
    }
  });
}
function isAllowedPathTarget(target, ctx, targetIsLiteral) {
  if (ctx.allowRoots.length === 0)
    return false;
  const trimmed = target.trim();
  if (hasParentDirectoryComponent(trimmed))
    return false;
  const expanded = targetIsLiteral ? trimmed : import_allow_paths.expandAllowPathHome(trimmed, ctx.environment.home);
  const base = ctx.resolvedCwd ?? ctx.anchoredCwd;
  const resolved = import_node_path2.isAbsolute(expanded) ? expanded : base ? import_node_path2.resolve(base, expanded) : null;
  if (!resolved)
    return false;
  try {
    const canonical = normalizePathForComparison(import_canonicalization.resolveExistingPath(resolved, ctx.environment.paths, ctx.budget));
    return ctx.allowRoots.some((root) => canonical === root || canonical.startsWith(root.endsWith(import_node_path2.sep) ? root : `${root}${import_node_path2.sep}`));
  } catch {
    return false;
  }
}
function containsTmpdirVariable(target) {
  return /\$(?:TMPDIR(?![A-Za-z0-9_])|\{TMPDIR\})/.test(target);
}
function isDynamicTarget(target, posixShell = false) {
  return target.includes("$") || target.includes("`") || hasShellGlobMetachar(target) || posixShell && hasPosixShellExpansionMetachar(target);
}
function hasShellGlobMetachar(target) {
  let escaped = false;
  for (const char of target) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "*" || char === "?" || char === "[") {
      return true;
    }
  }
  return false;
}
function hasPosixShellExpansionMetachar(target) {
  let escaped = false;
  for (let index = 0;index < target.length; index++) {
    const char = target[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "{" && hasBraceExpansion(target, index) || (char === "+" || char === "@" || char === "!") && target[index + 1] === "(") {
      return true;
    }
  }
  return false;
}
function hasBraceExpansion(target, openIndex) {
  const closeIndex = target.indexOf("}", openIndex + 1);
  if (closeIndex === -1)
    return false;
  const body = target.slice(openIndex + 1, closeIndex);
  return body.includes(",") || body.includes("..");
}
function isCwdHomeForRmPolicy(cwd, homeDir, paths, budget) {
  try {
    return normalizePathForComparison(import_canonicalization.resolveExistingPath(cwd, paths, budget)) === normalizePathForComparison(import_canonicalization.resolveExistingPath(homeDir, paths, budget));
  } catch {
    try {
      return normalizePathForComparison(cwd) === normalizePathForComparison(homeDir);
    } catch {
      return false;
    }
  }
}
function isCwdSelfTarget(target, cwd, paths, budget, self = cwd) {
  if (self === cwd && (target === "." || target === "./" || target === ".\\")) {
    return true;
  }
  try {
    return normalizePathForComparison(import_canonicalization.resolveExistingPath(import_node_path2.resolve(cwd, target), paths, budget)) === normalizePathForComparison(import_canonicalization.resolveExistingPath(self, paths, budget));
  } catch {
    try {
      return normalizePathForComparison(import_node_path2.resolve(cwd, target)) === normalizePathForComparison(self);
    } catch {
      return false;
    }
  }
}
function isTargetWithinCwd(target, originalCwd, effectiveCwd, dynamic, targetIsLiteral, paths, budget) {
  const resolveCwd = effectiveCwd ?? originalCwd;
  if (!targetIsLiteral && (target.startsWith("~") || target.startsWith("$HOME") || target.startsWith("${HOME}"))) {
    return false;
  }
  if (dynamic) {
    return false;
  }
  if (target.startsWith("/") || /^[A-Za-z]:[\\/]/.test(target)) {
    try {
      return isResolvedPathWithinCwd(target, originalCwd, paths, budget);
    } catch {
      return false;
    }
  }
  if (target.startsWith("./") || target.startsWith(".\\") || !target.includes("/") && !target.includes("\\")) {
    try {
      return isResolvedPathWithinCwd(import_node_path2.resolve(resolveCwd, target), originalCwd, paths, budget);
    } catch {
      return false;
    }
  }
  if (target.startsWith("../")) {
    return false;
  }
  try {
    return isResolvedPathWithinCwd(import_node_path2.resolve(resolveCwd, target), originalCwd, paths, budget);
  } catch {
    return false;
  }
}
function isResolvedPathWithinCwd(resolvedTarget, cwd, paths, budget) {
  try {
    return isNormalizedPathWithin(import_canonicalization.resolveExistingPath(resolvedTarget, paths, budget), import_canonicalization.resolveExistingPath(cwd, paths, budget));
  } catch {
    return false;
  }
}
function isWorkspaceWithinTarget(target, workspace, paths, budget) {
  if (!workspace)
    return false;
  try {
    return isNormalizedPathWithin(import_canonicalization.resolveExistingPath(workspace, paths, budget), import_canonicalization.resolveExistingPath(target, paths, budget));
  } catch {
    return true;
  }
}
function isNormalizedPathWithin(target, cwd) {
  const normalizedTarget = normalizePathForComparison(target);
  const normalizedCwd = normalizePathForComparison(cwd);
  return normalizedTarget.startsWith(`${normalizedCwd}${import_node_path2.sep}`) || normalizedTarget === normalizedCwd;
}

// src/gate/analyzer/rm-flags.ts
function hasRecursiveForceFlags(tokens) {
  let hasRecursive = false;
  let hasForce = false;
  for (const token of tokens) {
    if (token === "--")
      break;
    if (token === "-r" || token === "-R" || isLongOptionAbbreviation(token, "recursive")) {
      hasRecursive = true;
      continue;
    }
    if (token === "-f" || isLongOptionAbbreviation(token, "force")) {
      hasForce = true;
      continue;
    }
    if (token.startsWith("-") && !token.startsWith("--")) {
      if (token.includes("r") || token.includes("R"))
        hasRecursive = true;
      if (token.includes("f"))
        hasForce = true;
    }
  }
  return hasRecursive && hasForce;
}
function hasRecursiveOption(tokens) {
  const separator = tokens.indexOf("--");
  return tokens.slice(1, separator === -1 ? undefined : separator).some((token) => isLongOptionAbbreviation(token, "recursive") || /^-[A-Za-z]+$/.test(token) && /[rR]/.test(token.slice(1)));
}
function isLongOptionAbbreviation(token, option) {
  return token.length > 2 && token.startsWith("--") && option.startsWith(token.slice(2));
}

// src/gate/analyzer/shell-wrappers.ts
var import_tokens4 = require("./core-shell.js");
var BASH_STARTUP_OPTIONS = ["--init-file", "--rcfile"];
var SHELL_STARTUP_ENV_NAMES = new Map([
  ["bash", "BASH_ENV"],
  ["dash", "ENV"],
  ["ksh", "ENV"],
  ["sh", "ENV"]
]);
function extractDashCArg(tokens) {
  for (let i = 1;i < tokens.length; i++) {
    const token = tokens[i];
    if (!token)
      continue;
    if (token === "-c")
      return getCommandStringAfterDashC(tokens, i, true);
    if (token.startsWith("-") && token.includes("c") && !token.startsWith("--")) {
      const command = getCommandStringAfterDashC(tokens, i, false);
      if (command !== null)
        return command;
    }
  }
  return null;
}
function isShellSyntaxCheck(tokens) {
  const shell = import_tokens4.getBasename(tokens[0] ?? "").toLowerCase();
  if (shell === "zsh" || shell === "ksh")
    return import_tokens4.parseShellArgv(tokens).syntaxCheck;
  let enabled = false;
  for (const token of tokens.slice(1)) {
    if (token === "--")
      return enabled;
    if (token.startsWith("+") && !token.startsWith("++")) {
      if (token.slice(1).includes("n"))
        enabled = false;
      continue;
    }
    if (!token.startsWith("-") || token.startsWith("--"))
      return enabled;
    const flags = token.slice(1);
    if (flags.includes("n"))
      enabled = true;
    if (flags.includes("c"))
      return enabled;
  }
  return enabled;
}
function getCommandStringAfterDashC(tokens, dashCIndex, allowDashCommand) {
  if (tokens[dashCIndex + 1] === "--")
    return tokens[dashCIndex + 2] || null;
  const commandString = tokens[dashCIndex + 1];
  if (!commandString || !allowDashCommand && commandString.startsWith("-"))
    return null;
  return commandString;
}
function extractShellStartupLoaderMetadata(tokens) {
  const shell = import_tokens4.getBasename(tokens[0] ?? "").toLowerCase();
  const parsed = parseShellStartupArgv(tokens, shell);
  const envName = SHELL_STARTUP_ENV_NAMES.get(shell) ?? null;
  const valid = parsed.argvSource?.kind !== "absent";
  return {
    argvSource: shell === "bash" ? parsed.argvSource : null,
    argvSourceApplies: shell === "bash" && parsed.interactive && parsed.argvSource?.kind === "literal",
    envName,
    envSourceApplies: valid && (envName === "BASH_ENV" ? !parsed.interactive : envName === "ENV" && parsed.interactive)
  };
}
function parseShellStartupArgv(tokens, shell) {
  const parsed = import_tokens4.parseShellArgv(tokens);
  const boundary = parsed.commandIndex ?? parsed.scriptIndex ?? tokens.length;
  const sources = [];
  let interactive = false;
  let bashLongOptionsOpen = true;
  for (let index = 1;index < boundary; index++) {
    const token = tokens[index];
    if (token === undefined || token === "--" || token === "-" || token[0] !== "-" && token[0] !== "+") {
      break;
    }
    if (token.startsWith("--")) {
      const option = shell === "bash" && bashLongOptionsOpen ? BASH_STARTUP_OPTIONS.find((candidate) => token === candidate) : undefined;
      if (option) {
        const value = tokens[index + 1];
        sources.push(value === undefined ? { kind: "absent" } : { kind: "literal", value });
        index++;
        continue;
      }
      const longOption = token.split("=", 1)[0] ?? token;
      if (shell === "bash" && import_tokens4.BASH_LONG_VALUE_OPTIONS.has(longOption) && !token.includes("=")) {
        index++;
      }
      continue;
    }
    if (shell === "bash")
      bashLongOptionsOpen = false;
    const shortScan = import_tokens4.scanShellShortOptions(shell, token, tokens[index + 1], "startup");
    if (shortScan.interactive)
      interactive = token[0] === "-";
    index += shortScan.followingValues;
  }
  return { argvSource: sources.at(-1) ?? null, interactive };
}

// src/gate/analyzer/find.ts
var REASON_FIND_DELETE = "find -delete permanently removes files. Use -print first to preview.";
var REASON_FIND_EXEC_RM_RF = "find -exec rm -rf is dangerous. Use explicit file list instead.";
var FIND_EXEC_PRIMARIES = new Set(["-exec", "-execdir", "-ok", "-okdir"]);
var FIND_PRIMARY_ARITY = new Map([
  ...[
    "-Bmin",
    "-Bnewer",
    "-Btime",
    "-amin",
    "-anewer",
    "-atime",
    "-cmin",
    "-cnewer",
    "-context",
    "-ctime",
    "-f",
    "-flags",
    "-fprint",
    "-fprint0",
    "-fls",
    "-fstype",
    "-gid",
    "-group",
    "-ilname",
    "-iname",
    "-inum",
    "-ipath",
    "-iwholename",
    "-iregex",
    "-links",
    "-lname",
    "-maxdepth",
    "-mindepth",
    "-mmin",
    "-mnewer",
    "-mtime",
    "-name",
    "-newer",
    "-newerXY",
    "-newermt",
    "-path",
    "-perm",
    "-printf",
    "-regex",
    "-samefile",
    "-size",
    "-type",
    "-uid",
    "-used",
    "-user",
    "-wholename",
    "-xattrname",
    "-xtype"
  ].map((primary) => [primary, 1]),
  ["-fprintf", 2]
]);
function analyzeFindMatch(words, context) {
  const tokens = words.map(analysisWordText);
  const catastrophicMatch = findCatastrophicDeleteMatch(words, tokens, context);
  if (catastrophicMatch)
    return catastrophicMatch;
  if (findHasDelete(tokens, 1) && !hasOnlyScopedDeleteTargets(words, tokens, context)) {
    const match = import_effective_rules2.filterDestructiveCommandMatch(import_destructive5.destructiveCommandMatch("find.delete", REASON_FIND_DELETE), context.policy);
    if (match)
      return match;
  }
  const budget = context.budget ?? import_budget4.createBudget();
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    const arity = getFindPrimaryArity(token ?? "");
    if (arity > 0) {
      i += arity + 1;
      continue;
    }
    if (!isFindExecPrimary(token)) {
      i++;
      continue;
    }
    budget.charge("derivedTokens", tokens.length - i - 1);
    const execCommand = getFindExecCommand(tokens, i);
    i = execCommand.nextIndex;
    const directMatch = analyzeFindExecCommand(execCommand.tokens, context.environment);
    if (directMatch) {
      const match = import_effective_rules2.filterDestructiveCommandMatch(directMatch, context.policy);
      if (match)
        return match;
    }
    const directoryRelative = token === "-execdir" || token === "-okdir";
    const nestedMatch = context.analyzeTokens?.(execCommand.tokens, directoryRelative ? null : context.cwd) ?? null;
    const match = nestedMatch?.id.startsWith("custom.") ? nestedMatch : import_effective_rules2.filterDestructiveCommandMatch(nestedMatch, context.policy);
    if (match)
      return match;
  }
  return null;
}
function findCatastrophicDeleteMatch(words, tokens, context) {
  const deletesDirectly = findHasDelete(tokens, 1);
  if (!deletesDirectly && !findExecRmDeletesFoundPaths(tokens, context.environment))
    return null;
  const targets = getFindStartingPoints(words) ?? textCommandWords(["."]);
  const targetContext = createRecursiveDeleteTargetContext({
    ...context,
    allowPaths: context.policy?.destructiveCommandAllowPaths,
    posixShell: true
  });
  for (const target of targets) {
    const facts = deleteTargetWordFacts(target);
    for (const expandedTarget of facts.expandedTargets ?? [analysisWordText(target)]) {
      const classification = classifyRecursiveDeleteTarget(expandedTarget, targetContext, {
        targetIsLiteral: facts.expandedTargets !== undefined || facts.targetIsLiteral,
        tmpdirWordSplittingProtected: facts.tmpdirWordSplittingProtected
      });
      if (classification.kind === "root_or_home_target") {
        return import_destructive5.destructiveCommandMatch("rm.recursive-force-root-or-home", "rm -rf targeting root or home directory is extremely dangerous and always blocked.");
      }
      if (classification.kind === "git_metadata_target" && !nameFilterExcludesGitMetadata(words, targetContext.protectedGitMetadata, context.environment)) {
        return import_destructive5.destructiveCommandMatch("find.delete-git-metadata", import_git_metadata_protection2.REASON_GIT_METADATA_PROTECTION);
      }
    }
  }
  if (findSelectsHooksByName(tokens) && targetContext.resolvedCwd && import_git_metadata_protection2.isProtectedGitHookNameSelection(targets.map(analysisWordText), targetContext.resolvedCwd, targetContext.protectedGitMetadata, targetContext.environment, targetContext.budget)) {
    return import_destructive5.destructiveCommandMatch("find.delete-git-metadata", import_git_metadata_protection2.REASON_GIT_METADATA_PROTECTION);
  }
  return null;
}
function nameFilterExcludesGitMetadata(words, metadata, environment) {
  if (!metadata)
    return false;
  const tokens = words.map(analysisWordText);
  const patterns = [];
  let actionSeen = false;
  const lastStartingPoint = getFindStartingPoints(words)?.at(-1);
  let index = lastStartingPoint ? words.indexOf(lastStartingPoint) + 1 : 1;
  while (index < tokens.length) {
    const token = tokens[index] ?? "";
    if (isFindExecPrimary(token)) {
      const command = getFindExecCommand(tokens, index);
      const stripped = stripWrappersForPathScan([...command.tokens], environment);
      const recursesIntoMatchedDirectories = hasRecursiveOption(stripped);
      const execRunsUnanalyzedShell = import_constants3.SHELL_WRAPPERS.has(import_tokens5.getBasename(stripped[0] ?? "").toLowerCase());
      const derivesPathFromMatch = command.tokens.some((arg) => arg !== "{}" && arg.includes("{}"));
      const execdirFixedPathEscapesCwdAnalysis = (token === "-execdir" || token === "-okdir") && stripped.slice(1).some((arg) => arg !== "{}" && !arg.startsWith("-"));
      if (recursesIntoMatchedDirectories || execRunsUnanalyzedShell || derivesPathFromMatch || execdirFixedPathEscapesCwdAnalysis) {
        return false;
      }
      actionSeen = true;
      index = command.nextIndex;
      continue;
    }
    if (token === "-delete") {
      actionSeen = true;
      index++;
      continue;
    }
    if (token === "-name" || token === "-iname") {
      const pattern = words[index + 1];
      const translatableLiteralGlob = pattern?.provenance === "literal" && !/[[\\]/.test(pattern.text);
      if (!translatableLiteralGlob)
        return false;
      if (!actionSeen)
        patterns.push(findNamePatternRegExp(pattern.text, token === "-iname"));
      index += 2;
      continue;
    }
    if (!FIND_PRIMARIES_THAT_NEVER_WIDEN.has(token))
      return false;
    index += 1 + getFindPrimaryArity(token);
  }
  return patterns.length > 0 && !import_git_metadata_protection2.mayHaveGitMetadataEntryNamed(metadata, (name) => patterns.every((regex) => regex.test(name)));
}
var FIND_PRIMARIES_THAT_NEVER_WIDEN = new Set([
  "-a",
  "-and",
  "-depth",
  "-maxdepth",
  "-mindepth",
  "-mmin",
  "-mtime",
  "-newer",
  "-size",
  "-type"
]);
function findNamePatternRegExp(pattern, caseless) {
  const source = pattern.replace(/[*?]|[.+^${}()|\]/]/g, (char) => char === "*" ? ".*" : char === "?" ? "." : `\\${char}`);
  return new RegExp(`^${source}$`, caseless ? "isu" : "su");
}
var RM_AS_ANY_WORD = /(?:^|[\s;&|(`{])\\?(?:\S*\/)?rm(?:dir)?(?=[\s;&|)`}]|$)/;
function findExecRmDeletesFoundPaths(tokens, environment) {
  let index = 0;
  while (index < tokens.length) {
    if (!isFindExecPrimary(tokens[index])) {
      index++;
      continue;
    }
    const command = getFindExecCommand(tokens, index);
    const stripped = stripWrappersForPathScan([...command.tokens], environment);
    const head = import_tokens5.getBasename(stripped[0] ?? "").toLowerCase();
    const shellBodyMentionsRmAfterUnquoting = import_constants3.SHELL_WRAPPERS.has(head) && RM_AS_ANY_WORD.test((extractDashCArg(stripped) ?? "").replace(/["'\\]/g, ""));
    const removes = head === "rm" || head === "rmdir" || shellBodyMentionsRmAfterUnquoting;
    if (removes && stripped.some((token) => token.includes("{}")))
      return true;
    index = command.nextIndex;
  }
  return false;
}
function findSelectsHooksByName(tokens) {
  return tokens.some((token, index) => {
    if (!["-name", "-iname"].includes(token))
      return false;
    return tokens[index + 1]?.toLowerCase() === "hooks";
  });
}
function hasOnlyScopedDeleteTargets(words, tokens, context) {
  if (tokens.includes("-L") || tokens.includes("-f") || tokens.includes("-follow"))
    return false;
  const targets = getFindStartingPoints(words);
  if (!targets)
    return false;
  const envAssignments = context.envAssignments ?? new Map;
  const effectiveTmpdirValue = import_tmpdir2.getEffectiveTmpdirValue(envAssignments, context.environment);
  const trustedTmpdirValue = context.trustedTmpdirValue ?? import_tmpdir2.isTmpdirValueTrusted(envAssignments, context.environment);
  const allowTmpdirVar = context.allowTmpdirVar ?? !import_tmpdir2.isTmpdirOverriddenToNonTemp(envAssignments, context.environment);
  const targetOptions = {
    environment: context.environment,
    protectedGitMetadata: context.protectedGitMetadata,
    cwd: context.cwd,
    originalCwd: context.originalCwd,
    strict: context.strict,
    allowTmpdirVar: allowTmpdirVar && trustedTmpdirValue && Boolean(effectiveTmpdirValue),
    allowPaths: context.policy?.destructiveCommandAllowPaths,
    posixShell: true,
    tmpdirWordSplittingUnsafe: context.tmpdirWordSplittingUnsafe ?? import_tmpdir2.hasUnsafeTmpdirWordSplitting(envAssignments, context.environment),
    trustedTmpdirValue,
    budget: context.budget
  };
  const targetContext = createRecursiveDeleteTargetContext(targetOptions);
  const workspaceContext = createRecursiveDeleteTargetContext({
    ...targetOptions,
    cwd: context.originalCwd ?? context.cwd
  });
  const workspace = context.originalCwd && context.environment.paths.realpath(context.originalCwd);
  const enteredDirectory = context.cwd && context.environment.paths.realpath(context.cwd);
  const cwdOutsideWorkspace = workspace && enteredDirectory && !import_tmpdir2.isPathOrSubpath(enteredDirectory, workspace) ? context.cwd : undefined;
  return targets.every((target) => {
    const facts = deleteTargetWordFacts(target);
    if (facts.unsafeBraceExpansion)
      return false;
    return (facts.expandedTargets ?? [analysisWordText(target)]).every((expandedTarget) => {
      const trackedCwd = /^\.\/*$/.test(expandedTarget) ? cwdOutsideWorkspace : undefined;
      const startingPoint = trackedCwd ?? expandedTarget;
      const classificationOptions = {
        targetIsLiteral: facts.expandedTargets !== undefined || facts.targetIsLiteral,
        tmpdirWordSplittingProtected: facts.tmpdirWordSplittingProtected
      };
      if (!import_effective_rules2.destructiveCommandRuleIsEnabled(context.policy, "rm.recursive-force-paranoid", context.paranoid ?? false) && !trackedCwd && classifyRecursiveDeleteTarget(startingPoint, targetContext, classificationOptions).kind === "within_anchored_cwd") {
        return true;
      }
      return isTrustedTempDescendantTarget(startingPoint, trackedCwd ? workspaceContext : targetContext, {
        ...classificationOptions,
        containmentTarget: expandTmpdirTarget(startingPoint, effectiveTmpdirValue)
      });
    });
  });
}
function expandTmpdirTarget(target, tmpdirValue) {
  if (!tmpdirValue)
    return target;
  return target.replace(/^(?:\$TMPDIR|\$\{TMPDIR\})/, () => tmpdirValue);
}
function getFindStartingPoints(words) {
  const tokenAt = (index) => {
    const word = words[index];
    return word ? analysisWordText(word) : undefined;
  };
  let index = 1;
  while (tokenAt(index) === "-H" || tokenAt(index) === "-P")
    index++;
  if (tokenAt(index) === "--")
    index++;
  const targets = [];
  while (index < words.length) {
    const token = tokenAt(index);
    const word = words[index];
    if (!token || !word || token.startsWith("-") || ["!", "(", ")"].includes(token))
      break;
    targets.push(word);
    index++;
  }
  return targets.length > 0 ? targets : null;
}
function analyzeFindExecCommand(tokens, environment) {
  let execCommand = stripWrappers([...tokens], environment);
  if (execCommand.length === 0) {
    return null;
  }
  let head = import_tokens5.getBasename(execCommand[0] ?? "");
  if (head === "busybox" && execCommand.length > 1) {
    execCommand = execCommand.slice(1);
    head = import_tokens5.getBasename(execCommand[0] ?? "");
  }
  if (head === "rm" && hasRecursiveForceFlags(execCommand)) {
    return import_destructive5.destructiveCommandMatch("find.exec-rm-recursive-force", REASON_FIND_EXEC_RM_RF);
  }
  return null;
}
function getFindExecCommand(tokens, execIndex) {
  let terminatorIndex = execIndex + 1;
  while (terminatorIndex < tokens.length && tokens[terminatorIndex] !== ";" && !(tokens[terminatorIndex] === "+" && tokens[terminatorIndex - 1] === "{}")) {
    terminatorIndex++;
  }
  return {
    tokens: tokens.slice(execIndex + 1, terminatorIndex),
    nextIndex: Math.min(terminatorIndex + 1, tokens.length)
  };
}
function findHasDelete(tokens, start) {
  let i = start;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      i++;
      continue;
    }
    if (isFindExecPrimary(token)) {
      i = getFindExecCommand(tokens, i).nextIndex;
      continue;
    }
    const arity = getFindPrimaryArity(token);
    if (arity > 0) {
      i += arity + 1;
      continue;
    }
    if (token === "-delete") {
      return true;
    }
    i++;
  }
  return false;
}
function getFindPrimaryArity(token) {
  return FIND_PRIMARY_ARITY.get(token) ?? (/^-newer[A-Za-z]{2}$/.test(token) ? 1 : 0);
}
function isFindExecPrimary(token) {
  return token !== undefined && FIND_EXEC_PRIMARIES.has(token);
}

// src/gate/analyzer/xargs.ts
var import_parse = require("./analyzer-core.js");
var import_rules = require("./analyzer-core.js");

// src/gate/analyzer/interpreters.ts
var import_constants4 = require("./core-shell.js");
var import_tokens6 = require("./core-shell.js");
var REASON_INTERPRETER_DANGEROUS = "Interpreter code contains a dangerous command. Run the underlying command directly so it can be analyzed, or use the safer alternative for that command.";
var REASON_INTERPRETER_BLOCKED = "Interpreter one-liners are blocked by the active safety policy. Write the code to a script file and run it, or run the equivalent shell command directly.";
var CODE_FLAGS = new Map([
  ["python", new Set(["-c"])],
  ["node", new Set(["-e", "--eval"])],
  ["ruby", new Set(["-e"])],
  ["perl", new Set(["-e", "-E"])]
]);
var NODE_PRINT_FLAGS = new Set(["-p", "--print"]);
var CLUSTERED_CODE_FLAGS = new Map([
  ["python", new Set(["c"])],
  ["node", new Set(["e"])],
  ["ruby", new Set(["e"])],
  ["perl", new Set(["e", "E"])]
]);
var SHORT_VALUE_FLAGS = new Map([
  ["python", new Set(["W", "X"])],
  ["node", new Set(["C", "r"])],
  ["ruby", new Set(["C", "E", "F", "I", "r"])],
  ["perl", new Set(["F", "I", "M", "m"])]
]);
var ATTACHED_VALUE_FLAGS = new Map([
  ["ruby", new Set(["0", "K", "W", "x"])],
  ["perl", new Set(["0", "C", "D", "V", "d", "i", "l", "x"])]
]);
var PROGRAM_FLAGS = new Map([["python", new Set(["m"])]]);
var LONG_VALUE_FLAGS = new Map([
  [
    "node",
    new Set([
      "--allow-fs-read",
      "--allow-fs-write",
      "--conditions",
      "--cpu-prof-dir",
      "--cpu-prof-interval",
      "--cpu-prof-name",
      "--debug-port",
      "--diagnostic-dir",
      "--disable-proto",
      "--disable-warning",
      "--dns-result-order",
      "--env-file",
      "--env-file-if-exists",
      "--experimental-package-map",
      "--experimental-test-isolation",
      "--experimental-test-tag-filter",
      "--heap-prof-dir",
      "--heap-prof-interval",
      "--heap-prof-name",
      "--heapsnapshot-near-heap-limit",
      "--heapsnapshot-signal",
      "--icu-data-dir",
      "--input-type",
      "--inspect-port",
      "--inspect-publish-uid",
      "--localstorage-file",
      "--max-http-header-size",
      "--max-old-space-size-percentage",
      "--network-family-autoselection-attempt-timeout",
      "--openssl-config",
      "--redirect-warnings",
      "--report-dir",
      "--report-directory",
      "--report-filename",
      "--report-signal",
      "--secure-heap",
      "--secure-heap-min",
      "--test-concurrency",
      "--test-coverage-branches",
      "--test-coverage-exclude",
      "--test-coverage-functions",
      "--test-coverage-include",
      "--test-coverage-lines",
      "--test-global-setup",
      "--test-isolation",
      "--test-name-pattern",
      "--test-random-seed",
      "--test-reporter",
      "--test-reporter-destination",
      "--test-rerun-failures",
      "--test-shard",
      "--test-skip-pattern",
      "--test-timeout",
      "--title",
      "--tls-cipher-list",
      "--tls-keylog",
      "--trace-event-categories",
      "--trace-event-file-pattern",
      "--trace-require-module",
      "--unhandled-rejections",
      "--use-largepages",
      "--v8-pool-size",
      "--watch-kill-signal"
    ])
  ],
  ["python", new Set(["--check-hash-based-pycs"])],
  [
    "ruby",
    new Set([
      "--backtrace-limit",
      "--crash-report",
      "--disable",
      "--enable",
      "--encoding",
      "--external-encoding",
      "--internal-encoding",
      "--parser"
    ])
  ]
]);
var PYTHON_HASH_PYC_MODES = new Set(["always", "default", "never"]);
var RUBY_DASH_VALUE_FLAGS = new Set([
  "--backtrace-limit",
  "--crash-report",
  "--disable",
  "--enable"
]);
var INTERPRETER_SHELL_CONTINUATION = /\\\r?\n/g;
var INTERPRETER_EXECUTABLE_SOURCE_SELECTORS = new Map([
  [
    "python",
    [
      { selector: "-c", kind: "inline-code", valueForm: "attached-or-separate" },
      { selector: "-m", kind: "module-file", valueForm: "attached-or-separate" }
    ]
  ],
  [
    "node",
    [
      { selector: "-e", kind: "inline-code", valueForm: "separate-only" },
      { selector: "--eval", kind: "inline-code", valueForm: "equals-or-separate" },
      { selector: "-p", kind: "inline-code", valueForm: "separate-only" },
      { selector: "--print", kind: "inline-code", valueForm: "separate-only" },
      { selector: "-r", kind: "module-file", valueForm: "separate-only" },
      { selector: "--require", kind: "module-file", valueForm: "equals-or-separate" },
      { selector: "--import", kind: "module-file", valueForm: "equals-or-separate" },
      { selector: "--loader", kind: "module-file", valueForm: "equals-or-separate" },
      {
        selector: "--experimental-loader",
        kind: "module-file",
        valueForm: "equals-or-separate"
      }
    ]
  ],
  [
    "ruby",
    [
      { selector: "-e", kind: "inline-code", valueForm: "attached-or-separate" },
      { selector: "-r", kind: "module-file", valueForm: "attached-or-separate" }
    ]
  ],
  [
    "perl",
    [
      { selector: "-e", kind: "inline-code", valueForm: "attached-or-separate" },
      { selector: "-E", kind: "inline-code", valueForm: "attached-or-separate" },
      { selector: "-M", kind: "module-file", valueForm: "attached-only" },
      { selector: "-m", kind: "module-file", valueForm: "attached-only" }
    ]
  ]
]);
function extractInterpreterCodeArg(tokens) {
  return parseInterpreterArgv(tokens).code;
}
function extractInterpreterExecutableSources(tokens) {
  return parseInterpreterArgv(tokens).sources;
}
function getInterpreterExecutableSourceSelectors(command) {
  return INTERPRETER_EXECUTABLE_SOURCE_SELECTORS.get(normalizeInterpreter(command)) ?? [];
}
function parseInterpreterArgv(tokens) {
  const interpreter = normalizeInterpreter(tokens[0] ?? "");
  if (!CODE_FLAGS.has(interpreter))
    return { code: null, sources: [], optionsOpen: false };
  const codeArgs = [];
  const sources = [];
  let executableSourcesValid = true;
  for (let i = 1;i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined)
      break;
    if (token === "--") {
      return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid, tokens[i + 1] === undefined ? undefined : i + 1, tokens[i + 1]);
    }
    if (token === "" || token === "-" || !token.startsWith("-")) {
      return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid, i, token);
    }
    if (interpreter === "node" && NODE_PRINT_FLAGS.has(token)) {
      const code = tokens[i + 1];
      if (code === undefined) {
        return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid);
      }
      if (code.startsWith("-"))
        continue;
      codeArgs.push({ tokenIndex: i + 1, value: code });
      sources.push({ tokenIndex: i + 1, kind: "inline-code", value: code });
      i++;
      continue;
    }
    if (isInterpreterCodeFlag(interpreter, token)) {
      const code = tokens[i + 1];
      if (code === undefined) {
        return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid);
      }
      codeArgs.push({ tokenIndex: i + 1, value: code });
      sources.push({ tokenIndex: i + 1, kind: "inline-code", value: code });
      if (interpreter === "python") {
        return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid);
      }
      i++;
      continue;
    }
    const inlineEval = /^--eval=(.*)$/s.exec(token);
    if (supportsInlineEval(interpreter) && inlineEval) {
      const code = inlineEval[1] ?? "";
      codeArgs.push({ tokenIndex: i, value: code });
      sources.push({ tokenIndex: i, kind: "inline-code", value: code });
      continue;
    }
    if (interpreter === "node") {
      const loader = extractNodeLongLoader(token);
      if (loader) {
        if (loader.attached) {
          executableSourcesValid &&= loader.value !== "";
          if (loader.value !== "") {
            sources.push({ tokenIndex: i, kind: "module-file", value: loader.value });
          }
          continue;
        }
        const value = tokens[i + 1];
        if (value === undefined || value.startsWith("-")) {
          executableSourcesValid = false;
          return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid);
        }
        sources.push({ tokenIndex: i + 1, kind: "module-file", value });
        i++;
        continue;
      }
    }
    if (interpreter === "python" && token.startsWith("--check-hash-based-pycs=") || interpreter === "node" && (token === "--conditions=" || token === "--diagnostic-dir=" || token === "--title=") || interpreter === "ruby" && (token === "--disable=" || token === "--enable=")) {
      return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid);
    }
    if (LONG_VALUE_FLAGS.get(interpreter)?.has(token)) {
      const value = tokens[i + 1];
      if (value === undefined || value.startsWith("-") && !(interpreter === "ruby" && RUBY_DASH_VALUE_FLAGS.has(token)) || interpreter === "python" && !PYTHON_HASH_PYC_MODES.has(value)) {
        return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid);
      }
      i++;
      continue;
    }
    if (token.startsWith("--"))
      continue;
    let codeArg;
    let consumesNext = false;
    for (let optionIndex = 1;optionIndex < token.length; optionIndex++) {
      const option = token[optionIndex];
      if (option === undefined)
        break;
      if (PROGRAM_FLAGS.get(interpreter)?.has(option)) {
        const attached = token.slice(optionIndex + 1);
        const value = attached || tokens[i + 1];
        if (value !== undefined) {
          sources.push({
            tokenIndex: attached ? i : i + 1,
            kind: "module-file",
            value
          });
        }
        return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid);
      }
      if (CLUSTERED_CODE_FLAGS.get(interpreter)?.has(option)) {
        codeArg = token.slice(optionIndex + 1) || tokens[i + 1];
        consumesNext = optionIndex + 1 === token.length;
        break;
      }
      if (interpreter === "node" && option === "r") {
        executableSourcesValid &&= token === "-r";
        if (token === "-r") {
          const value = tokens[i + 1];
          executableSourcesValid &&= value !== undefined && !value.startsWith("-");
          if (executableSourcesValid && value !== undefined) {
            sources.push({ tokenIndex: i + 1, kind: "module-file", value });
          }
          i++;
        }
        break;
      }
      if (interpreter === "ruby" && option === "r") {
        const attached = token.slice(optionIndex + 1);
        const value = attached || tokens[i + 1];
        executableSourcesValid &&= value !== undefined;
        if (value !== undefined) {
          sources.push({
            tokenIndex: attached ? i : i + 1,
            kind: "module-file",
            value
          });
        }
        if (!attached)
          i++;
        break;
      }
      if (interpreter === "perl" && (option === "M" || option === "m")) {
        const value = token.slice(optionIndex + 1);
        if (!value) {
          executableSourcesValid = false;
          if (optionIndex + 1 === token.length)
            i++;
          break;
        }
        sources.push({ tokenIndex: i, kind: "module-file", value });
        break;
      }
      if (SHORT_VALUE_FLAGS.get(interpreter)?.has(option)) {
        if (optionIndex + 1 === token.length)
          i++;
        break;
      }
      if (ATTACHED_VALUE_FLAGS.get(interpreter)?.has(option) && optionIndex + 1 < token.length) {
        break;
      }
    }
    if (codeArg === undefined)
      continue;
    const tokenIndex = consumesNext ? i + 1 : i;
    codeArgs.push({ tokenIndex, value: codeArg });
    sources.push({ tokenIndex, kind: "inline-code", value: codeArg });
    if (interpreter === "python") {
      return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid);
    }
    if (consumesNext)
      i++;
  }
  return finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid, undefined, undefined, true);
}
function finishInterpreterArgv(interpreter, codeArgs, sources, executableSourcesValid, mainScriptIndex, mainScript, optionsOpen = false) {
  const effectiveCodeArgs = interpreter === "node" ? codeArgs.slice(-1) : codeArgs;
  const effectiveCodeIndexes = new Set(effectiveCodeArgs.map((codeArg) => codeArg.tokenIndex));
  const executableSources = sources.filter((source) => source.kind !== "inline-code" || effectiveCodeIndexes.has(source.tokenIndex));
  if (executableSourcesValid && codeArgs.length === 0 && mainScriptIndex !== undefined && mainScript !== undefined) {
    executableSources.push({
      tokenIndex: mainScriptIndex,
      kind: "main-script",
      value: mainScript
    });
  }
  return {
    code: (interpreter === "node" ? effectiveCodeArgs[0]?.value : effectiveCodeArgs.map((codeArg) => codeArg.value).join(`
`)) || null,
    sources: executableSourcesValid ? executableSources : [],
    optionsOpen: executableSourcesValid && optionsOpen
  };
}
function extractNodeLongLoader(token) {
  for (const option of ["--import", "--loader", "--experimental-loader", "--require"]) {
    if (token === option)
      return { attached: false, value: "" };
    if (token.startsWith(`${option}=`)) {
      return { attached: true, value: token.slice(option.length + 1) };
    }
  }
  return;
}
function isInterpreterDisplayOnly(command, code) {
  return normalizeInterpreter(command) === "node" && /^\s*console\.(?:log|info|warn|error)\(\s*(?:"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*')\s*\)\s*;?\s*$/.test(code);
}
function normalizeInterpreter(command) {
  const interpreter = import_tokens6.getBasename(command).toLowerCase();
  return import_constants4.PYTHON_INTERPRETER_PATTERN.test(interpreter) ? "python" : interpreter;
}
function isInterpreterCodeFlag(interpreter, token) {
  return CODE_FLAGS.get(interpreter)?.has(token) ?? false;
}
function supportsInlineEval(interpreter) {
  return CODE_FLAGS.get(interpreter)?.has("--eval") ?? false;
}
function containsDangerousCode(code, scanWork, standard = false) {
  const executableCode = collapseInterpreterShellContinuations(code, scanWork);
  if (!interpreterCodeHasDangerousText(executableCode, scanWork))
    return false;
  chargeNativeLinearPass(scanWork, executableCode);
  const strippedCode = stripStringLiterals(executableCode);
  if (interpreterCodeHasDangerousText(strippedCode, scanWork))
    return true;
  chargeNativeLinearPass(scanWork, strippedCode);
  if (!INTERPRETER_EXEC_SINK.test(strippedCode))
    return false;
  return !standard || execCallReceivesDangerousLiteral(executableCode, scanWork);
}
function execCallReceivesDangerousLiteral(code, scanWork) {
  const hasSelfExecutingLiteral = /`|%x|\bqx\b/.test(code);
  if (hasSelfExecutingLiteral)
    return true;
  const masked = code.split("");
  const literals = [];
  for (let index = 0;index < code.length; index++) {
    const quote = code[index];
    if (quote !== "'" && quote !== '"')
      continue;
    const delimiter = code.startsWith(quote.repeat(3), index) ? quote.repeat(3) : quote;
    const start = index + delimiter.length;
    let end = start;
    while (end < code.length && !code.startsWith(delimiter, end))
      end += code[end] === "\\" ? 2 : 1;
    if (end >= code.length)
      return true;
    literals.push({ start, text: code.slice(start, end) });
    masked.fill(" ", index, end + delimiter.length);
    index = end + delimiter.length - 1;
  }
  const plain = masked.join("");
  const calls = Array.from(plain.matchAll(/([\w$]+(?:\s*\.\s*[\w$]+)*)\s*\(/g)).filter((call) => INTERPRETER_EXEC_SINK.test(call[1] ?? "")).map((call) => {
    const start = call.index + call[0].length;
    return { start, end: closingParenthesis(plain, start) };
  });
  const execCallMayReceiveAnyLiteral = calls.some((call) => firstArgumentHasName(plain, call.start));
  if (execCallMayReceiveAnyLiteral)
    return true;
  return literals.some((literal) => {
    const followsParenlessSink = /\b(?:system|exec|spawn|popen)\s*$/.test(plain.slice(0, literal.start));
    const insideExecCall = calls.some((call) => literal.start >= call.start && literal.start < call.end);
    return (followsParenlessSink || insideExecCall) && interpreterCodeHasDangerousText(literal.text, scanWork);
  });
}
function closingParenthesis(masked, start) {
  let depth = 1;
  for (let index = start;index < masked.length; index++) {
    if (masked[index] === "(")
      depth++;
    if (masked[index] === ")")
      depth--;
    if (depth === 0)
      return index;
  }
  return masked.length;
}
function firstArgumentHasName(masked, start) {
  let depth = 0;
  for (let index = start;index < masked.length; index++) {
    const char = masked[index] ?? "";
    if ("([{".includes(char))
      depth++;
    if (")]}".includes(char) && depth-- === 0)
      return false;
    if (char === "," && depth === 0)
      return false;
    if (/[A-Za-z_$]/.test(char))
      return true;
  }
  return false;
}
var INTERPRETER_EXEC_SINK = /`|%x|\b(?:system|exec|spawn|popen|subprocess|child_process|open3|eval|fork|qx)/i;
function stripStringLiterals(code) {
  const parts = [];
  let plainStart = 0;
  let i = 0;
  while (i < code.length) {
    const quote = code[i];
    if (quote !== "'" && quote !== '"') {
      i++;
      continue;
    }
    const delimiter = code.startsWith(quote.repeat(3), i) ? quote.repeat(3) : quote;
    let end = i + delimiter.length;
    while (end < code.length && !code.startsWith(delimiter, end)) {
      end += code[end] === "\\" ? 2 : 1;
    }
    if (end >= code.length)
      break;
    parts.push(code.slice(plainStart, i), " ");
    i = end + delimiter.length;
    plainStart = i;
  }
  parts.push(code.slice(plainStart));
  return parts.join("");
}
function interpreterCodeHasDangerousText(executableCode, scanWork) {
  if (hasLinearInterpreterDanger(executableCode, "rm", scanWork))
    return true;
  for (const pattern of [
    /\bgit[^\S\n]+checkout[^\S\n]+--[^\S\n]/,
    /\bgit[^\S\n]+stash[^\S\n]+(drop|clear)\b/
  ]) {
    chargeNativeLinearPass(scanWork, executableCode);
    if (pattern.test(executableCode)) {
      return true;
    }
  }
  if (hasLinearInterpreterDanger(executableCode, "dd", scanWork))
    return true;
  for (const pattern of [/\bmkfs(?:\.[A-Za-z0-9_-]+)?\s+\/dev\/[^\s'"]+/, /\bshred\b\s+/]) {
    chargeNativeLinearPass(scanWork, executableCode);
    if (pattern.test(executableCode))
      return true;
  }
  if (hasLinearInterpreterDanger(executableCode, "find", scanWork))
    return true;
  const lines = executableCode.split(/[\n\r\u2028\u2029]/);
  return [
    "reset-hard",
    "reset-merge",
    "clean",
    "checkout",
    "push-force",
    "push-refspec",
    "push-delete",
    "branch",
    "tag",
    "restore"
  ].some((kind) => {
    chargeNativeLinearPass(scanWork, executableCode);
    return lines.some((line) => hasLinearDangerousText(line, kind));
  });
}
function collapseInterpreterShellContinuations(code, scanWork) {
  chargeNativeLinearPass(scanWork, code);
  return code.replace(INTERPRETER_SHELL_CONTINUATION, "");
}

// src/gate/analyzer/xargs.ts
var import_shell_execution = require("./analyzer-core.js");
var REASON_XARGS_RM = "xargs rm -rf with dynamic input is dangerous. Use explicit file list instead.";
var REASON_XARGS_SHELL = "xargs dynamic input can supply arbitrary executable command source. Use an explicit child command and arguments instead.";
var XARGS_APPENDED_INPUT = "__CC_SAFETY_NET_XARGS_INPUT__";
var XARGS_INTERPRETER_INPUT = "__CC_SAFETY_NET_XARGS_INTERPRETER_INPUT__";
var XARGS_DYNAMIC_WRAPPER_CHILD = "rm";
var EXECUTED_SHELL_EXPANSION_RE = /(?:^|[;&|]\s*|\b(?:eval|source)\s+|\b(?:ba|da|z|k)?sh\s+-c\s+)\s*["']?\$(?:([0-9]+|[@*]|[A-Za-z_][A-Za-z0-9_]*)|\{!?([0-9]+|[@*]|[A-Za-z_][A-Za-z0-9_]*)(?:[^}]*)\})/g;
var EVAL_SHELL_SOURCE_RE = /(?:^|[;&|]\s*)\s*eval\b((?:\\.|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\\'";&|\r\n])*)/g;
var SHELL_EXPANSION_RE = /\$(?:([0-9]+|[@*]|[A-Za-z_][A-Za-z0-9_]*)|\{!?([0-9]+|[@*]|[A-Za-z_][A-Za-z0-9_]*)(?:[^}]*)\})/g;
var POSITIONAL_SHELL_PARAMETER_RE = /^(?:[0-9]+|[@*])$/;
function analyzeXargs(words, context) {
  const tokens = words.map(analysisWordText);
  const { childStart, replacementToken } = extractXargsChildCommandWithInfo(tokens);
  const rawChildTokens = tokens.slice(childStart);
  const shellDynamicMatch = import_destructive6.destructiveCommandMatch("xargs.shell-dynamic", REASON_XARGS_SHELL);
  if (xargsInputCanSupplyWrapperChild(rawChildTokens, replacementToken, context) && import_effective_rules3.filterDestructiveCommandMatch(shellDynamicMatch, context.policy)) {
    return import_effective_rules3.filterDestructiveCommandMatch(shellDynamicMatch, context.policy);
  }
  for (const childCommand of normalizeChildCommands(rawChildTokens, context)) {
    const childTokens = childCommand.tokens;
    const dynamicExecutableResult = replacementToken !== null && childTokens[0] !== rawChildTokens[0] && (childTokens[0]?.includes(replacementToken) ?? false) ? import_effective_rules3.filterDestructiveCommandMatch(shellDynamicMatch, context.policy) : null;
    if (dynamicExecutableResult)
      return dynamicExecutableResult;
    const dynamicInput = xargsInputIsDynamic(childTokens, replacementToken, childCommand.wrapperEnvAssignments);
    const dynamicRmInput = childCommand.head === "rm" && replacementToken !== null && replacementCanChangeRmOptions(childTokens, replacementToken);
    const childResult = context.analyzeChild(childTokens, {
      ...childProvenance(childCommand, context),
      dynamicInput,
      dynamicSourceInput: dynamicRmInput || xargsInputCanChangeExecutedSource(childTokens, childCommand.head, replacementToken, childCommand.wrapperEnvAssignments, dynamicInput, context.environment, context.strict ? undefined : context.analyzeNested),
      dynamicRmInput,
      shellDynamicMatch,
      dynamicSourceMatch: shellDynamicMatch,
      rmDynamicMatch: import_destructive6.destructiveCommandMatch("xargs.rm-recursive-force-dynamic", REASON_XARGS_RM)
    });
    if (childResult)
      return childResult;
    const dynamicCustomResult = matchDynamicPolicyRule(childTokens, replacementToken, context.policy?.rules ?? [], import_effective_rules3.filterDestructiveCommandMatch(shellDynamicMatch, context.policy));
    if (dynamicCustomResult)
      return dynamicCustomResult;
    if (childCommand.head === "git") {
      const gitTokens = replacementToken === null ? [...childTokens, XARGS_APPENDED_INPUT] : childTokens;
      const hasDynamicReplacement = replacementToken !== null && (childTokens.some((token) => token.includes(replacementToken)) || Array.from(childCommand.envAssignments.values()).some((value) => value.includes(replacementToken)));
      const gitResult = context.analyzeChild(gitTokens, {
        ...childProvenance(childCommand, context),
        worktreeMode: replacementToken === null || hasDynamicReplacement ? false : context.worktreeMode
      });
      if (gitResult)
        return gitResult;
    }
    const customResult = import_custom.checkPolicyRuleMatch(childTokens, context.policy?.rules ?? []);
    if (customResult)
      return customResult;
  }
  return null;
}
function matchDynamicPolicyRule(tokens, replacementToken, rules, shellDynamic) {
  if (rules.length === 0)
    return null;
  if (replacementToken === null) {
    for (const rule of rules) {
      const result = import_custom.checkPolicyRuleMatch([...tokens, ...rule.subcommand ? [rule.subcommand] : [], ...rule.block_args], rules);
      if (result)
        return result;
    }
    return null;
  }
  const head = import_tokens7.normalizeCommandToken(tokens[0] ?? "");
  if (!rules.some((rule) => import_tokens7.normalizeCommandToken(rule.command) === head))
    return null;
  return tokens.slice(1).some((token) => token.includes(replacementToken)) ? shellDynamic : null;
}
function replacementValuesThatProduce(token, replacementToken, target) {
  const first = token.indexOf(replacementToken);
  if (first === -1 || token.indexOf(replacementToken, first + replacementToken.length) !== -1) {
    return [];
  }
  const value = solveDynamicInput(token, first, replacementToken.length, target);
  return value === null ? [] : [value];
}
function xargsInputCanChangeExecutedSource(childTokens, childHead, replacementToken, wrapperEnvAssignments, dynamicInput, environment, analyzeNested) {
  if (import_constants5.SHELL_WRAPPERS.has(childHead)) {
    if (isShellSyntaxCheck(childTokens))
      return false;
    if (replacementToken !== null && shellArgvTokensCanSelectExecutableSource(childTokens, replacementToken, analyzeNested)) {
      return true;
    }
    const source = extractDashCArg(childTokens);
    if (!source) {
      const scriptSource = import_shell_execution.extractShellScriptOperandSource(textCommandWords(childTokens));
      if (scriptSource.kind === "literal") {
        return replacementToken !== null && scriptSource.source.includes(replacementToken);
      }
      return scriptSource.kind === "none" && dynamicInput;
    }
    if (replacementToken !== null && source.includes(replacementToken) && !replacementIsInertShellArgument(source, replacementToken, analyzeNested)) {
      return true;
    }
    if (dangerousInTextMatch(source))
      return true;
    return shellSourceExecutesDynamicInput(source, replacementToken, wrapperEnvAssignments);
  }
  if (import_transparent_wrappers3.isInterpreterCommand(childHead)) {
    return executableSourceInputCanChange(childTokens, replacementToken, parseInterpreterArgv, getInterpreterExecutableSourceSelectors(childHead));
  }
  if (import_constants5.AWK_INTERPRETERS.has(childHead)) {
    return executableSourceInputCanChange(childTokens, replacementToken, parseAwkArgv, AWK_EXECUTABLE_SOURCE_SELECTORS);
  }
  if (childHead === "eval") {
    const source = import_shell_execution.extractEvalSource(textCommandWords(childTokens));
    if (source.kind === "dynamic")
      return true;
    if (replacementToken !== null) {
      return source.kind === "literal" && source.source.includes(replacementToken);
    }
    return dynamicInput;
  }
  if (childHead === "find") {
    return findInputCanChangeExecutedSource(childTokens, replacementToken, environment);
  }
  if (childHead === "git") {
    const parsed = import_parse.extractGitSubcommandAndRest(childTokens);
    return replacementToken === null ? parsed.subcommand === null : (parsed.subcommand?.includes(replacementToken) ?? false) || parsed.subcommand !== null && import_rules.GIT_RULE_SUBCOMMANDS.has(parsed.subcommand.toLowerCase()) && tokensBeforeStableOptionTerminator(parsed.rest, replacementToken).some((token) => token.includes(replacementToken));
  }
  return false;
}
function replacementIsInertShellArgument(source, replacementToken, analyzeNested) {
  if (analyzeNested === undefined)
    return false;
  const token = replacementToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const replacementCanStartCommand = new RegExp(`(?:^|[;&|({!\`\\n]|\\b(?:then|do|else|elif|if|while|until|time|command|builtin|nohup|eval|exec|source))\\s*(?:[A-Za-z_][A-Za-z0-9_]*=\\S*\\s+)*["']?${token}`).test(source);
  if (replacementCanStartCommand || /\bcase\b/.test(source))
    return false;
  const worstCase = source.replaceAll(replacementToken, "/");
  return dangerousInTextMatch(worstCase) === null && analyzeNested(worstCase) === null;
}
function executableSourceInputCanChange(tokens, replacementToken, parse, selectors) {
  const parsed = parse(tokens);
  if (replacementToken === null) {
    return parsed.optionsOpen || parse([...tokens, XARGS_INTERPRETER_INPUT]).sources.some((source) => source.value === XARGS_INTERPRETER_INPUT);
  }
  if (parsed.sources.some((source) => source.value.includes(replacementToken)))
    return true;
  const targets = selectors.flatMap((source) => [
    source.selector,
    ...source.valueForm === "attached-only" || source.valueForm === "attached-or-separate" ? [`${source.selector}${XARGS_INTERPRETER_INPUT}`] : [],
    ...source.valueForm === "equals-or-separate" ? [`${source.selector}=${XARGS_INTERPRETER_INPUT}`] : []
  ]);
  const candidates = new Set(targets.flatMap((target) => tokens.flatMap((token) => replacementValuesThatProduce(token, replacementToken, target))));
  return substitutionAddsExecutableSource(parsed.sources, candidates, (candidate) => parse(tokens.map((token) => token.replaceAll(replacementToken, candidate))).sources);
}
function xargsInputCanSupplyWrapperChild(tokens, replacementToken, context) {
  if (tokens.length === 0 || (tokens[0] ?? "").toLowerCase() === "command")
    return false;
  const originalHeads = new Set(Array.from(normalizeChildCommands(tokens, context), (child) => child.head));
  const candidateTokens = replacementToken === null ? [...tokens, XARGS_DYNAMIC_WRAPPER_CHILD] : tokens.map((token, index) => index === 0 ? token : token.replaceAll(replacementToken, XARGS_DYNAMIC_WRAPPER_CHILD));
  return Array.from(normalizeChildCommands(candidateTokens, context)).some((child) => child.head === XARGS_DYNAMIC_WRAPPER_CHILD && !originalHeads.has(XARGS_DYNAMIC_WRAPPER_CHILD));
}
function replacementCanChangeRmOptions(tokens, replacementToken) {
  return tokensBeforeStableOptionTerminator(tokens.slice(1), replacementToken).some((token) => token.includes(replacementToken) && (token.startsWith("-") || token.startsWith(replacementToken)));
}
function tokensBeforeStableOptionTerminator(tokens, replacementToken) {
  const index = tokens.findIndex((token) => token === "--" && !token.includes(replacementToken));
  return index === -1 ? tokens : tokens.slice(0, index);
}
function xargsInputIsDynamic(childTokens, replacementToken, wrapperEnvAssignments) {
  if (replacementToken === null)
    return true;
  return childTokens.some((token) => token.includes(replacementToken)) || Array.from(wrapperEnvAssignments.values()).some((value) => value.includes(replacementToken));
}
function shellArgvTokensCanSelectExecutableSource(tokens, replacementToken, analyzeNested) {
  const baseline = import_tokens7.parseShellArgv(tokens);
  const source = baseline.commandIndex === null ? "" : tokens[baseline.commandIndex] ?? "";
  if (source.includes(replacementToken) && !replacementIsInertShellArgument(source, replacementToken, analyzeNested) || baseline.scriptIndex !== null && (tokens[baseline.scriptIndex] ?? "").includes(replacementToken)) {
    return true;
  }
  const targets = ["-c", "-nc", "-cn", `--${replacementToken}`, replacementToken];
  return targets.some((target) => tokens.some((token, tokenIndex) => {
    if (tokenIndex === 0 || !token.includes(replacementToken))
      return false;
    const candidates = replacementValuesThatProduce(token, replacementToken, target);
    return candidates.some((candidate) => {
      const replaced = tokens.map((value, index) => index === tokenIndex ? value.replaceAll(replacementToken, candidate) : value);
      const parsed = import_tokens7.parseShellArgv(replaced);
      if (parsed.commandIndex === null && parsed.scriptIndex === null)
        return false;
      if (baseline.commandIndex === null && parsed.commandIndex !== null)
        return true;
      if (baseline.scriptIndex === null && parsed.scriptIndex !== null)
        return true;
      if (parsed.commandIndex !== null && (replaced[parsed.commandIndex] ?? "").includes(candidate)) {
        return true;
      }
      return parsed.scriptIndex !== null && (replaced[parsed.scriptIndex] ?? "").includes(candidate);
    });
  }));
}
function shellSourceExecutesDynamicInput(source, replacementToken, wrapperEnvAssignments) {
  const dynamicEnvNames = new Set(replacementToken === null ? [] : Array.from(wrapperEnvAssignments).filter(([, value]) => value.includes(replacementToken)).map(([name]) => name));
  for (const match of source.matchAll(EXECUTED_SHELL_EXPANSION_RE)) {
    if (isDynamicShellParameter(match, dynamicEnvNames))
      return true;
  }
  for (const evalMatch of source.matchAll(EVAL_SHELL_SOURCE_RE)) {
    for (const match of (evalMatch[1] ?? "").matchAll(SHELL_EXPANSION_RE)) {
      if (isDynamicShellParameter(match, dynamicEnvNames))
        return true;
    }
  }
  return import_shell_execution.shellSourceHasDynamicExecutionCarrier(source, dynamicEnvNames);
}
function isDynamicShellParameter(match, dynamicEnvNames) {
  const parameter = match[1] ?? match[2];
  return parameter !== undefined && (POSITIONAL_SHELL_PARAMETER_RE.test(parameter) || dynamicEnvNames.has(parameter));
}
function findInputCanChangeExecutedSource(childTokens, replacementToken, environment) {
  if (replacementToken === null)
    return true;
  let inExpression = false;
  let expressionDataArgs = 0;
  for (let index = 1;index < childTokens.length; index++) {
    const token = childTokens[index] ?? "";
    if (!inExpression && !token.startsWith("-") && token !== "!" && token !== "(") {
      if (token.indexOf(replacementToken) === 0) {
        return true;
      }
      continue;
    }
    inExpression = true;
    if (expressionDataArgs > 0) {
      expressionDataArgs--;
      continue;
    }
    if (isFindExecPrimary(token)) {
      const execCommand = getFindExecCommand(childTokens, index);
      index = execCommand.nextIndex - 1;
      for (const childCommand of normalizeChildCommands(execCommand.tokens, {
        environment,
        cwd: undefined
      })) {
        const dynamicInput = xargsInputIsDynamic(childCommand.tokens, replacementToken, childCommand.wrapperEnvAssignments);
        if (childCommand.head === "rm" && replacementCanChangeRmOptions(childCommand.tokens, replacementToken) || xargsInputCanChangeExecutedSource(childCommand.tokens, childCommand.head, replacementToken, childCommand.wrapperEnvAssignments, dynamicInput, environment)) {
          return true;
        }
      }
      continue;
    }
    const arity = getFindPrimaryArity(token);
    if (arity > 0) {
      expressionDataArgs = arity;
      if (token.includes(replacementToken))
        return true;
      continue;
    }
    if (token.includes(replacementToken))
      return true;
  }
  return false;
}
function extractXargsChildCommandWithInfo(tokens) {
  const xargsOptsWithValue = new Set([
    "-L",
    "-n",
    "-P",
    "-s",
    "-a",
    "-E",
    "-R",
    "-S",
    "-e",
    "-d",
    "-J",
    "--max-args",
    "--max-procs",
    "--max-chars",
    "--arg-file",
    "--eof",
    "--delimiter",
    "--max-lines",
    "--process-slot-var"
  ]);
  let replacementToken = null;
  let i = 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token)
      break;
    if (token === "--") {
      return { childStart: i + 1, replacementToken };
    }
    if (!token.startsWith("-")) {
      return { childStart: i, replacementToken };
    }
    if (token === "-I") {
      replacementToken = tokens[i + 1] ?? "{}";
      i += 2;
      continue;
    }
    if (token.startsWith("-I") && token.length > 2) {
      replacementToken = token.slice(2);
      i++;
      continue;
    }
    if (token === "--replace") {
      replacementToken = "{}";
      i++;
      continue;
    }
    if (token.startsWith("--replace=")) {
      const value = token.slice("--replace=".length);
      replacementToken = value === "" ? "{}" : value;
      i++;
      continue;
    }
    if (token === "-J") {
      replacementToken = tokens[i + 1] ?? "{}";
      i += 2;
      continue;
    }
    i += xargsOptsWithValue.has(token) ? 2 : 1;
  }
  return { childStart: tokens.length, replacementToken };
}
// src/gate/analyzer/shell-git-env.ts
var import_worktree = require("./core.js");
var import_env2 = require("./analyzer-core.js");
var TMPDIR_ENV_NAME = "TMPDIR";
var IFS_ENV_NAME = "IFS";
var ENV_APPEND_ASSIGNMENT_RE = /^([A-Za-z_][A-Za-z0-9_]*)\+=/;
var ENV_NAME_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
var EXPORT_BUILTINS = new Set(["export", "typeset", "declare", "readonly"]);
var BUILTIN_CALL_PREFIXES = new Set(["builtin", "command", "time"]);
var COMPOUND_BODY_KEYWORDS = new Set(["do", "then", "else"]);
var COMPOUND_OPEN_KEYWORDS = new Set(["do", "then", "case"]);
var COMPOUND_CLOSE_KEYWORDS = new Set(["done", "fi", "esac"]);
var SHELL_VARIABLE_RE = /\$(?:\{([A-Za-z_][A-Za-z0-9_]*)\}|([A-Za-z_][A-Za-z0-9_]*))/g;
function segmentTokensWithExpandedAssignments(words, state) {
  return words.map((word) => word.provenance === "variable" && isEnvAssignmentToken(word.text) ? substituteKnownShellVariables(word.text, state.shellAssignments) : analysisWordText(word));
}
function substituteKnownShellVariables(text, assignments) {
  return text.replace(SHELL_VARIABLE_RE, (match, braced, bare) => {
    return assignments.get(braced ?? bare ?? "") ?? match;
  });
}
function expandKnownVariableWord(word, assignments) {
  const everyDollarIsParsedExpansion = word.parts.every((part) => part.provenance !== "literal" || !/[$`]/.test(part.raw));
  if (word.provenance !== "variable" || !everyDollarIsParsedExpansion)
    return null;
  const expanded = substituteKnownShellVariables(word.text, assignments);
  return /^[~-]/.test(expanded) || /[\s$`*?[]/.test(expanded) ? null : expanded;
}
function createShellGitContextEnvState(env, effectiveEnvAssignments) {
  return {
    env,
    effectiveEnvAssignments: getInitialEffectiveShellEnvAssignments(env, effectiveEnvAssignments),
    shellAssignments: new Map,
    bodyDepth: 0,
    bodyAssignments: new Set
  };
}
function cloneShellGitContextEnvState(state) {
  return {
    env: state.env,
    effectiveEnvAssignments: state.effectiveEnvAssignments ? new Map(state.effectiveEnvAssignments) : undefined,
    shellAssignments: new Map(state.shellAssignments),
    bodyDepth: state.bodyDepth,
    bodyAssignments: new Set(state.bodyAssignments)
  };
}
function applyShellGitContextEnvSegment(tokens, state) {
  const segment = collectSegmentEnvAssignments(tokens, state);
  const head = tokens[0] ?? "";
  if (COMPOUND_OPEN_KEYWORDS.has(head))
    state.bodyDepth += 1;
  if (head === "elif" || COMPOUND_CLOSE_KEYWORDS.has(head)) {
    state.bodyDepth = Math.max(0, state.bodyDepth - 1);
  }
  if (COMPOUND_CLOSE_KEYWORDS.has(head) && state.bodyDepth === 0) {
    state.bodyAssignments.forEach((name) => {
      state.shellAssignments.delete(name);
    });
    state.bodyAssignments.clear();
  }
  segment.assignments.filter((assignment) => assignment.persists).forEach((assignment) => {
    state.shellAssignments.set(assignment.name, assignment.value);
    if (state.bodyDepth > 0)
      state.bodyAssignments.add(assignment.name);
    setEffectiveGitContextAssignment(state, assignment);
  });
  const commandIndex = segment.commandIndex;
  if (commandIndex !== -1 && EXPORT_BUILTINS.has(tokens[commandIndex] ?? "")) {
    tokens.filter((token) => ENV_NAME_RE.test(token) && isTrackedShellEnvName(token)).forEach((name) => {
      exportTrackedGitContextEnvName(state, name);
    });
  }
  const invokedIndex = commandIndex === -1 ? -1 : resolveInvokedWordIndex(tokens, commandIndex);
  if (invokedIndex === -1 || tokens[invokedIndex] !== "unset") {
    return;
  }
  const operandsStart = getUnsetOperandsStart(tokens, invokedIndex);
  if (operandsStart === null) {
    return;
  }
  tokens.slice(operandsStart).forEach((name) => {
    if (state.bodyDepth > 0) {
      state.shellAssignments.set(name, "");
      return;
    }
    unsetTrackedGitContextEnvName(state, name);
  });
}
function getSegmentGitContextEnvAssignments(tokens, state) {
  const assignments = collectSegmentEnvAssignments(tokens, state).assignments;
  if (assignments.length === 0) {
    return state.effectiveEnvAssignments;
  }
  const nextEnvAssignments = new Map(state.effectiveEnvAssignments ?? []);
  assignments.forEach((assignment) => {
    nextEnvAssignments.set(assignment.name, assignment.value);
  });
  return nextEnvAssignments;
}
function collectSegmentEnvAssignments(tokens, state) {
  const bodyStart = COMPOUND_BODY_KEYWORDS.has(tokens[0] ?? "") ? 1 : 0;
  const commandIndex = tokens.findIndex((token, index) => index >= bodyStart && !isEnvAssignmentToken(token));
  const declaresOperands = commandIndex !== -1 && EXPORT_BUILTINS.has(tokens[resolveInvokedWordIndex(tokens, commandIndex)] ?? "");
  const currentValues = getCurrentShellAssignmentValues(state);
  const assignments = tokens.flatMap((token, index) => {
    const assignment = parseShellContextEnvAssignment(token, currentValues, state.env);
    if (!assignment) {
      return [];
    }
    if (commandIndex !== -1 && index > commandIndex && !declaresOperands && !import_env2.isGitContextEnvOverrideName(assignment.name)) {
      return [];
    }
    currentValues.set(assignment.name, assignment.value);
    return [
      {
        ...assignment,
        persists: commandIndex === -1 || declaresOperands
      }
    ];
  });
  return { assignments, commandIndex };
}
function resolveInvokedWordIndex(tokens, commandIndex) {
  let index = commandIndex;
  while (BUILTIN_CALL_PREFIXES.has(tokens[index] ?? "")) {
    index += 1;
    while (tokens[index]?.startsWith("-")) {
      if (/^-p*[vV][pvV]*$/.test(tokens[index] ?? "")) {
        return commandIndex;
      }
      index += 1;
    }
  }
  return index;
}
function isEnvAssignmentToken(token) {
  return parseEnvAssignment(token) !== null || ENV_APPEND_ASSIGNMENT_RE.test(token);
}
function parseShellContextEnvAssignment(token, currentValues, env) {
  return parseEnvAssignment(token) ?? parseAppendEnvAssignment(token, currentValues, env);
}
function parseAppendEnvAssignment(token, currentValues, env) {
  const gitAssignment = import_env2.parseGitContextAppendEnvAssignment(token, env, currentValues);
  if (gitAssignment)
    return gitAssignment;
  const name = token.match(ENV_APPEND_ASSIGNMENT_RE)?.[1];
  if (!name)
    return null;
  const eqIdx = token.indexOf("=");
  return {
    name,
    value: `${currentValues.has(name) ? currentValues.get(name) : env.get(name) ?? ""}${token.slice(eqIdx + 1)}`
  };
}
function isTrackedShellEnvName(name) {
  return name === TMPDIR_ENV_NAME || name === IFS_ENV_NAME || import_env2.isTrackedGitEnvName(name);
}
function getCurrentShellAssignmentValues(state) {
  return new Map([...state.effectiveEnvAssignments ?? [], ...state.shellAssignments]);
}
function getInitialEffectiveShellEnvAssignments(env, effectiveEnvAssignments) {
  const inheritedAssignments = [TMPDIR_ENV_NAME, IFS_ENV_NAME].map((name) => {
    const value = env.get(name);
    return value === undefined ? null : [name, value];
  }).filter((assignment) => assignment !== null);
  if (inheritedAssignments.length === 0) {
    return effectiveEnvAssignments;
  }
  return new Map([...inheritedAssignments, ...effectiveEnvAssignments ?? []]);
}
function setEffectiveGitContextAssignment(state, assignment) {
  const nextEnvAssignments = new Map(state.effectiveEnvAssignments ?? []);
  nextEnvAssignments.set(assignment.name, assignment.value);
  state.effectiveEnvAssignments = nextEnvAssignments;
}
function exportTrackedGitContextEnvName(state, name) {
  setEffectiveGitContextAssignment(state, {
    name,
    value: state.shellAssignments.get(name) ?? state.effectiveEnvAssignments?.get(name) ?? state.env.get(name) ?? ""
  });
}
function unsetTrackedGitContextEnvName(state, name) {
  if (!isTrackedShellEnvName(name) && !ENV_NAME_RE.test(name)) {
    return;
  }
  state.shellAssignments.set(name, "");
  if (import_env2.isGitContextEnvOverrideName(name) && state.env.has(name)) {
    const env = new Map(state.env);
    env.delete(name);
    state.env = env;
  }
  if (!isTrackedShellEnvName(name) || name === TMPDIR_ENV_NAME || name === IFS_ENV_NAME || import_worktree.isGitConfigEnvName(name)) {
    setEffectiveGitContextAssignment(state, { name, value: "" });
    return;
  }
  if (!state.effectiveEnvAssignments?.has(name)) {
    return;
  }
  const nextEnvAssignments = new Map(state.effectiveEnvAssignments);
  nextEnvAssignments.delete(name);
  state.effectiveEnvAssignments = nextEnvAssignments.size === 0 ? undefined : nextEnvAssignments;
}
function getUnsetOperandsStart(tokens, commandIndex) {
  let i = commandIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    if (token === "--") {
      return i + 1;
    }
    if (token === "-v") {
      i++;
      continue;
    }
    if (token.startsWith("-")) {
      return null;
    }
    return i;
  }
  return i;
}
// src/gate/analyzer/powershell-wrapper.ts
var import_destructive7 = require("./core-shell.js");

// src/gate/analyzer/reasons.ts
var import_budget5 = require("./core.js");
var REASON_STRICT_UNPARSEABLE = "Command could not be safely analyzed (strict mode). Simplify the command and retry, or ask the user to verify.";
var REASON_UNSUPPORTED_HEREDOC_SYNTAX = "Unsupported heredoc syntax";
var REASON_DYNAMIC_SHELL_SOURCE = "shell execution source cannot be verified safely. Use a literal command string or ask the user to run it manually.";
function dynamicShellSourceMatch() {
  return {
    id: "analysis.dynamic-shell-source",
    reason: REASON_DYNAMIC_SHELL_SOURCE,
    intent: "stop_and_explain"
  };
}
var REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT = "CC Safety Net could not validate the command because its structure exceeds safe analysis limits.";

// src/gate/analyzer/powershell-wrapper.ts
var REASON_NESTED_RECURSIVE_DELETE_UNREAD = "Recursive delete handed to powershell or pwsh in a form CC Safety Net does not read is blocked: pass the script as a single -Command with literal paths, after only -NoProfile, -NonInteractive, -NoLogo, or -ExecutionPolicy.";
var READ_SWITCH = /^-(?:noprofile|nop|noninteractive|noni|nologo)$/i;
var READ_EXECUTION_POLICY = /^-(?:executionpolicy|ep)$/i;
var READ_COMMAND = /^-(?:command|c)$/i;
var PARAMETER_NAME = /^(?:--?|[/\u2013\u2014\u2015])(\w+)$/;
var ENCODED_COMMAND = "encodedcommand";
var DELETE_VERB = /(?<![\w-])(?:remove-item|ri|rm|rmdir|rd|del|erase)(?![\w-])/i;
var RECURSIVE_FLAG = /(?<![\w-])(?:[-\u2013\u2014\u2015]{1,2}r(?:e(?:c(?:u(?:r(?:s(?:e|ive?)?)?)?)?)?)?(?!\w)|-[dfipvwx]*r[dfipvwx]*(?!\w))|\/s(?!\w)/i;
var OUTER_EXPANSION = /[$`]/;
var STOP_PARSING = "--%";
function analyzePowerShellWrapperMatch(words, analyzeNested) {
  const texts = words.map(analysisWordText);
  const script = texts.every((text, index) => index === 0 || text !== STOP_PARSING && isLiteralScriptWord(words[index], text)) ? readPowerShellScript(texts) : undefined;
  if (script !== undefined)
    return analyzeNested(script);
  if (texts.some(isEncodedCommandParameter))
    return dynamicShellSourceMatch();
  const text = texts.join(" ");
  return DELETE_VERB.test(text) && RECURSIVE_FLAG.test(text) ? import_destructive7.destructiveCommandMatch("powershell.nested-recursive-delete-unread", REASON_NESTED_RECURSIVE_DELETE_UNREAD) : null;
}
function readPowerShellScript(texts) {
  const commandIndex = readCommandIndex(texts, 1);
  const script = commandIndex === undefined ? [] : texts.slice(commandIndex + 1);
  return script.length > 0 ? script.join(" ") : undefined;
}
function readCommandIndex(texts, index) {
  const text = texts[index] ?? "";
  if (READ_COMMAND.test(text))
    return index;
  if (READ_SWITCH.test(text))
    return readCommandIndex(texts, index + 1);
  return READ_EXECUTION_POLICY.test(text) ? readCommandIndex(texts, index + 2) : undefined;
}
function isLiteralScriptWord(word, text) {
  return word?.provenance === "unknown" ? !OUTER_EXPANSION.test(text) : isLiteralExecutionSourceWord(word, text);
}
function isEncodedCommandParameter(text) {
  const name = PARAMETER_NAME.exec(text)?.[1]?.toLowerCase();
  return name !== undefined && (name === "ec" || ENCODED_COMMAND.startsWith(name));
}
// src/gate/analyzer/index.ts
var import_budget6 = require("./core.js");
var import_analysis_context = require("./core.js");
var import_analyze_command = require("./analyzer-core.js");
var ANALYZER_CAP_KINDS = new Set([
  "derivedTokens",
  "trackedHeredocFiles",
  "controlFlowStates",
  "wrapperPeelIterations",
  "derivedCommandShape"
]);
function analyzeCommand(command, options) {
  return analyzeCommandWithProgram(command, options);
}
function analyzeCommandWithProgram(command, options, program, factStore) {
  const result = import_analyze_command.analyzeCommandInternal(command, 0, {
    ...options,
    ...import_analysis_context.resolveCommandAnalysisContext(options),
    budget: options.budget ?? import_budget6.createBudget(),
    factStore
  }, program);
  if (!result)
    return null;
  return {
    kind: "deny",
    reason: result.reason,
    intent: result.intent ?? "manual_only",
    ruleId: result.ruleId,
    evidence: { command, segment: result.segment }
  };
}
function analyzeOrCapBreach(run, command, trace) {
  try {
    return { decision: run() };
  } catch (cause) {
    const breach = analyzerCapBreach(cause, command, trace);
    if (!breach)
      throw cause;
    return breach;
  }
}
function analyzerCapBreach(cause, command, trace) {
  if (!(cause instanceof import_budget6.AnalysisLimit) || !ANALYZER_CAP_KINDS.has(cause.kind))
    return null;
  const limit = import_budget6.LIMITS[cause.kind];
  if (trace?.currentSegmentIndex !== undefined) {
    trace.recordSegment({ type: "error", message: limit.reason });
  }
  if (trace?.currentSegmentIndex === undefined) {
    trace?.recordGlobal({ type: "error", message: limit.reason });
  }
  return {
    decision: {
      kind: "deny",
      reason: limit.reason,
      ruleId: "analysis.derived-command-limit",
      intent: "stop_and_explain",
      evidence: { command, segment: command }
    },
    errorCode: limit.errorCode
  };
}
// src/gate/analyzer/rule.ts
var import_tmpdir3 = require("./core.js");

// src/gate/analyzer/cmd.ts
var import_effective_rules5 = require("./core.js");
var import_destructive9 = require("./core-shell.js");
var import_git_metadata_protection4 = require("./gate.js");

// src/gate/analyzer/powershell/remove-item.ts
var import_canonicalization2 = require("./core.js");
var import_effective_rules4 = require("./core.js");
var import_destructive8 = require("./core-shell.js");
var import_git_metadata_protection3 = require("./gate.js");
var REMOVE_ITEM_ALIASES = new Set(["remove-item", "ri", "del", "erase", "rd", "rm", "rmdir"]);
var REASON_REMOVE_ITEM_RF = "PowerShell Remove-Item -Recurse -Force outside cwd is blocked. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.";
var REASON_REMOVE_ITEM_RF_POLICY = "PowerShell Remove-Item -Recurse -Force for non-temporary paths is blocked by the active safety policy. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.";
var REASON_REMOVE_ITEM_DYNAMIC_TARGET = "PowerShell Remove-Item target contains variables or pipeline input that cannot be verified safely. Use literal paths within cwd.";
var REASON_REMOVE_ITEM_ROOT_HOME = "PowerShell Remove-Item targeting root or home directory is extremely dangerous and always blocked.";
var REASON_REMOVE_ITEM_HOME_CWD = "PowerShell Remove-Item -Recurse -Force in home directory is dangerous. Change to a project directory first.";
var REASON_REMOVE_ITEM_PIPELINE = "PowerShell Remove-Item receives pipeline input that cannot be verified safely. Use explicit literal paths within cwd.";
var REMOVE_ITEM_RULES = {
  root_or_home_target: {
    id: "powershell.remove-item-recursive-force-root-or-home",
    reason: REASON_REMOVE_ITEM_ROOT_HOME
  },
  git_metadata_target: {
    id: "powershell.remove-item-git-metadata",
    reason: import_git_metadata_protection3.REASON_GIT_METADATA_PROTECTION
  },
  dynamic_target: {
    id: "powershell.remove-item-recursive-force-dynamic-target",
    reason: REASON_REMOVE_ITEM_DYNAMIC_TARGET
  },
  home_cwd_target: {
    id: "powershell.remove-item-recursive-force-home-cwd",
    reason: REASON_REMOVE_ITEM_HOME_CWD
  },
  cwd_self_target: {
    id: "powershell.remove-item-recursive-force-cwd-self",
    reason: REASON_REMOVE_ITEM_RF
  },
  within_anchored_cwd: {
    id: "powershell.remove-item-recursive-force-paranoid",
    reason: REASON_REMOVE_ITEM_RF_POLICY
  },
  outside_anchored_cwd: {
    id: "powershell.remove-item-recursive-force-outside-cwd",
    reason: REASON_REMOVE_ITEM_RF
  }
};
function analyzePowerShellCommandViewMatch(command, hasPipelineInput, options) {
  return analyzePowerShellSegment(command.words.map((word) => ({
    kind: "word",
    text: word.text,
    dynamic: word.provenance !== "literal"
  })), hasPipelineInput, createRecursiveDeleteTargetContext({
    ...options,
    allowPaths: options.policy?.destructiveCommandAllowPaths
  }), options.policy);
}
function analyzePowerShellSegment(segment, hasPipelineInput, ctx, policy) {
  const words = segment.filter((token) => token.kind === "word");
  const commandIndex = getCommandIndex(words);
  const command = words[commandIndex];
  if (!command || !REMOVE_ITEM_ALIASES.has(normalizeCommandName(command.text))) {
    return null;
  }
  const parsed = parseRemoveItem(words.slice(commandIndex + 1));
  if (parsed.whatIfProtected) {
    return null;
  }
  if (import_effective_rules4.destructiveCommandRuleIsEnabled(policy, "powershell.remove-item-pipeline-dynamic-target", ctx.strict) && hasPipelineInput && (parsed.targets.length === 0 || parsed.recursive)) {
    return import_destructive8.destructiveCommandMatch("powershell.remove-item-pipeline-dynamic-target", REASON_REMOVE_ITEM_PIPELINE);
  }
  for (const target of parsed.targets) {
    if (!import_canonicalization2.isUnsupportedWindowsNamespacePath(target.text) && isDangerousRootOrHomeTarget(powerShellTargetForPolicy(target.text))) {
      return import_destructive8.destructiveCommandMatch(parsed.recursive && parsed.force ? "powershell.remove-item-recursive-force-root-or-home" : "powershell.remove-item-root-or-home", REASON_REMOVE_ITEM_ROOT_HOME);
    }
  }
  for (const target of parsed.targets) {
    if (ctx.resolvedCwd && import_git_metadata_protection3.isProtectedGitDeleteTarget(powerShellTargetForPolicy(target.text), ctx.resolvedCwd, ctx.protectedGitMetadata, parsed.recursive, ctx.environment, ctx.budget, true)) {
      return import_destructive8.destructiveCommandMatch("powershell.remove-item-git-metadata", import_git_metadata_protection3.REASON_GIT_METADATA_PROTECTION);
    }
  }
  if (!parsed.recursive || !parsed.force) {
    return null;
  }
  if (import_effective_rules4.destructiveCommandRuleIsEnabled(policy, "powershell.remove-item-recursive-force-dynamic-target", ctx.strict) && (parsed.hasDynamicTarget || parsed.targets.length === 0)) {
    return import_destructive8.destructiveCommandMatch("powershell.remove-item-recursive-force-dynamic-target", REASON_REMOVE_ITEM_DYNAMIC_TARGET);
  }
  for (const target of parsed.targets) {
    const match = matchRecursiveDeleteClassification(classifyRecursiveDeleteTarget(powerShellTargetForPolicy(target.text), ctx), ctx, policy, REMOVE_ITEM_RULES);
    if (match)
      return match;
  }
  return null;
}
function parseRemoveItem(args) {
  const targets = [];
  let recursive = false;
  let force = false;
  let whatIfProtected = false;
  let hasDynamicTarget = false;
  let pastEndOfParameters = false;
  for (let i = 0;i < args.length; i++) {
    const token = args[i];
    if (!token || token.kind !== "word")
      continue;
    if (isArraySeparator(token))
      continue;
    if (pastEndOfParameters) {
      targets.push(targetFromToken(token));
      hasDynamicTarget = hasDynamicTarget || token.dynamic;
      continue;
    }
    if (token.text === "--") {
      pastEndOfParameters = true;
      continue;
    }
    const parameter = parseParameter(token.text);
    if (!parameter) {
      targets.push(targetFromToken(token));
      hasDynamicTarget = hasDynamicTarget || token.dynamic;
      continue;
    }
    if (isPathParameter(parameter.name)) {
      const value = parameter.value ? parameterValueToken(parameter.value, token) : args[++i];
      if (value?.kind === "word") {
        targets.push(targetFromToken(value));
        hasDynamicTarget = hasDynamicTarget || value.dynamic;
        continue;
      }
      hasDynamicTarget = true;
      continue;
    }
    if (isRecurseParameter(parameter.name)) {
      recursive = true;
      continue;
    }
    if (isForceParameter(parameter.name)) {
      force = true;
      continue;
    }
    if (isWhatIfParameter(parameter.name)) {
      whatIfProtected = isProtectiveSwitchValue(parameter.value);
    }
  }
  return { targets, recursive, force, whatIfProtected, hasDynamicTarget };
}
function getCommandIndex(words) {
  const first = words[0];
  if (first?.kind === "word" && first.text === "&" || first?.text === ".") {
    return words.length > 1 ? 1 : 0;
  }
  return 0;
}
function targetFromToken(token) {
  return {
    text: token.kind === "word" ? token.text : "",
    dynamic: token.kind === "word" && token.dynamic
  };
}
function isArraySeparator(token) {
  return token.kind === "word" && token.text === ",";
}
function powerShellTargetForPolicy(target) {
  const normalized = target.replace(/\\/g, "/");
  const home = /^(?:\$env:(?:userprofile|home)|\$home|\$\{home\})(?=$|\/)/i.exec(normalized);
  return home ? `$HOME${normalized.slice(home[0].length)}` : normalized;
}
function parameterValueToken(value, source) {
  return {
    kind: "word",
    text: value,
    dynamic: source.kind === "word" && (source.dynamic || value.includes("$"))
  };
}
function parseParameter(text) {
  if (!text.startsWith("-") || text === "-") {
    return null;
  }
  const raw = text.slice(1);
  const colonIndex = raw.indexOf(":");
  if (colonIndex === -1) {
    return { name: raw.toLowerCase() };
  }
  return {
    name: raw.slice(0, colonIndex).toLowerCase(),
    value: raw.slice(colonIndex + 1)
  };
}
function isPathParameter(name) {
  return "path".startsWith(name) || "literalpath".startsWith(name);
}
function isRecurseParameter(name) {
  return "recurse".startsWith(name);
}
function isForceParameter(name) {
  return name.length >= 2 && "force".startsWith(name);
}
function isWhatIfParameter(name) {
  return name === "wi" || "whatif".startsWith(name);
}
function isProtectiveSwitchValue(value) {
  if (value === undefined || value === "") {
    return true;
  }
  const normalized = value.toLowerCase();
  return normalized === "$true" || normalized === "true";
}
function normalizeCommandName(name) {
  return name.toLowerCase();
}

// src/gate/analyzer/cmd.ts
var REASON_CMD_DELETE_OUTSIDE_CWD = "cmd rmdir /s or del /s outside cwd is blocked. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.";
var REASON_CMD_DELETE_POLICY = "cmd rmdir /s or del /s for non-temporary paths is blocked by the active safety policy. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.";
var REASON_CMD_DELETE_DYNAMIC_TARGET = "cmd rmdir /s or del /s target contains wildcards or variables that cannot be verified safely. Use literal paths within cwd.";
var REASON_CMD_DELETE_ROOT_HOME = "cmd rmdir /s or del /s targeting root or home directory is extremely dangerous and always blocked.";
var REASON_CMD_DELETE_ESCAPED_QUOTE = "cmd rmdir /s or del /s with \\\" quoting or a \\\\?\\ path is blocked: cmd does not treat \\\" as an escape, so the target can split down to the root of the drive. Pass each path as its own quoted argument, or use Remove-Item -LiteralPath.";
var REASON_CMD_DELETE_HOME_CWD = "cmd rmdir /s or del /s in home directory is dangerous. Change to a project directory first.";
var CMD_DELETE_RULES = {
  root_or_home_target: {
    id: "cmd.recursive-delete-root-or-home",
    reason: REASON_CMD_DELETE_ROOT_HOME
  },
  git_metadata_target: {
    id: "cmd.recursive-delete-git-metadata",
    reason: import_git_metadata_protection4.REASON_GIT_METADATA_PROTECTION
  },
  dynamic_target: {
    id: "cmd.recursive-delete-dynamic-target",
    reason: REASON_CMD_DELETE_DYNAMIC_TARGET
  },
  home_cwd_target: { id: "cmd.recursive-delete-home-cwd", reason: REASON_CMD_DELETE_HOME_CWD },
  cwd_self_target: { id: "cmd.recursive-delete-cwd-self", reason: REASON_CMD_DELETE_OUTSIDE_CWD },
  within_anchored_cwd: { id: "cmd.recursive-delete-paranoid", reason: REASON_CMD_DELETE_POLICY },
  outside_anchored_cwd: {
    id: "cmd.recursive-delete-outside-cwd",
    reason: REASON_CMD_DELETE_OUTSIDE_CWD
  }
};
var CMD_BODY_SWITCH = /^\/\/?[ck]$/i;
var CMD_CONNECTORS = /[&|]+/;
var CMD_TOKEN = /(?:"[^"]*"|[^\s"])+/g;
var CMD_ESCAPE_OR_EXPANSION = /[\^%!]/;
var ESCAPED_QUOTE_INSIDE_WORD = /\\"./s;
var CMD_MATCH_ALL_FINAL_SEGMENT = /(^|\/)[*.]*\*[*.]*$/;
var WINDOWS_NAMESPACE_PREFIX = /^"?[\\/]+[?.][\\/]/;
var CMD_DELETE_COMMANDS = new Set(["rmdir", "rd", "del", "erase"]);
var CMD_DELETE_WORD = /(?<![\w-])(?:rmdir|rd|del|erase)(?!\w)/i;
var CMD_RECURSIVE_SWITCH = /\/s(?!\w)/i;
var CMD_DIRECTORY_WORD = /(?<![\w-])(?:cd|chdir|pushd|popd)(?!\w)/i;
function analyzeCmdMatch(words, options) {
  const texts = words.map(analysisWordText);
  const bodyIndex = texts.findIndex((text) => CMD_BODY_SWITCH.test(text));
  if (bodyIndex === -1)
    return null;
  const joined = texts.slice(bodyIndex + 1).join(" ");
  const body = /^".*"$/s.test(joined) ? joined.slice(1, -1) : joined;
  const commands = body.split(CMD_CONNECTORS).map((piece) => {
    const tokens = piece.match(CMD_TOKEN) ?? [];
    const deleteIndex = tokens.findIndex((token) => CMD_DELETE_COMMANDS.has(token.replace(/^@/, "").toLowerCase()));
    const deleteTokens = deleteIndex === -1 ? [] : tokens.slice(deleteIndex);
    return {
      piece,
      tokens,
      deleteTokens,
      recursiveDelete: deleteTokens.slice(1).some((token) => token.startsWith("/") && token.toLowerCase().split("/").includes("s"))
    };
  });
  const recursiveDeletes = commands.filter((command) => command.recursiveDelete);
  const mentionsRecursiveDelete = recursiveDeletes.length > 0 || CMD_DELETE_WORD.test(body) && CMD_RECURSIVE_SWITCH.test(body);
  if (mentionsRecursiveDelete && (body.includes("\\\"") || options.gitBashEscapesBodyQuotes && body.includes('"') || options.powerShellRawWords.some((raw) => ESCAPED_QUOTE_INSIDE_WORD.test(raw)) || recursiveDeletes.some((command) => command.tokens.some((token) => WINDOWS_NAMESPACE_PREFIX.test(token))))) {
    return import_destructive9.destructiveCommandMatch("cmd.recursive-delete-escaped-quote", REASON_CMD_DELETE_ESCAPED_QUOTE);
  }
  const ctx = createRecursiveDeleteTargetContext({
    ...options,
    allowPaths: options.policy?.destructiveCommandAllowPaths
  });
  const pieceMatch = commands.reduce((match, command) => match ?? (command.recursiveDelete ? recursiveDeleteTargetMatch(command.deleteTokens, ctx, options.policy) : options.analyzeNested(command.piece)), null);
  const unverifiableRecursiveDelete = mentionsRecursiveDelete && (recursiveDeletes.length === 0 || CMD_ESCAPE_OR_EXPANSION.test(body) || CMD_DIRECTORY_WORD.test(body) || body.includes('"') && CMD_CONNECTORS.test(body));
  return pieceMatch ?? (unverifiableRecursiveDelete ? dynamicShellSourceMatch() : null);
}
function recursiveDeleteTargetMatch(tokens, ctx, policy) {
  return tokens.slice(1).filter((token) => !token.startsWith("/")).reduce((match, token) => match ?? import_effective_rules5.filterDestructiveCommandMatch(matchRecursiveDeleteClassification(classifyRecursiveDeleteTarget(powerShellTargetForPolicy(token.replaceAll('"', "")).replace(CMD_MATCH_ALL_FINAL_SEGMENT, "$1*"), ctx), ctx, policy, CMD_DELETE_RULES), policy), null);
}

// src/gate/analyzer/rule.ts
var import_git = require("./analyzer-core.js");
var import_parallel = require("./analyzer-core.js");

// src/gate/analyzer/rm.ts
var import_canonicalization3 = require("./core.js");
var import_effective_rules6 = require("./core.js");
var import_destructive10 = require("./core-shell.js");
var import_git_metadata_protection5 = require("./gate.js");
var REASON_RM_RF = "rm -rf outside cwd is blocked. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.";
var REASON_RM_RF_POLICY = "rm -rf for non-temporary paths is blocked by the active safety policy. Retry deleting only explicit paths inside the current directory; escalate for anything outside it.";
var REASON_RM_RF_DYNAMIC_TARGET = "rm -rf target contains shell variables that cannot be verified safely. Use literal paths within cwd, /tmp, /var/tmp, or $TMPDIR.";
var REASON_RM_RF_ROOT_HOME = "rm -rf targeting root or home directory is extremely dangerous and always blocked.";
var REASON_RM_HOME_CWD = "rm -rf in home directory is dangerous. Change to a project directory first.";
var RM_RULES = {
  root_or_home_target: { id: "rm.recursive-force-root-or-home", reason: REASON_RM_RF_ROOT_HOME },
  git_metadata_target: { id: "rm.git-metadata", reason: import_git_metadata_protection5.REASON_GIT_METADATA_PROTECTION },
  dynamic_target: {
    id: "rm.recursive-force-dynamic-target",
    reason: REASON_RM_RF_DYNAMIC_TARGET
  },
  home_cwd_target: { id: "rm.recursive-force-home-cwd", reason: REASON_RM_HOME_CWD },
  cwd_self_target: { id: "rm.recursive-force-cwd-self", reason: REASON_RM_RF },
  within_anchored_cwd: { id: "rm.recursive-force-paranoid", reason: REASON_RM_RF_POLICY },
  outside_anchored_cwd: { id: "rm.recursive-force-outside-cwd", reason: REASON_RM_RF }
};
function analyzeRmMatch(words, options) {
  const ctx = createRecursiveDeleteTargetContext({
    ...options,
    allowPaths: options.policy?.destructiveCommandAllowPaths,
    posixShell: true
  });
  const flagTexts = words.map(analysisWordText);
  const recursive = hasRecursiveOption(flagTexts);
  const targets = extractTargets(words);
  for (const target of targets) {
    const facts = deleteTargetWordFacts(target.word);
    if (recursive && facts.unsafeBraceExpansion) {
      const match = import_effective_rules6.filterDestructiveCommandMatch(matchRecursiveDeleteClassification({ kind: "outside_anchored_cwd" }, ctx, options.policy, RM_RULES), options.policy);
      if (match)
        return match;
      continue;
    }
    for (const expandedTarget of facts.expandedTargets ?? [target.text]) {
      const nativeTarget = import_canonicalization3.normalizeMsysDrivePath(expandedTarget);
      const classificationOptions = {
        targetIsLiteral: facts.expandedTargets !== undefined || facts.targetIsLiteral,
        tmpdirWordSplittingProtected: facts.tmpdirWordSplittingProtected
      };
      if (!recursive && ctx.resolvedCwd && import_git_metadata_protection5.isProtectedGitDeleteTarget(nativeTarget, ctx.resolvedCwd, ctx.protectedGitMetadata, recursive, ctx.environment, ctx.budget)) {
        return import_destructive10.destructiveCommandMatch("rm.git-metadata", import_git_metadata_protection5.REASON_GIT_METADATA_PROTECTION);
      }
      if (!recursive)
        continue;
      for (const classification of orderedTargetClassifications(nativeTarget, ctx, classificationOptions)) {
        const candidate = matchRecursiveDeleteClassification(classification, ctx, options.policy, RM_RULES);
        const match = import_effective_rules6.filterDestructiveCommandMatch(candidate, options.policy);
        if (match)
          return match;
      }
    }
  }
  return null;
}
function orderedTargetClassifications(target, ctx, options) {
  const primary = classifyRecursiveDeleteTarget(target, ctx, options);
  if (primary.kind === "cwd_self_target") {
    return [primary, classifyRecursiveDeleteTarget(target, ctx, { ...options, skipCwdSelf: true })];
  }
  if (primary.kind !== "home_cwd_target")
    return [primary];
  const targetSpecific = classifyRecursiveDeleteTarget(target, ctx, {
    ...options,
    skipHomeCwd: true
  });
  if (targetSpecific.kind !== "cwd_self_target")
    return [primary, targetSpecific];
  return [
    primary,
    targetSpecific,
    classifyRecursiveDeleteTarget(target, ctx, {
      ...options,
      skipHomeCwd: true,
      skipCwdSelf: true
    })
  ];
}
function extractTargets(words) {
  const targets = [];
  let pastDoubleDash = false;
  for (const word of words.slice(1)) {
    const text = analysisWordText(word);
    if (!text)
      continue;
    if (text === "--") {
      pastDoubleDash = true;
      continue;
    }
    if (pastDoubleDash) {
      targets.push({ text, word });
      continue;
    }
    if (!text.startsWith("-")) {
      targets.push({ text, word });
    }
  }
  return targets;
}

// src/gate/analyzer/rule.ts
var ANALYZER_RULES = [
  {
    heads: new Set(["rm", "rmdir"]),
    analyze: (context) => analyzeRmMatch(context.words, recursiveDeleteAnalyzeOptions(context))
  },
  {
    heads: new Set(["cmd"]),
    analyze: (context) => analyzeCmdMatch(context.words, {
      ...recursiveDeleteAnalyzeOptions(context),
      powerShellRawWords: context.options.commandView?.dialect === "powershell" ? context.options.commandView.words.map((word) => word.raw) : [],
      gitBashEscapesBodyQuotes: context.options.commandView?.dialect !== "powershell",
      analyzeNested: (command) => matchFromBlockResult(context.options.analyzeNested(command, {
        effectiveCwd: context.effectiveCwd,
        envAssignments: context.envAssignments
      }))
    })
  },
  {
    heads: new Set(["powershell", "pwsh"]),
    analyze: (context) => analyzePowerShellWrapperMatch(context.parsedWords, (script) => matchFromBlockResult(context.options.analyzeNested(script, {
      effectiveCwd: context.effectiveCwd,
      envAssignments: context.envAssignments,
      shell: "powershell"
    })))
  },
  {
    heads: new Set(["git"]),
    analyze: (context) => import_git.analyzeGitMatch(context.words, gitAnalyzeOptions(context))
  },
  {
    heads: new Set(["find"]),
    analyze: (context) => analyzeFindMatch(context.words, {
      ...recursiveDeleteAnalyzeOptions(context),
      envAssignments: context.envAssignments,
      analyzeTokens: context.analyzeChildTokens
    })
  },
  {
    heads: new Set(["xargs"]),
    analyze: (context) => analyzeXargs(context.words, {
      ...nestedCommandAnalyzeContext(context),
      analyzeChild: context.analyzeChild,
      analyzeNested: (command, overrides) => matchFromBlockResult(context.options.analyzeNested(command, overrides))
    })
  },
  {
    heads: new Set(["parallel"]),
    analyze: (context) => import_parallel.analyzeParallel(context.words, {
      ...nestedCommandAnalyzeContext(context),
      analyzeChild: context.analyzeChild,
      analyzeNested: (command, overrides) => matchFromBlockResult(context.options.analyzeNested(command, overrides))
    })
  }
];
function nestedCommandAnalyzeContext(context) {
  return {
    environment: context.options.environment,
    cwd: context.cwd,
    originalCwd: context.originalCwd,
    strict: context.options.strict,
    paranoidRm: context.options.paranoidRm,
    paranoidInterpreters: context.options.paranoidInterpreters,
    allowTmpdirVar: context.allowTmpdirVar,
    protectedGitMetadata: context.options.protectedGitMetadata,
    budget: context.options.budget,
    envAssignments: context.envAssignments,
    worktreeMode: context.options.worktreeMode,
    policy: context.options.policy
  };
}
function matchFromBlockResult(result) {
  return result ? { id: result.ruleId, reason: result.reason, intent: result.intent ?? "manual_only" } : null;
}
function recursiveDeleteAnalyzeOptions(context) {
  return {
    environment: context.options.environment,
    cwd: context.cwd,
    originalCwd: context.originalCwd,
    strict: context.options.strict,
    paranoid: context.options.paranoidRm,
    allowTmpdirVar: context.allowTmpdirVar,
    tmpdirWordSplittingUnsafe: import_tmpdir3.hasUnsafeTmpdirWordSplitting(context.envAssignments, context.options.environment),
    trustedTmpdirValue: import_tmpdir3.isTmpdirValueTrusted(context.envAssignments, context.options.environment),
    protectedGitMetadata: context.options.protectedGitMetadata,
    policy: context.options.policy,
    budget: context.options.budget
  };
}
function gitAnalyzeOptions(context) {
  return {
    environment: context.options.environment,
    cwd: context.cwd,
    originalCwd: context.originalCwd,
    dynamicArguments: context.dynamicArguments,
    envAssignments: context.envAssignments,
    shellAssignments: context.options.shellAssignments,
    policy: context.options.policy,
    worktreeMode: context.options.worktreeMode
  };
}
// src/gate/analyzer/heredoc-files.ts
var import_node_path3 = require("node:path");
var import_canonicalization4 = require("./core.js");
function resolveTrackedHeredocPath(source, effectiveCwd, paths, budget) {
  const path = import_node_path3.isAbsolute(source) ? import_node_path3.resolve(source) : effectiveCwd ? import_node_path3.resolve(effectiveCwd, source) : undefined;
  if (!path)
    return;
  try {
    return import_canonicalization4.resolveExistingPath(path, paths, budget);
  } catch {
    return path;
  }
}
function isPersistentHeredocFilePath(path) {
  return !["/dev", "/proc", "/sys"].some((root) => path === root || path.startsWith(`${root}/`));
}
// src/gate/analyzer/derived-input.ts
var import_effective_rules7 = require("./core.js");
var import_constants6 = require("./core-shell.js");
var import_destructive11 = require("./core-shell.js");
var import_model = require("./core-shell.js");
var import_tokens8 = require("./core-shell.js");
var import_git2 = require("./analyzer-core.js");
var import_rules2 = require("./analyzer-core.js");
var import_parallel2 = require("./analyzer-core.js");
var REASON_DYNAMIC_EXECUTABLE = "dynamic command name contains shell substitution output and cannot be verified safely. Use a literal executable name.";
var REASON_DYNAMIC_STRUCTURE = "shell substitution output can change guarded command structure and cannot be verified safely. Use literal subcommands and options.";
function hasCommandSubstitutionPart(word) {
  return word?.parts.some((part) => part.provenance === "command-substitution") ?? false;
}
function hasOptionLiteralPart(word) {
  return word?.parts.some((part) => part.provenance === "literal" && part.raw.replace(/^["']/, "").startsWith("-")) ?? false;
}
function analyzeDynamicCommandStructure(dialect, words, environment, topLevel, strict = false, policy) {
  const dynamicHead = import_model.isDynamicExecutable(dialect, words) || topLevel && dialect !== "powershell" && words[0]?.provenance === "variable";
  const dynamicExecutableMatch = dynamicHead && import_effective_rules7.destructiveCommandRuleIsEnabled(policy, "shell.dynamic-executable", strict) ? import_destructive11.destructiveCommandMatch("shell.dynamic-executable", REASON_DYNAMIC_EXECUTABLE) : null;
  return import_effective_rules7.filterDestructiveCommandMatch(dynamicExecutableMatch, policy) ?? analyzeDynamicStructure(dialect, words, environment, strict, policy);
}
function analyzeDynamicStructure(dialect, words, environment, strict, policy) {
  if (words.length < 2)
    return null;
  const dynamicIndexes = words.flatMap((word, index) => hasCommandSubstitutionPart(word) ? [index] : []);
  if (dynamicIndexes.length === 0)
    return null;
  const head = import_tokens8.normalizeCommandToken(words[0]?.text ?? "");
  if (head === "git") {
    const gitWords = analyzedViewWords(dialect, words);
    const subcommandIndex = findGitSubcommandIndex(gitWords);
    if (import_effective_rules7.destructiveCommandRuleIsEnabled(policy, "shell.dynamic-structure", strict) && dynamicIndexes.some((index) => index <= subcommandIndex)) {
      return import_effective_rules7.filterDestructiveCommandMatch(import_destructive11.destructiveCommandMatch("shell.dynamic-structure", REASON_DYNAMIC_STRUCTURE), policy);
    }
    if (import_effective_rules7.filterDestructiveCommandMatch(import_git2.analyzeGitMatch(gitWords, { environment }), policy))
      return null;
    const subcommand = words[subcommandIndex]?.text.toLowerCase();
    const dataBoundary = gitWords.findIndex((word, index) => index > subcommandIndex && analysisWordText(word) === "--");
    if (import_effective_rules7.destructiveCommandRuleIsEnabled(policy, "shell.dynamic-structure", strict) && subcommand && import_rules2.GIT_RULE_SUBCOMMANDS.has(subcommand) && dynamicIndexes.some((index) => index > subcommandIndex && (dataBoundary === -1 || index < dataBoundary))) {
      return import_effective_rules7.filterDestructiveCommandMatch(import_destructive11.destructiveCommandMatch("shell.dynamic-structure", REASON_DYNAMIC_STRUCTURE), policy);
    }
    return null;
  }
  if (head === "find") {
    return import_effective_rules7.destructiveCommandRuleIsEnabled(policy, "shell.dynamic-structure", strict) && hasDynamicFindStructure(words) ? import_effective_rules7.filterDestructiveCommandMatch(import_destructive11.destructiveCommandMatch("shell.dynamic-structure", REASON_DYNAMIC_STRUCTURE), policy) : null;
  }
  if (head === "rm") {
    const dataBoundary = words.findIndex((word, index) => index > 0 && analysisWordText(word) === "--");
    const trailingJudgedByRmRules = hasRecursiveForceFlags(words.map(analysisWordText));
    return import_effective_rules7.destructiveCommandRuleIsEnabled(policy, "shell.dynamic-structure", strict) && dynamicIndexes.some((index) => (dataBoundary === -1 || index < dataBoundary) && (index < words.length - 1 || !trailingJudgedByRmRules)) ? import_effective_rules7.filterDestructiveCommandMatch(import_destructive11.destructiveCommandMatch("shell.dynamic-structure", REASON_DYNAMIC_STRUCTURE), policy) : null;
  }
  if (head === "xargs") {
    return analyzeDynamicChildStructure(dialect, words.slice(extractXargsChildCommandWithInfo(words.map(analysisWordText)).childStart), "xargs", environment, strict, policy);
  }
  if (head === "parallel") {
    return analyzeDynamicChildStructure(dialect, words.slice(import_parallel2.extractParallelChildStart(words.map(analysisWordText))), "parallel", environment, strict, policy);
  }
  return null;
}
function analyzeDynamicChildStructure(dialect, childWords, kind, environment, strict, policy) {
  if (childWords.length === 0)
    return null;
  const child = normalizeChildCommandWords(childWords, environment);
  if (import_model.isDynamicExecutable(dialect, child)) {
    const match = import_effective_rules7.filterDestructiveCommandMatch(import_destructive11.destructiveCommandMatch(`${kind}.shell-dynamic`, kind === "xargs" ? REASON_XARGS_SHELL : import_parallel2.REASON_PARALLEL_SHELL), policy);
    if (match)
      return match;
  }
  const nestedStructure = analyzeDynamicStructure(dialect, child, environment, strict, policy);
  if (nestedStructure)
    return nestedStructure;
  if (child[0]?.text === "rm" && child.slice(1).some((word) => hasCommandSubstitutionPart(word) && hasOptionLiteralPart(word))) {
    return import_effective_rules7.filterDestructiveCommandMatch(import_destructive11.destructiveCommandMatch(`${kind}.rm-recursive-force-dynamic`, kind === "xargs" ? REASON_XARGS_RM : import_parallel2.REASON_PARALLEL_RM), policy);
  }
  return null;
}
function normalizeChildCommandWords(words, environment) {
  const stripped = stripWrapperWords(words, environment);
  const normalized = stripped.rewritten ? textCommandWords(stripped.words.map(analysisWordText)) : stripped.words;
  const normalizedHead = normalized[0];
  return normalizedHead && analysisWordText(normalizedHead) === "busybox" ? normalized.slice(1) : normalized;
}
function findGitSubcommandIndex(words) {
  let i = 1;
  while (i < words.length) {
    const word = words[i];
    const token = word ? analysisWordText(word) : "";
    if (import_constants6.GIT_GLOBAL_OPTS_WITH_VALUE.has(token)) {
      i += 2;
      continue;
    }
    if (token.startsWith("-")) {
      i++;
      continue;
    }
    return i;
  }
  return i;
}
function hasDynamicFindStructure(words) {
  let expressionStarted = false;
  let valuesRemaining = 0;
  let childStart = false;
  let inChild = false;
  for (let i = 1;i < words.length; i++) {
    const word = words[i];
    if (!word)
      continue;
    const dynamic = hasCommandSubstitutionPart(word);
    if (valuesRemaining > 0) {
      valuesRemaining--;
      continue;
    }
    if (inChild) {
      if (word.text === ";" || word.text === "+") {
        inChild = false;
        expressionStarted = true;
        childStart = false;
        continue;
      }
      if (dynamic && (childStart || hasOptionLiteralPart(word)))
        return true;
      childStart = false;
      continue;
    }
    if (!expressionStarted && !word.text.startsWith("-")) {
      if (dynamic && (i > 1 || hasOptionLiteralPart(word)))
        return true;
      continue;
    }
    expressionStarted = true;
    if (dynamic)
      return true;
    const arity = getFindPrimaryArity(word.text);
    if (arity > 0) {
      valuesRemaining = arity;
      continue;
    }
    if (isFindExecPrimary(word.text)) {
      inChild = true;
      childStart = true;
    }
  }
  return false;
}
function hasDynamicExecutableSource(sources, words) {
  return sources.some((source) => {
    if (source.value === "-" && (source.kind === "main-script" || source.kind === "program-file")) {
      return true;
    }
    return !isLiteralExecutionSourceWord(words[source.tokenIndex], source.value);
  });
}
// src/gate/analyzer/deferred-assignment.ts
var ASSIGNMENT_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*=/;
function isDataOnlyQuotedAssignment(view, program, scanWork) {
  const word = view.words[0];
  if (!program || !word || view.words.length !== 1 || view.dialect !== "posix")
    return false;
  if (!word.quoted || word.provenance !== "literal")
    return false;
  const name = /^([A-Za-z_][A-Za-z0-9_]*)=/.exec(word.text)?.[1];
  if (!name)
    return false;
  chargeScan(scanWork, program.source, 2);
  const references = {
    anchored: new RegExp(`^\\$\\{?${name}(?![A-Za-z0-9_])`),
    loose: new RegExp(`\\$\\{?${name}(?![A-Za-z0-9_])`)
  };
  return nodesHaveOnlyDataReferences(program.nodes, word, references);
}
function nodesHaveOnlyDataReferences(nodes, assignment, references) {
  return nodes.every((node) => {
    if (node.kind === "connector")
      return true;
    if (node.kind === "group" || node.kind === "function") {
      return nodesHaveOnlyDataReferences(node.body.nodes, assignment, references);
    }
    if (node.kind === "unknown")
      return !references.loose.test(node.source);
    return viewHasOnlyDataReferences(node, assignment, references);
  });
}
function viewHasOnlyDataReferences(view, assignment, references) {
  if (view.nested.some((program) => references.loose.test(program.source)))
    return false;
  const commandIndex = view.words.findIndex((word) => !ASSIGNMENT_PATTERN.test(word.text));
  return view.words.every((word, index) => word === assignment || rawReferencesAreQuoted(word.raw, references.anchored, index !== commandIndex)) && view.redirections.every((redirection) => (!redirection.heredoc || redirection.heredoc.quotedDelimiter || !references.loose.test(redirection.heredoc.body)) && (!redirection.target || rawReferencesAreQuoted(redirection.target.raw, references.anchored, true)));
}
function rawReferencesAreQuoted(raw, anchored, allowQuoted) {
  let single = false;
  let double = false;
  for (let i = 0;i < raw.length; i++) {
    const char = raw[i];
    if (char === "\\" && !single) {
      i++;
      continue;
    }
    if (!double && char === "'") {
      single = !single;
      continue;
    }
    if (!single && char === '"') {
      double = !double;
      continue;
    }
    if (single || char !== "$")
      continue;
    if (!anchored.test(raw.slice(i)))
      continue;
    if (!double || !allowQuoted)
      return false;
  }
  return true;
}
