import{a,s,_e,We,R,tt,Be,c,n,ze,T,x,de,rt,f,qe,l,o,v,i,ie,r,g,fe,j,it,st,u,me,ge,at,D,Y,se,S,ct,U,b,Ee,G,d,Z,Ke,Je,N,w,P,he,ye,Ae,lt,m,e,Ie,ke,Ye,Ze,ae,Re,ce,Oe,X,H,De,be,W,Xe,B,Q,ee,le,Qe,et,C,z,Ne,Fe,Me,E,$e,Te,je,h,t,te,xe,y,k,A,ut,Ue,Ge,p,V}from"./chunks/index-06tsm0y9.js";import{re,q,He,F,M}from"./chunks/index-fxjnbmrp.js";var wu=["-h","--help"];function gn(_,I){let O=Object.entries(_.booleans??{}),L=Object.entries(_.values??{}),J=Object.entries(_.lists??{}),K=Object.fromEntries(O.map(([Ce])=>[Ce,!1])),ne={},oe=Object.fromEntries(J.map(([Ce])=>[Ce,[]])),ue=[],pe=[],ve=!1,we=-1;for(let[Ce,Pe]of I.entries()){if(Ce<=we)continue;if(Pe==="--"){ue.push(...I.slice(Ce+1));break}if(wu.includes(Pe)){ve=!0;continue}let Se=O.find(([,Ve])=>Ve.includes(Pe));if(Se){K[Se[0]]=!0;continue}let en=L.find(([,Ve])=>Ve.includes(Pe));if(en){let Ve=I[Ce+1];if(Ve===void 0||Ve.startsWith("-")){pe.push(`${Pe} requires a value`);continue}ne[en[0]]=Ve,we=Ce+1;continue}let Le=J.find(([,Ve])=>Ve.includes(Pe));if(Le){let Ve=I.slice(Ce+1),on=Ve.findIndex((an)=>an.startsWith("-")),sn=Ve.slice(0,on===-1?Ve.length:on);if(sn.length===0){pe.push(`${Pe} requires at least one value`);continue}oe[Le[0]]=[...oe[Le[0]]??[],...sn],we=Ce+sn.length;continue}if(Pe.startsWith("-")){pe.push(`Unknown option for ${_.label}: ${Pe}`);continue}if(_.positionals==="tail"){ue.push(...I.slice(Ce));break}ue.push(Pe)}if(_.positionals!=="list"&&_.positionals!=="tail")pe.push(...ue.map((Ce)=>`Unexpected argument for ${_.label}: ${Ce}`));return{flags:K,values:ne,lists:oe,positionals:ue,help:ve,errors:pe}}function Dn(_){for(let I of _)console.error(I);return _.length>0}import{readdirSync as Eu,statSync as ns,unlinkSync as Au}from"node:fs";import{basename as ts,dirname as _u,isAbsolute as Iu,join as Tu,relative as $u,resolve as Ou,sep as Du}from"node:path";var Xi=(_)=>{let I=Date.now()-new Date(_).getTime();if(!Number.isFinite(I))return"";let O=Math.floor(I/60000),L=Math.floor(O/60),J=Math.floor(L/24);if(J>0)return`${J}d ago`;if(L>0)return`${L}h ago`;if(O>0)return`${O}m ago`;return"just now"},co=(_)=>{let I=(_??"").trim().split(/\s+/).filter((J)=>J&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(J)),O=I[0]?.split("/").pop();if(!O)return null;let L=I[1];return L&&/^[a-z][a-z0-9-]*$/.test(L)?`${O} ${L}`:O};function Qi(_){let I=(J)=>`${J.sessionId}
${co(J.segment||J.command)}`,O=_.filter((J)=>J.decision!=="allow"),L=O.filter((J)=>J.sessionId).reduce((J,K)=>J.set(I(K),(J.get(I(K))??0)+1),new Map);return new Set(O.filter((J)=>J.failureStage||(L.get(I(J))??0)>=2))}import{existsSync as ku,readdirSync as xu,readFileSync as Su}from"node:fs";import{join as Cu}from"node:path";function zn(_,I){try{return xu(_,{withFileTypes:!0,encoding:"utf8"}).flatMap((O)=>{let L=Cu(_,O.name);if(O.isDirectory())return zn(L,I);if(O.name.endsWith(".jsonl"))return[L];return[]})}catch{if(I&&ku(_))I.count++;return[]}}var Ru=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function Pu(_){if(!_||typeof _!=="object"||Array.isArray(_))return!1;let I=_;if(typeof I.ts!=="string"||typeof I.command!=="string")return!1;return Ru.every((O)=>I[O]===void 0||typeof I[O]==="string")}function ht(_,I){try{return Su(_,"utf-8").split(`
`).filter(Boolean).flatMap((O)=>{try{let L=JSON.parse(O);if(!Pu(L)){if(I)I.count++;return[]}return[L]}catch{if(I)I.count++;return[]}})}catch{if(I)I.count++;return[]}}function hn(_){return Array.from(_,(I)=>{let O=I.charCodeAt(0);if(O<=31||O>=127&&O<=159)return`\\x${O.toString(16).padStart(2,"0")}`;return I}).join("")}function Lu(_,I){let O=re(_),L=gn({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},I);if(Dn(L.errors))return null;if(L.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(L.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let J=L.values.limit===void 0?20:es(L.values.limit);if(J===null)return console.error("--limit must be a positive number"),null;let K=L.values.since===void 0?Math.min(30,O):es(L.values.since);if(K===null||K>O)return console.error(`--since must be a positive number of days no greater than ${O}`),null;let ne={limit:J,limitExplicit:L.values.limit!==void 0,since:K,sinceExplicit:L.values.since!==void 0,all:L.flags.all,json:L.flags.json,suspect:L.flags.suspect,pruneLegacy:L.flags.pruneLegacy,dryRun:L.flags.dryRun,id:L.values.id,agent:L.values.agent,rule:L.values.rule,session:L.values.session,project:L.values.project===void 0?void 0:Ou(L.values.project)};if(ne.id&&(ne.agent!==void 0||ne.rule!==void 0||ne.session!==void 0||ne.project!==void 0||ne.suspect||ne.sinceExplicit||ne.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(ne.pruneLegacy&&(ne.id!==void 0||ne.agent!==void 0||ne.rule!==void 0||ne.session!==void 0||ne.project!==void 0||ne.suspect||ne.all||ne.sinceExplicit||ne.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(ne.dryRun&&!ne.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return ne}async function rs(_,I,O={}){let L=Lu(_,I);if(!L)return 1;let J=O.logsDir??F(_);if(L.pruneLegacy)return Nu(J,L.json,L.dryRun);if(!J)return console.log(L.json?"[]":L.id?`No retained audit log entry found for id ${hn(L.id)}.`:"No audit log entries found."),0;q(_,J);let K={count:0},ne=zn(J,K).flatMap((we)=>ht(we,K).map((Ce)=>({entry:Ce,file:we})));if(K.count>0)console.error(`warning: ${K.count} audit log ${K.count===1?"source":"sources"} could not be read; these results are incomplete`);if(L.id)return Mu(ne,L,O.timeZone);let oe=Date.now()-L.since*24*60*60*1000,ue=ne.filter((we)=>Uu(we,L,J,oe)),pe=L.suspect?Qi(ue.map((we)=>we.entry)):null,ve=(pe?ue.filter((we)=>pe.has(we.entry)):ue).sort((we,Ce)=>Date.parse(Ce.entry.ts)-Date.parse(we.entry.ts)).slice(0,L.limit);if(L.json)return console.log(JSON.stringify(ve.map((we)=>we.entry),null,2)),0;if(ve.length===0)return console.log("No audit log entries found."),0;for(let we of ve)console.log(qu(we.entry,O.timeZone));return 0}function Nu(_,I,O){let L=_?Fu(_).map((oe)=>Tu(_,oe)):[];if(O)return ju(L,I);let J=[],K=0,ne=0;for(let oe of L){let ue=ns(oe,{throwIfNoEntry:!1})?.size??0,pe=Hu(oe);if(pe){J.push(`${ts(oe)}: ${pe}`);continue}K++,ne+=ue}if(I)return console.log(JSON.stringify({removedFiles:K,removedBytes:ne,failedFiles:J.length})),J.length===0?0:1;console.log(K===0&&J.length===0?"No legacy audit log files found.":`Removed ${K} legacy audit log ${K===1?"file":"files"} (${os(ne)}).`);for(let oe of J)console.error(`Could not remove ${hn(oe)}`);if(console.log("Nested v2 audit logs were not changed."),K>0)console.log("This deletion cannot be undone.");return J.length===0?0:1}function ju(_,I){let O=_.reduce((L,J)=>L+(ns(J,{throwIfNoEntry:!1})?.size??0),0);if(I)return console.log(JSON.stringify({dryRun:!0,files:_.length,bytes:O})),0;if(console.log(_.length===0?"No legacy audit log files found.":`Would remove ${_.length} legacy audit log ${_.length===1?"file":"files"} (${os(O)}).`),console.log("Nested v2 audit logs are not included."),_.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function Fu(_){try{return Eu(_,{withFileTypes:!0}).filter((I)=>I.isFile()&&I.name.endsWith(".jsonl")).map((I)=>I.name)}catch{return[]}}function Hu(_){try{return Au(_),null}catch(I){return I instanceof Error?I.message:String(I)}}function os(_){let I=["B","KiB","MiB","GiB"],O=Math.min(Math.floor(Math.log2(Math.max(_,1))/10),I.length-1);return`${Math.round(_/1024**O*10)/10} ${I[O]}`}function Mu(_,I,O){let L=_.filter((K)=>K.entry.id===I.id);if(L.length>1)return console.error(`Multiple audit log entries found for id ${hn(I.id??"")}.`),1;if(I.json)return console.log(JSON.stringify(L.map((K)=>K.entry),null,2)),0;let J=L[0];if(!J)return console.log(`No retained audit log entry found for id ${hn(I.id??"")}.`),0;return console.log(Vu(J.entry,O)),0}function Uu(_,I,O,L){if(!I.all&&_.entry.decision==="allow")return!1;if(Date.parse(_.entry.ts)<L)return!1;if(I.agent!==void 0&&_.entry.agent!==I.agent)return!1;if(I.rule!==void 0&&_.entry.ruleId!==I.rule)return!1;if(I.session!==void 0&&!Gu(_,O,I.session))return!1;if(I.project!==void 0&&!Bu(_.entry.cwd,I.project))return!1;return!0}function Gu(_,I,O){if(_.entry.sessionId===O)return!0;return _u(_.file)===I&&ts(_.file,".jsonl")===O}function Bu(_,I){if(!_)return!1;let O=$u(I,_);return O!==".."&&!O.startsWith(`..${Du}`)&&!Iu(O)}function qu(_,I){let O=hn(_.id??"-"),L=hn(_.decision??"deny"),J=_.cwd?`  [${hn(_.cwd)}]`:"",K=_.segment||_.command,ne=K===_.command?"":"↳ ",oe=K.length>50?`${K.slice(0,50)}…`:K;return`${O.padEnd(16)}  ${hn(is(_.ts,I))}  ${L.padEnd(5)}  ${hn(_.agent??"-").padEnd(15)}  ${hn(_.ruleId??"-").padEnd(20)}  ${ne}${hn(oe)}${J}`}function Vu(_,I){let O=(J)=>hn(J===void 0||J===null||J===""?"-":J),L=_.shape?`${_.agent??"-"} (shape: ${_.shape})`:_.agent??"-";return[`id:        ${O(_.id)}`,`ts:        ${O(is(_.ts,I))}`,`decision:  ${O(_.decision)}`,`agent:     ${O(L)}`,`level:     ${O(_.level)}`,`tool:      ${O(_.toolName)}`,`rule:      ${O(_.ruleId)}`,`intent:    ${O(_.intent)}`,`stage:     ${O(_.failureStage)}`,`error:     ${O(_.errorCode)}`,`session:   ${O(_.sessionId)}`,`cwd:       ${O(_.cwd)}`,`version:   ${O(_.v)}`,`truncated: ${O(_.truncated===!0?"yes":void 0)}`,`reason:    ${O(_.reason)}`,`command:   ${O(_.command)}`,`segment:   ${O(_.segment)}`].join(`
`)}function is(_,I){let O=new Date(_);if(Number.isNaN(O.getTime()))return _;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:I}).format(O)}function es(_){let I=Number(_);return Number.isFinite(I)&&I>0?I:null}var ss={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var as={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var ls={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var uo=["npx","--offline","--no-install","@deepseek-ai/dsh","--version"],sr=[{id:"antigravity-cli",displayName:"Antigravity CLI",doctorOrder:3,runtime:{order:1,flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:2,flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",doctorOrder:1,runtime:{order:2,displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{order:3,flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",doctorOrder:4,runtime:{order:3,flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{order:4,flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",doctorOrder:8,runtime:{order:6,flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{order:8,flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",doctorOrder:7,runtime:{order:5,flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{order:7,flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",doctorOrder:9,runtime:{order:7,flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{order:9,flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",doctorOrder:10,runtime:{order:8,flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{order:10,flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",doctorOrder:11,runtime:{order:9,flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{order:11,flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",doctorOrder:12,install:{order:12,flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",doctorOrder:13,install:{order:13,flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",doctorOrder:14,install:{order:14,flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",doctorOrder:5,runtime:{order:4,flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{order:5,flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"deepseek-harness",displayName:"DeepSeek Harness",doctorOrder:6,install:{order:6,flag:"--deepseek-harness",artifactKind:"package",probeCommand:uo}},{id:"amp",displayName:"Amp Code",doctorOrder:2,install:{order:1,flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],ar=sr.slice().sort((_,I)=>_.doctorOrder-I.doctorOrder).map((_)=>_.id),Tt=sr.filter((_)=>("runtime"in _)).slice().sort((_,I)=>_.runtime.order-I.runtime.order).map((_)=>({id:_.id,displayName:"displayName"in _.runtime?_.runtime.displayName:_.displayName,flags:_.runtime.flags,legacyFlags:"legacyFlags"in _.runtime?_.runtime.legacyFlags:[],description:_.runtime.description,legacyTopLevelFlags:_.runtime.legacyTopLevelFlags})),Pn=sr.slice().sort((_,I)=>_.install.order-I.install.order).map((_)=>({id:_.id,..._.install})).map(({order:_,...I})=>I),zu=Object.fromEntries(sr.map((_)=>[_.id,_.displayName]));function fn(_){return zu[_]}var Ju=Tt.map((_)=>({flags:_.flags.join(", "),description:_.description})),Wu=Tt.flatMap((_)=>_.flags.map((I)=>`cc-safety-net hook ${I}`)),cs={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Ju,{flags:"-h, --help",description:"Show this help"}],examples:Wu};var ds={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...Pn.map((_)=>({flags:_.flag,description:`Install ${fn(_.id)} ${_.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...Pn.map((_)=>`cc-safety-net install ${_.flag}`)]},us={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...Pn.map((_)=>({flags:_.flag,description:`Uninstall ${fn(_.id)} ${_.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...Pn.map((_)=>`cc-safety-net uninstall ${_.flag}`)]},ps={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var fs={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var lr={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var po=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],fo=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],yt={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},...po.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk",...fo,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var ms={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var gs={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var cr=[ms,ss,fs,as,yt,lr,ds,ps,us,cs,ls,gs];function Ku(_){return _.aliases??[]}function dr(_){let I=_.toLowerCase();return cr.find((O)=>O.name.toLowerCase()===I||Ku(O).some((L)=>L.toLowerCase()===I))}import{existsSync as hg}from"node:fs";import{basename as Yu}from"node:path";function ur(_,I=7,O=F(_)){let L=Date.now()-I*24*60*60*1000,J=[],K=new Set,ne=0,oe,ue,pe,ve;if(O)q(_,O);let we={count:0},Ce=O?zn(O,we):[];for(let Se of Ce)for(let en of ht(Se,we)){if(en.decision==="allow")continue;let Le=new Date(en.ts).getTime();if(Le>=L){if(ne++,K.add(en.sessionId??Yu(Se,".jsonl")),ue===void 0||Le<=ue)oe=en.ts,ue=Le;if(ve===void 0||Le>ve)pe=en.ts,ve=Le;Zu(J,en,Le)}}let Pe=J.map((Se)=>({timestamp:Se.ts,command:Se.command,reason:Se.reason,relativeTime:Xi(new Date(Se.ts))}));return{totalBlocked:ne,sessionCount:K.size,recentEntries:Pe,oldestEntry:oe,newestEntry:pe,unreadable:we.count}}function Zu(_,I,O){let L=_.findIndex((J)=>O>new Date(J.ts).getTime());if(L===-1){if(_.length<3)_.push(I);return}if(_.splice(L,0,I),_.length>3)_.pop()}import{dirname as cp}from"node:path";import{dirname as Xu,join as Qu,resolve as ep}from"node:path";var np="config.json";function bn(_,I,O,L){g(tp(_),`${JSON.stringify(I,null,2)}
`,O,L)}function tp(_){return typeof _==="string"?ie(_):_}function go(_){return{errors:ae(op(_),": "," "),ruleNames:new Set(Oe(_).map((I)=>I.toLowerCase()))}}var rp="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",hs="must match pattern (letters, numbers, hyphens, underscores)";function op(_){if(!ys(_))return[e([],"Config must be an object")];return[..._.version===1?[]:[e(["version"],"must be 1")],...ip(_.rules)]}function ip(_){if(_===void 0)return[];if(!Array.isArray(_))return[e(["rules"],"must be an array")];return[..._.flatMap((I,O)=>ys(I)?sp(I,["rules",O]):[e(["rules",O],"must be an object")]),...Ie(_)]}function sp(_,I){return[...mo(_.name,[...I,"name"],"required string",u,rp),...mo(_.command,[...I,"command"],"required string",w,hs),..._.subcommand===void 0?[]:mo(_.subcommand,[...I,"subcommand"],"must be a string if provided",w,hs),...ap(_.block_args,[...I,"block_args"]),...lp(_.reason,[...I,"reason"]),..._.intent===void 0||Re(_.intent)?[]:[e([...I,"intent"],ke)]]}function mo(_,I,O,L,J){if(typeof _!=="string")return[e(I,O)];return L.test(_)?[]:[e(I,J)]}function ap(_,I){if(!Array.isArray(_))return[e(I,"required array")];if(_.length===0)return[e(I,"must have at least one element")];return _.flatMap((O,L)=>{if(typeof O!=="string")return[e([...I,L],"must be a string")];return O===""?[e([...I,L],"must not be empty")]:[]})}function lp(_,I){if(typeof _!=="string")return[e(I,"required string")];if(_==="")return[e(I,"must not be empty")];return _.length>P?[e(I,`must be at most ${P} characters`)]:[]}function ys(_){return!!_&&typeof _==="object"&&!Array.isArray(_)}function ho(_){let I=vs(_);if(!I.ok)return I.result;return go(I.parsed)}function vs(_){let I=[],O=new Set;try{let L=typeof _==="string"?ie(_):_,J=r(L);if(J===null)return I.push(`File not found: ${L.path}`),{ok:!1,result:{errors:I,ruleNames:O}};if(!J.trim())return I.push("Config file is empty"),{ok:!1,result:{errors:I,ruleNames:O}};return{ok:!0,parsed:JSON.parse(J)}}catch(L){if(L instanceof o)return I.push(L.message),{ok:!1,result:{errors:I,ruleNames:O}};let J=L instanceof Error?L.message:String(L);return I.push(L instanceof SyntaxError?"Invalid JSON":J),{ok:!1,result:{errors:I,ruleNames:O}}}}function pr(_){return ep(_,".safety-net.json")}function Mn(_){let I=vs(_);if(!I.ok)return I.result;let O=Ye(I.parsed);return{errors:O.errors,ruleNames:O.sources}}function vt(_,I={}){return Qu(Xu(Ee(_,I)),np)}function bs(_,I,O){let L;try{if(r(I)===null)return{path:_,exists:!1,valid:!1,ruleCount:0};L=Mn(I),L.errors.push(...H(_,O))}catch(J){if(!(J instanceof o))throw J;L={errors:[J.message],ruleNames:new Set}}return{path:_,exists:!0,valid:L.errors.length===0,ruleCount:L.ruleNames.size,...L.errors.length>0?{errors:L.errors}:{}}}function dp(_,I){return{source:I,name:_.name,command:_.command,subcommand:_.subcommand,blockArgs:[..._.block_args],reason:_.reason}}function ws(_,I){let O=G(_),L=U(I),J=cp(O),K=X(_,{cwd:I,userConfigPath:O,projectConfigPath:L,userConfigDir:J}),ne=Z(_,{cwd:I,userConfigPath:O,projectConfigPath:L,userConfigDir:J}),oe=new Map(K.rulebooks.flatMap((ue)=>ue.rules.map((pe)=>[pe,ue.source])));return{userConfig:bs(O,ne.userConfigTarget,ne.userScope),projectConfig:bs(L,ne.projectConfigTarget,ne.projectScope),effectiveRules:K.rules.map((ue)=>dp(ue,oe.get(ue.name)??"project"))}}var up=[{flag:n.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:n.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:n.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:n.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:n.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:n.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:n.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:n.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"},{flag:n.projectTightenOnly,description:"Ignore project policy settings that weaken the user policy",defaultBehavior:"off"}];function ks(_){return[...up.map((I)=>({name:I.flag.name,value:de(I.flag,_.env),isSet:rt(I.flag,_.env),legacyName:I.flag.legacyName,legacyValue:I.flag.legacyName?_.env.get(I.flag.legacyName):void 0,legacyIsSet:I.flag.legacyName?_.env.get(I.flag.legacyName)!==void 0:void 0,description:I.description,defaultBehavior:I.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:_.env.get("CC_SAFETY_NET_HOME"),isSet:_.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var xs={error:0,warning:1,info:2},pp=["policy","config","audit"];function fp(_){return _.map((I)=>{if(I==="ownership")return"is not owned by the current user";if(I==="permissions")return"has unsafe permissions";if(I==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var mp=[{derive:(_)=>_.hooks.length>0&&_.hooks.every((I)=>!I.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(_)=>_.hooks.filter((I)=>I.inspectionStatus==="failed").map((I)=>{let O=fn(I.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${O} inspection failed`,detail:`Doctor could not verify the ${O} integration configuration.`,fixHint:`Correct the reported ${O} configuration error, then run \`cc-safety-net doctor\` again.`,integration:I.platform}})},{derive:(_)=>_.userConfig.exists&&!_.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:_.userConfig.path}]:[]},{derive:(_)=>_.projectConfig.exists&&!_.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:_.projectConfig.path}]:[]},{derive:(_)=>_.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${_.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(_)=>_.v2Leftovers&&_.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${_.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(_)=>_.legacyConfigs&&_.legacyConfigs.length>0?[{checkId:"config.legacy-ignored",severity:"warning",title:"Legacy inline rule configs are ignored",detail:`CC Safety Net no longer loads these files, so their rules enforce nothing: ${_.legacyConfigs.join(", ")}.`,fixHint:"Run `cc-safety-net rule migrate` to convert them (add `--cleanup` to delete each file once it is converted), then rerun doctor."}]:[]},{derive:(_)=>{let I=_.environment.find((O)=>O.name==="CC_SAFETY_NET_AUDIT_SCOPE");return ze(I?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...pp.map((_)=>({derive:(I)=>I.posture.directories.filter((O)=>O.kind===_&&O.status==="unsafe").map((O)=>({checkId:`posture.${_}-directory-unsafe`,severity:"error",title:`${_[0]?.toUpperCase()}${_.slice(1)} directory is unsafe`,detail:`The ${_} directory ${fp(O.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...O.path?{path:O.path}:{}}))})),{derive:(_)=>{let I=[..._.effectiveSafety.weakenedRuleOverrides].sort();return I.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${I.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${I.join(", ")}.`}]:[]}}];function Ss(_){return mp.flatMap((I,O)=>I.derive(_).map((L,J)=>({finding:L,catalogOrder:O,occurrence:J}))).sort((I,O)=>xs[I.finding.severity]-xs[O.finding.severity]||I.catalogOrder-O.catalogOrder||I.occurrence-O.occurrence).map((I)=>I.finding)}function Ln(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var gp=(_)=>Ln()?`\x1B[32m${_}\x1B[0m`:_,hp=(_)=>Ln()?`\x1B[33m${_}\x1B[0m`:_,yp=(_)=>Ln()?`\x1B[34m${_}\x1B[0m`:_,vp=(_)=>Ln()?`\x1B[36m${_}\x1B[0m`:_,bp=(_)=>Ln()?`\x1B[31m${_}\x1B[0m`:_,wp=(_)=>Ln()?`\x1B[2m${_}\x1B[0m`:_,kp=(_)=>Ln()?`\x1B[1m${_}\x1B[0m`:_,nn={green:gp,yellow:hp,blue:yp,cyan:vp,red:bp,dim:wp,bold:kp},xp="\x1B[0m",Sp=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function Cp(_){let I=_;return()=>(I=(I*1664525+1013904223)%4294967296,I/4294967296)}function Rp(_){let I=[...Sp],O=Cp(_);for(let L=I.length-1;L>0;L--){let J=Math.floor(O()*(L+1)),K=I[L];I[L]=I[J],I[J]=K}return I}function Pp(_,I=0){if(!Ln())return"";let O=Rp(I);return`\x1B[38;5;${O[_%O.length]}m`}function Cs(_,I,O=0){if(!Ln())return`"${_}"`;return`${Pp(I,O)}"${_}"${xp}`}function fr(_){return _==="default"?"built-in default":`${_} policy`}var Ep=new RegExp("\x1B\\[[0-9;]*m","g"),yo=(_)=>_.replace(Ep,"").length;function Jn(_){let I=(_.headers??_.rows[0]??[]).map((ne,oe)=>{let ue=Math.max(..._.rows.map((pe)=>yo(pe[oe]??"")));return Math.max(yo(ne),ue)}),O=(ne,oe)=>ne+" ".repeat(Math.max(0,oe-yo(ne))),L=(ne,oe)=>oe[0]+I.map((ue)=>ne.repeat(ue+2)).join(oe[1])+oe[2],J=(ne)=>`│ ${ne.map((oe,ue)=>O(oe,I[ue]??0)).join(" │ ")} │`,K=_.headers?[`   ${J(_.headers)}`,`   ${L("─",["├","┼","┤"])}`]:[];return[`   ${L("─",["┌","┬","┐"])}`,...K,..._.rows.map((ne)=>`   ${J(ne)}`),`   ${L("─",["└","┴","┘"])}`].join(`
`)}function Rs(_){let I=[];I.push("Hook Integration"),I.push(Ap(_));let O=[],L=[];for(let J of _){let K=fn(J.platform);if(J.errors&&J.errors.length>0)for(let ne of J.errors)if(J.configured)O.push({platform:K,message:ne});else L.push({platform:K,message:ne})}for(let J of O)I.push(`   Warning (${J.platform}): ${J.message}`);for(let J of L)I.push(nn.red(`   Error (${J.platform}): ${J.message}`));return I.join(`
`)}function Ap(_){let I=["Platform","Discovery","Configuration","Inspection"],O=_.map((L)=>{let J=fn(L.platform);if(L.inspectionStatus==="not-inspected"){let ue=nn.dim("Not inspected");return[J,ue,ue,ue]}let K=L.detected?nn.green("Detected"):L.inspectionStatus==="failed"?nn.red("Unknown"):nn.dim("Not detected"),ne=L.configured?nn.green("Configured"):L.detected?nn.yellow("Not configured"):L.inspectionStatus==="failed"?nn.red("Unknown"):nn.dim("Not applicable"),oe=L.inspectionStatus==="verified"?nn.green("Verified"):L.inspectionStatus==="failed"?nn.red("Failed"):nn.dim("Not applicable");return[J,K,ne,oe]});return Jn({headers:I,rows:O})}function Ps(_){let O=["Guard Engine Verification",`   Synthetic self-test: ${_.failed>0?nn.red(`${_.passed}/${_.total} FAIL`):nn.green(`${_.passed}/${_.total} passed`)}`],L=_.results.filter((J)=>!J.passed);if(L.length>0){O.push(""),O.push(nn.red("   Failures:"));for(let J of L)O.push(nn.red(`   • ${J.description}`)),O.push(nn.red(`     expected ${J.expected}, got ${J.actual}`))}return O.join(`
`)}function _p(_){if(_.length===0)return"   (no custom rules)";let I=["Source","Name","Command","Block Args"],O=_.map((L)=>[L.source,L.name,L.subcommand?`${L.command} ${L.subcommand}`:L.command,L.blockArgs.join(", ")]);return Jn({headers:I,rows:O})}function Es(_){let I=[];if(I.push("Configuration"),I.push(Ip(_.userConfig,_.projectConfig)),I.push(""),_.effectiveRules.length>0)I.push(`   Effective rules (${_.effectiveRules.length} total):`),I.push(_p(_.effectiveRules));else I.push("   Effective rules: (none - using built-in rules only)");return I.join(`
`)}function Ip(_,I){let O=["Scope","Status"],L=(K)=>{if(!K.exists)return nn.dim("N/A");if(!K.valid)return nn.red(`Invalid (${K.errors?.[0]??"unknown error"})`);return nn.green("Configured")},J=[["User",L(_)],["Project",L(I)]];return Jn({headers:O,rows:J})}function As(_){let I=[];return I.push("Environment"),I.push(Tp(_)),I.join(`
`)}function _s(_){let I=_.effectiveSafety.policyScopes,O=["Effective Safety",`   Selected preset: ${_.effectiveSafety.selectedPreset}${I?` (${fr(I.levelScope)})`:""}`,`   Effective: ${_.effectiveSafety.level}`],L=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[J,K]of L){let ne=_.effectiveSafety.capabilities[J],oe=ne.enabled?nn.green("ON"):nn.dim("OFF"),ue=ne.sources.length>0?` (${ne.sources.join(", ")})`:"";O.push(`   ${K}: ${oe} via ${ne.source}${ue}`)}if(I&&I.weakenings.length>0){O.push(`   Project policy deltas${I.weakeningsIgnored?" (ignored)":""}:`);for(let J of I.weakenings)O.push(`      ${J}`)}O.push(`   Stored rule customizations: ${_.effectiveSafety.ruleCounts.stored}`),O.push(`   Effective rule customizations: ${_.effectiveSafety.ruleCounts.effective}`);for(let[J,K]of Object.entries(_.effectiveSafety.ruleOverrides))O.push(`   ${J}: ${K}`);return O.join(`
`)}function Is(_){let I=["Findings"];if(_.length===0)return I.push("   No findings from inspected doctor facts."),I.join(`
`);for(let O of _){let L=`[${O.severity.toUpperCase()}] ${O.checkId}: ${hn(O.title)}`,J=O.severity==="error"?nn.red:O.severity==="warning"?nn.yellow:nn.blue;if(I.push(`   ${J(L)}`),I.push(`      ${hn(O.detail)}`),O.path)I.push(`      Path: ${hn(O.path)}`);if(O.fixHint)I.push(`      Fix: ${hn(O.fixHint)}`)}return I.join(`
`)}function Tp(_){let I=["Variable","Status","Legacy"],O=_.map((L)=>{let J=L.isSet?nn.green("✓"):nn.dim("✗"),K=L.legacyName&&L.legacyIsSet?`${L.legacyName} ${nn.green("✓")}`:L.legacyName??"";return[L.name,J,K]});return Jn({headers:I,rows:O})}function Ts(_){let I=[];if(_.totalBlocked===0)I.push("Recent Activity"),I.push("   No blocked commands in the last 7 days"),I.push("   Tip: This is normal for new installations");else I.push(`Recent Activity · last 7 days (${_.totalBlocked} blocked / ${_.sessionCount} sessions)`),I.push($p(_.recentEntries));if(_.unreadable>0)I.push(`   Warning: ${_.unreadable} audit log ${_.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return I.join(`
`)}function $p(_){let I=["Time","Command"],O=_.map((L)=>{let J=hn(L.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),K=J.length>40?`${J.slice(0,37)}...`:J;return[L.relativeTime,K]});return Jn({headers:I,rows:O})}function $s(_){let I=[];if(I.push("Update Check"),_.latestVersion===null&&!_.error)return I.push(mr([["Status",nn.dim("Skipped")],["Installed",_.currentVersion]])),I.join(`
`);if(_.error)return I.push(mr([["Status",`${nn.yellow("⚠")} Error`],["Installed",_.currentVersion],["Error",nn.dim(_.error)]])),I.join(`
`);if(_.updateAvailable)return I.push(mr([["Status",`${nn.yellow("⚠")} Update Available`],["Current",_.currentVersion],["Latest",nn.green(_.latestVersion??"")]])),I.push(""),I.push("   Run: bunx cc-safety-net@latest doctor"),I.push("   Or:  npx cc-safety-net@latest doctor"),I.join(`
`);return I.push(mr([["Status",`${nn.green("✓")} Up to date`],["Version",_.currentVersion]])),I.join(`
`)}function mr(_){return Jn({rows:_})}function Os(_){let I=[];return I.push("System Info"),I.push(Op(_)),I.join(`
`)}function Op(_){let I=["Component","Version"],O=(K)=>{if(K===null)return nn.dim("not found");return K},J=[{label:"cc-safety-net",value:_.version},...ar.map((K)=>({label:fn(K),value:_.versions[K]??null})),{label:"Node.js",value:_.nodeVersion},{label:"npm",value:_.npmVersion},{label:"Bun",value:_.bunVersion},{label:"Platform",value:_.platform}].map((K)=>[K.label,O(K.value)]);return Jn({headers:I,rows:J})}function Ds(_){if(_.findings.length===0)return nn.green(`
No findings from inspected doctor facts.`);let I={error:_.findings.filter((K)=>K.severity==="error").length,warning:_.findings.filter((K)=>K.severity==="warning").length,info:_.findings.filter((K)=>K.severity==="info").length},O=["error","warning","info"].filter((K)=>I[K]>0).map((K)=>`${I[K]} ${K}`),L=_.findings.length===1?"finding":"findings",J=`
${_.findings.length} ${L}: ${O.join(", ")}.`;if(I.error>0)return nn.red(J);if(I.warning>0)return nn.yellow(J);return nn.blue(J)}import{lstatSync as Dp}from"node:fs";import{dirname as vo}from"node:path";function bo(_,I){try{let O=Dp(I);if(O.isSymbolicLink())return{kind:_,path:I,status:"unsafe",issues:["symlink"]};if(!O.isDirectory())return{kind:_,path:I,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:_,path:I,status:"unknown",issues:[]};let L=[...O.uid!==process.getuid()?["ownership"]:[],...(O.mode&18)!==0?["permissions"]:[]];return{kind:_,path:I,status:L.length>0?"unsafe":"safe",issues:L}}catch(O){if(typeof O==="object"&&O!==null&&"code"in O&&O.code==="ENOENT")return{kind:_,path:I,status:"not-applicable",issues:[]};return{kind:_,path:I,status:"unknown",issues:[]}}}function Ls(_,I){let O=F(_);return{directories:[bo("policy",vo(vo(I))),bo("config",vo(I)),...O?[bo("audit",O)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as Lp}from"node:child_process";import{existsSync as Ns}from"node:fs";import{delimiter as Np,extname as jp,join as Fp}from"node:path";import{stripVTControlCharacters as js}from"node:util";var Hs="2.5.2",Hp=5000,Mp="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function un(){return Hs}function wo(_,I){let O=_[I];if(O)return O;let L=Object.keys(_).find((J)=>J.toLowerCase()===I.toLowerCase()&&!!_[J]);return L?_[L]:O}function Up(_){return(wo(_,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((I)=>I.length>0)}function Gp(_,I){let O=jp(_)?[_]:[...Up(I).map((L)=>`${_}${L}`),_];if(_.includes("/")||_.includes("\\"))return O.find((L)=>Ns(L))??_;return(wo(I,"PATH")??"").split(Np).flatMap((L)=>O.map((J)=>Fp(L,J))).find((L)=>Ns(L))??_}function Fs(_){if(!/[\s"&|<>^]/.test(_))return _;return`"${_.replace(/"/g,'""')}"`}function Wn(_,I){let[O,...L]=_,J=I[Mp]==="win32"?"win32":process.platform;if(!O||J!=="win32")return{cmd:O??"",args:L};let K=Gp(O,I);if(!/\.(?:bat|cmd)$/i.test(K))return{cmd:K,args:L};return{cmd:wo(I,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",Fs(K),...L.map(Fs)].join(" ")]}}var bt=async(_,I=Hp)=>{let O=await Bp(_,{timeoutMs:I});if(O.code!==0)return null;return js(O.stdout).trim()||js(O.stderr).trim()||null};function Bp(_,I){let[O,...L]=_;if(!O)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((J)=>{try{let K=Wn([O,...L],process.env),ne=Lp(K.cmd,K.args,{stdio:["ignore","pipe","pipe"]}),oe=!1,ue="",pe="";ne.stdout.on("data",(Ce)=>{ue+=Ce.toString()}),ne.stderr.on("data",(Ce)=>{pe+=Ce.toString()});let ve=(Ce)=>{if(oe)return;oe=!0,clearTimeout(we),J(Ce)},we=setTimeout(()=>{ne.kill(),ve({code:null,stdout:ue,stderr:pe})},I.timeoutMs);ne.on("close",(Ce)=>{ve({code:Ce,stdout:ue,stderr:pe})}),ne.on("error",()=>{ve({code:null,stdout:ue,stderr:pe})})}catch{J({code:null,stdout:"",stderr:""})}})}function gr(_){if(!_)return null;let I=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(_);if(I)return I[1]??null;let O=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(_);if(O)return O[1]??null;return _.split(`
`)[0]?.trim()||null}async function hr(_,I=bt,O=process.cwd()){let L=Promise.all(Pn.map(async(we)=>[we.id,gr(await I([...we.probeCommand]))])),[J,K,ne,oe,ue,pe,ve]=await Promise.all([L,L.then(async(we)=>{let Ce=we.find(([en])=>en==="opencode")?.[1];if(!Ce?.startsWith("2.")||!_(Ce))return null;let Pe=["--param",`location[directory]=${O}`],Se=["opencode","api","integration.list",...Pe];return await I(Se,30000),I(["opencode","api","plugin.list",...Pe],30000)}),I(["codex","plugin","list"],30000),I(["amp","plugins","list"],30000),I(["node","--version"]),I(["npm","--version"]),I(["bun","--version"])]);return{version:Hs,versions:Object.fromEntries(J),codexPluginListOutput:ne,ampPluginListOutput:oe,openCodePluginListOutput:K,nodeVersion:gr(ue),npmVersion:gr(pe),bunVersion:gr(ve),platform:`${process.platform} ${process.arch}`}}function ko(_,I){if(I==="dev")return!1;let O=_.split(".").map(Number),L=I.split(".").map(Number),[J=0,K=0,ne=0]=O,[oe=0,ue=0,pe=0]=L;if(J!==oe)return J>oe;if(K!==ue)return K>ue;return ne>pe}async function Un(){let _=un(),I=new AbortController,O=setTimeout(()=>I.abort(),3000);try{let L=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:I.signal});if(!L.ok)return{currentVersion:_,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${L.status}`};let J=await L.json(),K=ko(J.version,_);return{currentVersion:_,latestVersion:J.version,updateAvailable:K}}catch(L){return{currentVersion:_,latestVersion:null,updateAvailable:!1,error:L instanceof Error?L.message:"Network error"}}finally{clearTimeout(O)}}import*as Js from"node:readline";var Bs=(_)=>`\x1B[${_}B`,qp=(_)=>`\x1B[${_}A`;var Ms=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Vp(_){return new Promise((I)=>setTimeout(I,_))}function zp(_,I,O){if(!O)return I(_);if(O.aborted)return Promise.resolve();return new Promise((L,J)=>{let K=()=>O.removeEventListener("abort",ne),ne=()=>{K(),L()};O.addEventListener("abort",ne,{once:!0}),I(_).then(()=>{K(),L()},(oe)=>{K(),J(oe)})})}function yr(_){return Math.max(0,Math.min(1,_))}function wt(_){return Math.max(0,Math.min(255,Math.round(_)))}function xo(_){return _<=0.0031308?12.92*_:1.055*_**0.4166666666666667-0.055}function Jp(_,I,O){let L=O*Math.PI/180,J=I*Math.cos(L),K=I*Math.sin(L),ne=(_+0.3963377774*J+0.2158037573*K)**3,oe=(_-0.1055613458*J-0.0638541728*K)**3,ue=(_-0.0894841775*J-1.291485548*K)**3;return{blue:wt(xo(yr(-0.0041960863*ne-0.7034186147*oe+1.707614701*ue))*255),green:wt(xo(yr(-1.2684380046*ne+2.6097574011*oe-0.3413193965*ue))*255),red:wt(xo(yr(4.0767416621*ne-3.3077115913*oe+0.2309699292*ue))*255)}}function So(_,I){let O=(I*_*180/Math.PI%360+360)%360;return Jp(0.72,0.15,O)}function qs(_,I=0.1){let O=So(I,_);return`\x1B[38;2;${O.red};${O.green};${O.blue}m`}function Wp(_,I){return{blue:wt(_.blue+(255-_.blue)*I),green:wt(_.green+(255-_.green)*I),red:wt(_.red+(255-_.red)*I)}}function Vs(_,I,O){let L=Math.imul(_+2654435769,2246822507)^Math.imul(I+3266489909,668265263)^Math.imul(O+374761393,2654435761),J=L^L>>>15,K=Math.imul(J,739982445),ne=K^K>>>12,oe=Math.imul(ne,695872825);return((oe^oe>>>15)>>>0)/4294967296}function Kp(_,I,O){let L=Math.floor(Vs(_,I,O)*Ms.length);return Ms[L]??"░"}function Us(_){let I=yr(_);return I*I*I*(I*(I*6-15)+10)}function Yp(_){if(_.length===0)return"";let I=[],O=!1,L="";for(let J of _){let K=`${J.red};${J.green};${J.blue}`;if(J.bold!==O)I.push(J.bold?"\x1B[1m":"\x1B[22m"),O=J.bold;if(K!==L)I.push(`\x1B[38;2;${K}m`),L=K;I.push(J.character)}return`${I.join("")}\x1B[22m\x1B[39m`}function Zp(_,I,O,L,J){return _.map((K,ne)=>({...So(O,L+I+ne/J),bold:!1,character:K}))}function Xp(_,I,O,L,J,K,ne,oe){let ue=Math.max(1,L*0.75),pe=Math.min(1,O/ue),ve=J*Us(pe),we=Math.max(0,(O-ue)/Math.max(1,L-ue)),Ce=(1-Us(O/L))*oe*2,Pe=0.35*Math.max(0,1-we*2),Se=pe>=1,en=Math.min(_.length,Math.ceil(ve+2+1));return _.slice(0,en).map((Le,Ve)=>{let on=So(K,ne+I+Ve/oe+Ce),sn=Ve+Vs(I,Ve,7919)*2-1;if(sn>ve+2)return{...on,bold:!1,character:" "};let an=ve-sn,rn=0.8*Math.exp(-(an*an)/12.5),pn=Math.min(0.9,rn+Pe),On=!Se&&sn>ve-4;return{...Wp(on,pn),bold:pn>0.3,character:On?Kp(I,Ve,O):Le}})}function Gs(_){return`\x1B[?2026h${_.map((I,O)=>`\x1B8${O>0?Bs(O):""}${Yp(I)}`).join("")}\x1B[?2026l`}async function Co(_,I={}){if(!_)return;let O=I.output??process.stdout,L=I.sleep??Vp,J=I.seed??0,K=_.split(`
`).map((ve)=>Array.from(ve)),ne=Math.max(...K.map((ve)=>ve.length)),oe=12000*K.filter((ve)=>ve.length>0).length/40,ue=ne>0?Math.max(1,Math.ceil(oe/16.666666666666668)):0,pe=ue>0?oe/ue:0;O.write(`\x1B[?25l${K.length>1?`${`
`.repeat(K.length-1)}${qp(K.length-1)}`:""}\x1B7`);try{for(let ve=1;ve<=ue;ve+=1){if(I.signal?.aborted)break;O.write(Gs(K.map((we,Ce)=>Xp(we,Ce,ve,ue,ne,0.1,J,3)))),await zp(pe,L,I.signal)}}finally{if(O.write(Gs(K.map((ve,we)=>Zp(ve,we,0.1,J,3)))),O.write("\x1B8"),K.length>1)O.write(Bs(K.length-1));O.write(`
\x1B[0m\x1B[?25h`)}}var zs=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function Qp(_){return Boolean(_.isTTY)}async function $t(_={}){let I=_.output??process.stdout;if(!Qp(I))return;let O=_.input??process.stdin,L={output:I,seed:_.seed??Math.random()*8192,sleep:_.sleep};if(!O.isTTY||typeof O.setRawMode!=="function"){await Co(zs,L);return}let J=new AbortController,K=O.readableFlowing===!0,ne=O.isRaw===!0,oe=!1,ue=(pe,ve)=>{if(ve.ctrl&&ve.name==="c")oe=!0;if(oe||ve.name==="return"||ve.name==="enter")J.abort()};Js.emitKeypressEvents(O),O.on("keypress",ue),O.setRawMode(!0),O.resume();try{await Co(zs,{...L,signal:J.signal})}finally{if(O.off("keypress",ue),O.setRawMode(ne),!K)O.pause()}if(!oe)return;if(_.onInterrupt){_.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as of}from"node:crypto";import{existsSync as Ys}from"node:fs";import{dirname as vr,join as Zs}from"node:path";import{dirname as Ws,join as ef,resolve as nf}from"node:path";var tf="rule.lock";function rf(_){return ef(Ws(_),tf)}function Ks(_={}){return nf(_.cwd??process.cwd(),".safety-net.json")}function wn(_,I){let O=I.global?I.userConfigPath??G(_,I):I.projectConfigPath??U(I.cwd??process.cwd()),L=I.global?Ke(_,I):Je(O,I.cwd??process.cwd()),J=rf(O);return{configDir:Ws(O),configPath:O,lockPath:J,filesystemScope:L,configTarget:i(L,O),lockTarget:i(L,J)}}var sf="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",af="cache",lf="rulebooks";function Xs(_,I={}){let O=wn(_,I),L=i(O.filesystemScope,ea(O.configDir)),J=r(O.lockTarget);if(console.log(sf),J===null&&!Ys(L.path))return console.log(`No v2 lock or cache leftovers found in ${vr(O.configDir)}; nothing to migrate.`),0;let K=ff(J),ne=m(O.configTarget);if(!ne.config&&(r(O.configTarget)!==null||K.size>0))return console.error(`Cannot migrate: the rules config in ${vr(O.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let oe=ne.config?.rules??[];for(let ue of oe.flatMap((pe)=>cf(pe,K,O,L,I.global===!0)))console.log(ue);return j(O.lockTarget),it(L),console.log(`Removed the v2 lock and cache under ${vr(O.configDir)}.`),0}function Qs(_,I){return[...new Set([{cwd:I},{cwd:I,global:!0}].flatMap((O)=>{let L=wn(_,O);return[L.lockPath,ea(L.configDir)]}))].filter((O)=>Ys(O))}function cf(_,I,O,L,J){if(!S(_))return[];let K=D(_).name,ne=i(O.filesystemScope,N(O.configDir,K)),oe=r(ne);if(oe!==null&&df(oe,K))return[];let ue=I.get(_),pe=ue?uf(ue,K,L.path,O.filesystemScope):null;if(pe===null)return[`Could not migrate ${_} from the v2 cache. Run \`cc-safety-net rule update ${_}${J?" --global":""}\` to vendor it.`];if(g(ne,pe),oe!==null)return[`Restored ${_} from the v2 cache over an invalid file.`];return[`Vendored ${_} from the v2 cache.`]}function df(_,I){let O=be(_);return!("problem"in O)&&O.rulebook.name===I}function uf(_,I,O,L){let J=Zs(O,lf,`${pf(_)}--${_.digest.replace("sha256:","").slice(0,12)}`,me),K=r(i(L,J));if(K===null||hf(K)!==_.digest)return null;let ne=be(K);if("problem"in ne||ne.rulebook.name!==I)return null;return K}function ea(_){return Zs(vr(_),af)}function pf(_){return([_.owner,_.repo,_.display_ref,_.name].every((L)=>typeof L==="string"&&L!=="")?`${_.owner}/${_.repo}#${_.display_ref}/${_.name}`:_.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function ff(_){let I=_===null?null:gf(_),O=na(I)&&Array.isArray(I.rulebooks)?I.rulebooks:[];return new Map(O.filter(mf).map((L)=>[L.spec,L]))}function mf(_){return na(_)&&typeof _.spec==="string"&&typeof _.digest==="string"}function na(_){return!!_&&typeof _==="object"}function gf(_){try{return JSON.parse(_)}catch{return null}}function hf(_){return`sha256:${of("sha256").update(_).digest("hex")}`}var ta="\r\x1B[2K",yf="\x1B[?25l",vf="\x1B[39m",bf="\x1B[?25h",wf=100,kf=0.55,xf=80,ra=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function Sf(_){return new Promise((I)=>setTimeout(I,_))}async function br(_,I={}){let O=I.output??process.stdout;if(!O.isTTY)return _;let L=I.sleep??Sf,J=!1,K=_.then((oe)=>(J=!0,oe),(oe)=>{throw J=!0,oe});if(await Promise.race([K.then(()=>!0),L(wf).then(()=>!1)]))return K;O.write(yf);try{for(let oe=0;!J;oe+=1)O.write(`${ta}${qs(oe*kf)}${ra[oe%ra.length]}${vf} ${I.loadingMessage??"Loading…"}`),await Promise.race([K,L(xf)]);return await K}finally{O.write(`${ta}${bf}`)}}async function Ot(_,I,O,L={}){let J=I();if(_)await O();if(_&&J.ready)await br(J.ready,L);return J.finish()}import{stripVTControlCharacters as Cf}from"node:util";var wr="amp plugins list",Rf=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function oa(_){if(!_.ampPluginListOutput)return{platform:"amp",status:"n/a"};let I=Cf(_.ampPluginListOutput).split(`
`).map((O)=>Rf.exec(O)?.[1]).find((O)=>O!==void 0);if(!I)return{platform:"amp",status:"n/a"};if(I!=="active")return{platform:"amp",status:"disabled",method:wr,configPath:wr,errors:[`Amp personal plugin cc-safety-net is ${I}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:wr,configPath:wr}}import{existsSync as If,readFileSync as Tf}from"node:fs";import{isAbsolute as Yk,join as _f}from"node:path";function Dt(_){return _f(_,".gemini","config","hooks.json")}var $f=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function Of(_){if(!_||typeof _!=="object"||Array.isArray(_))return[];return Object.values(_).flatMap((I)=>{if(!I||typeof I!=="object"||Array.isArray(I))return[];let O=I,L=O.PreToolUse;if(!Array.isArray(L))return[];return L.flatMap((J)=>{if(!J||typeof J!=="object"||Array.isArray(J))return[];let K=J.hooks;if(!Array.isArray(K))return[];return K.flatMap((ne)=>{if(!ne||typeof ne!=="object"||Array.isArray(ne))return[];let oe=ne.command;if(typeof oe!=="string"||!$f.test(oe))return[];return[{command:oe,enabled:O.enabled!==!1}]})})})}function ia(_){let I=Dt(_.environment.home);if(!If(I))return{platform:"antigravity-cli",status:"n/a",configPath:I};let O;try{O=Of(JSON.parse(Tf(I,"utf-8")))}catch(L){return{platform:"antigravity-cli",status:"n/a",configPath:I,errors:[`Failed to parse Antigravity hooks config ${I}: ${L instanceof Error?L.message:String(L)}`]}}if(O.some((L)=>L.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:I};if(O.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:I};return{platform:"antigravity-cli",status:"n/a",configPath:I}}import{join as Po}from"node:path";import{existsSync as Df,lstatSync as Lf,readFileSync as Nf}from"node:fs";import{join as jf}from"node:path";function Cn(_,I=(O)=>O){if(!Df(_))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(I(Nf(_,"utf-8")))}}catch{return{kind:"unreadable"}}}function Nn(_,I){if(_==="~")return I;if(_.startsWith("~/")||_.startsWith("~\\"))return jf(I,_.slice(2));return _}function cn(_){try{return Lf(_)}catch{return}}function kr(_,I){let O=cn(I);if(!O)return{platform:_,status:"n/a",configPath:I};if(!O.isSymbolicLink()&&O.isDirectory())return;return{platform:_,status:"n/a",configPath:I,errors:[`${I} is a symlink or not a directory; move or remove it before installing`]}}function tn(_,I){return typeof _==="object"&&_!==null?_[I]:void 0}var Ro="cc-safety-net@cc-marketplace";function xr(_){return _.env.get("CLAUDE_CONFIG_DIR")||Po(_.home,".claude")}function sa(_){return Po(xr(_),"plugins","installed_plugins.json")}function aa(_,I){let O=tn(tn(_,"plugins"),I);return Array.isArray(O)&&O.length>0}function Sr(_,I){let O=Cn(sa(_));return O.kind==="ok"&&aa(O.value,I)}function Eo(_){let I=sa(_),O=Cn(I);if(O.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(O.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!aa(O.value,Ro))return{platform:"claude-code",status:"n/a"};let L=Po(xr(_),"settings.json"),J=Cn(L);if(J.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(J.kind==="ok"&&tn(tn(J.value,"enabledPlugins"),Ro)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:L,errors:[`${Ro} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:I}}function la(_){return Eo(_.environment)}var ca="Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.";function da(_){if(!_.codexPluginListOutput)return{platform:"codex",status:"n/a"};let I=_.codexPluginListOutput.split(`
`).find((O)=>O.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!I)return{platform:"codex",status:"n/a"};if(!I.includes("installed,"))return{platform:"codex",status:"n/a"};if(!I.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex runs only trusted hooks, and doctor cannot check trust. Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."]}}import{existsSync as Er,readdirSync as Ff,readFileSync as Hf}from"node:fs";import{join as vn}from"node:path";function xn(_){let I="",O=0,L=!1,J=!1,K=-1;while(O<_.length){let ne=_[O],oe=_[O+1];if(J){I+=ne,J=!1,O++;continue}if(ne==='"'&&!L){L=!0,K=-1,I+=ne,O++;continue}if(ne==='"'&&L){L=!1,I+=ne,O++;continue}if(ne==="\\"&&L){J=!0,I+=ne,O++;continue}if(L){I+=ne,O++;continue}if(ne==="/"&&oe==="/"){while(O<_.length&&_[O]!==`
`)O++;continue}if(ne==="/"&&oe==="*"){O+=2;while(O<_.length-1){if(_[O]==="*"&&_[O+1]==="/"){O+=2;break}O++}continue}if(ne===","){K=I.length,I+=ne,O++;continue}if(ne==="}"||ne==="]"){if(K!==-1){let ue=I.slice(K+1);if(/^\s*$/.test(ue))I=I.slice(0,K)+ue}K=-1,I+=ne,O++;continue}if(!/\s/.test(ne))K=-1;I+=ne,O++}return I}function pa(_,I,O){let L=I+1,J=!1;while(L<_.length){if(J){J=!1,L++;continue}if(_[L]==="\\"){J=!0,L++;continue}if(_[L]==='"')return L+1;L++}throw Error(O)}function _o(_,I,O){let L=_[I],J=L==="["?"]":"}",K=0,ne=I;while(ne<_.length){let oe=O.skipComment?.(_,ne)??ne;if(oe!==ne){ne=oe;continue}if(_[ne]==='"'){ne=pa(_,ne,O.stringError);continue}if(_[ne]===L)K++;if(_[ne]===J){if(K--,K===0)return ne}ne++}throw Error(O.bracketError)}function fa(_,I){let O=_.lastIndexOf(`
`,I)+1;return/^[ \t]*/.exec(_.slice(O))?.[0]??""}function ma(_,I){let O=I.end+(/^\s*/.exec(_.slice(I.end))?.[0].length??0);if(_[O]===","){let ne=_[O+1]===`
`?O+2:O+1;return`${_.slice(0,I.start)}${_.slice(ne)}`}let L=_.slice(0,I.start).search(/\s*$/)-1;if(_[L]!==",")return`${_.slice(0,I.start)}${_.slice(I.end)}`;let J=_.lastIndexOf(`
`,L-1),K=J!==-1&&/^\s*$/.test(_.slice(J+1,L))?J:L;return`${_.slice(0,K)}${_.slice(I.end)}`}function Ao(_,I){if(_.startsWith("//",I)){let O=_.indexOf(`
`,I+2);return O===-1?_.length:O+1}if(_.startsWith("/*",I)){let O=_.indexOf("*/",I+2);return O===-1?_.length:O+2}return I}function ua(_,I){let O=I;while(O<_.length){if(/\s/.test(_[O]??"")){O++;continue}let L=Ao(_,O);if(L===O)return O;O=L}return O}function ga(_,I,O){let L=0,J=0;while(J<_.length){let K=Ao(_,J);if(K!==J){J=K;continue}if(_[J]==='"'){let ne=pa(_,J,O.stringError);if(L===1&&JSON.parse(_.slice(J,ne))===I){let oe=ua(_,ne),ue=ua(_,oe+1);if(_[oe]===":"&&_[ue]==="[")return{start:ue,end:_o(_,ue,{skipComment:Ao,...O})}}J=ne;continue}if(_[J]==="{"||_[J]==="[")L++;if(_[J]==="}"||_[J]==="]")L--;J++}return}var An="cc-safety-net@cc-marketplace",Cr=["cc-marketplace","cc-safety-net"],ha=["_direct","copilot-safety-net"],ya=["cc-marketplace","safety-net"],va="safety-net@cc-marketplace";function Rr(_,I){let O=I.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${O}([^a-z0-9-]|$)`,"m").test(_??"")}function ba(_){return Rr(_,"cc-safety-net@cc-marketplace")}function wa(_){return Rr(_,"cc-marketplace")}function ka(_){return Rr(_,"copilot-safety-net")}function xa(_){return Rr(_,"safety-net@cc-marketplace")}function Pr(_){if(!_?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(_)}function Ca(_,I){if(!_)return null;let O=_.match(/(\d+)\.(\d+)\.(\d+)/);if(!O)return null;let L=[Number(O[1]),Number(O[2]),Number(O[3])];for(let J=0;J<I.length;J++){let K=L[J]??0,ne=I[J]??0;if(K!==ne)return K>ne}return!0}function Mf(_){return Ca(_,[0,0,422])}function Uf(_){return Ca(_,[1,0,8])}function Nt(_){return _.env.get("COPILOT_HOME")||vn(_.home,".copilot")}function Io(_){return(_.hooks?.preToolUse??[]).some((O)=>{if(O.type!==void 0&&O.type!=="command")return!1;return Pr(O.command)||Pr(O.bash)||Pr(O.powershell)||Pr(O.exec&&[O.exec,...O.args??[]].join(" "))})}function Lt(_){return _===void 0||typeof _==="string"}function Gf(_){return _===void 0||Array.isArray(_)&&_.every((I)=>typeof I==="string")}function Bf(_){if(!_||typeof _!=="object"||Array.isArray(_))return!1;let I=_;if(I.disableAllHooks!==void 0&&typeof I.disableAllHooks!=="boolean")return!1;if(I.hooks===void 0)return!0;if(!I.hooks||typeof I.hooks!=="object"||Array.isArray(I.hooks))return!1;let O=I.hooks.preToolUse;if(O===void 0)return!0;return Array.isArray(O)&&O.every((L)=>L!==null&&typeof L==="object"&&!Array.isArray(L)&&Lt(L.type)&&Lt(L.command)&&Lt(L.bash)&&Lt(L.powershell)&&Lt(L.exec)&&Gf(L.args))}function To(_,I){try{let O=JSON.parse(xn(Hf(_,"utf-8")));if(!Bf(O)){I?.push(`Invalid hook config ${_}: hooks.preToolUse must be an array of hook objects`);return}return O}catch(O){I?.push(`Failed to parse ${_}: ${O instanceof Error?O.message:String(O)}`);return}}function Ra(_,I){try{return Ff(_).filter((O)=>O.endsWith(".json")).sort((O,L)=>O.localeCompare(L))}catch(O){return I?.push(`Failed to read ${_}: ${O instanceof Error?O.message:String(O)}`),[]}}function qf(_,I){if(!Er(_))return[];let O=[];for(let L of Ra(_,I)){let J=vn(_,L),K=To(J,I);if(K&&Io(K))O.push(J)}return O}function kt(_,I){if(!Er(_))return;let O=To(_,I);if(!O)return;return{path:_,config:O}}function Sa(_,I,O,L){if(I){_.push(`GitHub Copilot CLI ${I} does not support ${O}; requires ${L}+`);return}_.push(`GitHub Copilot CLI version unavailable; skipping ${O} because it requires ${L}+`)}function Vf(_){for(let I of _){if(I?.config.disableAllHooks===!0)return I.path;if(I?.config.disableAllHooks===!1)return}return}function zf(_,I,O,L){let J=Nt(_),K=vn(I,".github","hooks"),ne=vn(J,"hooks"),oe=vn(I,".github","copilot"),ue=vn(I,".claude"),pe=Uf(O),ve=pe===!0?L:void 0,we=[kt(vn(oe,"settings.local.json"),ve),kt(vn(oe,"settings.json"),ve),kt(vn(ue,"settings.local.json"),ve),kt(vn(ue,"settings.json"),ve)],Ce=[kt(vn(J,"settings.json"),ve),kt(vn(J,"config.json"),ve)];if(pe!==!1){let an=Vf([...we,...Ce]);if(an){if(pe===null)L.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${an} as active`);return{activeConfigPaths:[],repoInlineSources:we,disabledBy:an}}}let Pe=qf(K,L),Se=Mf(O),en=Se===!0?L:void 0,Le=Er(ne)?Ra(ne,en):[],Ve=[];for(let an of Le){let rn=vn(ne,an),pn=To(rn,en);if(pn&&Io(pn))Ve.push(rn)}if(Se!==!0&&Ve.length>0)Sa(L,O,`user hook files in ${ne}`,"0.0.422"),Ve.length=0;let on=[];for(let an of[...we,...Ce]){if(!an)continue;if(!Io(an.config))continue;if(pe===!0){on.push(an);continue}Sa(L,O,"inline hook definitions in Copilot config files","1.0.8");break}let sn=(an)=>an.filter((rn)=>!!rn&&on.includes(rn)).map((rn)=>rn.path);return{activeConfigPaths:[...sn(we),...Pe,...sn(Ce),...Ve],repoInlineSources:we}}function Pa(_){let I=[],O=zf(_.environment,_.cwd,_.copilotCliVersion,I);if(O.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:O.disabledBy,configPaths:[O.disabledBy],errors:I.length>0?I:void 0};let L=Nt(_.environment),J=vn(L,"installed-plugins",...Cr),K=Er(J),ne=vn(L,"settings.json"),oe=Cn(ne,xn),ue=(Pe)=>tn(tn(Pe,"enabledPlugins"),An),pe=O.repoInlineSources.find((Pe)=>typeof ue(Pe?.config)==="boolean"),ve=pe??(oe.kind==="ok"?{path:ne,config:oe.value}:void 0);if(K&&!pe&&oe.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};let we=K&&ve!==void 0&&ue(ve.config)===!1;if(we&&O.activeConfigPaths.length===0)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:ve.path,errors:[`${An} is installed but not enabled in Copilot CLI`]};let Ce=K&&!we;if(Ce||O.activeConfigPaths.length>0){let Pe=O.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:Ce?"plugin config":"hook config",configPath:Pe??(Ce?J:void 0),configPaths:O.activeConfigPaths.length>0?O.activeConfigPaths:void 0,errors:I.length>0?I:void 0}}return{platform:"copilot-cli",status:"n/a",errors:I.length>0?I:void 0}}import{existsSync as tm,readFileSync as rm}from"node:fs";import{existsSync as Ea,mkdirSync as Kf,readFileSync as Yf}from"node:fs";import{dirname as Zf,join as Xf}from"node:path";import{renameSync as Jf,writeFileSync as Wf}from"node:fs";function mn(_,I){let O=`${_}.${process.pid}.tmp`;Wf(O,I),Jf(O,_)}var _n=Object.fromEntries(Tt.map((_)=>[_.id,`npx -y cc-safety-net hook ${_.flags[1]}`]));var jt=_n.cursor,Aa=30;function _r(_){return Xf(_.home,".cursor","hooks.json")}function Kn(_){return typeof _==="object"&&_!==null&&!Array.isArray(_)}function $o(){return{command:jt,timeout:Aa,failClosed:!0}}function Ar(_){return Kn(_)&&_.command===jt}function Qf(_){return Object.keys(_).length===3&&_.command===jt&&_.timeout===Aa&&_.failClosed===!0}function em(_){try{return JSON.parse(Yf(_,"utf-8"))}catch(I){if(I instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${_}: ${I.message}`);throw I}}function _a(_){let I=em(_);if(!Kn(I))throw Error(`Cursor hooks config ${_} must be a JSON object`);if(I.version!==1)throw Error(`Cursor hooks config ${_} must set "version": 1`);if(I.hooks!==void 0&&!Kn(I.hooks))throw Error(`Cursor hooks config ${_} "hooks" must be an object`);let O=Kn(I.hooks)?I.hooks.preToolUse:void 0;if(O!==void 0&&!Array.isArray(O))throw Error(`Cursor hooks config ${_} "hooks.preToolUse" must be an array`);return I}function Ia(_){let I=Kn(_.hooks)?_.hooks.preToolUse:void 0;return Array.isArray(I)?I:[]}function nm(_){if(!_.some(Ar))return[..._,$o()];return _.reduce((I,O)=>{if(!Ar(O))return I.result.push(O),I;if(!I.inserted)I.result.push($o()),I.inserted=!0;return I},{result:[],inserted:!1}).result}function Ta(_,I,O){let L=Kn(I.hooks)?I.hooks:{},J={...I,hooks:{...L,preToolUse:O}};mn(_,`${JSON.stringify(J,null,2)}
`)}function $a(_){let I=_r(_);if(!Ea(I))return Kf(Zf(I),{recursive:!0}),mn(I,`${JSON.stringify({version:1,hooks:{preToolUse:[$o()]}},null,2)}
`),{path:I,alreadyInstalled:!1};let O=_a(I),L=Ia(O),J=L.filter(Ar);if(Kn(O.hooks)&&Array.isArray(O.hooks.preToolUse)&&J.length===1&&J[0]!==void 0&&Qf(J[0]))return{path:I,alreadyInstalled:!0};return Ta(I,O,nm(L)),{path:I,alreadyInstalled:!1}}function Oa(_){let I=_r(_);if(!Ea(I))return{path:I,alreadyInstalled:!1};let O=_a(I),L=Ia(O),J=L.filter((K)=>!Ar(K));if(J.length===L.length)return{path:I,alreadyInstalled:!1};return Ta(I,O,J),{path:I,alreadyInstalled:!0}}function om(_){if(!_||typeof _!=="object"||Array.isArray(_))return[];let I=_.hooks;if(!I||typeof I!=="object"||Array.isArray(I))return[];let O=I.preToolUse;if(!Array.isArray(O))return[];return O.filter((L)=>!!L&&typeof L==="object"&&!Array.isArray(L)&&L.command===jt)}function im(_){let I=[];if(_.length>1)I.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let O=_[0];if(O&&O.failClosed!==!0)I.push('Managed hook is missing "failClosed": true; reinstall to repair');if(O&&O.timeout!==30)I.push('Managed hook "timeout" is not 30; reinstall to repair');return I}function Da(_){let I=_r(_.environment);if(!tm(I))return{platform:"cursor",status:"n/a",configPath:I};let O;try{O=JSON.parse(rm(I,"utf-8"))}catch(K){return{platform:"cursor",status:"n/a",configPath:I,errors:[`Failed to parse Cursor hooks config ${I}: ${K instanceof Error?K.message:String(K)}`]}}let L=om(O);if(L.length===0)return{platform:"cursor",status:"n/a",configPath:I};let J=im(L);return{platform:"cursor",status:"configured",method:"hook config",configPath:I,errors:J.length>0?J:void 0}}import{readdirSync as sm}from"node:fs";import{join as Oo,resolve as am}from"node:path";var Do="cc-safety-net";function Lo(_){let I=_.env.get("DSH_HOME");return Oo(I?.trim()?am(Nn(I,_.home)):Oo(_.home,".dsh"),"profiles")}function La(_){let I=Lo(_),O=cn(I)?.isDirectory()?sm(I,{withFileTypes:!0}).filter((J)=>J.isDirectory()&&J.name!=="node_modules").map((J)=>{let K=Oo(I,J.name,"package.json");return{name:J.name,configPath:K,manifest:Cn(K)}}):[];return{installed:O.flatMap((J)=>{if(J.manifest.kind!=="ok")return[];let K=J.manifest.value;if(tn(tn(K,"dependencies"),Do)===void 0)return[];let ne=tn(tn(tn(K,"dsh"),"profile"),"bundles");return[{name:J.name,configPath:J.configPath,enabled:Array.isArray(ne)&&ne.includes(Do)}]}),unreadable:O.some((J)=>J.manifest.kind==="unreadable")}}function No(_){return La(_).installed}function Na(_){let I=La(_.environment),O=I.installed.filter((K)=>K.enabled),L=I.installed.filter((K)=>!K.enabled),J=L.map((K)=>`${Do} is installed in the ${K.name} profile but its bundle is disabled`);if(O.length>0)return{platform:"deepseek-harness",status:"configured",method:"dsh bundle",configPaths:O.map((K)=>K.configPath),...J.length>0?{errors:J}:{}};if(L.length>0)return{platform:"deepseek-harness",status:"disabled",method:"dsh bundle",configPaths:L.map((K)=>K.configPath),errors:J};return I.unreadable?{platform:"deepseek-harness",status:"not-inspected"}:{platform:"deepseek-harness",status:"n/a"}}import{existsSync as lm}from"node:fs";import{join as jo}from"node:path";var Fo="gemini-safety-net";function Ho(_){let I=jo(_.home,".gemini","extensions"),O=jo(I,Fo);if(!lm(O))return{platform:"gemini-cli",status:"n/a"};let L=jo(I,"extension-enablement.json"),J=Cn(L);if(J.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let K=J.kind==="ok"?tn(tn(J.value,Fo),"overrides"):void 0;if(Array.isArray(K)&&K.some((oe)=>typeof oe==="string"&&oe.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:L,errors:[`${Fo} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:O}}function ja(_){return Ho(_.environment)}import{existsSync as pm,readFileSync as fm}from"node:fs";import{existsSync as Ha,mkdirSync as cm,readFileSync as Ma,rmSync as dm}from"node:fs";import{dirname as um,join as Fa}from"node:path";var Ft=_n["grok-build"],$r=30;function Or(_){return Fa(_.env.get("GROK_HOME")??Fa(_.home,".grok"),"hooks","cc-safety-net.json")}function Yn(_){return typeof _==="object"&&_!==null&&!Array.isArray(_)}function Ir(){return{hooks:[{type:"command",command:Ft,timeout:$r}]}}function Ua(_){return Yn(_)&&_.command===Ft}function Ga(_){return _.flatMap((I)=>{if(!Yn(I)||!Array.isArray(I.hooks))return[I];let O=I.hooks.filter((L)=>!Ua(L));if(O.length===I.hooks.length)return[I];return O.length===0?[]:[{...I,hooks:O}]})}function Ba(_){try{let I=JSON.parse(_);return Yn(I)?I:null}catch{return null}}function qa(_){let I=Yn(_.hooks)?_.hooks.PreToolUse:void 0;return Array.isArray(I)?I:[]}function Tr(_,I,O){let L=Yn(I.hooks)?I.hooks:{};mn(_,`${JSON.stringify({...I,hooks:{...L,PreToolUse:O}},null,2)}
`)}function Va(_){let I=Or(_);if(!Ha(I))return cm(um(I),{recursive:!0}),Tr(I,{},[Ir()]),{path:I,alreadyInstalled:!1};let O=Ba(Ma(I,"utf-8"));if(!O)return Tr(I,{},[Ir()]),{path:I,alreadyInstalled:!1};let L=qa(O),J=L.filter((K)=>Yn(K)&&Array.isArray(K.hooks)&&K.hooks.some(Ua));if(J.length===1&&JSON.stringify(J[0])===JSON.stringify(Ir()))return{path:I,alreadyInstalled:!0};return Tr(I,O,[...Ga(L),Ir()]),{path:I,alreadyInstalled:!1}}function za(_){let I=Or(_);if(!Ha(I))return{path:I,alreadyInstalled:!1};let O=Ba(Ma(I,"utf-8"));if(!O)return{path:I,alreadyInstalled:!1};let L=qa(O),J=Ga(L);if(JSON.stringify(J)===JSON.stringify(L))return{path:I,alreadyInstalled:!1};let K=Yn(O.hooks)?O.hooks:{};if(J.length===0&&Object.keys(O).length===1&&Object.keys(K).length===1)return dm(I),{path:I,alreadyInstalled:!0};return Tr(I,O,J),{path:I,alreadyInstalled:!0}}function Ht(_){return!!_&&typeof _==="object"&&!Array.isArray(_)}function mm(_){if(!Ht(_)||!Ht(_.hooks))return[];let I=_.hooks.PreToolUse;if(!Array.isArray(I))return[];return I.filter((O)=>Ht(O)&&Array.isArray(O.hooks)&&O.hooks.some((L)=>Ht(L)&&L.command===Ft))}function gm(_){let O=(Array.isArray(_.hooks)?_.hooks.filter(Ht):[]).find((L)=>L.command===Ft);return[..._.matcher===void 0||_.matcher===""||_.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...O?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...O?.timeout===$r?[]:[`Managed hook "timeout" is not ${$r}; reinstall to repair`]]}function Ja(_){let I=Or(_.environment);if(!pm(I))return{platform:"grok-build",status:"n/a",configPath:I};let O;try{O=JSON.parse(fm(I,"utf-8"))}catch(K){return{platform:"grok-build",status:"n/a",configPath:I,errors:[`Failed to parse Grok Build hooks config ${I}: ${K instanceof Error?K.message:String(K)}`]}}let L=mm(O)[0];if(!L)return{platform:"grok-build",status:"n/a",configPath:I};let J=gm(L);return{platform:"grok-build",status:"configured",method:"hook config",configPath:I,errors:J.length>0?J:void 0}}import{readFileSync as tl}from"node:fs";import{join as rl}from"node:path";var Rn="cc-safety-net",Mo="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",hm=30;function Wa(_){return`${Mo}
# version: ${_}
`}function ym(_){return`${Wa(_)}name: ${Rn}
version: "${_}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function vm(_){return`${Wa(_)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${_n["hermes-agent"].split(" ").map((I)=>`"${I}"`).join(", ")}]
TIMEOUT_SECONDS = ${hm}


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
`}function Mt(_){return[{name:"__init__.py",content:vm(_)},{name:"plugin.yaml",content:ym(_)}]}import{mkdirSync as bm,readdirSync as wm,readFileSync as Ka,rmSync as Uo}from"node:fs";import{basename as km,dirname as xm,join as jn}from"node:path";var Sm="__pycache__",Cm=/^[a-z0-9][a-z0-9_-]{0,63}$/;function Rm(_){try{return Ka(_,"utf-8").trim()}catch{return}}function Go(_){let I=_.env.get("HERMES_HOME")?.trim();if(I&&km(xm(I))==="profiles")return I;let O=I||jn(_.home,".hermes"),L=jn(O,"active_profile"),J=Rm(L),K=J?.toLowerCase();if(!K||K==="default")return O;if(!Cm.test(K))throw Error(`Invalid Hermes profile name "${J}" in ${L}; run \`hermes profile use <name>\` with a valid profile.`);return jn(O,"profiles",K)}function Bo(_){return jn(Go(_),"plugins",Rn)}function qo(_){return _.startsWith(Mo)}function Vo(_,I){let O=Bo(_),L=cn(O);if(L&&(L.isSymbolicLink()||!L.isDirectory()))throw Error(`Refusing to ${I} ${O}: not a regular directory. Move or remove it and rerun ${I==="install"?"install":"uninstall"} --hermes-agent.`);return O}function Ya(_,I){let O=cn(_);if(!O)return;if(O.isSymbolicLink()||!O.isFile())throw Error(`Refusing to ${I} ${_}: not a regular file. Move or remove it.`);let L=Ka(_,"utf-8");if(!qo(L))throw Error(`Refusing to ${I} unmanaged file at ${_}. Move or remove it.`);return L}function Za(_){let I=Vo(_,"install"),O=Mt(un());if(O.map((J)=>Ya(jn(I,J.name),"overwrite")).every((J,K)=>J===O[K]?.content))return{path:I,alreadyInstalled:!0};return bm(I,{recursive:!0}),O.forEach((J)=>{mn(jn(I,J.name),J.content)}),{path:I,alreadyInstalled:!1}}function zo(_){let I=Vo(_,"remove");if(!cn(I))return[];return Mt(un()).filter((O)=>Ya(jn(I,O.name),"remove")!==void 0)}function Xa(_){let I=Vo(_,"remove");if(!cn(I))return{path:I,alreadyInstalled:!1};let O=zo(_);if(O.forEach((L)=>{Uo(jn(I,L.name))}),Uo(jn(I,Sm),{recursive:!0,force:!0}),wm(I).length===0)Uo(I,{recursive:!0});return{path:I,alreadyInstalled:O.length>0}}var Ut="hermes-agent",Qa=/^([^\s#][^:]*):/,Pm=/^\s+([A-Za-z_][\w-]*):/,el=/^\s+-\s*(.*)$/;function Em(_){return _.trim().replace(/^(["'])(.*)\1$/,"$2")}function Am(_){let I=_.split(/\r?\n/),O=I.findIndex((K)=>Qa.exec(K)?.[1]?.trim()==="plugins");if(O===-1)return[];let L=I.slice(O+1),J=L.findIndex((K)=>Qa.test(K));return J===-1?L:L.slice(0,J)}function nl(_,I){let O=Am(_),L=O.findIndex((ne)=>Pm.exec(ne)?.[1]===I);if(L===-1)return[];let J=O.slice(L+1),K=J.findIndex((ne)=>!el.test(ne));return(K===-1?J:J.slice(0,K)).map((ne)=>Em(el.exec(ne)?.[1]??""))}function _m(_){try{return tl(rl(Go(_),"config.yaml"),"utf-8")}catch{return}}function Jo(_){let I=_m(_)??"";return nl(I,"enabled").includes(Rn)&&!nl(I,"disabled").includes(Rn)}function ol(_){return/^# version:\s*(.+)$/m.exec(_)?.[1]?.trim()}function Im(_,I){let O=cn(_);if(!O)return{error:`${I.name} is missing from ${_}; run install --hermes-agent`};if(O.isSymbolicLink()||!O.isFile())return{error:`${_} is a symlink or not a regular file; move or remove it`};try{let L=tl(_,"utf-8");if(!qo(L))return{error:`Unmanaged ${I.name} occupies ${_}; move or remove it`};if(ol(L)===un()&&L!==I.content)return{error:`Modified ${I.name} occupies ${_}; run install --hermes-agent to restore it`};return{content:L}}catch(L){return{error:`Failed to read ${_}: ${L instanceof Error?L.message:String(L)}`}}}function Tm(_){try{return{path:Bo(_)}}catch(I){return{error:I instanceof Error?I.message:String(I)}}}function il(_){let I=Tm(_.environment);if("error"in I)return{platform:Ut,status:"n/a",errors:[I.error]};let O=I.path,L=kr(Ut,O);if(L)return L;let J=Mt(un()).map((ue)=>Im(rl(O,ue.name),ue)),K=J.flatMap((ue)=>("error"in ue)?[ue.error]:[]);if(K.length>0)return{platform:Ut,status:"n/a",configPath:O,errors:K};let ne=J.some((ue)=>("content"in ue)&&ol(ue.content)!==un()),oe=ne?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!Jo(_.environment))return{platform:Ut,status:"disabled",method:"plugin directory",configPath:O,errors:[`${Rn} is not enabled in Hermes; run \`hermes plugins enable ${Rn}\``,...oe]};return{platform:Ut,status:"configured",method:"plugin directory",configPath:O,errors:ne?oe:void 0}}import{existsSync as $m,readFileSync as Om}from"node:fs";import{join as sl}from"node:path";var Dm=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;function Lm(_){return sl(_.env.get("KIMI_CODE_HOME")||sl(_.home,".kimi-code"),"config.toml")}function Gt(_){let I=Lm(_.environment);if(!$m(I))return{platform:"kimi-code",status:"n/a",configPath:I};try{if(!Dm.test(Om(I,"utf-8")))return{platform:"kimi-code",status:"n/a",configPath:I}}catch(O){return{platform:"kimi-code",status:"n/a",configPath:I,errors:[`Failed to read ${I}: ${O instanceof Error?O.message:String(O)}`]}}return{platform:"kimi-code",status:"configured",method:"hook config",configPath:I}}import{readFileSync as hl}from"node:fs";import{join as qt}from"node:path";var dn="cc-safety-net",Sn="index.js",xt="openclaw.plugin.json",St="package.json";var Dr="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as Fm,lstatSync as Hm,readdirSync as Mm,readFileSync as Um}from"node:fs";import{dirname as ll,join as Gn}from"node:path";import{fileURLToPath as Gm}from"node:url";import{spawn as Nm}from"node:child_process";function jm(_){return _.join(" ")}function Wo(_,I,O){return[`Failed to run ${jm(_)}${I===null?"":` (exit ${I})`}.`,O.trim()].filter(Boolean).join(`
`)}function Ko(_){let I={stdout:"",stderr:""};return _.stdout.setEncoding("utf-8"),_.stderr.setEncoding("utf-8"),_.stdout.on("data",(O)=>{I.stdout+=O}),_.stderr.on("data",(O)=>{I.stderr+=O}),I}function yn(_,I){return new Promise((O,L)=>{let J=Wn([..._],process.env),K=Nm(J.cmd,J.args,{stdio:["ignore","pipe","pipe"]}),ne=Ko(K),oe=()=>[ne.stdout,ne.stderr].filter(Boolean).join(`
`),ue=I?.timeoutMs??120000,pe=setTimeout(()=>{K.kill(),L(Error(Wo(_,null,`Timed out after ${ue}ms.
${oe()}`.trim())))},ue);K.on("error",(ve)=>{clearTimeout(pe),L(Error(Wo(_,null,`${ve.message}
${oe()}`.trim())))}),K.on("close",(ve)=>{if(clearTimeout(pe),ve!==0){L(Error(Wo(_,ve,oe())));return}O(I?.stdoutOnly?ne.stdout:oe())})})}async function Yo(_){for(let I of _)await yn(I)}async function al(_){for(let I of _)try{await yn(I)}catch(O){console.warn(O instanceof Error?O.message:String(O))}}var Zo=Gn("openclaw",dn),Zn=`run \`openclaw plugins enable ${dn}\``,Bm="config reload superseded by a newer runtime config source",qm=[Sn,xt,St];function cl(_){let I=_.env.get("OPENCLAW_HOME")?.trim();return I?Nn(I,_.home):_.home}function dl(_){let I=cl(_),O=_.env.get("OPENCLAW_STATE_DIR")?.trim();if(O)return Nn(O,I);let L=_.env.get("OPENCLAW_CONFIG_PATH")?.trim();return L?ll(Nn(L,I)):Gn(I,".openclaw")}function ul(_){let I=_.env.get("OPENCLAW_CONFIG_PATH")?.trim();return I?Nn(I,cl(_)):Gn(dl(_),"openclaw.json")}function Bt(_){return Gn(dl(_),"extensions",dn)}function Vm(_){let I=Mm(_);if(I.length===0)return!0;if(I.some((J)=>!qm.includes(J)))return!1;let O=Gn(_,Sn),L=cn(O);return L!==void 0&&!L.isSymbolicLink()&&L.isFile()&&Um(O,"utf-8").startsWith(Dr)}function Xo(_){let I=Bt(_),O=cn(I);if(!O)return;if(!O.isSymbolicLink()&&O.isDirectory()&&Vm(I))return;throw Error(`Refusing to modify ${I}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function pl(){let _=ll(Gm(import.meta.url));return[Gn(_,Zo),Gn(_,"..",Zo),Gn(_,"..","..","..","dist",Zo)]}function Qo(_=pl()){return _.find((I)=>Fm(I)&&Hm(I).isDirectory())}function zm(_=pl()){let I=Qo(_);if(!I)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return I}function fl(_=zm()){return[["openclaw","plugins","install",_,"--force","--accept-capabilities"]]}function Jm(_){let I=(()=>{try{return JSON.parse(_)}catch{return}})(),O=tn(tn(I,"plugin"),"status");return typeof O==="string"?O:void 0}async function Wm(){await yn(["openclaw","plugins","enable",dn]).catch((_)=>{if(!(_ instanceof Error&&_.message.includes(Bm)))throw _})}async function ml(_){let I=async()=>Jm(await yn(["openclaw","plugins","inspect",dn,"--runtime","--json"],{stdoutOnly:!0})),O=await I(),L=O==="disabled"&&_;if(L)await Wm();let J=L?await I():O;if(J==="loaded")return;throw Error(`${J===void 0?`The ${dn} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:J==="disabled"?`OpenClaw reports the ${dn} plugin with status "disabled"; ${Zn}.`:`OpenClaw reports the ${dn} plugin with status "${J}".`} Run \`openclaw plugins inspect ${dn} --runtime\` for details.`)}var Lr="openclaw";function Ct(_,I){let O=qt(_,I),L=cn(O);if(!L)return{error:`${I} is missing from ${O}; run install --openclaw`};if(L.isSymbolicLink()||!L.isFile())return{error:`${O} is a symlink or not a regular file; move or remove it`};try{return{content:hl(O,"utf-8")}}catch(J){return{error:`Failed to read ${O}: ${J instanceof Error?J.message:String(J)}`}}}function yl(_){try{return JSON.parse(xn(_))}catch{return}}function Km(_){let I=Ct(_,xt);if("error"in I)return I.error;if(tn(yl(I.content),"id")===dn)return;return`${qt(_,xt)} is not a valid ${dn} manifest; run install --openclaw`}function Ym(_){let I=Ct(_,St);if("error"in I)return I.error;let O=tn(tn(yl(I.content),"openclaw"),"extensions");if(Array.isArray(O)&&O.includes(`./${Sn}`))return;return`${qt(_,St)} does not point OpenClaw at ${Sn}; run install --openclaw`}function gl(_){return Array.isArray(_)?_.filter((I)=>typeof I==="string"):[]}function Zm(_){let I=ul(_);if(!cn(I))return`${dn} is not enabled; ${Zn}`;let O=(()=>{try{return JSON.parse(xn(hl(I,"utf-8")))}catch{return}})();if(O===void 0)return`Failed to read ${I}; fix it, then ${Zn}`;let L=tn(O,"plugins");if(tn(L,"enabled")===!1)return`plugins.enabled is false in ${I}; no OpenClaw plugin loads`;let J=tn(tn(tn(L,"entries"),dn),"enabled");if(gl(tn(L,"deny")).includes(dn)||J===!1)return`${dn} is disabled in ${I}; ${Zn}`;let K=gl(tn(L,"allow"));if(K.length>0&&!K.includes(dn))return`plugins.allow in ${I} does not list ${dn}; add it, then ${Zn}`;if(K.includes(dn)||J===!0)return;return`${dn} is not enabled; ${Zn}`}function vl(_){return/^\/\/ version:\s*(.+)$/m.exec(_)?.[1]?.trim()}function Xm(_,I,O){if(O===void 0)return[];let L=Ct(O,Sn);if(!(("content"in L)&&vl(L.content)===I))return[];return[Sn,xt,St].flatMap((K)=>{let ne=Ct(_,K),oe=Ct(O,K);if("error"in ne||"error"in oe||ne.content===oe.content)return[];return[`Modified ${K} occupies ${qt(_,K)}; run install --openclaw to restore it`]})}function bl(_){let I=Bt(_.environment),O=kr(Lr,I);if(O)return O;let L=Ct(I,Sn),K=["error"in L?L.error:L.content.startsWith(Dr)?void 0:`Unmanaged ${Sn} occupies ${qt(I,Sn)}; move or remove it`,Km(I),Ym(I)].filter((ve)=>ve!==void 0),ne="content"in L?vl(L.content):void 0,oe=K.length>0?K:Xm(I,ne,Qo());if(oe.length>0)return{platform:Lr,status:"n/a",configPath:I,errors:oe};let ue=ne===un()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],pe=Zm(_.environment);if(pe)return{platform:Lr,status:"disabled",method:"plugin directory",configPath:I,errors:[pe,...ue]};return{platform:Lr,status:"configured",method:"plugin directory",configPath:I,errors:ue.length>0?ue:void 0}}import{existsSync as ag,readFileSync as lg}from"node:fs";import{basename as cg}from"node:path";import{existsSync as Nr,readFileSync as ei,rmSync as Qm}from"node:fs";import{join as In}from"node:path";import{pathToFileURL as eg}from"node:url";var Vt="cc-safety-net",Xn=`${Vt}@latest`,ni=["opencode.json","opencode.jsonc"],ng=60,tg=250,wl="CCSafetyNetPlugin",rg={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function kl(_){return In(_.env.get("XDG_CONFIG_HOME")||In(_.home,".config"),"opencode")}function ti(_){return _.env.get("OPENCODE_CONFIG_DIR")||kl(_)}function ri(_){return ni.map((I)=>In(ti(_),I))}function oi(_){return[...new Set([ti(_),kl(_)])].flatMap((I)=>ni.map((O)=>In(I,O)))}function xl(_){return In(_.env.get("XDG_CACHE_HOME")||In(_.home,".cache"),"opencode","packages",Xn)}function Sl(_){Qm(xl(_),{recursive:!0,force:!0})}async function Cl(_){let I=(await yn(["opencode","--version"],{stdoutOnly:!0})).trim(),O=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(I),L=Number(O?.[1]),J=Number(O?.[2]),K=Number(O?.[3]);if(!O||L!==1&&L!==2||L===1&&(J<18||J===18&&K<29)||L===2&&J===0&&K<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${I||"an unknown version"}.`);if(L===2){for(let ne of ri(_)){if(!Nr(ne))continue;let oe=si(ei(ne,"utf-8"),ne);if(["plugin","plugins"].some((pe)=>{let ve=tn(oe,pe);return Array.isArray(ve)&&ve.some((we)=>jr(we)&&(typeof we==="string"?we:tn(we,"package"))!==Xn)}))throw Error(`Change the cc-safety-net package spec in ${ne} to ${Xn}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[],afterInstall:async()=>{if((await yn(["opencode","plugin","add",Xn],{stdoutOnly:!0})).includes("is already configured in"))await yn(["opencode","plugin","update",Xn]);let oe=await El();if(!/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(oe))throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.");let ue=["--param",`location[directory]=${process.cwd()}`];await yn(["opencode","api","integration.list",...ue]);let pe=await yn(["opencode","api","plugin.list",...ue],{stdoutOnly:!0}),ve=ii(pe);if(ve)throw Error(ve);if(!Rl(pe).some(Pl))throw Error("OpenCode lists no active cc-safety-net for this directory. Run `opencode api plugin.list` for details.")}}}return Sl(_),{commands:[["opencode","plugin","-g","-f",Xn]],afterInstall:()=>ig(_)}}function Rl(_){return og(_).filter((I)=>tn(I,"id")===Vt||jr(tn(tn(I,"source"),"target"))).map((I)=>tn(I,"state"))}function Pl(_){return tn(_,"status")==="active"}function ii(_){let I=Rl(_);if(I.some(Pl))return;let O=I.find((L)=>tn(L,"status")==="failed");if(!O)return;return`OpenCode reports cc-safety-net failed: ${String(tn(O,"error")).split(`
`)[0]}`}function og(_){if(!_)return[];try{let I=tn(JSON.parse(_),"data");return Array.isArray(I)?I:[]}catch{return[]}}async function El(_=1){let I=await yn(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s|\scc-safety-net@latest\s*$/m.test(I)||_===ng)return I;return await new Promise((O)=>setTimeout(O,tg)),El(_+1)}async function ig(_){let I=In(xl(_),"node_modules",Vt),O=In(I,"package.json");if(!Nr(O))throw Error(`The OpenCode plugin cache at ${I} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${Xn}\` for details.`);let L=tn(JSON.parse(ei(O,"utf-8")),"main");if(typeof L!=="string")throw Error(`The cached OpenCode plugin at ${I} declares no "main" entry.`);let J=In(I,L);if(typeof(await import(eg(J).href))[wl]==="function")return;throw Error(`The cached OpenCode plugin at ${J} does not export a callable ${wl}, so OpenCode would load nothing and fail open.`)}function si(_,I){try{return JSON.parse(xn(_))}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${I}: ${O.message}`);throw O}}function jr(_){let I=typeof _==="string"?_:tn(_,"package");return typeof I==="string"&&(I===Vt||I.startsWith(`${Vt}@`))}function ai(_){return["plugin","plugins"].some((I)=>{let O=tn(_,I);return Array.isArray(O)&&O.some(jr)})}function sg(_,I){let L=["plugin","plugins"].flatMap((J)=>{let K=ga(_,J,rg);if(!K)return[];let ne=[],oe=0,ue=K.start+1,pe=_.slice(K.start+1,K.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let ve of pe){if(ve[0].startsWith("//")||ve[0].startsWith("/*"))continue;let we=K.start+1+ve.index;if(oe===0)ue=we;if(ve[0]==="{"||ve[0]==="[")oe++;if(ve[0]==="}"||ve[0]==="]")oe--;if(oe!==0||ve[0]===",")continue;let Ce=we+ve[0].length;if(jr(JSON.parse(xn(_.slice(ue,Ce)))))ne.push({start:ue,end:Ce})}return ne}).sort((J,K)=>J.start-K.start).reverse().reduce((J,K)=>{let ne=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(J.slice(K.end));if(ne?.[0].includes("/")){let oe=K.end+ne[0].length-1;return J.slice(0,K.start)+J.slice(K.end,oe)+J.slice(oe+1)}return ma(J,K)},_);return si(L,I),L}function Al(_){Sl(_);let I=oi(_),O=I.find((K)=>Nr(K)),L=[],J=[];for(let K of I){if(!Nr(K))continue;try{let ne=ei(K,"utf-8");if(!ai(si(ne,K)))continue;mn(K,sg(ne,K)),J.push(K)}catch(ne){L.push(ne instanceof Error?ne.message:String(ne))}}if(L.length>0)throw Error(L.join(`
`));return{path:J[0]??O??In(ti(_),ni[0]),alreadyInstalled:J.length>0}}function Rt(_){let I=[];for(let O of _.openCodeVersion?.startsWith("2.")?ri(_.environment):oi(_.environment))if(ag(O))try{let L=lg(O,"utf-8"),J=xn(L),K=JSON.parse(J);if(ai(K)){let ne=ii(_.openCodePluginListOutput);if(ne)return{platform:"opencode",status:"disabled",method:"opencode api plugin.list",configPath:O,errors:[...I,ne]};return{platform:"opencode",status:"configured",method:"plugin array",configPath:O,errors:I.length>0?I:void 0}}}catch(L){I.push(`Failed to parse ${cg(O)}: ${L instanceof Error?L.message:String(L)}`)}return{platform:"opencode",status:"n/a",errors:I.length>0?I:void 0}}import{join as _l}from"node:path";function li(_){let I=_.env.get("PI_CODING_AGENT_DIR");return _l(I?Nn(I,_.home):_l(_.home,".pi","agent"),"settings.json")}function ci(_){if(typeof _!=="string")return!1;return _==="npm:cc-safety-net"||_.startsWith("npm:cc-safety-net@")}function Il(_){let I=li(_.environment),O=Cn(I);if(O.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(O.kind==="missing")return{platform:"pi",status:"n/a"};let L=tn(O.value,"packages");if(!Array.isArray(L))return{platform:"pi",status:"n/a"};let J=L.find((oe)=>ci(typeof oe==="string"?oe:tn(oe,"source")));if(J===void 0)return{platform:"pi",status:"n/a"};let K=tn(J,"extensions");if(Array.isArray(K)&&K.some((oe)=>typeof oe==="string"&&oe.startsWith("-")))return{platform:"pi",status:"disabled",method:"package config",configPath:I,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:I}}var dg={amp:oa,"antigravity-cli":ia,"claude-code":la,codex:da,"copilot-cli":Pa,cursor:Da,"deepseek-harness":Na,"gemini-cli":ja,"grok-build":Ja,"hermes-agent":il,"kimi-code":Gt,openclaw:bl,opencode:Rt,pi:Il};function Pt(_,I,O){let L={...O,cwd:I,environment:_};return ar.map((J)=>ug(dg[J](L)))}function ug(_){if(_.status==="not-inspected")return{platform:_.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:_.platform,detected:_.status!=="n/a",configured:_.status==="configured",inspectionStatus:_.status!=="n/a"?"verified":_.errors&&_.errors.length>0?"failed":"not-applicable",method:_.method,configPath:_.configPath,configPaths:_.configPaths,errors:_.errors}}import{join as pg}from"node:path";var fg=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),mg=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),safety:Object.freeze({}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),gg={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function Tl(_){let I=pg(_.tmpdir,"cc-safety-net-self-test"),O=fg.map((L)=>{let J=M(_,l("self-test",{command:L.command},{kind:"command",shell:"auto"},{configCwd:I,executionCwd:I},L.command),{guard:{dependencies:{loadPolicySnapshot:()=>mg,getModes:()=>gg,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),K=L.expectBlocked?"blocked":"allowed",ne=J.decision.kind==="deny"?"blocked":"allowed";return{command:L.command,description:L.description,expected:K,actual:ne,passed:K===ne,reason:J.decision.kind==="deny"?J.decision.reason:void 0,ruleId:J.decision.kind==="deny"?J.decision.ruleId:void 0}});return{passed:O.filter((L)=>L.passed).length,failed:O.filter((L)=>!L.passed).length,total:O.length,results:O}}function di(_){let I=gn({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},_);if(Dn(I.errors))return null;return{json:I.flags.json,skipUpdateCheck:I.flags.skipUpdateCheck}}async function $l(_,I={}){let O=await Ot(!I.json,()=>{let L=yg(_,I);return{ready:L,finish:()=>L}},()=>$t(),{loadingMessage:"Checking system status…"});if(I.json)console.log(JSON.stringify(O,null,2));else vg(O);return O.engineSelfTest.failed>0||O.findings.some((L)=>L.severity==="error")?1:0}async function yg(_,I){let O=I.cwd??process.cwd(),L=await hr((Le)=>Rt({environment:_,cwd:O,openCodeVersion:Le}).status!=="n/a",void 0,O),J=Pt(_,O,{ampPluginListOutput:L.ampPluginListOutput,codexPluginListOutput:L.codexPluginListOutput,copilotCliVersion:L.versions["copilot-cli"],openCodeVersion:L.versions.opencode,openCodePluginListOutput:L.openCodePluginListOutput}),K=ws(_,O),ne=ks(_),oe=E(_,{cwd:O}),ue=oe.policy,pe=T(ue,_.env),ve=B(ue,pe.capabilities),we=ur(_,7),Ce=Qs(_,O),Pe=[pr(O),vt(_)].filter((Le)=>hg(Le)),Se=I.skipUpdateCheck?{currentVersion:un(),latestVersion:null,updateAvailable:!1}:await Un(),en={hooks:J,engineSelfTest:Tl(_),userConfig:K.userConfig,projectConfig:K.projectConfig,configState:$e(oe),effectiveRules:K.effectiveRules,environment:ne,effectiveSafety:{selectedPreset:ue.safety.level??"standard",level:pe.effectiveLevel,capabilities:pe.capabilities,ruleOverrides:ue.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(ve).filter(([,Le])=>Le.source==="rule_override"&&Le.override==="off"&&Le.inheritedEnabled&&Le.changesInherited).map(([Le])=>Le),ruleCounts:{stored:Object.keys(ue.destructiveCommandRuleOverrides).length,effective:Object.values(ve).filter((Le)=>Le.changesInherited).length},...oe.policyScopes?{policyScopes:oe.policyScopes}:{}},...Ce.length>0?{v2Leftovers:Ce}:{},...Pe.length>0?{legacyConfigs:Pe}:{},posture:Ls(_,K.userConfig.path),activity:we,update:Se,system:L};return{...en,findings:Ss(en)}}function vg(_){console.log(),console.log(Rs(_.hooks)),console.log(),console.log(Ps(_.engineSelfTest)),console.log(),console.log(Es(_)),console.log(),console.log(As(_.environment)),console.log(),console.log(_s(_)),console.log(),console.log(Is(_.findings)),console.log(),console.log(Ts(_.activity)),console.log(),console.log(Os(_.system)),console.log(),console.log($s(_.update)),console.log(Ds(_))}import{existsSync as bg}from"node:fs";var wg=/^[A-Za-z0-9_@%+=:,./-]+$/,Ol="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function ui(_){let I=gn({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},_);if(Dn(I.errors))return console.error(Ol),console.error("Pass -- before a command that starts with dashes."),null;if(I.values.cwd!==void 0&&!bg(I.values.cwd))return console.error(`Error: --cwd path does not exist: ${I.values.cwd}`),null;let O=I.positionals.length===1?I.positionals[0]:I.positionals.map((L)=>wg.test(L)?L:`'${L.replaceAll("'","'\\''")}'`).join(" ");if(!O)return console.error("Error: No command provided"),console.error(Ol),null;return{json:I.flags.json,cwd:I.values.cwd,command:O}}function Dl(_){if(_)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function Ll(_,I){let L=I-18;return[`${_.dtl}${_.dh.repeat(I)}${_.dtr}`,`${_.dv}  Command Analysis${" ".repeat(L)}${_.dv}`,`${_.dbl}${_.dh.repeat(I)}${_.dbr}`]}function pi(_){return JSON.stringify(_)}function Nl(_,I=0){return`[${_.map((L,J)=>Cs(L,J,I)).join(",")}]`}function zt(_,I,O=70){let L=_.split(" "),J=[],K="";for(let ne of L)if(K&&K.length+ne.length+1>O)J.push(K),K=ne;else K=K?`${K} ${ne}`:ne;if(K)J.push(K);return J.map((ne,oe)=>oe===0?ne:`${I}${ne}`)}function jl(_,I,O){let L=[];switch(_.type){case"parse":return null;case"env-strip":return L.push(""),L.push(`STEP ${I} ${O.h} Strip environment variables`),L.push(`  Removed: ${_.envVars.map((J)=>`${J}=<redacted>`).join(", ")}`),L.push(`  Tokens:  ${pi(_.output)}`),{lines:L,incrementStep:!0};case"leading-tokens-stripped":return L.push(""),L.push(`STEP ${I} ${O.h} Strip wrappers`),L.push(`  Removed: ${_.removed.join(", ")}`),L.push(`  Tokens:  ${pi(_.output)}`),{lines:L,incrementStep:!0};case"shell-wrapper":return L.push(""),L.push(`STEP ${I} ${O.h} Detect shell wrapper`),L.push(`  Wrapper: ${_.wrapper} -c`),L.push(`  Inner:   ${_.innerCommand}`),{lines:L,incrementStep:!0};case"interpreter":{if(L.push(""),L.push(`STEP ${I} ${O.h} Detect interpreter`),L.push(`  Interpreter: ${_.interpreter}`),L.push(`  Code:        ${_.codeArg}`),_.paranoidBlocked)L.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:L,incrementStep:!0}}case"busybox":return L.push(""),L.push(`STEP ${I} ${O.h} Busybox wrapper`),L.push(`  Subcommand: ${_.subcommand}`),{lines:L,incrementStep:!0};case"transparent-wrapper":return L.push(""),L.push(`STEP ${I} ${O.h} Transparent wrapper`),L.push(`  Wrapper: ${_.wrapper}`),L.push(`  Tokens:  ${pi(_.output)}`),{lines:L,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(L.push(""),L.push(`STEP ${I} ${O.h} Match rules`),L.push(`  Rule:   ${_.rule}()`),_.matched)L.push("  Result: MATCHED");else L.push("  Result: No match");return{lines:L,incrementStep:!0}}case"worktree-relaxation":return L.push(""),L.push(`STEP ${I} ${O.h} Worktree relaxation`),L.push(`  Mode:   ${n.worktree.name}`),L.push(`  Git cwd: ${_.gitCwd}`),L.push("  Result: Allowed local discard in linked worktree"),{lines:L,incrementStep:!0};case"temp-root-relaxation":return L.push(""),L.push(`STEP ${I} ${O.h} Temp-root relaxation`),L.push(`  Git cwd: ${_.gitCwd}`),L.push("  Result: Allowed git discard in a temp-root repository"),{lines:L,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(_.embeddedCommandFound)return L.push(""),L.push(`STEP ${I} ${O.h} Fallback scan`),L.push(`  Found: ${_.embeddedCommandFound}`),{lines:L,incrementStep:!0};return null}case"custom-rules-check":{if(_.rulesChecked){if(L.push(""),L.push(`STEP ${I} ${O.h} Custom rules`),_.matched)L.push("  Result: MATCHED");else L.push("  Result: No match");return{lines:L,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(_.matched)return L.push(""),L.push(`STEP ${I} ${O.h} Dangerous text check`),L.push(`  Token:  ${_.token}`),L.push("  Result: MATCHED"),{lines:L,incrementStep:!0};return null}case"strict-unparseable":return L.push(""),L.push(`STEP ${I} ${O.h} Strict mode check`),L.push(`  Command: ${_.rawCommand}`),L.push("  Result:  ✗ UNPARSEABLE"),{lines:L,incrementStep:!0};case"segment-skipped":return null;case"error":return L.push(""),L.push(`ERROR: ${_.message}`),{lines:L,incrementStep:!1};default:return _}}function fi(_,I){let O=Dl(I?.asciiOnly??!1),L=58,J=[],K=1;J.push(...Ll(O,58)),J.push("");let ne=_.trace.steps.find((Se)=>Se.type==="error");if(ne&&ne.type==="error"){J.push("ERROR"),J.push(`  ${ne.message}`),J.push(""),J.push("RESULT"),J.push(`  Status: ${_.result==="blocked"?nn.red("BLOCKED"):nn.green("ALLOWED")}`),J.push(""),J.push("CONFIG");let Se=_.configSource??"none";return J.push(`  Path: ${Se}`),J.join(`
`)}let oe=_.trace.steps.find((Se)=>Se.type==="parse");if(oe&&oe.type==="parse"){J.push("INPUT"),J.push(`  ${oe.input}`),J.push(""),J.push(`STEP ${K} ${O.h} Split shell commands`),K++;for(let Se=0;Se<oe.segments.length;Se++){let en=oe.segments[Se];if(en){let Le=Math.random();J.push(`  Segment ${Se+1}: ${Nl(en,Le)}`)}}}let ue=_.trace.segments,pe=ue.length>1;for(let Se of ue){if(pe){J.push("");let on="";if(oe&&oe.type==="parse"){let lo=oe.segments[Se.index];if(lo)on=lo.join(" ")}let sn=54,an=on,rn=` Segment ${Se.index+1}: `,pn=" ";if(on){if(rn.length+on.length+pn.length>sn){let bu=sn-rn.length-pn.length;an=`${on.substring(0,bu-1)}…`}}let On=on?`${rn}${an}${pn}`:` Segment ${Se.index+1} `,yu=on?`${rn}${nn.cyan(an)}${pn}`:On,Yi=58-On.length,Zi=Math.floor(Yi/2),vu=Yi-Zi;J.push(`${O.sh.repeat(Zi)}${yu}${O.sh.repeat(vu)}`)}if(Se.steps.find((on)=>on.type==="segment-skipped")){J.push(""),J.push("  (skipped — prior segment blocked)");continue}let Le=!1,Ve=!1;for(let on of Se.steps){let sn=jl(on,K,O);if(sn){if(Ve=!0,on.type==="recurse"){J.push("");let an=" RECURSING ",rn=58-an.length-4;J.push(`  ${O.tl}${O.h}${an}${O.h.repeat(rn)}`),J.push(`  ${O.v}`),Le=!0;continue}for(let an of sn.lines)if(Le)J.push(`  ${O.v} ${an}`);else J.push(an);if(sn.incrementStep)K++}}if(Le)J.push(`  ${O.v}`),J.push(`  ${O.bl}${O.h.repeat(56)}`);if(!Ve)J.push(""),J.push(`  ${nn.green("✓")} Allowed (no matching rules)`)}if(J.push(""),J.push("RESULT"),_.result==="blocked"){if(J.push(`  Status: ${nn.red("BLOCKED")}`),_.customRule){if(J.push(`  Rule: ${_.customRule.id}`),_.customRule.rulebook)J.push(`  Rulebook: ${_.customRule.rulebook.name} ${_.customRule.rulebook.version}`);if(_.customRule.source)J.push(`  Source: ${_.customRule.source}`);if(_.customRule.override)J.push(`  Override: reason ${_.customRule.override.reason}`)}if(_.reason){let Se=zt(_.reason,"          ");J.push(`  Reason: ${Se[0]}`);for(let en=1;en<Se.length;en++)J.push(Se[en]??"")}}else J.push(`  Status: ${nn.green("ALLOWED")}`);J.push(""),J.push("CONFIG");let ve=_.configSource??"none",we=_.configValid?"":" (invalid)";J.push(`  Path: ${ve}${we}`);let Ce=_.safetyPresetScope;J.push(`  Safety preset: ${_.selectedPreset??"standard"}${Ce?` (${fr(Ce)})`:""}`),J.push(`  Effective capabilities: ${_.effectiveLevel}`);let Pe=Object.entries(_.destructiveCommandRuleOverrides??{});if(J.push(`  Rule customizations: ${Pe.length}`),_.ruleActivation)J.push(`  Rule activation: ${_.ruleActivation.id} — ${_.ruleActivation.enabled?"on":"off"} via ${_.ruleActivation.source}`);return J.join(`
`)}function mi(_){return JSON.stringify(_,null,2)}import{resolve as Rg}from"node:path";var kg=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function Fl(_){let I=0,O={allocateSegment(){return I++},getNextSegmentIndex(){return I},recordGlobal(L){_.record({kind:"step",scope:"global",step:L})},recordSegment(L,J=O.currentSegmentIndex){if(J===void 0)return;_.record({kind:"step",scope:"segment",segmentIndex:J,step:L})}};return O}function Hl(_={}){let I=[],O=_.maxEvents??512,L={maxTextLength:_.maxTextLength??2048,maxListLength:_.maxListLength??128,maxObjectProperties:_.maxObjectProperties??_.maxListLength??128,maxDepth:_.maxDepth??16},J,K=new Set;return{record(ne){if(J)return;if(!ne||I.length>=O)return;try{I.push(yi(xg(ne,L,K)))}catch{}},finish(){if(J)return J;return J=yi({events:Object.freeze(I)}),J}}}function xg(_,I,O){if(_.kind!=="step")throw TypeError("invalid trace event");let{scope:L,step:J}=_;Fr(J,O,I);let K=gi(J,I,O);if(L==="global")return{kind:"step",scope:"global",step:K};if(L!=="segment")throw TypeError("invalid trace event scope");return{kind:"step",scope:"segment",segmentIndex:_.segmentIndex,step:K}}function Fr(_,I,O,L=0,J=new WeakSet){if(typeof _==="string"){let oe=_.slice(0,O.maxTextLength);if(!Be(oe))return;for(let ue of tt(oe))for(let pe of ue.match(/[^\s"'()$]+/g)??[])I.add(Ml(pe));return}if(!_||typeof _!=="object"||L>=O.maxDepth||J.has(_))return;if(J.add(_),Array.isArray(_)){let oe=Math.min(_.length,O.maxListLength);for(let ue=0;ue<oe;ue++)Fr(_[ue],I,O,L+1,J);return}let K=0,ne=new Set;for(let oe in _){if(!Object.hasOwn(_,oe))continue;if(K>=O.maxObjectProperties)break;K++,Fr(oe,I,O);let ue=hi(oe,O,I);if(ne.has(ue))continue;ne.add(ue),Fr(_[oe],I,O,L+1,J)}}function gi(_,I,O,L=0,J=new WeakSet){if(typeof _==="string")return hi(_,I,O);if(!_||typeof _!=="object")return _;if(L>=I.maxDepth)return;if(J.has(_))return;if(J.add(_),Array.isArray(_)){let oe=[],ue=Math.min(_.length,I.maxListLength);for(let pe=0;pe<ue;pe++)oe.push(gi(_[pe],I,O,L+1,J));return oe}let K={},ne=0;for(let oe in _){if(!Object.hasOwn(_,oe))continue;if(ne>=I.maxObjectProperties)break;ne++;let ue=hi(oe,I,O);if(Object.hasOwn(K,ue))continue;Object.defineProperty(K,ue,{value:gi(_[oe],I,O,L+1,J),enumerable:!0,configurable:!0,writable:!0})}return K}function hi(_,I,O){let L=_.slice(0,I.maxTextLength),J=Be(L)?We(L):L,K=O.size>0?Cg(J,O):J;return(Sg(K)?_e(K):K).slice(0,I.maxTextLength)}function Sg(_){return _.includes("PRIVATE KEY")||_.includes("://")||_.includes("eyJ")||_.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(_)||_.length>=14&&kg.some((I)=>_.includes(I))||_.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(_)}function Cg(_,I){return _.replace(/[^\s"'()$]+/g,(O)=>I.has(Ml(O))?"<redacted>":O)}function Ml(_){let I=2166136261,O=2166136261;for(let L=0;L<_.length;L++)I=Math.imul(I^_.charCodeAt(L),16777619),O=Math.imul(O^_.charCodeAt(_.length-L-1),16777619);return`${I>>>0}:${O>>>0}:${_.length}`}function yi(_){if(_&&typeof _==="object"&&!Object.isFrozen(_)){for(let I of Object.values(_))yi(I);Object.freeze(_)}return _}function Jt(_,I={},O){let L=Rg(I.cwd??process.cwd()),J=I.policySnapshot??E(O,{cwd:L,userConfigDir:I.userConfigDir}),K=T(J.policy,O.env),ne=je({policySnapshot:J,effectiveCapabilities:K.capabilities,strict:K.strict,paranoidRm:K.paranoidRm,paranoidInterpreters:K.paranoidInterpreters,worktreeMode:K.worktreeMode}),oe={effectiveLevel:ne.effectiveLevel,selectedPreset:J.policy.safety.level??"standard",...J.policyScopes?{safetyPresetScope:J.policyScopes.levelScope}:{},effectiveCapabilities:ne.effectiveCapabilities,destructiveCommandRuleOverrides:J.policy.destructiveCommandRuleOverrides},{configSource:ue,configValid:pe}=Eg(O,{cwd:L,userConfigDir:I.userConfigDir});if(!_||!_.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:ue,configValid:pe,...oe};let ve=h(_,"auto");if(ve.status==="limited")throw new y;let we=ve.dialect==="powershell"?h(_,"posix"):ve,Ce=ut(we),Pe=Hl(),Se=Fl(Pe);Se.recordGlobal({type:"parse",input:_,segments:Ce.map((On)=>[...On])});let en=l("Bash",{command:_},{kind:"command",shell:"auto"},{configCwd:L,executionCwd:L},_),Le=V(en,{environment:O,trace:Se,dependencies:{loadPolicySnapshot:()=>J}}),Ve=Le.decision.kind==="deny"?Le.decision:null;if(Ve&&(Le.stage==="policy-protection"||Le.stage==="secret-protection"))return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:Pg(Ve),matched:!0,reason:Ve.reason}]}]},result:"blocked",reason:R(Ve.reason),segment:R(Ul(Ve,_)),ruleId:R(Ve.ruleId),configSource:ue,configValid:pe,...oe};let on=Se.getNextSegmentIndex();if(Ve&&on>0&&on<Ce.length)Se.recordSegment({type:"segment-skipped",index:on,reason:"prior-segment-blocked"},on);let sn=Pe.finish(),an=Ve?.ruleId??Ag(en,J,K,O),rn=W.find((On)=>On.id===an&&On.activationCapability),pn=rn?ne.policy.effectiveDestructiveCommandRules[rn.id]:void 0;return{trace:Ig(sn),result:Ve?"blocked":"allowed",reason:Ve?R(Ve.reason):void 0,segment:Ve?R(Ul(Ve,_)):void 0,ruleId:Ve?R(Ve.ruleId):void 0,customRule:_g(Tg(Ve?.ruleId,J)),configSource:ue,configValid:pe,...oe,...rn&&pn?{ruleActivation:{id:rn.id,...pn}}:{}}}function Ul(_,I){return _.evidence?.segment??I}function Pg(_){if(_.reason===Ge)return"policy-protection:findPolicyConfigMutationTargetInSemanticFacts";if(_.reason===Ue)return"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts";if(_.reason===k)return"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts";return"secret-protection:findSensitiveTargetInSemanticFacts"}function Eg(_,I){let O=U(I.cwd),L=G(_,I),J=Z(_,{cwd:I.cwd,userConfigDir:I.userConfigDir});try{if(r(J.projectConfigTarget)!==null){if(Mn(J.projectConfigTarget).errors.length===0)return{configSource:O,configValid:!0};return{configSource:O,configValid:!1}}}catch(K){if(K instanceof o)return{configSource:O,configValid:!1};throw K}try{if(r(J.userConfigTarget)!==null){let K=Mn(J.userConfigTarget);return{configSource:L,configValid:K.errors.length===0}}return{configSource:null,configValid:!0}}catch(K){if(K instanceof o)return{configSource:L,configValid:!1};throw K}}function Ag(_,I,O,L){let J=I.policy,K=Te({...J,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...J.destructiveCommandRuleOverrides,...Object.fromEntries(W.flatMap((oe)=>oe.activationCapability?[[oe.id,"on"]]:[]))}},I.state==="degraded"?{diagnostics:I.diagnostics,reason:I.reason}:void 0),ne=V(_,{environment:L,dependencies:{loadPolicySnapshot:()=>K,getModes:()=>({...O,strict:!0,paranoidRm:!0,paranoidInterpreters:!0}),findSensitiveTarget:()=>null}});return ne.decision.kind==="deny"?ne.decision.ruleId:void 0}function _g(_){if(!_)return;return{id:R(_.id),..._.rulebook?{rulebook:{name:R(_.rulebook.name),version:R(_.rulebook.version)}}:{},..._.source?{source:R(_.source)}:{},..._.override?{override:{type:"reason",reason:R(_.override.reason)}}:{}}}function Ig(_){let I=_.events.flatMap((L)=>L.kind==="step"&&L.scope==="global"?[L.step]:[]),O=new Map;for(let L of _.events){if(L.kind!=="step"||L.scope!=="segment")continue;let J=O.get(L.segmentIndex)??{index:L.segmentIndex,steps:[]};J.steps.push(L.step),O.set(L.segmentIndex,J)}return{steps:I,segments:[...O.values()]}}function Tg(_,I){let O=_?.replace(/^custom\./,"");if(!O||!I.policy.rules.some((L)=>L.name===O))return;return I.ruleMetadata[O]??Object.freeze({id:O})}function Gl(_){return new Promise((I)=>{process.stdout.write(`${_}
`,()=>I())})}async function Bl(_,I){let O=ui(I);if(!O)return 1;try{let L=Jt(O.command,{cwd:O.cwd},_),J=!!process.env.NO_COLOR||!process.stdout.isTTY;return await Gl(O.json?mi(L):fi(L,{asciiOnly:J})),0}catch(L){let J=$g(L instanceof p?L.cause:L);if(J===void 0)throw L;if(O.json)return await Gl(JSON.stringify({error:J})),1;return console.error(J),1}}function $g(_){if(_ instanceof y)return _.message;if(_ instanceof f)return _.message;if(_ instanceof s&&a[_.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var ql="2.5.2",En="  ",Qn="cc-safety-net";function Vl(_){return _.argument?`${_.flags} ${_.argument}`:_.flags}function Og(_){return Math.max(..._.map((I)=>Vl(I).length))}function Dg(_){return Math.max(..._.map((I)=>I.usage.length))}function Lg(_){return Math.max(..._.map((I)=>`${Qn} ${I.usage}`.length))}function Ng(_,I){let O=`${Qn} ${_.usage}`;return`${En}${O.padEnd(I+2)}${_.description}`}function Tn(_,I){return`${En}${_.padEnd(Math.max(40,_.length+2))}${I}`}function Et(_,I=console.log){let O=[];if(O.push(`${Qn} ${_.name}`),O.push(""),O.push(`${En}${_.description}`),O.push(""),O.push("USAGE:"),O.push(`${En}${Qn} ${_.usage}`),O.push(""),_.subcommands&&_.subcommands.length>0){O.push("SUBCOMMANDS:");let L=Dg(_.subcommands);for(let J of _.subcommands)O.push(`${En}${J.usage.padEnd(L+2)}${J.description}`);O.push("")}if(_.options.length>0){O.push("OPTIONS:");let L=Og(_.options);for(let J of _.options){let K=Vl(J),ne=J.default?`${J.description} (default: ${J.default})`:J.description;O.push(`${En}${K.padEnd(L+2)}${ne}`)}O.push("")}if(_.examples&&_.examples.length>0){O.push("EXAMPLES:");for(let L of _.examples)O.push(`${En}${L}`)}I(O.join(`
`))}function vi(){let _=Lg(cr),I=[];I.push(`${Qn} v${ql}`),I.push(""),I.push("Blocks destructive commands and secret access."),I.push(""),I.push("COMMANDS:");for(let O of cr)I.push(Ng(O,_));I.push(""),I.push("GLOBAL OPTIONS:"),I.push(`${En}-h, --help       Show help (use with command for command-specific help)`),I.push(`${En}-V, --version    Show version`),I.push(""),I.push("HELP:"),I.push(`${En}${Qn} help <command>     Show help for a specific command`),I.push(`${En}${Qn} <command> --help   Show help for a specific command`),I.push(""),I.push("ENVIRONMENT VARIABLES:"),I.push(Tn(`${n.level.name}=standard|strict|paranoid`,"Set session safety level")),I.push(Tn(`${n.worktree.name}=1`,"Allow local git discards in linked worktrees")),I.push(Tn(`${n.debug.name}=1`,"Print diagnostic messages to stderr")),I.push(Tn(`${n.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),I.push(Tn(`${n.projectTightenOnly.name}=1`,"Ignore project policy settings that weaken the user policy")),I.push(Tn("CC_SAFETY_NET_HOME","Override rule config home directory")),I.push(""),I.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),I.push(Tn(`${n.strict.name}=1`,"Force safety.overrides.fail_closed on")),I.push(Tn(`${n.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),I.push(Tn(`${n.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),I.push(Tn(`${n.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),I.push(""),I.push("Documentation:        https://ccsafetynet.com/docs"),console.log(I.join(`
`))}function zl(){console.log(ql)}function Wt(_,I=console.log){let O=dr(_);if(!O)return!1;if(O.name.toLowerCase()!==_.toLowerCase())return!1;return Et(O,I),!0}import{existsSync as zr,readFileSync as Xc}from"node:fs";import{join as Vr}from"node:path";import*as Bn from"node:readline";function jg(_){return _==="install"?"Install":"Uninstall"}function Fg(_){return _==="install"?"Installing":"Uninstalling"}function Hg(_){return _==="install"?"into":"from"}function Kl(_){return _?.available===!0}function Mg(_,I){let O=new Set(I);return _.filter((L)=>O.has(L.target)).map((L)=>L.target)}function Jl(_,I,O){if(_.every((L)=>!L.available))return I;return Array.from({length:_.length},(L,J)=>J+1).map((L)=>(I+L*O+_.length)%_.length).find((L)=>Kl(_[L]))}function Ug(_,I,O){if(O.ctrl&&O.name==="c")return"interrupt";if(O.name==="escape"||I==="q")return"abort";if(_==="install"&&(I==="u"||I==="U"))return"update";if(O.name==="up"||I==="k")return"up";if(O.name==="down"||I==="j")return"down";if(O.name==="space"||I===" ")return"toggle";if(O.name==="return"||O.name==="enter")return"confirm";return null}function Gg(_){return{cursor:_.findIndex((I)=>I.available),selected:[]}}function Bg(_,I,O){if(O==="confirm"||O==="update"||O==="abort"||O==="interrupt")return{state:_,done:O};if(O==="up")return{state:{..._,cursor:Jl(I,_.cursor,-1)}};if(O==="down")return{state:{..._,cursor:Jl(I,_.cursor,1)}};let L=I[_.cursor];if(!Kl(L))return{state:_};let J=_.selected.includes(L.target)?_.selected.filter((K)=>K!==L.target):Mg(I,[..._.selected,L.target]);return{state:{..._,selected:J}}}var Yl="◉",Zl="◯",Xl=">",Ql=" ";function qg(_,I,O){return["",`${jg(_)} CC Safety Net ${Hg(_)}:`,"",...I.map((L,J)=>{let K=O.selected.includes(L.target),ne=J===O.cursor,oe=K?Yl:Zl,ue=ne?Xl:Ql,pe=L.available?"":` (${L.unavailableReason??"not installed"})`,ve=`${oe} ${L.label}${pe}`,we=!L.available?nn.dim(ve):K?nn.green(ve):ne?nn.bold(ve):ve;return`${ue} ${we}`}),"",_==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":I.some((L)=>L.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${_}. q/Esc: close`].join(`
`)}var Wl=["global-hook","plugin"];function Vg(_,I,O={}){let L=O.color!==!1?nn.bold:(K)=>K;return["","Install the Kimi Code integration as:","",...[`Global hook — ${I?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((K,ne)=>{let oe=ne===_,ue=`${oe?Yl:Zl} ${K}`;return`${oe?Xl:Ql} ${oe?L(ue):ue}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function ec(_){let{input:I,output:O}=_;Bn.emitKeypressEvents(I);let L=I.isRaw===!0;I.setRawMode(!0),I.resume();let J=0,K=()=>{if(J===0)return;Bn.moveCursor(O,0,-J),Bn.cursorTo(O,0),Bn.clearScreenDown(O)},ne=()=>{K();let oe=_.render();O.write(`${oe}
`),J=oe.split(`
`).length};return new Promise((oe)=>{let ue=(ve)=>{I.off("keypress",pe),I.setRawMode(L),I.pause(),K(),oe(ve)};function pe(ve,we){_.onKey(ve,we,{finish:ue,draw:ne})}I.on("keypress",pe),ne()})}function nc(_={}){let I=0;return ec({input:_.input??process.stdin,output:_.output??process.stdout,render:()=>Vg(I,_.globalHookInstalled===!0),onKey:(O,L,J)=>{if(L.ctrl&&L.name==="c"){J.finish(null),(_.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(L.name==="escape"||O==="q")return J.finish(null);if(L.name==="return"||L.name==="enter")return J.finish(Wl[I]);if(L.name==="up"||L.name==="down"||O==="k"||O==="j")I=(I+1)%Wl.length,J.draw()}})}function bi(_=process.stdin,I=process.stdout){return Boolean(_.isTTY&&I.isTTY&&typeof _.setRawMode==="function")}function tc(_,I,O={}){let L=O.output??process.stdout,J=Gg(I);return ec({input:O.input??process.stdin,output:L,render:()=>qg(_,I,J),onKey:(K,ne,oe)=>{let ue=Ug(_,K,ne);if(!ue)return;let pe=Bg(J,I,ue);if(J=pe.state,pe.done==="interrupt"){oe.finish(null),(O.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(pe.done==="abort")return oe.finish(null);if(pe.done==="update")return oe.finish("update");if(pe.done==="confirm"){if(J.selected.length===0){L.write("\x07"),oe.draw();return}oe.finish([...J.selected]),L.write(`${Fg(_)} selected integrations...
`);return}oe.draw()}})}import{existsSync as rc,lstatSync as Jg,mkdirSync as Wg,mkdtempSync as Kg,readdirSync as Yg,readFileSync as _t,rmSync as Mr}from"node:fs";import{basename as Zg,dirname as Xg,join as kn}from"node:path";import{fileURLToPath as Qg}from"node:url";var wi="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",nt="cc-safety-net",ot="cc-safety-net/index.ts";import{spawn as zg}from"node:child_process";var ki=(_,I)=>{let O=Wn([..._],process.env);return new Promise((L)=>{let J=zg(O.cmd,O.args,{cwd:I,stdio:["ignore","pipe","pipe"]}),K=Ko(J),ne=!1,oe=setTimeout(()=>{ne=!0,J.kill()},120000);J.on("error",(ue)=>{clearTimeout(oe),L({status:null,errorCode:ue.code,stdout:K.stdout,stderr:[ue.message,K.stderr].filter(Boolean).join(`
`)})}),J.on("close",(ue)=>{clearTimeout(oe),L({status:ne?null:ue,errorCode:ne?"ETIMEDOUT":void 0,stdout:K.stdout,stderr:K.stderr})})})};var At="cc-safety-net.ts",xi=kn("amp",ot);function eh(_){return kn(_.home,".config","amp","plugins","cc-safety-net.ts")}function nh(){let _=Xg(Qg(import.meta.url)),I=kn(_,xi),O=kn(_,"..",xi),L=kn(_,"..","..","..","dist",xi);return[I,O,L]}function th(_=nh()){let I=_.find((O)=>rc(O)&&Jg(O).isFile());if(!I)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return I}function oc(_){try{return JSON.parse(_)}catch{return}}function Ur(_){return _.subarray(0,Buffer.byteLength(wi)).toString("utf-8")===wi}async function Kt(_,I,O){let L=await _(I,O);if(L.status===0)return L;throw Error([`Failed to run ${I.join(" ")}${L.status===null?"":` (exit ${L.status})`}.`,[L.stdout,L.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function ic(_){let I=await _(["amp","plugins","repositories","--json"]);if(I.status===null)throw Error(`${I.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${I.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${I.stderr}`.trim());if(I.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${I.status}). Sign in with "amp login" and rerun install --amp.
${[I.stdout,I.stderr].filter(Boolean).join(`
`)}`.trim());let O=oc(I.stdout),L=(Array.isArray(O)?O:[]).filter((J)=>tn(J,"scope")==="user"&&tn(J,"exists")===!0&&tn(J,"viewerCanWrite")===!0).map((J)=>tn(J,"cloneRef")).find((J)=>typeof J==="string"&&J.length>0);if(!L)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return L}async function sc(_,I,O){let L=Kg(kn(I.tmpdir,"cc-safety-net-amp-"));try{return await Kt(_,["amp","clone","user-plugins",L]),await O(L)}finally{Mr(L,{recursive:!0,force:!0})}}function Si(_){return`rerun ${_==="overwrite"?"install":"uninstall"} --amp`}function ac(_,I,O){let L=kn(_,I),J=cn(L);if(!J)return;if(J.isSymbolicLink()||!J.isFile())throw Error(`Refusing to ${O} ${I} in your Amp personal plugins repository: not a regular file. Remove it there and ${Si(O)}.`);let K=_t(L);if(Ur(K))return K;throw Error(`Refusing to ${O} unmanaged file ${I} in your Amp personal plugins repository. Remove it there and ${Si(O)}.`)}function lc(_,I){let O=kn(_,nt),L=cn(O);if(!L)return;if(L.isSymbolicLink()||!L.isDirectory())throw Error(`Refusing to ${I} ${nt} in your Amp personal plugins repository: not a regular directory. Remove it there and ${Si(I)}.`);return ac(_,ot,I)}function rh(_){let I=kn(_,At),O=cn(I);if(!O||O.isSymbolicLink()||!O.isFile())return;let L=_t(I);return Ur(L)?L:void 0}async function cc(_,I,O,L){if(await Kt(_,O,I),(await Kt(_,["git","status","--porcelain"],I)).stdout.trim()==="")return!1;return await Kt(_,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",L],I),await Kt(_,["git","push","origin","HEAD"],I),!0}function Hr(_,I){oh(_,I),ih(_,I)}function dc(_,I){if(I==="keep")return;throw Error(`Local Amp plugin ${_} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function oh(_,I){let O=eh(_),L=cn(O);if(!L)return;if(!L.isSymbolicLink()&&L.isFile()&&Ur(_t(O))){Mr(O);return}dc(O,I)}function ih(_,I){let O=kn(_.home,".config","amp","plugins",nt),L=cn(O);if(!L)return;if(!L.isSymbolicLink()&&L.isDirectory()&&sh(O)){Mr(O,{recursive:!0});return}dc(O,I)}function sh(_){let I=Zg(ot);if(Yg(_).join("\x00")!==I)return!1;let O=kn(_,I),L=cn(O);return!!L&&!L.isSymbolicLink()&&L.isFile()&&Ur(_t(O))}function ah(_){let I=d(_);if(!rc(I))return"";let O=oc(_t(I,"utf-8"));if(!O||typeof O!=="object"||Array.isArray(O))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(C(O,_.home))};
`}async function uc(_,I=th(),O=ki){let L=Buffer.concat([_t(I),Buffer.from(ah(_),"utf-8")]),J=await ic(O);return sc(O,_,async(K)=>{let ne=`${J}/${nt}`,oe=lc(K,"overwrite"),ue=ac(K,At,"overwrite");if(oe?.equals(L)&&!ue)return Hr(_,"fail"),{path:ne,alreadyInstalled:!0};if(Wg(kn(K,nt),{recursive:!0}),mn(kn(K,ot),L),ue)Mr(kn(K,At));let pe=await cc(O,K,["git","add","--",ot,...ue?[At]:[]],`chore: update cc-safety-net plugin to v${un()}`);return Hr(_,"fail"),{path:ne,alreadyInstalled:!pe}})}async function pc(_,I=ki){let O=await ic(I);return sc(I,_,async(L)=>{let J=lc(L,"remove"),K=rh(L),ne=`${O}/${K&&!J?At:nt}`;if(!J&&!K)return Hr(_,"keep"),{path:ne,alreadyInstalled:!1};return await cc(I,L,["git","rm","--",...J?[ot]:[],...K?[At]:[]],`chore: remove cc-safety-net plugin v${un()}`),Hr(_,"keep"),{path:ne,alreadyInstalled:!0}})}import{existsSync as fc,mkdirSync as lh,readFileSync as ch}from"node:fs";import{dirname as dh}from"node:path";var Ci=_n["antigravity-cli"],dt="cc-safety-net";function pt(_){return Boolean(_)&&typeof _==="object"&&!Array.isArray(_)}function Br(){return{PreToolUse:[{hooks:[{type:"command",command:Ci,timeout:30}]}]}}function mc(_){try{let I=JSON.parse(ch(_,"utf-8"));if(!I||typeof I!=="object"||Array.isArray(I))throw Error("Antigravity hooks config must be a JSON object");return I}catch(I){if(I instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${_}: ${I.message}`);throw I}}function gc(_){let I=_[dt];if(I===void 0){let L=Br();return _[dt]=L,{definition:L,preToolUse:L.PreToolUse??[]}}if(!pt(I))throw Error(`Antigravity hooks config entry "${dt}" must be an object`);let O=Array.isArray(I.PreToolUse)?I.PreToolUse:[];return I.PreToolUse=O,{definition:I,preToolUse:O}}function hc(_){if(!Array.isArray(_.PreToolUse))return!1;return _.PreToolUse.some((I)=>pt(I)&&Array.isArray(I.hooks)&&I.hooks.some((O)=>pt(O)&&O.command===Ci))}function uh(_){return Object.values(_).some((I)=>pt(I)&&I.enabled!==!1&&hc(I))}function ph(_){if(_[dt]===void 0)return!1;let I=gc(_);if(I.definition.enabled!==!1||!hc(I.definition))return!1;return I.definition.enabled=!0,!0}function fh(_){if(_[dt]===void 0){_[dt]=Br();return}let I=gc(_);I.definition.enabled=!0,I.preToolUse.push(Br().PreToolUse?.[0]??{hooks:[]})}function mh(_){let I=!1;for(let O of Object.values(_)){if(!pt(O)||!Array.isArray(O.PreToolUse))continue;O.PreToolUse=O.PreToolUse.flatMap((L)=>{if(!pt(L)||!Array.isArray(L.hooks))return[L];let J=L.hooks.filter((K)=>!pt(K)||K.command!==Ci);if(J.length!==L.hooks.length)I=!0;return J.length===0?[]:[{...L,hooks:J}]})}return I}function Gr(_,I){mn(_,`${JSON.stringify(I,null,2)}
`)}function yc(_){let I=Dt(_.home);if(lh(dh(I),{recursive:!0}),!fc(I))return Gr(I,{[dt]:Br()}),{path:I,alreadyInstalled:!1};let O=mc(I);if(uh(O))return{path:I,alreadyInstalled:!0};if(ph(O))return Gr(I,O),{path:I,alreadyInstalled:!1};return fh(O),Gr(I,O),{path:I,alreadyInstalled:!1}}function vc(_){let I=Dt(_.home);if(!fc(I))return{path:I,alreadyInstalled:!1};let O=mc(I);if(!mh(O))return{path:I,alreadyInstalled:!1};return Gr(I,O),{path:I,alreadyInstalled:!0}}import{existsSync as Ei,readlinkSync as yh}from"node:fs";import{join as qn}from"node:path";import{spawn as gh}from"node:child_process";var $n=Pn.map((_)=>({target:_.id,flag:_.flag,label:fn(_.id),probeCommand:_.probeCommand}));function Ri(_){let I=new Set(_);return $n.map((O)=>O.target).filter((O)=>I.has(O))}async function bc(_,I){for(let O of _)await I(O)}var hh=5000;function Yt(_,I=hh){return new Promise((O)=>{let L=Wn([..._],process.env),J=gh(L.cmd,L.args,{env:process.env,stdio:"ignore"}),K=!1,ne=(ue)=>{if(K)return;K=!0,clearTimeout(oe),O(ue)},oe=setTimeout(()=>{J.kill(),ne(!1)},I);J.on("error",()=>ne(!1)),J.on("close",(ue)=>ne(ue===0))})}function wc(_=Yt,I={}){let O=new Set(I.configuredTargets??[]);return Promise.all($n.map(async(L)=>({target:L.target,flag:L.flag,label:L.label,...xc(I.action,await _(L.probeCommand),O.has(L.target))})))}function kc(_,I){let O=new Set(I.configuredTargets??[]);return _.map((L)=>({...L,...xc(I.action,L.available,O.has(L.target))}))}function xc(_,I,O){if(_==="uninstall")return O?{available:!0}:{available:!1,unavailableReason:"not installed"};if(_==="install"&&O)return{available:!1,unavailableReason:"already installed"};if(!I)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}var Vn="cc-safety-net",Pc=["npx","-y","@deepseek-ai/dsh"],Sc="DeepSeek Harness",Cc=["@deepseek-ai","dsh-desktop"],Ec="Quit DeepSeek Harness Desktop, then run this command again: Desktop plugins can only change while it is closed.",Pi=(_)=>`DeepSeek Harness Desktop is not in its default location, so ${_} ${Vn} from its Plugins page.`,Ac=(_,I)=>Ei(qn(Lo(_),I,"package.json"));function Ai(_,I){let O=I.platform??process.platform,L=Ac(_,"desktop"),J=O==="darwin"?[qn(_.home,"Applications"),I.systemApplications??"/Applications"].map((K)=>qn(K,`${Sc}.app`,"Contents","Resources","runtime","cli","bin","dsh")):O==="win32"?[qn(_.env.get("LOCALAPPDATA")||qn(_.home,"AppData","Local"),"Programs",Sc,"resources","runtime","cli","bin","dsh.cmd")]:[];return{profile:L,cli:L?J.find((K)=>Ei(K)):void 0}}function _c(_,I=process.platform){if(I==="win32")return Ei(qn(_.env.get("APPDATA")||qn(_.home,"AppData","Roaming"),...Cc,"lockfile"));let O=vh(qn(_.home,"Library","Application Support",...Cc,"SingletonLock")),L=Number(/-(\d+)$/.exec(O??"")?.[1]);return Number.isInteger(L)&&L>0&&bh(L)}function vh(_){try{return yh(_)}catch{return}}function bh(_){try{return process.kill(_,0),!0}catch(I){return I.code==="EPERM"}}async function Ic(_,I={}){let O=Ai(_,I);if(O.cli&&_c(_,I.platform))throw Error(Ec);let L=!O.cli||Ac(_,"web")||await(I.probe??Yt)(uo),J=[...O.cli?[{profile:"desktop",label:"Desktop",dsh:[O.cli]}]:[],...L?[{profile:"web",label:"web",dsh:Pc}]:[]];return{commands:J.map((K)=>[...K.dsh,"plugin","--profile",K.profile,"add",`${Vn}@${un()}`]),afterInstall:async()=>{let K=new Set(No(_).filter((oe)=>oe.enabled).map((oe)=>oe.name)),ne=J.filter((oe)=>!K.has(oe.profile));if(ne.length>0)throw Error(`DeepSeek Harness installed ${Vn} in the ${Rc(ne)} but did not enable it. Enable it from the Plugins page.`)},message:[`Added ${Vn} to the DeepSeek Harness ${Rc(J)}.`,...O.profile&&!O.cli?[Pi("add")]:[]].join(`
`)}}function Rc(_){return`${_.map((I)=>I.label).join(" and ")} profile${_.length>1?"s":""}`}function Tc(_,I={}){let O=new Set(No(_).map((K)=>K.name));if(!O.has("desktop")&&!O.has("web"))throw Error(`${Vn} is not installed in the DeepSeek Harness web or Desktop profile`);let L=O.has("desktop")?Ai(_,I).cli:void 0,J=O.has("desktop")&&!L;if(J&&!O.has("web"))throw Error(Pi("remove"));if(L&&_c(_,I.platform))throw Error(Ec);return{commands:[...L?[[L,"plugin","--profile","desktop","remove",Vn]]:[],...O.has("web")?[[...Pc,"plugin","--profile","web","remove",Vn]]:[]],...J?{afterUninstall:()=>{throw Error(`Removed ${Vn} from the DeepSeek Harness web profile, but ${Pi("remove")}`)}}:{}}}function $c(_,I,O={}){let L=Ai(I,O).cli!==void 0;return _.map((J)=>J.target==="deepseek-harness"&&L?{...J,available:!0,unavailableReason:void 0}:J)}import{existsSync as wh,readdirSync as kh,rmSync as xh}from"node:fs";import{join as Sh}from"node:path";function Oc(_,I=process.platform,O){if(!wh(_))return;let L=I==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);kh(_).filter((J)=>J!==O&&L.test(J)).forEach((J)=>{xh(Sh(_,J),{recursive:!0,force:!0})})}import{existsSync as Dc,readdirSync as Ch,rmSync as Rh}from"node:fs";import{join as It}from"node:path";function qr(_,I=process.platform){let O=It(_.env.get("npm_config_cache")||(I==="win32"?It(_.env.get("LOCALAPPDATA")||It(_.home,"AppData","Local"),"npm-cache"):It(_.home,".npm")),"_npx");if(!Dc(O))return;Ch(O).filter((L)=>Dc(It(O,L,"node_modules","cc-safety-net"))).forEach((L)=>{Rh(It(O,L),{recursive:!0,force:!0})})}import{existsSync as Mc,mkdirSync as Eh,readFileSync as Uc}from"node:fs";import{dirname as Ah,join as Hc}from"node:path";function Ph(_,I){if(_[I]!=="#")return I;let O=_.indexOf(`
`,I+1);return O===-1?_.length:O+1}function _i(_,I,O){let L=new RegExp(`^(\\s*)${I}\\s*=\\s*\\[`),J=0;for(let K of _.split(`
`)){if(/^\s*\[/.test(K))return;let ne=L.exec(K);if(ne){let oe=J+ne[0].lastIndexOf("[");return{start:oe,end:_o(_,oe,{skipComment:Ph,...O})}}J+=K.length+1}return}function Lc(_,I,O){let L=_.slice(0,I.end).trimEnd(),J=fa(_,I.end),K=J===""?"     ":`${J}  `,ne=!L.endsWith("[")&&!L.endsWith(",");return`${L}${ne?",":""}
${K}${O}${_.slice(I.end)}`}function Nc(_,I,O){let L=_.indexOf(O,I.start);if(L===-1||L>I.end)return _;return`${_.slice(0,L)}${_.slice(L+O.length).replace(/^\s*,/,"")}`}function jc(_,I){let O=new RegExp(`^\\s*${I}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),L=_.split(`
`),J=L.findIndex((oe)=>/^\s*\[/.test(oe)),K=J===-1?L:L.slice(0,J),ne=J===-1?[]:L.slice(J);return[...K.filter((oe)=>!O.test(oe)),...ne].join(`
`)}function Fc(_,I,O){let L=new RegExp(`^\\s*\\[\\[${I}]]\\s*$`,"m");return _.split(/(?=^\s*\[)/m).filter((J)=>!L.test(J)||!J.includes(O)).join("").trimEnd()}var Zt=_n["kimi-code"],Ii=`[[hooks]]
event = "PreToolUse"
command = "${Zt}"`,Gc=`{ event = "PreToolUse", command = "${Zt}" }`,Bc={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function qc(_){return Hc(_.env.get("KIMI_CODE_HOME")??Hc(_.home,".kimi-code"),"config.toml")}function _h(_){let I=_i(_,"hooks",Bc);if(I&&_.slice(I.start+1,I.end).trim())return Lc(_,I,Gc);let O=jc(_,"hooks").trimEnd();if(O==="")return`${Ii}
`;return`${O}

${Ii}
`}function Vc(_){let I=qc(_);if(Eh(Ah(I),{recursive:!0}),!Mc(I))return mn(I,`${Ii}
`),{path:I,alreadyInstalled:!1};let O=Uc(I,"utf-8");if(O.includes(Zt))return{path:I,alreadyInstalled:!0};return mn(I,_h(O)),{path:I,alreadyInstalled:!1}}function zc(_){let I=qc(_);if(!Mc(I))return{path:I,alreadyInstalled:!1};let O=Uc(I,"utf-8");if(!O.includes(Zt))return{path:I,alreadyInstalled:!1};let L=_i(O,"hooks",Bc),J=L?Nc(O,L,Gc):`${Fc(O,"hooks",Zt)}
`;return mn(I,J),{path:I,alreadyInstalled:!0}}var Ti="safety-net@cc-marketplace",Jc=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),Wc=new Set(["antigravity-cli","cursor","grok-build","hermes-agent","kimi-code"]);function $i(_){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(_??"")}function Qc(_){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(_??"")}function Ih(_){return/^Marketplace `cc-marketplace`\s*$/m.test(_??"")}var ed={"claude-code":{installCommands:(_)=>{let I=Sr(_,"cc-safety-net@cc-marketplace");return{commands:[...I?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...Eo(_).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:Sr(_,Ti)?[["claude","plugin","uninstall",Ti]]:[],update:I}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(_,I)=>{let O=I??await yn(["codex","plugin","list"]),L=Qc(O);return{commands:[L||Ih(O)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:$i(O)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:L}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:ca},"copilot-cli":{installCommands:async()=>{let _=await yn(["copilot","plugin","list"]),I=[...ka(_)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...xa(_)?[["copilot","plugin","uninstall",va]]:[]];if(ba(_))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",An]],cleanupCommands:I,update:!0};return{commands:[wa(await yn(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",An]],cleanupCommands:I}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(_)=>{let I=Ho(_);if(I.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(I.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:Xo,installCommands:(_)=>{let I=!zr(Vr(Bt(_),Sn));return{commands:fl(),afterInstall:()=>ml(I)}},uninstallCommands:[["openclaw","plugins","uninstall",dn,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:Cl},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]},"deepseek-harness":{installCommands:(_)=>Ic(_),uninstallCommands:(_)=>Tc(_)}};function nd(_,I=(O)=>O){try{let O=JSON.parse(I(Xc(_,"utf-8")));if(!O||typeof O!=="object"||Array.isArray(O))throw Error(`Settings file ${_} must be a JSON object`);return O}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse ${_}: ${O.message}`);throw O}}function Th(_){let I=Vr(Nt(_),"settings.json");if(!zr(I))return;let O=nd(I,xn),L=O.enabledPlugins;if(!L||typeof L!=="object"||Array.isArray(L))return;if(L[An]!==!1)return;let J=Xc(I,"utf-8"),K=J.replace(new RegExp(`("${An}"\\s*:\\s*)false`),"$1true");return L[An]=!0,mn(I,K!==J?K:`${JSON.stringify(O,null,2)}
`),`Enabled ${An} plugin in ${I}`}function $h(_){let I=li(_);if(!zr(I))return;let O=nd(I);if(!Array.isArray(O.packages))return;let L=O.packages.find((J)=>!!J&&typeof J==="object"&&!Array.isArray(J)&&ci(J.source)&&("extensions"in J));if(!L)return;return delete L.extensions,mn(I,`${JSON.stringify(O,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${I}`}function Kc(_,I){let O=gn({label:I,booleans:Object.fromEntries($n.map((K)=>[K.target,[K.flag]]))},_),L=O.errors[0];if(L)throw Error(L);let J=$n.filter((K)=>O.flags[K.target]).map((K)=>K.target);if(J.length!==1)throw Error(`Choose exactly one ${I} target: ${$n.map((K)=>K.flag).join(", ")}`);return J[0]}async function td(_,I=bt){let[O,L,J]=await Promise.all([I(["amp","plugins","list"],30000),I(["codex","plugin","list"],30000),I(["copilot","--binary-version"])]);return{codexPluginListOutput:L,hooks:Pt(_,process.cwd(),{ampPluginListOutput:O,codexPluginListOutput:L,copilotCliVersion:J})}}async function Oh(_,I,O=bt){let L=await td(_,O);return L.hooks.filter((J)=>I==="install"?J.configured:J.detected||J.inspectionStatus==="not-inspected").filter((J)=>J.platform!=="codex"||!$i(L.codexPluginListOutput)||Qc(L.codexPluginListOutput)).map((J)=>J.platform)}function Dh(_,I,O,L){if(O.length>0)return{finish:async()=>[Kc(O,I)]};if(!L.selectTargets&&!bi(L.input,L.output))return{finish:async()=>[Kc(O,I)]};let J=L.detectConfiguredTargets??(()=>Oh(_,I,L.fetchVersion)),K=Promise.all([wc(L.probeTargets).then((ne)=>$c(ne,_)),J()]);return{ready:K,finish:async()=>{let[ne,oe]=await K,ue=kc(ne,{action:I,configuredTargets:oe}),pe=L.selectTargets?await L.selectTargets(I,Zc(I,ue)):await tc(I,Zc(I,ue),{input:L.input,output:L.output});if(pe==="update")return pe;if(!pe||pe.length===0)return null;return Ri(pe)}}}async function Lh(_,I,O=!1,L){let J=ed[_];J.beforeInstall?.(I);let K=typeof J.installCommands==="function"?await J.installCommands(I,L):{commands:J.installCommands};return await Yo(K.commands),await al(K.cleanupCommands??[]),await K.afterInstall?.(),[`${K.update||O?"Updated":"Installed"} ${fn(_)} integration`,K.message??J.postInstallMessage].filter(Boolean).join(`
`)}async function Nh(_,I){let O=ed[_];if(!O.uninstallCommands)throw Error(`${fn(_)} uninstall is not supported`);let L=typeof O.uninstallCommands==="function"?O.uninstallCommands(I):{commands:O.uninstallCommands};return await Yo(L.commands),L.afterUninstall?.(),`Uninstalled ${fn(_)} integration`}function jh(_){let I=Al(_);return I.alreadyInstalled?`Uninstalled OpenCode plugin from ${I.path}`:`OpenCode plugin not installed in ${I.path}`}var rd={"antigravity-cli":{install:yc,uninstall:vc},cursor:{install:$a,uninstall:Oa},"grok-build":{install:Va,uninstall:za},"kimi-code":{install:Vc,uninstall:zc}};function Fh(_,I,O,L=!1){if(_==="install"&&!L)qr(O);let J=rd[I][_](O),K=fn(I),ne=_!=="install"?"Uninstalled":L?"Updated":"Installed";return _==="install"&&J.alreadyInstalled?L?`${K} hook up to date in ${J.path}`:`${K} hook already installed in ${J.path}`:_==="uninstall"&&!J.alreadyInstalled?`${K} hook not installed in ${J.path}`:`${ne} ${K} hook ${_==="install"?"in":"from"} ${J.path}`}var od={amp:{install:uc,uninstall:pc,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:Za,uninstall:Xa,afterInstall:async(_)=>{let I=Jo(_);return await yn(["hermes","plugins","enable",Rn,"--no-allow-tool-override"]),!I},beforeUninstall:async(_)=>{zo(_);try{await yn(["hermes","plugins","disable",Rn])}catch(I){console.warn(`${I instanceof Error?I.message:String(I)}
Removing the plugin files anyway; ${Rn} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function Hh(_,I,O,L=!1){let J=od[I];if(_==="uninstall")await J.beforeUninstall?.(O);let K=_==="install"?await J.install(O):await J.uninstall(O),ne=_==="install"&&await J.afterInstall?.(O),oe=fn(I),ue=!ne&&(_==="install"&&K.alreadyInstalled||_==="uninstall"&&!K.alreadyInstalled);return[ue?_==="install"?`${oe} plugin ${L?"up to date":"already installed"} at ${K.path}`:`${oe} plugin not installed at ${K.path}`:`${_!=="install"?"Uninstalled":L?"Updated":"Installed"} ${oe} plugin ${_==="install"?"at":"from"} ${K.path}`,ue?void 0:J.restartNote].filter(Boolean).join(`
`)}var Mh={"copilot-cli":{afterInstall:Th},"hermes-agent":{beforeInstall:(_,I)=>{if(!I)qr(_)}},openclaw:{beforeUninstall:Xo},pi:{afterInstall:$h}};function Uh(_){return _ in rd}function Gh(_){return _ in od}var Yc=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Bh(_){if(Gt({environment:_,cwd:process.cwd()}).status!=="configured")return Yc;return[Yc,"",nn.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function Zc(_,I){return I.map((O)=>_==="install"&&O.target==="kimi-code"&&O.unavailableReason==="already installed"?{...O,available:!0,unavailableReason:void 0,label:`${O.label} (global hook installed)`}:O)}function qh(_,I){if(_.selectKimiInstallMethod)return _.selectKimiInstallMethod();if(!bi(_.input,_.output))return Promise.resolve("global-hook");return nc({input:_.input,output:_.output,globalHookInstalled:Gt({environment:I,cwd:process.cwd()}).status==="configured"})}async function id(_,I,O,L=!1,J){let K=Mh[I];if(_==="install")K?.beforeInstall?.(O,L);if(_==="uninstall")K?.beforeUninstall?.(O);if(Uh(I))return Fh(_,I,O,L);if(Gh(I))return Hh(_,I,O,L);if(_==="uninstall")return I==="opencode"?jh(O):Nh(I,O);return[await Lh(I,O,L,J),await K?.afterInstall?.(O)].filter(Boolean).join(`
`)}function Vh(_){let I=gn({label:"update"},_).errors[0];if(I)throw Error(I)}async function zh(_,I=bt){let O=await td(_,I),L=Vr(Nt(_),"installed-plugins");return{targets:Ri([...O.hooks.filter((K)=>K.platform!=="copilot-cli"&&K.detected).map((K)=>K.platform),...[Cr,ya,ha].flatMap((K)=>zr(Vr(L,...K))?["copilot-cli"]:[]),...Sr(_,Ti)?["claude-code"]:[],...$i(O.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:O.codexPluginListOutput}}async function Jh(_){let I=c(),O=_.output??process.stdout,L=(_.scriptPath??process.argv[1]??"").split(/[\\/]/),J=L.find((Pe)=>/^bunx-\d+-/.test(Pe)),K=J!==void 0||L.includes("_npx")?null:(_.checkLatestVersion??Un)(),ne=async()=>{let Pe=K&&await K;if(Pe?.updateAvailable)O.write(`
Update available: cc-safety-net ${Pe.currentVersion} → ${Pe.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},oe=zh(I,_.fetchVersion??bt).then(async(Pe)=>{let Se=new Set(Pe.targets);return{targets:Pe.targets,codexPluginListOutput:Pe.codexPluginListOutput,available:new Map(await Promise.all($n.filter((en)=>Se.has(en.target)&&Jc.has(en.target)).map(async(en)=>[en.target,await Yt(en.probeCommand)])))}}),ue=await Ot(_.showBanner??!0,()=>({ready:oe,finish:()=>oe}),()=>$t({input:_.input??process.stdin,output:O}),{loadingMessage:"Checking installed integrations…",output:O}),pe=await Promise.resolve().then(()=>(Oc(I.tmpdir,process.platform,J),null)).catch((Pe)=>Xt(Pe));if(ue.targets.length===0){if(O.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),pe!==null)console.error(pe);return await ne(),pe===null?0:1}let ve=ue.targets.some((Pe)=>Wc.has(Pe))?await Promise.resolve().then(()=>(qr(I),null)).catch((Pe)=>Xt(Pe)):null,we=await br(Promise.all(ue.targets.map((Pe)=>{if(Jc.has(Pe)&&!ue.available.get(Pe))return Promise.resolve({message:`${fn(Pe)} not found; skipped`,failed:!1});if(ve!==null&&Wc.has(Pe))return Promise.resolve({message:ve,failed:!0});return id("install",Pe,I,!0,ue.codexPluginListOutput).then((Se)=>({message:Se,failed:!1}),(Se)=>({message:Xt(Se),failed:!0}))})),{loadingMessage:`Updating ${ue.targets.length} integration${ue.targets.length===1?"":"s"}…`,output:O}),Ce=pe===null?we:[...we,{message:pe,failed:!0}];return Ce.forEach((Pe)=>Pe.failed?console.error(Pe.message):O.write(`${Pe.message}
`)),await ne(),Ce.some((Pe)=>Pe.failed)?1:0}function Oi(_,I={}){return Promise.resolve().then(()=>Vh(_)).then(()=>Jh(I)).catch((O)=>(console.error(Xt(O)),1))}async function Qt(_,I,O={}){try{let L=c(),J=await Ot(!0,()=>Dh(L,_,I,O),()=>$t({input:O.input??process.stdin,output:O.output??process.stdout}),{loadingMessage:_==="install"?"Checking available integrations…":"Checking installed integrations…",output:O.output??process.stdout});if(!J)return(O.output??process.stdout).write(`Cancelled: nothing was ${_}ed.
`),0;if(J==="update")return(O.runUpdate??(()=>Oi([],{fetchVersion:O.fetchVersion,input:O.input,output:O.output,showBanner:!1})))();let K=O.output??process.stdout;return await bc(J,async(ne)=>{if(ne==="kimi-code"&&_==="install"){let ue=await qh(O,L);if(ue===null){K.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(ue==="plugin"){K.write(`${Bh(L)}
`);return}}let oe=await br(id(_,ne,L),{loadingMessage:`${_==="install"?"Installing":"Uninstalling"} ${fn(ne)} integration…`,output:K});K.write(`${oe}
`)}),0}catch(L){return console.error(Xt(L)),1}}function Xt(_){let I=_ instanceof Error?_.message:String(_),O=typeof _==="object"&&_!==null&&"code"in _?_.code:null;if(O==="EACCES"||O==="EPERM")return`${I}
Check file permissions for the target config file and parent directory.`;if(O==="ENOENT")return`${I}
Check that the target config path and parent directory exist.`;if(O==="ENOTDIR")return`${I}
Check that every parent path component is a directory.`;return I}import{mkdirSync as Qh}from"node:fs";import{dirname as ey}from"node:path";import{createInterface as ny}from"node:readline";import{existsSync as ad,readFileSync as Wh}from"node:fs";function ft(_,I){let O=et(_,I);return{policy:O.policy,errors:ae(Ze(O.issues,Qe,(L)=>L.kind==="custom")," "," ")}}function er(_,I){return ft(_,I).errors}function sd(_,I){return{"safety.level":_.safety.level,...Di("safety.overrides",_.safety.overrides),"workflow.worktree_mode":String(_.workflow.worktree_mode),"destructive_command_protection.enabled":String(_.destructive_command_protection.enabled),...Di("destructive_command_protection.overrides",_.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":Li(_.destructive_command_protection.allow_paths),"secret_protection.enabled":String(_.secret_protection.enabled),...Di("secret_protection.overrides",_.secret_protection.overrides),"secret_protection.deny_paths":Li(_.secret_protection.deny_paths),"secret_protection.allow_paths":Li(_.secret_protection.allow_paths),...I?{"audit.retention_days":String(_.audit.retention_days)}:{}}}function Jr(_,I,O){let L=sd(_,O),J=sd(I,O);return[...new Set([...Object.keys(L),...Object.keys(J)])].flatMap((K)=>L[K]===J[K]?[]:[{field:K,before:L[K],after:J[K]}])}function nr(_,I){let O=d(_,I);if(!ad(O))return{baseline:C(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,_.home),diagnostics:[]};let L=mt(O),J=ft(L.value,_.home);return{baseline:J.policy,diagnostics:L.errors.length>0?L.errors:J.errors}}function mt(_){if(!ad(_))return{errors:[`${_}: file not found`]};try{return{value:JSON.parse(Wh(_,"utf-8")),errors:[]}}catch(I){let O=I instanceof Error?I.message:String(I);return{errors:[`${_}: ${I instanceof SyntaxError?`Invalid JSON: ${O}`:O}`]}}}function Wr(_,I){let O=Kh(_)?_:{};return{version:I.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((L)=>O[L]!==void 0).map((L)=>[L,O[L]]))}}function Di(_,I){return Object.fromEntries(Object.entries(I).flatMap(([O,L])=>L===void 0?[]:[[`${_}.${O}`,String(L)]]))}function Li(_){return _.length===0?"(none)":_.join(", ")}function Kh(_){return!!_&&typeof _==="object"&&!Array.isArray(_)}import{chmodSync as Yh,existsSync as ld,mkdirSync as Zh,readFileSync as cd}from"node:fs";import{dirname as Xh}from"node:path";function dd(_,I={}){let O=d(_,I);if(!ld(O))return{path:O,exists:!1,raw:"",policy:z(),errors:[]};let L=cd(O,"utf-8");if(!L.trim())return{path:O,exists:!0,raw:L,policy:z(),errors:["Config file is empty"]};try{let J=ft(JSON.parse(L),_.home);return{path:O,exists:!0,raw:L,policy:J.policy,errors:J.errors}}catch(J){return{path:O,exists:!0,raw:L,policy:z(),errors:[`Invalid JSON: ${J instanceof Error?J.message:String(J)}`]}}}function Fn(_,I,O={}){let L=d(_,O),J=ft(I,_.home);if(J.errors.length>0)return{path:L,policy:z(),errors:J.errors};let K=J.policy;return Zh(Xh(L),{recursive:!0,mode:448}),g(ie(L),`${JSON.stringify(K,null,2)}
`,384),Yh(L,384),{path:L,policy:K,errors:[]}}function ud(_,I){let O=ft(I,_.home);if(O.errors.length>0)return{errors:O.errors};return{preview:Ne(O.policy,_.env),errors:[]}}function pd(_,I={}){let O=d(_,I);if(!ld(O))return Fn(_,ee,I);let L=cd(O,"utf-8");if(!L.trim())return Fn(_,ee,I);try{return Fn(_,C(JSON.parse(L),_.home),I)}catch{return Fn(_,ee,I)}}var fd=new Set(["check","apply"]),md="(unset)";async function hd(_,I,O={}){let L=gn({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},I),J=L.positionals[0],K=[...L.errors,...J&&!fd.has(J)?[`Unknown policy subcommand: ${J}`]:[],...J&&fd.has(J)&&!L.positionals[1]?[`policy ${J} requires a file`]:[],...L.positionals.slice(2).map((Se)=>`Unexpected policy argument: ${Se}`)];if(K.length>0){for(let Se of K)console.error(Se);return 1}let ne=L.positionals[1];if(!J||!ne)return Et(lr,console.error),1;let oe=L.flags.global?d(_):b(O.cwd??process.cwd()),ue=mt(ne),pe=[...ue.errors,...er(ue.value,_.home).map((Se)=>`${ne}: ${Se}`),...!L.flags.global&&oy(ue.value)&&ue.value.audit!==void 0?[`${ne}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(pe.length>0){for(let Se of pe)console.error(Se);return 1}let ve=C(ue.value,_.home);if(console.log(`Scope: ${L.flags.global?"user":"project"} (${oe})`),console.log(`Proposal: ${ne}`),L.flags.global)gd(C(mt(oe).value,_.home),ve,!0);if(!L.flags.global){let Se=nr(_).baseline;console.log("Effective policy (user + project merged):"),gd(Q(Se,le(mt(oe).value,_.home).policy).policy,Q(Se,le(ue.value,_.home).policy).policy,!1)}if(J==="check")return 0;let we=O.input??process.stdin,Ce=O.output??process.stdout;if(!we.isTTY||!Ce.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${ne}${L.flags.global?" --global":""}`),1;if(!await ty(`Apply this policy to ${oe}? [y/N] `,we,Ce))return console.log("Cancelled; nothing was written."),0;return ry(_,oe,ue.value,ve,L.flags.global),console.log(`Policy applied: ${oe}`),0}function ty(_,I,O){let L=ny({input:I,output:O,terminal:!1});return new Promise((J)=>{L.once("close",()=>J(!1)),L.question(_,(K)=>{J(/^y(es)?$/i.test(K.trim())),L.close()})})}function ry(_,I,O,L,J){if(J){Fn(_,L);return}Qh(ey(I),{recursive:!0}),bn(I,Wr(O,L))}function gd(_,I,O){let L=Jr(_,I,O);if(L.length===0){console.log("No changes.");return}console.log(`Changes (${L.length}):`);for(let J of L)console.log(`  ${J.field}: ${J.before??md} -> ${J.after??md}`)}function oy(_){return!!_&&typeof _==="object"&&!Array.isArray(_)}import{join as yv}from"node:path";var yd="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- `caffeinate`, `exec`, `nice`, `nohup`, `setsid`, `stdbuf`, `time`, and `timeout` are built-in transparent wrappers and need no configuration. Configure only other wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function Kr(_,I){if(!_.ok){xd(_);return}wd(_,I)}function bd(_,I,O){if(_.ok)console.log(O);if(!_.add){Kr(_,`Added rulebook source: ${I}`);return}if(!_.ok){xd(_);return}if(_.add.added.length>0)console.log(`Added ${_.add.added.length} ${_.add.added.length===1?"rulebook":"rulebooks"} from ${_.add.source} at ${_.add.ref}:`),_.add.added.forEach((L)=>{console.log(`  - ${L}`)});if(_.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${_.add.source} at ${_.add.ref}: ${_.add.alreadyConfigured.join(", ")}`);if(_.add.commits.length>0)console.log(`Vendored at ${_.add.commits.map((L)=>L.slice(0,7)).join(", ")}.`);wd(_,"Rule config updated.")}function wd(_,I){for(let O of _.changes??[])console.log(O);console.log(I),console.log(""),iy(_.entries)}function iy(_){if(_.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${_.length}):`);for(let I of _)console.log(`  - ${I.name} ${I.version} (${sy(I.ruleCount)})`),console.log(`    Source: ${I.spec}`)}function sy(_){return`${_} ${_===1?"rule":"rules"}`}function kd(_){gt("Active sources",_.rulebooks,(I)=>[`[${I.source}] ${I.name} ${I.version}`,`  Source: ${I.spec}`]),gt("Active rules",_.rules,(I)=>[`[${ly(_,I.name)}] ${I.name}`,...ay(I),`  Reason: ${I.reason}`]),gt("Disabled rules",vd(_,"off"),(I)=>[I.key]),gt("Reason overrides",vd(_,"reason"),(I)=>[I.key,`  Reason: ${I.value.reason}`]),gt("Transparent wrappers",_.transparent_wrappers,(I)=>[I]),gt("Issues",_.errors,(I)=>[I]),gt("Warnings",_.warnings,(I)=>[I])}function gt(_,I,O){if(I.length===0){console.log(`${_}: (none)`);return}console.log(`${_} (${I.length}):`);for(let L of I){let[J,...K]=O(L);console.log(`  - ${J}`);for(let ne of K)console.log(`    ${ne}`)}}function ay(_){if(!_.match)return[`  Command: ${_.subcommand?`${_.command} ${_.subcommand}`:_.command}`,`  Block args: ${_.block_args.join(", ")}`];return[`  Command: ${[_.command,..._.match.command_path].join(" ")}`,..._.match.any_args?[`  Any args: ${_.match.any_args.join(", ")}`]:[],..._.match.exclude_args?[`  Exclude args: ${_.match.exclude_args.join(", ")}`]:[]]}function ly(_,I){return _.rulebooks.find((O)=>O.rules.includes(I))?.source??"project"}function vd(_,I){return Object.entries({..._.userConfig?.overrides,..._.projectConfig?.overrides}).filter((O)=>{if(I==="off")return O[1]==="off";return!!O[1]&&typeof O[1]==="object"}).map(([O,L])=>({key:O,value:L}))}function xd(_){for(let I of _.errors)console.error(I)}import{dirname as Vd,join as ro}from"node:path";import{join as Mi,resolve as wy}from"node:path";function Ni(_){let I=m(_);if(I.errors.length>0)return{ok:!1,result:{ok:!1,errors:I.errors,entries:[]}};return{ok:!0,config:I.config??lt}}function Sd(_){bn(_,{version:1,rules:[],overrides:{},transparent_wrappers:[]})}function Cd(_){bn(_,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as Qr}from"node:path";var cy="custom.";function Yr(_){if(_.rulebook_version!==2)return[];let I=_.rules.map((O)=>({name:O.name,command:O.command,block_args:[],match:O.match,reason:O.reason,intent:O.intent}));return(_.tests??[]).flatMap((O,L)=>{let J=ji(h(O.command));if(J.length===0)return[`tests[${L}]: could not parse fixture command: ${O.command}`];let K=J.reduce((ne,oe)=>ne??A(oe,I)?.id.slice(cy.length),void 0);if(O.expect==="blocked"){if(K===O.rule)return[];let ne=K?`"${K}" matched first`:"no rule matched";return[`tests[${L}]: expected "${O.rule}" to block "${O.command}" but ${ne}`]}return K?[`tests[${L}]: expected "${O.command}" to be allowed but "${K}" matched`]:[]})}function ji(_){return _.nodes.flatMap((I)=>{if(I.kind==="group"||I.kind==="function")return ji(I.body);if(I.kind!=="command")return[];let O=xe(te(I.dialect,I.words)).words.map(t);return[...O.length>0?[O]:[],...I.nested.flatMap((L)=>ji(L))]})}var Zr=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function Xr(_={}){return{requests:0,responseBytes:0,maxRequests:_.maxRequests??Zr.maxRequests,maxResponseBytes:_.maxResponseBytes??Zr.maxResponseBytes}}function Hn(_){return{controller:new AbortController,budget:Xr(),resolveUrl:_}}function Rd(_){return _ instanceof Error&&_.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function Pd(_){if(_.requests>=_.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");_.requests++}function Ed(_,I){if(I>_.maxResponseBytes-_.responseBytes)throw _.responseBytes+=I,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");_.responseBytes+=I}var Id=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function Ad(_,I,O=v(Qr(Qr(I)),"rules policy"),L=Hn()){if(S(_))return fy(_,L);return py(_,I,O)}async function Td(_,I,O,L,J,K){if(!S(_))return Ad(_,I,O,L);let ne=J?null:dy(_,I,O);if(ne)return ne;if(!J&&!K)throw Error(`${_} is not vendored; run rule update ${_} to vendor it`);return Ad(_,I,O,L)}function dy(_,I,O=v(Qr(Qr(I)),"rules policy")){let L=D(_),J=N(I,L.name),K=r(i(O,J));if(K===null)return null;let ne=ce(Fi(K,`Invalid rulebook ${J}.`));if(ne.name!==L.name)throw Error(`rulebook name "${ne.name}" in ${J} must match "${L.name}"`);return{spec:_,rulebook:ne,content:K}}async function $d(_,I={}){if(!Y(_))throw Error(`Invalid GitHub repository source: ${_}`);let[O,L]=_.split("/");if(!O||!L)throw Error(`Invalid GitHub repository source: ${_}`);if(I.ref!==void 0&&!se(I.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${I.ref}`);let J=I.operation??Hn(),K=I.ref??await uy(O,L,_,J),ne=await Dd(O,L,K,_,J),oe=await eo(`https://api.github.com/repos/${O}/${L}/git/trees/${ne}?recursive=1`,"tree",J),ue=oe.response;if(!ue.ok)throw Error(`Failed to inspect ${_}: GitHub tree returned ${ue.status}`);let pe=JSON.parse(oe.content);if(!Array.isArray(pe?.tree))throw Error(`Failed to inspect ${_}: unexpected GitHub tree response`);let ve=pe.tree,we=[...new Set(ve.flatMap((Ce)=>{if(!Ce||typeof Ce!=="object")return[];let Pe=Ce;if(Pe.type!=="blob"||typeof Pe.path!=="string")return[];let Se=Pe.path.match(at);return Se?.[1]?[Se[1]]:[]}))].sort();if(we.length===0)throw Error(`No rulebooks found in ${_} under ${ge}/`);return{source:_,owner:O,repo:L,ref:K,commit:ne,names:we}}async function uy(_,I,O,L){let J=await eo(`https://api.github.com/repos/${_}/${I}`,"metadata",L),K=J.response;if(!K.ok)throw Error(`Failed to inspect ${O}: GitHub returned ${K.status}`);let oe=JSON.parse(J.content)?.default_branch;if(typeof oe!=="string"||oe==="")throw Error(`Failed to inspect ${O}: missing default branch`);if(!se(oe))throw Error(`GitHub returned an invalid default branch: ${oe}`);return oe}function py(_,I,O){ct(_);let L=N(I,_),J=r(i(O,L));if(J===null)throw Error(`Rulebook source not found: ${_}`);let K=Od(Fi(J,"Invalid local rulebook source."));if(K.name!==_)throw Error(`rulebook name "${K.name}" must match local source "${_}"`);return{spec:_,rulebook:K,content:J}}async function fy(_,I){let O=D(_),L=await Dd(O.owner,O.repo,O.ref,_,I),J=await eo(`https://raw.githubusercontent.com/${O.owner}/${O.repo}/${L}/${O.path}`,"raw",I),K=J.response;if(!K.ok)throw Error(`Failed to fetch ${_}: GitHub raw returned ${K.status}`);let ne=J.content,oe=Od(Fi(ne,"Invalid GitHub rulebook response."));if(oe.name!==O.name)throw Error(`rulebook name "${oe.name}" must match GitHub source "${O.name}"`);return{spec:_,rulebook:oe,content:ne}}function Od(_){let I=ce(_),O=Yr(I);if(O.length>0)throw Error(O.join("; "));return I}function Fi(_,I){try{return JSON.parse(_)}catch{throw Error(I)}}async function Dd(_,I,O,L,J){let K=await eo(`https://api.github.com/repos/${_}/${I}/commits/${encodeURIComponent(O)}`,"commit",J),ne=K.response;if(!ne.ok)throw Error(`Failed to resolve ${L}: GitHub returned ${ne.status}`);let oe=JSON.parse(K.content);if(typeof oe?.sha!=="string"||oe.sha==="")throw Error(`Failed to resolve commit for ${L}`);return oe.sha}async function my(_,I,O={}){if(O.signal?.aborted)throw O.signal.reason;let L=O.budget??Xr(),J=new AbortController,K=()=>J.abort(O.signal?.reason);O.signal?.addEventListener("abort",K,{once:!0});let ne=!1,oe=setTimeout(()=>{if(J.signal.aborted)return;ne=!0,J.abort()},O.timeoutMs??Id.timeoutMs);try{if(O.signal?.aborted)throw O.signal.reason;Pd(L);let ue=await fetch(_,{signal:J.signal,redirect:"error"});if(!ue.ok)return Ld(ue),{response:ue,content:""};return{response:ue,content:await gy(ue,I,L,()=>J.abort())}}catch(ue){if(ne)throw Error("GitHub request timed out",{cause:ue});if(O.signal?.aborted)throw O.signal.reason;throw ue}finally{clearTimeout(oe),O.signal?.removeEventListener("abort",K)}}function eo(_,I,O){return my(O.resolveUrl?.(_)??_,I,{budget:O.budget,signal:O.controller.signal})}async function gy(_,I,O=Xr(),L){let J=Id[`${I}Bytes`],K=Number(_.headers.get("content-length"));if(Number.isFinite(K)&&K>J)throw Ld(_),Error(`GitHub ${I} response exceeds ${J} bytes`);if(!_.body)return"";let ne=_.body.getReader(),oe=[],ue=0;while(!0){let pe=await ne.read();if(pe.done)break;try{Ed(O,pe.value.byteLength)}catch(ve){throw L?.(),_d(ne),ve}if(ue+=pe.value.byteLength,ue>J)throw L?.(),_d(ne),Error(`GitHub ${I} response exceeds ${J} bytes`);oe.push(Buffer.from(pe.value))}return Buffer.concat(oe,ue).toString("utf-8")}function Ld(_){if(!_.body)return;Nd(()=>_.body?.cancel())}function _d(_){Nd(()=>_.cancel())}function Nd(_){try{Promise.resolve(_()).catch(()=>{})}catch{}}var hy=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function jd(_,I){let O=Md(_.rules,I);if(O.length>0)return{ok:!0,specs:O};return Hd(_.rules,I)}function Fd(_,I){let O=Md(_,I);if(O.length>0)return{ok:!0,specs:O};let L=vy(_,I);if(L.length>0)return{ok:!0,specs:L};let J=by(_,I);if(!J.ok)return J;if(J.specs.length>0)return{ok:!0,specs:J.specs};return Hd(_,I)}function Hd(_,I){let O=_.filter((L)=>Hi(L)?.name===I);if(O.length===1)return{ok:!0,specs:O};return yy(I,O)}function yy(_,I){return{ok:!1,result:{ok:!1,errors:I.length===0?[`No configured rulebook matches ${_}`]:[`Ambiguous rulebook match ${_}: ${I.join(", ")}`],entries:[]}}}function Md(_,I){return _.filter((O)=>O===I)}function vy(_,I){let O=I.match(hy),L=O?.[1],J=O?.[2],K=O?.[3];if(!L||!J||!K||!se(K))return[];return Ud(_,(ne)=>ne.owner===L&&ne.repo===J&&ne.ref===K)}function by(_,I){if(!Y(I))return{ok:!0,specs:[]};let[O,L]=I.split("/"),J=Ud(_,(ne)=>ne.owner===O&&ne.repo===L);if(new Set(J.map((ne)=>Hi(ne)?.ref).filter((ne)=>!!ne)).size<2)return{ok:!0,specs:J};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${I}. Use an explicit ref:`,`  cc-safety-net rule remove ${I}#<ref>`],entries:[]}}}function Hi(_){try{return D(_)}catch{return null}}function Ud(_,I){return _.filter((O)=>{let L=Hi(O);return L?I(L):!1})}async function to(_,I={}){let O=Ui(I);return ky(_,O,await no(_,O,Hn()))}function ky(_,I,O){if(!O.ok)return O;let L=wn(_,I),J=[...new Set(H(L.configPath,L.filesystemScope))];if(J.length===0)return O;return{ok:!1,errors:J,entries:O.entries}}async function no(_,I,O,L={},J=new Set,K=new Set){try{let ne=wn(_,I),oe=Ni(ne.configTarget);if(!oe.ok)return oe.result;let ue=oe.config,pe=I.only?jd(ue,I.only):{ok:!0,specs:ue.rules};if(!pe.ok)return pe.result;let ve=new Set([...I.refresh?pe.specs:[],...J]),we=(rn)=>Td(rn,ne.configDir,ne.filesystemScope,O,ve.has(rn),!I.refresh||ve.has(rn)),Ce=await $y(ue.rules,I.refresh?(rn)=>we(rn).then((pn)=>({ok:!0,item:pn})).catch((pn)=>{if(Rd(pn))throw pn;return{ok:!1,spec:rn,message:pn instanceof Error?pn.message:String(pn)}}):async(rn)=>({ok:!0,item:await we(rn)}),O),Pe=Ce.filter((rn)=>!rn.ok),Se=Ce.filter((rn)=>rn.ok).map((rn)=>rn.item),en=Se.flatMap((rn)=>xy(rn,ue.rules)),Le=Se.flatMap((rn)=>Sy(rn,K,ne)),Ve=new Set([...en,...Le].map((rn)=>rn.spec)),on=[...Pe,...en,...Le],sn=[],an=Ry(sn,()=>Se.flatMap((rn)=>Ve.has(rn.spec)||on.length>0&&K.has(rn.spec)?[]:Cy(rn,ne,L,sn)));return{ok:on.length===0,errors:on.map((rn)=>`Failed to update ${rn.spec}: ${rn.message}`),entries:Se.map(Ey),changes:an}}catch(ne){return rr(ne)}}function xy(_,I){if(!S(_.spec))return[];let O=De(_.spec),L=I.filter((J)=>J!==_.spec&&De(J).toLowerCase()===O.toLowerCase());if(L.length===0)return[];return[{ok:!1,spec:_.spec,message:`rulebook name "${O}" is also claimed by ${L.join(", ")}; rename one of them`}]}function Sy(_,I,O){if(!I.has(_.spec)||!S(_.spec))return[];let L=N(O.configDir,_.rulebook.name),J=r(i(O.filesystemScope,L));if(J===null||J===_.content)return[];return[{ok:!1,spec:_.spec,message:`${L} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function Cy(_,I,O,L){if(!S(_.spec))return[];let J=N(I.configDir,_.rulebook.name),K=i(I.filesystemScope,J),ne=r(K);if(ne===_.content)return[];return L?.push({target:K,previous:ne}),g(K,_.content,void 0,O._testAfterPolicyRename),Py(_,ne)}function Ry(_,I){try{return I()}catch(O){for(let L of[..._].reverse()){if(L.previous===null){j(L.target);continue}g(L.target,L.previous)}throw O}}function Py(_,I){if(I===null)return[`Vendored ${_.spec} (${_.rulebook.version})`];let O=be(I),L="problem"in O?null:O.rulebook,J=new Map(L?.rules.map((ne)=>[ne.name,JSON.stringify(ne)])??[]),K=new Set(_.rulebook.rules.map((ne)=>ne.name));return[`Updated ${_.spec} (${L?.version??"unreadable"} -> ${_.rulebook.version})`,...[...K].filter((ne)=>!J.has(ne)).map((ne)=>`  + ${ne}`),...[...J.keys()].filter((ne)=>!K.has(ne)).map((ne)=>`  - ${ne}`),..._.rulebook.rules.filter((ne)=>{let oe=J.get(ne.name);return oe!==void 0&&oe!==JSON.stringify(ne)}).map((ne)=>`  ~ ${ne.name}`)]}function Ey(_){return{spec:_.spec,name:_.rulebook.name,version:_.rulebook.version,ruleCount:_.rulebook.rules.length}}async function Gd(_,I,O={}){return Ay(_,I,Dy(O),Hn())}async function Ay(_,I,O,L,J={}){let K=null,ne=!1;try{let oe=wn(_,O),ue=r(oe.configTarget);K={target:oe.configTarget,content:ue};let pe=Ni(oe.configTarget);if(!pe.ok)return pe.result;let ve=pe.config,we=Y(I);_y(I,O,we);let Ce=we?await $d(I,{ref:O.ref,operation:L}):null,Pe=Ce?Iy(Ce,O.rulebooks):[],Se=Ce?Pe.map((sn)=>Ty(ve.rules,Ce,sn)??`${I}#${Ce.ref}/${sn}`):[I],en=Se.filter((sn)=>!ve.rules.includes(sn)),Le=[...ve.rules,...en];if(Le.length>he)return Oy();if(Le.length!==ve.rules.length)ne=!0,bn(oe.configTarget,{version:1,rules:Le,overrides:ve.overrides??{},transparent_wrappers:ve.transparent_wrappers??[]},void 0,J._testAfterPolicyRename);let Ve=await no(_,O,L,J,new Set(en),new Set(en));if(!Ve.ok)tr(oe.configTarget,ue);if(!Ve.ok||!Ce)return Ve;let on=Pe.filter((sn,an)=>en.includes(Se[an]??""));return{...Ve,add:{source:I,ref:Ce.ref,selected:Pe,added:on,alreadyConfigured:Pe.filter((sn)=>!on.includes(sn)),commits:en.length>0?[Ce.commit]:[]}}}catch(oe){if(ne&&K)try{tr(K.target,K.content)}catch(ue){return rr(ue)}return rr(oe)}}function _y(_,I,O){if(!O&&I.rulebooks!==void 0)throw Error("--only can only select rulebooks from an owner/repo source");if(!O&&I.ref)throw Error(`--ref can only select a ref for an owner/repo source: ${_}`);if(I.rulebooks?.length===0)throw Error("--only requires at least one rulebook name");let L=I.rulebooks?.filter((J)=>!u.test(J))??[];if(L.length>0)throw Error(`Invalid rulebook names: ${L.join(", ")}`)}function Iy(_,I){let O=I?[...new Set(I)]:_.names,L=O.filter((J)=>!_.names.includes(J));if(L.length>0)throw Error(`Rulebooks not found in ${_.source} at ${_.ref}: ${L.join(", ")}
Available rulebooks: ${_.names.join(", ")}`);return O}function Ty(_,I,O){let L=`${I.source}#${I.ref}/${O}`;if(_.includes(L))return L;let J=`${I.source}#${I.commit}/${O}`;return _.find((K)=>K===J)}async function $y(_,I,O=Hn()){if(_.length>he)throw Error(ye);let L=[],J=0,K,ne=Array.from({length:Math.min(_.length,Zr.concurrency)},async()=>{while(!K){let oe=J;if(oe>=_.length)return;J++;try{L[oe]=await I(_[oe],oe,O.controller.signal)}catch(ue){if(!K)K={value:ue},J=_.length,O.controller.abort(ue);return}}});if(await Promise.all(ne),K)throw K.value;return L}function Oy(){return{ok:!1,errors:[ye],entries:[]}}function Ui(_){return{cwd:_.cwd,userConfigDir:_.userConfigDir,userConfigPath:_.userConfigPath,projectConfigPath:_.projectConfigPath,global:_.global,only:_.only,refresh:_.refresh}}function Dy(_){return{...Ui(_),ref:_.ref,rulebooks:_.rulebooks}}function Ly(_){return{...Ui(_),deleteSource:_.deleteSource}}async function Bd(_,I,O={}){try{return await Ny(_,I,Ly(O),{})}catch(L){return rr(L)}}async function Ny(_,I,O,L){let J=wn(_,O),K=m(J.configTarget);if(K.errors.length>0)return{ok:!1,errors:K.errors,entries:[]};if(!K.config)return{ok:!1,errors:[`No config found at ${J.configPath}`],entries:[]};let ne=Fd(K.config.rules,I);if(!ne.ok)return ne.result;let oe=O.deleteSource?jy(J.configDir,ne.specs,J.filesystemScope):{ok:!0,dirs:[]};if(!oe.ok)return oe.result;let ue=r(J.configTarget);if(ue===null)return rr(Error("Rules config is unavailable."));try{bn(J.configTarget,{version:1,rules:K.config.rules.filter((we)=>!ne.specs.includes(we)),overrides:K.config.overrides??{},transparent_wrappers:K.config.transparent_wrappers??[]},void 0,L._testAfterPolicyRename)}catch(we){throw tr(J.configTarget,ue),we}let pe=await no(_,O,Hn(),L);if(!pe.ok)return tr(J.configTarget,ue),pe;let ve=Fy(oe.dirs,L,J.filesystemScope);if(!ve.ok){tr(J.configTarget,ue);let we=await no(_,O,Hn(),L);if(!we.ok)return{ok:!1,errors:[...ve.result.errors,...we.errors],entries:we.entries};return ve.result}return pe}function jy(_,I,O){let L=I.flatMap((oe)=>u.test(oe)?[]:["--delete-source can only delete local rulebook sources"]),J=I.map((oe)=>Mi(_,oe)),K=L.length>0?[]:J.flatMap((oe)=>qd(oe,O)),ne=[...L,...K];return ne.length>0?{ok:!1,result:{ok:!1,errors:ne,entries:[]}}:{ok:!0,dirs:J}}function qd(_,I){let O=wy(_),L=i(I,O),J=fe(L);if(!J)return[`Local rulebook source directory not found: ${_}`];let K=J.find((ne)=>ne.name==="rulebook.json");if(!K)return[`Local rulebook source directory is missing rulebook.json: ${_}`];if(K.kind!=="file")throw new o(I.label);if(r(i(I,Mi(O,"rulebook.json"))),J.length>1)return[`Local rulebook source directory contains extra files: ${_}. delete manually if you really want to remove the directory.`];return[]}function Fy(_,I,O){let L=_.flatMap((J)=>{try{if(!fe(i(O,J)))return[];let K=qd(J,O);if(K.length>0)return K;return Hy(J,I,O),[]}catch(K){return[`Failed to delete local rulebook source ${J}: ${K instanceof Error?K.message:String(K)}`]}});return L.length>0?{ok:!1,result:{ok:!1,errors:L,entries:[]}}:{ok:!0}}function Hy(_,I,O){if(I._testDeleteLocalSourceDir){I._testDeleteLocalSourceDir(_);return}j(i(O,Mi(_,me))),st(i(O,_))}function tr(_,I){if(I===null){j(_);return}g(_,I)}function rr(_){return{ok:!1,errors:[_ instanceof Error?_.message:String(_)],entries:[]}}var My=".safety-net.json",Uy="~/.cc-safety-net/config.json";async function Wd(_,I){return[await zd(_,{legacyPath:Ks({cwd:I.cwd}),configPath:U(I.cwd),defaultRulebookName:"project-rules",migratedFrom:My,cleanup:I.cleanup,syncOptions:{cwd:I.cwd}}),await zd(_,{legacyPath:vt(_),configPath:G(_),defaultRulebookName:"user-rules",migratedFrom:Uy,cleanup:I.cleanup,syncOptions:{cwd:I.cwd,global:!0}})].every((L)=>L)?0:1}async function zd(_,I){let O=wn(_,I.syncOptions),L=i(O.filesystemScope,I.legacyPath),J=r(L);if(J===null)return console.log(`No legacy config found at ${I.legacyPath}`),!0;let K=By(J);if(!K.ok){for(let Pe of K.errors)console.error(Pe);return!1}let ne=m(O.configTarget);if(ne.errors.length>0){for(let Pe of ne.errors)console.error(Pe);return!1}let oe=ne.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},ue=qy(Vd(I.configPath),oe.rules,I.defaultRulebookName,I.migratedFrom,O.filesystemScope),pe=ro(Vd(I.configPath),ue,"rulebook.json"),ve=i(O.filesystemScope,pe),we=[Jd(O.configTarget),Jd(ve)],Ce=await Gy(_,I,O.configTarget,ve,ue,K.config.rules,oe.rules.includes(ue)?oe.rules:[...oe.rules,ue],oe.overrides??{},oe.transparent_wrappers??[]);if(!Ce.ok){Jy(we);for(let Pe of Ce.errors)console.error(Pe);return!1}if(!I.cleanup)return console.log(`Migrated legacy config at ${I.legacyPath}. Legacy file is no longer used.`),!0;if(!zy(O.configTarget,ve,ue,I.migratedFrom,K.config.rules))return console.error(`Migration cleanup verification failed for ${I.legacyPath}`),!1;return j(L),console.log(`Deleted legacy config at ${I.legacyPath}`),!0}async function Gy(_,I,O,L,J,K,ne,oe,ue){try{return bn(O,{version:1,rules:ne,overrides:oe,transparent_wrappers:ue}),bn(L,Vy(J,I.migratedFrom,K)),await to(_,I.syncOptions)}catch(pe){return{ok:!1,errors:[pe instanceof Error?pe.message:String(pe)]}}}function By(_){try{let I=JSON.parse(_),O=go(I);if(O.errors.length>0)return{ok:!1,errors:O.errors};return{ok:!0,config:{version:1,rules:I.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function qy(_,I,O,L,J){let K=I.find((ne)=>Wy(i(J,ro(_,ne,"rulebook.json")))===L);if(K)return K;if(r(i(J,ro(_,O,"rulebook.json")))===null)return O;for(let ne=2;;ne++){let oe=`${O}-${ne}`;if(r(i(J,ro(_,oe,"rulebook.json")))===null)return oe}}function Vy(_,I,O){return{rulebook_version:1,name:_,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:I,allowed_commands:[...new Set(O.map((L)=>L.command))],rules:O,tests:O.map((L)=>({command:[L.command,L.subcommand,L.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:L.name}))}}function zy(_,I,O,L,J){if(!m(_).config?.rules.includes(O))return!1;try{let ne=r(I);if(ne===null)return!1;let oe=JSON.parse(ne);return oe.migrated_from===L&&JSON.stringify(oe.rules)===JSON.stringify(J)}catch{return!1}}function Jd(_){return{target:_,content:r(_)}}function Jy(_){for(let I of _){if(I.content===null){j(I.target);continue}g(I.target,I.content)}}function Wy(_){let I=r(_);if(I===null)return null;try{let O=JSON.parse(I);return typeof O.migrated_from==="string"?O.migrated_from:null}catch{return null}}import{mkdir as Ky,readFile as Yy,writeFile as Zy}from"node:fs/promises";import{dirname as Xy,join as Qy}from"node:path";var ev=86400000,nv=604800000;async function Yd(_,I=Date.now()){if(_.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let O=He(_);if(!O)return null;let L=Qy(O,".cc-safety-net","update-check.json"),J=await tv(L,I);if(!J.lastCheck||I-J.lastCheck>ev){let oe=await Un();if(J.lastCheck=I,oe.latestVersion)J.latestVersion=oe.latestVersion;if(!await Kd(L,J))return null;if(oe.error)return null}let K=J.latestVersion,ne=un();if(!K||!ko(K,ne))return null;if(J.notifiedVersion===K&&J.notifiedAt!==void 0&&I-J.notifiedAt<nv)return null;if(J.notifiedVersion=K,J.notifiedAt=I,!await Kd(L,J))return null;return`UPDATE_AVAILABLE: cc-safety-net v${K} is available (running v${ne}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function tv(_,I){let O=await Yy(_,"utf8").then((K)=>JSON.parse(K)).catch(()=>{return});if(!O||typeof O!=="object"||Array.isArray(O))return{};let L=O,J=(K)=>typeof K==="number"&&Number.isFinite(K)&&K<=I?K:void 0;return{lastCheck:J(L.lastCheck),latestVersion:typeof L.latestVersion==="string"?L.latestVersion:void 0,notifiedVersion:typeof L.notifiedVersion==="string"?L.notifiedVersion:void 0,notifiedAt:J(L.notifiedAt)}}async function Kd(_,I){return Ky(Xy(_),{recursive:!0,mode:448}).then(()=>Zy(_,JSON.stringify(I),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as rv,resolve as Gi}from"node:path";var Zd="CC Safety Net Config",ov="═".repeat(Zd.length),iv="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",sv=new Set(["rule.json","rule.lock","cache"]);function Xd(_,I={}){try{return av(_,I)}catch(O){if(O instanceof o)return console.error(O.message),1;throw O}}function av(_,I){let O=I.cwd??process.cwd(),L=Z(_,{cwd:O}),J=vt(_),K=pr(O),ne=Gi(O,ge),oe=i(L.userScope,J),ue=i(L.projectScope,K),pe=!1,ve=!1,we=[],Ce=[],Pe=lv(i(L.projectScope,ne));if(dv(),r(L.userConfigTarget)!==null){let Se=Mn(L.userConfigTarget);if(Se.errors.push(...H(L.userConfigPath,L.userScope)),we.push({scope:"User",path:L.userConfigPath,result:Se,schema:"rules",target:L.userConfigTarget}),Se.errors.length>0)pe=!0}if(r(oe)!==null)if(ve=!0,r(L.userConfigTarget)!==null)Ce.push(oo("user","cleanup"));else{let Se=ho(oe);if(we.push({scope:"User",path:J,result:Se,schema:"legacy",inactive:!0,target:oe}),Ce.push(oo("user",Se.errors.length>0?"fix-or-delete":"migrate")),Se.errors.length>0)pe=!0}if(r(L.projectConfigTarget)!==null){let Se=Mn(L.projectConfigTarget);if(Se.errors.push(...H(L.projectConfigPath,L.projectScope)),we.push({scope:"Project",path:Gi(L.projectConfigPath),result:Se,schema:"rules",target:L.projectConfigTarget}),Se.errors.length>0)pe=!0;if(r(ue)!==null)ve=!0,Ce.push(oo("project","cleanup"))}else if(r(ue)!==null){ve=!0,pe=!0;let Se=ho(ue);we.push({scope:"Project",path:Gi(K),result:Se,schema:"legacy",inactive:!0,target:ue}),Ce.push(oo("project",Se.errors.length>0?"fix-or-delete":"migrate"))}if(Pe?.result.errors.length)pe=!0;if(we.length===0&&!Pe)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Se of we)if(Se.inactive)pv(Se.scope,Se.path,Se.result);else if(Se.result.errors.length>0)fv(Se.scope,Se.path,Se.result.errors);else{if(Se.schema==="rules"&&hv(Se.target))console.log(`
Added $schema to ${Se.scope.toLowerCase()} config.`);uv(Se.scope,Se.path,Se.result,Se.schema)}for(let Se of Ce)console.error(`
${nn.red(Se)}`);if(Pe)if(Pe.result.errors.length>0)gv(Pe.path,Pe.result.errors);else mv(Pe.path,Pe.result);if(pe)return console.error(`
Config validation failed.`),1;return console.log(ve?`
Configs valid with warnings.`:`
All configs valid.`),0}function oo(_,I){let O=`legacy ${_} config`;if(I==="cleanup")return`Warning: Legacy ${_} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(I==="migrate")return`Warning: Legacy ${_} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${_} config is no longer supported. Fix or delete the ${O}, then run \`npx -y cc-safety-net rule migrate\`.`}function lv(_){if(fe(_)===null)return null;let I=cv(_);if(I.ruleNames.size===0&&I.errors.length===0)return null;return{path:_.path,result:I}}function cv(_){let I=[],O=new Set,L=(fe(_)??[]).filter((J)=>!sv.has(J.name)).sort((J,K)=>J.name.localeCompare(K.name));if(L.length===0)return{errors:I,ruleNames:O};for(let J of L){if(!u.test(J.name)){I.push(`rulebook directory names must match ${u}: ${J.name}`);continue}if(J.kind!=="directory"){I.push(`${J.name} must be a rulebook directory`);continue}let K=i(_.scope,rv(_.path,J.name,"rulebook.json")),ne=r(K);if(ne===null){I.push(`${J.name}/rulebook.json is required`);continue}try{let oe;try{oe=JSON.parse(ne)}catch{I.push(`${J.name}/rulebook.json: invalid JSON`);continue}let ue=ce(oe);if(ue.name!==J.name){I.push(`rulebook name "${ue.name}" must match folder "${J.name}"`);continue}let pe=Yr(ue);if(pe.length>0){I.push(...pe.map((ve)=>`${J.name}/rulebook.json: ${ve}`));continue}O.add(J.name)}catch(oe){I.push(oe instanceof Error?`${J.name}/rulebook.json: ${oe.message}`:`${J.name}/rulebook.json: ${String(oe)}`)}}return{errors:I,ruleNames:O}}function dv(){console.log(Zd),console.log(ov)}function uv(_,I,O,L){if(console.log(`
✓ ${_} config: ${I}`),console.log(`  Schema: ${L==="rules"?"rulebook sources":"legacy inline rules"}`),O.ruleNames.size>0){console.log(`  ${L==="rules"?"Sources":"Rules"}:`);let J=1;for(let K of O.ruleNames)console.log(`    ${J}. ${K}`),J++}else console.log(`  ${L==="rules"?"Sources":"Rules"}: (none)`)}function pv(_,I,O){if(console.error(`
✗ Legacy ${_.toLowerCase()} config: ${I}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),O.errors.length>0){console.error("  Errors:");let L=1;for(let J of O.errors)for(let K of J.split("; "))console.error(`    ${L}. ${K}`),L++;return}if(O.ruleNames.size>0){console.error("  Rules:");let L=1;for(let J of O.ruleNames)console.error(`    ${L}. ${J}`),L++;return}console.error("  Rules: (none)")}function fv(_,I,O){Qd(`${_} config`,I,O)}function mv(_,I){console.log(`
✓ GitHub source rules: ${_}`),console.log("  Rulebooks:");let O=1;for(let L of I.ruleNames)console.log(`    ${O}. ${L}`),O++}function gv(_,I){Qd("GitHub source rules",_,I)}function Qd(_,I,O){console.error(`
✗ ${_}: ${I}`),console.error("  Errors:");let L=1;for(let J of O)for(let K of J.split("; "))console.error(`    ${L}. ${K}`),L++}function hv(_){try{let I=r(_);if(I===null)return!1;let O=JSON.parse(I);if(O.$schema)return!1;return g(_,JSON.stringify({$schema:iv,...O},null,2)),!0}catch(I){if(I instanceof o)throw I;return!1}}var eu=new Set(["init","add","remove","update","sync","list","wrapper","migrate","doc","verify"]),vv=new Set(["add","remove","list"]),bv="cc-safety-net/rulebooks";async function nu(_,I){try{return await wv(_,I)}catch(O){if(O instanceof o)return console.error(O.message),1;throw O}}async function wv(_,I){let O=xv(I),L=O.help?kv(O.positionals):null;if(L)return Et(L),0;if(O.errors.length>0){for(let oe of O.errors)console.error(oe);return 1}let J=O.positionals[0];if(!J)return Et(yt,console.error),1;let K=O.positionals[1],ne={global:O.global};if(J==="init"){let oe=wn(_,ne);Pv(oe.configTarget);let ue=yv(oe.configDir,"example-rules","rulebook.json"),pe=i(oe.filesystemScope,ue);if(O.example&&r(pe)===null)Cd(pe);let ve=H(oe.configPath,oe.filesystemScope);for(let we of ve)console.error(we);if(ve.length>0)return 1;return console.log("Rule config initialized."),0}if(J==="add"){let oe=tu(O);if(!oe)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let ue=wn(_,ne),pe=await Gd(_,oe,{...ne,ref:O.ref,rulebooks:O.only.length>0?O.only:void 0});return bd(pe,oe,`Scope: ${O.global?"user":"project"} (${ue.configDir})`),pe.ok?0:1}if(J==="remove"){if(!K)return console.error("rule remove requires a source"),1;let oe=await Bd(_,K,{...ne,deleteSource:O.deleteSource});return Kr(oe,`Removed rulebook source: ${K}`),oe.ok?0:1}if(J==="update"){let oe=await to(_,{...ne,only:K,refresh:!0});return Kr(oe,"Rule config updated."),oe.ok?0:1}if(J==="sync")return Xs(_,{global:O.global});if(J==="list"){let oe=X(_,{cwd:process.cwd()});return kd(oe),oe.errors.length>0?1:0}if(J==="wrapper")return Ev(_,O);if(J==="migrate")return Wd(_,{cleanup:O.cleanup,cwd:process.cwd()});if(J==="doc"){console.log(yd);let oe=await Yd(_);if(oe)console.error(oe);return 0}if(J==="verify")return Xd(_);return 1}function kv(_){if(_.length===0)return yt;let I=yt.subcommands.filter((L)=>L.usage.split(" ")[0]===_[0]);if(I.length===0)return null;if(_.length===1&&I.length>1)return{name:`rule ${_[0]}`,description:`Subcommands of rule ${_[0]}`,usage:`rule ${_[0]} <subcommand>`,subcommands:I,options:[]};let O=_.length===1?I[0]:I.find((L)=>L.usage.split(" ")[1]===_[1]);if(!O)return null;return{name:`rule ${_[0]}`,description:O.description,usage:`rule ${O.usage}`,options:_[0]==="add"?po:[],examples:_[0]==="add"?fo:void 0}}function xv(_){let I=gn({label:"rule",booleans:{global:["-g","--global"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"]},lists:{only:["--only"]},positionals:"list"},_),O={...I.flags,ref:I.values.ref,only:I.lists.only??[],help:I.help,positionals:I.positionals,errors:I.errors};return Sv(O),O}function Sv(_){let[I]=_.positionals;if(I&&!eu.has(I))_.errors.push(`Unknown rule subcommand: ${I}`);if(_.deleteSource&&I!=="remove")if(I&&eu.has(I))_.errors.push(`Unknown option for rule ${I}: --delete-source`);else _.errors.push("--delete-source is only valid with 'rule remove'");if(_.cleanup&&I!=="migrate")_.errors.push(or(I,"--cleanup"));if(_.example&&I!=="init")_.errors.push(or(I,"--example"));if(_.ref&&I!=="add")_.errors.push(or(I,"--ref"));if(_.only.length>0&&I!=="add")_.errors.push(or(I,"--only"));if(I==="add")Cv(_);if(I==="migrate"){if(_.global)_.errors.push(or(I,"--global"));if(_.positionals.length>1)_.errors.push(`Unexpected rule migrate argument: ${_.positionals[1]}`)}else if(I==="wrapper")Rv(_);else if(_.positionals.length>2)_.errors.push(`Unexpected rule argument: ${_.positionals[2]}`);if(I==="list"&&_.global)_.errors.push("Unknown option for rule list: --global")}function tu(_){if(_.positionals[1])return _.positionals[1];if(_.ref||_.only.length>0)return bv;return}function Cv(_){let I=tu(_);if(!I)return;if((_.ref||_.only.length>0)&&!Y(I)){if(_.ref)_.errors.push(`--ref can only select a ref for an owner/repo source: ${I}`);if(_.only.length>0)_.errors.push("--only can only select rulebooks from an owner/repo source");return}if(_.ref&&!se(_.ref))_.errors.push(`--ref must use valid path segments: ${_.ref}`);let O=_.only.filter((L)=>!u.test(L));if(O.length>0)_.errors.push(`Invalid rulebook names: ${O.join(", ")}`)}function or(_,I){return _?`Unknown option for rule ${_}: ${I}`:`Unknown option for rule: ${I}`}function Rv(_){let I=_.positionals[1],O=_.positionals[2];if(!I){_.errors.push("rule wrapper requires add, remove, or list");return}if(!vv.has(I)){_.errors.push(`Unknown rule wrapper action: ${I}`);return}if(I==="list"){if(O)_.errors.push(`Unexpected rule wrapper argument: ${O}`);return}if(!O){_.errors.push(`rule wrapper ${I} requires a command`);return}if(_.positionals.length>3)_.errors.push(`Unexpected rule wrapper argument: ${_.positionals[3]}`)}function Pv(_){if(r(_)===null){Sd(_);return}let I=m(_);if(!I.config)return;bn(_,{version:1,rules:I.config.rules,overrides:I.config.overrides??{},transparent_wrappers:I.config.transparent_wrappers??[]})}async function Ev(_,I){let O=I.positionals[1],L=I.positionals[2],J=wn(_,{global:I.global}).configTarget;if(O==="list"){let ue=m(J);if(ue.errors.length>0){for(let pe of ue.errors)console.error(pe);return 1}return Av(ue.config?.transparent_wrappers??[]),0}if(!L||!w.test(L))return console.error("transparent wrapper must match command pattern"),1;if(Ae(L))return console.error(`reserved command "${L}" cannot be a wrapper`),1;let K=m(J);if(K.errors.length>0){for(let ue of K.errors)console.error(ue);return 1}let ne=K.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},oe=O==="add"?[...new Set([...ne.transparent_wrappers??[],L])]:(ne.transparent_wrappers??[]).filter((ue)=>ue!==L);return bn(J,{version:1,rules:ne.rules,overrides:ne.overrides??{},transparent_wrappers:oe}),console.log(O==="add"?`Added transparent wrapper: ${L}`:`Removed transparent wrapper: ${L}`),0}function Av(_){if(_.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${_.length}):`);for(let I of _)console.log(`  - ${I}`)}import{sep as Dv}from"node:path";import{existsSync as _v,readFileSync as Iv}from"node:fs";import{join as Tv}from"node:path";async function $v(_){if(_.isTTY)return null;return(await qe(_).catch(()=>null))?.trim()||null}function Ov(_){let I=_.env.get("CLAUDE_SETTINGS_PATH");if(I)return I;return Tv(xr(_),"settings.json")}function Bi(_){let I=Ov(_);if(!_v(I))return!1;try{let O=Iv(I,"utf-8"),L=JSON.parse(O);if(!L.enabledPlugins)return!1;let J="cc-safety-net@cc-marketplace";if(!(J in L.enabledPlugins))return!1;return L.enabledPlugins[J]===!0}catch(O){if(x(n.debug,_.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${I}: ${O instanceof Error?O.message:String(O)}`);return!1}}async function qi(_,I=process.stdin){let O=Bi(_),L;if(!O)L="\uD83D\uDEE1️ CC Safety Net ❌";else{let K=E(_,{cwd:process.cwd()}),ne=K.policy,oe=T(ne,_.env),ue=Object.values(B(ne,oe.capabilities)).some((we)=>we.changesInherited),pe={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[ue?"custom":oe.effectiveLevel],ve=K.policyScopes&&!K.policyScopes.weakeningsIgnored&&K.policyScopes.weakenings.length>0?"\uD83D\uDD3B":"";L=`\uD83D\uDEE1️ CC Safety Net ${pe}${oe.worktreeMode?"\uD83C\uDF33":""}${ve}${K.state==="degraded"?"⚠️":""}`}let J=await $v(I);if(J&&!J.startsWith("{"))console.log(`${J} | ${L}`);else console.log(L)}function ru(_){let I=E(_,{cwd:process.cwd()}),O=I.policy,L=T(O,_.env),J=!!process.env.NO_COLOR||!process.stdout.isTTY,K=Math.min(process.stdout.columns||80,100),ne=J?"ok":"✔",oe=J?"OFF":"✘",ue=(en,Le)=>{let Ve=`  ${en.padEnd(13)}${Le}`;return(Ve.length>K?`${Ve.slice(0,K-1)}…`:Ve).replaceAll(oe,nn.red(oe))},pe=Object.values(B(O,L.capabilities)).some((en)=>en.changesInherited),ve=(en)=>en===_.home||en.startsWith(`${_.home}${Dv}`)?`~${en.slice(_.home.length)}`:en,we={ready:nn.green,degraded:nn.yellow}[I.state],Ce=I.policyScopes?.weakenings??[],Pe=[...Bi(_)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...I.diagnostics],Se=J?"-":"·";console.log([`${J?"":"\uD83D\uDEE1️  "}CC Safety Net — ${we(I.state)}`,"",ue("Protection",`destructive ${O.destructiveCommandProtectionEnabled?ne:oe}   secrets ${O.secretProtection.enabled?ne:oe}`),ue("Level",pe?`${L.effectiveLevel} (customised)`:L.effectiveLevel),ue("Rules",O.rules.length===0?"none active":`${O.rules.length} active`),ue("Policy",ve(d(_))),...I.policyScopes?[ue("Project",ve(b(process.cwd())))]:[],...L.worktreeMode?[ue("Worktree","relaxations active")]:[],"",...Ce.length===0?[]:[I.policyScopes?.weakeningsIgnored?"  Project policy (ignored)":"  Project policy",...Ce.flatMap((en)=>zt(en,"      ",K-6).map((Le,Ve)=>Ve===0?`    ${Le}`:Le)),""],...Pe.length===0?["  Everything configured is active."]:["  Not active",...Pe.flatMap((en)=>zt(en,"      ",K-6).map((Le,Ve)=>Ve===0?`    ${Se} ${Le}`:Le)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as mu}from"node:child_process";import{randomBytes as qv}from"node:crypto";import{existsSync as Vv}from"node:fs";import{createServer as zv}from"node:http";import{Writable as Jv}from"node:stream";var io=500;function Lv(_){let I=_.filter((J)=>J.decision!=="allow"),O=_.filter((J)=>J.decision==="allow"),L=Math.min(I.length,Math.max(io-O.length,Math.ceil(io/2)));return[...I.slice(0,L),...O.slice(0,io-L)]}function ou(_,I,O=F(_)){if(O)q(_,O);let L=(Le)=>new Date(Le.getFullYear(),Le.getMonth(),Le.getDate()).getTime(),J=L(new Date),K=new Date(J);K.setDate(K.getDate()-(I-1));let ne=K.getTime(),oe=[],ue={count:0};for(let Le of O?zn(O,ue):[])for(let Ve of ht(Le,ue)){let on=new Date(Ve.ts).getTime();if(!Number.isFinite(on))continue;if(on>=ne)oe.push(Ve)}oe.sort((Le,Ve)=>new Date(Ve.ts).getTime()-new Date(Le.ts).getTime());let pe=Array.from({length:I},()=>0),ve=Array.from({length:I},()=>0),we={},Ce={},Pe={},Se=0,en=0;for(let Le of oe){let Ve=Le.agent||"unknown";we[Ve]=(we[Ve]??0)+1;let on=Math.round((J-L(new Date(Le.ts)))/86400000),sn=I-1-on,an=on>=0&&on<I;if(an)ve[sn]=(ve[sn]??0)+1;if(Le.decision!=="allow"){if(Se++,Le.ruleId)Ce[Le.ruleId]=(Ce[Le.ruleId]??0)+1;let rn=co(Le.segment||Le.command);if(rn)Pe[rn]=(Pe[rn]??0)+1;if(Le.failureStage)en++;if(an)pe[sn]=(pe[sn]??0)+1}}return{days:I,logsDir:O,homeDir:_.home,totalInWindow:oe.length,truncated:oe.length>io,unreadable:ue.count,counts:{blocked:Se,allowed:oe.length-Se,agents:we,blockedByDay:pe,analyzedByDay:ve,rules:Ce,commands:Pe,errors:en},entries:Lv(oe).sort((Le,Ve)=>new Date(Ve.ts).getTime()-new Date(Le.ts).getTime())}}import{spawn as Nv}from"node:child_process";import{existsSync as jv,statSync as iu}from"node:fs";import{delimiter as Fv,join as Hv}from"node:path";var Mv=120000,so="Choose the project folder",Uv=`try
  return POSIX path of (choose folder with prompt "${so}")
on error number -128
  return ""
end try`,Gv=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${so}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,su=[{binary:"zenity",args:["--file-selection","--directory",`--title=${so}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",so]}],au=(_,I)=>(I.PATH??"").split(Fv).some((O)=>{if(O.length===0)return!1;try{let L=iu(Hv(O,_));return L.isFile()&&(L.mode&73)!==0}catch{return!1}});function Vi(_,I){if(_==="darwin"||_==="win32")return!0;if(_!=="linux")return!1;if(!I.DISPLAY&&!I.WAYLAND_DISPLAY)return!1;return su.some((O)=>au(O.binary,I))}function Bv(_,I){if(_==="darwin")return{cmd:"osascript",args:["-e",Uv]};if(_==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",Gv]};let O=su.find((L)=>au(L.binary,I));return O?{cmd:O.binary,args:O.args}:null}function zi(_=process.platform,I=process.env){let O=Bv(_,I);if(!O)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((L)=>{let J=Nv(O.cmd,O.args,{env:I,stdio:["ignore","pipe","pipe"]}),K="",ne=!1,oe=(pe)=>{if(ne)return;ne=!0,clearTimeout(ue),L(pe)},ue=setTimeout(()=>{J.kill(),oe({error:"The folder dialog timed out"})},Mv);J.stdout.on("data",(pe)=>{K+=pe.toString()}),J.on("error",()=>oe({error:`Could not open the folder dialog (${O.cmd})`})),J.on("close",()=>{let pe=K.trim().replace(/\/+$/,"");if(!pe)return oe({cancelled:!0});if(!jv(pe)||!iu(pe).isDirectory())return oe({error:"That selection is not a folder on disk"});oe({path:pe})})})}var lu=`<!doctype html>
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
    doctorOrder: 8,
    runtime: {
      order: 6,
      flags: ["-cp", "--copilot-cli"],
      description: "Run as GitHub Copilot CLI PreToolUse hook",
      legacyTopLevelFlags: ["-cp", "--copilot-cli"]
    },
    install: {
      order: 8,
      flag: "--copilot-cli",
      artifactKind: "plugin",
      probeCommand: ["copilot", "--binary-version"]
    }
  },
  {
    id: "gemini-cli",
    displayName: "Gemini CLI",
    doctorOrder: 7,
    runtime: {
      order: 5,
      flags: ["-gc", "--gemini-cli"],
      description: "Run as Gemini CLI BeforeTool hook",
      legacyTopLevelFlags: ["-gc", "--gemini-cli"]
    },
    install: {
      order: 7,
      flag: "--gemini-cli",
      artifactKind: "extension",
      probeCommand: ["gemini", "--version"]
    }
  },
  {
    id: "grok-build",
    displayName: "Grok Build",
    doctorOrder: 9,
    runtime: {
      order: 7,
      flags: ["-gb", "--grok-build"],
      description: "Run as Grok Build PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 9,
      flag: "--grok-build",
      artifactKind: "hook config",
      probeCommand: ["grok", "--version"]
    }
  },
  {
    id: "hermes-agent",
    displayName: "Hermes Agent",
    doctorOrder: 10,
    runtime: {
      order: 8,
      flags: ["-ha", "--hermes-agent"],
      description: "Run as Hermes Agent pre_tool_call hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 10,
      flag: "--hermes-agent",
      artifactKind: "plugin",
      probeCommand: ["hermes", "--version"]
    }
  },
  {
    id: "kimi-code",
    displayName: "Kimi Code",
    doctorOrder: 11,
    runtime: {
      order: 9,
      flags: ["-kc", "--kimi-code"],
      description: "Run as Kimi Code PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 11,
      flag: "--kimi-code",
      artifactKind: "hook config",
      probeCommand: ["kimi", "--version"]
    }
  },
  {
    id: "openclaw",
    displayName: "OpenClaw",
    doctorOrder: 12,
    install: {
      order: 12,
      flag: "--openclaw",
      artifactKind: "plugin",
      probeCommand: ["openclaw", "--version"]
    }
  },
  {
    id: "opencode",
    displayName: "OpenCode",
    doctorOrder: 13,
    install: {
      order: 13,
      flag: "--opencode",
      artifactKind: "plugin",
      probeCommand: ["opencode", "--version"]
    }
  },
  {
    id: "pi",
    displayName: "Pi",
    doctorOrder: 14,
    install: {
      order: 14,
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
`;var cu='<script id="ccsn-data" type="application/json">';function du(_){return lu.replace(cu,()=>cu+JSON.stringify({token:_}).replaceAll("<","\\u003c"))}var ao="kenryu42/cc-safety-net",Wv=`https://github.com/${ao}`,Ki=1e4,Kv=7,Yv="The project draft directory changed; reload the draft before applying.",Zv="audit settings are user scope only; remove the audit section from a project proposal";async function gu(_,I={}){let O=gn({label:"gui",booleans:{noOpen:["--no-open"]}},_),L=I.log??console.log,J=I.error??console.error;if(O.errors.length>0){for(let ne of O.errors)J(ne);return J("Usage: cc-safety-net gui [--no-open]"),1}let K=await Xv(c,I);if(L(`CC Safety Net policy GUI: ${K.url}`),!O.flags.noOpen)try{await(I.openBrowser??cb)(K.url)}catch(ne){J(`Failed to open browser: ${ne instanceof Error?ne.message:String(ne)}`),J(`Open this URL manually: ${K.url}`)}if(I.keepAlive===!1)return await K.close(),0;return await lb(K),0}async function Xv(_,I={}){let O=qv(24).toString("base64url"),L={dir:null,revision:0},J=zv((oe,ue)=>{Qv(_,oe,ue,O,I,L)});await new Promise((oe,ue)=>{J.once("error",ue),J.listen(0,"127.0.0.1",()=>{J.off("error",ue),oe()})});let ne=`http://127.0.0.1:${J.address().port}`;return{origin:ne,token:O,url:`${ne}/?token=${encodeURIComponent(O)}`,close:()=>ab(J)}}async function Qv(_,I,O,L,J,K){let ne=_(),oe=new URL(I.url??"/","http://127.0.0.1");if(I.method==="GET"&&oe.pathname==="/favicon.ico"){O.writeHead(204,{"cache-control":"no-store"}),O.end();return}if(!ob(I,oe,L)){ln(O,403,{error:"Forbidden"});return}if(I.method==="GET"&&oe.pathname==="/"){sb(O,du(L));return}if(I.method==="GET"&&oe.pathname==="/api/policy"){let ue=dd(ne,J),pe=E(ne,Ji(J));ln(O,200,{...ue,configState:$e(pe),...pe.policyScopes?{projectPolicy:{path:b(J.cwd??process.cwd()),weakenings:pe.policyScopes.weakeningsIgnored?[]:pe.policyScopes.weakenings}}:{},destructiveCommandRules:W,secretPatterns:Xe,version:un(),preview:ue.errors.length>0?null:Ne(ue.policy,ne.env)});return}if(I.method==="POST"&&oe.pathname==="/api/policy/preview"){let ue=await ir(I);if(!ue.ok){ln(O,ue.status,{errors:[ue.error]});return}let pe=ud(ne,ue.value);ln(O,pe.errors.length>0?400:200,pe);return}if(I.method==="POST"&&oe.pathname==="/api/policy/explain"){let ue=await ir(I);if(!ue.ok){ln(O,ue.status,{errors:[ue.error]});return}let pe=ue.value;if(pe===null||typeof pe.command!=="string"){ln(O,400,{errors:["command must be a string"]});return}let ve=er(pe.policy,ne.home);if(ve.length>0){ln(O,400,{errors:ve});return}ln(O,200,tb(ne,pe.command,pe.policy,J));return}if(I.method==="POST"&&oe.pathname==="/api/policy"){let ue=await ir(I);if(!ue.ok){ln(O,ue.status,{errors:[ue.error]});return}let pe=Fn(ne,ue.value,J);ln(O,pe.errors.length>0?400:200,pe);return}if(I.method==="POST"&&oe.pathname==="/api/reset"){ln(O,200,Fn(ne,ee,J));return}if(I.method==="POST"&&oe.pathname==="/api/repair"){ln(O,200,pd(ne,J));return}if(I.method==="POST"&&oe.pathname==="/api/policy/project/choose-directory"){let ue=await(J.chooseDirectory??zi)();if("path"in ue)K.dir=ue.path,K.revision+=1;ln(O,200,{cancelled:"cancelled"in ue,..."error"in ue?{error:ue.error}:{}});return}if(I.method==="GET"&&oe.pathname==="/api/policy/project"){let ue=hu(K,J),pe=uu(ue,ne.home),ve=nr(ne,J);ln(O,200,{path:b(ue),revision:K.revision,baseline:ve.baseline,userPolicyDiagnostics:ve.diagnostics,projection:pe.projection,projectionDiagnostics:pe.diagnostics,canPickDirectory:Vi(process.platform,process.env)});return}if(I.method==="POST"&&oe.pathname==="/api/policy/project/diff"){let ue=await pu(ne,I,O,K,J);if(!ue)return;let pe=uu(ue.dir,ne.home),ve=nr(ne,J).baseline,we=Q(ve,le(ue.proposal,ne.home).policy);ln(O,200,{rows:Jr(Q(ve,pe.projection).policy,we.policy,!1),weakenings:we.weakenings,existingFileDiagnostics:pe.diagnostics});return}if(I.method==="POST"&&oe.pathname==="/api/policy/project/apply"){let ue=await pu(ne,I,O,K,J);if(!ue)return;let pe=nb(ue.dir,ue.proposal,ne.home);ln(O,pe.errors.length>0?500:200,pe);return}if(I.method==="GET"&&oe.pathname==="/api/activity"){let ue=re(ne,J),pe=rb(oe.searchParams.get("days"),ue);if(pe===null){ln(O,400,{error:`days must be an integer between 1 and ${ue}`});return}ln(O,200,ou(ne,pe,J.activityLogsDir));return}if(I.method==="POST"&&oe.pathname==="/api/rules/choose-directory"){ln(O,200,await zi());return}if(I.method==="GET"&&oe.pathname==="/api/rules"){let ue=X(ne,Ji(J)),pe=new Map(ue.rules.map((ve)=>[ve.name,ve]));ln(O,200,{projectPath:J.cwd??process.cwd(),canPickDirectory:Vi(process.platform,process.env),rulebooks:ue.rulebooks.map((ve)=>({source:ve.source,spec:ve.spec,name:ve.name,version:ve.version,rules:ve.rules.flatMap((we)=>{let Ce=pe.get(we);if(!Ce)return[];return[{name:Ce.name,command:Ce.command,subcommand:Ce.subcommand,block_args:Ce.block_args,reason:Ce.reason}]})})),errors:ue.errors,warnings:ue.warnings});return}if(I.method==="GET"&&oe.pathname==="/api/star/context"){ln(O,200,await(J.fetchStarContext??(()=>gb(ne,{logsDir:J.activityLogsDir})))());return}if(I.method==="POST"&&oe.pathname==="/api/star"){let ue=await(J.starRepo??db)();ln(O,200,ue.ok?{ok:!0}:{ok:!1,fallbackUrl:Wv});return}if(I.method==="GET"&&oe.pathname==="/api/integrations"){ln(O,200,await(J.fetchIntegrations??(()=>ub(ne)))());return}if(I.method==="GET"&&oe.pathname==="/api/health"){ln(O,200,await(J.fetchHealth??fb)());return}if(I.method==="POST"&&(oe.pathname==="/api/install"||oe.pathname==="/api/uninstall")){let ue=await ir(I);if(!ue.ok){ln(O,ue.status,{errors:[ue.error]});return}let pe=ue.value?.target;if(typeof pe!=="string"||!$n.some((we)=>we.target===pe)){ln(O,400,{error:"unknown target"});return}let ve=oe.pathname==="/api/install"?"install":"uninstall";ln(O,200,await(J.runIntegration??mb)(ve,pe));return}ln(O,404,{error:"Not found"})}function Ji(_){return{..._,cwd:_.cwd??process.cwd()}}function hu(_,I){return _.dir??I.cwd??process.cwd()}function uu(_,I){let O=b(_),L=Vv(O)?mt(O):{value:void 0,errors:[]},J=le(L.value,I);return{projection:J.policy,diagnostics:[...L.errors,...J.diagnostics]}}async function pu(_,I,O,L,J){let K=hu(L,J),ne=L.revision,oe=await ir(I);if(!oe.ok)return ln(O,oe.status,{errors:[oe.error]}),null;let ue=oe.value;if(typeof ue?.revision!=="number")return ln(O,400,{errors:["revision must be a number"]}),null;if(ue.revision!==ne)return ln(O,409,{errors:[Yv]}),null;let pe=eb(ue.proposal,_.home);if(pe.length>0)return ln(O,400,{errors:pe}),null;return{dir:K,proposal:ue.proposal}}function eb(_,I){let O=er(_,I);if(O.length>0)return O;return _?.audit===void 0?[]:[Zv]}function nb(_,I,O){let L=b(_),J=Wr(I,C(I,O));try{return g(i(v(_,"project policy"),L),`${JSON.stringify(J,null,2)}
`),{path:L,errors:[]}}catch(K){return{path:L,errors:[K instanceof Error?K.message:String(K)]}}}function tb(_,I,O,L){let J=C(O,_.home),K=E(_,Ji(L)),ne=Te({rules:K.policy.rules,transparentWrappers:K.policy.transparentWrappers,safety:Me(J.safety),worktreeMode:J.workflow.worktree_mode,destructiveCommandProtectionEnabled:J.destructive_command_protection.enabled,destructiveCommandRuleOverrides:J.destructive_command_protection.overrides,destructiveCommandAllowPaths:J.destructive_command_protection.allow_paths,secretProtection:{enabled:J.secret_protection.enabled,disabledRules:Fe(J.secret_protection.overrides),denyPaths:J.secret_protection.deny_paths,allowPaths:J.secret_protection.allow_paths}});return Jt(I,{policySnapshot:ne,cwd:L.cwd,userConfigDir:L.userConfigDir},_)}function rb(_,I){if(_===null)return Math.min(Kv,I);let O=Number(_);if(!Number.isInteger(O)||O<1||O>I)return null;return O}function ob(_,I,O){if(I.searchParams.get("token")!==O)return!1;if(_.method!=="POST")return!0;return _.headers["x-cc-safety-net-token"]===O}var ib=1048576;async function ir(_){let I=[],O=0;for await(let L of _){let J=L;if(O+=J.byteLength,O>ib)return{ok:!1,status:413,error:"Request body is too large"};I.push(J)}try{return{ok:!0,value:JSON.parse(Buffer.concat(I).toString("utf-8")||"{}")}}catch(L){return{ok:!1,status:400,error:`Invalid JSON: ${L instanceof Error?L.message:String(L)}`}}}function sb(_,I){_.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),_.end(I)}function ln(_,I,O){_.writeHead(I,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),_.end(JSON.stringify(O))}function ab(_){return new Promise((I,O)=>{_.close((L)=>L?O(L):I())})}function lb(_){return new Promise((I)=>{let O=()=>{process.off("SIGINT",L),process.off("SIGTERM",L)},L=()=>{O(),_.close().then(I)};process.once("SIGINT",L),process.once("SIGTERM",L)})}function cb(_){let I=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",O=process.platform==="win32"?["/c","start","",_]:[_];return new Promise((L,J)=>{let K=mu(I,O,{detached:!0,stdio:"ignore"}),ne=(ue)=>{K.off("spawn",oe),J(ue)},oe=()=>{K.off("error",ne),K.unref(),L()};K.once("error",ne),K.once("spawn",oe)})}async function db(_="gh",I=Ki){return{ok:await Wi(_,["api","-X","PUT",`/user/starred/${ao}`],I)===0}}async function ub(_,I={}){let O=await hr((J)=>Rt({environment:_,cwd:process.cwd(),openCodeVersion:J}).status!=="n/a",I.fetcher),L=pb(_,O);return{targets:Pn.map((J)=>{let K=L.find((ne)=>ne.platform===J.id);return{target:J.id,label:fn(J.id),version:O.versions[J.id]??null,status:K?.configured?"active":K?.detected?"disabled":K?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:O.version,nodeVersion:O.nodeVersion,platform:O.platform}}}function pb(_,I){return Pt(_,process.cwd(),{ampPluginListOutput:I.ampPluginListOutput,codexPluginListOutput:I.codexPluginListOutput,copilotCliVersion:I.versions["copilot-cli"],openCodeVersion:I.versions.opencode,openCodePluginListOutput:I.openCodePluginListOutput})}async function fb(_={}){let I=await(_.checkUpdates??Un)();return{update:{latestVersion:I.latestVersion??null,updateAvailable:I.updateAvailable}}}var fu=Promise.resolve();function mb(_,I,O={}){let L=async()=>{let K=[],{log:ne,error:oe}=console;console.log=(...ue)=>K.push(ue.map(String).join(" ")),console.error=console.log;try{return{ok:await Qt(_,[],{selectTargets:async()=>[I],output:new Jv({write(pe,ve,we){K.push(String(pe).replace(/\n$/,"")),we()}}),...O})===0,output:K.join(`
`)}}finally{console.log=ne,console.error=oe}},J=fu.then(L);return fu=J.then(()=>{return},()=>{return}),J}async function gb(_,I={}){let[O,L,J]=await Promise.all([hb(I.command),yb(I.fetchRepo),Promise.resolve(ur(_,re(_),I.logsDir).totalBlocked)]);return{starred:O,starCount:L,blockedTotal:J}}async function hb(_="gh",I=Ki){if(await Wi(_,["auth","status"],I)!==0)return null;let O=await Wi(_,["api",`/user/starred/${ao}`],I);if(O===0)return!0;if(O===null)return null;return!1}function Wi(_,I,O){return new Promise((L)=>{let J=mu(_,I,{stdio:"ignore",windowsHide:!0}),K=!1,ne=setTimeout(()=>{J.kill(),oe(null)},O),oe=(ue)=>{if(K)return;K=!0,clearTimeout(ne),L(ue)};J.once("error",()=>oe(null)),J.once("close",oe)})}async function yb(_=fetch){try{let I=await _(`https://api.github.com/repos/${ao}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(Ki)});if(!I.ok)return null;let O=await I.json();return typeof O.stargazers_count==="number"?O.stargazers_count:null}catch{return null}}function vb(_){if(_[0]!=="help")return!1;let I=_[1];if(!I)vi(),process.exit(0);if(Wt(I))process.exit(0);console.error(`Unknown command: ${I}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var bb={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),Wt("hook",console.error),process.exit(1)},install:async(_)=>{process.exit(await Qt("install",_))},update:async(_)=>{process.exit(await Oi(_))},uninstall:async(_)=>{process.exit(await Qt("uninstall",_))},rule:async(_)=>{process.exit(await nu(c(),_))},policy:async(_)=>{process.exit(await hd(c(),_))},status:async(_)=>{if(Dn(gn({label:"status"},_).errors))process.exit(1);ru(c())},statusline:async(_)=>{let I=gn({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},_);if(I.errors.length===0&&I.flags.claudeCode){await qi(c());return}if(Dn(I.errors),!I.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");Wt("statusline",console.error),process.exit(1)},doctor:async(_)=>{let I=di(_);if(!I)process.exit(1);let O=await $l(c(),{json:I.json,skipUpdateCheck:I.skipUpdateCheck});process.exit(O)},logs:async(_)=>{process.exit(await rs(c(),_))},gui:async(_)=>{process.exit(await gu(_))},explain:async(_)=>{process.exit(await Bl(c(),_))}};async function wb(_){let I=gn({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},_);if(vb(_))return;let O=_[0],L=O?dr(O):void 0;if(I.help&&L&&L.name!=="rule")Wt(L.name),process.exit(0);if(!O||I.help&&!L)vi(),process.exit(0);if(I.flags.version)zl(),process.exit(0);if(L){await bb[L.name](_.slice(1));return}if(O==="--statusline"){await qi(c());return}console.error(O.startsWith("-")?`Unknown option: ${O}`:`Unknown command: ${O}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{wb as runCli};
