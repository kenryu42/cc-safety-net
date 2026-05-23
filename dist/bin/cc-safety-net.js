#!/usr/bin/env node
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/shell-quote/quote.js
var require_quote = __commonJS((exports, module) => {
  module.exports = function quote(xs) {
    return xs.map(function(s) {
      if (s === "") {
        return "''";
      }
      if (s && typeof s === "object") {
        return s.op.replace(/(.)/g, "\\$1");
      }
      if (/["\s\\]/.test(s) && !/'/.test(s)) {
        return "'" + s.replace(/(['])/g, "\\$1") + "'";
      }
      if (/["'\s]/.test(s)) {
        return '"' + s.replace(/(["\\$`!])/g, "\\$1") + '"';
      }
      return String(s).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, "$1\\$2");
    }).join(" ");
  };
});

// node_modules/shell-quote/parse.js
var require_parse = __commonJS((exports, module) => {
  var CONTROL = "(?:" + [
    "\\|\\|",
    "\\&\\&",
    ";;",
    "\\|\\&",
    "\\<\\(",
    "\\<\\<\\<",
    ">>",
    ">\\&",
    "<\\&",
    "[&;()|<>]"
  ].join("|") + ")";
  var controlRE = new RegExp("^" + CONTROL + "$");
  var META = "|&;()<> \\t";
  var SINGLE_QUOTE = '"((\\\\"|[^"])*?)"';
  var DOUBLE_QUOTE = "'((\\\\'|[^'])*?)'";
  var hash = /^#$/;
  var SQ = "'";
  var DQ = '"';
  var DS = "$";
  var TOKEN = "";
  var mult = 4294967296;
  for (i = 0;i < 4; i++) {
    TOKEN += (mult * Math.random()).toString(16);
  }
  var i;
  var startsWithToken = new RegExp("^" + TOKEN);
  function matchAll(s, r) {
    var origIndex = r.lastIndex;
    var matches = [];
    var matchObj;
    while (matchObj = r.exec(s)) {
      matches.push(matchObj);
      if (r.lastIndex === matchObj.index) {
        r.lastIndex += 1;
      }
    }
    r.lastIndex = origIndex;
    return matches;
  }
  function getVar(env, pre, key) {
    var r = typeof env === "function" ? env(key) : env[key];
    if (typeof r === "undefined" && key != "") {
      r = "";
    } else if (typeof r === "undefined") {
      r = "$";
    }
    if (typeof r === "object") {
      return pre + TOKEN + JSON.stringify(r) + TOKEN;
    }
    return pre + r;
  }
  function parseInternal(string, env, opts) {
    if (!opts) {
      opts = {};
    }
    var BS = opts.escape || "\\";
    var BAREWORD = "(\\" + BS + `['"` + META + `]|[^\\s'"` + META + "])+";
    var chunker = new RegExp([
      "(" + CONTROL + ")",
      "(" + BAREWORD + "|" + SINGLE_QUOTE + "|" + DOUBLE_QUOTE + ")+"
    ].join("|"), "g");
    var matches = matchAll(string, chunker);
    if (matches.length === 0) {
      return [];
    }
    if (!env) {
      env = {};
    }
    var commented = false;
    return matches.map(function(match) {
      var s = match[0];
      if (!s || commented) {
        return;
      }
      if (controlRE.test(s)) {
        return { op: s };
      }
      var quote = false;
      var esc = false;
      var out = "";
      var isGlob = false;
      var i2;
      function parseEnvVar() {
        i2 += 1;
        var varend;
        var varname;
        var char = s.charAt(i2);
        if (char === "{") {
          i2 += 1;
          if (s.charAt(i2) === "}") {
            throw new Error("Bad substitution: " + s.slice(i2 - 2, i2 + 1));
          }
          varend = s.indexOf("}", i2);
          if (varend < 0) {
            throw new Error("Bad substitution: " + s.slice(i2));
          }
          varname = s.slice(i2, varend);
          i2 = varend;
        } else if (/[*@#?$!_-]/.test(char)) {
          varname = char;
          i2 += 1;
        } else {
          var slicedFromI = s.slice(i2);
          varend = slicedFromI.match(/[^\w\d_]/);
          if (!varend) {
            varname = slicedFromI;
            i2 = s.length;
          } else {
            varname = slicedFromI.slice(0, varend.index);
            i2 += varend.index - 1;
          }
        }
        return getVar(env, "", varname);
      }
      for (i2 = 0;i2 < s.length; i2++) {
        var c = s.charAt(i2);
        isGlob = isGlob || !quote && (c === "*" || c === "?");
        if (esc) {
          out += c;
          esc = false;
        } else if (quote) {
          if (c === quote) {
            quote = false;
          } else if (quote == SQ) {
            out += c;
          } else {
            if (c === BS) {
              i2 += 1;
              c = s.charAt(i2);
              if (c === DQ || c === BS || c === DS) {
                out += c;
              } else {
                out += BS + c;
              }
            } else if (c === DS) {
              out += parseEnvVar();
            } else {
              out += c;
            }
          }
        } else if (c === DQ || c === SQ) {
          quote = c;
        } else if (controlRE.test(c)) {
          return { op: s };
        } else if (hash.test(c)) {
          commented = true;
          var commentObj = { comment: string.slice(match.index + i2 + 1) };
          if (out.length) {
            return [out, commentObj];
          }
          return [commentObj];
        } else if (c === BS) {
          esc = true;
        } else if (c === DS) {
          out += parseEnvVar();
        } else {
          out += c;
        }
      }
      if (isGlob) {
        return { op: "glob", pattern: out };
      }
      return out;
    }).reduce(function(prev, arg) {
      return typeof arg === "undefined" ? prev : prev.concat(arg);
    }, []);
  }
  module.exports = function parse(s, env, opts) {
    var mapped = parseInternal(s, env, opts);
    if (typeof env !== "function") {
      return mapped;
    }
    return mapped.reduce(function(acc, s2) {
      if (typeof s2 === "object") {
        return acc.concat(s2);
      }
      var xs = s2.split(RegExp("(" + TOKEN + ".*?" + TOKEN + ")", "g"));
      if (xs.length === 1) {
        return acc.concat(xs[0]);
      }
      return acc.concat(xs.filter(Boolean).map(function(x) {
        if (startsWithToken.test(x)) {
          return JSON.parse(x.split(TOKEN)[1]);
        }
        return x;
      }));
    }, []);
  };
});

// src/bin/commands/claude-code.ts
var claudeCodeCommand = {
  name: "claude-code",
  aliases: ["-cc", "--claude-code"],
  description: "Run as Claude Code PreToolUse hook (reads JSON from stdin)",
  usage: "hook -cc, hook --claude-code",
  options: [
    {
      flags: "-h, --help",
      description: "Show this help"
    }
  ],
  examples: ["cc-safety-net -cc", "cc-safety-net --claude-code"]
};

// src/bin/commands/copilot-cli.ts
var copilotCliCommand = {
  name: "copilot-cli",
  aliases: ["-cp", "--copilot-cli"],
  description: "Run as Copilot CLI PreToolUse hook (reads JSON from stdin)",
  usage: "hook -cp, hook --copilot-cli",
  options: [
    {
      flags: "-h, --help",
      description: "Show this help"
    }
  ],
  examples: ["cc-safety-net -cp", "cc-safety-net --copilot-cli"]
};

// src/bin/commands/doctor.ts
var doctorCommand = {
  name: "doctor",
  aliases: ["--doctor"],
  description: "Run diagnostic checks to verify installation and configuration",
  usage: "doctor [options]",
  options: [
    {
      flags: "--json",
      description: "Output diagnostics as JSON"
    },
    {
      flags: "--skip-update-check",
      description: "Skip npm registry version check"
    },
    {
      flags: "-h, --help",
      description: "Show this help"
    }
  ],
  examples: [
    "cc-safety-net doctor",
    "cc-safety-net doctor --json",
    "cc-safety-net doctor --skip-update-check"
  ]
};

// src/bin/commands/explain.ts
var explainCommand = {
  name: "explain",
  description: "Show step-by-step analysis trace of how a command would be analyzed",
  usage: "explain [options] <command>",
  argument: "<command>",
  options: [
    {
      flags: "--json",
      description: "Output analysis as JSON"
    },
    {
      flags: "--cwd",
      argument: "<path>",
      description: "Use custom working directory"
    },
    {
      flags: "-h, --help",
      description: "Show this help"
    }
  ],
  examples: [
    'cc-safety-net explain "git reset --hard"',
    'cc-safety-net explain --json "rm -rf /"',
    'cc-safety-net explain --cwd /tmp "git status"'
  ]
};

// src/bin/commands/gemini-cli.ts
var geminiCliCommand = {
  name: "gemini-cli",
  aliases: ["-gc", "--gemini-cli"],
  description: "Run as Gemini CLI BeforeTool hook (reads JSON from stdin)",
  usage: "hook -gc, hook --gemini-cli",
  options: [
    {
      flags: "-h, --help",
      description: "Show this help"
    }
  ],
  examples: ["cc-safety-net -gc", "cc-safety-net --gemini-cli"]
};

// src/bin/commands/hook.ts
var hookCommand = {
  name: "hook",
  description: "Run as an agent CLI hook (reads JSON from stdin)",
  usage: "hook <platform>",
  subcommands: [
    { usage: "install --opencode", description: "Install OpenCode hook config" },
    { usage: "install --kimi-cli", description: "Install Kimi CLI hook config" },
    { usage: "uninstall --opencode", description: "Uninstall OpenCode hook config" },
    { usage: "uninstall --kimi-cli", description: "Uninstall Kimi CLI hook config" }
  ],
  options: [
    {
      flags: "-cc, --claude-code",
      description: "Run as Claude Code PreToolUse hook"
    },
    {
      flags: "-cp, --copilot-cli",
      description: "Run as Copilot CLI PreToolUse hook"
    },
    {
      flags: "-gc, --gemini-cli",
      description: "Run as Gemini CLI BeforeTool hook"
    },
    {
      flags: "-kc, --kimi-cli",
      description: "Run as Kimi CLI PreToolUse hook"
    },
    {
      flags: "-h, --help",
      description: "Show this help"
    }
  ],
  examples: [
    "cc-safety-net hook -cc",
    "cc-safety-net hook --claude-code",
    "cc-safety-net hook -cp",
    "cc-safety-net hook --copilot-cli",
    "cc-safety-net hook -gc",
    "cc-safety-net hook --gemini-cli",
    "cc-safety-net hook -kc",
    "cc-safety-net hook --kimi-cli",
    "cc-safety-net hook uninstall --opencode"
  ]
};

// src/bin/commands/rule.ts
var ruleCommand = {
  name: "rule",
  description: "Manage Safety Net rulebook sources",
  usage: "rule <subcommand>",
  subcommands: [
    { usage: "init", description: "Create starter rule config and rulebook files" },
    { usage: "add <source>", description: "Add a rulebook source and sync" },
    { usage: "remove <source>", description: "Remove a rulebook source and sync" },
    { usage: "update [source]", description: "Refresh rulebook lock/cache state" },
    { usage: "sync", description: "Sync configured rulebooks" },
    { usage: "list", description: "List active rulebooks" },
    { usage: "test [source]", description: "Run rulebook fixtures" },
    { usage: "doc", description: "Print the rulebook authoring guide" },
    { usage: "verify", description: "Validate rule config files" }
  ],
  options: [
    { flags: "-g, --global", description: "Use user-scope rule config" },
    { flags: "--check", description: "Check without changing lock/cache state" },
    { flags: "-h, --help", description: "Show this help" }
  ],
  examples: [
    "cc-safety-net rule init",
    "cc-safety-net rule add project-rules",
    "cc-safety-net rule sync",
    "cc-safety-net rule verify"
  ]
};

// src/bin/commands/statusline.ts
var statuslineCommand = {
  name: "statusline",
  description: "Print status line with mode indicators for shell integration",
  usage: "statusline <coding cli>",
  options: [
    {
      flags: "-cc, --claude-code",
      description: "Print status line for Claude Code"
    },
    {
      flags: "-h, --help",
      description: "Show this help"
    }
  ],
  examples: ["cc-safety-net statusline -cc", "cc-safety-net statusline --claude-code"]
};

// src/bin/commands/verify-config.ts
var verifyConfigCommand = {
  name: "verify-config",
  aliases: ["-vc", "--verify-config"],
  description: "Validate custom rules configuration files",
  usage: "-vc, --verify-config",
  hidden: true,
  options: [
    {
      flags: "-h, --help",
      description: "Show this help"
    }
  ],
  examples: ["cc-safety-net -vc", "cc-safety-net --verify-config"]
};

// src/bin/commands/index.ts
var commands = [
  doctorCommand,
  explainCommand,
  ruleCommand,
  hookCommand,
  claudeCodeCommand,
  copilotCliCommand,
  geminiCliCommand,
  verifyConfigCommand,
  statuslineCommand
];
function findCommand(nameOrAlias) {
  const normalized = nameOrAlias.toLowerCase();
  return commands.find((cmd) => cmd.name.toLowerCase() === normalized || cmd.aliases?.some((alias) => alias.toLowerCase() === normalized));
}
function getVisibleCommands() {
  return commands.filter((cmd) => !cmd.hidden);
}

// src/bin/doctor/activity.ts
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
function formatRelativeTime(date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0)
    return `${days}d ago`;
  if (hours > 0)
    return `${hours}h ago`;
  if (minutes > 0)
    return `${minutes}m ago`;
  return "just now";
}
function getActivitySummary(days = 7, logsDir = join(homedir(), ".cc-safety-net", "logs")) {
  if (!existsSync(logsDir)) {
    return { totalBlocked: 0, sessionCount: 0, recentEntries: [] };
  }
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recentEntries = [];
  let totalBlocked = 0;
  let sessionCount = 0;
  let oldestEntry;
  let oldestEntryTs;
  let newestEntry;
  let newestEntryTs;
  let files;
  try {
    files = readdirSync(logsDir).filter((f) => f.endsWith(".jsonl"));
  } catch {
    return { totalBlocked: 0, sessionCount: 0, recentEntries: [] };
  }
  for (const file of files) {
    try {
      const content = readFileSync(join(logsDir, file), "utf-8");
      const lines = content.trim().split(`
`).filter(Boolean);
      let hasRecentEntry = false;
      for (const line of lines) {
        try {
          const entry = JSON.parse(line);
          if (entry.decision === "allow") {
            continue;
          }
          const ts = new Date(entry.ts).getTime();
          if (ts >= cutoff) {
            totalBlocked++;
            hasRecentEntry = true;
            if (oldestEntryTs === undefined || ts <= oldestEntryTs) {
              oldestEntry = entry.ts;
              oldestEntryTs = ts;
            }
            if (newestEntryTs === undefined || ts > newestEntryTs) {
              newestEntry = entry.ts;
              newestEntryTs = ts;
            }
            insertRecentEntry(recentEntries, entry, ts);
          }
        } catch {}
      }
      if (hasRecentEntry) {
        sessionCount++;
      }
    } catch {}
  }
  const displayEntries = recentEntries.map((e) => ({
    timestamp: e.ts,
    command: e.command,
    reason: e.reason,
    relativeTime: formatRelativeTime(new Date(e.ts))
  }));
  return {
    totalBlocked,
    sessionCount,
    recentEntries: displayEntries,
    oldestEntry,
    newestEntry
  };
}
function insertRecentEntry(entries, entry, ts) {
  const index = entries.findIndex((existing) => ts > new Date(existing.ts).getTime());
  if (index === -1) {
    if (entries.length < 3) {
      entries.push(entry);
    }
    return;
  }
  entries.splice(index, 0, entry);
  if (entries.length > 3) {
    entries.pop();
  }
}

// src/bin/doctor/config.ts
import { existsSync as existsSync9, readFileSync as readFileSync8 } from "node:fs";

// src/core/config.ts
import { existsSync as existsSync8, readFileSync as readFileSync7 } from "node:fs";
import { homedir as homedir3 } from "node:os";
import { join as join5, resolve as resolve3 } from "node:path";

// src/types.ts
var MAX_RECURSION_DEPTH = 10;
var MAX_STRIP_ITERATIONS = 20;
var NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/;
var COMMAND_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
var MAX_REASON_LENGTH = 256;
var SHELL_OPERATORS = new Set(["&&", "||", "|&", "|", "&", ";", `
`]);
var SHELL_WRAPPERS = new Set(["bash", "sh", "zsh", "ksh", "dash", "fish", "csh", "tcsh"]);
var INTERPRETERS = new Set(["python", "python3", "python2", "node", "ruby", "perl"]);
var DANGEROUS_PATTERNS = [
  /\brm\s+.*-[rR].*-f\b/,
  /\brm\s+.*-f.*-[rR]\b/,
  /\brm\s+-rf\b/,
  /\brm\s+-fr\b/,
  /\bgit\s+reset\s+--hard\b/,
  /\bgit\s+checkout\s+--\b/,
  /\bgit\s+clean\s+-f\b/,
  /\bfind\b.*\s-delete\b/
];
var PARANOID_INTERPRETERS_SUFFIX = `

(Paranoid mode: interpreter one-liners are blocked.)`;

// src/core/rules-policy/config-file.ts
import { existsSync as existsSync3, mkdirSync, readFileSync as readFileSync2, renameSync, writeFileSync } from "node:fs";
import { dirname as dirname2 } from "node:path";

// src/core/rules-policy/paths.ts
import { existsSync as existsSync2 } from "node:fs";
import { homedir as homedir2 } from "node:os";
import { dirname, join as join2, resolve } from "node:path";
var RULES_CONFIG_FILE = "rule.json";
var RULES_LOCK_FILE = "rule.lock";
var RULEBOOK_FILE = "rulebook.json";
var LEGACY_RULES_CONFIG_FILE = "config.json";
var SAFETY_NET_DIR = ".cc-safetynet-rules";
var LEGACY_PROJECT_RULES_DIR = ".cc-safety-net/rules";
var RULES_DIR = SAFETY_NET_DIR;
var CC_SAFETY_NET_HOME = "CC_SAFETY_NET_HOME";
var GITHUB_RULEBOOK_SOURCE_FORMAT = "owner/repo#ref/<rulebook-name>";
var RULE_SYNC_COMMAND = "`cc-safety-net rule sync`";
var RULE_MIGRATE_COMMAND = "`npx cc-safety-net rule migrate`";
function getProjectRulesDir(cwd) {
  const base = cwd ?? process.cwd();
  const legacyPath = resolve(base, LEGACY_PROJECT_RULES_DIR);
  return existsSync2(legacyPath) ? legacyPath : resolve(base, RULES_DIR);
}
function getProjectRulesConfigPath(cwd) {
  return join2(getProjectRulesDir(cwd), RULES_CONFIG_FILE);
}
function getProjectRulesLockPath(cwd) {
  return join2(getProjectRulesDir(cwd), RULES_LOCK_FILE);
}
function getUserRulesDir(options) {
  return options?.userConfigDir ?? (options?.userConfigPath ? dirname(options.userConfigPath) : getUserSafetyNetHome());
}
function getUserSafetyNetHome() {
  const home = process.env[CC_SAFETY_NET_HOME];
  return home ? resolve(home) : join2(homedir2(), SAFETY_NET_DIR);
}
function getUserRulesConfigPath(options) {
  return join2(getUserRulesDir(options), RULES_CONFIG_FILE);
}
function getUserRulesLockPath(options) {
  return join2(getUserRulesDir(options), RULES_LOCK_FILE);
}
function getRulesLockPathForConfigPath(configPath) {
  return join2(dirname(configPath), RULES_LOCK_FILE);
}
function getLegacyUserRulesConfigPath(options = {}) {
  return join2(dirname(getUserRulesDir(options)), LEGACY_RULES_CONFIG_FILE);
}
function getLegacyProjectRulesConfigPath(options = {}) {
  return resolve(options.cwd ?? process.cwd(), ".safety-net.json");
}
function getPolicyPaths(options) {
  return {
    userConfigPath: options.userConfigPath ?? getUserRulesConfigPath(options),
    projectConfigPath: options.projectConfigPath ?? getProjectRulesConfigPath(options.cwd),
    userLockPath: getUserRulesLockPath(options),
    projectLockPath: getRulesLockPathForConfigPath(options.projectConfigPath ?? getProjectRulesConfigPath(options.cwd))
  };
}
function getScopePaths(options) {
  const configPath = options.global ? getUserRulesConfigPath(options) : getProjectRulesConfigPath(options.cwd);
  return {
    configDir: dirname(configPath),
    configPath,
    lockPath: options.global ? getUserRulesLockPath(options) : getProjectRulesLockPath(options.cwd)
  };
}
function getRulebookDisplaySource(entry) {
  if (entry.kind === "github" && entry.display_ref) {
    return `${entry.owner}/${entry.repo}#${entry.display_ref}/${entry.name}`;
  }
  return entry.spec;
}
function getRulebookCachePath(entry, options) {
  const digestHex = entry.digest.startsWith("sha256:") ? entry.digest.slice(7) : entry.digest;
  return join2(options?.cacheConfigDir ?? getUserRulesDir(options), "cache", "rulebooks", `${getRulebookCacheSlug(entry)}--${digestHex.slice(0, 12)}`, RULEBOOK_FILE);
}
function getRulebookCacheSlug(entry) {
  const source = entry.kind === "github" && entry.display_ref ? `${entry.owner}/${entry.repo}#${entry.display_ref}/${entry.name}` : entry.spec;
  return source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "rulebook";
}
function getRepositoryRulebookPath(name) {
  return `${RULES_DIR}/${name}/${RULEBOOK_FILE}`;
}

// src/core/rules-policy/sources.ts
var GITHUB_SOURCE_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;
var GITHUB_REPOSITORY_SOURCE_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9_.-]+$/;
var GITHUB_REPOSITORY_REF_SOURCE_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#([A-Za-z0-9._-]+)$/;
var GITHUB_REF_PATTERN = /^[A-Za-z0-9._-]+$/;
var RULES_DIR_RE = RULES_DIR.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var RULEBOOK_FILE_RE = RULEBOOK_FILE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var GITHUB_RULEBOOK_PATH_RE = new RegExp(`^${RULES_DIR_RE}/(${NAME_PATTERN.source.slice(1, -1)})/${RULEBOOK_FILE_RE}$`);
function getRulebookSourceSyntaxError(source) {
  if (source.startsWith("builtin:") || source.startsWith("github:")) {
    return `Invalid rulebook source: ${source}`;
  }
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
  if (spec.startsWith("github:")) {
    throw new Error(`Invalid rulebook source: ${spec}`);
  }
  const match = spec.match(GITHUB_SOURCE_RE);
  if (!match?.[1] || !match[2] || !match[3]) {
    throw new Error(`Invalid GitHub rulebook source: ${spec}`);
  }
  const [ref, name, ...extraParts] = match[3].split("/");
  if (!ref || !GITHUB_REF_PATTERN.test(ref)) {
    throw new Error(`GitHub rulebook refs must be a single path segment: ${spec}`);
  }
  if (!name || extraParts.length > 0 || !NAME_PATTERN.test(name)) {
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
function isGitHubRulebookSource(source) {
  return GITHUB_SOURCE_RE.test(source);
}
function assertBareRulebookName(source) {
  if (!NAME_PATTERN.test(source)) {
    throw new Error(`Local rulebook sources must be bare names matching ${NAME_PATTERN}: ${source}`);
  }
}
function getSelectedUpdateSpecs(config, lock, match) {
  const exactMatches = config.rules.filter((spec) => spec === match);
  if (exactMatches.length > 0) {
    return { ok: true, specs: exactMatches };
  }
  if (!lock) {
    return {
      ok: false,
      result: {
        ok: false,
        errors: [
          `No lockfile available to match rulebook name ${match}; use the exact source or run ${RULE_SYNC_COMMAND}`
        ],
        entries: []
      }
    };
  }
  const configuredSpecs = new Set(config.rules);
  const nameMatches = lock.rulebooks.filter((entry) => entry.name === match && configuredSpecs.has(entry.spec)).map((entry) => entry.spec);
  if (nameMatches.length === 1) {
    return { ok: true, specs: nameMatches };
  }
  return noRulebookMatch(match, nameMatches);
}
function getRemoveMatches(rules, lock, match) {
  const exactMatches = rules.filter((spec) => spec === match);
  if (exactMatches.length > 0)
    return { ok: true, specs: exactMatches };
  const githubRefMatches = getGitHubRepositoryRefMatches(rules, match);
  if (githubRefMatches.length > 0)
    return { ok: true, specs: githubRefMatches };
  const githubRepositoryMatches = getGitHubRepositoryMatches(rules, match);
  if (!githubRepositoryMatches.ok)
    return githubRepositoryMatches;
  if (githubRepositoryMatches.specs.length > 0) {
    return { ok: true, specs: githubRepositoryMatches.specs };
  }
  const nameMatches = lock ? rules.filter((spec) => lock.rulebooks.find((entry) => entry.spec === spec)?.name === match) : [];
  if (nameMatches.length === 1)
    return { ok: true, specs: nameMatches };
  return noRulebookMatch(match, nameMatches);
}
function noRulebookMatch(match, nameMatches) {
  return {
    ok: false,
    result: {
      ok: false,
      errors: nameMatches.length === 0 ? [`No configured rulebook matches ${match}`] : [`Ambiguous rulebook match ${match}: ${nameMatches.join(", ")}`],
      entries: []
    }
  };
}
function getGitHubRepositoryRefMatches(rules, match) {
  const parsed = match.match(GITHUB_REPOSITORY_REF_SOURCE_RE);
  if (!parsed?.[1] || !parsed[2] || !parsed[3])
    return [];
  return rules.filter((spec) => {
    const source = getConfiguredGitHubSource(spec);
    if (!source)
      return false;
    return source.owner === parsed[1] && source.repo === parsed[2] && source.ref === parsed[3];
  });
}
function getGitHubRepositoryMatches(rules, match) {
  if (!isGitHubRepositorySource(match))
    return { ok: true, specs: [] };
  const specs = rules.filter((spec) => {
    const source = getConfiguredGitHubSource(spec);
    if (!source)
      return false;
    return source.owner === match.split("/")[0] && source.repo === match.split("/")[1];
  });
  const refs = new Set(specs.map((spec) => getConfiguredGitHubSource(spec)?.ref).filter((ref) => !!ref));
  if (refs.size < 2)
    return { ok: true, specs };
  return {
    ok: false,
    result: {
      ok: false,
      errors: [
        `Multiple refs are configured for ${match}. Use an explicit ref:`,
        `  cc-safety-net rule remove ${match}#<ref>`
      ],
      entries: []
    }
  };
}
function getConfiguredGitHubSource(spec) {
  try {
    return parseGitHubSource(spec);
  } catch {
    return null;
  }
}

// src/core/rules-policy/types.ts
var DEFAULT_CONFIG = { version: 1, rules: [], overrides: {} };

// src/core/rules-policy/config-file.ts
function validateRulesConfig(config) {
  const errors = [];
  const sources = new Set;
  if (!config || typeof config !== "object") {
    return { errors: ["Config must be an object"], sources };
  }
  const cfg = config;
  if (cfg.version !== 1) {
    errors.push("version must be 1");
  }
  if (cfg.rules === undefined) {} else if (!Array.isArray(cfg.rules)) {
    errors.push("rules must be an array of rulebook source strings");
  } else {
    for (let i = 0;i < cfg.rules.length; i++) {
      if (typeof cfg.rules[i] !== "string") {
        errors.push(`rules[${i}]: must be a rulebook source string`);
        continue;
      }
      if (cfg.rules[i].trim() === "") {
        errors.push(`rules[${i}]: must be a non-empty rulebook source string`);
        continue;
      }
      if (sources.has(cfg.rules[i])) {
        errors.push(`rules[${i}]: duplicate rulebook source "${cfg.rules[i]}"`);
        continue;
      }
      const sourceError = getRulebookSourceSyntaxError(cfg.rules[i]);
      if (sourceError) {
        errors.push(`rules[${i}]: ${sourceError}`);
        continue;
      }
      sources.add(cfg.rules[i]);
    }
  }
  if (cfg.overrides !== undefined) {
    if (!cfg.overrides || typeof cfg.overrides !== "object" || Array.isArray(cfg.overrides)) {
      errors.push("overrides must be an object if provided");
    } else {
      for (const [key, value] of Object.entries(cfg.overrides)) {
        if (!/^[^/]+\/[^/]+$/.test(key)) {
          errors.push(`overrides.${key}: must use <rulebook-name>/<rule-name>`);
        }
        if (value === "off") {
          continue;
        }
        if (!value || typeof value !== "object" || Array.isArray(value)) {
          errors.push(`overrides.${key}: must be "off" or an object`);
          continue;
        }
        const reason = value.reason;
        if (typeof reason !== "string" || reason === "") {
          errors.push(`overrides.${key}.reason: required non-empty string`);
        } else if (reason.length > MAX_REASON_LENGTH) {
          errors.push(`overrides.${key}.reason: must be at most ${MAX_REASON_LENGTH} characters`);
        }
      }
    }
  }
  return { errors, sources };
}
function readRulesConfig(path) {
  if (!existsSync3(path)) {
    return { config: null, errors: [] };
  }
  try {
    const content = readFileSync2(path, "utf-8");
    if (!content.trim()) {
      return { config: null, errors: ["Config file is empty"] };
    }
    const parsed = JSON.parse(content);
    const validation = validateRulesConfig(parsed);
    if (validation.errors.length > 0) {
      return { config: null, errors: validation.errors };
    }
    const cfg = parsed;
    return {
      config: {
        version: 1,
        rules: cfg.rules ?? [],
        overrides: cfg.overrides ?? {}
      },
      errors: []
    };
  } catch (error) {
    return {
      config: null,
      errors: [`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}
function readScopeRulesConfig(path) {
  const loaded = readRulesConfig(path);
  if (loaded.errors.length > 0) {
    return { ok: false, result: { ok: false, errors: loaded.errors, entries: [] } };
  }
  return { ok: true, config: loaded.config ?? DEFAULT_CONFIG };
}
function writeDefaultRulesConfig(path, rules = []) {
  writeJsonAtomic(path, { version: 1, rules, overrides: {} });
}
function writeStarterRulebook(path, name = "project-rules") {
  writeJsonAtomic(path, {
    rulebook_version: 1,
    name,
    version: "1.0.0",
    description: name === "project-rules" ? "Project-specific CC Safety Net rules." : "User-specific CC Safety Net rules.",
    author: name === "project-rules" ? "project" : "user",
    allowed_commands: ["docker"],
    rules: [
      {
        name: "block-docker-system-prune",
        command: "docker",
        subcommand: "system",
        block_args: ["prune"],
        reason: "Use targeted cleanup instead."
      }
    ],
    tests: [
      {
        command: "docker system prune",
        expect: "blocked",
        rule: "block-docker-system-prune"
      }
    ]
  });
}
function writeJsonAtomic(path, value) {
  mkdirSync(dirname2(path), { recursive: true });
  const tempPath = `${path}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(value, null, 2)}
`, "utf-8");
  renameSync(tempPath, path);
}

// src/core/rules-policy/scope-policy.ts
import { existsSync as existsSync6, readFileSync as readFileSync5 } from "node:fs";
import { dirname as dirname4, isAbsolute as isAbsolute3, join as join4, relative, resolve as resolve2, sep as sep2 } from "node:path";

// src/core/shell.ts
import { realpathSync as realpathSync2 } from "node:fs";
import { isAbsolute as isAbsolute2, parse as parsePath2 } from "node:path";

// node_modules/shell-quote/index.js
var $quote = require_quote();
var $parse = require_parse();

// src/core/git/env.ts
var GIT_CONTEXT_ENV_OVERRIDES = [
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_COMMON_DIR",
  "GIT_INDEX_FILE"
];
var GIT_CONTEXT_ENV_OVERRIDE_NAMES = new Set(GIT_CONTEXT_ENV_OVERRIDES);
var GIT_CONFIG_AFFECTING_ENV_NAMES = new Set([
  "GIT_CONFIG_GLOBAL",
  "GIT_CONFIG_NOSYSTEM",
  "GIT_CONFIG_SYSTEM",
  "HOME",
  "XDG_CONFIG_HOME"
]);
var GIT_CONTEXT_APPEND_ASSIGNMENT_RE = /^([A-Za-z_][A-Za-z0-9_]*)\+=/;
function isGitContextEnvOverrideName(name) {
  return GIT_CONTEXT_ENV_OVERRIDE_NAMES.has(name);
}
function isGitConfigEnvName(name) {
  return name === "GIT_CONFIG_COUNT" || name === "GIT_CONFIG_PARAMETERS" || /^GIT_CONFIG_(KEY|VALUE)_\d+$/.test(name);
}
function isTrackedGitEnvName(name) {
  return isGitContextEnvOverrideName(name) || GIT_CONFIG_AFFECTING_ENV_NAMES.has(name) || isGitConfigEnvName(name);
}
function parseGitContextAppendEnvAssignment(token) {
  const match = token.match(GIT_CONTEXT_APPEND_ASSIGNMENT_RE);
  const name = match?.[1];
  if (!name || !isTrackedGitEnvName(name)) {
    return null;
  }
  const eqIdx = token.indexOf("=");
  return { name, value: token.slice(eqIdx + 1) };
}
function hasConfigAffectingEnvAssignment(envAssignments) {
  if (!envAssignments) {
    return false;
  }
  for (const key of envAssignments.keys()) {
    if (GIT_CONFIG_AFFECTING_ENV_NAMES.has(key)) {
      return true;
    }
  }
  return false;
}

// src/core/path.ts
import { lstatSync, realpathSync } from "node:fs";
import { dirname as dirname3, isAbsolute, parse as parsePath, sep } from "node:path";
function resolveChdirTarget(baseCwd, target) {
  const root = isAbsolute(target) ? getPathRoot(target) : "";
  let current = root || baseCwd;
  for (const component of getPathComponents(root ? target.slice(root.length) : target)) {
    if (component === "" || component === ".") {
      continue;
    }
    if (component === "..") {
      current = dirname3(current);
      continue;
    }
    const candidate = appendPathWithoutNormalizing(current, component);
    current = lstatSync(candidate).isSymbolicLink() ? realpathSync(candidate) : candidate;
  }
  return current;
}
function appendPathWithoutNormalizing(base, target) {
  return base.endsWith("/") || base.endsWith("\\") ? `${base}${target}` : `${base}${sep}${target}`;
}
function getPathRoot(target) {
  return parsePath(target).root;
}
function getPathComponents(target) {
  const separator = process.platform === "win32" ? /[\\/]+/ : /\/+/;
  return target.split(separator);
}

// src/core/shell.ts
var ENV_PROXY = new Proxy({}, {
  get: (_, name) => `$${String(name)}`
});
var ARITHMETIC_SENTINEL = "__CC_SAFETY_NET_ARITH_SENTINEL__";
var BACKTICK_ATTACHED_SUFFIX_SENTINEL = "__CC_SAFETY_NET_BACKTICK_SUFFIX__";
function splitShellCommands(command) {
  return splitShellCommandsWithInfo(command).map((segment) => segment.tokens);
}
function splitShellCommandsWithInfo(command) {
  if (hasUnclosedQuotes(command)) {
    return [{ tokens: [command], hasDynamicSubstitution: false }];
  }
  const normalizedCommand = _stripAttachedIoNumbers(command.replace(/\n/g, " ; "));
  const tokens = $parse(normalizedCommand, ENV_PROXY);
  const segments = [];
  let current = [];
  let currentHasDynamicSubstitution = false;
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (isOperator(token)) {
      if (current.length > 0) {
        segments.push({
          tokens: current,
          hasDynamicSubstitution: currentHasDynamicSubstitution
        });
        current = [];
        currentHasDynamicSubstitution = false;
      }
      i++;
      continue;
    }
    if (_isProcessSubstitutionStart(tokens, i)) {
      if (current.length > 0) {
        segments.push({
          tokens: current,
          hasDynamicSubstitution: currentHasDynamicSubstitution
        });
        current = [];
        currentHasDynamicSubstitution = false;
      }
      const { innerSegments, endIndex } = extractProcessSubstitution(tokens, i);
      for (const seg of innerSegments) {
        segments.push({ tokens: seg, hasDynamicSubstitution: false });
      }
      i = endIndex + 1;
      continue;
    }
    if (_isRedirectOp(token)) {
      const { redirectTarget, advance } = _getRedirectTargetInfo(tokens, i);
      if (redirectTarget !== null) {
        _pushInlineSubstitutionSegmentInfos(segments, redirectTarget);
      }
      i += advance;
      continue;
    }
    if (_isCommandSubstitutionStart(tokens, i)) {
      const { innerSegments, endIndex } = extractCommandSubstitution(tokens, i + 2);
      const attachedSuffix = _getBacktickAttachedSuffix(tokens[endIndex + 1]);
      const shouldKeepCurrent = attachedSuffix !== null && !_isRedirectOp(tokens[i - 1]) && !isOperatorToken(tokens[i - 1]);
      if (current.length > 0) {
        currentHasDynamicSubstitution = true;
        if (!shouldKeepCurrent) {
          segments.push({
            tokens: current,
            hasDynamicSubstitution: currentHasDynamicSubstitution
          });
          current = [];
          currentHasDynamicSubstitution = false;
        }
      }
      for (const seg of innerSegments) {
        segments.push({ tokens: seg, hasDynamicSubstitution: false });
      }
      if (shouldKeepCurrent && attachedSuffix) {
        current.push(attachedSuffix);
      }
      i = endIndex + (attachedSuffix !== null ? 2 : 1);
      continue;
    }
    if (_isAttachedCommandSubstitutionStart(tokens, i)) {
      const tokenText2 = tokens[i];
      if (typeof tokenText2 === "string") {
        const prefix = tokenText2.slice(0, -1);
        if (prefix) {
          current.push(prefix);
        }
      }
      currentHasDynamicSubstitution = current.length > 0;
      const { innerSegments, endIndex } = extractCommandSubstitution(tokens, i + 2);
      for (const seg of innerSegments) {
        segments.push({ tokens: seg, hasDynamicSubstitution: false });
      }
      i = endIndex + 1;
      continue;
    }
    const tokenText = _getCommandTokenText(token);
    if (tokenText === null) {
      i++;
      continue;
    }
    _pushInlineSubstitutionSegmentInfos(segments, tokenText);
    current.push(tokenText);
    i++;
  }
  if (current.length > 0) {
    segments.push({
      tokens: current,
      hasDynamicSubstitution: currentHasDynamicSubstitution
    });
  }
  return segments;
}
function extractInlineCommandSubstitutions(token) {
  const segments = [];
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  while (i < token.length) {
    const char = token[i];
    if (!char) {
      break;
    }
    if (escaped) {
      escaped = false;
      i++;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      i++;
      continue;
    }
    if (!inDouble && char === "'") {
      inSingle = !inSingle;
      i++;
      continue;
    }
    if (!inSingle && char === '"') {
      inDouble = !inDouble;
      i++;
      continue;
    }
    if (!inSingle && char === "$" && token[i + 1] === "(" && token[i + 2] !== "(") {
      const end = _findInlineCommandSubstitutionEnd(token, i + 2);
      if (end === -1) {
        break;
      }
      const innerCommand = token.slice(i + 2, end);
      if (innerCommand.trim()) {
        const innerSegments = splitShellCommands(innerCommand);
        for (const seg of innerSegments) {
          segments.push(seg);
        }
      }
      i = end + 1;
      continue;
    }
    i++;
  }
  return segments;
}
function isParenOpen(token) {
  return typeof token === "object" && token !== null && "op" in token && token.op === "(";
}
function isParenClose(token) {
  return typeof token === "object" && token !== null && "op" in token && token.op === ")";
}
function _getCommandTokenText(token) {
  if (typeof token === "string") {
    return token;
  }
  if (token && typeof token === "object" && "pattern" in token && typeof token.pattern === "string") {
    return token.pattern;
  }
  return null;
}
function extractCommandSubstitution(tokens, startIndex) {
  if (tokens[startIndex] === ARITHMETIC_SENTINEL) {
    return _extractArithmeticSubstitution(tokens, startIndex);
  }
  const innerSegments = [];
  let currentSegment = [];
  let depth = 1;
  let i = startIndex;
  while (i < tokens.length && depth > 0) {
    const token = tokens[i];
    if (isParenOpen(token)) {
      depth++;
      i++;
      continue;
    }
    if (isParenClose(token)) {
      depth--;
      if (depth === 0)
        break;
      i++;
      continue;
    }
    if (depth === 1 && token && isOperator(token)) {
      if (currentSegment.length > 0) {
        innerSegments.push(currentSegment);
        currentSegment = [];
      }
      i++;
      continue;
    }
    if (depth === 1 && _isProcessSubstitutionStart(tokens, i)) {
      if (currentSegment.length > 0) {
        innerSegments.push(currentSegment);
        currentSegment = [];
      }
      const { innerSegments: nestedSegments, endIndex } = extractProcessSubstitution(tokens, i);
      for (const seg of nestedSegments) {
        innerSegments.push(seg);
      }
      i = endIndex + 1;
      continue;
    }
    if (depth === 1 && _isRedirectOp(token)) {
      const { redirectTarget, advance } = _getRedirectTargetInfo(tokens, i);
      if (redirectTarget !== null) {
        _pushInlineSubstitutionSegments(innerSegments, redirectTarget);
      }
      i += advance;
      continue;
    }
    if (depth === 1 && _isCommandSubstitutionStart(tokens, i)) {
      const { innerSegments: nestedSegments, endIndex } = extractCommandSubstitution(tokens, i + 2);
      const attachedSuffix = _getBacktickAttachedSuffix(tokens[endIndex + 1]);
      const shouldKeepCurrent = attachedSuffix !== null && !_isRedirectOp(tokens[i - 1]) && !isOperatorToken(tokens[i - 1]);
      if (!shouldKeepCurrent && currentSegment.length > 0) {
        innerSegments.push(currentSegment);
        currentSegment = [];
      }
      for (const seg of nestedSegments) {
        innerSegments.push(seg);
      }
      if (shouldKeepCurrent && attachedSuffix) {
        currentSegment.push(attachedSuffix);
      }
      i = endIndex + (attachedSuffix !== null ? 2 : 1);
      continue;
    }
    if (depth === 1 && _isAttachedCommandSubstitutionStart(tokens, i)) {
      if (typeof token === "string") {
        const prefix = token.slice(0, -1);
        if (prefix) {
          currentSegment.push(prefix);
        }
      }
      const { innerSegments: nestedSegments, endIndex } = extractCommandSubstitution(tokens, i + 2);
      for (const seg of nestedSegments) {
        innerSegments.push(seg);
      }
      i = endIndex + 1;
      continue;
    }
    const tokenText = _getCommandTokenText(token);
    if (tokenText !== null) {
      currentSegment.push(tokenText);
    }
    i++;
  }
  if (currentSegment.length > 0) {
    innerSegments.push(currentSegment);
  }
  return { innerSegments, endIndex: i };
}
function _extractArithmeticSubstitution(tokens, startIndex) {
  const innerSegments = [];
  let expression = "";
  let depth = 1;
  let i = startIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (_isCommandSubstitutionStart(tokens, i)) {
      if (expression) {
        innerSegments.push([expression]);
        expression = "";
      }
      const { innerSegments: nestedSegments, endIndex } = extractCommandSubstitution(tokens, i + 2);
      for (const seg of nestedSegments) {
        innerSegments.push(seg);
      }
      i = endIndex + 1;
      continue;
    }
    if (typeof token === "string" && token !== "$" && token.endsWith("$") && isParenOpen(tokens[i + 1])) {
      expression += token.slice(0, -1);
      if (expression) {
        innerSegments.push([expression]);
        expression = "";
      }
      const { innerSegments: nestedSegments, endIndex } = extractCommandSubstitution(tokens, i + 2);
      for (const seg of nestedSegments) {
        innerSegments.push(seg);
      }
      i = endIndex + 1;
      continue;
    }
    if (isParenOpen(token)) {
      depth++;
      expression += "(";
      i++;
      continue;
    }
    if (isParenClose(token)) {
      depth--;
      if (depth === 0) {
        return {
          innerSegments: expression ? [...innerSegments, [expression]] : innerSegments,
          endIndex: i
        };
      }
      expression += ")";
      i++;
      continue;
    }
    if (typeof token === "string") {
      _pushInlineSubstitutionSegments(innerSegments, token);
      expression += token;
      i++;
      continue;
    }
    if (token && typeof token === "object") {
      if ("pattern" in token && typeof token.pattern === "string") {
        expression += token.pattern;
        i++;
        continue;
      }
      if ("op" in token) {
        expression += String(token.op);
      }
    }
    i++;
  }
  return {
    innerSegments: expression ? [...innerSegments, [expression]] : innerSegments,
    endIndex: i
  };
}
function _pushInlineSubstitutionSegments(segments, token) {
  const inlineSegments = extractInlineCommandSubstitutions(token);
  for (const seg of inlineSegments) {
    segments.push(seg);
  }
}
function _pushInlineSubstitutionSegmentInfos(segments, token) {
  const inlineSegments = extractInlineCommandSubstitutions(token);
  for (const seg of inlineSegments) {
    segments.push({ tokens: seg, hasDynamicSubstitution: false });
  }
}
function hasUnclosedQuotes(command) {
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  for (const char of command) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (char === '"' && !inSingle) {
      inDouble = !inDouble;
    }
  }
  return inSingle || inDouble;
}
function _stripAttachedIoNumbers(command) {
  let result = "";
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  let atTokenBoundary = true;
  let arithmeticParenDepth = 0;
  for (let i = 0;i < command.length; ) {
    const char = command[i];
    if (!char) {
      break;
    }
    if (escaped) {
      result += char;
      escaped = false;
      atTokenBoundary = false;
      i++;
      continue;
    }
    if (!inSingle && char === "\\") {
      result += char;
      escaped = true;
      i++;
      continue;
    }
    if (!inDouble && char === "'") {
      result += char;
      inSingle = !inSingle;
      atTokenBoundary = false;
      i++;
      continue;
    }
    if (!inSingle && char === '"') {
      result += char;
      inDouble = !inDouble;
      atTokenBoundary = false;
      i++;
      continue;
    }
    if (!inSingle && char === "`") {
      const endIndex = _findBacktickEnd(command, i + 1);
      if (endIndex === -1) {
        result += char;
        atTokenBoundary = false;
        i++;
        continue;
      }
      result += `$(${command.slice(i + 1, endIndex)})`;
      if (atTokenBoundary && command[endIndex + 1] && _isPathLikeBacktickSuffix(command[endIndex + 1])) {
        result += BACKTICK_ATTACHED_SUFFIX_SENTINEL;
      }
      atTokenBoundary = false;
      i = endIndex + 1;
      continue;
    }
    if (!inSingle && !inDouble) {
      if (arithmeticParenDepth === 0 && command.startsWith("$((", i)) {
        result += `$( ${ARITHMETIC_SENTINEL} `;
        arithmeticParenDepth = 1;
        atTokenBoundary = false;
        i += 3;
        continue;
      }
      if (arithmeticParenDepth > 0) {
        if (char === "(") {
          arithmeticParenDepth++;
          result += char;
        } else if (char === ")") {
          arithmeticParenDepth--;
          if (arithmeticParenDepth === 0) {
            result += ")";
            if (command[i + 1] === ")") {
              i += 2;
            } else {
              i++;
            }
            atTokenBoundary = false;
            continue;
          }
          result += char;
        } else {
          result += char;
        }
        atTokenBoundary = false;
        i++;
        continue;
      }
      if (_isWhitespaceChar(char)) {
        result += char;
        atTokenBoundary = true;
        i++;
        continue;
      }
      if (atTokenBoundary && _isAsciiDigit(char)) {
        let end = i + 1;
        while (end < command.length) {
          const nextChar = command[end];
          if (!nextChar || !_isAsciiDigit(nextChar)) {
            break;
          }
          end++;
        }
        const redirectOpLength = _getRawRedirectOpLength(command, end);
        if (redirectOpLength > 0) {
          i = end;
          atTokenBoundary = true;
          continue;
        }
      }
    }
    result += char;
    atTokenBoundary = _isShellTokenBoundaryChar(char);
    i++;
  }
  return result;
}
var ENV_ASSIGNMENT_RE = /^[A-Za-z_][A-Za-z0-9_]*=/;
function parseEnvAssignment(token) {
  if (!ENV_ASSIGNMENT_RE.test(token)) {
    return null;
  }
  const eqIdx = token.indexOf("=");
  return { name: token.slice(0, eqIdx), value: token.slice(eqIdx + 1) };
}
function stripEnvAssignmentsWithInfo(tokens) {
  const envAssignments = new Map;
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      break;
    }
    const assignment = parseEnvAssignment(token);
    if (!assignment) {
      break;
    }
    envAssignments.set(assignment.name, assignment.value);
    i++;
  }
  return { tokens: tokens.slice(i), envAssignments };
}
function stripWrappers(tokens, cwd) {
  return stripWrappersWithInfo(tokens, cwd).tokens;
}
function stripWrappersWithInfo(tokens, cwd) {
  let result = [...tokens];
  const allEnvAssignments = new Map;
  let currentCwd = cwd;
  for (let iteration = 0;iteration < MAX_STRIP_ITERATIONS; iteration++) {
    const before = result.join(" ");
    const { tokens: strippedTokens, envAssignments } = stripEnvAssignmentsWithInfo(result);
    for (const [k, v] of envAssignments) {
      allEnvAssignments.set(k, v);
    }
    result = strippedTokens;
    if (result.length === 0)
      break;
    while (result.length > 0 && result[0]?.includes("=") && !ENV_ASSIGNMENT_RE.test(result[0] ?? "")) {
      const appendAssignment = parseGitContextAppendEnvAssignment(result[0] ?? "");
      if (appendAssignment) {
        allEnvAssignments.set(appendAssignment.name, appendAssignment.value);
      }
      result = result.slice(1);
    }
    if (result.length === 0)
      break;
    const head = result[0]?.toLowerCase();
    if (head !== "sudo" && head !== "env" && head !== "command") {
      break;
    }
    if (head === "sudo") {
      const sudoResult = stripSudoWithInfo(result, currentCwd);
      result = sudoResult.tokens;
      if (sudoResult.cwd !== undefined) {
        currentCwd = sudoResult.cwd;
      }
    }
    if (head === "env") {
      const envResult = stripEnvWithInfo(result, currentCwd);
      result = envResult.tokens;
      if (envResult.cwd !== undefined) {
        currentCwd = envResult.cwd;
      }
      for (const [k, v] of envResult.envAssignments) {
        allEnvAssignments.set(k, v);
      }
    }
    if (head === "command") {
      result = stripCommand(result);
    }
    if (result.join(" ") === before)
      break;
  }
  const { tokens: finalTokens, envAssignments: finalAssignments } = stripEnvAssignmentsWithInfo(result);
  for (const [k, v] of finalAssignments) {
    allEnvAssignments.set(k, v);
  }
  return { tokens: finalTokens, envAssignments: allEnvAssignments, cwd: currentCwd };
}
var SUDO_OPTS_WITH_VALUE = new Set(["-u", "-g", "-C", "-D", "-h", "-p", "-r", "-t", "-T", "-U"]);
function stripSudoWithInfo(tokens, cwd) {
  let i = 1;
  let currentCwd = cwd;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token)
      break;
    if (token === "--") {
      return { tokens: tokens.slice(i + 1), cwd: currentCwd };
    }
    if (!token.startsWith("-")) {
      break;
    }
    if (token === "-D" || token === "--chdir") {
      const target = tokens[i + 1];
      currentCwd = target ? resolveWrapperCwd(currentCwd, target) : null;
      i += 2;
      continue;
    }
    if (token.startsWith("--chdir=")) {
      currentCwd = resolveWrapperCwd(currentCwd, token.slice("--chdir=".length));
      i++;
      continue;
    }
    if (token.startsWith("-D") && token.length > 2) {
      currentCwd = resolveWrapperCwd(currentCwd, token.slice(2));
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
  return { tokens: tokens.slice(i), cwd: currentCwd };
}
var ENV_OPTS_NO_VALUE = new Set(["-i", "-0", "--null"]);
var ENV_OPTS_WITH_VALUE = new Set([
  "-u",
  "--unset",
  "-C",
  "--chdir",
  "-S",
  "--split-string",
  "-P"
]);
function stripEnvWithInfo(tokens, cwd) {
  const envAssignments = new Map;
  let currentCwd = cwd;
  let expandedTokens = tokens;
  let i = 1;
  while (i < expandedTokens.length) {
    const token = expandedTokens[i];
    if (!token)
      break;
    if (token === "--") {
      return { tokens: expandedTokens.slice(i + 1), envAssignments, cwd: currentCwd };
    }
    if (ENV_OPTS_NO_VALUE.has(token)) {
      i++;
      continue;
    }
    if (token === "-S" || token === "--split-string") {
      const splitValue = expandedTokens[i + 1];
      const splitTokens = splitValue !== undefined ? parseEnvSplitString(splitValue) : null;
      if (!splitTokens) {
        currentCwd = null;
        i += 2;
        continue;
      }
      expandedTokens = [
        ...expandedTokens.slice(0, i),
        ...splitTokens,
        ...expandedTokens.slice(i + 2)
      ];
      continue;
    }
    if (token.startsWith("-S") && token.length > 2) {
      const splitTokens = parseEnvSplitString(token.slice("-S".length));
      if (!splitTokens) {
        currentCwd = null;
        i++;
        continue;
      }
      expandedTokens = [
        ...expandedTokens.slice(0, i),
        ...splitTokens,
        ...expandedTokens.slice(i + 1)
      ];
      continue;
    }
    if (token.startsWith("--split-string=")) {
      const splitTokens = parseEnvSplitString(token.slice("--split-string=".length));
      if (!splitTokens) {
        currentCwd = null;
        i++;
        continue;
      }
      expandedTokens = [
        ...expandedTokens.slice(0, i),
        ...splitTokens,
        ...expandedTokens.slice(i + 1)
      ];
      continue;
    }
    if (ENV_OPTS_WITH_VALUE.has(token)) {
      if (token === "-C" || token === "--chdir") {
        const target = expandedTokens[i + 1];
        currentCwd = target ? resolveWrapperCwd(currentCwd, target) : null;
      }
      i += 2;
      continue;
    }
    if (token.startsWith("-u=") || token.startsWith("--unset=")) {
      i++;
      continue;
    }
    if (token.startsWith("-C") && token.length > 2 || token.startsWith("--chdir=")) {
      const target = token.startsWith("--chdir=") ? token.slice("--chdir=".length) : token.startsWith("-C=") ? token.slice("-C=".length) : token.slice("-C".length);
      currentCwd = resolveWrapperCwd(currentCwd, target);
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
    const assignment = parseEnvAssignment(token);
    if (!assignment) {
      break;
    }
    envAssignments.set(assignment.name, assignment.value);
    i++;
  }
  return { tokens: expandedTokens.slice(i), envAssignments, cwd: currentCwd };
}
function parseEnvSplitString(value) {
  if (hasUnclosedQuotes(value)) {
    return null;
  }
  const parsed = $parse(value, ENV_PROXY);
  const result = [];
  for (const entry of parsed) {
    const token = _getCommandTokenText(entry);
    if (token === null) {
      return null;
    }
    result.push(token);
  }
  return result;
}
function resolveWrapperCwd(cwd, target) {
  if (target === "") {
    return null;
  }
  try {
    if (!cwd && !isAbsolute2(target)) {
      return null;
    }
    const baseCwd = isAbsolute2(target) ? getPathRoot2(target) : realpathSync2(cwd ?? "/");
    return resolveChdirTarget(baseCwd, target);
  } catch {
    return null;
  }
}
function getPathRoot2(target) {
  return parsePath2(target).root;
}
function stripCommand(tokens) {
  let i = 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token)
      break;
    if (token === "-p" || token === "-v" || token === "-V") {
      i++;
      continue;
    }
    if (token === "--") {
      return tokens.slice(i + 1);
    }
    if (token.startsWith("-") && !token.startsWith("--") && token.length > 1) {
      const chars = token.slice(1);
      if (!/^[pvV]+$/.test(chars)) {
        break;
      }
      i++;
      continue;
    }
    break;
  }
  return tokens.slice(i);
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
function normalizeCommandToken(token) {
  return getBasename(token).toLowerCase();
}
function getBasename(token) {
  return token.includes("/") ? token.split("/").pop() ?? token : token;
}
function isOperator(token) {
  return typeof token === "object" && token !== null && "op" in token && SHELL_OPERATORS.has(token.op);
}
function isOperatorToken(token) {
  return token !== undefined && isOperator(token);
}
var REDIRECT_OPS = new Set([">", ">>", "<", ">&", "<&", ">|"]);
var RAW_REDIRECT_OPS = [">>", ">&", "<&", ">|", ">", "<"];
function _isRedirectOp(token) {
  return typeof token === "object" && token !== null && "op" in token && REDIRECT_OPS.has(token.op);
}
function _isCommandSubstitutionStart(tokens, index) {
  return tokens[index] === "$" && isParenOpen(tokens[index + 1]);
}
function _isAttachedCommandSubstitutionStart(tokens, index) {
  const token = tokens[index];
  return typeof token === "string" && token !== "$" && token.endsWith("$") && isParenOpen(tokens[index + 1]);
}
function _getBacktickAttachedSuffix(token) {
  return typeof token === "string" && token.startsWith(BACKTICK_ATTACHED_SUFFIX_SENTINEL) ? token.slice(BACKTICK_ATTACHED_SUFFIX_SENTINEL.length) : null;
}
function _isProcessSubstitutionStart(tokens, index) {
  const token = tokens[index];
  return typeof token === "object" && token !== null && "op" in token && (token.op === "<(" || token.op === ">" && isParenOpen(tokens[index + 1]));
}
function extractProcessSubstitution(tokens, startIndex) {
  const token = tokens[startIndex];
  if (typeof token === "object" && token !== null && "op" in token && token.op === "<(") {
    return extractCommandSubstitution(tokens, startIndex + 1);
  }
  if (_isProcessSubstitutionStart(tokens, startIndex)) {
    return extractCommandSubstitution(tokens, startIndex + 2);
  }
  return { innerSegments: [], endIndex: startIndex };
}
function _getRedirectTargetInfo(tokens, index) {
  if (_isCommandSubstitutionStart(tokens, index + 1) || _isProcessSubstitutionStart(tokens, index + 1)) {
    return { redirectTarget: null, advance: 1 };
  }
  const firstTarget = tokens[index + 1];
  if (typeof firstTarget !== "string") {
    const isGlobTarget = firstTarget && typeof firstTarget === "object" && "pattern" in firstTarget && typeof firstTarget.pattern === "string";
    return { redirectTarget: null, advance: isGlobTarget ? 2 : 1 };
  }
  let redirectTarget = firstTarget;
  let nextIndex = index + 2;
  if (firstTarget.endsWith("$") && isParenOpen(tokens[nextIndex])) {
    const { text, consumed } = _collectParenthesizedTokens(tokens, nextIndex);
    if (consumed > 0) {
      redirectTarget += text;
      nextIndex += consumed;
    }
  }
  return {
    redirectTarget,
    advance: nextIndex - index
  };
}
function _findInlineCommandSubstitutionEnd(token, startIndex) {
  let depth = 1;
  let i = startIndex;
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  while (i < token.length) {
    const char = token[i];
    if (!char) {
      break;
    }
    if (escaped) {
      escaped = false;
      i++;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      i++;
      continue;
    }
    if (!inDouble && char === "'") {
      inSingle = !inSingle;
      i++;
      continue;
    }
    if (!inSingle && char === '"') {
      inDouble = !inDouble;
      i++;
      continue;
    }
    if (!inSingle && !inDouble) {
      if (char === "(") {
        depth++;
      } else if (char === ")") {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
    }
    i++;
  }
  return -1;
}
function _findBacktickEnd(command, startIndex) {
  let escaped = false;
  for (let i = startIndex;i < command.length; i++) {
    const char = command[i];
    if (!char) {
      break;
    }
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "`") {
      return i;
    }
  }
  return -1;
}
function _collectParenthesizedTokens(tokens, startIndex) {
  if (!isParenOpen(tokens[startIndex])) {
    return { text: "", consumed: 0 };
  }
  const parts = [];
  let depth = 0;
  let i = startIndex;
  while (i < tokens.length) {
    const token = tokens[i];
    if (isParenOpen(token)) {
      depth++;
    } else if (isParenClose(token)) {
      depth--;
    }
    const piece = _stringifyParseEntry(token);
    if (piece) {
      parts.push(piece);
    }
    i++;
    if (depth === 0) {
      break;
    }
  }
  return { text: parts.join(" "), consumed: i - startIndex };
}
function _stringifyParseEntry(token) {
  if (typeof token === "string") {
    return token;
  }
  if (token && typeof token === "object") {
    if ("pattern" in token && typeof token.pattern === "string") {
      return token.pattern;
    }
    if ("op" in token) {
      return String(token.op);
    }
  }
  return "";
}
function _getRawRedirectOpLength(command, index) {
  for (const op of RAW_REDIRECT_OPS) {
    if (command.startsWith(op, index)) {
      return op.length;
    }
  }
  return 0;
}
function _isWhitespaceChar(char) {
  return /\s/.test(char);
}
function _isAsciiDigit(char) {
  return char >= "0" && char <= "9";
}
function _isPathLikeBacktickSuffix(char) {
  return char === "/" || char === ".";
}
function _isShellTokenBoundaryChar(char) {
  return _isWhitespaceChar(char) || ";|&()<>".includes(char);
}

// src/core/rules-custom.ts
function checkCustomRules(tokens, rules) {
  if (tokens.length === 0 || rules.length === 0) {
    return null;
  }
  const command = getBasename(tokens[0] ?? "");
  const subcommand = extractSubcommand(tokens);
  const shortOpts = extractShortOpts(tokens);
  for (const rule of rules) {
    if (!matchesCommand(command, rule.command)) {
      continue;
    }
    if (rule.subcommand && subcommand !== rule.subcommand) {
      continue;
    }
    if (matchesBlockArgs(tokens, rule.block_args, shortOpts)) {
      return `[${rule.name}] ${rule.reason}`;
    }
  }
  return null;
}
function matchesCommand(command, ruleCommand2) {
  return command === ruleCommand2;
}
var OPTIONS_WITH_VALUES = new Set([
  "-c",
  "-C",
  "--git-dir",
  "--work-tree",
  "--namespace",
  "--config-env"
]);
function extractSubcommand(tokens) {
  let skipNext = false;
  for (let i = 1;i < tokens.length; i++) {
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
        return nextToken;
      }
      return null;
    }
    if (OPTIONS_WITH_VALUES.has(token)) {
      skipNext = true;
      continue;
    }
    if (token.startsWith("-")) {
      for (const opt of OPTIONS_WITH_VALUES) {
        if (token.startsWith(`${opt}=`)) {
          break;
        }
      }
      continue;
    }
    return token;
  }
  return null;
}
function matchesBlockArgs(tokens, blockArgs, shortOpts) {
  const blockArgsSet = new Set(blockArgs);
  for (const token of tokens) {
    if (blockArgsSet.has(token)) {
      return true;
    }
  }
  for (const opt of shortOpts) {
    if (blockArgsSet.has(opt)) {
      return true;
    }
  }
  return false;
}

// src/core/rulebook.ts
function validateRulebook(rulebook) {
  const errors = [];
  const ruleNames = new Set;
  if (!rulebook || typeof rulebook !== "object") {
    return { errors: ["Rulebook must be an object"], ruleNames };
  }
  const rb = rulebook;
  if (rb.rulebook_version !== 1) {
    errors.push("rulebook_version must be 1");
  }
  if (typeof rb.name !== "string" || !NAME_PATTERN.test(rb.name)) {
    errors.push("name: required string matching rule name pattern");
  }
  if (typeof rb.version !== "string" || rb.version === "") {
    errors.push("version: required non-empty string");
  }
  if (!Array.isArray(rb.allowed_commands)) {
    errors.push("allowed_commands: required array");
  } else {
    validateAllowedCommands(rb.allowed_commands, errors);
  }
  if (!Array.isArray(rb.rules)) {
    errors.push("rules: required array");
  } else {
    for (let i = 0;i < rb.rules.length; i++) {
      errors.push(...validateRulebookRule(rb.rules[i], i, ruleNames));
    }
  }
  if (!Array.isArray(rb.tests)) {
    errors.push("tests: required array");
  } else {
    validateFixtures(rb.tests, rb.rules, errors);
  }
  if (Array.isArray(rb.allowed_commands) && Array.isArray(rb.rules)) {
    const allowed = new Set(rb.allowed_commands.filter((cmd) => typeof cmd === "string"));
    for (let i = 0;i < rb.rules.length; i++) {
      const rule = rb.rules[i];
      if (typeof rule.command === "string" && !allowed.has(rule.command)) {
        errors.push(`rules[${i}].command: "${rule.command}" must be listed in allowed_commands`);
      }
    }
  }
  return { errors, ruleNames };
}
function validateAllowedCommands(commands2, errors) {
  const seen = new Set;
  for (let i = 0;i < commands2.length; i++) {
    const command = commands2[i];
    if (typeof command !== "string" || !COMMAND_PATTERN.test(command)) {
      errors.push(`allowed_commands[${i}]: must match command pattern`);
      continue;
    }
    if (seen.has(command)) {
      errors.push(`allowed_commands[${i}]: duplicate command "${command}"`);
      continue;
    }
    seen.add(command);
  }
}
function validateRulebookRule(candidate, index, ruleNames) {
  const errorsForRule = [];
  const prefix = `rules[${index}]`;
  if (!candidate || typeof candidate !== "object")
    return [`${prefix}: must be an object`];
  const r = candidate;
  const namePrefix = `${prefix}.name`;
  const ruleName = typeof r.name === "string" ? r.name : null;
  if (!ruleName) {
    errorsForRule.push(`${namePrefix}: required string`);
  } else if (!NAME_PATTERN.test(ruleName)) {
    errorsForRule.push(`${namePrefix}: must match rule name pattern`);
  } else if (ruleNames.has(ruleName)) {
    errorsForRule.push(`${namePrefix}: duplicate rule name "${ruleName}"`);
  } else {
    ruleNames.add(ruleName);
  }
  if (typeof r.command !== "string" || !COMMAND_PATTERN.test(r.command)) {
    errorsForRule.push(`${prefix}.command: required string matching command pattern`);
  }
  if (r.subcommand !== undefined && (typeof r.subcommand !== "string" || !COMMAND_PATTERN.test(r.subcommand))) {
    errorsForRule.push(`${prefix}.subcommand: must match command pattern`);
  }
  if (!Array.isArray(r.block_args) || r.block_args.length === 0) {
    errorsForRule.push(`${prefix}.block_args: required non-empty array`);
  } else {
    for (let i = 0;i < r.block_args.length; i++) {
      if (typeof r.block_args[i] !== "string" || r.block_args[i] === "") {
        errorsForRule.push(`${prefix}.block_args[${i}]: must be a non-empty string`);
      }
    }
  }
  if (typeof r.reason !== "string" || r.reason === "" || r.reason.length > MAX_REASON_LENGTH) {
    errorsForRule.push(`${prefix}.reason: required non-empty string up to ${MAX_REASON_LENGTH} characters`);
  }
  return errorsForRule;
}
function validateFixtures(tests, rules, errors) {
  const blockedFixtures = new Set;
  const ruleNames = new Set(Array.isArray(rules) ? rules.map((rule) => rule && typeof rule === "object" ? rule.name : null).filter((name) => typeof name === "string") : []);
  for (let i = 0;i < tests.length; i++) {
    const fixture = tests[i];
    if (!fixture || typeof fixture !== "object") {
      errors.push(`tests[${i}]: must be an object`);
      continue;
    }
    const f = fixture;
    if (typeof f.command !== "string" || f.command.trim() === "") {
      errors.push(`tests[${i}].command: required non-empty string`);
    }
    if (f.expect !== "blocked" && f.expect !== "allowed") {
      errors.push(`tests[${i}].expect: must be "blocked" or "allowed"`);
    }
    if (f.rule !== undefined && typeof f.rule !== "string") {
      errors.push(`tests[${i}].rule: must be a string if provided`);
    }
    if (f.expect === "blocked" && typeof f.rule !== "string") {
      errors.push(`tests[${i}].rule: required string for blocked fixtures`);
    }
    if (f.expect === "blocked" && typeof f.rule === "string") {
      blockedFixtures.add(f.rule);
    }
  }
  for (let i = 0;i < (Array.isArray(rules) ? rules.length : 0); i++) {
    const rule = rules[i];
    if (typeof rule.name === "string" && !blockedFixtures.has(rule.name)) {
      errors.push(`rules[${i}]: missing blocked fixture for rule "${rule.name}"`);
    }
  }
  for (const rule of blockedFixtures) {
    if (!ruleNames.has(rule)) {
      errors.push(`tests: blocked fixture references unknown rule "${rule}"`);
    }
  }
}
function runRulebookFixtures(rulebook) {
  const failures = rulebook.tests.flatMap((fixture) => {
    const segments = splitShellCommands(fixture.command).map((tokens) => {
      const result = checkCustomRules(tokens, rulebook.rules);
      return { tokens, result, matchedRule: result?.match(/^\[([^\]]+)]/)?.[1] ?? null };
    });
    const firstSegment = segments[0] ?? { tokens: [], result: null, matchedRule: null };
    if (fixture.expect === "allowed") {
      const blockedSegment = segments.find((segment) => segment.result);
      return blockedSegment ? [
        {
          command: fixture.command,
          message: `expected allowed but matched ${blockedSegment.matchedRule ?? "a rule"}`,
          trace: traceRulebookFixture(blockedSegment.tokens, rulebook.rules)
        }
      ] : [];
    }
    const firstBlockedSegment = segments.find((segment) => segment.result);
    if (!firstBlockedSegment) {
      return [
        {
          command: fixture.command,
          message: `expected blocked by ${fixture.rule ?? "a rule"} but command was allowed`,
          trace: traceRulebookFixture(firstSegment.tokens, rulebook.rules)
        }
      ];
    }
    if (!fixture.rule || firstBlockedSegment.matchedRule === fixture.rule)
      return [];
    return [
      {
        command: fixture.command,
        message: `expected blocked by ${fixture.rule} but matched ${firstBlockedSegment.matchedRule}`,
        trace: traceRulebookFixture(firstBlockedSegment.tokens, rulebook.rules)
      }
    ];
  });
  return { ok: failures.length === 0, failures };
}
function traceRulebookFixture(tokens, rules) {
  return rules.map((rule) => {
    const result = checkCustomRules([...tokens], [rule]);
    return `${result ? "matched" : "skipped"} ${rule.name}`;
  });
}
function assertValidRulebook(rulebook) {
  const result = validateRulebook(rulebook);
  if (result.errors.length > 0) {
    throw new Error(result.errors.join("; "));
  }
  const parsed = rulebook;
  const fixtures = runRulebookFixtures(parsed);
  if (!fixtures.ok) {
    throw new Error(fixtures.failures.map((failure) => `${failure.command}: ${failure.message}`).join("; "));
  }
  return parsed;
}

// src/core/rules-policy/lockfile.ts
import { existsSync as existsSync4, readFileSync as readFileSync3 } from "node:fs";
var SHA256_DIGEST_PATTERN = /^sha256:[a-f0-9]{64}$/;
var RULEBOOK_SOURCE_KINDS = new Set(["local-directory", "github"]);
function readLockfile(path) {
  if (!existsSync4(path)) {
    return { lock: null, errors: [] };
  }
  try {
    const parsed = JSON.parse(readFileSync3(path, "utf-8"));
    if (!parsed || typeof parsed !== "object") {
      return { lock: null, errors: [`malformed lockfile ${path}: must be an object`] };
    }
    const lock = parsed;
    if (lock.version !== 1 || !Array.isArray(lock.rulebooks)) {
      return { lock: null, errors: [`malformed lockfile ${path}`] };
    }
    const parsedEntries = lock.rulebooks.map((entry, index) => parseLockEntry(entry, `${path}: rulebooks[${index}]`));
    const entryErrors = parsedEntries.flatMap((entry) => entry.errors);
    if (entryErrors.length > 0) {
      return { lock: null, errors: [`malformed lockfile ${path}`, ...entryErrors] };
    }
    return {
      lock: {
        version: 1,
        rulebooks: parsedEntries.flatMap((entry) => entry.entry ? [entry.entry] : [])
      },
      errors: []
    };
  } catch (error) {
    return {
      lock: null,
      errors: [
        `malformed lockfile ${path}: ${error instanceof Error ? error.message : String(error)}`
      ]
    };
  }
}
function parseLockEntry(entry, prefix) {
  if (!entry || typeof entry !== "object") {
    return { entry: null, errors: [`${prefix}: must be an object`] };
  }
  const candidate = entry;
  const errors = [
    ...validateRequiredString(candidate, prefix, "spec"),
    ...validateRequiredString(candidate, prefix, "name"),
    ...validateRequiredString(candidate, prefix, "version"),
    ...validateDigest(candidate, prefix),
    ...validateKind(candidate, prefix),
    ...validateKindFields(candidate, prefix)
  ];
  if (errors.length > 0)
    return { entry: null, errors };
  if (candidate.kind === "local-directory") {
    return {
      entry: {
        spec: requiredString(candidate, "spec"),
        kind: "local-directory",
        path: requiredString(candidate, "path"),
        name: requiredString(candidate, "name"),
        version: requiredString(candidate, "version"),
        digest: requiredString(candidate, "digest")
      },
      errors: []
    };
  }
  const githubEntry = {
    spec: requiredString(candidate, "spec"),
    kind: "github",
    owner: requiredString(candidate, "owner"),
    repo: requiredString(candidate, "repo"),
    ref: requiredString(candidate, "ref"),
    commit: requiredString(candidate, "commit"),
    path: requiredString(candidate, "path"),
    name: requiredString(candidate, "name"),
    version: requiredString(candidate, "version"),
    digest: requiredString(candidate, "digest")
  };
  return {
    entry: typeof candidate.display_ref === "string" && candidate.display_ref !== "" ? { ...githubEntry, display_ref: candidate.display_ref } : githubEntry,
    errors: []
  };
}
function validateRequiredString(candidate, prefix, field) {
  return typeof candidate[field] === "string" && candidate[field] !== "" ? [] : [`${prefix}.${field}: required string`];
}
function validateDigest(candidate, prefix) {
  return typeof candidate.digest === "string" && SHA256_DIGEST_PATTERN.test(candidate.digest) ? [] : [`${prefix}.digest: required sha256 digest`];
}
function validateKind(candidate, prefix) {
  if (typeof candidate.kind !== "string") {
    return [`${prefix}.kind: required string`];
  }
  return RULEBOOK_SOURCE_KINDS.has(candidate.kind) ? [] : [`${prefix}.kind: unknown kind "${candidate.kind}"`];
}
function validateKindFields(candidate, prefix) {
  if (candidate.kind === "local-directory") {
    return validateRequiredString(candidate, prefix, "path");
  }
  if (candidate.kind === "github") {
    return ["owner", "repo", "ref", "commit", "path"].flatMap((field) => validateRequiredString(candidate, prefix, field));
  }
  return [];
}
function requiredString(candidate, field) {
  const value = candidate[field];
  if (typeof value !== "string") {
    throw new Error(`Expected ${field} to be validated before reading`);
  }
  return value;
}

// src/core/rules-policy/resolver.ts
import { createHash } from "node:crypto";
import { existsSync as existsSync5, readFileSync as readFileSync4 } from "node:fs";
import { join as join3 } from "node:path";
async function resolveRulebookSource(spec, configDir, options) {
  if (spec.startsWith("builtin:") || spec.startsWith("github:")) {
    throw new Error(`Invalid rulebook source: ${spec}`);
  }
  if (isGitHubRulebookSource(spec)) {
    return resolveGitHubRulebook(spec);
  }
  return resolveLocalRulebook(spec, configDir, options);
}
async function resolveRulebookSourceForSync(spec, configDir, options, previousLock) {
  if (!isGitHubRulebookSource(spec) || options.refresh) {
    return resolveRulebookSource(spec, configDir, options);
  }
  const locked = previousLock?.rulebooks.find((entry) => entry.spec === spec);
  if (!locked || locked.kind !== "github") {
    return resolveRulebookSource(spec, configDir, options);
  }
  return readLockedGitHubRulebook(locked, configDir, options);
}
async function discoverGitHubRepositoryRulebooks(source) {
  const [owner, repo] = source.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid GitHub repository source: ${source}`);
  }
  const metadataResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!metadataResponse.ok) {
    throw new Error(`Failed to inspect ${source}: GitHub returned ${metadataResponse.status}`);
  }
  const metadata = await metadataResponse.json();
  if (!metadata.default_branch) {
    throw new Error(`Failed to inspect ${source}: missing default branch`);
  }
  const commit = await resolveGitHubCommit(owner, repo, metadata.default_branch, source);
  const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${commit}?recursive=1`);
  if (!treeResponse.ok) {
    throw new Error(`Failed to inspect ${source}: GitHub tree returned ${treeResponse.status}`);
  }
  const treeJson = await treeResponse.json();
  const names = (treeJson.tree ?? []).flatMap((entry) => {
    if (entry.type !== "blob" || typeof entry.path !== "string")
      return [];
    const match = entry.path.match(GITHUB_RULEBOOK_PATH_RE);
    return match?.[1] ? [match[1]] : [];
  }).sort();
  if (names.length === 0) {
    throw new Error(`No rulebooks found in ${source} under ${RULES_DIR}/`);
  }
  return names.map((name) => ({
    spec: `${owner}/${repo}#${commit}/${name}`,
    display_ref: metadata.default_branch
  }));
}
function resolveLocalRulebook(spec, configDir, _options) {
  assertBareRulebookName(spec);
  const path = getLocalRulebookPath(configDir, spec);
  if (!existsSync5(path)) {
    throw new Error(`Rulebook source not found: ${spec}`);
  }
  const content = readFileSync4(path, "utf-8");
  const rulebook = assertValidRulebook(JSON.parse(content));
  if (rulebook.name !== spec) {
    throw new Error(`rulebook name "${rulebook.name}" must match local source "${spec}"`);
  }
  return {
    rulebook,
    content,
    entry: {
      spec,
      kind: "local-directory",
      path: spec,
      name: rulebook.name,
      version: rulebook.version,
      digest: sha256Digest(content)
    }
  };
}
async function resolveGitHubRulebook(spec) {
  const parsed = parseGitHubSource(spec);
  const commit = await resolveGitHubCommit(parsed.owner, parsed.repo, parsed.ref, spec);
  const rawResponse = await fetch(`https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${commit}/${parsed.path}`);
  if (!rawResponse.ok) {
    throw new Error(`Failed to fetch ${spec}: GitHub raw returned ${rawResponse.status}`);
  }
  const content = await rawResponse.text();
  const rulebook = assertValidRulebook(JSON.parse(content));
  if (rulebook.name !== parsed.name) {
    throw new Error(`rulebook name "${rulebook.name}" must match GitHub source "${parsed.name}"`);
  }
  return {
    rulebook,
    content,
    entry: {
      spec,
      kind: "github",
      owner: parsed.owner,
      repo: parsed.repo,
      ref: parsed.ref,
      commit,
      path: parsed.path,
      name: rulebook.name,
      version: rulebook.version,
      digest: sha256Digest(content)
    }
  };
}
async function readLockedGitHubRulebook(entry, configDir, options) {
  const cachePath = getRulebookCachePath(entry, { ...options, cacheConfigDir: configDir });
  if (existsSync5(cachePath)) {
    const content = readFileSync4(cachePath, "utf-8");
    if (sha256Digest(content) === entry.digest) {
      return { entry, rulebook: assertRulebookMatchesLockEntry(content, entry), content };
    }
  }
  return fetchLockedGitHubRulebook(entry);
}
async function fetchLockedGitHubRulebook(entry) {
  const rawResponse = await fetch(`https://raw.githubusercontent.com/${entry.owner}/${entry.repo}/${entry.commit}/${entry.path}`);
  if (!rawResponse.ok) {
    throw new Error(`Failed to restore ${entry.spec}: GitHub raw returned ${rawResponse.status}`);
  }
  const content = await rawResponse.text();
  if (sha256Digest(content) !== entry.digest) {
    throw new Error(`locked GitHub digest mismatch for ${entry.spec}; run ${RULE_SYNC_COMMAND}`);
  }
  return { entry, rulebook: assertRulebookMatchesLockEntry(content, entry), content };
}
function assertRulebookMatchesLockEntry(content, entry) {
  const rulebook = assertValidRulebook(JSON.parse(content));
  if (rulebook.name !== entry.name) {
    throw new Error(`rulebook name "${rulebook.name}" must match lock entry "${entry.name}"`);
  }
  return rulebook;
}
async function resolveGitHubCommit(owner, repo, ref, source) {
  const commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${encodeURIComponent(ref)}`);
  if (!commitResponse.ok) {
    throw new Error(`Failed to resolve ${source}: GitHub returned ${commitResponse.status}`);
  }
  const commitJson = await commitResponse.json();
  if (!commitJson.sha) {
    throw new Error(`Failed to resolve commit for ${source}`);
  }
  return commitJson.sha;
}
function getLocalRulebookPath(configDir, name) {
  return join3(configDir, name, RULEBOOK_FILE);
}
function sha256Digest(content) {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

// src/core/rules-policy/scope-policy.ts
function loadRulesPolicy(options = {}) {
  const paths = getPolicyPaths(options);
  const user = readRulesConfig(paths.userConfigPath);
  const project = readRulesConfig(paths.projectConfigPath);
  const errors = [
    ...getLegacyRulesConfigErrors(paths, options),
    ...user.errors.map((error) => `${paths.userConfigPath}: ${error}`),
    ...project.errors.map((error) => `${paths.projectConfigPath}: ${error}`)
  ];
  const userPolicy = user.config ? loadScopePolicy(user.config, paths.userLockPath, dirname4(paths.userConfigPath), options, "user") : emptyScopePolicy();
  const projectPolicy = project.config ? loadScopePolicy(project.config, paths.projectLockPath, dirname4(paths.projectConfigPath), options, "project") : emptyScopePolicy();
  const duplicateNames = getDuplicateRulebookNames([
    ...user.config ? getConfiguredLockEntries(user.config, paths.userLockPath) : [],
    ...project.config ? getConfiguredLockEntries(project.config, paths.projectLockPath) : []
  ]);
  const overrides = { ...user.config?.overrides ?? {}, ...project.config?.overrides ?? {} };
  const knownRuleIds = new Set([...userPolicy.knownRuleIds, ...projectPolicy.knownRuleIds]);
  return {
    rules: applyOverrides([...userPolicy.rules, ...projectPolicy.rules], overrides),
    rulebooks: [...userPolicy.rulebooks, ...projectPolicy.rulebooks],
    errors: [
      ...errors,
      ...userPolicy.errors,
      ...projectPolicy.errors,
      ...duplicateNames.map((name) => `duplicate active rulebook name "${name}"`),
      ...userPolicy.canValidateOverrides && projectPolicy.canValidateOverrides ? getUnknownOverrideErrors(overrides, knownRuleIds) : []
    ],
    userConfig: user.config ?? undefined,
    projectConfig: project.config ?? undefined,
    ...paths
  };
}
function getRulesConfigSourceDisplayMap(configPath) {
  const config = readRulesConfig(configPath).config;
  const lock = readLockfile(getRulesLockPathForConfigPath(configPath)).lock;
  if (!config || !lock)
    return new Map;
  const configuredSources = new Set(config.rules);
  return new Map(lock.rulebooks.filter((entry) => configuredSources.has(entry.spec)).map((entry) => [entry.spec, getRulebookDisplaySource(entry)]));
}
function getRulesConfigRuntimeErrorsForConfig(configPath, lockPath, options) {
  const loaded = loadScopePolicyForConfig(configPath, lockPath, options);
  if (!loaded)
    return [];
  return [...loaded.scope.errors, ...getUnknownOverrideErrorsForScope(loaded.config, loaded.scope)];
}
function loadScopePolicyForConfig(configPath, lockPath, options) {
  const config = readRulesConfig(configPath).config;
  if (!config) {
    return null;
  }
  return {
    config,
    scope: loadScopePolicy(config, lockPath, dirname4(configPath), options, "project")
  };
}
function getUnknownOverrideErrorsForScope(config, scope) {
  return scope.canValidateOverrides ? getUnknownOverrideErrors(config.overrides ?? {}, scope.knownRuleIds) : [];
}
function loadScopePolicy(config, lockPath, configDir, options, source) {
  const lockResult = readLockfile(lockPath);
  if (lockResult.errors.length > 0) {
    return { ...emptyScopePolicy(), errors: lockResult.errors, canValidateOverrides: false };
  }
  const lock = lockResult.lock;
  if (!lock && config.rules.length > 0) {
    return {
      ...emptyScopePolicy(),
      errors: [`missing lockfile ${lockPath}; run ${RULE_SYNC_COMMAND}`],
      canValidateOverrides: false
    };
  }
  const entries = lock?.rulebooks ?? [];
  const entriesBySpec = new Map(entries.map((entry) => [entry.spec, entry]));
  const errors = [];
  const loaded = config.rules.flatMap((spec) => {
    const entry = entriesBySpec.get(spec);
    if (!entry) {
      errors.push(`missing lock entry for ${spec}; run ${RULE_SYNC_COMMAND}`);
      return [];
    }
    const validationErrors = validateLockedRulebook(entry, configDir, options);
    if (validationErrors.length > 0) {
      errors.push(...validationErrors);
      return [];
    }
    const rulebook = JSON.parse(readFileSync5(getRulebookCachePath(entry, { ...options, cacheConfigDir: configDir }), "utf-8"));
    return [
      {
        rules: rulebook.rules.map((rule) => ({ ...rule, name: `${rulebook.name}/${rule.name}` })),
        rulebook: {
          source,
          spec: entry.spec,
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
    entries,
    knownRuleIds: new Set(rules.map((rule) => rule.name)),
    errors,
    canValidateOverrides: errors.length === 0
  };
}
function validateLockedRulebook(entry, configDir, options) {
  const errors = [];
  const cachePath = getRulebookCachePath(entry, { ...options, cacheConfigDir: configDir });
  if (!existsSync6(cachePath)) {
    return [`missing cache entry for ${entry.spec}; run ${RULE_SYNC_COMMAND}`];
  }
  const cacheContent = readFileSync5(cachePath, "utf-8");
  if (sha256Digest(cacheContent) !== entry.digest) {
    errors.push(`cache digest mismatch for ${entry.spec}; run ${RULE_SYNC_COMMAND}`);
  }
  try {
    assertValidRulebook(JSON.parse(cacheContent));
  } catch (error) {
    errors.push(`invalid cached rulebook for ${entry.spec}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (entry.kind === "local-directory") {
    const sourcePath = resolve2(configDir, entry.path);
    const sourceRelative = relative(resolve2(configDir), sourcePath);
    if (sourceRelative === ".." || sourceRelative.startsWith(`..${sep2}`) || isAbsolute3(sourceRelative)) {
      errors.push(`lockfile local source path for ${entry.spec} must stay within ${configDir}; run ${RULE_SYNC_COMMAND}`);
      return errors;
    }
    const localPath = join4(sourcePath, RULEBOOK_FILE);
    if (!existsSync6(localPath)) {
      errors.push(`missing local source for ${entry.spec}; run ${RULE_SYNC_COMMAND}`);
    } else {
      const localContent = readFileSync5(localPath, "utf-8");
      if (sha256Digest(localContent) !== entry.digest) {
        errors.push(getLocalSourceDriftError(entry.spec, localContent));
      }
    }
  }
  return errors;
}
function rulesPolicyToConfig(policy) {
  if (policy.errors.length > 0) {
    return {
      version: 1,
      rules: [],
      failClosedReason: withTerminalPeriod(policy.errors.join("; "))
    };
  }
  return { version: 1, rules: policy.rules };
}
function getLegacyRulesConfigErrors(paths, options) {
  return Array.from(new Set([
    ...getLegacyRulesConfigError(getLegacyUserRulesConfigPath(options), paths.userConfigPath),
    ...getLegacyRulesConfigError(getLegacyProjectRulesConfigPath(options), paths.projectConfigPath)
  ]));
}
function getLegacyRulesConfigError(legacyPath, configPath) {
  if (existsSync6(configPath) || !existsSync6(legacyPath))
    return [];
  try {
    const parsed = JSON.parse(readFileSync5(legacyPath, "utf-8"));
    if (parsed.version === 1)
      return [];
  } catch {}
  return [`legacy rules config location is no longer used; run ${RULE_MIGRATE_COMMAND}`];
}
function getLocalSourceDriftError(spec, content) {
  try {
    assertValidRulebook(JSON.parse(content));
  } catch (error) {
    return `invalid local rulebook for ${spec}: ${error instanceof Error ? error.message : String(error)}; fix the rulebook, then run ${RULE_SYNC_COMMAND}`;
  }
  return `local source digest mismatch for ${spec}; run ${RULE_SYNC_COMMAND}`;
}
function applyOverrides(rules, overrides) {
  return rules.flatMap((rule) => {
    const override = overrides[rule.name];
    if (override === "off") {
      return [];
    }
    if (override && typeof override === "object") {
      return [{ ...rule, reason: override.reason }];
    }
    return [rule];
  });
}
function getUnknownOverrideErrors(overrides, knownRuleIds) {
  return Object.keys(overrides).filter((key) => !knownRuleIds.has(key)).map((key) => `unknown override key "${key}"`);
}
function getDuplicateRulebookNames(entries) {
  const seen = new Set;
  const duplicates = new Set;
  for (const entry of entries) {
    if (seen.has(entry.name)) {
      duplicates.add(entry.name);
      continue;
    }
    seen.add(entry.name);
  }
  return [...duplicates];
}
function getConfiguredLockEntries(config, path) {
  return (readLockfile(path).lock?.rulebooks ?? []).filter((entry) => config.rules.includes(entry.spec));
}
function emptyScopePolicy() {
  return {
    rules: [],
    rulebooks: [],
    entries: [],
    knownRuleIds: new Set,
    errors: [],
    canValidateOverrides: true
  };
}
function withTerminalPeriod(message) {
  return /[.!?]$/.test(message) ? message : `${message}.`;
}

// src/core/rules-policy/sync.ts
import { existsSync as existsSync7, mkdirSync as mkdirSync2, readFileSync as readFileSync6, rmSync, writeFileSync as writeFileSync2 } from "node:fs";
import { dirname as dirname5 } from "node:path";
async function syncRulesConfig(options = {}) {
  const internalOptions = options;
  const scope = getScopePaths(options);
  const scopeConfig = readScopeRulesConfig(scope.configPath);
  if (!scopeConfig.ok)
    return scopeConfig.result;
  const config = scopeConfig.config;
  if (options.check) {
    return checkRulesConfig(config, scope.configDir, scope.lockPath, options);
  }
  try {
    const existingLockResult = readLockfile(scope.lockPath);
    if (options.only && existingLockResult.errors.length > 0) {
      return { ok: false, errors: existingLockResult.errors, entries: [] };
    }
    const previousLock = existingLockResult.errors.length > 0 ? null : existingLockResult.lock;
    const selectedSpecs = options.only ? getSelectedUpdateSpecs(config, previousLock, options.only) : { ok: true, specs: config.rules };
    if (!selectedSpecs.ok) {
      return selectedSpecs.result;
    }
    if (options.only && !previousLock && selectedSpecs.specs.length < config.rules.length) {
      return {
        ok: false,
        errors: [`No lockfile available for partial update; run ${RULE_SYNC_COMMAND}`],
        entries: []
      };
    }
    const resolved = (await Promise.all(selectedSpecs.specs.map((spec) => resolveRulebookSourceForSync(spec, scope.configDir, options, previousLock)))).map((item) => preserveDisplayRef(item, previousLock, internalOptions.discoveredDisplayRefs));
    for (const item of resolved) {
      writeCache(item.content, item.entry, scope.configDir, options);
    }
    const entries = options.only ? mergeSelectedLockEntries(config, previousLock, resolved) : resolved.map((item) => item.entry);
    writeJsonAtomic(scope.lockPath, { version: 1, rulebooks: entries });
    const ruleCountsBySpec = new Map(resolved.map((item) => [item.entry.spec, item.rulebook.rules.length]));
    return {
      ok: true,
      errors: [],
      entries: entries.map((entry) => addRuleCount(entry, ruleCountsBySpec))
    };
  } catch (error) {
    return {
      ok: false,
      errors: [error instanceof Error ? error.message : String(error)],
      entries: []
    };
  }
}
async function testRulebookSources(sources, options = {}) {
  const scope = getScopePaths(options);
  try {
    const resolved = await Promise.all(sources.map((spec) => resolveRulebookSource(spec, scope.configDir, options)));
    const ruleCountsBySpec = new Map(resolved.map((item) => [item.entry.spec, item.rulebook.rules.length]));
    const testCountsBySpec = new Map(resolved.map((item) => [item.entry.spec, item.rulebook.tests.length]));
    const fixtureErrors = resolved.flatMap((item) => runRulebookFixtures(item.rulebook).failures.map((failure) => [
      `${item.entry.spec}: ${failure.command}: ${failure.message}`,
      ...failure.trace.map((line) => `  ${line}`)
    ].join(`
`)));
    return {
      ok: fixtureErrors.length === 0,
      errors: fixtureErrors,
      entries: resolved.map((item) => ({
        ...addRuleCount(item.entry, ruleCountsBySpec),
        testCount: testCountsBySpec.get(item.entry.spec)
      }))
    };
  } catch (error) {
    return {
      ok: false,
      errors: [error instanceof Error ? error.message : String(error)],
      entries: []
    };
  }
}
async function addRulebookSource(source, options = {}) {
  const scope = getScopePaths(options);
  mkdirSync2(scope.configDir, { recursive: true });
  const before = existsSync7(scope.configPath) ? readFileSync6(scope.configPath, "utf-8") : null;
  const scopeConfig = readScopeRulesConfig(scope.configPath);
  if (!scopeConfig.ok)
    return scopeConfig.result;
  const config = scopeConfig.config;
  let discoveredSources;
  try {
    discoveredSources = isGitHubRepositorySource(source) ? await discoverGitHubRepositoryRulebooks(source) : [{ spec: source }];
  } catch (error) {
    return {
      ok: false,
      errors: [error instanceof Error ? error.message : String(error)],
      entries: []
    };
  }
  const sources = discoveredSources.map((item) => item.spec);
  const nextRules = [...config.rules, ...sources.filter((item) => !config.rules.includes(item))];
  if (nextRules.length !== config.rules.length) {
    writeJsonAtomic(scope.configPath, {
      version: 1,
      rules: nextRules,
      overrides: config.overrides ?? {}
    });
  }
  const result = await syncRulesConfig({
    ...options,
    discoveredDisplayRefs: new Map(discoveredSources.filter((item) => !!item.display_ref).map((item) => [item.spec, item.display_ref]))
  });
  if (!result.ok) {
    restoreConfig(scope.configPath, before);
  }
  return result;
}
async function removeRulebookSource(match, options = {}) {
  const scope = getScopePaths(options);
  const loaded = readRulesConfig(scope.configPath);
  if (loaded.errors.length > 0) {
    return { ok: false, errors: loaded.errors, entries: [] };
  }
  if (!loaded.config) {
    return { ok: false, errors: [`No config found at ${scope.configPath}`], entries: [] };
  }
  const lock = readLockfile(scope.lockPath).lock;
  const matches = getRemoveMatches(loaded.config.rules, lock, match);
  if (!matches.ok)
    return matches.result;
  const before = readFileSync6(scope.configPath, "utf-8");
  writeJsonAtomic(scope.configPath, {
    version: 1,
    rules: loaded.config.rules.filter((spec) => !matches.specs.includes(spec)),
    overrides: loaded.config.overrides ?? {}
  });
  const result = await syncRulesConfig(options);
  if (!result.ok) {
    restoreConfig(scope.configPath, before);
  }
  return result;
}
function repairLocalRulesPolicy(options = {}) {
  repairLocalRulesScope({ ...options, global: true });
  repairLocalRulesScope({ ...options, global: false });
}
async function checkRulesConfig(config, configDir, lockPath, options) {
  const result = loadScopePolicy(config, lockPath, configDir, options, "project");
  return { ok: result.errors.length === 0, errors: result.errors, entries: result.entries };
}
function repairLocalRulesScope(options) {
  const scope = getScopePaths(options);
  const loaded = readRulesConfig(scope.configPath);
  if (!loaded.config || loaded.errors.length > 0 || loaded.config.rules.length === 0) {
    return;
  }
  if (!loaded.config.rules.every((spec) => /^[a-zA-Z0-9_-]{1,64}$/.test(spec))) {
    return;
  }
  try {
    const resolved = loaded.config.rules.map((spec) => resolveLocalRulebook(spec, scope.configDir, options));
    for (const item of resolved) {
      writeCache(item.content, item.entry, scope.configDir, options);
    }
    writeJsonAtomic(scope.lockPath, {
      version: 1,
      rulebooks: resolved.map((item) => item.entry)
    });
  } catch {}
}
function preserveDisplayRef(item, previousLock, discoveredDisplayRefs) {
  const previousEntry = previousLock?.rulebooks.find((entry) => entry.spec === item.entry.spec && entry.kind === "github");
  const displayRef = discoveredDisplayRefs?.get(item.entry.spec) ?? (previousEntry?.kind === "github" ? previousEntry.display_ref : undefined);
  if (!displayRef || item.entry.kind !== "github")
    return item;
  return { ...item, entry: { ...item.entry, display_ref: displayRef } };
}
function mergeSelectedLockEntries(config, previousLock, resolved) {
  const configuredSpecs = new Set(config.rules);
  const previousSpecs = new Set(previousLock?.rulebooks.map((entry) => entry.spec) ?? []);
  const resolvedBySpec = new Map(resolved.map((item) => [item.entry.spec, item.entry]));
  return [
    ...(previousLock?.rulebooks.filter((entry) => configuredSpecs.has(entry.spec)) ?? []).map((entry) => resolvedBySpec.get(entry.spec) ?? entry),
    ...resolved.filter((item) => !previousSpecs.has(item.entry.spec)).map((item) => item.entry)
  ];
}
function addRuleCount(entry, ruleCountsBySpec) {
  return {
    ...entry,
    ruleCount: ruleCountsBySpec.get(entry.spec)
  };
}
function writeCache(content, entry, configDir, options) {
  const path = getRulebookCachePath(entry, { ...options, cacheConfigDir: configDir });
  mkdirSync2(dirname5(path), { recursive: true });
  writeFileSync2(path, content, "utf-8");
}
function restoreConfig(path, content) {
  if (content === null) {
    rmSync(path, { force: true });
    return;
  }
  writeFileSync2(path, content, "utf-8");
}

// src/core/config.ts
var DEFAULT_CONFIG2 = {
  version: 1,
  rules: []
};
function loadConfig(cwd, options) {
  const safeCwd = typeof cwd === "string" ? cwd : process.cwd();
  if (options?.repairLocalRulebooks) {
    repairLocalRulesPolicy({ cwd: safeCwd, userConfigDir: options.userConfigDir });
  }
  const userConfigDir = options?.userConfigDir ?? join5(homedir3(), ".cc-safety-net");
  const userConfigPath = join5(userConfigDir, "config.json");
  const projectConfigPath = join5(safeCwd, ".safety-net.json");
  const userConfig = loadSingleConfig(userConfigPath);
  const projectConfig = loadSingleConfig(projectConfigPath);
  let rulesPolicyConfig = rulesPolicyToConfig(loadRulesPolicy({ cwd: safeCwd, userConfigDir: options?.userConfigDir }));
  if (rulesPolicyConfig.failClosedReason && (userConfig || projectConfig)) {
    rulesPolicyConfig = DEFAULT_CONFIG2;
  }
  return mergeConfigs(mergeConfigs(userConfig, projectConfig), rulesPolicyConfig);
}
function loadSingleConfig(path) {
  if (!existsSync8(path)) {
    return null;
  }
  try {
    const content = readFileSync7(path, "utf-8");
    if (!content.trim()) {
      return null;
    }
    const parsed = JSON.parse(content);
    const result = validateConfig(parsed);
    if (result.errors.length > 0) {
      return null;
    }
    const cfg = parsed;
    return {
      version: cfg.version,
      rules: cfg.rules ?? []
    };
  } catch {
    return null;
  }
}
function mergeConfigs(userConfig, projectConfig) {
  if (userConfig?.failClosedReason || projectConfig?.failClosedReason) {
    return {
      version: 1,
      rules: [],
      failClosedReason: userConfig?.failClosedReason ?? projectConfig?.failClosedReason
    };
  }
  if (!userConfig && !projectConfig) {
    return DEFAULT_CONFIG2;
  }
  if (!userConfig) {
    return projectConfig ?? DEFAULT_CONFIG2;
  }
  if (!projectConfig) {
    return userConfig;
  }
  const projectRuleNames = new Set(projectConfig.rules.map((r) => r.name.toLowerCase()));
  const mergedRules = [
    ...userConfig.rules.filter((r) => !projectRuleNames.has(r.name.toLowerCase())),
    ...projectConfig.rules
  ];
  return {
    version: 1,
    rules: mergedRules
  };
}
function validateConfig(config) {
  const errors = [];
  const ruleNames = new Set;
  if (!config || typeof config !== "object") {
    errors.push("Config must be an object");
    return { errors, ruleNames };
  }
  const cfg = config;
  if (cfg.version !== 1) {
    errors.push("version must be 1");
  }
  if (cfg.rules !== undefined) {
    if (!Array.isArray(cfg.rules)) {
      errors.push("rules must be an array");
    } else {
      for (let i = 0;i < cfg.rules.length; i++) {
        const rule = cfg.rules[i];
        const ruleErrors = validateRule(rule, i, ruleNames);
        errors.push(...ruleErrors);
      }
    }
  }
  return { errors, ruleNames };
}
function validateRule(rule, index, ruleNames) {
  const errors = [];
  const prefix = `rules[${index}]`;
  if (!rule || typeof rule !== "object") {
    errors.push(`${prefix}: must be an object`);
    return errors;
  }
  const r = rule;
  if (typeof r.name !== "string") {
    errors.push(`${prefix}.name: required string`);
  } else {
    if (!NAME_PATTERN.test(r.name)) {
      errors.push(`${prefix}.name: must match pattern (letters, numbers, hyphens, underscores; max 64 chars)`);
    }
    const lowerName = r.name.toLowerCase();
    if (ruleNames.has(lowerName)) {
      errors.push(`${prefix}.name: duplicate rule name "${r.name}"`);
    } else {
      ruleNames.add(lowerName);
    }
  }
  if (typeof r.command !== "string") {
    errors.push(`${prefix}.command: required string`);
  } else if (!COMMAND_PATTERN.test(r.command)) {
    errors.push(`${prefix}.command: must match pattern (letters, numbers, hyphens, underscores)`);
  }
  if (r.subcommand !== undefined) {
    if (typeof r.subcommand !== "string") {
      errors.push(`${prefix}.subcommand: must be a string if provided`);
    } else if (!COMMAND_PATTERN.test(r.subcommand)) {
      errors.push(`${prefix}.subcommand: must match pattern (letters, numbers, hyphens, underscores)`);
    }
  }
  if (!Array.isArray(r.block_args)) {
    errors.push(`${prefix}.block_args: required array`);
  } else {
    if (r.block_args.length === 0) {
      errors.push(`${prefix}.block_args: must have at least one element`);
    }
    for (let i = 0;i < r.block_args.length; i++) {
      const arg = r.block_args[i];
      if (typeof arg !== "string") {
        errors.push(`${prefix}.block_args[${i}]: must be a string`);
      } else if (arg === "") {
        errors.push(`${prefix}.block_args[${i}]: must not be empty`);
      }
    }
  }
  if (typeof r.reason !== "string") {
    errors.push(`${prefix}.reason: required string`);
  } else if (r.reason === "") {
    errors.push(`${prefix}.reason: must not be empty`);
  } else if (r.reason.length > MAX_REASON_LENGTH) {
    errors.push(`${prefix}.reason: must be at most ${MAX_REASON_LENGTH} characters`);
  }
  return errors;
}
function validateConfigFile(path) {
  return validateParsedConfigFile(path, validateConfig);
}
function readConfigFileInput(path) {
  const errors = [];
  const ruleNames = new Set;
  if (!existsSync8(path)) {
    errors.push(`File not found: ${path}`);
    return { ok: false, result: { errors, ruleNames } };
  }
  try {
    const content = readFileSync7(path, "utf-8");
    if (!content.trim()) {
      errors.push("Config file is empty");
      return { ok: false, result: { errors, ruleNames } };
    }
    return { ok: true, parsed: JSON.parse(content) };
  } catch (e) {
    errors.push(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    return { ok: false, result: { errors, ruleNames } };
  }
}
function getUserConfigPath() {
  return join5(homedir3(), ".cc-safety-net", "config.json");
}
function getProjectConfigPath(cwd) {
  return resolve3(cwd ?? process.cwd(), ".safety-net.json");
}
function getLegacyProjectConfigPath(cwd) {
  return getProjectConfigPath(cwd);
}
function validateRulesConfigFile(path) {
  const loaded = readConfigFileInput(path);
  if (!loaded.ok)
    return loaded.result;
  const result = validateRulesConfig(loaded.parsed);
  return { errors: result.errors, ruleNames: result.sources };
}
function validateParsedConfigFile(path, validate) {
  const loaded = readConfigFileInput(path);
  if (!loaded.ok)
    return loaded.result;
  return validate(loaded.parsed);
}

// src/bin/doctor/config.ts
function getConfigSourceInfo(path) {
  if (!existsSync9(path)) {
    return { path, exists: false, valid: false, ruleCount: 0 };
  }
  const validation = validateConfigFile(path);
  if (validation.errors.length > 0) {
    return {
      path,
      exists: true,
      valid: false,
      ruleCount: 0,
      errors: validation.errors
    };
  }
  return {
    path,
    exists: true,
    valid: true,
    ruleCount: validation.ruleNames.size
  };
}
function isValidRule(rule) {
  if (typeof rule !== "object" || rule === null)
    return false;
  const r = rule;
  return typeof r.name === "string" && typeof r.command === "string" && Array.isArray(r.block_args) && typeof r.reason === "string";
}
function loadSingleConfigRules(path) {
  if (!existsSync9(path))
    return [];
  try {
    const content = readFileSync8(path, "utf-8");
    if (!content.trim())
      return [];
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.rules))
      return [];
    return parsed.rules.filter(isValidRule);
  } catch {
    return [];
  }
}
function mergeRulesWithTracking(userRules, projectRules) {
  const projectRuleNames = new Set(projectRules.map((r) => r.name.toLowerCase()));
  const shadowedRules = [];
  const effectiveRules = [];
  for (const rule of userRules) {
    if (projectRuleNames.has(rule.name.toLowerCase())) {
      shadowedRules.push({ name: rule.name, shadowedBy: "project" });
    } else {
      effectiveRules.push({
        source: "user",
        name: rule.name,
        command: rule.command,
        subcommand: rule.subcommand,
        blockArgs: rule.block_args,
        reason: rule.reason
      });
    }
  }
  for (const rule of projectRules) {
    effectiveRules.push({
      source: "project",
      name: rule.name,
      command: rule.command,
      subcommand: rule.subcommand,
      blockArgs: rule.block_args,
      reason: rule.reason
    });
  }
  return { effectiveRules, shadowedRules };
}
function getConfigInfo(cwd, options) {
  const userPath = options?.userConfigPath ?? getUserConfigPath();
  const projectPath = options?.projectConfigPath ?? getProjectConfigPath(cwd);
  const userConfig = getConfigSourceInfo(userPath);
  const projectConfig = getConfigSourceInfo(projectPath);
  const userRules = userConfig.valid ? loadSingleConfigRules(userPath) : [];
  const projectRules = projectConfig.valid ? loadSingleConfigRules(projectPath) : [];
  const { effectiveRules, shadowedRules } = mergeRulesWithTracking(userRules, projectRules);
  return {
    userConfig,
    projectConfig,
    effectiveRules,
    shadowedRules
  };
}

// src/core/env.ts
var ENV_FLAGS = {
  strict: { name: "CC_SAFETY_NET_STRICT", legacyName: "SAFETY_NET_STRICT" },
  paranoid: { name: "CC_SAFETY_NET_PARANOID", legacyName: "SAFETY_NET_PARANOID" },
  paranoidRm: { name: "CC_SAFETY_NET_PARANOID_RM", legacyName: "SAFETY_NET_PARANOID_RM" },
  paranoidInterpreters: {
    name: "CC_SAFETY_NET_PARANOID_INTERPRETERS",
    legacyName: "SAFETY_NET_PARANOID_INTERPRETERS"
  },
  worktree: { name: "CC_SAFETY_NET_WORKTREE", legacyName: "SAFETY_NET_WORKTREE" },
  debug: { name: "CC_SAFETY_NET_DEBUG" }
};
function envTruthy(flag) {
  const value = typeof flag === "string" ? process.env[flag] : getEnvFlagValue(flag);
  return value === "1" || value?.toLowerCase() === "true";
}
function getEnvFlagValue(flag) {
  if (process.env[flag.name] !== undefined) {
    return process.env[flag.name];
  }
  if (flag.legacyName) {
    return process.env[flag.legacyName];
  }
  return;
}
function envFlagIsSet(flag) {
  return process.env[flag.name] !== undefined || !!flag.legacyName && process.env[flag.legacyName] !== undefined;
}

// src/bin/doctor/environment.ts
var ENV_VARS = [
  {
    flag: ENV_FLAGS.strict,
    description: "Fail-closed on unparseable commands",
    defaultBehavior: "permissive"
  },
  {
    flag: ENV_FLAGS.paranoid,
    description: "Enable all paranoid checks",
    defaultBehavior: "off"
  },
  {
    flag: ENV_FLAGS.paranoidRm,
    description: "Block rm -rf even within cwd",
    defaultBehavior: "off"
  },
  {
    flag: ENV_FLAGS.paranoidInterpreters,
    description: "Block interpreter one-liners",
    defaultBehavior: "off"
  },
  {
    flag: ENV_FLAGS.worktree,
    description: "Allow local git discards in linked worktrees",
    defaultBehavior: "off"
  },
  {
    flag: ENV_FLAGS.debug,
    description: "Log allowed hook commands for debugging",
    defaultBehavior: "off"
  }
];
function getEnvironmentInfo() {
  return [
    ...ENV_VARS.map((v) => ({
      name: v.flag.name,
      value: getEnvFlagValue(v.flag),
      isSet: envFlagIsSet(v.flag),
      legacyName: v.flag.legacyName,
      legacyValue: v.flag.legacyName ? process.env[v.flag.legacyName] : undefined,
      legacyIsSet: v.flag.legacyName ? process.env[v.flag.legacyName] !== undefined : undefined,
      description: v.description,
      defaultBehavior: v.defaultBehavior
    })),
    {
      name: "CC_SAFETY_NET_HOME",
      value: process.env.CC_SAFETY_NET_HOME,
      isSet: process.env.CC_SAFETY_NET_HOME !== undefined,
      description: "Override user-scope config/cache directory",
      defaultBehavior: "~/.cc-safety-net"
    }
  ];
}

// src/bin/utils/colors.ts
function shouldUseColor() {
  return Boolean(process.stdout.isTTY && !process.env.NO_COLOR);
}
var green = (s) => shouldUseColor() ? `\x1B[32m${s}\x1B[0m` : s;
var yellow = (s) => shouldUseColor() ? `\x1B[33m${s}\x1B[0m` : s;
var blue = (s) => shouldUseColor() ? `\x1B[34m${s}\x1B[0m` : s;
var magenta = (s) => shouldUseColor() ? `\x1B[35m${s}\x1B[0m` : s;
var cyan = (s) => shouldUseColor() ? `\x1B[36m${s}\x1B[0m` : s;
var red = (s) => shouldUseColor() ? `\x1B[31m${s}\x1B[0m` : s;
var dim = (s) => shouldUseColor() ? `\x1B[2m${s}\x1B[0m` : s;
var bold = (s) => shouldUseColor() ? `\x1B[1m${s}\x1B[0m` : s;
var colors = {
  green,
  yellow,
  blue,
  magenta,
  cyan,
  red,
  dim,
  bold
};
var ANSI_RESET = "\x1B[0m";
var DISTINCT_COLORS = [
  39,
  82,
  198,
  226,
  208,
  51,
  196,
  46,
  201,
  214,
  93,
  154,
  220,
  27,
  49,
  190,
  200,
  33,
  129,
  227,
  45,
  160,
  63,
  118,
  123,
  202
];
function createRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
function getShuffledPalette(seed) {
  const palette = [...DISTINCT_COLORS];
  const random = createRandom(seed);
  for (let i = palette.length - 1;i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = palette[i];
    palette[i] = palette[j];
    palette[j] = temp;
  }
  return palette;
}
function generateDistinctColor(index, seed = 0) {
  if (!shouldUseColor())
    return "";
  const palette = getShuffledPalette(seed);
  const colorCode = palette[index % palette.length];
  return `\x1B[38;5;${colorCode}m`;
}
function colorizeToken(token, index, seed = 0) {
  if (!shouldUseColor())
    return `"${token}"`;
  const colorCode = generateDistinctColor(index, seed);
  return `${colorCode}"${token}"${ANSI_RESET}`;
}

// src/bin/doctor/format.ts
var PLATFORM_NAMES = {
  "claude-code": "Claude Code",
  opencode: "OpenCode",
  "gemini-cli": "Gemini CLI",
  "copilot-cli": "Copilot CLI",
  codex: "Codex"
};
function formatAsciiTable(options) {
  const rawRows = options.rawRows ?? options.rows;
  const colWidths = (options.headers ?? rawRows[0] ?? []).map((h, i) => {
    const maxDataWidth = Math.max(...rawRows.map((r) => r[i]?.length ?? 0));
    return Math.max(h.length, maxDataWidth);
  });
  const pad = (s, w, raw) => s + " ".repeat(Math.max(0, w - raw.length));
  const line = (char, corners) => corners[0] + colWidths.map((w) => char.repeat(w + 2)).join(corners[1]) + corners[2];
  const formatRow = (cells, rawCells) => `│ ${cells.map((c, i) => pad(c, colWidths[i] ?? 0, rawCells[i] ?? "")).join(" │ ")} │`;
  const headerLines = options.headers ? [`   ${formatRow(options.headers, options.headers)}`, `   ${line("─", ["├", "┼", "┤"])}`] : [];
  return [
    `   ${line("─", ["┌", "┬", "┐"])}`,
    ...headerLines,
    ...options.rows.map((r, i) => `   ${formatRow(r, rawRows[i] ?? [])}`),
    `   ${line("─", ["└", "┴", "┘"])}`
  ].join(`
`);
}
function formatHooksSection(hooks) {
  const lines = [];
  lines.push("Hook Integration");
  lines.push(formatHooksTable(hooks));
  const failures = [];
  const warnings = [];
  const errors = [];
  for (const hook of hooks) {
    const platformName = PLATFORM_NAMES[hook.platform] ?? hook.platform;
    if (hook.selfTest) {
      for (const result of hook.selfTest.results) {
        if (!result.passed) {
          failures.push({ platform: platformName, result });
        }
      }
    }
    if (hook.errors && hook.errors.length > 0) {
      for (const err of hook.errors) {
        if (hook.status === "configured") {
          warnings.push({ platform: platformName, message: err });
        } else {
          errors.push({ platform: platformName, message: err });
        }
      }
    }
  }
  if (failures.length > 0) {
    lines.push("");
    lines.push(colors.red("   Failures:"));
    for (const f of failures) {
      lines.push(colors.red(`   • ${f.platform}: ${f.result.description}`));
      lines.push(colors.red(`     expected ${f.result.expected}, got ${f.result.actual}`));
    }
  }
  for (const w of warnings) {
    lines.push(`   Warning (${w.platform}): ${w.message}`);
  }
  for (const e of errors) {
    lines.push(colors.red(`   Error (${e.platform}): ${e.message}`));
  }
  return lines.join(`
`);
}
function formatHooksTable(hooks) {
  const headers = ["Platform", "Status", "Tests"];
  const getStatusDisplay = (h) => {
    switch (h.status) {
      case "configured":
        return { text: "Configured", colored: colors.green("Configured") };
      case "disabled":
        return { text: "Disabled", colored: colors.yellow("Disabled") };
      case "n/a":
        return { text: "N/A", colored: colors.dim("N/A") };
    }
  };
  const rowData = hooks.map((h) => {
    const platformName = PLATFORM_NAMES[h.platform] ?? h.platform;
    const statusDisplay = getStatusDisplay(h);
    let testsText = "-";
    if (h.status === "configured" && h.selfTest) {
      const label = h.selfTest.failed > 0 ? "FAIL" : "OK";
      testsText = `${h.selfTest.passed}/${h.selfTest.total} ${label}`;
    }
    return {
      colored: [platformName, statusDisplay.colored, testsText],
      raw: [platformName, statusDisplay.text, testsText]
    };
  });
  const rows = rowData.map((r) => r.colored);
  const rawRows = rowData.map((r) => r.raw);
  return formatAsciiTable({ headers, rows, rawRows });
}
function formatRulesTable(rules) {
  if (rules.length === 0) {
    return "   (no custom rules)";
  }
  const headers = ["Source", "Name", "Command", "Block Args"];
  const rows = rules.map((r) => [
    r.source,
    r.name,
    r.subcommand ? `${r.command} ${r.subcommand}` : r.command,
    r.blockArgs.join(", ")
  ]);
  return formatAsciiTable({ headers, rows });
}
function formatConfigSection(report) {
  const lines = [];
  lines.push("Configuration");
  lines.push(formatConfigTable(report.userConfig, report.projectConfig));
  lines.push("");
  if (report.effectiveRules.length > 0) {
    lines.push(`   Effective rules (${report.effectiveRules.length} total):`);
    lines.push(formatRulesTable(report.effectiveRules));
  } else {
    lines.push("   Effective rules: (none - using built-in rules only)");
  }
  for (const shadow of report.shadowedRules) {
    lines.push("");
    lines.push(`   Note: Project rule "${shadow.name}" shadows user rule with same name`);
  }
  return lines.join(`
`);
}
function formatConfigTable(userConfig, projectConfig) {
  const headers = ["Scope", "Status"];
  const getStatusDisplay = (config) => {
    if (!config.exists) {
      return { text: "N/A", colored: colors.dim("N/A") };
    }
    if (!config.valid) {
      const errMsg = config.errors?.[0] ?? "unknown error";
      const text = `Invalid (${errMsg})`;
      return { text, colored: colors.red(text) };
    }
    return { text: "Configured", colored: colors.green("Configured") };
  };
  const userStatus = getStatusDisplay(userConfig);
  const projectStatus = getStatusDisplay(projectConfig);
  const rows = [
    ["User", userStatus.colored],
    ["Project", projectStatus.colored]
  ];
  const rawRows = [
    ["User", userStatus.text],
    ["Project", projectStatus.text]
  ];
  return formatAsciiTable({ headers, rows, rawRows });
}
function formatEnvironmentSection(envVars) {
  const lines = [];
  lines.push("Environment");
  lines.push(formatEnvironmentTable(envVars));
  return lines.join(`
`);
}
function formatEnvironmentTable(envVars) {
  const headers = ["Variable", "Status", "Legacy"];
  const rows = envVars.map((v) => {
    const statusIcon = v.isSet ? colors.green("✓") : colors.dim("✗");
    const legacyStatus = v.legacyName && v.legacyIsSet ? `${v.legacyName} ${colors.green("✓")}` : v.legacyName ?? "";
    return [v.name, statusIcon, legacyStatus];
  });
  const rawRows = envVars.map((v) => [
    v.name,
    v.isSet ? "✓" : "✗",
    v.legacyName && v.legacyIsSet ? `${v.legacyName} ✓` : v.legacyName ?? ""
  ]);
  return formatAsciiTable({ headers, rows, rawRows });
}
function formatActivitySection(activity) {
  const lines = [];
  if (activity.totalBlocked === 0) {
    lines.push("Recent Activity");
    lines.push("   No blocked commands in the last 7 days");
    lines.push("   Tip: This is normal for new installations");
  } else {
    lines.push(`Recent Activity (${activity.totalBlocked} blocked / ${activity.sessionCount} sessions)`);
    lines.push(formatActivityTable(activity.recentEntries));
  }
  return lines.join(`
`);
}
function formatActivityTable(entries) {
  const headers = ["Time", "Command"];
  const rows = entries.map((e) => {
    const cmd = e.command.length > 40 ? `${e.command.slice(0, 37)}...` : e.command;
    return [e.relativeTime, cmd];
  });
  return formatAsciiTable({ headers, rows });
}
function formatUpdateSection(update) {
  const lines = [];
  lines.push("Update Check");
  const rowData = [];
  if (update.latestVersion === null && !update.error) {
    rowData.push({
      label: "Status",
      value: colors.dim("Skipped"),
      rawValue: "Skipped"
    });
    rowData.push({
      label: "Installed",
      value: update.currentVersion,
      rawValue: update.currentVersion
    });
    lines.push(formatUpdateTable(rowData));
    return lines.join(`
`);
  }
  if (update.error) {
    rowData.push({
      label: "Status",
      value: `${colors.yellow("⚠")} Error`,
      rawValue: "⚠ Error"
    });
    rowData.push({
      label: "Installed",
      value: update.currentVersion,
      rawValue: update.currentVersion
    });
    rowData.push({
      label: "Error",
      value: colors.dim(update.error),
      rawValue: update.error
    });
    lines.push(formatUpdateTable(rowData));
    return lines.join(`
`);
  }
  if (update.updateAvailable) {
    rowData.push({
      label: "Status",
      value: `${colors.yellow("⚠")} Update Available`,
      rawValue: "⚠ Update Available"
    });
    rowData.push({
      label: "Current",
      value: update.currentVersion,
      rawValue: update.currentVersion
    });
    rowData.push({
      label: "Latest",
      value: colors.green(update.latestVersion ?? ""),
      rawValue: update.latestVersion ?? ""
    });
    lines.push(formatUpdateTable(rowData));
    lines.push("");
    lines.push("   Run: bunx cc-safety-net@latest doctor");
    lines.push("   Or:  npx cc-safety-net@latest doctor");
    return lines.join(`
`);
  }
  rowData.push({
    label: "Status",
    value: `${colors.green("✓")} Up to date`,
    rawValue: "✓ Up to date"
  });
  rowData.push({
    label: "Version",
    value: update.currentVersion,
    rawValue: update.currentVersion
  });
  lines.push(formatUpdateTable(rowData));
  return lines.join(`
`);
}
function formatUpdateTable(rowData) {
  const rows = rowData.map((r) => [r.label, r.value]);
  const rawRows = rowData.map((r) => [r.label, r.rawValue]);
  return formatAsciiTable({ rows, rawRows });
}
function formatSystemInfoSection(system) {
  const lines = [];
  lines.push("System Info");
  lines.push(formatSystemInfoTable(system));
  return lines.join(`
`);
}
function formatSystemInfoTable(system) {
  const headers = ["Component", "Version"];
  const formatValue = (value) => {
    if (value === null)
      return colors.dim("not found");
    return value;
  };
  const rawValue = (value) => {
    return value ?? "not found";
  };
  const rowData = [
    { label: "cc-safety-net", value: system.version },
    { label: "Claude Code", value: system.claudeCodeVersion },
    { label: "OpenCode", value: system.openCodeVersion },
    { label: "Gemini CLI", value: system.geminiCliVersion },
    { label: "Copilot CLI", value: system.copilotCliVersion },
    { label: "Node.js", value: system.nodeVersion },
    { label: "npm", value: system.npmVersion },
    { label: "Bun", value: system.bunVersion },
    { label: "Platform", value: system.platform }
  ];
  const rows = rowData.map((r) => [r.label, formatValue(r.value)]);
  const rawRows = rowData.map((r) => [r.label, rawValue(r.value)]);
  return formatAsciiTable({ headers, rows, rawRows });
}
function formatSummary(report) {
  const hooksFailed = report.hooks.every((h) => h.status !== "configured");
  const selfTestFailed = report.hooks.some((h) => h.selfTest && h.selfTest.failed > 0);
  const configFailed = (report.userConfig.errors?.length ?? 0) > 0 || (report.projectConfig.errors?.length ?? 0) > 0;
  const failures = [hooksFailed, selfTestFailed, configFailed].filter(Boolean).length;
  let warnings = 0;
  if (report.update.updateAvailable)
    warnings++;
  if (report.activity.totalBlocked === 0)
    warnings++;
  warnings += report.shadowedRules.length;
  if (failures > 0) {
    return colors.red(`
${failures} check(s) failed.`);
  }
  if (warnings > 0) {
    return colors.yellow(`
All checks passed with ${warnings} warning(s).`);
  }
  return colors.green(`
All checks passed.`);
}

// src/bin/doctor/hooks.ts
import { existsSync as existsSync12, readdirSync as readdirSync2, readFileSync as readFileSync11 } from "node:fs";
import { homedir as homedir5, tmpdir as tmpdir3 } from "node:os";
import { join as join8 } from "node:path";

// src/core/analyze/dangerous-text.ts
function dangerousInText(text) {
  const t = text.toLowerCase();
  const stripped = t.trimStart();
  const isEchoOrRg = stripped.startsWith("echo ") || stripped.startsWith("rg ");
  const patterns = [
    {
      regex: /\brm\s+(-[^\s]*r[^\s]*\s+-[^\s]*f|-[^\s]*f[^\s]*\s+-[^\s]*r|-[^\s]*rf|-[^\s]*fr)\b/,
      reason: "rm -rf"
    },
    {
      regex: /\bgit\s+reset\s+--hard\b/,
      reason: "git reset --hard"
    },
    {
      regex: /\bgit\s+reset\s+--merge\b/,
      reason: "git reset --merge"
    },
    {
      regex: /\bgit\s+clean\s+(-[^\s]*f|-f)\b/,
      reason: "git clean -f"
    },
    {
      regex: /\bgit\s+push\s+[^|;]*(-f\b|--force\b)(?!-with-lease)/,
      reason: "git push --force (use --force-with-lease instead)"
    },
    {
      regex: /\bgit\s+branch\s+-D\b/,
      reason: "git branch -D",
      caseSensitive: true
    },
    {
      regex: /\bgit\s+stash\s+(drop|clear)\b/,
      reason: "git stash drop/clear"
    },
    {
      regex: /\bgit\s+checkout\s+--\s/,
      reason: "git checkout --"
    },
    {
      regex: /\bgit\s+restore\b(?!.*--(staged|help))/,
      reason: "git restore (without --staged)"
    },
    {
      regex: /\bfind\b[^\n;|&]*\s-delete\b/,
      reason: "find -delete",
      skipForEchoRg: true
    }
  ];
  for (const { regex, reason, skipForEchoRg, caseSensitive } of patterns) {
    if (skipForEchoRg && isEchoOrRg)
      continue;
    const target = caseSensitive ? text : t;
    if (regex.test(target)) {
      return reason;
    }
  }
  return null;
}

// src/core/analyze/constants.ts
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
  "timeout",
  "time",
  "sleep",
  "watch",
  "logger",
  "write",
  "wall",
  "mesg",
  "notify-send"
]);

// src/core/analyze/rm-flags.ts
function hasRecursiveForceFlags(tokens) {
  let hasRecursive = false;
  let hasForce = false;
  for (const token of tokens) {
    if (token === "--")
      break;
    if (token === "-r" || token === "-R" || token === "--recursive") {
      hasRecursive = true;
    } else if (token === "-f" || token === "--force") {
      hasForce = true;
    } else if (token.startsWith("-") && !token.startsWith("--")) {
      if (token.includes("r") || token.includes("R"))
        hasRecursive = true;
      if (token.includes("f"))
        hasForce = true;
    }
  }
  return hasRecursive && hasForce;
}

// src/core/analyze/find.ts
var REASON_FIND_DELETE = "find -delete permanently removes files. Use -print first to preview.";
function analyzeFind(tokens) {
  if (findHasDelete(tokens.slice(1))) {
    return REASON_FIND_DELETE;
  }
  for (let i = 0;i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "-exec" || token === "-execdir") {
      const execTokens = tokens.slice(i + 1);
      const semicolonIdx = execTokens.indexOf(";");
      const plusIdx = execTokens.indexOf("+");
      const endIdx = semicolonIdx !== -1 && plusIdx !== -1 ? Math.min(semicolonIdx, plusIdx) : semicolonIdx !== -1 ? semicolonIdx : plusIdx !== -1 ? plusIdx : execTokens.length;
      let execCommand = execTokens.slice(0, endIdx);
      execCommand = stripWrappers(execCommand);
      if (execCommand.length > 0) {
        let head = getBasename(execCommand[0] ?? "");
        if (head === "busybox" && execCommand.length > 1) {
          execCommand = execCommand.slice(1);
          head = getBasename(execCommand[0] ?? "");
        }
        if (head === "rm" && hasRecursiveForceFlags(execCommand)) {
          return "find -exec rm -rf is dangerous. Use explicit file list instead.";
        }
      }
    }
  }
  return null;
}
function findHasDelete(tokens) {
  let i = 0;
  let insideExec = false;
  let execDepth = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      i++;
      continue;
    }
    if (token === "-exec" || token === "-execdir") {
      insideExec = true;
      execDepth++;
      i++;
      continue;
    }
    if (insideExec && (token === ";" || token === "+")) {
      execDepth--;
      if (execDepth === 0) {
        insideExec = false;
      }
      i++;
      continue;
    }
    if (insideExec) {
      i++;
      continue;
    }
    if (token === "-name" || token === "-iname" || token === "-path" || token === "-ipath" || token === "-regex" || token === "-iregex" || token === "-type" || token === "-user" || token === "-group" || token === "-perm" || token === "-size" || token === "-mtime" || token === "-ctime" || token === "-atime" || token === "-newer" || token === "-printf" || token === "-fprint" || token === "-fprintf") {
      i += 2;
      continue;
    }
    if (token === "-delete") {
      return true;
    }
    i++;
  }
  return false;
}

// src/core/analyze/interpreters.ts
function extractInterpreterCodeArg(tokens) {
  for (let i = 1;i < tokens.length; i++) {
    const token = tokens[i];
    if (!token)
      continue;
    if ((token === "-c" || token === "-e") && tokens[i + 1]) {
      return tokens[i + 1] ?? null;
    }
  }
  return null;
}
function containsDangerousCode(code) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return true;
    }
  }
  return false;
}

// src/core/analyze/child-command.ts
function normalizeChildCommand(tokens, context) {
  const wrapperInfo = stripWrappersWithInfo([...tokens], context.cwd);
  const envAssignments = new Map(context.envAssignments ?? []);
  for (const [k, v] of wrapperInfo.envAssignments) {
    envAssignments.set(k, v);
  }
  const childTokens = getBasename(wrapperInfo.tokens[0] ?? "").toLowerCase() === "busybox" && wrapperInfo.tokens.length > 1 ? wrapperInfo.tokens.slice(1) : wrapperInfo.tokens;
  return {
    tokens: childTokens,
    cwd: wrapperInfo.cwd === null ? undefined : wrapperInfo.cwd ?? context.cwd,
    wrapperCwd: wrapperInfo.cwd,
    envAssignments,
    head: getBasename(childTokens[0] ?? "").toLowerCase()
  };
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

// src/core/analyze/shell-wrappers.ts
function extractDashCArg(tokens) {
  for (let i = 1;i < tokens.length; i++) {
    const token = tokens[i];
    if (!token)
      continue;
    if (token === "-c" && tokens[i + 1]) {
      return tokens[i + 1] ?? null;
    }
    if (token.startsWith("-") && token.includes("c") && !token.startsWith("--")) {
      const nextToken = tokens[i + 1];
      if (nextToken && !nextToken.startsWith("-")) {
        return nextToken;
      }
    }
  }
  return null;
}

// src/core/git/config.ts
import { execFileSync } from "node:child_process";
import { existsSync as existsSync11, readFileSync as readFileSync10 } from "node:fs";
import { dirname as dirname7, isAbsolute as isAbsolute5, join as join7, resolve as resolve5 } from "node:path";

// src/core/worktree.ts
import { existsSync as existsSync10, lstatSync as lstatSync2, readFileSync as readFileSync9, realpathSync as realpathSync3, statSync } from "node:fs";
import { dirname as dirname6, isAbsolute as isAbsolute4, join as join6, resolve as resolve4 } from "node:path";
var GIT_GLOBAL_OPTS_WITH_VALUE = new Set([
  "-c",
  "-C",
  "--git-dir",
  "--work-tree",
  "--namespace",
  "--super-prefix",
  "--config-env"
]);
function hasGitContextEnvOverride(envAssignments) {
  for (const name of GIT_CONTEXT_ENV_OVERRIDES) {
    if (envAssignments?.has(name) || Object.hasOwn(process.env, name)) {
      return true;
    }
  }
  return false;
}
function getGitExecutionContext(tokens, cwd) {
  if (!cwd) {
    return { gitCwd: null, hasExplicitGitContext: false };
  }
  let gitCwd;
  try {
    gitCwd = realpathSync3(resolve4(cwd));
  } catch {
    return { gitCwd: null, hasExplicitGitContext: false };
  }
  if (!isDirectory(gitCwd)) {
    return { gitCwd: null, hasExplicitGitContext: false };
  }
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
      const resolvedCwd = resolveGitCwd(gitCwd, target);
      if (!resolvedCwd) {
        return { gitCwd: null, hasExplicitGitContext };
      }
      gitCwd = resolvedCwd;
      i += 2;
      continue;
    }
    if (token.startsWith("-C") && token.length > 2) {
      const resolvedCwd = resolveGitCwd(gitCwd, token.slice(2));
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
    if (GIT_GLOBAL_OPTS_WITH_VALUE.has(token)) {
      i += 2;
    } else if (token.startsWith("-c") && token.length > 2) {
      i++;
    } else {
      i++;
    }
  }
  return { gitCwd, hasExplicitGitContext };
}
function isLinkedWorktree(cwd) {
  const dotGitPath = findDotGit(cwd);
  if (!dotGitPath) {
    return false;
  }
  try {
    const stat = lstatSync2(dotGitPath);
    if (stat.isSymbolicLink() || !stat.isFile()) {
      return false;
    }
    const content = readFileSync9(dotGitPath, "utf-8");
    const firstLine = content.split(/\r?\n/, 1)[0]?.trim() ?? "";
    if (!firstLine.startsWith("gitdir:")) {
      return false;
    }
    const rawGitDir = firstLine.slice("gitdir:".length).trim();
    if (rawGitDir === "") {
      return false;
    }
    const gitDir = isAbsolute4(rawGitDir) ? rawGitDir : resolve4(dirname6(dotGitPath), rawGitDir);
    if (!existsSync10(join6(gitDir, "commondir"))) {
      return false;
    }
    if (!worktreeGitdirBacklinkMatches(gitDir, dotGitPath)) {
      return false;
    }
    return worktreeConfigMatchesRoot(gitDir, dirname6(dotGitPath));
  } catch {
    return false;
  }
}
function worktreeGitdirBacklinkMatches(gitDir, dotGitPath) {
  const backlinkPath = join6(gitDir, "gitdir");
  if (!existsSync10(backlinkPath)) {
    return false;
  }
  const rawBacklink = readFileSync9(backlinkPath, "utf-8").split(/\r?\n/, 1)[0]?.trim() ?? "";
  if (rawBacklink === "") {
    return false;
  }
  const linkedDotGitPath = isAbsolute4(rawBacklink) ? rawBacklink : resolve4(gitDir, rawBacklink);
  try {
    return sameFilesystemPath(linkedDotGitPath, dotGitPath);
  } catch {
    return false;
  }
}
function worktreeConfigMatchesRoot(gitDir, worktreeRoot) {
  const configWorktreePath = join6(gitDir, "config.worktree");
  if (!existsSync10(configWorktreePath)) {
    return true;
  }
  const configuredWorktree = readCoreWorktree(configWorktreePath);
  if (configuredWorktree === null) {
    return true;
  }
  const resolvedConfiguredWorktree = isAbsolute4(configuredWorktree) ? configuredWorktree : resolve4(gitDir, configuredWorktree);
  try {
    return sameFilesystemPath(resolvedConfiguredWorktree, worktreeRoot);
  } catch {
    return false;
  }
}
function sameFilesystemPath(left, right) {
  try {
    const leftStat = statSync(left);
    const rightStat = statSync(right);
    if (leftStat.ino !== 0 && rightStat.ino !== 0 && leftStat.dev === rightStat.dev && leftStat.ino === rightStat.ino) {
      return true;
    }
  } catch {}
  return getCanonicalPathForComparison(left) === getCanonicalPathForComparison(right);
}
function getCanonicalPathForComparison(path) {
  return normalizePathForComparison(realpathSync3.native(path));
}
function normalizePathForComparison(path) {
  let normalized = path.replace(/^\\\\\?\\UNC\\/i, "//").replace(/^\\\\\?\\/i, "");
  normalized = normalized.replace(/\\/g, "/");
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}
function readCoreWorktree(configPath) {
  const content = readFileSync9(configPath, "utf-8");
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
function unescapeDoubleQuotedGitConfigValue(value) {
  let result = "";
  for (let i = 0;i < value.length; i++) {
    const char = value[i];
    if (char !== "\\") {
      result += char;
      continue;
    }
    const next = value[i + 1];
    if (next === undefined) {
      result += char;
      continue;
    }
    switch (next) {
      case "\\":
      case '"':
        result += next;
        break;
      case "n":
        result += `
`;
        break;
      case "t":
        result += "\t";
        break;
      case "b":
        result += "\b";
        break;
      default:
        result += `\\${next}`;
        break;
    }
    i++;
  }
  return result;
}
function resolveGitCwd(baseCwd, target) {
  try {
    const resolved = resolveChdirTarget(baseCwd, target);
    return isDirectory(resolved) ? resolved : null;
  } catch {
    return null;
  }
}
function isDirectory(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}
function findDotGit(cwd) {
  try {
    return findDotGitInAncestors(realpathSync3(cwd));
  } catch {
    return null;
  }
}
function findDotGitInAncestors(cwd) {
  let current = cwd;
  while (true) {
    const dotGitPath = join6(current, ".git");
    if (existsSync10(dotGitPath)) {
      return dotGitPath;
    }
    const parent = dirname6(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

// src/core/git/config.ts
var TRUSTED_GIT_BINARIES = [
  "/usr/bin/git",
  "/usr/local/bin/git",
  "/opt/homebrew/bin/git",
  "C:\\Program Files\\Git\\cmd\\git.exe",
  "C:\\Program Files\\Git\\bin\\git.exe"
];
function hasRecursiveSubmoduleConfig(tokens, envAssignments, gitCwd) {
  const commandLineConfig = commandLineRecursiveSubmoduleConfig(tokens, envAssignments);
  if (commandLineConfig !== null) {
    return commandLineConfig;
  }
  const envConfig = envRecursiveSubmoduleConfig(envAssignments);
  if (envConfig !== null) {
    return envConfig;
  }
  if (hasConfigAffectingEnvAssignment(envAssignments)) {
    return true;
  }
  return effectiveGitConfigEnablesRecursiveSubmodules(gitCwd);
}
function commandLineRecursiveSubmoduleConfig(tokens, envAssignments) {
  let recursiveSubmoduleConfig = null;
  let i = 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token || token === "--") {
      return recursiveSubmoduleConfig;
    }
    if (!token.startsWith("-")) {
      return recursiveSubmoduleConfig;
    }
    if (token === "-c") {
      const configValue = recursiveSubmoduleConfigValue(tokens[i + 1]);
      if (configValue !== null) {
        recursiveSubmoduleConfig = configValue;
      }
      i += 2;
      continue;
    }
    if (token.startsWith("-c") && token.length > 2) {
      const configValue = recursiveSubmoduleConfigValue(token.slice(2));
      if (configValue !== null) {
        recursiveSubmoduleConfig = configValue;
      }
      i++;
      continue;
    }
    if (token === "--config-env") {
      const configValue = recursiveSubmoduleConfigEnvValue(tokens[i + 1], envAssignments);
      if (configValue !== null) {
        recursiveSubmoduleConfig = configValue;
      }
      i += 2;
      continue;
    }
    if (token.startsWith("--config-env=")) {
      const configValue = recursiveSubmoduleConfigEnvValue(token.slice("--config-env=".length), envAssignments);
      if (configValue !== null) {
        recursiveSubmoduleConfig = configValue;
      }
      i++;
      continue;
    }
    if (GIT_GLOBAL_OPTS_WITH_VALUE.has(token)) {
      i += 2;
    } else {
      i++;
    }
  }
  return recursiveSubmoduleConfig;
}
function envRecursiveSubmoduleConfig(envAssignments) {
  if (getEnvConfigValue("GIT_CONFIG_PARAMETERS", envAssignments) !== undefined) {
    return true;
  }
  const countValue = getEnvConfigValue("GIT_CONFIG_COUNT", envAssignments);
  if (countValue === undefined) {
    return null;
  }
  const count = Number.parseInt(countValue, 10);
  if (!Number.isInteger(count) || count < 0) {
    return true;
  }
  let recursiveSubmoduleConfig = null;
  for (let i = 0;i < count; i++) {
    const key = getEnvConfigValue(`GIT_CONFIG_KEY_${i}`, envAssignments);
    if (key?.toLowerCase() !== "submodule.recurse") {
      continue;
    }
    const value = getEnvConfigValue(`GIT_CONFIG_VALUE_${i}`, envAssignments);
    recursiveSubmoduleConfig = value === undefined || gitConfigValueEnablesRecursiveSubmodules(value);
  }
  return recursiveSubmoduleConfig;
}
function getEnvConfigValue(name, envAssignments) {
  return envAssignments?.get(name) ?? process.env[name];
}
function effectiveGitConfigEnablesRecursiveSubmodules(cwd, gitBinary = getTrustedGitBinary()) {
  const localConfigResult = localGitConfigEnablesRecursiveSubmodules(cwd);
  if (localConfigResult === null || localConfigResult) {
    return true;
  }
  if (gitBinary === null) {
    return true;
  }
  try {
    const value = execFileSync(gitBinary, ["config", "--get", "submodule.recurse"], {
      cwd,
      encoding: "utf8",
      env: withoutGitConfigEnv(process.env),
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return gitConfigValueEnablesRecursiveSubmodules(value);
  } catch (error) {
    return !isGitConfigUnsetError(error);
  }
}
function localGitConfigEnablesRecursiveSubmodules(cwd) {
  const configPaths = getLocalGitConfigPaths(cwd);
  if (configPaths === null) {
    return null;
  }
  for (const configPath of configPaths) {
    if (!existsSync11(configPath)) {
      continue;
    }
    const result = gitConfigFileEnablesRecursiveSubmodules(configPath);
    if (result) {
      return true;
    }
  }
  return false;
}
function getTrustedGitBinary() {
  for (const gitBinary of TRUSTED_GIT_BINARIES) {
    if (existsSync11(gitBinary)) {
      return gitBinary;
    }
  }
  return null;
}
function withoutGitConfigEnv(env) {
  const nextEnv = { ...env };
  for (const key of Object.keys(nextEnv)) {
    if (isGitConfigEnvName(key)) {
      delete nextEnv[key];
    }
  }
  return nextEnv;
}
function isGitConfigUnsetError(error) {
  return typeof error === "object" && error !== null && "status" in error && error.status === 1;
}
function getLocalGitConfigPaths(cwd) {
  const dotGitPath = findDotGitInAncestors(cwd);
  if (dotGitPath === null) {
    return null;
  }
  const gitDir = resolveGitDirFromDotGit(dotGitPath);
  if (gitDir === null) {
    return null;
  }
  const commonDir = resolveCommonGitDir(gitDir);
  if (commonDir === null) {
    return null;
  }
  return [join7(commonDir, "config"), join7(gitDir, "config.worktree")];
}
function resolveGitDirFromDotGit(dotGitPath) {
  try {
    const content = readFileSync10(dotGitPath, "utf-8");
    const firstLine = content.split(/\r?\n/, 1)[0]?.trim() ?? "";
    if (!firstLine.startsWith("gitdir:")) {
      return dotGitPath;
    }
    const rawGitDir = firstLine.slice("gitdir:".length).trim();
    if (rawGitDir === "") {
      return null;
    }
    return isAbsolute5(rawGitDir) ? rawGitDir : resolve5(dirname7(dotGitPath), rawGitDir);
  } catch {
    return null;
  }
}
function resolveCommonGitDir(gitDir) {
  const commonDirPath = join7(gitDir, "commondir");
  if (!existsSync11(commonDirPath)) {
    return gitDir;
  }
  try {
    const rawCommonDir = readFileSync10(commonDirPath, "utf-8").split(/\r?\n/, 1)[0]?.trim() ?? "";
    if (rawCommonDir === "") {
      return null;
    }
    return isAbsolute5(rawCommonDir) ? rawCommonDir : resolve5(gitDir, rawCommonDir);
  } catch {
    return null;
  }
}
function gitConfigFileEnablesRecursiveSubmodules(configPath) {
  let content;
  try {
    content = readFileSync10(configPath, "utf-8");
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
function recursiveSubmoduleConfigValue(config) {
  if (!config) {
    return null;
  }
  const eqIdx = config.indexOf("=");
  const key = (eqIdx === -1 ? config : config.slice(0, eqIdx)).toLowerCase();
  if (isIncludeConfigKey(key)) {
    return true;
  }
  if (key !== "submodule.recurse") {
    return null;
  }
  const value = eqIdx === -1 ? "true" : config.slice(eqIdx + 1).toLowerCase();
  return gitConfigValueEnablesRecursiveSubmodules(value);
}
function gitConfigValueEnablesRecursiveSubmodules(value) {
  const normalizedValue = value.toLowerCase();
  return normalizedValue !== "false" && normalizedValue !== "no" && normalizedValue !== "off" && normalizedValue !== "0";
}
function recursiveSubmoduleConfigEnvValue(configEnv, envAssignments) {
  const eqIdx = configEnv?.indexOf("=") ?? -1;
  if (!configEnv || eqIdx === -1) {
    return null;
  }
  const key = configEnv.slice(0, eqIdx).toLowerCase();
  if (isIncludeConfigKey(key)) {
    return true;
  }
  if (key !== "submodule.recurse") {
    return null;
  }
  const value = getEnvConfigValue(configEnv.slice(eqIdx + 1), envAssignments);
  return value === undefined || gitConfigValueEnablesRecursiveSubmodules(value);
}
function isIncludeConfigKey(key) {
  return key === "include.path" || key.startsWith("includeif.") && key.endsWith(".path");
}

// src/core/git/parse.ts
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
function extractGitSubcommandAndRest(tokens) {
  if (tokens.length === 0) {
    return { subcommand: null, rest: [] };
  }
  const firstToken = tokens[0];
  const command = firstToken ? getBasename(firstToken).toLowerCase() : null;
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
    if (token.startsWith("-")) {
      if (GIT_GLOBAL_OPTS_WITH_VALUE.has(token)) {
        i += 2;
      } else if (token.startsWith("-c") && token.length > 2) {
        i++;
      } else if (token.startsWith("-C") && token.length > 2) {
        i++;
      } else {
        i++;
      }
    } else {
      return { subcommand: token, rest: tokens.slice(i + 1) };
    }
  }
  return { subcommand: null, rest: [] };
}

// src/core/git/rules.ts
var REASON_CHECKOUT_DOUBLE_DASH = "git checkout -- discards uncommitted changes permanently. Use 'git stash' first.";
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
var REASON_PUSH_FORCE = "git push --force destroys remote history. Use --force-with-lease for safer force push.";
var REASON_BRANCH_DELETE = "git branch -D force-deletes without merge check. Use -d for safe delete.";
var REASON_STASH_DROP = "git stash drop permanently deletes stashed changes. Consider 'git stash list' first.";
var REASON_STASH_CLEAR = "git stash clear deletes ALL stashed changes permanently.";
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
var CHECKOUT_KNOWN_OPTS_NO_VALUE = new Set([
  "-q",
  "--quiet",
  "--no-quiet",
  "-f",
  "--force",
  "--no-force",
  "-d",
  "--detach",
  "--no-detach",
  "-m",
  "--merge",
  "--no-merge",
  "-p",
  "--patch",
  "--no-patch",
  "--guess",
  "--no-guess",
  "--overlay",
  "--no-overlay",
  "--ours",
  "--theirs",
  "--ignore-skip-worktree-bits",
  "--no-ignore-skip-worktree-bits",
  "--no-track",
  "--overwrite-ignore",
  "--no-overwrite-ignore",
  "--ignore-other-worktrees",
  "--no-ignore-other-worktrees",
  "--progress",
  "--no-progress",
  "--pathspec-file-nul",
  "--no-pathspec-file-nul",
  "--no-recurse-submodules"
]);
function analyzeGitRule(tokens) {
  const { subcommand, rest } = extractGitSubcommandAndRest(tokens);
  if (!subcommand) {
    return null;
  }
  switch (subcommand.toLowerCase()) {
    case "checkout":
      return localDiscard(analyzeGitCheckout(rest));
    case "switch":
      return localDiscard(analyzeGitSwitch(rest));
    case "restore":
      return localDiscard(analyzeGitRestore(rest));
    case "reset":
      return analyzeGitReset(rest);
    case "clean":
      return localDiscard(analyzeGitClean(rest));
    case "push":
      return sharedState(analyzeGitPush(rest));
    case "branch":
      return sharedState(analyzeGitBranch(rest));
    case "stash":
      return sharedState(analyzeGitStash(rest));
    case "worktree":
      return sharedState(analyzeGitWorktree(rest));
    default:
      return null;
  }
}
function localDiscard(reason) {
  return reason ? { reason, localDiscard: true } : null;
}
function sharedState(reason) {
  return reason ? { reason, localDiscard: false } : null;
}
function analyzeGitCheckout(tokens) {
  const { index: doubleDashIdx, before: beforeDash } = splitAtDoubleDash(tokens);
  const shortOpts = extractShortOpts(beforeDash, {
    shortOptsWithValue: CHECKOUT_SHORT_OPTS_WITH_VALUE
  });
  if (beforeDash.includes("--force") || shortOpts.has("-f")) {
    return REASON_CHECKOUT_FORCE;
  }
  for (const token of tokens) {
    if (token === "-b" || token === "-B" || token === "--orphan") {
      return null;
    }
    if (token === "--pathspec-from-file") {
      return REASON_CHECKOUT_PATHSPEC_FROM_FILE;
    }
    if (token.startsWith("--pathspec-from-file=")) {
      return REASON_CHECKOUT_PATHSPEC_FROM_FILE;
    }
  }
  if (doubleDashIdx !== -1) {
    const hasRefBeforeDash = beforeDash.some((t) => !t.startsWith("-"));
    if (hasRefBeforeDash) {
      return REASON_CHECKOUT_REF_PATH;
    }
    return REASON_CHECKOUT_DOUBLE_DASH;
  }
  const positionalArgs = getCheckoutPositionalArgs(tokens);
  if (positionalArgs.length >= 2) {
    return REASON_CHECKOUT_AMBIGUOUS;
  }
  return null;
}
function analyzeGitSwitch(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  if (before.includes("--discard-changes")) {
    return REASON_SWITCH_DISCARD_CHANGES;
  }
  const shortOpts = extractShortOpts(before, {
    shortOptsWithValue: SWITCH_SHORT_OPTS_WITH_VALUE
  });
  if (before.includes("--force") || shortOpts.has("-f")) {
    return REASON_SWITCH_FORCE;
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
    if (token.startsWith("-")) {
      if (CHECKOUT_OPTS_WITH_VALUE.has(token)) {
        i += 2;
      } else if (token.startsWith("--") && token.includes("=")) {
        i++;
      } else if (CHECKOUT_OPTS_WITH_OPTIONAL_VALUE.has(token)) {
        const nextToken = tokens[i + 1];
        if (nextToken && !nextToken.startsWith("-") && (token === "--recurse-submodules" || token === "--track" || token === "-t")) {
          const validModes = token === "--recurse-submodules" ? ["checkout", "on-demand"] : ["direct", "inherit"];
          if (validModes.includes(nextToken)) {
            i += 2;
          } else {
            i++;
          }
        } else {
          i++;
        }
      } else if (token.startsWith("--") && !CHECKOUT_KNOWN_OPTS_NO_VALUE.has(token) && !CHECKOUT_OPTS_WITH_VALUE.has(token) && !CHECKOUT_OPTS_WITH_OPTIONAL_VALUE.has(token)) {
        i++;
      } else {
        i++;
      }
    } else {
      positional.push(token);
      i++;
    }
  }
  return positional;
}
function analyzeGitRestore(tokens) {
  let hasStaged = false;
  for (const token of tokens) {
    if (token === "--help" || token === "--version") {
      return null;
    }
    if (token === "--worktree" || token === "-W") {
      return REASON_RESTORE_WORKTREE;
    }
    if (token === "--staged" || token === "-S") {
      hasStaged = true;
    }
  }
  return hasStaged ? null : REASON_RESTORE;
}
function analyzeGitReset(tokens) {
  let reason = null;
  for (const token of tokens) {
    if (token === "--hard") {
      reason = REASON_RESET_HARD;
      break;
    }
    if (token === "--merge") {
      reason = REASON_RESET_MERGE;
      break;
    }
  }
  if (!reason) {
    return null;
  }
  return resetHasRef(tokens) ? sharedState(reason) : localDiscard(reason);
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
    if (token === "-n" || token === "--dry-run") {
      return null;
    }
  }
  const shortOpts = extractShortOpts(tokens.filter((t) => t !== "--"));
  if (tokens.includes("--force") || shortOpts.has("-f")) {
    return REASON_CLEAN;
  }
  return null;
}
function analyzeGitPush(tokens) {
  let hasForceWithLease = false;
  const shortOpts = extractShortOpts(tokens.filter((t) => t !== "--"));
  const hasForce = tokens.includes("--force") || shortOpts.has("-f");
  for (const token of tokens) {
    if (token === "--force-with-lease" || token.startsWith("--force-with-lease=")) {
      hasForceWithLease = true;
    }
  }
  if (hasForce && !hasForceWithLease) {
    return REASON_PUSH_FORCE;
  }
  return null;
}
function analyzeGitBranch(tokens) {
  const shortOpts = extractShortOpts(tokens.filter((t) => t !== "--"));
  if (shortOpts.has("-D")) {
    return REASON_BRANCH_DELETE;
  }
  return null;
}
function analyzeGitStash(tokens) {
  for (const token of tokens) {
    if (token === "drop") {
      return REASON_STASH_DROP;
    }
    if (token === "clear") {
      return REASON_STASH_CLEAR;
    }
  }
  return null;
}
function analyzeGitWorktree(tokens) {
  const hasRemove = tokens.includes("remove");
  if (!hasRemove)
    return null;
  const { before } = splitAtDoubleDash(tokens);
  for (const token of before) {
    if (token === "--force" || token === "-f") {
      return REASON_WORKTREE_REMOVE_FORCE;
    }
  }
  return null;
}

// src/core/git/worktree-relaxation.ts
function getGitWorktreeRelaxationForMatch(tokens, match, options) {
  if (!match.localDiscard || !options.worktreeMode || hasGitContextEnvOverride(options.envAssignments)) {
    return null;
  }
  const context = getGitExecutionContext(tokens, options.cwd);
  if (!context.gitCwd || context.hasExplicitGitContext) {
    return null;
  }
  if (!isLinkedWorktree(context.gitCwd)) {
    return null;
  }
  if (isNonRelaxableLocalDiscard(tokens, options, context.gitCwd)) {
    return null;
  }
  return {
    originalReason: match.reason,
    gitCwd: context.gitCwd
  };
}
function isNonRelaxableLocalDiscard(tokens, options, gitCwd) {
  const { subcommand, rest } = extractGitSubcommandAndRest(tokens);
  const normalizedSubcommand = subcommand?.toLowerCase();
  if (hasDynamicGitArgument(rest) || hasRecursiveSubmoduleConfig(tokens, options.envAssignments, gitCwd) || hasRecurseSubmodulesOption(rest) || isForcedBranchReset(normalizedSubcommand, rest)) {
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
    const shortOpts = extractShortOpts(before, {
      shortOptsWithValue: CHECKOUT_SHORT_OPTS_WITH_VALUE
    });
    const hasForce = before.includes("--force") || shortOpts.has("-f");
    const hasBranchReset = shortOpts.has("-B") || before.some((token) => token === "-B" || token.startsWith("-B"));
    return hasForce && hasBranchReset;
  }
  if (subcommand === "switch") {
    const { before } = splitAtDoubleDash(rest);
    const shortOpts = extractShortOpts(before, {
      shortOptsWithValue: SWITCH_SHORT_OPTS_WITH_VALUE
    });
    const hasForce = before.includes("--force") || before.includes("--discard-changes") || shortOpts.has("-f");
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

// src/core/git/index.ts
function analyzeGit(tokens, options = {}) {
  const match = analyzeGitRule(tokens);
  if (!match) {
    return null;
  }
  if (getGitWorktreeRelaxationForMatch(tokens, match, options)) {
    return null;
  }
  return match.reason;
}
function getGitWorktreeRelaxation(tokens, options = {}) {
  const match = analyzeGitRule(tokens);
  if (!match) {
    return null;
  }
  return getGitWorktreeRelaxationForMatch(tokens, match, options);
}

// src/core/rules-rm.ts
import { realpathSync as realpathSync4 } from "node:fs";
import { homedir as homedir4, tmpdir } from "node:os";
import { normalize, resolve as resolve6, sep as sep3 } from "node:path";
var IS_WINDOWS = process.platform === "win32";
function normalizePathForComparison2(p) {
  let normalized = normalize(p);
  if (IS_WINDOWS) {
    normalized = normalized.replace(/\//g, "\\");
    normalized = normalized.toLowerCase();
    if (normalized.length > 3 && normalized.endsWith("\\")) {
      normalized = normalized.slice(0, -1);
    }
  } else {
    if (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
  }
  return normalized;
}
var REASON_RM_RF = "rm -rf outside cwd is blocked. Use explicit paths within the current directory, or delete manually.";
var REASON_RM_RF_ROOT_HOME = "rm -rf targeting root or home directory is extremely dangerous and always blocked.";
var REASON_RM_HOME_CWD = "rm -rf in home directory is dangerous. Change to a project directory first.";
function analyzeRm(tokens, options = {}) {
  const {
    cwd,
    originalCwd,
    paranoid = false,
    allowTmpdirVar = true,
    tmpdirOverridden = false
  } = options;
  const anchoredCwd = originalCwd ?? cwd ?? null;
  const resolvedCwd = cwd ?? null;
  const trustTmpdirVar = allowTmpdirVar && !tmpdirOverridden;
  const ctx = {
    anchoredCwd,
    resolvedCwd,
    paranoid,
    trustTmpdirVar,
    homeDir: getHomeDirForRmPolicy()
  };
  if (!hasRecursiveForceFlags(tokens)) {
    return null;
  }
  const targets = extractTargets(tokens);
  for (const target of targets) {
    const classification = classifyTarget(target, ctx);
    const reason = reasonForClassification(classification, ctx);
    if (reason) {
      return reason;
    }
  }
  return null;
}
function extractTargets(tokens) {
  const targets = [];
  let pastDoubleDash = false;
  for (let i = 1;i < tokens.length; i++) {
    const token = tokens[i];
    if (!token)
      continue;
    if (token === "--") {
      pastDoubleDash = true;
      continue;
    }
    if (pastDoubleDash) {
      targets.push(token);
      continue;
    }
    if (!token.startsWith("-")) {
      targets.push(token);
    }
  }
  return targets;
}
function classifyTarget(target, ctx) {
  if (isDangerousRootOrHomeTarget(target)) {
    return { kind: "root_or_home_target" };
  }
  if (isTempTarget(target, ctx.trustTmpdirVar)) {
    return { kind: "temp_target" };
  }
  const anchoredCwd = ctx.anchoredCwd;
  if (anchoredCwd) {
    if (isCwdHomeForRmPolicy(anchoredCwd, ctx.homeDir)) {
      return { kind: "home_cwd_target" };
    }
    if (isCwdSelfTarget(target, anchoredCwd)) {
      return { kind: "cwd_self_target" };
    }
    if (isTargetWithinCwd(target, anchoredCwd, ctx.resolvedCwd ?? anchoredCwd)) {
      return { kind: "within_anchored_cwd" };
    }
  }
  return { kind: "outside_anchored_cwd" };
}
function reasonForClassification(classification, ctx) {
  switch (classification.kind) {
    case "root_or_home_target":
      return REASON_RM_RF_ROOT_HOME;
    case "temp_target":
      return null;
    case "home_cwd_target":
      return REASON_RM_HOME_CWD;
    case "cwd_self_target":
      return REASON_RM_RF;
    case "within_anchored_cwd":
      if (ctx.paranoid) {
        return `${REASON_RM_RF} (${ENV_FLAGS.paranoidRm.name} enabled)`;
      }
      return null;
    case "outside_anchored_cwd":
      return REASON_RM_RF;
  }
}
function isDangerousRootOrHomeTarget(path) {
  const normalized = path.trim();
  if (normalized === "/" || normalized === "/*") {
    return true;
  }
  if (normalized === "~" || normalized === "~/" || normalized.startsWith("~/")) {
    if (normalized === "~" || normalized === "~/" || normalized === "~/*") {
      return true;
    }
  }
  if (normalized === "$HOME" || normalized === "$HOME/" || normalized === "$HOME/*") {
    return true;
  }
  if (normalized === "${HOME}" || normalized === "${HOME}/" || normalized === "${HOME}/*") {
    return true;
  }
  return false;
}
function isTempTarget(path, allowTmpdirVar) {
  const normalized = path.trim();
  if (normalized.includes("..")) {
    return false;
  }
  if (normalized === "/tmp" || normalized.startsWith("/tmp/")) {
    return true;
  }
  if (normalized === "/var/tmp" || normalized.startsWith("/var/tmp/")) {
    return true;
  }
  const systemTmpdir = tmpdir();
  const normalizedTmpdir = normalizePathForComparison2(systemTmpdir);
  const pathToCompare = normalizePathForComparison2(normalized);
  if (pathToCompare.startsWith(`${normalizedTmpdir}${sep3}`) || pathToCompare === normalizedTmpdir) {
    return true;
  }
  if (allowTmpdirVar) {
    if (normalized === "$TMPDIR" || normalized.startsWith("$TMPDIR/")) {
      return true;
    }
    if (normalized === "${TMPDIR}" || normalized.startsWith("${TMPDIR}/")) {
      return true;
    }
  }
  return false;
}
function getHomeDirForRmPolicy() {
  return process.env.HOME ?? homedir4();
}
function isCwdHomeForRmPolicy(cwd, homeDir) {
  try {
    return normalizePathForComparison2(cwd) === normalizePathForComparison2(homeDir);
  } catch {
    return false;
  }
}
function isCwdSelfTarget(target, cwd) {
  if (target === "." || target === "./" || target === ".\\") {
    return true;
  }
  try {
    const resolved = resolve6(cwd, target);
    const realCwd = realpathSync4(cwd);
    const realResolved = realpathSync4(resolved);
    return normalizePathForComparison2(realResolved) === normalizePathForComparison2(realCwd);
  } catch {
    try {
      const resolved = resolve6(cwd, target);
      return normalizePathForComparison2(resolved) === normalizePathForComparison2(cwd);
    } catch {
      return false;
    }
  }
}
function isTargetWithinCwd(target, originalCwd, effectiveCwd) {
  const resolveCwd = effectiveCwd ?? originalCwd;
  if (target.startsWith("~") || target.startsWith("$HOME") || target.startsWith("${HOME}")) {
    return false;
  }
  if (target.includes("$") || target.includes("`")) {
    return false;
  }
  if (target.startsWith("/") || /^[A-Za-z]:[\\/]/.test(target)) {
    try {
      const normalizedTarget = normalizePathForComparison2(target);
      const normalizedCwd = `${normalizePathForComparison2(originalCwd)}${sep3}`;
      return normalizedTarget.startsWith(normalizedCwd);
    } catch {
      return false;
    }
  }
  if (target.startsWith("./") || target.startsWith(".\\") || !target.includes("/") && !target.includes("\\")) {
    try {
      const resolved = resolve6(resolveCwd, target);
      const normalizedResolved = normalizePathForComparison2(resolved);
      const normalizedOriginalCwd = normalizePathForComparison2(originalCwd);
      return normalizedResolved.startsWith(`${normalizedOriginalCwd}${sep3}`) || normalizedResolved === normalizedOriginalCwd;
    } catch {
      return false;
    }
  }
  if (target.startsWith("../")) {
    return false;
  }
  try {
    const resolved = resolve6(resolveCwd, target);
    const normalizedResolved = normalizePathForComparison2(resolved);
    const normalizedCwd = normalizePathForComparison2(originalCwd);
    return normalizedResolved.startsWith(`${normalizedCwd}${sep3}`) || normalizedResolved === normalizedCwd;
  } catch {
    return false;
  }
}

// src/core/analyze/parallel.ts
var REASON_PARALLEL_RM = "parallel rm -rf with dynamic input is dangerous. Use explicit file list instead.";
var REASON_PARALLEL_SHELL = "parallel with shell -c can execute arbitrary commands from dynamic input.";
var PARALLEL_PLACEHOLDER_RE = /\{[^{}\s]*\}/;
function analyzeParallel(tokens, context) {
  const parseResult = parseParallelCommand(tokens);
  if (!parseResult) {
    return null;
  }
  const { template, args, hasPlaceholder, runsRemotely, usesStdin } = parseResult;
  const hasDynamicStdinPlaceholder = usesStdin && hasPlaceholder;
  if (template.length === 0) {
    const nestedOverrides2 = buildCommandsModeOverrides(context, runsRemotely);
    for (const arg of args) {
      const reason = context.analyzeNested(arg, nestedOverrides2);
      if (reason) {
        return reason;
      }
    }
    return null;
  }
  const childCommand = normalizeChildCommand(template, context);
  const childTokens = childCommand.tokens;
  const nestedOverrides = buildNestedOverrides(childCommand.envAssignments, childCommand.wrapperCwd, runsRemotely || hasDynamicStdinPlaceholder);
  if (SHELL_WRAPPERS.has(childCommand.head)) {
    const dashCArg = extractDashCArg(childTokens);
    if (dashCArg) {
      if (isOnlyParallelPlaceholder(dashCArg)) {
        return REASON_PARALLEL_SHELL;
      }
      if (hasParallelPlaceholder(dashCArg)) {
        if (args.length > 0) {
          for (const arg of args) {
            const expandedScript = replaceParallelPlaceholder(dashCArg, arg);
            const reason3 = context.analyzeNested(expandedScript, nestedOverrides);
            if (reason3) {
              return reason3;
            }
          }
          return null;
        }
        const reason2 = context.analyzeNested(dashCArg, nestedOverrides);
        if (reason2) {
          return reason2;
        }
        return null;
      }
      const reason = context.analyzeNested(dashCArg, nestedOverrides);
      if (reason) {
        return reason;
      }
      if (hasPlaceholder) {
        return REASON_PARALLEL_SHELL;
      }
      return null;
    }
    if (args.length > 0) {
      return REASON_PARALLEL_SHELL;
    }
    if (hasPlaceholder) {
      return REASON_PARALLEL_SHELL;
    }
    return null;
  }
  if (childCommand.head === "rm" && hasRecursiveForceFlags(childTokens)) {
    if (hasPlaceholder && args.length > 0) {
      return analyzeParallelRmExpansions(args.map((arg) => childTokens.map((t) => t.replace(/{}/g, arg))), childCommand.cwd, context);
    }
    if (args.length > 0) {
      return analyzeParallelRmExpansions(args.map((arg) => [...childTokens, arg]), childCommand.cwd, context);
    }
    return REASON_PARALLEL_RM;
  }
  if (childCommand.head === "find") {
    const findResult = analyzeFind(childTokens);
    if (findResult) {
      return findResult;
    }
  }
  if (childCommand.head === "git") {
    const gitTokenSets = hasPlaceholder && args.length > 0 ? args.map((arg) => childTokens.map((token) => replaceParallelPlaceholder(token, arg))) : !hasPlaceholder && args.length > 0 ? args.map((arg) => [...childTokens, arg]) : [childTokens];
    const dynamicGitArgs = usesStdin || hasPlaceholder;
    for (const gitTokens of gitTokenSets) {
      const gitResult = analyzeGit(gitTokens, {
        cwd: childCommand.cwd,
        envAssignments: childCommand.envAssignments,
        worktreeMode: runsRemotely || dynamicGitArgs ? false : context.worktreeMode
      });
      if (gitResult) {
        return gitResult;
      }
    }
  }
  return null;
}
function analyzeParallelRmExpansions(tokenSets, cwd, context) {
  for (const tokens of tokenSets) {
    const rmResult = analyzeRm(tokens, {
      cwd,
      originalCwd: context.originalCwd,
      paranoid: context.paranoidRm,
      allowTmpdirVar: context.allowTmpdirVar
    });
    if (rmResult) {
      return rmResult;
    }
  }
  return null;
}
function buildNestedOverrides(envAssignments, cwd, runsRemotely) {
  const overrides = { envAssignments };
  if (cwd !== undefined) {
    overrides.effectiveCwd = cwd;
  }
  if (runsRemotely) {
    overrides.worktreeMode = false;
  }
  return overrides;
}
function buildCommandsModeOverrides(context, runsRemotely) {
  const overrides = {};
  if (context.envAssignments) {
    overrides.envAssignments = context.envAssignments;
  }
  if (context.cwd !== undefined) {
    overrides.effectiveCwd = context.cwd;
  }
  if (runsRemotely) {
    overrides.worktreeMode = false;
  }
  return Object.keys(overrides).length > 0 ? overrides : undefined;
}
function replaceParallelPlaceholder(token, arg) {
  return token.replace(/\{[^{}\s]*\}/g, arg);
}
function hasParallelPlaceholder(token) {
  return PARALLEL_PLACEHOLDER_RE.test(token);
}
function isOnlyParallelPlaceholder(token) {
  return /^\{[^{}\s]*\}$/.test(token);
}
function parseParallelCommand(tokens) {
  const parallelOptsWithValue = new Set([
    "-S",
    "--sshlogin",
    "--slf",
    "--sshloginfile",
    "-a",
    "--arg-file",
    "--colsep",
    "-I",
    "--replace",
    "--results",
    "--result",
    "--res"
  ]);
  let i = 1;
  const templateTokens = [];
  let markerIndex = -1;
  let runsRemotely = false;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token)
      break;
    if (token === ":::") {
      markerIndex = i;
      break;
    }
    if (token === "--") {
      const template = collectCommandTemplate(tokens, i + 1);
      templateTokens.push(...template.templateTokens);
      markerIndex = template.markerIndex;
      break;
    }
    if (token.startsWith("-")) {
      if (token === "-S" || token === "--sshlogin" || token === "--slf" || token === "--sshloginfile") {
        runsRemotely = true;
        i += 2;
        continue;
      }
      if (token.startsWith("-S") && token.length > 2) {
        runsRemotely = true;
        i++;
        continue;
      }
      if (token.startsWith("--sshlogin=") || token.startsWith("--slf=") || token.startsWith("--sshloginfile=")) {
        runsRemotely = true;
        i++;
        continue;
      }
      if (token.startsWith("-j") && token.length > 2 && /^\d+$/.test(token.slice(2))) {
        i++;
        continue;
      }
      if (token.startsWith("--") && token.includes("=")) {
        i++;
        continue;
      }
      if (parallelOptsWithValue.has(token)) {
        i += 2;
        continue;
      }
      if (token === "-j" || token === "--jobs") {
        i += 2;
        continue;
      }
      i++;
    } else {
      const template = collectCommandTemplate(tokens, i);
      templateTokens.push(...template.templateTokens);
      markerIndex = template.markerIndex;
      break;
    }
  }
  const args = [];
  if (markerIndex !== -1) {
    for (let j = markerIndex + 1;j < tokens.length; j++) {
      const token = tokens[j];
      if (token && token !== ":::") {
        args.push(token);
      }
    }
  }
  const hasPlaceholder = templateTokens.some(hasParallelPlaceholder);
  if (templateTokens.length === 0 && markerIndex === -1) {
    return null;
  }
  return {
    template: templateTokens,
    args,
    hasPlaceholder,
    runsRemotely,
    usesStdin: markerIndex === -1
  };
}

// src/core/analyze/tmpdir.ts
import { tmpdir as tmpdir2 } from "node:os";
import { normalize as normalize2, sep as sep4 } from "node:path";
function isTmpdirOverriddenToNonTemp(envAssignments) {
  if (!envAssignments.has("TMPDIR")) {
    return false;
  }
  const tmpdirValue = envAssignments.get("TMPDIR") ?? "";
  if (tmpdirValue === "") {
    return true;
  }
  const normalizedTmpdirValue = normalize2(tmpdirValue);
  const sysTmpdir = normalize2(tmpdir2());
  if (isPathOrSubpath(normalizedTmpdirValue, normalize2("/tmp")) || isPathOrSubpath(normalizedTmpdirValue, normalize2("/var/tmp")) || isPathOrSubpath(normalizedTmpdirValue, sysTmpdir)) {
    return false;
  }
  return true;
}
function isPathOrSubpath(path, basePath) {
  if (path === basePath) {
    return true;
  }
  const baseWithSlash = basePath.endsWith(sep4) ? basePath : `${basePath}${sep4}`;
  return path.startsWith(baseWithSlash);
}

// src/core/analyze/xargs.ts
var REASON_XARGS_RM = "xargs rm -rf with dynamic input is dangerous. Use explicit file list instead.";
var REASON_XARGS_SHELL = "xargs with shell -c can execute arbitrary commands from dynamic input.";
var XARGS_APPENDED_INPUT = "__CC_SAFETY_NET_XARGS_INPUT__";
function analyzeXargs(tokens, context) {
  const { childTokens: rawChildTokens, replacementToken } = extractXargsChildCommandWithInfo(tokens);
  const childCommand = normalizeChildCommand(rawChildTokens, context);
  const childTokens = childCommand.tokens;
  if (childTokens.length === 0) {
    return null;
  }
  if (SHELL_WRAPPERS.has(childCommand.head)) {
    return REASON_XARGS_SHELL;
  }
  if (childCommand.head === "rm" && hasRecursiveForceFlags(childTokens)) {
    const rmResult = analyzeRm(childTokens, {
      cwd: childCommand.cwd,
      originalCwd: context.originalCwd,
      paranoid: context.paranoidRm,
      allowTmpdirVar: context.allowTmpdirVar
    });
    if (rmResult) {
      return rmResult;
    }
    return REASON_XARGS_RM;
  }
  if (childCommand.head === "find") {
    const findResult = analyzeFind(childTokens);
    if (findResult) {
      return findResult;
    }
  }
  if (childCommand.head === "git") {
    const gitTokens = replacementToken === null ? [...childTokens, XARGS_APPENDED_INPUT] : childTokens;
    const hasDynamicReplacement = replacementToken !== null && (childTokens.some((token) => token.includes(replacementToken)) || Array.from(childCommand.envAssignments.values()).some((value) => value.includes(replacementToken)));
    const gitResult = analyzeGit(gitTokens, {
      cwd: childCommand.cwd,
      envAssignments: childCommand.envAssignments,
      worktreeMode: replacementToken === null || hasDynamicReplacement ? false : context.worktreeMode
    });
    if (gitResult) {
      return gitResult;
    }
  }
  return null;
}
function extractXargsChildCommandWithInfo(tokens) {
  const xargsOptsWithValue = new Set([
    "-L",
    "-n",
    "-P",
    "-s",
    "-a",
    "-E",
    "-e",
    "-d",
    "-J",
    "--max-args",
    "--max-procs",
    "--max-chars",
    "--arg-file",
    "--eof",
    "--delimiter",
    "--max-lines"
  ]);
  let replacementToken = null;
  let i = 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token)
      break;
    if (token === "--") {
      return { childTokens: [...tokens.slice(i + 1)], replacementToken };
    }
    if (token.startsWith("-")) {
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
        i += 2;
        continue;
      }
      if (xargsOptsWithValue.has(token)) {
        i += 2;
      } else if (token.startsWith("--") && token.includes("=")) {
        i++;
      } else if (token.startsWith("-L") || token.startsWith("-n") || token.startsWith("-P") || token.startsWith("-s")) {
        i++;
      } else {
        i++;
      }
    } else {
      return { childTokens: [...tokens.slice(i)], replacementToken };
    }
  }
  return { childTokens: [], replacementToken };
}

// src/core/analyze/segment.ts
var REASON_INTERPRETER_DANGEROUS = "Detected potentially dangerous command in interpreter code.";
var REASON_INTERPRETER_BLOCKED = "Interpreter one-liners are blocked in paranoid mode.";
var COMMAND_ANALYZERS = new Map([
  ["git", analyzeGitCommand],
  ["rm", analyzeRmCommand],
  ["find", analyzeFindCommand],
  ["xargs", analyzeXargsCommand],
  ["parallel", analyzeParallelCommand]
]);
function deriveCwdContext(options) {
  const cwdUnknown = options.effectiveCwd === null;
  const cwdForRm = cwdUnknown ? undefined : options.effectiveCwd ?? options.cwd;
  const originalCwd = cwdUnknown ? undefined : options.cwd;
  return { cwdUnknown, cwdForRm, originalCwd };
}
function analyzeSegment(tokens, depth, options) {
  if (tokens.length === 0) {
    return null;
  }
  const { cwdForRm: baseCwdForRm, originalCwd } = deriveCwdContext(options);
  const { tokens: strippedEnv, envAssignments: leadingEnvAssignments } = stripEnvAssignmentsWithInfo(tokens);
  const {
    tokens: stripped,
    envAssignments: wrapperEnvAssignments,
    cwd: wrapperCwd
  } = stripWrappersWithInfo(strippedEnv, baseCwdForRm);
  const envAssignments = new Map(options.envAssignments ?? []);
  for (const [k, v] of leadingEnvAssignments) {
    envAssignments.set(k, v);
  }
  for (const [k, v] of wrapperEnvAssignments) {
    envAssignments.set(k, v);
  }
  if (stripped.length === 0) {
    return null;
  }
  const head = stripped[0];
  if (!head) {
    return null;
  }
  if (options.config.failClosedReason) {
    return options.config.failClosedReason;
  }
  const normalizedHead = normalizeCommandToken(head);
  const basename = getBasename(head);
  const cwdForRm = wrapperCwd === null ? undefined : wrapperCwd ?? baseCwdForRm;
  const nestedEffectiveCwd = wrapperCwd === undefined ? options.effectiveCwd : wrapperCwd;
  const allowTmpdirVar = !isTmpdirOverriddenToNonTemp(envAssignments);
  if (SHELL_WRAPPERS.has(normalizedHead)) {
    const dashCArg = extractDashCArg(stripped);
    if (dashCArg) {
      return options.analyzeNested(dashCArg, {
        effectiveCwd: nestedEffectiveCwd,
        envAssignments
      });
    }
  }
  if (INTERPRETERS.has(normalizedHead)) {
    const codeArg = extractInterpreterCodeArg(stripped);
    if (codeArg) {
      if (options.paranoidInterpreters) {
        return REASON_INTERPRETER_BLOCKED + PARANOID_INTERPRETERS_SUFFIX;
      }
      const innerReason = options.analyzeNested(codeArg, {
        effectiveCwd: nestedEffectiveCwd,
        envAssignments
      });
      if (innerReason) {
        return innerReason;
      }
      if (containsDangerousCode(codeArg)) {
        return REASON_INTERPRETER_DANGEROUS;
      }
    }
  }
  if (normalizedHead === "busybox" && stripped.length > 1) {
    return analyzeSegment(stripped.slice(1), depth, {
      ...options,
      effectiveCwd: nestedEffectiveCwd,
      envAssignments
    });
  }
  const commandContext = {
    tokens: stripped,
    head,
    normalizedHead,
    basename,
    cwdForRm,
    originalCwd,
    envAssignments,
    allowTmpdirVar,
    options
  };
  const commandAnalyzer = getCommandAnalyzer(commandContext);
  const commandResult = commandAnalyzer?.(commandContext);
  if (commandResult) {
    return commandResult;
  }
  const matchedKnown = commandAnalyzer !== undefined;
  if (!matchedKnown) {
    if (!DISPLAY_COMMANDS.has(normalizedHead)) {
      for (let i = 1;i < stripped.length; i++) {
        const token = stripped[i];
        if (!token)
          continue;
        const reason = analyzeEmbeddedCommand(commandContext, i);
        if (reason)
          return reason;
      }
    }
  }
  const customRulesTopLevelOnly = matchedKnown;
  if (depth === 0 || !customRulesTopLevelOnly) {
    const customResult = checkCustomRules(stripped, options.config.rules);
    if (customResult) {
      return customResult;
    }
  }
  return null;
}
function getCommandAnalyzer(context) {
  if (context.basename.toLowerCase() === "git") {
    return COMMAND_ANALYZERS.get("git");
  }
  return COMMAND_ANALYZERS.get(context.basename);
}
function analyzeEmbeddedCommand(context, index) {
  const token = context.tokens[index];
  if (!token) {
    return null;
  }
  const cmd = normalizeCommandToken(token);
  const analyzer = COMMAND_ANALYZERS.get(cmd);
  if (!analyzer || cmd === "xargs" || cmd === "parallel") {
    return null;
  }
  const embeddedContext = {
    ...context,
    tokens: [cmd, ...context.tokens.slice(index + 1)],
    head: cmd,
    normalizedHead: cmd,
    basename: cmd,
    options: cmd === "git" ? { ...context.options, worktreeMode: false } : context.options
  };
  return analyzer(embeddedContext);
}
function analyzeGitCommand(context) {
  return analyzeGit(context.tokens, {
    cwd: context.cwdForRm,
    envAssignments: context.envAssignments,
    worktreeMode: context.options.worktreeMode
  });
}
function analyzeRmCommand(context) {
  return analyzeRm(context.tokens, {
    cwd: context.cwdForRm,
    originalCwd: context.originalCwd,
    paranoid: context.options.paranoidRm,
    allowTmpdirVar: context.allowTmpdirVar
  });
}
function analyzeFindCommand(context) {
  return analyzeFind(context.tokens);
}
function analyzeXargsCommand(context) {
  return analyzeXargs(context.tokens, {
    cwd: context.cwdForRm,
    originalCwd: context.originalCwd,
    paranoidRm: context.options.paranoidRm,
    allowTmpdirVar: context.allowTmpdirVar,
    envAssignments: context.envAssignments,
    worktreeMode: context.options.worktreeMode
  });
}
function analyzeParallelCommand(context) {
  return analyzeParallel(context.tokens, {
    cwd: context.cwdForRm,
    originalCwd: context.originalCwd,
    paranoidRm: context.options.paranoidRm,
    allowTmpdirVar: context.allowTmpdirVar,
    envAssignments: context.envAssignments,
    worktreeMode: context.options.worktreeMode,
    analyzeNested: context.options.analyzeNested
  });
}
var CWD_CHANGE_REGEX = /^\s*(?:\$\(\s*)?[({]*\s*(?:command\s+|builtin\s+)?(?:cd|pushd|popd)(?:\s|$)/;
function segmentChangesCwd(segment) {
  const stripped = stripLeadingGrouping(segment);
  const unwrapped = stripWrappers([...stripped]);
  if (unwrapped.length === 0) {
    return false;
  }
  let head = unwrapped[0] ?? "";
  if (head === "builtin" && unwrapped.length > 1) {
    head = unwrapped[1] ?? "";
  }
  if (head === "cd" || head === "pushd" || head === "popd") {
    return true;
  }
  const joined = segment.join(" ");
  return CWD_CHANGE_REGEX.test(joined);
}
function stripLeadingGrouping(tokens) {
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === "{" || token === "(" || token === "$(") {
      i++;
    } else {
      break;
    }
  }
  return tokens.slice(i);
}

// src/core/analyze/analyze-command.ts
var REASON_STRICT_UNPARSEABLE = "Command could not be safely analyzed (strict mode). Verify manually.";
var DYNAMIC_SUBSTITUTION_TOKEN = "$__CC_SAFETY_NET_DYNAMIC_SUBSTITUTION__";
var REASON_RECURSION_LIMIT = "Command exceeds maximum recursion depth and cannot be safely analyzed.";
function analyzeCommandInternal(command, depth, options) {
  if (depth >= MAX_RECURSION_DEPTH) {
    return { reason: REASON_RECURSION_LIMIT, segment: command };
  }
  const segments = splitShellCommandsWithInfo(command);
  if (options.strict && segments.length === 1 && segments[0]?.tokens.length === 1 && segments[0].tokens[0] === command && command.includes(" ")) {
    return { reason: REASON_STRICT_UNPARSEABLE, segment: command };
  }
  const originalCwd = options.cwd;
  let effectiveCwd = options.effectiveCwd !== undefined ? options.effectiveCwd : options.cwd;
  const shellGitContextState = createShellGitContextEnvState(options.envAssignments);
  for (const segmentInfo of segments) {
    const segment = segmentInfo.hasDynamicSubstitution ? appendDynamicSubstitutionSentinelForGit(segmentInfo.tokens) : segmentInfo.tokens;
    const segmentStr = segment.join(" ");
    const segmentEnvAssignments = getSegmentGitContextEnvAssignments(segment, shellGitContextState);
    if (segment.length === 1 && segment[0]?.includes(" ")) {
      const textReason = dangerousInText(segment[0]);
      if (textReason) {
        return { reason: textReason, segment: segmentStr };
      }
      if (segmentChangesCwd(segment)) {
        effectiveCwd = null;
      }
      continue;
    }
    const reason = analyzeSegment(segment, depth, {
      ...options,
      cwd: originalCwd,
      effectiveCwd,
      envAssignments: segmentEnvAssignments,
      analyzeNested: (nestedCommand, overrides) => {
        const nestedEffectiveCwd = overrides && Object.hasOwn(overrides, "effectiveCwd") ? overrides.effectiveCwd : effectiveCwd;
        return analyzeCommandInternal(nestedCommand, depth + 1, {
          ...options,
          effectiveCwd: nestedEffectiveCwd,
          envAssignments: overrides?.envAssignments ?? segmentEnvAssignments,
          worktreeMode: overrides?.worktreeMode ?? options.worktreeMode
        })?.reason ?? null;
      }
    });
    if (reason) {
      return { reason, segment: segmentStr };
    }
    if (segmentChangesCwd(segment)) {
      effectiveCwd = null;
    }
    applyShellGitContextEnvSegment(segment, shellGitContextState);
  }
  return null;
}
function appendDynamicSubstitutionSentinelForGit(tokens) {
  if (!tokens.some((token) => getBasename(token).toLowerCase() === "git")) {
    return tokens;
  }
  return [...tokens, DYNAMIC_SUBSTITUTION_TOKEN];
}
function createShellGitContextEnvState(effectiveEnvAssignments) {
  return {
    effectiveEnvAssignments,
    shellAssignments: new Map,
    exportedNames: getInitiallyExportedGitContextNames(effectiveEnvAssignments),
    allexport: false,
    keywordExport: false
  };
}
function applyShellGitContextEnvSegment(tokens, state) {
  const commandInfo = getShellCommandInfo(tokens);
  if (!commandInfo) {
    return;
  }
  const { command, commandIndex, leadingAssignments } = commandInfo;
  if (command === null) {
    for (const assignment of leadingAssignments.values()) {
      setShellGitContextAssignment(state, assignment);
    }
    return;
  }
  if (command === "set") {
    const changes = getSetOptionChanges(tokens, commandIndex);
    if (changes.allexport !== null) {
      state.allexport = changes.allexport;
    }
    if (changes.keywordExport !== null) {
      state.keywordExport = changes.keywordExport;
    }
    return;
  }
  if (command !== "export" && command !== "typeset" && command !== "declare" && command !== "readonly") {
    return;
  }
  for (const assignment of leadingAssignments.values()) {
    setShellGitContextAssignment(state, assignment);
  }
  if (command === "export") {
    const operandsStart = getExportOperandsStart(tokens, commandIndex);
    if (operandsStart === null) {
      return;
    }
    for (const token of tokens.slice(operandsStart)) {
      addExportedGitContextEnvAssignment(state, token);
    }
    return;
  }
  const operandsInfo = getTypesetOperandsInfo(tokens, commandIndex);
  if (operandsInfo === null) {
    return;
  }
  for (const token of tokens.slice(operandsInfo.operandsStart)) {
    addTypesetGitContextEnvAssignment(state, token, operandsInfo.exports, command === "readonly" ? leadingAssignments : undefined);
  }
}
function getSegmentGitContextEnvAssignments(tokens, state) {
  if (!state.keywordExport) {
    return state.effectiveEnvAssignments;
  }
  let nextEnvAssignments = null;
  for (const token of tokens) {
    const assignment = parseGitContextEnvAssignment(token);
    if (!assignment) {
      continue;
    }
    nextEnvAssignments ??= new Map(state.effectiveEnvAssignments ?? []);
    nextEnvAssignments.set(assignment.name, assignment.value);
  }
  return nextEnvAssignments ?? state.effectiveEnvAssignments;
}
function getShellCommandInfo(tokens) {
  const leadingAssignments = new Map;
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    const assignment = parseShellAssignment(token);
    if (!assignment) {
      break;
    }
    if (isTrackedGitEnvName(assignment.name)) {
      leadingAssignments.set(assignment.name, assignment);
    }
    i++;
  }
  if (i >= tokens.length) {
    return { command: null, commandIndex: i, leadingAssignments };
  }
  let commandIndex = i;
  let command = tokens[commandIndex] ?? null;
  if (command === "builtin") {
    commandIndex++;
    if (tokens[commandIndex] === "--") {
      commandIndex++;
    }
    command = tokens[commandIndex] ?? null;
  }
  if (command === "command") {
    const commandBuiltinInfo = getCommandBuiltinTarget(tokens, commandIndex);
    if (!commandBuiltinInfo) {
      return null;
    }
    commandIndex = commandBuiltinInfo.commandIndex;
    command = commandBuiltinInfo.command;
  }
  if (command === null) {
    return null;
  }
  return { command, commandIndex, leadingAssignments };
}
function getCommandBuiltinTarget(tokens, commandIndex) {
  let i = commandIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    if (token === "--") {
      i++;
      break;
    }
    if (token === "-p") {
      i++;
      continue;
    }
    if (token === "-v" || token === "-V") {
      return null;
    }
    break;
  }
  const command = tokens[i];
  return command ? { command, commandIndex: i } : null;
}
function parseShellAssignment(token) {
  return parseEnvAssignment(token) ?? parseGitContextAppendEnvAssignment(token);
}
function parseGitContextEnvAssignment(token) {
  const assignment = parseEnvAssignment(token) ?? parseGitContextAppendEnvAssignment(token);
  if (!assignment || !isTrackedGitEnvName(assignment.name)) {
    return null;
  }
  return assignment;
}
function getInitiallyExportedGitContextNames(effectiveEnvAssignments) {
  const exportedNames = new Set;
  for (const name of Object.keys(process.env)) {
    if (isTrackedGitEnvName(name)) {
      exportedNames.add(name);
    }
  }
  for (const name of effectiveEnvAssignments?.keys() ?? []) {
    if (isTrackedGitEnvName(name)) {
      exportedNames.add(name);
    }
  }
  return exportedNames;
}
function setShellGitContextAssignment(state, assignment) {
  state.shellAssignments.set(assignment.name, assignment.value);
  if (state.allexport || state.exportedNames.has(assignment.name)) {
    setEffectiveGitContextAssignment(state, assignment);
  }
}
function setEffectiveGitContextAssignment(state, assignment) {
  const nextEnvAssignments = new Map(state.effectiveEnvAssignments ?? []);
  nextEnvAssignments.set(assignment.name, assignment.value);
  state.effectiveEnvAssignments = nextEnvAssignments;
}
function addExportedGitContextEnvAssignment(state, token) {
  const assignment = parseGitContextEnvAssignment(token);
  if (assignment) {
    state.shellAssignments.set(assignment.name, assignment.value);
    state.exportedNames.add(assignment.name);
    setEffectiveGitContextAssignment(state, assignment);
    return;
  }
  if (isTrackedGitEnvName(token)) {
    exportTrackedGitContextEnvName(state, token);
  }
}
function addTypesetGitContextEnvAssignment(state, token, exports, readonlyLeadingAssignments) {
  const assignment = parseGitContextEnvAssignment(token);
  if (assignment) {
    state.shellAssignments.set(assignment.name, assignment.value);
    if (exports) {
      state.exportedNames.add(assignment.name);
      setEffectiveGitContextAssignment(state, assignment);
    } else if (state.allexport || state.exportedNames.has(assignment.name)) {
      setEffectiveGitContextAssignment(state, assignment);
    }
    return;
  }
  const readonlyAssignment = readonlyLeadingAssignments?.get(token);
  if (readonlyAssignment) {
    state.exportedNames.add(token);
    setEffectiveGitContextAssignment(state, readonlyAssignment);
    return;
  }
  if (exports && isTrackedGitEnvName(token)) {
    exportTrackedGitContextEnvName(state, token);
  }
}
function exportTrackedGitContextEnvName(state, name) {
  state.exportedNames.add(name);
  setEffectiveGitContextAssignment(state, {
    name,
    value: state.shellAssignments.get(name) ?? ""
  });
}
function getExportOperandsStart(tokens, commandIndex) {
  let i = commandIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    if (token === "--") {
      return i + 1;
    }
    if (token === "-p") {
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
function getTypesetOperandsInfo(tokens, commandIndex) {
  let i = commandIndex + 1;
  let hasExportFlag = false;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return null;
    }
    if (token === "--") {
      return { operandsStart: i + 1, exports: hasExportFlag };
    }
    if (token.startsWith("-")) {
      if (token.slice(1).includes("x")) {
        hasExportFlag = true;
      }
      i++;
      continue;
    }
    if (token.startsWith("+")) {
      if (token.slice(1).includes("x")) {
        hasExportFlag = false;
      }
      i++;
      continue;
    }
    return { operandsStart: i, exports: hasExportFlag };
  }
  return { operandsStart: i, exports: hasExportFlag };
}
function getSetOptionChanges(tokens, commandIndex) {
  const changes = { allexport: null, keywordExport: null };
  let i = commandIndex + 1;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token) {
      return changes;
    }
    if (token === "--") {
      return changes;
    }
    if (token === "-o" || token === "+o") {
      if (tokens[i + 1] === "allexport") {
        changes.allexport = token === "-o";
      }
      if (tokens[i + 1] === "keyword") {
        changes.keywordExport = token === "-o";
      }
      i += 2;
      continue;
    }
    if (token.startsWith("-") && token.length > 1) {
      const flags = token.slice(1);
      if (flags.includes("a")) {
        changes.allexport = true;
      }
      if (flags.includes("k")) {
        changes.keywordExport = true;
      }
      i++;
      continue;
    }
    if (token.startsWith("+") && token.length > 1) {
      const flags = token.slice(1);
      if (flags.includes("a")) {
        changes.allexport = false;
      }
      if (flags.includes("k")) {
        changes.keywordExport = false;
      }
      i++;
      continue;
    }
    return changes;
  }
  return changes;
}

// src/core/analyze.ts
function analyzeCommand(command, options = {}) {
  const config = options.config ?? loadConfig(options.cwd);
  return analyzeCommandInternal(command, 0, { ...options, config });
}

// src/bin/doctor/hooks.ts
var COPILOT_PLUGIN_CONFIG_PATH = "copilot-plugin";
var CLAUDE_PLUGIN_LIST_CONFIG_PATH = "claude plugin list";
var CLAUDE_SAFETY_NET_PLUGIN_ID = "safety-net@cc-marketplace";
var GEMINI_EXTENSIONS_LIST_CONFIG_PATH = "gemini extensions list";
var GEMINI_SAFETY_NET_SOURCE = "https://github.com/kenryu42/gemini-safety-net";
var CODEX_PLUGIN_HOOKS_WARNING = "Codex plugin hooks are behind a feature flag. Add `plugin_hooks = true` under [features] in $CODEX_HOME/config.toml.";
var CODEX_SAFETY_NET_PLUGIN_ID = "safety-net@cc-marketplace";
var SELF_TEST_CASES = [
  { command: "git reset --hard", description: "git reset --hard", expectBlocked: true },
  { command: "rm -rf /", description: "rm -rf /", expectBlocked: true },
  { command: "rm -rf ./node_modules", description: "rm in cwd (safe)", expectBlocked: false }
];
var SELF_TEST_CONFIG = { version: 1, rules: [] };
function runSelfTest() {
  const selfTestCwd = join8(tmpdir3(), "cc-safety-net-self-test");
  const results = SELF_TEST_CASES.map((tc) => {
    const result = analyzeCommand(tc.command, {
      cwd: selfTestCwd,
      config: SELF_TEST_CONFIG,
      strict: false,
      paranoidRm: false,
      paranoidInterpreters: false
    });
    const wasBlocked = result !== null;
    const expected = tc.expectBlocked ? "blocked" : "allowed";
    const actual = wasBlocked ? "blocked" : "allowed";
    return {
      command: tc.command,
      description: tc.description,
      expected,
      actual,
      passed: expected === actual,
      reason: result?.reason
    };
  });
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  return { passed, failed, total: results.length, results };
}
function stripJsonComments(content) {
  let result = "";
  let i = 0;
  let inString = false;
  let isEscaped = false;
  let lastCommaIndex = -1;
  while (i < content.length) {
    const char = content[i];
    const next = content[i + 1];
    if (isEscaped) {
      result += char;
      isEscaped = false;
      i++;
      continue;
    }
    if (char === '"' && !inString) {
      inString = true;
      lastCommaIndex = -1;
      result += char;
      i++;
      continue;
    }
    if (char === '"' && inString) {
      inString = false;
      result += char;
      i++;
      continue;
    }
    if (char === "\\" && inString) {
      isEscaped = true;
      result += char;
      i++;
      continue;
    }
    if (inString) {
      result += char;
      i++;
      continue;
    }
    if (char === "/" && next === "/") {
      while (i < content.length && content[i] !== `
`) {
        i++;
      }
      continue;
    }
    if (char === "/" && next === "*") {
      i += 2;
      while (i < content.length - 1) {
        if (content[i] === "*" && content[i + 1] === "/") {
          i += 2;
          break;
        }
        i++;
      }
      continue;
    }
    if (char === ",") {
      lastCommaIndex = result.length;
      result += char;
      i++;
      continue;
    }
    if (char === "}" || char === "]") {
      if (lastCommaIndex !== -1) {
        const between = result.slice(lastCommaIndex + 1);
        if (/^\s*$/.test(between)) {
          result = result.slice(0, lastCommaIndex) + between;
        }
      }
      lastCommaIndex = -1;
      result += char;
      i++;
      continue;
    }
    if (!/\s/.test(char)) {
      lastCommaIndex = -1;
    }
    result += char;
    i++;
  }
  return result;
}
function detectClaudeCode(pluginListOutput) {
  if (!pluginListOutput) {
    return { platform: "claude-code", status: "n/a" };
  }
  const pluginBlock = _findClaudeSafetyNetPluginBlock(pluginListOutput);
  if (!pluginBlock) {
    return { platform: "claude-code", status: "n/a" };
  }
  if (/^\s*Status:\s*.*\bdisabled\b\s*$/im.test(pluginBlock)) {
    return {
      platform: "claude-code",
      status: "disabled",
      method: "plugin list",
      configPath: CLAUDE_PLUGIN_LIST_CONFIG_PATH
    };
  }
  if (/^\s*Status:\s*.*\benabled\b\s*$/im.test(pluginBlock)) {
    return {
      platform: "claude-code",
      status: "configured",
      method: "plugin list",
      configPath: CLAUDE_PLUGIN_LIST_CONFIG_PATH,
      selfTest: runSelfTest()
    };
  }
  return {
    platform: "claude-code",
    status: "disabled",
    method: "plugin list",
    configPath: CLAUDE_PLUGIN_LIST_CONFIG_PATH,
    errors: ["Status is not enabled"]
  };
}
function _findClaudeSafetyNetPluginBlock(output) {
  const pluginLinePattern = new RegExp(`^\\s*(?:[^\\w\\s@]+\\s+)?${_escapeRegExp(CLAUDE_SAFETY_NET_PLUGIN_ID)}\\s*$`);
  const pluginStartPattern = /^\s*(?:[^\w\s@]+\s+)?\S+@\S+\s*$/;
  const lines = output.split(`
`);
  const startIndex = lines.findIndex((line) => pluginLinePattern.test(line));
  if (startIndex === -1)
    return;
  const endIndex = lines.findIndex((line, index) => index > startIndex && pluginStartPattern.test(line));
  return lines.slice(startIndex, endIndex === -1 ? undefined : endIndex).join(`
`);
}
function _escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function detectOpenCode(homeDir) {
  const errors = [];
  const configDir = join8(homeDir, ".config", "opencode");
  const candidates = ["opencode.json", "opencode.jsonc"];
  for (const filename of candidates) {
    const configPath = join8(configDir, filename);
    if (existsSync12(configPath)) {
      try {
        const content = readFileSync11(configPath, "utf-8");
        const json = stripJsonComments(content);
        const config = JSON.parse(json);
        const plugins = config.plugin ?? [];
        const hasSafetyNet = plugins.some((p) => p.includes("cc-safety-net"));
        if (hasSafetyNet) {
          return {
            platform: "opencode",
            status: "configured",
            method: "plugin array",
            configPath,
            selfTest: runSelfTest(),
            errors: errors.length > 0 ? errors : undefined
          };
        }
      } catch (e) {
        errors.push(`Failed to parse ${filename}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }
  return {
    platform: "opencode",
    status: "n/a",
    errors: errors.length > 0 ? errors : undefined
  };
}
function detectGeminiCLI(extensionsListOutput) {
  if (!extensionsListOutput) {
    return { platform: "gemini-cli", status: "n/a" };
  }
  const extension = _parseGeminiExtensionsList(extensionsListOutput).find((item) => item.source?.includes(GEMINI_SAFETY_NET_SOURCE));
  if (!extension) {
    return { platform: "gemini-cli", status: "n/a" };
  }
  const effectiveEnabled = extension.enabledWorkspace ?? extension.enabledUser ?? true;
  const errors = effectiveEnabled ? [] : [
    extension.enabledWorkspace === false ? "Enabled (Workspace) is false" : "Enabled (User) is false"
  ];
  if (errors.length > 0) {
    return {
      platform: "gemini-cli",
      status: "disabled",
      method: "extension list",
      configPath: GEMINI_EXTENSIONS_LIST_CONFIG_PATH,
      errors
    };
  }
  return {
    platform: "gemini-cli",
    status: "configured",
    method: "extension list",
    configPath: GEMINI_EXTENSIONS_LIST_CONFIG_PATH,
    selfTest: runSelfTest()
  };
}
function _parseGeminiExtensionsList(output) {
  const blocks = output.split(`
`).reduce((result, line) => {
    if (/^\S/.test(line) || result.length === 0) {
      result.push(line);
      return result;
    }
    const index = result.length - 1;
    result[index] = `${result[index]}
${line}`;
    return result;
  }, []);
  return blocks.map((block) => ({
    source: /^\s*Source:\s*(.+)$/m.exec(block)?.[1],
    enabledUser: _parseGeminiEnabledValue(block, "User"),
    enabledWorkspace: _parseGeminiEnabledValue(block, "Workspace")
  }));
}
function _parseGeminiEnabledValue(block, scope) {
  const match = new RegExp(`^\\s*Enabled \\(${scope}\\):\\s*(true|false)\\s*$`, "im").exec(block);
  if (!match)
    return;
  return match[1] === "true";
}
function _getCodexHome(homeDir) {
  return process.env.CODEX_HOME || join8(homeDir, ".codex");
}
function _parseCodexConfig(content) {
  const result = {};
  content.split(`
`).reduce((activeSection, line) => {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#"))
      return activeSection;
    const sectionMatch = /^\[([^\]]+)]\s*(?:#.*)?$/.exec(trimmed);
    if (sectionMatch)
      return sectionMatch[1];
    if (activeSection === "features") {
      const pluginHooksMatch = /^plugin_hooks\s*=\s*(true|false)\s*(?:#.*)?$/.exec(trimmed);
      if (pluginHooksMatch)
        result.pluginHooks = pluginHooksMatch[1] === "true";
    }
    if (activeSection === `plugins."${CODEX_SAFETY_NET_PLUGIN_ID}"`) {
      const enabledMatch = /^enabled\s*=\s*(true|false)\s*(?:#.*)?$/.exec(trimmed);
      if (enabledMatch)
        result.safetyNetEnabled = enabledMatch[1] === "true";
    }
    return activeSection;
  }, undefined);
  return result;
}
function _readCodexConfig(configPath, errors) {
  try {
    return _parseCodexConfig(readFileSync11(configPath, "utf-8"));
  } catch (e) {
    errors.push(`Failed to read ${configPath}: ${e instanceof Error ? e.message : String(e)}`);
    return {};
  }
}
function detectCodex(homeDir) {
  const codexHome = _getCodexHome(homeDir);
  const pluginCachePath = join8(codexHome, "plugins", "cache", "cc-marketplace", "safety-net");
  const errors = [];
  if (!existsSync12(pluginCachePath)) {
    return { platform: "codex", status: "n/a", configPath: pluginCachePath };
  }
  try {
    if (readdirSync2(pluginCachePath).length === 0) {
      return { platform: "codex", status: "n/a", configPath: pluginCachePath };
    }
  } catch (e) {
    return {
      platform: "codex",
      status: "n/a",
      configPath: pluginCachePath,
      errors: [`Failed to read ${pluginCachePath}: ${e instanceof Error ? e.message : String(e)}`]
    };
  }
  const configPath = join8(codexHome, "config.toml");
  const config = _readCodexConfig(configPath, errors);
  if (config.safetyNetEnabled !== true) {
    return {
      platform: "codex",
      status: "disabled",
      method: "plugin cache",
      configPath,
      errors: [
        ...errors,
        `Codex plugin ${CODEX_SAFETY_NET_PLUGIN_ID} is not enabled. Add enabled = true under [plugins."${CODEX_SAFETY_NET_PLUGIN_ID}"] in $CODEX_HOME/config.toml.`
      ]
    };
  }
  if (config.pluginHooks !== true) {
    return {
      platform: "codex",
      status: "disabled",
      method: "plugin cache",
      configPath,
      errors: [...errors, CODEX_PLUGIN_HOOKS_WARNING]
    };
  }
  return {
    platform: "codex",
    status: "configured",
    method: "plugin cache",
    configPath,
    selfTest: runSelfTest(),
    errors: errors.length > 0 ? errors : undefined
  };
}
function _isSafetyNetCopilotCommand(command) {
  if (!command?.includes("cc-safety-net"))
    return false;
  return /(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(command);
}
function _parseSemver(version) {
  if (!version)
    return null;
  const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match)
    return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}
function _compareSemver(version, threshold) {
  const parsed = _parseSemver(version);
  if (!parsed)
    return null;
  for (let index = 0;index < threshold.length; index++) {
    const left = parsed[index] ?? 0;
    const right = threshold[index] ?? 0;
    if (left > right)
      return 1;
    if (left < right)
      return -1;
  }
  return 0;
}
function _supportsCopilotUserHookFiles(version) {
  const comparison = _compareSemver(version, [0, 0, 422]);
  if (comparison === null)
    return null;
  return comparison >= 0;
}
function _supportsCopilotInlineHooks(version) {
  const comparison = _compareSemver(version, [1, 0, 8]);
  if (comparison === null)
    return null;
  return comparison >= 0;
}
function _getCopilotConfigHome(homeDir) {
  return process.env.COPILOT_HOME || join8(homeDir, ".copilot");
}
function _hasSafetyNetCopilotHook(config) {
  const preToolUseHooks = config.hooks?.preToolUse ?? [];
  return preToolUseHooks.some((hook) => {
    if (hook.type !== "command")
      return false;
    return _isSafetyNetCopilotCommand(hook.command) || _isSafetyNetCopilotCommand(hook.bash) || _isSafetyNetCopilotCommand(hook.powershell);
  });
}
function _readCopilotConfigFile(configPath, errors) {
  try {
    return JSON.parse(stripJsonComments(readFileSync11(configPath, "utf-8")));
  } catch (e) {
    errors?.push(`Failed to parse ${configPath}: ${e instanceof Error ? e.message : String(e)}`);
    return;
  }
}
function _listJsonFiles(dirPath, errors) {
  try {
    return readdirSync2(dirPath).filter((name) => name.endsWith(".json")).sort((a, b) => a.localeCompare(b));
  } catch (e) {
    errors?.push(`Failed to read ${dirPath}: ${e instanceof Error ? e.message : String(e)}`);
    return [];
  }
}
function _collectSafetyNetCopilotHookFiles(dirPath, errors) {
  if (!existsSync12(dirPath))
    return [];
  const matches = [];
  for (const filename of _listJsonFiles(dirPath, errors)) {
    const configPath = join8(dirPath, filename);
    const config = _readCopilotConfigFile(configPath, errors);
    if (config && _hasSafetyNetCopilotHook(config)) {
      matches.push(configPath);
    }
  }
  return matches;
}
function _collectCopilotInlineConfig(configPath, errors) {
  if (!existsSync12(configPath))
    return;
  const config = _readCopilotConfigFile(configPath, errors);
  if (!config)
    return;
  return { path: configPath, config };
}
function _warnOnUnsupportedCopilotSource(errors, version, sourceDescription, requiredVersion) {
  if (version) {
    errors.push(`Copilot CLI ${version} does not support ${sourceDescription}; requires ${requiredVersion}+`);
    return;
  }
  errors.push(`Copilot CLI version unavailable; skipping ${sourceDescription} because it requires ${requiredVersion}+`);
}
function _resolveCopilotInlineDisableSource(inlineSources) {
  const precedence = [
    inlineSources.localSettings,
    inlineSources.repoSettings,
    inlineSources.userConfig
  ];
  for (const source of precedence) {
    if (source?.config.disableAllHooks === true)
      return source.path;
    if (source?.config.disableAllHooks === false)
      return;
  }
  return;
}
function _checkCopilotEnabled(homeDir, cwd, copilotCliVersion, errors) {
  const configHome = _getCopilotConfigHome(homeDir);
  const repoHookDir = join8(cwd, ".github", "hooks");
  const userHookDir = join8(configHome, "hooks");
  const repoConfigDir = join8(cwd, ".github", "copilot");
  const inlineSupport = _supportsCopilotInlineHooks(copilotCliVersion);
  const inlineErrors = inlineSupport === true ? errors : undefined;
  const inlineSources = {
    userConfig: _collectCopilotInlineConfig(join8(configHome, "config.json"), inlineErrors),
    repoSettings: _collectCopilotInlineConfig(join8(repoConfigDir, "settings.json"), inlineErrors),
    localSettings: _collectCopilotInlineConfig(join8(repoConfigDir, "settings.local.json"), inlineErrors)
  };
  if (inlineSupport !== false) {
    const disableSource = _resolveCopilotInlineDisableSource(inlineSources);
    if (disableSource) {
      if (inlineSupport === null) {
        errors.push(`Copilot CLI version unavailable; treating disableAllHooks in ${disableSource} as active`);
      }
      return { activeConfigPaths: [], disabledBy: disableSource };
    }
  }
  const repoHookPaths = _collectSafetyNetCopilotHookFiles(repoHookDir, errors);
  const userHookSupport = _supportsCopilotUserHookFiles(copilotCliVersion);
  const userHookErrors = userHookSupport === true ? errors : undefined;
  const userHookFiles = existsSync12(userHookDir) ? _listJsonFiles(userHookDir, userHookErrors) : [];
  const userHookPaths = [];
  for (const filename of userHookFiles) {
    const configPath = join8(userHookDir, filename);
    const config = _readCopilotConfigFile(configPath, userHookErrors);
    if (config && _hasSafetyNetCopilotHook(config)) {
      userHookPaths.push(configPath);
    }
  }
  if (userHookSupport !== true && userHookPaths.length > 0) {
    _warnOnUnsupportedCopilotSource(errors, copilotCliVersion, `user hook files in ${userHookDir}`, "0.0.422");
    userHookPaths.length = 0;
  }
  const inlinePaths = [];
  const inlineSourcesByPrecedence = [
    inlineSources.localSettings,
    inlineSources.repoSettings,
    inlineSources.userConfig
  ];
  for (const source of inlineSourcesByPrecedence) {
    if (!source)
      continue;
    if (!_hasSafetyNetCopilotHook(source.config))
      continue;
    if (inlineSupport === true) {
      inlinePaths.push(source.path);
      continue;
    }
    _warnOnUnsupportedCopilotSource(errors, copilotCliVersion, "inline hook definitions in Copilot config files", "1.0.8");
    break;
  }
  return {
    activeConfigPaths: [
      ...inlinePaths.filter((path) => path.endsWith("settings.local.json")),
      ...inlinePaths.filter((path) => path.endsWith("settings.json")),
      ...repoHookPaths,
      ...inlinePaths.filter((path) => path.endsWith("config.json")),
      ...userHookPaths
    ]
  };
}
function detectAllHooks(cwd, options) {
  const homeDir = options?.homeDir ?? homedir5();
  const detectCopilotCLI = () => {
    const errors = [];
    const hooksCheck = _checkCopilotEnabled(homeDir, cwd, options?.copilotCliVersion, errors);
    if (hooksCheck.disabledBy) {
      return {
        platform: "copilot-cli",
        status: "disabled",
        method: "hook config",
        configPath: hooksCheck.disabledBy,
        configPaths: [hooksCheck.disabledBy],
        errors: errors.length > 0 ? errors : undefined
      };
    }
    if (options?.copilotPluginInstalled === true || hooksCheck.activeConfigPaths.length > 0) {
      const viaPlugin = options?.copilotPluginInstalled === true;
      const primaryConfigPath = hooksCheck.activeConfigPaths[0];
      return {
        platform: "copilot-cli",
        status: "configured",
        method: viaPlugin ? "plugin list" : "hook config",
        configPath: primaryConfigPath ?? (viaPlugin ? COPILOT_PLUGIN_CONFIG_PATH : undefined),
        configPaths: hooksCheck.activeConfigPaths.length > 0 ? hooksCheck.activeConfigPaths : undefined,
        selfTest: runSelfTest(),
        errors: errors.length > 0 ? errors : undefined
      };
    }
    return {
      platform: "copilot-cli",
      status: "n/a",
      errors: errors.length > 0 ? errors : undefined
    };
  };
  return [
    detectClaudeCode(options?.claudePluginListOutput),
    detectOpenCode(homeDir),
    detectGeminiCLI(options?.geminiExtensionsListOutput),
    detectCopilotCLI(),
    detectCodex(homeDir)
  ];
}

// src/bin/doctor/system-info.ts
import { spawn } from "node:child_process";
var CURRENT_VERSION = "0.9.0";
var VERSION_FETCH_TIMEOUT_MS = 2000;
function getPackageVersion() {
  return CURRENT_VERSION;
}
var COPILOT_PLUGIN_ID = "copilot-safety-net";
var defaultVersionFetcher = async (args) => {
  const [cmd, ...rest] = args;
  if (!cmd)
    return null;
  return new Promise((resolve7) => {
    try {
      const proc = spawn(cmd, rest, {
        stdio: ["ignore", "pipe", "pipe"]
      });
      let isSettled = false;
      let output = "";
      let errorOutput = "";
      proc.stdout.on("data", (data) => {
        output += data.toString();
      });
      proc.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });
      const finish = (value) => {
        if (isSettled)
          return;
        isSettled = true;
        clearTimeout(timeoutId);
        resolve7(value);
      };
      const timeoutId = setTimeout(() => {
        proc.kill();
        finish(null);
      }, VERSION_FETCH_TIMEOUT_MS);
      proc.on("close", (code) => {
        finish(code === 0 ? output.trim() || errorOutput.trim() || null : null);
      });
      proc.on("error", () => {
        finish(null);
      });
    } catch {
      resolve7(null);
    }
  });
};
function parseVersion(output) {
  if (!output)
    return null;
  const claudeMatch = /Claude Code\s+(\d+\.\d+\.\d+)/i.exec(output);
  if (claudeMatch)
    return claudeMatch[1] ?? null;
  const versionMatch = /v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(output);
  if (versionMatch)
    return versionMatch[1] ?? null;
  const firstLine = output.split(`
`)[0]?.trim();
  return firstLine || null;
}
function hasCopilotSafetyNetPlugin(output) {
  if (!output)
    return false;
  const pluginPattern = new RegExp(`(^|[^a-z0-9-])${COPILOT_PLUGIN_ID}([^a-z0-9-]|$)`, "m");
  return pluginPattern.test(output);
}
async function getSystemInfo(fetcher = defaultVersionFetcher) {
  const fetchCopilotVersion = async () => {
    const binaryVersionPromise = fetcher(["copilot", "--binary-version"]);
    const fallbackVersionPromise = fetcher(["copilot", "--version"]);
    const binaryVersion = await binaryVersionPromise;
    if (binaryVersion) {
      return binaryVersion;
    }
    return fallbackVersionPromise;
  };
  const [
    claudeRaw,
    claudePluginListOutput,
    openCodeRaw,
    geminiRaw,
    geminiExtensionsListOutput,
    copilotRaw,
    nodeRaw,
    npmRaw,
    bunRaw,
    pluginListRaw
  ] = await Promise.all([
    fetcher(["claude", "--version"]),
    fetcher(["claude", "plugin", "list"]),
    fetcher(["opencode", "--version"]),
    fetcher(["gemini", "--version"]),
    fetcher(["gemini", "extensions", "list"]),
    fetchCopilotVersion(),
    fetcher(["node", "--version"]),
    fetcher(["npm", "--version"]),
    fetcher(["bun", "--version"]),
    fetcher(["copilot", "plugin", "list"])
  ]);
  return {
    version: CURRENT_VERSION,
    claudeCodeVersion: parseVersion(claudeRaw),
    claudePluginListOutput,
    openCodeVersion: parseVersion(openCodeRaw),
    geminiCliVersion: parseVersion(geminiRaw),
    geminiExtensionsListOutput,
    copilotCliVersion: parseVersion(copilotRaw),
    nodeVersion: parseVersion(nodeRaw),
    npmVersion: parseVersion(npmRaw),
    bunVersion: parseVersion(bunRaw),
    copilotPluginInstalled: hasCopilotSafetyNetPlugin(pluginListRaw),
    platform: `${process.platform} ${process.arch}`
  };
}

// src/bin/doctor/updates.ts
function isNewerVersion(latest, current) {
  if (current === "dev")
    return false;
  const latestParts = latest.split(".").map(Number);
  const currentParts = current.split(".").map(Number);
  const [latestMajor = 0, latestMinor = 0, latestPatch = 0] = latestParts;
  const [currentMajor = 0, currentMinor = 0, currentPatch = 0] = currentParts;
  if (latestMajor !== currentMajor)
    return latestMajor > currentMajor;
  if (latestMinor !== currentMinor)
    return latestMinor > currentMinor;
  return latestPatch > currentPatch;
}
async function checkForUpdates() {
  const currentVersion = getPackageVersion();
  const controller = new AbortController;
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch("https://registry.npmjs.org/cc-safety-net/latest", {
      signal: controller.signal
    });
    if (!res.ok) {
      return {
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        error: `npm registry returned ${res.status}`
      };
    }
    const data = await res.json();
    const updateAvailable = isNewerVersion(data.version, currentVersion);
    return {
      currentVersion,
      latestVersion: data.version,
      updateAvailable
    };
  } catch (e) {
    return {
      currentVersion,
      latestVersion: null,
      updateAvailable: false,
      error: e instanceof Error ? e.message : "Network error"
    };
  } finally {
    clearTimeout(timeout);
  }
}

// src/bin/doctor/flags.ts
function parseDoctorFlags(args) {
  return {
    json: args.includes("--json"),
    skipUpdateCheck: args.includes("--skip-update-check")
  };
}

// src/bin/doctor/index.ts
async function runDoctor(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const system = await getSystemInfo();
  const hooks = detectAllHooks(cwd, {
    claudePluginListOutput: system.claudePluginListOutput,
    geminiExtensionsListOutput: system.geminiExtensionsListOutput,
    copilotCliVersion: system.copilotCliVersion,
    copilotPluginInstalled: system.copilotPluginInstalled
  });
  const configInfo = getConfigInfo(cwd);
  const environment = getEnvironmentInfo();
  const activity = getActivitySummary(7);
  const update = options.skipUpdateCheck ? {
    currentVersion: getPackageVersion(),
    latestVersion: null,
    updateAvailable: false
  } : await checkForUpdates();
  const report = {
    hooks,
    userConfig: configInfo.userConfig,
    projectConfig: configInfo.projectConfig,
    effectiveRules: configInfo.effectiveRules,
    shadowedRules: configInfo.shadowedRules,
    environment,
    activity,
    update,
    system
  };
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }
  const hasFailure = hooks.every((h) => h.status !== "configured") || hooks.some((h) => h.selfTest && h.selfTest.failed > 0) || configInfo.userConfig.exists && !configInfo.userConfig.valid || configInfo.projectConfig.exists && !configInfo.projectConfig.valid;
  return hasFailure ? 1 : 0;
}
function printReport(report) {
  console.log();
  console.log(formatHooksSection(report.hooks));
  console.log();
  console.log(formatConfigSection(report));
  console.log();
  console.log(formatEnvironmentSection(report.environment));
  console.log();
  console.log(formatActivitySection(report.activity));
  console.log();
  console.log(formatSystemInfoSection(report.system));
  console.log();
  console.log(formatUpdateSection(report.update));
  console.log(formatSummary(report));
}

// src/bin/explain/config.ts
import { existsSync as existsSync13 } from "node:fs";
import { resolve as resolve7 } from "node:path";
function getConfigSource(options) {
  const projectPath = getProjectConfigPath(options?.cwd);
  let invalidProjectPath = null;
  if (existsSync13(projectPath)) {
    const validation = validateConfigFile(projectPath);
    if (validation.errors.length === 0) {
      return { configSource: projectPath, configValid: true };
    }
    invalidProjectPath = projectPath;
  }
  const userPath = options?.userConfigPath ?? getUserConfigPath();
  if (existsSync13(userPath)) {
    const validation = validateConfigFile(userPath);
    return { configSource: userPath, configValid: validation.errors.length === 0 };
  }
  if (invalidProjectPath) {
    return { configSource: invalidProjectPath, configValid: false };
  }
  return { configSource: null, configValid: true };
}
function buildAnalyzeOptions(explainOptions) {
  const cwd = resolve7(explainOptions?.cwd ?? process.cwd());
  const paranoidAll = envTruthy("SAFETY_NET_PARANOID");
  return {
    cwd,
    effectiveCwd: cwd,
    config: explainOptions?.config ?? loadConfig(cwd, { userConfigDir: explainOptions?.userConfigDir }),
    strict: explainOptions?.strict ?? envTruthy("SAFETY_NET_STRICT"),
    paranoidRm: paranoidAll || envTruthy("SAFETY_NET_PARANOID_RM"),
    paranoidInterpreters: paranoidAll || envTruthy("SAFETY_NET_PARANOID_INTERPRETERS"),
    worktreeMode: envTruthy("SAFETY_NET_WORKTREE")
  };
}

// src/bin/explain/redact.ts
var ENV_ASSIGNMENT_RE2 = /^[A-Za-z_][A-Za-z0-9_]*=/;
function redactEnvVars(envMap) {
  const result = {};
  for (const key of envMap.keys()) {
    result[key] = "<redacted>";
  }
  return result;
}
function redactEnvAssignmentsInString(str) {
  return str.replace(/\b([A-Za-z_][A-Za-z0-9_]*)=(?:"[^"]*"|'[^']*'|\S+)/g, "$1=<redacted>");
}
function redactEnvAssignmentTokens(tokens) {
  return tokens.map((token) => {
    if (ENV_ASSIGNMENT_RE2.test(token)) {
      const eqIdx = token.indexOf("=");
      return `${token.slice(0, eqIdx)}=<redacted>`;
    }
    return token;
  });
}

// src/bin/explain/segment.ts
var REASON_STRICT_UNPARSEABLE2 = "Command could not be safely analyzed (strict mode). Verify manually.";
function isUnparseableCommand(command, segments) {
  return segments.length === 1 && segments[0]?.length === 1 && segments[0][0] === command && command.includes(" ");
}
function explainInnerSegments(innerCmd, depth, options, steps) {
  if (depth + 1 >= MAX_RECURSION_DEPTH) {
    steps.push({
      type: "error",
      message: REASON_RECURSION_LIMIT
    });
    return { reason: REASON_RECURSION_LIMIT };
  }
  const innerSegments = splitShellCommands(innerCmd);
  if (options.strict && isUnparseableCommand(innerCmd, innerSegments)) {
    steps.push({
      type: "strict-unparseable",
      rawCommand: redactEnvAssignmentsInString(innerCmd),
      reason: REASON_STRICT_UNPARSEABLE2
    });
    return { reason: REASON_STRICT_UNPARSEABLE2 };
  }
  let effectiveCwd = options.effectiveCwd === undefined ? options.cwd : options.effectiveCwd;
  const shellGitContextState = createShellGitContextEnvState(options.envAssignments);
  for (const segment of innerSegments) {
    if (segment.length === 1 && segment[0]?.includes(" ")) {
      const textReason = dangerousInText(segment[0]);
      if (textReason) {
        steps.push({
          type: "dangerous-text",
          token: redactEnvAssignmentsInString(segment[0]),
          matched: true,
          reason: textReason
        });
        return { reason: textReason };
      }
      steps.push({
        type: "dangerous-text",
        token: redactEnvAssignmentsInString(segment[0]),
        matched: false
      });
      if (segmentChangesCwd(segment)) {
        steps.push({
          type: "cwd-change",
          segment: redactEnvAssignmentsInString(segment.join(" ")),
          effectiveCwdNowUnknown: true
        });
        effectiveCwd = null;
      }
      continue;
    }
    const result = explainSegment(segment, depth + 1, {
      ...options,
      effectiveCwd,
      envAssignments: getSegmentGitContextEnvAssignments(segment, shellGitContextState)
    }, steps);
    if (result)
      return result;
    if (segmentChangesCwd(segment)) {
      steps.push({
        type: "cwd-change",
        segment: redactEnvAssignmentsInString(segment.join(" ")),
        effectiveCwdNowUnknown: true
      });
      effectiveCwd = null;
    }
    applyShellGitContextEnvSegment(segment, shellGitContextState);
  }
  return null;
}
function explainSegment(tokens, depth, options, steps) {
  if (depth >= MAX_RECURSION_DEPTH) {
    steps.push({
      type: "error",
      message: REASON_RECURSION_LIMIT
    });
    return { reason: REASON_RECURSION_LIMIT };
  }
  const envResult = stripEnvAssignmentsWithInfo(tokens);
  if (envResult.envAssignments.size > 0) {
    steps.push({
      type: "env-strip",
      input: redactEnvAssignmentTokens(tokens),
      envVars: redactEnvVars(envResult.envAssignments),
      output: envResult.tokens
    });
  }
  const effectiveCwd = options.effectiveCwd === undefined ? options.cwd : options.effectiveCwd;
  const cwdUnknown = effectiveCwd === null;
  const baseCwdForRm = cwdUnknown ? undefined : effectiveCwd ?? options.cwd;
  const originalCwd = cwdUnknown ? undefined : options.cwd;
  const wrapperResult = stripWrappersWithInfo(envResult.tokens, baseCwdForRm);
  const removed = envResult.tokens.slice(0, envResult.tokens.length - wrapperResult.tokens.length);
  if (removed.length > 0) {
    steps.push({
      type: "leading-tokens-stripped",
      input: redactEnvAssignmentTokens(envResult.tokens),
      removed: redactEnvAssignmentTokens(removed),
      output: wrapperResult.tokens
    });
  }
  const strippedTokens = wrapperResult.tokens;
  const envAssignments = new Map(options.envAssignments ?? []);
  for (const [k, v] of envResult.envAssignments) {
    envAssignments.set(k, v);
  }
  for (const [k, v] of wrapperResult.envAssignments) {
    envAssignments.set(k, v);
  }
  const cwdForRm = wrapperResult.cwd === null ? undefined : wrapperResult.cwd ?? baseCwdForRm;
  const nestedEffectiveCwd = wrapperResult.cwd === undefined ? options.effectiveCwd : wrapperResult.cwd;
  const nestedOptions = {
    ...options,
    effectiveCwd: nestedEffectiveCwd,
    envAssignments
  };
  if (strippedTokens.length === 0) {
    return null;
  }
  const head = strippedTokens[0];
  if (!head)
    return null;
  const baseName = head.split("/").pop() ?? head;
  const baseNameLower = baseName.toLowerCase();
  if (SHELL_WRAPPERS.has(baseNameLower)) {
    const innerCmd = extractDashCArg(strippedTokens);
    if (innerCmd) {
      const redactedInnerCmd = redactEnvAssignmentsInString(innerCmd);
      steps.push({
        type: "shell-wrapper",
        wrapper: baseNameLower,
        innerCommand: redactedInnerCmd
      });
      steps.push({
        type: "recurse",
        reason: "shell-wrapper",
        innerCommand: redactedInnerCmd,
        depth: depth + 1
      });
      return explainInnerSegments(innerCmd, depth, nestedOptions, steps);
    }
  }
  if (INTERPRETERS.has(baseNameLower)) {
    const codeArg = extractInterpreterCodeArg(strippedTokens);
    if (codeArg) {
      const paranoidBlocked = !!options.paranoidInterpreters;
      const redactedCodeArg = redactEnvAssignmentsInString(codeArg);
      steps.push({
        type: "interpreter",
        interpreter: baseNameLower,
        codeArg: redactedCodeArg,
        paranoidBlocked
      });
      if (paranoidBlocked) {
        return { reason: REASON_INTERPRETER_BLOCKED + PARANOID_INTERPRETERS_SUFFIX };
      }
      steps.push({
        type: "recurse",
        reason: "interpreter",
        innerCommand: redactedCodeArg,
        depth: depth + 1
      });
      const nestedResult = explainInnerSegments(codeArg, depth, nestedOptions, steps);
      if (nestedResult)
        return nestedResult;
      if (containsDangerousCode(codeArg)) {
        steps.push({
          type: "dangerous-text",
          token: redactedCodeArg,
          matched: true,
          reason: REASON_INTERPRETER_DANGEROUS
        });
        return { reason: REASON_INTERPRETER_DANGEROUS };
      }
      return null;
    }
  }
  if (baseNameLower === "busybox" && strippedTokens.length > 1) {
    const subcommand = strippedTokens[1] ?? "unknown";
    steps.push({
      type: "busybox",
      subcommand
    });
    const busyboxInnerCmd = strippedTokens.slice(1).join(" ");
    steps.push({
      type: "recurse",
      reason: "busybox",
      innerCommand: redactEnvAssignmentsInString(busyboxInnerCmd),
      depth: depth + 1
    });
    return explainSegment(strippedTokens.slice(1), depth + 1, nestedOptions, steps);
  }
  const allowTmpdirVar = !isTmpdirOverriddenToNonTemp(envAssignments);
  const tmpdirValue = envAssignments.get("TMPDIR") ?? process.env.TMPDIR ?? null;
  const isGit = baseNameLower === "git";
  const isRm = baseName === "rm";
  const isFind = baseName === "find";
  const isXargs = baseName === "xargs";
  const isParallel = baseName === "parallel";
  if (isRm || isXargs || isParallel) {
    steps.push({
      type: "tmpdir-check",
      tmpdirValue,
      isOverriddenToNonTemp: !allowTmpdirVar,
      allowTmpdirVar
    });
  }
  if (isGit) {
    const gitOptions = {
      cwd: cwdForRm,
      envAssignments,
      worktreeMode: options.worktreeMode
    };
    const relaxation = getGitWorktreeRelaxation(strippedTokens, gitOptions);
    const reason = analyzeGit(strippedTokens, gitOptions);
    steps.push({
      type: "rule-check",
      ruleModule: "git",
      ruleFunction: "analyzeGit",
      matched: !!reason || !!relaxation,
      reason: reason ?? relaxation?.originalReason
    });
    if (relaxation) {
      steps.push({
        type: "worktree-relaxation",
        originalReason: relaxation.originalReason,
        gitCwd: relaxation.gitCwd
      });
    }
    if (reason)
      return { reason };
  }
  if (isRm) {
    const reason = analyzeRm(strippedTokens, {
      cwd: cwdForRm,
      originalCwd,
      paranoid: options.paranoidRm,
      allowTmpdirVar
    });
    steps.push({
      type: "rule-check",
      ruleModule: "rules-rm.ts",
      ruleFunction: "analyzeRm",
      matched: !!reason,
      reason: reason ?? undefined
    });
    if (reason)
      return { reason };
  }
  if (isFind) {
    const reason = analyzeFind(strippedTokens);
    steps.push({
      type: "rule-check",
      ruleModule: "analyze/find.ts",
      ruleFunction: "analyzeFind",
      matched: !!reason,
      reason: reason ?? undefined
    });
    if (reason)
      return { reason };
  }
  if (isXargs) {
    const reason = analyzeXargs(strippedTokens, {
      cwd: cwdForRm,
      originalCwd,
      paranoidRm: options.paranoidRm,
      allowTmpdirVar,
      envAssignments,
      worktreeMode: options.worktreeMode
    });
    steps.push({
      type: "rule-check",
      ruleModule: "analyze/xargs.ts",
      ruleFunction: "analyzeXargs",
      matched: !!reason,
      reason: reason ?? undefined
    });
    if (reason)
      return { reason };
  }
  if (isParallel) {
    const analyzeNested = (cmd, overrides) => {
      const overriddenOptions = {
        ...nestedOptions,
        effectiveCwd: overrides && Object.hasOwn(overrides, "effectiveCwd") ? overrides.effectiveCwd : nestedOptions.effectiveCwd,
        envAssignments: overrides?.envAssignments ?? nestedOptions.envAssignments,
        worktreeMode: overrides?.worktreeMode ?? nestedOptions.worktreeMode
      };
      const result = explainInnerSegments(cmd, depth, overriddenOptions, steps);
      return result?.reason ?? null;
    };
    const reason = analyzeParallel(strippedTokens, {
      cwd: cwdForRm,
      originalCwd,
      paranoidRm: options.paranoidRm,
      allowTmpdirVar,
      envAssignments,
      worktreeMode: options.worktreeMode,
      analyzeNested
    });
    steps.push({
      type: "rule-check",
      ruleModule: "analyze/parallel.ts",
      ruleFunction: "analyzeParallel",
      matched: !!reason,
      reason: reason ?? undefined
    });
    if (reason)
      return { reason };
  }
  const matchedKnown = isGit || isRm || isFind || isXargs || isParallel;
  const tokensScanned = [];
  let fallbackReason = null;
  let fallbackRelaxation = null;
  let embeddedCommandFound;
  if (!matchedKnown && !DISPLAY_COMMANDS.has(normalizeCommandToken(head))) {
    for (let i = 1;i < strippedTokens.length && !fallbackReason; i++) {
      const token = strippedTokens[i];
      if (!token)
        continue;
      tokensScanned.push(token);
      const cmd = normalizeCommandToken(token);
      if (cmd === "rm") {
        embeddedCommandFound = "rm";
        const rmTokens = ["rm", ...strippedTokens.slice(i + 1)];
        fallbackReason = analyzeRm(rmTokens, {
          cwd: cwdForRm,
          originalCwd,
          paranoid: options.paranoidRm,
          allowTmpdirVar
        });
      }
      if (!fallbackReason && cmd === "git") {
        embeddedCommandFound = "git";
        const gitTokens = ["git", ...strippedTokens.slice(i + 1)];
        const gitOptions = {
          cwd: cwdForRm,
          envAssignments,
          worktreeMode: false
        };
        fallbackRelaxation = getGitWorktreeRelaxation(gitTokens, gitOptions);
        fallbackReason = analyzeGit(gitTokens, gitOptions);
      }
      if (!fallbackReason && cmd === "find") {
        embeddedCommandFound = "find";
        const findTokens = ["find", ...strippedTokens.slice(i + 1)];
        fallbackReason = analyzeFind(findTokens);
      }
    }
  }
  steps.push({
    type: "fallback-scan",
    tokensScanned,
    embeddedCommandFound
  });
  if (fallbackRelaxation) {
    steps.push({
      type: "worktree-relaxation",
      originalReason: fallbackRelaxation.originalReason,
      gitCwd: fallbackRelaxation.gitCwd
    });
  }
  if (fallbackReason)
    return { reason: fallbackReason };
  const shouldCheckCustomRules = depth === 0 || !matchedKnown;
  const hasRules = options.config?.rules && options.config.rules.length > 0;
  if (shouldCheckCustomRules && hasRules && options.config) {
    const customResult = checkCustomRules(strippedTokens, options.config.rules);
    steps.push({
      type: "custom-rules-check",
      rulesChecked: true,
      matched: !!customResult,
      reason: customResult ?? undefined
    });
    if (customResult)
      return { reason: customResult };
  } else {
    steps.push({
      type: "custom-rules-check",
      rulesChecked: false,
      matched: false
    });
  }
  return null;
}
// src/bin/explain/analyze.ts
function explainCommand2(command, options) {
  const trace = { steps: [], segments: [] };
  const analyzeOpts = buildAnalyzeOptions(options);
  const { configSource, configValid } = getConfigSource({ cwd: options?.cwd });
  if (!command || !command.trim()) {
    trace.steps.push({ type: "error", message: "No command provided" });
    return {
      trace,
      result: "allowed",
      configSource,
      configValid
    };
  }
  const segments = splitShellCommands(command);
  const redactedInput = command.replace(/\b([A-Za-z_][A-Za-z0-9_]*)=(?:"[^"]*"|'[^']*'|\S+)/g, "$1=<redacted>");
  const redactedSegments = segments.map((seg) => redactEnvAssignmentTokens(seg));
  trace.steps.push({
    type: "parse",
    input: redactedInput,
    segments: redactedSegments
  });
  if (analyzeOpts.strict && isUnparseableCommand(command, segments)) {
    trace.steps.push({
      type: "strict-unparseable",
      rawCommand: redactedInput,
      reason: REASON_STRICT_UNPARSEABLE2
    });
    return {
      trace,
      result: "blocked",
      reason: REASON_STRICT_UNPARSEABLE2,
      segment: redactEnvAssignmentsInString(command),
      configSource,
      configValid
    };
  }
  let blocked = false;
  let blockReason;
  let blockSegment;
  let effectiveCwd = analyzeOpts.effectiveCwd;
  const shellGitContextState = createShellGitContextEnvState(analyzeOpts.envAssignments);
  for (let i = 0;i < segments.length; i++) {
    const segment = segments[i];
    if (!segment)
      continue;
    const segmentSteps = [];
    if (blocked) {
      segmentSteps.push({
        type: "segment-skipped",
        index: i,
        reason: "prior-segment-blocked"
      });
      trace.segments.push({ index: i, steps: segmentSteps });
      continue;
    }
    if (segment.length === 1 && segment[0]?.includes(" ")) {
      const textReason = dangerousInText(segment[0]);
      if (textReason) {
        segmentSteps.push({
          type: "dangerous-text",
          token: redactEnvAssignmentsInString(segment[0]),
          matched: true,
          reason: textReason
        });
        trace.segments.push({ index: i, steps: segmentSteps });
        blocked = true;
        blockReason = textReason;
        blockSegment = redactEnvAssignmentsInString(segment.join(" "));
        continue;
      }
      segmentSteps.push({
        type: "dangerous-text",
        token: redactEnvAssignmentsInString(segment[0]),
        matched: false
      });
      if (segmentChangesCwd(segment)) {
        segmentSteps.push({
          type: "cwd-change",
          segment: redactEnvAssignmentsInString(segment.join(" ")),
          effectiveCwdNowUnknown: true
        });
        effectiveCwd = null;
      }
      trace.segments.push({ index: i, steps: segmentSteps });
      continue;
    }
    const result = explainSegment(segment, 0, {
      ...analyzeOpts,
      effectiveCwd,
      envAssignments: getSegmentGitContextEnvAssignments(segment, shellGitContextState)
    }, segmentSteps);
    if (result) {
      blocked = true;
      blockReason = result.reason;
      blockSegment = redactEnvAssignmentsInString(segment.join(" "));
    }
    if (segmentChangesCwd(segment)) {
      segmentSteps.push({
        type: "cwd-change",
        segment: redactEnvAssignmentsInString(segment.join(" ")),
        effectiveCwdNowUnknown: true
      });
      effectiveCwd = null;
    }
    applyShellGitContextEnvSegment(segment, shellGitContextState);
    trace.segments.push({ index: i, steps: segmentSteps });
  }
  return {
    trace,
    result: blocked ? "blocked" : "allowed",
    reason: blockReason,
    segment: blockSegment,
    customRule: getCustomRuleMetadata(blockReason, options, analyzeOpts.cwd ?? process.cwd()),
    configSource,
    configValid
  };
}
function getCustomRuleMetadata(reason, options, cwd) {
  const id = reason?.match(/^\[([^\]]+)]/)?.[1];
  if (!id)
    return;
  if (options?.config) {
    return options.config.rules.some((rule) => rule.name === id) ? { id } : undefined;
  }
  const policy = loadRulesPolicy({ cwd, userConfigDir: options?.userConfigDir });
  if (!policy.rules.some((rule) => rule.name === id))
    return;
  const rulebook = policy.rulebooks.find((item) => item.rules.includes(id));
  const override = {
    ...policy.userConfig?.overrides ?? {},
    ...policy.projectConfig?.overrides ?? {}
  }[id];
  return {
    id,
    ...rulebook ? {
      rulebook: { name: rulebook.name, version: rulebook.version },
      source: rulebook.spec
    } : {},
    ...override && typeof override === "object" ? { override: { type: "reason", reason: override.reason } } : {}
  };
}
// src/bin/explain/flags.ts
function parseExplainFlags(args) {
  let json = false;
  let cwd;
  const remaining = [];
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      i++;
      continue;
    }
    if (arg === "--") {
      remaining.push(...args.slice(i + 1));
      break;
    }
    if (!arg?.startsWith("--")) {
      remaining.push(...args.slice(i));
      break;
    }
    if (arg === "--json") {
      json = true;
      i++;
    } else if (arg === "--cwd") {
      i++;
      if (i >= args.length || args[i]?.startsWith("--")) {
        console.error("Error: --cwd requires a path");
        return null;
      }
      cwd = args[i];
      i++;
    } else {
      remaining.push(...args.slice(i));
      break;
    }
  }
  const command = remaining.length === 1 ? remaining[0] : $quote(remaining);
  if (!command) {
    console.error("Error: No command provided");
    console.error("Usage: cc-safety-net explain [--json] [--cwd <path>] <command>");
    return null;
  }
  return { json, cwd, command };
}
// src/bin/explain/format-helpers.ts
function getBoxChars(asciiOnly) {
  if (asciiOnly) {
    return {
      dh: "=",
      dv: "|",
      dtl: "+",
      dtr: "+",
      dbl: "+",
      dbr: "+",
      h: "-",
      v: "|",
      tl: "+",
      tr: "+",
      bl: "+",
      br: "+",
      sh: "="
    };
  }
  return {
    dh: "═",
    dv: "║",
    dtl: "╔",
    dtr: "╗",
    dbl: "╚",
    dbr: "╝",
    h: "─",
    v: "│",
    tl: "┌",
    tr: "┐",
    bl: "└",
    br: "┘",
    sh: "━"
  };
}
function formatHeader(box, width) {
  const title = "  Command Analysis";
  const padding = width - title.length;
  return [
    `${box.dtl}${box.dh.repeat(width)}${box.dtr}`,
    `${box.dv}${title}${" ".repeat(padding)}${box.dv}`,
    `${box.dbl}${box.dh.repeat(width)}${box.dbr}`
  ];
}
function formatTokenArray(tokens) {
  return JSON.stringify(tokens);
}
function formatColoredTokenArray(tokens, seed = 0) {
  const coloredTokens = tokens.map((token, index) => colorizeToken(token, index, seed));
  return `[${coloredTokens.join(",")}]`;
}
function wrapReason(reason, indent, maxWidth = 70) {
  const words = reason.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if (current.length + word.length + 1 > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current)
    lines.push(current);
  return lines.map((line, i) => i === 0 ? line : `${indent}${line}`);
}
function formatStepStyleD(step, stepNum, box) {
  const lines = [];
  switch (step.type) {
    case "parse":
      return null;
    case "env-strip": {
      lines.push("");
      lines.push(`STEP ${stepNum} ${box.h} Strip environment variables`);
      const envKeys = Object.keys(step.envVars);
      lines.push(`  Removed: ${envKeys.map((k) => `${k}=<redacted>`).join(", ")}`);
      lines.push(`  Tokens:  ${formatTokenArray(step.output)}`);
      return { lines, incrementStep: true };
    }
    case "leading-tokens-stripped": {
      lines.push("");
      lines.push(`STEP ${stepNum} ${box.h} Strip wrappers`);
      lines.push(`  Removed: ${step.removed.join(", ")}`);
      lines.push(`  Tokens:  ${formatTokenArray(step.output)}`);
      return { lines, incrementStep: true };
    }
    case "shell-wrapper": {
      lines.push("");
      lines.push(`STEP ${stepNum} ${box.h} Detect shell wrapper`);
      lines.push(`  Wrapper: ${step.wrapper} -c`);
      lines.push(`  Inner:   ${step.innerCommand}`);
      return { lines, incrementStep: true };
    }
    case "interpreter": {
      lines.push("");
      lines.push(`STEP ${stepNum} ${box.h} Detect interpreter`);
      lines.push(`  Interpreter: ${step.interpreter}`);
      lines.push(`  Code:        ${step.codeArg}`);
      if (step.paranoidBlocked) {
        lines.push(`  Result:      ✗ BLOCKED (paranoid mode)`);
      }
      return { lines, incrementStep: true };
    }
    case "busybox": {
      lines.push("");
      lines.push(`STEP ${stepNum} ${box.h} Busybox wrapper`);
      lines.push(`  Subcommand: ${step.subcommand}`);
      return { lines, incrementStep: true };
    }
    case "recurse":
      return { lines: [], incrementStep: false };
    case "rule-check": {
      lines.push("");
      lines.push(`STEP ${stepNum} ${box.h} Match rules`);
      const ruleRef = `${step.ruleModule}:${step.ruleFunction}()`;
      lines.push(`  Rule:   ${ruleRef}`);
      if (step.matched) {
        lines.push(`  Result: MATCHED`);
      } else {
        lines.push(`  Result: No match`);
      }
      return { lines, incrementStep: true };
    }
    case "worktree-relaxation": {
      lines.push("");
      lines.push(`STEP ${stepNum} ${box.h} Worktree relaxation`);
      lines.push(`  Mode:   ${ENV_FLAGS.worktree.name}`);
      lines.push(`  Git cwd: ${step.gitCwd}`);
      lines.push(`  Result: Allowed local discard in linked worktree`);
      return { lines, incrementStep: true };
    }
    case "tmpdir-check":
      return null;
    case "fallback-scan": {
      if (step.embeddedCommandFound) {
        lines.push("");
        lines.push(`STEP ${stepNum} ${box.h} Fallback scan`);
        lines.push(`  Found: ${step.embeddedCommandFound}`);
        return { lines, incrementStep: true };
      }
      return null;
    }
    case "custom-rules-check": {
      if (step.rulesChecked) {
        lines.push("");
        lines.push(`STEP ${stepNum} ${box.h} Custom rules`);
        if (step.matched) {
          lines.push(`  Result: MATCHED`);
        } else {
          lines.push(`  Result: No match`);
        }
        return { lines, incrementStep: true };
      }
      return null;
    }
    case "cwd-change":
      return null;
    case "dangerous-text": {
      if (step.matched) {
        lines.push("");
        lines.push(`STEP ${stepNum} ${box.h} Dangerous text check`);
        lines.push(`  Token:  ${step.token}`);
        lines.push(`  Result: MATCHED`);
        return { lines, incrementStep: true };
      }
      return null;
    }
    case "strict-unparseable": {
      lines.push("");
      lines.push(`STEP ${stepNum} ${box.h} Strict mode check`);
      lines.push(`  Command: ${step.rawCommand}`);
      lines.push(`  Result:  ✗ UNPARSEABLE`);
      return { lines, incrementStep: true };
    }
    case "segment-skipped":
      return null;
    case "error": {
      lines.push("");
      lines.push(`ERROR: ${step.message}`);
      return { lines, incrementStep: false };
    }
    default:
      return null;
  }
}

// src/bin/explain/format.ts
function formatTraceHuman(result, options) {
  const box = getBoxChars(options?.asciiOnly ?? false);
  const width = 58;
  const lines = [];
  let stepNum = 1;
  lines.push(...formatHeader(box, width));
  lines.push("");
  const errorStep = result.trace.steps.find((s) => s.type === "error");
  if (errorStep && errorStep.type === "error") {
    lines.push("ERROR");
    lines.push(`  ${errorStep.message}`);
    lines.push("");
    lines.push("RESULT");
    lines.push(`  Status: ${result.result === "blocked" ? colors.red("BLOCKED") : colors.green("ALLOWED")}`);
    lines.push("");
    lines.push("CONFIG");
    const configPath2 = result.configSource ?? "none";
    lines.push(`  Path: ${configPath2}`);
    return lines.join(`
`);
  }
  const parseStep = result.trace.steps.find((s) => s.type === "parse");
  if (parseStep && parseStep.type === "parse") {
    lines.push("INPUT");
    lines.push(`  ${parseStep.input}`);
    lines.push("");
    lines.push(`STEP ${stepNum} ${box.h} Split shell commands`);
    stepNum++;
    for (let i = 0;i < parseStep.segments.length; i++) {
      const seg = parseStep.segments[i];
      if (seg) {
        const seed = Math.random();
        lines.push(`  Segment ${i + 1}: ${formatColoredTokenArray(seg, seed)}`);
      }
    }
  }
  const segments = result.trace.segments;
  const hasMultipleSegments = segments.length > 1;
  for (const seg of segments) {
    if (hasMultipleSegments) {
      lines.push("");
      let segCommand = "";
      if (parseStep && parseStep.type === "parse") {
        const tokens = parseStep.segments[seg.index];
        if (tokens) {
          segCommand = tokens.join(" ");
        }
      }
      const maxLabelLen = width - 4;
      let displayCommand = segCommand;
      const baseLabel = ` Segment ${seg.index + 1}: `;
      const suffix = " ";
      if (segCommand) {
        const totalLen = baseLabel.length + segCommand.length + suffix.length;
        if (totalLen > maxLabelLen) {
          const availableForCmd = maxLabelLen - baseLabel.length - suffix.length;
          displayCommand = `${segCommand.substring(0, availableForCmd - 1)}…`;
        }
      }
      const labelContent = segCommand ? `${baseLabel}${displayCommand}${suffix}` : ` Segment ${seg.index + 1} `;
      const coloredContent = segCommand ? `${baseLabel}${colors.cyan(displayCommand)}${suffix}` : labelContent;
      const segLineLen = width - labelContent.length;
      const leftLen = Math.floor(segLineLen / 2);
      const rightLen = segLineLen - leftLen;
      lines.push(`${box.sh.repeat(leftLen)}${coloredContent}${box.sh.repeat(rightLen)}`);
    }
    const skippedStep = seg.steps.find((s) => s.type === "segment-skipped");
    if (skippedStep) {
      lines.push("");
      lines.push("  (skipped — prior segment blocked)");
      continue;
    }
    let inRecursion = false;
    let hasVisibleSteps = false;
    for (const step of seg.steps) {
      const formattedStep = formatStepStyleD(step, stepNum, box);
      if (formattedStep) {
        hasVisibleSteps = true;
        if (step.type === "recurse") {
          lines.push("");
          const recurseLabel = " RECURSING ";
          const recurseLineLen = width - recurseLabel.length - 4;
          lines.push(`  ${box.tl}${box.h}${recurseLabel}${box.h.repeat(recurseLineLen)}`);
          lines.push(`  ${box.v}`);
          inRecursion = true;
          continue;
        }
        for (const line of formattedStep.lines) {
          if (inRecursion) {
            lines.push(`  ${box.v} ${line}`);
          } else {
            lines.push(line);
          }
        }
        if (formattedStep.incrementStep) {
          stepNum++;
        }
      }
    }
    if (inRecursion) {
      lines.push(`  ${box.v}`);
      lines.push(`  ${box.bl}${box.h.repeat(width - 2)}`);
      inRecursion = false;
    }
    if (!hasVisibleSteps) {
      lines.push("");
      lines.push(`  ${colors.green("✓")} Allowed (no matching rules)`);
    }
  }
  lines.push("");
  lines.push("RESULT");
  if (result.result === "blocked") {
    lines.push(`  Status: ${colors.red("BLOCKED")}`);
    if (result.customRule) {
      lines.push(`  Rule: ${result.customRule.id}`);
      if (result.customRule.rulebook) {
        lines.push(`  Rulebook: ${result.customRule.rulebook.name} ${result.customRule.rulebook.version}`);
      }
      if (result.customRule.source) {
        lines.push(`  Source: ${result.customRule.source}`);
      }
      if (result.customRule.override) {
        lines.push(`  Override: reason ${result.customRule.override.reason}`);
      }
    }
    if (result.reason) {
      const reasonLines = wrapReason(result.reason, "          ");
      lines.push(`  Reason: ${reasonLines[0]}`);
      for (let i = 1;i < reasonLines.length; i++) {
        lines.push(reasonLines[i] ?? "");
      }
    }
  } else {
    lines.push(`  Status: ${colors.green("ALLOWED")}`);
  }
  lines.push("");
  lines.push("CONFIG");
  const configPath = result.configSource ?? "none";
  const configStatus = result.configValid ? "" : " (invalid)";
  lines.push(`  Path: ${configPath}${configStatus}`);
  return lines.join(`
`);
}
function formatTraceJson(result) {
  return JSON.stringify(result, null, 2);
}
// src/bin/help.ts
var version = "0.9.0";
var INDENT = "  ";
var PROGRAM_NAME = "cc-safety-net";
function formatOptionFlags(option) {
  return option.argument ? `${option.flags} ${option.argument}` : option.flags;
}
function getOptionsColumnWidth(options) {
  return Math.max(...options.map((opt) => formatOptionFlags(opt).length));
}
function getSubcommandsColumnWidth(subcommands) {
  return Math.max(...subcommands.map((subcommand) => subcommand.usage.length));
}
function formatCommandSummary(cmd, maxUsageWidth) {
  const usage = `${PROGRAM_NAME} ${cmd.usage}`;
  return `${INDENT}${usage.padEnd(maxUsageWidth + PROGRAM_NAME.length + 3)}${cmd.description}`;
}
function printCommandHelp(command) {
  const lines = [];
  lines.push(`${PROGRAM_NAME} ${command.name}`);
  lines.push("");
  lines.push(`${INDENT}${command.description}`);
  lines.push("");
  lines.push("USAGE:");
  lines.push(`${INDENT}${PROGRAM_NAME} ${command.usage}`);
  lines.push("");
  if (command.subcommands && command.subcommands.length > 0) {
    lines.push("SUBCOMMANDS:");
    const subcommandWidth = getSubcommandsColumnWidth(command.subcommands);
    for (const subcommand of command.subcommands) {
      lines.push(`${INDENT}${subcommand.usage.padEnd(subcommandWidth + 2)}${subcommand.description}`);
    }
    lines.push("");
  }
  if (command.options.length > 0) {
    lines.push("OPTIONS:");
    const optWidth = getOptionsColumnWidth(command.options);
    for (const opt of command.options) {
      const flags = formatOptionFlags(opt);
      lines.push(`${INDENT}${flags.padEnd(optWidth + 2)}${opt.description}`);
    }
    lines.push("");
  }
  if (command.examples && command.examples.length > 0) {
    lines.push("EXAMPLES:");
    for (const example of command.examples) {
      lines.push(`${INDENT}${example}`);
    }
  }
  console.log(lines.join(`
`));
}
function printHelp() {
  const visibleCommands = getVisibleCommands();
  const maxUsageWidth = Math.max(...visibleCommands.map((cmd) => cmd.usage.length));
  const lines = [];
  lines.push(`${PROGRAM_NAME} v${version}`);
  lines.push("");
  lines.push("Blocks destructive git and filesystem commands before execution.");
  lines.push("");
  lines.push("COMMANDS:");
  for (const cmd of visibleCommands) {
    lines.push(formatCommandSummary(cmd, maxUsageWidth));
  }
  lines.push("");
  lines.push("GLOBAL OPTIONS:");
  lines.push(`${INDENT}-h, --help       Show help (use with command for command-specific help)`);
  lines.push(`${INDENT}-V, --version    Show version`);
  lines.push("");
  lines.push("HELP:");
  lines.push(`${INDENT}${PROGRAM_NAME} help <command>     Show help for a specific command`);
  lines.push(`${INDENT}${PROGRAM_NAME} <command> --help   Show help for a specific command`);
  lines.push("");
  lines.push("ENVIRONMENT VARIABLES:");
  lines.push(`${INDENT}${ENV_FLAGS.strict.name}=1               Fail-closed on unparseable commands`);
  lines.push(`${INDENT}${ENV_FLAGS.paranoid.name}=1             Enable all paranoid checks`);
  lines.push(`${INDENT}${ENV_FLAGS.paranoidRm.name}=1          Block non-temp rm -rf within cwd`);
  lines.push(`${INDENT}${ENV_FLAGS.paranoidInterpreters.name}=1  Block interpreter one-liners`);
  lines.push(`${INDENT}${ENV_FLAGS.worktree.name}=1             Allow local git discards in linked worktrees`);
  lines.push(`${INDENT}${ENV_FLAGS.debug.name}=1              Log allowed hook commands for debugging`);
  lines.push(`${INDENT}CC_SAFETY_NET_HOME             Override rule config home directory`);
  lines.push(`${INDENT}Legacy SAFETY_NET_* names remain supported as fallbacks`);
  lines.push("");
  lines.push("CONFIG FILES:");
  lines.push(`${INDENT}~/.cc-safetynet-rules/rule.json       User-scope rule config`);
  lines.push(`${INDENT}.cc-safetynet-rules/rule.json         Project-scope rule config`);
  lines.push(`${INDENT}.safety-net.json                      Legacy project config`);
  console.log(lines.join(`
`));
}
function printVersion() {
  console.log(version);
}
function showCommandHelp(commandName) {
  const command = findCommand(commandName);
  if (!command) {
    return false;
  }
  if (command.hidden || command.name.toLowerCase() !== commandName.toLowerCase()) {
    return false;
  }
  printCommandHelp(command);
  return true;
}

// src/core/audit.ts
import { appendFileSync, existsSync as existsSync14, mkdirSync as mkdirSync3 } from "node:fs";
import { homedir as homedir6 } from "node:os";
import { join as join9 } from "node:path";
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
function writeAuditLog(sessionId, command, segment, reason, cwd, options = {}) {
  const safeSessionId = sanitizeSessionIdForFilename(sessionId);
  if (!safeSessionId) {
    return;
  }
  const home = options.homeDir ?? homedir6();
  const logsDir = join9(home, ".cc-safety-net", "logs");
  try {
    if (!existsSync14(logsDir)) {
      mkdirSync3(logsDir, { recursive: true });
    }
    const logFile = join9(logsDir, `${safeSessionId}.jsonl`);
    const entry = {
      ts: new Date().toISOString(),
      decision: options.decision ?? "deny",
      command: redactSecrets(command).slice(0, 300),
      segment: redactSecrets(segment).slice(0, 300),
      reason,
      cwd
    };
    appendFileSync(logFile, `${JSON.stringify(entry)}
`, "utf-8");
  } catch {}
}
function redactSecrets(text) {
  let result = text;
  result = result.replace(/\b([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASS|KEY|CREDENTIALS)[A-Z0-9_]*)=([^\s]+)/gi, "$1=<redacted>");
  result = result.replace(/(['"]?\s*authorization\s*:\s*)([^'"]+)(['"]?)/gi, "$1<redacted>$3");
  result = result.replace(/(authorization\s*:\s*)([^\s"']+)(\s+[^\s"']+)?/gi, "$1<redacted>");
  result = result.replace(/(https?:\/\/)([^\s/:@]+):([^\s@]+)@/gi, "$1<redacted>:<redacted>@");
  result = result.replace(/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g, "<redacted>");
  return result;
}

// src/bin/hook/common.ts
async function readHookInput(outputDeny) {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const inputText = Buffer.concat(chunks).toString("utf-8").trim();
  if (!inputText) {
    return null;
  }
  return parseHookJson(inputText, outputDeny, "Failed to parse hook input JSON (strict mode)");
}
function parseHookJson(inputText, outputDeny, strictReason) {
  try {
    return JSON.parse(inputText);
  } catch {
    if (envTruthy(ENV_FLAGS.strict))
      outputDeny(strictReason);
    return null;
  }
}
function analyzeHookCommand(command, cwd) {
  const paranoidAll = envTruthy(ENV_FLAGS.paranoid);
  return analyzeCommand(command, {
    cwd,
    config: loadConfig(cwd),
    strict: envTruthy(ENV_FLAGS.strict),
    paranoidRm: paranoidAll || envTruthy(ENV_FLAGS.paranoidRm),
    paranoidInterpreters: paranoidAll || envTruthy(ENV_FLAGS.paranoidInterpreters),
    worktreeMode: envTruthy(ENV_FLAGS.worktree)
  });
}
function handleBlockedHookCommand(command, cwd, sessionId, outputDeny) {
  const result = analyzeHookCommand(command, cwd);
  if (!result) {
    if (sessionId && envTruthy(ENV_FLAGS.debug)) {
      writeAuditLog(sessionId, command, command, "allowed", cwd, { decision: "allow" });
    }
    return;
  }
  if (sessionId) {
    writeAuditLog(sessionId, command, result.segment, result.reason, cwd);
  }
  outputDeny(result.reason, command, result.segment);
}

// src/core/format.ts
function formatBlockedMessage(input) {
  const { reason, command, segment } = input;
  const maxLen = input.maxLen ?? 200;
  const redact = input.redact ?? ((t) => t);
  let message = `BLOCKED by CC SafetyNet

Reason: ${reason}`;
  if (command) {
    const safeCommand = redact(command);
    message += `

Command: ${excerpt(safeCommand, maxLen)}`;
  }
  if (segment && segment !== command) {
    const safeSegment = redact(segment);
    message += `

Segment: ${excerpt(safeSegment, maxLen)}`;
  }
  if (input.manualPermissionAdvice !== false) {
    message += `

If this operation is truly needed, ask the user for explicit permission and have them run the command manually.`;
  }
  return message;
}
function excerpt(text, maxLen) {
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}

// src/bin/hook/claude-code.ts
function outputDeny(reason, command, segment) {
  const message = formatBlockedMessage({
    reason,
    command,
    segment,
    redact: redactSecrets,
    manualPermissionAdvice: reason.includes("rule sync") ? false : undefined
  });
  const output = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: message
    }
  };
  console.log(JSON.stringify(output));
}
async function runClaudeCodeHook() {
  const input = await readHookInput(outputDeny);
  if (!input) {
    return;
  }
  if (input.tool_name !== "Bash") {
    return;
  }
  const command = input.tool_input?.command;
  if (!command) {
    return;
  }
  handleBlockedHookCommand(command, input.cwd ?? process.cwd(), input.session_id, outputDeny);
}

// src/bin/hook/copilot-cli.ts
function outputCopilotDeny(reason, command, segment) {
  const message = formatBlockedMessage({
    reason,
    command,
    segment,
    redact: redactSecrets
  });
  const output = {
    permissionDecision: "deny",
    permissionDecisionReason: message
  };
  console.log(JSON.stringify(output));
}
async function runCopilotCliHook() {
  const input = await readHookInput(outputCopilotDeny);
  if (!input) {
    return;
  }
  if (input.toolName !== "bash") {
    return;
  }
  const toolArgs = parseHookJson(input.toolArgs, outputCopilotDeny, "Failed to parse toolArgs JSON (strict mode)");
  if (!toolArgs) {
    return;
  }
  const command = toolArgs.command;
  if (!command) {
    return;
  }
  handleBlockedHookCommand(command, input.cwd ?? process.cwd(), `copilot-${input.timestamp ?? Date.now()}`, outputCopilotDeny);
}

// src/bin/hook/gemini-cli.ts
function outputGeminiDeny(reason, command, segment) {
  const message = formatBlockedMessage({
    reason,
    command,
    segment,
    redact: redactSecrets
  });
  const output = {
    decision: "deny",
    reason: message,
    systemMessage: message
  };
  console.log(JSON.stringify(output));
}
async function runGeminiCLIHook() {
  const input = await readHookInput(outputGeminiDeny);
  if (!input) {
    return;
  }
  if (input.hook_event_name !== "BeforeTool") {
    return;
  }
  if (input.tool_name !== "run_shell_command") {
    return;
  }
  const command = input.tool_input?.command;
  if (!command) {
    return;
  }
  handleBlockedHookCommand(command, input.cwd ?? process.cwd(), input.session_id, outputGeminiDeny);
}

// src/bin/hook/install.ts
import { existsSync as existsSync15, mkdirSync as mkdirSync4, readFileSync as readFileSync12, writeFileSync as writeFileSync3 } from "node:fs";
import { homedir as homedir7 } from "node:os";
import { dirname as dirname8, join as join10 } from "node:path";
var OPENCODE_PLUGIN = "cc-safety-net@latest";
var KIMI_HOOK_COMMAND = "npx -y cc-safety-net hook --kimi-cli";
var KIMI_HOOK_BLOCK = `[[hooks]]
event = "PreToolUse"
matcher = "Shell"
command = "${KIMI_HOOK_COMMAND}"`;
var KIMI_INLINE_HOOK = `{ event = "PreToolUse", matcher = "Shell", command = "${KIMI_HOOK_COMMAND}" }`;
function getHomeDir() {
  return process.env.HOME ?? homedir7();
}
function getOpenCodeConfigDir() {
  return process.env.OPENCODE_CONFIG_DIR ?? join10(process.env.XDG_CONFIG_HOME ?? join10(getHomeDir(), ".config"), "opencode");
}
function getOpenCodeConfigPath() {
  const configDir = getOpenCodeConfigDir();
  const candidates = ["opencode.jsonc", "opencode.json", "config.json"].map((file) => join10(configDir, file));
  return candidates.find((path) => existsSync15(path)) ?? join10(configDir, "opencode.jsonc");
}
function getKimiConfigPath() {
  return join10(process.env.KIMI_SHARE_DIR ?? join10(getHomeDir(), ".kimi"), "config.toml");
}
function isWhitespace(char) {
  return char !== undefined && /\s/.test(char);
}
function skipWhitespace(content, index) {
  let current = index;
  while (isWhitespace(content[current]))
    current++;
  return current;
}
function skipWhitespaceAndComments(content, index) {
  const whitespaceEnd = skipWhitespace(content, index);
  const commentEnd = skipComment(content, whitespaceEnd);
  if (commentEnd === whitespaceEnd)
    return whitespaceEnd;
  return skipWhitespaceAndComments(content, commentEnd);
}
function skipString(content, index) {
  let current = index + 1;
  let isEscaped = false;
  while (current < content.length) {
    const char = content[current];
    if (isEscaped) {
      isEscaped = false;
      current++;
      continue;
    }
    if (char === "\\") {
      isEscaped = true;
      current++;
      continue;
    }
    if (char === '"')
      return current + 1;
    current++;
  }
  throw new Error("Unterminated string in OpenCode config");
}
function skipComment(content, index) {
  if (content[index] === "/" && content[index + 1] === "/") {
    const newlineIndex = content.indexOf(`
`, index + 2);
    return newlineIndex === -1 ? content.length : newlineIndex;
  }
  if (content[index] === "/" && content[index + 1] === "*") {
    const endIndex = content.indexOf("*/", index + 2);
    if (endIndex === -1)
      throw new Error("Unterminated comment in OpenCode config");
    return endIndex + 2;
  }
  return index;
}
function findMatchingBracket(content, openIndex) {
  const open = content[openIndex];
  const close = open === "[" ? "]" : "}";
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
    if (content[index] === open)
      depth++;
    if (content[index] === close) {
      depth--;
      if (depth === 0)
        return index;
    }
    index++;
  }
  throw new Error("Unmatched bracket in OpenCode config");
}
function findTopLevelPropertyValue(content, propertyName) {
  const rootStart = skipWhitespaceAndComments(content, 0);
  if (content[rootStart] !== "{")
    throw new Error("OpenCode config must be a JSON object");
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
      if (depth === 1 && content[colonIndex] === ":" && content.slice(index, endIndex) === JSON.stringify(propertyName)) {
        return skipWhitespace(content, colonIndex + 1);
      }
      index = endIndex;
      continue;
    }
    if (content[index] === "{" || content[index] === "[")
      depth++;
    if (content[index] === "}" || content[index] === "]")
      depth--;
    index++;
  }
  return;
}
function findOpenCodePluginArray(content) {
  const arrayStart = findTopLevelPropertyValue(content, "plugin");
  if (arrayStart === undefined)
    return;
  if (content[arrayStart] !== "[")
    throw new Error("OpenCode plugin must be an array");
  return { start: arrayStart, end: findMatchingBracket(content, arrayStart) };
}
function getLineIndent(content, index) {
  const lineStart = content.lastIndexOf(`
`, index) + 1;
  const match = /^[ \t]*/.exec(content.slice(lineStart));
  return match?.[0] ?? "";
}
function insertOpenCodePlugin(content, pluginRange, plugins) {
  const closingIndent = getLineIndent(content, pluginRange.end);
  const itemIndent = `${closingIndent}  `;
  if (plugins.length === 0) {
    return `${content.slice(0, pluginRange.start + 1)}
${itemIndent}${JSON.stringify(OPENCODE_PLUGIN)}
${closingIndent}${content.slice(pluginRange.end)}`;
  }
  const beforeClose = content.slice(0, pluginRange.end).trimEnd();
  return `${beforeClose},
${itemIndent}${JSON.stringify(OPENCODE_PLUGIN)}${content.slice(pluginRange.end)}`;
}
function parseOpenCodePluginItems(content, pluginRange) {
  const items = [];
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
    const value = JSON.parse(content.slice(index, endIndex));
    items.push({ value, start: index, end: endIndex });
    index = endIndex;
  }
  return items;
}
function removeArrayRangeItem(content, item) {
  let removeStart = item.start;
  let removeEnd = item.end;
  let index = item.end;
  while (isWhitespace(content[index]))
    index++;
  if (content[index] === ",") {
    removeEnd = index + 1;
    if (content[removeEnd] === `
`)
      removeEnd++;
    return `${content.slice(0, removeStart)}${content.slice(removeEnd)}`;
  }
  index = item.start - 1;
  while (isWhitespace(content[index]))
    index--;
  if (content[index] === ",") {
    removeStart = index;
    const lineStart = content.lastIndexOf(`
`, removeStart - 1);
    if (lineStart !== -1 && /^\s*$/.test(content.slice(lineStart + 1, removeStart))) {
      removeStart = lineStart;
    }
  }
  return `${content.slice(0, removeStart)}${content.slice(removeEnd)}`;
}
function removeOpenCodePlugin(content, pluginRange) {
  return parseOpenCodePluginItems(content, pluginRange).filter((plugin) => isManagedOpenCodePlugin(plugin.value)).reverse().reduce((updated, plugin) => removeArrayRangeItem(updated, plugin), content);
}
function findRootObjectClose(content) {
  return findMatchingBracket(content, skipWhitespaceAndComments(content, 0));
}
function addOpenCodePluginProperty(content, propertyCount) {
  const rootClose = findRootObjectClose(content);
  const closingIndent = getLineIndent(content, rootClose);
  const propertyText = `"plugin": [
${closingIndent}  ${JSON.stringify(OPENCODE_PLUGIN)}
${closingIndent}]`;
  if (propertyCount === 0) {
    return `${content.slice(0, rootClose)}${propertyText}${content.slice(rootClose)}`;
  }
  const beforeClose = content.slice(0, rootClose).trimEnd();
  return `${beforeClose},
${closingIndent}${propertyText}${content.slice(rootClose)}`;
}
function parseOpenCodeConfig(content, configPath) {
  try {
    return JSON.parse(stripJsonComments(content));
  } catch (e) {
    throw new Error(`Failed to parse ${configPath}: ${e instanceof Error ? e.message : String(e)}`);
  }
}
function isManagedOpenCodePlugin(plugin) {
  return typeof plugin === "string" && (plugin === "cc-safety-net" || plugin.startsWith("cc-safety-net@"));
}
function readOpenCodeConfig(configPath) {
  const content = readFileSync12(configPath, "utf-8");
  const config = parseOpenCodeConfig(content, configPath);
  const plugins = config.plugin;
  if (plugins !== undefined && !Array.isArray(plugins)) {
    throw new Error("OpenCode plugin must be an array");
  }
  return { content, config, plugins };
}
function installOpenCode() {
  const configPath = getOpenCodeConfigPath();
  mkdirSync4(dirname8(configPath), { recursive: true });
  if (!existsSync15(configPath)) {
    writeFileSync3(configPath, `${JSON.stringify({ plugin: [OPENCODE_PLUGIN] }, null, 2)}
`);
    return { path: configPath, alreadyInstalled: false };
  }
  const opencode = readOpenCodeConfig(configPath);
  if (opencode.plugins?.some(isManagedOpenCodePlugin)) {
    return { path: configPath, alreadyInstalled: true };
  }
  if (opencode.plugins === undefined) {
    writeFileSync3(configPath, addOpenCodePluginProperty(opencode.content, Object.keys(opencode.config).length));
    return { path: configPath, alreadyInstalled: false };
  }
  const pluginRange = findOpenCodePluginArray(opencode.content);
  if (!pluginRange)
    throw new Error("OpenCode plugin property was not found");
  writeFileSync3(configPath, insertOpenCodePlugin(opencode.content, pluginRange, opencode.plugins));
  return { path: configPath, alreadyInstalled: false };
}
function uninstallOpenCode() {
  const configPath = getOpenCodeConfigPath();
  if (!existsSync15(configPath))
    return { path: configPath, alreadyInstalled: false };
  const opencode = readOpenCodeConfig(configPath);
  if (!opencode.plugins?.some(isManagedOpenCodePlugin)) {
    return { path: configPath, alreadyInstalled: false };
  }
  const pluginRange = findOpenCodePluginArray(opencode.content);
  if (!pluginRange)
    throw new Error("OpenCode plugin property was not found");
  writeFileSync3(configPath, removeOpenCodePlugin(opencode.content, pluginRange));
  return { path: configPath, alreadyInstalled: true };
}
function removeTopLevelEmptyHooksArray(content) {
  const result = content.split(`
`).reduce((state, line) => {
    if (/^\s*\[/.test(line)) {
      state.activeTable = true;
      state.lines.push(line);
      return state;
    }
    if (!state.activeTable && /^\s*hooks\s*=\s*\[\s*]\s*(?:#.*)?$/.test(line))
      return state;
    state.lines.push(line);
    return state;
  }, { activeTable: false, lines: [] });
  return result.lines.join(`
`);
}
function findTopLevelInlineHooksArray(content) {
  let activeTable = false;
  let index = 0;
  while (index < content.length) {
    const lineEnd = content.indexOf(`
`, index);
    const end = lineEnd === -1 ? content.length : lineEnd;
    const line = content.slice(index, end);
    if (/^\s*\[/.test(line))
      activeTable = true;
    if (!activeTable) {
      const match = /^(\s*)hooks\s*=\s*\[/.exec(line);
      if (match) {
        const arrayStart = index + match[0].lastIndexOf("[");
        return { start: arrayStart, end: findTomlArrayClose(content, arrayStart) };
      }
    }
    index = lineEnd === -1 ? content.length : lineEnd + 1;
  }
  return;
}
function findTomlArrayClose(content, openIndex) {
  let depth = 0;
  let index = openIndex;
  while (index < content.length) {
    if (content[index] === "#") {
      const newlineIndex = content.indexOf(`
`, index + 1);
      index = newlineIndex === -1 ? content.length : newlineIndex + 1;
      continue;
    }
    if (content[index] === '"') {
      index = skipString(content, index);
      continue;
    }
    if (content[index] === "[")
      depth++;
    if (content[index] === "]") {
      depth--;
      if (depth === 0)
        return index;
    }
    index++;
  }
  throw new Error("Unmatched hooks array in Kimi CLI config");
}
function appendKimiInlineHook(content, hooksRange) {
  const beforeClose = content.slice(0, hooksRange.end).trimEnd();
  const closingIndent = getLineIndent(content, hooksRange.end);
  const itemIndent = closingIndent === "" ? "     " : `${closingIndent}  `;
  const needsComma = !beforeClose.endsWith("[") && !beforeClose.endsWith(",");
  return `${beforeClose}${needsComma ? "," : ""}
${itemIndent}${KIMI_INLINE_HOOK}${content.slice(hooksRange.end)}`;
}
function appendKimiHook(content) {
  const inlineHooksRange = findTopLevelInlineHooksArray(content);
  if (inlineHooksRange && content.slice(inlineHooksRange.start + 1, inlineHooksRange.end).trim()) {
    return appendKimiInlineHook(content, inlineHooksRange);
  }
  const trimmed = removeTopLevelEmptyHooksArray(content).trimEnd();
  if (trimmed === "")
    return `${KIMI_HOOK_BLOCK}
`;
  return `${trimmed}

${KIMI_HOOK_BLOCK}
`;
}
function removeKimiTableHookBlocks(content) {
  const blocks = content.split(/(?=^\s*\[\[hooks]]\s*$)/m);
  return blocks.filter((block) => !/^\s*\[\[hooks]]\s*$/m.test(block) || !block.includes(KIMI_HOOK_COMMAND)).join("").trimEnd();
}
function removeKimiInlineHook(content, hooksRange) {
  const itemStart = content.indexOf(KIMI_INLINE_HOOK, hooksRange.start);
  if (itemStart === -1 || itemStart > hooksRange.end)
    return content;
  return removeArrayRangeItem(content, {
    start: itemStart,
    end: itemStart + KIMI_INLINE_HOOK.length
  });
}
function installKimiCli() {
  const configPath = getKimiConfigPath();
  mkdirSync4(dirname8(configPath), { recursive: true });
  if (!existsSync15(configPath)) {
    writeFileSync3(configPath, `${KIMI_HOOK_BLOCK}
`);
    return { path: configPath, alreadyInstalled: false };
  }
  const content = readFileSync12(configPath, "utf-8");
  if (content.includes(KIMI_HOOK_COMMAND))
    return { path: configPath, alreadyInstalled: true };
  writeFileSync3(configPath, appendKimiHook(content));
  return { path: configPath, alreadyInstalled: false };
}
function uninstallKimiCli() {
  const configPath = getKimiConfigPath();
  if (!existsSync15(configPath))
    return { path: configPath, alreadyInstalled: false };
  const content = readFileSync12(configPath, "utf-8");
  if (!content.includes(KIMI_HOOK_COMMAND))
    return { path: configPath, alreadyInstalled: false };
  const inlineHooksRange = findTopLevelInlineHooksArray(content);
  const updated = inlineHooksRange ? removeKimiInlineHook(content, inlineHooksRange) : `${removeKimiTableHookBlocks(content)}
`;
  writeFileSync3(configPath, updated);
  return { path: configPath, alreadyInstalled: true };
}
function parseInstallTarget(args, action) {
  const targets = [
    args.includes("--opencode") ? "opencode" : undefined,
    args.includes("--kimi-cli") ? "kimi-cli" : undefined
  ].filter((target) => target !== undefined);
  const unknownOption = args.find((arg) => arg.startsWith("-") && !["--opencode", "--kimi-cli"].includes(arg));
  if (unknownOption)
    throw new Error(`Unknown install option: ${unknownOption}`);
  const unexpectedArg = args.find((arg) => !arg.startsWith("-"));
  if (unexpectedArg)
    throw new Error(`Unexpected argument for hook ${action}: ${unexpectedArg}`);
  if (targets.length !== 1)
    throw new Error("Choose exactly one install target: --opencode or --kimi-cli");
  return targets[0];
}
function runHookInstallCommand(action, args) {
  try {
    const target = parseInstallTarget(args, action);
    const result = target === "opencode" ? action === "install" ? installOpenCode() : uninstallOpenCode() : action === "install" ? installKimiCli() : uninstallKimiCli();
    const name = target === "opencode" ? "OpenCode" : "Kimi CLI";
    const pastTense = action === "install" ? "Installed" : "Uninstalled";
    console.log(action === "install" && result.alreadyInstalled ? `${name} hook already installed in ${result.path}` : action === "uninstall" && !result.alreadyInstalled ? `${name} hook not installed in ${result.path}` : `${pastTense} ${name} hook ${action === "install" ? "in" : "from"} ${result.path}`);
    return 0;
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    return 1;
  }
}

// src/bin/hook/kimi-cli.ts
function outputKimiDeny(reason, command, segment, manualPermissionAdvice) {
  const message = formatBlockedMessage({
    reason,
    command,
    segment,
    redact: redactSecrets,
    manualPermissionAdvice
  });
  const output = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: message
    }
  };
  console.log(JSON.stringify(output));
}
async function runKimiCliHook() {
  const input = await readHookInput(outputKimiDeny);
  if (!input) {
    return;
  }
  if (input.hook_event_name !== "PreToolUse") {
    return;
  }
  if (input.tool_name !== "Shell") {
    return;
  }
  const command = input.tool_input?.command;
  if (!command) {
    return;
  }
  handleBlockedHookCommand(command, input.cwd ?? process.cwd(), input.session_id, outputKimiDeny);
}

// src/bin/rule/index.ts
import { existsSync as existsSync17 } from "node:fs";
import { join as join12 } from "node:path";

// src/bin/rule/doc.ts
var RULE_DOC = `# Custom Rules Reference

Agent reference for generating CC Safety Net rulebook configuration.

## Config Locations

| Scope | Config path | Rulebook path | Priority |
|-------|-------------|---------------|----------|
| User | \`~/.cc-safetynet-rules/rule.json\` | \`~/.cc-safetynet-rules/<rulebook-name>/rulebook.json\` | Lower |
| Project | \`.cc-safetynet-rules/rule.json\` | \`.cc-safetynet-rules/<rulebook-name>/rulebook.json\` | Higher |
| GitHub source | Listed in a local \`rule.json\` | \`.cc-safetynet-rules/<rulebook-name>/rulebook.json\` in the source repository | Source order |

Use \`cc-safety-net rule init\` to create a starter local config and rulebook. Use \`--global\` for user scope.

Legacy inline \`.safety-net.json\` custom rules are deprecated. Do not create them for new rule configuration.

## rule.json Schema

\`\`\`json
{
  "version": 1,
  "rules": ["project-rules", "owner/repo#main/team-rules"],
  "overrides": {
    "project-rules/block-docker-system-prune": {
      "reason": "Use targeted Docker cleanup commands."
    },
    "team-rules/block-npm-global": "off"
  }
}
\`\`\`

- \`version\`: Required. Must be \`1\`.
- \`rules\`: Optional array of rulebook source strings. Missing \`rules\` is treated as \`[]\`.
- \`overrides\`: Optional object keyed by \`<rulebook-name>/<rule-name>\`.
- Override values are either \`"off"\` to disable a rule or \`{ "reason": "..." }\` to replace the rule reason.

## Rulebook Sources

- Local sources are bare rulebook names such as \`project-rules\`; the rulebook file is \`.cc-safetynet-rules/project-rules/rulebook.json\`.
- GitHub sources use \`owner/repo#ref/<rulebook-name>\`.
- GitHub refs must be one path segment, such as a tag, SHA, or branch name without \`/\`.
- Rulebook source names must be unique in a config.

## rulebook.json Schema

\`\`\`json
{
  "rulebook_version": 1,
  "name": "project-rules",
  "version": "1.0.0",
  "description": "Project-specific CC Safety Net rules.",
  "author": "project",
  "allowed_commands": ["docker"],
  "rules": [
    {
      "name": "block-docker-system-prune",
      "command": "docker",
      "subcommand": "system",
      "block_args": ["prune"],
      "reason": "Use targeted cleanup instead."
    }
  ],
  "tests": [
    {
      "command": "docker system prune",
      "expect": "blocked",
      "rule": "block-docker-system-prune"
    },
    {
      "command": "docker ps",
      "expect": "allowed"
    }
  ]
}
\`\`\`

### Rulebook Fields

| Field | Required | Constraints |
|-------|----------|-------------|
| \`rulebook_version\` | Yes | Must be \`1\` |
| \`name\` | Yes | \`^[a-zA-Z][a-zA-Z0-9_-]{0,63}$\` |
| \`version\` | Yes | Non-empty string |
| \`description\` | No | String |
| \`author\` | No | String |
| \`allowed_commands\` | Yes | Unique command names matching \`^[a-zA-Z][a-zA-Z0-9_-]*$\` |
| \`rules\` | Yes | Array of rule objects |
| \`tests\` | Yes | Array of fixtures |

### Rule Fields

| Field | Required | Constraints |
|-------|----------|-------------|
| \`name\` | Yes | Unique within the rulebook; same pattern as rulebook \`name\` |
| \`command\` | Yes | Must be listed in \`allowed_commands\`; basename only, not path |
| \`subcommand\` | No | Same pattern as \`command\`; omit to match any subcommand |
| \`block_args\` | Yes | Non-empty array of non-empty strings |
| \`reason\` | Yes | Non-empty string, max 256 chars |

### Test Fixture Fields

| Field | Required | Constraints |
|-------|----------|-------------|
| \`command\` | Yes | Non-empty shell command string |
| \`expect\` | Yes | \`"blocked"\` or \`"allowed"\` |
| \`rule\` | Required for blocked fixtures | Rule name expected to block the command |

Every rule must have at least one blocked fixture. Add allowed fixtures for close-but-safe commands.

## Matching Behavior

- **Command**: Normalized to basename (\`/usr/bin/git\` → \`git\`).
- **Subcommand**: First non-option argument after command.
- **Arguments**: Matched literally. Command blocked if **any** \`block_args\` item is present.
- **Short options**: Expanded (\`-Ap\` matches \`-A\`).
- **Long options**: Exact match (\`--all-files\` does not match \`--all\`).
- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.

## Workflow

1. Run \`cc-safety-net rule init\` or create \`rule.json\` and \`rulebook.json\` manually.
2. Run \`cc-safety-net rule sync\` after adding or changing rulebook sources.
3. Run \`cc-safety-net rule verify\` to validate config, lock/cache state, local rulebooks, and GitHub source rulebooks.
4. Run \`cc-safety-net rule test\` to execute rulebook fixtures.
5. Run \`cc-safety-net rule list\` to inspect active rulebooks.

Invalid rule config, corrupt cache, invalid local rulebooks, or remote rulebook repair failures fail closed until repaired with \`cc-safety-net rule sync\`.
`;

// src/bin/rule/format.ts
function printSyncResult(result) {
  if (!result.ok) {
    printResultErrors(result);
    return;
  }
  for (const entry of result.entries) {
    const ruleCount = entry.ruleCount === undefined ? "" : ` (${entry.ruleCount} rules)`;
    console.log(`${entry.name} ${entry.version} ${entry.digest} ${entry.spec}${ruleCount}`);
  }
}
function printRuleChangeResult(result, action) {
  if (!result.ok) {
    printResultErrors(result);
    return;
  }
  console.log(action);
  console.log("Rule config synced.");
  console.log("");
  printActiveRulebookSummary(result.entries);
}
function printActiveRulebookSummary(entries) {
  if (entries.length === 0) {
    console.log("Active rulebooks: (none)");
    return;
  }
  console.log(`Active rulebooks (${entries.length}):`);
  for (const entry of entries) {
    console.log(`  - ${entry.name} ${entry.version} (${formatRuleCount(entry.ruleCount ?? 0)})`);
    console.log(`    Source: ${formatRulebookSource(entry, new Map)}`);
  }
}
function formatRuleCount(count) {
  return `${count} ${count === 1 ? "rule" : "rules"}`;
}
function formatRulebookSource(entry, sourceDisplayMap) {
  return sourceDisplayMap.get(entry.spec) ?? getRulebookDisplaySource(entry);
}
function printRulesTestResult(result, sourceDisplayMap = new Map) {
  if (!result.ok) {
    printResultErrors(result);
    return;
  }
  console.log("Rulebook tests passed.");
  console.log("");
  for (const entry of result.entries) {
    console.log(`  ${entry.name} ${entry.version}`);
    console.log(`    Source: ${formatRulebookSource(entry, sourceDisplayMap)}`);
    console.log(`    Rules: ${entry.ruleCount ?? 0}`);
    console.log(`    Tests: ${entry.testCount ?? 0}`);
  }
  if (result.entries.length < 2)
    return;
  console.log("");
  console.log(`Tested ${result.entries.length} rulebooks, ${sumStats(result.entries, "ruleCount")} rules, ${sumStats(result.entries, "testCount")} tests.`);
}
function sumStats(entries, key) {
  return entries.reduce((total, entry) => total + (entry[key] ?? 0), 0);
}
function printResultErrors(result) {
  for (const error of result.errors)
    console.error(error);
}

// src/bin/rule/verify.ts
import { existsSync as existsSync16, readdirSync as readdirSync3, readFileSync as readFileSync13, statSync as statSync2, writeFileSync as writeFileSync4 } from "node:fs";
import { dirname as dirname9, join as join11, resolve as resolve8 } from "node:path";
var VERIFY_HEADER = "CC Safety Net Config";
var VERIFY_SEPARATOR = "═".repeat(VERIFY_HEADER.length);
var RULES_SCHEMA_URL = "https://raw.githubusercontent.com/kenryu42/claude-code-safety-net/main/assets/cc-safety-net.schema.json";
var RULES_DIR_RESERVED_ENTRIES = new Set(["rule.json", "rule.lock", "cache"]);
function runRulesVerify(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const userConfig = options.userConfigPath ?? getUserRulesConfigPath();
  const projectConfig = options.projectConfigPath ?? getProjectRulesConfigPath(cwd);
  const legacyUserConfig = options.legacyUserConfigPath ?? getLegacyUserRulesConfigPath();
  const legacyProjectConfig = options.legacyProjectConfigPath ?? getLegacyProjectConfigPath(cwd);
  const githubSourceRulesDir = resolve8(cwd, RULES_DIR);
  const userConfigDir = dirname9(userConfig);
  let hasErrors = false;
  let hasWarnings = false;
  const configsChecked = [];
  const warnings = [];
  const githubSourceRules = getGitHubSourceRulesValidation(githubSourceRulesDir);
  printRulesVerifyHeader();
  if (existsSync16(userConfig)) {
    const result = validateRulesConfigFile(userConfig);
    result.errors.push(...getRulesConfigRuntimeErrorsForConfig(userConfig, getUserRulesLockPath({ userConfigDir }), {
      userConfigDir
    }));
    configsChecked.push({
      scope: "User",
      path: userConfig,
      result,
      schema: "rules",
      sourceDisplayMap: getRulesConfigSourceDisplayMap(userConfig)
    });
    if (result.errors.length > 0)
      hasErrors = true;
  }
  if (existsSync16(legacyUserConfig)) {
    hasWarnings = true;
    if (existsSync16(userConfig)) {
      warnings.push(getLegacyRulesConfigWarning("user", "cleanup"));
    } else {
      const result = validateConfigFile(legacyUserConfig);
      hasErrors = true;
      configsChecked.push({
        scope: "User",
        path: legacyUserConfig,
        result,
        schema: "legacy",
        sourceDisplayMap: new Map,
        inactive: true
      });
      warnings.push(getLegacyRulesConfigWarning("user", result.errors.length > 0 ? "fix-or-delete" : "migrate"));
    }
  }
  if (existsSync16(projectConfig)) {
    const result = validateRulesConfigFile(projectConfig);
    result.errors.push(...getRulesConfigRuntimeErrorsForConfig(projectConfig, getRulesLockPathForConfigPath(projectConfig), {
      userConfigDir
    }));
    configsChecked.push({
      scope: "Project",
      path: resolve8(projectConfig),
      result,
      schema: "rules",
      sourceDisplayMap: getRulesConfigSourceDisplayMap(projectConfig)
    });
    if (result.errors.length > 0)
      hasErrors = true;
    if (existsSync16(legacyProjectConfig)) {
      hasWarnings = true;
      warnings.push(getLegacyRulesConfigWarning("project", "cleanup"));
    }
  } else if (existsSync16(legacyProjectConfig)) {
    hasWarnings = true;
    hasErrors = true;
    const result = validateConfigFile(legacyProjectConfig);
    configsChecked.push({
      scope: "Project",
      path: resolve8(legacyProjectConfig),
      result,
      schema: "legacy",
      sourceDisplayMap: new Map,
      inactive: true
    });
    warnings.push(getLegacyRulesConfigWarning("project", result.errors.length > 0 ? "fix-or-delete" : "migrate"));
  }
  if (githubSourceRules?.result.errors.length)
    hasErrors = true;
  if (configsChecked.length === 0 && !githubSourceRules) {
    console.log(`
No config files found. Using built-in rules only.`);
    return 0;
  }
  for (const config of configsChecked) {
    if (config.inactive) {
      printInactiveLegacyRulesConfig(config.scope, config.path, config.result, config.sourceDisplayMap);
    } else if (config.result.errors.length > 0) {
      printInvalidRulesConfig(config.scope, config.path, config.result.errors);
    } else {
      if (config.schema === "rules" && addRulesSchemaIfMissing(config.path)) {
        console.log(`
Added $schema to ${config.scope.toLowerCase()} config.`);
      }
      printValidRulesConfig(config.scope, config.path, config.result, config.schema, config.sourceDisplayMap);
    }
  }
  for (const warning of warnings)
    console.error(`
${colors.red(warning)}`);
  if (githubSourceRules) {
    if (githubSourceRules.result.errors.length > 0) {
      printInvalidGitHubSourceRules(githubSourceRules.path, githubSourceRules.result.errors);
    } else {
      printValidGitHubSourceRules(githubSourceRules.path, githubSourceRules.result);
    }
  }
  if (hasErrors) {
    console.error(`
Config validation failed.`);
    return 1;
  }
  console.log(hasWarnings ? `
Configs valid with warnings.` : `
All configs valid.`);
  return 0;
}
function getLegacyRulesConfigWarning(scope, action) {
  const label = `legacy ${scope} config`;
  if (action === "cleanup") {
    return `Warning: Legacy ${scope} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;
  }
  if (action === "migrate") {
    return `Warning: Legacy ${scope} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;
  }
  return `Warning: Legacy ${scope} config is no longer supported. Fix or delete the ${label}, then run \`npx -y cc-safety-net rule migrate\`.`;
}
function getGitHubSourceRulesValidation(path) {
  if (!existsSync16(path))
    return null;
  const result = validateGitHubSourceRules(path);
  if (result.ruleNames.size === 0 && result.errors.length === 0)
    return null;
  return { path, result };
}
function validateGitHubSourceRules(path) {
  const errors = [];
  const ruleNames = new Set;
  try {
    if (!statSync2(path).isDirectory()) {
      return { errors: [`${RULES_DIR} must be a directory`], ruleNames };
    }
  } catch (error) {
    return {
      errors: [
        error instanceof Error ? `Failed to inspect ${RULES_DIR}: ${error.message}` : `Failed to inspect ${RULES_DIR}: ${String(error)}`
      ],
      ruleNames
    };
  }
  const entries = readdirSync3(path, { withFileTypes: true }).filter((entry) => !RULES_DIR_RESERVED_ENTRIES.has(entry.name)).sort((a, b) => a.name.localeCompare(b.name));
  if (entries.length === 0) {
    return { errors, ruleNames };
  }
  for (const entry of entries) {
    if (!NAME_PATTERN.test(entry.name)) {
      errors.push(`rulebook directory names must match ${NAME_PATTERN}: ${entry.name}`);
      continue;
    }
    if (!entry.isDirectory()) {
      errors.push(`${entry.name} must be a rulebook directory`);
      continue;
    }
    const rulebookPath = join11(path, entry.name, "rulebook.json");
    if (!existsSync16(rulebookPath)) {
      errors.push(`${entry.name}/rulebook.json is required`);
      continue;
    }
    try {
      const rulebook = assertValidRulebook(JSON.parse(readFileSync13(rulebookPath, "utf-8")));
      if (rulebook.name !== entry.name) {
        errors.push(`rulebook name "${rulebook.name}" must match folder "${entry.name}"`);
        continue;
      }
      ruleNames.add(entry.name);
    } catch (error) {
      errors.push(error instanceof Error ? `${entry.name}/rulebook.json: ${error.message}` : `${entry.name}/rulebook.json: ${String(error)}`);
    }
  }
  return { errors, ruleNames };
}
function printRulesVerifyHeader() {
  console.log(VERIFY_HEADER);
  console.log(VERIFY_SEPARATOR);
}
function printValidRulesConfig(scope, path, result, schema, sourceDisplayMap) {
  console.log(`
✓ ${scope} config: ${path}`);
  console.log(`  Schema: ${schema === "rules" ? "rulebook sources" : "legacy inline rules"}`);
  if (result.ruleNames.size > 0) {
    console.log(`  ${schema === "rules" ? "Sources" : "Rules"}:`);
    let i = 1;
    for (const name of result.ruleNames) {
      console.log(`    ${i}. ${sourceDisplayMap.get(name) ?? name}`);
      i++;
    }
  } else {
    console.log(`  ${schema === "rules" ? "Sources" : "Rules"}: (none)`);
  }
}
function printInactiveLegacyRulesConfig(scope, path, result, sourceDisplayMap) {
  console.error(`
✗ Legacy ${scope.toLowerCase()} config: ${path}`);
  console.error("  Schema: legacy inline rules");
  console.error("  Status: ignored by CC Safety Net");
  if (result.errors.length > 0) {
    console.error("  Errors:");
    let errorNum = 1;
    for (const error of result.errors) {
      for (const part of error.split("; ")) {
        console.error(`    ${errorNum}. ${part}`);
        errorNum++;
      }
    }
    return;
  }
  if (result.ruleNames.size > 0) {
    console.error("  Rules:");
    let i = 1;
    for (const name of result.ruleNames) {
      console.error(`    ${i}. ${sourceDisplayMap.get(name) ?? name}`);
      i++;
    }
    return;
  }
  console.error("  Rules: (none)");
}
function printInvalidRulesConfig(scope, path, errors) {
  printInvalidVerifyTarget(`${scope} config`, path, errors);
}
function printValidGitHubSourceRules(path, result) {
  console.log(`
✓ GitHub source rules: ${path}`);
  console.log("  Rulebooks:");
  let i = 1;
  for (const name of result.ruleNames) {
    console.log(`    ${i}. ${name}`);
    i++;
  }
}
function printInvalidGitHubSourceRules(path, errors) {
  printInvalidVerifyTarget("GitHub source rules", path, errors);
}
function printInvalidVerifyTarget(label, path, errors) {
  console.error(`
✗ ${label}: ${path}`);
  console.error("  Errors:");
  let errorNum = 1;
  for (const error of errors) {
    for (const part of error.split("; ")) {
      console.error(`    ${errorNum}. ${part}`);
      errorNum++;
    }
  }
}
function addRulesSchemaIfMissing(path) {
  try {
    const content = readFileSync13(path, "utf-8");
    const parsed = JSON.parse(content);
    if (parsed.$schema)
      return false;
    writeFileSync4(path, JSON.stringify({ $schema: RULES_SCHEMA_URL, ...parsed }, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

// src/bin/rule/index.ts
var RULE_SUBCOMMANDS = new Set([
  "init",
  "add",
  "remove",
  "update",
  "sync",
  "list",
  "test",
  "doc",
  "verify"
]);
async function runRuleCommand(args) {
  const flags = parseRuleFlags(args);
  if (flags.errors.length > 0) {
    for (const error of flags.errors)
      console.error(error);
    return 1;
  }
  const subcommand = flags.positionals[0];
  if (!subcommand || flags.help) {
    return 0;
  }
  const value = flags.positionals[1];
  const options = { global: flags.global, check: flags.check };
  if (subcommand === "init") {
    const dir = flags.global ? getUserRulesDir() : getProjectRulesDir();
    const configPath = flags.global ? getUserRulesConfigPath() : getProjectRulesConfigPath();
    const rulebookName = flags.global ? "user-rules" : "project-rules";
    if (!existsSync17(configPath))
      writeDefaultRulesConfig(configPath, [rulebookName]);
    const rulebookPath = join12(dir, rulebookName, "rulebook.json");
    if (!existsSync17(rulebookPath))
      writeStarterRulebook(rulebookPath, rulebookName);
    const result = await syncRulesConfig(options);
    printRuleChangeResult(result, "Rule config initialized.");
    return result.ok ? 0 : 1;
  }
  if (subcommand === "add") {
    if (!value) {
      console.error("rule add requires a source");
      return 1;
    }
    const result = await addRulebookSource(value, options);
    printRuleChangeResult(result, `Added rulebook source: ${value}`);
    return result.ok ? 0 : 1;
  }
  if (subcommand === "remove") {
    if (!value) {
      console.error("rule remove requires a source");
      return 1;
    }
    const result = await removeRulebookSource(value, options);
    printRuleChangeResult(result, `Removed rulebook source: ${value}`);
    return result.ok ? 0 : 1;
  }
  if (subcommand === "update" || subcommand === "sync") {
    const result = await syncRulesConfig({
      ...options,
      only: subcommand === "update" ? value : undefined
    });
    printRuleChangeResult(result, flags.check ? "Rule config checked." : "Rule config synced.");
    return result.ok ? 0 : 1;
  }
  if (subcommand === "list") {
    const policy = loadRulesPolicy();
    if (policy.errors.length > 0) {
      for (const error of policy.errors)
        console.error(error);
      return 1;
    }
    printSyncResult({ ok: true, errors: [], entries: [] });
    return 0;
  }
  if (subcommand === "test") {
    const sources = value ? [value] : [];
    const result = await testRulebookSources(sources, options);
    printRulesTestResult(result);
    return result.ok ? 0 : 1;
  }
  if (subcommand === "doc") {
    console.log(RULE_DOC);
    return 0;
  }
  if (subcommand === "verify") {
    return runRulesVerify();
  }
  return 1;
}
function parseRuleFlags(args) {
  const flags = {
    global: false,
    check: false,
    help: false,
    positionals: [],
    errors: []
  };
  for (const arg of args) {
    if (arg === "-g" || arg === "--global") {
      flags.global = true;
    } else if (arg === "--check") {
      flags.check = true;
    } else if (arg === "-h" || arg === "--help") {
      flags.help = true;
    } else if (arg.startsWith("-")) {
      flags.errors.push(`Unknown rule option: ${arg}`);
    } else {
      flags.positionals.push(arg);
    }
  }
  const [subcommand] = flags.positionals;
  if (subcommand && !RULE_SUBCOMMANDS.has(subcommand)) {
    flags.errors.push(`Unknown rule subcommand: ${subcommand}`);
  }
  if (flags.positionals.length > 2) {
    flags.errors.push(`Unexpected rule argument: ${flags.positionals[2]}`);
  }
  return flags;
}

// src/bin/statusline.ts
import { existsSync as existsSync18, readFileSync as readFileSync14 } from "node:fs";
import { homedir as homedir8 } from "node:os";
import { join as join13 } from "node:path";
async function readStdinAsync() {
  if (process.stdin.isTTY) {
    return null;
  }
  return new Promise((resolve9) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      const trimmed = data.trim();
      resolve9(trimmed || null);
    });
    process.stdin.on("error", () => {
      resolve9(null);
    });
  });
}
function getSettingsPath() {
  if (process.env.CLAUDE_SETTINGS_PATH) {
    return process.env.CLAUDE_SETTINGS_PATH;
  }
  return join13(homedir8(), ".claude", "settings.json");
}
function isPluginEnabled() {
  const settingsPath = getSettingsPath();
  if (!existsSync18(settingsPath)) {
    return false;
  }
  try {
    const content = readFileSync14(settingsPath, "utf-8");
    const settings = JSON.parse(content);
    if (!settings.enabledPlugins) {
      return false;
    }
    const pluginKey = "safety-net@cc-marketplace";
    if (!(pluginKey in settings.enabledPlugins)) {
      return false;
    }
    return settings.enabledPlugins[pluginKey] === true;
  } catch {
    return false;
  }
}
async function printStatusline() {
  const enabled = isPluginEnabled();
  let status;
  if (!enabled) {
    status = "\uD83D\uDEE1️ Safety Net ❌";
  } else {
    const strict = envTruthy("SAFETY_NET_STRICT");
    const paranoidAll = envTruthy("SAFETY_NET_PARANOID");
    const paranoidRm = paranoidAll || envTruthy("SAFETY_NET_PARANOID_RM");
    const paranoidInterpreters = paranoidAll || envTruthy("SAFETY_NET_PARANOID_INTERPRETERS");
    const worktreeMode = envTruthy("SAFETY_NET_WORKTREE");
    let modeEmojis = "";
    if (strict) {
      modeEmojis += "\uD83D\uDD12";
    }
    if (paranoidAll || paranoidRm && paranoidInterpreters) {
      modeEmojis += "\uD83D\uDC41️";
    } else if (paranoidRm) {
      modeEmojis += "\uD83D\uDDD1️";
    } else if (paranoidInterpreters) {
      modeEmojis += "\uD83D\uDC1A";
    }
    if (worktreeMode) {
      modeEmojis += "\uD83C\uDF33";
    }
    const statusEmoji = modeEmojis || "✅";
    status = `\uD83D\uDEE1️ Safety Net ${statusEmoji}`;
  }
  const stdinInput = await readStdinAsync();
  if (stdinInput && !stdinInput.startsWith("{")) {
    console.log(`${stdinInput} | ${status}`);
  } else {
    console.log(status);
  }
}

// src/bin/verify-config.ts
import { existsSync as existsSync19, readFileSync as readFileSync15, writeFileSync as writeFileSync5 } from "node:fs";
import { resolve as resolve9 } from "node:path";
var HEADER = "Safety Net Config";
var SEPARATOR = "═".repeat(HEADER.length);
var SCHEMA_URL = "https://raw.githubusercontent.com/kenryu42/claude-code-safety-net/main/assets/cc-safety-net.schema.json";
function printHeader() {
  console.log(HEADER);
  console.log(SEPARATOR);
}
function printValidConfig(scope, path, result) {
  console.log(`
✓ ${scope} config: ${path}`);
  if (result.ruleNames.size > 0) {
    console.log("  Rules:");
    let i = 1;
    for (const name of result.ruleNames) {
      console.log(`    ${i}. ${name}`);
      i++;
    }
  } else {
    console.log("  Rules: (none)");
  }
}
function printInvalidConfig(scope, path, errors) {
  console.error(`
✗ ${scope} config: ${path}`);
  console.error("  Errors:");
  const parts = errors.flatMap((error) => error.split("; "));
  for (const [index, part] of parts.entries()) {
    console.error(`    ${index + 1}. ${part}`);
  }
}
function addSchemaIfMissing(path) {
  try {
    const content = readFileSync15(path, "utf-8");
    const parsed = JSON.parse(content);
    if (parsed.$schema) {
      return false;
    }
    const updated = { $schema: SCHEMA_URL, ...parsed };
    writeFileSync5(path, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}
function verifyConfig(options = {}) {
  const userConfig = options.userConfigPath ?? getUserConfigPath();
  const projectConfig = options.projectConfigPath ?? getProjectConfigPath();
  let hasErrors = false;
  const configsChecked = [];
  printHeader();
  if (existsSync19(userConfig)) {
    const result = validateConfigFile(userConfig);
    configsChecked.push({ scope: "User", path: userConfig, result });
    if (result.errors.length > 0) {
      hasErrors = true;
    }
  }
  if (existsSync19(projectConfig)) {
    const result = validateConfigFile(projectConfig);
    configsChecked.push({
      scope: "Project",
      path: resolve9(projectConfig),
      result
    });
    if (result.errors.length > 0) {
      hasErrors = true;
    }
  }
  if (configsChecked.length === 0) {
    console.log(`
No config files found. Using built-in rules only.`);
    return 0;
  }
  for (const { scope, path, result } of configsChecked) {
    if (result.errors.length > 0) {
      printInvalidConfig(scope, path, result.errors);
    } else {
      if (addSchemaIfMissing(path)) {
        console.log(`
Added $schema to ${scope.toLowerCase()} config.`);
      }
      printValidConfig(scope, path, result);
    }
  }
  if (hasErrors) {
    console.error(`
Config validation failed.`);
    return 1;
  }
  console.log(`
All configs valid.`);
  return 0;
}

// src/bin/cc-safety-net.ts
function hasHelpFlag(args) {
  return args.includes("--help") || args.includes("-h");
}
function handleHelpCommand(args) {
  if (args[0] !== "help") {
    return false;
  }
  const commandName = args[1];
  if (!commandName) {
    printHelp();
    process.exit(0);
  }
  if (showCommandHelp(commandName)) {
    process.exit(0);
  }
  console.error(`Unknown command: ${commandName}`);
  console.error("Run 'cc-safety-net --help' for available commands.");
  process.exit(1);
}
function handleCommandHelp(args) {
  if (!hasHelpFlag(args)) {
    return false;
  }
  const commandName = args[0];
  if (!commandName || commandName.startsWith("-")) {
    return false;
  }
  const command = findCommand(commandName);
  if (command) {
    showCommandHelp(commandName);
    process.exit(0);
  }
  return false;
}
function handleCliFlags() {
  const args = process.argv.slice(2);
  if (handleHelpCommand(args)) {
    return null;
  }
  if (handleCommandHelp(args)) {
    return null;
  }
  if (args[0] === "explain") {
    return "explain";
  }
  if (args[0] === "rule") {
    return "rule";
  }
  if (args[0] === "statusline") {
    if (args.includes("--claude-code") || args.includes("-cc"))
      return "statusline";
    showCommandHelp("statusline");
    process.exit(1);
  }
  if (args[0] === "hook") {
    if (args[1] === "install")
      return "hook-install";
    if (args[1] === "uninstall")
      return "hook-uninstall";
    if (args.includes("--claude-code") || args.includes("-cc"))
      return "claude-code";
    if (args.includes("--copilot-cli") || args.includes("-cp"))
      return "copilot-cli";
    if (args.includes("--gemini-cli") || args.includes("-gc"))
      return "gemini-cli";
    if (args.includes("--kimi-cli"))
      return "kimi-cli";
    if (args.includes("-kc"))
      return "kimi-cli";
    showCommandHelp("hook");
    process.exit(1);
  }
  if (args.length === 0 || hasHelpFlag(args)) {
    printHelp();
    process.exit(0);
  }
  if (args.includes("--version") || args.includes("-V")) {
    printVersion();
    process.exit(0);
  }
  if (args.includes("--verify-config") || args.includes("-vc")) {
    process.exit(verifyConfig());
  }
  if (args.includes("doctor") || args.includes("--doctor")) {
    return "doctor";
  }
  if (args[0] === "--claude-code" || args[0] === "-cc") {
    return "claude-code";
  }
  if (args[0] === "--copilot-cli" || args[0] === "-cp") {
    return "copilot-cli";
  }
  if (args[0] === "--gemini-cli" || args[0] === "-gc") {
    return "gemini-cli";
  }
  if (args[0] === "--kimi-cli" || args[0] === "-kc") {
    return "kimi-cli";
  }
  console.error(`Unknown option: ${args[0]}`);
  console.error("Run 'cc-safety-net --help' for usage.");
  process.exit(1);
}
async function main() {
  const mode = handleCliFlags();
  if (mode === "claude-code") {
    await runClaudeCodeHook();
  } else if (mode === "copilot-cli") {
    await runCopilotCliHook();
  } else if (mode === "gemini-cli") {
    await runGeminiCLIHook();
  } else if (mode === "kimi-cli") {
    await runKimiCliHook();
  } else if (mode === "hook-install") {
    process.exit(runHookInstallCommand("install", process.argv.slice(4)));
  } else if (mode === "hook-uninstall") {
    process.exit(runHookInstallCommand("uninstall", process.argv.slice(4)));
  } else if (mode === "rule") {
    process.exit(await runRuleCommand(process.argv.slice(3)));
  } else if (mode === "statusline") {
    await printStatusline();
  } else if (mode === "doctor") {
    const flags = parseDoctorFlags(process.argv.slice(2));
    const exitCode = await runDoctor({
      json: flags.json,
      skipUpdateCheck: flags.skipUpdateCheck
    });
    process.exit(exitCode);
  } else if (mode === "explain") {
    const args = process.argv.slice(3);
    if (hasHelpFlag(args) || args.length === 0) {
      showCommandHelp("explain");
      process.exit(0);
    }
    const flags = parseExplainFlags(args);
    if (!flags) {
      process.exit(1);
    }
    const result = explainCommand2(flags.command, { cwd: flags.cwd });
    const asciiOnly = !!process.env.NO_COLOR || !process.stdout.isTTY;
    if (flags.json) {
      console.log(formatTraceJson(result));
    } else {
      console.log(formatTraceHuman(result, { asciiOnly }));
    }
    process.exit(0);
  }
}
main().catch((error) => {
  console.error("Safety Net error:", error);
  process.exit(1);
});
