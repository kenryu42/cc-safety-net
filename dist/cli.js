import{c,s,Ge,ft,I,At,mt,a,Dt,n,gt,E,C,ve,Nt,o,R,i,ce,r,v,be,z,Lt,Mt,m,xe,Se,$t,M,ne,le,T,Ft,O,b,ue,V,d,N,re,ht,yt,F,_,L,we,Ce,Be,de,p,e,ze,Me,Ve,Ee,vt,bt,pe,$e,qe,fe,Ke,q,K,Je,ke,h,Fe,x,St,u,J,wt,Y,oe,ie,Ct,Ye,ge,Et,kt,P,D,Ze,Rt,Qe,S,et,he,Te,k,w,j,y,Ht,tt,nt,rt,ot,it,st,g,U}from"./chunks/index-7378s4m6.js";import{ut}from"./chunks/index-wnvw52j9.js";import{at,Pe}from"./chunks/index-3n24xme8.js";import{f,H,l,Ue,t,Ie,dt,Pt,He}from"./chunks/index-p01asw9m.js";import"./chunks/index-fdj8nxca.js";import{ae,X,pt,G,W}from"./chunks/index-j5ds9av7.js";var Rf=["-h","--help"];function pn(A,B){let Z=Object.entries(A.booleans??{}),Q=Object.entries(A.values??{}),ee=Object.entries(A.lists??{}),te=Object.fromEntries(Z.map(([De])=>[De,!1])),se={},me=Object.fromEntries(ee.map(([De])=>[De,[]])),ye=[],Re=[],_e=!1,Ae=-1;for(let[De,Ne]of B.entries()){if(De<=Ae)continue;if(Ne==="--"){ye.push(...B.slice(De+1));break}if(Rf.includes(Ne)){_e=!0;continue}let Oe=Z.find(([,nn])=>nn.includes(Ne));if(Oe){te[Oe[0]]=!0;continue}let Le=Q.find(([,nn])=>nn.includes(Ne));if(Le){let nn=B[De+1];if(nn===void 0||nn.startsWith("-")){Re.push(`${Ne} requires a value`);continue}se[Le[0]]=nn,Ae=De+1;continue}let je=ee.find(([,nn])=>nn.includes(Ne));if(je){let nn=B.slice(De+1),Xe=nn.findIndex((an)=>an.startsWith("-")),rn=nn.slice(0,Xe===-1?nn.length:Xe);if(rn.length===0){Re.push(`${Ne} requires at least one value`);continue}me[je[0]]=[...me[je[0]]??[],...rn],Ae=De+rn.length;continue}if(Ne.startsWith("-")){Re.push(`Unknown option for ${A.label}: ${Ne}`);continue}if(A.positionals==="tail"){ye.push(...B.slice(De));break}ye.push(Ne)}if(A.positionals!=="list"&&A.positionals!=="tail")Re.push(...ye.map((De)=>`Unexpected argument for ${A.label}: ${De}`));return{flags:te,values:se,lists:me,positionals:ye,help:_e,errors:Re}}function An(A){for(let B of A)console.error(B);return A.length>0}import{readdirSync as $f,statSync as sa,unlinkSync as Df}from"node:fs";import{basename as ia,dirname as Nf,isAbsolute as Lf,join as jf,relative as Ff,resolve as Hf,sep as Mf}from"node:path";var ta=(A)=>{let B=Date.now()-new Date(A).getTime();if(!Number.isFinite(B))return"";let Z=Math.floor(B/60000),Q=Math.floor(Z/60),ee=Math.floor(Q/24);if(ee>0)return`${ee}d ago`;if(Q>0)return`${Q}h ago`;if(Z>0)return`${Z}m ago`;return"just now"},Qo=(A)=>{let B=(A??"").trim().split(/\s+/).filter((ee)=>ee&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(ee)),Z=B[0]?.split("/").pop();if(!Z)return null;let Q=B[1];return Q&&/^[a-z][a-z0-9-]*$/.test(Q)?`${Z} ${Q}`:Z};function ra(A){let B=(ee)=>`${ee.sessionId}
${Qo(ee.segment||ee.command)}`,Z=A.filter((ee)=>ee.decision!=="allow"),Q=Z.filter((ee)=>ee.sessionId).reduce((ee,te)=>ee.set(B(te),(ee.get(B(te))??0)+1),new Map);return new Set(Z.filter((ee)=>ee.failureStage||(Q.get(B(ee))??0)>=2))}import{existsSync as Ef,readdirSync as _f,readFileSync as Tf}from"node:fs";import{join as Af}from"node:path";function Kn(A,B){try{return _f(A,{withFileTypes:!0,encoding:"utf8"}).flatMap((Z)=>{let Q=Af(A,Z.name);if(Z.isDirectory())return Kn(Q,B);if(Z.name.endsWith(".jsonl"))return[Q];return[]})}catch{if(B&&Ef(A))B.count++;return[]}}var If=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function Of(A){if(!A||typeof A!=="object"||Array.isArray(A))return!1;let B=A;if(typeof B.ts!=="string"||typeof B.command!=="string")return!1;return If.every((Z)=>B[Z]===void 0||typeof B[Z]==="string")}function Ut(A,B){try{return Tf(A,"utf-8").split(`
`).filter(Boolean).flatMap((Z)=>{try{let Q=JSON.parse(Z);if(!Of(Q)){if(B)B.count++;return[]}return[Q]}catch{if(B)B.count++;return[]}})}catch{if(B)B.count++;return[]}}function fn(A){return Array.from(A,(B)=>{let Z=B.charCodeAt(0);if(Z<=31||Z>=127&&Z<=159)return`\\x${Z.toString(16).padStart(2,"0")}`;return B}).join("")}function Uf(A,B){let Z=ae(A),Q=pn({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},B);if(An(Q.errors))return null;if(Q.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(Q.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let ee=Q.values.limit===void 0?20:oa(Q.values.limit);if(ee===null)return console.error("--limit must be a positive number"),null;let te=Q.values.since===void 0?Math.min(30,Z):oa(Q.values.since);if(te===null||te>Z)return console.error(`--since must be a positive number of days no greater than ${Z}`),null;let se={limit:ee,limitExplicit:Q.values.limit!==void 0,since:te,sinceExplicit:Q.values.since!==void 0,all:Q.flags.all,json:Q.flags.json,suspect:Q.flags.suspect,pruneLegacy:Q.flags.pruneLegacy,dryRun:Q.flags.dryRun,id:Q.values.id,agent:Q.values.agent,rule:Q.values.rule,session:Q.values.session,project:Q.values.project===void 0?void 0:Hf(Q.values.project)};if(se.id&&(se.agent!==void 0||se.rule!==void 0||se.session!==void 0||se.project!==void 0||se.suspect||se.sinceExplicit||se.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(se.pruneLegacy&&(se.id!==void 0||se.agent!==void 0||se.rule!==void 0||se.session!==void 0||se.project!==void 0||se.suspect||se.all||se.sinceExplicit||se.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(se.dryRun&&!se.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return se}async function aa(A,B,Z={}){let Q=Uf(A,B);if(!Q)return 1;let ee=Z.logsDir??G(A);if(Q.pruneLegacy)return Bf(ee,Q.json,Q.dryRun);if(!ee)return console.log(Q.json?"[]":Q.id?`No retained audit log entry found for id ${fn(Q.id)}.`:"No audit log entries found."),0;X(A,ee);let te={count:0},se=Kn(ee,te).flatMap((Ae)=>Ut(Ae,te).map((De)=>({entry:De,file:Ae})));if(te.count>0)console.error(`warning: ${te.count} audit log ${te.count===1?"source":"sources"} could not be read; these results are incomplete`);if(Q.id)return Kf(se,Q,Z.timeZone);let me=Date.now()-Q.since*24*60*60*1000,ye=se.filter((Ae)=>zf(Ae,Q,ee,me)),Re=Q.suspect?ra(ye.map((Ae)=>Ae.entry)):null,_e=(Re?ye.filter((Ae)=>Re.has(Ae.entry)):ye).sort((Ae,De)=>Date.parse(De.entry.ts)-Date.parse(Ae.entry.ts)).slice(0,Q.limit);if(Q.json)return console.log(JSON.stringify(_e.map((Ae)=>Ae.entry),null,2)),0;if(_e.length===0)return console.log("No audit log entries found."),0;for(let Ae of _e)console.log(Yf(Ae.entry,Z.timeZone));return 0}function Bf(A,B,Z){let Q=A?qf(A).map((me)=>jf(A,me)):[];if(Z)return Gf(Q,B);let ee=[],te=0,se=0;for(let me of Q){let ye=sa(me,{throwIfNoEntry:!1})?.size??0,Re=Vf(me);if(Re){ee.push(`${ia(me)}: ${Re}`);continue}te++,se+=ye}if(B)return console.log(JSON.stringify({removedFiles:te,removedBytes:se,failedFiles:ee.length})),ee.length===0?0:1;console.log(te===0&&ee.length===0?"No legacy audit log files found.":`Removed ${te} legacy audit log ${te===1?"file":"files"} (${la(se)}).`);for(let me of ee)console.error(`Could not remove ${fn(me)}`);if(console.log("Nested v2 audit logs were not changed."),te>0)console.log("This deletion cannot be undone.");return ee.length===0?0:1}function Gf(A,B){let Z=A.reduce((Q,ee)=>Q+(sa(ee,{throwIfNoEntry:!1})?.size??0),0);if(B)return console.log(JSON.stringify({dryRun:!0,files:A.length,bytes:Z})),0;if(console.log(A.length===0?"No legacy audit log files found.":`Would remove ${A.length} legacy audit log ${A.length===1?"file":"files"} (${la(Z)}).`),console.log("Nested v2 audit logs are not included."),A.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function qf(A){try{return $f(A,{withFileTypes:!0}).filter((B)=>B.isFile()&&B.name.endsWith(".jsonl")).map((B)=>B.name)}catch{return[]}}function Vf(A){try{return Df(A),null}catch(B){return B instanceof Error?B.message:String(B)}}function la(A){let B=["B","KiB","MiB","GiB"],Z=Math.min(Math.floor(Math.log2(Math.max(A,1))/10),B.length-1);return`${Math.round(A/1024**Z*10)/10} ${B[Z]}`}function Kf(A,B,Z){let Q=A.filter((te)=>te.entry.id===B.id);if(Q.length>1)return console.error(`Multiple audit log entries found for id ${fn(B.id??"")}.`),1;if(B.json)return console.log(JSON.stringify(Q.map((te)=>te.entry),null,2)),0;let ee=Q[0];if(!ee)return console.log(`No retained audit log entry found for id ${fn(B.id??"")}.`),0;return console.log(Zf(ee.entry,Z)),0}function zf(A,B,Z,Q){if(!B.all&&A.entry.decision==="allow")return!1;if(Date.parse(A.entry.ts)<Q)return!1;if(B.agent!==void 0&&A.entry.agent!==B.agent)return!1;if(B.rule!==void 0&&A.entry.ruleId!==B.rule)return!1;if(B.session!==void 0&&!Jf(A,Z,B.session))return!1;if(B.project!==void 0&&!Wf(A.entry.cwd,B.project))return!1;return!0}function Jf(A,B,Z){if(A.entry.sessionId===Z)return!0;return Nf(A.file)===B&&ia(A.file,".jsonl")===Z}function Wf(A,B){if(!A)return!1;let Z=Ff(B,A);return Z!==".."&&!Z.startsWith(`..${Mf}`)&&!Lf(Z)}function Yf(A,B){let Z=fn(A.id??"-"),Q=fn(A.decision??"deny"),ee=A.cwd?`  [${fn(A.cwd)}]`:"",te=A.segment||A.command,se=te===A.command?"":"↳ ",me=te.length>50?`${te.slice(0,50)}…`:te;return`${Z.padEnd(16)}  ${fn(ca(A.ts,B))}  ${Q.padEnd(5)}  ${fn(A.agent??"-").padEnd(15)}  ${fn(A.ruleId??"-").padEnd(20)}  ${se}${fn(me)}${ee}`}function Zf(A,B){let Z=(ee)=>fn(ee===void 0||ee===null||ee===""?"-":ee),Q=A.shape?`${A.agent??"-"} (shape: ${A.shape})`:A.agent??"-";return[`id:        ${Z(A.id)}`,`ts:        ${Z(ca(A.ts,B))}`,`decision:  ${Z(A.decision)}`,`agent:     ${Z(Q)}`,`level:     ${Z(A.level)}`,`tool:      ${Z(A.toolName)}`,`rule:      ${Z(A.ruleId)}`,`intent:    ${Z(A.intent)}`,`stage:     ${Z(A.failureStage)}`,`error:     ${Z(A.errorCode)}`,`session:   ${Z(A.sessionId)}`,`cwd:       ${Z(A.cwd)}`,`version:   ${Z(A.v)}`,`truncated: ${Z(A.truncated===!0?"yes":void 0)}`,`reason:    ${Z(A.reason)}`,`command:   ${Z(A.command)}`,`segment:   ${Z(A.segment)}`].join(`
`)}function ca(A,B){let Z=new Date(A);if(Number.isNaN(Z.getTime()))return A;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:B}).format(Z)}function oa(A){let B=Number(A);return Number.isFinite(B)&&B>0?B:null}var da={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var ua={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"--shell",argument:"<auto|posix|powershell>",description:"Parse the command as this shell (default: auto)"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"',"cc-safety-net explain --shell posix 'rmdir /s /q d:\\'"]};var pa={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var ar=["npx","--offline","--no-install","@deepseek-ai/dsh","--version"],fa=["cursor-agent","--version"],ma=[{id:"antigravity-cli",displayName:"Antigravity CLI",runtime:{flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--agy-cli",artifactKind:"plugin",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",runtime:{displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",runtime:{flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",runtime:{flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",runtime:{flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",runtime:{flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",runtime:{flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",runtime:{flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",install:{flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",install:{flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",install:{flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",runtime:{flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"deepseek-harness",displayName:"DeepSeek Harness",install:{flag:"--deepseek-harness",artifactKind:"package",probeCommand:ar}},{id:"devin",displayName:"Devin CLI",runtime:{flags:["-dv","--devin"],description:"Run as Devin CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--devin",artifactKind:"hook config",probeCommand:["devin","--version"]}},{id:"droid",displayName:"Factory Droid",runtime:{flags:["-fd","--droid"],description:"Run as Factory Droid PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--droid",artifactKind:"hook config",probeCommand:["droid","--version"]}},{id:"amp",displayName:"Amp Code",install:{flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],es=ma.slice().sort((A,B)=>A.displayName.localeCompare(B.displayName,"en")),Nr=es.map((A)=>A.id).sort((A,B)=>Number(B==="claude-code")-Number(A==="claude-code")),lr=es.filter((A)=>("runtime"in A)).map((A)=>({id:A.id,displayName:"displayName"in A.runtime?A.runtime.displayName:A.displayName,flags:A.runtime.flags,legacyFlags:"legacyFlags"in A.runtime?A.runtime.legacyFlags:[],description:A.runtime.description,legacyTopLevelFlags:A.runtime.legacyTopLevelFlags})),Cn=es.map((A)=>({id:A.id,...A.install})),Xf=Object.fromEntries(ma.map((A)=>[A.id,A.displayName]));function ln(A){return Xf[A]}var Qf=lr.map((A)=>({flags:A.flags.join(", "),description:A.description})),em=lr.flatMap((A)=>A.flags.map((B)=>`cc-safety-net hook ${B}`)),ga={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Qf,{flags:"-h, --help",description:"Show this help"}],examples:em};var ha={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...Cn.map((A)=>({flags:A.flag,description:`Install ${ln(A.id)} ${A.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...Cn.map((A)=>`cc-safety-net install ${A.flag}`)]},ya={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...Cn.map((A)=>({flags:A.flag,description:`Uninstall ${ln(A.id)} ${A.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...Cn.map((A)=>`cc-safety-net uninstall ${A.flag}`)]},va={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var ba={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var Lr={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var ns=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],ts=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],Bt={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"tool add <name...> [--cwd-arg <name> | --no-cwd-arg] [--project]",description:"Analyze community shell tools (user scope by default)"},{usage:"tool remove <name...> [--project]",description:"Stop analyzing declared tools"},{usage:"tool list",description:"List declared command tools in both scopes"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},{flags:"--project",description:"Use project-scope rule config with rule tool"},{flags:"--cwd-arg",argument:"<name>",description:"Name the working-directory argument with rule tool add"},{flags:"--no-cwd-arg",description:"Read no working-directory argument with rule tool add, for a remote tool"},...ns.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk","cc-safety-net rule tool add ops_bash","cc-safety-net rule tool add ops_run_background --cwd-arg cwd --project","cc-safety-net rule tool add phone_shell --no-cwd-arg",...ts,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var wa={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var ka={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var jr=[wa,da,ba,ua,Bt,Lr,ha,va,ya,ga,pa,ka];function nm(A){return A.aliases??[]}function Fr(A){let B=A.toLowerCase();return jr.find((Z)=>Z.name.toLowerCase()===B||nm(Z).some((Q)=>Q.toLowerCase()===B))}import{existsSync as My}from"node:fs";import{basename as tm}from"node:path";function Hr(A,B=7,Z=G(A)){let Q=Date.now()-B*24*60*60*1000,ee=[],te=new Set,se=0,me,ye,Re,_e;if(Z)X(A,Z);let Ae={count:0},De=Z?Kn(Z,Ae):[];for(let Oe of De)for(let Le of Ut(Oe,Ae)){if(Le.decision==="allow")continue;let je=new Date(Le.ts).getTime();if(je>=Q){if(se++,te.add(Le.sessionId??tm(Oe,".jsonl")),ye===void 0||je<=ye)me=Le.ts,ye=je;if(_e===void 0||je>_e)Re=Le.ts,_e=je;rm(ee,Le,je)}}let Ne=ee.map((Oe)=>({timestamp:Oe.ts,command:Oe.command,reason:Oe.reason,relativeTime:ta(new Date(Oe.ts))}));return{totalBlocked:se,sessionCount:te.size,recentEntries:Ne,oldestEntry:me,newestEntry:Re,unreadable:Ae.count}}function rm(A,B,Z){let Q=A.findIndex((ee)=>Z>new Date(ee.ts).getTime());if(Q===-1){if(A.length<3)A.push(B);return}if(A.splice(Q,0,B),A.length>3)A.pop()}import{dirname as gm}from"node:path";import{dirname as om,join as sm,resolve as im}from"node:path";var am="config.json";function hn(A,B,Z,Q){v(lm(A),`${JSON.stringify(B,null,2)}
`,Z,Q)}function lm(A){return typeof A==="string"?ce(A):A}function os(A){return{errors:pe(dm(A),": "," "),ruleNames:new Set(Ke(A).map((B)=>B.toLowerCase()))}}var cm="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",Ca="must match pattern (letters, numbers, hyphens, underscores)";function dm(A){if(!xa(A))return[e([],"Config must be an object")];return[...A.version===1?[]:[e(["version"],"must be 1")],...um(A.rules)]}function um(A){if(A===void 0)return[];if(!Array.isArray(A))return[e(["rules"],"must be an array")];return[...A.flatMap((B,Z)=>xa(B)?pm(B,["rules",Z]):[e(["rules",Z],"must be an object")]),...ze(A)]}function pm(A,B){return[...rs(A.name,[...B,"name"],"required string",m,cm),...rs(A.command,[...B,"command"],"required string",_,Ca),...A.subcommand===void 0?[]:rs(A.subcommand,[...B,"subcommand"],"must be a string if provided",_,Ca),...fm(A.block_args,[...B,"block_args"]),...mm(A.reason,[...B,"reason"]),...A.intent===void 0||$e(A.intent)?[]:[e([...B,"intent"],Me)]]}function rs(A,B,Z,Q,ee){if(typeof A!=="string")return[e(B,Z)];return Q.test(A)?[]:[e(B,ee)]}function fm(A,B){if(!Array.isArray(A))return[e(B,"required array")];if(A.length===0)return[e(B,"must have at least one element")];return A.flatMap((Z,Q)=>{if(typeof Z!=="string")return[e([...B,Q],"must be a string")];return Z===""?[e([...B,Q],"must not be empty")]:[]})}function mm(A,B){if(typeof A!=="string")return[e(B,"required string")];if(A==="")return[e(B,"must not be empty")];return A.length>L?[e(B,`must be at most ${L} characters`)]:[]}function xa(A){return!!A&&typeof A==="object"&&!Array.isArray(A)}function ss(A){let B=Sa(A);if(!B.ok)return B.result;return os(B.parsed)}function Sa(A){let B=[],Z=new Set;try{let Q=typeof A==="string"?ce(A):A,ee=r(Q);if(ee===null)return B.push(`File not found: ${Q.path}`),{ok:!1,result:{errors:B,ruleNames:Z}};if(!ee.trim())return B.push("Config file is empty"),{ok:!1,result:{errors:B,ruleNames:Z}};return{ok:!0,parsed:JSON.parse(ee)}}catch(Q){if(Q instanceof o)return B.push(Q.message),{ok:!1,result:{errors:B,ruleNames:Z}};let ee=Q instanceof Error?Q.message:String(Q);return B.push(Q instanceof SyntaxError?"Invalid JSON":ee),{ok:!1,result:{errors:B,ruleNames:Z}}}}function Gt(A){return im(A,".safety-net.json")}function Fn(A){let B=Sa(A);if(!B.ok)return B.result;let Z=vt(B.parsed);return{errors:Z.errors,ruleNames:Z.sources}}function qt(A,B={}){return sm(om(ue(A,B)),am)}function Pa(A,B,Z){let Q;try{if(r(B)===null)return{path:A,exists:!1,valid:!1,ruleCount:0};Q=Fn(B),Q.errors.push(...K(A,Z))}catch(ee){if(!(ee instanceof o))throw ee;Q={errors:[ee.message],ruleNames:new Set}}return{path:A,exists:!0,valid:Q.errors.length===0,ruleCount:Q.ruleNames.size,...Q.errors.length>0?{errors:Q.errors}:{}}}function hm(A,B){return{source:B,name:A.name,command:A.command,subcommand:A.subcommand,blockArgs:[...A.block_args],reason:A.reason}}function Ra(A,B){let Z=V(A),Q=O(B),ee=gm(Z),te=q(A,{cwd:B,userConfigPath:Z,projectConfigPath:Q,userConfigDir:ee}),se=re(A,{cwd:B,userConfigPath:Z,projectConfigPath:Q,userConfigDir:ee}),me=new Map(te.rulebooks.flatMap((ye)=>ye.rules.map((Re)=>[Re,ye.source])));return{userConfig:Pa(Z,se.userConfigTarget,se.userScope),projectConfig:Pa(Q,se.projectConfigTarget,se.projectScope),effectiveRules:te.rules.map((ye)=>hm(ye,me.get(ye.name)??"project"))}}var ym=[{flag:n.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:n.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:n.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:n.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:n.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:n.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:n.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:n.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"},{flag:n.projectTightenOnly,description:"Ignore project policy settings that weaken the user policy",defaultBehavior:"off"}];function Ea(A){return[...ym.map((B)=>({name:B.flag.name,value:ve(B.flag,A.env),isSet:Nt(B.flag,A.env),legacyName:B.flag.legacyName,legacyValue:B.flag.legacyName?A.env.get(B.flag.legacyName):void 0,legacyIsSet:B.flag.legacyName?A.env.get(B.flag.legacyName)!==void 0:void 0,description:B.description,defaultBehavior:B.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:A.env.get("CC_SAFETY_NET_HOME"),isSet:A.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var _a={error:0,warning:1,info:2},vm=["policy","config","audit"];function bm(A){return A.map((B)=>{if(B==="ownership")return"is not owned by the current user";if(B==="permissions")return"has unsafe permissions";if(B==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var wm=[{derive:(A)=>A.hooks.length>0&&A.hooks.every((B)=>!B.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(A)=>A.hooks.filter((B)=>B.inspectionStatus==="failed").map((B)=>{let Z=ln(B.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${Z} inspection failed`,detail:`Doctor could not verify the ${Z} integration configuration.`,fixHint:`Correct the reported ${Z} configuration error, then run \`cc-safety-net doctor\` again.`,integration:B.platform}})},{derive:(A)=>A.userConfig.exists&&!A.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:A.userConfig.path}]:[]},{derive:(A)=>A.projectConfig.exists&&!A.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:A.projectConfig.path}]:[]},{derive:(A)=>A.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${A.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(A)=>A.v2Leftovers&&A.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${A.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(A)=>A.legacyConfigs&&A.legacyConfigs.length>0?[{checkId:"config.legacy-ignored",severity:"warning",title:"Legacy inline rule configs are ignored",detail:`CC Safety Net no longer loads these files, so their rules enforce nothing: ${A.legacyConfigs.join(", ")}.`,fixHint:"Run `cc-safety-net rule migrate` to convert them (add `--cleanup` to delete each file once it is converted), then rerun doctor."}]:[]},{derive:(A)=>{let B=A.environment.find((Z)=>Z.name==="CC_SAFETY_NET_AUDIT_SCOPE");return gt(B?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...vm.map((A)=>({derive:(B)=>B.posture.directories.filter((Z)=>Z.kind===A&&Z.status==="unsafe").map((Z)=>({checkId:`posture.${A}-directory-unsafe`,severity:"error",title:`${A[0]?.toUpperCase()}${A.slice(1)} directory is unsafe`,detail:`The ${A} directory ${bm(Z.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...Z.path?{path:Z.path}:{}}))})),{derive:(A)=>{let B=[...A.effectiveSafety.weakenedRuleOverrides].sort();return B.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${B.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${B.join(", ")}.`}]:[]}}];function Ta(A){return wm.flatMap((B,Z)=>B.derive(A).map((Q,ee)=>({finding:Q,catalogOrder:Z,occurrence:ee}))).sort((B,Z)=>_a[B.finding.severity]-_a[Z.finding.severity]||B.catalogOrder-Z.catalogOrder||B.occurrence-Z.occurrence).map((B)=>B.finding)}function In(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var km=(A)=>In()?`\x1B[32m${A}\x1B[0m`:A,Cm=(A)=>In()?`\x1B[33m${A}\x1B[0m`:A,xm=(A)=>In()?`\x1B[34m${A}\x1B[0m`:A,Sm=(A)=>In()?`\x1B[36m${A}\x1B[0m`:A,Pm=(A)=>In()?`\x1B[31m${A}\x1B[0m`:A,Rm=(A)=>In()?`\x1B[2m${A}\x1B[0m`:A,Em=(A)=>In()?`\x1B[1m${A}\x1B[0m`:A,We={green:km,yellow:Cm,blue:xm,cyan:Sm,red:Pm,dim:Rm,bold:Em},_m="\x1B[0m",Tm=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function Am(A){let B=A;return()=>(B=(B*1664525+1013904223)%4294967296,B/4294967296)}function Im(A){let B=[...Tm],Z=Am(A);for(let Q=B.length-1;Q>0;Q--){let ee=Math.floor(Z()*(Q+1)),te=B[Q];B[Q]=B[ee],B[ee]=te}return B}function Om(A,B=0){if(!In())return"";let Z=Im(B);return`\x1B[38;5;${Z[A%Z.length]}m`}function Aa(A,B,Z=0){if(!In())return`"${A}"`;return`${Om(B,Z)}"${A}"${_m}`}function Mr(A){return A==="default"?"built-in default":`${A} policy`}var $m=new RegExp("\x1B\\[[0-9;]*m","g"),is=(A)=>A.replace($m,"").length;function zn(A){let B=(A.headers??A.rows[0]??[]).map((se,me)=>{let ye=Math.max(...A.rows.map((Re)=>is(Re[me]??"")));return Math.max(is(se),ye)}),Z=(se,me)=>se+" ".repeat(Math.max(0,me-is(se))),Q=(se,me)=>me[0]+B.map((ye)=>se.repeat(ye+2)).join(me[1])+me[2],ee=(se)=>`│ ${se.map((me,ye)=>Z(me,B[ye]??0)).join(" │ ")} │`,te=A.headers?[`   ${ee(A.headers)}`,`   ${Q("─",["├","┼","┤"])}`]:[];return[`   ${Q("─",["┌","┬","┐"])}`,...te,...A.rows.map((se)=>`   ${ee(se)}`),`   ${Q("─",["└","┴","┘"])}`].join(`
`)}function Ia(A){let B=[];B.push("Hook Integration"),B.push(Dm(A));let Z=[],Q=[];for(let ee of A){let te=ln(ee.platform);if(ee.errors&&ee.errors.length>0)for(let se of ee.errors)if(ee.configured)Z.push({platform:te,message:se});else Q.push({platform:te,message:se})}for(let ee of Z)B.push(`   Warning (${ee.platform}): ${ee.message}`);for(let ee of Q)B.push(We.red(`   Error (${ee.platform}): ${ee.message}`));return B.join(`
`)}function Dm(A){let B=["Platform","Discovery","Configuration","Inspection"],Z=A.map((Q)=>{let ee=ln(Q.platform);if(Q.inspectionStatus==="not-inspected"){let ye=We.dim("Not inspected");return[ee,ye,ye,ye]}let te=Q.detected?We.green("Detected"):Q.inspectionStatus==="failed"?We.red("Unknown"):We.dim("Not detected"),se=Q.configured?We.green("Configured"):Q.detected?We.yellow("Not configured"):Q.inspectionStatus==="failed"?We.red("Unknown"):We.dim("Not applicable"),me=Q.inspectionStatus==="verified"?We.green("Verified"):Q.inspectionStatus==="failed"?We.red("Failed"):We.dim("Not applicable");return[ee,te,se,me]});return zn({headers:B,rows:Z})}function Oa(A){let Z=["Guard Engine Verification",`   Synthetic self-test: ${A.failed>0?We.red(`${A.passed}/${A.total} FAIL`):We.green(`${A.passed}/${A.total} passed`)}`],Q=A.results.filter((ee)=>!ee.passed);if(Q.length>0){Z.push(""),Z.push(We.red("   Failures:"));for(let ee of Q)Z.push(We.red(`   • ${ee.description}`)),Z.push(We.red(`     expected ${ee.expected}, got ${ee.actual}`))}return Z.join(`
`)}function Nm(A){if(A.length===0)return"   (no custom rules)";let B=["Source","Name","Command","Block Args"],Z=A.map((Q)=>[Q.source,Q.name,Q.subcommand?`${Q.command} ${Q.subcommand}`:Q.command,Q.blockArgs.join(", ")]);return zn({headers:B,rows:Z})}function $a(A){let B=[];if(B.push("Configuration"),B.push(Lm(A.userConfig,A.projectConfig)),B.push(""),A.effectiveRules.length>0)B.push(`   Effective rules (${A.effectiveRules.length} total):`),B.push(Nm(A.effectiveRules));else B.push("   Effective rules: (none - using built-in rules only)");return B.join(`
`)}function Lm(A,B){let Z=["Scope","Status"],Q=(te)=>{if(!te.exists)return We.dim("N/A");if(!te.valid)return We.red(`Invalid (${te.errors?.[0]??"unknown error"})`);return We.green("Configured")},ee=[["User",Q(A)],["Project",Q(B)]];return zn({headers:Z,rows:ee})}function Da(A){let B=[];return B.push("Environment"),B.push(jm(A)),B.join(`
`)}function Na(A){let B=A.effectiveSafety.policyScopes,Z=["Effective Safety",`   Selected preset: ${A.effectiveSafety.selectedPreset}${B?` (${Mr(B.levelScope)})`:""}`,`   Effective: ${A.effectiveSafety.level}`],Q=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[ee,te]of Q){let se=A.effectiveSafety.capabilities[ee],me=se.enabled?We.green("ON"):We.dim("OFF"),ye=se.sources.length>0?` (${se.sources.join(", ")})`:"";Z.push(`   ${te}: ${me} via ${se.source}${ye}`)}if(B&&B.weakenings.length>0){Z.push(`   Project policy deltas${B.weakeningsIgnored?" (ignored)":""}:`);for(let ee of B.weakenings)Z.push(`      ${ee}`)}Z.push(`   Stored rule customizations: ${A.effectiveSafety.ruleCounts.stored}`),Z.push(`   Effective rule customizations: ${A.effectiveSafety.ruleCounts.effective}`);for(let[ee,te]of Object.entries(A.effectiveSafety.ruleOverrides))Z.push(`   ${ee}: ${te}`);return Z.join(`
`)}function La(A){let B=["Findings"];if(A.length===0)return B.push("   No findings from inspected doctor facts."),B.join(`
`);for(let Z of A){let Q=`[${Z.severity.toUpperCase()}] ${Z.checkId}: ${fn(Z.title)}`,ee=Z.severity==="error"?We.red:Z.severity==="warning"?We.yellow:We.blue;if(B.push(`   ${ee(Q)}`),B.push(`      ${fn(Z.detail)}`),Z.path)B.push(`      Path: ${fn(Z.path)}`);if(Z.fixHint)B.push(`      Fix: ${fn(Z.fixHint)}`)}return B.join(`
`)}function jm(A){let B=["Variable","Status","Legacy"],Z=A.map((Q)=>{let ee=Q.isSet?We.green("✓"):We.dim("✗"),te=Q.legacyName&&Q.legacyIsSet?`${Q.legacyName} ${We.green("✓")}`:Q.legacyName??"";return[Q.name,ee,te]});return zn({headers:B,rows:Z})}function ja(A){let B=[];if(A.totalBlocked===0)B.push("Recent Activity"),B.push("   No blocked commands in the last 7 days"),B.push("   Tip: This is normal for new installations");else B.push(`Recent Activity · last 7 days (${A.totalBlocked} blocked / ${A.sessionCount} sessions)`),B.push(Fm(A.recentEntries));if(A.unreadable>0)B.push(`   Warning: ${A.unreadable} audit log ${A.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return B.join(`
`)}function Fm(A){let B=["Time","Command"],Z=A.map((Q)=>{let ee=fn(Q.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),te=ee.length>40?`${ee.slice(0,37)}...`:ee;return[Q.relativeTime,te]});return zn({headers:B,rows:Z})}function Fa(A){let B=[];if(B.push("Update Check"),A.latestVersion===null&&!A.error)return B.push(Ur([["Status",We.dim("Skipped")],["Installed",A.currentVersion]])),B.join(`
`);if(A.error)return B.push(Ur([["Status",`${We.yellow("⚠")} Error`],["Installed",A.currentVersion],["Error",We.dim(A.error)]])),B.join(`
`);if(A.updateAvailable)return B.push(Ur([["Status",`${We.yellow("⚠")} Update Available`],["Current",A.currentVersion],["Latest",We.green(A.latestVersion??"")]])),B.push(""),B.push("   Run: bunx cc-safety-net@latest doctor"),B.push("   Or:  npx cc-safety-net@latest doctor"),B.join(`
`);return B.push(Ur([["Status",`${We.green("✓")} Up to date`],["Version",A.currentVersion]])),B.join(`
`)}function Ur(A){return zn({rows:A})}function Ha(A){let B=[];return B.push("System Info"),B.push(Hm(A)),B.join(`
`)}function Hm(A){let B=["Component","Version"],Z=(te)=>{if(te===null)return We.dim("not found");return te},ee=[{label:"cc-safety-net",value:A.version},...Nr.map((te)=>({label:ln(te),value:A.versions[te]??null})),{label:"Node.js",value:A.nodeVersion},{label:"npm",value:A.npmVersion},{label:"Bun",value:A.bunVersion},{label:"Platform",value:A.platform}].map((te)=>[te.label,Z(te.value)]);return zn({headers:B,rows:ee})}function Ma(A){if(A.findings.length===0)return We.green(`
No findings from inspected doctor facts.`);let B={error:A.findings.filter((te)=>te.severity==="error").length,warning:A.findings.filter((te)=>te.severity==="warning").length,info:A.findings.filter((te)=>te.severity==="info").length},Z=["error","warning","info"].filter((te)=>B[te]>0).map((te)=>`${B[te]} ${te}`),Q=A.findings.length===1?"finding":"findings",ee=`
${A.findings.length} ${Q}: ${Z.join(", ")}.`;if(B.error>0)return We.red(ee);if(B.warning>0)return We.yellow(ee);return We.blue(ee)}import{lstatSync as Mm}from"node:fs";import{dirname as as}from"node:path";function ls(A,B){try{let Z=Mm(B);if(Z.isSymbolicLink())return{kind:A,path:B,status:"unsafe",issues:["symlink"]};if(!Z.isDirectory())return{kind:A,path:B,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:A,path:B,status:"unknown",issues:[]};let Q=[...Z.uid!==process.getuid()?["ownership"]:[],...(Z.mode&18)!==0?["permissions"]:[]];return{kind:A,path:B,status:Q.length>0?"unsafe":"safe",issues:Q}}catch(Z){if(typeof Z==="object"&&Z!==null&&"code"in Z&&Z.code==="ENOENT")return{kind:A,path:B,status:"not-applicable",issues:[]};return{kind:A,path:B,status:"unknown",issues:[]}}}function Ua(A,B){let Z=G(A);return{directories:[ls("policy",as(as(B))),ls("config",as(B)),...Z?[ls("audit",Z)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as Um}from"node:child_process";import{existsSync as Ba,statSync as Bm}from"node:fs";import{delimiter as Va,extname as Gm,join as Ka}from"node:path";import{stripVTControlCharacters as Ga}from"node:util";var za="2.8.3",qm=5000,Vm="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function dn(){return za}function cs(A,B){let Z=A[B];if(Z)return Z;let Q=Object.keys(A).find((ee)=>ee.toLowerCase()===B.toLowerCase()&&!!A[ee]);return Q?A[Q]:Z}function Km(A){return(cs(A,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((B)=>B.length>0)}function Ja(A,B){let Z=Gm(A)?[A]:[...Km(B).map((Q)=>`${A}${Q}`),A];if(A.includes("/")||A.includes("\\"))return Z.find((Q)=>Ba(Q));return(cs(B,"PATH")??"").split(Va).flatMap((Q)=>Z.map((ee)=>Ka(Q,ee))).find((Q)=>Ba(Q))}function Wa(A){return A[Vm]==="win32"?"win32":process.platform}var Gr=(A,B)=>(B.PATH??"").split(Va).some((Z)=>{if(Z.length===0)return!1;try{let Q=Bm(Ka(Z,A));return Q.isFile()&&(Q.mode&73)!==0}catch{return!1}});function Ya(A,B){return Wa(B)==="win32"?Ja(A,B)!==void 0:Gr(A,B)}function qa(A){if(!/[\s"&|<>^]/.test(A))return A;return`"${A.replace(/"/g,'""')}"`}function Jn(A,B){let[Z,...Q]=A;if(!Z||Wa(B)!=="win32")return{cmd:Z??"",args:Q};let ee=Ja(Z,B)??Z;if(!/\.(?:bat|cmd)$/i.test(ee))return{cmd:ee,args:Q};return{cmd:cs(B,"COMSPEC")??"cmd.exe",args:["/d","/s","/c",`"${["call",qa(ee),...Q.map(qa)].join(" ")}"`],windowsVerbatimArguments:!0}}var Vt=async(A,B=qm)=>{let Z=await zm(A,{timeoutMs:B});if(Z.code!==0)return null;return Ga(Z.stdout).trim()||Ga(Z.stderr).trim()||null};function zm(A,B){let[Z,...Q]=A;if(!Z)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((ee)=>{try{let te=Jn([Z,...Q],process.env),se=Um(te.cmd,te.args,{stdio:["ignore","pipe","pipe"],windowsVerbatimArguments:te.windowsVerbatimArguments}),me=!1,ye="",Re="";se.stdout.on("data",(De)=>{ye+=De.toString()}),se.stderr.on("data",(De)=>{Re+=De.toString()});let _e=(De)=>{if(me)return;me=!0,clearTimeout(Ae),ee(De)},Ae=setTimeout(()=>{se.kill(),_e({code:null,stdout:ye,stderr:Re})},B.timeoutMs);se.on("close",(De)=>{_e({code:De,stdout:ye,stderr:Re})}),se.on("error",()=>{_e({code:null,stdout:ye,stderr:Re})})}catch{ee({code:null,stdout:"",stderr:""})}})}function Br(A){if(!A)return null;let B=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(A);if(B)return B[1]??null;let Z=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(A);if(Z)return Z[1]??null;return A.split(`
`)[0]?.trim()||null}async function qr(A,B=Vt,Z=process.cwd()){let Q=Promise.all(Cn.map(async(Ae)=>[Ae.id,Br(await B([...Ae.probeCommand]))])),[ee,te,se,me,ye,Re,_e]=await Promise.all([Q,Q.then(async(Ae)=>{let De=Ae.find(([Le])=>Le==="opencode")?.[1];if(!De?.startsWith("2.")||!A(De))return null;let Ne=["--param",`location[directory]=${Z}`],Oe=["opencode","api","integration.list",...Ne];return await B(Oe,30000),B(["opencode","api","plugin.list",...Ne],30000)}),B(["codex","plugin","list","--marketplace","cc-marketplace"],30000),B(["amp","plugins","list"],30000),B(["node","--version"]),B(["npm","--version"]),B(["bun","--version"])]);return{version:za,versions:Object.fromEntries(ee),codexPluginListOutput:se,ampPluginListOutput:me,openCodePluginListOutput:te,nodeVersion:Br(ye),npmVersion:Br(Re),bunVersion:Br(_e),platform:`${process.platform} ${process.arch}`}}function ds(A,B){if(B==="dev")return!1;let Z=A.split(".").map(Number),Q=B.split(".").map(Number),[ee=0,te=0,se=0]=Z,[me=0,ye=0,Re=0]=Q;if(ee!==me)return ee>me;if(te!==ye)return te>ye;return se>Re}async function Hn(){let A=dn(),B=new AbortController,Z=setTimeout(()=>B.abort(),3000);try{let Q=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:B.signal});if(!Q.ok)return{currentVersion:A,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${Q.status}`};let ee=await Q.json(),te=ds(ee.version,A);return{currentVersion:A,latestVersion:ee.version,updateAvailable:te}}catch(Q){return{currentVersion:A,latestVersion:null,updateAvailable:!1,error:Q instanceof Error?Q.message:"Network error"}}finally{clearTimeout(Z)}}import*as ol from"node:readline";var el=(A)=>`\x1B[${A}B`,Jm=(A)=>`\x1B[${A}A`;var Za=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Wm(A){return new Promise((B)=>setTimeout(B,A))}function Ym(A,B,Z){if(!Z)return B(A);if(Z.aborted)return Promise.resolve();return new Promise((Q,ee)=>{let te=()=>Z.removeEventListener("abort",se),se=()=>{te(),Q()};Z.addEventListener("abort",se,{once:!0}),B(A).then(()=>{te(),Q()},(me)=>{te(),ee(me)})})}function Vr(A){return Math.max(0,Math.min(1,A))}function Kt(A){return Math.max(0,Math.min(255,Math.round(A)))}function us(A){return A<=0.0031308?12.92*A:1.055*A**0.4166666666666667-0.055}function Zm(A,B,Z){let Q=Z*Math.PI/180,ee=B*Math.cos(Q),te=B*Math.sin(Q),se=(A+0.3963377774*ee+0.2158037573*te)**3,me=(A-0.1055613458*ee-0.0638541728*te)**3,ye=(A-0.0894841775*ee-1.291485548*te)**3;return{blue:Kt(us(Vr(-0.0041960863*se-0.7034186147*me+1.707614701*ye))*255),green:Kt(us(Vr(-1.2684380046*se+2.6097574011*me-0.3413193965*ye))*255),red:Kt(us(Vr(4.0767416621*se-3.3077115913*me+0.2309699292*ye))*255)}}function ps(A,B){let Z=(B*A*180/Math.PI%360+360)%360;return Zm(0.72,0.15,Z)}function nl(A,B=0.1){let Z=ps(B,A);return`\x1B[38;2;${Z.red};${Z.green};${Z.blue}m`}function Xm(A,B){return{blue:Kt(A.blue+(255-A.blue)*B),green:Kt(A.green+(255-A.green)*B),red:Kt(A.red+(255-A.red)*B)}}function tl(A,B,Z){let Q=Math.imul(A+2654435769,2246822507)^Math.imul(B+3266489909,668265263)^Math.imul(Z+374761393,2654435761),ee=Q^Q>>>15,te=Math.imul(ee,739982445),se=te^te>>>12,me=Math.imul(se,695872825);return((me^me>>>15)>>>0)/4294967296}function Qm(A,B,Z){let Q=Math.floor(tl(A,B,Z)*Za.length);return Za[Q]??"░"}function Xa(A){let B=Vr(A);return B*B*B*(B*(B*6-15)+10)}function eg(A){if(A.length===0)return"";let B=[],Z=!1,Q="";for(let ee of A){let te=`${ee.red};${ee.green};${ee.blue}`;if(ee.bold!==Z)B.push(ee.bold?"\x1B[1m":"\x1B[22m"),Z=ee.bold;if(te!==Q)B.push(`\x1B[38;2;${te}m`),Q=te;B.push(ee.character)}return`${B.join("")}\x1B[22m\x1B[39m`}function ng(A,B,Z,Q,ee){return A.map((te,se)=>({...ps(Z,Q+B+se/ee),bold:!1,character:te}))}function tg(A,B,Z,Q,ee,te,se,me){let ye=Math.max(1,Q*0.75),Re=Math.min(1,Z/ye),_e=ee*Xa(Re),Ae=Math.max(0,(Z-ye)/Math.max(1,Q-ye)),De=(1-Xa(Z/Q))*me*2,Ne=0.35*Math.max(0,1-Ae*2),Oe=Re>=1,Le=Math.min(A.length,Math.ceil(_e+2+1));return A.slice(0,Le).map((je,nn)=>{let Xe=ps(te,se+B+nn/me+De),rn=nn+tl(B,nn,7919)*2-1;if(rn>_e+2)return{...Xe,bold:!1,character:" "};let an=_e-rn,en=0.8*Math.exp(-(an*an)/12.5),on=Math.min(0.9,en+Ne),Sn=!Oe&&rn>_e-4;return{...Xm(Xe,on),bold:on>0.3,character:Sn?Qm(B,nn,Z):je}})}function Qa(A){return`\x1B[?2026h${A.map((B,Z)=>`\x1B8${Z>0?el(Z):""}${eg(B)}`).join("")}\x1B[?2026l`}async function fs(A,B={}){if(!A)return;let Z=B.output??process.stdout,Q=B.sleep??Wm,ee=B.seed??0,te=A.split(`
`).map((_e)=>Array.from(_e)),se=Math.max(...te.map((_e)=>_e.length)),me=12000*te.filter((_e)=>_e.length>0).length/40,ye=se>0?Math.max(1,Math.ceil(me/16.666666666666668)):0,Re=ye>0?me/ye:0;Z.write(`\x1B[?25l${te.length>1?`${`
`.repeat(te.length-1)}${Jm(te.length-1)}`:""}\x1B7`);try{for(let _e=1;_e<=ye;_e+=1){if(B.signal?.aborted)break;Z.write(Qa(te.map((Ae,De)=>tg(Ae,De,_e,ye,se,0.1,ee,3)))),await Ym(Re,Q,B.signal)}}finally{if(Z.write(Qa(te.map((_e,Ae)=>ng(_e,Ae,0.1,ee,3)))),Z.write("\x1B8"),te.length>1)Z.write(el(te.length-1));Z.write(`
\x1B[0m\x1B[?25h`)}}var rl=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function rg(A){return Boolean(A.isTTY)}async function cr(A={}){let B=A.output??process.stdout;if(!rg(B))return;let Z=A.input??process.stdin,Q={output:B,seed:A.seed??Math.random()*8192,sleep:A.sleep};if(!Z.isTTY||typeof Z.setRawMode!=="function"){await fs(rl,Q);return}let ee=new AbortController,te=Z.readableFlowing===!0,se=Z.isRaw===!0,me=!1,ye=(Re,_e)=>{if(_e.ctrl&&_e.name==="c")me=!0;if(me||_e.name==="return"||_e.name==="enter")ee.abort()};ol.emitKeypressEvents(Z),Z.on("keypress",ye),Z.setRawMode(!0),Z.resume();try{await fs(rl,{...Q,signal:ee.signal})}finally{if(Z.off("keypress",ye),Z.setRawMode(se),!te)Z.pause()}if(!me)return;if(A.onInterrupt){A.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as ag}from"node:crypto";import{existsSync as il}from"node:fs";import{dirname as Kr,join as al}from"node:path";import{dirname as sl,join as og}from"node:path";var sg="rule.lock";function ig(A){return og(sl(A),sg)}function gn(A,B){let Z=B.global?B.userConfigPath??V(A,B):B.projectConfigPath??O(B.cwd??process.cwd()),Q=B.global?ht(A,B):yt(Z,B.cwd??process.cwd()),ee=ig(Z);return{configDir:sl(Z),configPath:Z,lockPath:ee,filesystemScope:Q,configTarget:i(Q,Z),lockTarget:i(Q,ee)}}var lg="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",cg="cache",dg="rulebooks";function ll(A,B={}){let Z=gn(A,B),Q=i(Z.filesystemScope,dl(Z.configDir)),ee=r(Z.lockTarget);if(console.log(lg),ee===null&&!il(Q.path))return console.log(`No v2 lock or cache leftovers found in ${Kr(Z.configDir)}; nothing to migrate.`),0;let te=gg(ee),se=p(Z.configTarget);if(!se.config&&(r(Z.configTarget)!==null||te.size>0))return console.error(`Cannot migrate: the rules config in ${Kr(Z.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let me=se.config?.rules??[];for(let ye of me.flatMap((Re)=>ug(Re,te,Z,Q,B.global===!0)))console.log(ye);return z(Z.lockTarget),Lt(Q),console.log(`Removed the v2 lock and cache under ${Kr(Z.configDir)}.`),0}function cl(A,B){return[...new Set([{cwd:B},{cwd:B,global:!0}].flatMap((Z)=>{let Q=gn(A,Z);return[Q.lockPath,dl(Q.configDir)]}))].filter((Z)=>il(Z))}function ug(A,B,Z,Q,ee){if(!T(A))return[];let te=M(A).name,se=i(Z.filesystemScope,F(Z.configDir,te)),me=r(se);if(me!==null&&pg(me,te))return[];let ye=B.get(A),Re=ye?fg(ye,te,Q.path,Z.filesystemScope):null;if(Re===null)return[`Could not migrate ${A} from the v2 cache. Run \`cc-safety-net rule update ${A}${ee?" --global":""}\` to vendor it.`];if(v(se,Re),me!==null)return[`Restored ${A} from the v2 cache over an invalid file.`];return[`Vendored ${A} from the v2 cache.`]}function pg(A,B){let Z=ke(A);return!("problem"in Z)&&Z.rulebook.name===B}function fg(A,B,Z,Q){let ee=al(Z,dg,`${mg(A)}--${A.digest.replace("sha256:","").slice(0,12)}`,xe),te=r(i(Q,ee));if(te===null||vg(te)!==A.digest)return null;let se=ke(te);if("problem"in se||se.rulebook.name!==B)return null;return te}function dl(A){return al(Kr(A),cg)}function mg(A){return([A.owner,A.repo,A.display_ref,A.name].every((Q)=>typeof Q==="string"&&Q!=="")?`${A.owner}/${A.repo}#${A.display_ref}/${A.name}`:A.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function gg(A){let B=A===null?null:yg(A),Z=ul(B)&&Array.isArray(B.rulebooks)?B.rulebooks:[];return new Map(Z.filter(hg).map((Q)=>[Q.spec,Q]))}function hg(A){return ul(A)&&typeof A.spec==="string"&&typeof A.digest==="string"}function ul(A){return!!A&&typeof A==="object"}function yg(A){try{return JSON.parse(A)}catch{return null}}function vg(A){return`sha256:${ag("sha256").update(A).digest("hex")}`}var pl="\r\x1B[2K",bg="\x1B[?25l",wg="\x1B[39m",kg="\x1B[?25h",Cg=100,xg=0.55,Sg=80,fl=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function Pg(A){return new Promise((B)=>setTimeout(B,A))}async function zr(A,B={}){let Z=B.output??process.stdout;if(!Z.isTTY)return A;let Q=B.sleep??Pg,ee=!1,te=A.then((me)=>(ee=!0,me),(me)=>{throw ee=!0,me});if(await Promise.race([te.then(()=>!0),Q(Cg).then(()=>!1)]))return te;Z.write(bg);try{for(let me=0;!ee;me+=1)Z.write(`${pl}${nl(me*xg)}${fl[me%fl.length]}${wg} ${B.loadingMessage??"Loading…"}`),await Promise.race([te,Q(Sg)]);return await te}finally{Z.write(`${pl}${kg}`)}}async function dr(A,B,Z,Q={}){let ee=B();if(A)await Z();if(A&&ee.ready)await zr(ee.ready,Q);return ee.finish()}import{stripVTControlCharacters as Rg}from"node:util";var Jr="amp plugins list",Eg=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function ml(A){if(!A.ampPluginListOutput)return{platform:"amp",status:"n/a"};let B=Rg(A.ampPluginListOutput).split(`
`).map((Z)=>Eg.exec(Z)?.[1]).find((Z)=>Z!==void 0);if(!B)return{platform:"amp",status:"n/a"};if(B!=="active")return{platform:"amp",status:"disabled",method:Jr,configPath:Jr,errors:[`Amp personal plugin cc-safety-net is ${B}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:Jr,configPath:Jr}}import{existsSync as Dg,readFileSync as Ng}from"node:fs";import{join as hs}from"node:path";import{isAbsolute as pS,join as $g}from"node:path";function Xr(A){return $g(A,".gemini","config","hooks.json")}var hl=new Map([["run_command","auto"]]),yl="manage_task";var ur="cc-safety-net",Lg=/cc-safety-net(?:\.js)?\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function Qr(A){return hs(A,".gemini","config","plugins",ur)}function ys(A){let B=f(hs(A,".gemini","config","config.json"));return B.kind==="ok"&&B.value?.plugins?.[ur]?.enabled===!1}function jg(A){if(!A||typeof A!=="object"||Array.isArray(A))return[];return Object.values(A).flatMap((B)=>{if(!B||typeof B!=="object"||Array.isArray(B))return[];let Z=B,Q=Z.PreToolUse;if(!Array.isArray(Q))return[];return Q.flatMap((ee)=>{if(!ee||typeof ee!=="object"||Array.isArray(ee))return[];let te=ee.hooks;if(!Array.isArray(te))return[];return te.flatMap((se)=>{if(!se||typeof se!=="object"||Array.isArray(se))return[];let me=se.command;if(typeof me!=="string"||!Lg.test(me))return[];return[{command:me,enabled:Z.enabled!==!1}]})})})}function vl(A,B,Z){if(!Dg(A))return{platform:"antigravity-cli",status:"n/a",configPath:A};let Q;try{Q=jg(JSON.parse(Ng(A,"utf-8")))}catch(ee){return{platform:"antigravity-cli",status:"n/a",configPath:A,errors:[`Failed to parse Antigravity hooks config ${A}: ${ee instanceof Error?ee.message:String(ee)}`]}}if(Z&&Q.some((ee)=>ee.enabled))return{platform:"antigravity-cli",status:"configured",method:B,configPath:A};if(Q.length>0)return{platform:"antigravity-cli",status:"disabled",method:B,configPath:A};return{platform:"antigravity-cli",status:"n/a",configPath:A}}function bl(A){let B=A.environment.home,Z=[vl(hs(Qr(B),"hooks.json"),"plugin",!ys(B)),vl(Xr(B),"hook config",!0)];return Z.find((Q)=>Q.status==="configured")??Z.find((Q)=>Q.status==="disabled")??Z.find((Q)=>Q.errors!==void 0)??Z[1]}import{existsSync as Fg}from"node:fs";import{join as On}from"node:path";var eo="cc-safety-net@cc-marketplace";function no(A){return A.env.get("CLAUDE_CONFIG_DIR")||On(A.home,".claude")}function wl(A){return On(A.env.get("CLAUDE_CODE_PLUGIN_CACHE_DIR")||On(no(A),"plugins"),"installed_plugins.json")}function kl(A,B){let Z=t(t(A,"plugins"),B);return Array.isArray(Z)&&Z.length>0}function to(A,B){let Z=f(wl(A));return Z.kind==="ok"&&kl(Z.value,B)}function vs(A){return Cl(wl(A),On(no(A),"settings.json"))}function Cl(A,B){let Z=f(A);if(Z.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(Z.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!kl(Z.value,eo))return{platform:"claude-code",status:"n/a"};let Q=f(B);if(Q.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(Q.kind==="ok"&&t(t(Q.value,"enabledPlugins"),eo)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:B,errors:[`${eo} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:A}}function xl(A){let B=On(A.home,".claude"),Z=On(B,"plugins","installed_plugins.json");if(Cl(Z,On(B,"settings.json")).status!=="configured")return;let Q=f(Z),ee=Q.kind==="ok"?t(t(Q.value,"plugins"),eo):void 0,te=(Array.isArray(ee)?ee:[]).filter((Re)=>t(Re,"scope")==="user").map((Re)=>t(Re,"installPath")).find((Re)=>typeof Re==="string");if(!te)return;let se=On(te,".cursor-plugin","plugin.json"),me=f(se),ye=me.kind==="ok"?t(me.value,"hooks"):void 0;return typeof ye==="string"&&Fg(On(te,ye))?se:void 0}function Sl(A){return vs(A.environment)}var Pl="Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.";function Rl(A){if(!A.codexPluginListOutput)return{platform:"codex",status:"n/a"};let B=A.codexPluginListOutput.split(`
`).find((Z)=>Z.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!B)return{platform:"codex",status:"n/a"};if(!B.includes("installed,"))return{platform:"codex",status:"n/a"};if(!B.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex runs only trusted hooks, and doctor cannot check trust. Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."]}}import{existsSync as io,readdirSync as Hg,readFileSync as Mg}from"node:fs";import{join as yn}from"node:path";function mn(A){let B="",Z=0,Q=!1,ee=!1,te=-1;while(Z<A.length){let se=A[Z],me=A[Z+1];if(ee){B+=se,ee=!1,Z++;continue}if(se==='"'&&!Q){Q=!0,te=-1,B+=se,Z++;continue}if(se==='"'&&Q){Q=!1,B+=se,Z++;continue}if(se==="\\"&&Q){ee=!0,B+=se,Z++;continue}if(Q){B+=se,Z++;continue}if(se==="/"&&me==="/"){while(Z<A.length&&A[Z]!==`
`)Z++;continue}if(se==="/"&&me==="*"){Z+=2;while(Z<A.length-1){if(A[Z]==="*"&&A[Z+1]==="/"){Z+=2;break}Z++}continue}if(se===","){te=B.length,B+=se,Z++;continue}if(se==="}"||se==="]"){if(te!==-1){let ye=B.slice(te+1);if(/^\s*$/.test(ye))B=B.slice(0,te)+ye}te=-1,B+=se,Z++;continue}if(!/\s/.test(se))te=-1;B+=se,Z++}return B}function _l(A,B,Z){let Q=B+1,ee=!1;while(Q<A.length){if(ee){ee=!1,Q++;continue}if(A[Q]==="\\"){ee=!0,Q++;continue}if(A[Q]==='"')return Q+1;Q++}throw Error(Z)}function ws(A,B,Z){let Q=A[B],ee=Q==="["?"]":"}",te=0,se=B;while(se<A.length){let me=Z.skipComment?.(A,se)??se;if(me!==se){se=me;continue}if(A[se]==='"'){se=_l(A,se,Z.stringError);continue}if(A[se]===Q)te++;if(A[se]===ee){if(te--,te===0)return se}se++}throw Error(Z.bracketError)}function Tl(A,B){let Z=A.lastIndexOf(`
`,B)+1;return/^[ \t]*/.exec(A.slice(Z))?.[0]??""}function Al(A,B){let Z=B.end+(/^\s*/.exec(A.slice(B.end))?.[0].length??0);if(A[Z]===","){let se=A[Z+1]===`
`?Z+2:Z+1;return`${A.slice(0,B.start)}${A.slice(se)}`}let Q=A.slice(0,B.start).search(/\s*$/)-1;if(A[Q]!==",")return`${A.slice(0,B.start)}${A.slice(B.end)}`;let ee=A.lastIndexOf(`
`,Q-1),te=ee!==-1&&/^\s*$/.test(A.slice(ee+1,Q))?ee:Q;return`${A.slice(0,te)}${A.slice(B.end)}`}function bs(A,B){if(A.startsWith("//",B)){let Z=A.indexOf(`
`,B+2);return Z===-1?A.length:Z+1}if(A.startsWith("/*",B)){let Z=A.indexOf("*/",B+2);return Z===-1?A.length:Z+2}return B}function El(A,B){let Z=B;while(Z<A.length){if(/\s/.test(A[Z]??"")){Z++;continue}let Q=bs(A,Z);if(Q===Z)return Z;Z=Q}return Z}function Il(A,B,Z){let Q=0,ee=0;while(ee<A.length){let te=bs(A,ee);if(te!==ee){ee=te;continue}if(A[ee]==='"'){let se=_l(A,ee,Z.stringError);if(Q===1&&JSON.parse(A.slice(ee,se))===B){let me=El(A,se),ye=El(A,me+1);if(A[me]===":"&&A[ye]==="[")return{start:ye,end:ws(A,ye,{skipComment:bs,...Z})}}ee=se;continue}if(A[ee]==="{"||A[ee]==="[")Q++;if(A[ee]==="}"||A[ee]==="]")Q--;ee++}return}var Rn="cc-safety-net@cc-marketplace",ro=["cc-marketplace","cc-safety-net"],Ol=["_direct","copilot-safety-net"],$l=["cc-marketplace","safety-net"],Dl="safety-net@cc-marketplace";function oo(A,B){let Z=B.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${Z}([^a-z0-9-]|$)`,"m").test(A??"")}function Nl(A){return oo(A,"cc-safety-net@cc-marketplace")}function Ll(A){return oo(A,"cc-marketplace")}function jl(A){return oo(A,"copilot-safety-net")}function Fl(A){return oo(A,"safety-net@cc-marketplace")}function so(A){if(!A?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(A)}function Ml(A,B){if(!A)return null;let Z=A.match(/(\d+)\.(\d+)\.(\d+)/);if(!Z)return null;let Q=[Number(Z[1]),Number(Z[2]),Number(Z[3])];for(let ee=0;ee<B.length;ee++){let te=Q[ee]??0,se=B[ee]??0;if(te!==se)return te>se}return!0}function Ug(A){return Ml(A,[0,0,422])}function Bg(A){return Ml(A,[1,0,8])}function mr(A){return A.env.get("COPILOT_HOME")||yn(A.home,".copilot")}function Ul(A){return A.disableAllHooks!==!0&&Bl(A)}function Bl(A){return(A.hooks?.preToolUse??[]).some((Z)=>{if(Z.type!==void 0&&Z.type!=="command")return!1;return so(Z.command)||so(Z.bash)||so(Z.powershell)||so(Z.exec&&[Z.exec,...Z.args??[]].join(" "))})}function pr(A){return A===void 0||typeof A==="string"}function Gg(A){return A===void 0||Array.isArray(A)&&A.every((B)=>typeof B==="string")}function qg(A){if(!A||typeof A!=="object"||Array.isArray(A))return!1;let B=A;if(B.disableAllHooks!==void 0&&typeof B.disableAllHooks!=="boolean")return!1;if(B.hooks===void 0)return!0;if(!B.hooks||typeof B.hooks!=="object"||Array.isArray(B.hooks))return!1;let Z=B.hooks.preToolUse;if(Z===void 0)return!0;return Array.isArray(Z)&&Z.every((Q)=>Q!==null&&typeof Q==="object"&&!Array.isArray(Q)&&pr(Q.type)&&pr(Q.command)&&pr(Q.bash)&&pr(Q.powershell)&&pr(Q.exec)&&Gg(Q.args))}function ks(A,B){try{let Z=JSON.parse(mn(Mg(A,"utf-8")));if(!qg(Z)){B?.push(`Invalid hook config ${A}: hooks.preToolUse must be an array of hook objects`);return}return Z}catch(Z){B?.push(`Failed to parse ${A}: ${Z instanceof Error?Z.message:String(Z)}`);return}}function Gl(A,B){try{return Hg(A).filter((Z)=>Z.endsWith(".json")).sort((Z,Q)=>Z.localeCompare(Q))}catch(Z){return B?.push(`Failed to read ${A}: ${Z instanceof Error?Z.message:String(Z)}`),[]}}function Vg(A,B){if(!io(A))return[];let Z=[];for(let Q of Gl(A,B)){let ee=yn(A,Q),te=ks(ee,B);if(te&&Ul(te))Z.push(ee)}return Z}function fr(A,B){if(!io(A))return;let Z=ks(A,B);if(!Z)return;return{path:A,config:Z}}function Hl(A,B,Z,Q){if(B){A.push(`GitHub Copilot CLI ${B} does not support ${Z}; requires ${Q}+`);return}A.push(`GitHub Copilot CLI version unavailable; skipping ${Z} because it requires ${Q}+`)}function Kg(A){for(let B of A){if(B?.config.disableAllHooks===!0)return B.path;if(B?.config.disableAllHooks===!1)return}return}function zg(A,B,Z,Q){let ee=mr(A),te=yn(B,".github","hooks"),se=yn(ee,"hooks"),me=yn(B,".github","copilot"),ye=yn(B,".claude"),Re=Bg(Z),_e=Re===!0?Q:void 0,Ae=[fr(yn(me,"settings.local.json"),_e),fr(yn(me,"settings.json"),_e),fr(yn(ye,"settings.local.json"),_e),fr(yn(ye,"settings.json"),_e)],De=fr(yn(ee,"settings.json"),_e),Ne=[De?.config.disableAllHooks===!0?void 0:De];if(Re!==!1){let en=Kg(Ae);if(en){if(Re===null)Q.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${en} as active`);return{activeConfigPaths:[],repoInlineSources:Ae,disabledBy:en}}}let Oe=Vg(te,Q),Le=Ug(Z),je=Le===!0?Q:void 0,nn=io(se)?Gl(se,je):[],Xe=[];for(let en of nn){let on=yn(se,en),Sn=ks(on,je);if(Sn&&Ul(Sn))Xe.push(on)}if(Le!==!0&&Xe.length>0)Hl(Q,Z,`user hook files in ${se}`,"0.0.422"),Xe.length=0;let rn=[];for(let en of[...Ae,...Ne]){if(!en)continue;if(!Bl(en.config))continue;if(Re===!0){rn.push(en);continue}Hl(Q,Z,"inline hook definitions in Copilot config files","1.0.8");break}let an=(en)=>en.filter((on)=>!!on&&rn.includes(on)).map((on)=>on.path);return{activeConfigPaths:[...an(Ae),...Oe,...an(Ne),...Xe],repoInlineSources:Ae}}function ql(A){let B=[],Z=zg(A.environment,A.cwd,A.copilotCliVersion,B);if(Z.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:Z.disabledBy,configPaths:[Z.disabledBy],errors:B.length>0?B:void 0};let Q=mr(A.environment),ee=yn(Q,"installed-plugins",...ro),te=io(ee),se=yn(Q,"settings.json"),me=f(se,mn),ye=(Ne)=>t(t(Ne,"enabledPlugins"),Rn),Re=Z.repoInlineSources.find((Ne)=>typeof ye(Ne?.config)==="boolean"),_e=Re??(me.kind==="ok"?{path:se,config:me.value}:void 0);if(te&&!Re&&me.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};let Ae=te&&_e!==void 0&&ye(_e.config)===!1;if(Ae&&Z.activeConfigPaths.length===0)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:_e.path,errors:[`${Rn} is installed but not enabled in Copilot CLI`]};let De=te&&!Ae;if(De||Z.activeConfigPaths.length>0){let Ne=Z.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:De?"plugin config":"hook config",configPath:Ne??(De?ee:void 0),configPaths:Z.activeConfigPaths.length>0?Z.activeConfigPaths:void 0,errors:B.length>0?B:void 0}}return{platform:"copilot-cli",status:"n/a",errors:B.length>0?B:void 0}}import{existsSync as Ts,readdirSync as ah,readFileSync as lh}from"node:fs";import{join as _s}from"node:path";import{existsSync as Rs,mkdirSync as eh,readFileSync as nh,rmSync as th}from"node:fs";import{dirname as rh,join as ao}from"node:path";import{existsSync as Jg,renameSync as Wg,statSync as Yg,writeFileSync as Zg}from"node:fs";function sn(A,B){let Z=`${A}.${process.pid}.tmp`;Zg(Z,B,Jg(A)?{mode:Yg(A).mode&511}:{}),Wg(Z,A)}import{spawn as Xg}from"node:child_process";function Qg(A){return A.join(" ")}function Cs(A,B,Z){return[`Failed to run ${Qg(A)}${B===null?"":` (exit ${B})`}.`,Z.trim()].filter(Boolean).join(`
`)}function xs(A){let B={stdout:"",stderr:""};return A.stdout.setEncoding("utf-8"),A.stderr.setEncoding("utf-8"),A.stdout.on("data",(Z)=>{B.stdout+=Z}),A.stderr.on("data",(Z)=>{B.stderr+=Z}),B}function un(A,B){return new Promise((Z,Q)=>{let ee=Jn([...A],process.env),te=Xg(ee.cmd,ee.args,{stdio:["ignore","pipe","pipe"],windowsVerbatimArguments:ee.windowsVerbatimArguments}),se=xs(te),me=()=>[se.stdout,se.stderr].filter(Boolean).join(`
`),ye=B?.timeoutMs??120000,Re=setTimeout(()=>{te.kill(),Q(Error(Cs(A,null,`Timed out after ${ye}ms.
${me()}`.trim())))},ye);te.on("error",(_e)=>{clearTimeout(Re),Q(Error(Cs(A,null,`${_e.message}
${me()}`.trim())))}),te.on("close",(_e)=>{if(clearTimeout(Re),_e!==0){Q(Error(Cs(A,_e,me())));return}Z(B?.stdoutOnly?se.stdout:me())})})}async function Ss(A){for(let B of A)await un(B)}async function Vl(A){for(let B of A)try{await un(B)}catch(Z){console.warn(Z instanceof Error?Z.message:String(Z))}}var vn=Object.fromEntries(lr.map((A)=>[A.id,`npx -y cc-safety-net hook ${A.flags[1]}`]));var hr=vn.cursor,Kl=30;function co(A){return ao(A.home,".cursor","hooks.json")}var gr="cc-safety-net";function Es(A){let B=ao(A.home,".cursor","plugins");return{cache:ao(B,"cache",gr),marketplaceClone:ao(B,"marketplaces","github.com","kenryu42","cc-safety-net")}}async function zl(A){let B=Object.values(Es(A));if(!B.some((Q)=>Rs(Q)))return;let Z="No marketplace matches";return await un(["cursor-agent","plugin","marketplace","remove",gr]).catch((Q)=>{if(!(Q instanceof Error&&Q.message.includes(Z)))throw Q}),B.forEach((Q)=>th(Q,{recursive:!0,force:!0})),[`Removed the ${gr} marketplace from your Cursor account.`,"If /plugins in cursor-agent still lists CC Safety Net as installed, uninstall it there."].join(`
`)}function Yn(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function Ps(){return{command:hr,timeout:Kl,failClosed:!0}}function lo(A){return Yn(A)&&A.command===hr}function oh(A){return Object.keys(A).length===3&&A.command===hr&&A.timeout===Kl&&A.failClosed===!0}function sh(A){try{return JSON.parse(nh(A,"utf-8"))}catch(B){if(B instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${A}: ${B.message}`);throw B}}function Jl(A){let B=sh(A);if(!Yn(B))throw Error(`Cursor hooks config ${A} must be a JSON object`);if(B.version!==1)throw Error(`Cursor hooks config ${A} must set "version": 1`);if(B.hooks!==void 0&&!Yn(B.hooks))throw Error(`Cursor hooks config ${A} "hooks" must be an object`);let Z=Yn(B.hooks)?B.hooks.preToolUse:void 0;if(Z!==void 0&&!Array.isArray(Z))throw Error(`Cursor hooks config ${A} "hooks.preToolUse" must be an array`);return B}function Wl(A){let B=Yn(A.hooks)?A.hooks.preToolUse:void 0;return Array.isArray(B)?B:[]}function ih(A){if(!A.some(lo))return[...A,Ps()];return A.reduce((B,Z)=>{if(!lo(Z))return B.result.push(Z),B;if(!B.inserted)B.result.push(Ps()),B.inserted=!0;return B},{result:[],inserted:!1}).result}function Yl(A,B,Z){let Q=Yn(B.hooks)?B.hooks:{},ee={...B,hooks:{...Q,preToolUse:Z}};sn(A,`${JSON.stringify(ee,null,2)}
`)}function Zl(A){let B=co(A);if(!Rs(B))return eh(rh(B),{recursive:!0}),sn(B,`${JSON.stringify({version:1,hooks:{preToolUse:[Ps()]}},null,2)}
`),{path:B,alreadyInstalled:!1};let Z=Jl(B),Q=Wl(Z),ee=Q.filter(lo);if(Yn(Z.hooks)&&Array.isArray(Z.hooks.preToolUse)&&ee.length===1&&ee[0]!==void 0&&oh(ee[0]))return{path:B,alreadyInstalled:!0};return Yl(B,Z,ih(Q)),{path:B,alreadyInstalled:!1}}function Xl(A){let B=co(A);if(!Rs(B))return{path:B,alreadyInstalled:!1};let Z=Jl(B),Q=Wl(Z),ee=Q.filter((te)=>!lo(te));if(ee.length===Q.length)return{path:B,alreadyInstalled:!1};return Yl(B,Z,ee),{path:B,alreadyInstalled:!0}}function ch(A){if(!A||typeof A!=="object"||Array.isArray(A))return[];let B=A.hooks;if(!B||typeof B!=="object"||Array.isArray(B))return[];let Z=B.preToolUse;if(!Array.isArray(Z))return[];return Z.filter((Q)=>!!Q&&typeof Q==="object"&&!Array.isArray(Q)&&Q.command===hr)}function dh(A){let B=[];if(A.length>1)B.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let Z=A[0];if(Z&&Z.failClosed!==!0)B.push('Managed hook is missing "failClosed": true; reinstall to repair');if(Z&&Z.timeout!==30)B.push('Managed hook "timeout" is not 30; reinstall to repair');return B}var uo="Claude Code plugin",As="Cursor plugin";function uh(A){let B=_s(Es(A).cache,gr);if(!Ts(B))return{};try{return{version:ah(B).map((Z)=>_s(B,Z)).find((Z)=>Ts(_s(Z,".cache-complete")))}}catch{return{unreadable:B}}}function ph(A,B){if(B){let ee=["Cursor records enabled plugins on your Cursor account, which doctor cannot check, and keeps a plugin's files after it is uninstalled.","Cursor pins marketplace plugins to the commit they were added at, so `cc-safety-net update` cannot update this plugin, while the npx hook (`cc-safety-net install --cursor`) stays current."].join(" ");return{method:As,configPath:B,duplicate:`The Cursor plugin also runs this check, so every tool call is checked twice. ${ee} If the plugin is installed, run \`cc-safety-net uninstall --cursor\`, uninstall CC Safety Net from /plugins in cursor-agent, then run \`cc-safety-net install --cursor\`.`,alone:`${ee} If /plugins in cursor-agent does not list CC Safety Net as installed, run \`cc-safety-net install --cursor\`.`}}let Z=xl(A);if(!Z)return;let Q="Cursor runs the Claude Code plugin only while it imports Claude Code plugins, which doctor cannot check.";return{method:uo,configPath:Z,duplicate:`The Claude Code plugin also runs this check in Cursor, so every tool call is checked twice. ${Q} If Cursor runs it, run \`cc-safety-net uninstall --cursor\` to remove this hook.`,alone:`${Q} If it stops, run \`cc-safety-net install --cursor\`.`}}function Ql(A){let B=fh(A),Z=uh(A.environment);if(Z.unreadable)return B.status==="configured"?{...B,errors:[...B.errors??[],`Cannot read ${Z.unreadable}, so doctor cannot tell whether the Cursor plugin also runs this check.`]}:{platform:"cursor",status:"not-inspected"};let Q=ph(A.environment,Z.version);if(!Q)return B;if(B.status==="configured")return{...B,errors:[...B.errors??[],Q.duplicate]};return{platform:"cursor",status:"configured",method:Q.method,configPath:Q.configPath,errors:[...B.errors??[],Q.alone]}}function fh(A){let B=co(A.environment);if(!Ts(B))return{platform:"cursor",status:"n/a",configPath:B};let Z;try{Z=JSON.parse(lh(B,"utf-8"))}catch(te){return{platform:"cursor",status:"n/a",configPath:B,errors:[`Failed to parse Cursor hooks config ${B}: ${te instanceof Error?te.message:String(te)}`]}}let Q=ch(Z);if(Q.length===0)return{platform:"cursor",status:"n/a",configPath:B};let ee=dh(Q);return{platform:"cursor",status:"configured",method:"hook config",configPath:B,errors:ee.length>0?ee:void 0}}import{existsSync as bh}from"node:fs";import{existsSync as tc,mkdirSync as mh,readFileSync as gh}from"node:fs";import{dirname as hh,join as $s}from"node:path";function Is(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function Os(A,B){return Is(A)&&A.command===B}function ec(A,B){return Is(A)&&Array.isArray(A.hooks)&&A.hooks.some((Z)=>Os(Z,B))}function Zn(A,B){return{hooks:[{type:"command",command:A,timeout:B}]}}function $n(A,B){return A.flatMap((Z)=>{if(!Is(Z)||!Array.isArray(Z.hooks))return[Z];let Q=Z.hooks.filter((ee)=>!Os(ee,B));if(Q.length===Z.hooks.length)return[Z];return Q.length===0?[]:[{...Z,hooks:Q}]})}function zt(A,B,Z){let Q=A.filter((ee)=>ec(ee,B));return Q.length===1&&JSON.stringify(Q[0])===JSON.stringify(Zn(B,Z))}function Jt(A,B){return A.find((Z)=>ec(Z,B))}function Wt(A,B,Z){let Q=Array.isArray(A.hooks)?A.hooks.find((ee)=>Os(ee,B)):void 0;return[...A.matcher===void 0||A.matcher===""||A.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...Q?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...Q?.timeout===Z?[]:[`Managed hook "timeout" is not ${Z}; reinstall to repair`]]}var Xn=vn.devin,po=30,yh={config:{},hooks:{},preToolUse:[]};function fo(A,B=process.platform){let Z=B==="win32"?A.env.get("APPDATA")||$s(A.home,"AppData","Roaming"):A.env.get("XDG_CONFIG_HOME")||$s(A.home,".config");return $s(Z,"devin","config.json")}function nc(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function vh(A){try{return{ok:!0,value:JSON.parse(mn(gh(A,"utf-8")))}}catch(B){return{ok:!1,message:B instanceof Error?B.message:String(B)}}}function Ds(A){let B=vh(A);if(!B.ok)return`Failed to parse Devin CLI config ${A}: ${B.message}`;let Z=B.value;if(!nc(Z))return`Devin CLI config ${A} must be a JSON object`;let Q=Z.hooks===void 0?{}:Z.hooks;if(!nc(Q))return`Devin CLI config ${A} "hooks" must be an object`;let ee=Q.PreToolUse===void 0?[]:Q.PreToolUse;if(!Array.isArray(ee))return`Devin CLI config ${A} "hooks.PreToolUse" must be an array`;return{config:Z,hooks:Q,preToolUse:ee}}function rc(A){let B=Ds(A);if(typeof B==="string")throw Error(B);return B}function oc(A,B,Z){let Q={...B.config,hooks:{...B.hooks,PreToolUse:Z}};sn(A,`${JSON.stringify(Q,null,2)}
`)}function sc(A){let B=fo(A),Z=tc(B)?rc(B):yh;if(zt(Z.preToolUse,Xn,po))return{path:B,alreadyInstalled:!0};return mh(hh(B),{recursive:!0}),oc(B,Z,[...$n(Z.preToolUse,Xn),Zn(Xn,po)]),{path:B,alreadyInstalled:!1}}function ic(A){let B=fo(A);if(!tc(B))return{path:B,alreadyInstalled:!1};let Z=rc(B),Q=$n(Z.preToolUse,Xn);if(JSON.stringify(Q)===JSON.stringify(Z.preToolUse))return{path:B,alreadyInstalled:!1};return oc(B,Z,Q),{path:B,alreadyInstalled:!0}}function ac(A){let B=fo(A.environment);if(!bh(B))return{platform:"devin",status:"n/a",configPath:B};let Z=Ds(B);if(typeof Z==="string")return{platform:"devin",status:"n/a",configPath:B,errors:[Z]};let Q=Jt(Z.preToolUse,Xn);if(!Q)return{platform:"devin",status:"n/a",configPath:B};let ee=Wt(Q,Xn,po);return{platform:"devin",status:"configured",method:"hook config",configPath:B,errors:ee.length>0?ee:void 0}}import{existsSync as Rh,readFileSync as Eh}from"node:fs";import{existsSync as Yt,mkdirSync as wh,readFileSync as kh,rmSync as Ch}from"node:fs";import{dirname as xh,join as Ls}from"node:path";var Qn=vn.droid,mo=30;function go(A){return Ls(A.home,".factory","hooks.json")}function lc(A){return Ls(A.home,".factory","settings.json")}function cc(A){return Ls(A.home,".factory","hooks","hooks.json")}function Ns(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function dc(A){try{return JSON.parse(mn(kh(A,"utf-8")))}catch(B){if(B instanceof SyntaxError)throw Error(`Failed to parse Factory Droid hooks config ${A}: ${B.message}`);throw B}}function js(A){let B=dc(A);if(!Ns(B))throw Error(`Factory Droid hooks config ${A} must be a JSON object`);if(B.PreToolUse===void 0||Array.isArray(B.PreToolUse))return B;throw Error(`Factory Droid hooks config ${A} "PreToolUse" must be an array`)}function Sh(A){if(!Yt(A))return{};let B=dc(A);return Ns(B)&&Ns(B.hooks)&&B.hooks.PreToolUse!==void 0?{PreToolUse:B.hooks.PreToolUse}:{}}function Ph(A){let B=cc(A);return{...Sh(lc(A)),...Yt(B)?js(B):{}}}function uc(A){return Array.isArray(A.PreToolUse)?A.PreToolUse:[]}function pc(A,B,Z){sn(A,`${JSON.stringify({...B,PreToolUse:Z},null,2)}
`)}function fc(A){let B=go(A),Z=Yt(B),Q=Z?js(B):Ph(A),ee=uc(Q);if(Z&&zt(ee,Qn,mo))return{path:B,alreadyInstalled:!0};return wh(xh(B),{recursive:!0}),pc(B,Q,[...$n(ee,Qn),Zn(Qn,mo)]),{path:B,alreadyInstalled:!1}}function mc(A){let B=go(A);if(!Yt(B))return{path:B,alreadyInstalled:!1};let Z=js(B),Q=uc(Z),ee=$n(Q,Qn);if(JSON.stringify(ee)===JSON.stringify(Q))return{path:B,alreadyInstalled:!1};let te=Yt(lc(A))||Yt(cc(A));if(ee.length===0&&Object.keys(Z).length===1&&!te)return Ch(B),{path:B,alreadyInstalled:!0};return pc(B,Z,ee),{path:B,alreadyInstalled:!0}}function gc(A){let B=go(A.environment);if(!Rh(B))return{platform:"droid",status:"n/a",configPath:B};let Z;try{Z=JSON.parse(mn(Eh(B,"utf-8")))}catch(se){return{platform:"droid",status:"n/a",configPath:B,errors:[`Failed to parse Factory Droid hooks config ${B}: ${se instanceof Error?se.message:String(se)}`]}}let Q=typeof Z==="object"&&Z!==null&&"PreToolUse"in Z?Z.PreToolUse:void 0,ee=Jt(Array.isArray(Q)?Q:[],Qn);if(!ee)return{platform:"droid",status:"n/a",configPath:B};let te=[...ee.commandRegex===void 0||ee.commandRegex===""?[]:['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair'],...Wt(ee,Qn,mo)];return{platform:"droid",status:"configured",method:"hook config",configPath:B,errors:te.length>0?te:void 0}}import{existsSync as _h}from"node:fs";import{join as Fs}from"node:path";var Hs="gemini-safety-net";function Ms(A){let B=Fs(A.home,".gemini","extensions"),Z=Fs(B,Hs);if(!_h(Z))return{platform:"gemini-cli",status:"n/a"};let Q=Fs(B,"extension-enablement.json"),ee=f(Q);if(ee.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let te=ee.kind==="ok"?t(t(ee.value,Hs),"overrides"):void 0;if(Array.isArray(te)&&te.some((me)=>typeof me==="string"&&me.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:Q,errors:[`${Hs} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:Z}}function hc(A){return Ms(A.environment)}import{existsSync as Oh,readFileSync as Pc,statSync as $h}from"node:fs";import{dirname as Sc,join as Dh}from"node:path";import{existsSync as vc,mkdirSync as Th,readFileSync as bc,rmSync as Ah}from"node:fs";import{dirname as Ih,join as yc}from"node:path";var Mn=vn["grok-build"],yo=30,Us=Zn(Mn,yo);function vo(A){return yc(A.env.get("GROK_HOME")??yc(A.home,".grok"),"hooks","cc-safety-net.json")}function bo(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function wc(A){try{let B=JSON.parse(A);return bo(B)?B:null}catch{return null}}function kc(A){let B=bo(A.hooks)?A.hooks.PreToolUse:void 0;return Array.isArray(B)?B:[]}function ho(A,B,Z){let Q=bo(B.hooks)?B.hooks:{};sn(A,`${JSON.stringify({...B,hooks:{...Q,PreToolUse:Z}},null,2)}
`)}function Cc(A){let B=vo(A);if(!vc(B))return Th(Ih(B),{recursive:!0}),ho(B,{},[Us]),{path:B,alreadyInstalled:!1};let Z=wc(bc(B,"utf-8"));if(!Z)return ho(B,{},[Us]),{path:B,alreadyInstalled:!1};let Q=kc(Z);if(zt(Q,Mn,yo))return{path:B,alreadyInstalled:!0};return ho(B,Z,[...$n(Q,Mn),Us]),{path:B,alreadyInstalled:!1}}function xc(A){let B=vo(A);if(!vc(B))return{path:B,alreadyInstalled:!1};let Z=wc(bc(B,"utf-8"));if(!Z)return{path:B,alreadyInstalled:!1};let Q=kc(Z),ee=$n(Q,Mn);if(JSON.stringify(ee)===JSON.stringify(Q))return{path:B,alreadyInstalled:!1};let te=bo(Z.hooks)?Z.hooks:{};if(ee.length===0&&Object.keys(Z).length===1&&Object.keys(te).length===1)return Ah(B),{path:B,alreadyInstalled:!0};return ho(B,Z,ee),{path:B,alreadyInstalled:!0}}function Bs(A){return!!A&&typeof A==="object"&&!Array.isArray(A)}function Nh(A){try{return $h(A,{throwIfNoEntry:!1})?.isFile()===!0?Pc(A,"utf-8"):""}catch{return}}function Rc(A){let B=vo(A.environment);if(!Oh(B))return{platform:"grok-build",status:"n/a",configPath:B};let Z;try{Z=JSON.parse(Pc(B,"utf-8"))}catch(Ae){return{platform:"grok-build",status:"n/a",configPath:B,errors:[`Failed to parse Grok Build hooks config ${B}: ${Ae instanceof Error?Ae.message:String(Ae)}`]}}let Q=Bs(Z)&&Bs(Z.hooks)&&Array.isArray(Z.hooks.PreToolUse)?Z.hooks.PreToolUse:[],ee=Jt(Q,Mn);if(!ee)return{platform:"grok-build",status:"n/a",configPath:B};let te=Array.isArray(ee.hooks)?ee.hooks.findIndex((Ae)=>Bs(Ae)&&Ae.command===Mn):-1,se=`global/cc-safety-net:pre_tool_use[${Q.indexOf(ee)}].hooks[${te}]`,me=Dh(Sc(Sc(B)),"disabled-hooks"),ye=Nh(me),Re=ye?.split(`
`).some((Ae)=>Ae.trim()===se)===!0,_e=[...ye===void 0?[`Cannot read ${me}, so doctor cannot tell whether Grok Build skips the hook`]:[],...Re?[`Grok Build skips the hook: ${se} is listed in ${me}; enable it in /hooks`]:[],...Wt(ee,Mn,yo)];return{platform:"grok-build",status:Re?"disabled":"configured",method:"hook config",configPath:B,errors:_e.length>0?_e:void 0}}import{readFileSync as Nc}from"node:fs";import{join as Lc}from"node:path";var kn="cc-safety-net",Gs="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",Lh=30;function Ec(A){return`${Gs}
# version: ${A}
`}function jh(A){return`${Ec(A)}name: ${kn}
version: "${A}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function Fh(A){return`${Ec(A)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${vn["hermes-agent"].split(" ").map((B)=>`"${B}"`).join(", ")}]
TIMEOUT_SECONDS = ${Lh}


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
`}function yr(A){return[{name:"__init__.py",content:Fh(A)},{name:"plugin.yaml",content:jh(A)}]}import{mkdirSync as Hh,readdirSync as Mh,readFileSync as _c,rmSync as qs}from"node:fs";import{basename as Uh,dirname as Bh,join as Dn}from"node:path";var Gh="__pycache__",qh=/^[a-z0-9][a-z0-9_-]{0,63}$/;function Vh(A){try{return _c(A,"utf-8").trim()}catch{return}}function Vs(A){let B=A.env.get("HERMES_HOME")?.trim();if(B&&Uh(Bh(B))==="profiles")return B;let Z=B||Dn(A.home,".hermes"),Q=Dn(Z,"active_profile"),ee=Vh(Q),te=ee?.toLowerCase();if(!te||te==="default")return Z;if(!qh.test(te))throw Error(`Invalid Hermes profile name "${ee}" in ${Q}; run \`hermes profile use <name>\` with a valid profile.`);return Dn(Z,"profiles",te)}function Ks(A){return Dn(Vs(A),"plugins",kn)}function zs(A){return A.startsWith(Gs)}function Js(A,B){let Z=Ks(A),Q=l(Z);if(Q&&(Q.isSymbolicLink()||!Q.isDirectory()))throw Error(`Refusing to ${B} ${Z}: not a regular directory. Move or remove it and rerun ${B==="install"?"install":"uninstall"} --hermes-agent.`);return Z}function Tc(A,B){let Z=l(A);if(!Z)return;if(Z.isSymbolicLink()||!Z.isFile())throw Error(`Refusing to ${B} ${A}: not a regular file. Move or remove it.`);let Q=_c(A,"utf-8");if(!zs(Q))throw Error(`Refusing to ${B} unmanaged file at ${A}. Move or remove it.`);return Q}function Ac(A){let B=Js(A,"install"),Z=yr(dn());if(Z.map((ee)=>Tc(Dn(B,ee.name),"overwrite")).every((ee,te)=>ee===Z[te]?.content))return{path:B,alreadyInstalled:!0};return Hh(B,{recursive:!0}),Z.forEach((ee)=>{sn(Dn(B,ee.name),ee.content)}),{path:B,alreadyInstalled:!1}}function Ws(A){let B=Js(A,"remove");if(!l(B))return[];return yr(dn()).filter((Z)=>Tc(Dn(B,Z.name),"remove")!==void 0)}function Ic(A){let B=Js(A,"remove");if(!l(B))return{path:B,alreadyInstalled:!1};let Z=Ws(A);if(Z.forEach((Q)=>{qs(Dn(B,Q.name))}),qs(Dn(B,Gh),{recursive:!0,force:!0}),Mh(B).length===0)qs(B,{recursive:!0});return{path:B,alreadyInstalled:Z.length>0}}var vr="hermes-agent",Oc=/^([^\s#][^:]*):/,Kh=/^\s+([A-Za-z_][\w-]*):/,$c=/^\s+-\s*(.*)$/;function zh(A){return A.trim().replace(/^(["'])(.*)\1$/,"$2")}function Jh(A){let B=A.split(/\r?\n/),Z=B.findIndex((te)=>Oc.exec(te)?.[1]?.trim()==="plugins");if(Z===-1)return[];let Q=B.slice(Z+1),ee=Q.findIndex((te)=>Oc.test(te));return ee===-1?Q:Q.slice(0,ee)}function Dc(A,B){let Z=Jh(A),Q=Z.findIndex((se)=>Kh.exec(se)?.[1]===B);if(Q===-1)return[];let ee=Z.slice(Q+1),te=ee.findIndex((se)=>!$c.test(se));return(te===-1?ee:ee.slice(0,te)).map((se)=>zh($c.exec(se)?.[1]??""))}function Wh(A){try{return Nc(Lc(Vs(A),"config.yaml"),"utf-8")}catch{return}}function Ys(A){let B=Wh(A)??"";return Dc(B,"enabled").includes(kn)&&!Dc(B,"disabled").includes(kn)}function jc(A){return/^# version:\s*(.+)$/m.exec(A)?.[1]?.trim()}function Yh(A,B){let Z=l(A);if(!Z)return{error:`${B.name} is missing from ${A}; run install --hermes-agent`};if(Z.isSymbolicLink()||!Z.isFile())return{error:`${A} is a symlink or not a regular file; move or remove it`};try{let Q=Nc(A,"utf-8");if(!zs(Q))return{error:`Unmanaged ${B.name} occupies ${A}; move or remove it`};if(jc(Q)===dn()&&Q!==B.content)return{error:`Modified ${B.name} occupies ${A}; run install --hermes-agent to restore it`};return{content:Q}}catch(Q){return{error:`Failed to read ${A}: ${Q instanceof Error?Q.message:String(Q)}`}}}function Zh(A){try{return{path:Ks(A)}}catch(B){return{error:B instanceof Error?B.message:String(B)}}}function Fc(A){let B=Zh(A.environment);if("error"in B)return{platform:vr,status:"n/a",errors:[B.error]};let Z=B.path,Q=Ue(vr,Z);if(Q)return Q;let ee=yr(dn()).map((ye)=>Yh(Lc(Z,ye.name),ye)),te=ee.flatMap((ye)=>("error"in ye)?[ye.error]:[]);if(te.length>0)return{platform:vr,status:"n/a",configPath:Z,errors:te};let se=ee.some((ye)=>("content"in ye)&&jc(ye.content)!==dn()),me=se?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!Ys(A.environment))return{platform:vr,status:"disabled",method:"plugin directory",configPath:Z,errors:[`${kn} is not enabled in Hermes; run \`hermes plugins enable ${kn}\``,...me]};return{platform:vr,status:"configured",method:"plugin directory",configPath:Z,errors:se?me:void 0}}import{existsSync as Xh,readFileSync as Qh}from"node:fs";import{join as Qs}from"node:path";var ey=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/,Zs="cc-safety-net",ko="plugin config",ny=new Set(["event","matcher","command","timeout"]),ty=new Set(["PreToolUse","PostToolUse","PostToolUseFailure","PermissionRequest","PermissionResult","UserPromptSubmit","UserPromptQueued","TurnStarted","Stop","StopFailure","Interrupt","SessionStart","SessionEnd","SessionHeartbeat","SubagentStart","SubagentStop","TaskStarted","PreCompact","PostCompact","Notification"]);function Hc(A){return A.env.get("KIMI_CODE_HOME")||Qs(A.home,".kimi-code")}function wo(A,B){let Z=[""],Q="",ee=0;for(let te=0;te<A.length;te++){let se=A[te];if(Q!==""){let me=Q==='"'&&se==="\\"?A[++te]??"":"";if(Z[Z.length-1]+=se+me,me===""&&se===Q)Q="";continue}if(se==="#"){let me=A.indexOf(`
`,te);te=(me===-1?A.length:me)-1;continue}if(se===B&&ee===0){Z.push("");continue}if(se==='"'||se==="'")Q=se;if(se==="["||se==="{")ee++;if(se==="]"||se==="}")ee--;Z[Z.length-1]+=se}return Z.map((te)=>te.trim()).filter((te)=>te!=="")}function Mc(A){let B=/^(?:"([^"]*)"|'([^']*)'|([^\s="']+))\s*=\s*([\s\S]+)$/.exec(A);return B?{key:B[1]??B[2]??B[3]??"",value:B[4]??""}:void 0}function Xs(A){return A===void 0?void 0:/^("""|'''|"|')([\s\S]*)\1$/.exec(A)?.[2]}function ry(A){let B=A.split(/(?=^\s*\[)/m),Z=B.filter((Q)=>!/^\s*\[/.test(Q)).flatMap((Q)=>wo(Q,`
`)).map(Mc).find((Q)=>Q?.key==="hooks")?.value;if(Z!==void 0)return wo(Z.slice(1,-1),",").map((Q)=>wo(Q.slice(1,-1),","));return B.filter((Q)=>/^\s*\[\[hooks]]/.test(Q)).map((Q)=>wo(Q.replace(/^\s*\[\[hooks]]/,""),`
`))}function oy(A){let B=A.map(Mc),Z=A.find((_e,Ae)=>B[Ae]===void 0),Q=B.find((_e)=>_e!==void 0&&!ny.has(_e.key))?.key,ee=B.find((_e,Ae)=>_e!==void 0&&B.findIndex((De)=>De?.key===_e.key)<Ae)?.key,te=(_e)=>B.find((Ae)=>Ae?.key===_e)?.value,se=te("matcher"),me=te("timeout"),ye=Number(me?.replace(/(?<=[\da-f])_(?=[\da-f])/gi,""));return[[Z!==void 0,`"${Z}" is not a key = value pair`],[Q!==void 0,`unknown key "${Q}"`],[ee!==void 0,`duplicate key "${ee}"`],[!ty.has(Xs(te("event"))??""),'"event" is not a Kimi Code hook event'],[se!==void 0&&Xs(se)===void 0,'"matcher" is not a string'],[!Xs(te("command")),'"command" is missing or empty'],[me!==void 0&&!(Number.isInteger(ye)&&ye>=1&&ye<=600),'"timeout" is not an integer from 1 to 600']].find(([_e])=>_e)?.[1]}function sy(A){let B=Qs(Hc(A),"plugins","installed.json"),Z=f(B);if(Z.kind==="missing")return;let Q=Z.kind==="ok"?t(Z.value,"plugins"):void 0;if(!Array.isArray(Q))return{platform:"kimi-code",status:"n/a",configPath:B,errors:[`Cannot read ${B}, so doctor cannot tell whether the Kimi Code plugin is installed`]};let ee=Q.find((te)=>t(te,"id")===Zs);if(ee===void 0)return;if(t(ee,"enabled")!==!0)return{platform:"kimi-code",status:"disabled",method:ko,configPath:B,errors:[`${Zs} is installed but not enabled in Kimi Code; run /plugins enable ${Zs}`]};return{platform:"kimi-code",status:"configured",method:ko,configPath:B}}function Co(A){let B=Qs(Hc(A.environment),"config.toml"),Z=()=>sy(A.environment)??{platform:"kimi-code",status:"n/a",configPath:B};if(!Xh(B))return Z();let Q;try{Q=Qh(B,"utf-8")}catch(se){return{platform:"kimi-code",status:"n/a",configPath:B,errors:[`Failed to read ${B}: ${se instanceof Error?se.message:String(se)}`]}}if(!ey.test(Q))return Z();let te=(/"""|'''/.test(Q)?[]:ry(Q)).flatMap((se,me)=>{let ye=oy(se);return ye===void 0?[]:[`Kimi Code ignores every hook because hooks entry ${me+1} is invalid (${ye}); fix it in ${B}`]});return{platform:"kimi-code",status:te.length>0?"disabled":"configured",method:"hook config",configPath:B,errors:te.length>0?te:void 0}}import{readFileSync as Wc}from"node:fs";import{join as wr}from"node:path";var cn="cc-safety-net",wn="index.js",Zt="openclaw.plugin.json",Xt="package.json";var xo="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as iy,lstatSync as ay,readdirSync as ly,readFileSync as cy}from"node:fs";import{dirname as Uc,join as Un}from"node:path";import{fileURLToPath as dy}from"node:url";var ei=Un("openclaw",cn),lt=`run \`openclaw plugins enable ${cn}\``,uy="config reload superseded by a newer runtime config source",py=[wn,Zt,Xt];function Bc(A){let B=A.env.get("OPENCLAW_HOME")?.trim();return B?H(B,A.home):A.home}function Gc(A){let B=Bc(A),Z=A.env.get("OPENCLAW_STATE_DIR")?.trim();if(Z)return H(Z,B);let Q=A.env.get("OPENCLAW_CONFIG_PATH")?.trim();return Q?Uc(H(Q,B)):Un(B,".openclaw")}function qc(A){let B=A.env.get("OPENCLAW_CONFIG_PATH")?.trim();return B?H(B,Bc(A)):Un(Gc(A),"openclaw.json")}function br(A){return Un(Gc(A),"extensions",cn)}function fy(A){let B=ly(A);if(B.length===0)return!0;if(B.some((ee)=>!py.includes(ee)))return!1;let Z=Un(A,wn),Q=l(Z);return Q!==void 0&&!Q.isSymbolicLink()&&Q.isFile()&&cy(Z,"utf-8").startsWith(xo)}function ni(A){let B=br(A),Z=l(B);if(!Z)return;if(!Z.isSymbolicLink()&&Z.isDirectory()&&fy(B))return;throw Error(`Refusing to modify ${B}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function Vc(){let A=Uc(dy(import.meta.url));return[Un(A,ei),Un(A,"..",ei),Un(A,"..","..","..","dist",ei)]}function ti(A=Vc()){return A.find((B)=>iy(B)&&ay(B).isDirectory())}function my(A=Vc()){let B=ti(A);if(!B)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return B}function Kc(A=my()){return[["openclaw","plugins","install",A,"--force","--accept-capabilities"]]}function gy(A){let B=(()=>{try{return JSON.parse(A)}catch{return}})(),Z=t(t(B,"plugin"),"status");return typeof Z==="string"?Z:void 0}async function hy(){await un(["openclaw","plugins","enable",cn]).catch((A)=>{if(!(A instanceof Error&&A.message.includes(uy)))throw A})}async function zc(A){let B=async()=>gy(await un(["openclaw","plugins","inspect",cn,"--runtime","--json"],{stdoutOnly:!0})),Z=await B(),Q=Z==="disabled"&&A;if(Q)await hy();let ee=Q?await B():Z;if(ee==="loaded")return;throw Error(`${ee===void 0?`The ${cn} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:ee==="disabled"?`OpenClaw reports the ${cn} plugin with status "disabled"; ${lt}.`:`OpenClaw reports the ${cn} plugin with status "${ee}".`} Run \`openclaw plugins inspect ${cn} --runtime\` for details.`)}var So="openclaw";function Qt(A,B){let Z=wr(A,B),Q=l(Z);if(!Q)return{error:`${B} is missing from ${Z}; run install --openclaw`};if(Q.isSymbolicLink()||!Q.isFile())return{error:`${Z} is a symlink or not a regular file; move or remove it`};try{return{content:Wc(Z,"utf-8")}}catch(ee){return{error:`Failed to read ${Z}: ${ee instanceof Error?ee.message:String(ee)}`}}}function Yc(A){try{return JSON.parse(mn(A))}catch{return}}function yy(A){let B=Qt(A,Zt);if("error"in B)return B.error;if(t(Yc(B.content),"id")===cn)return;return`${wr(A,Zt)} is not a valid ${cn} manifest; run install --openclaw`}function vy(A){let B=Qt(A,Xt);if("error"in B)return B.error;let Z=t(t(Yc(B.content),"openclaw"),"extensions");if(Array.isArray(Z)&&Z.includes(`./${wn}`))return;return`${wr(A,Xt)} does not point OpenClaw at ${wn}; run install --openclaw`}function Jc(A){return Array.isArray(A)?A.filter((B)=>typeof B==="string"):[]}function by(A){let B=qc(A);if(!l(B))return`${cn} is not enabled; ${lt}`;let Z=(()=>{try{return JSON.parse(mn(Wc(B,"utf-8")))}catch{return}})();if(Z===void 0)return`Failed to read ${B}; fix it, then ${lt}`;let Q=t(Z,"plugins");if(t(Q,"enabled")===!1)return`plugins.enabled is false in ${B}; no OpenClaw plugin loads`;let ee=t(t(t(Q,"entries"),cn),"enabled");if(Jc(t(Q,"deny")).includes(cn)||ee===!1)return`${cn} is disabled in ${B}; ${lt}`;let te=Jc(t(Q,"allow"));if(te.length>0&&!te.includes(cn))return`plugins.allow in ${B} does not list ${cn}; add it, then ${lt}`;if(te.includes(cn)||ee===!0)return;return`${cn} is not enabled; ${lt}`}function Zc(A){return/^\/\/ version:\s*(.+)$/m.exec(A)?.[1]?.trim()}function wy(A,B,Z){if(Z===void 0)return[];let Q=Qt(Z,wn);if(!(("content"in Q)&&Zc(Q.content)===B))return[];return[wn,Zt,Xt].flatMap((te)=>{let se=Qt(A,te),me=Qt(Z,te);if("error"in se||"error"in me||se.content===me.content)return[];return[`Modified ${te} occupies ${wr(A,te)}; run install --openclaw to restore it`]})}function Xc(A){let B=br(A.environment),Z=Ue(So,B);if(Z)return Z;let Q=Qt(B,wn),te=["error"in Q?Q.error:Q.content.startsWith(xo)?void 0:`Unmanaged ${wn} occupies ${wr(B,wn)}; move or remove it`,yy(B),vy(B)].filter((_e)=>_e!==void 0),se="content"in Q?Zc(Q.content):void 0,me=te.length>0?te:wy(B,se,ti());if(me.length>0)return{platform:So,status:"n/a",configPath:B,errors:me};let ye=se===dn()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],Re=by(A.environment);if(Re)return{platform:So,status:"disabled",method:"plugin directory",configPath:B,errors:[Re,...ye]};return{platform:So,status:"configured",method:"plugin directory",configPath:B,errors:ye.length>0?ye:void 0}}import{existsSync as Ty,readFileSync as Ay}from"node:fs";import{basename as Iy}from"node:path";import{existsSync as Po,readFileSync as oi,rmSync as ky}from"node:fs";import{join as En}from"node:path";import{pathToFileURL as Cy}from"node:url";var kr="cc-safety-net",ct=`${kr}@latest`,si=["opencode.json","opencode.jsonc"],xy=60,Sy=250,Qc="CCSafetyNetPlugin",Py={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function ed(A){return En(A.env.get("XDG_CONFIG_HOME")||En(A.home,".config"),"opencode")}function ii(A){return A.env.get("OPENCODE_CONFIG_DIR")||ed(A)}function ai(A){return si.map((B)=>En(ii(A),B))}function li(A){return[...new Set([ii(A),ed(A)])].flatMap((B)=>si.map((Z)=>En(B,Z)))}function nd(A){return En(A.env.get("XDG_CACHE_HOME")||En(A.home,".cache"),"opencode","packages",ct)}function td(A){ky(nd(A),{recursive:!0,force:!0})}async function rd(A){let B=(await un(["opencode","--version"],{stdoutOnly:!0})).trim(),Z=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(B),Q=Number(Z?.[1]),ee=Number(Z?.[2]),te=Number(Z?.[3]);if(!Z||Q!==1&&Q!==2||Q===1&&(ee<18||ee===18&&te<29)||Q===2&&ee===0&&te<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${B||"an unknown version"}.`);if(Q===2){for(let se of ai(A)){if(!Po(se))continue;let me=di(oi(se,"utf-8"),se);if(["plugin","plugins"].some((Re)=>{let _e=t(me,Re);return Array.isArray(_e)&&_e.some((Ae)=>Ro(Ae)&&(typeof Ae==="string"?Ae:t(Ae,"package"))!==ct)}))throw Error(`Change the cc-safety-net package spec in ${se} to ${ct}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[],afterInstall:async()=>{if((await un(["opencode","plugin","add",ct],{stdoutOnly:!0})).includes("is already configured in"))await ri(),await un(["opencode","plugin","update",ct]);let me=await ri();if(!/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(me))throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.");let ye=["--param",`location[directory]=${process.cwd()}`];await un(["opencode","api","integration.list",...ye]);let Re=await un(["opencode","api","plugin.list",...ye],{stdoutOnly:!0}),_e=ci(Re);if(_e)throw Error(_e);if(!od(Re).some(sd))throw Error("OpenCode lists no active cc-safety-net for this directory. Run `opencode api plugin.list` for details.")}}}return td(A),{commands:[["opencode","plugin","-g","-f",ct]],afterInstall:()=>Ey(A)}}function od(A){return Ry(A).filter((B)=>t(B,"id")===kr||Ro(t(t(B,"source"),"target"))).map((B)=>t(B,"state"))}function sd(A){return t(A,"status")==="active"}function ci(A){let B=od(A);if(B.some(sd))return;let Z=B.find((Q)=>t(Q,"status")==="failed");if(!Z)return;return`OpenCode reports cc-safety-net failed: ${String(t(Z,"error")).split(`
`)[0]}`}function Ry(A){if(!A)return[];try{let B=t(JSON.parse(A),"data");return Array.isArray(B)?B:[]}catch{return[]}}async function ri(A=1){let B=await un(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s|\scc-safety-net@latest\s*$/m.test(B)||A===xy)return B;return await new Promise((Z)=>setTimeout(Z,Sy)),ri(A+1)}async function Ey(A){let B=En(nd(A),"node_modules",kr),Z=En(B,"package.json");if(!Po(Z))throw Error(`The OpenCode plugin cache at ${B} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${ct}\` for details.`);let Q=t(JSON.parse(oi(Z,"utf-8")),"main");if(typeof Q!=="string")throw Error(`The cached OpenCode plugin at ${B} declares no "main" entry.`);let ee=En(B,Q);if(typeof(await import(Cy(ee).href))[Qc]==="function")return;throw Error(`The cached OpenCode plugin at ${ee} does not export a callable ${Qc}, so OpenCode would load nothing and fail open.`)}function di(A,B){try{return JSON.parse(mn(A))}catch(Z){if(Z instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${B}: ${Z.message}`);throw Z}}function Ro(A){let B=typeof A==="string"?A:t(A,"package");return typeof B==="string"&&(B===kr||B.startsWith(`${kr}@`))}function ui(A){return["plugin","plugins"].some((B)=>{let Z=t(A,B);return Array.isArray(Z)&&Z.some(Ro)})}function _y(A,B){let Q=["plugin","plugins"].flatMap((ee)=>{let te=Il(A,ee,Py);if(!te)return[];let se=[],me=0,ye=te.start+1,Re=A.slice(te.start+1,te.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let _e of Re){if(_e[0].startsWith("//")||_e[0].startsWith("/*"))continue;let Ae=te.start+1+_e.index;if(me===0)ye=Ae;if(_e[0]==="{"||_e[0]==="[")me++;if(_e[0]==="}"||_e[0]==="]")me--;if(me!==0||_e[0]===",")continue;let De=Ae+_e[0].length;if(Ro(JSON.parse(mn(A.slice(ye,De)))))se.push({start:ye,end:De})}return se}).sort((ee,te)=>ee.start-te.start).reverse().reduce((ee,te)=>{let se=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(ee.slice(te.end));if(se?.[0].includes("/")){let me=te.end+se[0].length-1;return ee.slice(0,te.start)+ee.slice(te.end,me)+ee.slice(me+1)}return Al(ee,te)},A);return di(Q,B),Q}function id(A){td(A);let B=li(A),Z=B.find((te)=>Po(te)),Q=[],ee=[];for(let te of B){if(!Po(te))continue;try{let se=oi(te,"utf-8");if(!ui(di(se,te)))continue;sn(te,_y(se,te)),ee.push(te)}catch(se){Q.push(se instanceof Error?se.message:String(se))}}if(Q.length>0)throw Error(Q.join(`
`));return{path:ee[0]??Z??En(ii(A),si[0]),alreadyInstalled:ee.length>0}}function er(A){let B=[];for(let Z of A.openCodeVersion?.startsWith("2.")?ai(A.environment):li(A.environment))if(Ty(Z))try{let Q=Ay(Z,"utf-8"),ee=mn(Q),te=JSON.parse(ee);if(ui(te)){let se=ci(A.openCodePluginListOutput);if(se)return{platform:"opencode",status:"disabled",method:"opencode api plugin.list",configPath:Z,errors:[...B,se]};return{platform:"opencode",status:"configured",method:"plugin array",configPath:Z,errors:B.length>0?B:void 0}}}catch(Q){B.push(`Failed to parse ${Iy(Z)}: ${Q instanceof Error?Q.message:String(Q)}`)}return{platform:"opencode",status:"n/a",errors:B.length>0?B:void 0}}import{join as ad}from"node:path";var cd="dist/pi/index.js",ld=new Set([cd,"index.js"]),Oy=/[*?[\]{}]/;function pi(A){let B=A.env.get("PI_CODING_AGENT_DIR");return ad(B?H(B,A.home):ad(A.home,".pi","agent"),"settings.json")}function fi(A){if(typeof A!=="string")return!1;return A==="npm:cc-safety-net"||A.startsWith("npm:cc-safety-net@")}function $y(A){if(!Array.isArray(A)||A.length===0)return!1;if(!A.every((Q)=>typeof Q==="string"))return!1;let B=(Q)=>A.some((ee)=>ee.startsWith(Q)&&ee.slice(1).replace(/^\.[/\\]/,"")===cd);if(B("-"))return!1;if(B("+"))return!0;let Z=A.filter((Q)=>!/^[-+!]/.test(Q));return(Z.length===0||Z.some((Q)=>ld.has(Q)))&&!A.some((Q)=>Q.startsWith("!")&&(ld.has(Q.slice(1))||Oy.test(Q)))}function dd(A){let B=pi(A.environment),Z=f(B);if(Z.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(Z.kind==="missing")return{platform:"pi",status:"n/a"};let Q=t(Z.value,"packages");if(!Array.isArray(Q))return{platform:"pi",status:"n/a"};let ee=Q.find((se)=>fi(typeof se==="string"?se:t(se,"source")));if(ee===void 0)return{platform:"pi",status:"n/a"};let te=t(ee,"extensions");if(te!==void 0&&!$y(te))return{platform:"pi",status:"disabled",method:"package config",configPath:B,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:B}}var Dy={amp:ml,"antigravity-cli":bl,"claude-code":Sl,codex:Rl,"copilot-cli":ql,cursor:Ql,"deepseek-harness":Pt,devin:ac,droid:gc,"gemini-cli":hc,"grok-build":Rc,"hermes-agent":Fc,"kimi-code":Co,openclaw:Xc,opencode:er,pi:dd};function nr(A,B,Z){let Q={...Z,cwd:B,environment:A};return Nr.map((ee)=>Ny(Dy[ee](Q)))}function Ny(A){if(A.status==="not-inspected")return{platform:A.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:A.platform,detected:A.status!=="n/a",configured:A.status==="configured",inspectionStatus:A.status!=="n/a"?"verified":A.errors&&A.errors.length>0?"failed":"not-applicable",method:A.method,configPath:A.configPath,configPaths:A.configPaths,errors:A.errors}}import{join as Ly}from"node:path";var jy=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),Fy=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),heredocDataWrappers:Object.freeze([]),commandTools:Object.freeze([]),safety:Object.freeze({level:"standard"}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),Hy={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function ud(A){let B=Ly(A.tmpdir,"cc-safety-net-self-test"),Z=jy.map((Q)=>{let ee=W(A,u("self-test",{command:Q.command},{kind:"command",shell:"auto"},{configCwd:B,executionCwd:B},Q.command),{guard:{dependencies:{loadPolicySnapshot:()=>Fy,getModes:()=>Hy,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),te=Q.expectBlocked?"blocked":"allowed",se=ee.decision.kind==="deny"?"blocked":"allowed";return{command:Q.command,description:Q.description,expected:te,actual:se,passed:te===se,reason:ee.decision.kind==="deny"?ee.decision.reason:void 0,ruleId:ee.decision.kind==="deny"?ee.decision.ruleId:void 0}});return{passed:Z.filter((Q)=>Q.passed).length,failed:Z.filter((Q)=>!Q.passed).length,total:Z.length,results:Z}}function mi(A){let B=pn({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},A);if(An(B.errors))return null;return{json:B.flags.json,skipUpdateCheck:B.flags.skipUpdateCheck}}async function pd(A,B={}){let Z=await dr(!B.json,()=>{let Q=Uy(A,B);return{ready:Q,finish:()=>Q}},()=>cr(),{loadingMessage:"Checking system status…"});if(B.json)console.log(JSON.stringify(Z,null,2));else By(Z);return Z.engineSelfTest.failed>0||Z.findings.some((Q)=>Q.severity==="error")?1:0}async function Uy(A,B){let Z=B.cwd??process.cwd(),Q=await qr((je)=>er({environment:A,cwd:Z,openCodeVersion:je}).status!=="n/a",void 0,Z),ee=nr(A,Z,{ampPluginListOutput:Q.ampPluginListOutput,codexPluginListOutput:Q.codexPluginListOutput,copilotCliVersion:Q.versions["copilot-cli"],openCodeVersion:Q.versions.opencode,openCodePluginListOutput:Q.openCodePluginListOutput}),te=Ra(A,Z),se=Ea(A),me=S(A,{cwd:Z}),ye=me.policy,Re=E(ye,A.env),_e=Y(ye,Re.capabilities),Ae=Hr(A,7),De=cl(A,Z),Ne=[Gt(Z),qt(A)].filter((je)=>My(je)),Oe=B.skipUpdateCheck?{currentVersion:dn(),latestVersion:null,updateAvailable:!1}:await Hn(),Le={hooks:ee,engineSelfTest:ud(A),userConfig:te.userConfig,projectConfig:te.projectConfig,configState:et(me),effectiveRules:te.effectiveRules,environment:se,effectiveSafety:{selectedPreset:ye.safety.level,level:Re.effectiveLevel,capabilities:Re.capabilities,ruleOverrides:ye.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(_e).filter(([,je])=>je.source==="rule_override"&&je.override==="off"&&je.inheritedEnabled&&je.changesInherited).map(([je])=>je),ruleCounts:{stored:Object.keys(ye.destructiveCommandRuleOverrides).length,effective:Object.values(_e).filter((je)=>je.changesInherited).length},...me.policyScopes?{policyScopes:me.policyScopes}:{}},...De.length>0?{v2Leftovers:De}:{},...Ne.length>0?{legacyConfigs:Ne}:{},posture:Ua(A,te.userConfig.path),activity:Ae,update:Oe,system:Q};return{...Le,findings:Ta(Le)}}function By(A){console.log(),console.log(Ia(A.hooks)),console.log(),console.log(Oa(A.engineSelfTest)),console.log(),console.log($a(A)),console.log(),console.log(Da(A.environment)),console.log(),console.log(Na(A)),console.log(),console.log(La(A.findings)),console.log(),console.log(ja(A.activity)),console.log(),console.log(Ha(A.system)),console.log(),console.log(Fa(A.update)),console.log(Ma(A))}import{existsSync as Gy}from"node:fs";var qy=/^[A-Za-z0-9_@%+=:,./-]+$/,gi="Usage: cc-safety-net explain [--json] [--cwd <path>] [--shell <auto|posix|powershell>] <command>",Vy=["auto","posix","powershell"];function hi(A){let B=pn({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"],shell:["--shell"]},positionals:"tail"},A);if(An(B.errors))return console.error(gi),console.error("Pass -- before a command that starts with dashes."),null;if(B.values.cwd!==void 0&&!Gy(B.values.cwd))return console.error(`Error: --cwd path does not exist: ${B.values.cwd}`),null;let Z=Vy.find((ee)=>ee===B.values.shell);if(B.values.shell!==void 0&&!Z)return console.error(`Error: --shell must be auto, posix, or powershell, got: ${B.values.shell}`),console.error(gi),null;let Q=B.positionals.length===1?B.positionals[0]:B.positionals.map((ee)=>qy.test(ee)?ee:`'${ee.replaceAll("'",Z==="powershell"?"''":"'\\''")}'`).join(" ");if(!Q)return console.error("Error: No command provided"),console.error(gi),null;return{json:B.flags.json,cwd:B.values.cwd,shell:Z,command:Q}}function fd(A){if(A)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function md(A,B){let Q=B-18;return[`${A.dtl}${A.dh.repeat(B)}${A.dtr}`,`${A.dv}  Command Analysis${" ".repeat(Q)}${A.dv}`,`${A.dbl}${A.dh.repeat(B)}${A.dbr}`]}function yi(A){return JSON.stringify(A)}function gd(A,B=0){return`[${A.map((Q,ee)=>Aa(Q,ee,B)).join(",")}]`}function Cr(A,B,Z=70){let Q=A.split(" "),ee=[],te="";for(let se of Q)if(te&&te.length+se.length+1>Z)ee.push(te),te=se;else te=te?`${te} ${se}`:se;if(te)ee.push(te);return ee.map((se,me)=>me===0?se:`${B}${se}`)}function hd(A,B,Z){let Q=[];switch(A.type){case"parse":return null;case"env-strip":return Q.push(""),Q.push(`STEP ${B} ${Z.h} Strip environment variables`),Q.push(`  Removed: ${A.envVars.map((ee)=>`${ee}=<redacted>`).join(", ")}`),Q.push(`  Tokens:  ${yi(A.output)}`),{lines:Q,incrementStep:!0};case"leading-tokens-stripped":return Q.push(""),Q.push(`STEP ${B} ${Z.h} Strip wrappers`),Q.push(`  Removed: ${A.removed.join(", ")}`),Q.push(`  Tokens:  ${yi(A.output)}`),{lines:Q,incrementStep:!0};case"shell-wrapper":return Q.push(""),Q.push(`STEP ${B} ${Z.h} Detect shell wrapper`),Q.push(`  Wrapper: ${A.wrapper} -c`),Q.push(`  Inner:   ${A.innerCommand}`),{lines:Q,incrementStep:!0};case"interpreter":{if(Q.push(""),Q.push(`STEP ${B} ${Z.h} Detect interpreter`),Q.push(`  Interpreter: ${A.interpreter}`),Q.push(`  Code:        ${A.codeArg}`),A.paranoidBlocked)Q.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:Q,incrementStep:!0}}case"busybox":return Q.push(""),Q.push(`STEP ${B} ${Z.h} Busybox wrapper`),Q.push(`  Subcommand: ${A.subcommand}`),{lines:Q,incrementStep:!0};case"transparent-wrapper":return Q.push(""),Q.push(`STEP ${B} ${Z.h} Transparent wrapper`),Q.push(`  Wrapper: ${A.wrapper}`),Q.push(`  Tokens:  ${yi(A.output)}`),{lines:Q,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"script-file":return Q.push(""),Q.push(`STEP ${B} ${Z.h} Read script file`),Q.push(`  Path: ${A.path}`),Q.push(`  Size: ${A.bytes} bytes`),{lines:Q,incrementStep:!0};case"rule-check":{if(Q.push(""),Q.push(`STEP ${B} ${Z.h} Match rules`),Q.push(`  Rule:   ${A.rule}()`),A.matched)Q.push("  Result: MATCHED");else Q.push("  Result: No match");return{lines:Q,incrementStep:!0}}case"worktree-relaxation":return Q.push(""),Q.push(`STEP ${B} ${Z.h} Worktree relaxation`),Q.push(`  Mode:   ${n.worktree.name}`),Q.push(`  Git cwd: ${A.gitCwd}`),Q.push("  Result: Allowed local discard in linked worktree"),{lines:Q,incrementStep:!0};case"temp-root-relaxation":return Q.push(""),Q.push(`STEP ${B} ${Z.h} Temp-root relaxation`),Q.push(`  Git cwd: ${A.gitCwd}`),Q.push("  Result: Allowed git discard in a temp-root repository"),{lines:Q,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(A.embeddedCommandFound)return Q.push(""),Q.push(`STEP ${B} ${Z.h} Fallback scan`),Q.push(`  Found: ${A.embeddedCommandFound}`),{lines:Q,incrementStep:!0};return null}case"custom-rules-check":{if(A.rulesChecked){if(Q.push(""),Q.push(`STEP ${B} ${Z.h} Custom rules`),A.matched)Q.push("  Result: MATCHED");else Q.push("  Result: No match");return{lines:Q,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(A.matched)return Q.push(""),Q.push(`STEP ${B} ${Z.h} Dangerous text check`),Q.push(`  Token:  ${A.token}`),Q.push("  Result: MATCHED"),{lines:Q,incrementStep:!0};return null}case"strict-unparseable":return Q.push(""),Q.push(`STEP ${B} ${Z.h} Strict mode check`),Q.push(`  Command: ${A.rawCommand}`),Q.push("  Result:  ✗ UNPARSEABLE"),{lines:Q,incrementStep:!0};case"segment-skipped":return null;case"error":return Q.push(""),Q.push(`ERROR: ${A.message}`),{lines:Q,incrementStep:!1};default:return A}}function vi(A,B){let Z=fd(B?.asciiOnly??!1),Q=58,ee=[],te=1;ee.push(...md(Z,58)),ee.push("");let se=A.trace.steps.find((Oe)=>Oe.type==="error");if(se&&se.type==="error"){ee.push("ERROR"),ee.push(`  ${se.message}`),ee.push(""),ee.push("RESULT"),ee.push(`  Status: ${A.result==="blocked"?We.red("BLOCKED"):We.green("ALLOWED")}`),ee.push(""),ee.push("CONFIG");let Oe=A.configSource??"none";return ee.push(`  Path: ${Oe}`),ee.join(`
`)}let me=A.trace.steps.find((Oe)=>Oe.type==="parse");if(me&&me.type==="parse"){ee.push("INPUT"),ee.push(`  ${me.input}`),ee.push(""),ee.push(`STEP ${te} ${Z.h} Split shell commands`),te++;for(let Oe=0;Oe<me.segments.length;Oe++){let Le=me.segments[Oe];if(Le){let je=Math.random();ee.push(`  Segment ${Oe+1}: ${gd(Le,je)}`)}}}let ye=A.trace.segments,Re=ye.length>1;for(let Oe of ye){if(Re){ee.push("");let Xe="";if(me&&me.type==="parse"){let Xo=me.segments[Oe.index];if(Xo)Xe=Xo.join(" ")}let rn=54,an=Xe,en=` Segment ${Oe.index+1}: `,on=" ";if(Xe){if(en.length+Xe.length+on.length>rn){let Pf=rn-en.length-on.length;an=`${Xe.substring(0,Pf-1)}…`}}let Sn=Xe?`${en}${an}${on}`:` Segment ${Oe.index+1} `,jt=Xe?`${en}${We.cyan(an)}${on}`:Sn,ea=58-Sn.length,na=Math.floor(ea/2),Sf=ea-na;ee.push(`${Z.sh.repeat(na)}${jt}${Z.sh.repeat(Sf)}`)}if(Oe.steps.find((Xe)=>Xe.type==="segment-skipped")){ee.push(""),ee.push("  (skipped — prior segment blocked)");continue}let je=!1,nn=!1;for(let Xe of Oe.steps){let rn=hd(Xe,te,Z);if(rn){if(nn=!0,Xe.type==="recurse"){ee.push("");let an=" RECURSING ",en=58-an.length-4;ee.push(`  ${Z.tl}${Z.h}${an}${Z.h.repeat(en)}`),ee.push(`  ${Z.v}`),je=!0;continue}for(let an of rn.lines)if(je)ee.push(`  ${Z.v} ${an}`);else ee.push(an);if(rn.incrementStep)te++}}if(je)ee.push(`  ${Z.v}`),ee.push(`  ${Z.bl}${Z.h.repeat(56)}`);if(!nn)ee.push(""),ee.push(`  ${We.green("✓")} Allowed (no matching rules)`)}if(ee.push(""),ee.push("RESULT"),A.result==="blocked"){if(ee.push(`  Status: ${We.red("BLOCKED")}`),A.customRule){if(ee.push(`  Rule: ${A.customRule.id}`),A.customRule.rulebook)ee.push(`  Rulebook: ${A.customRule.rulebook.name} ${A.customRule.rulebook.version}`);if(A.customRule.source)ee.push(`  Source: ${A.customRule.source}`);if(A.customRule.override)ee.push(`  Override: reason ${A.customRule.override.reason}`)}if(A.reason){let Oe=Cr(A.reason,"          ");ee.push(`  Reason: ${Oe[0]}`);for(let Le=1;Le<Oe.length;Le++)ee.push(Oe[Le]??"")}}else ee.push(`  Status: ${We.green("ALLOWED")}`);ee.push(""),ee.push("CONFIG");let _e=A.configSource??"none",Ae=A.configValid?"":" (invalid)";ee.push(`  Path: ${_e}${Ae}`);let De=A.safetyPresetScope;ee.push(`  Safety preset: ${A.selectedPreset??"standard"}${De?` (${Mr(De)})`:""}`),ee.push(`  Effective capabilities: ${A.effectiveLevel}`);let Ne=Object.entries(A.destructiveCommandRuleOverrides??{});if(ee.push(`  Rule customizations: ${Ne.length}`),A.ruleActivation)ee.push(`  Rule activation: ${A.ruleActivation.id} — ${A.ruleActivation.enabled?"on":"off"} via ${A.ruleActivation.source}`);return ee.join(`
`)}function bi(A){return JSON.stringify(A,null,2)}import{resolve as Wy}from"node:path";var yd=512,vd={maxTextLength:2048,maxListLength:128,maxObjectProperties:128,maxDepth:16},Ky=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function Ci(A){let B=0,Z={allocateSegment(){return B++},getNextSegmentIndex(){return B},branch(){let Q=A.fork(),ee=Ci(Q);return{trace:ee,adopt(){A.replaceSegmentEvents(Q.finish().events),B=ee.getNextSegmentIndex()}}},recordGlobal(Q){A.record({scope:"global",step:Q})},recordSegment(Q,ee=Z.currentSegmentIndex){if(ee===void 0)return;A.record({scope:"segment",segmentIndex:ee,step:Q})}};return Z}function xi(A=new Set){let B=[];return{record(Z){if(B.length>=yd)return;Eo(Z.step,A,vd),B.push({...Z,step:wi(Z.step,vd,A)})},fork(){return xi(A)},replaceSegmentEvents(Z){B.splice(0,B.length,...[...B.filter((Q)=>Q.scope==="global"),...Z].slice(0,yd))},finish(){return{events:B}}}}function Eo(A,B,Z,Q=0,ee=new WeakSet){if(typeof A==="string"){let me=A.slice(0,Z.maxTextLength);if(!mt(me))return;for(let ye of At(me))for(let Re of ye.match(/[^\s"'()$]+/g)??[])B.add(bd(Re));return}if(!A||typeof A!=="object"||Q>=Z.maxDepth||ee.has(A))return;if(ee.add(A),Array.isArray(A)){let me=Math.min(A.length,Z.maxListLength);for(let ye=0;ye<me;ye++)Eo(A[ye],B,Z,Q+1,ee);return}let te=0,se=new Set;for(let me in A){if(!Object.hasOwn(A,me))continue;if(te>=Z.maxObjectProperties)break;te++,Eo(me,B,Z);let ye=ki(me,Z,B);if(se.has(ye))continue;se.add(ye),Eo(A[me],B,Z,Q+1,ee)}}function wi(A,B,Z,Q=0,ee=new WeakSet){if(typeof A==="string")return ki(A,B,Z);if(!A||typeof A!=="object")return A;if(Q>=B.maxDepth)return;if(ee.has(A))return;if(ee.add(A),Array.isArray(A)){let me=[],ye=Math.min(A.length,B.maxListLength);for(let Re=0;Re<ye;Re++)me.push(wi(A[Re],B,Z,Q+1,ee));return me}let te={},se=0;for(let me in A){if(!Object.hasOwn(A,me))continue;if(se>=B.maxObjectProperties)break;se++;let ye=ki(me,B,Z);if(Object.hasOwn(te,ye))continue;Object.defineProperty(te,ye,{value:wi(A[me],B,Z,Q+1,ee),enumerable:!0,configurable:!0,writable:!0})}return te}function ki(A,B,Z){let Q=A.slice(0,B.maxTextLength),ee=mt(Q)?ft(Q):Q,te=Z.size>0?Jy(ee,Z):ee;return(zy(te)?Ge(te):te).slice(0,B.maxTextLength)}function zy(A){return A.includes("PRIVATE KEY")||A.includes("://")||A.includes("eyJ")||A.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(A)||A.length>=14&&Ky.some((B)=>A.includes(B))||A.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(A)}function Jy(A,B){return A.replace(/[^\s"'()$]+/g,(Z)=>B.has(bd(Z))?"<redacted>":Z)}function bd(A){let B=2166136261,Z=2166136261;for(let Q=0;Q<A.length;Q++)B=Math.imul(B^A.charCodeAt(Q),16777619),Z=Math.imul(Z^A.charCodeAt(A.length-Q-1),16777619);return`${B>>>0}:${Z>>>0}:${A.length}`}function xr(A,B={},Z){let Q=Wy(B.cwd??process.cwd()),ee=B.policySnapshot??S(Z,{cwd:Q,userConfigDir:B.userConfigDir}),te=E(ee.policy,Z.env),se=Te({policySnapshot:ee,effectiveCapabilities:te.capabilities,worktreeMode:te.worktreeMode}),me={effectiveLevel:se.effectiveLevel,selectedPreset:ee.policy.safety.level,...ee.policyScopes?{safetyPresetScope:ee.policyScopes.levelScope}:{},effectiveCapabilities:se.effectiveCapabilities,destructiveCommandRuleOverrides:ee.policy.destructiveCommandRuleOverrides},{configSource:ye,configValid:Re}=Zy(Z,{cwd:Q,userConfigDir:B.userConfigDir});if(!A||!A.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:ye,configValid:Re,...me};let _e=B.shell??"auto",Ae=k(A,_e);if(Ae.status==="limited")throw new w;let De=_e==="auto"&&Ae.dialect==="powershell"?k(A,"posix"):Ae,Ne=Ht(De),Oe=xi(),Le=Ci(Oe);Le.recordGlobal({type:"parse",input:A,segments:Ne.map((jt)=>[...jt])});let je=u("Bash",{command:A},{kind:"command",shell:_e},{configCwd:Q,executionCwd:Q},A),nn=U(je,{environment:Z,trace:Le,dependencies:{loadPolicySnapshot:()=>ee}}),Xe=nn.decision.kind==="deny"?nn.decision:null;if(Xe&&(nn.stage==="policy-protection"||nn.stage==="secret-protection"))return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:Yy(Xe),matched:!0,reason:Xe.reason}]}]},result:"blocked",reason:I(Xe.reason),segment:I(wd(Xe,A)),ruleId:I(Xe.ruleId),configSource:ye,configValid:Re,...me};let rn=Le.getNextSegmentIndex();if(Xe&&rn>0&&rn<Ne.length)Le.recordSegment({type:"segment-skipped",index:rn,reason:"prior-segment-blocked"},rn);let an=Oe.finish(),en=Xe?.ruleId??Xy(je,ee,te,Z),on=J.find((jt)=>jt.id===en&&jt.activationCapability),Sn=on?se.policy.effectiveDestructiveCommandRules[on.id]:void 0;return{trace:ev(an),result:Xe?"blocked":"allowed",reason:Xe?I(Xe.reason):void 0,segment:Xe?I(wd(Xe,A)):void 0,ruleId:Xe?I(Xe.ruleId):void 0,customRule:Qy(nv(Xe?.ruleId,ee)),configSource:ye,configValid:Re,...me,...on&&Sn?{ruleActivation:{id:on.id,...Sn}}:{}}}function wd(A,B){return A.evidence?.segment??B}function Yy(A){if(A.reason===ot)return"policy-protection:findPolicyConfigMutationTargetInSemanticFacts";if(A.reason===rt)return"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts";if(A.reason===y)return"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts";return"secret-protection:findSensitiveTargetInSemanticFacts"}function Zy(A,B){let Z=O(B.cwd),Q=V(A,B),ee=re(A,{cwd:B.cwd,userConfigDir:B.userConfigDir});try{if(r(ee.projectConfigTarget)!==null){if(Fn(ee.projectConfigTarget).errors.length===0)return{configSource:Z,configValid:!0};return{configSource:Z,configValid:!1}}}catch(te){if(te instanceof o)return{configSource:Z,configValid:!1};throw te}try{if(r(ee.userConfigTarget)!==null){let te=Fn(ee.userConfigTarget);return{configSource:Q,configValid:te.errors.length===0}}return{configSource:null,configValid:!0}}catch(te){if(te instanceof o)return{configSource:Q,configValid:!1};throw te}}function Xy(A,B,Z,Q){let ee=B.policy,te=he({...ee,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...ee.destructiveCommandRuleOverrides,...Object.fromEntries(J.flatMap((me)=>me.activationCapability?[[me.id,"on"]]:[]))}},B.state==="degraded"?{diagnostics:B.diagnostics,reason:B.reason}:void 0),se=U(A,{environment:Q,dependencies:{loadPolicySnapshot:()=>te,getModes:()=>({...Z,strict:!0,paranoidRm:!0,paranoidInterpreters:!0,capabilities:{fail_closed:{...Z.capabilities.fail_closed,enabled:!0},paranoid_rm:{...Z.capabilities.paranoid_rm,enabled:!0},paranoid_interpreters:{...Z.capabilities.paranoid_interpreters,enabled:!0}}}),findSensitiveTarget:()=>null}});return se.decision.kind==="deny"?se.decision.ruleId:void 0}function Qy(A){if(!A)return;return{id:I(A.id),...A.rulebook?{rulebook:{name:I(A.rulebook.name),version:I(A.rulebook.version)}}:{},...A.source?{source:I(A.source)}:{},...A.override?{override:{type:"reason",reason:I(A.override.reason)}}:{}}}function ev(A){let B=A.events.flatMap((Q)=>Q.scope==="global"?[Q.step]:[]),Z=new Map;for(let Q of A.events){if(Q.scope!=="segment")continue;let ee=Z.get(Q.segmentIndex)??{index:Q.segmentIndex,steps:[]};ee.steps.push(Q.step),Z.set(Q.segmentIndex,ee)}return{steps:B,segments:[...Z.values()]}}function nv(A,B){let Z=A?.replace(/^custom\./,"");if(!Z||!B.policy.rules.some((Q)=>Q.name===Z))return;return B.ruleMetadata[Z]??Object.freeze({id:Z})}function kd(A){return new Promise((B)=>{process.stdout.write(`${A}
`,()=>B())})}async function Cd(A,B){let Z=hi(B);if(!Z)return 1;try{let Q=xr(Z.command,{cwd:Z.cwd,shell:Z.shell},A),ee=!!process.env.NO_COLOR||!process.stdout.isTTY;return await kd(Z.json?bi(Q):vi(Q,{asciiOnly:ee})),0}catch(Q){let ee=tv(Q instanceof g?Q.cause:Q);if(ee===void 0)throw Q;if(Z.json)return await kd(JSON.stringify({error:ee})),1;return console.error(ee),1}}function tv(A){if(A instanceof w)return A.message;if(A instanceof j)return A.message;if(A instanceof h)return A.message;if(A instanceof s&&c[A.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var xd="2.8.3",xn="  ",xt="cc-safety-net";function Sd(A){return A.argument?`${A.flags} ${A.argument}`:A.flags}function rv(A){return Math.max(...A.map((B)=>Sd(B).length))}function ov(A){return Math.max(...A.map((B)=>B.usage.length))}function sv(A){return Math.max(...A.map((B)=>`${xt} ${B.usage}`.length))}function iv(A,B){let Z=`${xt} ${A.usage}`;return`${xn}${Z.padEnd(B+2)}${A.description}`}function _n(A,B){return`${xn}${A.padEnd(Math.max(40,A.length+2))}${B}`}function tr(A,B=console.log){let Z=[];if(Z.push(`${xt} ${A.name}`),Z.push(""),Z.push(`${xn}${A.description}`),Z.push(""),Z.push("USAGE:"),Z.push(`${xn}${xt} ${A.usage}`),Z.push(""),A.subcommands&&A.subcommands.length>0){Z.push("SUBCOMMANDS:");let Q=ov(A.subcommands);for(let ee of A.subcommands)Z.push(`${xn}${ee.usage.padEnd(Q+2)}${ee.description}`);Z.push("")}if(A.options.length>0){Z.push("OPTIONS:");let Q=rv(A.options);for(let ee of A.options){let te=Sd(ee),se=ee.default?`${ee.description} (default: ${ee.default})`:ee.description;Z.push(`${xn}${te.padEnd(Q+2)}${se}`)}Z.push("")}if(A.examples&&A.examples.length>0){Z.push("EXAMPLES:");for(let Q of A.examples)Z.push(`${xn}${Q}`)}B(Z.join(`
`))}function Si(){let A=sv(jr),B=[];B.push(`${xt} v${xd}`),B.push(""),B.push("Blocks destructive commands and secret access."),B.push(""),B.push("COMMANDS:");for(let Z of jr)B.push(iv(Z,A));B.push(""),B.push("GLOBAL OPTIONS:"),B.push(`${xn}-h, --help       Show help (use with command for command-specific help)`),B.push(`${xn}-V, --version    Show version`),B.push(""),B.push("HELP:"),B.push(`${xn}${xt} help <command>     Show help for a specific command`),B.push(`${xn}${xt} <command> --help   Show help for a specific command`),B.push(""),B.push("ENVIRONMENT VARIABLES:"),B.push(_n(`${n.level.name}=standard|strict|paranoid`,"Set session safety level")),B.push(_n(`${n.worktree.name}=1`,"Allow local git discards in linked worktrees")),B.push(_n(`${n.debug.name}=1`,"Print diagnostic messages to stderr")),B.push(_n(`${n.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),B.push(_n(`${n.projectTightenOnly.name}=1`,"Ignore project policy settings that weaken the user policy")),B.push(_n("CC_SAFETY_NET_HOME","Override rule config home directory")),B.push(""),B.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),B.push(_n(`${n.strict.name}=1`,"Force safety.overrides.fail_closed on")),B.push(_n(`${n.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),B.push(_n(`${n.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),B.push(_n(`${n.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),B.push(""),B.push("Documentation:        https://ccsafetynet.com/docs"),console.log(B.join(`
`))}function Pd(){console.log(xd)}function Sr(A,B=console.log){let Z=Fr(A);if(!Z)return!1;if(Z.name.toLowerCase()!==A.toLowerCase())return!1;return tr(Z,B),!0}import{existsSync as Do,readFileSync as Eu}from"node:fs";import{join as $o}from"node:path";import*as Bn from"node:readline";function av(A){return A==="install"?"Install":"Uninstall"}function lv(A){return A==="install"?"Installing":"Uninstalling"}function cv(A){return A==="install"?"into":"from"}function _d(A){return A?.available===!0}function dv(A,B){let Z=new Set(B);return A.filter((Q)=>Z.has(Q.target)).map((Q)=>Q.target)}function Rd(A,B,Z){if(A.every((Q)=>!Q.available))return B;return Array.from({length:A.length},(Q,ee)=>ee+1).map((Q)=>(B+Q*Z+A.length)%A.length).find((Q)=>_d(A[Q]))}function uv(A,B,Z){if(Z.ctrl&&Z.name==="c")return"interrupt";if(Z.name==="escape"||B==="q")return"abort";if(A==="install"&&(B==="u"||B==="U"))return"update";if(Z.name==="up"||B==="k")return"up";if(Z.name==="down"||B==="j")return"down";if(Z.name==="space"||B===" ")return"toggle";if(Z.name==="return"||Z.name==="enter")return"confirm";return null}function pv(A){return{cursor:A.findIndex((B)=>B.available),selected:[]}}function fv(A,B,Z){if(Z==="confirm"||Z==="update"||Z==="abort"||Z==="interrupt")return{state:A,done:Z};if(Z==="up")return{state:{...A,cursor:Rd(B,A.cursor,-1)}};if(Z==="down")return{state:{...A,cursor:Rd(B,A.cursor,1)}};let Q=B[A.cursor];if(!_d(Q))return{state:A};let ee=A.selected.includes(Q.target)?A.selected.filter((te)=>te!==Q.target):dv(B,[...A.selected,Q.target]);return{state:{...A,selected:ee}}}var Td="◉",Ad="◯",Id=">",Od=" ";function mv(A,B,Z){return["",`${av(A)} CC Safety Net ${cv(A)}:`,"",...B.map((Q,ee)=>{let te=Z.selected.includes(Q.target),se=ee===Z.cursor,me=te?Td:Ad,ye=se?Id:Od,Re=Q.available?"":` (${Q.unavailableReason??"not installed"})`,_e=`${me} ${Q.label}${Re}`,Ae=!Q.available?We.dim(_e):te?We.green(_e):se?We.bold(_e):_e;return`${ye} ${Ae}`}),"",A==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":B.some((Q)=>Q.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${A}. q/Esc: close`].join(`
`)}var Ed=["global-hook","plugin"];function gv(A,B,Z={}){let Q=Z.color!==!1?We.bold:(te)=>te;return["","Install the Kimi Code integration as:","",...[`Global hook — ${B?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((te,se)=>{let me=se===A,ye=`${me?Td:Ad} ${te}`;return`${me?Id:Od} ${me?Q(ye):ye}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function $d(A){let{input:B,output:Z}=A;Bn.emitKeypressEvents(B);let Q=B.isRaw===!0;B.setRawMode(!0),B.resume();let ee=0,te=()=>{if(ee===0)return;Bn.moveCursor(Z,0,-ee),Bn.cursorTo(Z,0),Bn.clearScreenDown(Z)},se=()=>{te();let me=A.render();Z.write(`${me}
`),ee=me.split(`
`).length};return new Promise((me)=>{let ye=(_e)=>{B.off("keypress",Re),B.setRawMode(Q),B.pause(),te(),me(_e)};function Re(_e,Ae){A.onKey(_e,Ae,{finish:ye,draw:se})}B.on("keypress",Re),se()})}function Dd(A={}){let B=0;return $d({input:A.input??process.stdin,output:A.output??process.stdout,render:()=>gv(B,A.globalHookInstalled===!0),onKey:(Z,Q,ee)=>{if(Q.ctrl&&Q.name==="c"){ee.finish(null),(A.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(Q.name==="escape"||Z==="q")return ee.finish(null);if(Q.name==="return"||Q.name==="enter")return ee.finish(Ed[B]);if(Q.name==="up"||Q.name==="down"||Z==="k"||Z==="j")B=(B+1)%Ed.length,ee.draw()}})}function Pi(A=process.stdin,B=process.stdout){return Boolean(A.isTTY&&B.isTTY&&typeof A.setRawMode==="function")}function Nd(A,B,Z={}){let Q=Z.output??process.stdout,ee=pv(B);return $d({input:Z.input??process.stdin,output:Q,render:()=>mv(A,B,ee),onKey:(te,se,me)=>{let ye=uv(A,te,se);if(!ye)return;let Re=fv(ee,B,ye);if(ee=Re.state,Re.done==="interrupt"){me.finish(null),(Z.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(Re.done==="abort")return me.finish(null);if(Re.done==="update")return me.finish("update");if(Re.done==="confirm"){if(ee.selected.length===0){Q.write("\x07"),me.draw();return}me.finish([...ee.selected]),Q.write(`${lv(A)} selected integrations...
`);return}me.draw()}})}import{existsSync as Ld,lstatSync as yv,mkdirSync as vv,mkdtempSync as bv,readdirSync as wv,readFileSync as or,rmSync as To}from"node:fs";import{basename as kv,dirname as Cv,join as bn}from"node:path";import{fileURLToPath as xv}from"node:url";var Ri="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",_t="cc-safety-net",Tt="cc-safety-net/index.ts";import{spawn as hv}from"node:child_process";var Ei=(A,B)=>{let Z=Jn([...A],process.env);return new Promise((Q)=>{let ee=hv(Z.cmd,Z.args,{cwd:B,stdio:["ignore","pipe","pipe"],windowsVerbatimArguments:Z.windowsVerbatimArguments}),te=xs(ee),se=!1,me=setTimeout(()=>{se=!0,ee.kill()},120000);ee.on("error",(ye)=>{clearTimeout(me),Q({status:null,errorCode:ye.code,stdout:te.stdout,stderr:[ye.message,te.stderr].filter(Boolean).join(`
`)})}),ee.on("close",(ye)=>{clearTimeout(me),Q({status:se?null:ye,errorCode:se?"ETIMEDOUT":void 0,stdout:te.stdout,stderr:te.stderr})})})};var rr="cc-safety-net.ts",_i=bn("amp",Tt);function Sv(A){return bn(A.home,".config","amp","plugins","cc-safety-net.ts")}function Pv(){let A=Cv(xv(import.meta.url)),B=bn(A,_i),Z=bn(A,"..",_i),Q=bn(A,"..","..","..","dist",_i);return[B,Z,Q]}function Rv(A=Pv()){let B=A.find((Z)=>Ld(Z)&&yv(Z).isFile());if(!B)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return B}function jd(A){try{return JSON.parse(A)}catch{return}}function Ao(A){return A.subarray(0,Buffer.byteLength(Ri)).toString("utf-8")===Ri}async function Pr(A,B,Z){let Q=await A(B,Z);if(Q.status===0)return Q;throw Error([`Failed to run ${B.join(" ")}${Q.status===null?"":` (exit ${Q.status})`}.`,[Q.stdout,Q.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Fd(A){let B=await A(["amp","plugins","repositories","--json"]);if(B.status===null)throw Error(`${B.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${B.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${B.stderr}`.trim());if(B.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${B.status}). Sign in with "amp login" and rerun install --amp.
${[B.stdout,B.stderr].filter(Boolean).join(`
`)}`.trim());let Z=jd(B.stdout),Q=(Array.isArray(Z)?Z:[]).filter((ee)=>t(ee,"scope")==="user"&&t(ee,"exists")===!0&&t(ee,"viewerCanWrite")===!0).map((ee)=>t(ee,"cloneRef")).find((ee)=>typeof ee==="string"&&ee.length>0);if(!Q)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return Q}async function Hd(A,B,Z){let Q=bv(bn(B.tmpdir,"cc-safety-net-amp-"));try{return await Pr(A,["amp","clone","user-plugins",Q]),await Z(Q)}finally{To(Q,{recursive:!0,force:!0})}}function Ti(A){return`rerun ${A==="overwrite"?"install":"uninstall"} --amp`}function Md(A,B,Z){let Q=bn(A,B),ee=l(Q);if(!ee)return;if(ee.isSymbolicLink()||!ee.isFile())throw Error(`Refusing to ${Z} ${B} in your Amp personal plugins repository: not a regular file. Remove it there and ${Ti(Z)}.`);let te=or(Q);if(Ao(te))return te;throw Error(`Refusing to ${Z} unmanaged file ${B} in your Amp personal plugins repository. Remove it there and ${Ti(Z)}.`)}function Ud(A,B){let Z=bn(A,_t),Q=l(Z);if(!Q)return;if(Q.isSymbolicLink()||!Q.isDirectory())throw Error(`Refusing to ${B} ${_t} in your Amp personal plugins repository: not a regular directory. Remove it there and ${Ti(B)}.`);return Md(A,Tt,B)}function Ev(A){let B=bn(A,rr),Z=l(B);if(!Z||Z.isSymbolicLink()||!Z.isFile())return;let Q=or(B);return Ao(Q)?Q:void 0}async function Bd(A,B,Z,Q){if(await Pr(A,Z,B),(await Pr(A,["git","status","--porcelain"],B)).stdout.trim()==="")return!1;return await Pr(A,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",Q],B),await Pr(A,["git","push","origin","HEAD"],B),!0}function _o(A,B){_v(A,B),Tv(A,B)}function Gd(A,B){if(B==="keep")return;throw Error(`Local Amp plugin ${A} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function _v(A,B){let Z=Sv(A),Q=l(Z);if(!Q)return;if(!Q.isSymbolicLink()&&Q.isFile()&&Ao(or(Z))){To(Z);return}Gd(Z,B)}function Tv(A,B){let Z=bn(A.home,".config","amp","plugins",_t),Q=l(Z);if(!Q)return;if(!Q.isSymbolicLink()&&Q.isDirectory()&&Av(Z)){To(Z,{recursive:!0});return}Gd(Z,B)}function Av(A){let B=kv(Tt);if(wv(A).join("\x00")!==B)return!1;let Z=bn(A,B),Q=l(Z);return!!Q&&!Q.isSymbolicLink()&&Q.isFile()&&Ao(or(Z))}function Iv(A){let B=d(A);if(!Ld(B))return"";let Z=jd(or(B,"utf-8"));if(!Z||typeof Z!=="object"||Array.isArray(Z))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(P(Z,A.home))};
`}async function qd(A,B=Rv(),Z=Ei){let Q=Buffer.concat([or(B),Buffer.from(Iv(A),"utf-8")]),ee=await Fd(Z);return Hd(Z,A,async(te)=>{let se=`${ee}/${_t}`,me=Ud(te,"overwrite"),ye=Md(te,rr,"overwrite");if(me?.equals(Q)&&!ye)return _o(A,"fail"),{path:se,alreadyInstalled:!0};if(vv(bn(te,_t),{recursive:!0}),sn(bn(te,Tt),Q),ye)To(bn(te,rr));let Re=await Bd(Z,te,["git","add","--",Tt,...ye?[rr]:[]],`chore: update cc-safety-net plugin to v${dn()}`);return _o(A,"fail"),{path:se,alreadyInstalled:!Re}})}async function Vd(A,B=Ei){let Z=await Fd(B);return Hd(B,A,async(Q)=>{let ee=Ud(Q,"remove"),te=Ev(Q),se=`${Z}/${te&&!ee?rr:_t}`;if(!ee&&!te)return _o(A,"keep"),{path:se,alreadyInstalled:!1};return await Bd(B,Q,["git","rm","--",...ee?[Tt]:[],...te?[rr]:[]],`chore: remove cc-safety-net plugin v${dn()}`),_o(A,"keep"),{path:se,alreadyInstalled:!0}})}import{existsSync as Ai,readFileSync as Ov}from"node:fs";var $v=vn["antigravity-cli"],Dv="https://github.com/kenryu42/cc-safety-net/tree/plugin";function Io(A){return Boolean(A)&&typeof A==="object"&&!Array.isArray(A)}function Kd(A){return{commands:[["agy","plugin","install",Dv],...ys(A.home)?[["agy","plugin","enable",ur]]:[]],update:Ai(Qr(A.home))}}function zd(A){return{commands:Ai(Qr(A.home))?[["agy","plugin","uninstall",ur]]:[],afterUninstall:()=>{Ii(A)}}}function Nv(A){let B=!1;for(let Z of Object.values(A)){if(!Io(Z)||!Array.isArray(Z.PreToolUse))continue;Z.PreToolUse=Z.PreToolUse.flatMap((Q)=>{if(!Io(Q)||!Array.isArray(Q.hooks))return[Q];let ee=Q.hooks.filter((te)=>!Io(te)||te.command!==$v);if(ee.length!==Q.hooks.length)B=!0;return ee.length===0?[]:[{...Q,hooks:ee}]})}return B}function Ii(A){let B=Xr(A.home);if(!Ai(B))return;let Z=Lv(B);if(!Nv(Z))return;return sn(B,`${JSON.stringify(Z,null,2)}
`),`Removed the legacy Antigravity CLI hook from ${B}`}function Lv(A){try{let B=JSON.parse(Ov(A,"utf-8"));if(!Io(B))throw Error("Antigravity hooks config must be a JSON object");return B}catch(B){if(B instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${A}: ${B.message}`);throw B}}import{existsSync as Di,readlinkSync as Mv}from"node:fs";import{join as Gn}from"node:path";import{spawn as jv}from"node:child_process";var Tn=Cn.map((A)=>({target:A.id,flag:A.flag,label:ln(A.id),probeCommand:A.probeCommand}));function Oi(A){let B=new Set(A);return Tn.map((Z)=>Z.target).filter((Z)=>B.has(Z))}async function Jd(A,B){for(let Z of A)await B(Z)}var Fv=5000;function Rr(A){return A.join(" ")===ar.join(" ")?Hv(A):Ya(A[0],process.env)}function Hv(A){return new Promise((B)=>{let Z=Jn([...A],process.env),Q=jv(Z.cmd,Z.args,{env:process.env,stdio:"ignore",windowsVerbatimArguments:Z.windowsVerbatimArguments}),ee=!1,te=(me)=>{if(ee)return;ee=!0,clearTimeout(se),B(me)},se=setTimeout(()=>{Q.kill(),te(!1)},Fv);Q.on("error",()=>te(!1)),Q.on("close",(me)=>te(me===0))})}function Wd(A=Rr,B={}){let Z=new Set(B.configuredTargets??[]);return Promise.all(Tn.map(async(Q)=>({target:Q.target,flag:Q.flag,label:Q.label,...Zd(B.action,await A(Q.probeCommand)||Q.target==="cursor"&&await A(fa),Z.has(Q.target))})))}function Yd(A,B){let Z=new Set(B.configuredTargets??[]);return A.map((Q)=>({...Q,...Zd(B.action,Q.available,Z.has(Q.target))}))}function Zd(A,B,Z){if(A==="uninstall")return Z?{available:!0}:{available:!1,unavailableReason:"not installed"};if(A==="install"&&Z)return{available:!1,unavailableReason:"already installed"};if(!B)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}var qn="cc-safety-net",nu=["npx","-y","@deepseek-ai/dsh"],Xd="DeepSeek Harness",Qd=["@deepseek-ai","dsh-desktop"],tu="Quit DeepSeek Harness Desktop, then run this command again: Desktop plugins can only change while it is closed.",$i=(A)=>`DeepSeek Harness Desktop is not in its default location, so ${A} ${qn} from its Plugins page.`,ru=(A,B)=>Di(Gn(Ie(A),B,"package.json"));function Ni(A,B){let Z=B.platform??process.platform,Q=ru(A,"desktop"),ee=Z==="darwin"?[Gn(A.home,"Applications"),B.systemApplications??"/Applications"].map((te)=>Gn(te,`${Xd}.app`,"Contents","Resources","runtime","cli","bin","dsh")):Z==="win32"?[Gn(A.env.get("LOCALAPPDATA")||Gn(A.home,"AppData","Local"),"Programs",Xd,"resources","runtime","cli","bin","dsh.cmd")]:[];return{profile:Q,cli:Q?ee.find((te)=>Di(te)):void 0}}function ou(A,B=process.platform){if(B==="win32")return Di(Gn(A.env.get("APPDATA")||Gn(A.home,"AppData","Roaming"),...Qd,"lockfile"));let Z=Uv(Gn(A.home,"Library","Application Support",...Qd,"SingletonLock")),Q=Number(/-(\d+)$/.exec(Z??"")?.[1]);return Number.isInteger(Q)&&Q>0&&Bv(Q)}function Uv(A){try{return Mv(A)}catch{return}}function Bv(A){try{return process.kill(A,0),!0}catch(B){return B.code==="EPERM"}}async function su(A,B={}){let Z=Ni(A,B);if(Z.cli&&ou(A,B.platform))throw Error(tu);let Q=!Z.cli||ru(A,"web")||await(B.probe??Rr)(ar),ee=[...Z.cli?[{profile:"desktop",label:"Desktop",dsh:[Z.cli]}]:[],...Q?[{profile:"web",label:"web",dsh:nu}]:[]];return{commands:ee.map((te)=>[...te.dsh,"plugin","--profile",te.profile,"add",`${qn}@${dn()}`]),afterInstall:async()=>{let te=new Set(dt(A).filter((me)=>me.enabled).map((me)=>me.name)),se=ee.filter((me)=>!te.has(me.profile));if(se.length>0)throw Error(`DeepSeek Harness installed ${qn} in the ${eu(se)} but did not enable it. Enable it from the Plugins page.`)},message:[`Added ${qn} to the DeepSeek Harness ${eu(ee)}.`,...Z.profile&&!Z.cli?[$i("add")]:[]].join(`
`)}}function eu(A){return`${A.map((B)=>B.label).join(" and ")} profile${A.length>1?"s":""}`}function iu(A,B={}){let Z=new Set(dt(A).map((te)=>te.name));if(!Z.has("desktop")&&!Z.has("web"))throw Error(`${qn} is not installed in the DeepSeek Harness web or Desktop profile`);let Q=Z.has("desktop")?Ni(A,B).cli:void 0,ee=Z.has("desktop")&&!Q;if(ee&&!Z.has("web"))throw Error($i("remove"));if(Q&&ou(A,B.platform))throw Error(tu);return{commands:[...Q?[[Q,"plugin","--profile","desktop","remove",qn]]:[],...Z.has("web")?[[...nu,"plugin","--profile","web","remove",qn]]:[]],...ee?{afterUninstall:()=>{throw Error(`Removed ${qn} from the DeepSeek Harness web profile, but ${$i("remove")}`)}}:{}}}function au(A,B,Z={}){let Q=Ni(B,Z).cli!==void 0;return A.map((ee)=>ee.target==="deepseek-harness"&&Q?{...ee,available:!0,unavailableReason:void 0}:ee)}import{existsSync as Gv,readdirSync as qv,rmSync as Vv}from"node:fs";import{join as Kv}from"node:path";function lu(A,B=process.platform,Z){if(!Gv(A))return;let Q=B==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);qv(A).filter((ee)=>ee!==Z&&Q.test(ee)).forEach((ee)=>{Vv(Kv(A,ee),{recursive:!0,force:!0})})}import{existsSync as cu,readdirSync as zv,rmSync as Jv}from"node:fs";import{join as sr}from"node:path";function Oo(A,B=process.platform){let Z=sr(A.env.get("npm_config_cache")||(B==="win32"?sr(A.env.get("LOCALAPPDATA")||sr(A.home,"AppData","Local"),"npm-cache"):sr(A.home,".npm")),"_npx");if(!cu(Z))return;zv(Z).filter((Q)=>cu(sr(Z,Q,"node_modules","cc-safety-net"))).forEach((Q)=>{Jv(sr(Z,Q),{recursive:!0,force:!0})})}import{existsSync as gu,mkdirSync as Yv,readFileSync as hu}from"node:fs";import{dirname as Zv,join as mu}from"node:path";function Wv(A,B){if(A[B]!=="#")return B;let Z=A.indexOf(`
`,B+1);return Z===-1?A.length:Z+1}function Li(A,B,Z){let Q=new RegExp(`^(\\s*)${B}\\s*=\\s*\\[`),ee=0;for(let te of A.split(`
`)){if(/^\s*\[/.test(te))return;let se=Q.exec(te);if(se){let me=ee+se[0].lastIndexOf("[");return{start:me,end:ws(A,me,{skipComment:Wv,...Z})}}ee+=te.length+1}return}function du(A,B,Z){let Q=A.slice(0,B.end).trimEnd(),ee=Tl(A,B.end),te=ee===""?"     ":`${ee}  `,se=!Q.endsWith("[")&&!Q.endsWith(",");return`${Q}${se?",":""}
${te}${Z}${A.slice(B.end)}`}function uu(A,B,Z){let Q=A.indexOf(Z,B.start);if(Q===-1||Q>B.end)return A;return`${A.slice(0,Q)}${A.slice(Q+Z.length).replace(/^\s*,/,"")}`}function pu(A,B){let Z=new RegExp(`^\\s*${B}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),Q=A.split(`
`),ee=Q.findIndex((me)=>/^\s*\[/.test(me)),te=ee===-1?Q:Q.slice(0,ee),se=ee===-1?[]:Q.slice(ee);return[...te.filter((me)=>!Z.test(me)),...se].join(`
`)}function fu(A,B,Z){let Q=new RegExp(`^\\s*\\[\\[${B}]]\\s*$`,"m");return A.split(/(?=^\s*\[)/m).filter((ee)=>!Q.test(ee)||!ee.includes(Z)).join("").trimEnd()}var Er=vn["kimi-code"],ji=`[[hooks]]
event = "PreToolUse"
command = "${Er}"`,yu=`{ event = "PreToolUse", command = "${Er}" }`,vu={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function bu(A){return mu(A.env.get("KIMI_CODE_HOME")??mu(A.home,".kimi-code"),"config.toml")}function Xv(A){let B=Li(A,"hooks",vu);if(B&&A.slice(B.start+1,B.end).trim())return du(A,B,yu);let Z=pu(A,"hooks").trimEnd();if(Z==="")return`${ji}
`;return`${Z}

${ji}
`}function wu(A){let B=bu(A);if(Yv(Zv(B),{recursive:!0}),!gu(B))return sn(B,`${ji}
`),{path:B,alreadyInstalled:!1};let Z=hu(B,"utf-8");if(Z.includes(Er))return{path:B,alreadyInstalled:!0};return sn(B,Xv(Z)),{path:B,alreadyInstalled:!1}}function ku(A){let B=bu(A);if(!gu(B))return{path:B,alreadyInstalled:!1};let Z=hu(B,"utf-8");if(!Z.includes(Er))return{path:B,alreadyInstalled:!1};let Q=Li(Z,"hooks",vu),ee=Q?uu(Z,Q,yu):`${fu(Z,"hooks",Er)}
`;return sn(B,ee),{path:B,alreadyInstalled:!0}}var Fi="safety-net@cc-marketplace",Cu=new Set(["antigravity-cli","claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),xu=new Set(["antigravity-cli","cursor","devin","droid","grok-build","hermes-agent","kimi-code"]);function Hi(A){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(A??"")}function _u(A){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(A??"")}function Qv(A){return/^Marketplace `cc-marketplace`\s*$/m.test(A??"")}var Tu={"antigravity-cli":{installCommands:Kd,uninstallCommands:zd},"claude-code":{installCommands:(A)=>{let B=to(A,"cc-safety-net@cc-marketplace");return{commands:[...B?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...vs(A).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:to(A,Fi)?[["claude","plugin","uninstall",Fi]]:[],update:B}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(A,B)=>{let Z=B??await un(["codex","plugin","list","--marketplace","cc-marketplace"]),Q=_u(Z);return{commands:[Q||Qv(Z)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:Hi(Z)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:Q}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:Pl},"copilot-cli":{installCommands:async()=>{let A=await un(["copilot","plugin","list"]),B=[...jl(A)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...Fl(A)?[["copilot","plugin","uninstall",Dl]]:[]];if(Nl(A))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",Rn]],cleanupCommands:B,update:!0};return{commands:[Ll(await un(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",Rn]],cleanupCommands:B}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(A)=>{let B=Ms(A);if(B.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(B.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:ni,installCommands:(A)=>{let B=!Do($o(br(A),wn));return{commands:Kc(),afterInstall:()=>zc(B)}},uninstallCommands:[["openclaw","plugins","uninstall",cn,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:rd},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]},"deepseek-harness":{installCommands:(A)=>su(A),uninstallCommands:(A)=>iu(A)}};function Au(A,B=(Z)=>Z){try{let Z=JSON.parse(B(Eu(A,"utf-8")));if(!Z||typeof Z!=="object"||Array.isArray(Z))throw Error(`Settings file ${A} must be a JSON object`);return Z}catch(Z){if(Z instanceof SyntaxError)throw Error(`Failed to parse ${A}: ${Z.message}`);throw Z}}function eb(A){let B=$o(mr(A),"settings.json");if(!Do(B))return;let Z=Au(B,mn),Q=Z.enabledPlugins;if(!Q||typeof Q!=="object"||Array.isArray(Q))return;if(Q[Rn]!==!1)return;let ee=Eu(B,"utf-8"),te=ee.replace(new RegExp(`("${Rn}"\\s*:\\s*)false`),"$1true");return Q[Rn]=!0,sn(B,te!==ee?te:`${JSON.stringify(Z,null,2)}
`),`Enabled ${Rn} plugin in ${B}`}function nb(A){let B=pi(A);if(!Do(B))return;let Z=Au(B);if(!Array.isArray(Z.packages))return;let Q=Z.packages.find((ee)=>!!ee&&typeof ee==="object"&&!Array.isArray(ee)&&fi(ee.source)&&("extensions"in ee));if(!Q)return;return delete Q.extensions,sn(B,`${JSON.stringify(Z,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${B}`}function Su(A,B){let Z=pn({label:B,booleans:Object.fromEntries(Tn.map((te)=>[te.target,[te.flag]]))},A),Q=Z.errors[0];if(Q)throw Error(Q);let ee=Tn.filter((te)=>Z.flags[te.target]).map((te)=>te.target);if(ee.length!==1)throw Error(`Choose exactly one ${B} target: ${Tn.map((te)=>te.flag).join(", ")}`);return ee[0]}async function Iu(A,B=Vt){let[Z,Q,ee]=await Promise.all([B(["amp","plugins","list"],30000),B(["codex","plugin","list","--marketplace","cc-marketplace"],30000),B(["copilot","--binary-version"])]);return{codexPluginListOutput:Q,hooks:nr(A,process.cwd(),{ampPluginListOutput:Z,codexPluginListOutput:Q,copilotCliVersion:ee})}}async function tb(A,B,Z=Vt){let Q=await Iu(A,Z);return Q.hooks.filter((ee)=>B==="install"?ee.configured:ee.detected&&ee.method!==uo||ee.inspectionStatus==="not-inspected").filter((ee)=>!Du(ee)).filter((ee)=>ee.platform!=="codex"||!Hi(Q.codexPluginListOutput)||_u(Q.codexPluginListOutput)).map((ee)=>ee.platform)}function rb(A,B,Z,Q){if(Z.length>0)return{finish:async()=>[Su(Z,B)]};if(!Q.selectTargets&&!Pi(Q.input,Q.output))return{finish:async()=>[Su(Z,B)]};let ee=Q.detectConfiguredTargets??(()=>tb(A,B,Q.fetchVersion)),te=Promise.all([Wd(Q.probeTargets).then((se)=>au(se,A)),ee()]);return{ready:te,finish:async()=>{let[se,me]=await te,ye=Yd(se,{action:B,configuredTargets:me}),Re=Q.selectTargets?await Q.selectTargets(B,Ru(B,ye)):await Nd(B,Ru(B,ye),{input:Q.input,output:Q.output});if(Re==="update")return Re;if(!Re||Re.length===0)return null;return Oi(Re)}}}async function ob(A,B,Z=!1,Q){let ee=Tu[A];ee.beforeInstall?.(B);let te=typeof ee.installCommands==="function"?await ee.installCommands(B,Q):{commands:ee.installCommands};return await Ss(te.commands),await Vl(te.cleanupCommands??[]),await te.afterInstall?.(),[`${te.update||Z?"Updated":"Installed"} ${ln(A)} integration`,te.message??ee.postInstallMessage].filter(Boolean).join(`
`)}async function sb(A,B){let Z=Tu[A];if(!Z.uninstallCommands)throw Error(`${ln(A)} uninstall is not supported`);let Q=typeof Z.uninstallCommands==="function"?Z.uninstallCommands(B):{commands:Z.uninstallCommands};return await Ss(Q.commands),Q.afterUninstall?.(),`Uninstalled ${ln(A)} integration`}function ib(A){let B=id(A);return B.alreadyInstalled?`Uninstalled OpenCode plugin from ${B.path}`:`OpenCode plugin not installed in ${B.path}`}var Ou={cursor:{install:Zl,uninstall:Xl},devin:{install:sc,uninstall:ic},droid:{install:fc,uninstall:mc},"grok-build":{install:Cc,uninstall:xc},"kimi-code":{install:wu,uninstall:ku}};function ab(A,B,Z,Q=!1){if(A==="install"&&!Q)Oo(Z);let ee=Ou[B][A](Z),te=ln(B),se=A!=="install"?"Uninstalled":Q?"Updated":"Installed";return A==="install"&&ee.alreadyInstalled?Q?`${te} hook up to date in ${ee.path}`:`${te} hook already installed in ${ee.path}`:A==="uninstall"&&!ee.alreadyInstalled?`${te} hook not installed in ${ee.path}`:`${se} ${te} hook ${A==="install"?"in":"from"} ${ee.path}`}var $u={amp:{install:qd,uninstall:Vd,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:Ac,uninstall:Ic,afterInstall:async(A)=>{let B=Ys(A);return await un(["hermes","plugins","enable",kn,"--no-allow-tool-override"]),!B},beforeUninstall:async(A)=>{Ws(A);try{await un(["hermes","plugins","disable",kn])}catch(B){console.warn(`${B instanceof Error?B.message:String(B)}
Removing the plugin files anyway; ${kn} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function lb(A,B,Z,Q=!1){let ee=$u[B];if(A==="uninstall")await ee.beforeUninstall?.(Z);let te=A==="install"?await ee.install(Z):await ee.uninstall(Z),se=A==="install"&&await ee.afterInstall?.(Z),me=ln(B),ye=!se&&(A==="install"&&te.alreadyInstalled||A==="uninstall"&&!te.alreadyInstalled);return[ye?A==="install"?`${me} plugin ${Q?"up to date":"already installed"} at ${te.path}`:`${me} plugin not installed at ${te.path}`:`${A!=="install"?"Uninstalled":Q?"Updated":"Installed"} ${me} plugin ${A==="install"?"at":"from"} ${te.path}`,ye?void 0:ee.restartNote].filter(Boolean).join(`
`)}var cb={"antigravity-cli":{afterInstall:Ii},"copilot-cli":{afterInstall:eb},cursor:{afterUninstall:zl},"hermes-agent":{beforeInstall:(A,B)=>{if(!B)Oo(A)}},openclaw:{beforeUninstall:ni},pi:{afterInstall:nb}};function db(A){return A in Ou}function ub(A){return A in $u}var Pu=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net/tree/plugin","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Du(A){return A.platform==="kimi-code"&&A.method===ko}function Nu(A){return Co({environment:A,cwd:process.cwd()}).method==="hook config"}function pb(A){if(!Nu(A))return Pu;return[Pu,"",We.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function Ru(A,B){return B.map((Z)=>A==="install"&&Z.target==="kimi-code"&&Z.unavailableReason==="already installed"?{...Z,available:!0,unavailableReason:void 0,label:`${Z.label} (global hook installed)`}:Z)}function fb(A,B){if(A.selectKimiInstallMethod)return A.selectKimiInstallMethod();if(!Pi(A.input,A.output))return Promise.resolve("global-hook");return Dd({input:A.input,output:A.output,globalHookInstalled:Nu(B)})}async function Lu(A,B,Z,Q=!1,ee){let te=cb[B];if(A==="install")te?.beforeInstall?.(Z,Q);if(A==="uninstall")te?.beforeUninstall?.(Z);if(db(B))return[ab(A,B,Z,Q),A==="uninstall"?await te?.afterUninstall?.(Z):void 0].filter(Boolean).join(`
`);if(ub(B))return lb(A,B,Z,Q);if(A==="uninstall")return B==="opencode"?ib(Z):sb(B,Z);return[await ob(B,Z,Q,ee),await te?.afterInstall?.(Z)].filter(Boolean).join(`
`)}function mb(A){let B=pn({label:"update"},A).errors[0];if(B)throw Error(B)}async function gb(A,B=Vt){let Z=await Iu(A,B),Q=$o(mr(A),"installed-plugins");return{targets:Oi([...Z.hooks.filter((te)=>te.platform!=="copilot-cli"&&te.detected&&te.method!==uo&&te.method!==As).map((te)=>te.platform),...[ro,$l,Ol].flatMap((te)=>Do($o(Q,...te))?["copilot-cli"]:[]),...to(A,Fi)?["claude-code"]:[],...Hi(Z.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:Z.codexPluginListOutput,kimiPlugin:Z.hooks.some(Du)}}async function hb(A){let B=a(),Z=A.output??process.stdout,Q=(A.scriptPath??process.argv[1]??"").split(/[\\/]/),ee=Q.find((Ne)=>/^bunx-\d+-/.test(Ne)),te=ee!==void 0||Q.includes("_npx")?null:(A.checkLatestVersion??Hn)(),se=async()=>{let Ne=te&&await te;if(Ne?.updateAvailable)Z.write(`
Update available: cc-safety-net ${Ne.currentVersion} → ${Ne.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},me=gb(B,A.fetchVersion??Vt).then(async(Ne)=>{let Oe=new Set(Ne.targets);return{targets:Ne.targets,codexPluginListOutput:Ne.codexPluginListOutput,kimiPlugin:Ne.kimiPlugin,available:new Map(await Promise.all(Tn.filter((Le)=>Oe.has(Le.target)&&Cu.has(Le.target)).map(async(Le)=>[Le.target,await Rr(Le.probeCommand)])))}}),ye=await dr(A.showBanner??!0,()=>({ready:me,finish:()=>me}),()=>cr({input:A.input??process.stdin,output:Z}),{loadingMessage:"Checking installed integrations…",output:Z}),Re=await Promise.resolve().then(()=>(lu(B.tmpdir,process.platform,ee),null)).catch((Ne)=>_r(Ne));if(ye.targets.length===0){if(Z.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),Re!==null)console.error(Re);return await se(),Re===null?0:1}let _e=ye.targets.some((Ne)=>xu.has(Ne))?await Promise.resolve().then(()=>(Oo(B),null)).catch((Ne)=>_r(Ne)):null,Ae=await zr(Promise.all(ye.targets.map((Ne)=>{if(Ne==="kimi-code"&&ye.kimiPlugin)return Promise.resolve({message:"Kimi Code plugin skipped: update it in Kimi Code from /plugins (Installed tab, select cc-safety-net, press Enter)",failed:!1});if(Cu.has(Ne)&&!ye.available.get(Ne))return Promise.resolve({message:`${ln(Ne)} not found; skipped`,failed:!1});if(_e!==null&&xu.has(Ne)&&Ne!=="antigravity-cli")return Promise.resolve({message:_e,failed:!0});return Lu("install",Ne,B,!0,ye.codexPluginListOutput).then((Oe)=>({message:Oe,failed:!1}),(Oe)=>({message:_r(Oe),failed:!0}))})),{loadingMessage:`Updating ${ye.targets.length} integration${ye.targets.length===1?"":"s"}…`,output:Z}),De=Re===null?Ae:[...Ae,{message:Re,failed:!0}];return De.forEach((Ne)=>Ne.failed?console.error(Ne.message):Z.write(`${Ne.message}
`)),await se(),De.some((Ne)=>Ne.failed)?1:0}function Mi(A,B={}){return Promise.resolve().then(()=>mb(A)).then(()=>hb(B)).catch((Z)=>(console.error(_r(Z)),1))}async function Tr(A,B,Z={}){try{let Q=a(),ee=await dr(!0,()=>rb(Q,A,B,Z),()=>cr({input:Z.input??process.stdin,output:Z.output??process.stdout}),{loadingMessage:A==="install"?"Checking available integrations…":"Checking installed integrations…",output:Z.output??process.stdout});if(!ee)return(Z.output??process.stdout).write(`Cancelled: nothing was ${A}ed.
`),0;if(ee==="update")return(Z.runUpdate??(()=>Mi([],{fetchVersion:Z.fetchVersion,input:Z.input,output:Z.output,showBanner:!1})))();let te=Z.output??process.stdout;return await Jd(ee,async(se)=>{if(se==="kimi-code"&&A==="install"){let ye=await fb(Z,Q);if(ye===null){te.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(ye==="plugin"){te.write(`${pb(Q)}
`);return}}let me=await zr(Lu(A,se,Q),{loadingMessage:`${A==="install"?"Installing":"Uninstalling"} ${ln(se)} integration…`,output:te});te.write(`${me}
`)}),0}catch(Q){return console.error(_r(Q)),1}}function _r(A){let B=A instanceof Error?A.message:String(A),Z=typeof A==="object"&&A!==null&&"code"in A?A.code:null;if(Z==="EACCES"||Z==="EPERM")return`${B}
Check file permissions for the target config file and parent directory.`;if(Z==="ENOENT")return`${B}
Check that the target config path and parent directory exist.`;if(Z==="ENOTDIR")return`${B}
Check that every parent path component is a directory.`;return B}import{mkdirSync as Cb}from"node:fs";import{dirname as xb}from"node:path";import{createInterface as Sb}from"node:readline";import{existsSync as Hu,readFileSync as yb}from"node:fs";function It(A,B){let Z=kt(A,B);return{policy:Z.policy,errors:pe(bt(Z.issues,Et,(Q)=>Q.kind==="custom")," "," ")}}function Ar(A,B){return It(A,B).errors}function ju(A,B){return{"safety.level":A.safety.level,...No("safety.overrides",A.safety.overrides),"workflow.worktree_mode":String(A.workflow.worktree_mode),"destructive_command_protection.enabled":String(A.destructive_command_protection.enabled),...No("destructive_command_protection.overrides",A.destructive_command_protection.overrides),...Fu("destructive_command_protection.messages",A.destructive_command_protection.messages),"destructive_command_protection.allow_paths":Ui(A.destructive_command_protection.allow_paths),"secret_protection.enabled":String(A.secret_protection.enabled),...No("secret_protection.overrides",A.secret_protection.overrides),...Fu("secret_protection.messages",A.secret_protection.messages),"secret_protection.deny_paths":Ui(A.secret_protection.deny_paths),"secret_protection.allow_paths":Ui(A.secret_protection.allow_paths),...B?{"audit.retention_days":String(A.audit.retention_days)}:{}}}function Lo(A,B,Z){let Q=ju(A,Z),ee=ju(B,Z);return[...new Set([...Object.keys(Q),...Object.keys(ee)])].flatMap((te)=>Q[te]===ee[te]?[]:[{field:te,before:Q[te],after:ee[te]}])}function Ir(A,B){let Z=d(A,B);if(!Hu(Z))return{baseline:P(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,A.home),diagnostics:[]};let Q=Ot(Z),ee=It(Q.value,A.home);return{baseline:ee.policy,diagnostics:Q.errors.length>0?Q.errors:ee.errors}}function Ot(A){if(!Hu(A))return{errors:[`${A}: file not found`]};try{return{value:JSON.parse(yb(A,"utf-8")),errors:[]}}catch(B){let Z=B instanceof Error?B.message:String(B);return{errors:[`${A}: ${B instanceof SyntaxError?`Invalid JSON: ${Z}`:Z}`]}}}function jo(A,B){let Z=vb(A)?A:{};return{version:B.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((Q)=>Z[Q]!==void 0).map((Q)=>[Q,Z[Q]]))}}function No(A,B){return Object.fromEntries(Object.entries(B).flatMap(([Z,Q])=>Q===void 0?[]:[[`${A}.${Z}`,String(Q)]]))}function Fu(A,B={}){return No(A,Object.fromEntries(Object.entries(B).map(([Z,Q])=>[Z,JSON.stringify(Q)])))}function Ui(A){return A.length===0?"(none)":A.join(", ")}function vb(A){return!!A&&typeof A==="object"&&!Array.isArray(A)}import{chmodSync as bb,existsSync as Mu,mkdirSync as wb,readFileSync as Uu}from"node:fs";import{dirname as kb}from"node:path";function Bu(A,B={}){let Z=d(A,B);if(!Mu(Z))return{path:Z,exists:!1,raw:"",policy:D(),errors:[]};let Q=Uu(Z,"utf-8");if(!Q.trim())return{path:Z,exists:!0,raw:Q,policy:D(),errors:["Config file is empty"]};try{let ee=It(JSON.parse(Q),A.home);return{path:Z,exists:!0,raw:Q,policy:ee.policy,errors:ee.errors}}catch(ee){return{path:Z,exists:!0,raw:Q,policy:D(),errors:[`Invalid JSON: ${ee instanceof Error?ee.message:String(ee)}`]}}}function Nn(A,B,Z={}){let Q=d(A,Z),ee=It(B,A.home);if(ee.errors.length>0)return{path:Q,policy:D(),errors:ee.errors};let te=ee.policy;return wb(kb(Q),{recursive:!0,mode:448}),v(ce(Q),`${JSON.stringify(te,null,2)}
`,384),bb(Q,384),{path:Q,policy:te,errors:[]}}function Gu(A,B){let Z=It(B,A.home);if(Z.errors.length>0)return{errors:Z.errors};return{preview:Ze(Z.policy,A.env),errors:[]}}function qu(A,B={}){let Z=d(A,B);if(!Mu(Z))return Nn(A,ie,B);let Q=Uu(Z,"utf-8");if(!Q.trim())return Nn(A,ie,B);try{return Nn(A,P(JSON.parse(Q),A.home),B)}catch{return Nn(A,ie,B)}}var Vu=new Set(["check","apply"]),Ku="(unset)";async function Ju(A,B,Z={}){let Q=pn({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},B),ee=Q.positionals[0],te=[...Q.errors,...ee&&!Vu.has(ee)?[`Unknown policy subcommand: ${ee}`]:[],...ee&&Vu.has(ee)&&!Q.positionals[1]?[`policy ${ee} requires a file`]:[],...Q.positionals.slice(2).map((Le)=>`Unexpected policy argument: ${Le}`)];if(te.length>0){for(let Le of te)console.error(Le);return 1}let se=Q.positionals[1];if(!ee||!se)return tr(Lr,console.error),1;let me=Z.cwd??process.cwd(),ye=Q.flags.global?d(A):b(me);if(!Q.flags.global&&N(A,{cwd:me}))return console.error(`${ye} is the user policy, not a project policy; use --global for the user scope, or run from a project directory`),1;let Re=Ot(se),_e=[...Re.errors,...Ar(Re.value,A.home).map((Le)=>`${se}: ${Le}`),...!Q.flags.global&&Eb(Re.value)&&Re.value.audit!==void 0?[`${se}: audit settings are user scope only; remove the audit section from a project proposal`]:[],...(Q.flags.global?[]:Ye(Re.value)).map((Le)=>`${se}: ${Le}`)];if(_e.length>0){for(let Le of _e)console.error(Le);return 1}let Ae=P(Re.value,A.home);if(console.log(`Scope: ${Q.flags.global?"user":"project"} (${ye})`),console.log(`Proposal: ${se}`),Q.flags.global)zu(P(Ot(ye).value,A.home),Ae,!0);if(!Q.flags.global){let Le=Ir(A).baseline;console.log("Effective policy (user + project merged):"),zu(oe(Le,ge(Ot(ye).value,A.home).policy).policy,oe(Le,ge(Re.value,A.home).policy).policy,!1)}if(ee==="check")return 0;let De=Z.input??process.stdin,Ne=Z.output??process.stdout;if(!De.isTTY||!Ne.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${se}${Q.flags.global?" --global":""}`),1;if(!await Pb(`Apply this policy to ${ye}? [y/N] `,De,Ne))return console.log("Cancelled; nothing was written."),0;return Rb(A,ye,Re.value,Ae,Q.flags.global),console.log(`Policy applied: ${ye}`),0}function Pb(A,B,Z){let Q=Sb({input:B,output:Z,terminal:!1});return new Promise((ee)=>{Q.once("close",()=>ee(!1)),Q.question(A,(te)=>{ee(/^y(es)?$/i.test(te.trim())),Q.close()})})}function Rb(A,B,Z,Q,ee){if(ee){Nn(A,Q);return}Cb(xb(B),{recursive:!0}),hn(B,jo(Z,Q))}function zu(A,B,Z){let Q=Lo(A,B,Z);if(Q.length===0){console.log("No changes.");return}console.log(`Changes (${Q.length}):`);for(let ee of Q)console.log(`  ${ee.field}: ${ee.before??Ku} -> ${ee.after??Ku}`)}function Eb(A){return!!A&&typeof A==="object"&&!Array.isArray(A)}import{join as Mw}from"node:path";var Wu="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- `caffeinate`, `exec`, `nice`, `nohup`, `setsid`, `stdbuf`, `time`, and `timeout` are built-in transparent wrappers and need no configuration. Configure only other wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n- `command_tools`: Optional array of shell tools that a plugin adds to an agent and that CC Safety Net does not know. Each entry is a tool name such as `\"ops_bash\"`, or `{ \"name\": \"ops_run_background\", \"cwd\": \"cwd\" }` when the tool takes its working directory in a named argument (otherwise `workdir`, `cwd`, or `working_directory` is read). Use `{ \"name\": \"phone_shell\", \"cwd\": false }` for a tool whose working directory is not on this machine, such as one that runs commands on a remote host: CC Safety Net reads no working-directory argument for it and checks its commands against the session directory. A call to a declared tool with a non-empty string `command` is analyzed like a built-in shell command. User and project lists merge; the user entry wins a name declared in both.\n- Built-in shell and file tools are already analyzed and cannot be declared; `rule verify` reports one declared by hand.\n- Use `cc-safety-net rule tool add ops_bash ops_run_background` to declare tools in the user config, or add `--project` for the project config. Add `--cwd-arg <name>` to name the working-directory argument, or `--no-cwd-arg` to read none.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `options_with_values` | No | `rulebook_version` 2 only. Object keyed by a rule's `command`; each value is a non-empty array of unique options that start with `-` |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Options that take a value**: For any other command, declare them once in the rulebook's `options_with_values`, such as `\"options_with_values\": { \"kubectl\": [\"-n\", \"--namespace\", \"--context\"] }`. The token after a declared option is read as its value for every rule of that command, so `kubectl -n payments delete pod api` matches `\"command_path\": [\"delete\"]`. Declared options add to the built-in ones.\n- **Unrecognized options**: A token starting with `-` that is neither built in nor declared is skipped without consuming a value, so a value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; declare the option to close the gap. A client older than this key ignores it and keeps missing those commands; it also refuses to add or update a rulebook whose `blocked` fixture depends on a declared option, because that fixture fails there.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Each fixture is read the way the hook reads a command, against this rulebook's rules only, so a wrapped spelling such as `sudo docker system prune`, `env FOO=1 docker system prune`, or `bash -c 'docker system prune'` is a valid `blocked` fixture. Built-in rules that can be turned off are not applied. A `blocked` fixture that another rule blocks first fails and names that rule; an `allowed` fixture fails only when one of this rulebook's rules matches. Wrappers from `transparent_wrappers` are not applied, because a rulebook must verify the same for every consumer. For the same reason no file is read: a fixture that runs a script by path, such as `bash deploy.sh`, is judged on its command line alone. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function Fo(A,B){if(!A.ok){np(A);return}Xu(A,B)}function Zu(A,B,Z){if(A.ok)console.log(Z);if(!A.add){Fo(A,`Added rulebook source: ${B}`);return}if(!A.ok){np(A);return}if(A.add.added.length>0)console.log(`Added ${A.add.added.length} ${A.add.added.length===1?"rulebook":"rulebooks"} from ${A.add.source} at ${A.add.ref}:`),A.add.added.forEach((Q)=>{console.log(`  - ${Q}`)});if(A.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${A.add.source} at ${A.add.ref}: ${A.add.alreadyConfigured.join(", ")}`);if(A.add.commits.length>0)console.log(`Vendored at ${A.add.commits.map((Q)=>Q.slice(0,7)).join(", ")}.`);Xu(A,"Rule config updated.")}function Xu(A,B){for(let Z of A.changes??[])console.log(Z);console.log(B),console.log(""),_b(A.entries)}function _b(A){if(A.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${A.length}):`);for(let B of A)console.log(`  - ${B.name} ${B.version} (${Tb(B.ruleCount)})`),console.log(`    Source: ${B.spec}`)}function Tb(A){return`${A} ${A===1?"rule":"rules"}`}function Qu(A){Vn("Active sources",A.rulebooks,(B)=>[`[${B.source}] ${B.name} ${B.version}`,`  Source: ${B.spec}`]),Vn("Active rules",A.rules,(B)=>[`[${Ib(A,B.name)}] ${B.name}`,...Ab(B),`  Reason: ${B.reason}`]),Vn("Disabled rules",Yu(A,"off"),(B)=>[B.key]),Vn("Reason overrides",Yu(A,"reason"),(B)=>[B.key,`  Reason: ${B.value.reason}`]),Vn("Transparent wrappers",A.transparent_wrappers,(B)=>[B]),Vn("Issues",A.errors,(B)=>[B]),Vn("Warnings",A.warnings,(B)=>[B])}function ep(A){Vn("Command tools",A,(B)=>typeof B.tool==="string"?[`[${B.scope}] ${B.tool}`]:[`[${B.scope}] ${B.tool.name}`,...B.tool.cwd===void 0?[]:[`  Cwd argument: ${B.tool.cwd===!1?"none":B.tool.cwd}`]])}function Vn(A,B,Z){if(B.length===0){console.log(`${A}: (none)`);return}console.log(`${A} (${B.length}):`);for(let Q of B){let[ee,...te]=Z(Q);console.log(`  - ${ee}`);for(let se of te)console.log(`    ${se}`)}}function Ab(A){if(!A.match)return[`  Command: ${A.subcommand?`${A.command} ${A.subcommand}`:A.command}`,`  Block args: ${A.block_args.join(", ")}`];return[`  Command: ${[A.command,...A.match.command_path].join(" ")}`,...A.match.any_args?[`  Any args: ${A.match.any_args.join(", ")}`]:[],...A.match.exclude_args?[`  Exclude args: ${A.match.exclude_args.join(", ")}`]:[]]}function Ib(A,B){return A.rulebooks.find((Z)=>Z.rules.includes(B))?.source??"project"}function Yu(A,B){return Object.entries({...A.userConfig?.overrides,...A.projectConfig?.overrides}).filter((Z)=>{if(B==="off")return Z[1]==="off";return!!Z[1]&&typeof Z[1]==="object"}).map(([Z,Q])=>({key:Z,value:Q}))}function np(A){for(let B of A.errors)console.error(B)}import{dirname as Pp,join as Ko}from"node:path";import{join as qi,resolve as Bb}from"node:path";function Or(A){let B=p(A);if(B.errors.length>0)return{ok:!1,result:{ok:!1,errors:B.errors,entries:[]}};return{ok:!0,config:B.config??de}}function tp(A){hn(A,de)}function rp(A){hn(A,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as Bo}from"node:path";var op="custom.";function Ho(A){if(A.rulebook_version!==2)return[];let B={effectiveCapabilities:E({},new Map).capabilities,environment:Dt(),protectedGitMetadata:null,policySnapshot:he({rules:A.rules.map((Z)=>({name:Z.name,command:Z.command,block_args:[],match:Z.match,options_with_values:qe(A,Z.command),reason:Z.reason,intent:Z.intent})),transparentWrappers:[],heredocDataWrappers:[],commandTools:[],safety:{level:"standard"},worktreeMode:!1,destructiveCommandProtectionEnabled:!1,destructiveCommandRuleOverrides:{},destructiveCommandAllowPaths:[],secretProtection:{enabled:!1,disabledRules:[],denyPaths:[],allowPaths:[]}})};return(A.tests??[]).flatMap((Z,Q)=>{let ee=nt(()=>tt(Z.command,B),Z.command).decision?.ruleId,te=ee?.startsWith(op)?ee.slice(op.length):void 0;if(Z.expect==="blocked"){if(te===Z.rule)return[];let se=ee?`"${te??ee}" matched first`:"no rule matched";return[`tests[${Q}]: expected "${Z.rule}" to block "${Z.command}" but ${se}`]}return te?[`tests[${Q}]: expected "${Z.command}" to be allowed but "${te}" matched`]:[]})}var Mo=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function Uo(A={}){return{requests:0,responseBytes:0,maxRequests:A.maxRequests??Mo.maxRequests,maxResponseBytes:A.maxResponseBytes??Mo.maxResponseBytes}}function Ln(A){return{controller:new AbortController,budget:Uo(),resolveUrl:A}}function sp(A){return A instanceof Error&&A.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function ip(A){if(A.requests>=A.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");A.requests++}function ap(A,B){if(B>A.maxResponseBytes-A.responseBytes)throw A.responseBytes+=B,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");A.responseBytes+=B}var dp=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function lp(A,B,Z=R(Bo(Bo(B)),"rules policy"),Q=Ln()){if(T(A))return Nb(A,Q);return Db(A,B,Z)}async function up(A,B,Z,Q,ee,te){if(!T(A))return lp(A,B,Z,Q);let se=ee?null:Ob(A,B,Z);if(se)return se;if(!ee&&!te)throw Error(`${A} is not vendored; run rule update ${A} to vendor it`);return lp(A,B,Z,Q)}function Ob(A,B,Z=R(Bo(Bo(B)),"rules policy")){let Q=M(A),ee=F(B,Q.name),te=r(i(Z,ee));if(te===null)return null;let se=fe(Bi(te,`Invalid rulebook ${ee}.`));if(se.name!==Q.name)throw Error(`rulebook name "${se.name}" in ${ee} must match "${Q.name}"`);return{spec:A,rulebook:se,content:te}}async function pp(A,B={}){if(!ne(A))throw Error(`Invalid GitHub repository source: ${A}`);let[Z,Q]=A.split("/");if(!Z||!Q)throw Error(`Invalid GitHub repository source: ${A}`);if(B.ref!==void 0&&!le(B.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${B.ref}`);let ee=B.operation??Ln(),te=B.ref??await $b(Z,Q,A,ee),se=await mp(Z,Q,te,A,ee),me=await Go(`https://api.github.com/repos/${Z}/${Q}/git/trees/${se}?recursive=1`,"tree",ee),ye=me.response;if(!ye.ok)throw Error(`Failed to inspect ${A}: GitHub tree returned ${ye.status}`);let Re=JSON.parse(me.content);if(!Array.isArray(Re?.tree))throw Error(`Failed to inspect ${A}: unexpected GitHub tree response`);let _e=Re.tree,Ae=[...new Set(_e.flatMap((De)=>{if(!De||typeof De!=="object")return[];let Ne=De;if(Ne.type!=="blob"||typeof Ne.path!=="string")return[];let Oe=Ne.path.match($t);return Oe?.[1]?[Oe[1]]:[]}))].sort();if(Ae.length===0)throw Error(`No rulebooks found in ${A} under ${Se}/`);return{source:A,owner:Z,repo:Q,ref:te,commit:se,names:Ae}}async function $b(A,B,Z,Q){let ee=await Go(`https://api.github.com/repos/${A}/${B}`,"metadata",Q),te=ee.response;if(!te.ok)throw Error(`Failed to inspect ${Z}: GitHub returned ${te.status}`);let me=JSON.parse(ee.content)?.default_branch;if(typeof me!=="string"||me==="")throw Error(`Failed to inspect ${Z}: missing default branch`);if(!le(me))throw Error(`GitHub returned an invalid default branch: ${me}`);return me}function Db(A,B,Z){Ft(A);let Q=F(B,A),ee=r(i(Z,Q));if(ee===null)throw Error(`Rulebook source not found: ${A}`);let te=fp(Bi(ee,"Invalid local rulebook source."));if(te.name!==A)throw Error(`rulebook name "${te.name}" must match local source "${A}"`);return{spec:A,rulebook:te,content:ee}}async function Nb(A,B){let Z=M(A),Q=await mp(Z.owner,Z.repo,Z.ref,A,B),ee=await Go(`https://raw.githubusercontent.com/${Z.owner}/${Z.repo}/${Q}/${Z.path}`,"raw",B),te=ee.response;if(!te.ok)throw Error(`Failed to fetch ${A}: GitHub raw returned ${te.status}`);let se=ee.content,me=fp(Bi(se,"Invalid GitHub rulebook response."));if(me.name!==Z.name)throw Error(`rulebook name "${me.name}" must match GitHub source "${Z.name}"`);return{spec:A,rulebook:me,content:se}}function fp(A){let B=fe(A),Z=Ho(B);if(Z.length>0)throw Error(Z.join("; "));return B}function Bi(A,B){try{return JSON.parse(A)}catch{throw Error(B)}}async function mp(A,B,Z,Q,ee){let te=await Go(`https://api.github.com/repos/${A}/${B}/commits/${encodeURIComponent(Z)}`,"commit",ee),se=te.response;if(!se.ok)throw Error(`Failed to resolve ${Q}: GitHub returned ${se.status}`);let me=JSON.parse(te.content);if(typeof me?.sha!=="string"||me.sha==="")throw Error(`Failed to resolve commit for ${Q}`);return me.sha}async function Lb(A,B,Z={}){if(Z.signal?.aborted)throw Z.signal.reason;let Q=Z.budget??Uo(),ee=new AbortController,te=()=>ee.abort(Z.signal?.reason);Z.signal?.addEventListener("abort",te,{once:!0});let se=!1,me=setTimeout(()=>{if(ee.signal.aborted)return;se=!0,ee.abort()},Z.timeoutMs??dp.timeoutMs);try{if(Z.signal?.aborted)throw Z.signal.reason;ip(Q);let ye=await fetch(A,{signal:ee.signal,redirect:"error"});if(!ye.ok)return gp(ye),{response:ye,content:""};return{response:ye,content:await jb(ye,B,Q,()=>ee.abort())}}catch(ye){if(se)throw Error("GitHub request timed out",{cause:ye});if(Z.signal?.aborted)throw Z.signal.reason;throw ye}finally{clearTimeout(me),Z.signal?.removeEventListener("abort",te)}}function Go(A,B,Z){return Lb(Z.resolveUrl?.(A)??A,B,{budget:Z.budget,signal:Z.controller.signal})}async function jb(A,B,Z=Uo(),Q){let ee=dp[`${B}Bytes`],te=Number(A.headers.get("content-length"));if(Number.isFinite(te)&&te>ee)throw gp(A),Error(`GitHub ${B} response exceeds ${ee} bytes`);if(!A.body)return"";let se=A.body.getReader(),me=[],ye=0;while(!0){let Re=await se.read();if(Re.done)break;try{ap(Z,Re.value.byteLength)}catch(_e){throw Q?.(),cp(se),_e}if(ye+=Re.value.byteLength,ye>ee)throw Q?.(),cp(se),Error(`GitHub ${B} response exceeds ${ee} bytes`);me.push(Buffer.from(Re.value))}return Buffer.concat(me,ye).toString("utf-8")}function gp(A){if(!A.body)return;hp(()=>A.body?.cancel())}function cp(A){hp(()=>A.cancel())}function hp(A){try{Promise.resolve(A()).catch(()=>{})}catch{}}var Fb=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function yp(A,B){let Z=wp(A.rules,B);if(Z.length>0)return{ok:!0,specs:Z};return bp(A.rules,B)}function vp(A,B){let Z=wp(A,B);if(Z.length>0)return{ok:!0,specs:Z};let Q=Mb(A,B);if(Q.length>0)return{ok:!0,specs:Q};let ee=Ub(A,B);if(!ee.ok)return ee;if(ee.specs.length>0)return{ok:!0,specs:ee.specs};return bp(A,B)}function bp(A,B){let Z=A.filter((Q)=>Gi(Q)?.name===B);if(Z.length===1)return{ok:!0,specs:Z};return Hb(B,Z)}function Hb(A,B){return{ok:!1,result:{ok:!1,errors:B.length===0?[`No configured rulebook matches ${A}`]:[`Ambiguous rulebook match ${A}: ${B.join(", ")}`],entries:[]}}}function wp(A,B){return A.filter((Z)=>Z===B)}function Mb(A,B){let Z=B.match(Fb),Q=Z?.[1],ee=Z?.[2],te=Z?.[3];if(!Q||!ee||!te||!le(te))return[];return kp(A,(se)=>se.owner===Q&&se.repo===ee&&se.ref===te)}function Ub(A,B){if(!ne(B))return{ok:!0,specs:[]};let[Z,Q]=B.split("/"),ee=kp(A,(se)=>se.owner===Z&&se.repo===Q);if(new Set(ee.map((se)=>Gi(se)?.ref).filter((se)=>!!se)).size<2)return{ok:!0,specs:ee};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${B}. Use an explicit ref:`,`  cc-safety-net rule remove ${B}#<ref>`],entries:[]}}}function Gi(A){try{return M(A)}catch{return null}}function kp(A,B){return A.filter((Z)=>{let Q=Gi(Z);return Q?B(Q):!1})}async function Vo(A,B={}){return Gb(A,B,await qo(A,B,Ln()))}function Gb(A,B,Z){if(!Z.ok)return Z;let Q=gn(A,B),ee=[...new Set(K(Q.configPath,Q.filesystemScope))];if(ee.length===0)return Z;return{ok:!1,errors:ee,entries:Z.entries}}async function qo(A,B,Z,Q={},ee=new Set,te=new Set){try{let se=gn(A,B),me=Or(se.configTarget);if(!me.ok)return me.result;let ye=me.config,Re=B.only?yp(ye,B.only):{ok:!0,specs:ye.rules};if(!Re.ok)return Re.result;let _e=new Set([...B.refresh?Re.specs:[],...ee]),Ae=(en)=>up(en,se.configDir,se.filesystemScope,Z,_e.has(en),!B.refresh||_e.has(en)),De=await Qb(ye.rules,B.refresh?(en)=>Ae(en).then((on)=>({ok:!0,item:on})).catch((on)=>{if(sp(on))throw on;return{ok:!1,spec:en,message:on instanceof Error?on.message:String(on)}}):async(en)=>({ok:!0,item:await Ae(en)}),Z),Ne=De.filter((en)=>!en.ok),Oe=De.filter((en)=>en.ok).map((en)=>en.item),Le=Oe.flatMap((en)=>qb(en,ye.rules)),je=Oe.flatMap((en)=>Vb(en,te,se)),nn=new Set([...Le,...je].map((en)=>en.spec)),Xe=[...Ne,...Le,...je],rn=[],an=zb(rn,()=>Oe.flatMap((en)=>nn.has(en.spec)||Xe.length>0&&te.has(en.spec)?[]:Kb(en,se,Q,rn)));return{ok:Xe.length===0,errors:Xe.map((en)=>`Failed to update ${en.spec}: ${en.message}`),entries:Oe.map(Wb),changes:an}}catch(se){return Dr(se)}}function qb(A,B){if(!T(A.spec))return[];let Z=Je(A.spec),Q=B.filter((ee)=>ee!==A.spec&&Je(ee).toLowerCase()===Z.toLowerCase());if(Q.length===0)return[];return[{ok:!1,spec:A.spec,message:`rulebook name "${Z}" is also claimed by ${Q.join(", ")}; rename one of them`}]}function Vb(A,B,Z){if(!B.has(A.spec)||!T(A.spec))return[];let Q=F(Z.configDir,A.rulebook.name),ee=r(i(Z.filesystemScope,Q));if(ee===null||ee===A.content)return[];return[{ok:!1,spec:A.spec,message:`${Q} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function Kb(A,B,Z,Q){if(!T(A.spec))return[];let ee=F(B.configDir,A.rulebook.name),te=i(B.filesystemScope,ee),se=r(te);if(se===A.content)return[];return Q?.push({target:te,previous:se}),v(te,A.content,void 0,Z._testAfterPolicyRename),Jb(A,se)}function zb(A,B){try{return B()}catch(Z){for(let Q of[...A].reverse()){if(Q.previous===null){z(Q.target);continue}v(Q.target,Q.previous)}throw Z}}function Jb(A,B){if(B===null)return[`Vendored ${A.spec} (${A.rulebook.version})`];let Z=ke(B),Q="problem"in Z?null:Z.rulebook,ee=new Map(Q?.rules.map((se)=>[se.name,JSON.stringify(se)])??[]),te=new Set(A.rulebook.rules.map((se)=>se.name));return[`Updated ${A.spec} (${Q?.version??"unreadable"} -> ${A.rulebook.version})`,...[...te].filter((se)=>!ee.has(se)).map((se)=>`  + ${se}`),...[...ee.keys()].filter((se)=>!te.has(se)).map((se)=>`  - ${se}`),...A.rulebook.rules.filter((se)=>{let me=ee.get(se.name);return me!==void 0&&me!==JSON.stringify(se)}).map((se)=>`  ~ ${se.name}`)]}function Wb(A){return{spec:A.spec,name:A.rulebook.name,version:A.rulebook.version,ruleCount:A.rulebook.rules.length}}async function Cp(A,B,Z={}){return Yb(A,B,Z,Ln())}async function Yb(A,B,Z,Q,ee={}){let te=null,se=!1;try{let me=gn(A,Z),ye=r(me.configTarget);te={target:me.configTarget,content:ye};let Re=Or(me.configTarget);if(!Re.ok)return Re.result;let _e=Re.config,Ae=ne(B)?await pp(B,{ref:Z.ref,operation:Q}):null,De=Ae?Zb(Ae,Z.rulebooks):[],Ne=Ae?De.map((Xe)=>Xb(_e.rules,Ae,Xe)??`${B}#${Ae.ref}/${Xe}`):[B],Oe=Ne.filter((Xe)=>!_e.rules.includes(Xe)),Le=[..._e.rules,...Oe];if(Le.length>we)return ew();if(Le.length!==_e.rules.length)se=!0,hn(me.configTarget,{..._e,rules:Le},void 0,ee._testAfterPolicyRename);let je=await qo(A,Z,Q,ee,new Set(Oe),new Set(Oe));if(!je.ok)$r(me.configTarget,ye);if(!je.ok||!Ae)return je;let nn=De.filter((Xe,rn)=>Oe.includes(Ne[rn]??""));return{...je,add:{source:B,ref:Ae.ref,selected:De,added:nn,alreadyConfigured:De.filter((Xe)=>!nn.includes(Xe)),commits:Oe.length>0?[Ae.commit]:[]}}}catch(me){if(se&&te)try{$r(te.target,te.content)}catch(ye){return Dr(ye)}return Dr(me)}}function Zb(A,B){let Z=B?[...new Set(B)]:A.names,Q=Z.filter((ee)=>!A.names.includes(ee));if(Q.length>0)throw Error(`Rulebooks not found in ${A.source} at ${A.ref}: ${Q.join(", ")}
Available rulebooks: ${A.names.join(", ")}`);return Z}function Xb(A,B,Z){let Q=`${B.source}#${B.ref}/${Z}`;if(A.includes(Q))return Q;let ee=`${B.source}#${B.commit}/${Z}`;return A.find((te)=>te===ee)}async function Qb(A,B,Z=Ln()){if(A.length>we)throw Error(Ce);let Q=[],ee=0,te,se=Array.from({length:Math.min(A.length,Mo.concurrency)},async()=>{while(!te){let me=ee;if(me>=A.length)return;ee++;try{Q[me]=await B(A[me],me,Z.controller.signal)}catch(ye){if(!te)te={value:ye},ee=A.length,Z.controller.abort(ye);return}}});if(await Promise.all(se),te)throw te.value;return Q}function ew(){return{ok:!1,errors:[Ce],entries:[]}}async function xp(A,B,Z={}){try{return await nw(A,B,Z,{})}catch(Q){return Dr(Q)}}async function nw(A,B,Z,Q){let ee=gn(A,Z),te=p(ee.configTarget);if(te.errors.length>0)return{ok:!1,errors:te.errors,entries:[]};if(!te.config)return{ok:!1,errors:[`No config found at ${ee.configPath}`],entries:[]};let se=vp(te.config.rules,B);if(!se.ok)return se.result;let me=Z.deleteSource?tw(ee.configDir,se.specs,ee.filesystemScope):{ok:!0,dirs:[]};if(!me.ok)return me.result;let ye=r(ee.configTarget);if(ye===null)return Dr(Error("Rules config is unavailable."));try{hn(ee.configTarget,{...te.config,rules:te.config.rules.filter((Ae)=>!se.specs.includes(Ae))},void 0,Q._testAfterPolicyRename)}catch(Ae){throw $r(ee.configTarget,ye),Ae}let Re=await qo(A,Z,Ln(),Q);if(!Re.ok)return $r(ee.configTarget,ye),Re;let _e=rw(me.dirs,Q,ee.filesystemScope);if(!_e.ok){$r(ee.configTarget,ye);let Ae=await qo(A,Z,Ln(),Q);if(!Ae.ok)return{ok:!1,errors:[..._e.result.errors,...Ae.errors],entries:Ae.entries};return _e.result}return Re}function tw(A,B,Z){let Q=B.flatMap((me)=>m.test(me)?[]:["--delete-source can only delete local rulebook sources"]),ee=B.map((me)=>qi(A,me)),te=Q.length>0?[]:ee.flatMap((me)=>Sp(me,Z)),se=[...Q,...te];return se.length>0?{ok:!1,result:{ok:!1,errors:se,entries:[]}}:{ok:!0,dirs:ee}}function Sp(A,B){let Z=Bb(A),Q=i(B,Z),ee=be(Q);if(!ee)return[`Local rulebook source directory not found: ${A}`];let te=ee.find((se)=>se.name==="rulebook.json");if(!te)return[`Local rulebook source directory is missing rulebook.json: ${A}`];if(te.kind!=="file")throw new o(B.label);if(r(i(B,qi(Z,"rulebook.json"))),ee.length>1)return[`Local rulebook source directory contains extra files: ${A}. delete manually if you really want to remove the directory.`];return[]}function rw(A,B,Z){let Q=A.flatMap((ee)=>{try{if(!be(i(Z,ee)))return[];let te=Sp(ee,Z);if(te.length>0)return te;return ow(ee,B,Z),[]}catch(te){return[`Failed to delete local rulebook source ${ee}: ${te instanceof Error?te.message:String(te)}`]}});return Q.length>0?{ok:!1,result:{ok:!1,errors:Q,entries:[]}}:{ok:!0}}function ow(A,B,Z){if(B._testDeleteLocalSourceDir){B._testDeleteLocalSourceDir(A);return}z(i(Z,qi(A,xe))),Mt(i(Z,A))}function $r(A,B){if(B===null){z(A);return}v(A,B)}function Dr(A){return{ok:!1,errors:[A instanceof Error?A.message:String(A)],entries:[]}}var sw=".safety-net.json",iw="~/.cc-safety-net/config.json";async function _p(A,B){let Z=N(A,{cwd:B.cwd});if(Z)console.log(`Skipped the project scope: ${O(B.cwd)} is the user rule config, not a project rule config`);return[Z||await Rp(A,{legacyPath:Gt(B.cwd),configPath:O(B.cwd),defaultRulebookName:"project-rules",migratedFrom:sw,cleanup:B.cleanup,syncOptions:{cwd:B.cwd}}),await Rp(A,{legacyPath:qt(A),configPath:V(A),defaultRulebookName:"user-rules",migratedFrom:iw,cleanup:B.cleanup,syncOptions:{cwd:B.cwd,global:!0}})].every((ee)=>ee)?0:1}async function Rp(A,B){let Z=gn(A,B.syncOptions),Q=i(Z.filesystemScope,B.legacyPath),ee=r(Q);if(ee===null)return console.log(`No legacy config found at ${B.legacyPath}`),!0;let te=lw(ee);if(!te.ok){for(let Ne of te.errors)console.error(Ne);return!1}let se=p(Z.configTarget);if(se.errors.length>0){for(let Ne of se.errors)console.error(Ne);return!1}let me=se.config??de,ye=cw(Pp(B.configPath),me.rules,B.defaultRulebookName,B.migratedFrom,Z.filesystemScope),Re=Ko(Pp(B.configPath),ye,"rulebook.json"),_e=i(Z.filesystemScope,Re),Ae=[Ep(Z.configTarget),Ep(_e)],De=await aw(A,B,Z.configTarget,_e,ye,te.config.rules,{...me,rules:me.rules.includes(ye)?me.rules:[...me.rules,ye]});if(!De.ok){pw(Ae);for(let Ne of De.errors)console.error(Ne);return!1}if(!B.cleanup)return console.log(`Migrated legacy config at ${B.legacyPath}. Legacy file is no longer used.`),!0;if(!uw(Z.configTarget,_e,ye,B.migratedFrom,te.config.rules))return console.error(`Migration cleanup verification failed for ${B.legacyPath}`),!1;return z(Q),console.log(`Deleted legacy config at ${B.legacyPath}`),!0}async function aw(A,B,Z,Q,ee,te,se){try{return hn(Z,se),hn(Q,dw(ee,B.migratedFrom,te)),await Vo(A,B.syncOptions)}catch(me){return{ok:!1,errors:[me instanceof Error?me.message:String(me)]}}}function lw(A){try{let B=JSON.parse(A),Z=os(B);if(Z.errors.length>0)return{ok:!1,errors:Z.errors};return{ok:!0,config:{version:1,rules:B.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function cw(A,B,Z,Q,ee){let te=B.find((se)=>fw(i(ee,Ko(A,se,"rulebook.json")))===Q);if(te)return te;if(r(i(ee,Ko(A,Z,"rulebook.json")))===null)return Z;for(let se=2;;se++){let me=`${Z}-${se}`;if(r(i(ee,Ko(A,me,"rulebook.json")))===null)return me}}function dw(A,B,Z){return{rulebook_version:1,name:A,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:B,allowed_commands:[...new Set(Z.map((Q)=>Q.command))],rules:Z,tests:Z.map((Q)=>({command:[Q.command,Q.subcommand,Q.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:Q.name}))}}function uw(A,B,Z,Q,ee){if(!p(A).config?.rules.includes(Z))return!1;try{let se=r(B);if(se===null)return!1;let me=JSON.parse(se);return me.migrated_from===Q&&JSON.stringify(me.rules)===JSON.stringify(ee)}catch{return!1}}function Ep(A){return{target:A,content:r(A)}}function pw(A){for(let B of A){if(B.content===null){z(B.target);continue}v(B.target,B.content)}}function fw(A){let B=r(A);if(B===null)return null;try{let Z=JSON.parse(B);return typeof Z.migrated_from==="string"?Z.migrated_from:null}catch{return null}}import{mkdir as mw,readFile as gw,writeFile as hw}from"node:fs/promises";import{dirname as yw,join as vw}from"node:path";var bw=86400000,ww=604800000;async function Ap(A,B=Date.now()){if(A.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let Z=pt(A);if(!Z)return null;let Q=vw(Z,".cc-safety-net","update-check.json"),ee=await kw(Q,B);if(!ee.lastCheck||B-ee.lastCheck>bw){let me=await Hn();if(ee.lastCheck=B,me.latestVersion)ee.latestVersion=me.latestVersion;if(!await Tp(Q,ee))return null;if(me.error)return null}let te=ee.latestVersion,se=dn();if(!te||!ds(te,se))return null;if(ee.notifiedVersion===te&&ee.notifiedAt!==void 0&&B-ee.notifiedAt<ww)return null;if(ee.notifiedVersion=te,ee.notifiedAt=B,!await Tp(Q,ee))return null;return`UPDATE_AVAILABLE: cc-safety-net v${te} is available (running v${se}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function kw(A,B){let Z=await gw(A,"utf8").then((te)=>JSON.parse(te)).catch(()=>{return});if(!Z||typeof Z!=="object"||Array.isArray(Z))return{};let Q=Z,ee=(te)=>typeof te==="number"&&Number.isFinite(te)&&te<=B?te:void 0;return{lastCheck:ee(Q.lastCheck),latestVersion:typeof Q.latestVersion==="string"?Q.latestVersion:void 0,notifiedVersion:typeof Q.notifiedVersion==="string"?Q.notifiedVersion:void 0,notifiedAt:ee(Q.notifiedAt)}}async function Tp(A,B){return mw(yw(A),{recursive:!0,mode:448}).then(()=>hw(A,JSON.stringify(B),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as Rw,resolve as zi}from"node:path";var Ip=new Map([["Bash","posix"],["PowerShell","powershell"],["Monitor","posix"]]);var Op=new Map([["Bash","auto"]]);var $p=new Map([["bash","auto"],["Bash","auto"],["powershell","powershell"],["PowerShell","powershell"]]);var Dp=new Map([["Shell","auto"]]);var Np=new Map([["exec","auto"]]),Lp="write_to_process";var jp=new Map([["Execute","auto"]]);var Fp=new Map([["run_shell_command","auto"]]);var Hp=new Map([["run_terminal_command","auto"],["run_terminal_cmd","auto"],["monitor","auto"],["bash","auto"],["Shell","auto"]]);var Mp=new Map([["terminal","posix"]]);var Up=new Map([["Bash","posix"]]);var Bp="exec";var Sw=[["antigravity-cli",[...hl.keys(),yl]],["claude-code",[...Ip.keys()]],["codex",[...Op.keys()]],["copilot-cli",[...$p.keys()]],["cursor",[...Dp.keys()]],["deepseek-harness",[...He.keys()]],["devin",[...Np.keys(),Lp]],["droid",[...jp.keys()]],["gemini-cli",[...Fp.keys()]],["grok-build",[...Hp.keys()]],["hermes-agent",[...Mp.keys()]],["kimi-code",[...Up.keys()]],["openclaw",[Bp]],["opencode",[at,Pe]],["pi",[...ut.keys()]]].flatMap(([A,B])=>B.map((Z)=>({name:Z,integration:ln(A)}))),Gp="and is already analyzed. Built-in tools cannot be declared.";function zo(A){let B=Fe(A),Z=[...new Set(Sw.filter((Q)=>Fe(Q.name)===B).map((Q)=>Q.integration))].sort((Q,ee)=>Q.localeCompare(ee));if(Z.length>0)return`"${A}" is a built-in shell tool of ${Pw(Z)}, ${Gp}`;if(x(A)!=="unknown")return`"${A}" is a built-in file tool, ${Gp}`;return}function Pw(A){return A.length===1?A[0]??"":`${A.slice(0,-1).join(", ")} and ${A.at(-1)}`}var Vp="CC Safety Net Config",Ew="═".repeat(Vp.length),_w="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",Tw=new Set(["rule.json","rule.lock","cache"]);function Kp(A,B={}){try{return Aw(A,B)}catch(Z){if(Z instanceof o)return console.error(Z.message),1;throw Z}}function Aw(A,B){let Z=B.cwd??process.cwd(),Q=re(A,{cwd:Z}),ee=qt(A),te=Gt(Z),se=zi(Z,Se),me=i(Q.userScope,ee),ye=i(Q.projectScope,te),Re=!1,_e=!1,Ae=[],De=[],Ne=Iw(i(Q.projectScope,se));if($w(),r(Q.userConfigTarget)!==null){let Oe=Fn(Q.userConfigTarget);if(Oe.errors.push(...K(Q.userConfigPath,Q.userScope),...qp(Q.userConfigTarget)),Ae.push({scope:"User",path:Q.userConfigPath,result:Oe,schema:"rules",target:Q.userConfigTarget}),Oe.errors.length>0)Re=!0}if(r(me)!==null)if(_e=!0,r(Q.userConfigTarget)!==null)De.push(Jo("user","cleanup"));else{let Oe=ss(me);if(Ae.push({scope:"User",path:ee,result:Oe,schema:"legacy",inactive:!0,target:me}),De.push(Jo("user",Oe.errors.length>0?"fix-or-delete":"migrate")),Oe.errors.length>0)Re=!0}if(r(Q.projectConfigTarget)!==null){let Oe=Fn(Q.projectConfigTarget);if(Oe.errors.push(...K(Q.projectConfigPath,Q.projectScope),...qp(Q.projectConfigTarget)),Ae.push({scope:"Project",path:zi(Q.projectConfigPath),result:Oe,schema:"rules",target:Q.projectConfigTarget}),Oe.errors.length>0)Re=!0;if(r(ye)!==null)_e=!0,De.push(Jo("project","cleanup"))}else if(r(ye)!==null){_e=!0,Re=!0;let Oe=ss(ye);Ae.push({scope:"Project",path:zi(te),result:Oe,schema:"legacy",inactive:!0,target:ye}),De.push(Jo("project",Oe.errors.length>0?"fix-or-delete":"migrate"))}if(Ne?.result.errors.length)Re=!0;if(Ae.length===0&&!Ne)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Oe of Ae)if(Oe.inactive)Nw(Oe.scope,Oe.path,Oe.result);else if(Oe.result.errors.length>0)Lw(Oe.scope,Oe.path,Oe.result.errors);else{if(Oe.schema==="rules"&&Hw(Oe.target))console.log(`
Added $schema to ${Oe.scope.toLowerCase()} config.`);Dw(Oe.scope,Oe.path,Oe.result,Oe.schema)}for(let Oe of De)console.error(`
${We.red(Oe)}`);if(Ne)if(Ne.result.errors.length>0)Fw(Ne.path,Ne.result.errors);else jw(Ne.path,Ne.result);if(Re)return console.error(`
Config validation failed.`),1;return console.log(_e?`
Configs valid with warnings.`:`
All configs valid.`),0}function qp(A){return(p(A).config?.command_tools??[]).flatMap((B)=>zo(typeof B==="string"?B:B.name)??[])}function Jo(A,B){let Z=`legacy ${A} config`;if(B==="cleanup")return`Warning: Legacy ${A} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(B==="migrate")return`Warning: Legacy ${A} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${A} config is no longer supported. Fix or delete the ${Z}, then run \`npx -y cc-safety-net rule migrate\`.`}function Iw(A){if(be(A)===null)return null;let B=Ow(A);if(B.ruleNames.size===0&&B.errors.length===0)return null;return{path:A.path,result:B}}function Ow(A){let B=[],Z=new Set,Q=(be(A)??[]).filter((ee)=>!Tw.has(ee.name)).sort((ee,te)=>ee.name.localeCompare(te.name));if(Q.length===0)return{errors:B,ruleNames:Z};for(let ee of Q){if(!m.test(ee.name)){B.push(`rulebook directory names must match ${m}: ${ee.name}`);continue}if(ee.kind!=="directory"){B.push(`${ee.name} must be a rulebook directory`);continue}let te=i(A.scope,Rw(A.path,ee.name,"rulebook.json")),se=r(te);if(se===null){B.push(`${ee.name}/rulebook.json is required`);continue}try{let me;try{me=JSON.parse(se)}catch{B.push(`${ee.name}/rulebook.json: invalid JSON`);continue}let ye=fe(me);if(ye.name!==ee.name){B.push(`rulebook name "${ye.name}" must match folder "${ee.name}"`);continue}let Re=Ho(ye);if(Re.length>0){B.push(...Re.map((_e)=>`${ee.name}/rulebook.json: ${_e}`));continue}Z.add(ee.name)}catch(me){B.push(me instanceof Error?`${ee.name}/rulebook.json: ${me.message}`:`${ee.name}/rulebook.json: ${String(me)}`)}}return{errors:B,ruleNames:Z}}function $w(){console.log(Vp),console.log(Ew)}function Dw(A,B,Z,Q){if(console.log(`
✓ ${A} config: ${B}`),console.log(`  Schema: ${Q==="rules"?"rulebook sources":"legacy inline rules"}`),Z.ruleNames.size>0){console.log(`  ${Q==="rules"?"Sources":"Rules"}:`);let ee=1;for(let te of Z.ruleNames)console.log(`    ${ee}. ${te}`),ee++}else console.log(`  ${Q==="rules"?"Sources":"Rules"}: (none)`)}function Nw(A,B,Z){if(console.error(`
✗ Legacy ${A.toLowerCase()} config: ${B}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),Z.errors.length>0){console.error("  Errors:");let Q=1;for(let ee of Z.errors)for(let te of ee.split("; "))console.error(`    ${Q}. ${te}`),Q++;return}if(Z.ruleNames.size>0){console.error("  Rules:");let Q=1;for(let ee of Z.ruleNames)console.error(`    ${Q}. ${ee}`),Q++;return}console.error("  Rules: (none)")}function Lw(A,B,Z){zp(`${A} config`,B,Z)}function jw(A,B){console.log(`
✓ GitHub source rules: ${A}`),console.log("  Rulebooks:");let Z=1;for(let Q of B.ruleNames)console.log(`    ${Z}. ${Q}`),Z++}function Fw(A,B){zp("GitHub source rules",A,B)}function zp(A,B,Z){console.error(`
✗ ${A}: ${B}`),console.error("  Errors:");let Q=1;for(let ee of Z)for(let te of ee.split("; "))console.error(`    ${Q}. ${te}`),Q++}function Hw(A){try{let B=r(A);if(B===null)return!1;let Z=JSON.parse(B);if(Z.$schema)return!1;return v(A,JSON.stringify({$schema:_w,...Z},null,2)),!0}catch(B){if(B instanceof o)throw B;return!1}}var Jp=new Set(["init","add","remove","update","sync","list","wrapper","tool","migrate","doc","verify"]),Uw=new Set(["init","add","remove","update","sync","wrapper"]),Yp=new Set(["add","remove","list"]),Bw="cc-safety-net/rulebooks";async function Zp(A,B){try{return await Gw(A,B)}catch(Z){if(Z instanceof o)return console.error(Z.message),1;throw Z}}async function Gw(A,B){let Z=Vw(B),Q=Z.help?qw(Z.positionals):null;if(Q)return tr(Q),0;if(Z.errors.length>0){for(let Re of Z.errors)console.error(Re);return 1}let ee=Z.positionals[0];if(!ee)return tr(Bt,console.error),1;let te=Z.positionals[1],se={global:Z.global},me=process.cwd();if((ee==="tool"?Z.project:!Z.global&&Uw.has(ee)&&!(ee==="wrapper"&&te==="list"))&&N(A,{cwd:me}))return console.error(`${O(me)} is the user rule config, not a project rule config; ${ee==="tool"?"drop --project":"use --global"} for the user scope, or run from a project directory`),1;if(ee==="init"){let Re=gn(A,se);Jw(Re.configTarget);let _e=Mw(Re.configDir,"example-rules","rulebook.json"),Ae=i(Re.filesystemScope,_e);if(Z.example&&r(Ae)===null)rp(Ae);let De=K(Re.configPath,Re.filesystemScope);for(let Ne of De)console.error(Ne);if(De.length>0)return 1;return console.log("Rule config initialized."),0}if(ee==="add"){let Re=Xp(Z);if(!Re)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let _e=gn(A,se),Ae=await Cp(A,Re,{...se,ref:Z.ref,rulebooks:Z.only.length>0?Z.only:void 0});return Zu(Ae,Re,`Scope: ${Z.global?"user":"project"} (${_e.configDir})`),Ae.ok?0:1}if(ee==="remove"){if(!te)return console.error("rule remove requires a source"),1;let Re=await xp(A,te,{...se,deleteSource:Z.deleteSource});return Fo(Re,`Removed rulebook source: ${te}`),Re.ok?0:1}if(ee==="update"){let Re=await Vo(A,{...se,only:te,refresh:!0});return Fo(Re,"Rule config updated."),Re.ok?0:1}if(ee==="sync")return ll(A,{global:Z.global});if(ee==="list"){let Re=q(A,{cwd:me});return Qu(Re),Re.errors.length>0?1:0}if(ee==="wrapper")return Ww(A,Z);if(ee==="tool")return Zw(A,Z,me);if(ee==="migrate")return _p(A,{cleanup:Z.cleanup,cwd:me});if(ee==="doc"){console.log(Wu);let Re=await Ap(A);if(Re)console.error(Re);return 0}if(ee==="verify")return Kp(A);return 1}function qw(A){if(A.length===0)return Bt;let B=Bt.subcommands.filter((Q)=>Q.usage.split(" ")[0]===A[0]);if(B.length===0)return null;if(A.length===1&&B.length>1)return{name:`rule ${A[0]}`,description:`Subcommands of rule ${A[0]}`,usage:`rule ${A[0]} <subcommand>`,subcommands:B,options:[]};let Z=A.length===1?B[0]:B.find((Q)=>Q.usage.split(" ")[1]===A[1]);if(!Z)return null;return{name:`rule ${A[0]}`,description:Z.description,usage:`rule ${Z.usage}`,options:A[0]==="add"?ns:[],examples:A[0]==="add"?ts:void 0}}function Vw(A){let B=pn({label:"rule",booleans:{global:["-g","--global"],project:["--project"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"],noCwdArg:["--no-cwd-arg"]},values:{ref:["--ref"],cwdArg:["--cwd-arg"]},lists:{only:["--only"]},positionals:"list"},A),Z={...B.flags,ref:B.values.ref,cwdArg:B.values.cwdArg,only:B.lists.only??[],help:B.help,positionals:B.positionals,errors:B.errors};return Kw(Z),Z}function Kw(A){let[B]=A.positionals;if(B&&!Jp.has(B))A.errors.push(`Unknown rule subcommand: ${B}`);if(A.deleteSource&&B!=="remove")if(B&&Jp.has(B))A.errors.push(`Unknown option for rule ${B}: --delete-source`);else A.errors.push("--delete-source is only valid with 'rule remove'");if(A.cleanup&&B!=="migrate")A.errors.push(jn(B,"--cleanup"));if(A.example&&B!=="init")A.errors.push(jn(B,"--example"));if(A.ref&&B!=="add")A.errors.push(jn(B,"--ref"));if(A.only.length>0&&B!=="add")A.errors.push(jn(B,"--only"));let Z=B==="tool"?A.positionals[1]:void 0,Q=Z&&Yp.has(Z)?`tool ${Z}`:B;if(A.project&&Z!=="add"&&Z!=="remove")A.errors.push(jn(Q,"--project"));if(A.cwdArg!==void 0&&Z!=="add")A.errors.push(jn(Q,"--cwd-arg"));if(A.noCwdArg&&Z!=="add")A.errors.push(jn(Q,"--no-cwd-arg"));if(A.noCwdArg&&A.cwdArg!==void 0&&Z==="add")A.errors.push("rule tool add takes --cwd-arg or --no-cwd-arg, not both");if(B==="tool"&&A.global)A.errors.push(jn(B,"--global"));if(B==="add")zw(A);if(B==="migrate"){if(A.global)A.errors.push(jn(B,"--global"));if(A.positionals.length>1)A.errors.push(`Unexpected rule migrate argument: ${A.positionals[1]}`)}else if(B==="wrapper")Wp(A,"a command");else if(B==="tool")Wp(A,"a tool name");else if(A.positionals.length>2)A.errors.push(`Unexpected rule argument: ${A.positionals[2]}`);if(B==="list"&&A.global)A.errors.push("Unknown option for rule list: --global")}function Xp(A){if(A.positionals[1])return A.positionals[1];if(A.ref||A.only.length>0)return Bw;return}function zw(A){let B=Xp(A);if(!B)return;if((A.ref||A.only.length>0)&&!ne(B)){if(A.ref)A.errors.push(`--ref can only select a ref for an owner/repo source: ${B}`);if(A.only.length>0)A.errors.push("--only can only select rulebooks from an owner/repo source");return}if(A.ref&&!le(A.ref))A.errors.push(`--ref must use valid path segments: ${A.ref}`);let Z=A.only.filter((Q)=>!m.test(Q));if(Z.length>0)A.errors.push(`Invalid rulebook names: ${Z.join(", ")}`)}function jn(A,B){return A?`Unknown option for rule ${A}: ${B}`:`Unknown option for rule: ${B}`}function Wp(A,B){let Z=A.positionals[0],Q=A.positionals[1],ee=A.positionals[2];if(!Q){A.errors.push(`rule ${Z} requires add, remove, or list`);return}if(!Yp.has(Q)){A.errors.push(`Unknown rule ${Z} action: ${Q}`);return}if(Q==="list"){if(ee)A.errors.push(`Unexpected rule ${Z} argument: ${ee}`);return}if(!ee){A.errors.push(`rule ${Z} ${Q} requires ${B}`);return}if(Z!=="tool"&&A.positionals.length>3)A.errors.push(`Unexpected rule ${Z} argument: ${A.positionals[3]}`)}function Jw(A){if(r(A)===null){tp(A);return}let B=p(A);if(!B.config)return;hn(A,B.config)}async function Ww(A,B){let Z=B.positionals[1],Q=B.positionals[2],ee=gn(A,{global:B.global}).configTarget;if(Z==="list"){let ye=p(ee);if(ye.errors.length>0){for(let Re of ye.errors)console.error(Re);return 1}return Yw(ye.config?.transparent_wrappers??[]),0}if(!Q||!_.test(Q))return console.error("transparent wrapper must match command pattern"),1;if(Be(Q))return console.error(`reserved command "${Q}" cannot be a wrapper`),1;let te=p(ee);if(te.errors.length>0){for(let ye of te.errors)console.error(ye);return 1}let se=te.config??de,me=Z==="add"?[...new Set([...se.transparent_wrappers??[],Q])]:(se.transparent_wrappers??[]).filter((ye)=>ye!==Q);return hn(ee,{...se,transparent_wrappers:me}),console.log(Z==="add"?`Added transparent wrapper: ${Q}`:`Removed transparent wrapper: ${Q}`),0}function Yw(A){if(A.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${A.length}):`);for(let B of A)console.log(`  - ${B}`)}function Zw(A,B,Z){let Q=B.positionals[1],ee=[...new Set(B.positionals.slice(2))];if(Q==="list")return Xw(A,Z);let te=[...ee.flatMap((_e)=>{if(!Ve.test(_e))return[`"${_e}" is not a tool name: ${Ee}.`];let Ae=Q==="add"?zo(_e):void 0;return Ae?[Ae]:[]}),...B.cwdArg!==void 0&&!Ve.test(B.cwdArg)?[`"${B.cwdArg}" is not an argument name: ${Ee}.`]:[]];if(te.length>0){for(let _e of te)console.error(We.red(`Error: ${_e}`));return 1}let se=gn(A,{global:!B.project}),me=Or(se.configTarget);if(!me.ok){for(let _e of me.result.errors)console.error(_e);return 1}let ye=B.noCwdArg?!1:B.cwdArg,Re=ee.reduce((_e,Ae)=>{let De=ye===void 0?Ae:{name:Ae,cwd:ye},Ne=(Oe)=>(typeof Oe==="string"?Oe:Oe.name)===Ae;if(Q==="remove")return _e.filter((Oe)=>!Ne(Oe));return _e.some(Ne)?_e.map((Oe)=>Ne(Oe)?De:Oe):[..._e,De]},me.config.command_tools??[]);hn(se.configTarget,{...me.config,command_tools:Re});for(let _e of ee)console.log(Q==="add"?`Added command tool: ${_e}${ye===void 0?"":ye===!1?" (no cwd argument)":` (cwd argument: ${ye})`}`:`Removed command tool: ${_e}`);return console.log(`Scope: ${B.project?"project":"user"} (${se.configPath})`),0}function Xw(A,B){let Z=(N(A,{cwd:B})?["user"]:["user","project"]).map((ee)=>{let te=gn(A,{global:ee==="user"});return{scope:ee,path:te.configPath,...p(te.configTarget)}}),Q=Z.flatMap((ee)=>ee.errors.map((te)=>`${ee.path}: ${te}`));if(Q.length>0){for(let ee of Q)console.error(ee);return 1}return ep(Z.flatMap((ee)=>(ee.config?.command_tools??[]).map((te)=>({scope:ee.scope,tool:te})))),0}import{sep as ok}from"node:path";import{existsSync as Qw,readFileSync as ek}from"node:fs";import{join as nk}from"node:path";async function tk(A){if(A.isTTY)return null;return(await St(A).catch(()=>null))?.trim()||null}function rk(A){let B=A.env.get("CLAUDE_SETTINGS_PATH");if(B)return B;return nk(no(A),"settings.json")}function Ji(A){let B=rk(A);if(!Qw(B))return!1;try{let Z=ek(B,"utf-8"),Q=JSON.parse(Z);if(!Q.enabledPlugins)return!1;let ee="cc-safety-net@cc-marketplace";if(!(ee in Q.enabledPlugins))return!1;return Q.enabledPlugins[ee]===!0}catch(Z){if(C(n.debug,A.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${B}: ${Z instanceof Error?Z.message:String(Z)}`);return!1}}async function Wi(A,B=process.stdin){let Z=Ji(A),Q;if(!Z)Q="\uD83D\uDEE1️ CC Safety Net ❌";else{let te=S(A,{cwd:process.cwd()}),se=te.policy,me=E(se,A.env),ye=Object.values(Y(se,me.capabilities)).some((Ae)=>Ae.changesInherited),Re={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[ye?"custom":me.effectiveLevel],_e=te.policyScopes&&!te.policyScopes.weakeningsIgnored&&te.policyScopes.weakenings.length>0?"\uD83D\uDD3B":"";Q=`\uD83D\uDEE1️ CC Safety Net ${Re}${me.worktreeMode?"\uD83C\uDF33":""}${_e}${te.state==="degraded"?"⚠️":""}`}let ee=await tk(B);if(ee&&!ee.startsWith("{"))console.log(`${ee} | ${Q}`);else console.log(Q)}function Qp(A){let B=S(A,{cwd:process.cwd()}),Z=B.policy,Q=E(Z,A.env),ee=!!process.env.NO_COLOR||!process.stdout.isTTY,te=Math.min(process.stdout.columns||80,100),se=ee?"ok":"✔",me=ee?"OFF":"✘",ye=(Le,je)=>{let nn=`  ${Le.padEnd(13)}${je}`;return(nn.length>te?`${nn.slice(0,te-1)}…`:nn).replaceAll(me,We.red(me))},Re=Object.values(Y(Z,Q.capabilities)).some((Le)=>Le.changesInherited),_e=(Le)=>Le===A.home||Le.startsWith(`${A.home}${ok}`)?`~${Le.slice(A.home.length)}`:Le,Ae={ready:We.green,degraded:We.yellow}[B.state],De=B.policyScopes?.weakenings??[],Ne=[...Ji(A)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...B.diagnostics],Oe=ee?"-":"·";console.log([`${ee?"":"\uD83D\uDEE1️  "}CC Safety Net — ${Ae(B.state)}`,"",ye("Protection",`destructive ${Z.destructiveCommandProtectionEnabled?se:me}   secrets ${Z.secretProtection.enabled?se:me}`),ye("Level",Re?`${Q.effectiveLevel} (customised)`:Q.effectiveLevel),ye("Rules",Z.rules.length===0?"none active":`${Z.rules.length} active`),ye("Policy",_e(d(A))),...B.policyScopes?[ye("Project",_e(b(process.cwd())))]:[],...Q.worktreeMode?[ye("Worktree","relaxations active")]:[],"",...De.length===0?[]:[B.policyScopes?.weakeningsIgnored?"  Project policy (ignored)":"  Project policy",...De.flatMap((Le)=>Cr(Le,"      ",te-6).map((je,nn)=>nn===0?`    ${je}`:je)),""],...Ne.length===0?["  Everything configured is active."]:["  Not active",...Ne.flatMap((Le)=>Cr(Le,"      ",te-6).map((je,nn)=>nn===0?`    ${Oe} ${je}`:je)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as yf}from"node:child_process";import{randomBytes as fk}from"node:crypto";import{existsSync as vf,mkdirSync as mk,readFileSync as gk}from"node:fs";import{createServer as hk}from"node:http";import{dirname as bf,join as yk}from"node:path";import{Writable as vk}from"node:stream";var Wo=500;function sk(A){let B=A.filter((ee)=>ee.decision!=="allow"),Z=A.filter((ee)=>ee.decision==="allow"),Q=Math.min(B.length,Math.max(Wo-Z.length,Math.ceil(Wo/2)));return[...B.slice(0,Q),...Z.slice(0,Wo-Q)]}function ef(A,B,Z=G(A)){if(Z)X(A,Z);let Q=(je)=>new Date(je.getFullYear(),je.getMonth(),je.getDate()).getTime(),ee=Q(new Date),te=new Date(ee);te.setDate(te.getDate()-(B-1));let se=te.getTime(),me=[],ye={count:0};for(let je of Z?Kn(Z,ye):[])for(let nn of Ut(je,ye)){let Xe=new Date(nn.ts).getTime();if(!Number.isFinite(Xe))continue;if(Xe>=se)me.push(nn)}me.sort((je,nn)=>new Date(nn.ts).getTime()-new Date(je.ts).getTime());let Re=Array.from({length:B},()=>0),_e=Array.from({length:B},()=>0),Ae={},De={},Ne={},Oe=0,Le=0;for(let je of me){let nn=je.agent||"unknown";Ae[nn]=(Ae[nn]??0)+1;let Xe=Math.round((ee-Q(new Date(je.ts)))/86400000),rn=B-1-Xe,an=Xe>=0&&Xe<B;if(an)_e[rn]=(_e[rn]??0)+1;if(je.decision!=="allow"){if(Oe++,je.ruleId)De[je.ruleId]=(De[je.ruleId]??0)+1;let en=Qo(je.segment||je.command);if(en)Ne[en]=(Ne[en]??0)+1;if(je.failureStage)Le++;if(an)Re[rn]=(Re[rn]??0)+1}}return{days:B,logsDir:Z,homeDir:A.home,totalInWindow:me.length,truncated:me.length>Wo,unreadable:ye.count,counts:{blocked:Oe,allowed:me.length-Oe,agents:Ae,blockedByDay:Re,analyzedByDay:_e,rules:De,commands:Ne,errors:Le},entries:sk(me).sort((je,nn)=>new Date(nn.ts).getTime()-new Date(je.ts).getTime())}}import{spawn as ik}from"node:child_process";import{existsSync as ak,statSync as lk}from"node:fs";var ck=120000,Yo="Choose the project folder",dk=`try
  return POSIX path of (choose folder with prompt "${Yo}")
on error number -128
  return ""
end try`,uk=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${Yo}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,nf=[{binary:"zenity",args:["--file-selection","--directory",`--title=${Yo}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",Yo]}];function Yi(A,B){if(A==="darwin"||A==="win32")return!0;if(A!=="linux")return!1;if(!B.DISPLAY&&!B.WAYLAND_DISPLAY)return!1;return nf.some((Z)=>Gr(Z.binary,B))}function pk(A,B){if(A==="darwin")return{cmd:"osascript",args:["-e",dk]};if(A==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",uk]};let Z=nf.find((Q)=>Gr(Q.binary,B));return Z?{cmd:Z.binary,args:Z.args}:null}function Zi(A=process.platform,B=process.env){let Z=pk(A,B);if(!Z)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((Q)=>{let ee=ik(Z.cmd,Z.args,{env:B,stdio:["ignore","pipe","pipe"]}),te="",se=!1,me=(Re)=>{if(se)return;se=!0,clearTimeout(ye),Q(Re)},ye=setTimeout(()=>{ee.kill(),me({error:"The folder dialog timed out"})},ck);ee.stdout.on("data",(Re)=>{te+=Re.toString()}),ee.on("error",()=>me({error:`Could not open the folder dialog (${Z.cmd})`})),ee.on("close",()=>{let Re=te.trim().replace(/\/+$/,"");if(!Re)return me({cancelled:!0});if(!ak(Re)||!lk(Re).isDirectory())return me({error:"That selection is not a folder on disk"});me({path:Re})})})}var tf=["en","ja","zh-CN"],rf=["light","dark"],Zo=(A,B)=>A.includes(B),of=(A)=>typeof A==="object"&&A!==null&&!Array.isArray(A),sf=(A)=>{let B=of(A)?A:{};return{...Zo(tf,B.language)?{language:B.language}:{},...Zo(rf,B.theme)?{theme:B.theme}:{}}},af=(A)=>{if(!of(A))return null;let B=Object.keys(A).every((ee)=>ee==="language"||ee==="theme"),Z=A.language===void 0||Zo(tf,A.language),Q=A.theme===void 0||Zo([...rf,"auto"],A.theme);return B&&Z&&Q?A:null},lf=(A,B)=>{let Z=B.language??A.language,Q=B.theme==="auto"?void 0:B.theme??A.theme;return{...Z?{language:Z}:{},...Q?{theme:Q}:{}}};var cf=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CC Safety Net</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22512%22%20height%3D%22512%22%20viewBox%3D%220%200%20512%20512%22%3E%3Crect%20width%3D%22512%22%20height%3D%22512%22%20rx%3D%22112%22%20fill%3D%22%2317161b%22%2F%3E%3Csvg%20x%3D%2240%22%20y%3D%2240%22%20width%3D%22432%22%20height%3D%22432%22%20viewBox%3D%22-172.38%20-172.38%20824.77%20824.77%22%3E%3Cg%20transform%3D%22rotate(45%20240%20240)%22%3E%3Crect%20x%3D%22-30%22%20y%3D%2214%22%20width%3D%22195%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22315%22%20y%3D%2214%22%20width%3D%22195%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22-30%22%20y%3D%2294%22%20width%3D%22115%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22235%22%20y%3D%2294%22%20width%3D%22170%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22155%22%20y%3D%22174%22%20width%3D%22170%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%2275%22%20y%3D%22254%22%20width%3D%22170%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22395%22%20y%3D%22254%22%20width%3D%22115%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22-30%22%20y%3D%22334%22%20width%3D%22195%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22315%22%20y%3D%22334%22%20width%3D%22195%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22-30%22%20y%3D%22414%22%20width%3D%22115%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%22235%22%20y%3D%22414%22%20width%3D%22170%22%20height%3D%2252%22%20rx%3D%229%22%20fill%3D%22%23f5f4f0%22%2F%3E%3Crect%20x%3D%2214%22%20y%3D%22155%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%2294%22%20y%3D%2275%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%2294%22%20y%3D%22395%22%20width%3D%2252%22%20height%3D%22115%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22174%22%20y%3D%22-30%22%20width%3D%2252%22%20height%3D%22195%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22174%22%20y%3D%22315%22%20width%3D%2252%22%20height%3D%22195%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22254%22%20y%3D%22-30%22%20width%3D%2252%22%20height%3D%22115%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22254%22%20y%3D%22235%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22334%22%20y%3D%22155%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22414%22%20y%3D%2275%22%20width%3D%2252%22%20height%3D%22170%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3Crect%20x%3D%22414%22%20y%3D%22395%22%20width%3D%2252%22%20height%3D%22115%22%20rx%3D%229%22%20fill%3D%22%23e5602a%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E%3C%2Fsvg%3E%0A">
  <script id="ccsn-data" type="application/json"></script>
  <script>
// src/gui/frontend/gui-data.ts
var guiData = JSON.parse(document.getElementById("ccsn-data")?.textContent ?? "");

// src/gui/frontend/preferences.ts
var localeByLanguage = new Map([
  ["en", "en"],
  ["ja", "ja"],
  ["zh", "zh-CN"]
]);
var resolveLocale = (saved, languages) => saved ?? languages.map((tag) => localeByLanguage.get(tag.toLowerCase().split("-")[0] ?? "")).find((locale) => locale !== undefined) ?? "en";

// src/gui/frontend/head.ts
document.documentElement.lang = resolveLocale(guiData.preferences.language, navigator.languages);
if (guiData.preferences.theme)
  document.documentElement.style.colorScheme = guiData.preferences.theme;

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

.language-picker {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--faint);
}

.language-picker:hover,
.language-picker:focus-within {
  color: var(--ink);
}

.language-picker svg {
  width: 14px;
  height: 14px;
  flex: none;
}

.language-picker select {
  height: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: inherit;
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

.link-button {
  flex: none;
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.link-button::after {
  content: ' →';
}

.link-button:hover {
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

.master-state {
  color: var(--err-fg);
  font-size: 13px;
  font-weight: 500;
}

.master-state .state-on,
.master-switch:has(:checked) .master-state .state-off {
  display: none;
}

.master-switch:has(:checked) .master-state {
  color: var(--muted);
}

.master-switch:has(:checked) .master-state .state-on {
  display: inline;
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
  flex-wrap: wrap;
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

.rule-row.message-open,
.rule-row.message-open:hover {
  background: var(--fill);
}

.message-button.has-message {
  color: var(--warn-fg);
}

.message-button[aria-expanded='true'] {
  background: var(--hover);
  color: var(--ink);
}

.rule-told {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
  height: auto;
  margin-top: 6px;
  padding: 5px 8px;
  border: 0;
  background: var(--fill);
  color: var(--ink);
  font-size: 13px;
  font-weight: 400;
  text-align: left;
  white-space: normal;
}

.rule-told b {
  flex: none;
  color: var(--faint);
  font-weight: 500;
}

.rule-told span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.message-editor {
  display: grid;
  flex: 0 0 100%;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px 20px;
  padding: 10px 0 4px 46px;
}

.message-fields {
  display: grid;
  align-content: start;
  gap: 14px;
  min-width: 0;
}

.message-fields .field {
  min-width: 0;
}

.message-field-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.message-counter {
  color: var(--faint);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.message-counter.over {
  color: var(--err-fg);
  font-weight: 500;
}

.message-editor textarea {
  min-height: 76px;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
}

.message-editor select {
  justify-self: start;
  max-width: 100%;
}

.message-builtin {
  overflow-wrap: anywhere;
}

.message-builtin button {
  margin-left: 4px;
  vertical-align: baseline;
}

.message-preview {
  display: grid;
  align-content: start;
  gap: 6px;
  min-width: 0;
}

.message-preview pre {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--field-bg);
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.message-preview mark {
  padding: 1px 2px;
  border-radius: 3px;
  background: var(--warn-bg);
  color: var(--ink);
}

.message-foot {
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.message-foot small {
  color: var(--muted);
  font-size: 13px;
}

.message-foot div {
  display: flex;
  gap: 8px;
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

  .message-editor {
    grid-template-columns: minmax(0, 1fr);
    padding-left: 0;
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
        <h1 class="brand-logo"><a class="brand-home" href="#overview" data-i18n-title="navOverview"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 476.62 104" role="img" aria-label="CC Safety Net"><defs><style>@font-face{font-family:'Exo 2 Kit';font-style:italic;font-weight:700;src:url(data:font/woff2;base64,d09GMgABAAAAAAbUAA8AAAAADAQAAAZ7AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGjYbgyQcVgZgP1NUQVRAAGwRCAqJMIdOCxgAATYCJAMsBCAFhDAHIBsHClEU84FMI2Xh/P0gqJpmz2glW7tm2AMGEwsNLDMfvC6JFAYQpPIEwhmU0xSaCF+QTsL/fr9W/1uXRBItlZA9tc/Z9Yv5Q0SSmDWGUAhNRJtlK9FLKKzDiVzMJj0vnDSdSSQEYLKYQBuCGLPALmhtxAISi2ZWHkV0ILcjDR6rs5GDaEcLyx1kdcyODZDVPebrJ2ugbWKILNkBQClYW9HvGxsiWjnNmOQ2JJovesQSRNmQRxoiskig7/FcAHZApkhZYgQ4vYi+qS95Gzs6m+iq/1ig/tdrUQqZrv4fjgwrgfpH/e7GW5n6Rzb9rL5X3/AAgsmcGyQaVq7JNiJbGiDQZxuRxpooiyzIdHCygPSC5IIkIFKwSFffp0/wUjYjKS5NoogLGOjtbnM8VaGhpYcTCWfSUjvZhhtRk4XySaxdpF961G+UqQ3YJJrZLFYS7HMtUh3GLHs+p7KqsoDrMJm1fKF2iC7aKbHDRFwSXCG+l/fnQdB25gYOKUdhafl0d8/Ev9X3TrQNCAYogYfEsePJ6XcDIkE+aQUGZDElS2BgChoenkQCb1eZHKGSOtroYoLZtB/wLvNdq75WT6sH1b3qBnWtukCdgz+U6igQShF/JUOyNCFZJfr1MiFZOyaLnIwFRmUW0AYPWrx061Lb+kxrvDXVyMy0tjTqLbHTwJjYnJjGp/YHQi8tc9z88su6/9Vng45g6C0jENnhfDGo+8Nhd0R+6HTjpbfquv/2rPrLr8/ST16b4dFbrrjDMAK3ZXovuy/TuPyG7Ib+QKjAcXM4rPsfvPHSjEsvu22Z87X3QmZQ3Fv3h13ul0IvGYFX7si+4vLbl7tefz+cf0NEFHQHQnb9D3+x/633mtcGb1txyzsfbFh3r8g+Gpy3czo9uns56BDzymeDRx1u9y2P/CLj4aXwT+UEQ48ZgUhkhfPGoK9H9QdeemmZQ/c/mtMY8MztbiPwRH5LJOJ0xLjd/Z4PFZ3Y2KYtKytYWYfM1o6jlwQ37O/v73Ps7++bmI0fbR0JDx8dmWNZVmJjm1AeGdoMne0IeN3GBh0HOR0H+47/9ql9Gn1m9n0WfSBpVlAV3nVM7PeauM3NbuRAaYXWwDZF2iOE1W3gy8gAWmccde8oddY6wmQ8F/50bf1ARjA/aBkrVUGtQ+mZVuBZ+mCJQ80mLVFUYBErNUGtRWlVmmNbxhaHh8ssJZYHzOfEQnHscF1eNIA2YKd06v4TI/YqqooRdgvH13JC60gb+dNZsyZgaeLjeTeYQgsIuaV6ZFg9EyySJdSi8LVsPNg1lNjs8IDyH5UCXAnVyeKiH6gIaBlPziUdcoFCeEFDY1VLvZSGhaPgkAJURRI/Etcax4TPRV3ADq+EqBCtdBkM8acG8n/WTmyMOum+94aU9/8kWIZ7JE1cEmziR2Lb9NVzFDEYBVzFT24KZagafAljfa6Nr4tkcvaRZg7DmKF1uBxVxJzJgMw2SeOKCqmtJbuMhakeWlnf0JhSETFCaifPzmNurIelamAwcovrEIBtbQEH3GHKZ1LEtMpIF1YNYgJVNa16jW9UBq5DCLa1PRzIPwZQuTI6s1ix6NIKmnp7RwtrwvDMtBSp1iS1Vk95QpnScY0vOaMZCCXYHVzJ/0V0Z4D0CrFjsjCpnT67jIWJMkZZz9CYUhExQmon72HF3qK6I/aC6qrHjZTrXjya2uRdsdfj2G8/WlVdm3VQeyi1af/KvcV1++0F1dUPfBzTGtEbvBoA6lkEIOU5eY+UL7TE7/0t2mL5EuCta2OSAD5Zdv4v/7v//0j7WSvBQguGTaGAOu3L1vj/3f/9qf1s+ZKzaorXNGQla2UJS+Vb5MgC4mUNGXIrGeJcdZG4FFMWsEz+oS7iw/pscwadRDFAVM3j1AUG/mu6Zh/brxcaWorkv2WoJI1PQy1s5V5RFi3mbBlqJYuJUBt5uArj2F4Xi9IvegbJKZJp8mhKaDVeephhBuikhAnaGKCXDtz46KWbHib2nScYYZzdbBj5hnWdjyG6RkVDTIDxdtE4PtYzzBjdFDCjVt/MOmzmahhjnF7zk0w2s56NbGKjCd5SzeVkczwA9lf2UEkVlRSwx9UIUAa4oSOESmYZI4wAOPjqFkwc9ODD9Cu/mrFxQx8+OoD8EJM8gfj645is5Ix30xt51CTtrKeDYQYD+g8zTDcD+NgsGmeDm+R1RP2rWpqtqT9BXclmNgA=) format('woff2')}</style></defs><svg x="0" y="0" width="96" height="96" viewBox="-172.38 -172.38 824.77 824.77"><g transform="rotate(45 240 240)"><rect x="-30" y="14" width="195" height="52" rx="9" fill="currentColor"/><rect x="315" y="14" width="195" height="52" rx="9" fill="currentColor"/><rect x="-30" y="94" width="115" height="52" rx="9" fill="currentColor"/><rect x="235" y="94" width="170" height="52" rx="9" fill="currentColor"/><rect x="155" y="174" width="170" height="52" rx="9" fill="currentColor"/><rect x="75" y="254" width="170" height="52" rx="9" fill="currentColor"/><rect x="395" y="254" width="115" height="52" rx="9" fill="currentColor"/><rect x="-30" y="334" width="195" height="52" rx="9" fill="currentColor"/><rect x="315" y="334" width="195" height="52" rx="9" fill="currentColor"/><rect x="-30" y="414" width="115" height="52" rx="9" fill="currentColor"/><rect x="235" y="414" width="170" height="52" rx="9" fill="currentColor"/><rect x="14" y="155" width="52" height="170" rx="9" fill="#e5602a"/><rect x="94" y="75" width="52" height="170" rx="9" fill="#e5602a"/><rect x="94" y="395" width="52" height="115" rx="9" fill="#e5602a"/><rect x="174" y="-30" width="52" height="195" rx="9" fill="#e5602a"/><rect x="174" y="315" width="52" height="195" rx="9" fill="#e5602a"/><rect x="254" y="-30" width="52" height="115" rx="9" fill="#e5602a"/><rect x="254" y="235" width="52" height="170" rx="9" fill="#e5602a"/><rect x="334" y="155" width="52" height="170" rx="9" fill="#e5602a"/><rect x="414" y="75" width="52" height="170" rx="9" fill="#e5602a"/><rect x="414" y="395" width="52" height="115" rx="9" fill="#e5602a"/></g></svg><text x="115.98" y="62.42" font-family="'Exo 2 Kit','Exo 2',sans-serif" font-style="italic" font-weight="700" font-size="56" letter-spacing="-0.56" fill="currentColor">CC Safety Net</text></svg>
</a></h1>
      </div>
      <nav class="sidenav" data-i18n-aria-label="navSections">
        <a href="#overview" data-nav="overview" data-i18n-title="navOverview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1.5"></rect><rect x="14" y="3" width="7" height="5" rx="1.5"></rect><rect x="14" y="12" width="7" height="9" rx="1.5"></rect><rect x="3" y="16" width="7" height="5" rx="1.5"></rect></svg><span class="sr-only-collapse" data-i18n="navOverview"></span></a>
        <a href="#activity" data-nav="activity" data-i18n-title="navActivity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l3-8 4 16 3-8h4"></path></svg><span class="sr-only-collapse" data-i18n="navActivity"></span></a>
        <a href="#policy" data-nav="policy" data-i18n-title="navProtections"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z"></path></svg><span class="sr-only-collapse" data-i18n="navProtections"></span><span class="nav-dirty" id="nav-dirty" data-i18n="navUnsaved" hidden></span></a>
        <a href="#rules" data-nav="rules" data-i18n-title="navCustomRules"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"></path><path d="M15 3v4h4"></path><path d="M9 12h6M9 16h4"></path></svg><span class="sr-only-collapse" data-i18n="navCustomRules"></span></a>
        <a href="#integrations" data-nav="integrations" data-i18n-title="navAgents"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v5"></path></svg><span class="sr-only-collapse" data-i18n="navAgents"></span></a>
        <a href="#settings" data-nav="settings" data-i18n-title="navSettings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h10M18 8h2M4 16h2M10 16h10"></path><circle cx="16" cy="8" r="2.2"></circle><circle cx="8" cy="16" r="2.2"></circle></svg><span class="sr-only-collapse" data-i18n="navSettings"></span></a>
      </nav>
      <div class="sidebar-foot">
        <a href="https://github.com/kenryu42/cc-safety-net" target="_blank" rel="noopener">GitHub</a>
        <a href="https://ccsafetynet.com/docs" target="_blank" rel="noopener" data-i18n="documentation"></a>
        <label class="language-picker"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"></path></svg><select data-language-select data-i18n-aria-label="language"><option value="en" lang="en">English</option><option value="ja" lang="ja">日本語</option><option value="zh-CN" lang="zh-CN">简体中文</option></select></label>
      </div>
    </aside>
    <div class="content">
      <main>
        <div class="banner" id="protection-banner" role="alert" hidden></div>

        <section class="view" data-view="overview">
          <header class="page-head">
            <div>
              <h2 data-i18n="navOverview"></h2>
              <p data-i18n="overviewIntro"></p>
            </div>
          </header>
          <div class="card status-card" id="status-card" aria-live="polite"><p class="muted" data-i18n="loading"></p></div>
          <section class="section" id="attention" hidden>
            <div class="section-head"><h3 class="section-title" data-i18n="needsAttention"></h3></div>
            <ul class="card list" id="attention-list"></ul>
          </section>
          <div class="tiles" id="overview-tiles"></div>
          <section class="section">
            <div class="section-head">
              <h3 class="section-title" data-i18n="recentBlocks"></h3>
              <a class="link-button" href="#activity" data-i18n="allActivity"></a>
            </div>
            <div id="recent-blocks"></div>
          </section>
          <section class="section">
            <div class="section-head">
              <h3 class="section-title" id="top-rules-title" data-i18n="topRules"></h3>
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
              <h2 data-i18n="navActivity"></h2>
              <p data-i18n="activityIntro"></p>
            </div>
            <button type="button" class="quiet icon-button" id="activity-refresh" data-i18n-aria-label="refreshActivity" data-i18n-title="refreshActivity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg></button>
          </header>
          <div class="toolbar">
            <div class="pills" id="activity-decision" role="group" data-i18n-aria-label="decisionFilter"></div>
            <span class="toolbar-spacer"></span>
            <label class="toolbar-search"><span class="sr-only" data-i18n="searchActivity"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input type="search" id="activity-search" autocomplete="off" data-i18n-placeholder="searchActivityPlaceholder"></label>
            <label class="toolbar-select"><span class="sr-only" data-i18n="agentFilter"></span><select id="activity-agent"></select></label>
            <label class="toolbar-select"><span class="sr-only" data-i18n="timeWindow"></span><select id="activity-days"></select></label>
          </div>
          <div class="filter-line" id="activity-command-filter" hidden></div>
          <div class="card list" id="activity-feed"><p class="empty" data-i18n="loadingActivity"></p></div>
          <p class="footnote" id="activity-count"></p>
        </section>

        <section class="view" data-view="policy" hidden>
          <header class="page-head">
            <div>
              <h2 data-i18n="navProtections"></h2>
              <p data-i18n="policyIntro"></p>
            </div>
            <div class="page-actions">
              <div class="pills" role="group" data-i18n-aria-label="policyScope">
                <button type="button" id="scope-user" aria-pressed="true" data-i18n="myPolicy"></button>
                <button type="button" id="project-draft-enter" aria-pressed="false" data-i18n="projectPolicy"></button>
              </div>
              <button type="button" id="tester-open" aria-haspopup="dialog" data-i18n="testCommand"></button>
            </div>
          </header>
          <div class="project-bar" id="project-draft-bar" hidden>
            <div>
              <strong data-i18n="editingProjectPolicy"></strong> <code id="project-draft-path"></code>
              <p data-i18n-html="projectBarHelp"></p>
            </div>
            <button type="button" id="project-draft-change" data-i18n="changeFolder" hidden></button>
          </div>
          <p class="notice error" id="project-draft-diagnostics" hidden></p>
          <div class="recovery" id="recovery" hidden>
            <div>
              <strong data-i18n="statusRepair"></strong>
              <p data-i18n="repairHelp"></p>
              <p class="notice error" id="policy-errors"></p>
            </div>
            <button class="primary" id="repair" type="button" data-i18n="repair"></button>
          </div>

          <section class="section">
            <div class="section-head">
              <div>
                <h3 class="section-title" data-i18n="safetyPreset"></h3>
                <p class="section-sub" data-i18n="safetyPresetSub"></p>
              </div>
              <span class="preset-status" id="safety-preset-status"></span>
              <span class="project-chip-slot" id="safety-level-chip"></span>
            </div>
            <div class="preset-grid" id="safety-level"></div>
            <p class="notice" id="environment-overrides" hidden></p>
            <details class="card disclosure">
              <summary><span class="disclosure-title" data-i18n="advancedSettings"></span><span class="disclosure-sub" data-i18n="advancedSettingsSub"></span></summary>
              <div class="disclosure-body">
                <div id="safety-overrides"></div>
                <div id="workflow"></div>
              </div>
            </details>
          </section>

          <div class="toolbar policy-toolbar">
            <label class="toolbar-search primary-search"><span class="sr-only" data-i18n="searchProtections"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input type="search" id="policy-search" autocomplete="off" aria-keyshortcuts="/" data-i18n-placeholder="searchProtectionsPlaceholder"></label>
            <div class="pills" role="group" data-i18n-aria-label="protectionsShown">
              <button type="button" data-policy-show="all" aria-pressed="true" data-i18n="filterAll"></button>
              <button type="button" data-policy-show="changed" aria-pressed="false"><span data-i18n="showChanged"></span> <span class="count" id="changed-count"></span></button>
            </div>
          </div>

          <section class="card panel" id="destructive-panel">
            <div class="panel-head">
              <div>
                <h3 class="section-title" id="destructive-label" data-i18n="commandProtection"></h3>
                <p class="section-sub" id="destructive-command-summary"></p>
              </div>
              <div class="section-actions">
                <button type="button" class="quiet" id="reset-rule-customizations" data-i18n="resetAll"></button>
                <span class="project-chip-slot" id="destructive-enabled-chip"></span>
                <label class="master-switch"><span class="master-state"><span class="state-on" data-i18n="switchOn"></span><span class="state-off" data-i18n="switchOff"></span></span><input type="checkbox" class="switch" id="destructive-enabled" aria-labelledby="destructive-label"></label>
              </div>
            </div>
            <div class="panel-list" id="destructive-command-rules"></div>
          </section>

          <section class="card panel" id="secret-panel">
            <div class="panel-head">
              <div>
                <h3 class="section-title" id="secret-label" data-i18n="secretProtection"></h3>
                <p class="section-sub" id="secret-summary"></p>
              </div>
              <div class="section-actions">
                <button type="button" class="quiet" id="reset-secret-customizations" data-i18n="resetAll"></button>
                <span class="project-chip-slot" id="secret-enabled-chip"></span>
                <label class="master-switch"><span class="master-state"><span class="state-on" data-i18n="switchOn"></span><span class="state-off" data-i18n="switchOff"></span></span><input type="checkbox" class="switch" id="secret-enabled" aria-labelledby="secret-label"></label>
              </div>
            </div>
            <div class="panel-list" id="secret-patterns"></div>
          </section>

          <section class="card panel">
            <div class="panel-head">
              <div>
                <h3 class="section-title" data-i18n="pathsTitle"></h3>
                <p class="section-sub" data-i18n-html="pathsSub"></p>
              </div>
            </div>
            <div class="panel-rows">
              <div class="path-list">
                <div class="path-list-head"><strong id="allow-paths-label" data-i18n="allowPathsLabel"></strong><span class="count" id="allow-paths-count"></span><span class="project-chip-slot" id="allow-paths-chip"></span></div>
                <p class="path-list-help" data-i18n-html="allowPathsHelp"></p>
                <div class="input-row"><input type="text" class="mono" id="allow-paths-input" data-path-input="allow-paths" autocomplete="off" spellcheck="false" data-i18n-placeholder="allowPathsPlaceholder" aria-labelledby="allow-paths-label"><button type="button" id="allow-paths-add-button" data-path-add="allow-paths" data-i18n="add"></button></div>
                <p class="field-error" id="allow-paths-hint" hidden></p>
                <ul class="paths" id="allow-paths-list"></ul>
              </div>
              <div class="path-list">
                <div class="path-list-head"><strong id="deny-paths-label" data-i18n="denyPathsLabel"></strong><span class="count" id="deny-paths-count"></span><span class="project-chip-slot" id="deny-paths-chip"></span></div>
                <p class="path-list-help" data-i18n="denyPathsHelp"></p>
                <div class="input-row"><input type="text" class="mono" id="deny-paths-input" data-path-input="deny-paths" autocomplete="off" spellcheck="false" data-i18n-placeholder="denyPathsPlaceholder" aria-labelledby="deny-paths-label"><button type="button" id="deny-paths-add-button" data-path-add="deny-paths" data-i18n="add"></button></div>
                <p class="field-error" id="deny-paths-hint" hidden></p>
                <ul class="paths" id="deny-paths-list"></ul>
              </div>
              <div class="path-list">
                <div class="path-list-head"><strong id="secret-allow-paths-label" data-i18n="secretAllowPathsLabel"></strong><span class="count" id="secret-allow-paths-count"></span><span class="project-chip-slot" id="secret-allow-paths-chip"></span></div>
                <p class="path-list-help" data-i18n-html="secretAllowPathsHelp"></p>
                <div class="input-row"><input type="text" class="mono" id="secret-allow-paths-input" data-path-input="secret-allow-paths" autocomplete="off" spellcheck="false" placeholder="~/code/**/.env.local" aria-labelledby="secret-allow-paths-label"><button type="button" id="secret-allow-paths-add-button" data-path-add="secret-allow-paths" data-i18n="add"></button></div>
                <p class="field-error" id="secret-allow-paths-hint" hidden></p>
                <ul class="paths" id="secret-allow-paths-list"></ul>
              </div>
            </div>
          </section>

          <details class="card disclosure">
            <summary><span class="disclosure-title" data-i18n="policyJson"></span><span class="disclosure-sub" id="raw-source" data-i18n="rawReadOnly"></span></summary>
            <div class="disclosure-body json-body">
              <button type="button" class="quiet" id="raw-copy"></button>
              <textarea id="raw" data-i18n-aria-label="policyJson" aria-describedby="raw-source" readonly></textarea>
            </div>
          </details>

          <div class="savebar" id="policy-savebar" hidden>
            <div class="savebar-text">
              <strong id="savebar-title" data-i18n="unsavedChanges"></strong>
              <span id="savebar-summary"></span>
            </div>
            <div class="savebar-actions">
              <button type="button" id="discard-changes" data-i18n="discard"></button>
              <button type="button" class="primary" id="save" data-i18n="save"></button>
            </div>
          </div>
        </section>

        <section class="view" data-view="rules" hidden>
          <header class="page-head">
            <div>
              <h2 data-i18n="navCustomRules"></h2>
              <p data-i18n="rulesIntro"></p>
            </div>
            <button type="button" class="quiet icon-button" id="rules-refresh" data-i18n-aria-label="refreshRules" data-i18n-title="refreshRules"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg></button>
          </header>
          <section class="section" id="rules-diagnostics-panel" hidden>
            <div class="section-head">
              <div>
                <h3 class="section-title" data-i18n="problems"></h3>
                <p class="section-sub" data-i18n="problemsSub"></p>
              </div>
            </div>
            <div class="notices" id="rules-diagnostics"></div>
          </section>
          <section class="section">
            <div class="section-head">
              <div>
                <h3 class="section-title" data-i18n="rulebooks"></h3>
                <p class="section-sub" data-i18n="rulebooksSub"></p>
              </div>
            </div>
            <div id="rules-list"><p class="empty" data-i18n="loadingRules"></p></div>
          </section>
          <section class="section" id="rules-composer-panel">
            <div class="section-head">
              <div>
                <h3 class="section-title" data-i18n="createRule"></h3>
                <p class="section-sub" data-i18n="createRuleSub"></p>
              </div>
            </div>
            <div class="card pad">
              <div class="form-grid">
                <div class="field">
                  <span class="field-label" data-i18n="appliesTo"></span>
                  <div class="pills" role="group" data-i18n-aria-label="ruleScope">
                    <button type="button" data-rules-scope="project" aria-pressed="true" data-i18n="thisProject"></button>
                    <button type="button" data-rules-scope="user" aria-pressed="false" data-i18n="allProjects"></button>
                  </div>
                </div>
                <div class="field" id="rules-project-path-field">
                  <label class="field-label" id="rules-project-path-label" for="rules-project-path" data-i18n="projectFolder"></label>
                  <div class="input-row">
                    <input type="text" class="mono" id="rules-project-path" spellcheck="false" autocomplete="off" aria-describedby="rules-project-path-hint">
                    <button type="button" id="rules-choose-directory" data-i18n="chooseFolder" hidden></button>
                  </div>
                  <small id="rules-project-path-hint" data-i18n="projectFolderHint"></small>
                </div>
                <div class="field">
                  <label class="field-label" id="rules-composer-label" for="rules-composer-input" data-i18n="ruleRequest"></label>
                  <textarea id="rules-composer-input" spellcheck="false" data-i18n-placeholder="ruleRequestPlaceholder" aria-describedby="rules-composer-hint"></textarea>
                  <small id="rules-composer-hint" data-i18n="ruleRequestHint"></small>
                  <div class="chip-row">
                    <span class="chip-row-label" data-i18n="tryExamples"></span>
                    <button type="button" class="chip" data-rules-example="suggest" data-i18n="exampleSuggest"></button>
                    <button type="button" class="chip" data-rules-example="block" data-i18n="exampleBlock"></button>
                    <button type="button" class="chip" data-rules-example="verify" data-i18n="exampleVerify"></button>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="primary" id="rules-copy-prompt" data-i18n="copyPrompt"></button>
              </div>
            </div>
          </section>
        </section>

        <section class="view" data-view="integrations" hidden>
          <header class="page-head">
            <div>
              <h2 data-i18n="navAgents"></h2>
              <p data-i18n="agentsIntro"></p>
            </div>
            <button type="button" class="quiet icon-button" id="integrations-refresh" data-i18n-aria-label="refreshAgents" data-i18n-title="refreshAgents"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"></path><path d="M20 4v7h-7"></path></svg></button>
          </header>
          <div class="agent-groups" id="integrations-list"><p class="empty" data-i18n="checkingAgents"></p></div>
        </section>

        <section class="view" data-view="settings" hidden>
          <header class="page-head">
            <div>
              <h2 data-i18n="navSettings"></h2>
              <p data-i18n="settingsIntro"></p>
            </div>
          </header>
          <section class="section">
            <div class="section-head"><h3 class="section-title" data-i18n="appearance"></h3></div>
            <div class="card rows">
              <div class="setting-row">
                <div class="setting-text"><strong data-i18n="theme"></strong><small data-i18n="preferenceHint"></small></div>
                <div class="pills" id="settings-theme" role="group" data-i18n-aria-label="theme">
                  <button type="button" data-theme-choice="auto" aria-pressed="true" data-i18n="themeAuto"></button>
                  <button type="button" data-theme-choice="light" aria-pressed="false" data-i18n="themeLight"></button>
                  <button type="button" data-theme-choice="dark" aria-pressed="false" data-i18n="themeDark"></button>
                </div>
              </div>
            </div>
          </section>
          <section class="section">
            <div class="section-head"><h3 class="section-title" data-i18n="auditLog"></h3></div>
            <div class="card rows">
              <div class="setting-row">
                <div class="setting-text"><label for="retention-days"><strong data-i18n="keepLogsFor"></strong></label><small id="retention-note" data-i18n="retentionNote"></small></div>
                <span class="retention-input"><input type="number" id="retention-days" min="1" max="365" step="1" inputmode="numeric" aria-describedby="retention-note"><span id="retention-unit"></span></span>
              </div>
              <div class="setting-row info"><span class="setting-label" data-i18n="logFolder"></span><code id="logs-path"></code><button type="button" class="quiet small" data-copy-path="logs-path" data-i18n-aria-label="copyLogFolder"></button></div>
            </div>
          </section>
          <section class="section">
            <div class="section-head"><h3 class="section-title" data-i18n="files"></h3></div>
            <div class="card rows">
              <div class="setting-row info"><span class="setting-label" data-i18n="policyFile"></span><code id="policy-path"></code><button type="button" class="quiet small" data-copy-path="policy-path" data-i18n-aria-label="copyPolicyPath"></button></div>
              <div class="setting-row info" id="project-policy-row" hidden><span class="setting-label" data-i18n="projectPolicy"></span><code id="project-policy-path"></code><button type="button" class="quiet small" data-copy-path="project-policy-path" data-i18n-aria-label="copyProjectPolicyPath"></button></div>
            </div>
            <p class="notice" id="project-policy-notice" hidden></p>
          </section>
          <section class="section">
            <div class="section-head"><h3 class="section-title" data-i18n="about"></h3></div>
            <div class="card rows">
              <div class="setting-row info"><span class="setting-label">CC Safety Net</span><code id="app-version"></code></div>
              <div class="setting-row info"><span class="setting-label">Node.js</span><code id="integrations-node-version"></code></div>
              <div class="setting-row info"><span class="setting-label" data-i18n="platform"></span><code id="integrations-platform"></code></div>
            </div>
          </section>
          <section class="section">
            <div class="section-head"><h3 class="section-title" data-i18n="dangerZone"></h3></div>
            <div class="card rows">
              <div class="setting-row">
                <div class="setting-text"><strong data-i18n="resetPolicy"></strong><small data-i18n="resetPolicyHelp"></small></div>
                <button type="button" class="danger-quiet" id="reset" data-i18n="resetPolicy"></button>
              </div>
            </div>
          </section>
        </section>
      </main>
      <footer class="app-foot">
        <a href="https://github.com/kenryu42/cc-safety-net" target="_blank" rel="noopener">GitHub</a>
        <a href="https://ccsafetynet.com/docs" target="_blank" rel="noopener" data-i18n="documentation"></a>
        <label class="language-picker"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"></path></svg><select data-language-select data-i18n-aria-label="language"><option value="en" lang="en">English</option><option value="ja" lang="ja">日本語</option><option value="zh-CN" lang="zh-CN">简体中文</option></select></label>
      </footer>
    </div>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite" hidden>
    <div class="toast-text">
      <strong id="toast-title"></strong>
      <p id="toast-detail" hidden></p>
    </div>
    <button type="button" class="quiet icon-only" id="toast-close" data-i18n-aria-label="dismissMessage">✕</button>
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
        <button type="submit" id="confirm-dialog-cancel" value="cancel" data-i18n="cancel"></button>
        <button type="submit" class="danger" id="confirm-dialog-confirm" value="confirm"></button>
      </div>
    </form>
  </dialog>
  <dialog class="confirm-dialog tester-dialog" id="tester-dialog" aria-labelledby="tester-label" aria-describedby="tester-help">
    <form id="tester-form">
      <h2 id="tester-label" data-i18n="testCommand"></h2>
      <p id="tester-help" data-i18n="testerHelp"></p>
      <div class="input-row">
        <label class="prompt-field"><span class="prompt" aria-hidden="true">$</span><input type="text" id="tester-input" class="mono" autocomplete="off" spellcheck="false" placeholder="git push --force" aria-labelledby="tester-label"></label>
        <button type="submit" class="primary" id="tester-run" data-i18n="test"></button>
      </div>
      <div id="tester-result" class="notice" aria-live="polite" hidden></div>
      <div class="dialog-actions">
        <button type="button" id="tester-close" data-i18n="close"></button>
      </div>
    </form>
  </dialog>
  <dialog class="confirm-dialog report-dialog" id="report-dialog" aria-labelledby="report-dialog-title" aria-describedby="report-dialog-body">
    <form method="dialog">
      <h2 id="report-dialog-title" data-i18n="reportDialogTitle"></h2>
      <p id="report-dialog-body" data-i18n-html="reportDialogBody"></p>
      <label class="report-field"><span data-i18n="reportWhy"></span><textarea id="report-why" data-i18n-placeholder="reportWhyPlaceholder"></textarea></label>
      <label class="report-field"><span data-i18n="reportTitleField"></span><input id="report-title" type="text" spellcheck="false"></label>
      <label class="report-field"><span data-i18n="reportCommandField"></span><textarea id="report-command" spellcheck="false"></textarea></label>
      <label class="report-field"><span data-i18n="reportEntryField"></span><textarea id="report-entry" spellcheck="false"></textarea></label>
      <div class="dialog-actions">
        <button type="submit" id="report-dialog-cancel" value="cancel" data-i18n="cancel"></button>
        <button type="submit" class="primary" id="report-dialog-open" value="report" data-i18n="openGitHubForm"></button>
      </div>
    </form>
  </dialog>
  <script>
// src/gui/frontend/gui-data.ts
var guiData = JSON.parse(document.getElementById("ccsn-data")?.textContent ?? "");

// src/gui/frontend/locales/en.ts
var count = (value) => value.toLocaleString("en");
var plural = (value, one, many) => \`\${count(value)} \${value === 1 ? one : many}\`;
var days = (value) => plural(value, "day", "days");
var en = {
  navSections: "Sections",
  navOverview: "Overview",
  navActivity: "Activity",
  navProtections: "Protections",
  navCustomRules: "Custom rules",
  navAgents: "Agents",
  navSettings: "Settings",
  navUnsaved: "Unsaved",
  documentation: "Documentation",
  loading: "Loading…",
  dismissMessage: "Dismiss message",
  cancel: "Cancel",
  close: "Close",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Copy failed",
  add: "Add",
  reset: "Reset",
  resetAll: "Reset all",
  repair: "Repair",
  save: "Save",
  discard: "Discard",
  savingStatus: "Saving…",
  saveFailed: "Save failed",
  reloadPage: "Reload the page.",
  unknownValue: "unknown",
  requestFailed: (status) => \`Request failed (status \${status}).\`,
  switchOn: "On",
  switchOff: "Off",
  stateOn: "on",
  stateOff: "off",
  stateDefault: "default",
  listSeparator: ", ",
  settingChange: (name, value) => \`\${name}: \${value}\`,
  dayUnit: (value) => value === 1 ? "day" : "days",
  dayCount: days,
  lastDays: (value) => \`last \${days(value)}\`,
  lastDaysOption: (value) => \`Last \${days(value)}\`,
  ruleCount: (value) => plural(value, "rule", "rules"),
  blockCount: (value) => plural(value, "block", "blocks"),
  pathCount: (value) => plural(value, "path", "paths"),
  justNow: "just now",
  today: "Today",
  yesterday: "Yesterday",
  overviewIntro: "What CC Safety Net has been doing on this machine.",
  needsAttention: "Needs attention",
  recentBlocks: "Recent blocks",
  allActivity: "All activity",
  topRules: "Most-triggered rules",
  statusRepair: "Your policy file needs repair",
  statusCheckingAgents: "Checking your agents…",
  statusNoAgent: "Not protecting any agent yet",
  statusPartlyProtected: "Partly protected",
  statusProtected: "Protected",
  commandProtectionIsOff: "Command protection is off",
  secretProtectionIsOff: "Secret protection is off",
  secretProtectionIsOn: "Secret protection on",
  presetFact: (preset, customized) => \`\${preset} preset\${customized ? ", customized" : ""}\`,
  commandRulesOn: (value) => \`\${count(value)} command rules on\`,
  hookActiveIn: (agents) => \`Hook active in \${agents}\`,
  agentCount: (value) => plural(value, "agent", "agents"),
  installHook: "Install a hook",
  configure: "Configure",
  review: "Review",
  fix: "Fix",
  releaseNotes: "Release notes",
  hookDisabledAttention: (agent) => \`\${agent} is detected but its hook is disabled.\`,
  suspectAttention: (blocks, window2) => \`\${plural(blocks, "block", "blocks")} in the last \${days(window2)} \${blocks === 1 ? "looks" : "look"} like a false positive.\`,
  guardErrorAttention: (errors, window2) => \`\${plural(errors, "guard error", "guard errors")} in the last \${days(window2)}: commands blocked because evaluation failed, not by policy.\`,
  updateAttention: (version) => \`Version \${version} is available.\`,
  tileBlocked: "Blocked",
  tileChecked: "Commands checked",
  perDayChart: (noun, values) => \`\${noun} per day, oldest to newest: \${values}\`,
  nothingBlocked: (window2) => \`Nothing was blocked in the last \${days(window2)}.\`,
  noCommandRecorded: "(no command recorded)",
  guardError: "guard error",
  noRuleBlocked: "No rule has blocked anything yet.",
  couldNotLoadActivity: (error) => \`Could not load activity: \${error}\`,
  starEvidence: (blocked, window2) => \`CC Safety Net has blocked <strong>\${count(blocked)}</strong> risky \${blocked === 1 ? "command" : "commands"} on this machine in the last \${days(window2)}.\`,
  starIfSaved: "If that saved your work, star the project on GitHub.",
  starIfUseful: "If CC Safety Net is useful to you, star it on GitHub.",
  starOnGitHub: "Star on GitHub",
  starButtonLabel: "Star CC Safety Net on GitHub",
  starLinkLabel: "Star CC Safety Net on GitHub (opens github.com)",
  starred: "Starred. Thank you.",
  starredLabel: "CC Safety Net starred on GitHub",
  activityIntro: "Commands your agents ran, newest first. Commands are secret-redacted when they are logged.",
  refreshActivity: "Refresh activity",
  decisionFilter: "Decision",
  searchActivity: "Search activity",
  searchActivityPlaceholder: "Search commands or rule IDs",
  agentFilter: "Agent",
  timeWindow: "Time window",
  loadingActivity: "Loading activity…",
  decisionBlocked: "Blocked",
  decisionAllowed: "Allowed",
  decisionError: "Error",
  filterErrors: "Errors",
  filterSuspect: "Likely false positive",
  filterAll: "All",
  allAgents: "All agents",
  showingBlocksOf: "Showing blocks of",
  showAllBlocks: "Show all blocks",
  noFilterMatch: "Nothing matches these filters.",
  showAllActivity: "Show all activity",
  noLogEntries: "No audit log entries match.",
  showingEntries: (shown, total, window2) => \`Showing \${count(shown)} of \${plural(total, "entry", "entries")} from the last \${days(window2)}.\`,
  activityTruncated: "Only the newest 500 entries of each decision are listed. Older entries still count toward the totals.",
  unreadableLogs: (files) => \`\${plural(files, "log file", "log files")} could not be read, so this list is incomplete.\`,
  detailFullCommand: "Full command",
  detailReason: "Reason",
  detailRule: "Rule",
  detailFolder: "Folder",
  detailTime: "Time",
  showCustomRule: "Show this custom rule",
  showProtection: "Show this protection",
  reportFalsePositive: "Report false positive",
  blockInFuture: "Block this in future",
  copyLogEntry: "Copy log entry",
  notAvailable: "Not available",
  reportTooLong: "Report too long to prefill",
  reportFieldCopied: (fields, fieldCount) => fieldCount === 1 ? \`The \${fields} was copied to your clipboard. Paste it into the form on GitHub.\` : \`The \${fields} were copied to your clipboard. Paste them into the form on GitHub.\`,
  reportFieldLeftOut: (fields, fieldCount) => \`The \${fields} \${fieldCount === 1 ? "was" : "were"} left out. Copy the log entry from Activity and paste it into the form on GitHub.\`,
  reportFieldJoiner: " and ",
  reportNameTitle: "title",
  reportNameExpected: "explanation",
  reportNameCommand: "command",
  reportNameEntry: "log entry",
  reportDialogTitle: "Report a false positive",
  reportDialogBody: "This opens a prefilled public GitHub issue form. Nothing is sent until you submit it there. Paths were replaced with <code>&lt;project&gt;</code> and <code>~</code>; edit anything else you would rather not publish.",
  reportWhy: "Why should it have been allowed? (optional)",
  reportWhyPlaceholder: "What was the agent trying to do, and what makes the command safe there?",
  reportTitleField: "Title",
  reportCommandField: "Blocked command",
  reportEntryField: "Audit log entry",
  openGitHubForm: "Open GitHub form",
  policyIntro: "Choose what CC Safety Net blocks. Changes apply after you save.",
  policyScope: "Policy you are editing",
  myPolicy: "My policy",
  projectPolicy: "Project policy",
  testCommand: "Test a command",
  editingProjectPolicy: "Editing the project policy",
  projectBarHelp: \`Only settings tagged <span class="project-chip">Project</span> are written. Everything else keeps following each person's own policy. Click a Project tag to stop setting that field.\`,
  changeFolder: "Change folder…",
  repairHelp: "Repair keeps every valid setting and rewrites the file. If the JSON cannot be read at all, defaults are restored.",
  safetyPreset: "Safety preset",
  safetyPresetSub: "Each preset includes everything in the one before it.",
  advancedSettings: "Advanced settings",
  advancedSettingsSub: "Individual checks and linked worktrees",
  searchProtections: "Search protections",
  searchProtectionsPlaceholder: "Type / to search by name, path or rule ID",
  protectionsShown: "Which protections to show",
  showChanged: "Changed from default",
  commandProtection: "Command protection",
  secretProtection: "Secret protection",
  pathsTitle: "Exceptions and extra paths",
  pathsSub: "Paths can be absolute or start with <code>~/</code>. Paste several lines to add many at once. Paths that cover your home directory are rejected.",
  allowPathsLabel: "Allow recursive deletes in",
  allowPathsHelp: "Recursive deletes inside these paths are not blocked, like a scratch folder under <code>/tmp</code>.",
  allowPathsPlaceholder: "/absolute/path or ~/path",
  denyPathsLabel: "Always block access to",
  denyPathsHelp: "These paths and everything inside them are blocked while secret protection is on.",
  denyPathsPlaceholder: "path/to/protect",
  secretAllowPathsLabel: "Paths exempt from secret patterns",
  secretAllowPathsHelp: "Files, folders, or one file name under a folder such as <code>~/code/**/.env.local</code>. Deny paths and coding agent credentials stay protected.",
  policyJson: "Policy JSON",
  rawReadOnly: "Read-only. Mirrors the settings above.",
  rawOnDisk: "The file as it is on disk.",
  rawProjectFields: (path) => \`Only the fields set by this project. Written to \${path}.\`,
  unsavedChanges: "Unsaved changes",
  unsavedChangeCount: (changes) => plural(changes, "unsaved change", "unsaved changes"),
  changeSeparator: "; ",
  moreChanges: (changes) => \`; and \${count(changes)} more\`,
  reviewAndApply: "Review and apply",
  presetStandard: "Standard",
  presetStandardDescription: "Blocks recognizable destructive commands and reading sensitive files. Recommended for normal coding.",
  presetStrict: "Strict",
  presetStrictDescription: "Also blocks commands it cannot fully parse, listing sensitive paths, and curl or wget uploads to remote hosts. Occasional false positives on advanced shell.",
  presetParanoid: "Paranoid",
  presetParanoidDescription: "Also blocks rm -rf inside your project and interpreter one-liners. Expect more false positives. Use it for untrusted agents or high-stakes repos.",
  capabilityFailClosed: "Fail closed",
  capabilityFailClosedDescription: "Block commands the parser cannot fully understand and curl or wget uploads to remote hosts.",
  capabilityParanoidRm: "Paranoid rm -rf checks",
  capabilityParanoidRmDescription: "Block rm -rf inside the project, except temp paths.",
  capabilityParanoidInterpreters: "Paranoid interpreters",
  capabilityParanoidInterpretersDescription: "Block interpreter one-liners such as python -c.",
  presetLabel: "Preset",
  presetCustomized: (preset) => \`\${preset}, customized\`,
  fromPresetOption: (enabled) => \`From preset (\${enabled ? "on" : "off"})\`,
  fromPreset: "from preset",
  forcedOn: "forced on",
  forcedOff: "forced off",
  alwaysOn: "Always on",
  alwaysOff: "Always off",
  cannotTurnOff: "can't be turned off",
  worktreeDiscard: "Allow discarding local changes in linked git worktrees",
  worktreeDiscardHelp: "Only relaxes the discard checks inside linked worktrees.",
  worktreeChange: "Discarding changes in linked worktrees",
  allowed: "allowed",
  blocked: "blocked",
  allowPathsChange: "Allowed delete paths",
  denyPathsChange: "Always-blocked paths",
  secretAllowPathsChange: "Secret pattern exemptions",
  pathsAdded: (paths) => \`\${count(paths)} added\`,
  pathsRemoved: (paths) => \`\${count(paths)} removed\`,
  changedByYou: "Changed by you",
  forcedInAdvanced: (capability, enabled) => \`\${capability} forced \${enabled ? "on" : "off"} in Advanced\`,
  setByEnvironment: "Set by environment",
  setByEnvironmentVariable: (variable) => \`Set by environment: \${variable}\`,
  needsPreset: (preset) => \`Needs the \${preset} preset\`,
  offByDefault: "Off by default",
  customMessageNote: "Custom message",
  customMessageCount: (messages) => plural(messages, "custom message", "custom messages"),
  customMessageChange: "custom message",
  builtInMessageChange: "built-in message",
  blockMessage: "Block message",
  blockMessageFor: (rule) => \`Block message for \${rule}\`,
  agentIsTold: "Agent is told",
  ruleMessageLabel: "What the agent is told",
  ruleMessageBuiltIn: (reason) => \`Built-in: \${reason}\`,
  ruleMessageUseBuiltIn: "Start from this",
  ruleMessageBuiltInVaries: "(the built-in reason for the blocked command)",
  ruleMessageIntentLabel: "What the agent should do next",
  ruleMessageIntentHelp: "Sets the closing line of the message.",
  ruleMessageIntentBuiltIn: (intent) => \`Built-in: \${intent}\`,
  intentHardStop: "Stop and report to me",
  intentUseAlternative: "Use the alternative in the message",
  intentScopeDown: "Retry with a narrower target",
  intentManualOnly: "Ask me to run it myself",
  intentStopAndExplain: "Simplify the command, or report to me",
  ruleMessagePreview: "Preview of the block message",
  ruleMessageFootnote: "The rule still blocks. One message covers every command it blocks.",
  ruleMessageRuleOff: "This rule is off, so the message is not shown.",
  shortenMessage: (characters) => \`Shorten by \${plural(characters, "character", "characters")} to save.\`,
  blockMessageTooLong: (limit) => \`A block message is longer than \${count(limit)} characters.\`,
  ruleMessageAskNote: (strict) => \`Below the \${strict} preset, an agent that can ask for approval shows this rule as a prompt with its own closing line.\`,
  ruleMessageRemove: "Remove message",
  done: "Done",
  editBlockMessage: "Edit its message",
  customizeMessage: "Customize message",
  offCount: (rules) => \`\${count(rules)} off\`,
  commandRuleSummary: (on, off, always) => \`\${count(on)} on · \${count(off)} off · \${count(always)} always on\`,
  commandProtectionOffSummary: "Off. Built-in rules are not enforced; catastrophic and custom rules still apply. Your rule settings are kept.",
  secretRuleSummary: (on, off) => \`\${count(on)} on · \${count(off)} off\`,
  secretProtectionOffSummary: "Off. Sensitive files and deny paths are not blocked. Your rule settings and paths are kept.",
  noCommandProtectionMatch: "No command protections match.",
  noSecretProtectionMatch: "No secret protections match.",
  aboutRule: (rule) => \`About \${rule}\`,
  protectedPaths: "Protected paths",
  protectedPathsFor: (rule) => \`Protected paths for \${rule}\`,
  toggleGroup: (group) => \`Turn all \${group} on or off\`,
  toggleAll: "Turn all on or off",
  secretCategoryBasename: "Sensitive file names",
  secretCategoryPattern: "Sensitive file name patterns",
  secretCategoryHomePath: "Sensitive home folders",
  secretCategoryVariant: "Key file name variants",
  secretCategoryExtension: "Sensitive file extensions",
  secretCategoryExtensionPattern: "Sensitive extension patterns",
  secretCategoryCredential: "Coding agent credentials",
  secretCategoryConfig: "Coding agent settings",
  inheritedChip: "Inherited",
  projectChip: "Project",
  projectChipTitle: "Set by this project. Click to stop setting it.",
  projectChipLabel: (field) => \`Set by project: \${field}. Activate to inherit again.\`,
  commandProtectionOffBanner: "Command protection is off: built-in destructive command rules are not enforced. Catastrophic and custom rules still apply.",
  secretProtectionOffBanner: "Secret protection is off: sensitive files and deny paths are not blocked.",
  fallbackConfigBanner: (reason) => \`A fallback configuration is being enforced: \${reason}\`,
  openProtections: "Open Protections",
  environmentRaises: (variables) => \`An environment variable raises protection beyond these settings: \${variables}\`,
  removePath: (path) => \`Remove \${path}\`,
  notAdded: (paths, error) => \`Not added: \${paths}. \${error}\`,
  alreadyListed: (paths) => \`Already listed: \${paths}\`,
  previewFailed: "Preview failed",
  couldNotTest: (error) => \`Could not test this command: \${error}\`,
  testerAllowed: "<strong>Allowed.</strong> No rule blocks this command.",
  createRuleToBlock: "Create a rule to block it",
  testerBlocked: (rule) => rule ? \`<strong>Blocked</strong> by \${rule}.\` : "<strong>Blocked</strong>.",
  blockedPart: "Blocked part:",
  testerHelp: "Checks a command against the Protections settings, including unsaved changes and custom rules. Nothing is run.",
  test: "Test",
  notCreatedYet: " (not created yet)",
  projectPolicyChanges: "The project policy changes these settings:",
  restoredDraft: "Restored your unsaved changes",
  couldNotLoadPolicy: "Could not load your policy",
  projectPolicyUnavailable: "Project policy unavailable",
  repairFirst: "Repair your policy first",
  repairBeforeProject: "Your own policy file must be repaired before you can edit a project policy.",
  policyNotLoaded: "Your policy has not loaded yet",
  discardUnsavedTitle: "Discard unsaved changes?",
  discardBeforeProject: "A project policy starts from your saved policy. Save your changes first, or discard them here.",
  discardChanges: "Discard changes",
  discardDraftTitle: "Discard this project draft?",
  discardDraft: "Discard draft",
  switchFolderDiscards: "Switching folders discards this draft.",
  folderPickerFailed: "Could not open the folder picker",
  projectChangesUnwritten: "Your project changes have not been written anywhere yet.",
  backToOwnPolicy: "Back to your own policy",
  discardDraftChangesTitle: "Discard changes to this draft?",
  discardDraftChangesBody: "The draft goes back to the settings this project already has.",
  changesDiscarded: "Changes discarded",
  projectDraftReloaded: "Project draft reloaded",
  projectFolderChanged: "The project folder changed",
  projectFolderChangedBody: "The draft was reloaded for the new folder. Review it again before applying.",
  invalidProjectFile: "The existing project policy file is invalid and will be replaced.",
  noEffectiveChange: "No change to the effective policy.",
  diffSetting: "Setting",
  diffNow: "Now",
  diffAfter: "After",
  unset: "(unset)",
  reviewFailed: "Review failed",
  reviewAgain: "Review again",
  draftChangedDuringReview: "The draft changed while the review was loading.",
  applyProjectTitle: "Apply this project policy?",
  applyProjectBody: "Everyone who works in this project gets these settings on top of their own policy.",
  applyProject: "Apply project policy",
  applyingStatus: "Applying…",
  applyFailed: "Apply failed",
  projectApplied: "Project policy applied",
  repairBeforeSaving: "Repair your policy before saving",
  policySaved: "Policy saved",
  discardUnsavedBody: "Every change since your last save will be undone.",
  discardingStatus: "Discarding…",
  repairTitle: "Repair your policy file?",
  repairBody: "Valid settings are kept and invalid ones are dropped. If the JSON cannot be read at all, defaults are restored.",
  repairingStatus: "Repairing…",
  repairFailed: "Repair failed",
  policyRepaired: "Policy repaired",
  nothingToReset: "Nothing to reset: every rule already uses its default",
  resetRulesTitle: "Reset every rule to its default?",
  resetRulesBody: (secret) => \`All \${secret ? "secret" : "command"} rules go back to the setting their preset gives them. You can still discard before saving.\`,
  resetRules: "Reset rules",
  turnOffSecretTitle: "Turn off secret protection?",
  turnOffCommandTitle: "Turn off command protection?",
  turnOffSecretBody: "Sensitive files, coding agent credentials, and deny paths stop being blocked until you turn this back on.",
  turnOffCommandBody: "Built-in destructive git, filesystem, and execution rules stop blocking commands until you turn this back on.",
  catastrophicStillApply: "Catastrophic and custom rules still apply.",
  turnOff: "Turn off",
  rulesIntro: "Your own blocking rules from rulebooks, enforced on top of the built-in protections.",
  refreshRules: "Refresh custom rules",
  problems: "Problems",
  problemsSub: "An error means a rulebook was skipped and none of its rules are enforced.",
  rulebooks: "Rulebooks",
  rulebooksSub: "Read-only. Rules are shown as they are enforced.",
  loadingRules: "Loading rules…",
  createRule: "Create a rule",
  createRuleSub: "Describe the rule and copy a ready-made prompt for your coding agent. CC Safety Net does not write rulebooks itself.",
  appliesTo: "Applies to",
  ruleScope: "Rule scope",
  thisProject: "This project",
  allProjects: "All projects",
  projectFolder: "Project folder",
  chooseFolder: "Choose…",
  projectFolderHint: "Where the rulebook is written. Defaults to the folder this GUI was started from.",
  ruleRequest: "What should be blocked?",
  ruleRequestPlaceholder: "Block terraform destroy in this project",
  ruleRequestHint: "Rules match a command, its subcommands, and exact arguments, not file paths or patterns.",
  tryExamples: "Try:",
  exampleSuggest: "Suggest rules",
  exampleSuggestRequest: "read my package.json and suggest blocking rules",
  exampleBlock: "Block a command",
  exampleBlockRequest: "set up rules to block all terraform destroy commands",
  exampleVerify: "Verify rules",
  exampleVerifyRequest: "verify my rules and fix any errors",
  copyPrompt: "Copy prompt",
  allRulebooksSkipped: "Every rulebook was skipped because of errors, so no custom rule is enforced. See Problems above.",
  noCustomRules: "No custom rules yet. Use <strong>Create a rule</strong> below, or run <code>npx -y cc-safety-net rule init</code>.",
  blocksWhenArgument: "Blocks when any of these arguments is present:",
  customRuleMissing: (rule) => \`\${rule} is not in any rulebook\`,
  couldNotLoadRules: (error) => \`Could not load rules: \${error}\`,
  folderPickerUnavailable: "The folder picker is not available",
  typeFolderInstead: (error) => \`\${error}. Type the project folder instead.\`,
  rulesNotLoaded: "Rules have not loaded yet",
  refreshAndRetry: "Click Refresh and try again.",
  describeRuleFirst: "Describe what should be blocked first",
  enterProjectFolder: "Enter the project folder the rule belongs to",
  promptCopied: "Prompt copied",
  pasteIntoAgent: "Paste it into your coding agent.",
  agentsIntro: "Install or remove the CC Safety Net hook for each coding agent on this machine.",
  refreshAgents: "Refresh agents",
  checkingAgents: "Checking agents…",
  hookInstalled: "Hook installed",
  hookDisabled: "Hook disabled",
  hookStatusUnknown: "Status unknown: its settings file could not be read",
  uninstalling: "Uninstalling…",
  installing: "Installing…",
  uninstall: "Uninstall",
  enable: "Enable",
  install: "Install",
  notDetected: "Not detected",
  installedAgents: "Installed",
  detectedAgents: "Detected on this machine",
  noHookYet: "No agent has the hook yet. Install it for each agent you use; until then its commands are not checked.",
  missingAgents: "Not detected on this machine",
  couldNotCheckAgents: (error) => \`Could not check agents: \${error}\`,
  installFailed: "Install failed",
  uninstallFailed: "Uninstall failed",
  settingsIntro: "Appearance, log retention, file locations, and maintenance.",
  appearance: "Appearance",
  theme: "Theme",
  themeAuto: "Auto",
  themeLight: "Light",
  themeDark: "Dark",
  preferenceHint: "Remembered on this computer.",
  language: "Language",
  preferenceSaveFailed: "Could not save this preference",
  auditLog: "Audit log",
  keepLogsFor: "Keep logs for",
  retentionNote: "Every checked command is logged. Lowering this deletes older entries, and Activity can only look back this far.",
  logFolder: "Log folder",
  copyLogFolder: "Copy the log folder path",
  files: "Files",
  policyFile: "Policy file",
  copyPolicyPath: "Copy the policy file path",
  copyProjectPolicyPath: "Copy the project policy path",
  about: "About",
  platform: "Platform",
  dangerZone: "Danger zone",
  resetPolicy: "Reset policy",
  resetPolicyHelp: "Replace your policy file with the defaults. This cannot be undone.",
  repairInProtectionsFirst: "Repair your policy file in Protections first.",
  leaveProjectDraftFirst: "Apply or leave your project policy draft first.",
  saveProtectionsFirst: "Save or discard your unsaved Protections changes first.",
  retentionRange: (min, max) => \`Enter a whole number of days from \${count(min)} to \${count(max)}.\`,
  retentionUnchanged: "Retention unchanged",
  shortenRetentionTitle: (window2) => \`Keep logs for only \${days(window2)}?\`,
  shortenRetentionBody: (window2) => \`Log entries older than \${days(window2)} are deleted on the next cleanup and cannot be recovered.\`,
  shortenRetention: "Shorten retention",
  retentionSaved: (window2) => \`Logs are now kept for \${days(window2)}\`,
  resetUnavailable: "Reset unavailable",
  resetPolicyTitle: "Reset your policy?",
  resetPolicyBody: "Your policy file is replaced with the defaults. Every customization is lost.",
  resettingStatus: "Resetting…",
  resetFailed: "Reset failed",
  policyReset: "Policy reset to the defaults"
};

// src/gui/frontend/locales/ja.ts
var count2 = (value) => value.toLocaleString("ja");
var days2 = (value) => \`\${count2(value)} 日間\`;
var ja = {
  navSections: "セクション",
  navOverview: "概要",
  navActivity: "アクティビティ",
  navProtections: "保護",
  navCustomRules: "カスタムルール",
  navAgents: "エージェント",
  navSettings: "設定",
  navUnsaved: "未保存",
  documentation: "ドキュメント",
  loading: "読み込み中…",
  dismissMessage: "メッセージを閉じる",
  cancel: "キャンセル",
  close: "閉じる",
  copy: "コピー",
  copied: "コピーしました",
  copyFailed: "コピーできませんでした",
  add: "追加",
  reset: "リセット",
  resetAll: "すべてリセット",
  repair: "修復",
  save: "保存",
  discard: "破棄",
  savingStatus: "保存中…",
  saveFailed: "保存できませんでした",
  reloadPage: "ページを再読み込みしてください。",
  unknownValue: "不明",
  requestFailed: (status) => \`リクエストに失敗しました（ステータス \${status}）。\`,
  switchOn: "オン",
  switchOff: "オフ",
  stateOn: "オン",
  stateOff: "オフ",
  stateDefault: "既定",
  listSeparator: "、",
  settingChange: (name, value) => \`\${name}：\${value}\`,
  dayUnit: () => "日",
  dayCount: days2,
  lastDays: (value) => \`過去 \${days2(value)}\`,
  lastDaysOption: (value) => \`過去 \${days2(value)}\`,
  ruleCount: (value) => \`\${count2(value)} 件のルール\`,
  blockCount: (value) => \`\${count2(value)} 件のブロック\`,
  pathCount: (value) => \`\${count2(value)} 件のパス\`,
  justNow: "たった今",
  today: "今日",
  yesterday: "昨日",
  overviewIntro: "このマシンでの CC Safety Net の動作状況です。",
  needsAttention: "要確認",
  recentBlocks: "最近のブロック",
  allActivity: "すべてのアクティビティ",
  topRules: "ブロックの多いルール",
  statusRepair: "ポリシーファイルの修復が必要です",
  statusCheckingAgents: "エージェントを確認中…",
  statusNoAgent: "まだどのエージェントも保護していません",
  statusPartlyProtected: "一部のみ保護されています",
  statusProtected: "保護されています",
  commandProtectionIsOff: "コマンド保護はオフです",
  secretProtectionIsOff: "シークレット保護はオフです",
  secretProtectionIsOn: "シークレット保護オン",
  presetFact: (preset, customized) => \`\${preset} プリセット\${customized ? "（カスタマイズ済み）" : ""}\`,
  commandRulesOn: (value) => \`コマンドルール \${count2(value)} 件がオン\`,
  hookActiveIn: (agents) => \`\${agents} でフックが有効\`,
  agentCount: (value) => \`\${count2(value)} 個のエージェント\`,
  installHook: "フックをインストール",
  configure: "設定する",
  review: "確認",
  fix: "修正",
  releaseNotes: "リリースノート",
  hookDisabledAttention: (agent) => \`\${agent} を検出しましたが、フックが無効です。\`,
  suspectAttention: (blocks, window2) => \`過去 \${days2(window2)}のブロックのうち \${count2(blocks)} 件は誤検知の可能性があります。\`,
  guardErrorAttention: (errors, window2) => \`過去 \${days2(window2)}にガードエラーが \${count2(errors)} 件ありました。ポリシーではなく、評価の失敗によってブロックされたコマンドです。\`,
  updateAttention: (version) => \`バージョン \${version} が利用可能です。\`,
  tileBlocked: "ブロック",
  tileChecked: "チェックしたコマンド",
  perDayChart: (noun, values) => \`1 日ごとの\${noun}（古い順）：\${values}\`,
  nothingBlocked: (window2) => \`過去 \${days2(window2)}にブロックされたものはありません。\`,
  noCommandRecorded: "（コマンドの記録なし）",
  guardError: "ガードエラー",
  noRuleBlocked: "まだどのルールもブロックしていません。",
  couldNotLoadActivity: (error) => \`アクティビティを読み込めませんでした：\${error}\`,
  starEvidence: (blocked, window2) => \`CC Safety Net は過去 \${days2(window2)}に、このマシンで危険なコマンドを <strong>\${count2(blocked)}</strong> 件ブロックしました。\`,
  starIfSaved: "これで作業が守られたなら、GitHub でスターをお願いします。",
  starIfUseful: "CC Safety Net が役に立ったら、GitHub でスターをお願いします。",
  starOnGitHub: "GitHub でスター",
  starButtonLabel: "GitHub で CC Safety Net にスターを付ける",
  starLinkLabel: "GitHub で CC Safety Net にスターを付ける（github.com を開きます）",
  starred: "スターを付けました。ありがとうございます。",
  starredLabel: "GitHub で CC Safety Net にスター済み",
  activityIntro: "エージェントが実行したコマンドを新しい順に表示します。コマンド内のシークレットは、ログに記録する時点でマスクします。",
  refreshActivity: "アクティビティを更新",
  decisionFilter: "判定",
  searchActivity: "アクティビティを検索",
  searchActivityPlaceholder: "コマンドまたはルール ID で検索",
  agentFilter: "エージェント",
  timeWindow: "期間",
  loadingActivity: "アクティビティを読み込み中…",
  decisionBlocked: "ブロック",
  decisionAllowed: "許可",
  decisionError: "エラー",
  filterErrors: "エラー",
  filterSuspect: "誤検知の可能性",
  filterAll: "すべて",
  allAgents: "すべてのエージェント",
  showingBlocksOf: "次のコマンドのブロックを表示中：",
  showAllBlocks: "すべてのブロックを表示",
  noFilterMatch: "この絞り込み条件に一致する項目はありません。",
  showAllActivity: "すべてのアクティビティを表示",
  noLogEntries: "一致する監査ログのエントリはありません。",
  showingEntries: (shown, total, window2) => \`過去 \${days2(window2)}の \${count2(total)} 件中 \${count2(shown)} 件を表示しています。\`,
  activityTruncated: "判定ごとに新しいほうから 500 件だけを表示します。それより古いエントリも合計には含まれます。",
  unreadableLogs: (files) => \`\${count2(files)} 件のログファイルを読み込めなかったため、この一覧は不完全です。\`,
  detailFullCommand: "コマンド全体",
  detailReason: "理由",
  detailRule: "ルール",
  detailFolder: "フォルダー",
  detailTime: "日時",
  showCustomRule: "このカスタムルールを表示",
  showProtection: "この保護を表示",
  reportFalsePositive: "誤検知を報告",
  blockInFuture: "今後はブロックする",
  copyLogEntry: "ログエントリをコピー",
  notAvailable: "利用できません",
  reportTooLong: "報告が長すぎて事前入力できません",
  reportFieldCopied: (fields) => \`\${fields}をクリップボードにコピーしました。GitHub のフォームに貼り付けてください。\`,
  reportFieldLeftOut: (fields) => \`\${fields}は含めていません。アクティビティからログエントリをコピーし、GitHub のフォームに貼り付けてください。\`,
  reportFieldJoiner: "と",
  reportNameTitle: "タイトル",
  reportNameExpected: "説明",
  reportNameCommand: "コマンド",
  reportNameEntry: "ログエントリ",
  reportDialogTitle: "誤検知を報告",
  reportDialogBody: "入力済みの公開 GitHub Issue フォームを開きます。そこで送信するまで何も送信されません。パスは <code>&lt;project&gt;</code> と <code>~</code> に置き換えてあります。それ以外に公開したくない内容があれば編集してください。",
  reportWhy: "許可されるべきだった理由（任意）",
  reportWhyPlaceholder: "エージェントは何をしようとしていて、なぜその場面ではこのコマンドが安全なのですか？",
  reportTitleField: "タイトル",
  reportCommandField: "ブロックされたコマンド",
  reportEntryField: "監査ログのエントリ",
  openGitHubForm: "GitHub のフォームを開く",
  policyIntro: "CC Safety Net がブロックする対象を選びます。変更は保存後に反映されます。",
  policyScope: "編集中のポリシー",
  myPolicy: "自分のポリシー",
  projectPolicy: "プロジェクトポリシー",
  testCommand: "コマンドをテスト",
  editingProjectPolicy: "プロジェクトポリシーを編集中",
  projectBarHelp: '<span class="project-chip">プロジェクト</span> タグの付いた設定だけが書き込まれます。それ以外の設定は引き続き各自のポリシーに従います。プロジェクトタグをクリックすると、その項目の設定を解除します。',
  changeFolder: "フォルダーを変更…",
  repairHelp: "修復すると、有効な設定をすべて残してファイルを書き直します。JSON をまったく読み取れない場合は既定値に戻します。",
  safetyPreset: "安全プリセット",
  safetyPresetSub: "各プリセットは、1 つ前のプリセットの内容をすべて含みます。",
  advancedSettings: "詳細設定",
  advancedSettingsSub: "個別のチェックとリンクされたワークツリー",
  searchProtections: "保護を検索",
  searchProtectionsPlaceholder: "/ キーで名前・パス・ルール ID を検索",
  protectionsShown: "表示する保護",
  showChanged: "既定から変更",
  commandProtection: "コマンド保護",
  secretProtection: "シークレット保護",
  pathsTitle: "例外と追加のパス",
  pathsSub: "パスは絶対パスか <code>~/</code> で始まるパスで指定します。複数行を貼り付けるとまとめて追加できます。ホームディレクトリ全体を含むパスは受け付けません。",
  allowPathsLabel: "再帰削除を許可する場所",
  allowPathsHelp: "これらのパス内での再帰削除はブロックしません。<code>/tmp</code> 以下の作業用フォルダーなどに使います。",
  allowPathsPlaceholder: "/absolute/path または ~/path",
  denyPathsLabel: "常にアクセスをブロックする場所",
  denyPathsHelp: "シークレット保護がオンの間は、これらのパスとその配下をすべてブロックします。",
  denyPathsPlaceholder: "path/to/protect",
  secretAllowPathsLabel: "シークレットパターンの対象外とするパス",
  secretAllowPathsHelp: "ファイル、フォルダー、または <code>~/code/**/.env.local</code> のようなフォルダー配下のファイル名を指定します。拒否パスとコーディングエージェントの資格情報は引き続き保護されます。",
  policyJson: "ポリシー JSON",
  rawReadOnly: "読み取り専用。上の設定を反映しています。",
  rawOnDisk: "ディスク上のファイルそのままです。",
  rawProjectFields: (path) => \`このプロジェクトが設定する項目だけです。\${path} に書き込みます。\`,
  unsavedChanges: "未保存の変更",
  unsavedChangeCount: (changes) => \`\${count2(changes)} 件の未保存の変更\`,
  changeSeparator: "／",
  moreChanges: (changes) => \`／ほか \${count2(changes)} 件\`,
  reviewAndApply: "確認して適用",
  presetStandard: "Standard",
  presetStandardDescription: "認識できる破壊的コマンドと機密ファイルの読み取りをブロックします。通常の開発におすすめです。",
  presetStrict: "Strict",
  presetStrictDescription: "完全には解析できないコマンド、機密パスの一覧表示、リモートホストへの curl や wget のアップロードもブロックします。高度なシェル操作でときどき誤検知があります。",
  presetParanoid: "Paranoid",
  presetParanoidDescription: "プロジェクト内の rm -rf とインタープリターの 1 行コードもブロックします。誤検知が増えるため、信頼できないエージェントや重要なリポジトリに使ってください。",
  capabilityFailClosed: "フェイルクローズ",
  capabilityFailClosedDescription: "パーサーが完全に理解できないコマンドと、リモートホストへの curl や wget のアップロードをブロックします。",
  capabilityParanoidRm: "rm -rf の Paranoid チェック",
  capabilityParanoidRmDescription: "一時パスを除き、プロジェクト内の rm -rf をブロックします。",
  capabilityParanoidInterpreters: "インタープリターの Paranoid チェック",
  capabilityParanoidInterpretersDescription: "python -c などのインタープリターの 1 行コードをブロックします。",
  presetLabel: "安全プリセット",
  presetCustomized: (preset) => \`\${preset}（カスタマイズ済み）\`,
  fromPresetOption: (enabled) => \`プリセットに従う（\${enabled ? "オン" : "オフ"}）\`,
  fromPreset: "プリセットに従う",
  forcedOn: "常にオン",
  forcedOff: "常にオフ",
  alwaysOn: "常にオン",
  alwaysOff: "常にオフ",
  cannotTurnOff: "オフにできません",
  worktreeDiscard: "リンクされた Git ワークツリーでのローカル変更の破棄を許可",
  worktreeDiscardHelp: "リンクされたワークツリー内の破棄チェックだけを緩和します。",
  worktreeChange: "リンクされたワークツリーでの変更の破棄",
  allowed: "許可",
  blocked: "ブロック",
  allowPathsChange: "削除を許可するパス",
  denyPathsChange: "常にブロックするパス",
  secretAllowPathsChange: "シークレットパターンの対象外",
  pathsAdded: (paths) => \`\${count2(paths)} 件追加\`,
  pathsRemoved: (paths) => \`\${count2(paths)} 件削除\`,
  changedByYou: "自分で変更",
  forcedInAdvanced: (capability, enabled) => \`詳細設定で「\${capability}」を常に\${enabled ? "オン" : "オフ"}\`,
  setByEnvironment: "環境変数で設定",
  setByEnvironmentVariable: (variable) => \`環境変数で設定：\${variable}\`,
  needsPreset: (preset) => \`\${preset} プリセットが必要\`,
  offByDefault: "既定でオフ",
  customMessageNote: "カスタムメッセージ",
  customMessageCount: (messages) => \`カスタムメッセージ \${count2(messages)} 件\`,
  customMessageChange: "カスタムメッセージ",
  builtInMessageChange: "組み込みメッセージ",
  blockMessage: "ブロックメッセージ",
  blockMessageFor: (rule) => \`\${rule} のブロックメッセージ\`,
  agentIsTold: "エージェントへの説明",
  ruleMessageLabel: "エージェントに伝える内容",
  ruleMessageBuiltIn: (reason) => \`組み込み: \${reason}\`,
  ruleMessageUseBuiltIn: "これを元に編集",
  ruleMessageBuiltInVaries: "（ブロックされたコマンドに応じた組み込みの理由）",
  ruleMessageIntentLabel: "エージェントが次に行うこと",
  ruleMessageIntentHelp: "メッセージの最後の一文を決めます。",
  ruleMessageIntentBuiltIn: (intent) => \`組み込み: \${intent}\`,
  intentHardStop: "中止して自分に報告する",
  intentUseAlternative: "メッセージ内の代替手段を使う",
  intentScopeDown: "対象を絞って再試行する",
  intentManualOnly: "自分に手動での実行を依頼する",
  intentStopAndExplain: "コマンドを簡素化するか、自分に報告する",
  ruleMessagePreview: "ブロックメッセージのプレビュー",
  ruleMessageFootnote: "ルールは引き続きブロックします。このメッセージは、このルールがブロックするすべてのコマンドに使われます。",
  ruleMessageRuleOff: "このルールはオフのため、メッセージは表示されません。",
  shortenMessage: (characters) => \`保存するには \${count2(characters)} 文字短くしてください。\`,
  blockMessageTooLong: (limit) => \`ブロックメッセージが \${count2(limit)} 文字を超えています。\`,
  ruleMessageAskNote: (strict) => \`\${strict} プリセット未満では、承認を求められるエージェントはこのルールを確認プロンプトとして表示し、最後の一文は固定になります。\`,
  ruleMessageRemove: "メッセージを削除",
  done: "完了",
  editBlockMessage: "メッセージを編集",
  customizeMessage: "メッセージをカスタマイズ",
  offCount: (rules) => \`\${count2(rules)} 件オフ\`,
  commandRuleSummary: (on, off, always) => \`オン \${count2(on)} 件 · オフ \${count2(off)} 件 · 常にオン \${count2(always)} 件\`,
  commandProtectionOffSummary: "オフ。組み込みルールは適用されません。致命的な操作に対するルールとカスタムルールは引き続き適用されます。ルールの設定は保持されます。",
  secretRuleSummary: (on, off) => \`オン \${count2(on)} 件 · オフ \${count2(off)} 件\`,
  secretProtectionOffSummary: "オフ。機密ファイルと拒否パスはブロックされません。ルールの設定とパスは保持されます。",
  noCommandProtectionMatch: "一致するコマンド保護はありません。",
  noSecretProtectionMatch: "一致するシークレット保護はありません。",
  aboutRule: (rule) => \`\${rule} について\`,
  protectedPaths: "保護されるパス",
  protectedPathsFor: (rule) => \`\${rule} で保護されるパス\`,
  toggleGroup: (group) => \`\${group}をすべてオンまたはオフにする\`,
  toggleAll: "すべてオンまたはオフにする",
  secretCategoryBasename: "機密ファイル名",
  secretCategoryPattern: "機密ファイル名のパターン",
  secretCategoryHomePath: "ホーム内の機密フォルダー",
  secretCategoryVariant: "鍵ファイル名のバリエーション",
  secretCategoryExtension: "機密ファイルの拡張子",
  secretCategoryExtensionPattern: "機密ファイルの拡張子パターン",
  secretCategoryCredential: "コーディングエージェントの資格情報",
  secretCategoryConfig: "コーディングエージェントの設定",
  inheritedChip: "継承",
  projectChip: "プロジェクト",
  projectChipTitle: "このプロジェクトで設定中。クリックすると設定を解除します。",
  projectChipLabel: (field) => \`プロジェクトで設定中：\${field}。選択すると継承に戻ります。\`,
  commandProtectionOffBanner: "コマンド保護はオフです。組み込みの破壊的コマンドのルールは適用されません。致命的な操作に対するルールとカスタムルールは引き続き適用されます。",
  secretProtectionOffBanner: "シークレット保護はオフです。機密ファイルと拒否パスはブロックされません。",
  fallbackConfigBanner: (reason) => \`フォールバックの設定を適用しています：\${reason}\`,
  openProtections: "保護を開く",
  environmentRaises: (variables) => \`環境変数により、これらの設定以上に保護が強化されています：\${variables}\`,
  removePath: (path) => \`\${path} を削除\`,
  notAdded: (paths, error) => \`追加しませんでした：\${paths}。\${error}\`,
  alreadyListed: (paths) => \`すでに登録済み：\${paths}\`,
  previewFailed: "プレビューできませんでした",
  couldNotTest: (error) => \`このコマンドをテストできませんでした：\${error}\`,
  testerAllowed: "<strong>許可。</strong>このコマンドをブロックするルールはありません。",
  createRuleToBlock: "ブロックするルールを作成",
  testerBlocked: (rule) => rule ? \`<strong>ブロック</strong>（\${rule}）。\` : "<strong>ブロック</strong>。",
  blockedPart: "ブロックされた部分：",
  testerHelp: "未保存の変更とカスタムルールを含め、保護の設定に照らしてコマンドをチェックします。何も実行しません。",
  test: "テスト",
  notCreatedYet: "（未作成）",
  projectPolicyChanges: "プロジェクトポリシーにより、次の設定が変わります：",
  restoredDraft: "未保存の変更を復元しました",
  couldNotLoadPolicy: "ポリシーを読み込めませんでした",
  projectPolicyUnavailable: "プロジェクトポリシーを利用できません",
  repairFirst: "先にポリシーを修復してください",
  repairBeforeProject: "プロジェクトポリシーを編集する前に、自分のポリシーファイルを修復する必要があります。",
  policyNotLoaded: "ポリシーがまだ読み込まれていません",
  discardUnsavedTitle: "未保存の変更を破棄しますか？",
  discardBeforeProject: "プロジェクトポリシーは保存済みのポリシーから始まります。先に変更を保存するか、ここで破棄してください。",
  discardChanges: "変更を破棄",
  discardDraftTitle: "このプロジェクトの下書きを破棄しますか？",
  discardDraft: "下書きを破棄",
  switchFolderDiscards: "フォルダーを切り替えると、この下書きは破棄されます。",
  folderPickerFailed: "フォルダー選択を開けませんでした",
  projectChangesUnwritten: "プロジェクトの変更はまだどこにも書き込まれていません。",
  backToOwnPolicy: "自分のポリシーに戻りました",
  discardDraftChangesTitle: "この下書きへの変更を破棄しますか？",
  discardDraftChangesBody: "下書きを、このプロジェクトの現在の設定に戻します。",
  changesDiscarded: "変更を破棄しました",
  projectDraftReloaded: "プロジェクトの下書きを再読み込みしました",
  projectFolderChanged: "プロジェクトフォルダーが変わりました",
  projectFolderChangedBody: "新しいフォルダー用に下書きを再読み込みしました。適用する前にもう一度確認してください。",
  invalidProjectFile: "既存のプロジェクトポリシーファイルは無効なため、置き換えられます。",
  noEffectiveChange: "実効ポリシーに変更はありません。",
  diffSetting: "設定",
  diffNow: "現在",
  diffAfter: "適用後",
  unset: "（未設定）",
  reviewFailed: "確認できませんでした",
  reviewAgain: "もう一度確認してください",
  draftChangedDuringReview: "確認内容の読み込み中に下書きが変更されました。",
  applyProjectTitle: "このプロジェクトポリシーを適用しますか？",
  applyProjectBody: "このプロジェクトで作業する全員に、各自のポリシーに加えてこれらの設定が適用されます。",
  applyProject: "プロジェクトポリシーを適用",
  applyingStatus: "適用中…",
  applyFailed: "適用できませんでした",
  projectApplied: "プロジェクトポリシーを適用しました",
  repairBeforeSaving: "保存する前にポリシーを修復してください",
  policySaved: "ポリシーを保存しました",
  discardUnsavedBody: "最後に保存してからの変更はすべて元に戻ります。",
  discardingStatus: "破棄中…",
  repairTitle: "ポリシーファイルを修復しますか？",
  repairBody: "有効な設定は残し、無効な設定は取り除きます。JSON をまったく読み取れない場合は既定値に戻します。",
  repairingStatus: "修復中…",
  repairFailed: "修復できませんでした",
  policyRepaired: "ポリシーを修復しました",
  nothingToReset: "リセットするものはありません。すべてのルールが既定のままです",
  resetRulesTitle: "すべてのルールを既定に戻しますか？",
  resetRulesBody: (secret) => \`すべての\${secret ? "シークレット" : "コマンド"}ルールがプリセットの設定に戻ります。保存する前なら破棄できます。\`,
  resetRules: "ルールをリセット",
  turnOffSecretTitle: "シークレット保護をオフにしますか？",
  turnOffCommandTitle: "コマンド保護をオフにしますか？",
  turnOffSecretBody: "オンに戻すまで、機密ファイル、コーディングエージェントの資格情報、拒否パスはブロックされなくなります。",
  turnOffCommandBody: "オンに戻すまで、git、ファイルシステム、実行に関する組み込みの破壊的コマンドのルールはコマンドをブロックしなくなります。",
  catastrophicStillApply: "致命的な操作に対するルールとカスタムルールは引き続き適用されます。",
  turnOff: "オフにする",
  rulesIntro: "ルールブックで定義した独自のブロックルールです。組み込みの保護に加えて適用されます。",
  refreshRules: "カスタムルールを更新",
  problems: "問題",
  problemsSub: "エラーのあるルールブックはスキップされ、そのルールは 1 つも適用されません。",
  rulebooks: "ルールブック一覧",
  rulebooksSub: "読み取り専用です。実際に適用される状態でルールを表示します。",
  loadingRules: "ルールを読み込み中…",
  createRule: "ルールを作成",
  createRuleSub: "ルールを説明すると、コーディングエージェント向けのプロンプトをコピーできます。CC Safety Net 自体はルールブックを書きません。",
  appliesTo: "適用範囲",
  ruleScope: "ルールの範囲",
  thisProject: "このプロジェクト",
  allProjects: "すべてのプロジェクト",
  projectFolder: "プロジェクトフォルダー",
  chooseFolder: "選択…",
  projectFolderHint: "ルールブックの書き込み先です。既定ではこの GUI を起動したフォルダーです。",
  ruleRequest: "何をブロックしますか？",
  ruleRequestPlaceholder: "このプロジェクトで terraform destroy をブロック",
  ruleRequestHint: "ルールが照合するのは、コマンド、そのサブコマンド、完全一致の引数です。ファイルパスやパターンは照合しません。",
  tryExamples: "例：",
  exampleSuggest: "ルールを提案",
  exampleSuggestRequest: "package.json を読んで、ブロックすべきルールを提案して",
  exampleBlock: "コマンドをブロック",
  exampleBlockRequest: "terraform destroy コマンドをすべてブロックするルールを設定して",
  exampleVerify: "ルールを検証",
  exampleVerifyRequest: "ルールを検証して、エラーがあれば修正して",
  copyPrompt: "プロンプトをコピー",
  allRulebooksSkipped: "すべてのルールブックがエラーでスキップされたため、カスタムルールは適用されていません。上の「問題」を確認してください。",
  noCustomRules: "カスタムルールはまだありません。下の<strong>ルールを作成</strong>を使うか、<code>npx -y cc-safety-net rule init</code> を実行してください。",
  blocksWhenArgument: "次の引数のいずれかがあるとブロックします：",
  customRuleMissing: (rule) => \`\${rule} はどのルールブックにもありません\`,
  couldNotLoadRules: (error) => \`ルールを読み込めませんでした：\${error}\`,
  folderPickerUnavailable: "フォルダー選択を利用できません",
  typeFolderInstead: (error) => \`\${error}。代わりにプロジェクトフォルダーを入力してください。\`,
  rulesNotLoaded: "ルールがまだ読み込まれていません",
  refreshAndRetry: "更新してからもう一度お試しください。",
  describeRuleFirst: "先にブロックする内容を説明してください",
  enterProjectFolder: "ルールを置くプロジェクトフォルダーを入力してください",
  promptCopied: "プロンプトをコピーしました",
  pasteIntoAgent: "コーディングエージェントに貼り付けてください。",
  agentsIntro: "このマシンの各コーディングエージェントに、CC Safety Net のフックをインストールまたは削除します。",
  refreshAgents: "エージェントを更新",
  checkingAgents: "エージェントを確認中…",
  hookInstalled: "フックをインストール済み",
  hookDisabled: "フック無効",
  hookStatusUnknown: "状態不明。設定ファイルを読み取れませんでした",
  uninstalling: "アンインストール中…",
  installing: "インストール中…",
  uninstall: "アンインストール",
  enable: "有効にする",
  install: "インストール",
  notDetected: "未検出",
  installedAgents: "インストール済み",
  detectedAgents: "このマシンで検出",
  noHookYet: "まだどのエージェントにもフックがありません。使うエージェントごとにインストールしてください。インストールするまで、そのエージェントのコマンドはチェックされません。",
  missingAgents: "このマシンで未検出",
  couldNotCheckAgents: (error) => \`エージェントを確認できませんでした：\${error}\`,
  installFailed: "インストールできませんでした",
  uninstallFailed: "アンインストールできませんでした",
  settingsIntro: "外観、ログの保持期間、ファイルの場所、メンテナンス。",
  appearance: "外観",
  theme: "テーマ",
  themeAuto: "自動",
  themeLight: "ライト",
  themeDark: "ダーク",
  preferenceHint: "このコンピューターに保存されます。",
  language: "言語",
  preferenceSaveFailed: "この設定を保存できませんでした",
  auditLog: "監査ログ",
  keepLogsFor: "ログの保持期間",
  retentionNote: "チェックしたコマンドはすべて記録されます。短くすると古いエントリが削除され、アクティビティもこの期間までしか遡れません。",
  logFolder: "ログフォルダー",
  copyLogFolder: "ログフォルダーのパスをコピー",
  files: "ファイル",
  policyFile: "ポリシーファイル",
  copyPolicyPath: "ポリシーファイルのパスをコピー",
  copyProjectPolicyPath: "プロジェクトポリシーのパスをコピー",
  about: "このアプリについて",
  platform: "プラットフォーム",
  dangerZone: "危険な操作",
  resetPolicy: "ポリシーをリセット",
  resetPolicyHelp: "ポリシーファイルを既定値に置き換えます。元に戻せません。",
  repairInProtectionsFirst: "先に「保護」でポリシーファイルを修復してください。",
  leaveProjectDraftFirst: "先にプロジェクトポリシーの下書きを適用するか、終了してください。",
  saveProtectionsFirst: "先に「保護」の未保存の変更を保存するか、破棄してください。",
  retentionRange: (min, max) => \`\${count2(min)}〜\${count2(max)} の整数で日数を入力してください。\`,
  retentionUnchanged: "保持期間は変更されていません",
  shortenRetentionTitle: (window2) => \`ログの保持期間を \${days2(window2)}に短縮しますか？\`,
  shortenRetentionBody: (window2) => \`\${days2(window2)}より古いログエントリは次回のクリーンアップで削除され、復元できません。\`,
  shortenRetention: "保持期間を短縮",
  retentionSaved: (window2) => \`ログの保持期間を \${days2(window2)}にしました\`,
  resetUnavailable: "リセットできません",
  resetPolicyTitle: "ポリシーをリセットしますか？",
  resetPolicyBody: "ポリシーファイルが既定値に置き換わり、カスタマイズはすべて失われます。",
  resettingStatus: "リセット中…",
  resetFailed: "リセットできませんでした",
  policyReset: "ポリシーを既定値にリセットしました"
};

// src/gui/frontend/locales/zh-CN.ts
var count3 = (value) => value.toLocaleString("zh-CN");
var days3 = (value) => \`\${count3(value)} 天\`;
var zhCN = {
  navSections: "视图",
  navOverview: "概览",
  navActivity: "活动",
  navProtections: "保护",
  navCustomRules: "自定义规则",
  navAgents: "智能体",
  navSettings: "设置",
  navUnsaved: "未保存",
  documentation: "文档",
  loading: "加载中…",
  dismissMessage: "关闭消息",
  cancel: "取消",
  close: "关闭",
  copy: "复制",
  copied: "已复制",
  copyFailed: "复制失败",
  add: "添加",
  reset: "重置",
  resetAll: "全部重置",
  repair: "修复",
  save: "保存",
  discard: "丢弃",
  savingStatus: "保存中…",
  saveFailed: "保存失败",
  reloadPage: "请重新加载页面。",
  unknownValue: "未知",
  requestFailed: (status) => \`请求失败（状态码 \${status}）。\`,
  switchOn: "开",
  switchOff: "关",
  stateOn: "开启",
  stateOff: "关闭",
  stateDefault: "默认",
  listSeparator: "、",
  settingChange: (name, value) => \`\${name}：\${value}\`,
  dayUnit: () => "天",
  dayCount: days3,
  lastDays: (value) => \`最近 \${days3(value)}\`,
  lastDaysOption: (value) => \`最近 \${days3(value)}\`,
  ruleCount: (value) => \`\${count3(value)} 条规则\`,
  blockCount: (value) => \`\${count3(value)} 次阻止\`,
  pathCount: (value) => \`\${count3(value)} 个路径\`,
  justNow: "刚刚",
  today: "今天",
  yesterday: "昨天",
  overviewIntro: "CC Safety Net 在本机上的运行情况。",
  needsAttention: "需要处理",
  recentBlocks: "最近阻止",
  allActivity: "全部活动",
  topRules: "触发最多的规则",
  statusRepair: "策略文件需要修复",
  statusCheckingAgents: "正在检查智能体…",
  statusNoAgent: "尚未保护任何智能体",
  statusPartlyProtected: "部分受保护",
  statusProtected: "已受保护",
  commandProtectionIsOff: "命令保护已关闭",
  secretProtectionIsOff: "机密保护已关闭",
  secretProtectionIsOn: "机密保护已开启",
  presetFact: (preset, customized) => \`\${preset} 预设\${customized ? "（已自定义）" : ""}\`,
  commandRulesOn: (value) => \`已开启 \${count3(value)} 条命令规则\`,
  hookActiveIn: (agents) => \`已在 \${agents} 中启用 hook\`,
  agentCount: (value) => \`\${count3(value)} 个智能体\`,
  installHook: "安装 hook",
  configure: "配置",
  review: "查看",
  fix: "修复",
  releaseNotes: "发布说明",
  hookDisabledAttention: (agent) => \`已检测到 \${agent}，但其 hook 已禁用。\`,
  suspectAttention: (blocks, window2) => \`最近 \${days3(window2)}内有 \${count3(blocks)} 次阻止疑似误报。\`,
  guardErrorAttention: (errors, window2) => \`最近 \${days3(window2)}内有 \${count3(errors)} 个防护错误。这些命令因评估失败被阻止，不是被策略阻止。\`,
  updateAttention: (version) => \`\${version} 版本已发布。\`,
  tileBlocked: "已阻止",
  tileChecked: "已检查命令",
  perDayChart: (noun, values) => \`\${noun}（每日，从旧到新）：\${values}\`,
  nothingBlocked: (window2) => \`最近 \${days3(window2)}内没有阻止记录。\`,
  noCommandRecorded: "（未记录命令）",
  guardError: "防护错误",
  noRuleBlocked: "还没有规则触发过阻止。",
  couldNotLoadActivity: (error) => \`无法加载活动：\${error}\`,
  starEvidence: (blocked, window2) => \`最近 \${days3(window2)}内，CC Safety Net 在本机上阻止了 <strong>\${count3(blocked)}</strong> 条危险命令。\`,
  starIfSaved: "如果这帮你保住了工作，欢迎在 GitHub 上为项目加星。",
  starIfUseful: "如果 CC Safety Net 对你有用，欢迎在 GitHub 上加星。",
  starOnGitHub: "在 GitHub 上加星",
  starButtonLabel: "在 GitHub 上为 CC Safety Net 加星",
  starLinkLabel: "在 GitHub 上为 CC Safety Net 加星（打开 github.com）",
  starred: "已加星，谢谢。",
  starredLabel: "已在 GitHub 上为 CC Safety Net 加星",
  activityIntro: "智能体运行过的命令，最新的在前。命令写入日志前会做机密脱敏。",
  refreshActivity: "刷新活动",
  decisionFilter: "判定",
  searchActivity: "搜索活动",
  searchActivityPlaceholder: "搜索命令或规则 ID",
  agentFilter: "智能体",
  timeWindow: "时间窗口",
  loadingActivity: "正在加载活动…",
  decisionBlocked: "已阻止",
  decisionAllowed: "已允许",
  decisionError: "错误",
  filterErrors: "错误",
  filterSuspect: "疑似误报",
  filterAll: "全部",
  allAgents: "全部智能体",
  showingBlocksOf: "只显示此命令的阻止记录：",
  showAllBlocks: "显示全部阻止记录",
  noFilterMatch: "没有符合过滤条件的记录。",
  showAllActivity: "显示全部活动",
  noLogEntries: "没有匹配的审计日志条目。",
  showingEntries: (shown, total, window2) => \`显示最近 \${days3(window2)}内 \${count3(total)} 个条目中的 \${count3(shown)} 个。\`,
  activityTruncated: "每种判定只列出最新的 500 个条目。更早的条目仍计入总数。",
  unreadableLogs: (files) => \`有 \${count3(files)} 个日志文件无法读取，此列表不完整。\`,
  detailFullCommand: "完整命令",
  detailReason: "原因",
  detailRule: "规则",
  detailFolder: "目录",
  detailTime: "时间",
  showCustomRule: "查看此自定义规则",
  showProtection: "查看此项保护",
  reportFalsePositive: "报告误报",
  blockInFuture: "以后阻止此命令",
  copyLogEntry: "复制日志条目",
  notAvailable: "不可用",
  reportTooLong: "报告过长，无法预填",
  reportFieldCopied: (fields) => \`\${fields}已复制到剪贴板。请粘贴到 GitHub 上的表单中。\`,
  reportFieldLeftOut: (fields) => \`\${fields}已省略。请在活动视图中复制日志条目，粘贴到 GitHub 上的表单中。\`,
  reportFieldJoiner: "和",
  reportNameTitle: "标题",
  reportNameExpected: "说明",
  reportNameCommand: "命令",
  reportNameEntry: "日志条目",
  reportDialogTitle: "报告误报",
  reportDialogBody: "这会打开一个预填好的公开 GitHub issue 表单。在那里提交之前，不会发送任何内容。路径已替换为 <code>&lt;project&gt;</code> 和 <code>~</code>。其他不想公开的内容请自行修改。",
  reportWhy: "为什么应该允许？（可选）",
  reportWhyPlaceholder: "智能体当时想做什么？为什么这条命令在那里是安全的？",
  reportTitleField: "标题",
  reportCommandField: "被阻止的命令",
  reportEntryField: "审计日志条目",
  openGitHubForm: "打开 GitHub 表单",
  policyIntro: "选择 CC Safety Net 要阻止的内容。保存后生效。",
  policyScope: "正在编辑的策略",
  myPolicy: "我的策略",
  projectPolicy: "项目策略",
  testCommand: "测试命令",
  editingProjectPolicy: "正在编辑项目策略",
  projectBarHelp: '只写入标记为 <span class="project-chip">项目</span> 的设置。其余设置仍遵循每个人自己的策略。点击“项目”标记可取消设置该字段。',
  changeFolder: "更改目录…",
  repairHelp: "修复会保留所有有效设置并重写文件。如果 JSON 完全无法读取，则恢复默认值。",
  safetyPreset: "安全预设",
  safetyPresetSub: "每个预设都包含前一个预设的全部内容。",
  advancedSettings: "高级设置",
  advancedSettingsSub: "单项检查和 linked worktree",
  searchProtections: "搜索保护",
  searchProtectionsPlaceholder: "按 / 搜索名称、路径或规则 ID",
  protectionsShown: "要显示的保护",
  showChanged: "与默认值不同",
  commandProtection: "命令保护",
  secretProtection: "机密保护",
  pathsTitle: "例外和额外路径",
  pathsSub: "路径可以是绝对路径，也可以以 <code>~/</code> 开头。粘贴多行可一次添加多个。覆盖主目录的路径会被拒绝。",
  allowPathsLabel: "允许递归删除的路径",
  allowPathsHelp: "这些路径内的递归删除不会被阻止，例如 <code>/tmp</code> 下的临时目录。",
  allowPathsPlaceholder: "/absolute/path 或 ~/path",
  denyPathsLabel: "始终阻止访问的路径",
  denyPathsHelp: "机密保护开启时，这些路径及其下的所有内容都会被阻止。",
  denyPathsPlaceholder: "path/to/protect",
  secretAllowPathsLabel: "不受机密模式约束的路径",
  secretAllowPathsHelp: "文件、目录，或某个目录下的单个文件名，例如 <code>~/code/**/.env.local</code>。拒绝路径和编码智能体凭证的保护仍然生效。",
  policyJson: "策略 JSON",
  rawReadOnly: "只读，与上方设置保持一致。",
  rawOnDisk: "磁盘上的原始文件内容。",
  rawProjectFields: (path) => \`只包含此项目设置的字段，写入 \${path}。\`,
  unsavedChanges: "未保存的更改",
  unsavedChangeCount: (changes) => \`\${count3(changes)} 项未保存的更改\`,
  changeSeparator: "；",
  moreChanges: (changes) => \`；另有 \${count3(changes)} 项\`,
  reviewAndApply: "复核并应用",
  presetStandard: "Standard",
  presetStandardDescription: "阻止可识别的破坏性命令和对敏感文件的读取。推荐日常开发使用。",
  presetStrict: "Strict",
  presetStrictDescription: "还会阻止无法完全解析的命令、列出敏感路径的操作，以及向远程主机的 curl 或 wget 上传。复杂的 shell 写法偶尔会误报。",
  presetParanoid: "Paranoid",
  presetParanoidDescription: "还会阻止项目内的 rm -rf 和解释器单行命令。误报会更多，适合不受信任的智能体或高风险仓库。",
  capabilityFailClosed: "Fail closed",
  capabilityFailClosedDescription: "阻止解析器无法完全理解的命令，以及向远程主机的 curl 或 wget 上传。",
  capabilityParanoidRm: "Paranoid rm -rf 检查",
  capabilityParanoidRmDescription: "阻止项目内的 rm -rf，临时路径除外。",
  capabilityParanoidInterpreters: "Paranoid 解释器检查",
  capabilityParanoidInterpretersDescription: "阻止 python -c 等解释器单行命令。",
  presetLabel: "预设",
  presetCustomized: (preset) => \`\${preset}（已自定义）\`,
  fromPresetOption: (enabled) => \`跟随预设（\${enabled ? "开启" : "关闭"}）\`,
  fromPreset: "跟随预设",
  forcedOn: "强制开启",
  forcedOff: "强制关闭",
  alwaysOn: "始终开启",
  alwaysOff: "始终关闭",
  cannotTurnOff: "无法关闭",
  worktreeDiscard: "允许在 git linked worktree 中丢弃本地更改",
  worktreeDiscardHelp: "只放宽 linked worktree 内的丢弃检查。",
  worktreeChange: "在 linked worktree 中丢弃更改",
  allowed: "允许",
  blocked: "阻止",
  allowPathsChange: "允许删除的路径",
  denyPathsChange: "始终阻止的路径",
  secretAllowPathsChange: "机密模式豁免",
  pathsAdded: (paths) => \`添加 \${count3(paths)} 个\`,
  pathsRemoved: (paths) => \`移除 \${count3(paths)} 个\`,
  changedByYou: "由你更改",
  forcedInAdvanced: (capability, enabled) => \`\${capability} 已在高级设置中强制\${enabled ? "开启" : "关闭"}\`,
  setByEnvironment: "由环境变量设置",
  setByEnvironmentVariable: (variable) => \`由环境变量设置：\${variable}\`,
  needsPreset: (preset) => \`需要 \${preset} 预设\`,
  offByDefault: "默认关闭",
  customMessageNote: "自定义消息",
  customMessageCount: (messages) => \`\${count3(messages)} 条自定义消息\`,
  customMessageChange: "自定义消息",
  builtInMessageChange: "内置消息",
  blockMessage: "阻止消息",
  blockMessageFor: (rule) => \`\${rule} 的阻止消息\`,
  agentIsTold: "告知智能体",
  ruleMessageLabel: "告知智能体的内容",
  ruleMessageBuiltIn: (reason) => \`内置：\${reason}\`,
  ruleMessageUseBuiltIn: "以此为基础编辑",
  ruleMessageBuiltInVaries: "（与被阻止命令对应的内置原因）",
  ruleMessageIntentLabel: "智能体接下来该做什么",
  ruleMessageIntentHelp: "决定消息的结尾语句。",
  ruleMessageIntentBuiltIn: (intent) => \`内置：\${intent}\`,
  intentHardStop: "停止并向我报告",
  intentUseAlternative: "使用消息中的替代方案",
  intentScopeDown: "缩小目标范围后重试",
  intentManualOnly: "请我手动运行",
  intentStopAndExplain: "简化命令，或向我报告",
  ruleMessagePreview: "阻止消息预览",
  ruleMessageFootnote: "规则仍会阻止。这条消息用于该规则阻止的所有命令。",
  ruleMessageRuleOff: "此规则已关闭，因此不会显示该消息。",
  shortenMessage: (characters) => \`需再缩短 \${count3(characters)} 个字符才能保存。\`,
  blockMessageTooLong: (limit) => \`有阻止消息超过 \${count3(limit)} 个字符。\`,
  ruleMessageAskNote: (strict) => \`低于\${strict}预设时，可请求批准的智能体会将此规则显示为确认提示，结尾语句固定。\`,
  ruleMessageRemove: "移除消息",
  done: "完成",
  editBlockMessage: "编辑其消息",
  customizeMessage: "自定义消息",
  offCount: (rules) => \`\${count3(rules)} 条已关闭\`,
  commandRuleSummary: (on, off, always) => \`开启 \${count3(on)} 条 · 关闭 \${count3(off)} 条 · 始终开启 \${count3(always)} 条\`,
  commandProtectionOffSummary: "已关闭。内置规则不再生效，灾难性规则和自定义规则仍然生效。规则设置会保留。",
  secretRuleSummary: (on, off) => \`开启 \${count3(on)} 条 · 关闭 \${count3(off)} 条\`,
  secretProtectionOffSummary: "已关闭。不再阻止敏感文件和拒绝路径。规则设置和路径会保留。",
  noCommandProtectionMatch: "没有匹配的命令保护规则。",
  noSecretProtectionMatch: "没有匹配的机密保护规则。",
  aboutRule: (rule) => \`关于 \${rule}\`,
  protectedPaths: "受保护的路径",
  protectedPathsFor: (rule) => \`\${rule} 保护的路径\`,
  toggleGroup: (group) => \`开启或关闭“\${group}”中的全部规则\`,
  toggleAll: "全部开启或关闭",
  secretCategoryBasename: "敏感文件名",
  secretCategoryPattern: "敏感文件名模式",
  secretCategoryHomePath: "主目录中的敏感目录",
  secretCategoryVariant: "密钥文件名变体",
  secretCategoryExtension: "敏感文件扩展名",
  secretCategoryExtensionPattern: "敏感扩展名模式",
  secretCategoryCredential: "编码智能体凭证",
  secretCategoryConfig: "编码智能体设置",
  inheritedChip: "继承",
  projectChip: "项目",
  projectChipTitle: "由此项目设置。点击可取消设置。",
  projectChipLabel: (field) => \`由项目设置：\${field}。激活后恢复继承。\`,
  commandProtectionOffBanner: "命令保护已关闭，内置的破坏性命令规则不再生效。灾难性规则和自定义规则仍然生效。",
  secretProtectionOffBanner: "机密保护已关闭，不再阻止敏感文件和拒绝路径。",
  fallbackConfigBanner: (reason) => \`正在执行 fallback 配置：\${reason}\`,
  openProtections: "打开保护视图",
  environmentRaises: (variables) => \`环境变量把保护强度提高到了这些设置之上：\${variables}\`,
  removePath: (path) => \`移除 \${path}\`,
  notAdded: (paths, error) => \`未添加：\${paths}。\${error}\`,
  alreadyListed: (paths) => \`已在列表中：\${paths}\`,
  previewFailed: "预览失败",
  couldNotTest: (error) => \`无法测试此命令：\${error}\`,
  testerAllowed: "<strong>允许。</strong>没有规则阻止此命令。",
  createRuleToBlock: "创建规则阻止它",
  testerBlocked: (rule) => rule ? \`<strong>已阻止</strong>，触发规则 \${rule}。\` : "<strong>已阻止</strong>。",
  blockedPart: "被阻止的部分：",
  testerHelp: "按保护设置检查命令，包括未保存的更改和自定义规则。不会实际运行。",
  test: "测试",
  notCreatedYet: "（尚未创建）",
  projectPolicyChanges: "项目策略会更改以下设置：",
  restoredDraft: "已恢复未保存的更改",
  couldNotLoadPolicy: "无法加载策略",
  projectPolicyUnavailable: "项目策略不可用",
  repairFirst: "请先修复你的策略",
  repairBeforeProject: "编辑项目策略前，必须先修复你自己的策略文件。",
  policyNotLoaded: "策略尚未加载",
  discardUnsavedTitle: "丢弃未保存的更改？",
  discardBeforeProject: "项目策略以你已保存的策略为起点。请先保存更改，或在此丢弃。",
  discardChanges: "丢弃更改",
  discardDraftTitle: "丢弃此项目草稿？",
  discardDraft: "丢弃草稿",
  switchFolderDiscards: "切换目录会丢弃此草稿。",
  folderPickerFailed: "无法打开目录选择器",
  projectChangesUnwritten: "项目更改尚未写入任何文件。",
  backToOwnPolicy: "已返回你自己的策略",
  discardDraftChangesTitle: "丢弃对此草稿的更改？",
  discardDraftChangesBody: "草稿将恢复为此项目现有的设置。",
  changesDiscarded: "已丢弃更改",
  projectDraftReloaded: "已重新加载项目草稿",
  projectFolderChanged: "项目目录已更改",
  projectFolderChangedBody: "已按新目录重新加载草稿。应用前请再次复核。",
  invalidProjectFile: "现有的项目策略文件无效，将被替换。",
  noEffectiveChange: "生效策略没有变化。",
  diffSetting: "设置",
  diffNow: "当前",
  diffAfter: "应用后",
  unset: "（未设置）",
  reviewFailed: "复核失败",
  reviewAgain: "重新复核",
  draftChangedDuringReview: "复核结果加载期间，草稿发生了变化。",
  applyProjectTitle: "应用此项目策略？",
  applyProjectBody: "此项目中的每个人都会在自己策略的基础上叠加这些设置。",
  applyProject: "应用项目策略",
  applyingStatus: "应用中…",
  applyFailed: "应用失败",
  projectApplied: "已应用项目策略",
  repairBeforeSaving: "请先修复策略再保存",
  policySaved: "策略已保存",
  discardUnsavedBody: "自上次保存以来的所有更改都将撤销。",
  discardingStatus: "丢弃中…",
  repairTitle: "修复策略文件？",
  repairBody: "保留有效设置，丢弃无效设置。如果 JSON 完全无法读取，则恢复默认值。",
  repairingStatus: "修复中…",
  repairFailed: "修复失败",
  policyRepaired: "策略已修复",
  nothingToReset: "无需重置，所有规则都已使用默认值",
  resetRulesTitle: "将所有规则重置为默认值？",
  resetRulesBody: (secret) => \`所有\${secret ? "机密" : "命令"}规则都将恢复为预设给出的设置。保存前仍可丢弃。\`,
  resetRules: "重置规则",
  turnOffSecretTitle: "关闭机密保护？",
  turnOffCommandTitle: "关闭命令保护？",
  turnOffSecretBody: "在重新开启之前，不再阻止敏感文件、编码智能体凭证和拒绝路径。",
  turnOffCommandBody: "在重新开启之前，内置的破坏性 git、文件系统和执行规则不再阻止命令。",
  catastrophicStillApply: "灾难性规则和自定义规则仍然生效。",
  turnOff: "关闭",
  rulesIntro: "你在 rulebook 中编写的阻止规则，在内置保护之外额外执行。",
  refreshRules: "刷新自定义规则",
  problems: "问题",
  problemsSub: "出现错误表示该 rulebook 已被跳过，其中的规则都不会执行。",
  rulebooks: "Rulebook",
  rulebooksSub: "只读。按实际执行的方式显示规则。",
  loadingRules: "正在加载规则…",
  createRule: "创建规则",
  createRuleSub: "描述规则，然后复制一段现成的 prompt 交给编码智能体。CC Safety Net 本身不会写入 rulebook。",
  appliesTo: "适用范围",
  ruleScope: "规则范围",
  thisProject: "此项目",
  allProjects: "所有项目",
  projectFolder: "项目目录",
  chooseFolder: "选择…",
  projectFolderHint: "rulebook 的写入位置。默认为启动此 GUI 的目录。",
  ruleRequest: "要阻止什么？",
  ruleRequestPlaceholder: "在此项目中阻止 terraform destroy",
  ruleRequestHint: "规则匹配命令、子命令和精确参数，不匹配文件路径或模式。",
  tryExamples: "试试：",
  exampleSuggest: "推荐规则",
  exampleSuggestRequest: "阅读我的 package.json，推荐要阻止的规则",
  exampleBlock: "阻止命令",
  exampleBlockRequest: "设置规则，阻止所有 terraform destroy 命令",
  exampleVerify: "验证规则",
  exampleVerifyRequest: "验证我的规则并修复所有错误",
  copyPrompt: "复制 prompt",
  allRulebooksSkipped: "所有 rulebook 都因错误被跳过，没有任何自定义规则生效。请查看上方的“问题”。",
  noCustomRules: "还没有自定义规则。使用下方的<strong>创建规则</strong>，或运行 <code>npx -y cc-safety-net rule init</code>。",
  blocksWhenArgument: "出现以下任一参数时阻止：",
  customRuleMissing: (rule) => \`\${rule} 不在任何 rulebook 中\`,
  couldNotLoadRules: (error) => \`无法加载规则：\${error}\`,
  folderPickerUnavailable: "目录选择器不可用",
  typeFolderInstead: (error) => \`\${error}。请手动输入项目目录。\`,
  rulesNotLoaded: "规则尚未加载",
  refreshAndRetry: "请点击刷新后重试。",
  describeRuleFirst: "请先描述要阻止的内容",
  enterProjectFolder: "请输入规则所属的项目目录",
  promptCopied: "已复制 prompt",
  pasteIntoAgent: "请将其粘贴到编码智能体中。",
  agentsIntro: "为本机上的每个编码智能体安装或卸载 CC Safety Net hook。",
  refreshAgents: "刷新智能体",
  checkingAgents: "正在检查智能体…",
  hookInstalled: "已安装 hook",
  hookDisabled: "已禁用 hook",
  hookStatusUnknown: "状态未知，无法读取其设置文件",
  uninstalling: "正在卸载…",
  installing: "正在安装…",
  uninstall: "卸载",
  enable: "启用",
  install: "安装",
  notDetected: "未检测到",
  installedAgents: "已安装",
  detectedAgents: "本机已检测到",
  noHookYet: "还没有智能体安装 hook。请为你使用的每个智能体安装。未安装的智能体，其命令不会受到检查。",
  missingAgents: "本机未检测到",
  couldNotCheckAgents: (error) => \`无法检查智能体：\${error}\`,
  installFailed: "安装失败",
  uninstallFailed: "卸载失败",
  settingsIntro: "外观、日志保留、文件位置和维护。",
  appearance: "外观",
  theme: "主题",
  themeAuto: "自动",
  themeLight: "浅色",
  themeDark: "深色",
  preferenceHint: "保存在本机。",
  language: "语言",
  preferenceSaveFailed: "无法保存此偏好设置",
  auditLog: "审计日志",
  keepLogsFor: "日志保留期",
  retentionNote: "每条检查过的命令都会记入日志。缩短保留期会删除较早的条目，活动视图也只能回溯到这个范围。",
  logFolder: "日志目录",
  copyLogFolder: "复制日志目录路径",
  files: "文件",
  policyFile: "策略文件",
  copyPolicyPath: "复制策略文件路径",
  copyProjectPolicyPath: "复制项目策略路径",
  about: "关于",
  platform: "平台",
  dangerZone: "危险操作",
  resetPolicy: "重置策略",
  resetPolicyHelp: "用默认值替换策略文件。此操作无法撤销。",
  repairInProtectionsFirst: "请先在保护视图中修复策略文件。",
  leaveProjectDraftFirst: "请先应用或退出项目策略草稿。",
  saveProtectionsFirst: "请先保存或丢弃保护视图中未保存的更改。",
  retentionRange: (min, max) => \`请输入 \${count3(min)} 到 \${count3(max)} 之间的整数天数。\`,
  retentionUnchanged: "保留期未更改",
  shortenRetentionTitle: (window2) => \`日志只保留 \${days3(window2)}？\`,
  shortenRetentionBody: (window2) => \`早于 \${days3(window2)}的日志条目将在下次清理时删除，且无法恢复。\`,
  shortenRetention: "缩短保留期",
  retentionSaved: (window2) => \`日志保留期已改为 \${days3(window2)}\`,
  resetUnavailable: "无法重置",
  resetPolicyTitle: "重置策略？",
  resetPolicyBody: "策略文件将替换为默认值，所有自定义设置都会丢失。",
  resettingStatus: "重置中…",
  resetFailed: "重置失败",
  policyReset: "策略已重置为默认值"
};

// src/gui/frontend/preferences.ts
var locales = ["en", "ja", "zh-CN"];
var localeByLanguage = new Map([
  ["en", "en"],
  ["ja", "ja"],
  ["zh", "zh-CN"]
]);
var resolveLocale = (saved, languages) => saved ?? languages.map((tag) => localeByLanguage.get(tag.toLowerCase().split("-")[0] ?? "")).find((locale) => locale !== undefined) ?? "en";

// src/gui/frontend/i18n.ts
var locale = resolveLocale(guiData.preferences.language, navigator.languages);
var t = { en, ja, "zh-CN": zhCN }[locale];
var formatCount = (value) => value.toLocaleString(locale);
var formatDateTime = (ts) => new Date(ts).toLocaleString(locale);
var formatClockTime = (ts) => new Date(ts).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
var relativeTimeFormat = new Intl.RelativeTimeFormat(locale, {
  numeric: "always",
  style: "narrow"
});
var formatRelativeTime = (ts) => {
  const minutes = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (!Number.isFinite(minutes))
    return "";
  if (minutes >= 1440)
    return relativeTimeFormat.format(-Math.floor(minutes / 1440), "day");
  if (minutes >= 60)
    return relativeTimeFormat.format(-Math.floor(minutes / 60), "hour");
  if (minutes >= 1)
    return relativeTimeFormat.format(-minutes, "minute");
  return t.justNow;
};
var formatDayHeading = (ts) => {
  const date = new Date(ts).toDateString();
  if (date === new Date().toDateString())
    return t.today;
  if (date === new Date(Date.now() - 86400000).toDateString())
    return t.yesterday;
  return new Date(ts).toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
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
    runtime: {
      flags: ["-ac", "--agy-cli"],
      description: "Run as Antigravity CLI PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      flag: "--agy-cli",
      artifactKind: "plugin",
      probeCommand: ["agy", "--version"]
    }
  },
  {
    id: "claude-code",
    displayName: "Claude Code",
    runtime: {
      displayName: "Coding CLI",
      flags: ["-cc", "--coding-cli"],
      legacyFlags: ["--claude-code"],
      description: "Run as Coding CLI PreToolUse hook",
      legacyTopLevelFlags: ["-cc", "--claude-code"]
    },
    install: {
      flag: "--claude-code",
      artifactKind: "plugin",
      probeCommand: ["claude", "--version"]
    }
  },
  {
    id: "codex",
    displayName: "Codex",
    runtime: {
      flags: ["-cx", "--codex"],
      description: "Run as a Codex PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      flag: "--codex",
      artifactKind: "plugin",
      probeCommand: ["codex", "--version"]
    }
  },
  {
    id: "copilot-cli",
    displayName: "GitHub Copilot CLI",
    runtime: {
      flags: ["-cp", "--copilot-cli"],
      description: "Run as GitHub Copilot CLI PreToolUse hook",
      legacyTopLevelFlags: ["-cp", "--copilot-cli"]
    },
    install: {
      flag: "--copilot-cli",
      artifactKind: "plugin",
      probeCommand: ["copilot", "--binary-version"]
    }
  },
  {
    id: "gemini-cli",
    displayName: "Gemini CLI",
    runtime: {
      flags: ["-gc", "--gemini-cli"],
      description: "Run as Gemini CLI BeforeTool hook",
      legacyTopLevelFlags: ["-gc", "--gemini-cli"]
    },
    install: {
      flag: "--gemini-cli",
      artifactKind: "extension",
      probeCommand: ["gemini", "--version"]
    }
  },
  {
    id: "grok-build",
    displayName: "Grok Build",
    runtime: {
      flags: ["-gb", "--grok-build"],
      description: "Run as Grok Build PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      flag: "--grok-build",
      artifactKind: "hook config",
      probeCommand: ["grok", "--version"]
    }
  },
  {
    id: "hermes-agent",
    displayName: "Hermes Agent",
    runtime: {
      flags: ["-ha", "--hermes-agent"],
      description: "Run as Hermes Agent pre_tool_call hook",
      legacyTopLevelFlags: []
    },
    install: {
      flag: "--hermes-agent",
      artifactKind: "plugin",
      probeCommand: ["hermes", "--version"]
    }
  },
  {
    id: "kimi-code",
    displayName: "Kimi Code",
    runtime: {
      flags: ["-kc", "--kimi-code"],
      description: "Run as Kimi Code PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      flag: "--kimi-code",
      artifactKind: "hook config",
      probeCommand: ["kimi", "--version"]
    }
  },
  {
    id: "openclaw",
    displayName: "OpenClaw",
    install: {
      flag: "--openclaw",
      artifactKind: "plugin",
      probeCommand: ["openclaw", "--version"]
    }
  },
  {
    id: "opencode",
    displayName: "OpenCode",
    install: {
      flag: "--opencode",
      artifactKind: "plugin",
      probeCommand: ["opencode", "--version"]
    }
  },
  {
    id: "pi",
    displayName: "Pi",
    install: {
      flag: "--pi",
      artifactKind: "package",
      probeCommand: ["pi", "--version"]
    }
  },
  {
    id: "cursor",
    displayName: "Cursor",
    runtime: {
      flags: ["-cu", "--cursor"],
      description: "Run as Cursor preToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      flag: "--cursor",
      artifactKind: "hook config",
      probeCommand: ["cursor", "--version"]
    }
  },
  {
    id: "deepseek-harness",
    displayName: "DeepSeek Harness",
    install: {
      flag: "--deepseek-harness",
      artifactKind: "package",
      probeCommand: DEEPSEEK_HARNESS_NPM_PROBE
    }
  },
  {
    id: "devin",
    displayName: "Devin CLI",
    runtime: {
      flags: ["-dv", "--devin"],
      description: "Run as Devin CLI PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      flag: "--devin",
      artifactKind: "hook config",
      probeCommand: ["devin", "--version"]
    }
  },
  {
    id: "droid",
    displayName: "Factory Droid",
    runtime: {
      flags: ["-fd", "--droid"],
      description: "Run as Factory Droid PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      flag: "--droid",
      artifactKind: "hook config",
      probeCommand: ["droid", "--version"]
    }
  },
  {
    id: "amp",
    displayName: "Amp Code",
    install: {
      flag: "--amp",
      artifactKind: "plugin",
      probeCommand: ["amp", "--version"]
    }
  }
];
var catalogByDisplayName = catalog.slice().sort((a, b) => a.displayName.localeCompare(b.displayName, "en"));
var doctorIntegrationOrder = catalogByDisplayName.map((integration) => integration.id).sort((a, b) => Number(b === "claude-code") - Number(a === "claude-code"));
var runtimeHookIntegrationMetadata = catalogByDisplayName.filter((integration) => ("runtime" in integration)).map((integration) => ({
  id: integration.id,
  displayName: "displayName" in integration.runtime ? integration.runtime.displayName : integration.displayName,
  flags: integration.runtime.flags,
  legacyFlags: "legacyFlags" in integration.runtime ? integration.runtime.legacyFlags : [],
  description: integration.runtime.description,
  legacyTopLevelFlags: integration.runtime.legacyTopLevelFlags
}));
var installIntegrationMetadata = catalogByDisplayName.map((integration) => ({
  id: integration.id,
  ...integration.install
}));
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
var requestJson = async (path, init = {}) => {
  const token = guiData.token;
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
\`) : null) ?? result.data?.error ?? t.requestFailed(result.status);
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
var savePreference = async (update) => {
  const result = await requestJson("/api/preferences", {
    method: "POST",
    body: JSON.stringify(update)
  });
  const saved = isWriteSuccess(result);
  if (!saved)
    notify(t.preferenceSaveFailed, "error", errorText(result));
  return saved;
};
var icons = {
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2"></path></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>',
  remove: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path></svg>',
  message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7l-4 3.5V17H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"></path><path d="M8 9.5h8M8 13h5"></path></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>'
};
var showingCopied = new WeakSet;
var copyText = async (button, text) => {
  const copied = await navigator.clipboard.writeText(text).then(() => true, () => false);
  if (!copied) {
    notify(t.copyFailed, "error");
    return;
  }
  if (showingCopied.has(button))
    return;
  showingCopied.add(button);
  const label = button.innerHTML;
  button.innerHTML = \`\${icons.check}<span>\${escapeHtml(t.copied)}</span>\`;
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
var attentionItems = (facts, t) => [
  ...(facts.targets ?? []).filter((row) => row.status === "disabled").map((row) => ({
    text: t.hookDisabledAttention(row.label),
    href: "#integrations"
  })),
  facts.suspects > 0 ? {
    text: t.suspectAttention(facts.suspects, facts.days),
    href: "#activity?decision=suspect"
  } : null,
  facts.errors > 0 ? {
    text: t.guardErrorAttention(facts.errors, facts.days),
    href: "#activity?decision=error"
  } : null,
  facts.update?.updateAvailable ? {
    text: t.updateAttention(facts.update.latestVersion ?? ""),
    href: \`\${repoUrl}/releases\`
  } : null
].filter((item) => item !== null);

// src/gui/frontend/policy-summary.ts
var safetyLevels = (t) => ({
  standard: [t.presetStandard, t.presetStandardDescription],
  strict: [t.presetStrict, t.presetStrictDescription],
  paranoid: [t.presetParanoid, t.presetParanoidDescription]
});
var capabilityNames = (t) => ({
  fail_closed: [t.capabilityFailClosed, t.capabilityFailClosedDescription],
  paranoid_rm: [t.capabilityParanoidRm, t.capabilityParanoidRmDescription],
  paranoid_interpreters: [
    t.capabilityParanoidInterpreters,
    t.capabilityParanoidInterpretersDescription
  ]
});
var levelName = (level, t) => safetyLevels(t)[level][0];
var tierForRule = (rule) => !rule.activationCapability ? "normal" : rule.activationCapability === "fail_closed" ? "strict" : "paranoid";
var commandRuleGroups = (rules, t) => {
  const alwaysOn = rules.filter((rule) => rule.catastrophic);
  const configurable = rules.filter((rule) => !rule.catastrophic);
  return [
    ...alwaysOn.length > 0 ? [{ key: "always-on", title: t.alwaysOn, rules: alwaysOn }] : [],
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
var ruleNote = (rule, effective, capabilities, t) => {
  const capability = rule.activationCapability;
  if (effective.source === "rule_override")
    return t.changedByYou;
  if (effective.source === "capability_override" && capability)
    return t.forcedInAdvanced(capabilityNames(t)[capability][0], effective.enabled);
  if (effective.source === "environment") {
    const source = [...capability ? capabilities[capability]?.sources ?? [] : []].reverse().find((item) => item.startsWith("env "));
    return source ? t.setByEnvironmentVariable(source.slice(4)) : t.setByEnvironment;
  }
  if (effective.enabled || effective.source === "master_disabled")
    return null;
  return t.needsPreset(tierForRule(rule) === "strict" ? t.presetStrict : t.presetParanoid);
};
var policyChanges = (saved, draft, labels, t) => {
  const onOff = (value) => value ? t.stateOn : t.stateOff;
  const capabilities = capabilityNames(t);
  const overrideChanges = (before, after) => [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((id) => before[id] !== after[id]).map((id) => t.settingChange(labels[id] ?? id, after[id] === undefined ? t.stateDefault : onOff(after[id] === "on")));
  const messageChanges = (before = {}, after = {}) => [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((id) => before[id]?.reason !== after[id]?.reason || before[id]?.intent !== after[id]?.intent).map((id) => t.settingChange(labels[id] ?? id, after[id] ? t.customMessageChange : t.builtInMessageChange));
  const pathChanges = (name, before, after) => {
    const added = after.filter((path) => !before.includes(path)).length;
    const removed = before.filter((path) => !after.includes(path)).length;
    if (added === 0 && removed === 0)
      return null;
    return t.settingChange(name, [added ? t.pathsAdded(added) : "", removed ? t.pathsRemoved(removed) : ""].filter(Boolean).join(t.listSeparator));
  };
  return [
    saved.safety.level === draft.safety.level ? null : t.settingChange(t.presetLabel, \`\${levelName(saved.safety.level, t)} → \${levelName(draft.safety.level, t)}\`),
    ...Object.keys(capabilities).filter((key) => saved.safety.overrides[key] !== draft.safety.overrides[key]).map((key) => {
      const value = draft.safety.overrides[key];
      return t.settingChange(capabilities[key][0], value === undefined ? t.fromPreset : value ? t.forcedOn : t.forcedOff);
    }),
    saved.workflow.worktree_mode === draft.workflow.worktree_mode ? null : t.settingChange(t.worktreeChange, draft.workflow.worktree_mode ? t.allowed : t.blocked),
    saved.destructive_command_protection.enabled === draft.destructive_command_protection.enabled ? null : t.settingChange(t.commandProtection, onOff(draft.destructive_command_protection.enabled)),
    saved.secret_protection.enabled === draft.secret_protection.enabled ? null : t.settingChange(t.secretProtection, onOff(draft.secret_protection.enabled)),
    ...overrideChanges(saved.destructive_command_protection.overrides, draft.destructive_command_protection.overrides),
    ...overrideChanges(saved.secret_protection.overrides, draft.secret_protection.overrides),
    ...messageChanges(saved.destructive_command_protection.messages, draft.destructive_command_protection.messages),
    ...messageChanges(saved.secret_protection.messages, draft.secret_protection.messages),
    pathChanges(t.allowPathsChange, saved.destructive_command_protection.allow_paths, draft.destructive_command_protection.allow_paths),
    pathChanges(t.denyPathsChange, saved.secret_protection.deny_paths, draft.secret_protection.deny_paths),
    pathChanges(t.secretAllowPathsChange, saved.secret_protection.allow_paths, draft.secret_protection.allow_paths)
  ].filter((change) => change !== null);
};

// src/gui/frontend/views/integrations.ts
var targets = null;
var busy = new Set;
var integrationTargets = () => targets;
var statusText = (row) => ({
  active: t.hookInstalled,
  disabled: t.hookDisabled,
  "not-installed": "",
  "not-inspected": t.hookStatusUnknown
})[row.status];
var rowHtml = (row) => {
  const uninstall = row.status === "active";
  const action = row.version === null ? "" : \`<button type="button" data-integration-action="\${uninstall ? "uninstall" : "install"}" data-integration-target="\${escapeHtml(row.target)}"\${busy.has(row.target) ? " disabled" : ""}>\${busy.has(row.target) ? uninstall ? t.uninstalling : t.installing : uninstall ? t.uninstall : row.status === "disabled" ? t.enable : t.install}</button>\`;
  return \`<li class="setting-row agent-row">
    <span class="agent-name">\${escapeHtml(row.label)}</span>
    <span class="agent-version"\${row.version === null ? "" : \` title="v\${escapeHtml(row.version)}"\`}>\${row.version === null ? t.notDetected : \`v\${escapeHtml(row.version)}\`}</span>
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
  qs("integrations-list").innerHTML = groupHtml(t.installedAgents, groups.installed) + groupHtml(t.detectedAgents, groups.available, groups.installed.length === 0 ? t.noHookYet : "") + (groups.missing.length === 0 ? "" : \`<details class="section missing-agents"><summary>\${t.missingAgents} <span class="count">\${groups.missing.length}</span></summary><ul class="card rows">\${groups.missing.map(rowHtml).join("")}</ul></details>\`);
};
var loadIntegrations = async () => {
  const result = await requestJson("/api/integrations");
  if (!result.ok || !Array.isArray(result.data?.targets)) {
    qs("integrations-list").innerHTML = \`<p class="empty">\${escapeHtml(t.couldNotCheckAgents(errorText(result)))}</p>\`;
    return;
  }
  targets = result.data.targets;
  qs("integrations-node-version").textContent = result.data.system.nodeVersion ?? t.unknownValue;
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
    notify(action === "install" ? t.installFailed : t.uninstallFailed, "error");
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
    policy.destructive_command_protection.enabled ? null : t.commandProtectionIsOff,
    policy.secret_protection.enabled ? null : t.secretProtectionIsOff
  ].filter((text) => text !== null);
  const noAgent = loaded.errors.length === 0 && targets !== null && active.length === 0;
  const headline = loaded.errors.length > 0 ? t.statusRepair : !targets ? t.statusCheckingAgents : noAgent ? t.statusNoAgent : off.length > 0 ? t.statusPartlyProtected : t.statusProtected;
  const customized = (loaded.preview?.counts.effectiveCustomizations ?? 0) > 0 || Object.entries(policy.safety.overrides).some(([key, value]) => value !== SAFETY_LEVEL_CAPABILITIES[policy.safety.level][key]);
  const facts = [
    t.presetFact(levelName(policy.safety.level, t), customized),
    ...off.length > 0 ? off : [
      loaded.preview ? t.commandRulesOn(loaded.preview.counts.enabled) : null,
      t.secretProtectionIsOn
    ],
    active.length > 0 ? t.hookActiveIn(active.length <= 3 ? active.map((row) => row.label).join(t.listSeparator) : t.agentCount(active.length)) : null
  ].filter((text) => text !== null);
  const [actionHref, actionLabel] = noAgent ? ["#integrations", t.installHook] : ["#policy", loaded.errors.length > 0 ? t.repair : t.configure];
  qs("status-card").innerHTML = \`<div>
      <p class="status-headline">\${escapeHtml(headline)}</p>
      <p class="status-facts">\${facts.map(escapeHtml).join(" · ")}</p>
    </div>
    <a class="link-button" href="\${actionHref}">\${escapeHtml(actionLabel)}</a>\`;
};
var renderAttention = () => {
  const items = attentionItems({
    targets: integrationTargets(),
    update,
    errors: feed?.counts.errors ?? 0,
    suspects: feed ? findSuspectEntries(feed.entries).size : 0,
    days: feed?.days ?? OVERVIEW_DAYS
  }, t);
  qs("attention").hidden = items.length === 0;
  qs("attention-list").innerHTML = items.map((item) => \`<li class="list-row attention-row"><span>\${escapeHtml(item.text)}</span><a class="link-button" href="\${escapeHtml(item.href)}"\${item.href.startsWith("#") ? "" : ' target="_blank" rel="noopener"'}>\${escapeHtml(item.href.startsWith("#activity") ? t.review : item.href.startsWith("#") ? t.fix : t.releaseNotes)}</a></li>\`).join("");
};
var sparkline = (byDay, noun) => {
  const max = Math.max(...byDay, 1);
  return \`<div class="tile-spark" role="img" aria-label="\${escapeHtml(t.perDayChart(noun, byDay.map(formatCount).join(t.listSeparator)))}">\${byDay.map((count) => \`<span class="spark-bar\${count === 0 ? " spark-zero" : ""}" style="height:\${count === 0 ? 2 : Math.max(3, Math.round(count / max * 36))}px" title="\${formatCount(count)}"></span>\`).join("")}</div>\`;
};
var ruleHref = (ruleId) => ruleId.startsWith("custom.") ? \`#rules?focus=\${encodeURIComponent(ruleId)}\` : \`#activity?q=\${encodeURIComponent(ruleId)}\`;
var renderActivity = () => {
  if (!feed)
    return;
  const loaded = feed;
  qs("overview-tiles").innerHTML = [
    [loaded.counts.blocked, t.tileBlocked, loaded.counts.blockedByDay],
    [loaded.totalInWindow, t.tileChecked, loaded.counts.analyzedByDay]
  ].map(([value, label, byDay]) => \`<div class="tile"><div><strong>\${formatCount(value)}</strong><span>\${escapeHtml(\`\${label} · \${t.lastDays(loaded.days)}\`)}</span></div>\${sparkline(byDay, label)}</div>\`).join("");
  const blocks = loaded.entries.filter((entry) => entry.decision !== "allow").slice(0, 8);
  qs("recent-blocks").innerHTML = blocks.length === 0 ? \`<p class="empty">\${escapeHtml(t.nothingBlocked(loaded.days))}</p>\` : \`<ul class="card list">\${blocks.map((entry) => \`<li><a class="list-row compact-row" href="\${entry.ruleId ? ruleHref(entry.ruleId) : "#activity"}">
              <time datetime="\${escapeHtml(entry.ts)}">\${escapeHtml(formatRelativeTime(entry.ts))}</time>
              <span class="feed-agent">\${escapeHtml(entry.agent && entry.agent !== "unknown" ? agentLabels[entry.agent] ?? entry.agent : "")}</span>
              <code class="feed-command">\${escapeHtml(entry.segment || entry.command || t.noCommandRecorded)}</code>
              <span class="feed-rule">\${escapeHtml(entry.failureStage ? t.guardError : entry.ruleId ?? "")}</span>
            </a></li>\`).join("")}</ul>\`;
  const top = Object.entries(loaded.counts.rules).sort((a, b) => b[1] - a[1]).slice(0, 5);
  qs("top-rules-title").textContent = \`\${t.topRules} · \${t.lastDays(loaded.days)}\`;
  qs("top-rules").innerHTML = top.length === 0 ? \`<p class="empty">\${escapeHtml(t.noRuleBlocked)}</p>\` : \`<ul class="card list">\${top.map(([ruleId, count]) => \`<li><a class="list-row rule-count-row" href="\${ruleHref(ruleId)}">
              <code class="rule-label">\${escapeHtml(ruleId)}</code>
              <span class="count">\${escapeHtml(t.blockCount(count))}</span>
            </a></li>\`).join("")}</ul>\`;
};
var loadOverview = async () => {
  const result = await requestJson(\`/api/activity?days=\${Math.min(OVERVIEW_DAYS, retentionDays())}\`);
  if (!result.ok || !result.data) {
    qs("recent-blocks").innerHTML = \`<p class="empty">\${escapeHtml(t.couldNotLoadActivity(errorText(result)))}</p>\`;
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
  const evidence = starContext.blockedTotal > 0 ? t.starEvidence(starContext.blockedTotal, retentionDays()) : "";
  qs("star-pitch-text").innerHTML = starred ? evidence : evidence ? \`\${evidence} \${t.starIfSaved}\` : t.starIfUseful;
};
var renderStarLink = (href) => {
  qs("star-slot").innerHTML = \`<a class="star-cta" href="\${escapeHtml(href)}" target="_blank" rel="noopener" aria-label="\${escapeHtml(t.starLinkLabel)}"><span class="star-icon" aria-hidden="true">\${starIcons.outline}</span><span class="star-label">\${escapeHtml(t.starOnGitHub)}</span>\${starCountHtml(starContext.starCount)}</a>\`;
  qs("star-row").hidden = false;
};
var loadStarContext = async () => {
  const result = await requestJson("/api/star/context");
  starContext = result.ok && result.data ? result.data : { starCount: null, blockedTotal: 0 };
  renderStarPitch(false);
  qs("star-slot").innerHTML = \`<button type="button" class="star-cta" aria-label="\${escapeHtml(t.starButtonLabel)}"><span class="star-icon" aria-hidden="true">\${starIcons.outline}</span><span class="star-label">\${escapeHtml(t.starOnGitHub)}</span>\${starCountHtml(starContext.starCount)}</button>\`;
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
  button.querySelector(".star-label").textContent = t.starred;
  button.setAttribute("aria-label", t.starredLabel);
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
var decisionLabel = (entry) => entry.failureStage ? t.decisionError : entry.decision === "allow" ? t.decisionAllowed : t.decisionBlocked;
var reportFieldNames = {
  title: t.reportNameTitle,
  expected: t.reportNameExpected,
  command: t.reportNameCommand,
  entry: t.reportNameEntry
};
var ruleLink = (ruleId) => ruleId.startsWith("custom.") ? \`<a class="rule-id" href="#rules?focus=\${encodeURIComponent(ruleId)}" title="\${escapeHtml(t.showCustomRule)}">\${escapeHtml(ruleId)}</a>\` : knownRuleIds().has(ruleId) ? \`<a class="rule-id" href="#policy?q=\${encodeURIComponent(ruleId)}" title="\${escapeHtml(t.showProtection)}">\${escapeHtml(ruleId)}</a> · <a href="#policy?q=\${encodeURIComponent(ruleId)}&message=1">\${escapeHtml(t.customizeMessage)}</a>\` : \`<code class="rule-id">\${escapeHtml(ruleId)}</code>\`;
var entryCommand = (entry) => entry.segment || entry.command || "";
var feedRowHtml = (entry, index) => {
  const blocked = entry.decision !== "allow";
  const command = entryCommand(entry);
  const agent = entry.agent && entry.agent !== "unknown" ? agentLabels[entry.agent] ?? entry.agent : "";
  const detailRows = [
    entry.command && entry.command !== command ? [t.detailFullCommand, \`<code class="block">\${escapeHtml(entry.command)}</code>\`] : null,
    entry.reason && entry.reason !== "allowed" ? [t.detailReason, escapeHtml(entry.reason)] : null,
    entry.ruleId ? [t.detailRule, ruleLink(entry.ruleId)] : null,
    entry.cwd ? [t.detailFolder, \`<code>\${escapeHtml(entry.cwd)}</code>\`] : null,
    [
      t.detailTime,
      \`\${escapeHtml(formatDateTime(entry.ts))} (\${escapeHtml(formatRelativeTime(entry.ts))})\`
    ]
  ].filter((row) => row !== null);
  return \`<li class="feed-row">
    <button type="button" class="feed-summary" aria-expanded="false" aria-controls="feed-detail-\${index}">
      <span class="chevron" aria-hidden="true"></span>
      <time datetime="\${escapeHtml(entry.ts)}">\${escapeHtml(formatClockTime(entry.ts))}</time>
      <span class="decision \${entry.failureStage ? "error" : blocked ? "deny" : "allow"}">\${decisionLabel(entry)}</span>
      <span class="feed-agent">\${escapeHtml(agent)}</span>
      <code class="feed-command">\${escapeHtml(command || t.noCommandRecorded)}</code>
      <span class="feed-rule">\${escapeHtml(entry.ruleId ?? "")}</span>
    </button>
    <div class="feed-detail" id="feed-detail-\${index}" hidden>
      <code class="block detail-command">\${escapeHtml(command || t.noCommandRecorded)}</code>
      <div class="detail-actions">
        \${blocked ? \`<button type="button" class="primary" data-report-fp="\${index}">\${escapeHtml(t.reportFalsePositive)}</button>\` : \`<button type="button" class="primary" data-block-future="\${index}">\${escapeHtml(t.blockInFuture)}</button>\`}
        <button type="button" data-log-copy="\${index}">\${icons.copy}<span>\${escapeHtml(t.copyLogEntry)}</span></button>
      </div>
      <dl class="detail-rows">\${detailRows.map(([term, value]) => \`<div><dt>\${escapeHtml(term)}</dt><dd>\${value}</dd></div>\`).join("")}</dl>
    </div>
  </li>\`;
};
var renderControls = () => {
  if (!activity)
    return;
  const loaded = activity;
  const segment = (value, label, count) => \`<button type="button" data-activity-decision="\${value}" aria-pressed="\${filters.decision === value}">\${escapeHtml(label)} <span class="count">\${formatCount(count)}</span></button>\`;
  qs("activity-decision").innerHTML = [
    segment("deny", t.decisionBlocked, loaded.counts.blocked),
    segment("allow", t.decisionAllowed, loaded.counts.allowed),
    ...loaded.counts.errors > 0 ? [segment("error", t.filterErrors, loaded.counts.errors)] : [],
    ...suspects.size > 0 ? [segment("suspect", t.filterSuspect, suspects.size)] : [],
    segment("all", t.filterAll, loaded.totalInWindow)
  ].join("");
  const agentNames = Object.keys(loaded.counts.agents).filter((name) => name !== "unknown").sort();
  qs("activity-agent").innerHTML = [
    \`<option value="all">\${escapeHtml(t.allAgents)}</option>\`,
    ...agentNames.map((name) => \`<option value="\${escapeHtml(name)}">\${escapeHtml(agentLabels[name] ?? name)} (\${formatCount(loaded.counts.agents[name] ?? 0)})</option>\`)
  ].join("");
  qs("activity-agent").value = filters.agent;
  qs("activity-agent").parentElement?.toggleAttribute("hidden", agentNames.length < 2);
  const retained = retentionDays();
  qs("activity-days").innerHTML = [
    ...new Set([...[7, 30, 90, 180, 365].filter((days) => days < retained), retained, loaded.days])
  ].sort((left, right) => left - right).map((days) => \`<option value="\${days}">\${escapeHtml(t.lastDaysOption(days))}</option>\`).join("");
  qs("activity-days").value = String(loaded.days);
  qs("activity-command-filter").hidden = !filters.command;
  qs("activity-command-filter").innerHTML = filters.command ? \`\${escapeHtml(t.showingBlocksOf)} <code>\${escapeHtml(filters.command)}</code> <button type="button" class="quiet" data-clear-command>\${escapeHtml(t.showAllBlocks)}</button>\` : "";
};
var emptyMessage = () => {
  if (filters.query || filters.command || filters.agent !== "all")
    return escapeHtml(t.noFilterMatch);
  if (filters.decision === "deny")
    return \`\${escapeHtml(t.nothingBlocked(activity?.days ?? filters.days))} <button type="button" class="quiet" data-activity-decision="all">\${escapeHtml(t.showAllActivity)}</button>\`;
  return escapeHtml(t.noLogEntries);
};
var renderFeed = () => {
  if (!activity)
    return;
  const entries = visibleEntries(activity.entries, filters, suspects);
  renderedEntries = entries;
  qs("activity-feed").innerHTML = entries.length === 0 ? \`<p class="empty">\${emptyMessage()}</p>\` : entries.map((entry, index) => {
    const label = formatDayHeading(entry.ts);
    const previous = entries[index - 1];
    const heading = previous && formatDayHeading(previous.ts) === label ? "" : \`\${index === 0 ? "" : "</ul>"}<h4 class="day-heading">\${escapeHtml(label)}</h4><ul class="feed-list">\`;
    return heading + feedRowHtml(entry, index);
  }).join("") + "</ul>";
  qs("activity-count").textContent = [
    t.showingEntries(entries.length, activity.totalInWindow, activity.days),
    activity.truncated ? t.activityTruncated : "",
    activity.unreadable > 0 ? t.unreadableLogs(activity.unreadable) : ""
  ].filter(Boolean).join(" ");
};
var loadActivity = async () => {
  const result = await requestJson(\`/api/activity?days=\${filters.days}\`);
  if (!result.ok || !result.data) {
    qs("activity-feed").innerHTML = \`<p class="empty">\${escapeHtml(t.couldNotLoadActivity(errorText(result)))}</p>\`;
    qs("activity-count").textContent = "";
    return;
  }
  activity = result.data;
  suspects = findSuspectEntries(activity.entries);
  showPath("logs-path", activity.logsDir ?? "", activity.logsDir ? "" : t.notAvailable);
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
  const names = request.dropped.map((field) => reportFieldNames[field] ?? field).join(t.reportFieldJoiner);
  notify(t.reportTooLong, "error", await copying ? t.reportFieldCopied(names, request.dropped.length) : t.reportFieldLeftOut(names, request.dropped.length));
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

// src/core/decision.ts
var BLOCK_INTENTS = Object.freeze([
  "hard_stop",
  "use_alternative",
  "scope_down",
  "manual_only",
  "stop_and_explain"
]);

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
var MAX_REASON_LENGTH = 256;
var SHELL_WRAPPERS = new Set(["bash", "sh", "zsh", "ksh", "dash", "fish", "csh", "tcsh"]);
var INTERPRETERS = new Set(["python", "python3", "python2", "node", "ruby", "perl"]);
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
var REQUEST_CLIENT_COMMANDS = new Set([
  "curl",
  "wget",
  "aria2c",
  "http",
  "https",
  "xh",
  "xhs",
  "httpie",
  "fetch",
  "lwp-request",
  "nc",
  "ncat",
  "netcat",
  "socat",
  "telnet"
]);

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

// src/core/budget.ts
var REASON_COMMAND_ANALYSIS_LIMIT = "CC Safety Net could not analyze the command because it exceeds safe analysis limits. Simplify or split the command and retry.";
var REASON_RECURSION_LIMIT = "Command exceeds maximum recursion depth and cannot be safely analyzed. Flatten the nesting and retry.";
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
  scriptFiles: { cap: 64, ...DERIVED },
  controlFlowStates: { cap: 64, ...DERIVED },
  wrapperPeelIterations: { cap: 20, ...DERIVED },
  derivedCommandShape: DERIVED
});

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
  const excerpt = (text) => text.length > maxLen ? \`\${text.slice(0, maxLen)}...\` : text;
  return [
    input.askUser ? "CC Safety Net could not verify this command" : "BLOCKED by CC Safety Net",
    \`Reason: \${redact(input.reason)}\`,
    input.ruleId ? \`Rule: \${input.ruleId}\` : undefined,
    input.toolName ? \`Tool: \${input.toolName}\` : undefined,
    input.command ? \`Command: \${excerpt(redact(input.command))}\` : undefined,
    input.segment && input.segment !== input.command ? \`Segment: \${excerpt(redact(input.segment))}\` : undefined,
    input.cwd ? \`Working directory: \${excerpt(redact(input.cwd))}\` : undefined,
    input.configWarning ? \`Config warning: \${redact(input.configWarning)}\` : undefined,
    input.askUser ? "Approve only if you expected this command." : FOOTERS[input.intent ?? "manual_only"]
  ].filter((line) => line !== undefined).join(\`

\`);
}

// src/gui/frontend/rule-messages.ts
var intentLabels = (t) => ({
  hard_stop: t.intentHardStop,
  use_alternative: t.intentUseAlternative,
  scope_down: t.intentScopeDown,
  manual_only: t.intentManualOnly,
  stop_and_explain: t.intentStopAndExplain
});
var withRuleMessage = (messages, ruleId, reason, intent) => {
  const next = { ...messages };
  const trimmed = reason.trim();
  const chosenIntent = BLOCK_INTENTS.find((candidate) => candidate === intent);
  if (trimmed)
    next[ruleId] = { reason: trimmed, ...chosenIntent ? { intent: chosenIntent } : {} };
  if (!trimmed)
    delete next[ruleId];
  return Object.keys(next).length > 0 ? next : undefined;
};
var messagesWithinLimit = (messages) => {
  const kept = Object.entries(messages ?? {}).filter(([, message]) => message.reason.length <= MAX_REASON_LENGTH);
  return kept.length > 0 ? Object.fromEntries(kept) : undefined;
};
var blockMessagePreview = (options) => {
  const reason = options.message?.reason ?? options.builtIn.reason;
  const text = formatBlockedMessage({
    reason,
    ruleId: options.ruleId,
    intent: options.message?.intent ?? options.builtIn.intent,
    command: options.command
  });
  const reasonStart = text.indexOf(\`Reason: \${reason}\`) + "Reason: ".length;
  const footerStart = text.lastIndexOf(\`

\`) + 2;
  return [
    { text: text.slice(0, reasonStart), custom: false },
    { text: reason, custom: options.message !== undefined },
    { text: text.slice(reasonStart + reason.length, footerStart), custom: false },
    { text: text.slice(footerStart), custom: options.message?.intent !== undefined }
  ];
};

// src/gui/frontend/shortcuts.ts
var textEntryTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);
var isSearchShortcut = (event, target) => event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !textEntryTags.has(target.tagName) && !target.isContentEditable;

// src/gui/frontend/views/policy.ts
var secretCategoryNames = {
  Basename: t.secretCategoryBasename,
  Pattern: t.secretCategoryPattern,
  "Home path": t.secretCategoryHomePath,
  Variant: t.secretCategoryVariant,
  Extension: t.secretCategoryExtension,
  "Extension pattern": t.secretCategoryExtensionPattern,
  "Coding CLI credential": t.secretCategoryCredential,
  "Coding CLI config": t.secretCategoryConfig
};
var presets = safetyLevels(t);
var capabilities = capabilityNames(t);
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
var openMessageEditors = new Set;
var builtInReasons = new Map;
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
  destructive_command_protection: {
    enabled: draftPolicy.destructive_command_protection.enabled,
    overrides: draftPolicy.destructive_command_protection.overrides,
    messages: draftPolicy.destructive_command_protection.messages,
    allow_paths: draftPolicy.destructive_command_protection.allow_paths
  },
  secret_protection: {
    enabled: draftPolicy.secret_protection.enabled,
    overrides: draftPolicy.secret_protection.overrides,
    messages: draftPolicy.secret_protection.messages,
    deny_paths: draftPolicy.secret_protection.deny_paths,
    allow_paths: draftPolicy.secret_protection.allow_paths
  },
  audit: draftPolicy.audit
});
var withoutOverlongMessages = (collected) => ({
  ...collected,
  destructive_command_protection: {
    ...collected.destructive_command_protection,
    messages: messagesWithinLimit(collected.destructive_command_protection.messages)
  },
  secret_protection: {
    ...collected.secret_protection,
    messages: messagesWithinLimit(collected.secret_protection.messages)
  }
});
var effectivePreviewPolicy = (collected) => {
  const policy = withoutOverlongMessages(collected);
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
    return \`<span class="project-chip inherited">\${escapeHtml(t.inheritedChip)}</span>\`;
  return \`<button type="button" class="project-chip" data-unmark-field="\${escapeHtml(field)}" title="\${escapeHtml(t.projectChipTitle)}" aria-label="\${escapeHtml(t.projectChipLabel(field))}">\${escapeHtml(t.projectChip)}</button>\`;
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
    saved && !saved.policy.destructive_command_protection.enabled ? t.commandProtectionOffBanner : null,
    saved && !saved.policy.secret_protection.enabled ? t.secretProtectionOffBanner : null,
    saved?.configState && saved.configState.state !== "ready" ? t.fallbackConfigBanner(saved.configState.reason) : null
  ].filter((notice) => notice !== null);
  qs("protection-banner").innerHTML = notices.map((notice) => \`<p>\${escapeHtml(notice)}</p>\`).concat(notices.length > 0 && !location.hash.startsWith("#policy") ? [\`<a href="#policy">\${escapeHtml(t.openProtections)}</a>\`] : []).join("");
  qs("protection-banner").hidden = notices.length === 0;
};
var savedComparisonPolicy = () => projectDraft ? overlayProjectProposal(projectDraft.baseline, JSON.parse(projectDraft.snapshot)) : state?.policy;
var messageTooLong = () => !projectDraft && [draftPolicy.destructive_command_protection, draftPolicy.secret_protection].some((section) => Object.values(section.messages ?? {}).some((message) => message.reason.length > MAX_REASON_LENGTH));
var renderSavebar = () => {
  qs("policy-savebar").hidden = !shared.dirty;
  qs("save").textContent = projectDraft ? t.reviewAndApply : t.save;
  if (!shared.dirty || !state)
    return;
  const changes = policyChanges(savedComparisonPolicy(), draftPolicy, ruleLabels(), t);
  qs("savebar-title").textContent = changes.length === 0 ? t.unsavedChanges : t.unsavedChangeCount(changes.length);
  qs("savebar-summary").textContent = messageTooLong() ? t.blockMessageTooLong(MAX_REASON_LENGTH) : changes.slice(0, 3).join(t.changeSeparator) + (changes.length > 3 ? t.moreChanges(changes.length - 3) : "");
};
var syncRawFromForm = () => {
  if (state?.errors.length)
    return;
  qs("raw").value = \`\${JSON.stringify(projectDraft ? collectProjectProposal(markedFields, draftPolicy) : collectFormPolicy(), null, 2)}
\`;
  qs("raw-source").textContent = projectDraft ? t.rawProjectFields(projectDraft.path) : t.rawReadOnly;
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
  qs("save").disabled = busy2 || !state || hasErrors || messageTooLong();
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
var messageTarget = (ruleId) => {
  const destructive = state?.destructiveCommandRules.find((rule) => rule.id === ruleId);
  if (destructive)
    return { section: "destructive_command_protection", rule: destructive };
  const secret = state?.secretPatterns.find((rule) => rule.id === ruleId);
  return secret ? { section: "secret_protection", rule: secret } : undefined;
};
var ruleMessage = (target) => projectDraft ? undefined : draftPolicy[target.section].messages?.[target.rule.id];
var hasRuleMessage = (ruleId) => {
  const target = messageTarget(ruleId);
  return target !== undefined && ruleMessage(target) !== undefined;
};
var customMessageCount = (rules) => {
  const messages = rules.filter((rule) => hasRuleMessage(rule.id)).length;
  return messages > 0 ? \` · \${t.customMessageCount(messages)}\` : "";
};
var messageEditorHtml = (target, ruleOff) => {
  const id = escapeHtml(target.rule.id);
  const labels = intentLabels(t);
  const builtInIntent = "intent" in target.rule ? target.rule.intent : state?.secretDenial.intent;
  const message = ruleMessage(target);
  return \`<div class="message-editor" data-message-editor>
    <div class="message-fields">
      <div class="field">
        <div class="message-field-top"><label class="field-label" for="message-reason-\${id}">\${escapeHtml(t.ruleMessageLabel)}</label><span class="message-counter" data-message-counter></span></div>
        <textarea id="message-reason-\${id}" data-message-reason spellcheck="true">\${escapeHtml(message?.reason ?? "")}</textarea>
        <p class="field-error" data-message-error hidden></p>
        <small class="message-builtin" data-message-builtin hidden><span data-message-builtin-text></span><button type="button" class="quiet small" data-message-use-builtin>\${escapeHtml(t.ruleMessageUseBuiltIn)}</button></small>
      </div>
      <div class="field">
        <label class="field-label" for="message-intent-\${id}">\${escapeHtml(t.ruleMessageIntentLabel)}</label>
        <select id="message-intent-\${id}" data-message-intent>
          <option value="">\${escapeHtml(t.ruleMessageIntentBuiltIn(builtInIntent ? labels[builtInIntent] : ""))}</option>
          \${BLOCK_INTENTS.map((intent) => \`<option value="\${intent}" \${message?.intent === intent ? "selected" : ""}>\${escapeHtml(labels[intent])}</option>\`).join("")}
        </select>
        <small>\${escapeHtml(t.ruleMessageIntentHelp)}</small>
      </div>
    </div>
    <div class="message-preview"><span class="field-label">\${escapeHtml(t.ruleMessagePreview)}</span><pre data-message-preview></pre></div>
    <div class="message-foot">
      <small>\${escapeHtml(ruleOff ? t.ruleMessageRuleOff : t.ruleMessageFootnote)}\${target.rule.id === "raw-text.dangerous-command" ? \` \${escapeHtml(t.ruleMessageAskNote(t.presetStrict))}\` : ""}</small>
      <div><button type="button" class="danger-quiet" data-message-remove>\${escapeHtml(t.ruleMessageRemove)}</button><button type="button" data-message-toggle="\${id}">\${escapeHtml(t.done)}</button></div>
    </div>
  </div>\`;
};
var messageRowParts = (ruleId, ruleOff) => {
  const target = messageTarget(ruleId);
  if (projectDraft || !target)
    return { open: false, note: "", told: "", button: "", editor: "" };
  const id = escapeHtml(ruleId);
  const message = ruleMessage(target);
  const open = openMessageEditors.has(ruleId);
  return {
    open,
    note: \`<span class="rule-note changed" data-message-note \${message ? "" : "hidden"}>\${escapeHtml(t.customMessageNote)}</span>\`,
    told: message && !open ? \`<button type="button" class="rule-told" data-message-toggle="\${id}"><b>\${escapeHtml(t.agentIsTold)}</b><span>\${escapeHtml(message.reason)}</span></button>\` : "",
    button: \`<button type="button" class="info-button message-button\${message ? " has-message" : ""}" data-message-toggle="\${id}" aria-expanded="\${open}" aria-label="\${escapeHtml(t.blockMessageFor(target.rule.label))}" title="\${escapeHtml(t.blockMessage)}">\${icons.message}</button>\`,
    editor: open ? messageEditorHtml(target, ruleOff) : ""
  };
};
var messagePart = (row, name) => row.querySelector(\`[data-message-\${name}]\`);
var syncMessageEditor = (row) => {
  const target = messageTarget(row.dataset.ruleRow ?? "");
  if (!target || !state)
    return;
  const message = ruleMessage(target);
  const builtInReason = target.section === "secret_protection" ? state.secretDenial.reason : builtInReasons.get(target.rule.id);
  messagePart(row, "note").hidden = !message;
  row.querySelector(".message-button")?.classList.toggle("has-message", message !== undefined);
  const textarea = messagePart(row, "reason");
  textarea.placeholder = builtInReason ?? "";
  const excess = textarea.value.trim().length - MAX_REASON_LENGTH;
  messagePart(row, "counter").textContent = \`\${textarea.value.trim().length} / \${MAX_REASON_LENGTH}\`;
  messagePart(row, "counter").classList.toggle("over", excess > 0);
  messagePart(row, "error").hidden = excess <= 0;
  messagePart(row, "error").textContent = t.shortenMessage(excess);
  messagePart(row, "builtin").hidden = builtInReason === undefined;
  messagePart(row, "builtin-text").textContent = t.ruleMessageBuiltIn(builtInReason ?? "");
  messagePart(row, "intent").disabled = !message;
  messagePart(row, "remove").hidden = !message;
  messagePart(row, "preview").innerHTML = blockMessagePreview({
    ruleId: target.rule.id,
    command: "example" in target.rule ? target.rule.example : undefined,
    builtIn: {
      reason: builtInReason ?? t.ruleMessageBuiltInVaries,
      intent: "intent" in target.rule ? target.rule.intent : state.secretDenial.intent
    },
    message
  }).map((part) => part.custom ? \`<mark>\${escapeHtml(part.text)}</mark>\` : escapeHtml(part.text)).join("");
};
var loadBuiltInReason = async (rule) => {
  if (builtInReasons.has(rule.id))
    return;
  const policy = effectivePreviewPolicy(collectFormPolicy());
  const result = await requestJson("/api/policy/explain", {
    method: "POST",
    body: JSON.stringify({
      command: rule.example,
      policy: {
        ...policy,
        destructive_command_protection: {
          ...policy.destructive_command_protection,
          enabled: true,
          overrides: rule.catastrophic ? {} : { [rule.id]: "on" },
          messages: undefined
        }
      }
    })
  });
  if (!result.ok || result.data.ruleId !== rule.id)
    return;
  builtInReasons.set(rule.id, result.data.reason);
  const row = document.querySelector(\`[data-rule-row="\${CSS.escape(rule.id)}"]\`);
  if (row?.querySelector("[data-message-editor]"))
    syncMessageEditor(row);
};
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
var ruleRowHtml = (row) => {
  const message = messageRowParts(row.id, row.ruleOff);
  return \`<li class="rule-row\${row.disabled ? " row-disabled" : ""}\${message.open ? " message-open" : ""}" data-rule-row="\${escapeHtml(row.id)}">
    \${row.control}
    <div class="rule-body">
      <div class="rule-line">\${row.heading}\${row.note ? \`<span class="rule-note \${row.noteTone}">\${escapeHtml(row.note)}</span>\` : ""}\${message.note}\${row.actions}</div>
      \${row.description ? \`<p class="rule-description">\${escapeHtml(row.description)}</p>\` : ""}
      \${message.told}
    </div>
    \${message.button}\${row.info}
    \${message.editor}
  </li>\`;
};
var offCount = (off) => off > 0 ? \` · <span class="off-count">\${escapeHtml(t.offCount(off))}</span>\` : "";
var renderDestructiveCommands = () => {
  if (!state || !preview)
    return;
  const effectiveState = preview;
  const query = searchQuery();
  const disabled = !draftPolicy.destructive_command_protection.enabled;
  qs("destructive-panel").classList.toggle("is-off", disabled);
  const visible = state.destructiveCommandRules.filter((rule) => matches(query, [
    rule.category,
    rule.label,
    rule.id,
    rule.description,
    projectDraft ? undefined : draftPolicy.destructive_command_protection.messages?.[rule.id]?.reason
  ]) && (!showChangedOnly || destructiveChanged(rule) || hasRuleMessage(rule.id)));
  const rowHtml = (rule) => {
    const info = \`<button type="button" class="info-button" data-rule-example="\${escapeHtml(rule.id)}" aria-label="\${escapeHtml(t.aboutRule(rule.label))}" aria-haspopup="dialog" aria-controls="rule-example-popover">\${icons.info}</button>\`;
    const heading = \`<span class="rule-name">\${escapeHtml(rule.label)}</span><code class="rule-id">\${escapeHtml(rule.id)}</code>\${tierForRule(rule) === "normal" ? "" : \`<span class="tier-badge \${tierForRule(rule)}">\${escapeHtml(tierForRule(rule) === "strict" ? t.presetStrict : t.presetParanoid)}</span>\`}\`;
    if (rule.catastrophic)
      return ruleRowHtml({
        id: rule.id,
        control: \`<span class="lock" title="\${escapeHtml(t.alwaysOn)}">\${icons.lock}</span>\`,
        heading,
        note: null,
        noteTone: "",
        actions: "",
        description: rule.description,
        info,
        disabled: false,
        ruleOff: false
      });
    const effective = effectiveState.rules[rule.id];
    if (!effective)
      return "";
    const override = draftPolicy.destructive_command_protection.overrides[rule.id] !== undefined;
    return ruleRowHtml({
      id: rule.id,
      control: \`<input type="checkbox" class="switch" data-destructive-command-active="\${escapeHtml(rule.id)}" \${effective.enabled ? "checked" : ""} \${disabled ? "disabled" : ""} aria-label="\${escapeHtml(rule.label)}">\`,
      heading,
      note: ruleNote(rule, effective, effectiveState.capabilities, t),
      noteTone: effective.source === "rule_override" ? "changed" : effective.source === "capability_override" || effective.source === "environment" ? "" : tierForRule(rule),
      actions: \`\${override ? \`<button type="button" class="quiet small" data-use-inherited="\${escapeHtml(rule.id)}">\${escapeHtml(t.reset)}</button>\` : ""}\${projectFieldChip(\`destructive_command_protection.overrides.\${rule.id}\`)}\`,
      description: rule.description,
      info,
      disabled,
      ruleOff: disabled || !effective.enabled
    });
  };
  qs("destructive-command-rules").innerHTML = visible.length === 0 ? \`<p class="empty">\${escapeHtml(t.noCommandProtectionMatch)}</p>\` : commandRuleGroups(visible, t).map((group) => {
    const all = commandRuleGroups(state?.destructiveCommandRules ?? [], t).find((entry) => entry.key === group.key)?.rules ?? [];
    const off = all.filter((rule) => effectiveState.rules[rule.id]?.enabled === false).length;
    return categoryHtml({
      key: \`destructive:\${group.key}\`,
      title: group.title,
      counts: group.key === "always-on" ? escapeHtml(\`\${t.ruleCount(all.length)} · \${t.cannotTurnOff}\`) : \`\${escapeHtml(t.ruleCount(all.length))}\${offCount(off)}\`,
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
  qs("secret-panel").classList.toggle("is-off", disabled);
  const visible = loaded.secretPatterns.filter((rule) => matches(query, [
    rule.category,
    secretCategoryNames[rule.category],
    rule.label,
    rule.id,
    rule.description,
    ...rule.paths ?? [],
    projectDraft ? undefined : draftPolicy.secret_protection.messages?.[rule.id]?.reason
  ]) && (!showChangedOnly || secretChanged(rule) || hasRuleMessage(rule.id)));
  const rowHtml = (rule) => {
    const active = secretRuleIsActive(rule, overrides);
    const override = overrides[rule.id] !== undefined;
    return ruleRowHtml({
      id: rule.id,
      control: \`<input type="checkbox" class="switch" data-secret-active="\${escapeHtml(rule.id)}" \${active ? "checked" : ""} \${disabled ? "disabled" : ""} aria-label="\${escapeHtml(rule.label)}">\`,
      heading: \`<span class="rule-name">\${escapeHtml(rule.label)}</span>\`,
      note: override ? t.changedByYou : rule.defaultOff ? t.offByDefault : null,
      noteTone: override ? "changed" : "",
      actions: \`\${override ? \`<button type="button" class="quiet small" data-secret-reset="\${escapeHtml(rule.id)}">\${escapeHtml(t.reset)}</button>\` : ""}\${projectFieldChip(\`secret_protection.overrides.\${rule.id}\`)}\`,
      description: rule.description ?? (rule.paths ? t.pathCount(rule.paths.length) : ""),
      info: rule.paths ? \`<button type="button" class="info-button" data-secret-paths="\${escapeHtml(rule.id)}" aria-label="\${escapeHtml(t.protectedPathsFor(rule.label))}" aria-haspopup="dialog" aria-controls="rule-example-popover">\${icons.info}</button>\` : '<span class="info-spacer"></span>',
      disabled,
      ruleOff: disabled || !active
    });
  };
  qs("secret-patterns").innerHTML = visible.length === 0 ? \`<p class="empty">\${escapeHtml(t.noSecretProtectionMatch)}</p>\` : groupRules(visible).map((group) => {
    const all = loaded.secretPatterns.filter((rule) => rule.category === group.category);
    const on = all.filter((rule) => secretRuleIsActive(rule, overrides)).length;
    const title = secretCategoryNames[group.category] ?? group.category;
    return categoryHtml({
      key: \`secret:\${group.category}\`,
      title,
      counts: \`\${escapeHtml(t.ruleCount(all.length))}\${offCount(on === 0 ? 0 : all.length - on)}\`,
      bulkSwitch: \`<input type="checkbox" class="switch" data-secret-group-active="\${escapeHtml(group.category)}" \${on > 0 ? "checked" : ""} \${disabled ? "disabled" : ""} aria-label="\${escapeHtml(t.toggleGroup(title))}" title="\${escapeHtml(t.toggleAll)}">\`,
      rowsHtml: group.rules.map(rowHtml).join("")
    });
  }).join("");
};
var renderChangedCount = () => {
  if (!state)
    return;
  const changed = state.destructiveCommandRules.filter((rule) => !rule.catastrophic && destructiveChanged(rule) || hasRuleMessage(rule.id)).length + state.secretPatterns.filter((rule) => secretChanged(rule) || hasRuleMessage(rule.id)).length;
  qs("changed-count").textContent = changed > 0 ? String(changed) : "";
};
var renderRuleSummaries = () => {
  if (!state || !preview)
    return;
  const secretOff = state.secretPatterns.filter((rule) => !secretRuleIsActive(rule, draftPolicy.secret_protection.overrides)).length;
  qs("destructive-command-summary").textContent = draftPolicy.destructive_command_protection.enabled ? t.commandRuleSummary(preview.counts.enabled, preview.counts.disabled, state.destructiveCommandRules.filter((rule) => rule.catastrophic).length) + customMessageCount(state.destructiveCommandRules) : t.commandProtectionOffSummary;
  qs("secret-summary").textContent = draftPolicy.secret_protection.enabled ? t.secretRuleSummary(state.secretPatterns.length - secretOff, secretOff) + customMessageCount(state.secretPatterns) : t.secretProtectionOffSummary;
  renderChangedCount();
};
var renderRules = () => {
  const focused = document.activeElement;
  const typing = focused instanceof HTMLTextAreaElement && "messageReason" in focused.dataset ? {
    id: focused.id,
    value: focused.value,
    start: focused.selectionStart,
    end: focused.selectionEnd
  } : null;
  renderDestructiveCommands();
  renderSecretPatterns();
  renderRuleSummaries();
  const redrawn = typing && document.getElementById(typing.id);
  if (typing && redrawn instanceof HTMLTextAreaElement) {
    redrawn.value = typing.value;
    redrawn.focus();
    redrawn.setSelectionRange(typing.start, typing.end);
  }
  document.querySelectorAll("[data-message-editor]").forEach((editor) => {
    syncMessageEditor(editor.closest("[data-rule-row]"));
  });
};
var toggleMessageEditor = (ruleId, open) => {
  const target = messageTarget(ruleId);
  if (!target || projectDraft)
    return;
  if (open)
    openMessageEditors.add(ruleId);
  if (!open)
    openMessageEditors.delete(ruleId);
  renderRules();
  if (!open)
    return;
  document.getElementById(\`message-reason-\${ruleId}\`)?.focus();
  if ("example" in target.rule)
    loadBuiltInReason(target.rule);
};
var updateMessageFromEditor = (row) => {
  const target = messageTarget(row.dataset.ruleRow ?? "");
  if (!target)
    return;
  draftPolicy[target.section].messages = withRuleMessage(draftPolicy[target.section].messages, target.rule.id, messagePart(row, "reason").value, messagePart(row, "intent").value);
  syncMessageEditor(row);
  renderRuleSummaries();
  afterEdit(false);
};
var renderSafety = () => {
  const environmentSources = preview ? [
    ...new Set(Object.values(preview.capabilities).filter((capability) => capability.source === "environment").flatMap((capability) => capability.sources.filter((source) => source.startsWith("env "))))
  ] : [];
  qs("environment-overrides").hidden = environmentSources.length === 0;
  qs("environment-overrides").textContent = environmentSources.length ? t.environmentRaises(environmentSources.map((source) => source.slice(4)).join(", ")) : "";
  qs("safety-level").innerHTML = Object.entries(presets).map(([level, meta]) => \`<label class="preset-card preset-\${level}"><input type="radio" name="safety-level" value="\${level}" \${draftPolicy.safety.level === level ? "checked" : ""}><span class="preset-name">\${escapeHtml(meta[0])}</span><span class="preset-description">\${escapeHtml(meta[1])}</span></label>\`).join("");
  const inherited = SAFETY_LEVEL_CAPABILITIES[draftPolicy.safety.level];
  qs("safety-overrides").innerHTML = Object.entries(capabilities).map(([key, meta]) => {
    const value = draftPolicy.safety.overrides[key];
    return \`<div class="setting-row"><label class="setting-text" for="override-\${key}"><strong>\${escapeHtml(meta[0])}</strong><small>\${escapeHtml(meta[1])}</small></label>\${projectFieldChip(\`safety.overrides.\${key}\`)}<select id="override-\${key}" data-safety-override="\${key}">
      <option value="inherit" \${value === undefined ? "selected" : ""}>\${escapeHtml(t.fromPresetOption(inherited[key]))}</option>
      <option value="true" \${value === true ? "selected" : ""}>\${escapeHtml(t.alwaysOn)}</option>
      <option value="false" \${value === false ? "selected" : ""}>\${escapeHtml(t.alwaysOff)}</option>
    </select></div>\`;
  }).join("");
  qs("workflow").innerHTML = \`<div class="setting-row"><label class="setting-text" for="workflow-worktree"><strong>\${escapeHtml(t.worktreeDiscard)}</strong><small>\${escapeHtml(t.worktreeDiscardHelp)}</small></label>\${projectFieldChip("workflow.worktree_mode")}<input type="checkbox" class="switch" id="workflow-worktree" data-workflow-worktree \${draftPolicy.workflow.worktree_mode ? "checked" : ""}></div>\`;
  const customized = (preview?.counts.effectiveCustomizations ?? 0) > 0 || Object.entries(draftPolicy.safety.overrides).some(([key, value]) => value !== SAFETY_LEVEL_CAPABILITIES[draftPolicy.safety.level][key]);
  qs("safety-preset-status").textContent = customized ? t.presetCustomized(levelName(draftPolicy.safety.level, t)) : "";
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
  const result = await requestPolicyPreview(withoutOverlongMessages(candidate));
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
          <button type="button" class="quiet icon-only" data-path-list="\${prefix}" data-path-remove="\${index}" \${disabled ? "disabled" : ""} aria-label="\${escapeHtml(t.removePath(path))}">\${icons.remove}</button>
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
        setHint(t.notAdded(additions.join(", "), error));
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
    setHint(duplicates.length ? t.alreadyListed(duplicates.join(", ")) : "");
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
    notify(t.previewFailed, "error", errorText(result));
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
    el.textContent = t.couldNotTest(errorText(result));
    return;
  }
  if (result.data.result === "allowed") {
    el.className = "notice ok";
    el.innerHTML = \`\${t.testerAllowed} <a href="#rules?compose=\${encodeURIComponent(command)}">\${escapeHtml(t.createRuleToBlock)}</a>\`;
    return;
  }
  const ruleId = result.data.customRule?.id ?? result.data.ruleId;
  const ruleHtml = !ruleId ? "" : result.data.customRule ? \`<a class="rule-id" href="#rules?focus=\${encodeURIComponent(ruleId)}">\${escapeHtml(ruleId)}</a>\` : \`<a class="rule-id" href="#policy?q=\${encodeURIComponent(ruleId)}">\${escapeHtml(ruleId)}</a>\`;
  el.className = "notice error";
  el.innerHTML = \`\${t.testerBlocked(ruleHtml)} \${escapeHtml(result.data.reason || "")}\${ruleId && !result.data.customRule && !projectDraft && messageTarget(ruleId) ? \` <a href="#policy?q=\${encodeURIComponent(ruleId)}&message=1">\${escapeHtml(t.editBlockMessage)}</a>\` : ""}\${result.data.segment && result.data.segment !== command ? \`<div class="tester-segment">\${escapeHtml(t.blockedPart)} <code>\${escapeHtml(result.data.segment)}</code></div>\` : ""}\`;
};
var render2 = () => {
  if (!state)
    return;
  const loaded = state;
  draftPolicy = clonePolicy(loaded.policy);
  preview = loaded.preview;
  shared.dirty = false;
  qs("policy-savebar").hidden = true;
  showPath("policy-path", loaded.path, loaded.exists ? "" : t.notCreatedYet);
  const projectPolicy = loaded.projectPolicy;
  qs("project-policy-row").hidden = !projectPolicy;
  showPath("project-policy-path", projectPolicy?.path ?? "");
  qs("project-policy-notice").hidden = !projectPolicy || projectPolicy.weakenings.length === 0;
  qs("project-policy-notice").textContent = projectPolicy ? [t.projectPolicyChanges, ...projectPolicy.weakenings].join(\`
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
    qs("raw-source").textContent = t.rawOnDisk;
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
  const isPolicyShape = isRecordField(parsed) && isRecordField(parsed.safety) && typeof parsed.safety.level === "string" && Object.hasOwn(presets, parsed.safety.level) && isRecordField(parsed.safety.overrides) && isRecordField(parsed.workflow) && isRecordField(parsed.destructive_command_protection) && isRecordField(parsed.destructive_command_protection.overrides) && isOptionalPathList(parsed.destructive_command_protection.allow_paths) && isRecordField(parsed.secret_protection) && isRecordField(parsed.secret_protection.overrides) && isOptionalPathList(parsed.secret_protection.deny_paths) && isOptionalPathList(parsed.secret_protection.allow_paths) && isRecordField(parsed.audit);
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
  notify(t.restoredDraft, "ok");
};
var loadPolicy = async () => {
  const result = await requestJson("/api/policy");
  if (!result.ok || !result.data) {
    notify(t.couldNotLoadPolicy, "error", errorText(result));
    return false;
  }
  state = result.data;
  shared.policy = state;
  render2();
  restoreDraft();
  if (state.errors.length)
    notify(t.statusRepair, "error");
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
  qs("save").textContent = projectDraft ? t.reviewAndApply : t.save;
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
    notify(t.projectPolicyUnavailable, "error", errorText(result));
    return false;
  }
  const seeded = seedProjectDraft(result.data);
  if (!seeded) {
    exitProjectDraft();
    await loadPolicy();
    notify(t.repairFirst, "error", [
      t.repairBeforeProject,
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
    notify(t.policyNotLoaded, "error", t.reloadPage);
    return;
  }
  if (state.errors.length) {
    notify(t.repairFirst, "error");
    return;
  }
  if (shared.dirty) {
    if (!await confirmDialog({
      title: t.discardUnsavedTitle,
      body: t.discardBeforeProject,
      confirmLabel: t.discardChanges,
      confirmClass: ""
    }))
      return;
    sessionStorage.removeItem("cc-safety-net-draft");
    if (!await loadPolicy())
      return;
  }
  await ingestProjectState(t.editingProjectPolicy);
};
var confirmDiscardProjectDraft = async (body) => !shared.dirty || await confirmDialog({
  title: t.discardDraftTitle,
  body,
  confirmLabel: t.discardDraft,
  confirmClass: ""
});
var changeProjectDirectory = async () => {
  if (!await confirmDiscardProjectDraft(t.switchFolderDiscards))
    return;
  const result = await requestJson("/api/policy/project/choose-directory", { method: "POST" });
  if (!result.ok) {
    notify(t.folderPickerFailed, "error", errorText(result));
    return;
  }
  if (result.data.error) {
    notify(result.data.error, "error");
    return;
  }
  if (result.data.cancelled)
    return;
  await ingestProjectState(t.editingProjectPolicy);
};
var leaveProjectDraft = async () => {
  if (!projectDraft)
    return;
  if (!await confirmDiscardProjectDraft(t.projectChangesUnwritten))
    return;
  exitProjectDraft();
  if (await loadPolicy())
    notify(t.backToOwnPolicy, "ok");
};
var discardProjectDraft = async (draft) => {
  if (!await confirmDialog({
    title: t.discardDraftChangesTitle,
    body: t.discardDraftChangesBody,
    confirmLabel: t.discardChanges,
    confirmClass: ""
  }))
    return;
  const snapshot = JSON.parse(draft.snapshot);
  markedFields = new Set(projectMarkedFields(snapshot));
  draftPolicy = overlayProjectProposal(draft.baseline, snapshot);
  renderPolicySections();
  refreshPolicyPreview();
  notify(t.changesDiscarded, "ok");
};
var handleStaleProjectDraft = async () => {
  if (!await ingestProjectState(t.projectDraftReloaded))
    return;
  notify(t.projectFolderChanged, "error", t.projectFolderChangedBody);
};
var projectDiffHtml = (data) => {
  const rows = Array.isArray(data.rows) ? data.rows : [];
  const warnings = [
    ...data.existingFileDiagnostics?.length ? [t.invalidProjectFile] : [],
    ...data.weakenings ?? []
  ];
  return (rows.length === 0 ? \`<p class="empty">\${escapeHtml(t.noEffectiveChange)}</p>\` : \`<table class="diff-table"><thead><tr><th>\${escapeHtml(t.diffSetting)}</th><th>\${escapeHtml(t.diffNow)}</th><th>\${escapeHtml(t.diffAfter)}</th></tr></thead><tbody>\${rows.map((row) => \`<tr><td><code>\${escapeHtml(row.field)}</code></td><td class="diff-before">\${escapeHtml(row.before ?? t.unset)}</td><td class="diff-after">\${escapeHtml(row.after ?? t.unset)}</td></tr>\`).join("")}</tbody></table>\`) + warnings.map((text) => \`<p class="notice warn">\${escapeHtml(text)}</p>\`).join("");
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
    notify(t.reviewFailed, "error", errorText(diff));
    return;
  }
  if (JSON.stringify(collectProjectProposal(markedFields, draftPolicy)) !== serialized) {
    notify(t.reviewAgain, "error", t.draftChangedDuringReview);
    return;
  }
  if (!await confirmDialog({
    title: t.applyProjectTitle,
    body: t.applyProjectBody,
    detail: draft.path,
    rowsHtml: projectDiffHtml(diff.data),
    confirmLabel: t.applyProject,
    confirmClass: "primary"
  }))
    return;
  await runExclusive(t.applyingStatus, async () => {
    const applied = await requestJson("/api/policy/project/apply", { method: "POST", body });
    if (applied.status === 409) {
      await handleStaleProjectDraft();
      return;
    }
    if (!isWriteSuccess(applied)) {
      notify(t.applyFailed, "error", errorText(applied));
      return;
    }
    exitProjectDraft();
    if (await loadPolicy())
      notify(t.projectApplied, "ok", applied.data.path);
  });
};
var save = () => {
  if (!state) {
    notify(t.policyNotLoaded, "error", t.reloadPage);
    return;
  }
  if (state.errors.length) {
    notify(t.repairBeforeSaving, "error");
    return;
  }
  if (projectDraft) {
    reviewProjectDraft(projectDraft);
    return;
  }
  if (!shared.dirty)
    return;
  const policy = collectFormPolicy();
  runExclusive(t.savingStatus, async () => {
    const result = await writePolicy("/api/policy", JSON.stringify(policy), t.saveFailed);
    if (result && await reloadAfterWrite())
      notify(t.policySaved, "ok", result.data.path);
  });
};
var discard = async () => {
  if (projectDraft) {
    await discardProjectDraft(projectDraft);
    return;
  }
  if (!await confirmDialog({
    title: t.discardUnsavedTitle,
    body: t.discardUnsavedBody,
    confirmLabel: t.discardChanges,
    confirmClass: ""
  }))
    return;
  await runExclusive(t.discardingStatus, async () => {
    sessionStorage.removeItem("cc-safety-net-draft");
    if (await loadPolicy())
      notify(t.changesDiscarded, "ok");
  });
};
var repair = async () => {
  if (!state?.errors.length)
    return;
  if (!await confirmDialog({
    title: t.repairTitle,
    body: t.repairBody,
    detail: state.path,
    confirmLabel: t.repair,
    confirmClass: "primary"
  }))
    return;
  await runExclusive(t.repairingStatus, async () => {
    const result = await writePolicy("/api/repair", "{}", t.repairFailed);
    if (result && await reloadAfterWrite())
      notify(t.policyRepaired, "ok", result.data.path);
  });
};
var resetOverrides = async (section) => {
  if (Object.keys(draftPolicy[section].overrides).length === 0) {
    notify(t.nothingToReset, "ok");
    return;
  }
  if (!await confirmDialog({
    title: t.resetRulesTitle,
    body: t.resetRulesBody(section === "secret_protection"),
    confirmLabel: t.resetRules
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
    title: secret ? t.turnOffSecretTitle : t.turnOffCommandTitle,
    body: secret ? t.turnOffSecretBody : t.turnOffCommandBody,
    detail: secret ? undefined : t.catastrophicStillApply,
    confirmLabel: t.turnOff
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
  if ("messageIntent" in control.dataset) {
    updateMessageFromEditor(control.closest("[data-rule-row]"));
    return;
  }
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
  const messageToggle = target.closest("[data-message-toggle]");
  if (messageToggle) {
    const ruleId = messageToggle.dataset.messageToggle ?? "";
    toggleMessageEditor(ruleId, !openMessageEditors.has(ruleId));
    return;
  }
  const messageAction = target.closest("[data-message-use-builtin], [data-message-remove]");
  if (messageAction) {
    const row = messageAction.closest("[data-rule-row]");
    const textarea = messagePart(row, "reason");
    textarea.value = "messageRemove" in messageAction.dataset ? "" : textarea.placeholder;
    if ("messageRemove" in messageAction.dataset)
      messagePart(row, "intent").value = "";
    updateMessageFromEditor(row);
    textarea.focus();
    return;
  }
  const example = state?.destructiveCommandRules.find((rule) => rule.id === target.closest("[data-rule-example]")?.dataset.ruleExample);
  if (example) {
    showRulePopover(target.closest("[data-rule-example]"), {
      label: example.catastrophic ? t.alwaysOn : example.category,
      title: example.label,
      description: example.description,
      body: example.example
    });
    return;
  }
  const secretPaths = state?.secretPatterns.find((rule) => rule.id === target.closest("[data-secret-paths]")?.dataset.secretPaths);
  if (secretPaths?.paths) {
    showRulePopover(target.closest("[data-secret-paths]"), {
      label: t.protectedPaths,
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
  if (params.has("message"))
    toggleMessageEditor(next.query, true);
  document.querySelector(\`[data-rule-row="\${CSS.escape(next.query)}"]\`)?.scrollIntoView({ block: "center" });
};
var setRawCopyLabel = () => {
  qs("raw-copy").innerHTML = \`\${icons.copy}<span>\${escapeHtml(t.copy)}</span>\`;
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
  view.addEventListener("input", (event) => {
    if (event.target instanceof HTMLTextAreaElement && "messageReason" in event.target.dataset)
      updateMessageFromEditor(event.target.closest("[data-rule-row]"));
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
var exampleRequests = {
  suggest: t.exampleSuggestRequest,
  block: t.exampleBlockRequest,
  verify: t.exampleVerifyRequest
};
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
  qs("rules-list").innerHTML = loaded.rulebooks.length === 0 ? loaded.errors.length > 0 ? \`<p class="empty">\${escapeHtml(t.allRulebooksSkipped)}</p>\` : \`<p class="empty">\${t.noCustomRules}</p>\` : loaded.rulebooks.map((rulebook) => \`<section class="rulebook">
    <div class="rulebook-head">
      <strong>\${escapeHtml(rulebook.name)}</strong>
      <span class="count">v\${escapeHtml(rulebook.version)}</span>
      <span>\${rulebook.source === "user" ? t.allProjects : t.thisProject}</span>
      <span>\${t.ruleCount(rulebook.rules.length)}</span>
      \${rulebook.spec === rulebook.name ? "" : \`<code>\${escapeHtml(rulebook.spec)}</code>\`}
    </div>
    <ul class="card rows">\${rulebook.rules.map((rule) => \`<li class="setting-row rulebook-rule\${pendingFocus === rule.name ? " focused" : ""}">
      <div class="rulebook-rule-head"><code class="command">\${escapeHtml([rule.command, rule.subcommand].filter(Boolean).join(" "))}</code><code class="rule-id">custom.\${escapeHtml(rule.name)}</code></div>
      <p>\${escapeHtml(rule.reason)}</p>
      <p class="muted">\${t.blocksWhenArgument} \${rule.block_args.map((arg) => \`<code>\${escapeHtml(arg)}</code>\`).join(" ")}</p>
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
    notify(t.customRuleMissing(\`custom.\${pendingFocus}\`), "error");
  pendingFocus = null;
};
var loadRules = async () => {
  requested = true;
  const result = await requestJson("/api/rules");
  if (!result.ok || !Array.isArray(result.data?.rulebooks)) {
    qs("rules-list").innerHTML = \`<p class="empty">\${escapeHtml(t.couldNotLoadRules(errorText(result)))}</p>\`;
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
  notify(t.folderPickerUnavailable, "error", t.typeFolderInstead(result.ok ? result.data.error : errorText(result)));
};
var copyRulePrompt = async (button) => {
  const request = qs("rules-composer-input").value;
  const projectPath = qs("rules-project-path").value;
  if (!rulesData) {
    notify(t.rulesNotLoaded, "error", t.refreshAndRetry);
    return;
  }
  if (!request.trim()) {
    notify(t.describeRuleFirst, "error");
    return;
  }
  if (scope === "project" && !projectPath.trim()) {
    notify(t.enterProjectFolder, "error");
    return;
  }
  button.disabled = true;
  const copied = await navigator.clipboard.writeText(rulePromptText({ rulesData, rulesScope: scope, projectPath, request })).then(() => true, () => false);
  button.disabled = false;
  if (!copied) {
    notify(t.copyFailed, "error");
    return;
  }
  qs("rules-composer-input").value = "";
  notify(t.promptCopied, "ok", t.pasteIntoAgent);
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
      qs("rules-composer-input").value = exampleRequests[example.dataset.rulesExample ?? ""] ?? "";
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
var savedTheme = guiData.preferences.theme ?? "auto";
var chooseTheme = async (theme) => {
  applyTheme(theme);
  if (await savePreference({ theme })) {
    savedTheme = theme;
    return;
  }
  applyTheme(savedTheme);
};
var renderRetention = () => {
  const days = shared.policy?.policy.audit.retention_days;
  if (days === undefined)
    return;
  qs("retention-days").value = String(days);
  qs("retention-unit").textContent = t.dayUnit(days);
};
var blockedBy = () => (shared.policy?.errors.length ?? 0) > 0 ? t.repairInProtectionsFirst : shared.drafting ? t.leaveProjectDraftFirst : shared.dirty ? t.saveProtectionsFirst : null;
var saveRetentionDays = async (days) => {
  const saved = shared.policy;
  if (!saved)
    return;
  const current = saved.policy.audit.retention_days;
  const problem = !Number.isInteger(days) || days < MIN_AUDIT_RETENTION_DAYS || days > MAX_AUDIT_RETENTION_DAYS ? t.retentionRange(MIN_AUDIT_RETENTION_DAYS, MAX_AUDIT_RETENTION_DAYS) : blockedBy();
  if (problem) {
    renderRetention();
    notify(t.retentionUnchanged, "error", problem);
    return;
  }
  if (days === current)
    return;
  if (days < current && !await confirmDialog({
    title: t.shortenRetentionTitle(days),
    body: t.shortenRetentionBody(days),
    detail: qs("logs-path").textContent ?? "",
    confirmLabel: t.shortenRetention
  })) {
    renderRetention();
    return;
  }
  await runExclusive(t.savingStatus, async () => {
    const policy = clonePolicy(saved.policy);
    policy.audit.retention_days = days;
    const result = await requestJson("/api/policy", {
      method: "POST",
      body: JSON.stringify(policy)
    });
    if (!isWriteSuccess(result)) {
      renderRetention();
      notify(t.saveFailed, "error", errorText(result));
      return;
    }
    if (!await loadPolicy())
      return;
    limitActivityDays(days);
    await Promise.all([loadOverview(), loadActivity()]);
    notify(t.retentionSaved(days), "ok");
  });
};
var resetPolicy = async () => {
  const saved = shared.policy;
  if (!saved)
    return;
  if (shared.drafting) {
    notify(t.resetUnavailable, "error", t.leaveProjectDraftFirst);
    return;
  }
  if (!await confirmDialog({
    title: t.resetPolicyTitle,
    body: t.resetPolicyBody,
    detail: saved.path,
    confirmLabel: t.resetPolicy
  }))
    return;
  await runExclusive(t.resettingStatus, async () => {
    const result = await requestJson("/api/reset", { method: "POST", body: "{}" });
    if (!isWriteSuccess(result)) {
      notify(t.resetFailed, "error", errorText(result));
      return;
    }
    sessionStorage.removeItem("cc-safety-net-draft");
    if (await loadPolicy())
      notify(t.policyReset, "ok", result.data.path);
  });
};
var initSettings = () => {
  document.querySelectorAll("[data-copy-path]").forEach((button) => {
    button.innerHTML = \`\${icons.copy}<span>\${escapeHtml(t.copy)}</span>\`;
    button.addEventListener("click", () => {
      copyText(button, qs(button.dataset.copyPath ?? "").dataset.path ?? "");
    });
  });
  applyTheme(savedTheme);
  qs("settings-theme").addEventListener("click", (event) => {
    const theme = event.target.closest("[data-theme-choice]")?.dataset.themeChoice;
    if (themes.includes(theme))
      chooseTheme(theme);
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
var translatedAttributes = ["title", "aria-label", "placeholder"];
var translatePage = () => {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t[element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t[element.dataset.i18nHtml];
  });
  translatedAttributes.forEach((attribute) => {
    document.querySelectorAll(\`[data-i18n-\${attribute}]\`).forEach((element) => {
      element.setAttribute(attribute, t[element.getAttribute(\`data-i18n-\${attribute}\`)]);
    });
  });
};
var views = {
  overview: [t.navOverview, () => {
    return;
  }],
  activity: [t.navActivity, showActivity],
  policy: [t.navProtections, showPolicy],
  rules: [t.navCustomRules, showRules],
  integrations: [t.navAgents, () => {
    return;
  }],
  settings: [t.navSettings, () => {
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
translatePage();
initConfirmDialog();
initOverview();
initActivity();
initPolicy();
initRules();
initIntegrations();
initSettings();
qs("toast-close").addEventListener("click", () => notify(""));
document.querySelectorAll("[data-language-select]").forEach((select) => {
  select.value = locale;
  select.addEventListener("change", () => {
    const language = select.value;
    if (!locales.includes(language) || language === locale)
      return;
    savePreference({ language }).then((saved) => {
      if (saved)
        location.reload();
      select.value = locale;
    });
  });
});
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
`;var df='<script id="ccsn-data" type="application/json">';function uf(A,B=cf){return B.replace(df,()=>df+JSON.stringify(A).replaceAll("<","\\u003c"))}var Qi="kenryu42/cc-safety-net",bk=`https://github.com/${Qi}`,wf=1e4,wk=7,kk="The project draft directory changed; reload the draft before applying.",Ck="audit settings are user scope only; remove the audit section from a project proposal";async function kf(A,B={}){let Z=pn({label:"gui",booleans:{noOpen:["--no-open"]}},A),Q=B.log??console.log,ee=B.error??console.error;if(Z.errors.length>0){for(let se of Z.errors)ee(se);return ee("Usage: cc-safety-net gui [--no-open]"),1}let te=await xk(a,B);if(Q(`CC Safety Net policy GUI: ${te.url}`),!Z.flags.noOpen)try{await(B.openBrowser??Nk)(te.url)}catch(se){ee(`Failed to open browser: ${se instanceof Error?se.message:String(se)}`),ee(`Open this URL manually: ${te.url}`)}if(B.keepAlive===!1)return await te.close(),0;return await Dk(te),0}async function xk(A,B={}){let Z=fk(24).toString("base64url"),Q={dir:null,revision:0},ee=hk((me,ye)=>{Sk(A,me,ye,Z,B,Q)});await new Promise((me,ye)=>{ee.once("error",ye),ee.listen(0,"127.0.0.1",()=>{ee.off("error",ye),me()})});let se=`http://127.0.0.1:${ee.address().port}`;return{origin:se,token:Z,url:`${se}/?token=${encodeURIComponent(Z)}`,close:()=>$k(ee)}}async function Sk(A,B,Z,Q,ee,te){let se=A(),me=new URL(B.url??"/","http://127.0.0.1");if(B.method==="GET"&&me.pathname==="/favicon.ico"){Z.writeHead(204,{"cache-control":"no-store"}),Z.end();return}if(!Ak(B,me,Q)){tn(Z,403,{error:"Forbidden"});return}if(B.method==="GET"&&me.pathname==="/"){let ye=ff(pf(se,ee));await Promise.resolve(ee.buildDocument?.()).then((Re)=>Ok(Z,uf({token:Q,preferences:ye},Re)),(Re)=>tn(Z,500,{error:Re instanceof Error?Re.message:String(Re)}));return}if(B.method==="POST"&&me.pathname==="/api/preferences"){let ye=await ir(B);if(!ye.ok){tn(Z,ye.status,{errors:[ye.error]});return}let Re=af(ye.value);if(!Re){tn(Z,400,{errors:["preferences accept only language (en, ja, zh-CN) and theme (auto, light, dark)"]});return}let _e=pf(se,ee),Ae=lf(ff(_e),Re),De=Pk(_e,Ae);tn(Z,De?500:200,De?{errors:[De]}:{preferences:Ae});return}if(B.method==="GET"&&me.pathname==="/api/policy"){let ye=Bu(se,ee),Re=S(se,Xi(ee));tn(Z,200,{...ye,configState:et(Re),...Re.policyScopes?{projectPolicy:{path:b(ee.cwd??process.cwd()),weakenings:Re.policyScopes.weakeningsIgnored?[]:Re.policyScopes.weakenings}}:{},destructiveCommandRules:J,secretPatterns:wt,secretDenial:{reason:it,intent:st},version:dn(),preview:ye.errors.length>0?null:Ze(ye.policy,se.env)});return}if(B.method==="POST"&&me.pathname==="/api/policy/preview"){let ye=await ir(B);if(!ye.ok){tn(Z,ye.status,{errors:[ye.error]});return}let Re=Gu(se,ye.value);tn(Z,Re.errors.length>0?400:200,Re);return}if(B.method==="POST"&&me.pathname==="/api/policy/explain"){let ye=await ir(B);if(!ye.ok){tn(Z,ye.status,{errors:[ye.error]});return}let Re=ye.value;if(Re===null||typeof Re.command!=="string"){tn(Z,400,{errors:["command must be a string"]});return}let _e=Ar(Re.policy,se.home);if(_e.length>0){tn(Z,400,{errors:_e});return}tn(Z,200,_k(se,Re.command,Re.policy,ee));return}if(B.method==="POST"&&me.pathname==="/api/policy"){let ye=await ir(B);if(!ye.ok){tn(Z,ye.status,{errors:[ye.error]});return}let Re=Nn(se,ye.value,ee);tn(Z,Re.errors.length>0?400:200,Re);return}if(B.method==="POST"&&me.pathname==="/api/reset"){tn(Z,200,Nn(se,ie,ee));return}if(B.method==="POST"&&me.pathname==="/api/repair"){tn(Z,200,qu(se,ee));return}if(B.method==="POST"&&me.pathname==="/api/policy/project/choose-directory"){let ye=await(ee.chooseDirectory??Zi)();if("path"in ye)te.dir=ye.path,te.revision+=1;tn(Z,200,{cancelled:"cancelled"in ye,..."error"in ye?{error:ye.error}:{}});return}if(B.method==="GET"&&me.pathname==="/api/policy/project"){let ye=Cf(te,ee),Re=xf(se,ye,ee),_e=Re?{projection:{},diagnostics:[Re]}:mf(ye,se.home),Ae=Ir(se,ee);tn(Z,200,{path:b(ye),revision:te.revision,baseline:Ae.baseline,userPolicyDiagnostics:Ae.diagnostics,projection:_e.projection,projectionDiagnostics:_e.diagnostics,canPickDirectory:Yi(process.platform,process.env)});return}if(B.method==="POST"&&me.pathname==="/api/policy/project/diff"){let ye=await gf(se,B,Z,te,ee);if(!ye)return;let Re=mf(ye.dir,se.home),_e=Ir(se,ee).baseline,Ae=oe(_e,ge(ye.proposal,se.home).policy);tn(Z,200,{rows:Lo(oe(_e,Re.projection).policy,Ae.policy,!1),weakenings:Ae.weakenings,existingFileDiagnostics:Re.diagnostics});return}if(B.method==="POST"&&me.pathname==="/api/policy/project/apply"){let ye=await gf(se,B,Z,te,ee);if(!ye)return;let Re=Ek(ye.dir,ye.proposal,se.home);tn(Z,Re.errors.length>0?500:200,Re);return}if(B.method==="GET"&&me.pathname==="/api/activity"){let ye=ae(se,ee),Re=Tk(me.searchParams.get("days"),ye);if(Re===null){tn(Z,400,{error:`days must be an integer between 1 and ${ye}`});return}tn(Z,200,ef(se,Re,ee.activityLogsDir));return}if(B.method==="POST"&&me.pathname==="/api/rules/choose-directory"){tn(Z,200,await Zi());return}if(B.method==="GET"&&me.pathname==="/api/rules"){let ye=q(se,Xi(ee)),Re=new Map(ye.rules.map((_e)=>[_e.name,_e]));tn(Z,200,{projectPath:ee.cwd??process.cwd(),canPickDirectory:Yi(process.platform,process.env),rulebooks:ye.rulebooks.map((_e)=>({source:_e.source,spec:_e.spec,name:_e.name,version:_e.version,rules:_e.rules.flatMap((Ae)=>{let De=Re.get(Ae);if(!De)return[];return[{name:De.name,command:De.command,subcommand:De.subcommand,block_args:De.block_args,reason:De.reason}]})})),errors:ye.errors,warnings:ye.warnings});return}if(B.method==="GET"&&me.pathname==="/api/star/context"){tn(Z,200,await(ee.fetchStarContext??(()=>Uk(se,{logsDir:ee.activityLogsDir})))());return}if(B.method==="POST"&&me.pathname==="/api/star"){let ye=await(ee.starRepo??Lk)();tn(Z,200,ye.ok?{ok:!0}:{ok:!1,fallbackUrl:bk});return}if(B.method==="GET"&&me.pathname==="/api/integrations"){tn(Z,200,await(ee.fetchIntegrations??(()=>jk(se)))());return}if(B.method==="GET"&&me.pathname==="/api/health"){tn(Z,200,await(ee.fetchHealth??Hk)());return}if(B.method==="POST"&&(me.pathname==="/api/install"||me.pathname==="/api/uninstall")){let ye=await ir(B);if(!ye.ok){tn(Z,ye.status,{errors:[ye.error]});return}let Re=ye.value?.target;if(typeof Re!=="string"||!Tn.some((Ae)=>Ae.target===Re)){tn(Z,400,{error:"unknown target"});return}let _e=me.pathname==="/api/install"?"install":"uninstall";tn(Z,200,await(ee.runIntegration??Mk)(_e,Re));return}tn(Z,404,{error:"Not found"})}function pf(A,B){return yk(bf(ue(A,B)),"gui.json")}function ff(A){if(!vf(A))return{};try{return sf(JSON.parse(gk(A,"utf-8")))}catch{return{}}}function Pk(A,B){try{return mk(bf(A),{recursive:!0}),sn(A,`${JSON.stringify(B,null,2)}
`),null}catch(Z){return Z instanceof Error?Z.message:String(Z)}}function Xi(A){return{...A,cwd:A.cwd??process.cwd()}}function Cf(A,B){return A.dir??B.cwd??process.cwd()}function xf(A,B,Z){if(!N(A,{...Z,cwd:B}))return null;return`${b(B)} is the user policy, not a project policy; choose a project directory, or run the GUI from one`}function mf(A,B){let Z=b(A),Q=vf(Z)?Ot(Z):{value:void 0,errors:[]},ee=ge(Q.value,B);return{projection:ee.policy,diagnostics:[...Q.errors,...ee.diagnostics]}}async function gf(A,B,Z,Q,ee){let te=Cf(Q,ee),se=Q.revision,me=await ir(B);if(!me.ok)return tn(Z,me.status,{errors:[me.error]}),null;let ye=me.value;if(typeof ye?.revision!=="number")return tn(Z,400,{errors:["revision must be a number"]}),null;if(ye.revision!==se)return tn(Z,409,{errors:[kk]}),null;let Re=xf(A,te,ee);if(Re)return tn(Z,400,{errors:[Re]}),null;let _e=Rk(ye.proposal,A.home);if(_e.length>0)return tn(Z,400,{errors:_e}),null;return{dir:te,proposal:ye.proposal}}function Rk(A,B){let Z=Ar(A,B);if(Z.length>0)return Z;return[...A?.audit===void 0?[]:[Ck],...Ye(A)]}function Ek(A,B,Z){let Q=b(A),ee=jo(B,P(B,Z));try{return v(i(R(A,"project policy"),Q),`${JSON.stringify(ee,null,2)}
`),{path:Q,errors:[]}}catch(te){return{path:Q,errors:[te instanceof Error?te.message:String(te)]}}}function _k(A,B,Z,Q){let ee=P(Z,A.home),te=S(A,Xi(Q)),se=he({rules:te.policy.rules,transparentWrappers:te.policy.transparentWrappers,heredocDataWrappers:te.policy.heredocDataWrappers,commandTools:te.policy.commandTools,safety:Qe(ee.safety),worktreeMode:ee.workflow.worktree_mode,destructiveCommandProtectionEnabled:ee.destructive_command_protection.enabled,destructiveCommandRuleOverrides:ee.destructive_command_protection.overrides,destructiveCommandAllowPaths:ee.destructive_command_protection.allow_paths,secretProtection:{enabled:ee.secret_protection.enabled,disabledRules:Rt(ee.secret_protection.overrides),denyPaths:ee.secret_protection.deny_paths,allowPaths:ee.secret_protection.allow_paths},ruleMessages:Ct(ee)});return xr(B,{policySnapshot:se,cwd:Q.cwd,userConfigDir:Q.userConfigDir},A)}function Tk(A,B){if(A===null)return Math.min(wk,B);let Z=Number(A);if(!Number.isInteger(Z)||Z<1||Z>B)return null;return Z}function Ak(A,B,Z){if(B.searchParams.get("token")!==Z)return!1;if(A.method!=="POST")return!0;return A.headers["x-cc-safety-net-token"]===Z}var Ik=1048576;async function ir(A){let B=[],Z=0;for await(let Q of A){let ee=Q;if(Z+=ee.byteLength,Z>Ik)return{ok:!1,status:413,error:"Request body is too large"};B.push(ee)}try{return{ok:!0,value:JSON.parse(Buffer.concat(B).toString("utf-8")||"{}")}}catch(Q){return{ok:!1,status:400,error:`Invalid JSON: ${Q instanceof Error?Q.message:String(Q)}`}}}function Ok(A,B){A.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),A.end(B)}function tn(A,B,Z){A.writeHead(B,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),A.end(JSON.stringify(Z))}function $k(A){return new Promise((B,Z)=>{A.close((Q)=>Q?Z(Q):B())})}function Dk(A){return new Promise((B)=>{let Z=()=>{process.off("SIGINT",Q),process.off("SIGTERM",Q)},Q=()=>{Z(),A.close().then(B)};process.once("SIGINT",Q),process.once("SIGTERM",Q)})}function Nk(A){let B=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",Z=process.platform==="win32"?["/c","start","",A]:[A];return new Promise((Q,ee)=>{let te=yf(B,Z,{detached:!0,stdio:"ignore"}),se=(ye)=>{te.off("spawn",me),ee(ye)},me=()=>{te.off("error",se),te.unref(),Q()};te.once("error",se),te.once("spawn",me)})}async function Lk(A="gh",B=wf){return{ok:await Bk(A,["api","-X","PUT",`/user/starred/${Qi}`],B)===0}}async function jk(A,B={}){let Z=await qr((ee)=>er({environment:A,cwd:process.cwd(),openCodeVersion:ee}).status!=="n/a",B.fetcher),Q=Fk(A,Z);return{targets:Cn.map((ee)=>{let te=Q.find((se)=>se.platform===ee.id);return{target:ee.id,label:ln(ee.id),version:Z.versions[ee.id]??null,status:te?.configured?"active":te?.detected?"disabled":te?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:Z.version,nodeVersion:Z.nodeVersion,platform:Z.platform}}}function Fk(A,B){return nr(A,process.cwd(),{ampPluginListOutput:B.ampPluginListOutput,codexPluginListOutput:B.codexPluginListOutput,copilotCliVersion:B.versions["copilot-cli"],openCodeVersion:B.versions.opencode,openCodePluginListOutput:B.openCodePluginListOutput})}async function Hk(A={}){let B=await(A.checkUpdates??Hn)();return{update:{latestVersion:B.latestVersion??null,updateAvailable:B.updateAvailable}}}var hf=Promise.resolve();function Mk(A,B,Z={}){let Q=async()=>{let te=[],{log:se,error:me}=console;console.log=(...ye)=>te.push(ye.map(String).join(" ")),console.error=console.log;try{return{ok:await Tr(A,[],{selectTargets:async()=>[B],output:new vk({write(Re,_e,Ae){te.push(String(Re).replace(/\n$/,"")),Ae()}}),...Z})===0,output:te.join(`
`)}}finally{console.log=se,console.error=me}},ee=hf.then(Q);return hf=ee.then(()=>{return},()=>{return}),ee}async function Uk(A,B={}){let[Z,Q]=await Promise.all([Gk(B.fetchRepo),Promise.resolve(Hr(A,ae(A),B.logsDir).totalBlocked)]);return{starCount:Z,blockedTotal:Q}}function Bk(A,B,Z){return new Promise((Q)=>{let ee=yf(A,B,{stdio:"ignore",windowsHide:!0}),te=!1,se=setTimeout(()=>{ee.kill(),me(null)},Z),me=(ye)=>{if(te)return;te=!0,clearTimeout(se),Q(ye)};ee.once("error",()=>me(null)),ee.once("close",me)})}async function Gk(A=fetch){try{let B=await A(`https://api.github.com/repos/${Qi}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(wf)});if(!B.ok)return null;let Z=await B.json();return typeof Z.stargazers_count==="number"?Z.stargazers_count:null}catch{return null}}function qk(A){if(A[0]!=="help")return!1;let B=A[1];if(!B)Si(),process.exit(0);if(Sr(B))process.exit(0);console.error(`Unknown command: ${B}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var Vk={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),Sr("hook",console.error),process.exit(1)},install:async(A)=>{process.exit(await Tr("install",A))},update:async(A)=>{process.exit(await Mi(A))},uninstall:async(A)=>{process.exit(await Tr("uninstall",A))},rule:async(A)=>{process.exit(await Zp(a(),A))},policy:async(A)=>{process.exit(await Ju(a(),A))},status:async(A)=>{if(An(pn({label:"status"},A).errors))process.exit(1);Qp(a())},statusline:async(A)=>{let B=pn({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},A);if(B.errors.length===0&&B.flags.claudeCode){await Wi(a());return}if(An(B.errors),!B.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");Sr("statusline",console.error),process.exit(1)},doctor:async(A)=>{let B=mi(A);if(!B)process.exit(1);let Z=await pd(a(),{json:B.json,skipUpdateCheck:B.skipUpdateCheck});process.exit(Z)},logs:async(A)=>{process.exit(await aa(a(),A))},gui:async(A)=>{process.exit(await kf(A))},explain:async(A)=>{process.exit(await Cd(a(),A))}};async function Kk(A){let B=pn({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},A);if(qk(A))return;let Z=A[0],Q=Z?Fr(Z):void 0;if(B.help&&Q&&Q.name!=="rule")Sr(Q.name),process.exit(0);if(!Z||B.help&&!Q)Si(),process.exit(0);if(B.flags.version)Pd(),process.exit(0);if(Q){await Vk[Q.name](A.slice(1));return}if(Z==="--statusline"){await Wi(a());return}console.error(Z.startsWith("-")?`Unknown option: ${Z}`:`Unknown command: ${Z}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{Kk as runCli};
