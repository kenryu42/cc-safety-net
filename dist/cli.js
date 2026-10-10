import{a,s,Pe,Be,R,nt,ze,c,n,Ve,T,v,pe,ot,f,Ke,u,o,S,i,se,r,g,me,H,st,at,d,ge,he,ct,N,Z,ae,w,lt,_,h,ke,W,l,L,X,Je,Ye,M,C,I,ye,be,Ae,ut,m,e,Oe,Re,Ze,Xe,ce,Te,le,De,Q,B,Ne,xe,z,Qe,V,ee,te,ue,et,tt,E,F,Le,Fe,$e,k,je,_e,Ue,y,t,ne,ve,b,x,A,dt,Ge,He,p,q}from"./chunks/index-bbhtr799.js";import{oe,K,We,U,G}from"./chunks/index-fkjrm0kt.js";var cp=["-h","--help"];function yn(P,O){let D=Object.entries(P.booleans??{}),j=Object.entries(P.values??{}),J=Object.entries(P.lists??{}),Y=Object.fromEntries(D.map(([Se])=>[Se,!1])),re={},ie=Object.fromEntries(J.map(([Se])=>[Se,[]])),de=[],fe=[],we=!1,Ce=-1;for(let[Se,Ie]of O.entries()){if(Se<=Ce)continue;if(Ie==="--"){de.push(...O.slice(Se+1));break}if(cp.includes(Ie)){we=!0;continue}let Ee=D.find(([,en])=>en.includes(Ie));if(Ee){Y[Ee[0]]=!0;continue}let qe=j.find(([,en])=>en.includes(Ie));if(qe){let en=O[Se+1];if(en===void 0||en.startsWith("-")){fe.push(`${Ie} requires a value`);continue}re[qe[0]]=en,Ce=Se+1;continue}let Me=J.find(([,en])=>en.includes(Ie));if(Me){let en=O.slice(Se+1),on=en.findIndex((an)=>an.startsWith("-")),sn=en.slice(0,on===-1?en.length:on);if(sn.length===0){fe.push(`${Ie} requires at least one value`);continue}ie[Me[0]]=[...ie[Me[0]]??[],...sn],Ce=Se+sn.length;continue}if(Ie.startsWith("-")){fe.push(`Unknown option for ${P.label}: ${Ie}`);continue}if(P.positionals==="tail"){de.push(...O.slice(Se));break}de.push(Ie)}if(P.positionals!=="list"&&P.positionals!=="tail")fe.push(...de.map((Se)=>`Unexpected argument for ${P.label}: ${Se}`));return{flags:Y,values:re,lists:ie,positionals:de,help:we,errors:fe}}function Dn(P){for(let O of P)console.error(O);return P.length>0}import{readdirSync as yp,statSync as Ps,unlinkSync as hp}from"node:fs";import{basename as Rs,dirname as vp,isAbsolute as bp,join as wp,relative as kp,resolve as xp,sep as Cp}from"node:path";var xs=(P)=>{let O=Date.now()-new Date(P).getTime();if(!Number.isFinite(O))return"";let D=Math.floor(O/60000),j=Math.floor(D/60),J=Math.floor(j/24);if(J>0)return`${J}d ago`;if(j>0)return`${j}h ago`;if(D>0)return`${D}m ago`;return"just now"},Ro=(P)=>{let O=(P??"").trim().split(/\s+/).filter((J)=>J&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(J)),D=O[0]?.split("/").pop();if(!D)return null;let j=O[1];return j&&/^[a-z][a-z0-9-]*$/.test(j)?`${D} ${j}`:D};function Cs(P){let O=(J)=>`${J.sessionId}
${Ro(J.segment||J.command)}`,D=P.filter((J)=>J.decision!=="allow"),j=D.filter((J)=>J.sessionId).reduce((J,Y)=>J.set(O(Y),(J.get(O(Y))??0)+1),new Map);return new Set(D.filter((J)=>J.failureStage||(j.get(O(J))??0)>=2))}import{existsSync as dp,readdirSync as up,readFileSync as pp}from"node:fs";import{join as fp}from"node:path";function Kn(P,O){try{return up(P,{withFileTypes:!0,encoding:"utf8"}).flatMap((D)=>{let j=fp(P,D.name);if(D.isDirectory())return Kn(j,O);if(D.name.endsWith(".jsonl"))return[j];return[]})}catch{if(O&&dp(P))O.count++;return[]}}var mp=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function gp(P){if(!P||typeof P!=="object"||Array.isArray(P))return!1;let O=P;if(typeof O.ts!=="string"||typeof O.command!=="string")return!1;return mp.every((D)=>O[D]===void 0||typeof O[D]==="string")}function kt(P,O){try{return pp(P,"utf-8").split(`
`).filter(Boolean).flatMap((D)=>{try{let j=JSON.parse(D);if(!gp(j)){if(O)O.count++;return[]}return[j]}catch{if(O)O.count++;return[]}})}catch{if(O)O.count++;return[]}}function hn(P){return Array.from(P,(O)=>{let D=O.charCodeAt(0);if(D<=31||D>=127&&D<=159)return`\\x${D.toString(16).padStart(2,"0")}`;return O}).join("")}function Sp(P,O){let D=oe(P),j=yn({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},O);if(Dn(j.errors))return null;if(j.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(j.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let J=j.values.limit===void 0?20:Ss(j.values.limit);if(J===null)return console.error("--limit must be a positive number"),null;let Y=j.values.since===void 0?Math.min(30,D):Ss(j.values.since);if(Y===null||Y>D)return console.error(`--since must be a positive number of days no greater than ${D}`),null;let re={limit:J,limitExplicit:j.values.limit!==void 0,since:Y,sinceExplicit:j.values.since!==void 0,all:j.flags.all,json:j.flags.json,suspect:j.flags.suspect,pruneLegacy:j.flags.pruneLegacy,dryRun:j.flags.dryRun,id:j.values.id,agent:j.values.agent,rule:j.values.rule,session:j.values.session,project:j.values.project===void 0?void 0:xp(j.values.project)};if(re.id&&(re.agent!==void 0||re.rule!==void 0||re.session!==void 0||re.project!==void 0||re.suspect||re.sinceExplicit||re.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(re.pruneLegacy&&(re.id!==void 0||re.agent!==void 0||re.rule!==void 0||re.session!==void 0||re.project!==void 0||re.suspect||re.all||re.sinceExplicit||re.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(re.dryRun&&!re.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return re}async function Es(P,O,D={}){let j=Sp(P,O);if(!j)return 1;let J=D.logsDir??U(P);if(j.pruneLegacy)return Pp(J,j.json,j.dryRun);if(!J)return console.log(j.json?"[]":j.id?`No retained audit log entry found for id ${hn(j.id)}.`:"No audit log entries found."),0;K(P,J);let Y={count:0},re=Kn(J,Y).flatMap((Ce)=>kt(Ce,Y).map((Se)=>({entry:Se,file:Ce})));if(Y.count>0)console.error(`warning: ${Y.count} audit log ${Y.count===1?"source":"sources"} could not be read; these results are incomplete`);if(j.id)return Ap(re,j,D.timeZone);let ie=Date.now()-j.since*24*60*60*1000,de=re.filter((Ce)=>Tp(Ce,j,J,ie)),fe=j.suspect?Cs(de.map((Ce)=>Ce.entry)):null,we=(fe?de.filter((Ce)=>fe.has(Ce.entry)):de).sort((Ce,Se)=>Date.parse(Se.entry.ts)-Date.parse(Ce.entry.ts)).slice(0,j.limit);if(j.json)return console.log(JSON.stringify(we.map((Ce)=>Ce.entry),null,2)),0;if(we.length===0)return console.log("No audit log entries found."),0;for(let Ce of we)console.log(Op(Ce.entry,D.timeZone));return 0}function Pp(P,O,D){let j=P?Ep(P).map((ie)=>wp(P,ie)):[];if(D)return Rp(j,O);let J=[],Y=0,re=0;for(let ie of j){let de=Ps(ie,{throwIfNoEntry:!1})?.size??0,fe=_p(ie);if(fe){J.push(`${Rs(ie)}: ${fe}`);continue}Y++,re+=de}if(O)return console.log(JSON.stringify({removedFiles:Y,removedBytes:re,failedFiles:J.length})),J.length===0?0:1;console.log(Y===0&&J.length===0?"No legacy audit log files found.":`Removed ${Y} legacy audit log ${Y===1?"file":"files"} (${_s(re)}).`);for(let ie of J)console.error(`Could not remove ${hn(ie)}`);if(console.log("Nested v2 audit logs were not changed."),Y>0)console.log("This deletion cannot be undone.");return J.length===0?0:1}function Rp(P,O){let D=P.reduce((j,J)=>j+(Ps(J,{throwIfNoEntry:!1})?.size??0),0);if(O)return console.log(JSON.stringify({dryRun:!0,files:P.length,bytes:D})),0;if(console.log(P.length===0?"No legacy audit log files found.":`Would remove ${P.length} legacy audit log ${P.length===1?"file":"files"} (${_s(D)}).`),console.log("Nested v2 audit logs are not included."),P.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function Ep(P){try{return yp(P,{withFileTypes:!0}).filter((O)=>O.isFile()&&O.name.endsWith(".jsonl")).map((O)=>O.name)}catch{return[]}}function _p(P){try{return hp(P),null}catch(O){return O instanceof Error?O.message:String(O)}}function _s(P){let O=["B","KiB","MiB","GiB"],D=Math.min(Math.floor(Math.log2(Math.max(P,1))/10),O.length-1);return`${Math.round(P/1024**D*10)/10} ${O[D]}`}function Ap(P,O,D){let j=P.filter((Y)=>Y.entry.id===O.id);if(j.length>1)return console.error(`Multiple audit log entries found for id ${hn(O.id??"")}.`),1;if(O.json)return console.log(JSON.stringify(j.map((Y)=>Y.entry),null,2)),0;let J=j[0];if(!J)return console.log(`No retained audit log entry found for id ${hn(O.id??"")}.`),0;return console.log(Dp(J.entry,D)),0}function Tp(P,O,D,j){if(!O.all&&P.entry.decision==="allow")return!1;if(Date.parse(P.entry.ts)<j)return!1;if(O.agent!==void 0&&P.entry.agent!==O.agent)return!1;if(O.rule!==void 0&&P.entry.ruleId!==O.rule)return!1;if(O.session!==void 0&&!Ip(P,D,O.session))return!1;if(O.project!==void 0&&!$p(P.entry.cwd,O.project))return!1;return!0}function Ip(P,O,D){if(P.entry.sessionId===D)return!0;return vp(P.file)===O&&Rs(P.file,".jsonl")===D}function $p(P,O){if(!P)return!1;let D=kp(O,P);return D!==".."&&!D.startsWith(`..${Cp}`)&&!bp(D)}function Op(P,O){let D=hn(P.id??"-"),j=hn(P.decision??"deny"),J=P.cwd?`  [${hn(P.cwd)}]`:"",Y=P.segment||P.command,re=Y===P.command?"":"↳ ",ie=Y.length>50?`${Y.slice(0,50)}…`:Y;return`${D.padEnd(16)}  ${hn(As(P.ts,O))}  ${j.padEnd(5)}  ${hn(P.agent??"-").padEnd(15)}  ${hn(P.ruleId??"-").padEnd(20)}  ${re}${hn(ie)}${J}`}function Dp(P,O){let D=(J)=>hn(J===void 0||J===null||J===""?"-":J),j=P.shape?`${P.agent??"-"} (shape: ${P.shape})`:P.agent??"-";return[`id:        ${D(P.id)}`,`ts:        ${D(As(P.ts,O))}`,`decision:  ${D(P.decision)}`,`agent:     ${D(j)}`,`level:     ${D(P.level)}`,`tool:      ${D(P.toolName)}`,`rule:      ${D(P.ruleId)}`,`intent:    ${D(P.intent)}`,`stage:     ${D(P.failureStage)}`,`error:     ${D(P.errorCode)}`,`session:   ${D(P.sessionId)}`,`cwd:       ${D(P.cwd)}`,`version:   ${D(P.v)}`,`truncated: ${D(P.truncated===!0?"yes":void 0)}`,`reason:    ${D(P.reason)}`,`command:   ${D(P.command)}`,`segment:   ${D(P.segment)}`].join(`
`)}function As(P,O){let D=new Date(P);if(Number.isNaN(D.getTime()))return P;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:O}).format(D)}function Ss(P){let O=Number(P);return Number.isFinite(O)&&O>0?O:null}var Ts={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var Is={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var $s={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var Eo=["npx","--offline","--no-install","@deepseek-ai/dsh","--version"],Os=["cursor-agent","--version"],mr=[{id:"antigravity-cli",displayName:"Antigravity CLI",doctorOrder:3,runtime:{order:1,flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:2,flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",doctorOrder:1,runtime:{order:2,displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{order:3,flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",doctorOrder:4,runtime:{order:3,flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{order:4,flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",doctorOrder:10,runtime:{order:8,flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{order:10,flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",doctorOrder:9,runtime:{order:7,flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{order:9,flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",doctorOrder:11,runtime:{order:9,flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{order:11,flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",doctorOrder:12,runtime:{order:10,flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{order:12,flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",doctorOrder:13,runtime:{order:11,flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{order:13,flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",doctorOrder:14,install:{order:14,flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",doctorOrder:15,install:{order:15,flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",doctorOrder:16,install:{order:16,flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",doctorOrder:5,runtime:{order:4,flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{order:5,flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"deepseek-harness",displayName:"DeepSeek Harness",doctorOrder:6,install:{order:6,flag:"--deepseek-harness",artifactKind:"package",probeCommand:Eo}},{id:"devin",displayName:"Devin CLI",doctorOrder:7,runtime:{order:5,flags:["-dv","--devin"],description:"Run as Devin CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:7,flag:"--devin",artifactKind:"hook config",probeCommand:["devin","--version"]}},{id:"droid",displayName:"Factory Droid",doctorOrder:8,runtime:{order:6,flags:["-fd","--droid"],description:"Run as Factory Droid PreToolUse hook",legacyTopLevelFlags:[]},install:{order:8,flag:"--droid",artifactKind:"hook config",probeCommand:["droid","--version"]}},{id:"amp",displayName:"Amp Code",doctorOrder:2,install:{order:1,flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],gr=mr.slice().sort((P,O)=>P.doctorOrder-O.doctorOrder).map((P)=>P.id),Ht=mr.filter((P)=>("runtime"in P)).slice().sort((P,O)=>P.runtime.order-O.runtime.order).map((P)=>({id:P.id,displayName:"displayName"in P.runtime?P.runtime.displayName:P.displayName,flags:P.runtime.flags,legacyFlags:"legacyFlags"in P.runtime?P.runtime.legacyFlags:[],description:P.runtime.description,legacyTopLevelFlags:P.runtime.legacyTopLevelFlags})),En=mr.slice().sort((P,O)=>P.install.order-O.install.order).map((P)=>({id:P.id,...P.install})).map(({order:P,...O})=>O),Lp=Object.fromEntries(mr.map((P)=>[P.id,P.displayName]));function mn(P){return Lp[P]}var Np=Ht.map((P)=>({flags:P.flags.join(", "),description:P.description})),jp=Ht.flatMap((P)=>P.flags.map((O)=>`cc-safety-net hook ${O}`)),Ds={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Np,{flags:"-h, --help",description:"Show this help"}],examples:jp};var Ls={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...En.map((P)=>({flags:P.flag,description:`Install ${mn(P.id)} ${P.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...En.map((P)=>`cc-safety-net install ${P.flag}`)]},Ns={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...En.map((P)=>({flags:P.flag,description:`Uninstall ${mn(P.id)} ${P.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...En.map((P)=>`cc-safety-net uninstall ${P.flag}`)]},js={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var Fs={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var yr={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var _o=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],Ao=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],xt={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},..._o.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk",...Ao,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var Hs={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var Ms={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var hr=[Hs,Ts,Fs,Is,xt,yr,Ls,js,Ns,Ds,$s,Ms];function Fp(P){return P.aliases??[]}function vr(P){let O=P.toLowerCase();return hr.find((D)=>D.name.toLowerCase()===O||Fp(D).some((j)=>j.toLowerCase()===O))}import{existsSync as xy}from"node:fs";import{basename as Hp}from"node:path";function br(P,O=7,D=U(P)){let j=Date.now()-O*24*60*60*1000,J=[],Y=new Set,re=0,ie,de,fe,we;if(D)K(P,D);let Ce={count:0},Se=D?Kn(D,Ce):[];for(let Ee of Se)for(let qe of kt(Ee,Ce)){if(qe.decision==="allow")continue;let Me=new Date(qe.ts).getTime();if(Me>=j){if(re++,Y.add(qe.sessionId??Hp(Ee,".jsonl")),de===void 0||Me<=de)ie=qe.ts,de=Me;if(we===void 0||Me>we)fe=qe.ts,we=Me;Mp(J,qe,Me)}}let Ie=J.map((Ee)=>({timestamp:Ee.ts,command:Ee.command,reason:Ee.reason,relativeTime:xs(new Date(Ee.ts))}));return{totalBlocked:re,sessionCount:Y.size,recentEntries:Ie,oldestEntry:ie,newestEntry:fe,unreadable:Ce.count}}function Mp(P,O,D){let j=P.findIndex((J)=>D>new Date(J.ts).getTime());if(j===-1){if(P.length<3)P.push(O);return}if(P.splice(j,0,O),P.length>3)P.pop()}import{dirname as Xp}from"node:path";import{dirname as Up,join as Gp,resolve as qp}from"node:path";var Bp="config.json";function wn(P,O,D,j){g(Vp(P),`${JSON.stringify(O,null,2)}
`,D,j)}function Vp(P){return typeof P==="string"?se(P):P}function Io(P){return{errors:ce(Kp(P),": "," "),ruleNames:new Set(De(P).map((O)=>O.toLowerCase()))}}var Jp="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",Us="must match pattern (letters, numbers, hyphens, underscores)";function Kp(P){if(!Gs(P))return[e([],"Config must be an object")];return[...P.version===1?[]:[e(["version"],"must be 1")],...Wp(P.rules)]}function Wp(P){if(P===void 0)return[];if(!Array.isArray(P))return[e(["rules"],"must be an array")];return[...P.flatMap((O,D)=>Gs(O)?zp(O,["rules",D]):[e(["rules",D],"must be an object")]),...Oe(P)]}function zp(P,O){return[...To(P.name,[...O,"name"],"required string",d,Jp),...To(P.command,[...O,"command"],"required string",C,Us),...P.subcommand===void 0?[]:To(P.subcommand,[...O,"subcommand"],"must be a string if provided",C,Us),...Yp(P.block_args,[...O,"block_args"]),...Zp(P.reason,[...O,"reason"]),...P.intent===void 0||Te(P.intent)?[]:[e([...O,"intent"],Re)]]}function To(P,O,D,j,J){if(typeof P!=="string")return[e(O,D)];return j.test(P)?[]:[e(O,J)]}function Yp(P,O){if(!Array.isArray(P))return[e(O,"required array")];if(P.length===0)return[e(O,"must have at least one element")];return P.flatMap((D,j)=>{if(typeof D!=="string")return[e([...O,j],"must be a string")];return D===""?[e([...O,j],"must not be empty")]:[]})}function Zp(P,O){if(typeof P!=="string")return[e(O,"required string")];if(P==="")return[e(O,"must not be empty")];return P.length>I?[e(O,`must be at most ${I} characters`)]:[]}function Gs(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}function $o(P){let O=qs(P);if(!O.ok)return O.result;return Io(O.parsed)}function qs(P){let O=[],D=new Set;try{let j=typeof P==="string"?se(P):P,J=r(j);if(J===null)return O.push(`File not found: ${j.path}`),{ok:!1,result:{errors:O,ruleNames:D}};if(!J.trim())return O.push("Config file is empty"),{ok:!1,result:{errors:O,ruleNames:D}};return{ok:!0,parsed:JSON.parse(J)}}catch(j){if(j instanceof o)return O.push(j.message),{ok:!1,result:{errors:O,ruleNames:D}};let J=j instanceof Error?j.message:String(j);return O.push(j instanceof SyntaxError?"Invalid JSON":J),{ok:!1,result:{errors:O,ruleNames:D}}}}function wr(P){return qp(P,".safety-net.json")}function Un(P){let O=qs(P);if(!O.ok)return O.result;let D=Ze(O.parsed);return{errors:D.errors,ruleNames:D.sources}}function Ct(P,O={}){return Gp(Up(ke(P,O)),Bp)}function Bs(P,O,D){let j;try{if(r(O)===null)return{path:P,exists:!1,valid:!1,ruleCount:0};j=Un(O),j.errors.push(...B(P,D))}catch(J){if(!(J instanceof o))throw J;j={errors:[J.message],ruleNames:new Set}}return{path:P,exists:!0,valid:j.errors.length===0,ruleCount:j.ruleNames.size,...j.errors.length>0?{errors:j.errors}:{}}}function Qp(P,O){return{source:O,name:P.name,command:P.command,subcommand:P.subcommand,blockArgs:[...P.block_args],reason:P.reason}}function Vs(P,O){let D=W(P),j=_(O),J=Xp(D),Y=Q(P,{cwd:O,userConfigPath:D,projectConfigPath:j,userConfigDir:J}),re=X(P,{cwd:O,userConfigPath:D,projectConfigPath:j,userConfigDir:J}),ie=new Map(Y.rulebooks.flatMap((de)=>de.rules.map((fe)=>[fe,de.source])));return{userConfig:Bs(D,re.userConfigTarget,re.userScope),projectConfig:Bs(j,re.projectConfigTarget,re.projectScope),effectiveRules:Y.rules.map((de)=>Qp(de,ie.get(de.name)??"project"))}}var ef=[{flag:n.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:n.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:n.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:n.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:n.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:n.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:n.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:n.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"},{flag:n.projectTightenOnly,description:"Ignore project policy settings that weaken the user policy",defaultBehavior:"off"}];function Js(P){return[...ef.map((O)=>({name:O.flag.name,value:pe(O.flag,P.env),isSet:ot(O.flag,P.env),legacyName:O.flag.legacyName,legacyValue:O.flag.legacyName?P.env.get(O.flag.legacyName):void 0,legacyIsSet:O.flag.legacyName?P.env.get(O.flag.legacyName)!==void 0:void 0,description:O.description,defaultBehavior:O.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:P.env.get("CC_SAFETY_NET_HOME"),isSet:P.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var Ks={error:0,warning:1,info:2},nf=["policy","config","audit"];function tf(P){return P.map((O)=>{if(O==="ownership")return"is not owned by the current user";if(O==="permissions")return"has unsafe permissions";if(O==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var rf=[{derive:(P)=>P.hooks.length>0&&P.hooks.every((O)=>!O.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(P)=>P.hooks.filter((O)=>O.inspectionStatus==="failed").map((O)=>{let D=mn(O.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${D} inspection failed`,detail:`Doctor could not verify the ${D} integration configuration.`,fixHint:`Correct the reported ${D} configuration error, then run \`cc-safety-net doctor\` again.`,integration:O.platform}})},{derive:(P)=>P.userConfig.exists&&!P.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:P.userConfig.path}]:[]},{derive:(P)=>P.projectConfig.exists&&!P.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:P.projectConfig.path}]:[]},{derive:(P)=>P.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${P.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(P)=>P.v2Leftovers&&P.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${P.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(P)=>P.legacyConfigs&&P.legacyConfigs.length>0?[{checkId:"config.legacy-ignored",severity:"warning",title:"Legacy inline rule configs are ignored",detail:`CC Safety Net no longer loads these files, so their rules enforce nothing: ${P.legacyConfigs.join(", ")}.`,fixHint:"Run `cc-safety-net rule migrate` to convert them (add `--cleanup` to delete each file once it is converted), then rerun doctor."}]:[]},{derive:(P)=>{let O=P.environment.find((D)=>D.name==="CC_SAFETY_NET_AUDIT_SCOPE");return Ve(O?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...nf.map((P)=>({derive:(O)=>O.posture.directories.filter((D)=>D.kind===P&&D.status==="unsafe").map((D)=>({checkId:`posture.${P}-directory-unsafe`,severity:"error",title:`${P[0]?.toUpperCase()}${P.slice(1)} directory is unsafe`,detail:`The ${P} directory ${tf(D.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...D.path?{path:D.path}:{}}))})),{derive:(P)=>{let O=[...P.effectiveSafety.weakenedRuleOverrides].sort();return O.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${O.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${O.join(", ")}.`}]:[]}}];function Ws(P){return rf.flatMap((O,D)=>O.derive(P).map((j,J)=>({finding:j,catalogOrder:D,occurrence:J}))).sort((O,D)=>Ks[O.finding.severity]-Ks[D.finding.severity]||O.catalogOrder-D.catalogOrder||O.occurrence-D.occurrence).map((O)=>O.finding)}function Ln(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var of=(P)=>Ln()?`\x1B[32m${P}\x1B[0m`:P,sf=(P)=>Ln()?`\x1B[33m${P}\x1B[0m`:P,af=(P)=>Ln()?`\x1B[34m${P}\x1B[0m`:P,lf=(P)=>Ln()?`\x1B[36m${P}\x1B[0m`:P,cf=(P)=>Ln()?`\x1B[31m${P}\x1B[0m`:P,df=(P)=>Ln()?`\x1B[2m${P}\x1B[0m`:P,uf=(P)=>Ln()?`\x1B[1m${P}\x1B[0m`:P,nn={green:of,yellow:sf,blue:af,cyan:lf,red:cf,dim:df,bold:uf},pf="\x1B[0m",ff=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function mf(P){let O=P;return()=>(O=(O*1664525+1013904223)%4294967296,O/4294967296)}function gf(P){let O=[...ff],D=mf(P);for(let j=O.length-1;j>0;j--){let J=Math.floor(D()*(j+1)),Y=O[j];O[j]=O[J],O[J]=Y}return O}function yf(P,O=0){if(!Ln())return"";let D=gf(O);return`\x1B[38;5;${D[P%D.length]}m`}function zs(P,O,D=0){if(!Ln())return`"${P}"`;return`${yf(O,D)}"${P}"${pf}`}function kr(P){return P==="default"?"built-in default":`${P} policy`}var hf=new RegExp("\x1B\\[[0-9;]*m","g"),Oo=(P)=>P.replace(hf,"").length;function Wn(P){let O=(P.headers??P.rows[0]??[]).map((re,ie)=>{let de=Math.max(...P.rows.map((fe)=>Oo(fe[ie]??"")));return Math.max(Oo(re),de)}),D=(re,ie)=>re+" ".repeat(Math.max(0,ie-Oo(re))),j=(re,ie)=>ie[0]+O.map((de)=>re.repeat(de+2)).join(ie[1])+ie[2],J=(re)=>`│ ${re.map((ie,de)=>D(ie,O[de]??0)).join(" │ ")} │`,Y=P.headers?[`   ${J(P.headers)}`,`   ${j("─",["├","┼","┤"])}`]:[];return[`   ${j("─",["┌","┬","┐"])}`,...Y,...P.rows.map((re)=>`   ${J(re)}`),`   ${j("─",["└","┴","┘"])}`].join(`
`)}function Ys(P){let O=[];O.push("Hook Integration"),O.push(vf(P));let D=[],j=[];for(let J of P){let Y=mn(J.platform);if(J.errors&&J.errors.length>0)for(let re of J.errors)if(J.configured)D.push({platform:Y,message:re});else j.push({platform:Y,message:re})}for(let J of D)O.push(`   Warning (${J.platform}): ${J.message}`);for(let J of j)O.push(nn.red(`   Error (${J.platform}): ${J.message}`));return O.join(`
`)}function vf(P){let O=["Platform","Discovery","Configuration","Inspection"],D=P.map((j)=>{let J=mn(j.platform);if(j.inspectionStatus==="not-inspected"){let de=nn.dim("Not inspected");return[J,de,de,de]}let Y=j.detected?nn.green("Detected"):j.inspectionStatus==="failed"?nn.red("Unknown"):nn.dim("Not detected"),re=j.configured?nn.green("Configured"):j.detected?nn.yellow("Not configured"):j.inspectionStatus==="failed"?nn.red("Unknown"):nn.dim("Not applicable"),ie=j.inspectionStatus==="verified"?nn.green("Verified"):j.inspectionStatus==="failed"?nn.red("Failed"):nn.dim("Not applicable");return[J,Y,re,ie]});return Wn({headers:O,rows:D})}function Zs(P){let D=["Guard Engine Verification",`   Synthetic self-test: ${P.failed>0?nn.red(`${P.passed}/${P.total} FAIL`):nn.green(`${P.passed}/${P.total} passed`)}`],j=P.results.filter((J)=>!J.passed);if(j.length>0){D.push(""),D.push(nn.red("   Failures:"));for(let J of j)D.push(nn.red(`   • ${J.description}`)),D.push(nn.red(`     expected ${J.expected}, got ${J.actual}`))}return D.join(`
`)}function bf(P){if(P.length===0)return"   (no custom rules)";let O=["Source","Name","Command","Block Args"],D=P.map((j)=>[j.source,j.name,j.subcommand?`${j.command} ${j.subcommand}`:j.command,j.blockArgs.join(", ")]);return Wn({headers:O,rows:D})}function Xs(P){let O=[];if(O.push("Configuration"),O.push(wf(P.userConfig,P.projectConfig)),O.push(""),P.effectiveRules.length>0)O.push(`   Effective rules (${P.effectiveRules.length} total):`),O.push(bf(P.effectiveRules));else O.push("   Effective rules: (none - using built-in rules only)");return O.join(`
`)}function wf(P,O){let D=["Scope","Status"],j=(Y)=>{if(!Y.exists)return nn.dim("N/A");if(!Y.valid)return nn.red(`Invalid (${Y.errors?.[0]??"unknown error"})`);return nn.green("Configured")},J=[["User",j(P)],["Project",j(O)]];return Wn({headers:D,rows:J})}function Qs(P){let O=[];return O.push("Environment"),O.push(kf(P)),O.join(`
`)}function ea(P){let O=P.effectiveSafety.policyScopes,D=["Effective Safety",`   Selected preset: ${P.effectiveSafety.selectedPreset}${O?` (${kr(O.levelScope)})`:""}`,`   Effective: ${P.effectiveSafety.level}`],j=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[J,Y]of j){let re=P.effectiveSafety.capabilities[J],ie=re.enabled?nn.green("ON"):nn.dim("OFF"),de=re.sources.length>0?` (${re.sources.join(", ")})`:"";D.push(`   ${Y}: ${ie} via ${re.source}${de}`)}if(O&&O.weakenings.length>0){D.push(`   Project policy deltas${O.weakeningsIgnored?" (ignored)":""}:`);for(let J of O.weakenings)D.push(`      ${J}`)}D.push(`   Stored rule customizations: ${P.effectiveSafety.ruleCounts.stored}`),D.push(`   Effective rule customizations: ${P.effectiveSafety.ruleCounts.effective}`);for(let[J,Y]of Object.entries(P.effectiveSafety.ruleOverrides))D.push(`   ${J}: ${Y}`);return D.join(`
`)}function na(P){let O=["Findings"];if(P.length===0)return O.push("   No findings from inspected doctor facts."),O.join(`
`);for(let D of P){let j=`[${D.severity.toUpperCase()}] ${D.checkId}: ${hn(D.title)}`,J=D.severity==="error"?nn.red:D.severity==="warning"?nn.yellow:nn.blue;if(O.push(`   ${J(j)}`),O.push(`      ${hn(D.detail)}`),D.path)O.push(`      Path: ${hn(D.path)}`);if(D.fixHint)O.push(`      Fix: ${hn(D.fixHint)}`)}return O.join(`
`)}function kf(P){let O=["Variable","Status","Legacy"],D=P.map((j)=>{let J=j.isSet?nn.green("✓"):nn.dim("✗"),Y=j.legacyName&&j.legacyIsSet?`${j.legacyName} ${nn.green("✓")}`:j.legacyName??"";return[j.name,J,Y]});return Wn({headers:O,rows:D})}function ta(P){let O=[];if(P.totalBlocked===0)O.push("Recent Activity"),O.push("   No blocked commands in the last 7 days"),O.push("   Tip: This is normal for new installations");else O.push(`Recent Activity · last 7 days (${P.totalBlocked} blocked / ${P.sessionCount} sessions)`),O.push(xf(P.recentEntries));if(P.unreadable>0)O.push(`   Warning: ${P.unreadable} audit log ${P.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return O.join(`
`)}function xf(P){let O=["Time","Command"],D=P.map((j)=>{let J=hn(j.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),Y=J.length>40?`${J.slice(0,37)}...`:J;return[j.relativeTime,Y]});return Wn({headers:O,rows:D})}function ra(P){let O=[];if(O.push("Update Check"),P.latestVersion===null&&!P.error)return O.push(xr([["Status",nn.dim("Skipped")],["Installed",P.currentVersion]])),O.join(`
`);if(P.error)return O.push(xr([["Status",`${nn.yellow("⚠")} Error`],["Installed",P.currentVersion],["Error",nn.dim(P.error)]])),O.join(`
`);if(P.updateAvailable)return O.push(xr([["Status",`${nn.yellow("⚠")} Update Available`],["Current",P.currentVersion],["Latest",nn.green(P.latestVersion??"")]])),O.push(""),O.push("   Run: bunx cc-safety-net@latest doctor"),O.push("   Or:  npx cc-safety-net@latest doctor"),O.join(`
`);return O.push(xr([["Status",`${nn.green("✓")} Up to date`],["Version",P.currentVersion]])),O.join(`
`)}function xr(P){return Wn({rows:P})}function oa(P){let O=[];return O.push("System Info"),O.push(Cf(P)),O.join(`
`)}function Cf(P){let O=["Component","Version"],D=(Y)=>{if(Y===null)return nn.dim("not found");return Y},J=[{label:"cc-safety-net",value:P.version},...gr.map((Y)=>({label:mn(Y),value:P.versions[Y]??null})),{label:"Node.js",value:P.nodeVersion},{label:"npm",value:P.npmVersion},{label:"Bun",value:P.bunVersion},{label:"Platform",value:P.platform}].map((Y)=>[Y.label,D(Y.value)]);return Wn({headers:O,rows:J})}function ia(P){if(P.findings.length===0)return nn.green(`
No findings from inspected doctor facts.`);let O={error:P.findings.filter((Y)=>Y.severity==="error").length,warning:P.findings.filter((Y)=>Y.severity==="warning").length,info:P.findings.filter((Y)=>Y.severity==="info").length},D=["error","warning","info"].filter((Y)=>O[Y]>0).map((Y)=>`${O[Y]} ${Y}`),j=P.findings.length===1?"finding":"findings",J=`
${P.findings.length} ${j}: ${D.join(", ")}.`;if(O.error>0)return nn.red(J);if(O.warning>0)return nn.yellow(J);return nn.blue(J)}import{lstatSync as Sf}from"node:fs";import{dirname as Do}from"node:path";function Lo(P,O){try{let D=Sf(O);if(D.isSymbolicLink())return{kind:P,path:O,status:"unsafe",issues:["symlink"]};if(!D.isDirectory())return{kind:P,path:O,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:P,path:O,status:"unknown",issues:[]};let j=[...D.uid!==process.getuid()?["ownership"]:[],...(D.mode&18)!==0?["permissions"]:[]];return{kind:P,path:O,status:j.length>0?"unsafe":"safe",issues:j}}catch(D){if(typeof D==="object"&&D!==null&&"code"in D&&D.code==="ENOENT")return{kind:P,path:O,status:"not-applicable",issues:[]};return{kind:P,path:O,status:"unknown",issues:[]}}}function sa(P,O){let D=U(P);return{directories:[Lo("policy",Do(Do(O))),Lo("config",Do(O)),...D?[Lo("audit",D)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as Pf}from"node:child_process";import{existsSync as aa}from"node:fs";import{delimiter as Rf,extname as Ef,join as _f}from"node:path";import{stripVTControlCharacters as la}from"node:util";var da="2.6.6",Af=5000,Tf="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function pn(){return da}function No(P,O){let D=P[O];if(D)return D;let j=Object.keys(P).find((J)=>J.toLowerCase()===O.toLowerCase()&&!!P[J]);return j?P[j]:D}function If(P){return(No(P,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((O)=>O.length>0)}function $f(P,O){let D=Ef(P)?[P]:[...If(O).map((j)=>`${P}${j}`),P];if(P.includes("/")||P.includes("\\"))return D.find((j)=>aa(j))??P;return(No(O,"PATH")??"").split(Rf).flatMap((j)=>D.map((J)=>_f(j,J))).find((j)=>aa(j))??P}function ca(P){if(!/[\s"&|<>^]/.test(P))return P;return`"${P.replace(/"/g,'""')}"`}function zn(P,O){let[D,...j]=P,J=O[Tf]==="win32"?"win32":process.platform;if(!D||J!=="win32")return{cmd:D??"",args:j};let Y=$f(D,O);if(!/\.(?:bat|cmd)$/i.test(Y))return{cmd:Y,args:j};return{cmd:No(O,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",ca(Y),...j.map(ca)].join(" ")]}}var St=async(P,O=Af)=>{let D=await Of(P,{timeoutMs:O});if(D.code!==0)return null;return la(D.stdout).trim()||la(D.stderr).trim()||null};function Of(P,O){let[D,...j]=P;if(!D)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((J)=>{try{let Y=zn([D,...j],process.env),re=Pf(Y.cmd,Y.args,{stdio:["ignore","pipe","pipe"]}),ie=!1,de="",fe="";re.stdout.on("data",(Se)=>{de+=Se.toString()}),re.stderr.on("data",(Se)=>{fe+=Se.toString()});let we=(Se)=>{if(ie)return;ie=!0,clearTimeout(Ce),J(Se)},Ce=setTimeout(()=>{re.kill(),we({code:null,stdout:de,stderr:fe})},O.timeoutMs);re.on("close",(Se)=>{we({code:Se,stdout:de,stderr:fe})}),re.on("error",()=>{we({code:null,stdout:de,stderr:fe})})}catch{J({code:null,stdout:"",stderr:""})}})}function Cr(P){if(!P)return null;let O=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(P);if(O)return O[1]??null;let D=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(P);if(D)return D[1]??null;return P.split(`
`)[0]?.trim()||null}async function Sr(P,O=St,D=process.cwd()){let j=Promise.all(En.map(async(Ce)=>[Ce.id,Cr(await O([...Ce.probeCommand]))])),[J,Y,re,ie,de,fe,we]=await Promise.all([j,j.then(async(Ce)=>{let Se=Ce.find(([qe])=>qe==="opencode")?.[1];if(!Se?.startsWith("2.")||!P(Se))return null;let Ie=["--param",`location[directory]=${D}`],Ee=["opencode","api","integration.list",...Ie];return await O(Ee,30000),O(["opencode","api","plugin.list",...Ie],30000)}),O(["codex","plugin","list"],30000),O(["amp","plugins","list"],30000),O(["node","--version"]),O(["npm","--version"]),O(["bun","--version"])]);return{version:da,versions:Object.fromEntries(J),codexPluginListOutput:re,ampPluginListOutput:ie,openCodePluginListOutput:Y,nodeVersion:Cr(de),npmVersion:Cr(fe),bunVersion:Cr(we),platform:`${process.platform} ${process.arch}`}}function jo(P,O){if(O==="dev")return!1;let D=P.split(".").map(Number),j=O.split(".").map(Number),[J=0,Y=0,re=0]=D,[ie=0,de=0,fe=0]=j;if(J!==ie)return J>ie;if(Y!==de)return Y>de;return re>fe}async function Gn(){let P=pn(),O=new AbortController,D=setTimeout(()=>O.abort(),3000);try{let j=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:O.signal});if(!j.ok)return{currentVersion:P,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${j.status}`};let J=await j.json(),Y=jo(J.version,P);return{currentVersion:P,latestVersion:J.version,updateAvailable:Y}}catch(j){return{currentVersion:P,latestVersion:null,updateAvailable:!1,error:j instanceof Error?j.message:"Network error"}}finally{clearTimeout(D)}}import*as va from"node:readline";var ma=(P)=>`\x1B[${P}B`,Df=(P)=>`\x1B[${P}A`;var ua=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Lf(P){return new Promise((O)=>setTimeout(O,P))}function Nf(P,O,D){if(!D)return O(P);if(D.aborted)return Promise.resolve();return new Promise((j,J)=>{let Y=()=>D.removeEventListener("abort",re),re=()=>{Y(),j()};D.addEventListener("abort",re,{once:!0}),O(P).then(()=>{Y(),j()},(ie)=>{Y(),J(ie)})})}function Pr(P){return Math.max(0,Math.min(1,P))}function Pt(P){return Math.max(0,Math.min(255,Math.round(P)))}function Fo(P){return P<=0.0031308?12.92*P:1.055*P**0.4166666666666667-0.055}function jf(P,O,D){let j=D*Math.PI/180,J=O*Math.cos(j),Y=O*Math.sin(j),re=(P+0.3963377774*J+0.2158037573*Y)**3,ie=(P-0.1055613458*J-0.0638541728*Y)**3,de=(P-0.0894841775*J-1.291485548*Y)**3;return{blue:Pt(Fo(Pr(-0.0041960863*re-0.7034186147*ie+1.707614701*de))*255),green:Pt(Fo(Pr(-1.2684380046*re+2.6097574011*ie-0.3413193965*de))*255),red:Pt(Fo(Pr(4.0767416621*re-3.3077115913*ie+0.2309699292*de))*255)}}function Ho(P,O){let D=(O*P*180/Math.PI%360+360)%360;return jf(0.72,0.15,D)}function ga(P,O=0.1){let D=Ho(O,P);return`\x1B[38;2;${D.red};${D.green};${D.blue}m`}function Ff(P,O){return{blue:Pt(P.blue+(255-P.blue)*O),green:Pt(P.green+(255-P.green)*O),red:Pt(P.red+(255-P.red)*O)}}function ya(P,O,D){let j=Math.imul(P+2654435769,2246822507)^Math.imul(O+3266489909,668265263)^Math.imul(D+374761393,2654435761),J=j^j>>>15,Y=Math.imul(J,739982445),re=Y^Y>>>12,ie=Math.imul(re,695872825);return((ie^ie>>>15)>>>0)/4294967296}function Hf(P,O,D){let j=Math.floor(ya(P,O,D)*ua.length);return ua[j]??"░"}function pa(P){let O=Pr(P);return O*O*O*(O*(O*6-15)+10)}function Mf(P){if(P.length===0)return"";let O=[],D=!1,j="";for(let J of P){let Y=`${J.red};${J.green};${J.blue}`;if(J.bold!==D)O.push(J.bold?"\x1B[1m":"\x1B[22m"),D=J.bold;if(Y!==j)O.push(`\x1B[38;2;${Y}m`),j=Y;O.push(J.character)}return`${O.join("")}\x1B[22m\x1B[39m`}function Uf(P,O,D,j,J){return P.map((Y,re)=>({...Ho(D,j+O+re/J),bold:!1,character:Y}))}function Gf(P,O,D,j,J,Y,re,ie){let de=Math.max(1,j*0.75),fe=Math.min(1,D/de),we=J*pa(fe),Ce=Math.max(0,(D-de)/Math.max(1,j-de)),Se=(1-pa(D/j))*ie*2,Ie=0.35*Math.max(0,1-Ce*2),Ee=fe>=1,qe=Math.min(P.length,Math.ceil(we+2+1));return P.slice(0,qe).map((Me,en)=>{let on=Ho(Y,re+O+en/ie+Se),sn=en+ya(O,en,7919)*2-1;if(sn>we+2)return{...on,bold:!1,character:" "};let an=we-sn,rn=0.8*Math.exp(-(an*an)/12.5),fn=Math.min(0.9,rn+Ie),On=!Ee&&sn>we-4;return{...Ff(on,fn),bold:fn>0.3,character:On?Hf(O,en,D):Me}})}function fa(P){return`\x1B[?2026h${P.map((O,D)=>`\x1B8${D>0?ma(D):""}${Mf(O)}`).join("")}\x1B[?2026l`}async function Mo(P,O={}){if(!P)return;let D=O.output??process.stdout,j=O.sleep??Lf,J=O.seed??0,Y=P.split(`
`).map((we)=>Array.from(we)),re=Math.max(...Y.map((we)=>we.length)),ie=12000*Y.filter((we)=>we.length>0).length/40,de=re>0?Math.max(1,Math.ceil(ie/16.666666666666668)):0,fe=de>0?ie/de:0;D.write(`\x1B[?25l${Y.length>1?`${`
`.repeat(Y.length-1)}${Df(Y.length-1)}`:""}\x1B7`);try{for(let we=1;we<=de;we+=1){if(O.signal?.aborted)break;D.write(fa(Y.map((Ce,Se)=>Gf(Ce,Se,we,de,re,0.1,J,3)))),await Nf(fe,j,O.signal)}}finally{if(D.write(fa(Y.map((we,Ce)=>Uf(we,Ce,0.1,J,3)))),D.write("\x1B8"),Y.length>1)D.write(ma(Y.length-1));D.write(`
\x1B[0m\x1B[?25h`)}}var ha=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function qf(P){return Boolean(P.isTTY)}async function Mt(P={}){let O=P.output??process.stdout;if(!qf(O))return;let D=P.input??process.stdin,j={output:O,seed:P.seed??Math.random()*8192,sleep:P.sleep};if(!D.isTTY||typeof D.setRawMode!=="function"){await Mo(ha,j);return}let J=new AbortController,Y=D.readableFlowing===!0,re=D.isRaw===!0,ie=!1,de=(fe,we)=>{if(we.ctrl&&we.name==="c")ie=!0;if(ie||we.name==="return"||we.name==="enter")J.abort()};va.emitKeypressEvents(D),D.on("keypress",de),D.setRawMode(!0),D.resume();try{await Mo(ha,{...j,signal:J.signal})}finally{if(D.off("keypress",de),D.setRawMode(re),!Y)D.pause()}if(!ie)return;if(P.onInterrupt){P.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as Wf}from"node:crypto";import{existsSync as ka}from"node:fs";import{dirname as Rr,join as xa}from"node:path";import{dirname as ba,join as Bf,resolve as Vf}from"node:path";var Jf="rule.lock";function Kf(P){return Bf(ba(P),Jf)}function wa(P={}){return Vf(P.cwd??process.cwd(),".safety-net.json")}function kn(P,O){let D=O.global?O.userConfigPath??W(P,O):O.projectConfigPath??_(O.cwd??process.cwd()),j=O.global?Je(P,O):Ye(D,O.cwd??process.cwd()),J=Kf(D);return{configDir:ba(D),configPath:D,lockPath:J,filesystemScope:j,configTarget:i(j,D),lockTarget:i(j,J)}}var zf="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",Yf="cache",Zf="rulebooks";function Ca(P,O={}){let D=kn(P,O),j=i(D.filesystemScope,Pa(D.configDir)),J=r(D.lockTarget);if(console.log(zf),J===null&&!ka(j.path))return console.log(`No v2 lock or cache leftovers found in ${Rr(D.configDir)}; nothing to migrate.`),0;let Y=tm(J),re=m(D.configTarget);if(!re.config&&(r(D.configTarget)!==null||Y.size>0))return console.error(`Cannot migrate: the rules config in ${Rr(D.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let ie=re.config?.rules??[];for(let de of ie.flatMap((fe)=>Xf(fe,Y,D,j,O.global===!0)))console.log(de);return H(D.lockTarget),st(j),console.log(`Removed the v2 lock and cache under ${Rr(D.configDir)}.`),0}function Sa(P,O){return[...new Set([{cwd:O},{cwd:O,global:!0}].flatMap((D)=>{let j=kn(P,D);return[j.lockPath,Pa(j.configDir)]}))].filter((D)=>ka(D))}function Xf(P,O,D,j,J){if(!w(P))return[];let Y=N(P).name,re=i(D.filesystemScope,M(D.configDir,Y)),ie=r(re);if(ie!==null&&Qf(ie,Y))return[];let de=O.get(P),fe=de?em(de,Y,j.path,D.filesystemScope):null;if(fe===null)return[`Could not migrate ${P} from the v2 cache. Run \`cc-safety-net rule update ${P}${J?" --global":""}\` to vendor it.`];if(g(re,fe),ie!==null)return[`Restored ${P} from the v2 cache over an invalid file.`];return[`Vendored ${P} from the v2 cache.`]}function Qf(P,O){let D=xe(P);return!("problem"in D)&&D.rulebook.name===O}function em(P,O,D,j){let J=xa(D,Zf,`${nm(P)}--${P.digest.replace("sha256:","").slice(0,12)}`,ge),Y=r(i(j,J));if(Y===null||im(Y)!==P.digest)return null;let re=xe(Y);if("problem"in re||re.rulebook.name!==O)return null;return Y}function Pa(P){return xa(Rr(P),Yf)}function nm(P){return([P.owner,P.repo,P.display_ref,P.name].every((j)=>typeof j==="string"&&j!=="")?`${P.owner}/${P.repo}#${P.display_ref}/${P.name}`:P.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function tm(P){let O=P===null?null:om(P),D=Ra(O)&&Array.isArray(O.rulebooks)?O.rulebooks:[];return new Map(D.filter(rm).map((j)=>[j.spec,j]))}function rm(P){return Ra(P)&&typeof P.spec==="string"&&typeof P.digest==="string"}function Ra(P){return!!P&&typeof P==="object"}function om(P){try{return JSON.parse(P)}catch{return null}}function im(P){return`sha256:${Wf("sha256").update(P).digest("hex")}`}var Ea="\r\x1B[2K",sm="\x1B[?25l",am="\x1B[39m",lm="\x1B[?25h",cm=100,dm=0.55,um=80,_a=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function pm(P){return new Promise((O)=>setTimeout(O,P))}async function Er(P,O={}){let D=O.output??process.stdout;if(!D.isTTY)return P;let j=O.sleep??pm,J=!1,Y=P.then((ie)=>(J=!0,ie),(ie)=>{throw J=!0,ie});if(await Promise.race([Y.then(()=>!0),j(cm).then(()=>!1)]))return Y;D.write(sm);try{for(let ie=0;!J;ie+=1)D.write(`${Ea}${ga(ie*dm)}${_a[ie%_a.length]}${am} ${O.loadingMessage??"Loading…"}`),await Promise.race([Y,j(um)]);return await Y}finally{D.write(`${Ea}${lm}`)}}async function Ut(P,O,D,j={}){let J=O();if(P)await D();if(P&&J.ready)await Er(J.ready,j);return J.finish()}import{stripVTControlCharacters as fm}from"node:util";var _r="amp plugins list",mm=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function Aa(P){if(!P.ampPluginListOutput)return{platform:"amp",status:"n/a"};let O=fm(P.ampPluginListOutput).split(`
`).map((D)=>mm.exec(D)?.[1]).find((D)=>D!==void 0);if(!O)return{platform:"amp",status:"n/a"};if(O!=="active")return{platform:"amp",status:"disabled",method:_r,configPath:_r,errors:[`Amp personal plugin cc-safety-net is ${O}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:_r,configPath:_r}}import{existsSync as bm,readFileSync as wm}from"node:fs";import{isAbsolute as rC,join as vm}from"node:path";function Gt(P){return vm(P,".gemini","config","hooks.json")}var km=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function xm(P){if(!P||typeof P!=="object"||Array.isArray(P))return[];return Object.values(P).flatMap((O)=>{if(!O||typeof O!=="object"||Array.isArray(O))return[];let D=O,j=D.PreToolUse;if(!Array.isArray(j))return[];return j.flatMap((J)=>{if(!J||typeof J!=="object"||Array.isArray(J))return[];let Y=J.hooks;if(!Array.isArray(Y))return[];return Y.flatMap((re)=>{if(!re||typeof re!=="object"||Array.isArray(re))return[];let ie=re.command;if(typeof ie!=="string"||!km.test(ie))return[];return[{command:ie,enabled:D.enabled!==!1}]})})})}function Ta(P){let O=Gt(P.environment.home);if(!bm(O))return{platform:"antigravity-cli",status:"n/a",configPath:O};let D;try{D=xm(JSON.parse(wm(O,"utf-8")))}catch(j){return{platform:"antigravity-cli",status:"n/a",configPath:O,errors:[`Failed to parse Antigravity hooks config ${O}: ${j instanceof Error?j.message:String(j)}`]}}if(D.some((j)=>j.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:O};if(D.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:O};return{platform:"antigravity-cli",status:"n/a",configPath:O}}import{existsSync as Em}from"node:fs";import{join as qt}from"node:path";import{existsSync as Cm,lstatSync as Sm,readFileSync as Pm}from"node:fs";import{join as Rm}from"node:path";function xn(P,O=(D)=>D){if(!Cm(P))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(O(Pm(P,"utf-8")))}}catch{return{kind:"unreadable"}}}function Nn(P,O){if(P==="~")return O;if(P.startsWith("~/")||P.startsWith("~\\"))return Rm(O,P.slice(2));return P}function dn(P){try{return Sm(P)}catch{return}}function Ar(P,O){let D=dn(O);if(!D)return{platform:P,status:"n/a",configPath:O};if(!D.isSymbolicLink()&&D.isDirectory())return;return{platform:P,status:"n/a",configPath:O,errors:[`${O} is a symlink or not a directory; move or remove it before installing`]}}function tn(P,O){return typeof P==="object"&&P!==null?P[O]:void 0}var Tr="cc-safety-net@cc-marketplace";function Ir(P){return P.env.get("CLAUDE_CONFIG_DIR")||qt(P.home,".claude")}function Uo(P){return qt(Ir(P),"plugins","installed_plugins.json")}function Ia(P,O){let D=tn(tn(P,"plugins"),O);return Array.isArray(D)&&D.length>0}function $r(P,O){let D=xn(Uo(P));return D.kind==="ok"&&Ia(D.value,O)}function Or(P){let O=Uo(P),D=xn(O);if(D.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(D.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!Ia(D.value,Tr))return{platform:"claude-code",status:"n/a"};let j=qt(Ir(P),"settings.json"),J=xn(j);if(J.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(J.kind==="ok"&&tn(tn(J.value,"enabledPlugins"),Tr)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:j,errors:[`${Tr} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:O}}function $a(P){if(Or(P).status!=="configured")return;let O=xn(Uo(P)),D=O.kind==="ok"?tn(tn(O.value,"plugins"),Tr):void 0,j=(Array.isArray(D)?D:[]).filter((ie)=>tn(ie,"scope")==="user").map((ie)=>tn(ie,"installPath")).find((ie)=>typeof ie==="string");if(!j)return;let J=qt(j,".cursor-plugin","plugin.json"),Y=xn(J),re=Y.kind==="ok"?tn(Y.value,"hooks"):void 0;return typeof re==="string"&&Em(qt(j,re))?J:void 0}function Oa(P){return Or(P.environment)}var Da="Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.";function La(P){if(!P.codexPluginListOutput)return{platform:"codex",status:"n/a"};let O=P.codexPluginListOutput.split(`
`).find((D)=>D.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!O)return{platform:"codex",status:"n/a"};if(!O.includes("installed,"))return{platform:"codex",status:"n/a"};if(!O.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex runs only trusted hooks, and doctor cannot check trust. Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."]}}import{existsSync as jr,readdirSync as _m,readFileSync as Am}from"node:fs";import{join as bn}from"node:path";function vn(P){let O="",D=0,j=!1,J=!1,Y=-1;while(D<P.length){let re=P[D],ie=P[D+1];if(J){O+=re,J=!1,D++;continue}if(re==='"'&&!j){j=!0,Y=-1,O+=re,D++;continue}if(re==='"'&&j){j=!1,O+=re,D++;continue}if(re==="\\"&&j){J=!0,O+=re,D++;continue}if(j){O+=re,D++;continue}if(re==="/"&&ie==="/"){while(D<P.length&&P[D]!==`
`)D++;continue}if(re==="/"&&ie==="*"){D+=2;while(D<P.length-1){if(P[D]==="*"&&P[D+1]==="/"){D+=2;break}D++}continue}if(re===","){Y=O.length,O+=re,D++;continue}if(re==="}"||re==="]"){if(Y!==-1){let de=O.slice(Y+1);if(/^\s*$/.test(de))O=O.slice(0,Y)+de}Y=-1,O+=re,D++;continue}if(!/\s/.test(re))Y=-1;O+=re,D++}return O}function ja(P,O,D){let j=O+1,J=!1;while(j<P.length){if(J){J=!1,j++;continue}if(P[j]==="\\"){J=!0,j++;continue}if(P[j]==='"')return j+1;j++}throw Error(D)}function qo(P,O,D){let j=P[O],J=j==="["?"]":"}",Y=0,re=O;while(re<P.length){let ie=D.skipComment?.(P,re)??re;if(ie!==re){re=ie;continue}if(P[re]==='"'){re=ja(P,re,D.stringError);continue}if(P[re]===j)Y++;if(P[re]===J){if(Y--,Y===0)return re}re++}throw Error(D.bracketError)}function Fa(P,O){let D=P.lastIndexOf(`
`,O)+1;return/^[ \t]*/.exec(P.slice(D))?.[0]??""}function Ha(P,O){let D=O.end+(/^\s*/.exec(P.slice(O.end))?.[0].length??0);if(P[D]===","){let re=P[D+1]===`
`?D+2:D+1;return`${P.slice(0,O.start)}${P.slice(re)}`}let j=P.slice(0,O.start).search(/\s*$/)-1;if(P[j]!==",")return`${P.slice(0,O.start)}${P.slice(O.end)}`;let J=P.lastIndexOf(`
`,j-1),Y=J!==-1&&/^\s*$/.test(P.slice(J+1,j))?J:j;return`${P.slice(0,Y)}${P.slice(O.end)}`}function Go(P,O){if(P.startsWith("//",O)){let D=P.indexOf(`
`,O+2);return D===-1?P.length:D+1}if(P.startsWith("/*",O)){let D=P.indexOf("*/",O+2);return D===-1?P.length:D+2}return O}function Na(P,O){let D=O;while(D<P.length){if(/\s/.test(P[D]??"")){D++;continue}let j=Go(P,D);if(j===D)return D;D=j}return D}function Ma(P,O,D){let j=0,J=0;while(J<P.length){let Y=Go(P,J);if(Y!==J){J=Y;continue}if(P[J]==='"'){let re=ja(P,J,D.stringError);if(j===1&&JSON.parse(P.slice(J,re))===O){let ie=Na(P,re),de=Na(P,ie+1);if(P[ie]===":"&&P[de]==="[")return{start:de,end:qo(P,de,{skipComment:Go,...D})}}J=re;continue}if(P[J]==="{"||P[J]==="[")j++;if(P[J]==="}"||P[J]==="]")j--;J++}return}var An="cc-safety-net@cc-marketplace",Dr=["cc-marketplace","cc-safety-net"],Ua=["_direct","copilot-safety-net"],Ga=["cc-marketplace","safety-net"],qa="safety-net@cc-marketplace";function Lr(P,O){let D=O.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${D}([^a-z0-9-]|$)`,"m").test(P??"")}function Ba(P){return Lr(P,"cc-safety-net@cc-marketplace")}function Va(P){return Lr(P,"cc-marketplace")}function Ja(P){return Lr(P,"copilot-safety-net")}function Ka(P){return Lr(P,"safety-net@cc-marketplace")}function Nr(P){if(!P?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(P)}function za(P,O){if(!P)return null;let D=P.match(/(\d+)\.(\d+)\.(\d+)/);if(!D)return null;let j=[Number(D[1]),Number(D[2]),Number(D[3])];for(let J=0;J<O.length;J++){let Y=j[J]??0,re=O[J]??0;if(Y!==re)return Y>re}return!0}function Tm(P){return za(P,[0,0,422])}function Im(P){return za(P,[1,0,8])}function Vt(P){return P.env.get("COPILOT_HOME")||bn(P.home,".copilot")}function Bo(P){return(P.hooks?.preToolUse??[]).some((D)=>{if(D.type!==void 0&&D.type!=="command")return!1;return Nr(D.command)||Nr(D.bash)||Nr(D.powershell)||Nr(D.exec&&[D.exec,...D.args??[]].join(" "))})}function Bt(P){return P===void 0||typeof P==="string"}function $m(P){return P===void 0||Array.isArray(P)&&P.every((O)=>typeof O==="string")}function Om(P){if(!P||typeof P!=="object"||Array.isArray(P))return!1;let O=P;if(O.disableAllHooks!==void 0&&typeof O.disableAllHooks!=="boolean")return!1;if(O.hooks===void 0)return!0;if(!O.hooks||typeof O.hooks!=="object"||Array.isArray(O.hooks))return!1;let D=O.hooks.preToolUse;if(D===void 0)return!0;return Array.isArray(D)&&D.every((j)=>j!==null&&typeof j==="object"&&!Array.isArray(j)&&Bt(j.type)&&Bt(j.command)&&Bt(j.bash)&&Bt(j.powershell)&&Bt(j.exec)&&$m(j.args))}function Vo(P,O){try{let D=JSON.parse(vn(Am(P,"utf-8")));if(!Om(D)){O?.push(`Invalid hook config ${P}: hooks.preToolUse must be an array of hook objects`);return}return D}catch(D){O?.push(`Failed to parse ${P}: ${D instanceof Error?D.message:String(D)}`);return}}function Ya(P,O){try{return _m(P).filter((D)=>D.endsWith(".json")).sort((D,j)=>D.localeCompare(j))}catch(D){return O?.push(`Failed to read ${P}: ${D instanceof Error?D.message:String(D)}`),[]}}function Dm(P,O){if(!jr(P))return[];let D=[];for(let j of Ya(P,O)){let J=bn(P,j),Y=Vo(J,O);if(Y&&Bo(Y))D.push(J)}return D}function Rt(P,O){if(!jr(P))return;let D=Vo(P,O);if(!D)return;return{path:P,config:D}}function Wa(P,O,D,j){if(O){P.push(`GitHub Copilot CLI ${O} does not support ${D}; requires ${j}+`);return}P.push(`GitHub Copilot CLI version unavailable; skipping ${D} because it requires ${j}+`)}function Lm(P){for(let O of P){if(O?.config.disableAllHooks===!0)return O.path;if(O?.config.disableAllHooks===!1)return}return}function Nm(P,O,D,j){let J=Vt(P),Y=bn(O,".github","hooks"),re=bn(J,"hooks"),ie=bn(O,".github","copilot"),de=bn(O,".claude"),fe=Im(D),we=fe===!0?j:void 0,Ce=[Rt(bn(ie,"settings.local.json"),we),Rt(bn(ie,"settings.json"),we),Rt(bn(de,"settings.local.json"),we),Rt(bn(de,"settings.json"),we)],Se=[Rt(bn(J,"settings.json"),we),Rt(bn(J,"config.json"),we)];if(fe!==!1){let an=Lm([...Ce,...Se]);if(an){if(fe===null)j.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${an} as active`);return{activeConfigPaths:[],repoInlineSources:Ce,disabledBy:an}}}let Ie=Dm(Y,j),Ee=Tm(D),qe=Ee===!0?j:void 0,Me=jr(re)?Ya(re,qe):[],en=[];for(let an of Me){let rn=bn(re,an),fn=Vo(rn,qe);if(fn&&Bo(fn))en.push(rn)}if(Ee!==!0&&en.length>0)Wa(j,D,`user hook files in ${re}`,"0.0.422"),en.length=0;let on=[];for(let an of[...Ce,...Se]){if(!an)continue;if(!Bo(an.config))continue;if(fe===!0){on.push(an);continue}Wa(j,D,"inline hook definitions in Copilot config files","1.0.8");break}let sn=(an)=>an.filter((rn)=>!!rn&&on.includes(rn)).map((rn)=>rn.path);return{activeConfigPaths:[...sn(Ce),...Ie,...sn(Se),...en],repoInlineSources:Ce}}function Za(P){let O=[],D=Nm(P.environment,P.cwd,P.copilotCliVersion,O);if(D.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:D.disabledBy,configPaths:[D.disabledBy],errors:O.length>0?O:void 0};let j=Vt(P.environment),J=bn(j,"installed-plugins",...Dr),Y=jr(J),re=bn(j,"settings.json"),ie=xn(re,vn),de=(Ie)=>tn(tn(Ie,"enabledPlugins"),An),fe=D.repoInlineSources.find((Ie)=>typeof de(Ie?.config)==="boolean"),we=fe??(ie.kind==="ok"?{path:re,config:ie.value}:void 0);if(Y&&!fe&&ie.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};let Ce=Y&&we!==void 0&&de(we.config)===!1;if(Ce&&D.activeConfigPaths.length===0)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:we.path,errors:[`${An} is installed but not enabled in Copilot CLI`]};let Se=Y&&!Ce;if(Se||D.activeConfigPaths.length>0){let Ie=D.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:Se?"plugin config":"hook config",configPath:Ie??(Se?J:void 0),configPaths:D.activeConfigPaths.length>0?D.activeConfigPaths:void 0,errors:O.length>0?O:void 0}}return{platform:"copilot-cli",status:"n/a",errors:O.length>0?O:void 0}}import{existsSync as Qo,readdirSync as Ym,readFileSync as Zm}from"node:fs";import{join as Xo}from"node:path";import{existsSync as Yo,mkdirSync as qm,readFileSync as Bm,rmSync as Vm}from"node:fs";import{dirname as Jm,join as Fr}from"node:path";import{existsSync as jm,renameSync as Fm,statSync as Hm,writeFileSync as Mm}from"node:fs";function cn(P,O){let D=`${P}.${process.pid}.tmp`;Mm(D,O,jm(P)?{mode:Hm(P).mode&511}:{}),Fm(D,P)}import{spawn as Um}from"node:child_process";function Gm(P){return P.join(" ")}function Jo(P,O,D){return[`Failed to run ${Gm(P)}${O===null?"":` (exit ${O})`}.`,D.trim()].filter(Boolean).join(`
`)}function Ko(P){let O={stdout:"",stderr:""};return P.stdout.setEncoding("utf-8"),P.stderr.setEncoding("utf-8"),P.stdout.on("data",(D)=>{O.stdout+=D}),P.stderr.on("data",(D)=>{O.stderr+=D}),O}function gn(P,O){return new Promise((D,j)=>{let J=zn([...P],process.env),Y=Um(J.cmd,J.args,{stdio:["ignore","pipe","pipe"]}),re=Ko(Y),ie=()=>[re.stdout,re.stderr].filter(Boolean).join(`
`),de=O?.timeoutMs??120000,fe=setTimeout(()=>{Y.kill(),j(Error(Jo(P,null,`Timed out after ${de}ms.
${ie()}`.trim())))},de);Y.on("error",(we)=>{clearTimeout(fe),j(Error(Jo(P,null,`${we.message}
${ie()}`.trim())))}),Y.on("close",(we)=>{if(clearTimeout(fe),we!==0){j(Error(Jo(P,we,ie())));return}D(O?.stdoutOnly?re.stdout:ie())})})}async function Wo(P){for(let O of P)await gn(O)}async function Xa(P){for(let O of P)try{await gn(O)}catch(D){console.warn(D instanceof Error?D.message:String(D))}}var Cn=Object.fromEntries(Ht.map((P)=>[P.id,`npx -y cc-safety-net hook ${P.flags[1]}`]));var Kt=Cn.cursor,Qa=30;function Mr(P){return Fr(P.home,".cursor","hooks.json")}var Jt="cc-safety-net";function Zo(P){let O=Fr(P.home,".cursor","plugins");return{cache:Fr(O,"cache",Jt),marketplaceClone:Fr(O,"marketplaces","github.com","kenryu42","cc-safety-net")}}async function el(P){let O=Object.values(Zo(P));if(!O.some((j)=>Yo(j)))return;let D="No marketplace matches";return await gn(["cursor-agent","plugin","marketplace","remove",Jt]).catch((j)=>{if(!(j instanceof Error&&j.message.includes(D)))throw j}),O.forEach((j)=>Vm(j,{recursive:!0,force:!0})),[`Removed the ${Jt} marketplace from your Cursor account.`,"If /plugins in cursor-agent still lists CC Safety Net as installed, uninstall it there."].join(`
`)}function Yn(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function zo(){return{command:Kt,timeout:Qa,failClosed:!0}}function Hr(P){return Yn(P)&&P.command===Kt}function Km(P){return Object.keys(P).length===3&&P.command===Kt&&P.timeout===Qa&&P.failClosed===!0}function Wm(P){try{return JSON.parse(Bm(P,"utf-8"))}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${P}: ${O.message}`);throw O}}function nl(P){let O=Wm(P);if(!Yn(O))throw Error(`Cursor hooks config ${P} must be a JSON object`);if(O.version!==1)throw Error(`Cursor hooks config ${P} must set "version": 1`);if(O.hooks!==void 0&&!Yn(O.hooks))throw Error(`Cursor hooks config ${P} "hooks" must be an object`);let D=Yn(O.hooks)?O.hooks.preToolUse:void 0;if(D!==void 0&&!Array.isArray(D))throw Error(`Cursor hooks config ${P} "hooks.preToolUse" must be an array`);return O}function tl(P){let O=Yn(P.hooks)?P.hooks.preToolUse:void 0;return Array.isArray(O)?O:[]}function zm(P){if(!P.some(Hr))return[...P,zo()];return P.reduce((O,D)=>{if(!Hr(D))return O.result.push(D),O;if(!O.inserted)O.result.push(zo()),O.inserted=!0;return O},{result:[],inserted:!1}).result}function rl(P,O,D){let j=Yn(O.hooks)?O.hooks:{},J={...O,hooks:{...j,preToolUse:D}};cn(P,`${JSON.stringify(J,null,2)}
`)}function ol(P){let O=Mr(P);if(!Yo(O))return qm(Jm(O),{recursive:!0}),cn(O,`${JSON.stringify({version:1,hooks:{preToolUse:[zo()]}},null,2)}
`),{path:O,alreadyInstalled:!1};let D=nl(O),j=tl(D),J=j.filter(Hr);if(Yn(D.hooks)&&Array.isArray(D.hooks.preToolUse)&&J.length===1&&J[0]!==void 0&&Km(J[0]))return{path:O,alreadyInstalled:!0};return rl(O,D,zm(j)),{path:O,alreadyInstalled:!1}}function il(P){let O=Mr(P);if(!Yo(O))return{path:O,alreadyInstalled:!1};let D=nl(O),j=tl(D),J=j.filter((Y)=>!Hr(Y));if(J.length===j.length)return{path:O,alreadyInstalled:!1};return rl(O,D,J),{path:O,alreadyInstalled:!0}}function Xm(P){if(!P||typeof P!=="object"||Array.isArray(P))return[];let O=P.hooks;if(!O||typeof O!=="object"||Array.isArray(O))return[];let D=O.preToolUse;if(!Array.isArray(D))return[];return D.filter((j)=>!!j&&typeof j==="object"&&!Array.isArray(j)&&j.command===Kt)}function Qm(P){let O=[];if(P.length>1)O.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let D=P[0];if(D&&D.failClosed!==!0)O.push('Managed hook is missing "failClosed": true; reinstall to repair');if(D&&D.timeout!==30)O.push('Managed hook "timeout" is not 30; reinstall to repair');return O}var Ur="Claude Code plugin",ei="Cursor plugin";function eg(P){let O=Xo(Zo(P).cache,Jt);if(!Qo(O))return{};try{return{version:Ym(O).map((D)=>Xo(O,D)).find((D)=>Qo(Xo(D,".cache-complete")))}}catch{return{unreadable:O}}}function ng(P,O){if(O){let J=["Cursor records enabled plugins on your Cursor account, which doctor cannot check, and keeps a plugin's files after it is uninstalled.","Cursor pins marketplace plugins to the commit they were added at, so `cc-safety-net update` cannot update this plugin, while the npx hook (`cc-safety-net install --cursor`) stays current."].join(" ");return{method:ei,configPath:O,duplicate:`The Cursor plugin also runs this check, so every tool call is checked twice. ${J} If the plugin is installed, run \`cc-safety-net uninstall --cursor\`, uninstall CC Safety Net from /plugins in cursor-agent, then run \`cc-safety-net install --cursor\`.`,alone:`${J} If /plugins in cursor-agent does not list CC Safety Net as installed, run \`cc-safety-net install --cursor\`.`}}let D=$a(P);if(!D)return;let j="Cursor runs the Claude Code plugin only while it imports Claude Code plugins, which doctor cannot check.";return{method:Ur,configPath:D,duplicate:`The Claude Code plugin also runs this check in Cursor, so every tool call is checked twice. ${j} If Cursor runs it, run \`cc-safety-net uninstall --cursor\` to remove this hook.`,alone:`${j} If it stops, run \`cc-safety-net install --cursor\`.`}}function sl(P){let O=tg(P),D=eg(P.environment);if(D.unreadable)return O.status==="configured"?{...O,errors:[...O.errors??[],`Cannot read ${D.unreadable}, so doctor cannot tell whether the Cursor plugin also runs this check.`]}:{platform:"cursor",status:"not-inspected"};let j=ng(P.environment,D.version);if(!j)return O;if(O.status==="configured")return{...O,errors:[...O.errors??[],j.duplicate]};return{platform:"cursor",status:"configured",method:j.method,configPath:j.configPath,errors:[...O.errors??[],j.alone]}}function tg(P){let O=Mr(P.environment);if(!Qo(O))return{platform:"cursor",status:"n/a",configPath:O};let D;try{D=JSON.parse(Zm(O,"utf-8"))}catch(Y){return{platform:"cursor",status:"n/a",configPath:O,errors:[`Failed to parse Cursor hooks config ${O}: ${Y instanceof Error?Y.message:String(Y)}`]}}let j=Xm(D);if(j.length===0)return{platform:"cursor",status:"n/a",configPath:O};let J=Qm(j);return{platform:"cursor",status:"configured",method:"hook config",configPath:O,errors:J.length>0?J:void 0}}import{readdirSync as rg}from"node:fs";import{join as ni,resolve as og}from"node:path";var ti="cc-safety-net";function ri(P){let O=P.env.get("DSH_HOME");return ni(O?.trim()?og(Nn(O,P.home)):ni(P.home,".dsh"),"profiles")}function al(P){let O=ri(P),D=dn(O)?.isDirectory()?rg(O,{withFileTypes:!0}).filter((J)=>J.isDirectory()&&J.name!=="node_modules").map((J)=>{let Y=ni(O,J.name,"package.json");return{name:J.name,configPath:Y,manifest:xn(Y)}}):[];return{installed:D.flatMap((J)=>{if(J.manifest.kind!=="ok")return[];let Y=J.manifest.value;if(tn(tn(Y,"dependencies"),ti)===void 0)return[];let re=tn(tn(tn(Y,"dsh"),"profile"),"bundles");return[{name:J.name,configPath:J.configPath,enabled:Array.isArray(re)&&re.includes(ti)}]}),unreadable:D.some((J)=>J.manifest.kind==="unreadable")}}function oi(P){return al(P).installed}function ll(P){let O=al(P.environment),D=O.installed.filter((Y)=>Y.enabled),j=O.installed.filter((Y)=>!Y.enabled),J=j.map((Y)=>`${ti} is installed in the ${Y.name} profile but its bundle is disabled`);if(D.length>0)return{platform:"deepseek-harness",status:"configured",method:"dsh bundle",configPaths:D.map((Y)=>Y.configPath),...J.length>0?{errors:J}:{}};if(j.length>0)return{platform:"deepseek-harness",status:"disabled",method:"dsh bundle",configPaths:j.map((Y)=>Y.configPath),errors:J};return O.unreadable?{platform:"deepseek-harness",status:"not-inspected"}:{platform:"deepseek-harness",status:"n/a"}}import{existsSync as dg}from"node:fs";import{existsSync as ul,mkdirSync as ig,readFileSync as sg}from"node:fs";import{dirname as ag,join as ai}from"node:path";function ii(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function si(P,O){return ii(P)&&P.command===O}function cl(P,O){return ii(P)&&Array.isArray(P.hooks)&&P.hooks.some((D)=>si(D,O))}function Zn(P,O){return{hooks:[{type:"command",command:P,timeout:O}]}}function jn(P,O){return P.flatMap((D)=>{if(!ii(D)||!Array.isArray(D.hooks))return[D];let j=D.hooks.filter((J)=>!si(J,O));if(j.length===D.hooks.length)return[D];return j.length===0?[]:[{...D,hooks:j}]})}function Et(P,O,D){let j=P.filter((J)=>cl(J,O));return j.length===1&&JSON.stringify(j[0])===JSON.stringify(Zn(O,D))}function _t(P,O){return P.find((D)=>cl(D,O))}function At(P,O,D){let j=Array.isArray(P.hooks)?P.hooks.find((J)=>si(J,O)):void 0;return[...P.matcher===void 0||P.matcher===""||P.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...j?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...j?.timeout===D?[]:[`Managed hook "timeout" is not ${D}; reinstall to repair`]]}var Xn=Cn.devin,Gr=30,lg={config:{},hooks:{},preToolUse:[]};function qr(P,O=process.platform){let D=O==="win32"?P.env.get("APPDATA")||ai(P.home,"AppData","Roaming"):P.env.get("XDG_CONFIG_HOME")||ai(P.home,".config");return ai(D,"devin","config.json")}function dl(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function cg(P){try{return{ok:!0,value:JSON.parse(vn(sg(P,"utf-8")))}}catch(O){return{ok:!1,message:O instanceof Error?O.message:String(O)}}}function li(P){let O=cg(P);if(!O.ok)return`Failed to parse Devin CLI config ${P}: ${O.message}`;let D=O.value;if(!dl(D))return`Devin CLI config ${P} must be a JSON object`;let j=D.hooks===void 0?{}:D.hooks;if(!dl(j))return`Devin CLI config ${P} "hooks" must be an object`;let J=j.PreToolUse===void 0?[]:j.PreToolUse;if(!Array.isArray(J))return`Devin CLI config ${P} "hooks.PreToolUse" must be an array`;return{config:D,hooks:j,preToolUse:J}}function pl(P){let O=li(P);if(typeof O==="string")throw Error(O);return O}function fl(P,O,D){let j={...O.config,hooks:{...O.hooks,PreToolUse:D}};cn(P,`${JSON.stringify(j,null,2)}
`)}function ml(P){let O=qr(P),D=ul(O)?pl(O):lg;if(Et(D.preToolUse,Xn,Gr))return{path:O,alreadyInstalled:!0};return ig(ag(O),{recursive:!0}),fl(O,D,[...jn(D.preToolUse,Xn),Zn(Xn,Gr)]),{path:O,alreadyInstalled:!1}}function gl(P){let O=qr(P);if(!ul(O))return{path:O,alreadyInstalled:!1};let D=pl(O),j=jn(D.preToolUse,Xn);if(JSON.stringify(j)===JSON.stringify(D.preToolUse))return{path:O,alreadyInstalled:!1};return fl(O,D,j),{path:O,alreadyInstalled:!0}}function yl(P){let O=qr(P.environment);if(!dg(O))return{platform:"devin",status:"n/a",configPath:O};let D=li(O);if(typeof D==="string")return{platform:"devin",status:"n/a",configPath:O,errors:[D]};let j=_t(D.preToolUse,Xn);if(!j)return{platform:"devin",status:"n/a",configPath:O};let J=At(j,Xn,Gr);return{platform:"devin",status:"configured",method:"hook config",configPath:O,errors:J.length>0?J:void 0}}import{existsSync as yg,readFileSync as hg}from"node:fs";import{existsSync as Br,mkdirSync as ug,readFileSync as pg,rmSync as fg}from"node:fs";import{dirname as mg,join as hl}from"node:path";var Qn=Cn.droid,Vr=30;function Jr(P){return hl(P.home,".factory","hooks.json")}function vl(P){return hl(P.home,".factory","settings.json")}function ci(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function bl(P){try{return JSON.parse(pg(P,"utf-8"))}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse Factory Droid hooks config ${P}: ${O.message}`);throw O}}function wl(P){let O=bl(P);if(!ci(O))throw Error(`Factory Droid hooks config ${P} must be a JSON object`);if(O.PreToolUse===void 0||Array.isArray(O.PreToolUse))return O;throw Error(`Factory Droid hooks config ${P} "PreToolUse" must be an array`)}function gg(P){if(!Br(P))return{};let O=bl(P);return ci(O)&&ci(O.hooks)?O.hooks:{}}function kl(P){return Array.isArray(P.PreToolUse)?P.PreToolUse:[]}function xl(P,O,D){cn(P,`${JSON.stringify({...O,PreToolUse:D},null,2)}
`)}function Cl(P){let O=Jr(P),D=Br(O),j=D?wl(O):gg(vl(P)),J=kl(j);if(D&&Et(J,Qn,Vr))return{path:O,alreadyInstalled:!0};return ug(mg(O),{recursive:!0}),xl(O,j,[...jn(J,Qn),Zn(Qn,Vr)]),{path:O,alreadyInstalled:!1}}function Sl(P){let O=Jr(P);if(!Br(O))return{path:O,alreadyInstalled:!1};let D=wl(O),j=kl(D),J=jn(j,Qn);if(JSON.stringify(J)===JSON.stringify(j))return{path:O,alreadyInstalled:!1};let Y=Br(vl(P));if(J.length===0&&Object.keys(D).length===1&&!Y)return fg(O),{path:O,alreadyInstalled:!0};return xl(O,D,J),{path:O,alreadyInstalled:!0}}function Pl(P){let O=Jr(P.environment);if(!yg(O))return{platform:"droid",status:"n/a",configPath:O};let D;try{D=JSON.parse(hg(O,"utf-8"))}catch(re){return{platform:"droid",status:"n/a",configPath:O,errors:[`Failed to parse Factory Droid hooks config ${O}: ${re instanceof Error?re.message:String(re)}`]}}let j=typeof D==="object"&&D!==null&&"PreToolUse"in D?D.PreToolUse:void 0,J=_t(Array.isArray(j)?j:[],Qn);if(!J)return{platform:"droid",status:"n/a",configPath:O};let Y=[...J.commandRegex===void 0||J.commandRegex===""?[]:['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair'],...At(J,Qn,Vr)];return{platform:"droid",status:"configured",method:"hook config",configPath:O,errors:Y.length>0?Y:void 0}}import{existsSync as vg}from"node:fs";import{join as di}from"node:path";var ui="gemini-safety-net";function pi(P){let O=di(P.home,".gemini","extensions"),D=di(O,ui);if(!vg(D))return{platform:"gemini-cli",status:"n/a"};let j=di(O,"extension-enablement.json"),J=xn(j);if(J.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let Y=J.kind==="ok"?tn(tn(J.value,ui),"overrides"):void 0;if(Array.isArray(Y)&&Y.some((ie)=>typeof ie==="string"&&ie.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:j,errors:[`${ui} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:D}}function Rl(P){return pi(P.environment)}import{existsSync as xg,readFileSync as Cg}from"node:fs";import{existsSync as _l,mkdirSync as bg,readFileSync as Al,rmSync as wg}from"node:fs";import{dirname as kg,join as El}from"node:path";var rt=Cn["grok-build"],Wr=30,fi=Zn(rt,Wr);function zr(P){return El(P.env.get("GROK_HOME")??El(P.home,".grok"),"hooks","cc-safety-net.json")}function Yr(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function Tl(P){try{let O=JSON.parse(P);return Yr(O)?O:null}catch{return null}}function Il(P){let O=Yr(P.hooks)?P.hooks.PreToolUse:void 0;return Array.isArray(O)?O:[]}function Kr(P,O,D){let j=Yr(O.hooks)?O.hooks:{};cn(P,`${JSON.stringify({...O,hooks:{...j,PreToolUse:D}},null,2)}
`)}function $l(P){let O=zr(P);if(!_l(O))return bg(kg(O),{recursive:!0}),Kr(O,{},[fi]),{path:O,alreadyInstalled:!1};let D=Tl(Al(O,"utf-8"));if(!D)return Kr(O,{},[fi]),{path:O,alreadyInstalled:!1};let j=Il(D);if(Et(j,rt,Wr))return{path:O,alreadyInstalled:!0};return Kr(O,D,[...jn(j,rt),fi]),{path:O,alreadyInstalled:!1}}function Ol(P){let O=zr(P);if(!_l(O))return{path:O,alreadyInstalled:!1};let D=Tl(Al(O,"utf-8"));if(!D)return{path:O,alreadyInstalled:!1};let j=Il(D),J=jn(j,rt);if(JSON.stringify(J)===JSON.stringify(j))return{path:O,alreadyInstalled:!1};let Y=Yr(D.hooks)?D.hooks:{};if(J.length===0&&Object.keys(D).length===1&&Object.keys(Y).length===1)return wg(O),{path:O,alreadyInstalled:!0};return Kr(O,D,J),{path:O,alreadyInstalled:!0}}function Dl(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}function Ll(P){let O=zr(P.environment);if(!xg(O))return{platform:"grok-build",status:"n/a",configPath:O};let D;try{D=JSON.parse(Cg(O,"utf-8"))}catch(re){return{platform:"grok-build",status:"n/a",configPath:O,errors:[`Failed to parse Grok Build hooks config ${O}: ${re instanceof Error?re.message:String(re)}`]}}let j=Dl(D)&&Dl(D.hooks)?D.hooks.PreToolUse:void 0,J=_t(Array.isArray(j)?j:[],rt);if(!J)return{platform:"grok-build",status:"n/a",configPath:O};let Y=At(J,rt,Wr);return{platform:"grok-build",status:"configured",method:"hook config",configPath:O,errors:Y.length>0?Y:void 0}}import{readFileSync as Bl}from"node:fs";import{join as Vl}from"node:path";var Rn="cc-safety-net",mi="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",Sg=30;function Nl(P){return`${mi}
# version: ${P}
`}function Pg(P){return`${Nl(P)}name: ${Rn}
version: "${P}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function Rg(P){return`${Nl(P)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${Cn["hermes-agent"].split(" ").map((O)=>`"${O}"`).join(", ")}]
TIMEOUT_SECONDS = ${Sg}


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
`}function Wt(P){return[{name:"__init__.py",content:Rg(P)},{name:"plugin.yaml",content:Pg(P)}]}import{mkdirSync as Eg,readdirSync as _g,readFileSync as jl,rmSync as gi}from"node:fs";import{basename as Ag,dirname as Tg,join as Fn}from"node:path";var Ig="__pycache__",$g=/^[a-z0-9][a-z0-9_-]{0,63}$/;function Og(P){try{return jl(P,"utf-8").trim()}catch{return}}function yi(P){let O=P.env.get("HERMES_HOME")?.trim();if(O&&Ag(Tg(O))==="profiles")return O;let D=O||Fn(P.home,".hermes"),j=Fn(D,"active_profile"),J=Og(j),Y=J?.toLowerCase();if(!Y||Y==="default")return D;if(!$g.test(Y))throw Error(`Invalid Hermes profile name "${J}" in ${j}; run \`hermes profile use <name>\` with a valid profile.`);return Fn(D,"profiles",Y)}function hi(P){return Fn(yi(P),"plugins",Rn)}function vi(P){return P.startsWith(mi)}function bi(P,O){let D=hi(P),j=dn(D);if(j&&(j.isSymbolicLink()||!j.isDirectory()))throw Error(`Refusing to ${O} ${D}: not a regular directory. Move or remove it and rerun ${O==="install"?"install":"uninstall"} --hermes-agent.`);return D}function Fl(P,O){let D=dn(P);if(!D)return;if(D.isSymbolicLink()||!D.isFile())throw Error(`Refusing to ${O} ${P}: not a regular file. Move or remove it.`);let j=jl(P,"utf-8");if(!vi(j))throw Error(`Refusing to ${O} unmanaged file at ${P}. Move or remove it.`);return j}function Hl(P){let O=bi(P,"install"),D=Wt(pn());if(D.map((J)=>Fl(Fn(O,J.name),"overwrite")).every((J,Y)=>J===D[Y]?.content))return{path:O,alreadyInstalled:!0};return Eg(O,{recursive:!0}),D.forEach((J)=>{cn(Fn(O,J.name),J.content)}),{path:O,alreadyInstalled:!1}}function wi(P){let O=bi(P,"remove");if(!dn(O))return[];return Wt(pn()).filter((D)=>Fl(Fn(O,D.name),"remove")!==void 0)}function Ml(P){let O=bi(P,"remove");if(!dn(O))return{path:O,alreadyInstalled:!1};let D=wi(P);if(D.forEach((j)=>{gi(Fn(O,j.name))}),gi(Fn(O,Ig),{recursive:!0,force:!0}),_g(O).length===0)gi(O,{recursive:!0});return{path:O,alreadyInstalled:D.length>0}}var zt="hermes-agent",Ul=/^([^\s#][^:]*):/,Dg=/^\s+([A-Za-z_][\w-]*):/,Gl=/^\s+-\s*(.*)$/;function Lg(P){return P.trim().replace(/^(["'])(.*)\1$/,"$2")}function Ng(P){let O=P.split(/\r?\n/),D=O.findIndex((Y)=>Ul.exec(Y)?.[1]?.trim()==="plugins");if(D===-1)return[];let j=O.slice(D+1),J=j.findIndex((Y)=>Ul.test(Y));return J===-1?j:j.slice(0,J)}function ql(P,O){let D=Ng(P),j=D.findIndex((re)=>Dg.exec(re)?.[1]===O);if(j===-1)return[];let J=D.slice(j+1),Y=J.findIndex((re)=>!Gl.test(re));return(Y===-1?J:J.slice(0,Y)).map((re)=>Lg(Gl.exec(re)?.[1]??""))}function jg(P){try{return Bl(Vl(yi(P),"config.yaml"),"utf-8")}catch{return}}function ki(P){let O=jg(P)??"";return ql(O,"enabled").includes(Rn)&&!ql(O,"disabled").includes(Rn)}function Jl(P){return/^# version:\s*(.+)$/m.exec(P)?.[1]?.trim()}function Fg(P,O){let D=dn(P);if(!D)return{error:`${O.name} is missing from ${P}; run install --hermes-agent`};if(D.isSymbolicLink()||!D.isFile())return{error:`${P} is a symlink or not a regular file; move or remove it`};try{let j=Bl(P,"utf-8");if(!vi(j))return{error:`Unmanaged ${O.name} occupies ${P}; move or remove it`};if(Jl(j)===pn()&&j!==O.content)return{error:`Modified ${O.name} occupies ${P}; run install --hermes-agent to restore it`};return{content:j}}catch(j){return{error:`Failed to read ${P}: ${j instanceof Error?j.message:String(j)}`}}}function Hg(P){try{return{path:hi(P)}}catch(O){return{error:O instanceof Error?O.message:String(O)}}}function Kl(P){let O=Hg(P.environment);if("error"in O)return{platform:zt,status:"n/a",errors:[O.error]};let D=O.path,j=Ar(zt,D);if(j)return j;let J=Wt(pn()).map((de)=>Fg(Vl(D,de.name),de)),Y=J.flatMap((de)=>("error"in de)?[de.error]:[]);if(Y.length>0)return{platform:zt,status:"n/a",configPath:D,errors:Y};let re=J.some((de)=>("content"in de)&&Jl(de.content)!==pn()),ie=re?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!ki(P.environment))return{platform:zt,status:"disabled",method:"plugin directory",configPath:D,errors:[`${Rn} is not enabled in Hermes; run \`hermes plugins enable ${Rn}\``,...ie]};return{platform:zt,status:"configured",method:"plugin directory",configPath:D,errors:re?ie:void 0}}import{existsSync as Mg,readFileSync as Ug}from"node:fs";import{join as Wl}from"node:path";var Gg=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;function qg(P){return Wl(P.env.get("KIMI_CODE_HOME")||Wl(P.home,".kimi-code"),"config.toml")}function Yt(P){let O=qg(P.environment);if(!Mg(O))return{platform:"kimi-code",status:"n/a",configPath:O};try{if(!Gg.test(Ug(O,"utf-8")))return{platform:"kimi-code",status:"n/a",configPath:O}}catch(D){return{platform:"kimi-code",status:"n/a",configPath:O,errors:[`Failed to read ${O}: ${D instanceof Error?D.message:String(D)}`]}}return{platform:"kimi-code",status:"configured",method:"hook config",configPath:O}}import{readFileSync as rc}from"node:fs";import{join as Xt}from"node:path";var un="cc-safety-net",Pn="index.js",Tt="openclaw.plugin.json",It="package.json";var Zr="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as Bg,lstatSync as Vg,readdirSync as Jg,readFileSync as Kg}from"node:fs";import{dirname as zl,join as qn}from"node:path";import{fileURLToPath as Wg}from"node:url";var xi=qn("openclaw",un),it=`run \`openclaw plugins enable ${un}\``,zg="config reload superseded by a newer runtime config source",Yg=[Pn,Tt,It];function Yl(P){let O=P.env.get("OPENCLAW_HOME")?.trim();return O?Nn(O,P.home):P.home}function Zl(P){let O=Yl(P),D=P.env.get("OPENCLAW_STATE_DIR")?.trim();if(D)return Nn(D,O);let j=P.env.get("OPENCLAW_CONFIG_PATH")?.trim();return j?zl(Nn(j,O)):qn(O,".openclaw")}function Xl(P){let O=P.env.get("OPENCLAW_CONFIG_PATH")?.trim();return O?Nn(O,Yl(P)):qn(Zl(P),"openclaw.json")}function Zt(P){return qn(Zl(P),"extensions",un)}function Zg(P){let O=Jg(P);if(O.length===0)return!0;if(O.some((J)=>!Yg.includes(J)))return!1;let D=qn(P,Pn),j=dn(D);return j!==void 0&&!j.isSymbolicLink()&&j.isFile()&&Kg(D,"utf-8").startsWith(Zr)}function Ci(P){let O=Zt(P),D=dn(O);if(!D)return;if(!D.isSymbolicLink()&&D.isDirectory()&&Zg(O))return;throw Error(`Refusing to modify ${O}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function Ql(){let P=zl(Wg(import.meta.url));return[qn(P,xi),qn(P,"..",xi),qn(P,"..","..","..","dist",xi)]}function Si(P=Ql()){return P.find((O)=>Bg(O)&&Vg(O).isDirectory())}function Xg(P=Ql()){let O=Si(P);if(!O)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return O}function ec(P=Xg()){return[["openclaw","plugins","install",P,"--force","--accept-capabilities"]]}function Qg(P){let O=(()=>{try{return JSON.parse(P)}catch{return}})(),D=tn(tn(O,"plugin"),"status");return typeof D==="string"?D:void 0}async function ey(){await gn(["openclaw","plugins","enable",un]).catch((P)=>{if(!(P instanceof Error&&P.message.includes(zg)))throw P})}async function nc(P){let O=async()=>Qg(await gn(["openclaw","plugins","inspect",un,"--runtime","--json"],{stdoutOnly:!0})),D=await O(),j=D==="disabled"&&P;if(j)await ey();let J=j?await O():D;if(J==="loaded")return;throw Error(`${J===void 0?`The ${un} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:J==="disabled"?`OpenClaw reports the ${un} plugin with status "disabled"; ${it}.`:`OpenClaw reports the ${un} plugin with status "${J}".`} Run \`openclaw plugins inspect ${un} --runtime\` for details.`)}var Xr="openclaw";function $t(P,O){let D=Xt(P,O),j=dn(D);if(!j)return{error:`${O} is missing from ${D}; run install --openclaw`};if(j.isSymbolicLink()||!j.isFile())return{error:`${D} is a symlink or not a regular file; move or remove it`};try{return{content:rc(D,"utf-8")}}catch(J){return{error:`Failed to read ${D}: ${J instanceof Error?J.message:String(J)}`}}}function oc(P){try{return JSON.parse(vn(P))}catch{return}}function ny(P){let O=$t(P,Tt);if("error"in O)return O.error;if(tn(oc(O.content),"id")===un)return;return`${Xt(P,Tt)} is not a valid ${un} manifest; run install --openclaw`}function ty(P){let O=$t(P,It);if("error"in O)return O.error;let D=tn(tn(oc(O.content),"openclaw"),"extensions");if(Array.isArray(D)&&D.includes(`./${Pn}`))return;return`${Xt(P,It)} does not point OpenClaw at ${Pn}; run install --openclaw`}function tc(P){return Array.isArray(P)?P.filter((O)=>typeof O==="string"):[]}function ry(P){let O=Xl(P);if(!dn(O))return`${un} is not enabled; ${it}`;let D=(()=>{try{return JSON.parse(vn(rc(O,"utf-8")))}catch{return}})();if(D===void 0)return`Failed to read ${O}; fix it, then ${it}`;let j=tn(D,"plugins");if(tn(j,"enabled")===!1)return`plugins.enabled is false in ${O}; no OpenClaw plugin loads`;let J=tn(tn(tn(j,"entries"),un),"enabled");if(tc(tn(j,"deny")).includes(un)||J===!1)return`${un} is disabled in ${O}; ${it}`;let Y=tc(tn(j,"allow"));if(Y.length>0&&!Y.includes(un))return`plugins.allow in ${O} does not list ${un}; add it, then ${it}`;if(Y.includes(un)||J===!0)return;return`${un} is not enabled; ${it}`}function ic(P){return/^\/\/ version:\s*(.+)$/m.exec(P)?.[1]?.trim()}function oy(P,O,D){if(D===void 0)return[];let j=$t(D,Pn);if(!(("content"in j)&&ic(j.content)===O))return[];return[Pn,Tt,It].flatMap((Y)=>{let re=$t(P,Y),ie=$t(D,Y);if("error"in re||"error"in ie||re.content===ie.content)return[];return[`Modified ${Y} occupies ${Xt(P,Y)}; run install --openclaw to restore it`]})}function sc(P){let O=Zt(P.environment),D=Ar(Xr,O);if(D)return D;let j=$t(O,Pn),Y=["error"in j?j.error:j.content.startsWith(Zr)?void 0:`Unmanaged ${Pn} occupies ${Xt(O,Pn)}; move or remove it`,ny(O),ty(O)].filter((we)=>we!==void 0),re="content"in j?ic(j.content):void 0,ie=Y.length>0?Y:oy(O,re,Si());if(ie.length>0)return{platform:Xr,status:"n/a",configPath:O,errors:ie};let de=re===pn()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],fe=ry(P.environment);if(fe)return{platform:Xr,status:"disabled",method:"plugin directory",configPath:O,errors:[fe,...de]};return{platform:Xr,status:"configured",method:"plugin directory",configPath:O,errors:de.length>0?de:void 0}}import{existsSync as fy,readFileSync as my}from"node:fs";import{basename as gy}from"node:path";import{existsSync as Qr,readFileSync as Pi,rmSync as iy}from"node:fs";import{join as Tn}from"node:path";import{pathToFileURL as sy}from"node:url";var Qt="cc-safety-net",pt=`${Qt}@latest`,Ri=["opencode.json","opencode.jsonc"],ay=60,ly=250,ac="CCSafetyNetPlugin",cy={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function lc(P){return Tn(P.env.get("XDG_CONFIG_HOME")||Tn(P.home,".config"),"opencode")}function Ei(P){return P.env.get("OPENCODE_CONFIG_DIR")||lc(P)}function _i(P){return Ri.map((O)=>Tn(Ei(P),O))}function Ai(P){return[...new Set([Ei(P),lc(P)])].flatMap((O)=>Ri.map((D)=>Tn(O,D)))}function cc(P){return Tn(P.env.get("XDG_CACHE_HOME")||Tn(P.home,".cache"),"opencode","packages",pt)}function dc(P){iy(cc(P),{recursive:!0,force:!0})}async function uc(P){let O=(await gn(["opencode","--version"],{stdoutOnly:!0})).trim(),D=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(O),j=Number(D?.[1]),J=Number(D?.[2]),Y=Number(D?.[3]);if(!D||j!==1&&j!==2||j===1&&(J<18||J===18&&Y<29)||j===2&&J===0&&Y<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${O||"an unknown version"}.`);if(j===2){for(let re of _i(P)){if(!Qr(re))continue;let ie=Ii(Pi(re,"utf-8"),re);if(["plugin","plugins"].some((fe)=>{let we=tn(ie,fe);return Array.isArray(we)&&we.some((Ce)=>eo(Ce)&&(typeof Ce==="string"?Ce:tn(Ce,"package"))!==pt)}))throw Error(`Change the cc-safety-net package spec in ${re} to ${pt}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[],afterInstall:async()=>{if((await gn(["opencode","plugin","add",pt],{stdoutOnly:!0})).includes("is already configured in"))await gn(["opencode","plugin","update",pt]);let ie=await mc();if(!/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(ie))throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.");let de=["--param",`location[directory]=${process.cwd()}`];await gn(["opencode","api","integration.list",...de]);let fe=await gn(["opencode","api","plugin.list",...de],{stdoutOnly:!0}),we=Ti(fe);if(we)throw Error(we);if(!pc(fe).some(fc))throw Error("OpenCode lists no active cc-safety-net for this directory. Run `opencode api plugin.list` for details.")}}}return dc(P),{commands:[["opencode","plugin","-g","-f",pt]],afterInstall:()=>uy(P)}}function pc(P){return dy(P).filter((O)=>tn(O,"id")===Qt||eo(tn(tn(O,"source"),"target"))).map((O)=>tn(O,"state"))}function fc(P){return tn(P,"status")==="active"}function Ti(P){let O=pc(P);if(O.some(fc))return;let D=O.find((j)=>tn(j,"status")==="failed");if(!D)return;return`OpenCode reports cc-safety-net failed: ${String(tn(D,"error")).split(`
`)[0]}`}function dy(P){if(!P)return[];try{let O=tn(JSON.parse(P),"data");return Array.isArray(O)?O:[]}catch{return[]}}async function mc(P=1){let O=await gn(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s|\scc-safety-net@latest\s*$/m.test(O)||P===ay)return O;return await new Promise((D)=>setTimeout(D,ly)),mc(P+1)}async function uy(P){let O=Tn(cc(P),"node_modules",Qt),D=Tn(O,"package.json");if(!Qr(D))throw Error(`The OpenCode plugin cache at ${O} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${pt}\` for details.`);let j=tn(JSON.parse(Pi(D,"utf-8")),"main");if(typeof j!=="string")throw Error(`The cached OpenCode plugin at ${O} declares no "main" entry.`);let J=Tn(O,j);if(typeof(await import(sy(J).href))[ac]==="function")return;throw Error(`The cached OpenCode plugin at ${J} does not export a callable ${ac}, so OpenCode would load nothing and fail open.`)}function Ii(P,O){try{return JSON.parse(vn(P))}catch(D){if(D instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${O}: ${D.message}`);throw D}}function eo(P){let O=typeof P==="string"?P:tn(P,"package");return typeof O==="string"&&(O===Qt||O.startsWith(`${Qt}@`))}function $i(P){return["plugin","plugins"].some((O)=>{let D=tn(P,O);return Array.isArray(D)&&D.some(eo)})}function py(P,O){let j=["plugin","plugins"].flatMap((J)=>{let Y=Ma(P,J,cy);if(!Y)return[];let re=[],ie=0,de=Y.start+1,fe=P.slice(Y.start+1,Y.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let we of fe){if(we[0].startsWith("//")||we[0].startsWith("/*"))continue;let Ce=Y.start+1+we.index;if(ie===0)de=Ce;if(we[0]==="{"||we[0]==="[")ie++;if(we[0]==="}"||we[0]==="]")ie--;if(ie!==0||we[0]===",")continue;let Se=Ce+we[0].length;if(eo(JSON.parse(vn(P.slice(de,Se)))))re.push({start:de,end:Se})}return re}).sort((J,Y)=>J.start-Y.start).reverse().reduce((J,Y)=>{let re=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(J.slice(Y.end));if(re?.[0].includes("/")){let ie=Y.end+re[0].length-1;return J.slice(0,Y.start)+J.slice(Y.end,ie)+J.slice(ie+1)}return Ha(J,Y)},P);return Ii(j,O),j}function gc(P){dc(P);let O=Ai(P),D=O.find((Y)=>Qr(Y)),j=[],J=[];for(let Y of O){if(!Qr(Y))continue;try{let re=Pi(Y,"utf-8");if(!$i(Ii(re,Y)))continue;cn(Y,py(re,Y)),J.push(Y)}catch(re){j.push(re instanceof Error?re.message:String(re))}}if(j.length>0)throw Error(j.join(`
`));return{path:J[0]??D??Tn(Ei(P),Ri[0]),alreadyInstalled:J.length>0}}function Ot(P){let O=[];for(let D of P.openCodeVersion?.startsWith("2.")?_i(P.environment):Ai(P.environment))if(fy(D))try{let j=my(D,"utf-8"),J=vn(j),Y=JSON.parse(J);if($i(Y)){let re=Ti(P.openCodePluginListOutput);if(re)return{platform:"opencode",status:"disabled",method:"opencode api plugin.list",configPath:D,errors:[...O,re]};return{platform:"opencode",status:"configured",method:"plugin array",configPath:D,errors:O.length>0?O:void 0}}}catch(j){O.push(`Failed to parse ${gy(D)}: ${j instanceof Error?j.message:String(j)}`)}return{platform:"opencode",status:"n/a",errors:O.length>0?O:void 0}}import{join as yc}from"node:path";function Oi(P){let O=P.env.get("PI_CODING_AGENT_DIR");return yc(O?Nn(O,P.home):yc(P.home,".pi","agent"),"settings.json")}function Di(P){if(typeof P!=="string")return!1;return P==="npm:cc-safety-net"||P.startsWith("npm:cc-safety-net@")}function hc(P){let O=Oi(P.environment),D=xn(O);if(D.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(D.kind==="missing")return{platform:"pi",status:"n/a"};let j=tn(D.value,"packages");if(!Array.isArray(j))return{platform:"pi",status:"n/a"};let J=j.find((ie)=>Di(typeof ie==="string"?ie:tn(ie,"source")));if(J===void 0)return{platform:"pi",status:"n/a"};let Y=tn(J,"extensions");if(Array.isArray(Y)&&Y.some((ie)=>typeof ie==="string"&&ie.startsWith("-")))return{platform:"pi",status:"disabled",method:"package config",configPath:O,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:O}}var yy={amp:Aa,"antigravity-cli":Ta,"claude-code":Oa,codex:La,"copilot-cli":Za,cursor:sl,"deepseek-harness":ll,devin:yl,droid:Pl,"gemini-cli":Rl,"grok-build":Ll,"hermes-agent":Kl,"kimi-code":Yt,openclaw:sc,opencode:Ot,pi:hc};function Dt(P,O,D){let j={...D,cwd:O,environment:P};return gr.map((J)=>hy(yy[J](j)))}function hy(P){if(P.status==="not-inspected")return{platform:P.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:P.platform,detected:P.status!=="n/a",configured:P.status==="configured",inspectionStatus:P.status!=="n/a"?"verified":P.errors&&P.errors.length>0?"failed":"not-applicable",method:P.method,configPath:P.configPath,configPaths:P.configPaths,errors:P.errors}}import{join as vy}from"node:path";var by=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),wy=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),safety:Object.freeze({}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),ky={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function vc(P){let O=vy(P.tmpdir,"cc-safety-net-self-test"),D=by.map((j)=>{let J=G(P,u("self-test",{command:j.command},{kind:"command",shell:"auto"},{configCwd:O,executionCwd:O},j.command),{guard:{dependencies:{loadPolicySnapshot:()=>wy,getModes:()=>ky,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),Y=j.expectBlocked?"blocked":"allowed",re=J.decision.kind==="deny"?"blocked":"allowed";return{command:j.command,description:j.description,expected:Y,actual:re,passed:Y===re,reason:J.decision.kind==="deny"?J.decision.reason:void 0,ruleId:J.decision.kind==="deny"?J.decision.ruleId:void 0}});return{passed:D.filter((j)=>j.passed).length,failed:D.filter((j)=>!j.passed).length,total:D.length,results:D}}function Li(P){let O=yn({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},P);if(Dn(O.errors))return null;return{json:O.flags.json,skipUpdateCheck:O.flags.skipUpdateCheck}}async function bc(P,O={}){let D=await Ut(!O.json,()=>{let j=Cy(P,O);return{ready:j,finish:()=>j}},()=>Mt(),{loadingMessage:"Checking system status…"});if(O.json)console.log(JSON.stringify(D,null,2));else Sy(D);return D.engineSelfTest.failed>0||D.findings.some((j)=>j.severity==="error")?1:0}async function Cy(P,O){let D=O.cwd??process.cwd(),j=await Sr((Me)=>Ot({environment:P,cwd:D,openCodeVersion:Me}).status!=="n/a",void 0,D),J=Dt(P,D,{ampPluginListOutput:j.ampPluginListOutput,codexPluginListOutput:j.codexPluginListOutput,copilotCliVersion:j.versions["copilot-cli"],openCodeVersion:j.versions.opencode,openCodePluginListOutput:j.openCodePluginListOutput}),Y=Vs(P,D),re=Js(P),ie=k(P,{cwd:D}),de=ie.policy,fe=T(de,P.env),we=V(de,fe.capabilities),Ce=br(P,7),Se=Sa(P,D),Ie=[wr(D),Ct(P)].filter((Me)=>xy(Me)),Ee=O.skipUpdateCheck?{currentVersion:pn(),latestVersion:null,updateAvailable:!1}:await Gn(),qe={hooks:J,engineSelfTest:vc(P),userConfig:Y.userConfig,projectConfig:Y.projectConfig,configState:je(ie),effectiveRules:Y.effectiveRules,environment:re,effectiveSafety:{selectedPreset:de.safety.level??"standard",level:fe.effectiveLevel,capabilities:fe.capabilities,ruleOverrides:de.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(we).filter(([,Me])=>Me.source==="rule_override"&&Me.override==="off"&&Me.inheritedEnabled&&Me.changesInherited).map(([Me])=>Me),ruleCounts:{stored:Object.keys(de.destructiveCommandRuleOverrides).length,effective:Object.values(we).filter((Me)=>Me.changesInherited).length},...ie.policyScopes?{policyScopes:ie.policyScopes}:{}},...Se.length>0?{v2Leftovers:Se}:{},...Ie.length>0?{legacyConfigs:Ie}:{},posture:sa(P,Y.userConfig.path),activity:Ce,update:Ee,system:j};return{...qe,findings:Ws(qe)}}function Sy(P){console.log(),console.log(Ys(P.hooks)),console.log(),console.log(Zs(P.engineSelfTest)),console.log(),console.log(Xs(P)),console.log(),console.log(Qs(P.environment)),console.log(),console.log(ea(P)),console.log(),console.log(na(P.findings)),console.log(),console.log(ta(P.activity)),console.log(),console.log(oa(P.system)),console.log(),console.log(ra(P.update)),console.log(ia(P))}import{existsSync as Py}from"node:fs";var Ry=/^[A-Za-z0-9_@%+=:,./-]+$/,wc="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function Ni(P){let O=yn({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},P);if(Dn(O.errors))return console.error(wc),console.error("Pass -- before a command that starts with dashes."),null;if(O.values.cwd!==void 0&&!Py(O.values.cwd))return console.error(`Error: --cwd path does not exist: ${O.values.cwd}`),null;let D=O.positionals.length===1?O.positionals[0]:O.positionals.map((j)=>Ry.test(j)?j:`'${j.replaceAll("'","'\\''")}'`).join(" ");if(!D)return console.error("Error: No command provided"),console.error(wc),null;return{json:O.flags.json,cwd:O.values.cwd,command:D}}function kc(P){if(P)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function xc(P,O){let j=O-18;return[`${P.dtl}${P.dh.repeat(O)}${P.dtr}`,`${P.dv}  Command Analysis${" ".repeat(j)}${P.dv}`,`${P.dbl}${P.dh.repeat(O)}${P.dbr}`]}function ji(P){return JSON.stringify(P)}function Cc(P,O=0){return`[${P.map((j,J)=>zs(j,J,O)).join(",")}]`}function er(P,O,D=70){let j=P.split(" "),J=[],Y="";for(let re of j)if(Y&&Y.length+re.length+1>D)J.push(Y),Y=re;else Y=Y?`${Y} ${re}`:re;if(Y)J.push(Y);return J.map((re,ie)=>ie===0?re:`${O}${re}`)}function Sc(P,O,D){let j=[];switch(P.type){case"parse":return null;case"env-strip":return j.push(""),j.push(`STEP ${O} ${D.h} Strip environment variables`),j.push(`  Removed: ${P.envVars.map((J)=>`${J}=<redacted>`).join(", ")}`),j.push(`  Tokens:  ${ji(P.output)}`),{lines:j,incrementStep:!0};case"leading-tokens-stripped":return j.push(""),j.push(`STEP ${O} ${D.h} Strip wrappers`),j.push(`  Removed: ${P.removed.join(", ")}`),j.push(`  Tokens:  ${ji(P.output)}`),{lines:j,incrementStep:!0};case"shell-wrapper":return j.push(""),j.push(`STEP ${O} ${D.h} Detect shell wrapper`),j.push(`  Wrapper: ${P.wrapper} -c`),j.push(`  Inner:   ${P.innerCommand}`),{lines:j,incrementStep:!0};case"interpreter":{if(j.push(""),j.push(`STEP ${O} ${D.h} Detect interpreter`),j.push(`  Interpreter: ${P.interpreter}`),j.push(`  Code:        ${P.codeArg}`),P.paranoidBlocked)j.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:j,incrementStep:!0}}case"busybox":return j.push(""),j.push(`STEP ${O} ${D.h} Busybox wrapper`),j.push(`  Subcommand: ${P.subcommand}`),{lines:j,incrementStep:!0};case"transparent-wrapper":return j.push(""),j.push(`STEP ${O} ${D.h} Transparent wrapper`),j.push(`  Wrapper: ${P.wrapper}`),j.push(`  Tokens:  ${ji(P.output)}`),{lines:j,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(j.push(""),j.push(`STEP ${O} ${D.h} Match rules`),j.push(`  Rule:   ${P.rule}()`),P.matched)j.push("  Result: MATCHED");else j.push("  Result: No match");return{lines:j,incrementStep:!0}}case"worktree-relaxation":return j.push(""),j.push(`STEP ${O} ${D.h} Worktree relaxation`),j.push(`  Mode:   ${n.worktree.name}`),j.push(`  Git cwd: ${P.gitCwd}`),j.push("  Result: Allowed local discard in linked worktree"),{lines:j,incrementStep:!0};case"temp-root-relaxation":return j.push(""),j.push(`STEP ${O} ${D.h} Temp-root relaxation`),j.push(`  Git cwd: ${P.gitCwd}`),j.push("  Result: Allowed git discard in a temp-root repository"),{lines:j,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(P.embeddedCommandFound)return j.push(""),j.push(`STEP ${O} ${D.h} Fallback scan`),j.push(`  Found: ${P.embeddedCommandFound}`),{lines:j,incrementStep:!0};return null}case"custom-rules-check":{if(P.rulesChecked){if(j.push(""),j.push(`STEP ${O} ${D.h} Custom rules`),P.matched)j.push("  Result: MATCHED");else j.push("  Result: No match");return{lines:j,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(P.matched)return j.push(""),j.push(`STEP ${O} ${D.h} Dangerous text check`),j.push(`  Token:  ${P.token}`),j.push("  Result: MATCHED"),{lines:j,incrementStep:!0};return null}case"strict-unparseable":return j.push(""),j.push(`STEP ${O} ${D.h} Strict mode check`),j.push(`  Command: ${P.rawCommand}`),j.push("  Result:  ✗ UNPARSEABLE"),{lines:j,incrementStep:!0};case"segment-skipped":return null;case"error":return j.push(""),j.push(`ERROR: ${P.message}`),{lines:j,incrementStep:!1};default:return P}}function Fi(P,O){let D=kc(O?.asciiOnly??!1),j=58,J=[],Y=1;J.push(...xc(D,58)),J.push("");let re=P.trace.steps.find((Ee)=>Ee.type==="error");if(re&&re.type==="error"){J.push("ERROR"),J.push(`  ${re.message}`),J.push(""),J.push("RESULT"),J.push(`  Status: ${P.result==="blocked"?nn.red("BLOCKED"):nn.green("ALLOWED")}`),J.push(""),J.push("CONFIG");let Ee=P.configSource??"none";return J.push(`  Path: ${Ee}`),J.join(`
`)}let ie=P.trace.steps.find((Ee)=>Ee.type==="parse");if(ie&&ie.type==="parse"){J.push("INPUT"),J.push(`  ${ie.input}`),J.push(""),J.push(`STEP ${Y} ${D.h} Split shell commands`),Y++;for(let Ee=0;Ee<ie.segments.length;Ee++){let qe=ie.segments[Ee];if(qe){let Me=Math.random();J.push(`  Segment ${Ee+1}: ${Cc(qe,Me)}`)}}}let de=P.trace.segments,fe=de.length>1;for(let Ee of de){if(fe){J.push("");let on="";if(ie&&ie.type==="parse"){let Po=ie.segments[Ee.index];if(Po)on=Po.join(" ")}let sn=54,an=on,rn=` Segment ${Ee.index+1}: `,fn=" ";if(on){if(rn.length+on.length+fn.length>sn){let lp=sn-rn.length-fn.length;an=`${on.substring(0,lp-1)}…`}}let On=on?`${rn}${an}${fn}`:` Segment ${Ee.index+1} `,sp=on?`${rn}${nn.cyan(an)}${fn}`:On,ws=58-On.length,ks=Math.floor(ws/2),ap=ws-ks;J.push(`${D.sh.repeat(ks)}${sp}${D.sh.repeat(ap)}`)}if(Ee.steps.find((on)=>on.type==="segment-skipped")){J.push(""),J.push("  (skipped — prior segment blocked)");continue}let Me=!1,en=!1;for(let on of Ee.steps){let sn=Sc(on,Y,D);if(sn){if(en=!0,on.type==="recurse"){J.push("");let an=" RECURSING ",rn=58-an.length-4;J.push(`  ${D.tl}${D.h}${an}${D.h.repeat(rn)}`),J.push(`  ${D.v}`),Me=!0;continue}for(let an of sn.lines)if(Me)J.push(`  ${D.v} ${an}`);else J.push(an);if(sn.incrementStep)Y++}}if(Me)J.push(`  ${D.v}`),J.push(`  ${D.bl}${D.h.repeat(56)}`);if(!en)J.push(""),J.push(`  ${nn.green("✓")} Allowed (no matching rules)`)}if(J.push(""),J.push("RESULT"),P.result==="blocked"){if(J.push(`  Status: ${nn.red("BLOCKED")}`),P.customRule){if(J.push(`  Rule: ${P.customRule.id}`),P.customRule.rulebook)J.push(`  Rulebook: ${P.customRule.rulebook.name} ${P.customRule.rulebook.version}`);if(P.customRule.source)J.push(`  Source: ${P.customRule.source}`);if(P.customRule.override)J.push(`  Override: reason ${P.customRule.override.reason}`)}if(P.reason){let Ee=er(P.reason,"          ");J.push(`  Reason: ${Ee[0]}`);for(let qe=1;qe<Ee.length;qe++)J.push(Ee[qe]??"")}}else J.push(`  Status: ${nn.green("ALLOWED")}`);J.push(""),J.push("CONFIG");let we=P.configSource??"none",Ce=P.configValid?"":" (invalid)";J.push(`  Path: ${we}${Ce}`);let Se=P.safetyPresetScope;J.push(`  Safety preset: ${P.selectedPreset??"standard"}${Se?` (${kr(Se)})`:""}`),J.push(`  Effective capabilities: ${P.effectiveLevel}`);let Ie=Object.entries(P.destructiveCommandRuleOverrides??{});if(J.push(`  Rule customizations: ${Ie.length}`),P.ruleActivation)J.push(`  Rule activation: ${P.ruleActivation.id} — ${P.ruleActivation.enabled?"on":"off"} via ${P.ruleActivation.source}`);return J.join(`
`)}function Hi(P){return JSON.stringify(P,null,2)}import{resolve as Iy}from"node:path";var Ey=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function Pc(P){let O=0,D={allocateSegment(){return O++},getNextSegmentIndex(){return O},recordGlobal(j){P.record({kind:"step",scope:"global",step:j})},recordSegment(j,J=D.currentSegmentIndex){if(J===void 0)return;P.record({kind:"step",scope:"segment",segmentIndex:J,step:j})}};return D}function Rc(P={}){let O=[],D=P.maxEvents??512,j={maxTextLength:P.maxTextLength??2048,maxListLength:P.maxListLength??128,maxObjectProperties:P.maxObjectProperties??P.maxListLength??128,maxDepth:P.maxDepth??16},J,Y=new Set;return{record(re){if(J)return;if(!re||O.length>=D)return;try{O.push(Gi(_y(re,j,Y)))}catch{}},finish(){if(J)return J;return J=Gi({events:Object.freeze(O)}),J}}}function _y(P,O,D){if(P.kind!=="step")throw TypeError("invalid trace event");let{scope:j,step:J}=P;no(J,D,O);let Y=Mi(J,O,D);if(j==="global")return{kind:"step",scope:"global",step:Y};if(j!=="segment")throw TypeError("invalid trace event scope");return{kind:"step",scope:"segment",segmentIndex:P.segmentIndex,step:Y}}function no(P,O,D,j=0,J=new WeakSet){if(typeof P==="string"){let ie=P.slice(0,D.maxTextLength);if(!ze(ie))return;for(let de of nt(ie))for(let fe of de.match(/[^\s"'()$]+/g)??[])O.add(Ec(fe));return}if(!P||typeof P!=="object"||j>=D.maxDepth||J.has(P))return;if(J.add(P),Array.isArray(P)){let ie=Math.min(P.length,D.maxListLength);for(let de=0;de<ie;de++)no(P[de],O,D,j+1,J);return}let Y=0,re=new Set;for(let ie in P){if(!Object.hasOwn(P,ie))continue;if(Y>=D.maxObjectProperties)break;Y++,no(ie,O,D);let de=Ui(ie,D,O);if(re.has(de))continue;re.add(de),no(P[ie],O,D,j+1,J)}}function Mi(P,O,D,j=0,J=new WeakSet){if(typeof P==="string")return Ui(P,O,D);if(!P||typeof P!=="object")return P;if(j>=O.maxDepth)return;if(J.has(P))return;if(J.add(P),Array.isArray(P)){let ie=[],de=Math.min(P.length,O.maxListLength);for(let fe=0;fe<de;fe++)ie.push(Mi(P[fe],O,D,j+1,J));return ie}let Y={},re=0;for(let ie in P){if(!Object.hasOwn(P,ie))continue;if(re>=O.maxObjectProperties)break;re++;let de=Ui(ie,O,D);if(Object.hasOwn(Y,de))continue;Object.defineProperty(Y,de,{value:Mi(P[ie],O,D,j+1,J),enumerable:!0,configurable:!0,writable:!0})}return Y}function Ui(P,O,D){let j=P.slice(0,O.maxTextLength),J=ze(j)?Be(j):j,Y=D.size>0?Ty(J,D):J;return(Ay(Y)?Pe(Y):Y).slice(0,O.maxTextLength)}function Ay(P){return P.includes("PRIVATE KEY")||P.includes("://")||P.includes("eyJ")||P.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(P)||P.length>=14&&Ey.some((O)=>P.includes(O))||P.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(P)}function Ty(P,O){return P.replace(/[^\s"'()$]+/g,(D)=>O.has(Ec(D))?"<redacted>":D)}function Ec(P){let O=2166136261,D=2166136261;for(let j=0;j<P.length;j++)O=Math.imul(O^P.charCodeAt(j),16777619),D=Math.imul(D^P.charCodeAt(P.length-j-1),16777619);return`${O>>>0}:${D>>>0}:${P.length}`}function Gi(P){if(P&&typeof P==="object"&&!Object.isFrozen(P)){for(let O of Object.values(P))Gi(O);Object.freeze(P)}return P}function nr(P,O={},D){let j=Iy(O.cwd??process.cwd()),J=O.policySnapshot??k(D,{cwd:j,userConfigDir:O.userConfigDir}),Y=T(J.policy,D.env),re=Ue({policySnapshot:J,effectiveCapabilities:Y.capabilities,strict:Y.strict,paranoidRm:Y.paranoidRm,paranoidInterpreters:Y.paranoidInterpreters,worktreeMode:Y.worktreeMode}),ie={effectiveLevel:re.effectiveLevel,selectedPreset:J.policy.safety.level??"standard",...J.policyScopes?{safetyPresetScope:J.policyScopes.levelScope}:{},effectiveCapabilities:re.effectiveCapabilities,destructiveCommandRuleOverrides:J.policy.destructiveCommandRuleOverrides},{configSource:de,configValid:fe}=Oy(D,{cwd:j,userConfigDir:O.userConfigDir});if(!P||!P.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:de,configValid:fe,...ie};let we=y(P,"auto");if(we.status==="limited")throw new b;let Ce=we.dialect==="powershell"?y(P,"posix"):we,Se=dt(Ce),Ie=Rc(),Ee=Pc(Ie);Ee.recordGlobal({type:"parse",input:P,segments:Se.map((On)=>[...On])});let qe=u("Bash",{command:P},{kind:"command",shell:"auto"},{configCwd:j,executionCwd:j},P),Me=q(qe,{environment:D,trace:Ee,dependencies:{loadPolicySnapshot:()=>J}}),en=Me.decision.kind==="deny"?Me.decision:null;if(en&&(Me.stage==="policy-protection"||Me.stage==="secret-protection"))return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:$y(en),matched:!0,reason:en.reason}]}]},result:"blocked",reason:R(en.reason),segment:R(_c(en,P)),ruleId:R(en.ruleId),configSource:de,configValid:fe,...ie};let on=Ee.getNextSegmentIndex();if(en&&on>0&&on<Se.length)Ee.recordSegment({type:"segment-skipped",index:on,reason:"prior-segment-blocked"},on);let sn=Ie.finish(),an=en?.ruleId??Dy(qe,J,Y,D),rn=z.find((On)=>On.id===an&&On.activationCapability),fn=rn?re.policy.effectiveDestructiveCommandRules[rn.id]:void 0;return{trace:Ny(sn),result:en?"blocked":"allowed",reason:en?R(en.reason):void 0,segment:en?R(_c(en,P)):void 0,ruleId:en?R(en.ruleId):void 0,customRule:Ly(jy(en?.ruleId,J)),configSource:de,configValid:fe,...ie,...rn&&fn?{ruleActivation:{id:rn.id,...fn}}:{}}}function _c(P,O){return P.evidence?.segment??O}function $y(P){if(P.reason===He)return"policy-protection:findPolicyConfigMutationTargetInSemanticFacts";if(P.reason===Ge)return"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts";if(P.reason===x)return"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts";return"secret-protection:findSensitiveTargetInSemanticFacts"}function Oy(P,O){let D=_(O.cwd),j=W(P,O),J=X(P,{cwd:O.cwd,userConfigDir:O.userConfigDir});try{if(r(J.projectConfigTarget)!==null){if(Un(J.projectConfigTarget).errors.length===0)return{configSource:D,configValid:!0};return{configSource:D,configValid:!1}}}catch(Y){if(Y instanceof o)return{configSource:D,configValid:!1};throw Y}try{if(r(J.userConfigTarget)!==null){let Y=Un(J.userConfigTarget);return{configSource:j,configValid:Y.errors.length===0}}return{configSource:null,configValid:!0}}catch(Y){if(Y instanceof o)return{configSource:j,configValid:!1};throw Y}}function Dy(P,O,D,j){let J=O.policy,Y=_e({...J,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...J.destructiveCommandRuleOverrides,...Object.fromEntries(z.flatMap((ie)=>ie.activationCapability?[[ie.id,"on"]]:[]))}},O.state==="degraded"?{diagnostics:O.diagnostics,reason:O.reason}:void 0),re=q(P,{environment:j,dependencies:{loadPolicySnapshot:()=>Y,getModes:()=>({...D,strict:!0,paranoidRm:!0,paranoidInterpreters:!0}),findSensitiveTarget:()=>null}});return re.decision.kind==="deny"?re.decision.ruleId:void 0}function Ly(P){if(!P)return;return{id:R(P.id),...P.rulebook?{rulebook:{name:R(P.rulebook.name),version:R(P.rulebook.version)}}:{},...P.source?{source:R(P.source)}:{},...P.override?{override:{type:"reason",reason:R(P.override.reason)}}:{}}}function Ny(P){let O=P.events.flatMap((j)=>j.kind==="step"&&j.scope==="global"?[j.step]:[]),D=new Map;for(let j of P.events){if(j.kind!=="step"||j.scope!=="segment")continue;let J=D.get(j.segmentIndex)??{index:j.segmentIndex,steps:[]};J.steps.push(j.step),D.set(j.segmentIndex,J)}return{steps:O,segments:[...D.values()]}}function jy(P,O){let D=P?.replace(/^custom\./,"");if(!D||!O.policy.rules.some((j)=>j.name===D))return;return O.ruleMetadata[D]??Object.freeze({id:D})}function Ac(P){return new Promise((O)=>{process.stdout.write(`${P}
`,()=>O())})}async function Tc(P,O){let D=Ni(O);if(!D)return 1;try{let j=nr(D.command,{cwd:D.cwd},P),J=!!process.env.NO_COLOR||!process.stdout.isTTY;return await Ac(D.json?Hi(j):Fi(j,{asciiOnly:J})),0}catch(j){let J=Fy(j instanceof p?j.cause:j);if(J===void 0)throw j;if(D.json)return await Ac(JSON.stringify({error:J})),1;return console.error(J),1}}function Fy(P){if(P instanceof b)return P.message;if(P instanceof f)return P.message;if(P instanceof s&&a[P.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var Ic="2.6.6",_n="  ",ft="cc-safety-net";function $c(P){return P.argument?`${P.flags} ${P.argument}`:P.flags}function Hy(P){return Math.max(...P.map((O)=>$c(O).length))}function My(P){return Math.max(...P.map((O)=>O.usage.length))}function Uy(P){return Math.max(...P.map((O)=>`${ft} ${O.usage}`.length))}function Gy(P,O){let D=`${ft} ${P.usage}`;return`${_n}${D.padEnd(O+2)}${P.description}`}function In(P,O){return`${_n}${P.padEnd(Math.max(40,P.length+2))}${O}`}function Lt(P,O=console.log){let D=[];if(D.push(`${ft} ${P.name}`),D.push(""),D.push(`${_n}${P.description}`),D.push(""),D.push("USAGE:"),D.push(`${_n}${ft} ${P.usage}`),D.push(""),P.subcommands&&P.subcommands.length>0){D.push("SUBCOMMANDS:");let j=My(P.subcommands);for(let J of P.subcommands)D.push(`${_n}${J.usage.padEnd(j+2)}${J.description}`);D.push("")}if(P.options.length>0){D.push("OPTIONS:");let j=Hy(P.options);for(let J of P.options){let Y=$c(J),re=J.default?`${J.description} (default: ${J.default})`:J.description;D.push(`${_n}${Y.padEnd(j+2)}${re}`)}D.push("")}if(P.examples&&P.examples.length>0){D.push("EXAMPLES:");for(let j of P.examples)D.push(`${_n}${j}`)}O(D.join(`
`))}function qi(){let P=Uy(hr),O=[];O.push(`${ft} v${Ic}`),O.push(""),O.push("Blocks destructive commands and secret access."),O.push(""),O.push("COMMANDS:");for(let D of hr)O.push(Gy(D,P));O.push(""),O.push("GLOBAL OPTIONS:"),O.push(`${_n}-h, --help       Show help (use with command for command-specific help)`),O.push(`${_n}-V, --version    Show version`),O.push(""),O.push("HELP:"),O.push(`${_n}${ft} help <command>     Show help for a specific command`),O.push(`${_n}${ft} <command> --help   Show help for a specific command`),O.push(""),O.push("ENVIRONMENT VARIABLES:"),O.push(In(`${n.level.name}=standard|strict|paranoid`,"Set session safety level")),O.push(In(`${n.worktree.name}=1`,"Allow local git discards in linked worktrees")),O.push(In(`${n.debug.name}=1`,"Print diagnostic messages to stderr")),O.push(In(`${n.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),O.push(In(`${n.projectTightenOnly.name}=1`,"Ignore project policy settings that weaken the user policy")),O.push(In("CC_SAFETY_NET_HOME","Override rule config home directory")),O.push(""),O.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),O.push(In(`${n.strict.name}=1`,"Force safety.overrides.fail_closed on")),O.push(In(`${n.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),O.push(In(`${n.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),O.push(In(`${n.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),O.push(""),O.push("Documentation:        https://ccsafetynet.com/docs"),console.log(O.join(`
`))}function Oc(){console.log(Ic)}function tr(P,O=console.log){let D=vr(P);if(!D)return!1;if(D.name.toLowerCase()!==P.toLowerCase())return!1;return Lt(D,O),!0}import{existsSync as co,readFileSync as Hd}from"node:fs";import{join as lo}from"node:path";import*as Bn from"node:readline";function qy(P){return P==="install"?"Install":"Uninstall"}function By(P){return P==="install"?"Installing":"Uninstalling"}function Vy(P){return P==="install"?"into":"from"}function Nc(P){return P?.available===!0}function Jy(P,O){let D=new Set(O);return P.filter((j)=>D.has(j.target)).map((j)=>j.target)}function Dc(P,O,D){if(P.every((j)=>!j.available))return O;return Array.from({length:P.length},(j,J)=>J+1).map((j)=>(O+j*D+P.length)%P.length).find((j)=>Nc(P[j]))}function Ky(P,O,D){if(D.ctrl&&D.name==="c")return"interrupt";if(D.name==="escape"||O==="q")return"abort";if(P==="install"&&(O==="u"||O==="U"))return"update";if(D.name==="up"||O==="k")return"up";if(D.name==="down"||O==="j")return"down";if(D.name==="space"||O===" ")return"toggle";if(D.name==="return"||D.name==="enter")return"confirm";return null}function Wy(P){return{cursor:P.findIndex((O)=>O.available),selected:[]}}function zy(P,O,D){if(D==="confirm"||D==="update"||D==="abort"||D==="interrupt")return{state:P,done:D};if(D==="up")return{state:{...P,cursor:Dc(O,P.cursor,-1)}};if(D==="down")return{state:{...P,cursor:Dc(O,P.cursor,1)}};let j=O[P.cursor];if(!Nc(j))return{state:P};let J=P.selected.includes(j.target)?P.selected.filter((Y)=>Y!==j.target):Jy(O,[...P.selected,j.target]);return{state:{...P,selected:J}}}var jc="◉",Fc="◯",Hc=">",Mc=" ";function Yy(P,O,D){return["",`${qy(P)} CC Safety Net ${Vy(P)}:`,"",...O.map((j,J)=>{let Y=D.selected.includes(j.target),re=J===D.cursor,ie=Y?jc:Fc,de=re?Hc:Mc,fe=j.available?"":` (${j.unavailableReason??"not installed"})`,we=`${ie} ${j.label}${fe}`,Ce=!j.available?nn.dim(we):Y?nn.green(we):re?nn.bold(we):we;return`${de} ${Ce}`}),"",P==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":O.some((j)=>j.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${P}. q/Esc: close`].join(`
`)}var Lc=["global-hook","plugin"];function Zy(P,O,D={}){let j=D.color!==!1?nn.bold:(Y)=>Y;return["","Install the Kimi Code integration as:","",...[`Global hook — ${O?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((Y,re)=>{let ie=re===P,de=`${ie?jc:Fc} ${Y}`;return`${ie?Hc:Mc} ${ie?j(de):de}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function Uc(P){let{input:O,output:D}=P;Bn.emitKeypressEvents(O);let j=O.isRaw===!0;O.setRawMode(!0),O.resume();let J=0,Y=()=>{if(J===0)return;Bn.moveCursor(D,0,-J),Bn.cursorTo(D,0),Bn.clearScreenDown(D)},re=()=>{Y();let ie=P.render();D.write(`${ie}
`),J=ie.split(`
`).length};return new Promise((ie)=>{let de=(we)=>{O.off("keypress",fe),O.setRawMode(j),O.pause(),Y(),ie(we)};function fe(we,Ce){P.onKey(we,Ce,{finish:de,draw:re})}O.on("keypress",fe),re()})}function Gc(P={}){let O=0;return Uc({input:P.input??process.stdin,output:P.output??process.stdout,render:()=>Zy(O,P.globalHookInstalled===!0),onKey:(D,j,J)=>{if(j.ctrl&&j.name==="c"){J.finish(null),(P.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(j.name==="escape"||D==="q")return J.finish(null);if(j.name==="return"||j.name==="enter")return J.finish(Lc[O]);if(j.name==="up"||j.name==="down"||D==="k"||D==="j")O=(O+1)%Lc.length,J.draw()}})}function Bi(P=process.stdin,O=process.stdout){return Boolean(P.isTTY&&O.isTTY&&typeof P.setRawMode==="function")}function qc(P,O,D={}){let j=D.output??process.stdout,J=Wy(O);return Uc({input:D.input??process.stdin,output:j,render:()=>Yy(P,O,J),onKey:(Y,re,ie)=>{let de=Ky(P,Y,re);if(!de)return;let fe=zy(J,O,de);if(J=fe.state,fe.done==="interrupt"){ie.finish(null),(D.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(fe.done==="abort")return ie.finish(null);if(fe.done==="update")return ie.finish("update");if(fe.done==="confirm"){if(J.selected.length===0){j.write("\x07"),ie.draw();return}ie.finish([...J.selected]),j.write(`${By(P)} selected integrations...
`);return}ie.draw()}})}import{existsSync as Bc,lstatSync as Qy,mkdirSync as eh,mkdtempSync as nh,readdirSync as th,readFileSync as jt,rmSync as ro}from"node:fs";import{basename as rh,dirname as oh,join as Sn}from"node:path";import{fileURLToPath as ih}from"node:url";var Vi="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",mt="cc-safety-net",gt="cc-safety-net/index.ts";import{spawn as Xy}from"node:child_process";var Ji=(P,O)=>{let D=zn([...P],process.env);return new Promise((j)=>{let J=Xy(D.cmd,D.args,{cwd:O,stdio:["ignore","pipe","pipe"]}),Y=Ko(J),re=!1,ie=setTimeout(()=>{re=!0,J.kill()},120000);J.on("error",(de)=>{clearTimeout(ie),j({status:null,errorCode:de.code,stdout:Y.stdout,stderr:[de.message,Y.stderr].filter(Boolean).join(`
`)})}),J.on("close",(de)=>{clearTimeout(ie),j({status:re?null:de,errorCode:re?"ETIMEDOUT":void 0,stdout:Y.stdout,stderr:Y.stderr})})})};var Nt="cc-safety-net.ts",Ki=Sn("amp",gt);function sh(P){return Sn(P.home,".config","amp","plugins","cc-safety-net.ts")}function ah(){let P=oh(ih(import.meta.url)),O=Sn(P,Ki),D=Sn(P,"..",Ki),j=Sn(P,"..","..","..","dist",Ki);return[O,D,j]}function lh(P=ah()){let O=P.find((D)=>Bc(D)&&Qy(D).isFile());if(!O)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return O}function Vc(P){try{return JSON.parse(P)}catch{return}}function oo(P){return P.subarray(0,Buffer.byteLength(Vi)).toString("utf-8")===Vi}async function rr(P,O,D){let j=await P(O,D);if(j.status===0)return j;throw Error([`Failed to run ${O.join(" ")}${j.status===null?"":` (exit ${j.status})`}.`,[j.stdout,j.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Jc(P){let O=await P(["amp","plugins","repositories","--json"]);if(O.status===null)throw Error(`${O.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${O.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${O.stderr}`.trim());if(O.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${O.status}). Sign in with "amp login" and rerun install --amp.
${[O.stdout,O.stderr].filter(Boolean).join(`
`)}`.trim());let D=Vc(O.stdout),j=(Array.isArray(D)?D:[]).filter((J)=>tn(J,"scope")==="user"&&tn(J,"exists")===!0&&tn(J,"viewerCanWrite")===!0).map((J)=>tn(J,"cloneRef")).find((J)=>typeof J==="string"&&J.length>0);if(!j)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return j}async function Kc(P,O,D){let j=nh(Sn(O.tmpdir,"cc-safety-net-amp-"));try{return await rr(P,["amp","clone","user-plugins",j]),await D(j)}finally{ro(j,{recursive:!0,force:!0})}}function Wi(P){return`rerun ${P==="overwrite"?"install":"uninstall"} --amp`}function Wc(P,O,D){let j=Sn(P,O),J=dn(j);if(!J)return;if(J.isSymbolicLink()||!J.isFile())throw Error(`Refusing to ${D} ${O} in your Amp personal plugins repository: not a regular file. Remove it there and ${Wi(D)}.`);let Y=jt(j);if(oo(Y))return Y;throw Error(`Refusing to ${D} unmanaged file ${O} in your Amp personal plugins repository. Remove it there and ${Wi(D)}.`)}function zc(P,O){let D=Sn(P,mt),j=dn(D);if(!j)return;if(j.isSymbolicLink()||!j.isDirectory())throw Error(`Refusing to ${O} ${mt} in your Amp personal plugins repository: not a regular directory. Remove it there and ${Wi(O)}.`);return Wc(P,gt,O)}function ch(P){let O=Sn(P,Nt),D=dn(O);if(!D||D.isSymbolicLink()||!D.isFile())return;let j=jt(O);return oo(j)?j:void 0}async function Yc(P,O,D,j){if(await rr(P,D,O),(await rr(P,["git","status","--porcelain"],O)).stdout.trim()==="")return!1;return await rr(P,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",j],O),await rr(P,["git","push","origin","HEAD"],O),!0}function to(P,O){dh(P,O),uh(P,O)}function Zc(P,O){if(O==="keep")return;throw Error(`Local Amp plugin ${P} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function dh(P,O){let D=sh(P),j=dn(D);if(!j)return;if(!j.isSymbolicLink()&&j.isFile()&&oo(jt(D))){ro(D);return}Zc(D,O)}function uh(P,O){let D=Sn(P.home,".config","amp","plugins",mt),j=dn(D);if(!j)return;if(!j.isSymbolicLink()&&j.isDirectory()&&ph(D)){ro(D,{recursive:!0});return}Zc(D,O)}function ph(P){let O=rh(gt);if(th(P).join("\x00")!==O)return!1;let D=Sn(P,O),j=dn(D);return!!j&&!j.isSymbolicLink()&&j.isFile()&&oo(jt(D))}function fh(P){let O=l(P);if(!Bc(O))return"";let D=Vc(jt(O,"utf-8"));if(!D||typeof D!=="object"||Array.isArray(D))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(E(D,P.home))};
`}async function Xc(P,O=lh(),D=Ji){let j=Buffer.concat([jt(O),Buffer.from(fh(P),"utf-8")]),J=await Jc(D);return Kc(D,P,async(Y)=>{let re=`${J}/${mt}`,ie=zc(Y,"overwrite"),de=Wc(Y,Nt,"overwrite");if(ie?.equals(j)&&!de)return to(P,"fail"),{path:re,alreadyInstalled:!0};if(eh(Sn(Y,mt),{recursive:!0}),cn(Sn(Y,gt),j),de)ro(Sn(Y,Nt));let fe=await Yc(D,Y,["git","add","--",gt,...de?[Nt]:[]],`chore: update cc-safety-net plugin to v${pn()}`);return to(P,"fail"),{path:re,alreadyInstalled:!fe}})}async function Qc(P,O=Ji){let D=await Jc(O);return Kc(O,P,async(j)=>{let J=zc(j,"remove"),Y=ch(j),re=`${D}/${Y&&!J?Nt:mt}`;if(!J&&!Y)return to(P,"keep"),{path:re,alreadyInstalled:!1};return await Yc(O,j,["git","rm","--",...J?[gt]:[],...Y?[Nt]:[]],`chore: remove cc-safety-net plugin v${pn()}`),to(P,"keep"),{path:re,alreadyInstalled:!0}})}import{existsSync as ed,mkdirSync as mh,readFileSync as gh}from"node:fs";import{dirname as yh}from"node:path";var zi=Cn["antigravity-cli"],yt="cc-safety-net";function ht(P){return Boolean(P)&&typeof P==="object"&&!Array.isArray(P)}function so(){return{PreToolUse:[{hooks:[{type:"command",command:zi,timeout:30}]}]}}function nd(P){try{let O=JSON.parse(gh(P,"utf-8"));if(!O||typeof O!=="object"||Array.isArray(O))throw Error("Antigravity hooks config must be a JSON object");return O}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${P}: ${O.message}`);throw O}}function td(P){let O=P[yt];if(O===void 0){let j=so();return P[yt]=j,{definition:j,preToolUse:j.PreToolUse??[]}}if(!ht(O))throw Error(`Antigravity hooks config entry "${yt}" must be an object`);let D=Array.isArray(O.PreToolUse)?O.PreToolUse:[];return O.PreToolUse=D,{definition:O,preToolUse:D}}function rd(P){if(!Array.isArray(P.PreToolUse))return!1;return P.PreToolUse.some((O)=>ht(O)&&Array.isArray(O.hooks)&&O.hooks.some((D)=>ht(D)&&D.command===zi))}function hh(P){return Object.values(P).some((O)=>ht(O)&&O.enabled!==!1&&rd(O))}function vh(P){if(P[yt]===void 0)return!1;let O=td(P);if(O.definition.enabled!==!1||!rd(O.definition))return!1;return O.definition.enabled=!0,!0}function bh(P){if(P[yt]===void 0){P[yt]=so();return}let O=td(P);O.definition.enabled=!0,O.preToolUse.push(so().PreToolUse?.[0]??{hooks:[]})}function wh(P){let O=!1;for(let D of Object.values(P)){if(!ht(D)||!Array.isArray(D.PreToolUse))continue;D.PreToolUse=D.PreToolUse.flatMap((j)=>{if(!ht(j)||!Array.isArray(j.hooks))return[j];let J=j.hooks.filter((Y)=>!ht(Y)||Y.command!==zi);if(J.length!==j.hooks.length)O=!0;return J.length===0?[]:[{...j,hooks:J}]})}return O}function io(P,O){cn(P,`${JSON.stringify(O,null,2)}
`)}function od(P){let O=Gt(P.home);if(mh(yh(O),{recursive:!0}),!ed(O))return io(O,{[yt]:so()}),{path:O,alreadyInstalled:!1};let D=nd(O);if(hh(D))return{path:O,alreadyInstalled:!0};if(vh(D))return io(O,D),{path:O,alreadyInstalled:!1};return bh(D),io(O,D),{path:O,alreadyInstalled:!1}}function id(P){let O=Gt(P.home);if(!ed(O))return{path:O,alreadyInstalled:!1};let D=nd(O);if(!wh(D))return{path:O,alreadyInstalled:!1};return io(O,D),{path:O,alreadyInstalled:!0}}import{existsSync as Xi,readlinkSync as Ch}from"node:fs";import{join as Vn}from"node:path";import{spawn as kh}from"node:child_process";var $n=En.map((P)=>({target:P.id,flag:P.flag,label:mn(P.id),probeCommand:P.probeCommand}));function Yi(P){let O=new Set(P);return $n.map((D)=>D.target).filter((D)=>O.has(D))}async function sd(P,O){for(let D of P)await O(D)}var xh=5000;function or(P,O=xh){return new Promise((D)=>{let j=zn([...P],process.env),J=kh(j.cmd,j.args,{env:process.env,stdio:"ignore"}),Y=!1,re=(de)=>{if(Y)return;Y=!0,clearTimeout(ie),D(de)},ie=setTimeout(()=>{J.kill(),re(!1)},O);J.on("error",()=>re(!1)),J.on("close",(de)=>re(de===0))})}function ad(P=or,O={}){let D=new Set(O.configuredTargets??[]);return Promise.all($n.map(async(j)=>({target:j.target,flag:j.flag,label:j.label,...cd(O.action,await P(j.probeCommand)||j.target==="cursor"&&await P(Os),D.has(j.target))})))}function ld(P,O){let D=new Set(O.configuredTargets??[]);return P.map((j)=>({...j,...cd(O.action,j.available,D.has(j.target))}))}function cd(P,O,D){if(P==="uninstall")return D?{available:!0}:{available:!1,unavailableReason:"not installed"};if(P==="install"&&D)return{available:!1,unavailableReason:"already installed"};if(!O)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}var Jn="cc-safety-net",fd=["npx","-y","@deepseek-ai/dsh"],dd="DeepSeek Harness",ud=["@deepseek-ai","dsh-desktop"],md="Quit DeepSeek Harness Desktop, then run this command again: Desktop plugins can only change while it is closed.",Zi=(P)=>`DeepSeek Harness Desktop is not in its default location, so ${P} ${Jn} from its Plugins page.`,gd=(P,O)=>Xi(Vn(ri(P),O,"package.json"));function Qi(P,O){let D=O.platform??process.platform,j=gd(P,"desktop"),J=D==="darwin"?[Vn(P.home,"Applications"),O.systemApplications??"/Applications"].map((Y)=>Vn(Y,`${dd}.app`,"Contents","Resources","runtime","cli","bin","dsh")):D==="win32"?[Vn(P.env.get("LOCALAPPDATA")||Vn(P.home,"AppData","Local"),"Programs",dd,"resources","runtime","cli","bin","dsh.cmd")]:[];return{profile:j,cli:j?J.find((Y)=>Xi(Y)):void 0}}function yd(P,O=process.platform){if(O==="win32")return Xi(Vn(P.env.get("APPDATA")||Vn(P.home,"AppData","Roaming"),...ud,"lockfile"));let D=Sh(Vn(P.home,"Library","Application Support",...ud,"SingletonLock")),j=Number(/-(\d+)$/.exec(D??"")?.[1]);return Number.isInteger(j)&&j>0&&Ph(j)}function Sh(P){try{return Ch(P)}catch{return}}function Ph(P){try{return process.kill(P,0),!0}catch(O){return O.code==="EPERM"}}async function hd(P,O={}){let D=Qi(P,O);if(D.cli&&yd(P,O.platform))throw Error(md);let j=!D.cli||gd(P,"web")||await(O.probe??or)(Eo),J=[...D.cli?[{profile:"desktop",label:"Desktop",dsh:[D.cli]}]:[],...j?[{profile:"web",label:"web",dsh:fd}]:[]];return{commands:J.map((Y)=>[...Y.dsh,"plugin","--profile",Y.profile,"add",`${Jn}@${pn()}`]),afterInstall:async()=>{let Y=new Set(oi(P).filter((ie)=>ie.enabled).map((ie)=>ie.name)),re=J.filter((ie)=>!Y.has(ie.profile));if(re.length>0)throw Error(`DeepSeek Harness installed ${Jn} in the ${pd(re)} but did not enable it. Enable it from the Plugins page.`)},message:[`Added ${Jn} to the DeepSeek Harness ${pd(J)}.`,...D.profile&&!D.cli?[Zi("add")]:[]].join(`
`)}}function pd(P){return`${P.map((O)=>O.label).join(" and ")} profile${P.length>1?"s":""}`}function vd(P,O={}){let D=new Set(oi(P).map((Y)=>Y.name));if(!D.has("desktop")&&!D.has("web"))throw Error(`${Jn} is not installed in the DeepSeek Harness web or Desktop profile`);let j=D.has("desktop")?Qi(P,O).cli:void 0,J=D.has("desktop")&&!j;if(J&&!D.has("web"))throw Error(Zi("remove"));if(j&&yd(P,O.platform))throw Error(md);return{commands:[...j?[[j,"plugin","--profile","desktop","remove",Jn]]:[],...D.has("web")?[[...fd,"plugin","--profile","web","remove",Jn]]:[]],...J?{afterUninstall:()=>{throw Error(`Removed ${Jn} from the DeepSeek Harness web profile, but ${Zi("remove")}`)}}:{}}}function bd(P,O,D={}){let j=Qi(O,D).cli!==void 0;return P.map((J)=>J.target==="deepseek-harness"&&j?{...J,available:!0,unavailableReason:void 0}:J)}import{existsSync as Rh,readdirSync as Eh,rmSync as _h}from"node:fs";import{join as Ah}from"node:path";function wd(P,O=process.platform,D){if(!Rh(P))return;let j=O==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);Eh(P).filter((J)=>J!==D&&j.test(J)).forEach((J)=>{_h(Ah(P,J),{recursive:!0,force:!0})})}import{existsSync as kd,readdirSync as Th,rmSync as Ih}from"node:fs";import{join as Ft}from"node:path";function ao(P,O=process.platform){let D=Ft(P.env.get("npm_config_cache")||(O==="win32"?Ft(P.env.get("LOCALAPPDATA")||Ft(P.home,"AppData","Local"),"npm-cache"):Ft(P.home,".npm")),"_npx");if(!kd(D))return;Th(D).filter((j)=>kd(Ft(D,j,"node_modules","cc-safety-net"))).forEach((j)=>{Ih(Ft(D,j),{recursive:!0,force:!0})})}import{existsSync as Ed,mkdirSync as Oh,readFileSync as _d}from"node:fs";import{dirname as Dh,join as Rd}from"node:path";function $h(P,O){if(P[O]!=="#")return O;let D=P.indexOf(`
`,O+1);return D===-1?P.length:D+1}function es(P,O,D){let j=new RegExp(`^(\\s*)${O}\\s*=\\s*\\[`),J=0;for(let Y of P.split(`
`)){if(/^\s*\[/.test(Y))return;let re=j.exec(Y);if(re){let ie=J+re[0].lastIndexOf("[");return{start:ie,end:qo(P,ie,{skipComment:$h,...D})}}J+=Y.length+1}return}function xd(P,O,D){let j=P.slice(0,O.end).trimEnd(),J=Fa(P,O.end),Y=J===""?"     ":`${J}  `,re=!j.endsWith("[")&&!j.endsWith(",");return`${j}${re?",":""}
${Y}${D}${P.slice(O.end)}`}function Cd(P,O,D){let j=P.indexOf(D,O.start);if(j===-1||j>O.end)return P;return`${P.slice(0,j)}${P.slice(j+D.length).replace(/^\s*,/,"")}`}function Sd(P,O){let D=new RegExp(`^\\s*${O}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),j=P.split(`
`),J=j.findIndex((ie)=>/^\s*\[/.test(ie)),Y=J===-1?j:j.slice(0,J),re=J===-1?[]:j.slice(J);return[...Y.filter((ie)=>!D.test(ie)),...re].join(`
`)}function Pd(P,O,D){let j=new RegExp(`^\\s*\\[\\[${O}]]\\s*$`,"m");return P.split(/(?=^\s*\[)/m).filter((J)=>!j.test(J)||!J.includes(D)).join("").trimEnd()}var ir=Cn["kimi-code"],ns=`[[hooks]]
event = "PreToolUse"
command = "${ir}"`,Ad=`{ event = "PreToolUse", command = "${ir}" }`,Td={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function Id(P){return Rd(P.env.get("KIMI_CODE_HOME")??Rd(P.home,".kimi-code"),"config.toml")}function Lh(P){let O=es(P,"hooks",Td);if(O&&P.slice(O.start+1,O.end).trim())return xd(P,O,Ad);let D=Sd(P,"hooks").trimEnd();if(D==="")return`${ns}
`;return`${D}

${ns}
`}function $d(P){let O=Id(P);if(Oh(Dh(O),{recursive:!0}),!Ed(O))return cn(O,`${ns}
`),{path:O,alreadyInstalled:!1};let D=_d(O,"utf-8");if(D.includes(ir))return{path:O,alreadyInstalled:!0};return cn(O,Lh(D)),{path:O,alreadyInstalled:!1}}function Od(P){let O=Id(P);if(!Ed(O))return{path:O,alreadyInstalled:!1};let D=_d(O,"utf-8");if(!D.includes(ir))return{path:O,alreadyInstalled:!1};let j=es(D,"hooks",Td),J=j?Cd(D,j,Ad):`${Pd(D,"hooks",ir)}
`;return cn(O,J),{path:O,alreadyInstalled:!0}}var ts="safety-net@cc-marketplace",Dd=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),Ld=new Set(["antigravity-cli","cursor","devin","droid","grok-build","hermes-agent","kimi-code"]);function rs(P){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(P??"")}function Md(P){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(P??"")}function Nh(P){return/^Marketplace `cc-marketplace`\s*$/m.test(P??"")}var Ud={"claude-code":{installCommands:(P)=>{let O=$r(P,"cc-safety-net@cc-marketplace");return{commands:[...O?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...Or(P).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:$r(P,ts)?[["claude","plugin","uninstall",ts]]:[],update:O}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(P,O)=>{let D=O??await gn(["codex","plugin","list"]),j=Md(D);return{commands:[j||Nh(D)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:rs(D)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:j}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:Da},"copilot-cli":{installCommands:async()=>{let P=await gn(["copilot","plugin","list"]),O=[...Ja(P)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...Ka(P)?[["copilot","plugin","uninstall",qa]]:[]];if(Ba(P))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",An]],cleanupCommands:O,update:!0};return{commands:[Va(await gn(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",An]],cleanupCommands:O}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(P)=>{let O=pi(P);if(O.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(O.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:Ci,installCommands:(P)=>{let O=!co(lo(Zt(P),Pn));return{commands:ec(),afterInstall:()=>nc(O)}},uninstallCommands:[["openclaw","plugins","uninstall",un,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:uc},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]},"deepseek-harness":{installCommands:(P)=>hd(P),uninstallCommands:(P)=>vd(P)}};function Gd(P,O=(D)=>D){try{let D=JSON.parse(O(Hd(P,"utf-8")));if(!D||typeof D!=="object"||Array.isArray(D))throw Error(`Settings file ${P} must be a JSON object`);return D}catch(D){if(D instanceof SyntaxError)throw Error(`Failed to parse ${P}: ${D.message}`);throw D}}function jh(P){let O=lo(Vt(P),"settings.json");if(!co(O))return;let D=Gd(O,vn),j=D.enabledPlugins;if(!j||typeof j!=="object"||Array.isArray(j))return;if(j[An]!==!1)return;let J=Hd(O,"utf-8"),Y=J.replace(new RegExp(`("${An}"\\s*:\\s*)false`),"$1true");return j[An]=!0,cn(O,Y!==J?Y:`${JSON.stringify(D,null,2)}
`),`Enabled ${An} plugin in ${O}`}function Fh(P){let O=Oi(P);if(!co(O))return;let D=Gd(O);if(!Array.isArray(D.packages))return;let j=D.packages.find((J)=>!!J&&typeof J==="object"&&!Array.isArray(J)&&Di(J.source)&&("extensions"in J));if(!j)return;return delete j.extensions,cn(O,`${JSON.stringify(D,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${O}`}function Nd(P,O){let D=yn({label:O,booleans:Object.fromEntries($n.map((Y)=>[Y.target,[Y.flag]]))},P),j=D.errors[0];if(j)throw Error(j);let J=$n.filter((Y)=>D.flags[Y.target]).map((Y)=>Y.target);if(J.length!==1)throw Error(`Choose exactly one ${O} target: ${$n.map((Y)=>Y.flag).join(", ")}`);return J[0]}async function qd(P,O=St){let[D,j,J]=await Promise.all([O(["amp","plugins","list"],30000),O(["codex","plugin","list"],30000),O(["copilot","--binary-version"])]);return{codexPluginListOutput:j,hooks:Dt(P,process.cwd(),{ampPluginListOutput:D,codexPluginListOutput:j,copilotCliVersion:J})}}async function Hh(P,O,D=St){let j=await qd(P,D);return j.hooks.filter((J)=>O==="install"?J.configured:J.detected&&J.method!==Ur||J.inspectionStatus==="not-inspected").filter((J)=>J.platform!=="codex"||!rs(j.codexPluginListOutput)||Md(j.codexPluginListOutput)).map((J)=>J.platform)}function Mh(P,O,D,j){if(D.length>0)return{finish:async()=>[Nd(D,O)]};if(!j.selectTargets&&!Bi(j.input,j.output))return{finish:async()=>[Nd(D,O)]};let J=j.detectConfiguredTargets??(()=>Hh(P,O,j.fetchVersion)),Y=Promise.all([ad(j.probeTargets).then((re)=>bd(re,P)),J()]);return{ready:Y,finish:async()=>{let[re,ie]=await Y,de=ld(re,{action:O,configuredTargets:ie}),fe=j.selectTargets?await j.selectTargets(O,Fd(O,de)):await qc(O,Fd(O,de),{input:j.input,output:j.output});if(fe==="update")return fe;if(!fe||fe.length===0)return null;return Yi(fe)}}}async function Uh(P,O,D=!1,j){let J=Ud[P];J.beforeInstall?.(O);let Y=typeof J.installCommands==="function"?await J.installCommands(O,j):{commands:J.installCommands};return await Wo(Y.commands),await Xa(Y.cleanupCommands??[]),await Y.afterInstall?.(),[`${Y.update||D?"Updated":"Installed"} ${mn(P)} integration`,Y.message??J.postInstallMessage].filter(Boolean).join(`
`)}async function Gh(P,O){let D=Ud[P];if(!D.uninstallCommands)throw Error(`${mn(P)} uninstall is not supported`);let j=typeof D.uninstallCommands==="function"?D.uninstallCommands(O):{commands:D.uninstallCommands};return await Wo(j.commands),j.afterUninstall?.(),`Uninstalled ${mn(P)} integration`}function qh(P){let O=gc(P);return O.alreadyInstalled?`Uninstalled OpenCode plugin from ${O.path}`:`OpenCode plugin not installed in ${O.path}`}var Bd={"antigravity-cli":{install:od,uninstall:id},cursor:{install:ol,uninstall:il},devin:{install:ml,uninstall:gl},droid:{install:Cl,uninstall:Sl},"grok-build":{install:$l,uninstall:Ol},"kimi-code":{install:$d,uninstall:Od}};function Bh(P,O,D,j=!1){if(P==="install"&&!j)ao(D);let J=Bd[O][P](D),Y=mn(O),re=P!=="install"?"Uninstalled":j?"Updated":"Installed";return P==="install"&&J.alreadyInstalled?j?`${Y} hook up to date in ${J.path}`:`${Y} hook already installed in ${J.path}`:P==="uninstall"&&!J.alreadyInstalled?`${Y} hook not installed in ${J.path}`:`${re} ${Y} hook ${P==="install"?"in":"from"} ${J.path}`}var Vd={amp:{install:Xc,uninstall:Qc,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:Hl,uninstall:Ml,afterInstall:async(P)=>{let O=ki(P);return await gn(["hermes","plugins","enable",Rn,"--no-allow-tool-override"]),!O},beforeUninstall:async(P)=>{wi(P);try{await gn(["hermes","plugins","disable",Rn])}catch(O){console.warn(`${O instanceof Error?O.message:String(O)}
Removing the plugin files anyway; ${Rn} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function Vh(P,O,D,j=!1){let J=Vd[O];if(P==="uninstall")await J.beforeUninstall?.(D);let Y=P==="install"?await J.install(D):await J.uninstall(D),re=P==="install"&&await J.afterInstall?.(D),ie=mn(O),de=!re&&(P==="install"&&Y.alreadyInstalled||P==="uninstall"&&!Y.alreadyInstalled);return[de?P==="install"?`${ie} plugin ${j?"up to date":"already installed"} at ${Y.path}`:`${ie} plugin not installed at ${Y.path}`:`${P!=="install"?"Uninstalled":j?"Updated":"Installed"} ${ie} plugin ${P==="install"?"at":"from"} ${Y.path}`,de?void 0:J.restartNote].filter(Boolean).join(`
`)}var Jh={"copilot-cli":{afterInstall:jh},cursor:{afterUninstall:el},"hermes-agent":{beforeInstall:(P,O)=>{if(!O)ao(P)}},openclaw:{beforeUninstall:Ci},pi:{afterInstall:Fh}};function Kh(P){return P in Bd}function Wh(P){return P in Vd}var jd=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net/tree/plugin","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function zh(P){if(Yt({environment:P,cwd:process.cwd()}).status!=="configured")return jd;return[jd,"",nn.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function Fd(P,O){return O.map((D)=>P==="install"&&D.target==="kimi-code"&&D.unavailableReason==="already installed"?{...D,available:!0,unavailableReason:void 0,label:`${D.label} (global hook installed)`}:D)}function Yh(P,O){if(P.selectKimiInstallMethod)return P.selectKimiInstallMethod();if(!Bi(P.input,P.output))return Promise.resolve("global-hook");return Gc({input:P.input,output:P.output,globalHookInstalled:Yt({environment:O,cwd:process.cwd()}).status==="configured"})}async function Jd(P,O,D,j=!1,J){let Y=Jh[O];if(P==="install")Y?.beforeInstall?.(D,j);if(P==="uninstall")Y?.beforeUninstall?.(D);if(Kh(O))return[Bh(P,O,D,j),P==="uninstall"?await Y?.afterUninstall?.(D):void 0].filter(Boolean).join(`
`);if(Wh(O))return Vh(P,O,D,j);if(P==="uninstall")return O==="opencode"?qh(D):Gh(O,D);return[await Uh(O,D,j,J),await Y?.afterInstall?.(D)].filter(Boolean).join(`
`)}function Zh(P){let O=yn({label:"update"},P).errors[0];if(O)throw Error(O)}async function Xh(P,O=St){let D=await qd(P,O),j=lo(Vt(P),"installed-plugins");return{targets:Yi([...D.hooks.filter((Y)=>Y.platform!=="copilot-cli"&&Y.detected&&Y.method!==Ur&&Y.method!==ei).map((Y)=>Y.platform),...[Dr,Ga,Ua].flatMap((Y)=>co(lo(j,...Y))?["copilot-cli"]:[]),...$r(P,ts)?["claude-code"]:[],...rs(D.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:D.codexPluginListOutput}}async function Qh(P){let O=c(),D=P.output??process.stdout,j=(P.scriptPath??process.argv[1]??"").split(/[\\/]/),J=j.find((Ie)=>/^bunx-\d+-/.test(Ie)),Y=J!==void 0||j.includes("_npx")?null:(P.checkLatestVersion??Gn)(),re=async()=>{let Ie=Y&&await Y;if(Ie?.updateAvailable)D.write(`
Update available: cc-safety-net ${Ie.currentVersion} → ${Ie.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},ie=Xh(O,P.fetchVersion??St).then(async(Ie)=>{let Ee=new Set(Ie.targets);return{targets:Ie.targets,codexPluginListOutput:Ie.codexPluginListOutput,available:new Map(await Promise.all($n.filter((qe)=>Ee.has(qe.target)&&Dd.has(qe.target)).map(async(qe)=>[qe.target,await or(qe.probeCommand)])))}}),de=await Ut(P.showBanner??!0,()=>({ready:ie,finish:()=>ie}),()=>Mt({input:P.input??process.stdin,output:D}),{loadingMessage:"Checking installed integrations…",output:D}),fe=await Promise.resolve().then(()=>(wd(O.tmpdir,process.platform,J),null)).catch((Ie)=>sr(Ie));if(de.targets.length===0){if(D.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),fe!==null)console.error(fe);return await re(),fe===null?0:1}let we=de.targets.some((Ie)=>Ld.has(Ie))?await Promise.resolve().then(()=>(ao(O),null)).catch((Ie)=>sr(Ie)):null,Ce=await Er(Promise.all(de.targets.map((Ie)=>{if(Dd.has(Ie)&&!de.available.get(Ie))return Promise.resolve({message:`${mn(Ie)} not found; skipped`,failed:!1});if(we!==null&&Ld.has(Ie))return Promise.resolve({message:we,failed:!0});return Jd("install",Ie,O,!0,de.codexPluginListOutput).then((Ee)=>({message:Ee,failed:!1}),(Ee)=>({message:sr(Ee),failed:!0}))})),{loadingMessage:`Updating ${de.targets.length} integration${de.targets.length===1?"":"s"}…`,output:D}),Se=fe===null?Ce:[...Ce,{message:fe,failed:!0}];return Se.forEach((Ie)=>Ie.failed?console.error(Ie.message):D.write(`${Ie.message}
`)),await re(),Se.some((Ie)=>Ie.failed)?1:0}function os(P,O={}){return Promise.resolve().then(()=>Zh(P)).then(()=>Qh(O)).catch((D)=>(console.error(sr(D)),1))}async function ar(P,O,D={}){try{let j=c(),J=await Ut(!0,()=>Mh(j,P,O,D),()=>Mt({input:D.input??process.stdin,output:D.output??process.stdout}),{loadingMessage:P==="install"?"Checking available integrations…":"Checking installed integrations…",output:D.output??process.stdout});if(!J)return(D.output??process.stdout).write(`Cancelled: nothing was ${P}ed.
`),0;if(J==="update")return(D.runUpdate??(()=>os([],{fetchVersion:D.fetchVersion,input:D.input,output:D.output,showBanner:!1})))();let Y=D.output??process.stdout;return await sd(J,async(re)=>{if(re==="kimi-code"&&P==="install"){let de=await Yh(D,j);if(de===null){Y.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(de==="plugin"){Y.write(`${zh(j)}
`);return}}let ie=await Er(Jd(P,re,j),{loadingMessage:`${P==="install"?"Installing":"Uninstalling"} ${mn(re)} integration…`,output:Y});Y.write(`${ie}
`)}),0}catch(j){return console.error(sr(j)),1}}function sr(P){let O=P instanceof Error?P.message:String(P),D=typeof P==="object"&&P!==null&&"code"in P?P.code:null;if(D==="EACCES"||D==="EPERM")return`${O}
Check file permissions for the target config file and parent directory.`;if(D==="ENOENT")return`${O}
Check that the target config path and parent directory exist.`;if(D==="ENOTDIR")return`${O}
Check that every parent path component is a directory.`;return O}import{mkdirSync as iv}from"node:fs";import{dirname as sv}from"node:path";import{createInterface as av}from"node:readline";import{existsSync as Wd,readFileSync as ev}from"node:fs";function vt(P,O){let D=tt(P,O);return{policy:D.policy,errors:ce(Xe(D.issues,et,(j)=>j.kind==="custom")," "," ")}}function lr(P,O){return vt(P,O).errors}function Kd(P,O){return{"safety.level":P.safety.level,...is("safety.overrides",P.safety.overrides),"workflow.worktree_mode":String(P.workflow.worktree_mode),"destructive_command_protection.enabled":String(P.destructive_command_protection.enabled),...is("destructive_command_protection.overrides",P.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":ss(P.destructive_command_protection.allow_paths),"secret_protection.enabled":String(P.secret_protection.enabled),...is("secret_protection.overrides",P.secret_protection.overrides),"secret_protection.deny_paths":ss(P.secret_protection.deny_paths),"secret_protection.allow_paths":ss(P.secret_protection.allow_paths),...O?{"audit.retention_days":String(P.audit.retention_days)}:{}}}function uo(P,O,D){let j=Kd(P,D),J=Kd(O,D);return[...new Set([...Object.keys(j),...Object.keys(J)])].flatMap((Y)=>j[Y]===J[Y]?[]:[{field:Y,before:j[Y],after:J[Y]}])}function cr(P,O){let D=l(P,O);if(!Wd(D))return{baseline:E(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,P.home),diagnostics:[]};let j=bt(D),J=vt(j.value,P.home);return{baseline:J.policy,diagnostics:j.errors.length>0?j.errors:J.errors}}function bt(P){if(!Wd(P))return{errors:[`${P}: file not found`]};try{return{value:JSON.parse(ev(P,"utf-8")),errors:[]}}catch(O){let D=O instanceof Error?O.message:String(O);return{errors:[`${P}: ${O instanceof SyntaxError?`Invalid JSON: ${D}`:D}`]}}}function po(P,O){let D=nv(P)?P:{};return{version:O.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((j)=>D[j]!==void 0).map((j)=>[j,D[j]]))}}function is(P,O){return Object.fromEntries(Object.entries(O).flatMap(([D,j])=>j===void 0?[]:[[`${P}.${D}`,String(j)]]))}function ss(P){return P.length===0?"(none)":P.join(", ")}function nv(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}import{chmodSync as tv,existsSync as zd,mkdirSync as rv,readFileSync as Yd}from"node:fs";import{dirname as ov}from"node:path";function Zd(P,O={}){let D=l(P,O);if(!zd(D))return{path:D,exists:!1,raw:"",policy:F(),errors:[]};let j=Yd(D,"utf-8");if(!j.trim())return{path:D,exists:!0,raw:j,policy:F(),errors:["Config file is empty"]};try{let J=vt(JSON.parse(j),P.home);return{path:D,exists:!0,raw:j,policy:J.policy,errors:J.errors}}catch(J){return{path:D,exists:!0,raw:j,policy:F(),errors:[`Invalid JSON: ${J instanceof Error?J.message:String(J)}`]}}}function Hn(P,O,D={}){let j=l(P,D),J=vt(O,P.home);if(J.errors.length>0)return{path:j,policy:F(),errors:J.errors};let Y=J.policy;return rv(ov(j),{recursive:!0,mode:448}),g(se(j),`${JSON.stringify(Y,null,2)}
`,384),tv(j,384),{path:j,policy:Y,errors:[]}}function Xd(P,O){let D=vt(O,P.home);if(D.errors.length>0)return{errors:D.errors};return{preview:Le(D.policy,P.env),errors:[]}}function Qd(P,O={}){let D=l(P,O);if(!zd(D))return Hn(P,te,O);let j=Yd(D,"utf-8");if(!j.trim())return Hn(P,te,O);try{return Hn(P,E(JSON.parse(j),P.home),O)}catch{return Hn(P,te,O)}}var eu=new Set(["check","apply"]),nu="(unset)";async function ru(P,O,D={}){let j=yn({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},O),J=j.positionals[0],Y=[...j.errors,...J&&!eu.has(J)?[`Unknown policy subcommand: ${J}`]:[],...J&&eu.has(J)&&!j.positionals[1]?[`policy ${J} requires a file`]:[],...j.positionals.slice(2).map((qe)=>`Unexpected policy argument: ${qe}`)];if(Y.length>0){for(let qe of Y)console.error(qe);return 1}let re=j.positionals[1];if(!J||!re)return Lt(yr,console.error),1;let ie=D.cwd??process.cwd(),de=j.flags.global?l(P):h(ie);if(!j.flags.global&&L(P,{cwd:ie}))return console.error(`${de} is the user policy, not a project policy; use --global for the user scope, or run from a project directory`),1;let fe=bt(re),we=[...fe.errors,...lr(fe.value,P.home).map((qe)=>`${re}: ${qe}`),...!j.flags.global&&dv(fe.value)&&fe.value.audit!==void 0?[`${re}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(we.length>0){for(let qe of we)console.error(qe);return 1}let Ce=E(fe.value,P.home);if(console.log(`Scope: ${j.flags.global?"user":"project"} (${de})`),console.log(`Proposal: ${re}`),j.flags.global)tu(E(bt(de).value,P.home),Ce,!0);if(!j.flags.global){let qe=cr(P).baseline;console.log("Effective policy (user + project merged):"),tu(ee(qe,ue(bt(de).value,P.home).policy).policy,ee(qe,ue(fe.value,P.home).policy).policy,!1)}if(J==="check")return 0;let Se=D.input??process.stdin,Ie=D.output??process.stdout;if(!Se.isTTY||!Ie.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${re}${j.flags.global?" --global":""}`),1;if(!await lv(`Apply this policy to ${de}? [y/N] `,Se,Ie))return console.log("Cancelled; nothing was written."),0;return cv(P,de,fe.value,Ce,j.flags.global),console.log(`Policy applied: ${de}`),0}function lv(P,O,D){let j=av({input:O,output:D,terminal:!1});return new Promise((J)=>{j.once("close",()=>J(!1)),j.question(P,(Y)=>{J(/^y(es)?$/i.test(Y.trim())),j.close()})})}function cv(P,O,D,j,J){if(J){Hn(P,j);return}iv(sv(O),{recursive:!0}),wn(O,po(D,j))}function tu(P,O,D){let j=uo(P,O,D);if(j.length===0){console.log("No changes.");return}console.log(`Changes (${j.length}):`);for(let J of j)console.log(`  ${J.field}: ${J.before??nu} -> ${J.after??nu}`)}function dv(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}import{join as Cb}from"node:path";var ou="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- `caffeinate`, `exec`, `nice`, `nohup`, `setsid`, `stdbuf`, `time`, and `timeout` are built-in transparent wrappers and need no configuration. Configure only other wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function fo(P,O){if(!P.ok){cu(P);return}au(P,O)}function su(P,O,D){if(P.ok)console.log(D);if(!P.add){fo(P,`Added rulebook source: ${O}`);return}if(!P.ok){cu(P);return}if(P.add.added.length>0)console.log(`Added ${P.add.added.length} ${P.add.added.length===1?"rulebook":"rulebooks"} from ${P.add.source} at ${P.add.ref}:`),P.add.added.forEach((j)=>{console.log(`  - ${j}`)});if(P.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${P.add.source} at ${P.add.ref}: ${P.add.alreadyConfigured.join(", ")}`);if(P.add.commits.length>0)console.log(`Vendored at ${P.add.commits.map((j)=>j.slice(0,7)).join(", ")}.`);au(P,"Rule config updated.")}function au(P,O){for(let D of P.changes??[])console.log(D);console.log(O),console.log(""),uv(P.entries)}function uv(P){if(P.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${P.length}):`);for(let O of P)console.log(`  - ${O.name} ${O.version} (${pv(O.ruleCount)})`),console.log(`    Source: ${O.spec}`)}function pv(P){return`${P} ${P===1?"rule":"rules"}`}function lu(P){wt("Active sources",P.rulebooks,(O)=>[`[${O.source}] ${O.name} ${O.version}`,`  Source: ${O.spec}`]),wt("Active rules",P.rules,(O)=>[`[${mv(P,O.name)}] ${O.name}`,...fv(O),`  Reason: ${O.reason}`]),wt("Disabled rules",iu(P,"off"),(O)=>[O.key]),wt("Reason overrides",iu(P,"reason"),(O)=>[O.key,`  Reason: ${O.value.reason}`]),wt("Transparent wrappers",P.transparent_wrappers,(O)=>[O]),wt("Issues",P.errors,(O)=>[O]),wt("Warnings",P.warnings,(O)=>[O])}function wt(P,O,D){if(O.length===0){console.log(`${P}: (none)`);return}console.log(`${P} (${O.length}):`);for(let j of O){let[J,...Y]=D(j);console.log(`  - ${J}`);for(let re of Y)console.log(`    ${re}`)}}function fv(P){if(!P.match)return[`  Command: ${P.subcommand?`${P.command} ${P.subcommand}`:P.command}`,`  Block args: ${P.block_args.join(", ")}`];return[`  Command: ${[P.command,...P.match.command_path].join(" ")}`,...P.match.any_args?[`  Any args: ${P.match.any_args.join(", ")}`]:[],...P.match.exclude_args?[`  Exclude args: ${P.match.exclude_args.join(", ")}`]:[]]}function mv(P,O){return P.rulebooks.find((D)=>D.rules.includes(O))?.source??"project"}function iu(P,O){return Object.entries({...P.userConfig?.overrides,...P.projectConfig?.overrides}).filter((D)=>{if(O==="off")return D[1]==="off";return!!D[1]&&typeof D[1]==="object"}).map(([D,j])=>({key:D,value:j}))}function cu(P){for(let O of P.errors)console.error(O)}import{dirname as $u,join as ko}from"node:path";import{join as us,resolve as Rv}from"node:path";function as(P){let O=m(P);if(O.errors.length>0)return{ok:!1,result:{ok:!1,errors:O.errors,entries:[]}};return{ok:!0,config:O.config??ut}}function du(P){wn(P,{version:1,rules:[],overrides:{},transparent_wrappers:[]})}function uu(P){wn(P,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as ho}from"node:path";var gv="custom.";function mo(P){if(P.rulebook_version!==2)return[];let O=P.rules.map((D)=>({name:D.name,command:D.command,block_args:[],match:D.match,reason:D.reason,intent:D.intent}));return(P.tests??[]).flatMap((D,j)=>{let J=ls(y(D.command));if(J.length===0)return[`tests[${j}]: could not parse fixture command: ${D.command}`];let Y=J.reduce((re,ie)=>re??A(ie,O)?.id.slice(gv.length),void 0);if(D.expect==="blocked"){if(Y===D.rule)return[];let re=Y?`"${Y}" matched first`:"no rule matched";return[`tests[${j}]: expected "${D.rule}" to block "${D.command}" but ${re}`]}return Y?[`tests[${j}]: expected "${D.command}" to be allowed but "${Y}" matched`]:[]})}function ls(P){return P.nodes.flatMap((O)=>{if(O.kind==="group"||O.kind==="function")return ls(O.body);if(O.kind!=="command")return[];let D=ve(ne(O.dialect,O.words)).words.map(t);return[...D.length>0?[D]:[],...O.nested.flatMap((j)=>ls(j))]})}var go=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function yo(P={}){return{requests:0,responseBytes:0,maxRequests:P.maxRequests??go.maxRequests,maxResponseBytes:P.maxResponseBytes??go.maxResponseBytes}}function Mn(P){return{controller:new AbortController,budget:yo(),resolveUrl:P}}function pu(P){return P instanceof Error&&P.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function fu(P){if(P.requests>=P.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");P.requests++}function mu(P,O){if(O>P.maxResponseBytes-P.responseBytes)throw P.responseBytes+=O,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");P.responseBytes+=O}var hu=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function gu(P,O,D=S(ho(ho(O)),"rules policy"),j=Mn()){if(w(P))return bv(P,j);return vv(P,O,D)}async function vu(P,O,D,j,J,Y){if(!w(P))return gu(P,O,D,j);let re=J?null:yv(P,O,D);if(re)return re;if(!J&&!Y)throw Error(`${P} is not vendored; run rule update ${P} to vendor it`);return gu(P,O,D,j)}function yv(P,O,D=S(ho(ho(O)),"rules policy")){let j=N(P),J=M(O,j.name),Y=r(i(D,J));if(Y===null)return null;let re=le(cs(Y,`Invalid rulebook ${J}.`));if(re.name!==j.name)throw Error(`rulebook name "${re.name}" in ${J} must match "${j.name}"`);return{spec:P,rulebook:re,content:Y}}async function bu(P,O={}){if(!Z(P))throw Error(`Invalid GitHub repository source: ${P}`);let[D,j]=P.split("/");if(!D||!j)throw Error(`Invalid GitHub repository source: ${P}`);if(O.ref!==void 0&&!ae(O.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${O.ref}`);let J=O.operation??Mn(),Y=O.ref??await hv(D,j,P,J),re=await ku(D,j,Y,P,J),ie=await vo(`https://api.github.com/repos/${D}/${j}/git/trees/${re}?recursive=1`,"tree",J),de=ie.response;if(!de.ok)throw Error(`Failed to inspect ${P}: GitHub tree returned ${de.status}`);let fe=JSON.parse(ie.content);if(!Array.isArray(fe?.tree))throw Error(`Failed to inspect ${P}: unexpected GitHub tree response`);let we=fe.tree,Ce=[...new Set(we.flatMap((Se)=>{if(!Se||typeof Se!=="object")return[];let Ie=Se;if(Ie.type!=="blob"||typeof Ie.path!=="string")return[];let Ee=Ie.path.match(ct);return Ee?.[1]?[Ee[1]]:[]}))].sort();if(Ce.length===0)throw Error(`No rulebooks found in ${P} under ${he}/`);return{source:P,owner:D,repo:j,ref:Y,commit:re,names:Ce}}async function hv(P,O,D,j){let J=await vo(`https://api.github.com/repos/${P}/${O}`,"metadata",j),Y=J.response;if(!Y.ok)throw Error(`Failed to inspect ${D}: GitHub returned ${Y.status}`);let ie=JSON.parse(J.content)?.default_branch;if(typeof ie!=="string"||ie==="")throw Error(`Failed to inspect ${D}: missing default branch`);if(!ae(ie))throw Error(`GitHub returned an invalid default branch: ${ie}`);return ie}function vv(P,O,D){lt(P);let j=M(O,P),J=r(i(D,j));if(J===null)throw Error(`Rulebook source not found: ${P}`);let Y=wu(cs(J,"Invalid local rulebook source."));if(Y.name!==P)throw Error(`rulebook name "${Y.name}" must match local source "${P}"`);return{spec:P,rulebook:Y,content:J}}async function bv(P,O){let D=N(P),j=await ku(D.owner,D.repo,D.ref,P,O),J=await vo(`https://raw.githubusercontent.com/${D.owner}/${D.repo}/${j}/${D.path}`,"raw",O),Y=J.response;if(!Y.ok)throw Error(`Failed to fetch ${P}: GitHub raw returned ${Y.status}`);let re=J.content,ie=wu(cs(re,"Invalid GitHub rulebook response."));if(ie.name!==D.name)throw Error(`rulebook name "${ie.name}" must match GitHub source "${D.name}"`);return{spec:P,rulebook:ie,content:re}}function wu(P){let O=le(P),D=mo(O);if(D.length>0)throw Error(D.join("; "));return O}function cs(P,O){try{return JSON.parse(P)}catch{throw Error(O)}}async function ku(P,O,D,j,J){let Y=await vo(`https://api.github.com/repos/${P}/${O}/commits/${encodeURIComponent(D)}`,"commit",J),re=Y.response;if(!re.ok)throw Error(`Failed to resolve ${j}: GitHub returned ${re.status}`);let ie=JSON.parse(Y.content);if(typeof ie?.sha!=="string"||ie.sha==="")throw Error(`Failed to resolve commit for ${j}`);return ie.sha}async function wv(P,O,D={}){if(D.signal?.aborted)throw D.signal.reason;let j=D.budget??yo(),J=new AbortController,Y=()=>J.abort(D.signal?.reason);D.signal?.addEventListener("abort",Y,{once:!0});let re=!1,ie=setTimeout(()=>{if(J.signal.aborted)return;re=!0,J.abort()},D.timeoutMs??hu.timeoutMs);try{if(D.signal?.aborted)throw D.signal.reason;fu(j);let de=await fetch(P,{signal:J.signal,redirect:"error"});if(!de.ok)return xu(de),{response:de,content:""};return{response:de,content:await kv(de,O,j,()=>J.abort())}}catch(de){if(re)throw Error("GitHub request timed out",{cause:de});if(D.signal?.aborted)throw D.signal.reason;throw de}finally{clearTimeout(ie),D.signal?.removeEventListener("abort",Y)}}function vo(P,O,D){return wv(D.resolveUrl?.(P)??P,O,{budget:D.budget,signal:D.controller.signal})}async function kv(P,O,D=yo(),j){let J=hu[`${O}Bytes`],Y=Number(P.headers.get("content-length"));if(Number.isFinite(Y)&&Y>J)throw xu(P),Error(`GitHub ${O} response exceeds ${J} bytes`);if(!P.body)return"";let re=P.body.getReader(),ie=[],de=0;while(!0){let fe=await re.read();if(fe.done)break;try{mu(D,fe.value.byteLength)}catch(we){throw j?.(),yu(re),we}if(de+=fe.value.byteLength,de>J)throw j?.(),yu(re),Error(`GitHub ${O} response exceeds ${J} bytes`);ie.push(Buffer.from(fe.value))}return Buffer.concat(ie,de).toString("utf-8")}function xu(P){if(!P.body)return;Cu(()=>P.body?.cancel())}function yu(P){Cu(()=>P.cancel())}function Cu(P){try{Promise.resolve(P()).catch(()=>{})}catch{}}var xv=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function Su(P,O){let D=Eu(P.rules,O);if(D.length>0)return{ok:!0,specs:D};return Ru(P.rules,O)}function Pu(P,O){let D=Eu(P,O);if(D.length>0)return{ok:!0,specs:D};let j=Sv(P,O);if(j.length>0)return{ok:!0,specs:j};let J=Pv(P,O);if(!J.ok)return J;if(J.specs.length>0)return{ok:!0,specs:J.specs};return Ru(P,O)}function Ru(P,O){let D=P.filter((j)=>ds(j)?.name===O);if(D.length===1)return{ok:!0,specs:D};return Cv(O,D)}function Cv(P,O){return{ok:!1,result:{ok:!1,errors:O.length===0?[`No configured rulebook matches ${P}`]:[`Ambiguous rulebook match ${P}: ${O.join(", ")}`],entries:[]}}}function Eu(P,O){return P.filter((D)=>D===O)}function Sv(P,O){let D=O.match(xv),j=D?.[1],J=D?.[2],Y=D?.[3];if(!j||!J||!Y||!ae(Y))return[];return _u(P,(re)=>re.owner===j&&re.repo===J&&re.ref===Y)}function Pv(P,O){if(!Z(O))return{ok:!0,specs:[]};let[D,j]=O.split("/"),J=_u(P,(re)=>re.owner===D&&re.repo===j);if(new Set(J.map((re)=>ds(re)?.ref).filter((re)=>!!re)).size<2)return{ok:!0,specs:J};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${O}. Use an explicit ref:`,`  cc-safety-net rule remove ${O}#<ref>`],entries:[]}}}function ds(P){try{return N(P)}catch{return null}}function _u(P,O){return P.filter((D)=>{let j=ds(D);return j?O(j):!1})}async function wo(P,O={}){let D=ps(O);return Ev(P,D,await bo(P,D,Mn()))}function Ev(P,O,D){if(!D.ok)return D;let j=kn(P,O),J=[...new Set(B(j.configPath,j.filesystemScope))];if(J.length===0)return D;return{ok:!1,errors:J,entries:D.entries}}async function bo(P,O,D,j={},J=new Set,Y=new Set){try{let re=kn(P,O),ie=as(re.configTarget);if(!ie.ok)return ie.result;let de=ie.config,fe=O.only?Su(de,O.only):{ok:!0,specs:de.rules};if(!fe.ok)return fe.result;let we=new Set([...O.refresh?fe.specs:[],...J]),Ce=(rn)=>vu(rn,re.configDir,re.filesystemScope,D,we.has(rn),!O.refresh||we.has(rn)),Se=await Fv(de.rules,O.refresh?(rn)=>Ce(rn).then((fn)=>({ok:!0,item:fn})).catch((fn)=>{if(pu(fn))throw fn;return{ok:!1,spec:rn,message:fn instanceof Error?fn.message:String(fn)}}):async(rn)=>({ok:!0,item:await Ce(rn)}),D),Ie=Se.filter((rn)=>!rn.ok),Ee=Se.filter((rn)=>rn.ok).map((rn)=>rn.item),qe=Ee.flatMap((rn)=>_v(rn,de.rules)),Me=Ee.flatMap((rn)=>Av(rn,Y,re)),en=new Set([...qe,...Me].map((rn)=>rn.spec)),on=[...Ie,...qe,...Me],sn=[],an=Iv(sn,()=>Ee.flatMap((rn)=>en.has(rn.spec)||on.length>0&&Y.has(rn.spec)?[]:Tv(rn,re,j,sn)));return{ok:on.length===0,errors:on.map((rn)=>`Failed to update ${rn.spec}: ${rn.message}`),entries:Ee.map(Ov),changes:an}}catch(re){return ur(re)}}function _v(P,O){if(!w(P.spec))return[];let D=Ne(P.spec),j=O.filter((J)=>J!==P.spec&&Ne(J).toLowerCase()===D.toLowerCase());if(j.length===0)return[];return[{ok:!1,spec:P.spec,message:`rulebook name "${D}" is also claimed by ${j.join(", ")}; rename one of them`}]}function Av(P,O,D){if(!O.has(P.spec)||!w(P.spec))return[];let j=M(D.configDir,P.rulebook.name),J=r(i(D.filesystemScope,j));if(J===null||J===P.content)return[];return[{ok:!1,spec:P.spec,message:`${j} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function Tv(P,O,D,j){if(!w(P.spec))return[];let J=M(O.configDir,P.rulebook.name),Y=i(O.filesystemScope,J),re=r(Y);if(re===P.content)return[];return j?.push({target:Y,previous:re}),g(Y,P.content,void 0,D._testAfterPolicyRename),$v(P,re)}function Iv(P,O){try{return O()}catch(D){for(let j of[...P].reverse()){if(j.previous===null){H(j.target);continue}g(j.target,j.previous)}throw D}}function $v(P,O){if(O===null)return[`Vendored ${P.spec} (${P.rulebook.version})`];let D=xe(O),j="problem"in D?null:D.rulebook,J=new Map(j?.rules.map((re)=>[re.name,JSON.stringify(re)])??[]),Y=new Set(P.rulebook.rules.map((re)=>re.name));return[`Updated ${P.spec} (${j?.version??"unreadable"} -> ${P.rulebook.version})`,...[...Y].filter((re)=>!J.has(re)).map((re)=>`  + ${re}`),...[...J.keys()].filter((re)=>!Y.has(re)).map((re)=>`  - ${re}`),...P.rulebook.rules.filter((re)=>{let ie=J.get(re.name);return ie!==void 0&&ie!==JSON.stringify(re)}).map((re)=>`  ~ ${re.name}`)]}function Ov(P){return{spec:P.spec,name:P.rulebook.name,version:P.rulebook.version,ruleCount:P.rulebook.rules.length}}async function Au(P,O,D={}){return Dv(P,O,Mv(D),Mn())}async function Dv(P,O,D,j,J={}){let Y=null,re=!1;try{let ie=kn(P,D),de=r(ie.configTarget);Y={target:ie.configTarget,content:de};let fe=as(ie.configTarget);if(!fe.ok)return fe.result;let we=fe.config,Ce=Z(O);Lv(O,D,Ce);let Se=Ce?await bu(O,{ref:D.ref,operation:j}):null,Ie=Se?Nv(Se,D.rulebooks):[],Ee=Se?Ie.map((sn)=>jv(we.rules,Se,sn)??`${O}#${Se.ref}/${sn}`):[O],qe=Ee.filter((sn)=>!we.rules.includes(sn)),Me=[...we.rules,...qe];if(Me.length>ye)return Hv();if(Me.length!==we.rules.length)re=!0,wn(ie.configTarget,{version:1,rules:Me,overrides:we.overrides??{},transparent_wrappers:we.transparent_wrappers??[]},void 0,J._testAfterPolicyRename);let en=await bo(P,D,j,J,new Set(qe),new Set(qe));if(!en.ok)dr(ie.configTarget,de);if(!en.ok||!Se)return en;let on=Ie.filter((sn,an)=>qe.includes(Ee[an]??""));return{...en,add:{source:O,ref:Se.ref,selected:Ie,added:on,alreadyConfigured:Ie.filter((sn)=>!on.includes(sn)),commits:qe.length>0?[Se.commit]:[]}}}catch(ie){if(re&&Y)try{dr(Y.target,Y.content)}catch(de){return ur(de)}return ur(ie)}}function Lv(P,O,D){if(!D&&O.rulebooks!==void 0)throw Error("--only can only select rulebooks from an owner/repo source");if(!D&&O.ref)throw Error(`--ref can only select a ref for an owner/repo source: ${P}`);if(O.rulebooks?.length===0)throw Error("--only requires at least one rulebook name");let j=O.rulebooks?.filter((J)=>!d.test(J))??[];if(j.length>0)throw Error(`Invalid rulebook names: ${j.join(", ")}`)}function Nv(P,O){let D=O?[...new Set(O)]:P.names,j=D.filter((J)=>!P.names.includes(J));if(j.length>0)throw Error(`Rulebooks not found in ${P.source} at ${P.ref}: ${j.join(", ")}
Available rulebooks: ${P.names.join(", ")}`);return D}function jv(P,O,D){let j=`${O.source}#${O.ref}/${D}`;if(P.includes(j))return j;let J=`${O.source}#${O.commit}/${D}`;return P.find((Y)=>Y===J)}async function Fv(P,O,D=Mn()){if(P.length>ye)throw Error(be);let j=[],J=0,Y,re=Array.from({length:Math.min(P.length,go.concurrency)},async()=>{while(!Y){let ie=J;if(ie>=P.length)return;J++;try{j[ie]=await O(P[ie],ie,D.controller.signal)}catch(de){if(!Y)Y={value:de},J=P.length,D.controller.abort(de);return}}});if(await Promise.all(re),Y)throw Y.value;return j}function Hv(){return{ok:!1,errors:[be],entries:[]}}function ps(P){return{cwd:P.cwd,userConfigDir:P.userConfigDir,userConfigPath:P.userConfigPath,projectConfigPath:P.projectConfigPath,global:P.global,only:P.only,refresh:P.refresh}}function Mv(P){return{...ps(P),ref:P.ref,rulebooks:P.rulebooks}}function Uv(P){return{...ps(P),deleteSource:P.deleteSource}}async function Tu(P,O,D={}){try{return await Gv(P,O,Uv(D),{})}catch(j){return ur(j)}}async function Gv(P,O,D,j){let J=kn(P,D),Y=m(J.configTarget);if(Y.errors.length>0)return{ok:!1,errors:Y.errors,entries:[]};if(!Y.config)return{ok:!1,errors:[`No config found at ${J.configPath}`],entries:[]};let re=Pu(Y.config.rules,O);if(!re.ok)return re.result;let ie=D.deleteSource?qv(J.configDir,re.specs,J.filesystemScope):{ok:!0,dirs:[]};if(!ie.ok)return ie.result;let de=r(J.configTarget);if(de===null)return ur(Error("Rules config is unavailable."));try{wn(J.configTarget,{version:1,rules:Y.config.rules.filter((Ce)=>!re.specs.includes(Ce)),overrides:Y.config.overrides??{},transparent_wrappers:Y.config.transparent_wrappers??[]},void 0,j._testAfterPolicyRename)}catch(Ce){throw dr(J.configTarget,de),Ce}let fe=await bo(P,D,Mn(),j);if(!fe.ok)return dr(J.configTarget,de),fe;let we=Bv(ie.dirs,j,J.filesystemScope);if(!we.ok){dr(J.configTarget,de);let Ce=await bo(P,D,Mn(),j);if(!Ce.ok)return{ok:!1,errors:[...we.result.errors,...Ce.errors],entries:Ce.entries};return we.result}return fe}function qv(P,O,D){let j=O.flatMap((ie)=>d.test(ie)?[]:["--delete-source can only delete local rulebook sources"]),J=O.map((ie)=>us(P,ie)),Y=j.length>0?[]:J.flatMap((ie)=>Iu(ie,D)),re=[...j,...Y];return re.length>0?{ok:!1,result:{ok:!1,errors:re,entries:[]}}:{ok:!0,dirs:J}}function Iu(P,O){let D=Rv(P),j=i(O,D),J=me(j);if(!J)return[`Local rulebook source directory not found: ${P}`];let Y=J.find((re)=>re.name==="rulebook.json");if(!Y)return[`Local rulebook source directory is missing rulebook.json: ${P}`];if(Y.kind!=="file")throw new o(O.label);if(r(i(O,us(D,"rulebook.json"))),J.length>1)return[`Local rulebook source directory contains extra files: ${P}. delete manually if you really want to remove the directory.`];return[]}function Bv(P,O,D){let j=P.flatMap((J)=>{try{if(!me(i(D,J)))return[];let Y=Iu(J,D);if(Y.length>0)return Y;return Vv(J,O,D),[]}catch(Y){return[`Failed to delete local rulebook source ${J}: ${Y instanceof Error?Y.message:String(Y)}`]}});return j.length>0?{ok:!1,result:{ok:!1,errors:j,entries:[]}}:{ok:!0}}function Vv(P,O,D){if(O._testDeleteLocalSourceDir){O._testDeleteLocalSourceDir(P);return}H(i(D,us(P,ge))),at(i(D,P))}function dr(P,O){if(O===null){H(P);return}g(P,O)}function ur(P){return{ok:!1,errors:[P instanceof Error?P.message:String(P)],entries:[]}}var Jv=".safety-net.json",Kv="~/.cc-safety-net/config.json";async function Lu(P,O){let D=L(P,{cwd:O.cwd});if(D)console.log(`Skipped the project scope: ${_(O.cwd)} is the user rule config, not a project rule config`);return[D||await Ou(P,{legacyPath:wa({cwd:O.cwd}),configPath:_(O.cwd),defaultRulebookName:"project-rules",migratedFrom:Jv,cleanup:O.cleanup,syncOptions:{cwd:O.cwd}}),await Ou(P,{legacyPath:Ct(P),configPath:W(P),defaultRulebookName:"user-rules",migratedFrom:Kv,cleanup:O.cleanup,syncOptions:{cwd:O.cwd,global:!0}})].every((J)=>J)?0:1}async function Ou(P,O){let D=kn(P,O.syncOptions),j=i(D.filesystemScope,O.legacyPath),J=r(j);if(J===null)return console.log(`No legacy config found at ${O.legacyPath}`),!0;let Y=zv(J);if(!Y.ok){for(let Ie of Y.errors)console.error(Ie);return!1}let re=m(D.configTarget);if(re.errors.length>0){for(let Ie of re.errors)console.error(Ie);return!1}let ie=re.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},de=Yv($u(O.configPath),ie.rules,O.defaultRulebookName,O.migratedFrom,D.filesystemScope),fe=ko($u(O.configPath),de,"rulebook.json"),we=i(D.filesystemScope,fe),Ce=[Du(D.configTarget),Du(we)],Se=await Wv(P,O,D.configTarget,we,de,Y.config.rules,ie.rules.includes(de)?ie.rules:[...ie.rules,de],ie.overrides??{},ie.transparent_wrappers??[]);if(!Se.ok){Qv(Ce);for(let Ie of Se.errors)console.error(Ie);return!1}if(!O.cleanup)return console.log(`Migrated legacy config at ${O.legacyPath}. Legacy file is no longer used.`),!0;if(!Xv(D.configTarget,we,de,O.migratedFrom,Y.config.rules))return console.error(`Migration cleanup verification failed for ${O.legacyPath}`),!1;return H(j),console.log(`Deleted legacy config at ${O.legacyPath}`),!0}async function Wv(P,O,D,j,J,Y,re,ie,de){try{return wn(D,{version:1,rules:re,overrides:ie,transparent_wrappers:de}),wn(j,Zv(J,O.migratedFrom,Y)),await wo(P,O.syncOptions)}catch(fe){return{ok:!1,errors:[fe instanceof Error?fe.message:String(fe)]}}}function zv(P){try{let O=JSON.parse(P),D=Io(O);if(D.errors.length>0)return{ok:!1,errors:D.errors};return{ok:!0,config:{version:1,rules:O.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function Yv(P,O,D,j,J){let Y=O.find((re)=>eb(i(J,ko(P,re,"rulebook.json")))===j);if(Y)return Y;if(r(i(J,ko(P,D,"rulebook.json")))===null)return D;for(let re=2;;re++){let ie=`${D}-${re}`;if(r(i(J,ko(P,ie,"rulebook.json")))===null)return ie}}function Zv(P,O,D){return{rulebook_version:1,name:P,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:O,allowed_commands:[...new Set(D.map((j)=>j.command))],rules:D,tests:D.map((j)=>({command:[j.command,j.subcommand,j.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:j.name}))}}function Xv(P,O,D,j,J){if(!m(P).config?.rules.includes(D))return!1;try{let re=r(O);if(re===null)return!1;let ie=JSON.parse(re);return ie.migrated_from===j&&JSON.stringify(ie.rules)===JSON.stringify(J)}catch{return!1}}function Du(P){return{target:P,content:r(P)}}function Qv(P){for(let O of P){if(O.content===null){H(O.target);continue}g(O.target,O.content)}}function eb(P){let O=r(P);if(O===null)return null;try{let D=JSON.parse(O);return typeof D.migrated_from==="string"?D.migrated_from:null}catch{return null}}import{mkdir as nb,readFile as tb,writeFile as rb}from"node:fs/promises";import{dirname as ob,join as ib}from"node:path";var sb=86400000,ab=604800000;async function ju(P,O=Date.now()){if(P.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let D=We(P);if(!D)return null;let j=ib(D,".cc-safety-net","update-check.json"),J=await lb(j,O);if(!J.lastCheck||O-J.lastCheck>sb){let ie=await Gn();if(J.lastCheck=O,ie.latestVersion)J.latestVersion=ie.latestVersion;if(!await Nu(j,J))return null;if(ie.error)return null}let Y=J.latestVersion,re=pn();if(!Y||!jo(Y,re))return null;if(J.notifiedVersion===Y&&J.notifiedAt!==void 0&&O-J.notifiedAt<ab)return null;if(J.notifiedVersion=Y,J.notifiedAt=O,!await Nu(j,J))return null;return`UPDATE_AVAILABLE: cc-safety-net v${Y} is available (running v${re}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function lb(P,O){let D=await tb(P,"utf8").then((Y)=>JSON.parse(Y)).catch(()=>{return});if(!D||typeof D!=="object"||Array.isArray(D))return{};let j=D,J=(Y)=>typeof Y==="number"&&Number.isFinite(Y)&&Y<=O?Y:void 0;return{lastCheck:J(j.lastCheck),latestVersion:typeof j.latestVersion==="string"?j.latestVersion:void 0,notifiedVersion:typeof j.notifiedVersion==="string"?j.notifiedVersion:void 0,notifiedAt:J(j.notifiedAt)}}async function Nu(P,O){return nb(ob(P),{recursive:!0,mode:448}).then(()=>rb(P,JSON.stringify(O),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as cb,resolve as fs}from"node:path";var Fu="CC Safety Net Config",db="═".repeat(Fu.length),ub="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",pb=new Set(["rule.json","rule.lock","cache"]);function Hu(P,O={}){try{return fb(P,O)}catch(D){if(D instanceof o)return console.error(D.message),1;throw D}}function fb(P,O){let D=O.cwd??process.cwd(),j=X(P,{cwd:D}),J=Ct(P),Y=wr(D),re=fs(D,he),ie=i(j.userScope,J),de=i(j.projectScope,Y),fe=!1,we=!1,Ce=[],Se=[],Ie=mb(i(j.projectScope,re));if(yb(),r(j.userConfigTarget)!==null){let Ee=Un(j.userConfigTarget);if(Ee.errors.push(...B(j.userConfigPath,j.userScope)),Ce.push({scope:"User",path:j.userConfigPath,result:Ee,schema:"rules",target:j.userConfigTarget}),Ee.errors.length>0)fe=!0}if(r(ie)!==null)if(we=!0,r(j.userConfigTarget)!==null)Se.push(xo("user","cleanup"));else{let Ee=$o(ie);if(Ce.push({scope:"User",path:J,result:Ee,schema:"legacy",inactive:!0,target:ie}),Se.push(xo("user",Ee.errors.length>0?"fix-or-delete":"migrate")),Ee.errors.length>0)fe=!0}if(r(j.projectConfigTarget)!==null){let Ee=Un(j.projectConfigTarget);if(Ee.errors.push(...B(j.projectConfigPath,j.projectScope)),Ce.push({scope:"Project",path:fs(j.projectConfigPath),result:Ee,schema:"rules",target:j.projectConfigTarget}),Ee.errors.length>0)fe=!0;if(r(de)!==null)we=!0,Se.push(xo("project","cleanup"))}else if(r(de)!==null){we=!0,fe=!0;let Ee=$o(de);Ce.push({scope:"Project",path:fs(Y),result:Ee,schema:"legacy",inactive:!0,target:de}),Se.push(xo("project",Ee.errors.length>0?"fix-or-delete":"migrate"))}if(Ie?.result.errors.length)fe=!0;if(Ce.length===0&&!Ie)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Ee of Ce)if(Ee.inactive)vb(Ee.scope,Ee.path,Ee.result);else if(Ee.result.errors.length>0)bb(Ee.scope,Ee.path,Ee.result.errors);else{if(Ee.schema==="rules"&&xb(Ee.target))console.log(`
Added $schema to ${Ee.scope.toLowerCase()} config.`);hb(Ee.scope,Ee.path,Ee.result,Ee.schema)}for(let Ee of Se)console.error(`
${nn.red(Ee)}`);if(Ie)if(Ie.result.errors.length>0)kb(Ie.path,Ie.result.errors);else wb(Ie.path,Ie.result);if(fe)return console.error(`
Config validation failed.`),1;return console.log(we?`
Configs valid with warnings.`:`
All configs valid.`),0}function xo(P,O){let D=`legacy ${P} config`;if(O==="cleanup")return`Warning: Legacy ${P} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(O==="migrate")return`Warning: Legacy ${P} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${P} config is no longer supported. Fix or delete the ${D}, then run \`npx -y cc-safety-net rule migrate\`.`}function mb(P){if(me(P)===null)return null;let O=gb(P);if(O.ruleNames.size===0&&O.errors.length===0)return null;return{path:P.path,result:O}}function gb(P){let O=[],D=new Set,j=(me(P)??[]).filter((J)=>!pb.has(J.name)).sort((J,Y)=>J.name.localeCompare(Y.name));if(j.length===0)return{errors:O,ruleNames:D};for(let J of j){if(!d.test(J.name)){O.push(`rulebook directory names must match ${d}: ${J.name}`);continue}if(J.kind!=="directory"){O.push(`${J.name} must be a rulebook directory`);continue}let Y=i(P.scope,cb(P.path,J.name,"rulebook.json")),re=r(Y);if(re===null){O.push(`${J.name}/rulebook.json is required`);continue}try{let ie;try{ie=JSON.parse(re)}catch{O.push(`${J.name}/rulebook.json: invalid JSON`);continue}let de=le(ie);if(de.name!==J.name){O.push(`rulebook name "${de.name}" must match folder "${J.name}"`);continue}let fe=mo(de);if(fe.length>0){O.push(...fe.map((we)=>`${J.name}/rulebook.json: ${we}`));continue}D.add(J.name)}catch(ie){O.push(ie instanceof Error?`${J.name}/rulebook.json: ${ie.message}`:`${J.name}/rulebook.json: ${String(ie)}`)}}return{errors:O,ruleNames:D}}function yb(){console.log(Fu),console.log(db)}function hb(P,O,D,j){if(console.log(`
✓ ${P} config: ${O}`),console.log(`  Schema: ${j==="rules"?"rulebook sources":"legacy inline rules"}`),D.ruleNames.size>0){console.log(`  ${j==="rules"?"Sources":"Rules"}:`);let J=1;for(let Y of D.ruleNames)console.log(`    ${J}. ${Y}`),J++}else console.log(`  ${j==="rules"?"Sources":"Rules"}: (none)`)}function vb(P,O,D){if(console.error(`
✗ Legacy ${P.toLowerCase()} config: ${O}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),D.errors.length>0){console.error("  Errors:");let j=1;for(let J of D.errors)for(let Y of J.split("; "))console.error(`    ${j}. ${Y}`),j++;return}if(D.ruleNames.size>0){console.error("  Rules:");let j=1;for(let J of D.ruleNames)console.error(`    ${j}. ${J}`),j++;return}console.error("  Rules: (none)")}function bb(P,O,D){Mu(`${P} config`,O,D)}function wb(P,O){console.log(`
✓ GitHub source rules: ${P}`),console.log("  Rulebooks:");let D=1;for(let j of O.ruleNames)console.log(`    ${D}. ${j}`),D++}function kb(P,O){Mu("GitHub source rules",P,O)}function Mu(P,O,D){console.error(`
✗ ${P}: ${O}`),console.error("  Errors:");let j=1;for(let J of D)for(let Y of J.split("; "))console.error(`    ${j}. ${Y}`),j++}function xb(P){try{let O=r(P);if(O===null)return!1;let D=JSON.parse(O);if(D.$schema)return!1;return g(P,JSON.stringify({$schema:ub,...D},null,2)),!0}catch(O){if(O instanceof o)throw O;return!1}}var Uu=new Set(["init","add","remove","update","sync","list","wrapper","migrate","doc","verify"]),Sb=new Set(["init","add","remove","update","sync","wrapper"]),Pb=new Set(["add","remove","list"]),Rb="cc-safety-net/rulebooks";async function Gu(P,O){try{return await Eb(P,O)}catch(D){if(D instanceof o)return console.error(D.message),1;throw D}}async function Eb(P,O){let D=Ab(O),j=D.help?_b(D.positionals):null;if(j)return Lt(j),0;if(D.errors.length>0){for(let fe of D.errors)console.error(fe);return 1}let J=D.positionals[0];if(!J)return Lt(xt,console.error),1;let Y=D.positionals[1],re={global:D.global},ie=process.cwd();if(!D.global&&Sb.has(J)&&!(J==="wrapper"&&Y==="list")&&L(P,{cwd:ie}))return console.error(`${_(ie)} is the user rule config, not a project rule config; use --global for the user scope, or run from a project directory`),1;if(J==="init"){let fe=kn(P,re);Ob(fe.configTarget);let we=Cb(fe.configDir,"example-rules","rulebook.json"),Ce=i(fe.filesystemScope,we);if(D.example&&r(Ce)===null)uu(Ce);let Se=B(fe.configPath,fe.filesystemScope);for(let Ie of Se)console.error(Ie);if(Se.length>0)return 1;return console.log("Rule config initialized."),0}if(J==="add"){let fe=qu(D);if(!fe)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let we=kn(P,re),Ce=await Au(P,fe,{...re,ref:D.ref,rulebooks:D.only.length>0?D.only:void 0});return su(Ce,fe,`Scope: ${D.global?"user":"project"} (${we.configDir})`),Ce.ok?0:1}if(J==="remove"){if(!Y)return console.error("rule remove requires a source"),1;let fe=await Tu(P,Y,{...re,deleteSource:D.deleteSource});return fo(fe,`Removed rulebook source: ${Y}`),fe.ok?0:1}if(J==="update"){let fe=await wo(P,{...re,only:Y,refresh:!0});return fo(fe,"Rule config updated."),fe.ok?0:1}if(J==="sync")return Ca(P,{global:D.global});if(J==="list"){let fe=Q(P,{cwd:ie});return lu(fe),fe.errors.length>0?1:0}if(J==="wrapper")return Db(P,D);if(J==="migrate")return Lu(P,{cleanup:D.cleanup,cwd:ie});if(J==="doc"){console.log(ou);let fe=await ju(P);if(fe)console.error(fe);return 0}if(J==="verify")return Hu(P);return 1}function _b(P){if(P.length===0)return xt;let O=xt.subcommands.filter((j)=>j.usage.split(" ")[0]===P[0]);if(O.length===0)return null;if(P.length===1&&O.length>1)return{name:`rule ${P[0]}`,description:`Subcommands of rule ${P[0]}`,usage:`rule ${P[0]} <subcommand>`,subcommands:O,options:[]};let D=P.length===1?O[0]:O.find((j)=>j.usage.split(" ")[1]===P[1]);if(!D)return null;return{name:`rule ${P[0]}`,description:D.description,usage:`rule ${D.usage}`,options:P[0]==="add"?_o:[],examples:P[0]==="add"?Ao:void 0}}function Ab(P){let O=yn({label:"rule",booleans:{global:["-g","--global"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"]},lists:{only:["--only"]},positionals:"list"},P),D={...O.flags,ref:O.values.ref,only:O.lists.only??[],help:O.help,positionals:O.positionals,errors:O.errors};return Tb(D),D}function Tb(P){let[O]=P.positionals;if(O&&!Uu.has(O))P.errors.push(`Unknown rule subcommand: ${O}`);if(P.deleteSource&&O!=="remove")if(O&&Uu.has(O))P.errors.push(`Unknown option for rule ${O}: --delete-source`);else P.errors.push("--delete-source is only valid with 'rule remove'");if(P.cleanup&&O!=="migrate")P.errors.push(pr(O,"--cleanup"));if(P.example&&O!=="init")P.errors.push(pr(O,"--example"));if(P.ref&&O!=="add")P.errors.push(pr(O,"--ref"));if(P.only.length>0&&O!=="add")P.errors.push(pr(O,"--only"));if(O==="add")Ib(P);if(O==="migrate"){if(P.global)P.errors.push(pr(O,"--global"));if(P.positionals.length>1)P.errors.push(`Unexpected rule migrate argument: ${P.positionals[1]}`)}else if(O==="wrapper")$b(P);else if(P.positionals.length>2)P.errors.push(`Unexpected rule argument: ${P.positionals[2]}`);if(O==="list"&&P.global)P.errors.push("Unknown option for rule list: --global")}function qu(P){if(P.positionals[1])return P.positionals[1];if(P.ref||P.only.length>0)return Rb;return}function Ib(P){let O=qu(P);if(!O)return;if((P.ref||P.only.length>0)&&!Z(O)){if(P.ref)P.errors.push(`--ref can only select a ref for an owner/repo source: ${O}`);if(P.only.length>0)P.errors.push("--only can only select rulebooks from an owner/repo source");return}if(P.ref&&!ae(P.ref))P.errors.push(`--ref must use valid path segments: ${P.ref}`);let D=P.only.filter((j)=>!d.test(j));if(D.length>0)P.errors.push(`Invalid rulebook names: ${D.join(", ")}`)}function pr(P,O){return P?`Unknown option for rule ${P}: ${O}`:`Unknown option for rule: ${O}`}function $b(P){let O=P.positionals[1],D=P.positionals[2];if(!O){P.errors.push("rule wrapper requires add, remove, or list");return}if(!Pb.has(O)){P.errors.push(`Unknown rule wrapper action: ${O}`);return}if(O==="list"){if(D)P.errors.push(`Unexpected rule wrapper argument: ${D}`);return}if(!D){P.errors.push(`rule wrapper ${O} requires a command`);return}if(P.positionals.length>3)P.errors.push(`Unexpected rule wrapper argument: ${P.positionals[3]}`)}function Ob(P){if(r(P)===null){du(P);return}let O=m(P);if(!O.config)return;wn(P,{version:1,rules:O.config.rules,overrides:O.config.overrides??{},transparent_wrappers:O.config.transparent_wrappers??[]})}async function Db(P,O){let D=O.positionals[1],j=O.positionals[2],J=kn(P,{global:O.global}).configTarget;if(D==="list"){let de=m(J);if(de.errors.length>0){for(let fe of de.errors)console.error(fe);return 1}return Lb(de.config?.transparent_wrappers??[]),0}if(!j||!C.test(j))return console.error("transparent wrapper must match command pattern"),1;if(Ae(j))return console.error(`reserved command "${j}" cannot be a wrapper`),1;let Y=m(J);if(Y.errors.length>0){for(let de of Y.errors)console.error(de);return 1}let re=Y.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},ie=D==="add"?[...new Set([...re.transparent_wrappers??[],j])]:(re.transparent_wrappers??[]).filter((de)=>de!==j);return wn(J,{version:1,rules:re.rules,overrides:re.overrides??{},transparent_wrappers:ie}),console.log(D==="add"?`Added transparent wrapper: ${j}`:`Removed transparent wrapper: ${j}`),0}function Lb(P){if(P.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${P.length}):`);for(let O of P)console.log(`  - ${O}`)}import{sep as Ub}from"node:path";import{existsSync as Nb,readFileSync as jb}from"node:fs";import{join as Fb}from"node:path";async function Hb(P){if(P.isTTY)return null;return(await Ke(P).catch(()=>null))?.trim()||null}function Mb(P){let O=P.env.get("CLAUDE_SETTINGS_PATH");if(O)return O;return Fb(Ir(P),"settings.json")}function ms(P){let O=Mb(P);if(!Nb(O))return!1;try{let D=jb(O,"utf-8"),j=JSON.parse(D);if(!j.enabledPlugins)return!1;let J="cc-safety-net@cc-marketplace";if(!(J in j.enabledPlugins))return!1;return j.enabledPlugins[J]===!0}catch(D){if(v(n.debug,P.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${O}: ${D instanceof Error?D.message:String(D)}`);return!1}}async function gs(P,O=process.stdin){let D=ms(P),j;if(!D)j="\uD83D\uDEE1️ CC Safety Net ❌";else{let Y=k(P,{cwd:process.cwd()}),re=Y.policy,ie=T(re,P.env),de=Object.values(V(re,ie.capabilities)).some((Ce)=>Ce.changesInherited),fe={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[de?"custom":ie.effectiveLevel],we=Y.policyScopes&&!Y.policyScopes.weakeningsIgnored&&Y.policyScopes.weakenings.length>0?"\uD83D\uDD3B":"";j=`\uD83D\uDEE1️ CC Safety Net ${fe}${ie.worktreeMode?"\uD83C\uDF33":""}${we}${Y.state==="degraded"?"⚠️":""}`}let J=await Hb(O);if(J&&!J.startsWith("{"))console.log(`${J} | ${j}`);else console.log(j)}function Bu(P){let O=k(P,{cwd:process.cwd()}),D=O.policy,j=T(D,P.env),J=!!process.env.NO_COLOR||!process.stdout.isTTY,Y=Math.min(process.stdout.columns||80,100),re=J?"ok":"✔",ie=J?"OFF":"✘",de=(qe,Me)=>{let en=`  ${qe.padEnd(13)}${Me}`;return(en.length>Y?`${en.slice(0,Y-1)}…`:en).replaceAll(ie,nn.red(ie))},fe=Object.values(V(D,j.capabilities)).some((qe)=>qe.changesInherited),we=(qe)=>qe===P.home||qe.startsWith(`${P.home}${Ub}`)?`~${qe.slice(P.home.length)}`:qe,Ce={ready:nn.green,degraded:nn.yellow}[O.state],Se=O.policyScopes?.weakenings??[],Ie=[...ms(P)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...O.diagnostics],Ee=J?"-":"·";console.log([`${J?"":"\uD83D\uDEE1️  "}CC Safety Net — ${Ce(O.state)}`,"",de("Protection",`destructive ${D.destructiveCommandProtectionEnabled?re:ie}   secrets ${D.secretProtection.enabled?re:ie}`),de("Level",fe?`${j.effectiveLevel} (customised)`:j.effectiveLevel),de("Rules",D.rules.length===0?"none active":`${D.rules.length} active`),de("Policy",we(l(P))),...O.policyScopes?[de("Project",we(h(process.cwd())))]:[],...j.worktreeMode?[de("Worktree","relaxations active")]:[],"",...Se.length===0?[]:[O.policyScopes?.weakeningsIgnored?"  Project policy (ignored)":"  Project policy",...Se.flatMap((qe)=>er(qe,"      ",Y-6).map((Me,en)=>en===0?`    ${Me}`:Me)),""],...Ie.length===0?["  Everything configured is active."]:["  Not active",...Ie.flatMap((qe)=>er(qe,"      ",Y-6).map((Me,en)=>en===0?`    ${Ee} ${Me}`:Me)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as np}from"node:child_process";import{randomBytes as Zb}from"node:crypto";import{existsSync as Xb}from"node:fs";import{createServer as Qb}from"node:http";import{Writable as ew}from"node:stream";var Co=500;function Gb(P){let O=P.filter((J)=>J.decision!=="allow"),D=P.filter((J)=>J.decision==="allow"),j=Math.min(O.length,Math.max(Co-D.length,Math.ceil(Co/2)));return[...O.slice(0,j),...D.slice(0,Co-j)]}function Vu(P,O,D=U(P)){if(D)K(P,D);let j=(Me)=>new Date(Me.getFullYear(),Me.getMonth(),Me.getDate()).getTime(),J=j(new Date),Y=new Date(J);Y.setDate(Y.getDate()-(O-1));let re=Y.getTime(),ie=[],de={count:0};for(let Me of D?Kn(D,de):[])for(let en of kt(Me,de)){let on=new Date(en.ts).getTime();if(!Number.isFinite(on))continue;if(on>=re)ie.push(en)}ie.sort((Me,en)=>new Date(en.ts).getTime()-new Date(Me.ts).getTime());let fe=Array.from({length:O},()=>0),we=Array.from({length:O},()=>0),Ce={},Se={},Ie={},Ee=0,qe=0;for(let Me of ie){let en=Me.agent||"unknown";Ce[en]=(Ce[en]??0)+1;let on=Math.round((J-j(new Date(Me.ts)))/86400000),sn=O-1-on,an=on>=0&&on<O;if(an)we[sn]=(we[sn]??0)+1;if(Me.decision!=="allow"){if(Ee++,Me.ruleId)Se[Me.ruleId]=(Se[Me.ruleId]??0)+1;let rn=Ro(Me.segment||Me.command);if(rn)Ie[rn]=(Ie[rn]??0)+1;if(Me.failureStage)qe++;if(an)fe[sn]=(fe[sn]??0)+1}}return{days:O,logsDir:D,homeDir:P.home,totalInWindow:ie.length,truncated:ie.length>Co,unreadable:de.count,counts:{blocked:Ee,allowed:ie.length-Ee,agents:Ce,blockedByDay:fe,analyzedByDay:we,rules:Se,commands:Ie,errors:qe},entries:Gb(ie).sort((Me,en)=>new Date(en.ts).getTime()-new Date(Me.ts).getTime())}}import{spawn as qb}from"node:child_process";import{existsSync as Bb,statSync as Ju}from"node:fs";import{delimiter as Vb,join as Jb}from"node:path";var Kb=120000,So="Choose the project folder",Wb=`try
  return POSIX path of (choose folder with prompt "${So}")
on error number -128
  return ""
end try`,zb=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${So}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Ku=[{binary:"zenity",args:["--file-selection","--directory",`--title=${So}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",So]}],Wu=(P,O)=>(O.PATH??"").split(Vb).some((D)=>{if(D.length===0)return!1;try{let j=Ju(Jb(D,P));return j.isFile()&&(j.mode&73)!==0}catch{return!1}});function ys(P,O){if(P==="darwin"||P==="win32")return!0;if(P!=="linux")return!1;if(!O.DISPLAY&&!O.WAYLAND_DISPLAY)return!1;return Ku.some((D)=>Wu(D.binary,O))}function Yb(P,O){if(P==="darwin")return{cmd:"osascript",args:["-e",Wb]};if(P==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",zb]};let D=Ku.find((j)=>Wu(j.binary,O));return D?{cmd:D.binary,args:D.args}:null}function hs(P=process.platform,O=process.env){let D=Yb(P,O);if(!D)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((j)=>{let J=qb(D.cmd,D.args,{env:O,stdio:["ignore","pipe","pipe"]}),Y="",re=!1,ie=(fe)=>{if(re)return;re=!0,clearTimeout(de),j(fe)},de=setTimeout(()=>{J.kill(),ie({error:"The folder dialog timed out"})},Kb);J.stdout.on("data",(fe)=>{Y+=fe.toString()}),J.on("error",()=>ie({error:`Could not open the folder dialog (${D.cmd})`})),J.on("close",()=>{let fe=Y.trim().replace(/\/+$/,"");if(!fe)return ie({cancelled:!0});if(!Bb(fe)||!Ju(fe).isDirectory())return ie({error:"That selection is not a folder on disk"});ie({path:fe})})})}var zu=`<!doctype html>
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

  --bg: light-dark(#f2f2f3, #0f0f10);
  --surface: light-dark(#ffffff, #19191b);
  --sidebar: light-dark(#fafafa, #121213);
  --field-bg: light-dark(#ffffff, #141414);
  --fill: light-dark(rgb(0 0 0 / 4%), rgb(255 255 255 / 6%));
  --hover: light-dark(rgb(0 0 0 / 4.5%), rgb(255 255 255 / 5%));
  --selected: light-dark(rgb(0 0 0 / 7%), rgb(255 255 255 / 9%));
  --pill-on: light-dark(#ffffff, #444448);
  --line: light-dark(rgb(0 0 0 / 8%), rgb(255 255 255 / 8%));
  --line-strong: light-dark(rgb(0 0 0 / 14%), rgb(255 255 255 / 13%));
  --ring: light-dark(rgb(0 0 0 / 10%), rgb(255 255 255 / 10%));

  --ink: light-dark(#18181b, #f0f0f0);
  --muted: light-dark(#5c5f66, #b3b3b3);
  --faint: light-dark(#7c8088, #8c8c8c);
  --on-ink: light-dark(#ffffff, #141414);

  --switch-off: light-dark(#c4c7cc, #4a4a4a);
  --switch-on: light-dark(#16a34a, #22c55e);
  --focus-ring: light-dark(#2563eb, #6ea2ff);
  --accent: light-dark(#16a34a, #22c55e);
  --danger: light-dark(#b91c1c, #dc2626);
  --danger-hover: light-dark(#991b1b, #b91c1c);
  --star: light-dark(#b7791f, #f2c94c);

  --ok-fg: light-dark(#15803d, #4ade80);
  --ok-bg: light-dark(#effaf3, rgb(74 222 128 / 10%));
  --ok-border: light-dark(#bfe6cc, rgb(74 222 128 / 25%));
  --err-fg: light-dark(#b42318, #ff8a80);
  --err-bg: light-dark(#fef3f2, rgb(255 138 128 / 10%));
  --err-border: light-dark(#f4cdc8, rgb(255 138 128 / 25%));
  --warn-fg: light-dark(#a14a06, #fbbf24);
  --warn-bg: light-dark(#fffaeb, rgb(251 191 36 / 10%));
  --warn-border: light-dark(#f3dfb0, rgb(251 191 36 / 25%));
  --info-fg: light-dark(#1d4ed8, #93c5fd);
  --info-bg: light-dark(#eff5ff, rgb(147 197 253 / 10%));
  --info-border: light-dark(#c8d9f7, rgb(147 197 253 / 25%));
  --paranoid-fg: light-dark(#7e22ce, #d8b4fe);
  --paranoid-bg: light-dark(#faf5ff, rgb(216 180 254 / 10%));
  --paranoid-border: light-dark(#e6d1f5, rgb(216 180 254 / 25%));

  --radius-sm: 6px;
  --radius: 8px;
  --radius-lg: 12px;
  --control-h: 32px;
  --row-x: 12px;
  --card-x: 16px;
  --shadow-float: 0 0 0 1px var(--line-strong), 0 8px 24px rgb(0 0 0 / 16%);

  font-family: var(--font-sans);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

[hidden] {
  display: none !important;
}

a {
  color: inherit;
}

p,
h1,
h2,
h3,
h4,
ul,
dl,
dd {
  margin: 0;
}

ul {
  padding: 0;
  list-style: none;
}

code,
.mono {
  font-family: var(--font-mono);
  font-size: 13px;
}

p code,
small code,
.empty code {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--fill);
  font-size: 12.5px;
}

strong {
  font-weight: 600;
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

.muted {
  color: var(--muted);
}

.count {
  color: var(--faint);
  font-size: 13px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
}

:where(a, button, summary, [tabindex], input[type='checkbox'], input[type='radio']):focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

:where(input[type='search'], input[type='text'], input[type='number'], textarea, select):focus {
  border-color: var(--focus-ring);
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus-ring) 20%, transparent);
}

.app-shell {
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 18px 10px;
  border-right: 1px solid var(--line);
  background: var(--sidebar);
}

.brand {
  padding: 0 10px;
}

.brand-logo {
  display: flex;
  color: light-dark(#17161b, #f5f4f0);
}

.brand-home {
  display: flex;
}

.brand-logo svg {
  width: auto;
  height: 28px;
}

.sidenav {
  display: grid;
  gap: 1px;
}

.sidenav a {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 32px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  color: var(--muted);
  font-weight: 500;
  text-decoration: none;
}

.sidenav a:hover {
  background: var(--hover);
  color: var(--ink);
}

.sidenav a[aria-current='page'] {
  background: var(--selected);
  color: var(--ink);
}

.sidenav svg {
  width: 16px;
  height: 16px;
  flex: none;
}

.nav-dirty {
  margin-left: auto;
  padding: 0 7px;
  border-radius: 999px;
  background: var(--warn-bg);
  color: var(--warn-fg);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
}

.sidebar-foot {
  margin-top: auto;
  display: grid;
  gap: 4px;
  padding: 0 10px;
  font-size: 13px;
}

.sidebar-foot a,
.app-foot a {
  color: var(--faint);
  text-decoration: none;
}

.sidebar-foot a:hover,
.app-foot a:hover {
  color: var(--ink);
}

.app-foot {
  display: none;
}

.content {
  min-width: 0;
}

main {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 36px 40px 72px;
  display: grid;
  gap: 28px;
}

.view {
  display: grid;
  gap: 28px;
  min-width: 0;
}

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 20px;
}

.page-head:has(> .icon-button) {
  flex-wrap: nowrap;
  align-items: flex-start;
}

.page-head h2 {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 30px;
}

.page-head p {
  margin-top: 2px;
  color: var(--muted);
}

.section {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  min-height: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.section-sub {
  margin-top: 2px;
  color: var(--muted);
  font-size: 13px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card {
  min-width: 0;
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: 0 0 0 1px var(--ring);
}

.card.pad {
  padding: var(--card-x);
}

.card.list {
  display: grid;
  padding: 4px;
}

.card.rows {
  padding: 0 var(--card-x);
}

.panel {
  display: grid;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 14px var(--card-x) 14px 20px;
  border-bottom: 1px solid var(--line);
}

.panel-head > div:first-child {
  flex: 1 1 0;
  min-width: 0;
}

.panel-list {
  display: grid;
  padding: 4px;
}

.panel-rows {
  padding: 0 var(--card-x) 0 20px;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 6px var(--row-x);
  border-radius: var(--radius);
  color: inherit;
  text-decoration: none;
}

a.list-row:hover,
button.list-row:hover:not(:disabled) {
  background: var(--hover);
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 56px;
  padding: 12px 0;
}

.setting-row + .setting-row,
#safety-overrides + #workflow,
.path-list + .path-list {
  border-top: 1px solid var(--line);
}

#safety-overrides .setting-row:first-child {
  border-top: 0;
}

.setting-row.info {
  align-items: baseline;
  min-height: 48px;
}

.setting-text {
  display: grid;
  flex: 1;
  gap: 1px;
  min-width: 0;
}

label.setting-text {
  cursor: pointer;
}

.setting-text strong {
  font-weight: 500;
}

.setting-text small {
  color: var(--muted);
  font-size: 13px;
}

.setting-label {
  flex: none;
  width: 140px;
  color: var(--muted);
}

.setting-row.info code {
  flex: 1;
  min-width: 0;
}

.setting-row.info button {
  align-self: center;
}

.path-part {
  display: inline-block;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.icon-button {
  width: var(--control-h);
  padding: 0;
}

.icon-button svg {
  width: 16px;
  height: 16px;
}

.banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 16px;
  padding: 12px 16px;
  border: 1px solid var(--err-border);
  border-radius: var(--radius);
  background: var(--err-bg);
  color: var(--err-fg);
}

.banner p {
  flex: 1 1 100%;
}

.banner a {
  font-weight: 600;
}

button,
.star-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: var(--control-h);
  padding: 0 12px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
}

button:hover:not(:disabled),
.star-cta:hover {
  background: var(--hover);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button svg {
  width: 15px;
  height: 15px;
  flex: none;
}

button.primary {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--on-ink);
}

button.primary:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--ink) 85%, var(--bg));
  background: color-mix(in srgb, var(--ink) 85%, var(--bg));
}

button.danger {
  border-color: var(--danger);
  background: var(--danger);
  color: #fff;
}

button.danger:hover:not(:disabled) {
  border-color: var(--danger-hover);
  background: var(--danger-hover);
}

button.danger-quiet {
  color: var(--err-fg);
}

button.danger-quiet:hover:not(:disabled) {
  border-color: var(--err-border);
  background: var(--err-bg);
}

button.quiet {
  border-color: transparent;
  color: var(--muted);
}

button.quiet:hover:not(:disabled) {
  color: var(--ink);
}

button.small {
  height: 26px;
  padding: 0 8px;
  font-size: 13px;
}

button.icon-only {
  width: 28px;
  height: 28px;
  padding: 0;
}

.link-button,
.row-action {
  flex: none;
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.link-button::after,
.row-action::after {
  content: ' →';
}

.link-button:hover,
.list-row:hover .row-action {
  color: var(--ink);
}

input[type='search'],
input[type='text'],
input[type='number'],
textarea,
select {
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--field-bg);
  color: var(--ink);
  font: inherit;
}

input[type='search'],
input[type='text'],
input[type='number'],
select {
  height: var(--control-h);
}

input[type='search'],
input[type='text'],
textarea {
  width: 100%;
  padding: 0 10px;
}

input.mono {
  font-family: var(--font-mono);
  font-size: 13px;
}

textarea {
  min-height: 96px;
  padding: 8px 10px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.55;
  resize: vertical;
}

select {
  padding: 0 8px;
  cursor: pointer;
}

input::placeholder,
textarea::placeholder {
  color: var(--faint);
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input[readonly] {
  color: var(--muted);
}

.input-row {
  display: flex;
  gap: 8px;
}

.input-row input {
  flex: 1 1 auto;
  min-width: 0;
}

.switch {
  appearance: none;
  position: relative;
  flex: none;
  width: 34px;
  height: 20px;
  margin: 0;
  border-radius: 999px;
  background: var(--switch-off);
  cursor: pointer;
}

.switch::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgb(0 0 0 / 25%);
}

.switch:checked {
  background: var(--switch-on);
}

.switch:checked::before {
  transform: translateX(14px);
}

.switch:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pills {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 3px;
  border-radius: var(--radius);
  background: var(--fill);
  box-shadow: inset 0 0 0 1px var(--line);
}

.pills button {
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--muted);
  font-size: 13px;
}

.pills button:hover:not(:disabled) {
  background: transparent;
  color: var(--ink);
}

.pills button[aria-pressed='true'],
.pills button[aria-pressed='true']:hover:not(:disabled) {
  background: var(--pill-on);
  color: var(--ink);
  box-shadow:
    0 0 0 1px var(--line-strong),
    0 1px 2px rgb(0 0 0 / 12%);
}

.pills button[aria-pressed='true'] .count {
  color: var(--muted);
}

.pills .count {
  margin-left: 2px;
  font-size: 12.5px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.toolbar-spacer {
  flex: 1;
}

.toolbar-search {
  position: relative;
  flex: 0 1 300px;
  min-width: 200px;
}

.toolbar-search svg {
  position: absolute;
  top: 50%;
  left: 11px;
  width: 16px;
  height: 16px;
  color: var(--muted);
  pointer-events: none;
  transform: translateY(-50%);
}

.toolbar-search input[type='search'] {
  padding-left: 34px;
  border-color: var(--line-strong);
  background: var(--surface);
}

.toolbar-search input::placeholder {
  color: var(--muted);
}

.toolbar-search:focus-within svg {
  color: var(--ink);
}

.primary-search {
  flex: 1 1 420px;
  max-width: 560px;
}

.primary-search input[type='search'] {
  height: 36px;
  font-size: 14px;
}

.policy-toolbar .pills button {
  height: 30px;
}

.policy-toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
  margin: -12px -8px;
  padding: 12px 8px;
  background: var(--bg);
}

.filter-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -16px;
  color: var(--muted);
  font-size: 13px;
}

.notice {
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--fill);
  white-space: pre-wrap;
}

.notice.ok {
  border-color: var(--ok-border);
  background: var(--ok-bg);
  color: var(--ok-fg);
}

.notice.error {
  border-color: var(--err-border);
  background: var(--err-bg);
  color: var(--err-fg);
}

.notice.warn {
  border-color: var(--warn-border);
  background: var(--warn-bg);
  color: var(--warn-fg);
}

.notice a {
  font-weight: 500;
}

.notices {
  display: grid;
  gap: 8px;
}

.field-error {
  color: var(--err-fg);
  font-size: 13px;
  overflow-wrap: anywhere;
}

.empty {
  padding: 24px 16px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-lg);
  color: var(--muted);
  text-align: center;
}

.card .empty {
  border: 0;
}

.footnote {
  margin-top: -16px;
  color: var(--faint);
  font-size: 13px;
}

.footnote:empty {
  display: none;
}

.status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
}

.status-headline {
  font-size: 17px;
  font-weight: 600;
}

.status-facts {
  margin-top: 2px;
  color: var(--muted);
}

.attention-row {
  justify-content: space-between;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.tiles:empty {
  display: none;
}

.tile {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: 0 0 0 1px var(--ring);
}

.tile span {
  color: var(--muted);
  font-size: 13px;
}

.tile strong {
  display: block;
  margin-top: 4px;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.tile-spark {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  width: min(45%, 160px);
  height: 34px;
}

.spark-bar {
  flex: 1 1 0;
  border-radius: 2px;
  background: var(--accent);
}

.spark-bar.spark-zero {
  background: var(--line-strong);
}

.compact-row,
.rule-count-row {
  align-content: center;
  align-items: baseline;
}

.compact-row {
  display: grid;
  grid-template-columns: 80px 110px minmax(0, 3fr) minmax(0, 2fr);
}

.compact-row time {
  color: var(--faint);
  font-size: 13px;
  white-space: nowrap;
}

.rule-count-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 72px;
}

.rule-count-row .count {
  text-align: right;
}

.rule-label {
  font-weight: 500;
}

.feed-agent {
  overflow: hidden;
  color: var(--muted);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feed-command {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feed-rule {
  max-width: 30ch;
  overflow: hidden;
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.day-heading {
  padding: 12px var(--row-x) 4px;
  color: var(--faint);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.day-heading:first-child {
  padding-top: 8px;
}

.feed-row {
  border-radius: var(--radius);
}

.feed-row:has(> [aria-expanded='true']) {
  background: var(--fill);
}

.feed-summary {
  display: grid;
  grid-template-columns: 16px 68px 76px 112px minmax(0, 3fr) minmax(0, 2fr);
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 40px;
  padding: 0 var(--row-x);
  border: 0;
  border-radius: var(--radius);
  font-weight: 400;
  text-align: left;
}

.feed-summary time {
  color: var(--faint);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.decision {
  justify-self: start;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
}

.decision.deny {
  background: var(--err-bg);
  color: var(--err-fg);
}

.decision.allow {
  background: var(--ok-bg);
  color: var(--ok-fg);
}

.decision.error {
  background: var(--warn-bg);
  color: var(--warn-fg);
}

.feed-detail {
  display: grid;
  gap: 12px;
  padding: 4px var(--row-x) 14px;
}

code.block {
  display: block;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: 0 0 0 1px var(--line);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.detail-rows {
  display: grid;
  gap: 4px;
}

.detail-rows div {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 12px;
}

.detail-rows dt {
  color: var(--faint);
}

.detail-rows dd {
  overflow-wrap: anywhere;
}

.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-actions button:not(.primary) {
  background: var(--surface);
}

.rule-id {
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 12.5px;
}

a.rule-id {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: var(--line-strong);
  text-underline-offset: 3px;
}

a.rule-id:hover {
  text-decoration-color: currentColor;
}

.project-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: -12px;
  padding: 12px 16px;
  border: 1px solid var(--info-border);
  border-radius: var(--radius);
  background: var(--info-bg);
}

.project-bar code {
  overflow-wrap: anywhere;
}

.project-bar p {
  margin-top: 2px;
  color: var(--muted);
  font-size: 13px;
}

.project-chip {
  flex: none;
  height: 22px;
  padding: 0 8px;
  border: 0;
  border-radius: 999px;
  background: var(--info-bg);
  color: var(--info-fg);
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
}

button.project-chip:hover:not(:disabled) {
  background: var(--info-bg);
  text-decoration: line-through;
}

.project-chip.inherited {
  background: var(--fill);
  color: var(--faint);
  font-weight: 400;
}

.project-chip-slot:empty {
  display: none;
}

.recovery {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--err-border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.recovery p {
  margin-top: 4px;
}

.page-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.tester-dialog {
  width: min(600px, calc(100vw - 32px));
}

.prompt-field {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  height: var(--control-h);
  padding-left: 10px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--field-bg);
  cursor: text;
}

.prompt-field:focus-within {
  border-color: var(--focus-ring);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus-ring) 20%, transparent);
}

.prompt {
  color: var(--faint);
  font-family: var(--font-mono);
  font-size: 13px;
}

.prompt-field input[type='text'] {
  height: 100%;
  padding: 0 10px 0 8px;
  border: 0;
  background: transparent;
}

.prompt-field input[type='text']:focus {
  box-shadow: none;
}

.tester-segment {
  margin-top: 6px;
}

.preset-status {
  margin-left: auto;
  color: var(--info-fg);
  font-size: 13px;
  font-weight: 500;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.preset-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-content: start;
  gap: 2px 10px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: 0 0 0 1px var(--ring);
  cursor: pointer;
}

.preset-card:hover {
  box-shadow: 0 0 0 1px var(--line-strong);
}

.preset-card input {
  margin: 4px 0 0;
  accent-color: var(--preset-fg);
}

.preset-name {
  font-weight: 600;
}

.preset-description {
  grid-column: 2;
  color: var(--muted);
  font-size: 13px;
}

.preset-standard {
  --preset-fg: var(--ok-fg);
  --preset-bg: var(--ok-bg);
  --preset-border: var(--ok-border);
}

.preset-strict {
  --preset-fg: var(--info-fg);
  --preset-bg: var(--info-bg);
  --preset-border: var(--info-border);
}

.preset-paranoid {
  --preset-fg: var(--paranoid-fg);
  --preset-bg: var(--paranoid-bg);
  --preset-border: var(--paranoid-border);
}

.preset-card:has(input:checked) {
  background: var(--preset-bg);
  box-shadow: 0 0 0 1px var(--preset-border);
}

.preset-card:has(input:checked) .preset-name {
  color: var(--preset-fg);
}

details > summary {
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  list-style: none;
  cursor: pointer;
}

details > summary::-webkit-details-marker {
  display: none;
}

details > summary::before,
.chevron::before {
  content: '';
  width: 6px;
  height: 6px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: translateX(-1px) rotate(-45deg);
}

details > summary::before {
  flex: none;
  margin: 0 4px;
}

details[open] > summary::before,
[aria-expanded='true'] > .chevron::before {
  transform: translateY(-1px) rotate(45deg);
}

.disclosure > summary {
  gap: 10px;
  width: auto;
  min-height: 48px;
  padding: 0 var(--card-x) 0 calc(var(--row-x) + 4px);
  border-radius: var(--radius-lg);
  font-weight: 600;
}

.disclosure > summary:hover {
  background: var(--hover);
}

.disclosure > summary::before {
  color: var(--faint);
}

.disclosure[open] > summary {
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.disclosure-sub {
  overflow: hidden;
  color: var(--faint);
  font-size: 13px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.disclosure-body {
  padding: 0 var(--card-x) 4px 38px;
  border-top: 1px solid var(--line);
}

#environment-overrides {
  font-size: 13px;
}

.master-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.master-state::after {
  content: 'Off';
  color: var(--err-fg);
  font-size: 13px;
  font-weight: 500;
}

.master-switch:has(:checked) .master-state::after {
  content: 'On';
  color: var(--muted);
}

.is-off .section-sub {
  color: var(--err-fg);
}

.rule-group + .rule-group {
  margin-top: 2px;
}

.rule-group-head {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0 var(--row-x);
  border-radius: var(--radius);
}

.rule-group-head:hover {
  background: var(--hover);
}

.group-toggle {
  flex: 1;
  align-self: stretch;
  justify-content: flex-start;
  gap: 8px;
  height: auto;
  padding: 0;
  border: 0;
  border-radius: 0;
  font-weight: 600;
  text-align: left;
}

.group-toggle:hover:not(:disabled) {
  background: transparent;
}

.group-counts {
  margin-left: auto;
  color: var(--faint);
  font-size: 13px;
  font-weight: 400;
}

.off-count {
  color: var(--warn-fg);
}

.chevron {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--faint);
}

.rule-list {
  padding-bottom: 4px;
}

.rule-row {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px var(--row-x) 10px calc(var(--row-x) + 24px);
  border-radius: var(--radius);
}

.rule-row > .switch {
  margin-top: 1px;
}

.rule-row:hover {
  background: var(--hover);
}

.rule-row.row-disabled .rule-body {
  opacity: 0.5;
}

.rule-body {
  flex: 1;
  min-width: 0;
}

.rule-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px 10px;
  min-height: 22px;
}

.rule-line .quiet.small {
  height: 22px;
  margin-left: -4px;
  padding: 0 6px;
}

.rule-name {
  font-weight: 500;
}

.rule-description {
  margin-top: 2px;
  color: var(--muted);
  font-size: 13px;
}

.tier-badge {
  align-self: center;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
}

.tier-badge.strict {
  background: var(--info-bg);
  color: var(--info-fg);
}

.tier-badge.paranoid {
  background: var(--paranoid-bg);
  color: var(--paranoid-fg);
}

.rule-note {
  color: var(--faint);
  font-size: 13px;
}

.rule-note::before {
  content: '· ';
}

.rule-note.changed {
  color: var(--warn-fg);
}

.rule-note.strict {
  color: var(--info-fg);
}

.rule-note.paranoid {
  color: var(--paranoid-fg);
}

.rule-note:empty {
  display: none;
}

.lock {
  display: inline-flex;
  flex: none;
  justify-content: center;
  width: 34px;
  height: 22px;
  align-items: center;
  color: var(--faint);
}

.lock svg {
  width: 15px;
  height: 15px;
}

.info-button,
.info-spacer {
  flex: none;
  width: 26px;
  height: 26px;
}

.info-button {
  margin: -2px -4px 0 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: var(--faint);
}

.info-button:hover:not(:disabled) {
  background: var(--hover);
  color: var(--ink);
}

.info-button svg {
  width: 16px;
  height: 16px;
}

.path-list {
  display: grid;
  gap: 8px;
  padding: 16px 0;
}

.path-list-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.path-list-head strong {
  font-weight: 500;
}

.path-list-help {
  margin-top: -6px;
  color: var(--muted);
  font-size: 13px;
}

.paths {
  display: grid;
  gap: 4px;
}

.paths:empty {
  display: none;
}

.path-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--control-h);
  padding: 0 2px 0 10px;
  border-radius: var(--radius-sm);
  background: var(--fill);
}

.path-item code {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.path-item.row-disabled code {
  opacity: 0.5;
}

.json-body {
  position: relative;
  display: grid;
  padding: var(--card-x);
}

.json-body button {
  position: absolute;
  top: calc(var(--card-x) + 6px);
  right: calc(var(--card-x) + 6px);
  height: 28px;
  padding: 0 8px;
}

#raw {
  min-height: 300px;
}

.savebar {
  position: sticky;
  bottom: 16px;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 10px 10px 18px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-float);
}

.savebar-text {
  display: grid;
  min-width: 0;
}

.savebar-text strong {
  font-weight: 500;
}

.savebar-text span {
  overflow: hidden;
  color: var(--muted);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.savebar-actions {
  display: flex;
  gap: 8px;
}

.rulebook {
  display: grid;
  gap: 8px;
}

.rulebook + .rulebook {
  margin-top: 16px;
}

.rulebook-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 12px;
  color: var(--muted);
  font-size: 13px;
}

.rulebook-head strong {
  color: var(--ink);
  font-size: 14px;
}

.rulebook-rule {
  display: grid;
  gap: 4px;
}

.rulebook-rule.focused {
  margin: 0 calc(-1 * var(--card-x));
  padding-right: var(--card-x);
  padding-left: calc(var(--card-x) - 3px);
  border-left: 3px solid var(--focus-ring);
  background: var(--fill);
}

.rulebook-rule-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
}

.rulebook-rule .command {
  font-weight: 600;
}

.rulebook-rule p.muted {
  font-size: 13px;
}

.form-grid {
  display: grid;
  gap: 18px;
}

.field {
  display: grid;
  gap: 6px;
}

.field-label {
  font-weight: 500;
}

.field .pills {
  justify-self: start;
}

.field small {
  color: var(--muted);
  font-size: 13px;
}

#rules-composer-input {
  font-family: var(--font-sans);
  font-size: 14px;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.chip-row-label {
  color: var(--faint);
  font-size: 13px;
}

button.chip {
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  background: var(--fill);
  color: var(--muted);
  font-size: 13px;
}

button.chip:hover:not(:disabled) {
  background: var(--selected);
  color: var(--ink);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.agent-groups {
  display: grid;
  gap: 28px;
}

.agent-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 200px) 130px 96px;
  align-items: baseline;
  gap: 4px 16px;
}

.agent-name {
  font-weight: 500;
}

.agent-version {
  overflow: hidden;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.agent-status {
  color: var(--muted);
  font-size: 13px;
}

.agent-status.active {
  color: var(--ok-fg);
}

.agent-status.disabled {
  color: var(--warn-fg);
}

.agent-action {
  justify-self: end;
}

.agent-row .notice {
  grid-column: 1 / -1;
}

.missing-agents summary {
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
}

.missing-agents summary:hover {
  color: var(--ink);
}

.retention-input {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
}

.retention-input input {
  width: 72px;
  padding: 0 8px;
  text-align: right;
}

#project-policy-notice {
  font-size: 13px;
}

.toast {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 200;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: min(400px, calc(100vw - 32px));
  padding: 12px 8px 12px 14px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-float);
}

.toast::before {
  content: '';
  flex: none;
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--faint);
}

.toast.ok::before {
  background: var(--ok-fg);
}

.toast.error::before {
  background: var(--err-fg);
}

.toast-text {
  flex: 1;
  min-width: 0;
}

.toast-text strong {
  font-weight: 500;
}

.toast-text p {
  margin-top: 2px;
  color: var(--muted);
  font-size: 13px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.toast .icon-only {
  margin-top: -3px;
  border: 0;
  color: var(--faint);
}

.rule-example-popover,
.confirm-dialog {
  border: 0;
  border-radius: var(--radius-lg);
  background: var(--surface);
  color: var(--ink);
}

.rule-example-popover {
  position: fixed;
  inset: auto;
  width: min(380px, calc(100vw - 24px));
  margin: 0;
  padding: 14px;
  box-shadow: var(--shadow-float);
}

.rule-example-popover::backdrop {
  background: transparent;
}

.rule-example-popover > * {
  display: block;
}

.rule-example-label {
  color: var(--faint);
  font-size: 12px;
}

.rule-example-popover strong {
  margin-top: 2px;
  font-weight: 500;
}

.rule-example-popover p {
  margin: 2px 0 10px;
  color: var(--muted);
  font-size: 13px;
}

.rule-example-popover code {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  background: var(--fill);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.rule-example-popover p + code {
  margin-top: 0;
}

.confirm-dialog {
  width: min(440px, calc(100vw - 32px));
  padding: 0;
  box-shadow:
    0 0 0 1px var(--line-strong),
    0 16px 48px rgb(0 0 0 / 24%);
}

.confirm-dialog::backdrop {
  background: rgb(0 0 0 / 45%);
}

.confirm-dialog form {
  display: grid;
  gap: 12px;
  padding: 20px;
}

.confirm-dialog h2 {
  font-size: 16px;
  font-weight: 600;
}

.confirm-dialog form > p {
  color: var(--muted);
}

.confirm-dialog:has(.dialog-rows:not([hidden])) {
  width: min(640px, calc(100vw - 32px));
}

.report-dialog {
  width: min(680px, calc(100vw - 32px));
}

.dialog-detail {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  background: var(--fill);
  overflow-wrap: anywhere;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

.dialog-rows {
  display: grid;
  gap: 8px;
  max-height: 46vh;
  overflow: auto;
}

.diff-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  text-align: left;
}

.diff-table th {
  padding: 4px 8px;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-weight: 500;
}

.diff-table td {
  padding: 6px 8px;
  border-bottom: 1px solid var(--line);
  overflow-wrap: anywhere;
  vertical-align: top;
}

.diff-before {
  color: var(--muted);
  text-decoration: line-through;
}

.diff-after {
  font-weight: 500;
}

.report-field {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 13px;
}

.star-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px 12px 16px;
  border-radius: var(--radius-lg);
  box-shadow: 0 0 0 1px var(--line);
}

.star-pitch {
  flex: 1;
  min-width: 0;
  color: var(--muted);
  font-size: 13px;
}

.star-pitch strong {
  color: var(--ink);
}

.star-cta {
  gap: 8px;
  text-decoration: none;
}

.star-icon {
  display: inline-flex;
  color: var(--star);
}

.star-icon svg {
  width: 15px;
  height: 15px;
}

.star-count {
  padding-left: 8px;
  border-left: 1px solid var(--line-strong);
  color: var(--muted);
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}

.star-cta.starred:disabled {
  opacity: 1;
  cursor: default;
}

@media (max-width: 860px) {
  .app-shell {
    grid-template-columns: minmax(0, 1fr);
  }

  .sidebar {
    z-index: 100;
    height: auto;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .brand {
    padding: 0;
  }

  .brand-logo svg {
    height: 22px;
  }

  .sidenav {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }

  .sidenav a {
    position: relative;
    padding: 0 8px;
  }

  .sr-only-collapse {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .nav-dirty {
    position: absolute;
    top: 3px;
    right: 2px;
    width: 7px;
    height: 7px;
    padding: 0;
    overflow: hidden;
    border-radius: 50%;
    background: var(--warn-fg);
    color: transparent;
  }

  .sidebar-foot {
    display: none;
  }

  .app-foot {
    display: flex;
    justify-content: center;
    gap: 28px;
    padding: 16px;
    border-top: 1px solid var(--line);
    font-size: 13px;
  }

  .preset-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .feed-summary {
    grid-template-columns: 16px 64px 72px minmax(0, 1fr);
  }

  .feed-summary .feed-agent,
  .feed-summary .feed-rule,
  .compact-row .feed-agent,
  .compact-row .feed-rule {
    display: none;
  }

  .compact-row {
    grid-template-columns: 72px minmax(0, 1fr);
  }

  .rule-count-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .agent-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .agent-status:empty {
    display: none;
  }

  .agent-version {
    display: none;
  }
}

@media (max-width: 640px) {
  main {
    padding: 24px 16px 56px;
  }

  .tiles {
    grid-template-columns: minmax(0, 1fr);
  }

  .panel-head {
    flex-direction: column;
    align-items: stretch;
  }

  .panel-head .section-actions {
    justify-content: space-between;
  }

  .panel-head .section-actions > .quiet {
    margin-left: -13px;
  }

  .setting-row.info button {
    align-self: flex-start;
    margin-left: -9px;
  }

  .toolbar-search {
    flex: 1 1 100%;
  }

  .rule-row {
    padding-left: var(--row-x);
  }

  .status-card,
  .savebar,
  .project-bar,
  .recovery,
  .setting-row {
    flex-direction: column;
    align-items: stretch;
  }

  .setting-label {
    width: auto;
  }

  .detail-rows div {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
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
        <a href="#policy" data-nav="policy" title="Protections"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z"></path></svg><span class="sr-only-collapse">Protections</span><span class="nav-dirty" id="nav-dirty" hidden>Unsaved</span></a>
        <a href="#rules" data-nav="rules" title="Custom rules"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"></path><path d="M15 3v4h4"></path><path d="M9 12h6M9 16h4"></path></svg><span class="sr-only-collapse">Custom rules</span></a>
        <a href="#integrations" data-nav="integrations" title="Agents"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5"></path></svg><span class="sr-only-collapse">Agents</span></a>
        <a href="#settings" data-nav="settings" title="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h10M18 8h2M4 16h2M10 16h10"></path><circle cx="16" cy="8" r="2.2"></circle><circle cx="8" cy="16" r="2.2"></circle></svg><span class="sr-only-collapse">Settings</span></a>
      </nav>
      <div class="sidebar-foot">
        <a href="https://github.com/kenryu42/cc-safety-net" target="_blank" rel="noopener">GitHub</a>
        <a href="https://ccsafetynet.com/docs" target="_blank" rel="noopener">Documentation</a>
      </div>
    </aside>
    <div class="content">
      <main>
        <div class="banner" id="protection-banner" role="alert" hidden></div>

        <section class="view" data-view="overview">
          <header class="page-head">
            <div>
              <h2>Overview</h2>
              <p>What CC Safety Net has been doing on this machine.</p>
            </div>
          </header>
          <div class="card status-card" id="status-card" aria-live="polite"><p class="muted">Loading…</p></div>
          <section class="section" id="attention" hidden>
            <div class="section-head"><h3 class="section-title">Needs attention</h3></div>
            <ul class="card list" id="attention-list"></ul>
          </section>
          <div class="tiles" id="overview-tiles"></div>
          <section class="section">
            <div class="section-head">
              <h3 class="section-title">Recent blocks</h3>
              <a class="link-button" href="#activity">All activity</a>
            </div>
            <div id="recent-blocks"></div>
          </section>
          <section class="section">
            <div class="section-head">
              <h3 class="section-title" id="top-rules-title">Most-triggered rules</h3>
            </div>
            <div id="top-rules"></div>
          </section>
          <div class="star-row" id="star-row" hidden>
            <p class="star-pitch"><span id="star-pitch-text"></span></p>
            <span id="star-slot"></span>
          </div>
        </section>

        <section class="view" data-view="activity" hidden>
          <header class="page-head">
            <div>
              <h2>Activity</h2>
              <p>Commands your agents ran, newest first. Commands are secret-redacted when they are logged.</p>
            </div>
            <button type="button" class="quiet icon-button" id="activity-refresh" aria-label="Refresh activity" title="Refresh activity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg></button>
          </header>
          <div class="toolbar">
            <div class="pills" id="activity-decision" role="group" aria-label="Decision"></div>
            <span class="toolbar-spacer"></span>
            <label class="toolbar-search"><span class="sr-only">Search activity</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input type="search" id="activity-search" autocomplete="off" placeholder="Search commands or rule IDs"></label>
            <label class="toolbar-select"><span class="sr-only">Agent</span><select id="activity-agent"></select></label>
            <label class="toolbar-select"><span class="sr-only">Time window</span><select id="activity-days"></select></label>
          </div>
          <div class="filter-line" id="activity-command-filter" hidden></div>
          <div class="card list" id="activity-feed"><p class="empty">Loading activity…</p></div>
          <p class="footnote" id="activity-count"></p>
        </section>

        <section class="view" data-view="policy" hidden>
          <header class="page-head">
            <div>
              <h2>Protections</h2>
              <p>Choose what CC Safety Net blocks. Changes apply after you save.</p>
            </div>
            <div class="page-actions">
              <div class="pills" role="group" aria-label="Policy you are editing">
                <button type="button" id="scope-user" aria-pressed="true">My policy</button>
                <button type="button" id="project-draft-enter" aria-pressed="false">Project policy</button>
              </div>
              <button type="button" id="tester-open" aria-haspopup="dialog">Test a command</button>
            </div>
          </header>
          <div class="project-bar" id="project-draft-bar" hidden>
            <div>
              <strong>Editing the project policy</strong> <code id="project-draft-path"></code>
              <p>Only settings tagged <span class="project-chip">Project</span> are written. Everything else keeps following each person's own policy. Click a Project tag to stop setting that field.</p>
            </div>
            <button type="button" id="project-draft-change" hidden>Change folder…</button>
          </div>
          <p class="notice error" id="project-draft-diagnostics" hidden></p>
          <div class="recovery" id="recovery" hidden>
            <div>
              <strong>Your policy file needs repair</strong>
              <p>Repair keeps every valid setting and rewrites the file. If the JSON cannot be read at all, defaults are restored.</p>
              <p class="notice error" id="policy-errors"></p>
            </div>
            <button class="primary" id="repair" type="button">Repair</button>
          </div>

          <section class="section">
            <div class="section-head">
              <div>
                <h3 class="section-title">Safety preset</h3>
                <p class="section-sub">Each preset includes everything in the one before it.</p>
              </div>
              <span class="preset-status" id="safety-preset-status"></span>
              <span class="project-chip-slot" id="safety-level-chip"></span>
            </div>
            <div class="preset-grid" id="safety-level"></div>
            <p class="notice" id="environment-overrides" hidden></p>
            <details class="card disclosure">
              <summary><span class="disclosure-title">Advanced settings</span><span class="disclosure-sub">Preset checks and linked worktrees</span></summary>
              <div class="disclosure-body">
                <div id="safety-overrides"></div>
                <div id="workflow"></div>
              </div>
            </details>
          </section>

          <div class="toolbar policy-toolbar">
            <label class="toolbar-search primary-search"><span class="sr-only">Search protections</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input type="search" id="policy-search" autocomplete="off" aria-keyshortcuts="/" placeholder="Type / to search by name, path or rule ID"></label>
            <div class="pills" role="group" aria-label="Which protections to show">
              <button type="button" data-policy-show="all" aria-pressed="true">All</button>
              <button type="button" data-policy-show="changed" aria-pressed="false">Changed from default <span class="count" id="changed-count"></span></button>
            </div>
          </div>

          <section class="card panel" id="destructive-panel">
            <div class="panel-head">
              <div>
                <h3 class="section-title" id="destructive-label">Command protection</h3>
                <p class="section-sub" id="destructive-command-summary"></p>
              </div>
              <div class="section-actions">
                <button type="button" class="quiet" id="reset-rule-customizations">Reset all</button>
                <span class="project-chip-slot" id="destructive-enabled-chip"></span>
                <label class="master-switch"><span class="master-state"></span><input type="checkbox" class="switch" id="destructive-enabled" aria-labelledby="destructive-label"></label>
              </div>
            </div>
            <div class="panel-list" id="destructive-command-rules"></div>
          </section>

          <section class="card panel" id="secret-panel">
            <div class="panel-head">
              <div>
                <h3 class="section-title" id="secret-label">Secret protection</h3>
                <p class="section-sub" id="secret-summary"></p>
              </div>
              <div class="section-actions">
                <button type="button" class="quiet" id="reset-secret-customizations">Reset all</button>
                <span class="project-chip-slot" id="secret-enabled-chip"></span>
                <label class="master-switch"><span class="master-state"></span><input type="checkbox" class="switch" id="secret-enabled" aria-labelledby="secret-label"></label>
              </div>
            </div>
            <div class="panel-list" id="secret-patterns"></div>
          </section>

          <section class="card panel">
            <div class="panel-head">
              <div>
                <h3 class="section-title">Exceptions and extra paths</h3>
                <p class="section-sub">Paths can be absolute or start with <code>~/</code>. Paste several lines to add many at once. Paths that cover your home directory are rejected.</p>
              </div>
            </div>
            <div class="panel-rows">
              <div class="path-list">
                <div class="path-list-head"><strong id="allow-paths-label">Allow recursive deletes in</strong><span class="count" id="allow-paths-count"></span><span class="project-chip-slot" id="allow-paths-chip"></span></div>
                <p class="path-list-help">Recursive deletes inside these paths are not blocked, like a scratch folder under <code>/tmp</code>.</p>
                <div class="input-row"><input type="text" class="mono" id="allow-paths-input" data-path-input="allow-paths" autocomplete="off" spellcheck="false" placeholder="/absolute/path or ~/path" aria-labelledby="allow-paths-label"><button type="button" id="allow-paths-add-button" data-path-add="allow-paths">Add</button></div>
                <p class="field-error" id="allow-paths-hint" hidden></p>
                <ul class="paths" id="allow-paths-list"></ul>
              </div>
              <div class="path-list">
                <div class="path-list-head"><strong id="deny-paths-label">Always block access to</strong><span class="count" id="deny-paths-count"></span><span class="project-chip-slot" id="deny-paths-chip"></span></div>
                <p class="path-list-help">These paths and everything inside them are blocked while secret protection is on.</p>
                <div class="input-row"><input type="text" class="mono" id="deny-paths-input" data-path-input="deny-paths" autocomplete="off" spellcheck="false" placeholder="path/to/protect" aria-labelledby="deny-paths-label"><button type="button" id="deny-paths-add-button" data-path-add="deny-paths">Add</button></div>
                <p class="field-error" id="deny-paths-hint" hidden></p>
                <ul class="paths" id="deny-paths-list"></ul>
              </div>
              <div class="path-list">
                <div class="path-list-head"><strong id="secret-allow-paths-label">Exempt from secret patterns</strong><span class="count" id="secret-allow-paths-count"></span><span class="project-chip-slot" id="secret-allow-paths-chip"></span></div>
                <p class="path-list-help">Files, folders, or one file name under a folder such as <code>~/code/**/.env.local</code>. Deny paths and coding agent credentials still apply.</p>
                <div class="input-row"><input type="text" class="mono" id="secret-allow-paths-input" data-path-input="secret-allow-paths" autocomplete="off" spellcheck="false" placeholder="~/code/**/.env.local" aria-labelledby="secret-allow-paths-label"><button type="button" id="secret-allow-paths-add-button" data-path-add="secret-allow-paths">Add</button></div>
                <p class="field-error" id="secret-allow-paths-hint" hidden></p>
                <ul class="paths" id="secret-allow-paths-list"></ul>
              </div>
            </div>
          </section>

          <details class="card disclosure">
            <summary><span class="disclosure-title">Policy JSON</span><span class="disclosure-sub" id="raw-source">Read-only. Mirrors the settings above.</span></summary>
            <div class="disclosure-body json-body">
              <button type="button" class="quiet" id="raw-copy"></button>
              <textarea id="raw" aria-label="Policy JSON" aria-describedby="raw-source" readonly></textarea>
            </div>
          </details>

          <div class="savebar" id="policy-savebar" hidden>
            <div class="savebar-text">
              <strong id="savebar-title">Unsaved changes</strong>
              <span id="savebar-summary"></span>
            </div>
            <div class="savebar-actions">
              <button type="button" id="discard-changes">Discard</button>
              <button type="button" class="primary" id="save">Save</button>
            </div>
          </div>
        </section>

        <section class="view" data-view="rules" hidden>
          <header class="page-head">
            <div>
              <h2>Custom rules</h2>
              <p>Your own blocking rules from rulebooks, enforced on top of the built-in protections.</p>
            </div>
            <button type="button" class="quiet icon-button" id="rules-refresh" aria-label="Refresh custom rules" title="Refresh custom rules"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg></button>
          </header>
          <section class="section" id="rules-diagnostics-panel" hidden>
            <div class="section-head">
              <div>
                <h3 class="section-title">Problems</h3>
                <p class="section-sub">An error means a rulebook was skipped and none of its rules are enforced.</p>
              </div>
            </div>
            <div class="notices" id="rules-diagnostics"></div>
          </section>
          <section class="section">
            <div class="section-head">
              <div>
                <h3 class="section-title">Rulebooks</h3>
                <p class="section-sub">Read-only. Rules are shown as they are enforced.</p>
              </div>
            </div>
            <div id="rules-list"><p class="empty">Loading rules…</p></div>
          </section>
          <section class="section" id="rules-composer-panel">
            <div class="section-head">
              <div>
                <h3 class="section-title">Create a rule</h3>
                <p class="section-sub">Describe the rule and copy a ready-made prompt for your coding agent. CC Safety Net does not write rulebooks itself.</p>
              </div>
            </div>
            <div class="card pad">
              <div class="form-grid">
                <div class="field">
                  <span class="field-label">Applies to</span>
                  <div class="pills" role="group" aria-label="Rule scope">
                    <button type="button" data-rules-scope="project" aria-pressed="true">This project</button>
                    <button type="button" data-rules-scope="user" aria-pressed="false">All projects</button>
                  </div>
                </div>
                <div class="field" id="rules-project-path-field">
                  <label class="field-label" id="rules-project-path-label" for="rules-project-path">Project folder</label>
                  <div class="input-row">
                    <input type="text" class="mono" id="rules-project-path" spellcheck="false" autocomplete="off" aria-describedby="rules-project-path-hint">
                    <button type="button" id="rules-choose-directory" hidden>Choose…</button>
                  </div>
                  <small id="rules-project-path-hint">Where the rulebook is written. Defaults to the folder this GUI was started from.</small>
                </div>
                <div class="field">
                  <label class="field-label" id="rules-composer-label" for="rules-composer-input">What should be blocked?</label>
                  <textarea id="rules-composer-input" spellcheck="false" placeholder="Block terraform destroy in this project" aria-describedby="rules-composer-hint"></textarea>
                  <small id="rules-composer-hint">Rules match a command, its subcommands, and exact arguments, not file paths or patterns.</small>
                  <div class="chip-row">
                    <span class="chip-row-label">Try:</span>
                    <button type="button" class="chip" data-rules-example="read my package.json and suggest blocking rules">Suggest rules</button>
                    <button type="button" class="chip" data-rules-example="set up rules to block all terraform destroy commands">Block a command</button>
                    <button type="button" class="chip" data-rules-example="verify my rules and fix any errors">Verify rules</button>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="primary" id="rules-copy-prompt">Copy prompt</button>
              </div>
            </div>
          </section>
        </section>

        <section class="view" data-view="integrations" hidden>
          <header class="page-head">
            <div>
              <h2>Agents</h2>
              <p>Install or remove the CC Safety Net hook for each coding agent on this machine.</p>
            </div>
            <button type="button" class="quiet icon-button" id="integrations-refresh" aria-label="Refresh agents" title="Refresh agents"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg></button>
          </header>
          <div class="agent-groups" id="integrations-list"><p class="empty">Checking agents…</p></div>
        </section>

        <section class="view" data-view="settings" hidden>
          <header class="page-head">
            <div>
              <h2>Settings</h2>
              <p>Appearance, log retention, file locations, and maintenance.</p>
            </div>
          </header>
          <section class="section">
            <div class="section-head"><h3 class="section-title">Appearance</h3></div>
            <div class="card rows">
              <div class="setting-row">
                <div class="setting-text"><strong>Theme</strong><small>Saved in this browser.</small></div>
                <div class="pills" id="settings-theme" role="group" aria-label="Theme">
                  <button type="button" data-theme-choice="auto" aria-pressed="true">Auto</button>
                  <button type="button" data-theme-choice="light" aria-pressed="false">Light</button>
                  <button type="button" data-theme-choice="dark" aria-pressed="false">Dark</button>
                </div>
              </div>
            </div>
          </section>
          <section class="section">
            <div class="section-head"><h3 class="section-title">Audit log</h3></div>
            <div class="card rows">
              <div class="setting-row">
                <div class="setting-text"><label for="retention-days"><strong>Keep logs for</strong></label><small id="retention-note">Every checked command is logged. Lowering this deletes older entries, and Activity can only look back this far.</small></div>
                <span class="retention-input"><input type="number" id="retention-days" min="1" max="365" step="1" inputmode="numeric" aria-describedby="retention-note"><span id="retention-unit">days</span></span>
              </div>
              <div class="setting-row info"><span class="setting-label">Log folder</span><code id="logs-path"></code><button type="button" class="quiet small" data-copy-path="logs-path" aria-label="Copy the log folder path"></button></div>
            </div>
          </section>
          <section class="section">
            <div class="section-head"><h3 class="section-title">Files</h3></div>
            <div class="card rows">
              <div class="setting-row info"><span class="setting-label">Policy file</span><code id="policy-path"></code><button type="button" class="quiet small" data-copy-path="policy-path" aria-label="Copy the policy file path"></button></div>
              <div class="setting-row info" id="project-policy-row" hidden><span class="setting-label">Project policy</span><code id="project-policy-path"></code><button type="button" class="quiet small" data-copy-path="project-policy-path" aria-label="Copy the project policy path"></button></div>
            </div>
            <p class="notice" id="project-policy-notice" hidden></p>
          </section>
          <section class="section">
            <div class="section-head"><h3 class="section-title">About</h3></div>
            <div class="card rows">
              <div class="setting-row info"><span class="setting-label">CC Safety Net</span><code id="app-version"></code></div>
              <div class="setting-row info"><span class="setting-label">Node.js</span><code id="integrations-node-version"></code></div>
              <div class="setting-row info"><span class="setting-label">Platform</span><code id="integrations-platform"></code></div>
            </div>
          </section>
          <section class="section">
            <div class="section-head"><h3 class="section-title">Danger zone</h3></div>
            <div class="card rows">
              <div class="setting-row">
                <div class="setting-text"><strong>Reset policy</strong><small>Replace your policy file with the defaults. This cannot be undone.</small></div>
                <button type="button" class="danger-quiet" id="reset">Reset policy</button>
              </div>
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
  <div class="toast" id="toast" role="status" aria-live="polite" hidden>
    <div class="toast-text">
      <strong id="toast-title"></strong>
      <p id="toast-detail" hidden></p>
    </div>
    <button type="button" class="quiet icon-only" id="toast-close" aria-label="Dismiss message">✕</button>
  </div>
  <div class="rule-example-popover" id="rule-example-popover" popover="auto" role="dialog" aria-labelledby="rule-example-title" aria-describedby="rule-example-command">
    <span class="rule-example-label" id="rule-example-label"></span>
    <strong id="rule-example-title"></strong>
    <p id="rule-example-description"></p>
    <code id="rule-example-command"></code>
  </div>
  <dialog class="confirm-dialog" id="confirm-dialog" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-body confirm-dialog-detail">
    <form method="dialog">
      <h2 id="confirm-dialog-title"></h2>
      <p id="confirm-dialog-body"></p>
      <div class="dialog-rows" id="confirm-dialog-rows" hidden></div>
      <p class="dialog-detail"><code id="confirm-dialog-detail"></code></p>
      <div class="dialog-actions">
        <button type="submit" id="confirm-dialog-cancel" value="cancel">Cancel</button>
        <button type="submit" class="danger" id="confirm-dialog-confirm" value="confirm"></button>
      </div>
    </form>
  </dialog>
  <dialog class="confirm-dialog tester-dialog" id="tester-dialog" aria-labelledby="tester-label" aria-describedby="tester-help">
    <form id="tester-form">
      <h2 id="tester-label">Test a command</h2>
      <p id="tester-help">Checks a command against the Protections settings, including unsaved changes and custom rules. Nothing is run.</p>
      <div class="input-row">
        <label class="prompt-field"><span class="prompt" aria-hidden="true">$</span><input type="text" id="tester-input" class="mono" autocomplete="off" spellcheck="false" placeholder="git push --force" aria-labelledby="tester-label"></label>
        <button type="submit" class="primary" id="tester-run">Test</button>
      </div>
      <div id="tester-result" class="notice" aria-live="polite" hidden></div>
      <div class="dialog-actions">
        <button type="button" id="tester-close">Close</button>
      </div>
    </form>
  </dialog>
  <dialog class="confirm-dialog report-dialog" id="report-dialog" aria-labelledby="report-dialog-title" aria-describedby="report-dialog-body">
    <form method="dialog">
      <h2 id="report-dialog-title">Report a false positive</h2>
      <p id="report-dialog-body">This opens a prefilled public GitHub issue form. Nothing is sent until you submit it there. Paths were replaced with <code>&lt;project&gt;</code> and <code>~</code>; edit anything else you would rather not publish.</p>
      <label class="report-field"><span>Why should it have been allowed? (optional)</span><textarea id="report-why" placeholder="What was the agent trying to do, and what makes the command safe there?"></textarea></label>
      <label class="report-field"><span>Title</span><input id="report-title" type="text" spellcheck="false"></label>
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

// src/gui/frontend/ui.ts
var agentLabels = integrationDisplayNames;
var shared = {
  policy: undefined,
  dirty: false,
  drafting: false
};
var emit = (name) => document.dispatchEvent(new Event(\`ccsn:\${name}\`));
var on = (name, listener) => document.addEventListener(\`ccsn:\${name}\`, listener);
var qs = (id) => document.getElementById(id);
var sessionToken = () => JSON.parse(qs("ccsn-data").textContent).token;
var requestJson = async (path, init = {}) => {
  const token = sessionToken();
  try {
    const response = await fetch(\`\${path}\${path.includes("?") ? "&" : "?"}token=\${encodeURIComponent(token)}\`, {
      ...init,
      headers: {
        "content-type": "application/json",
        "x-cc-safety-net-token": token,
        ...init.headers
      }
    });
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
var escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[char] ?? char);
var notifyTimer;
var notify = (title, kind = "info", detail = "") => {
  clearTimeout(notifyTimer);
  qs("toast").hidden = title === "";
  qs("toast").className = \`toast \${kind}\`;
  qs("toast-title").textContent = title;
  qs("toast-detail").textContent = detail;
  qs("toast-detail").hidden = detail === "";
  if (kind === "ok")
    notifyTimer = setTimeout(() => notify(""), 4000);
};
var icons = {
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2"></path></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>',
  remove: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>'
};
var showingCopied = new WeakSet;
var copyText = async (button, text) => {
  const copied = await navigator.clipboard.writeText(text).then(() => true, () => false);
  if (!copied) {
    notify("Copy failed", "error");
    return;
  }
  if (showingCopied.has(button))
    return;
  showingCopied.add(button);
  const label = button.innerHTML;
  button.innerHTML = \`\${icons.check}<span>Copied</span>\`;
  setTimeout(() => {
    button.innerHTML = label;
    showingCopied.delete(button);
  }, 1500);
};
var showPath = (id, path, suffix = "") => {
  const element = qs(id);
  element.dataset.path = path;
  element.innerHTML = path.split(/(?<=[\\\\/])/).map((part) => \`<span class="path-part">\${escapeHtml(part)}</span>\`).join("") + escapeHtml(suffix);
  document.querySelector(\`[data-copy-path="\${id}"]\`)?.toggleAttribute("hidden", path === "");
};
var runRefresh = async (button, reload) => {
  if (button.disabled)
    return;
  button.disabled = true;
  await reload();
  button.disabled = false;
};
var resolvePendingConfirm = null;
var initConfirmDialog = () => {
  const dialog = qs("confirm-dialog");
  dialog.addEventListener("close", () => {
    if (!resolvePendingConfirm)
      return;
    resolvePendingConfirm(dialog.returnValue === "confirm");
    resolvePendingConfirm = null;
  });
  dialog.addEventListener("cancel", () => {
    dialog.returnValue = "cancel";
  });
};
var confirmDialog = (options) => new Promise((resolve) => {
  if (resolvePendingConfirm) {
    resolve(false);
    return;
  }
  const dialog = qs("confirm-dialog");
  const confirm = qs("confirm-dialog-confirm");
  qs("confirm-dialog-title").textContent = options.title;
  qs("confirm-dialog-body").textContent = options.body;
  qs("confirm-dialog-detail").textContent = options.detail ?? "";
  qs("confirm-dialog-detail").parentElement.hidden = !options.detail;
  qs("confirm-dialog-rows").innerHTML = options.rowsHtml ?? "";
  qs("confirm-dialog-rows").hidden = !options.rowsHtml;
  confirm.textContent = options.confirmLabel;
  confirm.className = options.confirmClass ?? "danger";
  dialog.returnValue = "cancel";
  resolvePendingConfirm = resolve;
  dialog.showModal();
  qs("confirm-dialog-cancel").focus();
});

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

// src/gui/frontend/format.ts
var repoUrl = "https://github.com/kenryu42/cc-safety-net";
var formatCount = (value) => value.toLocaleString("en-US");
var plural = (count, noun, pluralNoun = \`\${noun}s\`) => \`\${formatCount(count)} \${count === 1 ? noun : pluralNoun}\`;
var dayCount = (days) => plural(days, "day");
var viewHash = (view, fields) => {
  const params = new URLSearchParams(fields.filter(([, value, fallback]) => value !== fallback).map(([key, value]) => [key, value]));
  return params.size > 0 ? \`\${view}?\${params}\` : view;
};

// src/gui/frontend/activity-filter.ts
var initialActivityFilters = () => ({
  days: 7,
  decision: "deny",
  agent: "all",
  query: "",
  command: ""
});
var decisions = new Set(["all", "deny", "allow", "error", "suspect"]);
var activityFiltersFromParams = (params) => {
  const defaults = initialActivityFilters();
  const days = Number(params.get("days"));
  const decision = params.get("decision") ?? "";
  return {
    days: Number.isInteger(days) && days > 0 ? days : defaults.days,
    decision: decisions.has(decision) ? decision : defaults.decision,
    agent: params.get("agent") ?? defaults.agent,
    query: params.get("q") ?? defaults.query,
    command: params.get("command") ?? defaults.command
  };
};
var activityHash = (filters) => {
  const defaults = initialActivityFilters();
  return viewHash("activity", [
    ["days", String(filters.days), String(defaults.days)],
    ["decision", filters.decision, defaults.decision],
    ["agent", filters.agent, defaults.agent],
    ["q", filters.query, defaults.query],
    ["command", filters.command, defaults.command]
  ]);
};
var visibleEntries = (entries, filters, suspects) => entries.filter((entry) => {
  const decisionMatches = {
    all: true,
    deny: entry.decision !== "allow",
    allow: entry.decision === "allow",
    error: Boolean(entry.failureStage),
    suspect: suspects.has(entry)
  }[filters.decision];
  if (!decisionMatches)
    return false;
  if (filters.agent !== "all" && (entry.agent || "unknown") !== filters.agent)
    return false;
  if (filters.command)
    return commandSignature(entry.segment || entry.command) === filters.command;
  return [entry.ruleId, entry.segment || entry.command].filter(Boolean).join(" ").toLowerCase().includes(filters.query.trim().toLowerCase());
});

// src/gui/frontend/report.ts
var reportIssueUrl = "https://github.com/kenryu42/cc-safety-net/issues/new?template=false_positive.yml";
var reportUrlLimit = 8000;
var titleCommandLimit = 80;
var reportTitle = (ruleId, command) => {
  const firstLine = command.trim().split(\`
\`)[0] ?? "";
  const shown = firstLine.length > titleCommandLimit ? \`\${firstLine.slice(0, titleCommandLimit)}…\` : firstLine;
  return \`[False Positive]: \${ruleId ? \`\${ruleId} \` : ""}blocked \\\`\${shown}\\\`\`;
};
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

// src/core/policy/safety-level.ts
var SAFETY_LEVEL_CAPABILITIES = {
  standard: { fail_closed: false, paranoid_rm: false, paranoid_interpreters: false },
  strict: { fail_closed: true, paranoid_rm: false, paranoid_interpreters: false },
  paranoid: { fail_closed: true, paranoid_rm: true, paranoid_interpreters: true }
};

// src/gui/frontend/health.ts
var groupIntegrations = (rows) => ({
  installed: rows.filter((row) => row.status === "active"),
  available: rows.filter((row) => row.status !== "active" && row.version !== null),
  missing: rows.filter((row) => row.status !== "active" && row.version === null)
});
var attentionItems = (facts) => [
  ...(facts.targets ?? []).filter((row) => row.status === "disabled").map((row) => ({
    text: \`\${row.label} is detected but its hook is disabled.\`,
    href: "#integrations"
  })),
  facts.suspects > 0 ? {
    text: \`\${plural(facts.suspects, "block")} in the last \${dayCount(facts.days)} \${facts.suspects === 1 ? "looks" : "look"} like a false positive.\`,
    href: "#activity?decision=suspect"
  } : null,
  facts.errors > 0 ? {
    text: \`\${plural(facts.errors, "guard error")} in the last \${dayCount(facts.days)}: commands blocked because evaluation failed, not by policy.\`,
    href: "#activity?decision=error"
  } : null,
  facts.update?.updateAvailable ? { text: \`Version \${facts.update.latestVersion} is available.\`, href: \`\${repoUrl}/releases\` } : null
].filter((item) => item !== null);

// src/gui/frontend/views/integrations.ts
var targets = null;
var busy = new Set;
var integrationTargets = () => targets;
var statusText = (row) => ({
  active: "Hook installed",
  disabled: "Hook disabled",
  "not-installed": "",
  "not-inspected": "Status unknown: its settings file could not be read"
})[row.status];
var rowHtml = (row) => {
  const uninstall = row.status === "active";
  const action = row.version === null ? "" : \`<button type="button" data-integration-action="\${uninstall ? "uninstall" : "install"}" data-integration-target="\${escapeHtml(row.target)}"\${busy.has(row.target) ? " disabled" : ""}>\${busy.has(row.target) ? uninstall ? "Uninstalling…" : "Installing…" : uninstall ? "Uninstall" : row.status === "disabled" ? "Enable" : "Install"}</button>\`;
  return \`<li class="setting-row agent-row">
    <span class="agent-name">\${escapeHtml(row.label)}</span>
    <span class="agent-version"\${row.version === null ? "" : \` title="v\${escapeHtml(row.version)}"\`}>\${row.version === null ? "Not detected" : \`v\${escapeHtml(row.version)}\`}</span>
    <span class="agent-status \${row.status}">\${statusText(row)}</span>
    <span class="agent-action">\${action}</span>
    \${row.note ? \`<p class="notice \${row.note.kind}">\${escapeHtml(row.note.text)}</p>\` : ""}
  </li>\`;
};
var groupHtml = (title, rows, sub = "") => rows.length === 0 ? "" : \`<section class="section"><div class="section-head"><div><h3 class="section-title">\${title} <span class="count">\${rows.length}</span></h3>\${sub ? \`<p class="section-sub">\${sub}</p>\` : ""}</div></div><ul class="card rows">\${rows.map(rowHtml).join("")}</ul></section>\`;
var render = () => {
  if (!targets)
    return;
  const groups = groupIntegrations(targets);
  qs("integrations-list").innerHTML = groupHtml("Installed", groups.installed) + groupHtml("Detected on this machine", groups.available, groups.installed.length === 0 ? "No agent has the hook yet. Install it for each agent you use; until then its commands are not checked." : "") + (groups.missing.length === 0 ? "" : \`<details class="section missing-agents"><summary>Not detected on this machine <span class="count">\${groups.missing.length}</span></summary><ul class="card rows">\${groups.missing.map(rowHtml).join("")}</ul></details>\`);
};
var loadIntegrations = async () => {
  const result = await requestJson("/api/integrations");
  if (!result.ok || !Array.isArray(result.data?.targets)) {
    qs("integrations-list").innerHTML = \`<p class="empty">Could not check agents: \${escapeHtml(errorText(result))}</p>\`;
    return;
  }
  targets = result.data.targets;
  qs("integrations-node-version").textContent = result.data.system.nodeVersion ?? "unknown";
  qs("integrations-platform").textContent = result.data.system.platform;
  render();
  emit("integrations");
};
var runAction = async (button) => {
  const target = button.dataset.integrationTarget;
  const action = button.dataset.integrationAction;
  if (!target || busy.has(target))
    return;
  busy.add(target);
  render();
  const result = await requestJson(\`/api/\${action}\`, {
    method: "POST",
    body: JSON.stringify({ target })
  });
  busy.delete(target);
  const row = targets?.find((entry) => entry.target === target);
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
    notify(action === "install" ? "Install failed" : "Uninstall failed", "error");
  render();
  emit("integrations");
};
var initIntegrations = () => {
  qs("integrations-refresh").addEventListener("click", (event) => {
    runRefresh(event.currentTarget, loadIntegrations);
  });
  qs("integrations-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-integration-action]");
    if (button)
      runAction(button);
  });
};

// src/gui/frontend/views/overview.ts
var OVERVIEW_DAYS = 7;
var feed = null;
var update = null;
var renderStatusCard = () => {
  const loaded = shared.policy;
  if (!loaded)
    return;
  const targets = integrationTargets();
  const active = (targets ?? []).filter((row) => row.status === "active");
  const policy = loaded.policy;
  const off = [
    policy.destructive_command_protection.enabled ? null : "Command protection is off",
    policy.secret_protection.enabled ? null : "Secret protection is off"
  ].filter((text) => text !== null);
  const headline = loaded.errors.length > 0 ? "Your policy file needs repair" : !targets ? "Checking your agents…" : active.length === 0 ? "Not checking any agent yet" : off.length > 0 ? "Partly protected" : "Protected";
  const customized = (loaded.preview?.counts.effectiveCustomizations ?? 0) > 0 || Object.entries(policy.safety.overrides).some(([key, value]) => value !== SAFETY_LEVEL_CAPABILITIES[policy.safety.level][key]);
  const level = policy.safety.level[0]?.toUpperCase() + policy.safety.level.slice(1);
  const facts = [
    \`\${level} preset\${customized ? ", customized" : ""}\`,
    ...off.length > 0 ? off : [
      loaded.preview ? \`\${loaded.preview.counts.enabled} command rules on\` : null,
      "Secret protection on"
    ],
    active.length > 0 ? \`Hook active in \${active.length <= 3 ? active.map((row) => row.label).join(", ") : plural(active.length, "agent")}\` : null
  ].filter((text) => text !== null);
  const [actionHref, actionLabel] = headline === "Not checking any agent yet" ? ["#integrations", "Install a hook"] : ["#policy", loaded.errors.length > 0 ? "Repair" : "Configure"];
  qs("status-card").innerHTML = \`<div>
      <p class="status-headline">\${escapeHtml(headline)}</p>
      <p class="status-facts">\${facts.map(escapeHtml).join(" · ")}</p>
    </div>
    <a class="link-button" href="\${actionHref}">\${actionLabel}</a>\`;
};
var renderAttention = () => {
  const items = attentionItems({
    targets: integrationTargets(),
    update,
    errors: feed?.counts.errors ?? 0,
    suspects: feed ? findSuspectEntries(feed.entries).size : 0,
    days: feed?.days ?? OVERVIEW_DAYS
  });
  qs("attention").hidden = items.length === 0;
  qs("attention-list").innerHTML = items.map((item) => \`<li><a class="list-row attention-row" href="\${escapeHtml(item.href)}"\${item.href.startsWith("#") ? "" : ' target="_blank" rel="noopener"'}><span>\${escapeHtml(item.text)}</span><span class="row-action">\${item.href.startsWith("#activity") ? "Review" : item.href.startsWith("#") ? "Fix" : "Release notes"}</span></a></li>\`).join("");
};
var sparkline = (byDay, noun) => {
  const max = Math.max(...byDay, 1);
  return \`<div class="tile-spark" role="img" aria-label="\${escapeHtml(\`\${noun} per day, oldest to newest: \${byDay.join(", ")}\`)}">\${byDay.map((count) => \`<span class="spark-bar\${count === 0 ? " spark-zero" : ""}" style="height:\${count === 0 ? 2 : Math.max(3, Math.round(count / max * 36))}px" title="\${formatCount(count)}"></span>\`).join("")}</div>\`;
};
var ruleHref = (ruleId) => ruleId.startsWith("custom.") ? \`#rules?focus=\${encodeURIComponent(ruleId)}\` : \`#activity?q=\${encodeURIComponent(ruleId)}\`;
var renderActivity = () => {
  if (!feed)
    return;
  const loaded = feed;
  qs("overview-tiles").innerHTML = [
    [loaded.counts.blocked, "Blocked", loaded.counts.blockedByDay],
    [loaded.totalInWindow, "Commands checked", loaded.counts.analyzedByDay]
  ].map(([value, label, byDay]) => \`<div class="tile"><div><strong>\${formatCount(value)}</strong><span>\${label} · last \${dayCount(loaded.days)}</span></div>\${sparkline(byDay, label)}</div>\`).join("");
  const blocks = loaded.entries.filter((entry) => entry.decision !== "allow").slice(0, 8);
  qs("recent-blocks").innerHTML = blocks.length === 0 ? \`<p class="empty">Nothing was blocked in the last \${dayCount(loaded.days)}.</p>\` : \`<ul class="card list">\${blocks.map((entry) => \`<li><a class="list-row compact-row" href="\${entry.ruleId ? ruleHref(entry.ruleId) : "#activity"}">
              <time datetime="\${escapeHtml(entry.ts)}">\${escapeHtml(formatRelativeTime(entry.ts))}</time>
              <span class="feed-agent">\${escapeHtml(entry.agent && entry.agent !== "unknown" ? agentLabels[entry.agent] ?? entry.agent : "")}</span>
              <code class="feed-command">\${escapeHtml(entry.segment || entry.command || "(no command recorded)")}</code>
              <span class="feed-rule">\${escapeHtml(entry.failureStage ? "guard error" : entry.ruleId ?? "")}</span>
            </a></li>\`).join("")}</ul>\`;
  const top = Object.entries(loaded.counts.rules).sort((a, b) => b[1] - a[1]).slice(0, 5);
  qs("top-rules-title").textContent = \`Most-triggered rules · last \${dayCount(loaded.days)}\`;
  qs("top-rules").innerHTML = top.length === 0 ? '<p class="empty">No rule has blocked anything yet.</p>' : \`<ul class="card list">\${top.map(([ruleId, count]) => \`<li><a class="list-row rule-count-row" href="\${ruleHref(ruleId)}">
              <code class="rule-label">\${escapeHtml(ruleId)}</code>
              <span class="count">\${plural(count, "block")}</span>
            </a></li>\`).join("")}</ul>\`;
};
var loadOverview = async () => {
  const result = await requestJson(\`/api/activity?days=\${Math.min(OVERVIEW_DAYS, retentionDays())}\`);
  if (!result.ok || !result.data) {
    qs("recent-blocks").innerHTML = \`<p class="empty">Could not load activity: \${escapeHtml(errorText(result))}</p>\`;
    return;
  }
  feed = result.data;
  renderActivity();
  renderAttention();
};
var loadHealth = async () => {
  const result = await requestJson("/api/health");
  update = result.ok ? result.data?.update ?? null : null;
  renderAttention();
};
var starIcons = {
  outline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path></svg>',
  filled: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"></path></svg>'
};
var starContext = { starCount: null, blockedTotal: 0 };
var starCountHtml = (count) => typeof count === "number" ? \`<span class="star-count">\${count >= 1000 ? \`\${(count / 1000).toFixed(1).replace(/\\.0$/, "")}k\` : count}</span>\` : "";
var renderStarPitch = (starred) => {
  const evidence = starContext.blockedTotal > 0 ? \`CC Safety Net has blocked <strong>\${formatCount(starContext.blockedTotal)}</strong> risky \${starContext.blockedTotal === 1 ? "command" : "commands"} on this machine in the last \${escapeHtml(dayCount(retentionDays()))}.\` : "";
  qs("star-pitch-text").innerHTML = starred ? evidence : evidence ? \`\${evidence} If it saved your work, star it on GitHub.\` : "If CC Safety Net is useful to you, star it on GitHub.";
};
var renderStarLink = (href) => {
  qs("star-slot").innerHTML = \`<a class="star-cta" href="\${escapeHtml(href)}" target="_blank" rel="noopener" aria-label="Star CC Safety Net on GitHub (opens github.com)"><span class="star-icon" aria-hidden="true">\${starIcons.outline}</span><span class="star-label">Star on GitHub</span>\${starCountHtml(starContext.starCount)}</a>\`;
  qs("star-row").hidden = false;
};
var loadStarContext = async () => {
  const result = await requestJson("/api/star/context");
  starContext = result.ok && result.data ? result.data : { starCount: null, blockedTotal: 0 };
  renderStarPitch(false);
  qs("star-slot").innerHTML = \`<button type="button" class="star-cta" aria-label="Star CC Safety Net on GitHub"><span class="star-icon" aria-hidden="true">\${starIcons.outline}</span><span class="star-label">Star on GitHub</span>\${starCountHtml(starContext.starCount)}</button>\`;
  qs("star-row").hidden = false;
};
var starRepo = async (button) => {
  button.disabled = true;
  const result = await requestJson("/api/star", { method: "POST" });
  if (!(result.ok && result.data?.ok === true)) {
    renderStarLink(result.data?.fallbackUrl ?? repoUrl);
    return;
  }
  button.querySelector(".star-icon").innerHTML = starIcons.filled;
  button.querySelector(".star-label").textContent = "Starred. Thank you.";
  button.setAttribute("aria-label", "CC Safety Net starred on GitHub");
  button.classList.add("starred");
  renderStarPitch(true);
};
var initOverview = () => {
  on("policy", renderStatusCard);
  on("integrations", () => {
    renderStatusCard();
    renderAttention();
  });
  qs("star-slot").addEventListener("click", (event) => {
    const button = event.target.closest(".star-cta");
    if (button instanceof HTMLButtonElement)
      starRepo(button);
  });
};

// src/gui/frontend/views/activity.ts
var filters = initialActivityFilters();
var activity = null;
var suspects = new Set;
var renderedEntries = [];
var queryTimer;
var syncHash = () => {
  if (document.body.dataset.view === "activity")
    history.replaceState(null, "", \`#\${activityHash(filters)}\`);
};
var retentionDays = () => shared.policy?.policy.audit.retention_days ?? DEFAULT_AUDIT_RETENTION_DAYS;
var knownRuleIds = () => new Set([
  ...shared.policy?.destructiveCommandRules ?? [],
  ...shared.policy?.secretPatterns ?? []
].map((rule) => rule.id));
var decisionLabel = (entry) => entry.failureStage ? "Error" : entry.decision === "allow" ? "Allowed" : "Blocked";
var timeLabel = (ts) => new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
var dayLabel = (ts) => {
  const date = new Date(ts).toDateString();
  if (date === new Date().toDateString())
    return "Today";
  if (date === new Date(Date.now() - 86400000).toDateString())
    return "Yesterday";
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
};
var ruleLink = (ruleId) => ruleId.startsWith("custom.") ? \`<a class="rule-id" href="#rules?focus=\${encodeURIComponent(ruleId)}" title="Show this custom rule">\${escapeHtml(ruleId)}</a>\` : knownRuleIds().has(ruleId) ? \`<a class="rule-id" href="#policy?q=\${encodeURIComponent(ruleId)}" title="Show this protection">\${escapeHtml(ruleId)}</a>\` : \`<code class="rule-id">\${escapeHtml(ruleId)}</code>\`;
var entryCommand = (entry) => entry.segment || entry.command || "";
var feedRowHtml = (entry, index) => {
  const blocked = entry.decision !== "allow";
  const command = entryCommand(entry);
  const agent = entry.agent && entry.agent !== "unknown" ? agentLabels[entry.agent] ?? entry.agent : "";
  const detailRows = [
    entry.command && entry.command !== command ? ["Full command", \`<code class="block">\${escapeHtml(entry.command)}</code>\`] : null,
    entry.reason && entry.reason !== "allowed" ? ["Reason", escapeHtml(entry.reason)] : null,
    entry.ruleId ? ["Rule", ruleLink(entry.ruleId)] : null,
    entry.cwd ? ["Folder", \`<code>\${escapeHtml(entry.cwd)}</code>\`] : null,
    [
      "Time",
      \`\${escapeHtml(new Date(entry.ts).toLocaleString("en-US"))} (\${formatRelativeTime(entry.ts)})\`
    ]
  ].filter((row) => row !== null);
  return \`<li class="feed-row">
    <button type="button" class="feed-summary" aria-expanded="false" aria-controls="feed-detail-\${index}">
      <span class="chevron" aria-hidden="true"></span>
      <time datetime="\${escapeHtml(entry.ts)}">\${escapeHtml(timeLabel(entry.ts))}</time>
      <span class="decision \${entry.failureStage ? "error" : blocked ? "deny" : "allow"}">\${decisionLabel(entry)}</span>
      <span class="feed-agent">\${escapeHtml(agent)}</span>
      <code class="feed-command">\${escapeHtml(command || "(no command recorded)")}</code>
      <span class="feed-rule">\${escapeHtml(entry.ruleId ?? "")}</span>
    </button>
    <div class="feed-detail" id="feed-detail-\${index}" hidden>
      <code class="block detail-command">\${escapeHtml(command || "(no command recorded)")}</code>
      <div class="detail-actions">
        \${blocked ? \`<button type="button" class="primary" data-report-fp="\${index}">Report false positive</button>\` : \`<button type="button" class="primary" data-block-future="\${index}">Block this in future</button>\`}
        <button type="button" data-log-copy="\${index}">\${icons.copy}<span>Copy log entry</span></button>
      </div>
      <dl class="detail-rows">\${detailRows.map(([term, value]) => \`<div><dt>\${term}</dt><dd>\${value}</dd></div>\`).join("")}</dl>
    </div>
  </li>\`;
};
var renderControls = () => {
  if (!activity)
    return;
  const loaded = activity;
  const segment = (value, label, count) => \`<button type="button" data-activity-decision="\${value}" aria-pressed="\${filters.decision === value}">\${label} <span class="count">\${formatCount(count)}</span></button>\`;
  qs("activity-decision").innerHTML = [
    segment("deny", "Blocked", loaded.counts.blocked),
    segment("allow", "Allowed", loaded.counts.allowed),
    ...loaded.counts.errors > 0 ? [segment("error", "Errors", loaded.counts.errors)] : [],
    ...suspects.size > 0 ? [segment("suspect", "Likely false positive", suspects.size)] : [],
    segment("all", "All", loaded.totalInWindow)
  ].join("");
  const agentNames = Object.keys(loaded.counts.agents).filter((name) => name !== "unknown").sort();
  qs("activity-agent").innerHTML = [
    '<option value="all">All agents</option>',
    ...agentNames.map((name) => \`<option value="\${escapeHtml(name)}">\${escapeHtml(agentLabels[name] ?? name)} (\${formatCount(loaded.counts.agents[name] ?? 0)})</option>\`)
  ].join("");
  qs("activity-agent").value = filters.agent;
  qs("activity-agent").parentElement?.toggleAttribute("hidden", agentNames.length < 2);
  const retained = retentionDays();
  qs("activity-days").innerHTML = [
    ...new Set([...[7, 30, 90, 180, 365].filter((days) => days < retained), retained, loaded.days])
  ].sort((left, right) => left - right).map((days) => \`<option value="\${days}">Last \${dayCount(days)}</option>\`).join("");
  qs("activity-days").value = String(loaded.days);
  qs("activity-command-filter").hidden = !filters.command;
  qs("activity-command-filter").innerHTML = filters.command ? \`Showing blocks of <code>\${escapeHtml(filters.command)}</code> <button type="button" class="quiet" data-clear-command>Show all blocks</button>\` : "";
};
var emptyMessage = () => {
  if (filters.query || filters.command || filters.agent !== "all")
    return "Nothing matches these filters.";
  if (filters.decision === "deny")
    return \`Nothing was blocked in the last \${dayCount(activity?.days ?? filters.days)}. <button type="button" class="quiet" data-activity-decision="all">Show all activity</button>\`;
  return "No audit log entries match.";
};
var renderFeed = () => {
  if (!activity)
    return;
  const entries = visibleEntries(activity.entries, filters, suspects);
  renderedEntries = entries;
  qs("activity-feed").innerHTML = entries.length === 0 ? \`<p class="empty">\${emptyMessage()}</p>\` : entries.map((entry, index) => {
    const label = dayLabel(entry.ts);
    const previous = entries[index - 1];
    const heading = previous && dayLabel(previous.ts) === label ? "" : \`\${index === 0 ? "" : "</ul>"}<h4 class="day-heading">\${escapeHtml(label)}</h4><ul class="feed-list">\`;
    return heading + feedRowHtml(entry, index);
  }).join("") + "</ul>";
  qs("activity-count").textContent = [
    \`Showing \${formatCount(entries.length)} of \${plural(activity.totalInWindow, "entry", "entries")} from the last \${dayCount(activity.days)}.\`,
    activity.truncated ? "Only the newest 500 entries of each decision are loaded; narrow the time window to see older ones." : "",
    activity.unreadable > 0 ? \`\${plural(activity.unreadable, "log file")} could not be read, so this list is incomplete.\` : ""
  ].filter(Boolean).join(" ");
};
var loadActivity = async () => {
  const result = await requestJson(\`/api/activity?days=\${filters.days}\`);
  if (!result.ok || !result.data) {
    qs("activity-feed").innerHTML = \`<p class="empty">Could not load activity: \${escapeHtml(errorText(result))}</p>\`;
    qs("activity-count").textContent = "";
    return;
  }
  activity = result.data;
  suspects = findSuspectEntries(activity.entries);
  showPath("logs-path", activity.logsDir ?? "", activity.logsDir ? "" : "Not available");
  if (filters.agent !== "all" && !(filters.agent in activity.counts.agents))
    filters.agent = "all";
  if (filters.decision === "error" && activity.counts.errors === 0)
    filters.decision = "deny";
  if (filters.decision === "suspect" && suspects.size === 0)
    filters.decision = "deny";
  renderControls();
  renderFeed();
  syncHash();
};
var limitActivityDays = (days) => {
  filters.days = Math.min(filters.days, days);
};
var rerender = () => {
  renderControls();
  renderFeed();
  syncHash();
};
var showActivity = (params) => {
  const next = activityFiltersFromParams(params);
  if (shared.policy)
    next.days = Math.min(next.days, retentionDays());
  if (activityHash(next) === activityHash(filters))
    return;
  const reload = next.days !== filters.days;
  Object.assign(filters, next);
  qs("activity-search").value = filters.query;
  if (reload && activity) {
    loadActivity();
    return;
  }
  rerender();
};
var openReportDialog = (entry) => {
  const scrub = (text) => scrubReportPaths(text, entry.cwd, activity?.homeDir);
  qs("report-command").value = scrub(entry.command || entry.segment || "");
  qs("report-title").value = reportTitle(entry.ruleId, scrub(entry.segment || entry.command || ""));
  qs("report-why").value = "";
  qs("report-entry").value = JSON.stringify(entry, (_key, value) => typeof value === "string" ? scrub(value) : value, 2);
  qs("report-dialog").returnValue = "cancel";
  qs("report-dialog").showModal();
};
var openFalsePositiveForm = async () => {
  const fields = {
    title: qs("report-title").value,
    expected: qs("report-why").value.trim(),
    command: qs("report-command").value,
    entry: qs("report-entry").value
  };
  const request = buildReportRequest(fields);
  const copying = request.dropped.length ? navigator.clipboard.writeText(request.dropped.map((field) => \`### \${field}
\${fields[field]}\`).join(\`

\`)).then(() => true, () => false) : null;
  window.open(request.url, "_blank", "noopener");
  if (!copying)
    return;
  const names = request.dropped.join(" and ");
  notify("Report too long to prefill", "error", await copying ? \`The \${names} was copied to your clipboard. Paste it into the form on GitHub.\` : \`The \${names} was left out. Copy the log entry from Activity and paste it into the form on GitHub.\`);
};
var initActivity = () => {
  on("policy", () => {
    if (activity)
      rerender();
  });
  qs("activity-search").addEventListener("input", (event) => {
    filters.query = event.target.value;
    if (filters.command) {
      filters.command = "";
      renderControls();
    }
    clearTimeout(queryTimer);
    queryTimer = setTimeout(() => {
      renderFeed();
      syncHash();
    }, 120);
  });
  qs("activity-agent").addEventListener("change", (event) => {
    filters.agent = event.target.value;
    renderFeed();
    syncHash();
  });
  qs("activity-days").addEventListener("change", (event) => {
    filters.days = Number(event.target.value);
    loadActivity();
  });
  qs("activity-refresh").addEventListener("click", (event) => {
    runRefresh(event.currentTarget, () => Promise.all([loadOverview(), loadActivity()]));
  });
  qs("report-dialog").addEventListener("close", () => {
    if (qs("report-dialog").returnValue === "report")
      openFalsePositiveForm();
  });
  qs("activity-command-filter").addEventListener("click", (event) => {
    if (!event.target.closest("[data-clear-command]"))
      return;
    filters.command = "";
    rerender();
  });
  qs("activity-decision").addEventListener("click", (event) => {
    const button = event.target.closest("[data-activity-decision]");
    if (!button)
      return;
    filters.decision = button.dataset.activityDecision;
    filters.command = "";
    rerender();
  });
  qs("activity-feed").addEventListener("click", (event) => {
    const target = event.target;
    const showAll = target.closest("[data-activity-decision]");
    if (showAll) {
      filters.decision = showAll.dataset.activityDecision;
      rerender();
      return;
    }
    const summary = target.closest(".feed-summary");
    if (summary) {
      const expanded = summary.getAttribute("aria-expanded") !== "true";
      summary.setAttribute("aria-expanded", String(expanded));
      const detail = qs(summary.getAttribute("aria-controls") ?? "");
      const summaryCommand = summary.querySelector(".feed-command");
      detail.querySelector(".detail-command").hidden = !summaryCommand.textContent?.includes(\`
\`) && summaryCommand.scrollWidth <= summaryCommand.clientWidth;
      detail.hidden = !expanded;
      return;
    }
    const copy = target.closest("[data-log-copy]");
    const copyEntry = renderedEntries[Number(copy?.dataset.logCopy)];
    if (copy && copyEntry) {
      copyText(copy, JSON.stringify(copyEntry, null, 2));
      return;
    }
    const report = renderedEntries[Number(target.closest("[data-report-fp]")?.dataset.reportFp)];
    if (report) {
      openReportDialog(report);
      return;
    }
    const block = renderedEntries[Number(target.closest("[data-block-future]")?.dataset.blockFuture)];
    if (block)
      location.hash = \`rules?compose=\${encodeURIComponent(entryCommand(block))}\`;
  });
};

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

// src/gui/frontend/policy-summary.ts
var safetyLevels = {
  standard: [
    "Standard",
    "Blocks recognizable destructive commands and reading sensitive files. Recommended for normal coding."
  ],
  strict: [
    "Strict",
    "Also blocks commands it cannot fully parse and listing sensitive paths. Occasional false positives on advanced shell."
  ],
  paranoid: [
    "Paranoid",
    "Also blocks rm -rf inside your project and interpreter one-liners. Expect friction; for untrusted agents or high-stakes repos."
  ]
};
var capabilityNames = {
  fail_closed: ["Fail closed", "Block commands the parser cannot fully understand."],
  paranoid_rm: ["Paranoid rm -rf checks", "Block rm -rf inside the project, except temp paths."],
  paranoid_interpreters: [
    "Paranoid interpreters",
    "Block interpreter one-liners such as python -c."
  ]
};
var levelName = (level) => safetyLevels[level][0];
var tierForRule = (rule) => !rule.activationCapability ? "normal" : rule.activationCapability === "fail_closed" ? "strict" : "paranoid";
var commandRuleGroups = (rules) => {
  const alwaysOn = rules.filter((rule) => rule.catastrophic);
  const configurable = rules.filter((rule) => !rule.catastrophic);
  return [
    ...alwaysOn.length > 0 ? [{ key: "always-on", title: "Always on", rules: alwaysOn }] : [],
    ...[...new Set(configurable.map((rule) => rule.category))].map((category) => ({
      key: category,
      title: category,
      rules: configurable.filter((rule) => rule.category === category)
    }))
  ];
};
var policyFiltersFromParams = (params) => ({
  query: params.get("q") ?? "",
  changedOnly: params.get("show") === "changed"
});
var policyHash = (filters) => viewHash("policy", [
  ["q", filters.query, ""],
  ["show", filters.changedOnly ? "changed" : "all", "all"]
]);
var ruleNote = (rule, effective, capabilities) => {
  const capability = rule.activationCapability;
  if (effective.source === "rule_override")
    return "Changed by you";
  if (effective.source === "capability_override" && capability)
    return \`\${capabilityNames[capability][0]} forced \${effective.enabled ? "on" : "off"} in Advanced\`;
  if (effective.source === "environment") {
    const source = [...capability ? capabilities[capability]?.sources ?? [] : []].reverse().find((item) => item.startsWith("env "));
    return source ? \`Set by environment: \${source.slice(4)}\` : "Set by environment";
  }
  if (effective.enabled || effective.source === "master_disabled")
    return null;
  return \`Needs the \${tierForRule(rule) === "strict" ? "Strict" : "Paranoid"} preset\`;
};
var policyChanges = (saved, draft, labels) => {
  const onOff = (value) => value ? "on" : "off";
  const overrideChanges = (before, after) => [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((id) => before[id] !== after[id]).map((id) => \`\${labels[id] ?? id}: \${after[id] ?? "default"}\`);
  const pathChanges = (name, before, after) => {
    const added = after.filter((path) => !before.includes(path)).length;
    const removed = before.filter((path) => !after.includes(path)).length;
    if (added === 0 && removed === 0)
      return null;
    return \`\${name}: \${[added ? \`\${added} added\` : "", removed ? \`\${removed} removed\` : ""].filter(Boolean).join(", ")}\`;
  };
  return [
    saved.safety.level === draft.safety.level ? null : \`Preset: \${levelName(saved.safety.level)} → \${levelName(draft.safety.level)}\`,
    ...Object.keys(capabilityNames).filter((key) => saved.safety.overrides[key] !== draft.safety.overrides[key]).map((key) => {
      const value = draft.safety.overrides[key];
      return \`\${capabilityNames[key][0]}: \${value === undefined ? "from preset" : value ? "forced on" : "forced off"}\`;
    }),
    saved.workflow.worktree_mode === draft.workflow.worktree_mode ? null : \`Discarding changes in linked worktrees: \${draft.workflow.worktree_mode ? "allowed" : "blocked"}\`,
    saved.destructive_command_protection.enabled === draft.destructive_command_protection.enabled ? null : \`Command protection: \${onOff(draft.destructive_command_protection.enabled)}\`,
    saved.secret_protection.enabled === draft.secret_protection.enabled ? null : \`Secret protection: \${onOff(draft.secret_protection.enabled)}\`,
    ...overrideChanges(saved.destructive_command_protection.overrides, draft.destructive_command_protection.overrides),
    ...overrideChanges(saved.secret_protection.overrides, draft.secret_protection.overrides),
    pathChanges("Allowed delete paths", saved.destructive_command_protection.allow_paths, draft.destructive_command_protection.allow_paths),
    pathChanges("Always-blocked paths", saved.secret_protection.deny_paths, draft.secret_protection.deny_paths),
    pathChanges("Secret pattern exemptions", saved.secret_protection.allow_paths, draft.secret_protection.allow_paths)
  ].filter((change) => change !== null);
};

// src/gui/frontend/shortcuts.ts
var textEntryTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);
var isSearchShortcut = (event, target) => event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !textEntryTags.has(target.tagName) && !target.isContentEditable;

// src/gui/frontend/views/policy.ts
var secretCategoryNames = {
  Basename: "Sensitive file names",
  Pattern: "Sensitive file name patterns",
  "Home path": "Sensitive home folders",
  Variant: "Key file name variants",
  Extension: "Sensitive file extensions",
  "Extension pattern": "Sensitive extension patterns",
  "Coding CLI credential": "Coding agent credentials",
  "Coding CLI config": "Coding agent settings"
};
var state;
var draftPolicy;
var preview = null;
var previewRequestId = 0;
var testerRequestId = 0;
var projectDraft = null;
var markedFields = new Set;
var busy2 = false;
var showChangedOnly = false;
var groupExpanded = new Map;
var searchQuery = () => qs("policy-search").value.trim().toLowerCase();
var filtering = () => searchQuery() !== "" || showChangedOnly;
var currentFilters = () => ({
  query: qs("policy-search").value,
  changedOnly: showChangedOnly
});
var syncHash2 = () => {
  if (document.body.dataset.view === "policy")
    history.replaceState(null, "", \`#\${policyHash(currentFilters())}\`);
};
var setChangedOnly = (changedOnly) => {
  showChangedOnly = changedOnly;
  document.querySelectorAll("[data-policy-show]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.getAttribute("data-policy-show") === "changed" === changedOnly));
  });
};
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
var effectivePreviewPolicy = (policy) => {
  const baseline = projectDraft?.baseline;
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
var requestPolicyPreview = (policy) => requestJson("/api/policy/preview", { method: "POST", body: JSON.stringify(policy) });
var projectFieldChip = (field) => {
  if (!projectDraft)
    return "";
  if (!markedFields.has(field))
    return '<span class="project-chip inherited">Inherited</span>';
  return \`<button type="button" class="project-chip" data-unmark-field="\${escapeHtml(field)}" title="Set by this project. Click to stop setting it." aria-label="Set by project: \${escapeHtml(field)}. Activate to inherit again.">Project</button>\`;
};
var projectChipSlots = [
  ["destructive-enabled-chip", "destructive_command_protection.enabled"],
  ["secret-enabled-chip", "secret_protection.enabled"],
  ["allow-paths-chip", "destructive_command_protection.allow_paths"],
  ["deny-paths-chip", "secret_protection.deny_paths"],
  ["secret-allow-paths-chip", "secret_protection.allow_paths"],
  ["safety-level-chip", "safety.level"]
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
  syncProjectChips();
};
var unmarkProjectField = (field) => {
  if (!projectDraft || !markedFields.has(field))
    return;
  markedFields.delete(field);
  draftPolicy = overlayProjectProposal(projectDraft.baseline, collectProjectProposal(markedFields, draftPolicy));
  renderPolicySections();
  refreshPolicyPreview();
};
var markProjectOverride = (section, ruleId) => {
  if (projectDraft)
    markedFields.add(\`\${section}.overrides.\${ruleId}\`);
};
var ruleLabels = () => Object.fromEntries([...state?.destructiveCommandRules ?? [], ...state?.secretPatterns ?? []].map((rule) => [
  rule.id,
  rule.label
]));
var setBanner = () => {
  const saved = state;
  const notices = [
    saved && !saved.policy.destructive_command_protection.enabled ? "Command protection is off: built-in destructive command rules are not enforced. Catastrophic and custom rules still apply." : null,
    saved && !saved.policy.secret_protection.enabled ? "Secret protection is off: sensitive files and deny paths are not blocked." : null,
    saved?.configState && saved.configState.state !== "ready" ? \`A fallback configuration is being enforced: \${saved.configState.reason}\` : null
  ].filter((notice) => notice !== null);
  qs("protection-banner").innerHTML = notices.map((notice) => \`<p>\${escapeHtml(notice)}</p>\`).concat(notices.length > 0 && !location.hash.startsWith("#policy") ? ['<a href="#policy">Open Protections</a>'] : []).join("");
  qs("protection-banner").hidden = notices.length === 0;
};
var savedComparisonPolicy = () => projectDraft ? overlayProjectProposal(projectDraft.baseline, JSON.parse(projectDraft.snapshot)) : state?.policy;
var renderSavebar = () => {
  qs("policy-savebar").hidden = !shared.dirty;
  qs("save").textContent = projectDraft ? "Review and apply" : "Save";
  if (!shared.dirty || !state)
    return;
  const changes = policyChanges(savedComparisonPolicy(), draftPolicy, ruleLabels());
  qs("savebar-title").textContent = changes.length === 0 ? "Unsaved changes" : plural(changes.length, "unsaved change");
  qs("savebar-summary").textContent = changes.slice(0, 3).join("; ") + (changes.length > 3 ? \`; and \${changes.length - 3} more\` : "");
};
var syncRawFromForm = () => {
  if (state?.errors.length)
    return;
  qs("raw").value = \`\${JSON.stringify(projectDraft ? collectProjectProposal(markedFields, draftPolicy) : collectFormPolicy(), null, 2)}
\`;
  qs("raw-source").textContent = projectDraft ? \`Only the fields set by this project. Written to \${projectDraft.path}.\` : "Read-only. Mirrors the settings above.";
};
var updateDirtyStatus = () => {
  if (!state || state.errors.length)
    return;
  const wasDirty = shared.dirty;
  if (projectDraft) {
    shared.dirty = JSON.stringify(collectProjectProposal(markedFields, draftPolicy)) !== projectDraft.snapshot;
  }
  if (!projectDraft) {
    const draftJson = JSON.stringify(collectFormPolicy());
    shared.dirty = draftJson !== JSON.stringify(state.policy);
    if (shared.dirty)
      sessionStorage.setItem("cc-safety-net-draft", draftJson);
    if (!shared.dirty)
      sessionStorage.removeItem("cc-safety-net-draft");
  }
  renderSavebar();
  updateActions();
  if (wasDirty !== shared.dirty)
    emit("dirty");
};
var afterEdit = (refreshPreview = true) => {
  syncRawFromForm();
  updateDirtyStatus();
  if (refreshPreview)
    refreshPolicyPreview();
};
var updateActions = () => {
  const hasErrors = (state?.errors.length ?? 0) > 0;
  qs("save").disabled = busy2 || !state || hasErrors;
  qs("repair").disabled = busy2 || !hasErrors;
  qs("reset").disabled = busy2;
  qs("retention-days").disabled = busy2;
};
var runExclusive = async (pendingText, fn) => {
  if (busy2)
    return;
  busy2 = true;
  updateActions();
  notify(pendingText);
  await fn().finally(() => {
    busy2 = false;
    updateActions();
  });
};
var groupRules = (rules) => [...new Set(rules.map((rule) => rule.category))].map((category) => ({
  category,
  rules: rules.filter((rule) => rule.category === category)
}));
var matches = (query, fields) => fields.join(" ").toLowerCase().includes(query);
var secretRuleIsActive = (rule, overrides) => overrides[rule.id] ? overrides[rule.id] === "on" : !rule.defaultOff;
var destructiveChanged = (rule) => draftPolicy.destructive_command_protection.overrides[rule.id] !== undefined || ["rule_override", "capability_override", "environment"].includes(preview?.rules[rule.id]?.source ?? "");
var secretChanged = (rule) => draftPolicy.secret_protection.overrides[rule.id] !== undefined;
var categoryHtml = (options) => {
  const expanded = groupExpanded.get(options.key) ?? filtering();
  const contentId = \`group-\${options.key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}\`;
  return \`<section class="rule-group">
    <div class="rule-group-head">
      <button type="button" class="group-toggle" data-group-toggle="\${escapeHtml(options.key)}" aria-expanded="\${expanded}" aria-controls="\${contentId}">
        <span class="chevron" aria-hidden="true"></span>
        <span class="group-title">\${escapeHtml(options.title)}</span>
        <span class="group-counts">\${options.counts}</span>
      </button>
      \${options.bulkSwitch}
    </div>
    <ul class="rule-list" id="\${contentId}" \${expanded ? "" : "hidden"}>\${options.rowsHtml}</ul>
  </section>\`;
};
var ruleRowHtml = (row) => \`<li class="rule-row\${row.disabled ? " row-disabled" : ""}" data-rule-row="\${escapeHtml(row.id)}">
    \${row.control}
    <div class="rule-body">
      <div class="rule-line">\${row.heading}\${row.note ? \`<span class="rule-note \${row.noteTone}">\${escapeHtml(row.note)}</span>\` : ""}\${row.actions}</div>
      \${row.description ? \`<p class="rule-description">\${escapeHtml(row.description)}</p>\` : ""}
    </div>
    \${row.info}
  </li>\`;
var offCount = (off) => off > 0 ? \` · <span class="off-count">\${off} off</span>\` : "";
var renderDestructiveCommands = () => {
  if (!state || !preview)
    return;
  const effectiveState = preview;
  const query = searchQuery();
  const disabled = !draftPolicy.destructive_command_protection.enabled;
  const catastrophicCount = state.destructiveCommandRules.filter((rule) => rule.catastrophic).length;
  qs("destructive-command-summary").textContent = disabled ? "Off. Built-in rules are not enforced; catastrophic and custom rules still apply. Your rule settings are kept." : \`\${preview.counts.enabled} on · \${preview.counts.disabled} off · \${catastrophicCount} always on\`;
  qs("destructive-panel").classList.toggle("is-off", disabled);
  const visible = state.destructiveCommandRules.filter((rule) => matches(query, [rule.category, rule.label, rule.id, rule.description]) && (!showChangedOnly || destructiveChanged(rule)));
  const rowHtml = (rule) => {
    const info = \`<button type="button" class="info-button" data-rule-example="\${escapeHtml(rule.id)}" aria-label="\${escapeHtml(\`About \${rule.label}\`)}" aria-haspopup="dialog" aria-controls="rule-example-popover">\${icons.info}</button>\`;
    const heading = \`<span class="rule-name">\${escapeHtml(rule.label)}</span><code class="rule-id">\${escapeHtml(rule.id)}</code>\${tierForRule(rule) === "normal" ? "" : \`<span class="tier-badge \${tierForRule(rule)}">\${tierForRule(rule) === "strict" ? "Strict" : "Paranoid"}</span>\`}\`;
    if (rule.catastrophic)
      return ruleRowHtml({
        id: rule.id,
        control: \`<span class="lock" title="Always on">\${icons.lock}</span>\`,
        heading,
        note: null,
        noteTone: "",
        actions: "",
        description: rule.description,
        info,
        disabled: false
      });
    const effective = effectiveState.rules[rule.id];
    if (!effective)
      return "";
    const override = draftPolicy.destructive_command_protection.overrides[rule.id] !== undefined;
    return ruleRowHtml({
      id: rule.id,
      control: \`<input type="checkbox" class="switch" data-destructive-command-active="\${escapeHtml(rule.id)}" \${effective.enabled ? "checked" : ""} \${disabled ? "disabled" : ""} aria-label="\${escapeHtml(rule.label)}">\`,
      heading,
      note: ruleNote(rule, effective, effectiveState.capabilities),
      noteTone: effective.source === "rule_override" ? "changed" : effective.source === "capability_override" || effective.source === "environment" ? "" : tierForRule(rule),
      actions: \`\${override ? \`<button type="button" class="quiet small" data-use-inherited="\${escapeHtml(rule.id)}">Reset</button>\` : ""}\${projectFieldChip(\`destructive_command_protection.overrides.\${rule.id}\`)}\`,
      description: rule.description,
      info,
      disabled
    });
  };
  qs("destructive-command-rules").innerHTML = visible.length === 0 ? '<p class="empty">No command protections match.</p>' : commandRuleGroups(visible).map((group) => {
    const all = commandRuleGroups(state?.destructiveCommandRules ?? []).find((entry) => entry.key === group.key)?.rules ?? [];
    const off = all.filter((rule) => effectiveState.rules[rule.id]?.enabled === false).length;
    return categoryHtml({
      key: \`destructive:\${group.key}\`,
      title: group.title,
      counts: group.key === "always-on" ? \`\${plural(all.length, "rule")} · can't be turned off\` : \`\${plural(all.length, "rule")}\${offCount(off)}\`,
      bulkSwitch: "",
      rowsHtml: group.rules.map(rowHtml).join("")
    });
  }).join("");
};
var renderSecretPatterns = () => {
  if (!state)
    return;
  const loaded = state;
  const query = searchQuery();
  const overrides = draftPolicy.secret_protection.overrides;
  const disabled = !draftPolicy.secret_protection.enabled;
  const offTotal = loaded.secretPatterns.filter((rule) => !secretRuleIsActive(rule, overrides)).length;
  qs("secret-summary").textContent = disabled ? "Off. Sensitive files and deny paths are not blocked. Your rule settings and paths are kept." : \`\${loaded.secretPatterns.length - offTotal} on · \${offTotal} off\`;
  qs("secret-panel").classList.toggle("is-off", disabled);
  const visible = loaded.secretPatterns.filter((rule) => matches(query, [
    rule.category,
    secretCategoryNames[rule.category],
    rule.label,
    rule.id,
    rule.description,
    ...rule.paths ?? []
  ]) && (!showChangedOnly || secretChanged(rule)));
  const rowHtml = (rule) => {
    const active = secretRuleIsActive(rule, overrides);
    const override = overrides[rule.id] !== undefined;
    return ruleRowHtml({
      id: rule.id,
      control: \`<input type="checkbox" class="switch" data-secret-active="\${escapeHtml(rule.id)}" \${active ? "checked" : ""} \${disabled ? "disabled" : ""} aria-label="\${escapeHtml(rule.label)}">\`,
      heading: \`<span class="rule-name">\${escapeHtml(rule.label)}</span>\`,
      note: override ? "Changed by you" : rule.defaultOff ? "Off by default" : null,
      noteTone: override ? "changed" : "",
      actions: \`\${override ? \`<button type="button" class="quiet small" data-secret-reset="\${escapeHtml(rule.id)}">Reset</button>\` : ""}\${projectFieldChip(\`secret_protection.overrides.\${rule.id}\`)}\`,
      description: rule.description ?? (rule.paths ? plural(rule.paths.length, "path") : ""),
      info: rule.paths ? \`<button type="button" class="info-button" data-secret-paths="\${escapeHtml(rule.id)}" aria-label="\${escapeHtml(\`Protected paths for \${rule.label}\`)}" aria-haspopup="dialog" aria-controls="rule-example-popover">\${icons.info}</button>\` : '<span class="info-spacer"></span>',
      disabled
    });
  };
  qs("secret-patterns").innerHTML = visible.length === 0 ? '<p class="empty">No secret protections match.</p>' : groupRules(visible).map((group) => {
    const all = loaded.secretPatterns.filter((rule) => rule.category === group.category);
    const on = all.filter((rule) => secretRuleIsActive(rule, overrides)).length;
    const title = secretCategoryNames[group.category] ?? group.category;
    return categoryHtml({
      key: \`secret:\${group.category}\`,
      title,
      counts: \`\${plural(all.length, "rule")}\${offCount(on === 0 ? 0 : all.length - on)}\`,
      bulkSwitch: \`<input type="checkbox" class="switch" data-secret-group-active="\${escapeHtml(group.category)}" \${on > 0 ? "checked" : ""} \${disabled ? "disabled" : ""} aria-label="\${escapeHtml(\`Turn all \${title} on or off\`)}" title="Turn all on or off">\`,
      rowsHtml: group.rules.map(rowHtml).join("")
    });
  }).join("");
};
var renderChangedCount = () => {
  if (!state)
    return;
  const changed = state.destructiveCommandRules.filter((rule) => !rule.catastrophic && destructiveChanged(rule)).length + state.secretPatterns.filter(secretChanged).length;
  qs("changed-count").textContent = changed > 0 ? String(changed) : "";
};
var renderRules = () => {
  renderDestructiveCommands();
  renderSecretPatterns();
  renderChangedCount();
};
var renderSafety = () => {
  const environmentSources = preview ? [
    ...new Set(Object.values(preview.capabilities).filter((capability) => capability.source === "environment").flatMap((capability) => capability.sources.filter((source) => source.startsWith("env "))))
  ] : [];
  qs("environment-overrides").hidden = environmentSources.length === 0;
  qs("environment-overrides").textContent = environmentSources.length ? \`An environment variable raises protection beyond these settings: \${environmentSources.map((source) => source.slice(4)).join(", ")}\` : "";
  qs("safety-level").innerHTML = Object.entries(safetyLevels).map(([level, meta]) => \`<label class="preset-card preset-\${level}"><input type="radio" name="safety-level" value="\${level}" \${draftPolicy.safety.level === level ? "checked" : ""}><span class="preset-name">\${meta[0]}</span><span class="preset-description">\${meta[1]}</span></label>\`).join("");
  const inherited = SAFETY_LEVEL_CAPABILITIES[draftPolicy.safety.level];
  qs("safety-overrides").innerHTML = Object.entries(capabilityNames).map(([key, meta]) => {
    const value = draftPolicy.safety.overrides[key];
    return \`<div class="setting-row"><label class="setting-text" for="override-\${key}"><strong>\${meta[0]}</strong><small>\${meta[1]}</small></label>\${projectFieldChip(\`safety.overrides.\${key}\`)}<select id="override-\${key}" data-safety-override="\${key}">
      <option value="inherit" \${value === undefined ? "selected" : ""}>From preset (\${inherited[key] ? "on" : "off"})</option>
      <option value="true" \${value === true ? "selected" : ""}>Always on</option>
      <option value="false" \${value === false ? "selected" : ""}>Always off</option>
    </select></div>\`;
  }).join("");
  qs("workflow").innerHTML = \`<div class="setting-row"><label class="setting-text" for="workflow-worktree"><strong>Allow discarding local changes in linked git worktrees</strong><small>Only relaxes the discard checks inside linked worktrees.</small></label>\${projectFieldChip("workflow.worktree_mode")}<input type="checkbox" class="switch" id="workflow-worktree" data-workflow-worktree \${draftPolicy.workflow.worktree_mode ? "checked" : ""}></div>\`;
  const customized = (preview?.counts.effectiveCustomizations ?? 0) > 0 || Object.entries(draftPolicy.safety.overrides).some(([key, value]) => value !== SAFETY_LEVEL_CAPABILITIES[draftPolicy.safety.level][key]);
  qs("safety-preset-status").textContent = customized ? \`\${levelName(draftPolicy.safety.level)}, customized\` : "";
};
var showRulePopover = (button, options) => {
  const popover = qs("rule-example-popover");
  qs("rule-example-label").textContent = options.label;
  qs("rule-example-title").textContent = options.title;
  qs("rule-example-description").textContent = options.description;
  qs("rule-example-description").hidden = options.description === "";
  qs("rule-example-command").textContent = options.body;
  if (!popover.matches(":popover-open"))
    popover.showPopover();
  const buttonRect = button.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const below = buttonRect.bottom + 8;
  popover.style.top = \`\${below + popoverRect.height <= window.innerHeight - 12 ? below : Math.max(12, buttonRect.top - 8 - popoverRect.height)}px\`;
  popover.style.left = \`\${Math.min(window.innerWidth - popoverRect.width - 12, Math.max(12, buttonRect.right - popoverRect.width))}px\`;
};
var validatePathAdditions = async (patch) => {
  const candidate = collectFormPolicy();
  patch(candidate);
  const result = await requestPolicyPreview(candidate);
  return result.ok && result.data?.preview ? null : errorText(result);
};
var createPathList = (prefix, config) => {
  const setHint = (text) => {
    qs(\`\${prefix}-hint\`).textContent = text;
    qs(\`\${prefix}-hint\`).hidden = !text;
  };
  const render = () => {
    const paths = config.getPaths();
    const disabled = config.isDisabled();
    qs(\`\${prefix}-count\`).textContent = paths.length > 0 ? String(paths.length) : "";
    qs(\`\${prefix}-input\`).disabled = disabled;
    qs(\`\${prefix}-add-button\`).disabled = disabled;
    qs(\`\${prefix}-list\`).innerHTML = paths.map((path, index) => \`<li class="path-item\${disabled ? " row-disabled" : ""}">
          <code>\${escapeHtml(path)}</code>
          <button type="button" class="quiet icon-only" data-path-list="\${prefix}" data-path-remove="\${index}" \${disabled ? "disabled" : ""} aria-label="Remove \${escapeHtml(path)}">\${icons.remove}</button>
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
    const entries = [
      ...new Set(value.split(\`
\`).map((line) => line.trim()).filter(Boolean))
    ];
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
      const error = await validatePathAdditions((candidate) => config.patch(candidate, [...config.getPaths(), ...additions])).finally(() => {
        adding = false;
      });
      if (projectDraft !== scope)
        return;
      if (error) {
        setHint(\`Not added: \${additions.join(", ")}. \${error}\`);
        if (claimed) {
          markedFields.delete(config.field);
          config.setPaths(previousPaths);
          syncProjectChips();
        }
        return;
      }
    }
    const current = config.getPaths();
    const duplicates = entries.filter((entry) => current.includes(entry));
    config.setPaths([...current, ...additions.filter((entry) => !current.includes(entry))]);
    if (qs(\`\${prefix}-input\`).value === submitted)
      qs(\`\${prefix}-input\`).value = "";
    setHint(duplicates.length ? \`Already listed: \${duplicates.join(", ")}\` : "");
    render();
    afterEdit(false);
    qs(\`\${prefix}-input\`).focus();
  };
  const remove = (index) => {
    claimForProject();
    config.setPaths(config.getPaths().filter((_, position) => position !== index));
    setHint("");
    render();
    afterEdit(false);
  };
  return { render, add, remove };
};
var pathLists = {
  "allow-paths": createPathList("allow-paths", {
    field: "destructive_command_protection.allow_paths",
    getPaths: () => draftPolicy.destructive_command_protection.allow_paths,
    setPaths: (paths) => {
      draftPolicy.destructive_command_protection.allow_paths = paths;
    },
    isDisabled: () => !draftPolicy.destructive_command_protection.enabled,
    patch: (candidate, paths) => {
      candidate.destructive_command_protection = {
        ...candidate.destructive_command_protection,
        allow_paths: paths
      };
    }
  }),
  "deny-paths": createPathList("deny-paths", {
    field: "secret_protection.deny_paths",
    getPaths: () => draftPolicy.secret_protection.deny_paths,
    setPaths: (paths) => {
      draftPolicy.secret_protection.deny_paths = paths;
    },
    isDisabled: () => !draftPolicy.secret_protection.enabled,
    patch: (candidate, paths) => {
      candidate.secret_protection = { ...candidate.secret_protection, deny_paths: paths };
    }
  }),
  "secret-allow-paths": createPathList("secret-allow-paths", {
    field: "secret_protection.allow_paths",
    getPaths: () => draftPolicy.secret_protection.allow_paths,
    setPaths: (paths) => {
      draftPolicy.secret_protection.allow_paths = paths;
    },
    isDisabled: () => !draftPolicy.secret_protection.enabled,
    patch: (candidate, paths) => {
      candidate.secret_protection = { ...candidate.secret_protection, allow_paths: paths };
    }
  })
};
var pathListFor = (name) => name === "deny-paths" || name === "allow-paths" || name === "secret-allow-paths" ? pathLists[name] : null;
var renderPathLists = () => {
  Object.values(pathLists).forEach((list) => {
    list.render();
  });
};
var syncMasterSwitches = () => {
  qs("destructive-enabled").checked = draftPolicy.destructive_command_protection.enabled;
  qs("secret-enabled").checked = draftPolicy.secret_protection.enabled;
};
function renderPolicySections() {
  syncMasterSwitches();
  renderSafety();
  renderRules();
  renderPathLists();
  syncProjectChips();
  syncRawFromForm();
  updateDirtyStatus();
}
var refreshPolicyPreview = async () => {
  const requestId = ++previewRequestId;
  const result = await requestPolicyPreview(effectivePreviewPolicy(collectFormPolicy()));
  if (requestId !== previewRequestId)
    return;
  if (!result.ok || !result.data?.preview) {
    notify("Preview failed", "error", errorText(result));
    return;
  }
  preview = result.data.preview;
  renderSafety();
  renderRules();
  runCommandTest();
};
var runCommandTest = async () => {
  const command = qs("tester-input").value.trim();
  if (!command) {
    qs("tester-result").hidden = true;
    return;
  }
  const requestId = ++testerRequestId;
  const result = await requestJson("/api/policy/explain", {
    method: "POST",
    body: JSON.stringify({ command, policy: effectivePreviewPolicy(collectFormPolicy()) })
  });
  if (requestId !== testerRequestId)
    return;
  const el = qs("tester-result");
  el.hidden = false;
  if (!result.ok) {
    el.className = "notice error";
    el.textContent = \`Could not test this command: \${errorText(result)}\`;
    return;
  }
  if (result.data.result === "allowed") {
    el.className = "notice ok";
    el.innerHTML = \`<strong>Allowed.</strong> No rule blocks this command. <a href="#rules?compose=\${encodeURIComponent(command)}">Create a rule to block it</a>\`;
    return;
  }
  const ruleId = result.data.customRule?.id ?? result.data.ruleId;
  const ruleHtml = !ruleId ? "" : result.data.customRule ? \` by <a class="rule-id" href="#rules?focus=\${encodeURIComponent(ruleId)}">\${escapeHtml(ruleId)}</a>\` : \` by <a class="rule-id" href="#policy?q=\${encodeURIComponent(ruleId)}">\${escapeHtml(ruleId)}</a>\`;
  el.className = "notice error";
  el.innerHTML = \`<strong>Blocked</strong>\${ruleHtml}. \${escapeHtml(result.data.reason || "")}\${result.data.segment && result.data.segment !== command ? \`<div class="tester-segment">Blocked part: <code>\${escapeHtml(result.data.segment)}</code></div>\` : ""}\`;
};
var render2 = () => {
  if (!state)
    return;
  const loaded = state;
  draftPolicy = clonePolicy(loaded.policy);
  preview = loaded.preview;
  shared.dirty = false;
  qs("policy-savebar").hidden = true;
  showPath("policy-path", loaded.path, loaded.exists ? "" : " (not created yet)");
  const projectPolicy = loaded.projectPolicy;
  qs("project-policy-row").hidden = !projectPolicy;
  showPath("project-policy-path", projectPolicy?.path ?? "");
  qs("project-policy-notice").hidden = !projectPolicy || projectPolicy.weakenings.length === 0;
  qs("project-policy-notice").textContent = projectPolicy ? ["The project policy changes these settings:", ...projectPolicy.weakenings].join(\`
\`) : "";
  qs("app-version").textContent = loaded.version;
  qs("raw").value = loaded.errors.length ? loaded.raw : \`\${JSON.stringify(draftPolicy, null, 2)}
\`;
  qs("recovery").hidden = loaded.errors.length === 0;
  qs("policy-errors").textContent = loaded.errors.join(\`
\`);
  syncMasterSwitches();
  renderSafety();
  renderRules();
  renderPathLists();
  syncProjectChips();
  syncRawFromForm();
  if (loaded.errors.length)
    qs("raw-source").textContent = "The file as it is on disk.";
  updateActions();
  setBanner();
  emit("dirty");
  emit("policy");
  if (loaded.errors.length && !location.hash.startsWith("#policy"))
    location.hash = "policy";
};
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
  notify("Restored your unsaved changes", "ok");
};
var loadPolicy = async () => {
  const result = await requestJson("/api/policy");
  if (!result.ok || !result.data) {
    notify("Could not load your policy", "error", errorText(result));
    return false;
  }
  state = result.data;
  shared.policy = state;
  render2();
  restoreDraft();
  if (state.errors.length)
    notify("Your policy file needs repair", "error");
  return true;
};
var writePolicy = async (path, body, failureTitle) => {
  const result = await requestJson(path, { method: "POST", body });
  if (isWriteSuccess(result))
    return result;
  notify(failureTitle, "error", errorText(result));
  return null;
};
var reloadAfterWrite = async () => {
  sessionStorage.removeItem("cc-safety-net-draft");
  return loadPolicy();
};
var renderProjectDraftBar = () => {
  shared.drafting = projectDraft !== null;
  qs("scope-user").setAttribute("aria-pressed", String(projectDraft === null));
  qs("project-draft-enter").setAttribute("aria-pressed", String(projectDraft !== null));
  qs("project-draft-bar").hidden = projectDraft === null;
  qs("save").textContent = projectDraft ? "Review and apply" : "Save";
  if (!projectDraft)
    return;
  qs("project-draft-path").textContent = projectDraft.path;
  qs("project-draft-change").hidden = !projectDraft.canPickDirectory;
};
var setProjectDraftDiagnostics = (messages) => {
  qs("project-draft-diagnostics").textContent = messages.join(\`
\`);
  qs("project-draft-diagnostics").hidden = messages.length === 0;
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
    notify("Project policy unavailable", "error", errorText(result));
    return false;
  }
  const seeded = seedProjectDraft(result.data);
  if (!seeded) {
    exitProjectDraft();
    await loadPolicy();
    notify("Repair your policy first", "error", [
      "Your own policy file must be repaired before you can edit a project policy.",
      ...Array.isArray(result.data.userPolicyDiagnostics) ? result.data.userPolicyDiagnostics : []
    ].join(\`
\`));
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
  notify(okStatus, "ok");
  return true;
};
var enterProjectDraft = async () => {
  if (projectDraft)
    return;
  if (!state) {
    notify("Your policy has not loaded yet", "error", "Reload the page.");
    return;
  }
  if (state.errors.length) {
    notify("Repair your policy first", "error");
    return;
  }
  if (shared.dirty) {
    if (!await confirmDialog({
      title: "Discard unsaved changes?",
      body: "A project policy starts from your saved policy. Save your changes first, or discard them here.",
      confirmLabel: "Discard changes",
      confirmClass: ""
    }))
      return;
    sessionStorage.removeItem("cc-safety-net-draft");
    if (!await loadPolicy())
      return;
  }
  await ingestProjectState("Editing the project policy");
};
var confirmDiscardProjectDraft = async (body) => !shared.dirty || await confirmDialog({
  title: "Discard this project draft?",
  body,
  confirmLabel: "Discard draft",
  confirmClass: ""
});
var changeProjectDirectory = async () => {
  if (!await confirmDiscardProjectDraft("Switching folders discards this draft."))
    return;
  const result = await requestJson("/api/policy/project/choose-directory", { method: "POST" });
  if (!result.ok) {
    notify("Could not open the folder picker", "error", errorText(result));
    return;
  }
  if (result.data.error) {
    notify(result.data.error, "error");
    return;
  }
  if (result.data.cancelled)
    return;
  await ingestProjectState("Editing the project policy");
};
var leaveProjectDraft = async () => {
  if (!projectDraft)
    return;
  if (!await confirmDiscardProjectDraft("Your project changes have not been written anywhere yet."))
    return;
  exitProjectDraft();
  if (await loadPolicy())
    notify("Back to your own policy", "ok");
};
var discardProjectDraft = async (draft) => {
  if (!await confirmDialog({
    title: "Discard changes to this draft?",
    body: "The draft goes back to the settings this project already has.",
    confirmLabel: "Discard changes",
    confirmClass: ""
  }))
    return;
  const snapshot = JSON.parse(draft.snapshot);
  markedFields = new Set(projectMarkedFields(snapshot));
  draftPolicy = overlayProjectProposal(draft.baseline, snapshot);
  renderPolicySections();
  refreshPolicyPreview();
  notify("Changes discarded", "ok");
};
var handleStaleProjectDraft = async () => {
  if (!await ingestProjectState("Project draft reloaded"))
    return;
  notify("The project folder changed", "error", "The draft was reloaded for the new folder. Review it again before applying.");
};
var projectDiffHtml = (data) => {
  const rows = Array.isArray(data.rows) ? data.rows : [];
  const warnings = [
    ...data.existingFileDiagnostics?.length ? ["The existing project policy file is invalid and will be replaced."] : [],
    ...data.weakenings ?? []
  ];
  return (rows.length === 0 ? '<p class="empty">No change to the effective policy.</p>' : \`<table class="diff-table"><thead><tr><th>Setting</th><th>Now</th><th>After</th></tr></thead><tbody>\${rows.map((row) => \`<tr><td><code>\${escapeHtml(row.field)}</code></td><td class="diff-before">\${escapeHtml(row.before ?? "(unset)")}</td><td class="diff-after">\${escapeHtml(row.after ?? "(unset)")}</td></tr>\`).join("")}</tbody></table>\`) + warnings.map((text) => \`<p class="notice warn">\${escapeHtml(text)}</p>\`).join("");
};
var reviewProjectDraft = async (draft) => {
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
    notify("Review failed", "error", errorText(diff));
    return;
  }
  if (JSON.stringify(collectProjectProposal(markedFields, draftPolicy)) !== serialized) {
    notify("Review again", "error", "The draft changed while the review was loading.");
    return;
  }
  if (!await confirmDialog({
    title: "Apply this project policy?",
    body: "Everyone who works in this project gets these settings on top of their own policy.",
    detail: draft.path,
    rowsHtml: projectDiffHtml(diff.data),
    confirmLabel: "Apply project policy",
    confirmClass: "primary"
  }))
    return;
  await runExclusive("Applying…", async () => {
    const applied = await requestJson("/api/policy/project/apply", { method: "POST", body });
    if (applied.status === 409) {
      await handleStaleProjectDraft();
      return;
    }
    if (!isWriteSuccess(applied)) {
      notify("Apply failed", "error", errorText(applied));
      return;
    }
    exitProjectDraft();
    if (await loadPolicy())
      notify("Project policy applied", "ok", applied.data.path);
  });
};
var save = () => {
  if (!state) {
    notify("Your policy has not loaded yet", "error", "Reload the page.");
    return;
  }
  if (state.errors.length) {
    notify("Repair your policy before saving", "error");
    return;
  }
  if (projectDraft) {
    reviewProjectDraft(projectDraft);
    return;
  }
  if (!shared.dirty)
    return;
  const policy = collectFormPolicy();
  runExclusive("Saving…", async () => {
    const result = await writePolicy("/api/policy", JSON.stringify(policy), "Save failed");
    if (result && await reloadAfterWrite())
      notify("Policy saved", "ok", result.data.path);
  });
};
var discard = async () => {
  if (projectDraft) {
    await discardProjectDraft(projectDraft);
    return;
  }
  if (!await confirmDialog({
    title: "Discard unsaved changes?",
    body: "Every change since your last save will be undone.",
    confirmLabel: "Discard changes",
    confirmClass: ""
  }))
    return;
  await runExclusive("Discarding…", async () => {
    sessionStorage.removeItem("cc-safety-net-draft");
    if (await loadPolicy())
      notify("Changes discarded", "ok");
  });
};
var repair = async () => {
  if (!state?.errors.length)
    return;
  if (!await confirmDialog({
    title: "Repair your policy file?",
    body: "Valid settings are kept and invalid ones are dropped. If the JSON cannot be read at all, defaults are restored.",
    detail: state.path,
    confirmLabel: "Repair",
    confirmClass: "primary"
  }))
    return;
  await runExclusive("Repairing…", async () => {
    const result = await writePolicy("/api/repair", "{}", "Repair failed");
    if (result && await reloadAfterWrite())
      notify("Policy repaired", "ok", result.data.path);
  });
};
var resetOverrides = async (section) => {
  if (Object.keys(draftPolicy[section].overrides).length === 0) {
    notify("Nothing to reset: every rule already uses its default", "ok");
    return;
  }
  if (!await confirmDialog({
    title: "Reset every rule to its default?",
    body: \`All \${section === "secret_protection" ? "secret" : "command"} rules go back to the setting their preset gives them. You can still discard before saving.\`,
    confirmLabel: "Reset rules"
  }))
    return;
  markedFields = new Set([...markedFields].filter((field) => !field.startsWith(\`\${section}.overrides.\`)));
  if (projectDraft) {
    draftPolicy = overlayProjectProposal(projectDraft.baseline, collectProjectProposal(markedFields, draftPolicy));
    renderPolicySections();
    refreshPolicyPreview();
    return;
  }
  draftPolicy[section].overrides = {};
  renderRules();
  afterEdit();
};
var setDestructiveOverride = (ruleId, active) => {
  if (!projectDraft && active === preview?.rules[ruleId]?.inheritedEnabled) {
    delete draftPolicy.destructive_command_protection.overrides[ruleId];
    return;
  }
  draftPolicy.destructive_command_protection.overrides[ruleId] = active ? "on" : "off";
  markProjectOverride("destructive_command_protection", ruleId);
};
var setSecretOverride = (rule, active) => {
  if (!projectDraft && active === !rule.defaultOff) {
    delete draftPolicy.secret_protection.overrides[rule.id];
    return;
  }
  draftPolicy.secret_protection.overrides[rule.id] = active ? "on" : "off";
  markProjectOverride("secret_protection", rule.id);
};
var toggleProtection = async (input) => {
  const secret = input.id === "secret-enabled";
  if (!input.checked && !await confirmDialog({
    title: secret ? "Turn off secret protection?" : "Turn off command protection?",
    body: secret ? "Sensitive files, coding agent credentials, and deny paths stop being blocked until you turn this back on." : "Built-in destructive git, filesystem, and execution rules stop blocking commands until you turn this back on.",
    detail: secret ? undefined : "Catastrophic and custom rules still apply.",
    confirmLabel: "Turn off"
  })) {
    input.checked = true;
    return;
  }
  if (secret)
    draftPolicy.secret_protection.enabled = input.checked;
  if (!secret)
    draftPolicy.destructive_command_protection.enabled = input.checked;
  markProjectField(secret ? "secret_protection.enabled" : "destructive_command_protection.enabled");
  renderRules();
  renderPathLists();
  afterEdit(!secret);
};
var handleChange = (control) => {
  if (control.name === "safety-level") {
    draftPolicy.safety.level = control.value;
    markProjectField("safety.level");
    renderSafety();
    afterEdit();
    return;
  }
  if (control.dataset.safetyOverride) {
    const capability = control.dataset.safetyOverride;
    if (control.value === "inherit" && !projectDraft)
      delete draftPolicy.safety.overrides[capability];
    if (control.value !== "inherit")
      draftPolicy.safety.overrides[capability] = control.value === "true";
    if (control.value === "inherit")
      unmarkProjectField(\`safety.overrides.\${capability}\`);
    if (control.value !== "inherit")
      markProjectField(\`safety.overrides.\${capability}\`);
    afterEdit();
    return;
  }
  if (!(control instanceof HTMLInputElement))
    return;
  if ("workflowWorktree" in control.dataset) {
    draftPolicy.workflow.worktree_mode = control.checked;
    markProjectField("workflow.worktree_mode");
    afterEdit(false);
    return;
  }
  if (control.id === "destructive-enabled" || control.id === "secret-enabled") {
    toggleProtection(control);
    return;
  }
  const destructiveId = control.dataset.destructiveCommandActive;
  if (destructiveId) {
    setDestructiveOverride(destructiveId, control.checked);
    afterEdit();
    return;
  }
  const secretGroup = control.dataset.secretGroupActive;
  if (secretGroup) {
    state?.secretPatterns.filter((rule) => rule.category === secretGroup).forEach((rule) => {
      setSecretOverride(rule, control.checked);
    });
    renderRules();
    afterEdit(false);
    return;
  }
  const secretRule = state?.secretPatterns.find((rule) => rule.id === control.dataset.secretActive);
  if (secretRule) {
    setSecretOverride(secretRule, control.checked);
    renderRules();
    afterEdit(false);
  }
};
var handleClick = (target) => {
  const unmark = target.closest("[data-unmark-field]");
  if (unmark) {
    unmarkProjectField(unmark.dataset.unmarkField ?? "");
    return;
  }
  const groupToggle = target.closest("[data-group-toggle]");
  if (groupToggle) {
    groupExpanded.set(groupToggle.dataset.groupToggle ?? "", groupToggle.getAttribute("aria-expanded") !== "true");
    renderRules();
    return;
  }
  const show = target.closest("[data-policy-show]");
  if (show) {
    setChangedOnly(show.dataset.policyShow === "changed");
    groupExpanded.clear();
    renderRules();
    syncHash2();
    return;
  }
  const example = state?.destructiveCommandRules.find((rule) => rule.id === target.closest("[data-rule-example]")?.dataset.ruleExample);
  if (example) {
    showRulePopover(target.closest("[data-rule-example]"), {
      label: example.catastrophic ? "Always on" : example.category,
      title: example.label,
      description: example.description,
      body: example.example
    });
    return;
  }
  const secretPaths = state?.secretPatterns.find((rule) => rule.id === target.closest("[data-secret-paths]")?.dataset.secretPaths);
  if (secretPaths?.paths) {
    showRulePopover(target.closest("[data-secret-paths]"), {
      label: "Protected paths",
      title: secretPaths.label,
      description: "",
      body: secretPaths.paths.join(\`
\`)
    });
    return;
  }
  const inherited = target.closest("[data-use-inherited]");
  if (inherited) {
    const ruleId = inherited.dataset.useInherited ?? "";
    if (projectDraft) {
      unmarkProjectField(\`destructive_command_protection.overrides.\${ruleId}\`);
      return;
    }
    delete draftPolicy.destructive_command_protection.overrides[ruleId];
    afterEdit();
    return;
  }
  const secretReset = target.closest("[data-secret-reset]");
  if (secretReset) {
    const ruleId = secretReset.dataset.secretReset ?? "";
    if (projectDraft) {
      unmarkProjectField(\`secret_protection.overrides.\${ruleId}\`);
      return;
    }
    delete draftPolicy.secret_protection.overrides[ruleId];
    renderRules();
    afterEdit(false);
    return;
  }
  const addButton = target.closest("[data-path-add]");
  if (addButton) {
    pathListFor(addButton.dataset.pathAdd)?.add(qs(\`\${addButton.dataset.pathAdd}-input\`).value);
    return;
  }
  const removeButton = target.closest("[data-path-remove]");
  if (removeButton)
    pathListFor(removeButton.dataset.pathList)?.remove(Number(removeButton.dataset.pathRemove));
};
var showPolicy = (params) => {
  const next = policyFiltersFromParams(params);
  if (policyHash(next) !== policyHash(currentFilters())) {
    qs("policy-search").value = next.query;
    setChangedOnly(next.changedOnly);
    groupExpanded.clear();
    renderRules();
  }
  if (!next.query)
    return;
  document.querySelector(\`[data-rule-row="\${CSS.escape(next.query)}"]\`)?.scrollIntoView({ block: "center" });
};
var setRawCopyLabel = () => {
  qs("raw-copy").innerHTML = \`\${icons.copy}<span>Copy</span>\`;
};
var initPolicy = () => {
  setRawCopyLabel();
  const view = qs("policy-search").closest("[data-view]");
  view.addEventListener("change", (event) => {
    const control = event.target;
    if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement)
      handleChange(control);
  });
  view.addEventListener("click", (event) => {
    if (event.target instanceof Element)
      handleClick(event.target);
  });
  document.addEventListener("keydown", (event) => {
    if (view.hidden || document.querySelector("dialog[open]"))
      return;
    if (!(event.target instanceof HTMLElement) || !isSearchShortcut(event, event.target))
      return;
    event.preventDefault();
    qs("policy-search").focus();
  });
  qs("policy-search").addEventListener("input", () => {
    groupExpanded.clear();
    renderRules();
    syncHash2();
  });
  view.addEventListener("keydown", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || event.key !== "Enter")
      return;
    const list = pathListFor(input.dataset.pathInput);
    if (!list)
      return;
    event.preventDefault();
    list.add(input.value);
  });
  view.addEventListener("paste", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement))
      return;
    const list = pathListFor(input.dataset.pathInput);
    const text = event.clipboardData?.getData("text") ?? "";
    if (!list || !text.includes(\`
\`))
      return;
    event.preventDefault();
    list.add(\`\${input.value}
\${text}\`);
  });
  const testerDialog = qs("tester-dialog");
  qs("tester-open").addEventListener("click", () => {
    testerDialog.showModal();
    qs("tester-input").select();
    runCommandTest();
  });
  qs("tester-form").addEventListener("submit", (event) => {
    event.preventDefault();
    runCommandTest();
  });
  qs("tester-close").addEventListener("click", () => testerDialog.close());
  qs("tester-result").addEventListener("click", (event) => {
    if (event.target.closest("a"))
      testerDialog.close();
  });
  qs("scope-user").addEventListener("click", () => {
    leaveProjectDraft();
  });
  qs("project-draft-enter").addEventListener("click", () => {
    enterProjectDraft();
  });
  qs("project-draft-change").addEventListener("click", () => {
    changeProjectDirectory();
  });
  qs("reset-rule-customizations").addEventListener("click", () => {
    resetOverrides("destructive_command_protection");
  });
  qs("reset-secret-customizations").addEventListener("click", () => {
    resetOverrides("secret_protection");
  });
  qs("save").addEventListener("click", save);
  qs("discard-changes").addEventListener("click", () => {
    discard();
  });
  qs("repair").addEventListener("click", () => {
    repair();
  });
  qs("raw-copy").addEventListener("click", (event) => {
    copyText(event.currentTarget, qs("raw").value);
  });
  window.addEventListener("hashchange", setBanner);
  window.addEventListener("beforeunload", (event) => {
    if (!shared.dirty)
      return;
    event.preventDefault();
    event.returnValue = "";
  });
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

// src/gui/frontend/views/rules.ts
var rulesData = null;
var requested = false;
var scope = "project";
var pendingFocus = null;
var directoryPickerFailed = false;
var showPathEnd = () => {
  const input = qs("rules-project-path");
  input.title = input.value;
  if (document.activeElement !== input)
    input.scrollLeft = input.scrollWidth;
};
var render3 = () => {
  const loaded = rulesData;
  if (!loaded)
    return;
  const pathInput = qs("rules-project-path");
  if (!pathInput.value)
    pathInput.value = loaded.projectPath;
  const canPick = loaded.canPickDirectory && !directoryPickerFailed;
  pathInput.readOnly = canPick;
  qs("rules-choose-directory").hidden = !canPick;
  showPathEnd();
  qs("rules-list").innerHTML = loaded.rulebooks.length === 0 ? loaded.errors.length > 0 ? '<p class="empty">Every rulebook was skipped because of errors, so no custom rule is enforced. See Problems above.</p>' : '<p class="empty">No custom rules yet. Use <strong>Create a rule</strong> below, or run <code>npx -y cc-safety-net rule init</code>.</p>' : loaded.rulebooks.map((rulebook) => \`<section class="rulebook">
    <div class="rulebook-head">
      <strong>\${escapeHtml(rulebook.name)}</strong>
      <span class="count">v\${escapeHtml(rulebook.version)}</span>
      <span>\${rulebook.source === "user" ? "All projects" : "This project"}</span>
      <span>\${plural(rulebook.rules.length, "rule")}</span>
      \${rulebook.spec === rulebook.name ? "" : \`<code>\${escapeHtml(rulebook.spec)}</code>\`}
    </div>
    <ul class="card rows">\${rulebook.rules.map((rule) => \`<li class="setting-row rulebook-rule\${pendingFocus === rule.name ? " focused" : ""}">
      <div class="rulebook-rule-head"><code class="command">\${escapeHtml([rule.command, rule.subcommand].filter(Boolean).join(" "))}</code><code class="rule-id">custom.\${escapeHtml(rule.name)}</code></div>
      <p>\${escapeHtml(rule.reason)}</p>
      <p class="muted">Blocks when any of these arguments is present: \${rule.block_args.map((arg) => \`<code>\${escapeHtml(arg)}</code>\`).join(" ")}</p>
    </li>\`).join("")}</ul>
  </section>\`).join("");
  const diagnostics = [
    ...loaded.errors.map((text) => \`<p class="notice error">\${escapeHtml(text)}</p>\`),
    ...loaded.warnings.map((text) => \`<p class="notice warn">\${escapeHtml(text)}</p>\`)
  ];
  qs("rules-diagnostics").innerHTML = diagnostics.join("");
  qs("rules-diagnostics-panel").hidden = diagnostics.length === 0;
  if (!pendingFocus)
    return;
  const focused = qs("rules-list").querySelector(".focused");
  if (focused)
    focused.scrollIntoView({ block: "center" });
  if (!focused)
    notify(\`custom.\${pendingFocus} is not in any rulebook\`, "error");
  pendingFocus = null;
};
var loadRules = async () => {
  requested = true;
  const result = await requestJson("/api/rules");
  if (!result.ok || !Array.isArray(result.data?.rulebooks)) {
    qs("rules-list").innerHTML = \`<p class="empty">Could not load rules: \${escapeHtml(errorText(result))}</p>\`;
    rulesData = null;
    requested = false;
    qs("rules-diagnostics-panel").hidden = true;
    return;
  }
  rulesData = result.data;
  render3();
};
var showRules = (params) => {
  const focus = params.get("focus");
  const compose = params.get("compose");
  if (focus)
    pendingFocus = focus.replace(/^custom\\./, "");
  if (compose) {
    qs("rules-composer-input").value = compose;
    qs("rules-composer-panel").scrollIntoView({ block: "start" });
    qs("rules-composer-input").focus();
  }
  showPathEnd();
  if (!requested) {
    loadRules();
    return;
  }
  if (focus)
    render3();
};
var setScope = (next) => {
  scope = next;
  document.querySelectorAll("[data-rules-scope]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.rulesScope === next));
  });
  qs("rules-project-path-field").hidden = next !== "project";
  showPathEnd();
};
var chooseProjectDirectory = async (button) => {
  if (button.disabled)
    return;
  button.disabled = true;
  const result = await requestJson("/api/rules/choose-directory", { method: "POST" });
  button.disabled = false;
  if (result.ok && result.data.path) {
    qs("rules-project-path").value = result.data.path;
    showPathEnd();
    return;
  }
  if (result.ok && result.data.cancelled)
    return;
  directoryPickerFailed = true;
  qs("rules-project-path").readOnly = false;
  button.hidden = true;
  notify("The folder picker is not available", "error", \`\${result.ok ? result.data.error : errorText(result)}. Type the project folder instead.\`);
};
var copyRulePrompt = async (button) => {
  const request = qs("rules-composer-input").value;
  const projectPath = qs("rules-project-path").value;
  if (!rulesData) {
    notify("Rules have not loaded yet", "error", "Click Refresh and try again.");
    return;
  }
  if (!request.trim()) {
    notify("Describe what should be blocked first", "error");
    return;
  }
  if (scope === "project" && !projectPath.trim()) {
    notify("Enter the project folder the rule belongs to", "error");
    return;
  }
  button.disabled = true;
  const copied = await navigator.clipboard.writeText(rulePromptText({ rulesData, rulesScope: scope, projectPath, request })).then(() => true, () => false);
  button.disabled = false;
  if (!copied) {
    notify("Copy failed", "error");
    return;
  }
  qs("rules-composer-input").value = "";
  notify("Prompt copied", "ok", "Paste it into your coding agent.");
};
var initRules = () => {
  qs("rules-refresh").addEventListener("click", (event) => {
    runRefresh(event.currentTarget, loadRules);
  });
  qs("rules-project-path").addEventListener("blur", showPathEnd);
  qs("rules-choose-directory").addEventListener("click", (event) => {
    chooseProjectDirectory(event.currentTarget);
  });
  qs("rules-copy-prompt").addEventListener("click", (event) => {
    copyRulePrompt(event.currentTarget);
  });
  qs("rules-composer-panel").addEventListener("click", (event) => {
    const target = event.target;
    const scopeButton = target.closest("[data-rules-scope]");
    if (scopeButton) {
      setScope(scopeButton.dataset.rulesScope ?? "project");
      return;
    }
    const example = target.closest("[data-rules-example]");
    if (example)
      qs("rules-composer-input").value = example.dataset.rulesExample ?? "";
  });
};

// src/gui/frontend/views/settings.ts
var themes = ["auto", "light", "dark"];
var applyTheme = (theme) => {
  document.documentElement.style.colorScheme = theme === "auto" ? "light dark" : theme;
  document.querySelectorAll("[data-theme-choice]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
  });
};
var renderRetention = () => {
  const days = shared.policy?.policy.audit.retention_days;
  if (days === undefined)
    return;
  qs("retention-days").value = String(days);
  qs("retention-unit").textContent = days === 1 ? "day" : "days";
};
var blockedBy = () => (shared.policy?.errors.length ?? 0) > 0 ? "Repair your policy file in Protections first." : shared.drafting ? "Apply or leave your project policy draft first." : shared.dirty ? "Save or discard your unsaved Protections changes first." : null;
var saveRetentionDays = async (days) => {
  const saved = shared.policy;
  if (!saved)
    return;
  const current = saved.policy.audit.retention_days;
  const problem = !Number.isInteger(days) || days < MIN_AUDIT_RETENTION_DAYS || days > MAX_AUDIT_RETENTION_DAYS ? \`Enter a whole number of days from \${MIN_AUDIT_RETENTION_DAYS} to \${MAX_AUDIT_RETENTION_DAYS}.\` : blockedBy();
  if (problem) {
    renderRetention();
    notify("Retention unchanged", "error", problem);
    return;
  }
  if (days === current)
    return;
  if (days < current && !await confirmDialog({
    title: \`Keep logs for only \${dayCount(days)}?\`,
    body: \`Log entries older than \${dayCount(days)} are deleted on the next cleanup and cannot be recovered.\`,
    detail: qs("logs-path").textContent ?? "",
    confirmLabel: "Shorten retention"
  })) {
    renderRetention();
    return;
  }
  await runExclusive("Saving…", async () => {
    const policy = clonePolicy(saved.policy);
    policy.audit.retention_days = days;
    const result = await requestJson("/api/policy", {
      method: "POST",
      body: JSON.stringify(policy)
    });
    if (!isWriteSuccess(result)) {
      renderRetention();
      notify("Save failed", "error", errorText(result));
      return;
    }
    if (!await loadPolicy())
      return;
    limitActivityDays(days);
    await Promise.all([loadOverview(), loadActivity()]);
    notify(\`Logs are now kept for \${dayCount(days)}\`, "ok");
  });
};
var resetPolicy = async () => {
  const saved = shared.policy;
  if (!saved)
    return;
  if (shared.drafting) {
    notify("Reset unavailable", "error", "Apply or leave your project policy draft first.");
    return;
  }
  if (!await confirmDialog({
    title: "Reset your policy?",
    body: "Your policy file is replaced with the defaults. Every customization is lost.",
    detail: saved.path,
    confirmLabel: "Reset policy"
  }))
    return;
  await runExclusive("Resetting…", async () => {
    const result = await requestJson("/api/reset", { method: "POST", body: "{}" });
    if (!isWriteSuccess(result)) {
      notify("Reset failed", "error", errorText(result));
      return;
    }
    sessionStorage.removeItem("cc-safety-net-draft");
    if (await loadPolicy())
      notify("Policy reset to the defaults", "ok", result.data.path);
  });
};
var initSettings = () => {
  document.querySelectorAll("[data-copy-path]").forEach((button) => {
    button.innerHTML = \`\${icons.copy}<span>Copy</span>\`;
    button.addEventListener("click", () => {
      copyText(button, qs(button.dataset.copyPath ?? "").dataset.path ?? "");
    });
  });
  const stored = localStorage.getItem("cc-safety-net-theme");
  applyTheme(themes.includes(stored) ? stored : "auto");
  qs("settings-theme").addEventListener("click", (event) => {
    const theme = event.target.closest("[data-theme-choice]")?.dataset.themeChoice;
    if (!theme)
      return;
    if (theme === "auto")
      localStorage.removeItem("cc-safety-net-theme");
    if (theme !== "auto")
      localStorage.setItem("cc-safety-net-theme", theme);
    applyTheme(theme);
  });
  qs("retention-days").addEventListener("change", (event) => {
    saveRetentionDays(Number(event.target.value));
  });
  qs("reset").addEventListener("click", () => {
    resetPolicy();
  });
  on("policy", renderRetention);
};

// src/gui/frontend/main.ts
var views = {
  overview: ["Overview", () => {
    return;
  }],
  activity: ["Activity", showActivity],
  policy: ["Protections", showPolicy],
  rules: ["Custom rules", showRules],
  integrations: ["Agents", () => {
    return;
  }],
  settings: ["Settings", () => {
    return;
  }]
};
var applyView = () => {
  const [hashName = "", query = ""] = location.hash.slice(1).split("?");
  const view = hashName in views ? hashName : "overview";
  document.body.dataset.view = view;
  document.title = \`\${views[view][0]} · CC Safety Net\`;
  document.querySelectorAll("[data-view]").forEach((section) => {
    section.hidden = section.dataset.view !== view;
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.removeAttribute("aria-current");
    if (link.dataset.nav === view)
      link.setAttribute("aria-current", "page");
  });
  window.scrollTo({ top: 0 });
  views[view][1](new URLSearchParams(query));
};
initConfirmDialog();
initOverview();
initActivity();
initPolicy();
initRules();
initIntegrations();
initSettings();
qs("toast-close").addEventListener("click", () => notify(""));
on("dirty", () => {
  qs("nav-dirty").hidden = !shared.dirty;
});
window.addEventListener("hashchange", applyView);
applyView();
Promise.all([loadIntegrations(), loadHealth()]);
loadPolicy().then((loaded) => {
  if (location.hash.startsWith("#policy?"))
    applyView();
  if (loaded)
    loadStarContext();
  limitActivityDays(retentionDays());
  loadOverview();
  loadActivity();
});

  </script>
</body>
</html>
`;var Yu='<script id="ccsn-data" type="application/json">';function Zu(P,O=zu){return O.replace(Yu,()=>Yu+JSON.stringify({token:P}).replaceAll("<","\\u003c"))}var bs="kenryu42/cc-safety-net",nw=`https://github.com/${bs}`,tp=1e4,tw=7,rw="The project draft directory changed; reload the draft before applying.",ow="audit settings are user scope only; remove the audit section from a project proposal";async function rp(P,O={}){let D=yn({label:"gui",booleans:{noOpen:["--no-open"]}},P),j=O.log??console.log,J=O.error??console.error;if(D.errors.length>0){for(let re of D.errors)J(re);return J("Usage: cc-safety-net gui [--no-open]"),1}let Y=await iw(c,O);if(j(`CC Safety Net policy GUI: ${Y.url}`),!D.flags.noOpen)try{await(O.openBrowser??yw)(Y.url)}catch(re){J(`Failed to open browser: ${re instanceof Error?re.message:String(re)}`),J(`Open this URL manually: ${Y.url}`)}if(O.keepAlive===!1)return await Y.close(),0;return await gw(Y),0}async function iw(P,O={}){let D=Zb(24).toString("base64url"),j={dir:null,revision:0},J=Qb((ie,de)=>{sw(P,ie,de,D,O,j)});await new Promise((ie,de)=>{J.once("error",de),J.listen(0,"127.0.0.1",()=>{J.off("error",de),ie()})});let re=`http://127.0.0.1:${J.address().port}`;return{origin:re,token:D,url:`${re}/?token=${encodeURIComponent(D)}`,close:()=>mw(J)}}async function sw(P,O,D,j,J,Y){let re=P(),ie=new URL(O.url??"/","http://127.0.0.1");if(O.method==="GET"&&ie.pathname==="/favicon.ico"){D.writeHead(204,{"cache-control":"no-store"}),D.end();return}if(!uw(O,ie,j)){ln(D,403,{error:"Forbidden"});return}if(O.method==="GET"&&ie.pathname==="/"){await Promise.resolve(J.buildDocument?.()).then((de)=>fw(D,Zu(j,de)),(de)=>ln(D,500,{error:de instanceof Error?de.message:String(de)}));return}if(O.method==="GET"&&ie.pathname==="/api/policy"){let de=Zd(re,J),fe=k(re,vs(J));ln(D,200,{...de,configState:je(fe),...fe.policyScopes?{projectPolicy:{path:h(J.cwd??process.cwd()),weakenings:fe.policyScopes.weakeningsIgnored?[]:fe.policyScopes.weakenings}}:{},destructiveCommandRules:z,secretPatterns:Qe,version:pn(),preview:de.errors.length>0?null:Le(de.policy,re.env)});return}if(O.method==="POST"&&ie.pathname==="/api/policy/preview"){let de=await fr(O);if(!de.ok){ln(D,de.status,{errors:[de.error]});return}let fe=Xd(re,de.value);ln(D,fe.errors.length>0?400:200,fe);return}if(O.method==="POST"&&ie.pathname==="/api/policy/explain"){let de=await fr(O);if(!de.ok){ln(D,de.status,{errors:[de.error]});return}let fe=de.value;if(fe===null||typeof fe.command!=="string"){ln(D,400,{errors:["command must be a string"]});return}let we=lr(fe.policy,re.home);if(we.length>0){ln(D,400,{errors:we});return}ln(D,200,cw(re,fe.command,fe.policy,J));return}if(O.method==="POST"&&ie.pathname==="/api/policy"){let de=await fr(O);if(!de.ok){ln(D,de.status,{errors:[de.error]});return}let fe=Hn(re,de.value,J);ln(D,fe.errors.length>0?400:200,fe);return}if(O.method==="POST"&&ie.pathname==="/api/reset"){ln(D,200,Hn(re,te,J));return}if(O.method==="POST"&&ie.pathname==="/api/repair"){ln(D,200,Qd(re,J));return}if(O.method==="POST"&&ie.pathname==="/api/policy/project/choose-directory"){let de=await(J.chooseDirectory??hs)();if("path"in de)Y.dir=de.path,Y.revision+=1;ln(D,200,{cancelled:"cancelled"in de,..."error"in de?{error:de.error}:{}});return}if(O.method==="GET"&&ie.pathname==="/api/policy/project"){let de=op(Y,J),fe=ip(re,de,J),we=fe?{projection:{},diagnostics:[fe]}:Xu(de,re.home),Ce=cr(re,J);ln(D,200,{path:h(de),revision:Y.revision,baseline:Ce.baseline,userPolicyDiagnostics:Ce.diagnostics,projection:we.projection,projectionDiagnostics:we.diagnostics,canPickDirectory:ys(process.platform,process.env)});return}if(O.method==="POST"&&ie.pathname==="/api/policy/project/diff"){let de=await Qu(re,O,D,Y,J);if(!de)return;let fe=Xu(de.dir,re.home),we=cr(re,J).baseline,Ce=ee(we,ue(de.proposal,re.home).policy);ln(D,200,{rows:uo(ee(we,fe.projection).policy,Ce.policy,!1),weakenings:Ce.weakenings,existingFileDiagnostics:fe.diagnostics});return}if(O.method==="POST"&&ie.pathname==="/api/policy/project/apply"){let de=await Qu(re,O,D,Y,J);if(!de)return;let fe=lw(de.dir,de.proposal,re.home);ln(D,fe.errors.length>0?500:200,fe);return}if(O.method==="GET"&&ie.pathname==="/api/activity"){let de=oe(re,J),fe=dw(ie.searchParams.get("days"),de);if(fe===null){ln(D,400,{error:`days must be an integer between 1 and ${de}`});return}ln(D,200,Vu(re,fe,J.activityLogsDir));return}if(O.method==="POST"&&ie.pathname==="/api/rules/choose-directory"){ln(D,200,await hs());return}if(O.method==="GET"&&ie.pathname==="/api/rules"){let de=Q(re,vs(J)),fe=new Map(de.rules.map((we)=>[we.name,we]));ln(D,200,{projectPath:J.cwd??process.cwd(),canPickDirectory:ys(process.platform,process.env),rulebooks:de.rulebooks.map((we)=>({source:we.source,spec:we.spec,name:we.name,version:we.version,rules:we.rules.flatMap((Ce)=>{let Se=fe.get(Ce);if(!Se)return[];return[{name:Se.name,command:Se.command,subcommand:Se.subcommand,block_args:Se.block_args,reason:Se.reason}]})})),errors:de.errors,warnings:de.warnings});return}if(O.method==="GET"&&ie.pathname==="/api/star/context"){ln(D,200,await(J.fetchStarContext??(()=>xw(re,{logsDir:J.activityLogsDir})))());return}if(O.method==="POST"&&ie.pathname==="/api/star"){let de=await(J.starRepo??hw)();ln(D,200,de.ok?{ok:!0}:{ok:!1,fallbackUrl:nw});return}if(O.method==="GET"&&ie.pathname==="/api/integrations"){ln(D,200,await(J.fetchIntegrations??(()=>vw(re)))());return}if(O.method==="GET"&&ie.pathname==="/api/health"){ln(D,200,await(J.fetchHealth??ww)());return}if(O.method==="POST"&&(ie.pathname==="/api/install"||ie.pathname==="/api/uninstall")){let de=await fr(O);if(!de.ok){ln(D,de.status,{errors:[de.error]});return}let fe=de.value?.target;if(typeof fe!=="string"||!$n.some((Ce)=>Ce.target===fe)){ln(D,400,{error:"unknown target"});return}let we=ie.pathname==="/api/install"?"install":"uninstall";ln(D,200,await(J.runIntegration??kw)(we,fe));return}ln(D,404,{error:"Not found"})}function vs(P){return{...P,cwd:P.cwd??process.cwd()}}function op(P,O){return P.dir??O.cwd??process.cwd()}function ip(P,O,D){if(!L(P,{...D,cwd:O}))return null;return`${h(O)} is the user policy, not a project policy; choose a project directory, or run the GUI from one`}function Xu(P,O){let D=h(P),j=Xb(D)?bt(D):{value:void 0,errors:[]},J=ue(j.value,O);return{projection:J.policy,diagnostics:[...j.errors,...J.diagnostics]}}async function Qu(P,O,D,j,J){let Y=op(j,J),re=j.revision,ie=await fr(O);if(!ie.ok)return ln(D,ie.status,{errors:[ie.error]}),null;let de=ie.value;if(typeof de?.revision!=="number")return ln(D,400,{errors:["revision must be a number"]}),null;if(de.revision!==re)return ln(D,409,{errors:[rw]}),null;let fe=ip(P,Y,J);if(fe)return ln(D,400,{errors:[fe]}),null;let we=aw(de.proposal,P.home);if(we.length>0)return ln(D,400,{errors:we}),null;return{dir:Y,proposal:de.proposal}}function aw(P,O){let D=lr(P,O);if(D.length>0)return D;return P?.audit===void 0?[]:[ow]}function lw(P,O,D){let j=h(P),J=po(O,E(O,D));try{return g(i(S(P,"project policy"),j),`${JSON.stringify(J,null,2)}
`),{path:j,errors:[]}}catch(Y){return{path:j,errors:[Y instanceof Error?Y.message:String(Y)]}}}function cw(P,O,D,j){let J=E(D,P.home),Y=k(P,vs(j)),re=_e({rules:Y.policy.rules,transparentWrappers:Y.policy.transparentWrappers,safety:$e(J.safety),worktreeMode:J.workflow.worktree_mode,destructiveCommandProtectionEnabled:J.destructive_command_protection.enabled,destructiveCommandRuleOverrides:J.destructive_command_protection.overrides,destructiveCommandAllowPaths:J.destructive_command_protection.allow_paths,secretProtection:{enabled:J.secret_protection.enabled,disabledRules:Fe(J.secret_protection.overrides),denyPaths:J.secret_protection.deny_paths,allowPaths:J.secret_protection.allow_paths}});return nr(O,{policySnapshot:re,cwd:j.cwd,userConfigDir:j.userConfigDir},P)}function dw(P,O){if(P===null)return Math.min(tw,O);let D=Number(P);if(!Number.isInteger(D)||D<1||D>O)return null;return D}function uw(P,O,D){if(O.searchParams.get("token")!==D)return!1;if(P.method!=="POST")return!0;return P.headers["x-cc-safety-net-token"]===D}var pw=1048576;async function fr(P){let O=[],D=0;for await(let j of P){let J=j;if(D+=J.byteLength,D>pw)return{ok:!1,status:413,error:"Request body is too large"};O.push(J)}try{return{ok:!0,value:JSON.parse(Buffer.concat(O).toString("utf-8")||"{}")}}catch(j){return{ok:!1,status:400,error:`Invalid JSON: ${j instanceof Error?j.message:String(j)}`}}}function fw(P,O){P.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),P.end(O)}function ln(P,O,D){P.writeHead(O,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),P.end(JSON.stringify(D))}function mw(P){return new Promise((O,D)=>{P.close((j)=>j?D(j):O())})}function gw(P){return new Promise((O)=>{let D=()=>{process.off("SIGINT",j),process.off("SIGTERM",j)},j=()=>{D(),P.close().then(O)};process.once("SIGINT",j),process.once("SIGTERM",j)})}function yw(P){let O=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",D=process.platform==="win32"?["/c","start","",P]:[P];return new Promise((j,J)=>{let Y=np(O,D,{detached:!0,stdio:"ignore"}),re=(de)=>{Y.off("spawn",ie),J(de)},ie=()=>{Y.off("error",re),Y.unref(),j()};Y.once("error",re),Y.once("spawn",ie)})}async function hw(P="gh",O=tp){return{ok:await Cw(P,["api","-X","PUT",`/user/starred/${bs}`],O)===0}}async function vw(P,O={}){let D=await Sr((J)=>Ot({environment:P,cwd:process.cwd(),openCodeVersion:J}).status!=="n/a",O.fetcher),j=bw(P,D);return{targets:En.map((J)=>{let Y=j.find((re)=>re.platform===J.id);return{target:J.id,label:mn(J.id),version:D.versions[J.id]??null,status:Y?.configured?"active":Y?.detected?"disabled":Y?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:D.version,nodeVersion:D.nodeVersion,platform:D.platform}}}function bw(P,O){return Dt(P,process.cwd(),{ampPluginListOutput:O.ampPluginListOutput,codexPluginListOutput:O.codexPluginListOutput,copilotCliVersion:O.versions["copilot-cli"],openCodeVersion:O.versions.opencode,openCodePluginListOutput:O.openCodePluginListOutput})}async function ww(P={}){let O=await(P.checkUpdates??Gn)();return{update:{latestVersion:O.latestVersion??null,updateAvailable:O.updateAvailable}}}var ep=Promise.resolve();function kw(P,O,D={}){let j=async()=>{let Y=[],{log:re,error:ie}=console;console.log=(...de)=>Y.push(de.map(String).join(" ")),console.error=console.log;try{return{ok:await ar(P,[],{selectTargets:async()=>[O],output:new ew({write(fe,we,Ce){Y.push(String(fe).replace(/\n$/,"")),Ce()}}),...D})===0,output:Y.join(`
`)}}finally{console.log=re,console.error=ie}},J=ep.then(j);return ep=J.then(()=>{return},()=>{return}),J}async function xw(P,O={}){let[D,j]=await Promise.all([Sw(O.fetchRepo),Promise.resolve(br(P,oe(P),O.logsDir).totalBlocked)]);return{starCount:D,blockedTotal:j}}function Cw(P,O,D){return new Promise((j)=>{let J=np(P,O,{stdio:"ignore",windowsHide:!0}),Y=!1,re=setTimeout(()=>{J.kill(),ie(null)},D),ie=(de)=>{if(Y)return;Y=!0,clearTimeout(re),j(de)};J.once("error",()=>ie(null)),J.once("close",ie)})}async function Sw(P=fetch){try{let O=await P(`https://api.github.com/repos/${bs}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(tp)});if(!O.ok)return null;let D=await O.json();return typeof D.stargazers_count==="number"?D.stargazers_count:null}catch{return null}}function Pw(P){if(P[0]!=="help")return!1;let O=P[1];if(!O)qi(),process.exit(0);if(tr(O))process.exit(0);console.error(`Unknown command: ${O}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var Rw={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),tr("hook",console.error),process.exit(1)},install:async(P)=>{process.exit(await ar("install",P))},update:async(P)=>{process.exit(await os(P))},uninstall:async(P)=>{process.exit(await ar("uninstall",P))},rule:async(P)=>{process.exit(await Gu(c(),P))},policy:async(P)=>{process.exit(await ru(c(),P))},status:async(P)=>{if(Dn(yn({label:"status"},P).errors))process.exit(1);Bu(c())},statusline:async(P)=>{let O=yn({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},P);if(O.errors.length===0&&O.flags.claudeCode){await gs(c());return}if(Dn(O.errors),!O.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");tr("statusline",console.error),process.exit(1)},doctor:async(P)=>{let O=Li(P);if(!O)process.exit(1);let D=await bc(c(),{json:O.json,skipUpdateCheck:O.skipUpdateCheck});process.exit(D)},logs:async(P)=>{process.exit(await Es(c(),P))},gui:async(P)=>{process.exit(await rp(P))},explain:async(P)=>{process.exit(await Tc(c(),P))}};async function Ew(P){let O=yn({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},P);if(Pw(P))return;let D=P[0],j=D?vr(D):void 0;if(O.help&&j&&j.name!=="rule")tr(j.name),process.exit(0);if(!D||O.help&&!j)qi(),process.exit(0);if(O.flags.version)Oc(),process.exit(0);if(j){await Rw[j.name](P.slice(1));return}if(D==="--statusline"){await gs(c());return}console.error(D.startsWith("-")?`Unknown option: ${D}`:`Unknown command: ${D}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{Ew as runCli};
