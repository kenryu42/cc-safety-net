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

// src/bin/core.ts
var exports_core = {};
__export(exports_core, {
  AnalysisLimit: () => AnalysisLimit,
  BLOCK_INTENTS: () => BLOCK_INTENTS,
  BUILTIN_ANALYZED_COMMANDS: () => BUILTIN_ANALYZED_COMMANDS,
  DEFAULT_AUDIT_RETENTION_DAYS: () => DEFAULT_AUDIT_RETENTION_DAYS,
  DEFAULT_CONFIG: () => DEFAULT_CONFIG,
  DEFAULT_GUI_POLICY: () => DEFAULT_GUI_POLICY,
  ENV_FLAGS: () => ENV_FLAGS,
  GITHUB_RULEBOOK_PATH_RE: () => GITHUB_RULEBOOK_PATH_RE,
  GITHUB_RULEBOOK_SOURCE_FORMAT: () => GITHUB_RULEBOOK_SOURCE_FORMAT,
  INTENT_ERROR: () => INTENT_ERROR,
  LIMITS: () => LIMITS,
  MAX_AUDIT_RETENTION_DAYS: () => MAX_AUDIT_RETENTION_DAYS,
  MIN_AUDIT_RETENTION_DAYS: () => MIN_AUDIT_RETENTION_DAYS,
  NAME_PATTERN: () => NAME_PATTERN,
  POLICY_FILE: () => POLICY_FILE,
  REASON_COMMAND_ANALYSIS_LIMIT: () => REASON_COMMAND_ANALYSIS_LIMIT,
  REASON_DERIVED_COMMAND_WORK_LIMIT: () => REASON_DERIVED_COMMAND_WORK_LIMIT,
  REASON_RECURSION_LIMIT: () => REASON_RECURSION_LIMIT,
  REASON_SAFETY_NET_FAILED_CLOSED: () => REASON_SAFETY_NET_FAILED_CLOSED,
  RULEBOOK_FILE: () => RULEBOOK_FILE,
  RULEBOOK_LIMITS: () => RULEBOOK_LIMITS,
  RULEBOOK_LIMIT_ERROR: () => RULEBOOK_LIMIT_ERROR,
  RULEBOOK_VALIDATION_TRUNCATED: () => RULEBOOK_VALIDATION_TRUNCATED,
  RULES_CONFIG_FIELDS: () => RULES_CONFIG_FIELDS,
  RULES_DIR: () => RULES_DIR,
  RULE_OVERRIDE_KEY_PATTERN: () => RULE_OVERRIDE_KEY_PATTERN,
  RULE_SOURCE_LIMIT: () => RULE_SOURCE_LIMIT,
  RULE_SOURCE_LIMIT_ERROR: () => RULE_SOURCE_LIMIT_ERROR,
  RULE_UPDATE_COMMAND: () => RULE_UPDATE_COMMAND,
  SAFETY_LEVEL_CAPABILITIES: () => SAFETY_LEVEL_CAPABILITIES,
  SAFETY_OVERRIDE_KEYS: () => SAFETY_OVERRIDE_KEYS,
  TOOL_INPUT_LIMITS: () => TOOL_INPUT_LIMITS,
  ToolInputLimitError: () => ToolInputLimitError,
  USER_POLICY_FIELDS: () => USER_POLICY_FIELDS,
  assertBareRulebookName: () => assertBareRulebookName,
  assertValidRulebook: () => assertValidRulebook,
  clampAuditRetentionDays: () => clampAuditRetentionDays,
  collectCustomRuleNames: () => collectCustomRuleNames,
  createBudget: () => createBudget,
  createCommandAnalysisPolicy: () => createCommandAnalysisPolicy,
  createCwdDenial: () => createCwdDenial,
  createDefaultGuiPolicy: () => createDefaultGuiPolicy,
  createFailedClosedDenial: () => createFailedClosedDenial,
  createPolicyPreview: () => createPolicyPreview,
  createPolicySnapshot: () => createPolicySnapshot,
  createProcessEnvironment: () => createProcessEnvironment,
  createTestEnvironment: () => createTestEnvironment,
  custom: () => custom,
  deriveEffectiveSafetyLevel: () => deriveEffectiveSafetyLevel,
  describeConfigState: () => describeConfigState,
  destructiveCommandRuleIsEnabled: () => destructiveCommandRuleIsEnabled,
  duplicateRuleNameIssues: () => duplicateRuleNameIssues,
  envFlagIsSet: () => envFlagIsSet,
  envTruthy: () => envTruthy,
  expandAllowPathHome: () => expandAllowPathHome,
  expandSupportedPathEnvironmentVariables: () => expandSupportedPathEnvironmentVariables,
  extractPatchTargetsFromToolInput: () => extractPatchTargetsFromToolInput,
  extractPathLikeToolValues: () => extractPathLikeToolValues,
  filterDestructiveCommandMatch: () => filterDestructiveCommandMatch,
  findDotGitInAncestors: () => findDotGitInAncestors,
  formatAskPrompt: () => formatAskPrompt,
  formatBlockedMessage: () => formatBlockedMessage,
  formatDenial: () => formatDenial,
  formatIntegrationError: () => formatIntegrationError,
  formatIssues: () => formatIssues,
  getAllowPathHomeConflictError: () => getAllowPathHomeConflictError,
  getCCSafetyNetEnvModes: () => getCCSafetyNetEnvModes,
  getCommandFromToolInput: () => getCommandFromToolInput,
  getDestructiveAllowPathError: () => getDestructiveAllowPathError,
  getEffectiveTmpdirValue: () => getEffectiveTmpdirValue,
  getEnvAssignmentValues: () => getEnvAssignmentValues,
  getEnvFlagValue: () => getEnvFlagValue,
  getLocalRulebookPath: () => getLocalRulebookPath,
  getNonCommandToolInputKind: () => getNonCommandToolInputKind,
  getPolicyPaths: () => getPolicyPaths,
  getProjectPolicyFilesystemScope: () => getProjectPolicyFilesystemScope,
  getProjectPolicyPath: () => getProjectPolicyPath,
  getProjectRulesConfigPath: () => getProjectRulesConfigPath,
  getProjectRulesDir: () => getProjectRulesDir,
  getRulebookNameForSpec: () => getRulebookNameForSpec,
  getRulebookSourceSyntaxError: () => getRulebookSourceSyntaxError,
  getRulesConfigRuntimeErrorsForConfig: () => getRulesConfigRuntimeErrorsForConfig,
  getRulesConfigValidation: () => getRulesConfigValidation,
  getSecretAllowPathError: () => getSecretAllowPathError,
  getSecretDenyPathError: () => getSecretDenyPathError,
  getUserPolicyFilesystemScope: () => getUserPolicyFilesystemScope,
  getUserPolicyPath: () => getUserPolicyPath,
  getUserRulesConfigPath: () => getUserRulesConfigPath,
  getUserRulesDir: () => getUserRulesDir,
  hasUnsafeTmpdirWordSplitting: () => hasUnsafeTmpdirWordSplitting,
  isBlockIntent: () => isBlockIntent,
  isGitConfigEnvName: () => isGitConfigEnvName,
  isGitHubRef: () => isGitHubRef,
  isGitHubRepositorySource: () => isGitHubRepositorySource,
  isGitHubRulebookSource: () => isGitHubRulebookSource,
  isInterpreterCommand: () => isInterpreterCommand,
  isPathOrSubpath: () => isPathOrSubpath,
  isReadOnlyTool: () => isReadOnlyTool,
  isReservedTransparentWrapper: () => isReservedTransparentWrapper,
  isRulebookWithinAcceptanceLimits: () => isRulebookWithinAcceptanceLimits,
  isTmpdirOverriddenToNonTemp: () => isTmpdirOverriddenToNonTemp,
  isTmpdirValueTrusted: () => isTmpdirValueTrusted,
  isTrustedTempPath: () => isTrustedTempPath,
  isTrustedTempRootPath: () => isTrustedTempRootPath,
  isUnsupportedWindowsNamespacePath: () => isUnsupportedWindowsNamespacePath,
  loadPolicyConfig: () => loadPolicyConfig,
  loadPolicySnapshot: () => loadPolicySnapshot,
  loadRulesPolicy: () => loadRulesPolicy,
  mergeProjectPolicy: () => mergeProjectPolicy,
  mightContainEnvAssignment: () => mightContainEnvAssignment,
  normalizeGuiPolicy: () => normalizeGuiPolicy,
  normalizeMsysDrivePath: () => normalizeMsysDrivePath,
  normalizePathForComparison: () => normalizePathForComparison,
  normalizeProtectedFileCandidate: () => normalizeProtectedFileCandidate,
  normalizeProtectedPathCandidate: () => normalizeProtectedPathCandidate,
  normalizeSafety: () => normalizeSafety,
  normalizeToolName: () => normalizeToolName,
  normalizeUriDrivePath: () => normalizeUriDrivePath,
  parseGitHubSource: () => parseGitHubSource,
  parseRecursiveSecretAllowPath: () => parseRecursiveSecretAllowPath,
  probeExistingPath: () => probeExistingPath,
  processPathResolver: () => processPathResolver,
  projectGuardDenial: () => projectGuardDenial,
  projectPolicyIsUserPolicy: () => projectPolicyIsUserPolicy,
  projectPolicyProjection: () => projectPolicyProjection,
  randomHex16: () => randomHex16,
  readPolicyFile: () => readPolicyFile2,
  readRetentionDays: () => readRetentionDays,
  readRulesConfig: () => readRulesConfig,
  redactEnvAssignmentValues: () => redactEnvAssignmentValues,
  redactNonAssignmentSecrets: () => redactNonAssignmentSecrets,
  redactSecrets: () => redactSecrets,
  renderIssuePath: () => renderIssuePath,
  resolveAuditScope: () => resolveAuditScope,
  resolveChdirTarget: () => resolveChdirTarget,
  resolveCommandAnalysisContext: () => resolveCommandAnalysisContext,
  resolveDotGitFileTargets: () => resolveDotGitFileTargets,
  resolveEffectiveDestructiveCommandRules: () => resolveEffectiveDestructiveCommandRules,
  resolveExistingPath: () => resolveExistingPath,
  resolveProtectedGitMetadata: () => resolveProtectedGitMetadata,
  resolveSecretDisabledRules: () => resolveSecretDisabledRules,
  resolveWorktreeFacts: () => resolveWorktreeFacts,
  sanitizeDiagnosticText: () => sanitizeDiagnosticText,
  sessionSafetyLevel: () => sessionSafetyLevel,
  shouldRecordAllowedCommands: () => shouldRecordAllowedCommands,
  sortIssues: () => sortIssues,
  typed: () => typed,
  validateRulebook: () => validateRulebook,
  validateRulebookContent: () => validateRulebookContent,
  validateUserPolicy: () => validateUserPolicy
});
module.exports = __toCommonJS(exports_core);

// src/core/policy/paths.ts
var import_node_path2 = require("node:path");

// src/core/budget.ts
var REASON_COMMAND_ANALYSIS_LIMIT = "CC Safety Net could not analyze the command because it exceeds safe analysis limits. Simplify or split the command and retry.";
var REASON_RECURSION_LIMIT = "Command exceeds maximum recursion depth and cannot be safely analyzed. Flatten the nesting and retry.";
var REASON_SAFETY_NET_FAILED_CLOSED = "CC Safety Net failed closed because command analysis failed unexpectedly. This is not caused by your command. Report it to the user.";
var REASON_DERIVED_COMMAND_WORK_LIMIT = "Command analysis exceeds CC Safety Net's derived-command work limit. Reduce nested or embedded command complexity and retry.";
var PATH = {
  errorCode: "path-canonicalization-limit",
  reason: REASON_COMMAND_ANALYSIS_LIMIT
};
var DERIVED = {
  errorCode: "structural-shell-syntax-limit",
  reason: REASON_DERIVED_COMMAND_WORK_LIMIT
};
var LIMITS = Object.freeze({
  realpathAttempts: { cap: 16384, ...PATH },
  processedCandidateBytes: { cap: 4 * 1024 * 1024, ...PATH },
  pathEnvironmentExpansion: { cap: 64, ...PATH },
  recursionDepth: {
    cap: 10,
    errorCode: "structural-shell-syntax-limit",
    reason: REASON_RECURSION_LIMIT
  },
  derivedTokens: { cap: 16384, ...DERIVED },
  trackedHeredocFiles: { cap: 64, ...DERIVED },
  controlFlowStates: { cap: 64, ...DERIVED },
  wrapperPeelIterations: { cap: 20, ...DERIVED },
  derivedCommandShape: DERIVED
});

class AnalysisLimit extends Error {
  kind;
  name = "AnalysisLimit";
  constructor(kind) {
    super(LIMITS[kind].reason);
    this.kind = kind;
  }
}
function createBudget() {
  const counters = new Map;
  return {
    counters,
    resolvedPaths: new Map,
    charge(kind, units = 1) {
      const total = (counters.get(kind) ?? 0) + units;
      counters.set(kind, total);
      if (total > LIMITS[kind].cap)
        throw new AnalysisLimit(kind);
    }
  };
}

// src/core/policy/paths.ts
var import_safe_read = require("./core-shell.js");

// src/core/paths/canonicalization.ts
var import_node_path = require("node:path");
var MAX_MISSING_SUFFIX_COMPONENTS = 256;
var SUPPORTED_PATH_ENV_NAMES = new Set([
  "CC_SAFETY_NET_HOME",
  "CLAUDE_CONFIG_DIR",
  "CODEX_HOME",
  "COPILOT_HOME",
  "GEMINI_CLI_HOME",
  "GROK_HOME",
  "HOME",
  "KIMI_CODE_HOME",
  "KIMI_SHARE_DIR",
  "OPENCODE_CONFIG",
  "OPENCODE_CONFIG_DIR",
  "PI_CODING_AGENT_DIR",
  "ProgramData",
  "TMPDIR",
  "XDG_CONFIG_HOME",
  "XDG_DATA_HOME"
]);
function normalizeMsysDrivePath(target, platform = process.platform) {
  if (platform !== "win32")
    return target;
  return target.replace(/^\/([A-Za-z])(?:\/|$)/, "$1:/");
}
function normalizeUriDrivePath(target, platform = process.platform) {
  if (platform !== "win32")
    return target;
  return target.replace(/^\/([A-Za-z]):(?:[/\\]|$)/, "$1:/");
}
function isUnsupportedWindowsNamespacePath(target, platform = process.platform) {
  if (platform !== "win32")
    return false;
  return (target[0] === "/" || target[0] === "\\") && (target[1] === "/" || target[1] === "\\");
}
function expandSupportedPathEnvironmentVariables(value, environment) {
  return expandSupportedPathEnvironmentVariablesAtDepth(value, 0, environment);
}
function expandSupportedPathEnvironmentVariablesAtDepth(value, depth, environment) {
  let expanded = "";
  let index = 0;
  let unclosedScans = 0;
  while (index < value.length) {
    if (value[index] !== "$") {
      expanded += value[index];
      index++;
      continue;
    }
    if (value[index + 1] === "{") {
      const name = readPathEnvironmentName(value, index + 2);
      const end = findParameterExpansionEnd(value, index, depth);
      if (end === null) {
        if (SUPPORTED_PATH_ENV_NAMES.has(name))
          throw new AnalysisLimit("pathEnvironmentExpansion");
        unclosedScans++;
        if (unclosedScans > LIMITS.pathEnvironmentExpansion.cap) {
          throw new AnalysisLimit("pathEnvironmentExpansion");
        }
        expanded += "${";
        index += 2;
        continue;
      }
      const match = value.slice(index, end + 1);
      expanded += expandBracedPathEnvironmentVariable(match, depth, environment);
      index = end + 1;
      continue;
    }
    const name = readPathEnvironmentName(value, index + 1);
    if (!name) {
      expanded += "$";
      index++;
      continue;
    }
    expanded += getSupportedPathEnvironmentValue(name, environment) ?? `$${name}`;
    index += name.length + 1;
  }
  return expanded;
}
function findParameterExpansionEnd(value, start, depth) {
  let nesting = 1;
  for (let index = start + 2;index < value.length; index++) {
    if (value[index] === "\\") {
      index++;
      continue;
    }
    if (value[index] === "$" && value[index + 1] === "{") {
      nesting++;
      if (depth + nesting > LIMITS.pathEnvironmentExpansion.cap) {
        throw new AnalysisLimit("pathEnvironmentExpansion");
      }
      index++;
      continue;
    }
    if (value[index] !== "}")
      continue;
    nesting--;
    if (nesting === 0)
      return index;
  }
  return null;
}
function expandBracedPathEnvironmentVariable(match, depth, environment) {
  const content = match.slice(2, -1);
  const name = readPathEnvironmentName(content, 0);
  if (!name)
    return match;
  const suffix = content.slice(name.length);
  if (!suffix)
    return getSupportedPathEnvironmentValue(name, environment) ?? match;
  const operator = [":-", ":+", ":=", ":?", "-", "+", "=", "?"].find((candidate) => suffix.startsWith(candidate));
  if (!operator) {
    if (SUPPORTED_PATH_ENV_NAMES.has(name))
      throw new AnalysisLimit("pathEnvironmentExpansion");
    return match;
  }
  if (!SUPPORTED_PATH_ENV_NAMES.has(name))
    return match;
  if (operator.endsWith("="))
    throw new AnalysisLimit("pathEnvironmentExpansion");
  const environmentValue = getSupportedPathEnvironmentValue(name, environment);
  const usable = operator.startsWith(":") ? environmentValue !== null && environmentValue !== "" : environmentValue !== null;
  if (operator.endsWith("?") && !usable)
    throw new AnalysisLimit("pathEnvironmentExpansion");
  if (operator.endsWith("-") || operator.endsWith("?")) {
    return usable ? environmentValue ?? "" : expandSupportedPathEnvironmentVariablesAtDepth(suffix.slice(operator.length), depth + 1, environment);
  }
  return usable ? expandSupportedPathEnvironmentVariablesAtDepth(suffix.slice(operator.length), depth + 1, environment) : "";
}
function readPathEnvironmentName(value, start) {
  if (!/[A-Za-z_]/.test(value[start] ?? ""))
    return "";
  let end = start + 1;
  while (/[A-Za-z0-9_]/.test(value[end] ?? ""))
    end++;
  return value.slice(start, end);
}
function getSupportedPathEnvironmentValue(name, environment) {
  if (!SUPPORTED_PATH_ENV_NAMES.has(name))
    return null;
  if (name === "HOME")
    return environment.env.get("HOME") ?? environment.home;
  return environment.env.get(name) ?? null;
}
function resolveExistingPath(path, paths, budget) {
  if (!path)
    return path;
  const cached = budget.resolvedPaths.get(path);
  if (cached !== undefined)
    return cached;
  const suffixes = [];
  let candidate = path;
  while (true) {
    chargeRealpath(budget, candidate);
    const existing = paths.realpath(candidate);
    if (existing !== null) {
      return remember(budget, path, existing, suffixes);
    }
    const parent = import_node_path.dirname(candidate);
    if (parent === candidate || suffixes.length >= MAX_MISSING_SUFFIX_COMPONENTS) {
      return remember(budget, path, candidate, suffixes);
    }
    suffixes.push(import_node_path.basename(candidate));
    candidate = parent;
  }
}
function remember(budget, path, base, suffixes) {
  const resolved = suffixes.length === 0 ? base : import_node_path.join(base, ...suffixes.reverse());
  budget.resolvedPaths.set(path, resolved);
  return resolved;
}
function probeExistingPath(path, paths, budget) {
  const cached = budget.resolvedPaths.get(path);
  if (cached !== undefined)
    return cached;
  chargeRealpath(budget, path);
  const existing = paths.realpath(path);
  if (existing !== null)
    budget.resolvedPaths.set(path, existing);
  return existing;
}
function chargeRealpath(budget, candidate) {
  budget.charge("realpathAttempts");
  budget.charge("processedCandidateBytes", Buffer.byteLength(candidate));
}
function normalizeProtectedPathCandidate(target, cwd, environment, budget) {
  const lexical = lexicallyNormalizeCandidate(target, cwd, environment);
  if (!lexical)
    return "";
  return resolveExistingPath(lexical, environment.paths, budget).replace(/\\/g, "/");
}
function normalizeProtectedFileCandidate(target, cwd, environment, budget, isPlausibleBasename) {
  const lexical = lexicallyNormalizeCandidate(target, cwd, environment);
  if (!lexical)
    return null;
  if (isPlausibleBasename(import_node_path.basename(lexical))) {
    return resolveExistingPath(lexical, environment.paths, budget).replace(/\\/g, "/");
  }
  const probed = probeExistingPath(lexical, environment.paths, budget);
  return probed === null ? null : probed.replace(/\\/g, "/");
}
function lexicallyNormalizeCandidate(target, cwd, environment) {
  const home = environment.home;
  const unix = expandSupportedPathEnvironmentVariables(target.trim(), environment).replace(/\\/g, "/");
  if (!unix)
    return "";
  const expanded = unix === "~" ? home : unix.startsWith("~/") ? import_node_path.resolve(home, unix.slice(2)) : unix;
  const nativeTarget = normalizeMsysDrivePath(expanded);
  return import_node_path.normalize(import_node_path.isAbsolute(nativeTarget) ? nativeTarget : import_node_path.resolve(cwd, nativeTarget));
}

// src/core/policy/source-syntax.ts
var NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/;
var RULEBOOK_FILE = "rulebook.json";
var RULES_DIR = ".cc-safety-net/rules";
var GITHUB_RULEBOOK_SOURCE_FORMAT = "owner/repo#ref/<rulebook-name>";
var GITHUB_SOURCE_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;
var GITHUB_REPOSITORY_SOURCE_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9_.-]+$/;
var GITHUB_REF_PATTERN = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/;
var RULES_DIR_RE = RULES_DIR.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var RULEBOOK_FILE_RE = RULEBOOK_FILE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var GITHUB_RULEBOOK_PATH_RE = new RegExp(`^${RULES_DIR_RE}/(${NAME_PATTERN.source.slice(1, -1)})/${RULEBOOK_FILE_RE}$`);
function getRepositoryRulebookPath(name) {
  return `${RULES_DIR}/${name}/${RULEBOOK_FILE}`;
}
function getRulebookSourceSyntaxError(source) {
  if (isGitHubRulebookSource(source)) {
    try {
      parseGitHubSource(source);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : String(error);
    }
  }
  return NAME_PATTERN.test(source) ? null : `Local rulebook sources must be bare names matching ${NAME_PATTERN}: ${source}`;
}
function parseGitHubSource(spec) {
  if (spec.startsWith("github:"))
    throw new Error(`Invalid rulebook source: ${spec}`);
  const match = spec.match(GITHUB_SOURCE_RE);
  if (!match?.[1] || !match[2] || !match[3]) {
    throw new Error(`Invalid GitHub rulebook source: ${spec}`);
  }
  const separator = match[3].lastIndexOf("/");
  if (separator < 1) {
    throw new Error(`GitHub rulebook sources must be ${GITHUB_RULEBOOK_SOURCE_FORMAT}: ${spec}`);
  }
  const ref = match[3].slice(0, separator);
  const name = match[3].slice(separator + 1);
  if (!ref || !GITHUB_REF_PATTERN.test(ref)) {
    throw new Error(`GitHub rulebook refs must use valid path segments: ${spec}`);
  }
  if (!name || !NAME_PATTERN.test(name)) {
    throw new Error(`GitHub rulebook sources must be ${GITHUB_RULEBOOK_SOURCE_FORMAT}: ${spec}`);
  }
  return {
    owner: match[1],
    repo: match[2],
    ref,
    path: getRepositoryRulebookPath(name),
    name
  };
}
function isGitHubRepositorySource(source) {
  return GITHUB_REPOSITORY_SOURCE_RE.test(source);
}
function isGitHubRef(ref) {
  return GITHUB_REF_PATTERN.test(ref);
}
function isGitHubRulebookSource(source) {
  return GITHUB_SOURCE_RE.test(source);
}
function assertBareRulebookName(source) {
  if (!NAME_PATTERN.test(source)) {
    throw new Error(`Local rulebook sources must be bare names matching ${NAME_PATTERN}: ${source}`);
  }
}

// src/core/policy/paths.ts
var RULES_CONFIG_FILE = "rule.json";
var POLICY_FILE = "policy.json";
var SAFETY_NET_DIR = ".cc-safety-net";
var RULES_SUBDIR = "rules";
var CC_SAFETY_NET_HOME = "CC_SAFETY_NET_HOME";
var RULE_UPDATE_COMMAND = "`cc-safety-net rule update`";
function getProjectRulesDir(cwd) {
  return import_node_path2.resolve(cwd, RULES_DIR);
}
function getProjectRulesConfigPath(cwd) {
  return import_node_path2.join(getProjectRulesDir(cwd), RULES_CONFIG_FILE);
}
function getProjectPolicyPath(cwd) {
  return import_node_path2.join(import_node_path2.resolve(cwd), SAFETY_NET_DIR, POLICY_FILE);
}
function getUserRulesDir(environment, options = {}) {
  return options.userConfigDir ?? (options.userConfigPath ? import_node_path2.dirname(options.userConfigPath) : import_node_path2.join(getUserSafetyNetHome(environment), RULES_SUBDIR));
}
function getUserSafetyNetHome(environment) {
  const home = environment.env.get(CC_SAFETY_NET_HOME);
  return home ? import_node_path2.resolve(normalizeMsysDrivePath(home)) : import_node_path2.join(environment.home, SAFETY_NET_DIR);
}
function getUserRulesConfigPath(environment, options = {}) {
  return import_node_path2.join(getUserRulesDir(environment, options), RULES_CONFIG_FILE);
}
function getUserPolicyPath(environment, options = {}) {
  return import_node_path2.join(import_node_path2.dirname(getUserRulesDir(environment, options)), POLICY_FILE);
}
function projectPolicyIsUserPolicy(environment, options) {
  const budget = createBudget();
  return resolveExistingPath(getProjectPolicyPath(options.cwd), environment.paths, budget) === resolveExistingPath(import_node_path2.resolve(getUserPolicyPath(environment, options)), environment.paths, budget);
}
function getPolicyPaths(environment, options) {
  const userConfigPath = options.userConfigPath ?? getUserRulesConfigPath(environment, options);
  const projectConfigPath = options.projectConfigPath ?? getProjectRulesConfigPath(options.cwd);
  const userScope = getUserPolicyFilesystemScope(environment, options);
  const projectScope = getProjectPolicyFilesystemScope(projectConfigPath, options.cwd);
  return {
    userConfigPath,
    projectConfigPath,
    userScope,
    projectScope,
    userConfigTarget: import_safe_read.getPolicyFilesystemTargetForPath(userScope, userConfigPath),
    projectConfigTarget: import_safe_read.getPolicyFilesystemTargetForPath(projectScope, projectConfigPath)
  };
}
function getUserPolicyFilesystemScope(environment, options) {
  const root = options.userConfigPath ? import_node_path2.dirname(import_node_path2.dirname(import_node_path2.resolve(options.userConfigPath))) : import_node_path2.dirname(import_node_path2.resolve(options.userConfigDir ?? getUserRulesDir(environment, options)));
  return import_safe_read.bindPolicyFilesystemScope(root, "user policy");
}
function getProjectPolicyFilesystemScope(configPath, cwd) {
  const projectRoot = import_node_path2.resolve(cwd);
  const absoluteConfigPath = import_node_path2.resolve(configPath);
  const fromCwd = import_node_path2.relative(projectRoot, absoluteConfigPath);
  if (fromCwd !== ".." && !fromCwd.startsWith(`..${import_node_path2.sep}`) && !import_node_path2.isAbsolute(fromCwd)) {
    return import_safe_read.bindPolicyFilesystemScope(projectRoot, "project policy");
  }
  return import_safe_read.bindPolicyFilesystemScope(import_node_path2.dirname(import_node_path2.dirname(absoluteConfigPath)), "project policy");
}
function getLocalRulebookPath(configDir, name) {
  return import_node_path2.join(configDir, name, RULEBOOK_FILE);
}

// src/core/policy/store.ts
var import_node_fs = require("node:fs");
var import_destructive2 = require("./core-shell.js");
var import_secret2 = require("./core-shell.js");

// src/core/policy/allow-paths.ts
var import_node_path3 = require("node:path");
var IS_WINDOWS = process.platform === "win32";
var GLOB_CHARS = /[*?]/;
function parseRecursiveSecretAllowPath(path) {
  const trimmed = path.trim();
  const match = /^(.*)\/\*\*\/([^/*?\\]+)$/.exec(IS_WINDOWS ? trimmed.replaceAll("\\", "/") : trimmed);
  if (!match)
    return null;
  const root = match[1] ?? "";
  const name = match[2] ?? "";
  if (GLOB_CHARS.test(root) || name === "." || name === "..")
    return null;
  return { root: root || "/", name };
}
function expandAllowPathHome(path, home) {
  if (path === "~")
    return home;
  if (path.startsWith("~/"))
    return `${home}${path.slice(1)}`;
  return path;
}
function getDestructiveAllowPathError(value, home) {
  if (typeof value !== "string" || value.trim() === "") {
    return "must be a non-empty path string";
  }
  const expanded = expandAllowPathHome(value.trim(), home);
  if (!import_node_path3.isAbsolute(expanded)) {
    return "must be an absolute path or start with ~/";
  }
  return getAllowPathHomeConflictError(expanded, home);
}
function getSecretDenyPathError(value, home) {
  const expanded = expandSecretPolicyEntry(value, home);
  if (expanded === null)
    return "must be a non-empty path string";
  if (!import_node_path3.isAbsolute(expanded))
    return null;
  if (getAllowPathHomeConflictError(expanded, home) === null)
    return null;
  return "cannot be the home directory or a path above it (this would block every command the agent runs)";
}
var SECRET_ALLOW_DISABLES_EVERYTHING = "cannot cover the home directory or a path above it (this would disable secret protection everywhere)";
var SECRET_ALLOW_GUARD_CONFIG = "cannot cover the guard's own configuration";
function expandSecretPolicyEntry(value, home) {
  if (typeof value !== "string" || value.trim() === "")
    return null;
  const trimmed = value.trim();
  const path = IS_WINDOWS ? trimmed.replaceAll("\\", "/") : trimmed;
  return expandAllowPathHome(path.replace(/^\$(?:\{HOME\}|HOME(?=\/|$))/, "~"), home);
}
function getSecretAllowPathError(value, home) {
  const expanded = expandSecretPolicyEntry(value, home);
  if (expanded === null)
    return "must be a non-empty path string";
  const root = parseRecursiveSecretAllowPath(expanded)?.root ?? expanded;
  if (GLOB_CHARS.test(root)) {
    return "supports only a folder followed by **/ and an exact file name, such as ~/code/**/.env.local";
  }
  if (!import_node_path3.isAbsolute(root))
    return null;
  if (getAllowPathHomeConflictError(root, home) !== null) {
    return SECRET_ALLOW_DISABLES_EVERYTHING;
  }
  return coversGuardConfig(root, home) ? SECRET_ALLOW_GUARD_CONFIG : null;
}
function coversGuardConfig(absolutePath, home) {
  const normalized = comparableAllowPath(absolutePath);
  const guardRoot = comparableAllowPath(import_node_path3.join(home, ".cc-safety-net"));
  return normalized === guardRoot || normalized.startsWith(`${guardRoot}${import_node_path3.sep}`);
}
function getAllowPathHomeConflictError(absolutePath, home) {
  const normalized = comparableAllowPath(absolutePath);
  const normalizedHome = comparableAllowPath(home);
  if (normalized === normalizedHome)
    return "cannot be the home directory";
  const prefix = normalized.endsWith(import_node_path3.sep) ? normalized : `${normalized}${import_node_path3.sep}`;
  if (normalizedHome.startsWith(prefix))
    return "cannot contain the home directory";
  return null;
}
function comparableAllowPath(path) {
  let normalized = import_node_path3.normalize(path);
  if (IS_WINDOWS)
    normalized = normalized.replace(/\//g, "\\").toLowerCase();
  if (normalized.length > (IS_WINDOWS ? 3 : 1) && normalized.endsWith(import_node_path3.sep)) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

// src/core/policy/audit-retention-days.ts
var DEFAULT_AUDIT_RETENTION_DAYS = 30;
var MIN_AUDIT_RETENTION_DAYS = 1;
var MAX_AUDIT_RETENTION_DAYS = 365;
function clampAuditRetentionDays(value) {
  if (typeof value !== "number" || !Number.isInteger(value))
    return DEFAULT_AUDIT_RETENTION_DAYS;
  if (value < MIN_AUDIT_RETENTION_DAYS)
    return MIN_AUDIT_RETENTION_DAYS;
  return value > MAX_AUDIT_RETENTION_DAYS ? MAX_AUDIT_RETENTION_DAYS : value;
}

// src/core/policy/effective-rules.ts
var import_destructive = require("./core-shell.js");
var CATASTROPHIC_DESTRUCTIVE_COMMAND_RULE_IDS = new Set(import_destructive.DESTRUCTIVE_COMMAND_RULE_METADATA.filter((rule) => rule.catastrophic).map((rule) => rule.id));
function filterDestructiveCommandMatch(match, policy) {
  if (!match)
    return null;
  if (CATASTROPHIC_DESTRUCTIVE_COMMAND_RULE_IDS.has(match.id)) {
    return match;
  }
  if (policy?.destructiveCommandProtectionEnabled === false)
    return null;
  const effectiveRule = policy?.effectiveDestructiveCommandRules[match.id];
  return effectiveRule && !effectiveRule.enabled ? null : match;
}
function destructiveCommandRuleIsEnabled(policy, id, inheritedEnabled) {
  if (CATASTROPHIC_DESTRUCTIVE_COMMAND_RULE_IDS.has(id))
    return true;
  if (policy?.destructiveCommandProtectionEnabled === false)
    return false;
  return policy?.effectiveDestructiveCommandRules[id]?.enabled ?? inheritedEnabled;
}
function resolveEffectiveDestructiveCommandRules(policy, capabilities) {
  return Object.freeze(Object.fromEntries(import_destructive.DESTRUCTIVE_COMMAND_RULE_METADATA.map((rule) => {
    const capability = rule.activationCapability ? capabilities[rule.activationCapability] : undefined;
    const inheritedEnabled = capability?.enabled ?? true;
    const override = policy.destructiveCommandRuleOverrides[rule.id];
    const state = rule.catastrophic ? {
      enabled: true,
      inheritedEnabled: true,
      changesInherited: false,
      source: "catastrophic",
      ...override ? { override } : {}
    } : policy.destructiveCommandProtectionEnabled ? override ? {
      enabled: override === "on",
      inheritedEnabled,
      changesInherited: override === "on" !== inheritedEnabled,
      source: "rule_override",
      ...rule.activationCapability ? { activationCapability: rule.activationCapability } : {},
      override
    } : {
      enabled: inheritedEnabled,
      inheritedEnabled,
      changesInherited: false,
      source: capability?.source ?? "built_in_default",
      ...rule.activationCapability ? { activationCapability: rule.activationCapability } : {}
    } : {
      enabled: false,
      inheritedEnabled,
      changesInherited: false,
      source: "master_disabled",
      ...rule.activationCapability ? { activationCapability: rule.activationCapability } : {},
      ...override ? { override } : {}
    };
    return [rule.id, Object.freeze(state)];
  })));
}
function createCommandAnalysisPolicy(policy, capabilities) {
  return Object.freeze({
    ...policy,
    effectiveDestructiveCommandRules: resolveEffectiveDestructiveCommandRules(policy, capabilities)
  });
}

// src/core/policy/safety-level.ts
var SAFETY_OVERRIDE_KEYS = [
  "fail_closed",
  "paranoid_rm",
  "paranoid_interpreters"
];
var SAFETY_LEVEL_CAPABILITIES = {
  standard: { fail_closed: false, paranoid_rm: false, paranoid_interpreters: false },
  strict: { fail_closed: true, paranoid_rm: false, paranoid_interpreters: false },
  paranoid: { fail_closed: true, paranoid_rm: true, paranoid_interpreters: true }
};

// src/core/policy/env.ts
var ENV_FLAGS = {
  level: { name: "CC_SAFETY_NET_LEVEL" },
  strict: { name: "CC_SAFETY_NET_STRICT", legacyName: "SAFETY_NET_STRICT" },
  paranoid: { name: "CC_SAFETY_NET_PARANOID", legacyName: "SAFETY_NET_PARANOID" },
  paranoidRm: { name: "CC_SAFETY_NET_PARANOID_RM", legacyName: "SAFETY_NET_PARANOID_RM" },
  paranoidInterpreters: {
    name: "CC_SAFETY_NET_PARANOID_INTERPRETERS",
    legacyName: "SAFETY_NET_PARANOID_INTERPRETERS"
  },
  worktree: { name: "CC_SAFETY_NET_WORKTREE", legacyName: "SAFETY_NET_WORKTREE" },
  debug: { name: "CC_SAFETY_NET_DEBUG" },
  auditScope: { name: "CC_SAFETY_NET_AUDIT_SCOPE" },
  projectTightenOnly: { name: "CC_SAFETY_NET_PROJECT_TIGHTEN_ONLY" }
};
var SAFETY_LEVELS = ["standard", "strict", "paranoid"];
function maxSafetyLevel(policyLevel, envLevel) {
  if (!envLevel)
    return policyLevel;
  return SAFETY_LEVELS.indexOf(envLevel) > SAFETY_LEVELS.indexOf(policyLevel) ? envLevel : policyLevel;
}
function envSafetyLevel(env) {
  const value = getEnvFlagValue(ENV_FLAGS.level, env);
  return SAFETY_LEVELS.find((level) => level === value);
}
function sessionSafetyLevel(policyLevel, env) {
  return maxSafetyLevel(policyLevel, envSafetyLevel(env));
}
function parseEnvLevel(env) {
  const value = getEnvFlagValue(ENV_FLAGS.level, env);
  if (!value)
    return;
  const level = envSafetyLevel(env);
  if (level)
    return level;
  console.error(`CC Safety Net: ignored invalid ${ENV_FLAGS.level.name}=${JSON.stringify(value.slice(0, 40))}. Use ${SAFETY_LEVELS.join(", ")}.`);
  return;
}
function resolveAuditScope(value) {
  if (value === undefined || value === "all")
    return "all";
  if (value === "blocked")
    return "blocked";
  return "invalid";
}
function shouldRecordAllowedCommands(env) {
  return resolveAuditScope(getEnvFlagValue(ENV_FLAGS.auditScope, env)) === "all";
}
function deriveEffectiveSafetyLevel(values) {
  if (values.failClosed && values.paranoidRm && values.paranoidInterpreters)
    return "paranoid";
  if (values.failClosed && !values.paranoidRm && !values.paranoidInterpreters)
    return "strict";
  if (!values.failClosed && !values.paranoidRm && !values.paranoidInterpreters)
    return "standard";
  return "custom";
}
function getCCSafetyNetEnvModes(policy = {}, env) {
  const policyLevel = policy.safety?.level ?? "standard";
  const envLevel = parseEnvLevel(env);
  const baseLevel = maxSafetyLevel(policyLevel, envLevel);
  const presetCapabilities = SAFETY_LEVEL_CAPABILITIES[baseLevel];
  const values = {
    failClosed: presetCapabilities.fail_closed,
    paranoidRm: presetCapabilities.paranoid_rm,
    paranoidInterpreters: presetCapabilities.paranoid_interpreters
  };
  const capabilitySources = {
    failClosed: baseLevel === policyLevel ? "preset" : "environment",
    paranoidRm: baseLevel === policyLevel ? "preset" : "environment",
    paranoidInterpreters: baseLevel === policyLevel ? "preset" : "environment"
  };
  const sources = {
    failClosed: [`policy safety.level=${policyLevel}`],
    paranoidRm: [`policy safety.level=${policyLevel}`],
    paranoidInterpreters: [`policy safety.level=${policyLevel}`]
  };
  if (baseLevel !== policyLevel) {
    sources.failClosed.push(`env ${ENV_FLAGS.level.name}=${envLevel}`);
    sources.paranoidRm.push(`env ${ENV_FLAGS.level.name}=${envLevel}`);
    sources.paranoidInterpreters.push(`env ${ENV_FLAGS.level.name}=${envLevel}`);
  }
  if (policy.safety?.overrides?.failClosed !== undefined) {
    values.failClosed = policy.safety.overrides.failClosed;
    capabilitySources.failClosed = "capability_override";
    sources.failClosed.push("policy safety.overrides.fail_closed");
  }
  if (policy.safety?.overrides?.paranoidRm !== undefined) {
    values.paranoidRm = policy.safety.overrides.paranoidRm;
    capabilitySources.paranoidRm = "capability_override";
    sources.paranoidRm.push("policy safety.overrides.paranoid_rm");
  }
  if (policy.safety?.overrides?.paranoidInterpreters !== undefined) {
    values.paranoidInterpreters = policy.safety.overrides.paranoidInterpreters;
    capabilitySources.paranoidInterpreters = "capability_override";
    sources.paranoidInterpreters.push("policy safety.overrides.paranoid_interpreters");
  }
  if (envTruthy(ENV_FLAGS.strict, env)) {
    values.failClosed = true;
    capabilitySources.failClosed = "environment";
    sources.failClosed.push(`env ${ENV_FLAGS.strict.name}`);
  }
  if (envTruthy(ENV_FLAGS.paranoid, env)) {
    values.paranoidRm = true;
    values.paranoidInterpreters = true;
    capabilitySources.paranoidRm = "environment";
    capabilitySources.paranoidInterpreters = "environment";
    sources.paranoidRm.push(`env ${ENV_FLAGS.paranoid.name}`);
    sources.paranoidInterpreters.push(`env ${ENV_FLAGS.paranoid.name}`);
  }
  if (envTruthy(ENV_FLAGS.paranoidRm, env)) {
    values.paranoidRm = true;
    capabilitySources.paranoidRm = "environment";
    sources.paranoidRm.push(`env ${ENV_FLAGS.paranoidRm.name}`);
  }
  if (envTruthy(ENV_FLAGS.paranoidInterpreters, env)) {
    values.paranoidInterpreters = true;
    capabilitySources.paranoidInterpreters = "environment";
    sources.paranoidInterpreters.push(`env ${ENV_FLAGS.paranoidInterpreters.name}`);
  }
  const worktreeMode = !!policy.worktreeMode || envTruthy(ENV_FLAGS.worktree, env);
  return {
    strict: values.failClosed,
    paranoidRm: values.paranoidRm,
    paranoidInterpreters: values.paranoidInterpreters,
    worktreeMode,
    effectiveLevel: deriveEffectiveSafetyLevel(values),
    capabilities: {
      fail_closed: {
        enabled: values.failClosed,
        source: capabilitySources.failClosed,
        sources: sources.failClosed
      },
      paranoid_rm: {
        enabled: values.paranoidRm,
        source: capabilitySources.paranoidRm,
        sources: sources.paranoidRm
      },
      paranoid_interpreters: {
        enabled: values.paranoidInterpreters,
        source: capabilitySources.paranoidInterpreters,
        sources: sources.paranoidInterpreters
      }
    }
  };
}
function envTruthy(flag, env) {
  const value = typeof flag === "string" ? getOwnEnvValue(flag, env) : getEnvFlagValue(flag, env);
  return value === "1" || value?.toLowerCase() === "true";
}
function getOwnEnvValue(name, env) {
  return env.get(name);
}
function getEnvFlagValue(flag, env) {
  const value = getOwnEnvValue(flag.name, env);
  if (value !== undefined)
    return value;
  if (flag.legacyName) {
    return getOwnEnvValue(flag.legacyName, env);
  }
  return;
}
function envFlagIsSet(flag, env) {
  return getOwnEnvValue(flag.name, env) !== undefined || !!flag.legacyName && getOwnEnvValue(flag.legacyName, env) !== undefined;
}

// src/core/policy/merge.ts
var import_secret = require("./core-shell.js");
var LEVEL_RANK = { standard: 0, strict: 1, paranoid: 2 };
function mergeProjectPolicy(user, project, tightenOnly = false, sessionLevel = user.safety.level) {
  const weakenings = collectWeakenings(user, project, sessionLevel);
  const ignored = new Set(tightenOnly ? weakenings.map((weakening) => weakening.field) : []);
  const kept = (field, value) => ignored.has(field) ? undefined : value;
  const keptEntries = (field, entries) => Object.fromEntries(Object.entries(entries ?? {}).filter(([key]) => !ignored.has(`${field}.${key}`)));
  const keptPaths = (field, paths) => paths?.filter((path) => !ignored.has(`${field}.${path}`));
  const policy = {
    version: 1,
    safety: {
      level: kept("safety.level", project.safety?.level) ?? user.safety.level,
      overrides: {
        ...user.safety.overrides,
        ...keptEntries("safety.overrides", project.safety?.overrides)
      }
    },
    workflow: {
      worktree_mode: kept("workflow.worktree_mode", project.workflow?.worktree_mode) ?? user.workflow.worktree_mode
    },
    destructive_command_protection: {
      enabled: kept("destructive_command_protection.enabled", project.destructive_command_protection?.enabled) ?? user.destructive_command_protection.enabled,
      overrides: {
        ...user.destructive_command_protection.overrides,
        ...keptEntries("destructive_command_protection.overrides", project.destructive_command_protection?.overrides)
      },
      allow_paths: unionPaths(user.destructive_command_protection.allow_paths, keptPaths("destructive_command_protection.allow_paths", project.destructive_command_protection?.allow_paths))
    },
    secret_protection: {
      enabled: kept("secret_protection.enabled", project.secret_protection?.enabled) ?? user.secret_protection.enabled,
      overrides: {
        ...user.secret_protection.overrides,
        ...keptEntries("secret_protection.overrides", project.secret_protection?.overrides)
      },
      deny_paths: unionPaths(user.secret_protection.deny_paths, project.secret_protection?.deny_paths),
      allow_paths: unionPaths(user.secret_protection.allow_paths, keptPaths("secret_protection.allow_paths", project.secret_protection?.allow_paths))
    },
    audit: user.audit
  };
  return { policy, weakenings: weakenings.map((weakening) => weakening.message) };
}
function unionPaths(user, project) {
  return [...new Set([...user, ...project ?? []])];
}
function collectWeakenings(user, project, sessionLevel) {
  const level = project.safety?.level;
  const capabilities = SAFETY_LEVEL_CAPABILITIES[sessionLevel];
  return [
    ...level && LEVEL_RANK[level] < LEVEL_RANK[user.safety.level] ? [
      {
        field: "safety.level",
        message: `project policy lowers level: ${user.safety.level} -> ${level}`
      }
    ] : [],
    ...SAFETY_OVERRIDE_KEYS.flatMap((key) => project.safety?.overrides?.[key] === false && (user.safety.overrides[key] ?? capabilities[key]) ? [{ field: `safety.overrides.${key}`, message: `project policy disables ${key}` }] : []),
    ...project.workflow?.worktree_mode === true && !user.workflow.worktree_mode ? [
      {
        field: "workflow.worktree_mode",
        message: "project policy enables worktree mode relaxations"
      }
    ] : [],
    ...project.destructive_command_protection?.enabled === false && user.destructive_command_protection.enabled ? [
      {
        field: "destructive_command_protection.enabled",
        message: "project policy disables destructive command protection"
      }
    ] : [],
    ...project.secret_protection?.enabled === false && user.secret_protection.enabled ? [
      {
        field: "secret_protection.enabled",
        message: "project policy disables secret protection"
      }
    ] : [],
    ...disabledRules("destructive_command_protection.overrides", project.destructive_command_protection?.overrides, (id) => user.destructive_command_protection.enabled && user.destructive_command_protection.overrides[id] !== "off"),
    ...disabledRules("secret_protection.overrides", project.secret_protection?.overrides, (id) => user.secret_protection.enabled && (user.secret_protection.overrides[id] === "on" ? true : user.secret_protection.overrides[id] !== "off" && !import_secret.SECRET_DEFAULT_OFF_RULE_ID_SET.has(id))),
    ...user.destructive_command_protection.enabled ? addedPaths(user.destructive_command_protection.allow_paths, project.destructive_command_protection?.allow_paths).map((path) => ({
      field: `destructive_command_protection.allow_paths.${path}`,
      message: `project policy adds destructive allow path: ${path}`
    })) : [],
    ...user.secret_protection.enabled ? addedPaths(user.secret_protection.allow_paths, project.secret_protection?.allow_paths).map((path) => ({
      field: `secret_protection.allow_paths.${path}`,
      message: `project policy adds secret allow path: ${path}`
    })) : []
  ];
}
function disabledRules(field, overrides, wasEnabled) {
  return Object.entries(overrides ?? {}).flatMap(([id, override]) => override === "off" && wasEnabled(id) ? [{ field: `${field}.${id}`, message: `project policy disables rule ${id}` }] : []);
}
function addedPaths(user, project) {
  return (project ?? []).filter((path) => !user.includes(path));
}

// src/core/decision.ts
var BLOCK_INTENTS = Object.freeze([
  "hard_stop",
  "use_alternative",
  "scope_down",
  "manual_only",
  "stop_and_explain"
]);

// src/core/policy/rules-config.ts
var import_safe_read2 = require("./core-shell.js");
var import_constants2 = require("./core-shell.js");

// src/core/policy/resource-limits.ts
var RULE_SOURCE_LIMIT = 64;
var RULE_SOURCE_LIMIT_ERROR = "Rule config exceeds CC Safety Net's safe source limit.";

// src/core/policy/transparent-wrappers.ts
var import_constants = require("./core-shell.js");
var import_tokens = require("./core-shell.js");
var BUILTIN_ANALYZED_COMMANDS = new Set(["rm", "find", "xargs", "parallel"]);
var RESERVED_TRANSPARENT_WRAPPERS = new Set([
  "git",
  "busybox",
  ...BUILTIN_ANALYZED_COMMANDS,
  ...import_constants.SHELL_WRAPPERS,
  ...import_constants.INTERPRETERS,
  ...import_constants.AWK_INTERPRETERS
]);
var CODE_FLAG_INTERPRETERS = new Set(["python", "node", "ruby", "perl"]);
function isReservedTransparentWrapper(command) {
  const normalized = import_tokens.normalizeCommandToken(command);
  return RESERVED_TRANSPARENT_WRAPPERS.has(normalized) || isInterpreterCommand(normalized);
}
function isInterpreterCommand(command) {
  return CODE_FLAG_INTERPRETERS.has(normalizeInterpreter(command));
}
function normalizeInterpreter(command) {
  const interpreter = import_tokens.getBasename(command).toLowerCase();
  return import_constants.PYTHON_INTERPRETER_PATTERN.test(interpreter) ? "python" : interpreter;
}

// src/core/policy/rules-config.ts
var DEFAULT_CONFIG = {
  version: 1,
  rules: [],
  overrides: {},
  transparent_wrappers: []
};
function readRulesConfig(path) {
  try {
    const content = import_safe_read2.readPolicyFile(toTarget(path));
    if (content === null)
      return { config: null, errors: [] };
    if (!content.trim()) {
      return { config: null, errors: ["Config file is empty"] };
    }
    const parsed = JSON.parse(content);
    const validation = getRulesConfigValidation(parsed);
    if (validation.errors.length > 0) {
      return { config: null, errors: validation.errors };
    }
    return {
      config: {
        version: 1,
        rules: parsed.rules ?? [],
        overrides: parsed.overrides ?? {},
        transparent_wrappers: parsed.transparent_wrappers ?? []
      },
      errors: []
    };
  } catch (error) {
    if (error instanceof import_safe_read2.PolicyFilesystemError) {
      return { config: null, errors: [error.message] };
    }
    const message = error instanceof Error ? error.message : String(error);
    return {
      config: null,
      errors: [error instanceof SyntaxError ? "Invalid JSON" : message]
    };
  }
}
function toTarget(path) {
  return typeof path === "string" ? import_safe_read2.bindDelegatedPolicyFilesystemTarget(path) : path;
}
var typed = (path, message) => ({
  path,
  message,
  kind: "typed"
});
var custom = (path, message) => ({
  path,
  message,
  kind: "custom"
});
function duplicateRuleNameIssues(rules) {
  const names = new Set;
  return rules.flatMap((rule, index) => {
    const name = isRecord(rule) ? rule.name : undefined;
    if (typeof name !== "string")
      return [];
    if (names.has(name.toLowerCase())) {
      return [custom(["rules", index, "name"], `duplicate rule name "${name}"`)];
    }
    names.add(name.toLowerCase());
    return [];
  });
}
var INTENT_ERROR = `must be one of ${BLOCK_INTENTS.join(", ")}`;
var RULE_OVERRIDE_KEY_PATTERN = /^[^/]+\/[^/]+$/;
var RULES_CONFIG_FIELDS = ["version", "rules", "overrides", "transparent_wrappers"];
function getRulesConfigValidation(config) {
  const issues = rulesConfigIssues(config);
  return {
    errors: formatIssues(sortIssues(issues, RULES_CONFIG_FIELDS, (issue) => issue.kind === "custom"), ": ", " "),
    sources: collectValidSources(config, issues)
  };
}
function rulesConfigIssues(config) {
  if (!isRecord(config))
    return [typed([], "Config must be an object")];
  const overLimit = Array.isArray(config.rules) && config.rules.length > RULE_SOURCE_LIMIT;
  return [
    ...config.version === 1 ? [] : [typed(["version"], "must be 1")],
    ...ruleSourceIssues(config.rules, overLimit),
    ...ruleOverrideIssues(config.overrides),
    ...transparentWrapperIssues(config.transparent_wrappers),
    ...overLimit ? [] : duplicateRuleSourceIssues(config.rules),
    ...isRecord(config.overrides) ? Object.keys(config.overrides).filter((key) => !RULE_OVERRIDE_KEY_PATTERN.test(key)).map((key) => custom(["overrides", key], "must use <rulebook-name>/<rule-name>")) : [],
    ...reservedWrapperIssues(config.transparent_wrappers)
  ];
}
function ruleSourceIssues(rules, overLimit) {
  if (rules === undefined)
    return [];
  if (!Array.isArray(rules)) {
    return [
      typed(["rules"], "must be an array of rulebook source strings"),
      ...exceedsLength(rules, RULE_SOURCE_LIMIT) ? [typed(["rules"], RULE_SOURCE_LIMIT_ERROR)] : []
    ];
  }
  if (overLimit)
    return [{ path: ["rules"], message: RULE_SOURCE_LIMIT_ERROR, kind: "limit" }];
  return rules.flatMap((source, index) => {
    if (typeof source !== "string") {
      return [
        typed(["rules", index], "must be a rulebook source string"),
        ...fallsShortOfLength(source, 1) ? [typed(["rules", index], "must be a non-empty rulebook source string")] : []
      ];
    }
    return source === "" ? [typed(["rules", index], "must be a non-empty rulebook source string")] : [];
  });
}
function exceedsLength(value, maximum) {
  const length = lengthOf(value);
  return length !== undefined && !(length <= maximum);
}
function fallsShortOfLength(value, minimum) {
  const length = lengthOf(value);
  return length !== undefined && !(length >= minimum);
}
function lengthOf(value) {
  if (value === null || value === undefined)
    return;
  const length = value.length;
  return length === undefined ? undefined : Number(length);
}
function duplicateRuleSourceIssues(rules) {
  if (!Array.isArray(rules))
    return [];
  const sources = new Set;
  return rules.flatMap((source, index) => {
    if (typeof source !== "string" || source === "")
      return [];
    if (source.trim() === "") {
      return [custom(["rules", index], "must be a non-empty rulebook source string")];
    }
    const sourceError = getRulebookSourceSyntaxError(source);
    if (sourceError)
      return [custom(["rules", index], sourceError)];
    if (sources.has(source)) {
      return [custom(["rules", index], `duplicate rulebook source "${source}"`)];
    }
    sources.add(source);
    return [];
  });
}
function ruleOverrideIssues(overrides) {
  if (overrides === undefined)
    return [];
  if (!isRecord(overrides))
    return [typed(["overrides"], "must be an object if provided")];
  return Object.keys(overrides).flatMap((key) => {
    const override = overrides[key];
    if (override === "off")
      return [];
    if (!isRecord(override))
      return [typed(["overrides", key], 'must be "off" or an object')];
    return [
      ...overrideReasonIssues(override.reason, ["overrides", key, "reason"]),
      ...override.intent === undefined || isBlockIntent(override.intent) ? [] : [typed(["overrides", key, "intent"], INTENT_ERROR)]
    ];
  });
}
function overrideReasonIssues(reason, path) {
  if (typeof reason !== "string") {
    return [
      typed(path, "required non-empty string"),
      ...exceedsLength(reason, import_constants2.MAX_REASON_LENGTH) ? [typed(path, `must be at most ${import_constants2.MAX_REASON_LENGTH} characters`)] : []
    ];
  }
  if (reason === "")
    return [typed(path, "required non-empty string")];
  return reason.length > import_constants2.MAX_REASON_LENGTH ? [typed(path, `must be at most ${import_constants2.MAX_REASON_LENGTH} characters`)] : [];
}
function transparentWrapperIssues(wrappers) {
  if (wrappers === undefined)
    return [];
  if (!Array.isArray(wrappers)) {
    return [typed(["transparent_wrappers"], "must be an array of command strings")];
  }
  return wrappers.flatMap((wrapper, index) => {
    if (typeof wrapper !== "string") {
      return [typed(["transparent_wrappers", index], "must be a command string")];
    }
    return import_constants2.COMMAND_PATTERN.test(wrapper) ? [] : [typed(["transparent_wrappers", index], "must match command pattern")];
  });
}
function reservedWrapperIssues(wrappers) {
  if (!Array.isArray(wrappers))
    return [];
  const seen = new Set;
  return wrappers.flatMap((wrapper, index) => {
    if (typeof wrapper !== "string" || !import_constants2.COMMAND_PATTERN.test(wrapper))
      return [];
    if (seen.has(wrapper)) {
      return [custom(["transparent_wrappers", index], `duplicate command "${wrapper}"`)];
    }
    if (isReservedTransparentWrapper(wrapper)) {
      return [
        custom(["transparent_wrappers", index], `reserved command "${wrapper}" cannot be a wrapper`)
      ];
    }
    seen.add(wrapper);
    return [];
  });
}
function collectValidSources(config, issues) {
  const rules = isRecord(config) ? config.rules : undefined;
  if (!Array.isArray(rules))
    return new Set;
  if (issues.some((issue) => issue.path.length === 1 && issue.path[0] === "rules")) {
    return new Set;
  }
  const rejected = new Set(issues.filter((issue) => issue.path[0] === "rules" && typeof issue.path[1] === "number").map((issue) => issue.path[1]));
  return new Set(rules.filter((source, index) => typeof source === "string" && !rejected.has(index)));
}
function sortIssues(issues, fields, isRefinement) {
  const entries = issues.map((issue) => issue.path[1]);
  const entryOrder = [...new Set(entries.filter((entry) => typeof entry === "string"))];
  const rank = (issue, entry) => [
    issue.path.length === 0 ? -1 : fields.indexOf(String(issue.path[0])),
    typeof entry === "number" ? entry : entryOrder.indexOf(String(entry)),
    isRefinement(issue) ? 0 : 1
  ];
  return issues.map((issue, index) => ({ issue, rank: rank(issue, entries[index]) })).sort((a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1] || a.rank[2] - b.rank[2]).map((entry) => entry.issue);
}
function formatIssues(issues, separator, topLevelSeparator) {
  return [
    ...new Set(issues.map((issue) => {
      const rendered = renderIssuePath(issue.path);
      if (issue.kind === "unknownKeys") {
        return `${rendered ? `${rendered}.` : ""}unknown field "${issue.message}"`;
      }
      if (issue.kind === "key" || issue.kind === "limit" || issue.path.length === 0) {
        return issue.message;
      }
      return `${rendered}${issue.path.length === 1 ? topLevelSeparator : separator}${issue.message}`;
    }))
  ];
}
function renderIssuePath(path) {
  return path.map((segment, index) => {
    if (typeof segment === "number")
      return `[${segment}]`;
    return index === 0 ? String(segment) : `.${String(segment)}`;
  }).join("");
}
function isBlockIntent(value) {
  return BLOCK_INTENTS.includes(value);
}
function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

// src/core/policy/store.ts
var SAFETY_LEVELS2 = new Set(["standard", "strict", "paranoid"]);
var DEFAULT_GUI_POLICY = {
  version: 1,
  safety: {
    level: "standard",
    overrides: {}
  },
  workflow: {
    worktree_mode: false
  },
  destructive_command_protection: {
    enabled: true,
    overrides: {},
    allow_paths: []
  },
  secret_protection: {
    enabled: true,
    overrides: {},
    deny_paths: [],
    allow_paths: []
  },
  audit: {
    retention_days: DEFAULT_AUDIT_RETENTION_DAYS
  }
};
function loadPolicyConfig(environment, options) {
  const user = readPolicyConfig(getUserPolicyPath(environment, options), environment.home);
  const projectFile = projectPolicyIsUserPolicy(environment, options) ? { exists: false, policy: createDefaultGuiPolicy(), errors: [] } : readPolicyFile2(getProjectPolicyPath(options.cwd), environment.home);
  const project = projectPolicyProjection(projectFile.parsed, environment.home);
  const weakeningsIgnored = envTruthy(ENV_FLAGS.projectTightenOnly, environment.env);
  const userPolicy = user.gui ?? DEFAULT_GUI_POLICY;
  const merged = Object.keys(project.policy).length > 0 ? mergeProjectPolicy(userPolicy, project.policy, weakeningsIgnored, sessionSafetyLevel(userPolicy.safety.level, environment.env)) : undefined;
  const errors = [...user.errors, ...projectFile.errors, ...project.diagnostics];
  const fallback = (user.fallback === "defaults" && merged ? "salvaged" : user.fallback) ?? (user.gui ? undefined : projectFile.fallback) ?? (errors.length > 0 ? "salvaged" : undefined);
  const levelScope = project.policy.safety?.level && merged?.policy.safety.level === project.policy.safety.level ? "project" : user.levelPresent ? "user" : "default";
  return {
    ...merged ? normalizePolicyConfig(merged.policy) : user.policy,
    errors,
    ...fallback ? { fallback } : {},
    ...projectFile.exists ? {
      policyScopes: { levelScope, weakenings: merged?.weakenings ?? [], weakeningsIgnored }
    } : {}
  };
}
var PROJECT_AUDIT_DIAGNOSTIC = "project policy audit settings are ignored; audit is user scope only";
function projectPolicyProjection(value, home) {
  if (!isRecord2(value))
    return { policy: {}, diagnostics: [] };
  const safety = isRecord2(value.safety) ? value.safety : {};
  const workflow = isRecord2(value.workflow) ? value.workflow : {};
  const destructive = isRecord2(value.destructive_command_protection) ? value.destructive_command_protection : {};
  const secret = isRecord2(value.secret_protection) ? value.secret_protection : {};
  const safetySection = {
    ...SAFETY_LEVELS2.has(safety.level) ? { level: safety.level } : {},
    ...isRecord2(safety.overrides) ? withPresentFields({
      overrides: pickBooleans(safety.overrides, SAFETY_OVERRIDE_KEYS, ["safety", "overrides"], IGNORE_ISSUES)
    }) : {}
  };
  const destructiveSection = {
    ...typeof destructive.enabled === "boolean" ? { enabled: destructive.enabled } : {},
    ...destructive.overrides !== undefined ? {
      overrides: repairRuleOverrides(destructive.overrides, import_destructive2.DESTRUCTIVE_COMMAND_RULE_ID_SET, DESTRUCTIVE_OVERRIDES, IGNORE_ISSUES)
    } : {},
    ...destructive.allow_paths !== undefined ? {
      allow_paths: repairPaths(destructive.allow_paths, getDestructiveAllowPathError, home, ["destructive_command_protection", "allow_paths"], IGNORE_ISSUES)
    } : {}
  };
  const secretSection = {
    ...typeof secret.enabled === "boolean" ? { enabled: secret.enabled } : {},
    ...secret.overrides !== undefined ? {
      overrides: repairRuleOverrides(secret.overrides, import_secret2.SECRET_PROTECTION_RULE_ID_SET, SECRET_OVERRIDES, IGNORE_ISSUES)
    } : {},
    ...secret.deny_paths !== undefined ? {
      deny_paths: repairPaths(secret.deny_paths, getSecretDenyPathError, home, ["secret_protection", "deny_paths"], IGNORE_ISSUES)
    } : {},
    ...secret.allow_paths !== undefined ? {
      allow_paths: repairPaths(secret.allow_paths, getSecretAllowPathError, home, ["secret_protection", "allow_paths"], IGNORE_ISSUES)
    } : {}
  };
  return {
    policy: withPresentFields({
      safety: safetySection,
      workflow: typeof workflow.worktree_mode === "boolean" ? { worktree_mode: workflow.worktree_mode } : {},
      destructive_command_protection: destructiveSection,
      secret_protection: secretSection
    }),
    diagnostics: value.audit === undefined ? [] : [PROJECT_AUDIT_DIAGNOSTIC]
  };
}
function pickBooleans(source, keys, path, report) {
  return Object.fromEntries(keys.flatMap((key) => {
    const value = source[key];
    if (typeof value === "boolean")
      return [[key, value]];
    if (value !== undefined)
      report(typed([...path, key], NOT_A_BOOLEAN));
    return [];
  }));
}
function withPresentFields(sections) {
  return Object.fromEntries(Object.entries(sections).flatMap((entry) => Object.keys(entry[1]).length > 0 ? [entry] : []));
}
var IGNORE_ISSUES = () => {
  return;
};
var NOT_A_BOOLEAN = "must be a boolean";
var NOT_AN_OBJECT = "must be an object if provided";
var AUDIT_RETENTION_ERROR = `must be an integer between ${MIN_AUDIT_RETENTION_DAYS} and ${MAX_AUDIT_RETENTION_DAYS}`;
var DESTRUCTIVE_OVERRIDES = {
  path: ["destructive_command_protection", "overrides"],
  label: "destructive command"
};
var SECRET_OVERRIDES = {
  path: ["secret_protection", "overrides"],
  label: "secret protection"
};
var USER_POLICY_FIELDS = [
  "version",
  "safety",
  "workflow",
  "destructive_command_protection",
  "secret_protection",
  "audit"
];
function validateUserPolicy(value, home) {
  const issues = [];
  const policy = salvagePolicy(value, home, (issue) => {
    issues.push(issue);
  });
  return { policy, issues };
}
function normalizeGuiPolicy(value, home) {
  return salvagePolicy(value, home, IGNORE_ISSUES);
}
function salvagePolicy(value, home, report) {
  if (!isRecord2(value)) {
    report(typed([], "Config must be an object"));
    return createDefaultGuiPolicy();
  }
  if (value.version !== 1)
    report(typed(["version"], "must be 1"));
  const safety = readSection(value.safety, ["safety"], ["level", "overrides"], report);
  const safetyOverrides = readSection(safety.overrides, ["safety", "overrides"], SAFETY_OVERRIDE_KEYS, report);
  const workflow = readSection(value.workflow, ["workflow"], ["worktree_mode"], report);
  const destructiveCommand = readSection(value.destructive_command_protection, ["destructive_command_protection"], ["enabled", "overrides", "allow_paths"], report);
  const secret = readSection(value.secret_protection, ["secret_protection"], ["enabled", "overrides", "deny_paths", "allow_paths"], report);
  const audit = readSection(value.audit, ["audit"], ["retention_days"], report);
  reportUnknownFields(value, USER_POLICY_FIELDS, [], report);
  return {
    version: 1,
    safety: {
      level: readSafetyLevel(safety.level, report),
      overrides: pickBooleans(safetyOverrides, SAFETY_OVERRIDE_KEYS, ["safety", "overrides"], report)
    },
    workflow: {
      worktree_mode: readBoolean(workflow.worktree_mode, ["workflow", "worktree_mode"], false, report)
    },
    destructive_command_protection: {
      enabled: readBoolean(destructiveCommand.enabled, ["destructive_command_protection", "enabled"], true, report),
      overrides: repairRuleOverrides(destructiveCommand.overrides, import_destructive2.DESTRUCTIVE_COMMAND_RULE_ID_SET, DESTRUCTIVE_OVERRIDES, report),
      allow_paths: repairPaths(destructiveCommand.allow_paths, getDestructiveAllowPathError, home, ["destructive_command_protection", "allow_paths"], report)
    },
    secret_protection: {
      enabled: readBoolean(secret.enabled, ["secret_protection", "enabled"], true, report),
      overrides: repairRuleOverrides(secret.overrides, import_secret2.SECRET_PROTECTION_RULE_ID_SET, SECRET_OVERRIDES, report),
      deny_paths: repairPaths(secret.deny_paths, getSecretDenyPathError, home, ["secret_protection", "deny_paths"], report),
      allow_paths: repairPaths(secret.allow_paths, getSecretAllowPathError, home, ["secret_protection", "allow_paths"], report)
    },
    audit: { retention_days: readAuditRetentionDays(audit.retention_days, report) }
  };
}
function readSection(value, path, known, report) {
  if (value === undefined)
    return {};
  if (!isRecord2(value)) {
    report(typed(path, NOT_AN_OBJECT));
    return {};
  }
  reportUnknownFields(value, known, path, report);
  return value;
}
function reportUnknownFields(record, known, path, report) {
  for (const key of Object.keys(record).filter((candidate) => !known.includes(candidate))) {
    report({ path, message: key, kind: "unknownKeys" });
  }
}
function readSafetyLevel(value, report) {
  if (value === undefined)
    return "standard";
  if (SAFETY_LEVELS2.has(value))
    return value;
  report(typed(["safety", "level"], 'must be "standard", "strict", or "paranoid"'));
  return "standard";
}
function readBoolean(value, path, fallback, report) {
  if (typeof value === "boolean")
    return value;
  if (value !== undefined)
    report(typed(path, NOT_A_BOOLEAN));
  return fallback;
}
function readAuditRetentionDays(value, report) {
  const usable = value === undefined || typeof value === "number" && Number.isInteger(value) && value >= MIN_AUDIT_RETENTION_DAYS && value <= MAX_AUDIT_RETENTION_DAYS;
  if (!usable)
    report(typed(["audit", "retention_days"], AUDIT_RETENTION_ERROR));
  return clampAuditRetentionDays(value);
}
function repairRuleOverrides(value, knownRuleIds, overrides, report) {
  if (value === undefined)
    return {};
  if (!isRecord2(value)) {
    report(typed(overrides.path, NOT_AN_OBJECT));
    return {};
  }
  return Object.fromEntries(Object.entries(value).flatMap(([id, override]) => {
    if (!knownRuleIds.has(id)) {
      report({
        path: [...overrides.path, id],
        message: `unknown ${overrides.label} rule id "${id}"`,
        kind: "key"
      });
      return [];
    }
    if (override === "on" || override === "off")
      return [[id, override]];
    report(typed([...overrides.path, id], 'must be "on" or "off"'));
    return [];
  }));
}
function repairPaths(value, getPathError, home, path, report) {
  if (value === undefined)
    return [];
  if (!Array.isArray(value)) {
    report(typed(path, "must be an array of paths"));
    return [];
  }
  return value.flatMap((entry, index) => {
    const error = getPathError(entry, home);
    if (error === null)
      return [entry];
    report(typeof entry === "string" ? custom([...path, index], error) : typed([...path, index], error));
    return [];
  });
}
function isRecord2(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function createDefaultGuiPolicy() {
  return structuredClone(DEFAULT_GUI_POLICY);
}
function createPolicyPreview(policy, env) {
  const modes = getCCSafetyNetEnvModes({ safety: normalizeSafety(policy.safety) }, env);
  const rules = resolveEffectiveDestructiveCommandRules({
    destructiveCommandProtectionEnabled: policy.destructive_command_protection.enabled,
    destructiveCommandRuleOverrides: policy.destructive_command_protection.overrides
  }, modes.capabilities);
  const values = Object.values(rules);
  const configurableValues = values.filter((state) => state.source !== "catastrophic");
  return {
    selectedPreset: policy.safety.level,
    effectiveLevel: modes.effectiveLevel,
    capabilities: modes.capabilities,
    rules,
    counts: {
      enabled: configurableValues.filter((state) => state.enabled).length,
      disabled: configurableValues.filter((state) => !state.enabled).length,
      effectiveCustomizations: values.filter((state) => state.changesInherited).length
    }
  };
}
function readPolicyFile2(path, home) {
  if (!import_node_fs.existsSync(path))
    return { exists: false, policy: createDefaultGuiPolicy(), errors: [] };
  try {
    const content = import_node_fs.readFileSync(path, "utf-8");
    if (!content.trim()) {
      return {
        exists: true,
        policy: createDefaultGuiPolicy(),
        errors: [`${path}: Config file is empty`],
        fallback: "defaults"
      };
    }
    const parsed = JSON.parse(content);
    const salvaged = validateUserPolicy(parsed, home);
    if (salvaged.issues.length === 0) {
      return { exists: true, parsed, policy: salvaged.policy, errors: [] };
    }
    return {
      exists: true,
      parsed,
      policy: salvaged.policy,
      errors: salvaged.issues.map((issue) => `${path}: ${renderSalvageIssue(issue)}`),
      fallback: isRecord2(parsed) ? "salvaged" : "defaults"
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      exists: true,
      policy: createDefaultGuiPolicy(),
      errors: [`${path}: ${error instanceof SyntaxError ? "Invalid JSON" : message}`],
      fallback: "defaults"
    };
  }
}
var SALVAGE_WORDING = new Map([
  ["Config must be an object", "not a JSON object"],
  ["must be 1", "not 1"],
  [NOT_AN_OBJECT, "not an object"],
  ['must be "standard", "strict", or "paranoid"', "not one of standard, strict, paranoid"],
  [NOT_A_BOOLEAN, "not a boolean"],
  ['must be "on" or "off"', 'not "on" or "off"'],
  ["must be an array of paths", "not an array"],
  [
    AUDIT_RETENTION_ERROR,
    `not an integer between ${MIN_AUDIT_RETENTION_DAYS} and ${MAX_AUDIT_RETENTION_DAYS}`
  ]
]);
function renderSalvageIssue(issue) {
  const path = renderIssuePath(issue.path);
  if (issue.kind === "unknownKeys") {
    return `${path === "" ? "" : `${path}.`}${issue.message}: unknown field`;
  }
  if (issue.kind === "key")
    return `${path}: unknown rule id`;
  const reason = SALVAGE_WORDING.get(issue.message) ?? issue.message;
  return path === "" ? reason : `${path}: ${reason}`;
}
function readPolicyConfig(path, home) {
  const file = readPolicyFile2(path, home);
  if (!file.exists) {
    const embedded = globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__;
    if (!isRecord2(embedded))
      return { policy: createEmptyPolicy(), errors: [] };
    const gui = normalizeGuiPolicy(embedded, home);
    return {
      policy: normalizePolicyConfig(gui),
      gui,
      errors: [],
      levelPresent: hasOwnSafetyLevel(embedded)
    };
  }
  if (file.parsed === undefined) {
    return {
      policy: createEmptyPolicy(),
      errors: file.errors,
      ...file.fallback ? { fallback: file.fallback } : {}
    };
  }
  return {
    policy: normalizePolicyConfig(file.policy),
    gui: file.policy,
    errors: file.errors,
    ...file.fallback ? { fallback: file.fallback } : {},
    levelPresent: hasOwnSafetyLevel(file.parsed)
  };
}
function hasOwnSafetyLevel(value) {
  const safety = isRecord2(value) && isRecord2(value.safety) ? value.safety : {};
  return SAFETY_LEVELS2.has(safety.level);
}
function resolveSecretDisabledRules(overrides) {
  const entries = Object.entries(overrides);
  const optedIn = new Set(entries.flatMap(([id, value]) => value === "on" ? [id] : []));
  return [
    ...new Set([
      ...[...import_secret2.SECRET_DEFAULT_OFF_RULE_ID_SET].filter((id) => !optedIn.has(id)),
      ...entries.flatMap(([id, value]) => value === "off" ? [id] : [])
    ])
  ];
}
function createEmptyPolicy() {
  return {
    safety: {},
    worktreeMode: false,
    destructiveCommandProtectionEnabled: true,
    destructiveCommandRuleOverrides: {},
    destructiveCommandAllowPaths: [],
    secretProtection: {
      enabled: true,
      disabledRules: resolveSecretDisabledRules({}),
      denyPaths: [],
      allowPaths: []
    }
  };
}
function normalizePolicyConfig(config) {
  return {
    safety: normalizeSafety(config.safety),
    worktreeMode: config.workflow.worktree_mode,
    destructiveCommandProtectionEnabled: config.destructive_command_protection.enabled,
    destructiveCommandRuleOverrides: config.destructive_command_protection.overrides,
    destructiveCommandAllowPaths: config.destructive_command_protection.allow_paths,
    secretProtection: {
      enabled: config.secret_protection.enabled,
      disabledRules: resolveSecretDisabledRules(config.secret_protection.overrides),
      denyPaths: config.secret_protection.deny_paths,
      allowPaths: config.secret_protection.allow_paths
    }
  };
}
function normalizeSafety(safety) {
  const overrides = {
    ...safety.overrides.fail_closed !== undefined ? { failClosed: safety.overrides.fail_closed } : {},
    ...safety.overrides.paranoid_rm !== undefined ? { paranoidRm: safety.overrides.paranoid_rm } : {},
    ...safety.overrides.paranoid_interpreters !== undefined ? { paranoidInterpreters: safety.overrides.paranoid_interpreters } : {}
  };
  return {
    level: safety.level,
    ...Object.keys(overrides).length > 0 ? { overrides } : {}
  };
}

// src/core/policy/retention.ts
function readRetentionDays(environment, options = {}) {
  return readPolicyFile2(getUserPolicyPath(environment, options), environment.home).policy.audit.retention_days;
}
// src/core/random-hex.ts
function randomHex16() {
  const half = () => Math.floor(Math.random() * 4294967296).toString(16).padStart(8, "0");
  return `${half()}${half()}`;
}
// src/core/redaction.ts
var PROVIDER_TOKENS = [
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  /\bglpat-[A-Za-z0-9_-]{20,}\b/g,
  /\bxox[abeprs]-[A-Za-z0-9-]{20,}\b/g,
  /\bnpm_[A-Za-z0-9_]{20,}\b/g,
  /\bpypi-[A-Za-z0-9_-]{20,}\b/g,
  /\b[rs]k_(?:live|test)_[A-Za-z0-9_]{20,}\b/g,
  /\bsk-[A-Za-z0-9_-]{20,}\b/g,
  /\bsk_[A-Za-z0-9]{20,}\b/g,
  /\bgsk_[A-Za-z0-9]{52,}\b/g,
  /\bxai-[A-Za-z0-9_-]{80,}\b/g,
  /\bpplx-[A-Za-z0-9_-]{20,}\b/g,
  /\bbastn_[A-Za-z0-9]{16,}\b/g,
  /\btgp_v1_[A-Za-z0-9_-]{43,}\b/g,
  /\bflp_[A-Za-z0-9]{10,}\b/g,
  /\bwfr_[A-Za-z0-9]{20,}\b/g,
  /\bfwp?_[A-Za-z0-9_-]{20,}\b/g,
  /\btp-[A-Za-z0-9_-]{20,}\b/g,
  /\bpsk-[A-Za-z0-9_-]{8,}-[A-Za-z0-9_-]{8,}\b/g,
  /\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/g
];
function redactSecrets(text) {
  return redactNonAssignmentSecrets(text.replace(/\b((?:DATABASE|POSTGRES|POSTGRESQL|MYSQL|MARIADB|REDIS|MONGO(?:DB)?|DB)_DSN|CONNECTION_STRING)=("[^"]*"|'[^']*'|[^\s]+(?:\s+[A-Z_][A-Z0-9_]*=[^\s]+)*)/gi, "$1=<redacted>").replace(/\b((?:DATABASE|POSTGRES|POSTGRESQL|MYSQL|MARIADB|REDIS|MONGO(?:DB)?|DB)_(?:URL|URI|CONNECTION_STRING))=("[^"]*"|'[^']*'|[^\s]+)/gi, "$1=<redacted>").replace(/\b([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASS|KEY|CREDENTIALS)[A-Z0-9_]*)=("[^"]*"|'[^']*'|[^\s]+)/gi, "$1=<redacted>"));
}
function redactNonAssignmentSecrets(text) {
  return PROVIDER_TOKENS.reduce((result, pattern) => result.replace(pattern, "<redacted>"), text.replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/gi, "<redacted>").replace(/((?:(['"])(?:authorization|cookie|x-api-key|api-key)\2|(?:authorization|cookie|x-api-key|api-key))\s*:\s*)(['"])(?:\\[^\r\n]|(?!\3)[^\\\r\n])*\3/gi, "$1$3<redacted>$3").replace(/(['"]?\s*(?:authorization|cookie|x-api-key|api-key)\s*:(?!\s*(?:"<redacted>"|'<redacted>'))\s*)([^'"\r\n]+)(['"]?)/gi, "$1<redacted>$3").replace(/\b([a-z][a-z0-9+.-]*:\/\/)([^\s/:@]+):([^\s@/]+)@/gi, "$1<redacted>:<redacted>@").replace(/\b([a-z][a-z0-9+.-]*:\/\/)([^\s/@:]+)@/gi, "$1<redacted>@").replace(/(^|[\s?&;|])((?:x-amz-signature|x-goog-signature|sig|signature)=)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^&#\s'"`;|<>()]*)/gi, "$1$2<redacted>").replace(/(^|\s)((?:-u|--user)(?:\s+|=))([^\s:]+):([^\s]+)/g, "$1$2<redacted>:<redacted>")).replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\b/g, "<redacted>").replace(/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g, "<redacted>");
}
function redactEnvAssignmentValues(text) {
  return findEnvAssignments(text).reduceRight((value, assignment) => `${value.slice(0, assignment.valueStart)}<redacted>${value.slice(assignment.valueEnd)}`, text);
}
function sanitizeDiagnosticText(text) {
  return redactNonAssignmentSecrets(redactEnvAssignmentValues(text));
}
function getEnvAssignmentValues(text) {
  return findEnvAssignments(text).map((assignment) => text.slice(assignment.valueStart, assignment.valueEnd));
}
function mightContainEnvAssignment(text) {
  return /[A-Za-z_][A-Za-z0-9_]*=/.test(text);
}
function findEnvAssignments(text) {
  return [...text.matchAll(/[A-Za-z_][A-Za-z0-9_]*=/g)].flatMap((match) => {
    const previous = text[match.index - 1];
    if (match.index > 0 && previous && !/[\s"'([{]/.test(previous))
      return [];
    const valueStart = match.index + match[0].length;
    if (valueStart >= text.length)
      return [];
    return [{ valueStart, valueEnd: findAssignmentValueEnd(text, valueStart) }];
  });
}
function findAssignmentValueEnd(text, start) {
  if (text.startsWith("$(", start))
    return findBalancedCommandSubstitutionEnd(text, start);
  const quote = text[start];
  if (quote === '"' || quote === "'") {
    for (let index = start + 1;index < text.length; index++) {
      if (quote === '"' && text[index] === "\\") {
        index++;
        continue;
      }
      if (text[index] === quote)
        return index + 1;
    }
    return text.length;
  }
  let end = start;
  while (end < text.length && !/\s/.test(text[end] ?? ""))
    end++;
  return end;
}
function findBalancedCommandSubstitutionEnd(text, start) {
  let depth = 0;
  let quote;
  for (let index = start;index < text.length; index++) {
    const char = text[index];
    if (quote) {
      if (quote === '"' && char === "\\") {
        index++;
        continue;
      }
      if (char === quote)
        quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "$" && text[index + 1] === "(") {
      depth++;
      index++;
      continue;
    }
    if (char !== ")")
      continue;
    depth--;
    if (depth === 0)
      return index + 1;
  }
  return text.length;
}
// src/core/git/worktree.ts
var import_node_child_process = require("node:child_process");
var import_node_fs2 = require("node:fs");
var import_node_path4 = require("node:path");
var TRUSTED_GIT_BINARIES = [
  "/usr/bin/git",
  "/usr/local/bin/git",
  "/opt/homebrew/bin/git",
  "C:\\Program Files\\Git\\cmd\\git.exe",
  "C:\\Program Files\\Git\\bin\\git.exe"
];
var GIT_CONFIG_TIMEOUT_MS = 5000;
function resolveWorktreeFacts(cwd, gitBinary = getTrustedGitBinary(), timeoutMs = GIT_CONFIG_TIMEOUT_MS) {
  const gitCwd = resolveDirectory(cwd);
  const targets = gitCwd === null ? null : resolveLinkedWorktreeTargets(gitCwd);
  if (gitCwd === null || targets === null)
    return null;
  const recursiveSubmodules = effectiveGitConfigEnablesRecursiveSubmodules(gitCwd, targets, gitBinary, timeoutMs);
  return recursiveSubmodules === null ? null : { recursiveSubmodules };
}
function resolveDirectory(cwd) {
  try {
    const resolved = import_node_fs2.realpathSync(import_node_path4.resolve(cwd));
    return import_node_fs2.statSync(resolved).isDirectory() ? resolved : null;
  } catch {
    return null;
  }
}
function resolveLinkedWorktreeTargets(cwd) {
  const dotGitPath = findDotGit(cwd);
  if (!dotGitPath) {
    return null;
  }
  try {
    const stat = import_node_fs2.lstatSync(dotGitPath);
    if (stat.isSymbolicLink() || !stat.isFile()) {
      return null;
    }
    const targets = resolveDotGitFileTargets(dotGitPath);
    if (!targets?.commonDir)
      return null;
    if (!worktreeGitdirBacklinkMatches(targets.gitDir, dotGitPath)) {
      return null;
    }
    return worktreeConfigMatchesRoot(targets.gitDir, import_node_path4.dirname(dotGitPath)) ? { gitDir: targets.gitDir, commonDir: targets.commonDir } : null;
  } catch {
    return null;
  }
}
function resolveDotGitFileTargets(dotGitPath) {
  try {
    const rawGitDir = readDotGitTarget(dotGitPath);
    if (!rawGitDir)
      return null;
    const gitDir = import_node_fs2.realpathSync(import_node_path4.isAbsolute(rawGitDir) ? rawGitDir : import_node_path4.resolve(import_node_path4.dirname(dotGitPath), rawGitDir));
    if (!import_node_fs2.statSync(gitDir).isDirectory())
      return null;
    return {
      gitDir,
      commonDir: resolveCommonGitDir(gitDir)
    };
  } catch {
    return null;
  }
}
function readDotGitTarget(dotGitPath) {
  const firstLine = import_node_fs2.readFileSync(dotGitPath, "utf-8").split(/\r?\n/, 1)[0]?.trim() ?? "";
  if (!firstLine.startsWith("gitdir:"))
    return null;
  return firstLine.slice("gitdir:".length).trim() || null;
}
function resolveCommonGitDir(gitDir) {
  try {
    const rawCommonDir = import_node_fs2.readFileSync(import_node_path4.join(gitDir, "commondir"), "utf-8").split(/\r?\n/, 1)[0]?.trim();
    if (!rawCommonDir)
      return null;
    const commonDir = import_node_fs2.realpathSync(import_node_path4.isAbsolute(rawCommonDir) ? rawCommonDir : import_node_path4.resolve(gitDir, rawCommonDir));
    return import_node_fs2.statSync(commonDir).isDirectory() ? commonDir : null;
  } catch {
    return null;
  }
}
function worktreeGitdirBacklinkMatches(gitDir, dotGitPath) {
  const rawBacklink = readWorktreeGitdirBacklink(gitDir);
  return rawBacklink === null ? false : gitDirPathReferenceMatches(gitDir, rawBacklink, dotGitPath);
}
function worktreeConfigMatchesRoot(gitDir, worktreeRoot) {
  const configuredWorktree = readWorktreeConfigWorktree(gitDir);
  return configuredWorktree === null ? true : gitDirPathReferenceMatches(gitDir, configuredWorktree, worktreeRoot);
}
function readWorktreeGitdirBacklink(gitDir) {
  const backlinkPath = import_node_path4.join(gitDir, "gitdir");
  if (!import_node_fs2.existsSync(backlinkPath))
    return null;
  const rawBacklink = import_node_fs2.readFileSync(backlinkPath, "utf-8").split(/\r?\n/, 1)[0]?.trim() ?? "";
  return rawBacklink === "" ? null : rawBacklink;
}
function readWorktreeConfigWorktree(gitDir) {
  const configWorktreePath = import_node_path4.join(gitDir, "config.worktree");
  return import_node_fs2.existsSync(configWorktreePath) ? readCoreWorktree(configWorktreePath) : null;
}
function gitDirPathReferenceMatches(gitDir, target, expectedPath) {
  try {
    return sameFilesystemPath(import_node_path4.isAbsolute(target) ? target : import_node_path4.resolve(gitDir, target), expectedPath);
  } catch {
    return false;
  }
}
function sameFilesystemPath(left, right) {
  try {
    const leftStat = import_node_fs2.statSync(left);
    const rightStat = import_node_fs2.statSync(right);
    if (leftStat.ino !== 0 && rightStat.ino !== 0 && leftStat.dev === rightStat.dev && leftStat.ino === rightStat.ino) {
      return true;
    }
  } catch {}
  return normalizePathForComparison(import_node_fs2.realpathSync.native(left)) === normalizePathForComparison(import_node_fs2.realpathSync.native(right));
}
function normalizePathForComparison(path) {
  const normalized = path.replace(/^\\\\\?\\UNC\\/i, "//").replace(/^\\\\\?\\/i, "").replace(/\\/g, "/");
  const trimmed = normalized.length > 1 && normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
  return process.platform === "win32" ? trimmed.toLowerCase() : trimmed;
}
function readCoreWorktree(configPath) {
  const content = import_node_fs2.readFileSync(configPath, "utf-8");
  let inCore = false;
  let configuredWorktree = null;
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith(";")) {
      continue;
    }
    if (trimmed.startsWith("[")) {
      inCore = /^\[core\]$/i.test(trimmed);
      continue;
    }
    if (!inCore) {
      continue;
    }
    const match = trimmed.match(/^worktree\s*=\s*(.*)$/i);
    if (match) {
      configuredWorktree = parseGitConfigValue(match[1] ?? "");
    }
  }
  return configuredWorktree;
}
function parseGitConfigValue(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith('"') || !trimmed.endsWith('"')) {
    return trimmed;
  }
  return unescapeDoubleQuotedGitConfigValue(trimmed.slice(1, -1));
}
var GIT_CONFIG_ESCAPES = {
  "\\": "\\",
  '"': '"',
  n: `
`,
  t: "\t",
  b: "\b"
};
function unescapeDoubleQuotedGitConfigValue(value) {
  return value.replace(/\\(.?)/gs, (sequence, next) => next === "" ? sequence : GIT_CONFIG_ESCAPES[next] ?? sequence);
}
function findDotGit(cwd) {
  try {
    return findDotGitInAncestors(import_node_fs2.realpathSync(cwd));
  } catch {
    return null;
  }
}
function findDotGitInAncestors(cwd) {
  let current = cwd;
  while (true) {
    const dotGitPath = import_node_path4.join(current, ".git");
    if (import_node_fs2.existsSync(dotGitPath)) {
      return dotGitPath;
    }
    const parent = import_node_path4.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}
function effectiveGitConfigEnablesRecursiveSubmodules(cwd, targets, gitBinary, timeoutMs) {
  if (localGitConfigEnablesRecursiveSubmodules(targets)) {
    return true;
  }
  if (gitBinary === null) {
    return true;
  }
  const result = import_node_child_process.spawnSync(gitBinary, ["config", "--get", "submodule.recurse"], {
    cwd,
    encoding: "utf8",
    env: withoutGitConfigEnv(process.env),
    stdio: ["ignore", "pipe", "ignore"],
    timeout: timeoutMs
  });
  if (result.error !== undefined || result.status !== 0 && result.status !== 1)
    return null;
  return result.status === 0 && gitConfigValueEnablesRecursiveSubmodules(result.stdout.trim());
}
function localGitConfigEnablesRecursiveSubmodules(targets) {
  return [import_node_path4.join(targets.commonDir, "config"), import_node_path4.join(targets.gitDir, "config.worktree")].filter((configPath) => import_node_fs2.existsSync(configPath)).some((configPath) => gitConfigFileEnablesRecursiveSubmodules(configPath));
}
function getTrustedGitBinary() {
  return TRUSTED_GIT_BINARIES.find((gitBinary) => import_node_fs2.existsSync(gitBinary)) ?? null;
}
function isGitConfigEnvName(name) {
  return name === "GIT_CONFIG_COUNT" || name === "GIT_CONFIG_PARAMETERS" || /^GIT_CONFIG_(KEY|VALUE)_\d+$/.test(name);
}
function withoutGitConfigEnv(env) {
  return Object.fromEntries(Object.entries(env).filter(([key]) => !isGitConfigEnvName(key)));
}
function gitConfigFileEnablesRecursiveSubmodules(configPath) {
  let content;
  try {
    content = import_node_fs2.readFileSync(configPath, "utf-8");
  } catch {
    return true;
  }
  let section = "";
  let recursiveSubmoduleConfig = false;
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith(";")) {
      continue;
    }
    const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      section = sectionMatch[1]?.trim().toLowerCase() ?? "";
      continue;
    }
    const eqIdx = trimmed.indexOf("=");
    const key = (eqIdx === -1 ? trimmed : trimmed.slice(0, eqIdx)).trim().toLowerCase();
    const value = eqIdx === -1 ? "true" : trimmed.slice(eqIdx + 1).trim();
    if (isIncludeConfigSection(section) && key === "path") {
      return true;
    }
    if (section === "submodule" && key === "recurse") {
      recursiveSubmoduleConfig = gitConfigValueEnablesRecursiveSubmodules(value);
    }
  }
  return recursiveSubmoduleConfig;
}
function isIncludeConfigSection(section) {
  return section === "include" || section.startsWith("includeif ");
}
function gitConfigValueEnablesRecursiveSubmodules(value) {
  const normalizedValue = value.toLowerCase();
  return normalizedValue !== "false" && normalizedValue !== "no" && normalizedValue !== "off" && normalizedValue !== "0";
}
// src/core/paths/chdir.ts
var import_node_path5 = require("node:path");
function resolveChdirTarget(baseCwd, target, paths) {
  if (isUnsupportedWindowsNamespacePath(target)) {
    throw new Error("Unsupported Windows namespace path");
  }
  const root = import_node_path5.isAbsolute(target) ? import_node_path5.parse(target).root : "";
  let current = root || baseCwd;
  for (const component of getPathComponents(root ? target.slice(root.length) : target)) {
    if (component === "" || component === ".") {
      continue;
    }
    if (component === "..") {
      current = import_node_path5.dirname(current);
      continue;
    }
    const candidate = appendPathWithoutNormalizing(current, component);
    const kind = paths.entryKind(candidate);
    const resolved = kind === "symlink" ? paths.realpath(candidate) : candidate;
    if (kind === "missing" || resolved === null) {
      throw new Error(`Cannot resolve path component: ${candidate}`);
    }
    current = resolved;
  }
  return current;
}
function appendPathWithoutNormalizing(base, target) {
  return base.endsWith("/") || base.endsWith("\\") ? `${base}${target}` : `${base}${import_node_path5.sep}${target}`;
}
function getPathComponents(target) {
  const separator = process.platform === "win32" ? /[\\/]+/ : /\/+/;
  return target.split(separator);
}
// src/core/tool-input.ts
var import_node_util = require("node:util");
var PATCH_TOOL_NAMES = new Set(["applypatch", "patch"]);
var PATH_TOOL_NAMES = new Set([
  "create",
  "edit",
  "listdir",
  "listpermissions",
  "ls",
  "multiedit",
  "multireplacefilecontent",
  "notebookedit",
  "read",
  "readfile",
  "readurlcontent",
  "replacefilecontent",
  "searchweb",
  "strreplaceeditor",
  "view",
  "viewfile",
  "write",
  "writefile",
  "writetofile"
]);
var GREP_TOOL_NAMES = new Set(["grep", "grepsearch", "rg"]);
var GLOB_TOOL_NAMES = new Set(["find", "findbyname", "glob"]);
var READ_ONLY_TOOL_NAMES = new Set([
  "find",
  "findbyname",
  "glob",
  "grep",
  "grepsearch",
  "listdir",
  "listpermissions",
  "ls",
  "read",
  "readfile",
  "readurlcontent",
  "searchweb",
  "view",
  "viewfile"
]);
var PATCH_TEXT_KEYS = new Set(["command", "diff", "input", "patch", "patchtext"]);
var UTF8_ENCODER = new TextEncoder;
var UTF8_DECODER = new TextDecoder;
var JS_WHITESPACE = /\s/;
var MAX_GIT_DIFF_FALLBACK_CANDIDATES = 64;

class ToolInputLimitError extends Error {
  name = "ToolInputLimitError";
  constructor() {
    super("tool input traversal limit exceeded");
  }
}
var TOOL_INPUT_LIMITS = Object.freeze({
  maxDepth: 64,
  maxNodes: 1e4,
  maxKeys: 1e4,
  maxStringBytes: 1024 * 1024,
  maxAggregateStringBytes: 4 * 1024 * 1024
});
function normalizeToolName(toolName) {
  return toolName.replace(/[-_\s]/g, "").toLowerCase();
}
function isReadOnlyTool(toolName) {
  return READ_ONLY_TOOL_NAMES.has(normalizeToolName(toolName));
}
function getNonCommandToolInputKind(toolName) {
  const normalized = normalizeToolName(toolName);
  if (PATCH_TOOL_NAMES.has(normalized))
    return "patch";
  if (GREP_TOOL_NAMES.has(normalized))
    return "grep";
  if (GLOB_TOOL_NAMES.has(normalized))
    return "glob";
  if (PATH_TOOL_NAMES.has(normalized))
    return "path";
  return "unknown";
}
function getCommandFromToolInput(input) {
  if (!input || typeof input !== "object")
    return;
  assertSafeToolInputObject(input);
  const descriptor = Object.getOwnPropertyDescriptor(input, "command");
  if (!descriptor) {
    if ("command" in input)
      throwToolInputLimit();
    return;
  }
  if (descriptor.get || descriptor.set)
    throwToolInputLimit();
  const command = descriptor.value;
  return typeof command === "string" && command !== "" ? command : undefined;
}
function extractPathLikeToolValues(input, pathLikeKeys) {
  return extractPathLikeToolValuesAt(input, pathLikeKeys, false, { nodes: 0, keys: 0, stringBytes: 0, ancestors: new Set }, 1);
}
function extractPathLikeToolValuesAt(input, pathLikeKeys, underPathLikeKey, state, depth) {
  const snapshot = snapshotToolInputObject(input, state, depth);
  if (typeof input === "string")
    return underPathLikeKey ? [input] : [];
  if (!snapshot)
    return [];
  const values = snapshot.entries.flatMap(([key, value]) => extractPathLikeToolValuesAt(value, pathLikeKeys, snapshot.array ? underPathLikeKey : pathLikeKeys.has(normalizeToolInputKey(key)), state, depth + 1));
  state.ancestors.delete(snapshot.object);
  return values;
}
function normalizeToolInputKey(key) {
  return key.replace(/-/g, "_").toLowerCase();
}
function extractPatchTargetsFromToolInput(input) {
  return extractPatchTexts(input, true, { nodes: 0, keys: 0, stringBytes: 0, ancestors: new Set }, 1).flatMap(extractPatchTargetsFromText);
}
function extractPatchTexts(input, allowString, state, depth) {
  const snapshot = snapshotToolInputObject(input, state, depth);
  if (typeof input === "string")
    return allowString ? [input] : [];
  if (!snapshot)
    return [];
  const texts = snapshot.entries.flatMap(([key, value]) => extractPatchTexts(value, snapshot.array ? allowString : PATCH_TEXT_KEYS.has(normalizeToolInputKey(key)), state, depth + 1));
  state.ancestors.delete(snapshot.object);
  return texts;
}
function enterToolInputValue(input, state, depth) {
  state.nodes++;
  if (input !== null && typeof input === "object" && depth > TOOL_INPUT_LIMITS.maxDepth || state.nodes > TOOL_INPUT_LIMITS.maxNodes) {
    throwToolInputLimit();
  }
  if (typeof input !== "string")
    return;
  const bytes = Buffer.byteLength(input);
  state.stringBytes += bytes;
  if (bytes > TOOL_INPUT_LIMITS.maxStringBytes || state.stringBytes > TOOL_INPUT_LIMITS.maxAggregateStringBytes) {
    throwToolInputLimit();
  }
}
function snapshotToolInputObject(input, state, depth) {
  enterToolInputValue(input, state, depth);
  if (!input || typeof input !== "object")
    return null;
  const array = assertSafeToolInputObject(input);
  if (state.ancestors.has(input))
    throwToolInputLimit();
  const keys = Reflect.ownKeys(input);
  state.keys += keys.length;
  if (state.keys > TOOL_INPUT_LIMITS.maxKeys)
    throwToolInputLimit();
  const entries = keys.flatMap((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (!descriptor || descriptor.get || descriptor.set)
      throwToolInputLimit();
    return typeof key === "string" && descriptor.enumerable ? [[key, descriptor.value]] : [];
  });
  state.ancestors.add(input);
  return { object: input, array, entries };
}
function assertSafeToolInputObject(input) {
  if (import_node_util.types.isProxy(input))
    throwToolInputLimit();
  const array = Array.isArray(input);
  const prototype = Object.getPrototypeOf(input);
  if (array && prototype !== Array.prototype || !array && prototype !== Object.prototype && prototype !== null) {
    throwToolInputLimit();
  }
  return array;
}
function throwToolInputLimit() {
  throw new ToolInputLimitError;
}
function extractPatchTargetsFromText(text) {
  const targets = [];
  const lines = text.split(/\r?\n/);
  let inApplyPatch = false;
  let inHunk = false;
  let oldHunkLinesRemaining = null;
  let newHunkLinesRemaining = null;
  const resetHunk = () => {
    inHunk = false;
    oldHunkLinesRemaining = null;
    newHunkLinesRemaining = null;
  };
  for (let index = 0;index < lines.length; index++) {
    const line = lines[index] ?? "";
    if (line === "*** Begin Patch") {
      inApplyPatch = true;
      resetHunk();
      continue;
    }
    if (line === "*** End Patch") {
      inApplyPatch = false;
      resetHunk();
      continue;
    }
    if (line.startsWith("@@")) {
      const counts = parseUnifiedHunkLineCounts(line);
      inHunk = true;
      oldHunkLinesRemaining = counts?.oldLines ?? null;
      newHunkLinesRemaining = counts?.newLines ?? null;
      if (oldHunkLinesRemaining === 0 && newHunkLinesRemaining === 0)
        resetHunk();
      continue;
    }
    if (inHunk && oldHunkLinesRemaining !== null && newHunkLinesRemaining !== null) {
      const oldLineCount = line.startsWith(" ") || line.startsWith("-") ? 1 : 0;
      const newLineCount = line.startsWith(" ") || line.startsWith("+") ? 1 : 0;
      oldHunkLinesRemaining = Math.max(0, oldHunkLinesRemaining - oldLineCount);
      newHunkLinesRemaining = Math.max(0, newHunkLinesRemaining - newLineCount);
      if (oldHunkLinesRemaining === 0 && newHunkLinesRemaining === 0)
        resetHunk();
      continue;
    }
    if (line.startsWith("*** ")) {
      resetHunk();
      targets.push(...extractPatchTargetsFromMetadataLine(line));
      continue;
    }
    if (inHunk)
      continue;
    if (line.startsWith("diff --git ")) {
      targets.push(...extractPatchTargetsFromMetadataLine(line));
      continue;
    }
    if (line.startsWith("--- ")) {
      const nextLine = lines[index + 1] ?? "";
      if (!nextLine.startsWith("+++ "))
        continue;
      targets.push(...cleanGitTargetPair(decodeGitMetadataTarget(line.slice(4), true), decodeGitMetadataTarget(nextLine.slice(4), true)));
      index++;
      continue;
    }
    if (!inApplyPatch)
      targets.push(...extractPatchTargetsFromMetadataLine(line));
  }
  return targets;
}
function parseUnifiedHunkLineCounts(line) {
  const hunkHeader = /^@@ -\d+(?:,(\d+))? \+\d+(?:,(\d+))? @@/.exec(line);
  if (!hunkHeader)
    return null;
  return {
    oldLines: Number(hunkHeader[1] ?? 1),
    newLines: Number(hunkHeader[2] ?? 1)
  };
}
function extractPatchTargetsFromMetadataLine(line) {
  const applyPatchTarget = /^\*\*\* (?:Add|Update|Delete) File: (.+)$/.exec(line);
  if (applyPatchTarget?.[1])
    return cleanPatchTarget(applyPatchTarget[1]);
  const moveTarget = /^\*\*\* Move to: (.+)$/.exec(line);
  if (moveTarget?.[1])
    return cleanPatchTarget(moveTarget[1]);
  if (line.startsWith("diff --git "))
    return extractGitDiffTargets(line.slice(11));
  const oldTarget = /^--- (.+)$/.exec(line);
  if (oldTarget?.[1])
    return cleanUnifiedDiffTarget(oldTarget[1]);
  const newTarget = /^\+\+\+ (.+)$/.exec(line);
  if (newTarget?.[1])
    return cleanUnifiedDiffTarget(newTarget[1]);
  const extendedTarget = /^(?:rename|copy) (?:from|to) (.+)$/.exec(line);
  if (extendedTarget?.[1])
    return cleanExtendedGitTarget(extendedTarget[1]);
  return [];
}
function extractGitDiffTargets(header) {
  const fields = parseGitDiffFields(header);
  if (fields.length === 2 && fields[0] && fields[1]) {
    return cleanGitTargetPair(fields[0], fields[1]);
  }
  const matchingPair = findGitDiffFallbackPair(header);
  return matchingPair ? cleanGitTargetPair(header.slice(matchingPair.oldStart, matchingPair.oldEnd), header.slice(matchingPair.newStart, matchingPair.newEnd)) : [];
}
function parseGitDiffFields(header) {
  const fields = [];
  let index = 0;
  while (index < header.length && fields.length < 2) {
    while (isJsWhitespace(header[index]))
      index++;
    if (index >= header.length)
      break;
    const quote = header[index] === '"' || header[index] === "'" ? header[index] : undefined;
    if (!quote) {
      const start = index;
      while (index < header.length && !isJsWhitespace(header[index]))
        index++;
      fields.push(header.slice(start, index));
      continue;
    }
    const field = parseQuotedGitDiffField(header, index, quote);
    if (!field)
      return [];
    fields.push(field.value);
    index = field.end;
  }
  while (isJsWhitespace(header[index]))
    index++;
  return index === header.length ? fields : [];
}
function findGitDiffFallbackPair(header) {
  let start = 0;
  while (start < header.length && isJsWhitespace(header[start]))
    start++;
  let end = header.length;
  while (end > start && isJsWhitespace(header[end - 1]))
    end--;
  let candidates = 0;
  let index = start;
  while (index < end) {
    if (!isJsWhitespace(header[index])) {
      index++;
      continue;
    }
    const oldEnd = index;
    while (index < end && isJsWhitespace(header[index]))
      index++;
    if (oldEnd === start || index === end)
      continue;
    candidates++;
    if (candidates > MAX_GIT_DIFF_FALLBACK_CANDIDATES)
      throwToolInputLimit();
    if (gitDiffFallbackRangesMatch(header, start, oldEnd, index, end)) {
      return { oldStart: start, oldEnd, newStart: index, newEnd: end };
    }
  }
  return null;
}
function gitDiffFallbackRangesMatch(header, oldStart, oldEnd, newStart, newEnd) {
  if (rangesEqual(header, oldStart, oldEnd, newStart, newEnd))
    return true;
  const oldSlash = findCharacterInRange(header, "/", oldStart, oldEnd);
  const newSlash = findCharacterInRange(header, "/", newStart, newEnd);
  if (oldSlash <= oldStart || newSlash <= newStart)
    return false;
  if (rangesEqual(header, oldStart, oldSlash, newStart, newSlash))
    return false;
  return rangesEqual(header, oldSlash + 1, oldEnd, newSlash + 1, newEnd);
}
function rangesEqual(value, leftStart, leftEnd, rightStart, rightEnd) {
  if (leftEnd - leftStart !== rightEnd - rightStart)
    return false;
  for (let offset = 0;offset < leftEnd - leftStart; offset++) {
    if (value[leftStart + offset] !== value[rightStart + offset])
      return false;
  }
  return true;
}
function findCharacterInRange(value, character, start, end) {
  for (let index = start;index < end; index++) {
    if (value[index] === character)
      return index;
  }
  return -1;
}
function isJsWhitespace(character) {
  return character !== undefined && JS_WHITESPACE.test(character);
}
function parseQuotedGitDiffField(header, start, quote) {
  const bytes = [];
  let index = start + 1;
  while (index < header.length) {
    const character = String.fromCodePoint(header.codePointAt(index) ?? 0);
    if (character === quote) {
      return { value: UTF8_DECODER.decode(Uint8Array.from(bytes)), end: index + 1 };
    }
    if (character !== "\\" || quote === "'") {
      bytes.push(...UTF8_ENCODER.encode(character));
      index += character.length;
      continue;
    }
    const escaped = header.slice(index + 1);
    const octal = /^[0-7]{1,3}/.exec(escaped)?.[0];
    if (octal) {
      bytes.push(Number.parseInt(octal, 8));
      index += octal.length + 1;
      continue;
    }
    bytes.push(...UTF8_ENCODER.encode(decodeGitDiffEscape(escaped[0] ?? "")));
    index += 2;
  }
  return null;
}
function decodeGitDiffEscape(character) {
  return {
    a: "\x07",
    b: "\b",
    f: "\f",
    n: `
`,
    r: "\r",
    t: "\t",
    v: "\v"
  }[character] ?? character;
}
function cleanGitDiffTarget(target) {
  return cleanExactPatchTarget(normalizeGitDiffTarget(target));
}
function cleanGitTargetPair(oldTarget, newTarget) {
  if (oldTarget === "/dev/null")
    return cleanSingleGitTarget(newTarget);
  if (newTarget === "/dev/null")
    return cleanSingleGitTarget(oldTarget);
  if (oldTarget.startsWith("a/") && newTarget.startsWith("b/")) {
    return [oldTarget.slice(2), newTarget.slice(2)].flatMap(cleanExactPatchTarget);
  }
  const commonRemainder = getCommonGitPrefixRemainder(oldTarget, newTarget) ?? (oldTarget === newTarget ? stripFirstGitPathComponent(oldTarget) : null);
  return [oldTarget, newTarget, ...commonRemainder ? [commonRemainder] : []].flatMap(cleanExactPatchTarget);
}
function cleanSingleGitTarget(target) {
  const stripped = stripFirstGitPathComponent(target);
  return [target, ...stripped ? [stripped] : []].flatMap(cleanExactPatchTarget);
}
function stripFirstGitPathComponent(target) {
  const separator = target.indexOf("/");
  return separator > 0 && separator < target.length - 1 ? target.slice(separator + 1) : null;
}
function getCommonGitPrefixRemainder(oldTarget, newTarget) {
  const oldSeparator = oldTarget.indexOf("/");
  const newSeparator = newTarget.indexOf("/");
  if (oldSeparator < 1 || newSeparator < 1)
    return null;
  if (oldTarget.slice(0, oldSeparator) === newTarget.slice(0, newSeparator))
    return null;
  const oldRemainder = oldTarget.slice(oldSeparator + 1);
  return oldRemainder === newTarget.slice(newSeparator + 1) ? oldRemainder : null;
}
function cleanUnifiedDiffTarget(target) {
  return cleanGitDiffTarget(decodeGitMetadataTarget(target, true));
}
function cleanExtendedGitTarget(target) {
  return cleanExactPatchTarget(decodeGitMetadataTarget(target, false));
}
function decodeGitMetadataTarget(target, allowTrailingMetadata) {
  const trimmed = target.trim();
  const quote = trimmed[0] === '"' || trimmed[0] === "'" ? trimmed[0] : undefined;
  if (quote) {
    const field = parseQuotedGitDiffField(trimmed, 0, quote);
    if (field && (allowTrailingMetadata || trimmed.slice(field.end).trim() === "")) {
      return field.value;
    }
  }
  return allowTrailingMetadata ? trimmed.split("\t", 1)[0]?.trim() ?? "" : trimmed;
}
function normalizeGitDiffTarget(target) {
  return target.startsWith("a/") || target.startsWith("b/") ? target.slice(2) : target;
}
function cleanExactPatchTarget(target) {
  return target === "" || target === "/dev/null" ? [] : [target];
}
function cleanPatchTarget(target) {
  const path = target.split("\t", 1)[0]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
  return path === "" || path === "/dev/null" ? [] : [path];
}
// src/core/paths/tmpdir.ts
var import_node_path6 = require("node:path");
var TEMP_ROOTS = ["/tmp", "/var/tmp", "/private/tmp", "/private/var/tmp"];
var DEFAULT_IFS = ` 	
`;
function isTmpdirOverriddenToNonTemp(envAssignments, environment) {
  if (hasUnsafeTmpdirWordSplitting(envAssignments, environment))
    return true;
  if (!envAssignments.has("TMPDIR"))
    return false;
  return !isAssignedTmpdirValueTrusted(envAssignments.get("TMPDIR") ?? "", environment);
}
function isTmpdirValueTrusted(envAssignments, environment) {
  if (envAssignments.has("TMPDIR")) {
    return isAssignedTmpdirValueTrusted(envAssignments.get("TMPDIR") ?? "", environment);
  }
  const tmpdirValue = getEffectiveTmpdirValue(envAssignments, environment);
  if (tmpdirValue === undefined)
    return true;
  return isAssignedTmpdirValueTrusted(tmpdirValue, environment);
}
function getEffectiveTmpdirValue(envAssignments, environment) {
  return getEffectiveShellEnvValue(envAssignments, environment, "TMPDIR");
}
function isAssignedTmpdirValueTrusted(tmpdirValue, environment) {
  if (!tmpdirValue)
    return false;
  if (hasUnsafeTmpdirShellExpansion(tmpdirValue))
    return false;
  return isTrustedTempPath(tmpdirValue, environment);
}
function hasUnsafeTmpdirWordSplitting(envAssignments, environment) {
  const ifs = getEffectiveShellEnvValue(envAssignments, environment, "IFS");
  return ifs !== undefined && ifs !== "" && ifs !== DEFAULT_IFS;
}
function isTrustedTempPath(path, environment) {
  const normalizedPath = tryResolveExistingPathComponents(path, environment.paths);
  if (normalizedPath === null)
    return false;
  return trustedTempRoots(environment).some((root) => isPathOrSubpath(normalizedPath, root));
}
function isTrustedTempRootPath(path, environment) {
  const normalizedPath = tryResolveExistingPathComponents(path, environment.paths);
  if (normalizedPath === null)
    return false;
  return trustedTempRoots(environment).some((root) => normalizePathForComparison2(root) === normalizePathForComparison2(normalizedPath));
}
var trustedTempRootsByEnvironment = new WeakMap;
function trustedTempRoots(environment) {
  const cached = trustedTempRootsByEnvironment.get(environment);
  if (cached)
    return cached;
  const resolved = resolveTrustedTempRoots(environment);
  trustedTempRootsByEnvironment.set(environment, resolved);
  return resolved;
}
function resolveTrustedTempRoots(environment) {
  const roots = TEMP_ROOTS.map((root) => tryResolveExistingPathComponents(root, environment.paths) ?? import_node_path6.normalize(root));
  const systemTmpdir = tryResolveExistingPathComponents(environment.tmpdir, environment.paths);
  if (!systemTmpdir)
    return roots;
  if (process.platform === "win32")
    return [...roots, systemTmpdir];
  if (process.platform === "darwin" && isMacOSPerUserTempRoot(systemTmpdir)) {
    return [...roots, systemTmpdir];
  }
  return roots;
}
function hasUnsafeTmpdirShellExpansion(path) {
  return /[\s$`*?[]/.test(path) || /\{[^{}]*(?:,|\.\.)[^{}]*\}/.test(path) || /[+@!]\([^)]*\)/.test(path);
}
function getEffectiveShellEnvValue(envAssignments, environment, name) {
  return envAssignments.has(name) ? envAssignments.get(name) : environment.env.get(name);
}
function isMacOSPerUserTempRoot(path) {
  return /^\/(?:private\/)?var\/folders\/[^/]{2}\/[^/]+\/T$/.test(path);
}
function tryResolveExistingPathComponents(path, paths) {
  try {
    const normalized = import_node_path6.normalize(path);
    if (!import_node_path6.isAbsolute(normalized)) {
      return normalized;
    }
    const root = import_node_path6.parse(normalized).root;
    const components = normalized.slice(root.length).split(/[\\/]+/).filter(Boolean);
    let current = root;
    for (let i = 0;i < components.length; i++) {
      const candidate = import_node_path6.join(current, components[i] ?? "");
      if (paths.entryKind(candidate) === "missing") {
        return import_node_path6.join(candidate, ...components.slice(i + 1));
      }
      const resolved = paths.realpath(candidate);
      if (resolved === null)
        return null;
      current = resolved;
    }
    return current;
  } catch {
    return null;
  }
}
function isPathOrSubpath(path, basePath) {
  const normalizedPath = normalizePathForComparison2(path);
  const normalizedBasePath = normalizePathForComparison2(basePath);
  if (normalizedPath === normalizedBasePath) {
    return true;
  }
  const baseWithSlash = normalizedBasePath.endsWith(import_node_path6.sep) ? normalizedBasePath : `${normalizedBasePath}${import_node_path6.sep}`;
  return normalizedPath.startsWith(baseWithSlash);
}
function normalizePathForComparison2(path) {
  return process.platform === "win32" ? path.toLowerCase() : path;
}
// src/core/policy/analysis-context.ts
function resolveCommandAnalysisContext(options) {
  const capabilities = options.effectiveCapabilities;
  const strict = options.strict ?? capabilities.fail_closed.enabled;
  const paranoidRm = options.paranoidRm ?? capabilities.paranoid_rm.enabled;
  const paranoidInterpreters = options.paranoidInterpreters ?? capabilities.paranoid_interpreters.enabled;
  const effectiveCapabilities = {
    fail_closed: applyAnalysisOverride(capabilities.fail_closed, options.strict, "strict"),
    paranoid_rm: applyAnalysisOverride(capabilities.paranoid_rm, options.paranoidRm, "paranoidRm"),
    paranoid_interpreters: applyAnalysisOverride(capabilities.paranoid_interpreters, options.paranoidInterpreters, "paranoidInterpreters")
  };
  return {
    policy: createCommandAnalysisPolicy(options.policySnapshot.policy, effectiveCapabilities),
    effectiveCapabilities,
    effectiveLevel: deriveEffectiveSafetyLevel({
      failClosed: strict,
      paranoidRm,
      paranoidInterpreters
    }),
    strict,
    paranoidRm,
    paranoidInterpreters,
    worktreeMode: options.worktreeMode ?? false
  };
}
function applyAnalysisOverride(capability, override, option) {
  if (override === undefined || override === capability.enabled)
    return capability;
  return {
    enabled: override,
    source: "capability_override",
    sources: [...capability.sources, `analysis options.${option}`]
  };
}
// src/core/policy/scope-policy.ts
var import_node_path7 = require("node:path");
var import_safe_read3 = require("./core-shell.js");

// src/core/policy/rulebook.ts
var import_constants3 = require("./core-shell.js");

// src/core/policy/rulebook-limits.ts
var RULEBOOK_LIMIT_ERROR = "Rulebook exceeds CC Safety Net's safe validation limits.";
var RULEBOOK_VALIDATION_TRUNCATED = "Additional rulebook validation errors were omitted.";
var RULEBOOK_LIMITS = Object.freeze({
  maxAllowedCommands: 1024,
  maxRules: 1024,
  maxTests: 2048,
  maxBlockArgsPerRule: 1024,
  maxTotalBlockArgs: 16384,
  maxStringCodeUnits: 1048576,
  maxAggregateStringCodeUnits: 4194304,
  maxFixtureCommandCodeUnits: 131072,
  maxValidationErrors: 64
});
function isRulebookWithinAcceptanceLimits(rulebook) {
  if (exceedsArrayLimit(rulebook.allowed_commands, RULEBOOK_LIMITS.maxAllowedCommands) || exceedsArrayLimit(rulebook.rules, RULEBOOK_LIMITS.maxRules) || exceedsArrayLimit(rulebook.tests, RULEBOOK_LIMITS.maxTests)) {
    return false;
  }
  let remainingStringCodeUnits = RULEBOOK_LIMITS.maxAggregateStringCodeUnits;
  let remainingBlockArgs = RULEBOOK_LIMITS.maxTotalBlockArgs;
  const acceptString = (value, fixtureCommand = false) => {
    if (typeof value !== "string")
      return true;
    if (value.length > RULEBOOK_LIMITS.maxStringCodeUnits || fixtureCommand && value.length > RULEBOOK_LIMITS.maxFixtureCommandCodeUnits || value.length > remainingStringCodeUnits) {
      return false;
    }
    remainingStringCodeUnits -= value.length;
    return true;
  };
  if (!acceptString(rulebook.name) || !acceptString(rulebook.version) || !acceptString(rulebook.description) || !acceptString(rulebook.author) || !acceptString(rulebook.migrated_from)) {
    return false;
  }
  if (Array.isArray(rulebook.allowed_commands)) {
    for (const command of rulebook.allowed_commands) {
      if (!acceptString(command))
        return false;
    }
  }
  if (Array.isArray(rulebook.rules)) {
    for (const rule of rulebook.rules) {
      if (!rule || typeof rule !== "object")
        continue;
      const candidate = rule;
      if (!acceptString(candidate.name) || !acceptString(candidate.command) || !acceptString(candidate.subcommand) || !acceptString(candidate.reason) || !acceptString(candidate.intent)) {
        return false;
      }
      const match = candidate.match && typeof candidate.match === "object" ? candidate.match : {};
      for (const tokens of [
        candidate.block_args,
        match.command_path,
        match.any_args,
        match.exclude_args
      ]) {
        if (!Array.isArray(tokens))
          continue;
        if (tokens.length > RULEBOOK_LIMITS.maxBlockArgsPerRule || tokens.length > remainingBlockArgs) {
          return false;
        }
        remainingBlockArgs -= tokens.length;
        for (const token of tokens) {
          if (!acceptString(token))
            return false;
        }
      }
    }
  }
  if (Array.isArray(rulebook.tests)) {
    for (const fixture of rulebook.tests) {
      if (!fixture || typeof fixture !== "object")
        continue;
      const candidate = fixture;
      if (!acceptString(candidate.command, true) || !acceptString(candidate.expect) || !acceptString(candidate.rule)) {
        return false;
      }
    }
  }
  return true;
}
function exceedsArrayLimit(value, limit) {
  return Array.isArray(value) && value.length > limit;
}

// src/core/policy/rulebook.ts
function assertValidRulebook(rulebook) {
  const result = validateRulebook(rulebook);
  if (result.errors.length > 0) {
    throw new Error(result.errors.join("; "));
  }
  return rulebook;
}
var RULEBOOK_REASON_ERROR = `required non-empty string up to ${import_constants3.MAX_REASON_LENGTH} characters`;
var TOKEN_LIST_ERROR = "must be a non-empty array of unique non-empty strings";
var COMMAND_PATH_ERROR = "required non-empty array of non-empty strings";
function validateRulebook(rulebook) {
  if (!isRecord3(rulebook)) {
    return { errors: ["Rulebook must be an object"], ruleNames: new Set };
  }
  if (!isRulebookWithinAcceptanceLimits(rulebook)) {
    return { errors: [RULEBOOK_LIMIT_ERROR], ruleNames: new Set };
  }
  const errors = [
    ...rulebook.rulebook_version === 1 || rulebook.rulebook_version === 2 ? [] : ["rulebook_version must be 1 or 2"],
    ...formatIssues(rulebookIssues(rulebook, rulebook.rulebook_version === 2), ": ", ": ")
  ];
  return {
    errors: errors.length > RULEBOOK_LIMITS.maxValidationErrors ? [...errors.slice(0, RULEBOOK_LIMITS.maxValidationErrors), RULEBOOK_VALIDATION_TRUNCATED] : errors,
    ruleNames: new Set(collectCustomRuleNames(rulebook).map((name) => name.toLowerCase()))
  };
}
function collectCustomRuleNames(config) {
  const rules = isRecord3(config) ? config.rules : undefined;
  return (Array.isArray(rules) ? rules : []).flatMap((rule) => {
    const name = isRecord3(rule) ? rule.name : undefined;
    return typeof name === "string" ? [name] : [];
  });
}
function rulebookIssues(rulebook, v2) {
  return [
    ...typeof rulebook.name === "string" && NAME_PATTERN.test(rulebook.name) ? [] : [typed(["name"], "required string matching rule name pattern")],
    ...typeof rulebook.version === "string" && rulebook.version !== "" ? [] : [typed(["version"], "required non-empty string")],
    ...allowedCommandIssues(rulebook.allowed_commands),
    ...rulebookRuleIssues(rulebook.rules, v2),
    ...rulebookTestIssues(rulebook.tests),
    ...unknownFixtureRuleIssues(rulebook),
    ...unlistedRuleCommandIssues(rulebook)
  ];
}
function allowedCommandIssues(commands) {
  if (!Array.isArray(commands))
    return [typed(["allowed_commands"], "required array")];
  const seen = new Set;
  return [
    ...commands.flatMap((command, index) => typeof command === "string" && import_constants3.COMMAND_PATTERN.test(command) ? [] : [typed(["allowed_commands", index], "must match command pattern")]),
    ...commands.flatMap((command, index) => {
      if (typeof command !== "string" || !import_constants3.COMMAND_PATTERN.test(command))
        return [];
      if (seen.has(command)) {
        return [custom(["allowed_commands", index], `duplicate command "${command}"`)];
      }
      seen.add(command);
      return [];
    })
  ];
}
function rulebookRuleIssues(rules, v2) {
  if (!Array.isArray(rules))
    return [typed(["rules"], "required array")];
  return [
    ...rules.flatMap((rule, index) => {
      if (!isRecord3(rule))
        return [typed(["rules", index], "must be an object")];
      return v2 ? v2RuleIssues(rule, ["rules", index]) : v1RuleIssues(rule, ["rules", index]);
    }),
    ...duplicateRuleNameIssues(rules)
  ];
}
function v1RuleIssues(rule, path) {
  return [
    ...ruleNameIssues(rule.name, path),
    ...ruleCommandIssues(rule.command, path),
    ...rule.subcommand === undefined || typeof rule.subcommand === "string" && import_constants3.COMMAND_PATTERN.test(rule.subcommand) ? [] : [typed([...path, "subcommand"], "must match command pattern")],
    ...tokenArrayIssues(rule.block_args, [...path, "block_args"], "required non-empty array", false),
    ...ruleReasonIssues(rule.reason, path),
    ...ruleIntentIssues(rule.intent, path)
  ];
}
function v2RuleIssues(rule, path) {
  return [
    ...ruleNameIssues(rule.name, path),
    ...ruleCommandIssues(rule.command, path),
    ...ruleReasonIssues(rule.reason, path),
    ...ruleIntentIssues(rule.intent, path),
    ...v2MatchIssues(rule.match, [...path, "match"]),
    ...rule.subcommand === undefined ? [] : [typed([...path, "subcommand"], "not supported in rulebook_version 2")],
    ...rule.block_args === undefined ? [] : [typed([...path, "block_args"], "not supported in rulebook_version 2")]
  ];
}
function ruleNameIssues(name, path) {
  if (typeof name !== "string")
    return [typed([...path, "name"], "required string")];
  return NAME_PATTERN.test(name) ? [] : [typed([...path, "name"], "must match rule name pattern")];
}
function ruleCommandIssues(command, path) {
  return typeof command === "string" && import_constants3.COMMAND_PATTERN.test(command) ? [] : [typed([...path, "command"], "required string matching command pattern")];
}
function ruleReasonIssues(reason, path) {
  return typeof reason === "string" && reason !== "" && reason.length <= import_constants3.MAX_REASON_LENGTH ? [] : [typed([...path, "reason"], RULEBOOK_REASON_ERROR)];
}
function ruleIntentIssues(intent, path) {
  return intent === undefined || isBlockIntent(intent) ? [] : [typed([...path, "intent"], INTENT_ERROR)];
}
function v2MatchIssues(match, path) {
  if (!isRecord3(match))
    return [typed(path, "required object")];
  return [
    ...tokenArrayIssues(match.command_path, [...path, "command_path"], COMMAND_PATH_ERROR, false),
    ...match.any_args === undefined ? [] : tokenArrayIssues(match.any_args, [...path, "any_args"], TOKEN_LIST_ERROR, true),
    ...match.exclude_args === undefined ? [] : tokenArrayIssues(match.exclude_args, [...path, "exclude_args"], TOKEN_LIST_ERROR, true)
  ];
}
function tokenArrayIssues(tokens, path, arrayError, unique) {
  if (!Array.isArray(tokens))
    return [typed(path, arrayError)];
  const elements = tokens.flatMap((token, index) => {
    if (typeof token !== "string") {
      return [typed([...path, index], "must be a non-empty string")];
    }
    return token === "" ? [custom([...path, index], "must be a non-empty string")] : [];
  });
  if (tokens.some((token) => typeof token !== "string"))
    return elements;
  return [
    ...elements,
    ...tokens.length === 0 ? [custom(path, arrayError)] : [],
    ...unique && new Set(tokens).size !== tokens.length ? [custom(path, "must not contain duplicate values")] : []
  ];
}
function rulebookTestIssues(tests) {
  if (tests === undefined)
    return [];
  if (!Array.isArray(tests))
    return [typed(["tests"], "must be an array if provided")];
  return tests.flatMap((fixture, index) => {
    if (!isRecord3(fixture))
      return [typed(["tests", index], "must be an object")];
    return [
      ...typeof fixture.command === "string" && fixture.command.trim() !== "" ? [] : [typed(["tests", index, "command"], "required non-empty string")],
      ...fixture.expect === "blocked" || fixture.expect === "allowed" ? [] : [typed(["tests", index, "expect"], 'must be "blocked" or "allowed"')],
      ...fixture.rule === undefined || typeof fixture.rule === "string" ? [] : [typed(["tests", index, "rule"], "must be a string if provided")],
      ...fixture.expect === "blocked" && typeof fixture.rule !== "string" ? [custom(["tests", index, "rule"], "required string for blocked fixtures")] : []
    ];
  });
}
function unknownFixtureRuleIssues(rulebook) {
  if (!Array.isArray(rulebook.tests))
    return [];
  const declared = new Set(collectCustomRuleNames(rulebook));
  return [
    ...new Set(rulebook.tests.flatMap((fixture) => isRecord3(fixture) && fixture.expect === "blocked" && typeof fixture.rule === "string" ? [fixture.rule] : []))
  ].filter((rule) => !declared.has(rule)).map((rule) => custom(["tests"], `blocked fixture references unknown rule "${rule}"`));
}
function unlistedRuleCommandIssues(rulebook) {
  if (!Array.isArray(rulebook.allowed_commands) || !Array.isArray(rulebook.rules))
    return [];
  const allowed = new Set(rulebook.allowed_commands.filter((command) => typeof command === "string"));
  return rulebook.rules.flatMap((rule, index) => {
    const command = isRecord3(rule) ? rule.command : undefined;
    if (typeof command !== "string" || allowed.has(command))
      return [];
    return [custom(["rules", index, "command"], `"${command}" must be listed in allowed_commands`)];
  });
}
function isRecord3(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

// src/core/policy/scope-policy.ts
function loadRulesPolicy(environment, options) {
  const paths = getPolicyPaths(environment, options);
  let sameConfigPath;
  try {
    sameConfigPath = import_safe_read3.isSamePolicyFilesystemTarget(paths.userConfigTarget, paths.projectConfigTarget);
  } catch (error) {
    if (error instanceof import_safe_read3.PolicyFilesystemError) {
      return invalidLoadedRulesPolicy(paths, error.message);
    }
    throw error;
  }
  const user = readRulesConfig(paths.userConfigTarget);
  const project = sameConfigPath ? { config: null, errors: [] } : readRulesConfig(paths.projectConfigTarget);
  const userReadErrors = formatPolicyReadErrors(paths.userConfigPath, user.errors);
  const projectReadErrors = formatPolicyReadErrors(paths.projectConfigPath, project.errors);
  const claimedRulebookNames = new Set;
  const userPolicy = user.config ? loadScopePolicy(user.config, import_node_path7.dirname(paths.userConfigPath), "user", paths.userScope, claimedRulebookNames) : emptyScopePolicy();
  const projectPolicy = project.config ? loadScopePolicy(project.config, import_node_path7.dirname(paths.projectConfigPath), "project", paths.projectScope, claimedRulebookNames) : emptyScopePolicy();
  const userOverrides = user.config?.overrides ?? {};
  const projectOverrides = project.config?.overrides ?? {};
  return {
    rules: [
      ...applyOverrides(userPolicy.rules, userOverrides),
      ...applyOverrides(projectPolicy.rules, projectOverrides)
    ],
    transparent_wrappers: mergeTransparentWrappers(user.config, project.config),
    rulebooks: [...userPolicy.rulebooks, ...projectPolicy.rulebooks],
    errors: [
      ...userReadErrors,
      ...projectReadErrors,
      ...userPolicy.errors,
      ...projectPolicy.errors
    ],
    warnings: [
      ...userPolicy.warnings,
      ...projectPolicy.warnings,
      ...userPolicy.canValidateOverrides ? getUnknownOverrideErrors(userOverrides, userPolicy.knownRuleIds, paths.userConfigPath) : [],
      ...userPolicy.canValidateOverrides ? getProjectOverrideUserRuleErrors(projectOverrides, userPolicy.knownRuleIds, paths.projectConfigPath) : [],
      ...projectPolicy.canValidateOverrides ? getUnknownOverrideErrors(projectOverrides, projectPolicy.knownRuleIds, paths.projectConfigPath) : []
    ],
    userConfig: user.config ?? undefined,
    projectConfig: project.config ?? undefined,
    ...paths
  };
}
function getRulesConfigRuntimeErrorsForConfig(configPath, filesystemScope) {
  const loaded = loadScopePolicyForConfig(configPath, filesystemScope);
  if (!loaded)
    return [];
  return [
    ...loaded.scope.errors,
    ...loaded.scope.warnings,
    ...getUnknownOverrideErrorsForScope(loaded.config, loaded.scope, configPath)
  ];
}
function loadScopePolicyForConfig(configPath, filesystemScope) {
  const scope = filesystemScope ?? import_safe_read3.bindPolicyFilesystemScope(import_node_path7.dirname(import_node_path7.dirname(configPath)), "rules policy");
  const config = readRulesConfig(import_safe_read3.getPolicyFilesystemTargetForPath(scope, configPath)).config;
  if (!config) {
    return null;
  }
  return {
    config,
    scope: loadScopePolicy(config, import_node_path7.dirname(configPath), "project", scope)
  };
}
function getUnknownOverrideErrorsForScope(config, scope, configPath) {
  return scope.canValidateOverrides ? getUnknownOverrideErrors(config.overrides ?? {}, scope.knownRuleIds, configPath) : [];
}
function loadScopePolicy(config, configDir, source, filesystemScope = import_safe_read3.bindPolicyFilesystemScope(import_node_path7.dirname(import_node_path7.dirname(configDir)), source === "user" ? "user policy" : "project policy"), claimedRulebookNames = new Set) {
  const errors = [];
  const warnings = [];
  const loaded = config.rules.flatMap((spec) => {
    const loadedRulebook = loadRulebookForSpec(spec, configDir, filesystemScope);
    if (loadedRulebook.errors.length > 0 || !loadedRulebook.rulebook) {
      errors.push(...loadedRulebook.errors);
      return [];
    }
    const rulebook = loadedRulebook.rulebook;
    if (claimedRulebookNames.has(rulebook.name)) {
      warnings.push(`duplicate active rulebook name "${rulebook.name}" for ${spec}; keeping the first and ignoring this one, so its rules are not active; rename one of them in its rulebook file and in the rules config that lists it`);
      return [];
    }
    claimedRulebookNames.add(rulebook.name);
    return [
      {
        rules: toPolicyRules(rulebook),
        rulebook: {
          source,
          spec,
          name: rulebook.name,
          version: rulebook.version,
          rules: rulebook.rules.map((rule) => `${rulebook.name}/${rule.name}`)
        }
      }
    ];
  });
  const rules = loaded.flatMap((item) => item.rules);
  return {
    rules,
    rulebooks: loaded.map((item) => item.rulebook),
    knownRuleIds: new Set(rules.map((rule) => rule.name)),
    errors,
    warnings,
    canValidateOverrides: errors.length === 0
  };
}
function toPolicyRules(rulebook) {
  if (rulebook.rulebook_version === 2) {
    return rulebook.rules.map((rule) => ({
      name: `${rulebook.name}/${rule.name}`,
      command: rule.command,
      block_args: [],
      match: rule.match,
      reason: rule.reason,
      intent: rule.intent
    }));
  }
  return rulebook.rules.map((rule) => ({
    ...rule,
    name: `${rulebook.name}/${rule.name}`,
    match: undefined
  }));
}
function loadRulebookForSpec(spec, configDir, filesystemScope) {
  const name = getRulebookNameForSpec(spec);
  const path = getLocalRulebookPath(configDir, name);
  const file = readRulebookFile(path, filesystemScope);
  if ("error" in file)
    return { rulebook: null, errors: [file.error] };
  if (file.content === null) {
    return {
      rulebook: null,
      errors: [`missing rulebook file ${path} for ${spec}; ${getMissingRulebookRepair(spec)}`]
    };
  }
  const validated = validateRulebookContent(file.content);
  if ("problem" in validated) {
    return {
      rulebook: null,
      errors: [`invalid rulebook ${path}: ${validated.problem}; fix that file`]
    };
  }
  if (validated.rulebook.name !== name) {
    return {
      rulebook: null,
      errors: [
        `rulebook name "${validated.rulebook.name}" in ${path} must match source "${spec}"; fix that file`
      ]
    };
  }
  return { rulebook: validated.rulebook, errors: [] };
}
function getRulebookNameForSpec(spec) {
  return isGitHubRulebookSource(spec) ? parseGitHubSource(spec).name : spec;
}
function getMissingRulebookRepair(spec) {
  return isGitHubRulebookSource(spec) ? `run ${RULE_UPDATE_COMMAND} to vendor ${spec}` : "create that file or remove that source from the rules config";
}
function readRulebookFile(path, filesystemScope) {
  try {
    return { content: import_safe_read3.readPolicyFile(import_safe_read3.getPolicyFilesystemTargetForPath(filesystemScope, path)) };
  } catch (error) {
    if (error instanceof import_safe_read3.PolicyFilesystemError)
      return { error: error.message };
    throw error;
  }
}
function validateRulebookContent(content) {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { problem: "Invalid JSON" };
  }
  try {
    return { rulebook: assertValidRulebook(parsed) };
  } catch (error) {
    return { problem: error instanceof Error ? error.message : "invalid rulebook" };
  }
}
function mergeTransparentWrappers(userConfig, projectConfig) {
  return [
    ...new Set([
      ...userConfig?.transparent_wrappers ?? [],
      ...projectConfig?.transparent_wrappers ?? []
    ])
  ];
}
function applyOverrides(rules, overrides) {
  return rules.flatMap((rule) => {
    const override = overrides[rule.name];
    if (override === "off") {
      return [];
    }
    if (override && typeof override === "object") {
      return [{ ...rule, intent: override.intent ?? rule.intent, reason: override.reason }];
    }
    return [rule];
  });
}
function getUnknownOverrideErrors(overrides, knownRuleIds, configPath) {
  return Object.keys(overrides).filter((key) => !knownRuleIds.has(key)).map((key) => `unknown override key "${key}" in ${configPath}; only that override is ignored and other overrides and rules keep their configured state; correct or remove it in that file`);
}
function getProjectOverrideUserRuleErrors(projectOverrides, userRuleIds, configPath) {
  return Object.keys(projectOverrides).filter((key) => userRuleIds.has(key)).map((key) => `project override cannot target user-scoped rule "${key}" in ${configPath}; only that override is ignored and the rule keeps its user-configured state; remove it from that file`);
}
function formatPolicyReadErrors(path, errors) {
  return errors.map((error) => error.startsWith("Unable to access ") ? error : `${path}: ${error}`);
}
function invalidLoadedRulesPolicy(paths, error) {
  return {
    rules: [],
    transparent_wrappers: [],
    rulebooks: [],
    errors: [error],
    warnings: [],
    userConfigPath: paths.userConfigPath,
    projectConfigPath: paths.projectConfigPath
  };
}
function emptyScopePolicy() {
  return {
    rules: [],
    rulebooks: [],
    knownRuleIds: new Set,
    errors: [],
    warnings: [],
    canValidateOverrides: true
  };
}

// src/core/policy/snapshot.ts
function loadPolicySnapshot(environment, options) {
  const rules = loadRulesPolicy(environment, options);
  const userPolicy = loadPolicyConfig(environment, options);
  const policy = {
    rules: rules.rules,
    transparentWrappers: rules.transparent_wrappers,
    safety: userPolicy.safety,
    worktreeMode: userPolicy.worktreeMode,
    destructiveCommandProtectionEnabled: userPolicy.destructiveCommandProtectionEnabled,
    destructiveCommandRuleOverrides: userPolicy.destructiveCommandRuleOverrides,
    destructiveCommandAllowPaths: userPolicy.destructiveCommandAllowPaths,
    secretProtection: {
      enabled: userPolicy.secretProtection.enabled ?? true,
      disabledRules: userPolicy.secretProtection.disabledRules ?? [],
      denyPaths: userPolicy.secretProtection.denyPaths,
      allowPaths: userPolicy.secretProtection.allowPaths ?? []
    }
  };
  const overrides = {
    ...rules.userConfig?.overrides,
    ...rules.projectConfig?.overrides
  };
  const ruleMetadata = Object.freeze(Object.fromEntries(policy.rules.map((rule) => {
    const rulebook = rules.rulebooks.find((item) => item.rules.includes(rule.name));
    const override = overrides[rule.name];
    return [
      rule.name,
      Object.freeze({
        id: rule.name,
        ...rulebook ? {
          rulebook: Object.freeze({ name: rulebook.name, version: rulebook.version }),
          ...isPublicRuleSource(rulebook.spec) ? { source: rulebook.spec } : {}
        } : {},
        ...override && typeof override === "object" ? { override: Object.freeze({ type: "reason", reason: override.reason }) } : {}
      })
    ];
  })));
  return createPolicySnapshot(policy, getSnapshotFailure(rules, userPolicy), ruleMetadata, userPolicy.policyScopes);
}
function describeConfigState(snapshot) {
  if (snapshot.state === "ready")
    return { state: snapshot.state };
  return { state: snapshot.state, reason: snapshot.reason };
}
function getSnapshotFailure(rules, userPolicy) {
  const policyWarning = getPolicyFallbackWarning(userPolicy);
  if (rules.errors.length === 0 && rules.warnings.length === 0 && !policyWarning)
    return;
  return {
    diagnostics: [...rules.errors, ...rules.warnings, ...userPolicy.errors],
    reason: combineInvalidReasons(rules.errors.length > 0 ? withDroppedSourceAdvice(rules.errors) : undefined, rules.warnings.length > 0 ? withTerminalPeriod(rules.warnings.join("; ")) : undefined, policyWarning)
  };
}
function withDroppedSourceAdvice(errors) {
  return `${withTerminalPeriod(errors.join("; "))} Those rule sources are not active; every other rule and all built-in protections still apply`;
}
function getPolicyFallbackWarning(userPolicy) {
  if (userPolicy.errors.length === 0)
    return;
  const fallback = userPolicy.fallback === "salvaged" ? "the salvaged policy with protective defaults" : "built-in protective defaults";
  return `invalid policy config: ${userPolicy.errors.join("; ")}. Enforcing ${fallback}; the invalid values are not active. Fix the policy file manually`;
}
function isPublicRuleSource(source) {
  return /^(?:[A-Za-z0-9_.-]+$|https:\/\/github\.com\/|github:|gh:|[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:#|$))/.test(source);
}
function createPolicySnapshot(policy, failure, ruleMetadata = Object.freeze({}), policyScopes) {
  const frozenPolicy = deepFreeze(structuredClone(policy));
  const scopes = policyScopes ? { policyScopes: deepFreeze(structuredClone(policyScopes)) } : {};
  if (!failure) {
    return Object.freeze({
      state: "ready",
      policy: frozenPolicy,
      diagnostics: Object.freeze([]),
      ruleMetadata,
      ...scopes
    });
  }
  return Object.freeze({
    state: "degraded",
    policy: frozenPolicy,
    diagnostics: Object.freeze([...failure.diagnostics]),
    reason: failure.reason,
    ruleMetadata,
    ...scopes
  });
}
function deepFreeze(value) {
  if (typeof value !== "object" || value === null)
    return value;
  for (const child of Object.values(value))
    deepFreeze(child);
  return Object.freeze(value);
}
function combineInvalidReasons(...reasons) {
  return withTerminalPeriod(reasons.filter((reason) => !!reason).join("; "));
}
function withTerminalPeriod(value) {
  return /[.!?]$/.test(value) ? value : `${value}.`;
}
// src/core/denial.ts
var FOOTERS = {
  hard_stop: "Do not retry this operation or attempt any workaround (other tools, flags, or paths). Report the block to the user and continue with the rest of the task.",
  use_alternative: "Do not retry the blocked form. Continue the task using the safer alternative described above.",
  scope_down: "Retry with a narrower, explicit target as described above. Escalate to the user if the broad operation is truly required.",
  manual_only: "If this operation is truly needed, ask the user for explicit permission and have them run the command manually.",
  stop_and_explain: "Do not brute-force variants. Simplify or restructure the command so it can be analyzed, or report the block to the user."
};
function formatBlockedMessage(input) {
  const maxLen = input.maxLen ?? 200;
  const redact = input.redact ?? ((text) => text);
  const excerpt = (text) => text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
  return [
    input.askUser ? "CC Safety Net could not verify this command" : "BLOCKED by CC Safety Net",
    `Reason: ${redact(input.reason)}`,
    input.ruleId ? `Rule: ${input.ruleId}` : undefined,
    input.toolName ? `Tool: ${input.toolName}` : undefined,
    input.command ? `Command: ${excerpt(redact(input.command))}` : undefined,
    input.segment && input.segment !== input.command ? `Segment: ${excerpt(redact(input.segment))}` : undefined,
    input.cwd ? `Working directory: ${excerpt(redact(input.cwd))}` : undefined,
    input.configWarning ? `Config warning: ${redact(input.configWarning)}` : undefined,
    input.askUser ? "Approve only if you expected this command." : FOOTERS[input.intent ?? "manual_only"]
  ].filter((line) => line !== undefined).join(`

`);
}
function projectGuardDenial(evaluation, options) {
  if (evaluation.decision.kind !== "deny")
    return;
  const evidence = options.includeEvidence ? evaluation.decision.evidence : undefined;
  return {
    reason: evaluation.decision.reason,
    ruleId: evaluation.decision.ruleId,
    intent: evaluation.decision.intent,
    command: evidence?.command,
    segment: evidence?.segment,
    toolName: options.toolName,
    ...evaluation.configFallback ? { configWarning: evaluation.configFallback.reason } : {},
    ...evaluation.decision.unverifiedByStandardMode ? { unverifiedByStandardMode: true } : {}
  };
}
function createFailedClosedDenial(options = {}) {
  return {
    reason: REASON_SAFETY_NET_FAILED_CLOSED,
    ruleId: "analysis.failed-closed",
    intent: "stop_and_explain",
    command: options.command,
    segment: options.segment ?? options.command,
    toolName: options.toolName
  };
}
var CWD_DENIALS = {
  session: {
    unusable: {
      reason: "CC Safety Net cannot check tool calls because the session's working directory or workspace root no longer exists, is inaccessible, is not a directory, or uses an unsupported path form. Ask the user to restart the session from an existing directory.",
      intent: "hard_stop",
      ruleId: "cwd.session-unusable"
    },
    "outside-workspace": {
      reason: "CC Safety Net cannot check tool calls because the session's working directory is outside its workspace roots. Ask the user to restart the session from a directory inside the workspace.",
      intent: "hard_stop",
      ruleId: "cwd.session-outside-workspace"
    }
  },
  requested: {
    unusable: {
      reason: "CC Safety Net could not use the requested working directory because it does not exist, is inaccessible, is not a directory, or uses an unsupported path form. Use an existing accessible working directory. If the requested directory is missing, create it from an accessible location before retrying the command.",
      intent: "use_alternative",
      ruleId: "cwd.requested-unusable"
    },
    "outside-workspace": {
      reason: "CC Safety Net could not use the requested working directory because it is outside the session's workspace. Use a working directory inside the workspace.",
      intent: "use_alternative",
      ruleId: "cwd.requested-outside-workspace"
    }
  }
};
function createCwdDenial(cause, options = {}) {
  return {
    ...CWD_DENIALS[cause.directory][cause.problem],
    command: options.command,
    toolName: options.toolName,
    cwd: cause.cwd
  };
}
function formatDenial(denial) {
  return formatBlockedMessage({ ...denial, redact: redactSecrets });
}
function formatAskPrompt(denial) {
  return formatBlockedMessage({ ...denial, redact: redactSecrets, askUser: true });
}
function formatIntegrationError(cause) {
  return redactSecrets(cause instanceof Error ? cause.message : String(cause));
}
// src/core/environment.ts
var import_node_fs4 = require("node:fs");
var import_node_os = require("node:os");

// src/core/git/metadata.ts
var import_node_fs3 = require("node:fs");
var import_node_path8 = require("node:path");
function resolveProtectedGitMetadata(cwd, environment) {
  if (cwd === "")
    return null;
  const budget = createBudget();
  const dotGitPath = findDotGitInAncestors(normalizeProtectedPathCandidate(cwd, cwd, environment, budget));
  const anchor = dotGitPath ? resolveGitMetadataAnchor(dotGitPath, cwd, environment, budget) : null;
  if (!anchor)
    return null;
  return Object.freeze({
    entries: Object.freeze([anchor.entry]),
    markerFiles: Object.freeze(anchor.markerFile ? [anchor.markerFile] : []),
    directories: Object.freeze(anchor.directories),
    hooksDirectories: Object.freeze(anchor.hooksDirectories)
  });
}
function resolveGitMetadataAnchor(dotGitPath, cwd, environment, budget) {
  try {
    const entry = normalizeProtectedPathCandidate(dotGitPath, cwd, environment, budget);
    const stat = import_node_fs3.statSync(dotGitPath);
    const markerFile = stat.isFile() ? entry : null;
    const fileTargets = stat.isFile() ? resolveDotGitFileTargets(dotGitPath) : null;
    const canonicalDirectories = (stat.isDirectory() ? [entry] : [fileTargets?.gitDir, fileTargets?.commonDir]).flatMap((path) => path ? [comparePath(normalizeProtectedPathCandidate(path, cwd, environment, budget))] : []);
    const directories = [
      ...new Set(stat.isDirectory() ? [comparePath(dotGitPath.replace(/\\/g, "/")), ...canonicalDirectories] : canonicalDirectories)
    ];
    return {
      entry: comparePath(entry),
      markerFile: markerFile ? comparePath(markerFile) : null,
      directories,
      hooksDirectories: [
        ...new Set(directories.flatMap((directory) => {
          const lexical = comparePath(import_node_path8.join(directory, "hooks").replace(/\\/g, "/"));
          return [
            lexical,
            comparePath(normalizeProtectedPathCandidate(lexical, cwd, environment, budget))
          ];
        }))
      ]
    };
  } catch {
    return null;
  }
}
function comparePath(path) {
  return process.platform === "win32" ? path.toLowerCase() : path;
}

// src/core/environment.ts
var processPathResolver = {
  realpath: (path) => {
    try {
      return import_node_fs4.realpathSync(path);
    } catch {
      return null;
    }
  },
  entryKind: (path) => {
    try {
      const stats = import_node_fs4.lstatSync(path, { throwIfNoEntry: false });
      if (!stats)
        return "missing";
      return stats.isSymbolicLink() ? "symlink" : "present";
    } catch (error) {
      if (error.code === "ENAMETOOLONG")
        return "missing";
      throw error;
    }
  },
  isDirectory: (path) => {
    try {
      return import_node_fs4.statSync(path).isDirectory();
    } catch {
      return false;
    }
  }
};
function createProcessEnvironment() {
  return withGitFacts({
    env: new Map(Object.entries(process.env).flatMap(([name, value]) => value === undefined ? [] : [[name, value]])),
    home: normalizeMsysDrivePath(process.env.HOME || import_node_os.homedir()),
    tmpdir: import_node_os.tmpdir(),
    paths: processPathResolver
  });
}
function createTestEnvironment(overrides = {}) {
  const { entries = new Map, ...rest } = overrides;
  return withGitFacts({
    env: new Map,
    home: "/home/user",
    tmpdir: "/tmp",
    paths: {
      realpath: (path) => fakeRealpath(entries, path, new Set),
      entryKind: (path) => {
        const entry = entries.get(path);
        if (entry === undefined)
          return "missing";
        return typeof entry === "string" ? "present" : "symlink";
      },
      isDirectory: (path) => {
        const target = fakeRealpath(entries, path, new Set);
        return target !== null && entries.get(target) === "directory";
      }
    }
  }, rest);
}
function fakeRealpath(entries, path, seen) {
  const entry = entries.get(path);
  if (entry === undefined || seen.has(path))
    return null;
  if (typeof entry === "string")
    return path;
  return fakeRealpath(entries, entry.symlink, new Set([...seen, path]));
}
function withGitFacts(base, overrides = {}) {
  const metadata = new Map;
  const facts = new Map;
  const environment = {
    ...base,
    gitMetadata: (cwd) => memoized(metadata, cwd, () => resolveProtectedGitMetadata(cwd, environment)),
    worktreeFacts: (cwd) => memoized(facts, cwd, () => resolveWorktreeFacts(cwd)),
    ...overrides
  };
  return environment;
}
function memoized(cache, key, compute) {
  const cached = cache.get(key);
  if (cached !== undefined)
    return cached;
  const value = compute();
  cache.set(key, value);
  return value;
}
