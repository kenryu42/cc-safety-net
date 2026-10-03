import{a,s,_e,We,R,tt,Be,c,n,ze,T,v,de,rt,f,qe,l,o,x,i,ie,r,g,fe,j,it,st,u,me,ge,at,D,Y,se,S,ct,U,b,Ee,G,d,Z,Ke,Je,N,w,P,he,ye,Ae,lt,m,e,Ie,ke,Ye,Ze,ae,Re,ce,Oe,X,H,De,be,W,Xe,B,Q,ee,le,Qe,et,C,z,Ne,Fe,Me,E,$e,Te,je,h,t,te,ve,y,k,A,ut,Ue,Ge,p,V}from"./chunks/index-s51wd88q.js";import{re,q,He,F,M}from"./chunks/index-yvrqg8s1.js";var Xu=["-h","--help"];function gn(I,_){let O=Object.entries(I.booleans??{}),L=Object.entries(I.values??{}),J=Object.entries(I.lists??{}),K=Object.fromEntries(O.map(([Se])=>[Se,!1])),ne={},oe=Object.fromEntries(J.map(([Se])=>[Se,[]])),ue=[],pe=[],we=!1,xe=-1;for(let[Se,Pe]of _.entries()){if(Se<=xe)continue;if(Pe==="--"){ue.push(..._.slice(Se+1));break}if(Xu.includes(Pe)){we=!0;continue}let Ce=O.find(([,Ve])=>Ve.includes(Pe));if(Ce){K[Ce[0]]=!0;continue}let en=L.find(([,Ve])=>Ve.includes(Pe));if(en){let Ve=_[Se+1];if(Ve===void 0||Ve.startsWith("-")){pe.push(`${Pe} requires a value`);continue}ne[en[0]]=Ve,xe=Se+1;continue}let Le=J.find(([,Ve])=>Ve.includes(Pe));if(Le){let Ve=_.slice(Se+1),on=Ve.findIndex((an)=>an.startsWith("-")),sn=Ve.slice(0,on===-1?Ve.length:on);if(sn.length===0){pe.push(`${Pe} requires at least one value`);continue}oe[Le[0]]=[...oe[Le[0]]??[],...sn],xe=Se+sn.length;continue}if(Pe.startsWith("-")){pe.push(`Unknown option for ${I.label}: ${Pe}`);continue}if(I.positionals==="tail"){ue.push(..._.slice(Se));break}ue.push(Pe)}if(I.positionals!=="list"&&I.positionals!=="tail")pe.push(...ue.map((Se)=>`Unexpected argument for ${I.label}: ${Se}`));return{flags:K,values:ne,lists:oe,positionals:ue,help:we,errors:pe}}function Dn(I){for(let _ of I)console.error(_);return I.length>0}import{readdirSync as ip,statSync as ys,unlinkSync as sp}from"node:fs";import{basename as vs,dirname as ap,isAbsolute as lp,join as cp,relative as dp,resolve as up,sep as pp}from"node:path";var ms=(I)=>{let _=Date.now()-new Date(I).getTime();if(!Number.isFinite(_))return"";let O=Math.floor(_/60000),L=Math.floor(O/60),J=Math.floor(L/24);if(J>0)return`${J}d ago`;if(L>0)return`${L}h ago`;if(O>0)return`${O}m ago`;return"just now"},wo=(I)=>{let _=(I??"").trim().split(/\s+/).filter((J)=>J&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(J)),O=_[0]?.split("/").pop();if(!O)return null;let L=_[1];return L&&/^[a-z][a-z0-9-]*$/.test(L)?`${O} ${L}`:O};function gs(I){let _=(J)=>`${J.sessionId}
${wo(J.segment||J.command)}`,O=I.filter((J)=>J.decision!=="allow"),L=O.filter((J)=>J.sessionId).reduce((J,K)=>J.set(_(K),(J.get(_(K))??0)+1),new Map);return new Set(O.filter((J)=>J.failureStage||(L.get(_(J))??0)>=2))}import{existsSync as Qu,readdirSync as ep,readFileSync as np}from"node:fs";import{join as tp}from"node:path";function zn(I,_){try{return ep(I,{withFileTypes:!0,encoding:"utf8"}).flatMap((O)=>{let L=tp(I,O.name);if(O.isDirectory())return zn(L,_);if(O.name.endsWith(".jsonl"))return[L];return[]})}catch{if(_&&Qu(I))_.count++;return[]}}var rp=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function op(I){if(!I||typeof I!=="object"||Array.isArray(I))return!1;let _=I;if(typeof _.ts!=="string"||typeof _.command!=="string")return!1;return rp.every((O)=>_[O]===void 0||typeof _[O]==="string")}function wt(I,_){try{return np(I,"utf-8").split(`
`).filter(Boolean).flatMap((O)=>{try{let L=JSON.parse(O);if(!op(L)){if(_)_.count++;return[]}return[L]}catch{if(_)_.count++;return[]}})}catch{if(_)_.count++;return[]}}function hn(I){return Array.from(I,(_)=>{let O=_.charCodeAt(0);if(O<=31||O>=127&&O<=159)return`\\x${O.toString(16).padStart(2,"0")}`;return _}).join("")}function fp(I,_){let O=re(I),L=gn({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},_);if(Dn(L.errors))return null;if(L.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(L.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let J=L.values.limit===void 0?20:hs(L.values.limit);if(J===null)return console.error("--limit must be a positive number"),null;let K=L.values.since===void 0?Math.min(30,O):hs(L.values.since);if(K===null||K>O)return console.error(`--since must be a positive number of days no greater than ${O}`),null;let ne={limit:J,limitExplicit:L.values.limit!==void 0,since:K,sinceExplicit:L.values.since!==void 0,all:L.flags.all,json:L.flags.json,suspect:L.flags.suspect,pruneLegacy:L.flags.pruneLegacy,dryRun:L.flags.dryRun,id:L.values.id,agent:L.values.agent,rule:L.values.rule,session:L.values.session,project:L.values.project===void 0?void 0:up(L.values.project)};if(ne.id&&(ne.agent!==void 0||ne.rule!==void 0||ne.session!==void 0||ne.project!==void 0||ne.suspect||ne.sinceExplicit||ne.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(ne.pruneLegacy&&(ne.id!==void 0||ne.agent!==void 0||ne.rule!==void 0||ne.session!==void 0||ne.project!==void 0||ne.suspect||ne.all||ne.sinceExplicit||ne.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(ne.dryRun&&!ne.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return ne}async function bs(I,_,O={}){let L=fp(I,_);if(!L)return 1;let J=O.logsDir??F(I);if(L.pruneLegacy)return mp(J,L.json,L.dryRun);if(!J)return console.log(L.json?"[]":L.id?`No retained audit log entry found for id ${hn(L.id)}.`:"No audit log entries found."),0;q(I,J);let K={count:0},ne=zn(J,K).flatMap((xe)=>wt(xe,K).map((Se)=>({entry:Se,file:xe})));if(K.count>0)console.error(`warning: ${K.count} audit log ${K.count===1?"source":"sources"} could not be read; these results are incomplete`);if(L.id)return vp(ne,L,O.timeZone);let oe=Date.now()-L.since*24*60*60*1000,ue=ne.filter((xe)=>bp(xe,L,J,oe)),pe=L.suspect?gs(ue.map((xe)=>xe.entry)):null,we=(pe?ue.filter((xe)=>pe.has(xe.entry)):ue).sort((xe,Se)=>Date.parse(Se.entry.ts)-Date.parse(xe.entry.ts)).slice(0,L.limit);if(L.json)return console.log(JSON.stringify(we.map((xe)=>xe.entry),null,2)),0;if(we.length===0)return console.log("No audit log entries found."),0;for(let xe of we)console.log(xp(xe.entry,O.timeZone));return 0}function mp(I,_,O){let L=I?hp(I).map((oe)=>cp(I,oe)):[];if(O)return gp(L,_);let J=[],K=0,ne=0;for(let oe of L){let ue=ys(oe,{throwIfNoEntry:!1})?.size??0,pe=yp(oe);if(pe){J.push(`${vs(oe)}: ${pe}`);continue}K++,ne+=ue}if(_)return console.log(JSON.stringify({removedFiles:K,removedBytes:ne,failedFiles:J.length})),J.length===0?0:1;console.log(K===0&&J.length===0?"No legacy audit log files found.":`Removed ${K} legacy audit log ${K===1?"file":"files"} (${ws(ne)}).`);for(let oe of J)console.error(`Could not remove ${hn(oe)}`);if(console.log("Nested v2 audit logs were not changed."),K>0)console.log("This deletion cannot be undone.");return J.length===0?0:1}function gp(I,_){let O=I.reduce((L,J)=>L+(ys(J,{throwIfNoEntry:!1})?.size??0),0);if(_)return console.log(JSON.stringify({dryRun:!0,files:I.length,bytes:O})),0;if(console.log(I.length===0?"No legacy audit log files found.":`Would remove ${I.length} legacy audit log ${I.length===1?"file":"files"} (${ws(O)}).`),console.log("Nested v2 audit logs are not included."),I.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function hp(I){try{return ip(I,{withFileTypes:!0}).filter((_)=>_.isFile()&&_.name.endsWith(".jsonl")).map((_)=>_.name)}catch{return[]}}function yp(I){try{return sp(I),null}catch(_){return _ instanceof Error?_.message:String(_)}}function ws(I){let _=["B","KiB","MiB","GiB"],O=Math.min(Math.floor(Math.log2(Math.max(I,1))/10),_.length-1);return`${Math.round(I/1024**O*10)/10} ${_[O]}`}function vp(I,_,O){let L=I.filter((K)=>K.entry.id===_.id);if(L.length>1)return console.error(`Multiple audit log entries found for id ${hn(_.id??"")}.`),1;if(_.json)return console.log(JSON.stringify(L.map((K)=>K.entry),null,2)),0;let J=L[0];if(!J)return console.log(`No retained audit log entry found for id ${hn(_.id??"")}.`),0;return console.log(Cp(J.entry,O)),0}function bp(I,_,O,L){if(!_.all&&I.entry.decision==="allow")return!1;if(Date.parse(I.entry.ts)<L)return!1;if(_.agent!==void 0&&I.entry.agent!==_.agent)return!1;if(_.rule!==void 0&&I.entry.ruleId!==_.rule)return!1;if(_.session!==void 0&&!wp(I,O,_.session))return!1;if(_.project!==void 0&&!kp(I.entry.cwd,_.project))return!1;return!0}function wp(I,_,O){if(I.entry.sessionId===O)return!0;return ap(I.file)===_&&vs(I.file,".jsonl")===O}function kp(I,_){if(!I)return!1;let O=dp(_,I);return O!==".."&&!O.startsWith(`..${pp}`)&&!lp(O)}function xp(I,_){let O=hn(I.id??"-"),L=hn(I.decision??"deny"),J=I.cwd?`  [${hn(I.cwd)}]`:"",K=I.segment||I.command,ne=K===I.command?"":"↳ ",oe=K.length>50?`${K.slice(0,50)}…`:K;return`${O.padEnd(16)}  ${hn(ks(I.ts,_))}  ${L.padEnd(5)}  ${hn(I.agent??"-").padEnd(15)}  ${hn(I.ruleId??"-").padEnd(20)}  ${ne}${hn(oe)}${J}`}function Cp(I,_){let O=(J)=>hn(J===void 0||J===null||J===""?"-":J),L=I.shape?`${I.agent??"-"} (shape: ${I.shape})`:I.agent??"-";return[`id:        ${O(I.id)}`,`ts:        ${O(ks(I.ts,_))}`,`decision:  ${O(I.decision)}`,`agent:     ${O(L)}`,`level:     ${O(I.level)}`,`tool:      ${O(I.toolName)}`,`rule:      ${O(I.ruleId)}`,`intent:    ${O(I.intent)}`,`stage:     ${O(I.failureStage)}`,`error:     ${O(I.errorCode)}`,`session:   ${O(I.sessionId)}`,`cwd:       ${O(I.cwd)}`,`version:   ${O(I.v)}`,`truncated: ${O(I.truncated===!0?"yes":void 0)}`,`reason:    ${O(I.reason)}`,`command:   ${O(I.command)}`,`segment:   ${O(I.segment)}`].join(`
`)}function ks(I,_){let O=new Date(I);if(Number.isNaN(O.getTime()))return I;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:_}).format(O)}function hs(I){let _=Number(I);return Number.isFinite(_)&&_>0?_:null}var xs={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var Cs={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var Ss={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var ko=["npx","--offline","--no-install","@deepseek-ai/dsh","--version"],ur=[{id:"antigravity-cli",displayName:"Antigravity CLI",doctorOrder:3,runtime:{order:1,flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:2,flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",doctorOrder:1,runtime:{order:2,displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{order:3,flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",doctorOrder:4,runtime:{order:3,flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{order:4,flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",doctorOrder:10,runtime:{order:8,flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{order:10,flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",doctorOrder:9,runtime:{order:7,flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{order:9,flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",doctorOrder:11,runtime:{order:9,flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{order:11,flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",doctorOrder:12,runtime:{order:10,flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{order:12,flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",doctorOrder:13,runtime:{order:11,flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{order:13,flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",doctorOrder:14,install:{order:14,flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",doctorOrder:15,install:{order:15,flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",doctorOrder:16,install:{order:16,flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",doctorOrder:5,runtime:{order:4,flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{order:5,flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"deepseek-harness",displayName:"DeepSeek Harness",doctorOrder:6,install:{order:6,flag:"--deepseek-harness",artifactKind:"package",probeCommand:ko}},{id:"devin",displayName:"Devin CLI",doctorOrder:7,runtime:{order:5,flags:["-dv","--devin"],description:"Run as Devin CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:7,flag:"--devin",artifactKind:"hook config",probeCommand:["devin","--version"]}},{id:"droid",displayName:"Factory Droid",doctorOrder:8,runtime:{order:6,flags:["-fd","--droid"],description:"Run as Factory Droid PreToolUse hook",legacyTopLevelFlags:[]},install:{order:8,flag:"--droid",artifactKind:"hook config",probeCommand:["droid","--version"]}},{id:"amp",displayName:"Amp Code",doctorOrder:2,install:{order:1,flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],pr=ur.slice().sort((I,_)=>I.doctorOrder-_.doctorOrder).map((I)=>I.id),Ft=ur.filter((I)=>("runtime"in I)).slice().sort((I,_)=>I.runtime.order-_.runtime.order).map((I)=>({id:I.id,displayName:"displayName"in I.runtime?I.runtime.displayName:I.displayName,flags:I.runtime.flags,legacyFlags:"legacyFlags"in I.runtime?I.runtime.legacyFlags:[],description:I.runtime.description,legacyTopLevelFlags:I.runtime.legacyTopLevelFlags})),En=ur.slice().sort((I,_)=>I.install.order-_.install.order).map((I)=>({id:I.id,...I.install})).map(({order:I,..._})=>_),Sp=Object.fromEntries(ur.map((I)=>[I.id,I.displayName]));function mn(I){return Sp[I]}var Rp=Ft.map((I)=>({flags:I.flags.join(", "),description:I.description})),Pp=Ft.flatMap((I)=>I.flags.map((_)=>`cc-safety-net hook ${_}`)),Rs={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Rp,{flags:"-h, --help",description:"Show this help"}],examples:Pp};var Ps={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...En.map((I)=>({flags:I.flag,description:`Install ${mn(I.id)} ${I.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...En.map((I)=>`cc-safety-net install ${I.flag}`)]},Es={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...En.map((I)=>({flags:I.flag,description:`Uninstall ${mn(I.id)} ${I.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...En.map((I)=>`cc-safety-net uninstall ${I.flag}`)]},As={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var Is={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var fr={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var xo=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],Co=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],kt={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},...xo.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk",...Co,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var _s={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var Ts={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var mr=[_s,xs,Is,Cs,kt,fr,Ps,As,Es,Rs,Ss,Ts];function Ep(I){return I.aliases??[]}function gr(I){let _=I.toLowerCase();return mr.find((O)=>O.name.toLowerCase()===_||Ep(O).some((L)=>L.toLowerCase()===_))}import{existsSync as ah}from"node:fs";import{basename as Ap}from"node:path";function hr(I,_=7,O=F(I)){let L=Date.now()-_*24*60*60*1000,J=[],K=new Set,ne=0,oe,ue,pe,we;if(O)q(I,O);let xe={count:0},Se=O?zn(O,xe):[];for(let Ce of Se)for(let en of wt(Ce,xe)){if(en.decision==="allow")continue;let Le=new Date(en.ts).getTime();if(Le>=L){if(ne++,K.add(en.sessionId??Ap(Ce,".jsonl")),ue===void 0||Le<=ue)oe=en.ts,ue=Le;if(we===void 0||Le>we)pe=en.ts,we=Le;Ip(J,en,Le)}}let Pe=J.map((Ce)=>({timestamp:Ce.ts,command:Ce.command,reason:Ce.reason,relativeTime:ms(new Date(Ce.ts))}));return{totalBlocked:ne,sessionCount:K.size,recentEntries:Pe,oldestEntry:oe,newestEntry:pe,unreadable:xe.count}}function Ip(I,_,O){let L=I.findIndex((J)=>O>new Date(J.ts).getTime());if(L===-1){if(I.length<3)I.push(_);return}if(I.splice(L,0,_),I.length>3)I.pop()}import{dirname as Up}from"node:path";import{dirname as _p,join as Tp,resolve as $p}from"node:path";var Op="config.json";function wn(I,_,O,L){g(Dp(I),`${JSON.stringify(_,null,2)}
`,O,L)}function Dp(I){return typeof I==="string"?ie(I):I}function Ro(I){return{errors:ae(Np(I),": "," "),ruleNames:new Set(Oe(I).map((_)=>_.toLowerCase()))}}var Lp="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",$s="must match pattern (letters, numbers, hyphens, underscores)";function Np(I){if(!Os(I))return[e([],"Config must be an object")];return[...I.version===1?[]:[e(["version"],"must be 1")],...jp(I.rules)]}function jp(I){if(I===void 0)return[];if(!Array.isArray(I))return[e(["rules"],"must be an array")];return[...I.flatMap((_,O)=>Os(_)?Fp(_,["rules",O]):[e(["rules",O],"must be an object")]),...Ie(I)]}function Fp(I,_){return[...So(I.name,[..._,"name"],"required string",u,Lp),...So(I.command,[..._,"command"],"required string",w,$s),...I.subcommand===void 0?[]:So(I.subcommand,[..._,"subcommand"],"must be a string if provided",w,$s),...Hp(I.block_args,[..._,"block_args"]),...Mp(I.reason,[..._,"reason"]),...I.intent===void 0||Re(I.intent)?[]:[e([..._,"intent"],ke)]]}function So(I,_,O,L,J){if(typeof I!=="string")return[e(_,O)];return L.test(I)?[]:[e(_,J)]}function Hp(I,_){if(!Array.isArray(I))return[e(_,"required array")];if(I.length===0)return[e(_,"must have at least one element")];return I.flatMap((O,L)=>{if(typeof O!=="string")return[e([..._,L],"must be a string")];return O===""?[e([..._,L],"must not be empty")]:[]})}function Mp(I,_){if(typeof I!=="string")return[e(_,"required string")];if(I==="")return[e(_,"must not be empty")];return I.length>P?[e(_,`must be at most ${P} characters`)]:[]}function Os(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}function Po(I){let _=Ds(I);if(!_.ok)return _.result;return Ro(_.parsed)}function Ds(I){let _=[],O=new Set;try{let L=typeof I==="string"?ie(I):I,J=r(L);if(J===null)return _.push(`File not found: ${L.path}`),{ok:!1,result:{errors:_,ruleNames:O}};if(!J.trim())return _.push("Config file is empty"),{ok:!1,result:{errors:_,ruleNames:O}};return{ok:!0,parsed:JSON.parse(J)}}catch(L){if(L instanceof o)return _.push(L.message),{ok:!1,result:{errors:_,ruleNames:O}};let J=L instanceof Error?L.message:String(L);return _.push(L instanceof SyntaxError?"Invalid JSON":J),{ok:!1,result:{errors:_,ruleNames:O}}}}function yr(I){return $p(I,".safety-net.json")}function Un(I){let _=Ds(I);if(!_.ok)return _.result;let O=Ye(_.parsed);return{errors:O.errors,ruleNames:O.sources}}function xt(I,_={}){return Tp(_p(Ee(I,_)),Op)}function Ls(I,_,O){let L;try{if(r(_)===null)return{path:I,exists:!1,valid:!1,ruleCount:0};L=Un(_),L.errors.push(...H(I,O))}catch(J){if(!(J instanceof o))throw J;L={errors:[J.message],ruleNames:new Set}}return{path:I,exists:!0,valid:L.errors.length===0,ruleCount:L.ruleNames.size,...L.errors.length>0?{errors:L.errors}:{}}}function Gp(I,_){return{source:_,name:I.name,command:I.command,subcommand:I.subcommand,blockArgs:[...I.block_args],reason:I.reason}}function Ns(I,_){let O=G(I),L=U(_),J=Up(O),K=X(I,{cwd:_,userConfigPath:O,projectConfigPath:L,userConfigDir:J}),ne=Z(I,{cwd:_,userConfigPath:O,projectConfigPath:L,userConfigDir:J}),oe=new Map(K.rulebooks.flatMap((ue)=>ue.rules.map((pe)=>[pe,ue.source])));return{userConfig:Ls(O,ne.userConfigTarget,ne.userScope),projectConfig:Ls(L,ne.projectConfigTarget,ne.projectScope),effectiveRules:K.rules.map((ue)=>Gp(ue,oe.get(ue.name)??"project"))}}var Bp=[{flag:n.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:n.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:n.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:n.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:n.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:n.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:n.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:n.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"},{flag:n.projectTightenOnly,description:"Ignore project policy settings that weaken the user policy",defaultBehavior:"off"}];function js(I){return[...Bp.map((_)=>({name:_.flag.name,value:de(_.flag,I.env),isSet:rt(_.flag,I.env),legacyName:_.flag.legacyName,legacyValue:_.flag.legacyName?I.env.get(_.flag.legacyName):void 0,legacyIsSet:_.flag.legacyName?I.env.get(_.flag.legacyName)!==void 0:void 0,description:_.description,defaultBehavior:_.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:I.env.get("CC_SAFETY_NET_HOME"),isSet:I.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var Fs={error:0,warning:1,info:2},qp=["policy","config","audit"];function Vp(I){return I.map((_)=>{if(_==="ownership")return"is not owned by the current user";if(_==="permissions")return"has unsafe permissions";if(_==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var Jp=[{derive:(I)=>I.hooks.length>0&&I.hooks.every((_)=>!_.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(I)=>I.hooks.filter((_)=>_.inspectionStatus==="failed").map((_)=>{let O=mn(_.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${O} inspection failed`,detail:`Doctor could not verify the ${O} integration configuration.`,fixHint:`Correct the reported ${O} configuration error, then run \`cc-safety-net doctor\` again.`,integration:_.platform}})},{derive:(I)=>I.userConfig.exists&&!I.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:I.userConfig.path}]:[]},{derive:(I)=>I.projectConfig.exists&&!I.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:I.projectConfig.path}]:[]},{derive:(I)=>I.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${I.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(I)=>I.v2Leftovers&&I.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${I.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(I)=>I.legacyConfigs&&I.legacyConfigs.length>0?[{checkId:"config.legacy-ignored",severity:"warning",title:"Legacy inline rule configs are ignored",detail:`CC Safety Net no longer loads these files, so their rules enforce nothing: ${I.legacyConfigs.join(", ")}.`,fixHint:"Run `cc-safety-net rule migrate` to convert them (add `--cleanup` to delete each file once it is converted), then rerun doctor."}]:[]},{derive:(I)=>{let _=I.environment.find((O)=>O.name==="CC_SAFETY_NET_AUDIT_SCOPE");return ze(_?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...qp.map((I)=>({derive:(_)=>_.posture.directories.filter((O)=>O.kind===I&&O.status==="unsafe").map((O)=>({checkId:`posture.${I}-directory-unsafe`,severity:"error",title:`${I[0]?.toUpperCase()}${I.slice(1)} directory is unsafe`,detail:`The ${I} directory ${Vp(O.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...O.path?{path:O.path}:{}}))})),{derive:(I)=>{let _=[...I.effectiveSafety.weakenedRuleOverrides].sort();return _.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${_.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${_.join(", ")}.`}]:[]}}];function Hs(I){return Jp.flatMap((_,O)=>_.derive(I).map((L,J)=>({finding:L,catalogOrder:O,occurrence:J}))).sort((_,O)=>Fs[_.finding.severity]-Fs[O.finding.severity]||_.catalogOrder-O.catalogOrder||_.occurrence-O.occurrence).map((_)=>_.finding)}function Ln(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var zp=(I)=>Ln()?`\x1B[32m${I}\x1B[0m`:I,Kp=(I)=>Ln()?`\x1B[33m${I}\x1B[0m`:I,Wp=(I)=>Ln()?`\x1B[34m${I}\x1B[0m`:I,Yp=(I)=>Ln()?`\x1B[36m${I}\x1B[0m`:I,Zp=(I)=>Ln()?`\x1B[31m${I}\x1B[0m`:I,Xp=(I)=>Ln()?`\x1B[2m${I}\x1B[0m`:I,Qp=(I)=>Ln()?`\x1B[1m${I}\x1B[0m`:I,nn={green:zp,yellow:Kp,blue:Wp,cyan:Yp,red:Zp,dim:Xp,bold:Qp},ef="\x1B[0m",nf=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function tf(I){let _=I;return()=>(_=(_*1664525+1013904223)%4294967296,_/4294967296)}function rf(I){let _=[...nf],O=tf(I);for(let L=_.length-1;L>0;L--){let J=Math.floor(O()*(L+1)),K=_[L];_[L]=_[J],_[J]=K}return _}function of(I,_=0){if(!Ln())return"";let O=rf(_);return`\x1B[38;5;${O[I%O.length]}m`}function Ms(I,_,O=0){if(!Ln())return`"${I}"`;return`${of(_,O)}"${I}"${ef}`}function vr(I){return I==="default"?"built-in default":`${I} policy`}var sf=new RegExp("\x1B\\[[0-9;]*m","g"),Eo=(I)=>I.replace(sf,"").length;function Kn(I){let _=(I.headers??I.rows[0]??[]).map((ne,oe)=>{let ue=Math.max(...I.rows.map((pe)=>Eo(pe[oe]??"")));return Math.max(Eo(ne),ue)}),O=(ne,oe)=>ne+" ".repeat(Math.max(0,oe-Eo(ne))),L=(ne,oe)=>oe[0]+_.map((ue)=>ne.repeat(ue+2)).join(oe[1])+oe[2],J=(ne)=>`│ ${ne.map((oe,ue)=>O(oe,_[ue]??0)).join(" │ ")} │`,K=I.headers?[`   ${J(I.headers)}`,`   ${L("─",["├","┼","┤"])}`]:[];return[`   ${L("─",["┌","┬","┐"])}`,...K,...I.rows.map((ne)=>`   ${J(ne)}`),`   ${L("─",["└","┴","┘"])}`].join(`
`)}function Us(I){let _=[];_.push("Hook Integration"),_.push(af(I));let O=[],L=[];for(let J of I){let K=mn(J.platform);if(J.errors&&J.errors.length>0)for(let ne of J.errors)if(J.configured)O.push({platform:K,message:ne});else L.push({platform:K,message:ne})}for(let J of O)_.push(`   Warning (${J.platform}): ${J.message}`);for(let J of L)_.push(nn.red(`   Error (${J.platform}): ${J.message}`));return _.join(`
`)}function af(I){let _=["Platform","Discovery","Configuration","Inspection"],O=I.map((L)=>{let J=mn(L.platform);if(L.inspectionStatus==="not-inspected"){let ue=nn.dim("Not inspected");return[J,ue,ue,ue]}let K=L.detected?nn.green("Detected"):L.inspectionStatus==="failed"?nn.red("Unknown"):nn.dim("Not detected"),ne=L.configured?nn.green("Configured"):L.detected?nn.yellow("Not configured"):L.inspectionStatus==="failed"?nn.red("Unknown"):nn.dim("Not applicable"),oe=L.inspectionStatus==="verified"?nn.green("Verified"):L.inspectionStatus==="failed"?nn.red("Failed"):nn.dim("Not applicable");return[J,K,ne,oe]});return Kn({headers:_,rows:O})}function Gs(I){let O=["Guard Engine Verification",`   Synthetic self-test: ${I.failed>0?nn.red(`${I.passed}/${I.total} FAIL`):nn.green(`${I.passed}/${I.total} passed`)}`],L=I.results.filter((J)=>!J.passed);if(L.length>0){O.push(""),O.push(nn.red("   Failures:"));for(let J of L)O.push(nn.red(`   • ${J.description}`)),O.push(nn.red(`     expected ${J.expected}, got ${J.actual}`))}return O.join(`
`)}function lf(I){if(I.length===0)return"   (no custom rules)";let _=["Source","Name","Command","Block Args"],O=I.map((L)=>[L.source,L.name,L.subcommand?`${L.command} ${L.subcommand}`:L.command,L.blockArgs.join(", ")]);return Kn({headers:_,rows:O})}function Bs(I){let _=[];if(_.push("Configuration"),_.push(cf(I.userConfig,I.projectConfig)),_.push(""),I.effectiveRules.length>0)_.push(`   Effective rules (${I.effectiveRules.length} total):`),_.push(lf(I.effectiveRules));else _.push("   Effective rules: (none - using built-in rules only)");return _.join(`
`)}function cf(I,_){let O=["Scope","Status"],L=(K)=>{if(!K.exists)return nn.dim("N/A");if(!K.valid)return nn.red(`Invalid (${K.errors?.[0]??"unknown error"})`);return nn.green("Configured")},J=[["User",L(I)],["Project",L(_)]];return Kn({headers:O,rows:J})}function qs(I){let _=[];return _.push("Environment"),_.push(df(I)),_.join(`
`)}function Vs(I){let _=I.effectiveSafety.policyScopes,O=["Effective Safety",`   Selected preset: ${I.effectiveSafety.selectedPreset}${_?` (${vr(_.levelScope)})`:""}`,`   Effective: ${I.effectiveSafety.level}`],L=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[J,K]of L){let ne=I.effectiveSafety.capabilities[J],oe=ne.enabled?nn.green("ON"):nn.dim("OFF"),ue=ne.sources.length>0?` (${ne.sources.join(", ")})`:"";O.push(`   ${K}: ${oe} via ${ne.source}${ue}`)}if(_&&_.weakenings.length>0){O.push(`   Project policy deltas${_.weakeningsIgnored?" (ignored)":""}:`);for(let J of _.weakenings)O.push(`      ${J}`)}O.push(`   Stored rule customizations: ${I.effectiveSafety.ruleCounts.stored}`),O.push(`   Effective rule customizations: ${I.effectiveSafety.ruleCounts.effective}`);for(let[J,K]of Object.entries(I.effectiveSafety.ruleOverrides))O.push(`   ${J}: ${K}`);return O.join(`
`)}function Js(I){let _=["Findings"];if(I.length===0)return _.push("   No findings from inspected doctor facts."),_.join(`
`);for(let O of I){let L=`[${O.severity.toUpperCase()}] ${O.checkId}: ${hn(O.title)}`,J=O.severity==="error"?nn.red:O.severity==="warning"?nn.yellow:nn.blue;if(_.push(`   ${J(L)}`),_.push(`      ${hn(O.detail)}`),O.path)_.push(`      Path: ${hn(O.path)}`);if(O.fixHint)_.push(`      Fix: ${hn(O.fixHint)}`)}return _.join(`
`)}function df(I){let _=["Variable","Status","Legacy"],O=I.map((L)=>{let J=L.isSet?nn.green("✓"):nn.dim("✗"),K=L.legacyName&&L.legacyIsSet?`${L.legacyName} ${nn.green("✓")}`:L.legacyName??"";return[L.name,J,K]});return Kn({headers:_,rows:O})}function zs(I){let _=[];if(I.totalBlocked===0)_.push("Recent Activity"),_.push("   No blocked commands in the last 7 days"),_.push("   Tip: This is normal for new installations");else _.push(`Recent Activity · last 7 days (${I.totalBlocked} blocked / ${I.sessionCount} sessions)`),_.push(uf(I.recentEntries));if(I.unreadable>0)_.push(`   Warning: ${I.unreadable} audit log ${I.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return _.join(`
`)}function uf(I){let _=["Time","Command"],O=I.map((L)=>{let J=hn(L.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),K=J.length>40?`${J.slice(0,37)}...`:J;return[L.relativeTime,K]});return Kn({headers:_,rows:O})}function Ks(I){let _=[];if(_.push("Update Check"),I.latestVersion===null&&!I.error)return _.push(br([["Status",nn.dim("Skipped")],["Installed",I.currentVersion]])),_.join(`
`);if(I.error)return _.push(br([["Status",`${nn.yellow("⚠")} Error`],["Installed",I.currentVersion],["Error",nn.dim(I.error)]])),_.join(`
`);if(I.updateAvailable)return _.push(br([["Status",`${nn.yellow("⚠")} Update Available`],["Current",I.currentVersion],["Latest",nn.green(I.latestVersion??"")]])),_.push(""),_.push("   Run: bunx cc-safety-net@latest doctor"),_.push("   Or:  npx cc-safety-net@latest doctor"),_.join(`
`);return _.push(br([["Status",`${nn.green("✓")} Up to date`],["Version",I.currentVersion]])),_.join(`
`)}function br(I){return Kn({rows:I})}function Ws(I){let _=[];return _.push("System Info"),_.push(pf(I)),_.join(`
`)}function pf(I){let _=["Component","Version"],O=(K)=>{if(K===null)return nn.dim("not found");return K},J=[{label:"cc-safety-net",value:I.version},...pr.map((K)=>({label:mn(K),value:I.versions[K]??null})),{label:"Node.js",value:I.nodeVersion},{label:"npm",value:I.npmVersion},{label:"Bun",value:I.bunVersion},{label:"Platform",value:I.platform}].map((K)=>[K.label,O(K.value)]);return Kn({headers:_,rows:J})}function Ys(I){if(I.findings.length===0)return nn.green(`
No findings from inspected doctor facts.`);let _={error:I.findings.filter((K)=>K.severity==="error").length,warning:I.findings.filter((K)=>K.severity==="warning").length,info:I.findings.filter((K)=>K.severity==="info").length},O=["error","warning","info"].filter((K)=>_[K]>0).map((K)=>`${_[K]} ${K}`),L=I.findings.length===1?"finding":"findings",J=`
${I.findings.length} ${L}: ${O.join(", ")}.`;if(_.error>0)return nn.red(J);if(_.warning>0)return nn.yellow(J);return nn.blue(J)}import{lstatSync as ff}from"node:fs";import{dirname as Ao}from"node:path";function Io(I,_){try{let O=ff(_);if(O.isSymbolicLink())return{kind:I,path:_,status:"unsafe",issues:["symlink"]};if(!O.isDirectory())return{kind:I,path:_,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:I,path:_,status:"unknown",issues:[]};let L=[...O.uid!==process.getuid()?["ownership"]:[],...(O.mode&18)!==0?["permissions"]:[]];return{kind:I,path:_,status:L.length>0?"unsafe":"safe",issues:L}}catch(O){if(typeof O==="object"&&O!==null&&"code"in O&&O.code==="ENOENT")return{kind:I,path:_,status:"not-applicable",issues:[]};return{kind:I,path:_,status:"unknown",issues:[]}}}function Zs(I,_){let O=F(I);return{directories:[Io("policy",Ao(Ao(_))),Io("config",Ao(_)),...O?[Io("audit",O)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as mf}from"node:child_process";import{existsSync as Xs}from"node:fs";import{delimiter as gf,extname as hf,join as yf}from"node:path";import{stripVTControlCharacters as Qs}from"node:util";var na="2.5.2",vf=5000,bf="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function pn(){return na}function _o(I,_){let O=I[_];if(O)return O;let L=Object.keys(I).find((J)=>J.toLowerCase()===_.toLowerCase()&&!!I[J]);return L?I[L]:O}function wf(I){return(_o(I,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((_)=>_.length>0)}function kf(I,_){let O=hf(I)?[I]:[...wf(_).map((L)=>`${I}${L}`),I];if(I.includes("/")||I.includes("\\"))return O.find((L)=>Xs(L))??I;return(_o(_,"PATH")??"").split(gf).flatMap((L)=>O.map((J)=>yf(L,J))).find((L)=>Xs(L))??I}function ea(I){if(!/[\s"&|<>^]/.test(I))return I;return`"${I.replace(/"/g,'""')}"`}function Wn(I,_){let[O,...L]=I,J=_[bf]==="win32"?"win32":process.platform;if(!O||J!=="win32")return{cmd:O??"",args:L};let K=kf(O,_);if(!/\.(?:bat|cmd)$/i.test(K))return{cmd:K,args:L};return{cmd:_o(_,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",ea(K),...L.map(ea)].join(" ")]}}var Ct=async(I,_=vf)=>{let O=await xf(I,{timeoutMs:_});if(O.code!==0)return null;return Qs(O.stdout).trim()||Qs(O.stderr).trim()||null};function xf(I,_){let[O,...L]=I;if(!O)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((J)=>{try{let K=Wn([O,...L],process.env),ne=mf(K.cmd,K.args,{stdio:["ignore","pipe","pipe"]}),oe=!1,ue="",pe="";ne.stdout.on("data",(Se)=>{ue+=Se.toString()}),ne.stderr.on("data",(Se)=>{pe+=Se.toString()});let we=(Se)=>{if(oe)return;oe=!0,clearTimeout(xe),J(Se)},xe=setTimeout(()=>{ne.kill(),we({code:null,stdout:ue,stderr:pe})},_.timeoutMs);ne.on("close",(Se)=>{we({code:Se,stdout:ue,stderr:pe})}),ne.on("error",()=>{we({code:null,stdout:ue,stderr:pe})})}catch{J({code:null,stdout:"",stderr:""})}})}function wr(I){if(!I)return null;let _=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(I);if(_)return _[1]??null;let O=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(I);if(O)return O[1]??null;return I.split(`
`)[0]?.trim()||null}async function kr(I,_=Ct,O=process.cwd()){let L=Promise.all(En.map(async(xe)=>[xe.id,wr(await _([...xe.probeCommand]))])),[J,K,ne,oe,ue,pe,we]=await Promise.all([L,L.then(async(xe)=>{let Se=xe.find(([en])=>en==="opencode")?.[1];if(!Se?.startsWith("2.")||!I(Se))return null;let Pe=["--param",`location[directory]=${O}`],Ce=["opencode","api","integration.list",...Pe];return await _(Ce,30000),_(["opencode","api","plugin.list",...Pe],30000)}),_(["codex","plugin","list"],30000),_(["amp","plugins","list"],30000),_(["node","--version"]),_(["npm","--version"]),_(["bun","--version"])]);return{version:na,versions:Object.fromEntries(J),codexPluginListOutput:ne,ampPluginListOutput:oe,openCodePluginListOutput:K,nodeVersion:wr(ue),npmVersion:wr(pe),bunVersion:wr(we),platform:`${process.platform} ${process.arch}`}}function To(I,_){if(_==="dev")return!1;let O=I.split(".").map(Number),L=_.split(".").map(Number),[J=0,K=0,ne=0]=O,[oe=0,ue=0,pe=0]=L;if(J!==oe)return J>oe;if(K!==ue)return K>ue;return ne>pe}async function Gn(){let I=pn(),_=new AbortController,O=setTimeout(()=>_.abort(),3000);try{let L=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:_.signal});if(!L.ok)return{currentVersion:I,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${L.status}`};let J=await L.json(),K=To(J.version,I);return{currentVersion:I,latestVersion:J.version,updateAvailable:K}}catch(L){return{currentVersion:I,latestVersion:null,updateAvailable:!1,error:L instanceof Error?L.message:"Network error"}}finally{clearTimeout(O)}}import*as ca from"node:readline";var ia=(I)=>`\x1B[${I}B`,Cf=(I)=>`\x1B[${I}A`;var ta=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Sf(I){return new Promise((_)=>setTimeout(_,I))}function Rf(I,_,O){if(!O)return _(I);if(O.aborted)return Promise.resolve();return new Promise((L,J)=>{let K=()=>O.removeEventListener("abort",ne),ne=()=>{K(),L()};O.addEventListener("abort",ne,{once:!0}),_(I).then(()=>{K(),L()},(oe)=>{K(),J(oe)})})}function xr(I){return Math.max(0,Math.min(1,I))}function St(I){return Math.max(0,Math.min(255,Math.round(I)))}function $o(I){return I<=0.0031308?12.92*I:1.055*I**0.4166666666666667-0.055}function Pf(I,_,O){let L=O*Math.PI/180,J=_*Math.cos(L),K=_*Math.sin(L),ne=(I+0.3963377774*J+0.2158037573*K)**3,oe=(I-0.1055613458*J-0.0638541728*K)**3,ue=(I-0.0894841775*J-1.291485548*K)**3;return{blue:St($o(xr(-0.0041960863*ne-0.7034186147*oe+1.707614701*ue))*255),green:St($o(xr(-1.2684380046*ne+2.6097574011*oe-0.3413193965*ue))*255),red:St($o(xr(4.0767416621*ne-3.3077115913*oe+0.2309699292*ue))*255)}}function Oo(I,_){let O=(_*I*180/Math.PI%360+360)%360;return Pf(0.72,0.15,O)}function sa(I,_=0.1){let O=Oo(_,I);return`\x1B[38;2;${O.red};${O.green};${O.blue}m`}function Ef(I,_){return{blue:St(I.blue+(255-I.blue)*_),green:St(I.green+(255-I.green)*_),red:St(I.red+(255-I.red)*_)}}function aa(I,_,O){let L=Math.imul(I+2654435769,2246822507)^Math.imul(_+3266489909,668265263)^Math.imul(O+374761393,2654435761),J=L^L>>>15,K=Math.imul(J,739982445),ne=K^K>>>12,oe=Math.imul(ne,695872825);return((oe^oe>>>15)>>>0)/4294967296}function Af(I,_,O){let L=Math.floor(aa(I,_,O)*ta.length);return ta[L]??"░"}function ra(I){let _=xr(I);return _*_*_*(_*(_*6-15)+10)}function If(I){if(I.length===0)return"";let _=[],O=!1,L="";for(let J of I){let K=`${J.red};${J.green};${J.blue}`;if(J.bold!==O)_.push(J.bold?"\x1B[1m":"\x1B[22m"),O=J.bold;if(K!==L)_.push(`\x1B[38;2;${K}m`),L=K;_.push(J.character)}return`${_.join("")}\x1B[22m\x1B[39m`}function _f(I,_,O,L,J){return I.map((K,ne)=>({...Oo(O,L+_+ne/J),bold:!1,character:K}))}function Tf(I,_,O,L,J,K,ne,oe){let ue=Math.max(1,L*0.75),pe=Math.min(1,O/ue),we=J*ra(pe),xe=Math.max(0,(O-ue)/Math.max(1,L-ue)),Se=(1-ra(O/L))*oe*2,Pe=0.35*Math.max(0,1-xe*2),Ce=pe>=1,en=Math.min(I.length,Math.ceil(we+2+1));return I.slice(0,en).map((Le,Ve)=>{let on=Oo(K,ne+_+Ve/oe+Se),sn=Ve+aa(_,Ve,7919)*2-1;if(sn>we+2)return{...on,bold:!1,character:" "};let an=we-sn,rn=0.8*Math.exp(-(an*an)/12.5),fn=Math.min(0.9,rn+Pe),On=!Ce&&sn>we-4;return{...Ef(on,fn),bold:fn>0.3,character:On?Af(_,Ve,O):Le}})}function oa(I){return`\x1B[?2026h${I.map((_,O)=>`\x1B8${O>0?ia(O):""}${If(_)}`).join("")}\x1B[?2026l`}async function Do(I,_={}){if(!I)return;let O=_.output??process.stdout,L=_.sleep??Sf,J=_.seed??0,K=I.split(`
`).map((we)=>Array.from(we)),ne=Math.max(...K.map((we)=>we.length)),oe=12000*K.filter((we)=>we.length>0).length/40,ue=ne>0?Math.max(1,Math.ceil(oe/16.666666666666668)):0,pe=ue>0?oe/ue:0;O.write(`\x1B[?25l${K.length>1?`${`
`.repeat(K.length-1)}${Cf(K.length-1)}`:""}\x1B7`);try{for(let we=1;we<=ue;we+=1){if(_.signal?.aborted)break;O.write(oa(K.map((xe,Se)=>Tf(xe,Se,we,ue,ne,0.1,J,3)))),await Rf(pe,L,_.signal)}}finally{if(O.write(oa(K.map((we,xe)=>_f(we,xe,0.1,J,3)))),O.write("\x1B8"),K.length>1)O.write(ia(K.length-1));O.write(`
\x1B[0m\x1B[?25h`)}}var la=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function $f(I){return Boolean(I.isTTY)}async function Ht(I={}){let _=I.output??process.stdout;if(!$f(_))return;let O=I.input??process.stdin,L={output:_,seed:I.seed??Math.random()*8192,sleep:I.sleep};if(!O.isTTY||typeof O.setRawMode!=="function"){await Do(la,L);return}let J=new AbortController,K=O.readableFlowing===!0,ne=O.isRaw===!0,oe=!1,ue=(pe,we)=>{if(we.ctrl&&we.name==="c")oe=!0;if(oe||we.name==="return"||we.name==="enter")J.abort()};ca.emitKeypressEvents(O),O.on("keypress",ue),O.setRawMode(!0),O.resume();try{await Do(la,{...L,signal:J.signal})}finally{if(O.off("keypress",ue),O.setRawMode(ne),!K)O.pause()}if(!oe)return;if(I.onInterrupt){I.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as jf}from"node:crypto";import{existsSync as pa}from"node:fs";import{dirname as Cr,join as fa}from"node:path";import{dirname as da,join as Of,resolve as Df}from"node:path";var Lf="rule.lock";function Nf(I){return Of(da(I),Lf)}function ua(I={}){return Df(I.cwd??process.cwd(),".safety-net.json")}function kn(I,_){let O=_.global?_.userConfigPath??G(I,_):_.projectConfigPath??U(_.cwd??process.cwd()),L=_.global?Ke(I,_):Je(O,_.cwd??process.cwd()),J=Nf(O);return{configDir:da(O),configPath:O,lockPath:J,filesystemScope:L,configTarget:i(L,O),lockTarget:i(L,J)}}var Ff="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",Hf="cache",Mf="rulebooks";function ma(I,_={}){let O=kn(I,_),L=i(O.filesystemScope,ha(O.configDir)),J=r(O.lockTarget);if(console.log(Ff),J===null&&!pa(L.path))return console.log(`No v2 lock or cache leftovers found in ${Cr(O.configDir)}; nothing to migrate.`),0;let K=Vf(J),ne=m(O.configTarget);if(!ne.config&&(r(O.configTarget)!==null||K.size>0))return console.error(`Cannot migrate: the rules config in ${Cr(O.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let oe=ne.config?.rules??[];for(let ue of oe.flatMap((pe)=>Uf(pe,K,O,L,_.global===!0)))console.log(ue);return j(O.lockTarget),it(L),console.log(`Removed the v2 lock and cache under ${Cr(O.configDir)}.`),0}function ga(I,_){return[...new Set([{cwd:_},{cwd:_,global:!0}].flatMap((O)=>{let L=kn(I,O);return[L.lockPath,ha(L.configDir)]}))].filter((O)=>pa(O))}function Uf(I,_,O,L,J){if(!S(I))return[];let K=D(I).name,ne=i(O.filesystemScope,N(O.configDir,K)),oe=r(ne);if(oe!==null&&Gf(oe,K))return[];let ue=_.get(I),pe=ue?Bf(ue,K,L.path,O.filesystemScope):null;if(pe===null)return[`Could not migrate ${I} from the v2 cache. Run \`cc-safety-net rule update ${I}${J?" --global":""}\` to vendor it.`];if(g(ne,pe),oe!==null)return[`Restored ${I} from the v2 cache over an invalid file.`];return[`Vendored ${I} from the v2 cache.`]}function Gf(I,_){let O=be(I);return!("problem"in O)&&O.rulebook.name===_}function Bf(I,_,O,L){let J=fa(O,Mf,`${qf(I)}--${I.digest.replace("sha256:","").slice(0,12)}`,me),K=r(i(L,J));if(K===null||Kf(K)!==I.digest)return null;let ne=be(K);if("problem"in ne||ne.rulebook.name!==_)return null;return K}function ha(I){return fa(Cr(I),Hf)}function qf(I){return([I.owner,I.repo,I.display_ref,I.name].every((L)=>typeof L==="string"&&L!=="")?`${I.owner}/${I.repo}#${I.display_ref}/${I.name}`:I.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function Vf(I){let _=I===null?null:zf(I),O=ya(_)&&Array.isArray(_.rulebooks)?_.rulebooks:[];return new Map(O.filter(Jf).map((L)=>[L.spec,L]))}function Jf(I){return ya(I)&&typeof I.spec==="string"&&typeof I.digest==="string"}function ya(I){return!!I&&typeof I==="object"}function zf(I){try{return JSON.parse(I)}catch{return null}}function Kf(I){return`sha256:${jf("sha256").update(I).digest("hex")}`}var va="\r\x1B[2K",Wf="\x1B[?25l",Yf="\x1B[39m",Zf="\x1B[?25h",Xf=100,Qf=0.55,em=80,ba=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function nm(I){return new Promise((_)=>setTimeout(_,I))}async function Sr(I,_={}){let O=_.output??process.stdout;if(!O.isTTY)return I;let L=_.sleep??nm,J=!1,K=I.then((oe)=>(J=!0,oe),(oe)=>{throw J=!0,oe});if(await Promise.race([K.then(()=>!0),L(Xf).then(()=>!1)]))return K;O.write(Wf);try{for(let oe=0;!J;oe+=1)O.write(`${va}${sa(oe*Qf)}${ba[oe%ba.length]}${Yf} ${_.loadingMessage??"Loading…"}`),await Promise.race([K,L(em)]);return await K}finally{O.write(`${va}${Zf}`)}}async function Mt(I,_,O,L={}){let J=_();if(I)await O();if(I&&J.ready)await Sr(J.ready,L);return J.finish()}import{stripVTControlCharacters as tm}from"node:util";var Rr="amp plugins list",rm=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function wa(I){if(!I.ampPluginListOutput)return{platform:"amp",status:"n/a"};let _=tm(I.ampPluginListOutput).split(`
`).map((O)=>rm.exec(O)?.[1]).find((O)=>O!==void 0);if(!_)return{platform:"amp",status:"n/a"};if(_!=="active")return{platform:"amp",status:"disabled",method:Rr,configPath:Rr,errors:[`Amp personal plugin cc-safety-net is ${_}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:Rr,configPath:Rr}}import{existsSync as lm,readFileSync as cm}from"node:fs";import{isAbsolute as Ux,join as am}from"node:path";function Ut(I){return am(I,".gemini","config","hooks.json")}var dm=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function um(I){if(!I||typeof I!=="object"||Array.isArray(I))return[];return Object.values(I).flatMap((_)=>{if(!_||typeof _!=="object"||Array.isArray(_))return[];let O=_,L=O.PreToolUse;if(!Array.isArray(L))return[];return L.flatMap((J)=>{if(!J||typeof J!=="object"||Array.isArray(J))return[];let K=J.hooks;if(!Array.isArray(K))return[];return K.flatMap((ne)=>{if(!ne||typeof ne!=="object"||Array.isArray(ne))return[];let oe=ne.command;if(typeof oe!=="string"||!dm.test(oe))return[];return[{command:oe,enabled:O.enabled!==!1}]})})})}function ka(I){let _=Ut(I.environment.home);if(!lm(_))return{platform:"antigravity-cli",status:"n/a",configPath:_};let O;try{O=um(JSON.parse(cm(_,"utf-8")))}catch(L){return{platform:"antigravity-cli",status:"n/a",configPath:_,errors:[`Failed to parse Antigravity hooks config ${_}: ${L instanceof Error?L.message:String(L)}`]}}if(O.some((L)=>L.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:_};if(O.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:_};return{platform:"antigravity-cli",status:"n/a",configPath:_}}import{join as No}from"node:path";import{existsSync as pm,lstatSync as fm,readFileSync as mm}from"node:fs";import{join as gm}from"node:path";function Rn(I,_=(O)=>O){if(!pm(I))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(_(mm(I,"utf-8")))}}catch{return{kind:"unreadable"}}}function Nn(I,_){if(I==="~")return _;if(I.startsWith("~/")||I.startsWith("~\\"))return gm(_,I.slice(2));return I}function dn(I){try{return fm(I)}catch{return}}function Pr(I,_){let O=dn(_);if(!O)return{platform:I,status:"n/a",configPath:_};if(!O.isSymbolicLink()&&O.isDirectory())return;return{platform:I,status:"n/a",configPath:_,errors:[`${_} is a symlink or not a directory; move or remove it before installing`]}}function tn(I,_){return typeof I==="object"&&I!==null?I[_]:void 0}var Lo="cc-safety-net@cc-marketplace";function Er(I){return I.env.get("CLAUDE_CONFIG_DIR")||No(I.home,".claude")}function xa(I){return No(Er(I),"plugins","installed_plugins.json")}function Ca(I,_){let O=tn(tn(I,"plugins"),_);return Array.isArray(O)&&O.length>0}function Ar(I,_){let O=Rn(xa(I));return O.kind==="ok"&&Ca(O.value,_)}function jo(I){let _=xa(I),O=Rn(_);if(O.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(O.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!Ca(O.value,Lo))return{platform:"claude-code",status:"n/a"};let L=No(Er(I),"settings.json"),J=Rn(L);if(J.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(J.kind==="ok"&&tn(tn(J.value,"enabledPlugins"),Lo)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:L,errors:[`${Lo} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:_}}function Sa(I){return jo(I.environment)}var Ra="Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.";function Pa(I){if(!I.codexPluginListOutput)return{platform:"codex",status:"n/a"};let _=I.codexPluginListOutput.split(`
`).find((O)=>O.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!_)return{platform:"codex",status:"n/a"};if(!_.includes("installed,"))return{platform:"codex",status:"n/a"};if(!_.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex runs only trusted hooks, and doctor cannot check trust. Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."]}}import{existsSync as $r,readdirSync as hm,readFileSync as ym}from"node:fs";import{join as bn}from"node:path";function vn(I){let _="",O=0,L=!1,J=!1,K=-1;while(O<I.length){let ne=I[O],oe=I[O+1];if(J){_+=ne,J=!1,O++;continue}if(ne==='"'&&!L){L=!0,K=-1,_+=ne,O++;continue}if(ne==='"'&&L){L=!1,_+=ne,O++;continue}if(ne==="\\"&&L){J=!0,_+=ne,O++;continue}if(L){_+=ne,O++;continue}if(ne==="/"&&oe==="/"){while(O<I.length&&I[O]!==`
`)O++;continue}if(ne==="/"&&oe==="*"){O+=2;while(O<I.length-1){if(I[O]==="*"&&I[O+1]==="/"){O+=2;break}O++}continue}if(ne===","){K=_.length,_+=ne,O++;continue}if(ne==="}"||ne==="]"){if(K!==-1){let ue=_.slice(K+1);if(/^\s*$/.test(ue))_=_.slice(0,K)+ue}K=-1,_+=ne,O++;continue}if(!/\s/.test(ne))K=-1;_+=ne,O++}return _}function Aa(I,_,O){let L=_+1,J=!1;while(L<I.length){if(J){J=!1,L++;continue}if(I[L]==="\\"){J=!0,L++;continue}if(I[L]==='"')return L+1;L++}throw Error(O)}function Ho(I,_,O){let L=I[_],J=L==="["?"]":"}",K=0,ne=_;while(ne<I.length){let oe=O.skipComment?.(I,ne)??ne;if(oe!==ne){ne=oe;continue}if(I[ne]==='"'){ne=Aa(I,ne,O.stringError);continue}if(I[ne]===L)K++;if(I[ne]===J){if(K--,K===0)return ne}ne++}throw Error(O.bracketError)}function Ia(I,_){let O=I.lastIndexOf(`
`,_)+1;return/^[ \t]*/.exec(I.slice(O))?.[0]??""}function _a(I,_){let O=_.end+(/^\s*/.exec(I.slice(_.end))?.[0].length??0);if(I[O]===","){let ne=I[O+1]===`
`?O+2:O+1;return`${I.slice(0,_.start)}${I.slice(ne)}`}let L=I.slice(0,_.start).search(/\s*$/)-1;if(I[L]!==",")return`${I.slice(0,_.start)}${I.slice(_.end)}`;let J=I.lastIndexOf(`
`,L-1),K=J!==-1&&/^\s*$/.test(I.slice(J+1,L))?J:L;return`${I.slice(0,K)}${I.slice(_.end)}`}function Fo(I,_){if(I.startsWith("//",_)){let O=I.indexOf(`
`,_+2);return O===-1?I.length:O+1}if(I.startsWith("/*",_)){let O=I.indexOf("*/",_+2);return O===-1?I.length:O+2}return _}function Ea(I,_){let O=_;while(O<I.length){if(/\s/.test(I[O]??"")){O++;continue}let L=Fo(I,O);if(L===O)return O;O=L}return O}function Ta(I,_,O){let L=0,J=0;while(J<I.length){let K=Fo(I,J);if(K!==J){J=K;continue}if(I[J]==='"'){let ne=Aa(I,J,O.stringError);if(L===1&&JSON.parse(I.slice(J,ne))===_){let oe=Ea(I,ne),ue=Ea(I,oe+1);if(I[oe]===":"&&I[ue]==="[")return{start:ue,end:Ho(I,ue,{skipComment:Fo,...O})}}J=ne;continue}if(I[J]==="{"||I[J]==="[")L++;if(I[J]==="}"||I[J]==="]")L--;J++}return}var In="cc-safety-net@cc-marketplace",Ir=["cc-marketplace","cc-safety-net"],$a=["_direct","copilot-safety-net"],Oa=["cc-marketplace","safety-net"],Da="safety-net@cc-marketplace";function _r(I,_){let O=_.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${O}([^a-z0-9-]|$)`,"m").test(I??"")}function La(I){return _r(I,"cc-safety-net@cc-marketplace")}function Na(I){return _r(I,"cc-marketplace")}function ja(I){return _r(I,"copilot-safety-net")}function Fa(I){return _r(I,"safety-net@cc-marketplace")}function Tr(I){if(!I?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(I)}function Ma(I,_){if(!I)return null;let O=I.match(/(\d+)\.(\d+)\.(\d+)/);if(!O)return null;let L=[Number(O[1]),Number(O[2]),Number(O[3])];for(let J=0;J<_.length;J++){let K=L[J]??0,ne=_[J]??0;if(K!==ne)return K>ne}return!0}function vm(I){return Ma(I,[0,0,422])}function bm(I){return Ma(I,[1,0,8])}function Bt(I){return I.env.get("COPILOT_HOME")||bn(I.home,".copilot")}function Mo(I){return(I.hooks?.preToolUse??[]).some((O)=>{if(O.type!==void 0&&O.type!=="command")return!1;return Tr(O.command)||Tr(O.bash)||Tr(O.powershell)||Tr(O.exec&&[O.exec,...O.args??[]].join(" "))})}function Gt(I){return I===void 0||typeof I==="string"}function wm(I){return I===void 0||Array.isArray(I)&&I.every((_)=>typeof _==="string")}function km(I){if(!I||typeof I!=="object"||Array.isArray(I))return!1;let _=I;if(_.disableAllHooks!==void 0&&typeof _.disableAllHooks!=="boolean")return!1;if(_.hooks===void 0)return!0;if(!_.hooks||typeof _.hooks!=="object"||Array.isArray(_.hooks))return!1;let O=_.hooks.preToolUse;if(O===void 0)return!0;return Array.isArray(O)&&O.every((L)=>L!==null&&typeof L==="object"&&!Array.isArray(L)&&Gt(L.type)&&Gt(L.command)&&Gt(L.bash)&&Gt(L.powershell)&&Gt(L.exec)&&wm(L.args))}function Uo(I,_){try{let O=JSON.parse(vn(ym(I,"utf-8")));if(!km(O)){_?.push(`Invalid hook config ${I}: hooks.preToolUse must be an array of hook objects`);return}return O}catch(O){_?.push(`Failed to parse ${I}: ${O instanceof Error?O.message:String(O)}`);return}}function Ua(I,_){try{return hm(I).filter((O)=>O.endsWith(".json")).sort((O,L)=>O.localeCompare(L))}catch(O){return _?.push(`Failed to read ${I}: ${O instanceof Error?O.message:String(O)}`),[]}}function xm(I,_){if(!$r(I))return[];let O=[];for(let L of Ua(I,_)){let J=bn(I,L),K=Uo(J,_);if(K&&Mo(K))O.push(J)}return O}function Rt(I,_){if(!$r(I))return;let O=Uo(I,_);if(!O)return;return{path:I,config:O}}function Ha(I,_,O,L){if(_){I.push(`GitHub Copilot CLI ${_} does not support ${O}; requires ${L}+`);return}I.push(`GitHub Copilot CLI version unavailable; skipping ${O} because it requires ${L}+`)}function Cm(I){for(let _ of I){if(_?.config.disableAllHooks===!0)return _.path;if(_?.config.disableAllHooks===!1)return}return}function Sm(I,_,O,L){let J=Bt(I),K=bn(_,".github","hooks"),ne=bn(J,"hooks"),oe=bn(_,".github","copilot"),ue=bn(_,".claude"),pe=bm(O),we=pe===!0?L:void 0,xe=[Rt(bn(oe,"settings.local.json"),we),Rt(bn(oe,"settings.json"),we),Rt(bn(ue,"settings.local.json"),we),Rt(bn(ue,"settings.json"),we)],Se=[Rt(bn(J,"settings.json"),we),Rt(bn(J,"config.json"),we)];if(pe!==!1){let an=Cm([...xe,...Se]);if(an){if(pe===null)L.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${an} as active`);return{activeConfigPaths:[],repoInlineSources:xe,disabledBy:an}}}let Pe=xm(K,L),Ce=vm(O),en=Ce===!0?L:void 0,Le=$r(ne)?Ua(ne,en):[],Ve=[];for(let an of Le){let rn=bn(ne,an),fn=Uo(rn,en);if(fn&&Mo(fn))Ve.push(rn)}if(Ce!==!0&&Ve.length>0)Ha(L,O,`user hook files in ${ne}`,"0.0.422"),Ve.length=0;let on=[];for(let an of[...xe,...Se]){if(!an)continue;if(!Mo(an.config))continue;if(pe===!0){on.push(an);continue}Ha(L,O,"inline hook definitions in Copilot config files","1.0.8");break}let sn=(an)=>an.filter((rn)=>!!rn&&on.includes(rn)).map((rn)=>rn.path);return{activeConfigPaths:[...sn(xe),...Pe,...sn(Se),...Ve],repoInlineSources:xe}}function Ga(I){let _=[],O=Sm(I.environment,I.cwd,I.copilotCliVersion,_);if(O.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:O.disabledBy,configPaths:[O.disabledBy],errors:_.length>0?_:void 0};let L=Bt(I.environment),J=bn(L,"installed-plugins",...Ir),K=$r(J),ne=bn(L,"settings.json"),oe=Rn(ne,vn),ue=(Pe)=>tn(tn(Pe,"enabledPlugins"),In),pe=O.repoInlineSources.find((Pe)=>typeof ue(Pe?.config)==="boolean"),we=pe??(oe.kind==="ok"?{path:ne,config:oe.value}:void 0);if(K&&!pe&&oe.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};let xe=K&&we!==void 0&&ue(we.config)===!1;if(xe&&O.activeConfigPaths.length===0)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:we.path,errors:[`${In} is installed but not enabled in Copilot CLI`]};let Se=K&&!xe;if(Se||O.activeConfigPaths.length>0){let Pe=O.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:Se?"plugin config":"hook config",configPath:Pe??(Se?J:void 0),configPaths:O.activeConfigPaths.length>0?O.activeConfigPaths:void 0,errors:_.length>0?_:void 0}}return{platform:"copilot-cli",status:"n/a",errors:_.length>0?_:void 0}}import{existsSync as Nm,readFileSync as jm}from"node:fs";import{existsSync as Ba,mkdirSync as Im,readFileSync as _m}from"node:fs";import{dirname as Tm,join as $m}from"node:path";import{existsSync as Rm,renameSync as Pm,statSync as Em,writeFileSync as Am}from"node:fs";function cn(I,_){let O=`${I}.${process.pid}.tmp`;Am(O,_,Rm(I)?{mode:Em(I).mode&511}:{}),Pm(O,I)}var xn=Object.fromEntries(Ft.map((I)=>[I.id,`npx -y cc-safety-net hook ${I.flags[1]}`]));var qt=xn.cursor,qa=30;function Dr(I){return $m(I.home,".cursor","hooks.json")}function Yn(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function Go(){return{command:qt,timeout:qa,failClosed:!0}}function Or(I){return Yn(I)&&I.command===qt}function Om(I){return Object.keys(I).length===3&&I.command===qt&&I.timeout===qa&&I.failClosed===!0}function Dm(I){try{return JSON.parse(_m(I,"utf-8"))}catch(_){if(_ instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${I}: ${_.message}`);throw _}}function Va(I){let _=Dm(I);if(!Yn(_))throw Error(`Cursor hooks config ${I} must be a JSON object`);if(_.version!==1)throw Error(`Cursor hooks config ${I} must set "version": 1`);if(_.hooks!==void 0&&!Yn(_.hooks))throw Error(`Cursor hooks config ${I} "hooks" must be an object`);let O=Yn(_.hooks)?_.hooks.preToolUse:void 0;if(O!==void 0&&!Array.isArray(O))throw Error(`Cursor hooks config ${I} "hooks.preToolUse" must be an array`);return _}function Ja(I){let _=Yn(I.hooks)?I.hooks.preToolUse:void 0;return Array.isArray(_)?_:[]}function Lm(I){if(!I.some(Or))return[...I,Go()];return I.reduce((_,O)=>{if(!Or(O))return _.result.push(O),_;if(!_.inserted)_.result.push(Go()),_.inserted=!0;return _},{result:[],inserted:!1}).result}function za(I,_,O){let L=Yn(_.hooks)?_.hooks:{},J={..._,hooks:{...L,preToolUse:O}};cn(I,`${JSON.stringify(J,null,2)}
`)}function Ka(I){let _=Dr(I);if(!Ba(_))return Im(Tm(_),{recursive:!0}),cn(_,`${JSON.stringify({version:1,hooks:{preToolUse:[Go()]}},null,2)}
`),{path:_,alreadyInstalled:!1};let O=Va(_),L=Ja(O),J=L.filter(Or);if(Yn(O.hooks)&&Array.isArray(O.hooks.preToolUse)&&J.length===1&&J[0]!==void 0&&Om(J[0]))return{path:_,alreadyInstalled:!0};return za(_,O,Lm(L)),{path:_,alreadyInstalled:!1}}function Wa(I){let _=Dr(I);if(!Ba(_))return{path:_,alreadyInstalled:!1};let O=Va(_),L=Ja(O),J=L.filter((K)=>!Or(K));if(J.length===L.length)return{path:_,alreadyInstalled:!1};return za(_,O,J),{path:_,alreadyInstalled:!0}}function Fm(I){if(!I||typeof I!=="object"||Array.isArray(I))return[];let _=I.hooks;if(!_||typeof _!=="object"||Array.isArray(_))return[];let O=_.preToolUse;if(!Array.isArray(O))return[];return O.filter((L)=>!!L&&typeof L==="object"&&!Array.isArray(L)&&L.command===qt)}function Hm(I){let _=[];if(I.length>1)_.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let O=I[0];if(O&&O.failClosed!==!0)_.push('Managed hook is missing "failClosed": true; reinstall to repair');if(O&&O.timeout!==30)_.push('Managed hook "timeout" is not 30; reinstall to repair');return _}function Ya(I){let _=Dr(I.environment);if(!Nm(_))return{platform:"cursor",status:"n/a",configPath:_};let O;try{O=JSON.parse(jm(_,"utf-8"))}catch(K){return{platform:"cursor",status:"n/a",configPath:_,errors:[`Failed to parse Cursor hooks config ${_}: ${K instanceof Error?K.message:String(K)}`]}}let L=Fm(O);if(L.length===0)return{platform:"cursor",status:"n/a",configPath:_};let J=Hm(L);return{platform:"cursor",status:"configured",method:"hook config",configPath:_,errors:J.length>0?J:void 0}}import{readdirSync as Mm}from"node:fs";import{join as Bo,resolve as Um}from"node:path";var qo="cc-safety-net";function Vo(I){let _=I.env.get("DSH_HOME");return Bo(_?.trim()?Um(Nn(_,I.home)):Bo(I.home,".dsh"),"profiles")}function Za(I){let _=Vo(I),O=dn(_)?.isDirectory()?Mm(_,{withFileTypes:!0}).filter((J)=>J.isDirectory()&&J.name!=="node_modules").map((J)=>{let K=Bo(_,J.name,"package.json");return{name:J.name,configPath:K,manifest:Rn(K)}}):[];return{installed:O.flatMap((J)=>{if(J.manifest.kind!=="ok")return[];let K=J.manifest.value;if(tn(tn(K,"dependencies"),qo)===void 0)return[];let ne=tn(tn(tn(K,"dsh"),"profile"),"bundles");return[{name:J.name,configPath:J.configPath,enabled:Array.isArray(ne)&&ne.includes(qo)}]}),unreadable:O.some((J)=>J.manifest.kind==="unreadable")}}function Jo(I){return Za(I).installed}function Xa(I){let _=Za(I.environment),O=_.installed.filter((K)=>K.enabled),L=_.installed.filter((K)=>!K.enabled),J=L.map((K)=>`${qo} is installed in the ${K.name} profile but its bundle is disabled`);if(O.length>0)return{platform:"deepseek-harness",status:"configured",method:"dsh bundle",configPaths:O.map((K)=>K.configPath),...J.length>0?{errors:J}:{}};if(L.length>0)return{platform:"deepseek-harness",status:"disabled",method:"dsh bundle",configPaths:L.map((K)=>K.configPath),errors:J};return _.unreadable?{platform:"deepseek-harness",status:"not-inspected"}:{platform:"deepseek-harness",status:"n/a"}}import{existsSync as zm}from"node:fs";import{existsSync as nl,mkdirSync as Gm,readFileSync as Bm}from"node:fs";import{dirname as qm,join as Wo}from"node:path";function zo(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function Ko(I,_){return zo(I)&&I.command===_}function Qa(I,_){return zo(I)&&Array.isArray(I.hooks)&&I.hooks.some((O)=>Ko(O,_))}function Zn(I,_){return{hooks:[{type:"command",command:I,timeout:_}]}}function jn(I,_){return I.flatMap((O)=>{if(!zo(O)||!Array.isArray(O.hooks))return[O];let L=O.hooks.filter((J)=>!Ko(J,_));if(L.length===O.hooks.length)return[O];return L.length===0?[]:[{...O,hooks:L}]})}function Pt(I,_,O){let L=I.filter((J)=>Qa(J,_));return L.length===1&&JSON.stringify(L[0])===JSON.stringify(Zn(_,O))}function Et(I,_){return I.find((O)=>Qa(O,_))}function At(I,_,O){let L=Array.isArray(I.hooks)?I.hooks.find((J)=>Ko(J,_)):void 0;return[...I.matcher===void 0||I.matcher===""||I.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...L?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...L?.timeout===O?[]:[`Managed hook "timeout" is not ${O}; reinstall to repair`]]}var Xn=xn.devin,Lr=30,Vm={config:{},hooks:{},preToolUse:[]};function Nr(I,_=process.platform){let O=_==="win32"?I.env.get("APPDATA")||Wo(I.home,"AppData","Roaming"):I.env.get("XDG_CONFIG_HOME")||Wo(I.home,".config");return Wo(O,"devin","config.json")}function el(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function Jm(I){try{return{ok:!0,value:JSON.parse(vn(Bm(I,"utf-8")))}}catch(_){return{ok:!1,message:_ instanceof Error?_.message:String(_)}}}function Yo(I){let _=Jm(I);if(!_.ok)return`Failed to parse Devin CLI config ${I}: ${_.message}`;let O=_.value;if(!el(O))return`Devin CLI config ${I} must be a JSON object`;let L=O.hooks===void 0?{}:O.hooks;if(!el(L))return`Devin CLI config ${I} "hooks" must be an object`;let J=L.PreToolUse===void 0?[]:L.PreToolUse;if(!Array.isArray(J))return`Devin CLI config ${I} "hooks.PreToolUse" must be an array`;return{config:O,hooks:L,preToolUse:J}}function tl(I){let _=Yo(I);if(typeof _==="string")throw Error(_);return _}function rl(I,_,O){let L={..._.config,hooks:{..._.hooks,PreToolUse:O}};cn(I,`${JSON.stringify(L,null,2)}
`)}function ol(I){let _=Nr(I),O=nl(_)?tl(_):Vm;if(Pt(O.preToolUse,Xn,Lr))return{path:_,alreadyInstalled:!0};return Gm(qm(_),{recursive:!0}),rl(_,O,[...jn(O.preToolUse,Xn),Zn(Xn,Lr)]),{path:_,alreadyInstalled:!1}}function il(I){let _=Nr(I);if(!nl(_))return{path:_,alreadyInstalled:!1};let O=tl(_),L=jn(O.preToolUse,Xn);if(JSON.stringify(L)===JSON.stringify(O.preToolUse))return{path:_,alreadyInstalled:!1};return rl(_,O,L),{path:_,alreadyInstalled:!0}}function sl(I){let _=Nr(I.environment);if(!zm(_))return{platform:"devin",status:"n/a",configPath:_};let O=Yo(_);if(typeof O==="string")return{platform:"devin",status:"n/a",configPath:_,errors:[O]};let L=Et(O.preToolUse,Xn);if(!L)return{platform:"devin",status:"n/a",configPath:_};let J=At(L,Xn,Lr);return{platform:"devin",status:"configured",method:"hook config",configPath:_,errors:J.length>0?J:void 0}}import{existsSync as Qm,readFileSync as eg}from"node:fs";import{existsSync as jr,mkdirSync as Km,readFileSync as Wm,rmSync as Ym}from"node:fs";import{dirname as Zm,join as al}from"node:path";var Qn=xn.droid,Fr=30;function Hr(I){return al(I.home,".factory","hooks.json")}function ll(I){return al(I.home,".factory","settings.json")}function Zo(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function cl(I){try{return JSON.parse(Wm(I,"utf-8"))}catch(_){if(_ instanceof SyntaxError)throw Error(`Failed to parse Factory Droid hooks config ${I}: ${_.message}`);throw _}}function dl(I){let _=cl(I);if(!Zo(_))throw Error(`Factory Droid hooks config ${I} must be a JSON object`);if(_.PreToolUse===void 0||Array.isArray(_.PreToolUse))return _;throw Error(`Factory Droid hooks config ${I} "PreToolUse" must be an array`)}function Xm(I){if(!jr(I))return{};let _=cl(I);return Zo(_)&&Zo(_.hooks)?_.hooks:{}}function ul(I){return Array.isArray(I.PreToolUse)?I.PreToolUse:[]}function pl(I,_,O){cn(I,`${JSON.stringify({..._,PreToolUse:O},null,2)}
`)}function fl(I){let _=Hr(I),O=jr(_),L=O?dl(_):Xm(ll(I)),J=ul(L);if(O&&Pt(J,Qn,Fr))return{path:_,alreadyInstalled:!0};return Km(Zm(_),{recursive:!0}),pl(_,L,[...jn(J,Qn),Zn(Qn,Fr)]),{path:_,alreadyInstalled:!1}}function ml(I){let _=Hr(I);if(!jr(_))return{path:_,alreadyInstalled:!1};let O=dl(_),L=ul(O),J=jn(L,Qn);if(JSON.stringify(J)===JSON.stringify(L))return{path:_,alreadyInstalled:!1};let K=jr(ll(I));if(J.length===0&&Object.keys(O).length===1&&!K)return Ym(_),{path:_,alreadyInstalled:!0};return pl(_,O,J),{path:_,alreadyInstalled:!0}}function gl(I){let _=Hr(I.environment);if(!Qm(_))return{platform:"droid",status:"n/a",configPath:_};let O;try{O=JSON.parse(eg(_,"utf-8"))}catch(ne){return{platform:"droid",status:"n/a",configPath:_,errors:[`Failed to parse Factory Droid hooks config ${_}: ${ne instanceof Error?ne.message:String(ne)}`]}}let L=typeof O==="object"&&O!==null&&"PreToolUse"in O?O.PreToolUse:void 0,J=Et(Array.isArray(L)?L:[],Qn);if(!J)return{platform:"droid",status:"n/a",configPath:_};let K=[...J.commandRegex===void 0||J.commandRegex===""?[]:['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair'],...At(J,Qn,Fr)];return{platform:"droid",status:"configured",method:"hook config",configPath:_,errors:K.length>0?K:void 0}}import{existsSync as ng}from"node:fs";import{join as Xo}from"node:path";var Qo="gemini-safety-net";function ei(I){let _=Xo(I.home,".gemini","extensions"),O=Xo(_,Qo);if(!ng(O))return{platform:"gemini-cli",status:"n/a"};let L=Xo(_,"extension-enablement.json"),J=Rn(L);if(J.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let K=J.kind==="ok"?tn(tn(J.value,Qo),"overrides"):void 0;if(Array.isArray(K)&&K.some((oe)=>typeof oe==="string"&&oe.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:L,errors:[`${Qo} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:O}}function hl(I){return ei(I.environment)}import{existsSync as ig,readFileSync as sg}from"node:fs";import{existsSync as vl,mkdirSync as tg,readFileSync as bl,rmSync as rg}from"node:fs";import{dirname as og,join as yl}from"node:path";var nt=xn["grok-build"],Ur=30,ni=Zn(nt,Ur);function Gr(I){return yl(I.env.get("GROK_HOME")??yl(I.home,".grok"),"hooks","cc-safety-net.json")}function Br(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function wl(I){try{let _=JSON.parse(I);return Br(_)?_:null}catch{return null}}function kl(I){let _=Br(I.hooks)?I.hooks.PreToolUse:void 0;return Array.isArray(_)?_:[]}function Mr(I,_,O){let L=Br(_.hooks)?_.hooks:{};cn(I,`${JSON.stringify({..._,hooks:{...L,PreToolUse:O}},null,2)}
`)}function xl(I){let _=Gr(I);if(!vl(_))return tg(og(_),{recursive:!0}),Mr(_,{},[ni]),{path:_,alreadyInstalled:!1};let O=wl(bl(_,"utf-8"));if(!O)return Mr(_,{},[ni]),{path:_,alreadyInstalled:!1};let L=kl(O);if(Pt(L,nt,Ur))return{path:_,alreadyInstalled:!0};return Mr(_,O,[...jn(L,nt),ni]),{path:_,alreadyInstalled:!1}}function Cl(I){let _=Gr(I);if(!vl(_))return{path:_,alreadyInstalled:!1};let O=wl(bl(_,"utf-8"));if(!O)return{path:_,alreadyInstalled:!1};let L=kl(O),J=jn(L,nt);if(JSON.stringify(J)===JSON.stringify(L))return{path:_,alreadyInstalled:!1};let K=Br(O.hooks)?O.hooks:{};if(J.length===0&&Object.keys(O).length===1&&Object.keys(K).length===1)return rg(_),{path:_,alreadyInstalled:!0};return Mr(_,O,J),{path:_,alreadyInstalled:!0}}function Sl(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}function Rl(I){let _=Gr(I.environment);if(!ig(_))return{platform:"grok-build",status:"n/a",configPath:_};let O;try{O=JSON.parse(sg(_,"utf-8"))}catch(ne){return{platform:"grok-build",status:"n/a",configPath:_,errors:[`Failed to parse Grok Build hooks config ${_}: ${ne instanceof Error?ne.message:String(ne)}`]}}let L=Sl(O)&&Sl(O.hooks)?O.hooks.PreToolUse:void 0,J=Et(Array.isArray(L)?L:[],nt);if(!J)return{platform:"grok-build",status:"n/a",configPath:_};let K=At(J,nt,Ur);return{platform:"grok-build",status:"configured",method:"hook config",configPath:_,errors:K.length>0?K:void 0}}import{readFileSync as Dl}from"node:fs";import{join as Ll}from"node:path";var Pn="cc-safety-net",ti="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",ag=30;function Pl(I){return`${ti}
# version: ${I}
`}function lg(I){return`${Pl(I)}name: ${Pn}
version: "${I}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function cg(I){return`${Pl(I)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${xn["hermes-agent"].split(" ").map((_)=>`"${_}"`).join(", ")}]
TIMEOUT_SECONDS = ${ag}


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
`}function Vt(I){return[{name:"__init__.py",content:cg(I)},{name:"plugin.yaml",content:lg(I)}]}import{mkdirSync as dg,readdirSync as ug,readFileSync as El,rmSync as ri}from"node:fs";import{basename as pg,dirname as fg,join as Fn}from"node:path";var mg="__pycache__",gg=/^[a-z0-9][a-z0-9_-]{0,63}$/;function hg(I){try{return El(I,"utf-8").trim()}catch{return}}function oi(I){let _=I.env.get("HERMES_HOME")?.trim();if(_&&pg(fg(_))==="profiles")return _;let O=_||Fn(I.home,".hermes"),L=Fn(O,"active_profile"),J=hg(L),K=J?.toLowerCase();if(!K||K==="default")return O;if(!gg.test(K))throw Error(`Invalid Hermes profile name "${J}" in ${L}; run \`hermes profile use <name>\` with a valid profile.`);return Fn(O,"profiles",K)}function ii(I){return Fn(oi(I),"plugins",Pn)}function si(I){return I.startsWith(ti)}function ai(I,_){let O=ii(I),L=dn(O);if(L&&(L.isSymbolicLink()||!L.isDirectory()))throw Error(`Refusing to ${_} ${O}: not a regular directory. Move or remove it and rerun ${_==="install"?"install":"uninstall"} --hermes-agent.`);return O}function Al(I,_){let O=dn(I);if(!O)return;if(O.isSymbolicLink()||!O.isFile())throw Error(`Refusing to ${_} ${I}: not a regular file. Move or remove it.`);let L=El(I,"utf-8");if(!si(L))throw Error(`Refusing to ${_} unmanaged file at ${I}. Move or remove it.`);return L}function Il(I){let _=ai(I,"install"),O=Vt(pn());if(O.map((J)=>Al(Fn(_,J.name),"overwrite")).every((J,K)=>J===O[K]?.content))return{path:_,alreadyInstalled:!0};return dg(_,{recursive:!0}),O.forEach((J)=>{cn(Fn(_,J.name),J.content)}),{path:_,alreadyInstalled:!1}}function li(I){let _=ai(I,"remove");if(!dn(_))return[];return Vt(pn()).filter((O)=>Al(Fn(_,O.name),"remove")!==void 0)}function _l(I){let _=ai(I,"remove");if(!dn(_))return{path:_,alreadyInstalled:!1};let O=li(I);if(O.forEach((L)=>{ri(Fn(_,L.name))}),ri(Fn(_,mg),{recursive:!0,force:!0}),ug(_).length===0)ri(_,{recursive:!0});return{path:_,alreadyInstalled:O.length>0}}var Jt="hermes-agent",Tl=/^([^\s#][^:]*):/,yg=/^\s+([A-Za-z_][\w-]*):/,$l=/^\s+-\s*(.*)$/;function vg(I){return I.trim().replace(/^(["'])(.*)\1$/,"$2")}function bg(I){let _=I.split(/\r?\n/),O=_.findIndex((K)=>Tl.exec(K)?.[1]?.trim()==="plugins");if(O===-1)return[];let L=_.slice(O+1),J=L.findIndex((K)=>Tl.test(K));return J===-1?L:L.slice(0,J)}function Ol(I,_){let O=bg(I),L=O.findIndex((ne)=>yg.exec(ne)?.[1]===_);if(L===-1)return[];let J=O.slice(L+1),K=J.findIndex((ne)=>!$l.test(ne));return(K===-1?J:J.slice(0,K)).map((ne)=>vg($l.exec(ne)?.[1]??""))}function wg(I){try{return Dl(Ll(oi(I),"config.yaml"),"utf-8")}catch{return}}function ci(I){let _=wg(I)??"";return Ol(_,"enabled").includes(Pn)&&!Ol(_,"disabled").includes(Pn)}function Nl(I){return/^# version:\s*(.+)$/m.exec(I)?.[1]?.trim()}function kg(I,_){let O=dn(I);if(!O)return{error:`${_.name} is missing from ${I}; run install --hermes-agent`};if(O.isSymbolicLink()||!O.isFile())return{error:`${I} is a symlink or not a regular file; move or remove it`};try{let L=Dl(I,"utf-8");if(!si(L))return{error:`Unmanaged ${_.name} occupies ${I}; move or remove it`};if(Nl(L)===pn()&&L!==_.content)return{error:`Modified ${_.name} occupies ${I}; run install --hermes-agent to restore it`};return{content:L}}catch(L){return{error:`Failed to read ${I}: ${L instanceof Error?L.message:String(L)}`}}}function xg(I){try{return{path:ii(I)}}catch(_){return{error:_ instanceof Error?_.message:String(_)}}}function jl(I){let _=xg(I.environment);if("error"in _)return{platform:Jt,status:"n/a",errors:[_.error]};let O=_.path,L=Pr(Jt,O);if(L)return L;let J=Vt(pn()).map((ue)=>kg(Ll(O,ue.name),ue)),K=J.flatMap((ue)=>("error"in ue)?[ue.error]:[]);if(K.length>0)return{platform:Jt,status:"n/a",configPath:O,errors:K};let ne=J.some((ue)=>("content"in ue)&&Nl(ue.content)!==pn()),oe=ne?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!ci(I.environment))return{platform:Jt,status:"disabled",method:"plugin directory",configPath:O,errors:[`${Pn} is not enabled in Hermes; run \`hermes plugins enable ${Pn}\``,...oe]};return{platform:Jt,status:"configured",method:"plugin directory",configPath:O,errors:ne?oe:void 0}}import{existsSync as Cg,readFileSync as Sg}from"node:fs";import{join as Fl}from"node:path";var Rg=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;function Pg(I){return Fl(I.env.get("KIMI_CODE_HOME")||Fl(I.home,".kimi-code"),"config.toml")}function zt(I){let _=Pg(I.environment);if(!Cg(_))return{platform:"kimi-code",status:"n/a",configPath:_};try{if(!Rg.test(Sg(_,"utf-8")))return{platform:"kimi-code",status:"n/a",configPath:_}}catch(O){return{platform:"kimi-code",status:"n/a",configPath:_,errors:[`Failed to read ${_}: ${O instanceof Error?O.message:String(O)}`]}}return{platform:"kimi-code",status:"configured",method:"hook config",configPath:_}}import{readFileSync as Kl}from"node:fs";import{join as Wt}from"node:path";var un="cc-safety-net",Sn="index.js",It="openclaw.plugin.json",_t="package.json";var qr="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as Ig,lstatSync as _g,readdirSync as Tg,readFileSync as $g}from"node:fs";import{dirname as Ml,join as Bn}from"node:path";import{fileURLToPath as Og}from"node:url";import{spawn as Eg}from"node:child_process";function Ag(I){return I.join(" ")}function di(I,_,O){return[`Failed to run ${Ag(I)}${_===null?"":` (exit ${_})`}.`,O.trim()].filter(Boolean).join(`
`)}function ui(I){let _={stdout:"",stderr:""};return I.stdout.setEncoding("utf-8"),I.stderr.setEncoding("utf-8"),I.stdout.on("data",(O)=>{_.stdout+=O}),I.stderr.on("data",(O)=>{_.stderr+=O}),_}function yn(I,_){return new Promise((O,L)=>{let J=Wn([...I],process.env),K=Eg(J.cmd,J.args,{stdio:["ignore","pipe","pipe"]}),ne=ui(K),oe=()=>[ne.stdout,ne.stderr].filter(Boolean).join(`
`),ue=_?.timeoutMs??120000,pe=setTimeout(()=>{K.kill(),L(Error(di(I,null,`Timed out after ${ue}ms.
${oe()}`.trim())))},ue);K.on("error",(we)=>{clearTimeout(pe),L(Error(di(I,null,`${we.message}
${oe()}`.trim())))}),K.on("close",(we)=>{if(clearTimeout(pe),we!==0){L(Error(di(I,we,oe())));return}O(_?.stdoutOnly?ne.stdout:oe())})})}async function pi(I){for(let _ of I)await yn(_)}async function Hl(I){for(let _ of I)try{await yn(_)}catch(O){console.warn(O instanceof Error?O.message:String(O))}}var fi=Bn("openclaw",un),ot=`run \`openclaw plugins enable ${un}\``,Dg="config reload superseded by a newer runtime config source",Lg=[Sn,It,_t];function Ul(I){let _=I.env.get("OPENCLAW_HOME")?.trim();return _?Nn(_,I.home):I.home}function Gl(I){let _=Ul(I),O=I.env.get("OPENCLAW_STATE_DIR")?.trim();if(O)return Nn(O,_);let L=I.env.get("OPENCLAW_CONFIG_PATH")?.trim();return L?Ml(Nn(L,_)):Bn(_,".openclaw")}function Bl(I){let _=I.env.get("OPENCLAW_CONFIG_PATH")?.trim();return _?Nn(_,Ul(I)):Bn(Gl(I),"openclaw.json")}function Kt(I){return Bn(Gl(I),"extensions",un)}function Ng(I){let _=Tg(I);if(_.length===0)return!0;if(_.some((J)=>!Lg.includes(J)))return!1;let O=Bn(I,Sn),L=dn(O);return L!==void 0&&!L.isSymbolicLink()&&L.isFile()&&$g(O,"utf-8").startsWith(qr)}function mi(I){let _=Kt(I),O=dn(_);if(!O)return;if(!O.isSymbolicLink()&&O.isDirectory()&&Ng(_))return;throw Error(`Refusing to modify ${_}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function ql(){let I=Ml(Og(import.meta.url));return[Bn(I,fi),Bn(I,"..",fi),Bn(I,"..","..","..","dist",fi)]}function gi(I=ql()){return I.find((_)=>Ig(_)&&_g(_).isDirectory())}function jg(I=ql()){let _=gi(I);if(!_)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return _}function Vl(I=jg()){return[["openclaw","plugins","install",I,"--force","--accept-capabilities"]]}function Fg(I){let _=(()=>{try{return JSON.parse(I)}catch{return}})(),O=tn(tn(_,"plugin"),"status");return typeof O==="string"?O:void 0}async function Hg(){await yn(["openclaw","plugins","enable",un]).catch((I)=>{if(!(I instanceof Error&&I.message.includes(Dg)))throw I})}async function Jl(I){let _=async()=>Fg(await yn(["openclaw","plugins","inspect",un,"--runtime","--json"],{stdoutOnly:!0})),O=await _(),L=O==="disabled"&&I;if(L)await Hg();let J=L?await _():O;if(J==="loaded")return;throw Error(`${J===void 0?`The ${un} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:J==="disabled"?`OpenClaw reports the ${un} plugin with status "disabled"; ${ot}.`:`OpenClaw reports the ${un} plugin with status "${J}".`} Run \`openclaw plugins inspect ${un} --runtime\` for details.`)}var Vr="openclaw";function Tt(I,_){let O=Wt(I,_),L=dn(O);if(!L)return{error:`${_} is missing from ${O}; run install --openclaw`};if(L.isSymbolicLink()||!L.isFile())return{error:`${O} is a symlink or not a regular file; move or remove it`};try{return{content:Kl(O,"utf-8")}}catch(J){return{error:`Failed to read ${O}: ${J instanceof Error?J.message:String(J)}`}}}function Wl(I){try{return JSON.parse(vn(I))}catch{return}}function Mg(I){let _=Tt(I,It);if("error"in _)return _.error;if(tn(Wl(_.content),"id")===un)return;return`${Wt(I,It)} is not a valid ${un} manifest; run install --openclaw`}function Ug(I){let _=Tt(I,_t);if("error"in _)return _.error;let O=tn(tn(Wl(_.content),"openclaw"),"extensions");if(Array.isArray(O)&&O.includes(`./${Sn}`))return;return`${Wt(I,_t)} does not point OpenClaw at ${Sn}; run install --openclaw`}function zl(I){return Array.isArray(I)?I.filter((_)=>typeof _==="string"):[]}function Gg(I){let _=Bl(I);if(!dn(_))return`${un} is not enabled; ${ot}`;let O=(()=>{try{return JSON.parse(vn(Kl(_,"utf-8")))}catch{return}})();if(O===void 0)return`Failed to read ${_}; fix it, then ${ot}`;let L=tn(O,"plugins");if(tn(L,"enabled")===!1)return`plugins.enabled is false in ${_}; no OpenClaw plugin loads`;let J=tn(tn(tn(L,"entries"),un),"enabled");if(zl(tn(L,"deny")).includes(un)||J===!1)return`${un} is disabled in ${_}; ${ot}`;let K=zl(tn(L,"allow"));if(K.length>0&&!K.includes(un))return`plugins.allow in ${_} does not list ${un}; add it, then ${ot}`;if(K.includes(un)||J===!0)return;return`${un} is not enabled; ${ot}`}function Yl(I){return/^\/\/ version:\s*(.+)$/m.exec(I)?.[1]?.trim()}function Bg(I,_,O){if(O===void 0)return[];let L=Tt(O,Sn);if(!(("content"in L)&&Yl(L.content)===_))return[];return[Sn,It,_t].flatMap((K)=>{let ne=Tt(I,K),oe=Tt(O,K);if("error"in ne||"error"in oe||ne.content===oe.content)return[];return[`Modified ${K} occupies ${Wt(I,K)}; run install --openclaw to restore it`]})}function Zl(I){let _=Kt(I.environment),O=Pr(Vr,_);if(O)return O;let L=Tt(_,Sn),K=["error"in L?L.error:L.content.startsWith(qr)?void 0:`Unmanaged ${Sn} occupies ${Wt(_,Sn)}; move or remove it`,Mg(_),Ug(_)].filter((we)=>we!==void 0),ne="content"in L?Yl(L.content):void 0,oe=K.length>0?K:Bg(_,ne,gi());if(oe.length>0)return{platform:Vr,status:"n/a",configPath:_,errors:oe};let ue=ne===pn()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],pe=Gg(I.environment);if(pe)return{platform:Vr,status:"disabled",method:"plugin directory",configPath:_,errors:[pe,...ue]};return{platform:Vr,status:"configured",method:"plugin directory",configPath:_,errors:ue.length>0?ue:void 0}}import{existsSync as Xg,readFileSync as Qg}from"node:fs";import{basename as eh}from"node:path";import{existsSync as Jr,readFileSync as hi,rmSync as qg}from"node:fs";import{join as _n}from"node:path";import{pathToFileURL as Vg}from"node:url";var Yt="cc-safety-net",dt=`${Yt}@latest`,yi=["opencode.json","opencode.jsonc"],Jg=60,zg=250,Xl="CCSafetyNetPlugin",Kg={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function Ql(I){return _n(I.env.get("XDG_CONFIG_HOME")||_n(I.home,".config"),"opencode")}function vi(I){return I.env.get("OPENCODE_CONFIG_DIR")||Ql(I)}function bi(I){return yi.map((_)=>_n(vi(I),_))}function wi(I){return[...new Set([vi(I),Ql(I)])].flatMap((_)=>yi.map((O)=>_n(_,O)))}function ec(I){return _n(I.env.get("XDG_CACHE_HOME")||_n(I.home,".cache"),"opencode","packages",dt)}function nc(I){qg(ec(I),{recursive:!0,force:!0})}async function tc(I){let _=(await yn(["opencode","--version"],{stdoutOnly:!0})).trim(),O=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(_),L=Number(O?.[1]),J=Number(O?.[2]),K=Number(O?.[3]);if(!O||L!==1&&L!==2||L===1&&(J<18||J===18&&K<29)||L===2&&J===0&&K<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${_||"an unknown version"}.`);if(L===2){for(let ne of bi(I)){if(!Jr(ne))continue;let oe=xi(hi(ne,"utf-8"),ne);if(["plugin","plugins"].some((pe)=>{let we=tn(oe,pe);return Array.isArray(we)&&we.some((xe)=>zr(xe)&&(typeof xe==="string"?xe:tn(xe,"package"))!==dt)}))throw Error(`Change the cc-safety-net package spec in ${ne} to ${dt}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[],afterInstall:async()=>{if((await yn(["opencode","plugin","add",dt],{stdoutOnly:!0})).includes("is already configured in"))await yn(["opencode","plugin","update",dt]);let oe=await ic();if(!/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(oe))throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.");let ue=["--param",`location[directory]=${process.cwd()}`];await yn(["opencode","api","integration.list",...ue]);let pe=await yn(["opencode","api","plugin.list",...ue],{stdoutOnly:!0}),we=ki(pe);if(we)throw Error(we);if(!rc(pe).some(oc))throw Error("OpenCode lists no active cc-safety-net for this directory. Run `opencode api plugin.list` for details.")}}}return nc(I),{commands:[["opencode","plugin","-g","-f",dt]],afterInstall:()=>Yg(I)}}function rc(I){return Wg(I).filter((_)=>tn(_,"id")===Yt||zr(tn(tn(_,"source"),"target"))).map((_)=>tn(_,"state"))}function oc(I){return tn(I,"status")==="active"}function ki(I){let _=rc(I);if(_.some(oc))return;let O=_.find((L)=>tn(L,"status")==="failed");if(!O)return;return`OpenCode reports cc-safety-net failed: ${String(tn(O,"error")).split(`
`)[0]}`}function Wg(I){if(!I)return[];try{let _=tn(JSON.parse(I),"data");return Array.isArray(_)?_:[]}catch{return[]}}async function ic(I=1){let _=await yn(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s|\scc-safety-net@latest\s*$/m.test(_)||I===Jg)return _;return await new Promise((O)=>setTimeout(O,zg)),ic(I+1)}async function Yg(I){let _=_n(ec(I),"node_modules",Yt),O=_n(_,"package.json");if(!Jr(O))throw Error(`The OpenCode plugin cache at ${_} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${dt}\` for details.`);let L=tn(JSON.parse(hi(O,"utf-8")),"main");if(typeof L!=="string")throw Error(`The cached OpenCode plugin at ${_} declares no "main" entry.`);let J=_n(_,L);if(typeof(await import(Vg(J).href))[Xl]==="function")return;throw Error(`The cached OpenCode plugin at ${J} does not export a callable ${Xl}, so OpenCode would load nothing and fail open.`)}function xi(I,_){try{return JSON.parse(vn(I))}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${_}: ${O.message}`);throw O}}function zr(I){let _=typeof I==="string"?I:tn(I,"package");return typeof _==="string"&&(_===Yt||_.startsWith(`${Yt}@`))}function Ci(I){return["plugin","plugins"].some((_)=>{let O=tn(I,_);return Array.isArray(O)&&O.some(zr)})}function Zg(I,_){let L=["plugin","plugins"].flatMap((J)=>{let K=Ta(I,J,Kg);if(!K)return[];let ne=[],oe=0,ue=K.start+1,pe=I.slice(K.start+1,K.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let we of pe){if(we[0].startsWith("//")||we[0].startsWith("/*"))continue;let xe=K.start+1+we.index;if(oe===0)ue=xe;if(we[0]==="{"||we[0]==="[")oe++;if(we[0]==="}"||we[0]==="]")oe--;if(oe!==0||we[0]===",")continue;let Se=xe+we[0].length;if(zr(JSON.parse(vn(I.slice(ue,Se)))))ne.push({start:ue,end:Se})}return ne}).sort((J,K)=>J.start-K.start).reverse().reduce((J,K)=>{let ne=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(J.slice(K.end));if(ne?.[0].includes("/")){let oe=K.end+ne[0].length-1;return J.slice(0,K.start)+J.slice(K.end,oe)+J.slice(oe+1)}return _a(J,K)},I);return xi(L,_),L}function sc(I){nc(I);let _=wi(I),O=_.find((K)=>Jr(K)),L=[],J=[];for(let K of _){if(!Jr(K))continue;try{let ne=hi(K,"utf-8");if(!Ci(xi(ne,K)))continue;cn(K,Zg(ne,K)),J.push(K)}catch(ne){L.push(ne instanceof Error?ne.message:String(ne))}}if(L.length>0)throw Error(L.join(`
`));return{path:J[0]??O??_n(vi(I),yi[0]),alreadyInstalled:J.length>0}}function $t(I){let _=[];for(let O of I.openCodeVersion?.startsWith("2.")?bi(I.environment):wi(I.environment))if(Xg(O))try{let L=Qg(O,"utf-8"),J=vn(L),K=JSON.parse(J);if(Ci(K)){let ne=ki(I.openCodePluginListOutput);if(ne)return{platform:"opencode",status:"disabled",method:"opencode api plugin.list",configPath:O,errors:[..._,ne]};return{platform:"opencode",status:"configured",method:"plugin array",configPath:O,errors:_.length>0?_:void 0}}}catch(L){_.push(`Failed to parse ${eh(O)}: ${L instanceof Error?L.message:String(L)}`)}return{platform:"opencode",status:"n/a",errors:_.length>0?_:void 0}}import{join as ac}from"node:path";function Si(I){let _=I.env.get("PI_CODING_AGENT_DIR");return ac(_?Nn(_,I.home):ac(I.home,".pi","agent"),"settings.json")}function Ri(I){if(typeof I!=="string")return!1;return I==="npm:cc-safety-net"||I.startsWith("npm:cc-safety-net@")}function lc(I){let _=Si(I.environment),O=Rn(_);if(O.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(O.kind==="missing")return{platform:"pi",status:"n/a"};let L=tn(O.value,"packages");if(!Array.isArray(L))return{platform:"pi",status:"n/a"};let J=L.find((oe)=>Ri(typeof oe==="string"?oe:tn(oe,"source")));if(J===void 0)return{platform:"pi",status:"n/a"};let K=tn(J,"extensions");if(Array.isArray(K)&&K.some((oe)=>typeof oe==="string"&&oe.startsWith("-")))return{platform:"pi",status:"disabled",method:"package config",configPath:_,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:_}}var nh={amp:wa,"antigravity-cli":ka,"claude-code":Sa,codex:Pa,"copilot-cli":Ga,cursor:Ya,"deepseek-harness":Xa,devin:sl,droid:gl,"gemini-cli":hl,"grok-build":Rl,"hermes-agent":jl,"kimi-code":zt,openclaw:Zl,opencode:$t,pi:lc};function Ot(I,_,O){let L={...O,cwd:_,environment:I};return pr.map((J)=>th(nh[J](L)))}function th(I){if(I.status==="not-inspected")return{platform:I.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:I.platform,detected:I.status!=="n/a",configured:I.status==="configured",inspectionStatus:I.status!=="n/a"?"verified":I.errors&&I.errors.length>0?"failed":"not-applicable",method:I.method,configPath:I.configPath,configPaths:I.configPaths,errors:I.errors}}import{join as rh}from"node:path";var oh=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),ih=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),safety:Object.freeze({}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),sh={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function cc(I){let _=rh(I.tmpdir,"cc-safety-net-self-test"),O=oh.map((L)=>{let J=M(I,l("self-test",{command:L.command},{kind:"command",shell:"auto"},{configCwd:_,executionCwd:_},L.command),{guard:{dependencies:{loadPolicySnapshot:()=>ih,getModes:()=>sh,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),K=L.expectBlocked?"blocked":"allowed",ne=J.decision.kind==="deny"?"blocked":"allowed";return{command:L.command,description:L.description,expected:K,actual:ne,passed:K===ne,reason:J.decision.kind==="deny"?J.decision.reason:void 0,ruleId:J.decision.kind==="deny"?J.decision.ruleId:void 0}});return{passed:O.filter((L)=>L.passed).length,failed:O.filter((L)=>!L.passed).length,total:O.length,results:O}}function Pi(I){let _=gn({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},I);if(Dn(_.errors))return null;return{json:_.flags.json,skipUpdateCheck:_.flags.skipUpdateCheck}}async function dc(I,_={}){let O=await Mt(!_.json,()=>{let L=lh(I,_);return{ready:L,finish:()=>L}},()=>Ht(),{loadingMessage:"Checking system status…"});if(_.json)console.log(JSON.stringify(O,null,2));else ch(O);return O.engineSelfTest.failed>0||O.findings.some((L)=>L.severity==="error")?1:0}async function lh(I,_){let O=_.cwd??process.cwd(),L=await kr((Le)=>$t({environment:I,cwd:O,openCodeVersion:Le}).status!=="n/a",void 0,O),J=Ot(I,O,{ampPluginListOutput:L.ampPluginListOutput,codexPluginListOutput:L.codexPluginListOutput,copilotCliVersion:L.versions["copilot-cli"],openCodeVersion:L.versions.opencode,openCodePluginListOutput:L.openCodePluginListOutput}),K=Ns(I,O),ne=js(I),oe=E(I,{cwd:O}),ue=oe.policy,pe=T(ue,I.env),we=B(ue,pe.capabilities),xe=hr(I,7),Se=ga(I,O),Pe=[yr(O),xt(I)].filter((Le)=>ah(Le)),Ce=_.skipUpdateCheck?{currentVersion:pn(),latestVersion:null,updateAvailable:!1}:await Gn(),en={hooks:J,engineSelfTest:cc(I),userConfig:K.userConfig,projectConfig:K.projectConfig,configState:$e(oe),effectiveRules:K.effectiveRules,environment:ne,effectiveSafety:{selectedPreset:ue.safety.level??"standard",level:pe.effectiveLevel,capabilities:pe.capabilities,ruleOverrides:ue.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(we).filter(([,Le])=>Le.source==="rule_override"&&Le.override==="off"&&Le.inheritedEnabled&&Le.changesInherited).map(([Le])=>Le),ruleCounts:{stored:Object.keys(ue.destructiveCommandRuleOverrides).length,effective:Object.values(we).filter((Le)=>Le.changesInherited).length},...oe.policyScopes?{policyScopes:oe.policyScopes}:{}},...Se.length>0?{v2Leftovers:Se}:{},...Pe.length>0?{legacyConfigs:Pe}:{},posture:Zs(I,K.userConfig.path),activity:xe,update:Ce,system:L};return{...en,findings:Hs(en)}}function ch(I){console.log(),console.log(Us(I.hooks)),console.log(),console.log(Gs(I.engineSelfTest)),console.log(),console.log(Bs(I)),console.log(),console.log(qs(I.environment)),console.log(),console.log(Vs(I)),console.log(),console.log(Js(I.findings)),console.log(),console.log(zs(I.activity)),console.log(),console.log(Ws(I.system)),console.log(),console.log(Ks(I.update)),console.log(Ys(I))}import{existsSync as dh}from"node:fs";var uh=/^[A-Za-z0-9_@%+=:,./-]+$/,uc="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function Ei(I){let _=gn({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},I);if(Dn(_.errors))return console.error(uc),console.error("Pass -- before a command that starts with dashes."),null;if(_.values.cwd!==void 0&&!dh(_.values.cwd))return console.error(`Error: --cwd path does not exist: ${_.values.cwd}`),null;let O=_.positionals.length===1?_.positionals[0]:_.positionals.map((L)=>uh.test(L)?L:`'${L.replaceAll("'","'\\''")}'`).join(" ");if(!O)return console.error("Error: No command provided"),console.error(uc),null;return{json:_.flags.json,cwd:_.values.cwd,command:O}}function pc(I){if(I)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function fc(I,_){let L=_-18;return[`${I.dtl}${I.dh.repeat(_)}${I.dtr}`,`${I.dv}  Command Analysis${" ".repeat(L)}${I.dv}`,`${I.dbl}${I.dh.repeat(_)}${I.dbr}`]}function Ai(I){return JSON.stringify(I)}function mc(I,_=0){return`[${I.map((L,J)=>Ms(L,J,_)).join(",")}]`}function Zt(I,_,O=70){let L=I.split(" "),J=[],K="";for(let ne of L)if(K&&K.length+ne.length+1>O)J.push(K),K=ne;else K=K?`${K} ${ne}`:ne;if(K)J.push(K);return J.map((ne,oe)=>oe===0?ne:`${_}${ne}`)}function gc(I,_,O){let L=[];switch(I.type){case"parse":return null;case"env-strip":return L.push(""),L.push(`STEP ${_} ${O.h} Strip environment variables`),L.push(`  Removed: ${I.envVars.map((J)=>`${J}=<redacted>`).join(", ")}`),L.push(`  Tokens:  ${Ai(I.output)}`),{lines:L,incrementStep:!0};case"leading-tokens-stripped":return L.push(""),L.push(`STEP ${_} ${O.h} Strip wrappers`),L.push(`  Removed: ${I.removed.join(", ")}`),L.push(`  Tokens:  ${Ai(I.output)}`),{lines:L,incrementStep:!0};case"shell-wrapper":return L.push(""),L.push(`STEP ${_} ${O.h} Detect shell wrapper`),L.push(`  Wrapper: ${I.wrapper} -c`),L.push(`  Inner:   ${I.innerCommand}`),{lines:L,incrementStep:!0};case"interpreter":{if(L.push(""),L.push(`STEP ${_} ${O.h} Detect interpreter`),L.push(`  Interpreter: ${I.interpreter}`),L.push(`  Code:        ${I.codeArg}`),I.paranoidBlocked)L.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:L,incrementStep:!0}}case"busybox":return L.push(""),L.push(`STEP ${_} ${O.h} Busybox wrapper`),L.push(`  Subcommand: ${I.subcommand}`),{lines:L,incrementStep:!0};case"transparent-wrapper":return L.push(""),L.push(`STEP ${_} ${O.h} Transparent wrapper`),L.push(`  Wrapper: ${I.wrapper}`),L.push(`  Tokens:  ${Ai(I.output)}`),{lines:L,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(L.push(""),L.push(`STEP ${_} ${O.h} Match rules`),L.push(`  Rule:   ${I.rule}()`),I.matched)L.push("  Result: MATCHED");else L.push("  Result: No match");return{lines:L,incrementStep:!0}}case"worktree-relaxation":return L.push(""),L.push(`STEP ${_} ${O.h} Worktree relaxation`),L.push(`  Mode:   ${n.worktree.name}`),L.push(`  Git cwd: ${I.gitCwd}`),L.push("  Result: Allowed local discard in linked worktree"),{lines:L,incrementStep:!0};case"temp-root-relaxation":return L.push(""),L.push(`STEP ${_} ${O.h} Temp-root relaxation`),L.push(`  Git cwd: ${I.gitCwd}`),L.push("  Result: Allowed git discard in a temp-root repository"),{lines:L,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(I.embeddedCommandFound)return L.push(""),L.push(`STEP ${_} ${O.h} Fallback scan`),L.push(`  Found: ${I.embeddedCommandFound}`),{lines:L,incrementStep:!0};return null}case"custom-rules-check":{if(I.rulesChecked){if(L.push(""),L.push(`STEP ${_} ${O.h} Custom rules`),I.matched)L.push("  Result: MATCHED");else L.push("  Result: No match");return{lines:L,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(I.matched)return L.push(""),L.push(`STEP ${_} ${O.h} Dangerous text check`),L.push(`  Token:  ${I.token}`),L.push("  Result: MATCHED"),{lines:L,incrementStep:!0};return null}case"strict-unparseable":return L.push(""),L.push(`STEP ${_} ${O.h} Strict mode check`),L.push(`  Command: ${I.rawCommand}`),L.push("  Result:  ✗ UNPARSEABLE"),{lines:L,incrementStep:!0};case"segment-skipped":return null;case"error":return L.push(""),L.push(`ERROR: ${I.message}`),{lines:L,incrementStep:!1};default:return I}}function Ii(I,_){let O=pc(_?.asciiOnly??!1),L=58,J=[],K=1;J.push(...fc(O,58)),J.push("");let ne=I.trace.steps.find((Ce)=>Ce.type==="error");if(ne&&ne.type==="error"){J.push("ERROR"),J.push(`  ${ne.message}`),J.push(""),J.push("RESULT"),J.push(`  Status: ${I.result==="blocked"?nn.red("BLOCKED"):nn.green("ALLOWED")}`),J.push(""),J.push("CONFIG");let Ce=I.configSource??"none";return J.push(`  Path: ${Ce}`),J.join(`
`)}let oe=I.trace.steps.find((Ce)=>Ce.type==="parse");if(oe&&oe.type==="parse"){J.push("INPUT"),J.push(`  ${oe.input}`),J.push(""),J.push(`STEP ${K} ${O.h} Split shell commands`),K++;for(let Ce=0;Ce<oe.segments.length;Ce++){let en=oe.segments[Ce];if(en){let Le=Math.random();J.push(`  Segment ${Ce+1}: ${mc(en,Le)}`)}}}let ue=I.trace.segments,pe=ue.length>1;for(let Ce of ue){if(pe){J.push("");let on="";if(oe&&oe.type==="parse"){let bo=oe.segments[Ce.index];if(bo)on=bo.join(" ")}let sn=54,an=on,rn=` Segment ${Ce.index+1}: `,fn=" ";if(on){if(rn.length+on.length+fn.length>sn){let Zu=sn-rn.length-fn.length;an=`${on.substring(0,Zu-1)}…`}}let On=on?`${rn}${an}${fn}`:` Segment ${Ce.index+1} `,Wu=on?`${rn}${nn.cyan(an)}${fn}`:On,ps=58-On.length,fs=Math.floor(ps/2),Yu=ps-fs;J.push(`${O.sh.repeat(fs)}${Wu}${O.sh.repeat(Yu)}`)}if(Ce.steps.find((on)=>on.type==="segment-skipped")){J.push(""),J.push("  (skipped — prior segment blocked)");continue}let Le=!1,Ve=!1;for(let on of Ce.steps){let sn=gc(on,K,O);if(sn){if(Ve=!0,on.type==="recurse"){J.push("");let an=" RECURSING ",rn=58-an.length-4;J.push(`  ${O.tl}${O.h}${an}${O.h.repeat(rn)}`),J.push(`  ${O.v}`),Le=!0;continue}for(let an of sn.lines)if(Le)J.push(`  ${O.v} ${an}`);else J.push(an);if(sn.incrementStep)K++}}if(Le)J.push(`  ${O.v}`),J.push(`  ${O.bl}${O.h.repeat(56)}`);if(!Ve)J.push(""),J.push(`  ${nn.green("✓")} Allowed (no matching rules)`)}if(J.push(""),J.push("RESULT"),I.result==="blocked"){if(J.push(`  Status: ${nn.red("BLOCKED")}`),I.customRule){if(J.push(`  Rule: ${I.customRule.id}`),I.customRule.rulebook)J.push(`  Rulebook: ${I.customRule.rulebook.name} ${I.customRule.rulebook.version}`);if(I.customRule.source)J.push(`  Source: ${I.customRule.source}`);if(I.customRule.override)J.push(`  Override: reason ${I.customRule.override.reason}`)}if(I.reason){let Ce=Zt(I.reason,"          ");J.push(`  Reason: ${Ce[0]}`);for(let en=1;en<Ce.length;en++)J.push(Ce[en]??"")}}else J.push(`  Status: ${nn.green("ALLOWED")}`);J.push(""),J.push("CONFIG");let we=I.configSource??"none",xe=I.configValid?"":" (invalid)";J.push(`  Path: ${we}${xe}`);let Se=I.safetyPresetScope;J.push(`  Safety preset: ${I.selectedPreset??"standard"}${Se?` (${vr(Se)})`:""}`),J.push(`  Effective capabilities: ${I.effectiveLevel}`);let Pe=Object.entries(I.destructiveCommandRuleOverrides??{});if(J.push(`  Rule customizations: ${Pe.length}`),I.ruleActivation)J.push(`  Rule activation: ${I.ruleActivation.id} — ${I.ruleActivation.enabled?"on":"off"} via ${I.ruleActivation.source}`);return J.join(`
`)}function _i(I){return JSON.stringify(I,null,2)}import{resolve as hh}from"node:path";var ph=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function hc(I){let _=0,O={allocateSegment(){return _++},getNextSegmentIndex(){return _},recordGlobal(L){I.record({kind:"step",scope:"global",step:L})},recordSegment(L,J=O.currentSegmentIndex){if(J===void 0)return;I.record({kind:"step",scope:"segment",segmentIndex:J,step:L})}};return O}function yc(I={}){let _=[],O=I.maxEvents??512,L={maxTextLength:I.maxTextLength??2048,maxListLength:I.maxListLength??128,maxObjectProperties:I.maxObjectProperties??I.maxListLength??128,maxDepth:I.maxDepth??16},J,K=new Set;return{record(ne){if(J)return;if(!ne||_.length>=O)return;try{_.push(Oi(fh(ne,L,K)))}catch{}},finish(){if(J)return J;return J=Oi({events:Object.freeze(_)}),J}}}function fh(I,_,O){if(I.kind!=="step")throw TypeError("invalid trace event");let{scope:L,step:J}=I;Kr(J,O,_);let K=Ti(J,_,O);if(L==="global")return{kind:"step",scope:"global",step:K};if(L!=="segment")throw TypeError("invalid trace event scope");return{kind:"step",scope:"segment",segmentIndex:I.segmentIndex,step:K}}function Kr(I,_,O,L=0,J=new WeakSet){if(typeof I==="string"){let oe=I.slice(0,O.maxTextLength);if(!Be(oe))return;for(let ue of tt(oe))for(let pe of ue.match(/[^\s"'()$]+/g)??[])_.add(vc(pe));return}if(!I||typeof I!=="object"||L>=O.maxDepth||J.has(I))return;if(J.add(I),Array.isArray(I)){let oe=Math.min(I.length,O.maxListLength);for(let ue=0;ue<oe;ue++)Kr(I[ue],_,O,L+1,J);return}let K=0,ne=new Set;for(let oe in I){if(!Object.hasOwn(I,oe))continue;if(K>=O.maxObjectProperties)break;K++,Kr(oe,_,O);let ue=$i(oe,O,_);if(ne.has(ue))continue;ne.add(ue),Kr(I[oe],_,O,L+1,J)}}function Ti(I,_,O,L=0,J=new WeakSet){if(typeof I==="string")return $i(I,_,O);if(!I||typeof I!=="object")return I;if(L>=_.maxDepth)return;if(J.has(I))return;if(J.add(I),Array.isArray(I)){let oe=[],ue=Math.min(I.length,_.maxListLength);for(let pe=0;pe<ue;pe++)oe.push(Ti(I[pe],_,O,L+1,J));return oe}let K={},ne=0;for(let oe in I){if(!Object.hasOwn(I,oe))continue;if(ne>=_.maxObjectProperties)break;ne++;let ue=$i(oe,_,O);if(Object.hasOwn(K,ue))continue;Object.defineProperty(K,ue,{value:Ti(I[oe],_,O,L+1,J),enumerable:!0,configurable:!0,writable:!0})}return K}function $i(I,_,O){let L=I.slice(0,_.maxTextLength),J=Be(L)?We(L):L,K=O.size>0?gh(J,O):J;return(mh(K)?_e(K):K).slice(0,_.maxTextLength)}function mh(I){return I.includes("PRIVATE KEY")||I.includes("://")||I.includes("eyJ")||I.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(I)||I.length>=14&&ph.some((_)=>I.includes(_))||I.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(I)}function gh(I,_){return I.replace(/[^\s"'()$]+/g,(O)=>_.has(vc(O))?"<redacted>":O)}function vc(I){let _=2166136261,O=2166136261;for(let L=0;L<I.length;L++)_=Math.imul(_^I.charCodeAt(L),16777619),O=Math.imul(O^I.charCodeAt(I.length-L-1),16777619);return`${_>>>0}:${O>>>0}:${I.length}`}function Oi(I){if(I&&typeof I==="object"&&!Object.isFrozen(I)){for(let _ of Object.values(I))Oi(_);Object.freeze(I)}return I}function Xt(I,_={},O){let L=hh(_.cwd??process.cwd()),J=_.policySnapshot??E(O,{cwd:L,userConfigDir:_.userConfigDir}),K=T(J.policy,O.env),ne=je({policySnapshot:J,effectiveCapabilities:K.capabilities,strict:K.strict,paranoidRm:K.paranoidRm,paranoidInterpreters:K.paranoidInterpreters,worktreeMode:K.worktreeMode}),oe={effectiveLevel:ne.effectiveLevel,selectedPreset:J.policy.safety.level??"standard",...J.policyScopes?{safetyPresetScope:J.policyScopes.levelScope}:{},effectiveCapabilities:ne.effectiveCapabilities,destructiveCommandRuleOverrides:J.policy.destructiveCommandRuleOverrides},{configSource:ue,configValid:pe}=vh(O,{cwd:L,userConfigDir:_.userConfigDir});if(!I||!I.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:ue,configValid:pe,...oe};let we=h(I,"auto");if(we.status==="limited")throw new y;let xe=we.dialect==="powershell"?h(I,"posix"):we,Se=ut(xe),Pe=yc(),Ce=hc(Pe);Ce.recordGlobal({type:"parse",input:I,segments:Se.map((On)=>[...On])});let en=l("Bash",{command:I},{kind:"command",shell:"auto"},{configCwd:L,executionCwd:L},I),Le=V(en,{environment:O,trace:Ce,dependencies:{loadPolicySnapshot:()=>J}}),Ve=Le.decision.kind==="deny"?Le.decision:null;if(Ve&&(Le.stage==="policy-protection"||Le.stage==="secret-protection"))return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:yh(Ve),matched:!0,reason:Ve.reason}]}]},result:"blocked",reason:R(Ve.reason),segment:R(bc(Ve,I)),ruleId:R(Ve.ruleId),configSource:ue,configValid:pe,...oe};let on=Ce.getNextSegmentIndex();if(Ve&&on>0&&on<Se.length)Ce.recordSegment({type:"segment-skipped",index:on,reason:"prior-segment-blocked"},on);let sn=Pe.finish(),an=Ve?.ruleId??bh(en,J,K,O),rn=W.find((On)=>On.id===an&&On.activationCapability),fn=rn?ne.policy.effectiveDestructiveCommandRules[rn.id]:void 0;return{trace:kh(sn),result:Ve?"blocked":"allowed",reason:Ve?R(Ve.reason):void 0,segment:Ve?R(bc(Ve,I)):void 0,ruleId:Ve?R(Ve.ruleId):void 0,customRule:wh(xh(Ve?.ruleId,J)),configSource:ue,configValid:pe,...oe,...rn&&fn?{ruleActivation:{id:rn.id,...fn}}:{}}}function bc(I,_){return I.evidence?.segment??_}function yh(I){if(I.reason===Ge)return"policy-protection:findPolicyConfigMutationTargetInSemanticFacts";if(I.reason===Ue)return"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts";if(I.reason===k)return"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts";return"secret-protection:findSensitiveTargetInSemanticFacts"}function vh(I,_){let O=U(_.cwd),L=G(I,_),J=Z(I,{cwd:_.cwd,userConfigDir:_.userConfigDir});try{if(r(J.projectConfigTarget)!==null){if(Un(J.projectConfigTarget).errors.length===0)return{configSource:O,configValid:!0};return{configSource:O,configValid:!1}}}catch(K){if(K instanceof o)return{configSource:O,configValid:!1};throw K}try{if(r(J.userConfigTarget)!==null){let K=Un(J.userConfigTarget);return{configSource:L,configValid:K.errors.length===0}}return{configSource:null,configValid:!0}}catch(K){if(K instanceof o)return{configSource:L,configValid:!1};throw K}}function bh(I,_,O,L){let J=_.policy,K=Te({...J,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...J.destructiveCommandRuleOverrides,...Object.fromEntries(W.flatMap((oe)=>oe.activationCapability?[[oe.id,"on"]]:[]))}},_.state==="degraded"?{diagnostics:_.diagnostics,reason:_.reason}:void 0),ne=V(I,{environment:L,dependencies:{loadPolicySnapshot:()=>K,getModes:()=>({...O,strict:!0,paranoidRm:!0,paranoidInterpreters:!0}),findSensitiveTarget:()=>null}});return ne.decision.kind==="deny"?ne.decision.ruleId:void 0}function wh(I){if(!I)return;return{id:R(I.id),...I.rulebook?{rulebook:{name:R(I.rulebook.name),version:R(I.rulebook.version)}}:{},...I.source?{source:R(I.source)}:{},...I.override?{override:{type:"reason",reason:R(I.override.reason)}}:{}}}function kh(I){let _=I.events.flatMap((L)=>L.kind==="step"&&L.scope==="global"?[L.step]:[]),O=new Map;for(let L of I.events){if(L.kind!=="step"||L.scope!=="segment")continue;let J=O.get(L.segmentIndex)??{index:L.segmentIndex,steps:[]};J.steps.push(L.step),O.set(L.segmentIndex,J)}return{steps:_,segments:[...O.values()]}}function xh(I,_){let O=I?.replace(/^custom\./,"");if(!O||!_.policy.rules.some((L)=>L.name===O))return;return _.ruleMetadata[O]??Object.freeze({id:O})}function wc(I){return new Promise((_)=>{process.stdout.write(`${I}
`,()=>_())})}async function kc(I,_){let O=Ei(_);if(!O)return 1;try{let L=Xt(O.command,{cwd:O.cwd},I),J=!!process.env.NO_COLOR||!process.stdout.isTTY;return await wc(O.json?_i(L):Ii(L,{asciiOnly:J})),0}catch(L){let J=Ch(L instanceof p?L.cause:L);if(J===void 0)throw L;if(O.json)return await wc(JSON.stringify({error:J})),1;return console.error(J),1}}function Ch(I){if(I instanceof y)return I.message;if(I instanceof f)return I.message;if(I instanceof s&&a[I.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var xc="2.5.2",An="  ",pt="cc-safety-net";function Cc(I){return I.argument?`${I.flags} ${I.argument}`:I.flags}function Sh(I){return Math.max(...I.map((_)=>Cc(_).length))}function Rh(I){return Math.max(...I.map((_)=>_.usage.length))}function Ph(I){return Math.max(...I.map((_)=>`${pt} ${_.usage}`.length))}function Eh(I,_){let O=`${pt} ${I.usage}`;return`${An}${O.padEnd(_+2)}${I.description}`}function Tn(I,_){return`${An}${I.padEnd(Math.max(40,I.length+2))}${_}`}function Dt(I,_=console.log){let O=[];if(O.push(`${pt} ${I.name}`),O.push(""),O.push(`${An}${I.description}`),O.push(""),O.push("USAGE:"),O.push(`${An}${pt} ${I.usage}`),O.push(""),I.subcommands&&I.subcommands.length>0){O.push("SUBCOMMANDS:");let L=Rh(I.subcommands);for(let J of I.subcommands)O.push(`${An}${J.usage.padEnd(L+2)}${J.description}`);O.push("")}if(I.options.length>0){O.push("OPTIONS:");let L=Sh(I.options);for(let J of I.options){let K=Cc(J),ne=J.default?`${J.description} (default: ${J.default})`:J.description;O.push(`${An}${K.padEnd(L+2)}${ne}`)}O.push("")}if(I.examples&&I.examples.length>0){O.push("EXAMPLES:");for(let L of I.examples)O.push(`${An}${L}`)}_(O.join(`
`))}function Di(){let I=Ph(mr),_=[];_.push(`${pt} v${xc}`),_.push(""),_.push("Blocks destructive commands and secret access."),_.push(""),_.push("COMMANDS:");for(let O of mr)_.push(Eh(O,I));_.push(""),_.push("GLOBAL OPTIONS:"),_.push(`${An}-h, --help       Show help (use with command for command-specific help)`),_.push(`${An}-V, --version    Show version`),_.push(""),_.push("HELP:"),_.push(`${An}${pt} help <command>     Show help for a specific command`),_.push(`${An}${pt} <command> --help   Show help for a specific command`),_.push(""),_.push("ENVIRONMENT VARIABLES:"),_.push(Tn(`${n.level.name}=standard|strict|paranoid`,"Set session safety level")),_.push(Tn(`${n.worktree.name}=1`,"Allow local git discards in linked worktrees")),_.push(Tn(`${n.debug.name}=1`,"Print diagnostic messages to stderr")),_.push(Tn(`${n.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),_.push(Tn(`${n.projectTightenOnly.name}=1`,"Ignore project policy settings that weaken the user policy")),_.push(Tn("CC_SAFETY_NET_HOME","Override rule config home directory")),_.push(""),_.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),_.push(Tn(`${n.strict.name}=1`,"Force safety.overrides.fail_closed on")),_.push(Tn(`${n.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),_.push(Tn(`${n.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),_.push(Tn(`${n.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),_.push(""),_.push("Documentation:        https://ccsafetynet.com/docs"),console.log(_.join(`
`))}function Sc(){console.log(xc)}function Qt(I,_=console.log){let O=gr(I);if(!O)return!1;if(O.name.toLowerCase()!==I.toLowerCase())return!1;return Dt(O,_),!0}import{existsSync as to,readFileSync as _d}from"node:fs";import{join as no}from"node:path";import*as qn from"node:readline";function Ah(I){return I==="install"?"Install":"Uninstall"}function Ih(I){return I==="install"?"Installing":"Uninstalling"}function _h(I){return I==="install"?"into":"from"}function Ec(I){return I?.available===!0}function Th(I,_){let O=new Set(_);return I.filter((L)=>O.has(L.target)).map((L)=>L.target)}function Rc(I,_,O){if(I.every((L)=>!L.available))return _;return Array.from({length:I.length},(L,J)=>J+1).map((L)=>(_+L*O+I.length)%I.length).find((L)=>Ec(I[L]))}function $h(I,_,O){if(O.ctrl&&O.name==="c")return"interrupt";if(O.name==="escape"||_==="q")return"abort";if(I==="install"&&(_==="u"||_==="U"))return"update";if(O.name==="up"||_==="k")return"up";if(O.name==="down"||_==="j")return"down";if(O.name==="space"||_===" ")return"toggle";if(O.name==="return"||O.name==="enter")return"confirm";return null}function Oh(I){return{cursor:I.findIndex((_)=>_.available),selected:[]}}function Dh(I,_,O){if(O==="confirm"||O==="update"||O==="abort"||O==="interrupt")return{state:I,done:O};if(O==="up")return{state:{...I,cursor:Rc(_,I.cursor,-1)}};if(O==="down")return{state:{...I,cursor:Rc(_,I.cursor,1)}};let L=_[I.cursor];if(!Ec(L))return{state:I};let J=I.selected.includes(L.target)?I.selected.filter((K)=>K!==L.target):Th(_,[...I.selected,L.target]);return{state:{...I,selected:J}}}var Ac="◉",Ic="◯",_c=">",Tc=" ";function Lh(I,_,O){return["",`${Ah(I)} CC Safety Net ${_h(I)}:`,"",..._.map((L,J)=>{let K=O.selected.includes(L.target),ne=J===O.cursor,oe=K?Ac:Ic,ue=ne?_c:Tc,pe=L.available?"":` (${L.unavailableReason??"not installed"})`,we=`${oe} ${L.label}${pe}`,xe=!L.available?nn.dim(we):K?nn.green(we):ne?nn.bold(we):we;return`${ue} ${xe}`}),"",I==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":_.some((L)=>L.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${I}. q/Esc: close`].join(`
`)}var Pc=["global-hook","plugin"];function Nh(I,_,O={}){let L=O.color!==!1?nn.bold:(K)=>K;return["","Install the Kimi Code integration as:","",...[`Global hook — ${_?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((K,ne)=>{let oe=ne===I,ue=`${oe?Ac:Ic} ${K}`;return`${oe?_c:Tc} ${oe?L(ue):ue}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function $c(I){let{input:_,output:O}=I;qn.emitKeypressEvents(_);let L=_.isRaw===!0;_.setRawMode(!0),_.resume();let J=0,K=()=>{if(J===0)return;qn.moveCursor(O,0,-J),qn.cursorTo(O,0),qn.clearScreenDown(O)},ne=()=>{K();let oe=I.render();O.write(`${oe}
`),J=oe.split(`
`).length};return new Promise((oe)=>{let ue=(we)=>{_.off("keypress",pe),_.setRawMode(L),_.pause(),K(),oe(we)};function pe(we,xe){I.onKey(we,xe,{finish:ue,draw:ne})}_.on("keypress",pe),ne()})}function Oc(I={}){let _=0;return $c({input:I.input??process.stdin,output:I.output??process.stdout,render:()=>Nh(_,I.globalHookInstalled===!0),onKey:(O,L,J)=>{if(L.ctrl&&L.name==="c"){J.finish(null),(I.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(L.name==="escape"||O==="q")return J.finish(null);if(L.name==="return"||L.name==="enter")return J.finish(Pc[_]);if(L.name==="up"||L.name==="down"||O==="k"||O==="j")_=(_+1)%Pc.length,J.draw()}})}function Li(I=process.stdin,_=process.stdout){return Boolean(I.isTTY&&_.isTTY&&typeof I.setRawMode==="function")}function Dc(I,_,O={}){let L=O.output??process.stdout,J=Oh(_);return $c({input:O.input??process.stdin,output:L,render:()=>Lh(I,_,J),onKey:(K,ne,oe)=>{let ue=$h(I,K,ne);if(!ue)return;let pe=Dh(J,_,ue);if(J=pe.state,pe.done==="interrupt"){oe.finish(null),(O.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(pe.done==="abort")return oe.finish(null);if(pe.done==="update")return oe.finish("update");if(pe.done==="confirm"){if(J.selected.length===0){L.write("\x07"),oe.draw();return}oe.finish([...J.selected]),L.write(`${Ih(I)} selected integrations...
`);return}oe.draw()}})}import{existsSync as Lc,lstatSync as Fh,mkdirSync as Hh,mkdtempSync as Mh,readdirSync as Uh,readFileSync as Nt,rmSync as Yr}from"node:fs";import{basename as Gh,dirname as Bh,join as Cn}from"node:path";import{fileURLToPath as qh}from"node:url";var Ni="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",ft="cc-safety-net",mt="cc-safety-net/index.ts";import{spawn as jh}from"node:child_process";var ji=(I,_)=>{let O=Wn([...I],process.env);return new Promise((L)=>{let J=jh(O.cmd,O.args,{cwd:_,stdio:["ignore","pipe","pipe"]}),K=ui(J),ne=!1,oe=setTimeout(()=>{ne=!0,J.kill()},120000);J.on("error",(ue)=>{clearTimeout(oe),L({status:null,errorCode:ue.code,stdout:K.stdout,stderr:[ue.message,K.stderr].filter(Boolean).join(`
`)})}),J.on("close",(ue)=>{clearTimeout(oe),L({status:ne?null:ue,errorCode:ne?"ETIMEDOUT":void 0,stdout:K.stdout,stderr:K.stderr})})})};var Lt="cc-safety-net.ts",Fi=Cn("amp",mt);function Vh(I){return Cn(I.home,".config","amp","plugins","cc-safety-net.ts")}function Jh(){let I=Bh(qh(import.meta.url)),_=Cn(I,Fi),O=Cn(I,"..",Fi),L=Cn(I,"..","..","..","dist",Fi);return[_,O,L]}function zh(I=Jh()){let _=I.find((O)=>Lc(O)&&Fh(O).isFile());if(!_)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return _}function Nc(I){try{return JSON.parse(I)}catch{return}}function Zr(I){return I.subarray(0,Buffer.byteLength(Ni)).toString("utf-8")===Ni}async function er(I,_,O){let L=await I(_,O);if(L.status===0)return L;throw Error([`Failed to run ${_.join(" ")}${L.status===null?"":` (exit ${L.status})`}.`,[L.stdout,L.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function jc(I){let _=await I(["amp","plugins","repositories","--json"]);if(_.status===null)throw Error(`${_.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${_.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${_.stderr}`.trim());if(_.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${_.status}). Sign in with "amp login" and rerun install --amp.
${[_.stdout,_.stderr].filter(Boolean).join(`
`)}`.trim());let O=Nc(_.stdout),L=(Array.isArray(O)?O:[]).filter((J)=>tn(J,"scope")==="user"&&tn(J,"exists")===!0&&tn(J,"viewerCanWrite")===!0).map((J)=>tn(J,"cloneRef")).find((J)=>typeof J==="string"&&J.length>0);if(!L)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return L}async function Fc(I,_,O){let L=Mh(Cn(_.tmpdir,"cc-safety-net-amp-"));try{return await er(I,["amp","clone","user-plugins",L]),await O(L)}finally{Yr(L,{recursive:!0,force:!0})}}function Hi(I){return`rerun ${I==="overwrite"?"install":"uninstall"} --amp`}function Hc(I,_,O){let L=Cn(I,_),J=dn(L);if(!J)return;if(J.isSymbolicLink()||!J.isFile())throw Error(`Refusing to ${O} ${_} in your Amp personal plugins repository: not a regular file. Remove it there and ${Hi(O)}.`);let K=Nt(L);if(Zr(K))return K;throw Error(`Refusing to ${O} unmanaged file ${_} in your Amp personal plugins repository. Remove it there and ${Hi(O)}.`)}function Mc(I,_){let O=Cn(I,ft),L=dn(O);if(!L)return;if(L.isSymbolicLink()||!L.isDirectory())throw Error(`Refusing to ${_} ${ft} in your Amp personal plugins repository: not a regular directory. Remove it there and ${Hi(_)}.`);return Hc(I,mt,_)}function Kh(I){let _=Cn(I,Lt),O=dn(_);if(!O||O.isSymbolicLink()||!O.isFile())return;let L=Nt(_);return Zr(L)?L:void 0}async function Uc(I,_,O,L){if(await er(I,O,_),(await er(I,["git","status","--porcelain"],_)).stdout.trim()==="")return!1;return await er(I,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",L],_),await er(I,["git","push","origin","HEAD"],_),!0}function Wr(I,_){Wh(I,_),Yh(I,_)}function Gc(I,_){if(_==="keep")return;throw Error(`Local Amp plugin ${I} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function Wh(I,_){let O=Vh(I),L=dn(O);if(!L)return;if(!L.isSymbolicLink()&&L.isFile()&&Zr(Nt(O))){Yr(O);return}Gc(O,_)}function Yh(I,_){let O=Cn(I.home,".config","amp","plugins",ft),L=dn(O);if(!L)return;if(!L.isSymbolicLink()&&L.isDirectory()&&Zh(O)){Yr(O,{recursive:!0});return}Gc(O,_)}function Zh(I){let _=Gh(mt);if(Uh(I).join("\x00")!==_)return!1;let O=Cn(I,_),L=dn(O);return!!L&&!L.isSymbolicLink()&&L.isFile()&&Zr(Nt(O))}function Xh(I){let _=d(I);if(!Lc(_))return"";let O=Nc(Nt(_,"utf-8"));if(!O||typeof O!=="object"||Array.isArray(O))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(C(O,I.home))};
`}async function Bc(I,_=zh(),O=ji){let L=Buffer.concat([Nt(_),Buffer.from(Xh(I),"utf-8")]),J=await jc(O);return Fc(O,I,async(K)=>{let ne=`${J}/${ft}`,oe=Mc(K,"overwrite"),ue=Hc(K,Lt,"overwrite");if(oe?.equals(L)&&!ue)return Wr(I,"fail"),{path:ne,alreadyInstalled:!0};if(Hh(Cn(K,ft),{recursive:!0}),cn(Cn(K,mt),L),ue)Yr(Cn(K,Lt));let pe=await Uc(O,K,["git","add","--",mt,...ue?[Lt]:[]],`chore: update cc-safety-net plugin to v${pn()}`);return Wr(I,"fail"),{path:ne,alreadyInstalled:!pe}})}async function qc(I,_=ji){let O=await jc(_);return Fc(_,I,async(L)=>{let J=Mc(L,"remove"),K=Kh(L),ne=`${O}/${K&&!J?Lt:ft}`;if(!J&&!K)return Wr(I,"keep"),{path:ne,alreadyInstalled:!1};return await Uc(_,L,["git","rm","--",...J?[mt]:[],...K?[Lt]:[]],`chore: remove cc-safety-net plugin v${pn()}`),Wr(I,"keep"),{path:ne,alreadyInstalled:!0}})}import{existsSync as Vc,mkdirSync as Qh,readFileSync as ey}from"node:fs";import{dirname as ny}from"node:path";var Mi=xn["antigravity-cli"],gt="cc-safety-net";function ht(I){return Boolean(I)&&typeof I==="object"&&!Array.isArray(I)}function Qr(){return{PreToolUse:[{hooks:[{type:"command",command:Mi,timeout:30}]}]}}function Jc(I){try{let _=JSON.parse(ey(I,"utf-8"));if(!_||typeof _!=="object"||Array.isArray(_))throw Error("Antigravity hooks config must be a JSON object");return _}catch(_){if(_ instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${I}: ${_.message}`);throw _}}function zc(I){let _=I[gt];if(_===void 0){let L=Qr();return I[gt]=L,{definition:L,preToolUse:L.PreToolUse??[]}}if(!ht(_))throw Error(`Antigravity hooks config entry "${gt}" must be an object`);let O=Array.isArray(_.PreToolUse)?_.PreToolUse:[];return _.PreToolUse=O,{definition:_,preToolUse:O}}function Kc(I){if(!Array.isArray(I.PreToolUse))return!1;return I.PreToolUse.some((_)=>ht(_)&&Array.isArray(_.hooks)&&_.hooks.some((O)=>ht(O)&&O.command===Mi))}function ty(I){return Object.values(I).some((_)=>ht(_)&&_.enabled!==!1&&Kc(_))}function ry(I){if(I[gt]===void 0)return!1;let _=zc(I);if(_.definition.enabled!==!1||!Kc(_.definition))return!1;return _.definition.enabled=!0,!0}function oy(I){if(I[gt]===void 0){I[gt]=Qr();return}let _=zc(I);_.definition.enabled=!0,_.preToolUse.push(Qr().PreToolUse?.[0]??{hooks:[]})}function iy(I){let _=!1;for(let O of Object.values(I)){if(!ht(O)||!Array.isArray(O.PreToolUse))continue;O.PreToolUse=O.PreToolUse.flatMap((L)=>{if(!ht(L)||!Array.isArray(L.hooks))return[L];let J=L.hooks.filter((K)=>!ht(K)||K.command!==Mi);if(J.length!==L.hooks.length)_=!0;return J.length===0?[]:[{...L,hooks:J}]})}return _}function Xr(I,_){cn(I,`${JSON.stringify(_,null,2)}
`)}function Wc(I){let _=Ut(I.home);if(Qh(ny(_),{recursive:!0}),!Vc(_))return Xr(_,{[gt]:Qr()}),{path:_,alreadyInstalled:!1};let O=Jc(_);if(ty(O))return{path:_,alreadyInstalled:!0};if(ry(O))return Xr(_,O),{path:_,alreadyInstalled:!1};return oy(O),Xr(_,O),{path:_,alreadyInstalled:!1}}function Yc(I){let _=Ut(I.home);if(!Vc(_))return{path:_,alreadyInstalled:!1};let O=Jc(_);if(!iy(O))return{path:_,alreadyInstalled:!1};return Xr(_,O),{path:_,alreadyInstalled:!0}}import{existsSync as Bi,readlinkSync as ly}from"node:fs";import{join as Vn}from"node:path";import{spawn as sy}from"node:child_process";var $n=En.map((I)=>({target:I.id,flag:I.flag,label:mn(I.id),probeCommand:I.probeCommand}));function Ui(I){let _=new Set(I);return $n.map((O)=>O.target).filter((O)=>_.has(O))}async function Zc(I,_){for(let O of I)await _(O)}var ay=5000;function nr(I,_=ay){return new Promise((O)=>{let L=Wn([...I],process.env),J=sy(L.cmd,L.args,{env:process.env,stdio:"ignore"}),K=!1,ne=(ue)=>{if(K)return;K=!0,clearTimeout(oe),O(ue)},oe=setTimeout(()=>{J.kill(),ne(!1)},_);J.on("error",()=>ne(!1)),J.on("close",(ue)=>ne(ue===0))})}function Xc(I=nr,_={}){let O=new Set(_.configuredTargets??[]);return Promise.all($n.map(async(L)=>({target:L.target,flag:L.flag,label:L.label,...ed(_.action,await I(L.probeCommand),O.has(L.target))})))}function Qc(I,_){let O=new Set(_.configuredTargets??[]);return I.map((L)=>({...L,...ed(_.action,L.available,O.has(L.target))}))}function ed(I,_,O){if(I==="uninstall")return O?{available:!0}:{available:!1,unavailableReason:"not installed"};if(I==="install"&&O)return{available:!1,unavailableReason:"already installed"};if(!_)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}var Jn="cc-safety-net",od=["npx","-y","@deepseek-ai/dsh"],nd="DeepSeek Harness",td=["@deepseek-ai","dsh-desktop"],id="Quit DeepSeek Harness Desktop, then run this command again: Desktop plugins can only change while it is closed.",Gi=(I)=>`DeepSeek Harness Desktop is not in its default location, so ${I} ${Jn} from its Plugins page.`,sd=(I,_)=>Bi(Vn(Vo(I),_,"package.json"));function qi(I,_){let O=_.platform??process.platform,L=sd(I,"desktop"),J=O==="darwin"?[Vn(I.home,"Applications"),_.systemApplications??"/Applications"].map((K)=>Vn(K,`${nd}.app`,"Contents","Resources","runtime","cli","bin","dsh")):O==="win32"?[Vn(I.env.get("LOCALAPPDATA")||Vn(I.home,"AppData","Local"),"Programs",nd,"resources","runtime","cli","bin","dsh.cmd")]:[];return{profile:L,cli:L?J.find((K)=>Bi(K)):void 0}}function ad(I,_=process.platform){if(_==="win32")return Bi(Vn(I.env.get("APPDATA")||Vn(I.home,"AppData","Roaming"),...td,"lockfile"));let O=cy(Vn(I.home,"Library","Application Support",...td,"SingletonLock")),L=Number(/-(\d+)$/.exec(O??"")?.[1]);return Number.isInteger(L)&&L>0&&dy(L)}function cy(I){try{return ly(I)}catch{return}}function dy(I){try{return process.kill(I,0),!0}catch(_){return _.code==="EPERM"}}async function ld(I,_={}){let O=qi(I,_);if(O.cli&&ad(I,_.platform))throw Error(id);let L=!O.cli||sd(I,"web")||await(_.probe??nr)(ko),J=[...O.cli?[{profile:"desktop",label:"Desktop",dsh:[O.cli]}]:[],...L?[{profile:"web",label:"web",dsh:od}]:[]];return{commands:J.map((K)=>[...K.dsh,"plugin","--profile",K.profile,"add",`${Jn}@${pn()}`]),afterInstall:async()=>{let K=new Set(Jo(I).filter((oe)=>oe.enabled).map((oe)=>oe.name)),ne=J.filter((oe)=>!K.has(oe.profile));if(ne.length>0)throw Error(`DeepSeek Harness installed ${Jn} in the ${rd(ne)} but did not enable it. Enable it from the Plugins page.`)},message:[`Added ${Jn} to the DeepSeek Harness ${rd(J)}.`,...O.profile&&!O.cli?[Gi("add")]:[]].join(`
`)}}function rd(I){return`${I.map((_)=>_.label).join(" and ")} profile${I.length>1?"s":""}`}function cd(I,_={}){let O=new Set(Jo(I).map((K)=>K.name));if(!O.has("desktop")&&!O.has("web"))throw Error(`${Jn} is not installed in the DeepSeek Harness web or Desktop profile`);let L=O.has("desktop")?qi(I,_).cli:void 0,J=O.has("desktop")&&!L;if(J&&!O.has("web"))throw Error(Gi("remove"));if(L&&ad(I,_.platform))throw Error(id);return{commands:[...L?[[L,"plugin","--profile","desktop","remove",Jn]]:[],...O.has("web")?[[...od,"plugin","--profile","web","remove",Jn]]:[]],...J?{afterUninstall:()=>{throw Error(`Removed ${Jn} from the DeepSeek Harness web profile, but ${Gi("remove")}`)}}:{}}}function dd(I,_,O={}){let L=qi(_,O).cli!==void 0;return I.map((J)=>J.target==="deepseek-harness"&&L?{...J,available:!0,unavailableReason:void 0}:J)}import{existsSync as uy,readdirSync as py,rmSync as fy}from"node:fs";import{join as my}from"node:path";function ud(I,_=process.platform,O){if(!uy(I))return;let L=_==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);py(I).filter((J)=>J!==O&&L.test(J)).forEach((J)=>{fy(my(I,J),{recursive:!0,force:!0})})}import{existsSync as pd,readdirSync as gy,rmSync as hy}from"node:fs";import{join as jt}from"node:path";function eo(I,_=process.platform){let O=jt(I.env.get("npm_config_cache")||(_==="win32"?jt(I.env.get("LOCALAPPDATA")||jt(I.home,"AppData","Local"),"npm-cache"):jt(I.home,".npm")),"_npx");if(!pd(O))return;gy(O).filter((L)=>pd(jt(O,L,"node_modules","cc-safety-net"))).forEach((L)=>{hy(jt(O,L),{recursive:!0,force:!0})})}import{existsSync as vd,mkdirSync as vy,readFileSync as bd}from"node:fs";import{dirname as by,join as yd}from"node:path";function yy(I,_){if(I[_]!=="#")return _;let O=I.indexOf(`
`,_+1);return O===-1?I.length:O+1}function Vi(I,_,O){let L=new RegExp(`^(\\s*)${_}\\s*=\\s*\\[`),J=0;for(let K of I.split(`
`)){if(/^\s*\[/.test(K))return;let ne=L.exec(K);if(ne){let oe=J+ne[0].lastIndexOf("[");return{start:oe,end:Ho(I,oe,{skipComment:yy,...O})}}J+=K.length+1}return}function fd(I,_,O){let L=I.slice(0,_.end).trimEnd(),J=Ia(I,_.end),K=J===""?"     ":`${J}  `,ne=!L.endsWith("[")&&!L.endsWith(",");return`${L}${ne?",":""}
${K}${O}${I.slice(_.end)}`}function md(I,_,O){let L=I.indexOf(O,_.start);if(L===-1||L>_.end)return I;return`${I.slice(0,L)}${I.slice(L+O.length).replace(/^\s*,/,"")}`}function gd(I,_){let O=new RegExp(`^\\s*${_}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),L=I.split(`
`),J=L.findIndex((oe)=>/^\s*\[/.test(oe)),K=J===-1?L:L.slice(0,J),ne=J===-1?[]:L.slice(J);return[...K.filter((oe)=>!O.test(oe)),...ne].join(`
`)}function hd(I,_,O){let L=new RegExp(`^\\s*\\[\\[${_}]]\\s*$`,"m");return I.split(/(?=^\s*\[)/m).filter((J)=>!L.test(J)||!J.includes(O)).join("").trimEnd()}var tr=xn["kimi-code"],Ji=`[[hooks]]
event = "PreToolUse"
command = "${tr}"`,wd=`{ event = "PreToolUse", command = "${tr}" }`,kd={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function xd(I){return yd(I.env.get("KIMI_CODE_HOME")??yd(I.home,".kimi-code"),"config.toml")}function wy(I){let _=Vi(I,"hooks",kd);if(_&&I.slice(_.start+1,_.end).trim())return fd(I,_,wd);let O=gd(I,"hooks").trimEnd();if(O==="")return`${Ji}
`;return`${O}

${Ji}
`}function Cd(I){let _=xd(I);if(vy(by(_),{recursive:!0}),!vd(_))return cn(_,`${Ji}
`),{path:_,alreadyInstalled:!1};let O=bd(_,"utf-8");if(O.includes(tr))return{path:_,alreadyInstalled:!0};return cn(_,wy(O)),{path:_,alreadyInstalled:!1}}function Sd(I){let _=xd(I);if(!vd(_))return{path:_,alreadyInstalled:!1};let O=bd(_,"utf-8");if(!O.includes(tr))return{path:_,alreadyInstalled:!1};let L=Vi(O,"hooks",kd),J=L?md(O,L,wd):`${hd(O,"hooks",tr)}
`;return cn(_,J),{path:_,alreadyInstalled:!0}}var zi="safety-net@cc-marketplace",Rd=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),Pd=new Set(["antigravity-cli","cursor","devin","droid","grok-build","hermes-agent","kimi-code"]);function Ki(I){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(I??"")}function Td(I){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(I??"")}function ky(I){return/^Marketplace `cc-marketplace`\s*$/m.test(I??"")}var $d={"claude-code":{installCommands:(I)=>{let _=Ar(I,"cc-safety-net@cc-marketplace");return{commands:[..._?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...jo(I).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:Ar(I,zi)?[["claude","plugin","uninstall",zi]]:[],update:_}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(I,_)=>{let O=_??await yn(["codex","plugin","list"]),L=Td(O);return{commands:[L||ky(O)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:Ki(O)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:L}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:Ra},"copilot-cli":{installCommands:async()=>{let I=await yn(["copilot","plugin","list"]),_=[...ja(I)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...Fa(I)?[["copilot","plugin","uninstall",Da]]:[]];if(La(I))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",In]],cleanupCommands:_,update:!0};return{commands:[Na(await yn(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",In]],cleanupCommands:_}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(I)=>{let _=ei(I);if(_.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(_.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:mi,installCommands:(I)=>{let _=!to(no(Kt(I),Sn));return{commands:Vl(),afterInstall:()=>Jl(_)}},uninstallCommands:[["openclaw","plugins","uninstall",un,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:tc},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]},"deepseek-harness":{installCommands:(I)=>ld(I),uninstallCommands:(I)=>cd(I)}};function Od(I,_=(O)=>O){try{let O=JSON.parse(_(_d(I,"utf-8")));if(!O||typeof O!=="object"||Array.isArray(O))throw Error(`Settings file ${I} must be a JSON object`);return O}catch(O){if(O instanceof SyntaxError)throw Error(`Failed to parse ${I}: ${O.message}`);throw O}}function xy(I){let _=no(Bt(I),"settings.json");if(!to(_))return;let O=Od(_,vn),L=O.enabledPlugins;if(!L||typeof L!=="object"||Array.isArray(L))return;if(L[In]!==!1)return;let J=_d(_,"utf-8"),K=J.replace(new RegExp(`("${In}"\\s*:\\s*)false`),"$1true");return L[In]=!0,cn(_,K!==J?K:`${JSON.stringify(O,null,2)}
`),`Enabled ${In} plugin in ${_}`}function Cy(I){let _=Si(I);if(!to(_))return;let O=Od(_);if(!Array.isArray(O.packages))return;let L=O.packages.find((J)=>!!J&&typeof J==="object"&&!Array.isArray(J)&&Ri(J.source)&&("extensions"in J));if(!L)return;return delete L.extensions,cn(_,`${JSON.stringify(O,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${_}`}function Ed(I,_){let O=gn({label:_,booleans:Object.fromEntries($n.map((K)=>[K.target,[K.flag]]))},I),L=O.errors[0];if(L)throw Error(L);let J=$n.filter((K)=>O.flags[K.target]).map((K)=>K.target);if(J.length!==1)throw Error(`Choose exactly one ${_} target: ${$n.map((K)=>K.flag).join(", ")}`);return J[0]}async function Dd(I,_=Ct){let[O,L,J]=await Promise.all([_(["amp","plugins","list"],30000),_(["codex","plugin","list"],30000),_(["copilot","--binary-version"])]);return{codexPluginListOutput:L,hooks:Ot(I,process.cwd(),{ampPluginListOutput:O,codexPluginListOutput:L,copilotCliVersion:J})}}async function Sy(I,_,O=Ct){let L=await Dd(I,O);return L.hooks.filter((J)=>_==="install"?J.configured:J.detected||J.inspectionStatus==="not-inspected").filter((J)=>J.platform!=="codex"||!Ki(L.codexPluginListOutput)||Td(L.codexPluginListOutput)).map((J)=>J.platform)}function Ry(I,_,O,L){if(O.length>0)return{finish:async()=>[Ed(O,_)]};if(!L.selectTargets&&!Li(L.input,L.output))return{finish:async()=>[Ed(O,_)]};let J=L.detectConfiguredTargets??(()=>Sy(I,_,L.fetchVersion)),K=Promise.all([Xc(L.probeTargets).then((ne)=>dd(ne,I)),J()]);return{ready:K,finish:async()=>{let[ne,oe]=await K,ue=Qc(ne,{action:_,configuredTargets:oe}),pe=L.selectTargets?await L.selectTargets(_,Id(_,ue)):await Dc(_,Id(_,ue),{input:L.input,output:L.output});if(pe==="update")return pe;if(!pe||pe.length===0)return null;return Ui(pe)}}}async function Py(I,_,O=!1,L){let J=$d[I];J.beforeInstall?.(_);let K=typeof J.installCommands==="function"?await J.installCommands(_,L):{commands:J.installCommands};return await pi(K.commands),await Hl(K.cleanupCommands??[]),await K.afterInstall?.(),[`${K.update||O?"Updated":"Installed"} ${mn(I)} integration`,K.message??J.postInstallMessage].filter(Boolean).join(`
`)}async function Ey(I,_){let O=$d[I];if(!O.uninstallCommands)throw Error(`${mn(I)} uninstall is not supported`);let L=typeof O.uninstallCommands==="function"?O.uninstallCommands(_):{commands:O.uninstallCommands};return await pi(L.commands),L.afterUninstall?.(),`Uninstalled ${mn(I)} integration`}function Ay(I){let _=sc(I);return _.alreadyInstalled?`Uninstalled OpenCode plugin from ${_.path}`:`OpenCode plugin not installed in ${_.path}`}var Ld={"antigravity-cli":{install:Wc,uninstall:Yc},cursor:{install:Ka,uninstall:Wa},devin:{install:ol,uninstall:il},droid:{install:fl,uninstall:ml},"grok-build":{install:xl,uninstall:Cl},"kimi-code":{install:Cd,uninstall:Sd}};function Iy(I,_,O,L=!1){if(I==="install"&&!L)eo(O);let J=Ld[_][I](O),K=mn(_),ne=I!=="install"?"Uninstalled":L?"Updated":"Installed";return I==="install"&&J.alreadyInstalled?L?`${K} hook up to date in ${J.path}`:`${K} hook already installed in ${J.path}`:I==="uninstall"&&!J.alreadyInstalled?`${K} hook not installed in ${J.path}`:`${ne} ${K} hook ${I==="install"?"in":"from"} ${J.path}`}var Nd={amp:{install:Bc,uninstall:qc,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:Il,uninstall:_l,afterInstall:async(I)=>{let _=ci(I);return await yn(["hermes","plugins","enable",Pn,"--no-allow-tool-override"]),!_},beforeUninstall:async(I)=>{li(I);try{await yn(["hermes","plugins","disable",Pn])}catch(_){console.warn(`${_ instanceof Error?_.message:String(_)}
Removing the plugin files anyway; ${Pn} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function _y(I,_,O,L=!1){let J=Nd[_];if(I==="uninstall")await J.beforeUninstall?.(O);let K=I==="install"?await J.install(O):await J.uninstall(O),ne=I==="install"&&await J.afterInstall?.(O),oe=mn(_),ue=!ne&&(I==="install"&&K.alreadyInstalled||I==="uninstall"&&!K.alreadyInstalled);return[ue?I==="install"?`${oe} plugin ${L?"up to date":"already installed"} at ${K.path}`:`${oe} plugin not installed at ${K.path}`:`${I!=="install"?"Uninstalled":L?"Updated":"Installed"} ${oe} plugin ${I==="install"?"at":"from"} ${K.path}`,ue?void 0:J.restartNote].filter(Boolean).join(`
`)}var Ty={"copilot-cli":{afterInstall:xy},"hermes-agent":{beforeInstall:(I,_)=>{if(!_)eo(I)}},openclaw:{beforeUninstall:mi},pi:{afterInstall:Cy}};function $y(I){return I in Ld}function Oy(I){return I in Nd}var Ad=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Dy(I){if(zt({environment:I,cwd:process.cwd()}).status!=="configured")return Ad;return[Ad,"",nn.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function Id(I,_){return _.map((O)=>I==="install"&&O.target==="kimi-code"&&O.unavailableReason==="already installed"?{...O,available:!0,unavailableReason:void 0,label:`${O.label} (global hook installed)`}:O)}function Ly(I,_){if(I.selectKimiInstallMethod)return I.selectKimiInstallMethod();if(!Li(I.input,I.output))return Promise.resolve("global-hook");return Oc({input:I.input,output:I.output,globalHookInstalled:zt({environment:_,cwd:process.cwd()}).status==="configured"})}async function jd(I,_,O,L=!1,J){let K=Ty[_];if(I==="install")K?.beforeInstall?.(O,L);if(I==="uninstall")K?.beforeUninstall?.(O);if($y(_))return Iy(I,_,O,L);if(Oy(_))return _y(I,_,O,L);if(I==="uninstall")return _==="opencode"?Ay(O):Ey(_,O);return[await Py(_,O,L,J),await K?.afterInstall?.(O)].filter(Boolean).join(`
`)}function Ny(I){let _=gn({label:"update"},I).errors[0];if(_)throw Error(_)}async function jy(I,_=Ct){let O=await Dd(I,_),L=no(Bt(I),"installed-plugins");return{targets:Ui([...O.hooks.filter((K)=>K.platform!=="copilot-cli"&&K.detected).map((K)=>K.platform),...[Ir,Oa,$a].flatMap((K)=>to(no(L,...K))?["copilot-cli"]:[]),...Ar(I,zi)?["claude-code"]:[],...Ki(O.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:O.codexPluginListOutput}}async function Fy(I){let _=c(),O=I.output??process.stdout,L=(I.scriptPath??process.argv[1]??"").split(/[\\/]/),J=L.find((Pe)=>/^bunx-\d+-/.test(Pe)),K=J!==void 0||L.includes("_npx")?null:(I.checkLatestVersion??Gn)(),ne=async()=>{let Pe=K&&await K;if(Pe?.updateAvailable)O.write(`
Update available: cc-safety-net ${Pe.currentVersion} → ${Pe.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},oe=jy(_,I.fetchVersion??Ct).then(async(Pe)=>{let Ce=new Set(Pe.targets);return{targets:Pe.targets,codexPluginListOutput:Pe.codexPluginListOutput,available:new Map(await Promise.all($n.filter((en)=>Ce.has(en.target)&&Rd.has(en.target)).map(async(en)=>[en.target,await nr(en.probeCommand)])))}}),ue=await Mt(I.showBanner??!0,()=>({ready:oe,finish:()=>oe}),()=>Ht({input:I.input??process.stdin,output:O}),{loadingMessage:"Checking installed integrations…",output:O}),pe=await Promise.resolve().then(()=>(ud(_.tmpdir,process.platform,J),null)).catch((Pe)=>rr(Pe));if(ue.targets.length===0){if(O.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),pe!==null)console.error(pe);return await ne(),pe===null?0:1}let we=ue.targets.some((Pe)=>Pd.has(Pe))?await Promise.resolve().then(()=>(eo(_),null)).catch((Pe)=>rr(Pe)):null,xe=await Sr(Promise.all(ue.targets.map((Pe)=>{if(Rd.has(Pe)&&!ue.available.get(Pe))return Promise.resolve({message:`${mn(Pe)} not found; skipped`,failed:!1});if(we!==null&&Pd.has(Pe))return Promise.resolve({message:we,failed:!0});return jd("install",Pe,_,!0,ue.codexPluginListOutput).then((Ce)=>({message:Ce,failed:!1}),(Ce)=>({message:rr(Ce),failed:!0}))})),{loadingMessage:`Updating ${ue.targets.length} integration${ue.targets.length===1?"":"s"}…`,output:O}),Se=pe===null?xe:[...xe,{message:pe,failed:!0}];return Se.forEach((Pe)=>Pe.failed?console.error(Pe.message):O.write(`${Pe.message}
`)),await ne(),Se.some((Pe)=>Pe.failed)?1:0}function Wi(I,_={}){return Promise.resolve().then(()=>Ny(I)).then(()=>Fy(_)).catch((O)=>(console.error(rr(O)),1))}async function or(I,_,O={}){try{let L=c(),J=await Mt(!0,()=>Ry(L,I,_,O),()=>Ht({input:O.input??process.stdin,output:O.output??process.stdout}),{loadingMessage:I==="install"?"Checking available integrations…":"Checking installed integrations…",output:O.output??process.stdout});if(!J)return(O.output??process.stdout).write(`Cancelled: nothing was ${I}ed.
`),0;if(J==="update")return(O.runUpdate??(()=>Wi([],{fetchVersion:O.fetchVersion,input:O.input,output:O.output,showBanner:!1})))();let K=O.output??process.stdout;return await Zc(J,async(ne)=>{if(ne==="kimi-code"&&I==="install"){let ue=await Ly(O,L);if(ue===null){K.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(ue==="plugin"){K.write(`${Dy(L)}
`);return}}let oe=await Sr(jd(I,ne,L),{loadingMessage:`${I==="install"?"Installing":"Uninstalling"} ${mn(ne)} integration…`,output:K});K.write(`${oe}
`)}),0}catch(L){return console.error(rr(L)),1}}function rr(I){let _=I instanceof Error?I.message:String(I),O=typeof I==="object"&&I!==null&&"code"in I?I.code:null;if(O==="EACCES"||O==="EPERM")return`${_}
Check file permissions for the target config file and parent directory.`;if(O==="ENOENT")return`${_}
Check that the target config path and parent directory exist.`;if(O==="ENOTDIR")return`${_}
Check that every parent path component is a directory.`;return _}import{mkdirSync as qy}from"node:fs";import{dirname as Vy}from"node:path";import{createInterface as Jy}from"node:readline";import{existsSync as Hd,readFileSync as Hy}from"node:fs";function yt(I,_){let O=et(I,_);return{policy:O.policy,errors:ae(Ze(O.issues,Qe,(L)=>L.kind==="custom")," "," ")}}function ir(I,_){return yt(I,_).errors}function Fd(I,_){return{"safety.level":I.safety.level,...Yi("safety.overrides",I.safety.overrides),"workflow.worktree_mode":String(I.workflow.worktree_mode),"destructive_command_protection.enabled":String(I.destructive_command_protection.enabled),...Yi("destructive_command_protection.overrides",I.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":Zi(I.destructive_command_protection.allow_paths),"secret_protection.enabled":String(I.secret_protection.enabled),...Yi("secret_protection.overrides",I.secret_protection.overrides),"secret_protection.deny_paths":Zi(I.secret_protection.deny_paths),"secret_protection.allow_paths":Zi(I.secret_protection.allow_paths),..._?{"audit.retention_days":String(I.audit.retention_days)}:{}}}function ro(I,_,O){let L=Fd(I,O),J=Fd(_,O);return[...new Set([...Object.keys(L),...Object.keys(J)])].flatMap((K)=>L[K]===J[K]?[]:[{field:K,before:L[K],after:J[K]}])}function sr(I,_){let O=d(I,_);if(!Hd(O))return{baseline:C(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,I.home),diagnostics:[]};let L=vt(O),J=yt(L.value,I.home);return{baseline:J.policy,diagnostics:L.errors.length>0?L.errors:J.errors}}function vt(I){if(!Hd(I))return{errors:[`${I}: file not found`]};try{return{value:JSON.parse(Hy(I,"utf-8")),errors:[]}}catch(_){let O=_ instanceof Error?_.message:String(_);return{errors:[`${I}: ${_ instanceof SyntaxError?`Invalid JSON: ${O}`:O}`]}}}function oo(I,_){let O=My(I)?I:{};return{version:_.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((L)=>O[L]!==void 0).map((L)=>[L,O[L]]))}}function Yi(I,_){return Object.fromEntries(Object.entries(_).flatMap(([O,L])=>L===void 0?[]:[[`${I}.${O}`,String(L)]]))}function Zi(I){return I.length===0?"(none)":I.join(", ")}function My(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}import{chmodSync as Uy,existsSync as Md,mkdirSync as Gy,readFileSync as Ud}from"node:fs";import{dirname as By}from"node:path";function Gd(I,_={}){let O=d(I,_);if(!Md(O))return{path:O,exists:!1,raw:"",policy:z(),errors:[]};let L=Ud(O,"utf-8");if(!L.trim())return{path:O,exists:!0,raw:L,policy:z(),errors:["Config file is empty"]};try{let J=yt(JSON.parse(L),I.home);return{path:O,exists:!0,raw:L,policy:J.policy,errors:J.errors}}catch(J){return{path:O,exists:!0,raw:L,policy:z(),errors:[`Invalid JSON: ${J instanceof Error?J.message:String(J)}`]}}}function Hn(I,_,O={}){let L=d(I,O),J=yt(_,I.home);if(J.errors.length>0)return{path:L,policy:z(),errors:J.errors};let K=J.policy;return Gy(By(L),{recursive:!0,mode:448}),g(ie(L),`${JSON.stringify(K,null,2)}
`,384),Uy(L,384),{path:L,policy:K,errors:[]}}function Bd(I,_){let O=yt(_,I.home);if(O.errors.length>0)return{errors:O.errors};return{preview:Ne(O.policy,I.env),errors:[]}}function qd(I,_={}){let O=d(I,_);if(!Md(O))return Hn(I,ee,_);let L=Ud(O,"utf-8");if(!L.trim())return Hn(I,ee,_);try{return Hn(I,C(JSON.parse(L),I.home),_)}catch{return Hn(I,ee,_)}}var Vd=new Set(["check","apply"]),Jd="(unset)";async function Kd(I,_,O={}){let L=gn({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},_),J=L.positionals[0],K=[...L.errors,...J&&!Vd.has(J)?[`Unknown policy subcommand: ${J}`]:[],...J&&Vd.has(J)&&!L.positionals[1]?[`policy ${J} requires a file`]:[],...L.positionals.slice(2).map((Ce)=>`Unexpected policy argument: ${Ce}`)];if(K.length>0){for(let Ce of K)console.error(Ce);return 1}let ne=L.positionals[1];if(!J||!ne)return Dt(fr,console.error),1;let oe=L.flags.global?d(I):b(O.cwd??process.cwd()),ue=vt(ne),pe=[...ue.errors,...ir(ue.value,I.home).map((Ce)=>`${ne}: ${Ce}`),...!L.flags.global&&Wy(ue.value)&&ue.value.audit!==void 0?[`${ne}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(pe.length>0){for(let Ce of pe)console.error(Ce);return 1}let we=C(ue.value,I.home);if(console.log(`Scope: ${L.flags.global?"user":"project"} (${oe})`),console.log(`Proposal: ${ne}`),L.flags.global)zd(C(vt(oe).value,I.home),we,!0);if(!L.flags.global){let Ce=sr(I).baseline;console.log("Effective policy (user + project merged):"),zd(Q(Ce,le(vt(oe).value,I.home).policy).policy,Q(Ce,le(ue.value,I.home).policy).policy,!1)}if(J==="check")return 0;let xe=O.input??process.stdin,Se=O.output??process.stdout;if(!xe.isTTY||!Se.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${ne}${L.flags.global?" --global":""}`),1;if(!await zy(`Apply this policy to ${oe}? [y/N] `,xe,Se))return console.log("Cancelled; nothing was written."),0;return Ky(I,oe,ue.value,we,L.flags.global),console.log(`Policy applied: ${oe}`),0}function zy(I,_,O){let L=Jy({input:_,output:O,terminal:!1});return new Promise((J)=>{L.once("close",()=>J(!1)),L.question(I,(K)=>{J(/^y(es)?$/i.test(K.trim())),L.close()})})}function Ky(I,_,O,L,J){if(J){Hn(I,L);return}qy(Vy(_),{recursive:!0}),wn(_,oo(O,L))}function zd(I,_,O){let L=ro(I,_,O);if(L.length===0){console.log("No changes.");return}console.log(`Changes (${L.length}):`);for(let J of L)console.log(`  ${J.field}: ${J.before??Jd} -> ${J.after??Jd}`)}function Wy(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}import{join as lb}from"node:path";var Wd="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- `caffeinate`, `exec`, `nice`, `nohup`, `setsid`, `stdbuf`, `time`, and `timeout` are built-in transparent wrappers and need no configuration. Configure only other wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function io(I,_){if(!I.ok){eu(I);return}Xd(I,_)}function Zd(I,_,O){if(I.ok)console.log(O);if(!I.add){io(I,`Added rulebook source: ${_}`);return}if(!I.ok){eu(I);return}if(I.add.added.length>0)console.log(`Added ${I.add.added.length} ${I.add.added.length===1?"rulebook":"rulebooks"} from ${I.add.source} at ${I.add.ref}:`),I.add.added.forEach((L)=>{console.log(`  - ${L}`)});if(I.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${I.add.source} at ${I.add.ref}: ${I.add.alreadyConfigured.join(", ")}`);if(I.add.commits.length>0)console.log(`Vendored at ${I.add.commits.map((L)=>L.slice(0,7)).join(", ")}.`);Xd(I,"Rule config updated.")}function Xd(I,_){for(let O of I.changes??[])console.log(O);console.log(_),console.log(""),Yy(I.entries)}function Yy(I){if(I.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${I.length}):`);for(let _ of I)console.log(`  - ${_.name} ${_.version} (${Zy(_.ruleCount)})`),console.log(`    Source: ${_.spec}`)}function Zy(I){return`${I} ${I===1?"rule":"rules"}`}function Qd(I){bt("Active sources",I.rulebooks,(_)=>[`[${_.source}] ${_.name} ${_.version}`,`  Source: ${_.spec}`]),bt("Active rules",I.rules,(_)=>[`[${Qy(I,_.name)}] ${_.name}`,...Xy(_),`  Reason: ${_.reason}`]),bt("Disabled rules",Yd(I,"off"),(_)=>[_.key]),bt("Reason overrides",Yd(I,"reason"),(_)=>[_.key,`  Reason: ${_.value.reason}`]),bt("Transparent wrappers",I.transparent_wrappers,(_)=>[_]),bt("Issues",I.errors,(_)=>[_]),bt("Warnings",I.warnings,(_)=>[_])}function bt(I,_,O){if(_.length===0){console.log(`${I}: (none)`);return}console.log(`${I} (${_.length}):`);for(let L of _){let[J,...K]=O(L);console.log(`  - ${J}`);for(let ne of K)console.log(`    ${ne}`)}}function Xy(I){if(!I.match)return[`  Command: ${I.subcommand?`${I.command} ${I.subcommand}`:I.command}`,`  Block args: ${I.block_args.join(", ")}`];return[`  Command: ${[I.command,...I.match.command_path].join(" ")}`,...I.match.any_args?[`  Any args: ${I.match.any_args.join(", ")}`]:[],...I.match.exclude_args?[`  Exclude args: ${I.match.exclude_args.join(", ")}`]:[]]}function Qy(I,_){return I.rulebooks.find((O)=>O.rules.includes(_))?.source??"project"}function Yd(I,_){return Object.entries({...I.userConfig?.overrides,...I.projectConfig?.overrides}).filter((O)=>{if(_==="off")return O[1]==="off";return!!O[1]&&typeof O[1]==="object"}).map(([O,L])=>({key:O,value:L}))}function eu(I){for(let _ of I.errors)console.error(_)}import{dirname as Cu,join as mo}from"node:path";import{join as ts,resolve as uv}from"node:path";function Xi(I){let _=m(I);if(_.errors.length>0)return{ok:!1,result:{ok:!1,errors:_.errors,entries:[]}};return{ok:!0,config:_.config??lt}}function nu(I){wn(I,{version:1,rules:[],overrides:{},transparent_wrappers:[]})}function tu(I){wn(I,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as co}from"node:path";var ev="custom.";function so(I){if(I.rulebook_version!==2)return[];let _=I.rules.map((O)=>({name:O.name,command:O.command,block_args:[],match:O.match,reason:O.reason,intent:O.intent}));return(I.tests??[]).flatMap((O,L)=>{let J=Qi(h(O.command));if(J.length===0)return[`tests[${L}]: could not parse fixture command: ${O.command}`];let K=J.reduce((ne,oe)=>ne??A(oe,_)?.id.slice(ev.length),void 0);if(O.expect==="blocked"){if(K===O.rule)return[];let ne=K?`"${K}" matched first`:"no rule matched";return[`tests[${L}]: expected "${O.rule}" to block "${O.command}" but ${ne}`]}return K?[`tests[${L}]: expected "${O.command}" to be allowed but "${K}" matched`]:[]})}function Qi(I){return I.nodes.flatMap((_)=>{if(_.kind==="group"||_.kind==="function")return Qi(_.body);if(_.kind!=="command")return[];let O=ve(te(_.dialect,_.words)).words.map(t);return[...O.length>0?[O]:[],..._.nested.flatMap((L)=>Qi(L))]})}var ao=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function lo(I={}){return{requests:0,responseBytes:0,maxRequests:I.maxRequests??ao.maxRequests,maxResponseBytes:I.maxResponseBytes??ao.maxResponseBytes}}function Mn(I){return{controller:new AbortController,budget:lo(),resolveUrl:I}}function ru(I){return I instanceof Error&&I.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function ou(I){if(I.requests>=I.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");I.requests++}function iu(I,_){if(_>I.maxResponseBytes-I.responseBytes)throw I.responseBytes+=_,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");I.responseBytes+=_}var lu=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function su(I,_,O=x(co(co(_)),"rules policy"),L=Mn()){if(S(I))return ov(I,L);return rv(I,_,O)}async function cu(I,_,O,L,J,K){if(!S(I))return su(I,_,O,L);let ne=J?null:nv(I,_,O);if(ne)return ne;if(!J&&!K)throw Error(`${I} is not vendored; run rule update ${I} to vendor it`);return su(I,_,O,L)}function nv(I,_,O=x(co(co(_)),"rules policy")){let L=D(I),J=N(_,L.name),K=r(i(O,J));if(K===null)return null;let ne=ce(es(K,`Invalid rulebook ${J}.`));if(ne.name!==L.name)throw Error(`rulebook name "${ne.name}" in ${J} must match "${L.name}"`);return{spec:I,rulebook:ne,content:K}}async function du(I,_={}){if(!Y(I))throw Error(`Invalid GitHub repository source: ${I}`);let[O,L]=I.split("/");if(!O||!L)throw Error(`Invalid GitHub repository source: ${I}`);if(_.ref!==void 0&&!se(_.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${_.ref}`);let J=_.operation??Mn(),K=_.ref??await tv(O,L,I,J),ne=await pu(O,L,K,I,J),oe=await uo(`https://api.github.com/repos/${O}/${L}/git/trees/${ne}?recursive=1`,"tree",J),ue=oe.response;if(!ue.ok)throw Error(`Failed to inspect ${I}: GitHub tree returned ${ue.status}`);let pe=JSON.parse(oe.content);if(!Array.isArray(pe?.tree))throw Error(`Failed to inspect ${I}: unexpected GitHub tree response`);let we=pe.tree,xe=[...new Set(we.flatMap((Se)=>{if(!Se||typeof Se!=="object")return[];let Pe=Se;if(Pe.type!=="blob"||typeof Pe.path!=="string")return[];let Ce=Pe.path.match(at);return Ce?.[1]?[Ce[1]]:[]}))].sort();if(xe.length===0)throw Error(`No rulebooks found in ${I} under ${ge}/`);return{source:I,owner:O,repo:L,ref:K,commit:ne,names:xe}}async function tv(I,_,O,L){let J=await uo(`https://api.github.com/repos/${I}/${_}`,"metadata",L),K=J.response;if(!K.ok)throw Error(`Failed to inspect ${O}: GitHub returned ${K.status}`);let oe=JSON.parse(J.content)?.default_branch;if(typeof oe!=="string"||oe==="")throw Error(`Failed to inspect ${O}: missing default branch`);if(!se(oe))throw Error(`GitHub returned an invalid default branch: ${oe}`);return oe}function rv(I,_,O){ct(I);let L=N(_,I),J=r(i(O,L));if(J===null)throw Error(`Rulebook source not found: ${I}`);let K=uu(es(J,"Invalid local rulebook source."));if(K.name!==I)throw Error(`rulebook name "${K.name}" must match local source "${I}"`);return{spec:I,rulebook:K,content:J}}async function ov(I,_){let O=D(I),L=await pu(O.owner,O.repo,O.ref,I,_),J=await uo(`https://raw.githubusercontent.com/${O.owner}/${O.repo}/${L}/${O.path}`,"raw",_),K=J.response;if(!K.ok)throw Error(`Failed to fetch ${I}: GitHub raw returned ${K.status}`);let ne=J.content,oe=uu(es(ne,"Invalid GitHub rulebook response."));if(oe.name!==O.name)throw Error(`rulebook name "${oe.name}" must match GitHub source "${O.name}"`);return{spec:I,rulebook:oe,content:ne}}function uu(I){let _=ce(I),O=so(_);if(O.length>0)throw Error(O.join("; "));return _}function es(I,_){try{return JSON.parse(I)}catch{throw Error(_)}}async function pu(I,_,O,L,J){let K=await uo(`https://api.github.com/repos/${I}/${_}/commits/${encodeURIComponent(O)}`,"commit",J),ne=K.response;if(!ne.ok)throw Error(`Failed to resolve ${L}: GitHub returned ${ne.status}`);let oe=JSON.parse(K.content);if(typeof oe?.sha!=="string"||oe.sha==="")throw Error(`Failed to resolve commit for ${L}`);return oe.sha}async function iv(I,_,O={}){if(O.signal?.aborted)throw O.signal.reason;let L=O.budget??lo(),J=new AbortController,K=()=>J.abort(O.signal?.reason);O.signal?.addEventListener("abort",K,{once:!0});let ne=!1,oe=setTimeout(()=>{if(J.signal.aborted)return;ne=!0,J.abort()},O.timeoutMs??lu.timeoutMs);try{if(O.signal?.aborted)throw O.signal.reason;ou(L);let ue=await fetch(I,{signal:J.signal,redirect:"error"});if(!ue.ok)return fu(ue),{response:ue,content:""};return{response:ue,content:await sv(ue,_,L,()=>J.abort())}}catch(ue){if(ne)throw Error("GitHub request timed out",{cause:ue});if(O.signal?.aborted)throw O.signal.reason;throw ue}finally{clearTimeout(oe),O.signal?.removeEventListener("abort",K)}}function uo(I,_,O){return iv(O.resolveUrl?.(I)??I,_,{budget:O.budget,signal:O.controller.signal})}async function sv(I,_,O=lo(),L){let J=lu[`${_}Bytes`],K=Number(I.headers.get("content-length"));if(Number.isFinite(K)&&K>J)throw fu(I),Error(`GitHub ${_} response exceeds ${J} bytes`);if(!I.body)return"";let ne=I.body.getReader(),oe=[],ue=0;while(!0){let pe=await ne.read();if(pe.done)break;try{iu(O,pe.value.byteLength)}catch(we){throw L?.(),au(ne),we}if(ue+=pe.value.byteLength,ue>J)throw L?.(),au(ne),Error(`GitHub ${_} response exceeds ${J} bytes`);oe.push(Buffer.from(pe.value))}return Buffer.concat(oe,ue).toString("utf-8")}function fu(I){if(!I.body)return;mu(()=>I.body?.cancel())}function au(I){mu(()=>I.cancel())}function mu(I){try{Promise.resolve(I()).catch(()=>{})}catch{}}var av=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function gu(I,_){let O=vu(I.rules,_);if(O.length>0)return{ok:!0,specs:O};return yu(I.rules,_)}function hu(I,_){let O=vu(I,_);if(O.length>0)return{ok:!0,specs:O};let L=cv(I,_);if(L.length>0)return{ok:!0,specs:L};let J=dv(I,_);if(!J.ok)return J;if(J.specs.length>0)return{ok:!0,specs:J.specs};return yu(I,_)}function yu(I,_){let O=I.filter((L)=>ns(L)?.name===_);if(O.length===1)return{ok:!0,specs:O};return lv(_,O)}function lv(I,_){return{ok:!1,result:{ok:!1,errors:_.length===0?[`No configured rulebook matches ${I}`]:[`Ambiguous rulebook match ${I}: ${_.join(", ")}`],entries:[]}}}function vu(I,_){return I.filter((O)=>O===_)}function cv(I,_){let O=_.match(av),L=O?.[1],J=O?.[2],K=O?.[3];if(!L||!J||!K||!se(K))return[];return bu(I,(ne)=>ne.owner===L&&ne.repo===J&&ne.ref===K)}function dv(I,_){if(!Y(_))return{ok:!0,specs:[]};let[O,L]=_.split("/"),J=bu(I,(ne)=>ne.owner===O&&ne.repo===L);if(new Set(J.map((ne)=>ns(ne)?.ref).filter((ne)=>!!ne)).size<2)return{ok:!0,specs:J};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${_}. Use an explicit ref:`,`  cc-safety-net rule remove ${_}#<ref>`],entries:[]}}}function ns(I){try{return D(I)}catch{return null}}function bu(I,_){return I.filter((O)=>{let L=ns(O);return L?_(L):!1})}async function fo(I,_={}){let O=rs(_);return pv(I,O,await po(I,O,Mn()))}function pv(I,_,O){if(!O.ok)return O;let L=kn(I,_),J=[...new Set(H(L.configPath,L.filesystemScope))];if(J.length===0)return O;return{ok:!1,errors:J,entries:O.entries}}async function po(I,_,O,L={},J=new Set,K=new Set){try{let ne=kn(I,_),oe=Xi(ne.configTarget);if(!oe.ok)return oe.result;let ue=oe.config,pe=_.only?gu(ue,_.only):{ok:!0,specs:ue.rules};if(!pe.ok)return pe.result;let we=new Set([..._.refresh?pe.specs:[],...J]),xe=(rn)=>cu(rn,ne.configDir,ne.filesystemScope,O,we.has(rn),!_.refresh||we.has(rn)),Se=await Cv(ue.rules,_.refresh?(rn)=>xe(rn).then((fn)=>({ok:!0,item:fn})).catch((fn)=>{if(ru(fn))throw fn;return{ok:!1,spec:rn,message:fn instanceof Error?fn.message:String(fn)}}):async(rn)=>({ok:!0,item:await xe(rn)}),O),Pe=Se.filter((rn)=>!rn.ok),Ce=Se.filter((rn)=>rn.ok).map((rn)=>rn.item),en=Ce.flatMap((rn)=>fv(rn,ue.rules)),Le=Ce.flatMap((rn)=>mv(rn,K,ne)),Ve=new Set([...en,...Le].map((rn)=>rn.spec)),on=[...Pe,...en,...Le],sn=[],an=hv(sn,()=>Ce.flatMap((rn)=>Ve.has(rn.spec)||on.length>0&&K.has(rn.spec)?[]:gv(rn,ne,L,sn)));return{ok:on.length===0,errors:on.map((rn)=>`Failed to update ${rn.spec}: ${rn.message}`),entries:Ce.map(vv),changes:an}}catch(ne){return lr(ne)}}function fv(I,_){if(!S(I.spec))return[];let O=De(I.spec),L=_.filter((J)=>J!==I.spec&&De(J).toLowerCase()===O.toLowerCase());if(L.length===0)return[];return[{ok:!1,spec:I.spec,message:`rulebook name "${O}" is also claimed by ${L.join(", ")}; rename one of them`}]}function mv(I,_,O){if(!_.has(I.spec)||!S(I.spec))return[];let L=N(O.configDir,I.rulebook.name),J=r(i(O.filesystemScope,L));if(J===null||J===I.content)return[];return[{ok:!1,spec:I.spec,message:`${L} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function gv(I,_,O,L){if(!S(I.spec))return[];let J=N(_.configDir,I.rulebook.name),K=i(_.filesystemScope,J),ne=r(K);if(ne===I.content)return[];return L?.push({target:K,previous:ne}),g(K,I.content,void 0,O._testAfterPolicyRename),yv(I,ne)}function hv(I,_){try{return _()}catch(O){for(let L of[...I].reverse()){if(L.previous===null){j(L.target);continue}g(L.target,L.previous)}throw O}}function yv(I,_){if(_===null)return[`Vendored ${I.spec} (${I.rulebook.version})`];let O=be(_),L="problem"in O?null:O.rulebook,J=new Map(L?.rules.map((ne)=>[ne.name,JSON.stringify(ne)])??[]),K=new Set(I.rulebook.rules.map((ne)=>ne.name));return[`Updated ${I.spec} (${L?.version??"unreadable"} -> ${I.rulebook.version})`,...[...K].filter((ne)=>!J.has(ne)).map((ne)=>`  + ${ne}`),...[...J.keys()].filter((ne)=>!K.has(ne)).map((ne)=>`  - ${ne}`),...I.rulebook.rules.filter((ne)=>{let oe=J.get(ne.name);return oe!==void 0&&oe!==JSON.stringify(ne)}).map((ne)=>`  ~ ${ne.name}`)]}function vv(I){return{spec:I.spec,name:I.rulebook.name,version:I.rulebook.version,ruleCount:I.rulebook.rules.length}}async function wu(I,_,O={}){return bv(I,_,Rv(O),Mn())}async function bv(I,_,O,L,J={}){let K=null,ne=!1;try{let oe=kn(I,O),ue=r(oe.configTarget);K={target:oe.configTarget,content:ue};let pe=Xi(oe.configTarget);if(!pe.ok)return pe.result;let we=pe.config,xe=Y(_);wv(_,O,xe);let Se=xe?await du(_,{ref:O.ref,operation:L}):null,Pe=Se?kv(Se,O.rulebooks):[],Ce=Se?Pe.map((sn)=>xv(we.rules,Se,sn)??`${_}#${Se.ref}/${sn}`):[_],en=Ce.filter((sn)=>!we.rules.includes(sn)),Le=[...we.rules,...en];if(Le.length>he)return Sv();if(Le.length!==we.rules.length)ne=!0,wn(oe.configTarget,{version:1,rules:Le,overrides:we.overrides??{},transparent_wrappers:we.transparent_wrappers??[]},void 0,J._testAfterPolicyRename);let Ve=await po(I,O,L,J,new Set(en),new Set(en));if(!Ve.ok)ar(oe.configTarget,ue);if(!Ve.ok||!Se)return Ve;let on=Pe.filter((sn,an)=>en.includes(Ce[an]??""));return{...Ve,add:{source:_,ref:Se.ref,selected:Pe,added:on,alreadyConfigured:Pe.filter((sn)=>!on.includes(sn)),commits:en.length>0?[Se.commit]:[]}}}catch(oe){if(ne&&K)try{ar(K.target,K.content)}catch(ue){return lr(ue)}return lr(oe)}}function wv(I,_,O){if(!O&&_.rulebooks!==void 0)throw Error("--only can only select rulebooks from an owner/repo source");if(!O&&_.ref)throw Error(`--ref can only select a ref for an owner/repo source: ${I}`);if(_.rulebooks?.length===0)throw Error("--only requires at least one rulebook name");let L=_.rulebooks?.filter((J)=>!u.test(J))??[];if(L.length>0)throw Error(`Invalid rulebook names: ${L.join(", ")}`)}function kv(I,_){let O=_?[...new Set(_)]:I.names,L=O.filter((J)=>!I.names.includes(J));if(L.length>0)throw Error(`Rulebooks not found in ${I.source} at ${I.ref}: ${L.join(", ")}
Available rulebooks: ${I.names.join(", ")}`);return O}function xv(I,_,O){let L=`${_.source}#${_.ref}/${O}`;if(I.includes(L))return L;let J=`${_.source}#${_.commit}/${O}`;return I.find((K)=>K===J)}async function Cv(I,_,O=Mn()){if(I.length>he)throw Error(ye);let L=[],J=0,K,ne=Array.from({length:Math.min(I.length,ao.concurrency)},async()=>{while(!K){let oe=J;if(oe>=I.length)return;J++;try{L[oe]=await _(I[oe],oe,O.controller.signal)}catch(ue){if(!K)K={value:ue},J=I.length,O.controller.abort(ue);return}}});if(await Promise.all(ne),K)throw K.value;return L}function Sv(){return{ok:!1,errors:[ye],entries:[]}}function rs(I){return{cwd:I.cwd,userConfigDir:I.userConfigDir,userConfigPath:I.userConfigPath,projectConfigPath:I.projectConfigPath,global:I.global,only:I.only,refresh:I.refresh}}function Rv(I){return{...rs(I),ref:I.ref,rulebooks:I.rulebooks}}function Pv(I){return{...rs(I),deleteSource:I.deleteSource}}async function ku(I,_,O={}){try{return await Ev(I,_,Pv(O),{})}catch(L){return lr(L)}}async function Ev(I,_,O,L){let J=kn(I,O),K=m(J.configTarget);if(K.errors.length>0)return{ok:!1,errors:K.errors,entries:[]};if(!K.config)return{ok:!1,errors:[`No config found at ${J.configPath}`],entries:[]};let ne=hu(K.config.rules,_);if(!ne.ok)return ne.result;let oe=O.deleteSource?Av(J.configDir,ne.specs,J.filesystemScope):{ok:!0,dirs:[]};if(!oe.ok)return oe.result;let ue=r(J.configTarget);if(ue===null)return lr(Error("Rules config is unavailable."));try{wn(J.configTarget,{version:1,rules:K.config.rules.filter((xe)=>!ne.specs.includes(xe)),overrides:K.config.overrides??{},transparent_wrappers:K.config.transparent_wrappers??[]},void 0,L._testAfterPolicyRename)}catch(xe){throw ar(J.configTarget,ue),xe}let pe=await po(I,O,Mn(),L);if(!pe.ok)return ar(J.configTarget,ue),pe;let we=Iv(oe.dirs,L,J.filesystemScope);if(!we.ok){ar(J.configTarget,ue);let xe=await po(I,O,Mn(),L);if(!xe.ok)return{ok:!1,errors:[...we.result.errors,...xe.errors],entries:xe.entries};return we.result}return pe}function Av(I,_,O){let L=_.flatMap((oe)=>u.test(oe)?[]:["--delete-source can only delete local rulebook sources"]),J=_.map((oe)=>ts(I,oe)),K=L.length>0?[]:J.flatMap((oe)=>xu(oe,O)),ne=[...L,...K];return ne.length>0?{ok:!1,result:{ok:!1,errors:ne,entries:[]}}:{ok:!0,dirs:J}}function xu(I,_){let O=uv(I),L=i(_,O),J=fe(L);if(!J)return[`Local rulebook source directory not found: ${I}`];let K=J.find((ne)=>ne.name==="rulebook.json");if(!K)return[`Local rulebook source directory is missing rulebook.json: ${I}`];if(K.kind!=="file")throw new o(_.label);if(r(i(_,ts(O,"rulebook.json"))),J.length>1)return[`Local rulebook source directory contains extra files: ${I}. delete manually if you really want to remove the directory.`];return[]}function Iv(I,_,O){let L=I.flatMap((J)=>{try{if(!fe(i(O,J)))return[];let K=xu(J,O);if(K.length>0)return K;return _v(J,_,O),[]}catch(K){return[`Failed to delete local rulebook source ${J}: ${K instanceof Error?K.message:String(K)}`]}});return L.length>0?{ok:!1,result:{ok:!1,errors:L,entries:[]}}:{ok:!0}}function _v(I,_,O){if(_._testDeleteLocalSourceDir){_._testDeleteLocalSourceDir(I);return}j(i(O,ts(I,me))),st(i(O,I))}function ar(I,_){if(_===null){j(I);return}g(I,_)}function lr(I){return{ok:!1,errors:[I instanceof Error?I.message:String(I)],entries:[]}}var Tv=".safety-net.json",$v="~/.cc-safety-net/config.json";async function Pu(I,_){return[await Su(I,{legacyPath:ua({cwd:_.cwd}),configPath:U(_.cwd),defaultRulebookName:"project-rules",migratedFrom:Tv,cleanup:_.cleanup,syncOptions:{cwd:_.cwd}}),await Su(I,{legacyPath:xt(I),configPath:G(I),defaultRulebookName:"user-rules",migratedFrom:$v,cleanup:_.cleanup,syncOptions:{cwd:_.cwd,global:!0}})].every((L)=>L)?0:1}async function Su(I,_){let O=kn(I,_.syncOptions),L=i(O.filesystemScope,_.legacyPath),J=r(L);if(J===null)return console.log(`No legacy config found at ${_.legacyPath}`),!0;let K=Dv(J);if(!K.ok){for(let Pe of K.errors)console.error(Pe);return!1}let ne=m(O.configTarget);if(ne.errors.length>0){for(let Pe of ne.errors)console.error(Pe);return!1}let oe=ne.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},ue=Lv(Cu(_.configPath),oe.rules,_.defaultRulebookName,_.migratedFrom,O.filesystemScope),pe=mo(Cu(_.configPath),ue,"rulebook.json"),we=i(O.filesystemScope,pe),xe=[Ru(O.configTarget),Ru(we)],Se=await Ov(I,_,O.configTarget,we,ue,K.config.rules,oe.rules.includes(ue)?oe.rules:[...oe.rules,ue],oe.overrides??{},oe.transparent_wrappers??[]);if(!Se.ok){Fv(xe);for(let Pe of Se.errors)console.error(Pe);return!1}if(!_.cleanup)return console.log(`Migrated legacy config at ${_.legacyPath}. Legacy file is no longer used.`),!0;if(!jv(O.configTarget,we,ue,_.migratedFrom,K.config.rules))return console.error(`Migration cleanup verification failed for ${_.legacyPath}`),!1;return j(L),console.log(`Deleted legacy config at ${_.legacyPath}`),!0}async function Ov(I,_,O,L,J,K,ne,oe,ue){try{return wn(O,{version:1,rules:ne,overrides:oe,transparent_wrappers:ue}),wn(L,Nv(J,_.migratedFrom,K)),await fo(I,_.syncOptions)}catch(pe){return{ok:!1,errors:[pe instanceof Error?pe.message:String(pe)]}}}function Dv(I){try{let _=JSON.parse(I),O=Ro(_);if(O.errors.length>0)return{ok:!1,errors:O.errors};return{ok:!0,config:{version:1,rules:_.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function Lv(I,_,O,L,J){let K=_.find((ne)=>Hv(i(J,mo(I,ne,"rulebook.json")))===L);if(K)return K;if(r(i(J,mo(I,O,"rulebook.json")))===null)return O;for(let ne=2;;ne++){let oe=`${O}-${ne}`;if(r(i(J,mo(I,oe,"rulebook.json")))===null)return oe}}function Nv(I,_,O){return{rulebook_version:1,name:I,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:_,allowed_commands:[...new Set(O.map((L)=>L.command))],rules:O,tests:O.map((L)=>({command:[L.command,L.subcommand,L.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:L.name}))}}function jv(I,_,O,L,J){if(!m(I).config?.rules.includes(O))return!1;try{let ne=r(_);if(ne===null)return!1;let oe=JSON.parse(ne);return oe.migrated_from===L&&JSON.stringify(oe.rules)===JSON.stringify(J)}catch{return!1}}function Ru(I){return{target:I,content:r(I)}}function Fv(I){for(let _ of I){if(_.content===null){j(_.target);continue}g(_.target,_.content)}}function Hv(I){let _=r(I);if(_===null)return null;try{let O=JSON.parse(_);return typeof O.migrated_from==="string"?O.migrated_from:null}catch{return null}}import{mkdir as Mv,readFile as Uv,writeFile as Gv}from"node:fs/promises";import{dirname as Bv,join as qv}from"node:path";var Vv=86400000,Jv=604800000;async function Au(I,_=Date.now()){if(I.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let O=He(I);if(!O)return null;let L=qv(O,".cc-safety-net","update-check.json"),J=await zv(L,_);if(!J.lastCheck||_-J.lastCheck>Vv){let oe=await Gn();if(J.lastCheck=_,oe.latestVersion)J.latestVersion=oe.latestVersion;if(!await Eu(L,J))return null;if(oe.error)return null}let K=J.latestVersion,ne=pn();if(!K||!To(K,ne))return null;if(J.notifiedVersion===K&&J.notifiedAt!==void 0&&_-J.notifiedAt<Jv)return null;if(J.notifiedVersion=K,J.notifiedAt=_,!await Eu(L,J))return null;return`UPDATE_AVAILABLE: cc-safety-net v${K} is available (running v${ne}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function zv(I,_){let O=await Uv(I,"utf8").then((K)=>JSON.parse(K)).catch(()=>{return});if(!O||typeof O!=="object"||Array.isArray(O))return{};let L=O,J=(K)=>typeof K==="number"&&Number.isFinite(K)&&K<=_?K:void 0;return{lastCheck:J(L.lastCheck),latestVersion:typeof L.latestVersion==="string"?L.latestVersion:void 0,notifiedVersion:typeof L.notifiedVersion==="string"?L.notifiedVersion:void 0,notifiedAt:J(L.notifiedAt)}}async function Eu(I,_){return Mv(Bv(I),{recursive:!0,mode:448}).then(()=>Gv(I,JSON.stringify(_),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as Kv,resolve as os}from"node:path";var Iu="CC Safety Net Config",Wv="═".repeat(Iu.length),Yv="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",Zv=new Set(["rule.json","rule.lock","cache"]);function _u(I,_={}){try{return Xv(I,_)}catch(O){if(O instanceof o)return console.error(O.message),1;throw O}}function Xv(I,_){let O=_.cwd??process.cwd(),L=Z(I,{cwd:O}),J=xt(I),K=yr(O),ne=os(O,ge),oe=i(L.userScope,J),ue=i(L.projectScope,K),pe=!1,we=!1,xe=[],Se=[],Pe=Qv(i(L.projectScope,ne));if(nb(),r(L.userConfigTarget)!==null){let Ce=Un(L.userConfigTarget);if(Ce.errors.push(...H(L.userConfigPath,L.userScope)),xe.push({scope:"User",path:L.userConfigPath,result:Ce,schema:"rules",target:L.userConfigTarget}),Ce.errors.length>0)pe=!0}if(r(oe)!==null)if(we=!0,r(L.userConfigTarget)!==null)Se.push(go("user","cleanup"));else{let Ce=Po(oe);if(xe.push({scope:"User",path:J,result:Ce,schema:"legacy",inactive:!0,target:oe}),Se.push(go("user",Ce.errors.length>0?"fix-or-delete":"migrate")),Ce.errors.length>0)pe=!0}if(r(L.projectConfigTarget)!==null){let Ce=Un(L.projectConfigTarget);if(Ce.errors.push(...H(L.projectConfigPath,L.projectScope)),xe.push({scope:"Project",path:os(L.projectConfigPath),result:Ce,schema:"rules",target:L.projectConfigTarget}),Ce.errors.length>0)pe=!0;if(r(ue)!==null)we=!0,Se.push(go("project","cleanup"))}else if(r(ue)!==null){we=!0,pe=!0;let Ce=Po(ue);xe.push({scope:"Project",path:os(K),result:Ce,schema:"legacy",inactive:!0,target:ue}),Se.push(go("project",Ce.errors.length>0?"fix-or-delete":"migrate"))}if(Pe?.result.errors.length)pe=!0;if(xe.length===0&&!Pe)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Ce of xe)if(Ce.inactive)rb(Ce.scope,Ce.path,Ce.result);else if(Ce.result.errors.length>0)ob(Ce.scope,Ce.path,Ce.result.errors);else{if(Ce.schema==="rules"&&ab(Ce.target))console.log(`
Added $schema to ${Ce.scope.toLowerCase()} config.`);tb(Ce.scope,Ce.path,Ce.result,Ce.schema)}for(let Ce of Se)console.error(`
${nn.red(Ce)}`);if(Pe)if(Pe.result.errors.length>0)sb(Pe.path,Pe.result.errors);else ib(Pe.path,Pe.result);if(pe)return console.error(`
Config validation failed.`),1;return console.log(we?`
Configs valid with warnings.`:`
All configs valid.`),0}function go(I,_){let O=`legacy ${I} config`;if(_==="cleanup")return`Warning: Legacy ${I} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(_==="migrate")return`Warning: Legacy ${I} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${I} config is no longer supported. Fix or delete the ${O}, then run \`npx -y cc-safety-net rule migrate\`.`}function Qv(I){if(fe(I)===null)return null;let _=eb(I);if(_.ruleNames.size===0&&_.errors.length===0)return null;return{path:I.path,result:_}}function eb(I){let _=[],O=new Set,L=(fe(I)??[]).filter((J)=>!Zv.has(J.name)).sort((J,K)=>J.name.localeCompare(K.name));if(L.length===0)return{errors:_,ruleNames:O};for(let J of L){if(!u.test(J.name)){_.push(`rulebook directory names must match ${u}: ${J.name}`);continue}if(J.kind!=="directory"){_.push(`${J.name} must be a rulebook directory`);continue}let K=i(I.scope,Kv(I.path,J.name,"rulebook.json")),ne=r(K);if(ne===null){_.push(`${J.name}/rulebook.json is required`);continue}try{let oe;try{oe=JSON.parse(ne)}catch{_.push(`${J.name}/rulebook.json: invalid JSON`);continue}let ue=ce(oe);if(ue.name!==J.name){_.push(`rulebook name "${ue.name}" must match folder "${J.name}"`);continue}let pe=so(ue);if(pe.length>0){_.push(...pe.map((we)=>`${J.name}/rulebook.json: ${we}`));continue}O.add(J.name)}catch(oe){_.push(oe instanceof Error?`${J.name}/rulebook.json: ${oe.message}`:`${J.name}/rulebook.json: ${String(oe)}`)}}return{errors:_,ruleNames:O}}function nb(){console.log(Iu),console.log(Wv)}function tb(I,_,O,L){if(console.log(`
✓ ${I} config: ${_}`),console.log(`  Schema: ${L==="rules"?"rulebook sources":"legacy inline rules"}`),O.ruleNames.size>0){console.log(`  ${L==="rules"?"Sources":"Rules"}:`);let J=1;for(let K of O.ruleNames)console.log(`    ${J}. ${K}`),J++}else console.log(`  ${L==="rules"?"Sources":"Rules"}: (none)`)}function rb(I,_,O){if(console.error(`
✗ Legacy ${I.toLowerCase()} config: ${_}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),O.errors.length>0){console.error("  Errors:");let L=1;for(let J of O.errors)for(let K of J.split("; "))console.error(`    ${L}. ${K}`),L++;return}if(O.ruleNames.size>0){console.error("  Rules:");let L=1;for(let J of O.ruleNames)console.error(`    ${L}. ${J}`),L++;return}console.error("  Rules: (none)")}function ob(I,_,O){Tu(`${I} config`,_,O)}function ib(I,_){console.log(`
✓ GitHub source rules: ${I}`),console.log("  Rulebooks:");let O=1;for(let L of _.ruleNames)console.log(`    ${O}. ${L}`),O++}function sb(I,_){Tu("GitHub source rules",I,_)}function Tu(I,_,O){console.error(`
✗ ${I}: ${_}`),console.error("  Errors:");let L=1;for(let J of O)for(let K of J.split("; "))console.error(`    ${L}. ${K}`),L++}function ab(I){try{let _=r(I);if(_===null)return!1;let O=JSON.parse(_);if(O.$schema)return!1;return g(I,JSON.stringify({$schema:Yv,...O},null,2)),!0}catch(_){if(_ instanceof o)throw _;return!1}}var $u=new Set(["init","add","remove","update","sync","list","wrapper","migrate","doc","verify"]),cb=new Set(["add","remove","list"]),db="cc-safety-net/rulebooks";async function Ou(I,_){try{return await ub(I,_)}catch(O){if(O instanceof o)return console.error(O.message),1;throw O}}async function ub(I,_){let O=fb(_),L=O.help?pb(O.positionals):null;if(L)return Dt(L),0;if(O.errors.length>0){for(let oe of O.errors)console.error(oe);return 1}let J=O.positionals[0];if(!J)return Dt(kt,console.error),1;let K=O.positionals[1],ne={global:O.global};if(J==="init"){let oe=kn(I,ne);yb(oe.configTarget);let ue=lb(oe.configDir,"example-rules","rulebook.json"),pe=i(oe.filesystemScope,ue);if(O.example&&r(pe)===null)tu(pe);let we=H(oe.configPath,oe.filesystemScope);for(let xe of we)console.error(xe);if(we.length>0)return 1;return console.log("Rule config initialized."),0}if(J==="add"){let oe=Du(O);if(!oe)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let ue=kn(I,ne),pe=await wu(I,oe,{...ne,ref:O.ref,rulebooks:O.only.length>0?O.only:void 0});return Zd(pe,oe,`Scope: ${O.global?"user":"project"} (${ue.configDir})`),pe.ok?0:1}if(J==="remove"){if(!K)return console.error("rule remove requires a source"),1;let oe=await ku(I,K,{...ne,deleteSource:O.deleteSource});return io(oe,`Removed rulebook source: ${K}`),oe.ok?0:1}if(J==="update"){let oe=await fo(I,{...ne,only:K,refresh:!0});return io(oe,"Rule config updated."),oe.ok?0:1}if(J==="sync")return ma(I,{global:O.global});if(J==="list"){let oe=X(I,{cwd:process.cwd()});return Qd(oe),oe.errors.length>0?1:0}if(J==="wrapper")return vb(I,O);if(J==="migrate")return Pu(I,{cleanup:O.cleanup,cwd:process.cwd()});if(J==="doc"){console.log(Wd);let oe=await Au(I);if(oe)console.error(oe);return 0}if(J==="verify")return _u(I);return 1}function pb(I){if(I.length===0)return kt;let _=kt.subcommands.filter((L)=>L.usage.split(" ")[0]===I[0]);if(_.length===0)return null;if(I.length===1&&_.length>1)return{name:`rule ${I[0]}`,description:`Subcommands of rule ${I[0]}`,usage:`rule ${I[0]} <subcommand>`,subcommands:_,options:[]};let O=I.length===1?_[0]:_.find((L)=>L.usage.split(" ")[1]===I[1]);if(!O)return null;return{name:`rule ${I[0]}`,description:O.description,usage:`rule ${O.usage}`,options:I[0]==="add"?xo:[],examples:I[0]==="add"?Co:void 0}}function fb(I){let _=gn({label:"rule",booleans:{global:["-g","--global"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"]},lists:{only:["--only"]},positionals:"list"},I),O={..._.flags,ref:_.values.ref,only:_.lists.only??[],help:_.help,positionals:_.positionals,errors:_.errors};return mb(O),O}function mb(I){let[_]=I.positionals;if(_&&!$u.has(_))I.errors.push(`Unknown rule subcommand: ${_}`);if(I.deleteSource&&_!=="remove")if(_&&$u.has(_))I.errors.push(`Unknown option for rule ${_}: --delete-source`);else I.errors.push("--delete-source is only valid with 'rule remove'");if(I.cleanup&&_!=="migrate")I.errors.push(cr(_,"--cleanup"));if(I.example&&_!=="init")I.errors.push(cr(_,"--example"));if(I.ref&&_!=="add")I.errors.push(cr(_,"--ref"));if(I.only.length>0&&_!=="add")I.errors.push(cr(_,"--only"));if(_==="add")gb(I);if(_==="migrate"){if(I.global)I.errors.push(cr(_,"--global"));if(I.positionals.length>1)I.errors.push(`Unexpected rule migrate argument: ${I.positionals[1]}`)}else if(_==="wrapper")hb(I);else if(I.positionals.length>2)I.errors.push(`Unexpected rule argument: ${I.positionals[2]}`);if(_==="list"&&I.global)I.errors.push("Unknown option for rule list: --global")}function Du(I){if(I.positionals[1])return I.positionals[1];if(I.ref||I.only.length>0)return db;return}function gb(I){let _=Du(I);if(!_)return;if((I.ref||I.only.length>0)&&!Y(_)){if(I.ref)I.errors.push(`--ref can only select a ref for an owner/repo source: ${_}`);if(I.only.length>0)I.errors.push("--only can only select rulebooks from an owner/repo source");return}if(I.ref&&!se(I.ref))I.errors.push(`--ref must use valid path segments: ${I.ref}`);let O=I.only.filter((L)=>!u.test(L));if(O.length>0)I.errors.push(`Invalid rulebook names: ${O.join(", ")}`)}function cr(I,_){return I?`Unknown option for rule ${I}: ${_}`:`Unknown option for rule: ${_}`}function hb(I){let _=I.positionals[1],O=I.positionals[2];if(!_){I.errors.push("rule wrapper requires add, remove, or list");return}if(!cb.has(_)){I.errors.push(`Unknown rule wrapper action: ${_}`);return}if(_==="list"){if(O)I.errors.push(`Unexpected rule wrapper argument: ${O}`);return}if(!O){I.errors.push(`rule wrapper ${_} requires a command`);return}if(I.positionals.length>3)I.errors.push(`Unexpected rule wrapper argument: ${I.positionals[3]}`)}function yb(I){if(r(I)===null){nu(I);return}let _=m(I);if(!_.config)return;wn(I,{version:1,rules:_.config.rules,overrides:_.config.overrides??{},transparent_wrappers:_.config.transparent_wrappers??[]})}async function vb(I,_){let O=_.positionals[1],L=_.positionals[2],J=kn(I,{global:_.global}).configTarget;if(O==="list"){let ue=m(J);if(ue.errors.length>0){for(let pe of ue.errors)console.error(pe);return 1}return bb(ue.config?.transparent_wrappers??[]),0}if(!L||!w.test(L))return console.error("transparent wrapper must match command pattern"),1;if(Ae(L))return console.error(`reserved command "${L}" cannot be a wrapper`),1;let K=m(J);if(K.errors.length>0){for(let ue of K.errors)console.error(ue);return 1}let ne=K.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},oe=O==="add"?[...new Set([...ne.transparent_wrappers??[],L])]:(ne.transparent_wrappers??[]).filter((ue)=>ue!==L);return wn(J,{version:1,rules:ne.rules,overrides:ne.overrides??{},transparent_wrappers:oe}),console.log(O==="add"?`Added transparent wrapper: ${L}`:`Removed transparent wrapper: ${L}`),0}function bb(I){if(I.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${I.length}):`);for(let _ of I)console.log(`  - ${_}`)}import{sep as Rb}from"node:path";import{existsSync as wb,readFileSync as kb}from"node:fs";import{join as xb}from"node:path";async function Cb(I){if(I.isTTY)return null;return(await qe(I).catch(()=>null))?.trim()||null}function Sb(I){let _=I.env.get("CLAUDE_SETTINGS_PATH");if(_)return _;return xb(Er(I),"settings.json")}function is(I){let _=Sb(I);if(!wb(_))return!1;try{let O=kb(_,"utf-8"),L=JSON.parse(O);if(!L.enabledPlugins)return!1;let J="cc-safety-net@cc-marketplace";if(!(J in L.enabledPlugins))return!1;return L.enabledPlugins[J]===!0}catch(O){if(v(n.debug,I.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${_}: ${O instanceof Error?O.message:String(O)}`);return!1}}async function ss(I,_=process.stdin){let O=is(I),L;if(!O)L="\uD83D\uDEE1️ CC Safety Net ❌";else{let K=E(I,{cwd:process.cwd()}),ne=K.policy,oe=T(ne,I.env),ue=Object.values(B(ne,oe.capabilities)).some((xe)=>xe.changesInherited),pe={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[ue?"custom":oe.effectiveLevel],we=K.policyScopes&&!K.policyScopes.weakeningsIgnored&&K.policyScopes.weakenings.length>0?"\uD83D\uDD3B":"";L=`\uD83D\uDEE1️ CC Safety Net ${pe}${oe.worktreeMode?"\uD83C\uDF33":""}${we}${K.state==="degraded"?"⚠️":""}`}let J=await Cb(_);if(J&&!J.startsWith("{"))console.log(`${J} | ${L}`);else console.log(L)}function Lu(I){let _=E(I,{cwd:process.cwd()}),O=_.policy,L=T(O,I.env),J=!!process.env.NO_COLOR||!process.stdout.isTTY,K=Math.min(process.stdout.columns||80,100),ne=J?"ok":"✔",oe=J?"OFF":"✘",ue=(en,Le)=>{let Ve=`  ${en.padEnd(13)}${Le}`;return(Ve.length>K?`${Ve.slice(0,K-1)}…`:Ve).replaceAll(oe,nn.red(oe))},pe=Object.values(B(O,L.capabilities)).some((en)=>en.changesInherited),we=(en)=>en===I.home||en.startsWith(`${I.home}${Rb}`)?`~${en.slice(I.home.length)}`:en,xe={ready:nn.green,degraded:nn.yellow}[_.state],Se=_.policyScopes?.weakenings??[],Pe=[...is(I)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],..._.diagnostics],Ce=J?"-":"·";console.log([`${J?"":"\uD83D\uDEE1️  "}CC Safety Net — ${xe(_.state)}`,"",ue("Protection",`destructive ${O.destructiveCommandProtectionEnabled?ne:oe}   secrets ${O.secretProtection.enabled?ne:oe}`),ue("Level",pe?`${L.effectiveLevel} (customised)`:L.effectiveLevel),ue("Rules",O.rules.length===0?"none active":`${O.rules.length} active`),ue("Policy",we(d(I))),..._.policyScopes?[ue("Project",we(b(process.cwd())))]:[],...L.worktreeMode?[ue("Worktree","relaxations active")]:[],"",...Se.length===0?[]:[_.policyScopes?.weakeningsIgnored?"  Project policy (ignored)":"  Project policy",...Se.flatMap((en)=>Zt(en,"      ",K-6).map((Le,Ve)=>Ve===0?`    ${Le}`:Le)),""],...Pe.length===0?["  Everything configured is active."]:["  Not active",...Pe.flatMap((en)=>Zt(en,"      ",K-6).map((Le,Ve)=>Ve===0?`    ${Ce} ${Le}`:Le)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as Ju}from"node:child_process";import{randomBytes as Lb}from"node:crypto";import{existsSync as Nb}from"node:fs";import{createServer as jb}from"node:http";import{Writable as Fb}from"node:stream";var ho=500;function Pb(I){let _=I.filter((J)=>J.decision!=="allow"),O=I.filter((J)=>J.decision==="allow"),L=Math.min(_.length,Math.max(ho-O.length,Math.ceil(ho/2)));return[..._.slice(0,L),...O.slice(0,ho-L)]}function Nu(I,_,O=F(I)){if(O)q(I,O);let L=(Le)=>new Date(Le.getFullYear(),Le.getMonth(),Le.getDate()).getTime(),J=L(new Date),K=new Date(J);K.setDate(K.getDate()-(_-1));let ne=K.getTime(),oe=[],ue={count:0};for(let Le of O?zn(O,ue):[])for(let Ve of wt(Le,ue)){let on=new Date(Ve.ts).getTime();if(!Number.isFinite(on))continue;if(on>=ne)oe.push(Ve)}oe.sort((Le,Ve)=>new Date(Ve.ts).getTime()-new Date(Le.ts).getTime());let pe=Array.from({length:_},()=>0),we=Array.from({length:_},()=>0),xe={},Se={},Pe={},Ce=0,en=0;for(let Le of oe){let Ve=Le.agent||"unknown";xe[Ve]=(xe[Ve]??0)+1;let on=Math.round((J-L(new Date(Le.ts)))/86400000),sn=_-1-on,an=on>=0&&on<_;if(an)we[sn]=(we[sn]??0)+1;if(Le.decision!=="allow"){if(Ce++,Le.ruleId)Se[Le.ruleId]=(Se[Le.ruleId]??0)+1;let rn=wo(Le.segment||Le.command);if(rn)Pe[rn]=(Pe[rn]??0)+1;if(Le.failureStage)en++;if(an)pe[sn]=(pe[sn]??0)+1}}return{days:_,logsDir:O,homeDir:I.home,totalInWindow:oe.length,truncated:oe.length>ho,unreadable:ue.count,counts:{blocked:Ce,allowed:oe.length-Ce,agents:xe,blockedByDay:pe,analyzedByDay:we,rules:Se,commands:Pe,errors:en},entries:Pb(oe).sort((Le,Ve)=>new Date(Ve.ts).getTime()-new Date(Le.ts).getTime())}}import{spawn as Eb}from"node:child_process";import{existsSync as Ab,statSync as ju}from"node:fs";import{delimiter as Ib,join as _b}from"node:path";var Tb=120000,yo="Choose the project folder",$b=`try
  return POSIX path of (choose folder with prompt "${yo}")
on error number -128
  return ""
end try`,Ob=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${yo}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Fu=[{binary:"zenity",args:["--file-selection","--directory",`--title=${yo}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",yo]}],Hu=(I,_)=>(_.PATH??"").split(Ib).some((O)=>{if(O.length===0)return!1;try{let L=ju(_b(O,I));return L.isFile()&&(L.mode&73)!==0}catch{return!1}});function as(I,_){if(I==="darwin"||I==="win32")return!0;if(I!=="linux")return!1;if(!_.DISPLAY&&!_.WAYLAND_DISPLAY)return!1;return Fu.some((O)=>Hu(O.binary,_))}function Db(I,_){if(I==="darwin")return{cmd:"osascript",args:["-e",$b]};if(I==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",Ob]};let O=Fu.find((L)=>Hu(L.binary,_));return O?{cmd:O.binary,args:O.args}:null}function ls(I=process.platform,_=process.env){let O=Db(I,_);if(!O)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((L)=>{let J=Eb(O.cmd,O.args,{env:_,stdio:["ignore","pipe","pipe"]}),K="",ne=!1,oe=(pe)=>{if(ne)return;ne=!0,clearTimeout(ue),L(pe)},ue=setTimeout(()=>{J.kill(),oe({error:"The folder dialog timed out"})},Tb);J.stdout.on("data",(pe)=>{K+=pe.toString()}),J.on("error",()=>oe({error:`Could not open the folder dialog (${O.cmd})`})),J.on("close",()=>{let pe=K.trim().replace(/\/+$/,"");if(!pe)return oe({cancelled:!0});if(!Ab(pe)||!ju(pe).isDirectory())return oe({error:"That selection is not a folder on disk"});oe({path:pe})})})}var Mu=`<!doctype html>
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
`;var Uu='<script id="ccsn-data" type="application/json">';function Gu(I){return Mu.replace(Uu,()=>Uu+JSON.stringify({token:I}).replaceAll("<","\\u003c"))}var vo="kenryu42/cc-safety-net",Hb=`https://github.com/${vo}`,us=1e4,Mb=7,Ub="The project draft directory changed; reload the draft before applying.",Gb="audit settings are user scope only; remove the audit section from a project proposal";async function zu(I,_={}){let O=gn({label:"gui",booleans:{noOpen:["--no-open"]}},I),L=_.log??console.log,J=_.error??console.error;if(O.errors.length>0){for(let ne of O.errors)J(ne);return J("Usage: cc-safety-net gui [--no-open]"),1}let K=await Bb(c,_);if(L(`CC Safety Net policy GUI: ${K.url}`),!O.flags.noOpen)try{await(_.openBrowser??ew)(K.url)}catch(ne){J(`Failed to open browser: ${ne instanceof Error?ne.message:String(ne)}`),J(`Open this URL manually: ${K.url}`)}if(_.keepAlive===!1)return await K.close(),0;return await Qb(K),0}async function Bb(I,_={}){let O=Lb(24).toString("base64url"),L={dir:null,revision:0},J=jb((oe,ue)=>{qb(I,oe,ue,O,_,L)});await new Promise((oe,ue)=>{J.once("error",ue),J.listen(0,"127.0.0.1",()=>{J.off("error",ue),oe()})});let ne=`http://127.0.0.1:${J.address().port}`;return{origin:ne,token:O,url:`${ne}/?token=${encodeURIComponent(O)}`,close:()=>Xb(J)}}async function qb(I,_,O,L,J,K){let ne=I(),oe=new URL(_.url??"/","http://127.0.0.1");if(_.method==="GET"&&oe.pathname==="/favicon.ico"){O.writeHead(204,{"cache-control":"no-store"}),O.end();return}if(!Wb(_,oe,L)){ln(O,403,{error:"Forbidden"});return}if(_.method==="GET"&&oe.pathname==="/"){Zb(O,Gu(L));return}if(_.method==="GET"&&oe.pathname==="/api/policy"){let ue=Gd(ne,J),pe=E(ne,cs(J));ln(O,200,{...ue,configState:$e(pe),...pe.policyScopes?{projectPolicy:{path:b(J.cwd??process.cwd()),weakenings:pe.policyScopes.weakeningsIgnored?[]:pe.policyScopes.weakenings}}:{},destructiveCommandRules:W,secretPatterns:Xe,version:pn(),preview:ue.errors.length>0?null:Ne(ue.policy,ne.env)});return}if(_.method==="POST"&&oe.pathname==="/api/policy/preview"){let ue=await dr(_);if(!ue.ok){ln(O,ue.status,{errors:[ue.error]});return}let pe=Bd(ne,ue.value);ln(O,pe.errors.length>0?400:200,pe);return}if(_.method==="POST"&&oe.pathname==="/api/policy/explain"){let ue=await dr(_);if(!ue.ok){ln(O,ue.status,{errors:[ue.error]});return}let pe=ue.value;if(pe===null||typeof pe.command!=="string"){ln(O,400,{errors:["command must be a string"]});return}let we=ir(pe.policy,ne.home);if(we.length>0){ln(O,400,{errors:we});return}ln(O,200,zb(ne,pe.command,pe.policy,J));return}if(_.method==="POST"&&oe.pathname==="/api/policy"){let ue=await dr(_);if(!ue.ok){ln(O,ue.status,{errors:[ue.error]});return}let pe=Hn(ne,ue.value,J);ln(O,pe.errors.length>0?400:200,pe);return}if(_.method==="POST"&&oe.pathname==="/api/reset"){ln(O,200,Hn(ne,ee,J));return}if(_.method==="POST"&&oe.pathname==="/api/repair"){ln(O,200,qd(ne,J));return}if(_.method==="POST"&&oe.pathname==="/api/policy/project/choose-directory"){let ue=await(J.chooseDirectory??ls)();if("path"in ue)K.dir=ue.path,K.revision+=1;ln(O,200,{cancelled:"cancelled"in ue,..."error"in ue?{error:ue.error}:{}});return}if(_.method==="GET"&&oe.pathname==="/api/policy/project"){let ue=Ku(K,J),pe=Bu(ue,ne.home),we=sr(ne,J);ln(O,200,{path:b(ue),revision:K.revision,baseline:we.baseline,userPolicyDiagnostics:we.diagnostics,projection:pe.projection,projectionDiagnostics:pe.diagnostics,canPickDirectory:as(process.platform,process.env)});return}if(_.method==="POST"&&oe.pathname==="/api/policy/project/diff"){let ue=await qu(ne,_,O,K,J);if(!ue)return;let pe=Bu(ue.dir,ne.home),we=sr(ne,J).baseline,xe=Q(we,le(ue.proposal,ne.home).policy);ln(O,200,{rows:ro(Q(we,pe.projection).policy,xe.policy,!1),weakenings:xe.weakenings,existingFileDiagnostics:pe.diagnostics});return}if(_.method==="POST"&&oe.pathname==="/api/policy/project/apply"){let ue=await qu(ne,_,O,K,J);if(!ue)return;let pe=Jb(ue.dir,ue.proposal,ne.home);ln(O,pe.errors.length>0?500:200,pe);return}if(_.method==="GET"&&oe.pathname==="/api/activity"){let ue=re(ne,J),pe=Kb(oe.searchParams.get("days"),ue);if(pe===null){ln(O,400,{error:`days must be an integer between 1 and ${ue}`});return}ln(O,200,Nu(ne,pe,J.activityLogsDir));return}if(_.method==="POST"&&oe.pathname==="/api/rules/choose-directory"){ln(O,200,await ls());return}if(_.method==="GET"&&oe.pathname==="/api/rules"){let ue=X(ne,cs(J)),pe=new Map(ue.rules.map((we)=>[we.name,we]));ln(O,200,{projectPath:J.cwd??process.cwd(),canPickDirectory:as(process.platform,process.env),rulebooks:ue.rulebooks.map((we)=>({source:we.source,spec:we.spec,name:we.name,version:we.version,rules:we.rules.flatMap((xe)=>{let Se=pe.get(xe);if(!Se)return[];return[{name:Se.name,command:Se.command,subcommand:Se.subcommand,block_args:Se.block_args,reason:Se.reason}]})})),errors:ue.errors,warnings:ue.warnings});return}if(_.method==="GET"&&oe.pathname==="/api/star/context"){ln(O,200,await(J.fetchStarContext??(()=>sw(ne,{logsDir:J.activityLogsDir})))());return}if(_.method==="POST"&&oe.pathname==="/api/star"){let ue=await(J.starRepo??nw)();ln(O,200,ue.ok?{ok:!0}:{ok:!1,fallbackUrl:Hb});return}if(_.method==="GET"&&oe.pathname==="/api/integrations"){ln(O,200,await(J.fetchIntegrations??(()=>tw(ne)))());return}if(_.method==="GET"&&oe.pathname==="/api/health"){ln(O,200,await(J.fetchHealth??ow)());return}if(_.method==="POST"&&(oe.pathname==="/api/install"||oe.pathname==="/api/uninstall")){let ue=await dr(_);if(!ue.ok){ln(O,ue.status,{errors:[ue.error]});return}let pe=ue.value?.target;if(typeof pe!=="string"||!$n.some((xe)=>xe.target===pe)){ln(O,400,{error:"unknown target"});return}let we=oe.pathname==="/api/install"?"install":"uninstall";ln(O,200,await(J.runIntegration??iw)(we,pe));return}ln(O,404,{error:"Not found"})}function cs(I){return{...I,cwd:I.cwd??process.cwd()}}function Ku(I,_){return I.dir??_.cwd??process.cwd()}function Bu(I,_){let O=b(I),L=Nb(O)?vt(O):{value:void 0,errors:[]},J=le(L.value,_);return{projection:J.policy,diagnostics:[...L.errors,...J.diagnostics]}}async function qu(I,_,O,L,J){let K=Ku(L,J),ne=L.revision,oe=await dr(_);if(!oe.ok)return ln(O,oe.status,{errors:[oe.error]}),null;let ue=oe.value;if(typeof ue?.revision!=="number")return ln(O,400,{errors:["revision must be a number"]}),null;if(ue.revision!==ne)return ln(O,409,{errors:[Ub]}),null;let pe=Vb(ue.proposal,I.home);if(pe.length>0)return ln(O,400,{errors:pe}),null;return{dir:K,proposal:ue.proposal}}function Vb(I,_){let O=ir(I,_);if(O.length>0)return O;return I?.audit===void 0?[]:[Gb]}function Jb(I,_,O){let L=b(I),J=oo(_,C(_,O));try{return g(i(x(I,"project policy"),L),`${JSON.stringify(J,null,2)}
`),{path:L,errors:[]}}catch(K){return{path:L,errors:[K instanceof Error?K.message:String(K)]}}}function zb(I,_,O,L){let J=C(O,I.home),K=E(I,cs(L)),ne=Te({rules:K.policy.rules,transparentWrappers:K.policy.transparentWrappers,safety:Me(J.safety),worktreeMode:J.workflow.worktree_mode,destructiveCommandProtectionEnabled:J.destructive_command_protection.enabled,destructiveCommandRuleOverrides:J.destructive_command_protection.overrides,destructiveCommandAllowPaths:J.destructive_command_protection.allow_paths,secretProtection:{enabled:J.secret_protection.enabled,disabledRules:Fe(J.secret_protection.overrides),denyPaths:J.secret_protection.deny_paths,allowPaths:J.secret_protection.allow_paths}});return Xt(_,{policySnapshot:ne,cwd:L.cwd,userConfigDir:L.userConfigDir},I)}function Kb(I,_){if(I===null)return Math.min(Mb,_);let O=Number(I);if(!Number.isInteger(O)||O<1||O>_)return null;return O}function Wb(I,_,O){if(_.searchParams.get("token")!==O)return!1;if(I.method!=="POST")return!0;return I.headers["x-cc-safety-net-token"]===O}var Yb=1048576;async function dr(I){let _=[],O=0;for await(let L of I){let J=L;if(O+=J.byteLength,O>Yb)return{ok:!1,status:413,error:"Request body is too large"};_.push(J)}try{return{ok:!0,value:JSON.parse(Buffer.concat(_).toString("utf-8")||"{}")}}catch(L){return{ok:!1,status:400,error:`Invalid JSON: ${L instanceof Error?L.message:String(L)}`}}}function Zb(I,_){I.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),I.end(_)}function ln(I,_,O){I.writeHead(_,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),I.end(JSON.stringify(O))}function Xb(I){return new Promise((_,O)=>{I.close((L)=>L?O(L):_())})}function Qb(I){return new Promise((_)=>{let O=()=>{process.off("SIGINT",L),process.off("SIGTERM",L)},L=()=>{O(),I.close().then(_)};process.once("SIGINT",L),process.once("SIGTERM",L)})}function ew(I){let _=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",O=process.platform==="win32"?["/c","start","",I]:[I];return new Promise((L,J)=>{let K=Ju(_,O,{detached:!0,stdio:"ignore"}),ne=(ue)=>{K.off("spawn",oe),J(ue)},oe=()=>{K.off("error",ne),K.unref(),L()};K.once("error",ne),K.once("spawn",oe)})}async function nw(I="gh",_=us){return{ok:await ds(I,["api","-X","PUT",`/user/starred/${vo}`],_)===0}}async function tw(I,_={}){let O=await kr((J)=>$t({environment:I,cwd:process.cwd(),openCodeVersion:J}).status!=="n/a",_.fetcher),L=rw(I,O);return{targets:En.map((J)=>{let K=L.find((ne)=>ne.platform===J.id);return{target:J.id,label:mn(J.id),version:O.versions[J.id]??null,status:K?.configured?"active":K?.detected?"disabled":K?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:O.version,nodeVersion:O.nodeVersion,platform:O.platform}}}function rw(I,_){return Ot(I,process.cwd(),{ampPluginListOutput:_.ampPluginListOutput,codexPluginListOutput:_.codexPluginListOutput,copilotCliVersion:_.versions["copilot-cli"],openCodeVersion:_.versions.opencode,openCodePluginListOutput:_.openCodePluginListOutput})}async function ow(I={}){let _=await(I.checkUpdates??Gn)();return{update:{latestVersion:_.latestVersion??null,updateAvailable:_.updateAvailable}}}var Vu=Promise.resolve();function iw(I,_,O={}){let L=async()=>{let K=[],{log:ne,error:oe}=console;console.log=(...ue)=>K.push(ue.map(String).join(" ")),console.error=console.log;try{return{ok:await or(I,[],{selectTargets:async()=>[_],output:new Fb({write(pe,we,xe){K.push(String(pe).replace(/\n$/,"")),xe()}}),...O})===0,output:K.join(`
`)}}finally{console.log=ne,console.error=oe}},J=Vu.then(L);return Vu=J.then(()=>{return},()=>{return}),J}async function sw(I,_={}){let[O,L,J]=await Promise.all([aw(_.command),lw(_.fetchRepo),Promise.resolve(hr(I,re(I),_.logsDir).totalBlocked)]);return{starred:O,starCount:L,blockedTotal:J}}async function aw(I="gh",_=us){if(await ds(I,["auth","status"],_)!==0)return null;let O=await ds(I,["api",`/user/starred/${vo}`],_);if(O===0)return!0;if(O===null)return null;return!1}function ds(I,_,O){return new Promise((L)=>{let J=Ju(I,_,{stdio:"ignore",windowsHide:!0}),K=!1,ne=setTimeout(()=>{J.kill(),oe(null)},O),oe=(ue)=>{if(K)return;K=!0,clearTimeout(ne),L(ue)};J.once("error",()=>oe(null)),J.once("close",oe)})}async function lw(I=fetch){try{let _=await I(`https://api.github.com/repos/${vo}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(us)});if(!_.ok)return null;let O=await _.json();return typeof O.stargazers_count==="number"?O.stargazers_count:null}catch{return null}}function cw(I){if(I[0]!=="help")return!1;let _=I[1];if(!_)Di(),process.exit(0);if(Qt(_))process.exit(0);console.error(`Unknown command: ${_}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var dw={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),Qt("hook",console.error),process.exit(1)},install:async(I)=>{process.exit(await or("install",I))},update:async(I)=>{process.exit(await Wi(I))},uninstall:async(I)=>{process.exit(await or("uninstall",I))},rule:async(I)=>{process.exit(await Ou(c(),I))},policy:async(I)=>{process.exit(await Kd(c(),I))},status:async(I)=>{if(Dn(gn({label:"status"},I).errors))process.exit(1);Lu(c())},statusline:async(I)=>{let _=gn({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},I);if(_.errors.length===0&&_.flags.claudeCode){await ss(c());return}if(Dn(_.errors),!_.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");Qt("statusline",console.error),process.exit(1)},doctor:async(I)=>{let _=Pi(I);if(!_)process.exit(1);let O=await dc(c(),{json:_.json,skipUpdateCheck:_.skipUpdateCheck});process.exit(O)},logs:async(I)=>{process.exit(await bs(c(),I))},gui:async(I)=>{process.exit(await zu(I))},explain:async(I)=>{process.exit(await kc(c(),I))}};async function uw(I){let _=gn({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},I);if(cw(I))return;let O=I[0],L=O?gr(O):void 0;if(_.help&&L&&L.name!=="rule")Qt(L.name),process.exit(0);if(!O||_.help&&!L)Di(),process.exit(0);if(_.flags.version)Sc(),process.exit(0);if(L){await dw[L.name](I.slice(1));return}if(O==="--statusline"){await ss(c());return}console.error(O.startsWith("-")?`Unknown option: ${O}`:`Unknown command: ${O}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{uw as runCli};
