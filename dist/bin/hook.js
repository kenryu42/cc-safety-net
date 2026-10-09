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

// src/bin/hook.ts
var exports_hook = {};
__export(exports_hook, {
  CURSOR_AGENT_PROBE: () => CURSOR_AGENT_PROBE,
  DEEPSEEK_HARNESS_NPM_PROBE: () => DEEPSEEK_HARNESS_NPM_PROBE,
  GEMINI_CLI_HOOK_EVENT: () => GEMINI_CLI_HOOK_EVENT,
  HERMES_AGENT_HOOK_EVENT: () => HERMES_AGENT_HOOK_EVENT,
  PRE_TOOL_USE_HOOK_EVENT: () => PRE_TOOL_USE_HOOK_EVENT,
  detectClaudeShapeAgent: () => detectClaudeShapeAgent,
  doctorIntegrationOrder: () => doctorIntegrationOrder,
  encodeCwdForLogDirname: () => encodeCwdForLogDirname,
  evaluateRuntimeGuard: () => evaluateRuntimeGuard,
  findHookIntegrationByFlag: () => findHookIntegrationByFlag,
  findLegacyTopLevelHookIntegration: () => findLegacyTopLevelHookIntegration,
  getAntigravityHooksPath: () => getAntigravityHooksPath,
  getAuditLogHomeDir: () => getAuditLogHomeDir,
  getAuditLogsDir: () => getAuditLogsDir,
  getIntegrationDisplayName: () => getIntegrationDisplayName,
  getStandardHookContext: () => getStandardHookContext,
  getToolCwdHookContext: () => getToolCwdHookContext,
  installIntegrationMetadata: () => installIntegrationMetadata,
  integrationDisplayNames: () => integrationDisplayNames,
  parseCommandArgs: () => parseCommandArgs,
  projectGuardAudit: () => projectGuardAudit,
  pruneExpiredAuditLogs: () => pruneExpiredAuditLogs,
  reportCommandArgErrors: () => reportCommandArgErrors,
  runAntigravityCliHook: () => runAntigravityCliHook,
  runClaudeCodeHook: () => runClaudeCodeHook,
  runCodexHook: () => runCodexHook,
  runConfiguredHookAdapter: () => runConfiguredHookAdapter,
  runCopilotCliHook: () => runCopilotCliHook,
  runCursorHook: () => runCursorHook,
  runDevinHook: () => runDevinHook,
  runDroidHook: () => runDroidHook,
  runGeminiCLIHook: () => runGeminiCLIHook,
  runGrokBuildHook: () => runGrokBuildHook,
  runHermesAgentHook: () => runHermesAgentHook,
  runKimiCodeHook: () => runKimiCodeHook,
  runPreToolUseHook: () => runPreToolUseHook,
  runtimeHookIntegrationMetadata: () => runtimeHookIntegrationMetadata,
  sanitizeSessionIdForFilename: () => sanitizeSessionIdForFilename,
  writeAuditLog: () => writeAuditLog,
  writeGuardAudit: () => writeGuardAudit,
  writeIntegrationDenialAudit: () => writeIntegrationDenialAudit
});
module.exports = __toCommonJS(exports_hook);

// src/cli/args.ts
var HELP_FLAGS = ["-h", "--help"];
function parseCommandArgs(spec, argv) {
  const booleanEntries = Object.entries(spec.booleans ?? {});
  const valueEntries = Object.entries(spec.values ?? {});
  const listEntries = Object.entries(spec.lists ?? {});
  const flags = Object.fromEntries(booleanEntries.map(([name]) => [name, false]));
  const values = {};
  const lists = Object.fromEntries(listEntries.map(([name]) => [name, []]));
  const positionals = [];
  const errors = [];
  let help = false;
  let consumedIndex = -1;
  for (const [index, arg] of argv.entries()) {
    if (index <= consumedIndex)
      continue;
    if (arg === "--") {
      positionals.push(...argv.slice(index + 1));
      break;
    }
    if (HELP_FLAGS.includes(arg)) {
      help = true;
      continue;
    }
    const booleanEntry = booleanEntries.find(([, spellings]) => spellings.includes(arg));
    if (booleanEntry) {
      flags[booleanEntry[0]] = true;
      continue;
    }
    const valueEntry = valueEntries.find(([, spellings]) => spellings.includes(arg));
    if (valueEntry) {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith("-")) {
        errors.push(`${arg} requires a value`);
        continue;
      }
      values[valueEntry[0]] = value;
      consumedIndex = index + 1;
      continue;
    }
    const listEntry = listEntries.find(([, spellings]) => spellings.includes(arg));
    if (listEntry) {
      const remaining = argv.slice(index + 1);
      const nextOptionIndex = remaining.findIndex((value) => value.startsWith("-"));
      const listValues = remaining.slice(0, nextOptionIndex === -1 ? remaining.length : nextOptionIndex);
      if (listValues.length === 0) {
        errors.push(`${arg} requires at least one value`);
        continue;
      }
      lists[listEntry[0]] = [...lists[listEntry[0]] ?? [], ...listValues];
      consumedIndex = index + listValues.length;
      continue;
    }
    if (arg.startsWith("-")) {
      errors.push(`Unknown option for ${spec.label}: ${arg}`);
      continue;
    }
    if (spec.positionals === "tail") {
      positionals.push(...argv.slice(index));
      break;
    }
    positionals.push(arg);
  }
  if (spec.positionals !== "list" && spec.positionals !== "tail") {
    errors.push(...positionals.map((positional) => `Unexpected argument for ${spec.label}: ${positional}`));
  }
  return { flags, values, lists, positionals, help, errors };
}
function reportCommandArgErrors(errors) {
  for (const error of errors)
    console.error(error);
  return errors.length > 0;
}

// src/hosts/antigravity-cli/hook.ts
var import_node_path3 = require("node:path");
var import_budget2 = require("./core.js");
var import_denial2 = require("./core.js");
var import_canonicalization = require("./core.js");
var import_tool_input3 = require("./core.js");
var import_intake2 = require("./gate.js");

// src/hosts/hook/common.ts
var import_denial = require("./core.js");
var import_environment = require("./core.js");
var import_env = require("./core.js");
var import_tool_input2 = require("./core.js");
var import_intake = require("./gate.js");
var import_invocation = require("./gate.js");
var import_pipeline2 = require("./gate.js");

// src/audit/writer.ts
var import_node_fs2 = require("node:fs");
var import_node_path2 = require("node:path");
var import_random_hex = require("./core.js");
var import_redaction = require("./core.js");

// src/audit/retention.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_retention = require("./core.js");
var DAY_MS = 24 * 60 * 60 * 1000;
var PRUNE_MARKER_NAME = ".last-prune";
var MONTH_DIR = /^\d{4}-\d{2}$/;
var DATED_LOG_FILE = /^((\d{4}-\d{2})-\d{2})-.+\.jsonl$/;
var utcDay = (ms) => Math.floor(ms / DAY_MS);
function pruneExpiredAuditLogs(environment, logsDir, now = () => new Date) {
  try {
    const nowMs = now().getTime();
    if (!import_node_fs.statSync(logsDir, { throwIfNoEntry: false })?.isDirectory())
      return;
    const markerPath = import_node_path.join(logsDir, PRUNE_MARKER_NAME);
    const lastAttempt = import_node_fs.statSync(markerPath, { throwIfNoEntry: false })?.mtimeMs;
    if (lastAttempt !== undefined && utcDay(lastAttempt) === utcDay(nowMs))
      return;
    const cutoff = nowMs - import_retention.readRetentionDays(environment) * DAY_MS;
    const currentMonth = new Date(nowMs).toISOString().slice(0, 7);
    for (const entry of readDirEntries(logsDir)) {
      if (entry.isDirectory()) {
        pruneProjectDir(import_node_path.join(logsDir, entry.name), cutoff, currentMonth);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".jsonl")) {
        pruneLegacyFile(import_node_path.join(logsDir, entry.name), cutoff);
      }
    }
    import_node_fs.writeFileSync(markerPath, "", { mode: 384 });
    import_node_fs.utimesSync(markerPath, nowMs / 1000, nowMs / 1000);
  } catch {}
}
function pruneProjectDir(projectDir, cutoff, currentMonth) {
  for (const month of readDirEntries(projectDir)) {
    if (!month.isDirectory() || !MONTH_DIR.test(month.name))
      continue;
    const monthDir = import_node_path.join(projectDir, month.name);
    for (const file of readDirEntries(monthDir)) {
      if (!file.isFile())
        continue;
      const dated = DATED_LOG_FILE.exec(file.name);
      if (!dated || dated[2] !== month.name)
        continue;
      const endOfDay = Date.parse(`${dated[1]}T00:00:00.000Z`) + DAY_MS;
      if (!Number.isFinite(endOfDay) || endOfDay >= cutoff)
        continue;
      unlinkQuietly(import_node_path.join(monthDir, file.name));
    }
    if (month.name !== currentMonth)
      rmdirQuietly(monthDir);
  }
  rmdirQuietly(projectDir);
}
function pruneLegacyFile(filePath, cutoff) {
  try {
    const before = import_node_fs.lstatSync(filePath);
    if (before.mtimeMs >= cutoff)
      return;
    const timestamps = import_node_fs.readFileSync(filePath, "utf-8").split(`
`).filter((line) => line.trim()).map(parseEntryTimestamp);
    if (timestamps.length === 0)
      return;
    if (timestamps.some((ts) => ts === undefined || ts >= cutoff))
      return;
    if (import_node_fs.lstatSync(filePath).mtimeMs !== before.mtimeMs)
      return;
    unlinkQuietly(filePath);
  } catch {}
}
function parseEntryTimestamp(line) {
  try {
    const ts = JSON.parse(line).ts;
    const parsed = typeof ts === "string" ? Date.parse(ts) : Number.NaN;
    return Number.isFinite(parsed) ? parsed : undefined;
  } catch {
    return;
  }
}
function readDirEntries(dir) {
  try {
    return import_node_fs.readdirSync(dir, { withFileTypes: true, encoding: "utf8" });
  } catch {
    return [];
  }
}
function unlinkQuietly(filePath) {
  try {
    import_node_fs.unlinkSync(filePath);
  } catch {}
}
function rmdirQuietly(dir) {
  try {
    import_node_fs.rmdirSync(dir);
  } catch {}
}

// src/audit/writer.ts
var AUDIT_LOG_VERSION = "2.6.3";
var COMMAND_MAX_LENGTH = 1e4;
var SEGMENT_MAX_LENGTH = 2000;
var TOOL_NAME_MAX_LENGTH = 256;
var CWD_MAX_LENGTH = 32768;
function sanitizeSessionIdForFilename(sessionId) {
  const raw = sessionId.trim();
  if (!raw) {
    return null;
  }
  let safe = raw.replace(/[^A-Za-z0-9_.-]+/g, "_");
  safe = safe.replace(/^[._-]+|[._-]+$/g, "").slice(0, 128);
  if (!safe || safe === "." || safe === "..") {
    return null;
  }
  return safe;
}
function encodeCwdForLogDirname(cwd) {
  const encoded = (cwd ?? "").replace(/[^A-Za-z0-9]/g, "-").slice(0, 180);
  return encoded || "no-cwd";
}
function writeAuditLog(environment, sessionId, command, segment, reason, cwd, options = {}) {
  const safeSessionId = sanitizeSessionIdForFilename(sessionId);
  if (!safeSessionId) {
    return;
  }
  const logsDir = getAuditLogsDir(environment);
  if (!logsDir) {
    return;
  }
  try {
    const ts = (options.now ?? (() => new Date))().toISOString();
    const cappedCommand = capField(import_redaction.redactSecrets(command), options.failureStage ? Number.POSITIVE_INFINITY : COMMAND_MAX_LENGTH);
    const cappedSegment = capField(import_redaction.redactSecrets(segment), SEGMENT_MAX_LENGTH);
    const cappedToolName = options.toolName ? capField(import_redaction.redactSecrets(options.toolName), TOOL_NAME_MAX_LENGTH) : undefined;
    const cappedCwd = cwd === null ? undefined : capField(import_redaction.redactSecrets(cwd), CWD_MAX_LENGTH);
    const sessionDir = import_node_path2.join(logsDir, encodeCwdForLogDirname(cappedCwd?.value ?? null), ts.slice(0, 7));
    import_node_fs2.mkdirSync(sessionDir, { recursive: true, mode: 448 });
    const logFile = import_node_path2.join(sessionDir, `${ts.slice(0, 10)}-${safeSessionId}.jsonl`);
    const entry = {
      ts,
      id: (options.createId ?? import_random_hex.randomHex16)(),
      v: AUDIT_LOG_VERSION,
      sessionId: safeSessionId,
      decision: options.decision ?? "deny",
      agent: options.agent,
      shape: options.shape,
      level: options.level,
      configFallback: options.configFallback,
      toolName: cappedToolName?.value,
      command: cappedCommand.value,
      segment: cappedSegment.value,
      ...cappedCommand.truncated || cappedSegment.truncated || cappedToolName?.truncated || cappedCwd?.truncated ? { truncated: true } : {},
      reason,
      ruleId: options.ruleId,
      intent: options.intent,
      failureStage: options.failureStage,
      errorCode: options.errorCode,
      cwd: cappedCwd?.value ?? null
    };
    import_node_fs2.appendFileSync(logFile, `${JSON.stringify(entry)}
`, { encoding: "utf-8", mode: 384 });
    pruneExpiredAuditLogs(environment, logsDir, options.now);
  } catch {}
}
function capField(value, maxLength) {
  return { value: value.slice(0, maxLength), truncated: value.length > maxLength };
}
function getAuditLogHomeDir(environment) {
  const homeFromEnv = environment.env.get("CC_SAFETY_NET_AUDIT_HOME");
  if (environment.env.get("NODE_ENV") === "test" && !homeFromEnv) {
    return null;
  }
  const home = homeFromEnv || environment.home;
  return home && import_node_path2.isAbsolute(home) ? home : null;
}
function getAuditLogsDir(environment) {
  const homeDir = getAuditLogHomeDir(environment);
  return homeDir ? import_node_path2.join(homeDir, ".cc-safety-net", "logs") : null;
}

// src/hosts/audit.ts
function projectGuardAudit(invocation, evaluation, auditAllowed, includeInvocationCommand = true, failure) {
  if (evaluation.decision.kind === "allow") {
    if (!auditAllowed || invocation.route.kind !== "command")
      return;
    const command = getInvocationCommand(invocation);
    return {
      decision: "allow",
      command,
      segment: command,
      reason: "allowed",
      cwd: invocation.context.executionCwd,
      toolName: invocation.toolName,
      level: evaluation.level,
      ...evaluation.configFallback ? { configFallback: true } : {}
    };
  }
  const evidence = evaluation.decision.evidence;
  const command = evidence?.command ?? (includeInvocationCommand ? getInvocationCommand(invocation) : "");
  return {
    decision: "deny",
    command,
    segment: evidence?.segment ?? command,
    reason: evaluation.decision.reason,
    cwd: invocation.context.executionCwd,
    toolName: invocation.toolName,
    level: evaluation.level,
    ...evaluation.configFallback ? { configFallback: true } : {},
    ruleId: evaluation.decision.ruleId,
    intent: evaluation.decision.intent,
    failureStage: failure?.stage,
    errorCode: failure?.errorCode
  };
}
function getInvocationCommand(invocation) {
  return "command" in invocation ? invocation.command ?? "" : "";
}
function writeGuardAudit(environment, audit, getSessionId, options) {
  if (!audit)
    return;
  let sessionId;
  try {
    sessionId = getSessionId();
  } catch {
    return;
  }
  if (typeof sessionId !== "string" || !sessionId.trim())
    return;
  writeAuditLog(environment, sessionId, audit.command, audit.segment, audit.reason, audit.cwd, {
    decision: audit.decision,
    agent: options.agent,
    shape: options.shape,
    level: audit.level,
    configFallback: audit.configFallback,
    toolName: audit.toolName,
    ruleId: audit.ruleId,
    intent: audit.intent,
    failureStage: audit.failureStage,
    errorCode: audit.errorCode
  });
}
function writeIntegrationDenialAudit(environment, denial, getSessionId, options) {
  let sessionId;
  try {
    sessionId = getSessionId();
  } catch {
    return;
  }
  if (typeof sessionId !== "string" || !sessionId.trim())
    return;
  writeAuditLog(environment, sessionId, denial.command ?? "", denial.segment ?? denial.command ?? "", denial.reason, options.cwd ?? null, {
    decision: "deny",
    agent: options.agent,
    shape: options.shape,
    toolName: options.toolName ?? denial.toolName,
    ruleId: denial.ruleId,
    intent: denial.intent
  });
}

// src/hosts/runtime.ts
var import_budget = require("./core.js");
var import_tool_input = require("./core.js");
var import_semantic_facts = require("./gate.js");
var import_pipeline = require("./gate.js");
function evaluateRuntimeGuard(environment, invocation, options) {
  try {
    const evaluation = import_pipeline.evaluateGuard(invocation, { environment, ...options.guard });
    writeRuntimeAudit(environment, invocation, evaluation, options);
    return evaluation;
  } catch (error) {
    if (!(error instanceof import_pipeline.GuardEvaluationError))
      throw error;
    writeRuntimeAudit(environment, invocation, error.evaluation, options, !(error.cause instanceof import_tool_input.ToolInputLimitError), { stage: error.stage, errorCode: classifyAuditError(error.cause) });
    throw error;
  }
}
function writeRuntimeAudit(environment, invocation, evaluation, options, includeInvocationCommand = true, failure) {
  writeGuardAudit(environment, projectGuardAudit(invocation, evaluation, options.guard?.auditAllowed ?? false, includeInvocationCommand, failure), options.audit.getSessionId, {
    agent: options.audit.agent,
    shape: options.audit.shape
  });
}
function classifyAuditError(cause) {
  if (cause instanceof import_budget.AnalysisLimit)
    return import_budget.LIMITS[cause.kind].errorCode;
  if (cause instanceof import_tool_input.ToolInputLimitError)
    return "tool-input-limit";
  if (cause instanceof import_semantic_facts.StructuralShellSyntaxLimitError)
    return "structural-shell-syntax-limit";
  return "unexpected-error";
}

// src/hosts/hook/common.ts
var getStandardHookContext = (input, toolInput, toolName, outputDeny, environment) => import_intake.resolveStandardHookContext(input.cwd, toolInput, toolName, outputDeny, environment.paths, process.cwd());
var getToolCwdHookContext = (cwdKey, commandTools, options) => (input, toolInput, toolName, outputDeny, environment) => {
  const context = getStandardHookContext(input, toolInput, toolName, outputDeny, environment);
  if (!context)
    return null;
  const args = input.tool_input;
  if (!commandTools.has(toolName) || !args || !Object.hasOwn(args, cwdKey))
    return context;
  const requestedCwd = args[cwdKey];
  if (options?.emptyMeansSessionCwd && requestedCwd === "")
    return context;
  if (typeof requestedCwd !== "string" || requestedCwd.trim() === "") {
    import_intake.outputFailedClosed(outputDeny, toolInput, toolName);
    return null;
  }
  const executionCwd = options?.allowOutsideSessionCwd ? import_intake.resolveCanonicalCwd(requestedCwd, context.configCwd, environment.paths) : import_intake.resolveContainedCwd(requestedCwd, [context.configCwd], environment.paths);
  if (executionCwd)
    return { configCwd: context.configCwd, executionCwd };
  import_intake.outputCwdDenial(outputDeny, toolInput, toolName, {
    directory: "requested",
    problem: import_intake.cwdProblem(requestedCwd, context.configCwd, environment.paths),
    cwd: requestedCwd
  });
  return null;
};
function outputHookDeny(createDenyOutput, denial) {
  console.log(JSON.stringify(createDenyOutput(import_denial.formatDenial(denial))));
}
async function readHookInput(outputDeny) {
  let inputText;
  try {
    inputText = (await import_intake.readBoundedHookInput(process.stdin)).trim();
  } catch {
    outputDeny({ reason: "Failed to parse hook input JSON." });
    return;
  }
  if (!inputText) {
    outputDeny({ reason: "Missing hook input JSON." });
    return;
  }
  return import_intake.parseHookJson(inputText, outputDeny, "Failed to parse hook input JSON.");
}
async function runHookAdapter(adapter) {
  const environment = import_environment.createProcessEnvironment();
  const input = await readHookInput(adapter.outputDeny);
  if (input === undefined) {
    return;
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    import_intake.outputFailedClosed(adapter.outputDeny);
    return;
  }
  if (!adapter.isSupported(input)) {
    return;
  }
  const agent = adapter.getAgent?.(input, environment) ?? adapter.agent;
  const shape = adapter.agent === agent ? undefined : adapter.agent;
  const auditCwd = getHookAuditCwd(input);
  const outputPreflightDeny = (denial, toolName) => {
    writeIntegrationDenialAudit(environment, denial, () => adapter.getSessionId(input), {
      agent,
      shape,
      toolName,
      cwd: denial.cwd ?? auditCwd
    });
    adapter.outputDeny(denial);
  };
  const toolNameInput = adapter.getToolName(input);
  if (typeof toolNameInput !== "string" || toolNameInput.trim() === "") {
    import_intake.outputFailedClosed((denial) => outputPreflightDeny(denial), getRawHookToolInput(input));
    return;
  }
  const toolName = toolNameInput;
  const outputToolPreflightDeny = (denial) => outputPreflightDeny(denial, toolName);
  let toolInputResult;
  try {
    toolInputResult = adapter.getToolInput(input, toolName, outputToolPreflightDeny, environment);
  } catch (error) {
    if (!(error instanceof import_tool_input2.ToolInputLimitError))
      throw error;
    import_intake.outputFailedClosed(outputToolPreflightDeny, undefined, toolName);
    return;
  }
  if (!toolInputResult.ok)
    return;
  const context = adapter.getContext(input, toolInputResult.input, toolName, outputToolPreflightDeny, environment);
  if (!context)
    return;
  let command;
  try {
    command = import_tool_input2.getCommandFromToolInput(toolInputResult.input);
  } catch (error) {
    if (!(error instanceof import_tool_input2.ToolInputLimitError))
      throw error;
    import_intake.outputFailedClosed(outputToolPreflightDeny, undefined, toolName);
    return;
  }
  const invocation = import_invocation.createToolInvocation(toolName, toolInputResult.input, toolInputResult.route, context, command ?? null);
  try {
    const evaluation = evaluateRuntimeGuard(environment, invocation, {
      guard: {
        auditAllowed: import_env.shouldRecordAllowedCommands(environment.env),
        dependencies: adapter.guardDependencies
      },
      audit: { agent, shape, getSessionId: () => adapter.getSessionId(input) }
    });
    const denial = import_denial.projectGuardDenial(evaluation, {
      includeEvidence: true,
      toolName: evaluation.stage === "command-analysis" ? undefined : toolName
    });
    if (denial) {
      if (denial.unverifiedByStandardMode && adapter.outputAsk && adapter.canPromptPerson?.(input)) {
        adapter.outputAsk(denial);
        return;
      }
      adapter.outputDeny(denial);
      return;
    }
    adapter.outputAllow?.();
  } catch (error) {
    if (!(error instanceof import_pipeline2.GuardEvaluationError)) {
      throw error;
    }
    logHookGuardError(error, environment.env);
    const denial = import_denial.projectGuardDenial(error.evaluation, {
      includeEvidence: true,
      toolName: error.evaluation.stage === "command-analysis" ? undefined : toolName
    });
    if (denial)
      adapter.outputDeny(denial);
    return;
  }
}
function logHookGuardError(error, env) {
  if (!import_env.envTruthy(import_env.ENV_FLAGS.debug, env))
    return;
  console.error(`CC Safety Net debug: ${getHookGuardErrorLabel(error.stage)}: ${import_denial.formatIntegrationError(error.cause)}`);
}
function getHookGuardErrorLabel(stage) {
  if (stage === "policy-protection")
    return "hook policy protection failed";
  if (stage === "config-load")
    return "hook config loading failed";
  if (stage === "secret-protection")
    return "hook secret protection failed";
  return "hook analysis failed";
}
function getRawHookToolInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return;
  if (Object.hasOwn(input, "tool_input"))
    return input.tool_input;
  const toolCall = input.toolCall;
  if (toolCall && typeof toolCall === "object" && !Array.isArray(toolCall)) {
    return toolCall.args;
  }
  return;
}
function getHookAuditCwd(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    return null;
  const cwd = input.cwd;
  if (typeof cwd === "string")
    return cwd;
  const toolCall = input.toolCall;
  if (!toolCall || typeof toolCall !== "object" || Array.isArray(toolCall))
    return null;
  const args = toolCall.args;
  if (!args || typeof args !== "object" || Array.isArray(args))
    return null;
  const commandCwd = args.Cwd;
  return typeof commandCwd === "string" ? commandCwd : null;
}
async function runConfiguredHookAdapter(adapter) {
  const outputDeny = (denial) => outputHookDeny(adapter.createDenyOutput, denial);
  const createAskOutput = adapter.createAskOutput;
  const outputAsk = createAskOutput ? (denial) => console.log(JSON.stringify(createAskOutput(import_denial.formatAskPrompt(denial)))) : undefined;
  const createAllowOutput = adapter.createAllowOutput;
  const outputAllow = createAllowOutput ? () => console.log(JSON.stringify(createAllowOutput())) : undefined;
  try {
    await runHookAdapter({ ...adapter, outputDeny, outputAsk, outputAllow });
  } catch (error) {
    console.error("CC Safety Net error:", error);
    outputDeny(import_denial.createFailedClosedDenial());
  }
}

// src/hosts/antigravity-cli/hook.ts
function getAntigravityHooksPath(homeDir) {
  return import_node_path3.join(homeDir, ".gemini", "config", "hooks.json");
}
var ANTIGRAVITY_CLI_COMMAND_TOOLS = new Map([["run_command", "auto"]]);
var ANTIGRAVITY_PATH_KEYS = new Set([
  "absolutepath",
  "directorypath",
  "file_path",
  "filepath",
  "path",
  "searchdirectory",
  "searchpath",
  "target_file",
  "targetfile"
]);
function getAntigravityCliToolRoute(toolName) {
  return import_intake2.getToolRoute(toolName, ANTIGRAVITY_CLI_COMMAND_TOOLS);
}
async function runAntigravityCliHook() {
  await runConfiguredHookAdapter({
    agent: "antigravity-cli",
    createDenyOutput: (message) => ({
      decision: "deny",
      reason: message
    }),
    isSupported: () => true,
    getToolName: (input) => input.toolCall?.name,
    getToolInput: (input, toolName) => ({
      ok: true,
      input: normalizeAntigravityToolArgs(input.toolCall?.args, toolName),
      route: getAntigravityCliToolRoute(toolName)
    }),
    getContext: resolveAntigravityContext,
    getSessionId: (input) => input.conversationId
  });
}
function resolveAntigravityContext(input, toolInput, toolName, outputDeny, environment) {
  const workspacePaths = requestedWorkspacePaths(input);
  if (!workspacePaths[0]) {
    outputAntigravityCwdDeny(outputDeny, toolInput, toolName);
    return null;
  }
  const configRoots = workspacePaths.flatMap((root) => {
    const canonicalRoot = import_intake2.firstTrustedRoot([root], environment.paths);
    return canonicalRoot ? [canonicalRoot] : [];
  });
  if (!configRoots[0]) {
    outputAntigravityCwdDeny(outputDeny, toolInput, toolName, {
      directory: "session",
      problem: "unusable",
      cwd: workspacePaths[0]
    });
    return null;
  }
  if (toolName !== "run_command") {
    let targetRoot;
    try {
      targetRoot = resolveAntigravityTargetRoot(toolInput, toolName, configRoots, environment.paths);
    } catch (error) {
      if (error instanceof import_tool_input3.ToolInputLimitError) {
        outputAntigravityCwdDeny(outputDeny, undefined, toolName);
        return null;
      }
      if (!(error instanceof import_budget2.AnalysisLimit))
        throw error;
      outputAntigravityCwdDeny(outputDeny, toolInput, toolName);
      return null;
    }
    if (!targetRoot) {
      outputAntigravityCwdDeny(outputDeny, toolInput, toolName);
      return null;
    }
    return { configCwd: targetRoot, executionCwd: targetRoot };
  }
  const args = input.toolCall?.args;
  if (!args || !Object.hasOwn(args, "Cwd")) {
    return { configCwd: configRoots[0], executionCwd: configRoots[0] };
  }
  const cwd = args.Cwd;
  if (typeof cwd !== "string" || cwd.trim() === "") {
    outputAntigravityCwdDeny(outputDeny, toolInput, toolName);
    return null;
  }
  const containedCwd = import_intake2.resolveContainedCwd(cwd, configRoots, environment.paths);
  if (containedCwd) {
    const configCwd = mostSpecificContainingRoot(containedCwd, configRoots);
    if (!configCwd) {
      outputAntigravityCwdDeny(outputDeny, toolInput, toolName);
      return null;
    }
    return { configCwd, executionCwd: containedCwd };
  }
  outputAntigravityCwdDeny(outputDeny, toolInput, toolName, {
    directory: "requested",
    problem: import_intake2.cwdProblem(cwd, configRoots[0], environment.paths),
    cwd
  });
  return null;
}
function resolveAntigravityTargetRoot(toolInput, toolName, configRoots, paths) {
  const route = getAntigravityCliToolRoute(toolName);
  const targets = [
    ...import_tool_input3.extractPathLikeToolValues(toolInput, ANTIGRAVITY_PATH_KEYS),
    ...route.kind === "patch" ? import_tool_input3.extractPatchTargetsFromToolInput(toolInput) : []
  ].filter(import_node_path3.isAbsolute);
  const budget = import_budget2.createBudget();
  const targetRoots = new Set(targets.flatMap((target) => {
    const root = mostSpecificContainingRoot(import_canonicalization.resolveExistingPath(target, paths, budget), configRoots);
    return root ? [root] : [];
  }));
  if (targetRoots.size > 1)
    return null;
  return [...targetRoots][0] ?? configRoots[0] ?? null;
}
function mostSpecificContainingRoot(path, roots) {
  return roots.filter((root) => import_intake2.isSameOrInsidePath(path, root)).reduce((best, root) => root.length > best.length ? root : best, "") || null;
}
function outputAntigravityCwdDeny(outputDeny, toolInput, toolName, cause) {
  const command = toolInput && typeof toolInput === "object" ? toolInput.command : undefined;
  const evidence = { command: typeof command === "string" ? command : undefined, toolName };
  outputDeny(cause ? import_denial2.createCwdDenial(cause, evidence) : import_denial2.createFailedClosedDenial(evidence));
}
function requestedWorkspacePaths(input) {
  if (input.workspacePaths === undefined)
    return [process.cwd()];
  return Array.isArray(input.workspacePaths) ? input.workspacePaths.filter((path) => typeof path === "string" && path.trim() !== "") : [];
}
function normalizeAntigravityToolArgs(args, toolName) {
  if (!args)
    return;
  if (toolName !== "run_command")
    return args;
  return {
    ...args,
    command: typeof args.CommandLine === "string" && args.CommandLine !== "" ? args.CommandLine : undefined
  };
}

// src/hosts/catalog.ts
var DEEPSEEK_HARNESS_NPM_PROBE = [
  "npx",
  "--offline",
  "--no-install",
  "@deepseek-ai/dsh",
  "--version"
];
var CURSOR_AGENT_PROBE = ["cursor-agent", "--version"];
var catalog = [
  {
    id: "antigravity-cli",
    displayName: "Antigravity CLI",
    doctorOrder: 3,
    runtime: {
      order: 1,
      flags: ["-ac", "--agy-cli"],
      description: "Run as Antigravity CLI PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 2,
      flag: "--agy-cli",
      artifactKind: "hook config",
      probeCommand: ["agy", "--version"]
    }
  },
  {
    id: "claude-code",
    displayName: "Claude Code",
    doctorOrder: 1,
    runtime: {
      order: 2,
      displayName: "Coding CLI",
      flags: ["-cc", "--coding-cli"],
      legacyFlags: ["--claude-code"],
      description: "Run as Coding CLI PreToolUse hook",
      legacyTopLevelFlags: ["-cc", "--claude-code"]
    },
    install: {
      order: 3,
      flag: "--claude-code",
      artifactKind: "plugin",
      probeCommand: ["claude", "--version"]
    }
  },
  {
    id: "codex",
    displayName: "Codex",
    doctorOrder: 4,
    runtime: {
      order: 3,
      flags: ["-cx", "--codex"],
      description: "Run as a Codex PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 4,
      flag: "--codex",
      artifactKind: "plugin",
      probeCommand: ["codex", "--version"]
    }
  },
  {
    id: "copilot-cli",
    displayName: "GitHub Copilot CLI",
    doctorOrder: 10,
    runtime: {
      order: 8,
      flags: ["-cp", "--copilot-cli"],
      description: "Run as GitHub Copilot CLI PreToolUse hook",
      legacyTopLevelFlags: ["-cp", "--copilot-cli"]
    },
    install: {
      order: 10,
      flag: "--copilot-cli",
      artifactKind: "plugin",
      probeCommand: ["copilot", "--binary-version"]
    }
  },
  {
    id: "gemini-cli",
    displayName: "Gemini CLI",
    doctorOrder: 9,
    runtime: {
      order: 7,
      flags: ["-gc", "--gemini-cli"],
      description: "Run as Gemini CLI BeforeTool hook",
      legacyTopLevelFlags: ["-gc", "--gemini-cli"]
    },
    install: {
      order: 9,
      flag: "--gemini-cli",
      artifactKind: "extension",
      probeCommand: ["gemini", "--version"]
    }
  },
  {
    id: "grok-build",
    displayName: "Grok Build",
    doctorOrder: 11,
    runtime: {
      order: 9,
      flags: ["-gb", "--grok-build"],
      description: "Run as Grok Build PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 11,
      flag: "--grok-build",
      artifactKind: "hook config",
      probeCommand: ["grok", "--version"]
    }
  },
  {
    id: "hermes-agent",
    displayName: "Hermes Agent",
    doctorOrder: 12,
    runtime: {
      order: 10,
      flags: ["-ha", "--hermes-agent"],
      description: "Run as Hermes Agent pre_tool_call hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 12,
      flag: "--hermes-agent",
      artifactKind: "plugin",
      probeCommand: ["hermes", "--version"]
    }
  },
  {
    id: "kimi-code",
    displayName: "Kimi Code",
    doctorOrder: 13,
    runtime: {
      order: 11,
      flags: ["-kc", "--kimi-code"],
      description: "Run as Kimi Code PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 13,
      flag: "--kimi-code",
      artifactKind: "hook config",
      probeCommand: ["kimi", "--version"]
    }
  },
  {
    id: "openclaw",
    displayName: "OpenClaw",
    doctorOrder: 14,
    install: {
      order: 14,
      flag: "--openclaw",
      artifactKind: "plugin",
      probeCommand: ["openclaw", "--version"]
    }
  },
  {
    id: "opencode",
    displayName: "OpenCode",
    doctorOrder: 15,
    install: {
      order: 15,
      flag: "--opencode",
      artifactKind: "plugin",
      probeCommand: ["opencode", "--version"]
    }
  },
  {
    id: "pi",
    displayName: "Pi",
    doctorOrder: 16,
    install: {
      order: 16,
      flag: "--pi",
      artifactKind: "package",
      probeCommand: ["pi", "--version"]
    }
  },
  {
    id: "cursor",
    displayName: "Cursor",
    doctorOrder: 5,
    runtime: {
      order: 4,
      flags: ["-cu", "--cursor"],
      description: "Run as Cursor preToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 5,
      flag: "--cursor",
      artifactKind: "hook config",
      probeCommand: ["cursor", "--version"]
    }
  },
  {
    id: "deepseek-harness",
    displayName: "DeepSeek Harness",
    doctorOrder: 6,
    install: {
      order: 6,
      flag: "--deepseek-harness",
      artifactKind: "package",
      probeCommand: DEEPSEEK_HARNESS_NPM_PROBE
    }
  },
  {
    id: "devin",
    displayName: "Devin CLI",
    doctorOrder: 7,
    runtime: {
      order: 5,
      flags: ["-dv", "--devin"],
      description: "Run as Devin CLI PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 7,
      flag: "--devin",
      artifactKind: "hook config",
      probeCommand: ["devin", "--version"]
    }
  },
  {
    id: "droid",
    displayName: "Factory Droid",
    doctorOrder: 8,
    runtime: {
      order: 6,
      flags: ["-fd", "--droid"],
      description: "Run as Factory Droid PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 8,
      flag: "--droid",
      artifactKind: "hook config",
      probeCommand: ["droid", "--version"]
    }
  },
  {
    id: "amp",
    displayName: "Amp Code",
    doctorOrder: 2,
    install: {
      order: 1,
      flag: "--amp",
      artifactKind: "plugin",
      probeCommand: ["amp", "--version"]
    }
  }
];
var doctorIntegrationOrder = catalog.slice().sort((a, b) => a.doctorOrder - b.doctorOrder).map((integration) => integration.id);
var runtimeHookIntegrationMetadata = catalog.filter((integration) => ("runtime" in integration)).slice().sort((a, b) => a.runtime.order - b.runtime.order).map((integration) => ({
  id: integration.id,
  displayName: "displayName" in integration.runtime ? integration.runtime.displayName : integration.displayName,
  flags: integration.runtime.flags,
  legacyFlags: "legacyFlags" in integration.runtime ? integration.runtime.legacyFlags : [],
  description: integration.runtime.description,
  legacyTopLevelFlags: integration.runtime.legacyTopLevelFlags
}));
var installIntegrationMetadata = catalog.slice().sort((a, b) => a.install.order - b.install.order).map((integration) => ({ id: integration.id, ...integration.install })).map(({ order: _, ...integration }) => integration);
var integrationDisplayNames = Object.fromEntries(catalog.map((integration) => [integration.id, integration.displayName]));
function getIntegrationDisplayName(id) {
  return integrationDisplayNames[id];
}

// src/hosts/claude-code/hook.ts
var import_intake4 = require("./gate.js");

// src/hosts/hook/agent-detection.ts
var import_node_path4 = require("node:path");
var import_budget3 = require("./core.js");
var import_canonicalization2 = require("./core.js");
var import_intake3 = require("./gate.js");
function detectClaudeShapeAgent(transcriptPath, environment) {
  if (transcriptPath !== undefined && transcriptPath !== null && typeof transcriptPath !== "string") {
    return "unknown";
  }
  if (typeof transcriptPath === "string" && !import_node_path4.isAbsolute(transcriptPath)) {
    return "unknown";
  }
  try {
    const budget = import_budget3.createBudget();
    const transcript = typeof transcriptPath === "string" && transcriptPath ? import_canonicalization2.resolveExistingPath(transcriptPath, environment.paths, budget) : undefined;
    const home = environment.home;
    const roots = [
      ["codex", environment.env.get("CODEX_HOME") || import_node_path4.join(home, ".codex")],
      ["copilot-cli", environment.env.get("COPILOT_HOME") || import_node_path4.join(home, ".copilot")],
      ["claude-code", environment.env.get("CLAUDE_CONFIG_DIR") || import_node_path4.join(home, ".claude")]
    ];
    const matches = transcript ? roots.flatMap(([agent, root]) => {
      if (!import_node_path4.isAbsolute(root))
        return [];
      return import_intake3.isSameOrInsidePath(transcript, import_canonicalization2.resolveExistingPath(root, environment.paths, budget)) ? [agent] : [];
    }) : [];
    if (matches.length === 1)
      return matches[0] ?? "unknown";
    if (matches.length > 1)
      return "unknown";
  } catch {
    return "unknown";
  }
  if (environment.env.get("COPILOT_CLI") === "1")
    return "copilot-cli";
  if (environment.env.get("CLAUDECODE") === "1" || Boolean(environment.env.get("CLAUDE_CODE_ENTRYPOINT"))) {
    return "claude-code";
  }
  return "unknown";
}

// src/hosts/hook/constants.ts
var PRE_TOOL_USE_HOOK_EVENT = "PreToolUse";
var GEMINI_CLI_HOOK_EVENT = "BeforeTool";
var HERMES_AGENT_HOOK_EVENT = "pre_tool_call";

// src/hosts/hook/pre-tool-use.ts
async function runPreToolUseHook(options) {
  await runConfiguredHookAdapter({
    agent: options.agent,
    ...options.getAgent ? { getAgent: options.getAgent } : {},
    createDenyOutput: (message) => ({
      hookSpecificOutput: {
        hookEventName: PRE_TOOL_USE_HOOK_EVENT,
        permissionDecision: "deny",
        permissionDecisionReason: message
      }
    }),
    ...options.canPromptPerson ? {
      canPromptPerson: options.canPromptPerson,
      createAskOutput: (message) => ({
        hookSpecificOutput: {
          hookEventName: PRE_TOOL_USE_HOOK_EVENT,
          permissionDecision: "ask",
          permissionDecisionReason: message
        }
      })
    } : {},
    isSupported: (input) => input.hook_event_name === PRE_TOOL_USE_HOOK_EVENT,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName, _outputDeny, environment) => ({
      ok: true,
      input: input.tool_input,
      route: options.getToolRoute(toolName, input.tool_input, environment)
    }),
    getContext: options.getContext ?? getStandardHookContext,
    getSessionId: (input) => input.session_id
  });
}

// src/hosts/claude-code/hook.ts
var CLAUDE_CODE_COMMAND_TOOLS = new Map([
  ["Bash", "posix"],
  ["PowerShell", "powershell"],
  ["Monitor", "posix"]
]);
function getClaudeCodeToolRoute(toolName, toolInput, environment) {
  const isCopilotShell = toolName === "Bash" && environment.env.get("COPILOT_CLI") === "1";
  if (isCopilotShell)
    return { kind: "command", shell: "auto" };
  const isWebSocketMonitor = toolName === "Monitor" && toolInput?.command === undefined;
  return isWebSocketMonitor ? import_intake4.getToolRoute(toolName, new Map) : import_intake4.getToolRoute(toolName, CLAUDE_CODE_COMMAND_TOOLS);
}
async function runClaudeCodeHook() {
  await runPreToolUseHook({
    agent: "claude-code",
    getAgent: (input, environment) => detectClaudeShapeAgent(input.transcript_path, environment),
    canPromptPerson: (input) => ["default", "acceptEdits", "plan"].includes(input.permission_mode ?? ""),
    getToolRoute: getClaudeCodeToolRoute
  });
}

// src/hosts/codex/hook.ts
var import_intake5 = require("./gate.js");
var CODEX_COMMAND_TOOLS = new Map([["Bash", "auto"]]);
async function runCodexHook() {
  await runPreToolUseHook({
    agent: "codex",
    getToolRoute: (toolName) => import_intake5.getToolRoute(toolName, CODEX_COMMAND_TOOLS)
  });
}

// src/hosts/copilot-cli/hook.ts
var import_intake6 = require("./gate.js");
var COPILOT_CLI_COMMAND_TOOLS = new Map([
  ["bash", "auto"],
  ["Bash", "auto"],
  ["powershell", "powershell"],
  ["PowerShell", "powershell"]
]);
function getCopilotCliToolRoute(toolName) {
  return import_intake6.getToolRoute(toolName, COPILOT_CLI_COMMAND_TOOLS);
}
async function runCopilotCliHook() {
  await runConfiguredHookAdapter({
    agent: "copilot-cli",
    createDenyOutput: (message) => ({
      permissionDecision: "deny",
      permissionDecisionReason: message
    }),
    isSupported: () => true,
    getToolName: (input) => input.toolName,
    getToolInput: (input, toolName, outputDeny) => {
      const route = getCopilotCliToolRoute(toolName);
      if (typeof input.toolArgs === "object" && input.toolArgs !== null) {
        return { ok: true, input: input.toolArgs, route };
      }
      if (typeof input.toolArgs !== "string") {
        outputDeny({ reason: "Failed to parse toolArgs JSON." });
        return { ok: false };
      }
      const isRawPatch = route.kind === "patch" && input.toolArgs.trimStart().startsWith("*** Begin Patch");
      if (isRawPatch)
        return { ok: true, input: input.toolArgs, route };
      const toolInput = import_intake6.parseHookJson(input.toolArgs, outputDeny, "Failed to parse toolArgs JSON.");
      if (toolInput === undefined)
        return { ok: false };
      return { ok: true, input: toolInput, route };
    },
    getContext: getStandardHookContext,
    getSessionId: (input) => typeof input.sessionId === "string" && input.sessionId.trim() ? input.sessionId : undefined
  });
}

// src/hosts/cursor/hook.ts
var import_canonicalization3 = require("./core.js");
var import_intake7 = require("./gate.js");
var CURSOR_COMMAND_TOOLS = new Map([["Shell", "auto"]]);
function getCursorToolRoute(toolName) {
  return import_intake7.getToolRoute(toolName, CURSOR_COMMAND_TOOLS);
}
async function runCursorHook() {
  await runConfiguredHookAdapter({
    agent: "cursor",
    createDenyOutput: (message) => ({
      permission: "deny",
      user_message: message,
      agent_message: message
    }),
    createAllowOutput: () => ({ permission: "allow" }),
    isSupported: () => true,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName) => ({
      ok: true,
      input: input.tool_input,
      route: getCursorToolRoute(toolName)
    }),
    getContext: resolveCursorContext,
    getSessionId: (input) => input.conversation_id
  });
}
function resolveCursorContext(input, toolInput, toolName, outputDeny, environment) {
  const requestedRoots = requestedCursorRoots(input);
  if (!requestedRoots[0]) {
    import_intake7.outputFailedClosed(outputDeny, toolInput, toolName);
    return null;
  }
  const roots = requestedRoots.flatMap((root) => {
    const canonicalRoot = import_intake7.firstTrustedRoot([root], environment.paths);
    return canonicalRoot ? [canonicalRoot] : [];
  });
  if (!roots[0]) {
    import_intake7.outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: "session",
      problem: "unusable",
      cwd: requestedRoots[0]
    });
    return null;
  }
  const baseCwd = cursorBaseCwd(input.cwd);
  const base = import_intake7.resolveContainedCwd(baseCwd, roots, environment.paths);
  if (!base) {
    import_intake7.outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: "session",
      problem: import_intake7.cwdProblem(baseCwd, roots[0], environment.paths),
      cwd: baseCwd
    });
    return null;
  }
  if (toolInput === null || typeof toolInput !== "object" || Array.isArray(toolInput)) {
    return { configCwd: base, executionCwd: base };
  }
  if (!Object.hasOwn(toolInput, "working_directory")) {
    return { configCwd: base, executionCwd: base };
  }
  const requestedWorkingDirectory = toolInput.working_directory;
  if (typeof requestedWorkingDirectory !== "string" || requestedWorkingDirectory.trim() === "") {
    import_intake7.outputFailedClosed(outputDeny, toolInput, toolName);
    return null;
  }
  const workingDirectory = import_canonicalization3.normalizeUriDrivePath(requestedWorkingDirectory);
  const executionCwd = import_intake7.resolveContainedCwd(workingDirectory, roots, environment.paths);
  if (!executionCwd) {
    import_intake7.outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: "requested",
      problem: import_intake7.cwdProblem(workingDirectory, roots[0], environment.paths),
      cwd: workingDirectory
    });
    return null;
  }
  return { configCwd: base, executionCwd };
}
function requestedCursorRoots(input) {
  if (input.workspace_roots === undefined) {
    return typeof input.cwd === "string" && input.cwd.trim() !== "" ? [import_canonicalization3.normalizeUriDrivePath(input.cwd)] : [];
  }
  if (!Array.isArray(input.workspace_roots))
    return [];
  return input.workspace_roots.filter((root) => typeof root === "string" && root.trim() !== "").map((root) => import_canonicalization3.normalizeUriDrivePath(root));
}
function cursorBaseCwd(cwd) {
  return typeof cwd === "string" && cwd.trim() !== "" ? import_canonicalization3.normalizeUriDrivePath(cwd) : ".";
}

// src/hosts/devin/hook.ts
var import_intake8 = require("./gate.js");
var DEVIN_COMMAND_TOOLS = new Map([["exec", "auto"]]);
function textTypedIntoProcess(toolName, toolInput) {
  if (toolName !== "write_to_process" || typeof toolInput !== "object" || toolInput === null) {
    return;
  }
  const text = toolInput.text_input;
  return typeof text === "string" && text !== "" ? text : undefined;
}
async function runDevinHook() {
  await runConfiguredHookAdapter({
    agent: "devin",
    createDenyOutput: (message) => ({ decision: "block", reason: message }),
    isSupported: (input) => input.hook_event_name === PRE_TOOL_USE_HOOK_EVENT,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName) => {
      const typed = textTypedIntoProcess(toolName, input.tool_input);
      if (typed === undefined) {
        return {
          ok: true,
          input: input.tool_input,
          route: import_intake8.getToolRoute(toolName, DEVIN_COMMAND_TOOLS)
        };
      }
      return { ok: true, input: { command: typed }, route: { kind: "command", shell: "auto" } };
    },
    getContext: (_input, ...call) => getStandardHookContext({}, ...call),
    getSessionId: (input) => typeof input.session_id === "string" && input.session_id !== "" ? input.session_id : undefined
  });
}

// src/hosts/droid/hook.ts
var import_intake9 = require("./gate.js");
var DROID_COMMAND_TOOLS = new Map([["Execute", "auto"]]);
async function runDroidHook() {
  await runPreToolUseHook({
    agent: "droid",
    getToolRoute: (toolName) => import_intake9.getToolRoute(toolName, DROID_COMMAND_TOOLS)
  });
}

// src/hosts/gemini-cli/hook.ts
var import_intake10 = require("./gate.js");
var GEMINI_CLI_COMMAND_TOOLS = new Map([["run_shell_command", "auto"]]);
function getGeminiCliToolRoute(toolName) {
  return import_intake10.getToolRoute(toolName, GEMINI_CLI_COMMAND_TOOLS);
}
async function runGeminiCLIHook() {
  await runConfiguredHookAdapter({
    agent: "gemini-cli",
    createDenyOutput: (message) => ({
      decision: "deny",
      reason: message,
      systemMessage: message
    }),
    isSupported: (input) => input.hook_event_name === GEMINI_CLI_HOOK_EVENT,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName) => ({
      ok: true,
      input: input.tool_input,
      route: getGeminiCliToolRoute(toolName)
    }),
    getContext: getToolCwdHookContext("dir_path", GEMINI_CLI_COMMAND_TOOLS, {
      emptyMeansSessionCwd: true,
      allowOutsideSessionCwd: true
    }),
    getSessionId: (input) => input.session_id
  });
}

// src/hosts/grok-build/hook.ts
var import_intake11 = require("./gate.js");
var GROK_BUILD_COMMAND_TOOLS = new Map([
  ["run_terminal_command", "auto"],
  ["monitor", "auto"]
]);
function getGrokBuildToolRoute(toolName) {
  return import_intake11.getToolRoute(toolName, GROK_BUILD_COMMAND_TOOLS);
}
async function runGrokBuildHook() {
  await runConfiguredHookAdapter({
    agent: "grok-build",
    createDenyOutput: (message) => ({ decision: "deny", reason: message }),
    createAllowOutput: () => ({ decision: "allow" }),
    isSupported: () => true,
    getToolName: (input) => input.toolName,
    getToolInput: (input, toolName, outputDeny) => {
      if (input.toolInputTruncated === true) {
        import_intake11.outputFailedClosed(outputDeny, input.toolInput, toolName);
        return { ok: false };
      }
      return {
        ok: true,
        input: input.toolInput,
        route: getGrokBuildToolRoute(toolName)
      };
    },
    getContext: resolveGrokBuildContext,
    getSessionId: (input) => input.sessionId
  });
}
function resolveGrokBuildContext(input, toolInput, toolName, outputDeny, environment) {
  const requestedRoot = requestedGrokBuildRoot(input);
  if (!requestedRoot) {
    import_intake11.outputFailedClosed(outputDeny, toolInput, toolName);
    return null;
  }
  const root = import_intake11.firstTrustedRoot([requestedRoot], environment.paths);
  if (!root) {
    import_intake11.outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: "session",
      problem: "unusable",
      cwd: requestedRoot
    });
    return null;
  }
  const baseCwd = grokBuildBaseCwd(input.cwd);
  const base = import_intake11.resolveContainedCwd(baseCwd, [root], environment.paths);
  if (!base) {
    import_intake11.outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: "session",
      problem: import_intake11.cwdProblem(baseCwd, root, environment.paths),
      cwd: baseCwd
    });
    return null;
  }
  return { configCwd: base, executionCwd: base };
}
function requestedGrokBuildRoot(input) {
  const root = input.workspaceRoot === undefined ? input.cwd : input.workspaceRoot;
  return typeof root === "string" && root.trim() !== "" ? root : undefined;
}
function grokBuildBaseCwd(cwd) {
  return typeof cwd === "string" && cwd.trim() !== "" ? cwd : ".";
}

// src/hosts/hermes-agent/hook.ts
var import_node_path5 = require("node:path");
var import_intake12 = require("./gate.js");
var HERMES_AGENT_COMMAND_TOOLS = new Map([["terminal", "posix"]]);
async function runHermesAgentHook() {
  await runConfiguredHookAdapter({
    agent: "hermes-agent",
    createDenyOutput: (message) => ({ action: "block", message }),
    isSupported: (input) => input.hook_event_name === HERMES_AGENT_HOOK_EVENT,
    getToolName: (input) => input.tool_name,
    getToolInput: (input, toolName) => ({
      ok: true,
      input: input.tool_input,
      route: import_intake12.getToolRoute(toolName, HERMES_AGENT_COMMAND_TOOLS)
    }),
    getContext: resolveHermesAgentContext,
    getSessionId: (input) => input.session_id
  });
}
function resolveHermesAgentContext(input, toolInput, toolName, outputDeny, environment) {
  const context = getStandardHookContext(input, toolInput, toolName, outputDeny, environment);
  if (!context)
    return null;
  if (!toolInput || typeof toolInput !== "object" || Array.isArray(toolInput))
    return context;
  if (!Object.hasOwn(toolInput, "workdir"))
    return context;
  const workdir = toolInput.workdir;
  if (typeof workdir !== "string" || workdir.trim() === "") {
    import_intake12.outputFailedClosed(outputDeny, toolInput, toolName);
    return null;
  }
  const executionCwd = import_intake12.firstTrustedRoot([import_node_path5.resolve(context.configCwd, workdir)], environment.paths);
  if (!executionCwd) {
    import_intake12.outputCwdDenial(outputDeny, toolInput, toolName, {
      directory: "requested",
      problem: "unusable",
      cwd: workdir
    });
    return null;
  }
  return { ...context, executionCwd };
}

// src/hosts/kimi-code/hook.ts
var import_intake13 = require("./gate.js");
var KIMI_CODE_COMMAND_TOOLS = new Map([["Bash", "posix"]]);
function getKimiCodeToolRoute(toolName) {
  return import_intake13.getToolRoute(toolName, KIMI_CODE_COMMAND_TOOLS);
}
async function runKimiCodeHook() {
  await runPreToolUseHook({
    agent: "kimi-code",
    getToolRoute: getKimiCodeToolRoute,
    getContext: getToolCwdHookContext("cwd", KIMI_CODE_COMMAND_TOOLS)
  });
}

// src/entries/hook-integrations.ts
var hookRunners = {
  "antigravity-cli": runAntigravityCliHook,
  "claude-code": runClaudeCodeHook,
  codex: runCodexHook,
  "copilot-cli": runCopilotCliHook,
  cursor: runCursorHook,
  devin: runDevinHook,
  droid: runDroidHook,
  "gemini-cli": runGeminiCLIHook,
  "grok-build": runGrokBuildHook,
  "hermes-agent": runHermesAgentHook,
  "kimi-code": runKimiCodeHook
};
var hookIntegrations = runtimeHookIntegrationMetadata.map((integration) => ({
  ...integration,
  run: hookRunners[integration.id]
}));
function findHookIntegrationByFlag(args) {
  const parsed = parseCommandArgs({
    label: "hook",
    booleans: Object.fromEntries(hookIntegrations.map((integration) => [
      integration.id,
      [...integration.flags, ...integration.legacyFlags]
    ]))
  }, args);
  if (parsed.errors.length > 0)
    return;
  const named = hookIntegrations.filter((integration) => parsed.flags[integration.id]);
  return named.length === 1 ? named[0] : undefined;
}
function findLegacyTopLevelHookIntegration(flag) {
  return hookIntegrations.find((integration) => integration.legacyTopLevelFlags.some((integrationFlag) => integrationFlag === flag));
}

// src/entries/bin.ts
async function main() {
  const args = process.argv.slice(2);
  const commandName = args[0];
  const globalScan = parseCommandArgs({ label: "cc-safety-net", booleans: { version: ["-V", "--version"] }, positionals: "list" }, args);
  if (!globalScan.help && !globalScan.flags.version) {
    if (commandName?.toLowerCase() === "hook") {
      const integration = findHookIntegrationByFlag(args.slice(1));
      if (integration) {
        await integration.run();
        return;
      }
    }
    const legacyIntegration = findLegacyTopLevelHookIntegration(commandName);
    if (legacyIntegration) {
      await legacyIntegration.run();
      return;
    }
  }
  const cli = await import("../cli.js");
  await cli.runCli(args);
}
main().catch((error) => {
  console.error("CC Safety Net error:", error);
  process.exit(1);
});
