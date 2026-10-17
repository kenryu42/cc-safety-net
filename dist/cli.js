import{a,s,Me,nt,T,bt,rt,c,n,ot,P,S,me,vt,m,Ie,x,st,l,o,w,i,ae,r,g,he,B,wt,Ct,p,ye,be,Et,M,X,ce,C,kt,I,h,Ae,z,u,O,Q,at,ct,F,E,D,xe,ve,$e,le,d,e,Ue,Oe,je,Se,lt,ut,ue,De,de,Ge,ee,V,He,we,q,dt,K,te,ne,pe,pt,ft,k,A,We,mt,ze,R,Ve,Ne,qe,y,t,re,Ce,b,U,v,N,Rt,Ke,Je,f,j}from"./chunks/index-z14g58a6.js";import{Qe}from"./chunks/index-3cvh9qs5.js";import{Ye,ke}from"./chunks/index-rkmdr41r.js";import{et}from"./chunks/index-vzvtmdvc.js";import"./chunks/index-amr728xf.js";import{ie,J,tt,H,W}from"./chunks/index-p6xns5ed.js";var cf=["-h","--help"];function mn(_,L){let G=Object.entries(_.booleans??{}),Y=Object.entries(_.values??{}),Z=Object.entries(_.lists??{}),oe=Object.fromEntries(G.map(([Le])=>[Le,!1])),se={},fe=Object.fromEntries(Z.map(([Le])=>[Le,[]])),ge=[],Pe=[],Ee=!1,Re=-1;for(let[Le,_e]of L.entries()){if(Le<=Re)continue;if(_e==="--"){ge.push(...L.slice(Le+1));break}if(cf.includes(_e)){Ee=!0;continue}let Te=G.find(([,Ze])=>Ze.includes(_e));if(Te){oe[Te[0]]=!0;continue}let Be=Y.find(([,Ze])=>Ze.includes(_e));if(Be){let Ze=L[Le+1];if(Ze===void 0||Ze.startsWith("-")){Pe.push(`${_e} requires a value`);continue}se[Be[0]]=Ze,Re=Le+1;continue}let Fe=Z.find(([,Ze])=>Ze.includes(_e));if(Fe){let Ze=L.slice(Le+1),tn=Ze.findIndex((an)=>an.startsWith("-")),on=Ze.slice(0,tn===-1?Ze.length:tn);if(on.length===0){Pe.push(`${_e} requires at least one value`);continue}fe[Fe[0]]=[...fe[Fe[0]]??[],...on],Re=Le+on.length;continue}if(_e.startsWith("-")){Pe.push(`Unknown option for ${_.label}: ${_e}`);continue}if(_.positionals==="tail"){ge.push(...L.slice(Le));break}ge.push(_e)}if(_.positionals!=="list"&&_.positionals!=="tail")Pe.push(...ge.map((Le)=>`Unexpected argument for ${_.label}: ${Le}`));return{flags:oe,values:se,lists:fe,positionals:ge,help:Ee,errors:Pe}}function $n(_){for(let L of _)console.error(L);return _.length>0}import{readdirSync as yf,statSync as Ys,unlinkSync as hf}from"node:fs";import{basename as Zs,dirname as vf,isAbsolute as bf,join as wf,relative as kf,resolve as Cf,sep as xf}from"node:path";var Js=(_)=>{let L=Date.now()-new Date(_).getTime();if(!Number.isFinite(L))return"";let G=Math.floor(L/60000),Y=Math.floor(G/60),Z=Math.floor(Y/24);if(Z>0)return`${Z}d ago`;if(Y>0)return`${Y}h ago`;if(G>0)return`${G}m ago`;return"just now"},Go=(_)=>{let L=(_??"").trim().split(/\s+/).filter((Z)=>Z&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(Z)),G=L[0]?.split("/").pop();if(!G)return null;let Y=L[1];return Y&&/^[a-z][a-z0-9-]*$/.test(Y)?`${G} ${Y}`:G};function Ws(_){let L=(Z)=>`${Z.sessionId}
${Go(Z.segment||Z.command)}`,G=_.filter((Z)=>Z.decision!=="allow"),Y=G.filter((Z)=>Z.sessionId).reduce((Z,oe)=>Z.set(L(oe),(Z.get(L(oe))??0)+1),new Map);return new Set(G.filter((Z)=>Z.failureStage||(Y.get(L(Z))??0)>=2))}import{existsSync as df,readdirSync as uf,readFileSync as pf}from"node:fs";import{join as ff}from"node:path";function Yn(_,L){try{return uf(_,{withFileTypes:!0,encoding:"utf8"}).flatMap((G)=>{let Y=ff(_,G.name);if(G.isDirectory())return Yn(Y,L);if(G.name.endsWith(".jsonl"))return[Y];return[]})}catch{if(L&&df(_))L.count++;return[]}}var mf=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function gf(_){if(!_||typeof _!=="object"||Array.isArray(_))return!1;let L=_;if(typeof L.ts!=="string"||typeof L.command!=="string")return!1;return mf.every((G)=>L[G]===void 0||typeof L[G]==="string")}function Dt(_,L){try{return pf(_,"utf-8").split(`
`).filter(Boolean).flatMap((G)=>{try{let Y=JSON.parse(G);if(!gf(Y)){if(L)L.count++;return[]}return[Y]}catch{if(L)L.count++;return[]}})}catch{if(L)L.count++;return[]}}function gn(_){return Array.from(_,(L)=>{let G=L.charCodeAt(0);if(G<=31||G>=127&&G<=159)return`\\x${G.toString(16).padStart(2,"0")}`;return L}).join("")}function Sf(_,L){let G=ie(_),Y=mn({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},L);if($n(Y.errors))return null;if(Y.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(Y.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let Z=Y.values.limit===void 0?20:zs(Y.values.limit);if(Z===null)return console.error("--limit must be a positive number"),null;let oe=Y.values.since===void 0?Math.min(30,G):zs(Y.values.since);if(oe===null||oe>G)return console.error(`--since must be a positive number of days no greater than ${G}`),null;let se={limit:Z,limitExplicit:Y.values.limit!==void 0,since:oe,sinceExplicit:Y.values.since!==void 0,all:Y.flags.all,json:Y.flags.json,suspect:Y.flags.suspect,pruneLegacy:Y.flags.pruneLegacy,dryRun:Y.flags.dryRun,id:Y.values.id,agent:Y.values.agent,rule:Y.values.rule,session:Y.values.session,project:Y.values.project===void 0?void 0:Cf(Y.values.project)};if(se.id&&(se.agent!==void 0||se.rule!==void 0||se.session!==void 0||se.project!==void 0||se.suspect||se.sinceExplicit||se.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(se.pruneLegacy&&(se.id!==void 0||se.agent!==void 0||se.rule!==void 0||se.session!==void 0||se.project!==void 0||se.suspect||se.all||se.sinceExplicit||se.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(se.dryRun&&!se.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return se}async function Xs(_,L,G={}){let Y=Sf(_,L);if(!Y)return 1;let Z=G.logsDir??H(_);if(Y.pruneLegacy)return Pf(Z,Y.json,Y.dryRun);if(!Z)return console.log(Y.json?"[]":Y.id?`No retained audit log entry found for id ${gn(Y.id)}.`:"No audit log entries found."),0;J(_,Z);let oe={count:0},se=Yn(Z,oe).flatMap((Re)=>Dt(Re,oe).map((Le)=>({entry:Le,file:Re})));if(oe.count>0)console.error(`warning: ${oe.count} audit log ${oe.count===1?"source":"sources"} could not be read; these results are incomplete`);if(Y.id)return Tf(se,Y,G.timeZone);let fe=Date.now()-Y.since*24*60*60*1000,ge=se.filter((Re)=>If(Re,Y,Z,fe)),Pe=Y.suspect?Ws(ge.map((Re)=>Re.entry)):null,Ee=(Pe?ge.filter((Re)=>Pe.has(Re.entry)):ge).sort((Re,Le)=>Date.parse(Le.entry.ts)-Date.parse(Re.entry.ts)).slice(0,Y.limit);if(Y.json)return console.log(JSON.stringify(Ee.map((Re)=>Re.entry),null,2)),0;if(Ee.length===0)return console.log("No audit log entries found."),0;for(let Re of Ee)console.log($f(Re.entry,G.timeZone));return 0}function Pf(_,L,G){let Y=_?Rf(_).map((fe)=>wf(_,fe)):[];if(G)return Ef(Y,L);let Z=[],oe=0,se=0;for(let fe of Y){let ge=Ys(fe,{throwIfNoEntry:!1})?.size??0,Pe=_f(fe);if(Pe){Z.push(`${Zs(fe)}: ${Pe}`);continue}oe++,se+=ge}if(L)return console.log(JSON.stringify({removedFiles:oe,removedBytes:se,failedFiles:Z.length})),Z.length===0?0:1;console.log(oe===0&&Z.length===0?"No legacy audit log files found.":`Removed ${oe} legacy audit log ${oe===1?"file":"files"} (${Qs(se)}).`);for(let fe of Z)console.error(`Could not remove ${gn(fe)}`);if(console.log("Nested v2 audit logs were not changed."),oe>0)console.log("This deletion cannot be undone.");return Z.length===0?0:1}function Ef(_,L){let G=_.reduce((Y,Z)=>Y+(Ys(Z,{throwIfNoEntry:!1})?.size??0),0);if(L)return console.log(JSON.stringify({dryRun:!0,files:_.length,bytes:G})),0;if(console.log(_.length===0?"No legacy audit log files found.":`Would remove ${_.length} legacy audit log ${_.length===1?"file":"files"} (${Qs(G)}).`),console.log("Nested v2 audit logs are not included."),_.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function Rf(_){try{return yf(_,{withFileTypes:!0}).filter((L)=>L.isFile()&&L.name.endsWith(".jsonl")).map((L)=>L.name)}catch{return[]}}function _f(_){try{return hf(_),null}catch(L){return L instanceof Error?L.message:String(L)}}function Qs(_){let L=["B","KiB","MiB","GiB"],G=Math.min(Math.floor(Math.log2(Math.max(_,1))/10),L.length-1);return`${Math.round(_/1024**G*10)/10} ${L[G]}`}function Tf(_,L,G){let Y=_.filter((oe)=>oe.entry.id===L.id);if(Y.length>1)return console.error(`Multiple audit log entries found for id ${gn(L.id??"")}.`),1;if(L.json)return console.log(JSON.stringify(Y.map((oe)=>oe.entry),null,2)),0;let Z=Y[0];if(!Z)return console.log(`No retained audit log entry found for id ${gn(L.id??"")}.`),0;return console.log(Df(Z.entry,G)),0}function If(_,L,G,Y){if(!L.all&&_.entry.decision==="allow")return!1;if(Date.parse(_.entry.ts)<Y)return!1;if(L.agent!==void 0&&_.entry.agent!==L.agent)return!1;if(L.rule!==void 0&&_.entry.ruleId!==L.rule)return!1;if(L.session!==void 0&&!Af(_,G,L.session))return!1;if(L.project!==void 0&&!Of(_.entry.cwd,L.project))return!1;return!0}function Af(_,L,G){if(_.entry.sessionId===G)return!0;return vf(_.file)===L&&Zs(_.file,".jsonl")===G}function Of(_,L){if(!_)return!1;let G=kf(L,_);return G!==".."&&!G.startsWith(`..${xf}`)&&!bf(G)}function $f(_,L){let G=gn(_.id??"-"),Y=gn(_.decision??"deny"),Z=_.cwd?`  [${gn(_.cwd)}]`:"",oe=_.segment||_.command,se=oe===_.command?"":"↳ ",fe=oe.length>50?`${oe.slice(0,50)}…`:oe;return`${G.padEnd(16)}  ${gn(ea(_.ts,L))}  ${Y.padEnd(5)}  ${gn(_.agent??"-").padEnd(15)}  ${gn(_.ruleId??"-").padEnd(20)}  ${se}${gn(fe)}${Z}`}function Df(_,L){let G=(Z)=>gn(Z===void 0||Z===null||Z===""?"-":Z),Y=_.shape?`${_.agent??"-"} (shape: ${_.shape})`:_.agent??"-";return[`id:        ${G(_.id)}`,`ts:        ${G(ea(_.ts,L))}`,`decision:  ${G(_.decision)}`,`agent:     ${G(Y)}`,`level:     ${G(_.level)}`,`tool:      ${G(_.toolName)}`,`rule:      ${G(_.ruleId)}`,`intent:    ${G(_.intent)}`,`stage:     ${G(_.failureStage)}`,`error:     ${G(_.errorCode)}`,`session:   ${G(_.sessionId)}`,`cwd:       ${G(_.cwd)}`,`version:   ${G(_.v)}`,`truncated: ${G(_.truncated===!0?"yes":void 0)}`,`reason:    ${G(_.reason)}`,`command:   ${G(_.command)}`,`segment:   ${G(_.segment)}`].join(`
`)}function ea(_,L){let G=new Date(_);if(Number.isNaN(G.getTime()))return _;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:L}).format(G)}function zs(_){let L=Number(_);return Number.isFinite(L)&&L>0?L:null}var na={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var ta={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var ra={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var Bo=["npx","--offline","--no-install","@deepseek-ai/dsh","--version"],oa=["cursor-agent","--version"],ia=[{id:"antigravity-cli",displayName:"Antigravity CLI",runtime:{flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",runtime:{displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",runtime:{flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",runtime:{flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",runtime:{flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",runtime:{flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",runtime:{flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",runtime:{flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",install:{flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",install:{flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",install:{flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",runtime:{flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"deepseek-harness",displayName:"DeepSeek Harness",install:{flag:"--deepseek-harness",artifactKind:"package",probeCommand:Bo}},{id:"devin",displayName:"Devin CLI",runtime:{flags:["-dv","--devin"],description:"Run as Devin CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--devin",artifactKind:"hook config",probeCommand:["devin","--version"]}},{id:"droid",displayName:"Factory Droid",runtime:{flags:["-fd","--droid"],description:"Run as Factory Droid PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--droid",artifactKind:"hook config",probeCommand:["droid","--version"]}},{id:"amp",displayName:"Amp Code",install:{flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],qo=ia.slice().sort((_,L)=>_.displayName.localeCompare(L.displayName,"en")),Rr=qo.map((_)=>_.id).sort((_,L)=>Number(L==="claude-code")-Number(_==="claude-code")),Qt=qo.filter((_)=>("runtime"in _)).map((_)=>({id:_.id,displayName:"displayName"in _.runtime?_.runtime.displayName:_.displayName,flags:_.runtime.flags,legacyFlags:"legacyFlags"in _.runtime?_.runtime.legacyFlags:[],description:_.runtime.description,legacyTopLevelFlags:_.runtime.legacyTopLevelFlags})),En=qo.map((_)=>({id:_.id,..._.install})),Nf=Object.fromEntries(ia.map((_)=>[_.id,_.displayName]));function cn(_){return Nf[_]}var Lf=Qt.map((_)=>({flags:_.flags.join(", "),description:_.description})),jf=Qt.flatMap((_)=>_.flags.map((L)=>`cc-safety-net hook ${L}`)),sa={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Lf,{flags:"-h, --help",description:"Show this help"}],examples:jf};var aa={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...En.map((_)=>({flags:_.flag,description:`Install ${cn(_.id)} ${_.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...En.map((_)=>`cc-safety-net install ${_.flag}`)]},la={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...En.map((_)=>({flags:_.flag,description:`Uninstall ${cn(_.id)} ${_.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...En.map((_)=>`cc-safety-net uninstall ${_.flag}`)]},ca={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var da={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var _r={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var Vo=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],Ko=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],Nt={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"tool add <name...> [--cwd-arg <name>] [--project]",description:"Analyze community shell tools (user scope by default)"},{usage:"tool remove <name...> [--project]",description:"Stop analyzing declared tools"},{usage:"tool list",description:"List declared command tools in both scopes"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},{flags:"--project",description:"Use project-scope rule config with rule tool"},{flags:"--cwd-arg",argument:"<name>",description:"Name the working-directory argument with rule tool add"},...Vo.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk","cc-safety-net rule tool add ops_bash","cc-safety-net rule tool add ops_run_background --cwd-arg cwd --project",...Ko,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var ua={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var pa={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var Tr=[ua,na,da,ta,Nt,_r,aa,ca,la,sa,ra,pa];function Hf(_){return _.aliases??[]}function Ir(_){let L=_.toLowerCase();return Tr.find((G)=>G.name.toLowerCase()===L||Hf(G).some((Y)=>Y.toLowerCase()===L))}import{existsSync as Ah}from"node:fs";import{basename as Ff}from"node:path";function Ar(_,L=7,G=H(_)){let Y=Date.now()-L*24*60*60*1000,Z=[],oe=new Set,se=0,fe,ge,Pe,Ee;if(G)J(_,G);let Re={count:0},Le=G?Yn(G,Re):[];for(let Te of Le)for(let Be of Dt(Te,Re)){if(Be.decision==="allow")continue;let Fe=new Date(Be.ts).getTime();if(Fe>=Y){if(se++,oe.add(Be.sessionId??Ff(Te,".jsonl")),ge===void 0||Fe<=ge)fe=Be.ts,ge=Fe;if(Ee===void 0||Fe>Ee)Pe=Be.ts,Ee=Fe;Mf(Z,Be,Fe)}}let _e=Z.map((Te)=>({timestamp:Te.ts,command:Te.command,reason:Te.reason,relativeTime:Js(new Date(Te.ts))}));return{totalBlocked:se,sessionCount:oe.size,recentEntries:_e,oldestEntry:fe,newestEntry:Pe,unreadable:Re.count}}function Mf(_,L,G){let Y=_.findIndex((Z)=>G>new Date(Z.ts).getTime());if(Y===-1){if(_.length<3)_.push(L);return}if(_.splice(Y,0,L),_.length>3)_.pop()}import{dirname as Xf}from"node:path";import{dirname as Uf,join as Gf,resolve as Bf}from"node:path";var qf="config.json";function bn(_,L,G,Y){g(Vf(_),`${JSON.stringify(L,null,2)}
`,G,Y)}function Vf(_){return typeof _==="string"?ae(_):_}function Wo(_){return{errors:ue(Jf(_),": "," "),ruleNames:new Set(Ge(_).map((L)=>L.toLowerCase()))}}var Kf="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",fa="must match pattern (letters, numbers, hyphens, underscores)";function Jf(_){if(!ma(_))return[e([],"Config must be an object")];return[..._.version===1?[]:[e(["version"],"must be 1")],...Wf(_.rules)]}function Wf(_){if(_===void 0)return[];if(!Array.isArray(_))return[e(["rules"],"must be an array")];return[..._.flatMap((L,G)=>ma(L)?zf(L,["rules",G]):[e(["rules",G],"must be an object")]),...Ue(_)]}function zf(_,L){return[...Jo(_.name,[...L,"name"],"required string",p,Kf),...Jo(_.command,[...L,"command"],"required string",E,fa),..._.subcommand===void 0?[]:Jo(_.subcommand,[...L,"subcommand"],"must be a string if provided",E,fa),...Yf(_.block_args,[...L,"block_args"]),...Zf(_.reason,[...L,"reason"]),..._.intent===void 0||De(_.intent)?[]:[e([...L,"intent"],Oe)]]}function Jo(_,L,G,Y,Z){if(typeof _!=="string")return[e(L,G)];return Y.test(_)?[]:[e(L,Z)]}function Yf(_,L){if(!Array.isArray(_))return[e(L,"required array")];if(_.length===0)return[e(L,"must have at least one element")];return _.flatMap((G,Y)=>{if(typeof G!=="string")return[e([...L,Y],"must be a string")];return G===""?[e([...L,Y],"must not be empty")]:[]})}function Zf(_,L){if(typeof _!=="string")return[e(L,"required string")];if(_==="")return[e(L,"must not be empty")];return _.length>D?[e(L,`must be at most ${D} characters`)]:[]}function ma(_){return!!_&&typeof _==="object"&&!Array.isArray(_)}function zo(_){let L=ga(_);if(!L.ok)return L.result;return Wo(L.parsed)}function ga(_){let L=[],G=new Set;try{let Y=typeof _==="string"?ae(_):_,Z=r(Y);if(Z===null)return L.push(`File not found: ${Y.path}`),{ok:!1,result:{errors:L,ruleNames:G}};if(!Z.trim())return L.push("Config file is empty"),{ok:!1,result:{errors:L,ruleNames:G}};return{ok:!0,parsed:JSON.parse(Z)}}catch(Y){if(Y instanceof o)return L.push(Y.message),{ok:!1,result:{errors:L,ruleNames:G}};let Z=Y instanceof Error?Y.message:String(Y);return L.push(Y instanceof SyntaxError?"Invalid JSON":Z),{ok:!1,result:{errors:L,ruleNames:G}}}}function Lt(_){return Bf(_,".safety-net.json")}function Un(_){let L=ga(_);if(!L.ok)return L.result;let G=lt(L.parsed);return{errors:G.errors,ruleNames:G.sources}}function jt(_,L={}){return Gf(Uf(Ae(_,L)),qf)}function ya(_,L,G){let Y;try{if(r(L)===null)return{path:_,exists:!1,valid:!1,ruleCount:0};Y=Un(L),Y.errors.push(...V(_,G))}catch(Z){if(!(Z instanceof o))throw Z;Y={errors:[Z.message],ruleNames:new Set}}return{path:_,exists:!0,valid:Y.errors.length===0,ruleCount:Y.ruleNames.size,...Y.errors.length>0?{errors:Y.errors}:{}}}function Qf(_,L){return{source:L,name:_.name,command:_.command,subcommand:_.subcommand,blockArgs:[..._.block_args],reason:_.reason}}function ha(_,L){let G=z(_),Y=I(L),Z=Xf(G),oe=ee(_,{cwd:L,userConfigPath:G,projectConfigPath:Y,userConfigDir:Z}),se=Q(_,{cwd:L,userConfigPath:G,projectConfigPath:Y,userConfigDir:Z}),fe=new Map(oe.rulebooks.flatMap((ge)=>ge.rules.map((Pe)=>[Pe,ge.source])));return{userConfig:ya(G,se.userConfigTarget,se.userScope),projectConfig:ya(Y,se.projectConfigTarget,se.projectScope),effectiveRules:oe.rules.map((ge)=>Qf(ge,fe.get(ge.name)??"project"))}}var em=[{flag:n.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:n.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:n.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:n.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:n.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:n.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:n.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:n.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"},{flag:n.projectTightenOnly,description:"Ignore project policy settings that weaken the user policy",defaultBehavior:"off"}];function va(_){return[...em.map((L)=>({name:L.flag.name,value:me(L.flag,_.env),isSet:vt(L.flag,_.env),legacyName:L.flag.legacyName,legacyValue:L.flag.legacyName?_.env.get(L.flag.legacyName):void 0,legacyIsSet:L.flag.legacyName?_.env.get(L.flag.legacyName)!==void 0:void 0,description:L.description,defaultBehavior:L.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:_.env.get("CC_SAFETY_NET_HOME"),isSet:_.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var ba={error:0,warning:1,info:2},nm=["policy","config","audit"];function tm(_){return _.map((L)=>{if(L==="ownership")return"is not owned by the current user";if(L==="permissions")return"has unsafe permissions";if(L==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var rm=[{derive:(_)=>_.hooks.length>0&&_.hooks.every((L)=>!L.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(_)=>_.hooks.filter((L)=>L.inspectionStatus==="failed").map((L)=>{let G=cn(L.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${G} inspection failed`,detail:`Doctor could not verify the ${G} integration configuration.`,fixHint:`Correct the reported ${G} configuration error, then run \`cc-safety-net doctor\` again.`,integration:L.platform}})},{derive:(_)=>_.userConfig.exists&&!_.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:_.userConfig.path}]:[]},{derive:(_)=>_.projectConfig.exists&&!_.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:_.projectConfig.path}]:[]},{derive:(_)=>_.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${_.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(_)=>_.v2Leftovers&&_.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${_.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(_)=>_.legacyConfigs&&_.legacyConfigs.length>0?[{checkId:"config.legacy-ignored",severity:"warning",title:"Legacy inline rule configs are ignored",detail:`CC Safety Net no longer loads these files, so their rules enforce nothing: ${_.legacyConfigs.join(", ")}.`,fixHint:"Run `cc-safety-net rule migrate` to convert them (add `--cleanup` to delete each file once it is converted), then rerun doctor."}]:[]},{derive:(_)=>{let L=_.environment.find((G)=>G.name==="CC_SAFETY_NET_AUDIT_SCOPE");return ot(L?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...nm.map((_)=>({derive:(L)=>L.posture.directories.filter((G)=>G.kind===_&&G.status==="unsafe").map((G)=>({checkId:`posture.${_}-directory-unsafe`,severity:"error",title:`${_[0]?.toUpperCase()}${_.slice(1)} directory is unsafe`,detail:`The ${_} directory ${tm(G.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...G.path?{path:G.path}:{}}))})),{derive:(_)=>{let L=[..._.effectiveSafety.weakenedRuleOverrides].sort();return L.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${L.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${L.join(", ")}.`}]:[]}}];function wa(_){return rm.flatMap((L,G)=>L.derive(_).map((Y,Z)=>({finding:Y,catalogOrder:G,occurrence:Z}))).sort((L,G)=>ba[L.finding.severity]-ba[G.finding.severity]||L.catalogOrder-G.catalogOrder||L.occurrence-G.occurrence).map((L)=>L.finding)}function Dn(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var om=(_)=>Dn()?`\x1B[32m${_}\x1B[0m`:_,im=(_)=>Dn()?`\x1B[33m${_}\x1B[0m`:_,sm=(_)=>Dn()?`\x1B[34m${_}\x1B[0m`:_,am=(_)=>Dn()?`\x1B[36m${_}\x1B[0m`:_,lm=(_)=>Dn()?`\x1B[31m${_}\x1B[0m`:_,cm=(_)=>Dn()?`\x1B[2m${_}\x1B[0m`:_,dm=(_)=>Dn()?`\x1B[1m${_}\x1B[0m`:_,en={green:om,yellow:im,blue:sm,cyan:am,red:lm,dim:cm,bold:dm},um="\x1B[0m",pm=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function fm(_){let L=_;return()=>(L=(L*1664525+1013904223)%4294967296,L/4294967296)}function mm(_){let L=[...pm],G=fm(_);for(let Y=L.length-1;Y>0;Y--){let Z=Math.floor(G()*(Y+1)),oe=L[Y];L[Y]=L[Z],L[Z]=oe}return L}function gm(_,L=0){if(!Dn())return"";let G=mm(L);return`\x1B[38;5;${G[_%G.length]}m`}function ka(_,L,G=0){if(!Dn())return`"${_}"`;return`${gm(L,G)}"${_}"${um}`}function Or(_){return _==="default"?"built-in default":`${_} policy`}var ym=new RegExp("\x1B\\[[0-9;]*m","g"),Yo=(_)=>_.replace(ym,"").length;function Zn(_){let L=(_.headers??_.rows[0]??[]).map((se,fe)=>{let ge=Math.max(..._.rows.map((Pe)=>Yo(Pe[fe]??"")));return Math.max(Yo(se),ge)}),G=(se,fe)=>se+" ".repeat(Math.max(0,fe-Yo(se))),Y=(se,fe)=>fe[0]+L.map((ge)=>se.repeat(ge+2)).join(fe[1])+fe[2],Z=(se)=>`│ ${se.map((fe,ge)=>G(fe,L[ge]??0)).join(" │ ")} │`,oe=_.headers?[`   ${Z(_.headers)}`,`   ${Y("─",["├","┼","┤"])}`]:[];return[`   ${Y("─",["┌","┬","┐"])}`,...oe,..._.rows.map((se)=>`   ${Z(se)}`),`   ${Y("─",["└","┴","┘"])}`].join(`
`)}function Ca(_){let L=[];L.push("Hook Integration"),L.push(hm(_));let G=[],Y=[];for(let Z of _){let oe=cn(Z.platform);if(Z.errors&&Z.errors.length>0)for(let se of Z.errors)if(Z.configured)G.push({platform:oe,message:se});else Y.push({platform:oe,message:se})}for(let Z of G)L.push(`   Warning (${Z.platform}): ${Z.message}`);for(let Z of Y)L.push(en.red(`   Error (${Z.platform}): ${Z.message}`));return L.join(`
`)}function hm(_){let L=["Platform","Discovery","Configuration","Inspection"],G=_.map((Y)=>{let Z=cn(Y.platform);if(Y.inspectionStatus==="not-inspected"){let ge=en.dim("Not inspected");return[Z,ge,ge,ge]}let oe=Y.detected?en.green("Detected"):Y.inspectionStatus==="failed"?en.red("Unknown"):en.dim("Not detected"),se=Y.configured?en.green("Configured"):Y.detected?en.yellow("Not configured"):Y.inspectionStatus==="failed"?en.red("Unknown"):en.dim("Not applicable"),fe=Y.inspectionStatus==="verified"?en.green("Verified"):Y.inspectionStatus==="failed"?en.red("Failed"):en.dim("Not applicable");return[Z,oe,se,fe]});return Zn({headers:L,rows:G})}function xa(_){let G=["Guard Engine Verification",`   Synthetic self-test: ${_.failed>0?en.red(`${_.passed}/${_.total} FAIL`):en.green(`${_.passed}/${_.total} passed`)}`],Y=_.results.filter((Z)=>!Z.passed);if(Y.length>0){G.push(""),G.push(en.red("   Failures:"));for(let Z of Y)G.push(en.red(`   • ${Z.description}`)),G.push(en.red(`     expected ${Z.expected}, got ${Z.actual}`))}return G.join(`
`)}function vm(_){if(_.length===0)return"   (no custom rules)";let L=["Source","Name","Command","Block Args"],G=_.map((Y)=>[Y.source,Y.name,Y.subcommand?`${Y.command} ${Y.subcommand}`:Y.command,Y.blockArgs.join(", ")]);return Zn({headers:L,rows:G})}function Sa(_){let L=[];if(L.push("Configuration"),L.push(bm(_.userConfig,_.projectConfig)),L.push(""),_.effectiveRules.length>0)L.push(`   Effective rules (${_.effectiveRules.length} total):`),L.push(vm(_.effectiveRules));else L.push("   Effective rules: (none - using built-in rules only)");return L.join(`
`)}function bm(_,L){let G=["Scope","Status"],Y=(oe)=>{if(!oe.exists)return en.dim("N/A");if(!oe.valid)return en.red(`Invalid (${oe.errors?.[0]??"unknown error"})`);return en.green("Configured")},Z=[["User",Y(_)],["Project",Y(L)]];return Zn({headers:G,rows:Z})}function Pa(_){let L=[];return L.push("Environment"),L.push(wm(_)),L.join(`
`)}function Ea(_){let L=_.effectiveSafety.policyScopes,G=["Effective Safety",`   Selected preset: ${_.effectiveSafety.selectedPreset}${L?` (${Or(L.levelScope)})`:""}`,`   Effective: ${_.effectiveSafety.level}`],Y=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[Z,oe]of Y){let se=_.effectiveSafety.capabilities[Z],fe=se.enabled?en.green("ON"):en.dim("OFF"),ge=se.sources.length>0?` (${se.sources.join(", ")})`:"";G.push(`   ${oe}: ${fe} via ${se.source}${ge}`)}if(L&&L.weakenings.length>0){G.push(`   Project policy deltas${L.weakeningsIgnored?" (ignored)":""}:`);for(let Z of L.weakenings)G.push(`      ${Z}`)}G.push(`   Stored rule customizations: ${_.effectiveSafety.ruleCounts.stored}`),G.push(`   Effective rule customizations: ${_.effectiveSafety.ruleCounts.effective}`);for(let[Z,oe]of Object.entries(_.effectiveSafety.ruleOverrides))G.push(`   ${Z}: ${oe}`);return G.join(`
`)}function Ra(_){let L=["Findings"];if(_.length===0)return L.push("   No findings from inspected doctor facts."),L.join(`
`);for(let G of _){let Y=`[${G.severity.toUpperCase()}] ${G.checkId}: ${gn(G.title)}`,Z=G.severity==="error"?en.red:G.severity==="warning"?en.yellow:en.blue;if(L.push(`   ${Z(Y)}`),L.push(`      ${gn(G.detail)}`),G.path)L.push(`      Path: ${gn(G.path)}`);if(G.fixHint)L.push(`      Fix: ${gn(G.fixHint)}`)}return L.join(`
`)}function wm(_){let L=["Variable","Status","Legacy"],G=_.map((Y)=>{let Z=Y.isSet?en.green("✓"):en.dim("✗"),oe=Y.legacyName&&Y.legacyIsSet?`${Y.legacyName} ${en.green("✓")}`:Y.legacyName??"";return[Y.name,Z,oe]});return Zn({headers:L,rows:G})}function _a(_){let L=[];if(_.totalBlocked===0)L.push("Recent Activity"),L.push("   No blocked commands in the last 7 days"),L.push("   Tip: This is normal for new installations");else L.push(`Recent Activity · last 7 days (${_.totalBlocked} blocked / ${_.sessionCount} sessions)`),L.push(km(_.recentEntries));if(_.unreadable>0)L.push(`   Warning: ${_.unreadable} audit log ${_.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return L.join(`
`)}function km(_){let L=["Time","Command"],G=_.map((Y)=>{let Z=gn(Y.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),oe=Z.length>40?`${Z.slice(0,37)}...`:Z;return[Y.relativeTime,oe]});return Zn({headers:L,rows:G})}function Ta(_){let L=[];if(L.push("Update Check"),_.latestVersion===null&&!_.error)return L.push($r([["Status",en.dim("Skipped")],["Installed",_.currentVersion]])),L.join(`
`);if(_.error)return L.push($r([["Status",`${en.yellow("⚠")} Error`],["Installed",_.currentVersion],["Error",en.dim(_.error)]])),L.join(`
`);if(_.updateAvailable)return L.push($r([["Status",`${en.yellow("⚠")} Update Available`],["Current",_.currentVersion],["Latest",en.green(_.latestVersion??"")]])),L.push(""),L.push("   Run: bunx cc-safety-net@latest doctor"),L.push("   Or:  npx cc-safety-net@latest doctor"),L.join(`
`);return L.push($r([["Status",`${en.green("✓")} Up to date`],["Version",_.currentVersion]])),L.join(`
`)}function $r(_){return Zn({rows:_})}function Ia(_){let L=[];return L.push("System Info"),L.push(Cm(_)),L.join(`
`)}function Cm(_){let L=["Component","Version"],G=(oe)=>{if(oe===null)return en.dim("not found");return oe},Z=[{label:"cc-safety-net",value:_.version},...Rr.map((oe)=>({label:cn(oe),value:_.versions[oe]??null})),{label:"Node.js",value:_.nodeVersion},{label:"npm",value:_.npmVersion},{label:"Bun",value:_.bunVersion},{label:"Platform",value:_.platform}].map((oe)=>[oe.label,G(oe.value)]);return Zn({headers:L,rows:Z})}function Aa(_){if(_.findings.length===0)return en.green(`
No findings from inspected doctor facts.`);let L={error:_.findings.filter((oe)=>oe.severity==="error").length,warning:_.findings.filter((oe)=>oe.severity==="warning").length,info:_.findings.filter((oe)=>oe.severity==="info").length},G=["error","warning","info"].filter((oe)=>L[oe]>0).map((oe)=>`${L[oe]} ${oe}`),Y=_.findings.length===1?"finding":"findings",Z=`
${_.findings.length} ${Y}: ${G.join(", ")}.`;if(L.error>0)return en.red(Z);if(L.warning>0)return en.yellow(Z);return en.blue(Z)}import{lstatSync as xm}from"node:fs";import{dirname as Zo}from"node:path";function Xo(_,L){try{let G=xm(L);if(G.isSymbolicLink())return{kind:_,path:L,status:"unsafe",issues:["symlink"]};if(!G.isDirectory())return{kind:_,path:L,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:_,path:L,status:"unknown",issues:[]};let Y=[...G.uid!==process.getuid()?["ownership"]:[],...(G.mode&18)!==0?["permissions"]:[]];return{kind:_,path:L,status:Y.length>0?"unsafe":"safe",issues:Y}}catch(G){if(typeof G==="object"&&G!==null&&"code"in G&&G.code==="ENOENT")return{kind:_,path:L,status:"not-applicable",issues:[]};return{kind:_,path:L,status:"unknown",issues:[]}}}function Oa(_,L){let G=H(_);return{directories:[Xo("policy",Zo(Zo(L))),Xo("config",Zo(L)),...G?[Xo("audit",G)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as Sm}from"node:child_process";import{existsSync as $a}from"node:fs";import{delimiter as Pm,extname as Em,join as Rm}from"node:path";import{stripVTControlCharacters as Da}from"node:util";var La="2.6.13",_m=5000,Tm="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function pn(){return La}function Qo(_,L){let G=_[L];if(G)return G;let Y=Object.keys(_).find((Z)=>Z.toLowerCase()===L.toLowerCase()&&!!_[Z]);return Y?_[Y]:G}function Im(_){return(Qo(_,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((L)=>L.length>0)}function Am(_,L){let G=Em(_)?[_]:[...Im(L).map((Y)=>`${_}${Y}`),_];if(_.includes("/")||_.includes("\\"))return G.find((Y)=>$a(Y))??_;return(Qo(L,"PATH")??"").split(Pm).flatMap((Y)=>G.map((Z)=>Rm(Y,Z))).find((Y)=>$a(Y))??_}function Na(_){if(!/[\s"&|<>^]/.test(_))return _;return`"${_.replace(/"/g,'""')}"`}function Xn(_,L){let[G,...Y]=_,Z=L[Tm]==="win32"?"win32":process.platform;if(!G||Z!=="win32")return{cmd:G??"",args:Y};let oe=Am(G,L);if(!/\.(?:bat|cmd)$/i.test(oe))return{cmd:oe,args:Y};return{cmd:Qo(L,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",Na(oe),...Y.map(Na)].join(" ")]}}var Ht=async(_,L=_m)=>{let G=await Om(_,{timeoutMs:L});if(G.code!==0)return null;return Da(G.stdout).trim()||Da(G.stderr).trim()||null};function Om(_,L){let[G,...Y]=_;if(!G)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((Z)=>{try{let oe=Xn([G,...Y],process.env),se=Sm(oe.cmd,oe.args,{stdio:["ignore","pipe","pipe"]}),fe=!1,ge="",Pe="";se.stdout.on("data",(Le)=>{ge+=Le.toString()}),se.stderr.on("data",(Le)=>{Pe+=Le.toString()});let Ee=(Le)=>{if(fe)return;fe=!0,clearTimeout(Re),Z(Le)},Re=setTimeout(()=>{se.kill(),Ee({code:null,stdout:ge,stderr:Pe})},L.timeoutMs);se.on("close",(Le)=>{Ee({code:Le,stdout:ge,stderr:Pe})}),se.on("error",()=>{Ee({code:null,stdout:ge,stderr:Pe})})}catch{Z({code:null,stdout:"",stderr:""})}})}function Dr(_){if(!_)return null;let L=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(_);if(L)return L[1]??null;let G=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(_);if(G)return G[1]??null;return _.split(`
`)[0]?.trim()||null}async function Nr(_,L=Ht,G=process.cwd()){let Y=Promise.all(En.map(async(Re)=>[Re.id,Dr(await L([...Re.probeCommand]))])),[Z,oe,se,fe,ge,Pe,Ee]=await Promise.all([Y,Y.then(async(Re)=>{let Le=Re.find(([Be])=>Be==="opencode")?.[1];if(!Le?.startsWith("2.")||!_(Le))return null;let _e=["--param",`location[directory]=${G}`],Te=["opencode","api","integration.list",..._e];return await L(Te,30000),L(["opencode","api","plugin.list",..._e],30000)}),L(["codex","plugin","list"],30000),L(["amp","plugins","list"],30000),L(["node","--version"]),L(["npm","--version"]),L(["bun","--version"])]);return{version:La,versions:Object.fromEntries(Z),codexPluginListOutput:se,ampPluginListOutput:fe,openCodePluginListOutput:oe,nodeVersion:Dr(ge),npmVersion:Dr(Pe),bunVersion:Dr(Ee),platform:`${process.platform} ${process.arch}`}}function ei(_,L){if(L==="dev")return!1;let G=_.split(".").map(Number),Y=L.split(".").map(Number),[Z=0,oe=0,se=0]=G,[fe=0,ge=0,Pe=0]=Y;if(Z!==fe)return Z>fe;if(oe!==ge)return oe>ge;return se>Pe}async function Gn(){let _=pn(),L=new AbortController,G=setTimeout(()=>L.abort(),3000);try{let Y=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:L.signal});if(!Y.ok)return{currentVersion:_,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${Y.status}`};let Z=await Y.json(),oe=ei(Z.version,_);return{currentVersion:_,latestVersion:Z.version,updateAvailable:oe}}catch(Y){return{currentVersion:_,latestVersion:null,updateAvailable:!1,error:Y instanceof Error?Y.message:"Network error"}}finally{clearTimeout(G)}}import*as qa from"node:readline";var Ma=(_)=>`\x1B[${_}B`,$m=(_)=>`\x1B[${_}A`;var ja=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Dm(_){return new Promise((L)=>setTimeout(L,_))}function Nm(_,L,G){if(!G)return L(_);if(G.aborted)return Promise.resolve();return new Promise((Y,Z)=>{let oe=()=>G.removeEventListener("abort",se),se=()=>{oe(),Y()};G.addEventListener("abort",se,{once:!0}),L(_).then(()=>{oe(),Y()},(fe)=>{oe(),Z(fe)})})}function Lr(_){return Math.max(0,Math.min(1,_))}function Ft(_){return Math.max(0,Math.min(255,Math.round(_)))}function ni(_){return _<=0.0031308?12.92*_:1.055*_**0.4166666666666667-0.055}function Lm(_,L,G){let Y=G*Math.PI/180,Z=L*Math.cos(Y),oe=L*Math.sin(Y),se=(_+0.3963377774*Z+0.2158037573*oe)**3,fe=(_-0.1055613458*Z-0.0638541728*oe)**3,ge=(_-0.0894841775*Z-1.291485548*oe)**3;return{blue:Ft(ni(Lr(-0.0041960863*se-0.7034186147*fe+1.707614701*ge))*255),green:Ft(ni(Lr(-1.2684380046*se+2.6097574011*fe-0.3413193965*ge))*255),red:Ft(ni(Lr(4.0767416621*se-3.3077115913*fe+0.2309699292*ge))*255)}}function ti(_,L){let G=(L*_*180/Math.PI%360+360)%360;return Lm(0.72,0.15,G)}function Ua(_,L=0.1){let G=ti(L,_);return`\x1B[38;2;${G.red};${G.green};${G.blue}m`}function jm(_,L){return{blue:Ft(_.blue+(255-_.blue)*L),green:Ft(_.green+(255-_.green)*L),red:Ft(_.red+(255-_.red)*L)}}function Ga(_,L,G){let Y=Math.imul(_+2654435769,2246822507)^Math.imul(L+3266489909,668265263)^Math.imul(G+374761393,2654435761),Z=Y^Y>>>15,oe=Math.imul(Z,739982445),se=oe^oe>>>12,fe=Math.imul(se,695872825);return((fe^fe>>>15)>>>0)/4294967296}function Hm(_,L,G){let Y=Math.floor(Ga(_,L,G)*ja.length);return ja[Y]??"░"}function Ha(_){let L=Lr(_);return L*L*L*(L*(L*6-15)+10)}function Fm(_){if(_.length===0)return"";let L=[],G=!1,Y="";for(let Z of _){let oe=`${Z.red};${Z.green};${Z.blue}`;if(Z.bold!==G)L.push(Z.bold?"\x1B[1m":"\x1B[22m"),G=Z.bold;if(oe!==Y)L.push(`\x1B[38;2;${oe}m`),Y=oe;L.push(Z.character)}return`${L.join("")}\x1B[22m\x1B[39m`}function Mm(_,L,G,Y,Z){return _.map((oe,se)=>({...ti(G,Y+L+se/Z),bold:!1,character:oe}))}function Um(_,L,G,Y,Z,oe,se,fe){let ge=Math.max(1,Y*0.75),Pe=Math.min(1,G/ge),Ee=Z*Ha(Pe),Re=Math.max(0,(G-ge)/Math.max(1,Y-ge)),Le=(1-Ha(G/Y))*fe*2,_e=0.35*Math.max(0,1-Re*2),Te=Pe>=1,Be=Math.min(_.length,Math.ceil(Ee+2+1));return _.slice(0,Be).map((Fe,Ze)=>{let tn=ti(oe,se+L+Ze/fe+Le),on=Ze+Ga(L,Ze,7919)*2-1;if(on>Ee+2)return{...tn,bold:!1,character:" "};let an=Ee-on,nn=0.8*Math.exp(-(an*an)/12.5),sn=Math.min(0.9,nn+_e),Sn=!Te&&on>Ee-4;return{...jm(tn,sn),bold:sn>0.3,character:Sn?Hm(L,Ze,G):Fe}})}function Fa(_){return`\x1B[?2026h${_.map((L,G)=>`\x1B8${G>0?Ma(G):""}${Fm(L)}`).join("")}\x1B[?2026l`}async function ri(_,L={}){if(!_)return;let G=L.output??process.stdout,Y=L.sleep??Dm,Z=L.seed??0,oe=_.split(`
`).map((Ee)=>Array.from(Ee)),se=Math.max(...oe.map((Ee)=>Ee.length)),fe=12000*oe.filter((Ee)=>Ee.length>0).length/40,ge=se>0?Math.max(1,Math.ceil(fe/16.666666666666668)):0,Pe=ge>0?fe/ge:0;G.write(`\x1B[?25l${oe.length>1?`${`
`.repeat(oe.length-1)}${$m(oe.length-1)}`:""}\x1B7`);try{for(let Ee=1;Ee<=ge;Ee+=1){if(L.signal?.aborted)break;G.write(Fa(oe.map((Re,Le)=>Um(Re,Le,Ee,ge,se,0.1,Z,3)))),await Nm(Pe,Y,L.signal)}}finally{if(G.write(Fa(oe.map((Ee,Re)=>Mm(Ee,Re,0.1,Z,3)))),G.write("\x1B8"),oe.length>1)G.write(Ma(oe.length-1));G.write(`
\x1B[0m\x1B[?25h`)}}var Ba=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function Gm(_){return Boolean(_.isTTY)}async function er(_={}){let L=_.output??process.stdout;if(!Gm(L))return;let G=_.input??process.stdin,Y={output:L,seed:_.seed??Math.random()*8192,sleep:_.sleep};if(!G.isTTY||typeof G.setRawMode!=="function"){await ri(Ba,Y);return}let Z=new AbortController,oe=G.readableFlowing===!0,se=G.isRaw===!0,fe=!1,ge=(Pe,Ee)=>{if(Ee.ctrl&&Ee.name==="c")fe=!0;if(fe||Ee.name==="return"||Ee.name==="enter")Z.abort()};qa.emitKeypressEvents(G),G.on("keypress",ge),G.setRawMode(!0),G.resume();try{await ri(Ba,{...Y,signal:Z.signal})}finally{if(G.off("keypress",ge),G.setRawMode(se),!oe)G.pause()}if(!fe)return;if(_.onInterrupt){_.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as Km}from"node:crypto";import{existsSync as Ka}from"node:fs";import{dirname as jr,join as Ja}from"node:path";import{dirname as Va,join as Bm}from"node:path";var qm="rule.lock";function Vm(_){return Bm(Va(_),qm)}function hn(_,L){let G=L.global?L.userConfigPath??z(_,L):L.projectConfigPath??I(L.cwd??process.cwd()),Y=L.global?at(_,L):ct(G,L.cwd??process.cwd()),Z=Vm(G);return{configDir:Va(G),configPath:G,lockPath:Z,filesystemScope:Y,configTarget:i(Y,G),lockTarget:i(Y,Z)}}var Jm="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",Wm="cache",zm="rulebooks";function Wa(_,L={}){let G=hn(_,L),Y=i(G.filesystemScope,Ya(G.configDir)),Z=r(G.lockTarget);if(console.log(Jm),Z===null&&!Ka(Y.path))return console.log(`No v2 lock or cache leftovers found in ${jr(G.configDir)}; nothing to migrate.`),0;let oe=eg(Z),se=d(G.configTarget);if(!se.config&&(r(G.configTarget)!==null||oe.size>0))return console.error(`Cannot migrate: the rules config in ${jr(G.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let fe=se.config?.rules??[];for(let ge of fe.flatMap((Pe)=>Ym(Pe,oe,G,Y,L.global===!0)))console.log(ge);return B(G.lockTarget),wt(Y),console.log(`Removed the v2 lock and cache under ${jr(G.configDir)}.`),0}function za(_,L){return[...new Set([{cwd:L},{cwd:L,global:!0}].flatMap((G)=>{let Y=hn(_,G);return[Y.lockPath,Ya(Y.configDir)]}))].filter((G)=>Ka(G))}function Ym(_,L,G,Y,Z){if(!C(_))return[];let oe=M(_).name,se=i(G.filesystemScope,F(G.configDir,oe)),fe=r(se);if(fe!==null&&Zm(fe,oe))return[];let ge=L.get(_),Pe=ge?Xm(ge,oe,Y.path,G.filesystemScope):null;if(Pe===null)return[`Could not migrate ${_} from the v2 cache. Run \`cc-safety-net rule update ${_}${Z?" --global":""}\` to vendor it.`];if(g(se,Pe),fe!==null)return[`Restored ${_} from the v2 cache over an invalid file.`];return[`Vendored ${_} from the v2 cache.`]}function Zm(_,L){let G=we(_);return!("problem"in G)&&G.rulebook.name===L}function Xm(_,L,G,Y){let Z=Ja(G,zm,`${Qm(_)}--${_.digest.replace("sha256:","").slice(0,12)}`,ye),oe=r(i(Y,Z));if(oe===null||rg(oe)!==_.digest)return null;let se=we(oe);if("problem"in se||se.rulebook.name!==L)return null;return oe}function Ya(_){return Ja(jr(_),Wm)}function Qm(_){return([_.owner,_.repo,_.display_ref,_.name].every((Y)=>typeof Y==="string"&&Y!=="")?`${_.owner}/${_.repo}#${_.display_ref}/${_.name}`:_.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function eg(_){let L=_===null?null:tg(_),G=Za(L)&&Array.isArray(L.rulebooks)?L.rulebooks:[];return new Map(G.filter(ng).map((Y)=>[Y.spec,Y]))}function ng(_){return Za(_)&&typeof _.spec==="string"&&typeof _.digest==="string"}function Za(_){return!!_&&typeof _==="object"}function tg(_){try{return JSON.parse(_)}catch{return null}}function rg(_){return`sha256:${Km("sha256").update(_).digest("hex")}`}var Xa="\r\x1B[2K",og="\x1B[?25l",ig="\x1B[39m",sg="\x1B[?25h",ag=100,lg=0.55,cg=80,Qa=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function dg(_){return new Promise((L)=>setTimeout(L,_))}async function Hr(_,L={}){let G=L.output??process.stdout;if(!G.isTTY)return _;let Y=L.sleep??dg,Z=!1,oe=_.then((fe)=>(Z=!0,fe),(fe)=>{throw Z=!0,fe});if(await Promise.race([oe.then(()=>!0),Y(ag).then(()=>!1)]))return oe;G.write(og);try{for(let fe=0;!Z;fe+=1)G.write(`${Xa}${Ua(fe*lg)}${Qa[fe%Qa.length]}${ig} ${L.loadingMessage??"Loading…"}`),await Promise.race([oe,Y(cg)]);return await oe}finally{G.write(`${Xa}${sg}`)}}async function nr(_,L,G,Y={}){let Z=L();if(_)await G();if(_&&Z.ready)await Hr(Z.ready,Y);return Z.finish()}import{stripVTControlCharacters as ug}from"node:util";var Fr="amp plugins list",pg=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function el(_){if(!_.ampPluginListOutput)return{platform:"amp",status:"n/a"};let L=ug(_.ampPluginListOutput).split(`
`).map((G)=>pg.exec(G)?.[1]).find((G)=>G!==void 0);if(!L)return{platform:"amp",status:"n/a"};if(L!=="active")return{platform:"amp",status:"disabled",method:Fr,configPath:Fr,errors:[`Amp personal plugin cc-safety-net is ${L}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:Fr,configPath:Fr}}import{existsSync as bg,readFileSync as wg}from"node:fs";import{isAbsolute as tS,join as vg}from"node:path";function tr(_){return vg(_,".gemini","config","hooks.json")}var tl=new Map([["run_command","auto"]]),rl="manage_task";var kg=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function Cg(_){if(!_||typeof _!=="object"||Array.isArray(_))return[];return Object.values(_).flatMap((L)=>{if(!L||typeof L!=="object"||Array.isArray(L))return[];let G=L,Y=G.PreToolUse;if(!Array.isArray(Y))return[];return Y.flatMap((Z)=>{if(!Z||typeof Z!=="object"||Array.isArray(Z))return[];let oe=Z.hooks;if(!Array.isArray(oe))return[];return oe.flatMap((se)=>{if(!se||typeof se!=="object"||Array.isArray(se))return[];let fe=se.command;if(typeof fe!=="string"||!kg.test(fe))return[];return[{command:fe,enabled:G.enabled!==!1}]})})})}function ol(_){let L=tr(_.environment.home);if(!bg(L))return{platform:"antigravity-cli",status:"n/a",configPath:L};let G;try{G=Cg(JSON.parse(wg(L,"utf-8")))}catch(Y){return{platform:"antigravity-cli",status:"n/a",configPath:L,errors:[`Failed to parse Antigravity hooks config ${L}: ${Y instanceof Error?Y.message:String(Y)}`]}}if(G.some((Y)=>Y.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:L};if(G.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:L};return{platform:"antigravity-cli",status:"n/a",configPath:L}}import{existsSync as Rg}from"node:fs";import{join as Ln}from"node:path";import{existsSync as xg,lstatSync as Sg,readFileSync as Pg}from"node:fs";import{join as Eg}from"node:path";function vn(_,L=(G)=>G){if(!xg(_))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(L(Pg(_,"utf-8")))}}catch{return{kind:"unreadable"}}}function Nn(_,L){if(_==="~")return L;if(_.startsWith("~/")||_.startsWith("~\\"))return Eg(L,_.slice(2));return _}function dn(_){try{return Sg(_)}catch{return}}function Br(_,L){let G=dn(L);if(!G)return{platform:_,status:"n/a",configPath:L};if(!G.isSymbolicLink()&&G.isDirectory())return;return{platform:_,status:"n/a",configPath:L,errors:[`${L} is a symlink or not a directory; move or remove it before installing`]}}function Xe(_,L){return typeof _==="object"&&_!==null?_[L]:void 0}var qr="cc-safety-net@cc-marketplace";function Vr(_){return _.env.get("CLAUDE_CONFIG_DIR")||Ln(_.home,".claude")}function il(_){return Ln(_.env.get("CLAUDE_CODE_PLUGIN_CACHE_DIR")||Ln(Vr(_),"plugins"),"installed_plugins.json")}function sl(_,L){let G=Xe(Xe(_,"plugins"),L);return Array.isArray(G)&&G.length>0}function Kr(_,L){let G=vn(il(_));return G.kind==="ok"&&sl(G.value,L)}function ii(_){return al(il(_),Ln(Vr(_),"settings.json"))}function al(_,L){let G=vn(_);if(G.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(G.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!sl(G.value,qr))return{platform:"claude-code",status:"n/a"};let Y=vn(L);if(Y.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(Y.kind==="ok"&&Xe(Xe(Y.value,"enabledPlugins"),qr)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:L,errors:[`${qr} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:_}}function ll(_){let L=Ln(_.home,".claude"),G=Ln(L,"plugins","installed_plugins.json");if(al(G,Ln(L,"settings.json")).status!=="configured")return;let Y=vn(G),Z=Y.kind==="ok"?Xe(Xe(Y.value,"plugins"),qr):void 0,oe=(Array.isArray(Z)?Z:[]).filter((Pe)=>Xe(Pe,"scope")==="user").map((Pe)=>Xe(Pe,"installPath")).find((Pe)=>typeof Pe==="string");if(!oe)return;let se=Ln(oe,".cursor-plugin","plugin.json"),fe=vn(se),ge=fe.kind==="ok"?Xe(fe.value,"hooks"):void 0;return typeof ge==="string"&&Rg(Ln(oe,ge))?se:void 0}function cl(_){return ii(_.environment)}var dl="Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.";function ul(_){if(!_.codexPluginListOutput)return{platform:"codex",status:"n/a"};let L=_.codexPluginListOutput.split(`
`).find((G)=>G.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!L)return{platform:"codex",status:"n/a"};if(!L.includes("installed,"))return{platform:"codex",status:"n/a"};if(!L.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex runs only trusted hooks, and doctor cannot check trust. Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."]}}import{existsSync as Yr,readdirSync as _g,readFileSync as Tg}from"node:fs";import{join as wn}from"node:path";function yn(_){let L="",G=0,Y=!1,Z=!1,oe=-1;while(G<_.length){let se=_[G],fe=_[G+1];if(Z){L+=se,Z=!1,G++;continue}if(se==='"'&&!Y){Y=!0,oe=-1,L+=se,G++;continue}if(se==='"'&&Y){Y=!1,L+=se,G++;continue}if(se==="\\"&&Y){Z=!0,L+=se,G++;continue}if(Y){L+=se,G++;continue}if(se==="/"&&fe==="/"){while(G<_.length&&_[G]!==`
`)G++;continue}if(se==="/"&&fe==="*"){G+=2;while(G<_.length-1){if(_[G]==="*"&&_[G+1]==="/"){G+=2;break}G++}continue}if(se===","){oe=L.length,L+=se,G++;continue}if(se==="}"||se==="]"){if(oe!==-1){let ge=L.slice(oe+1);if(/^\s*$/.test(ge))L=L.slice(0,oe)+ge}oe=-1,L+=se,G++;continue}if(!/\s/.test(se))oe=-1;L+=se,G++}return L}function fl(_,L,G){let Y=L+1,Z=!1;while(Y<_.length){if(Z){Z=!1,Y++;continue}if(_[Y]==="\\"){Z=!0,Y++;continue}if(_[Y]==='"')return Y+1;Y++}throw Error(G)}function ai(_,L,G){let Y=_[L],Z=Y==="["?"]":"}",oe=0,se=L;while(se<_.length){let fe=G.skipComment?.(_,se)??se;if(fe!==se){se=fe;continue}if(_[se]==='"'){se=fl(_,se,G.stringError);continue}if(_[se]===Y)oe++;if(_[se]===Z){if(oe--,oe===0)return se}se++}throw Error(G.bracketError)}function ml(_,L){let G=_.lastIndexOf(`
`,L)+1;return/^[ \t]*/.exec(_.slice(G))?.[0]??""}function gl(_,L){let G=L.end+(/^\s*/.exec(_.slice(L.end))?.[0].length??0);if(_[G]===","){let se=_[G+1]===`
`?G+2:G+1;return`${_.slice(0,L.start)}${_.slice(se)}`}let Y=_.slice(0,L.start).search(/\s*$/)-1;if(_[Y]!==",")return`${_.slice(0,L.start)}${_.slice(L.end)}`;let Z=_.lastIndexOf(`
`,Y-1),oe=Z!==-1&&/^\s*$/.test(_.slice(Z+1,Y))?Z:Y;return`${_.slice(0,oe)}${_.slice(L.end)}`}function si(_,L){if(_.startsWith("//",L)){let G=_.indexOf(`
`,L+2);return G===-1?_.length:G+1}if(_.startsWith("/*",L)){let G=_.indexOf("*/",L+2);return G===-1?_.length:G+2}return L}function pl(_,L){let G=L;while(G<_.length){if(/\s/.test(_[G]??"")){G++;continue}let Y=si(_,G);if(Y===G)return G;G=Y}return G}function yl(_,L,G){let Y=0,Z=0;while(Z<_.length){let oe=si(_,Z);if(oe!==Z){Z=oe;continue}if(_[Z]==='"'){let se=fl(_,Z,G.stringError);if(Y===1&&JSON.parse(_.slice(Z,se))===L){let fe=pl(_,se),ge=pl(_,fe+1);if(_[fe]===":"&&_[ge]==="[")return{start:ge,end:ai(_,ge,{skipComment:si,...G})}}Z=se;continue}if(_[Z]==="{"||_[Z]==="[")Y++;if(_[Z]==="}"||_[Z]==="]")Y--;Z++}return}var Tn="cc-safety-net@cc-marketplace",Jr=["cc-marketplace","cc-safety-net"],hl=["_direct","copilot-safety-net"],vl=["cc-marketplace","safety-net"],bl="safety-net@cc-marketplace";function Wr(_,L){let G=L.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${G}([^a-z0-9-]|$)`,"m").test(_??"")}function wl(_){return Wr(_,"cc-safety-net@cc-marketplace")}function kl(_){return Wr(_,"cc-marketplace")}function Cl(_){return Wr(_,"copilot-safety-net")}function xl(_){return Wr(_,"safety-net@cc-marketplace")}function zr(_){if(!_?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(_)}function Pl(_,L){if(!_)return null;let G=_.match(/(\d+)\.(\d+)\.(\d+)/);if(!G)return null;let Y=[Number(G[1]),Number(G[2]),Number(G[3])];for(let Z=0;Z<L.length;Z++){let oe=Y[Z]??0,se=L[Z]??0;if(oe!==se)return oe>se}return!0}function Ig(_){return Pl(_,[0,0,422])}function Ag(_){return Pl(_,[1,0,8])}function ir(_){return _.env.get("COPILOT_HOME")||wn(_.home,".copilot")}function El(_){return _.disableAllHooks!==!0&&Rl(_)}function Rl(_){return(_.hooks?.preToolUse??[]).some((G)=>{if(G.type!==void 0&&G.type!=="command")return!1;return zr(G.command)||zr(G.bash)||zr(G.powershell)||zr(G.exec&&[G.exec,...G.args??[]].join(" "))})}function rr(_){return _===void 0||typeof _==="string"}function Og(_){return _===void 0||Array.isArray(_)&&_.every((L)=>typeof L==="string")}function $g(_){if(!_||typeof _!=="object"||Array.isArray(_))return!1;let L=_;if(L.disableAllHooks!==void 0&&typeof L.disableAllHooks!=="boolean")return!1;if(L.hooks===void 0)return!0;if(!L.hooks||typeof L.hooks!=="object"||Array.isArray(L.hooks))return!1;let G=L.hooks.preToolUse;if(G===void 0)return!0;return Array.isArray(G)&&G.every((Y)=>Y!==null&&typeof Y==="object"&&!Array.isArray(Y)&&rr(Y.type)&&rr(Y.command)&&rr(Y.bash)&&rr(Y.powershell)&&rr(Y.exec)&&Og(Y.args))}function li(_,L){try{let G=JSON.parse(yn(Tg(_,"utf-8")));if(!$g(G)){L?.push(`Invalid hook config ${_}: hooks.preToolUse must be an array of hook objects`);return}return G}catch(G){L?.push(`Failed to parse ${_}: ${G instanceof Error?G.message:String(G)}`);return}}function _l(_,L){try{return _g(_).filter((G)=>G.endsWith(".json")).sort((G,Y)=>G.localeCompare(Y))}catch(G){return L?.push(`Failed to read ${_}: ${G instanceof Error?G.message:String(G)}`),[]}}function Dg(_,L){if(!Yr(_))return[];let G=[];for(let Y of _l(_,L)){let Z=wn(_,Y),oe=li(Z,L);if(oe&&El(oe))G.push(Z)}return G}function or(_,L){if(!Yr(_))return;let G=li(_,L);if(!G)return;return{path:_,config:G}}function Sl(_,L,G,Y){if(L){_.push(`GitHub Copilot CLI ${L} does not support ${G}; requires ${Y}+`);return}_.push(`GitHub Copilot CLI version unavailable; skipping ${G} because it requires ${Y}+`)}function Ng(_){for(let L of _){if(L?.config.disableAllHooks===!0)return L.path;if(L?.config.disableAllHooks===!1)return}return}function Lg(_,L,G,Y){let Z=ir(_),oe=wn(L,".github","hooks"),se=wn(Z,"hooks"),fe=wn(L,".github","copilot"),ge=wn(L,".claude"),Pe=Ag(G),Ee=Pe===!0?Y:void 0,Re=[or(wn(fe,"settings.local.json"),Ee),or(wn(fe,"settings.json"),Ee),or(wn(ge,"settings.local.json"),Ee),or(wn(ge,"settings.json"),Ee)],Le=or(wn(Z,"settings.json"),Ee),_e=[Le?.config.disableAllHooks===!0?void 0:Le];if(Pe!==!1){let nn=Ng(Re);if(nn){if(Pe===null)Y.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${nn} as active`);return{activeConfigPaths:[],repoInlineSources:Re,disabledBy:nn}}}let Te=Dg(oe,Y),Be=Ig(G),Fe=Be===!0?Y:void 0,Ze=Yr(se)?_l(se,Fe):[],tn=[];for(let nn of Ze){let sn=wn(se,nn),Sn=li(sn,Fe);if(Sn&&El(Sn))tn.push(sn)}if(Be!==!0&&tn.length>0)Sl(Y,G,`user hook files in ${se}`,"0.0.422"),tn.length=0;let on=[];for(let nn of[...Re,..._e]){if(!nn)continue;if(!Rl(nn.config))continue;if(Pe===!0){on.push(nn);continue}Sl(Y,G,"inline hook definitions in Copilot config files","1.0.8");break}let an=(nn)=>nn.filter((sn)=>!!sn&&on.includes(sn)).map((sn)=>sn.path);return{activeConfigPaths:[...an(Re),...Te,...an(_e),...tn],repoInlineSources:Re}}function Tl(_){let L=[],G=Lg(_.environment,_.cwd,_.copilotCliVersion,L);if(G.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:G.disabledBy,configPaths:[G.disabledBy],errors:L.length>0?L:void 0};let Y=ir(_.environment),Z=wn(Y,"installed-plugins",...Jr),oe=Yr(Z),se=wn(Y,"settings.json"),fe=vn(se,yn),ge=(_e)=>Xe(Xe(_e,"enabledPlugins"),Tn),Pe=G.repoInlineSources.find((_e)=>typeof ge(_e?.config)==="boolean"),Ee=Pe??(fe.kind==="ok"?{path:se,config:fe.value}:void 0);if(oe&&!Pe&&fe.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};let Re=oe&&Ee!==void 0&&ge(Ee.config)===!1;if(Re&&G.activeConfigPaths.length===0)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:Ee.path,errors:[`${Tn} is installed but not enabled in Copilot CLI`]};let Le=oe&&!Re;if(Le||G.activeConfigPaths.length>0){let _e=G.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:Le?"plugin config":"hook config",configPath:_e??(Le?Z:void 0),configPaths:G.activeConfigPaths.length>0?G.activeConfigPaths:void 0,errors:L.length>0?L:void 0}}return{platform:"copilot-cli",status:"n/a",errors:L.length>0?L:void 0}}import{existsSync as yi,readdirSync as Yg,readFileSync as Zg}from"node:fs";import{join as gi}from"node:path";import{existsSync as fi,mkdirSync as Bg,readFileSync as qg,rmSync as Vg}from"node:fs";import{dirname as Kg,join as Zr}from"node:path";import{existsSync as jg,renameSync as Hg,statSync as Fg,writeFileSync as Mg}from"node:fs";function ln(_,L){let G=`${_}.${process.pid}.tmp`;Mg(G,L,jg(_)?{mode:Fg(_).mode&511}:{}),Hg(G,_)}import{spawn as Ug}from"node:child_process";function Gg(_){return _.join(" ")}function ci(_,L,G){return[`Failed to run ${Gg(_)}${L===null?"":` (exit ${L})`}.`,G.trim()].filter(Boolean).join(`
`)}function di(_){let L={stdout:"",stderr:""};return _.stdout.setEncoding("utf-8"),_.stderr.setEncoding("utf-8"),_.stdout.on("data",(G)=>{L.stdout+=G}),_.stderr.on("data",(G)=>{L.stderr+=G}),L}function fn(_,L){return new Promise((G,Y)=>{let Z=Xn([..._],process.env),oe=Ug(Z.cmd,Z.args,{stdio:["ignore","pipe","pipe"]}),se=di(oe),fe=()=>[se.stdout,se.stderr].filter(Boolean).join(`
`),ge=L?.timeoutMs??120000,Pe=setTimeout(()=>{oe.kill(),Y(Error(ci(_,null,`Timed out after ${ge}ms.
${fe()}`.trim())))},ge);oe.on("error",(Ee)=>{clearTimeout(Pe),Y(Error(ci(_,null,`${Ee.message}
${fe()}`.trim())))}),oe.on("close",(Ee)=>{if(clearTimeout(Pe),Ee!==0){Y(Error(ci(_,Ee,fe())));return}G(L?.stdoutOnly?se.stdout:fe())})})}async function ui(_){for(let L of _)await fn(L)}async function Il(_){for(let L of _)try{await fn(L)}catch(G){console.warn(G instanceof Error?G.message:String(G))}}var kn=Object.fromEntries(Qt.map((_)=>[_.id,`npx -y cc-safety-net hook ${_.flags[1]}`]));var ar=kn.cursor,Al=30;function Qr(_){return Zr(_.home,".cursor","hooks.json")}var sr="cc-safety-net";function mi(_){let L=Zr(_.home,".cursor","plugins");return{cache:Zr(L,"cache",sr),marketplaceClone:Zr(L,"marketplaces","github.com","kenryu42","cc-safety-net")}}async function Ol(_){let L=Object.values(mi(_));if(!L.some((Y)=>fi(Y)))return;let G="No marketplace matches";return await fn(["cursor-agent","plugin","marketplace","remove",sr]).catch((Y)=>{if(!(Y instanceof Error&&Y.message.includes(G)))throw Y}),L.forEach((Y)=>Vg(Y,{recursive:!0,force:!0})),[`Removed the ${sr} marketplace from your Cursor account.`,"If /plugins in cursor-agent still lists CC Safety Net as installed, uninstall it there."].join(`
`)}function it(_){return typeof _==="object"&&_!==null&&!Array.isArray(_)}function pi(){return{command:ar,timeout:Al,failClosed:!0}}function Xr(_){return it(_)&&_.command===ar}function Jg(_){return Object.keys(_).length===3&&_.command===ar&&_.timeout===Al&&_.failClosed===!0}function Wg(_){try{return JSON.parse(qg(_,"utf-8"))}catch(L){if(L instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${_}: ${L.message}`);throw L}}function $l(_){let L=Wg(_);if(!it(L))throw Error(`Cursor hooks config ${_} must be a JSON object`);if(L.version!==1)throw Error(`Cursor hooks config ${_} must set "version": 1`);if(L.hooks!==void 0&&!it(L.hooks))throw Error(`Cursor hooks config ${_} "hooks" must be an object`);let G=it(L.hooks)?L.hooks.preToolUse:void 0;if(G!==void 0&&!Array.isArray(G))throw Error(`Cursor hooks config ${_} "hooks.preToolUse" must be an array`);return L}function Dl(_){let L=it(_.hooks)?_.hooks.preToolUse:void 0;return Array.isArray(L)?L:[]}function zg(_){if(!_.some(Xr))return[..._,pi()];return _.reduce((L,G)=>{if(!Xr(G))return L.result.push(G),L;if(!L.inserted)L.result.push(pi()),L.inserted=!0;return L},{result:[],inserted:!1}).result}function Nl(_,L,G){let Y=it(L.hooks)?L.hooks:{},Z={...L,hooks:{...Y,preToolUse:G}};ln(_,`${JSON.stringify(Z,null,2)}
`)}function Ll(_){let L=Qr(_);if(!fi(L))return Bg(Kg(L),{recursive:!0}),ln(L,`${JSON.stringify({version:1,hooks:{preToolUse:[pi()]}},null,2)}
`),{path:L,alreadyInstalled:!1};let G=$l(L),Y=Dl(G),Z=Y.filter(Xr);if(it(G.hooks)&&Array.isArray(G.hooks.preToolUse)&&Z.length===1&&Z[0]!==void 0&&Jg(Z[0]))return{path:L,alreadyInstalled:!0};return Nl(L,G,zg(Y)),{path:L,alreadyInstalled:!1}}function jl(_){let L=Qr(_);if(!fi(L))return{path:L,alreadyInstalled:!1};let G=$l(L),Y=Dl(G),Z=Y.filter((oe)=>!Xr(oe));if(Z.length===Y.length)return{path:L,alreadyInstalled:!1};return Nl(L,G,Z),{path:L,alreadyInstalled:!0}}function Xg(_){if(!_||typeof _!=="object"||Array.isArray(_))return[];let L=_.hooks;if(!L||typeof L!=="object"||Array.isArray(L))return[];let G=L.preToolUse;if(!Array.isArray(G))return[];return G.filter((Y)=>!!Y&&typeof Y==="object"&&!Array.isArray(Y)&&Y.command===ar)}function Qg(_){let L=[];if(_.length>1)L.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let G=_[0];if(G&&G.failClosed!==!0)L.push('Managed hook is missing "failClosed": true; reinstall to repair');if(G&&G.timeout!==30)L.push('Managed hook "timeout" is not 30; reinstall to repair');return L}var eo="Claude Code plugin",hi="Cursor plugin";function ey(_){let L=gi(mi(_).cache,sr);if(!yi(L))return{};try{return{version:Yg(L).map((G)=>gi(L,G)).find((G)=>yi(gi(G,".cache-complete")))}}catch{return{unreadable:L}}}function ny(_,L){if(L){let Z=["Cursor records enabled plugins on your Cursor account, which doctor cannot check, and keeps a plugin's files after it is uninstalled.","Cursor pins marketplace plugins to the commit they were added at, so `cc-safety-net update` cannot update this plugin, while the npx hook (`cc-safety-net install --cursor`) stays current."].join(" ");return{method:hi,configPath:L,duplicate:`The Cursor plugin also runs this check, so every tool call is checked twice. ${Z} If the plugin is installed, run \`cc-safety-net uninstall --cursor\`, uninstall CC Safety Net from /plugins in cursor-agent, then run \`cc-safety-net install --cursor\`.`,alone:`${Z} If /plugins in cursor-agent does not list CC Safety Net as installed, run \`cc-safety-net install --cursor\`.`}}let G=ll(_);if(!G)return;let Y="Cursor runs the Claude Code plugin only while it imports Claude Code plugins, which doctor cannot check.";return{method:eo,configPath:G,duplicate:`The Claude Code plugin also runs this check in Cursor, so every tool call is checked twice. ${Y} If Cursor runs it, run \`cc-safety-net uninstall --cursor\` to remove this hook.`,alone:`${Y} If it stops, run \`cc-safety-net install --cursor\`.`}}function Hl(_){let L=ty(_),G=ey(_.environment);if(G.unreadable)return L.status==="configured"?{...L,errors:[...L.errors??[],`Cannot read ${G.unreadable}, so doctor cannot tell whether the Cursor plugin also runs this check.`]}:{platform:"cursor",status:"not-inspected"};let Y=ny(_.environment,G.version);if(!Y)return L;if(L.status==="configured")return{...L,errors:[...L.errors??[],Y.duplicate]};return{platform:"cursor",status:"configured",method:Y.method,configPath:Y.configPath,errors:[...L.errors??[],Y.alone]}}function ty(_){let L=Qr(_.environment);if(!yi(L))return{platform:"cursor",status:"n/a",configPath:L};let G;try{G=JSON.parse(Zg(L,"utf-8"))}catch(oe){return{platform:"cursor",status:"n/a",configPath:L,errors:[`Failed to parse Cursor hooks config ${L}: ${oe instanceof Error?oe.message:String(oe)}`]}}let Y=Xg(G);if(Y.length===0)return{platform:"cursor",status:"n/a",configPath:L};let Z=Qg(Y);return{platform:"cursor",status:"configured",method:"hook config",configPath:L,errors:Z.length>0?Z:void 0}}import{readdirSync as ry}from"node:fs";import{join as vi,resolve as oy}from"node:path";var bi="cc-safety-net";function wi(_){let L=_.env.get("DSH_HOME");return vi(L?.trim()?oy(Nn(L,_.home)):vi(_.home,".dsh"),"profiles")}function Fl(_){let L=wi(_),G=dn(L)?.isDirectory()?ry(L,{withFileTypes:!0}).filter((Z)=>Z.isDirectory()&&Z.name!=="node_modules").map((Z)=>{let oe=vi(L,Z.name,"package.json");return{name:Z.name,configPath:oe,manifest:vn(oe)}}):[];return{installed:G.flatMap((Z)=>{if(Z.manifest.kind!=="ok")return[];let oe=Z.manifest.value;if(Xe(Xe(oe,"dependencies"),bi)===void 0)return[];let se=Xe(Xe(Xe(oe,"dsh"),"profile"),"bundles");return[{name:Z.name,configPath:Z.configPath,enabled:Array.isArray(se)&&se.includes(bi)}]}),unreadable:G.some((Z)=>Z.manifest.kind==="unreadable")}}function ki(_){return Fl(_).installed}function Ml(_){let L=Fl(_.environment),G=L.installed.filter((oe)=>oe.enabled),Y=L.installed.filter((oe)=>!oe.enabled),Z=Y.map((oe)=>`${bi} is installed in the ${oe.name} profile but its bundle is disabled`);if(G.length>0)return{platform:"deepseek-harness",status:"configured",method:"dsh bundle",configPaths:G.map((oe)=>oe.configPath),...Z.length>0?{errors:Z}:{}};if(Y.length>0)return{platform:"deepseek-harness",status:"disabled",method:"dsh bundle",configPaths:Y.map((oe)=>oe.configPath),errors:Z};return L.unreadable?{platform:"deepseek-harness",status:"not-inspected"}:{platform:"deepseek-harness",status:"n/a"}}import{existsSync as dy}from"node:fs";import{existsSync as Bl,mkdirSync as iy,readFileSync as sy}from"node:fs";import{dirname as ay,join as Si}from"node:path";function Ci(_){return typeof _==="object"&&_!==null&&!Array.isArray(_)}function xi(_,L){return Ci(_)&&_.command===L}function Ul(_,L){return Ci(_)&&Array.isArray(_.hooks)&&_.hooks.some((G)=>xi(G,L))}function gt(_,L){return{hooks:[{type:"command",command:_,timeout:L}]}}function jn(_,L){return _.flatMap((G)=>{if(!Ci(G)||!Array.isArray(G.hooks))return[G];let Y=G.hooks.filter((Z)=>!xi(Z,L));if(Y.length===G.hooks.length)return[G];return Y.length===0?[]:[{...G,hooks:Y}]})}function Mt(_,L,G){let Y=_.filter((Z)=>Ul(Z,L));return Y.length===1&&JSON.stringify(Y[0])===JSON.stringify(gt(L,G))}function Ut(_,L){return _.find((G)=>Ul(G,L))}function Gt(_,L,G){let Y=Array.isArray(_.hooks)?_.hooks.find((Z)=>xi(Z,L)):void 0;return[..._.matcher===void 0||_.matcher===""||_.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...Y?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...Y?.timeout===G?[]:[`Managed hook "timeout" is not ${G}; reinstall to repair`]]}var yt=kn.devin,no=30,ly={config:{},hooks:{},preToolUse:[]};function to(_,L=process.platform){let G=L==="win32"?_.env.get("APPDATA")||Si(_.home,"AppData","Roaming"):_.env.get("XDG_CONFIG_HOME")||Si(_.home,".config");return Si(G,"devin","config.json")}function Gl(_){return typeof _==="object"&&_!==null&&!Array.isArray(_)}function cy(_){try{return{ok:!0,value:JSON.parse(yn(sy(_,"utf-8")))}}catch(L){return{ok:!1,message:L instanceof Error?L.message:String(L)}}}function Pi(_){let L=cy(_);if(!L.ok)return`Failed to parse Devin CLI config ${_}: ${L.message}`;let G=L.value;if(!Gl(G))return`Devin CLI config ${_} must be a JSON object`;let Y=G.hooks===void 0?{}:G.hooks;if(!Gl(Y))return`Devin CLI config ${_} "hooks" must be an object`;let Z=Y.PreToolUse===void 0?[]:Y.PreToolUse;if(!Array.isArray(Z))return`Devin CLI config ${_} "hooks.PreToolUse" must be an array`;return{config:G,hooks:Y,preToolUse:Z}}function ql(_){let L=Pi(_);if(typeof L==="string")throw Error(L);return L}function Vl(_,L,G){let Y={...L.config,hooks:{...L.hooks,PreToolUse:G}};ln(_,`${JSON.stringify(Y,null,2)}
`)}function Kl(_){let L=to(_),G=Bl(L)?ql(L):ly;if(Mt(G.preToolUse,yt,no))return{path:L,alreadyInstalled:!0};return iy(ay(L),{recursive:!0}),Vl(L,G,[...jn(G.preToolUse,yt),gt(yt,no)]),{path:L,alreadyInstalled:!1}}function Jl(_){let L=to(_);if(!Bl(L))return{path:L,alreadyInstalled:!1};let G=ql(L),Y=jn(G.preToolUse,yt);if(JSON.stringify(Y)===JSON.stringify(G.preToolUse))return{path:L,alreadyInstalled:!1};return Vl(L,G,Y),{path:L,alreadyInstalled:!0}}function Wl(_){let L=to(_.environment);if(!dy(L))return{platform:"devin",status:"n/a",configPath:L};let G=Pi(L);if(typeof G==="string")return{platform:"devin",status:"n/a",configPath:L,errors:[G]};let Y=Ut(G.preToolUse,yt);if(!Y)return{platform:"devin",status:"n/a",configPath:L};let Z=Gt(Y,yt,no);return{platform:"devin",status:"configured",method:"hook config",configPath:L,errors:Z.length>0?Z:void 0}}import{existsSync as hy,readFileSync as vy}from"node:fs";import{existsSync as Bt,mkdirSync as uy,readFileSync as py,rmSync as fy}from"node:fs";import{dirname as my,join as Ri}from"node:path";var ht=kn.droid,ro=30;function oo(_){return Ri(_.home,".factory","hooks.json")}function zl(_){return Ri(_.home,".factory","settings.json")}function Yl(_){return Ri(_.home,".factory","hooks","hooks.json")}function Ei(_){return typeof _==="object"&&_!==null&&!Array.isArray(_)}function Zl(_){try{return JSON.parse(yn(py(_,"utf-8")))}catch(L){if(L instanceof SyntaxError)throw Error(`Failed to parse Factory Droid hooks config ${_}: ${L.message}`);throw L}}function _i(_){let L=Zl(_);if(!Ei(L))throw Error(`Factory Droid hooks config ${_} must be a JSON object`);if(L.PreToolUse===void 0||Array.isArray(L.PreToolUse))return L;throw Error(`Factory Droid hooks config ${_} "PreToolUse" must be an array`)}function gy(_){if(!Bt(_))return{};let L=Zl(_);return Ei(L)&&Ei(L.hooks)&&L.hooks.PreToolUse!==void 0?{PreToolUse:L.hooks.PreToolUse}:{}}function yy(_){let L=Yl(_);return{...gy(zl(_)),...Bt(L)?_i(L):{}}}function Xl(_){return Array.isArray(_.PreToolUse)?_.PreToolUse:[]}function Ql(_,L,G){ln(_,`${JSON.stringify({...L,PreToolUse:G},null,2)}
`)}function ec(_){let L=oo(_),G=Bt(L),Y=G?_i(L):yy(_),Z=Xl(Y);if(G&&Mt(Z,ht,ro))return{path:L,alreadyInstalled:!0};return uy(my(L),{recursive:!0}),Ql(L,Y,[...jn(Z,ht),gt(ht,ro)]),{path:L,alreadyInstalled:!1}}function nc(_){let L=oo(_);if(!Bt(L))return{path:L,alreadyInstalled:!1};let G=_i(L),Y=Xl(G),Z=jn(Y,ht);if(JSON.stringify(Z)===JSON.stringify(Y))return{path:L,alreadyInstalled:!1};let oe=Bt(zl(_))||Bt(Yl(_));if(Z.length===0&&Object.keys(G).length===1&&!oe)return fy(L),{path:L,alreadyInstalled:!0};return Ql(L,G,Z),{path:L,alreadyInstalled:!0}}function tc(_){let L=oo(_.environment);if(!hy(L))return{platform:"droid",status:"n/a",configPath:L};let G;try{G=JSON.parse(yn(vy(L,"utf-8")))}catch(se){return{platform:"droid",status:"n/a",configPath:L,errors:[`Failed to parse Factory Droid hooks config ${L}: ${se instanceof Error?se.message:String(se)}`]}}let Y=typeof G==="object"&&G!==null&&"PreToolUse"in G?G.PreToolUse:void 0,Z=Ut(Array.isArray(Y)?Y:[],ht);if(!Z)return{platform:"droid",status:"n/a",configPath:L};let oe=[...Z.commandRegex===void 0||Z.commandRegex===""?[]:['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair'],...Gt(Z,ht,ro)];return{platform:"droid",status:"configured",method:"hook config",configPath:L,errors:oe.length>0?oe:void 0}}import{existsSync as by}from"node:fs";import{join as Ti}from"node:path";var Ii="gemini-safety-net";function Ai(_){let L=Ti(_.home,".gemini","extensions"),G=Ti(L,Ii);if(!by(G))return{platform:"gemini-cli",status:"n/a"};let Y=Ti(L,"extension-enablement.json"),Z=vn(Y);if(Z.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let oe=Z.kind==="ok"?Xe(Xe(Z.value,Ii),"overrides"):void 0;if(Array.isArray(oe)&&oe.some((fe)=>typeof fe==="string"&&fe.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:Y,errors:[`${Ii} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:G}}function rc(_){return Ai(_.environment)}import{existsSync as xy,readFileSync as pc,statSync as Sy}from"node:fs";import{dirname as uc,join as Py}from"node:path";import{existsSync as ic,mkdirSync as wy,readFileSync as sc,rmSync as ky}from"node:fs";import{dirname as Cy,join as oc}from"node:path";var Bn=kn["grok-build"],so=30,Oi=gt(Bn,so);function ao(_){return oc(_.env.get("GROK_HOME")??oc(_.home,".grok"),"hooks","cc-safety-net.json")}function lo(_){return typeof _==="object"&&_!==null&&!Array.isArray(_)}function ac(_){try{let L=JSON.parse(_);return lo(L)?L:null}catch{return null}}function lc(_){let L=lo(_.hooks)?_.hooks.PreToolUse:void 0;return Array.isArray(L)?L:[]}function io(_,L,G){let Y=lo(L.hooks)?L.hooks:{};ln(_,`${JSON.stringify({...L,hooks:{...Y,PreToolUse:G}},null,2)}
`)}function cc(_){let L=ao(_);if(!ic(L))return wy(Cy(L),{recursive:!0}),io(L,{},[Oi]),{path:L,alreadyInstalled:!1};let G=ac(sc(L,"utf-8"));if(!G)return io(L,{},[Oi]),{path:L,alreadyInstalled:!1};let Y=lc(G);if(Mt(Y,Bn,so))return{path:L,alreadyInstalled:!0};return io(L,G,[...jn(Y,Bn),Oi]),{path:L,alreadyInstalled:!1}}function dc(_){let L=ao(_);if(!ic(L))return{path:L,alreadyInstalled:!1};let G=ac(sc(L,"utf-8"));if(!G)return{path:L,alreadyInstalled:!1};let Y=lc(G),Z=jn(Y,Bn);if(JSON.stringify(Z)===JSON.stringify(Y))return{path:L,alreadyInstalled:!1};let oe=lo(G.hooks)?G.hooks:{};if(Z.length===0&&Object.keys(G).length===1&&Object.keys(oe).length===1)return ky(L),{path:L,alreadyInstalled:!0};return io(L,G,Z),{path:L,alreadyInstalled:!0}}function $i(_){return!!_&&typeof _==="object"&&!Array.isArray(_)}function Ey(_){try{return Sy(_,{throwIfNoEntry:!1})?.isFile()===!0?pc(_,"utf-8"):""}catch{return}}function fc(_){let L=ao(_.environment);if(!xy(L))return{platform:"grok-build",status:"n/a",configPath:L};let G;try{G=JSON.parse(pc(L,"utf-8"))}catch(Re){return{platform:"grok-build",status:"n/a",configPath:L,errors:[`Failed to parse Grok Build hooks config ${L}: ${Re instanceof Error?Re.message:String(Re)}`]}}let Y=$i(G)&&$i(G.hooks)&&Array.isArray(G.hooks.PreToolUse)?G.hooks.PreToolUse:[],Z=Ut(Y,Bn);if(!Z)return{platform:"grok-build",status:"n/a",configPath:L};let oe=Array.isArray(Z.hooks)?Z.hooks.findIndex((Re)=>$i(Re)&&Re.command===Bn):-1,se=`global/cc-safety-net:pre_tool_use[${Y.indexOf(Z)}].hooks[${oe}]`,fe=Py(uc(uc(L)),"disabled-hooks"),ge=Ey(fe),Pe=ge?.split(`
`).some((Re)=>Re.trim()===se)===!0,Ee=[...ge===void 0?[`Cannot read ${fe}, so doctor cannot tell whether Grok Build skips the hook`]:[],...Pe?[`Grok Build skips the hook: ${se} is listed in ${fe}; enable it in /hooks`]:[],...Gt(Z,Bn,so)];return{platform:"grok-build",status:Pe?"disabled":"configured",method:"hook config",configPath:L,errors:Ee.length>0?Ee:void 0}}import{readFileSync as Cc}from"node:fs";import{join as xc}from"node:path";var Pn="cc-safety-net",Di="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",Ry=30;function mc(_){return`${Di}
# version: ${_}
`}function _y(_){return`${mc(_)}name: ${Pn}
version: "${_}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function Ty(_){return`${mc(_)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${kn["hermes-agent"].split(" ").map((L)=>`"${L}"`).join(", ")}]
TIMEOUT_SECONDS = ${Ry}


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
`}function lr(_){return[{name:"__init__.py",content:Ty(_)},{name:"plugin.yaml",content:_y(_)}]}import{mkdirSync as Iy,readdirSync as Ay,readFileSync as gc,rmSync as Ni}from"node:fs";import{basename as Oy,dirname as $y,join as Hn}from"node:path";var Dy="__pycache__",Ny=/^[a-z0-9][a-z0-9_-]{0,63}$/;function Ly(_){try{return gc(_,"utf-8").trim()}catch{return}}function Li(_){let L=_.env.get("HERMES_HOME")?.trim();if(L&&Oy($y(L))==="profiles")return L;let G=L||Hn(_.home,".hermes"),Y=Hn(G,"active_profile"),Z=Ly(Y),oe=Z?.toLowerCase();if(!oe||oe==="default")return G;if(!Ny.test(oe))throw Error(`Invalid Hermes profile name "${Z}" in ${Y}; run \`hermes profile use <name>\` with a valid profile.`);return Hn(G,"profiles",oe)}function ji(_){return Hn(Li(_),"plugins",Pn)}function Hi(_){return _.startsWith(Di)}function Fi(_,L){let G=ji(_),Y=dn(G);if(Y&&(Y.isSymbolicLink()||!Y.isDirectory()))throw Error(`Refusing to ${L} ${G}: not a regular directory. Move or remove it and rerun ${L==="install"?"install":"uninstall"} --hermes-agent.`);return G}function yc(_,L){let G=dn(_);if(!G)return;if(G.isSymbolicLink()||!G.isFile())throw Error(`Refusing to ${L} ${_}: not a regular file. Move or remove it.`);let Y=gc(_,"utf-8");if(!Hi(Y))throw Error(`Refusing to ${L} unmanaged file at ${_}. Move or remove it.`);return Y}function hc(_){let L=Fi(_,"install"),G=lr(pn());if(G.map((Z)=>yc(Hn(L,Z.name),"overwrite")).every((Z,oe)=>Z===G[oe]?.content))return{path:L,alreadyInstalled:!0};return Iy(L,{recursive:!0}),G.forEach((Z)=>{ln(Hn(L,Z.name),Z.content)}),{path:L,alreadyInstalled:!1}}function Mi(_){let L=Fi(_,"remove");if(!dn(L))return[];return lr(pn()).filter((G)=>yc(Hn(L,G.name),"remove")!==void 0)}function vc(_){let L=Fi(_,"remove");if(!dn(L))return{path:L,alreadyInstalled:!1};let G=Mi(_);if(G.forEach((Y)=>{Ni(Hn(L,Y.name))}),Ni(Hn(L,Dy),{recursive:!0,force:!0}),Ay(L).length===0)Ni(L,{recursive:!0});return{path:L,alreadyInstalled:G.length>0}}var cr="hermes-agent",bc=/^([^\s#][^:]*):/,jy=/^\s+([A-Za-z_][\w-]*):/,wc=/^\s+-\s*(.*)$/;function Hy(_){return _.trim().replace(/^(["'])(.*)\1$/,"$2")}function Fy(_){let L=_.split(/\r?\n/),G=L.findIndex((oe)=>bc.exec(oe)?.[1]?.trim()==="plugins");if(G===-1)return[];let Y=L.slice(G+1),Z=Y.findIndex((oe)=>bc.test(oe));return Z===-1?Y:Y.slice(0,Z)}function kc(_,L){let G=Fy(_),Y=G.findIndex((se)=>jy.exec(se)?.[1]===L);if(Y===-1)return[];let Z=G.slice(Y+1),oe=Z.findIndex((se)=>!wc.test(se));return(oe===-1?Z:Z.slice(0,oe)).map((se)=>Hy(wc.exec(se)?.[1]??""))}function My(_){try{return Cc(xc(Li(_),"config.yaml"),"utf-8")}catch{return}}function Ui(_){let L=My(_)??"";return kc(L,"enabled").includes(Pn)&&!kc(L,"disabled").includes(Pn)}function Sc(_){return/^# version:\s*(.+)$/m.exec(_)?.[1]?.trim()}function Uy(_,L){let G=dn(_);if(!G)return{error:`${L.name} is missing from ${_}; run install --hermes-agent`};if(G.isSymbolicLink()||!G.isFile())return{error:`${_} is a symlink or not a regular file; move or remove it`};try{let Y=Cc(_,"utf-8");if(!Hi(Y))return{error:`Unmanaged ${L.name} occupies ${_}; move or remove it`};if(Sc(Y)===pn()&&Y!==L.content)return{error:`Modified ${L.name} occupies ${_}; run install --hermes-agent to restore it`};return{content:Y}}catch(Y){return{error:`Failed to read ${_}: ${Y instanceof Error?Y.message:String(Y)}`}}}function Gy(_){try{return{path:ji(_)}}catch(L){return{error:L instanceof Error?L.message:String(L)}}}function Pc(_){let L=Gy(_.environment);if("error"in L)return{platform:cr,status:"n/a",errors:[L.error]};let G=L.path,Y=Br(cr,G);if(Y)return Y;let Z=lr(pn()).map((ge)=>Uy(xc(G,ge.name),ge)),oe=Z.flatMap((ge)=>("error"in ge)?[ge.error]:[]);if(oe.length>0)return{platform:cr,status:"n/a",configPath:G,errors:oe};let se=Z.some((ge)=>("content"in ge)&&Sc(ge.content)!==pn()),fe=se?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!Ui(_.environment))return{platform:cr,status:"disabled",method:"plugin directory",configPath:G,errors:[`${Pn} is not enabled in Hermes; run \`hermes plugins enable ${Pn}\``,...fe]};return{platform:cr,status:"configured",method:"plugin directory",configPath:G,errors:se?fe:void 0}}import{existsSync as By,readFileSync as qy}from"node:fs";import{join as qi}from"node:path";var Vy=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/,Gi="cc-safety-net",uo="plugin config",Ky=new Set(["event","matcher","command","timeout"]),Jy=new Set(["PreToolUse","PostToolUse","PostToolUseFailure","PermissionRequest","PermissionResult","UserPromptSubmit","UserPromptQueued","TurnStarted","Stop","StopFailure","Interrupt","SessionStart","SessionEnd","SessionHeartbeat","SubagentStart","SubagentStop","TaskStarted","PreCompact","PostCompact","Notification"]);function Ec(_){return _.env.get("KIMI_CODE_HOME")||qi(_.home,".kimi-code")}function co(_,L){let G=[""],Y="",Z=0;for(let oe=0;oe<_.length;oe++){let se=_[oe];if(Y!==""){let fe=Y==='"'&&se==="\\"?_[++oe]??"":"";if(G[G.length-1]+=se+fe,fe===""&&se===Y)Y="";continue}if(se==="#"){let fe=_.indexOf(`
`,oe);oe=(fe===-1?_.length:fe)-1;continue}if(se===L&&Z===0){G.push("");continue}if(se==='"'||se==="'")Y=se;if(se==="["||se==="{")Z++;if(se==="]"||se==="}")Z--;G[G.length-1]+=se}return G.map((oe)=>oe.trim()).filter((oe)=>oe!=="")}function Rc(_){let L=/^(?:"([^"]*)"|'([^']*)'|([^\s="']+))\s*=\s*([\s\S]+)$/.exec(_);return L?{key:L[1]??L[2]??L[3]??"",value:L[4]??""}:void 0}function Bi(_){return _===void 0?void 0:/^("""|'''|"|')([\s\S]*)\1$/.exec(_)?.[2]}function Wy(_){let L=_.split(/(?=^\s*\[)/m),G=L.filter((Y)=>!/^\s*\[/.test(Y)).flatMap((Y)=>co(Y,`
`)).map(Rc).find((Y)=>Y?.key==="hooks")?.value;if(G!==void 0)return co(G.slice(1,-1),",").map((Y)=>co(Y.slice(1,-1),","));return L.filter((Y)=>/^\s*\[\[hooks]]/.test(Y)).map((Y)=>co(Y.replace(/^\s*\[\[hooks]]/,""),`
`))}function zy(_){let L=_.map(Rc),G=_.find((Ee,Re)=>L[Re]===void 0),Y=L.find((Ee)=>Ee!==void 0&&!Ky.has(Ee.key))?.key,Z=L.find((Ee,Re)=>Ee!==void 0&&L.findIndex((Le)=>Le?.key===Ee.key)<Re)?.key,oe=(Ee)=>L.find((Re)=>Re?.key===Ee)?.value,se=oe("matcher"),fe=oe("timeout"),ge=Number(fe?.replace(/(?<=[\da-f])_(?=[\da-f])/gi,""));return[[G!==void 0,`"${G}" is not a key = value pair`],[Y!==void 0,`unknown key "${Y}"`],[Z!==void 0,`duplicate key "${Z}"`],[!Jy.has(Bi(oe("event"))??""),'"event" is not a Kimi Code hook event'],[se!==void 0&&Bi(se)===void 0,'"matcher" is not a string'],[!Bi(oe("command")),'"command" is missing or empty'],[fe!==void 0&&!(Number.isInteger(ge)&&ge>=1&&ge<=600),'"timeout" is not an integer from 1 to 600']].find(([Ee])=>Ee)?.[1]}function Yy(_){let L=qi(Ec(_),"plugins","installed.json"),G=vn(L);if(G.kind==="missing")return;let Y=G.kind==="ok"?Xe(G.value,"plugins"):void 0;if(!Array.isArray(Y))return{platform:"kimi-code",status:"n/a",configPath:L,errors:[`Cannot read ${L}, so doctor cannot tell whether the Kimi Code plugin is installed`]};let Z=Y.find((oe)=>Xe(oe,"id")===Gi);if(Z===void 0)return;if(Xe(Z,"enabled")!==!0)return{platform:"kimi-code",status:"disabled",method:uo,configPath:L,errors:[`${Gi} is installed but not enabled in Kimi Code; run /plugins enable ${Gi}`]};return{platform:"kimi-code",status:"configured",method:uo,configPath:L}}function po(_){let L=qi(Ec(_.environment),"config.toml"),G=()=>Yy(_.environment)??{platform:"kimi-code",status:"n/a",configPath:L};if(!By(L))return G();let Y;try{Y=qy(L,"utf-8")}catch(se){return{platform:"kimi-code",status:"n/a",configPath:L,errors:[`Failed to read ${L}: ${se instanceof Error?se.message:String(se)}`]}}if(!Vy.test(Y))return G();let oe=(/"""|'''/.test(Y)?[]:Wy(Y)).flatMap((se,fe)=>{let ge=zy(se);return ge===void 0?[]:[`Kimi Code ignores every hook because hooks entry ${fe+1} is invalid (${ge}); fix it in ${L}`]});return{platform:"kimi-code",status:oe.length>0?"disabled":"configured",method:"hook config",configPath:L,errors:oe.length>0?oe:void 0}}import{readFileSync as Lc}from"node:fs";import{join as ur}from"node:path";var un="cc-safety-net",xn="index.js",qt="openclaw.plugin.json",Vt="package.json";var fo="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as Zy,lstatSync as Xy,readdirSync as Qy,readFileSync as eh}from"node:fs";import{dirname as _c,join as qn}from"node:path";import{fileURLToPath as nh}from"node:url";var Vi=qn("openclaw",un),xt=`run \`openclaw plugins enable ${un}\``,th="config reload superseded by a newer runtime config source",rh=[xn,qt,Vt];function Tc(_){let L=_.env.get("OPENCLAW_HOME")?.trim();return L?Nn(L,_.home):_.home}function Ic(_){let L=Tc(_),G=_.env.get("OPENCLAW_STATE_DIR")?.trim();if(G)return Nn(G,L);let Y=_.env.get("OPENCLAW_CONFIG_PATH")?.trim();return Y?_c(Nn(Y,L)):qn(L,".openclaw")}function Ac(_){let L=_.env.get("OPENCLAW_CONFIG_PATH")?.trim();return L?Nn(L,Tc(_)):qn(Ic(_),"openclaw.json")}function dr(_){return qn(Ic(_),"extensions",un)}function oh(_){let L=Qy(_);if(L.length===0)return!0;if(L.some((Z)=>!rh.includes(Z)))return!1;let G=qn(_,xn),Y=dn(G);return Y!==void 0&&!Y.isSymbolicLink()&&Y.isFile()&&eh(G,"utf-8").startsWith(fo)}function Ki(_){let L=dr(_),G=dn(L);if(!G)return;if(!G.isSymbolicLink()&&G.isDirectory()&&oh(L))return;throw Error(`Refusing to modify ${L}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function Oc(){let _=_c(nh(import.meta.url));return[qn(_,Vi),qn(_,"..",Vi),qn(_,"..","..","..","dist",Vi)]}function Ji(_=Oc()){return _.find((L)=>Zy(L)&&Xy(L).isDirectory())}function ih(_=Oc()){let L=Ji(_);if(!L)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return L}function $c(_=ih()){return[["openclaw","plugins","install",_,"--force","--accept-capabilities"]]}function sh(_){let L=(()=>{try{return JSON.parse(_)}catch{return}})(),G=Xe(Xe(L,"plugin"),"status");return typeof G==="string"?G:void 0}async function ah(){await fn(["openclaw","plugins","enable",un]).catch((_)=>{if(!(_ instanceof Error&&_.message.includes(th)))throw _})}async function Dc(_){let L=async()=>sh(await fn(["openclaw","plugins","inspect",un,"--runtime","--json"],{stdoutOnly:!0})),G=await L(),Y=G==="disabled"&&_;if(Y)await ah();let Z=Y?await L():G;if(Z==="loaded")return;throw Error(`${Z===void 0?`The ${un} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:Z==="disabled"?`OpenClaw reports the ${un} plugin with status "disabled"; ${xt}.`:`OpenClaw reports the ${un} plugin with status "${Z}".`} Run \`openclaw plugins inspect ${un} --runtime\` for details.`)}var mo="openclaw";function Kt(_,L){let G=ur(_,L),Y=dn(G);if(!Y)return{error:`${L} is missing from ${G}; run install --openclaw`};if(Y.isSymbolicLink()||!Y.isFile())return{error:`${G} is a symlink or not a regular file; move or remove it`};try{return{content:Lc(G,"utf-8")}}catch(Z){return{error:`Failed to read ${G}: ${Z instanceof Error?Z.message:String(Z)}`}}}function jc(_){try{return JSON.parse(yn(_))}catch{return}}function lh(_){let L=Kt(_,qt);if("error"in L)return L.error;if(Xe(jc(L.content),"id")===un)return;return`${ur(_,qt)} is not a valid ${un} manifest; run install --openclaw`}function ch(_){let L=Kt(_,Vt);if("error"in L)return L.error;let G=Xe(Xe(jc(L.content),"openclaw"),"extensions");if(Array.isArray(G)&&G.includes(`./${xn}`))return;return`${ur(_,Vt)} does not point OpenClaw at ${xn}; run install --openclaw`}function Nc(_){return Array.isArray(_)?_.filter((L)=>typeof L==="string"):[]}function dh(_){let L=Ac(_);if(!dn(L))return`${un} is not enabled; ${xt}`;let G=(()=>{try{return JSON.parse(yn(Lc(L,"utf-8")))}catch{return}})();if(G===void 0)return`Failed to read ${L}; fix it, then ${xt}`;let Y=Xe(G,"plugins");if(Xe(Y,"enabled")===!1)return`plugins.enabled is false in ${L}; no OpenClaw plugin loads`;let Z=Xe(Xe(Xe(Y,"entries"),un),"enabled");if(Nc(Xe(Y,"deny")).includes(un)||Z===!1)return`${un} is disabled in ${L}; ${xt}`;let oe=Nc(Xe(Y,"allow"));if(oe.length>0&&!oe.includes(un))return`plugins.allow in ${L} does not list ${un}; add it, then ${xt}`;if(oe.includes(un)||Z===!0)return;return`${un} is not enabled; ${xt}`}function Hc(_){return/^\/\/ version:\s*(.+)$/m.exec(_)?.[1]?.trim()}function uh(_,L,G){if(G===void 0)return[];let Y=Kt(G,xn);if(!(("content"in Y)&&Hc(Y.content)===L))return[];return[xn,qt,Vt].flatMap((oe)=>{let se=Kt(_,oe),fe=Kt(G,oe);if("error"in se||"error"in fe||se.content===fe.content)return[];return[`Modified ${oe} occupies ${ur(_,oe)}; run install --openclaw to restore it`]})}function Fc(_){let L=dr(_.environment),G=Br(mo,L);if(G)return G;let Y=Kt(L,xn),oe=["error"in Y?Y.error:Y.content.startsWith(fo)?void 0:`Unmanaged ${xn} occupies ${ur(L,xn)}; move or remove it`,lh(L),ch(L)].filter((Ee)=>Ee!==void 0),se="content"in Y?Hc(Y.content):void 0,fe=oe.length>0?oe:uh(L,se,Ji());if(fe.length>0)return{platform:mo,status:"n/a",configPath:L,errors:fe};let ge=se===pn()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],Pe=dh(_.environment);if(Pe)return{platform:mo,status:"disabled",method:"plugin directory",configPath:L,errors:[Pe,...ge]};return{platform:mo,status:"configured",method:"plugin directory",configPath:L,errors:ge.length>0?ge:void 0}}import{existsSync as wh,readFileSync as kh}from"node:fs";import{basename as Ch}from"node:path";import{existsSync as go,readFileSync as zi,rmSync as ph}from"node:fs";import{join as In}from"node:path";import{pathToFileURL as fh}from"node:url";var pr="cc-safety-net",St=`${pr}@latest`,Yi=["opencode.json","opencode.jsonc"],mh=60,gh=250,Mc="CCSafetyNetPlugin",yh={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function Uc(_){return In(_.env.get("XDG_CONFIG_HOME")||In(_.home,".config"),"opencode")}function Zi(_){return _.env.get("OPENCODE_CONFIG_DIR")||Uc(_)}function Xi(_){return Yi.map((L)=>In(Zi(_),L))}function Qi(_){return[...new Set([Zi(_),Uc(_)])].flatMap((L)=>Yi.map((G)=>In(L,G)))}function Gc(_){return In(_.env.get("XDG_CACHE_HOME")||In(_.home,".cache"),"opencode","packages",St)}function Bc(_){ph(Gc(_),{recursive:!0,force:!0})}async function qc(_){let L=(await fn(["opencode","--version"],{stdoutOnly:!0})).trim(),G=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(L),Y=Number(G?.[1]),Z=Number(G?.[2]),oe=Number(G?.[3]);if(!G||Y!==1&&Y!==2||Y===1&&(Z<18||Z===18&&oe<29)||Y===2&&Z===0&&oe<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${L||"an unknown version"}.`);if(Y===2){for(let se of Xi(_)){if(!go(se))continue;let fe=ns(zi(se,"utf-8"),se);if(["plugin","plugins"].some((Pe)=>{let Ee=Xe(fe,Pe);return Array.isArray(Ee)&&Ee.some((Re)=>yo(Re)&&(typeof Re==="string"?Re:Xe(Re,"package"))!==St)}))throw Error(`Change the cc-safety-net package spec in ${se} to ${St}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[],afterInstall:async()=>{if((await fn(["opencode","plugin","add",St],{stdoutOnly:!0})).includes("is already configured in"))await Wi(),await fn(["opencode","plugin","update",St]);let fe=await Wi();if(!/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(fe))throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.");let ge=["--param",`location[directory]=${process.cwd()}`];await fn(["opencode","api","integration.list",...ge]);let Pe=await fn(["opencode","api","plugin.list",...ge],{stdoutOnly:!0}),Ee=es(Pe);if(Ee)throw Error(Ee);if(!Vc(Pe).some(Kc))throw Error("OpenCode lists no active cc-safety-net for this directory. Run `opencode api plugin.list` for details.")}}}return Bc(_),{commands:[["opencode","plugin","-g","-f",St]],afterInstall:()=>vh(_)}}function Vc(_){return hh(_).filter((L)=>Xe(L,"id")===pr||yo(Xe(Xe(L,"source"),"target"))).map((L)=>Xe(L,"state"))}function Kc(_){return Xe(_,"status")==="active"}function es(_){let L=Vc(_);if(L.some(Kc))return;let G=L.find((Y)=>Xe(Y,"status")==="failed");if(!G)return;return`OpenCode reports cc-safety-net failed: ${String(Xe(G,"error")).split(`
`)[0]}`}function hh(_){if(!_)return[];try{let L=Xe(JSON.parse(_),"data");return Array.isArray(L)?L:[]}catch{return[]}}async function Wi(_=1){let L=await fn(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s|\scc-safety-net@latest\s*$/m.test(L)||_===mh)return L;return await new Promise((G)=>setTimeout(G,gh)),Wi(_+1)}async function vh(_){let L=In(Gc(_),"node_modules",pr),G=In(L,"package.json");if(!go(G))throw Error(`The OpenCode plugin cache at ${L} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${St}\` for details.`);let Y=Xe(JSON.parse(zi(G,"utf-8")),"main");if(typeof Y!=="string")throw Error(`The cached OpenCode plugin at ${L} declares no "main" entry.`);let Z=In(L,Y);if(typeof(await import(fh(Z).href))[Mc]==="function")return;throw Error(`The cached OpenCode plugin at ${Z} does not export a callable ${Mc}, so OpenCode would load nothing and fail open.`)}function ns(_,L){try{return JSON.parse(yn(_))}catch(G){if(G instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${L}: ${G.message}`);throw G}}function yo(_){let L=typeof _==="string"?_:Xe(_,"package");return typeof L==="string"&&(L===pr||L.startsWith(`${pr}@`))}function ts(_){return["plugin","plugins"].some((L)=>{let G=Xe(_,L);return Array.isArray(G)&&G.some(yo)})}function bh(_,L){let Y=["plugin","plugins"].flatMap((Z)=>{let oe=yl(_,Z,yh);if(!oe)return[];let se=[],fe=0,ge=oe.start+1,Pe=_.slice(oe.start+1,oe.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let Ee of Pe){if(Ee[0].startsWith("//")||Ee[0].startsWith("/*"))continue;let Re=oe.start+1+Ee.index;if(fe===0)ge=Re;if(Ee[0]==="{"||Ee[0]==="[")fe++;if(Ee[0]==="}"||Ee[0]==="]")fe--;if(fe!==0||Ee[0]===",")continue;let Le=Re+Ee[0].length;if(yo(JSON.parse(yn(_.slice(ge,Le)))))se.push({start:ge,end:Le})}return se}).sort((Z,oe)=>Z.start-oe.start).reverse().reduce((Z,oe)=>{let se=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(Z.slice(oe.end));if(se?.[0].includes("/")){let fe=oe.end+se[0].length-1;return Z.slice(0,oe.start)+Z.slice(oe.end,fe)+Z.slice(fe+1)}return gl(Z,oe)},_);return ns(Y,L),Y}function Jc(_){Bc(_);let L=Qi(_),G=L.find((oe)=>go(oe)),Y=[],Z=[];for(let oe of L){if(!go(oe))continue;try{let se=zi(oe,"utf-8");if(!ts(ns(se,oe)))continue;ln(oe,bh(se,oe)),Z.push(oe)}catch(se){Y.push(se instanceof Error?se.message:String(se))}}if(Y.length>0)throw Error(Y.join(`
`));return{path:Z[0]??G??In(Zi(_),Yi[0]),alreadyInstalled:Z.length>0}}function Jt(_){let L=[];for(let G of _.openCodeVersion?.startsWith("2.")?Xi(_.environment):Qi(_.environment))if(wh(G))try{let Y=kh(G,"utf-8"),Z=yn(Y),oe=JSON.parse(Z);if(ts(oe)){let se=es(_.openCodePluginListOutput);if(se)return{platform:"opencode",status:"disabled",method:"opencode api plugin.list",configPath:G,errors:[...L,se]};return{platform:"opencode",status:"configured",method:"plugin array",configPath:G,errors:L.length>0?L:void 0}}}catch(Y){L.push(`Failed to parse ${Ch(G)}: ${Y instanceof Error?Y.message:String(Y)}`)}return{platform:"opencode",status:"n/a",errors:L.length>0?L:void 0}}import{join as Wc}from"node:path";var Yc="dist/pi/index.js",zc=new Set([Yc,"index.js"]),xh=/[*?[\]{}]/;function rs(_){let L=_.env.get("PI_CODING_AGENT_DIR");return Wc(L?Nn(L,_.home):Wc(_.home,".pi","agent"),"settings.json")}function os(_){if(typeof _!=="string")return!1;return _==="npm:cc-safety-net"||_.startsWith("npm:cc-safety-net@")}function Sh(_){if(!Array.isArray(_)||_.length===0)return!1;if(!_.every((Y)=>typeof Y==="string"))return!1;let L=(Y)=>_.some((Z)=>Z.startsWith(Y)&&Z.slice(1).replace(/^\.[/\\]/,"")===Yc);if(L("-"))return!1;if(L("+"))return!0;let G=_.filter((Y)=>!/^[-+!]/.test(Y));return(G.length===0||G.some((Y)=>zc.has(Y)))&&!_.some((Y)=>Y.startsWith("!")&&(zc.has(Y.slice(1))||xh.test(Y)))}function Zc(_){let L=rs(_.environment),G=vn(L);if(G.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(G.kind==="missing")return{platform:"pi",status:"n/a"};let Y=Xe(G.value,"packages");if(!Array.isArray(Y))return{platform:"pi",status:"n/a"};let Z=Y.find((se)=>os(typeof se==="string"?se:Xe(se,"source")));if(Z===void 0)return{platform:"pi",status:"n/a"};let oe=Xe(Z,"extensions");if(oe!==void 0&&!Sh(oe))return{platform:"pi",status:"disabled",method:"package config",configPath:L,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:L}}var Ph={amp:el,"antigravity-cli":ol,"claude-code":cl,codex:ul,"copilot-cli":Tl,cursor:Hl,"deepseek-harness":Ml,devin:Wl,droid:tc,"gemini-cli":rc,"grok-build":fc,"hermes-agent":Pc,"kimi-code":po,openclaw:Fc,opencode:Jt,pi:Zc};function Wt(_,L,G){let Y={...G,cwd:L,environment:_};return Rr.map((Z)=>Eh(Ph[Z](Y)))}function Eh(_){if(_.status==="not-inspected")return{platform:_.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:_.platform,detected:_.status!=="n/a",configured:_.status==="configured",inspectionStatus:_.status!=="n/a"?"verified":_.errors&&_.errors.length>0?"failed":"not-applicable",method:_.method,configPath:_.configPath,configPaths:_.configPaths,errors:_.errors}}import{join as Rh}from"node:path";var _h=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),Th=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),commandTools:Object.freeze([]),safety:Object.freeze({level:"standard"}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),Ih={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function Xc(_){let L=Rh(_.tmpdir,"cc-safety-net-self-test"),G=_h.map((Y)=>{let Z=W(_,l("self-test",{command:Y.command},{kind:"command",shell:"auto"},{configCwd:L,executionCwd:L},Y.command),{guard:{dependencies:{loadPolicySnapshot:()=>Th,getModes:()=>Ih,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),oe=Y.expectBlocked?"blocked":"allowed",se=Z.decision.kind==="deny"?"blocked":"allowed";return{command:Y.command,description:Y.description,expected:oe,actual:se,passed:oe===se,reason:Z.decision.kind==="deny"?Z.decision.reason:void 0,ruleId:Z.decision.kind==="deny"?Z.decision.ruleId:void 0}});return{passed:G.filter((Y)=>Y.passed).length,failed:G.filter((Y)=>!Y.passed).length,total:G.length,results:G}}function is(_){let L=mn({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},_);if($n(L.errors))return null;return{json:L.flags.json,skipUpdateCheck:L.flags.skipUpdateCheck}}async function Qc(_,L={}){let G=await nr(!L.json,()=>{let Y=Oh(_,L);return{ready:Y,finish:()=>Y}},()=>er(),{loadingMessage:"Checking system status…"});if(L.json)console.log(JSON.stringify(G,null,2));else $h(G);return G.engineSelfTest.failed>0||G.findings.some((Y)=>Y.severity==="error")?1:0}async function Oh(_,L){let G=L.cwd??process.cwd(),Y=await Nr((Fe)=>Jt({environment:_,cwd:G,openCodeVersion:Fe}).status!=="n/a",void 0,G),Z=Wt(_,G,{ampPluginListOutput:Y.ampPluginListOutput,codexPluginListOutput:Y.codexPluginListOutput,copilotCliVersion:Y.versions["copilot-cli"],openCodeVersion:Y.versions.opencode,openCodePluginListOutput:Y.openCodePluginListOutput}),oe=ha(_,G),se=va(_),fe=R(_,{cwd:G}),ge=fe.policy,Pe=P(ge,_.env),Ee=K(ge,Pe.capabilities),Re=Ar(_,7),Le=za(_,G),_e=[Lt(G),jt(_)].filter((Fe)=>Ah(Fe)),Te=L.skipUpdateCheck?{currentVersion:pn(),latestVersion:null,updateAvailable:!1}:await Gn(),Be={hooks:Z,engineSelfTest:Xc(_),userConfig:oe.userConfig,projectConfig:oe.projectConfig,configState:Ve(fe),effectiveRules:oe.effectiveRules,environment:se,effectiveSafety:{selectedPreset:ge.safety.level,level:Pe.effectiveLevel,capabilities:Pe.capabilities,ruleOverrides:ge.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(Ee).filter(([,Fe])=>Fe.source==="rule_override"&&Fe.override==="off"&&Fe.inheritedEnabled&&Fe.changesInherited).map(([Fe])=>Fe),ruleCounts:{stored:Object.keys(ge.destructiveCommandRuleOverrides).length,effective:Object.values(Ee).filter((Fe)=>Fe.changesInherited).length},...fe.policyScopes?{policyScopes:fe.policyScopes}:{}},...Le.length>0?{v2Leftovers:Le}:{},..._e.length>0?{legacyConfigs:_e}:{},posture:Oa(_,oe.userConfig.path),activity:Re,update:Te,system:Y};return{...Be,findings:wa(Be)}}function $h(_){console.log(),console.log(Ca(_.hooks)),console.log(),console.log(xa(_.engineSelfTest)),console.log(),console.log(Sa(_)),console.log(),console.log(Pa(_.environment)),console.log(),console.log(Ea(_)),console.log(),console.log(Ra(_.findings)),console.log(),console.log(_a(_.activity)),console.log(),console.log(Ia(_.system)),console.log(),console.log(Ta(_.update)),console.log(Aa(_))}import{existsSync as Dh}from"node:fs";var Nh=/^[A-Za-z0-9_@%+=:,./-]+$/,ed="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function ss(_){let L=mn({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},_);if($n(L.errors))return console.error(ed),console.error("Pass -- before a command that starts with dashes."),null;if(L.values.cwd!==void 0&&!Dh(L.values.cwd))return console.error(`Error: --cwd path does not exist: ${L.values.cwd}`),null;let G=L.positionals.length===1?L.positionals[0]:L.positionals.map((Y)=>Nh.test(Y)?Y:`'${Y.replaceAll("'","'\\''")}'`).join(" ");if(!G)return console.error("Error: No command provided"),console.error(ed),null;return{json:L.flags.json,cwd:L.values.cwd,command:G}}function nd(_){if(_)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function td(_,L){let Y=L-18;return[`${_.dtl}${_.dh.repeat(L)}${_.dtr}`,`${_.dv}  Command Analysis${" ".repeat(Y)}${_.dv}`,`${_.dbl}${_.dh.repeat(L)}${_.dbr}`]}function as(_){return JSON.stringify(_)}function rd(_,L=0){return`[${_.map((Y,Z)=>ka(Y,Z,L)).join(",")}]`}function fr(_,L,G=70){let Y=_.split(" "),Z=[],oe="";for(let se of Y)if(oe&&oe.length+se.length+1>G)Z.push(oe),oe=se;else oe=oe?`${oe} ${se}`:se;if(oe)Z.push(oe);return Z.map((se,fe)=>fe===0?se:`${L}${se}`)}function od(_,L,G){let Y=[];switch(_.type){case"parse":return null;case"env-strip":return Y.push(""),Y.push(`STEP ${L} ${G.h} Strip environment variables`),Y.push(`  Removed: ${_.envVars.map((Z)=>`${Z}=<redacted>`).join(", ")}`),Y.push(`  Tokens:  ${as(_.output)}`),{lines:Y,incrementStep:!0};case"leading-tokens-stripped":return Y.push(""),Y.push(`STEP ${L} ${G.h} Strip wrappers`),Y.push(`  Removed: ${_.removed.join(", ")}`),Y.push(`  Tokens:  ${as(_.output)}`),{lines:Y,incrementStep:!0};case"shell-wrapper":return Y.push(""),Y.push(`STEP ${L} ${G.h} Detect shell wrapper`),Y.push(`  Wrapper: ${_.wrapper} -c`),Y.push(`  Inner:   ${_.innerCommand}`),{lines:Y,incrementStep:!0};case"interpreter":{if(Y.push(""),Y.push(`STEP ${L} ${G.h} Detect interpreter`),Y.push(`  Interpreter: ${_.interpreter}`),Y.push(`  Code:        ${_.codeArg}`),_.paranoidBlocked)Y.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:Y,incrementStep:!0}}case"busybox":return Y.push(""),Y.push(`STEP ${L} ${G.h} Busybox wrapper`),Y.push(`  Subcommand: ${_.subcommand}`),{lines:Y,incrementStep:!0};case"transparent-wrapper":return Y.push(""),Y.push(`STEP ${L} ${G.h} Transparent wrapper`),Y.push(`  Wrapper: ${_.wrapper}`),Y.push(`  Tokens:  ${as(_.output)}`),{lines:Y,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(Y.push(""),Y.push(`STEP ${L} ${G.h} Match rules`),Y.push(`  Rule:   ${_.rule}()`),_.matched)Y.push("  Result: MATCHED");else Y.push("  Result: No match");return{lines:Y,incrementStep:!0}}case"worktree-relaxation":return Y.push(""),Y.push(`STEP ${L} ${G.h} Worktree relaxation`),Y.push(`  Mode:   ${n.worktree.name}`),Y.push(`  Git cwd: ${_.gitCwd}`),Y.push("  Result: Allowed local discard in linked worktree"),{lines:Y,incrementStep:!0};case"temp-root-relaxation":return Y.push(""),Y.push(`STEP ${L} ${G.h} Temp-root relaxation`),Y.push(`  Git cwd: ${_.gitCwd}`),Y.push("  Result: Allowed git discard in a temp-root repository"),{lines:Y,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(_.embeddedCommandFound)return Y.push(""),Y.push(`STEP ${L} ${G.h} Fallback scan`),Y.push(`  Found: ${_.embeddedCommandFound}`),{lines:Y,incrementStep:!0};return null}case"custom-rules-check":{if(_.rulesChecked){if(Y.push(""),Y.push(`STEP ${L} ${G.h} Custom rules`),_.matched)Y.push("  Result: MATCHED");else Y.push("  Result: No match");return{lines:Y,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(_.matched)return Y.push(""),Y.push(`STEP ${L} ${G.h} Dangerous text check`),Y.push(`  Token:  ${_.token}`),Y.push("  Result: MATCHED"),{lines:Y,incrementStep:!0};return null}case"strict-unparseable":return Y.push(""),Y.push(`STEP ${L} ${G.h} Strict mode check`),Y.push(`  Command: ${_.rawCommand}`),Y.push("  Result:  ✗ UNPARSEABLE"),{lines:Y,incrementStep:!0};case"segment-skipped":return null;case"error":return Y.push(""),Y.push(`ERROR: ${_.message}`),{lines:Y,incrementStep:!1};default:return _}}function ls(_,L){let G=nd(L?.asciiOnly??!1),Y=58,Z=[],oe=1;Z.push(...td(G,58)),Z.push("");let se=_.trace.steps.find((Te)=>Te.type==="error");if(se&&se.type==="error"){Z.push("ERROR"),Z.push(`  ${se.message}`),Z.push(""),Z.push("RESULT"),Z.push(`  Status: ${_.result==="blocked"?en.red("BLOCKED"):en.green("ALLOWED")}`),Z.push(""),Z.push("CONFIG");let Te=_.configSource??"none";return Z.push(`  Path: ${Te}`),Z.join(`
`)}let fe=_.trace.steps.find((Te)=>Te.type==="parse");if(fe&&fe.type==="parse"){Z.push("INPUT"),Z.push(`  ${fe.input}`),Z.push(""),Z.push(`STEP ${oe} ${G.h} Split shell commands`),oe++;for(let Te=0;Te<fe.segments.length;Te++){let Be=fe.segments[Te];if(Be){let Fe=Math.random();Z.push(`  Segment ${Te+1}: ${rd(Be,Fe)}`)}}}let ge=_.trace.segments,Pe=ge.length>1;for(let Te of ge){if(Pe){Z.push("");let tn="";if(fe&&fe.type==="parse"){let Uo=fe.segments[Te.index];if(Uo)tn=Uo.join(" ")}let on=54,an=tn,nn=` Segment ${Te.index+1}: `,sn=" ";if(tn){if(nn.length+tn.length+sn.length>on){let lf=on-nn.length-sn.length;an=`${tn.substring(0,lf-1)}…`}}let Sn=tn?`${nn}${an}${sn}`:` Segment ${Te.index+1} `,sf=tn?`${nn}${en.cyan(an)}${sn}`:Sn,Vs=58-Sn.length,Ks=Math.floor(Vs/2),af=Vs-Ks;Z.push(`${G.sh.repeat(Ks)}${sf}${G.sh.repeat(af)}`)}if(Te.steps.find((tn)=>tn.type==="segment-skipped")){Z.push(""),Z.push("  (skipped — prior segment blocked)");continue}let Fe=!1,Ze=!1;for(let tn of Te.steps){let on=od(tn,oe,G);if(on){if(Ze=!0,tn.type==="recurse"){Z.push("");let an=" RECURSING ",nn=58-an.length-4;Z.push(`  ${G.tl}${G.h}${an}${G.h.repeat(nn)}`),Z.push(`  ${G.v}`),Fe=!0;continue}for(let an of on.lines)if(Fe)Z.push(`  ${G.v} ${an}`);else Z.push(an);if(on.incrementStep)oe++}}if(Fe)Z.push(`  ${G.v}`),Z.push(`  ${G.bl}${G.h.repeat(56)}`);if(!Ze)Z.push(""),Z.push(`  ${en.green("✓")} Allowed (no matching rules)`)}if(Z.push(""),Z.push("RESULT"),_.result==="blocked"){if(Z.push(`  Status: ${en.red("BLOCKED")}`),_.customRule){if(Z.push(`  Rule: ${_.customRule.id}`),_.customRule.rulebook)Z.push(`  Rulebook: ${_.customRule.rulebook.name} ${_.customRule.rulebook.version}`);if(_.customRule.source)Z.push(`  Source: ${_.customRule.source}`);if(_.customRule.override)Z.push(`  Override: reason ${_.customRule.override.reason}`)}if(_.reason){let Te=fr(_.reason,"          ");Z.push(`  Reason: ${Te[0]}`);for(let Be=1;Be<Te.length;Be++)Z.push(Te[Be]??"")}}else Z.push(`  Status: ${en.green("ALLOWED")}`);Z.push(""),Z.push("CONFIG");let Ee=_.configSource??"none",Re=_.configValid?"":" (invalid)";Z.push(`  Path: ${Ee}${Re}`);let Le=_.safetyPresetScope;Z.push(`  Safety preset: ${_.selectedPreset??"standard"}${Le?` (${Or(Le)})`:""}`),Z.push(`  Effective capabilities: ${_.effectiveLevel}`);let _e=Object.entries(_.destructiveCommandRuleOverrides??{});if(Z.push(`  Rule customizations: ${_e.length}`),_.ruleActivation)Z.push(`  Rule activation: ${_.ruleActivation.id} — ${_.ruleActivation.enabled?"on":"off"} via ${_.ruleActivation.source}`);return Z.join(`
`)}function cs(_){return JSON.stringify(_,null,2)}import{resolve as Fh}from"node:path";var id=512,sd={maxTextLength:2048,maxListLength:128,maxObjectProperties:128,maxDepth:16},Lh=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function ps(_){let L=0,G={allocateSegment(){return L++},getNextSegmentIndex(){return L},branch(){let Y=_.fork(),Z=ps(Y);return{trace:Z,adopt(){_.replaceSegmentEvents(Y.finish().events),L=Z.getNextSegmentIndex()}}},recordGlobal(Y){_.record({scope:"global",step:Y})},recordSegment(Y,Z=G.currentSegmentIndex){if(Z===void 0)return;_.record({scope:"segment",segmentIndex:Z,step:Y})}};return G}function fs(_=new Set){let L=[];return{record(G){if(L.length>=id)return;ho(G.step,_,sd),L.push({...G,step:ds(G.step,sd,_)})},fork(){return fs(_)},replaceSegmentEvents(G){L.splice(0,L.length,...[...L.filter((Y)=>Y.scope==="global"),...G].slice(0,id))},finish(){return{events:L}}}}function ho(_,L,G,Y=0,Z=new WeakSet){if(typeof _==="string"){let fe=_.slice(0,G.maxTextLength);if(!rt(fe))return;for(let ge of bt(fe))for(let Pe of ge.match(/[^\s"'()$]+/g)??[])L.add(ad(Pe));return}if(!_||typeof _!=="object"||Y>=G.maxDepth||Z.has(_))return;if(Z.add(_),Array.isArray(_)){let fe=Math.min(_.length,G.maxListLength);for(let ge=0;ge<fe;ge++)ho(_[ge],L,G,Y+1,Z);return}let oe=0,se=new Set;for(let fe in _){if(!Object.hasOwn(_,fe))continue;if(oe>=G.maxObjectProperties)break;oe++,ho(fe,L,G);let ge=us(fe,G,L);if(se.has(ge))continue;se.add(ge),ho(_[fe],L,G,Y+1,Z)}}function ds(_,L,G,Y=0,Z=new WeakSet){if(typeof _==="string")return us(_,L,G);if(!_||typeof _!=="object")return _;if(Y>=L.maxDepth)return;if(Z.has(_))return;if(Z.add(_),Array.isArray(_)){let fe=[],ge=Math.min(_.length,L.maxListLength);for(let Pe=0;Pe<ge;Pe++)fe.push(ds(_[Pe],L,G,Y+1,Z));return fe}let oe={},se=0;for(let fe in _){if(!Object.hasOwn(_,fe))continue;if(se>=L.maxObjectProperties)break;se++;let ge=us(fe,L,G);if(Object.hasOwn(oe,ge))continue;Object.defineProperty(oe,ge,{value:ds(_[fe],L,G,Y+1,Z),enumerable:!0,configurable:!0,writable:!0})}return oe}function us(_,L,G){let Y=_.slice(0,L.maxTextLength),Z=rt(Y)?nt(Y):Y,oe=G.size>0?Hh(Z,G):Z;return(jh(oe)?Me(oe):oe).slice(0,L.maxTextLength)}function jh(_){return _.includes("PRIVATE KEY")||_.includes("://")||_.includes("eyJ")||_.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(_)||_.length>=14&&Lh.some((L)=>_.includes(L))||_.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(_)}function Hh(_,L){return _.replace(/[^\s"'()$]+/g,(G)=>L.has(ad(G))?"<redacted>":G)}function ad(_){let L=2166136261,G=2166136261;for(let Y=0;Y<_.length;Y++)L=Math.imul(L^_.charCodeAt(Y),16777619),G=Math.imul(G^_.charCodeAt(_.length-Y-1),16777619);return`${L>>>0}:${G>>>0}:${_.length}`}function mr(_,L={},G){let Y=Fh(L.cwd??process.cwd()),Z=L.policySnapshot??R(G,{cwd:Y,userConfigDir:L.userConfigDir}),oe=P(Z.policy,G.env),se=qe({policySnapshot:Z,effectiveCapabilities:oe.capabilities,worktreeMode:oe.worktreeMode}),fe={effectiveLevel:se.effectiveLevel,selectedPreset:Z.policy.safety.level,...Z.policyScopes?{safetyPresetScope:Z.policyScopes.levelScope}:{},effectiveCapabilities:se.effectiveCapabilities,destructiveCommandRuleOverrides:Z.policy.destructiveCommandRuleOverrides},{configSource:ge,configValid:Pe}=Uh(G,{cwd:Y,userConfigDir:L.userConfigDir});if(!_||!_.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:ge,configValid:Pe,...fe};let Ee=y(_,"auto");if(Ee.status==="limited")throw new b;let Re=Ee.dialect==="powershell"?y(_,"posix"):Ee,Le=Rt(Re),_e=fs(),Te=ps(_e);Te.recordGlobal({type:"parse",input:_,segments:Le.map((Sn)=>[...Sn])});let Be=l("Bash",{command:_},{kind:"command",shell:"auto"},{configCwd:Y,executionCwd:Y},_),Fe=j(Be,{environment:G,trace:Te,dependencies:{loadPolicySnapshot:()=>Z}}),Ze=Fe.decision.kind==="deny"?Fe.decision:null;if(Ze&&(Fe.stage==="policy-protection"||Fe.stage==="secret-protection"))return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:Mh(Ze),matched:!0,reason:Ze.reason}]}]},result:"blocked",reason:T(Ze.reason),segment:T(ld(Ze,_)),ruleId:T(Ze.ruleId),configSource:ge,configValid:Pe,...fe};let tn=Te.getNextSegmentIndex();if(Ze&&tn>0&&tn<Le.length)Te.recordSegment({type:"segment-skipped",index:tn,reason:"prior-segment-blocked"},tn);let on=_e.finish(),an=Ze?.ruleId??Gh(Be,Z,oe,G),nn=q.find((Sn)=>Sn.id===an&&Sn.activationCapability),sn=nn?se.policy.effectiveDestructiveCommandRules[nn.id]:void 0;return{trace:qh(on),result:Ze?"blocked":"allowed",reason:Ze?T(Ze.reason):void 0,segment:Ze?T(ld(Ze,_)):void 0,ruleId:Ze?T(Ze.ruleId):void 0,customRule:Bh(Vh(Ze?.ruleId,Z)),configSource:ge,configValid:Pe,...fe,...nn&&sn?{ruleActivation:{id:nn.id,...sn}}:{}}}function ld(_,L){return _.evidence?.segment??L}function Mh(_){if(_.reason===Je)return"policy-protection:findPolicyConfigMutationTargetInSemanticFacts";if(_.reason===Ke)return"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts";if(_.reason===v)return"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts";return"secret-protection:findSensitiveTargetInSemanticFacts"}function Uh(_,L){let G=I(L.cwd),Y=z(_,L),Z=Q(_,{cwd:L.cwd,userConfigDir:L.userConfigDir});try{if(r(Z.projectConfigTarget)!==null){if(Un(Z.projectConfigTarget).errors.length===0)return{configSource:G,configValid:!0};return{configSource:G,configValid:!1}}}catch(oe){if(oe instanceof o)return{configSource:G,configValid:!1};throw oe}try{if(r(Z.userConfigTarget)!==null){let oe=Un(Z.userConfigTarget);return{configSource:Y,configValid:oe.errors.length===0}}return{configSource:null,configValid:!0}}catch(oe){if(oe instanceof o)return{configSource:Y,configValid:!1};throw oe}}function Gh(_,L,G,Y){let Z=L.policy,oe=Ne({...Z,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...Z.destructiveCommandRuleOverrides,...Object.fromEntries(q.flatMap((fe)=>fe.activationCapability?[[fe.id,"on"]]:[]))}},L.state==="degraded"?{diagnostics:L.diagnostics,reason:L.reason}:void 0),se=j(_,{environment:Y,dependencies:{loadPolicySnapshot:()=>oe,getModes:()=>({...G,strict:!0,paranoidRm:!0,paranoidInterpreters:!0,capabilities:{fail_closed:{...G.capabilities.fail_closed,enabled:!0},paranoid_rm:{...G.capabilities.paranoid_rm,enabled:!0},paranoid_interpreters:{...G.capabilities.paranoid_interpreters,enabled:!0}}}),findSensitiveTarget:()=>null}});return se.decision.kind==="deny"?se.decision.ruleId:void 0}function Bh(_){if(!_)return;return{id:T(_.id),..._.rulebook?{rulebook:{name:T(_.rulebook.name),version:T(_.rulebook.version)}}:{},..._.source?{source:T(_.source)}:{},..._.override?{override:{type:"reason",reason:T(_.override.reason)}}:{}}}function qh(_){let L=_.events.flatMap((Y)=>Y.scope==="global"?[Y.step]:[]),G=new Map;for(let Y of _.events){if(Y.scope!=="segment")continue;let Z=G.get(Y.segmentIndex)??{index:Y.segmentIndex,steps:[]};Z.steps.push(Y.step),G.set(Y.segmentIndex,Z)}return{steps:L,segments:[...G.values()]}}function Vh(_,L){let G=_?.replace(/^custom\./,"");if(!G||!L.policy.rules.some((Y)=>Y.name===G))return;return L.ruleMetadata[G]??Object.freeze({id:G})}function cd(_){return new Promise((L)=>{process.stdout.write(`${_}
`,()=>L())})}async function dd(_,L){let G=ss(L);if(!G)return 1;try{let Y=mr(G.command,{cwd:G.cwd},_),Z=!!process.env.NO_COLOR||!process.stdout.isTTY;return await cd(G.json?cs(Y):ls(Y,{asciiOnly:Z})),0}catch(Y){let Z=Kh(Y instanceof f?Y.cause:Y);if(Z===void 0)throw Y;if(G.json)return await cd(JSON.stringify({error:Z})),1;return console.error(Z),1}}function Kh(_){if(_ instanceof b)return _.message;if(_ instanceof U)return _.message;if(_ instanceof m)return _.message;if(_ instanceof s&&a[_.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var ud="2.6.13",Rn="  ",Pt="cc-safety-net";function pd(_){return _.argument?`${_.flags} ${_.argument}`:_.flags}function Jh(_){return Math.max(..._.map((L)=>pd(L).length))}function Wh(_){return Math.max(..._.map((L)=>L.usage.length))}function zh(_){return Math.max(..._.map((L)=>`${Pt} ${L.usage}`.length))}function Yh(_,L){let G=`${Pt} ${_.usage}`;return`${Rn}${G.padEnd(L+2)}${_.description}`}function An(_,L){return`${Rn}${_.padEnd(Math.max(40,_.length+2))}${L}`}function zt(_,L=console.log){let G=[];if(G.push(`${Pt} ${_.name}`),G.push(""),G.push(`${Rn}${_.description}`),G.push(""),G.push("USAGE:"),G.push(`${Rn}${Pt} ${_.usage}`),G.push(""),_.subcommands&&_.subcommands.length>0){G.push("SUBCOMMANDS:");let Y=Wh(_.subcommands);for(let Z of _.subcommands)G.push(`${Rn}${Z.usage.padEnd(Y+2)}${Z.description}`);G.push("")}if(_.options.length>0){G.push("OPTIONS:");let Y=Jh(_.options);for(let Z of _.options){let oe=pd(Z),se=Z.default?`${Z.description} (default: ${Z.default})`:Z.description;G.push(`${Rn}${oe.padEnd(Y+2)}${se}`)}G.push("")}if(_.examples&&_.examples.length>0){G.push("EXAMPLES:");for(let Y of _.examples)G.push(`${Rn}${Y}`)}L(G.join(`
`))}function ms(){let _=zh(Tr),L=[];L.push(`${Pt} v${ud}`),L.push(""),L.push("Blocks destructive commands and secret access."),L.push(""),L.push("COMMANDS:");for(let G of Tr)L.push(Yh(G,_));L.push(""),L.push("GLOBAL OPTIONS:"),L.push(`${Rn}-h, --help       Show help (use with command for command-specific help)`),L.push(`${Rn}-V, --version    Show version`),L.push(""),L.push("HELP:"),L.push(`${Rn}${Pt} help <command>     Show help for a specific command`),L.push(`${Rn}${Pt} <command> --help   Show help for a specific command`),L.push(""),L.push("ENVIRONMENT VARIABLES:"),L.push(An(`${n.level.name}=standard|strict|paranoid`,"Set session safety level")),L.push(An(`${n.worktree.name}=1`,"Allow local git discards in linked worktrees")),L.push(An(`${n.debug.name}=1`,"Print diagnostic messages to stderr")),L.push(An(`${n.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),L.push(An(`${n.projectTightenOnly.name}=1`,"Ignore project policy settings that weaken the user policy")),L.push(An("CC_SAFETY_NET_HOME","Override rule config home directory")),L.push(""),L.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),L.push(An(`${n.strict.name}=1`,"Force safety.overrides.fail_closed on")),L.push(An(`${n.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),L.push(An(`${n.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),L.push(An(`${n.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),L.push(""),L.push("Documentation:        https://ccsafetynet.com/docs"),console.log(L.join(`
`))}function fd(){console.log(ud)}function gr(_,L=console.log){let G=Ir(_);if(!G)return!1;if(G.name.toLowerCase()!==_.toLowerCase())return!1;return zt(G,L),!0}import{existsSync as Po,readFileSync as bu}from"node:fs";import{join as So}from"node:path";import*as Vn from"node:readline";function Zh(_){return _==="install"?"Install":"Uninstall"}function Xh(_){return _==="install"?"Installing":"Uninstalling"}function Qh(_){return _==="install"?"into":"from"}function yd(_){return _?.available===!0}function ev(_,L){let G=new Set(L);return _.filter((Y)=>G.has(Y.target)).map((Y)=>Y.target)}function md(_,L,G){if(_.every((Y)=>!Y.available))return L;return Array.from({length:_.length},(Y,Z)=>Z+1).map((Y)=>(L+Y*G+_.length)%_.length).find((Y)=>yd(_[Y]))}function nv(_,L,G){if(G.ctrl&&G.name==="c")return"interrupt";if(G.name==="escape"||L==="q")return"abort";if(_==="install"&&(L==="u"||L==="U"))return"update";if(G.name==="up"||L==="k")return"up";if(G.name==="down"||L==="j")return"down";if(G.name==="space"||L===" ")return"toggle";if(G.name==="return"||G.name==="enter")return"confirm";return null}function tv(_){return{cursor:_.findIndex((L)=>L.available),selected:[]}}function rv(_,L,G){if(G==="confirm"||G==="update"||G==="abort"||G==="interrupt")return{state:_,done:G};if(G==="up")return{state:{..._,cursor:md(L,_.cursor,-1)}};if(G==="down")return{state:{..._,cursor:md(L,_.cursor,1)}};let Y=L[_.cursor];if(!yd(Y))return{state:_};let Z=_.selected.includes(Y.target)?_.selected.filter((oe)=>oe!==Y.target):ev(L,[..._.selected,Y.target]);return{state:{..._,selected:Z}}}var hd="◉",vd="◯",bd=">",wd=" ";function ov(_,L,G){return["",`${Zh(_)} CC Safety Net ${Qh(_)}:`,"",...L.map((Y,Z)=>{let oe=G.selected.includes(Y.target),se=Z===G.cursor,fe=oe?hd:vd,ge=se?bd:wd,Pe=Y.available?"":` (${Y.unavailableReason??"not installed"})`,Ee=`${fe} ${Y.label}${Pe}`,Re=!Y.available?en.dim(Ee):oe?en.green(Ee):se?en.bold(Ee):Ee;return`${ge} ${Re}`}),"",_==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":L.some((Y)=>Y.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${_}. q/Esc: close`].join(`
`)}var gd=["global-hook","plugin"];function iv(_,L,G={}){let Y=G.color!==!1?en.bold:(oe)=>oe;return["","Install the Kimi Code integration as:","",...[`Global hook — ${L?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((oe,se)=>{let fe=se===_,ge=`${fe?hd:vd} ${oe}`;return`${fe?bd:wd} ${fe?Y(ge):ge}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function kd(_){let{input:L,output:G}=_;Vn.emitKeypressEvents(L);let Y=L.isRaw===!0;L.setRawMode(!0),L.resume();let Z=0,oe=()=>{if(Z===0)return;Vn.moveCursor(G,0,-Z),Vn.cursorTo(G,0),Vn.clearScreenDown(G)},se=()=>{oe();let fe=_.render();G.write(`${fe}
`),Z=fe.split(`
`).length};return new Promise((fe)=>{let ge=(Ee)=>{L.off("keypress",Pe),L.setRawMode(Y),L.pause(),oe(),fe(Ee)};function Pe(Ee,Re){_.onKey(Ee,Re,{finish:ge,draw:se})}L.on("keypress",Pe),se()})}function Cd(_={}){let L=0;return kd({input:_.input??process.stdin,output:_.output??process.stdout,render:()=>iv(L,_.globalHookInstalled===!0),onKey:(G,Y,Z)=>{if(Y.ctrl&&Y.name==="c"){Z.finish(null),(_.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(Y.name==="escape"||G==="q")return Z.finish(null);if(Y.name==="return"||Y.name==="enter")return Z.finish(gd[L]);if(Y.name==="up"||Y.name==="down"||G==="k"||G==="j")L=(L+1)%gd.length,Z.draw()}})}function gs(_=process.stdin,L=process.stdout){return Boolean(_.isTTY&&L.isTTY&&typeof _.setRawMode==="function")}function xd(_,L,G={}){let Y=G.output??process.stdout,Z=tv(L);return kd({input:G.input??process.stdin,output:Y,render:()=>ov(_,L,Z),onKey:(oe,se,fe)=>{let ge=nv(_,oe,se);if(!ge)return;let Pe=rv(Z,L,ge);if(Z=Pe.state,Pe.done==="interrupt"){fe.finish(null),(G.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(Pe.done==="abort")return fe.finish(null);if(Pe.done==="update")return fe.finish("update");if(Pe.done==="confirm"){if(Z.selected.length===0){Y.write("\x07"),fe.draw();return}fe.finish([...Z.selected]),Y.write(`${Xh(_)} selected integrations...
`);return}fe.draw()}})}import{existsSync as Sd,lstatSync as av,mkdirSync as lv,mkdtempSync as cv,readdirSync as dv,readFileSync as Zt,rmSync as bo}from"node:fs";import{basename as uv,dirname as pv,join as Cn}from"node:path";import{fileURLToPath as fv}from"node:url";var ys="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",_t="cc-safety-net",Tt="cc-safety-net/index.ts";import{spawn as sv}from"node:child_process";var hs=(_,L)=>{let G=Xn([..._],process.env);return new Promise((Y)=>{let Z=sv(G.cmd,G.args,{cwd:L,stdio:["ignore","pipe","pipe"]}),oe=di(Z),se=!1,fe=setTimeout(()=>{se=!0,Z.kill()},120000);Z.on("error",(ge)=>{clearTimeout(fe),Y({status:null,errorCode:ge.code,stdout:oe.stdout,stderr:[ge.message,oe.stderr].filter(Boolean).join(`
`)})}),Z.on("close",(ge)=>{clearTimeout(fe),Y({status:se?null:ge,errorCode:se?"ETIMEDOUT":void 0,stdout:oe.stdout,stderr:oe.stderr})})})};var Yt="cc-safety-net.ts",vs=Cn("amp",Tt);function mv(_){return Cn(_.home,".config","amp","plugins","cc-safety-net.ts")}function gv(){let _=pv(fv(import.meta.url)),L=Cn(_,vs),G=Cn(_,"..",vs),Y=Cn(_,"..","..","..","dist",vs);return[L,G,Y]}function yv(_=gv()){let L=_.find((G)=>Sd(G)&&av(G).isFile());if(!L)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return L}function Pd(_){try{return JSON.parse(_)}catch{return}}function wo(_){return _.subarray(0,Buffer.byteLength(ys)).toString("utf-8")===ys}async function yr(_,L,G){let Y=await _(L,G);if(Y.status===0)return Y;throw Error([`Failed to run ${L.join(" ")}${Y.status===null?"":` (exit ${Y.status})`}.`,[Y.stdout,Y.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Ed(_){let L=await _(["amp","plugins","repositories","--json"]);if(L.status===null)throw Error(`${L.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${L.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${L.stderr}`.trim());if(L.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${L.status}). Sign in with "amp login" and rerun install --amp.
${[L.stdout,L.stderr].filter(Boolean).join(`
`)}`.trim());let G=Pd(L.stdout),Y=(Array.isArray(G)?G:[]).filter((Z)=>Xe(Z,"scope")==="user"&&Xe(Z,"exists")===!0&&Xe(Z,"viewerCanWrite")===!0).map((Z)=>Xe(Z,"cloneRef")).find((Z)=>typeof Z==="string"&&Z.length>0);if(!Y)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return Y}async function Rd(_,L,G){let Y=cv(Cn(L.tmpdir,"cc-safety-net-amp-"));try{return await yr(_,["amp","clone","user-plugins",Y]),await G(Y)}finally{bo(Y,{recursive:!0,force:!0})}}function bs(_){return`rerun ${_==="overwrite"?"install":"uninstall"} --amp`}function _d(_,L,G){let Y=Cn(_,L),Z=dn(Y);if(!Z)return;if(Z.isSymbolicLink()||!Z.isFile())throw Error(`Refusing to ${G} ${L} in your Amp personal plugins repository: not a regular file. Remove it there and ${bs(G)}.`);let oe=Zt(Y);if(wo(oe))return oe;throw Error(`Refusing to ${G} unmanaged file ${L} in your Amp personal plugins repository. Remove it there and ${bs(G)}.`)}function Td(_,L){let G=Cn(_,_t),Y=dn(G);if(!Y)return;if(Y.isSymbolicLink()||!Y.isDirectory())throw Error(`Refusing to ${L} ${_t} in your Amp personal plugins repository: not a regular directory. Remove it there and ${bs(L)}.`);return _d(_,Tt,L)}function hv(_){let L=Cn(_,Yt),G=dn(L);if(!G||G.isSymbolicLink()||!G.isFile())return;let Y=Zt(L);return wo(Y)?Y:void 0}async function Id(_,L,G,Y){if(await yr(_,G,L),(await yr(_,["git","status","--porcelain"],L)).stdout.trim()==="")return!1;return await yr(_,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",Y],L),await yr(_,["git","push","origin","HEAD"],L),!0}function vo(_,L){vv(_,L),bv(_,L)}function Ad(_,L){if(L==="keep")return;throw Error(`Local Amp plugin ${_} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function vv(_,L){let G=mv(_),Y=dn(G);if(!Y)return;if(!Y.isSymbolicLink()&&Y.isFile()&&wo(Zt(G))){bo(G);return}Ad(G,L)}function bv(_,L){let G=Cn(_.home,".config","amp","plugins",_t),Y=dn(G);if(!Y)return;if(!Y.isSymbolicLink()&&Y.isDirectory()&&wv(G)){bo(G,{recursive:!0});return}Ad(G,L)}function wv(_){let L=uv(Tt);if(dv(_).join("\x00")!==L)return!1;let G=Cn(_,L),Y=dn(G);return!!Y&&!Y.isSymbolicLink()&&Y.isFile()&&wo(Zt(G))}function kv(_){let L=u(_);if(!Sd(L))return"";let G=Pd(Zt(L,"utf-8"));if(!G||typeof G!=="object"||Array.isArray(G))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(k(G,_.home))};
`}async function Od(_,L=yv(),G=hs){let Y=Buffer.concat([Zt(L),Buffer.from(kv(_),"utf-8")]),Z=await Ed(G);return Rd(G,_,async(oe)=>{let se=`${Z}/${_t}`,fe=Td(oe,"overwrite"),ge=_d(oe,Yt,"overwrite");if(fe?.equals(Y)&&!ge)return vo(_,"fail"),{path:se,alreadyInstalled:!0};if(lv(Cn(oe,_t),{recursive:!0}),ln(Cn(oe,Tt),Y),ge)bo(Cn(oe,Yt));let Pe=await Id(G,oe,["git","add","--",Tt,...ge?[Yt]:[]],`chore: update cc-safety-net plugin to v${pn()}`);return vo(_,"fail"),{path:se,alreadyInstalled:!Pe}})}async function $d(_,L=hs){let G=await Ed(L);return Rd(L,_,async(Y)=>{let Z=Td(Y,"remove"),oe=hv(Y),se=`${G}/${oe&&!Z?Yt:_t}`;if(!Z&&!oe)return vo(_,"keep"),{path:se,alreadyInstalled:!1};return await Id(L,Y,["git","rm","--",...Z?[Tt]:[],...oe?[Yt]:[]],`chore: remove cc-safety-net plugin v${pn()}`),vo(_,"keep"),{path:se,alreadyInstalled:!0}})}import{existsSync as Dd,mkdirSync as Cv,readFileSync as xv}from"node:fs";import{dirname as Sv}from"node:path";var ws=kn["antigravity-cli"],It="cc-safety-net";function At(_){return Boolean(_)&&typeof _==="object"&&!Array.isArray(_)}function Co(){return{PreToolUse:[{hooks:[{type:"command",command:ws,timeout:30}]}]}}function Nd(_){try{let L=JSON.parse(xv(_,"utf-8"));if(!L||typeof L!=="object"||Array.isArray(L))throw Error("Antigravity hooks config must be a JSON object");return L}catch(L){if(L instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${_}: ${L.message}`);throw L}}function Ld(_){let L=_[It];if(L===void 0){let Y=Co();return _[It]=Y,{definition:Y,preToolUse:Y.PreToolUse??[]}}if(!At(L))throw Error(`Antigravity hooks config entry "${It}" must be an object`);let G=Array.isArray(L.PreToolUse)?L.PreToolUse:[];return L.PreToolUse=G,{definition:L,preToolUse:G}}function jd(_){if(!Array.isArray(_.PreToolUse))return!1;return _.PreToolUse.some((L)=>At(L)&&Array.isArray(L.hooks)&&L.hooks.some((G)=>At(G)&&G.command===ws))}function Pv(_){return Object.values(_).some((L)=>At(L)&&L.enabled!==!1&&jd(L))}function Ev(_){if(_[It]===void 0)return!1;let L=Ld(_);if(L.definition.enabled!==!1||!jd(L.definition))return!1;return L.definition.enabled=!0,!0}function Rv(_){if(_[It]===void 0){_[It]=Co();return}let L=Ld(_);L.definition.enabled=!0,L.preToolUse.push(Co().PreToolUse?.[0]??{hooks:[]})}function _v(_){let L=!1;for(let G of Object.values(_)){if(!At(G)||!Array.isArray(G.PreToolUse))continue;G.PreToolUse=G.PreToolUse.flatMap((Y)=>{if(!At(Y)||!Array.isArray(Y.hooks))return[Y];let Z=Y.hooks.filter((oe)=>!At(oe)||oe.command!==ws);if(Z.length!==Y.hooks.length)L=!0;return Z.length===0?[]:[{...Y,hooks:Z}]})}return L}function ko(_,L){ln(_,`${JSON.stringify(L,null,2)}
`)}function Hd(_){let L=tr(_.home);if(Cv(Sv(L),{recursive:!0}),!Dd(L))return ko(L,{[It]:Co()}),{path:L,alreadyInstalled:!1};let G=Nd(L);if(Pv(G))return{path:L,alreadyInstalled:!0};if(Ev(G))return ko(L,G),{path:L,alreadyInstalled:!1};return Rv(G),ko(L,G),{path:L,alreadyInstalled:!1}}function Fd(_){let L=tr(_.home);if(!Dd(L))return{path:L,alreadyInstalled:!1};let G=Nd(L);if(!_v(G))return{path:L,alreadyInstalled:!1};return ko(L,G),{path:L,alreadyInstalled:!0}}import{existsSync as xs,readlinkSync as Av}from"node:fs";import{join as Kn}from"node:path";import{spawn as Tv}from"node:child_process";var On=En.map((_)=>({target:_.id,flag:_.flag,label:cn(_.id),probeCommand:_.probeCommand}));function ks(_){let L=new Set(_);return On.map((G)=>G.target).filter((G)=>L.has(G))}async function Md(_,L){for(let G of _)await L(G)}var Iv=5000;function hr(_,L=Iv){return new Promise((G)=>{let Y=Xn([..._],process.env),Z=Tv(Y.cmd,Y.args,{env:process.env,stdio:"ignore"}),oe=!1,se=(ge)=>{if(oe)return;oe=!0,clearTimeout(fe),G(ge)},fe=setTimeout(()=>{Z.kill(),se(!1)},L);Z.on("error",()=>se(!1)),Z.on("close",(ge)=>se(ge===0))})}function Ud(_=hr,L={}){let G=new Set(L.configuredTargets??[]);return Promise.all(On.map(async(Y)=>({target:Y.target,flag:Y.flag,label:Y.label,...Bd(L.action,await _(Y.probeCommand)||Y.target==="cursor"&&await _(oa),G.has(Y.target))})))}function Gd(_,L){let G=new Set(L.configuredTargets??[]);return _.map((Y)=>({...Y,...Bd(L.action,Y.available,G.has(Y.target))}))}function Bd(_,L,G){if(_==="uninstall")return G?{available:!0}:{available:!1,unavailableReason:"not installed"};if(_==="install"&&G)return{available:!1,unavailableReason:"already installed"};if(!L)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}var Jn="cc-safety-net",Jd=["npx","-y","@deepseek-ai/dsh"],qd="DeepSeek Harness",Vd=["@deepseek-ai","dsh-desktop"],Wd="Quit DeepSeek Harness Desktop, then run this command again: Desktop plugins can only change while it is closed.",Cs=(_)=>`DeepSeek Harness Desktop is not in its default location, so ${_} ${Jn} from its Plugins page.`,zd=(_,L)=>xs(Kn(wi(_),L,"package.json"));function Ss(_,L){let G=L.platform??process.platform,Y=zd(_,"desktop"),Z=G==="darwin"?[Kn(_.home,"Applications"),L.systemApplications??"/Applications"].map((oe)=>Kn(oe,`${qd}.app`,"Contents","Resources","runtime","cli","bin","dsh")):G==="win32"?[Kn(_.env.get("LOCALAPPDATA")||Kn(_.home,"AppData","Local"),"Programs",qd,"resources","runtime","cli","bin","dsh.cmd")]:[];return{profile:Y,cli:Y?Z.find((oe)=>xs(oe)):void 0}}function Yd(_,L=process.platform){if(L==="win32")return xs(Kn(_.env.get("APPDATA")||Kn(_.home,"AppData","Roaming"),...Vd,"lockfile"));let G=Ov(Kn(_.home,"Library","Application Support",...Vd,"SingletonLock")),Y=Number(/-(\d+)$/.exec(G??"")?.[1]);return Number.isInteger(Y)&&Y>0&&$v(Y)}function Ov(_){try{return Av(_)}catch{return}}function $v(_){try{return process.kill(_,0),!0}catch(L){return L.code==="EPERM"}}async function Zd(_,L={}){let G=Ss(_,L);if(G.cli&&Yd(_,L.platform))throw Error(Wd);let Y=!G.cli||zd(_,"web")||await(L.probe??hr)(Bo),Z=[...G.cli?[{profile:"desktop",label:"Desktop",dsh:[G.cli]}]:[],...Y?[{profile:"web",label:"web",dsh:Jd}]:[]];return{commands:Z.map((oe)=>[...oe.dsh,"plugin","--profile",oe.profile,"add",`${Jn}@${pn()}`]),afterInstall:async()=>{let oe=new Set(ki(_).filter((fe)=>fe.enabled).map((fe)=>fe.name)),se=Z.filter((fe)=>!oe.has(fe.profile));if(se.length>0)throw Error(`DeepSeek Harness installed ${Jn} in the ${Kd(se)} but did not enable it. Enable it from the Plugins page.`)},message:[`Added ${Jn} to the DeepSeek Harness ${Kd(Z)}.`,...G.profile&&!G.cli?[Cs("add")]:[]].join(`
`)}}function Kd(_){return`${_.map((L)=>L.label).join(" and ")} profile${_.length>1?"s":""}`}function Xd(_,L={}){let G=new Set(ki(_).map((oe)=>oe.name));if(!G.has("desktop")&&!G.has("web"))throw Error(`${Jn} is not installed in the DeepSeek Harness web or Desktop profile`);let Y=G.has("desktop")?Ss(_,L).cli:void 0,Z=G.has("desktop")&&!Y;if(Z&&!G.has("web"))throw Error(Cs("remove"));if(Y&&Yd(_,L.platform))throw Error(Wd);return{commands:[...Y?[[Y,"plugin","--profile","desktop","remove",Jn]]:[],...G.has("web")?[[...Jd,"plugin","--profile","web","remove",Jn]]:[]],...Z?{afterUninstall:()=>{throw Error(`Removed ${Jn} from the DeepSeek Harness web profile, but ${Cs("remove")}`)}}:{}}}function Qd(_,L,G={}){let Y=Ss(L,G).cli!==void 0;return _.map((Z)=>Z.target==="deepseek-harness"&&Y?{...Z,available:!0,unavailableReason:void 0}:Z)}import{existsSync as Dv,readdirSync as Nv,rmSync as Lv}from"node:fs";import{join as jv}from"node:path";function eu(_,L=process.platform,G){if(!Dv(_))return;let Y=L==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);Nv(_).filter((Z)=>Z!==G&&Y.test(Z)).forEach((Z)=>{Lv(jv(_,Z),{recursive:!0,force:!0})})}import{existsSync as nu,readdirSync as Hv,rmSync as Fv}from"node:fs";import{join as Xt}from"node:path";function xo(_,L=process.platform){let G=Xt(_.env.get("npm_config_cache")||(L==="win32"?Xt(_.env.get("LOCALAPPDATA")||Xt(_.home,"AppData","Local"),"npm-cache"):Xt(_.home,".npm")),"_npx");if(!nu(G))return;Hv(G).filter((Y)=>nu(Xt(G,Y,"node_modules","cc-safety-net"))).forEach((Y)=>{Fv(Xt(G,Y),{recursive:!0,force:!0})})}import{existsSync as au,mkdirSync as Uv,readFileSync as lu}from"node:fs";import{dirname as Gv,join as su}from"node:path";function Mv(_,L){if(_[L]!=="#")return L;let G=_.indexOf(`
`,L+1);return G===-1?_.length:G+1}function Ps(_,L,G){let Y=new RegExp(`^(\\s*)${L}\\s*=\\s*\\[`),Z=0;for(let oe of _.split(`
`)){if(/^\s*\[/.test(oe))return;let se=Y.exec(oe);if(se){let fe=Z+se[0].lastIndexOf("[");return{start:fe,end:ai(_,fe,{skipComment:Mv,...G})}}Z+=oe.length+1}return}function tu(_,L,G){let Y=_.slice(0,L.end).trimEnd(),Z=ml(_,L.end),oe=Z===""?"     ":`${Z}  `,se=!Y.endsWith("[")&&!Y.endsWith(",");return`${Y}${se?",":""}
${oe}${G}${_.slice(L.end)}`}function ru(_,L,G){let Y=_.indexOf(G,L.start);if(Y===-1||Y>L.end)return _;return`${_.slice(0,Y)}${_.slice(Y+G.length).replace(/^\s*,/,"")}`}function ou(_,L){let G=new RegExp(`^\\s*${L}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),Y=_.split(`
`),Z=Y.findIndex((fe)=>/^\s*\[/.test(fe)),oe=Z===-1?Y:Y.slice(0,Z),se=Z===-1?[]:Y.slice(Z);return[...oe.filter((fe)=>!G.test(fe)),...se].join(`
`)}function iu(_,L,G){let Y=new RegExp(`^\\s*\\[\\[${L}]]\\s*$`,"m");return _.split(/(?=^\s*\[)/m).filter((Z)=>!Y.test(Z)||!Z.includes(G)).join("").trimEnd()}var vr=kn["kimi-code"],Es=`[[hooks]]
event = "PreToolUse"
command = "${vr}"`,cu=`{ event = "PreToolUse", command = "${vr}" }`,du={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function uu(_){return su(_.env.get("KIMI_CODE_HOME")??su(_.home,".kimi-code"),"config.toml")}function Bv(_){let L=Ps(_,"hooks",du);if(L&&_.slice(L.start+1,L.end).trim())return tu(_,L,cu);let G=ou(_,"hooks").trimEnd();if(G==="")return`${Es}
`;return`${G}

${Es}
`}function pu(_){let L=uu(_);if(Uv(Gv(L),{recursive:!0}),!au(L))return ln(L,`${Es}
`),{path:L,alreadyInstalled:!1};let G=lu(L,"utf-8");if(G.includes(vr))return{path:L,alreadyInstalled:!0};return ln(L,Bv(G)),{path:L,alreadyInstalled:!1}}function fu(_){let L=uu(_);if(!au(L))return{path:L,alreadyInstalled:!1};let G=lu(L,"utf-8");if(!G.includes(vr))return{path:L,alreadyInstalled:!1};let Y=Ps(G,"hooks",du),Z=Y?ru(G,Y,cu):`${iu(G,"hooks",vr)}
`;return ln(L,Z),{path:L,alreadyInstalled:!0}}var Rs="safety-net@cc-marketplace",mu=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),gu=new Set(["antigravity-cli","cursor","devin","droid","grok-build","hermes-agent","kimi-code"]);function _s(_){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(_??"")}function wu(_){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(_??"")}function qv(_){return/^Marketplace `cc-marketplace`\s*$/m.test(_??"")}var ku={"claude-code":{installCommands:(_)=>{let L=Kr(_,"cc-safety-net@cc-marketplace");return{commands:[...L?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...ii(_).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:Kr(_,Rs)?[["claude","plugin","uninstall",Rs]]:[],update:L}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(_,L)=>{let G=L??await fn(["codex","plugin","list"]),Y=wu(G);return{commands:[Y||qv(G)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:_s(G)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:Y}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:dl},"copilot-cli":{installCommands:async()=>{let _=await fn(["copilot","plugin","list"]),L=[...Cl(_)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...xl(_)?[["copilot","plugin","uninstall",bl]]:[]];if(wl(_))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",Tn]],cleanupCommands:L,update:!0};return{commands:[kl(await fn(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",Tn]],cleanupCommands:L}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(_)=>{let L=Ai(_);if(L.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(L.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:Ki,installCommands:(_)=>{let L=!Po(So(dr(_),xn));return{commands:$c(),afterInstall:()=>Dc(L)}},uninstallCommands:[["openclaw","plugins","uninstall",un,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:qc},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]},"deepseek-harness":{installCommands:(_)=>Zd(_),uninstallCommands:(_)=>Xd(_)}};function Cu(_,L=(G)=>G){try{let G=JSON.parse(L(bu(_,"utf-8")));if(!G||typeof G!=="object"||Array.isArray(G))throw Error(`Settings file ${_} must be a JSON object`);return G}catch(G){if(G instanceof SyntaxError)throw Error(`Failed to parse ${_}: ${G.message}`);throw G}}function Vv(_){let L=So(ir(_),"settings.json");if(!Po(L))return;let G=Cu(L,yn),Y=G.enabledPlugins;if(!Y||typeof Y!=="object"||Array.isArray(Y))return;if(Y[Tn]!==!1)return;let Z=bu(L,"utf-8"),oe=Z.replace(new RegExp(`("${Tn}"\\s*:\\s*)false`),"$1true");return Y[Tn]=!0,ln(L,oe!==Z?oe:`${JSON.stringify(G,null,2)}
`),`Enabled ${Tn} plugin in ${L}`}function Kv(_){let L=rs(_);if(!Po(L))return;let G=Cu(L);if(!Array.isArray(G.packages))return;let Y=G.packages.find((Z)=>!!Z&&typeof Z==="object"&&!Array.isArray(Z)&&os(Z.source)&&("extensions"in Z));if(!Y)return;return delete Y.extensions,ln(L,`${JSON.stringify(G,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${L}`}function yu(_,L){let G=mn({label:L,booleans:Object.fromEntries(On.map((oe)=>[oe.target,[oe.flag]]))},_),Y=G.errors[0];if(Y)throw Error(Y);let Z=On.filter((oe)=>G.flags[oe.target]).map((oe)=>oe.target);if(Z.length!==1)throw Error(`Choose exactly one ${L} target: ${On.map((oe)=>oe.flag).join(", ")}`);return Z[0]}async function xu(_,L=Ht){let[G,Y,Z]=await Promise.all([L(["amp","plugins","list"],30000),L(["codex","plugin","list"],30000),L(["copilot","--binary-version"])]);return{codexPluginListOutput:Y,hooks:Wt(_,process.cwd(),{ampPluginListOutput:G,codexPluginListOutput:Y,copilotCliVersion:Z})}}async function Jv(_,L,G=Ht){let Y=await xu(_,G);return Y.hooks.filter((Z)=>L==="install"?Z.configured:Z.detected&&Z.method!==eo||Z.inspectionStatus==="not-inspected").filter((Z)=>!Eu(Z)).filter((Z)=>Z.platform!=="codex"||!_s(Y.codexPluginListOutput)||wu(Y.codexPluginListOutput)).map((Z)=>Z.platform)}function Wv(_,L,G,Y){if(G.length>0)return{finish:async()=>[yu(G,L)]};if(!Y.selectTargets&&!gs(Y.input,Y.output))return{finish:async()=>[yu(G,L)]};let Z=Y.detectConfiguredTargets??(()=>Jv(_,L,Y.fetchVersion)),oe=Promise.all([Ud(Y.probeTargets).then((se)=>Qd(se,_)),Z()]);return{ready:oe,finish:async()=>{let[se,fe]=await oe,ge=Gd(se,{action:L,configuredTargets:fe}),Pe=Y.selectTargets?await Y.selectTargets(L,vu(L,ge)):await xd(L,vu(L,ge),{input:Y.input,output:Y.output});if(Pe==="update")return Pe;if(!Pe||Pe.length===0)return null;return ks(Pe)}}}async function zv(_,L,G=!1,Y){let Z=ku[_];Z.beforeInstall?.(L);let oe=typeof Z.installCommands==="function"?await Z.installCommands(L,Y):{commands:Z.installCommands};return await ui(oe.commands),await Il(oe.cleanupCommands??[]),await oe.afterInstall?.(),[`${oe.update||G?"Updated":"Installed"} ${cn(_)} integration`,oe.message??Z.postInstallMessage].filter(Boolean).join(`
`)}async function Yv(_,L){let G=ku[_];if(!G.uninstallCommands)throw Error(`${cn(_)} uninstall is not supported`);let Y=typeof G.uninstallCommands==="function"?G.uninstallCommands(L):{commands:G.uninstallCommands};return await ui(Y.commands),Y.afterUninstall?.(),`Uninstalled ${cn(_)} integration`}function Zv(_){let L=Jc(_);return L.alreadyInstalled?`Uninstalled OpenCode plugin from ${L.path}`:`OpenCode plugin not installed in ${L.path}`}var Su={"antigravity-cli":{install:Hd,uninstall:Fd},cursor:{install:Ll,uninstall:jl},devin:{install:Kl,uninstall:Jl},droid:{install:ec,uninstall:nc},"grok-build":{install:cc,uninstall:dc},"kimi-code":{install:pu,uninstall:fu}};function Xv(_,L,G,Y=!1){if(_==="install"&&!Y)xo(G);let Z=Su[L][_](G),oe=cn(L),se=_!=="install"?"Uninstalled":Y?"Updated":"Installed";return _==="install"&&Z.alreadyInstalled?Y?`${oe} hook up to date in ${Z.path}`:`${oe} hook already installed in ${Z.path}`:_==="uninstall"&&!Z.alreadyInstalled?`${oe} hook not installed in ${Z.path}`:`${se} ${oe} hook ${_==="install"?"in":"from"} ${Z.path}`}var Pu={amp:{install:Od,uninstall:$d,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:hc,uninstall:vc,afterInstall:async(_)=>{let L=Ui(_);return await fn(["hermes","plugins","enable",Pn,"--no-allow-tool-override"]),!L},beforeUninstall:async(_)=>{Mi(_);try{await fn(["hermes","plugins","disable",Pn])}catch(L){console.warn(`${L instanceof Error?L.message:String(L)}
Removing the plugin files anyway; ${Pn} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function Qv(_,L,G,Y=!1){let Z=Pu[L];if(_==="uninstall")await Z.beforeUninstall?.(G);let oe=_==="install"?await Z.install(G):await Z.uninstall(G),se=_==="install"&&await Z.afterInstall?.(G),fe=cn(L),ge=!se&&(_==="install"&&oe.alreadyInstalled||_==="uninstall"&&!oe.alreadyInstalled);return[ge?_==="install"?`${fe} plugin ${Y?"up to date":"already installed"} at ${oe.path}`:`${fe} plugin not installed at ${oe.path}`:`${_!=="install"?"Uninstalled":Y?"Updated":"Installed"} ${fe} plugin ${_==="install"?"at":"from"} ${oe.path}`,ge?void 0:Z.restartNote].filter(Boolean).join(`
`)}var eb={"copilot-cli":{afterInstall:Vv},cursor:{afterUninstall:Ol},"hermes-agent":{beforeInstall:(_,L)=>{if(!L)xo(_)}},openclaw:{beforeUninstall:Ki},pi:{afterInstall:Kv}};function nb(_){return _ in Su}function tb(_){return _ in Pu}var hu=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net/tree/plugin","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Eu(_){return _.platform==="kimi-code"&&_.method===uo}function Ru(_){return po({environment:_,cwd:process.cwd()}).method==="hook config"}function rb(_){if(!Ru(_))return hu;return[hu,"",en.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function vu(_,L){return L.map((G)=>_==="install"&&G.target==="kimi-code"&&G.unavailableReason==="already installed"?{...G,available:!0,unavailableReason:void 0,label:`${G.label} (global hook installed)`}:G)}function ob(_,L){if(_.selectKimiInstallMethod)return _.selectKimiInstallMethod();if(!gs(_.input,_.output))return Promise.resolve("global-hook");return Cd({input:_.input,output:_.output,globalHookInstalled:Ru(L)})}async function _u(_,L,G,Y=!1,Z){let oe=eb[L];if(_==="install")oe?.beforeInstall?.(G,Y);if(_==="uninstall")oe?.beforeUninstall?.(G);if(nb(L))return[Xv(_,L,G,Y),_==="uninstall"?await oe?.afterUninstall?.(G):void 0].filter(Boolean).join(`
`);if(tb(L))return Qv(_,L,G,Y);if(_==="uninstall")return L==="opencode"?Zv(G):Yv(L,G);return[await zv(L,G,Y,Z),await oe?.afterInstall?.(G)].filter(Boolean).join(`
`)}function ib(_){let L=mn({label:"update"},_).errors[0];if(L)throw Error(L)}async function sb(_,L=Ht){let G=await xu(_,L),Y=So(ir(_),"installed-plugins");return{targets:ks([...G.hooks.filter((oe)=>oe.platform!=="copilot-cli"&&oe.detected&&oe.method!==eo&&oe.method!==hi).map((oe)=>oe.platform),...[Jr,vl,hl].flatMap((oe)=>Po(So(Y,...oe))?["copilot-cli"]:[]),...Kr(_,Rs)?["claude-code"]:[],..._s(G.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:G.codexPluginListOutput,kimiPlugin:G.hooks.some(Eu)}}async function ab(_){let L=c(),G=_.output??process.stdout,Y=(_.scriptPath??process.argv[1]??"").split(/[\\/]/),Z=Y.find((_e)=>/^bunx-\d+-/.test(_e)),oe=Z!==void 0||Y.includes("_npx")?null:(_.checkLatestVersion??Gn)(),se=async()=>{let _e=oe&&await oe;if(_e?.updateAvailable)G.write(`
Update available: cc-safety-net ${_e.currentVersion} → ${_e.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},fe=sb(L,_.fetchVersion??Ht).then(async(_e)=>{let Te=new Set(_e.targets);return{targets:_e.targets,codexPluginListOutput:_e.codexPluginListOutput,kimiPlugin:_e.kimiPlugin,available:new Map(await Promise.all(On.filter((Be)=>Te.has(Be.target)&&mu.has(Be.target)).map(async(Be)=>[Be.target,await hr(Be.probeCommand)])))}}),ge=await nr(_.showBanner??!0,()=>({ready:fe,finish:()=>fe}),()=>er({input:_.input??process.stdin,output:G}),{loadingMessage:"Checking installed integrations…",output:G}),Pe=await Promise.resolve().then(()=>(eu(L.tmpdir,process.platform,Z),null)).catch((_e)=>br(_e));if(ge.targets.length===0){if(G.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),Pe!==null)console.error(Pe);return await se(),Pe===null?0:1}let Ee=ge.targets.some((_e)=>gu.has(_e))?await Promise.resolve().then(()=>(xo(L),null)).catch((_e)=>br(_e)):null,Re=await Hr(Promise.all(ge.targets.map((_e)=>{if(_e==="kimi-code"&&ge.kimiPlugin)return Promise.resolve({message:"Kimi Code plugin skipped: update it in Kimi Code from /plugins (Installed tab, select cc-safety-net, press Enter)",failed:!1});if(mu.has(_e)&&!ge.available.get(_e))return Promise.resolve({message:`${cn(_e)} not found; skipped`,failed:!1});if(Ee!==null&&gu.has(_e))return Promise.resolve({message:Ee,failed:!0});return _u("install",_e,L,!0,ge.codexPluginListOutput).then((Te)=>({message:Te,failed:!1}),(Te)=>({message:br(Te),failed:!0}))})),{loadingMessage:`Updating ${ge.targets.length} integration${ge.targets.length===1?"":"s"}…`,output:G}),Le=Pe===null?Re:[...Re,{message:Pe,failed:!0}];return Le.forEach((_e)=>_e.failed?console.error(_e.message):G.write(`${_e.message}
`)),await se(),Le.some((_e)=>_e.failed)?1:0}function Ts(_,L={}){return Promise.resolve().then(()=>ib(_)).then(()=>ab(L)).catch((G)=>(console.error(br(G)),1))}async function wr(_,L,G={}){try{let Y=c(),Z=await nr(!0,()=>Wv(Y,_,L,G),()=>er({input:G.input??process.stdin,output:G.output??process.stdout}),{loadingMessage:_==="install"?"Checking available integrations…":"Checking installed integrations…",output:G.output??process.stdout});if(!Z)return(G.output??process.stdout).write(`Cancelled: nothing was ${_}ed.
`),0;if(Z==="update")return(G.runUpdate??(()=>Ts([],{fetchVersion:G.fetchVersion,input:G.input,output:G.output,showBanner:!1})))();let oe=G.output??process.stdout;return await Md(Z,async(se)=>{if(se==="kimi-code"&&_==="install"){let ge=await ob(G,Y);if(ge===null){oe.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(ge==="plugin"){oe.write(`${rb(Y)}
`);return}}let fe=await Hr(_u(_,se,Y),{loadingMessage:`${_==="install"?"Installing":"Uninstalling"} ${cn(se)} integration…`,output:oe});oe.write(`${fe}
`)}),0}catch(Y){return console.error(br(Y)),1}}function br(_){let L=_ instanceof Error?_.message:String(_),G=typeof _==="object"&&_!==null&&"code"in _?_.code:null;if(G==="EACCES"||G==="EPERM")return`${L}
Check file permissions for the target config file and parent directory.`;if(G==="ENOENT")return`${L}
Check that the target config path and parent directory exist.`;if(G==="ENOTDIR")return`${L}
Check that every parent path component is a directory.`;return L}import{mkdirSync as fb}from"node:fs";import{dirname as mb}from"node:path";import{createInterface as gb}from"node:readline";import{existsSync as Iu,readFileSync as lb}from"node:fs";function Ot(_,L){let G=ft(_,L);return{policy:G.policy,errors:ue(ut(G.issues,pt,(Y)=>Y.kind==="custom")," "," ")}}function kr(_,L){return Ot(_,L).errors}function Tu(_,L){return{"safety.level":_.safety.level,...Is("safety.overrides",_.safety.overrides),"workflow.worktree_mode":String(_.workflow.worktree_mode),"destructive_command_protection.enabled":String(_.destructive_command_protection.enabled),...Is("destructive_command_protection.overrides",_.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":As(_.destructive_command_protection.allow_paths),"secret_protection.enabled":String(_.secret_protection.enabled),...Is("secret_protection.overrides",_.secret_protection.overrides),"secret_protection.deny_paths":As(_.secret_protection.deny_paths),"secret_protection.allow_paths":As(_.secret_protection.allow_paths),...L?{"audit.retention_days":String(_.audit.retention_days)}:{}}}function Eo(_,L,G){let Y=Tu(_,G),Z=Tu(L,G);return[...new Set([...Object.keys(Y),...Object.keys(Z)])].flatMap((oe)=>Y[oe]===Z[oe]?[]:[{field:oe,before:Y[oe],after:Z[oe]}])}function Cr(_,L){let G=u(_,L);if(!Iu(G))return{baseline:k(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,_.home),diagnostics:[]};let Y=$t(G),Z=Ot(Y.value,_.home);return{baseline:Z.policy,diagnostics:Y.errors.length>0?Y.errors:Z.errors}}function $t(_){if(!Iu(_))return{errors:[`${_}: file not found`]};try{return{value:JSON.parse(lb(_,"utf-8")),errors:[]}}catch(L){let G=L instanceof Error?L.message:String(L);return{errors:[`${_}: ${L instanceof SyntaxError?`Invalid JSON: ${G}`:G}`]}}}function Ro(_,L){let G=cb(_)?_:{};return{version:L.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((Y)=>G[Y]!==void 0).map((Y)=>[Y,G[Y]]))}}function Is(_,L){return Object.fromEntries(Object.entries(L).flatMap(([G,Y])=>Y===void 0?[]:[[`${_}.${G}`,String(Y)]]))}function As(_){return _.length===0?"(none)":_.join(", ")}function cb(_){return!!_&&typeof _==="object"&&!Array.isArray(_)}import{chmodSync as db,existsSync as Au,mkdirSync as ub,readFileSync as Ou}from"node:fs";import{dirname as pb}from"node:path";function $u(_,L={}){let G=u(_,L);if(!Au(G))return{path:G,exists:!1,raw:"",policy:A(),errors:[]};let Y=Ou(G,"utf-8");if(!Y.trim())return{path:G,exists:!0,raw:Y,policy:A(),errors:["Config file is empty"]};try{let Z=Ot(JSON.parse(Y),_.home);return{path:G,exists:!0,raw:Y,policy:Z.policy,errors:Z.errors}}catch(Z){return{path:G,exists:!0,raw:Y,policy:A(),errors:[`Invalid JSON: ${Z instanceof Error?Z.message:String(Z)}`]}}}function Fn(_,L,G={}){let Y=u(_,G),Z=Ot(L,_.home);if(Z.errors.length>0)return{path:Y,policy:A(),errors:Z.errors};let oe=Z.policy;return ub(pb(Y),{recursive:!0,mode:448}),g(ae(Y),`${JSON.stringify(oe,null,2)}
`,384),db(Y,384),{path:Y,policy:oe,errors:[]}}function Du(_,L){let G=Ot(L,_.home);if(G.errors.length>0)return{errors:G.errors};return{preview:We(G.policy,_.env),errors:[]}}function Nu(_,L={}){let G=u(_,L);if(!Au(G))return Fn(_,ne,L);let Y=Ou(G,"utf-8");if(!Y.trim())return Fn(_,ne,L);try{return Fn(_,k(JSON.parse(Y),_.home),L)}catch{return Fn(_,ne,L)}}var Lu=new Set(["check","apply"]),ju="(unset)";async function Fu(_,L,G={}){let Y=mn({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},L),Z=Y.positionals[0],oe=[...Y.errors,...Z&&!Lu.has(Z)?[`Unknown policy subcommand: ${Z}`]:[],...Z&&Lu.has(Z)&&!Y.positionals[1]?[`policy ${Z} requires a file`]:[],...Y.positionals.slice(2).map((Be)=>`Unexpected policy argument: ${Be}`)];if(oe.length>0){for(let Be of oe)console.error(Be);return 1}let se=Y.positionals[1];if(!Z||!se)return zt(_r,console.error),1;let fe=G.cwd??process.cwd(),ge=Y.flags.global?u(_):h(fe);if(!Y.flags.global&&O(_,{cwd:fe}))return console.error(`${ge} is the user policy, not a project policy; use --global for the user scope, or run from a project directory`),1;let Pe=$t(se),Ee=[...Pe.errors,...kr(Pe.value,_.home).map((Be)=>`${se}: ${Be}`),...!Y.flags.global&&vb(Pe.value)&&Pe.value.audit!==void 0?[`${se}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(Ee.length>0){for(let Be of Ee)console.error(Be);return 1}let Re=k(Pe.value,_.home);if(console.log(`Scope: ${Y.flags.global?"user":"project"} (${ge})`),console.log(`Proposal: ${se}`),Y.flags.global)Hu(k($t(ge).value,_.home),Re,!0);if(!Y.flags.global){let Be=Cr(_).baseline;console.log("Effective policy (user + project merged):"),Hu(te(Be,pe($t(ge).value,_.home).policy).policy,te(Be,pe(Pe.value,_.home).policy).policy,!1)}if(Z==="check")return 0;let Le=G.input??process.stdin,_e=G.output??process.stdout;if(!Le.isTTY||!_e.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${se}${Y.flags.global?" --global":""}`),1;if(!await yb(`Apply this policy to ${ge}? [y/N] `,Le,_e))return console.log("Cancelled; nothing was written."),0;return hb(_,ge,Pe.value,Re,Y.flags.global),console.log(`Policy applied: ${ge}`),0}function yb(_,L,G){let Y=gb({input:L,output:G,terminal:!1});return new Promise((Z)=>{Y.once("close",()=>Z(!1)),Y.question(_,(oe)=>{Z(/^y(es)?$/i.test(oe.trim())),Y.close()})})}function hb(_,L,G,Y,Z){if(Z){Fn(_,Y);return}fb(mb(L),{recursive:!0}),bn(L,Ro(G,Y))}function Hu(_,L,G){let Y=Eo(_,L,G);if(Y.length===0){console.log("No changes.");return}console.log(`Changes (${Y.length}):`);for(let Z of Y)console.log(`  ${Z.field}: ${Z.before??ju} -> ${Z.after??ju}`)}function vb(_){return!!_&&typeof _==="object"&&!Array.isArray(_)}import{join as Ow}from"node:path";var Mu="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- `caffeinate`, `exec`, `nice`, `nohup`, `setsid`, `stdbuf`, `time`, and `timeout` are built-in transparent wrappers and need no configuration. Configure only other wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n- `command_tools`: Optional array of shell tools that a plugin adds to an agent and that CC Safety Net does not know. Each entry is a tool name such as `\"ops_bash\"`, or `{ \"name\": \"ops_run_background\", \"cwd\": \"cwd\" }` when the tool takes its working directory in a named argument (otherwise `workdir`, `cwd`, or `working_directory` is read). A call to a declared tool with a non-empty string `command` is analyzed like a built-in shell command. User and project lists merge; the user entry wins a name declared in both.\n- Built-in shell and file tools are already analyzed and cannot be declared; `rule verify` reports one declared by hand.\n- Use `cc-safety-net rule tool add ops_bash ops_run_background` to declare tools in the user config, or add `--project` for the project config.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function _o(_,L){if(!_.ok){Ku(_);return}Bu(_,L)}function Gu(_,L,G){if(_.ok)console.log(G);if(!_.add){_o(_,`Added rulebook source: ${L}`);return}if(!_.ok){Ku(_);return}if(_.add.added.length>0)console.log(`Added ${_.add.added.length} ${_.add.added.length===1?"rulebook":"rulebooks"} from ${_.add.source} at ${_.add.ref}:`),_.add.added.forEach((Y)=>{console.log(`  - ${Y}`)});if(_.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${_.add.source} at ${_.add.ref}: ${_.add.alreadyConfigured.join(", ")}`);if(_.add.commits.length>0)console.log(`Vendored at ${_.add.commits.map((Y)=>Y.slice(0,7)).join(", ")}.`);Bu(_,"Rule config updated.")}function Bu(_,L){for(let G of _.changes??[])console.log(G);console.log(L),console.log(""),bb(_.entries)}function bb(_){if(_.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${_.length}):`);for(let L of _)console.log(`  - ${L.name} ${L.version} (${wb(L.ruleCount)})`),console.log(`    Source: ${L.spec}`)}function wb(_){return`${_} ${_===1?"rule":"rules"}`}function qu(_){Wn("Active sources",_.rulebooks,(L)=>[`[${L.source}] ${L.name} ${L.version}`,`  Source: ${L.spec}`]),Wn("Active rules",_.rules,(L)=>[`[${Cb(_,L.name)}] ${L.name}`,...kb(L),`  Reason: ${L.reason}`]),Wn("Disabled rules",Uu(_,"off"),(L)=>[L.key]),Wn("Reason overrides",Uu(_,"reason"),(L)=>[L.key,`  Reason: ${L.value.reason}`]),Wn("Transparent wrappers",_.transparent_wrappers,(L)=>[L]),Wn("Issues",_.errors,(L)=>[L]),Wn("Warnings",_.warnings,(L)=>[L])}function Vu(_){Wn("Command tools",_,(L)=>typeof L.tool==="string"?[`[${L.scope}] ${L.tool}`]:[`[${L.scope}] ${L.tool.name}`,...L.tool.cwd===void 0?[]:[`  Cwd argument: ${L.tool.cwd}`]])}function Wn(_,L,G){if(L.length===0){console.log(`${_}: (none)`);return}console.log(`${_} (${L.length}):`);for(let Y of L){let[Z,...oe]=G(Y);console.log(`  - ${Z}`);for(let se of oe)console.log(`    ${se}`)}}function kb(_){if(!_.match)return[`  Command: ${_.subcommand?`${_.command} ${_.subcommand}`:_.command}`,`  Block args: ${_.block_args.join(", ")}`];return[`  Command: ${[_.command,..._.match.command_path].join(" ")}`,..._.match.any_args?[`  Any args: ${_.match.any_args.join(", ")}`]:[],..._.match.exclude_args?[`  Exclude args: ${_.match.exclude_args.join(", ")}`]:[]]}function Cb(_,L){return _.rulebooks.find((G)=>G.rules.includes(L))?.source??"project"}function Uu(_,L){return Object.entries({..._.userConfig?.overrides,..._.projectConfig?.overrides}).filter((G)=>{if(L==="off")return G[1]==="off";return!!G[1]&&typeof G[1]==="object"}).map(([G,Y])=>({key:G,value:Y}))}function Ku(_){for(let L of _.errors)console.error(L)}import{dirname as gp,join as Lo}from"node:path";import{join as Ns,resolve as Db}from"node:path";function xr(_){let L=d(_);if(L.errors.length>0)return{ok:!1,result:{ok:!1,errors:L.errors,entries:[]}};return{ok:!0,config:L.config??le}}function Ju(_){bn(_,le)}function Wu(_){bn(_,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as Oo}from"node:path";var xb="custom.";function To(_){if(_.rulebook_version!==2)return[];let L=_.rules.map((G)=>({name:G.name,command:G.command,block_args:[],match:G.match,reason:G.reason,intent:G.intent}));return(_.tests??[]).flatMap((G,Y)=>{let Z=Os(y(G.command));if(Z.length===0)return[`tests[${Y}]: could not parse fixture command: ${G.command}`];let oe=Z.reduce((se,fe)=>se??N(fe,L)?.id.slice(xb.length),void 0);if(G.expect==="blocked"){if(oe===G.rule)return[];let se=oe?`"${oe}" matched first`:"no rule matched";return[`tests[${Y}]: expected "${G.rule}" to block "${G.command}" but ${se}`]}return oe?[`tests[${Y}]: expected "${G.command}" to be allowed but "${oe}" matched`]:[]})}function Os(_){return _.nodes.flatMap((L)=>{if(L.kind==="group"||L.kind==="function")return Os(L.body);if(L.kind!=="command")return[];let G=Ce(re(L.dialect,L.words)).words.map(t);return[...G.length>0?[G]:[],...L.nested.flatMap((Y)=>Os(Y))]})}var Io=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function Ao(_={}){return{requests:0,responseBytes:0,maxRequests:_.maxRequests??Io.maxRequests,maxResponseBytes:_.maxResponseBytes??Io.maxResponseBytes}}function Mn(_){return{controller:new AbortController,budget:Ao(),resolveUrl:_}}function zu(_){return _ instanceof Error&&_.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function Yu(_){if(_.requests>=_.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");_.requests++}function Zu(_,L){if(L>_.maxResponseBytes-_.responseBytes)throw _.responseBytes+=L,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");_.responseBytes+=L}var ep=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function Xu(_,L,G=w(Oo(Oo(L)),"rules policy"),Y=Mn()){if(C(_))return Rb(_,Y);return Eb(_,L,G)}async function np(_,L,G,Y,Z,oe){if(!C(_))return Xu(_,L,G,Y);let se=Z?null:Sb(_,L,G);if(se)return se;if(!Z&&!oe)throw Error(`${_} is not vendored; run rule update ${_} to vendor it`);return Xu(_,L,G,Y)}function Sb(_,L,G=w(Oo(Oo(L)),"rules policy")){let Y=M(_),Z=F(L,Y.name),oe=r(i(G,Z));if(oe===null)return null;let se=de($s(oe,`Invalid rulebook ${Z}.`));if(se.name!==Y.name)throw Error(`rulebook name "${se.name}" in ${Z} must match "${Y.name}"`);return{spec:_,rulebook:se,content:oe}}async function tp(_,L={}){if(!X(_))throw Error(`Invalid GitHub repository source: ${_}`);let[G,Y]=_.split("/");if(!G||!Y)throw Error(`Invalid GitHub repository source: ${_}`);if(L.ref!==void 0&&!ce(L.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${L.ref}`);let Z=L.operation??Mn(),oe=L.ref??await Pb(G,Y,_,Z),se=await op(G,Y,oe,_,Z),fe=await $o(`https://api.github.com/repos/${G}/${Y}/git/trees/${se}?recursive=1`,"tree",Z),ge=fe.response;if(!ge.ok)throw Error(`Failed to inspect ${_}: GitHub tree returned ${ge.status}`);let Pe=JSON.parse(fe.content);if(!Array.isArray(Pe?.tree))throw Error(`Failed to inspect ${_}: unexpected GitHub tree response`);let Ee=Pe.tree,Re=[...new Set(Ee.flatMap((Le)=>{if(!Le||typeof Le!=="object")return[];let _e=Le;if(_e.type!=="blob"||typeof _e.path!=="string")return[];let Te=_e.path.match(Et);return Te?.[1]?[Te[1]]:[]}))].sort();if(Re.length===0)throw Error(`No rulebooks found in ${_} under ${be}/`);return{source:_,owner:G,repo:Y,ref:oe,commit:se,names:Re}}async function Pb(_,L,G,Y){let Z=await $o(`https://api.github.com/repos/${_}/${L}`,"metadata",Y),oe=Z.response;if(!oe.ok)throw Error(`Failed to inspect ${G}: GitHub returned ${oe.status}`);let fe=JSON.parse(Z.content)?.default_branch;if(typeof fe!=="string"||fe==="")throw Error(`Failed to inspect ${G}: missing default branch`);if(!ce(fe))throw Error(`GitHub returned an invalid default branch: ${fe}`);return fe}function Eb(_,L,G){kt(_);let Y=F(L,_),Z=r(i(G,Y));if(Z===null)throw Error(`Rulebook source not found: ${_}`);let oe=rp($s(Z,"Invalid local rulebook source."));if(oe.name!==_)throw Error(`rulebook name "${oe.name}" must match local source "${_}"`);return{spec:_,rulebook:oe,content:Z}}async function Rb(_,L){let G=M(_),Y=await op(G.owner,G.repo,G.ref,_,L),Z=await $o(`https://raw.githubusercontent.com/${G.owner}/${G.repo}/${Y}/${G.path}`,"raw",L),oe=Z.response;if(!oe.ok)throw Error(`Failed to fetch ${_}: GitHub raw returned ${oe.status}`);let se=Z.content,fe=rp($s(se,"Invalid GitHub rulebook response."));if(fe.name!==G.name)throw Error(`rulebook name "${fe.name}" must match GitHub source "${G.name}"`);return{spec:_,rulebook:fe,content:se}}function rp(_){let L=de(_),G=To(L);if(G.length>0)throw Error(G.join("; "));return L}function $s(_,L){try{return JSON.parse(_)}catch{throw Error(L)}}async function op(_,L,G,Y,Z){let oe=await $o(`https://api.github.com/repos/${_}/${L}/commits/${encodeURIComponent(G)}`,"commit",Z),se=oe.response;if(!se.ok)throw Error(`Failed to resolve ${Y}: GitHub returned ${se.status}`);let fe=JSON.parse(oe.content);if(typeof fe?.sha!=="string"||fe.sha==="")throw Error(`Failed to resolve commit for ${Y}`);return fe.sha}async function _b(_,L,G={}){if(G.signal?.aborted)throw G.signal.reason;let Y=G.budget??Ao(),Z=new AbortController,oe=()=>Z.abort(G.signal?.reason);G.signal?.addEventListener("abort",oe,{once:!0});let se=!1,fe=setTimeout(()=>{if(Z.signal.aborted)return;se=!0,Z.abort()},G.timeoutMs??ep.timeoutMs);try{if(G.signal?.aborted)throw G.signal.reason;Yu(Y);let ge=await fetch(_,{signal:Z.signal,redirect:"error"});if(!ge.ok)return ip(ge),{response:ge,content:""};return{response:ge,content:await Tb(ge,L,Y,()=>Z.abort())}}catch(ge){if(se)throw Error("GitHub request timed out",{cause:ge});if(G.signal?.aborted)throw G.signal.reason;throw ge}finally{clearTimeout(fe),G.signal?.removeEventListener("abort",oe)}}function $o(_,L,G){return _b(G.resolveUrl?.(_)??_,L,{budget:G.budget,signal:G.controller.signal})}async function Tb(_,L,G=Ao(),Y){let Z=ep[`${L}Bytes`],oe=Number(_.headers.get("content-length"));if(Number.isFinite(oe)&&oe>Z)throw ip(_),Error(`GitHub ${L} response exceeds ${Z} bytes`);if(!_.body)return"";let se=_.body.getReader(),fe=[],ge=0;while(!0){let Pe=await se.read();if(Pe.done)break;try{Zu(G,Pe.value.byteLength)}catch(Ee){throw Y?.(),Qu(se),Ee}if(ge+=Pe.value.byteLength,ge>Z)throw Y?.(),Qu(se),Error(`GitHub ${L} response exceeds ${Z} bytes`);fe.push(Buffer.from(Pe.value))}return Buffer.concat(fe,ge).toString("utf-8")}function ip(_){if(!_.body)return;sp(()=>_.body?.cancel())}function Qu(_){sp(()=>_.cancel())}function sp(_){try{Promise.resolve(_()).catch(()=>{})}catch{}}var Ib=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function ap(_,L){let G=dp(_.rules,L);if(G.length>0)return{ok:!0,specs:G};return cp(_.rules,L)}function lp(_,L){let G=dp(_,L);if(G.length>0)return{ok:!0,specs:G};let Y=Ob(_,L);if(Y.length>0)return{ok:!0,specs:Y};let Z=$b(_,L);if(!Z.ok)return Z;if(Z.specs.length>0)return{ok:!0,specs:Z.specs};return cp(_,L)}function cp(_,L){let G=_.filter((Y)=>Ds(Y)?.name===L);if(G.length===1)return{ok:!0,specs:G};return Ab(L,G)}function Ab(_,L){return{ok:!1,result:{ok:!1,errors:L.length===0?[`No configured rulebook matches ${_}`]:[`Ambiguous rulebook match ${_}: ${L.join(", ")}`],entries:[]}}}function dp(_,L){return _.filter((G)=>G===L)}function Ob(_,L){let G=L.match(Ib),Y=G?.[1],Z=G?.[2],oe=G?.[3];if(!Y||!Z||!oe||!ce(oe))return[];return up(_,(se)=>se.owner===Y&&se.repo===Z&&se.ref===oe)}function $b(_,L){if(!X(L))return{ok:!0,specs:[]};let[G,Y]=L.split("/"),Z=up(_,(se)=>se.owner===G&&se.repo===Y);if(new Set(Z.map((se)=>Ds(se)?.ref).filter((se)=>!!se)).size<2)return{ok:!0,specs:Z};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${L}. Use an explicit ref:`,`  cc-safety-net rule remove ${L}#<ref>`],entries:[]}}}function Ds(_){try{return M(_)}catch{return null}}function up(_,L){return _.filter((G)=>{let Y=Ds(G);return Y?L(Y):!1})}async function No(_,L={}){return Nb(_,L,await Do(_,L,Mn()))}function Nb(_,L,G){if(!G.ok)return G;let Y=hn(_,L),Z=[...new Set(V(Y.configPath,Y.filesystemScope))];if(Z.length===0)return G;return{ok:!1,errors:Z,entries:G.entries}}async function Do(_,L,G,Y={},Z=new Set,oe=new Set){try{let se=hn(_,L),fe=xr(se.configTarget);if(!fe.ok)return fe.result;let ge=fe.config,Pe=L.only?ap(ge,L.only):{ok:!0,specs:ge.rules};if(!Pe.ok)return Pe.result;let Ee=new Set([...L.refresh?Pe.specs:[],...Z]),Re=(nn)=>np(nn,se.configDir,se.filesystemScope,G,Ee.has(nn),!L.refresh||Ee.has(nn)),Le=await Vb(ge.rules,L.refresh?(nn)=>Re(nn).then((sn)=>({ok:!0,item:sn})).catch((sn)=>{if(zu(sn))throw sn;return{ok:!1,spec:nn,message:sn instanceof Error?sn.message:String(sn)}}):async(nn)=>({ok:!0,item:await Re(nn)}),G),_e=Le.filter((nn)=>!nn.ok),Te=Le.filter((nn)=>nn.ok).map((nn)=>nn.item),Be=Te.flatMap((nn)=>Lb(nn,ge.rules)),Fe=Te.flatMap((nn)=>jb(nn,oe,se)),Ze=new Set([...Be,...Fe].map((nn)=>nn.spec)),tn=[..._e,...Be,...Fe],on=[],an=Fb(on,()=>Te.flatMap((nn)=>Ze.has(nn.spec)||tn.length>0&&oe.has(nn.spec)?[]:Hb(nn,se,Y,on)));return{ok:tn.length===0,errors:tn.map((nn)=>`Failed to update ${nn.spec}: ${nn.message}`),entries:Te.map(Ub),changes:an}}catch(se){return Pr(se)}}function Lb(_,L){if(!C(_.spec))return[];let G=He(_.spec),Y=L.filter((Z)=>Z!==_.spec&&He(Z).toLowerCase()===G.toLowerCase());if(Y.length===0)return[];return[{ok:!1,spec:_.spec,message:`rulebook name "${G}" is also claimed by ${Y.join(", ")}; rename one of them`}]}function jb(_,L,G){if(!L.has(_.spec)||!C(_.spec))return[];let Y=F(G.configDir,_.rulebook.name),Z=r(i(G.filesystemScope,Y));if(Z===null||Z===_.content)return[];return[{ok:!1,spec:_.spec,message:`${Y} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function Hb(_,L,G,Y){if(!C(_.spec))return[];let Z=F(L.configDir,_.rulebook.name),oe=i(L.filesystemScope,Z),se=r(oe);if(se===_.content)return[];return Y?.push({target:oe,previous:se}),g(oe,_.content,void 0,G._testAfterPolicyRename),Mb(_,se)}function Fb(_,L){try{return L()}catch(G){for(let Y of[..._].reverse()){if(Y.previous===null){B(Y.target);continue}g(Y.target,Y.previous)}throw G}}function Mb(_,L){if(L===null)return[`Vendored ${_.spec} (${_.rulebook.version})`];let G=we(L),Y="problem"in G?null:G.rulebook,Z=new Map(Y?.rules.map((se)=>[se.name,JSON.stringify(se)])??[]),oe=new Set(_.rulebook.rules.map((se)=>se.name));return[`Updated ${_.spec} (${Y?.version??"unreadable"} -> ${_.rulebook.version})`,...[...oe].filter((se)=>!Z.has(se)).map((se)=>`  + ${se}`),...[...Z.keys()].filter((se)=>!oe.has(se)).map((se)=>`  - ${se}`),..._.rulebook.rules.filter((se)=>{let fe=Z.get(se.name);return fe!==void 0&&fe!==JSON.stringify(se)}).map((se)=>`  ~ ${se.name}`)]}function Ub(_){return{spec:_.spec,name:_.rulebook.name,version:_.rulebook.version,ruleCount:_.rulebook.rules.length}}async function pp(_,L,G={}){return Gb(_,L,G,Mn())}async function Gb(_,L,G,Y,Z={}){let oe=null,se=!1;try{let fe=hn(_,G),ge=r(fe.configTarget);oe={target:fe.configTarget,content:ge};let Pe=xr(fe.configTarget);if(!Pe.ok)return Pe.result;let Ee=Pe.config,Re=X(L)?await tp(L,{ref:G.ref,operation:Y}):null,Le=Re?Bb(Re,G.rulebooks):[],_e=Re?Le.map((tn)=>qb(Ee.rules,Re,tn)??`${L}#${Re.ref}/${tn}`):[L],Te=_e.filter((tn)=>!Ee.rules.includes(tn)),Be=[...Ee.rules,...Te];if(Be.length>xe)return Kb();if(Be.length!==Ee.rules.length)se=!0,bn(fe.configTarget,{...Ee,rules:Be},void 0,Z._testAfterPolicyRename);let Fe=await Do(_,G,Y,Z,new Set(Te),new Set(Te));if(!Fe.ok)Sr(fe.configTarget,ge);if(!Fe.ok||!Re)return Fe;let Ze=Le.filter((tn,on)=>Te.includes(_e[on]??""));return{...Fe,add:{source:L,ref:Re.ref,selected:Le,added:Ze,alreadyConfigured:Le.filter((tn)=>!Ze.includes(tn)),commits:Te.length>0?[Re.commit]:[]}}}catch(fe){if(se&&oe)try{Sr(oe.target,oe.content)}catch(ge){return Pr(ge)}return Pr(fe)}}function Bb(_,L){let G=L?[...new Set(L)]:_.names,Y=G.filter((Z)=>!_.names.includes(Z));if(Y.length>0)throw Error(`Rulebooks not found in ${_.source} at ${_.ref}: ${Y.join(", ")}
Available rulebooks: ${_.names.join(", ")}`);return G}function qb(_,L,G){let Y=`${L.source}#${L.ref}/${G}`;if(_.includes(Y))return Y;let Z=`${L.source}#${L.commit}/${G}`;return _.find((oe)=>oe===Z)}async function Vb(_,L,G=Mn()){if(_.length>xe)throw Error(ve);let Y=[],Z=0,oe,se=Array.from({length:Math.min(_.length,Io.concurrency)},async()=>{while(!oe){let fe=Z;if(fe>=_.length)return;Z++;try{Y[fe]=await L(_[fe],fe,G.controller.signal)}catch(ge){if(!oe)oe={value:ge},Z=_.length,G.controller.abort(ge);return}}});if(await Promise.all(se),oe)throw oe.value;return Y}function Kb(){return{ok:!1,errors:[ve],entries:[]}}async function fp(_,L,G={}){try{return await Jb(_,L,G,{})}catch(Y){return Pr(Y)}}async function Jb(_,L,G,Y){let Z=hn(_,G),oe=d(Z.configTarget);if(oe.errors.length>0)return{ok:!1,errors:oe.errors,entries:[]};if(!oe.config)return{ok:!1,errors:[`No config found at ${Z.configPath}`],entries:[]};let se=lp(oe.config.rules,L);if(!se.ok)return se.result;let fe=G.deleteSource?Wb(Z.configDir,se.specs,Z.filesystemScope):{ok:!0,dirs:[]};if(!fe.ok)return fe.result;let ge=r(Z.configTarget);if(ge===null)return Pr(Error("Rules config is unavailable."));try{bn(Z.configTarget,{...oe.config,rules:oe.config.rules.filter((Re)=>!se.specs.includes(Re))},void 0,Y._testAfterPolicyRename)}catch(Re){throw Sr(Z.configTarget,ge),Re}let Pe=await Do(_,G,Mn(),Y);if(!Pe.ok)return Sr(Z.configTarget,ge),Pe;let Ee=zb(fe.dirs,Y,Z.filesystemScope);if(!Ee.ok){Sr(Z.configTarget,ge);let Re=await Do(_,G,Mn(),Y);if(!Re.ok)return{ok:!1,errors:[...Ee.result.errors,...Re.errors],entries:Re.entries};return Ee.result}return Pe}function Wb(_,L,G){let Y=L.flatMap((fe)=>p.test(fe)?[]:["--delete-source can only delete local rulebook sources"]),Z=L.map((fe)=>Ns(_,fe)),oe=Y.length>0?[]:Z.flatMap((fe)=>mp(fe,G)),se=[...Y,...oe];return se.length>0?{ok:!1,result:{ok:!1,errors:se,entries:[]}}:{ok:!0,dirs:Z}}function mp(_,L){let G=Db(_),Y=i(L,G),Z=he(Y);if(!Z)return[`Local rulebook source directory not found: ${_}`];let oe=Z.find((se)=>se.name==="rulebook.json");if(!oe)return[`Local rulebook source directory is missing rulebook.json: ${_}`];if(oe.kind!=="file")throw new o(L.label);if(r(i(L,Ns(G,"rulebook.json"))),Z.length>1)return[`Local rulebook source directory contains extra files: ${_}. delete manually if you really want to remove the directory.`];return[]}function zb(_,L,G){let Y=_.flatMap((Z)=>{try{if(!he(i(G,Z)))return[];let oe=mp(Z,G);if(oe.length>0)return oe;return Yb(Z,L,G),[]}catch(oe){return[`Failed to delete local rulebook source ${Z}: ${oe instanceof Error?oe.message:String(oe)}`]}});return Y.length>0?{ok:!1,result:{ok:!1,errors:Y,entries:[]}}:{ok:!0}}function Yb(_,L,G){if(L._testDeleteLocalSourceDir){L._testDeleteLocalSourceDir(_);return}B(i(G,Ns(_,ye))),Ct(i(G,_))}function Sr(_,L){if(L===null){B(_);return}g(_,L)}function Pr(_){return{ok:!1,errors:[_ instanceof Error?_.message:String(_)],entries:[]}}var Zb=".safety-net.json",Xb="~/.cc-safety-net/config.json";async function vp(_,L){let G=O(_,{cwd:L.cwd});if(G)console.log(`Skipped the project scope: ${I(L.cwd)} is the user rule config, not a project rule config`);return[G||await yp(_,{legacyPath:Lt(L.cwd),configPath:I(L.cwd),defaultRulebookName:"project-rules",migratedFrom:Zb,cleanup:L.cleanup,syncOptions:{cwd:L.cwd}}),await yp(_,{legacyPath:jt(_),configPath:z(_),defaultRulebookName:"user-rules",migratedFrom:Xb,cleanup:L.cleanup,syncOptions:{cwd:L.cwd,global:!0}})].every((Z)=>Z)?0:1}async function yp(_,L){let G=hn(_,L.syncOptions),Y=i(G.filesystemScope,L.legacyPath),Z=r(Y);if(Z===null)return console.log(`No legacy config found at ${L.legacyPath}`),!0;let oe=ew(Z);if(!oe.ok){for(let _e of oe.errors)console.error(_e);return!1}let se=d(G.configTarget);if(se.errors.length>0){for(let _e of se.errors)console.error(_e);return!1}let fe=se.config??le,ge=nw(gp(L.configPath),fe.rules,L.defaultRulebookName,L.migratedFrom,G.filesystemScope),Pe=Lo(gp(L.configPath),ge,"rulebook.json"),Ee=i(G.filesystemScope,Pe),Re=[hp(G.configTarget),hp(Ee)],Le=await Qb(_,L,G.configTarget,Ee,ge,oe.config.rules,{...fe,rules:fe.rules.includes(ge)?fe.rules:[...fe.rules,ge]});if(!Le.ok){ow(Re);for(let _e of Le.errors)console.error(_e);return!1}if(!L.cleanup)return console.log(`Migrated legacy config at ${L.legacyPath}. Legacy file is no longer used.`),!0;if(!rw(G.configTarget,Ee,ge,L.migratedFrom,oe.config.rules))return console.error(`Migration cleanup verification failed for ${L.legacyPath}`),!1;return B(Y),console.log(`Deleted legacy config at ${L.legacyPath}`),!0}async function Qb(_,L,G,Y,Z,oe,se){try{return bn(G,se),bn(Y,tw(Z,L.migratedFrom,oe)),await No(_,L.syncOptions)}catch(fe){return{ok:!1,errors:[fe instanceof Error?fe.message:String(fe)]}}}function ew(_){try{let L=JSON.parse(_),G=Wo(L);if(G.errors.length>0)return{ok:!1,errors:G.errors};return{ok:!0,config:{version:1,rules:L.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function nw(_,L,G,Y,Z){let oe=L.find((se)=>iw(i(Z,Lo(_,se,"rulebook.json")))===Y);if(oe)return oe;if(r(i(Z,Lo(_,G,"rulebook.json")))===null)return G;for(let se=2;;se++){let fe=`${G}-${se}`;if(r(i(Z,Lo(_,fe,"rulebook.json")))===null)return fe}}function tw(_,L,G){return{rulebook_version:1,name:_,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:L,allowed_commands:[...new Set(G.map((Y)=>Y.command))],rules:G,tests:G.map((Y)=>({command:[Y.command,Y.subcommand,Y.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:Y.name}))}}function rw(_,L,G,Y,Z){if(!d(_).config?.rules.includes(G))return!1;try{let se=r(L);if(se===null)return!1;let fe=JSON.parse(se);return fe.migrated_from===Y&&JSON.stringify(fe.rules)===JSON.stringify(Z)}catch{return!1}}function hp(_){return{target:_,content:r(_)}}function ow(_){for(let L of _){if(L.content===null){B(L.target);continue}g(L.target,L.content)}}function iw(_){let L=r(_);if(L===null)return null;try{let G=JSON.parse(L);return typeof G.migrated_from==="string"?G.migrated_from:null}catch{return null}}import{mkdir as sw,readFile as aw,writeFile as lw}from"node:fs/promises";import{dirname as cw,join as dw}from"node:path";var uw=86400000,pw=604800000;async function wp(_,L=Date.now()){if(_.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let G=tt(_);if(!G)return null;let Y=dw(G,".cc-safety-net","update-check.json"),Z=await fw(Y,L);if(!Z.lastCheck||L-Z.lastCheck>uw){let fe=await Gn();if(Z.lastCheck=L,fe.latestVersion)Z.latestVersion=fe.latestVersion;if(!await bp(Y,Z))return null;if(fe.error)return null}let oe=Z.latestVersion,se=pn();if(!oe||!ei(oe,se))return null;if(Z.notifiedVersion===oe&&Z.notifiedAt!==void 0&&L-Z.notifiedAt<pw)return null;if(Z.notifiedVersion=oe,Z.notifiedAt=L,!await bp(Y,Z))return null;return`UPDATE_AVAILABLE: cc-safety-net v${oe} is available (running v${se}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function fw(_,L){let G=await aw(_,"utf8").then((oe)=>JSON.parse(oe)).catch(()=>{return});if(!G||typeof G!=="object"||Array.isArray(G))return{};let Y=G,Z=(oe)=>typeof oe==="number"&&Number.isFinite(oe)&&oe<=L?oe:void 0;return{lastCheck:Z(Y.lastCheck),latestVersion:typeof Y.latestVersion==="string"?Y.latestVersion:void 0,notifiedVersion:typeof Y.notifiedVersion==="string"?Y.notifiedVersion:void 0,notifiedAt:Z(Y.notifiedAt)}}async function bp(_,L){return sw(cw(_),{recursive:!0,mode:448}).then(()=>lw(_,JSON.stringify(L),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as vw,resolve as Hs}from"node:path";var kp=new Map([["Bash","posix"],["PowerShell","powershell"],["Monitor","posix"]]);var Cp=new Map([["Bash","auto"]]);var xp=new Map([["bash","auto"],["Bash","auto"],["powershell","powershell"],["PowerShell","powershell"]]);var Sp=new Map([["Shell","auto"]]);var Pp=new Map([["exec","auto"]]),Ep="write_to_process";var Rp=new Map([["Execute","auto"]]);var _p=new Map([["run_shell_command","auto"]]);var Tp=new Map([["run_terminal_command","auto"],["run_terminal_cmd","auto"],["monitor","auto"],["bash","auto"],["Shell","auto"]]);var Ip=new Map([["terminal","posix"]]);var Ap=new Map([["Bash","posix"]]);var Op="exec";var yw=[["antigravity-cli",[...tl.keys(),rl]],["claude-code",[...kp.keys()]],["codex",[...Cp.keys()]],["copilot-cli",[...xp.keys()]],["cursor",[...Sp.keys()]],["deepseek-harness",[...et.keys()]],["devin",[...Pp.keys(),Ep]],["droid",[...Rp.keys()]],["gemini-cli",[..._p.keys()]],["grok-build",[...Tp.keys()]],["hermes-agent",[...Ip.keys()]],["kimi-code",[...Ap.keys()]],["openclaw",[Op]],["opencode",[Ye,ke]],["pi",[...Qe.keys()]]].flatMap(([_,L])=>L.map((G)=>({name:G,integration:cn(_)}))),$p="and is already analyzed. Built-in tools cannot be declared.";function jo(_){let L=Ie(_),G=[...new Set(yw.filter((Y)=>Ie(Y.name)===L).map((Y)=>Y.integration))].sort((Y,Z)=>Y.localeCompare(Z));if(G.length>0)return`"${_}" is a built-in shell tool of ${hw(G)}, ${$p}`;if(x(_)!=="unknown")return`"${_}" is a built-in file tool, ${$p}`;return}function hw(_){return _.length===1?_[0]??"":`${_.slice(0,-1).join(", ")} and ${_.at(-1)}`}var Np="CC Safety Net Config",bw="═".repeat(Np.length),ww="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",kw=new Set(["rule.json","rule.lock","cache"]);function Lp(_,L={}){try{return Cw(_,L)}catch(G){if(G instanceof o)return console.error(G.message),1;throw G}}function Cw(_,L){let G=L.cwd??process.cwd(),Y=Q(_,{cwd:G}),Z=jt(_),oe=Lt(G),se=Hs(G,be),fe=i(Y.userScope,Z),ge=i(Y.projectScope,oe),Pe=!1,Ee=!1,Re=[],Le=[],_e=xw(i(Y.projectScope,se));if(Pw(),r(Y.userConfigTarget)!==null){let Te=Un(Y.userConfigTarget);if(Te.errors.push(...V(Y.userConfigPath,Y.userScope),...Dp(Y.userConfigTarget)),Re.push({scope:"User",path:Y.userConfigPath,result:Te,schema:"rules",target:Y.userConfigTarget}),Te.errors.length>0)Pe=!0}if(r(fe)!==null)if(Ee=!0,r(Y.userConfigTarget)!==null)Le.push(Ho("user","cleanup"));else{let Te=zo(fe);if(Re.push({scope:"User",path:Z,result:Te,schema:"legacy",inactive:!0,target:fe}),Le.push(Ho("user",Te.errors.length>0?"fix-or-delete":"migrate")),Te.errors.length>0)Pe=!0}if(r(Y.projectConfigTarget)!==null){let Te=Un(Y.projectConfigTarget);if(Te.errors.push(...V(Y.projectConfigPath,Y.projectScope),...Dp(Y.projectConfigTarget)),Re.push({scope:"Project",path:Hs(Y.projectConfigPath),result:Te,schema:"rules",target:Y.projectConfigTarget}),Te.errors.length>0)Pe=!0;if(r(ge)!==null)Ee=!0,Le.push(Ho("project","cleanup"))}else if(r(ge)!==null){Ee=!0,Pe=!0;let Te=zo(ge);Re.push({scope:"Project",path:Hs(oe),result:Te,schema:"legacy",inactive:!0,target:ge}),Le.push(Ho("project",Te.errors.length>0?"fix-or-delete":"migrate"))}if(_e?.result.errors.length)Pe=!0;if(Re.length===0&&!_e)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Te of Re)if(Te.inactive)Rw(Te.scope,Te.path,Te.result);else if(Te.result.errors.length>0)_w(Te.scope,Te.path,Te.result.errors);else{if(Te.schema==="rules"&&Aw(Te.target))console.log(`
Added $schema to ${Te.scope.toLowerCase()} config.`);Ew(Te.scope,Te.path,Te.result,Te.schema)}for(let Te of Le)console.error(`
${en.red(Te)}`);if(_e)if(_e.result.errors.length>0)Iw(_e.path,_e.result.errors);else Tw(_e.path,_e.result);if(Pe)return console.error(`
Config validation failed.`),1;return console.log(Ee?`
Configs valid with warnings.`:`
All configs valid.`),0}function Dp(_){return(d(_).config?.command_tools??[]).flatMap((L)=>jo(typeof L==="string"?L:L.name)??[])}function Ho(_,L){let G=`legacy ${_} config`;if(L==="cleanup")return`Warning: Legacy ${_} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(L==="migrate")return`Warning: Legacy ${_} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${_} config is no longer supported. Fix or delete the ${G}, then run \`npx -y cc-safety-net rule migrate\`.`}function xw(_){if(he(_)===null)return null;let L=Sw(_);if(L.ruleNames.size===0&&L.errors.length===0)return null;return{path:_.path,result:L}}function Sw(_){let L=[],G=new Set,Y=(he(_)??[]).filter((Z)=>!kw.has(Z.name)).sort((Z,oe)=>Z.name.localeCompare(oe.name));if(Y.length===0)return{errors:L,ruleNames:G};for(let Z of Y){if(!p.test(Z.name)){L.push(`rulebook directory names must match ${p}: ${Z.name}`);continue}if(Z.kind!=="directory"){L.push(`${Z.name} must be a rulebook directory`);continue}let oe=i(_.scope,vw(_.path,Z.name,"rulebook.json")),se=r(oe);if(se===null){L.push(`${Z.name}/rulebook.json is required`);continue}try{let fe;try{fe=JSON.parse(se)}catch{L.push(`${Z.name}/rulebook.json: invalid JSON`);continue}let ge=de(fe);if(ge.name!==Z.name){L.push(`rulebook name "${ge.name}" must match folder "${Z.name}"`);continue}let Pe=To(ge);if(Pe.length>0){L.push(...Pe.map((Ee)=>`${Z.name}/rulebook.json: ${Ee}`));continue}G.add(Z.name)}catch(fe){L.push(fe instanceof Error?`${Z.name}/rulebook.json: ${fe.message}`:`${Z.name}/rulebook.json: ${String(fe)}`)}}return{errors:L,ruleNames:G}}function Pw(){console.log(Np),console.log(bw)}function Ew(_,L,G,Y){if(console.log(`
✓ ${_} config: ${L}`),console.log(`  Schema: ${Y==="rules"?"rulebook sources":"legacy inline rules"}`),G.ruleNames.size>0){console.log(`  ${Y==="rules"?"Sources":"Rules"}:`);let Z=1;for(let oe of G.ruleNames)console.log(`    ${Z}. ${oe}`),Z++}else console.log(`  ${Y==="rules"?"Sources":"Rules"}: (none)`)}function Rw(_,L,G){if(console.error(`
✗ Legacy ${_.toLowerCase()} config: ${L}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),G.errors.length>0){console.error("  Errors:");let Y=1;for(let Z of G.errors)for(let oe of Z.split("; "))console.error(`    ${Y}. ${oe}`),Y++;return}if(G.ruleNames.size>0){console.error("  Rules:");let Y=1;for(let Z of G.ruleNames)console.error(`    ${Y}. ${Z}`),Y++;return}console.error("  Rules: (none)")}function _w(_,L,G){jp(`${_} config`,L,G)}function Tw(_,L){console.log(`
✓ GitHub source rules: ${_}`),console.log("  Rulebooks:");let G=1;for(let Y of L.ruleNames)console.log(`    ${G}. ${Y}`),G++}function Iw(_,L){jp("GitHub source rules",_,L)}function jp(_,L,G){console.error(`
✗ ${_}: ${L}`),console.error("  Errors:");let Y=1;for(let Z of G)for(let oe of Z.split("; "))console.error(`    ${Y}. ${oe}`),Y++}function Aw(_){try{let L=r(_);if(L===null)return!1;let G=JSON.parse(L);if(G.$schema)return!1;return g(_,JSON.stringify({$schema:ww,...G},null,2)),!0}catch(L){if(L instanceof o)throw L;return!1}}var Hp=new Set(["init","add","remove","update","sync","list","wrapper","tool","migrate","doc","verify"]),$w=new Set(["init","add","remove","update","sync","wrapper"]),Mp=new Set(["add","remove","list"]),Dw="cc-safety-net/rulebooks";async function Up(_,L){try{return await Nw(_,L)}catch(G){if(G instanceof o)return console.error(G.message),1;throw G}}async function Nw(_,L){let G=jw(L),Y=G.help?Lw(G.positionals):null;if(Y)return zt(Y),0;if(G.errors.length>0){for(let Pe of G.errors)console.error(Pe);return 1}let Z=G.positionals[0];if(!Z)return zt(Nt,console.error),1;let oe=G.positionals[1],se={global:G.global},fe=process.cwd();if((Z==="tool"?G.project:!G.global&&$w.has(Z)&&!(Z==="wrapper"&&oe==="list"))&&O(_,{cwd:fe}))return console.error(`${I(fe)} is the user rule config, not a project rule config; ${Z==="tool"?"drop --project":"use --global"} for the user scope, or run from a project directory`),1;if(Z==="init"){let Pe=hn(_,se);Mw(Pe.configTarget);let Ee=Ow(Pe.configDir,"example-rules","rulebook.json"),Re=i(Pe.filesystemScope,Ee);if(G.example&&r(Re)===null)Wu(Re);let Le=V(Pe.configPath,Pe.filesystemScope);for(let _e of Le)console.error(_e);if(Le.length>0)return 1;return console.log("Rule config initialized."),0}if(Z==="add"){let Pe=Gp(G);if(!Pe)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let Ee=hn(_,se),Re=await pp(_,Pe,{...se,ref:G.ref,rulebooks:G.only.length>0?G.only:void 0});return Gu(Re,Pe,`Scope: ${G.global?"user":"project"} (${Ee.configDir})`),Re.ok?0:1}if(Z==="remove"){if(!oe)return console.error("rule remove requires a source"),1;let Pe=await fp(_,oe,{...se,deleteSource:G.deleteSource});return _o(Pe,`Removed rulebook source: ${oe}`),Pe.ok?0:1}if(Z==="update"){let Pe=await No(_,{...se,only:oe,refresh:!0});return _o(Pe,"Rule config updated."),Pe.ok?0:1}if(Z==="sync")return Wa(_,{global:G.global});if(Z==="list"){let Pe=ee(_,{cwd:fe});return qu(Pe),Pe.errors.length>0?1:0}if(Z==="wrapper")return Uw(_,G);if(Z==="tool")return Bw(_,G,fe);if(Z==="migrate")return vp(_,{cleanup:G.cleanup,cwd:fe});if(Z==="doc"){console.log(Mu);let Pe=await wp(_);if(Pe)console.error(Pe);return 0}if(Z==="verify")return Lp(_);return 1}function Lw(_){if(_.length===0)return Nt;let L=Nt.subcommands.filter((Y)=>Y.usage.split(" ")[0]===_[0]);if(L.length===0)return null;if(_.length===1&&L.length>1)return{name:`rule ${_[0]}`,description:`Subcommands of rule ${_[0]}`,usage:`rule ${_[0]} <subcommand>`,subcommands:L,options:[]};let G=_.length===1?L[0]:L.find((Y)=>Y.usage.split(" ")[1]===_[1]);if(!G)return null;return{name:`rule ${_[0]}`,description:G.description,usage:`rule ${G.usage}`,options:_[0]==="add"?Vo:[],examples:_[0]==="add"?Ko:void 0}}function jw(_){let L=mn({label:"rule",booleans:{global:["-g","--global"],project:["--project"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"],cwdArg:["--cwd-arg"]},lists:{only:["--only"]},positionals:"list"},_),G={...L.flags,ref:L.values.ref,cwdArg:L.values.cwdArg,only:L.lists.only??[],help:L.help,positionals:L.positionals,errors:L.errors};return Hw(G),G}function Hw(_){let[L]=_.positionals;if(L&&!Hp.has(L))_.errors.push(`Unknown rule subcommand: ${L}`);if(_.deleteSource&&L!=="remove")if(L&&Hp.has(L))_.errors.push(`Unknown option for rule ${L}: --delete-source`);else _.errors.push("--delete-source is only valid with 'rule remove'");if(_.cleanup&&L!=="migrate")_.errors.push(zn(L,"--cleanup"));if(_.example&&L!=="init")_.errors.push(zn(L,"--example"));if(_.ref&&L!=="add")_.errors.push(zn(L,"--ref"));if(_.only.length>0&&L!=="add")_.errors.push(zn(L,"--only"));let G=L==="tool"?_.positionals[1]:void 0,Y=G&&Mp.has(G)?`tool ${G}`:L;if(_.project&&G!=="add"&&G!=="remove")_.errors.push(zn(Y,"--project"));if(_.cwdArg!==void 0&&G!=="add")_.errors.push(zn(Y,"--cwd-arg"));if(L==="tool"&&_.global)_.errors.push(zn(L,"--global"));if(L==="add")Fw(_);if(L==="migrate"){if(_.global)_.errors.push(zn(L,"--global"));if(_.positionals.length>1)_.errors.push(`Unexpected rule migrate argument: ${_.positionals[1]}`)}else if(L==="wrapper")Fp(_,"a command");else if(L==="tool")Fp(_,"a tool name");else if(_.positionals.length>2)_.errors.push(`Unexpected rule argument: ${_.positionals[2]}`);if(L==="list"&&_.global)_.errors.push("Unknown option for rule list: --global")}function Gp(_){if(_.positionals[1])return _.positionals[1];if(_.ref||_.only.length>0)return Dw;return}function Fw(_){let L=Gp(_);if(!L)return;if((_.ref||_.only.length>0)&&!X(L)){if(_.ref)_.errors.push(`--ref can only select a ref for an owner/repo source: ${L}`);if(_.only.length>0)_.errors.push("--only can only select rulebooks from an owner/repo source");return}if(_.ref&&!ce(_.ref))_.errors.push(`--ref must use valid path segments: ${_.ref}`);let G=_.only.filter((Y)=>!p.test(Y));if(G.length>0)_.errors.push(`Invalid rulebook names: ${G.join(", ")}`)}function zn(_,L){return _?`Unknown option for rule ${_}: ${L}`:`Unknown option for rule: ${L}`}function Fp(_,L){let G=_.positionals[0],Y=_.positionals[1],Z=_.positionals[2];if(!Y){_.errors.push(`rule ${G} requires add, remove, or list`);return}if(!Mp.has(Y)){_.errors.push(`Unknown rule ${G} action: ${Y}`);return}if(Y==="list"){if(Z)_.errors.push(`Unexpected rule ${G} argument: ${Z}`);return}if(!Z){_.errors.push(`rule ${G} ${Y} requires ${L}`);return}if(G!=="tool"&&_.positionals.length>3)_.errors.push(`Unexpected rule ${G} argument: ${_.positionals[3]}`)}function Mw(_){if(r(_)===null){Ju(_);return}let L=d(_);if(!L.config)return;bn(_,L.config)}async function Uw(_,L){let G=L.positionals[1],Y=L.positionals[2],Z=hn(_,{global:L.global}).configTarget;if(G==="list"){let ge=d(Z);if(ge.errors.length>0){for(let Pe of ge.errors)console.error(Pe);return 1}return Gw(ge.config?.transparent_wrappers??[]),0}if(!Y||!E.test(Y))return console.error("transparent wrapper must match command pattern"),1;if($e(Y))return console.error(`reserved command "${Y}" cannot be a wrapper`),1;let oe=d(Z);if(oe.errors.length>0){for(let ge of oe.errors)console.error(ge);return 1}let se=oe.config??le,fe=G==="add"?[...new Set([...se.transparent_wrappers??[],Y])]:(se.transparent_wrappers??[]).filter((ge)=>ge!==Y);return bn(Z,{...se,transparent_wrappers:fe}),console.log(G==="add"?`Added transparent wrapper: ${Y}`:`Removed transparent wrapper: ${Y}`),0}function Gw(_){if(_.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${_.length}):`);for(let L of _)console.log(`  - ${L}`)}function Bw(_,L,G){let Y=L.positionals[1],Z=[...new Set(L.positionals.slice(2))];if(Y==="list")return qw(_,G);let oe=[...Z.flatMap((Pe)=>{if(!je.test(Pe))return[`"${Pe}" is not a tool name: ${Se}.`];let Ee=Y==="add"?jo(Pe):void 0;return Ee?[Ee]:[]}),...L.cwdArg!==void 0&&!je.test(L.cwdArg)?[`"${L.cwdArg}" is not an argument name: ${Se}.`]:[]];if(oe.length>0){for(let Pe of oe)console.error(en.red(`Error: ${Pe}`));return 1}let se=hn(_,{global:!L.project}),fe=xr(se.configTarget);if(!fe.ok){for(let Pe of fe.result.errors)console.error(Pe);return 1}let ge=Z.reduce((Pe,Ee)=>{let Re=L.cwdArg===void 0?Ee:{name:Ee,cwd:L.cwdArg},Le=(_e)=>(typeof _e==="string"?_e:_e.name)===Ee;if(Y==="remove")return Pe.filter((_e)=>!Le(_e));return Pe.some(Le)?Pe.map((_e)=>Le(_e)?Re:_e):[...Pe,Re]},fe.config.command_tools??[]);bn(se.configTarget,{...fe.config,command_tools:ge});for(let Pe of Z)console.log(Y==="add"?`Added command tool: ${Pe}${L.cwdArg===void 0?"":` (cwd argument: ${L.cwdArg})`}`:`Removed command tool: ${Pe}`);return console.log(`Scope: ${L.project?"project":"user"} (${se.configPath})`),0}function qw(_,L){let G=(O(_,{cwd:L})?["user"]:["user","project"]).map((Z)=>{let oe=hn(_,{global:Z==="user"});return{scope:Z,path:oe.configPath,...d(oe.configTarget)}}),Y=G.flatMap((Z)=>Z.errors.map((oe)=>`${Z.path}: ${oe}`));if(Y.length>0){for(let Z of Y)console.error(Z);return 1}return Vu(G.flatMap((Z)=>(Z.config?.command_tools??[]).map((oe)=>({scope:Z.scope,tool:oe})))),0}import{sep as Yw}from"node:path";import{existsSync as Vw,readFileSync as Kw}from"node:fs";import{join as Jw}from"node:path";async function Ww(_){if(_.isTTY)return null;return(await st(_).catch(()=>null))?.trim()||null}function zw(_){let L=_.env.get("CLAUDE_SETTINGS_PATH");if(L)return L;return Jw(Vr(_),"settings.json")}function Fs(_){let L=zw(_);if(!Vw(L))return!1;try{let G=Kw(L,"utf-8"),Y=JSON.parse(G);if(!Y.enabledPlugins)return!1;let Z="cc-safety-net@cc-marketplace";if(!(Z in Y.enabledPlugins))return!1;return Y.enabledPlugins[Z]===!0}catch(G){if(S(n.debug,_.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${L}: ${G instanceof Error?G.message:String(G)}`);return!1}}async function Ms(_,L=process.stdin){let G=Fs(_),Y;if(!G)Y="\uD83D\uDEE1️ CC Safety Net ❌";else{let oe=R(_,{cwd:process.cwd()}),se=oe.policy,fe=P(se,_.env),ge=Object.values(K(se,fe.capabilities)).some((Re)=>Re.changesInherited),Pe={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[ge?"custom":fe.effectiveLevel],Ee=oe.policyScopes&&!oe.policyScopes.weakeningsIgnored&&oe.policyScopes.weakenings.length>0?"\uD83D\uDD3B":"";Y=`\uD83D\uDEE1️ CC Safety Net ${Pe}${fe.worktreeMode?"\uD83C\uDF33":""}${Ee}${oe.state==="degraded"?"⚠️":""}`}let Z=await Ww(L);if(Z&&!Z.startsWith("{"))console.log(`${Z} | ${Y}`);else console.log(Y)}function Bp(_){let L=R(_,{cwd:process.cwd()}),G=L.policy,Y=P(G,_.env),Z=!!process.env.NO_COLOR||!process.stdout.isTTY,oe=Math.min(process.stdout.columns||80,100),se=Z?"ok":"✔",fe=Z?"OFF":"✘",ge=(Be,Fe)=>{let Ze=`  ${Be.padEnd(13)}${Fe}`;return(Ze.length>oe?`${Ze.slice(0,oe-1)}…`:Ze).replaceAll(fe,en.red(fe))},Pe=Object.values(K(G,Y.capabilities)).some((Be)=>Be.changesInherited),Ee=(Be)=>Be===_.home||Be.startsWith(`${_.home}${Yw}`)?`~${Be.slice(_.home.length)}`:Be,Re={ready:en.green,degraded:en.yellow}[L.state],Le=L.policyScopes?.weakenings??[],_e=[...Fs(_)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...L.diagnostics],Te=Z?"-":"·";console.log([`${Z?"":"\uD83D\uDEE1️  "}CC Safety Net — ${Re(L.state)}`,"",ge("Protection",`destructive ${G.destructiveCommandProtectionEnabled?se:fe}   secrets ${G.secretProtection.enabled?se:fe}`),ge("Level",Pe?`${Y.effectiveLevel} (customised)`:Y.effectiveLevel),ge("Rules",G.rules.length===0?"none active":`${G.rules.length} active`),ge("Policy",Ee(u(_))),...L.policyScopes?[ge("Project",Ee(h(process.cwd())))]:[],...Y.worktreeMode?[ge("Worktree","relaxations active")]:[],"",...Le.length===0?[]:[L.policyScopes?.weakeningsIgnored?"  Project policy (ignored)":"  Project policy",...Le.flatMap((Be)=>fr(Be,"      ",oe-6).map((Fe,Ze)=>Ze===0?`    ${Fe}`:Fe)),""],..._e.length===0?["  Everything configured is active."]:["  Not active",..._e.flatMap((Be)=>fr(Be,"      ",oe-6).map((Fe,Ze)=>Ze===0?`    ${Te} ${Fe}`:Fe)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as ef}from"node:child_process";import{randomBytes as sk}from"node:crypto";import{existsSync as ak}from"node:fs";import{createServer as lk}from"node:http";import{Writable as ck}from"node:stream";var Fo=500;function Zw(_){let L=_.filter((Z)=>Z.decision!=="allow"),G=_.filter((Z)=>Z.decision==="allow"),Y=Math.min(L.length,Math.max(Fo-G.length,Math.ceil(Fo/2)));return[...L.slice(0,Y),...G.slice(0,Fo-Y)]}function qp(_,L,G=H(_)){if(G)J(_,G);let Y=(Fe)=>new Date(Fe.getFullYear(),Fe.getMonth(),Fe.getDate()).getTime(),Z=Y(new Date),oe=new Date(Z);oe.setDate(oe.getDate()-(L-1));let se=oe.getTime(),fe=[],ge={count:0};for(let Fe of G?Yn(G,ge):[])for(let Ze of Dt(Fe,ge)){let tn=new Date(Ze.ts).getTime();if(!Number.isFinite(tn))continue;if(tn>=se)fe.push(Ze)}fe.sort((Fe,Ze)=>new Date(Ze.ts).getTime()-new Date(Fe.ts).getTime());let Pe=Array.from({length:L},()=>0),Ee=Array.from({length:L},()=>0),Re={},Le={},_e={},Te=0,Be=0;for(let Fe of fe){let Ze=Fe.agent||"unknown";Re[Ze]=(Re[Ze]??0)+1;let tn=Math.round((Z-Y(new Date(Fe.ts)))/86400000),on=L-1-tn,an=tn>=0&&tn<L;if(an)Ee[on]=(Ee[on]??0)+1;if(Fe.decision!=="allow"){if(Te++,Fe.ruleId)Le[Fe.ruleId]=(Le[Fe.ruleId]??0)+1;let nn=Go(Fe.segment||Fe.command);if(nn)_e[nn]=(_e[nn]??0)+1;if(Fe.failureStage)Be++;if(an)Pe[on]=(Pe[on]??0)+1}}return{days:L,logsDir:G,homeDir:_.home,totalInWindow:fe.length,truncated:fe.length>Fo,unreadable:ge.count,counts:{blocked:Te,allowed:fe.length-Te,agents:Re,blockedByDay:Pe,analyzedByDay:Ee,rules:Le,commands:_e,errors:Be},entries:Zw(fe).sort((Fe,Ze)=>new Date(Ze.ts).getTime()-new Date(Fe.ts).getTime())}}import{spawn as Xw}from"node:child_process";import{existsSync as Qw,statSync as Vp}from"node:fs";import{delimiter as ek,join as nk}from"node:path";var tk=120000,Mo="Choose the project folder",rk=`try
  return POSIX path of (choose folder with prompt "${Mo}")
on error number -128
  return ""
end try`,ok=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${Mo}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Kp=[{binary:"zenity",args:["--file-selection","--directory",`--title=${Mo}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",Mo]}],Jp=(_,L)=>(L.PATH??"").split(ek).some((G)=>{if(G.length===0)return!1;try{let Y=Vp(nk(G,_));return Y.isFile()&&(Y.mode&73)!==0}catch{return!1}});function Us(_,L){if(_==="darwin"||_==="win32")return!0;if(_!=="linux")return!1;if(!L.DISPLAY&&!L.WAYLAND_DISPLAY)return!1;return Kp.some((G)=>Jp(G.binary,L))}function ik(_,L){if(_==="darwin")return{cmd:"osascript",args:["-e",rk]};if(_==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",ok]};let G=Kp.find((Y)=>Jp(Y.binary,L));return G?{cmd:G.binary,args:G.args}:null}function Gs(_=process.platform,L=process.env){let G=ik(_,L);if(!G)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((Y)=>{let Z=Xw(G.cmd,G.args,{env:L,stdio:["ignore","pipe","pipe"]}),oe="",se=!1,fe=(Pe)=>{if(se)return;se=!0,clearTimeout(ge),Y(Pe)},ge=setTimeout(()=>{Z.kill(),fe({error:"The folder dialog timed out"})},tk);Z.stdout.on("data",(Pe)=>{oe+=Pe.toString()}),Z.on("error",()=>fe({error:`Could not open the folder dialog (${G.cmd})`})),Z.on("close",()=>{let Pe=oe.trim().replace(/\/+$/,"");if(!Pe)return fe({cancelled:!0});if(!Qw(Pe)||!Vp(Pe).isDirectory())return fe({error:"That selection is not a folder on disk"});fe({path:Pe})})})}var Wp=`<!doctype html>
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
    runtime: {
      flags: ["-ac", "--agy-cli"],
      description: "Run as Antigravity CLI PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      flag: "--agy-cli",
      artifactKind: "hook config",
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
`;var zp='<script id="ccsn-data" type="application/json">';function Yp(_,L=Wp){return L.replace(zp,()=>zp+JSON.stringify({token:_}).replaceAll("<","\\u003c"))}var qs="kenryu42/cc-safety-net",dk=`https://github.com/${qs}`,nf=1e4,uk=7,pk="The project draft directory changed; reload the draft before applying.",fk="audit settings are user scope only; remove the audit section from a project proposal";async function tf(_,L={}){let G=mn({label:"gui",booleans:{noOpen:["--no-open"]}},_),Y=L.log??console.log,Z=L.error??console.error;if(G.errors.length>0){for(let se of G.errors)Z(se);return Z("Usage: cc-safety-net gui [--no-open]"),1}let oe=await mk(c,L);if(Y(`CC Safety Net policy GUI: ${oe.url}`),!G.flags.noOpen)try{await(L.openBrowser??Pk)(oe.url)}catch(se){Z(`Failed to open browser: ${se instanceof Error?se.message:String(se)}`),Z(`Open this URL manually: ${oe.url}`)}if(L.keepAlive===!1)return await oe.close(),0;return await Sk(oe),0}async function mk(_,L={}){let G=sk(24).toString("base64url"),Y={dir:null,revision:0},Z=lk((fe,ge)=>{gk(_,fe,ge,G,L,Y)});await new Promise((fe,ge)=>{Z.once("error",ge),Z.listen(0,"127.0.0.1",()=>{Z.off("error",ge),fe()})});let se=`http://127.0.0.1:${Z.address().port}`;return{origin:se,token:G,url:`${se}/?token=${encodeURIComponent(G)}`,close:()=>xk(Z)}}async function gk(_,L,G,Y,Z,oe){let se=_(),fe=new URL(L.url??"/","http://127.0.0.1");if(L.method==="GET"&&fe.pathname==="/favicon.ico"){G.writeHead(204,{"cache-control":"no-store"}),G.end();return}if(!wk(L,fe,Y)){rn(G,403,{error:"Forbidden"});return}if(L.method==="GET"&&fe.pathname==="/"){await Promise.resolve(Z.buildDocument?.()).then((ge)=>Ck(G,Yp(Y,ge)),(ge)=>rn(G,500,{error:ge instanceof Error?ge.message:String(ge)}));return}if(L.method==="GET"&&fe.pathname==="/api/policy"){let ge=$u(se,Z),Pe=R(se,Bs(Z));rn(G,200,{...ge,configState:Ve(Pe),...Pe.policyScopes?{projectPolicy:{path:h(Z.cwd??process.cwd()),weakenings:Pe.policyScopes.weakeningsIgnored?[]:Pe.policyScopes.weakenings}}:{},destructiveCommandRules:q,secretPatterns:dt,version:pn(),preview:ge.errors.length>0?null:We(ge.policy,se.env)});return}if(L.method==="POST"&&fe.pathname==="/api/policy/preview"){let ge=await Er(L);if(!ge.ok){rn(G,ge.status,{errors:[ge.error]});return}let Pe=Du(se,ge.value);rn(G,Pe.errors.length>0?400:200,Pe);return}if(L.method==="POST"&&fe.pathname==="/api/policy/explain"){let ge=await Er(L);if(!ge.ok){rn(G,ge.status,{errors:[ge.error]});return}let Pe=ge.value;if(Pe===null||typeof Pe.command!=="string"){rn(G,400,{errors:["command must be a string"]});return}let Ee=kr(Pe.policy,se.home);if(Ee.length>0){rn(G,400,{errors:Ee});return}rn(G,200,vk(se,Pe.command,Pe.policy,Z));return}if(L.method==="POST"&&fe.pathname==="/api/policy"){let ge=await Er(L);if(!ge.ok){rn(G,ge.status,{errors:[ge.error]});return}let Pe=Fn(se,ge.value,Z);rn(G,Pe.errors.length>0?400:200,Pe);return}if(L.method==="POST"&&fe.pathname==="/api/reset"){rn(G,200,Fn(se,ne,Z));return}if(L.method==="POST"&&fe.pathname==="/api/repair"){rn(G,200,Nu(se,Z));return}if(L.method==="POST"&&fe.pathname==="/api/policy/project/choose-directory"){let ge=await(Z.chooseDirectory??Gs)();if("path"in ge)oe.dir=ge.path,oe.revision+=1;rn(G,200,{cancelled:"cancelled"in ge,..."error"in ge?{error:ge.error}:{}});return}if(L.method==="GET"&&fe.pathname==="/api/policy/project"){let ge=rf(oe,Z),Pe=of(se,ge,Z),Ee=Pe?{projection:{},diagnostics:[Pe]}:Zp(ge,se.home),Re=Cr(se,Z);rn(G,200,{path:h(ge),revision:oe.revision,baseline:Re.baseline,userPolicyDiagnostics:Re.diagnostics,projection:Ee.projection,projectionDiagnostics:Ee.diagnostics,canPickDirectory:Us(process.platform,process.env)});return}if(L.method==="POST"&&fe.pathname==="/api/policy/project/diff"){let ge=await Xp(se,L,G,oe,Z);if(!ge)return;let Pe=Zp(ge.dir,se.home),Ee=Cr(se,Z).baseline,Re=te(Ee,pe(ge.proposal,se.home).policy);rn(G,200,{rows:Eo(te(Ee,Pe.projection).policy,Re.policy,!1),weakenings:Re.weakenings,existingFileDiagnostics:Pe.diagnostics});return}if(L.method==="POST"&&fe.pathname==="/api/policy/project/apply"){let ge=await Xp(se,L,G,oe,Z);if(!ge)return;let Pe=hk(ge.dir,ge.proposal,se.home);rn(G,Pe.errors.length>0?500:200,Pe);return}if(L.method==="GET"&&fe.pathname==="/api/activity"){let ge=ie(se,Z),Pe=bk(fe.searchParams.get("days"),ge);if(Pe===null){rn(G,400,{error:`days must be an integer between 1 and ${ge}`});return}rn(G,200,qp(se,Pe,Z.activityLogsDir));return}if(L.method==="POST"&&fe.pathname==="/api/rules/choose-directory"){rn(G,200,await Gs());return}if(L.method==="GET"&&fe.pathname==="/api/rules"){let ge=ee(se,Bs(Z)),Pe=new Map(ge.rules.map((Ee)=>[Ee.name,Ee]));rn(G,200,{projectPath:Z.cwd??process.cwd(),canPickDirectory:Us(process.platform,process.env),rulebooks:ge.rulebooks.map((Ee)=>({source:Ee.source,spec:Ee.spec,name:Ee.name,version:Ee.version,rules:Ee.rules.flatMap((Re)=>{let Le=Pe.get(Re);if(!Le)return[];return[{name:Le.name,command:Le.command,subcommand:Le.subcommand,block_args:Le.block_args,reason:Le.reason}]})})),errors:ge.errors,warnings:ge.warnings});return}if(L.method==="GET"&&fe.pathname==="/api/star/context"){rn(G,200,await(Z.fetchStarContext??(()=>Ak(se,{logsDir:Z.activityLogsDir})))());return}if(L.method==="POST"&&fe.pathname==="/api/star"){let ge=await(Z.starRepo??Ek)();rn(G,200,ge.ok?{ok:!0}:{ok:!1,fallbackUrl:dk});return}if(L.method==="GET"&&fe.pathname==="/api/integrations"){rn(G,200,await(Z.fetchIntegrations??(()=>Rk(se)))());return}if(L.method==="GET"&&fe.pathname==="/api/health"){rn(G,200,await(Z.fetchHealth??Tk)());return}if(L.method==="POST"&&(fe.pathname==="/api/install"||fe.pathname==="/api/uninstall")){let ge=await Er(L);if(!ge.ok){rn(G,ge.status,{errors:[ge.error]});return}let Pe=ge.value?.target;if(typeof Pe!=="string"||!On.some((Re)=>Re.target===Pe)){rn(G,400,{error:"unknown target"});return}let Ee=fe.pathname==="/api/install"?"install":"uninstall";rn(G,200,await(Z.runIntegration??Ik)(Ee,Pe));return}rn(G,404,{error:"Not found"})}function Bs(_){return{..._,cwd:_.cwd??process.cwd()}}function rf(_,L){return _.dir??L.cwd??process.cwd()}function of(_,L,G){if(!O(_,{...G,cwd:L}))return null;return`${h(L)} is the user policy, not a project policy; choose a project directory, or run the GUI from one`}function Zp(_,L){let G=h(_),Y=ak(G)?$t(G):{value:void 0,errors:[]},Z=pe(Y.value,L);return{projection:Z.policy,diagnostics:[...Y.errors,...Z.diagnostics]}}async function Xp(_,L,G,Y,Z){let oe=rf(Y,Z),se=Y.revision,fe=await Er(L);if(!fe.ok)return rn(G,fe.status,{errors:[fe.error]}),null;let ge=fe.value;if(typeof ge?.revision!=="number")return rn(G,400,{errors:["revision must be a number"]}),null;if(ge.revision!==se)return rn(G,409,{errors:[pk]}),null;let Pe=of(_,oe,Z);if(Pe)return rn(G,400,{errors:[Pe]}),null;let Ee=yk(ge.proposal,_.home);if(Ee.length>0)return rn(G,400,{errors:Ee}),null;return{dir:oe,proposal:ge.proposal}}function yk(_,L){let G=kr(_,L);if(G.length>0)return G;return _?.audit===void 0?[]:[fk]}function hk(_,L,G){let Y=h(_),Z=Ro(L,k(L,G));try{return g(i(w(_,"project policy"),Y),`${JSON.stringify(Z,null,2)}
`),{path:Y,errors:[]}}catch(oe){return{path:Y,errors:[oe instanceof Error?oe.message:String(oe)]}}}function vk(_,L,G,Y){let Z=k(G,_.home),oe=R(_,Bs(Y)),se=Ne({rules:oe.policy.rules,transparentWrappers:oe.policy.transparentWrappers,commandTools:oe.policy.commandTools,safety:ze(Z.safety),worktreeMode:Z.workflow.worktree_mode,destructiveCommandProtectionEnabled:Z.destructive_command_protection.enabled,destructiveCommandRuleOverrides:Z.destructive_command_protection.overrides,destructiveCommandAllowPaths:Z.destructive_command_protection.allow_paths,secretProtection:{enabled:Z.secret_protection.enabled,disabledRules:mt(Z.secret_protection.overrides),denyPaths:Z.secret_protection.deny_paths,allowPaths:Z.secret_protection.allow_paths}});return mr(L,{policySnapshot:se,cwd:Y.cwd,userConfigDir:Y.userConfigDir},_)}function bk(_,L){if(_===null)return Math.min(uk,L);let G=Number(_);if(!Number.isInteger(G)||G<1||G>L)return null;return G}function wk(_,L,G){if(L.searchParams.get("token")!==G)return!1;if(_.method!=="POST")return!0;return _.headers["x-cc-safety-net-token"]===G}var kk=1048576;async function Er(_){let L=[],G=0;for await(let Y of _){let Z=Y;if(G+=Z.byteLength,G>kk)return{ok:!1,status:413,error:"Request body is too large"};L.push(Z)}try{return{ok:!0,value:JSON.parse(Buffer.concat(L).toString("utf-8")||"{}")}}catch(Y){return{ok:!1,status:400,error:`Invalid JSON: ${Y instanceof Error?Y.message:String(Y)}`}}}function Ck(_,L){_.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),_.end(L)}function rn(_,L,G){_.writeHead(L,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),_.end(JSON.stringify(G))}function xk(_){return new Promise((L,G)=>{_.close((Y)=>Y?G(Y):L())})}function Sk(_){return new Promise((L)=>{let G=()=>{process.off("SIGINT",Y),process.off("SIGTERM",Y)},Y=()=>{G(),_.close().then(L)};process.once("SIGINT",Y),process.once("SIGTERM",Y)})}function Pk(_){let L=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",G=process.platform==="win32"?["/c","start","",_]:[_];return new Promise((Y,Z)=>{let oe=ef(L,G,{detached:!0,stdio:"ignore"}),se=(ge)=>{oe.off("spawn",fe),Z(ge)},fe=()=>{oe.off("error",se),oe.unref(),Y()};oe.once("error",se),oe.once("spawn",fe)})}async function Ek(_="gh",L=nf){return{ok:await Ok(_,["api","-X","PUT",`/user/starred/${qs}`],L)===0}}async function Rk(_,L={}){let G=await Nr((Z)=>Jt({environment:_,cwd:process.cwd(),openCodeVersion:Z}).status!=="n/a",L.fetcher),Y=_k(_,G);return{targets:En.map((Z)=>{let oe=Y.find((se)=>se.platform===Z.id);return{target:Z.id,label:cn(Z.id),version:G.versions[Z.id]??null,status:oe?.configured?"active":oe?.detected?"disabled":oe?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:G.version,nodeVersion:G.nodeVersion,platform:G.platform}}}function _k(_,L){return Wt(_,process.cwd(),{ampPluginListOutput:L.ampPluginListOutput,codexPluginListOutput:L.codexPluginListOutput,copilotCliVersion:L.versions["copilot-cli"],openCodeVersion:L.versions.opencode,openCodePluginListOutput:L.openCodePluginListOutput})}async function Tk(_={}){let L=await(_.checkUpdates??Gn)();return{update:{latestVersion:L.latestVersion??null,updateAvailable:L.updateAvailable}}}var Qp=Promise.resolve();function Ik(_,L,G={}){let Y=async()=>{let oe=[],{log:se,error:fe}=console;console.log=(...ge)=>oe.push(ge.map(String).join(" ")),console.error=console.log;try{return{ok:await wr(_,[],{selectTargets:async()=>[L],output:new ck({write(Pe,Ee,Re){oe.push(String(Pe).replace(/\n$/,"")),Re()}}),...G})===0,output:oe.join(`
`)}}finally{console.log=se,console.error=fe}},Z=Qp.then(Y);return Qp=Z.then(()=>{return},()=>{return}),Z}async function Ak(_,L={}){let[G,Y]=await Promise.all([$k(L.fetchRepo),Promise.resolve(Ar(_,ie(_),L.logsDir).totalBlocked)]);return{starCount:G,blockedTotal:Y}}function Ok(_,L,G){return new Promise((Y)=>{let Z=ef(_,L,{stdio:"ignore",windowsHide:!0}),oe=!1,se=setTimeout(()=>{Z.kill(),fe(null)},G),fe=(ge)=>{if(oe)return;oe=!0,clearTimeout(se),Y(ge)};Z.once("error",()=>fe(null)),Z.once("close",fe)})}async function $k(_=fetch){try{let L=await _(`https://api.github.com/repos/${qs}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(nf)});if(!L.ok)return null;let G=await L.json();return typeof G.stargazers_count==="number"?G.stargazers_count:null}catch{return null}}function Dk(_){if(_[0]!=="help")return!1;let L=_[1];if(!L)ms(),process.exit(0);if(gr(L))process.exit(0);console.error(`Unknown command: ${L}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var Nk={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),gr("hook",console.error),process.exit(1)},install:async(_)=>{process.exit(await wr("install",_))},update:async(_)=>{process.exit(await Ts(_))},uninstall:async(_)=>{process.exit(await wr("uninstall",_))},rule:async(_)=>{process.exit(await Up(c(),_))},policy:async(_)=>{process.exit(await Fu(c(),_))},status:async(_)=>{if($n(mn({label:"status"},_).errors))process.exit(1);Bp(c())},statusline:async(_)=>{let L=mn({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},_);if(L.errors.length===0&&L.flags.claudeCode){await Ms(c());return}if($n(L.errors),!L.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");gr("statusline",console.error),process.exit(1)},doctor:async(_)=>{let L=is(_);if(!L)process.exit(1);let G=await Qc(c(),{json:L.json,skipUpdateCheck:L.skipUpdateCheck});process.exit(G)},logs:async(_)=>{process.exit(await Xs(c(),_))},gui:async(_)=>{process.exit(await tf(_))},explain:async(_)=>{process.exit(await dd(c(),_))}};async function Lk(_){let L=mn({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},_);if(Dk(_))return;let G=_[0],Y=G?Ir(G):void 0;if(L.help&&Y&&Y.name!=="rule")gr(Y.name),process.exit(0);if(!G||L.help&&!Y)ms(),process.exit(0);if(L.flags.version)fd(),process.exit(0);if(Y){await Nk[Y.name](_.slice(1));return}if(G==="--statusline"){await Ms(c());return}console.error(G.startsWith("-")?`Unknown option: ${G}`:`Unknown command: ${G}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{Lk as runCli};
