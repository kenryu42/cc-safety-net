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

// src/bin/gate.ts
var exports_gate = {};
__export(exports_gate, {
  ADOPT_AS_OPERAND: () => ADOPT_AS_OPERAND,
  GuardEvaluationError: () => GuardEvaluationError,
  HOOK_INPUT_MAX_BYTES: () => HOOK_INPUT_MAX_BYTES,
  REASON_GIT_METADATA_PROTECTION: () => REASON_GIT_METADATA_PROTECTION,
  REASON_POLICY_APPLY_PROTECTION: () => REASON_POLICY_APPLY_PROTECTION,
  REASON_POLICY_CONFIG_PROTECTION: () => REASON_POLICY_CONFIG_PROTECTION,
  REASON_SECRET_PROTECTION: () => REASON_SECRET_PROTECTION,
  SHELL_STDIN_INTERPRETERS: () => SHELL_STDIN_INTERPRETERS,
  StructuralShellSyntaxLimitError: () => StructuralShellSyntaxLimitError,
  createSemanticFactStore: () => createSemanticFactStore,
  createSemanticFacts: () => createSemanticFacts,
  createToolInvocation: () => createToolInvocation,
  cwdProblem: () => cwdProblem,
  evaluateGuard: () => evaluateGuard,
  expandTrackedShellVariables: () => expandTrackedShellVariables,
  extractMvOperandPaths: () => extractMvOperandPaths,
  findGitMetadataMutationTargetInSemanticFacts: () => findGitMetadataMutationTargetInSemanticFacts,
  findPolicyApplyInvocationInSemanticFacts: () => findPolicyApplyInvocationInSemanticFacts,
  findPolicyConfigMutationTargetInSemanticFacts: () => findPolicyConfigMutationTargetInSemanticFacts,
  findProtectedPathMutationInCommand: () => findProtectedPathMutationInCommand,
  findSensitiveTargetInSemanticFacts: () => findSensitiveTargetInSemanticFacts,
  firstTrustedRoot: () => firstTrustedRoot,
  getCommandSyntaxFact: () => getCommandSyntaxFact,
  getToolRoute: () => getToolRoute,
  isAssignmentOnlySegment: () => isAssignmentOnlySegment,
  isCodeInterpreter: () => isCodeInterpreter,
  isProtectedGitDeleteTarget: () => isProtectedGitDeleteTarget,
  isProtectedGitHookNameSelection: () => isProtectedGitHookNameSelection,
  isSameOrInsidePath: () => isSameOrInsidePath,
  isUsableDirectory: () => isUsableDirectory,
  mayHaveGitMetadataEntryNamed: () => mayHaveGitMetadataEntryNamed,
  outputCwdDenial: () => outputCwdDenial,
  outputFailedClosed: () => outputFailedClosed,
  parseHookJson: () => parseHookJson,
  projectSensitiveShellText: () => projectSensitiveShellText,
  readBoundedHookInput: () => readBoundedHookInput,
  readGuardSyntax: () => readGuardSyntax,
  readGuardTokens: () => readGuardTokens,
  resolveCanonicalCwd: () => resolveCanonicalCwd,
  resolveContainedCwd: () => resolveContainedCwd,
  resolveStandardHookContext: () => resolveStandardHookContext,
  safetyNetSubcommandIndex: () => safetyNetSubcommandIndex,
  walkGuardSyntax: () => walkGuardSyntax
});
module.exports = __toCommonJS(exports_gate);

// src/gate/pipeline.ts
var import_budget2 = require("./core.js");
var import_env = require("./core.js");
var import_snapshot = require("./core.js");
var import_tool_input4 = require("./core.js");
var import_analyzer = require("./analyzer.js");
var import_dangerous_text = require("./analyzer.js");
var import_reasons = require("./analyzer.js");
var import_reasons2 = require("./analyzer.js");

// src/gate/guards/git-metadata-protection.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var import_canonicalization3 = require("./core.js");
var import_tokens2 = require("./core-shell.js");
var import_tool_input2 = require("./core.js");
var import_wrapper_prelude2 = require("./analyzer.js");

// src/gate/guards/guard-walk.ts
var import_canonicalization = require("./core.js");
var import_model = require("./core-shell.js");
var import_parse = require("./core-shell.js");
var import_posix = require("./core-shell.js");
var import_tokens = require("./core-shell.js");
var import_wrapper_prelude = require("./analyzer.js");
var ADOPT_AS_OPERAND = Symbol("adopt-as-operand");
var HEREDOC_CONSUMER_WRAPPERS = new Set(["env", "sudo", "command", "builtin"]);
var LEGACY_BOUNDARIES = new Set(["&&", "||", "|&", "|", "&", ";"]);
var LEGACY_SEGMENT_REDIRECTS = new Set(["<<", "<<<", ">|"]);
var PIPE_OPERATORS = new Set(["|", "|&"]);
var SPECIAL_VARIABLE_NAME = /[*@#?$!_-]/;
var POWERSHELL_VARIABLE_NAME = /^\w+(?::\w+)*/;
var EMPTY_EVENTS = Object.freeze([]);
var SCOPE_ENTER = Object.freeze({ kind: "scope", edge: "enter" });
var SCOPE_EXIT = Object.freeze({ kind: "scope", edge: "exit" });
var EMPTY_STRINGS = Object.freeze([]);
var CODE_INTERPRETERS = new Set([
  "python",
  "python2",
  "python3",
  "node",
  "deno",
  "bun",
  "ruby",
  "perl",
  "php",
  "rscript",
  "osascript",
  "bash",
  "sh",
  "zsh",
  "dash",
  "ksh"
]);
var SHELL_STDIN_INTERPRETERS = new Set(["bash", "sh", "zsh", "dash", "ksh"]);
var MAX_FUNCTION_EXPANSIONS = 256;
var READ_EVENTS = new WeakMap;
function readGuardSyntax(source, program) {
  const suppressed = program.status === "complete" ? new Set(collectDataSinkHeredocSpans(program)) : new Set;
  const masked = maskSpans(source, suppressed);
  if (import_tokens.hasUnclosedQuotes(masked))
    return freezeSyntax("unclosed-quote", masked, program);
  const flags = {
    invalid: false,
    limited: false,
    expansions: 0,
    assignmentFallbacks: []
  };
  const events = readProgram(program, {
    source: masked,
    suppressed,
    flags,
    depth: 0,
    functions: new Map,
    powershell: program.dialect === "powershell"
  });
  if (flags.limited)
    return freezeSyntax("structural-limit", masked, program);
  if (flags.invalid)
    return freezeSyntax("invalid", masked, program);
  const syntax = freezeSyntax("complete", masked, program, flags.assignmentFallbacks);
  READ_EVENTS.set(syntax, Object.freeze(events));
  return syntax;
}
function walkGuardSyntax(syntax, cwd, environment, budget, visitor) {
  const mapWord = visitor.word ?? ((text) => text);
  let state = { cwd, variables: new Map, previous: null };
  let segment = [];
  let shellWords = new Set;
  let pipeProducer = null;
  const frames = [];
  const events = guardEvents(syntax);
  const lastPipe = events.findLastIndex((event) => event.kind === "operator" && PIPE_OPERATORS.has(event.operator));
  const shellHeredocBehindPipe = lastPipe !== -1 && events.some((event) => event.kind === "redirection" && event.operator === "<<" && event.body === undefined);
  for (const [index, event] of events.entries()) {
    const pipeAhead = shellHeredocBehindPipe || index <= lastPipe;
    if (event.kind === "scope") {
      if (event.edge === "enter") {
        frames.push({
          state,
          segment: [...segment],
          shellWords: new Set(shellWords),
          pipeProducer
        });
        continue;
      }
      const target = visitor.segment(segment, state, pipeProducer, null, shellWords, pipeAhead);
      if (target)
        return target;
      const frame = frames.pop();
      if (frame === undefined)
        throw new Error("scope exit without a matching enter");
      state = frame.state;
      segment = frame.segment;
      shellWords = frame.shellWords;
      pipeProducer = frame.pipeProducer;
      continue;
    }
    if (event.kind === "operator") {
      if (!event.boundary)
        continue;
      const target = visitor.segment(segment, state, pipeProducer, event.operator, shellWords, pipeAhead);
      if (target)
        return target;
      state = applyShellState(segment, state, environment, budget);
      pipeProducer = segment.length > 0 && PIPE_OPERATORS.has(event.operator) ? segment : null;
      segment = [];
      shellWords = new Set;
      continue;
    }
    if (event.kind === "redirection") {
      if (event.fd !== undefined)
        shellWords.add(segment.length - 1);
      if (event.target === undefined)
        continue;
      const outcome = visitor.redirection({
        operator: event.operator,
        role: event.role,
        targetOrder: event.targetOrder,
        target: event.target,
        ...event.body === undefined ? {} : { body: event.body, consumer: event.consumer }
      }, state, pipeAhead);
      if (outcome === ADOPT_AS_OPERAND) {
        shellWords.add(segment.length);
        segment.push(mapWord(event.target));
        continue;
      }
      if (outcome)
        return outcome;
      continue;
    }
    segment.push(mapWord(event.text));
  }
  return visitor.segment(segment, state, pipeProducer, null, shellWords, shellHeredocBehindPipe);
}
function readGuardTokens(syntax) {
  return guardEvents(syntax).flatMap((event) => {
    if (event.kind === "word")
      return [{ kind: "word", text: event.text }];
    if (event.kind === "operator")
      return [{ kind: "operator", boundary: event.boundary }];
    if (event.kind === "redirection")
      return [{ kind: "redirection", target: event.target }];
    return [];
  });
}
function expandTrackedShellVariables(text, variables) {
  return text.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)(:?[-+])([^}]*)\}/g, (match, name, operator, word) => {
    const value = variables.get(name);
    if (value === undefined)
      return match;
    const usable = operator.startsWith(":") ? value !== "" : true;
    if (operator.endsWith("-")) {
      return usable ? value : expandTrackedShellVariables(word, variables);
    }
    return usable ? expandTrackedShellVariables(word, variables) : "";
  }).replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (match, name) => variables.get(name) ?? match).replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (match, name) => variables.get(name) ?? match);
}
function isAssignmentOnlySegment(tokens) {
  return tokens.length > 0 && tokens.every((token) => /^[A-Za-z_][A-Za-z0-9_]*=.*/.test(token));
}
function applyShellState(segment, state, environment, budget) {
  const variables = isAssignmentOnlySegment(segment) ? new Map([...state.variables, ...extractShellAssignments(segment, state.variables)]) : state.variables;
  const stripped = import_wrapper_prelude.stripWrappers([...segment], environment);
  const target = import_tokens.getBasename(stripped[0] ?? "").toLowerCase() === "cd" ? stripped[1] : undefined;
  if (!target)
    return { ...state, variables };
  if (target === "-") {
    if (state.previous === null)
      return { ...state, variables };
    return { cwd: state.previous, variables, previous: state.cwd };
  }
  return {
    cwd: import_canonicalization.normalizeProtectedPathCandidate(expandTrackedShellVariables(target, variables), state.cwd, environment, budget),
    variables,
    previous: state.cwd
  };
}
function extractShellAssignments(segment, variables) {
  return segment.flatMap((token) => {
    const assignment = /^([A-Za-z_][A-Za-z0-9_]*)(.*)$/.exec(token);
    const value = assignment?.[2]?.startsWith("=") ? assignment[2].slice(1) : undefined;
    return assignment?.[1] !== undefined && value !== undefined ? [[assignment[1], expandTrackedShellVariables(value, variables)]] : [];
  });
}
function guardEvents(syntax) {
  return READ_EVENTS.get(syntax) ?? EMPTY_EVENTS;
}
function maskSpans(source, spans) {
  return [...spans].reduce((text, span) => text.slice(0, span.start) + " ".repeat(span.end - span.start) + text.slice(span.end), source);
}
function freezeSyntax(status, source, program, assignmentFallbacks = EMPTY_STRINGS) {
  return Object.freeze({
    status,
    source,
    program,
    assignmentFallbacks: Object.freeze(assignmentFallbacks)
  });
}
function readProgram(program, context) {
  return program.nodes.flatMap((node, index) => readNode(node, program, index, context)).sort((left, right) => left.start - right.start).flatMap((item) => [...item.events]);
}
function readNode(node, program, index, context) {
  if (node.kind === "connector") {
    return [{ start: node.span.start, events: [operatorEvent(normalizeConnector(node.operator))] }];
  }
  if (node.kind === "unknown") {
    return [{ start: node.span.start, events: [operatorEvent(node.source)] }];
  }
  if (node.kind === "function") {
    context.functions.set(node.name, node.body);
    return [];
  }
  if (node.kind === "group") {
    const brace = node.style !== "subshell";
    const closed = context.source[node.span.end - 1] === (brace ? "}" : ")");
    const groupContext = brace ? context : { ...context, functions: new Map(context.functions) };
    return [
      {
        start: node.span.start,
        events: brace ? [
          boundaryOperatorEvent("{"),
          ...readProgram(node.body, groupContext),
          ...closed ? [boundaryOperatorEvent("}")] : []
        ] : [
          SCOPE_ENTER,
          operatorEvent("("),
          ...readProgram(node.body, groupContext),
          ...closed ? [operatorEvent(")")] : [],
          SCOPE_EXIT
        ]
      }
    ];
  }
  const functionBody = getCalledFunctionBody(node, context.functions);
  if (functionBody) {
    if (context.depth >= import_parse.DEFAULT_COMMAND_PARSER_LIMITS.maxDepth || ++context.flags.expansions > MAX_FUNCTION_EXPANSIONS) {
      context.flags.limited = true;
      return [];
    }
    return [
      {
        start: node.span.start,
        events: [
          ...readView(node, context),
          boundaryOperatorEvent(";"),
          ...readProgram(functionBody, { ...context, depth: context.depth + 1 }),
          boundaryOperatorEvent(";")
        ]
      },
      ...readHeredocs(node, program, index, context)
    ];
  }
  return [
    { start: node.span.start, events: readView(node, context) },
    ...readHeredocs(node, program, index, context)
  ];
}
function readView(view, context) {
  return [
    ...view.words.map((word) => ({
      start: word.span.start,
      events: readWord(word, view, context, false)
    })),
    ...view.redirections.map((redirection) => ({
      start: redirection.span.start,
      events: readRedirection(redirection, view, context)
    }))
  ].sort((left, right) => left.start - right.start).flatMap((item) => item.events);
}
function readRedirection(redirection, view, context) {
  const operator = redirection.operator === "<<-" ? "<<" : redirection.operator;
  const targetEvents = redirection.target ? readWord(redirection.target, view, context, true) : [];
  const first = targetEvents[0];
  const target = first?.kind === "word" ? first.text : undefined;
  return [
    ...redirection.fd === undefined ? [] : [wordEvent(String(redirection.fd))],
    Object.freeze({
      kind: "redirection",
      operator,
      ...redirection.fd === undefined ? {} : { fd: redirection.fd },
      role: getRedirectionRole(operator),
      targetOrder: LEGACY_SEGMENT_REDIRECTS.has(operator) ? "legacy-segment" : "immediate",
      ...target === undefined ? {} : { target },
      ...redirection.heredoc && context.suppressed.has(redirection.heredoc.bodySpan) ? { body: redirection.heredoc.body, consumer: heredocConsumerWords(view) } : {}
    }),
    ...target === undefined ? targetEvents : targetEvents.slice(1)
  ];
}
function readHeredocs(view, program, index, context) {
  const heredocs = view.redirections.filter((redirection) => redirection.operator === "<<" || redirection.operator === "<<-");
  return [
    ...heredocs.flatMap((redirection) => {
      const heredoc = redirection.heredoc;
      if (!heredoc)
        return [];
      const terminator = [
        wordEvent(heredoc.delimiter),
        .../[\r\n]/.test(context.source[heredoc.terminatorSpan.end] ?? "") ? [operatorEvent(";")] : []
      ];
      if (context.suppressed.has(heredoc.bodySpan)) {
        return [{ start: heredoc.bodySpan.start, events: terminator }];
      }
      return [
        {
          start: heredoc.bodySpan.start,
          events: [
            ...readText(context.source.slice(heredoc.bodySpan.start, heredoc.bodySpan.end), context),
            ...terminator
          ]
        }
      ];
    }),
    ...heredocs.some((redirection) => !redirection.heredoc && redirection.target) ? readUnterminatedHeredoc(program, index, context) : []
  ];
}
function readUnterminatedHeredoc(program, index, context) {
  const connector = program.nodes.slice(index + 1).find((node) => node.kind === "connector");
  if (!connector || connector.span.end >= program.span.end)
    return [];
  return [
    {
      start: connector.span.end,
      events: readText(context.source.slice(connector.span.end, program.span.end), context)
    }
  ];
}
function readText(text, context) {
  if (context.depth >= import_parse.DEFAULT_COMMAND_PARSER_LIMITS.maxDepth) {
    context.flags.limited = true;
    return [];
  }
  const program = import_parse.parseCommand(text, "posix");
  if (program.status === "limited") {
    context.flags.limited = true;
    return [];
  }
  const flags = {
    invalid: false,
    limited: false,
    expansions: context.flags.expansions,
    assignmentFallbacks: context.flags.assignmentFallbacks
  };
  const events = readProgram(program, {
    source: text,
    suppressed: new Set,
    flags,
    depth: context.depth + 1,
    functions: new Map,
    powershell: false
  });
  context.flags.limited ||= flags.limited;
  context.flags.expansions = flags.expansions;
  return events;
}
function readWord(word, view, context, keepGlobText) {
  const events = [];
  const state = { single: false, double: false };
  let pending = "";
  let glob = false;
  const flush = () => {
    const event = glob && !keepGlobText ? operatorEvent("glob") : pending !== "" || word.quoted && events.length === 0 ? wordEvent(pending) : undefined;
    if (event)
      events.push(event);
    pending = "";
    glob = false;
  };
  for (const part of word.parts) {
    if (part.provenance !== "command-substitution" && part.provenance !== "arithmetic") {
      for (const run of scanWordText(part.raw, state, context.flags, context.powershell)) {
        if (typeof run === "string") {
          flush();
          events.push(operatorEvent(run));
          continue;
        }
        pending += run.text;
        glob ||= run.glob;
      }
      continue;
    }
    const nested = view.nested.find((program) => program.span.start >= part.span.start && program.span.end <= part.span.end);
    if (state.double) {
      const quotedText = context.source.slice(part.span.start, part.span.end);
      pending += scanWordText(quotedText, { single: false, double: true }, context.flags, context.powershell).map((run) => typeof run === "string" ? run : run.text).join("");
      const maskedHeredocHandovers = nested ? readProgram(nested, context).filter((event) => event.kind === "redirection" && event.body !== undefined) : [];
      if (maskedHeredocHandovers.length > 0) {
        events.push(SCOPE_ENTER, ...maskedHeredocHandovers, SCOPE_EXIT);
      }
      continue;
    }
    const inner = nested ? readProgram(nested, context) : [];
    if (part.raw.startsWith("`")) {
      pending += "${}";
      flush();
      events.push(SCOPE_ENTER, ...inner, SCOPE_EXIT);
      continue;
    }
    if (part.raw.startsWith("<(") || part.raw.startsWith(">(")) {
      flush();
      events.push(part.raw.startsWith("<(") ? operatorEvent("<(") : Object.freeze({
        kind: "redirection",
        operator: ">",
        role: "file-write",
        targetOrder: "immediate"
      }), SCOPE_ENTER, ...inner, ...part.raw.endsWith(")") ? [operatorEvent(")")] : [], SCOPE_EXIT);
      continue;
    }
    const frames = part.raw.startsWith("$((") ? 2 : 1;
    pending += "${}";
    flush();
    events.push(...Array.from({ length: frames }, () => operatorEvent("(")), ...frames === 1 ? [SCOPE_ENTER] : [], ...inner, ...part.raw.endsWith(")".repeat(frames)) ? Array.from({ length: frames }, () => operatorEvent(")")) : [], ...frames === 1 ? [SCOPE_EXIT] : []);
  }
  flush();
  return events;
}
function scanWordText(raw, state, flags, powershell) {
  const runs = [];
  let text = "";
  let glob = false;
  let index = 0;
  while (index < raw.length) {
    const char = raw[index] ?? "";
    if (!state.single && !state.double && (char === "(" || char === ")")) {
      runs.push({ text, glob }, char);
      text = "";
      glob = false;
      index++;
      continue;
    }
    if (powershell && char === "`" && !state.single) {
      text += raw[index + 1] ?? "";
      index += 2;
      continue;
    }
    if (state.single && char === "'") {
      state.single = false;
      index++;
      continue;
    }
    if (state.single) {
      text += char;
      index++;
      continue;
    }
    if (state.double) {
      if (char === '"') {
        state.double = false;
        index++;
        continue;
      }
      if (!powershell && char === "\\") {
        const escaped = raw[index + 1] ?? "";
        text += ['"', "\\", "$"].includes(escaped) ? escaped : `\\${escaped}`;
        index += 2;
        continue;
      }
      if (char === "$") {
        const expansion = readExpansion(raw, index, state, flags, powershell);
        text += expansion.text;
        index = expansion.next;
        continue;
      }
      text += char;
      index++;
      continue;
    }
    if (char === "'" || char === '"') {
      state.single = char === "'";
      state.double = char === '"';
      index++;
      continue;
    }
    if (!powershell && char === "\\") {
      const escaped = raw[index + 1] ?? "";
      glob ||= escaped === "*" || escaped === "?";
      text += escaped;
      index += 2;
      continue;
    }
    if (char === "$") {
      const expansion = readExpansion(raw, index, state, flags, powershell);
      text += expansion.text;
      index = expansion.next;
      continue;
    }
    glob ||= char === "*" || char === "?";
    text += char;
    index++;
  }
  return [...runs, { text, glob }];
}
function readExpansion(raw, start, state, flags, powershell) {
  const char = raw[start + 1];
  if (char === "{") {
    const close = powershell ? findExpansionClose(raw, start + 2) : import_posix.scanParameterExpansion(raw, start + 2, raw.length).close;
    if (close === -1) {
      flags.invalid = true;
      return { text: "", next: raw.length };
    }
    const expansion = raw.slice(start, close + 1);
    collectAssignmentFallback(expansion, state, flags, powershell);
    return { text: expansion, next: close + 1 };
  }
  if (char !== undefined && SPECIAL_VARIABLE_NAME.test(char)) {
    return { text: `\${${char}}`, next: start + 2 };
  }
  const name = (powershell ? POWERSHELL_VARIABLE_NAME : /^\w*/).exec(raw.slice(start + 1))?.[0] ?? "";
  return { text: `\${${name}}`, next: start + 1 + name.length };
}
function collectAssignmentFallback(expansion, state, flags, powershell) {
  const content = expansion.slice(2, -1);
  const name = /^[A-Za-z_][A-Za-z0-9_]*/.exec(content)?.[0];
  if (!name)
    return;
  const suffix = content.slice(name.length);
  const operator = [":=", "="].find((candidate) => suffix.startsWith(candidate));
  if (!operator)
    return;
  const runs = scanWordText(suffix.slice(operator.length), { ...state }, flags, powershell);
  flags.assignmentFallbacks.push(...runs.flatMap((run) => typeof run === "string" || !run.text ? [] : [run.text]));
}
function findExpansionClose(raw, start) {
  let depth = 1;
  let index = start;
  while (depth > 0 && index < raw.length) {
    if (raw[index] === "{" && raw[index - 1] === "$")
      depth++;
    if (raw[index] === "}")
      depth--;
    index++;
  }
  return depth === 0 ? index - 1 : -1;
}
function normalizeConnector(operator) {
  return /^[\r\n]+$/.test(operator) ? ";" : operator;
}
function operatorEvent(operator) {
  return Object.freeze({
    kind: "operator",
    operator,
    boundary: LEGACY_BOUNDARIES.has(operator)
  });
}
function boundaryOperatorEvent(operator) {
  return Object.freeze({ kind: "operator", operator, boundary: true });
}
function wordEvent(text) {
  return Object.freeze({ kind: "word", text });
}
function getRedirectionRole(operator) {
  if (operator === "<<" || operator === "<<<")
    return "here-data";
  if (operator === "<" || operator === "<&")
    return "file-read";
  return "file-write";
}
function isCodeInterpreter(command) {
  return CODE_INTERPRETERS.has(command) || /^python\d/.test(command);
}
var WRAPPER_VALUE_OPTIONS = new Map([
  [
    "sudo",
    new Set([
      "-u",
      "-g",
      "-h",
      "-p",
      "-C",
      "-D",
      "-r",
      "-t",
      "-T",
      "-U",
      "--user",
      "--group",
      "--host",
      "--prompt",
      "--chdir",
      "--role",
      "--type",
      "--other-user"
    ])
  ],
  ["env", new Set(["-u", "-C", "-P", "-S", "--unset", "--chdir", "--split-string"])]
]);
function skipWrapperOptions(wrapper, words) {
  const word = words[0];
  if (word === undefined || !word.startsWith("-"))
    return words;
  const takesValue = WRAPPER_VALUE_OPTIONS.get(wrapper)?.has(word) ?? false;
  return skipWrapperOptions(wrapper, words.slice(takesValue ? 2 : 1));
}
function stripConsumerWrappers(words) {
  const word = words[0];
  if (word === undefined)
    return [];
  if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(word))
    return stripConsumerWrappers(words.slice(1));
  if (word === "uv" && words[1] === "run")
    return stripConsumerWrappers(words.slice(2));
  if (!HEREDOC_CONSUMER_WRAPPERS.has(word))
    return [...words];
  return stripConsumerWrappers(skipWrapperOptions(word, words.slice(1)));
}
function heredocConsumerWords(view) {
  const name = import_model.getCalledCommandName(view);
  const called = view.words.findIndex((word) => word.provenance === "literal" && word.text === name);
  return stripConsumerWrappers(called < 0 ? [] : view.words.slice(called).map((word) => word.text));
}
function isCodeInterpreterHeredocConsumer(view) {
  const name = heredocConsumerWords(view)[0];
  if (name === undefined)
    return false;
  const command = import_tokens.getBasename(name).toLowerCase();
  return isCodeInterpreter(command) && !SHELL_STDIN_INTERPRETERS.has(command);
}
function collectDataSinkHeredocSpans(program) {
  return program.nodes.flatMap((node, index) => {
    if (node.kind === "group" || node.kind === "function") {
      return collectDataSinkHeredocSpans(node.body);
    }
    if (node.kind !== "command")
      return [];
    const nestedSpans = node.nested.flatMap((nested) => collectDataSinkHeredocSpans(nested));
    const quotedBodies = node.redirections.flatMap((redirection) => redirection.heredoc?.quotedDelimiter ? [redirection.heredoc.bodySpan] : []);
    if (isCodeInterpreterHeredocConsumer(node))
      return [...nestedSpans, ...quotedBodies];
    const next = program.nodes[index + 1];
    const piped = next?.kind === "connector" && (next.operator === "|" || next.operator === "|&");
    if (piped || !isDataSinkHeredocConsumer(node))
      return nestedSpans;
    return [...nestedSpans, ...quotedBodies];
  });
}
function getCalledFunctionBody(view, functions) {
  const name = import_model.getCalledCommandName(view);
  return name === undefined ? undefined : functions.get(name);
}
function isBareWord(word, text) {
  return word !== undefined && word.provenance === "literal" && !word.quoted && word.raw === word.text && word.text === text;
}
function isMessageSinkConsumer(view) {
  if (isBareWord(view.words[0], "git"))
    return isBareWord(view.words[1], "commit");
  if (!isBareWord(view.words[0], "gh") || !isBareWord(view.words[2], "create"))
    return false;
  return isBareWord(view.words[1], "pr") || isBareWord(view.words[1], "issue");
}
function isDataSinkHeredocConsumer(view) {
  const isDataSink = isBareWord(view.words[0], "cat") || isBareWord(view.words[0], "tee") || isMessageSinkConsumer(view);
  return isDataSink && !view.words.some(hasOutputProcessSubstitution) && !view.redirections.some((redirection) => hasOutputProcessSubstitution(redirection.target));
}
function hasOutputProcessSubstitution(word) {
  return word?.parts.some((part) => part.provenance === "command-substitution" && part.raw.startsWith(">(")) ?? false;
}

// src/gate/guards/semantic-facts.ts
var import_canonicalization2 = require("./core.js");
var import_parse2 = require("./core-shell.js");
var import_tool_input = require("./core.js");
var PATH_LIKE_KEYS = new Set([
  "absolutepath",
  "destination",
  "directorypath",
  "directory_path",
  "file",
  "file_path",
  "filepath",
  "include",
  "notebook_path",
  "path",
  "paths",
  "searchdirectory",
  "search_directory",
  "searchpath",
  "targetfile",
  "target_file"
]);
var GREP_KEYS = new Set([...PATH_LIKE_KEYS, "glob"]);
var GLOB_KEYS = new Set([...GREP_KEYS, "folder", "pattern", "patterns"]);

class StructuralShellSyntaxLimitError extends Error {
  name = "StructuralShellSyntaxLimitError";
  constructor() {
    super("Structural command analysis limit exceeded.");
  }
}
function createSemanticFacts(invocation) {
  const store = createSemanticFactStore();
  const inputCommand = import_tool_input.getCommandFromToolInput(invocation.input);
  const candidates = [];
  if ((invocation.route.kind === "command" || invocation.route.kind === "unknown") && inputCommand) {
    candidates.push({ usage: "input-candidate", source: inputCommand });
  }
  if (invocation.route.kind === "command" && "command" in invocation && invocation.command) {
    candidates.push({ usage: "declared-command", source: invocation.command });
  }
  const commands = candidates.reduce((facts, candidate) => {
    const existingIndex = facts.findIndex((fact) => fact.source === candidate.source);
    if (existingIndex !== -1) {
      const existing = facts[existingIndex];
      if (!existing)
        return facts;
      facts[existingIndex] = {
        ...existing,
        usages: [...existing.usages, candidate.usage]
      };
      return facts;
    }
    const dialect = invocation.route.kind === "command" ? invocation.route.shell : process.platform === "win32" ? "powershell" : "posix";
    const program = store.getCommandProgram(candidate.source, dialect);
    facts.push({
      usages: [candidate.usage],
      source: candidate.source,
      program,
      shell: store.getShellSyntax(candidate.source, program)
    });
    return facts;
  }, []);
  return {
    invocation: {
      toolName: invocation.toolName,
      route: invocation.route,
      context: invocation.context
    },
    commands,
    paths: extractDirectPathFacts(invocation),
    store
  };
}
function getCommandSyntaxFact(facts, usage) {
  return facts.commands.find((fact) => fact.usages.includes(usage));
}
function projectSensitiveShellText(source, environment) {
  if (!source.includes("$"))
    return source;
  return import_canonicalization2.expandSupportedPathEnvironmentVariables(source, environment);
}
function createSemanticFactStore() {
  const commandPrograms = new Map;
  const shellFacts = new WeakMap;
  const getCommandProgram = (source, dialect) => {
    const key = `${dialect}\x00${source}`;
    const existing = commandPrograms.get(key);
    if (existing)
      return existing;
    const program = import_parse2.parseCommand(source, dialect);
    commandPrograms.set(key, program);
    return program;
  };
  const getShellSyntax = (source, suppliedProgram) => {
    if (suppliedProgram && suppliedProgram.source !== source) {
      throw new TypeError("Shell syntax source does not match command program source.");
    }
    const program = suppliedProgram ?? getCommandProgram(source, "posix");
    const existing = shellFacts.get(program);
    if (existing)
      return existing;
    const syntax = program.status === "limited" ? { status: "structural-limit", source, program, assignmentFallbacks: [] } : readGuardSyntax(source, program);
    shellFacts.set(program, syntax);
    return syntax;
  };
  return {
    getShellSyntax,
    getCommandProgram
  };
}
function extractDirectPathFacts(invocation) {
  const keys = invocation.route.kind === "grep" ? GREP_KEYS : invocation.route.kind === "glob" ? GLOB_KEYS : PATH_LIKE_KEYS;
  return [
    ...import_tool_input.extractPathLikeToolValues(invocation.input, keys),
    ...invocation.route.kind === "patch" || typeof invocation.input === "string" ? import_tool_input.extractPatchTargetsFromToolInput(invocation.input) : []
  ];
}

// src/gate/guards/protected-path-scanner.ts
var MV_OPTIONS_WITH_VALUES = new Set(["-S", "--suffix"]);
function findProtectedPathMutationInCommand(syntax, cwd, environment, budget, scanner) {
  if (syntax.status === "structural-limit")
    throw new StructuralShellSyntaxLimitError;
  if (syntax.status !== "complete")
    return scanner.findMalformedTarget(syntax.source);
  return walkGuardSyntax(syntax, cwd, environment, budget, {
    segment: (tokens, state) => scanner.findSegmentTarget(tokens, state),
    redirection: (redirection, state) => redirection.role === "file-write" && scanner.isRedirectionTarget(expandTrackedShellVariables(redirection.target, state.variables), state) ? redirection.target : null
  });
}
function extractMvOperandPaths(args) {
  const operands = [];
  let targetDirectory = null;
  let optionsEnded = false;
  for (let index = 0;index < args.length; index++) {
    const arg = args[index];
    if (arg === undefined)
      break;
    if (!optionsEnded && arg === "--") {
      optionsEnded = true;
      continue;
    }
    if (!optionsEnded && (arg === "-t" || arg === "--target-directory")) {
      targetDirectory = args[++index] ?? null;
      continue;
    }
    if (!optionsEnded && arg.startsWith("--target-directory=")) {
      targetDirectory = arg.slice("--target-directory=".length);
      continue;
    }
    if (!optionsEnded && arg.startsWith("-t") && arg.length > 2) {
      targetDirectory = arg.slice(2);
      continue;
    }
    if (!optionsEnded && MV_OPTIONS_WITH_VALUES.has(arg)) {
      index++;
      continue;
    }
    if (!optionsEnded && (arg.startsWith("--suffix=") || arg.startsWith("--backup=")))
      continue;
    if (!optionsEnded && arg.startsWith("-"))
      continue;
    operands.push(arg);
  }
  return targetDirectory ? { sources: operands, destination: targetDirectory } : { sources: operands.slice(0, -1), destination: operands.at(-1) ?? null };
}

// src/gate/guards/git-metadata-protection.ts
var REASON_GIT_METADATA_PROTECTION = "Git metadata and hooks are protected. Ask the user before modifying them.";
function findGitMetadataMutationTargetInSemanticFacts(facts, metadata, environment, budget) {
  const cwd = facts.invocation.context.executionCwd;
  if (!metadata)
    return null;
  if (facts.invocation.route.kind === "patch" || facts.invocation.route.kind === "path" || facts.invocation.route.kind === "unknown") {
    if (import_tool_input2.isReadOnlyTool(facts.invocation.toolName))
      return null;
    const target = facts.paths.find((path) => isProtectedGitWriteLikeTarget(path, cwd, metadata, environment, budget, metadata.entries));
    return target ? { target } : null;
  }
  if (facts.invocation.route.kind !== "command")
    return null;
  const command = getCommandSyntaxFact(facts, "input-candidate");
  if (!command)
    return null;
  const target = findProtectedPathMutationInCommand(command.shell, cwd, environment, budget, {
    findSegmentTarget: (segment, state) => findGitMetadataMoveTarget(segment, state, metadata, environment, budget),
    isRedirectionTarget: (target, state) => isProtectedGitWriteLikeTarget(target, state.cwd, metadata, environment, budget, metadata.markerFiles),
    findMalformedTarget: () => null
  });
  return target ? { target } : null;
}
function isProtectedGitDeleteTarget(target, cwd, metadata, recursive, environment, budget, dotEntryGlobs = false) {
  if (!metadata)
    return false;
  const candidate = comparePath(import_canonicalization3.normalizeProtectedPathCandidate(target, cwd, environment, budget));
  const globBase = candidate.replace(/(\/\.?\*+)+$/, "");
  if (globBase !== candidate && globBase !== "") {
    if (isProtectedExactOrHookTarget(globBase, metadata))
      return true;
    const matchesHidden = dotEntryGlobs || candidate.slice(globBase.length).includes("/.");
    const covers = (path) => matchesHidden ? isEqualOrWithin(path, globBase) : isGlobVisibleDescendant(path, globBase);
    if (metadata.markerFiles.some(covers))
      return true;
    return recursive && protectedRoots(metadata).some(covers);
  }
  if (isProtectedExactOrHookTarget(candidate, metadata))
    return true;
  return recursive && protectedRoots(metadata).some((path) => isEqualOrWithin(path, candidate));
}
function isGlobVisibleDescendant(target, base) {
  const path = import_node_path.relative(base, target);
  if (path === "" || path.startsWith("..") || import_node_path.isAbsolute(path))
    return false;
  return !path.split(/[\\/]/)[0]?.startsWith(".");
}
function isProtectedGitMoveSource(target, cwd, metadata, environment, budget) {
  return isProtectedGitDeleteTarget(target, cwd, metadata, true, environment, budget);
}
function isProtectedGitMoveDestination(target, cwd, metadata, environment, budget) {
  if (!metadata)
    return false;
  return isProtectedExactOrHookTarget(comparePath(import_canonicalization3.normalizeProtectedPathCandidate(target, cwd, environment, budget)), metadata);
}
function isProtectedGitWriteLikeTarget(target, cwd, metadata, environment, budget, exactTargets) {
  const candidate = comparePath(import_canonicalization3.normalizeProtectedPathCandidate(target, cwd, environment, budget));
  return exactTargets.includes(candidate) || isProtectedHookTarget(candidate, metadata);
}
function isProtectedGitHookNameSelection(startingPoints, cwd, metadata, environment, budget) {
  if (!metadata)
    return false;
  return metadata.hooksDirectories.some((hooks) => startingPoints.some((target) => isEqualOrWithin(hooks, comparePath(import_canonicalization3.normalizeProtectedPathCandidate(target, cwd, environment, budget)))));
}
function isProtectedExactOrHookTarget(candidate, metadata) {
  return metadata.entries.includes(candidate) || metadata.directories.includes(candidate) || isProtectedHookTarget(candidate, metadata);
}
function isProtectedHookTarget(candidate, metadata) {
  return metadata.hooksDirectories.some((hooks) => isEqualOrWithin(candidate, hooks));
}
var GIT_METADATA_NAME_SCAN_LIMIT = 50000;
function mayHaveGitMetadataEntryNamed(metadata, matches) {
  const pending = [...new Set(protectedRoots(metadata))];
  if (pending.some((path) => matches(import_node_path.basename(path))))
    return true;
  let scanned = 0;
  while (pending.length > 0) {
    const directory = pending.pop() ?? "";
    const entries = readDirectoryEntries(directory);
    if (!entries)
      return true;
    scanned += entries.length;
    if (scanned > GIT_METADATA_NAME_SCAN_LIMIT)
      return true;
    if (entries.some((entry) => matches(entry.name)))
      return true;
    pending.push(...entries.filter((entry) => entry.isDirectory()).map((entry) => import_node_path.join(directory, entry.name)));
  }
  return false;
}
function readDirectoryEntries(directory) {
  try {
    const stats = import_node_fs.lstatSync(directory, { throwIfNoEntry: false });
    if (!stats)
      return [];
    if (!stats.isDirectory())
      return stats.isSymbolicLink() ? null : [];
    return import_node_fs.readdirSync(directory, { withFileTypes: true, encoding: "utf8" });
  } catch {
    return null;
  }
}
function protectedRoots(metadata) {
  return [...metadata.entries, ...metadata.directories, ...metadata.hooksDirectories];
}
function isEqualOrWithin(target, root) {
  const path = import_node_path.relative(root, target);
  return path === "" || !/^\.\.(?:[\\/]|$)/.test(path) && !import_node_path.isAbsolute(path);
}
function comparePath(path) {
  return process.platform === "win32" ? path.toLowerCase() : path;
}
function findGitMetadataMoveTarget(segment, state, metadata, environment, budget) {
  if (isAssignmentOnlySegment(segment))
    return null;
  const stripped = import_wrapper_prelude2.stripWrappersForPathScan([...segment], environment);
  if (import_tokens2.getBasename(stripped[0] ?? "").toLowerCase() !== "mv")
    return null;
  const operands = extractMvOperandPaths(stripped.slice(1));
  const source = operands.sources.find((target) => isProtectedGitMoveSource(expandTrackedShellVariables(target, state.variables), state.cwd, metadata, environment, budget));
  if (source)
    return source;
  return operands.destination && isProtectedGitMoveDestination(expandTrackedShellVariables(operands.destination, state.variables), state.cwd, metadata, environment, budget) ? operands.destination : null;
}

// src/gate/guards/policy-apply-protection.ts
var import_tokens3 = require("./core-shell.js");
var import_wrapper_prelude3 = require("./analyzer.js");

// src/gate/guards/safety-net-invocation.ts
var CC_SAFETY_NET_ENTRYPOINTS = new Set([
  "src/entries/bin.ts",
  "src/cli/cc-safety-net.ts",
  "dist/bin/cc-safety-net.js",
  "dist/bin/hook.js"
]);
var CC_SAFETY_NET_BIN_NAMES = new Set(["cc-safety-net", "ccsn"]);
var PACKAGE_RUNNERS = new Set(["bunx", "npx", "pnpx"]);
var DLX_RUNNERS = new Set(["pnpm", "yarn"]);
var EXEC_RUNNERS = new Set(["npm", "pnpm", "yarn"]);
var SCRIPT_RUNTIMES = new Set(["bun", "node"]);
function safetyNetSubcommandIndex(command, tokens, options = {}) {
  if (CC_SAFETY_NET_BIN_NAMES.has(command))
    return 0;
  if (PACKAGE_RUNNERS.has(command)) {
    if (options.broad)
      return broadRunnerSubcommandIndex(tokens);
    const skip = tokens[0] === "-y" || tokens[0] === "--yes" ? 1 : 0;
    return isRunnerTarget(tokens[skip]) ? skip + 1 : null;
  }
  const start = options.broad ? tokens.findIndex((token) => !token.startsWith("-")) : 0;
  if (start !== -1 && EXEC_RUNNERS.has(command) && options.broad && tokens[start] === "exec") {
    const index = broadRunnerSubcommandIndex(tokens.slice(start + 1));
    return index === null ? null : start + 1 + index;
  }
  if (DLX_RUNNERS.has(command)) {
    if (command === "yarn" && !options.broad)
      return null;
    if (!options.broad)
      return tokens[0] === "dlx" && isRunnerTarget(tokens[1]) ? 2 : null;
    if (start === -1 || tokens[start] !== "dlx")
      return null;
    const index = broadRunnerSubcommandIndex(tokens.slice(start + 1));
    return index === null ? null : start + 1 + index;
  }
  if (SCRIPT_RUNTIMES.has(command)) {
    const at = options.broad && start !== -1 ? start : 0;
    if (isSafetyNetEntrypoint(tokens[at]))
      return at + 1;
    if (command === "bun" && tokens[at] === "run" && isSafetyNetEntrypoint(tokens[at + 1])) {
      return at + 2;
    }
  }
  return null;
}
function broadRunnerSubcommandIndex(tokens) {
  const first = tokens.findIndex((token) => isRunnerTarget(token));
  if (first === -1)
    return null;
  let index = first;
  while (index < tokens.length) {
    const token = tokens[index] ?? "";
    if (!token.startsWith("-") && !isRunnerTarget(token))
      break;
    index++;
  }
  return index;
}
function isRunnerTarget(token) {
  if (!token)
    return false;
  const at = token.indexOf("@");
  if (at === -1)
    return CC_SAFETY_NET_BIN_NAMES.has(token);
  if (at === 0)
    return false;
  const suffix = token.slice(at + 1);
  if (suffix === "" || suffix.includes("/") || suffix.includes(":"))
    return false;
  return CC_SAFETY_NET_BIN_NAMES.has(token.slice(0, at));
}
function isSafetyNetEntrypoint(value) {
  const normalized = value?.replaceAll("\\", "/");
  return [...CC_SAFETY_NET_ENTRYPOINTS].some((entrypoint) => normalized === entrypoint || normalized?.endsWith(`/${entrypoint}`));
}

// src/gate/guards/policy-apply-protection.ts
var REASON_POLICY_APPLY_PROTECTION = "Only the user may apply a policy proposal, because it rewrites the configuration CC Safety Net enforces. Ask them to run `cc-safety-net policy apply <file>` themselves in a terminal; you can run `cc-safety-net policy check <file>` to show them what it would change.";
function findPolicyApplyInvocationInSemanticFacts(facts, environment, budget) {
  const command = getCommandSyntaxFact(facts, "input-candidate");
  if (!command)
    return null;
  const target = findProtectedPathMutationInCommand(command.shell, facts.invocation.context.executionCwd, environment, budget, {
    findSegmentTarget: (segment) => findPolicyApplySegment(segment, environment),
    isRedirectionTarget: () => false,
    findMalformedTarget: () => null
  });
  return target ? { target } : null;
}
function findPolicyApplySegment(segment, environment) {
  const stripped = import_wrapper_prelude3.stripWrappers([...segment], environment);
  const tokens = stripped.slice(1);
  const index = safetyNetSubcommandIndex(import_tokens3.getBasename(stripped[0] ?? "").toLowerCase(), tokens, {
    broad: true
  });
  if (index === null)
    return null;
  const rest = tokens.slice(index).filter((token) => token !== "-g" && token !== "--global");
  return rest[0] === "policy" && rest[1] === "apply" ? stripped.join(" ") : null;
}

// src/gate/guards/policy-protection.ts
var import_node_path2 = require("node:path");
var import_canonicalization4 = require("./core.js");
var import_paths = require("./core.js");
var import_tokens4 = require("./core-shell.js");
var import_tool_input3 = require("./core.js");
var import_command_words = require("./analyzer.js");
var import_find = require("./analyzer.js");
var import_wrapper_prelude4 = require("./analyzer.js");
var REASON_POLICY_CONFIG_PROTECTION = "This path contains the protected policy config and you must not modify or delete it.";
var READ_ONLY_COMMANDS = new Set([
  "[",
  "cat",
  "file",
  "grep",
  "head",
  "jq",
  "less",
  "ls",
  "more",
  "rg",
  "sed",
  "stat",
  "tail",
  "test",
  "wc"
]);
function findPolicyConfigMutationTargetInSemanticFacts(facts, environment, budget) {
  const identity = createPolicyPathIdentity(facts.invocation.context, environment, budget);
  if (facts.invocation.route.kind === "patch") {
    return findPolicyConfigMutationTargetInPaths(facts.paths, false, facts.invocation.context.executionCwd, identity, environment, budget);
  }
  const command = getCommandSyntaxFact(facts, "input-candidate");
  if (facts.invocation.route.kind === "command") {
    return command ? findPolicyConfigMutationTargetInCommand(command.shell, facts.invocation.context.executionCwd, identity, environment, budget) : null;
  }
  if (facts.invocation.route.kind === "unknown" && command) {
    const target = findPolicyConfigMutationTargetInCommand(command.shell, facts.invocation.context.executionCwd, identity, environment, budget);
    if (target)
      return target;
  }
  return findPolicyConfigMutationTargetInPaths(facts.paths, facts.invocation.route.kind === "grep" || facts.invocation.route.kind === "glob" || import_tool_input3.isReadOnlyTool(facts.invocation.toolName), facts.invocation.context.executionCwd, identity, environment, budget);
}
function findPolicyConfigMutationTargetInPaths(paths, readOnly, cwd, identity, environment, budget) {
  if (readOnly)
    return null;
  const target = paths.find((path) => isPolicyFile(path, cwd, identity, environment, budget));
  return target ? { target } : null;
}
function findPolicyConfigMutationTargetInCommand(syntax, cwd, identity, environment, budget) {
  const target = findProtectedPathMutationInCommand(syntax, cwd, environment, budget, {
    findSegmentTarget: (segment, state) => findPolicyConfigMutationTargetInSegment(segment, state, identity, environment, budget)?.target ?? null,
    isRedirectionTarget: (target, state) => isPolicyFile(target, state.cwd, identity, environment, budget),
    findMalformedTarget: (source) => findPolicyConfigTargetInMalformedText(source, cwd, identity, environment, budget)?.target ?? null
  });
  return target ? { target } : null;
}
function findPolicyConfigMutationTargetInSegment(segment, state, identity, environment, budget) {
  if (isAssignmentOnlySegment(segment))
    return null;
  const stripped = import_wrapper_prelude4.stripWrappersForPathScan([...segment], environment);
  const command = import_tokens4.getBasename(stripped[0] ?? "").toLowerCase();
  const args = stripped.slice(1);
  if (command === "rm" && hasRecursiveRmOption(args)) {
    const target = extractRmOperands(args).find((operand) => isPolicyDirectoryOrAncestor(expandTrackedShellVariables(operand, state.variables), state.cwd, identity, environment, budget));
    if (target)
      return { target };
  }
  if (command === "find") {
    const deletesDirectly = import_find.findHasDelete(stripped, 1);
    if (deletesDirectly || import_find.findExecRmDeletesFoundPaths(stripped, environment)) {
      const target = (import_find.getFindStartingPoints(import_command_words.textCommandWords(stripped)) ?? import_command_words.textCommandWords(["."])).find((startingPoint) => {
        const expanded = expandTrackedShellVariables(startingPoint.text, state.variables);
        return isPolicyFile(expanded, state.cwd, identity, environment, budget) || isPolicyDirectoryOrAncestor(expanded, state.cwd, identity, environment, budget);
      })?.text;
      if (target)
        return { target };
    }
  }
  if (command === "mv") {
    const target = extractMvOperandPaths(args).sources.find((source) => isPolicyFileOrDirectorySource(expandTrackedShellVariables(source, state.variables), state.cwd, identity, environment, budget));
    if (target)
      return { target };
  }
  if (isReadOnlySegment(stripped, command))
    return null;
  for (const token of [...segment, ...stripped]) {
    for (const candidate of extractDirectPathCandidates(token)) {
      if (isPolicyFile(expandTrackedShellVariables(candidate, state.variables), state.cwd, identity, environment, budget)) {
        return { target: candidate };
      }
    }
  }
  return null;
}
function hasRecursiveRmOption(args) {
  return args.some((arg) => arg === "--recursive" || arg.startsWith("-") && !arg.startsWith("--") && /[rR]/.test(arg.slice(1)));
}
function extractRmOperands(args) {
  const separator = args.indexOf("--");
  if (separator !== -1) {
    return [
      ...args.slice(0, separator).filter((arg) => !arg.startsWith("-")),
      ...args.slice(separator + 1)
    ];
  }
  return args.filter((arg) => !arg.startsWith("-"));
}
function isReadOnlySegment(stripped, command) {
  if (!READ_ONLY_COMMANDS.has(command))
    return false;
  if (command !== "sed")
    return true;
  return !stripped.slice(1).some((token) => token.startsWith("-i") || token === "--in-place" || token.startsWith("--in-place="));
}
function findPolicyConfigTargetInMalformedText(text, cwd, identity, environment, budget) {
  for (const token of text.split(/\s+/)) {
    for (const candidate of extractDirectPathCandidates(token)) {
      if (isPolicyFile(candidate, cwd, identity, environment, budget))
        return { target: candidate };
    }
  }
  return null;
}
function extractDirectPathCandidates(value) {
  const cleaned = value.trim().replace(/^['"]|['"]$/g, "");
  const separator = cleaned.indexOf("=");
  return separator === -1 || separator === cleaned.length - 1 ? [cleaned] : [cleaned, cleaned.slice(separator + 1)];
}
function createPolicyPathIdentity(toolContext, environment, budget) {
  const normalize = (path) => comparePath2(import_canonicalization4.normalizeProtectedPathCandidate(path, toolContext.executionCwd, environment, budget));
  const userFile = normalize(import_paths.getUserPolicyPath(environment));
  const projectFiles = [
    normalize(import_paths.getProjectPolicyPath(toolContext.executionCwd)),
    normalize(import_paths.getProjectPolicyPath(toolContext.configCwd))
  ];
  const directoriesAndAncestors = new Set(projectFiles.map((file) => import_node_path2.dirname(file)));
  for (let current = import_node_path2.dirname(userFile);; current = import_node_path2.dirname(current)) {
    directoriesAndAncestors.add(current);
    if (import_node_path2.dirname(current) === current)
      break;
  }
  return { files: new Set([userFile, ...projectFiles]), directoriesAndAncestors };
}
function isPolicyFile(target, cwd, identity, environment, budget) {
  const resolved = import_canonicalization4.normalizeProtectedFileCandidate(target, cwd, environment, budget, (name) => comparePath2(name) === import_paths.POLICY_FILE);
  return resolved !== null && identity.files.has(comparePath2(resolved));
}
function isPolicyDirectoryOrAncestor(target, cwd, identity, environment, budget) {
  return identity.directoriesAndAncestors.has(comparePath2(import_canonicalization4.normalizeProtectedPathCandidate(target, cwd, environment, budget)));
}
function isPolicyFileOrDirectorySource(target, cwd, identity, environment, budget) {
  const normalized = comparePath2(import_canonicalization4.normalizeProtectedPathCandidate(target, cwd, environment, budget));
  return identity.files.has(normalized) || identity.directoriesAndAncestors.has(normalized);
}
function comparePath2(path) {
  return process.platform === "win32" ? path.toLowerCase() : path;
}

// src/gate/secret/secret-protection.ts
var import_node_path3 = require("node:path");
var import_node_url = require("node:url");
var import_budget = require("./core.js");
var import_canonicalization5 = require("./core.js");
var import_allow_paths = require("./core.js");
var import_constants = require("./core-shell.js");
var import_secret = require("./core-shell.js");
var import_tokens5 = require("./core-shell.js");
var import_awk = require("./analyzer.js");
var import_interpreters = require("./analyzer.js");
var import_powershell_wrapper = require("./analyzer.js");
var import_xargs = require("./analyzer.js");
var REASON_SECRET_PROTECTION = "Access to a sensitive path is not allowed.";
var NON_PATH_OPERAND_COMMANDS = new Set(["echo", "printf"]);
var PATH_ROOT_COMMANDS = new Set(["find"]);
var SHELL_RESERVED_WORDS = new Set(["!", "do", "elif", "else", "if", "then", "until", "while"]);
var FIND_EXEC_PRIMARIES = new Set(["-exec", "-execdir"]);
var FIND_EXEC_TERMINATORS = new Set([";", "+"]);
var FIND_NON_METADATA_ARGS = new Set([
  "-delete",
  "-files0-from",
  "-exec",
  "-execdir",
  "-fls",
  "-fprint",
  "-fprint0",
  "-fprintf",
  "-ok",
  "-okdir"
]);
var FIND_MATCH_PATH_PRIMARIES = new Set([
  "-name",
  "-iname",
  "-path",
  "-ipath",
  "-wholename",
  "-iwholename",
  "-samefile"
]);
var CURL_UPLOAD_FLAGS = new Set([
  "-d",
  "--data",
  "--data-ascii",
  "--data-binary",
  "--data-urlencode",
  "-F",
  "--form"
]);
var INLINE_ACCESS_NAMESPACES = new Set([
  "bun",
  "child_process",
  "deno",
  "dotenv",
  "fs",
  "subprocess"
]);
var INLINE_ACCESS_IDENTIFIER_PARTS = new Set([
  "append",
  "awk",
  "base64",
  "cat",
  "chmod",
  "chown",
  "connect",
  "copy",
  "cp",
  "database",
  "dd",
  "eval",
  "exec",
  "fetch",
  "file",
  "function",
  "grep",
  "head",
  "include",
  "load",
  "move",
  "mv",
  "open",
  "fopen",
  "popen",
  "read",
  "readfile",
  "remove",
  "rename",
  "require",
  "rg",
  "rm",
  "sed",
  "shell",
  "source",
  "spawn",
  "strings",
  "system",
  "tail",
  "tar",
  "truncate",
  "unlink",
  "write",
  "xxd",
  "zip"
]);
var CODE_EVAL_FLAGS = new Set(["-c", "-e", "-r", "-E", "--eval", "--exec"]);
var INTERPRETERS_BY_CLUSTERED_CODE_EVAL_FLAG = new Map([
  ["c", new Set(["bash", "sh", "zsh", "dash", "ksh", "python"])],
  ["e", new Set(["node", "deno", "bun", "ruby", "perl", "rscript", "osascript"])],
  ["E", new Set(["perl"])],
  ["r", new Set(["php"])]
]);
var PATTERN_FIRST_COMMANDS = new Set(["grep", "rg"]);
var SEARCH_NAMES_ONLY_LONG = new Set([
  "files-with-matches",
  "files-without-match",
  "count",
  "quiet"
]);
var SEARCH_VALUELESS_LONG = new Set([
  ...SEARCH_NAMES_ONLY_LONG,
  "ignore-case",
  "fixed-strings",
  "hidden"
]);
var NAME_LISTING_METADATA_COMMANDS = new Set(["wc", ...PATTERN_FIRST_COMMANDS]);
var CERTIFICATE_PIPE_PROGRAMS = new Set(["cd", "grep", "head", "openssl", "tail", "tailscale"]);
var WC_COUNT_OPTION = /^(?:-[lwcm]+|--(?:lines|words|bytes|chars))$/;
var GH_TEXT_FLAGS = new Set(["--search", "-S", "--title", "-t", "--body", "-b", "--jq", "-q"]);
var GIT_MESSAGE_SUBCOMMANDS = new Set(["commit", "merge", "notes", "stash", "tag"]);
var GIT_MESSAGE_FLAGS = new Set(["-m", "--message"]);
var GIT_GREP_FLAGS = new Set(["--grep"]);
var POWERSHELL_HEADS = new Set(["powershell", "pwsh"]);
var JQ_COMMANDS = new Set(["jq", "gojq", "jaq"]);
var PATTERN_FILE_SHORT = "f";
var PATTERN_FILE_LONG = "file";
var PATTERNLESS_FILES_LONG = "files";
var PATTERN_SUPPLY_SHORT = new Set(["e", "f"]);
var PATTERN_SUPPLY_LONG = new Set(["regexp", "file"]);
var PATTERN_ARG_SHORT = new Set(["e", "f", "A", "B", "C", "m"]);
var PATTERN_ARG_LONG = new Set([
  "regexp",
  "file",
  "after-context",
  "before-context",
  "context",
  "max-count"
]);
var PIPE_INPUT_PATH_MARKER = "__CC_SAFETY_NET_PIPE_INPUT__";
var BARE_PATH_PATTERN = /[\w./~@+-]*[./~][\w./~@+-]*/g;
var PYTHON_STRING_PREFIX = /(?:^|[^\w])([rRbBuUfF]{1,2})$/;
var UNMASKABLE_SIMPLE_CODE = /^(?:`|%[qQwWiIxX]?[([{<|!/]|<<<?[~-]?['"]?[A-Za-z_])/;
var SIMPLE_INTERPOLATION = /#\{|\$\{|\{\$|[$@][A-Za-z_]/;
var SHELL_EXEC_CALL = /\b(?:subprocess\s*\.\s*(?:run|call|Popen|check_output|check_call|getoutput|getstatusoutput)|(?:[\w$]+\s*\.\s*)*(?:exec(?:File)?(?:Sync)?|spawn(?:File)?(?:Sync)?|system|popen|shell_exec|passthru|child_process|eval))\s*\(/g;
var SHELL_EXEC_PREFIX = /\b(?:system|exec|spawn|popen)\s*$/;
var LANGUAGE_EVAL_CALL = /\b(?:eval|exec)\s*\(/g;
var LANGUAGE_EVAL_PREFIX = /\b(?:eval|exec)\s*$/;
var VALUE_CONSUMING_INTERPRETER_FLAGS = new Map([
  ["bash", new Set(["-O"])],
  ["sh", new Set(["-O"])],
  ["zsh", new Set(["-o"])],
  ["dash", new Set(["-o"])],
  ["ksh", new Set(["-o"])],
  ["python", new Set(["-W", "-X"])],
  ["node", new Set(["-r", "--require", "--loader", "--import", "--input-type"])]
]);
function findSensitivePolicyPathTarget(candidates, config, configCwd, environment, budget, activeDefaultTargets) {
  for (const candidate of candidates) {
    const target = candidate.target;
    if (matchesPolicyPath(target, candidate.cwd, config?.denyPaths ?? [], configCwd, environment, budget)) {
      return { target, ruleId: "secret.deny-path" };
    }
    if (activeDefaultTargets && !activeDefaultTargets.has(target))
      continue;
    const ruleId = isSensitivePath(target, candidate.cwd, config, environment, budget);
    if (ruleId) {
      const standardModeFileNameRule = activeDefaultTargets !== undefined && !ruleId.startsWith("secret.home.") && !ruleId.startsWith("secret.cli.");
      const matchedDirectory = standardModeFileNameRule && environment.paths.isDirectory(candidateAbsolutePath(target, candidate.cwd, environment, budget));
      if (matchedDirectory)
        continue;
      const dataRoleLiteral = standardModeFileNameRule && activeDefaultTargets?.get(target) === "data";
      if (dataRoleLiteral)
        continue;
      const writeCreatesNewFile = standardModeFileNameRule && (candidate.isRedirectionWriteTarget === true || activeDefaultTargets?.get(target) === "write") && !target.includes("$") && !candidateExistsOnDisk(target, candidate.cwd, environment, budget);
      if (writeCreatesNewFile)
        continue;
      if (standardModeFileNameRule && (candidate.isCreatedPath === true || candidate.isCertificateInput === true)) {
        continue;
      }
      const spacedNonPathWord = standardModeFileNameRule && /\s/.test(target) && !target.includes("$") && !/^(?:[~./]|[A-Za-z]:[\\/])/.test(target) && !candidateExistsOnDisk(target, candidate.cwd, environment, budget);
      if (spacedNonPathWord)
        continue;
      if (!ruleId.startsWith("secret.cli.") && matchesAllowedPath(target, candidate.cwd, config?.allowPaths ?? [], configCwd, environment, budget)) {
        continue;
      }
      return { target, ruleId };
    }
  }
  return null;
}
function findSensitiveTargetInSemanticFacts(facts, config, environment, budget, options = {}) {
  const candidates = extractToolPathTargets(facts, environment, budget);
  const target = findSensitivePolicyPathTarget(candidates, config, facts.invocation.context.configCwd, environment, budget);
  if (target === null || target.ruleId === "secret.deny-path" || options.strict !== false) {
    return target;
  }
  const refinedWithLoopWords = extractToolPathTargets(facts, environment, budget, {
    skipMetadataOnlySegments: true,
    inlineLiteralsPresumedData: true
  });
  const loopsReferencing = new Map;
  refinedWithLoopWords.forEach((other) => referencedShellVariables(other.target).forEach((name) => loopsReferencing.set(name, (loopsReferencing.get(name) ?? new Set).add(other.loopVariable))));
  const referencedOutsideLoop = (name, loopVariable) => (loopsReferencing.get(name)?.size ?? 0) > (loopsReferencing.get(name)?.has(loopVariable) ? 1 : 0);
  const refinedCandidates = refinedWithLoopWords.filter(({ loopVariable }) => loopVariable === undefined || referencedOutsideLoop(loopVariable, loopVariable) || referencedOutsideLoop("!", loopVariable));
  const pathRoleTargets = new Set(refinedCandidates.filter((candidate) => candidate.literalRole === undefined).map((candidate) => candidate.target));
  const writeRoleTargets = new Set(refinedCandidates.filter((candidate) => candidate.literalRole === "write").map((candidate) => candidate.target));
  const refinedTarget = findSensitivePolicyPathTarget(candidates, config, facts.invocation.context.configCwd, environment, budget, new Map(refinedCandidates.map((candidate) => [
    candidate.target,
    pathRoleTargets.has(candidate.target) ? "path" : writeRoleTargets.has(candidate.target) ? "write" : "data"
  ])));
  return refinedTarget?.ruleId !== "secret.deny-path" && isMetadataOnlyCommand(facts, environment) ? null : refinedTarget;
}
function isMetadataOnlyCommand(facts, environment) {
  const syntax = getCommandSyntaxFact(facts, "input-candidate") ?? getCommandSyntaxFact(facts, "declared-command");
  if (!syntax)
    return false;
  if (syntax.program.nodes.some((node) => node.kind === "command" && node.nested.length > 0)) {
    return false;
  }
  const tokens = [];
  for (const token of readGuardTokens(syntax.shell)) {
    if (token.kind === "operator" && token.boundary)
      return false;
    if (token.kind === "redirection")
      return false;
    if (token.kind === "operator")
      continue;
    tokens.push(projectSensitiveShellText(token.text, environment));
  }
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0)
    return false;
  const command = basename2(stripped[0] ?? "").toLowerCase();
  if (facts.invocation.route.kind === "unknown") {
    return syntax.program.dialect === "powershell" && (command === "ls" || command === "stat");
  }
  return isMetadataOnlyArgv(command, stripped.slice(1));
}
function isMetadataOnlyArgv(command, args) {
  if (command === "ls" || command === "stat")
    return true;
  if (command === "test")
    return args.length === 2 && (args[0] === "-e" || args[0] === "-f");
  if (command === "[") {
    return args.length === 3 && (args[0] === "-e" || args[0] === "-f") && args[2] === "]";
  }
  if (command === "git")
    return args[0] === "check-ignore";
  if (command === "wc")
    return args.every((arg) => !arg.startsWith("-") || WC_COUNT_OPTION.test(arg));
  if (PATTERN_FIRST_COMMANDS.has(command))
    return isNamesOrCountsOnlySearch(command, args);
  if (command !== "find")
    return false;
  return !args.some((arg) => FIND_NON_METADATA_ARGS.has(arg));
}
function isNamesOrCountsOnlySearch(command, args) {
  const beforeDoubleDash = args.includes("--") ? args.slice(0, args.indexOf("--")) : args;
  if (beforeDoubleDash.some((arg) => /^--(?:(?:file|pre)(?:=|$)|json|format)/.test(arg) || /^-[^-]*f/.test(arg))) {
    return false;
  }
  const valueFlag = command === "rg" ? /[ABCEMTdegjmrt]/ : /[ABCDdefm]/;
  const namesOnlyFlag = command === "rg" ? /[clq]/ : /[Lclq]/;
  const isShortCluster = (arg) => /^-[^-]/.test(arg);
  const consumedAsValue = (index) => {
    const previous = beforeDoubleDash[index - 1] ?? "";
    return /^--[^=]+$/.test(previous) && !SEARCH_VALUELESS_LONG.has(previous.slice(2)) || isShortCluster(previous) && previous.slice(1).search(valueFlag) === previous.length - 2;
  };
  const firstOperand = beforeDoubleDash.findIndex((arg, index) => !arg.startsWith("-") && !consumedAsValue(index));
  const optionArgs = command === "grep" && firstOperand >= 0 ? beforeDoubleDash.slice(0, firstOperand) : beforeDoubleDash;
  return optionArgs.some((arg, index) => {
    if (consumedAsValue(index))
      return false;
    if (arg.startsWith("--"))
      return SEARCH_NAMES_ONLY_LONG.has(arg.slice(2));
    return isShortCluster(arg) && namesOnlyFlag.test(arg.slice(1).split(valueFlag)[0] ?? "");
  });
}
function extractToolPathTargets(facts, environment, budget, options = {}) {
  const cwd = facts.invocation.context.executionCwd;
  const route = facts.invocation.route.kind;
  if (route !== "command" && route !== "unknown") {
    return facts.paths.map((target) => ({ target, cwd }));
  }
  const command = getCommandSyntaxFact(facts, "input-candidate");
  return [
    ...command ? extractCommandPathTargets(command.shell, facts.store, options, environment, cwd, budget, isPowerShell(command)) : [],
    ...route === "unknown" ? facts.paths.map((target) => ({ target, cwd })) : []
  ];
}
function isPowerShell(command) {
  return command.program.dialect === "powershell";
}
function extractCommandPathTargets(syntax, store, options, environment, cwd, budget, powershell = false) {
  if (syntax.status === "structural-limit")
    throw new StructuralShellSyntaxLimitError;
  if (syntax.status === "unclosed-quote")
    return [];
  if (syntax.status === "invalid")
    throw new Error("Unable to parse command for secret protection");
  const targets = [
    ...syntax.assignmentFallbacks.map((target) => ({ target, cwd })),
    ...extractCommandSubstitutionPathTargets(projectSensitiveShellText(syntax.source, environment), store, options, environment, cwd, budget)
  ];
  const map = (text) => projectSensitiveShellText(rewritePowerShellHomePrefix(text, powershell), environment);
  const holdsProcessSubstitution = /[<>=]\(/.test(syntax.source);
  const holdsCoprocess = /\bcoproc\b|\|&/.test(syntax.source);
  const pipedWords = [];
  const programs = [];
  const withPipeAhead = (pipeAhead) => ({
    ...options,
    commandHoldsPipe: options.commandHoldsPipe === true || pipeAhead || holdsCoprocess
  });
  walkGuardSyntax(syntax, cwd, environment, budget, {
    word: map,
    segment: (tokens, state, pipeProducer, boundary, shellWords, pipeAhead) => {
      if (tokens.length === 0)
        return null;
      const scriptOptions = withPipeAhead(pipeAhead);
      if (scriptOptions.commandHoldsPipe)
        pipedWords.push(...tokens);
      programs.push(basename2(withoutTimeout(stripLeadingWrappersAndEnvAssignments(tokens))[0] ?? "").toLowerCase());
      targets.push(...extractSegmentPathTargets(tokens, store, holdsProcessSubstitution || boundary === "|" || boundary === "|&" ? { ...scriptOptions, segmentMayFeedReader: true } : scriptOptions, environment, state.cwd, budget, shellWords));
      if (pipeProducer !== null) {
        targets.push(...extractPipeCarrierPathTargets(pipeProducer, tokens, store, scriptOptions, environment, state.cwd, budget));
      }
      return null;
    },
    redirection: (redirection, state, pipeAhead) => {
      if (redirection.body !== undefined && redirection.consumer !== undefined) {
        const scriptOptions = withPipeAhead(pipeAhead);
        targets.push(...extractStdinScriptPathTargets(redirection.consumer, [redirection.body], store, scriptOptions, environment, state.cwd, budget, (body) => rewalkInterpreterHeredocAsShell(redirection.consumer ?? [], body, store, scriptOptions, environment, state.cwd, budget)));
      }
      if (redirection.targetOrder === "legacy-segment")
        return ADOPT_AS_OPERAND;
      targets.push({
        target: map(redirection.target),
        cwd: state.cwd,
        ...redirection.role === "file-write" ? { isRedirectionWriteTarget: true } : {}
      });
      return null;
    }
  });
  const pipedNames = new Set(pipedWords.flatMap(referencedShellVariables));
  const certificateOutputMayReachReader = holdsProcessSubstitution || /\$\(|`/.test(syntax.source) || !programs.every((program) => CERTIFICATE_PIPE_PROGRAMS.has(program));
  return targets.map(({ loopVariable, ...candidate }) => {
    if (candidate.certificateOutputMayFeedReader === true && certificateOutputMayReachReader) {
      return { target: candidate.target, cwd: candidate.cwd };
    }
    return loopVariable === undefined || holdsProcessSubstitution || pipedNames.has(loopVariable) || pipedNames.has("!") ? candidate : { ...candidate, loopVariable };
  });
}
function referencedShellVariables(text) {
  return [
    .../^[A-Za-z_][A-Za-z0-9_]*$/.test(text) ? [text] : [],
    ...Array.from(text.matchAll(/\$(?:\{(!)|\{?([A-Za-z_][A-Za-z0-9_]*))/g), (match) => match[1] ?? match[2] ?? "")
  ];
}
function walkShellText(text, store, options, environment, cwd, budget, powershell = false) {
  const syntax = store.getShellSyntax(text, powershell ? store.getCommandProgram(text, "powershell") : undefined);
  if (syntax.status === "structural-limit")
    throw new StructuralShellSyntaxLimitError;
  return syntax.status === "complete" ? extractCommandPathTargets(syntax, store, options, environment, cwd, budget, powershell) : null;
}
function extractSegmentPathTargets(tokens, store, options, environment, cwd, budget, shellWords) {
  const here = (target) => ({ target, cwd });
  const reservedPrefix = tokens.findIndex((token) => !SHELL_RESERVED_WORDS.has(token));
  if (options.skipMetadataOnlySegments === true && reservedPrefix > 0) {
    return extractSegmentPathTargets(tokens.slice(reservedPrefix), store, options, environment, cwd, budget, new Set([...shellWords ?? []].map((index) => index - reservedPrefix)));
  }
  const loopVariable = tokens[1] ?? "";
  if (options.skipMetadataOnlySegments === true && tokens[0] === "for" && tokens[2] === "in" && /^[A-Za-z_][A-Za-z0-9_]*$/.test(loopVariable)) {
    return tokens.slice(3).flatMap((token) => extractOperandPathCandidates("for", token)).map((target) => ({ ...here(target), loopVariable }));
  }
  if (shellWords?.size) {
    const argv = tokens.filter((_, index) => !shellWords.has(index));
    if (JQ_COMMANDS.has(basename2(stripLeadingWrappersAndEnvAssignments(argv)[0] ?? "").toLowerCase())) {
      return [
        ...tokens.filter((_, index) => shellWords.has(index)).map(here),
        ...extractSegmentPathTargets(argv, store, options, environment, cwd, budget)
      ];
    }
  }
  const assignmentValues = extractLeadingAssignmentValues(tokens).map(here);
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0)
    return assignmentValues;
  const executable = stripped[0] ?? "";
  const command = basename2(executable).toLowerCase();
  const post = stripped.slice(1);
  const outputMayFeedReader = options.segmentMayFeedReader === true || options.commandHoldsPipe === true || options.displayOperandsAreCapturedOutput === true;
  const metadataOutputMayFeedReader = outputMayFeedReader && NAME_LISTING_METADATA_COMMANDS.has(command);
  if (options.skipMetadataOnlySegments === true && !metadataOutputMayFeedReader && isMetadataOnlyArgv(command, post)) {
    return assignmentValues;
  }
  const explainTargets = extractSafetyNetExplainPathTargets(executable, command, post);
  if (explainTargets) {
    return [...assignmentValues, ...explainTargets.map(here)];
  }
  if (NON_PATH_OPERAND_COMMANDS.has(command)) {
    return options.displayOperandsAreCapturedOutput === true ? [...assignmentValues, ...extractDisplayCommandOperands(tokens).map(here)] : assignmentValues;
  }
  if (command === "eval") {
    return [
      ...assignmentValues,
      ...walkShellText(post.join(" "), store, options, environment, cwd, budget) ?? post.map(here)
    ];
  }
  const powerShellScript = POWERSHELL_HEADS.has(import_tokens5.normalizeCommandToken(executable)) ? import_powershell_wrapper.readPowerShellScript(stripped) : undefined;
  if (powerShellScript !== undefined)
    budget.charge("derivedTokens", stripped.length);
  const powerShellTargets = powerShellScript === undefined ? null : walkShellText(powerShellScript, store, options, environment, cwd, budget, true);
  if (powerShellTargets?.length)
    return [...assignmentValues, ...powerShellTargets];
  if (command === "export") {
    return [
      ...assignmentValues,
      ...post.flatMap((token) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(token) ? [token.slice(token.indexOf("=") + 1)] : extractOperandPathCandidates(command, token)).map(here)
    ];
  }
  if (command === "git") {
    return [...assignmentValues, ...extractGitOperandPathTargets(post).map(here)];
  }
  if (command === "gh") {
    return [
      ...assignmentValues,
      ...extractTextFlagOperandCandidates(command, post, GH_TEXT_FLAGS).map(here)
    ];
  }
  if (JQ_COMMANDS.has(command)) {
    return [...assignmentValues, ...extractJqPathTargets(post).map(here)];
  }
  if (PATTERN_FIRST_COMMANDS.has(command)) {
    return [...assignmentValues, ...extractPatternCommandTargets(post).map(here)];
  }
  if (PATH_ROOT_COMMANDS.has(command)) {
    return [
      ...assignmentValues,
      ...extractFindCommandTargets(post, store, options, environment, cwd, budget).map(here)
    ];
  }
  if (command === "mkdir" || command === "touch") {
    const redirectionTargets = new Set(tokens.filter((_, index) => shellWords?.has(index)));
    const createsOperands = options.segmentMayFeedReader !== true && !(command === "touch" && post.some((token) => /^(?:--r|-[^-]*r)/.test(token)));
    return [
      ...assignmentValues,
      ...post.flatMap((token) => extractOperandPathCandidates(command, token).map((target) => createsOperands && !token.startsWith("-") && !redirectionTargets.has(token) ? { ...here(target), isCreatedPath: true } : here(target)))
    ];
  }
  if (import_constants.AWK_INTERPRETERS.has(command)) {
    return [
      ...assignmentValues,
      ...post.flatMap((token) => extractOperandPathCandidates("awk", token)).map(here),
      ...post.flatMap((token) => extractAwkSystemCommandTargets(token, store, options, environment, cwd, budget)),
      ...post.flatMap(extractAwkGetlineRedirectTargets).map(here)
    ];
  }
  if (command === "curl") {
    return [
      ...assignmentValues,
      ...post.filter((token, index) => attachedCurlUploadOperand(token) === null && curlOperandUploadFlag(post[index - 1]) === null).flatMap((token) => extractOperandPathCandidates(command, token)).map(here),
      ...extractCurlUploadPathTargets(post).map(here)
    ];
  }
  if (isCodeInterpreter(command)) {
    const shellArgv = SHELL_STDIN_INTERPRETERS.has(command) ? import_tokens5.parseShellArgv([command, ...post]) : null;
    if (shellArgv !== null && shellArgv.command !== null && shellArgv.commandIndex !== null) {
      const syntax = store.getShellSyntax(shellArgv.command);
      if (syntax.status === "structural-limit")
        throw new StructuralShellSyntaxLimitError;
      if (syntax.status === "complete") {
        return [
          ...assignmentValues,
          ...extractCommandPathTargets(syntax, store, options, environment, cwd, budget),
          ...post.slice(shellArgv.commandIndex).filter((token) => !token.startsWith("-")).map(here)
        ];
      }
    }
    return [
      ...assignmentValues,
      ...extractInterpreterPathTargets(command, post, store, options, environment, cwd, budget)
    ];
  }
  const optionValue = (option, index) => new RegExp(`^--?${option}=`).test(post[index] ?? "") || new RegExp(`^--?${option}$`).test(post[index - 1] ?? "");
  const writesTailscaleCertFiles = runsTailscaleCert(stripped);
  const readsOnlyCertificate = command === "openssl" && post[0] === "x509";
  const certificateOutput = outputMayFeedReader ? { certificateOutputMayFeedReader: true } : {};
  return [
    ...assignmentValues,
    ...post.flatMap((token, index) => extractOperandPathCandidates(command, token).map((target) => writesTailscaleCertFiles && optionValue("(?:cert|key)-file", index) ? { ...here(target), isCreatedPath: true, ...certificateOutput } : readsOnlyCertificate && optionValue("in", index) ? { ...here(target), isCertificateInput: true, ...certificateOutput } : here(target)))
  ];
}
function withoutTimeout(argv) {
  return basename2(argv[0] ?? "").toLowerCase() === "timeout" ? argv.slice(2) : argv;
}
function runsTailscaleCert(argv) {
  const program = withoutTimeout(argv);
  return basename2(program[0] ?? "").toLowerCase() === "tailscale" && program[1] === "cert";
}
function extractSafetyNetExplainPathTargets(executable, command, tokens) {
  const prefixLength = safetyNetSubcommandIndex(command, tokens);
  if (prefixLength === null || tokens[prefixLength] !== "explain")
    return null;
  const targets = [executable, ...tokens.slice(0, prefixLength)];
  const args = tokens.slice(prefixLength + 1);
  for (let index = 0;index < args.length; index++) {
    const arg = args[index];
    if (arg === "--json" || arg === "--help" || arg === "-h")
      continue;
    if (arg === "--cwd") {
      const cwd = args[index + 1];
      if (cwd && !cwd.startsWith("--"))
        targets.push(cwd);
      index++;
      continue;
    }
    return targets;
  }
  return targets;
}
function extractPipeCarrierPathTargets(producer, consumer, store, options, environment, cwd, budget) {
  if (xargsReadsPipeInputAsPath(consumer, store, options, environment, cwd, budget)) {
    const stripped = stripLeadingWrappersAndEnvAssignments(producer);
    const namesListedByMetadataProducer = isMetadataOnlyArgv(basename2(stripped[0] ?? "").toLowerCase(), stripped.slice(1)) ? stripped.slice(1).filter((token) => !token.startsWith("-")) : [];
    return [...extractDisplayCommandOperands(producer), ...namesListedByMetadataProducer].map((target) => ({ target, cwd }));
  }
  return extractStdinScriptPathTargets(consumer, extractDisplayCommandBodies(producer), store, options, environment, cwd, budget, () => []);
}
function rewalkInterpreterHeredocAsShell(consumer, body, store, options, environment, cwd, budget) {
  const stripped = stripLeadingWrappersAndEnvAssignments(consumer);
  if (!isCodeInterpreter(basename2(stripped[0] ?? "").toLowerCase()))
    return [];
  return walkShellText(body, store, options, environment, cwd, budget) ?? [{ target: body, cwd }];
}
function extractStdinScriptPathTargets(consumer, bodies, store, options, environment, cwd, budget, rewalkNonScriptHeredocBody) {
  const interpreter = getStdinScriptInterpreter(consumer);
  if (interpreter === null)
    return bodies.flatMap(rewalkNonScriptHeredocBody);
  return bodies.flatMap((body) => SHELL_STDIN_INTERPRETERS.has(interpreter) ? extractCommandPathTargets(store.getShellSyntax(body), store, options, environment, cwd, budget) : extractInlineCodePathTargets(interpreter, body, store, options, environment, cwd, budget));
}
function extractDisplayCommandOperands(tokens) {
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0)
    return [];
  const command = basename2(stripped[0] ?? "").toLowerCase();
  if (!NON_PATH_OPERAND_COMMANDS.has(command))
    return [];
  const format = stripped[stripped[1] === "--" ? 2 : 1];
  if (command === "printf" && format !== undefined && !format.startsWith("-") && !format.replaceAll("%%", "").includes("%")) {
    return [decodePrintfEscapes(format.replaceAll("%%", "%"))];
  }
  return stripped.slice(1);
}
function extractDisplayCommandBodies(tokens) {
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0)
    return [];
  const command = basename2(stripped[0] ?? "").toLowerCase();
  const args = stripped.slice(1);
  if (command === "echo") {
    const optionEnd = args.findIndex((token) => !/^-[neE]+$/.test(token));
    return [(optionEnd === -1 ? [] : args.slice(optionEnd)).join(" ")];
  }
  if (command === "printf") {
    return extractPrintfDisplayBodies(args);
  }
  return [];
}
function extractPrintfDisplayBodies(tokens) {
  const format = tokens[0];
  if (format === undefined) {
    return [];
  }
  const valuesPerFormat = (format.match(/%%|%[bqs]/g) ?? []).filter((specifier) => specifier !== "%%").length;
  if (valuesPerFormat === 0 || tokens.length === 1) {
    return [decodePrintfEscapes(format)];
  }
  const values = tokens.slice(1);
  return Array.from({ length: Math.ceil(values.length / valuesPerFormat) }, (_, index) => applyPrintfStringArguments(format, values.slice(index * valuesPerFormat, (index + 1) * valuesPerFormat)));
}
function applyPrintfStringArguments(format, values) {
  let valueIndex = 0;
  return decodePrintfEscapes(format.replace(/%%|%[bqs]/g, (specifier) => {
    if (specifier === "%%") {
      return "%";
    }
    const value = values[valueIndex] ?? "";
    valueIndex++;
    return value;
  }));
}
function decodePrintfEscapes(value) {
  return value.replace(/\\n/g, `
`).replace(/\\t/g, "\t").replace(/\\r/g, "\r");
}
function xargsReadsPipeInputAsPath(tokens, store, options, environment, cwd, budget) {
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0 || basename2(stripped[0] ?? "").toLowerCase() !== "xargs") {
    return false;
  }
  const xargs = import_xargs.extractXargsChildCommandWithInfo(stripped);
  const xargsChildTokens = stripped.slice(xargs.childStart);
  if (xargsChildTokens.length === 0) {
    return false;
  }
  if (xargs.replacementToken === "") {
    return false;
  }
  const replacementToken = xargs.replacementToken;
  const childTokens = replacementToken === null ? [...xargsChildTokens, PIPE_INPUT_PATH_MARKER] : xargsChildTokens.map((token) => token.split(replacementToken).join(PIPE_INPUT_PATH_MARKER));
  return extractSegmentPathTargets(childTokens, store, options, environment, cwd, budget).some((candidate) => candidate.target.includes(PIPE_INPUT_PATH_MARKER));
}
function getStdinScriptInterpreter(tokens) {
  const stripped = stripLeadingWrappersAndEnvAssignments(tokens);
  if (stripped.length === 0)
    return null;
  const command = basename2(stripped[0] ?? "").toLowerCase();
  if (!isCodeInterpreter(command))
    return null;
  return interpreterReadsStdinScript(command, stripped.slice(1)) ? command : null;
}
function interpreterReadsStdinScript(command, tokens) {
  const normalizedCommand = normalizeInterpreterName(command);
  for (let i = 0;i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined)
      break;
    if (CODE_EVAL_FLAGS.has(token) || isClusteredCodeEvalFlag(command, token) || /^--(?:eval|exec)=/.test(token)) {
      return false;
    }
    if (token === "-") {
      return true;
    }
    if (token.startsWith("-")) {
      if (normalizedCommand === "python" && token === "-m")
        return false;
      if (VALUE_CONSUMING_INTERPRETER_FLAGS.get(normalizedCommand)?.has(token))
        i++;
      continue;
    }
    return false;
  }
  return true;
}
function normalizeInterpreterName(command) {
  return /^python\d/.test(command) ? "python" : command;
}
function extractLeadingAssignmentValues(tokens) {
  const values = [];
  for (const token of tokens) {
    if (isWrapperToken(token)) {
      continue;
    }
    const assignment = /^[A-Za-z_][A-Za-z0-9_]*=(.*)$/.exec(token);
    if (assignment === null) {
      break;
    }
    if (assignment[1] !== undefined && assignment[1] !== "") {
      values.push(assignment[1]);
    }
  }
  return values;
}
var POWERSHELL_HOME_PREFIX = /^(?:\$\{home\}|\$\{env:(?:userprofile|home)\}|~)(?=[\\/])/i;
function rewritePowerShellHomePrefix(token, powershell) {
  if (!powershell || !POWERSHELL_HOME_PREFIX.test(token))
    return token;
  return `~${token.replace(POWERSHELL_HOME_PREFIX, "").replace(/\\/g, "/")}`;
}
function extractOperandPathCandidates(command, token) {
  if (token === "--")
    return [];
  const candidates = [];
  const equals = token.indexOf("=");
  if (equals > 0 && equals < token.length - 1 && !token.slice(0, equals).includes("?")) {
    candidates.push(token.slice(equals + 1));
  }
  if (token.startsWith("-"))
    return candidates;
  if (command === "tar" && /\.(?:tar|tgz|tar\.gz|zip)$/i.test(token))
    return candidates;
  if (command === "zip" && /\.zip$/i.test(token))
    return candidates;
  candidates.push(token);
  return candidates;
}
function extractJqPathTargets(tokens) {
  let programIndex = -1;
  let afterDashDash = false;
  for (let index = 0;index < tokens.length; index++) {
    const token = tokens[index] ?? "";
    if (!afterDashDash && token === "--") {
      afterDashDash = true;
      continue;
    }
    if (afterDashDash || !/^-(?:[A-Za-z]|-)/.test(token)) {
      if (programIndex === -1)
        programIndex = index;
      continue;
    }
    if (/^--(?:arg|argjson|argfile|rawfile|slurpfile)$/.test(token)) {
      index += 2;
      continue;
    }
    if (token === "--indent" || token === "-L") {
      index++;
      continue;
    }
    if (token.startsWith("-L"))
      continue;
    if (/^-[srjcCMaSRnbehV]+$/.test(token) || /^--(?:slurp|raw-output0?|join-output|compact-output|color-output|monochrome-output|ascii-output|unbuffered|sort-keys|raw-input|null-input|binary|tab|seq|stream|stream-errors|exit-status|args|jsonargs|help|version|build-configuration)$/.test(token)) {
      continue;
    }
    return tokens.flatMap((arg) => extractOperandPathCandidates("jq", arg));
  }
  return tokens.flatMap((token, index) => index === programIndex ? [] : extractOperandPathCandidates("jq", token));
}
function extractGitOperandPathTargets(tokens) {
  const targets = [];
  for (let index = 0;index < tokens.length; index++) {
    const token = tokens[index] ?? "";
    if (token === "--" || !token.startsWith("-")) {
      return [
        ...targets,
        ...GIT_MESSAGE_SUBCOMMANDS.has(token) ? extractTextFlagOperandCandidates("git", tokens.slice(index).map((arg) => /^-[aeinopqsv]+m$/.test(arg) ? "-m" : arg), GIT_MESSAGE_FLAGS) : extractTextFlagOperandCandidates("git", tokens.slice(index), GIT_GREP_FLAGS)
      ];
    }
    targets.push(...extractOperandPathCandidates("git", token));
    if (!import_constants.GIT_GLOBAL_OPTS_WITH_VALUE.has(token))
      continue;
    const value = tokens[index + 1];
    if (value === undefined)
      break;
    targets.push(...token === "-c" && value.includes("=") ? [value.slice(value.indexOf("=") + 1)] : extractOperandPathCandidates("git", value));
    index++;
  }
  return targets;
}
function extractTextFlagOperandCandidates(command, tokens, textFlags) {
  const candidates = [];
  for (let index = 0;index < tokens.length; index++) {
    const token = tokens[index] ?? "";
    if (token === "--") {
      return [
        ...candidates,
        ...tokens.slice(index).flatMap((arg) => extractOperandPathCandidates(command, arg))
      ];
    }
    if (textFlags.has(token)) {
      index++;
      continue;
    }
    if (token.includes("=") && textFlags.has(token.slice(0, token.indexOf("="))))
      continue;
    candidates.push(...extractOperandPathCandidates(command, token));
  }
  return candidates;
}
function extractCurlUploadPathTargets(tokens) {
  return tokens.flatMap((token, index) => {
    const attached = attachedCurlUploadOperand(token);
    if (attached !== null)
      return curlUploadOperandPaths(attached.flag, attached.value);
    const flag = curlOperandUploadFlag(tokens[index - 1]);
    return flag === null ? [] : curlUploadOperandPaths(flag, token);
  });
}
function curlUploadOperandPaths(flag, value) {
  if (flag === "-F" || flag === "--form") {
    const equals = value.indexOf("=");
    const part = equals === -1 ? value : value.slice(equals + 1);
    if (!part.startsWith("@") && !part.startsWith("<"))
      return [];
    return curlUploadPath(part.slice(1).split(";")[0] ?? "");
  }
  if (flag === "--data-urlencode") {
    const at = value.indexOf("@");
    const equals = value.indexOf("=");
    if (at === -1 || equals !== -1 && equals < at)
      return [];
    return curlUploadPath(value.slice(at + 1));
  }
  return value.startsWith("@") ? curlUploadPath(value.slice(1)) : [];
}
function curlOperandUploadFlag(token) {
  if (token === undefined)
    return null;
  if (CURL_UPLOAD_FLAGS.has(token))
    return token;
  return /^-[A-Za-z]+[dF]$/.test(token) ? `-${token.slice(-1)}` : null;
}
function attachedCurlUploadOperand(token) {
  const short = token.slice(0, 2);
  if (token.length > 2 && (short === "-d" || short === "-F")) {
    return { flag: short, value: token.slice(2) };
  }
  const equals = token.indexOf("=");
  if (equals === -1)
    return null;
  const flag = token.slice(0, equals);
  return CURL_UPLOAD_FLAGS.has(flag) ? { flag, value: token.slice(equals + 1) } : null;
}
function curlUploadPath(path) {
  return path === "" || path === "-" ? [] : [path];
}
function extractFindCommandTargets(tokens, store, options, environment, cwd, budget) {
  const expressionIndex = tokens.findIndex((token) => token.startsWith("-") || token === "(" || token === "!" || token === ";");
  const targets = [
    ...tokens.slice(0, expressionIndex === -1 ? tokens.length : expressionIndex),
    ...tokens.flatMap((token, index) => token === "-files0-from" && tokens[index + 1] !== undefined ? [tokens[index + 1] ?? ""] : [])
  ];
  for (let i = 0;i < tokens.length; i++) {
    if (!FIND_EXEC_PRIMARIES.has(tokens[i] ?? ""))
      continue;
    const execTokens = tokens.slice(i + 1);
    const terminatorIndex = execTokens.findIndex((token) => FIND_EXEC_TERMINATORS.has(token));
    const execCommand = terminatorIndex === -1 ? execTokens : execTokens.slice(0, terminatorIndex);
    const execTargets = extractSegmentPathTargets(execCommand, store, options, environment, cwd, budget).map((candidate) => candidate.target);
    targets.push(...execTargets.filter((target) => target !== "{}"));
    if (!execTargets.includes("{}"))
      continue;
    targets.push(...tokens.slice(0, i).flatMap((token, index, expression) => {
      if (!FIND_MATCH_PATH_PRIMARIES.has(token))
        return [];
      const value = expression[index + 1];
      return value === undefined ? [] : [
        value,
        value.replace(/^\*+\//, "").replace(/\/\*+$/g, "").replace(/^\*+/, "").replace(/\*+$/g, "")
      ];
    }));
  }
  return targets;
}
function extractInterpreterPathTargets(command, tokens, store, options, environment, cwd, budget) {
  const candidates = [];
  for (let i = 0;i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined)
      break;
    if (CODE_EVAL_FLAGS.has(token) || isClusteredCodeEvalFlag(command, token)) {
      const code = tokens[i + 1];
      if (code !== undefined) {
        candidates.push(...extractInlineCodePathTargets(command, code, store, options, environment, cwd, budget));
        i++;
      }
      continue;
    }
    const inlineEval = /^--(?:eval|exec)=(.*)$/.exec(token);
    if (inlineEval !== null && inlineEval[1] !== undefined) {
      candidates.push(...extractInlineCodePathTargets(command, inlineEval[1], store, options, environment, cwd, budget));
      continue;
    }
    if (!token.startsWith("-")) {
      candidates.push({ target: token, cwd });
    }
  }
  return candidates;
}
function isClusteredCodeEvalFlag(command, token) {
  if (!token.startsWith("-") || token.startsWith("--") || token.length <= 2)
    return false;
  return INTERPRETERS_BY_CLUSTERED_CODE_EVAL_FLAG.get(token[token.length - 1] ?? "")?.has(normalizeInterpreterName(command)) ?? false;
}
function extractAwkSystemCommandTargets(code, store, options, environment, cwd, budget) {
  if (!code.includes("system"))
    return [];
  return import_awk.extractAwkSystemCommands(code)?.commands.flatMap((command) => extractCommandPathTargets(store.getShellSyntax(command), store, options, environment, cwd, budget)) ?? [];
}
function extractAwkGetlineRedirectTargets(code) {
  return Array.from(code.matchAll(/\bgetline(?:\s+[A-Za-z_][A-Za-z0-9_]*)?\s*<\s*"((?:\\.|[^"\\])*)"/g)).map((match) => match[1]).filter((value) => value !== undefined && value !== "");
}
function extractAllPathCandidatesUnmasked(code) {
  const quoted = Array.from(code.matchAll(/(['"`])((?:\\.|(?!\1).)*)\1/g)).map((match) => match[2]).filter((value) => value !== undefined && value !== "");
  return [
    ...quoted,
    ...quoted.flatMap(decodeBase64PathCandidate),
    ...code.match(BARE_PATH_PATTERN) ?? []
  ];
}
function extractInlineCodePathTargets(command, code, store, options, environment, cwd, budget) {
  const here = (target) => ({ target, cwd });
  const family = literalFamily(command);
  const masked = maskStringLiterals(code, family);
  if (masked.kind === "unmaskable")
    return extractAllPathCandidatesUnmasked(code).map(here);
  const shellExec = masked.masked.match(SHELL_EXEC_CALL) !== null || masked.literals.some((literal) => SHELL_EXEC_PREFIX.test(masked.masked.slice(0, literal.start)));
  const languageEval = masked.masked.match(LANGUAGE_EVAL_CALL) !== null || masked.literals.some((literal) => LANGUAGE_EVAL_PREFIX.test(masked.masked.slice(0, literal.start)));
  const literalsPresumedData = options.inlineLiteralsPresumedData === true && !SHELL_STDIN_INTERPRETERS.has(command);
  const codeRolesReadable = literalsPresumedData && (family === "python" || family === "javascript");
  const literals = literalsPresumedData && !(containsRecognizableInlineAccess(masked.masked) || shellExec || languageEval) ? [] : masked.literals;
  const execCalls = literalsPresumedData ? Array.from(masked.masked.matchAll(SHELL_EXEC_CALL), (call) => {
    const start = call.index + call[0].length;
    return { start, end: import_interpreters.closingParenthesis(masked.masked, start) };
  }) : [];
  const literalsExecCallsReceive = !literalsPresumedData || execCalls.some((call) => import_interpreters.firstArgumentHasName(masked.masked, call.start) && !runsArgvWithoutCodeFlag(masked, call.start)) ? masked.literals : masked.literals.filter((literal) => SHELL_EXEC_PREFIX.test(masked.masked.slice(0, literal.start)) || execCalls.some((call) => literal.start >= call.start && literal.start < call.end));
  const literalsWalkedAsShell = new Set(shellExec ? literalsExecCallsReceive : []);
  const literalRolesReadable = codeRolesReadable && literals.length > 0 && !holdsUnreadableLiteralRoles(masked.masked, family === "python" ? "#" : "//");
  const openers = literalRolesReadable ? innermostOpeners(masked.masked) : [];
  const sequencesMayHoldArguments = literalRolesReadable && namesCommandExecution(masked.masked);
  return [
    ...literals.filter((literal) => literal.text !== "").map((literal) => {
      if (!literalRolesReadable || literalsWalkedAsShell.has(literal))
        return here(literal.text);
      if (inDataPosition(masked.masked, literal, openers, sequencesMayHoldArguments)) {
        return { ...here(literal.text), literalRole: "data" };
      }
      return feedsOnlyWrite(masked, literal, openers) ? { ...here(literal.text), literalRole: "write" } : here(literal.text);
    }),
    ...literals.flatMap((literal) => decodeBase64PathCandidate(literal.text)).map(here),
    ...literalsPresumedData ? [] : masked.literals.flatMap((literal) => literal.text.match(BARE_PATH_PATTERN) ?? []).map(here),
    ...shellExec ? literalsExecCallsReceive.flatMap((literal) => walkShellText(literal.text, store, { ...options, commandHoldsPipe: true }, environment, cwd, budget) ?? [here(literal.text)]) : [],
    ...languageEval ? masked.literals.flatMap((literal) => extractInlineCodePathTargets(command, literal.text.replace(/\\(.)/g, (_, escaped) => escaped === "n" ? `
` : escaped), store, options, environment, cwd, budget)) : [],
    ...codeRolesReadable ? [] : (masked.masked.match(BARE_PATH_PATTERN) ?? []).map(here),
    ...literalsPresumedData ? (code.match(/\$\{[^}]*\}|\$[A-Za-z_]\w*/g) ?? []).map(here) : []
  ];
}
var BRACKET_CLOSERS = { "(": ")", "[": "]", "{": "}" };
var GROUPING_KEYWORDS = "and|elif|else|if|in|is|not|of|or|return|while|yield";
var GROUPING_KEYWORD = new RegExp(`(?:^|[^\\w$])(?:${GROUPING_KEYWORDS})$`);
var UNREADABLE_LITERAL_ROLE_SHAPE = new RegExp(`(?:\\*|\\.\\.\\.)\\s*[([{]|\\.\\s*(?:${GROUPING_KEYWORDS})\\s*\\(|/\\*`);
var COMMAND_EXECUTION_IDENTIFIER_PART = /^(?:exec|spawn)|^(?:popen|system|subprocess)$/;
function holdsUnreadableLiteralRoles(masked, commentOpener) {
  return UNREADABLE_LITERAL_ROLE_SHAPE.test(masked) || masked.split(`
`).some((line) => {
    const comment = line.indexOf(commentOpener);
    return comment >= 0 && /[()[\]{}]/.test(line.slice(comment));
  });
}
function namesCommandExecution(masked) {
  return Array.from(masked.matchAll(/[A-Za-z_$][\w$]*/g), (match) => identifierParts(match[0])).some((parts) => parts.some((part) => COMMAND_EXECUTION_IDENTIFIER_PART.test(part)));
}
var WINDOWS_SHELLS = new Set(["cmd", "powershell", "pwsh"]);
function runsArgvWithoutCodeFlag(masked, start) {
  const opener = nextNonWhitespaceIndex(masked.masked, start);
  const closer = BRACKET_CLOSERS[masked.masked[opener] ?? ""];
  if (closer === undefined || closer === "}")
    return false;
  const end = masked.masked.indexOf(closer, opener + 1);
  const elements = masked.masked.slice(opener + 1, end);
  return end !== -1 && /^\s*,[\w\s,]*$/.test(elements) && /^[,)]/.test(masked.masked.slice(nextNonWhitespaceIndex(masked.masked, end + 1))) && !masked.literals.some((literal) => literal.tokenStart > opener && literal.tokenStart < end && (CODE_EVAL_FLAGS.has(literal.text) || isCodeInterpreter(basename2(literal.text).toLowerCase()) || WINDOWS_SHELLS.has(basename2(literal.text).toLowerCase().replace(/\.exe$/, ""))));
}
function innermostOpeners(masked) {
  const open = [];
  return masked.split("").map((char, index) => {
    const innermost = open.at(-1) ?? -1;
    if (char in BRACKET_CLOSERS)
      open.push(index);
    if (char === ")" || char === "]" || char === "}")
      open.pop();
    return innermost;
  });
}
function inDataPosition(masked, literal, openers, sequencesMayHoldArguments) {
  const opener = openers[literal.tokenStart] ?? -1;
  const bracket = masked[opener] ?? "";
  const before = previousNonWhitespaceIndex(masked, literal.tokenStart);
  const after = nextNonWhitespaceIndex(masked, literal.tokenEnd);
  if (/(?:^|[^\w$])in$|[=!]=$/.test(masked.slice(Math.max(0, before - 3), before + 1))) {
    return true;
  }
  if (/^(?:(?:not\s+)?in(?![\w$])|[=!]=)/.test(masked.slice(after, after + 8)))
    return true;
  if (sequencesMayHoldArguments && (bracket === "[" || bracket === "("))
    return false;
  const previous = masked[before];
  const next = masked[after];
  if (bracket === "{" && previous === ":")
    return startsObjectEntry(masked, before);
  const element = (previous === bracket || previous === ",") && (next === "," || next === BRACKET_CLOSERS[bracket] || bracket === "{" && next === ":");
  if (bracket !== "(")
    return element && bracket !== "";
  return element && (previous === "," || next === ",") && isGroupingParenthesis(masked, opener);
}
var PATH_CONSTRUCTOR_CALL = /(?:^|[^\w$.])(?:pathlib\s*\.\s*)?Path\s*$/;
var PATH_WRITE_METHOD = /^\s*\.\s*write_(?:text|bytes)\s*\(/;
var BARE_OPEN_CALL = /(?:^|[^\w$.])open\s*$/;
var WRITE_ONLY_OPEN_MODE = /^[bt]*[awx][abtwx]*$/;
var WRITE_FIRST_ARGUMENT_CALL = /(?:^|[^\w$])(?:writeFile|writeFileSync|appendFile|appendFileSync|Bun\s*\.\s*write)\s*$/;
function feedsOnlyWrite(masked, literal, openers) {
  const opener = openers[literal.tokenStart] ?? -1;
  if (masked.masked[opener] !== "(")
    return false;
  const previous = previousNonWhitespaceIndex(masked.masked, literal.tokenStart);
  const after = nextNonWhitespaceIndex(masked.masked, literal.tokenEnd);
  const next = masked.masked[after];
  const callee = masked.masked.slice(Math.max(0, opener - 40), opener);
  if (PATH_CONSTRUCTOR_CALL.test(callee)) {
    return (previous === opener || masked.masked[previous] === ",") && (next === "," || next === ")") && !masked.literals.some((other) => other.tokenStart > opener && other.tokenStart < literal.tokenStart) && PATH_WRITE_METHOD.test(masked.masked.slice(import_interpreters.closingParenthesis(masked.masked, opener + 1) + 1));
  }
  if (previous !== opener || next !== ",")
    return false;
  if (WRITE_FIRST_ARGUMENT_CALL.test(callee))
    return true;
  if (!BARE_OPEN_CALL.test(callee))
    return false;
  const mode = masked.literals.find((candidate) => /^,\s*(?:mode\s*=\s*)?$/.test(masked.masked.slice(after, candidate.tokenStart)));
  return mode !== undefined && WRITE_ONLY_OPEN_MODE.test(mode.text) && /^[,)]/.test(masked.masked.slice(nextNonWhitespaceIndex(masked.masked, mode.tokenEnd)));
}
function startsObjectEntry(masked, colon) {
  const keyEnd = previousNonWhitespaceIndex(masked, colon);
  const key = /[\w$]*$/.exec(masked.slice(Math.max(0, keyEnd - 63), keyEnd + 1))?.[0] ?? "";
  const entryStart = masked[previousNonWhitespaceIndex(masked, keyEnd + 1 - key.length)];
  return entryStart === "{" || entryStart === ",";
}
function isGroupingParenthesis(masked, opener) {
  const before = previousNonWhitespaceIndex(masked, opener);
  const preceding = masked.slice(Math.max(0, before - 7), before + 1);
  return !/[\w$)\]]$/.test(preceding) || GROUPING_KEYWORD.test(preceding);
}
function literalFamily(command) {
  const normalized = normalizeInterpreterName(command);
  if (normalized === "python")
    return "python";
  if (normalized === "osascript")
    return "opaque";
  return normalized === "node" || normalized === "bun" || normalized === "deno" ? "javascript" : "simple";
}
var HOLE_UNREADABLE_CHARACTER = {
  python: "#",
  javascript: "/"
};
function maskStringLiterals(code, family) {
  if (family === "opaque")
    return { kind: "unmaskable" };
  const scan = { masked: code.split(""), literals: [] };
  return maskCode(code, 0, family, scan, false) === null ? { kind: "unmaskable" } : { kind: "masked", masked: scan.masked.join(""), literals: scan.literals };
}
function maskCode(code, from, family, scan, insideHole) {
  let openBraces = 0;
  for (let index = from;index < code.length; index++) {
    const char = code[index] ?? "";
    if (insideHole && char === "}" && openBraces === 0)
      return index;
    if (insideHole && char === HOLE_UNREADABLE_CHARACTER[family])
      return null;
    if (char === "{")
      openBraces++;
    if (char === "}")
      openBraces--;
    if (family === "simple" && (char === "`" || char === "%" || char === "<")) {
      if (UNMASKABLE_SIMPLE_CODE.test(code.slice(index)))
        return null;
    }
    const quote = char === "'" || char === '"' || family === "javascript" && char === "`" ? char : null;
    if (quote === null)
      continue;
    if (quote === "`" && isTaggedTemplate(code, index))
      return null;
    const prefix = family === "python" ? pythonStringPrefix(code, index) : "";
    const delimiter = family === "python" && code.startsWith(quote.repeat(3), index) ? quote.repeat(3) : quote;
    const start = index + delimiter.length;
    const interpolated = quote === "`" || /[fF]/.test(prefix);
    const tokenStart = index - prefix.length;
    const end = interpolated ? maskInterpolatedLiteral(code, tokenStart, start, delimiter, family, scan) : findLiteralEnd(code, start, delimiter);
    if (end === null)
      return null;
    if (!interpolated) {
      const text = code.slice(start, end);
      if (family === "simple" && quote === '"' && SIMPLE_INTERPOLATION.test(text))
        return null;
      scan.literals.push({ start, text, tokenStart, tokenEnd: end + delimiter.length });
      scan.masked.fill(" ", start, end);
    }
    scan.masked.fill(" ", index, start);
    scan.masked.fill(" ", end, end + delimiter.length);
    index = end + delimiter.length - 1;
  }
  return insideHole ? null : code.length;
}
function maskInterpolatedLiteral(code, tokenStart, start, delimiter, family, scan) {
  const holeOpener = family === "python" ? "{" : "${";
  const multiline = delimiter === "`" || delimiter.length === 3;
  let text = "";
  for (let cursor = start;cursor < code.length; cursor++) {
    const char = code[cursor] ?? "";
    if (code.startsWith(delimiter, cursor)) {
      scan.literals.push({ start, text, tokenStart, tokenEnd: cursor + delimiter.length });
      return cursor;
    }
    if (!multiline && (char === `
` || char === "\r"))
      return null;
    const pythonDoubledBrace = family === "python" && (char === "{" || char === "}") && code[cursor + 1] === char;
    if (!pythonDoubledBrace && code.startsWith(holeOpener, cursor)) {
      const holeEnd = maskCode(code, cursor + holeOpener.length, family, scan, true);
      if (holeEnd === null)
        return null;
      text += `${holeOpener}}`;
      scan.masked.fill(" ", cursor, cursor + holeOpener.length);
      scan.masked[holeEnd] = " ";
      cursor = holeEnd;
      continue;
    }
    const escapesNext = char === "\\" && !(family === "python" && code[cursor + 1] === "{");
    const width = escapesNext || pythonDoubledBrace ? 2 : 1;
    text += code.slice(cursor, cursor + width);
    scan.masked.fill(" ", cursor, cursor + width);
    cursor += width - 1;
  }
  return null;
}
function pythonStringPrefix(code, index) {
  return PYTHON_STRING_PREFIX.exec(code.slice(Math.max(0, index - 3), index))?.[1] ?? "";
}
function findLiteralEnd(code, start, delimiter) {
  const multiline = delimiter.length === 3;
  for (let cursor = start;cursor < code.length; cursor++) {
    const char = code[cursor];
    if (char === "\\") {
      cursor++;
      continue;
    }
    if (!multiline && (char === `
` || char === "\r"))
      return null;
    if (code.startsWith(delimiter, cursor))
      return cursor;
  }
  return null;
}
function isTaggedTemplate(code, index) {
  for (let cursor = index - 1;cursor >= 0; cursor--) {
    const char = code[cursor];
    if (!char || /\s/.test(char))
      continue;
    return /[\w$\])]/.test(char);
  }
  return false;
}
function containsRecognizableInlineAccess(code) {
  for (const match of code.matchAll(/[A-Za-z_$][A-Za-z0-9_$]*/g)) {
    const identifier = match[0];
    const start = match.index;
    if (INLINE_ACCESS_NAMESPACES.has(identifier.toLowerCase()))
      return true;
    const parts = identifierParts(identifier);
    if (!parts.some((part) => INLINE_ACCESS_IDENTIFIER_PARTS.has(part)))
      continue;
    if (parts.length > 1)
      return true;
    if (code[previousNonWhitespaceIndex(code, start)] === ".")
      return true;
    if (code[nextNonWhitespaceIndex(code, start + identifier.length)] === "(")
      return true;
  }
  return false;
}
function identifierParts(identifier) {
  return identifier.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(/[_$\s]+/).map((part) => part.toLowerCase());
}
function previousNonWhitespaceIndex(value, start) {
  for (let index = start - 1;index >= 0; index--) {
    if (!/\s/.test(value[index] ?? ""))
      return index;
  }
  return -1;
}
function nextNonWhitespaceIndex(value, start) {
  for (let index = start;index < value.length; index++) {
    if (!/\s/.test(value[index] ?? ""))
      return index;
  }
  return value.length;
}
function extractCommandSubstitutionPathTargets(command, store, options, environment, cwd, budget) {
  return extractCommandSubstitutionBodies(command).flatMap((body) => {
    const syntax = store.getShellSyntax(body);
    if (syntax.status === "invalid")
      return [];
    return [
      ...extractCommandPathTargets(syntax, store, { ...options, displayOperandsAreCapturedOutput: true }, environment, cwd, budget),
      ...commandSubstitutionDecodesBase64(syntax, environment) ? extractBase64DecodedPathCandidates(syntax, environment).map((target) => ({ target, cwd })) : []
    ];
  });
}
function commandSubstitutionDecodesBase64(syntax, environment) {
  const tokens = readGuardTokens(syntax);
  for (let i = 0;i < tokens.length; i++) {
    const token = tokens[i];
    if (token?.kind !== "word" || basename2(projectSensitiveShellText(token.text, environment)).toLowerCase() !== "base64") {
      continue;
    }
    for (let j = i + 1;j < tokens.length; j++) {
      const candidate = tokens[j];
      if (candidate?.kind === "operator")
        break;
      if (candidate?.kind !== "word")
        continue;
      const flag = projectSensitiveShellText(candidate.text, environment);
      if (flag === "--decode" || !flag.startsWith("--") && flag.startsWith("-") && /[dD]/.test(flag)) {
        return true;
      }
    }
  }
  return false;
}
function extractBase64DecodedPathCandidates(syntax, environment) {
  return readGuardTokens(syntax).flatMap((token) => token.kind === "word" ? [projectSensitiveShellText(token.text, environment)] : token.kind === "redirection" && token.target ? [projectSensitiveShellText(token.target, environment)] : []).flatMap(decodeBase64PathCandidate);
}
function decodeBase64PathCandidate(token) {
  const normalized = normalizeBase64Token(token);
  if (normalized === null)
    return [];
  const decoded = Buffer.from(normalized, "base64").toString("utf8");
  if (decoded === "" || hasControlCharacter(decoded))
    return [];
  const canonical = Buffer.from(decoded, "utf8").toString("base64").replace(/=+$/g, "");
  return canonical === normalized.replace(/=+$/g, "") ? [decoded] : [];
}
function hasControlCharacter(value) {
  return Array.from(value).some((char) => {
    const code = char.charCodeAt(0);
    return code < 32 || code === 127;
  });
}
function normalizeBase64Token(token) {
  if (token.length < 8 || !/^[A-Za-z0-9+/_-]+={0,2}$/.test(token))
    return null;
  if (/=/.test(token.replace(/=+$/g, "")))
    return null;
  const unpadded = token.replace(/=+$/g, "");
  if (unpadded.length % 4 === 1)
    return null;
  return `${unpadded.replace(/-/g, "+").replace(/_/g, "/")}${"=".repeat((4 - unpadded.length % 4) % 4)}`;
}
function extractCommandSubstitutionBodies(command) {
  const bodies = [];
  const quoteState = { inSingle: false, inDouble: false, escaped: false };
  for (let i = 0;i < command.length; i++) {
    const char = command[i];
    if (!char)
      break;
    if (import_tokens5.advanceQuoteScanState(char, quoteState))
      continue;
    if (startsCommandSubstitution(command, i, quoteState)) {
      const substitution = readCommandSubstitutionBody(command, i + 1);
      if (substitution !== null) {
        bodies.push(substitution.body);
        i = substitution.endIndex;
      }
      continue;
    }
    if (!quoteState.inSingle && char === "`") {
      const substitution = readBacktickCommandSubstitutionBody(command, i);
      if (substitution !== null) {
        bodies.push(substitution.body);
        i = substitution.endIndex;
      }
    }
  }
  return bodies;
}
function readCommandSubstitutionBody(command, startIndex) {
  const quoteState = { inSingle: false, inDouble: false, escaped: false };
  let depth = 1;
  for (let i = startIndex + 1;i < command.length; i++) {
    const char = command[i];
    if (!char)
      break;
    if (import_tokens5.advanceQuoteScanState(char, quoteState))
      continue;
    if (startsCommandSubstitution(command, i, quoteState)) {
      depth++;
      i++;
      continue;
    }
    if (!quoteState.inSingle && !quoteState.inDouble && char === ")") {
      depth--;
      if (depth === 0) {
        return { body: command.slice(startIndex + 1, i), endIndex: i };
      }
    }
  }
  return null;
}
function readBacktickCommandSubstitutionBody(command, startIndex) {
  let escaped = false;
  for (let i = startIndex + 1;i < command.length; i++) {
    const char = command[i];
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
    if (char === "`") {
      return { body: command.slice(startIndex + 1, i), endIndex: i };
    }
  }
  return null;
}
function startsCommandSubstitution(command, index, state) {
  return !state.inSingle && command[index] === "$" && command[index + 1] === "(" && command[index + 2] !== "(";
}
function extractPatternCommandTargets(tokens) {
  const optionFileTargets = [];
  const positionals = [];
  let patternFromOption = false;
  let patternlessMode = false;
  let afterDashDash = false;
  for (let i = 0;i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined)
      break;
    if (!afterDashDash && token === "--") {
      afterDashDash = true;
      continue;
    }
    if (afterDashDash) {
      positionals.push(token);
      continue;
    }
    const longOption = /^--([^=]+)(?:=(.*))?$/.exec(token);
    if (longOption !== null) {
      const name = longOption[1] ?? "";
      const inlineValue = longOption[2];
      if (name === PATTERNLESS_FILES_LONG)
        patternlessMode = true;
      if (PATTERN_SUPPLY_LONG.has(name))
        patternFromOption = true;
      if (inlineValue !== undefined) {
        if (name === PATTERN_FILE_LONG)
          optionFileTargets.push(inlineValue);
        continue;
      }
      if (PATTERN_ARG_LONG.has(name)) {
        const next = tokens[i + 1];
        if (name === PATTERN_FILE_LONG && next !== undefined)
          optionFileTargets.push(next);
        i++;
      }
      continue;
    }
    if (token.startsWith("-") && token.length > 1) {
      const flags = token.slice(1);
      let consumerChar = "";
      let consumerInline = "";
      for (let j = 0;j < flags.length; j++) {
        const flag = flags[j] ?? "";
        if (PATTERN_SUPPLY_SHORT.has(flag))
          patternFromOption = true;
        if (PATTERN_ARG_SHORT.has(flag)) {
          consumerChar = flag;
          consumerInline = flags.slice(j + 1);
          break;
        }
      }
      if (consumerChar === "")
        continue;
      if (consumerInline.length > 0) {
        if (consumerChar === PATTERN_FILE_SHORT)
          optionFileTargets.push(consumerInline);
        continue;
      }
      const next = tokens[i + 1];
      if (consumerChar === PATTERN_FILE_SHORT && next !== undefined) {
        optionFileTargets.push(next);
      }
      i++;
      continue;
    }
    positionals.push(token);
  }
  const dropFirstPositional = !patternFromOption && !patternlessMode;
  const positionalFiles = dropFirstPositional ? positionals.slice(1) : positionals;
  return [...optionFileTargets, ...positionalFiles];
}
function stripLeadingWrappersAndEnvAssignments(tokens) {
  const firstCommandIndex = tokens.findIndex((token) => !isWrapperToken(token) && !/^[A-Za-z_][A-Za-z0-9_]*=.*/.test(token));
  return firstCommandIndex === -1 ? [] : tokens.slice(firstCommandIndex);
}
function isWrapperToken(token) {
  return token === "env" || token === "command" || token === "builtin" || token === "sudo";
}
var PUBLIC_KEY_BASENAMES = new Set(["id_rsa.pub", "id_ed25519.pub", "id_ecdsa.pub"]);
var ENV_PREFIX = ".env.";
var ENV_EXEMPTION_BASENAMES = new Set([
  ".env.example",
  ".env.sample",
  ".env.template",
  ".env.tpl",
  ".env.defaults"
]);
var ENV_EXEMPTION_PREFIXES = [".env.example.", ".env.sample."];
function isRemoteUrl(target) {
  let url;
  try {
    url = new URL(target.trim());
  } catch {
    return false;
  }
  return url.protocol !== "file:" && url.host !== "";
}
function isFilenameShaped(name) {
  return name.length > 0 && !/\s/.test(name);
}
function candidateExistsOnDisk(target, cwd, environment, budget) {
  const absolute = candidateAbsolutePath(target, cwd, environment, budget);
  return absolute !== "" && environment.paths.entryKind(absolute) !== "missing";
}
function candidateAbsolutePath(target, cwd, environment, budget) {
  try {
    return normalizeAbsoluteCandidatePath(target, cwd, environment, budget);
  } catch (error) {
    if (error instanceof import_budget.AnalysisLimit)
      throw error;
    return "";
  }
}
var QUERY_PARAMETER = /[?&][^?&=/]+=/;
var SKIPPABLE_PATH_SEGMENTS = new Set(["node_modules", "__pycache__"]);
var SKIPPABLE_PATH_SEGMENT_PAIRS = [
  ["vendor", "bundle"],
  ["vendor", "cache"]
];
function isSensitivePath(target, cwd, config, environment, budget) {
  if (isRemoteUrl(target)) {
    return null;
  }
  const normalized = normalizeCandidatePath(target, cwd, environment, budget);
  if (!normalized) {
    return null;
  }
  const comparableName = comparable(normalized.split("/").pop() ?? "");
  const comparablePath = comparable(normalized);
  const isFilenameShapedName = () => isFilenameShaped(comparableName) || candidateExistsOnDisk(target, cwd, environment, budget);
  const comparableUnresolvedPath = comparable(normalizeUnresolvedHomePath(target, cwd, environment, budget));
  for (const rule of import_secret.SECRET_HOME_PATH_RULES) {
    const prefix = `~/${rule.suffixParts.join("/")}`;
    if ((isSameOrChildHomePath(comparablePath, prefix) || isSameOrChildHomePath(comparableUnresolvedPath, prefix)) && isSecretRuleEnabled(rule.id, config)) {
      return rule.id;
    }
  }
  if (ENV_EXEMPTION_BASENAMES.has(comparableName) || ENV_EXEMPTION_PREFIXES.some((prefix) => comparableName.startsWith(prefix))) {
    return null;
  }
  const codingCliRuleId = matchesCodingCliPath(normalized, cwd, config, environment, budget);
  if (codingCliRuleId)
    return codingCliRuleId;
  if (PUBLIC_KEY_BASENAMES.has(comparableName))
    return null;
  for (const rule of import_secret.SECRET_BASENAME_RULES) {
    if (comparableName === rule.basename && isSecretRuleEnabled(rule.id, config))
      return rule.id;
  }
  if (comparableName.startsWith(ENV_PREFIX) && isSecretRuleEnabled(import_secret.SECRET_ENV_VARIANT_RULE.id, config) && isFilenameShapedName()) {
    return import_secret.SECRET_ENV_VARIANT_RULE.id;
  }
  for (const rule of import_secret.SECRET_VARIANT_SEPARATOR_RULES) {
    if (comparableName.length > rule.prefix.length && comparableName.startsWith(rule.prefix)) {
      const next = comparableName.slice(rule.prefix.length)[0];
      if ((next === "-" || next === "_") && isSecretRuleEnabled(rule.id, config) && isFilenameShapedName()) {
        return rule.id;
      }
    }
  }
  for (const rule of import_secret.SECRET_VARIANT_DOT_SUFFIX_RULES) {
    if (comparableName.length > rule.prefix.length && comparableName.startsWith(rule.prefix)) {
      if (comparableName.slice(rule.prefix.length) === rule.suffix && isSecretRuleEnabled(rule.id, config)) {
        return rule.id;
      }
    }
  }
  if (isSkippablePathForBroadSignatures(comparablePath))
    return null;
  if (!comparableName.includes(".") && import_secret.SECRET_BROAD_SSH_KEY_BASENAME_RULE.pattern.test(comparableName) && isSecretRuleEnabled(import_secret.SECRET_BROAD_SSH_KEY_BASENAME_RULE.id, config)) {
    return import_secret.SECRET_BROAD_SSH_KEY_BASENAME_RULE.id;
  }
  if (QUERY_PARAMETER.test(target) && !candidateExistsOnDisk(target, cwd, environment, budget)) {
    return null;
  }
  const extensionRuleId = hasSensitiveExtension(comparableName, config);
  if (extensionRuleId)
    return extensionRuleId;
  return null;
}
function matchesCodingCliPath(normalized, cwd, config, environment, budget) {
  return import_secret.SECRET_CODING_CLI_RULES.find((rule) => {
    if (!isSecretRuleEnabled(rule.id, config))
      return false;
    switch (rule.id) {
      case "secret.cli.claude-code":
        return matchesFileInRoot(normalized, codingCliRoot(environment.env.get("CLAUDE_CONFIG_DIR"), "~/.claude", cwd, environment, budget), [".credentials.json"]);
      case "secret.cli.claude-code.config": {
        const segments = comparable(normalized).split("/");
        return matchesFileInRoot(normalized, codingCliRoot(environment.env.get("CLAUDE_CONFIG_DIR"), "~/.claude", cwd, environment, budget), ["settings.json", "settings.local.json"]) || matchesExactPath(normalized, "~/.claude.json", cwd, environment, budget) || segments.at(-1) === "settings.local.json" && segments.at(-2) === ".claude" || segments.at(-1) === ".mcp.json";
      }
      case "secret.cli.antigravity":
        return matchesFileInRoot(normalized, normalizeCandidatePath("~/.gemini/config", cwd, environment, budget), ["hooks.json", "mcp_config.json"]);
      case "secret.cli.codex": {
        const root = codingCliRoot(environment.env.get("CODEX_HOME"), "~/.codex", cwd, environment, budget);
        return matchesFileInRoot(normalized, root, ["auth.json", ".credentials.json"]) || matchesDirInRoot(normalized, root, ["secrets", ".sandbox-secrets"]);
      }
      case "secret.cli.codex.config": {
        const root = codingCliRoot(environment.env.get("CODEX_HOME"), "~/.codex", cwd, environment, budget);
        const name = comparable(normalized).split("/").at(-1) ?? "";
        return matchesFileInRoot(normalized, root, ["config.toml"]) || name.endsWith(".config.toml") && matchesFileInRoot(normalized, root, [name]);
      }
      case "secret.cli.gemini":
        return matchesFileInRoot(normalized, appendPath(codingCliRoot(environment.env.get("GEMINI_CLI_HOME"), "~", cwd, environment, budget), ".gemini"), [
          "oauth_creds.json",
          "mcp-oauth-tokens.json",
          "a2a-oauth-tokens.json",
          "gemini-credentials.json"
        ]);
      case "secret.cli.gemini.config": {
        const segments = comparable(normalized).split("/");
        const systemSettingsPath = environment.env.get("GEMINI_CLI_SYSTEM_SETTINGS_PATH");
        const programDataConfig = environment.env.get("ProgramData") ? [
          appendPath(codingCliRoot(environment.env.get("ProgramData"), "", cwd, environment, budget), "gemini-cli")
        ] : [];
        return matchesFileInRoot(normalized, appendPath(codingCliRoot(environment.env.get("GEMINI_CLI_HOME"), "~", cwd, environment, budget), ".gemini"), ["settings.json", "google_accounts.json"]) || segments.at(-1) === "settings.json" && segments.at(-2) === ".gemini" || (systemSettingsPath?.trim() ? matchesExactPath(normalized, systemSettingsPath, cwd, environment, budget) : false) || [
          "/Library/Application Support/GeminiCli",
          "/etc/gemini-cli",
          ...programDataConfig
        ].some((root) => matchesFileInRoot(normalized, normalizeCandidatePath(root, cwd, environment, budget), ["settings.json"]));
      }
      case "secret.cli.copilot-cli": {
        const root = codingCliRoot(environment.env.get("COPILOT_HOME"), "~/.copilot", cwd, environment, budget);
        return matchesFileInRoot(normalized, root, ["config.json"]) || matchesDirInRoot(normalized, root, ["mcp-oauth-config", "mcp-secrets"]);
      }
      case "secret.cli.copilot-cli.config":
        return matchesFileInRoot(normalized, codingCliRoot(environment.env.get("COPILOT_HOME"), "~/.copilot", cwd, environment, budget), ["mcp-config.json"]);
      case "secret.cli.kimi-code": {
        const currentRoot = codingCliRoot(environment.env.get("KIMI_CODE_HOME"), "~/.kimi-code", cwd, environment, budget);
        const legacyRoot = codingCliRoot(environment.env.get("KIMI_SHARE_DIR"), "~/.kimi", cwd, environment, budget);
        return matchesFileInRoot(normalized, currentRoot, ["server.token"]) || matchesDirInRoot(normalized, currentRoot, ["credentials"]) || matchesDirInRoot(normalized, legacyRoot, ["credentials", "mcp-oauth"]);
      }
      case "secret.cli.kimi-code.config": {
        const configFiles = ["config.toml", "mcp.json"];
        const segments = comparable(normalized).split("/");
        return segments.at(-1) === "mcp.json" && segments.at(-2) === ".kimi-code" || matchesFileInRoot(normalized, codingCliRoot(environment.env.get("KIMI_CODE_HOME"), "~/.kimi-code", cwd, environment, budget), configFiles) || matchesFileInRoot(normalized, codingCliRoot(environment.env.get("KIMI_SHARE_DIR"), "~/.kimi", cwd, environment, budget), [...configFiles, "config.json", "config.json.bak"]);
      }
      case "secret.cli.opencode": {
        const dataRoot = appendPath(codingCliRoot(environment.env.get("XDG_DATA_HOME"), "~/.local/share", cwd, environment, budget), "opencode");
        const databaseName = comparable(normalized).split("/").at(-1) ?? "";
        const databaseEnv = environment.env.get("OPENCODE_DB")?.trim();
        const databaseEnvPaths = databaseEnv && databaseEnv !== ":memory:" ? [databaseEnv, `${databaseEnv}-wal`, `${databaseEnv}-shm`] : [];
        return matchesFileInRoot(normalized, dataRoot, ["auth.json", "mcp-auth.json"]) || /^opencode(-.+)?\.db(-wal|-shm)?$/.test(databaseName) && matchesFileInRoot(normalized, dataRoot, [databaseName]) || databaseEnvPaths.some((path) => matchesExactPath(normalized, path, cwd, environment, budget));
      }
      case "secret.cli.opencode.config": {
        const xdgConfigRoot = appendPath(codingCliRoot(environment.env.get("XDG_CONFIG_HOME"), "~/.config", cwd, environment, budget), "opencode");
        const programDataConfig = environment.env.get("ProgramData") ? [
          appendPath(codingCliRoot(environment.env.get("ProgramData"), "", cwd, environment, budget), "opencode")
        ] : [];
        const configNames = ["opencode.json", "opencode.jsonc"];
        const opencodeConfig = environment.env.get("OPENCODE_CONFIG");
        return configNames.includes(comparable(normalized).split("/").at(-1) ?? "") || matchesFileInRoot(normalized, xdgConfigRoot, ["config.json"]) || (opencodeConfig?.trim() ? matchesExactPath(normalized, opencodeConfig, cwd, environment, budget) : false) || ["/Library/Application Support/opencode", "/etc/opencode", ...programDataConfig].some((root) => matchesFileInRoot(normalized, normalizeCandidatePath(root, cwd, environment, budget), configNames));
      }
      case "secret.cli.pi":
        return matchesFileInRoot(normalized, codingCliRoot(environment.env.get("PI_CODING_AGENT_DIR"), "~/.pi/agent", cwd, environment, budget), ["auth.json"]);
      case "secret.cli.pi.config":
        return matchesFileInRoot(normalized, codingCliRoot(environment.env.get("PI_CODING_AGENT_DIR"), "~/.pi/agent", cwd, environment, budget), ["models.json"]);
      case "secret.cli.amp": {
        const home = normalizeCandidatePath("~", cwd, environment, budget);
        const dataRoots = [
          appendPath(codingCliRoot(environment.env.get("XDG_DATA_HOME"), "~/.local/share", cwd, environment, budget), "amp"),
          appendPath(home, ".local", "share", "amp")
        ];
        return dataRoots.some((root) => matchesFileInRoot(normalized, root, ["secrets.json"])) || matchesDirInRoot(normalized, appendPath(home, ".amp"), ["oauth"]);
      }
      case "secret.cli.amp.config": {
        const settingsNames = ["settings.json", "settings.jsonc"];
        const configRoots = [
          appendPath(codingCliRoot(environment.env.get("XDG_CONFIG_HOME"), "~/.config", cwd, environment, budget), "amp"),
          appendPath(normalizeCandidatePath("~", cwd, environment, budget), ".config", "amp")
        ];
        const segments = comparable(normalized).split("/");
        const ampSettingsFile = environment.env.get("AMP_SETTINGS_FILE");
        return configRoots.some((root) => matchesFileInRoot(normalized, root, settingsNames)) || segments.at(-2) === ".amp" && settingsNames.includes(segments.at(-1) ?? "") || (ampSettingsFile?.trim() ? matchesExactPath(normalized, ampSettingsFile, cwd, environment, budget) : false);
      }
      case "secret.cli.cursor": {
        const configRoot = appendPath(codingCliRoot(environment.env.get("XDG_CONFIG_HOME"), "~/.config", cwd, environment, budget), "cursor");
        const projectsRoot = appendPath(codingCliRoot(environment.env.get("CURSOR_DATA_DIR"), "~/.cursor", cwd, environment, budget), "projects");
        return matchesFileInRoot(normalized, normalizeCandidatePath("~/.cursor", cwd, environment, budget), ["auth.json"]) || matchesFileInRoot(normalized, configRoot, ["auth.json"]) || comparable(normalized).split("/").at(-1) === "mcp-auth.json" && isSameOrChildPath(comparable(normalized), comparable(projectsRoot));
      }
      case "secret.cli.cursor.config": {
        const segments = comparable(normalized).split("/");
        return segments.at(-1) === "mcp.json" && segments.at(-2) === ".cursor";
      }
      case "secret.cli.grok-build":
        return matchesFileInRoot(normalized, codingCliRoot(environment.env.get("GROK_HOME"), "~/.grok", cwd, environment, budget), ["auth.json", "mcp_credentials.json"]);
      case "secret.cli.grok-build.config": {
        const segments = comparable(normalized).split("/");
        return segments.at(-1) === "config.toml" && segments.at(-2) === ".grok" || matchesFileInRoot(normalized, codingCliRoot(environment.env.get("GROK_HOME"), "~/.grok", cwd, environment, budget), ["config.toml", "managed_config.toml", "requirements.toml"]) || matchesFileInRoot(normalized, normalizeCandidatePath("/etc/grok", cwd, environment, budget), ["managed_config.toml", "requirements.toml"]);
      }
      case "secret.cli.droid":
        return matchesFileInRoot(normalized, normalizeCandidatePath("~/.factory", cwd, environment, budget), ["auth.encrypted", "auth.v2.file", "auth.v2.key", "auth.v2.loginkeychain"]);
      case "secret.cli.droid.config": {
        const segments = comparable(normalized).split("/");
        return segments.at(-1) === "mcp.json" && segments.at(-2) === ".factory" || matchesFileInRoot(normalized, normalizeCandidatePath("~/.factory", cwd, environment, budget), ["settings.json", "hooks.json"]);
      }
      case "secret.cli.devin":
        return [
          codingCliRoot(environment.env.get("XDG_DATA_HOME"), "~/.local/share", cwd, environment, budget),
          normalizeCandidatePath("~/.local/share", cwd, environment, budget)
        ].some((dataHome) => matchesFileInRoot(normalized, appendPath(dataHome, "devin"), ["credentials.toml"]) || matchesDirInRoot(normalized, appendPath(dataHome, "devin", "mcp"), ["oauth"]));
      case "secret.cli.devin.config":
        return [
          codingCliRoot(environment.env.get("XDG_CONFIG_HOME"), "~/.config", cwd, environment, budget),
          normalizeCandidatePath("~/.config", cwd, environment, budget)
        ].some((configHome) => matchesFileInRoot(normalized, appendPath(configHome, "devin"), ["config.json"]));
      default:
        return false;
    }
  })?.id ?? null;
}
var codingCliRoots = new WeakMap;
function codingCliRoot(envValue, fallback, cwd, environment, budget) {
  const roots = codingCliRoots.get(budget) ?? new Map;
  codingCliRoots.set(budget, roots);
  const key = `${cwd}\x00${envValue ?? ""}\x00${fallback}`;
  const cached = roots.get(key);
  if (cached !== undefined)
    return cached;
  const root = normalizeCandidatePath(envValue?.trim() ? envValue : fallback, cwd, environment, budget);
  roots.set(key, root);
  return root;
}
function matchesFileInRoot(normalized, root, files) {
  return files.some((file) => sameComparablePath(normalized, appendPath(root, file)));
}
function matchesDirInRoot(normalized, root, dirs) {
  return dirs.some((dir) => isSameOrChildPath(comparable(normalized), comparable(appendPath(root, dir))));
}
function matchesExactPath(normalized, path, cwd, environment, budget) {
  return sameComparablePath(normalized, normalizeCandidatePath(path, cwd, environment, budget));
}
function sameComparablePath(a, b) {
  return comparable(a) === comparable(b);
}
function appendPath(root, ...parts) {
  return normalizePathText([root, ...parts].filter(Boolean).join("/"));
}
function matchesPolicyPath(target, cwd, paths, configCwd, environment, budget) {
  if (paths.length === 0)
    return false;
  const normalized = comparable(normalizeAbsoluteCandidatePath(target, cwd, environment, budget));
  return paths.some((path) => isSameOrChildPath(normalized, comparable(normalizeAbsoluteCandidatePath(path, configCwd, environment, budget))));
}
function matchesAllowedPath(target, cwd, allowPaths, configCwd, environment, budget) {
  if (allowPaths.length === 0)
    return false;
  const normalized = comparable(normalizeAbsoluteCandidatePath(target, cwd, environment, budget));
  if (!normalized)
    return false;
  const homeValue = environment.env.get("HOME") ?? environment.home;
  const resolvedHome = homeValue ? normalizePathText(import_canonicalization5.resolveExistingPath(import_canonicalization5.normalizeMsysDrivePath(homeValue), environment.paths, budget)) : "";
  const home = comparable(resolvedHome);
  const guardHomeValue = environment.env.get("CC_SAFETY_NET_HOME");
  const guardRoot = comparable(guardHomeValue ? normalizePathText(import_canonicalization5.resolveExistingPath(import_node_path3.resolve(import_canonicalization5.normalizeMsysDrivePath(guardHomeValue)), environment.paths, budget)) : resolvedHome && normalizePathText(import_canonicalization5.resolveExistingPath(`${resolvedHome}/.cc-safety-net`, environment.paths, budget)));
  if (guardRoot && isSameOrChildPath(normalized, guardRoot))
    return false;
  return allowPaths.some((entry) => {
    const recursive = import_allow_paths.parseRecursiveSecretAllowPath(entry);
    if (recursive && import_node_path3.posix.basename(normalized) !== comparable(recursive.name))
      return false;
    const root = comparable(normalizeAbsoluteCandidatePath(recursive?.root ?? entry, configCwd, environment, budget));
    if (!root)
      return false;
    if (home && (home === root || home.startsWith(root.endsWith("/") ? root : `${root}/`))) {
      return false;
    }
    return isSameOrChildPath(normalized, root) && !(recursive && normalized === root);
  });
}
function isSkippablePathForBroadSignatures(comparablePath) {
  const parts = comparablePath.split("/");
  return parts.some((part) => SKIPPABLE_PATH_SEGMENTS.has(part)) || SKIPPABLE_PATH_SEGMENT_PAIRS.some(([parent, child]) => parts.some((part, index) => part === parent && parts[index + 1] === child));
}
function hasSensitiveExtension(comparableName, config) {
  const index = comparableName.lastIndexOf(".");
  const extension = index > 0 && index < comparableName.length - 1 ? comparableName.slice(index + 1) : "";
  if (extension === "")
    return null;
  for (const rule of import_secret.SECRET_EXTENSION_RULES) {
    if (extension === rule.extension && isSecretRuleEnabled(rule.id, config))
      return rule.id;
  }
  for (const rule of import_secret.SECRET_EXTENSION_PATTERN_RULES) {
    if (rule.pattern.test(extension) && isSecretRuleEnabled(rule.id, config))
      return rule.id;
  }
  return null;
}
function comparable(value) {
  return value.toLowerCase();
}
function isSecretRuleEnabled(id, config) {
  return !config?.disabledRules?.includes(id);
}
function normalizeCandidatePath(target, cwd, environment, budget) {
  const { home, normalized } = prepareCandidatePath(target, environment, budget);
  if (!normalized) {
    return "";
  }
  if (!home) {
    return normalized;
  }
  const expanded = expandHomePath(normalized, home);
  const absolute = import_node_path3.isAbsolute(expanded) ? expanded : normalizePathText(import_node_path3.resolve(cwd, expanded));
  const canonicalAbsolute = normalizePathText(import_canonicalization5.resolveExistingPath(absolute, environment.paths, budget));
  if (!isSameOrChildPath(canonicalAbsolute, home)) {
    if (import_node_path3.isAbsolute(expanded))
      return canonicalAbsolute;
    return canonicalAbsolute === absolute ? normalized : canonicalAbsolute;
  }
  const relativeHomePath = canonicalAbsolute.slice(home.length);
  return relativeHomePath ? `~${relativeHomePath}` : "~";
}
function isSameOrChildHomePath(path, prefix) {
  return path === prefix || path.startsWith(`${prefix}/`);
}
function normalizeUnresolvedHomePath(target, cwd, environment, budget) {
  const { home, normalized } = prepareCandidatePath(target, environment, budget);
  if (!normalized || !home)
    return "";
  const expanded = expandHomePath(normalized, home);
  const absolute = import_node_path3.posix.normalize(import_node_path3.isAbsolute(expanded) ? expanded : normalizePathText(import_node_path3.resolve(cwd, expanded)));
  const literalHome = normalizePathText(import_canonicalization5.normalizeMsysDrivePath(environment.env.get("HOME") ?? environment.home));
  const fold = (value) => process.platform === "win32" ? value.toLowerCase() : value;
  const root = [home, literalHome].find((candidate) => candidate !== "" && isSameOrChildPath(fold(absolute), fold(candidate)));
  if (root === undefined)
    return "";
  const relativeHomePath = absolute.slice(root.length);
  return relativeHomePath ? `~${relativeHomePath}` : "~";
}
function normalizeAbsoluteCandidatePath(target, cwd, environment, budget) {
  const { home, normalized } = prepareCandidatePath(target, environment, budget);
  if (!normalized)
    return "";
  const expanded = home ? expandHomePath(normalized, home) : normalized;
  return normalizePathText(import_canonicalization5.resolveExistingPath(import_node_path3.isAbsolute(expanded) ? expanded : import_node_path3.resolve(cwd, expanded), environment.paths, budget));
}
function prepareCandidatePath(target, environment, budget) {
  const homeValue = environment.env.get("HOME") ?? environment.home;
  const home = homeValue ? normalizePathText(import_canonicalization5.resolveExistingPath(import_canonicalization5.normalizeMsysDrivePath(homeValue), environment.paths, budget)) : "";
  const normalized = normalizePathText(import_canonicalization5.normalizeMsysDrivePath(normalizeFileUriPath(projectSensitiveShellText(target, environment))));
  return { home, normalized };
}
function normalizeFileUriPath(value) {
  if (!value.trim().toLowerCase().startsWith("file:"))
    return value;
  try {
    return import_node_url.fileURLToPath(value);
  } catch {
    return value;
  }
}
function expandHomePath(path, home) {
  if (path === "~")
    return home;
  if (path.startsWith("~/"))
    return appendPath(home, path.slice(2));
  return path;
}
function usesBackslashSeparators(value) {
  if (process.platform === "win32")
    return true;
  return import_node_path3.win32.parse(value).root.length > 1;
}
function normalizePathText(value) {
  const trimmed = value.trim();
  const normalized = (trimmed.includes("\\") && usesBackslashSeparators(trimmed) ? trimmed.replace(/\\/g, "/") : trimmed).replace(/\/{2,}/g, "/").replace(/^\.\//, "");
  if (normalized === "/") {
    return normalized;
  }
  return normalized.replace(/\/+$/g, "");
}
function isSameOrChildPath(path, parent) {
  return path === parent || path.startsWith(parent.endsWith("/") ? parent : `${parent}/`);
}
function basename2(token) {
  return token.split(/[\\/]/).pop()?.replace(/\.exe$/i, "") ?? token;
}

// src/gate/pipeline.ts
class GuardEvaluationError extends Error {
  stage;
  evaluation;
  name = "GuardEvaluationError";
  constructor(stage, evaluation, cause) {
    super(`CC Safety Net ${stage} dependency failed`, { cause });
    this.stage = stage;
    this.evaluation = evaluation;
  }
}
var DEFAULT_DEPENDENCIES = {
  findPolicyMutation: findPolicyConfigMutationTargetInSemanticFacts,
  findGitMetadataMutation: findGitMetadataMutationTargetInSemanticFacts,
  resolveGitMetadata: resolveGitMetadataForCwds,
  loadPolicySnapshot: import_snapshot.loadPolicySnapshot,
  findSensitiveTarget: findSensitiveTargetInSemanticFacts,
  analyzeCommand: import_analyzer.analyzeCommandWithProgram,
  getModes: import_env.getCCSafetyNetEnvModes
};
var BARE_SHELL_READING_STDIN = /^(?:\S*\/)?(?:ba|da|z|k)?sh(?:\s+-[A-Za-z-]*)*$/;
function evaluateGuard(invocation, options) {
  const dependencies = { ...DEFAULT_DEPENDENCIES, ...options.dependencies };
  const inputCommand = getInputCommandOrFail(invocation);
  const command = isCommandInvocation(invocation) ? invocation.command : inputCommand;
  const facts = callDependency("policy-protection", command, () => createSemanticFacts(invocation));
  const inputCandidate = getCommandSyntaxFact(facts, "input-candidate");
  const declaredCommand = getCommandSyntaxFact(facts, "declared-command");
  if (isCommandInvocation(invocation) && invocation.command?.trim() && declaredCommand?.program.status === "limited") {
    return {
      stage: "command-analysis",
      decision: {
        kind: "deny",
        reason: import_reasons2.REASON_RECURSION_LIMIT,
        ruleId: "analysis.recursion-limit",
        intent: "stop_and_explain",
        evidence: { command: invocation.command, segment: invocation.command }
      }
    };
  }
  if (inputCandidate?.program.status === "limited") {
    return {
      stage: "command-validation",
      decision: {
        kind: "deny",
        reason: import_reasons2.REASON_STRUCTURAL_COMMAND_VALIDATION_LIMIT,
        ruleId: "analysis.structural-limit",
        intent: "stop_and_explain"
      }
    };
  }
  const budget = import_budget2.createBudget();
  const protectedGitMetadata = callDependency("policy-protection", command, () => dependencies.resolveGitMetadata([invocation.context.executionCwd, invocation.context.configCwd], options.environment));
  const policyTarget = callDependency("policy-protection", command, () => dependencies.findPolicyMutation(facts, options.environment, budget));
  if (policyTarget) {
    const displayCommand = command ?? policyTarget.target;
    return {
      stage: "policy-protection",
      decision: {
        kind: "deny",
        reason: REASON_POLICY_CONFIG_PROTECTION,
        ruleId: "guard.policy-config",
        intent: "hard_stop",
        evidence: { command: displayCommand, segment: policyTarget.target }
      }
    };
  }
  const policyApplyTarget = callDependency("policy-protection", command, () => findPolicyApplyInvocationInSemanticFacts(facts, options.environment, budget));
  if (policyApplyTarget) {
    const displayCommand = command ?? policyApplyTarget.target;
    return {
      stage: "policy-protection",
      decision: {
        kind: "deny",
        reason: REASON_POLICY_APPLY_PROTECTION,
        ruleId: "guard.policy-apply",
        intent: "hard_stop",
        evidence: { command: displayCommand, segment: policyApplyTarget.target }
      }
    };
  }
  const gitMetadataTarget = callDependency("policy-protection", command, () => dependencies.findGitMetadataMutation(facts, protectedGitMetadata, options.environment, budget));
  if (gitMetadataTarget) {
    const displayCommand = command ?? gitMetadataTarget.target;
    return {
      stage: "policy-protection",
      decision: {
        kind: "deny",
        reason: REASON_GIT_METADATA_PROTECTION,
        ruleId: "guard.git-metadata",
        intent: "hard_stop",
        evidence: { command: displayCommand, segment: gitMetadataTarget.target }
      }
    };
  }
  const snapshot = callDependency("config-load", command, () => dependencies.loadPolicySnapshot(options.environment, {
    ...options.policyOptions,
    cwd: invocation.context.configCwd
  }));
  const policy = snapshot.policy;
  const modes = dependencies.getModes(policy, options.environment.env);
  const reported = { level: modes.effectiveLevel, ...getConfigFallback(snapshot) };
  const secretTarget = policy.secretProtection.enabled === false ? null : callDependency("secret-protection", command, () => dependencies.findSensitiveTarget(facts, policy.secretProtection, options.environment, budget, {
    strict: isCommandInvocation(invocation) || inputCandidate?.program.dialect === "powershell" ? modes.strict : undefined
  }));
  if (secretTarget) {
    const displayCommand = command ?? secretTarget.target;
    return {
      stage: "secret-protection",
      ...reported,
      decision: {
        kind: "deny",
        reason: REASON_SECRET_PROTECTION,
        intent: "hard_stop",
        ruleId: secretTarget.ruleId,
        evidence: { command: displayCommand, segment: secretTarget.target }
      }
    };
  }
  if (!isCommandInvocation(invocation)) {
    return { stage: "non-command", ...reported, decision: { kind: "allow" } };
  }
  if (!invocation.command || invocation.command.trim() === "") {
    return {
      ...failedClosedEvaluation("command-validation", command),
      ...reported
    };
  }
  const analysis = callDependency("command-analysis", command, () => import_analyzer.analyzeOrCapBreach(() => dependencies.analyzeCommand(invocation.command, {
    cwd: invocation.context.executionCwd,
    shell: invocation.route.shell,
    policySnapshot: snapshot,
    environment: options.environment,
    protectedGitMetadata,
    effectiveCapabilities: modes.capabilities,
    strict: modes.strict,
    paranoidRm: modes.paranoidRm,
    paranoidInterpreters: modes.paranoidInterpreters,
    worktreeMode: modes.worktreeMode,
    budget,
    ...options.trace ? { trace: options.trace } : {}
  }, getDeclaredCommandProgram(facts), facts.store), invocation.command, options.trace));
  if (analysis.decision) {
    const unverifiedByStandardMode = !modes.strict && (analysis.decision.ruleId === "raw-text.dangerous-command" || analysis.decision.reason === import_reasons.REASON_DYNAMIC_SHELL_SOURCE && !BARE_SHELL_READING_STDIN.test(analysis.decision.evidence?.segment ?? "") && import_dangerous_text.dangerousInTextMatch(invocation.command) === null);
    return {
      stage: "command-analysis",
      ...reported,
      ..."errorCode" in analysis ? { errorCode: analysis.errorCode } : {},
      decision: unverifiedByStandardMode ? { ...analysis.decision, unverifiedByStandardMode: true } : analysis.decision
    };
  }
  return { stage: "command-analysis", ...reported, decision: { kind: "allow" } };
}
function resolveGitMetadataForCwds(cwds, environment) {
  const resolved = [
    ...new Set(cwds.filter((cwd) => typeof cwd === "string" && cwd !== ""))
  ].flatMap((cwd) => environment.gitMetadata(cwd) ?? []);
  if (resolved.length === 0)
    return null;
  return Object.freeze({
    entries: Object.freeze([...new Set(resolved.flatMap((metadata) => metadata.entries))]),
    markerFiles: Object.freeze([...new Set(resolved.flatMap((metadata) => metadata.markerFiles))]),
    directories: Object.freeze([...new Set(resolved.flatMap((metadata) => metadata.directories))]),
    hooksDirectories: Object.freeze([
      ...new Set(resolved.flatMap((metadata) => metadata.hooksDirectories))
    ])
  });
}
function getConfigFallback(snapshot) {
  if (snapshot.state === "ready")
    return {};
  return { configFallback: { reason: snapshot.reason } };
}
function getDeclaredCommandProgram(facts) {
  return getCommandSyntaxFact(facts, "declared-command")?.program;
}
function getInputCommandOrFail(invocation) {
  try {
    return import_tool_input4.getCommandFromToolInput(invocation.input);
  } catch (cause) {
    const command = isCommandInvocation(invocation) ? invocation.command : undefined;
    throw new GuardEvaluationError("policy-protection", failedClosedEvaluation("policy-protection", cause instanceof import_tool_input4.ToolInputLimitError ? undefined : command, cause), cause);
  }
}
function callDependency(stage, command, call) {
  try {
    return call();
  } catch (cause) {
    throw new GuardEvaluationError(stage, failedClosedEvaluation(stage, cause instanceof import_tool_input4.ToolInputLimitError ? undefined : command, cause), cause);
  }
}
function failedClosedEvaluation(stage, command, cause) {
  const isAnalysisLimit = cause instanceof import_budget2.AnalysisLimit || cause instanceof StructuralShellSyntaxLimitError;
  return {
    stage,
    decision: {
      kind: "deny",
      reason: isAnalysisLimit ? import_reasons2.REASON_COMMAND_ANALYSIS_LIMIT : import_reasons2.REASON_SAFETY_NET_FAILED_CLOSED,
      ruleId: isAnalysisLimit ? "analysis.limit" : "analysis.failed-closed",
      intent: "stop_and_explain",
      ...command ? { evidence: { command, segment: command } } : {}
    }
  };
}
function isCommandInvocation(invocation) {
  return invocation.route.kind === "command";
}
// src/gate/invocation.ts
function createToolInvocation(toolName, input, route, context, command) {
  if (route.kind !== "command")
    return { toolName, input, route, context };
  return { toolName, input, route, context, command };
}
// src/gate/intake.ts
var import_node_fs2 = require("node:fs");
var import_node_path4 = require("node:path");
var import_denial = require("./core.js");
var import_canonicalization6 = require("./core.js");
var import_tool_input5 = require("./core.js");
function isUsableDirectory(path) {
  try {
    if (!import_node_fs2.statSync(path).isDirectory())
      return false;
    import_node_fs2.accessSync(path, import_node_fs2.constants.R_OK | import_node_fs2.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
function resolveContainedCwd(requestedCwd, trustedRoots, paths) {
  if (import_canonicalization6.isUnsupportedWindowsNamespacePath(requestedCwd))
    return;
  const roots = trustedRoots.flatMap((root) => canonicalDirectory(root, paths));
  if (!roots[0])
    return;
  const requested = canonicalDirectory(import_node_path4.isAbsolute(requestedCwd) ? requestedCwd : import_node_path4.resolve(roots[0], requestedCwd), paths)[0];
  if (!requested)
    return;
  return roots.some((root) => isSameOrInsidePath(requested, root)) ? requested : undefined;
}
function resolveCanonicalCwd(requestedCwd, baseCwd, paths) {
  if (import_canonicalization6.isUnsupportedWindowsNamespacePath(requestedCwd))
    return;
  return canonicalDirectory(import_node_path4.isAbsolute(requestedCwd) ? requestedCwd : import_node_path4.resolve(baseCwd, requestedCwd), paths)[0];
}
function firstTrustedRoot(trustedRoots, paths) {
  return trustedRoots.flatMap((root) => canonicalDirectory(root, paths))[0];
}
function cwdProblem(requestedCwd, baseCwd, paths) {
  return resolveCanonicalCwd(requestedCwd, baseCwd, paths) ? "outside-workspace" : "unusable";
}
function canonicalDirectory(path, paths) {
  const realPath = paths.realpath(path);
  if (realPath === null)
    return [];
  return paths.isDirectory(realPath) ? [realPath] : [];
}
function isSameOrInsidePath(path, root) {
  const rel = import_node_path4.relative(root, path);
  return rel === "" || rel !== ".." && !rel.startsWith(`..${import_node_path4.sep}`) && !import_node_path4.isAbsolute(rel);
}
var HOOK_INPUT_MAX_BYTES = 8 * 1024 * 1024;
async function readBoundedHookInput(input) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of input) {
    const buffer = typeof chunk === "string" ? Buffer.from(chunk, "utf-8") : Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    bytes += buffer.byteLength;
    if (bytes > HOOK_INPUT_MAX_BYTES) {
      stopHookInput(input);
      throw new Error("hook input byte limit exceeded");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks, bytes).toString("utf-8");
}
function stopHookInput(input) {
  const stop = input.destroy ?? input.cancel;
  if (!stop)
    return;
  try {
    Promise.resolve(stop.call(input)).catch(() => {});
  } catch {}
}
function parseHookJson(inputText, outputDeny, strictReason) {
  try {
    return JSON.parse(inputText);
  } catch {
    outputDeny({ reason: strictReason });
    return;
  }
}
function getToolRoute(toolName, commandTools) {
  const shell = commandTools.get(toolName);
  return shell ? { kind: "command", shell } : { kind: import_tool_input5.getNonCommandToolInputKind(toolName) };
}
function resolveStandardHookContext(cwdInput, toolInput, toolName, outputDeny, paths, processCwd) {
  const requestedCwd = cwdInput === undefined ? processCwd : cwdInput;
  if (typeof requestedCwd !== "string" || requestedCwd.trim() === "") {
    outputFailedClosed(outputDeny, toolInput, toolName);
    return null;
  }
  const cwd = firstTrustedRoot([requestedCwd], paths);
  if (cwd)
    return { configCwd: cwd, executionCwd: cwd };
  outputCwdDenial(outputDeny, toolInput, toolName, {
    directory: "session",
    problem: "unusable",
    cwd: requestedCwd
  });
  return null;
}
function outputFailedClosed(outputDeny, toolInput, toolName) {
  outputDeny(import_denial.createFailedClosedDenial({ command: readableCommand(toolInput), toolName }));
}
function outputCwdDenial(outputDeny, toolInput, toolName, cause) {
  outputDeny(import_denial.createCwdDenial(cause, { command: readableCommand(toolInput), toolName }));
}
function readableCommand(toolInput) {
  try {
    return import_tool_input5.getCommandFromToolInput(toolInput);
  } catch (error) {
    if (!(error instanceof import_tool_input5.ToolInputLimitError))
      throw error;
    return;
  }
}
