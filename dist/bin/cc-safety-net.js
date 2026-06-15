#!/usr/bin/env node
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/shell-quote/quote.js
var require_quote = __commonJS((exports, module) => {
  var OPS = [
    "||",
    "&&",
    ";;",
    "|&",
    "<(",
    "<<<",
    ">>",
    ">&",
    "<&",
    "&",
    ";",
    "(",
    ")",
    "|",
    "<",
    ">"
  ];
  var LINE_TERMINATORS = /[\n\r\u2028\u2029]/;
  var GLOB_SHELL_SPECIAL = /[\s#!"$&'():;<=>@\\^`|]/g;
  module.exports = function quote(xs) {
    return xs.map(function(s) {
      if (s === "") {
        return "''";
      }
      if (s && typeof s === "object") {
        if (s.op === "glob") {
          if (typeof s.pattern !== "string") {
            throw new TypeError("glob token requires a string `pattern`");
          }
          if (LINE_TERMINATORS.test(s.pattern)) {
            throw new TypeError("glob `pattern` must not contain line terminators");
          }
          return s.pattern.replace(GLOB_SHELL_SPECIAL, "\\$&");
        }
        if (typeof s.op === "string") {
          if (OPS.indexOf(s.op) < 0) {
            throw new TypeError("invalid `op` value: " + JSON.stringify(s.op));
          }
          return s.op.replace(/[\s\S]/g, "\\$&");
        }
        if (typeof s.comment === "string") {
          if (LINE_TERMINATORS.test(s.comment)) {
            throw new TypeError("`comment` must not contain line terminators");
          }
          return "#" + s.comment;
        }
        throw new TypeError("unrecognized object token shape");
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

// src/core/analyze/dangerous-text.ts
function dangerousInText(text) {
  const t = text.toLowerCase();
  const stripped = t.trimStart();
  const isEchoOrRg = stripped.startsWith("echo ") || stripped.startsWith("rg ");
  const patterns = [
    {
      regex: /(^|[^\w])\\?r\\?m\s+(-[^\s]*r[^\s]*\s+-[^\s]*f|-[^\s]*f[^\s]*\s+-[^\s]*r|-[^\s]*rf|-[^\s]*fr|(?=[^\n;&|]*--recursive\b)(?=[^\n;&|]*--force\b)[^\n;&|]*)\b/,
      reason: "rm -rf"
    },
    {
      regex: /\bgit\s+reset\s+--ha(?:r(?:d)?)?\b/,
      reason: "git reset --hard"
    },
    {
      regex: /\bgit\s+reset\s+--me(?:r(?:g(?:e)?)?)?\b/,
      reason: "git reset --merge"
    },
    {
      regex: /\bgit\s+clean\s+(-[^\s]*f[^\s]*|--fo(?:r(?:c(?:e)?)?)?)\b/,
      reason: "git clean -f"
    },
    {
      regex: /\bgit\s+checkout\s+[^|;]*(--fo(?:r(?:c(?:e)?)?)?\b|-(?![bBU])[^\s]*f[^\s]*\b)/,
      reason: "git checkout --force"
    },
    {
      regex: /\bgit\s+push\s+[^|;]*(-f\b|--fo(?:r(?:c(?:e)?)?)?\b)(?!-with-lease)/,
      reason: "git push --force (use --force-with-lease instead)"
    },
    {
      regex: /\bgit\s+branch\b(?=[^\n;|&]*(?:-D\b|-[A-Za-z]*D[A-Za-z]*\b|--de(?:l(?:e(?:t(?:e)?)?)?)?\b|-[A-Za-z]*d[A-Za-z]*\b))(?=[^\n;|&]*(?:-D\b|-[A-Za-z]*D[A-Za-z]*\b|--fo(?:r(?:c(?:e)?)?)?\b|-[A-Za-z]*f[A-Za-z]*\b))/,
      reason: "git branch -D",
      caseSensitive: true
    },
    {
      regex: /\bgit\s+tag\s+[^|;]*(-[^\s]*d[^\s]*|--de(?:l(?:e(?:t(?:e)?)?)?)?)\b/,
      reason: "git tag -d"
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

// src/core/analyze/segment.ts
import { realpathSync as realpathSync6 } from "node:fs";
import { normalize as normalize3 } from "node:path";

// src/core/analyze/awk.ts
var AWK_INTERPRETERS = new Set(["awk", "gawk", "nawk", "mawk"]);
var REASON_AWK_SYSTEM_DYNAMIC = "Detected awk system() call with dynamic command that cannot be safely analyzed.";
function analyzeAwkSystemCalls(tokens, analyzeNested) {
  for (const token of tokens.slice(1)) {
    if (!token.includes("system"))
      continue;
    const commands = extractAwkSystemCommands(token);
    if (!commands)
      continue;
    if (commands.dynamic)
      return REASON_AWK_SYSTEM_DYNAMIC;
    for (const command of commands.commands) {
      const reason = analyzeNested(command);
      if (reason)
        return reason;
    }
  }
  return null;
}
function extractAwkSystemCommands(code) {
  const commands = [];
  let sawSystem = false;
  let searchIndex = 0;
  while (searchIndex < code.length) {
    const systemIndex = code.indexOf("system", searchIndex);
    if (systemIndex === -1)
      break;
    searchIndex = systemIndex + "system".length;
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
      continue;
    }
    const parsed = readAwkStringLiteral(code, i, quote);
    if (!parsed) {
      sawSystem = true;
      continue;
    }
    i = skipAwkWhitespace(code, parsed.endIndex);
    sawSystem = true;
    if (code[i] !== ")") {
      return { dynamic: true, commands };
    }
    commands.push(parsed.value);
    searchIndex = i + 1;
  }
  if (!sawSystem)
    return null;
  return commands.length > 0 ? { dynamic: false, commands } : { dynamic: true, commands };
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
  "sleep",
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

// src/core/shell/command.ts
function normalizeCommandToken(token) {
  return getBasename(token).toLowerCase();
}
function getBasename(token) {
  return token.split(/[\\/]/).pop()?.replace(/\.exe$/i, "") ?? token;
}
// src/core/shell/options.ts
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
// node_modules/shell-quote/index.js
var $quote = require_quote();
var $parse = require_parse();

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
var RM_RECURSIVE_FORCE_PATTERN = /\brm[^\S\n]+(?=(?:(?!--(?=[^\S\n]|[;&|]|$))[^\s;&|]+[^\S\n]+)*(?:-(?!-)[^\s;&|]*[rR][^\s;&|]*|--recursive)(?=[^\S\n]|[;&|]|$))(?=(?:(?!--(?=[^\S\n]|[;&|]|$))[^\s;&|]+[^\S\n]+)*(?:-(?!-)[^\s;&|]*[fF][^\s;&|]*|--force)(?=[^\S\n]|[;&|]|$))[^\n;&|]*/;
var DANGEROUS_PATTERNS = [
  RM_RECURSIVE_FORCE_PATTERN,
  /\bgit\s+reset\s+--hard\b/,
  /\bgit\s+checkout\s+--\b/,
  /\bgit\s+clean\s+-f\b/,
  /\bgit\s+stash\s+(drop|clear)\b/,
  /\bdd\b[^\n;&|]*\bof=\/dev\/[^\s'"]+/,
  /\bmkfs(?:\.[A-Za-z0-9_-]+)?\s+\/dev\/[^\s'"]+/,
  /\bshred\b\s+/,
  /\bfind\b.*\s-delete\b/
];
var PARANOID_INTERPRETERS_SUFFIX = `

(Paranoid mode: interpreter one-liners are blocked.)`;

// src/core/shell/shared.ts
var ENV_PROXY = new Proxy({}, {
  get: (_, name) => `$${String(name)}`
});
function hasUnclosedQuotes(command) {
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  for (let i = 0;i < command.length; i++) {
    const char = command[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "#" && !inSingle && !inDouble && startsShellComment(command, i)) {
      break;
    }
    if (char === "\\" && !inSingle) {
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
function startsShellComment(command, index) {
  return index === 0 || /\s/.test(command[index - 1] ?? "");
}
function getCommandTokenText(token) {
  if (typeof token === "string") {
    return token;
  }
  if (token && typeof token === "object" && "pattern" in token && typeof token.pattern === "string") {
    return token.pattern;
  }
  return null;
}

// src/core/shell/segments.ts
var ARITHMETIC_SENTINEL = "__CC_SAFETY_NET_ARITH_SENTINEL__";
var BACKTICK_ATTACHED_SUFFIX_SENTINEL = "__CC_SAFETY_NET_BACKTICK_SUFFIX__";
function splitShellCommands(command) {
  return splitShellCommandsWithInfo(command).map((segment) => segment.tokens);
}
function splitShellCommandsWithInfo(command) {
  if (hasUnclosedQuotes(command)) {
    return [{ tokens: [command], hasDynamicSubstitution: false }];
  }
  const normalizedCommand = _stripAttachedIoNumbers(_normalizeAnsiCQuotes(command).replace(/\n/g, " ; "));
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
      const substitution = getCommandSubstitution(tokens, i);
      if (current.length > 0) {
        currentHasDynamicSubstitution = true;
        if (!substitution.shouldKeepCurrent) {
          segments.push({
            tokens: current,
            hasDynamicSubstitution: currentHasDynamicSubstitution
          });
          current = [];
          currentHasDynamicSubstitution = false;
        }
      }
      for (const seg of substitution.innerSegments) {
        segments.push({ tokens: seg, hasDynamicSubstitution: false });
      }
      if (substitution.shouldKeepCurrent && substitution.attachedSuffix) {
        current.push(substitution.attachedSuffix);
      }
      i = substitution.endIndex + (substitution.attachedSuffix !== null ? 2 : 1);
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
    const tokenText = getCommandTokenText(token);
    if (tokenText === null) {
      if (token && typeof token === "object" && "op" in token && typeof token.op === "string") {
        _pushInlineSubstitutionSegmentInfos(segments, token.op);
      }
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
  const quoteState = { inSingle: false, inDouble: false, escaped: false };
  while (i < token.length) {
    const char = token[i];
    if (!char) {
      break;
    }
    if (advanceQuotedScanState(char, quoteState)) {
      i++;
      continue;
    }
    if (!quoteState.inSingle && char === "$" && token[i + 1] === "(" && token[i + 2] !== "(") {
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
function getCommandSubstitution(tokens, index) {
  const { innerSegments, endIndex } = extractCommandSubstitution(tokens, index + 2);
  const attachedSuffix = _getBacktickAttachedSuffix(tokens[endIndex + 1]);
  return {
    innerSegments,
    endIndex,
    attachedSuffix,
    shouldKeepCurrent: attachedSuffix !== null && !_isRedirectOp(tokens[index - 1]) && !isOperatorToken(tokens[index - 1])
  };
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
      const substitution = getCommandSubstitution(tokens, i);
      if (!substitution.shouldKeepCurrent && currentSegment.length > 0) {
        innerSegments.push(currentSegment);
        currentSegment = [];
      }
      for (const seg of substitution.innerSegments) {
        innerSegments.push(seg);
      }
      if (substitution.shouldKeepCurrent && substitution.attachedSuffix) {
        currentSegment.push(substitution.attachedSuffix);
      }
      i = substitution.endIndex + (substitution.attachedSuffix !== null ? 2 : 1);
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
    const tokenText = getCommandTokenText(token);
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
      const nested = extractArithmeticNestedCommand(innerSegments, expression, tokens, i + 2);
      expression = nested.expression;
      i = nested.endIndex + 1;
      continue;
    }
    if (_isAttachedCommandSubstitutionStart(tokens, i)) {
      const tokenText = tokens[i];
      if (typeof tokenText === "string") {
        expression += tokenText.slice(0, -1);
      }
      const nested = extractArithmeticNestedCommand(innerSegments, expression, tokens, i + 2);
      expression = nested.expression;
      i = nested.endIndex + 1;
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
function extractArithmeticNestedCommand(innerSegments, expression, tokens, startIndex) {
  if (expression) {
    innerSegments.push([expression]);
  }
  const { innerSegments: nestedSegments, endIndex } = extractCommandSubstitution(tokens, startIndex);
  for (const seg of nestedSegments) {
    innerSegments.push(seg);
  }
  return { expression: "", endIndex };
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
function _normalizeAnsiCQuotes(command) {
  let result = "";
  let inSingle = false;
  let inDouble = false;
  let escaped = false;
  for (let i = 0;i < command.length; ) {
    const char = command[i];
    if (!char)
      break;
    if (escaped) {
      result += char;
      escaped = false;
      i++;
      continue;
    }
    if (!inSingle && char === "\\") {
      result += char;
      escaped = true;
      i++;
      continue;
    }
    if (!inSingle && !inDouble && command.startsWith("$'", i)) {
      const parsed = _readAnsiCString(command, i + 2);
      if (!parsed) {
        result += char;
        i++;
        continue;
      }
      result += _singleQuoteShellToken(parsed.value);
      i = parsed.endIndex + 1;
      continue;
    }
    if (!inDouble && char === "'") {
      inSingle = !inSingle;
    } else if (!inSingle && char === '"') {
      inDouble = !inDouble;
    }
    result += char;
    i++;
  }
  return result;
}
function _readAnsiCString(command, startIndex) {
  let value = "";
  for (let i = startIndex;i < command.length; i++) {
    const char = command[i];
    if (!char)
      break;
    if (char === "'") {
      return { value, endIndex: i };
    }
    if (char !== "\\") {
      value += char;
      continue;
    }
    const decoded = _readAnsiEscape(command, i + 1);
    value += decoded.value;
    i = decoded.endIndex;
  }
  return null;
}
function _readAnsiEscape(command, index) {
  const char = command[index];
  if (!char)
    return { value: "\\", endIndex: index };
  const simpleEscapes = {
    a: "\x07",
    b: "\b",
    e: "\x1B",
    E: "\x1B",
    f: "\f",
    n: `
`,
    r: "\r",
    t: "\t",
    v: "\v",
    "\\": "\\",
    "'": "'",
    '"': '"'
  };
  if (Object.hasOwn(simpleEscapes, char)) {
    return { value: simpleEscapes[char] ?? char, endIndex: index };
  }
  if (char === "x") {
    return _readFixedBaseEscape(command, index + 1, 16, 2, index);
  }
  if (char === "u") {
    return _readFixedBaseEscape(command, index + 1, 16, 4, index);
  }
  if (char === "U") {
    return _readFixedBaseEscape(command, index + 1, 16, 8, index);
  }
  if (/[0-7]/.test(char)) {
    return _readFixedBaseEscape(command, index, 8, 3, index - 1);
  }
  return { value: char, endIndex: index };
}
function _readFixedBaseEscape(command, startIndex, base, maxLength, fallbackEndIndex) {
  let digits = "";
  let endIndex = startIndex - 1;
  const digitRegex = base === 16 ? /[0-9a-fA-F]/ : /[0-7]/;
  for (let i = startIndex;i < command.length && digits.length < maxLength; i++) {
    const char = command[i];
    if (!char || !digitRegex.test(char))
      break;
    digits += char;
    endIndex = i;
  }
  if (!digits) {
    return { value: command[fallbackEndIndex] ?? "", endIndex: fallbackEndIndex };
  }
  return { value: String.fromCodePoint(Number.parseInt(digits, base)), endIndex };
}
function _singleQuoteShellToken(value) {
  return `'${value.replace(/'/g, "'\\''")}'`;
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
  const quoteState = { inSingle: false, inDouble: false, escaped: false };
  for (let i = startIndex;i < token.length; i++) {
    const char = token[i];
    if (!char) {
      break;
    }
    if (advanceQuotedScanState(char, quoteState)) {
      continue;
    }
    if (!quoteState.inSingle && !quoteState.inDouble) {
      if (char === "(") {
        depth++;
      } else if (char === ")") {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
    }
  }
  return -1;
}
function advanceQuotedScanState(char, state) {
  if (state.escaped) {
    state.escaped = false;
    return true;
  }
  if (char === "\\" && !state.inSingle) {
    state.escaped = true;
    return true;
  }
  if (!state.inDouble && char === "'") {
    state.inSingle = !state.inSingle;
    return true;
  }
  if (!state.inSingle && char === '"') {
    state.inDouble = !state.inDouble;
    return true;
  }
  return false;
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
// src/core/shell/wrappers.ts
import { realpathSync as realpathSync2 } from "node:fs";
import { isAbsolute as isAbsolute2, parse as parsePath2 } from "node:path";

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
var GIT_SSH_ENV_NAMES = new Set([
  "GIT_SSH_COMMAND",
  "GIT_SSH",
  "GIT_SSH_VARIANT"
]);
var GIT_CONTEXT_APPEND_ASSIGNMENT_RE = /^([A-Za-z_][A-Za-z0-9_]*)\+=/;
function isGitContextEnvOverrideName(name) {
  return GIT_CONTEXT_ENV_OVERRIDE_NAMES.has(name);
}
function isGitConfigEnvName(name) {
  return name === "GIT_CONFIG_COUNT" || name === "GIT_CONFIG_PARAMETERS" || /^GIT_CONFIG_(KEY|VALUE)_\d+$/.test(name);
}
function isTrackedGitEnvName(name) {
  return isGitContextEnvOverrideName(name) || GIT_CONFIG_AFFECTING_ENV_NAMES.has(name) || GIT_SSH_ENV_NAMES.has(name) || isGitConfigEnvName(name);
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
function hasGitSshEnvAssignment(envAssignments) {
  if (!envAssignments) {
    return false;
  }
  for (const key of envAssignments.keys()) {
    if (GIT_SSH_ENV_NAMES.has(key)) {
      return true;
    }
  }
  return false;
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
import { dirname, isAbsolute, parse as parsePath, sep } from "node:path";
function resolveChdirTarget(baseCwd, target) {
  const root = isAbsolute(target) ? getPathRoot(target) : "";
  let current = root || baseCwd;
  for (const component of getPathComponents(root ? target.slice(root.length) : target)) {
    if (component === "" || component === ".") {
      continue;
    }
    if (component === "..") {
      current = dirname(current);
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

// src/core/shell/wrappers.ts
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
      expandedTokens = replaceEnvSplitTokens(expandedTokens, i, 2, splitTokens);
      continue;
    }
    if (token.startsWith("-S") && token.length > 2) {
      const splitTokens = parseEnvSplitString(token.slice("-S".length));
      if (!splitTokens) {
        currentCwd = null;
        i++;
        continue;
      }
      expandedTokens = replaceEnvSplitTokens(expandedTokens, i, 1, splitTokens);
      continue;
    }
    if (token.startsWith("--split-string=")) {
      const splitTokens = parseEnvSplitString(token.slice("--split-string=".length));
      if (!splitTokens) {
        currentCwd = null;
        i++;
        continue;
      }
      expandedTokens = replaceEnvSplitTokens(expandedTokens, i, 1, splitTokens);
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
    const token = getCommandTokenText(entry);
    if (token === null) {
      return null;
    }
    result.push(token);
  }
  return result;
}
function replaceEnvSplitTokens(tokens, index, consumed, splitTokens) {
  return [...tokens.slice(0, index), ...splitTokens, ...tokens.slice(index + consumed)];
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
// src/core/analyze/find.ts
var REASON_FIND_DELETE = "find -delete permanently removes files. Use -print first to preview.";
var FIND_PRIMARIES_WITH_VALUE = new Set([
  "-amin",
  "-anewer",
  "-atime",
  "-cmin",
  "-cnewer",
  "-context",
  "-ctime",
  "-exec",
  "-execdir",
  "-fprint",
  "-fprintf",
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
  "-mmin",
  "-mtime",
  "-name",
  "-newer",
  "-newerXY",
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
  "-xtype"
]);
function analyzeFind(tokens, context = {}) {
  if (findHasDelete(tokens.slice(1))) {
    return REASON_FIND_DELETE;
  }
  for (let i = 0;i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "-exec" || token === "-execdir") {
      const execCommand = getFindExecCommand(tokens, i);
      const directReason = analyzeFindExecCommand(execCommand);
      if (directReason) {
        return directReason;
      }
      if (context.analyzeTokens) {
        const reason = context.analyzeTokens(execCommand, token === "-execdir" ? null : context.cwd);
        if (reason) {
          return reason;
        }
        continue;
      }
      if (context.analyzeNested) {
        const reason = context.analyzeNested(execCommand.join(" "), {
          effectiveCwd: token === "-execdir" ? undefined : context.cwd,
          envAssignments: context.envAssignments
        });
        if (reason) {
          return reason;
        }
        continue;
      }
      const fallbackReason = analyzeFindExecCommand(execCommand);
      if (fallbackReason)
        return fallbackReason;
    }
  }
  return null;
}
function analyzeFindExecCommand(tokens) {
  let execCommand = stripWrappers([...tokens]);
  if (execCommand.length === 0) {
    return null;
  }
  let head = getBasename(execCommand[0] ?? "");
  if (head === "busybox" && execCommand.length > 1) {
    execCommand = execCommand.slice(1);
    head = getBasename(execCommand[0] ?? "");
  }
  if (head === "rm" && hasRecursiveForceFlags(execCommand)) {
    return "find -exec rm -rf is dangerous. Use explicit file list instead.";
  }
  return null;
}
function getFindExecCommand(tokens, execIndex) {
  const execTokens = tokens.slice(execIndex + 1);
  const semicolonIdx = execTokens.indexOf(";");
  const plusIdx = execTokens.indexOf("+");
  const endIdx = semicolonIdx !== -1 && plusIdx !== -1 ? Math.min(semicolonIdx, plusIdx) : semicolonIdx !== -1 ? semicolonIdx : plusIdx !== -1 ? plusIdx : execTokens.length;
  return execTokens.slice(0, endIdx);
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
    if (findPrimaryTakesValue(token)) {
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
function findPrimaryTakesValue(token) {
  return FIND_PRIMARIES_WITH_VALUE.has(token) || /^-newer[A-Za-z]{2}$/.test(token);
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
    if (token.startsWith("-") && !token.startsWith("--") && (token.includes("c") || token.includes("e")) && tokens[i + 1]) {
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

// src/core/analyze/rm.ts
import { realpathSync as realpathSync3 } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { normalize, resolve, sep as sep2 } from "node:path";

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
function getCCSafetyNetEnvModes() {
  const paranoidAll = envTruthy(ENV_FLAGS.paranoid);
  return {
    strict: envTruthy(ENV_FLAGS.strict),
    paranoidAll,
    paranoidRm: paranoidAll || envTruthy(ENV_FLAGS.paranoidRm),
    paranoidInterpreters: paranoidAll || envTruthy(ENV_FLAGS.paranoidInterpreters),
    worktreeMode: envTruthy(ENV_FLAGS.worktree)
  };
}
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

// src/core/analyze/rm.ts
var IS_WINDOWS = process.platform === "win32";
function normalizePathForComparison(p) {
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
var REASON_RM_RF_DYNAMIC_TARGET = "rm -rf target contains shell variables that cannot be verified safely. Use literal paths within cwd, /tmp, /var/tmp, or $TMPDIR.";
var REASON_RM_RF_ROOT_HOME = "rm -rf targeting root or home directory is extremely dangerous and always blocked.";
var REASON_RM_HOME_CWD = "rm -rf in home directory is dangerous. Change to a project directory first.";
function analyzeRm(tokens, options2 = {}) {
  const { cwd, originalCwd, paranoid = false, allowTmpdirVar = true } = options2;
  const anchoredCwd = originalCwd ?? cwd ?? null;
  const resolvedCwd = cwd ?? null;
  const ctx = {
    anchoredCwd,
    resolvedCwd,
    paranoid,
    trustTmpdirVar: allowTmpdirVar,
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
  if (isDynamicTarget(target)) {
    return { kind: "dynamic_target" };
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
    case "dynamic_target":
      return REASON_RM_RF_DYNAMIC_TARGET;
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
  if (hasParentDirectoryComponent(normalized)) {
    return false;
  }
  if (normalized === "/tmp" || normalized.startsWith("/tmp/")) {
    return true;
  }
  if (normalized === "/var/tmp" || normalized.startsWith("/var/tmp/")) {
    return true;
  }
  const systemTmpdir = tmpdir();
  const normalizedTmpdir = normalizePathForComparison(systemTmpdir);
  const pathToCompare = normalizePathForComparison(normalized);
  if (pathToCompare.startsWith(`${normalizedTmpdir}${sep2}`) || pathToCompare === normalizedTmpdir) {
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
function hasParentDirectoryComponent(path) {
  return path.split(/[\\/]+/).includes("..");
}
function getHomeDirForRmPolicy() {
  return process.env.HOME ?? homedir();
}
function isDynamicTarget(target) {
  return target.includes("$") || target.includes("`");
}
function isCwdHomeForRmPolicy(cwd, homeDir) {
  try {
    return normalizePathForComparison(cwd) === normalizePathForComparison(homeDir);
  } catch {
    return false;
  }
}
function isCwdSelfTarget(target, cwd) {
  if (target === "." || target === "./" || target === ".\\") {
    return true;
  }
  try {
    const resolved = resolve(cwd, target);
    const realCwd = realpathSync3(cwd);
    const realResolved = realpathSync3(resolved);
    return normalizePathForComparison(realResolved) === normalizePathForComparison(realCwd);
  } catch {
    try {
      const resolved = resolve(cwd, target);
      return normalizePathForComparison(resolved) === normalizePathForComparison(cwd);
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
  if (isDynamicTarget(target)) {
    return false;
  }
  if (target.startsWith("/") || /^[A-Za-z]:[\\/]/.test(target)) {
    try {
      return isResolvedPathWithinCwd(target, originalCwd);
    } catch {
      return false;
    }
  }
  if (target.startsWith("./") || target.startsWith(".\\") || !target.includes("/") && !target.includes("\\")) {
    try {
      const resolved = resolve(resolveCwd, target);
      return isResolvedPathWithinCwd(resolved, originalCwd);
    } catch {
      return false;
    }
  }
  if (target.startsWith("../")) {
    return false;
  }
  try {
    const resolved = resolve(resolveCwd, target);
    return isResolvedPathWithinCwd(resolved, originalCwd);
  } catch {
    return false;
  }
}
function isResolvedPathWithinCwd(resolvedTarget, cwd) {
  try {
    return isNormalizedPathWithin(realpathSync3(resolvedTarget), realpathSync3(cwd));
  } catch {
    return isNormalizedPathWithin(resolvedTarget, cwd);
  }
}
function isNormalizedPathWithin(target, cwd) {
  const normalizedTarget = normalizePathForComparison(target);
  const normalizedCwd = normalizePathForComparison(cwd);
  return normalizedTarget.startsWith(`${normalizedCwd}${sep2}`) || normalizedTarget === normalizedCwd;
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

// src/core/git/worktree.ts
import { existsSync, lstatSync as lstatSync2, readFileSync, realpathSync as realpathSync4, statSync } from "node:fs";
import { dirname as dirname2, isAbsolute as isAbsolute3, join, resolve as resolve2 } from "node:path";
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
    gitCwd = realpathSync4(resolve2(cwd));
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
    const content = readFileSync(dotGitPath, "utf-8");
    const firstLine = content.split(/\r?\n/, 1)[0]?.trim() ?? "";
    if (!firstLine.startsWith("gitdir:")) {
      return false;
    }
    const rawGitDir = firstLine.slice("gitdir:".length).trim();
    if (rawGitDir === "") {
      return false;
    }
    const gitDir = isAbsolute3(rawGitDir) ? rawGitDir : resolve2(dirname2(dotGitPath), rawGitDir);
    if (!existsSync(join(gitDir, "commondir"))) {
      return false;
    }
    if (!worktreeGitdirBacklinkMatches(gitDir, dotGitPath)) {
      return false;
    }
    return worktreeConfigMatchesRoot(gitDir, dirname2(dotGitPath));
  } catch {
    return false;
  }
}
function worktreeGitdirBacklinkMatches(gitDir, dotGitPath) {
  const backlinkPath = join(gitDir, "gitdir");
  if (!existsSync(backlinkPath)) {
    return false;
  }
  const rawBacklink = readFileSync(backlinkPath, "utf-8").split(/\r?\n/, 1)[0]?.trim() ?? "";
  if (rawBacklink === "") {
    return false;
  }
  const linkedDotGitPath = isAbsolute3(rawBacklink) ? rawBacklink : resolve2(gitDir, rawBacklink);
  try {
    return sameFilesystemPath(linkedDotGitPath, dotGitPath);
  } catch {
    return false;
  }
}
function worktreeConfigMatchesRoot(gitDir, worktreeRoot) {
  const configWorktreePath = join(gitDir, "config.worktree");
  if (!existsSync(configWorktreePath)) {
    return true;
  }
  const configuredWorktree = readCoreWorktree(configWorktreePath);
  if (configuredWorktree === null) {
    return true;
  }
  const resolvedConfiguredWorktree = isAbsolute3(configuredWorktree) ? configuredWorktree : resolve2(gitDir, configuredWorktree);
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
  return normalizePathForComparison2(realpathSync4.native(path));
}
function normalizePathForComparison2(path) {
  let normalized = path.replace(/^\\\\\?\\UNC\\/i, "//").replace(/^\\\\\?\\/i, "");
  normalized = normalized.replace(/\\/g, "/");
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}
function readCoreWorktree(configPath) {
  const content = readFileSync(configPath, "utf-8");
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
    return findDotGitInAncestors(realpathSync4(cwd));
  } catch {
    return null;
  }
}
function findDotGitInAncestors(cwd) {
  let current = cwd;
  while (true) {
    const dotGitPath = join(current, ".git");
    if (existsSync(dotGitPath)) {
      return dotGitPath;
    }
    const parent = dirname2(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
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
  const command2 = firstToken ? getBasename(firstToken).toLowerCase() : null;
  if (command2 !== "git") {
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
var REASON_REBASE_ABORT = "git rebase --abort discards rebase conflict resolutions. Use 'git status' first.";
var REASON_MERGE_ABORT = "git merge --abort discards merge conflict resolutions. Use 'git status' first.";
var REASON_TAG_DELETE = "git tag -d permanently deletes tags.";
var REASON_REFLOG_DELETE = "git reflog delete removes recovery history.";
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
function matchesGitLongOption(token, option) {
  const optionName = token.split("=", 1)[0] ?? token;
  return optionName.length >= 4 && option.startsWith(optionName) && optionName.startsWith("--") && optionName.slice(2).length >= 2;
}
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
  if (beforeDash.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f")) {
    return REASON_CHECKOUT_FORCE;
  }
  for (const token of tokens) {
    if (token === "-b" || token === "-B" || token === "--orphan") {
      return null;
    }
    if (matchesGitLongOption(token, "--pathspec-from-file")) {
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
  if (before.some((token) => matchesGitLongOption(token, "--discard-changes"))) {
    return REASON_SWITCH_DISCARD_CHANGES;
  }
  const shortOpts = extractShortOpts(before, {
    shortOptsWithValue: SWITCH_SHORT_OPTS_WITH_VALUE
  });
  if (before.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f")) {
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
    if (matchesGitLongOption(token, "--hard")) {
      reason = REASON_RESET_HARD;
      break;
    }
    if (matchesGitLongOption(token, "--merge")) {
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
    if (token === "-n" || matchesGitLongOption(token, "--dry-run")) {
      return null;
    }
  }
  const shortOpts = extractShortOpts(tokens.filter((t) => t !== "--"));
  if (tokens.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f")) {
    return REASON_CLEAN;
  }
  return null;
}
function analyzeGitPush(tokens) {
  const shortOpts = extractShortOpts(tokens.filter((t) => t !== "--"));
  const hasForce = tokens.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f");
  if (hasForce) {
    return REASON_PUSH_FORCE;
  }
  return null;
}
function analyzeGitBranch(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  const shortOpts = extractShortOpts(before);
  const hasDelete = shortOpts.has("-D") || shortOpts.has("-d") || before.some((token) => matchesGitLongOption(token, "--delete"));
  const hasForce = shortOpts.has("-D") || shortOpts.has("-f") || before.some((token) => matchesGitLongOption(token, "--force"));
  if (hasDelete && hasForce) {
    return REASON_BRANCH_DELETE;
  }
  return null;
}
function analyzeGitRebase(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  return before.some((token) => matchesGitLongOption(token, "--abort")) ? REASON_REBASE_ABORT : null;
}
function analyzeGitMerge(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  return before.some((token) => matchesGitLongOption(token, "--abort")) ? REASON_MERGE_ABORT : null;
}
function analyzeGitTag(tokens) {
  const { before } = splitAtDoubleDash(tokens);
  const shortOpts = extractShortOpts(before);
  return shortOpts.has("-d") || before.some((token) => matchesGitLongOption(token, "--delete")) ? REASON_TAG_DELETE : null;
}
function analyzeGitReflog(tokens) {
  return tokens[0] === "delete" ? REASON_REFLOG_DELETE : null;
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
  const { before } = splitAtDoubleDash(tokens);
  const hasRemove = before.includes("remove");
  if (!hasRemove)
    return null;
  const shortOpts = extractShortOpts(before);
  if (before.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f")) {
    return REASON_WORKTREE_REMOVE_FORCE;
  }
  return null;
}

// src/core/git/config.ts
import { execFileSync } from "node:child_process";
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "node:fs";
import { dirname as dirname3, isAbsolute as isAbsolute4, join as join2, resolve as resolve3 } from "node:path";
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
    if (!existsSync2(configPath)) {
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
    if (existsSync2(gitBinary)) {
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
  return [join2(commonDir, "config"), join2(gitDir, "config.worktree")];
}
function resolveGitDirFromDotGit(dotGitPath) {
  try {
    const content = readFileSync2(dotGitPath, "utf-8");
    const firstLine = content.split(/\r?\n/, 1)[0]?.trim() ?? "";
    if (!firstLine.startsWith("gitdir:")) {
      return dotGitPath;
    }
    const rawGitDir = firstLine.slice("gitdir:".length).trim();
    if (rawGitDir === "") {
      return null;
    }
    return isAbsolute4(rawGitDir) ? rawGitDir : resolve3(dirname3(dotGitPath), rawGitDir);
  } catch {
    return null;
  }
}
function resolveCommonGitDir(gitDir) {
  const commonDirPath = join2(gitDir, "commondir");
  if (!existsSync2(commonDirPath)) {
    return gitDir;
  }
  try {
    const rawCommonDir = readFileSync2(commonDirPath, "utf-8").split(/\r?\n/, 1)[0]?.trim() ?? "";
    if (rawCommonDir === "") {
      return null;
    }
    return isAbsolute4(rawCommonDir) ? rawCommonDir : resolve3(gitDir, rawCommonDir);
  } catch {
    return null;
  }
}
function gitConfigFileEnablesRecursiveSubmodules(configPath) {
  let content;
  try {
    content = readFileSync2(configPath, "utf-8");
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

// src/core/git/worktree-relaxation.ts
function getGitWorktreeRelaxationForMatch(tokens, match, options2) {
  if (!match.localDiscard || !options2.worktreeMode || hasGitContextEnvOverride(options2.envAssignments)) {
    return null;
  }
  const context = getGitExecutionContext(tokens, options2.cwd);
  if (!context.gitCwd || context.hasExplicitGitContext) {
    return null;
  }
  if (!isLinkedWorktree(context.gitCwd)) {
    return null;
  }
  if (isNonRelaxableLocalDiscard(tokens, options2, context.gitCwd)) {
    return null;
  }
  return {
    originalReason: match.reason,
    gitCwd: context.gitCwd
  };
}
function isNonRelaxableLocalDiscard(tokens, options2, gitCwd) {
  const { subcommand, rest } = extractGitSubcommandAndRest(tokens);
  const normalizedSubcommand = subcommand?.toLowerCase();
  if (hasDynamicGitArgument(rest) || hasRecursiveSubmoduleConfig(tokens, options2.envAssignments, gitCwd) || hasRecurseSubmodulesOption(rest) || isForcedBranchReset(normalizedSubcommand, rest)) {
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
    const hasForce = before.some((token) => matchesGitLongOption(token, "--force")) || shortOpts.has("-f");
    const hasBranchReset = shortOpts.has("-B") || before.some((token) => token === "-B" || token.startsWith("-B"));
    return hasForce && hasBranchReset;
  }
  if (subcommand === "switch") {
    const { before } = splitAtDoubleDash(rest);
    const shortOpts = extractShortOpts(before, {
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

// src/core/git/index.ts
var REASON_GIT_SSH_ENV = "Git SSH environment overrides can execute arbitrary commands during network operations.";
var GIT_NETWORK_SUBCOMMANDS = new Set([
  "clone",
  "fetch",
  "pull",
  "push",
  "ls-remote",
  "submodule"
]);
function analyzeGit(tokens, options2 = {}) {
  if (hasGitSshEnvAssignment(options2.envAssignments) && isGitNetworkOperation(tokens)) {
    return REASON_GIT_SSH_ENV;
  }
  const match = analyzeGitRule(tokens);
  if (!match) {
    return null;
  }
  if (getGitWorktreeRelaxationForMatch(tokens, match, options2)) {
    return null;
  }
  return match.reason;
}
function isGitNetworkOperation(tokens) {
  const { subcommand } = extractGitSubcommandAndRest(tokens);
  return GIT_NETWORK_SUBCOMMANDS.has(subcommand?.toLowerCase() ?? "");
}
function getGitWorktreeRelaxation(tokens, options2 = {}) {
  const match = analyzeGitRule(tokens);
  if (!match) {
    return null;
  }
  return getGitWorktreeRelaxationForMatch(tokens, match, options2);
}

// src/core/analyze/child-analyzer.ts
function analyzeChildCommand(tokens, context, options2 = {}) {
  if (tokens.length === 0) {
    return null;
  }
  const head = tokens[0];
  if (!head) {
    return null;
  }
  if (SHELL_WRAPPERS.has(head)) {
    if (options2.dynamicInput && options2.shellDynamicReason) {
      return options2.shellDynamicReason;
    }
    const dashCArg = extractDashCArg(tokens);
    if (dashCArg && context.analyzeNested) {
      return context.analyzeNested(dashCArg, {
        effectiveCwd: context.cwd,
        envAssignments: context.envAssignments
      });
    }
    return null;
  }
  if (head === "rm" && hasRecursiveForceFlags(tokens)) {
    const rmResult = analyzeRm([...tokens], {
      cwd: context.cwd,
      originalCwd: context.originalCwd,
      paranoid: context.paranoidRm,
      allowTmpdirVar: context.allowTmpdirVar
    });
    return rmResult ?? (options2.dynamicInput ? options2.rmDynamicReason ?? null : null);
  }
  if (head === "find") {
    return analyzeFind(tokens, {
      ...context,
      analyzeTokens: (nestedTokens, cwd) => analyzeChildCommand(nestedTokens, { ...context, cwd: cwd ?? undefined }, options2)
    });
  }
  if (head === "git") {
    return analyzeGit(tokens, {
      cwd: context.cwd,
      envAssignments: context.envAssignments,
      worktreeMode: options2.dynamicInput ? false : context.worktreeMode
    });
  }
  return null;
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

// src/core/analyze/parallel.ts
var REASON_PARALLEL_RM = "parallel rm -rf with dynamic input is dangerous. Use explicit file list instead.";
var REASON_PARALLEL_SHELL = "parallel with shell -c can execute arbitrary commands from dynamic input.";
var PARALLEL_PLACEHOLDER_RE = /\{[^{}\s]*\}/;
function analyzeParallel(tokens, context) {
  const parseResult = parseParallelCommand(tokens);
  if (!parseResult) {
    return null;
  }
  const { template, args, templateHasPlaceholder, runsRemotely, usesStdin, envNames } = parseResult;
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
  const dynamicEnvValues = getParallelDynamicEnvValues(envNames, context.envAssignments, childCommand.envAssignments);
  const envHasPlaceholder = dynamicEnvValues.some(hasParallelPlaceholder);
  const hasPlaceholder = templateHasPlaceholder || envHasPlaceholder;
  const hasDynamicStdinPlaceholder = usesStdin && hasPlaceholder;
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
      const envReason = analyzeParallelDynamicEnvValues(dynamicEnvValues, args, context);
      if (envReason) {
        return envReason;
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
    if (templateHasPlaceholder && args.length > 0) {
      return analyzeParallelRmExpansions(args.map((arg) => childTokens.map((t) => t.replace(/{}/g, arg))), childCommand.cwd, context);
    }
    if (args.length > 0) {
      return analyzeParallelRmExpansions(args.map((arg) => [...childTokens, arg]), childCommand.cwd, context);
    }
    return REASON_PARALLEL_RM;
  }
  const tokenSets = getParallelChildTokenSets(childTokens, templateHasPlaceholder, args);
  for (const tokens2 of tokenSets) {
    const result = analyzeChildCommand(tokens2, {
      cwd: childCommand.cwd,
      originalCwd: context.originalCwd,
      paranoidRm: context.paranoidRm,
      allowTmpdirVar: context.allowTmpdirVar,
      envAssignments: childCommand.envAssignments,
      worktreeMode: runsRemotely || usesStdin || hasPlaceholder ? false : context.worktreeMode,
      analyzeNested: context.analyzeNested
    }, {
      dynamicInput: usesStdin || hasPlaceholder,
      shellDynamicReason: REASON_PARALLEL_SHELL,
      rmDynamicReason: REASON_PARALLEL_RM
    });
    if (result) {
      return result;
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
function getParallelChildTokenSets(childTokens, hasPlaceholder, args) {
  if (hasPlaceholder && args.length > 0) {
    return args.map((arg) => childTokens.map((token) => replaceParallelPlaceholder(token, arg)));
  }
  if (!hasPlaceholder && args.length > 0) {
    return args.map((arg) => [...childTokens, arg]);
  }
  return [[...childTokens]];
}
function getParallelDynamicEnvValues(envNames, contextEnvAssignments, childEnvAssignments) {
  return [
    ...envNames.flatMap((name) => {
      const value = childEnvAssignments.get(name) ?? contextEnvAssignments?.get(name);
      return value === undefined ? [] : [value];
    }),
    ...childEnvAssignments.values()
  ];
}
function analyzeParallelDynamicEnvValues(values, args, context) {
  for (const value of values) {
    if (!hasParallelPlaceholder(value)) {
      continue;
    }
    const commands = args.length > 0 ? args.map((arg) => replaceParallelPlaceholder(value, arg)) : [value];
    for (const command2 of commands) {
      const reason = context.analyzeNested(command2, {
        envAssignments: context.envAssignments,
        effectiveCwd: context.cwd
      });
      if (reason) {
        return reason;
      }
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
  let childCommandTokens = [];
  let markerIndex = -1;
  let runsRemotely = false;
  let usesPipe = false;
  const envNames = [];
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
      childCommandTokens = [...tokens.slice(i + 1)];
      markerIndex = template.markerIndex;
      break;
    }
    if (token.startsWith("-")) {
      if (token === "--pipe" || token === "--pipepart") {
        usesPipe = true;
        i++;
        continue;
      }
      if (token === "--env") {
        envNames.push(...splitParallelEnvNames(tokens[i + 1]));
        i += 2;
        continue;
      }
      if (token.startsWith("--env=")) {
        envNames.push(...splitParallelEnvNames(token.slice("--env=".length)));
        i++;
        continue;
      }
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
      childCommandTokens = [...tokens.slice(i)];
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
  const templateHasPlaceholder = templateTokens.some(hasParallelPlaceholder);
  if (templateTokens.length === 0 && markerIndex === -1) {
    return null;
  }
  return {
    template: templateTokens,
    args,
    childCommandTokens,
    templateHasPlaceholder,
    runsRemotely,
    usesStdin: usesPipe || markerIndex === -1,
    envNames
  };
}
function splitParallelEnvNames(value) {
  return (value ?? "").split(",").map((name) => name.trim()).filter(Boolean);
}

// src/core/analyze/tmpdir.ts
import { existsSync as existsSync3, lstatSync as lstatSync3, realpathSync as realpathSync5 } from "node:fs";
import { tmpdir as tmpdir2 } from "node:os";
import { isAbsolute as isAbsolute5, join as join3, normalize as normalize2, parse as parsePath3, sep as sep3 } from "node:path";
function isTmpdirOverriddenToNonTemp(envAssignments) {
  if (!envAssignments.has("TMPDIR")) {
    return false;
  }
  const tmpdirValue = envAssignments.get("TMPDIR") ?? "";
  if (tmpdirValue === "") {
    return true;
  }
  const normalizedTmpdirValue = tryResolveExistingPathComponents(tmpdirValue);
  if (normalizedTmpdirValue === null) {
    return true;
  }
  const sysTmpdir = tryResolveExistingPathComponents(tmpdir2()) ?? normalize2(tmpdir2());
  if (isPathOrSubpath(normalizedTmpdirValue, resolveExistingPathComponents("/tmp")) || isPathOrSubpath(normalizedTmpdirValue, resolveExistingPathComponents("/var/tmp")) || isPathOrSubpath(normalizedTmpdirValue, sysTmpdir)) {
    return false;
  }
  return true;
}
function tryResolveExistingPathComponents(path) {
  try {
    return resolveExistingPathComponents(path);
  } catch {
    return null;
  }
}
function resolveExistingPathComponents(path) {
  const normalized = normalize2(path);
  if (!isAbsolute5(normalized)) {
    return normalized;
  }
  const root = parsePath3(normalized).root;
  const components = normalized.slice(root.length).split(/[\\/]+/).filter(Boolean);
  let current = root;
  for (let i = 0;i < components.length; i++) {
    const candidate = join3(current, components[i] ?? "");
    if (!existsSync3(candidate)) {
      return join3(candidate, ...components.slice(i + 1));
    }
    current = lstatSync3(candidate).isSymbolicLink() ? realpathSync5(candidate) : candidate;
  }
  return current;
}
function isPathOrSubpath(path, basePath) {
  if (path === basePath) {
    return true;
  }
  const baseWithSlash = basePath.endsWith(sep3) ? basePath : `${basePath}${sep3}`;
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
  const childResult = analyzeChildCommand(childTokens, {
    cwd: childCommand.cwd,
    originalCwd: context.originalCwd,
    paranoidRm: context.paranoidRm,
    allowTmpdirVar: context.allowTmpdirVar,
    envAssignments: childCommand.envAssignments,
    worktreeMode: context.worktreeMode
  }, {
    dynamicInput: childCommand.head !== "git",
    shellDynamicReason: REASON_XARGS_SHELL,
    rmDynamicReason: REASON_XARGS_RM
  });
  if (childResult) {
    return childResult;
  }
  if (childCommand.head !== "git") {
    return null;
  }
  const gitTokens = replacementToken === null ? [...childTokens, XARGS_APPENDED_INPUT] : childTokens;
  const hasDynamicReplacement = replacementToken !== null && (childTokens.some((token) => token.includes(replacementToken)) || Array.from(childCommand.envAssignments.values()).some((value) => value.includes(replacementToken)));
  return analyzeChildCommand(gitTokens, {
    cwd: childCommand.cwd,
    originalCwd: context.originalCwd,
    paranoidRm: context.paranoidRm,
    allowTmpdirVar: context.allowTmpdirVar,
    envAssignments: childCommand.envAssignments,
    worktreeMode: replacementToken === null || hasDynamicReplacement ? false : context.worktreeMode
  });
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

// src/core/rules/custom.ts
function checkCustomRules(tokens, rules) {
  if (tokens.length === 0 || rules.length === 0) {
    return null;
  }
  const command2 = getBasename(tokens[0] ?? "");
  const subcommand = extractSubcommand(tokens);
  const shortOpts = extractShortOpts(tokens);
  for (const rule of rules) {
    if (!matchesCommand(command2, rule.command)) {
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
function matchesCommand(command2, ruleCommand) {
  return command2 === ruleCommand;
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
function deriveCwdContext(options2) {
  const cwdUnknown = options2.effectiveCwd === null;
  const cwdForRm = cwdUnknown ? undefined : options2.effectiveCwd ?? options2.cwd;
  const originalCwd = cwdUnknown ? undefined : options2.cwd;
  return { cwdUnknown, cwdForRm, originalCwd };
}
function analyzeSegment(tokens, depth, options2) {
  if (tokens.length === 0) {
    return null;
  }
  const { cwdForRm: baseCwdForRm, originalCwd } = deriveCwdContext(options2);
  const { tokens: strippedEnv, envAssignments: leadingEnvAssignments } = stripEnvAssignmentsWithInfo(tokens);
  const {
    tokens: stripped,
    envAssignments: wrapperEnvAssignments,
    cwd: wrapperCwd
  } = stripWrappersWithInfo(strippedEnv, baseCwdForRm);
  const envAssignments = new Map(options2.envAssignments ?? []);
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
  if (options2.config.failClosedReason) {
    return options2.config.failClosedReason;
  }
  const normalizedHead = normalizeCommandToken(head);
  const basename = getBasename(head);
  const cwdForRm = wrapperCwd === null ? undefined : wrapperCwd ?? baseCwdForRm;
  const nestedEffectiveCwd = wrapperCwd === undefined ? options2.effectiveCwd : wrapperCwd;
  const allowTmpdirVar = !isTmpdirOverriddenToNonTemp(envAssignments);
  if (isShellWrapperCommand(head, normalizedHead)) {
    const dashCArg = extractDashCArg(stripped);
    if (dashCArg) {
      return options2.analyzeNested(dashCArg, {
        effectiveCwd: nestedEffectiveCwd,
        envAssignments
      });
    }
  }
  if (AWK_INTERPRETERS.has(normalizedHead)) {
    const awkReason = analyzeAwkSystemCalls(stripped, (command2) => options2.analyzeNested(command2, {
      effectiveCwd: nestedEffectiveCwd,
      envAssignments
    }));
    if (awkReason) {
      return awkReason;
    }
  }
  if (INTERPRETERS.has(normalizedHead)) {
    const codeArg = extractInterpreterCodeArg(stripped);
    if (codeArg) {
      if (options2.paranoidInterpreters) {
        return REASON_INTERPRETER_BLOCKED + PARANOID_INTERPRETERS_SUFFIX;
      }
      const innerReason = options2.analyzeNested(codeArg, {
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
      ...options2,
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
    depth,
    effectiveCwd: nestedEffectiveCwd,
    options: options2
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
    const customResult = checkCustomRules(stripped, options2.config.rules);
    if (customResult) {
      return customResult;
    }
  }
  return null;
}
function isShellWrapperCommand(head, normalizedHead) {
  return SHELL_WRAPPERS.has(normalizedHead) || head === "$SHELL" || SHELL_WRAPPERS.has(getBasename(normalizedHead));
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
  if (isShellWrapperCommand(token, cmd)) {
    const dashCArg = extractDashCArg([token, ...context.tokens.slice(index + 1)]);
    if (!dashCArg) {
      return null;
    }
    return context.options.analyzeNested(dashCArg, {
      effectiveCwd: context.effectiveCwd,
      envAssignments: context.envAssignments
    });
  }
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
  return analyzeFind(context.tokens, {
    cwd: context.cwdForRm,
    envAssignments: context.envAssignments,
    analyzeTokens: (tokens, cwd) => analyzeSegment([...tokens], context.depth + 1, {
      ...context.options,
      effectiveCwd: cwd,
      envAssignments: context.envAssignments
    }),
    analyzeNested: context.options.analyzeNested
  });
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
  const unwrapped = getCwdChangeTokens(segment);
  if (unwrapped.length === 0) {
    return false;
  }
  let head = unwrapped[0] ?? "";
  let headIndex = 0;
  if (head === "builtin" && unwrapped.length > 1) {
    head = unwrapped[1] ?? "";
    headIndex = 1;
  }
  if (head === "time") {
    head = getHeadAfterTimePrefix(unwrapped, headIndex + 1);
  }
  if (head === "cd" || head === "pushd" || head === "popd") {
    return true;
  }
  const joined = segment.join(" ");
  return CWD_CHANGE_REGEX.test(joined);
}
function resolveCwdAfterSegment(segment, cwd) {
  if (!segmentChangesCwd(segment)) {
    return;
  }
  if (!cwd) {
    return null;
  }
  const unwrapped = getCwdChangeTokens(segment, cwd);
  const cdIndex = getCdCommandIndex(unwrapped);
  if (cdIndex === -1 || unwrapped[cdIndex] !== "cd") {
    return null;
  }
  const target = unwrapped[cdIndex + 1];
  if (!target || target === "-" || target.includes("$") || target.includes("`")) {
    return null;
  }
  try {
    const resolved = resolveChdirTarget(cwd, target);
    if (samePath(resolved, cwd)) {
      return cwd;
    }
  } catch {
    return null;
  }
  return null;
}
function getHeadAfterTimePrefix(tokens, startIndex) {
  let i = startIndex;
  while (tokens[i]?.startsWith("-")) {
    i++;
  }
  return tokens[i] ?? "";
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
function getCwdChangeTokens(segment, cwd) {
  const stripped = stripLeadingGrouping(segment);
  return stripWrappers([...stripped], cwd);
}
function samePath(a, b) {
  try {
    return normalize3(realpathSync6(a)) === normalize3(realpathSync6(b));
  } catch {
    return normalize3(a) === normalize3(b);
  }
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

// src/core/analyze/shell-git-env.ts
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
  const { command: command2, commandIndex, leadingAssignments } = commandInfo;
  if (command2 === null) {
    for (const assignment of leadingAssignments.values()) {
      setShellGitContextAssignment(state, assignment);
    }
    return;
  }
  if (command2 === "set") {
    const changes = getSetOptionChanges(tokens, commandIndex);
    if (changes.allexport !== null) {
      state.allexport = changes.allexport;
    }
    if (changes.keywordExport !== null) {
      state.keywordExport = changes.keywordExport;
    }
    return;
  }
  if (command2 !== "export" && command2 !== "typeset" && command2 !== "declare" && command2 !== "readonly") {
    return;
  }
  for (const assignment of leadingAssignments.values()) {
    setShellGitContextAssignment(state, assignment);
  }
  if (command2 === "export") {
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
    addTypesetGitContextEnvAssignment(state, token, operandsInfo.exports, command2 === "readonly" ? leadingAssignments : undefined);
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
  let command2 = tokens[commandIndex] ?? null;
  if (command2 === "builtin") {
    commandIndex++;
    if (tokens[commandIndex] === "--") {
      commandIndex++;
    }
    command2 = tokens[commandIndex] ?? null;
  }
  if (command2 === "command") {
    const commandBuiltinInfo = getCommandBuiltinTarget(tokens, commandIndex);
    if (!commandBuiltinInfo) {
      return null;
    }
    commandIndex = commandBuiltinInfo.commandIndex;
    command2 = commandBuiltinInfo.command;
  }
  if (command2 === null) {
    return null;
  }
  return { command: command2, commandIndex, leadingAssignments };
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
  const command2 = tokens[i];
  return command2 ? { command: command2, commandIndex: i } : null;
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

// src/core/analyze/analyze-command.ts
var REASON_STRICT_UNPARSEABLE = "Command could not be safely analyzed (strict mode). Verify manually.";
var DYNAMIC_SUBSTITUTION_TOKEN = "$__CC_SAFETY_NET_DYNAMIC_SUBSTITUTION__";
var REASON_RECURSION_LIMIT = "Command exceeds maximum recursion depth and cannot be safely analyzed.";
function analyzeCommandInternal(command2, depth, options2) {
  if (depth >= MAX_RECURSION_DEPTH) {
    return { reason: REASON_RECURSION_LIMIT, segment: command2 };
  }
  const segments2 = splitShellCommandsWithInfo(command2);
  if (depth === 0 && options2.config.failClosedReason && isFailClosedRepairCommand(segments2)) {
    return null;
  }
  if (options2.strict && segments2.length === 1 && segments2[0]?.tokens.length === 1 && segments2[0].tokens[0] === command2 && command2.includes(" ")) {
    return { reason: REASON_STRICT_UNPARSEABLE, segment: command2 };
  }
  const originalCwd = options2.cwd;
  let effectiveCwd = options2.effectiveCwd !== undefined ? options2.effectiveCwd : options2.cwd;
  const shellGitContextState = createShellGitContextEnvState(options2.envAssignments);
  for (const segmentInfo of segments2) {
    const segment = segmentInfo.hasDynamicSubstitution ? appendDynamicSubstitutionSentinelForGit(segmentInfo.tokens) : segmentInfo.tokens;
    const segmentStr = segment.join(" ");
    const segmentEnvAssignments = getSegmentGitContextEnvAssignments(segment, shellGitContextState);
    if (segment.length === 1 && segment[0]?.includes(" ")) {
      const textReason = dangerousInText(segment[0]);
      if (textReason) {
        return { reason: textReason, segment: segmentStr };
      }
      const nextCwd2 = resolveCwdAfterSegment(segment, effectiveCwd);
      if (nextCwd2 !== undefined) {
        effectiveCwd = nextCwd2;
      }
      continue;
    }
    const reason = analyzeSegment(segment, depth, {
      ...options2,
      cwd: originalCwd,
      effectiveCwd,
      envAssignments: segmentEnvAssignments,
      analyzeNested: (nestedCommand, overrides) => {
        const nestedEffectiveCwd = overrides && Object.hasOwn(overrides, "effectiveCwd") ? overrides.effectiveCwd : effectiveCwd;
        return analyzeCommandInternal(nestedCommand, depth + 1, {
          ...options2,
          effectiveCwd: nestedEffectiveCwd,
          envAssignments: overrides?.envAssignments ?? segmentEnvAssignments,
          worktreeMode: overrides?.worktreeMode ?? options2.worktreeMode
        })?.reason ?? null;
      }
    });
    if (reason) {
      return { reason, segment: segmentStr };
    }
    const nextCwd = resolveCwdAfterSegment(segment, effectiveCwd);
    if (nextCwd !== undefined) {
      effectiveCwd = nextCwd;
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
function isFailClosedRepairCommand(segments2) {
  if (segments2.length !== 1 || segments2[0]?.hasDynamicSubstitution) {
    return false;
  }
  const segment = segments2[0];
  if (!segment) {
    return false;
  }
  const tokens = segment.tokens;
  if (tokens[0] === "cc-safety-net") {
    return tokens[1] === "rule" && isRuleSyncArgs(tokens.slice(2));
  }
  if (tokens[0] === "npx") {
    return (tokens[1] === "-y" || tokens[1] === "--yes") && isPackageRuleSyncRepair(tokens, 2);
  }
  if (tokens[0] === "bunx" || tokens[0] === "pnpx") {
    return isPackageRuleSyncRepair(tokens, 1);
  }
  if ((tokens[0] === "pnpm" || tokens[0] === "yarn") && tokens[1] === "dlx") {
    return isPackageRuleSyncRepair(tokens, 2);
  }
  return false;
}
function isPackageRuleSyncRepair(tokens, packageIndex) {
  return isCCSafetyNetPackage(tokens[packageIndex]) && tokens[packageIndex + 1] === "rule" && isRuleSyncArgs(tokens.slice(packageIndex + 2));
}
function isRuleSyncArgs(args) {
  return args.length >= 1 && args.length <= 2 && args.filter((arg) => arg === "sync").length === 1 && args.every((arg) => arg === "sync" || arg === "--global" || arg === "-g");
}
function isCCSafetyNetPackage(value) {
  return /^cc-safety-net(?:@[a-zA-Z0-9._-]+)?$/.test(value ?? "");
}

// src/core/config.ts
import { existsSync as existsSync9, readFileSync as readFileSync8 } from "node:fs";
import { resolve as resolve7 } from "node:path";

// src/core/rules/custom-rule-validation.ts
function validateCustomRule(rule, index, ruleNames, options2 = {}) {
  const errors = [];
  const prefix = `rules[${index}]`;
  if (!rule || typeof rule !== "object") {
    errors.push(`${prefix}: must be an object`);
    return errors;
  }
  const r = rule;
  const messageStyle = options2.messageStyle ?? "legacy";
  if (typeof r.name !== "string") {
    errors.push(`${prefix}.name: required string`);
  } else {
    if (!NAME_PATTERN.test(r.name)) {
      errors.push(messageStyle === "rulebook" ? `${prefix}.name: must match rule name pattern` : `${prefix}.name: must match pattern (letters, numbers, hyphens, underscores; max 64 chars)`);
    }
    const lowerName = r.name.toLowerCase();
    if (ruleNames.has(lowerName)) {
      errors.push(`${prefix}.name: duplicate rule name "${r.name}"`);
    } else {
      ruleNames.add(lowerName);
    }
  }
  if (typeof r.command !== "string") {
    errors.push(messageStyle === "rulebook" ? `${prefix}.command: required string matching command pattern` : `${prefix}.command: required string`);
  } else if (!COMMAND_PATTERN.test(r.command)) {
    errors.push(messageStyle === "rulebook" ? `${prefix}.command: required string matching command pattern` : `${prefix}.command: must match pattern (letters, numbers, hyphens, underscores)`);
  }
  if (r.subcommand !== undefined) {
    if (typeof r.subcommand !== "string") {
      errors.push(messageStyle === "rulebook" ? `${prefix}.subcommand: must match command pattern` : `${prefix}.subcommand: must be a string if provided`);
    } else if (!COMMAND_PATTERN.test(r.subcommand)) {
      errors.push(messageStyle === "rulebook" ? `${prefix}.subcommand: must match command pattern` : `${prefix}.subcommand: must match pattern (letters, numbers, hyphens, underscores)`);
    }
  }
  if (!Array.isArray(r.block_args)) {
    errors.push(messageStyle === "rulebook" ? `${prefix}.block_args: required non-empty array` : `${prefix}.block_args: required array`);
  } else {
    if (r.block_args.length === 0) {
      errors.push(messageStyle === "rulebook" ? `${prefix}.block_args: required non-empty array` : `${prefix}.block_args: must have at least one element`);
    }
    for (let i = 0;i < r.block_args.length; i++) {
      const arg = r.block_args[i];
      if (typeof arg !== "string") {
        errors.push(messageStyle === "rulebook" ? `${prefix}.block_args[${i}]: must be a non-empty string` : `${prefix}.block_args[${i}]: must be a string`);
      } else if (arg === "") {
        errors.push(messageStyle === "rulebook" ? `${prefix}.block_args[${i}]: must be a non-empty string` : `${prefix}.block_args[${i}]: must not be empty`);
      }
    }
  }
  if (typeof r.reason !== "string") {
    errors.push(messageStyle === "rulebook" ? `${prefix}.reason: required non-empty string up to ${MAX_REASON_LENGTH} characters` : `${prefix}.reason: required string`);
  } else if (r.reason === "") {
    errors.push(messageStyle === "rulebook" ? `${prefix}.reason: required non-empty string up to ${MAX_REASON_LENGTH} characters` : `${prefix}.reason: must not be empty`);
  } else if (r.reason.length > MAX_REASON_LENGTH) {
    errors.push(messageStyle === "rulebook" ? `${prefix}.reason: required non-empty string up to ${MAX_REASON_LENGTH} characters` : `${prefix}.reason: must be at most ${MAX_REASON_LENGTH} characters`);
  }
  return errors;
}

// src/core/rules/policy/config-file.ts
import { existsSync as existsSync4, mkdirSync, readFileSync as readFileSync3, renameSync, writeFileSync } from "node:fs";
import { dirname as dirname5 } from "node:path";

// src/core/rules/policy/paths.ts
import { homedir as homedir2 } from "node:os";
import { dirname as dirname4, join as join4, resolve as resolve4 } from "node:path";
var RULES_CONFIG_FILE = "rule.json";
var RULES_LOCK_FILE = "rule.lock";
var RULEBOOK_FILE = "rulebook.json";
var LEGACY_RULES_CONFIG_FILE = "config.json";
var SAFETY_NET_DIR = ".cc-safety-net";
var RULES_SUBDIR = "rules";
var CACHE_SUBDIR = "cache";
var RULES_DIR = `${SAFETY_NET_DIR}/${RULES_SUBDIR}`;
var CC_SAFETY_NET_HOME = "CC_SAFETY_NET_HOME";
var GITHUB_RULEBOOK_SOURCE_FORMAT = "owner/repo#ref/<rulebook-name>";
var RULE_SYNC_COMMAND = "`cc-safety-net rule sync`";
var RULE_MIGRATE_COMMAND = "`npx -y cc-safety-net rule migrate`";
function getProjectRulesDir(cwd) {
  return resolve4(cwd ?? process.cwd(), RULES_DIR);
}
function getProjectRulesConfigPath(cwd) {
  return join4(getProjectRulesDir(cwd), RULES_CONFIG_FILE);
}
function getUserRulesDir(options2) {
  return options2?.userConfigDir ?? (options2?.userConfigPath ? dirname4(options2.userConfigPath) : join4(getUserSafetyNetHome(), RULES_SUBDIR));
}
function getUserSafetyNetHome() {
  const home = process.env[CC_SAFETY_NET_HOME];
  return home ? resolve4(home) : join4(homedir2(), SAFETY_NET_DIR);
}
function getUserRulesConfigPath(options2) {
  return join4(getUserRulesDir(options2), RULES_CONFIG_FILE);
}
function getUserRulesLockPath(options2) {
  return join4(getUserRulesDir(options2), RULES_LOCK_FILE);
}
function getRulesLockPathForConfigPath(configPath) {
  return join4(dirname4(configPath), RULES_LOCK_FILE);
}
function getLegacyUserRulesConfigPath(options2 = {}) {
  return join4(dirname4(getUserRulesDir(options2)), LEGACY_RULES_CONFIG_FILE);
}
function getLegacyProjectRulesConfigPath(options2 = {}) {
  return resolve4(options2.cwd ?? process.cwd(), ".safety-net.json");
}
function getPolicyPaths(options2) {
  const userConfigPath = options2.userConfigPath ?? getUserRulesConfigPath(options2);
  const projectConfigPath = options2.projectConfigPath ?? getProjectRulesConfigPath(options2.cwd);
  return {
    userConfigPath,
    projectConfigPath,
    userLockPath: getRulesLockPathForConfigPath(userConfigPath),
    projectLockPath: getRulesLockPathForConfigPath(projectConfigPath)
  };
}
function getScopePaths(options2) {
  const configPath = options2.global ? options2.userConfigPath ?? getUserRulesConfigPath(options2) : options2.projectConfigPath ?? getProjectRulesConfigPath(options2.cwd);
  return {
    configDir: dirname4(configPath),
    configPath,
    lockPath: getRulesLockPathForConfigPath(configPath)
  };
}
function getRulebookDisplaySource(entry) {
  if (entry.kind === "github" && entry.display_ref) {
    return `${entry.owner}/${entry.repo}#${entry.display_ref}/${entry.name}`;
  }
  return entry.spec;
}
function getRulebookCachePath(entry, options2) {
  const digestHex = entry.digest.startsWith("sha256:") ? entry.digest.slice(7) : entry.digest;
  return join4(getRulesCacheDir(options2), "rulebooks", `${getRulebookCacheSlug(entry)}--${digestHex.slice(0, 12)}`, RULEBOOK_FILE);
}
function getRulebookCacheSlug(entry) {
  const source = entry.kind === "github" && entry.display_ref ? `${entry.owner}/${entry.repo}#${entry.display_ref}/${entry.name}` : entry.spec;
  return source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "rulebook";
}
function getRepositoryRulebookPath(name) {
  return `${RULES_DIR}/${name}/${RULEBOOK_FILE}`;
}
function getRulesCacheDir(options2) {
  return join4(dirname4(options2?.cacheConfigDir ?? getUserRulesDir(options2)), CACHE_SUBDIR);
}

// src/core/rules/policy/sources.ts
var GITHUB_SOURCE_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;
var GITHUB_REPOSITORY_SOURCE_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9_.-]+$/;
var GITHUB_REPOSITORY_REF_SOURCE_RE = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#([A-Za-z0-9._-]+)$/;
var GITHUB_REF_PATTERN = /^[A-Za-z0-9._-]+$/;
var RULES_DIR_RE = RULES_DIR.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var RULEBOOK_FILE_RE = RULEBOOK_FILE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var GITHUB_RULEBOOK_PATH_RE = new RegExp(`^${RULES_DIR_RE}/(${NAME_PATTERN.source.slice(1, -1)})/${RULEBOOK_FILE_RE}$`);
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
        warnings: [],
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
      warnings: [],
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
      warnings: [],
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

// src/core/rules/policy/types.ts
var DEFAULT_CONFIG = { version: 1, rules: [], overrides: {} };

// src/core/rules/policy/config-file.ts
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
  if (!existsSync4(path)) {
    return { config: null, errors: [] };
  }
  try {
    const content = readFileSync3(path, "utf-8");
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
    return { ok: false, result: { ok: false, errors: loaded.errors, warnings: [], entries: [] } };
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
  mkdirSync(dirname5(path), { recursive: true });
  const tempPath = `${path}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(value, null, 2)}
`, "utf-8");
  renameSync(tempPath, path);
}

// src/core/rules/policy/scope-policy.ts
import { existsSync as existsSync7, readFileSync as readFileSync6, realpathSync as realpathSync7 } from "node:fs";
import { dirname as dirname6, isAbsolute as isAbsolute6, join as join6, relative, resolve as resolve5, sep as sep4 } from "node:path";

// src/core/rules/rulebook.ts
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
      errors.push(...validateCustomRule(rb.rules[i], i, ruleNames, { messageStyle: "rulebook" }));
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
function validateAllowedCommands(commands, errors) {
  const seen = new Set;
  for (let i = 0;i < commands.length; i++) {
    const command2 = commands[i];
    if (typeof command2 !== "string" || !COMMAND_PATTERN.test(command2)) {
      errors.push(`allowed_commands[${i}]: must match command pattern`);
      continue;
    }
    if (seen.has(command2)) {
      errors.push(`allowed_commands[${i}]: duplicate command "${command2}"`);
      continue;
    }
    seen.add(command2);
  }
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
    const segments2 = splitShellCommands(fixture.command).map((tokens) => {
      const result = checkCustomRules(tokens, rulebook.rules);
      return { tokens, result, matchedRule: result?.match(/^\[([^\]]+)]/)?.[1] ?? null };
    });
    const firstSegment = segments2[0] ?? { tokens: [], result: null, matchedRule: null };
    if (fixture.expect === "allowed") {
      const blockedSegment = segments2.find((segment) => segment.result);
      return blockedSegment ? [
        {
          command: fixture.command,
          message: `expected allowed but matched ${blockedSegment.matchedRule ?? "a rule"}`,
          trace: traceRulebookFixture(blockedSegment.tokens, rulebook.rules)
        }
      ] : [];
    }
    const firstBlockedSegment = segments2.find((segment) => segment.result);
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

// src/core/rules/policy/lockfile.ts
import { existsSync as existsSync5, readFileSync as readFileSync4 } from "node:fs";
var SHA256_DIGEST_PATTERN = /^sha256:[a-f0-9]{64}$/;
var RULEBOOK_SOURCE_KINDS = new Set(["local-directory", "github"]);
function readLockfile(path) {
  if (!existsSync5(path)) {
    return { lock: null, errors: [] };
  }
  try {
    const parsed = JSON.parse(readFileSync4(path, "utf-8"));
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
  return typeof candidate[field] === "string" && candidate[field].trim() !== "" ? [] : [`${prefix}.${field}: required string`];
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

// src/core/rules/policy/resolver.ts
import { createHash } from "node:crypto";
import { existsSync as existsSync6, readFileSync as readFileSync5 } from "node:fs";
import { join as join5 } from "node:path";
async function resolveRulebookSource(spec, configDir, options2) {
  if (isGitHubRulebookSource(spec)) {
    return resolveGitHubRulebook(spec);
  }
  return resolveLocalRulebook(spec, configDir, options2);
}
async function resolveRulebookSourceForSync(spec, configDir, options2, previousLock) {
  if (!isGitHubRulebookSource(spec) || options2.refresh) {
    return resolveRulebookSource(spec, configDir, options2);
  }
  const locked = previousLock?.rulebooks.find((entry) => entry.spec === spec);
  if (!locked || locked.kind !== "github") {
    return resolveRulebookSource(spec, configDir, options2);
  }
  return readLockedGitHubRulebook(locked, configDir, options2);
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
  if (!existsSync6(path)) {
    throw new Error(`Rulebook source not found: ${spec}`);
  }
  const content = readFileSync5(path, "utf-8");
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
async function readLockedGitHubRulebook(entry, configDir, options2) {
  const cachePath = getRulebookCachePath(entry, { ...options2, cacheConfigDir: configDir });
  if (existsSync6(cachePath)) {
    const content = readFileSync5(cachePath, "utf-8");
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
  return join5(configDir, name, RULEBOOK_FILE);
}
function sha256Digest(content) {
  return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}

// src/core/rules/policy/scope-policy.ts
function loadRulesPolicy(options2 = {}) {
  const paths = getPolicyPaths(options2);
  const sameConfigPath = isSameConfigPath(paths.userConfigPath, paths.projectConfigPath);
  const user = readRulesConfig(paths.userConfigPath);
  const project = sameConfigPath ? { config: null, errors: [] } : readRulesConfig(paths.projectConfigPath);
  const errors = [
    ...getLegacyRulesConfigErrors(paths, options2),
    ...user.errors.map((error) => `${paths.userConfigPath}: ${error}`),
    ...project.errors.map((error) => `${paths.projectConfigPath}: ${error}`)
  ];
  const userPolicy = user.config ? loadScopePolicy(user.config, paths.userLockPath, dirname6(paths.userConfigPath), options2, "user") : emptyScopePolicy();
  const projectPolicy = project.config ? loadScopePolicy(project.config, paths.projectLockPath, dirname6(paths.projectConfigPath), options2, "project") : emptyScopePolicy();
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
function getRulesConfigRuntimeErrorsForConfig(configPath, lockPath, options2) {
  const loaded = loadScopePolicyForConfig(configPath, lockPath, options2);
  if (!loaded)
    return [];
  return [...loaded.scope.errors, ...getUnknownOverrideErrorsForScope(loaded.config, loaded.scope)];
}
function loadScopePolicyForConfig(configPath, lockPath, options2) {
  const config = readRulesConfig(configPath).config;
  if (!config) {
    return null;
  }
  return {
    config,
    scope: loadScopePolicy(config, lockPath, dirname6(configPath), options2, "project")
  };
}
function getUnknownOverrideErrorsForScope(config, scope) {
  return scope.canValidateOverrides ? getUnknownOverrideErrors(config.overrides ?? {}, scope.knownRuleIds) : [];
}
function loadScopePolicy(config, lockPath, configDir, options2, source) {
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
    const loadedRulebook = loadLockedRulebook(entry, configDir, options2);
    if (loadedRulebook.errors.length > 0 || !loadedRulebook.rulebook) {
      errors.push(...loadedRulebook.errors);
      return [];
    }
    const rulebook = loadedRulebook.rulebook;
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
function loadLockedRulebook(entry, configDir, options2) {
  const errors = [];
  const cachePath = getRulebookCachePath(entry, { ...options2, cacheConfigDir: configDir });
  if (!existsSync7(cachePath)) {
    return {
      rulebook: null,
      errors: [`missing cache entry for ${entry.spec}; run ${RULE_SYNC_COMMAND}`]
    };
  }
  let cacheContent;
  try {
    cacheContent = readFileSync6(cachePath, "utf-8");
  } catch (error) {
    return {
      rulebook: null,
      errors: [
        `failed to read cached rulebook for ${entry.spec}: ${error instanceof Error ? error.message : String(error)}`
      ]
    };
  }
  if (sha256Digest(cacheContent) !== entry.digest) {
    errors.push(`cache digest mismatch for ${entry.spec}; run ${RULE_SYNC_COMMAND}`);
  }
  let rulebook = null;
  try {
    const parsed = JSON.parse(cacheContent);
    assertValidRulebook(parsed);
    rulebook = parsed;
  } catch (error) {
    errors.push(`invalid cached rulebook for ${entry.spec}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (entry.kind === "local-directory") {
    const sourcePath = resolve5(configDir, entry.path);
    const sourceRelative = relative(resolve5(configDir), sourcePath);
    if (sourceRelative === ".." || sourceRelative.startsWith(`..${sep4}`) || isAbsolute6(sourceRelative)) {
      errors.push(`lockfile local source path for ${entry.spec} must stay within ${configDir}; run ${RULE_SYNC_COMMAND}`);
      return { rulebook: null, errors };
    }
    const localPath = join6(sourcePath, RULEBOOK_FILE);
    if (!existsSync7(localPath)) {
      errors.push(`missing local source for ${entry.spec}; run ${RULE_SYNC_COMMAND}`);
    } else {
      try {
        const localContent = readFileSync6(localPath, "utf-8");
        if (sha256Digest(localContent) !== entry.digest) {
          errors.push(getLocalSourceDriftError(entry.spec, localContent));
        }
      } catch (error) {
        errors.push(`failed to read local source for ${entry.spec}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  return { rulebook: errors.length === 0 ? rulebook : null, errors };
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
function isSameConfigPath(userConfigPath, projectConfigPath) {
  if (resolve5(userConfigPath) === resolve5(projectConfigPath)) {
    return true;
  }
  if (!existsSync7(userConfigPath) || !existsSync7(projectConfigPath)) {
    return false;
  }
  try {
    return realpathSync7(userConfigPath) === realpathSync7(projectConfigPath);
  } catch {
    return false;
  }
}
function getLegacyRulesConfigErrors(paths, options2) {
  return Array.from(new Set([
    ...getLegacyRulesConfigError(getLegacyUserRulesConfigPath(options2), paths.userConfigPath, "~/.cc-safety-net/config.json"),
    ...getLegacyRulesConfigError(getLegacyProjectRulesConfigPath(options2), paths.projectConfigPath, ".safety-net.json")
  ]));
}
function getLegacyRulesConfigError(legacyPath, configPath, migratedFrom) {
  if (!existsSync7(legacyPath))
    return [];
  if (hasMigrationEvidence(configPath, migratedFrom))
    return [];
  if (!legacyRulesConfigNeedsMigration(legacyPath))
    return [];
  return [
    `legacy rules config location is no longer used; ask the user to run ${RULE_MIGRATE_COMMAND}`
  ];
}
function legacyRulesConfigNeedsMigration(legacyPath) {
  try {
    const parsed = JSON.parse(readFileSync6(legacyPath, "utf-8"));
    if (!parsed || typeof parsed !== "object")
      return true;
    const config = parsed;
    if (config.version !== 1)
      return true;
    if (config.rules === undefined)
      return false;
    if (!Array.isArray(config.rules))
      return true;
    return config.rules.length > 0;
  } catch {
    return true;
  }
}
function hasMigrationEvidence(configPath, migratedFrom) {
  const config = readRulesConfig(configPath).config;
  if (!config)
    return false;
  return config.rules.some((source) => getRulebookMigratedFrom(dirname6(configPath), source) === migratedFrom);
}
function getRulebookMigratedFrom(configDir, source) {
  if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(source))
    return null;
  const path = join6(configDir, source, RULEBOOK_FILE);
  if (!existsSync7(path))
    return null;
  try {
    const rulebook = JSON.parse(readFileSync6(path, "utf-8"));
    return typeof rulebook.migrated_from === "string" ? rulebook.migrated_from : null;
  } catch {
    return null;
  }
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

// src/core/rules/policy/sync.ts
import {
  existsSync as existsSync8,
  lstatSync as lstatSync4,
  mkdirSync as mkdirSync2,
  readdirSync,
  readFileSync as readFileSync7,
  rmdirSync,
  rmSync,
  unlinkSync,
  writeFileSync as writeFileSync2
} from "node:fs";
import { dirname as dirname7, isAbsolute as isAbsolute7, join as join7, relative as relative2, resolve as resolve6, sep as sep5 } from "node:path";
async function syncRulesConfig(options2 = {}) {
  const internalOptions = options2;
  const scope = getScopePaths(options2);
  const scopeConfig = readScopeRulesConfig(scope.configPath);
  if (!scopeConfig.ok)
    return scopeConfig.result;
  const config = scopeConfig.config;
  if (options2.check) {
    return checkRulesConfig(config, scope.configDir, scope.lockPath, options2);
  }
  try {
    const existingLockResult = readLockfile(scope.lockPath);
    if (options2.only && existingLockResult.errors.length > 0) {
      return { ok: false, errors: existingLockResult.errors, warnings: [], entries: [] };
    }
    const previousLock = existingLockResult.errors.length > 0 ? null : existingLockResult.lock;
    const selectedSpecs = options2.only ? getSelectedUpdateSpecs(config, previousLock, options2.only) : { ok: true, specs: config.rules };
    if (!selectedSpecs.ok) {
      return selectedSpecs.result;
    }
    if (options2.only && !previousLock && selectedSpecs.specs.length < config.rules.length) {
      return {
        ok: false,
        errors: [`No lockfile available for partial update; run ${RULE_SYNC_COMMAND}`],
        warnings: [],
        entries: []
      };
    }
    const resolved = (await Promise.all(selectedSpecs.specs.map((spec) => resolveRulebookSourceForSync(spec, scope.configDir, options2, previousLock)))).map((item) => preserveDisplayRef(item, previousLock, internalOptions.discoveredDisplayRefs));
    for (const item of resolved) {
      writeCache(item.content, item.entry, scope.configDir, options2);
    }
    const entries = options2.only ? mergeSelectedLockEntries(config, previousLock, resolved) : resolved.map((item) => item.entry);
    writeJsonAtomic(scope.lockPath, { version: 1, rulebooks: entries });
    const ruleCountsBySpec = new Map(resolved.map((item) => [item.entry.spec, item.rulebook.rules.length]));
    const warnings = pruneUnreferencedRulebookCaches(entries, scope.configDir, options2);
    return {
      ok: true,
      errors: [],
      warnings,
      entries: entries.map((entry) => addRuleCount(entry, ruleCountsBySpec))
    };
  } catch (error) {
    return failWithError(error);
  }
}
async function testRulebookSources(sources, options2 = {}) {
  const scope = getScopePaths(options2);
  try {
    const resolved = await Promise.all(sources.map((spec) => resolveRulebookSource(spec, scope.configDir, options2)));
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
      warnings: [],
      entries: resolved.map((item) => ({
        ...addRuleCount(item.entry, ruleCountsBySpec),
        testCount: testCountsBySpec.get(item.entry.spec)
      }))
    };
  } catch (error) {
    return failWithError(error);
  }
}
async function addRulebookSource(source, options2 = {}) {
  const scope = getScopePaths(options2);
  mkdirSync2(scope.configDir, { recursive: true });
  const before = existsSync8(scope.configPath) ? readFileSync7(scope.configPath, "utf-8") : null;
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
      warnings: [],
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
    ...options2,
    discoveredDisplayRefs: new Map(discoveredSources.filter((item) => !!item.display_ref).map((item) => [item.spec, item.display_ref]))
  });
  if (!result.ok) {
    restoreConfig(scope.configPath, before);
  }
  return result;
}
async function removeRulebookSource(match, options2 = {}) {
  const internalOptions = options2;
  const scope = getScopePaths(options2);
  const loaded = readRulesConfig(scope.configPath);
  if (loaded.errors.length > 0) {
    return { ok: false, errors: loaded.errors, warnings: [], entries: [] };
  }
  if (!loaded.config) {
    return {
      ok: false,
      errors: [`No config found at ${scope.configPath}`],
      warnings: [],
      entries: []
    };
  }
  const lockResult = readLockfile(scope.lockPath);
  if (lockResult.errors.length > 0) {
    return { ok: false, errors: lockResult.errors, warnings: [], entries: [] };
  }
  const matches = getRemoveMatches(loaded.config.rules, lockResult.lock, match);
  if (!matches.ok)
    return matches.result;
  const sourceDirs = options2.deleteSource ? getLocalSourceDirsForDelete(scope.configDir, matches.specs, lockResult.lock) : { ok: true, dirs: [] };
  if (!sourceDirs.ok)
    return sourceDirs.result;
  const before = readFileSync7(scope.configPath, "utf-8");
  writeJsonAtomic(scope.configPath, {
    version: 1,
    rules: loaded.config.rules.filter((spec) => !matches.specs.includes(spec)),
    overrides: loaded.config.overrides ?? {}
  });
  const result = await syncRulesConfig(options2);
  if (!result.ok) {
    restoreConfig(scope.configPath, before);
    return result;
  }
  const deleteResult = deleteLocalSourceDirs(sourceDirs.dirs, internalOptions);
  if (!deleteResult.ok) {
    restoreConfig(scope.configPath, before);
    const rollback = await syncRulesConfig(options2);
    if (!rollback.ok) {
      return {
        ok: false,
        errors: [...deleteResult.result.errors, ...rollback.errors],
        warnings: rollback.warnings,
        entries: rollback.entries
      };
    }
    return deleteResult.result;
  }
  return result;
}
function repairLocalRulesPolicy(options2 = {}) {
  repairLocalRulesScope({ ...options2, global: true });
  repairLocalRulesScope({ ...options2, global: false });
}
async function checkRulesConfig(config, configDir, lockPath, options2) {
  const result = loadScopePolicy(config, lockPath, configDir, options2, "project");
  return {
    ok: result.errors.length === 0,
    errors: result.errors,
    warnings: [],
    entries: result.entries
  };
}
function repairLocalRulesScope(options2) {
  const scope = getScopePaths(options2);
  const loaded = readRulesConfig(scope.configPath);
  if (!loaded.config || loaded.errors.length > 0 || loaded.config.rules.length === 0) {
    return;
  }
  if (!loaded.config.rules.every((spec) => /^[a-zA-Z0-9_-]{1,64}$/.test(spec))) {
    return;
  }
  try {
    const resolved = loaded.config.rules.map((spec) => resolveLocalRulebook(spec, scope.configDir, options2));
    for (const item of resolved) {
      writeCache(item.content, item.entry, scope.configDir, options2);
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
function writeCache(content, entry, configDir, options2) {
  const path = getRulebookCachePath(entry, { ...options2, cacheConfigDir: configDir });
  mkdirSync2(dirname7(path), { recursive: true });
  writeFileSync2(path, content, "utf-8");
}
function pruneUnreferencedRulebookCaches(entries, configDir, options2) {
  const internalOptions = options2;
  const cacheRoot = join7(dirname7(configDir), "cache", "rulebooks");
  if (!existsSync8(cacheRoot))
    return [];
  const keep = new Set(entries.map((entry) => dirname7(getRulebookCachePath(entry, { ...options2, cacheConfigDir: configDir }))));
  return readdirSync(cacheRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).flatMap((entry) => {
    const path = join7(cacheRoot, entry.name);
    if (keep.has(path))
      return [];
    try {
      pruneRulebookCacheDir(path, internalOptions);
      return [];
    } catch (error) {
      return [
        `Failed to prune rulebook cache entry ${path}: ${error instanceof Error ? error.message : String(error)}`
      ];
    }
  });
}
function getLocalSourceDirsForDelete(configDir, specs, lock) {
  const entriesBySpec = new Map(lock?.rulebooks.map((entry) => [entry.spec, entry]) ?? []);
  const errors = specs.flatMap((spec) => {
    const entry = entriesBySpec.get(spec);
    if (!entry) {
      return NAME_PATTERN.test(spec) ? [] : ["--delete-source can only delete local rulebook sources"];
    }
    return entry.kind === "local-directory" ? [] : ["--delete-source can only delete local rulebook sources"];
  });
  const dirs = specs.map((spec) => {
    const entry = entriesBySpec.get(spec);
    return join7(configDir, entry?.kind === "local-directory" ? entry.path : spec);
  });
  const dirErrors = errors.length > 0 ? [] : dirs.flatMap((dir) => getLocalSourceDirDeleteError(configDir, dir));
  const allErrors = [...errors, ...dirErrors];
  return allErrors.length > 0 ? { ok: false, result: { ok: false, errors: allErrors, warnings: [], entries: [] } } : { ok: true, dirs };
}
function getLocalSourceDirDeleteError(configDir, dir) {
  const resolvedConfigDir = resolve6(configDir);
  const resolvedDir = resolve6(dir);
  const relativeDir = relative2(resolvedConfigDir, resolvedDir);
  if (relativeDir === "" || relativeDir === ".." || relativeDir.startsWith(`..${sep5}`) || isAbsolute7(relativeDir)) {
    return [`Refusing to delete local rulebook source outside ${configDir}: ${dir}`];
  }
  if (!existsSync8(resolvedDir))
    return [`Local rulebook source directory not found: ${dir}`];
  if (!lstatSync4(resolvedDir).isDirectory()) {
    return [`Local rulebook source is not a directory: ${dir}`];
  }
  const entries = readdirSync(resolvedDir);
  if (!entries.includes("rulebook.json")) {
    return [`Local rulebook source directory is missing rulebook.json: ${dir}`];
  }
  if (!lstatSync4(join7(resolvedDir, "rulebook.json")).isFile()) {
    return [`Local rulebook source rulebook.json is not a file: ${dir}`];
  }
  if (entries.length > 1) {
    return [
      `Local rulebook source directory contains extra files: ${dir}. delete manually if you really want to remove the directory.`
    ];
  }
  return [];
}
function deleteLocalSourceDirs(dirs, options2) {
  const errors = dirs.flatMap((dir) => {
    try {
      deleteLocalSourceDir(dir, options2);
      return [];
    } catch (error) {
      return [
        `Failed to delete local rulebook source ${dir}: ${error instanceof Error ? error.message : String(error)}`
      ];
    }
  });
  return errors.length > 0 ? { ok: false, result: { ok: false, errors, warnings: [], entries: [] } } : { ok: true };
}
function pruneRulebookCacheDir(path, options2) {
  if (options2._testPruneRulebookCacheDir) {
    options2._testPruneRulebookCacheDir(path);
    return;
  }
  rmSync(path, { recursive: true, force: true });
}
function deleteLocalSourceDir(dir, options2) {
  if (options2._testDeleteLocalSourceDir) {
    options2._testDeleteLocalSourceDir(dir);
    return;
  }
  unlinkSync(join7(dir, "rulebook.json"));
  rmdirSync(dir);
}
function restoreConfig(path, content) {
  if (content === null) {
    rmSync(path, { force: true });
    return;
  }
  writeFileSync2(path, content, "utf-8");
}
function failWithError(error) {
  return {
    ok: false,
    errors: [error instanceof Error ? error.message : String(error)],
    warnings: [],
    entries: []
  };
}

// src/core/config.ts
function loadConfig(cwd, options2) {
  const safeCwd = typeof cwd === "string" ? cwd : process.cwd();
  if (options2?.repairLocalRulebooks) {
    repairLocalRulesPolicy({ cwd: safeCwd, userConfigDir: options2.userConfigDir });
  }
  return rulesPolicyToConfig(loadRulesPolicy({ cwd: safeCwd, userConfigDir: options2?.userConfigDir }));
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
        errors.push(...validateCustomRule(cfg.rules[i], i, ruleNames));
      }
    }
  }
  return { errors, ruleNames };
}
function validateConfigFile(path) {
  return validateParsedConfigFile(path, validateConfig);
}
function readConfigFileInput(path) {
  const errors = [];
  const ruleNames = new Set;
  if (!existsSync9(path)) {
    errors.push(`File not found: ${path}`);
    return { ok: false, result: { errors, ruleNames } };
  }
  try {
    const content = readFileSync8(path, "utf-8");
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
function getLegacyProjectConfigPath(cwd) {
  return resolve7(cwd ?? process.cwd(), ".safety-net.json");
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

// src/core/analyze/index.ts
function analyzeCommand(command2, options2 = {}) {
  const config = options2.config ?? loadConfig(options2.cwd);
  return analyzeCommandInternal(command2, 0, { ...options2, config });
}

// src/core/audit.ts
import { appendFileSync, existsSync as existsSync10, mkdirSync as mkdirSync3 } from "node:fs";
import { homedir as homedir3 } from "node:os";
import { join as join8 } from "node:path";
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
function writeAuditLog(sessionId, command2, segment, reason, cwd, options2 = {}) {
  const safeSessionId = sanitizeSessionIdForFilename(sessionId);
  if (!safeSessionId) {
    return;
  }
  const home = options2.homeDir ?? process.env.HOME ?? homedir3();
  const logsDir = join8(home, ".cc-safety-net", "logs");
  try {
    if (!existsSync10(logsDir)) {
      mkdirSync3(logsDir, { recursive: true });
    }
    const logFile = join8(logsDir, `${safeSessionId}.jsonl`);
    const entry = {
      ts: new Date().toISOString(),
      decision: options2.decision ?? "deny",
      command: redactSecrets(command2).slice(0, 300),
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
  result = result.replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, "<redacted>");
  result = result.replace(/\b((?:DATABASE|POSTGRES|POSTGRESQL|MYSQL|MARIADB|REDIS|MONGO(?:DB)?|DB)_URL)=([^\s]+)/gi, "$1=<redacted>");
  result = result.replace(/\b([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PASS|KEY|CREDENTIALS)[A-Z0-9_]*)=([^\s]+)/gi, "$1=<redacted>");
  result = result.replace(/(['"]?\s*(?:authorization|cookie|x-api-key|api-key)\s*:\s*)([^'"\r\n]+)(['"]?)/gi, "$1<redacted>$3");
  result = result.replace(/(['"]?\s*authorization\s*:\s*)([^'"]+)(['"]?)/gi, "$1<redacted>$3");
  result = result.replace(/(authorization\s*:\s*)([^\s"']+)(\s+[^\s"']+)?/gi, "$1<redacted>");
  result = result.replace(/\b([a-z][a-z0-9+.-]*:\/\/)([^\s/:@]+):([^\s@/]+)@/gi, "$1<redacted>:<redacted>@");
  result = result.replace(/\b([a-z][a-z0-9+.-]*:\/\/)([^\s/@:]+)@/gi, "$1<redacted>@");
  result = result.replace(/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g, "<redacted>");
  result = result.replace(/\bxoxb-[A-Za-z0-9-]{20,}\b/g, "<redacted>");
  result = result.replace(/\bnpm_[A-Za-z0-9_]{20,}\b/g, "<redacted>");
  result = result.replace(/\b[rs]k_(?:live|test)_[A-Za-z0-9_]{20,}\b/g, "<redacted>");
  result = result.replace(/\bpypi-[A-Za-z0-9_-]{20,}\b/g, "<redacted>");
  result = result.replace(/\b[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{6,}\b/g, "<redacted>");
  result = result.replace(/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g, "<redacted>");
  return result;
}

// src/core/format.ts
function formatBlockedMessage(input) {
  const { reason, command: command2, segment } = input;
  const maxLen = input.maxLen ?? 200;
  const redact = input.redact ?? ((t) => t);
  let message = `BLOCKED by CC Safety Net

Reason: ${reason}`;
  if (command2) {
    const safeCommand = redact(command2);
    message += `

Command: ${excerpt(safeCommand, maxLen)}`;
  }
  if (segment && segment !== command2) {
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

// src/bin/hook/common.ts
var REASON_SAFETY_NET_FAILED_CLOSED = "CC Safety Net failed closed because command analysis failed unexpectedly.";
function outputHookDeny(createDenyOutput, reason, command2, segment, manualPermissionAdvice) {
  console.log(JSON.stringify(createDenyOutput(formatBlockedMessage({
    reason,
    command: command2,
    segment,
    redact: redactSecrets,
    manualPermissionAdvice
  }))));
}
async function readHookInput(outputDeny) {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const inputText = Buffer.concat(chunks).toString("utf-8").trim();
  if (!inputText) {
    outputDeny("Missing hook input JSON.");
    return null;
  }
  return parseHookJson(inputText, outputDeny, "Failed to parse hook input JSON.");
}
function parseHookJson(inputText, outputDeny, strictReason) {
  try {
    return JSON.parse(inputText);
  } catch {
    outputDeny(strictReason);
    return null;
  }
}
function analyzeHookCommand(command2, cwd) {
  const paranoidAll = envTruthy(ENV_FLAGS.paranoid);
  return analyzeCommand(command2, {
    cwd,
    config: loadConfig(cwd, { repairLocalRulebooks: true }),
    strict: envTruthy(ENV_FLAGS.strict),
    paranoidRm: paranoidAll || envTruthy(ENV_FLAGS.paranoidRm),
    paranoidInterpreters: paranoidAll || envTruthy(ENV_FLAGS.paranoidInterpreters),
    worktreeMode: envTruthy(ENV_FLAGS.worktree)
  });
}
function handleBlockedHookCommand(command2, cwd, sessionId, outputDeny) {
  let result;
  try {
    result = analyzeHookCommand(command2, cwd);
  } catch (error) {
    if (envTruthy(ENV_FLAGS.debug)) {
      console.error(`CC Safety Net debug: hook analysis failed: ${redactSecrets(error instanceof Error ? error.message : String(error))}`);
    }
    outputDeny(REASON_SAFETY_NET_FAILED_CLOSED, command2, command2);
    return;
  }
  if (!result) {
    if (sessionId && envTruthy(ENV_FLAGS.debug)) {
      writeAuditLog(sessionId, command2, command2, "allowed", cwd, { decision: "allow" });
    }
    return;
  }
  if (sessionId) {
    writeAuditLog(sessionId, command2, result.segment, result.reason, cwd);
  }
  outputDeny(result.reason, command2, result.segment);
}
async function runHookAdapter(adapter) {
  const input = await readHookInput(adapter.outputDeny);
  if (!input) {
    return;
  }
  if (!adapter.isSupported(input)) {
    return;
  }
  const command2 = adapter.getCommand(input, adapter.outputDeny);
  if (!command2) {
    return;
  }
  handleBlockedHookCommand(command2, adapter.getCwd(input) ?? process.cwd(), adapter.getSessionId(input), adapter.outputDeny);
}
async function runConfiguredHookAdapter(adapter) {
  const outputDeny = (reason, command2, segment, manualPermissionAdvice) => outputHookDeny(adapter.createDenyOutput, reason, command2, segment, manualPermissionAdvice ?? adapter.getManualPermissionAdvice?.(reason));
  await runHookAdapter({
    outputDeny,
    isSupported: adapter.isSupported,
    getCommand: adapter.getCommand,
    getCwd: adapter.getCwd,
    getSessionId: adapter.getSessionId
  });
}

// src/bin/hook/constants.ts
var CLAUDE_CODE_HOOK_EVENT = "PreToolUse";
var CLAUDE_CODE_TOOL_NAME = "Bash";
var GEMINI_CLI_HOOK_EVENT = "BeforeTool";
var GEMINI_CLI_TOOL_NAME = "run_shell_command";
var KIMI_CODE_HOOK_EVENT = "PreToolUse";
var KIMI_CODE_TOOL_NAME = "Bash";

// src/bin/hook/claude-code.ts
async function runClaudeCodeHook() {
  await runConfiguredHookAdapter({
    createDenyOutput: (message) => ({
      hookSpecificOutput: {
        hookEventName: CLAUDE_CODE_HOOK_EVENT,
        permissionDecision: "deny",
        permissionDecisionReason: message
      }
    }),
    getManualPermissionAdvice: (reason) => reason.includes("rule sync") ? false : undefined,
    isSupported: (input) => input.tool_name === CLAUDE_CODE_TOOL_NAME,
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id
  });
}

// src/bin/hook/copilot-cli.ts
async function runCopilotCliHook() {
  await runConfiguredHookAdapter({
    createDenyOutput: (message) => ({
      permissionDecision: "deny",
      permissionDecisionReason: message
    }),
    isSupported: (input) => input.toolName === "bash",
    getCommand: (input, outputDeny) => parseHookJson(input.toolArgs, outputDeny, "Failed to parse toolArgs JSON.")?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => `copilot-${input.timestamp ?? Date.now()}`
  });
}

// src/bin/hook/gemini-cli.ts
async function runGeminiCLIHook() {
  await runConfiguredHookAdapter({
    createDenyOutput: (message) => ({
      decision: "deny",
      reason: message,
      systemMessage: message
    }),
    isSupported: (input) => input.hook_event_name === GEMINI_CLI_HOOK_EVENT && input.tool_name === GEMINI_CLI_TOOL_NAME,
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id
  });
}

// src/bin/hook/kimi-code.ts
async function runKimiCodeHook() {
  await runConfiguredHookAdapter({
    createDenyOutput: (message) => ({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: message
      }
    }),
    isSupported: (input) => input.hook_event_name === KIMI_CODE_HOOK_EVENT && input.tool_name === KIMI_CODE_TOOL_NAME,
    getCommand: (input) => input.tool_input?.command,
    getCwd: (input) => input.cwd,
    getSessionId: (input) => input.session_id
  });
}

// src/bin/integration-metadata.ts
var integrationMetadata = [
  {
    id: "claude-code",
    displayName: "Claude Code",
    doctorVisible: true,
    runtimeHook: {
      flags: ["-cc", "--claude-code"],
      description: "Run as Claude Code PreToolUse hook",
      legacyTopLevel: true,
      order: 1
    }
  },
  {
    id: "codex",
    displayName: "Codex",
    doctorVisible: true
  },
  {
    id: "copilot-cli",
    displayName: "Copilot CLI",
    doctorVisible: true,
    runtimeHook: {
      flags: ["-cp", "--copilot-cli"],
      description: "Run as Copilot CLI PreToolUse hook",
      legacyTopLevel: true,
      order: 2
    }
  },
  {
    id: "gemini-cli",
    displayName: "Gemini CLI",
    doctorVisible: true,
    runtimeHook: {
      flags: ["-gc", "--gemini-cli"],
      description: "Run as Gemini CLI BeforeTool hook",
      legacyTopLevel: true,
      order: 3
    }
  },
  {
    id: "kimi-code",
    displayName: "Kimi Code",
    doctorVisible: true,
    runtimeHook: {
      flags: ["-kc", "--kimi-code"],
      description: "Run as Kimi Code PreToolUse hook",
      legacyTopLevel: false,
      order: 4
    }
  },
  {
    id: "opencode",
    displayName: "OpenCode",
    doctorVisible: true
  },
  {
    id: "pi",
    displayName: "Pi",
    doctorVisible: true
  }
];
var doctorIntegrationOrder = integrationMetadata.filter((integration) => integration.doctorVisible).map((integration) => integration.id);
var runtimeHookIntegrationMetadata = integrationMetadata.filter((integration) => ("runtimeHook" in integration)).toSorted((a, b) => a.runtimeHook.order - b.runtimeHook.order).map((integration) => ({
  id: integration.id,
  displayName: integration.displayName,
  flags: integration.runtimeHook.flags,
  description: integration.runtimeHook.description,
  legacyTopLevel: integration.runtimeHook.legacyTopLevel
}));
function getIntegrationDisplayName(id) {
  return integrationMetadata.find((integration) => integration.id === id)?.displayName ?? id;
}

// src/bin/hook/integrations.ts
var hookRunners = {
  "claude-code": runClaudeCodeHook,
  "copilot-cli": runCopilotCliHook,
  "gemini-cli": runGeminiCLIHook,
  "kimi-code": runKimiCodeHook
};
var hookIntegrations = runtimeHookIntegrationMetadata.map((integration) => ({
  ...integration,
  run: hookRunners[integration.id]
}));
function findHookIntegrationByFlag(args) {
  return hookIntegrations.find((integration) => integration.flags.some((flag) => args.includes(flag)));
}
function findLegacyTopLevelHookIntegration(flag) {
  return hookIntegrations.find((integration) => integration.legacyTopLevel && integration.flags.some((integrationFlag) => integrationFlag === flag));
}

// src/bin/commands/hook.ts
var platformOptions = hookIntegrations.map((integration) => ({
  flags: integration.flags.join(", "),
  description: integration.description
}));
var platformExamples = hookIntegrations.flatMap((integration) => integration.flags.map((flag) => `cc-safety-net hook ${flag}`));
var hookCommand = {
  name: "hook",
  description: "Run as an agent CLI hook (reads JSON from stdin)",
  usage: "hook <coding cli>",
  subcommands: [
    { usage: "install --kimi-code", description: "Install Kimi Code hook config" },
    { usage: "uninstall --kimi-code", description: "Uninstall Kimi Code hook config" }
  ],
  options: [
    ...platformOptions,
    {
      flags: "-h, --help",
      description: "Show this help"
    }
  ],
  examples: [...platformExamples, "cc-safety-net hook install --kimi-code"]
};

// src/bin/commands/rule.ts
var ruleCommand = {
  name: "rule",
  description: "Manage CC Safety Net rulebook sources",
  usage: "rule <subcommand>",
  subcommands: [
    { usage: "init", description: "Create starter rule config and rulebook files" },
    { usage: "add <source>", description: "Add a rulebook source and sync" },
    { usage: "remove <source>", description: "Remove a rulebook source and sync" },
    { usage: "update [source]", description: "Refresh rulebook lock/cache state" },
    { usage: "sync", description: "Sync configured rulebooks" },
    { usage: "list", description: "List active rulebooks" },
    { usage: "test [source]", description: "Run rulebook fixtures" },
    { usage: "migrate [--cleanup]", description: "Migrate legacy inline rules" },
    { usage: "doc", description: "Print the rulebook authoring guide" },
    { usage: "verify", description: "Validate rule config files" }
  ],
  options: [
    { flags: "-g, --global", description: "Use user-scope rule config" },
    { flags: "--check", description: "Check without changing lock/cache state" },
    { flags: "--cleanup", description: "Delete legacy files after rule migrate verifies them" },
    { flags: "--delete-source", description: "Delete clean local source directory on remove" },
    { flags: "-h, --help", description: "Show this help" }
  ],
  examples: [
    "cc-safety-net rule init",
    "cc-safety-net rule add project-rules",
    "cc-safety-net rule sync",
    "cc-safety-net rule migrate --cleanup",
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

// src/bin/commands/index.ts
var commands = [
  doctorCommand,
  explainCommand,
  ruleCommand,
  hookCommand,
  statuslineCommand
];
function getCommandAliases(command2) {
  return command2.aliases ?? [];
}
function isVisibleCommand(command2) {
  return !command2.hidden;
}
function findCommand(nameOrAlias) {
  const normalized = nameOrAlias.toLowerCase();
  return commands.find((cmd) => cmd.name.toLowerCase() === normalized || getCommandAliases(cmd).some((alias) => alias.toLowerCase() === normalized));
}
function getVisibleCommands() {
  return commands.filter(isVisibleCommand);
}

// src/bin/doctor/activity.ts
import { existsSync as existsSync11, readdirSync as readdirSync2, readFileSync as readFileSync9 } from "node:fs";
import { homedir as homedir4 } from "node:os";
import { join as join9 } from "node:path";
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
function getActivitySummary(days = 7, logsDir = join9(homedir4(), ".cc-safety-net", "logs")) {
  if (!existsSync11(logsDir)) {
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
    files = readdirSync2(logsDir).filter((f) => f.endsWith(".jsonl"));
  } catch {
    return { totalBlocked: 0, sessionCount: 0, recentEntries: [] };
  }
  for (const file of files) {
    try {
      const content = readFileSync9(join9(logsDir, file), "utf-8");
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
import { existsSync as existsSync12 } from "node:fs";
import { dirname as dirname8 } from "node:path";
function getConfigSourceInfo(path, lockPath, userConfigDir) {
  if (!existsSync12(path)) {
    return { path, exists: false, valid: false, ruleCount: 0 };
  }
  const validation = validateRulesConfigFile(path);
  validation.errors.push(...getRulesConfigRuntimeErrorsForConfig(path, lockPath, { userConfigDir }));
  return {
    path,
    exists: true,
    valid: validation.errors.length === 0,
    ruleCount: validation.ruleNames.size,
    ...validation.errors.length > 0 ? { errors: validation.errors } : {}
  };
}
function toEffectiveRule(rule, source) {
  return {
    source,
    name: rule.name,
    command: rule.command,
    subcommand: rule.subcommand,
    blockArgs: rule.block_args,
    reason: rule.reason
  };
}
function getConfigInfo(cwd, options2) {
  const userPath = options2?.userConfigPath ?? getUserRulesConfigPath();
  const projectPath = options2?.projectConfigPath ?? getProjectRulesConfigPath(cwd);
  const userConfigDir = dirname8(userPath);
  const policy = loadRulesPolicy({
    cwd,
    userConfigPath: userPath,
    projectConfigPath: projectPath,
    userConfigDir
  });
  const rulebookSources = new Map(policy.rulebooks.flatMap((rulebook) => rulebook.rules.map((rule) => [rule, rulebook.source])));
  return {
    userConfig: getConfigSourceInfo(userPath, getUserRulesLockPath({ userConfigPath: userPath }), userConfigDir),
    projectConfig: getConfigSourceInfo(projectPath, getRulesLockPathForConfigPath(projectPath), userConfigDir),
    effectiveRules: policy.rules.map((rule) => toEffectiveRule(rule, rulebookSources.get(rule.name) ?? "project")),
    shadowedRules: []
  };
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
function formatAsciiTable(options2) {
  const rawRows = options2.rawRows ?? options2.rows;
  const colWidths = (options2.headers ?? rawRows[0] ?? []).map((h, i) => {
    const maxDataWidth = Math.max(...rawRows.map((r) => r[i]?.length ?? 0));
    return Math.max(h.length, maxDataWidth);
  });
  const pad = (s, w, raw) => s + " ".repeat(Math.max(0, w - raw.length));
  const line = (char, corners) => corners[0] + colWidths.map((w) => char.repeat(w + 2)).join(corners[1]) + corners[2];
  const formatRow = (cells, rawCells) => `│ ${cells.map((c, i) => pad(c, colWidths[i] ?? 0, rawCells[i] ?? "")).join(" │ ")} │`;
  const headerLines = options2.headers ? [`   ${formatRow(options2.headers, options2.headers)}`, `   ${line("─", ["├", "┼", "┤"])}`] : [];
  return [
    `   ${line("─", ["┌", "┬", "┐"])}`,
    ...headerLines,
    ...options2.rows.map((r, i) => `   ${formatRow(r, rawRows[i] ?? [])}`),
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
    const platformName = getIntegrationDisplayName(hook.platform);
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
    const platformName = getIntegrationDisplayName(h.platform);
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
    { label: "Codex", value: system.codexCliVersion },
    { label: "Copilot CLI", value: system.copilotCliVersion },
    { label: "Gemini CLI", value: system.geminiCliVersion },
    { label: "Kimi Code", value: system.kimiCodeVersion },
    { label: "OpenCode", value: system.openCodeVersion },
    { label: "Pi", value: system.piCliVersion },
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
import { existsSync as existsSync13, readdirSync as readdirSync3, readFileSync as readFileSync10 } from "node:fs";
import { homedir as homedir5, tmpdir as tmpdir3 } from "node:os";
import { join as join10 } from "node:path";
var COPILOT_PLUGIN_CONFIG_PATH = "copilot-plugin";
var CLAUDE_PLUGIN_LIST_CONFIG_PATH = "claude plugin list";
var CLAUDE_SAFETY_NET_PLUGIN_ID = "safety-net@cc-marketplace";
var GEMINI_EXTENSIONS_LIST_CONFIG_PATH = "gemini extensions list";
var GEMINI_SAFETY_NET_SOURCE = "https://github.com/kenryu42/gemini-safety-net";
var KIMI_HOOK_COMMAND_PATTERN = /cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;
var CODEX_PLUGIN_HOOKS_WARNING = "Codex plugin hooks are behind a feature flag. Add `plugin_hooks = true` under [features] in $CODEX_HOME/config.toml.";
var CODEX_SAFETY_NET_PLUGIN_ID = "safety-net@cc-marketplace";
var SELF_TEST_CASES = [
  { command: "git reset --hard", description: "git reset --hard", expectBlocked: true },
  { command: "rm -rf /", description: "rm -rf /", expectBlocked: true },
  { command: "rm -rf ./node_modules", description: "rm in cwd (safe)", expectBlocked: false }
];
var SELF_TEST_CONFIG = { version: 1, rules: [] };
function runSelfTest() {
  const selfTestCwd = join10(tmpdir3(), "cc-safety-net-self-test");
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
  const configDir = join10(homeDir, ".config", "opencode");
  const candidates = ["opencode.json", "opencode.jsonc"];
  for (const filename of candidates) {
    const configPath = join10(configDir, filename);
    if (existsSync13(configPath)) {
      try {
        const content = readFileSync10(configPath, "utf-8");
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
function _getKimiConfigPath(homeDir) {
  return join10(process.env.KIMI_CODE_HOME || join10(homeDir, ".kimi-code"), "config.toml");
}
function detectKimiCode(homeDir) {
  const configPath = _getKimiConfigPath(homeDir);
  if (!existsSync13(configPath)) {
    return { platform: "kimi-code", status: "n/a", configPath };
  }
  try {
    if (!KIMI_HOOK_COMMAND_PATTERN.test(readFileSync10(configPath, "utf-8"))) {
      return { platform: "kimi-code", status: "n/a", configPath };
    }
  } catch (e) {
    return {
      platform: "kimi-code",
      status: "n/a",
      configPath,
      errors: [`Failed to read ${configPath}: ${e instanceof Error ? e.message : String(e)}`]
    };
  }
  return {
    platform: "kimi-code",
    status: "configured",
    method: "hook config",
    configPath,
    selfTest: runSelfTest()
  };
}
function detectPi(probe) {
  if (!probe || probe.status === "unavailable") {
    return { platform: "pi", status: "n/a" };
  }
  if (probe.status === "error") {
    return {
      platform: "pi",
      status: "n/a",
      method: "pi probe",
      errors: [probe.error ?? "Pi probe failed"]
    };
  }
  if (!probe.installedAndEnabled) {
    return { platform: "pi", status: "n/a", method: "pi probe" };
  }
  const configPaths = probe.matched.map((resource) => resource.path).filter((path) => typeof path === "string");
  return {
    platform: "pi",
    status: "configured",
    method: "pi probe",
    configPath: configPaths[0],
    configPaths: configPaths.length > 0 ? configPaths : undefined,
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
  return process.env.CODEX_HOME || join10(homeDir, ".codex");
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
    return _parseCodexConfig(readFileSync10(configPath, "utf-8"));
  } catch (e) {
    errors.push(`Failed to read ${configPath}: ${e instanceof Error ? e.message : String(e)}`);
    return {};
  }
}
function detectCodex(homeDir) {
  const codexHome = _getCodexHome(homeDir);
  const pluginCachePath = join10(codexHome, "plugins", "cache", "cc-marketplace", "safety-net");
  const errors = [];
  if (!existsSync13(pluginCachePath)) {
    return { platform: "codex", status: "n/a", configPath: pluginCachePath };
  }
  try {
    if (readdirSync3(pluginCachePath).length === 0) {
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
  const configPath = join10(codexHome, "config.toml");
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
function _isSafetyNetCopilotCommand(command2) {
  if (!command2?.includes("cc-safety-net"))
    return false;
  return /(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(command2);
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
  return process.env.COPILOT_HOME || join10(homeDir, ".copilot");
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
    return JSON.parse(stripJsonComments(readFileSync10(configPath, "utf-8")));
  } catch (e) {
    errors?.push(`Failed to parse ${configPath}: ${e instanceof Error ? e.message : String(e)}`);
    return;
  }
}
function _listJsonFiles(dirPath, errors) {
  try {
    return readdirSync3(dirPath).filter((name) => name.endsWith(".json")).sort((a, b) => a.localeCompare(b));
  } catch (e) {
    errors?.push(`Failed to read ${dirPath}: ${e instanceof Error ? e.message : String(e)}`);
    return [];
  }
}
function _collectSafetyNetCopilotHookFiles(dirPath, errors) {
  if (!existsSync13(dirPath))
    return [];
  const matches = [];
  for (const filename of _listJsonFiles(dirPath, errors)) {
    const configPath = join10(dirPath, filename);
    const config = _readCopilotConfigFile(configPath, errors);
    if (config && _hasSafetyNetCopilotHook(config)) {
      matches.push(configPath);
    }
  }
  return matches;
}
function _collectCopilotInlineConfig(configPath, errors) {
  if (!existsSync13(configPath))
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
  const repoHookDir = join10(cwd, ".github", "hooks");
  const userHookDir = join10(configHome, "hooks");
  const repoConfigDir = join10(cwd, ".github", "copilot");
  const inlineSupport = _supportsCopilotInlineHooks(copilotCliVersion);
  const inlineErrors = inlineSupport === true ? errors : undefined;
  const inlineSources = {
    userConfig: _collectCopilotInlineConfig(join10(configHome, "config.json"), inlineErrors),
    repoSettings: _collectCopilotInlineConfig(join10(repoConfigDir, "settings.json"), inlineErrors),
    localSettings: _collectCopilotInlineConfig(join10(repoConfigDir, "settings.local.json"), inlineErrors)
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
  const userHookFiles = existsSync13(userHookDir) ? _listJsonFiles(userHookDir, userHookErrors) : [];
  const userHookPaths = [];
  for (const filename of userHookFiles) {
    const configPath = join10(userHookDir, filename);
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
function detectAllHooks(cwd, options2) {
  const homeDir = options2?.homeDir ?? homedir5();
  const detectCopilotCLI = () => {
    const errors = [];
    const hooksCheck = _checkCopilotEnabled(homeDir, cwd, options2?.copilotCliVersion, errors);
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
    if (options2?.copilotPluginInstalled === true || hooksCheck.activeConfigPaths.length > 0) {
      const viaPlugin = options2?.copilotPluginInstalled === true;
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
  return doctorIntegrationOrder.map((platform) => {
    switch (platform) {
      case "claude-code":
        return detectClaudeCode(options2?.claudePluginListOutput);
      case "opencode":
        return detectOpenCode(homeDir);
      case "gemini-cli":
        return detectGeminiCLI(options2?.geminiExtensionsListOutput);
      case "copilot-cli":
        return detectCopilotCLI();
      case "kimi-code":
        return detectKimiCode(homeDir);
      case "pi":
        return detectPi(options2?.piSafetyNetProbe);
      case "codex":
        return detectCodex(homeDir);
    }
    return platform;
  });
}

// src/bin/doctor/system-info.ts
import { spawn } from "node:child_process";
import { existsSync as existsSync14 } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir as tmpdir4 } from "node:os";
import { delimiter, extname, join as join11 } from "node:path";
var CURRENT_VERSION = "1.0.5";
var VERSION_FETCH_TIMEOUT_MS = 2000;
var PI_PROBE_TIMEOUT_MS = 5000;
var PI_SENTINEL_COMMAND = "cc-safety-net";
var PI_PROBE_COMMAND = "__cc_safety_net_probe";
var TEST_SPAWN_PLATFORM_ENV = "_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";
var PI_PROBE_UNAVAILABLE = {
  status: "unavailable",
  installedAndEnabled: false,
  matched: []
};
function getPackageVersion() {
  return CURRENT_VERSION;
}
var COPILOT_PLUGIN_ID = "copilot-safety-net";
function getEnvValue(env, name) {
  const direct = env[name];
  if (direct)
    return direct;
  const matchingName = Object.keys(env).find((key) => key.toLowerCase() === name.toLowerCase() && !!env[key]);
  return matchingName ? env[matchingName] : direct;
}
function getWindowsExecutableExtensions(env) {
  return (getEnvValue(env, "PATHEXT") || ".COM;.EXE;.BAT;.CMD").split(";").filter((extension) => extension.length > 0);
}
function resolveWindowsCommand(command2, env) {
  const candidates = extname(command2) ? [command2] : [
    ...getWindowsExecutableExtensions(env).map((extension) => `${command2}${extension}`),
    command2
  ];
  if (command2.includes("/") || command2.includes("\\")) {
    return candidates.find((candidate) => existsSync14(candidate)) ?? command2;
  }
  return (getEnvValue(env, "PATH") ?? "").split(delimiter).flatMap((dir) => candidates.map((candidate) => join11(dir, candidate))).find((candidate) => existsSync14(candidate)) ?? command2;
}
function quoteWindowsCommandArg(value) {
  if (!/[\s"&|<>^]/.test(value))
    return value;
  return `"${value.replace(/"/g, '""')}"`;
}
function getSpawnCommand(args, env) {
  const [command2, ...rest] = args;
  const platform = env[TEST_SPAWN_PLATFORM_ENV] === "win32" ? "win32" : process.platform;
  if (!command2 || platform !== "win32")
    return { cmd: command2 ?? "", args: rest };
  const resolved = resolveWindowsCommand(command2, env);
  if (!/\.(?:bat|cmd)$/i.test(resolved))
    return { cmd: resolved, args: rest };
  return {
    cmd: getEnvValue(env, "COMSPEC") ?? "cmd.exe",
    args: [
      "/d",
      "/c",
      ["call", quoteWindowsCommandArg(resolved), ...rest.map(quoteWindowsCommandArg)].join(" ")
    ]
  };
}
var defaultVersionFetcher = async (args) => {
  const [cmd, ...rest] = args;
  if (!cmd)
    return null;
  return new Promise((resolve8) => {
    try {
      const spawnCommand = getSpawnCommand([cmd, ...rest], process.env);
      const proc = spawn(spawnCommand.cmd, spawnCommand.args, {
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
        resolve8(value);
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
      resolve8(null);
    }
  });
};
var PI_PROBE_EXTENSION = `
import { writeFileSync } from "node:fs";

export default function (pi) {
  pi.registerCommand("${PI_PROBE_COMMAND}", {
    description: "Probe loaded CC Safety Net Pi resources",
    handler: async (args, ctx) => {
      const needle = args.trim();
      const commands = typeof pi.getCommands === "function"
        ? pi.getCommands().map((command) => ({
            kind: "command",
            name: command.name,
            path: command.sourceInfo?.path,
            source: command.sourceInfo?.source,
          }))
        : [];
      const tools = typeof pi.getAllTools === "function"
        ? pi.getAllTools().map((tool) => ({
            kind: "tool",
            name: tool.name,
            path: tool.sourceInfo?.path,
            source: tool.sourceInfo?.source,
          }))
        : [];
      const resources = [...commands, ...tools];
      const matched = resources.filter(
        (resource) => resource.name === needle || resource.path === needle,
      );

      writeFileSync(
        process.env.PI_PROBE_OUT,
        JSON.stringify({
          installedAndEnabled: matched.length > 0,
          matched,
        }),
      );

      ctx.shutdown?.();
    },
  });
}
`.trimStart();
function runCommand(args, options2) {
  const [cmd, ...rest] = args;
  if (!cmd) {
    return Promise.resolve({ code: null, stdout: "", stderr: "", timedOut: false });
  }
  return new Promise((resolve8) => {
    try {
      const env = { ...process.env, ...options2.env ?? {} };
      const spawnCommand = getSpawnCommand([cmd, ...rest], env);
      const proc = spawn(spawnCommand.cmd, spawnCommand.args, {
        cwd: options2.cwd,
        env,
        stdio: ["ignore", "pipe", "pipe"]
      });
      let isSettled = false;
      let stdout = "";
      let stderr = "";
      proc.stdout.on("data", (data) => {
        stdout += data.toString();
      });
      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      const finish = (result) => {
        if (isSettled)
          return;
        isSettled = true;
        clearTimeout(timeoutId);
        resolve8(result);
      };
      const timeoutId = setTimeout(() => {
        proc.kill();
        finish({ code: null, stdout, stderr, timedOut: true });
      }, options2.timeoutMs);
      proc.on("close", (code) => {
        finish({ code, stdout, stderr, timedOut: false });
      });
      proc.on("error", (error) => {
        finish({ code: null, stdout, stderr, timedOut: false, error: error.message });
      });
    } catch (error) {
      resolve8({
        code: null,
        stdout: "",
        stderr: "",
        timedOut: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
}
var defaultPiProbeRunner = async (cwd) => {
  const tempDir = await mkdtemp(join11(tmpdir4(), "cc-safety-net-pi-probe-"));
  const probePath = join11(tempDir, "pi-extension-probe.ts");
  const resultPath = join11(tempDir, "result.json");
  const stdoutPath = join11(tempDir, "stdout.jsonl");
  try {
    await writeFile(probePath, PI_PROBE_EXTENSION);
    const result = await runCommand(["pi", "-e", probePath, "--mode", "json", `/${PI_PROBE_COMMAND} ${PI_SENTINEL_COMMAND}`], {
      cwd,
      env: { PI_PROBE_OUT: resultPath },
      timeoutMs: PI_PROBE_TIMEOUT_MS
    });
    await writeFile(stdoutPath, result.stdout);
    if (result.timedOut) {
      return {
        status: "error",
        installedAndEnabled: false,
        matched: [],
        error: "Pi probe timed out"
      };
    }
    if (result.error) {
      return {
        status: "error",
        installedAndEnabled: false,
        matched: [],
        error: `Pi probe failed: ${result.error}`
      };
    }
    if (result.code !== 0) {
      return {
        status: "error",
        installedAndEnabled: false,
        matched: [],
        error: `Pi probe exited with code ${result.code ?? "unknown"}${result.stderr.trim() ? `: ${result.stderr.trim()}` : ""}`
      };
    }
    return parsePiProbeResult(await readFile(resultPath, "utf-8"));
  } catch (error) {
    return {
      status: "error",
      installedAndEnabled: false,
      matched: [],
      error: `Pi probe failed: ${error instanceof Error ? error.message : String(error)}`
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};
function parsePiProbeResult(content) {
  try {
    const parsed = JSON.parse(content);
    if (!isObject(parsed)) {
      return {
        status: "error",
        installedAndEnabled: false,
        matched: [],
        error: "Pi probe result was not an object"
      };
    }
    const matched = Array.isArray(parsed.matched) ? parsed.matched.map(parsePiProbeResource).filter((resource) => resource !== null) : [];
    const installedAndEnabled = parsed.installedAndEnabled === true;
    return {
      status: installedAndEnabled ? "configured" : "not-found",
      installedAndEnabled,
      matched
    };
  } catch (error) {
    return {
      status: "error",
      installedAndEnabled: false,
      matched: [],
      error: `Failed to parse Pi probe result: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
function parsePiProbeResource(value) {
  if (!isObject(value))
    return null;
  if (value.kind !== "command" && value.kind !== "tool")
    return null;
  if (typeof value.name !== "string")
    return null;
  return {
    kind: value.kind,
    name: value.name,
    ...typeof value.path === "string" ? { path: value.path } : {},
    ...typeof value.source === "string" ? { source: value.source } : {}
  };
}
function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
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
async function getSystemInfo(fetcher = defaultVersionFetcher, options2 = {}) {
  const piRawPromise = fetcher(["pi", "--version"]);
  const piProbeRunner = options2.piProbeRunner ?? defaultPiProbeRunner;
  const shouldRunPiProbe = !!options2.piProbeRunner || fetcher === defaultVersionFetcher;
  const piProbePromise = piRawPromise.then((piRaw2) => {
    if (!piRaw2)
      return PI_PROBE_UNAVAILABLE;
    if (!shouldRunPiProbe)
      return PI_PROBE_UNAVAILABLE;
    return piProbeRunner(options2.cwd ?? process.cwd());
  });
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
    codexRaw,
    geminiRaw,
    geminiExtensionsListOutput,
    copilotRaw,
    kimiRaw,
    piRaw,
    nodeRaw,
    npmRaw,
    bunRaw,
    pluginListRaw,
    piSafetyNetProbe
  ] = await Promise.all([
    fetcher(["claude", "--version"]),
    fetcher(["claude", "plugin", "list"]),
    fetcher(["opencode", "--version"]),
    fetcher(["codex", "--version"]),
    fetcher(["gemini", "--version"]),
    fetcher(["gemini", "extensions", "list"]),
    fetchCopilotVersion(),
    fetcher(["kimi", "--version"]),
    piRawPromise,
    fetcher(["node", "--version"]),
    fetcher(["npm", "--version"]),
    fetcher(["bun", "--version"]),
    fetcher(["copilot", "plugin", "list"]),
    piProbePromise
  ]);
  return {
    version: CURRENT_VERSION,
    claudeCodeVersion: parseVersion(claudeRaw),
    claudePluginListOutput,
    openCodeVersion: parseVersion(openCodeRaw),
    codexCliVersion: parseVersion(codexRaw),
    geminiCliVersion: parseVersion(geminiRaw),
    geminiExtensionsListOutput,
    copilotCliVersion: parseVersion(copilotRaw),
    kimiCodeVersion: parseVersion(kimiRaw),
    piCliVersion: parseVersion(piRaw),
    nodeVersion: parseVersion(nodeRaw),
    npmVersion: parseVersion(npmRaw),
    bunVersion: parseVersion(bunRaw),
    copilotPluginInstalled: hasCopilotSafetyNetPlugin(pluginListRaw),
    piSafetyNetProbe,
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
async function runDoctor(options2 = {}) {
  const cwd = options2.cwd ?? process.cwd();
  const system = await getSystemInfo(undefined, { cwd });
  const hooks = detectAllHooks(cwd, {
    claudePluginListOutput: system.claudePluginListOutput,
    geminiExtensionsListOutput: system.geminiExtensionsListOutput,
    copilotCliVersion: system.copilotCliVersion,
    copilotPluginInstalled: system.copilotPluginInstalled,
    piSafetyNetProbe: system.piSafetyNetProbe
  });
  const configInfo = getConfigInfo(cwd);
  const environment = getEnvironmentInfo();
  const activity = getActivitySummary(7);
  const update = options2.skipUpdateCheck ? {
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
  if (options2.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }
  const hasFailure = doctorHasFailure(hooks, configInfo);
  return hasFailure ? 1 : 0;
}
function doctorHasFailure(hooks, configInfo) {
  return hooks.length > 0 && hooks.every((h) => h.status !== "configured") || hooks.some((h) => h.selfTest && h.selfTest.failed > 0) || configInfo.userConfig.exists && !configInfo.userConfig.valid || configInfo.projectConfig.exists && !configInfo.projectConfig.valid;
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
import { existsSync as existsSync15 } from "node:fs";
import { resolve as resolve8 } from "node:path";
function getConfigSource(options2) {
  const projectPath = getProjectRulesConfigPath(options2?.cwd);
  let invalidProjectPath = null;
  if (existsSync15(projectPath)) {
    const validation = validateRulesConfigFile(projectPath);
    if (validation.errors.length === 0) {
      return { configSource: projectPath, configValid: true };
    }
    invalidProjectPath = projectPath;
  }
  const userPath = options2?.userConfigPath ?? getUserRulesConfigPath(options2);
  if (existsSync15(userPath)) {
    const validation = validateRulesConfigFile(userPath);
    return { configSource: userPath, configValid: validation.errors.length === 0 };
  }
  if (invalidProjectPath) {
    return { configSource: invalidProjectPath, configValid: false };
  }
  return { configSource: null, configValid: true };
}
function buildAnalyzeOptions(explainOptions) {
  const cwd = resolve8(explainOptions?.cwd ?? process.cwd());
  const modes = getCCSafetyNetEnvModes();
  return {
    cwd,
    effectiveCwd: cwd,
    config: explainOptions?.config ?? loadConfig(cwd, { userConfigDir: explainOptions?.userConfigDir }),
    strict: explainOptions?.strict ?? modes.strict,
    paranoidRm: modes.paranoidRm,
    paranoidInterpreters: modes.paranoidInterpreters,
    worktreeMode: modes.worktreeMode
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
  return str.replace(/\b([A-Za-z_][A-Za-z0-9_]*)=\$\([^)]*\)/g, "$1=<redacted>").replace(/\b([A-Za-z_][A-Za-z0-9_]*)=(?:"[^"]*"|'[^']*'|\S+)/g, "$1=<redacted>");
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
function isUnparseableCommand(command2, segments2) {
  return segments2.length === 1 && segments2[0]?.length === 1 && segments2[0][0] === command2 && command2.includes(" ");
}
function explainInnerSegments(innerCmd, depth, options2, steps) {
  if (depth + 1 >= MAX_RECURSION_DEPTH) {
    steps.push({
      type: "error",
      message: REASON_RECURSION_LIMIT
    });
    return { reason: REASON_RECURSION_LIMIT };
  }
  const innerSegments = splitShellCommands(innerCmd);
  if (options2.strict && isUnparseableCommand(innerCmd, innerSegments)) {
    steps.push({
      type: "strict-unparseable",
      rawCommand: redactEnvAssignmentsInString(innerCmd),
      reason: REASON_STRICT_UNPARSEABLE2
    });
    return { reason: REASON_STRICT_UNPARSEABLE2 };
  }
  let effectiveCwd = options2.effectiveCwd === undefined ? options2.cwd : options2.effectiveCwd;
  const shellGitContextState = createShellGitContextEnvState(options2.envAssignments);
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
      ...options2,
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
function explainSegment(tokens, depth, options2, steps) {
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
  const effectiveCwd = options2.effectiveCwd === undefined ? options2.cwd : options2.effectiveCwd;
  const cwdUnknown = effectiveCwd === null;
  const baseCwdForRm = cwdUnknown ? undefined : effectiveCwd ?? options2.cwd;
  const originalCwd = cwdUnknown ? undefined : options2.cwd;
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
  const envAssignments = new Map(options2.envAssignments ?? []);
  for (const [k, v] of envResult.envAssignments) {
    envAssignments.set(k, v);
  }
  for (const [k, v] of wrapperResult.envAssignments) {
    envAssignments.set(k, v);
  }
  const cwdForRm = wrapperResult.cwd === null ? undefined : wrapperResult.cwd ?? baseCwdForRm;
  const nestedEffectiveCwd = wrapperResult.cwd === undefined ? options2.effectiveCwd : wrapperResult.cwd;
  const nestedOptions = {
    ...options2,
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
  if (isShellWrapperCommand2(head, baseNameLower)) {
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
  if (AWK_INTERPRETERS.has(baseNameLower)) {
    const awkReason = analyzeAwkSystemCalls(strippedTokens, (command2) => {
      const nestedResult = explainInnerSegments(command2, depth, nestedOptions, steps);
      return nestedResult?.reason ?? null;
    });
    if (awkReason) {
      steps.push({
        type: "rule-check",
        ruleModule: "awk",
        ruleFunction: "analyzeAwkSystemCalls",
        matched: true,
        reason: awkReason
      });
      return {
        reason: awkReason === REASON_AWK_SYSTEM_DYNAMIC ? REASON_AWK_SYSTEM_DYNAMIC : awkReason
      };
    }
  }
  if (INTERPRETERS.has(baseNameLower)) {
    const codeArg = extractInterpreterCodeArg(strippedTokens);
    if (codeArg) {
      const paranoidBlocked = !!options2.paranoidInterpreters;
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
      worktreeMode: options2.worktreeMode
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
      paranoid: options2.paranoidRm,
      allowTmpdirVar
    });
    steps.push({
      type: "rule-check",
      ruleModule: "analyze/rm.ts",
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
      paranoidRm: options2.paranoidRm,
      allowTmpdirVar,
      envAssignments,
      worktreeMode: options2.worktreeMode
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
      paranoidRm: options2.paranoidRm,
      allowTmpdirVar,
      envAssignments,
      worktreeMode: options2.worktreeMode,
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
      if (isShellWrapperCommand2(token, cmd)) {
        const innerCmd = extractDashCArg([token, ...strippedTokens.slice(i + 1)]);
        if (innerCmd) {
          embeddedCommandFound = cmd;
          const redactedInnerCmd = redactEnvAssignmentsInString(innerCmd);
          steps.push({
            type: "shell-wrapper",
            wrapper: cmd,
            innerCommand: redactedInnerCmd
          });
          steps.push({
            type: "recurse",
            reason: "shell-wrapper",
            innerCommand: redactedInnerCmd,
            depth: depth + 1
          });
          fallbackReason = explainInnerSegments(innerCmd, depth, nestedOptions, steps)?.reason ?? null;
        }
      }
      if (!fallbackReason && cmd === "rm") {
        embeddedCommandFound = "rm";
        const rmTokens = ["rm", ...strippedTokens.slice(i + 1)];
        fallbackReason = analyzeRm(rmTokens, {
          cwd: cwdForRm,
          originalCwd,
          paranoid: options2.paranoidRm,
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
  const hasRules = options2.config?.rules && options2.config.rules.length > 0;
  if (shouldCheckCustomRules && hasRules && options2.config) {
    const customResult = checkCustomRules(strippedTokens, options2.config.rules);
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
function isShellWrapperCommand2(head, baseNameLower) {
  return SHELL_WRAPPERS.has(baseNameLower) || head === "$SHELL";
}

// src/bin/explain/analyze.ts
function explainCommand2(command2, options2) {
  const trace = { steps: [], segments: [] };
  const analyzeOpts = buildAnalyzeOptions(options2);
  const { configSource, configValid } = getConfigSource({
    cwd: options2?.cwd,
    userConfigDir: options2?.userConfigDir
  });
  if (!command2 || !command2.trim()) {
    trace.steps.push({ type: "error", message: "No command provided" });
    return {
      trace,
      result: "allowed",
      configSource,
      configValid
    };
  }
  const segments2 = splitShellCommands(command2);
  const redactedInput = redactEnvAssignmentsInString(command2);
  const redactedSegments = splitShellCommands(redactedInput).map((seg) => redactEnvAssignmentTokens(seg));
  trace.steps.push({
    type: "parse",
    input: redactedInput,
    segments: redactedSegments
  });
  if (analyzeOpts.strict && isUnparseableCommand(command2, segments2)) {
    trace.steps.push({
      type: "strict-unparseable",
      rawCommand: redactedInput,
      reason: REASON_STRICT_UNPARSEABLE2
    });
    return {
      trace,
      result: "blocked",
      reason: REASON_STRICT_UNPARSEABLE2,
      segment: redactEnvAssignmentsInString(command2),
      configSource,
      configValid
    };
  }
  let blocked = false;
  let blockReason;
  let blockSegment;
  let effectiveCwd = analyzeOpts.effectiveCwd;
  const shellGitContextState = createShellGitContextEnvState(analyzeOpts.envAssignments);
  for (let i = 0;i < segments2.length; i++) {
    const segment = segments2[i];
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
      const nextCwd2 = resolveCwdAfterSegment(segment, effectiveCwd);
      if (nextCwd2 !== undefined) {
        if (nextCwd2 !== null) {
          effectiveCwd = nextCwd2;
          trace.segments.push({ index: i, steps: segmentSteps });
          continue;
        }
        segmentSteps.push(cwdChangeStep(segment));
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
    const nextCwd = resolveCwdAfterSegment(segment, effectiveCwd);
    if (nextCwd !== undefined) {
      if (nextCwd !== null) {
        effectiveCwd = nextCwd;
        applyShellGitContextEnvSegment(segment, shellGitContextState);
        trace.segments.push({ index: i, steps: segmentSteps });
        continue;
      }
      segmentSteps.push(cwdChangeStep(segment));
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
    customRule: getCustomRuleMetadata(blockReason, options2, analyzeOpts.cwd ?? process.cwd()),
    configSource,
    configValid
  };
}
function cwdChangeStep(segment) {
  return {
    type: "cwd-change",
    segment: redactEnvAssignmentsInString(segment.join(" ")),
    effectiveCwdNowUnknown: true
  };
}
function getCustomRuleMetadata(reason, options2, cwd) {
  const id = reason?.match(/^\[([^\]]+)]/)?.[1];
  if (!id)
    return;
  if (options2?.config) {
    return options2.config.rules.some((rule) => rule.name === id) ? { id } : undefined;
  }
  const policy = loadRulesPolicy({ cwd, userConfigDir: options2?.userConfigDir });
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
  const command2 = remaining.length === 1 ? remaining[0] : $quote(remaining);
  if (!command2) {
    console.error("Error: No command provided");
    console.error("Usage: cc-safety-net explain [--json] [--cwd <path>] <command>");
    return null;
  }
  return { json, cwd, command: command2 };
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
function formatTraceHuman(result, options2) {
  const box = getBoxChars(options2?.asciiOnly ?? false);
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
  const segments2 = result.trace.segments;
  const hasMultipleSegments = segments2.length > 1;
  for (const seg of segments2) {
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
var version = "1.0.5";
var INDENT = "  ";
var PROGRAM_NAME = "cc-safety-net";
function formatOptionFlags(option) {
  return option.argument ? `${option.flags} ${option.argument}` : option.flags;
}
function getOptionsColumnWidth(options2) {
  return Math.max(...options2.map((opt) => formatOptionFlags(opt).length));
}
function getSubcommandsColumnWidth(subcommands) {
  return Math.max(...subcommands.map((subcommand) => subcommand.usage.length));
}
function getCommandSummaryWidth(commands2) {
  return Math.max(...commands2.map((cmd) => `${PROGRAM_NAME} ${cmd.usage}`.length));
}
function formatCommandSummary(cmd, maxUsageWidth) {
  const usage = `${PROGRAM_NAME} ${cmd.usage}`;
  return `${INDENT}${usage.padEnd(maxUsageWidth + 2)}${cmd.description}`;
}
function formatEnvironmentVariable(name, description) {
  return `${INDENT}${name.padEnd(40)}${description}`;
}
function printCommandHelp(command2) {
  const lines = [];
  lines.push(`${PROGRAM_NAME} ${command2.name}`);
  lines.push("");
  lines.push(`${INDENT}${command2.description}`);
  lines.push("");
  lines.push("USAGE:");
  lines.push(`${INDENT}${PROGRAM_NAME} ${command2.usage}`);
  lines.push("");
  if (command2.subcommands && command2.subcommands.length > 0) {
    lines.push("SUBCOMMANDS:");
    const subcommandWidth = getSubcommandsColumnWidth(command2.subcommands);
    for (const subcommand of command2.subcommands) {
      lines.push(`${INDENT}${subcommand.usage.padEnd(subcommandWidth + 2)}${subcommand.description}`);
    }
    lines.push("");
  }
  if (command2.options.length > 0) {
    lines.push("OPTIONS:");
    const optWidth = getOptionsColumnWidth(command2.options);
    for (const opt of command2.options) {
      const flags = formatOptionFlags(opt);
      lines.push(`${INDENT}${flags.padEnd(optWidth + 2)}${opt.description}`);
    }
    lines.push("");
  }
  if (command2.examples && command2.examples.length > 0) {
    lines.push("EXAMPLES:");
    for (const example of command2.examples) {
      lines.push(`${INDENT}${example}`);
    }
  }
  console.log(lines.join(`
`));
}
function printHelp() {
  const visibleCommands = getVisibleCommands();
  const maxUsageWidth = getCommandSummaryWidth(visibleCommands);
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
  lines.push(formatEnvironmentVariable(`${ENV_FLAGS.strict.name}=1`, "Fail-closed on unparseable commands"));
  lines.push(formatEnvironmentVariable(`${ENV_FLAGS.paranoid.name}=1`, "Enable all paranoid checks"));
  lines.push(formatEnvironmentVariable(`${ENV_FLAGS.paranoidRm.name}=1`, "Block non-temp rm -rf within cwd"));
  lines.push(formatEnvironmentVariable(`${ENV_FLAGS.paranoidInterpreters.name}=1`, "Block interpreter one-liners"));
  lines.push(formatEnvironmentVariable(`${ENV_FLAGS.worktree.name}=1`, "Allow local git discards in linked worktrees"));
  lines.push(formatEnvironmentVariable(`${ENV_FLAGS.debug.name}=1`, "Log allowed hook commands for debugging"));
  lines.push(formatEnvironmentVariable("CC_SAFETY_NET_HOME", "Override rule config home directory"));
  console.log(lines.join(`
`));
}
function printVersion() {
  console.log(version);
}
function showCommandHelp(commandName) {
  const command2 = findCommand(commandName);
  if (!command2) {
    return false;
  }
  if (command2.hidden || command2.name.toLowerCase() !== commandName.toLowerCase()) {
    return false;
  }
  printCommandHelp(command2);
  return true;
}

// src/bin/hook/install.ts
import { homedir as homedir6 } from "node:os";

// src/bin/hook/install/kimi-code.ts
import { existsSync as existsSync16, mkdirSync as mkdirSync4, readFileSync as readFileSync11, writeFileSync as writeFileSync3 } from "node:fs";
import { dirname as dirname9, join as join12 } from "node:path";

// src/bin/hook/config-edit.ts
function isWhitespace(char) {
  return char !== undefined && /\s/.test(char);
}
function skipString(content, index, errorMessage) {
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
  throw new Error(errorMessage);
}
function findMatchingBracket(content, openIndex, options2) {
  const open = content[openIndex];
  const close = open === "[" ? "]" : "}";
  let depth = 0;
  let index = openIndex;
  while (index < content.length) {
    const nextIndex = options2.skipComment?.(content, index) ?? index;
    if (nextIndex !== index) {
      index = nextIndex;
      continue;
    }
    if (content[index] === '"') {
      index = skipString(content, index, options2.stringError);
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
  throw new Error(options2.bracketError);
}
function getLineIndent(content, index) {
  const lineStart = content.lastIndexOf(`
`, index) + 1;
  const match = /^[ \t]*/.exec(content.slice(lineStart));
  return match?.[0] ?? "";
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

// src/bin/hook/install/kimi-code.ts
var KIMI_HOOK_COMMAND = "npx -y cc-safety-net hook --kimi-code";
var KIMI_HOOK_BLOCK = `[[hooks]]
event = "PreToolUse"
matcher = "Bash"
command = "${KIMI_HOOK_COMMAND}"`;
var KIMI_INLINE_HOOK = `{ event = "PreToolUse", matcher = "Bash", command = "${KIMI_HOOK_COMMAND}" }`;
function getKimiConfigPath(homeDir) {
  return join12(process.env.KIMI_CODE_HOME ?? join12(homeDir, ".kimi-code"), "config.toml");
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
function skipTomlComment(content, index) {
  if (content[index] !== "#")
    return index;
  const newlineIndex = content.indexOf(`
`, index + 1);
  return newlineIndex === -1 ? content.length : newlineIndex + 1;
}
function findTomlArrayClose(content, openIndex) {
  return findMatchingBracket(content, openIndex, {
    skipComment: skipTomlComment,
    stringError: "Unterminated string in Kimi Code config",
    bracketError: "Unmatched hooks array in Kimi Code config"
  });
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
function installKimiCode(homeDir) {
  const configPath = getKimiConfigPath(homeDir);
  mkdirSync4(dirname9(configPath), { recursive: true });
  if (!existsSync16(configPath)) {
    writeFileSync3(configPath, `${KIMI_HOOK_BLOCK}
`);
    return { path: configPath, alreadyInstalled: false };
  }
  const content = readFileSync11(configPath, "utf-8");
  if (content.includes(KIMI_HOOK_COMMAND))
    return { path: configPath, alreadyInstalled: true };
  writeFileSync3(configPath, appendKimiHook(content));
  return { path: configPath, alreadyInstalled: false };
}
function uninstallKimiCode(homeDir) {
  const configPath = getKimiConfigPath(homeDir);
  if (!existsSync16(configPath))
    return { path: configPath, alreadyInstalled: false };
  const content = readFileSync11(configPath, "utf-8");
  if (!content.includes(KIMI_HOOK_COMMAND))
    return { path: configPath, alreadyInstalled: false };
  const inlineHooksRange = findTopLevelInlineHooksArray(content);
  const updated = inlineHooksRange ? removeKimiInlineHook(content, inlineHooksRange) : `${removeKimiTableHookBlocks(content)}
`;
  writeFileSync3(configPath, updated);
  return { path: configPath, alreadyInstalled: true };
}

// src/bin/hook/install.ts
function getHomeDir() {
  return process.env.HOME ?? homedir6();
}
function parseInstallTarget(args, action) {
  const unknownOption = args.find((arg) => arg.startsWith("-") && !["--kimi-code"].includes(arg));
  if (unknownOption)
    throw new Error(`Unknown install option: ${unknownOption}`);
  const unexpectedArg = args.find((arg) => !arg.startsWith("-"));
  if (unexpectedArg)
    throw new Error(`Unexpected argument for hook ${action}: ${unexpectedArg}`);
  if (!args.includes("--kimi-code"))
    throw new Error("Choose exactly one install target: --kimi-code");
}
function runHookInstallCommand(action, args) {
  try {
    parseInstallTarget(args, action);
    const homeDir = getHomeDir();
    const result = action === "install" ? installKimiCode(homeDir) : uninstallKimiCode(homeDir);
    const name = "Kimi Code";
    const pastTense = action === "install" ? "Installed" : "Uninstalled";
    console.log(action === "install" && result.alreadyInstalled ? `${name} hook already installed in ${result.path}` : action === "uninstall" && !result.alreadyInstalled ? `${name} hook not installed in ${result.path}` : `${pastTense} ${name} hook ${action === "install" ? "in" : "from"} ${result.path}`);
    return 0;
  } catch (e) {
    console.error(formatInstallError(e));
    return 1;
  }
}
function formatInstallError(error) {
  const message = error instanceof Error ? error.message : String(error);
  const code = typeof error === "object" && error !== null && "code" in error ? error.code : null;
  if (code === "EACCES" || code === "EPERM") {
    return `${message}
Check file permissions for the target config file and parent directory.`;
  }
  if (code === "ENOENT") {
    return `${message}
Check that the target config path and parent directory exist.`;
  }
  if (code === "ENOTDIR") {
    return `${message}
Check that every parent path component is a directory.`;
  }
  return message;
}

// src/bin/rule/index.ts
import { existsSync as existsSync19 } from "node:fs";
import { join as join15 } from "node:path";

// src/bin/rule/doc.ts
var RULE_DOC = `# Custom Rules Reference

Agent reference for generating CC Safety Net rulebook configuration.

## Config Locations

| Scope | Config path | Rulebook path | Cache path | Priority |
|-------|-------------|---------------|------------|----------|
| User | \`~/.cc-safety-net/rules/rule.json\` | \`~/.cc-safety-net/rules/<rulebook-name>/rulebook.json\` | \`~/.cc-safety-net/cache/rulebooks/\` | Lower |
| Project | \`.cc-safety-net/rules/rule.json\` | \`.cc-safety-net/rules/<rulebook-name>/rulebook.json\` | \`.cc-safety-net/cache/rulebooks/\` | Higher |
| GitHub source | Listed in a local \`rule.json\` | \`.cc-safety-net/rules/<rulebook-name>/rulebook.json\` in the source repository | Consumer local cache | Source order |

Use \`cc-safety-net rule init\` to create a starter local config and rulebook. Use \`--global\` for user scope.

Legacy inline \`.safety-net.json\` and \`~/.cc-safety-net/config.json\` files are not loaded at runtime. Convert them with \`cc-safety-net rule migrate\`.

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

- Local sources are bare rulebook names such as \`project-rules\`; the rulebook file is \`.cc-safety-net/rules/project-rules/rulebook.json\`.
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
function printRuleChangeResult(result, action) {
  if (!result.ok) {
    printResultErrors(result);
    return;
  }
  printResultWarnings(result);
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
  printResultWarnings(result);
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
function printRulesListReport(policy, sourceDisplayMaps) {
  printListSection("Active sources", policy.rulebooks, (rulebook) => [
    `[${rulebook.source}] ${rulebook.name} ${rulebook.version}`,
    `  Source: ${sourceDisplayMaps[rulebook.source].get(rulebook.spec) ?? rulebook.spec}`
  ]);
  printListSection("Active rules", policy.rules, (rule) => [
    `[${getRuleSource(policy, rule.name)}] ${rule.name}`,
    `  Command: ${rule.subcommand ? `${rule.command} ${rule.subcommand}` : rule.command}`,
    `  Block args: ${rule.block_args.join(", ")}`,
    `  Reason: ${rule.reason}`
  ]);
  printListSection("Disabled rules", getMergedOverrides(policy, "off"), (override) => [
    override.key
  ]);
  printListSection("Reason overrides", getMergedOverrides(policy, "reason"), (override) => [
    override.key,
    `  Reason: ${override.value.reason}`
  ]);
  printListSection("Issues", policy.errors, (error) => [error]);
}
function printListSection(title, items, format) {
  if (items.length === 0) {
    console.log(`${title}: (none)`);
    return;
  }
  console.log(`${title} (${items.length}):`);
  for (const item of items) {
    const [firstLine, ...detailLines] = format(item);
    console.log(`  - ${firstLine}`);
    for (const line of detailLines)
      console.log(`    ${line}`);
  }
}
function getRuleSource(policy, ruleName) {
  return policy.rulebooks.find((rulebook) => rulebook.rules.includes(ruleName))?.source ?? "project";
}
function getMergedOverrides(policy, kind) {
  return Object.entries({
    ...policy.userConfig?.overrides ?? {},
    ...policy.projectConfig?.overrides ?? {}
  }).filter((entry) => {
    if (kind === "off")
      return entry[1] === "off";
    return !!entry[1] && typeof entry[1] === "object";
  }).map(([key, value]) => ({ key, value }));
}
function sumStats(entries, key) {
  return entries.reduce((total, entry) => total + (entry[key] ?? 0), 0);
}
function printResultErrors(result) {
  for (const error of result.errors)
    console.error(error);
}
function printResultWarnings(result) {
  if (!result.warnings || result.warnings.length === 0)
    return;
  for (const warning of result.warnings)
    console.warn(warning);
}

// src/bin/rule/migrate.ts
import { existsSync as existsSync17, readFileSync as readFileSync12, rmSync as rmSync2, writeFileSync as writeFileSync4 } from "node:fs";
import { dirname as dirname10, join as join13 } from "node:path";
var PROJECT_MIGRATED_FROM = ".safety-net.json";
var USER_MIGRATED_FROM = "~/.cc-safety-net/config.json";
async function runRulesMigrate(options2) {
  const results = [
    await migrateRulesScope({
      legacyPath: getLegacyProjectRulesConfigPath({ cwd: options2.cwd }),
      configPath: getProjectRulesConfigPath(options2.cwd),
      defaultRulebookName: "project-rules",
      migratedFrom: PROJECT_MIGRATED_FROM,
      cleanup: options2.cleanup,
      syncOptions: { cwd: options2.cwd }
    }),
    await migrateRulesScope({
      legacyPath: getLegacyUserRulesConfigPath(),
      configPath: getUserRulesConfigPath(),
      defaultRulebookName: "user-rules",
      migratedFrom: USER_MIGRATED_FROM,
      cleanup: options2.cleanup,
      syncOptions: { cwd: options2.cwd, global: true }
    })
  ];
  return results.every((result) => result) ? 0 : 1;
}
async function migrateRulesScope(options2) {
  if (!existsSync17(options2.legacyPath)) {
    console.log(`No legacy config found at ${options2.legacyPath}`);
    return true;
  }
  const legacy = readLegacyRulesConfig(options2.legacyPath);
  if (!legacy.ok) {
    for (const error of legacy.errors)
      console.error(error);
    return false;
  }
  const loaded = readRulesConfig(options2.configPath);
  if (loaded.errors.length > 0) {
    for (const error of loaded.errors)
      console.error(error);
    return false;
  }
  const config = loaded.config ?? { version: 1, rules: [], overrides: {} };
  const rulebookName = getMigratedRulebookName(dirname10(options2.configPath), config.rules, options2.defaultRulebookName, options2.migratedFrom);
  const rulebookPath = join13(dirname10(options2.configPath), rulebookName, "rulebook.json");
  const snapshots = [
    snapshotFile(options2.configPath),
    snapshotFile(rulebookPath),
    snapshotFile(getRulesLockPathForConfigPath(options2.configPath))
  ];
  const result = await writeAndSyncMigratedRulebook(options2, rulebookPath, rulebookName, legacy.config.rules, config.rules.includes(rulebookName) ? config.rules : [...config.rules, rulebookName], config.overrides ?? {});
  if (!result.ok) {
    restoreFiles(snapshots);
    for (const error of result.errors)
      console.error(error);
    return false;
  }
  if (!options2.cleanup) {
    console.log(`Migrated legacy config at ${options2.legacyPath}. Legacy file is no longer used.`);
    return true;
  }
  if (!isCleanupVerified(options2.configPath, rulebookPath, rulebookName, options2.migratedFrom, legacy.config.rules)) {
    console.error(`Migration cleanup verification failed for ${options2.legacyPath}`);
    return false;
  }
  rmSync2(options2.legacyPath, { force: true });
  console.log(`Deleted legacy config at ${options2.legacyPath}`);
  return true;
}
async function writeAndSyncMigratedRulebook(options2, rulebookPath, rulebookName, rules, configRules, overrides) {
  try {
    writeJsonAtomic(options2.configPath, {
      version: 1,
      rules: configRules,
      overrides
    });
    writeJsonAtomic(rulebookPath, getMigratedRulebook(rulebookName, options2.migratedFrom, rules));
    return await syncRulesConfig(options2.syncOptions);
  } catch (error) {
    return { ok: false, errors: [error instanceof Error ? error.message : String(error)] };
  }
}
function readLegacyRulesConfig(path) {
  try {
    const parsed = JSON.parse(readFileSync12(path, "utf-8"));
    const validation = validateConfig(parsed);
    if (validation.errors.length > 0)
      return { ok: false, errors: validation.errors };
    return {
      ok: true,
      config: {
        version: 1,
        rules: parsed.rules ?? []
      }
    };
  } catch (error) {
    return {
      ok: false,
      errors: [`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}
function getMigratedRulebookName(configDir, sources, defaultRulebookName, migratedFrom) {
  const existing = sources.find((source) => getRulebookMigratedFrom(configDir, source) === migratedFrom);
  if (existing)
    return existing;
  if (!existsSync17(join13(configDir, defaultRulebookName, "rulebook.json")))
    return defaultRulebookName;
  for (let i = 2;; i++) {
    const name = `${defaultRulebookName}-${i}`;
    if (!existsSync17(join13(configDir, name, "rulebook.json")))
      return name;
  }
}
function getMigratedRulebook(name, migratedFrom, rules) {
  return {
    rulebook_version: 1,
    name,
    version: "1.0.0",
    description: "Migrated CC Safety Net rules.",
    author: "project",
    migrated_from: migratedFrom,
    allowed_commands: [...new Set(rules.map((rule) => rule.command))],
    rules,
    tests: rules.map((rule) => ({
      command: [rule.command, rule.subcommand, rule.block_args[0]].filter(Boolean).join(" "),
      expect: "blocked",
      rule: rule.name
    }))
  };
}
function isCleanupVerified(configPath, rulebookPath, rulebookName, migratedFrom, legacyRules) {
  const config = readRulesConfig(configPath).config;
  if (!config?.rules.includes(rulebookName) || !existsSync17(rulebookPath))
    return false;
  try {
    const rulebook = JSON.parse(readFileSync12(rulebookPath, "utf-8"));
    return rulebook.migrated_from === migratedFrom && JSON.stringify(rulebook.rules) === JSON.stringify(legacyRules);
  } catch {
    return false;
  }
}
function snapshotFile(path) {
  return { path, content: existsSync17(path) ? readFileSync12(path, "utf-8") : null };
}
function restoreFiles(snapshots) {
  for (const snapshot of snapshots) {
    if (snapshot.content === null) {
      rmSync2(snapshot.path, { force: true });
      continue;
    }
    writeFileSync4(snapshot.path, snapshot.content, "utf-8");
  }
}

// src/bin/rule/verify.ts
import { existsSync as existsSync18, readdirSync as readdirSync4, readFileSync as readFileSync13, statSync as statSync2, writeFileSync as writeFileSync5 } from "node:fs";
import { dirname as dirname11, join as join14, resolve as resolve9 } from "node:path";
var VERIFY_HEADER = "CC Safety Net Config";
var VERIFY_SEPARATOR = "═".repeat(VERIFY_HEADER.length);
var RULES_SCHEMA_URL = "https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json";
var RULES_DIR_RESERVED_ENTRIES = new Set(["rule.json", "rule.lock", "cache"]);
function runRulesVerify(options2 = {}) {
  const cwd = options2.cwd ?? process.cwd();
  const userConfig = options2.userConfigPath ?? getUserRulesConfigPath();
  const projectConfig = options2.projectConfigPath ?? getProjectRulesConfigPath(cwd);
  const legacyUserConfig = options2.legacyUserConfigPath ?? getLegacyUserRulesConfigPath();
  const legacyProjectConfig = options2.legacyProjectConfigPath ?? getLegacyProjectConfigPath(cwd);
  const githubSourceRulesDir = resolve9(cwd, RULES_DIR);
  const userConfigDir = dirname11(userConfig);
  let hasErrors = false;
  let hasWarnings = false;
  const configsChecked = [];
  const warnings = [];
  const githubSourceRules = getGitHubSourceRulesValidation(githubSourceRulesDir);
  printRulesVerifyHeader();
  if (existsSync18(userConfig)) {
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
  if (existsSync18(legacyUserConfig)) {
    hasWarnings = true;
    if (existsSync18(userConfig)) {
      warnings.push(getLegacyRulesConfigWarning("user", "cleanup"));
    } else {
      const result = validateConfigFile(legacyUserConfig);
      configsChecked.push({
        scope: "User",
        path: legacyUserConfig,
        result,
        schema: "legacy",
        sourceDisplayMap: new Map,
        inactive: true
      });
      warnings.push(getLegacyRulesConfigWarning("user", result.errors.length > 0 ? "fix-or-delete" : "migrate"));
      if (result.errors.length > 0)
        hasErrors = true;
    }
  }
  if (existsSync18(projectConfig)) {
    const result = validateRulesConfigFile(projectConfig);
    result.errors.push(...getRulesConfigRuntimeErrorsForConfig(projectConfig, getRulesLockPathForConfigPath(projectConfig), {
      userConfigDir
    }));
    configsChecked.push({
      scope: "Project",
      path: resolve9(projectConfig),
      result,
      schema: "rules",
      sourceDisplayMap: getRulesConfigSourceDisplayMap(projectConfig)
    });
    if (result.errors.length > 0)
      hasErrors = true;
    if (existsSync18(legacyProjectConfig)) {
      hasWarnings = true;
      warnings.push(getLegacyRulesConfigWarning("project", "cleanup"));
    }
  } else if (existsSync18(legacyProjectConfig)) {
    hasWarnings = true;
    hasErrors = true;
    const result = validateConfigFile(legacyProjectConfig);
    configsChecked.push({
      scope: "Project",
      path: resolve9(legacyProjectConfig),
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
  if (!existsSync18(path))
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
  const entries = readdirSync4(path, { withFileTypes: true }).filter((entry) => !RULES_DIR_RESERVED_ENTRIES.has(entry.name)).sort((a, b) => a.name.localeCompare(b.name));
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
    const rulebookPath = join14(path, entry.name, "rulebook.json");
    if (!existsSync18(rulebookPath)) {
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
    writeFileSync5(path, JSON.stringify({ $schema: RULES_SCHEMA_URL, ...parsed }, null, 2), "utf-8");
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
  "migrate",
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
  if (flags.help) {
    printCommandHelp(ruleCommand);
    return 0;
  }
  if (!subcommand) {
    printCommandHelp(ruleCommand);
    return 1;
  }
  const value = flags.positionals[1];
  const options2 = { global: flags.global, check: flags.check };
  if (subcommand === "init") {
    const dir = flags.global ? getUserRulesDir() : getProjectRulesDir();
    const configPath = flags.global ? getUserRulesConfigPath() : getProjectRulesConfigPath();
    const rulebookName = flags.global ? "user-rules" : "project-rules";
    ensureDefaultRulebookSource(configPath, rulebookName);
    const rulebookPath = join15(dir, rulebookName, "rulebook.json");
    if (!existsSync19(rulebookPath))
      writeStarterRulebook(rulebookPath, rulebookName);
    const result = await syncRulesConfig(options2);
    printRuleChangeResult(result, "Rule config initialized.");
    return result.ok ? 0 : 1;
  }
  if (subcommand === "add") {
    if (!value) {
      console.error("rule add requires a source");
      return 1;
    }
    const result = await addRulebookSource(value, options2);
    printRuleChangeResult(result, `Added rulebook source: ${value}`);
    return result.ok ? 0 : 1;
  }
  if (subcommand === "remove") {
    if (!value) {
      console.error("rule remove requires a source");
      return 1;
    }
    const result = await removeRulebookSource(value, {
      ...options2,
      deleteSource: flags.deleteSource
    });
    printRuleChangeResult(result, `Removed rulebook source: ${value}`);
    return result.ok ? 0 : 1;
  }
  if (subcommand === "update" || subcommand === "sync") {
    const result = await syncRulesConfig({
      ...options2,
      only: subcommand === "update" ? value : undefined
    });
    printRuleChangeResult(result, flags.check ? "Rule config checked." : "Rule config synced.");
    return result.ok ? 0 : 1;
  }
  if (subcommand === "list") {
    const policy = loadRulesPolicy();
    printRulesListReport(policy, {
      user: getRulesConfigSourceDisplayMap(policy.userConfigPath),
      project: getRulesConfigSourceDisplayMap(policy.projectConfigPath)
    });
    return policy.errors.length > 0 ? 1 : 0;
  }
  if (subcommand === "test") {
    const sources = value ? [value] : [];
    const result = await testRulebookSources(sources, options2);
    printRulesTestResult(result);
    return result.ok ? 0 : 1;
  }
  if (subcommand === "migrate") {
    return runRulesMigrate({ cleanup: flags.cleanup, cwd: process.cwd() });
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
    cleanup: false,
    deleteSource: false,
    help: false,
    positionals: [],
    errors: []
  };
  for (const arg of args) {
    if (arg === "-g" || arg === "--global") {
      flags.global = true;
    } else if (arg === "--check") {
      flags.check = true;
    } else if (arg === "--delete-source") {
      flags.deleteSource = true;
    } else if (arg === "--cleanup") {
      flags.cleanup = true;
    } else if (arg === "-h" || arg === "--help") {
      flags.help = true;
    } else if (arg.startsWith("-")) {
      flags.errors.push(unknownRuleOption(flags.positionals[0], arg));
    } else {
      flags.positionals.push(arg);
    }
  }
  validateRuleFlags(flags);
  return flags;
}
function validateRuleFlags(flags) {
  const [subcommand] = flags.positionals;
  if (subcommand && !RULE_SUBCOMMANDS.has(subcommand)) {
    flags.errors.push(`Unknown rule subcommand: ${subcommand}`);
  }
  if (flags.deleteSource && subcommand !== "remove") {
    if (subcommand && RULE_SUBCOMMANDS.has(subcommand)) {
      flags.errors.push(`Unknown option for rule ${subcommand}: --delete-source`);
    } else {
      flags.errors.push("--delete-source is only valid with 'rule remove'");
    }
  }
  if (flags.cleanup && subcommand !== "migrate") {
    flags.errors.push(unknownRuleOption(subcommand, "--cleanup"));
  }
  if (subcommand === "migrate") {
    if (flags.global)
      flags.errors.push("Unknown option for rule migrate: --global");
    if (flags.check)
      flags.errors.push("Unknown option for rule migrate: --check");
    if (flags.positionals.length > 1) {
      flags.errors.push(`Unexpected rule migrate argument: ${flags.positionals[1]}`);
    }
  } else if (flags.positionals.length > 2) {
    flags.errors.push(`Unexpected rule argument: ${flags.positionals[2]}`);
  }
  if (subcommand === "list" && flags.global) {
    flags.errors.push("Unknown option for rule list: --global");
  }
}
function unknownRuleOption(subcommand, option) {
  if (subcommand === "migrate")
    return `Unknown option for rule migrate: ${option}`;
  return `Unknown rule option: ${option}`;
}
function ensureDefaultRulebookSource(configPath, rulebookName) {
  if (!existsSync19(configPath)) {
    writeDefaultRulesConfig(configPath, [rulebookName]);
    return;
  }
  const loaded = readRulesConfig(configPath);
  if (!loaded.config || loaded.config.rules.includes(rulebookName))
    return;
  writeJsonAtomic(configPath, {
    version: 1,
    rules: [...loaded.config.rules, rulebookName],
    overrides: loaded.config.overrides ?? {}
  });
}

// src/bin/statusline.ts
import { existsSync as existsSync20, readFileSync as readFileSync14 } from "node:fs";
import { homedir as homedir7 } from "node:os";
import { join as join16 } from "node:path";
async function readStdinAsync() {
  if (process.stdin.isTTY) {
    return null;
  }
  return new Promise((resolve10) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      const trimmed = data.trim();
      resolve10(trimmed || null);
    });
    process.stdin.on("error", () => {
      resolve10(null);
    });
  });
}
function getSettingsPath() {
  if (process.env.CLAUDE_SETTINGS_PATH) {
    return process.env.CLAUDE_SETTINGS_PATH;
  }
  return join16(homedir7(), ".claude", "settings.json");
}
function isPluginEnabled() {
  const settingsPath = getSettingsPath();
  if (!existsSync20(settingsPath)) {
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
  } catch (error) {
    if (envTruthy(ENV_FLAGS.debug)) {
      console.error(`CC Safety Net debug: failed to read Claude settings: ${settingsPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
    return false;
  }
}
async function printStatusline() {
  const enabled = isPluginEnabled();
  let status;
  if (!enabled) {
    status = "\uD83D\uDEE1️ CC Safety Net ❌";
  } else {
    const modes = getCCSafetyNetEnvModes();
    let modeEmojis = "";
    if (modes.strict) {
      modeEmojis += "\uD83D\uDD12";
    }
    if (modes.paranoidAll || modes.paranoidRm && modes.paranoidInterpreters) {
      modeEmojis += "\uD83D\uDC41️";
    } else if (modes.paranoidRm) {
      modeEmojis += "\uD83D\uDDD1️";
    } else if (modes.paranoidInterpreters) {
      modeEmojis += "\uD83D\uDC1A";
    }
    if (modes.worktreeMode) {
      modeEmojis += "\uD83C\uDF33";
    }
    const statusEmoji = modeEmojis || "✅";
    status = `\uD83D\uDEE1️ CC Safety Net ${statusEmoji}`;
  }
  const stdinInput = await readStdinAsync();
  if (stdinInput && !stdinInput.startsWith("{")) {
    console.log(`${stdinInput} | ${status}`);
  } else {
    console.log(status);
  }
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
  const command2 = findCommand(commandName);
  if (command2) {
    showCommandHelp(commandName);
    process.exit(0);
  }
  return false;
}
var commandParsers = {
  explain: (args) => ({ mode: "explain", args }),
  rule: (args) => ({ mode: "rule", args }),
  statusline: (args) => {
    if (args.includes("--claude-code") || args.includes("-cc"))
      return { mode: "statusline" };
    console.error("statusline requires --claude-code (-cc)");
    showCommandHelp("statusline");
    process.exit(1);
  },
  hook: (args) => {
    if (args[0] === "install")
      return { mode: "hook-install", args: args.slice(1) };
    if (args[0] === "uninstall")
      return { mode: "hook-uninstall", args: args.slice(1) };
    const integration = findHookIntegrationByFlag(args);
    if (integration)
      return { mode: "hook", integration };
    console.error("hook requires a subcommand or integration flag. Try: cc-safety-net hook install --kimi-code");
    showCommandHelp("hook");
    process.exit(1);
  },
  doctor: (args) => ({ mode: "doctor", args })
};
function parseCliArgs(args) {
  if (handleHelpCommand(args)) {
    return null;
  }
  if (handleCommandHelp(args)) {
    return null;
  }
  if (args.length === 0 || hasHelpFlag(args)) {
    printHelp();
    process.exit(0);
  }
  if (args.includes("--version") || args.includes("-V")) {
    printVersion();
    process.exit(0);
  }
  const commandName = args[0];
  if (!commandName) {
    printHelp();
    process.exit(0);
  }
  const command2 = findCommand(commandName);
  if (command2) {
    return commandParsers[command2.name](args.slice(1));
  }
  const legacyIntegration = findLegacyTopLevelHookIntegration(commandName);
  if (legacyIntegration)
    return { mode: "hook", integration: legacyIntegration };
  if (commandName === "--statusline")
    return { mode: "statusline" };
  console.error(`Unknown option: ${commandName}`);
  console.error("Run 'cc-safety-net --help' for usage.");
  process.exit(1);
}
var commandHandlers = {
  hook: async (command2) => {
    await command2.integration.run();
  },
  "hook-install": async (command2) => {
    process.exit(runHookInstallCommand("install", command2.args));
  },
  "hook-uninstall": async (command2) => {
    process.exit(runHookInstallCommand("uninstall", command2.args));
  },
  rule: async (command2) => {
    process.exit(await runRuleCommand(command2.args));
  },
  statusline: async (_command) => {
    await printStatusline();
  },
  doctor: async (command2) => {
    const flags = parseDoctorFlags(command2.args);
    const exitCode = await runDoctor({
      json: flags.json,
      skipUpdateCheck: flags.skipUpdateCheck
    });
    process.exit(exitCode);
  },
  explain: async (command2) => {
    if (hasHelpFlag(command2.args) || command2.args.length === 0) {
      showCommandHelp("explain");
      process.exit(0);
    }
    const flags = parseExplainFlags(command2.args);
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
};
function assertNever(command2) {
  throw new Error(`Unhandled command mode: ${JSON.stringify(command2)}`);
}
async function runParsedCommand(command2) {
  switch (command2.mode) {
    case "hook":
      await commandHandlers.hook(command2);
      return;
    case "hook-install":
      await commandHandlers["hook-install"](command2);
      return;
    case "hook-uninstall":
      await commandHandlers["hook-uninstall"](command2);
      return;
    case "rule":
      await commandHandlers.rule(command2);
      return;
    case "statusline":
      await commandHandlers.statusline(command2);
      return;
    case "doctor":
      await commandHandlers.doctor(command2);
      return;
    case "explain":
      await commandHandlers.explain(command2);
      return;
    default:
      assertNever(command2);
  }
}
async function main() {
  const command2 = parseCliArgs(process.argv.slice(2));
  if (command2)
    await runParsedCommand(command2);
}
main().catch((error) => {
  console.error("CC Safety Net error:", error);
  process.exit(1);
});
