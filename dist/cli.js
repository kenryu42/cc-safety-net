import{a,s,Pe,Be,R,nt,ze,c,n,Ve,T,x,pe,ot,f,Ke,u,o,v,i,se,r,g,me,H,st,at,d,ge,he,ct,N,Z,ae,S,lt,_,h,ke,W,l,L,X,Je,Ye,F,w,I,ye,be,Ae,ut,m,e,Oe,Re,Ze,Xe,ce,Te,le,De,Q,B,Ne,xe,z,Qe,V,ee,te,ue,et,tt,C,M,Le,Me,$e,E,je,_e,Ue,y,t,ne,ve,b,k,A,dt,Ge,He,p,q}from"./chunks/index-qh9g7ats.js";import{oe,K,We,U,G}from"./chunks/index-6k1581wy.js";var ep=["-h","--help"];function gn(P,O){let D=Object.entries(P.booleans??{}),j=Object.entries(P.values??{}),J=Object.entries(P.lists??{}),Y=Object.fromEntries(D.map(([Se])=>[Se,!1])),re={},ie=Object.fromEntries(J.map(([Se])=>[Se,[]])),de=[],fe=[],we=!1,Ce=-1;for(let[Se,Ie]of O.entries()){if(Se<=Ce)continue;if(Ie==="--"){de.push(...O.slice(Se+1));break}if(ep.includes(Ie)){we=!0;continue}let Ee=D.find(([,en])=>en.includes(Ie));if(Ee){Y[Ee[0]]=!0;continue}let qe=j.find(([,en])=>en.includes(Ie));if(qe){let en=O[Se+1];if(en===void 0||en.startsWith("-")){fe.push(`${Ie} requires a value`);continue}re[qe[0]]=en,Ce=Se+1;continue}let Fe=J.find(([,en])=>en.includes(Ie));if(Fe){let en=O.slice(Se+1),on=en.findIndex((an)=>an.startsWith("-")),sn=en.slice(0,on===-1?en.length:on);if(sn.length===0){fe.push(`${Ie} requires at least one value`);continue}ie[Fe[0]]=[...ie[Fe[0]]??[],...sn],Ce=Se+sn.length;continue}if(Ie.startsWith("-")){fe.push(`Unknown option for ${P.label}: ${Ie}`);continue}if(P.positionals==="tail"){de.push(...O.slice(Se));break}de.push(Ie)}if(P.positionals!=="list"&&P.positionals!=="tail")fe.push(...de.map((Se)=>`Unexpected argument for ${P.label}: ${Se}`));return{flags:Y,values:re,lists:ie,positionals:de,help:we,errors:fe}}function Dn(P){for(let O of P)console.error(O);return P.length>0}import{readdirSync as ap,statSync as vs,unlinkSync as lp}from"node:fs";import{basename as bs,dirname as cp,isAbsolute as dp,join as up,relative as pp,resolve as fp,sep as mp}from"node:path";var gs=(P)=>{let O=Date.now()-new Date(P).getTime();if(!Number.isFinite(O))return"";let D=Math.floor(O/60000),j=Math.floor(D/60),J=Math.floor(j/24);if(J>0)return`${J}d ago`;if(j>0)return`${j}h ago`;if(D>0)return`${D}m ago`;return"just now"},ko=(P)=>{let O=(P??"").trim().split(/\s+/).filter((J)=>J&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(J)),D=O[0]?.split("/").pop();if(!D)return null;let j=O[1];return j&&/^[a-z][a-z0-9-]*$/.test(j)?`${D} ${j}`:D};function hs(P){let O=(J)=>`${J.sessionId}
${ko(J.segment||J.command)}`,D=P.filter((J)=>J.decision!=="allow"),j=D.filter((J)=>J.sessionId).reduce((J,Y)=>J.set(O(Y),(J.get(O(Y))??0)+1),new Map);return new Set(D.filter((J)=>J.failureStage||(j.get(O(J))??0)>=2))}import{existsSync as np,readdirSync as tp,readFileSync as rp}from"node:fs";import{join as op}from"node:path";function zn(P,O){try{return tp(P,{withFileTypes:!0,encoding:"utf8"}).flatMap((D)=>{let j=op(P,D.name);if(D.isDirectory())return zn(j,O);if(D.name.endsWith(".jsonl"))return[j];return[]})}catch{if(O&&np(P))O.count++;return[]}}var ip=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function sp(P){if(!P||typeof P!=="object"||Array.isArray(P))return!1;let O=P;if(typeof O.ts!=="string"||typeof O.command!=="string")return!1;return ip.every((D)=>O[D]===void 0||typeof O[D]==="string")}function kt(P,O){try{return rp(P,"utf-8").split(`
`).filter(Boolean).flatMap((D)=>{try{let j=JSON.parse(D);if(!sp(j)){if(O)O.count++;return[]}return[j]}catch{if(O)O.count++;return[]}})}catch{if(O)O.count++;return[]}}function hn(P){return Array.from(P,(O)=>{let D=O.charCodeAt(0);if(D<=31||D>=127&&D<=159)return`\\x${D.toString(16).padStart(2,"0")}`;return O}).join("")}function gp(P,O){let D=oe(P),j=gn({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},O);if(Dn(j.errors))return null;if(j.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(j.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let J=j.values.limit===void 0?20:ys(j.values.limit);if(J===null)return console.error("--limit must be a positive number"),null;let Y=j.values.since===void 0?Math.min(30,D):ys(j.values.since);if(Y===null||Y>D)return console.error(`--since must be a positive number of days no greater than ${D}`),null;let re={limit:J,limitExplicit:j.values.limit!==void 0,since:Y,sinceExplicit:j.values.since!==void 0,all:j.flags.all,json:j.flags.json,suspect:j.flags.suspect,pruneLegacy:j.flags.pruneLegacy,dryRun:j.flags.dryRun,id:j.values.id,agent:j.values.agent,rule:j.values.rule,session:j.values.session,project:j.values.project===void 0?void 0:fp(j.values.project)};if(re.id&&(re.agent!==void 0||re.rule!==void 0||re.session!==void 0||re.project!==void 0||re.suspect||re.sinceExplicit||re.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(re.pruneLegacy&&(re.id!==void 0||re.agent!==void 0||re.rule!==void 0||re.session!==void 0||re.project!==void 0||re.suspect||re.all||re.sinceExplicit||re.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(re.dryRun&&!re.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return re}async function ws(P,O,D={}){let j=gp(P,O);if(!j)return 1;let J=D.logsDir??U(P);if(j.pruneLegacy)return hp(J,j.json,j.dryRun);if(!J)return console.log(j.json?"[]":j.id?`No retained audit log entry found for id ${hn(j.id)}.`:"No audit log entries found."),0;K(P,J);let Y={count:0},re=zn(J,Y).flatMap((Ce)=>kt(Ce,Y).map((Se)=>({entry:Se,file:Ce})));if(Y.count>0)console.error(`warning: ${Y.count} audit log ${Y.count===1?"source":"sources"} could not be read; these results are incomplete`);if(j.id)return wp(re,j,D.timeZone);let ie=Date.now()-j.since*24*60*60*1000,de=re.filter((Ce)=>kp(Ce,j,J,ie)),fe=j.suspect?hs(de.map((Ce)=>Ce.entry)):null,we=(fe?de.filter((Ce)=>fe.has(Ce.entry)):de).sort((Ce,Se)=>Date.parse(Se.entry.ts)-Date.parse(Ce.entry.ts)).slice(0,j.limit);if(j.json)return console.log(JSON.stringify(we.map((Ce)=>Ce.entry),null,2)),0;if(we.length===0)return console.log("No audit log entries found."),0;for(let Ce of we)console.log(Sp(Ce.entry,D.timeZone));return 0}function hp(P,O,D){let j=P?vp(P).map((ie)=>up(P,ie)):[];if(D)return yp(j,O);let J=[],Y=0,re=0;for(let ie of j){let de=vs(ie,{throwIfNoEntry:!1})?.size??0,fe=bp(ie);if(fe){J.push(`${bs(ie)}: ${fe}`);continue}Y++,re+=de}if(O)return console.log(JSON.stringify({removedFiles:Y,removedBytes:re,failedFiles:J.length})),J.length===0?0:1;console.log(Y===0&&J.length===0?"No legacy audit log files found.":`Removed ${Y} legacy audit log ${Y===1?"file":"files"} (${ks(re)}).`);for(let ie of J)console.error(`Could not remove ${hn(ie)}`);if(console.log("Nested v2 audit logs were not changed."),Y>0)console.log("This deletion cannot be undone.");return J.length===0?0:1}function yp(P,O){let D=P.reduce((j,J)=>j+(vs(J,{throwIfNoEntry:!1})?.size??0),0);if(O)return console.log(JSON.stringify({dryRun:!0,files:P.length,bytes:D})),0;if(console.log(P.length===0?"No legacy audit log files found.":`Would remove ${P.length} legacy audit log ${P.length===1?"file":"files"} (${ks(D)}).`),console.log("Nested v2 audit logs are not included."),P.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function vp(P){try{return ap(P,{withFileTypes:!0}).filter((O)=>O.isFile()&&O.name.endsWith(".jsonl")).map((O)=>O.name)}catch{return[]}}function bp(P){try{return lp(P),null}catch(O){return O instanceof Error?O.message:String(O)}}function ks(P){let O=["B","KiB","MiB","GiB"],D=Math.min(Math.floor(Math.log2(Math.max(P,1))/10),O.length-1);return`${Math.round(P/1024**D*10)/10} ${O[D]}`}function wp(P,O,D){let j=P.filter((Y)=>Y.entry.id===O.id);if(j.length>1)return console.error(`Multiple audit log entries found for id ${hn(O.id??"")}.`),1;if(O.json)return console.log(JSON.stringify(j.map((Y)=>Y.entry),null,2)),0;let J=j[0];if(!J)return console.log(`No retained audit log entry found for id ${hn(O.id??"")}.`),0;return console.log(Rp(J.entry,D)),0}function kp(P,O,D,j){if(!O.all&&P.entry.decision==="allow")return!1;if(Date.parse(P.entry.ts)<j)return!1;if(O.agent!==void 0&&P.entry.agent!==O.agent)return!1;if(O.rule!==void 0&&P.entry.ruleId!==O.rule)return!1;if(O.session!==void 0&&!xp(P,D,O.session))return!1;if(O.project!==void 0&&!Cp(P.entry.cwd,O.project))return!1;return!0}function xp(P,O,D){if(P.entry.sessionId===D)return!0;return cp(P.file)===O&&bs(P.file,".jsonl")===D}function Cp(P,O){if(!P)return!1;let D=pp(O,P);return D!==".."&&!D.startsWith(`..${mp}`)&&!dp(D)}function Sp(P,O){let D=hn(P.id??"-"),j=hn(P.decision??"deny"),J=P.cwd?`  [${hn(P.cwd)}]`:"",Y=P.segment||P.command,re=Y===P.command?"":"↳ ",ie=Y.length>50?`${Y.slice(0,50)}…`:Y;return`${D.padEnd(16)}  ${hn(xs(P.ts,O))}  ${j.padEnd(5)}  ${hn(P.agent??"-").padEnd(15)}  ${hn(P.ruleId??"-").padEnd(20)}  ${re}${hn(ie)}${J}`}function Rp(P,O){let D=(J)=>hn(J===void 0||J===null||J===""?"-":J),j=P.shape?`${P.agent??"-"} (shape: ${P.shape})`:P.agent??"-";return[`id:        ${D(P.id)}`,`ts:        ${D(xs(P.ts,O))}`,`decision:  ${D(P.decision)}`,`agent:     ${D(j)}`,`level:     ${D(P.level)}`,`tool:      ${D(P.toolName)}`,`rule:      ${D(P.ruleId)}`,`intent:    ${D(P.intent)}`,`stage:     ${D(P.failureStage)}`,`error:     ${D(P.errorCode)}`,`session:   ${D(P.sessionId)}`,`cwd:       ${D(P.cwd)}`,`version:   ${D(P.v)}`,`truncated: ${D(P.truncated===!0?"yes":void 0)}`,`reason:    ${D(P.reason)}`,`command:   ${D(P.command)}`,`segment:   ${D(P.segment)}`].join(`
`)}function xs(P,O){let D=new Date(P);if(Number.isNaN(D.getTime()))return P;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:O}).format(D)}function ys(P){let O=Number(P);return Number.isFinite(O)&&O>0?O:null}var Cs={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var Ss={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var Rs={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var xo=["npx","--offline","--no-install","@deepseek-ai/dsh","--version"],pr=[{id:"antigravity-cli",displayName:"Antigravity CLI",doctorOrder:3,runtime:{order:1,flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:2,flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",doctorOrder:1,runtime:{order:2,displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{order:3,flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",doctorOrder:4,runtime:{order:3,flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{order:4,flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",doctorOrder:10,runtime:{order:8,flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{order:10,flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",doctorOrder:9,runtime:{order:7,flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{order:9,flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",doctorOrder:11,runtime:{order:9,flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{order:11,flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",doctorOrder:12,runtime:{order:10,flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{order:12,flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",doctorOrder:13,runtime:{order:11,flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{order:13,flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",doctorOrder:14,install:{order:14,flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",doctorOrder:15,install:{order:15,flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",doctorOrder:16,install:{order:16,flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",doctorOrder:5,runtime:{order:4,flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{order:5,flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"deepseek-harness",displayName:"DeepSeek Harness",doctorOrder:6,install:{order:6,flag:"--deepseek-harness",artifactKind:"package",probeCommand:xo}},{id:"devin",displayName:"Devin CLI",doctorOrder:7,runtime:{order:5,flags:["-dv","--devin"],description:"Run as Devin CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:7,flag:"--devin",artifactKind:"hook config",probeCommand:["devin","--version"]}},{id:"droid",displayName:"Factory Droid",doctorOrder:8,runtime:{order:6,flags:["-fd","--droid"],description:"Run as Factory Droid PreToolUse hook",legacyTopLevelFlags:[]},install:{order:8,flag:"--droid",artifactKind:"hook config",probeCommand:["droid","--version"]}},{id:"amp",displayName:"Amp Code",doctorOrder:2,install:{order:1,flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],fr=pr.slice().sort((P,O)=>P.doctorOrder-O.doctorOrder).map((P)=>P.id),Ht=pr.filter((P)=>("runtime"in P)).slice().sort((P,O)=>P.runtime.order-O.runtime.order).map((P)=>({id:P.id,displayName:"displayName"in P.runtime?P.runtime.displayName:P.displayName,flags:P.runtime.flags,legacyFlags:"legacyFlags"in P.runtime?P.runtime.legacyFlags:[],description:P.runtime.description,legacyTopLevelFlags:P.runtime.legacyTopLevelFlags})),En=pr.slice().sort((P,O)=>P.install.order-O.install.order).map((P)=>({id:P.id,...P.install})).map(({order:P,...O})=>O),Pp=Object.fromEntries(pr.map((P)=>[P.id,P.displayName]));function mn(P){return Pp[P]}var Ep=Ht.map((P)=>({flags:P.flags.join(", "),description:P.description})),Ap=Ht.flatMap((P)=>P.flags.map((O)=>`cc-safety-net hook ${O}`)),Ps={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Ep,{flags:"-h, --help",description:"Show this help"}],examples:Ap};var Es={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...En.map((P)=>({flags:P.flag,description:`Install ${mn(P.id)} ${P.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...En.map((P)=>`cc-safety-net install ${P.flag}`)]},As={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...En.map((P)=>({flags:P.flag,description:`Uninstall ${mn(P.id)} ${P.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...En.map((P)=>`cc-safety-net uninstall ${P.flag}`)]},Is={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var _s={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var mr={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var Co=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],So=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],xt={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},...Co.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk",...So,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var Ts={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var $s={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var gr=[Ts,Cs,_s,Ss,xt,mr,Es,Is,As,Ps,Rs,$s];function Ip(P){return P.aliases??[]}function hr(P){let O=P.toLowerCase();return gr.find((D)=>D.name.toLowerCase()===O||Ip(D).some((j)=>j.toLowerCase()===O))}import{existsSync as ch}from"node:fs";import{basename as _p}from"node:path";function yr(P,O=7,D=U(P)){let j=Date.now()-O*24*60*60*1000,J=[],Y=new Set,re=0,ie,de,fe,we;if(D)K(P,D);let Ce={count:0},Se=D?zn(D,Ce):[];for(let Ee of Se)for(let qe of kt(Ee,Ce)){if(qe.decision==="allow")continue;let Fe=new Date(qe.ts).getTime();if(Fe>=j){if(re++,Y.add(qe.sessionId??_p(Ee,".jsonl")),de===void 0||Fe<=de)ie=qe.ts,de=Fe;if(we===void 0||Fe>we)fe=qe.ts,we=Fe;Tp(J,qe,Fe)}}let Ie=J.map((Ee)=>({timestamp:Ee.ts,command:Ee.command,reason:Ee.reason,relativeTime:gs(new Date(Ee.ts))}));return{totalBlocked:re,sessionCount:Y.size,recentEntries:Ie,oldestEntry:ie,newestEntry:fe,unreadable:Ce.count}}function Tp(P,O,D){let j=P.findIndex((J)=>D>new Date(J.ts).getTime());if(j===-1){if(P.length<3)P.push(O);return}if(P.splice(j,0,O),P.length>3)P.pop()}import{dirname as Bp}from"node:path";import{dirname as $p,join as Op,resolve as Dp}from"node:path";var Lp="config.json";function wn(P,O,D,j){g(Np(P),`${JSON.stringify(O,null,2)}
`,D,j)}function Np(P){return typeof P==="string"?se(P):P}function Po(P){return{errors:ce(Fp(P),": "," "),ruleNames:new Set(De(P).map((O)=>O.toLowerCase()))}}var jp="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",Os="must match pattern (letters, numbers, hyphens, underscores)";function Fp(P){if(!Ds(P))return[e([],"Config must be an object")];return[...P.version===1?[]:[e(["version"],"must be 1")],...Hp(P.rules)]}function Hp(P){if(P===void 0)return[];if(!Array.isArray(P))return[e(["rules"],"must be an array")];return[...P.flatMap((O,D)=>Ds(O)?Mp(O,["rules",D]):[e(["rules",D],"must be an object")]),...Oe(P)]}function Mp(P,O){return[...Ro(P.name,[...O,"name"],"required string",d,jp),...Ro(P.command,[...O,"command"],"required string",w,Os),...P.subcommand===void 0?[]:Ro(P.subcommand,[...O,"subcommand"],"must be a string if provided",w,Os),...Up(P.block_args,[...O,"block_args"]),...Gp(P.reason,[...O,"reason"]),...P.intent===void 0||Te(P.intent)?[]:[e([...O,"intent"],Re)]]}function Ro(P,O,D,j,J){if(typeof P!=="string")return[e(O,D)];return j.test(P)?[]:[e(O,J)]}function Up(P,O){if(!Array.isArray(P))return[e(O,"required array")];if(P.length===0)return[e(O,"must have at least one element")];return P.flatMap((D,j)=>{if(typeof D!=="string")return[e([...O,j],"must be a string")];return D===""?[e([...O,j],"must not be empty")]:[]})}function Gp(P,O){if(typeof P!=="string")return[e(O,"required string")];if(P==="")return[e(O,"must not be empty")];return P.length>I?[e(O,`must be at most ${I} characters`)]:[]}function Ds(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}function Eo(P){let O=Ls(P);if(!O.ok)return O.result;return Po(O.parsed)}function Ls(P){let O=[],D=new Set;try{let j=typeof P==="string"?se(P):P,J=r(j);if(J===null)return O.push(`File not found: ${j.path}`),{ok:!1,result:{errors:O,ruleNames:D}};if(!J.trim())return O.push("Config file is empty"),{ok:!1,result:{errors:O,ruleNames:D}};return{ok:!0,parsed:JSON.parse(J)}}catch(j){if(j instanceof o)return O.push(j.message),{ok:!1,result:{errors:O,ruleNames:D}};let J=j instanceof Error?j.message:String(j);return O.push(j instanceof SyntaxError?"Invalid JSON":J),{ok:!1,result:{errors:O,ruleNames:D}}}}function vr(P){return Dp(P,".safety-net.json")}function Un(P){let O=Ls(P);if(!O.ok)return O.result;let D=Ze(O.parsed);return{errors:D.errors,ruleNames:D.sources}}function Ct(P,O={}){return Op($p(ke(P,O)),Lp)}function Ns(P,O,D){let j;try{if(r(O)===null)return{path:P,exists:!1,valid:!1,ruleCount:0};j=Un(O),j.errors.push(...B(P,D))}catch(J){if(!(J instanceof o))throw J;j={errors:[J.message],ruleNames:new Set}}return{path:P,exists:!0,valid:j.errors.length===0,ruleCount:j.ruleNames.size,...j.errors.length>0?{errors:j.errors}:{}}}function qp(P,O){return{source:O,name:P.name,command:P.command,subcommand:P.subcommand,blockArgs:[...P.block_args],reason:P.reason}}function js(P,O){let D=W(P),j=_(O),J=Bp(D),Y=Q(P,{cwd:O,userConfigPath:D,projectConfigPath:j,userConfigDir:J}),re=X(P,{cwd:O,userConfigPath:D,projectConfigPath:j,userConfigDir:J}),ie=new Map(Y.rulebooks.flatMap((de)=>de.rules.map((fe)=>[fe,de.source])));return{userConfig:Ns(D,re.userConfigTarget,re.userScope),projectConfig:Ns(j,re.projectConfigTarget,re.projectScope),effectiveRules:Y.rules.map((de)=>qp(de,ie.get(de.name)??"project"))}}var Vp=[{flag:n.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:n.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:n.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:n.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:n.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:n.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:n.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:n.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"},{flag:n.projectTightenOnly,description:"Ignore project policy settings that weaken the user policy",defaultBehavior:"off"}];function Fs(P){return[...Vp.map((O)=>({name:O.flag.name,value:pe(O.flag,P.env),isSet:ot(O.flag,P.env),legacyName:O.flag.legacyName,legacyValue:O.flag.legacyName?P.env.get(O.flag.legacyName):void 0,legacyIsSet:O.flag.legacyName?P.env.get(O.flag.legacyName)!==void 0:void 0,description:O.description,defaultBehavior:O.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:P.env.get("CC_SAFETY_NET_HOME"),isSet:P.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var Hs={error:0,warning:1,info:2},Jp=["policy","config","audit"];function zp(P){return P.map((O)=>{if(O==="ownership")return"is not owned by the current user";if(O==="permissions")return"has unsafe permissions";if(O==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var Kp=[{derive:(P)=>P.hooks.length>0&&P.hooks.every((O)=>!O.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(P)=>P.hooks.filter((O)=>O.inspectionStatus==="failed").map((O)=>{let D=mn(O.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${D} inspection failed`,detail:`Doctor could not verify the ${D} integration configuration.`,fixHint:`Correct the reported ${D} configuration error, then run \`cc-safety-net doctor\` again.`,integration:O.platform}})},{derive:(P)=>P.userConfig.exists&&!P.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:P.userConfig.path}]:[]},{derive:(P)=>P.projectConfig.exists&&!P.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:P.projectConfig.path}]:[]},{derive:(P)=>P.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${P.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(P)=>P.v2Leftovers&&P.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${P.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(P)=>P.legacyConfigs&&P.legacyConfigs.length>0?[{checkId:"config.legacy-ignored",severity:"warning",title:"Legacy inline rule configs are ignored",detail:`CC Safety Net no longer loads these files, so their rules enforce nothing: ${P.legacyConfigs.join(", ")}.`,fixHint:"Run `cc-safety-net rule migrate` to convert them (add `--cleanup` to delete each file once it is converted), then rerun doctor."}]:[]},{derive:(P)=>{let O=P.environment.find((D)=>D.name==="CC_SAFETY_NET_AUDIT_SCOPE");return Ve(O?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...Jp.map((P)=>({derive:(O)=>O.posture.directories.filter((D)=>D.kind===P&&D.status==="unsafe").map((D)=>({checkId:`posture.${P}-directory-unsafe`,severity:"error",title:`${P[0]?.toUpperCase()}${P.slice(1)} directory is unsafe`,detail:`The ${P} directory ${zp(D.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...D.path?{path:D.path}:{}}))})),{derive:(P)=>{let O=[...P.effectiveSafety.weakenedRuleOverrides].sort();return O.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${O.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${O.join(", ")}.`}]:[]}}];function Ms(P){return Kp.flatMap((O,D)=>O.derive(P).map((j,J)=>({finding:j,catalogOrder:D,occurrence:J}))).sort((O,D)=>Hs[O.finding.severity]-Hs[D.finding.severity]||O.catalogOrder-D.catalogOrder||O.occurrence-D.occurrence).map((O)=>O.finding)}function Ln(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var Wp=(P)=>Ln()?`\x1B[32m${P}\x1B[0m`:P,Yp=(P)=>Ln()?`\x1B[33m${P}\x1B[0m`:P,Zp=(P)=>Ln()?`\x1B[34m${P}\x1B[0m`:P,Xp=(P)=>Ln()?`\x1B[36m${P}\x1B[0m`:P,Qp=(P)=>Ln()?`\x1B[31m${P}\x1B[0m`:P,ef=(P)=>Ln()?`\x1B[2m${P}\x1B[0m`:P,nf=(P)=>Ln()?`\x1B[1m${P}\x1B[0m`:P,nn={green:Wp,yellow:Yp,blue:Zp,cyan:Xp,red:Qp,dim:ef,bold:nf},tf="\x1B[0m",rf=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function of(P){let O=P;return()=>(O=(O*1664525+1013904223)%4294967296,O/4294967296)}function sf(P){let O=[...rf],D=of(P);for(let j=O.length-1;j>0;j--){let J=Math.floor(D()*(j+1)),Y=O[j];O[j]=O[J],O[J]=Y}return O}function af(P,O=0){if(!Ln())return"";let D=sf(O);return`\x1B[38;5;${D[P%D.length]}m`}function Us(P,O,D=0){if(!Ln())return`"${P}"`;return`${af(O,D)}"${P}"${tf}`}function br(P){return P==="default"?"built-in default":`${P} policy`}var lf=new RegExp("\x1B\\[[0-9;]*m","g"),Ao=(P)=>P.replace(lf,"").length;function Kn(P){let O=(P.headers??P.rows[0]??[]).map((re,ie)=>{let de=Math.max(...P.rows.map((fe)=>Ao(fe[ie]??"")));return Math.max(Ao(re),de)}),D=(re,ie)=>re+" ".repeat(Math.max(0,ie-Ao(re))),j=(re,ie)=>ie[0]+O.map((de)=>re.repeat(de+2)).join(ie[1])+ie[2],J=(re)=>`│ ${re.map((ie,de)=>D(ie,O[de]??0)).join(" │ ")} │`,Y=P.headers?[`   ${J(P.headers)}`,`   ${j("─",["├","┼","┤"])}`]:[];return[`   ${j("─",["┌","┬","┐"])}`,...Y,...P.rows.map((re)=>`   ${J(re)}`),`   ${j("─",["└","┴","┘"])}`].join(`
`)}function Gs(P){let O=[];O.push("Hook Integration"),O.push(cf(P));let D=[],j=[];for(let J of P){let Y=mn(J.platform);if(J.errors&&J.errors.length>0)for(let re of J.errors)if(J.configured)D.push({platform:Y,message:re});else j.push({platform:Y,message:re})}for(let J of D)O.push(`   Warning (${J.platform}): ${J.message}`);for(let J of j)O.push(nn.red(`   Error (${J.platform}): ${J.message}`));return O.join(`
`)}function cf(P){let O=["Platform","Discovery","Configuration","Inspection"],D=P.map((j)=>{let J=mn(j.platform);if(j.inspectionStatus==="not-inspected"){let de=nn.dim("Not inspected");return[J,de,de,de]}let Y=j.detected?nn.green("Detected"):j.inspectionStatus==="failed"?nn.red("Unknown"):nn.dim("Not detected"),re=j.configured?nn.green("Configured"):j.detected?nn.yellow("Not configured"):j.inspectionStatus==="failed"?nn.red("Unknown"):nn.dim("Not applicable"),ie=j.inspectionStatus==="verified"?nn.green("Verified"):j.inspectionStatus==="failed"?nn.red("Failed"):nn.dim("Not applicable");return[J,Y,re,ie]});return Kn({headers:O,rows:D})}function Bs(P){let D=["Guard Engine Verification",`   Synthetic self-test: ${P.failed>0?nn.red(`${P.passed}/${P.total} FAIL`):nn.green(`${P.passed}/${P.total} passed`)}`],j=P.results.filter((J)=>!J.passed);if(j.length>0){D.push(""),D.push(nn.red("   Failures:"));for(let J of j)D.push(nn.red(`   • ${J.description}`)),D.push(nn.red(`     expected ${J.expected}, got ${J.actual}`))}return D.join(`
`)}function df(P){if(P.length===0)return"   (no custom rules)";let O=["Source","Name","Command","Block Args"],D=P.map((j)=>[j.source,j.name,j.subcommand?`${j.command} ${j.subcommand}`:j.command,j.blockArgs.join(", ")]);return Kn({headers:O,rows:D})}function qs(P){let O=[];if(O.push("Configuration"),O.push(uf(P.userConfig,P.projectConfig)),O.push(""),P.effectiveRules.length>0)O.push(`   Effective rules (${P.effectiveRules.length} total):`),O.push(df(P.effectiveRules));else O.push("   Effective rules: (none - using built-in rules only)");return O.join(`
`)}function uf(P,O){let D=["Scope","Status"],j=(Y)=>{if(!Y.exists)return nn.dim("N/A");if(!Y.valid)return nn.red(`Invalid (${Y.errors?.[0]??"unknown error"})`);return nn.green("Configured")},J=[["User",j(P)],["Project",j(O)]];return Kn({headers:D,rows:J})}function Vs(P){let O=[];return O.push("Environment"),O.push(pf(P)),O.join(`
`)}function Js(P){let O=P.effectiveSafety.policyScopes,D=["Effective Safety",`   Selected preset: ${P.effectiveSafety.selectedPreset}${O?` (${br(O.levelScope)})`:""}`,`   Effective: ${P.effectiveSafety.level}`],j=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[J,Y]of j){let re=P.effectiveSafety.capabilities[J],ie=re.enabled?nn.green("ON"):nn.dim("OFF"),de=re.sources.length>0?` (${re.sources.join(", ")})`:"";D.push(`   ${Y}: ${ie} via ${re.source}${de}`)}if(O&&O.weakenings.length>0){D.push(`   Project policy deltas${O.weakeningsIgnored?" (ignored)":""}:`);for(let J of O.weakenings)D.push(`      ${J}`)}D.push(`   Stored rule customizations: ${P.effectiveSafety.ruleCounts.stored}`),D.push(`   Effective rule customizations: ${P.effectiveSafety.ruleCounts.effective}`);for(let[J,Y]of Object.entries(P.effectiveSafety.ruleOverrides))D.push(`   ${J}: ${Y}`);return D.join(`
`)}function zs(P){let O=["Findings"];if(P.length===0)return O.push("   No findings from inspected doctor facts."),O.join(`
`);for(let D of P){let j=`[${D.severity.toUpperCase()}] ${D.checkId}: ${hn(D.title)}`,J=D.severity==="error"?nn.red:D.severity==="warning"?nn.yellow:nn.blue;if(O.push(`   ${J(j)}`),O.push(`      ${hn(D.detail)}`),D.path)O.push(`      Path: ${hn(D.path)}`);if(D.fixHint)O.push(`      Fix: ${hn(D.fixHint)}`)}return O.join(`
`)}function pf(P){let O=["Variable","Status","Legacy"],D=P.map((j)=>{let J=j.isSet?nn.green("✓"):nn.dim("✗"),Y=j.legacyName&&j.legacyIsSet?`${j.legacyName} ${nn.green("✓")}`:j.legacyName??"";return[j.name,J,Y]});return Kn({headers:O,rows:D})}function Ks(P){let O=[];if(P.totalBlocked===0)O.push("Recent Activity"),O.push("   No blocked commands in the last 7 days"),O.push("   Tip: This is normal for new installations");else O.push(`Recent Activity · last 7 days (${P.totalBlocked} blocked / ${P.sessionCount} sessions)`),O.push(ff(P.recentEntries));if(P.unreadable>0)O.push(`   Warning: ${P.unreadable} audit log ${P.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return O.join(`
`)}function ff(P){let O=["Time","Command"],D=P.map((j)=>{let J=hn(j.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),Y=J.length>40?`${J.slice(0,37)}...`:J;return[j.relativeTime,Y]});return Kn({headers:O,rows:D})}function Ws(P){let O=[];if(O.push("Update Check"),P.latestVersion===null&&!P.error)return O.push(wr([["Status",nn.dim("Skipped")],["Installed",P.currentVersion]])),O.join(`
`);if(P.error)return O.push(wr([["Status",`${nn.yellow("⚠")} Error`],["Installed",P.currentVersion],["Error",nn.dim(P.error)]])),O.join(`
`);if(P.updateAvailable)return O.push(wr([["Status",`${nn.yellow("⚠")} Update Available`],["Current",P.currentVersion],["Latest",nn.green(P.latestVersion??"")]])),O.push(""),O.push("   Run: bunx cc-safety-net@latest doctor"),O.push("   Or:  npx cc-safety-net@latest doctor"),O.join(`
`);return O.push(wr([["Status",`${nn.green("✓")} Up to date`],["Version",P.currentVersion]])),O.join(`
`)}function wr(P){return Kn({rows:P})}function Ys(P){let O=[];return O.push("System Info"),O.push(mf(P)),O.join(`
`)}function mf(P){let O=["Component","Version"],D=(Y)=>{if(Y===null)return nn.dim("not found");return Y},J=[{label:"cc-safety-net",value:P.version},...fr.map((Y)=>({label:mn(Y),value:P.versions[Y]??null})),{label:"Node.js",value:P.nodeVersion},{label:"npm",value:P.npmVersion},{label:"Bun",value:P.bunVersion},{label:"Platform",value:P.platform}].map((Y)=>[Y.label,D(Y.value)]);return Kn({headers:O,rows:J})}function Zs(P){if(P.findings.length===0)return nn.green(`
No findings from inspected doctor facts.`);let O={error:P.findings.filter((Y)=>Y.severity==="error").length,warning:P.findings.filter((Y)=>Y.severity==="warning").length,info:P.findings.filter((Y)=>Y.severity==="info").length},D=["error","warning","info"].filter((Y)=>O[Y]>0).map((Y)=>`${O[Y]} ${Y}`),j=P.findings.length===1?"finding":"findings",J=`
${P.findings.length} ${j}: ${D.join(", ")}.`;if(O.error>0)return nn.red(J);if(O.warning>0)return nn.yellow(J);return nn.blue(J)}import{lstatSync as gf}from"node:fs";import{dirname as Io}from"node:path";function _o(P,O){try{let D=gf(O);if(D.isSymbolicLink())return{kind:P,path:O,status:"unsafe",issues:["symlink"]};if(!D.isDirectory())return{kind:P,path:O,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:P,path:O,status:"unknown",issues:[]};let j=[...D.uid!==process.getuid()?["ownership"]:[],...(D.mode&18)!==0?["permissions"]:[]];return{kind:P,path:O,status:j.length>0?"unsafe":"safe",issues:j}}catch(D){if(typeof D==="object"&&D!==null&&"code"in D&&D.code==="ENOENT")return{kind:P,path:O,status:"not-applicable",issues:[]};return{kind:P,path:O,status:"unknown",issues:[]}}}function Xs(P,O){let D=U(P);return{directories:[_o("policy",Io(Io(O))),_o("config",Io(O)),...D?[_o("audit",D)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as hf}from"node:child_process";import{existsSync as Qs}from"node:fs";import{delimiter as yf,extname as vf,join as bf}from"node:path";import{stripVTControlCharacters as ea}from"node:util";var ta="2.5.2",wf=5000,kf="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function pn(){return ta}function To(P,O){let D=P[O];if(D)return D;let j=Object.keys(P).find((J)=>J.toLowerCase()===O.toLowerCase()&&!!P[J]);return j?P[j]:D}function xf(P){return(To(P,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((O)=>O.length>0)}function Cf(P,O){let D=vf(P)?[P]:[...xf(O).map((j)=>`${P}${j}`),P];if(P.includes("/")||P.includes("\\"))return D.find((j)=>Qs(j))??P;return(To(O,"PATH")??"").split(yf).flatMap((j)=>D.map((J)=>bf(j,J))).find((j)=>Qs(j))??P}function na(P){if(!/[\s"&|<>^]/.test(P))return P;return`"${P.replace(/"/g,'""')}"`}function Wn(P,O){let[D,...j]=P,J=O[kf]==="win32"?"win32":process.platform;if(!D||J!=="win32")return{cmd:D??"",args:j};let Y=Cf(D,O);if(!/\.(?:bat|cmd)$/i.test(Y))return{cmd:Y,args:j};return{cmd:To(O,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",na(Y),...j.map(na)].join(" ")]}}var St=async(P,O=wf)=>{let D=await Sf(P,{timeoutMs:O});if(D.code!==0)return null;return ea(D.stdout).trim()||ea(D.stderr).trim()||null};function Sf(P,O){let[D,...j]=P;if(!D)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((J)=>{try{let Y=Wn([D,...j],process.env),re=hf(Y.cmd,Y.args,{stdio:["ignore","pipe","pipe"]}),ie=!1,de="",fe="";re.stdout.on("data",(Se)=>{de+=Se.toString()}),re.stderr.on("data",(Se)=>{fe+=Se.toString()});let we=(Se)=>{if(ie)return;ie=!0,clearTimeout(Ce),J(Se)},Ce=setTimeout(()=>{re.kill(),we({code:null,stdout:de,stderr:fe})},O.timeoutMs);re.on("close",(Se)=>{we({code:Se,stdout:de,stderr:fe})}),re.on("error",()=>{we({code:null,stdout:de,stderr:fe})})}catch{J({code:null,stdout:"",stderr:""})}})}function kr(P){if(!P)return null;let O=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(P);if(O)return O[1]??null;let D=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(P);if(D)return D[1]??null;return P.split(`
`)[0]?.trim()||null}async function xr(P,O=St,D=process.cwd()){let j=Promise.all(En.map(async(Ce)=>[Ce.id,kr(await O([...Ce.probeCommand]))])),[J,Y,re,ie,de,fe,we]=await Promise.all([j,j.then(async(Ce)=>{let Se=Ce.find(([qe])=>qe==="opencode")?.[1];if(!Se?.startsWith("2.")||!P(Se))return null;let Ie=["--param",`location[directory]=${D}`],Ee=["opencode","api","integration.list",...Ie];return await O(Ee,30000),O(["opencode","api","plugin.list",...Ie],30000)}),O(["codex","plugin","list"],30000),O(["amp","plugins","list"],30000),O(["node","--version"]),O(["npm","--version"]),O(["bun","--version"])]);return{version:ta,versions:Object.fromEntries(J),codexPluginListOutput:re,ampPluginListOutput:ie,openCodePluginListOutput:Y,nodeVersion:kr(de),npmVersion:kr(fe),bunVersion:kr(we),platform:`${process.platform} ${process.arch}`}}function $o(P,O){if(O==="dev")return!1;let D=P.split(".").map(Number),j=O.split(".").map(Number),[J=0,Y=0,re=0]=D,[ie=0,de=0,fe=0]=j;if(J!==ie)return J>ie;if(Y!==de)return Y>de;return re>fe}async function Gn(){let P=pn(),O=new AbortController,D=setTimeout(()=>O.abort(),3000);try{let j=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:O.signal});if(!j.ok)return{currentVersion:P,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${j.status}`};let J=await j.json(),Y=$o(J.version,P);return{currentVersion:P,latestVersion:J.version,updateAvailable:Y}}catch(j){return{currentVersion:P,latestVersion:null,updateAvailable:!1,error:j instanceof Error?j.message:"Network error"}}finally{clearTimeout(D)}}import*as da from"node:readline";var sa=(P)=>`\x1B[${P}B`,Rf=(P)=>`\x1B[${P}A`;var ra=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Pf(P){return new Promise((O)=>setTimeout(O,P))}function Ef(P,O,D){if(!D)return O(P);if(D.aborted)return Promise.resolve();return new Promise((j,J)=>{let Y=()=>D.removeEventListener("abort",re),re=()=>{Y(),j()};D.addEventListener("abort",re,{once:!0}),O(P).then(()=>{Y(),j()},(ie)=>{Y(),J(ie)})})}function Cr(P){return Math.max(0,Math.min(1,P))}function Rt(P){return Math.max(0,Math.min(255,Math.round(P)))}function Oo(P){return P<=0.0031308?12.92*P:1.055*P**0.4166666666666667-0.055}function Af(P,O,D){let j=D*Math.PI/180,J=O*Math.cos(j),Y=O*Math.sin(j),re=(P+0.3963377774*J+0.2158037573*Y)**3,ie=(P-0.1055613458*J-0.0638541728*Y)**3,de=(P-0.0894841775*J-1.291485548*Y)**3;return{blue:Rt(Oo(Cr(-0.0041960863*re-0.7034186147*ie+1.707614701*de))*255),green:Rt(Oo(Cr(-1.2684380046*re+2.6097574011*ie-0.3413193965*de))*255),red:Rt(Oo(Cr(4.0767416621*re-3.3077115913*ie+0.2309699292*de))*255)}}function Do(P,O){let D=(O*P*180/Math.PI%360+360)%360;return Af(0.72,0.15,D)}function aa(P,O=0.1){let D=Do(O,P);return`\x1B[38;2;${D.red};${D.green};${D.blue}m`}function If(P,O){return{blue:Rt(P.blue+(255-P.blue)*O),green:Rt(P.green+(255-P.green)*O),red:Rt(P.red+(255-P.red)*O)}}function la(P,O,D){let j=Math.imul(P+2654435769,2246822507)^Math.imul(O+3266489909,668265263)^Math.imul(D+374761393,2654435761),J=j^j>>>15,Y=Math.imul(J,739982445),re=Y^Y>>>12,ie=Math.imul(re,695872825);return((ie^ie>>>15)>>>0)/4294967296}function _f(P,O,D){let j=Math.floor(la(P,O,D)*ra.length);return ra[j]??"░"}function oa(P){let O=Cr(P);return O*O*O*(O*(O*6-15)+10)}function Tf(P){if(P.length===0)return"";let O=[],D=!1,j="";for(let J of P){let Y=`${J.red};${J.green};${J.blue}`;if(J.bold!==D)O.push(J.bold?"\x1B[1m":"\x1B[22m"),D=J.bold;if(Y!==j)O.push(`\x1B[38;2;${Y}m`),j=Y;O.push(J.character)}return`${O.join("")}\x1B[22m\x1B[39m`}function $f(P,O,D,j,J){return P.map((Y,re)=>({...Do(D,j+O+re/J),bold:!1,character:Y}))}function Of(P,O,D,j,J,Y,re,ie){let de=Math.max(1,j*0.75),fe=Math.min(1,D/de),we=J*oa(fe),Ce=Math.max(0,(D-de)/Math.max(1,j-de)),Se=(1-oa(D/j))*ie*2,Ie=0.35*Math.max(0,1-Ce*2),Ee=fe>=1,qe=Math.min(P.length,Math.ceil(we+2+1));return P.slice(0,qe).map((Fe,en)=>{let on=Do(Y,re+O+en/ie+Se),sn=en+la(O,en,7919)*2-1;if(sn>we+2)return{...on,bold:!1,character:" "};let an=we-sn,rn=0.8*Math.exp(-(an*an)/12.5),fn=Math.min(0.9,rn+Ie),On=!Ee&&sn>we-4;return{...If(on,fn),bold:fn>0.3,character:On?_f(O,en,D):Fe}})}function ia(P){return`\x1B[?2026h${P.map((O,D)=>`\x1B8${D>0?sa(D):""}${Tf(O)}`).join("")}\x1B[?2026l`}async function Lo(P,O={}){if(!P)return;let D=O.output??process.stdout,j=O.sleep??Pf,J=O.seed??0,Y=P.split(`
`).map((we)=>Array.from(we)),re=Math.max(...Y.map((we)=>we.length)),ie=12000*Y.filter((we)=>we.length>0).length/40,de=re>0?Math.max(1,Math.ceil(ie/16.666666666666668)):0,fe=de>0?ie/de:0;D.write(`\x1B[?25l${Y.length>1?`${`
`.repeat(Y.length-1)}${Rf(Y.length-1)}`:""}\x1B7`);try{for(let we=1;we<=de;we+=1){if(O.signal?.aborted)break;D.write(ia(Y.map((Ce,Se)=>Of(Ce,Se,we,de,re,0.1,J,3)))),await Ef(fe,j,O.signal)}}finally{if(D.write(ia(Y.map((we,Ce)=>$f(we,Ce,0.1,J,3)))),D.write("\x1B8"),Y.length>1)D.write(sa(Y.length-1));D.write(`
\x1B[0m\x1B[?25h`)}}var ca=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function Df(P){return Boolean(P.isTTY)}async function Mt(P={}){let O=P.output??process.stdout;if(!Df(O))return;let D=P.input??process.stdin,j={output:O,seed:P.seed??Math.random()*8192,sleep:P.sleep};if(!D.isTTY||typeof D.setRawMode!=="function"){await Lo(ca,j);return}let J=new AbortController,Y=D.readableFlowing===!0,re=D.isRaw===!0,ie=!1,de=(fe,we)=>{if(we.ctrl&&we.name==="c")ie=!0;if(ie||we.name==="return"||we.name==="enter")J.abort()};da.emitKeypressEvents(D),D.on("keypress",de),D.setRawMode(!0),D.resume();try{await Lo(ca,{...j,signal:J.signal})}finally{if(D.off("keypress",de),D.setRawMode(re),!Y)D.pause()}if(!ie)return;if(P.onInterrupt){P.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as Hf}from"node:crypto";import{existsSync as fa}from"node:fs";import{dirname as Sr,join as ma}from"node:path";import{dirname as ua,join as Lf,resolve as Nf}from"node:path";var jf="rule.lock";function Ff(P){return Lf(ua(P),jf)}function pa(P={}){return Nf(P.cwd??process.cwd(),".safety-net.json")}function kn(P,O){let D=O.global?O.userConfigPath??W(P,O):O.projectConfigPath??_(O.cwd??process.cwd()),j=O.global?Je(P,O):Ye(D,O.cwd??process.cwd()),J=Ff(D);return{configDir:ua(D),configPath:D,lockPath:J,filesystemScope:j,configTarget:i(j,D),lockTarget:i(j,J)}}var Mf="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",Uf="cache",Gf="rulebooks";function ga(P,O={}){let D=kn(P,O),j=i(D.filesystemScope,ya(D.configDir)),J=r(D.lockTarget);if(console.log(Mf),J===null&&!fa(j.path))return console.log(`No v2 lock or cache leftovers found in ${Sr(D.configDir)}; nothing to migrate.`),0;let Y=zf(J),re=m(D.configTarget);if(!re.config&&(r(D.configTarget)!==null||Y.size>0))return console.error(`Cannot migrate: the rules config in ${Sr(D.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let ie=re.config?.rules??[];for(let de of ie.flatMap((fe)=>Bf(fe,Y,D,j,O.global===!0)))console.log(de);return H(D.lockTarget),st(j),console.log(`Removed the v2 lock and cache under ${Sr(D.configDir)}.`),0}function ha(P,O){return[...new Set([{cwd:O},{cwd:O,global:!0}].flatMap((D)=>{let j=kn(P,D);return[j.lockPath,ya(j.configDir)]}))].filter((D)=>fa(D))}function Bf(P,O,D,j,J){if(!S(P))return[];let Y=N(P).name,re=i(D.filesystemScope,F(D.configDir,Y)),ie=r(re);if(ie!==null&&qf(ie,Y))return[];let de=O.get(P),fe=de?Vf(de,Y,j.path,D.filesystemScope):null;if(fe===null)return[`Could not migrate ${P} from the v2 cache. Run \`cc-safety-net rule update ${P}${J?" --global":""}\` to vendor it.`];if(g(re,fe),ie!==null)return[`Restored ${P} from the v2 cache over an invalid file.`];return[`Vendored ${P} from the v2 cache.`]}function qf(P,O){let D=xe(P);return!("problem"in D)&&D.rulebook.name===O}function Vf(P,O,D,j){let J=ma(D,Gf,`${Jf(P)}--${P.digest.replace("sha256:","").slice(0,12)}`,ge),Y=r(i(j,J));if(Y===null||Yf(Y)!==P.digest)return null;let re=xe(Y);if("problem"in re||re.rulebook.name!==O)return null;return Y}function ya(P){return ma(Sr(P),Uf)}function Jf(P){return([P.owner,P.repo,P.display_ref,P.name].every((j)=>typeof j==="string"&&j!=="")?`${P.owner}/${P.repo}#${P.display_ref}/${P.name}`:P.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function zf(P){let O=P===null?null:Wf(P),D=va(O)&&Array.isArray(O.rulebooks)?O.rulebooks:[];return new Map(D.filter(Kf).map((j)=>[j.spec,j]))}function Kf(P){return va(P)&&typeof P.spec==="string"&&typeof P.digest==="string"}function va(P){return!!P&&typeof P==="object"}function Wf(P){try{return JSON.parse(P)}catch{return null}}function Yf(P){return`sha256:${Hf("sha256").update(P).digest("hex")}`}var ba="\r\x1B[2K",Zf="\x1B[?25l",Xf="\x1B[39m",Qf="\x1B[?25h",em=100,nm=0.55,tm=80,wa=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function rm(P){return new Promise((O)=>setTimeout(O,P))}async function Rr(P,O={}){let D=O.output??process.stdout;if(!D.isTTY)return P;let j=O.sleep??rm,J=!1,Y=P.then((ie)=>(J=!0,ie),(ie)=>{throw J=!0,ie});if(await Promise.race([Y.then(()=>!0),j(em).then(()=>!1)]))return Y;D.write(Zf);try{for(let ie=0;!J;ie+=1)D.write(`${ba}${aa(ie*nm)}${wa[ie%wa.length]}${Xf} ${O.loadingMessage??"Loading…"}`),await Promise.race([Y,j(tm)]);return await Y}finally{D.write(`${ba}${Qf}`)}}async function Ut(P,O,D,j={}){let J=O();if(P)await D();if(P&&J.ready)await Rr(J.ready,j);return J.finish()}import{stripVTControlCharacters as om}from"node:util";var Pr="amp plugins list",im=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function ka(P){if(!P.ampPluginListOutput)return{platform:"amp",status:"n/a"};let O=om(P.ampPluginListOutput).split(`
`).map((D)=>im.exec(D)?.[1]).find((D)=>D!==void 0);if(!O)return{platform:"amp",status:"n/a"};if(O!=="active")return{platform:"amp",status:"disabled",method:Pr,configPath:Pr,errors:[`Amp personal plugin cc-safety-net is ${O}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:Pr,configPath:Pr}}import{existsSync as dm,readFileSync as um}from"node:fs";import{isAbsolute as qx,join as cm}from"node:path";function Gt(P){return cm(P,".gemini","config","hooks.json")}var pm=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function fm(P){if(!P||typeof P!=="object"||Array.isArray(P))return[];return Object.values(P).flatMap((O)=>{if(!O||typeof O!=="object"||Array.isArray(O))return[];let D=O,j=D.PreToolUse;if(!Array.isArray(j))return[];return j.flatMap((J)=>{if(!J||typeof J!=="object"||Array.isArray(J))return[];let Y=J.hooks;if(!Array.isArray(Y))return[];return Y.flatMap((re)=>{if(!re||typeof re!=="object"||Array.isArray(re))return[];let ie=re.command;if(typeof ie!=="string"||!pm.test(ie))return[];return[{command:ie,enabled:D.enabled!==!1}]})})})}function xa(P){let O=Gt(P.environment.home);if(!dm(O))return{platform:"antigravity-cli",status:"n/a",configPath:O};let D;try{D=fm(JSON.parse(um(O,"utf-8")))}catch(j){return{platform:"antigravity-cli",status:"n/a",configPath:O,errors:[`Failed to parse Antigravity hooks config ${O}: ${j instanceof Error?j.message:String(j)}`]}}if(D.some((j)=>j.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:O};if(D.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:O};return{platform:"antigravity-cli",status:"n/a",configPath:O}}import{join as jo}from"node:path";import{existsSync as mm,lstatSync as gm,readFileSync as hm}from"node:fs";import{join as ym}from"node:path";function Rn(P,O=(D)=>D){if(!mm(P))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(O(hm(P,"utf-8")))}}catch{return{kind:"unreadable"}}}function Nn(P,O){if(P==="~")return O;if(P.startsWith("~/")||P.startsWith("~\\"))return ym(O,P.slice(2));return P}function dn(P){try{return gm(P)}catch{return}}function Er(P,O){let D=dn(O);if(!D)return{platform:P,status:"n/a",configPath:O};if(!D.isSymbolicLink()&&D.isDirectory())return;return{platform:P,status:"n/a",configPath:O,errors:[`${O} is a symlink or not a directory; move or remove it before installing`]}}function tn(P,O){return typeof P==="object"&&P!==null?P[O]:void 0}var No="cc-safety-net@cc-marketplace";function Ar(P){return P.env.get("CLAUDE_CONFIG_DIR")||jo(P.home,".claude")}function Ca(P){return jo(Ar(P),"plugins","installed_plugins.json")}function Sa(P,O){let D=tn(tn(P,"plugins"),O);return Array.isArray(D)&&D.length>0}function Ir(P,O){let D=Rn(Ca(P));return D.kind==="ok"&&Sa(D.value,O)}function Fo(P){let O=Ca(P),D=Rn(O);if(D.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(D.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!Sa(D.value,No))return{platform:"claude-code",status:"n/a"};let j=jo(Ar(P),"settings.json"),J=Rn(j);if(J.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(J.kind==="ok"&&tn(tn(J.value,"enabledPlugins"),No)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:j,errors:[`${No} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:O}}function Ra(P){return Fo(P.environment)}var Pa="Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.";function Ea(P){if(!P.codexPluginListOutput)return{platform:"codex",status:"n/a"};let O=P.codexPluginListOutput.split(`
`).find((D)=>D.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!O)return{platform:"codex",status:"n/a"};if(!O.includes("installed,"))return{platform:"codex",status:"n/a"};if(!O.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex runs only trusted hooks, and doctor cannot check trust. Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."]}}import{existsSync as Or,readdirSync as vm,readFileSync as bm}from"node:fs";import{join as bn}from"node:path";function vn(P){let O="",D=0,j=!1,J=!1,Y=-1;while(D<P.length){let re=P[D],ie=P[D+1];if(J){O+=re,J=!1,D++;continue}if(re==='"'&&!j){j=!0,Y=-1,O+=re,D++;continue}if(re==='"'&&j){j=!1,O+=re,D++;continue}if(re==="\\"&&j){J=!0,O+=re,D++;continue}if(j){O+=re,D++;continue}if(re==="/"&&ie==="/"){while(D<P.length&&P[D]!==`
`)D++;continue}if(re==="/"&&ie==="*"){D+=2;while(D<P.length-1){if(P[D]==="*"&&P[D+1]==="/"){D+=2;break}D++}continue}if(re===","){Y=O.length,O+=re,D++;continue}if(re==="}"||re==="]"){if(Y!==-1){let de=O.slice(Y+1);if(/^\s*$/.test(de))O=O.slice(0,Y)+de}Y=-1,O+=re,D++;continue}if(!/\s/.test(re))Y=-1;O+=re,D++}return O}function Ia(P,O,D){let j=O+1,J=!1;while(j<P.length){if(J){J=!1,j++;continue}if(P[j]==="\\"){J=!0,j++;continue}if(P[j]==='"')return j+1;j++}throw Error(D)}function Mo(P,O,D){let j=P[O],J=j==="["?"]":"}",Y=0,re=O;while(re<P.length){let ie=D.skipComment?.(P,re)??re;if(ie!==re){re=ie;continue}if(P[re]==='"'){re=Ia(P,re,D.stringError);continue}if(P[re]===j)Y++;if(P[re]===J){if(Y--,Y===0)return re}re++}throw Error(D.bracketError)}function _a(P,O){let D=P.lastIndexOf(`
`,O)+1;return/^[ \t]*/.exec(P.slice(D))?.[0]??""}function Ta(P,O){let D=O.end+(/^\s*/.exec(P.slice(O.end))?.[0].length??0);if(P[D]===","){let re=P[D+1]===`
`?D+2:D+1;return`${P.slice(0,O.start)}${P.slice(re)}`}let j=P.slice(0,O.start).search(/\s*$/)-1;if(P[j]!==",")return`${P.slice(0,O.start)}${P.slice(O.end)}`;let J=P.lastIndexOf(`
`,j-1),Y=J!==-1&&/^\s*$/.test(P.slice(J+1,j))?J:j;return`${P.slice(0,Y)}${P.slice(O.end)}`}function Ho(P,O){if(P.startsWith("//",O)){let D=P.indexOf(`
`,O+2);return D===-1?P.length:D+1}if(P.startsWith("/*",O)){let D=P.indexOf("*/",O+2);return D===-1?P.length:D+2}return O}function Aa(P,O){let D=O;while(D<P.length){if(/\s/.test(P[D]??"")){D++;continue}let j=Ho(P,D);if(j===D)return D;D=j}return D}function $a(P,O,D){let j=0,J=0;while(J<P.length){let Y=Ho(P,J);if(Y!==J){J=Y;continue}if(P[J]==='"'){let re=Ia(P,J,D.stringError);if(j===1&&JSON.parse(P.slice(J,re))===O){let ie=Aa(P,re),de=Aa(P,ie+1);if(P[ie]===":"&&P[de]==="[")return{start:de,end:Mo(P,de,{skipComment:Ho,...D})}}J=re;continue}if(P[J]==="{"||P[J]==="[")j++;if(P[J]==="}"||P[J]==="]")j--;J++}return}var In="cc-safety-net@cc-marketplace",_r=["cc-marketplace","cc-safety-net"],Oa=["_direct","copilot-safety-net"],Da=["cc-marketplace","safety-net"],La="safety-net@cc-marketplace";function Tr(P,O){let D=O.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${D}([^a-z0-9-]|$)`,"m").test(P??"")}function Na(P){return Tr(P,"cc-safety-net@cc-marketplace")}function ja(P){return Tr(P,"cc-marketplace")}function Fa(P){return Tr(P,"copilot-safety-net")}function Ha(P){return Tr(P,"safety-net@cc-marketplace")}function $r(P){if(!P?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(P)}function Ua(P,O){if(!P)return null;let D=P.match(/(\d+)\.(\d+)\.(\d+)/);if(!D)return null;let j=[Number(D[1]),Number(D[2]),Number(D[3])];for(let J=0;J<O.length;J++){let Y=j[J]??0,re=O[J]??0;if(Y!==re)return Y>re}return!0}function wm(P){return Ua(P,[0,0,422])}function km(P){return Ua(P,[1,0,8])}function qt(P){return P.env.get("COPILOT_HOME")||bn(P.home,".copilot")}function Uo(P){return(P.hooks?.preToolUse??[]).some((D)=>{if(D.type!==void 0&&D.type!=="command")return!1;return $r(D.command)||$r(D.bash)||$r(D.powershell)||$r(D.exec&&[D.exec,...D.args??[]].join(" "))})}function Bt(P){return P===void 0||typeof P==="string"}function xm(P){return P===void 0||Array.isArray(P)&&P.every((O)=>typeof O==="string")}function Cm(P){if(!P||typeof P!=="object"||Array.isArray(P))return!1;let O=P;if(O.disableAllHooks!==void 0&&typeof O.disableAllHooks!=="boolean")return!1;if(O.hooks===void 0)return!0;if(!O.hooks||typeof O.hooks!=="object"||Array.isArray(O.hooks))return!1;let D=O.hooks.preToolUse;if(D===void 0)return!0;return Array.isArray(D)&&D.every((j)=>j!==null&&typeof j==="object"&&!Array.isArray(j)&&Bt(j.type)&&Bt(j.command)&&Bt(j.bash)&&Bt(j.powershell)&&Bt(j.exec)&&xm(j.args))}function Go(P,O){try{let D=JSON.parse(vn(bm(P,"utf-8")));if(!Cm(D)){O?.push(`Invalid hook config ${P}: hooks.preToolUse must be an array of hook objects`);return}return D}catch(D){O?.push(`Failed to parse ${P}: ${D instanceof Error?D.message:String(D)}`);return}}function Ga(P,O){try{return vm(P).filter((D)=>D.endsWith(".json")).sort((D,j)=>D.localeCompare(j))}catch(D){return O?.push(`Failed to read ${P}: ${D instanceof Error?D.message:String(D)}`),[]}}function Sm(P,O){if(!Or(P))return[];let D=[];for(let j of Ga(P,O)){let J=bn(P,j),Y=Go(J,O);if(Y&&Uo(Y))D.push(J)}return D}function Pt(P,O){if(!Or(P))return;let D=Go(P,O);if(!D)return;return{path:P,config:D}}function Ma(P,O,D,j){if(O){P.push(`GitHub Copilot CLI ${O} does not support ${D}; requires ${j}+`);return}P.push(`GitHub Copilot CLI version unavailable; skipping ${D} because it requires ${j}+`)}function Rm(P){for(let O of P){if(O?.config.disableAllHooks===!0)return O.path;if(O?.config.disableAllHooks===!1)return}return}function Pm(P,O,D,j){let J=qt(P),Y=bn(O,".github","hooks"),re=bn(J,"hooks"),ie=bn(O,".github","copilot"),de=bn(O,".claude"),fe=km(D),we=fe===!0?j:void 0,Ce=[Pt(bn(ie,"settings.local.json"),we),Pt(bn(ie,"settings.json"),we),Pt(bn(de,"settings.local.json"),we),Pt(bn(de,"settings.json"),we)],Se=[Pt(bn(J,"settings.json"),we),Pt(bn(J,"config.json"),we)];if(fe!==!1){let an=Rm([...Ce,...Se]);if(an){if(fe===null)j.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${an} as active`);return{activeConfigPaths:[],repoInlineSources:Ce,disabledBy:an}}}let Ie=Sm(Y,j),Ee=wm(D),qe=Ee===!0?j:void 0,Fe=Or(re)?Ga(re,qe):[],en=[];for(let an of Fe){let rn=bn(re,an),fn=Go(rn,qe);if(fn&&Uo(fn))en.push(rn)}if(Ee!==!0&&en.length>0)Ma(j,D,`user hook files in ${re}`,"0.0.422"),en.length=0;let on=[];for(let an of[...Ce,...Se]){if(!an)continue;if(!Uo(an.config))continue;if(fe===!0){on.push(an);continue}Ma(j,D,"inline hook definitions in Copilot config files","1.0.8");break}let sn=(an)=>an.filter((rn)=>!!rn&&on.includes(rn)).map((rn)=>rn.path);return{activeConfigPaths:[...sn(Ce),...Ie,...sn(Se),...en],repoInlineSources:Ce}}function Ba(P){let O=[],D=Pm(P.environment,P.cwd,P.copilotCliVersion,O);if(D.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:D.disabledBy,configPaths:[D.disabledBy],errors:O.length>0?O:void 0};let j=qt(P.environment),J=bn(j,"installed-plugins",..._r),Y=Or(J),re=bn(j,"settings.json"),ie=Rn(re,vn),de=(Ie)=>tn(tn(Ie,"enabledPlugins"),In),fe=D.repoInlineSources.find((Ie)=>typeof de(Ie?.config)==="boolean"),we=fe??(ie.kind==="ok"?{path:re,config:ie.value}:void 0);if(Y&&!fe&&ie.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};let Ce=Y&&we!==void 0&&de(we.config)===!1;if(Ce&&D.activeConfigPaths.length===0)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:we.path,errors:[`${In} is installed but not enabled in Copilot CLI`]};let Se=Y&&!Ce;if(Se||D.activeConfigPaths.length>0){let Ie=D.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:Se?"plugin config":"hook config",configPath:Ie??(Se?J:void 0),configPaths:D.activeConfigPaths.length>0?D.activeConfigPaths:void 0,errors:O.length>0?O:void 0}}return{platform:"copilot-cli",status:"n/a",errors:O.length>0?O:void 0}}import{existsSync as Fm,readFileSync as Hm}from"node:fs";import{existsSync as qa,mkdirSync as Tm,readFileSync as $m}from"node:fs";import{dirname as Om,join as Dm}from"node:path";import{existsSync as Em,renameSync as Am,statSync as Im,writeFileSync as _m}from"node:fs";function cn(P,O){let D=`${P}.${process.pid}.tmp`;_m(D,O,Em(P)?{mode:Im(P).mode&511}:{}),Am(D,P)}var xn=Object.fromEntries(Ht.map((P)=>[P.id,`npx -y cc-safety-net hook ${P.flags[1]}`]));var Vt=xn.cursor,Va=30;function Lr(P){return Dm(P.home,".cursor","hooks.json")}function Yn(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function Bo(){return{command:Vt,timeout:Va,failClosed:!0}}function Dr(P){return Yn(P)&&P.command===Vt}function Lm(P){return Object.keys(P).length===3&&P.command===Vt&&P.timeout===Va&&P.failClosed===!0}function Nm(P){try{return JSON.parse($m(P,"utf-8"))}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${P}: ${O.message}`);throw O}}function Ja(P){let O=Nm(P);if(!Yn(O))throw Error(`Cursor hooks config ${P} must be a JSON object`);if(O.version!==1)throw Error(`Cursor hooks config ${P} must set "version": 1`);if(O.hooks!==void 0&&!Yn(O.hooks))throw Error(`Cursor hooks config ${P} "hooks" must be an object`);let D=Yn(O.hooks)?O.hooks.preToolUse:void 0;if(D!==void 0&&!Array.isArray(D))throw Error(`Cursor hooks config ${P} "hooks.preToolUse" must be an array`);return O}function za(P){let O=Yn(P.hooks)?P.hooks.preToolUse:void 0;return Array.isArray(O)?O:[]}function jm(P){if(!P.some(Dr))return[...P,Bo()];return P.reduce((O,D)=>{if(!Dr(D))return O.result.push(D),O;if(!O.inserted)O.result.push(Bo()),O.inserted=!0;return O},{result:[],inserted:!1}).result}function Ka(P,O,D){let j=Yn(O.hooks)?O.hooks:{},J={...O,hooks:{...j,preToolUse:D}};cn(P,`${JSON.stringify(J,null,2)}
`)}function Wa(P){let O=Lr(P);if(!qa(O))return Tm(Om(O),{recursive:!0}),cn(O,`${JSON.stringify({version:1,hooks:{preToolUse:[Bo()]}},null,2)}
`),{path:O,alreadyInstalled:!1};let D=Ja(O),j=za(D),J=j.filter(Dr);if(Yn(D.hooks)&&Array.isArray(D.hooks.preToolUse)&&J.length===1&&J[0]!==void 0&&Lm(J[0]))return{path:O,alreadyInstalled:!0};return Ka(O,D,jm(j)),{path:O,alreadyInstalled:!1}}function Ya(P){let O=Lr(P);if(!qa(O))return{path:O,alreadyInstalled:!1};let D=Ja(O),j=za(D),J=j.filter((Y)=>!Dr(Y));if(J.length===j.length)return{path:O,alreadyInstalled:!1};return Ka(O,D,J),{path:O,alreadyInstalled:!0}}function Mm(P){if(!P||typeof P!=="object"||Array.isArray(P))return[];let O=P.hooks;if(!O||typeof O!=="object"||Array.isArray(O))return[];let D=O.preToolUse;if(!Array.isArray(D))return[];return D.filter((j)=>!!j&&typeof j==="object"&&!Array.isArray(j)&&j.command===Vt)}function Um(P){let O=[];if(P.length>1)O.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let D=P[0];if(D&&D.failClosed!==!0)O.push('Managed hook is missing "failClosed": true; reinstall to repair');if(D&&D.timeout!==30)O.push('Managed hook "timeout" is not 30; reinstall to repair');return O}function Za(P){let O=Lr(P.environment);if(!Fm(O))return{platform:"cursor",status:"n/a",configPath:O};let D;try{D=JSON.parse(Hm(O,"utf-8"))}catch(Y){return{platform:"cursor",status:"n/a",configPath:O,errors:[`Failed to parse Cursor hooks config ${O}: ${Y instanceof Error?Y.message:String(Y)}`]}}let j=Mm(D);if(j.length===0)return{platform:"cursor",status:"n/a",configPath:O};let J=Um(j);return{platform:"cursor",status:"configured",method:"hook config",configPath:O,errors:J.length>0?J:void 0}}import{readdirSync as Gm}from"node:fs";import{join as qo,resolve as Bm}from"node:path";var Vo="cc-safety-net";function Jo(P){let O=P.env.get("DSH_HOME");return qo(O?.trim()?Bm(Nn(O,P.home)):qo(P.home,".dsh"),"profiles")}function Xa(P){let O=Jo(P),D=dn(O)?.isDirectory()?Gm(O,{withFileTypes:!0}).filter((J)=>J.isDirectory()&&J.name!=="node_modules").map((J)=>{let Y=qo(O,J.name,"package.json");return{name:J.name,configPath:Y,manifest:Rn(Y)}}):[];return{installed:D.flatMap((J)=>{if(J.manifest.kind!=="ok")return[];let Y=J.manifest.value;if(tn(tn(Y,"dependencies"),Vo)===void 0)return[];let re=tn(tn(tn(Y,"dsh"),"profile"),"bundles");return[{name:J.name,configPath:J.configPath,enabled:Array.isArray(re)&&re.includes(Vo)}]}),unreadable:D.some((J)=>J.manifest.kind==="unreadable")}}function zo(P){return Xa(P).installed}function Qa(P){let O=Xa(P.environment),D=O.installed.filter((Y)=>Y.enabled),j=O.installed.filter((Y)=>!Y.enabled),J=j.map((Y)=>`${Vo} is installed in the ${Y.name} profile but its bundle is disabled`);if(D.length>0)return{platform:"deepseek-harness",status:"configured",method:"dsh bundle",configPaths:D.map((Y)=>Y.configPath),...J.length>0?{errors:J}:{}};if(j.length>0)return{platform:"deepseek-harness",status:"disabled",method:"dsh bundle",configPaths:j.map((Y)=>Y.configPath),errors:J};return O.unreadable?{platform:"deepseek-harness",status:"not-inspected"}:{platform:"deepseek-harness",status:"n/a"}}import{existsSync as Wm}from"node:fs";import{existsSync as tl,mkdirSync as qm,readFileSync as Vm}from"node:fs";import{dirname as Jm,join as Yo}from"node:path";function Ko(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function Wo(P,O){return Ko(P)&&P.command===O}function el(P,O){return Ko(P)&&Array.isArray(P.hooks)&&P.hooks.some((D)=>Wo(D,O))}function Zn(P,O){return{hooks:[{type:"command",command:P,timeout:O}]}}function jn(P,O){return P.flatMap((D)=>{if(!Ko(D)||!Array.isArray(D.hooks))return[D];let j=D.hooks.filter((J)=>!Wo(J,O));if(j.length===D.hooks.length)return[D];return j.length===0?[]:[{...D,hooks:j}]})}function Et(P,O,D){let j=P.filter((J)=>el(J,O));return j.length===1&&JSON.stringify(j[0])===JSON.stringify(Zn(O,D))}function At(P,O){return P.find((D)=>el(D,O))}function It(P,O,D){let j=Array.isArray(P.hooks)?P.hooks.find((J)=>Wo(J,O)):void 0;return[...P.matcher===void 0||P.matcher===""||P.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...j?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...j?.timeout===D?[]:[`Managed hook "timeout" is not ${D}; reinstall to repair`]]}var Xn=xn.devin,Nr=30,zm={config:{},hooks:{},preToolUse:[]};function jr(P,O=process.platform){let D=O==="win32"?P.env.get("APPDATA")||Yo(P.home,"AppData","Roaming"):P.env.get("XDG_CONFIG_HOME")||Yo(P.home,".config");return Yo(D,"devin","config.json")}function nl(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function Km(P){try{return{ok:!0,value:JSON.parse(vn(Vm(P,"utf-8")))}}catch(O){return{ok:!1,message:O instanceof Error?O.message:String(O)}}}function Zo(P){let O=Km(P);if(!O.ok)return`Failed to parse Devin CLI config ${P}: ${O.message}`;let D=O.value;if(!nl(D))return`Devin CLI config ${P} must be a JSON object`;let j=D.hooks===void 0?{}:D.hooks;if(!nl(j))return`Devin CLI config ${P} "hooks" must be an object`;let J=j.PreToolUse===void 0?[]:j.PreToolUse;if(!Array.isArray(J))return`Devin CLI config ${P} "hooks.PreToolUse" must be an array`;return{config:D,hooks:j,preToolUse:J}}function rl(P){let O=Zo(P);if(typeof O==="string")throw Error(O);return O}function ol(P,O,D){let j={...O.config,hooks:{...O.hooks,PreToolUse:D}};cn(P,`${JSON.stringify(j,null,2)}
`)}function il(P){let O=jr(P),D=tl(O)?rl(O):zm;if(Et(D.preToolUse,Xn,Nr))return{path:O,alreadyInstalled:!0};return qm(Jm(O),{recursive:!0}),ol(O,D,[...jn(D.preToolUse,Xn),Zn(Xn,Nr)]),{path:O,alreadyInstalled:!1}}function sl(P){let O=jr(P);if(!tl(O))return{path:O,alreadyInstalled:!1};let D=rl(O),j=jn(D.preToolUse,Xn);if(JSON.stringify(j)===JSON.stringify(D.preToolUse))return{path:O,alreadyInstalled:!1};return ol(O,D,j),{path:O,alreadyInstalled:!0}}function al(P){let O=jr(P.environment);if(!Wm(O))return{platform:"devin",status:"n/a",configPath:O};let D=Zo(O);if(typeof D==="string")return{platform:"devin",status:"n/a",configPath:O,errors:[D]};let j=At(D.preToolUse,Xn);if(!j)return{platform:"devin",status:"n/a",configPath:O};let J=It(j,Xn,Nr);return{platform:"devin",status:"configured",method:"hook config",configPath:O,errors:J.length>0?J:void 0}}import{existsSync as ng,readFileSync as tg}from"node:fs";import{existsSync as Fr,mkdirSync as Ym,readFileSync as Zm,rmSync as Xm}from"node:fs";import{dirname as Qm,join as ll}from"node:path";var Qn=xn.droid,Hr=30;function Mr(P){return ll(P.home,".factory","hooks.json")}function cl(P){return ll(P.home,".factory","settings.json")}function Xo(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function dl(P){try{return JSON.parse(Zm(P,"utf-8"))}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse Factory Droid hooks config ${P}: ${O.message}`);throw O}}function ul(P){let O=dl(P);if(!Xo(O))throw Error(`Factory Droid hooks config ${P} must be a JSON object`);if(O.PreToolUse===void 0||Array.isArray(O.PreToolUse))return O;throw Error(`Factory Droid hooks config ${P} "PreToolUse" must be an array`)}function eg(P){if(!Fr(P))return{};let O=dl(P);return Xo(O)&&Xo(O.hooks)?O.hooks:{}}function pl(P){return Array.isArray(P.PreToolUse)?P.PreToolUse:[]}function fl(P,O,D){cn(P,`${JSON.stringify({...O,PreToolUse:D},null,2)}
`)}function ml(P){let O=Mr(P),D=Fr(O),j=D?ul(O):eg(cl(P)),J=pl(j);if(D&&Et(J,Qn,Hr))return{path:O,alreadyInstalled:!0};return Ym(Qm(O),{recursive:!0}),fl(O,j,[...jn(J,Qn),Zn(Qn,Hr)]),{path:O,alreadyInstalled:!1}}function gl(P){let O=Mr(P);if(!Fr(O))return{path:O,alreadyInstalled:!1};let D=ul(O),j=pl(D),J=jn(j,Qn);if(JSON.stringify(J)===JSON.stringify(j))return{path:O,alreadyInstalled:!1};let Y=Fr(cl(P));if(J.length===0&&Object.keys(D).length===1&&!Y)return Xm(O),{path:O,alreadyInstalled:!0};return fl(O,D,J),{path:O,alreadyInstalled:!0}}function hl(P){let O=Mr(P.environment);if(!ng(O))return{platform:"droid",status:"n/a",configPath:O};let D;try{D=JSON.parse(tg(O,"utf-8"))}catch(re){return{platform:"droid",status:"n/a",configPath:O,errors:[`Failed to parse Factory Droid hooks config ${O}: ${re instanceof Error?re.message:String(re)}`]}}let j=typeof D==="object"&&D!==null&&"PreToolUse"in D?D.PreToolUse:void 0,J=At(Array.isArray(j)?j:[],Qn);if(!J)return{platform:"droid",status:"n/a",configPath:O};let Y=[...J.commandRegex===void 0||J.commandRegex===""?[]:['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair'],...It(J,Qn,Hr)];return{platform:"droid",status:"configured",method:"hook config",configPath:O,errors:Y.length>0?Y:void 0}}import{existsSync as rg}from"node:fs";import{join as Qo}from"node:path";var ei="gemini-safety-net";function ni(P){let O=Qo(P.home,".gemini","extensions"),D=Qo(O,ei);if(!rg(D))return{platform:"gemini-cli",status:"n/a"};let j=Qo(O,"extension-enablement.json"),J=Rn(j);if(J.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let Y=J.kind==="ok"?tn(tn(J.value,ei),"overrides"):void 0;if(Array.isArray(Y)&&Y.some((ie)=>typeof ie==="string"&&ie.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:j,errors:[`${ei} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:D}}function yl(P){return ni(P.environment)}import{existsSync as ag,readFileSync as lg}from"node:fs";import{existsSync as bl,mkdirSync as og,readFileSync as wl,rmSync as ig}from"node:fs";import{dirname as sg,join as vl}from"node:path";var rt=xn["grok-build"],Gr=30,ti=Zn(rt,Gr);function Br(P){return vl(P.env.get("GROK_HOME")??vl(P.home,".grok"),"hooks","cc-safety-net.json")}function qr(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function kl(P){try{let O=JSON.parse(P);return qr(O)?O:null}catch{return null}}function xl(P){let O=qr(P.hooks)?P.hooks.PreToolUse:void 0;return Array.isArray(O)?O:[]}function Ur(P,O,D){let j=qr(O.hooks)?O.hooks:{};cn(P,`${JSON.stringify({...O,hooks:{...j,PreToolUse:D}},null,2)}
`)}function Cl(P){let O=Br(P);if(!bl(O))return og(sg(O),{recursive:!0}),Ur(O,{},[ti]),{path:O,alreadyInstalled:!1};let D=kl(wl(O,"utf-8"));if(!D)return Ur(O,{},[ti]),{path:O,alreadyInstalled:!1};let j=xl(D);if(Et(j,rt,Gr))return{path:O,alreadyInstalled:!0};return Ur(O,D,[...jn(j,rt),ti]),{path:O,alreadyInstalled:!1}}function Sl(P){let O=Br(P);if(!bl(O))return{path:O,alreadyInstalled:!1};let D=kl(wl(O,"utf-8"));if(!D)return{path:O,alreadyInstalled:!1};let j=xl(D),J=jn(j,rt);if(JSON.stringify(J)===JSON.stringify(j))return{path:O,alreadyInstalled:!1};let Y=qr(D.hooks)?D.hooks:{};if(J.length===0&&Object.keys(D).length===1&&Object.keys(Y).length===1)return ig(O),{path:O,alreadyInstalled:!0};return Ur(O,D,J),{path:O,alreadyInstalled:!0}}function Rl(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}function Pl(P){let O=Br(P.environment);if(!ag(O))return{platform:"grok-build",status:"n/a",configPath:O};let D;try{D=JSON.parse(lg(O,"utf-8"))}catch(re){return{platform:"grok-build",status:"n/a",configPath:O,errors:[`Failed to parse Grok Build hooks config ${O}: ${re instanceof Error?re.message:String(re)}`]}}let j=Rl(D)&&Rl(D.hooks)?D.hooks.PreToolUse:void 0,J=At(Array.isArray(j)?j:[],rt);if(!J)return{platform:"grok-build",status:"n/a",configPath:O};let Y=It(J,rt,Gr);return{platform:"grok-build",status:"configured",method:"hook config",configPath:O,errors:Y.length>0?Y:void 0}}import{readFileSync as Ll}from"node:fs";import{join as Nl}from"node:path";var Pn="cc-safety-net",ri="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",cg=30;function El(P){return`${ri}
# version: ${P}
`}function dg(P){return`${El(P)}name: ${Pn}
version: "${P}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function ug(P){return`${El(P)}"""CC Safety Net guard for Hermes Agent.

Registers pre_tool_call and forwards the tool call to the packaged CC Safety Net
adapter (cc-safety-net hook --hermes-agent) over JSON stdin. The adapter prints nothing
when the call is allowed and an {"action": "block", ...} directive when it is denied.
Every transport and analysis failure is returned as a block that names its cause.
"""

import json
import os
import shutil
import signal
import subprocess

HOOK_EVENT = "pre_tool_call"
SUPPORTED_TOOLS = ("patch", "read_file", "terminal", "write_file")
ANALYZER = [${xn["hermes-agent"].split(" ").map((O)=>`"${O}"`).join(", ")}]
TIMEOUT_SECONDS = ${cg}


def _block(detail):
    return {"action": "block", "message": "CC Safety Net failed closed: " + detail}


def _terminal_cwd(task_id):
    """Return the directory Hermes will run this terminal command in.

    A \`terminal\` call without \`workdir\` runs in the session's own cwd RECORD, not in the
    Hermes process directory: \`_resolve_command_cwd\` in tools/terminal_tool.py returns
    \`workdir or get_session_cwd(session_key) or default_cwd\`, and that record is rewritten
    after every completed command, so it IS the session's \`cd\` state. The session key is
    derived exactly as terminal_tool derives it: the contextvar when set, the raw task_id
    otherwise. No record yet (first command of a session) means \`default_cwd\`, which the local
    terminal backend reads from \`TERMINAL_CWD\` (\`hermes_cli/config.py\` bridges the configured
    \`terminal.cwd\` into it) and only then falls back to the process directory.
    """
    from tools.approval import get_current_session_key
    from tools.terminal_tool import get_session_cwd

    return (
        get_session_cwd(get_current_session_key(default="") or (task_id or ""))
        or os.environ.get("TERMINAL_CWD")
        or os.getcwd()
    )


def _file_tool_cwd(task_id):
    """Return the directory Hermes resolves this file tool's relative paths against.

    tools/file_tools.py passes \`task_id or "default"\` to \`_resolve_base_dir\`, which walks the
    session's cwd record, the task's cwd override, \`TERMINAL_CWD\`, then the process directory.
    tools.file_tools defines it up to v2026.8.31 and re-exports it from tools.file_tools_paths since.
    """
    from tools.file_tools import _resolve_base_dir

    return str(_resolve_base_dir(task_id or "default"))


def _pre_tool_call(tool_name="", args=None, session_id="", task_id="", **_):
    if tool_name not in SUPPORTED_TOOLS:
        return None

    executable = shutil.which(ANALYZER[0])
    if executable is None:
        return _block(ANALYZER[0] + " was not found on PATH.")

    try:
        cwd = _terminal_cwd(task_id) if tool_name == "terminal" else _file_tool_cwd(task_id)
    except OSError as error:
        return _block("the working directory could not be resolved (%s)." % error)
    except ImportError as error:
        # Without Hermes' own directory lookup we cannot tell which directory the call acts in,
        # and analysing the wrong one clears every path-scoped protection.
        return _block(
            "the Hermes %s directory could not be read (%s). Update cc-safety-net and "
            "reinstall the plugin with: npx -y cc-safety-net install --hermes-agent."
            % ("session" if tool_name == "terminal" else "file tool", error)
        )

    payload = json.dumps(
        {
            "hook_event_name": HOOK_EVENT,
            "tool_name": tool_name,
            "tool_input": args if isinstance(args, dict) else None,
            "session_id": session_id if isinstance(session_id, str) else "",
            "cwd": cwd,
        }
    )

    try:
        if os.name == "nt":
            launch_options = {}
        else:
            launch_options = {"start_new_session": True}
        process = subprocess.Popen(
            [executable] + ANALYZER[1:],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            # Decode explicitly: the analyzer writes UTF-8, and a locale decoder would raise
            # UnicodeDecodeError on output it cannot read. "replace" turns that into unreadable
            # output, which blocks with its cause named.
            encoding="utf-8",
            errors="replace",
            # Resolve the analyzer from a neutral directory: npx prefers a repository-local
            # node_modules/.bin/cc-safety-net, so inheriting Hermes' working directory would
            # let workspace contents stand in for the analyzer. The payload's "cwd" above is
            # still the real Hermes working directory, which the analysis needs.
            cwd=os.path.expanduser("~"),
            # Own process group so the timeout below can kill the whole tree: npx's descendants
            # outlive a kill aimed at npx alone and keep holding the pipes captured here. Windows
            # uses taskkill's process-tree traversal instead because sessions are POSIX-only.
            **launch_options,
        )
    except OSError as error:
        return _block("analysis could not start (%s)." % error)

    try:
        stdout, _ = process.communicate(payload, timeout=TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        try:
            if os.name == "nt":
                system_root = os.environ.get("SystemRoot")
                if not system_root:
                    raise OSError("SystemRoot is unavailable")
                subprocess.run(
                    [
                        os.path.join(system_root, "System32", "taskkill.exe"),
                        "/PID",
                        str(process.pid),
                        "/T",
                        "/F",
                    ],
                    stdin=subprocess.DEVNULL,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    timeout=1,
                    check=False,
                )
            else:
                os.killpg(process.pid, signal.SIGKILL)
        except (OSError, subprocess.SubprocessError):
            pass
        try:
            process.communicate(timeout=1)
        except (OSError, subprocess.SubprocessError):
            pass
        return _block("analysis timed out after %ss." % TIMEOUT_SECONDS)

    if process.returncode != 0:
        return _block("analysis exited with status %s." % process.returncode)

    directive = (stdout or "").strip()
    if not directive:
        return None

    try:
        parsed = json.loads(directive)
    except ValueError:
        return _block("analysis returned unreadable output.")

    if isinstance(parsed, dict) and parsed.get("action") == "block":
        message = parsed.get("message")
        if isinstance(message, str) and message:
            return parsed
    return _block("analysis returned an unexpected directive.")


def register(ctx):
    ctx.register_hook("pre_tool_call", _pre_tool_call)
`}function Jt(P){return[{name:"__init__.py",content:ug(P)},{name:"plugin.yaml",content:dg(P)}]}import{mkdirSync as pg,readdirSync as fg,readFileSync as Al,rmSync as oi}from"node:fs";import{basename as mg,dirname as gg,join as Fn}from"node:path";var hg="__pycache__",yg=/^[a-z0-9][a-z0-9_-]{0,63}$/;function vg(P){try{return Al(P,"utf-8").trim()}catch{return}}function ii(P){let O=P.env.get("HERMES_HOME")?.trim();if(O&&mg(gg(O))==="profiles")return O;let D=O||Fn(P.home,".hermes"),j=Fn(D,"active_profile"),J=vg(j),Y=J?.toLowerCase();if(!Y||Y==="default")return D;if(!yg.test(Y))throw Error(`Invalid Hermes profile name "${J}" in ${j}; run \`hermes profile use <name>\` with a valid profile.`);return Fn(D,"profiles",Y)}function si(P){return Fn(ii(P),"plugins",Pn)}function ai(P){return P.startsWith(ri)}function li(P,O){let D=si(P),j=dn(D);if(j&&(j.isSymbolicLink()||!j.isDirectory()))throw Error(`Refusing to ${O} ${D}: not a regular directory. Move or remove it and rerun ${O==="install"?"install":"uninstall"} --hermes-agent.`);return D}function Il(P,O){let D=dn(P);if(!D)return;if(D.isSymbolicLink()||!D.isFile())throw Error(`Refusing to ${O} ${P}: not a regular file. Move or remove it.`);let j=Al(P,"utf-8");if(!ai(j))throw Error(`Refusing to ${O} unmanaged file at ${P}. Move or remove it.`);return j}function _l(P){let O=li(P,"install"),D=Jt(pn());if(D.map((J)=>Il(Fn(O,J.name),"overwrite")).every((J,Y)=>J===D[Y]?.content))return{path:O,alreadyInstalled:!0};return pg(O,{recursive:!0}),D.forEach((J)=>{cn(Fn(O,J.name),J.content)}),{path:O,alreadyInstalled:!1}}function ci(P){let O=li(P,"remove");if(!dn(O))return[];return Jt(pn()).filter((D)=>Il(Fn(O,D.name),"remove")!==void 0)}function Tl(P){let O=li(P,"remove");if(!dn(O))return{path:O,alreadyInstalled:!1};let D=ci(P);if(D.forEach((j)=>{oi(Fn(O,j.name))}),oi(Fn(O,hg),{recursive:!0,force:!0}),fg(O).length===0)oi(O,{recursive:!0});return{path:O,alreadyInstalled:D.length>0}}var zt="hermes-agent",$l=/^([^\s#][^:]*):/,bg=/^\s+([A-Za-z_][\w-]*):/,Ol=/^\s+-\s*(.*)$/;function wg(P){return P.trim().replace(/^(["'])(.*)\1$/,"$2")}function kg(P){let O=P.split(/\r?\n/),D=O.findIndex((Y)=>$l.exec(Y)?.[1]?.trim()==="plugins");if(D===-1)return[];let j=O.slice(D+1),J=j.findIndex((Y)=>$l.test(Y));return J===-1?j:j.slice(0,J)}function Dl(P,O){let D=kg(P),j=D.findIndex((re)=>bg.exec(re)?.[1]===O);if(j===-1)return[];let J=D.slice(j+1),Y=J.findIndex((re)=>!Ol.test(re));return(Y===-1?J:J.slice(0,Y)).map((re)=>wg(Ol.exec(re)?.[1]??""))}function xg(P){try{return Ll(Nl(ii(P),"config.yaml"),"utf-8")}catch{return}}function di(P){let O=xg(P)??"";return Dl(O,"enabled").includes(Pn)&&!Dl(O,"disabled").includes(Pn)}function jl(P){return/^# version:\s*(.+)$/m.exec(P)?.[1]?.trim()}function Cg(P,O){let D=dn(P);if(!D)return{error:`${O.name} is missing from ${P}; run install --hermes-agent`};if(D.isSymbolicLink()||!D.isFile())return{error:`${P} is a symlink or not a regular file; move or remove it`};try{let j=Ll(P,"utf-8");if(!ai(j))return{error:`Unmanaged ${O.name} occupies ${P}; move or remove it`};if(jl(j)===pn()&&j!==O.content)return{error:`Modified ${O.name} occupies ${P}; run install --hermes-agent to restore it`};return{content:j}}catch(j){return{error:`Failed to read ${P}: ${j instanceof Error?j.message:String(j)}`}}}function Sg(P){try{return{path:si(P)}}catch(O){return{error:O instanceof Error?O.message:String(O)}}}function Fl(P){let O=Sg(P.environment);if("error"in O)return{platform:zt,status:"n/a",errors:[O.error]};let D=O.path,j=Er(zt,D);if(j)return j;let J=Jt(pn()).map((de)=>Cg(Nl(D,de.name),de)),Y=J.flatMap((de)=>("error"in de)?[de.error]:[]);if(Y.length>0)return{platform:zt,status:"n/a",configPath:D,errors:Y};let re=J.some((de)=>("content"in de)&&jl(de.content)!==pn()),ie=re?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!di(P.environment))return{platform:zt,status:"disabled",method:"plugin directory",configPath:D,errors:[`${Pn} is not enabled in Hermes; run \`hermes plugins enable ${Pn}\``,...ie]};return{platform:zt,status:"configured",method:"plugin directory",configPath:D,errors:re?ie:void 0}}import{existsSync as Rg,readFileSync as Pg}from"node:fs";import{join as Hl}from"node:path";var Eg=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;function Ag(P){return Hl(P.env.get("KIMI_CODE_HOME")||Hl(P.home,".kimi-code"),"config.toml")}function Kt(P){let O=Ag(P.environment);if(!Rg(O))return{platform:"kimi-code",status:"n/a",configPath:O};try{if(!Eg.test(Pg(O,"utf-8")))return{platform:"kimi-code",status:"n/a",configPath:O}}catch(D){return{platform:"kimi-code",status:"n/a",configPath:O,errors:[`Failed to read ${O}: ${D instanceof Error?D.message:String(D)}`]}}return{platform:"kimi-code",status:"configured",method:"hook config",configPath:O}}import{readFileSync as Wl}from"node:fs";import{join as Yt}from"node:path";var un="cc-safety-net",Sn="index.js",_t="openclaw.plugin.json",Tt="package.json";var Vr="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as Tg,lstatSync as $g,readdirSync as Og,readFileSync as Dg}from"node:fs";import{dirname as Ul,join as Bn}from"node:path";import{fileURLToPath as Lg}from"node:url";import{spawn as Ig}from"node:child_process";function _g(P){return P.join(" ")}function ui(P,O,D){return[`Failed to run ${_g(P)}${O===null?"":` (exit ${O})`}.`,D.trim()].filter(Boolean).join(`
`)}function pi(P){let O={stdout:"",stderr:""};return P.stdout.setEncoding("utf-8"),P.stderr.setEncoding("utf-8"),P.stdout.on("data",(D)=>{O.stdout+=D}),P.stderr.on("data",(D)=>{O.stderr+=D}),O}function yn(P,O){return new Promise((D,j)=>{let J=Wn([...P],process.env),Y=Ig(J.cmd,J.args,{stdio:["ignore","pipe","pipe"]}),re=pi(Y),ie=()=>[re.stdout,re.stderr].filter(Boolean).join(`
`),de=O?.timeoutMs??120000,fe=setTimeout(()=>{Y.kill(),j(Error(ui(P,null,`Timed out after ${de}ms.
${ie()}`.trim())))},de);Y.on("error",(we)=>{clearTimeout(fe),j(Error(ui(P,null,`${we.message}
${ie()}`.trim())))}),Y.on("close",(we)=>{if(clearTimeout(fe),we!==0){j(Error(ui(P,we,ie())));return}D(O?.stdoutOnly?re.stdout:ie())})})}async function fi(P){for(let O of P)await yn(O)}async function Ml(P){for(let O of P)try{await yn(O)}catch(D){console.warn(D instanceof Error?D.message:String(D))}}var mi=Bn("openclaw",un),it=`run \`openclaw plugins enable ${un}\``,Ng="config reload superseded by a newer runtime config source",jg=[Sn,_t,Tt];function Gl(P){let O=P.env.get("OPENCLAW_HOME")?.trim();return O?Nn(O,P.home):P.home}function Bl(P){let O=Gl(P),D=P.env.get("OPENCLAW_STATE_DIR")?.trim();if(D)return Nn(D,O);let j=P.env.get("OPENCLAW_CONFIG_PATH")?.trim();return j?Ul(Nn(j,O)):Bn(O,".openclaw")}function ql(P){let O=P.env.get("OPENCLAW_CONFIG_PATH")?.trim();return O?Nn(O,Gl(P)):Bn(Bl(P),"openclaw.json")}function Wt(P){return Bn(Bl(P),"extensions",un)}function Fg(P){let O=Og(P);if(O.length===0)return!0;if(O.some((J)=>!jg.includes(J)))return!1;let D=Bn(P,Sn),j=dn(D);return j!==void 0&&!j.isSymbolicLink()&&j.isFile()&&Dg(D,"utf-8").startsWith(Vr)}function gi(P){let O=Wt(P),D=dn(O);if(!D)return;if(!D.isSymbolicLink()&&D.isDirectory()&&Fg(O))return;throw Error(`Refusing to modify ${O}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function Vl(){let P=Ul(Lg(import.meta.url));return[Bn(P,mi),Bn(P,"..",mi),Bn(P,"..","..","..","dist",mi)]}function hi(P=Vl()){return P.find((O)=>Tg(O)&&$g(O).isDirectory())}function Hg(P=Vl()){let O=hi(P);if(!O)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return O}function Jl(P=Hg()){return[["openclaw","plugins","install",P,"--force","--accept-capabilities"]]}function Mg(P){let O=(()=>{try{return JSON.parse(P)}catch{return}})(),D=tn(tn(O,"plugin"),"status");return typeof D==="string"?D:void 0}async function Ug(){await yn(["openclaw","plugins","enable",un]).catch((P)=>{if(!(P instanceof Error&&P.message.includes(Ng)))throw P})}async function zl(P){let O=async()=>Mg(await yn(["openclaw","plugins","inspect",un,"--runtime","--json"],{stdoutOnly:!0})),D=await O(),j=D==="disabled"&&P;if(j)await Ug();let J=j?await O():D;if(J==="loaded")return;throw Error(`${J===void 0?`The ${un} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:J==="disabled"?`OpenClaw reports the ${un} plugin with status "disabled"; ${it}.`:`OpenClaw reports the ${un} plugin with status "${J}".`} Run \`openclaw plugins inspect ${un} --runtime\` for details.`)}var Jr="openclaw";function $t(P,O){let D=Yt(P,O),j=dn(D);if(!j)return{error:`${O} is missing from ${D}; run install --openclaw`};if(j.isSymbolicLink()||!j.isFile())return{error:`${D} is a symlink or not a regular file; move or remove it`};try{return{content:Wl(D,"utf-8")}}catch(J){return{error:`Failed to read ${D}: ${J instanceof Error?J.message:String(J)}`}}}function Yl(P){try{return JSON.parse(vn(P))}catch{return}}function Gg(P){let O=$t(P,_t);if("error"in O)return O.error;if(tn(Yl(O.content),"id")===un)return;return`${Yt(P,_t)} is not a valid ${un} manifest; run install --openclaw`}function Bg(P){let O=$t(P,Tt);if("error"in O)return O.error;let D=tn(tn(Yl(O.content),"openclaw"),"extensions");if(Array.isArray(D)&&D.includes(`./${Sn}`))return;return`${Yt(P,Tt)} does not point OpenClaw at ${Sn}; run install --openclaw`}function Kl(P){return Array.isArray(P)?P.filter((O)=>typeof O==="string"):[]}function qg(P){let O=ql(P);if(!dn(O))return`${un} is not enabled; ${it}`;let D=(()=>{try{return JSON.parse(vn(Wl(O,"utf-8")))}catch{return}})();if(D===void 0)return`Failed to read ${O}; fix it, then ${it}`;let j=tn(D,"plugins");if(tn(j,"enabled")===!1)return`plugins.enabled is false in ${O}; no OpenClaw plugin loads`;let J=tn(tn(tn(j,"entries"),un),"enabled");if(Kl(tn(j,"deny")).includes(un)||J===!1)return`${un} is disabled in ${O}; ${it}`;let Y=Kl(tn(j,"allow"));if(Y.length>0&&!Y.includes(un))return`plugins.allow in ${O} does not list ${un}; add it, then ${it}`;if(Y.includes(un)||J===!0)return;return`${un} is not enabled; ${it}`}function Zl(P){return/^\/\/ version:\s*(.+)$/m.exec(P)?.[1]?.trim()}function Vg(P,O,D){if(D===void 0)return[];let j=$t(D,Sn);if(!(("content"in j)&&Zl(j.content)===O))return[];return[Sn,_t,Tt].flatMap((Y)=>{let re=$t(P,Y),ie=$t(D,Y);if("error"in re||"error"in ie||re.content===ie.content)return[];return[`Modified ${Y} occupies ${Yt(P,Y)}; run install --openclaw to restore it`]})}function Xl(P){let O=Wt(P.environment),D=Er(Jr,O);if(D)return D;let j=$t(O,Sn),Y=["error"in j?j.error:j.content.startsWith(Vr)?void 0:`Unmanaged ${Sn} occupies ${Yt(O,Sn)}; move or remove it`,Gg(O),Bg(O)].filter((we)=>we!==void 0),re="content"in j?Zl(j.content):void 0,ie=Y.length>0?Y:Vg(O,re,hi());if(ie.length>0)return{platform:Jr,status:"n/a",configPath:O,errors:ie};let de=re===pn()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],fe=qg(P.environment);if(fe)return{platform:Jr,status:"disabled",method:"plugin directory",configPath:O,errors:[fe,...de]};return{platform:Jr,status:"configured",method:"plugin directory",configPath:O,errors:de.length>0?de:void 0}}import{existsSync as eh,readFileSync as nh}from"node:fs";import{basename as th}from"node:path";import{existsSync as zr,readFileSync as yi,rmSync as Jg}from"node:fs";import{join as _n}from"node:path";import{pathToFileURL as zg}from"node:url";var Zt="cc-safety-net",pt=`${Zt}@latest`,vi=["opencode.json","opencode.jsonc"],Kg=60,Wg=250,Ql="CCSafetyNetPlugin",Yg={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function ec(P){return _n(P.env.get("XDG_CONFIG_HOME")||_n(P.home,".config"),"opencode")}function bi(P){return P.env.get("OPENCODE_CONFIG_DIR")||ec(P)}function wi(P){return vi.map((O)=>_n(bi(P),O))}function ki(P){return[...new Set([bi(P),ec(P)])].flatMap((O)=>vi.map((D)=>_n(O,D)))}function nc(P){return _n(P.env.get("XDG_CACHE_HOME")||_n(P.home,".cache"),"opencode","packages",pt)}function tc(P){Jg(nc(P),{recursive:!0,force:!0})}async function rc(P){let O=(await yn(["opencode","--version"],{stdoutOnly:!0})).trim(),D=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(O),j=Number(D?.[1]),J=Number(D?.[2]),Y=Number(D?.[3]);if(!D||j!==1&&j!==2||j===1&&(J<18||J===18&&Y<29)||j===2&&J===0&&Y<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${O||"an unknown version"}.`);if(j===2){for(let re of wi(P)){if(!zr(re))continue;let ie=Ci(yi(re,"utf-8"),re);if(["plugin","plugins"].some((fe)=>{let we=tn(ie,fe);return Array.isArray(we)&&we.some((Ce)=>Kr(Ce)&&(typeof Ce==="string"?Ce:tn(Ce,"package"))!==pt)}))throw Error(`Change the cc-safety-net package spec in ${re} to ${pt}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[],afterInstall:async()=>{if((await yn(["opencode","plugin","add",pt],{stdoutOnly:!0})).includes("is already configured in"))await yn(["opencode","plugin","update",pt]);let ie=await sc();if(!/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(ie))throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.");let de=["--param",`location[directory]=${process.cwd()}`];await yn(["opencode","api","integration.list",...de]);let fe=await yn(["opencode","api","plugin.list",...de],{stdoutOnly:!0}),we=xi(fe);if(we)throw Error(we);if(!oc(fe).some(ic))throw Error("OpenCode lists no active cc-safety-net for this directory. Run `opencode api plugin.list` for details.")}}}return tc(P),{commands:[["opencode","plugin","-g","-f",pt]],afterInstall:()=>Xg(P)}}function oc(P){return Zg(P).filter((O)=>tn(O,"id")===Zt||Kr(tn(tn(O,"source"),"target"))).map((O)=>tn(O,"state"))}function ic(P){return tn(P,"status")==="active"}function xi(P){let O=oc(P);if(O.some(ic))return;let D=O.find((j)=>tn(j,"status")==="failed");if(!D)return;return`OpenCode reports cc-safety-net failed: ${String(tn(D,"error")).split(`
`)[0]}`}function Zg(P){if(!P)return[];try{let O=tn(JSON.parse(P),"data");return Array.isArray(O)?O:[]}catch{return[]}}async function sc(P=1){let O=await yn(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s|\scc-safety-net@latest\s*$/m.test(O)||P===Kg)return O;return await new Promise((D)=>setTimeout(D,Wg)),sc(P+1)}async function Xg(P){let O=_n(nc(P),"node_modules",Zt),D=_n(O,"package.json");if(!zr(D))throw Error(`The OpenCode plugin cache at ${O} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${pt}\` for details.`);let j=tn(JSON.parse(yi(D,"utf-8")),"main");if(typeof j!=="string")throw Error(`The cached OpenCode plugin at ${O} declares no "main" entry.`);let J=_n(O,j);if(typeof(await import(zg(J).href))[Ql]==="function")return;throw Error(`The cached OpenCode plugin at ${J} does not export a callable ${Ql}, so OpenCode would load nothing and fail open.`)}function Ci(P,O){try{return JSON.parse(vn(P))}catch(D){if(D instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${O}: ${D.message}`);throw D}}function Kr(P){let O=typeof P==="string"?P:tn(P,"package");return typeof O==="string"&&(O===Zt||O.startsWith(`${Zt}@`))}function Si(P){return["plugin","plugins"].some((O)=>{let D=tn(P,O);return Array.isArray(D)&&D.some(Kr)})}function Qg(P,O){let j=["plugin","plugins"].flatMap((J)=>{let Y=$a(P,J,Yg);if(!Y)return[];let re=[],ie=0,de=Y.start+1,fe=P.slice(Y.start+1,Y.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let we of fe){if(we[0].startsWith("//")||we[0].startsWith("/*"))continue;let Ce=Y.start+1+we.index;if(ie===0)de=Ce;if(we[0]==="{"||we[0]==="[")ie++;if(we[0]==="}"||we[0]==="]")ie--;if(ie!==0||we[0]===",")continue;let Se=Ce+we[0].length;if(Kr(JSON.parse(vn(P.slice(de,Se)))))re.push({start:de,end:Se})}return re}).sort((J,Y)=>J.start-Y.start).reverse().reduce((J,Y)=>{let re=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(J.slice(Y.end));if(re?.[0].includes("/")){let ie=Y.end+re[0].length-1;return J.slice(0,Y.start)+J.slice(Y.end,ie)+J.slice(ie+1)}return Ta(J,Y)},P);return Ci(j,O),j}function ac(P){tc(P);let O=ki(P),D=O.find((Y)=>zr(Y)),j=[],J=[];for(let Y of O){if(!zr(Y))continue;try{let re=yi(Y,"utf-8");if(!Si(Ci(re,Y)))continue;cn(Y,Qg(re,Y)),J.push(Y)}catch(re){j.push(re instanceof Error?re.message:String(re))}}if(j.length>0)throw Error(j.join(`
`));return{path:J[0]??D??_n(bi(P),vi[0]),alreadyInstalled:J.length>0}}function Ot(P){let O=[];for(let D of P.openCodeVersion?.startsWith("2.")?wi(P.environment):ki(P.environment))if(eh(D))try{let j=nh(D,"utf-8"),J=vn(j),Y=JSON.parse(J);if(Si(Y)){let re=xi(P.openCodePluginListOutput);if(re)return{platform:"opencode",status:"disabled",method:"opencode api plugin.list",configPath:D,errors:[...O,re]};return{platform:"opencode",status:"configured",method:"plugin array",configPath:D,errors:O.length>0?O:void 0}}}catch(j){O.push(`Failed to parse ${th(D)}: ${j instanceof Error?j.message:String(j)}`)}return{platform:"opencode",status:"n/a",errors:O.length>0?O:void 0}}import{join as lc}from"node:path";function Ri(P){let O=P.env.get("PI_CODING_AGENT_DIR");return lc(O?Nn(O,P.home):lc(P.home,".pi","agent"),"settings.json")}function Pi(P){if(typeof P!=="string")return!1;return P==="npm:cc-safety-net"||P.startsWith("npm:cc-safety-net@")}function cc(P){let O=Ri(P.environment),D=Rn(O);if(D.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(D.kind==="missing")return{platform:"pi",status:"n/a"};let j=tn(D.value,"packages");if(!Array.isArray(j))return{platform:"pi",status:"n/a"};let J=j.find((ie)=>Pi(typeof ie==="string"?ie:tn(ie,"source")));if(J===void 0)return{platform:"pi",status:"n/a"};let Y=tn(J,"extensions");if(Array.isArray(Y)&&Y.some((ie)=>typeof ie==="string"&&ie.startsWith("-")))return{platform:"pi",status:"disabled",method:"package config",configPath:O,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:O}}var rh={amp:ka,"antigravity-cli":xa,"claude-code":Ra,codex:Ea,"copilot-cli":Ba,cursor:Za,"deepseek-harness":Qa,devin:al,droid:hl,"gemini-cli":yl,"grok-build":Pl,"hermes-agent":Fl,"kimi-code":Kt,openclaw:Xl,opencode:Ot,pi:cc};function Dt(P,O,D){let j={...D,cwd:O,environment:P};return fr.map((J)=>oh(rh[J](j)))}function oh(P){if(P.status==="not-inspected")return{platform:P.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:P.platform,detected:P.status!=="n/a",configured:P.status==="configured",inspectionStatus:P.status!=="n/a"?"verified":P.errors&&P.errors.length>0?"failed":"not-applicable",method:P.method,configPath:P.configPath,configPaths:P.configPaths,errors:P.errors}}import{join as ih}from"node:path";var sh=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),ah=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),safety:Object.freeze({}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),lh={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function dc(P){let O=ih(P.tmpdir,"cc-safety-net-self-test"),D=sh.map((j)=>{let J=G(P,u("self-test",{command:j.command},{kind:"command",shell:"auto"},{configCwd:O,executionCwd:O},j.command),{guard:{dependencies:{loadPolicySnapshot:()=>ah,getModes:()=>lh,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),Y=j.expectBlocked?"blocked":"allowed",re=J.decision.kind==="deny"?"blocked":"allowed";return{command:j.command,description:j.description,expected:Y,actual:re,passed:Y===re,reason:J.decision.kind==="deny"?J.decision.reason:void 0,ruleId:J.decision.kind==="deny"?J.decision.ruleId:void 0}});return{passed:D.filter((j)=>j.passed).length,failed:D.filter((j)=>!j.passed).length,total:D.length,results:D}}function Ei(P){let O=gn({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},P);if(Dn(O.errors))return null;return{json:O.flags.json,skipUpdateCheck:O.flags.skipUpdateCheck}}async function uc(P,O={}){let D=await Ut(!O.json,()=>{let j=dh(P,O);return{ready:j,finish:()=>j}},()=>Mt(),{loadingMessage:"Checking system status…"});if(O.json)console.log(JSON.stringify(D,null,2));else uh(D);return D.engineSelfTest.failed>0||D.findings.some((j)=>j.severity==="error")?1:0}async function dh(P,O){let D=O.cwd??process.cwd(),j=await xr((Fe)=>Ot({environment:P,cwd:D,openCodeVersion:Fe}).status!=="n/a",void 0,D),J=Dt(P,D,{ampPluginListOutput:j.ampPluginListOutput,codexPluginListOutput:j.codexPluginListOutput,copilotCliVersion:j.versions["copilot-cli"],openCodeVersion:j.versions.opencode,openCodePluginListOutput:j.openCodePluginListOutput}),Y=js(P,D),re=Fs(P),ie=E(P,{cwd:D}),de=ie.policy,fe=T(de,P.env),we=V(de,fe.capabilities),Ce=yr(P,7),Se=ha(P,D),Ie=[vr(D),Ct(P)].filter((Fe)=>ch(Fe)),Ee=O.skipUpdateCheck?{currentVersion:pn(),latestVersion:null,updateAvailable:!1}:await Gn(),qe={hooks:J,engineSelfTest:dc(P),userConfig:Y.userConfig,projectConfig:Y.projectConfig,configState:je(ie),effectiveRules:Y.effectiveRules,environment:re,effectiveSafety:{selectedPreset:de.safety.level??"standard",level:fe.effectiveLevel,capabilities:fe.capabilities,ruleOverrides:de.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(we).filter(([,Fe])=>Fe.source==="rule_override"&&Fe.override==="off"&&Fe.inheritedEnabled&&Fe.changesInherited).map(([Fe])=>Fe),ruleCounts:{stored:Object.keys(de.destructiveCommandRuleOverrides).length,effective:Object.values(we).filter((Fe)=>Fe.changesInherited).length},...ie.policyScopes?{policyScopes:ie.policyScopes}:{}},...Se.length>0?{v2Leftovers:Se}:{},...Ie.length>0?{legacyConfigs:Ie}:{},posture:Xs(P,Y.userConfig.path),activity:Ce,update:Ee,system:j};return{...qe,findings:Ms(qe)}}function uh(P){console.log(),console.log(Gs(P.hooks)),console.log(),console.log(Bs(P.engineSelfTest)),console.log(),console.log(qs(P)),console.log(),console.log(Vs(P.environment)),console.log(),console.log(Js(P)),console.log(),console.log(zs(P.findings)),console.log(),console.log(Ks(P.activity)),console.log(),console.log(Ys(P.system)),console.log(),console.log(Ws(P.update)),console.log(Zs(P))}import{existsSync as ph}from"node:fs";var fh=/^[A-Za-z0-9_@%+=:,./-]+$/,pc="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function Ai(P){let O=gn({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},P);if(Dn(O.errors))return console.error(pc),console.error("Pass -- before a command that starts with dashes."),null;if(O.values.cwd!==void 0&&!ph(O.values.cwd))return console.error(`Error: --cwd path does not exist: ${O.values.cwd}`),null;let D=O.positionals.length===1?O.positionals[0]:O.positionals.map((j)=>fh.test(j)?j:`'${j.replaceAll("'","'\\''")}'`).join(" ");if(!D)return console.error("Error: No command provided"),console.error(pc),null;return{json:O.flags.json,cwd:O.values.cwd,command:D}}function fc(P){if(P)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function mc(P,O){let j=O-18;return[`${P.dtl}${P.dh.repeat(O)}${P.dtr}`,`${P.dv}  Command Analysis${" ".repeat(j)}${P.dv}`,`${P.dbl}${P.dh.repeat(O)}${P.dbr}`]}function Ii(P){return JSON.stringify(P)}function gc(P,O=0){return`[${P.map((j,J)=>Us(j,J,O)).join(",")}]`}function Xt(P,O,D=70){let j=P.split(" "),J=[],Y="";for(let re of j)if(Y&&Y.length+re.length+1>D)J.push(Y),Y=re;else Y=Y?`${Y} ${re}`:re;if(Y)J.push(Y);return J.map((re,ie)=>ie===0?re:`${O}${re}`)}function hc(P,O,D){let j=[];switch(P.type){case"parse":return null;case"env-strip":return j.push(""),j.push(`STEP ${O} ${D.h} Strip environment variables`),j.push(`  Removed: ${P.envVars.map((J)=>`${J}=<redacted>`).join(", ")}`),j.push(`  Tokens:  ${Ii(P.output)}`),{lines:j,incrementStep:!0};case"leading-tokens-stripped":return j.push(""),j.push(`STEP ${O} ${D.h} Strip wrappers`),j.push(`  Removed: ${P.removed.join(", ")}`),j.push(`  Tokens:  ${Ii(P.output)}`),{lines:j,incrementStep:!0};case"shell-wrapper":return j.push(""),j.push(`STEP ${O} ${D.h} Detect shell wrapper`),j.push(`  Wrapper: ${P.wrapper} -c`),j.push(`  Inner:   ${P.innerCommand}`),{lines:j,incrementStep:!0};case"interpreter":{if(j.push(""),j.push(`STEP ${O} ${D.h} Detect interpreter`),j.push(`  Interpreter: ${P.interpreter}`),j.push(`  Code:        ${P.codeArg}`),P.paranoidBlocked)j.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:j,incrementStep:!0}}case"busybox":return j.push(""),j.push(`STEP ${O} ${D.h} Busybox wrapper`),j.push(`  Subcommand: ${P.subcommand}`),{lines:j,incrementStep:!0};case"transparent-wrapper":return j.push(""),j.push(`STEP ${O} ${D.h} Transparent wrapper`),j.push(`  Wrapper: ${P.wrapper}`),j.push(`  Tokens:  ${Ii(P.output)}`),{lines:j,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(j.push(""),j.push(`STEP ${O} ${D.h} Match rules`),j.push(`  Rule:   ${P.rule}()`),P.matched)j.push("  Result: MATCHED");else j.push("  Result: No match");return{lines:j,incrementStep:!0}}case"worktree-relaxation":return j.push(""),j.push(`STEP ${O} ${D.h} Worktree relaxation`),j.push(`  Mode:   ${n.worktree.name}`),j.push(`  Git cwd: ${P.gitCwd}`),j.push("  Result: Allowed local discard in linked worktree"),{lines:j,incrementStep:!0};case"temp-root-relaxation":return j.push(""),j.push(`STEP ${O} ${D.h} Temp-root relaxation`),j.push(`  Git cwd: ${P.gitCwd}`),j.push("  Result: Allowed git discard in a temp-root repository"),{lines:j,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(P.embeddedCommandFound)return j.push(""),j.push(`STEP ${O} ${D.h} Fallback scan`),j.push(`  Found: ${P.embeddedCommandFound}`),{lines:j,incrementStep:!0};return null}case"custom-rules-check":{if(P.rulesChecked){if(j.push(""),j.push(`STEP ${O} ${D.h} Custom rules`),P.matched)j.push("  Result: MATCHED");else j.push("  Result: No match");return{lines:j,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(P.matched)return j.push(""),j.push(`STEP ${O} ${D.h} Dangerous text check`),j.push(`  Token:  ${P.token}`),j.push("  Result: MATCHED"),{lines:j,incrementStep:!0};return null}case"strict-unparseable":return j.push(""),j.push(`STEP ${O} ${D.h} Strict mode check`),j.push(`  Command: ${P.rawCommand}`),j.push("  Result:  ✗ UNPARSEABLE"),{lines:j,incrementStep:!0};case"segment-skipped":return null;case"error":return j.push(""),j.push(`ERROR: ${P.message}`),{lines:j,incrementStep:!1};default:return P}}function _i(P,O){let D=fc(O?.asciiOnly??!1),j=58,J=[],Y=1;J.push(...mc(D,58)),J.push("");let re=P.trace.steps.find((Ee)=>Ee.type==="error");if(re&&re.type==="error"){J.push("ERROR"),J.push(`  ${re.message}`),J.push(""),J.push("RESULT"),J.push(`  Status: ${P.result==="blocked"?nn.red("BLOCKED"):nn.green("ALLOWED")}`),J.push(""),J.push("CONFIG");let Ee=P.configSource??"none";return J.push(`  Path: ${Ee}`),J.join(`
`)}let ie=P.trace.steps.find((Ee)=>Ee.type==="parse");if(ie&&ie.type==="parse"){J.push("INPUT"),J.push(`  ${ie.input}`),J.push(""),J.push(`STEP ${Y} ${D.h} Split shell commands`),Y++;for(let Ee=0;Ee<ie.segments.length;Ee++){let qe=ie.segments[Ee];if(qe){let Fe=Math.random();J.push(`  Segment ${Ee+1}: ${gc(qe,Fe)}`)}}}let de=P.trace.segments,fe=de.length>1;for(let Ee of de){if(fe){J.push("");let on="";if(ie&&ie.type==="parse"){let wo=ie.segments[Ee.index];if(wo)on=wo.join(" ")}let sn=54,an=on,rn=` Segment ${Ee.index+1}: `,fn=" ";if(on){if(rn.length+on.length+fn.length>sn){let Qu=sn-rn.length-fn.length;an=`${on.substring(0,Qu-1)}…`}}let On=on?`${rn}${an}${fn}`:` Segment ${Ee.index+1} `,Zu=on?`${rn}${nn.cyan(an)}${fn}`:On,fs=58-On.length,ms=Math.floor(fs/2),Xu=fs-ms;J.push(`${D.sh.repeat(ms)}${Zu}${D.sh.repeat(Xu)}`)}if(Ee.steps.find((on)=>on.type==="segment-skipped")){J.push(""),J.push("  (skipped — prior segment blocked)");continue}let Fe=!1,en=!1;for(let on of Ee.steps){let sn=hc(on,Y,D);if(sn){if(en=!0,on.type==="recurse"){J.push("");let an=" RECURSING ",rn=58-an.length-4;J.push(`  ${D.tl}${D.h}${an}${D.h.repeat(rn)}`),J.push(`  ${D.v}`),Fe=!0;continue}for(let an of sn.lines)if(Fe)J.push(`  ${D.v} ${an}`);else J.push(an);if(sn.incrementStep)Y++}}if(Fe)J.push(`  ${D.v}`),J.push(`  ${D.bl}${D.h.repeat(56)}`);if(!en)J.push(""),J.push(`  ${nn.green("✓")} Allowed (no matching rules)`)}if(J.push(""),J.push("RESULT"),P.result==="blocked"){if(J.push(`  Status: ${nn.red("BLOCKED")}`),P.customRule){if(J.push(`  Rule: ${P.customRule.id}`),P.customRule.rulebook)J.push(`  Rulebook: ${P.customRule.rulebook.name} ${P.customRule.rulebook.version}`);if(P.customRule.source)J.push(`  Source: ${P.customRule.source}`);if(P.customRule.override)J.push(`  Override: reason ${P.customRule.override.reason}`)}if(P.reason){let Ee=Xt(P.reason,"          ");J.push(`  Reason: ${Ee[0]}`);for(let qe=1;qe<Ee.length;qe++)J.push(Ee[qe]??"")}}else J.push(`  Status: ${nn.green("ALLOWED")}`);J.push(""),J.push("CONFIG");let we=P.configSource??"none",Ce=P.configValid?"":" (invalid)";J.push(`  Path: ${we}${Ce}`);let Se=P.safetyPresetScope;J.push(`  Safety preset: ${P.selectedPreset??"standard"}${Se?` (${br(Se)})`:""}`),J.push(`  Effective capabilities: ${P.effectiveLevel}`);let Ie=Object.entries(P.destructiveCommandRuleOverrides??{});if(J.push(`  Rule customizations: ${Ie.length}`),P.ruleActivation)J.push(`  Rule activation: ${P.ruleActivation.id} — ${P.ruleActivation.enabled?"on":"off"} via ${P.ruleActivation.source}`);return J.join(`
`)}function Ti(P){return JSON.stringify(P,null,2)}import{resolve as vh}from"node:path";var mh=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function yc(P){let O=0,D={allocateSegment(){return O++},getNextSegmentIndex(){return O},recordGlobal(j){P.record({kind:"step",scope:"global",step:j})},recordSegment(j,J=D.currentSegmentIndex){if(J===void 0)return;P.record({kind:"step",scope:"segment",segmentIndex:J,step:j})}};return D}function vc(P={}){let O=[],D=P.maxEvents??512,j={maxTextLength:P.maxTextLength??2048,maxListLength:P.maxListLength??128,maxObjectProperties:P.maxObjectProperties??P.maxListLength??128,maxDepth:P.maxDepth??16},J,Y=new Set;return{record(re){if(J)return;if(!re||O.length>=D)return;try{O.push(Di(gh(re,j,Y)))}catch{}},finish(){if(J)return J;return J=Di({events:Object.freeze(O)}),J}}}function gh(P,O,D){if(P.kind!=="step")throw TypeError("invalid trace event");let{scope:j,step:J}=P;Wr(J,D,O);let Y=$i(J,O,D);if(j==="global")return{kind:"step",scope:"global",step:Y};if(j!=="segment")throw TypeError("invalid trace event scope");return{kind:"step",scope:"segment",segmentIndex:P.segmentIndex,step:Y}}function Wr(P,O,D,j=0,J=new WeakSet){if(typeof P==="string"){let ie=P.slice(0,D.maxTextLength);if(!ze(ie))return;for(let de of nt(ie))for(let fe of de.match(/[^\s"'()$]+/g)??[])O.add(bc(fe));return}if(!P||typeof P!=="object"||j>=D.maxDepth||J.has(P))return;if(J.add(P),Array.isArray(P)){let ie=Math.min(P.length,D.maxListLength);for(let de=0;de<ie;de++)Wr(P[de],O,D,j+1,J);return}let Y=0,re=new Set;for(let ie in P){if(!Object.hasOwn(P,ie))continue;if(Y>=D.maxObjectProperties)break;Y++,Wr(ie,O,D);let de=Oi(ie,D,O);if(re.has(de))continue;re.add(de),Wr(P[ie],O,D,j+1,J)}}function $i(P,O,D,j=0,J=new WeakSet){if(typeof P==="string")return Oi(P,O,D);if(!P||typeof P!=="object")return P;if(j>=O.maxDepth)return;if(J.has(P))return;if(J.add(P),Array.isArray(P)){let ie=[],de=Math.min(P.length,O.maxListLength);for(let fe=0;fe<de;fe++)ie.push($i(P[fe],O,D,j+1,J));return ie}let Y={},re=0;for(let ie in P){if(!Object.hasOwn(P,ie))continue;if(re>=O.maxObjectProperties)break;re++;let de=Oi(ie,O,D);if(Object.hasOwn(Y,de))continue;Object.defineProperty(Y,de,{value:$i(P[ie],O,D,j+1,J),enumerable:!0,configurable:!0,writable:!0})}return Y}function Oi(P,O,D){let j=P.slice(0,O.maxTextLength),J=ze(j)?Be(j):j,Y=D.size>0?yh(J,D):J;return(hh(Y)?Pe(Y):Y).slice(0,O.maxTextLength)}function hh(P){return P.includes("PRIVATE KEY")||P.includes("://")||P.includes("eyJ")||P.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(P)||P.length>=14&&mh.some((O)=>P.includes(O))||P.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(P)}function yh(P,O){return P.replace(/[^\s"'()$]+/g,(D)=>O.has(bc(D))?"<redacted>":D)}function bc(P){let O=2166136261,D=2166136261;for(let j=0;j<P.length;j++)O=Math.imul(O^P.charCodeAt(j),16777619),D=Math.imul(D^P.charCodeAt(P.length-j-1),16777619);return`${O>>>0}:${D>>>0}:${P.length}`}function Di(P){if(P&&typeof P==="object"&&!Object.isFrozen(P)){for(let O of Object.values(P))Di(O);Object.freeze(P)}return P}function Qt(P,O={},D){let j=vh(O.cwd??process.cwd()),J=O.policySnapshot??E(D,{cwd:j,userConfigDir:O.userConfigDir}),Y=T(J.policy,D.env),re=Ue({policySnapshot:J,effectiveCapabilities:Y.capabilities,strict:Y.strict,paranoidRm:Y.paranoidRm,paranoidInterpreters:Y.paranoidInterpreters,worktreeMode:Y.worktreeMode}),ie={effectiveLevel:re.effectiveLevel,selectedPreset:J.policy.safety.level??"standard",...J.policyScopes?{safetyPresetScope:J.policyScopes.levelScope}:{},effectiveCapabilities:re.effectiveCapabilities,destructiveCommandRuleOverrides:J.policy.destructiveCommandRuleOverrides},{configSource:de,configValid:fe}=wh(D,{cwd:j,userConfigDir:O.userConfigDir});if(!P||!P.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:de,configValid:fe,...ie};let we=y(P,"auto");if(we.status==="limited")throw new b;let Ce=we.dialect==="powershell"?y(P,"posix"):we,Se=dt(Ce),Ie=vc(),Ee=yc(Ie);Ee.recordGlobal({type:"parse",input:P,segments:Se.map((On)=>[...On])});let qe=u("Bash",{command:P},{kind:"command",shell:"auto"},{configCwd:j,executionCwd:j},P),Fe=q(qe,{environment:D,trace:Ee,dependencies:{loadPolicySnapshot:()=>J}}),en=Fe.decision.kind==="deny"?Fe.decision:null;if(en&&(Fe.stage==="policy-protection"||Fe.stage==="secret-protection"))return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:bh(en),matched:!0,reason:en.reason}]}]},result:"blocked",reason:R(en.reason),segment:R(wc(en,P)),ruleId:R(en.ruleId),configSource:de,configValid:fe,...ie};let on=Ee.getNextSegmentIndex();if(en&&on>0&&on<Se.length)Ee.recordSegment({type:"segment-skipped",index:on,reason:"prior-segment-blocked"},on);let sn=Ie.finish(),an=en?.ruleId??kh(qe,J,Y,D),rn=z.find((On)=>On.id===an&&On.activationCapability),fn=rn?re.policy.effectiveDestructiveCommandRules[rn.id]:void 0;return{trace:Ch(sn),result:en?"blocked":"allowed",reason:en?R(en.reason):void 0,segment:en?R(wc(en,P)):void 0,ruleId:en?R(en.ruleId):void 0,customRule:xh(Sh(en?.ruleId,J)),configSource:de,configValid:fe,...ie,...rn&&fn?{ruleActivation:{id:rn.id,...fn}}:{}}}function wc(P,O){return P.evidence?.segment??O}function bh(P){if(P.reason===He)return"policy-protection:findPolicyConfigMutationTargetInSemanticFacts";if(P.reason===Ge)return"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts";if(P.reason===k)return"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts";return"secret-protection:findSensitiveTargetInSemanticFacts"}function wh(P,O){let D=_(O.cwd),j=W(P,O),J=X(P,{cwd:O.cwd,userConfigDir:O.userConfigDir});try{if(r(J.projectConfigTarget)!==null){if(Un(J.projectConfigTarget).errors.length===0)return{configSource:D,configValid:!0};return{configSource:D,configValid:!1}}}catch(Y){if(Y instanceof o)return{configSource:D,configValid:!1};throw Y}try{if(r(J.userConfigTarget)!==null){let Y=Un(J.userConfigTarget);return{configSource:j,configValid:Y.errors.length===0}}return{configSource:null,configValid:!0}}catch(Y){if(Y instanceof o)return{configSource:j,configValid:!1};throw Y}}function kh(P,O,D,j){let J=O.policy,Y=_e({...J,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...J.destructiveCommandRuleOverrides,...Object.fromEntries(z.flatMap((ie)=>ie.activationCapability?[[ie.id,"on"]]:[]))}},O.state==="degraded"?{diagnostics:O.diagnostics,reason:O.reason}:void 0),re=q(P,{environment:j,dependencies:{loadPolicySnapshot:()=>Y,getModes:()=>({...D,strict:!0,paranoidRm:!0,paranoidInterpreters:!0}),findSensitiveTarget:()=>null}});return re.decision.kind==="deny"?re.decision.ruleId:void 0}function xh(P){if(!P)return;return{id:R(P.id),...P.rulebook?{rulebook:{name:R(P.rulebook.name),version:R(P.rulebook.version)}}:{},...P.source?{source:R(P.source)}:{},...P.override?{override:{type:"reason",reason:R(P.override.reason)}}:{}}}function Ch(P){let O=P.events.flatMap((j)=>j.kind==="step"&&j.scope==="global"?[j.step]:[]),D=new Map;for(let j of P.events){if(j.kind!=="step"||j.scope!=="segment")continue;let J=D.get(j.segmentIndex)??{index:j.segmentIndex,steps:[]};J.steps.push(j.step),D.set(j.segmentIndex,J)}return{steps:O,segments:[...D.values()]}}function Sh(P,O){let D=P?.replace(/^custom\./,"");if(!D||!O.policy.rules.some((j)=>j.name===D))return;return O.ruleMetadata[D]??Object.freeze({id:D})}function kc(P){return new Promise((O)=>{process.stdout.write(`${P}
`,()=>O())})}async function xc(P,O){let D=Ai(O);if(!D)return 1;try{let j=Qt(D.command,{cwd:D.cwd},P),J=!!process.env.NO_COLOR||!process.stdout.isTTY;return await kc(D.json?Ti(j):_i(j,{asciiOnly:J})),0}catch(j){let J=Rh(j instanceof p?j.cause:j);if(J===void 0)throw j;if(D.json)return await kc(JSON.stringify({error:J})),1;return console.error(J),1}}function Rh(P){if(P instanceof b)return P.message;if(P instanceof f)return P.message;if(P instanceof s&&a[P.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var Cc="2.5.2",An="  ",ft="cc-safety-net";function Sc(P){return P.argument?`${P.flags} ${P.argument}`:P.flags}function Ph(P){return Math.max(...P.map((O)=>Sc(O).length))}function Eh(P){return Math.max(...P.map((O)=>O.usage.length))}function Ah(P){return Math.max(...P.map((O)=>`${ft} ${O.usage}`.length))}function Ih(P,O){let D=`${ft} ${P.usage}`;return`${An}${D.padEnd(O+2)}${P.description}`}function Tn(P,O){return`${An}${P.padEnd(Math.max(40,P.length+2))}${O}`}function Lt(P,O=console.log){let D=[];if(D.push(`${ft} ${P.name}`),D.push(""),D.push(`${An}${P.description}`),D.push(""),D.push("USAGE:"),D.push(`${An}${ft} ${P.usage}`),D.push(""),P.subcommands&&P.subcommands.length>0){D.push("SUBCOMMANDS:");let j=Eh(P.subcommands);for(let J of P.subcommands)D.push(`${An}${J.usage.padEnd(j+2)}${J.description}`);D.push("")}if(P.options.length>0){D.push("OPTIONS:");let j=Ph(P.options);for(let J of P.options){let Y=Sc(J),re=J.default?`${J.description} (default: ${J.default})`:J.description;D.push(`${An}${Y.padEnd(j+2)}${re}`)}D.push("")}if(P.examples&&P.examples.length>0){D.push("EXAMPLES:");for(let j of P.examples)D.push(`${An}${j}`)}O(D.join(`
`))}function Li(){let P=Ah(gr),O=[];O.push(`${ft} v${Cc}`),O.push(""),O.push("Blocks destructive commands and secret access."),O.push(""),O.push("COMMANDS:");for(let D of gr)O.push(Ih(D,P));O.push(""),O.push("GLOBAL OPTIONS:"),O.push(`${An}-h, --help       Show help (use with command for command-specific help)`),O.push(`${An}-V, --version    Show version`),O.push(""),O.push("HELP:"),O.push(`${An}${ft} help <command>     Show help for a specific command`),O.push(`${An}${ft} <command> --help   Show help for a specific command`),O.push(""),O.push("ENVIRONMENT VARIABLES:"),O.push(Tn(`${n.level.name}=standard|strict|paranoid`,"Set session safety level")),O.push(Tn(`${n.worktree.name}=1`,"Allow local git discards in linked worktrees")),O.push(Tn(`${n.debug.name}=1`,"Print diagnostic messages to stderr")),O.push(Tn(`${n.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),O.push(Tn(`${n.projectTightenOnly.name}=1`,"Ignore project policy settings that weaken the user policy")),O.push(Tn("CC_SAFETY_NET_HOME","Override rule config home directory")),O.push(""),O.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),O.push(Tn(`${n.strict.name}=1`,"Force safety.overrides.fail_closed on")),O.push(Tn(`${n.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),O.push(Tn(`${n.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),O.push(Tn(`${n.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),O.push(""),O.push("Documentation:        https://ccsafetynet.com/docs"),console.log(O.join(`
`))}function Rc(){console.log(Cc)}function er(P,O=console.log){let D=hr(P);if(!D)return!1;if(D.name.toLowerCase()!==P.toLowerCase())return!1;return Lt(D,O),!0}import{existsSync as ro,readFileSync as Td}from"node:fs";import{join as to}from"node:path";import*as qn from"node:readline";function _h(P){return P==="install"?"Install":"Uninstall"}function Th(P){return P==="install"?"Installing":"Uninstalling"}function $h(P){return P==="install"?"into":"from"}function Ac(P){return P?.available===!0}function Oh(P,O){let D=new Set(O);return P.filter((j)=>D.has(j.target)).map((j)=>j.target)}function Pc(P,O,D){if(P.every((j)=>!j.available))return O;return Array.from({length:P.length},(j,J)=>J+1).map((j)=>(O+j*D+P.length)%P.length).find((j)=>Ac(P[j]))}function Dh(P,O,D){if(D.ctrl&&D.name==="c")return"interrupt";if(D.name==="escape"||O==="q")return"abort";if(P==="install"&&(O==="u"||O==="U"))return"update";if(D.name==="up"||O==="k")return"up";if(D.name==="down"||O==="j")return"down";if(D.name==="space"||O===" ")return"toggle";if(D.name==="return"||D.name==="enter")return"confirm";return null}function Lh(P){return{cursor:P.findIndex((O)=>O.available),selected:[]}}function Nh(P,O,D){if(D==="confirm"||D==="update"||D==="abort"||D==="interrupt")return{state:P,done:D};if(D==="up")return{state:{...P,cursor:Pc(O,P.cursor,-1)}};if(D==="down")return{state:{...P,cursor:Pc(O,P.cursor,1)}};let j=O[P.cursor];if(!Ac(j))return{state:P};let J=P.selected.includes(j.target)?P.selected.filter((Y)=>Y!==j.target):Oh(O,[...P.selected,j.target]);return{state:{...P,selected:J}}}var Ic="◉",_c="◯",Tc=">",$c=" ";function jh(P,O,D){return["",`${_h(P)} CC Safety Net ${$h(P)}:`,"",...O.map((j,J)=>{let Y=D.selected.includes(j.target),re=J===D.cursor,ie=Y?Ic:_c,de=re?Tc:$c,fe=j.available?"":` (${j.unavailableReason??"not installed"})`,we=`${ie} ${j.label}${fe}`,Ce=!j.available?nn.dim(we):Y?nn.green(we):re?nn.bold(we):we;return`${de} ${Ce}`}),"",P==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":O.some((j)=>j.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${P}. q/Esc: close`].join(`
`)}var Ec=["global-hook","plugin"];function Fh(P,O,D={}){let j=D.color!==!1?nn.bold:(Y)=>Y;return["","Install the Kimi Code integration as:","",...[`Global hook — ${O?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((Y,re)=>{let ie=re===P,de=`${ie?Ic:_c} ${Y}`;return`${ie?Tc:$c} ${ie?j(de):de}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function Oc(P){let{input:O,output:D}=P;qn.emitKeypressEvents(O);let j=O.isRaw===!0;O.setRawMode(!0),O.resume();let J=0,Y=()=>{if(J===0)return;qn.moveCursor(D,0,-J),qn.cursorTo(D,0),qn.clearScreenDown(D)},re=()=>{Y();let ie=P.render();D.write(`${ie}
`),J=ie.split(`
`).length};return new Promise((ie)=>{let de=(we)=>{O.off("keypress",fe),O.setRawMode(j),O.pause(),Y(),ie(we)};function fe(we,Ce){P.onKey(we,Ce,{finish:de,draw:re})}O.on("keypress",fe),re()})}function Dc(P={}){let O=0;return Oc({input:P.input??process.stdin,output:P.output??process.stdout,render:()=>Fh(O,P.globalHookInstalled===!0),onKey:(D,j,J)=>{if(j.ctrl&&j.name==="c"){J.finish(null),(P.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(j.name==="escape"||D==="q")return J.finish(null);if(j.name==="return"||j.name==="enter")return J.finish(Ec[O]);if(j.name==="up"||j.name==="down"||D==="k"||D==="j")O=(O+1)%Ec.length,J.draw()}})}function Ni(P=process.stdin,O=process.stdout){return Boolean(P.isTTY&&O.isTTY&&typeof P.setRawMode==="function")}function Lc(P,O,D={}){let j=D.output??process.stdout,J=Lh(O);return Oc({input:D.input??process.stdin,output:j,render:()=>jh(P,O,J),onKey:(Y,re,ie)=>{let de=Dh(P,Y,re);if(!de)return;let fe=Nh(J,O,de);if(J=fe.state,fe.done==="interrupt"){ie.finish(null),(D.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(fe.done==="abort")return ie.finish(null);if(fe.done==="update")return ie.finish("update");if(fe.done==="confirm"){if(J.selected.length===0){j.write("\x07"),ie.draw();return}ie.finish([...J.selected]),j.write(`${Th(P)} selected integrations...
`);return}ie.draw()}})}import{existsSync as Nc,lstatSync as Mh,mkdirSync as Uh,mkdtempSync as Gh,readdirSync as Bh,readFileSync as jt,rmSync as Zr}from"node:fs";import{basename as qh,dirname as Vh,join as Cn}from"node:path";import{fileURLToPath as Jh}from"node:url";var ji="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",mt="cc-safety-net",gt="cc-safety-net/index.ts";import{spawn as Hh}from"node:child_process";var Fi=(P,O)=>{let D=Wn([...P],process.env);return new Promise((j)=>{let J=Hh(D.cmd,D.args,{cwd:O,stdio:["ignore","pipe","pipe"]}),Y=pi(J),re=!1,ie=setTimeout(()=>{re=!0,J.kill()},120000);J.on("error",(de)=>{clearTimeout(ie),j({status:null,errorCode:de.code,stdout:Y.stdout,stderr:[de.message,Y.stderr].filter(Boolean).join(`
`)})}),J.on("close",(de)=>{clearTimeout(ie),j({status:re?null:de,errorCode:re?"ETIMEDOUT":void 0,stdout:Y.stdout,stderr:Y.stderr})})})};var Nt="cc-safety-net.ts",Hi=Cn("amp",gt);function zh(P){return Cn(P.home,".config","amp","plugins","cc-safety-net.ts")}function Kh(){let P=Vh(Jh(import.meta.url)),O=Cn(P,Hi),D=Cn(P,"..",Hi),j=Cn(P,"..","..","..","dist",Hi);return[O,D,j]}function Wh(P=Kh()){let O=P.find((D)=>Nc(D)&&Mh(D).isFile());if(!O)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return O}function jc(P){try{return JSON.parse(P)}catch{return}}function Xr(P){return P.subarray(0,Buffer.byteLength(ji)).toString("utf-8")===ji}async function nr(P,O,D){let j=await P(O,D);if(j.status===0)return j;throw Error([`Failed to run ${O.join(" ")}${j.status===null?"":` (exit ${j.status})`}.`,[j.stdout,j.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Fc(P){let O=await P(["amp","plugins","repositories","--json"]);if(O.status===null)throw Error(`${O.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${O.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${O.stderr}`.trim());if(O.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${O.status}). Sign in with "amp login" and rerun install --amp.
${[O.stdout,O.stderr].filter(Boolean).join(`
`)}`.trim());let D=jc(O.stdout),j=(Array.isArray(D)?D:[]).filter((J)=>tn(J,"scope")==="user"&&tn(J,"exists")===!0&&tn(J,"viewerCanWrite")===!0).map((J)=>tn(J,"cloneRef")).find((J)=>typeof J==="string"&&J.length>0);if(!j)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return j}async function Hc(P,O,D){let j=Gh(Cn(O.tmpdir,"cc-safety-net-amp-"));try{return await nr(P,["amp","clone","user-plugins",j]),await D(j)}finally{Zr(j,{recursive:!0,force:!0})}}function Mi(P){return`rerun ${P==="overwrite"?"install":"uninstall"} --amp`}function Mc(P,O,D){let j=Cn(P,O),J=dn(j);if(!J)return;if(J.isSymbolicLink()||!J.isFile())throw Error(`Refusing to ${D} ${O} in your Amp personal plugins repository: not a regular file. Remove it there and ${Mi(D)}.`);let Y=jt(j);if(Xr(Y))return Y;throw Error(`Refusing to ${D} unmanaged file ${O} in your Amp personal plugins repository. Remove it there and ${Mi(D)}.`)}function Uc(P,O){let D=Cn(P,mt),j=dn(D);if(!j)return;if(j.isSymbolicLink()||!j.isDirectory())throw Error(`Refusing to ${O} ${mt} in your Amp personal plugins repository: not a regular directory. Remove it there and ${Mi(O)}.`);return Mc(P,gt,O)}function Yh(P){let O=Cn(P,Nt),D=dn(O);if(!D||D.isSymbolicLink()||!D.isFile())return;let j=jt(O);return Xr(j)?j:void 0}async function Gc(P,O,D,j){if(await nr(P,D,O),(await nr(P,["git","status","--porcelain"],O)).stdout.trim()==="")return!1;return await nr(P,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",j],O),await nr(P,["git","push","origin","HEAD"],O),!0}function Yr(P,O){Zh(P,O),Xh(P,O)}function Bc(P,O){if(O==="keep")return;throw Error(`Local Amp plugin ${P} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function Zh(P,O){let D=zh(P),j=dn(D);if(!j)return;if(!j.isSymbolicLink()&&j.isFile()&&Xr(jt(D))){Zr(D);return}Bc(D,O)}function Xh(P,O){let D=Cn(P.home,".config","amp","plugins",mt),j=dn(D);if(!j)return;if(!j.isSymbolicLink()&&j.isDirectory()&&Qh(D)){Zr(D,{recursive:!0});return}Bc(D,O)}function Qh(P){let O=qh(gt);if(Bh(P).join("\x00")!==O)return!1;let D=Cn(P,O),j=dn(D);return!!j&&!j.isSymbolicLink()&&j.isFile()&&Xr(jt(D))}function ey(P){let O=l(P);if(!Nc(O))return"";let D=jc(jt(O,"utf-8"));if(!D||typeof D!=="object"||Array.isArray(D))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(C(D,P.home))};
`}async function qc(P,O=Wh(),D=Fi){let j=Buffer.concat([jt(O),Buffer.from(ey(P),"utf-8")]),J=await Fc(D);return Hc(D,P,async(Y)=>{let re=`${J}/${mt}`,ie=Uc(Y,"overwrite"),de=Mc(Y,Nt,"overwrite");if(ie?.equals(j)&&!de)return Yr(P,"fail"),{path:re,alreadyInstalled:!0};if(Uh(Cn(Y,mt),{recursive:!0}),cn(Cn(Y,gt),j),de)Zr(Cn(Y,Nt));let fe=await Gc(D,Y,["git","add","--",gt,...de?[Nt]:[]],`chore: update cc-safety-net plugin to v${pn()}`);return Yr(P,"fail"),{path:re,alreadyInstalled:!fe}})}async function Vc(P,O=Fi){let D=await Fc(O);return Hc(O,P,async(j)=>{let J=Uc(j,"remove"),Y=Yh(j),re=`${D}/${Y&&!J?Nt:mt}`;if(!J&&!Y)return Yr(P,"keep"),{path:re,alreadyInstalled:!1};return await Gc(O,j,["git","rm","--",...J?[gt]:[],...Y?[Nt]:[]],`chore: remove cc-safety-net plugin v${pn()}`),Yr(P,"keep"),{path:re,alreadyInstalled:!0}})}import{existsSync as Jc,mkdirSync as ny,readFileSync as ty}from"node:fs";import{dirname as ry}from"node:path";var Ui=xn["antigravity-cli"],ht="cc-safety-net";function yt(P){return Boolean(P)&&typeof P==="object"&&!Array.isArray(P)}function eo(){return{PreToolUse:[{hooks:[{type:"command",command:Ui,timeout:30}]}]}}function zc(P){try{let O=JSON.parse(ty(P,"utf-8"));if(!O||typeof O!=="object"||Array.isArray(O))throw Error("Antigravity hooks config must be a JSON object");return O}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${P}: ${O.message}`);throw O}}function Kc(P){let O=P[ht];if(O===void 0){let j=eo();return P[ht]=j,{definition:j,preToolUse:j.PreToolUse??[]}}if(!yt(O))throw Error(`Antigravity hooks config entry "${ht}" must be an object`);let D=Array.isArray(O.PreToolUse)?O.PreToolUse:[];return O.PreToolUse=D,{definition:O,preToolUse:D}}function Wc(P){if(!Array.isArray(P.PreToolUse))return!1;return P.PreToolUse.some((O)=>yt(O)&&Array.isArray(O.hooks)&&O.hooks.some((D)=>yt(D)&&D.command===Ui))}function oy(P){return Object.values(P).some((O)=>yt(O)&&O.enabled!==!1&&Wc(O))}function iy(P){if(P[ht]===void 0)return!1;let O=Kc(P);if(O.definition.enabled!==!1||!Wc(O.definition))return!1;return O.definition.enabled=!0,!0}function sy(P){if(P[ht]===void 0){P[ht]=eo();return}let O=Kc(P);O.definition.enabled=!0,O.preToolUse.push(eo().PreToolUse?.[0]??{hooks:[]})}function ay(P){let O=!1;for(let D of Object.values(P)){if(!yt(D)||!Array.isArray(D.PreToolUse))continue;D.PreToolUse=D.PreToolUse.flatMap((j)=>{if(!yt(j)||!Array.isArray(j.hooks))return[j];let J=j.hooks.filter((Y)=>!yt(Y)||Y.command!==Ui);if(J.length!==j.hooks.length)O=!0;return J.length===0?[]:[{...j,hooks:J}]})}return O}function Qr(P,O){cn(P,`${JSON.stringify(O,null,2)}
`)}function Yc(P){let O=Gt(P.home);if(ny(ry(O),{recursive:!0}),!Jc(O))return Qr(O,{[ht]:eo()}),{path:O,alreadyInstalled:!1};let D=zc(O);if(oy(D))return{path:O,alreadyInstalled:!0};if(iy(D))return Qr(O,D),{path:O,alreadyInstalled:!1};return sy(D),Qr(O,D),{path:O,alreadyInstalled:!1}}function Zc(P){let O=Gt(P.home);if(!Jc(O))return{path:O,alreadyInstalled:!1};let D=zc(O);if(!ay(D))return{path:O,alreadyInstalled:!1};return Qr(O,D),{path:O,alreadyInstalled:!0}}import{existsSync as qi,readlinkSync as dy}from"node:fs";import{join as Vn}from"node:path";import{spawn as ly}from"node:child_process";var $n=En.map((P)=>({target:P.id,flag:P.flag,label:mn(P.id),probeCommand:P.probeCommand}));function Gi(P){let O=new Set(P);return $n.map((D)=>D.target).filter((D)=>O.has(D))}async function Xc(P,O){for(let D of P)await O(D)}var cy=5000;function tr(P,O=cy){return new Promise((D)=>{let j=Wn([...P],process.env),J=ly(j.cmd,j.args,{env:process.env,stdio:"ignore"}),Y=!1,re=(de)=>{if(Y)return;Y=!0,clearTimeout(ie),D(de)},ie=setTimeout(()=>{J.kill(),re(!1)},O);J.on("error",()=>re(!1)),J.on("close",(de)=>re(de===0))})}function Qc(P=tr,O={}){let D=new Set(O.configuredTargets??[]);return Promise.all($n.map(async(j)=>({target:j.target,flag:j.flag,label:j.label,...nd(O.action,await P(j.probeCommand),D.has(j.target))})))}function ed(P,O){let D=new Set(O.configuredTargets??[]);return P.map((j)=>({...j,...nd(O.action,j.available,D.has(j.target))}))}function nd(P,O,D){if(P==="uninstall")return D?{available:!0}:{available:!1,unavailableReason:"not installed"};if(P==="install"&&D)return{available:!1,unavailableReason:"already installed"};if(!O)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}var Jn="cc-safety-net",id=["npx","-y","@deepseek-ai/dsh"],td="DeepSeek Harness",rd=["@deepseek-ai","dsh-desktop"],sd="Quit DeepSeek Harness Desktop, then run this command again: Desktop plugins can only change while it is closed.",Bi=(P)=>`DeepSeek Harness Desktop is not in its default location, so ${P} ${Jn} from its Plugins page.`,ad=(P,O)=>qi(Vn(Jo(P),O,"package.json"));function Vi(P,O){let D=O.platform??process.platform,j=ad(P,"desktop"),J=D==="darwin"?[Vn(P.home,"Applications"),O.systemApplications??"/Applications"].map((Y)=>Vn(Y,`${td}.app`,"Contents","Resources","runtime","cli","bin","dsh")):D==="win32"?[Vn(P.env.get("LOCALAPPDATA")||Vn(P.home,"AppData","Local"),"Programs",td,"resources","runtime","cli","bin","dsh.cmd")]:[];return{profile:j,cli:j?J.find((Y)=>qi(Y)):void 0}}function ld(P,O=process.platform){if(O==="win32")return qi(Vn(P.env.get("APPDATA")||Vn(P.home,"AppData","Roaming"),...rd,"lockfile"));let D=uy(Vn(P.home,"Library","Application Support",...rd,"SingletonLock")),j=Number(/-(\d+)$/.exec(D??"")?.[1]);return Number.isInteger(j)&&j>0&&py(j)}function uy(P){try{return dy(P)}catch{return}}function py(P){try{return process.kill(P,0),!0}catch(O){return O.code==="EPERM"}}async function cd(P,O={}){let D=Vi(P,O);if(D.cli&&ld(P,O.platform))throw Error(sd);let j=!D.cli||ad(P,"web")||await(O.probe??tr)(xo),J=[...D.cli?[{profile:"desktop",label:"Desktop",dsh:[D.cli]}]:[],...j?[{profile:"web",label:"web",dsh:id}]:[]];return{commands:J.map((Y)=>[...Y.dsh,"plugin","--profile",Y.profile,"add",`${Jn}@${pn()}`]),afterInstall:async()=>{let Y=new Set(zo(P).filter((ie)=>ie.enabled).map((ie)=>ie.name)),re=J.filter((ie)=>!Y.has(ie.profile));if(re.length>0)throw Error(`DeepSeek Harness installed ${Jn} in the ${od(re)} but did not enable it. Enable it from the Plugins page.`)},message:[`Added ${Jn} to the DeepSeek Harness ${od(J)}.`,...D.profile&&!D.cli?[Bi("add")]:[]].join(`
`)}}function od(P){return`${P.map((O)=>O.label).join(" and ")} profile${P.length>1?"s":""}`}function dd(P,O={}){let D=new Set(zo(P).map((Y)=>Y.name));if(!D.has("desktop")&&!D.has("web"))throw Error(`${Jn} is not installed in the DeepSeek Harness web or Desktop profile`);let j=D.has("desktop")?Vi(P,O).cli:void 0,J=D.has("desktop")&&!j;if(J&&!D.has("web"))throw Error(Bi("remove"));if(j&&ld(P,O.platform))throw Error(sd);return{commands:[...j?[[j,"plugin","--profile","desktop","remove",Jn]]:[],...D.has("web")?[[...id,"plugin","--profile","web","remove",Jn]]:[]],...J?{afterUninstall:()=>{throw Error(`Removed ${Jn} from the DeepSeek Harness web profile, but ${Bi("remove")}`)}}:{}}}function ud(P,O,D={}){let j=Vi(O,D).cli!==void 0;return P.map((J)=>J.target==="deepseek-harness"&&j?{...J,available:!0,unavailableReason:void 0}:J)}import{existsSync as fy,readdirSync as my,rmSync as gy}from"node:fs";import{join as hy}from"node:path";function pd(P,O=process.platform,D){if(!fy(P))return;let j=O==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);my(P).filter((J)=>J!==D&&j.test(J)).forEach((J)=>{gy(hy(P,J),{recursive:!0,force:!0})})}import{existsSync as fd,readdirSync as yy,rmSync as vy}from"node:fs";import{join as Ft}from"node:path";function no(P,O=process.platform){let D=Ft(P.env.get("npm_config_cache")||(O==="win32"?Ft(P.env.get("LOCALAPPDATA")||Ft(P.home,"AppData","Local"),"npm-cache"):Ft(P.home,".npm")),"_npx");if(!fd(D))return;yy(D).filter((j)=>fd(Ft(D,j,"node_modules","cc-safety-net"))).forEach((j)=>{vy(Ft(D,j),{recursive:!0,force:!0})})}import{existsSync as bd,mkdirSync as wy,readFileSync as wd}from"node:fs";import{dirname as ky,join as vd}from"node:path";function by(P,O){if(P[O]!=="#")return O;let D=P.indexOf(`
`,O+1);return D===-1?P.length:D+1}function Ji(P,O,D){let j=new RegExp(`^(\\s*)${O}\\s*=\\s*\\[`),J=0;for(let Y of P.split(`
`)){if(/^\s*\[/.test(Y))return;let re=j.exec(Y);if(re){let ie=J+re[0].lastIndexOf("[");return{start:ie,end:Mo(P,ie,{skipComment:by,...D})}}J+=Y.length+1}return}function md(P,O,D){let j=P.slice(0,O.end).trimEnd(),J=_a(P,O.end),Y=J===""?"     ":`${J}  `,re=!j.endsWith("[")&&!j.endsWith(",");return`${j}${re?",":""}
${Y}${D}${P.slice(O.end)}`}function gd(P,O,D){let j=P.indexOf(D,O.start);if(j===-1||j>O.end)return P;return`${P.slice(0,j)}${P.slice(j+D.length).replace(/^\s*,/,"")}`}function hd(P,O){let D=new RegExp(`^\\s*${O}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),j=P.split(`
`),J=j.findIndex((ie)=>/^\s*\[/.test(ie)),Y=J===-1?j:j.slice(0,J),re=J===-1?[]:j.slice(J);return[...Y.filter((ie)=>!D.test(ie)),...re].join(`
`)}function yd(P,O,D){let j=new RegExp(`^\\s*\\[\\[${O}]]\\s*$`,"m");return P.split(/(?=^\s*\[)/m).filter((J)=>!j.test(J)||!J.includes(D)).join("").trimEnd()}var rr=xn["kimi-code"],zi=`[[hooks]]
event = "PreToolUse"
command = "${rr}"`,kd=`{ event = "PreToolUse", command = "${rr}" }`,xd={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function Cd(P){return vd(P.env.get("KIMI_CODE_HOME")??vd(P.home,".kimi-code"),"config.toml")}function xy(P){let O=Ji(P,"hooks",xd);if(O&&P.slice(O.start+1,O.end).trim())return md(P,O,kd);let D=hd(P,"hooks").trimEnd();if(D==="")return`${zi}
`;return`${D}

${zi}
`}function Sd(P){let O=Cd(P);if(wy(ky(O),{recursive:!0}),!bd(O))return cn(O,`${zi}
`),{path:O,alreadyInstalled:!1};let D=wd(O,"utf-8");if(D.includes(rr))return{path:O,alreadyInstalled:!0};return cn(O,xy(D)),{path:O,alreadyInstalled:!1}}function Rd(P){let O=Cd(P);if(!bd(O))return{path:O,alreadyInstalled:!1};let D=wd(O,"utf-8");if(!D.includes(rr))return{path:O,alreadyInstalled:!1};let j=Ji(D,"hooks",xd),J=j?gd(D,j,kd):`${yd(D,"hooks",rr)}
`;return cn(O,J),{path:O,alreadyInstalled:!0}}var Ki="safety-net@cc-marketplace",Pd=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),Ed=new Set(["antigravity-cli","cursor","devin","droid","grok-build","hermes-agent","kimi-code"]);function Wi(P){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(P??"")}function $d(P){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(P??"")}function Cy(P){return/^Marketplace `cc-marketplace`\s*$/m.test(P??"")}var Od={"claude-code":{installCommands:(P)=>{let O=Ir(P,"cc-safety-net@cc-marketplace");return{commands:[...O?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...Fo(P).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:Ir(P,Ki)?[["claude","plugin","uninstall",Ki]]:[],update:O}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(P,O)=>{let D=O??await yn(["codex","plugin","list"]),j=$d(D);return{commands:[j||Cy(D)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:Wi(D)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:j}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:Pa},"copilot-cli":{installCommands:async()=>{let P=await yn(["copilot","plugin","list"]),O=[...Fa(P)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...Ha(P)?[["copilot","plugin","uninstall",La]]:[]];if(Na(P))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",In]],cleanupCommands:O,update:!0};return{commands:[ja(await yn(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",In]],cleanupCommands:O}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(P)=>{let O=ni(P);if(O.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(O.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:gi,installCommands:(P)=>{let O=!ro(to(Wt(P),Sn));return{commands:Jl(),afterInstall:()=>zl(O)}},uninstallCommands:[["openclaw","plugins","uninstall",un,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:rc},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]},"deepseek-harness":{installCommands:(P)=>cd(P),uninstallCommands:(P)=>dd(P)}};function Dd(P,O=(D)=>D){try{let D=JSON.parse(O(Td(P,"utf-8")));if(!D||typeof D!=="object"||Array.isArray(D))throw Error(`Settings file ${P} must be a JSON object`);return D}catch(D){if(D instanceof SyntaxError)throw Error(`Failed to parse ${P}: ${D.message}`);throw D}}function Sy(P){let O=to(qt(P),"settings.json");if(!ro(O))return;let D=Dd(O,vn),j=D.enabledPlugins;if(!j||typeof j!=="object"||Array.isArray(j))return;if(j[In]!==!1)return;let J=Td(O,"utf-8"),Y=J.replace(new RegExp(`("${In}"\\s*:\\s*)false`),"$1true");return j[In]=!0,cn(O,Y!==J?Y:`${JSON.stringify(D,null,2)}
`),`Enabled ${In} plugin in ${O}`}function Ry(P){let O=Ri(P);if(!ro(O))return;let D=Dd(O);if(!Array.isArray(D.packages))return;let j=D.packages.find((J)=>!!J&&typeof J==="object"&&!Array.isArray(J)&&Pi(J.source)&&("extensions"in J));if(!j)return;return delete j.extensions,cn(O,`${JSON.stringify(D,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${O}`}function Ad(P,O){let D=gn({label:O,booleans:Object.fromEntries($n.map((Y)=>[Y.target,[Y.flag]]))},P),j=D.errors[0];if(j)throw Error(j);let J=$n.filter((Y)=>D.flags[Y.target]).map((Y)=>Y.target);if(J.length!==1)throw Error(`Choose exactly one ${O} target: ${$n.map((Y)=>Y.flag).join(", ")}`);return J[0]}async function Ld(P,O=St){let[D,j,J]=await Promise.all([O(["amp","plugins","list"],30000),O(["codex","plugin","list"],30000),O(["copilot","--binary-version"])]);return{codexPluginListOutput:j,hooks:Dt(P,process.cwd(),{ampPluginListOutput:D,codexPluginListOutput:j,copilotCliVersion:J})}}async function Py(P,O,D=St){let j=await Ld(P,D);return j.hooks.filter((J)=>O==="install"?J.configured:J.detected||J.inspectionStatus==="not-inspected").filter((J)=>J.platform!=="codex"||!Wi(j.codexPluginListOutput)||$d(j.codexPluginListOutput)).map((J)=>J.platform)}function Ey(P,O,D,j){if(D.length>0)return{finish:async()=>[Ad(D,O)]};if(!j.selectTargets&&!Ni(j.input,j.output))return{finish:async()=>[Ad(D,O)]};let J=j.detectConfiguredTargets??(()=>Py(P,O,j.fetchVersion)),Y=Promise.all([Qc(j.probeTargets).then((re)=>ud(re,P)),J()]);return{ready:Y,finish:async()=>{let[re,ie]=await Y,de=ed(re,{action:O,configuredTargets:ie}),fe=j.selectTargets?await j.selectTargets(O,_d(O,de)):await Lc(O,_d(O,de),{input:j.input,output:j.output});if(fe==="update")return fe;if(!fe||fe.length===0)return null;return Gi(fe)}}}async function Ay(P,O,D=!1,j){let J=Od[P];J.beforeInstall?.(O);let Y=typeof J.installCommands==="function"?await J.installCommands(O,j):{commands:J.installCommands};return await fi(Y.commands),await Ml(Y.cleanupCommands??[]),await Y.afterInstall?.(),[`${Y.update||D?"Updated":"Installed"} ${mn(P)} integration`,Y.message??J.postInstallMessage].filter(Boolean).join(`
`)}async function Iy(P,O){let D=Od[P];if(!D.uninstallCommands)throw Error(`${mn(P)} uninstall is not supported`);let j=typeof D.uninstallCommands==="function"?D.uninstallCommands(O):{commands:D.uninstallCommands};return await fi(j.commands),j.afterUninstall?.(),`Uninstalled ${mn(P)} integration`}function _y(P){let O=ac(P);return O.alreadyInstalled?`Uninstalled OpenCode plugin from ${O.path}`:`OpenCode plugin not installed in ${O.path}`}var Nd={"antigravity-cli":{install:Yc,uninstall:Zc},cursor:{install:Wa,uninstall:Ya},devin:{install:il,uninstall:sl},droid:{install:ml,uninstall:gl},"grok-build":{install:Cl,uninstall:Sl},"kimi-code":{install:Sd,uninstall:Rd}};function Ty(P,O,D,j=!1){if(P==="install"&&!j)no(D);let J=Nd[O][P](D),Y=mn(O),re=P!=="install"?"Uninstalled":j?"Updated":"Installed";return P==="install"&&J.alreadyInstalled?j?`${Y} hook up to date in ${J.path}`:`${Y} hook already installed in ${J.path}`:P==="uninstall"&&!J.alreadyInstalled?`${Y} hook not installed in ${J.path}`:`${re} ${Y} hook ${P==="install"?"in":"from"} ${J.path}`}var jd={amp:{install:qc,uninstall:Vc,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:_l,uninstall:Tl,afterInstall:async(P)=>{let O=di(P);return await yn(["hermes","plugins","enable",Pn,"--no-allow-tool-override"]),!O},beforeUninstall:async(P)=>{ci(P);try{await yn(["hermes","plugins","disable",Pn])}catch(O){console.warn(`${O instanceof Error?O.message:String(O)}
Removing the plugin files anyway; ${Pn} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function $y(P,O,D,j=!1){let J=jd[O];if(P==="uninstall")await J.beforeUninstall?.(D);let Y=P==="install"?await J.install(D):await J.uninstall(D),re=P==="install"&&await J.afterInstall?.(D),ie=mn(O),de=!re&&(P==="install"&&Y.alreadyInstalled||P==="uninstall"&&!Y.alreadyInstalled);return[de?P==="install"?`${ie} plugin ${j?"up to date":"already installed"} at ${Y.path}`:`${ie} plugin not installed at ${Y.path}`:`${P!=="install"?"Uninstalled":j?"Updated":"Installed"} ${ie} plugin ${P==="install"?"at":"from"} ${Y.path}`,de?void 0:J.restartNote].filter(Boolean).join(`
`)}var Oy={"copilot-cli":{afterInstall:Sy},"hermes-agent":{beforeInstall:(P,O)=>{if(!O)no(P)}},openclaw:{beforeUninstall:gi},pi:{afterInstall:Ry}};function Dy(P){return P in Nd}function Ly(P){return P in jd}var Id=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Ny(P){if(Kt({environment:P,cwd:process.cwd()}).status!=="configured")return Id;return[Id,"",nn.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function _d(P,O){return O.map((D)=>P==="install"&&D.target==="kimi-code"&&D.unavailableReason==="already installed"?{...D,available:!0,unavailableReason:void 0,label:`${D.label} (global hook installed)`}:D)}function jy(P,O){if(P.selectKimiInstallMethod)return P.selectKimiInstallMethod();if(!Ni(P.input,P.output))return Promise.resolve("global-hook");return Dc({input:P.input,output:P.output,globalHookInstalled:Kt({environment:O,cwd:process.cwd()}).status==="configured"})}async function Fd(P,O,D,j=!1,J){let Y=Oy[O];if(P==="install")Y?.beforeInstall?.(D,j);if(P==="uninstall")Y?.beforeUninstall?.(D);if(Dy(O))return Ty(P,O,D,j);if(Ly(O))return $y(P,O,D,j);if(P==="uninstall")return O==="opencode"?_y(D):Iy(O,D);return[await Ay(O,D,j,J),await Y?.afterInstall?.(D)].filter(Boolean).join(`
`)}function Fy(P){let O=gn({label:"update"},P).errors[0];if(O)throw Error(O)}async function Hy(P,O=St){let D=await Ld(P,O),j=to(qt(P),"installed-plugins");return{targets:Gi([...D.hooks.filter((Y)=>Y.platform!=="copilot-cli"&&Y.detected).map((Y)=>Y.platform),...[_r,Da,Oa].flatMap((Y)=>ro(to(j,...Y))?["copilot-cli"]:[]),...Ir(P,Ki)?["claude-code"]:[],...Wi(D.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:D.codexPluginListOutput}}async function My(P){let O=c(),D=P.output??process.stdout,j=(P.scriptPath??process.argv[1]??"").split(/[\\/]/),J=j.find((Ie)=>/^bunx-\d+-/.test(Ie)),Y=J!==void 0||j.includes("_npx")?null:(P.checkLatestVersion??Gn)(),re=async()=>{let Ie=Y&&await Y;if(Ie?.updateAvailable)D.write(`
Update available: cc-safety-net ${Ie.currentVersion} → ${Ie.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},ie=Hy(O,P.fetchVersion??St).then(async(Ie)=>{let Ee=new Set(Ie.targets);return{targets:Ie.targets,codexPluginListOutput:Ie.codexPluginListOutput,available:new Map(await Promise.all($n.filter((qe)=>Ee.has(qe.target)&&Pd.has(qe.target)).map(async(qe)=>[qe.target,await tr(qe.probeCommand)])))}}),de=await Ut(P.showBanner??!0,()=>({ready:ie,finish:()=>ie}),()=>Mt({input:P.input??process.stdin,output:D}),{loadingMessage:"Checking installed integrations…",output:D}),fe=await Promise.resolve().then(()=>(pd(O.tmpdir,process.platform,J),null)).catch((Ie)=>or(Ie));if(de.targets.length===0){if(D.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),fe!==null)console.error(fe);return await re(),fe===null?0:1}let we=de.targets.some((Ie)=>Ed.has(Ie))?await Promise.resolve().then(()=>(no(O),null)).catch((Ie)=>or(Ie)):null,Ce=await Rr(Promise.all(de.targets.map((Ie)=>{if(Pd.has(Ie)&&!de.available.get(Ie))return Promise.resolve({message:`${mn(Ie)} not found; skipped`,failed:!1});if(we!==null&&Ed.has(Ie))return Promise.resolve({message:we,failed:!0});return Fd("install",Ie,O,!0,de.codexPluginListOutput).then((Ee)=>({message:Ee,failed:!1}),(Ee)=>({message:or(Ee),failed:!0}))})),{loadingMessage:`Updating ${de.targets.length} integration${de.targets.length===1?"":"s"}…`,output:D}),Se=fe===null?Ce:[...Ce,{message:fe,failed:!0}];return Se.forEach((Ie)=>Ie.failed?console.error(Ie.message):D.write(`${Ie.message}
`)),await re(),Se.some((Ie)=>Ie.failed)?1:0}function Yi(P,O={}){return Promise.resolve().then(()=>Fy(P)).then(()=>My(O)).catch((D)=>(console.error(or(D)),1))}async function ir(P,O,D={}){try{let j=c(),J=await Ut(!0,()=>Ey(j,P,O,D),()=>Mt({input:D.input??process.stdin,output:D.output??process.stdout}),{loadingMessage:P==="install"?"Checking available integrations…":"Checking installed integrations…",output:D.output??process.stdout});if(!J)return(D.output??process.stdout).write(`Cancelled: nothing was ${P}ed.
`),0;if(J==="update")return(D.runUpdate??(()=>Yi([],{fetchVersion:D.fetchVersion,input:D.input,output:D.output,showBanner:!1})))();let Y=D.output??process.stdout;return await Xc(J,async(re)=>{if(re==="kimi-code"&&P==="install"){let de=await jy(D,j);if(de===null){Y.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(de==="plugin"){Y.write(`${Ny(j)}
`);return}}let ie=await Rr(Fd(P,re,j),{loadingMessage:`${P==="install"?"Installing":"Uninstalling"} ${mn(re)} integration…`,output:Y});Y.write(`${ie}
`)}),0}catch(j){return console.error(or(j)),1}}function or(P){let O=P instanceof Error?P.message:String(P),D=typeof P==="object"&&P!==null&&"code"in P?P.code:null;if(D==="EACCES"||D==="EPERM")return`${O}
Check file permissions for the target config file and parent directory.`;if(D==="ENOENT")return`${O}
Check that the target config path and parent directory exist.`;if(D==="ENOTDIR")return`${O}
Check that every parent path component is a directory.`;return O}import{mkdirSync as Jy}from"node:fs";import{dirname as zy}from"node:path";import{createInterface as Ky}from"node:readline";import{existsSync as Md,readFileSync as Uy}from"node:fs";function vt(P,O){let D=tt(P,O);return{policy:D.policy,errors:ce(Xe(D.issues,et,(j)=>j.kind==="custom")," "," ")}}function sr(P,O){return vt(P,O).errors}function Hd(P,O){return{"safety.level":P.safety.level,...Zi("safety.overrides",P.safety.overrides),"workflow.worktree_mode":String(P.workflow.worktree_mode),"destructive_command_protection.enabled":String(P.destructive_command_protection.enabled),...Zi("destructive_command_protection.overrides",P.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":Xi(P.destructive_command_protection.allow_paths),"secret_protection.enabled":String(P.secret_protection.enabled),...Zi("secret_protection.overrides",P.secret_protection.overrides),"secret_protection.deny_paths":Xi(P.secret_protection.deny_paths),"secret_protection.allow_paths":Xi(P.secret_protection.allow_paths),...O?{"audit.retention_days":String(P.audit.retention_days)}:{}}}function oo(P,O,D){let j=Hd(P,D),J=Hd(O,D);return[...new Set([...Object.keys(j),...Object.keys(J)])].flatMap((Y)=>j[Y]===J[Y]?[]:[{field:Y,before:j[Y],after:J[Y]}])}function ar(P,O){let D=l(P,O);if(!Md(D))return{baseline:C(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,P.home),diagnostics:[]};let j=bt(D),J=vt(j.value,P.home);return{baseline:J.policy,diagnostics:j.errors.length>0?j.errors:J.errors}}function bt(P){if(!Md(P))return{errors:[`${P}: file not found`]};try{return{value:JSON.parse(Uy(P,"utf-8")),errors:[]}}catch(O){let D=O instanceof Error?O.message:String(O);return{errors:[`${P}: ${O instanceof SyntaxError?`Invalid JSON: ${D}`:D}`]}}}function io(P,O){let D=Gy(P)?P:{};return{version:O.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((j)=>D[j]!==void 0).map((j)=>[j,D[j]]))}}function Zi(P,O){return Object.fromEntries(Object.entries(O).flatMap(([D,j])=>j===void 0?[]:[[`${P}.${D}`,String(j)]]))}function Xi(P){return P.length===0?"(none)":P.join(", ")}function Gy(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}import{chmodSync as By,existsSync as Ud,mkdirSync as qy,readFileSync as Gd}from"node:fs";import{dirname as Vy}from"node:path";function Bd(P,O={}){let D=l(P,O);if(!Ud(D))return{path:D,exists:!1,raw:"",policy:M(),errors:[]};let j=Gd(D,"utf-8");if(!j.trim())return{path:D,exists:!0,raw:j,policy:M(),errors:["Config file is empty"]};try{let J=vt(JSON.parse(j),P.home);return{path:D,exists:!0,raw:j,policy:J.policy,errors:J.errors}}catch(J){return{path:D,exists:!0,raw:j,policy:M(),errors:[`Invalid JSON: ${J instanceof Error?J.message:String(J)}`]}}}function Hn(P,O,D={}){let j=l(P,D),J=vt(O,P.home);if(J.errors.length>0)return{path:j,policy:M(),errors:J.errors};let Y=J.policy;return qy(Vy(j),{recursive:!0,mode:448}),g(se(j),`${JSON.stringify(Y,null,2)}
`,384),By(j,384),{path:j,policy:Y,errors:[]}}function qd(P,O){let D=vt(O,P.home);if(D.errors.length>0)return{errors:D.errors};return{preview:Le(D.policy,P.env),errors:[]}}function Vd(P,O={}){let D=l(P,O);if(!Ud(D))return Hn(P,te,O);let j=Gd(D,"utf-8");if(!j.trim())return Hn(P,te,O);try{return Hn(P,C(JSON.parse(j),P.home),O)}catch{return Hn(P,te,O)}}var Jd=new Set(["check","apply"]),zd="(unset)";async function Wd(P,O,D={}){let j=gn({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},O),J=j.positionals[0],Y=[...j.errors,...J&&!Jd.has(J)?[`Unknown policy subcommand: ${J}`]:[],...J&&Jd.has(J)&&!j.positionals[1]?[`policy ${J} requires a file`]:[],...j.positionals.slice(2).map((qe)=>`Unexpected policy argument: ${qe}`)];if(Y.length>0){for(let qe of Y)console.error(qe);return 1}let re=j.positionals[1];if(!J||!re)return Lt(mr,console.error),1;let ie=D.cwd??process.cwd(),de=j.flags.global?l(P):h(ie);if(!j.flags.global&&L(P,{cwd:ie}))return console.error(`${de} is the user policy, not a project policy; use --global for the user scope, or run from a project directory`),1;let fe=bt(re),we=[...fe.errors,...sr(fe.value,P.home).map((qe)=>`${re}: ${qe}`),...!j.flags.global&&Zy(fe.value)&&fe.value.audit!==void 0?[`${re}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(we.length>0){for(let qe of we)console.error(qe);return 1}let Ce=C(fe.value,P.home);if(console.log(`Scope: ${j.flags.global?"user":"project"} (${de})`),console.log(`Proposal: ${re}`),j.flags.global)Kd(C(bt(de).value,P.home),Ce,!0);if(!j.flags.global){let qe=ar(P).baseline;console.log("Effective policy (user + project merged):"),Kd(ee(qe,ue(bt(de).value,P.home).policy).policy,ee(qe,ue(fe.value,P.home).policy).policy,!1)}if(J==="check")return 0;let Se=D.input??process.stdin,Ie=D.output??process.stdout;if(!Se.isTTY||!Ie.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${re}${j.flags.global?" --global":""}`),1;if(!await Wy(`Apply this policy to ${de}? [y/N] `,Se,Ie))return console.log("Cancelled; nothing was written."),0;return Yy(P,de,fe.value,Ce,j.flags.global),console.log(`Policy applied: ${de}`),0}function Wy(P,O,D){let j=Ky({input:O,output:D,terminal:!1});return new Promise((J)=>{j.once("close",()=>J(!1)),j.question(P,(Y)=>{J(/^y(es)?$/i.test(Y.trim())),j.close()})})}function Yy(P,O,D,j,J){if(J){Hn(P,j);return}Jy(zy(O),{recursive:!0}),wn(O,io(D,j))}function Kd(P,O,D){let j=oo(P,O,D);if(j.length===0){console.log("No changes.");return}console.log(`Changes (${j.length}):`);for(let J of j)console.log(`  ${J.field}: ${J.before??zd} -> ${J.after??zd}`)}function Zy(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}import{join as db}from"node:path";var Yd="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- `caffeinate`, `exec`, `nice`, `nohup`, `setsid`, `stdbuf`, `time`, and `timeout` are built-in transparent wrappers and need no configuration. Configure only other wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function so(P,O){if(!P.ok){nu(P);return}Qd(P,O)}function Xd(P,O,D){if(P.ok)console.log(D);if(!P.add){so(P,`Added rulebook source: ${O}`);return}if(!P.ok){nu(P);return}if(P.add.added.length>0)console.log(`Added ${P.add.added.length} ${P.add.added.length===1?"rulebook":"rulebooks"} from ${P.add.source} at ${P.add.ref}:`),P.add.added.forEach((j)=>{console.log(`  - ${j}`)});if(P.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${P.add.source} at ${P.add.ref}: ${P.add.alreadyConfigured.join(", ")}`);if(P.add.commits.length>0)console.log(`Vendored at ${P.add.commits.map((j)=>j.slice(0,7)).join(", ")}.`);Qd(P,"Rule config updated.")}function Qd(P,O){for(let D of P.changes??[])console.log(D);console.log(O),console.log(""),Xy(P.entries)}function Xy(P){if(P.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${P.length}):`);for(let O of P)console.log(`  - ${O.name} ${O.version} (${Qy(O.ruleCount)})`),console.log(`    Source: ${O.spec}`)}function Qy(P){return`${P} ${P===1?"rule":"rules"}`}function eu(P){wt("Active sources",P.rulebooks,(O)=>[`[${O.source}] ${O.name} ${O.version}`,`  Source: ${O.spec}`]),wt("Active rules",P.rules,(O)=>[`[${nv(P,O.name)}] ${O.name}`,...ev(O),`  Reason: ${O.reason}`]),wt("Disabled rules",Zd(P,"off"),(O)=>[O.key]),wt("Reason overrides",Zd(P,"reason"),(O)=>[O.key,`  Reason: ${O.value.reason}`]),wt("Transparent wrappers",P.transparent_wrappers,(O)=>[O]),wt("Issues",P.errors,(O)=>[O]),wt("Warnings",P.warnings,(O)=>[O])}function wt(P,O,D){if(O.length===0){console.log(`${P}: (none)`);return}console.log(`${P} (${O.length}):`);for(let j of O){let[J,...Y]=D(j);console.log(`  - ${J}`);for(let re of Y)console.log(`    ${re}`)}}function ev(P){if(!P.match)return[`  Command: ${P.subcommand?`${P.command} ${P.subcommand}`:P.command}`,`  Block args: ${P.block_args.join(", ")}`];return[`  Command: ${[P.command,...P.match.command_path].join(" ")}`,...P.match.any_args?[`  Any args: ${P.match.any_args.join(", ")}`]:[],...P.match.exclude_args?[`  Exclude args: ${P.match.exclude_args.join(", ")}`]:[]]}function nv(P,O){return P.rulebooks.find((D)=>D.rules.includes(O))?.source??"project"}function Zd(P,O){return Object.entries({...P.userConfig?.overrides,...P.projectConfig?.overrides}).filter((D)=>{if(O==="off")return D[1]==="off";return!!D[1]&&typeof D[1]==="object"}).map(([D,j])=>({key:D,value:j}))}function nu(P){for(let O of P.errors)console.error(O)}import{dirname as Su,join as go}from"node:path";import{join as rs,resolve as fv}from"node:path";function Qi(P){let O=m(P);if(O.errors.length>0)return{ok:!1,result:{ok:!1,errors:O.errors,entries:[]}};return{ok:!0,config:O.config??ut}}function tu(P){wn(P,{version:1,rules:[],overrides:{},transparent_wrappers:[]})}function ru(P){wn(P,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as uo}from"node:path";var tv="custom.";function ao(P){if(P.rulebook_version!==2)return[];let O=P.rules.map((D)=>({name:D.name,command:D.command,block_args:[],match:D.match,reason:D.reason,intent:D.intent}));return(P.tests??[]).flatMap((D,j)=>{let J=es(y(D.command));if(J.length===0)return[`tests[${j}]: could not parse fixture command: ${D.command}`];let Y=J.reduce((re,ie)=>re??A(ie,O)?.id.slice(tv.length),void 0);if(D.expect==="blocked"){if(Y===D.rule)return[];let re=Y?`"${Y}" matched first`:"no rule matched";return[`tests[${j}]: expected "${D.rule}" to block "${D.command}" but ${re}`]}return Y?[`tests[${j}]: expected "${D.command}" to be allowed but "${Y}" matched`]:[]})}function es(P){return P.nodes.flatMap((O)=>{if(O.kind==="group"||O.kind==="function")return es(O.body);if(O.kind!=="command")return[];let D=ve(ne(O.dialect,O.words)).words.map(t);return[...D.length>0?[D]:[],...O.nested.flatMap((j)=>es(j))]})}var lo=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function co(P={}){return{requests:0,responseBytes:0,maxRequests:P.maxRequests??lo.maxRequests,maxResponseBytes:P.maxResponseBytes??lo.maxResponseBytes}}function Mn(P){return{controller:new AbortController,budget:co(),resolveUrl:P}}function ou(P){return P instanceof Error&&P.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function iu(P){if(P.requests>=P.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");P.requests++}function su(P,O){if(O>P.maxResponseBytes-P.responseBytes)throw P.responseBytes+=O,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");P.responseBytes+=O}var cu=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function au(P,O,D=v(uo(uo(O)),"rules policy"),j=Mn()){if(S(P))return sv(P,j);return iv(P,O,D)}async function du(P,O,D,j,J,Y){if(!S(P))return au(P,O,D,j);let re=J?null:rv(P,O,D);if(re)return re;if(!J&&!Y)throw Error(`${P} is not vendored; run rule update ${P} to vendor it`);return au(P,O,D,j)}function rv(P,O,D=v(uo(uo(O)),"rules policy")){let j=N(P),J=F(O,j.name),Y=r(i(D,J));if(Y===null)return null;let re=le(ns(Y,`Invalid rulebook ${J}.`));if(re.name!==j.name)throw Error(`rulebook name "${re.name}" in ${J} must match "${j.name}"`);return{spec:P,rulebook:re,content:Y}}async function uu(P,O={}){if(!Z(P))throw Error(`Invalid GitHub repository source: ${P}`);let[D,j]=P.split("/");if(!D||!j)throw Error(`Invalid GitHub repository source: ${P}`);if(O.ref!==void 0&&!ae(O.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${O.ref}`);let J=O.operation??Mn(),Y=O.ref??await ov(D,j,P,J),re=await fu(D,j,Y,P,J),ie=await po(`https://api.github.com/repos/${D}/${j}/git/trees/${re}?recursive=1`,"tree",J),de=ie.response;if(!de.ok)throw Error(`Failed to inspect ${P}: GitHub tree returned ${de.status}`);let fe=JSON.parse(ie.content);if(!Array.isArray(fe?.tree))throw Error(`Failed to inspect ${P}: unexpected GitHub tree response`);let we=fe.tree,Ce=[...new Set(we.flatMap((Se)=>{if(!Se||typeof Se!=="object")return[];let Ie=Se;if(Ie.type!=="blob"||typeof Ie.path!=="string")return[];let Ee=Ie.path.match(ct);return Ee?.[1]?[Ee[1]]:[]}))].sort();if(Ce.length===0)throw Error(`No rulebooks found in ${P} under ${he}/`);return{source:P,owner:D,repo:j,ref:Y,commit:re,names:Ce}}async function ov(P,O,D,j){let J=await po(`https://api.github.com/repos/${P}/${O}`,"metadata",j),Y=J.response;if(!Y.ok)throw Error(`Failed to inspect ${D}: GitHub returned ${Y.status}`);let ie=JSON.parse(J.content)?.default_branch;if(typeof ie!=="string"||ie==="")throw Error(`Failed to inspect ${D}: missing default branch`);if(!ae(ie))throw Error(`GitHub returned an invalid default branch: ${ie}`);return ie}function iv(P,O,D){lt(P);let j=F(O,P),J=r(i(D,j));if(J===null)throw Error(`Rulebook source not found: ${P}`);let Y=pu(ns(J,"Invalid local rulebook source."));if(Y.name!==P)throw Error(`rulebook name "${Y.name}" must match local source "${P}"`);return{spec:P,rulebook:Y,content:J}}async function sv(P,O){let D=N(P),j=await fu(D.owner,D.repo,D.ref,P,O),J=await po(`https://raw.githubusercontent.com/${D.owner}/${D.repo}/${j}/${D.path}`,"raw",O),Y=J.response;if(!Y.ok)throw Error(`Failed to fetch ${P}: GitHub raw returned ${Y.status}`);let re=J.content,ie=pu(ns(re,"Invalid GitHub rulebook response."));if(ie.name!==D.name)throw Error(`rulebook name "${ie.name}" must match GitHub source "${D.name}"`);return{spec:P,rulebook:ie,content:re}}function pu(P){let O=le(P),D=ao(O);if(D.length>0)throw Error(D.join("; "));return O}function ns(P,O){try{return JSON.parse(P)}catch{throw Error(O)}}async function fu(P,O,D,j,J){let Y=await po(`https://api.github.com/repos/${P}/${O}/commits/${encodeURIComponent(D)}`,"commit",J),re=Y.response;if(!re.ok)throw Error(`Failed to resolve ${j}: GitHub returned ${re.status}`);let ie=JSON.parse(Y.content);if(typeof ie?.sha!=="string"||ie.sha==="")throw Error(`Failed to resolve commit for ${j}`);return ie.sha}async function av(P,O,D={}){if(D.signal?.aborted)throw D.signal.reason;let j=D.budget??co(),J=new AbortController,Y=()=>J.abort(D.signal?.reason);D.signal?.addEventListener("abort",Y,{once:!0});let re=!1,ie=setTimeout(()=>{if(J.signal.aborted)return;re=!0,J.abort()},D.timeoutMs??cu.timeoutMs);try{if(D.signal?.aborted)throw D.signal.reason;iu(j);let de=await fetch(P,{signal:J.signal,redirect:"error"});if(!de.ok)return mu(de),{response:de,content:""};return{response:de,content:await lv(de,O,j,()=>J.abort())}}catch(de){if(re)throw Error("GitHub request timed out",{cause:de});if(D.signal?.aborted)throw D.signal.reason;throw de}finally{clearTimeout(ie),D.signal?.removeEventListener("abort",Y)}}function po(P,O,D){return av(D.resolveUrl?.(P)??P,O,{budget:D.budget,signal:D.controller.signal})}async function lv(P,O,D=co(),j){let J=cu[`${O}Bytes`],Y=Number(P.headers.get("content-length"));if(Number.isFinite(Y)&&Y>J)throw mu(P),Error(`GitHub ${O} response exceeds ${J} bytes`);if(!P.body)return"";let re=P.body.getReader(),ie=[],de=0;while(!0){let fe=await re.read();if(fe.done)break;try{su(D,fe.value.byteLength)}catch(we){throw j?.(),lu(re),we}if(de+=fe.value.byteLength,de>J)throw j?.(),lu(re),Error(`GitHub ${O} response exceeds ${J} bytes`);ie.push(Buffer.from(fe.value))}return Buffer.concat(ie,de).toString("utf-8")}function mu(P){if(!P.body)return;gu(()=>P.body?.cancel())}function lu(P){gu(()=>P.cancel())}function gu(P){try{Promise.resolve(P()).catch(()=>{})}catch{}}var cv=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function hu(P,O){let D=bu(P.rules,O);if(D.length>0)return{ok:!0,specs:D};return vu(P.rules,O)}function yu(P,O){let D=bu(P,O);if(D.length>0)return{ok:!0,specs:D};let j=uv(P,O);if(j.length>0)return{ok:!0,specs:j};let J=pv(P,O);if(!J.ok)return J;if(J.specs.length>0)return{ok:!0,specs:J.specs};return vu(P,O)}function vu(P,O){let D=P.filter((j)=>ts(j)?.name===O);if(D.length===1)return{ok:!0,specs:D};return dv(O,D)}function dv(P,O){return{ok:!1,result:{ok:!1,errors:O.length===0?[`No configured rulebook matches ${P}`]:[`Ambiguous rulebook match ${P}: ${O.join(", ")}`],entries:[]}}}function bu(P,O){return P.filter((D)=>D===O)}function uv(P,O){let D=O.match(cv),j=D?.[1],J=D?.[2],Y=D?.[3];if(!j||!J||!Y||!ae(Y))return[];return wu(P,(re)=>re.owner===j&&re.repo===J&&re.ref===Y)}function pv(P,O){if(!Z(O))return{ok:!0,specs:[]};let[D,j]=O.split("/"),J=wu(P,(re)=>re.owner===D&&re.repo===j);if(new Set(J.map((re)=>ts(re)?.ref).filter((re)=>!!re)).size<2)return{ok:!0,specs:J};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${O}. Use an explicit ref:`,`  cc-safety-net rule remove ${O}#<ref>`],entries:[]}}}function ts(P){try{return N(P)}catch{return null}}function wu(P,O){return P.filter((D)=>{let j=ts(D);return j?O(j):!1})}async function mo(P,O={}){let D=os(O);return mv(P,D,await fo(P,D,Mn()))}function mv(P,O,D){if(!D.ok)return D;let j=kn(P,O),J=[...new Set(B(j.configPath,j.filesystemScope))];if(J.length===0)return D;return{ok:!1,errors:J,entries:D.entries}}async function fo(P,O,D,j={},J=new Set,Y=new Set){try{let re=kn(P,O),ie=Qi(re.configTarget);if(!ie.ok)return ie.result;let de=ie.config,fe=O.only?hu(de,O.only):{ok:!0,specs:de.rules};if(!fe.ok)return fe.result;let we=new Set([...O.refresh?fe.specs:[],...J]),Ce=(rn)=>du(rn,re.configDir,re.filesystemScope,D,we.has(rn),!O.refresh||we.has(rn)),Se=await Rv(de.rules,O.refresh?(rn)=>Ce(rn).then((fn)=>({ok:!0,item:fn})).catch((fn)=>{if(ou(fn))throw fn;return{ok:!1,spec:rn,message:fn instanceof Error?fn.message:String(fn)}}):async(rn)=>({ok:!0,item:await Ce(rn)}),D),Ie=Se.filter((rn)=>!rn.ok),Ee=Se.filter((rn)=>rn.ok).map((rn)=>rn.item),qe=Ee.flatMap((rn)=>gv(rn,de.rules)),Fe=Ee.flatMap((rn)=>hv(rn,Y,re)),en=new Set([...qe,...Fe].map((rn)=>rn.spec)),on=[...Ie,...qe,...Fe],sn=[],an=vv(sn,()=>Ee.flatMap((rn)=>en.has(rn.spec)||on.length>0&&Y.has(rn.spec)?[]:yv(rn,re,j,sn)));return{ok:on.length===0,errors:on.map((rn)=>`Failed to update ${rn.spec}: ${rn.message}`),entries:Ee.map(wv),changes:an}}catch(re){return cr(re)}}function gv(P,O){if(!S(P.spec))return[];let D=Ne(P.spec),j=O.filter((J)=>J!==P.spec&&Ne(J).toLowerCase()===D.toLowerCase());if(j.length===0)return[];return[{ok:!1,spec:P.spec,message:`rulebook name "${D}" is also claimed by ${j.join(", ")}; rename one of them`}]}function hv(P,O,D){if(!O.has(P.spec)||!S(P.spec))return[];let j=F(D.configDir,P.rulebook.name),J=r(i(D.filesystemScope,j));if(J===null||J===P.content)return[];return[{ok:!1,spec:P.spec,message:`${j} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function yv(P,O,D,j){if(!S(P.spec))return[];let J=F(O.configDir,P.rulebook.name),Y=i(O.filesystemScope,J),re=r(Y);if(re===P.content)return[];return j?.push({target:Y,previous:re}),g(Y,P.content,void 0,D._testAfterPolicyRename),bv(P,re)}function vv(P,O){try{return O()}catch(D){for(let j of[...P].reverse()){if(j.previous===null){H(j.target);continue}g(j.target,j.previous)}throw D}}function bv(P,O){if(O===null)return[`Vendored ${P.spec} (${P.rulebook.version})`];let D=xe(O),j="problem"in D?null:D.rulebook,J=new Map(j?.rules.map((re)=>[re.name,JSON.stringify(re)])??[]),Y=new Set(P.rulebook.rules.map((re)=>re.name));return[`Updated ${P.spec} (${j?.version??"unreadable"} -> ${P.rulebook.version})`,...[...Y].filter((re)=>!J.has(re)).map((re)=>`  + ${re}`),...[...J.keys()].filter((re)=>!Y.has(re)).map((re)=>`  - ${re}`),...P.rulebook.rules.filter((re)=>{let ie=J.get(re.name);return ie!==void 0&&ie!==JSON.stringify(re)}).map((re)=>`  ~ ${re.name}`)]}function wv(P){return{spec:P.spec,name:P.rulebook.name,version:P.rulebook.version,ruleCount:P.rulebook.rules.length}}async function ku(P,O,D={}){return kv(P,O,Ev(D),Mn())}async function kv(P,O,D,j,J={}){let Y=null,re=!1;try{let ie=kn(P,D),de=r(ie.configTarget);Y={target:ie.configTarget,content:de};let fe=Qi(ie.configTarget);if(!fe.ok)return fe.result;let we=fe.config,Ce=Z(O);xv(O,D,Ce);let Se=Ce?await uu(O,{ref:D.ref,operation:j}):null,Ie=Se?Cv(Se,D.rulebooks):[],Ee=Se?Ie.map((sn)=>Sv(we.rules,Se,sn)??`${O}#${Se.ref}/${sn}`):[O],qe=Ee.filter((sn)=>!we.rules.includes(sn)),Fe=[...we.rules,...qe];if(Fe.length>ye)return Pv();if(Fe.length!==we.rules.length)re=!0,wn(ie.configTarget,{version:1,rules:Fe,overrides:we.overrides??{},transparent_wrappers:we.transparent_wrappers??[]},void 0,J._testAfterPolicyRename);let en=await fo(P,D,j,J,new Set(qe),new Set(qe));if(!en.ok)lr(ie.configTarget,de);if(!en.ok||!Se)return en;let on=Ie.filter((sn,an)=>qe.includes(Ee[an]??""));return{...en,add:{source:O,ref:Se.ref,selected:Ie,added:on,alreadyConfigured:Ie.filter((sn)=>!on.includes(sn)),commits:qe.length>0?[Se.commit]:[]}}}catch(ie){if(re&&Y)try{lr(Y.target,Y.content)}catch(de){return cr(de)}return cr(ie)}}function xv(P,O,D){if(!D&&O.rulebooks!==void 0)throw Error("--only can only select rulebooks from an owner/repo source");if(!D&&O.ref)throw Error(`--ref can only select a ref for an owner/repo source: ${P}`);if(O.rulebooks?.length===0)throw Error("--only requires at least one rulebook name");let j=O.rulebooks?.filter((J)=>!d.test(J))??[];if(j.length>0)throw Error(`Invalid rulebook names: ${j.join(", ")}`)}function Cv(P,O){let D=O?[...new Set(O)]:P.names,j=D.filter((J)=>!P.names.includes(J));if(j.length>0)throw Error(`Rulebooks not found in ${P.source} at ${P.ref}: ${j.join(", ")}
Available rulebooks: ${P.names.join(", ")}`);return D}function Sv(P,O,D){let j=`${O.source}#${O.ref}/${D}`;if(P.includes(j))return j;let J=`${O.source}#${O.commit}/${D}`;return P.find((Y)=>Y===J)}async function Rv(P,O,D=Mn()){if(P.length>ye)throw Error(be);let j=[],J=0,Y,re=Array.from({length:Math.min(P.length,lo.concurrency)},async()=>{while(!Y){let ie=J;if(ie>=P.length)return;J++;try{j[ie]=await O(P[ie],ie,D.controller.signal)}catch(de){if(!Y)Y={value:de},J=P.length,D.controller.abort(de);return}}});if(await Promise.all(re),Y)throw Y.value;return j}function Pv(){return{ok:!1,errors:[be],entries:[]}}function os(P){return{cwd:P.cwd,userConfigDir:P.userConfigDir,userConfigPath:P.userConfigPath,projectConfigPath:P.projectConfigPath,global:P.global,only:P.only,refresh:P.refresh}}function Ev(P){return{...os(P),ref:P.ref,rulebooks:P.rulebooks}}function Av(P){return{...os(P),deleteSource:P.deleteSource}}async function xu(P,O,D={}){try{return await Iv(P,O,Av(D),{})}catch(j){return cr(j)}}async function Iv(P,O,D,j){let J=kn(P,D),Y=m(J.configTarget);if(Y.errors.length>0)return{ok:!1,errors:Y.errors,entries:[]};if(!Y.config)return{ok:!1,errors:[`No config found at ${J.configPath}`],entries:[]};let re=yu(Y.config.rules,O);if(!re.ok)return re.result;let ie=D.deleteSource?_v(J.configDir,re.specs,J.filesystemScope):{ok:!0,dirs:[]};if(!ie.ok)return ie.result;let de=r(J.configTarget);if(de===null)return cr(Error("Rules config is unavailable."));try{wn(J.configTarget,{version:1,rules:Y.config.rules.filter((Ce)=>!re.specs.includes(Ce)),overrides:Y.config.overrides??{},transparent_wrappers:Y.config.transparent_wrappers??[]},void 0,j._testAfterPolicyRename)}catch(Ce){throw lr(J.configTarget,de),Ce}let fe=await fo(P,D,Mn(),j);if(!fe.ok)return lr(J.configTarget,de),fe;let we=Tv(ie.dirs,j,J.filesystemScope);if(!we.ok){lr(J.configTarget,de);let Ce=await fo(P,D,Mn(),j);if(!Ce.ok)return{ok:!1,errors:[...we.result.errors,...Ce.errors],entries:Ce.entries};return we.result}return fe}function _v(P,O,D){let j=O.flatMap((ie)=>d.test(ie)?[]:["--delete-source can only delete local rulebook sources"]),J=O.map((ie)=>rs(P,ie)),Y=j.length>0?[]:J.flatMap((ie)=>Cu(ie,D)),re=[...j,...Y];return re.length>0?{ok:!1,result:{ok:!1,errors:re,entries:[]}}:{ok:!0,dirs:J}}function Cu(P,O){let D=fv(P),j=i(O,D),J=me(j);if(!J)return[`Local rulebook source directory not found: ${P}`];let Y=J.find((re)=>re.name==="rulebook.json");if(!Y)return[`Local rulebook source directory is missing rulebook.json: ${P}`];if(Y.kind!=="file")throw new o(O.label);if(r(i(O,rs(D,"rulebook.json"))),J.length>1)return[`Local rulebook source directory contains extra files: ${P}. delete manually if you really want to remove the directory.`];return[]}function Tv(P,O,D){let j=P.flatMap((J)=>{try{if(!me(i(D,J)))return[];let Y=Cu(J,D);if(Y.length>0)return Y;return $v(J,O,D),[]}catch(Y){return[`Failed to delete local rulebook source ${J}: ${Y instanceof Error?Y.message:String(Y)}`]}});return j.length>0?{ok:!1,result:{ok:!1,errors:j,entries:[]}}:{ok:!0}}function $v(P,O,D){if(O._testDeleteLocalSourceDir){O._testDeleteLocalSourceDir(P);return}H(i(D,rs(P,ge))),at(i(D,P))}function lr(P,O){if(O===null){H(P);return}g(P,O)}function cr(P){return{ok:!1,errors:[P instanceof Error?P.message:String(P)],entries:[]}}var Ov=".safety-net.json",Dv="~/.cc-safety-net/config.json";async function Eu(P,O){let D=L(P,{cwd:O.cwd});if(D)console.log(`Skipped the project scope: ${_(O.cwd)} is the user rule config, not a project rule config`);return[D||await Ru(P,{legacyPath:pa({cwd:O.cwd}),configPath:_(O.cwd),defaultRulebookName:"project-rules",migratedFrom:Ov,cleanup:O.cleanup,syncOptions:{cwd:O.cwd}}),await Ru(P,{legacyPath:Ct(P),configPath:W(P),defaultRulebookName:"user-rules",migratedFrom:Dv,cleanup:O.cleanup,syncOptions:{cwd:O.cwd,global:!0}})].every((J)=>J)?0:1}async function Ru(P,O){let D=kn(P,O.syncOptions),j=i(D.filesystemScope,O.legacyPath),J=r(j);if(J===null)return console.log(`No legacy config found at ${O.legacyPath}`),!0;let Y=Nv(J);if(!Y.ok){for(let Ie of Y.errors)console.error(Ie);return!1}let re=m(D.configTarget);if(re.errors.length>0){for(let Ie of re.errors)console.error(Ie);return!1}let ie=re.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},de=jv(Su(O.configPath),ie.rules,O.defaultRulebookName,O.migratedFrom,D.filesystemScope),fe=go(Su(O.configPath),de,"rulebook.json"),we=i(D.filesystemScope,fe),Ce=[Pu(D.configTarget),Pu(we)],Se=await Lv(P,O,D.configTarget,we,de,Y.config.rules,ie.rules.includes(de)?ie.rules:[...ie.rules,de],ie.overrides??{},ie.transparent_wrappers??[]);if(!Se.ok){Mv(Ce);for(let Ie of Se.errors)console.error(Ie);return!1}if(!O.cleanup)return console.log(`Migrated legacy config at ${O.legacyPath}. Legacy file is no longer used.`),!0;if(!Hv(D.configTarget,we,de,O.migratedFrom,Y.config.rules))return console.error(`Migration cleanup verification failed for ${O.legacyPath}`),!1;return H(j),console.log(`Deleted legacy config at ${O.legacyPath}`),!0}async function Lv(P,O,D,j,J,Y,re,ie,de){try{return wn(D,{version:1,rules:re,overrides:ie,transparent_wrappers:de}),wn(j,Fv(J,O.migratedFrom,Y)),await mo(P,O.syncOptions)}catch(fe){return{ok:!1,errors:[fe instanceof Error?fe.message:String(fe)]}}}function Nv(P){try{let O=JSON.parse(P),D=Po(O);if(D.errors.length>0)return{ok:!1,errors:D.errors};return{ok:!0,config:{version:1,rules:O.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function jv(P,O,D,j,J){let Y=O.find((re)=>Uv(i(J,go(P,re,"rulebook.json")))===j);if(Y)return Y;if(r(i(J,go(P,D,"rulebook.json")))===null)return D;for(let re=2;;re++){let ie=`${D}-${re}`;if(r(i(J,go(P,ie,"rulebook.json")))===null)return ie}}function Fv(P,O,D){return{rulebook_version:1,name:P,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:O,allowed_commands:[...new Set(D.map((j)=>j.command))],rules:D,tests:D.map((j)=>({command:[j.command,j.subcommand,j.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:j.name}))}}function Hv(P,O,D,j,J){if(!m(P).config?.rules.includes(D))return!1;try{let re=r(O);if(re===null)return!1;let ie=JSON.parse(re);return ie.migrated_from===j&&JSON.stringify(ie.rules)===JSON.stringify(J)}catch{return!1}}function Pu(P){return{target:P,content:r(P)}}function Mv(P){for(let O of P){if(O.content===null){H(O.target);continue}g(O.target,O.content)}}function Uv(P){let O=r(P);if(O===null)return null;try{let D=JSON.parse(O);return typeof D.migrated_from==="string"?D.migrated_from:null}catch{return null}}import{mkdir as Gv,readFile as Bv,writeFile as qv}from"node:fs/promises";import{dirname as Vv,join as Jv}from"node:path";var zv=86400000,Kv=604800000;async function Iu(P,O=Date.now()){if(P.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let D=We(P);if(!D)return null;let j=Jv(D,".cc-safety-net","update-check.json"),J=await Wv(j,O);if(!J.lastCheck||O-J.lastCheck>zv){let ie=await Gn();if(J.lastCheck=O,ie.latestVersion)J.latestVersion=ie.latestVersion;if(!await Au(j,J))return null;if(ie.error)return null}let Y=J.latestVersion,re=pn();if(!Y||!$o(Y,re))return null;if(J.notifiedVersion===Y&&J.notifiedAt!==void 0&&O-J.notifiedAt<Kv)return null;if(J.notifiedVersion=Y,J.notifiedAt=O,!await Au(j,J))return null;return`UPDATE_AVAILABLE: cc-safety-net v${Y} is available (running v${re}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function Wv(P,O){let D=await Bv(P,"utf8").then((Y)=>JSON.parse(Y)).catch(()=>{return});if(!D||typeof D!=="object"||Array.isArray(D))return{};let j=D,J=(Y)=>typeof Y==="number"&&Number.isFinite(Y)&&Y<=O?Y:void 0;return{lastCheck:J(j.lastCheck),latestVersion:typeof j.latestVersion==="string"?j.latestVersion:void 0,notifiedVersion:typeof j.notifiedVersion==="string"?j.notifiedVersion:void 0,notifiedAt:J(j.notifiedAt)}}async function Au(P,O){return Gv(Vv(P),{recursive:!0,mode:448}).then(()=>qv(P,JSON.stringify(O),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as Yv,resolve as is}from"node:path";var _u="CC Safety Net Config",Zv="═".repeat(_u.length),Xv="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",Qv=new Set(["rule.json","rule.lock","cache"]);function Tu(P,O={}){try{return eb(P,O)}catch(D){if(D instanceof o)return console.error(D.message),1;throw D}}function eb(P,O){let D=O.cwd??process.cwd(),j=X(P,{cwd:D}),J=Ct(P),Y=vr(D),re=is(D,he),ie=i(j.userScope,J),de=i(j.projectScope,Y),fe=!1,we=!1,Ce=[],Se=[],Ie=nb(i(j.projectScope,re));if(rb(),r(j.userConfigTarget)!==null){let Ee=Un(j.userConfigTarget);if(Ee.errors.push(...B(j.userConfigPath,j.userScope)),Ce.push({scope:"User",path:j.userConfigPath,result:Ee,schema:"rules",target:j.userConfigTarget}),Ee.errors.length>0)fe=!0}if(r(ie)!==null)if(we=!0,r(j.userConfigTarget)!==null)Se.push(ho("user","cleanup"));else{let Ee=Eo(ie);if(Ce.push({scope:"User",path:J,result:Ee,schema:"legacy",inactive:!0,target:ie}),Se.push(ho("user",Ee.errors.length>0?"fix-or-delete":"migrate")),Ee.errors.length>0)fe=!0}if(r(j.projectConfigTarget)!==null){let Ee=Un(j.projectConfigTarget);if(Ee.errors.push(...B(j.projectConfigPath,j.projectScope)),Ce.push({scope:"Project",path:is(j.projectConfigPath),result:Ee,schema:"rules",target:j.projectConfigTarget}),Ee.errors.length>0)fe=!0;if(r(de)!==null)we=!0,Se.push(ho("project","cleanup"))}else if(r(de)!==null){we=!0,fe=!0;let Ee=Eo(de);Ce.push({scope:"Project",path:is(Y),result:Ee,schema:"legacy",inactive:!0,target:de}),Se.push(ho("project",Ee.errors.length>0?"fix-or-delete":"migrate"))}if(Ie?.result.errors.length)fe=!0;if(Ce.length===0&&!Ie)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Ee of Ce)if(Ee.inactive)ib(Ee.scope,Ee.path,Ee.result);else if(Ee.result.errors.length>0)sb(Ee.scope,Ee.path,Ee.result.errors);else{if(Ee.schema==="rules"&&cb(Ee.target))console.log(`
Added $schema to ${Ee.scope.toLowerCase()} config.`);ob(Ee.scope,Ee.path,Ee.result,Ee.schema)}for(let Ee of Se)console.error(`
${nn.red(Ee)}`);if(Ie)if(Ie.result.errors.length>0)lb(Ie.path,Ie.result.errors);else ab(Ie.path,Ie.result);if(fe)return console.error(`
Config validation failed.`),1;return console.log(we?`
Configs valid with warnings.`:`
All configs valid.`),0}function ho(P,O){let D=`legacy ${P} config`;if(O==="cleanup")return`Warning: Legacy ${P} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(O==="migrate")return`Warning: Legacy ${P} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${P} config is no longer supported. Fix or delete the ${D}, then run \`npx -y cc-safety-net rule migrate\`.`}function nb(P){if(me(P)===null)return null;let O=tb(P);if(O.ruleNames.size===0&&O.errors.length===0)return null;return{path:P.path,result:O}}function tb(P){let O=[],D=new Set,j=(me(P)??[]).filter((J)=>!Qv.has(J.name)).sort((J,Y)=>J.name.localeCompare(Y.name));if(j.length===0)return{errors:O,ruleNames:D};for(let J of j){if(!d.test(J.name)){O.push(`rulebook directory names must match ${d}: ${J.name}`);continue}if(J.kind!=="directory"){O.push(`${J.name} must be a rulebook directory`);continue}let Y=i(P.scope,Yv(P.path,J.name,"rulebook.json")),re=r(Y);if(re===null){O.push(`${J.name}/rulebook.json is required`);continue}try{let ie;try{ie=JSON.parse(re)}catch{O.push(`${J.name}/rulebook.json: invalid JSON`);continue}let de=le(ie);if(de.name!==J.name){O.push(`rulebook name "${de.name}" must match folder "${J.name}"`);continue}let fe=ao(de);if(fe.length>0){O.push(...fe.map((we)=>`${J.name}/rulebook.json: ${we}`));continue}D.add(J.name)}catch(ie){O.push(ie instanceof Error?`${J.name}/rulebook.json: ${ie.message}`:`${J.name}/rulebook.json: ${String(ie)}`)}}return{errors:O,ruleNames:D}}function rb(){console.log(_u),console.log(Zv)}function ob(P,O,D,j){if(console.log(`
✓ ${P} config: ${O}`),console.log(`  Schema: ${j==="rules"?"rulebook sources":"legacy inline rules"}`),D.ruleNames.size>0){console.log(`  ${j==="rules"?"Sources":"Rules"}:`);let J=1;for(let Y of D.ruleNames)console.log(`    ${J}. ${Y}`),J++}else console.log(`  ${j==="rules"?"Sources":"Rules"}: (none)`)}function ib(P,O,D){if(console.error(`
✗ Legacy ${P.toLowerCase()} config: ${O}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),D.errors.length>0){console.error("  Errors:");let j=1;for(let J of D.errors)for(let Y of J.split("; "))console.error(`    ${j}. ${Y}`),j++;return}if(D.ruleNames.size>0){console.error("  Rules:");let j=1;for(let J of D.ruleNames)console.error(`    ${j}. ${J}`),j++;return}console.error("  Rules: (none)")}function sb(P,O,D){$u(`${P} config`,O,D)}function ab(P,O){console.log(`
✓ GitHub source rules: ${P}`),console.log("  Rulebooks:");let D=1;for(let j of O.ruleNames)console.log(`    ${D}. ${j}`),D++}function lb(P,O){$u("GitHub source rules",P,O)}function $u(P,O,D){console.error(`
✗ ${P}: ${O}`),console.error("  Errors:");let j=1;for(let J of D)for(let Y of J.split("; "))console.error(`    ${j}. ${Y}`),j++}function cb(P){try{let O=r(P);if(O===null)return!1;let D=JSON.parse(O);if(D.$schema)return!1;return g(P,JSON.stringify({$schema:Xv,...D},null,2)),!0}catch(O){if(O instanceof o)throw O;return!1}}var Ou=new Set(["init","add","remove","update","sync","list","wrapper","migrate","doc","verify"]),ub=new Set(["init","add","remove","update","sync","wrapper"]),pb=new Set(["add","remove","list"]),fb="cc-safety-net/rulebooks";async function Du(P,O){try{return await mb(P,O)}catch(D){if(D instanceof o)return console.error(D.message),1;throw D}}async function mb(P,O){let D=hb(O),j=D.help?gb(D.positionals):null;if(j)return Lt(j),0;if(D.errors.length>0){for(let fe of D.errors)console.error(fe);return 1}let J=D.positionals[0];if(!J)return Lt(xt,console.error),1;let Y=D.positionals[1],re={global:D.global},ie=process.cwd();if(!D.global&&ub.has(J)&&!(J==="wrapper"&&Y==="list")&&L(P,{cwd:ie}))return console.error(`${_(ie)} is the user rule config, not a project rule config; use --global for the user scope, or run from a project directory`),1;if(J==="init"){let fe=kn(P,re);wb(fe.configTarget);let we=db(fe.configDir,"example-rules","rulebook.json"),Ce=i(fe.filesystemScope,we);if(D.example&&r(Ce)===null)ru(Ce);let Se=B(fe.configPath,fe.filesystemScope);for(let Ie of Se)console.error(Ie);if(Se.length>0)return 1;return console.log("Rule config initialized."),0}if(J==="add"){let fe=Lu(D);if(!fe)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let we=kn(P,re),Ce=await ku(P,fe,{...re,ref:D.ref,rulebooks:D.only.length>0?D.only:void 0});return Xd(Ce,fe,`Scope: ${D.global?"user":"project"} (${we.configDir})`),Ce.ok?0:1}if(J==="remove"){if(!Y)return console.error("rule remove requires a source"),1;let fe=await xu(P,Y,{...re,deleteSource:D.deleteSource});return so(fe,`Removed rulebook source: ${Y}`),fe.ok?0:1}if(J==="update"){let fe=await mo(P,{...re,only:Y,refresh:!0});return so(fe,"Rule config updated."),fe.ok?0:1}if(J==="sync")return ga(P,{global:D.global});if(J==="list"){let fe=Q(P,{cwd:ie});return eu(fe),fe.errors.length>0?1:0}if(J==="wrapper")return kb(P,D);if(J==="migrate")return Eu(P,{cleanup:D.cleanup,cwd:ie});if(J==="doc"){console.log(Yd);let fe=await Iu(P);if(fe)console.error(fe);return 0}if(J==="verify")return Tu(P);return 1}function gb(P){if(P.length===0)return xt;let O=xt.subcommands.filter((j)=>j.usage.split(" ")[0]===P[0]);if(O.length===0)return null;if(P.length===1&&O.length>1)return{name:`rule ${P[0]}`,description:`Subcommands of rule ${P[0]}`,usage:`rule ${P[0]} <subcommand>`,subcommands:O,options:[]};let D=P.length===1?O[0]:O.find((j)=>j.usage.split(" ")[1]===P[1]);if(!D)return null;return{name:`rule ${P[0]}`,description:D.description,usage:`rule ${D.usage}`,options:P[0]==="add"?Co:[],examples:P[0]==="add"?So:void 0}}function hb(P){let O=gn({label:"rule",booleans:{global:["-g","--global"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"]},lists:{only:["--only"]},positionals:"list"},P),D={...O.flags,ref:O.values.ref,only:O.lists.only??[],help:O.help,positionals:O.positionals,errors:O.errors};return yb(D),D}function yb(P){let[O]=P.positionals;if(O&&!Ou.has(O))P.errors.push(`Unknown rule subcommand: ${O}`);if(P.deleteSource&&O!=="remove")if(O&&Ou.has(O))P.errors.push(`Unknown option for rule ${O}: --delete-source`);else P.errors.push("--delete-source is only valid with 'rule remove'");if(P.cleanup&&O!=="migrate")P.errors.push(dr(O,"--cleanup"));if(P.example&&O!=="init")P.errors.push(dr(O,"--example"));if(P.ref&&O!=="add")P.errors.push(dr(O,"--ref"));if(P.only.length>0&&O!=="add")P.errors.push(dr(O,"--only"));if(O==="add")vb(P);if(O==="migrate"){if(P.global)P.errors.push(dr(O,"--global"));if(P.positionals.length>1)P.errors.push(`Unexpected rule migrate argument: ${P.positionals[1]}`)}else if(O==="wrapper")bb(P);else if(P.positionals.length>2)P.errors.push(`Unexpected rule argument: ${P.positionals[2]}`);if(O==="list"&&P.global)P.errors.push("Unknown option for rule list: --global")}function Lu(P){if(P.positionals[1])return P.positionals[1];if(P.ref||P.only.length>0)return fb;return}function vb(P){let O=Lu(P);if(!O)return;if((P.ref||P.only.length>0)&&!Z(O)){if(P.ref)P.errors.push(`--ref can only select a ref for an owner/repo source: ${O}`);if(P.only.length>0)P.errors.push("--only can only select rulebooks from an owner/repo source");return}if(P.ref&&!ae(P.ref))P.errors.push(`--ref must use valid path segments: ${P.ref}`);let D=P.only.filter((j)=>!d.test(j));if(D.length>0)P.errors.push(`Invalid rulebook names: ${D.join(", ")}`)}function dr(P,O){return P?`Unknown option for rule ${P}: ${O}`:`Unknown option for rule: ${O}`}function bb(P){let O=P.positionals[1],D=P.positionals[2];if(!O){P.errors.push("rule wrapper requires add, remove, or list");return}if(!pb.has(O)){P.errors.push(`Unknown rule wrapper action: ${O}`);return}if(O==="list"){if(D)P.errors.push(`Unexpected rule wrapper argument: ${D}`);return}if(!D){P.errors.push(`rule wrapper ${O} requires a command`);return}if(P.positionals.length>3)P.errors.push(`Unexpected rule wrapper argument: ${P.positionals[3]}`)}function wb(P){if(r(P)===null){tu(P);return}let O=m(P);if(!O.config)return;wn(P,{version:1,rules:O.config.rules,overrides:O.config.overrides??{},transparent_wrappers:O.config.transparent_wrappers??[]})}async function kb(P,O){let D=O.positionals[1],j=O.positionals[2],J=kn(P,{global:O.global}).configTarget;if(D==="list"){let de=m(J);if(de.errors.length>0){for(let fe of de.errors)console.error(fe);return 1}return xb(de.config?.transparent_wrappers??[]),0}if(!j||!w.test(j))return console.error("transparent wrapper must match command pattern"),1;if(Ae(j))return console.error(`reserved command "${j}" cannot be a wrapper`),1;let Y=m(J);if(Y.errors.length>0){for(let de of Y.errors)console.error(de);return 1}let re=Y.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},ie=D==="add"?[...new Set([...re.transparent_wrappers??[],j])]:(re.transparent_wrappers??[]).filter((de)=>de!==j);return wn(J,{version:1,rules:re.rules,overrides:re.overrides??{},transparent_wrappers:ie}),console.log(D==="add"?`Added transparent wrapper: ${j}`:`Removed transparent wrapper: ${j}`),0}function xb(P){if(P.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${P.length}):`);for(let O of P)console.log(`  - ${O}`)}import{sep as Ab}from"node:path";import{existsSync as Cb,readFileSync as Sb}from"node:fs";import{join as Rb}from"node:path";async function Pb(P){if(P.isTTY)return null;return(await Ke(P).catch(()=>null))?.trim()||null}function Eb(P){let O=P.env.get("CLAUDE_SETTINGS_PATH");if(O)return O;return Rb(Ar(P),"settings.json")}function ss(P){let O=Eb(P);if(!Cb(O))return!1;try{let D=Sb(O,"utf-8"),j=JSON.parse(D);if(!j.enabledPlugins)return!1;let J="cc-safety-net@cc-marketplace";if(!(J in j.enabledPlugins))return!1;return j.enabledPlugins[J]===!0}catch(D){if(x(n.debug,P.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${O}: ${D instanceof Error?D.message:String(D)}`);return!1}}async function as(P,O=process.stdin){let D=ss(P),j;if(!D)j="\uD83D\uDEE1️ CC Safety Net ❌";else{let Y=E(P,{cwd:process.cwd()}),re=Y.policy,ie=T(re,P.env),de=Object.values(V(re,ie.capabilities)).some((Ce)=>Ce.changesInherited),fe={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[de?"custom":ie.effectiveLevel],we=Y.policyScopes&&!Y.policyScopes.weakeningsIgnored&&Y.policyScopes.weakenings.length>0?"\uD83D\uDD3B":"";j=`\uD83D\uDEE1️ CC Safety Net ${fe}${ie.worktreeMode?"\uD83C\uDF33":""}${we}${Y.state==="degraded"?"⚠️":""}`}let J=await Pb(O);if(J&&!J.startsWith("{"))console.log(`${J} | ${j}`);else console.log(j)}function Nu(P){let O=E(P,{cwd:process.cwd()}),D=O.policy,j=T(D,P.env),J=!!process.env.NO_COLOR||!process.stdout.isTTY,Y=Math.min(process.stdout.columns||80,100),re=J?"ok":"✔",ie=J?"OFF":"✘",de=(qe,Fe)=>{let en=`  ${qe.padEnd(13)}${Fe}`;return(en.length>Y?`${en.slice(0,Y-1)}…`:en).replaceAll(ie,nn.red(ie))},fe=Object.values(V(D,j.capabilities)).some((qe)=>qe.changesInherited),we=(qe)=>qe===P.home||qe.startsWith(`${P.home}${Ab}`)?`~${qe.slice(P.home.length)}`:qe,Ce={ready:nn.green,degraded:nn.yellow}[O.state],Se=O.policyScopes?.weakenings??[],Ie=[...ss(P)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...O.diagnostics],Ee=J?"-":"·";console.log([`${J?"":"\uD83D\uDEE1️  "}CC Safety Net — ${Ce(O.state)}`,"",de("Protection",`destructive ${D.destructiveCommandProtectionEnabled?re:ie}   secrets ${D.secretProtection.enabled?re:ie}`),de("Level",fe?`${j.effectiveLevel} (customised)`:j.effectiveLevel),de("Rules",D.rules.length===0?"none active":`${D.rules.length} active`),de("Policy",we(l(P))),...O.policyScopes?[de("Project",we(h(process.cwd())))]:[],...j.worktreeMode?[de("Worktree","relaxations active")]:[],"",...Se.length===0?[]:[O.policyScopes?.weakeningsIgnored?"  Project policy (ignored)":"  Project policy",...Se.flatMap((qe)=>Xt(qe,"      ",Y-6).map((Fe,en)=>en===0?`    ${Fe}`:Fe)),""],...Ie.length===0?["  Everything configured is active."]:["  Not active",...Ie.flatMap((qe)=>Xt(qe,"      ",Y-6).map((Fe,en)=>en===0?`    ${Ee} ${Fe}`:Fe)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as zu}from"node:child_process";import{randomBytes as Fb}from"node:crypto";import{existsSync as Hb}from"node:fs";import{createServer as Mb}from"node:http";import{Writable as Ub}from"node:stream";var yo=500;function Ib(P){let O=P.filter((J)=>J.decision!=="allow"),D=P.filter((J)=>J.decision==="allow"),j=Math.min(O.length,Math.max(yo-D.length,Math.ceil(yo/2)));return[...O.slice(0,j),...D.slice(0,yo-j)]}function ju(P,O,D=U(P)){if(D)K(P,D);let j=(Fe)=>new Date(Fe.getFullYear(),Fe.getMonth(),Fe.getDate()).getTime(),J=j(new Date),Y=new Date(J);Y.setDate(Y.getDate()-(O-1));let re=Y.getTime(),ie=[],de={count:0};for(let Fe of D?zn(D,de):[])for(let en of kt(Fe,de)){let on=new Date(en.ts).getTime();if(!Number.isFinite(on))continue;if(on>=re)ie.push(en)}ie.sort((Fe,en)=>new Date(en.ts).getTime()-new Date(Fe.ts).getTime());let fe=Array.from({length:O},()=>0),we=Array.from({length:O},()=>0),Ce={},Se={},Ie={},Ee=0,qe=0;for(let Fe of ie){let en=Fe.agent||"unknown";Ce[en]=(Ce[en]??0)+1;let on=Math.round((J-j(new Date(Fe.ts)))/86400000),sn=O-1-on,an=on>=0&&on<O;if(an)we[sn]=(we[sn]??0)+1;if(Fe.decision!=="allow"){if(Ee++,Fe.ruleId)Se[Fe.ruleId]=(Se[Fe.ruleId]??0)+1;let rn=ko(Fe.segment||Fe.command);if(rn)Ie[rn]=(Ie[rn]??0)+1;if(Fe.failureStage)qe++;if(an)fe[sn]=(fe[sn]??0)+1}}return{days:O,logsDir:D,homeDir:P.home,totalInWindow:ie.length,truncated:ie.length>yo,unreadable:de.count,counts:{blocked:Ee,allowed:ie.length-Ee,agents:Ce,blockedByDay:fe,analyzedByDay:we,rules:Se,commands:Ie,errors:qe},entries:Ib(ie).sort((Fe,en)=>new Date(en.ts).getTime()-new Date(Fe.ts).getTime())}}import{spawn as _b}from"node:child_process";import{existsSync as Tb,statSync as Fu}from"node:fs";import{delimiter as $b,join as Ob}from"node:path";var Db=120000,vo="Choose the project folder",Lb=`try
  return POSIX path of (choose folder with prompt "${vo}")
on error number -128
  return ""
end try`,Nb=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${vo}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Hu=[{binary:"zenity",args:["--file-selection","--directory",`--title=${vo}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",vo]}],Mu=(P,O)=>(O.PATH??"").split($b).some((D)=>{if(D.length===0)return!1;try{let j=Fu(Ob(D,P));return j.isFile()&&(j.mode&73)!==0}catch{return!1}});function ls(P,O){if(P==="darwin"||P==="win32")return!0;if(P!=="linux")return!1;if(!O.DISPLAY&&!O.WAYLAND_DISPLAY)return!1;return Hu.some((D)=>Mu(D.binary,O))}function jb(P,O){if(P==="darwin")return{cmd:"osascript",args:["-e",Lb]};if(P==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",Nb]};let D=Hu.find((j)=>Mu(j.binary,O));return D?{cmd:D.binary,args:D.args}:null}function cs(P=process.platform,O=process.env){let D=jb(P,O);if(!D)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((j)=>{let J=_b(D.cmd,D.args,{env:O,stdio:["ignore","pipe","pipe"]}),Y="",re=!1,ie=(fe)=>{if(re)return;re=!0,clearTimeout(de),j(fe)},de=setTimeout(()=>{J.kill(),ie({error:"The folder dialog timed out"})},Db);J.stdout.on("data",(fe)=>{Y+=fe.toString()}),J.on("error",()=>ie({error:`Could not open the folder dialog (${D.cmd})`})),J.on("close",()=>{let fe=Y.trim().replace(/\/+$/,"");if(!fe)return ie({cancelled:!0});if(!Tb(fe)||!Fu(fe).isDirectory())return ie({error:"That selection is not a folder on disk"});ie({path:fe})})})}var Uu=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CC Safety Net</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22512%22%20height%3D%22512%22%20viewBox%3D%220%200%20512%20512%22%3E%3Crect%20width%3D%22512%22%20height%3D%22512%22%20rx%3D%22112%22%20fill%3D%22%2317161b%22%2F%3E%3Csvg%20x%3D%2240%22%20y%3D%2240%22%20width%3D%22432%22%20height%3D%22432%22%20viewBox%3D%22-172.38%20-172.38%20824.77%20824.77%22%3E%3Cg%20transform%3D%22rotate(45%20240%20240)%22%3E%3Crect%20x%3D%22-30%22%20y%3D%2214%22%20width%3D%22195%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22315%22%20y%3D%2214%22%20width%3D%22195%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22-30%22%20y%3D%2294%22%20width%3D%22115%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22235%22%20y%3D%2294%22%20width%3D%22170%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22155%22%20y%3D%22174%22%20width%3D%22170%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%2275%22%20y%3D%22254%22%20width%3D%22170%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22395%22%20y%3D%22254%22%20width%3D%22115%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22-30%22%20y%3D%22334%22%20width%3D%22195%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22315%22%20y%3D%22334%22%20width%3D%22195%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22-30%22%20y%3D%22414%22%20width%3D%22115%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22235%22%20y%3D%22414%22%20width%3D%22170%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%2214%22%20y%3D%22155%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%2294%22%20y%3D%2275%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%2294%22%20y%3D%22395%22%20width%3D%2252%22%20height%3D%22115%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22174%22%20y%3D%22-30%22%20width%3D%2252%22%20height%3D%22195%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22174%22%20y%3D%22315%22%20width%3D%2252%22%20height%3D%22195%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22254%22%20y%3D%22-30%22%20width%3D%2252%22%20height%3D%22115%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22254%22%20y%3D%22235%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22334%22%20y%3D%22155%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22414%22%20y%3D%2275%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22414%22%20y%3D%22395%22%20width%3D%2252%22%20height%3D%22115%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E%3C%2Fsvg%3E%0A">
  <script>
    (() => {
      const stored = localStorage.getItem('cc-safety-net-theme');
      if (stored === 'light' || stored === 'dark') document.documentElement.style.colorScheme = stored;
    })();
  </script>
  <style>
:root {
  color-scheme: light dark;

  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  --bg: light-dark(#f3f4f6, #0c0e11);
  --surface: light-dark(#ffffff, #16191d);
  --surface-2: light-dark(#f6f7f9, #1c2025);
  --btn-hover-fill: light-dark(#e9ebef, #282c33);
  --field-bg: light-dark(#ffffff, #101317);

  --ink: light-dark(#171a1f, #e7eaed);
  --muted: light-dark(#5b626c, #99a1ac);
  --meta: light-dark(#6b7280, #838b95);

  --border: light-dark(#e3e6ea, #292d33);
  --border-strong: light-dark(#cfd4da, #363b42);

  --switch-track: light-dark(#8b929c, #626973);
  --switch-track-hover: #767d87;
  --switch-knob: #ffffff;

  --focus-ring: var(--ink);

  --accent: light-dark(#166534, #3fb950);
  --safe: #14532d;
  --safe-hover: #0f3d20;
  --danger: #7f1d1d;
  --danger-hover: #641414;

  --star: light-dark(#b7791f, #f2c94c);

  --ok-fg: light-dark(#15803d, #4ade80);
  --ok-bg: light-dark(#edfaf1, #10251a);
  --ok-border: light-dark(#b7e4c7, #1f5133);

  --err-fg: light-dark(#b42318, #ff8078);
  --err-bg: light-dark(#fef2f1, #2b1512);
  --err-border: light-dark(#f2c9c4, #5c2620);

  --warn-fg: light-dark(#b45309, #fbbf24);
  --warn-bg: light-dark(#fefaf0, #2a2008);
  --warn-border: light-dark(#f2ddb0, #5c4a1d);

  --master: light-dark(#1d4ed8, #4c8dff);
  --master-fg: light-dark(#1e40af, #9ec3ff);
  --master-bg: light-dark(#eef4fe, #101a2b);
  --master-border: light-dark(#c5d6f6, #23446e);

  --strict-fg: light-dark(#1e40af, #9ec3ff);
  --strict-bg: light-dark(#eef4fe, #101a2b);
  --strict-border: light-dark(#c5d6f6, #23446e);
  --paranoid-fg: light-dark(#6b21a8, #d8b4fe);
  --paranoid-bg: light-dark(#faf5ff, #21152c);
  --paranoid-border: light-dark(#e4ccf4, #513064);

  --radius-sm: 6px;
  --radius: 8px;
  --radius-lg: 12px;

  --topbar-h: 58px;

  font-family: var(--font-sans);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-size: 13px;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
}

.app-shell {
  display: grid;
  grid-template-columns: 224px minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 14px;
  background: var(--surface);
  border-right: 1px solid var(--border);
}

.brand {
  padding: 0 10px;
}

h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.brand-logo {
  display: flex;
  color: light-dark(#17161b, #f5f4f0);
}

.brand-home {
  display: flex;
  color: inherit;
}

.brand-logo svg {
  width: auto;
  height: 30px;
}

.sidenav {
  display: grid;
  gap: 2px;
}

.sidenav a {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: var(--radius);
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.sidenav a:hover {
  background: var(--surface-2);
  color: var(--ink);
}

.sidenav a[aria-current='page'] {
  background: var(--btn-hover-fill);
  color: var(--ink);
}

.sidenav svg {
  width: 15px;
  height: 15px;
  flex: none;
}

.sidebar-foot {
  margin-top: auto;
  display: grid;
  gap: 10px;
  padding: 0 10px;
}

.sidebar-links {
  display: grid;
  gap: 5px;
  font-size: 12px;
}

.sidebar-links a {
  color: var(--meta);
  text-decoration: none;
}

.sidebar-links a:hover {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.sidebar-links a:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
}

.content {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.app-foot {
  display: none;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  min-height: var(--topbar-h);
  padding: 12px 28px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.topbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex: 1;
  max-width: 1040px;
  margin: 0 auto;
}

.topbar-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.app-status {
  display: inline-flex;
  align-items: center;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--muted);
  font-size: 12px;
  font-weight: 650;
  line-height: 1.25;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
}

.app-status:empty {
  display: none;
}

.app-status.ok {
  color: var(--ok-fg);
  border-color: var(--ok-border);
  background: var(--ok-bg);
}

.app-status.error {
  color: var(--err-fg);
  border-color: var(--err-border);
  background: var(--err-bg);
}

.dirty-chip {
  padding: 6px 12px;
  border: 1px solid var(--warn-border);
  border-radius: 999px;
  background: var(--warn-bg);
  color: var(--warn-fg);
  font-size: 12px;
  font-weight: 650;
  white-space: nowrap;
}

.view-search {
  display: flex;
  align-items: center;
  flex: 1 1 240px;
  min-width: 180px;
  max-width: 380px;
}

.topbar-search {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 440px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

button:not(:disabled),
select,
label.row:not(.row-disabled),
label.rule-control,
input[type='checkbox']:not(:disabled),
input[type='radio']:not(:disabled) {
  cursor: pointer;
}

button {
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 8px 14px;
  background: var(--surface);
  color: var(--ink);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

button:hover:not(:disabled) {
  background: var(--surface-2);
  border-color: var(--muted);
}

#theme-toggle,
#raw-copy,
#activity-refresh,
#integrations-refresh,
#rules-refresh,
#tester-run,
#reset-rule-customizations,
#reset-secret-customizations,
.rule-example-button {
  border-color: transparent;
}

#theme-toggle:hover:not(:disabled),
#raw-copy:hover:not(:disabled),
#activity-refresh:hover:not(:disabled),
#integrations-refresh:hover:not(:disabled),
#rules-refresh:hover:not(:disabled),
#tester-run:hover:not(:disabled),
#reset-rule-customizations:hover:not(:disabled),
#reset-secret-customizations:hover:not(:disabled),
.rule-example-button:hover:not(:disabled) {
  background: var(--btn-hover-fill);
  border-color: transparent;
}

button:disabled {
  opacity: 0.6;
  cursor: progress;
}

button.primary {
  background: var(--safe);
  border-color: var(--safe);
  color: #fff;
}

button.primary:hover:not(:disabled) {
  background: var(--safe-hover);
  border-color: var(--safe-hover);
}

button.danger {
  background: var(--danger);
  border-color: var(--danger);
  color: #fff;
}

button.danger:hover:not(:disabled) {
  background: var(--danger-hover);
  border-color: var(--danger-hover);
}

#theme-toggle {
  display: inline-flex;
  align-items: center;
  align-self: flex-end;
  gap: 7px;
  color: var(--muted);
}

#theme-toggle:hover {
  color: var(--ink);
}

#theme-toggle svg {
  width: 15px;
  height: 15px;
}

button.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  color: var(--muted);
}

button.icon-button:hover:not(:disabled) {
  color: var(--ink);
}

button.icon-button.copied {
  color: var(--ok-fg);
}

button.icon-button.copied:hover:not(:disabled) {
  color: var(--ok-fg);
}

button.icon-button svg {
  width: 16px;
  height: 16px;
}

:where(button, input, textarea):focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

main {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 24px 28px 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.view {
  display: grid;
  gap: 18px;
}

.view[hidden] {
  display: none;
}

.view-head .panel-sub {
  margin-top: 0;
}

.policy-savebar {
  position: sticky;
  top: var(--topbar-h);
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: var(--surface-2);
}

.savebar-actions {
  display: flex;
  gap: 8px;
}

.retention-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 12.5px;
  font-weight: 600;
}

.retention-row input {
  width: 84px;
  text-align: right;
}

.retention-note {
  margin: 8px 0 0;
  font-size: 12px;
}

.tiles-window {
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 11.5px;
  font-weight: 600;
}

.tiles-window:empty {
  display: none;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.tiles:empty {
  display: none;
}

.tile {
  display: grid;
  grid-template-columns: 1fr minmax(0, 168px);
  grid-template-areas:
    'value spark'
    'label spark';
  align-items: center;
  gap: 3px 16px;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.tile strong {
  grid-area: value;
  align-self: end;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.tile span {
  grid-area: label;
  align-self: start;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--muted);
}

.view-all-link {
  align-self: center;
  padding: 8px 14px;
  border-radius: var(--radius);
  color: var(--muted);
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.view-all-link:hover {
  background: var(--btn-hover-fill);
  color: var(--ink);
}

.protection-warning {
  border-color: var(--err-border);
  background: color-mix(in srgb, var(--err-bg) 60%, var(--surface));
}

.dual-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

@media (max-width: 720px) {
  .dual-panels {
    grid-template-columns: 1fr;
  }
}

#top-rules,
#top-commands {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2px;
}

.top-rule,
.top-command {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 7px 10px;
  border-color: transparent;
  background: transparent;
  border-radius: var(--radius-sm);
  text-align: left;
}

.top-rule:hover:not(:disabled),
.top-command:hover:not(:disabled) {
  background: var(--btn-hover-fill);
  border-color: transparent;
}

.top-rule .rule-id,
.top-command .rule-id {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guard-errors {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--warn-border);
  border-radius: var(--radius);
  background: var(--warn-bg);
  color: var(--warn-fg);
  font-size: 12.5px;
  font-weight: 600;
  text-align: left;
}

.activity-controls {
  display: grid;
  gap: 10px;
  margin-bottom: 14px;
}

.activity-controls-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.activity-days {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 650;
  color: var(--muted);
}

.activity-refresh {
  margin-left: auto;
}

@keyframes activity-refresh-spin {
  to {
    transform: rotate(360deg);
  }
}

.activity-refresh.spinning svg {
  animation: activity-refresh-spin 0.6s linear infinite;
}

.integrations-refresh,
.rules-refresh {
  margin-left: auto;
}

.integrations-refresh.spinning svg,
.rules-refresh.spinning svg {
  animation: activity-refresh-spin 0.6s linear infinite;
}

#integrations-list {
  display: grid;
  gap: 8px;
}

.integration-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.integration-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.integration-row .status {
  grid-column: 1 / -1;
}

.integration-row button.primary,
.integration-row button.danger {
  min-width: 88px;
  background: transparent;
  border-color: transparent;
  color: var(--ink);
}

.integration-row button.primary:hover:not(:disabled),
.integration-row button.danger:hover:not(:disabled) {
  color: #fff;
}

#rules-composer-panel .field + .field,
.rules-composer-actions {
  margin-top: 14px;
}

.rules-path-row {
  display: flex;
  gap: 8px;
}

.rules-path-row input {
  flex: 1 1 auto;
  min-width: 0;
}

.rules-path-row button {
  flex: none;
}

#rules-project-path[readonly] {
  border-color: var(--border);
  color: var(--muted);
}

.rules-composer-actions {
  display: flex;
  justify-content: flex-end;
}

#rules-list,
#rules-diagnostics {
  display: grid;
  gap: 8px;
}

.rulebook-card {
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.rulebook-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
  font-size: 12px;
  color: var(--muted);
}

.rulebook-rule {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 3px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.rulebook-head code,
.rulebook-rule code {
  font-family: var(--font-mono);
  font-size: 12px;
  overflow-wrap: anywhere;
}

.rulebook-rule .rule-id {
  color: var(--muted);
}

.rulebook-rule p {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

.rulebook-rule.rules-focus {
  margin: 0 -8px;
  padding: 10px 8px;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
}

select {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 8px 10px;
  background: var(--field-bg);
  color: var(--ink);
  font: inherit;
}

.chip-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.chip-row:empty {
  display: none;
}

button.chip {
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}

button.chip[aria-pressed='true'] {
  background: var(--master-bg);
  border-color: var(--master-border);
  color: var(--master-fg);
}

.chip-count {
  font-variant-numeric: tabular-nums;
}

button.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: var(--master-bg);
  border-color: var(--master-border);
  color: var(--master-fg);
}

button.filter-pill code {
  font-family: var(--font-mono);
}

.filter-pill-x {
  opacity: 0.7;
}

.feed-list {
  display: grid;
  gap: 8px;
}

.feed-item {
  display: grid;
  gap: 7px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.feed-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 11px;
  color: var(--meta);
}

.feed-meta time {
  margin-left: auto;
  white-space: nowrap;
}

.feed-copy,
.feed-report {
  width: 26px;
  height: 26px;
  margin: -4px 0;
  border: 0;
  background: transparent;
}

.feed-copy:hover:not(:disabled),
.feed-report:hover:not(:disabled) {
  background: transparent;
}

.feed-copy svg,
.feed-report svg {
  width: 14px;
  height: 14px;
}

.feed-copy.copied svg {
  width: 12px;
  height: 12px;
}

.feed-meta .rule-id {
  font-family: var(--font-mono);
  color: var(--muted);
  overflow-wrap: anywhere;
}

#tester-result .rule-id {
  font-family: var(--font-mono);
}

button.rule-id {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
}

button.rule-id:hover {
  color: var(--ink);
  text-decoration: underline;
}

.decision-badge {
  padding: 1px 8px;
  border: 1px solid;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.decision-badge.deny {
  color: var(--err-fg);
  background: var(--err-bg);
  border-color: var(--err-border);
}

.decision-badge.allow {
  color: var(--ok-fg);
  background: var(--ok-bg);
  border-color: var(--ok-border);
}

.decision-badge.error {
  color: var(--warn-fg);
  background: var(--warn-bg);
  border-color: var(--warn-border);
}

.agent-badge {
  padding: 1px 8px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  color: var(--muted);
  font-weight: 600;
}

.feed-command,
.rule-example-popover code {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  font-family: var(--font-mono);
  font-size: 12px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.feed-command {
  padding: 8px 10px;
  max-width: 85ch;
  max-height: 7.2em;
  overflow: hidden;
}

.feed-command.clamped {
  mask-image: linear-gradient(180deg, #000 calc(100% - 1.6em), transparent);
}

.feed-command.expanded {
  max-height: none;
  mask-image: none;
}

.feed-toggle {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  font-weight: 650;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.feed-block {
  align-self: center;
  font-size: 11px;
}

.feed-day-sep {
  padding-top: 6px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.tile-spark {
  grid-area: spark;
  display: flex;
  align-items: stretch;
  gap: 2px;
  width: 100%;
  height: 40px;
}

.spark-col {
  position: relative;
  display: flex;
  align-items: flex-end;
  flex: 1 1 0;
  min-width: 1px;
}

.spark-bar {
  width: 100%;
  background: var(--accent);
  border-radius: 1px;
}

.spark-bar.spark-zero {
  background: var(--border-strong);
}

.spark-col::after {
  content: attr(data-count);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  transform: translateX(-50%);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  color: var(--ink);
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
}

.spark-col:hover::after,
.spark-col:focus-visible::after {
  opacity: 1;
}

.spark-col:focus-visible {
  border-radius: var(--radius-sm);
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.feed-reason {
  margin: 0;
  max-width: 85ch;
  font-size: 12px;
}

.activity-count {
  margin: 12px 0 0;
  font-size: 12px;
}

.activity-count:empty {
  display: none;
}

.info-rows {
  display: grid;
  gap: 10px;
}

.info-row {
  display: grid;
  gap: 3px;
}

.info-row > span {
  font-size: 12px;
  font-weight: 650;
  color: var(--muted);
}

.info-row code {
  font-family: var(--font-mono);
  font-size: 12px;
  overflow-wrap: anywhere;
}

.danger-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.danger-row strong {
  font-size: 13px;
}

.danger-row p {
  margin: 4px 0 0;
  font-size: 12px;
}

.status {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  font-size: 13px;
  line-height: 1.45;
  white-space: pre-wrap;
}

.status:empty {
  display: none;
}

.protection-banner {
  padding: 10px 14px;
  border: 1px solid var(--err-fg);
  border-radius: var(--radius);
  background: var(--err-bg);
  color: var(--err-fg);
  font-weight: 600;
}

.status.ok {
  color: var(--ok-fg);
  background: var(--ok-bg);
  border-color: var(--ok-border);
}

.status.error {
  color: var(--err-fg);
  background: var(--err-bg);
  border-color: var(--err-border);
}

.health-strip strong {
  color: var(--ink);
  font-weight: 650;
}

.recovery {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px;
  border: 1px solid var(--err-border);
  border-radius: var(--radius);
  background: var(--surface);
}

.recovery[hidden] {
  display: none;
}

.recovery strong {
  display: block;
  font-size: 13px;
}

.recovery p {
  margin: 4px 0 0;
}

.muted {
  color: var(--muted);
  line-height: 1.45;
}

.confirm-dialog {
  width: min(420px, calc(100vw - 32px));
  padding: 0;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--surface);
  color: var(--ink);
}

.rule-example-popover {
  position: fixed;
  inset: auto;
  width: min(360px, calc(100vw - 24px));
  margin: 0;
  padding: 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 4px 8px rgb(0 0 0 / 18%);
}

.rule-example-popover::backdrop {
  background: transparent;
}

.rule-example-popover > * {
  display: block;
}

.rule-example-label {
  margin-bottom: 3px;
  color: var(--muted);
  font-size: 11px;
}

.rule-example-popover strong {
  margin-bottom: 10px;
  font-size: 13px;
}

.rule-example-popover code {
  padding: 9px 10px;
}

.confirm-dialog::backdrop {
  background: rgb(0 0 0 / 48%);
}

.confirm-dialog form {
  display: grid;
  gap: 12px;
  padding: 18px;
}

.confirm-dialog h2 {
  margin: 0;
}

.confirm-dialog p {
  margin: 0;
}

.dialog-detail {
  padding: 9px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-2);
  overflow-wrap: anywhere;
}

.dialog-detail code {
  font-family: var(--font-mono);
  font-size: 12px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

.report-dialog {
  width: min(680px, calc(100vw - 32px));
}

.confirm-dialog:has(.dialog-rows:not([hidden])) {
  width: min(620px, calc(100vw - 32px));
}

.dialog-rows {
  max-height: 46vh;
  overflow: auto;
}

.diff-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}

.diff-table th {
  padding: 4px 8px;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
  font-weight: 600;
}

.diff-table td {
  padding: 5px 8px;
  border-bottom: 1px solid var(--border);
  overflow-wrap: anywhere;
  vertical-align: top;
}

.diff-table code {
  font-family: var(--font-mono);
  font-size: 11.5px;
}

.diff-before {
  color: var(--muted);
  text-decoration: line-through;
}

.diff-after {
  color: var(--ink);
  font-weight: 650;
}

.diff-warning {
  margin: 8px 0 0;
  padding: 7px 10px;
  border-left: 3px solid var(--warn-border);
  border-radius: var(--radius-sm);
  background: var(--warn-bg);
  color: var(--warn-fg);
  font-size: 12px;
}

.view-head-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.project-draft-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border: 1px solid var(--master-border);
  border-radius: var(--radius);
  background: var(--master-bg);
}

.project-draft-bar[hidden] {
  display: none;
}

.project-draft-target strong {
  display: block;
  font-size: 13px;
}

.project-draft-target code {
  font-family: var(--font-mono);
  font-size: 12px;
  overflow-wrap: anywhere;
}

.project-draft-target p {
  margin: 4px 0 0;
  font-size: 12px;
}

.project-chip {
  flex: none;
  align-self: center;
  margin-left: auto;
  padding: 2px 9px;
  border: 1px solid var(--master-border);
  border-radius: 999px;
  background: var(--master-bg);
  color: var(--master-fg);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.project-chip.inherited {
  border-color: var(--border);
  background: var(--surface-2);
  color: var(--muted);
  font-weight: 600;
}

.rule-row > .project-chip {
  grid-column: 1 / -1;
  justify-self: end;
  margin-left: 0;
}

.project-field-line {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}

.project-chip-slot:empty {
  display: none;
}

.row:has(.project-chip.inherited) strong {
  color: var(--muted);
}

.report-field {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.panel-title {
  min-width: 0;
}

.raw-json-head {
  flex-wrap: nowrap;
}

.raw-json-head .panel-title {
  flex: 1 1 auto;
}

.raw-json-head #raw-copy {
  flex: none;
}

.panel-toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: -4px 0;
  padding: 4px 6px 4px 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}

.panel-toggle:hover {
  background: transparent;
  color: var(--ink);
}

.panel-chevron {
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg) translateY(-1px);
  transition: transform 0.15s ease;
}

.panel-toggle[aria-expanded='false'] .panel-chevron,
:is(.rule-tier-head, .tier-collapse)[aria-expanded='false'] .panel-chevron {
  transform: rotate(-45deg);
}

h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.panel-sub {
  margin: 4px 0 0;
  font-size: 12.5px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 8px;
}

label.row {
  display: flex;
  gap: 12px;
}

label.row,
.rule-row {
  align-items: flex-start;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

label.row:hover {
  border-color: var(--border-strong);
  background: var(--surface-2);
}

label.row.row-disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

label.row.row-disabled:hover {
  border-color: var(--border);
  background: var(--surface);
}

:is(label.row, .rule-control) input[type='checkbox'] {
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  margin: 1px 0 0;
  width: 34px;
  height: 20px;
  flex: none;
  border: 1px solid var(--switch-track);
  border-radius: 999px;
  background: var(--switch-track);
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease;
}

:is(label.row, .rule-control) input[type='checkbox']::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--switch-knob);
  box-shadow: 0 1px 2px rgb(0 0 0 / 30%);
  transition: transform 0.18s ease;
}

:is(label.row, .rule-control) input[type='checkbox']:checked {
  background: var(--accent);
  border-color: var(--accent);
}

:is(label.row, .rule-control) input[type='checkbox']:checked::before {
  transform: translateX(14px);
}

:is(label.row, .rule-control):hover input[type='checkbox']:not(:checked) {
  border-color: var(--switch-track-hover);
  background: var(--switch-track-hover);
}

label.row.safety-override-row {
  display: grid;
  gap: 8px;
}

label.row.safety-override-row select {
  width: 100%;
}

:is(label.row, .rule-control) span {
  display: block;
  min-width: 0;
}

:is(label.row, .rule-control) strong {
  font-weight: 650;
  font-size: 13px;
}

:is(label.row, .rule-control) .rule-id {
  display: block;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
  word-break: break-all;
}

:is(label.row, .rule-control) small {
  display: block;
  margin-top: 4px;
  font-size: 11.5px;
  color: var(--muted);
  line-height: 1.45;
}

#destructive-command > label.row {
  margin-bottom: 16px;
}

.preset-status {
  margin-bottom: 10px;
  font-weight: 700;
}

#safety-preset-status:empty {
  display: none;
}

.preset-status.customized {
  color: var(--master-fg);
}

.preset-standard {
  --preset-fg: var(--ok-fg);
  --preset-bg: var(--ok-bg);
  --preset-border: var(--ok-border);
}

.preset-strict {
  --preset-fg: var(--strict-fg);
  --preset-bg: var(--strict-bg);
  --preset-border: var(--strict-border);
}

.preset-paranoid {
  --preset-fg: var(--paranoid-fg);
  --preset-bg: var(--paranoid-bg);
  --preset-border: var(--paranoid-border);
}

#safety-level label.row:has(input:checked),
#safety-level label.row:has(input:checked):hover {
  border-color: var(--preset-border);
  background: var(--preset-bg);
  accent-color: var(--preset-fg);
}

#safety-level label.row:has(input:checked) strong {
  color: var(--preset-fg);
}

.panel-head-action {
  flex: none;
}

.rule-tier {
  overflow: clip;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
}

.rule-tier + .rule-tier,
#destructive-command-rules + .rule-tier {
  margin-top: 10px;
}

.rule-tier-enforced {
  border-color: var(--ok-border);
}

.rule-tier-strict {
  border-color: var(--strict-border);
}

.rule-tier-paranoid {
  border-color: var(--paranoid-border);
}

.rule-tier-head {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;
  padding: 9px 10px;
  border: 0;
  border-radius: 0;
  background: var(--surface-2);
  color: var(--ink);
  text-align: left;
}

.rule-tier-head:hover:not(:disabled) {
  background: var(--surface-2);
}

.tier-collapse {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  align-self: stretch;
  gap: 12px;
  margin: -9px -10px;
  padding: 9px 10px;
  border: 0;
  border-radius: 0;
  background: none;
  color: inherit;
  text-align: left;
}

.tier-switch {
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  width: 30px;
  height: 16px;
  flex: none;
  padding: 0;
  border: 0;
  background: none;
}

.tier-switch::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 6px;
  transform: translateY(-50%);
  border-radius: 999px;
  background: var(--switch-track);
  transition: background-color 0.18s ease;
}

.tier-switch::before {
  content: '';
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--switch-knob);
  box-shadow: 0 1px 2px rgb(0 0 0 / 30%);
  transition: transform 0.18s ease;
}

.tier-switch:checked::after {
  background: color-mix(in srgb, var(--accent) 45%, transparent);
}

.tier-switch:checked::before {
  transform: translateX(14px);
  background: var(--accent);
}

.rule-tier-enforced .rule-tier-head,
.rule-tier-enforced .rule-tier-head:hover:not(:disabled) {
  background: var(--ok-bg);
  color: var(--ok-fg);
}

.rule-tier-strict .rule-tier-head,
.rule-tier-strict .rule-tier-head:hover:not(:disabled) {
  background: var(--strict-bg);
  color: var(--strict-fg);
}

.rule-tier-paranoid .rule-tier-head,
.rule-tier-paranoid .rule-tier-head:hover:not(:disabled) {
  background: var(--paranoid-bg);
  color: var(--paranoid-fg);
}

.tier-label {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 1px;
}

.tier-label small,
.tier-counts {
  color: inherit;
  font-size: 11px;
}

.tier-counts {
  flex: none;
  font-weight: 500;
  text-align: right;
}

.tier-counts .count-off {
  color: var(--warn-fg);
}

.tier-content {
  padding: 12px;
  border-top: 1px solid var(--border);
}

.rule-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.rule-row:hover {
  border-color: var(--border-strong);
  background: var(--surface-2);
}

.rule-row.row-disabled {
  background: var(--surface);
}

.rule-control {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: flex-start;
  gap: 12px;
}

.rule-row.row-disabled .rule-control {
  cursor: not-allowed;
  opacity: 0.62;
}

.rule-example-button {
  position: relative;
  display: inline-flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  line-height: 1;
}

.rule-example-button::before {
  content: '';
  position: absolute;
  inset: -9px;
}

.rule-example-button:hover:not(:disabled) {
  color: var(--ink);
}

.inherit-button {
  grid-column: 1 / -1;
  justify-self: end;
  padding: 5px 8px;
  font-size: 11px;
}

label.row.master {
  align-items: center;
  padding: 12px 14px;
  border-color: var(--err-border);
  background: color-mix(in srgb, var(--err-bg) 60%, var(--surface));
}

label.row.master:hover {
  border-color: color-mix(in srgb, var(--err-fg) 34%, var(--err-border));
  background: var(--err-bg);
}

label.row.master:not(:has(input:checked)) {
  border-left: 3px solid var(--err-fg);
}

label.row.master:has(input:checked) {
  border-color: var(--master-border);
  background: color-mix(in srgb, var(--master-bg) 72%, var(--surface));
}

label.row.master:has(input:checked):hover {
  border-color: color-mix(in srgb, var(--master) 42%, var(--master-border));
  background: var(--master-bg);
}

label.row.master strong {
  font-size: 15px;
}

label.row.master input[type='checkbox'] {
  margin: 0;
  width: 44px;
  height: 24px;
}

label.row.master input[type='checkbox']:checked {
  background: var(--master);
  border-color: var(--master);
}

label.row.master input[type='checkbox']::before {
  width: 18px;
  height: 18px;
}

label.row.master input[type='checkbox']:checked::before {
  transform: translateX(20px);
}

.master-badge {
  flex: none;
  margin-left: auto;
  padding: 2px 9px;
  border: 1px solid var(--err-border);
  border-radius: 999px;
  background: var(--err-bg);
  color: var(--err-fg);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

label.row.master:has(input:checked) .master-badge {
  border-color: var(--master-border);
  background: var(--master-bg);
  color: var(--master-fg);
}

.state-active {
  color: var(--ok-fg);
  font-weight: 700;
}

.state-disabled {
  color: var(--err-fg);
  font-weight: 700;
}

.destructive-command-group + .destructive-command-group {
  margin-top: 24px;
}

.destructive-command-group h3 {
  margin: 0 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.empty {
  margin: 0;
  padding: 16px;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  color: var(--muted);
  text-align: center;
}

#secret {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 4px;
}

.field-toggle .panel-toggle {
  justify-self: start;
  margin: -2px 0;
  padding: 2px 6px 2px 0;
  font-weight: 650;
}

#safety-level + .field,
.foldable-field-content + .field {
  margin-top: 14px;
}

#safety-overrides,
#workflow {
  margin-top: 4px;
}

.foldable-field-content {
  display: grid;
  gap: 4px;
}

.foldable-field-content > p {
  margin: 0;
  font-size: 12px;
}

.paths-content:not([hidden]) {
  display: grid;
  gap: 10px;
}

.paths-content > p.muted {
  margin: 0;
  font-size: 12px;
}

.field > span {
  font-size: 13px;
  font-weight: 650;
}

.field small {
  font-size: 11.5px;
  color: var(--muted);
  font-weight: 400;
  line-height: 1.45;
}

input[type='search'],
input[type='text'],
textarea {
  width: 100%;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 9px 11px;
  background: var(--field-bg);
  color: var(--ink);
  font: inherit;
  transition: border-color 0.15s ease;
}

input[type='search']:hover,
input[type='text']:hover,
textarea:hover {
  border-color: var(--muted);
}

input[type='search']:focus,
input[type='text']:focus,
textarea:focus {
  border-color: var(--muted);
  outline: none;
}

input[type='text']:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.tester-row {
  display: flex;
  gap: 8px;
}

.tester-row input[type='text'] {
  flex: 1 1 auto;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 12.5px;
}

.tester-row button {
  flex: none;
  align-self: center;
}

#tester-result {
  margin-top: 12px;
}

.tester-segment {
  margin-top: 6px;
}

.paths-add {
  display: flex;
  gap: 8px;
}

.paths-add input[type='text'] {
  flex: 1 1 auto;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 12.5px;
}

.paths-add button {
  flex: none;
  align-self: center;
}

.paths-hint {
  margin: -6px 0 0;
  color: var(--err-fg);
  font-size: 12px;
  overflow-wrap: anywhere;
}

.paths-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.path-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.path-item code {
  flex: 1 1 auto;
  min-width: 0;
  padding: 9px 11px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  font-family: var(--font-mono);
  font-size: 12.5px;
  overflow-wrap: anywhere;
}

.path-item button:hover:not(:disabled) {
  color: var(--err-fg);
  border-color: var(--err-border);
  background: var(--err-bg);
}

.path-item.row-disabled {
  opacity: 0.62;
}

.path-item.row-disabled button {
  cursor: not-allowed;
}

.path-item button {
  flex: none;
}

textarea {
  min-height: 96px;
  resize: vertical;
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.55;
}

#raw {
  min-height: 280px;
}

.star-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1 0 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-2);
}

.star-pitch {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  color: var(--ink);
  font-size: 12.5px;
  line-height: 1.45;
}

.star-pitch strong {
  font-variant-numeric: tabular-nums;
}

.star-mechanism {
  display: block;
  margin-top: 2px;
  color: var(--meta);
  font-size: 11.5px;
}

#star-slot {
  display: inline-flex;
  flex: none;
}

.star-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: none;
  white-space: nowrap;
  padding: 8px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: var(--surface);
  border-color: var(--border-strong);
  color: var(--muted);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.star-cta:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--star) 45%, var(--border-strong));
  background: var(--surface-2);
  color: var(--ink);
}

.star-cta:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.star-icon {
  display: inline-flex;
  width: 15px;
  height: 15px;
  color: var(--star);
}

.star-icon svg {
  width: 15px;
  height: 15px;
}

.star-count {
  display: inline-flex;
  align-items: center;
  align-self: stretch;
  border-left: 1px solid var(--border-strong);
  padding-left: 8px;
  color: var(--muted);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.star-cta.starred:disabled {
  opacity: 1;
  cursor: default;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    /* !important: reduced-motion must win over every class-level transition */
    transition: none !important;
  }

  .activity-refresh.spinning svg,
  .integrations-refresh.spinning svg,
  .rules-refresh.spinning svg {
    animation: none;
  }
}

@media (max-width: 900px) {
  .tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .app-shell {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1fr;
  }

  .sidebar {
    z-index: 100;
    height: var(--topbar-h);
    flex-direction: row;
    align-items: center;
    gap: 14px;
    padding: 0 16px;
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }

  .brand-logo svg {
    height: 20px;
  }

  .topbar {
    position: static;
    z-index: auto;
  }

  .topbar.has-search {
    position: sticky;
    top: var(--topbar-h);
    z-index: 95;
  }

  .policy-savebar {
    top: calc(var(--topbar-h) * 2);
  }

  .brand {
    flex: none;
    padding: 0;
  }

  main {
    flex: 1;
  }

  .app-foot {
    display: flex;
    justify-content: center;
    gap: 28px;
    padding: 16px;
    border-top: 1px solid var(--border);
    font-size: 12px;
  }

  .app-foot a {
    color: var(--meta);
    text-decoration: none;
  }

  .app-foot a:hover {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .sidenav {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    gap: 2px;
  }

  .sidenav a {
    padding: 15px 7px;
  }

  .sr-only-collapse {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .sidebar-foot {
    display: none;
  }
}

@media (max-width: 640px) {
  .topbar {
    padding: 10px 16px;
  }

  .topbar-row {
    flex-wrap: wrap;
  }

  .topbar.has-search .topbar-row {
    flex-wrap: nowrap;
  }

  main {
    padding: 18px 16px 40px;
  }

  .topbar-search {
    max-width: none;
  }

  .panel {
    padding: 16px;
  }

  .star-row {
    flex-wrap: wrap;
  }

  .star-row .star-cta,
  .star-row #star-slot {
    flex: 1 1 100%;
    justify-content: center;
  }

  .panel-head {
    flex-direction: column;
  }

  .raw-json-head,
  .panel-head:has(.view-all-link) {
    flex-direction: row;
    align-items: center;
  }

  .grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .rule-tier-head,
  .tier-collapse {
    flex-wrap: wrap;
  }

  .rule-row {
    align-items: start;
  }

  .tier-counts {
    flex: 1 1 100%;
    padding-left: 20px;
    text-align: left;
  }

  .inherit-button {
    align-self: flex-start;
  }
}

@media (min-width: 1440px) {
  body[data-view='overview'] main,
  body[data-view='overview'] .topbar-row {
    max-width: 1200px;
  }
}

[hidden] {
  display: none;
}

  </style>
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <h1 class="brand-logo"><a class="brand-home" href="#overview" title="Overview"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 476.62 104" role="img" aria-label="CC Safety Net"><defs><style>@font-face{font-family:'Exo 2 Kit';font-style:italic;font-weight:700;src:url(data:font/woff2;base64,d09GMgABAAAAAAbUAA8AAAAADAQAAAZ7AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGjYbgyQcVgZgP1NUQVRAAGwRCAqJMIdOCxgAATYCJAMsBCAFhDAHIBsHClEU84FMI2Xh/P0gqJpmz2glW7tm2AMGEwsNLDMfvC6JFAYQpPIEwhmU0xSaCF+QTsL/fr9W/1uXRBItlZA9tc/Z9Yv5Q0SSmDWGUAhNRJtlK9FLKKzDiVzMJj0vnDSdSSQEYLKYQBuCGLPALmhtxAISi2ZWHkV0ILcjDR6rs5GDaEcLyx1kdcyODZDVPebrJ2ugbWKILNkBQClYW9HvGxsiWjnNmOQ2JJovesQSRNmQRxoiskig7/FcAHZApkhZYgQ4vYi+qS95Gzs6m+iq/1ig/tdrUQqZrv4fjgwrgfpH/e7GW5n6Rzb9rL5X3/AAgsmcGyQaVq7JNiJbGiDQZxuRxpooiyzIdHCygPSC5IIkIFKwSFffp0/wUjYjKS5NoogLGOjtbnM8VaGhpYcTCWfSUjvZhhtRk4XySaxdpF961G+UqQ3YJJrZLFYS7HMtUh3GLHs+p7KqsoDrMJm1fKF2iC7aKbHDRFwSXCG+l/fnQdB25gYOKUdhafl0d8/Ev9X3TrQNCAYogYfEsePJ6XcDIkE+aQUGZDElS2BgChoenkQCb1eZHKGSOtroYoLZtB/wLvNdq75WT6sH1b3qBnWtukCdgz+U6igQShF/JUOyNCFZJfr1MiFZOyaLnIwFRmUW0AYPWrx061Lb+kxrvDXVyMy0tjTqLbHTwJjYnJjGp/YHQi8tc9z88su6/9Vng45g6C0jENnhfDGo+8Nhd0R+6HTjpbfquv/2rPrLr8/ST16b4dFbrrjDMAK3ZXovuy/TuPyG7Ib+QKjAcXM4rPsfvPHSjEsvu22Z87X3QmZQ3Fv3h13ul0IvGYFX7si+4vLbl7tefz+cf0NEFHQHQnb9D3+x/633mtcGb1txyzsfbFh3r8g+Gpy3czo9uns56BDzymeDRx1u9y2P/CLj4aXwT+UEQ48ZgUhkhfPGoK9H9QdeemmZQ/c/mtMY8MztbiPwRH5LJOJ0xLjd/Z4PFZ3Y2KYtKytYWYfM1o6jlwQ37O/v73Ps7++bmI0fbR0JDx8dmWNZVmJjm1AeGdoMne0IeN3GBh0HOR0H+47/9ql9Gn1m9n0WfSBpVlAV3nVM7PeauM3NbuRAaYXWwDZF2iOE1W3gy8gAWmccde8oddY6wmQ8F/50bf1ARjA/aBkrVUGtQ+mZVuBZ+mCJQ80mLVFUYBErNUGtRWlVmmNbxhaHh8ssJZYHzOfEQnHscF1eNIA2YKd06v4TI/YqqooRdgvH13JC60gb+dNZsyZgaeLjeTeYQgsIuaV6ZFg9EyySJdSi8LVsPNg1lNjs8IDyH5UCXAnVyeKiH6gIaBlPziUdcoFCeEFDY1VLvZSGhaPgkAJURRI/Etcax4TPRV3ADq+EqBCtdBkM8acG8n/WTmyMOum+94aU9/8kWIZ7JE1cEmziR2Lb9NVzFDEYBVzFT24KZagafAljfa6Nr4tkcvaRZg7DmKF1uBxVxJzJgMw2SeOKCqmtJbuMhakeWlnf0JhSETFCaifPzmNurIelamAwcovrEIBtbQEH3GHKZ1LEtMpIF1YNYgJVNa16jW9UBq5DCLa1PRzIPwZQuTI6s1ix6NIKmnp7RwtrwvDMtBSp1iS1Vk95QpnScY0vOaMZCCXYHVzJ/0V0Z4D0CrFjsjCpnT67jIWJMkZZz9CYUhExQmon72HF3qK6I/aC6qrHjZTrXjya2uRdsdfj2G8/WlVdm3VQeyi1af/KvcV1++0F1dUPfBzTGtEbvBoA6lkEIOU5eY+UL7TE7/0t2mL5EuCta2OSAD5Zdv4v/7v//0j7WSvBQguGTaGAOu3L1vj/3f/9qf1s+ZKzaorXNGQla2UJS+Vb5MgC4mUNGXIrGeJcdZG4FFMWsEz+oS7iw/pscwadRDFAVM3j1AUG/mu6Zh/brxcaWorkv2WoJI1PQy1s5V5RFi3mbBlqJYuJUBt5uArj2F4Xi9IvegbJKZJp8mhKaDVeephhBuikhAnaGKCXDtz46KWbHib2nScYYZzdbBj5hnWdjyG6RkVDTIDxdtE4PtYzzBjdFDCjVt/MOmzmahhjnF7zk0w2s56NbGKjCd5SzeVkczwA9lf2UEkVlRSwx9UIUAa4oSOESmYZI4wAOPjqFkwc9ODD9Cu/mrFxQx8+OoD8EJM8gfj645is5Ix30xt51CTtrKeDYQYD+g8zTDcD+NgsGmeDm+R1RP2rWpqtqT9BXclmNgA=) format('woff2')}</style></defs><svg x="0" y="0" width="96" height="96" viewBox="-172.38 -172.38 824.77 824.77"><g transform="rotate(45 240 240)"><rect x="-30" y="14" width="195" height="52" rx="9" fill="currentColor"/><rect x="315" y="14" width="195" height="52" rx="9" fill="currentColor"/><rect x="-30" y="94" width="115" height="52" rx="9" fill="currentColor"/><rect x="235" y="94" width="170" height="52" rx="9" fill="currentColor"/><rect x="155" y="174" width="170" height="52" rx="9" fill="currentColor"/><rect x="75" y="254" width="170" height="52" rx="9" fill="currentColor"/><rect x="395" y="254" width="115" height="52" rx="9" fill="currentColor"/><rect x="-30" y="334" width="195" height="52" rx="9" fill="currentColor"/><rect x="315" y="334" width="195" height="52" rx="9" fill="currentColor"/><rect x="-30" y="414" width="115" height="52" rx="9" fill="currentColor"/><rect x="235" y="414" width="170" height="52" rx="9" fill="currentColor"/><rect x="14" y="155" width="52" height="170" rx="9" fill="#e5602a"/><rect x="94" y="75" width="52" height="170" rx="9" fill="#e5602a"/><rect x="94" y="395" width="52" height="115" rx="9" fill="#e5602a"/><rect x="174" y="-30" width="52" height="195" rx="9" fill="#e5602a"/><rect x="174" y="315" width="52" height="195" rx="9" fill="#e5602a"/><rect x="254" y="-30" width="52" height="115" rx="9" fill="#e5602a"/><rect x="254" y="235" width="52" height="170" rx="9" fill="#e5602a"/><rect x="334" y="155" width="52" height="170" rx="9" fill="#e5602a"/><rect x="414" y="75" width="52" height="170" rx="9" fill="#e5602a"/><rect x="414" y="395" width="52" height="115" rx="9" fill="#e5602a"/></g></svg><text x="115.98" y="62.42" font-family="'Exo 2 Kit','Exo 2',sans-serif" font-style="italic" font-weight="700" font-size="56" letter-spacing="-0.56" fill="currentColor">CC Safety Net</text></svg>
</a></h1>
      </div>
      <nav class="sidenav" aria-label="Sections">
        <a href="#overview" data-nav="overview" title="Overview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1.5"></rect><rect x="14" y="3" width="7" height="5" rx="1.5"></rect><rect x="14" y="12" width="7" height="9" rx="1.5"></rect><rect x="3" y="16" width="7" height="5" rx="1.5"></rect></svg><span class="sr-only-collapse">Overview</span></a>
        <a href="#activity" data-nav="activity" title="Activity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l3-8 4 16 3-8h4"></path></svg><span class="sr-only-collapse">Activity</span></a>
        <a href="#policy" data-nav="policy" title="Policy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z"></path></svg><span class="sr-only-collapse">Policy</span></a>
        <a href="#rules" data-nav="rules" title="Rules"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"></path><path d="M15 3v4h4"></path><path d="M9 12h6M9 16h4"></path></svg><span class="sr-only-collapse">Rules</span></a>
        <a href="#integrations" data-nav="integrations" title="Integrations"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5"></path></svg><span class="sr-only-collapse">Integrations</span></a>
        <a href="#settings" data-nav="settings" title="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h10M18 8h2M4 16h2M10 16h10"></path><circle cx="16" cy="8" r="2.2"></circle><circle cx="8" cy="16" r="2.2"></circle></svg><span class="sr-only-collapse">Settings</span></a>
      </nav>
      <div class="sidebar-foot">
        <div class="sidebar-links">
          <a href="https://github.com/kenryu42/cc-safety-net" target="_blank" rel="noopener">GitHub</a>
          <a href="https://ccsafetynet.com/docs" target="_blank" rel="noopener">Documentation</a>
        </div>
      </div>
    </aside>
    <div class="content">
      <header class="topbar" id="topbar">
        <div class="topbar-row">
          <h2 class="topbar-title" id="topbar-title">Overview</h2>
          <label class="view-search topbar-search" data-search-view="activity" hidden>
            <span class="sr-only">Filter activity</span>
            <input type="search" id="activity-search" autocomplete="off" placeholder="Filter by rule or command">
          </label>
          <label class="view-search topbar-search" data-search-view="policy" hidden>
            <span class="sr-only">Search all protections</span>
            <input type="search" id="policy-search" autocomplete="off" placeholder="Filter by name, category, or rule ID">
          </label>
          <div class="topbar-actions">
            <div class="app-status" id="app-status" role="status" aria-live="polite">Loading...</div>
            <button type="button" class="dirty-chip" id="dirty-chip" hidden>Unsaved policy changes · Review</button>
          </div>
        </div>
      </header>
      <main>
        <div class="protection-banner" id="protection-banner" role="alert" hidden></div>
        <div class="status" id="status" role="status" aria-live="polite"></div>

        <section class="view" data-view="overview">
          <div class="view-head">
            <p class="panel-sub muted">What CC Safety Net has been doing on this machine.</p>
          </div>
          <div class="status health-strip" id="health-strip" hidden></div>
          <p class="tiles-window" id="overview-window"></p>
          <div class="tiles" id="overview-tiles"></div>
          <div class="star-row" id="star-row" hidden>
            <p class="star-pitch"><span id="star-pitch-text"></span> <span class="star-mechanism" id="star-mechanism" hidden>One click via your GitHub CLI. No redirect.</span></p>
            <span id="star-slot"></span>
          </div>
          <section class="panel" id="protection-card" hidden></section>
          <div class="dual-panels">
            <section class="panel">
              <div class="panel-head">
                <div class="panel-title">
                  <h2>Top blocked commands</h2>
                </div>
              </div>
              <div id="top-commands"></div>
            </section>
            <section class="panel">
              <div class="panel-head">
                <div class="panel-title">
                  <h2>Top blocked rules</h2>
                </div>
              </div>
              <div id="top-rules"></div>
            </section>
          </div>
          <button type="button" class="guard-errors" id="guard-errors" hidden></button>
        </section>

        <section class="view" data-view="activity" hidden>
          <div class="view-head">
            <p class="panel-sub muted">Audited commands from the local log, newest first. Commands are secret-redacted at write time.</p>
          </div>
          <section class="panel">
            <div class="activity-controls">
              <div class="activity-controls-row">
                <label class="activity-days"><span>Window</span>
                  <select id="activity-days"></select>
                </label>
                <button type="button" class="icon-button activity-refresh" id="activity-refresh" aria-label="Refresh activity" title="Refresh activity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"></path><path d="M21 3v6h-6"></path></svg></button>
              </div>
              <div class="chip-row" id="activity-decision" role="group" aria-label="Filter by decision"></div>
              <div class="chip-row" id="activity-agents" role="group" aria-label="Filter by agent"></div>
              <div class="chip-row" id="activity-command-filter"></div>
            </div>
            <div id="activity-feed"></div>
            <p class="muted activity-count" id="activity-count"></p>
          </section>
        </section>

        <section class="view" data-view="policy" hidden>
          <div class="view-head view-head-actions">
            <p class="panel-sub muted">Choose what CC Safety Net blocks. Changes apply after you save.</p>
            <button type="button" id="project-draft-enter">Draft project policy</button>
          </div>
          <div class="project-draft-bar" id="project-draft-bar" hidden>
            <div class="project-draft-target">
              <strong>Project policy draft</strong>
              <code id="project-draft-path"></code>
              <p class="muted">Only the fields you mark are written here; everything else keeps inheriting from each member's own policy.</p>
            </div>
            <div class="savebar-actions">
              <button type="button" id="project-draft-change" hidden>Change…</button>
              <button type="button" id="project-draft-exit">Exit draft</button>
            </div>
          </div>
          <p class="status error" id="project-draft-diagnostics" hidden></p>
          <div class="policy-savebar" id="policy-savebar" hidden><span>Unsaved changes</span><div class="savebar-actions"><button type="button" id="discard-changes">Discard</button><button class="primary" id="save">Save</button></div></div>
          <div class="recovery" id="recovery" hidden>
            <div>
              <strong>Policy repair available</strong>
              <p class="muted">Repair writes canonical JSON by preserving valid settings. If the JSON cannot be parsed, defaults are restored.</p>
            </div>
            <button class="primary" id="repair" type="button">Repair</button>
          </div>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2 id="tester-label">Test a command</h2>
                <p class="panel-sub muted">Paste a shell command to see whether it is blocked under your current unsaved edits. Custom rulebook rules are enforced here too.</p>
              </div>
            </div>
            <div class="tester-row">
              <input type="text" id="tester-input" autocomplete="off" spellcheck="false" placeholder="Paste a shell command and press Enter" aria-labelledby="tester-label">
              <button type="button" id="tester-run">Test</button>
            </div>
            <div id="tester-result" class="status" hidden></div>
          </section>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Safety preset</h2>
                <p class="panel-sub muted">Choose inherited protection defaults, then customize only what this workspace needs.</p>
              </div>
            </div>
            <div id="safety-preset-status" class="preset-status"></div>
            <div id="environment-overrides" class="status" hidden></div>
            <div class="grid" id="safety-level"></div>
            <div class="field field-toggle">
              <button class="panel-toggle" type="button" aria-expanded="false" aria-controls="safety-overrides-content"><span class="panel-chevron" aria-hidden="true"></span><span>Advanced overrides</span></button>
            </div>
            <div class="foldable-field-content" id="safety-overrides-content" hidden>
              <p class="muted">Inherit from the selected level unless a capability needs an explicit exception.</p>
              <div class="grid" id="safety-overrides"></div>
            </div>
            <div class="field">
              <span>Workflow</span>
              <small>Workflow exceptions are separate from safety level.</small>
            </div>
            <div class="grid" id="workflow"></div>
          </section>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Destructive Command Protection</h2>
                <p class="panel-sub muted" id="destructive-command-summary"></p>
              </div>
              <button type="button" id="reset-rule-customizations" class="panel-head-action">Restore defaults</button>
            </div>
            <div id="destructive-command"></div>
          </section>
          <section class="panel">
            <header class="panel-head">
              <div class="panel-title">
                <h2>Secret Protection</h2>
                <p class="panel-sub muted" id="secret-summary">Default sensitive paths and coding CLI credential locations can be disabled individually. Deny paths are blocked while Secret protection is on.</p>
              </div>
              <button type="button" id="reset-secret-customizations" class="panel-head-action">Restore defaults</button>
            </header>
            <div id="secret"></div>
          </section>
          <section class="panel">
            <div class="panel-head raw-json-head">
              <div class="panel-title">
                <h2>Policy JSON</h2>
                <p class="panel-sub muted" id="raw-source">Read-only mirror of the policy controls.</p>
              </div>
              <button class="icon-button" id="raw-copy" type="button" aria-label="Copy raw JSON to clipboard"></button>
            </div>
            <textarea id="raw" aria-label="Raw policy JSON" aria-describedby="raw-source" readonly></textarea>
          </section>
        </section>

        <section class="view" data-view="rules" hidden>
          <div class="view-head">
            <p class="panel-sub muted">Custom rulebook rules enforced on this machine, and a prompt to hand rule authoring to your coding agent.</p>
          </div>
          <section class="panel" id="rules-composer-panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Create a rule</h2>
                <p class="panel-sub muted">CC Safety Net never writes rulebooks from here. Copy the prompt and paste it into your coding agent.</p>
              </div>
            </div>
            <div class="field">
              <span>Scope</span>
              <div class="chip-row" role="group" aria-label="Rule scope">
                <button type="button" class="chip" data-rules-scope="project" aria-pressed="true">Project</button>
                <button type="button" class="chip" data-rules-scope="user" aria-pressed="false">All projects</button>
              </div>
            </div>
            <div class="field" id="rules-project-path-field">
              <span id="rules-project-path-label">Project path</span>
              <div class="rules-path-row">
                <input type="text" id="rules-project-path" spellcheck="false" autocomplete="off" aria-labelledby="rules-project-path-label" aria-describedby="rules-project-path-hint">
                <button type="button" id="rules-choose-directory" hidden>Choose…</button>
              </div>
              <small id="rules-project-path-hint">Where the rulebook is written. Defaults to the directory this GUI was launched from.</small>
            </div>
            <div class="field">
              <span id="rules-composer-label">Request</span>
              <textarea id="rules-composer-input" spellcheck="false" placeholder="Describe the custom rules you want..." aria-labelledby="rules-composer-label" aria-describedby="rules-composer-hint"></textarea>
              <small id="rules-composer-hint">Rules match a command, its subcommand path, and exact arguments - not file paths or patterns.</small>
            </div>
            <div class="field">
              <span>Examples</span>
              <div class="chip-row">
                <button type="button" class="chip" data-rules-example="read my package.json and suggest blocking rules">Suggest rules</button>
                <button type="button" class="chip" data-rules-example="set up rules to block all terraform destroy commands">Block a command</button>
                <button type="button" class="chip" data-rules-example="verify my rules and fix any errors">Verify rules</button>
              </div>
            </div>
            <div class="rules-composer-actions">
              <button type="button" class="primary" id="rules-copy-prompt">Copy prompt</button>
            </div>
          </section>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Rulebooks</h2>
                <p class="panel-sub muted">Read-only. Rules are shown as enforced, after overrides.</p>
              </div>
              <button type="button" class="icon-button rules-refresh" id="rules-refresh" aria-label="Refresh rules" title="Refresh rules"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"></path><path d="M21 3v6h-6"></path></svg></button>
            </div>
            <div id="rules-list"><p class="empty">Loading rules…</p></div>
          </section>
          <section class="panel" id="rules-diagnostics-panel" hidden>
            <div class="panel-head">
              <div class="panel-title">
                <h2>Diagnostics</h2>
                <p class="panel-sub muted">Errors mean a rulebook was dropped and its rules are not enforced.</p>
              </div>
            </div>
            <div id="rules-diagnostics"></div>
          </section>
        </section>

        <section class="view" data-view="settings" hidden>
          <div class="view-head">
            <p class="panel-sub muted">Appearance, file locations, and maintenance.</p>
          </div>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Appearance</h2>
                <p class="panel-sub muted">Theme preference is stored in this browser.</p>
              </div>
              <button type="button" id="theme-toggle"></button>
            </div>
          </section>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Files</h2>
                <p class="panel-sub muted">Where CC Safety Net reads and writes on this machine.</p>
              </div>
            </div>
            <div class="info-rows">
              <div class="info-row"><span>Policy file</span><code id="policy-path"></code></div>
              <div class="info-row" id="project-policy-row" hidden><span>Project policy</span><code id="project-policy-path"></code></div>
              <div class="info-row"><span>Audit logs</span><code id="logs-path"></code></div>
            </div>
            <p class="status" id="project-policy-notice" hidden></p>
          </section>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Audit log retention</h2>
                <p class="panel-sub muted">How long decisions are kept before the sweep deletes them. Every analyzed command is recorded, so a long window grows the log.</p>
              </div>
            </div>
            <label class="retention-row">
              <span>Keep for</span>
              <input type="number" id="retention-days" min="1" max="365" step="1" inputmode="numeric" aria-describedby="retention-note">
              <span id="retention-unit">days</span>
            </label>
            <p class="muted retention-note" id="retention-note"></p>
          </section>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Version</h2>
              </div>
            </div>
            <div class="info-rows">
              <div class="info-row"><code id="app-version"></code></div>
            </div>
          </section>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Danger zone</h2>
                <p class="panel-sub muted">Actions that discard saved configuration.</p>
              </div>
            </div>
            <div class="danger-row">
              <div>
                <strong>Reset policy</strong>
                <p class="muted">Restore the default policy JSON at the configured path.</p>
              </div>
              <button class="danger" id="reset">Reset</button>
            </div>
          </section>
        </section>

        <section class="view" data-view="integrations" hidden>
          <div class="view-head">
            <p class="panel-sub muted">Install or remove the cc-safety-net hook for each coding agent on this machine.</p>
          </div>
          <section class="panel">
            <div class="panel-head">
              <div class="panel-title">
                <h2>Agents</h2>
                <p class="panel-sub muted">Detected CLIs and hook status.</p>
              </div>
              <button type="button" class="icon-button integrations-refresh" id="integrations-refresh" aria-label="Refresh integrations" title="Refresh integrations"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"></path><path d="M21 3v6h-6"></path></svg></button>
            </div>
            <div id="integrations-list"><p class="empty">Checking integrations…</p></div>
          </section>
          <section class="panel" id="integrations-system" hidden>
            <div class="panel-head">
              <div class="panel-title">
                <h2>System</h2>
                <p class="panel-sub muted">Runtime detected on this machine.</p>
              </div>
            </div>
            <div class="info-rows">
              <div class="info-row"><span>cc-safety-net</span><code id="integrations-pkg-version"></code></div>
              <div class="info-row"><span>Node.js</span><code id="integrations-node-version"></code></div>
              <div class="info-row"><span>Platform</span><code id="integrations-platform"></code></div>
            </div>
          </section>
        </section>
      </main>
      <footer class="app-foot">
        <a href="https://github.com/kenryu42/cc-safety-net" target="_blank" rel="noopener">GitHub</a>
        <a href="https://ccsafetynet.com/docs" target="_blank" rel="noopener">Documentation</a>
      </footer>
    </div>
  </div>
  <div class="rule-example-popover" id="rule-example-popover" popover="auto" role="dialog" aria-labelledby="rule-example-title" aria-describedby="rule-example-command">
    <span class="rule-example-label" id="rule-example-label">Blocked command example</span>
    <strong id="rule-example-title"></strong>
    <code id="rule-example-command"></code>
  </div>
  <dialog class="confirm-dialog" id="confirm-dialog" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-body confirm-dialog-detail">
    <form method="dialog">
      <h2 id="confirm-dialog-title"></h2>
      <p class="muted" id="confirm-dialog-body"></p>
      <div class="dialog-rows" id="confirm-dialog-rows" hidden></div>
      <p class="dialog-detail"><code id="confirm-dialog-detail"></code></p>
      <div class="dialog-actions">
        <button type="submit" id="confirm-dialog-cancel" value="cancel">Cancel</button>
        <button type="submit" class="danger" id="confirm-dialog-confirm" value="confirm"></button>
      </div>
    </form>
  </dialog>
  <dialog class="confirm-dialog report-dialog" id="report-dialog" aria-labelledby="report-dialog-title" aria-describedby="report-dialog-body">
    <form method="dialog">
      <h2 id="report-dialog-title">Report false positive</h2>
      <p class="muted" id="report-dialog-body">This opens a prefilled GitHub issue form — it is public, and nothing is submitted until you submit it there. Paths were replaced with <code>&lt;project&gt;</code> and <code>~</code>; edit anything else you would rather not publish.</p>
      <label class="report-field"><span>Blocked command</span><textarea id="report-command" spellcheck="false"></textarea></label>
      <label class="report-field"><span>Audit log entry</span><textarea id="report-entry" spellcheck="false"></textarea></label>
      <div class="dialog-actions">
        <button type="submit" id="report-dialog-cancel" value="cancel">Cancel</button>
        <button type="submit" class="primary" id="report-dialog-open" value="report">Open GitHub form</button>
      </div>
    </form>
  </dialog>
  <script id="ccsn-data" type="application/json"></script>
  <script>
// src/audit/display.ts
var formatRelativeTime = (value) => {
  const diff = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diff))
    return "";
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0)
    return \`\${days}d ago\`;
  if (hours > 0)
    return \`\${hours}h ago\`;
  if (minutes > 0)
    return \`\${minutes}m ago\`;
  return "just now";
};
var commandSignature = (source) => {
  const tokens = (source ?? "").trim().split(/\\s+/).filter((token) => token && !/^[A-Za-z_][A-Za-z0-9_]*=/.test(token));
  const binary = tokens[0]?.split("/").pop();
  if (!binary)
    return null;
  const next = tokens[1];
  return next && /^[a-z][a-z0-9-]*$/.test(next) ? \`\${binary} \${next}\` : binary;
};
function findSuspectEntries(entries) {
  const signatureKey = (entry) => \`\${entry.sessionId}
\${commandSignature(entry.segment || entry.command)}\`;
  const denials = entries.filter((entry) => entry.decision !== "allow");
  const repeats = denials.filter((entry) => entry.sessionId).reduce((counts, entry) => counts.set(signatureKey(entry), (counts.get(signatureKey(entry)) ?? 0) + 1), new Map);
  return new Set(denials.filter((entry) => entry.failureStage || (repeats.get(signatureKey(entry)) ?? 0) >= 2));
}

// src/core/policy/audit-retention-days.ts
var DEFAULT_AUDIT_RETENTION_DAYS = 30;
var MIN_AUDIT_RETENTION_DAYS = 1;
var MAX_AUDIT_RETENTION_DAYS = 365;

// src/core/policy/safety-level.ts
var SAFETY_LEVEL_CAPABILITIES = {
  standard: { fail_closed: false, paranoid_rm: false, paranoid_interpreters: false },
  strict: { fail_closed: true, paranoid_rm: false, paranoid_interpreters: false },
  paranoid: { fail_closed: true, paranoid_rm: true, paranoid_interpreters: true }
};

// src/hosts/catalog.ts
var DEEPSEEK_HARNESS_NPM_PROBE = [
  "npx",
  "--offline",
  "--no-install",
  "@deepseek-ai/dsh",
  "--version"
];
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

// src/gui/frontend/project-draft.ts
var clonePolicy = (policy) => JSON.parse(JSON.stringify(policy));
var markedOverrides = (marked, section, overrides) => Object.fromEntries(Object.entries(overrides).filter(([key, value]) => value !== undefined && marked.has(\`\${section}.overrides.\${key}\`)));
var withOverrides = (overrides) => Object.keys(overrides).length > 0 ? { overrides } : {};
var collectProjectProposal = (marked, policy) => {
  const sections = {
    safety: {
      ...marked.has("safety.level") ? { level: policy.safety.level } : {},
      ...withOverrides(markedOverrides(marked, "safety", policy.safety.overrides))
    },
    workflow: marked.has("workflow.worktree_mode") ? { worktree_mode: policy.workflow.worktree_mode } : {},
    destructive_command_protection: {
      ...marked.has("destructive_command_protection.enabled") ? { enabled: policy.destructive_command_protection.enabled } : {},
      ...withOverrides(markedOverrides(marked, "destructive_command_protection", policy.destructive_command_protection.overrides)),
      ...marked.has("destructive_command_protection.allow_paths") ? { allow_paths: policy.destructive_command_protection.allow_paths } : {}
    },
    secret_protection: {
      ...marked.has("secret_protection.enabled") ? { enabled: policy.secret_protection.enabled } : {},
      ...withOverrides(markedOverrides(marked, "secret_protection", policy.secret_protection.overrides)),
      ...marked.has("secret_protection.deny_paths") ? { deny_paths: policy.secret_protection.deny_paths } : {},
      ...marked.has("secret_protection.allow_paths") ? { allow_paths: policy.secret_protection.allow_paths } : {}
    }
  };
  return {
    version: 1,
    ...Object.fromEntries(Object.entries(sections).filter(([, fields]) => Object.keys(fields).length > 0))
  };
};
var projectMarkedFields = (projection) => {
  const destructive = projection.destructive_command_protection ?? {};
  const secret = projection.secret_protection ?? {};
  return [
    ...projection.safety?.level === undefined ? [] : ["safety.level"],
    ...Object.keys(projection.safety?.overrides ?? {}).map((key) => \`safety.overrides.\${key}\`),
    ...projection.workflow?.worktree_mode === undefined ? [] : ["workflow.worktree_mode"],
    ...destructive.enabled === undefined ? [] : ["destructive_command_protection.enabled"],
    ...Object.keys(destructive.overrides ?? {}).map((id) => \`destructive_command_protection.overrides.\${id}\`),
    ...destructive.allow_paths === undefined ? [] : ["destructive_command_protection.allow_paths"],
    ...secret.enabled === undefined ? [] : ["secret_protection.enabled"],
    ...Object.keys(secret.overrides ?? {}).map((id) => \`secret_protection.overrides.\${id}\`),
    ...secret.deny_paths === undefined ? [] : ["secret_protection.deny_paths"],
    ...secret.allow_paths === undefined ? [] : ["secret_protection.allow_paths"]
  ];
};
var overlayProjectProposal = (baseline, proposal) => {
  const displayed = clonePolicy(baseline);
  const destructive = proposal.destructive_command_protection ?? {};
  const secret = proposal.secret_protection ?? {};
  if (proposal.safety?.level)
    displayed.safety.level = proposal.safety.level;
  Object.assign(displayed.safety.overrides, proposal.safety?.overrides ?? {});
  if (proposal.workflow?.worktree_mode !== undefined)
    displayed.workflow.worktree_mode = proposal.workflow.worktree_mode;
  if (destructive.enabled !== undefined)
    displayed.destructive_command_protection.enabled = destructive.enabled;
  Object.assign(displayed.destructive_command_protection.overrides, destructive.overrides ?? {});
  if (destructive.allow_paths)
    displayed.destructive_command_protection.allow_paths = destructive.allow_paths;
  if (secret.enabled !== undefined)
    displayed.secret_protection.enabled = secret.enabled;
  Object.assign(displayed.secret_protection.overrides, secret.overrides ?? {});
  if (secret.deny_paths)
    displayed.secret_protection.deny_paths = secret.deny_paths;
  if (secret.allow_paths)
    displayed.secret_protection.allow_paths = secret.allow_paths;
  return displayed;
};
var seedProjectDraft = (data) => {
  if (!data.baseline)
    return null;
  if (!Array.isArray(data.userPolicyDiagnostics) || data.userPolicyDiagnostics.length > 0)
    return null;
  const marked = new Set(projectMarkedFields(data.projection ?? {}));
  const policy = overlayProjectProposal(data.baseline, data.projection ?? {});
  return {
    baseline: data.baseline,
    marked,
    policy,
    snapshot: JSON.stringify(collectProjectProposal(marked, policy))
  };
};

// src/gui/frontend/report.ts
var reportIssueUrl = "https://github.com/kenryu42/cc-safety-net/issues/new?template=false_positive.yml";
var reportUrlLimit = 8000;
var endsAtPathBoundary = (following) => following === "" || /^[/\\\\\\s'"]/.test(following);
var scrubReportPaths = (text, cwd, home) => [
  [cwd, "<project>"],
  [home, "~"]
].reduce((scrubbed, [from, to]) => from ? scrubbed.split(from).reduce((joined, part) => joined + (endsAtPathBoundary(part) ? to : from) + part) : scrubbed, text);
var buildReportUrl = (fields) => {
  const url = new URL(reportIssueUrl);
  Object.entries(fields).filter(([, value]) => value).forEach(([field, value]) => {
    url.searchParams.set(field, value);
  });
  return url.toString();
};
var buildReportRequest = (fields, dropped = []) => {
  const url = buildReportUrl(fields);
  if (url.length <= reportUrlLimit)
    return { url, dropped };
  const largest = Object.entries(fields).filter(([, value]) => value).sort((left, right) => right[1].length - left[1].length)[0];
  if (!largest)
    return { url, dropped };
  return buildReportRequest({ ...fields, [largest[0]]: "" }, [...dropped, largest[0]]);
};

// src/gui/frontend/rule-prompt.ts
var rulePromptText = (prompt) => {
  const names = prompt.rulesData?.rulebooks.map((rulebook) => rulebook.name) ?? [];
  return [
    "Use the cc-safety-net skill for this request.",
    "If that skill is not available, run \`npx -y cc-safety-net rule doc\` first and treat its output as the source of truth for schema, paths, and validation.",
    "",
    prompt.rulesScope === "project" ? \`Scope: this project - \${prompt.projectPath.trim()}\` : "Scope: all projects (user scope)",
    \`Existing rulebooks (names must stay unique across both scopes): \${names.length > 0 ? names.join(", ") : "none"}\`,
    "",
    prompt.request.trim()
  ].join(\`
\`);
};

// src/gui/frontend/main.ts
var token = JSON.parse(document.getElementById("ccsn-data").textContent).token;
var fallbackRepoUrl = "https://github.com/kenryu42/cc-safety-net";
var safetyLevels = {
  standard: [
    "Standard",
    "Blocks recognizable destructive commands and sensitive content access while allowing metadata-only sensitive-path checks. Recommended for normal coding."
  ],
  strict: [
    "Strict",
    "Standard, plus blocks dynamic or unparseable commands and metadata-only sensitive-path discovery. Occasional false positives on advanced shell."
  ],
  paranoid: [
    "Paranoid",
    "Strict, plus blocks rm -rf inside your project and interpreter one-liners. Expect friction; for untrusted agents or high-stakes repos."
  ]
};
var safetyOverrides = {
  fail_closed: ["Fail closed", "Block commands the parser cannot fully understand."],
  paranoid_rm: ["Paranoid rm -rf checks", "Block non-temp rm -rf inside the project."],
  paranoid_interpreters: ["Paranoid interpreters", "Block interpreter one-liners."]
};
var rawCopyIcons = {
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2"></path></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>'
};
var starIcons = {
  outline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path></svg>',
  filled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path></svg>'
};
var reportIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><path d="M4 22v-7"></path></svg>';
var pathListIcons = {
  add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>',
  remove: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M10 11v6M14 11v6"></path></svg>'
};
var state;
var draftPolicy;
var projectDraft = null;
var markedFields = new Set;
var preview;
var previewRequestId = 0;
var dirty = false;
var searchActive = false;
var OVERVIEW_DAYS = 7;
var overview = null;
var activity = null;
var knownRuleIds = new Set;
var activityFilters = { days: 7, decision: "all", agent: "all", query: "", command: "" };
var tierExpanded = new Map([
  ["enforced", false],
  ["normal", false],
  ["strict", false],
  ["paranoid", false]
]);
var searchCollapsedTiers = new Set;
var secretGroupExpanded = new Map;
var searchCollapsedSecretGroups = new Set;
var rawCopyResetTimer = null;
var feedCopyResetTimer = null;
var activityQueryTimer;
var renderedFeedEntries = [];
var suspects = new Set;
var activeStarContext = { starred: null, starCount: null, blockedTotal: 0 };
var integrations = null;
var integrationBusy = new Set;
var rulesData = null;
var rulesRequested = false;
var rulesScope = "project";
var pendingRuleFocus = null;
var directoryPickerFailed = false;
var api = (path, init = {}) => fetch(\`\${path}\${path.includes("?") ? "&" : "?"}token=\${encodeURIComponent(token)}\`, {
  ...init,
  headers: {
    "content-type": "application/json",
    "x-cc-safety-net-token": token,
    ...init.headers
  }
});
var requestJson = async (path, init) => {
  try {
    const response = await api(path, init);
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      data: text ? JSON.parse(text) : {},
      error: undefined
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: undefined,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
var errorText = (result) => result.error ?? (Array.isArray(result.data?.errors) && result.data.errors.length ? result.data.errors.join(\`
\`) : null) ?? result.data?.error ?? \`Request failed (status \${result.status}).\`;
var isWriteSuccess = (result) => result.ok && !(Array.isArray(result.data?.errors) && result.data.errors.length > 0);
var qs = (id) => document.getElementById(id);
var setDetailStatus = (text, kind = "") => {
  qs("status").textContent = text;
  qs("status").className = \`status \${kind}\`;
};
var appStatusTimer;
var setAppStatus = (text, kind = "") => {
  qs("app-status").textContent = text;
  qs("app-status").className = \`app-status \${kind}\`;
  clearTimeout(appStatusTimer);
  if (kind === "ok")
    appStatusTimer = setTimeout(() => setAppStatus(""), 4000);
};
var busy = false;
var updateActions = () => {
  const hasErrors = (state?.errors.length ?? 0) > 0;
  qs("save").disabled = busy || !state || hasErrors;
  qs("reset").disabled = busy || !state;
  qs("repair").disabled = busy || !hasErrors;
};
var runExclusive = async (pendingText, fn) => {
  if (busy)
    return;
  busy = true;
  updateActions();
  setAppStatus(pendingText);
  setDetailStatus("");
  try {
    await fn();
  } finally {
    busy = false;
    updateActions();
  }
};
var checkbox = (checked) => checked ? "checked" : "";
var dayCount = (days) => \`\${days} day\${days === 1 ? "" : "s"}\`;
var syncMasterBadges = () => {
  document.querySelectorAll("label.row.master input").forEach((input) => {
    const badge = input.closest("label")?.querySelector(".master-badge");
    if (badge)
      badge.textContent = input.checked ? "On" : "Off";
  });
};
var escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[char] ?? char);
var pathLines = (value) => value.split(\`
\`).map((line) => line.trim()).filter(Boolean);
var formatPolicy = (policy) => \`\${JSON.stringify(policy, null, 2)}
\`;
var collectFormPolicy = () => ({
  version: 1,
  safety: {
    level: draftPolicy.safety.level,
    overrides: Object.fromEntries(Object.entries(draftPolicy.safety.overrides).filter(([, value]) => typeof value === "boolean"))
  },
  workflow: draftPolicy.workflow,
  destructive_command_protection: draftPolicy.destructive_command_protection,
  secret_protection: {
    enabled: draftPolicy.secret_protection.enabled,
    overrides: draftPolicy.secret_protection.overrides,
    deny_paths: draftPolicy.secret_protection.deny_paths,
    allow_paths: draftPolicy.secret_protection.allow_paths
  },
  audit: draftPolicy.audit
});
var effectivePreviewPolicy = (policy, baseline) => {
  if (!baseline)
    return policy;
  const union = (user, project) => [...new Set([...user, ...project])];
  return {
    ...policy,
    destructive_command_protection: {
      ...policy.destructive_command_protection,
      allow_paths: union(baseline.destructive_command_protection.allow_paths, policy.destructive_command_protection.allow_paths)
    },
    secret_protection: {
      ...policy.secret_protection,
      deny_paths: union(baseline.secret_protection.deny_paths, policy.secret_protection.deny_paths),
      allow_paths: union(baseline.secret_protection.allow_paths, policy.secret_protection.allow_paths)
    }
  };
};
var requestPolicyPreview = (policy = collectFormPolicy()) => requestJson("/api/policy/preview", {
  method: "POST",
  body: JSON.stringify(policy)
});
var policyScopeMode = () => projectDraft ? "project" : "user";
var projectFieldChip = (field, compact = false) => {
  if (policyScopeMode() !== "project")
    return "";
  if (!markedFields.has(field))
    return '<span class="project-chip inherited">Inherited</span>';
  return \`<button type="button" class="project-chip" data-unmark-field="\${escapeHtml(field)}" title="Set by project - click to inherit again" aria-label="Set by project: \${escapeHtml(field)}. Activate to inherit again.">\${compact ? "Project" : "Set by project"}</button>\`;
};
var projectFieldLine = (field) => {
  const chip = projectFieldChip(field);
  return chip ? \`<div class="project-field-line">\${chip}</div>\` : "";
};
var projectChipSlots = [
  ["destructive-enabled-chip", "destructive_command_protection.enabled"],
  ["secret-enabled-chip", "secret_protection.enabled"],
  ["allow-paths-chip", "destructive_command_protection.allow_paths"],
  ["deny-paths-chip", "secret_protection.deny_paths"],
  ["secret-allow-paths-chip", "secret_protection.allow_paths"]
];
var syncProjectChips = () => {
  projectChipSlots.forEach(([id, field]) => {
    qs(id).innerHTML = projectFieldChip(field);
  });
};
var markProjectField = (field) => {
  if (!projectDraft || markedFields.has(field))
    return;
  markedFields.add(field);
  renderSafety();
  syncProjectChips();
};
var rebuildProjectDisplay = () => {
  if (!projectDraft)
    return;
  draftPolicy = overlayProjectProposal(projectDraft.baseline, collectProjectProposal(markedFields, draftPolicy));
  renderPolicySections();
  refreshPolicyPreview();
};
var unmarkProjectField = (field) => {
  if (!projectDraft || !markedFields.has(field))
    return;
  markedFields.delete(field);
  rebuildProjectDisplay();
};
var viewNames = ["overview", "activity", "policy", "rules", "integrations", "settings"];
var viewTitles = {
  overview: "Overview",
  activity: "Activity",
  policy: "Policy",
  rules: "Rules",
  integrations: "Integrations",
  settings: "Settings"
};
var currentView = () => {
  const hash = location.hash.replace("#", "");
  return viewNames.includes(hash) ? hash : "overview";
};
var applyView = () => {
  const view = currentView();
  document.body.dataset.view = view;
  const hasSearch = view === "activity" || view === "policy";
  qs("topbar-title").textContent = viewTitles[view];
  qs("topbar-title").classList.toggle("sr-only", hasSearch);
  document.querySelectorAll(".topbar-search").forEach((el) => {
    el.hidden = el.dataset.searchView !== view;
  });
  qs("topbar").classList.toggle("has-search", hasSearch);
  document.title = \`\${viewTitles[view]} · CC Safety Net\`;
  document.querySelectorAll("[data-view]").forEach((section) => {
    section.hidden = section.dataset.view !== view;
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === view)
      link.setAttribute("aria-current", "page");
    else
      link.removeAttribute("aria-current");
  });
  qs("dirty-chip").hidden = !dirty || view === "policy";
  if (view === "activity")
    applyFeedClamps(qs("activity-feed"));
  if (view === "rules" && !rulesRequested) {
    rulesRequested = true;
    loadRules();
  }
  if (view === "rules" && rulesData && pendingRuleFocus)
    renderRules();
};
var agentLabels = integrationDisplayNames;
var tierCountHtml = (segments) => {
  const parts = segments.filter(([count]) => count > 0).map(([count, label, tone]) => tone ? \`<span class="count-\${tone}">\${count} \${label}</span>\` : \`\${count} \${label}\`);
  return parts.length > 0 ? parts.join(" · ") : "0 on";
};
var feedItemHtml = (entry, index) => {
  const deny = entry.decision !== "allow";
  const badgeClass = entry.failureStage ? "error" : deny ? "deny" : "allow";
  const badgeLabel = entry.failureStage ? "Error" : deny ? "Blocked" : "Allowed";
  return \`<article class="feed-item">
    <div class="feed-meta">
      <span class="decision-badge \${badgeClass}">\${badgeLabel}</span>
      \${entry.agent && entry.agent !== "unknown" ? \`<span class="agent-badge">\${escapeHtml(agentLabels[entry.agent] ?? entry.agent)}</span>\` : ""}
      \${entry.ruleId ? knownRuleIds.has(entry.ruleId) ? \`<button type="button" class="rule-id" data-jump-rule="\${escapeHtml(entry.ruleId)}" title="Show this rule in Policy">\${escapeHtml(entry.ruleId)}</button>\` : \`<code class="rule-id">\${escapeHtml(entry.ruleId)}</code>\` : ""}
      <time datetime="\${escapeHtml(entry.ts)}" title="\${escapeHtml(entry.ts)}">\${formatRelativeTime(entry.ts)}</time>
      <button type="button" class="icon-button feed-copy" data-log-copy="\${index}" aria-label="Copy log entry as JSON">\${rawCopyIcons.copy}</button>
      \${deny ? \`<button type="button" class="icon-button feed-report" data-report-fp="\${index}" aria-label="Report false positive" title="Report false positive">\${reportIcon}</button>\` : \`<button type="button" class="feed-toggle feed-block" data-block-future="\${index}">Block this in future</button>\`}
    </div>
    <code class="feed-command">\${escapeHtml(entry.segment || entry.command || "(no command recorded)")}</code>
    \${entry.reason && entry.reason !== "allowed" ? \`<p class="feed-reason muted">\${escapeHtml(entry.reason)}</p>\` : ""}
  </article>\`;
};
var applyFeedClamps = (root) => {
  const overflowing = [...root.querySelectorAll(".feed-command")].filter((command) => !command.classList.contains("clamped") && command.scrollHeight > command.clientHeight + 1);
  overflowing.forEach((command) => {
    command.classList.add("clamped");
    command.insertAdjacentHTML("afterend", '<button type="button" class="feed-toggle" data-feed-toggle aria-expanded="false">Show more</button>');
  });
};
var dayLabel = (ts) => {
  const date = new Date(ts);
  if (date.toDateString() === new Date().toDateString())
    return "Today";
  if (date.toDateString() === new Date(Date.now() - 86400000).toDateString())
    return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
var renderOverviewActivity = () => {
  if (!overview)
    return;
  const tile = (value, label, extra) => \`<div class="tile"><strong>\${escapeHtml(value.toLocaleString("en-US"))}</strong><span>\${escapeHtml(label)}</span>\${extra}</div>\`;
  const dayAgoLabel = (daysAgo) => daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : \`\${daysAgo} days ago\`;
  const sparkline = (byDay, noun) => {
    const max = Math.max(...byDay, 1);
    return \`<div class="tile-spark" role="group" aria-label="Commands \${noun} per day, most recent \${dayCount(byDay.length)}">\${byDay.map((count, index) => {
      const label = \`\${dayAgoLabel(byDay.length - 1 - index)}: \${count.toLocaleString("en-US")} \${noun}\`;
      return \`<div class="spark-col" role="img" tabindex="0" data-count="\${count.toLocaleString("en-US")}" aria-label="\${escapeHtml(label)}"><div class="spark-bar\${count === 0 ? " spark-zero" : ""}" aria-hidden="true" style="height:\${count === 0 ? 2 : Math.max(2, Math.round(count / max * 40))}px"></div></div>\`;
    }).join("")}</div>\`;
  };
  qs("overview-window").textContent = \`Last \${dayCount(overview.days)}\`;
  qs("overview-tiles").innerHTML = [
    tile(overview.counts.blocked, "Blocked", sparkline(overview.counts.blockedByDay, "blocked")),
    tile(overview.totalInWindow, "Analyzed", sparkline(overview.counts.analyzedByDay, "analyzed"))
  ].join("");
};
var retentionDays = () => state?.policy?.audit?.retention_days ?? DEFAULT_AUDIT_RETENTION_DAYS;
var overviewDays = () => Math.min(OVERVIEW_DAYS, retentionDays());
var renderRetention = (loaded) => {
  qs("retention-days").value = String(loaded.policy.audit.retention_days);
  qs("retention-unit").textContent = loaded.policy.audit.retention_days === 1 ? "day" : "days";
  qs("retention-note").textContent = "Saved on change. Lowering this deletes anything already older than the new window; the Activity tab can only look back as far as it.";
};
var activityWindowOptions = () => {
  const retained = retentionDays();
  const windows = [7, 30, 90, 180, 365].filter((days) => days < retained);
  return [...windows, retained];
};
var configStateNotice = () => {
  const configState = state?.configState;
  if (!configState || configState.state === "ready")
    return null;
  return \`A fallback configuration is being enforced: \${configState.reason}\`;
};
var setProtectionBanner = (notices) => {
  const text = notices.filter(Boolean).join(" ");
  qs("protection-banner").textContent = text;
  qs("protection-banner").hidden = text === "";
};
var renderProtectionCard = () => {
  const configNotice = configStateNotice();
  if (!state?.preview) {
    qs("protection-card").hidden = true;
    setProtectionBanner([configNotice]);
    return;
  }
  const policy = state.policy;
  const customized = state.preview.counts.effectiveCustomizations > 0 || Object.entries(policy.safety.overrides).some(([key, value]) => value !== SAFETY_LEVEL_CAPABILITIES[policy.safety.level][key]);
  const commandsOn = policy.destructive_command_protection.enabled;
  const secretsOn = policy.secret_protection.enabled;
  const off = [
    commandsOn ? null : "Destructive command protection is off — configurable destructive command rules are not being enforced (catastrophic and custom rules remain active)",
    secretsOn ? null : "Secret protection is off — sensitive paths and deny paths are not being blocked"
  ].filter(Boolean);
  setProtectionBanner([
    off.length > 0 ? \`\${off.join(". ")}. Re-enable \${off.length > 1 ? "them" : "it"} in Policy.\` : null,
    configNotice
  ]);
  qs("protection-card").hidden = false;
  qs("protection-card").classList.toggle("protection-warning", !commandsOn || !secretsOn);
  qs("protection-card").innerHTML = \`<div class="panel-head"><div class="panel-title"><h2>Protection status</h2></div><a class="panel-head-action view-all-link" href="#policy">Configure</a></div>\` + \`<p>\${escapeHtml(safetyLevels[policy.safety.level][0])}\${customized ? " · Customized" : ""}</p>\` + \`<p\${commandsOn ? "" : ' class="state-disabled"'}>\${commandsOn ? \`\${state.preview.counts.enabled} rules active\` : "Destructive command protection is OFF"}</p>\` + \`<p\${secretsOn ? "" : ' class="state-disabled"'}>\${secretsOn ? "Secret protection on" : "Secret protection is OFF"}</p>\`;
};
var renderTopList = (containerId, counts, className, dataAttr) => {
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  qs(containerId).innerHTML = top.length === 0 ? '<p class="empty">No blocked commands in this window.</p>' : top.map(([key, count]) => \`<button type="button" class="\${className}" \${dataAttr}="\${escapeHtml(key)}"><code class="rule-id">\${escapeHtml(key)}</code><span class="chip-count">\${count.toLocaleString("en-US")}</span></button>\`).join("");
};
var renderTopLists = () => {
  if (!overview)
    return;
  renderTopList("top-commands", overview.counts.commands, "top-command", "data-command");
  renderTopList("top-rules", overview.counts.rules, "top-rule", "data-rule-id");
};
var clearCommandFilter = () => {
  if (!activityFilters.command)
    return false;
  activityFilters.command = "";
  return true;
};
var jumpToActivityRule = (ruleId) => {
  activityFilters.command = "";
  activityFilters.query = ruleId.toLowerCase();
  qs("activity-search").value = ruleId;
  if (activity) {
    renderActivityControls();
    renderActivityFeed();
  }
  location.hash = "activity";
};
var renderGuardErrors = () => {
  if (!overview)
    return;
  qs("guard-errors").hidden = overview.counts.errors === 0;
  if (overview.counts.errors === 0)
    return;
  qs("guard-errors").textContent = \`\${overview.counts.errors.toLocaleString("en-US")} guard error\${overview.counts.errors === 1 ? "" : "s"} in the last \${dayCount(overview.days)} — commands blocked because evaluation failed, not by policy. Click to view.\`;
};
var renderActivityControls = () => {
  if (!activity)
    return;
  const agentCounts = activity.counts.agents;
  const chipHtml = (kind, value, label, count) => \`<button type="button" class="chip" data-activity-chip="\${kind}" data-chip-value="\${escapeHtml(value)}" aria-pressed="\${activityFilters[kind] === value}">\${escapeHtml(label)}\${count === undefined ? "" : \` <span class="chip-count">\${count.toLocaleString("en-US")}</span>\`}</button>\`;
  qs("activity-decision").innerHTML = [
    chipHtml("decision", "all", "All", activity.totalInWindow),
    chipHtml("decision", "deny", "Blocked", activity.counts.blocked),
    chipHtml("decision", "allow", "Allowed", activity.counts.allowed),
    ...activity.counts.errors > 0 ? [chipHtml("decision", "error", "Errors", activity.counts.errors)] : [],
    ...suspects.size > 0 ? [chipHtml("decision", "suspect", "Likely false positive", suspects.size)] : []
  ].join("");
  const agentNames = Object.keys(agentCounts).filter((name) => name !== "unknown").sort();
  qs("activity-agents").innerHTML = agentNames.length < 2 ? "" : [
    chipHtml("agent", "all", "All agents"),
    ...agentNames.map((name) => chipHtml("agent", name, agentLabels[name] ?? name, agentCounts[name]))
  ].join("");
  qs("activity-command-filter").innerHTML = activityFilters.command ? \`<button type="button" class="filter-pill" data-clear-command aria-label="Clear command filter">Command: <code>\${escapeHtml(activityFilters.command)}</code><span class="filter-pill-x" aria-hidden="true">✕</span></button>\` : "";
  qs("activity-days").innerHTML = activityWindowOptions().map((days) => \`<option value="\${days}">Last \${dayCount(days)}</option>\`).join("");
  qs("activity-days").value = String(activity.days);
};
var renderActivityFeed = () => {
  if (!activity)
    return;
  const matchesFilters = (entry) => {
    if (activityFilters.decision === "deny" && entry.decision === "allow")
      return false;
    if (activityFilters.decision === "allow" && entry.decision !== "allow")
      return false;
    if (activityFilters.decision === "error" && !entry.failureStage)
      return false;
    if (activityFilters.decision === "suspect" && !suspects.has(entry))
      return false;
    if (activityFilters.agent !== "all" && (entry.agent || "unknown") !== activityFilters.agent)
      return false;
    if (activityFilters.command) {
      if (entry.decision === "allow")
        return false;
      return commandSignature(entry.segment || entry.command) === activityFilters.command;
    }
    if (!activityFilters.query)
      return true;
    return [entry.ruleId, entry.segment || entry.command].filter(Boolean).join(" ").toLowerCase().includes(activityFilters.query);
  };
  const entries = activity.entries.filter(matchesFilters);
  renderedFeedEntries = entries;
  qs("activity-feed").innerHTML = entries.length === 0 ? '<p class="empty">No audit log entries match.</p>' : \`<div class="feed-list">\${entries.map((entry, index) => {
    const label = dayLabel(entry.ts);
    const previous = entries[index - 1];
    const separator = previous && label === dayLabel(previous.ts) ? "" : \`<div class="feed-day-sep">\${escapeHtml(label)}</div>\`;
    return separator + feedItemHtml(entry, index);
  }).join("")}</div>\`;
  applyFeedClamps(qs("activity-feed"));
  qs("activity-count").textContent = \`Showing \${entries.length.toLocaleString("en-US")} of \${activity.totalInWindow.toLocaleString("en-US")} entries from the last \${dayCount(activity.days)}\${activity.truncated ? " (capped at 500, newest of each decision)" : ""}.\${activity.unreadable > 0 ? \` \${activity.unreadable.toLocaleString("en-US")} audit log source\${activity.unreadable === 1 ? "" : "s"} could not be read, so this list is incomplete.\` : ""}\`;
};
var loadOverview = async () => {
  const result = await requestJson(\`/api/activity?days=\${overviewDays()}\`);
  if (!result.ok || !result.data) {
    const message = \`<p class="empty">Could not load activity: \${escapeHtml(errorText(result))}</p>\`;
    qs("overview-window").textContent = "";
    qs("overview-tiles").innerHTML = "";
    qs("top-rules").innerHTML = message;
    qs("guard-errors").hidden = true;
    return;
  }
  const feed = result.data;
  overview = feed;
  qs("logs-path").textContent = overview.logsDir ?? "Not available";
  renderOverviewActivity();
  renderTopLists();
  renderGuardErrors();
};
var loadActivity = async () => {
  const result = await requestJson(\`/api/activity?days=\${activityFilters.days}\`);
  if (!result.ok || !result.data) {
    const message = \`<p class="empty">Could not load activity: \${escapeHtml(errorText(result))}</p>\`;
    qs("activity-feed").innerHTML = message;
    qs("activity-count").textContent = "";
    return;
  }
  const feed = result.data;
  activity = feed;
  suspects = findSuspectEntries(activity.entries);
  if (activityFilters.agent !== "all" && !(activityFilters.agent in activity.counts.agents)) {
    activityFilters.agent = "all";
  }
  if (activityFilters.decision === "error" && activity.counts.errors === 0) {
    activityFilters.decision = "all";
  }
  if (activityFilters.decision === "suspect" && suspects.size === 0) {
    activityFilters.decision = "all";
  }
  renderActivityControls();
  renderActivityFeed();
};
var runRefresh = async (buttonId, reload) => {
  const button = qs(buttonId);
  if (button.disabled)
    return;
  button.disabled = true;
  button.classList.add("spinning");
  try {
    await Promise.all([reload(), new Promise((resolve) => setTimeout(resolve, 600))]);
  } finally {
    button.classList.remove("spinning");
    button.disabled = false;
  }
};
var refreshActivity = () => runRefresh("activity-refresh", () => Promise.all([loadOverview(), loadActivity()]));
var renderIntegrations = () => {
  const loaded = integrations;
  if (!loaded)
    return;
  qs("integrations-list").innerHTML = loaded.targets.map((row) => {
    const busy = integrationBusy.has(row.target);
    const version = row.version === null ? '<span class="muted">not detected</span>' : \`<span class="agent-badge">v\${escapeHtml(row.version)}</span>\`;
    const status = row.status === "active" ? '<span class="state-active">Installed</span>' : row.status === "disabled" ? '<span class="state-disabled">Disabled</span>' : row.status === "not-inspected" ? \`<span class="muted" title="This runtime's state file could not be read, so its status is unknown.">Not inspected</span>\` : '<span class="muted">Not installed</span>';
    const uninstall = row.status === "active";
    const busyLabel = uninstall ? "Uninstalling…" : "Installing…";
    const action = row.version === null ? "" : \`<button type="button" class="\${uninstall ? "danger" : "primary"}" data-integration-action="\${uninstall ? "uninstall" : "install"}" data-integration-target="\${escapeHtml(row.target)}"\${busy ? " disabled" : ""}>\${busy ? busyLabel : uninstall ? "Uninstall" : row.status === "disabled" ? "Enable" : "Install"}</button>\`;
    const note = row.note ? \`<div class="status \${row.note.kind}">\${escapeHtml(row.note.text)}</div>\` : "";
    return \`<div class="integration-row">
        <span class="integration-info"><strong>\${escapeHtml(row.label)}</strong> \${version} \${status}</span>
        \${action}
        \${note}
      </div>\`;
  }).join("");
};
var renderHealthStrip = (health) => {
  const loaded = integrations;
  if (!loaded || !health.ok)
    return;
  const detected = loaded.targets.filter((row) => row.status === "active" || row.status === "disabled");
  const active = detected.filter((row) => row.status === "active");
  const inactive = detected.filter((row) => row.status === "disabled");
  const attention = inactive.length > 0 || active.length === 0;
  const parts = [];
  const labelHtml = (row) => \`<strong>\${escapeHtml(row.label)}</strong>\`;
  if (active.length)
    parts.push(\`Hook active in \${active.map(labelHtml).join(", ")}\`);
  if (inactive.length)
    parts.push(\`\${inactive.map(labelHtml).join(", ")} detected without an active hook\`);
  if (!parts.length)
    parts.push("No agent hooks detected");
  if (health.data?.update?.updateAvailable)
    parts.push(\`v\${escapeHtml(health.data.update.latestVersion)} available\`);
  const link = attention ? ' <a class="view-all-link" href="#integrations">Fix in Integrations</a>' : "";
  const el = qs("health-strip");
  el.className = attention ? "status health-strip error" : "status health-strip ok";
  el.innerHTML = parts.join(" · ") + link;
  el.hidden = false;
};
var loadIntegrations = async () => {
  const result = await requestJson("/api/integrations");
  if (!result.ok || !Array.isArray(result.data?.targets)) {
    qs("integrations-list").innerHTML = \`<p class="empty">Could not load integrations: \${escapeHtml(errorText(result))}</p>\`;
    return;
  }
  integrations = result.data;
  renderIntegrations();
  qs("integrations-pkg-version").textContent = result.data.system.version;
  qs("integrations-node-version").textContent = result.data.system.nodeVersion ?? "unknown";
  qs("integrations-platform").textContent = result.data.system.platform;
  qs("integrations-system").hidden = false;
};
var refreshIntegrations = () => runRefresh("integrations-refresh", loadIntegrations);
var renderRules = () => {
  const loaded = rulesData;
  if (!loaded)
    return;
  if (!qs("rules-project-path").value)
    qs("rules-project-path").value = loaded.projectPath;
  const canPick = loaded.canPickDirectory && !directoryPickerFailed;
  qs("rules-project-path").readOnly = canPick;
  qs("rules-choose-directory").hidden = !canPick;
  qs("rules-list").innerHTML = loaded.rulebooks.length === 0 ? loaded.errors.length > 0 ? '<p class="empty">Every configured rulebook was dropped, so no custom rule is enforced. See Diagnostics below.</p>' : '<p class="empty">No custom rulebooks. Run <code>npx -y cc-safety-net rule init</code> to create one, or see the <a href="https://ccsafetynet.com/docs" target="_blank" rel="noopener">documentation</a>.</p>' : loaded.rulebooks.map((rulebook) => \`<div class="rulebook-card">
    <div class="rulebook-head">
      <strong>\${escapeHtml(rulebook.name)}</strong>
      <span class="agent-badge">v\${escapeHtml(rulebook.version)}</span>
      \${rulebook.spec === rulebook.name ? "" : \`<code>\${escapeHtml(rulebook.spec)}</code>\`}
      <span>\${rulebook.source === "user" ? "All projects" : "This project"}</span>
      <span>\${rulebook.rules.length} rule\${rulebook.rules.length === 1 ? "" : "s"}</span>
    </div>
    \${rulebook.rules.map((rule) => \`<div class="rulebook-rule\${pendingRuleFocus === rule.name ? " rules-focus" : ""}">
      <code class="rule-id">custom.\${escapeHtml(rule.name)}</code>
      <code>\${escapeHtml([rule.command, rule.subcommand].filter(Boolean).join(" "))}</code>
      <p>Blocked arguments (any one matches): \${rule.block_args.map((arg) => \`<code>\${escapeHtml(arg)}</code>\`).join(" ")}</p>
      <p>\${escapeHtml(rule.reason)}</p>
    </div>\`).join("")}
  </div>\`).join("");
  const diagnostics = [
    ...loaded.errors.map((text) => \`<div class="status error">\${escapeHtml(text)}</div>\`),
    ...loaded.warnings.map((text) => \`<div class="status">\${escapeHtml(text)}</div>\`)
  ];
  qs("rules-diagnostics").innerHTML = diagnostics.join("");
  qs("rules-diagnostics-panel").hidden = diagnostics.length === 0;
  if (!pendingRuleFocus)
    return;
  const focused = qs("rules-list").querySelector(".rules-focus");
  if (focused)
    focused.scrollIntoView({ block: "center" });
  if (!focused)
    setAppStatus(\`custom.\${pendingRuleFocus} is not in any rulebook\`, "error");
  pendingRuleFocus = null;
};
var loadRules = async () => {
  const result = await requestJson("/api/rules");
  if (!result.ok || !Array.isArray(result.data?.rulebooks)) {
    qs("rules-list").innerHTML = \`<p class="empty">Could not load rules: \${escapeHtml(errorText(result))}</p>\`;
    rulesData = null;
    qs("rules-diagnostics-panel").hidden = true;
    rulesRequested = false;
    return;
  }
  rulesData = result.data;
  renderRules();
};
var refreshRules = () => runRefresh("rules-refresh", () => {
  rulesRequested = true;
  return loadRules();
});
var jumpToRulesRule = (ruleId) => {
  pendingRuleFocus = ruleId.replace(/^custom\\./, "");
  location.hash = "rules";
};
var openRuleComposer = (command) => {
  qs("rules-composer-input").value = command;
  location.hash = "rules";
};
var setRulesScope = (scope) => {
  rulesScope = scope;
  document.querySelectorAll("[data-rules-scope]").forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.dataset.rulesScope === scope));
  });
  qs("rules-project-path-field").hidden = scope !== "project";
};
var chooseProjectDirectory = async () => {
  const button = qs("rules-choose-directory");
  if (button.disabled)
    return;
  button.disabled = true;
  const result = await requestJson("/api/rules/choose-directory", { method: "POST" });
  button.disabled = false;
  if (result.ok && result.data.path) {
    qs("rules-project-path").value = result.data.path;
    return;
  }
  if (result.ok && result.data.cancelled)
    return;
  directoryPickerFailed = true;
  qs("rules-project-path").readOnly = false;
  button.hidden = true;
  setAppStatus(\`\${result.ok ? result.data.error : errorText(result)} - type the project path instead\`, "error");
};
var copyRulePrompt = async () => {
  if (!rulesData) {
    setAppStatus("Rules have not loaded yet - refresh the Rulebooks panel", "error");
    return;
  }
  if (!qs("rules-composer-input").value.trim()) {
    setAppStatus("Describe what you want first", "error");
    return;
  }
  if (rulesScope === "project" && !qs("rules-project-path").value.trim()) {
    setAppStatus("Enter the project path the rule belongs to", "error");
    return;
  }
  qs("rules-copy-prompt").disabled = true;
  try {
    await navigator.clipboard.writeText(rulePromptText({
      rulesData,
      rulesScope,
      projectPath: qs("rules-project-path").value,
      request: qs("rules-composer-input").value
    }));
    qs("rules-composer-input").value = "";
    setAppStatus("Prompt copied - paste it into your coding CLI", "ok");
  } catch {
    setAppStatus("Copy failed", "error");
  } finally {
    qs("rules-copy-prompt").disabled = false;
  }
};
var runIntegrationAction = async (button) => {
  const target = button.dataset.integrationTarget;
  if (!target || integrationBusy.has(target))
    return;
  integrationBusy.add(target);
  const action = button.dataset.integrationAction;
  renderIntegrations();
  const result = await requestJson(\`/api/\${action}\`, {
    method: "POST",
    body: JSON.stringify({ target })
  });
  integrationBusy.delete(target);
  const row = integrations?.targets.find((entry) => entry.target === target);
  if (!row)
    return;
  const ok = result.ok && result.data.ok === true;
  if (ok)
    row.status = action === "install" ? "active" : "not-installed";
  row.note = {
    kind: ok ? "ok" : "error",
    text: ok ? result.data.output : result.data?.output || errorText(result)
  };
  if (!ok)
    setAppStatus(action === "install" ? "Install failed" : "Uninstall failed", "error");
  renderIntegrations();
};
var confirmDialog = (() => {
  const dialog = qs("confirm-dialog");
  const confirm = qs("confirm-dialog-confirm");
  const cancel = qs("confirm-dialog-cancel");
  let resolvePending = null;
  dialog.addEventListener("close", () => {
    if (!resolvePending)
      return;
    resolvePending(dialog.returnValue === "confirm");
    resolvePending = null;
  });
  dialog.addEventListener("cancel", () => {
    dialog.returnValue = "cancel";
  });
  return (options) => new Promise((resolve) => {
    if (resolvePending) {
      resolve(false);
      return;
    }
    qs("confirm-dialog-title").textContent = options.title;
    qs("confirm-dialog-body").textContent = options.body;
    qs("confirm-dialog-detail").textContent = options.detail ?? "";
    const detailRow = qs("confirm-dialog-detail").parentElement;
    if (detailRow)
      detailRow.hidden = !options.detail;
    qs("confirm-dialog-rows").innerHTML = options.rowsHtml ?? "";
    qs("confirm-dialog-rows").hidden = !options.rowsHtml;
    confirm.textContent = options.confirmLabel;
    confirm.className = options.confirmClass ?? "danger";
    dialog.returnValue = "cancel";
    resolvePending = resolve;
    dialog.showModal();
    cancel.focus();
  });
})();
var confirmProtectionDisable = (options) => confirmDialog({
  title: options.title,
  body: options.body,
  detail: options.detail,
  confirmLabel: "Disable protection"
});
var togglePanel = (button) => {
  const controls = button.getAttribute("aria-controls");
  if (!controls)
    return;
  const expanded = button.getAttribute("aria-expanded") !== "true";
  button.setAttribute("aria-expanded", String(expanded));
  qs(controls).hidden = !expanded;
};
var syncSearchState = () => {
  const active = qs("policy-search").value.trim().length > 0;
  if (active === searchActive)
    return;
  searchActive = active;
  if (active)
    return;
  searchCollapsedTiers.clear();
  searchCollapsedSecretGroups.clear();
};
var updateRawSource = () => {
  if (projectDraft) {
    qs("raw-source").textContent = \`Only the fields marked for this project. Writes to \${projectDraft.path}.\`;
    return;
  }
  qs("raw-source").textContent = state?.errors.length ? "Read-only original policy JSON. Repair preserves valid settings and writes canonical JSON." : "Read-only mirror of the controls.";
};
var setRawCopyCopied = (copied) => {
  qs("raw-copy").innerHTML = copied ? rawCopyIcons.check : rawCopyIcons.copy;
  qs("raw-copy").classList.toggle("copied", copied);
  qs("raw-copy").setAttribute("aria-label", copied ? "Copied raw JSON" : "Copy raw JSON to clipboard");
};
var resetFeedCopy = () => {
  document.querySelectorAll(".feed-copy.copied").forEach((button) => {
    button.classList.remove("copied");
    button.innerHTML = rawCopyIcons.copy;
    button.setAttribute("aria-label", "Copy log entry as JSON");
  });
};
var openReportDialog = (button) => {
  const entry = renderedFeedEntries[Number(button.dataset.reportFp)];
  if (!entry)
    return;
  const scrub = (text) => scrubReportPaths(text, entry.cwd, activity?.homeDir);
  qs("report-command").value = scrub(entry.command || entry.segment || "");
  qs("report-entry").value = JSON.stringify(entry, (_key, value) => typeof value === "string" ? scrub(value) : value, 2);
  qs("report-dialog").returnValue = "cancel";
  qs("report-dialog").showModal();
};
var openFalsePositiveForm = async () => {
  const fields = {
    command: qs("report-command").value,
    entry: qs("report-entry").value
  };
  const request = buildReportRequest(fields);
  const copying = request.dropped.length ? navigator.clipboard.writeText(request.dropped.map((field) => \`### \${field}
\${fields[field]}\`).join(\`

\`)) : null;
  window.open(request.url, "_blank", "noopener");
  if (!copying)
    return;
  const names = request.dropped.join(" and ");
  setAppStatus(await copying.then(() => true).catch(() => false) ? \`Report too long to prefill — \${names} copied to your clipboard. Paste into the form on GitHub.\` : \`Report too long to prefill — \${names} left out. Copy the entry from the feed and paste it into the form on GitHub.\`, "error");
};
qs("report-dialog").addEventListener("close", () => {
  if (qs("report-dialog").returnValue === "report")
    openFalsePositiveForm();
});
var copyFeedEntry = async (button) => {
  const entry = renderedFeedEntries[Number(button.dataset.logCopy)];
  if (!entry)
    return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(entry, null, 2));
    if (feedCopyResetTimer)
      clearTimeout(feedCopyResetTimer);
    resetFeedCopy();
    button.classList.add("copied");
    button.innerHTML = rawCopyIcons.check;
    button.setAttribute("aria-label", "Copied log entry");
    feedCopyResetTimer = setTimeout(resetFeedCopy, 2000);
  } catch {
    setAppStatus("Copy failed", "error");
  }
};
var copyRawToClipboard = async () => {
  qs("raw-copy").disabled = true;
  try {
    await navigator.clipboard.writeText(qs("raw").value);
    setRawCopyCopied(true);
    if (rawCopyResetTimer)
      clearTimeout(rawCopyResetTimer);
    rawCopyResetTimer = setTimeout(() => setRawCopyCopied(false), 2000);
  } catch (error) {
    setAppStatus("Copy failed", "error");
    setDetailStatus(\`Error: Could not copy Raw JSON: \${error instanceof Error ? error.message : String(error)}\`, "error");
  } finally {
    qs("raw-copy").disabled = false;
  }
};
var formatStarCount = (count) => {
  if (typeof count !== "number")
    return "";
  if (count >= 1000)
    return \`\${(count / 1000).toFixed(1).replace(/\\.0$/, "")}k\`;
  return String(count);
};
var starCountHtml = (count) => {
  const formatted = formatStarCount(count);
  return formatted ? \`<span class="star-count">\${escapeHtml(formatted)}</span>\` : "";
};
var hideStarCta = () => {
  qs("star-row").hidden = true;
  qs("star-slot").innerHTML = "";
};
var renderStarPitch = (context, starred = false) => {
  const evidence = context.blockedTotal > 0 ? \`CC Safety Net has blocked <strong>\${escapeHtml(context.blockedTotal.toLocaleString("en-US"))}</strong> risky command\${context.blockedTotal === 1 ? "" : "s"} on this machine in its retained \${escapeHtml(dayCount(retentionDays()))} history.\` : "";
  if (starred) {
    qs("star-pitch-text").innerHTML = evidence;
    return;
  }
  qs("star-pitch-text").innerHTML = evidence ? \`\${evidence} If it saved your work, star it on GitHub.\` : "If CC Safety Net is useful to you, star it on GitHub.";
};
var renderStarLink = (context, href = fallbackRepoUrl) => {
  qs("star-slot").innerHTML = \`<a class="star-cta" href="\${escapeHtml(href)}" target="_blank" rel="noopener" aria-label="Star CC Safety Net on GitHub (opens github.com)">
      <span class="star-icon" aria-hidden="true">\${starIcons.outline}</span>
      <span class="star-label">Star on GitHub</span>
      \${starCountHtml(context.starCount)}
    </a>\`;
  qs("star-row").hidden = false;
};
var renderStarCta = (context) => {
  activeStarContext = context;
  if (context.starred === true) {
    hideStarCta();
    return;
  }
  renderStarPitch(context);
  qs("star-mechanism").hidden = context.starred !== false;
  if (context.starred === null) {
    renderStarLink(context);
    return;
  }
  qs("star-slot").innerHTML = \`<button type="button" class="star-cta" aria-label="Star CC Safety Net on GitHub. One click via your GitHub CLI.">
      <span class="star-icon" aria-hidden="true">\${starIcons.outline}</span>
      <span class="star-label">Star on GitHub</span>
      \${starCountHtml(context.starCount)}
    </button>\`;
  qs("star-row").hidden = false;
};
var starRepo = async (button) => {
  button.disabled = true;
  const result = await requestJson("/api/star", { method: "POST" });
  if (result.ok && result.data?.ok === true) {
    const icon = button.querySelector(".star-icon");
    const label = button.querySelector(".star-label");
    if (icon)
      icon.innerHTML = starIcons.filled;
    if (label)
      label.textContent = "Starred. Thank you.";
    button.setAttribute("aria-label", "CC Safety Net starred on GitHub");
    button.classList.add("starred");
    qs("star-mechanism").hidden = true;
    renderStarPitch(activeStarContext, true);
    setAppStatus("Starred on GitHub", "ok");
    setDetailStatus("");
    return;
  }
  qs("star-mechanism").hidden = true;
  renderStarLink(activeStarContext, result.data?.fallbackUrl ?? fallbackRepoUrl);
};
var loadStarContext = async () => {
  const result = await requestJson("/api/star/context");
  renderStarCta(result.ok && result.data ? result.data : { starred: null, starCount: null, blockedTotal: 0 });
};
var syncRawFromForm = () => {
  if (state?.errors.length)
    return;
  qs("raw").value = formatPolicy(projectDraft ? collectProjectProposal(markedFields, draftPolicy) : collectFormPolicy());
  updateRawSource();
};
var updateDirtyStatus = () => {
  if (!state || state.errors.length)
    return;
  if (projectDraft) {
    dirty = JSON.stringify(collectProjectProposal(markedFields, draftPolicy)) !== projectDraft.snapshot;
    qs("policy-savebar").hidden = !dirty;
    qs("dirty-chip").hidden = !dirty || currentView() === "policy";
    setDetailStatus("");
    updateActions();
    return;
  }
  const draftJson = JSON.stringify(collectFormPolicy());
  dirty = draftJson !== JSON.stringify(state.policy);
  qs("policy-savebar").hidden = !dirty;
  qs("dirty-chip").hidden = !dirty || currentView() === "policy";
  if (dirty)
    sessionStorage.setItem("cc-safety-net-draft", draftJson);
  if (!dirty)
    sessionStorage.removeItem("cc-safety-net-draft");
  setDetailStatus("");
  updateActions();
};
var createPathList = (prefix, config) => {
  const setHint = (text) => {
    qs(\`\${prefix}-hint\`).textContent = text;
    qs(\`\${prefix}-hint\`).hidden = !text;
  };
  const render = () => {
    const paths = config.getPaths();
    const disabled = config.isDisabled();
    qs(\`\${prefix}-count\`).textContent = \`\${paths.length} path\${paths.length === 1 ? "" : "s"}\`;
    qs(\`\${prefix}-input\`).disabled = disabled;
    qs(\`\${prefix}-add-button\`).disabled = disabled;
    qs(\`\${prefix}-list\`).innerHTML = paths.length === 0 ? \`<li class="empty">No \${config.itemLabel}s configured.</li>\` : paths.map((path, index) => \`<li class="path-item \${disabled ? "row-disabled" : ""}">
          <code>\${escapeHtml(path)}</code>
          <button type="button" class="icon-button" data-path-list="\${prefix}" data-path-remove="\${index}" \${disabled ? "disabled" : ""} aria-label="Remove \${config.itemLabel} \${escapeHtml(path)}">\${pathListIcons.remove}</button>
        </li>\`).join("");
  };
  const claimForProject = () => {
    if (!projectDraft || markedFields.has(config.field))
      return;
    markedFields.add(config.field);
    config.setPaths([]);
    syncProjectChips();
  };
  let adding = false;
  const add = async (value) => {
    if (adding)
      return;
    const entries = [...new Set(pathLines(value))];
    if (entries.length === 0)
      return;
    const scope = projectDraft;
    const claimed = projectDraft !== null && !markedFields.has(config.field);
    const previousPaths = config.getPaths();
    claimForProject();
    const submitted = qs(\`\${prefix}-input\`).value;
    const additions = entries.filter((entry) => !config.getPaths().includes(entry));
    if (additions.length) {
      adding = true;
      try {
        const error = await config.validateAdditions([...config.getPaths(), ...additions]);
        if (projectDraft !== scope)
          return;
        if (error) {
          setHint(\`Not added: \${additions.join(", ")} — \${error}\`);
          if (claimed) {
            markedFields.delete(config.field);
            config.setPaths(previousPaths);
            syncProjectChips();
          }
          return;
        }
      } finally {
        adding = false;
      }
    }
    const current = config.getPaths();
    const duplicates = entries.filter((entry) => current.includes(entry));
    config.setPaths([...current, ...additions.filter((entry) => !current.includes(entry))]);
    if (qs(\`\${prefix}-input\`).value === submitted)
      qs(\`\${prefix}-input\`).value = "";
    setHint(duplicates.length ? \`Already listed: \${duplicates.join(", ")}\` : "");
    render();
    syncRawFromForm();
    updateDirtyStatus();
    qs(\`\${prefix}-input\`).focus();
  };
  const remove = (index) => {
    claimForProject();
    config.setPaths(config.getPaths().filter((_, position) => position !== index));
    setHint("");
    render();
    syncRawFromForm();
    updateDirtyStatus();
  };
  return { render, add, remove };
};
var validatePathAdditions = async (patch) => {
  const candidate = collectFormPolicy();
  patch(candidate);
  const result = await requestPolicyPreview(candidate);
  if (result.ok && result.data?.preview)
    return null;
  return errorText(result);
};
var pathLists = {
  "deny-paths": createPathList("deny-paths", {
    field: "secret_protection.deny_paths",
    getPaths: () => draftPolicy.secret_protection.deny_paths,
    setPaths: (paths) => {
      draftPolicy.secret_protection.deny_paths = paths;
    },
    isDisabled: () => !draftPolicy.secret_protection.enabled,
    itemLabel: "deny path",
    validateAdditions: (paths) => validatePathAdditions((candidate) => {
      candidate.secret_protection = { ...candidate.secret_protection, deny_paths: paths };
    })
  }),
  "secret-allow-paths": createPathList("secret-allow-paths", {
    field: "secret_protection.allow_paths",
    getPaths: () => draftPolicy.secret_protection.allow_paths,
    setPaths: (paths) => {
      draftPolicy.secret_protection.allow_paths = paths;
    },
    isDisabled: () => !draftPolicy.secret_protection.enabled,
    itemLabel: "allow path",
    validateAdditions: (paths) => validatePathAdditions((candidate) => {
      candidate.secret_protection = { ...candidate.secret_protection, allow_paths: paths };
    })
  }),
  "allow-paths": createPathList("allow-paths", {
    field: "destructive_command_protection.allow_paths",
    getPaths: () => draftPolicy.destructive_command_protection.allow_paths,
    setPaths: (paths) => {
      draftPolicy.destructive_command_protection.allow_paths = paths;
    },
    isDisabled: () => !draftPolicy.destructive_command_protection.enabled,
    itemLabel: "allow path",
    validateAdditions: (paths) => validatePathAdditions((candidate) => {
      candidate.destructive_command_protection = {
        ...candidate.destructive_command_protection,
        allow_paths: paths
      };
    })
  })
};
var pathListFor = (name) => name === "deny-paths" || name === "allow-paths" || name === "secret-allow-paths" ? pathLists[name] : null;
var secretRuleIsActive = (rule, overrides) => overrides[rule.id] ? overrides[rule.id] === "on" : !rule.defaultOff;
var markProjectOverride = (section, ruleId) => {
  if (!projectDraft)
    return;
  markedFields.add(\`\${section}.overrides.\${ruleId}\`);
};
var clearProjectOverrideMarks = (section) => {
  markedFields = new Set([...markedFields].filter((field) => !field.startsWith(\`\${section}.overrides.\`)));
};
var setSecretOverride = (rule, active) => {
  if (!projectDraft && active === !rule.defaultOff) {
    delete draftPolicy.secret_protection.overrides[rule.id];
    return;
  }
  draftPolicy.secret_protection.overrides[rule.id] = active ? "on" : "off";
  markProjectOverride("secret_protection", rule.id);
};
var setDestructiveOverride = (ruleId, active, inheritedEnabled) => {
  if (!projectDraft && active === inheritedEnabled) {
    delete draftPolicy.destructive_command_protection.overrides[ruleId];
    return;
  }
  draftPolicy.destructive_command_protection.overrides[ruleId] = active ? "on" : "off";
  markProjectOverride("destructive_command_protection", ruleId);
};
var groupRules = (rules) => rules.reduce((groups, rule) => {
  const group = groups.find((item) => item.category === rule.category);
  if (group) {
    group.rules.push(rule);
    return groups;
  }
  groups.push({ category: rule.category, rules: [rule] });
  return groups;
}, []);
var renderSecretPatterns = () => {
  if (!state)
    return;
  const loaded = state;
  const query = qs("policy-search").value.trim().toLowerCase();
  const rules = state.secretPatterns.filter((rule) => [rule.category, rule.label, rule.id, rule.description, ...rule.paths ?? []].join(" ").toLowerCase().includes(query));
  const overrides = draftPolicy.secret_protection.overrides;
  const disabled = !draftPolicy.secret_protection.enabled;
  const disabledCount = state.secretPatterns.filter((rule) => !secretRuleIsActive(rule, overrides)).length;
  qs("secret-summary").textContent = disabled ? "Protection disabled. Saved rule settings and deny paths are preserved." : \`\${state.secretPatterns.length - disabledCount} active, \${disabledCount} disabled\`;
  qs("secret-patterns").innerHTML = rules.length === 0 ? '<p class="empty">No secret protections match the search.</p>' : groupRules(rules).map((group) => {
    const expanded = secretGroupExpanded.get(group.category) || searchActive && !searchCollapsedSecretGroups.has(group.category);
    const contentId = \`secret-group-\${group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}\`;
    const allGroupRules = loaded.secretPatterns.filter((rule) => rule.category === group.category);
    const onCount = disabled ? 0 : allGroupRules.filter((rule) => secretRuleIsActive(rule, overrides)).length;
    return \`
      <section class="rule-tier">
        <div class="rule-tier-head">
          <button type="button" class="tier-collapse" data-secret-group-toggle="\${escapeHtml(group.category)}" aria-expanded="\${expanded}" aria-controls="\${contentId}">
            <span class="panel-chevron" aria-hidden="true"></span>
            <span class="tier-label"><strong>\${escapeHtml(group.category)}</strong></span>
            <span class="tier-counts">\${tierCountHtml([
      [onCount, "on"],
      [allGroupRules.length - onCount, "off", "off"]
    ])}</span>
          </button>
          <input type="checkbox" class="tier-switch" data-secret-group-active="\${escapeHtml(group.category)}" \${checkbox(allGroupRules.some((rule) => secretRuleIsActive(rule, overrides)))} \${disabled ? "disabled" : ""} aria-label="\${escapeHtml(\`All \${group.category} protections\`)}">
        </div>
        <div id="\${contentId}" class="tier-content" \${expanded ? "" : "hidden"}>
        <div class="grid">\${group.rules.map((rule) => {
      const active = secretRuleIsActive(rule, overrides);
      const ruleState = active && !disabled ? { label: "Active", className: "state-active" } : { label: "Disabled", className: "state-disabled" };
      const control = \`<input type="checkbox" data-secret-active="\${escapeHtml(rule.id)}" \${checkbox(active)} \${disabled ? "disabled" : ""}>
            <span>
              <strong>\${escapeHtml(rule.label)}</strong>
              <button type="button" class="rule-id" data-rule-activity="\${escapeHtml(rule.id)}" title="Show recent blocks in Activity">\${escapeHtml(rule.id)}</button>
              <small><span class="\${ruleState.className}">\${ruleState.label}</span> \${escapeHtml(rule.description ?? "")}</small>
            </span>\`;
      const chip = projectFieldChip(\`secret_protection.overrides.\${rule.id}\`, true);
      if (!rule.paths) {
        return \`<label class="row \${disabled ? "row-disabled" : ""}">\${control}\${chip}</label>\`;
      }
      return \`<div class="row rule-row \${disabled ? "row-disabled" : ""}">
            <label class="rule-control">\${control}</label>
            <button type="button" class="rule-example-button" data-secret-paths="\${escapeHtml(rule.id)}" aria-label="\${escapeHtml(\`Show protected paths for \${rule.label}\`)}" aria-haspopup="dialog" aria-controls="rule-example-popover">?</button>
            \${chip}
          </div>\`;
    }).join("")}</div>
        </div>
      </section>
    \`;
  }).join("");
};
var presetName = () => safetyLevels[draftPolicy.safety.level][0];
var renderPresetStatus = () => {
  if (!preview)
    return;
  const customized = preview.counts.effectiveCustomizations > 0 || Object.entries(draftPolicy.safety.overrides).some(([key, value]) => value !== SAFETY_LEVEL_CAPABILITIES[draftPolicy.safety.level][key]);
  qs("safety-preset-status").textContent = customized ? \`\${presetName()} · Customized\` : "";
  qs("safety-preset-status").classList.toggle("customized", customized);
};
var renderSafety = () => {
  const environmentSources = preview ? [
    ...new Set(Object.values(preview.capabilities).filter((capability) => capability.source === "environment").flatMap((capability) => capability.sources.filter((source) => source.startsWith("env "))))
  ] : [];
  qs("environment-overrides").hidden = environmentSources.length === 0;
  qs("environment-overrides").textContent = environmentSources.length ? \`Environment-raised protection: \${environmentSources.join(", ")}\` : "";
  qs("safety-level").innerHTML = projectFieldLine("safety.level") + Object.entries(safetyLevels).map(([level, meta]) => \`<label class="row preset-\${level}"><input type="radio" name="safety-level" value="\${level}" \${checkbox(draftPolicy.safety.level === level)}><span><strong>\${meta[0]}</strong><small>\${meta[1]}</small></span></label>\`).join("");
  const inherited = SAFETY_LEVEL_CAPABILITIES[draftPolicy.safety.level];
  qs("safety-overrides").innerHTML = Object.entries(safetyOverrides).map(([key, meta]) => {
    const value = draftPolicy.safety.overrides[key];
    const inheritedText = inherited[key] ? "on" : "off";
    return \`<label class="row safety-override-row"><span><strong>\${meta[0]}</strong><small>\${meta[1]}</small></span><select data-safety-override="\${key}">
      <option value="inherit" \${value === undefined ? "selected" : ""}>Inherit from preset (\${inheritedText})</option>
      <option value="true" \${value === true ? "selected" : ""}>Force on</option>
      <option value="false" \${value === false ? "selected" : ""}>Force off</option>
    </select>\${projectFieldChip(\`safety.overrides.\${key}\`, true)}</label>\`;
  }).join("");
  qs("workflow").innerHTML = \`<label class="row"><input type="checkbox" data-workflow-worktree \${checkbox(draftPolicy.workflow.worktree_mode)}><span><strong>Allow discarding local changes in linked git worktrees</strong><small>Only relaxes linked worktree discard checks.</small></span>\${projectFieldChip("workflow.worktree_mode")}</label>\`;
  renderPresetStatus();
};
var tierForRule = (rule) => {
  if (!rule.activationCapability)
    return "normal";
  return rule.activationCapability === "fail_closed" ? "strict" : "paranoid";
};
var tierMeta = {
  normal: ["Available in every preset", "No additional capability required"],
  strict: ["Strict tier", "Inherits from Fail closed"],
  paranoid: ["Paranoid tier", "Inherits from Paranoid rm or Paranoid interpreters"]
};
var ruleStateText = (rule, effective, capabilities) => {
  const capability = rule.activationCapability;
  if (effective.source === "master_disabled")
    return "Off — destructive-command protection disabled";
  if (effective.source === "rule_override")
    return \`\${effective.enabled ? "On" : "Off"} — user rule override\`;
  if (effective.source === "built_in_default")
    return "On — available in every preset";
  if (effective.source === "environment") {
    const sources = capability ? capabilities[capability]?.sources ?? [] : [];
    const source = [...sources].reverse().find((item) => item.startsWith("env "));
    return \`\${effective.enabled ? "On" : "Off"} — environment\${source ? \`; \${source.slice(4)}\` : ""}\`;
  }
  if (effective.source === "capability_override" && capability) {
    return \`\${effective.enabled ? "On" : "Off"} — capability override; \${safetyOverrides[capability][0]} forced \${effective.enabled ? "on" : "off"}\`;
  }
  if (effective.enabled)
    return \`On — \${presetName()} preset\`;
  return \`Off — \${presetName()} preset; requires \${tierForRule(rule) === "strict" ? "Strict" : "Paranoid"}\`;
};
var showRulePopover = (button, label, title, body) => {
  const popover = qs("rule-example-popover");
  qs("rule-example-label").textContent = label;
  qs("rule-example-title").textContent = title;
  qs("rule-example-command").textContent = body;
  if (!popover.matches(":popover-open"))
    popover.showPopover();
  const buttonRect = button.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const gap = 8;
  const edge = 12;
  const below = buttonRect.bottom + gap;
  const top = below + popoverRect.height <= window.innerHeight - edge ? below : Math.max(edge, buttonRect.top - gap - popoverRect.height);
  const left = Math.min(window.innerWidth - popoverRect.width - edge, Math.max(edge, buttonRect.right - popoverRect.width));
  popover.style.top = \`\${top}px\`;
  popover.style.left = \`\${left}px\`;
};
var openRuleExample = (button) => {
  const rule = state?.destructiveCommandRules.find((item) => item.id === button.dataset.ruleExample);
  if (!rule)
    return;
  showRulePopover(button, "Blocked command example", rule.label, rule.example);
};
var openSecretPaths = (button) => {
  const rule = state?.secretPatterns.find((item) => item.id === button.dataset.secretPaths);
  if (!rule?.paths)
    return;
  showRulePopover(button, "Protected paths", rule.label, rule.paths.join(\`
\`));
};
var renderDestructiveCommands = () => {
  if (!state || !preview)
    return;
  const loaded = state;
  const effectiveState = preview;
  const query = qs("policy-search").value.trim().toLowerCase();
  const matchingRules = state.destructiveCommandRules.filter((rule) => [rule.category, rule.label, rule.id, rule.description, tierMeta[tierForRule(rule)][0]].join(" ").toLowerCase().includes(query));
  qs("destructive-command-summary").textContent = draftPolicy.destructive_command_protection.enabled ? \`\${preview.counts.enabled} active, \${preview.counts.disabled} disabled\` : "Configurable protection disabled. Catastrophic protections remain active; saved rule settings and allow paths are preserved.";
  const enforcedRules = matchingRules.filter((rule) => rule.catastrophic);
  const configurableRules = matchingRules.filter((rule) => !rule.catastrophic);
  const enforcedExpanded = tierExpanded.get("enforced") || searchActive && !searchCollapsedTiers.has("enforced");
  const enforcedSection = enforcedRules.length === 0 ? "" : \`<section class="rule-tier rule-tier-enforced">
        <div class="rule-tier-head">
          <button type="button" class="tier-collapse" data-tier-toggle="enforced" aria-expanded="\${enforcedExpanded}" aria-controls="destructive-tier-enforced">
            <span class="panel-chevron" aria-hidden="true"></span>
            <span class="tier-label"><strong>Always enforced</strong><small>Cannot be disabled by any preset, rule override, or allow path</small></span>
            <span class="tier-counts">\${enforcedRules.length} protection\${enforcedRules.length === 1 ? "" : "s"}</span>
          </button>
        </div>
        <div id="destructive-tier-enforced" class="tier-content" \${enforcedExpanded ? "" : "hidden"}>
          \${groupRules(enforcedRules).map((group) => \`<section class="destructive-command-group">
            <h3>\${escapeHtml(group.category)}</h3>
            <div class="grid">\${group.rules.map((rule) => \`<div class="row rule-row">
                <span class="rule-control">
                  <span>
                    <strong>\${escapeHtml(rule.label)}</strong>
                    <button type="button" class="rule-id" data-rule-activity="\${escapeHtml(rule.id)}" title="Show recent blocks in Activity">\${escapeHtml(rule.id)}</button>
                    <small><span class="state-active">Always enforced</span> \${escapeHtml(rule.description)}</small>
                  </span>
                </span>
                <button type="button" class="rule-example-button" data-rule-example="\${escapeHtml(rule.id)}" aria-label="\${escapeHtml(\`Show blocked example for \${rule.label}\`)}" aria-haspopup="dialog" aria-controls="rule-example-popover">?</button>
              </div>\`).join("")}</div>
          </section>\`).join("")}
        </div>
      </section>\`;
  qs("destructive-command-rules").innerHTML = matchingRules.length === 0 ? '<p class="empty">No built-in protections match the search.</p>' : enforcedSection + Object.keys(tierMeta).map((tier) => {
    const rules = configurableRules.filter((rule) => tierForRule(rule) === tier);
    if (rules.length === 0)
      return "";
    const allTierRules = loaded.destructiveCommandRules.filter((rule) => !rule.catastrophic && tierForRule(rule) === tier);
    const tierStates = allTierRules.flatMap((rule) => effectiveState.rules[rule.id] ?? []);
    const expanded = tierExpanded.get(tier) || searchActive && !searchCollapsedTiers.has(tier);
    const contentId = \`destructive-tier-\${tier}\`;
    return \`<section class="rule-tier rule-tier-\${tier}">
        <div class="rule-tier-head">
          <button type="button" class="tier-collapse" data-tier-toggle="\${tier}" aria-expanded="\${expanded}" aria-controls="\${contentId}">
            <span class="panel-chevron" aria-hidden="true"></span>
            <span class="tier-label"><strong>\${tierMeta[tier][0]}</strong><small>\${tierMeta[tier][1]}</small></span>
            <span class="tier-counts">\${tierCountHtml([
      [tierStates.filter((item) => item.enabled).length, "on"],
      [tierStates.filter((item) => !item.enabled).length, "off", "off"]
    ])}</span>
          </button>
          <input type="checkbox" class="tier-switch" data-destructive-tier-active="\${tier}" \${checkbox(tierStates.some((item) => item.enabled))} \${!draftPolicy.destructive_command_protection.enabled ? "disabled" : ""} aria-label="\${escapeHtml(\`All \${tierMeta[tier][0]} protections\`)}">
        </div>
        <div id="\${contentId}" class="tier-content" \${expanded ? "" : "hidden"}>
          \${groupRules(rules).map((group) => \`<section class="destructive-command-group">
            <h3>\${escapeHtml(group.category)}</h3>
            <div class="grid">\${group.rules.map((rule) => {
      const effective = effectiveState.rules[rule.id];
      if (!effective)
        return "";
      const override = draftPolicy.destructive_command_protection.overrides[rule.id];
      const status = ruleStateText(rule, effective, effectiveState.capabilities);
      const disabled = !draftPolicy.destructive_command_protection.enabled;
      return \`<div class="row rule-row \${disabled ? "row-disabled" : ""}">
                <label class="rule-control">
                  <input type="checkbox" data-destructive-command-active="\${escapeHtml(rule.id)}" \${checkbox(effective.enabled)} \${disabled ? "disabled" : ""} aria-label="\${escapeHtml(\`\${rule.label}: \${status}\`)}">
                  <span>
                    <strong>\${escapeHtml(rule.label)}</strong>
                    <button type="button" class="rule-id" data-rule-activity="\${escapeHtml(rule.id)}" title="Show recent blocks in Activity">\${escapeHtml(rule.id)}</button>
                    <small><span class="\${effective.enabled ? "state-active" : "state-disabled"}">\${escapeHtml(status)}</span> \${escapeHtml(rule.description)}</small>
                  </span>
                </label>
                <button type="button" class="rule-example-button" data-rule-example="\${escapeHtml(rule.id)}" aria-label="\${escapeHtml(\`Show blocked example for \${rule.label}\`)}" aria-haspopup="dialog" aria-controls="rule-example-popover">?</button>
                \${override && !effective.changesInherited ? \`<button type="button" class="inherit-button" data-use-inherited="\${escapeHtml(rule.id)}">Use inherited setting</button>\` : ""}
                \${projectFieldChip(\`destructive_command_protection.overrides.\${rule.id}\`, true)}
              </div>\`;
    }).join("")}</div>
          </section>\`).join("")}
        </div>
      </section>\`;
  }).join("");
};
var refreshPolicyPreview = async () => {
  const requestId = ++previewRequestId;
  const result = await requestPolicyPreview(effectivePreviewPolicy(collectFormPolicy(), projectDraft?.baseline ?? null));
  if (requestId !== previewRequestId)
    return false;
  if (!result.ok || !result.data?.preview) {
    setAppStatus("Preview failed", "error");
    setDetailStatus(\`Error: \${errorText(result)}\`, "error");
    return false;
  }
  preview = result.data.preview;
  renderProtectionCard();
  renderSafety();
  renderDestructiveCommands();
  runCommandTest();
  return true;
};
var testerRequestId = 0;
var runCommandTest = async () => {
  const command = qs("tester-input").value.trim();
  if (!command) {
    qs("tester-result").hidden = true;
    return;
  }
  const requestId = ++testerRequestId;
  const result = await requestJson("/api/policy/explain", {
    method: "POST",
    body: JSON.stringify({
      command,
      policy: effectivePreviewPolicy(collectFormPolicy(), projectDraft?.baseline ?? null)
    })
  });
  if (requestId !== testerRequestId)
    return;
  const el = qs("tester-result");
  el.hidden = false;
  if (!result.ok) {
    el.className = "status error";
    el.textContent = \`Could not evaluate: \${errorText(result)}\`;
    return;
  }
  if (result.data.result === "allowed") {
    el.className = "status ok";
    el.innerHTML = \`Allowed — no rule blocks this command under the current draft policy. <button type="button" class="feed-toggle" data-create-rule="\${escapeHtml(command)}">Create a rule for this</button>\`;
    return;
  }
  const ruleId = result.data.customRule?.id ?? result.data.ruleId;
  const ruleIdHtml = result.data.customRule ? \`<button type="button" class="rule-id" data-jump-custom-rule="\${escapeHtml(ruleId)}" title="Show this rule in Rules">\${escapeHtml(ruleId)}</button>\` : \`<code class="rule-id">\${escapeHtml(ruleId)}</code>\`;
  const segment = result.data.segment && result.data.segment !== command ? \`<div class="tester-segment">Segment: <code>\${escapeHtml(result.data.segment)}</code></div>\` : "";
  el.className = "status error";
  el.innerHTML = \`Blocked\${ruleId ? \` by \${ruleIdHtml}\` : ""} — \${escapeHtml(result.data.reason || "")}\${segment}\`;
};
function render() {
  if (!state)
    return;
  draftPolicy = clonePolicy(state.policy);
  preview = state.preview;
  knownRuleIds = new Set([...state.destructiveCommandRules, ...state.secretPatterns].map((rule) => rule.id));
  dirty = false;
  qs("policy-savebar").hidden = true;
  qs("dirty-chip").hidden = true;
  qs("policy-path").textContent = state.path + (state.exists ? "" : " (not created yet)");
  const projectPolicy = state.projectPolicy;
  qs("project-policy-row").hidden = !projectPolicy;
  qs("project-policy-path").textContent = projectPolicy?.path ?? "";
  qs("project-policy-notice").hidden = !projectPolicy || projectPolicy.weakenings.length === 0;
  qs("project-policy-notice").textContent = projectPolicy ? ["Merged on top of this file:", ...projectPolicy.weakenings].join(\`
\`) : "";
  qs("app-version").textContent = state.version;
  renderSafety();
  qs("destructive-command").innerHTML = '<label class="row master"><input type="checkbox" data-destructive-command-enabled ' + checkbox(state.policy.destructive_command_protection.enabled) + '><span><strong>Destructive command protection</strong><small>Block configurable destructive git, filesystem, and execution patterns. Catastrophic and custom rules remain active when disabled.</small></span><span class="master-badge">' + (state.policy.destructive_command_protection.enabled ? "On" : "Off") + '</span><span class="project-chip-slot" id="destructive-enabled-chip"></span></label>' + '<div id="destructive-command-rules"></div>' + '<section class="rule-tier">' + '<button type="button" class="rule-tier-head" aria-expanded="false" aria-controls="allow-paths-content"><span class="panel-chevron" aria-hidden="true"></span><span class="tier-label"><strong id="allow-paths-label">Allow paths</strong><small>Recursive deletes targeting these paths are not blocked, like /tmp. The home directory, or any path containing it, is rejected.</small></span><span class="tier-counts" id="allow-paths-count"></span></button>' + '<div class="tier-content paths-content" id="allow-paths-content" hidden>' + '<p class="muted">Use an absolute path or a ~/ path. Paste multiple lines to add several paths at once.</p>' + '<div class="paths-add"><input type="text" id="allow-paths-input" data-path-input="allow-paths" autocomplete="off" spellcheck="false" placeholder="/absolute/path or ~/path" aria-labelledby="allow-paths-label"><button type="button" class="icon-button" id="allow-paths-add-button" data-path-add="allow-paths" aria-label="Add allow path">' + pathListIcons.add + "</button></div>" + '<p class="paths-hint" id="allow-paths-hint" hidden></p>' + '<span class="project-chip-slot" id="allow-paths-chip"></span>' + '<ul class="paths-list" id="allow-paths-list"></ul>' + "</div></section>";
  qs("secret").innerHTML = '<label class="row master"><input type="checkbox" id="secret-enabled" ' + checkbox(state.policy.secret_protection.enabled) + '><span><strong>Secret protection</strong><small>Block default sensitive paths, coding CLI credential locations, and configured deny paths.</small></span><span class="master-badge">' + (state.policy.secret_protection.enabled ? "On" : "Off") + '</span><span class="project-chip-slot" id="secret-enabled-chip"></span></label>' + '<div id="secret-patterns"></div>' + '<section class="rule-tier">' + '<button type="button" class="rule-tier-head" aria-expanded="false" aria-controls="deny-paths-content"><span class="panel-chevron" aria-hidden="true"></span><span class="tier-label"><strong id="deny-paths-label">Deny paths</strong><small>Configured paths and everything inside them are blocked while Secret protection is on.</small></span><span class="tier-counts" id="deny-paths-count"></span></button>' + '<div class="tier-content paths-content" id="deny-paths-content" hidden>' + '<p class="muted">Paste multiple lines to add several paths at once.</p>' + '<div class="paths-add"><input type="text" id="deny-paths-input" data-path-input="deny-paths" autocomplete="off" spellcheck="false" placeholder="path/to/protect" aria-labelledby="deny-paths-label"><button type="button" class="icon-button" id="deny-paths-add-button" data-path-add="deny-paths" aria-label="Add deny path">' + pathListIcons.add + "</button></div>" + '<p class="paths-hint" id="deny-paths-hint" hidden></p>' + '<span class="project-chip-slot" id="deny-paths-chip"></span>' + '<ul class="paths-list" id="deny-paths-list"></ul>' + "</div></section>" + '<section class="rule-tier">' + '<button type="button" class="rule-tier-head" aria-expanded="false" aria-controls="secret-allow-paths-content"><span class="panel-chevron" aria-hidden="true"></span><span class="tier-label"><strong id="secret-allow-paths-label">Allow paths</strong><small>Exact files, subtrees, or one file name under a folder like ~/code/**/.env.local are exempt from pattern rules. Entries covering the home directory are rejected. Deny paths and coding CLI protections still apply.</small></span><span class="tier-counts" id="secret-allow-paths-count"></span></button>' + '<div class="tier-content paths-content" id="secret-allow-paths-content" hidden>' + '<p class="muted">Paste multiple lines to add several paths at once.</p>' + '<div class="paths-add"><input type="text" id="secret-allow-paths-input" data-path-input="secret-allow-paths" autocomplete="off" spellcheck="false" placeholder="~/code/**/.env.local or ~/project/fixtures" aria-labelledby="secret-allow-paths-label"><button type="button" class="icon-button" id="secret-allow-paths-add-button" data-path-add="secret-allow-paths" aria-label="Add allow path">' + pathListIcons.add + "</button></div>" + '<p class="paths-hint" id="secret-allow-paths-hint" hidden></p>' + '<span class="project-chip-slot" id="secret-allow-paths-chip"></span>' + '<ul class="paths-list" id="secret-allow-paths-list"></ul>' + "</div></section>";
  qs("raw").value = state.errors.length ? state.raw : formatPolicy(draftPolicy);
  qs("policy-search").value = "";
  syncSearchState();
  renderDestructiveCommands();
  renderSecretPatterns();
  pathLists["deny-paths"].render();
  pathLists["secret-allow-paths"].render();
  pathLists["allow-paths"].render();
  syncProjectChips();
  updateRawSource();
  renderRetention(state);
  qs("recovery").hidden = state.errors.length === 0;
  updateActions();
  renderProtectionCard();
  if (state.errors.length) {
    if (currentView() !== "policy")
      location.hash = "policy";
    setAppStatus("Repair required", "error");
    setDetailStatus(\`Error: \${state.errors.join(\`
\`)}\`, "error");
    return;
  }
  setAppStatus("");
  setDetailStatus("");
}
var restoreDraft = () => {
  if (!state || state.errors.length)
    return;
  const stored = sessionStorage.getItem("cc-safety-net-draft");
  if (!stored)
    return;
  const parsed = (() => {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  })();
  const isRecordField = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
  const isOptionalPathList = (value) => value === undefined || Array.isArray(value) && value.every((item) => typeof item === "string");
  const isPolicyShape = isRecordField(parsed) && isRecordField(parsed.safety) && typeof parsed.safety.level === "string" && Object.hasOwn(safetyLevels, parsed.safety.level) && isRecordField(parsed.safety.overrides) && isRecordField(parsed.workflow) && isRecordField(parsed.destructive_command_protection) && isRecordField(parsed.destructive_command_protection.overrides) && isOptionalPathList(parsed.destructive_command_protection.allow_paths) && isRecordField(parsed.secret_protection) && isRecordField(parsed.secret_protection.overrides) && isOptionalPathList(parsed.secret_protection.deny_paths) && isOptionalPathList(parsed.secret_protection.allow_paths) && isRecordField(parsed.audit);
  if (!isPolicyShape || stored === JSON.stringify(state.policy)) {
    sessionStorage.removeItem("cc-safety-net-draft");
    return;
  }
  const draft = parsed;
  draft.destructive_command_protection.allow_paths ??= [];
  draft.secret_protection.deny_paths ??= [];
  draft.secret_protection.allow_paths ??= [];
  draftPolicy = draft;
  renderPolicySections();
  refreshPolicyPreview();
  setAppStatus("Restored unsaved draft", "ok");
};
function renderPolicySections() {
  const masterToggle = document.querySelector("[data-destructive-command-enabled]");
  if (masterToggle)
    masterToggle.checked = draftPolicy.destructive_command_protection.enabled;
  qs("secret-enabled").checked = draftPolicy.secret_protection.enabled;
  syncMasterBadges();
  renderSafety();
  renderDestructiveCommands();
  renderSecretPatterns();
  pathLists["deny-paths"].render();
  pathLists["secret-allow-paths"].render();
  pathLists["allow-paths"].render();
  syncProjectChips();
  syncRawFromForm();
  updateDirtyStatus();
}
async function load() {
  const result = await requestJson("/api/policy");
  if (!result.ok || !result.data) {
    setAppStatus("Load failed", "error");
    setDetailStatus(\`Error: Could not load policy: \${errorText(result)}\`, "error");
    return false;
  }
  state = result.data;
  render();
  restoreDraft();
  return true;
}
var targetInput = (event) => event.target instanceof HTMLInputElement ? event.target : null;
var targetElement = (event) => event.target instanceof Element ? event.target : null;
document.addEventListener("input", (event) => {
  const input = targetInput(event);
  if (!input)
    return;
  if (input.id === "policy-search") {
    syncSearchState();
    renderDestructiveCommands();
    renderSecretPatterns();
    return;
  }
  if (input.id === "activity-search" && activity) {
    if (clearCommandFilter())
      renderActivityControls();
    activityFilters.query = input.value.trim().toLowerCase();
    clearTimeout(activityQueryTimer);
    activityQueryTimer = setTimeout(renderActivityFeed, 120);
  }
});
document.addEventListener("keydown", (event) => {
  const input = targetInput(event);
  if (!input)
    return;
  if (input.id === "tester-input" && event.key === "Enter") {
    event.preventDefault();
    runCommandTest();
    return;
  }
  const list = pathListFor(input.dataset.pathInput);
  if (!list || event.key !== "Enter")
    return;
  event.preventDefault();
  list.add(input.value);
});
document.addEventListener("paste", (event) => {
  const input = targetInput(event);
  if (!input)
    return;
  const list = pathListFor(input.dataset.pathInput);
  if (!list)
    return;
  const text = event.clipboardData?.getData("text") ?? "";
  if (!text.includes(\`
\`))
    return;
  event.preventDefault();
  list.add(\`\${input.value}
\${text}\`);
});
var writePolicy = async (path, body, failureStatus) => {
  const result = await requestJson(path, { method: "POST", body });
  if (isWriteSuccess(result))
    return result;
  setAppStatus(failureStatus, "error");
  setDetailStatus(\`Error: \${errorText(result)}\`, "error");
  return null;
};
var reloadAfterWrite = async () => {
  sessionStorage.removeItem("cc-safety-net-draft");
  if (!await load())
    return false;
  dirty = false;
  setDetailStatus("");
  return true;
};
var setProjectDraftDiagnostics = (messages) => {
  qs("project-draft-diagnostics").textContent = messages.join(\`
\`);
  qs("project-draft-diagnostics").hidden = messages.length === 0;
};
var renderProjectDraftBar = () => {
  qs("project-draft-enter").hidden = projectDraft !== null;
  qs("project-draft-bar").hidden = projectDraft === null;
  qs("save").textContent = projectDraft ? "Review & apply" : "Save";
  if (!projectDraft)
    return;
  qs("project-draft-path").textContent = projectDraft.path;
  qs("project-draft-change").hidden = !projectDraft.canPickDirectory;
};
var exitProjectDraft = () => {
  projectDraft = null;
  markedFields = new Set;
  setProjectDraftDiagnostics([]);
  if (state)
    draftPolicy = clonePolicy(state.policy);
  renderProjectDraftBar();
  renderPolicySections();
};
var ingestProjectState = async (okStatus) => {
  const result = await requestJson("/api/policy/project");
  if (!result.ok || !result.data) {
    setAppStatus("Project draft unavailable", "error");
    setDetailStatus(\`Error: \${errorText(result)}\`, "error");
    return false;
  }
  const seeded = seedProjectDraft(result.data);
  if (!seeded) {
    exitProjectDraft();
    await load();
    setAppStatus("Repair required", "error");
    setDetailStatus([
      "Error: repair your user policy before drafting a project policy.",
      ...Array.isArray(result.data.userPolicyDiagnostics) ? result.data.userPolicyDiagnostics : []
    ].join(\`
\`), "error");
    return false;
  }
  projectDraft = {
    path: result.data.path,
    revision: result.data.revision,
    canPickDirectory: result.data.canPickDirectory === true,
    baseline: seeded.baseline,
    snapshot: seeded.snapshot
  };
  markedFields = seeded.marked;
  draftPolicy = seeded.policy;
  setProjectDraftDiagnostics(Array.isArray(result.data.projectionDiagnostics) ? result.data.projectionDiagnostics : []);
  renderProjectDraftBar();
  renderPolicySections();
  refreshPolicyPreview();
  setAppStatus(okStatus, "ok");
  return true;
};
var enterProjectDraft = async () => {
  if (!state) {
    setAppStatus("Load failed", "error");
    setDetailStatus("Error: Policy is not loaded yet. Reload the page.", "error");
    return;
  }
  if (state.errors.length) {
    setAppStatus("Repair required", "error");
    setDetailStatus("Error: repair your user policy before drafting a project policy.", "error");
    return;
  }
  if (dirty) {
    if (!await confirmDialog({
      title: "Discard unsaved policy changes?",
      body: "A project draft starts from your saved user policy. Save your changes first, or discard them here.",
      confirmLabel: "Discard changes",
      confirmClass: ""
    }))
      return;
    sessionStorage.removeItem("cc-safety-net-draft");
    if (!await load())
      return;
  }
  await ingestProjectState("Drafting a project policy.");
};
var confirmDiscardProjectDraft = async (body) => !dirty || await confirmDialog({
  title: "Discard this project draft?",
  body,
  confirmLabel: "Discard draft",
  confirmClass: ""
});
var changeProjectDirectory = async () => {
  if (!await confirmDiscardProjectDraft("Switching projects discards this draft."))
    return;
  const result = await requestJson("/api/policy/project/choose-directory", { method: "POST" });
  if (!result.ok) {
    setAppStatus("Could not open the folder picker", "error");
    setDetailStatus(\`Error: \${errorText(result)}\`, "error");
    return;
  }
  if (result.data.error) {
    setAppStatus(result.data.error, "error");
    return;
  }
  if (result.data.cancelled)
    return;
  await ingestProjectState("Drafting a project policy.");
};
var leaveProjectDraft = async () => {
  if (!await confirmDiscardProjectDraft("The fields you marked are not written anywhere yet."))
    return;
  exitProjectDraft();
  if (await load())
    setAppStatus("Left the project draft.", "ok");
};
var discardProjectDraft = async () => {
  const draft = projectDraft;
  if (!draft)
    return;
  if (!await confirmDialog({
    title: "Discard changes to this draft?",
    body: "The draft returns to the fields this project already sets.",
    confirmLabel: "Discard changes",
    confirmClass: ""
  }))
    return;
  const snapshot = JSON.parse(draft.snapshot);
  markedFields = new Set(projectMarkedFields(snapshot));
  draftPolicy = overlayProjectProposal(draft.baseline, snapshot);
  renderPolicySections();
  refreshPolicyPreview();
  setAppStatus("Changes discarded.", "ok");
};
var handleStaleProjectDraft = async () => {
  if (!await ingestProjectState("Project draft reloaded."))
    return;
  setAppStatus("Project target changed", "error");
  setDetailStatus("Error: the project directory changed, so this draft was reloaded for the new target. Review it again before applying.", "error");
};
var projectDiffHtml = (data) => {
  const rows = Array.isArray(data.rows) ? data.rows : [];
  const warnings = [
    ...data.existingFileDiagnostics?.length ? ["The existing project policy file is invalid and will be replaced."] : [],
    ...data.weakenings ?? []
  ];
  const table = rows.length === 0 ? '<p class="empty">No change to the effective policy.</p>' : \`<table class="diff-table"><thead><tr><th>Setting</th><th>Now</th><th>After</th></tr></thead><tbody>\${rows.map((row) => \`<tr><td><code>\${escapeHtml(row.field)}</code></td><td class="diff-before">\${escapeHtml(row.before ?? "(unset)")}</td><td class="diff-after">\${escapeHtml(row.after ?? "(unset)")}</td></tr>\`).join("")}</tbody></table>\`;
  return table + warnings.map((text) => \`<p class="diff-warning">\${escapeHtml(text)}</p>\`).join("");
};
var reviewProjectDraft = async () => {
  const draft = projectDraft;
  if (!draft)
    return;
  const proposal = collectProjectProposal(markedFields, draftPolicy);
  const serialized = JSON.stringify(proposal);
  const body = JSON.stringify({ revision: draft.revision, proposal });
  const diff = await requestJson("/api/policy/project/diff", { method: "POST", body });
  if (projectDraft !== draft)
    return;
  if (diff.status === 409) {
    await handleStaleProjectDraft();
    return;
  }
  if (!diff.ok) {
    setAppStatus("Review failed", "error");
    setDetailStatus(\`Error: \${errorText(diff)}\`, "error");
    return;
  }
  if (JSON.stringify(collectProjectProposal(markedFields, draftPolicy)) !== serialized) {
    setAppStatus("Review again", "error");
    setDetailStatus("Error: the draft changed while the review was loading. Review it again.", "error");
    return;
  }
  if (!await confirmDialog({
    title: "Apply this project policy?",
    body: "Everyone who works in this project gets these changes on top of their own user policy.",
    detail: draft.path,
    rowsHtml: projectDiffHtml(diff.data),
    confirmLabel: "Apply project policy",
    confirmClass: "primary"
  }))
    return;
  await runExclusive("Applying...", async () => {
    const applied = await requestJson("/api/policy/project/apply", { method: "POST", body });
    if (applied.status === 409) {
      await handleStaleProjectDraft();
      return;
    }
    if (!isWriteSuccess(applied)) {
      setAppStatus("Apply failed", "error");
      setDetailStatus(\`Error: \${errorText(applied)}\`, "error");
      return;
    }
    const path = applied.data.path;
    exitProjectDraft();
    if (await load())
      setAppStatus(\`Applied \${path}.\`, "ok");
  });
};
var saveRetentionDays = async (days) => {
  const saved = state;
  if (!saved)
    return;
  const current = saved.policy.audit.retention_days;
  if (!Number.isInteger(days) || days < MIN_AUDIT_RETENTION_DAYS || days > MAX_AUDIT_RETENTION_DAYS) {
    qs("retention-days").value = String(current);
    setAppStatus("Retention unchanged", "error");
    setDetailStatus(\`Error: retention must be a whole number of days from \${MIN_AUDIT_RETENTION_DAYS} to \${MAX_AUDIT_RETENTION_DAYS}.\`, "error");
    return;
  }
  if (days === current)
    return;
  if (projectDraft) {
    qs("retention-days").value = String(current);
    setAppStatus("Retention unchanged", "error");
    setDetailStatus("Error: exit or apply your project draft first.", "error");
    return;
  }
  if (dirty) {
    qs("retention-days").value = String(current);
    setAppStatus("Retention unchanged", "error");
    setDetailStatus("Error: save or discard your unsaved Policy changes first.", "error");
    return;
  }
  if (days < current && !await confirmDialog({
    title: \`Shorten retention to \${dayCount(days)}?\`,
    body: \`Audit entries older than \${dayCount(days)} are deleted on the next sweep and cannot be recovered. The Activity tab will only look back \${dayCount(days)}.\`,
    detail: overview?.logsDir ?? "",
    confirmLabel: "Shorten",
    confirmClass: "danger"
  })) {
    qs("retention-days").value = String(current);
    return;
  }
  await runExclusive("Saving...", async () => {
    const policy = clonePolicy(saved.policy);
    policy.audit.retention_days = days;
    if (!await writePolicy("/api/policy", JSON.stringify(policy), "Save failed")) {
      qs("retention-days").value = String(current);
      return;
    }
    if (!await load())
      return;
    activityFilters.days = Math.min(activityFilters.days, days);
    await Promise.all([loadOverview(), loadActivity()]);
    setAppStatus(\`Retention set to \${dayCount(days)}.\`, "ok");
    setDetailStatus("");
  });
};
document.addEventListener("change", (event) => {
  const control = event.target;
  if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement))
    return;
  if (control.id === "activity-days") {
    activityFilters.days = Number(control.value);
    loadActivity();
    return;
  }
  if (control.id === "retention-days") {
    saveRetentionDays(Number(control.value));
    return;
  }
  if (control.name === "safety-level") {
    draftPolicy.safety.level = control.value;
    markProjectField("safety.level");
    renderSafety();
    syncRawFromForm();
    updateDirtyStatus();
    refreshPolicyPreview();
    return;
  }
  if (control.dataset?.safetyOverride) {
    if (control.value === "inherit" && !projectDraft)
      delete draftPolicy.safety.overrides[control.dataset.safetyOverride];
    if (control.value === "true")
      draftPolicy.safety.overrides[control.dataset.safetyOverride] = true;
    if (control.value === "false")
      draftPolicy.safety.overrides[control.dataset.safetyOverride] = false;
    if (control.value === "inherit")
      unmarkProjectField(\`safety.overrides.\${control.dataset.safetyOverride}\`);
    if (control.value !== "inherit")
      markProjectField(\`safety.overrides.\${control.dataset.safetyOverride}\`);
    syncRawFromForm();
    updateDirtyStatus();
    refreshPolicyPreview();
    return;
  }
  const input = control instanceof HTMLInputElement ? control : null;
  if (!input)
    return;
  if ("workflowWorktree" in input.dataset) {
    draftPolicy.workflow.worktree_mode = input.checked;
    markProjectField("workflow.worktree_mode");
    syncRawFromForm();
    updateDirtyStatus();
    return;
  }
  if ("destructiveCommandEnabled" in input.dataset) {
    (async () => {
      if (!input.checked && !await confirmProtectionDisable({
        title: "Disable destructive command protection?",
        body: "Built-in destructive git, filesystem, and execution protections will stop blocking commands until you turn this back on.",
        detail: "Custom rules remain active."
      })) {
        input.checked = true;
        return;
      }
      draftPolicy.destructive_command_protection.enabled = input.checked;
      markProjectField("destructive_command_protection.enabled");
      syncMasterBadges();
      pathLists["allow-paths"].render();
      syncRawFromForm();
      updateDirtyStatus();
      refreshPolicyPreview();
    })();
    return;
  }
  if (input.dataset?.destructiveTierActive) {
    const effectiveState = preview;
    if (!effectiveState)
      return;
    state?.destructiveCommandRules.filter((rule) => !rule.catastrophic && tierForRule(rule) === input.dataset.destructiveTierActive).forEach((rule) => {
      setDestructiveOverride(rule.id, input.checked, effectiveState.rules[rule.id]?.inheritedEnabled);
    });
    syncRawFromForm();
    updateDirtyStatus();
    refreshPolicyPreview();
    return;
  }
  if (input.dataset?.destructiveCommandActive) {
    const ruleId = input.dataset.destructiveCommandActive;
    setDestructiveOverride(ruleId, input.checked, preview?.rules[ruleId]?.inheritedEnabled);
    syncRawFromForm();
    updateDirtyStatus();
    refreshPolicyPreview();
    return;
  }
  if (input.dataset?.secretGroupActive) {
    state?.secretPatterns.filter((rule) => rule.category === input.dataset.secretGroupActive).forEach((rule) => {
      setSecretOverride(rule, input.checked);
    });
    renderSecretPatterns();
    syncRawFromForm();
    updateDirtyStatus();
    return;
  }
  if (input.dataset?.secretActive) {
    const rule = state?.secretPatterns.find((item) => item.id === input.dataset.secretActive);
    if (!rule)
      return;
    setSecretOverride(rule, input.checked);
    renderSecretPatterns();
    syncRawFromForm();
    updateDirtyStatus();
    return;
  }
  if (input.id === "secret-enabled") {
    (async () => {
      if (!input.checked && !await confirmProtectionDisable({
        title: "Disable secret protection?",
        body: "Default sensitive paths, coding CLI credential locations, and deny paths will stop blocking access until you turn this back on."
      })) {
        input.checked = true;
        return;
      }
      draftPolicy.secret_protection.enabled = input.checked;
      markProjectField("secret_protection.enabled");
      syncMasterBadges();
      renderSecretPatterns();
      pathLists["deny-paths"].render();
      pathLists["secret-allow-paths"].render();
      syncRawFromForm();
      updateDirtyStatus();
    })();
  }
});
document.addEventListener("click", (event) => {
  const target = targetElement(event);
  if (!target)
    return;
  if (target.closest("#tester-run")) {
    runCommandTest();
    return;
  }
  if (target.closest("#project-draft-enter")) {
    enterProjectDraft();
    return;
  }
  if (target.closest("#project-draft-change")) {
    changeProjectDirectory();
    return;
  }
  if (target.closest("#project-draft-exit")) {
    leaveProjectDraft();
    return;
  }
  const unmarkButton = target.closest("[data-unmark-field]");
  if (unmarkButton) {
    unmarkProjectField(unmarkButton.dataset.unmarkField ?? "");
    return;
  }
  const createRule = target.closest("[data-create-rule]");
  if (createRule) {
    openRuleComposer(createRule.dataset.createRule ?? "");
    return;
  }
  const feedToggle = target.closest("[data-feed-toggle]");
  if (feedToggle) {
    const command = feedToggle.previousElementSibling;
    if (!command)
      return;
    const expanded = command.classList.toggle("expanded");
    feedToggle.setAttribute("aria-expanded", String(expanded));
    feedToggle.textContent = expanded ? "Show less" : "Show more";
    return;
  }
  const feedCopy = target.closest("[data-log-copy]");
  if (feedCopy) {
    copyFeedEntry(feedCopy);
    return;
  }
  const feedReport = target.closest("[data-report-fp]");
  if (feedReport) {
    openReportDialog(feedReport);
    return;
  }
  const blockFuture = target.closest("[data-block-future]");
  if (blockFuture) {
    const entry = renderedFeedEntries[Number(blockFuture.dataset.blockFuture)];
    if (entry?.segment || entry?.command)
      openRuleComposer(entry.segment || entry.command || "");
    return;
  }
  const topRule = target.closest(".top-rule");
  if (topRule) {
    const ruleId = topRule.dataset.ruleId ?? "";
    (ruleId.startsWith("custom.") ? jumpToRulesRule : jumpToActivityRule)(ruleId);
    return;
  }
  const ruleActivity = target.closest("[data-rule-activity]");
  if (ruleActivity) {
    jumpToActivityRule(ruleActivity.dataset.ruleActivity ?? "");
    return;
  }
  const jumpRule = target.closest("[data-jump-rule]");
  if (jumpRule) {
    qs("policy-search").value = jumpRule.dataset.jumpRule ?? "";
    syncSearchState();
    renderDestructiveCommands();
    renderSecretPatterns();
    location.hash = "policy";
    return;
  }
  const jumpCustom = target.closest("[data-jump-custom-rule]");
  if (jumpCustom) {
    jumpToRulesRule(jumpCustom.dataset.jumpCustomRule ?? "");
    return;
  }
  const topCommand = target.closest(".top-command");
  if (topCommand) {
    activityFilters.command = topCommand.dataset.command ?? "";
    activityFilters.decision = "deny";
    activityFilters.query = "";
    qs("activity-search").value = "";
    if (activity) {
      renderActivityControls();
      renderActivityFeed();
    }
    location.hash = "activity";
    return;
  }
  if (target.closest("[data-clear-command]")) {
    clearCommandFilter();
    renderActivityControls();
    renderActivityFeed();
    return;
  }
  if (target.closest("#guard-errors")) {
    clearCommandFilter();
    activityFilters.decision = "error";
    if (activity) {
      renderActivityControls();
      renderActivityFeed();
    }
    location.hash = "activity";
    return;
  }
  const chip = target.closest("[data-activity-chip]");
  if (chip && activity) {
    clearCommandFilter();
    activityFilters[chip.dataset.activityChip] = chip.dataset.chipValue ?? "";
    renderActivityControls();
    renderActivityFeed();
    return;
  }
  if (target.closest("#activity-refresh")) {
    refreshActivity();
    return;
  }
  if (target.closest("#integrations-refresh")) {
    refreshIntegrations();
    return;
  }
  if (target.closest("#rules-refresh")) {
    refreshRules();
    return;
  }
  const scopeChip = target.closest("[data-rules-scope]");
  if (scopeChip) {
    setRulesScope(scopeChip.dataset.rulesScope ?? "");
    return;
  }
  const exampleChip = target.closest("[data-rules-example]");
  if (exampleChip) {
    qs("rules-composer-input").value = exampleChip.dataset.rulesExample ?? "";
    return;
  }
  if (target.closest("#rules-choose-directory")) {
    chooseProjectDirectory();
    return;
  }
  if (target.closest("#rules-copy-prompt")) {
    copyRulePrompt();
    return;
  }
  const integrationButton = target.closest("[data-integration-action]");
  if (integrationButton) {
    runIntegrationAction(integrationButton);
    return;
  }
  const ruleExampleButton = target.closest("[data-rule-example]");
  if (ruleExampleButton) {
    openRuleExample(ruleExampleButton);
    return;
  }
  const secretPathsButton = target.closest("[data-secret-paths]");
  if (secretPathsButton) {
    openSecretPaths(secretPathsButton);
    return;
  }
  const tierButton = target.closest("[data-tier-toggle]");
  if (tierButton) {
    const tier = tierButton.dataset.tierToggle ?? "";
    const expanded = tierButton.getAttribute("aria-expanded") === "true";
    tierExpanded.set(tier, !expanded);
    if (searchActive && expanded)
      searchCollapsedTiers.add(tier);
    if (!expanded)
      searchCollapsedTiers.delete(tier);
    renderDestructiveCommands();
    return;
  }
  const secretGroupButton = target.closest("[data-secret-group-toggle]");
  if (secretGroupButton) {
    const category = secretGroupButton.dataset.secretGroupToggle ?? "";
    const expanded = secretGroupButton.getAttribute("aria-expanded") === "true";
    secretGroupExpanded.set(category, !expanded);
    if (searchActive && expanded)
      searchCollapsedSecretGroups.add(category);
    if (!expanded)
      searchCollapsedSecretGroups.delete(category);
    renderSecretPatterns();
    return;
  }
  if (target.closest("[data-secret-group-active], [data-destructive-tier-active]"))
    return;
  const button = target.closest(".panel-toggle, .rule-tier-head");
  if (button) {
    togglePanel(button);
    return;
  }
  const inheritedButton = target.closest("[data-use-inherited]");
  if (inheritedButton) {
    const ruleId = inheritedButton.dataset.useInherited ?? "";
    if (projectDraft) {
      unmarkProjectField(\`destructive_command_protection.overrides.\${ruleId}\`);
      return;
    }
    delete draftPolicy.destructive_command_protection.overrides[ruleId];
    syncRawFromForm();
    updateDirtyStatus();
    refreshPolicyPreview();
    return;
  }
  if (target.closest("#reset-rule-customizations")) {
    if (Object.keys(draftPolicy.destructive_command_protection.overrides).length === 0) {
      setAppStatus("No customizations to reset", "ok");
      return;
    }
    (async () => {
      if (!await confirmDialog({
        title: "Restore defaults?",
        body: "All built-in destructive-command rules will return to their inherited preset settings.",
        confirmLabel: "Restore defaults"
      }))
        return;
      clearProjectOverrideMarks("destructive_command_protection");
      if (projectDraft) {
        rebuildProjectDisplay();
        return;
      }
      draftPolicy.destructive_command_protection.overrides = {};
      syncRawFromForm();
      updateDirtyStatus();
      refreshPolicyPreview();
    })();
    return;
  }
  if (target.closest("#reset-secret-customizations")) {
    if (Object.keys(draftPolicy.secret_protection.overrides).length === 0) {
      setAppStatus("No customizations to reset", "ok");
      return;
    }
    (async () => {
      if (!await confirmDialog({
        title: "Restore defaults?",
        body: "All built-in secret rules will return to their inherited preset settings.",
        confirmLabel: "Restore defaults"
      }))
        return;
      clearProjectOverrideMarks("secret_protection");
      if (projectDraft) {
        rebuildProjectDisplay();
        return;
      }
      draftPolicy.secret_protection.overrides = {};
      renderSecretPatterns();
      syncRawFromForm();
      updateDirtyStatus();
      refreshPolicyPreview();
    })();
    return;
  }
  if (target.closest("#discard-changes")) {
    if (projectDraft) {
      discardProjectDraft();
      return;
    }
    (async () => {
      if (!await confirmDialog({
        title: "Discard unsaved changes?",
        body: "All changes since your last save will be reverted.",
        confirmLabel: "Discard changes",
        confirmClass: ""
      }))
        return;
      runExclusive("Discarding...", async () => {
        sessionStorage.removeItem("cc-safety-net-draft");
        if (await load())
          setAppStatus("Changes discarded.", "ok");
      });
    })();
    return;
  }
  const addButton = target.closest("[data-path-add]");
  if (addButton) {
    const list = pathListFor(addButton.dataset.pathAdd);
    if (list)
      list.add(qs(\`\${addButton.dataset.pathAdd}-input\`).value);
    return;
  }
  const removeButton = target.closest("[data-path-remove]");
  if (removeButton)
    pathListFor(removeButton.dataset.pathList)?.remove(Number(removeButton.dataset.pathRemove));
  const starButton = target.closest(".star-cta");
  if (starButton instanceof HTMLButtonElement) {
    starRepo(starButton);
    return;
  }
});
qs("dirty-chip").onclick = () => {
  location.hash = "policy";
};
qs("save").onclick = () => {
  if (!state) {
    setAppStatus("Load failed", "error");
    setDetailStatus("Error: Policy is not loaded yet. Reload the page.", "error");
    return;
  }
  if (state.errors.length) {
    setAppStatus("Repair required", "error");
    setDetailStatus("Error: Repair policy before saving changes.", "error");
    return;
  }
  if (projectDraft) {
    reviewProjectDraft();
    return;
  }
  if (!dirty) {
    setAppStatus("No changes to save", "ok");
    setDetailStatus("");
    return;
  }
  const policy = collectFormPolicy();
  runExclusive("Saving...", async () => {
    const result = await writePolicy("/api/policy", JSON.stringify(policy), "Save failed");
    if (!result)
      return;
    if (await reloadAfterWrite())
      setAppStatus(\`Saved \${result.data.path}.\`, "ok");
  });
};
qs("repair").onclick = async () => {
  if (!state) {
    setAppStatus("Load failed", "error");
    setDetailStatus("Error: Policy is not loaded yet. Reload the page.", "error");
    return;
  }
  if (state.errors.length === 0) {
    setAppStatus("");
    setDetailStatus("");
    return;
  }
  if (!await confirmDialog({
    title: "Repair policy?",
    body: "This will write canonical policy JSON. Valid settings are preserved; invalid fields are discarded. If the JSON cannot be parsed, defaults are restored.",
    detail: state.path,
    confirmLabel: "Repair",
    confirmClass: "primary"
  })) {
    return;
  }
  runExclusive("Repairing...", async () => {
    const result = await writePolicy("/api/repair", "{}", "Repair failed");
    if (!result)
      return;
    if (await reloadAfterWrite())
      setAppStatus(\`Repaired \${result.data.path}.\`, "ok");
  });
};
qs("reset").onclick = async () => {
  if (!state) {
    setAppStatus("Load failed", "error");
    setDetailStatus("Error: Policy is not loaded yet. Reload the page.", "error");
    return;
  }
  if (projectDraft) {
    setAppStatus("Reset unavailable", "error");
    setDetailStatus("Error: exit or apply your project draft first.", "error");
    return;
  }
  if (!await confirmDialog({
    title: "Reset policy?",
    body: "This will restore the default policy JSON at this path.",
    detail: state.path,
    confirmLabel: "Reset policy"
  })) {
    return;
  }
  runExclusive("Resetting...", async () => {
    const result = await writePolicy("/api/reset", "{}", "Reset failed");
    if (!result)
      return;
    if (await reloadAfterWrite())
      setAppStatus(\`Reset \${result.data.path} to defaults.\`, "ok");
  });
};
setRawCopyCopied(false);
qs("raw-copy").onclick = () => {
  copyRawToClipboard();
};
var themeOrder = ["auto", "light", "dark"];
var themeIcons = {
  auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"></rect><path d="M8 20h8M12 16v4"></path></svg>',
  light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"></path></svg>',
  dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg>'
};
var themeLabels = { auto: "Auto", light: "Light", dark: "Dark" };
var applyTheme = (pref) => {
  document.documentElement.style.colorScheme = pref === "auto" ? "light dark" : pref;
  qs("theme-toggle").innerHTML = \`\${themeIcons[pref]}<span>\${themeLabels[pref]}</span>\`;
  qs("theme-toggle").setAttribute("aria-label", \`Color theme: \${themeLabels[pref]}. Click to change.\`);
};
var themePref = themeOrder.includes(localStorage.getItem("cc-safety-net-theme")) ? localStorage.getItem("cc-safety-net-theme") : "auto";
applyTheme(themePref);
qs("theme-toggle").onclick = () => {
  themePref = themeOrder[(themeOrder.indexOf(themePref) + 1) % themeOrder.length] ?? "auto";
  if (themePref === "auto")
    localStorage.removeItem("cc-safety-net-theme");
  else
    localStorage.setItem("cc-safety-net-theme", themePref);
  applyTheme(themePref);
};
window.addEventListener("beforeunload", (event) => {
  if (!dirty)
    return;
  event.preventDefault();
  event.returnValue = "";
});
window.addEventListener("hashchange", applyView);
applyView();
Promise.all([loadIntegrations(), requestJson("/api/health")]).then(([, health]) => renderHealthStrip(health));
load().then((loaded) => {
  if (loaded)
    loadStarContext();
  activityFilters.days = Math.min(activityFilters.days, retentionDays());
  loadOverview();
  loadActivity();
}).catch((error) => {
  setAppStatus("Load failed", "error");
  setDetailStatus(String(error), "error");
});

  </script>
</body>
</html>
`;var Gu='<script id="ccsn-data" type="application/json">';function Bu(P){return Uu.replace(Gu,()=>Gu+JSON.stringify({token:P}).replaceAll("<","\\u003c"))}var bo="kenryu42/cc-safety-net",Gb=`https://github.com/${bo}`,ps=1e4,Bb=7,qb="The project draft directory changed; reload the draft before applying.",Vb="audit settings are user scope only; remove the audit section from a project proposal";async function Ku(P,O={}){let D=gn({label:"gui",booleans:{noOpen:["--no-open"]}},P),j=O.log??console.log,J=O.error??console.error;if(D.errors.length>0){for(let re of D.errors)J(re);return J("Usage: cc-safety-net gui [--no-open]"),1}let Y=await Jb(c,O);if(j(`CC Safety Net policy GUI: ${Y.url}`),!D.flags.noOpen)try{await(O.openBrowser??rw)(Y.url)}catch(re){J(`Failed to open browser: ${re instanceof Error?re.message:String(re)}`),J(`Open this URL manually: ${Y.url}`)}if(O.keepAlive===!1)return await Y.close(),0;return await tw(Y),0}async function Jb(P,O={}){let D=Fb(24).toString("base64url"),j={dir:null,revision:0},J=Mb((ie,de)=>{zb(P,ie,de,D,O,j)});await new Promise((ie,de)=>{J.once("error",de),J.listen(0,"127.0.0.1",()=>{J.off("error",de),ie()})});let re=`http://127.0.0.1:${J.address().port}`;return{origin:re,token:D,url:`${re}/?token=${encodeURIComponent(D)}`,close:()=>nw(J)}}async function zb(P,O,D,j,J,Y){let re=P(),ie=new URL(O.url??"/","http://127.0.0.1");if(O.method==="GET"&&ie.pathname==="/favicon.ico"){D.writeHead(204,{"cache-control":"no-store"}),D.end();return}if(!Xb(O,ie,j)){ln(D,403,{error:"Forbidden"});return}if(O.method==="GET"&&ie.pathname==="/"){ew(D,Bu(j));return}if(O.method==="GET"&&ie.pathname==="/api/policy"){let de=Bd(re,J),fe=E(re,ds(J));ln(D,200,{...de,configState:je(fe),...fe.policyScopes?{projectPolicy:{path:h(J.cwd??process.cwd()),weakenings:fe.policyScopes.weakeningsIgnored?[]:fe.policyScopes.weakenings}}:{},destructiveCommandRules:z,secretPatterns:Qe,version:pn(),preview:de.errors.length>0?null:Le(de.policy,re.env)});return}if(O.method==="POST"&&ie.pathname==="/api/policy/preview"){let de=await ur(O);if(!de.ok){ln(D,de.status,{errors:[de.error]});return}let fe=qd(re,de.value);ln(D,fe.errors.length>0?400:200,fe);return}if(O.method==="POST"&&ie.pathname==="/api/policy/explain"){let de=await ur(O);if(!de.ok){ln(D,de.status,{errors:[de.error]});return}let fe=de.value;if(fe===null||typeof fe.command!=="string"){ln(D,400,{errors:["command must be a string"]});return}let we=sr(fe.policy,re.home);if(we.length>0){ln(D,400,{errors:we});return}ln(D,200,Yb(re,fe.command,fe.policy,J));return}if(O.method==="POST"&&ie.pathname==="/api/policy"){let de=await ur(O);if(!de.ok){ln(D,de.status,{errors:[de.error]});return}let fe=Hn(re,de.value,J);ln(D,fe.errors.length>0?400:200,fe);return}if(O.method==="POST"&&ie.pathname==="/api/reset"){ln(D,200,Hn(re,te,J));return}if(O.method==="POST"&&ie.pathname==="/api/repair"){ln(D,200,Vd(re,J));return}if(O.method==="POST"&&ie.pathname==="/api/policy/project/choose-directory"){let de=await(J.chooseDirectory??cs)();if("path"in de)Y.dir=de.path,Y.revision+=1;ln(D,200,{cancelled:"cancelled"in de,..."error"in de?{error:de.error}:{}});return}if(O.method==="GET"&&ie.pathname==="/api/policy/project"){let de=Wu(Y,J),fe=Yu(re,de,J),we=fe?{projection:{},diagnostics:[fe]}:qu(de,re.home),Ce=ar(re,J);ln(D,200,{path:h(de),revision:Y.revision,baseline:Ce.baseline,userPolicyDiagnostics:Ce.diagnostics,projection:we.projection,projectionDiagnostics:we.diagnostics,canPickDirectory:ls(process.platform,process.env)});return}if(O.method==="POST"&&ie.pathname==="/api/policy/project/diff"){let de=await Vu(re,O,D,Y,J);if(!de)return;let fe=qu(de.dir,re.home),we=ar(re,J).baseline,Ce=ee(we,ue(de.proposal,re.home).policy);ln(D,200,{rows:oo(ee(we,fe.projection).policy,Ce.policy,!1),weakenings:Ce.weakenings,existingFileDiagnostics:fe.diagnostics});return}if(O.method==="POST"&&ie.pathname==="/api/policy/project/apply"){let de=await Vu(re,O,D,Y,J);if(!de)return;let fe=Wb(de.dir,de.proposal,re.home);ln(D,fe.errors.length>0?500:200,fe);return}if(O.method==="GET"&&ie.pathname==="/api/activity"){let de=oe(re,J),fe=Zb(ie.searchParams.get("days"),de);if(fe===null){ln(D,400,{error:`days must be an integer between 1 and ${de}`});return}ln(D,200,ju(re,fe,J.activityLogsDir));return}if(O.method==="POST"&&ie.pathname==="/api/rules/choose-directory"){ln(D,200,await cs());return}if(O.method==="GET"&&ie.pathname==="/api/rules"){let de=Q(re,ds(J)),fe=new Map(de.rules.map((we)=>[we.name,we]));ln(D,200,{projectPath:J.cwd??process.cwd(),canPickDirectory:ls(process.platform,process.env),rulebooks:de.rulebooks.map((we)=>({source:we.source,spec:we.spec,name:we.name,version:we.version,rules:we.rules.flatMap((Ce)=>{let Se=fe.get(Ce);if(!Se)return[];return[{name:Se.name,command:Se.command,subcommand:Se.subcommand,block_args:Se.block_args,reason:Se.reason}]})})),errors:de.errors,warnings:de.warnings});return}if(O.method==="GET"&&ie.pathname==="/api/star/context"){ln(D,200,await(J.fetchStarContext??(()=>cw(re,{logsDir:J.activityLogsDir})))());return}if(O.method==="POST"&&ie.pathname==="/api/star"){let de=await(J.starRepo??ow)();ln(D,200,de.ok?{ok:!0}:{ok:!1,fallbackUrl:Gb});return}if(O.method==="GET"&&ie.pathname==="/api/integrations"){ln(D,200,await(J.fetchIntegrations??(()=>iw(re)))());return}if(O.method==="GET"&&ie.pathname==="/api/health"){ln(D,200,await(J.fetchHealth??aw)());return}if(O.method==="POST"&&(ie.pathname==="/api/install"||ie.pathname==="/api/uninstall")){let de=await ur(O);if(!de.ok){ln(D,de.status,{errors:[de.error]});return}let fe=de.value?.target;if(typeof fe!=="string"||!$n.some((Ce)=>Ce.target===fe)){ln(D,400,{error:"unknown target"});return}let we=ie.pathname==="/api/install"?"install":"uninstall";ln(D,200,await(J.runIntegration??lw)(we,fe));return}ln(D,404,{error:"Not found"})}function ds(P){return{...P,cwd:P.cwd??process.cwd()}}function Wu(P,O){return P.dir??O.cwd??process.cwd()}function Yu(P,O,D){if(!L(P,{...D,cwd:O}))return null;return`${h(O)} is the user policy, not a project policy; choose a project directory, or run the GUI from one`}function qu(P,O){let D=h(P),j=Hb(D)?bt(D):{value:void 0,errors:[]},J=ue(j.value,O);return{projection:J.policy,diagnostics:[...j.errors,...J.diagnostics]}}async function Vu(P,O,D,j,J){let Y=Wu(j,J),re=j.revision,ie=await ur(O);if(!ie.ok)return ln(D,ie.status,{errors:[ie.error]}),null;let de=ie.value;if(typeof de?.revision!=="number")return ln(D,400,{errors:["revision must be a number"]}),null;if(de.revision!==re)return ln(D,409,{errors:[qb]}),null;let fe=Yu(P,Y,J);if(fe)return ln(D,400,{errors:[fe]}),null;let we=Kb(de.proposal,P.home);if(we.length>0)return ln(D,400,{errors:we}),null;return{dir:Y,proposal:de.proposal}}function Kb(P,O){let D=sr(P,O);if(D.length>0)return D;return P?.audit===void 0?[]:[Vb]}function Wb(P,O,D){let j=h(P),J=io(O,C(O,D));try{return g(i(v(P,"project policy"),j),`${JSON.stringify(J,null,2)}
`),{path:j,errors:[]}}catch(Y){return{path:j,errors:[Y instanceof Error?Y.message:String(Y)]}}}function Yb(P,O,D,j){let J=C(D,P.home),Y=E(P,ds(j)),re=_e({rules:Y.policy.rules,transparentWrappers:Y.policy.transparentWrappers,safety:$e(J.safety),worktreeMode:J.workflow.worktree_mode,destructiveCommandProtectionEnabled:J.destructive_command_protection.enabled,destructiveCommandRuleOverrides:J.destructive_command_protection.overrides,destructiveCommandAllowPaths:J.destructive_command_protection.allow_paths,secretProtection:{enabled:J.secret_protection.enabled,disabledRules:Me(J.secret_protection.overrides),denyPaths:J.secret_protection.deny_paths,allowPaths:J.secret_protection.allow_paths}});return Qt(O,{policySnapshot:re,cwd:j.cwd,userConfigDir:j.userConfigDir},P)}function Zb(P,O){if(P===null)return Math.min(Bb,O);let D=Number(P);if(!Number.isInteger(D)||D<1||D>O)return null;return D}function Xb(P,O,D){if(O.searchParams.get("token")!==D)return!1;if(P.method!=="POST")return!0;return P.headers["x-cc-safety-net-token"]===D}var Qb=1048576;async function ur(P){let O=[],D=0;for await(let j of P){let J=j;if(D+=J.byteLength,D>Qb)return{ok:!1,status:413,error:"Request body is too large"};O.push(J)}try{return{ok:!0,value:JSON.parse(Buffer.concat(O).toString("utf-8")||"{}")}}catch(j){return{ok:!1,status:400,error:`Invalid JSON: ${j instanceof Error?j.message:String(j)}`}}}function ew(P,O){P.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),P.end(O)}function ln(P,O,D){P.writeHead(O,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),P.end(JSON.stringify(D))}function nw(P){return new Promise((O,D)=>{P.close((j)=>j?D(j):O())})}function tw(P){return new Promise((O)=>{let D=()=>{process.off("SIGINT",j),process.off("SIGTERM",j)},j=()=>{D(),P.close().then(O)};process.once("SIGINT",j),process.once("SIGTERM",j)})}function rw(P){let O=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",D=process.platform==="win32"?["/c","start","",P]:[P];return new Promise((j,J)=>{let Y=zu(O,D,{detached:!0,stdio:"ignore"}),re=(de)=>{Y.off("spawn",ie),J(de)},ie=()=>{Y.off("error",re),Y.unref(),j()};Y.once("error",re),Y.once("spawn",ie)})}async function ow(P="gh",O=ps){return{ok:await us(P,["api","-X","PUT",`/user/starred/${bo}`],O)===0}}async function iw(P,O={}){let D=await xr((J)=>Ot({environment:P,cwd:process.cwd(),openCodeVersion:J}).status!=="n/a",O.fetcher),j=sw(P,D);return{targets:En.map((J)=>{let Y=j.find((re)=>re.platform===J.id);return{target:J.id,label:mn(J.id),version:D.versions[J.id]??null,status:Y?.configured?"active":Y?.detected?"disabled":Y?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:D.version,nodeVersion:D.nodeVersion,platform:D.platform}}}function sw(P,O){return Dt(P,process.cwd(),{ampPluginListOutput:O.ampPluginListOutput,codexPluginListOutput:O.codexPluginListOutput,copilotCliVersion:O.versions["copilot-cli"],openCodeVersion:O.versions.opencode,openCodePluginListOutput:O.openCodePluginListOutput})}async function aw(P={}){let O=await(P.checkUpdates??Gn)();return{update:{latestVersion:O.latestVersion??null,updateAvailable:O.updateAvailable}}}var Ju=Promise.resolve();function lw(P,O,D={}){let j=async()=>{let Y=[],{log:re,error:ie}=console;console.log=(...de)=>Y.push(de.map(String).join(" ")),console.error=console.log;try{return{ok:await ir(P,[],{selectTargets:async()=>[O],output:new Ub({write(fe,we,Ce){Y.push(String(fe).replace(/\n$/,"")),Ce()}}),...D})===0,output:Y.join(`
`)}}finally{console.log=re,console.error=ie}},J=Ju.then(j);return Ju=J.then(()=>{return},()=>{return}),J}async function cw(P,O={}){let[D,j,J]=await Promise.all([dw(O.command),uw(O.fetchRepo),Promise.resolve(yr(P,oe(P),O.logsDir).totalBlocked)]);return{starred:D,starCount:j,blockedTotal:J}}async function dw(P="gh",O=ps){if(await us(P,["auth","status"],O)!==0)return null;let D=await us(P,["api",`/user/starred/${bo}`],O);if(D===0)return!0;if(D===null)return null;return!1}function us(P,O,D){return new Promise((j)=>{let J=zu(P,O,{stdio:"ignore",windowsHide:!0}),Y=!1,re=setTimeout(()=>{J.kill(),ie(null)},D),ie=(de)=>{if(Y)return;Y=!0,clearTimeout(re),j(de)};J.once("error",()=>ie(null)),J.once("close",ie)})}async function uw(P=fetch){try{let O=await P(`https://api.github.com/repos/${bo}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(ps)});if(!O.ok)return null;let D=await O.json();return typeof D.stargazers_count==="number"?D.stargazers_count:null}catch{return null}}function pw(P){if(P[0]!=="help")return!1;let O=P[1];if(!O)Li(),process.exit(0);if(er(O))process.exit(0);console.error(`Unknown command: ${O}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var fw={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),er("hook",console.error),process.exit(1)},install:async(P)=>{process.exit(await ir("install",P))},update:async(P)=>{process.exit(await Yi(P))},uninstall:async(P)=>{process.exit(await ir("uninstall",P))},rule:async(P)=>{process.exit(await Du(c(),P))},policy:async(P)=>{process.exit(await Wd(c(),P))},status:async(P)=>{if(Dn(gn({label:"status"},P).errors))process.exit(1);Nu(c())},statusline:async(P)=>{let O=gn({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},P);if(O.errors.length===0&&O.flags.claudeCode){await as(c());return}if(Dn(O.errors),!O.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");er("statusline",console.error),process.exit(1)},doctor:async(P)=>{let O=Ei(P);if(!O)process.exit(1);let D=await uc(c(),{json:O.json,skipUpdateCheck:O.skipUpdateCheck});process.exit(D)},logs:async(P)=>{process.exit(await ws(c(),P))},gui:async(P)=>{process.exit(await Ku(P))},explain:async(P)=>{process.exit(await xc(c(),P))}};async function mw(P){let O=gn({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},P);if(pw(P))return;let D=P[0],j=D?hr(D):void 0;if(O.help&&j&&j.name!=="rule")er(j.name),process.exit(0);if(!D||O.help&&!j)Li(),process.exit(0);if(O.flags.version)Rc(),process.exit(0);if(j){await fw[j.name](P.slice(1));return}if(D==="--statusline"){await as(c());return}console.error(D.startsWith("-")?`Unknown option: ${D}`:`Unknown command: ${D}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{mw as runCli};
