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

// src/bin/core-shell.ts
var exports_core_shell = {};
__export(exports_core_shell, {
  AWK_INTERPRETERS: () => AWK_INTERPRETERS,
  BASH_LONG_VALUE_OPTIONS: () => BASH_LONG_VALUE_OPTIONS,
  COMMAND_PATTERN: () => COMMAND_PATTERN,
  DEFAULT_COMMAND_PARSER_LIMITS: () => DEFAULT_COMMAND_PARSER_LIMITS,
  DESTRUCTIVE_COMMAND_RULE_ID_SET: () => DESTRUCTIVE_COMMAND_RULE_ID_SET,
  DESTRUCTIVE_COMMAND_RULE_METADATA: () => DESTRUCTIVE_COMMAND_RULE_METADATA,
  DISPLAY_COMMANDS: () => DISPLAY_COMMANDS,
  GIT_GLOBAL_OPTS_WITH_VALUE: () => GIT_GLOBAL_OPTS_WITH_VALUE,
  INTERPRETERS: () => INTERPRETERS,
  MAX_REASON_LENGTH: () => MAX_REASON_LENGTH,
  PYTHON_INTERPRETER_PATTERN: () => PYTHON_INTERPRETER_PATTERN,
  PolicyFilesystemError: () => PolicyFilesystemError,
  SECRET_BASENAME_RULES: () => SECRET_BASENAME_RULES,
  SECRET_BROAD_SSH_KEY_BASENAME_RULE: () => SECRET_BROAD_SSH_KEY_BASENAME_RULE,
  SECRET_CODING_CLI_RULES: () => SECRET_CODING_CLI_RULES,
  SECRET_DEFAULT_OFF_RULE_ID_SET: () => SECRET_DEFAULT_OFF_RULE_ID_SET,
  SECRET_ENV_VARIANT_RULE: () => SECRET_ENV_VARIANT_RULE,
  SECRET_EXTENSION_PATTERN_RULES: () => SECRET_EXTENSION_PATTERN_RULES,
  SECRET_EXTENSION_RULES: () => SECRET_EXTENSION_RULES,
  SECRET_HOME_PATH_RULES: () => SECRET_HOME_PATH_RULES,
  SECRET_PROTECTION_RULE_ID_SET: () => SECRET_PROTECTION_RULE_ID_SET,
  SECRET_PROTECTION_RULE_METADATA: () => SECRET_PROTECTION_RULE_METADATA,
  SECRET_VARIANT_DOT_SUFFIX_RULES: () => SECRET_VARIANT_DOT_SUFFIX_RULES,
  SECRET_VARIANT_SEPARATOR_RULES: () => SECRET_VARIANT_SEPARATOR_RULES,
  SHELL_WRAPPERS: () => SHELL_WRAPPERS,
  advanceQuoteScanState: () => advanceQuoteScanState,
  appendAccumulatedCommand: () => appendAccumulatedCommand,
  bindDelegatedPolicyFilesystemTarget: () => bindDelegatedPolicyFilesystemTarget,
  bindPolicyFilesystemScope: () => bindPolicyFilesystemScope,
  checkPolicyRuleMatch: () => checkPolicyRuleMatch,
  consumeHeredocBodies: () => consumeHeredocBodies,
  createCommandAccumulator: () => createCommandAccumulator,
  createCommandWordParts: () => createCommandWordParts,
  destructiveCommandMatch: () => destructiveCommandMatch,
  expandPosixLiteralBraceWord: () => expandPosixLiteralBraceWord,
  extractShortOpts: () => extractShortOpts,
  freezeCommandProgram: () => freezeCommandProgram,
  freezeCommandWord: () => freezeCommandWord,
  freezeParsedCommandWord: () => freezeParsedCommandWord,
  getBasename: () => getBasename,
  getCalledCommandName: () => getCalledCommandName,
  getCustomRuleOptionsWithValues: () => getCustomRuleOptionsWithValues,
  getMatchGlobalOptionsWithValues: () => getMatchGlobalOptionsWithValues,
  getPolicyFilesystemTarget: () => getPolicyFilesystemTarget,
  getPolicyFilesystemTargetForPath: () => getPolicyFilesystemTargetForPath,
  hasUnclosedQuotes: () => hasUnclosedQuotes,
  isDynamicExecutable: () => isDynamicExecutable,
  isSamePolicyFilesystemTarget: () => isSamePolicyFilesystemTarget,
  normalizeCommandToken: () => normalizeCommandToken,
  parseCommand: () => parseCommand,
  parsePosixCommand: () => parsePosixCommand,
  parsePowerShellCommand: () => parsePowerShellCommand,
  parseShellArgv: () => parseShellArgv,
  parseSimpleWords: () => parseSimpleWords,
  projectCommandViews: () => projectCommandViews,
  projectSegmentWords: () => projectSegmentWords,
  readHeredocDelimiter: () => readHeredocDelimiter,
  readPolicyDirectoryEntries: () => readPolicyDirectoryEntries,
  readPolicyFile: () => readPolicyFile,
  removeEmptyPolicyDirectory: () => removeEmptyPolicyDirectory,
  removePolicyDirectory: () => removePolicyDirectory,
  removePolicyFile: () => removePolicyFile,
  scanParameterExpansion: () => scanParameterExpansion,
  scanShellShortOptions: () => scanShellShortOptions,
  shouldUsePowerShellParser: () => shouldUsePowerShellParser,
  walkCommandViews: () => walkCommandViews,
  writePolicyFileAtomic: () => writePolicyFileAtomic
});
module.exports = __toCommonJS(exports_core_shell);

// src/core/shell/tokens.ts
function normalizeCommandToken(token) {
  return getBasename(token).toLowerCase();
}
function getBasename(token) {
  return token.split(/[\\/]/).pop()?.replace(/\.exe$/i, "") ?? token;
}
function extractShortOpts(tokens, options) {
  const opts = new Set;
  let pastDoubleDash = false;
  for (const token of tokens) {
    if (token === "--") {
      pastDoubleDash = true;
      continue;
    }
    if (pastDoubleDash)
      continue;
    if (token.startsWith("-") && !token.startsWith("--") && token.length > 1) {
      for (let i = 1;i < token.length; i++) {
        const char = token[i];
        if (!char || !/[a-zA-Z]/.test(char)) {
          break;
        }
        const shortOpt = `-${char}`;
        opts.add(shortOpt);
        if (options?.shortOptsWithValue?.has(shortOpt)) {
          break;
        }
      }
    }
  }
  return opts;
}
var SHELL_SHORT_VALUE_OPTIONS = {
  bash: ["O", "o"],
  dash: ["o"],
  ksh: ["o"],
  sh: ["o"],
  zsh: ["o"]
};
var BASH_LONG_VALUE_OPTIONS = new Set(["--init-file", "--rcfile"]);
function scanShellShortOptions(shell, token, nextToken, mode) {
  let interactive = false;
  let followingValues = 0;
  let commandSelected = false;
  let stdinMode = false;
  let syntaxCheck = false;
  for (let optionIndex = 1;optionIndex < token.length; optionIndex++) {
    const option = token[optionIndex];
    if (option === undefined)
      break;
    if (shell === "ksh" && option === "o" && optionIndex + 1 < token.length) {
      if (mode === "argv") {
        const optionName = token.slice(optionIndex + 1);
        if (token[0] === "-" && (optionName === "c" || optionName[0] === "-" && optionName.endsWith("c"))) {
          commandSelected = true;
        }
      }
      break;
    }
    if (shell === "ksh" && option === "o" && optionIndex + 1 === token.length && (nextToken?.startsWith("-") || nextToken?.startsWith("+"))) {
      break;
    }
    if (shell === "zsh" && option === "o" && optionIndex + 1 < token.length)
      break;
    if (mode === "startup" && option === "i")
      interactive = token[0] === "-";
    if (mode === "argv" && token[0] === "-" && option === "c")
      commandSelected = true;
    if (mode === "argv" && option === "n")
      syntaxCheck = token[0] === "-";
    if (mode === "argv" && option === "s")
      stdinMode = token[0] === "-";
    if (!SHELL_SHORT_VALUE_OPTIONS[shell]?.includes(option))
      continue;
    if (optionIndex + 1 === token.length)
      followingValues++;
    break;
  }
  return { interactive, followingValues, commandSelected, stdinMode, syntaxCheck };
}
function parseShellArgv(tokens) {
  const shell = getBasename(tokens[0] ?? "").toLowerCase();
  let commandSelected = false;
  let stdinMode = false;
  let syntaxCheck = false;
  for (let index = 1;index < tokens.length; index++) {
    const token = tokens[index];
    if (token === undefined)
      break;
    if (token === "--") {
      const commandIndex = commandSelected && tokens[index + 1] !== undefined ? index + 1 : null;
      return {
        command: commandIndex === null ? null : tokens[commandIndex] ?? null,
        commandIndex,
        scriptIndex: !commandSelected && !stdinMode && tokens[index + 1] !== undefined ? index + 1 : null,
        readsStdinAsCommands: !commandSelected && (stdinMode || tokens[index + 1] === undefined),
        syntaxCheck
      };
    }
    if (token === "-" || token[0] !== "-" && token[0] !== "+") {
      return {
        command: commandSelected ? token : null,
        commandIndex: commandSelected ? index : null,
        scriptIndex: !commandSelected && !stdinMode && token !== "-" ? index : null,
        readsStdinAsCommands: !commandSelected && (stdinMode || token === "-"),
        syntaxCheck
      };
    }
    if (token.startsWith("--")) {
      const option = token.split("=", 1)[0] ?? token;
      if (shell === "bash" && BASH_LONG_VALUE_OPTIONS.has(option) && !token.includes("="))
        index++;
      continue;
    }
    const shortScan = scanShellShortOptions(shell, token, tokens[index + 1], "argv");
    if (shortScan.commandSelected)
      commandSelected = true;
    if (shortScan.syntaxCheck)
      syntaxCheck = true;
    if (shortScan.stdinMode)
      stdinMode = true;
    index += shortScan.followingValues;
  }
  return {
    command: null,
    commandIndex: null,
    scriptIndex: null,
    readsStdinAsCommands: !commandSelected,
    syntaxCheck
  };
}
function advanceQuoteScanState(char, state) {
  if (state.escaped) {
    state.escaped = false;
    return true;
  }
  if (char === "\\" && !state.inSingle) {
    state.escaped = true;
    return true;
  }
  if (char === "'" && !state.inDouble) {
    state.inSingle = !state.inSingle;
    return true;
  }
  if (char === '"' && !state.inSingle) {
    state.inDouble = !state.inDouble;
    return true;
  }
  return false;
}
function hasUnclosedQuotes(command) {
  const state = { inSingle: false, inDouble: false, escaped: false };
  for (const char of stripShellComments(command)) {
    advanceQuoteScanState(char, state);
  }
  return state.inSingle || state.inDouble;
}
function stripShellComments(command) {
  let result = "";
  const state = { inSingle: false, inDouble: false, escaped: false };
  let inComment = false;
  let atTokenStart = true;
  for (let i = 0;i < command.length; i++) {
    const char = command[i];
    if (!char)
      break;
    if (inComment) {
      if (char === `
` || char === "\r") {
        result += char;
        inComment = false;
        state.escaped = false;
      }
      continue;
    }
    if (char === "#" && !state.inSingle && !state.inDouble && atTokenStart) {
      inComment = true;
      continue;
    }
    result += char;
    if (!state.inSingle && !state.inDouble && !state.escaped) {
      atTokenStart = /[\s;&|()<>]/.test(char);
    }
    advanceQuoteScanState(char, state);
  }
  return result;
}
// src/core/rules/constants.ts
var GIT_GLOBAL_OPTS_WITH_VALUE = new Set([
  "-c",
  "-C",
  "--git-dir",
  "--work-tree",
  "--namespace",
  "--super-prefix",
  "--config-env"
]);
var COMMAND_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
var MAX_REASON_LENGTH = 256;
var SHELL_WRAPPERS = new Set(["bash", "sh", "zsh", "ksh", "dash", "fish", "csh", "tcsh"]);
var INTERPRETERS = new Set(["python", "python3", "python2", "node", "ruby", "perl"]);
var PYTHON_INTERPRETER_PATTERN = /^python(?:[23](?:\.\d+)*)?$/;
var AWK_INTERPRETERS = new Set(["awk", "gawk", "nawk", "mawk"]);
var DISPLAY_COMMANDS = new Set([
  "echo",
  "printf",
  "cat",
  "head",
  "tail",
  "less",
  "more",
  "grep",
  "rg",
  "ag",
  "ack",
  "sed",
  "awk",
  "cut",
  "tr",
  "sort",
  "uniq",
  "wc",
  "tee",
  "man",
  "help",
  "info",
  "type",
  "which",
  "whereis",
  "whatis",
  "apropos",
  "file",
  "stat",
  "ls",
  "ll",
  "dir",
  "tree",
  "pwd",
  "date",
  "cal",
  "uptime",
  "whoami",
  "id",
  "groups",
  "hostname",
  "uname",
  "env",
  "printenv",
  "set",
  "export",
  "alias",
  "history",
  "jobs",
  "fg",
  "bg",
  "test",
  "true",
  "false",
  "read",
  "return",
  "exit",
  "break",
  "continue",
  "shift",
  "wait",
  "trap",
  "basename",
  "dirname",
  "realpath",
  "readlink",
  "md5sum",
  "sha256sum",
  "base64",
  "xxd",
  "od",
  "hexdump",
  "strings",
  "diff",
  "cmp",
  "comm",
  "join",
  "paste",
  "column",
  "fmt",
  "fold",
  "nl",
  "pr",
  "expand",
  "unexpand",
  "rev",
  "tac",
  "shuf",
  "seq",
  "yes",
  "sleep",
  "logger",
  "write",
  "wall",
  "mesg",
  "notify-send"
]);
// src/core/io/safe-read.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_random_hex = require("./core.js");
var POLICY_FILESYSTEM_SCOPE = Symbol("PolicyFilesystemScope");
var POLICY_FILESYSTEM_TARGET = Symbol("PolicyFilesystemTarget");
var NO_FOLLOW = import_node_fs.constants.O_NOFOLLOW ?? 0;

class PolicyFilesystemError extends Error {
  name = "PolicyFilesystemError";
  constructor(label) {
    super(`Unable to access ${label} filesystem safely.`);
  }
}
function bindPolicyFilesystemScope(root, label) {
  return { [POLICY_FILESYSTEM_SCOPE]: true, root: import_node_path.resolve(root), label };
}
function getPolicyFilesystemTarget(scope, relativePath) {
  const normalized = import_node_path.normalize(relativePath);
  if (relativePath === "" || import_node_path.isAbsolute(relativePath) || normalized === ".." || normalized.startsWith(`..${import_node_path.sep}`)) {
    throw new PolicyFilesystemError(scope.label);
  }
  return {
    [POLICY_FILESYSTEM_TARGET]: true,
    scope,
    relativePath: normalized,
    path: import_node_path.join(scope.root, normalized)
  };
}
function getPolicyFilesystemTargetForPath(scope, path) {
  return getPolicyFilesystemTarget(scope, import_node_path.relative(scope.root, import_node_path.resolve(path)));
}
function bindDelegatedPolicyFilesystemTarget(path, label = "rules policy") {
  const absolutePath = import_node_path.resolve(path);
  const root = import_node_path.parse(absolutePath).dir;
  return getPolicyFilesystemTarget(bindPolicyFilesystemScope(root, label), import_node_path.relative(root, absolutePath));
}
function readPolicyFile(target) {
  return guarded(target.scope.label, () => {
    if (!validateTarget(target))
      return null;
    const descriptor = import_node_fs.openSync(target.path, import_node_fs.constants.O_RDONLY | NO_FOLLOW);
    return withDescriptor(descriptor, () => {
      const before = import_node_fs.fstatSync(descriptor);
      if (!before.isFile())
        throw new PolicyFilesystemError(target.scope.label);
      const content = import_node_fs.readFileSync(descriptor, "utf-8");
      const after = import_node_fs.lstatSync(target.path);
      if (!after.isFile() || after.isSymbolicLink() || before.dev !== after.dev || before.ino !== after.ino) {
        throw new PolicyFilesystemError(target.scope.label);
      }
      validateTarget(target);
      return content;
    });
  });
}
function writePolicyFileAtomic(target, content, mode = 384, afterRename) {
  const tempPath = `${target.path}.${import_random_hex.randomHex16()}.tmp`;
  guarded(target.scope.label, () => {
    ensureTargetParents(target);
    validateTarget(target);
    const descriptor = import_node_fs.openSync(tempPath, import_node_fs.constants.O_CREAT | import_node_fs.constants.O_EXCL | import_node_fs.constants.O_WRONLY | NO_FOLLOW, mode);
    const temp = withDescriptor(descriptor, () => {
      const before = import_node_fs.fstatSync(descriptor);
      if (!before.isFile())
        throw new PolicyFilesystemError(target.scope.label);
      import_node_fs.writeFileSync(descriptor, content, "utf-8");
      import_node_fs.fsyncSync(descriptor);
      const after = import_node_fs.fstatSync(descriptor);
      if (!after.isFile() || after.dev !== before.dev || after.ino !== before.ino) {
        throw new PolicyFilesystemError(target.scope.label);
      }
      return after;
    });
    validateTarget(target);
    validateAdjacentTemp(target, tempPath, temp.dev, temp.ino);
    import_node_fs.renameSync(tempPath, target.path);
    afterRename?.(target.path);
    validateTarget(target);
  }, () => unlinkSafely(tempPath));
}
function isSamePolicyFilesystemTarget(first, second) {
  if (first.path === second.path)
    return true;
  return guarded(first.scope.label, () => {
    if (!validateTarget(first) || !validateTarget(second))
      return false;
    const canonical = (path) => import_node_path.join(import_node_fs.realpathSync(import_node_path.parse(path).dir), import_node_path.parse(path).base);
    return canonical(first.path) === canonical(second.path);
  });
}
function readPolicyDirectoryEntries(target) {
  const names = guarded(target.scope.label, () => {
    if (!validateTarget(target, "directory"))
      return null;
    const entries = import_node_fs.readdirSync(target.path);
    validateTarget(target, "directory");
    return entries;
  });
  if (!names)
    return null;
  return guarded(target.scope.label, () => {
    const entries = names.map((name) => {
      const child = getPolicyFilesystemTarget(target.scope, import_node_path.join(target.relativePath, name));
      const stat = import_node_fs.lstatSync(child.path);
      if (stat.isSymbolicLink() || !stat.isFile() && !stat.isDirectory()) {
        throw new PolicyFilesystemError(target.scope.label);
      }
      assertCanonicalContainment(getCanonicalRootOrThrow(target.scope), import_node_fs.realpathSync(child.path), target.scope.label);
      return { name, kind: stat.isDirectory() ? "directory" : "file" };
    });
    validateTarget(target, "directory");
    return entries;
  });
}
function removePolicyFile(target) {
  guarded(target.scope.label, () => {
    if (!validateTarget(target))
      return;
    import_node_fs.unlinkSync(target.path);
    validateTarget(target);
  });
}
function removePolicyDirectory(target) {
  guarded(target.scope.label, () => {
    if (!validatePolicyDirectoryRemoval(target))
      return;
    removeValidatedTree(target);
    validateTarget(target, "directory");
  });
}
function removeEmptyPolicyDirectory(target) {
  guarded(target.scope.label, () => {
    if (!validateTarget(target, "directory"))
      return;
    import_node_fs.rmdirSync(target.path);
    validateTarget(target, "directory");
  });
}
function validatePolicyDirectoryRemoval(target) {
  return guarded(target.scope.label, () => {
    if (!validateTarget(target, "directory"))
      return false;
    validateRemovalTree(target);
    return true;
  });
}
function guarded(label, run, onFailure) {
  try {
    return run();
  } catch (error) {
    onFailure?.();
    if (error instanceof PolicyFilesystemError)
      throw error;
    throw new PolicyFilesystemError(label);
  }
}
function withDescriptor(descriptor, run) {
  try {
    return run();
  } finally {
    import_node_fs.closeSync(descriptor);
  }
}
function validateTarget(target, leafType = "file") {
  const canonicalRoot = getCanonicalRoot(target.scope);
  if (!canonicalRoot)
    return false;
  const parts = target.relativePath.split(import_node_path.sep);
  for (const index of parts.keys()) {
    const path = import_node_path.join(target.scope.root, ...parts.slice(0, index + 1));
    const stat = import_node_fs.lstatSync(path, { throwIfNoEntry: false });
    if (!stat)
      return false;
    if (stat.isSymbolicLink())
      throw new PolicyFilesystemError(target.scope.label);
    if (index < parts.length - 1 && !stat.isDirectory()) {
      throw new PolicyFilesystemError(target.scope.label);
    }
    if (index === parts.length - 1 && (leafType === "file" ? !stat.isFile() : !stat.isDirectory())) {
      throw new PolicyFilesystemError(target.scope.label);
    }
    assertCanonicalContainment(canonicalRoot, import_node_fs.realpathSync(path), target.scope.label);
  }
  return true;
}
function validateRemovalTree(target) {
  for (const name of import_node_fs.readdirSync(target.path)) {
    const child = getPolicyFilesystemTarget(target.scope, import_node_path.join(target.relativePath, name));
    const stat = import_node_fs.lstatSync(child.path);
    if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) {
      throw new PolicyFilesystemError(target.scope.label);
    }
    if (stat.isDirectory())
      validateRemovalTree(child);
  }
  validateTarget(target, "directory");
}
function removeValidatedTree(target) {
  for (const name of import_node_fs.readdirSync(target.path)) {
    const child = getPolicyFilesystemTarget(target.scope, import_node_path.join(target.relativePath, name));
    const stat = import_node_fs.lstatSync(child.path);
    if (stat.isSymbolicLink())
      throw new PolicyFilesystemError(target.scope.label);
    if (stat.isDirectory()) {
      removeValidatedTree(child);
      continue;
    }
    if (!stat.isFile())
      throw new PolicyFilesystemError(target.scope.label);
    import_node_fs.unlinkSync(child.path);
  }
  import_node_fs.rmdirSync(target.path);
}
function ensureTargetParents(target) {
  ensureRoot(target.scope);
  const canonicalRoot = getCanonicalRootOrThrow(target.scope);
  const parts = target.relativePath.split(import_node_path.sep).slice(0, -1);
  for (const index of parts.keys()) {
    const path = import_node_path.join(target.scope.root, ...parts.slice(0, index + 1));
    if (!import_node_fs.lstatSync(path, { throwIfNoEntry: false }))
      import_node_fs.mkdirSync(path, { mode: 448 });
    const after = import_node_fs.lstatSync(path);
    if (!after.isDirectory() || after.isSymbolicLink()) {
      throw new PolicyFilesystemError(target.scope.label);
    }
    assertCanonicalContainment(canonicalRoot, import_node_fs.realpathSync(path), target.scope.label);
  }
}
function ensureRoot(scope) {
  if (import_node_fs.lstatSync(scope.root, { throwIfNoEntry: false })) {
    if (!import_node_fs.statSync(scope.root).isDirectory())
      throw new PolicyFilesystemError(scope.label);
    return;
  }
  const missing = [];
  let current = scope.root;
  while (!import_node_fs.lstatSync(current, { throwIfNoEntry: false })) {
    missing.unshift(current);
    const parent = import_node_path.parse(current).dir;
    if (parent === current)
      throw new PolicyFilesystemError(scope.label);
    current = parent;
  }
  if (!import_node_fs.statSync(current).isDirectory())
    throw new PolicyFilesystemError(scope.label);
  for (const path of missing) {
    import_node_fs.mkdirSync(path, { mode: 448 });
    const stat = import_node_fs.lstatSync(path);
    if (!stat.isDirectory() || stat.isSymbolicLink()) {
      throw new PolicyFilesystemError(scope.label);
    }
  }
}
function getCanonicalRoot(scope) {
  if (!import_node_fs.lstatSync(scope.root, { throwIfNoEntry: false }))
    return null;
  if (!import_node_fs.statSync(scope.root).isDirectory())
    throw new PolicyFilesystemError(scope.label);
  return import_node_fs.realpathSync(scope.root);
}
function getCanonicalRootOrThrow(scope) {
  const root = getCanonicalRoot(scope);
  if (!root)
    throw new PolicyFilesystemError(scope.label);
  return root;
}
function validateAdjacentTemp(target, tempPath, device, inode) {
  const stat = import_node_fs.lstatSync(tempPath);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.dev !== device || stat.ino !== inode) {
    throw new PolicyFilesystemError(target.scope.label);
  }
  assertCanonicalContainment(getCanonicalRootOrThrow(target.scope), import_node_fs.realpathSync(tempPath), target.scope.label);
}
function assertCanonicalContainment(canonicalRoot, canonicalPath, label) {
  const remainder = import_node_path.relative(canonicalRoot, canonicalPath);
  if (remainder === ".." || remainder.startsWith(`..${import_node_path.sep}`) || import_node_path.isAbsolute(remainder)) {
    throw new PolicyFilesystemError(label);
  }
}
function unlinkSafely(path) {
  try {
    import_node_fs.unlinkSync(path);
  } catch {}
}
// src/core/rules/secret.ts
var SECRET_BASENAME_RULES = [
  {
    id: "secret.basename.env",
    category: "Basename",
    label: ".env",
    description: "Blocks exact .env files.",
    basename: ".env"
  },
  {
    id: "secret.basename.npmrc",
    category: "Basename",
    label: ".npmrc",
    description: "Blocks npm credential config files.",
    basename: ".npmrc"
  },
  {
    id: "secret.basename.pypirc",
    category: "Basename",
    label: ".pypirc",
    description: "Blocks Python package index credential files.",
    basename: ".pypirc"
  },
  {
    id: "secret.basename.netrc",
    category: "Basename",
    label: ".netrc",
    description: "Blocks machine login credential files.",
    basename: ".netrc"
  },
  {
    id: "secret.basename.git-credentials",
    category: "Basename",
    label: ".git-credentials",
    description: "Blocks Git credential storage files.",
    basename: ".git-credentials"
  },
  {
    id: "secret.basename.id-rsa",
    category: "Basename",
    label: "id_rsa",
    description: "Blocks RSA private key basenames.",
    basename: "id_rsa"
  },
  {
    id: "secret.basename.id-ed25519",
    category: "Basename",
    label: "id_ed25519",
    description: "Blocks Ed25519 private key basenames.",
    basename: "id_ed25519"
  },
  {
    id: "secret.basename.id-ecdsa",
    category: "Basename",
    label: "id_ecdsa",
    description: "Blocks ECDSA private key basenames.",
    basename: "id_ecdsa"
  },
  {
    id: "secret.basename.credentials",
    category: "Basename",
    label: "credentials",
    description: "Blocks generic credentials file basenames.",
    basename: "credentials"
  }
];
var SECRET_ENV_VARIANT_RULE = {
  id: "secret.pattern.env-variant",
  category: "Pattern",
  label: ".env.*",
  description: "Blocks environment-specific .env variants."
};
var SECRET_HOME_PATH_CONFIG_VARIANT_SUFFIXES = [
  ".bak",
  ".backup",
  ".copy",
  ".disabled",
  ".old",
  ".orig",
  ".save",
  ".tmp"
];
var SECRET_HOME_PATH_CONFIG_VARIANT_BASES = [
  {
    idSlug: "kube-config",
    label: "~/.kube/config",
    directoryParts: [".kube"],
    basename: "config"
  },
  {
    idSlug: "docker-config",
    label: "~/.docker/config.json",
    directoryParts: [".docker"],
    basename: "config.json"
  }
];
var SECRET_HOME_PATH_RULES = [
  {
    id: "secret.home.ssh",
    category: "Home path",
    label: "~/.ssh",
    description: "Blocks home SSH configuration and key paths.",
    suffixParts: [".ssh"]
  },
  {
    id: "secret.home.aws",
    category: "Home path",
    label: "~/.aws",
    description: "Blocks home AWS credential and config paths.",
    suffixParts: [".aws"]
  },
  {
    id: "secret.home.gcp",
    category: "Home path",
    label: "~/.gcp",
    description: "Blocks home GCP credential paths.",
    suffixParts: [".gcp"]
  },
  {
    id: "secret.home.gcloud-config",
    category: "Home path",
    label: "~/.config/gcloud",
    description: "Blocks home Google Cloud SDK credential paths.",
    suffixParts: [".config", "gcloud"]
  },
  {
    id: "secret.home.kube-config",
    category: "Home path",
    label: "~/.kube/config",
    description: "Blocks home Kubernetes config files.",
    suffixParts: [".kube", "config"]
  },
  {
    id: "secret.home.docker-config",
    category: "Home path",
    label: "~/.docker/config.json",
    description: "Blocks home Docker credential config files.",
    suffixParts: [".docker", "config.json"]
  },
  ...SECRET_HOME_PATH_CONFIG_VARIANT_BASES.flatMap((rule) => SECRET_HOME_PATH_CONFIG_VARIANT_SUFFIXES.map((suffix) => ({
    id: ["secret.home", rule.idSlug, suffix.slice(1)].join("."),
    category: "Home path",
    label: [rule.label, suffix].join(""),
    description: ["Blocks home ", rule.label, suffix, " credential backup files."].join(""),
    suffixParts: [...rule.directoryParts, [rule.basename, suffix].join("")]
  }))),
  {
    id: "secret.home.gh-hosts",
    category: "Home path",
    label: "~/.config/gh/hosts.yml",
    description: "Blocks GitHub CLI host credential files.",
    suffixParts: [".config", "gh", "hosts.yml"]
  }
];
var SECRET_CODING_CLI_CONFIG_CATEGORY = "Coding CLI config";
var SECRET_CODING_CLI_RULES = [
  {
    id: "secret.cli.claude-code",
    category: "Coding CLI credential",
    label: "Claude Code credentials",
    paths: ["~/.claude/.credentials.json"]
  },
  {
    id: "secret.cli.claude-code.config",
    category: "Coding CLI config",
    label: "Claude Code config",
    paths: [
      "~/.claude/settings.json",
      "~/.claude/settings.local.json",
      "~/.claude.json",
      "<project>/.claude/settings.local.json",
      "<project>/.mcp.json"
    ]
  },
  {
    id: "secret.cli.antigravity",
    category: "Coding CLI config",
    label: "Antigravity CLI hook config",
    paths: ["~/.gemini/config/hooks.json", "~/.gemini/config/mcp_config.json"]
  },
  {
    id: "secret.cli.codex",
    category: "Coding CLI credential",
    label: "Codex credentials",
    paths: [
      "~/.codex/auth.json",
      "~/.codex/.credentials.json",
      "~/.codex/secrets",
      "~/.codex/.sandbox-secrets"
    ]
  },
  {
    id: "secret.cli.codex.config",
    category: "Coding CLI config",
    label: "Codex config",
    paths: ["~/.codex/config.toml", "~/.codex/<name>.config.toml"]
  },
  {
    id: "secret.cli.gemini",
    category: "Coding CLI credential",
    label: "Gemini CLI credentials",
    paths: [
      "~/.gemini/oauth_creds.json",
      "~/.gemini/mcp-oauth-tokens.json",
      "~/.gemini/a2a-oauth-tokens.json",
      "~/.gemini/gemini-credentials.json"
    ]
  },
  {
    id: "secret.cli.gemini.config",
    category: "Coding CLI config",
    label: "Gemini CLI config",
    paths: [
      "~/.gemini/settings.json",
      "~/.gemini/google_accounts.json",
      "<project>/.gemini/settings.json",
      "/Library/Application Support/GeminiCli/settings.json",
      "/etc/gemini-cli/settings.json"
    ]
  },
  {
    id: "secret.cli.copilot-cli",
    category: "Coding CLI credential",
    label: "GitHub Copilot CLI credentials",
    paths: ["~/.copilot/config.json", "~/.copilot/mcp-oauth-config", "~/.copilot/mcp-secrets"]
  },
  {
    id: "secret.cli.copilot-cli.config",
    category: "Coding CLI config",
    label: "GitHub Copilot CLI config",
    paths: ["~/.copilot/mcp-config.json"]
  },
  {
    id: "secret.cli.kimi-code",
    category: "Coding CLI credential",
    label: "Kimi Code credentials",
    paths: [
      "~/.kimi-code/server.token",
      "~/.kimi-code/credentials",
      "~/.kimi/credentials",
      "~/.kimi/mcp-oauth"
    ]
  },
  {
    id: "secret.cli.kimi-code.config",
    category: "Coding CLI config",
    label: "Kimi Code config",
    paths: [
      "~/.kimi-code/config.toml",
      "~/.kimi-code/mcp.json",
      "~/.kimi/config.toml",
      "~/.kimi/config.json",
      "~/.kimi/config.json.bak",
      "~/.kimi/mcp.json",
      "<project>/.kimi-code/mcp.json"
    ]
  },
  {
    id: "secret.cli.opencode",
    category: "Coding CLI credential",
    label: "OpenCode credentials",
    paths: [
      "~/.local/share/opencode/auth.json",
      "~/.local/share/opencode/mcp-auth.json",
      "~/.local/share/opencode/opencode.db"
    ]
  },
  {
    id: "secret.cli.opencode.config",
    category: "Coding CLI config",
    label: "OpenCode config",
    paths: [
      "~/.config/opencode/opencode.json",
      "~/.config/opencode/opencode.jsonc",
      "~/.config/opencode/config.json",
      "/Library/Application Support/opencode/opencode.json",
      "/etc/opencode/opencode.json",
      "<project>/opencode.json",
      "<project>/opencode.jsonc"
    ]
  },
  {
    id: "secret.cli.pi",
    category: "Coding CLI credential",
    label: "Pi credentials",
    paths: ["~/.pi/agent/auth.json"]
  },
  {
    id: "secret.cli.pi.config",
    category: "Coding CLI config",
    label: "Pi config",
    paths: ["~/.pi/agent/models.json"]
  },
  {
    id: "secret.cli.amp",
    category: "Coding CLI credential",
    label: "Amp Code credentials",
    paths: ["~/.local/share/amp/secrets.json", "~/.amp/oauth"]
  },
  {
    id: "secret.cli.amp.config",
    category: "Coding CLI config",
    label: "Amp Code config",
    paths: [
      "~/.config/amp/settings.json",
      "~/.config/amp/settings.jsonc",
      "<project>/.amp/settings.json",
      "<project>/.amp/settings.jsonc"
    ]
  },
  {
    id: "secret.cli.cursor",
    category: "Coding CLI credential",
    label: "Cursor CLI credentials",
    paths: [
      "~/.cursor/auth.json",
      "~/.config/cursor/auth.json",
      "~/.cursor/projects/<name>/mcp-auth.json"
    ]
  },
  {
    id: "secret.cli.cursor.config",
    category: "Coding CLI config",
    label: "Cursor CLI config",
    paths: ["~/.cursor/mcp.json", "<project>/.cursor/mcp.json"]
  },
  {
    id: "secret.cli.grok-build",
    category: "Coding CLI credential",
    label: "Grok Build credentials",
    paths: ["~/.grok/auth.json", "~/.grok/mcp_credentials.json"]
  },
  {
    id: "secret.cli.grok-build.config",
    category: "Coding CLI config",
    label: "Grok Build config",
    paths: [
      "~/.grok/config.toml",
      "~/.grok/managed_config.toml",
      "~/.grok/requirements.toml",
      "<project>/.grok/config.toml",
      "/etc/grok/managed_config.toml",
      "/etc/grok/requirements.toml"
    ]
  },
  {
    id: "secret.cli.droid",
    category: "Coding CLI credential",
    label: "Factory Droid credentials",
    paths: [
      "~/.factory/auth.encrypted",
      "~/.factory/auth.v2.file",
      "~/.factory/auth.v2.key",
      "~/.factory/auth.v2.loginkeychain"
    ]
  },
  {
    id: "secret.cli.droid.config",
    category: "Coding CLI config",
    label: "Factory Droid config",
    paths: [
      "~/.factory/settings.json",
      "~/.factory/hooks.json",
      "~/.factory/mcp.json",
      "<project>/.factory/mcp.json"
    ]
  },
  {
    id: "secret.cli.devin",
    category: "Coding CLI credential",
    label: "Devin CLI credentials",
    paths: ["~/.local/share/devin/credentials.toml", "~/.local/share/devin/mcp/oauth"]
  },
  {
    id: "secret.cli.devin.config",
    category: "Coding CLI config",
    label: "Devin CLI config",
    paths: ["~/.config/devin/config.json"]
  }
];
var SECRET_VARIANT_PREFIXES = [
  { prefix: "id_rsa", slug: "id-rsa", label: "id_rsa" },
  { prefix: "id_dsa", slug: "id-dsa", label: "id_dsa" },
  { prefix: "id_ed25519", slug: "id-ed25519", label: "id_ed25519" },
  { prefix: "id_ecdsa", slug: "id-ecdsa", label: "id_ecdsa" },
  { prefix: "credentials", slug: "credentials", label: "credentials" }
];
var SECRET_DOT_VARIANT_SUFFIXES = [
  ".bak",
  ".backup",
  ".copy",
  ".disabled",
  ".key",
  ".old",
  ".orig",
  ".pem",
  ".save",
  ".tmp"
];
var SECRET_VARIANT_SEPARATOR_RULES = SECRET_VARIANT_PREFIXES.map((rule) => ({
  id: `secret.variant.${rule.slug}.separator`,
  category: "Variant",
  label: `${rule.label}-* / ${rule.label}_*`,
  description: `Blocks ${rule.label} variants with dash or underscore suffixes.`,
  prefix: rule.prefix
}));
var SECRET_VARIANT_DOT_SUFFIX_RULES = SECRET_VARIANT_PREFIXES.flatMap((rule) => SECRET_DOT_VARIANT_SUFFIXES.map((suffix) => ({
  id: `secret.variant.${rule.slug}.${suffix.slice(1)}`,
  category: "Variant",
  label: `${rule.label}${suffix}`,
  description: `Blocks ${rule.label}${suffix} private credential variants.`,
  prefix: rule.prefix,
  suffix
})));
var SECRET_BROAD_SSH_KEY_BASENAME_RULE = {
  id: "secret.pattern.ssh-key-basename",
  category: "Pattern",
  label: "*_(rsa|dsa|ed25519|ecdsa)",
  description: "Blocks extensionless SSH private key-like basenames.",
  pattern: /^.*_(rsa|dsa|ed25519|ecdsa)$/
};
var SECRET_EXTENSION_RULES = [
  "agilekeychain",
  "asc",
  "bek",
  "cscfg",
  "fve",
  "gnucash",
  "jks",
  "keychain",
  "kwallet",
  "mdf",
  "ovpn",
  "p12",
  "pcap",
  "pem",
  "pfx",
  "pkcs12",
  "psafe3",
  "rdp",
  "sdf",
  "tblk",
  "tpm"
].map((extension) => ({
  id: `secret.ext.${extension}`,
  category: "Extension",
  label: `.${extension}`,
  description: `Blocks files with the .${extension} extension.`,
  extension
}));
var SECRET_EXTENSION_PATTERN_RULES = [
  {
    id: "secret.ext-pattern.key",
    category: "Extension pattern",
    label: ".key / .keypair",
    description: "Blocks key and keypair extension patterns.",
    pattern: /^key(pair)?$/
  },
  {
    id: "secret.ext-pattern.keystore",
    category: "Extension pattern",
    label: ".keystore / .keyring",
    description: "Blocks keystore and keyring extension patterns.",
    pattern: /^key(store|ring)$/
  },
  {
    id: "secret.ext-pattern.kdbx",
    category: "Extension pattern",
    label: ".kdb / .kdbx",
    description: "Blocks KeePass database extension patterns.",
    pattern: /^kdbx?$/
  }
];
var SECRET_PROTECTION_RULE_METADATA = [
  ...SECRET_BASENAME_RULES,
  SECRET_ENV_VARIANT_RULE,
  ...SECRET_HOME_PATH_RULES,
  ...SECRET_VARIANT_SEPARATOR_RULES,
  ...SECRET_VARIANT_DOT_SUFFIX_RULES,
  SECRET_BROAD_SSH_KEY_BASENAME_RULE,
  ...SECRET_EXTENSION_RULES,
  ...SECRET_EXTENSION_PATTERN_RULES,
  ...SECRET_CODING_CLI_RULES
].map((rule) => ({
  id: rule.id,
  category: rule.category,
  label: rule.label,
  ...rule.category === SECRET_CODING_CLI_CONFIG_CATEGORY ? { defaultOff: true } : {},
  ..."paths" in rule ? { paths: rule.paths } : { description: rule.description }
}));
var SECRET_DEFAULT_OFF_RULE_ID_SET = new Set(SECRET_CODING_CLI_RULES.flatMap((rule) => rule.category === SECRET_CODING_CLI_CONFIG_CATEGORY ? [rule.id] : []));
var SECRET_PROTECTION_RULE_ID_SET = new Set(SECRET_PROTECTION_RULE_METADATA.map((rule) => rule.id));
// src/core/rules/destructive.ts
var DESTRUCTIVE_COMMAND_RULE_DEFINITIONS = [
  {
    id: "git.ssh-env",
    category: "Git",
    label: "Git SSH environment override",
    description: "Blocks Git network operations with SSH environment overrides.",
    example: 'GIT_SSH_COMMAND="./ssh-wrapper" git push',
    intent: "manual_only"
  },
  {
    id: "git.alias-config",
    category: "Git",
    label: "Git command-line alias",
    description: "Blocks command-line Git aliases that cannot be safely resolved.",
    example: "git -c alias.wipe='!rm -rf /' wipe",
    intent: "manual_only"
  },
  {
    id: "git.checkout-force",
    category: "Git",
    label: "Git checkout force",
    description: "Blocks forced checkout operations that discard local changes.",
    example: "git checkout --force main",
    intent: "use_alternative"
  },
  {
    id: "git.checkout-double-dash",
    category: "Git",
    label: "Git checkout path restore",
    description: "Blocks checkout path restores, with or without --.",
    example: "git checkout -- src/app.ts",
    intent: "use_alternative"
  },
  {
    id: "git.checkout-ref-path",
    category: "Git",
    label: "Git checkout ref and path",
    description: "Blocks checkout forms that mix a ref and path restore.",
    example: "git checkout HEAD -- src/app.ts",
    intent: "use_alternative"
  },
  {
    id: "git.checkout-pathspec-from-file",
    category: "Git",
    label: "Git checkout pathspec file",
    description: "Blocks checkout pathspec loading from a file.",
    example: "git checkout --pathspec-from-file=paths.txt",
    intent: "use_alternative"
  },
  {
    id: "git.checkout-ambiguous",
    category: "Git",
    label: "Git checkout ambiguous targets",
    description: "Blocks ambiguous checkout arguments that may restore paths.",
    example: "git checkout main src/app.ts",
    intent: "use_alternative"
  },
  {
    id: "git.switch-discard-changes",
    category: "Git",
    label: "Git switch discard changes",
    description: "Blocks branch switches that explicitly discard local changes.",
    example: "git switch --discard-changes main",
    intent: "use_alternative"
  },
  {
    id: "git.switch-force",
    category: "Git",
    label: "Git switch force",
    description: "Blocks forced branch switches.",
    example: "git switch --force main",
    intent: "use_alternative"
  },
  {
    id: "git.restore-worktree",
    category: "Git",
    label: "Git restore worktree",
    description: "Blocks worktree restore operations.",
    example: "git restore --worktree src/app.ts",
    intent: "use_alternative"
  },
  {
    id: "git.restore-unstaged",
    category: "Git",
    label: "Git restore unstaged",
    description: "Blocks unstaged restore operations.",
    example: "git restore src/app.ts",
    intent: "use_alternative"
  },
  {
    id: "git.reset-hard",
    category: "Git",
    label: "Git reset hard",
    description: "Blocks hard resets.",
    example: "git reset --hard",
    intent: "use_alternative"
  },
  {
    id: "git.reset-merge",
    category: "Git",
    label: "Git reset merge",
    description: "Blocks merge resets.",
    example: "git reset --merge",
    intent: "use_alternative"
  },
  {
    id: "git.clean-force",
    category: "Git",
    label: "Git clean force",
    description: "Blocks forced clean operations.",
    example: "git clean -fd",
    intent: "use_alternative"
  },
  {
    id: "git.rm-force",
    category: "Git",
    label: "Git rm force",
    description: "Blocks forced removal of tracked files from the working tree.",
    example: "git rm -rf .",
    intent: "use_alternative"
  },
  {
    id: "git.push-force",
    category: "Git",
    label: "Git push force",
    description: "Blocks force pushes.",
    example: "git push --force origin main",
    intent: "use_alternative"
  },
  {
    id: "git.push-delete",
    category: "Git",
    label: "Git push delete",
    description: "Blocks remote ref deletion through push.",
    example: "git push --delete origin old-branch",
    intent: "manual_only"
  },
  {
    id: "git.push-mirror",
    category: "Git",
    label: "Git push mirror",
    description: "Blocks mirror pushes that can force-update or delete remote refs.",
    example: "git push --mirror origin",
    intent: "manual_only"
  },
  {
    id: "git.branch-force-delete",
    category: "Git",
    label: "Git branch force delete",
    description: "Blocks forced branch deletion.",
    example: "git branch -D old-branch",
    intent: "use_alternative"
  },
  {
    id: "git.rebase-abort",
    category: "Git",
    label: "Git rebase abort",
    description: "Blocks rebase abort operations.",
    example: "git rebase --abort",
    intent: "use_alternative"
  },
  {
    id: "git.merge-abort",
    category: "Git",
    label: "Git merge abort",
    description: "Blocks merge abort operations.",
    example: "git merge --abort",
    intent: "use_alternative"
  },
  {
    id: "git.tag-delete",
    category: "Git",
    label: "Git tag delete",
    description: "Blocks tag deletion.",
    example: "git tag --delete v1.0.0",
    intent: "manual_only"
  },
  {
    id: "git.reflog-delete",
    category: "Git",
    label: "Git reflog delete",
    description: "Blocks reflog deletion.",
    example: "git reflog delete HEAD@{1}",
    intent: "manual_only"
  },
  {
    id: "git.stash-drop",
    category: "Git",
    label: "Git stash drop",
    description: "Blocks dropping stash entries.",
    example: "git stash drop stash@{0}",
    intent: "use_alternative"
  },
  {
    id: "git.stash-clear",
    category: "Git",
    label: "Git stash clear",
    description: "Blocks clearing all stash entries.",
    example: "git stash clear",
    intent: "manual_only"
  },
  {
    id: "git.worktree-remove-force",
    category: "Git",
    label: "Git worktree force remove",
    description: "Blocks forced worktree removal.",
    example: "git worktree remove --force ../feature",
    intent: "use_alternative"
  },
  {
    id: "rm.recursive-force-root-or-home",
    category: "Filesystem",
    label: "rm -rf root or home",
    description: "Blocks recursive forced removal of root or home paths.",
    example: "rm -rf /",
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "rm.git-metadata",
    category: "Filesystem",
    label: "rm Git metadata",
    description: "Blocks removal of protected Git metadata and hooks.",
    example: "rm -rf .git",
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "rm.recursive-force-dynamic-target",
    category: "Filesystem",
    label: "rm -rf dynamic target",
    description: "Blocks recursive forced removal with dynamic targets in strict mode.",
    example: 'rm -rf "$target"',
    intent: "scope_down",
    activationCapability: "fail_closed"
  },
  {
    id: "rm.recursive-force-home-cwd",
    category: "Filesystem",
    label: "rm -rf from home cwd",
    description: "Blocks recursive forced removal while working in home.",
    example: 'cd "$HOME" && rm -rf build',
    intent: "scope_down"
  },
  {
    id: "rm.recursive-force-cwd-self",
    category: "Filesystem",
    label: "rm -rf current directory",
    description: "Blocks recursive forced removal of the current directory.",
    example: "rm -rf .",
    intent: "scope_down"
  },
  {
    id: "rm.recursive-force-outside-cwd",
    category: "Filesystem",
    label: "rm -rf outside cwd",
    description: "Blocks recursive forced removal outside the original cwd.",
    example: "rm -rf ../outside",
    intent: "scope_down"
  },
  {
    id: "rm.recursive-force-paranoid",
    category: "Filesystem",
    label: "rm -rf paranoid mode",
    description: "Blocks non-temp recursive forced removal when paranoid rm is enabled.",
    example: "rm -rf ./cache",
    intent: "scope_down",
    activationCapability: "paranoid_rm"
  },
  {
    id: "powershell.remove-item-root-or-home",
    category: "PowerShell",
    label: "Remove-Item root or home",
    description: "Blocks PowerShell Remove-Item targeting root or home paths.",
    example: "Remove-Item C:\\",
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "powershell.remove-item-recursive-force-root-or-home",
    category: "PowerShell",
    label: "Remove-Item recursive force root or home",
    description: "Blocks recursive forced PowerShell removal of root or home paths.",
    example: "Remove-Item C:\\ -Recurse -Force",
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "powershell.remove-item-git-metadata",
    category: "PowerShell",
    label: "Remove-Item Git metadata",
    description: "Blocks PowerShell removal of protected Git metadata and hooks.",
    example: "Remove-Item .git -Recurse -Force",
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "powershell.remove-item-recursive-force-dynamic-target",
    category: "PowerShell",
    label: "Remove-Item recursive force dynamic target",
    description: "Blocks recursive forced PowerShell removal with dynamic targets in strict mode.",
    example: "Remove-Item $target -Recurse -Force",
    intent: "scope_down",
    activationCapability: "fail_closed"
  },
  {
    id: "powershell.remove-item-recursive-force-home-cwd",
    category: "PowerShell",
    label: "Remove-Item recursive force from home cwd",
    description: "Blocks recursive forced PowerShell removal while working in home.",
    example: "Set-Location $HOME; Remove-Item ./build -Recurse -Force",
    intent: "scope_down"
  },
  {
    id: "powershell.remove-item-recursive-force-cwd-self",
    category: "PowerShell",
    label: "Remove-Item recursive force current directory",
    description: "Blocks recursive forced PowerShell removal of the current directory.",
    example: "Remove-Item . -Recurse -Force",
    intent: "scope_down"
  },
  {
    id: "powershell.remove-item-recursive-force-outside-cwd",
    category: "PowerShell",
    label: "Remove-Item recursive force outside cwd",
    description: "Blocks recursive forced PowerShell removal outside the original cwd.",
    example: "Remove-Item ../outside -Recurse -Force",
    intent: "scope_down"
  },
  {
    id: "powershell.remove-item-recursive-force-paranoid",
    category: "PowerShell",
    label: "Remove-Item recursive force paranoid mode",
    description: "Blocks non-temp recursive forced PowerShell removal when paranoid rm is enabled.",
    example: "Remove-Item ./cache -Recurse -Force",
    intent: "scope_down",
    activationCapability: "paranoid_rm"
  },
  {
    id: "powershell.remove-item-pipeline-dynamic-target",
    category: "PowerShell",
    label: "Remove-Item pipeline dynamic target",
    description: "Blocks PowerShell Remove-Item with unverifiable pipeline input in strict mode.",
    example: "Get-ChildItem . -Recurse | Remove-Item -Force",
    intent: "scope_down",
    activationCapability: "fail_closed"
  },
  {
    id: "powershell.nested-recursive-delete-unread",
    category: "PowerShell",
    label: "Nested PowerShell recursive delete not read",
    description: "Blocks a recursive delete handed to powershell or pwsh in any form other than literal -Command script words.",
    example: "pwsh -WorkingDirectory C:\\ -c 'Remove-Item -Recurse -Force *'",
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "cmd.recursive-delete-root-or-home",
    category: "Command Prompt",
    label: "cmd recursive delete root or home",
    description: "Blocks cmd rmdir /s or del /s of root or home paths.",
    example: "cmd /c rmdir /s /q C:\\",
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "cmd.recursive-delete-escaped-quote",
    category: "Command Prompt",
    label: "cmd recursive delete with escaped quotes",
    description: "Blocks cmd rmdir /s or del /s whose quoting can reach cmd as \\\" and split the target down to the drive root.",
    example: 'cmd /c "rmdir /s /q \\"build output\\""',
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "cmd.recursive-delete-git-metadata",
    category: "Command Prompt",
    label: "cmd recursive delete Git metadata",
    description: "Blocks cmd rmdir /s or del /s of protected Git metadata and hooks.",
    example: "cmd /c rmdir /s /q .git",
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "cmd.recursive-delete-dynamic-target",
    category: "Command Prompt",
    label: "cmd recursive delete dynamic target",
    description: "Blocks cmd rmdir /s or del /s with wildcard or variable targets in strict mode.",
    example: "cmd /c del /s /q *.log",
    intent: "scope_down",
    activationCapability: "fail_closed"
  },
  {
    id: "cmd.recursive-delete-home-cwd",
    category: "Command Prompt",
    label: "cmd recursive delete from home cwd",
    description: "Blocks cmd rmdir /s or del /s while working in home.",
    example: "Set-Location $HOME; cmd /c rmdir /s /q build",
    intent: "scope_down"
  },
  {
    id: "cmd.recursive-delete-cwd-self",
    category: "Command Prompt",
    label: "cmd recursive delete current directory",
    description: "Blocks cmd rmdir /s or del /s of the current directory.",
    example: "cmd /c rmdir /s /q .",
    intent: "scope_down"
  },
  {
    id: "cmd.recursive-delete-outside-cwd",
    category: "Command Prompt",
    label: "cmd recursive delete outside cwd",
    description: "Blocks cmd rmdir /s or del /s outside the original cwd.",
    example: "cmd /c rmdir /s /q ..\\outside",
    intent: "scope_down"
  },
  {
    id: "cmd.recursive-delete-paranoid",
    category: "Command Prompt",
    label: "cmd recursive delete paranoid mode",
    description: "Blocks non-temp cmd rmdir /s or del /s when paranoid rm is enabled.",
    example: "cmd /c rmdir /s /q build",
    intent: "scope_down",
    activationCapability: "paranoid_rm"
  },
  {
    id: "find.delete",
    category: "Filesystem",
    label: "find delete",
    description: "Blocks unsafe find -delete operations.",
    example: "find . -delete",
    intent: "scope_down"
  },
  {
    id: "find.delete-git-metadata",
    category: "Filesystem",
    label: "find delete Git metadata",
    description: "Blocks find -delete operations selecting protected Git metadata and hooks.",
    example: "find .git -delete",
    intent: "hard_stop",
    catastrophic: true
  },
  {
    id: "find.exec-rm-recursive-force",
    category: "Filesystem",
    label: "find exec rm -rf",
    description: "Blocks find -exec rm -rf operations.",
    example: "find . -exec rm -rf {} +",
    intent: "scope_down"
  },
  {
    id: "dd.device-write",
    category: "Filesystem",
    label: "dd device write",
    description: "Blocks dd writing to a /dev device.",
    example: "dd if=/dev/zero of=/dev/sda",
    intent: "manual_only"
  },
  {
    id: "mkfs.device",
    category: "Filesystem",
    label: "mkfs device format",
    description: "Blocks mkfs formatting a /dev device.",
    example: "mkfs.ext4 /dev/sda1",
    intent: "manual_only"
  },
  {
    id: "shred.target",
    category: "Filesystem",
    label: "shred target",
    description: "Blocks shred against any target, including shred --help and shred --version.",
    example: "shred -u secret.txt",
    intent: "use_alternative"
  },
  {
    id: "interpreter.dangerous-command",
    category: "Execution",
    label: "Interpreter dangerous command",
    description: "Blocks interpreter one-liners containing dangerous commands.",
    example: `python -c "import os; os.system('rm -rf /')"`,
    intent: "use_alternative"
  },
  {
    id: "interpreter.one-liner-paranoid",
    category: "Execution",
    label: "Interpreter one-liner paranoid mode",
    description: "Blocks interpreter one-liners when paranoid interpreters is enabled.",
    example: 'python -c "print(1)"',
    intent: "use_alternative",
    activationCapability: "paranoid_interpreters"
  },
  {
    id: "awk.system-dynamic",
    category: "Execution",
    label: "Awk dynamic system call",
    description: "Blocks awk system calls that cannot be safely analyzed.",
    example: "awk '{ system($0) }'",
    intent: "stop_and_explain"
  },
  {
    id: "xargs.rm-recursive-force-dynamic",
    category: "Execution",
    label: "xargs dynamic rm -rf",
    description: "Blocks xargs rm -rf with dynamic input.",
    example: "printf / | xargs rm -rf",
    intent: "scope_down"
  },
  {
    id: "xargs.shell-dynamic",
    category: "Execution",
    label: "xargs dynamic shell",
    description: "Blocks xargs shell execution with dynamic input.",
    example: "xargs r$(printf m) -rf",
    intent: "scope_down"
  },
  {
    id: "parallel.rm-recursive-force-dynamic",
    category: "Execution",
    label: "parallel dynamic rm -rf",
    description: "Blocks parallel rm -rf with dynamic input.",
    example: "printf / | parallel rm -rf",
    intent: "scope_down"
  },
  {
    id: "parallel.shell-dynamic",
    category: "Execution",
    label: "parallel dynamic shell",
    description: "Blocks parallel shell execution with dynamic input.",
    example: "parallel r$(printf m) -rf ::: child",
    intent: "scope_down"
  },
  {
    id: "parallel.command-stream-dynamic",
    category: "Execution",
    label: "parallel dynamic command stream",
    description: "Blocks parallel command streams from dynamic input.",
    example: "parallel --dry-run",
    intent: "scope_down"
  },
  {
    id: "shell.dynamic-structure",
    category: "Execution",
    label: "Dynamic command structure",
    description: "Blocks guarded subcommands and options assembled from substitution output in strict mode.",
    example: "git reset $(printf --hard)",
    intent: "stop_and_explain",
    activationCapability: "fail_closed"
  },
  {
    id: "shell.dynamic-executable",
    category: "Execution",
    label: "Dynamic executable name",
    description: "Blocks executable names assembled from command substitution output in strict mode.",
    example: "$(printf r)m -rf /",
    intent: "manual_only",
    activationCapability: "fail_closed"
  },
  {
    id: "raw-text.dangerous-command",
    category: "Execution",
    label: "Raw text dangerous command",
    description: "Blocks dangerous commands detected in raw command text.",
    example: "git reset --hard 'unterminated",
    intent: "stop_and_explain"
  }
];
var DESTRUCTIVE_COMMAND_RULE_ID_SET = new Set(DESTRUCTIVE_COMMAND_RULE_DEFINITIONS.map((rule) => rule.id));
var DESTRUCTIVE_COMMAND_RULE_METADATA = DESTRUCTIVE_COMMAND_RULE_DEFINITIONS;
var DESTRUCTIVE_COMMAND_RULE_INTENTS = new Map(DESTRUCTIVE_COMMAND_RULE_METADATA.map((rule) => [rule.id, rule.intent]));
function destructiveCommandMatch(id, reason) {
  return {
    id,
    reason,
    intent: DESTRUCTIVE_COMMAND_RULE_INTENTS.get(id) ?? "manual_only"
  };
}
// src/core/shell/heredoc.ts
function readHeredocDelimiter(source, start, end) {
  if (start >= end || isBoundary(source[start] ?? ""))
    return null;
  let delimiter = "";
  let quoted = false;
  let ambiguous = false;
  let i = start;
  while (i < end && !isBoundary(source[i] ?? "")) {
    const char = source[i] ?? "";
    if (char === "'") {
      quoted = true;
      const result = readQuotedDelimiter(source, i + 1, end, "'");
      delimiter += result.text;
      ambiguous ||= !result.closed;
      i = result.next;
      continue;
    }
    if (char === '"') {
      quoted = true;
      const result = readQuotedDelimiter(source, i + 1, end, '"');
      delimiter += result.text;
      ambiguous ||= !result.closed;
      i = result.next;
      continue;
    }
    if (char === "\\") {
      quoted = true;
      const next = source[i + 1];
      if (!next || next === `
` || next === "\r") {
        ambiguous = true;
        break;
      }
      delimiter += next;
      i += 2;
      continue;
    }
    if (char === "`" || source.startsWith("$(", i) || source.startsWith("${", i) || source.startsWith("<(", i) || source.startsWith(">(", i)) {
      ambiguous = true;
    }
    delimiter += char;
    i++;
  }
  return { delimiter, quoted, next: i, ambiguous };
}
function consumeHeredocBodies(source, start, end, pending) {
  const issues = [];
  let cursor = start;
  for (const declaration of pending) {
    const bodyStart = cursor;
    let terminated = false;
    while (cursor < end) {
      const line = readLine(source, cursor, end);
      const comparison = declaration.stripTabs ? line.text.replace(/^\t+/, "") : line.text;
      if (comparison === declaration.delimiter) {
        declaration.attach({
          body: declaration.stripTabs ? stripLeadingTabs(source.slice(bodyStart, cursor)) : source.slice(bodyStart, cursor),
          delimiter: declaration.delimiter,
          quotedDelimiter: declaration.quotedDelimiter,
          bodySpan: { start: bodyStart, end: cursor },
          terminatorSpan: { start: cursor, end: line.contentEnd }
        });
        cursor = line.next;
        terminated = true;
        break;
      }
      if (line.next <= cursor)
        break;
      cursor = line.next;
    }
    if (terminated)
      continue;
    issues.push({
      code: "unterminated-heredoc",
      message: `heredoc delimiter ${declaration.delimiter} was not found`
    });
    return { next: end, issues, terminated: false };
  }
  return { next: cursor, issues, terminated: true };
}
function readQuotedDelimiter(source, start, end, quote) {
  let text = "";
  let i = start;
  while (i < end && source[i] !== `
` && source[i] !== "\r") {
    const char = source[i] ?? "";
    if (char === quote)
      return { text, next: i + 1, closed: true };
    if (quote === '"' && char === "\\" && source[i + 1]) {
      const next = source[i + 1] ?? "";
      text += ["$", "`", '"', "\\"].includes(next) ? next : `\\${next}`;
      i += 2;
      continue;
    }
    text += char;
    i++;
  }
  return { text, next: i, closed: false };
}
function isBoundary(char) {
  return char !== "\r" && (/[\s;&|<>)]/u.test(char) || char === "`");
}
function readLine(source, start, end) {
  let contentEnd = start;
  while (contentEnd < end && source[contentEnd] !== `
`)
    contentEnd++;
  const next = contentEnd >= end ? end : contentEnd + 1;
  return { text: source.slice(start, contentEnd), contentEnd, next };
}
function stripLeadingTabs(body) {
  return body.replace(/(^|\r\n?|\n)\t+/g, "$1");
}

// src/core/shell/model.ts
function isDynamicExecutable(dialect, words) {
  if (dialect !== "powershell") {
    return words[0]?.provenance === "command-substitution";
  }
  const executableIndex = words[0]?.text === "&" || words[0]?.text === "." ? 1 : 0;
  const provenance = words[executableIndex]?.provenance;
  return provenance !== undefined && provenance !== "literal";
}
var ASSIGNMENT_PREFIX = /^[A-Za-z_][A-Za-z0-9_]*=/;
function isBareCallPrefix(word, text) {
  return word?.provenance === "literal" && !word.quoted && word.raw === text && word.text === text;
}
function getCalledCommandName(view) {
  const afterTimeIndex = isBareCallPrefix(view.words[0], "time") ? 1 : 0;
  const afterTimeOptionIndex = afterTimeIndex === 1 && isBareCallPrefix(view.words[afterTimeIndex], "-p") ? afterTimeIndex + 1 : afterTimeIndex;
  const afterTimeTerminatorIndex = afterTimeIndex === 1 && isBareCallPrefix(view.words[afterTimeOptionIndex], "--") ? afterTimeOptionIndex + 1 : afterTimeOptionIndex;
  const commandStartIndex = isBareCallPrefix(view.words[afterTimeTerminatorIndex], "!") ? afterTimeTerminatorIndex + 1 : afterTimeTerminatorIndex;
  const command = view.words.slice(commandStartIndex).find((word) => !ASSIGNMENT_PREFIX.test(word.text));
  return command?.provenance === "literal" ? command.text : undefined;
}
var DEFAULT_COMMAND_PARSER_LIMITS = Object.freeze({
  maxInputLength: 131072,
  maxWords: 16384,
  maxDepth: 64
});
function createCommandAccumulator() {
  return {
    words: [],
    redirections: [],
    nested: [],
    start: -1,
    end: -1,
    reset() {
      this.words = [];
      this.redirections = [];
      this.nested = [];
      this.start = -1;
      this.end = -1;
    }
  };
}
function freezeCommandView(command) {
  return Object.freeze({
    ...command,
    span: Object.freeze(command.span),
    words: Object.freeze(command.words),
    redirections: Object.freeze(command.redirections.map((redirection) => Object.freeze({
      ...redirection,
      span: Object.freeze(redirection.span),
      ...redirection.heredoc ? {
        heredoc: Object.freeze({
          ...redirection.heredoc,
          bodySpan: Object.freeze(redirection.heredoc.bodySpan),
          terminatorSpan: Object.freeze(redirection.heredoc.terminatorSpan)
        })
      } : {}
    }))),
    nested: Object.freeze(command.nested.map((program) => freezeCommandProgram(program)))
  });
}
function appendAccumulatedCommand(nodes, accumulator, command) {
  nodes.push(command);
  accumulator.reset();
}
function createCommandWordParts(source) {
  const parts = [];
  return {
    parts,
    push: (start, end, provenance) => {
      if (end <= start)
        return;
      parts.push({ raw: source.slice(start, end), span: { start, end }, provenance });
    }
  };
}
function freezeCommandWord(word) {
  const parts = word.parts ?? [
    {
      raw: word.raw,
      span: word.span,
      provenance: word.provenance
    }
  ];
  return Object.freeze({
    kind: "word",
    ...word,
    span: Object.freeze(word.span),
    parts: Object.freeze(parts.map((part) => Object.freeze({ ...part, span: Object.freeze(part.span) })))
  });
}
function freezeParsedCommandWord(source, start, end, text, provenance, quoted, parts) {
  return freezeCommandWord({
    text,
    raw: source.slice(start, end),
    span: { start, end },
    provenance,
    quoted,
    ...parts ? { parts } : {}
  });
}
function freezeCommandProgram(program) {
  return Object.freeze({
    ...program,
    span: Object.freeze(program.span),
    issues: Object.freeze(program.issues.map((issue) => Object.freeze({ ...issue }))),
    nodes: Object.freeze(program.nodes.map((node) => {
      if (node.kind === "command")
        return freezeCommandView(node);
      if (node.kind === "group" || node.kind === "function") {
        return Object.freeze({
          ...node,
          span: Object.freeze(node.span),
          body: freezeCommandProgram(node.body)
        });
      }
      return Object.freeze({ ...node, span: Object.freeze(node.span) });
    }))
  });
}

// src/core/shell/posix.ts
var CONTINUATION_CONNECTORS = new Set(["&&", "||", "|", "|&"]);
var RESERVED_COMMAND_PREFIXES = new Set([
  "!",
  "do",
  "elif",
  "else",
  "if",
  "then",
  "until",
  "while"
]);
function parsePosixCommand(source, limits) {
  const span = { start: 0, end: source.length };
  if (source.length > limits.maxInputLength) {
    return freezeCommandProgram({
      kind: "program",
      dialect: "posix",
      source,
      span,
      status: "limited",
      issues: [
        {
          code: "input-limit",
          message: `command exceeds ${limits.maxInputLength} UTF-16 code units`
        }
      ],
      nodes: []
    });
  }
  const parseState = { wordsUsed: 0, maxWords: limits.maxWords, quotedExpansionEnd: Infinity };
  const result = scanSequence(source, 0, source.length, limits, parseState, 0);
  const issues = substitutionFollowsQuotedExpansion(source, parseState.quotedExpansionEnd, result.nodes) ? [...result.issues, QUOTED_PARAMETER_EXPANSION_ISSUE] : result.issues;
  return freezeCommandProgram({
    kind: "program",
    dialect: "posix",
    source,
    span,
    status: getParseStatus(issues, result.limited),
    issues,
    nodes: result.nodes
  });
}
function scanSequence(source, start, end, limits, parseState, depth, closing) {
  const nodes = [];
  const issues = [];
  const accumulator = createCommandAccumulator();
  const pendingHeredocs = [];
  const flushCommand = () => {
    if (accumulator.words.length === 0 && accumulator.redirections.length === 0)
      return;
    const span = { start: accumulator.start, end: accumulator.end };
    const tokens = accumulator.words.map((word) => word.text);
    appendAccumulatedCommand(nodes, accumulator, {
      kind: "command",
      dialect: "posix",
      source: source.slice(span.start, span.end),
      span,
      words: accumulator.words,
      redirections: accumulator.redirections,
      nested: accumulator.nested,
      displayText: issues.length > 0 && nodes.length === 0 ? source.slice(start, end) : tokens.join(" ")
    });
  };
  let i = start;
  while (i < end) {
    const char = source[i];
    if (!char)
      break;
    if (closing && char === closing) {
      flushCommand();
      appendMissingCommandIssue(nodes, issues);
      return {
        nodes,
        issues,
        next: i + 1,
        closed: true,
        limited: false,
        pendingHeredocs
      };
    }
    if (isShellWhitespace(char)) {
      if (char === `
` || char === "\r") {
        flushCommand();
        const connectorEnd = char === "\r" && source[i + 1] === `
` ? i + 2 : i + 1;
        const previous = nodes.at(-1);
        if (previous?.kind !== "connector" || !CONTINUATION_CONNECTORS.has(previous.operator)) {
          nodes.push(Object.freeze({
            kind: "connector",
            operator: source.slice(i, connectorEnd),
            span: Object.freeze({ start: i, end: connectorEnd })
          }));
        }
        if (pendingHeredocs.length > 0) {
          const bodies = consumeHeredocBodies(source, connectorEnd, end, pendingHeredocs.splice(0));
          issues.push(...bodies.issues);
          i = bodies.next;
          continue;
        }
        i = connectorEnd;
        continue;
      }
      i++;
      continue;
    }
    if (char === "#") {
      while (i < end && source[i] !== `
` && source[i] !== "\r")
        i++;
      continue;
    }
    const functionOpening = accumulator.start === -1 ? readFunctionOpening(source, i, end) : undefined;
    if (functionOpening) {
      appendMissingConnectorIssue(nodes, issues);
      if (depth >= limits.maxDepth) {
        return limitedResult(nodes, issues, i, "depth-limit", limits.maxDepth);
      }
      if (!consumeWord(parseState)) {
        return limitedResult(nodes, issues, i, "word-limit", limits.maxWords);
      }
      const inner = scanSequence(source, functionOpening.braceIndex + 1, end, limits, parseState, depth + 1, "}");
      const functionEnd = inner.next;
      const bodySpan = {
        start: functionOpening.braceIndex + 1,
        end: inner.closed ? functionEnd - 1 : functionEnd
      };
      const body = buildNestedCommandProgram(source, bodySpan, inner);
      nodes.push({
        kind: "function",
        name: functionOpening.name,
        span: { start: i, end: functionEnd },
        body
      });
      issues.push(...inner.issues);
      if (inner.pendingHeredocs.length > 0 || containsHeredoc(inner.nodes)) {
        issues.push({
          code: "unsupported-heredoc-context",
          message: "heredocs attached inside function bodies are not supported safely"
        });
      }
      pendingHeredocs.push(...inner.pendingHeredocs);
      if (inner.limited)
        return propagatedLimitResult(nodes, issues, inner.next);
      if (!inner.closed) {
        issues.push({
          code: "unclosed-function-body",
          message: "function body is not closed"
        });
      }
      i = functionEnd;
      continue;
    }
    const connector = readConnector(source, i);
    if (connector) {
      flushCommand();
      if (!isExecutableNode(nodes.at(-1))) {
        issues.push({
          code: "unexpected-connector",
          message: `connector ${connector} has no preceding command`
        });
      }
      nodes.push(Object.freeze({
        kind: "connector",
        operator: connector,
        span: Object.freeze({ start: i, end: i + connector.length })
      }));
      i += connector.length;
      continue;
    }
    if (char === ")") {
      flushCommand();
      issues.push({
        code: "unexpected-closing-delimiter",
        message: "closing parenthesis has no matching opening parenthesis"
      });
      nodes.push({ kind: "unknown", source: char, span: { start: i, end: i + 1 } });
      i++;
      continue;
    }
    if ((char === "(" || char === "{" && isBraceGroupOpening(source, i, end)) && accumulator.start === -1) {
      appendMissingConnectorIssue(nodes, issues);
      if (depth >= limits.maxDepth) {
        return limitedResult(nodes, issues, i, "depth-limit", limits.maxDepth);
      }
      const close = char === "(" ? ")" : "}";
      const inner = scanSequence(source, i + 1, end, limits, parseState, depth + 1, close);
      const groupEnd = inner.next;
      const bodySpan = { start: i + 1, end: inner.closed ? groupEnd - 1 : groupEnd };
      const body = buildNestedCommandProgram(source, bodySpan, inner);
      nodes.push({
        kind: "group",
        style: char === "(" ? "subshell" : "brace",
        span: { start: i, end: groupEnd },
        body
      });
      issues.push(...inner.issues);
      if (inner.pendingHeredocs.length > 0 || containsHeredoc(inner.nodes)) {
        issues.push({
          code: "unsupported-heredoc-context",
          message: "heredocs attached inside command groups are not supported safely"
        });
      }
      pendingHeredocs.push(...inner.pendingHeredocs);
      if (inner.limited)
        return propagatedLimitResult(nodes, issues, inner.next);
      if (!inner.closed) {
        issues.push({
          code: char === "(" ? "unclosed-subshell" : "unclosed-brace-group",
          message: `${char} group is not closed`
        });
      }
      i = groupEnd;
      continue;
    }
    const redirect = (char === "<" || char === ">") && source[i + 1] !== "(" ? readRedirect(source, i) : null;
    if (redirect) {
      const prior = accumulator.words.at(-1);
      const attachedFd = prior && prior.span.end === i && /^[0-9]+$/.test(prior.raw) ? Number(prior.raw) : undefined;
      if (attachedFd !== undefined)
        accumulator.words.pop();
      const redirectStart = attachedFd === undefined ? i : prior?.span.start ?? i;
      accumulator.start = accumulator.start === -1 ? i : accumulator.start;
      let targetStart = i + redirect.length;
      while (targetStart < end && /[ \t]/.test(source[targetStart] ?? ""))
        targetStart++;
      const targetChar = source[targetStart];
      const targetStartsComment = targetStart > i + redirect.length && targetChar === "#";
      const targetIsBoundary = !targetChar || isShellWhitespace(targetChar) || !!readConnector(source, targetStart) || targetChar === closing || targetChar === ")" || targetStartsComment || (targetChar === "<" || targetChar === ">") && source[targetStart + 1] !== "(";
      const heredocRedirect = redirect === "<<" || redirect === "<<-";
      const delimiter = heredocRedirect ? readHeredocDelimiter(source, targetStart, end) : undefined;
      const targetResult = delimiter ? {
        word: freezeParsedCommandWord(source, targetStart, delimiter.next, delimiter.delimiter, "literal", delimiter.quoted),
        nested: [],
        issues: [],
        next: delimiter.next,
        limited: false
      } : !targetIsBoundary ? readWord(source, targetStart, end, limits, parseState, depth) : undefined;
      if (targetResult) {
        issues.push(...targetResult.issues);
        if (targetResult.limited) {
          return propagatedLimitResult(nodes, issues, targetResult.next);
        }
        if (!consumeWord(parseState)) {
          return limitedResult(nodes, issues, targetResult.next, "word-limit", limits.maxWords);
        }
      }
      const redirectEnd = targetResult?.next ?? i + redirect.length;
      const redirection = {
        kind: "redirection",
        operator: redirect,
        span: { start: redirectStart, end: redirectEnd },
        ...attachedFd === undefined ? {} : { fd: attachedFd },
        ...targetResult ? { target: targetResult.word } : {}
      };
      accumulator.redirections.push(redirection);
      if (heredocRedirect && !delimiter) {
        issues.push({
          code: "missing-heredoc-delimiter",
          message: "heredoc redirection requires a delimiter word"
        });
      }
      if (delimiter) {
        if (delimiter.ambiguous || delimiter.delimiter.length === 0) {
          issues.push({
            code: "ambiguous-heredoc-delimiter",
            message: "heredoc delimiter cannot be determined safely"
          });
        }
        const nested = accumulator.nested;
        pendingHeredocs.push({
          delimiter: delimiter.delimiter,
          quotedDelimiter: delimiter.quoted,
          stripTabs: redirect === "<<-",
          attach: (heredoc) => {
            redirection.heredoc = heredoc;
            if (heredoc.quotedDelimiter)
              return;
            const body = readHeredocBodySubstitutions(source, heredoc.bodySpan.start, heredoc.bodySpan.end, limits, parseState, depth + 1);
            nested.push(...body.programs);
            issues.push(...body.issues);
          }
        });
      }
      if (!heredocRedirect && !targetResult) {
        issues.push({
          code: "missing-redirection-target",
          message: `redirection ${redirect} requires a target word`
        });
      }
      if (targetResult) {
        accumulator.nested.push(...targetResult.nested);
      }
      accumulator.end = redirectEnd;
      i = redirectEnd;
      continue;
    }
    const commandStart = accumulator.start === -1;
    if (commandStart)
      appendMissingConnectorIssue(nodes, issues);
    const wordResult = readWord(source, i, end, limits, parseState, depth);
    issues.push(...wordResult.issues);
    if (wordResult.limited) {
      return propagatedLimitResult(nodes, issues, wordResult.next);
    }
    const expanded = isCommandWordPosition(accumulator.words) ? expandLiteralCommandWord(source, wordResult.word, parseState.maxWords - parseState.wordsUsed, limits.maxDepth, limits.maxInputLength) : undefined;
    if (expanded?.limitCode) {
      return limitedResult(nodes, issues, wordResult.next, expanded.limitCode, expanded.limitCode === "word-limit" ? limits.maxWords : expanded.limitCode === "depth-limit" ? limits.maxDepth : limits.maxInputLength);
    }
    const words = expanded?.words ?? [wordResult.word];
    for (const word of words) {
      if (!consumeWord(parseState)) {
        return limitedResult(nodes, issues, wordResult.next, "word-limit", limits.maxWords);
      }
      accumulator.words.push(word);
    }
    accumulator.start = accumulator.start === -1 ? i : accumulator.start;
    accumulator.end = wordResult.next;
    accumulator.nested.push(...wordResult.nested);
    if (commandStart && isReservedCommandPrefix(wordResult.word))
      flushCommand();
    i = wordResult.next > i ? wordResult.next : i + 1;
  }
  flushCommand();
  appendMissingCommandIssue(nodes, issues);
  issues.push(...unterminatedHeredocIssues(pendingHeredocs));
  return {
    nodes,
    issues,
    next: i,
    closed: closing === undefined,
    limited: false,
    pendingHeredocs: []
  };
}
function buildNestedCommandProgram(source, span, result) {
  return {
    kind: "program",
    dialect: "posix",
    source: source.slice(span.start, span.end),
    span,
    status: getParseStatus(result.issues, result.limited),
    issues: result.issues,
    nodes: result.nodes
  };
}
function readWord(source, start, end, limits, parseState, depth) {
  let text = "";
  let i = start;
  let quoted = false;
  let provenance = "literal";
  const nested = [];
  const issues = [];
  let limited = false;
  while (i < end) {
    const char = source[i];
    const processSubstitution = (char === "<" || char === ">") && source[i + 1] === "(";
    if (!char || isShellWhitespace(char) || (char === ";" || char === "|" || char === "&") && readConnector(source, i) || (char === "<" || char === ">") && !processSubstitution) {
      break;
    }
    if (char === ")")
      break;
    if (char === "'") {
      quoted = true;
      const close = source.indexOf("'", i + 1);
      if (close === -1 || close >= end) {
        text += source.slice(i + 1, end);
        issues.push({
          code: "unclosed-single-quote",
          message: "single-quoted word is not closed"
        });
        i = end;
        break;
      }
      text += source.slice(i + 1, close);
      i = close + 1;
      continue;
    }
    if (char === '"') {
      quoted = true;
      const result = readDoubleQuoted(source, i, end, limits, parseState, depth);
      text += result.text;
      nested.push(...result.nested);
      issues.push(...result.issues);
      limited ||= result.limited;
      provenance = mergeProvenance(provenance, result.provenance);
      i = result.next;
      if (limited)
        break;
      continue;
    }
    if (source.startsWith("$'", i)) {
      quoted = true;
      const ansi = readAnsiCString(source, i + 2, end);
      text += ansi.text;
      issues.push(...ansi.issues);
      if (!ansi.closed) {
        issues.push({
          code: "unclosed-ansi-c-quote",
          message: "ANSI-C quoted word is not closed"
        });
      }
      i = ansi.next;
      continue;
    }
    if (char === "\\") {
      const next = source[i + 1];
      if (!next) {
        issues.push({
          code: "trailing-escape",
          message: "escape has no following character"
        });
        i++;
        break;
      }
      if (next === `
`) {
        i += 2;
        continue;
      }
      text += next;
      i += 2;
      continue;
    }
    if (opensFunctionSubstitution(source, i))
      issues.push(FUNCTION_SUBSTITUTION_ISSUE);
    const substitution = char === "$" || char === "<" || char === ">" || char === "`" ? readSubstitution(source, i, end, limits, parseState, depth) : null;
    const collected = substitution ? collectSubstitution(substitution, nested, issues) : readParameterExpansion(source, i, end, limits, parseState, depth, nested, issues);
    if (collected) {
      if (collected.provenance === "variable")
        text += source.slice(i, collected.next);
      limited ||= collected.limited;
      provenance = mergeProvenance(provenance, collected.provenance);
      i = collected.next;
      if (limited)
        break;
      continue;
    }
    if (char === "$") {
      const variable = appendVariable(source, i, end, text, provenance);
      text = variable.text;
      provenance = variable.provenance;
      i = variable.next;
      continue;
    }
    if (char === "*" || char === "?" || char === "[") {
      provenance = mergeProvenance(provenance, "glob");
    }
    text += char;
    i++;
  }
  return {
    word: freezeParsedCommandWord(source, start, i, text, provenance, quoted, provenance === "literal" ? undefined : derivePosixWordParts(source, start, i)),
    nested,
    issues,
    next: i,
    limited
  };
}
function readDoubleQuoted(source, start, end, limits, parseState, depth) {
  let text = "";
  let provenance = "literal";
  const nested = [];
  const issues = [];
  let limited = false;
  let i = start + 1;
  while (i < end) {
    const char = source[i];
    if (char === '"') {
      return { text, provenance, nested, issues, next: i + 1, limited };
    }
    if (char === "\\" && source[i + 1]) {
      const escaped = source[i + 1] ?? "";
      if (escaped === `
`) {
        i += 2;
        continue;
      }
      if (escaped === "\r" && source[i + 2] === `
`) {
        i += 3;
        continue;
      }
      text += ["$", "`", '"', "\\"].includes(escaped) ? escaped : `\\${escaped}`;
      i += 2;
      continue;
    }
    if (opensFunctionSubstitution(source, i))
      issues.push(FUNCTION_SUBSTITUTION_ISSUE);
    const substitution = readSubstitution(source, i, end, limits, parseState, depth);
    const collected = substitution ? collectSubstitution(substitution, nested, issues) : readParameterExpansion(source, i, end, limits, parseState, depth, nested, issues);
    if (collected) {
      if (collected.provenance !== "command-substitution")
        text += source.slice(i, collected.next);
      i = collected.next;
      limited ||= collected.limited;
      provenance = mergeProvenance(provenance, collected.provenance);
      if (limited)
        return { text, provenance, nested, issues, next: i, limited };
      continue;
    }
    if (char === "$") {
      const variable = appendVariable(source, i, end, text, provenance);
      text = variable.text;
      provenance = variable.provenance;
      i = variable.next;
      continue;
    }
    text += char ?? "";
    i++;
  }
  issues.push({
    code: "unclosed-double-quote",
    message: "double-quoted word is not closed"
  });
  return { text, provenance, nested, issues, next: end, limited };
}
function readSubstitution(source, start, end, limits, parseState, depth) {
  const opening = readSubstitutionOpening(source, start);
  if (!opening)
    return null;
  const openLength = opening.length;
  const closing = opening.closing;
  const arithmetic = closing === "))";
  const backtick = closing === "`";
  const process = source[start] === "<" || source[start] === ">";
  const close = findSubstitutionEnd(source, start + openLength, end, closing);
  const innerEnd = close === -1 ? end : close;
  const next = close === -1 ? end : close + closing.length;
  if (depth >= limits.maxDepth) {
    return {
      program: limitedProgram(source, start + openLength, innerEnd, "depth-limit"),
      next,
      provenance: arithmetic ? "arithmetic" : "command-substitution"
    };
  }
  if (arithmetic) {
    const arithmeticNodes = [];
    const arithmeticIssues = [];
    let arithmeticLimited = false;
    let cursor = start + openLength;
    while (cursor < innerEnd) {
      const nestedSubstitution = readSubstitution(source, cursor, innerEnd, limits, parseState, depth + 1);
      if (!nestedSubstitution) {
        if (opensFunctionSubstitution(source, cursor))
          arithmeticIssues.push(FUNCTION_SUBSTITUTION_ISSUE);
        cursor++;
        continue;
      }
      arithmeticNodes.push(...nestedSubstitution.program.nodes);
      arithmeticIssues.push(...nestedSubstitution.program.issues);
      arithmeticLimited ||= nestedSubstitution.program.status === "limited";
      cursor = nestedSubstitution.next;
      if (arithmeticLimited)
        break;
    }
    if (close === -1) {
      arithmeticIssues.push({
        code: "unclosed-arithmetic",
        message: "$(( substitution is not closed"
      });
    }
    return {
      program: freezeCommandProgram({
        kind: "program",
        dialect: "posix",
        source: source.slice(start + openLength, innerEnd),
        span: { start: start + openLength, end: innerEnd },
        status: getParseStatus(arithmeticIssues, arithmeticLimited),
        issues: arithmeticIssues,
        nodes: arithmeticNodes
      }),
      next,
      provenance: "arithmetic"
    };
  }
  const inner = scanSequence(source, start + openLength, innerEnd, limits, parseState, depth + 1);
  const substitutionIssue = close === -1 ? [
    {
      code: "unclosed-command-substitution",
      message: `${source.slice(start, start + openLength)} substitution is not closed`
    }
  ] : [];
  const contextIssue = (backtick || process) && containsHeredoc(inner.nodes) ? [
    {
      code: "unsupported-heredoc-context",
      message: "heredocs are supported only in ordinary commands and $(...) substitutions"
    }
  ] : [];
  const escapeIssue = backtick && /\\[\\$`\n]/.test(source.slice(start + openLength, innerEnd)) ? [BACKTICK_ESCAPE_ISSUE] : [];
  const issues = [...inner.issues, ...substitutionIssue, ...contextIssue, ...escapeIssue];
  return {
    program: freezeCommandProgram({
      kind: "program",
      dialect: "posix",
      source: source.slice(start + openLength, innerEnd),
      span: { start: start + openLength, end: innerEnd },
      status: getParseStatus(issues, inner.limited),
      issues,
      nodes: inner.nodes
    }),
    next,
    provenance: "command-substitution"
  };
}
function readHeredocBodySubstitutions(source, start, end, limits, parseState, depth) {
  const programs = [];
  const issues = [];
  let i = start;
  while (i < end) {
    const char = source[i];
    if (char === "\\") {
      i += 2;
      continue;
    }
    const substitution = char === "$" || char === "`" ? readSubstitution(source, i, end, limits, parseState, depth) : null;
    if (!substitution) {
      if (opensFunctionSubstitution(source, i))
        issues.push(FUNCTION_SUBSTITUTION_ISSUE);
      i++;
      continue;
    }
    programs.push(substitution.program);
    if (containsFunctionSubstitutionOpener(source, i, substitution.next) && mayRunFunctionSubstitution(substitution.program)) {
      issues.push(FUNCTION_SUBSTITUTION_ISSUE);
    }
    i = substitution.next;
  }
  return { programs, issues };
}
function collectSubstitution(substitution, nested, issues) {
  nested.push(substitution.program);
  issues.push(...substitution.program.issues);
  return {
    provenance: substitution.provenance,
    next: substitution.next,
    limited: substitution.program.status === "limited"
  };
}
function findSubstitutionEnd(source, start, end, closing) {
  if (closing === "`") {
    for (let i = start;i < end; i++) {
      if (source[i] === "\\") {
        i++;
        continue;
      }
      if (source[i] === "`")
        return i;
    }
    return -1;
  }
  let lexicalState = { single: false, double: false };
  const enclosing = [];
  const pendingHeredocs = [];
  for (let i = start;i < end; i++) {
    const char = source[i];
    if ((char === `
` || char === "\r") && pendingHeredocs.length > 0) {
      const lineEnd = char === "\r" && source[i + 1] === `
` ? i + 2 : i + 1;
      const bodies = consumeHeredocBodies(source, lineEnd, end, pendingHeredocs.splice(0));
      if (!bodies.terminated)
        return -1;
      i = bodies.next - 1;
      continue;
    }
    const lexicalEnd = scanLexicalQuoteOrComment(source, i, start, end, lexicalState);
    if (lexicalEnd !== null) {
      i = lexicalEnd;
      continue;
    }
    if (!lexicalState.double && source.startsWith("$((", i)) {
      const arithmeticClose = findArithmeticEnd(source, i + 3, end);
      if (arithmeticClose === -1)
        return -1;
      i = arithmeticClose + 1;
      continue;
    }
    if (closing === ")" && !lexicalState.double && char === "<" && source[i + 1] === "<" && source[i + 2] !== "<") {
      const stripTabs = source[i + 2] === "-";
      let targetStart = i + (stripTabs ? 3 : 2);
      while (targetStart < end && /[ \t]/.test(source[targetStart] ?? ""))
        targetStart++;
      const delimiter = readHeredocDelimiter(source, targetStart, end);
      if (delimiter) {
        pendingHeredocs.push({
          delimiter: delimiter.delimiter,
          quotedDelimiter: delimiter.quoted,
          stripTabs,
          attach: () => {
            return;
          }
        });
        i = delimiter.next - 1;
        continue;
      }
    }
    if (source.startsWith("$(", i) && !source.startsWith("$((", i)) {
      enclosing.push(lexicalState);
      lexicalState = { single: false, double: false };
      i++;
      continue;
    }
    if (char === "(" && !lexicalState.double) {
      enclosing.push(lexicalState);
      lexicalState = { single: false, double: false };
      continue;
    }
    if (char !== ")" || lexicalState.double)
      continue;
    const parent = enclosing.pop();
    if (parent) {
      lexicalState = parent;
      continue;
    }
    return closing === "))" && source[i + 1] !== ")" ? -1 : i;
  }
  return -1;
}
function findArithmeticEnd(source, start, end) {
  let depth = 1;
  const lexicalState = { single: false, double: false };
  for (let i = start;i < end; i++) {
    const char = source[i];
    const lexicalEnd = scanLexicalQuoteOrComment(source, i, start, end, lexicalState);
    if (lexicalEnd !== null) {
      i = lexicalEnd;
      continue;
    }
    if (source.startsWith("$(", i) && !source.startsWith("$((", i)) {
      depth++;
      i++;
      continue;
    }
    if (char === "(" && !lexicalState.double)
      depth++;
    if (char !== ")" || lexicalState.double)
      continue;
    depth--;
    if (depth === 0)
      return source[i + 1] === ")" ? i : -1;
  }
  return -1;
}
function scanLexicalQuoteOrComment(source, index, start, end, state) {
  const char = source[index];
  if (char === "\\" && !state.single)
    return index + 1;
  if (!state.double && char === "'")
    state.single = !state.single;
  if (!state.single && char === '"')
    state.double = !state.double;
  if (state.single)
    return index;
  if (state.double || char !== "#" || !isCommentStart(source, index, start))
    return null;
  let commentEnd = index;
  while (commentEnd + 1 < end && source[commentEnd + 1] !== `
` && source[commentEnd + 1] !== "\r") {
    commentEnd++;
  }
  return commentEnd;
}
function readConnector(source, index) {
  const char = source[index];
  if (char === ";")
    return ";";
  if (char === "&")
    return source[index + 1] === "&" ? "&&" : "&";
  if (char === "|")
    return source[index + 1] === "|" ? "||" : source[index + 1] === "&" ? "|&" : "|";
  return null;
}
function readRedirect(source, index) {
  const char = source[index];
  if (char === ">") {
    if (source[index + 1] === ">")
      return ">>";
    if (source[index + 1] === "&")
      return ">&";
    return source[index + 1] === "|" ? ">|" : ">";
  }
  if (char !== "<")
    return null;
  if (source.startsWith("<<<", index))
    return "<<<";
  if (source.startsWith("<<-", index))
    return "<<-";
  if (source[index + 1] === "<")
    return "<<";
  if (source[index + 1] === "&")
    return "<&";
  if (source[index + 1] === ">")
    return "<>";
  return "<";
}
function isShellWhitespace(char) {
  const code = char.charCodeAt(0);
  if (code === 32 || code >= 9 && code <= 13)
    return true;
  if (code < 128)
    return false;
  return /\s/u.test(char);
}
var FUNCTION_SUBSTITUTION_ISSUE = Object.freeze({
  code: "unsupported-function-substitution",
  message: "${ list; } function substitutions run in the current shell and cannot be analyzed"
});
function opensFunctionSubstitution(source, start) {
  if (source[start] !== "$")
    return false;
  const brace = skipLineContinuations(source, start + 1);
  if (source[brace] !== "{")
    return false;
  const next = source[skipLineContinuations(source, brace + 1)] ?? "";
  return next === "|" || isShellWhitespace(next);
}
function containsFunctionSubstitutionOpener(source, start, end) {
  for (let k = source.indexOf("$", start);k !== -1 && k < end; k = source.indexOf("$", k + 1)) {
    if (opensFunctionSubstitution(source, k))
      return true;
  }
  return false;
}
function mayRunFunctionSubstitution(program) {
  return program?.status === "limited" || (program?.issues ?? []).some((issue) => issue.code === FUNCTION_SUBSTITUTION_ISSUE.code);
}
function skipLineContinuations(source, start) {
  let index = start;
  while (source.startsWith("\\\n", index) || source.startsWith(`\\\r
`, index)) {
    index += source[index + 1] === "\r" ? 3 : 2;
  }
  return index;
}
function readSubstitutionOpening(source, start) {
  if (source.startsWith("$((", start))
    return { length: 3, closing: "))" };
  if (source.startsWith("$(", start) || source.startsWith("<(", start) || source.startsWith(">(", start)) {
    return { length: 2, closing: ")" };
  }
  return source[start] === "`" ? { length: 1, closing: "`" } : null;
}
var UNCLOSED_PARAMETER_EXPANSION_ISSUE = Object.freeze({
  code: "unclosed-parameter-expansion",
  message: "${ parameter expansion is not closed"
});
var QUOTED_PARAMETER_EXPANSION_ISSUE = Object.freeze({
  code: "unsupported-parameter-expansion",
  message: "a line continuation inside ${ }, or a quote or backslash inside ${ } with a substitution in or after it, cannot be analyzed"
});
var SUBSTITUTION_OPENER = /\$\(|`|[<>]\(/g;
function substitutionFollowsQuotedExpansion(source, quotedExpansionEnd, nodes) {
  const heredocBodies = heredocBodySpans(nodes);
  return [...source.slice(quotedExpansionEnd).matchAll(SUBSTITUTION_OPENER)].some((match) => {
    const index = quotedExpansionEnd + match.index;
    return !heredocBodies.some((body) => index >= body.start && index < body.end);
  });
}
function heredocBodySpans(nodes) {
  return nodes.flatMap((node) => {
    if (node.kind === "command") {
      return [
        ...node.redirections.flatMap((redirection) => redirection.heredoc ? [redirection.heredoc.bodySpan] : []),
        ...node.nested.flatMap((program) => heredocBodySpans(program.nodes))
      ];
    }
    return node.kind === "group" || node.kind === "function" ? heredocBodySpans(node.body.nodes) : [];
  });
}
var BACKTICK_ESCAPE_ISSUE = Object.freeze({
  code: "unsupported-backtick-escape",
  message: "a backslash escape inside backticks changes the command the shell runs and cannot be analyzed"
});
function readParameterExpansion(source, start, end, limits, parseState, depth, nested, issues) {
  if (source[start] !== "$" || source[start + 1] !== "{")
    return null;
  const expansion = scanParameterExpansion(source, start + 2, end);
  const next = expansion.close === -1 ? end : expansion.close + 1;
  if (expansion.close === -1)
    issues.push(UNCLOSED_PARAMETER_EXPANSION_ISSUE);
  if (expansion.quoted && expansion.substitutions.length > 0 || expansion.continued) {
    issues.push(QUOTED_PARAMETER_EXPANSION_ISSUE);
  }
  if (expansion.quoted)
    parseState.quotedExpansionEnd = Math.min(parseState.quotedExpansionEnd, next);
  const limited = expansion.substitutions.some((index) => {
    if (opensFunctionSubstitution(source, index)) {
      issues.push(FUNCTION_SUBSTITUTION_ISSUE);
      return false;
    }
    const substitution = readSubstitution(source, index, next, limits, parseState, depth);
    return substitution !== null && collectSubstitution(substitution, nested, issues).limited;
  });
  return { provenance: "variable", next, limited };
}
function scanParameterExpansion(source, start, end) {
  const substitutions = [];
  let quoted = false;
  let continued = false;
  let nesting = 1;
  let i = start;
  while (i < end) {
    const char = source[i];
    if (char === "$" && opensFunctionSubstitution(source, i))
      substitutions.push(i);
    if (char === "\\" || char === "'" || char === '"') {
      quoted = true;
      continued ||= char === "\\" && source[i + 1] === `
`;
      i += char === "\\" ? 2 : 1;
      continue;
    }
    const opening = readSubstitutionOpening(source, i);
    if (opening) {
      substitutions.push(i);
      const close = findSubstitutionEnd(source, i + opening.length, end, opening.closing);
      if (close === -1)
        break;
      i = close + opening.closing.length;
      continue;
    }
    if (char === "$" && source[i + 1] === "{") {
      nesting++;
      i += 2;
      continue;
    }
    if (char === "}" && --nesting === 0)
      return { close: i, substitutions, quoted, continued };
    i++;
  }
  return { close: -1, substitutions, quoted, continued };
}
function readVariableEnd(source, start, end) {
  if (source[start + 1] === "{") {
    const close = scanParameterExpansion(source, start + 2, end).close;
    return close === -1 ? end : close + 1;
  }
  if (source[start + 1] === "$")
    return start + 2;
  let i = start + 1;
  while (i < end && /[A-Za-z0-9_?@#!*-]/.test(source[i] ?? ""))
    i++;
  return i === start + 1 ? start + 1 : i;
}
function readAnsiCString(source, start, end) {
  let text = "";
  const issues = [];
  let i = start;
  while (i < end) {
    const char = source[i];
    if (char === "'")
      return { text, next: i + 1, closed: true, issues };
    if (char !== "\\") {
      text += char ?? "";
      i++;
      continue;
    }
    const decoded = readAnsiEscape(source, i + 1, end);
    text += decoded.text;
    if (decoded.invalidCodePoint !== undefined) {
      issues.push({
        code: "invalid-ansi-c-code-point",
        message: `ANSI-C escape is not a valid Unicode scalar value: ${decoded.invalidCodePoint}`
      });
    }
    i = decoded.next;
  }
  return { text, next: end, closed: false, issues };
}
function readAnsiEscape(source, start, end) {
  const char = source[start];
  if (!char || start >= end)
    return { text: "\\", next: start };
  const simple = new Map([
    ["a", "\x07"],
    ["b", "\b"],
    ["e", "\x1B"],
    ["E", "\x1B"],
    ["f", "\f"],
    ["n", `
`],
    ["r", "\r"],
    ["t", "\t"],
    ["v", "\v"],
    ["\\", "\\"],
    ["'", "'"],
    ['"', '"']
  ]);
  if (simple.has(char))
    return { text: simple.get(char) ?? char, next: start + 1 };
  if (char === "x")
    return readFixedBaseEscape(source, start + 1, end, 16, 2, start + 1);
  if (char === "u")
    return readFixedBaseEscape(source, start + 1, end, 16, 4, start + 1);
  if (char === "U")
    return readFixedBaseEscape(source, start + 1, end, 16, 8, start + 1);
  if (/[0-7]/.test(char))
    return readFixedBaseEscape(source, start, end, 8, 3, start + 1);
  return { text: char, next: start + 1 };
}
function readFixedBaseEscape(source, start, end, base, maxLength, fallbackNext) {
  const digitPattern = base === 16 ? /[0-9a-fA-F]/ : /[0-7]/;
  let digits = "";
  let i = start;
  while (i < end && digits.length < maxLength && digitPattern.test(source[i] ?? "")) {
    digits += source[i];
    i++;
  }
  if (!digits)
    return { text: source[fallbackNext - 1] ?? "", next: fallbackNext };
  const codePoint = Number.parseInt(digits, base);
  return codePoint > 1114111 || codePoint >= 55296 && codePoint <= 57343 ? { text: "�", next: i, invalidCodePoint: codePoint } : { text: String.fromCodePoint(codePoint), next: i };
}
function getParseStatus(issues, limited = false) {
  if (limited)
    return "limited";
  if (issues.some((issue) => issue.code === "invalid-ansi-c-code-point" || issue.code === "missing-heredoc-delimiter" || issue.code === "ambiguous-heredoc-delimiter" || issue.code === "unterminated-heredoc" || issue.code === "unsupported-heredoc-context" || issue.code === "unsupported-function-substitution" || issue.code === "unsupported-backtick-escape" || issue.code === "unclosed-parameter-expansion" || issue.code === "unsupported-parameter-expansion")) {
    return "invalid";
  }
  return issues.length > 0 ? "partial" : "complete";
}
function appendVariable(source, start, end, text, provenance) {
  const next = readVariableEnd(source, start, end);
  return {
    text: text + source.slice(start, next),
    provenance: mergeProvenance(provenance, "variable"),
    next
  };
}
function derivePosixWordParts(source, start, end) {
  const collector = createCommandWordParts(source);
  let literalStart = start;
  let single = false;
  let double = false;
  let i = start;
  while (i < end) {
    const char = source[i];
    if (char === "\\" && !single) {
      i += 2;
      continue;
    }
    if (!double && char === "'") {
      single = !single;
      i++;
      continue;
    }
    if (!single && char === '"') {
      double = !double;
      i++;
      continue;
    }
    if (single) {
      i++;
      continue;
    }
    const arithmetic = source.startsWith("$((", i);
    const command = source.startsWith("$(", i) && !arithmetic;
    const process = !double && (source.startsWith("<(", i) || source.startsWith(">(", i));
    const backtick = char === "`";
    if (arithmetic || command || process || backtick) {
      const openLength = arithmetic ? 3 : backtick ? 1 : 2;
      const closing = arithmetic ? "))" : backtick ? "`" : ")";
      const close = findSubstitutionEnd(source, i + openLength, end, closing);
      const next = close === -1 ? end : close + closing.length;
      collector.push(literalStart, i, "literal");
      collector.push(i, next, arithmetic ? "arithmetic" : "command-substitution");
      i = next;
      literalStart = next;
      continue;
    }
    if (char === "$") {
      const next = readVariableEnd(source, i, end);
      if (next > i + 1) {
        collector.push(literalStart, i, "literal");
        collector.push(i, next, "variable");
        i = next;
        literalStart = next;
        continue;
      }
    }
    if (!double && (char === "*" || char === "?" || char === "[")) {
      collector.push(literalStart, i, "literal");
      collector.push(i, i + 1, "glob");
      i++;
      literalStart = i;
      continue;
    }
    i++;
  }
  collector.push(literalStart, end, "literal");
  return collector.parts;
}
function mergeProvenance(current, next) {
  if (next === "command-substitution" || current === "command-substitution") {
    return "command-substitution";
  }
  if (next === "arithmetic" || current === "arithmetic")
    return "arithmetic";
  if (next === "variable" || current === "variable")
    return "variable";
  if (next === "glob" || current === "glob")
    return "glob";
  return current;
}
function isBraceGroupOpening(source, start, end) {
  return start + 1 >= end || isShellWhitespace(source[start + 1] ?? "") || readConnector(source, start + 1) !== null;
}
var ENV_WRAPPER_OPTIONS_WITH_VALUE = new Set([
  "-u",
  "--unset",
  "-C",
  "--chdir",
  "-S",
  "--split-string",
  "-P"
]);
var SUDO_WRAPPER_OPTIONS_WITH_VALUE = new Set([
  "-u",
  "-g",
  "-C",
  "-D",
  "-h",
  "-p",
  "-r",
  "-t",
  "-T",
  "-U"
]);
function isCommandWordPosition(words) {
  let index = 0;
  while (index <= words.length) {
    while (/^[A-Za-z_][A-Za-z0-9_]*=/.test(words[index]?.text ?? ""))
      index++;
    if (index === words.length)
      return true;
    const next = getStandardWrapperPrefixEnd(words, index);
    if (next === undefined || next === null)
      return false;
    index = next;
  }
  return false;
}
function getStandardWrapperPrefixEnd(words, start) {
  const wrapper = words[start]?.text.toLowerCase();
  if (wrapper === "command")
    return getCommandPrefixEnd(words, start);
  if (wrapper === "env")
    return getEnvPrefixEnd(words, start);
  if (wrapper === "sudo")
    return getSudoPrefixEnd(words, start);
  return;
}
function getCommandPrefixEnd(words, start) {
  if (words[start + 1]?.text === "-v")
    return null;
  for (let index = start + 1;index < words.length; index++) {
    const token = words[index]?.text ?? "";
    if (token === "--")
      return index + 1;
    if (token === "-p" || token === "-v" || token === "-V" || /^-[pvV]+$/.test(token))
      continue;
    return index;
  }
  return words.length;
}
function getEnvPrefixEnd(words, start) {
  for (let index = start + 1;index < words.length; index++) {
    const token = words[index]?.text ?? "";
    if (token === "--")
      return index + 1;
    if (ENV_WRAPPER_OPTIONS_WITH_VALUE.has(token)) {
      if (words[index + 1] === undefined)
        return null;
      index++;
      continue;
    }
    if (token.startsWith("-u=") || token.startsWith("--unset=") || token.startsWith("-C") && token.length > 2 || token.startsWith("--chdir=") || token.startsWith("-S") && token.length > 2 || token.startsWith("--split-string=") || token.startsWith("-P")) {
      continue;
    }
    if (token.startsWith("-") || /^[A-Za-z_][A-Za-z0-9_]*=/.test(token))
      continue;
    return index;
  }
  return words.length;
}
function getSudoPrefixEnd(words, start) {
  for (let index = start + 1;index < words.length; index++) {
    const token = words[index]?.text ?? "";
    if (token === "--")
      return index + 1;
    if (SUDO_WRAPPER_OPTIONS_WITH_VALUE.has(token)) {
      if (words[index + 1] === undefined)
        return null;
      index++;
      continue;
    }
    if (token.startsWith("-"))
      continue;
    return index;
  }
  return words.length;
}
function expandPosixLiteralBraceWord(word, maxWords, maxExpansions, maxExpandedLength) {
  if (word.provenance !== "literal" || !word.raw.includes("{"))
    return;
  const expanded = expandBraceValues(word.raw, maxWords, maxExpansions, maxExpandedLength, true);
  if (!expanded)
    return;
  if ("limited" in expanded)
    return { limited: true };
  const words = expanded.values.map((value) => decodePosixLiteralWord(value, maxExpansions));
  if (words.some((value) => value === null))
    return { limited: true };
  return {
    words: [...new Set(words.filter((value) => value !== null && value !== ""))]
  };
}
function expandLiteralCommandWord(source, word, maxWords, maxDepth, maxExpandedLength) {
  if (word.provenance !== "literal" || !word.raw.includes("{"))
    return;
  const expanded = expandBraceValues(word.raw, maxWords, maxDepth, maxExpandedLength, false);
  if (!expanded)
    return;
  if ("limited" in expanded) {
    if (expanded.limited === "expansions")
      return { limitCode: "depth-limit" };
    return { limitCode: expanded.limited === "length" ? "brace-expansion-limit" : "word-limit" };
  }
  const texts = expanded.values.map((value) => decodePosixLiteralWord(value, maxDepth));
  if (texts.some((text) => text === null))
    return;
  return {
    words: texts.filter((text) => text !== null && text !== "").map((text) => freezeParsedCommandWord(source, word.span.start, word.span.end, text, "literal", false))
  };
}
function expandBraceValues(raw, maxWords, maxExpansions, maxExpandedLength, ranges) {
  const values = [raw];
  let totalLength = raw.length;
  let expansions = 0;
  while (true) {
    const valueIndex = values.findIndex((value) => findActiveBraceExpansion(value, ranges));
    if (valueIndex === -1)
      break;
    if (++expansions > maxExpansions)
      return { limited: "expansions" };
    const value = values[valueIndex] ?? "";
    const expansion = findActiveBraceExpansion(value, ranges);
    if (!expansion || expansion.kind === "range")
      return { limited: "expansions" };
    const fixedLength = expansion.start + value.length - expansion.end;
    const replacementsLength = expansion.alternatives.reduce((total, alternative) => total + fixedLength + alternative.length, 0);
    if (totalLength - value.length + replacementsLength > maxExpandedLength) {
      return { limited: "length" };
    }
    if (values.length - 1 + expansion.alternatives.length > maxWords) {
      return { limited: "words" };
    }
    values.splice(valueIndex, 1, ...buildBraceReplacements(value, expansion));
    totalLength += replacementsLength - value.length;
  }
  return expansions === 0 ? undefined : { values };
}
function findActiveBraceExpansion(value, ranges) {
  const stack = [];
  let selected;
  let quote = null;
  let escaped = false;
  for (let index = 0;index < value.length; index++) {
    const char = value[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\" && quote !== "'") {
      escaped = true;
      continue;
    }
    if (char === quote) {
      quote = null;
      continue;
    }
    if (quote === null && (char === "'" || char === '"')) {
      quote = char;
      continue;
    }
    if (quote !== null)
      continue;
    if (char === "{") {
      stack.push({ start: index, commas: [] });
      continue;
    }
    if (char === "," && stack.length > 0) {
      stack.at(-1)?.commas.push(index);
      continue;
    }
    if (char !== "}" || stack.length === 0)
      continue;
    const frame = stack.pop();
    if (!frame)
      continue;
    const candidate = frame.commas.length > 0 ? {
      kind: "alternatives",
      start: frame.start,
      end: index + 1,
      commas: frame.commas
    } : ranges && isActiveBraceRange(value.slice(frame.start + 1, index)) ? { kind: "range", start: frame.start, end: index + 1 } : undefined;
    if (candidate && (!selected || candidate.start < selected.start))
      selected = candidate;
  }
  if (!selected || selected.kind === "range")
    return selected;
  return {
    kind: selected.kind,
    start: selected.start,
    end: selected.end,
    alternatives: sliceBraceAlternatives(value, selected)
  };
}
function buildBraceReplacements(value, expansion) {
  return expansion.alternatives.map((alternative) => `${value.slice(0, expansion.start)}${alternative}${value.slice(expansion.end)}`);
}
function sliceBraceAlternatives(value, expansion) {
  const boundaries = [expansion.start, ...expansion.commas, expansion.end - 1];
  return boundaries.slice(0, -1).map((start, index) => value.slice(start + 1, boundaries[index + 1]));
}
function isActiveBraceRange(value) {
  return /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(value) || /^[A-Za-z]\.\.[A-Za-z](?:\.\.-?\d+)?$/.test(value);
}
function decodePosixLiteralWord(value, maxDepth) {
  const source = `x${value}`;
  const result = readWord(source, 0, source.length, { maxInputLength: source.length, maxWords: 1, maxDepth }, { wordsUsed: 0, maxWords: 1, quotedExpansionEnd: Infinity }, 0);
  if (result.limited || result.issues.length > 0 || result.next !== source.length || result.word.provenance !== "literal") {
    return null;
  }
  return result.word.text.slice(1);
}
function limitedProgram(source, start, end, code) {
  return freezeCommandProgram({
    kind: "program",
    dialect: "posix",
    source: source.slice(start, end),
    span: { start, end },
    status: "limited",
    issues: [{ code, message: "command structure exceeds parser limit" }],
    nodes: []
  });
}
function limitedResult(nodes, issues, next, code, limit) {
  return {
    nodes,
    issues: [
      ...issues,
      {
        code,
        message: `command structure exceeds parser limit ${limit}`
      }
    ],
    next,
    closed: false,
    limited: true,
    pendingHeredocs: []
  };
}
function propagatedLimitResult(nodes, issues, next) {
  return { nodes, issues, next, closed: false, limited: true, pendingHeredocs: [] };
}
function consumeWord(parseState) {
  parseState.wordsUsed++;
  return parseState.wordsUsed <= parseState.maxWords;
}
function readFunctionOpening(source, start, end) {
  const slice = source.slice(start, end);
  const match = /^(?:function[ \t]+)?([A-Za-z_][A-Za-z0-9_]*)[ \t]*\([ \t]*\)[ \t]*\{/.exec(slice) ?? /^function[ \t]+([A-Za-z_][A-Za-z0-9_]*)[ \t]+\{/.exec(slice);
  const name = match?.[1];
  if (!match || !name)
    return;
  return { name, braceIndex: start + match[0].lastIndexOf("{") };
}
function containsHeredoc(nodes) {
  return nodes.some((node) => {
    if (node.kind === "command") {
      return node.redirections.some((redirection) => redirection.heredoc) || node.nested.some((program) => containsHeredoc(program.nodes));
    }
    return (node.kind === "group" || node.kind === "function") && containsHeredoc(node.body.nodes);
  });
}
function unterminatedHeredocIssues(pending) {
  return pending.map((declaration) => ({
    code: "unterminated-heredoc",
    message: `heredoc delimiter ${declaration.delimiter} was not found`
  }));
}
function isExecutableNode(node) {
  return node?.kind === "command" || node?.kind === "group" || node?.kind === "function";
}
function appendMissingCommandIssue(nodes, issues) {
  const trailing = nodes.at(-1);
  if (trailing?.kind !== "connector" || !CONTINUATION_CONNECTORS.has(trailing.operator))
    return;
  issues.push({
    code: "missing-command-after-connector",
    message: `connector ${trailing.operator} requires a following command`
  });
}
function isReservedCommandPrefix(word) {
  return word?.provenance === "literal" && !word.quoted && word.raw === word.text && RESERVED_COMMAND_PREFIXES.has(word.text);
}
function appendMissingConnectorIssue(nodes, issues) {
  const previous = nodes.at(-1);
  if (!isExecutableNode(previous))
    return;
  if (previous?.kind === "command" && isReservedCommandPrefix(previous.words[0]))
    return;
  issues.push({
    code: "missing-command-connector",
    message: "adjacent commands require a connector"
  });
}
function isCommentStart(source, index, start) {
  return index === start || /[\s;&|()]/u.test(source[index - 1] ?? "");
}
// src/core/shell/powershell.ts
var AUTO_POWERSHELL_HEADS = new Set([
  "remove-item",
  "ri",
  "del",
  "erase",
  "rd",
  "rmdir",
  "get-content",
  "set-content",
  "add-content",
  "copy-item",
  "move-item"
]);
var AUTO_POWERSHELL_PATH_ALIASES = new Set(["gc", "cat", "type", "cp", "mv", "rm"]);
var AUTO_POWERSHELL_PARAMETERS = ["-rec", "-for", "-path", "-literalpath", "-whatif"];
var POWERSHELL_ENV_VARIABLE = /^\$env:\w/i;
var POWERSHELL_SEPARATED_VARIABLE = /^(?:\$\{?\w+\}?|~)\\./;
function shouldUsePowerShellParser(source, limits) {
  const candidate = source.toLowerCase().replaceAll("`", "");
  if (![...AUTO_POWERSHELL_HEADS].some((head) => candidate.includes(head)) && !(candidate.includes("rm") && AUTO_POWERSHELL_PARAMETERS.some((word) => candidate.includes(word))) && !candidate.includes("<#") && !hasPathExpressionSignal(candidate)) {
    return false;
  }
  const program = parsePowerShellCommand(source, limits);
  if (hasPosixHeredoc(program))
    return false;
  return program.issues.some((issue) => issue.code === "unclosed-block-comment" || issue.code === "comment-depth-limit") || selectorCommandsFromProgram(program).some(isPowerShellSelectorCommand);
}
function hasPosixHeredoc(program) {
  return program.nodes.some((node) => {
    if (node.kind === "group")
      return hasPosixHeredoc(node.body);
    if (node.kind !== "command")
      return false;
    return node.redirections.some((redirection) => redirection.operator === "<<");
  });
}
function hasPathExpressionSignal(candidate) {
  if (candidate.includes("$env:"))
    return true;
  return candidate.includes("\\") && (candidate.includes("$") || candidate.includes("~"));
}
function isPowerShellSelectorCommand(words) {
  const headIndex = words[0] === "&" || words[0] === "." ? 1 : 0;
  const head = words[headIndex]?.toLowerCase();
  if (head && AUTO_POWERSHELL_HEADS.has(head))
    return true;
  const args = words.slice(headIndex + 1);
  if (head && AUTO_POWERSHELL_PATH_ALIASES.has(head) && args.some(isPowerShellPathExpression)) {
    return true;
  }
  if (head !== "rm")
    return false;
  return args.some((word) => {
    const parameter = word.toLowerCase().split(":", 1)[0] ?? "";
    return AUTO_POWERSHELL_PARAMETERS.some((prefix) => parameter.startsWith(prefix));
  });
}
function isPowerShellPathExpression(word) {
  return POWERSHELL_ENV_VARIABLE.test(word) || POWERSHELL_SEPARATED_VARIABLE.test(word);
}
function parsePowerShellCommand(source, limits) {
  const span = { start: 0, end: source.length };
  if (source.length > limits.maxInputLength) {
    return freezeCommandProgram({
      kind: "program",
      dialect: "powershell",
      source,
      span,
      status: "limited",
      issues: [
        {
          code: "input-limit",
          message: `command exceeds ${limits.maxInputLength} UTF-16 code units`
        }
      ],
      nodes: []
    });
  }
  const result = scanPowerShellSequence(source, 0, source.length, limits, 0);
  return freezeCommandProgram({
    kind: "program",
    dialect: "powershell",
    source,
    span,
    status: getPowerShellParseStatus(result.issues, result.limited),
    issues: result.issues,
    nodes: result.nodes
  });
}
function scanPowerShellSequence(source, start, end, limits, depth, closingBrace = false) {
  const nodes = [];
  const issues = [];
  const accumulator = createCommandAccumulator();
  let wordCount = 0;
  let limited = false;
  const flush = () => {
    if (accumulator.words.length === 0 && accumulator.redirections.length === 0)
      return;
    const commandSpan = { start: accumulator.start, end: accumulator.end };
    appendAccumulatedCommand(nodes, accumulator, {
      kind: "command",
      dialect: "powershell",
      source: source.slice(commandSpan.start, commandSpan.end),
      span: commandSpan,
      words: accumulator.words,
      redirections: accumulator.redirections,
      nested: accumulator.nested,
      displayText: accumulator.words.map((word) => word.text).join(" ")
    });
  };
  let i = start;
  while (i < end) {
    const char = source[i];
    if (!char)
      break;
    if (closingBrace && char === "}") {
      flush();
      return { nodes, issues, next: i + 1, closed: true, words: wordCount, limited };
    }
    const comment = readPowerShellComment(source, i, end, limits.maxDepth);
    if (comment) {
      if (comment.issue)
        issues.push(comment.issue);
      if (comment.limited) {
        flush();
        return {
          nodes,
          issues,
          next: comment.next,
          closed: false,
          words: wordCount,
          limited: true
        };
      }
      i = comment.next;
      continue;
    }
    if (/\s/.test(char)) {
      if (char === "\r" || char === `
`) {
        flush();
        const next = char === "\r" && source[i + 1] === `
` ? i + 2 : i + 1;
        nodes.push(connector(source, i, next));
        i = next;
        continue;
      }
      i++;
      continue;
    }
    const operator = readOperator(source, i);
    if (operator) {
      flush();
      nodes.push(connector(source, i, i + operator.length));
      i += operator.length;
      continue;
    }
    if (char === "{") {
      flush();
      if (depth >= limits.maxDepth) {
        issues.push(depthLimitIssue(limits.maxDepth));
        return { nodes, issues, next: end, closed: false, words: wordCount, limited: true };
      }
      const inner = scanPowerShellSequence(source, i + 1, end, limits, depth + 1, true);
      const bodyEnd = inner.closed ? inner.next - 1 : inner.next;
      const body = freezeCommandProgram({
        kind: "program",
        dialect: "powershell",
        source: source.slice(i + 1, bodyEnd),
        span: { start: i + 1, end: bodyEnd },
        status: inner.limited ? "limited" : inner.issues.length > 0 ? "partial" : "complete",
        issues: inner.issues,
        nodes: inner.nodes
      });
      nodes.push(Object.freeze({
        kind: "group",
        style: "brace",
        span: Object.freeze({ start: i, end: inner.next }),
        body
      }));
      issues.push(...inner.issues);
      if (!inner.closed) {
        issues.push({
          code: "unclosed-script-block",
          message: "PowerShell script block is not closed"
        });
      }
      wordCount += inner.words;
      limited ||= inner.limited;
      i = inner.next;
      continue;
    }
    if (char === "}") {
      flush();
      nodes.push(connector(source, i, i + 1));
      i++;
      continue;
    }
    if (char === ">" || char === "<") {
      accumulator.start = accumulator.start === -1 ? i : accumulator.start;
      const operatorEnd = source[i + 1] === char ? i + 2 : i + 1;
      let targetStart = operatorEnd;
      while (/[ \t]/.test(source[targetStart] ?? ""))
        targetStart++;
      const target = targetStart < end ? readPowerShellWord(source, targetStart, end, limits, depth) : undefined;
      const redirectEnd = target?.next ?? operatorEnd;
      accumulator.redirections.push(Object.freeze({
        kind: "redirection",
        operator: source.slice(i, operatorEnd),
        span: Object.freeze({ start: i, end: redirectEnd }),
        ...target ? { target: target.word } : {}
      }));
      if (target) {
        issues.push(...target.issues);
        accumulator.nested.push(...target.nested);
        wordCount += target.words;
        limited ||= target.limited;
      }
      accumulator.end = redirectEnd;
      i = redirectEnd;
      continue;
    }
    if (char === ",") {
      accumulator.start = accumulator.start === -1 ? i : accumulator.start;
      accumulator.words.push(freezeCommandWord({
        text: ",",
        raw: ",",
        span: { start: i, end: i + 1 },
        provenance: "literal",
        quoted: false
      }));
      accumulator.end = ++i;
      continue;
    }
    const result = readPowerShellWord(source, i, end, limits, depth);
    accumulator.start = accumulator.start === -1 ? i : accumulator.start;
    accumulator.end = result.next;
    accumulator.words.push(result.word);
    issues.push(...result.issues);
    accumulator.nested.push(...result.nested);
    wordCount += 1 + result.words;
    limited ||= result.limited;
    if (wordCount > limits.maxWords) {
      issues.push({
        code: "word-limit",
        message: `command exceeds ${limits.maxWords} words`
      });
      flush();
      return { nodes, issues, next: result.next, closed: false, words: wordCount, limited: true };
    }
    i = result.next > i ? result.next : i + 1;
  }
  flush();
  return { nodes, issues, next: i, closed: !closingBrace, words: wordCount, limited };
}
function readPowerShellWord(source, start, end, limits, depth) {
  let text = "";
  let provenance = "literal";
  let quoted = false;
  const issues = [];
  const nested = [];
  let nestedWords = 0;
  let limited = false;
  const consumeSubexpression = (offset) => {
    const subexpression = readPowerShellSubexpression(source, offset, end, limits, depth);
    text += source.slice(offset, subexpression.next);
    nested.push(subexpression.program);
    issues.push(...subexpression.program.issues);
    nestedWords += countProgramWords(subexpression.program);
    limited ||= subexpression.program.status === "limited";
    provenance = "command-substitution";
    return subexpression.next;
  };
  let i = start;
  while (i < end) {
    const char = source[i];
    if (!char || /\s/.test(char) || readOperator(source, i) || char === ">" || char === "<" || char === "#") {
      break;
    }
    if (char === ",")
      break;
    if (char === "`") {
      const next = source[i + 1];
      if (!next) {
        issues.push({
          code: "trailing-escape",
          message: "PowerShell escape has no following character"
        });
        i++;
        break;
      }
      text += next;
      i += 2;
      continue;
    }
    if (source.startsWith("$(", i)) {
      i = consumeSubexpression(i);
      continue;
    }
    if (char === "'") {
      quoted = true;
      i++;
      let closed = false;
      while (i < source.length) {
        if (source[i] === "'" && source[i + 1] === "'") {
          text += "'";
          i += 2;
          continue;
        }
        if (source[i] === "'") {
          closed = true;
          i++;
          break;
        }
        text += source[i] ?? "";
        i++;
      }
      if (!closed) {
        issues.push({
          code: "unclosed-single-quote",
          message: "single-quoted word is not closed"
        });
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
      i++;
      let closed = false;
      while (i < end) {
        const inner = source[i];
        if (inner === "`" && source[i + 1]) {
          text += source[i + 1];
          i += 2;
          continue;
        }
        if (inner === '"') {
          closed = true;
          i++;
          break;
        }
        if (source.startsWith("$(", i)) {
          i = consumeSubexpression(i);
          continue;
        }
        if (inner === "$") {
          provenance = source[i + 1] === "(" ? "command-substitution" : "variable";
        }
        text += inner ?? "";
        i++;
      }
      if (!closed) {
        issues.push({
          code: "unclosed-double-quote",
          message: "double-quoted word is not closed"
        });
      }
      continue;
    }
    if (char === "$") {
      provenance = source[i + 1] === "(" ? "command-substitution" : "variable";
    }
    if (char === "@" && i === start)
      provenance = "variable";
    text += char;
    i++;
  }
  return {
    word: freezeParsedCommandWord(source, start, i, text, provenance, quoted, provenance === "literal" ? undefined : derivePowerShellWordParts(source, start, i)),
    next: i,
    issues,
    nested,
    words: nestedWords,
    limited
  };
}
function readPowerShellSubexpression(source, start, end, limits, depth) {
  const close = findPowerShellSubexpressionEnd(source, start + 2, end);
  const innerEnd = close === -1 ? end : close;
  const next = close === -1 ? end : close + 1;
  if (depth >= limits.maxDepth) {
    return {
      program: freezeCommandProgram({
        kind: "program",
        dialect: "powershell",
        source: source.slice(start + 2, innerEnd),
        span: { start: start + 2, end: innerEnd },
        status: "limited",
        issues: [depthLimitIssue(limits.maxDepth)],
        nodes: []
      }),
      next
    };
  }
  const inner = scanPowerShellSequence(source, start + 2, innerEnd, limits, depth + 1);
  const unclosedIssue = close === -1 ? [
    {
      code: "unclosed-command-subexpression",
      message: "PowerShell command subexpression is not closed"
    }
  ] : [];
  return {
    program: freezeCommandProgram({
      kind: "program",
      dialect: "powershell",
      source: source.slice(start + 2, innerEnd),
      span: { start: start + 2, end: innerEnd },
      status: inner.limited ? "limited" : inner.issues.length + unclosedIssue.length > 0 ? "partial" : "complete",
      issues: [...inner.issues, ...unclosedIssue],
      nodes: inner.nodes
    }),
    next
  };
}
function findPowerShellSubexpressionEnd(source, start, end) {
  let depth = 1;
  let single = false;
  let double = false;
  for (let i = start;i < end; i++) {
    const char = source[i];
    if (char === "`") {
      i++;
      continue;
    }
    if (!double && char === "'") {
      if (single && source[i + 1] === "'") {
        i++;
        continue;
      }
      single = !single;
      continue;
    }
    if (!single && char === '"') {
      double = !double;
      continue;
    }
    if (single)
      continue;
    if (source.startsWith("$(", i)) {
      depth++;
      i++;
      continue;
    }
    if (!double && char === "(")
      depth++;
    if (char !== ")")
      continue;
    depth--;
    if (depth === 0)
      return i;
  }
  return -1;
}
function countProgramWords(program) {
  let count = 0;
  for (const node of program.nodes) {
    if (node.kind === "group")
      count += countProgramWords(node.body);
    if (node.kind === "command") {
      count += node.words.length;
      for (const nested of node.nested)
        count += countProgramWords(nested);
    }
  }
  return count;
}
function derivePowerShellWordParts(source, start, end) {
  const collector = createCommandWordParts(source);
  let literalStart = start;
  let single = false;
  let i = start;
  while (i < end) {
    const char = source[i];
    if (char === "`") {
      i += 2;
      continue;
    }
    if (char === "'") {
      if (single && source[i + 1] === "'") {
        i += 2;
        continue;
      }
      single = !single;
      i++;
      continue;
    }
    if (single) {
      i++;
      continue;
    }
    if (source.startsWith("$(", i)) {
      const close = findPowerShellSubexpressionEnd(source, i + 2, end);
      const next = close === -1 ? end : close + 1;
      collector.push(literalStart, i, "literal");
      collector.push(i, next, "command-substitution");
      i = next;
      literalStart = next;
      continue;
    }
    if (char === "$" || char === "@" && i === start) {
      const next = readPowerShellVariableEnd(source, i + 1, end);
      collector.push(literalStart, i, "literal");
      collector.push(i, next, "variable");
      i = next;
      literalStart = next;
      continue;
    }
    i++;
  }
  collector.push(literalStart, end, "literal");
  return collector.parts;
}
function readPowerShellVariableEnd(source, start, end) {
  if (source[start] === "{") {
    const close = source.indexOf("}", start + 1);
    return close === -1 || close >= end ? end : close + 1;
  }
  let next = start;
  while (next < end && /[A-Za-z0-9_:?]/.test(source[next] ?? ""))
    next++;
  return next;
}
function depthLimitIssue(limit) {
  return {
    code: "depth-limit",
    message: `command structure exceeds parser limit ${limit}`
  };
}
function selectorCommandsFromProgram(program) {
  return program.nodes.flatMap((node) => {
    if (node.kind === "group")
      return selectorCommandsFromProgram(node.body);
    if (node.kind !== "command")
      return [];
    return [
      [
        ...node.words,
        ...node.redirections.flatMap((redirection) => redirection.target ? [redirection.target] : [])
      ].sort((left, right) => left.span.start - right.span.start).filter((word) => word.text !== "" && word.raw !== ",").map((word) => word.text),
      ...node.nested.flatMap(selectorCommandsFromProgram)
    ];
  });
}
function readOperator(source, index) {
  for (const operator of ["&&", "||", ";", "|"]) {
    if (source.startsWith(operator, index))
      return operator;
  }
  return null;
}
function readPowerShellComment(source, start, end, maxDepth) {
  if (source[start] === "#" && source[start + 1] !== ">") {
    let next = start + 1;
    while (next < end && source[next] !== "\r" && source[next] !== `
`)
      next++;
    return { next, limited: false };
  }
  if (!source.startsWith("<#", start))
    return null;
  let depth = 1;
  let i = start + 2;
  while (i < end) {
    if (source.startsWith("<#", i)) {
      depth++;
      if (depth > maxDepth) {
        return {
          next: end,
          issue: {
            code: "comment-depth-limit",
            message: `PowerShell block comment exceeds nesting limit ${maxDepth}`
          },
          limited: true
        };
      }
      i += 2;
      continue;
    }
    if (source.startsWith("#>", i)) {
      depth--;
      i += 2;
      if (depth === 0)
        return { next: i, limited: false };
      continue;
    }
    i++;
  }
  return {
    next: end,
    issue: {
      code: "unclosed-block-comment",
      message: "PowerShell block comment is not closed"
    },
    limited: false
  };
}
function getPowerShellParseStatus(issues, limited) {
  if (limited)
    return "limited";
  if (issues.some((issue) => issue.code === "unclosed-block-comment"))
    return "invalid";
  return issues.length > 0 ? "partial" : "complete";
}
function connector(source, start, end) {
  return Object.freeze({
    kind: "connector",
    operator: source.slice(start, end),
    span: Object.freeze({ start, end })
  });
}

// src/core/shell/parse.ts
function parseCommand(source, dialect = "auto", limits = DEFAULT_COMMAND_PARSER_LIMITS) {
  if (dialect === "powershell" || dialect === "auto" && shouldUsePowerShellParser(source.slice(0, limits.maxInputLength), limits)) {
    return parsePowerShellCommand(source, limits);
  }
  return parsePosixCommand(source, limits);
}
// src/core/shell/traversal.ts
function* walkCommandViews(program) {
  for (const node of program.nodes) {
    yield* walkNode(node);
  }
}
function projectCommandViews(program) {
  return Object.freeze([...walkCommandViews(program)]);
}
function projectSegmentWords(program) {
  return Object.freeze(projectCommandViews(program).map((view) => Object.freeze(view.words.map((word) => word.text))));
}
function parseSimpleWords(source) {
  const program = parseCommand(source, "posix");
  if (program.status !== "complete" || program.nodes.length !== 1)
    return null;
  const command = program.nodes[0];
  if (command?.kind !== "command")
    return null;
  if (command.redirections.length > 0 || command.nested.length > 0)
    return null;
  if (command.words.some((word) => word.provenance === "command-substitution"))
    return null;
  return command.words.map((word) => word.text);
}
function* walkNode(node) {
  if (node.kind === "command") {
    yield node;
    for (const nested of node.nested)
      yield* walkCommandViews(nested);
    return;
  }
  if (node.kind === "group")
    yield* walkCommandViews(node.body);
}
// src/core/rules/custom-match-options.ts
var AWS_GLOBAL_OPTIONS_WITH_VALUES = new Set([
  "--ca-bundle",
  "--cli-binary-format",
  "--cli-connect-timeout",
  "--cli-error-format",
  "--cli-read-timeout",
  "--color",
  "--endpoint-url",
  "--output",
  "--profile",
  "--query",
  "--region"
]);
var GCLOUD_GLOBAL_OPTIONS_WITH_VALUES = new Set([
  "--access-token-file",
  "--account",
  "--billing-project",
  "--configuration",
  "--flags-file",
  "--flatten",
  "--format",
  "--impersonate-service-account",
  "--project",
  "--trace-token",
  "--verbosity"
]);
var AZ_GLOBAL_OPTIONS_WITH_VALUES = new Set(["-o", "--output", "--query", "--subscription"]);
var EMPTY_GLOBAL_OPTIONS_WITH_VALUES = new Set;
function getMatchGlobalOptionsWithValues(command) {
  if (command === "aws")
    return AWS_GLOBAL_OPTIONS_WITH_VALUES;
  if (command === "gcloud")
    return GCLOUD_GLOBAL_OPTIONS_WITH_VALUES;
  if (command === "az")
    return AZ_GLOBAL_OPTIONS_WITH_VALUES;
  return EMPTY_GLOBAL_OPTIONS_WITH_VALUES;
}

// src/core/rules/custom-subcommand.ts
var DOCKER_OPTIONS_WITH_VALUES = new Set([
  "-c",
  "-H",
  "-l",
  "--config",
  "--context",
  "--host",
  "--log-level",
  "--tlscacert",
  "--tlscert",
  "--tlskey"
]);
var EMPTY_OPTIONS_WITH_VALUES = new Set;
function getCustomRuleOptionsWithValues(command) {
  if (command === "git")
    return GIT_GLOBAL_OPTS_WITH_VALUE;
  if (command === "docker")
    return DOCKER_OPTIONS_WITH_VALUES;
  return EMPTY_OPTIONS_WITH_VALUES;
}

// src/core/rules/custom.ts
function checkPolicyRuleMatch(tokens, rules) {
  if (tokens.length === 0 || rules.length === 0) {
    return null;
  }
  const command = normalizeCommandToken(tokens[0] ?? "");
  const shortOpts = extractShortOpts(tokens);
  for (const rule of rules) {
    if (!matchesCommand(command, rule.command)) {
      continue;
    }
    if (rule.match) {
      if (matchesCustomRuleMatch(command, tokens, rule.match)) {
        return toRuleMatch(rule);
      }
      continue;
    }
    if (!matchesCustomRuleSubcommand(command, tokens, rule.subcommand)) {
      continue;
    }
    if (matchesCustomRuleBlockArgs(tokens, new Set(rule.block_args), shortOpts)) {
      return toRuleMatch(rule);
    }
  }
  return null;
}
function toRuleMatch(rule) {
  return {
    id: `custom.${rule.name}`,
    reason: `[${rule.name}] ${rule.reason}`,
    intent: rule.intent ?? "manual_only"
  };
}
function matchesCustomRuleMatch(command, tokens, match) {
  const args = tokens.slice(1);
  if (match.exclude_args?.some((arg) => args.includes(arg))) {
    return false;
  }
  if (match.any_args && !match.any_args.some((arg) => args.includes(arg))) {
    return false;
  }
  return matchesCommandPath(args, match.command_path, getMatchGlobalOptionsWithValues(command));
}
function matchesCommandPath(args, commandPath, optionsWithValues) {
  let pathIndex = 0;
  let skipNext = false;
  for (const token of args) {
    if (pathIndex >= commandPath.length) {
      return true;
    }
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (token.startsWith("-")) {
      skipNext = !token.includes("=") && optionsWithValues.has(token);
      continue;
    }
    if (token !== commandPath[pathIndex]) {
      return false;
    }
    pathIndex++;
  }
  return pathIndex >= commandPath.length;
}
function matchesCommand(command, ruleCommand) {
  return command === normalizeCommandToken(ruleCommand);
}
function matchesCustomRuleSubcommand(command, tokens, ruleSubcommand) {
  if (!ruleSubcommand) {
    return true;
  }
  return matchesSubcommandFrom(tokens, 1, ruleSubcommand, getCustomRuleOptionsWithValues(command));
}
function matchesSubcommandFrom(tokens, startIndex, expectedSubcommand, optionsWithValues) {
  let skipNext = false;
  for (let i = startIndex;i < tokens.length; i++) {
    const token = tokens[i];
    if (!token)
      continue;
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (token === "--") {
      const nextToken = tokens[i + 1];
      if (nextToken && !nextToken.startsWith("-")) {
        return nextToken === expectedSubcommand;
      }
      return false;
    }
    if (optionsWithValues.has(token)) {
      skipNext = true;
      continue;
    }
    if (token.startsWith("-")) {
      if (!token.includes("=") && shouldSkipPossibleOptionValue(tokens, i, expectedSubcommand, optionsWithValues)) {
        return true;
      }
      continue;
    }
    return token === expectedSubcommand;
  }
  return false;
}
function shouldSkipPossibleOptionValue(tokens, optionIndex, expectedSubcommand, optionsWithValues) {
  const value = tokens[optionIndex + 1];
  if (!value || value.startsWith("-")) {
    return false;
  }
  return matchesSubcommandFrom(tokens, optionIndex + 2, expectedSubcommand, optionsWithValues);
}
function matchesCustomRuleBlockArgs(tokens, blockArgs, shortOpts) {
  return tokens.some((token) => blockArgs.has(token)) || [...shortOpts].some((opt) => blockArgs.has(opt));
}
