import{l,a,qe,dt,A,Pt,pt,c,r,ft,O,k,xe,At,i,R,s,de,o,v,Se,V,It,Ot,m,we,Ce,Dt,j,oe,pe,T,Nt,D,x,fe,K,p,L,ie,mt,gt,U,P,M,Ee,ke,Ke,me,f,e,Je,je,Ye,Re,ht,yt,ge,Ue,he,Ze,J,Y,Xe,Te,h,He,S,vt,d,Z,xt,X,se,ae,be,St,wt,_,N,Qe,Ct,tt,w,nt,Ge,_e,C,t,ce,Ae,E,H,y,F,Ft,rt,ot,g,G}from"./chunks/index-r4qtkv3b.js";import{ct}from"./chunks/index-t7cwf6fa.js";import{it,Oe}from"./chunks/index-n4n698nx.js";import{b,W,u,Be,n,De,lt,Rt,ze}from"./chunks/index-cvqq4j59.js";import"./chunks/index-skank3kk.js";import{ue,ee,ut,B,z}from"./chunks/index-ch7n7264.js";var vf=["-h","--help"];function fn(I,q){let Q=Object.entries(I.booleans??{}),ne=Object.entries(I.values??{}),te=Object.entries(I.lists??{}),re=Object.fromEntries(Q.map(([Le])=>[Le,!1])),le={},ye=Object.fromEntries(te.map(([Le])=>[Le,[]])),ve=[],Pe=[],Ie=!1,$e=-1;for(let[Le,Fe]of q.entries()){if(Le<=$e)continue;if(Fe==="--"){ve.push(...q.slice(Le+1));break}if(vf.includes(Fe)){Ie=!0;continue}let Ne=Q.find(([,tn])=>tn.includes(Fe));if(Ne){re[Ne[0]]=!0;continue}let Ve=ne.find(([,tn])=>tn.includes(Fe));if(Ve){let tn=q[Le+1];if(tn===void 0||tn.startsWith("-")){Pe.push(`${Fe} requires a value`);continue}le[Ve[0]]=tn,$e=Le+1;continue}let Me=te.find(([,tn])=>tn.includes(Fe));if(Me){let tn=q.slice(Le+1),en=tn.findIndex((ln)=>ln.startsWith("-")),on=tn.slice(0,en===-1?tn.length:en);if(on.length===0){Pe.push(`${Fe} requires at least one value`);continue}ye[Me[0]]=[...ye[Me[0]]??[],...on],$e=Le+on.length;continue}if(Fe.startsWith("-")){Pe.push(`Unknown option for ${I.label}: ${Fe}`);continue}if(I.positionals==="tail"){ve.push(...q.slice(Le));break}ve.push(Fe)}if(I.positionals!=="list"&&I.positionals!=="tail")Pe.push(...ve.map((Le)=>`Unexpected argument for ${I.label}: ${Le}`));return{flags:re,values:le,lists:ye,positionals:ve,help:Ie,errors:Pe}}function In(I){for(let q of I)console.error(q);return I.length>0}import{readdirSync as Sf,statSync as Qs,unlinkSync as Rf}from"node:fs";import{basename as ea,dirname as Ef,isAbsolute as Tf,join as Af,relative as _f,resolve as If,sep as Of}from"node:path";var Ys=(I)=>{let q=Date.now()-new Date(I).getTime();if(!Number.isFinite(q))return"";let Q=Math.floor(q/60000),ne=Math.floor(Q/60),te=Math.floor(ne/24);if(te>0)return`${te}d ago`;if(ne>0)return`${ne}h ago`;if(Q>0)return`${Q}m ago`;return"just now"},Jo=(I)=>{let q=(I??"").trim().split(/\s+/).filter((te)=>te&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(te)),Q=q[0]?.split("/").pop();if(!Q)return null;let ne=q[1];return ne&&/^[a-z][a-z0-9-]*$/.test(ne)?`${Q} ${ne}`:Q};function Zs(I){let q=(te)=>`${te.sessionId}
${Jo(te.segment||te.command)}`,Q=I.filter((te)=>te.decision!=="allow"),ne=Q.filter((te)=>te.sessionId).reduce((te,re)=>te.set(q(re),(te.get(q(re))??0)+1),new Map);return new Set(Q.filter((te)=>te.failureStage||(ne.get(q(te))??0)>=2))}import{existsSync as bf,readdirSync as wf,readFileSync as kf}from"node:fs";import{join as Cf}from"node:path";function Jn(I,q){try{return wf(I,{withFileTypes:!0,encoding:"utf8"}).flatMap((Q)=>{let ne=Cf(I,Q.name);if(Q.isDirectory())return Jn(ne,q);if(Q.name.endsWith(".jsonl"))return[ne];return[]})}catch{if(q&&bf(I))q.count++;return[]}}var xf=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function Pf(I){if(!I||typeof I!=="object"||Array.isArray(I))return!1;let q=I;if(typeof q.ts!=="string"||typeof q.command!=="string")return!1;return xf.every((Q)=>q[Q]===void 0||typeof q[Q]==="string")}function Ht(I,q){try{return kf(I,"utf-8").split(`
`).filter(Boolean).flatMap((Q)=>{try{let ne=JSON.parse(Q);if(!Pf(ne)){if(q)q.count++;return[]}return[ne]}catch{if(q)q.count++;return[]}})}catch{if(q)q.count++;return[]}}function mn(I){return Array.from(I,(q)=>{let Q=q.charCodeAt(0);if(Q<=31||Q>=127&&Q<=159)return`\\x${Q.toString(16).padStart(2,"0")}`;return q}).join("")}function $f(I,q){let Q=ue(I),ne=fn({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},q);if(In(ne.errors))return null;if(ne.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(ne.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let te=ne.values.limit===void 0?20:Xs(ne.values.limit);if(te===null)return console.error("--limit must be a positive number"),null;let re=ne.values.since===void 0?Math.min(30,Q):Xs(ne.values.since);if(re===null||re>Q)return console.error(`--since must be a positive number of days no greater than ${Q}`),null;let le={limit:te,limitExplicit:ne.values.limit!==void 0,since:re,sinceExplicit:ne.values.since!==void 0,all:ne.flags.all,json:ne.flags.json,suspect:ne.flags.suspect,pruneLegacy:ne.flags.pruneLegacy,dryRun:ne.flags.dryRun,id:ne.values.id,agent:ne.values.agent,rule:ne.values.rule,session:ne.values.session,project:ne.values.project===void 0?void 0:If(ne.values.project)};if(le.id&&(le.agent!==void 0||le.rule!==void 0||le.session!==void 0||le.project!==void 0||le.suspect||le.sinceExplicit||le.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(le.pruneLegacy&&(le.id!==void 0||le.agent!==void 0||le.rule!==void 0||le.session!==void 0||le.project!==void 0||le.suspect||le.all||le.sinceExplicit||le.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(le.dryRun&&!le.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return le}async function na(I,q,Q={}){let ne=$f(I,q);if(!ne)return 1;let te=Q.logsDir??B(I);if(ne.pruneLegacy)return Df(te,ne.json,ne.dryRun);if(!te)return console.log(ne.json?"[]":ne.id?`No retained audit log entry found for id ${mn(ne.id)}.`:"No audit log entries found."),0;ee(I,te);let re={count:0},le=Jn(te,re).flatMap(($e)=>Ht($e,re).map((Le)=>({entry:Le,file:$e})));if(re.count>0)console.error(`warning: ${re.count} audit log ${re.count===1?"source":"sources"} could not be read; these results are incomplete`);if(ne.id)return Ff(le,ne,Q.timeZone);let ye=Date.now()-ne.since*24*60*60*1000,ve=le.filter(($e)=>Hf($e,ne,te,ye)),Pe=ne.suspect?Zs(ve.map(($e)=>$e.entry)):null,Ie=(Pe?ve.filter(($e)=>Pe.has($e.entry)):ve).sort(($e,Le)=>Date.parse(Le.entry.ts)-Date.parse($e.entry.ts)).slice(0,ne.limit);if(ne.json)return console.log(JSON.stringify(Ie.map(($e)=>$e.entry),null,2)),0;if(Ie.length===0)return console.log("No audit log entries found."),0;for(let $e of Ie)console.log(Bf($e.entry,Q.timeZone));return 0}function Df(I,q,Q){let ne=I?Lf(I).map((ye)=>Af(I,ye)):[];if(Q)return Nf(ne,q);let te=[],re=0,le=0;for(let ye of ne){let ve=Qs(ye,{throwIfNoEntry:!1})?.size??0,Pe=jf(ye);if(Pe){te.push(`${ea(ye)}: ${Pe}`);continue}re++,le+=ve}if(q)return console.log(JSON.stringify({removedFiles:re,removedBytes:le,failedFiles:te.length})),te.length===0?0:1;console.log(re===0&&te.length===0?"No legacy audit log files found.":`Removed ${re} legacy audit log ${re===1?"file":"files"} (${ta(le)}).`);for(let ye of te)console.error(`Could not remove ${mn(ye)}`);if(console.log("Nested v2 audit logs were not changed."),re>0)console.log("This deletion cannot be undone.");return te.length===0?0:1}function Nf(I,q){let Q=I.reduce((ne,te)=>ne+(Qs(te,{throwIfNoEntry:!1})?.size??0),0);if(q)return console.log(JSON.stringify({dryRun:!0,files:I.length,bytes:Q})),0;if(console.log(I.length===0?"No legacy audit log files found.":`Would remove ${I.length} legacy audit log ${I.length===1?"file":"files"} (${ta(Q)}).`),console.log("Nested v2 audit logs are not included."),I.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function Lf(I){try{return Sf(I,{withFileTypes:!0}).filter((q)=>q.isFile()&&q.name.endsWith(".jsonl")).map((q)=>q.name)}catch{return[]}}function jf(I){try{return Rf(I),null}catch(q){return q instanceof Error?q.message:String(q)}}function ta(I){let q=["B","KiB","MiB","GiB"],Q=Math.min(Math.floor(Math.log2(Math.max(I,1))/10),q.length-1);return`${Math.round(I/1024**Q*10)/10} ${q[Q]}`}function Ff(I,q,Q){let ne=I.filter((re)=>re.entry.id===q.id);if(ne.length>1)return console.error(`Multiple audit log entries found for id ${mn(q.id??"")}.`),1;if(q.json)return console.log(JSON.stringify(ne.map((re)=>re.entry),null,2)),0;let te=ne[0];if(!te)return console.log(`No retained audit log entry found for id ${mn(q.id??"")}.`),0;return console.log(Gf(te.entry,Q)),0}function Hf(I,q,Q,ne){if(!q.all&&I.entry.decision==="allow")return!1;if(Date.parse(I.entry.ts)<ne)return!1;if(q.agent!==void 0&&I.entry.agent!==q.agent)return!1;if(q.rule!==void 0&&I.entry.ruleId!==q.rule)return!1;if(q.session!==void 0&&!Mf(I,Q,q.session))return!1;if(q.project!==void 0&&!Uf(I.entry.cwd,q.project))return!1;return!0}function Mf(I,q,Q){if(I.entry.sessionId===Q)return!0;return Ef(I.file)===q&&ea(I.file,".jsonl")===Q}function Uf(I,q){if(!I)return!1;let Q=_f(q,I);return Q!==".."&&!Q.startsWith(`..${Of}`)&&!Tf(Q)}function Bf(I,q){let Q=mn(I.id??"-"),ne=mn(I.decision??"deny"),te=I.cwd?`  [${mn(I.cwd)}]`:"",re=I.segment||I.command,le=re===I.command?"":"↳ ",ye=re.length>50?`${re.slice(0,50)}…`:re;return`${Q.padEnd(16)}  ${mn(ra(I.ts,q))}  ${ne.padEnd(5)}  ${mn(I.agent??"-").padEnd(15)}  ${mn(I.ruleId??"-").padEnd(20)}  ${le}${mn(ye)}${te}`}function Gf(I,q){let Q=(te)=>mn(te===void 0||te===null||te===""?"-":te),ne=I.shape?`${I.agent??"-"} (shape: ${I.shape})`:I.agent??"-";return[`id:        ${Q(I.id)}`,`ts:        ${Q(ra(I.ts,q))}`,`decision:  ${Q(I.decision)}`,`agent:     ${Q(ne)}`,`level:     ${Q(I.level)}`,`tool:      ${Q(I.toolName)}`,`rule:      ${Q(I.ruleId)}`,`intent:    ${Q(I.intent)}`,`stage:     ${Q(I.failureStage)}`,`error:     ${Q(I.errorCode)}`,`session:   ${Q(I.sessionId)}`,`cwd:       ${Q(I.cwd)}`,`version:   ${Q(I.v)}`,`truncated: ${Q(I.truncated===!0?"yes":void 0)}`,`reason:    ${Q(I.reason)}`,`command:   ${Q(I.command)}`,`segment:   ${Q(I.segment)}`].join(`
`)}function ra(I,q){let Q=new Date(I);if(Number.isNaN(Q.getTime()))return I;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:q}).format(Q)}function Xs(I){let q=Number(I);return Number.isFinite(q)&&q>0?q:null}var oa={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var ia={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"--shell",argument:"<auto|posix|powershell>",description:"Parse the command as this shell (default: auto)"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"',"cc-safety-net explain --shell posix 'rmdir /s /q d:\\'"]};var sa={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var zo=["npx","--offline","--no-install","@deepseek-ai/dsh","--version"],aa=["cursor-agent","--version"],la=[{id:"antigravity-cli",displayName:"Antigravity CLI",runtime:{flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",runtime:{displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",runtime:{flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",runtime:{flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",runtime:{flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",runtime:{flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",runtime:{flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",runtime:{flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",install:{flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",install:{flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",install:{flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",runtime:{flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"deepseek-harness",displayName:"DeepSeek Harness",install:{flag:"--deepseek-harness",artifactKind:"package",probeCommand:zo}},{id:"devin",displayName:"Devin CLI",runtime:{flags:["-dv","--devin"],description:"Run as Devin CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--devin",artifactKind:"hook config",probeCommand:["devin","--version"]}},{id:"droid",displayName:"Factory Droid",runtime:{flags:["-fd","--droid"],description:"Run as Factory Droid PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--droid",artifactKind:"hook config",probeCommand:["droid","--version"]}},{id:"amp",displayName:"Amp Code",install:{flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],Wo=la.slice().sort((I,q)=>I.displayName.localeCompare(q.displayName,"en")),Or=Wo.map((I)=>I.id).sort((I,q)=>Number(q==="claude-code")-Number(I==="claude-code")),ir=Wo.filter((I)=>("runtime"in I)).map((I)=>({id:I.id,displayName:"displayName"in I.runtime?I.runtime.displayName:I.displayName,flags:I.runtime.flags,legacyFlags:"legacyFlags"in I.runtime?I.runtime.legacyFlags:[],description:I.runtime.description,legacyTopLevelFlags:I.runtime.legacyTopLevelFlags})),xn=Wo.map((I)=>({id:I.id,...I.install})),qf=Object.fromEntries(la.map((I)=>[I.id,I.displayName]));function cn(I){return qf[I]}var Vf=ir.map((I)=>({flags:I.flags.join(", "),description:I.description})),Kf=ir.flatMap((I)=>I.flags.map((q)=>`cc-safety-net hook ${q}`)),ca={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Vf,{flags:"-h, --help",description:"Show this help"}],examples:Kf};var da={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...xn.map((I)=>({flags:I.flag,description:`Install ${cn(I.id)} ${I.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...xn.map((I)=>`cc-safety-net install ${I.flag}`)]},ua={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...xn.map((I)=>({flags:I.flag,description:`Uninstall ${cn(I.id)} ${I.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...xn.map((I)=>`cc-safety-net uninstall ${I.flag}`)]},pa={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var fa={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var $r={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var Yo=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],Zo=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],Mt={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"tool add <name...> [--cwd-arg <name> | --no-cwd-arg] [--project]",description:"Analyze community shell tools (user scope by default)"},{usage:"tool remove <name...> [--project]",description:"Stop analyzing declared tools"},{usage:"tool list",description:"List declared command tools in both scopes"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},{flags:"--project",description:"Use project-scope rule config with rule tool"},{flags:"--cwd-arg",argument:"<name>",description:"Name the working-directory argument with rule tool add"},{flags:"--no-cwd-arg",description:"Read no working-directory argument with rule tool add, for a remote tool"},...Yo.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk","cc-safety-net rule tool add ops_bash","cc-safety-net rule tool add ops_run_background --cwd-arg cwd --project","cc-safety-net rule tool add phone_shell --no-cwd-arg",...Zo,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var ma={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var ga={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var Dr=[ma,oa,fa,ia,Mt,$r,da,pa,ua,ca,sa,ga];function Jf(I){return I.aliases??[]}function Nr(I){let q=I.toLowerCase();return Dr.find((Q)=>Q.name.toLowerCase()===q||Jf(Q).some((ne)=>ne.toLowerCase()===q))}import{existsSync as Dy}from"node:fs";import{basename as zf}from"node:path";function Lr(I,q=7,Q=B(I)){let ne=Date.now()-q*24*60*60*1000,te=[],re=new Set,le=0,ye,ve,Pe,Ie;if(Q)ee(I,Q);let $e={count:0},Le=Q?Jn(Q,$e):[];for(let Ne of Le)for(let Ve of Ht(Ne,$e)){if(Ve.decision==="allow")continue;let Me=new Date(Ve.ts).getTime();if(Me>=ne){if(le++,re.add(Ve.sessionId??zf(Ne,".jsonl")),ve===void 0||Me<=ve)ye=Ve.ts,ve=Me;if(Ie===void 0||Me>Ie)Pe=Ve.ts,Ie=Me;Wf(te,Ve,Me)}}let Fe=te.map((Ne)=>({timestamp:Ne.ts,command:Ne.command,reason:Ne.reason,relativeTime:Ys(new Date(Ne.ts))}));return{totalBlocked:le,sessionCount:re.size,recentEntries:Fe,oldestEntry:ye,newestEntry:Pe,unreadable:$e.count}}function Wf(I,q,Q){let ne=I.findIndex((te)=>Q>new Date(te.ts).getTime());if(ne===-1){if(I.length<3)I.push(q);return}if(I.splice(ne,0,q),I.length>3)I.pop()}import{dirname as am}from"node:path";import{dirname as Yf,join as Zf,resolve as Xf}from"node:path";var Qf="config.json";function yn(I,q,Q,ne){v(em(I),`${JSON.stringify(q,null,2)}
`,Q,ne)}function em(I){return typeof I==="string"?de(I):I}function Qo(I){return{errors:ge(tm(I),": "," "),ruleNames:new Set(Ze(I).map((q)=>q.toLowerCase()))}}var nm="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",ha="must match pattern (letters, numbers, hyphens, underscores)";function tm(I){if(!ya(I))return[e([],"Config must be an object")];return[...I.version===1?[]:[e(["version"],"must be 1")],...rm(I.rules)]}function rm(I){if(I===void 0)return[];if(!Array.isArray(I))return[e(["rules"],"must be an array")];return[...I.flatMap((q,Q)=>ya(q)?om(q,["rules",Q]):[e(["rules",Q],"must be an object")]),...Je(I)]}function om(I,q){return[...Xo(I.name,[...q,"name"],"required string",m,nm),...Xo(I.command,[...q,"command"],"required string",P,ha),...I.subcommand===void 0?[]:Xo(I.subcommand,[...q,"subcommand"],"must be a string if provided",P,ha),...im(I.block_args,[...q,"block_args"]),...sm(I.reason,[...q,"reason"]),...I.intent===void 0||Ue(I.intent)?[]:[e([...q,"intent"],je)]]}function Xo(I,q,Q,ne,te){if(typeof I!=="string")return[e(q,Q)];return ne.test(I)?[]:[e(q,te)]}function im(I,q){if(!Array.isArray(I))return[e(q,"required array")];if(I.length===0)return[e(q,"must have at least one element")];return I.flatMap((Q,ne)=>{if(typeof Q!=="string")return[e([...q,ne],"must be a string")];return Q===""?[e([...q,ne],"must not be empty")]:[]})}function sm(I,q){if(typeof I!=="string")return[e(q,"required string")];if(I==="")return[e(q,"must not be empty")];return I.length>M?[e(q,`must be at most ${M} characters`)]:[]}function ya(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}function ei(I){let q=va(I);if(!q.ok)return q.result;return Qo(q.parsed)}function va(I){let q=[],Q=new Set;try{let ne=typeof I==="string"?de(I):I,te=o(ne);if(te===null)return q.push(`File not found: ${ne.path}`),{ok:!1,result:{errors:q,ruleNames:Q}};if(!te.trim())return q.push("Config file is empty"),{ok:!1,result:{errors:q,ruleNames:Q}};return{ok:!0,parsed:JSON.parse(te)}}catch(ne){if(ne instanceof i)return q.push(ne.message),{ok:!1,result:{errors:q,ruleNames:Q}};let te=ne instanceof Error?ne.message:String(ne);return q.push(ne instanceof SyntaxError?"Invalid JSON":te),{ok:!1,result:{errors:q,ruleNames:Q}}}}function Ut(I){return Xf(I,".safety-net.json")}function Hn(I){let q=va(I);if(!q.ok)return q.result;let Q=ht(q.parsed);return{errors:Q.errors,ruleNames:Q.sources}}function Bt(I,q={}){return Zf(Yf(fe(I,q)),Qf)}function ba(I,q,Q){let ne;try{if(o(q)===null)return{path:I,exists:!1,valid:!1,ruleCount:0};ne=Hn(q),ne.errors.push(...Y(I,Q))}catch(te){if(!(te instanceof i))throw te;ne={errors:[te.message],ruleNames:new Set}}return{path:I,exists:!0,valid:ne.errors.length===0,ruleCount:ne.ruleNames.size,...ne.errors.length>0?{errors:ne.errors}:{}}}function lm(I,q){return{source:q,name:I.name,command:I.command,subcommand:I.subcommand,blockArgs:[...I.block_args],reason:I.reason}}function wa(I,q){let Q=K(I),ne=D(q),te=am(Q),re=J(I,{cwd:q,userConfigPath:Q,projectConfigPath:ne,userConfigDir:te}),le=ie(I,{cwd:q,userConfigPath:Q,projectConfigPath:ne,userConfigDir:te}),ye=new Map(re.rulebooks.flatMap((ve)=>ve.rules.map((Pe)=>[Pe,ve.source])));return{userConfig:ba(Q,le.userConfigTarget,le.userScope),projectConfig:ba(ne,le.projectConfigTarget,le.projectScope),effectiveRules:re.rules.map((ve)=>lm(ve,ye.get(ve.name)??"project"))}}var cm=[{flag:r.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:r.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:r.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:r.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:r.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:r.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:r.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:r.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"},{flag:r.projectTightenOnly,description:"Ignore project policy settings that weaken the user policy",defaultBehavior:"off"}];function ka(I){return[...cm.map((q)=>({name:q.flag.name,value:xe(q.flag,I.env),isSet:At(q.flag,I.env),legacyName:q.flag.legacyName,legacyValue:q.flag.legacyName?I.env.get(q.flag.legacyName):void 0,legacyIsSet:q.flag.legacyName?I.env.get(q.flag.legacyName)!==void 0:void 0,description:q.description,defaultBehavior:q.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:I.env.get("CC_SAFETY_NET_HOME"),isSet:I.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var Ca={error:0,warning:1,info:2},dm=["policy","config","audit"];function um(I){return I.map((q)=>{if(q==="ownership")return"is not owned by the current user";if(q==="permissions")return"has unsafe permissions";if(q==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var pm=[{derive:(I)=>I.hooks.length>0&&I.hooks.every((q)=>!q.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(I)=>I.hooks.filter((q)=>q.inspectionStatus==="failed").map((q)=>{let Q=cn(q.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${Q} inspection failed`,detail:`Doctor could not verify the ${Q} integration configuration.`,fixHint:`Correct the reported ${Q} configuration error, then run \`cc-safety-net doctor\` again.`,integration:q.platform}})},{derive:(I)=>I.userConfig.exists&&!I.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:I.userConfig.path}]:[]},{derive:(I)=>I.projectConfig.exists&&!I.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:I.projectConfig.path}]:[]},{derive:(I)=>I.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${I.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(I)=>I.v2Leftovers&&I.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${I.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(I)=>I.legacyConfigs&&I.legacyConfigs.length>0?[{checkId:"config.legacy-ignored",severity:"warning",title:"Legacy inline rule configs are ignored",detail:`CC Safety Net no longer loads these files, so their rules enforce nothing: ${I.legacyConfigs.join(", ")}.`,fixHint:"Run `cc-safety-net rule migrate` to convert them (add `--cleanup` to delete each file once it is converted), then rerun doctor."}]:[]},{derive:(I)=>{let q=I.environment.find((Q)=>Q.name==="CC_SAFETY_NET_AUDIT_SCOPE");return ft(q?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...dm.map((I)=>({derive:(q)=>q.posture.directories.filter((Q)=>Q.kind===I&&Q.status==="unsafe").map((Q)=>({checkId:`posture.${I}-directory-unsafe`,severity:"error",title:`${I[0]?.toUpperCase()}${I.slice(1)} directory is unsafe`,detail:`The ${I} directory ${um(Q.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...Q.path?{path:Q.path}:{}}))})),{derive:(I)=>{let q=[...I.effectiveSafety.weakenedRuleOverrides].sort();return q.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${q.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${q.join(", ")}.`}]:[]}}];function xa(I){return pm.flatMap((q,Q)=>q.derive(I).map((ne,te)=>({finding:ne,catalogOrder:Q,occurrence:te}))).sort((q,Q)=>Ca[q.finding.severity]-Ca[Q.finding.severity]||q.catalogOrder-Q.catalogOrder||q.occurrence-Q.occurrence).map((q)=>q.finding)}function On(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var fm=(I)=>On()?`\x1B[32m${I}\x1B[0m`:I,mm=(I)=>On()?`\x1B[33m${I}\x1B[0m`:I,gm=(I)=>On()?`\x1B[34m${I}\x1B[0m`:I,hm=(I)=>On()?`\x1B[36m${I}\x1B[0m`:I,ym=(I)=>On()?`\x1B[31m${I}\x1B[0m`:I,vm=(I)=>On()?`\x1B[2m${I}\x1B[0m`:I,bm=(I)=>On()?`\x1B[1m${I}\x1B[0m`:I,We={green:fm,yellow:mm,blue:gm,cyan:hm,red:ym,dim:vm,bold:bm},wm="\x1B[0m",km=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function Cm(I){let q=I;return()=>(q=(q*1664525+1013904223)%4294967296,q/4294967296)}function xm(I){let q=[...km],Q=Cm(I);for(let ne=q.length-1;ne>0;ne--){let te=Math.floor(Q()*(ne+1)),re=q[ne];q[ne]=q[te],q[te]=re}return q}function Pm(I,q=0){if(!On())return"";let Q=xm(q);return`\x1B[38;5;${Q[I%Q.length]}m`}function Pa(I,q,Q=0){if(!On())return`"${I}"`;return`${Pm(q,Q)}"${I}"${wm}`}function jr(I){return I==="default"?"built-in default":`${I} policy`}var Sm=new RegExp("\x1B\\[[0-9;]*m","g"),ni=(I)=>I.replace(Sm,"").length;function zn(I){let q=(I.headers??I.rows[0]??[]).map((le,ye)=>{let ve=Math.max(...I.rows.map((Pe)=>ni(Pe[ye]??"")));return Math.max(ni(le),ve)}),Q=(le,ye)=>le+" ".repeat(Math.max(0,ye-ni(le))),ne=(le,ye)=>ye[0]+q.map((ve)=>le.repeat(ve+2)).join(ye[1])+ye[2],te=(le)=>`│ ${le.map((ye,ve)=>Q(ye,q[ve]??0)).join(" │ ")} │`,re=I.headers?[`   ${te(I.headers)}`,`   ${ne("─",["├","┼","┤"])}`]:[];return[`   ${ne("─",["┌","┬","┐"])}`,...re,...I.rows.map((le)=>`   ${te(le)}`),`   ${ne("─",["└","┴","┘"])}`].join(`
`)}function Sa(I){let q=[];q.push("Hook Integration"),q.push(Rm(I));let Q=[],ne=[];for(let te of I){let re=cn(te.platform);if(te.errors&&te.errors.length>0)for(let le of te.errors)if(te.configured)Q.push({platform:re,message:le});else ne.push({platform:re,message:le})}for(let te of Q)q.push(`   Warning (${te.platform}): ${te.message}`);for(let te of ne)q.push(We.red(`   Error (${te.platform}): ${te.message}`));return q.join(`
`)}function Rm(I){let q=["Platform","Discovery","Configuration","Inspection"],Q=I.map((ne)=>{let te=cn(ne.platform);if(ne.inspectionStatus==="not-inspected"){let ve=We.dim("Not inspected");return[te,ve,ve,ve]}let re=ne.detected?We.green("Detected"):ne.inspectionStatus==="failed"?We.red("Unknown"):We.dim("Not detected"),le=ne.configured?We.green("Configured"):ne.detected?We.yellow("Not configured"):ne.inspectionStatus==="failed"?We.red("Unknown"):We.dim("Not applicable"),ye=ne.inspectionStatus==="verified"?We.green("Verified"):ne.inspectionStatus==="failed"?We.red("Failed"):We.dim("Not applicable");return[te,re,le,ye]});return zn({headers:q,rows:Q})}function Ra(I){let Q=["Guard Engine Verification",`   Synthetic self-test: ${I.failed>0?We.red(`${I.passed}/${I.total} FAIL`):We.green(`${I.passed}/${I.total} passed`)}`],ne=I.results.filter((te)=>!te.passed);if(ne.length>0){Q.push(""),Q.push(We.red("   Failures:"));for(let te of ne)Q.push(We.red(`   • ${te.description}`)),Q.push(We.red(`     expected ${te.expected}, got ${te.actual}`))}return Q.join(`
`)}function Em(I){if(I.length===0)return"   (no custom rules)";let q=["Source","Name","Command","Block Args"],Q=I.map((ne)=>[ne.source,ne.name,ne.subcommand?`${ne.command} ${ne.subcommand}`:ne.command,ne.blockArgs.join(", ")]);return zn({headers:q,rows:Q})}function Ea(I){let q=[];if(q.push("Configuration"),q.push(Tm(I.userConfig,I.projectConfig)),q.push(""),I.effectiveRules.length>0)q.push(`   Effective rules (${I.effectiveRules.length} total):`),q.push(Em(I.effectiveRules));else q.push("   Effective rules: (none - using built-in rules only)");return q.join(`
`)}function Tm(I,q){let Q=["Scope","Status"],ne=(re)=>{if(!re.exists)return We.dim("N/A");if(!re.valid)return We.red(`Invalid (${re.errors?.[0]??"unknown error"})`);return We.green("Configured")},te=[["User",ne(I)],["Project",ne(q)]];return zn({headers:Q,rows:te})}function Ta(I){let q=[];return q.push("Environment"),q.push(Am(I)),q.join(`
`)}function Aa(I){let q=I.effectiveSafety.policyScopes,Q=["Effective Safety",`   Selected preset: ${I.effectiveSafety.selectedPreset}${q?` (${jr(q.levelScope)})`:""}`,`   Effective: ${I.effectiveSafety.level}`],ne=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[te,re]of ne){let le=I.effectiveSafety.capabilities[te],ye=le.enabled?We.green("ON"):We.dim("OFF"),ve=le.sources.length>0?` (${le.sources.join(", ")})`:"";Q.push(`   ${re}: ${ye} via ${le.source}${ve}`)}if(q&&q.weakenings.length>0){Q.push(`   Project policy deltas${q.weakeningsIgnored?" (ignored)":""}:`);for(let te of q.weakenings)Q.push(`      ${te}`)}Q.push(`   Stored rule customizations: ${I.effectiveSafety.ruleCounts.stored}`),Q.push(`   Effective rule customizations: ${I.effectiveSafety.ruleCounts.effective}`);for(let[te,re]of Object.entries(I.effectiveSafety.ruleOverrides))Q.push(`   ${te}: ${re}`);return Q.join(`
`)}function _a(I){let q=["Findings"];if(I.length===0)return q.push("   No findings from inspected doctor facts."),q.join(`
`);for(let Q of I){let ne=`[${Q.severity.toUpperCase()}] ${Q.checkId}: ${mn(Q.title)}`,te=Q.severity==="error"?We.red:Q.severity==="warning"?We.yellow:We.blue;if(q.push(`   ${te(ne)}`),q.push(`      ${mn(Q.detail)}`),Q.path)q.push(`      Path: ${mn(Q.path)}`);if(Q.fixHint)q.push(`      Fix: ${mn(Q.fixHint)}`)}return q.join(`
`)}function Am(I){let q=["Variable","Status","Legacy"],Q=I.map((ne)=>{let te=ne.isSet?We.green("✓"):We.dim("✗"),re=ne.legacyName&&ne.legacyIsSet?`${ne.legacyName} ${We.green("✓")}`:ne.legacyName??"";return[ne.name,te,re]});return zn({headers:q,rows:Q})}function Ia(I){let q=[];if(I.totalBlocked===0)q.push("Recent Activity"),q.push("   No blocked commands in the last 7 days"),q.push("   Tip: This is normal for new installations");else q.push(`Recent Activity · last 7 days (${I.totalBlocked} blocked / ${I.sessionCount} sessions)`),q.push(_m(I.recentEntries));if(I.unreadable>0)q.push(`   Warning: ${I.unreadable} audit log ${I.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return q.join(`
`)}function _m(I){let q=["Time","Command"],Q=I.map((ne)=>{let te=mn(ne.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),re=te.length>40?`${te.slice(0,37)}...`:te;return[ne.relativeTime,re]});return zn({headers:q,rows:Q})}function Oa(I){let q=[];if(q.push("Update Check"),I.latestVersion===null&&!I.error)return q.push(Fr([["Status",We.dim("Skipped")],["Installed",I.currentVersion]])),q.join(`
`);if(I.error)return q.push(Fr([["Status",`${We.yellow("⚠")} Error`],["Installed",I.currentVersion],["Error",We.dim(I.error)]])),q.join(`
`);if(I.updateAvailable)return q.push(Fr([["Status",`${We.yellow("⚠")} Update Available`],["Current",I.currentVersion],["Latest",We.green(I.latestVersion??"")]])),q.push(""),q.push("   Run: bunx cc-safety-net@latest doctor"),q.push("   Or:  npx cc-safety-net@latest doctor"),q.join(`
`);return q.push(Fr([["Status",`${We.green("✓")} Up to date`],["Version",I.currentVersion]])),q.join(`
`)}function Fr(I){return zn({rows:I})}function $a(I){let q=[];return q.push("System Info"),q.push(Im(I)),q.join(`
`)}function Im(I){let q=["Component","Version"],Q=(re)=>{if(re===null)return We.dim("not found");return re},te=[{label:"cc-safety-net",value:I.version},...Or.map((re)=>({label:cn(re),value:I.versions[re]??null})),{label:"Node.js",value:I.nodeVersion},{label:"npm",value:I.npmVersion},{label:"Bun",value:I.bunVersion},{label:"Platform",value:I.platform}].map((re)=>[re.label,Q(re.value)]);return zn({headers:q,rows:te})}function Da(I){if(I.findings.length===0)return We.green(`
No findings from inspected doctor facts.`);let q={error:I.findings.filter((re)=>re.severity==="error").length,warning:I.findings.filter((re)=>re.severity==="warning").length,info:I.findings.filter((re)=>re.severity==="info").length},Q=["error","warning","info"].filter((re)=>q[re]>0).map((re)=>`${q[re]} ${re}`),ne=I.findings.length===1?"finding":"findings",te=`
${I.findings.length} ${ne}: ${Q.join(", ")}.`;if(q.error>0)return We.red(te);if(q.warning>0)return We.yellow(te);return We.blue(te)}import{lstatSync as Om}from"node:fs";import{dirname as ti}from"node:path";function ri(I,q){try{let Q=Om(q);if(Q.isSymbolicLink())return{kind:I,path:q,status:"unsafe",issues:["symlink"]};if(!Q.isDirectory())return{kind:I,path:q,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:I,path:q,status:"unknown",issues:[]};let ne=[...Q.uid!==process.getuid()?["ownership"]:[],...(Q.mode&18)!==0?["permissions"]:[]];return{kind:I,path:q,status:ne.length>0?"unsafe":"safe",issues:ne}}catch(Q){if(typeof Q==="object"&&Q!==null&&"code"in Q&&Q.code==="ENOENT")return{kind:I,path:q,status:"not-applicable",issues:[]};return{kind:I,path:q,status:"unknown",issues:[]}}}function Na(I,q){let Q=B(I);return{directories:[ri("policy",ti(ti(q))),ri("config",ti(q)),...Q?[ri("audit",Q)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as $m}from"node:child_process";import{existsSync as La}from"node:fs";import{delimiter as Dm,extname as Nm,join as Lm}from"node:path";import{stripVTControlCharacters as ja}from"node:util";var Ha="2.7.12",jm=5000,Fm="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function un(){return Ha}function oi(I,q){let Q=I[q];if(Q)return Q;let ne=Object.keys(I).find((te)=>te.toLowerCase()===q.toLowerCase()&&!!I[te]);return ne?I[ne]:Q}function Hm(I){return(oi(I,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((q)=>q.length>0)}function Mm(I,q){let Q=Nm(I)?[I]:[...Hm(q).map((ne)=>`${I}${ne}`),I];if(I.includes("/")||I.includes("\\"))return Q.find((ne)=>La(ne))??I;return(oi(q,"PATH")??"").split(Dm).flatMap((ne)=>Q.map((te)=>Lm(ne,te))).find((ne)=>La(ne))??I}function Fa(I){if(!/[\s"&|<>^]/.test(I))return I;return`"${I.replace(/"/g,'""')}"`}function Wn(I,q){let[Q,...ne]=I,te=q[Fm]==="win32"?"win32":process.platform;if(!Q||te!=="win32")return{cmd:Q??"",args:ne};let re=Mm(Q,q);if(!/\.(?:bat|cmd)$/i.test(re))return{cmd:re,args:ne};return{cmd:oi(q,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",Fa(re),...ne.map(Fa)].join(" ")]}}var Gt=async(I,q=jm)=>{let Q=await Um(I,{timeoutMs:q});if(Q.code!==0)return null;return ja(Q.stdout).trim()||ja(Q.stderr).trim()||null};function Um(I,q){let[Q,...ne]=I;if(!Q)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((te)=>{try{let re=Wn([Q,...ne],process.env),le=$m(re.cmd,re.args,{stdio:["ignore","pipe","pipe"]}),ye=!1,ve="",Pe="";le.stdout.on("data",(Le)=>{ve+=Le.toString()}),le.stderr.on("data",(Le)=>{Pe+=Le.toString()});let Ie=(Le)=>{if(ye)return;ye=!0,clearTimeout($e),te(Le)},$e=setTimeout(()=>{le.kill(),Ie({code:null,stdout:ve,stderr:Pe})},q.timeoutMs);le.on("close",(Le)=>{Ie({code:Le,stdout:ve,stderr:Pe})}),le.on("error",()=>{Ie({code:null,stdout:ve,stderr:Pe})})}catch{te({code:null,stdout:"",stderr:""})}})}function Hr(I){if(!I)return null;let q=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(I);if(q)return q[1]??null;let Q=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(I);if(Q)return Q[1]??null;return I.split(`
`)[0]?.trim()||null}async function Mr(I,q=Gt,Q=process.cwd()){let ne=Promise.all(xn.map(async($e)=>[$e.id,Hr(await q([...$e.probeCommand]))])),[te,re,le,ye,ve,Pe,Ie]=await Promise.all([ne,ne.then(async($e)=>{let Le=$e.find(([Ve])=>Ve==="opencode")?.[1];if(!Le?.startsWith("2.")||!I(Le))return null;let Fe=["--param",`location[directory]=${Q}`],Ne=["opencode","api","integration.list",...Fe];return await q(Ne,30000),q(["opencode","api","plugin.list",...Fe],30000)}),q(["codex","plugin","list"],30000),q(["amp","plugins","list"],30000),q(["node","--version"]),q(["npm","--version"]),q(["bun","--version"])]);return{version:Ha,versions:Object.fromEntries(te),codexPluginListOutput:le,ampPluginListOutput:ye,openCodePluginListOutput:re,nodeVersion:Hr(ve),npmVersion:Hr(Pe),bunVersion:Hr(Ie),platform:`${process.platform} ${process.arch}`}}function ii(I,q){if(q==="dev")return!1;let Q=I.split(".").map(Number),ne=q.split(".").map(Number),[te=0,re=0,le=0]=Q,[ye=0,ve=0,Pe=0]=ne;if(te!==ye)return te>ye;if(re!==ve)return re>ve;return le>Pe}async function Mn(){let I=un(),q=new AbortController,Q=setTimeout(()=>q.abort(),3000);try{let ne=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:q.signal});if(!ne.ok)return{currentVersion:I,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${ne.status}`};let te=await ne.json(),re=ii(te.version,I);return{currentVersion:I,latestVersion:te.version,updateAvailable:re}}catch(ne){return{currentVersion:I,latestVersion:null,updateAvailable:!1,error:ne instanceof Error?ne.message:"Network error"}}finally{clearTimeout(Q)}}import*as Ja from"node:readline";var Ga=(I)=>`\x1B[${I}B`,Bm=(I)=>`\x1B[${I}A`;var Ma=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Gm(I){return new Promise((q)=>setTimeout(q,I))}function qm(I,q,Q){if(!Q)return q(I);if(Q.aborted)return Promise.resolve();return new Promise((ne,te)=>{let re=()=>Q.removeEventListener("abort",le),le=()=>{re(),ne()};Q.addEventListener("abort",le,{once:!0}),q(I).then(()=>{re(),ne()},(ye)=>{re(),te(ye)})})}function Ur(I){return Math.max(0,Math.min(1,I))}function qt(I){return Math.max(0,Math.min(255,Math.round(I)))}function si(I){return I<=0.0031308?12.92*I:1.055*I**0.4166666666666667-0.055}function Vm(I,q,Q){let ne=Q*Math.PI/180,te=q*Math.cos(ne),re=q*Math.sin(ne),le=(I+0.3963377774*te+0.2158037573*re)**3,ye=(I-0.1055613458*te-0.0638541728*re)**3,ve=(I-0.0894841775*te-1.291485548*re)**3;return{blue:qt(si(Ur(-0.0041960863*le-0.7034186147*ye+1.707614701*ve))*255),green:qt(si(Ur(-1.2684380046*le+2.6097574011*ye-0.3413193965*ve))*255),red:qt(si(Ur(4.0767416621*le-3.3077115913*ye+0.2309699292*ve))*255)}}function ai(I,q){let Q=(q*I*180/Math.PI%360+360)%360;return Vm(0.72,0.15,Q)}function qa(I,q=0.1){let Q=ai(q,I);return`\x1B[38;2;${Q.red};${Q.green};${Q.blue}m`}function Km(I,q){return{blue:qt(I.blue+(255-I.blue)*q),green:qt(I.green+(255-I.green)*q),red:qt(I.red+(255-I.red)*q)}}function Va(I,q,Q){let ne=Math.imul(I+2654435769,2246822507)^Math.imul(q+3266489909,668265263)^Math.imul(Q+374761393,2654435761),te=ne^ne>>>15,re=Math.imul(te,739982445),le=re^re>>>12,ye=Math.imul(le,695872825);return((ye^ye>>>15)>>>0)/4294967296}function Jm(I,q,Q){let ne=Math.floor(Va(I,q,Q)*Ma.length);return Ma[ne]??"░"}function Ua(I){let q=Ur(I);return q*q*q*(q*(q*6-15)+10)}function zm(I){if(I.length===0)return"";let q=[],Q=!1,ne="";for(let te of I){let re=`${te.red};${te.green};${te.blue}`;if(te.bold!==Q)q.push(te.bold?"\x1B[1m":"\x1B[22m"),Q=te.bold;if(re!==ne)q.push(`\x1B[38;2;${re}m`),ne=re;q.push(te.character)}return`${q.join("")}\x1B[22m\x1B[39m`}function Wm(I,q,Q,ne,te){return I.map((re,le)=>({...ai(Q,ne+q+le/te),bold:!1,character:re}))}function Ym(I,q,Q,ne,te,re,le,ye){let ve=Math.max(1,ne*0.75),Pe=Math.min(1,Q/ve),Ie=te*Ua(Pe),$e=Math.max(0,(Q-ve)/Math.max(1,ne-ve)),Le=(1-Ua(Q/ne))*ye*2,Fe=0.35*Math.max(0,1-$e*2),Ne=Pe>=1,Ve=Math.min(I.length,Math.ceil(Ie+2+1));return I.slice(0,Ve).map((Me,tn)=>{let en=ai(re,le+q+tn/ye+Le),on=tn+Va(q,tn,7919)*2-1;if(on>Ie+2)return{...en,bold:!1,character:" "};let ln=Ie-on,nn=0.8*Math.exp(-(ln*ln)/12.5),sn=Math.min(0.9,nn+Fe),Sn=!Ne&&on>Ie-4;return{...Km(en,sn),bold:sn>0.3,character:Sn?Jm(q,tn,Q):Me}})}function Ba(I){return`\x1B[?2026h${I.map((q,Q)=>`\x1B8${Q>0?Ga(Q):""}${zm(q)}`).join("")}\x1B[?2026l`}async function li(I,q={}){if(!I)return;let Q=q.output??process.stdout,ne=q.sleep??Gm,te=q.seed??0,re=I.split(`
`).map((Ie)=>Array.from(Ie)),le=Math.max(...re.map((Ie)=>Ie.length)),ye=12000*re.filter((Ie)=>Ie.length>0).length/40,ve=le>0?Math.max(1,Math.ceil(ye/16.666666666666668)):0,Pe=ve>0?ye/ve:0;Q.write(`\x1B[?25l${re.length>1?`${`
`.repeat(re.length-1)}${Bm(re.length-1)}`:""}\x1B7`);try{for(let Ie=1;Ie<=ve;Ie+=1){if(q.signal?.aborted)break;Q.write(Ba(re.map(($e,Le)=>Ym($e,Le,Ie,ve,le,0.1,te,3)))),await qm(Pe,ne,q.signal)}}finally{if(Q.write(Ba(re.map((Ie,$e)=>Wm(Ie,$e,0.1,te,3)))),Q.write("\x1B8"),re.length>1)Q.write(Ga(re.length-1));Q.write(`
\x1B[0m\x1B[?25h`)}}var Ka=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function Zm(I){return Boolean(I.isTTY)}async function sr(I={}){let q=I.output??process.stdout;if(!Zm(q))return;let Q=I.input??process.stdin,ne={output:q,seed:I.seed??Math.random()*8192,sleep:I.sleep};if(!Q.isTTY||typeof Q.setRawMode!=="function"){await li(Ka,ne);return}let te=new AbortController,re=Q.readableFlowing===!0,le=Q.isRaw===!0,ye=!1,ve=(Pe,Ie)=>{if(Ie.ctrl&&Ie.name==="c")ye=!0;if(ye||Ie.name==="return"||Ie.name==="enter")te.abort()};Ja.emitKeypressEvents(Q),Q.on("keypress",ve),Q.setRawMode(!0),Q.resume();try{await li(Ka,{...ne,signal:te.signal})}finally{if(Q.off("keypress",ve),Q.setRawMode(le),!re)Q.pause()}if(!ye)return;if(I.onInterrupt){I.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as ng}from"node:crypto";import{existsSync as Wa}from"node:fs";import{dirname as Br,join as Ya}from"node:path";import{dirname as za,join as Xm}from"node:path";var Qm="rule.lock";function eg(I){return Xm(za(I),Qm)}function hn(I,q){let Q=q.global?q.userConfigPath??K(I,q):q.projectConfigPath??D(q.cwd??process.cwd()),ne=q.global?mt(I,q):gt(Q,q.cwd??process.cwd()),te=eg(Q);return{configDir:za(Q),configPath:Q,lockPath:te,filesystemScope:ne,configTarget:s(ne,Q),lockTarget:s(ne,te)}}var tg="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",rg="cache",og="rulebooks";function Za(I,q={}){let Q=hn(I,q),ne=s(Q.filesystemScope,Qa(Q.configDir)),te=o(Q.lockTarget);if(console.log(tg),te===null&&!Wa(ne.path))return console.log(`No v2 lock or cache leftovers found in ${Br(Q.configDir)}; nothing to migrate.`),0;let re=cg(te),le=f(Q.configTarget);if(!le.config&&(o(Q.configTarget)!==null||re.size>0))return console.error(`Cannot migrate: the rules config in ${Br(Q.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let ye=le.config?.rules??[];for(let ve of ye.flatMap((Pe)=>ig(Pe,re,Q,ne,q.global===!0)))console.log(ve);return V(Q.lockTarget),It(ne),console.log(`Removed the v2 lock and cache under ${Br(Q.configDir)}.`),0}function Xa(I,q){return[...new Set([{cwd:q},{cwd:q,global:!0}].flatMap((Q)=>{let ne=hn(I,Q);return[ne.lockPath,Qa(ne.configDir)]}))].filter((Q)=>Wa(Q))}function ig(I,q,Q,ne,te){if(!T(I))return[];let re=j(I).name,le=s(Q.filesystemScope,U(Q.configDir,re)),ye=o(le);if(ye!==null&&sg(ye,re))return[];let ve=q.get(I),Pe=ve?ag(ve,re,ne.path,Q.filesystemScope):null;if(Pe===null)return[`Could not migrate ${I} from the v2 cache. Run \`cc-safety-net rule update ${I}${te?" --global":""}\` to vendor it.`];if(v(le,Pe),ye!==null)return[`Restored ${I} from the v2 cache over an invalid file.`];return[`Vendored ${I} from the v2 cache.`]}function sg(I,q){let Q=Te(I);return!("problem"in Q)&&Q.rulebook.name===q}function ag(I,q,Q,ne){let te=Ya(Q,og,`${lg(I)}--${I.digest.replace("sha256:","").slice(0,12)}`,we),re=o(s(ne,te));if(re===null||pg(re)!==I.digest)return null;let le=Te(re);if("problem"in le||le.rulebook.name!==q)return null;return re}function Qa(I){return Ya(Br(I),rg)}function lg(I){return([I.owner,I.repo,I.display_ref,I.name].every((ne)=>typeof ne==="string"&&ne!=="")?`${I.owner}/${I.repo}#${I.display_ref}/${I.name}`:I.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function cg(I){let q=I===null?null:ug(I),Q=el(q)&&Array.isArray(q.rulebooks)?q.rulebooks:[];return new Map(Q.filter(dg).map((ne)=>[ne.spec,ne]))}function dg(I){return el(I)&&typeof I.spec==="string"&&typeof I.digest==="string"}function el(I){return!!I&&typeof I==="object"}function ug(I){try{return JSON.parse(I)}catch{return null}}function pg(I){return`sha256:${ng("sha256").update(I).digest("hex")}`}var nl="\r\x1B[2K",fg="\x1B[?25l",mg="\x1B[39m",gg="\x1B[?25h",hg=100,yg=0.55,vg=80,tl=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function bg(I){return new Promise((q)=>setTimeout(q,I))}async function Gr(I,q={}){let Q=q.output??process.stdout;if(!Q.isTTY)return I;let ne=q.sleep??bg,te=!1,re=I.then((ye)=>(te=!0,ye),(ye)=>{throw te=!0,ye});if(await Promise.race([re.then(()=>!0),ne(hg).then(()=>!1)]))return re;Q.write(fg);try{for(let ye=0;!te;ye+=1)Q.write(`${nl}${qa(ye*yg)}${tl[ye%tl.length]}${mg} ${q.loadingMessage??"Loading…"}`),await Promise.race([re,ne(vg)]);return await re}finally{Q.write(`${nl}${gg}`)}}async function ar(I,q,Q,ne={}){let te=q();if(I)await Q();if(I&&te.ready)await Gr(te.ready,ne);return te.finish()}import{stripVTControlCharacters as wg}from"node:util";var qr="amp plugins list",kg=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function rl(I){if(!I.ampPluginListOutput)return{platform:"amp",status:"n/a"};let q=wg(I.ampPluginListOutput).split(`
`).map((Q)=>kg.exec(Q)?.[1]).find((Q)=>Q!==void 0);if(!q)return{platform:"amp",status:"n/a"};if(q!=="active")return{platform:"amp",status:"disabled",method:qr,configPath:qr,errors:[`Amp personal plugin cc-safety-net is ${q}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:qr,configPath:qr}}import{existsSync as Tg,readFileSync as Ag}from"node:fs";import{isAbsolute as cP,join as Eg}from"node:path";function lr(I){return Eg(I,".gemini","config","hooks.json")}var il=new Map([["run_command","auto"]]),sl="manage_task";var _g=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function Ig(I){if(!I||typeof I!=="object"||Array.isArray(I))return[];return Object.values(I).flatMap((q)=>{if(!q||typeof q!=="object"||Array.isArray(q))return[];let Q=q,ne=Q.PreToolUse;if(!Array.isArray(ne))return[];return ne.flatMap((te)=>{if(!te||typeof te!=="object"||Array.isArray(te))return[];let re=te.hooks;if(!Array.isArray(re))return[];return re.flatMap((le)=>{if(!le||typeof le!=="object"||Array.isArray(le))return[];let ye=le.command;if(typeof ye!=="string"||!_g.test(ye))return[];return[{command:ye,enabled:Q.enabled!==!1}]})})})}function al(I){let q=lr(I.environment.home);if(!Tg(q))return{platform:"antigravity-cli",status:"n/a",configPath:q};let Q;try{Q=Ig(JSON.parse(Ag(q,"utf-8")))}catch(ne){return{platform:"antigravity-cli",status:"n/a",configPath:q,errors:[`Failed to parse Antigravity hooks config ${q}: ${ne instanceof Error?ne.message:String(ne)}`]}}if(Q.some((ne)=>ne.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:q};if(Q.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:q};return{platform:"antigravity-cli",status:"n/a",configPath:q}}import{existsSync as Og}from"node:fs";import{join as $n}from"node:path";var zr="cc-safety-net@cc-marketplace";function Wr(I){return I.env.get("CLAUDE_CONFIG_DIR")||$n(I.home,".claude")}function ll(I){return $n(I.env.get("CLAUDE_CODE_PLUGIN_CACHE_DIR")||$n(Wr(I),"plugins"),"installed_plugins.json")}function cl(I,q){let Q=n(n(I,"plugins"),q);return Array.isArray(Q)&&Q.length>0}function Yr(I,q){let Q=b(ll(I));return Q.kind==="ok"&&cl(Q.value,q)}function ui(I){return dl(ll(I),$n(Wr(I),"settings.json"))}function dl(I,q){let Q=b(I);if(Q.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(Q.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!cl(Q.value,zr))return{platform:"claude-code",status:"n/a"};let ne=b(q);if(ne.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(ne.kind==="ok"&&n(n(ne.value,"enabledPlugins"),zr)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:q,errors:[`${zr} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:I}}function ul(I){let q=$n(I.home,".claude"),Q=$n(q,"plugins","installed_plugins.json");if(dl(Q,$n(q,"settings.json")).status!=="configured")return;let ne=b(Q),te=ne.kind==="ok"?n(n(ne.value,"plugins"),zr):void 0,re=(Array.isArray(te)?te:[]).filter((Pe)=>n(Pe,"scope")==="user").map((Pe)=>n(Pe,"installPath")).find((Pe)=>typeof Pe==="string");if(!re)return;let le=$n(re,".cursor-plugin","plugin.json"),ye=b(le),ve=ye.kind==="ok"?n(ye.value,"hooks"):void 0;return typeof ve==="string"&&Og($n(re,ve))?le:void 0}function pl(I){return ui(I.environment)}var fl="Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.";function ml(I){if(!I.codexPluginListOutput)return{platform:"codex",status:"n/a"};let q=I.codexPluginListOutput.split(`
`).find((Q)=>Q.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!q)return{platform:"codex",status:"n/a"};if(!q.includes("installed,"))return{platform:"codex",status:"n/a"};if(!q.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex runs only trusted hooks, and doctor cannot check trust. Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."]}}import{existsSync as eo,readdirSync as $g,readFileSync as Dg}from"node:fs";import{join as vn}from"node:path";function gn(I){let q="",Q=0,ne=!1,te=!1,re=-1;while(Q<I.length){let le=I[Q],ye=I[Q+1];if(te){q+=le,te=!1,Q++;continue}if(le==='"'&&!ne){ne=!0,re=-1,q+=le,Q++;continue}if(le==='"'&&ne){ne=!1,q+=le,Q++;continue}if(le==="\\"&&ne){te=!0,q+=le,Q++;continue}if(ne){q+=le,Q++;continue}if(le==="/"&&ye==="/"){while(Q<I.length&&I[Q]!==`
`)Q++;continue}if(le==="/"&&ye==="*"){Q+=2;while(Q<I.length-1){if(I[Q]==="*"&&I[Q+1]==="/"){Q+=2;break}Q++}continue}if(le===","){re=q.length,q+=le,Q++;continue}if(le==="}"||le==="]"){if(re!==-1){let ve=q.slice(re+1);if(/^\s*$/.test(ve))q=q.slice(0,re)+ve}re=-1,q+=le,Q++;continue}if(!/\s/.test(le))re=-1;q+=le,Q++}return q}function hl(I,q,Q){let ne=q+1,te=!1;while(ne<I.length){if(te){te=!1,ne++;continue}if(I[ne]==="\\"){te=!0,ne++;continue}if(I[ne]==='"')return ne+1;ne++}throw Error(Q)}function fi(I,q,Q){let ne=I[q],te=ne==="["?"]":"}",re=0,le=q;while(le<I.length){let ye=Q.skipComment?.(I,le)??le;if(ye!==le){le=ye;continue}if(I[le]==='"'){le=hl(I,le,Q.stringError);continue}if(I[le]===ne)re++;if(I[le]===te){if(re--,re===0)return le}le++}throw Error(Q.bracketError)}function yl(I,q){let Q=I.lastIndexOf(`
`,q)+1;return/^[ \t]*/.exec(I.slice(Q))?.[0]??""}function vl(I,q){let Q=q.end+(/^\s*/.exec(I.slice(q.end))?.[0].length??0);if(I[Q]===","){let le=I[Q+1]===`
`?Q+2:Q+1;return`${I.slice(0,q.start)}${I.slice(le)}`}let ne=I.slice(0,q.start).search(/\s*$/)-1;if(I[ne]!==",")return`${I.slice(0,q.start)}${I.slice(q.end)}`;let te=I.lastIndexOf(`
`,ne-1),re=te!==-1&&/^\s*$/.test(I.slice(te+1,ne))?te:ne;return`${I.slice(0,re)}${I.slice(q.end)}`}function pi(I,q){if(I.startsWith("//",q)){let Q=I.indexOf(`
`,q+2);return Q===-1?I.length:Q+1}if(I.startsWith("/*",q)){let Q=I.indexOf("*/",q+2);return Q===-1?I.length:Q+2}return q}function gl(I,q){let Q=q;while(Q<I.length){if(/\s/.test(I[Q]??"")){Q++;continue}let ne=pi(I,Q);if(ne===Q)return Q;Q=ne}return Q}function bl(I,q,Q){let ne=0,te=0;while(te<I.length){let re=pi(I,te);if(re!==te){te=re;continue}if(I[te]==='"'){let le=hl(I,te,Q.stringError);if(ne===1&&JSON.parse(I.slice(te,le))===q){let ye=gl(I,le),ve=gl(I,ye+1);if(I[ye]===":"&&I[ve]==="[")return{start:ve,end:fi(I,ve,{skipComment:pi,...Q})}}te=le;continue}if(I[te]==="{"||I[te]==="[")ne++;if(I[te]==="}"||I[te]==="]")ne--;te++}return}var En="cc-safety-net@cc-marketplace",Zr=["cc-marketplace","cc-safety-net"],wl=["_direct","copilot-safety-net"],kl=["cc-marketplace","safety-net"],Cl="safety-net@cc-marketplace";function Xr(I,q){let Q=q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${Q}([^a-z0-9-]|$)`,"m").test(I??"")}function xl(I){return Xr(I,"cc-safety-net@cc-marketplace")}function Pl(I){return Xr(I,"cc-marketplace")}function Sl(I){return Xr(I,"copilot-safety-net")}function Rl(I){return Xr(I,"safety-net@cc-marketplace")}function Qr(I){if(!I?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(I)}function Tl(I,q){if(!I)return null;let Q=I.match(/(\d+)\.(\d+)\.(\d+)/);if(!Q)return null;let ne=[Number(Q[1]),Number(Q[2]),Number(Q[3])];for(let te=0;te<q.length;te++){let re=ne[te]??0,le=q[te]??0;if(re!==le)return re>le}return!0}function Ng(I){return Tl(I,[0,0,422])}function Lg(I){return Tl(I,[1,0,8])}function ur(I){return I.env.get("COPILOT_HOME")||vn(I.home,".copilot")}function Al(I){return I.disableAllHooks!==!0&&_l(I)}function _l(I){return(I.hooks?.preToolUse??[]).some((Q)=>{if(Q.type!==void 0&&Q.type!=="command")return!1;return Qr(Q.command)||Qr(Q.bash)||Qr(Q.powershell)||Qr(Q.exec&&[Q.exec,...Q.args??[]].join(" "))})}function cr(I){return I===void 0||typeof I==="string"}function jg(I){return I===void 0||Array.isArray(I)&&I.every((q)=>typeof q==="string")}function Fg(I){if(!I||typeof I!=="object"||Array.isArray(I))return!1;let q=I;if(q.disableAllHooks!==void 0&&typeof q.disableAllHooks!=="boolean")return!1;if(q.hooks===void 0)return!0;if(!q.hooks||typeof q.hooks!=="object"||Array.isArray(q.hooks))return!1;let Q=q.hooks.preToolUse;if(Q===void 0)return!0;return Array.isArray(Q)&&Q.every((ne)=>ne!==null&&typeof ne==="object"&&!Array.isArray(ne)&&cr(ne.type)&&cr(ne.command)&&cr(ne.bash)&&cr(ne.powershell)&&cr(ne.exec)&&jg(ne.args))}function mi(I,q){try{let Q=JSON.parse(gn(Dg(I,"utf-8")));if(!Fg(Q)){q?.push(`Invalid hook config ${I}: hooks.preToolUse must be an array of hook objects`);return}return Q}catch(Q){q?.push(`Failed to parse ${I}: ${Q instanceof Error?Q.message:String(Q)}`);return}}function Il(I,q){try{return $g(I).filter((Q)=>Q.endsWith(".json")).sort((Q,ne)=>Q.localeCompare(ne))}catch(Q){return q?.push(`Failed to read ${I}: ${Q instanceof Error?Q.message:String(Q)}`),[]}}function Hg(I,q){if(!eo(I))return[];let Q=[];for(let ne of Il(I,q)){let te=vn(I,ne),re=mi(te,q);if(re&&Al(re))Q.push(te)}return Q}function dr(I,q){if(!eo(I))return;let Q=mi(I,q);if(!Q)return;return{path:I,config:Q}}function El(I,q,Q,ne){if(q){I.push(`GitHub Copilot CLI ${q} does not support ${Q}; requires ${ne}+`);return}I.push(`GitHub Copilot CLI version unavailable; skipping ${Q} because it requires ${ne}+`)}function Mg(I){for(let q of I){if(q?.config.disableAllHooks===!0)return q.path;if(q?.config.disableAllHooks===!1)return}return}function Ug(I,q,Q,ne){let te=ur(I),re=vn(q,".github","hooks"),le=vn(te,"hooks"),ye=vn(q,".github","copilot"),ve=vn(q,".claude"),Pe=Lg(Q),Ie=Pe===!0?ne:void 0,$e=[dr(vn(ye,"settings.local.json"),Ie),dr(vn(ye,"settings.json"),Ie),dr(vn(ve,"settings.local.json"),Ie),dr(vn(ve,"settings.json"),Ie)],Le=dr(vn(te,"settings.json"),Ie),Fe=[Le?.config.disableAllHooks===!0?void 0:Le];if(Pe!==!1){let nn=Mg($e);if(nn){if(Pe===null)ne.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${nn} as active`);return{activeConfigPaths:[],repoInlineSources:$e,disabledBy:nn}}}let Ne=Hg(re,ne),Ve=Ng(Q),Me=Ve===!0?ne:void 0,tn=eo(le)?Il(le,Me):[],en=[];for(let nn of tn){let sn=vn(le,nn),Sn=mi(sn,Me);if(Sn&&Al(Sn))en.push(sn)}if(Ve!==!0&&en.length>0)El(ne,Q,`user hook files in ${le}`,"0.0.422"),en.length=0;let on=[];for(let nn of[...$e,...Fe]){if(!nn)continue;if(!_l(nn.config))continue;if(Pe===!0){on.push(nn);continue}El(ne,Q,"inline hook definitions in Copilot config files","1.0.8");break}let ln=(nn)=>nn.filter((sn)=>!!sn&&on.includes(sn)).map((sn)=>sn.path);return{activeConfigPaths:[...ln($e),...Ne,...ln(Fe),...en],repoInlineSources:$e}}function Ol(I){let q=[],Q=Ug(I.environment,I.cwd,I.copilotCliVersion,q);if(Q.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:Q.disabledBy,configPaths:[Q.disabledBy],errors:q.length>0?q:void 0};let ne=ur(I.environment),te=vn(ne,"installed-plugins",...Zr),re=eo(te),le=vn(ne,"settings.json"),ye=b(le,gn),ve=(Fe)=>n(n(Fe,"enabledPlugins"),En),Pe=Q.repoInlineSources.find((Fe)=>typeof ve(Fe?.config)==="boolean"),Ie=Pe??(ye.kind==="ok"?{path:le,config:ye.value}:void 0);if(re&&!Pe&&ye.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};let $e=re&&Ie!==void 0&&ve(Ie.config)===!1;if($e&&Q.activeConfigPaths.length===0)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:Ie.path,errors:[`${En} is installed but not enabled in Copilot CLI`]};let Le=re&&!$e;if(Le||Q.activeConfigPaths.length>0){let Fe=Q.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:Le?"plugin config":"hook config",configPath:Fe??(Le?te:void 0),configPaths:Q.activeConfigPaths.length>0?Q.activeConfigPaths:void 0,errors:q.length>0?q:void 0}}return{platform:"copilot-cli",status:"n/a",errors:q.length>0?q:void 0}}import{existsSync as Ci,readdirSync as nh,readFileSync as th}from"node:fs";import{join as ki}from"node:path";import{existsSync as bi,mkdirSync as zg,readFileSync as Wg,rmSync as Yg}from"node:fs";import{dirname as Zg,join as no}from"node:path";import{existsSync as Bg,renameSync as Gg,statSync as qg,writeFileSync as Vg}from"node:fs";function an(I,q){let Q=`${I}.${process.pid}.tmp`;Vg(Q,q,Bg(I)?{mode:qg(I).mode&511}:{}),Gg(Q,I)}import{spawn as Kg}from"node:child_process";function Jg(I){return I.join(" ")}function gi(I,q,Q){return[`Failed to run ${Jg(I)}${q===null?"":` (exit ${q})`}.`,Q.trim()].filter(Boolean).join(`
`)}function hi(I){let q={stdout:"",stderr:""};return I.stdout.setEncoding("utf-8"),I.stderr.setEncoding("utf-8"),I.stdout.on("data",(Q)=>{q.stdout+=Q}),I.stderr.on("data",(Q)=>{q.stderr+=Q}),q}function pn(I,q){return new Promise((Q,ne)=>{let te=Wn([...I],process.env),re=Kg(te.cmd,te.args,{stdio:["ignore","pipe","pipe"]}),le=hi(re),ye=()=>[le.stdout,le.stderr].filter(Boolean).join(`
`),ve=q?.timeoutMs??120000,Pe=setTimeout(()=>{re.kill(),ne(Error(gi(I,null,`Timed out after ${ve}ms.
${ye()}`.trim())))},ve);re.on("error",(Ie)=>{clearTimeout(Pe),ne(Error(gi(I,null,`${Ie.message}
${ye()}`.trim())))}),re.on("close",(Ie)=>{if(clearTimeout(Pe),Ie!==0){ne(Error(gi(I,Ie,ye())));return}Q(q?.stdoutOnly?le.stdout:ye())})})}async function yi(I){for(let q of I)await pn(q)}async function $l(I){for(let q of I)try{await pn(q)}catch(Q){console.warn(Q instanceof Error?Q.message:String(Q))}}var bn=Object.fromEntries(ir.map((I)=>[I.id,`npx -y cc-safety-net hook ${I.flags[1]}`]));var fr=bn.cursor,Dl=30;function ro(I){return no(I.home,".cursor","hooks.json")}var pr="cc-safety-net";function wi(I){let q=no(I.home,".cursor","plugins");return{cache:no(q,"cache",pr),marketplaceClone:no(q,"marketplaces","github.com","kenryu42","cc-safety-net")}}async function Nl(I){let q=Object.values(wi(I));if(!q.some((ne)=>bi(ne)))return;let Q="No marketplace matches";return await pn(["cursor-agent","plugin","marketplace","remove",pr]).catch((ne)=>{if(!(ne instanceof Error&&ne.message.includes(Q)))throw ne}),q.forEach((ne)=>Yg(ne,{recursive:!0,force:!0})),[`Removed the ${pr} marketplace from your Cursor account.`,"If /plugins in cursor-agent still lists CC Safety Net as installed, uninstall it there."].join(`
`)}function Zn(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function vi(){return{command:fr,timeout:Dl,failClosed:!0}}function to(I){return Zn(I)&&I.command===fr}function Xg(I){return Object.keys(I).length===3&&I.command===fr&&I.timeout===Dl&&I.failClosed===!0}function Qg(I){try{return JSON.parse(Wg(I,"utf-8"))}catch(q){if(q instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${I}: ${q.message}`);throw q}}function Ll(I){let q=Qg(I);if(!Zn(q))throw Error(`Cursor hooks config ${I} must be a JSON object`);if(q.version!==1)throw Error(`Cursor hooks config ${I} must set "version": 1`);if(q.hooks!==void 0&&!Zn(q.hooks))throw Error(`Cursor hooks config ${I} "hooks" must be an object`);let Q=Zn(q.hooks)?q.hooks.preToolUse:void 0;if(Q!==void 0&&!Array.isArray(Q))throw Error(`Cursor hooks config ${I} "hooks.preToolUse" must be an array`);return q}function jl(I){let q=Zn(I.hooks)?I.hooks.preToolUse:void 0;return Array.isArray(q)?q:[]}function eh(I){if(!I.some(to))return[...I,vi()];return I.reduce((q,Q)=>{if(!to(Q))return q.result.push(Q),q;if(!q.inserted)q.result.push(vi()),q.inserted=!0;return q},{result:[],inserted:!1}).result}function Fl(I,q,Q){let ne=Zn(q.hooks)?q.hooks:{},te={...q,hooks:{...ne,preToolUse:Q}};an(I,`${JSON.stringify(te,null,2)}
`)}function Hl(I){let q=ro(I);if(!bi(q))return zg(Zg(q),{recursive:!0}),an(q,`${JSON.stringify({version:1,hooks:{preToolUse:[vi()]}},null,2)}
`),{path:q,alreadyInstalled:!1};let Q=Ll(q),ne=jl(Q),te=ne.filter(to);if(Zn(Q.hooks)&&Array.isArray(Q.hooks.preToolUse)&&te.length===1&&te[0]!==void 0&&Xg(te[0]))return{path:q,alreadyInstalled:!0};return Fl(q,Q,eh(ne)),{path:q,alreadyInstalled:!1}}function Ml(I){let q=ro(I);if(!bi(q))return{path:q,alreadyInstalled:!1};let Q=Ll(q),ne=jl(Q),te=ne.filter((re)=>!to(re));if(te.length===ne.length)return{path:q,alreadyInstalled:!1};return Fl(q,Q,te),{path:q,alreadyInstalled:!0}}function rh(I){if(!I||typeof I!=="object"||Array.isArray(I))return[];let q=I.hooks;if(!q||typeof q!=="object"||Array.isArray(q))return[];let Q=q.preToolUse;if(!Array.isArray(Q))return[];return Q.filter((ne)=>!!ne&&typeof ne==="object"&&!Array.isArray(ne)&&ne.command===fr)}function oh(I){let q=[];if(I.length>1)q.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let Q=I[0];if(Q&&Q.failClosed!==!0)q.push('Managed hook is missing "failClosed": true; reinstall to repair');if(Q&&Q.timeout!==30)q.push('Managed hook "timeout" is not 30; reinstall to repair');return q}var oo="Claude Code plugin",xi="Cursor plugin";function ih(I){let q=ki(wi(I).cache,pr);if(!Ci(q))return{};try{return{version:nh(q).map((Q)=>ki(q,Q)).find((Q)=>Ci(ki(Q,".cache-complete")))}}catch{return{unreadable:q}}}function sh(I,q){if(q){let te=["Cursor records enabled plugins on your Cursor account, which doctor cannot check, and keeps a plugin's files after it is uninstalled.","Cursor pins marketplace plugins to the commit they were added at, so `cc-safety-net update` cannot update this plugin, while the npx hook (`cc-safety-net install --cursor`) stays current."].join(" ");return{method:xi,configPath:q,duplicate:`The Cursor plugin also runs this check, so every tool call is checked twice. ${te} If the plugin is installed, run \`cc-safety-net uninstall --cursor\`, uninstall CC Safety Net from /plugins in cursor-agent, then run \`cc-safety-net install --cursor\`.`,alone:`${te} If /plugins in cursor-agent does not list CC Safety Net as installed, run \`cc-safety-net install --cursor\`.`}}let Q=ul(I);if(!Q)return;let ne="Cursor runs the Claude Code plugin only while it imports Claude Code plugins, which doctor cannot check.";return{method:oo,configPath:Q,duplicate:`The Claude Code plugin also runs this check in Cursor, so every tool call is checked twice. ${ne} If Cursor runs it, run \`cc-safety-net uninstall --cursor\` to remove this hook.`,alone:`${ne} If it stops, run \`cc-safety-net install --cursor\`.`}}function Ul(I){let q=ah(I),Q=ih(I.environment);if(Q.unreadable)return q.status==="configured"?{...q,errors:[...q.errors??[],`Cannot read ${Q.unreadable}, so doctor cannot tell whether the Cursor plugin also runs this check.`]}:{platform:"cursor",status:"not-inspected"};let ne=sh(I.environment,Q.version);if(!ne)return q;if(q.status==="configured")return{...q,errors:[...q.errors??[],ne.duplicate]};return{platform:"cursor",status:"configured",method:ne.method,configPath:ne.configPath,errors:[...q.errors??[],ne.alone]}}function ah(I){let q=ro(I.environment);if(!Ci(q))return{platform:"cursor",status:"n/a",configPath:q};let Q;try{Q=JSON.parse(th(q,"utf-8"))}catch(re){return{platform:"cursor",status:"n/a",configPath:q,errors:[`Failed to parse Cursor hooks config ${q}: ${re instanceof Error?re.message:String(re)}`]}}let ne=rh(Q);if(ne.length===0)return{platform:"cursor",status:"n/a",configPath:q};let te=oh(ne);return{platform:"cursor",status:"configured",method:"hook config",configPath:q,errors:te.length>0?te:void 0}}import{existsSync as fh}from"node:fs";import{existsSync as ql,mkdirSync as lh,readFileSync as ch}from"node:fs";import{dirname as dh,join as Ri}from"node:path";function Pi(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function Si(I,q){return Pi(I)&&I.command===q}function Bl(I,q){return Pi(I)&&Array.isArray(I.hooks)&&I.hooks.some((Q)=>Si(Q,q))}function Xn(I,q){return{hooks:[{type:"command",command:I,timeout:q}]}}function Dn(I,q){return I.flatMap((Q)=>{if(!Pi(Q)||!Array.isArray(Q.hooks))return[Q];let ne=Q.hooks.filter((te)=>!Si(te,q));if(ne.length===Q.hooks.length)return[Q];return ne.length===0?[]:[{...Q,hooks:ne}]})}function Vt(I,q,Q){let ne=I.filter((te)=>Bl(te,q));return ne.length===1&&JSON.stringify(ne[0])===JSON.stringify(Xn(q,Q))}function Kt(I,q){return I.find((Q)=>Bl(Q,q))}function Jt(I,q,Q){let ne=Array.isArray(I.hooks)?I.hooks.find((te)=>Si(te,q)):void 0;return[...I.matcher===void 0||I.matcher===""||I.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...ne?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...ne?.timeout===Q?[]:[`Managed hook "timeout" is not ${Q}; reinstall to repair`]]}var Qn=bn.devin,io=30,uh={config:{},hooks:{},preToolUse:[]};function so(I,q=process.platform){let Q=q==="win32"?I.env.get("APPDATA")||Ri(I.home,"AppData","Roaming"):I.env.get("XDG_CONFIG_HOME")||Ri(I.home,".config");return Ri(Q,"devin","config.json")}function Gl(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function ph(I){try{return{ok:!0,value:JSON.parse(gn(ch(I,"utf-8")))}}catch(q){return{ok:!1,message:q instanceof Error?q.message:String(q)}}}function Ei(I){let q=ph(I);if(!q.ok)return`Failed to parse Devin CLI config ${I}: ${q.message}`;let Q=q.value;if(!Gl(Q))return`Devin CLI config ${I} must be a JSON object`;let ne=Q.hooks===void 0?{}:Q.hooks;if(!Gl(ne))return`Devin CLI config ${I} "hooks" must be an object`;let te=ne.PreToolUse===void 0?[]:ne.PreToolUse;if(!Array.isArray(te))return`Devin CLI config ${I} "hooks.PreToolUse" must be an array`;return{config:Q,hooks:ne,preToolUse:te}}function Vl(I){let q=Ei(I);if(typeof q==="string")throw Error(q);return q}function Kl(I,q,Q){let ne={...q.config,hooks:{...q.hooks,PreToolUse:Q}};an(I,`${JSON.stringify(ne,null,2)}
`)}function Jl(I){let q=so(I),Q=ql(q)?Vl(q):uh;if(Vt(Q.preToolUse,Qn,io))return{path:q,alreadyInstalled:!0};return lh(dh(q),{recursive:!0}),Kl(q,Q,[...Dn(Q.preToolUse,Qn),Xn(Qn,io)]),{path:q,alreadyInstalled:!1}}function zl(I){let q=so(I);if(!ql(q))return{path:q,alreadyInstalled:!1};let Q=Vl(q),ne=Dn(Q.preToolUse,Qn);if(JSON.stringify(ne)===JSON.stringify(Q.preToolUse))return{path:q,alreadyInstalled:!1};return Kl(q,Q,ne),{path:q,alreadyInstalled:!0}}function Wl(I){let q=so(I.environment);if(!fh(q))return{platform:"devin",status:"n/a",configPath:q};let Q=Ei(q);if(typeof Q==="string")return{platform:"devin",status:"n/a",configPath:q,errors:[Q]};let ne=Kt(Q.preToolUse,Qn);if(!ne)return{platform:"devin",status:"n/a",configPath:q};let te=Jt(ne,Qn,io);return{platform:"devin",status:"configured",method:"hook config",configPath:q,errors:te.length>0?te:void 0}}import{existsSync as wh,readFileSync as kh}from"node:fs";import{existsSync as zt,mkdirSync as mh,readFileSync as gh,rmSync as hh}from"node:fs";import{dirname as yh,join as Ai}from"node:path";var et=bn.droid,ao=30;function lo(I){return Ai(I.home,".factory","hooks.json")}function Yl(I){return Ai(I.home,".factory","settings.json")}function Zl(I){return Ai(I.home,".factory","hooks","hooks.json")}function Ti(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function Xl(I){try{return JSON.parse(gn(gh(I,"utf-8")))}catch(q){if(q instanceof SyntaxError)throw Error(`Failed to parse Factory Droid hooks config ${I}: ${q.message}`);throw q}}function _i(I){let q=Xl(I);if(!Ti(q))throw Error(`Factory Droid hooks config ${I} must be a JSON object`);if(q.PreToolUse===void 0||Array.isArray(q.PreToolUse))return q;throw Error(`Factory Droid hooks config ${I} "PreToolUse" must be an array`)}function vh(I){if(!zt(I))return{};let q=Xl(I);return Ti(q)&&Ti(q.hooks)&&q.hooks.PreToolUse!==void 0?{PreToolUse:q.hooks.PreToolUse}:{}}function bh(I){let q=Zl(I);return{...vh(Yl(I)),...zt(q)?_i(q):{}}}function Ql(I){return Array.isArray(I.PreToolUse)?I.PreToolUse:[]}function ec(I,q,Q){an(I,`${JSON.stringify({...q,PreToolUse:Q},null,2)}
`)}function nc(I){let q=lo(I),Q=zt(q),ne=Q?_i(q):bh(I),te=Ql(ne);if(Q&&Vt(te,et,ao))return{path:q,alreadyInstalled:!0};return mh(yh(q),{recursive:!0}),ec(q,ne,[...Dn(te,et),Xn(et,ao)]),{path:q,alreadyInstalled:!1}}function tc(I){let q=lo(I);if(!zt(q))return{path:q,alreadyInstalled:!1};let Q=_i(q),ne=Ql(Q),te=Dn(ne,et);if(JSON.stringify(te)===JSON.stringify(ne))return{path:q,alreadyInstalled:!1};let re=zt(Yl(I))||zt(Zl(I));if(te.length===0&&Object.keys(Q).length===1&&!re)return hh(q),{path:q,alreadyInstalled:!0};return ec(q,Q,te),{path:q,alreadyInstalled:!0}}function rc(I){let q=lo(I.environment);if(!wh(q))return{platform:"droid",status:"n/a",configPath:q};let Q;try{Q=JSON.parse(gn(kh(q,"utf-8")))}catch(le){return{platform:"droid",status:"n/a",configPath:q,errors:[`Failed to parse Factory Droid hooks config ${q}: ${le instanceof Error?le.message:String(le)}`]}}let ne=typeof Q==="object"&&Q!==null&&"PreToolUse"in Q?Q.PreToolUse:void 0,te=Kt(Array.isArray(ne)?ne:[],et);if(!te)return{platform:"droid",status:"n/a",configPath:q};let re=[...te.commandRegex===void 0||te.commandRegex===""?[]:['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair'],...Jt(te,et,ao)];return{platform:"droid",status:"configured",method:"hook config",configPath:q,errors:re.length>0?re:void 0}}import{existsSync as Ch}from"node:fs";import{join as Ii}from"node:path";var Oi="gemini-safety-net";function $i(I){let q=Ii(I.home,".gemini","extensions"),Q=Ii(q,Oi);if(!Ch(Q))return{platform:"gemini-cli",status:"n/a"};let ne=Ii(q,"extension-enablement.json"),te=b(ne);if(te.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let re=te.kind==="ok"?n(n(te.value,Oi),"overrides"):void 0;if(Array.isArray(re)&&re.some((ye)=>typeof ye==="string"&&ye.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:ne,errors:[`${Oi} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:Q}}function oc(I){return $i(I.environment)}import{existsSync as Rh,readFileSync as fc,statSync as Eh}from"node:fs";import{dirname as pc,join as Th}from"node:path";import{existsSync as sc,mkdirSync as xh,readFileSync as ac,rmSync as Ph}from"node:fs";import{dirname as Sh,join as ic}from"node:path";var Un=bn["grok-build"],uo=30,Di=Xn(Un,uo);function po(I){return ic(I.env.get("GROK_HOME")??ic(I.home,".grok"),"hooks","cc-safety-net.json")}function fo(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function lc(I){try{let q=JSON.parse(I);return fo(q)?q:null}catch{return null}}function cc(I){let q=fo(I.hooks)?I.hooks.PreToolUse:void 0;return Array.isArray(q)?q:[]}function co(I,q,Q){let ne=fo(q.hooks)?q.hooks:{};an(I,`${JSON.stringify({...q,hooks:{...ne,PreToolUse:Q}},null,2)}
`)}function dc(I){let q=po(I);if(!sc(q))return xh(Sh(q),{recursive:!0}),co(q,{},[Di]),{path:q,alreadyInstalled:!1};let Q=lc(ac(q,"utf-8"));if(!Q)return co(q,{},[Di]),{path:q,alreadyInstalled:!1};let ne=cc(Q);if(Vt(ne,Un,uo))return{path:q,alreadyInstalled:!0};return co(q,Q,[...Dn(ne,Un),Di]),{path:q,alreadyInstalled:!1}}function uc(I){let q=po(I);if(!sc(q))return{path:q,alreadyInstalled:!1};let Q=lc(ac(q,"utf-8"));if(!Q)return{path:q,alreadyInstalled:!1};let ne=cc(Q),te=Dn(ne,Un);if(JSON.stringify(te)===JSON.stringify(ne))return{path:q,alreadyInstalled:!1};let re=fo(Q.hooks)?Q.hooks:{};if(te.length===0&&Object.keys(Q).length===1&&Object.keys(re).length===1)return Ph(q),{path:q,alreadyInstalled:!0};return co(q,Q,te),{path:q,alreadyInstalled:!0}}function Ni(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}function Ah(I){try{return Eh(I,{throwIfNoEntry:!1})?.isFile()===!0?fc(I,"utf-8"):""}catch{return}}function mc(I){let q=po(I.environment);if(!Rh(q))return{platform:"grok-build",status:"n/a",configPath:q};let Q;try{Q=JSON.parse(fc(q,"utf-8"))}catch($e){return{platform:"grok-build",status:"n/a",configPath:q,errors:[`Failed to parse Grok Build hooks config ${q}: ${$e instanceof Error?$e.message:String($e)}`]}}let ne=Ni(Q)&&Ni(Q.hooks)&&Array.isArray(Q.hooks.PreToolUse)?Q.hooks.PreToolUse:[],te=Kt(ne,Un);if(!te)return{platform:"grok-build",status:"n/a",configPath:q};let re=Array.isArray(te.hooks)?te.hooks.findIndex(($e)=>Ni($e)&&$e.command===Un):-1,le=`global/cc-safety-net:pre_tool_use[${ne.indexOf(te)}].hooks[${re}]`,ye=Th(pc(pc(q)),"disabled-hooks"),ve=Ah(ye),Pe=ve?.split(`
`).some(($e)=>$e.trim()===le)===!0,Ie=[...ve===void 0?[`Cannot read ${ye}, so doctor cannot tell whether Grok Build skips the hook`]:[],...Pe?[`Grok Build skips the hook: ${le} is listed in ${ye}; enable it in /hooks`]:[],...Jt(te,Un,uo)];return{platform:"grok-build",status:Pe?"disabled":"configured",method:"hook config",configPath:q,errors:Ie.length>0?Ie:void 0}}import{readFileSync as xc}from"node:fs";import{join as Pc}from"node:path";var Cn="cc-safety-net",Li="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",_h=30;function gc(I){return`${Li}
# version: ${I}
`}function Ih(I){return`${gc(I)}name: ${Cn}
version: "${I}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function Oh(I){return`${gc(I)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${bn["hermes-agent"].split(" ").map((q)=>`"${q}"`).join(", ")}]
TIMEOUT_SECONDS = ${_h}


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
`}function mr(I){return[{name:"__init__.py",content:Oh(I)},{name:"plugin.yaml",content:Ih(I)}]}import{mkdirSync as $h,readdirSync as Dh,readFileSync as hc,rmSync as ji}from"node:fs";import{basename as Nh,dirname as Lh,join as Nn}from"node:path";var jh="__pycache__",Fh=/^[a-z0-9][a-z0-9_-]{0,63}$/;function Hh(I){try{return hc(I,"utf-8").trim()}catch{return}}function Fi(I){let q=I.env.get("HERMES_HOME")?.trim();if(q&&Nh(Lh(q))==="profiles")return q;let Q=q||Nn(I.home,".hermes"),ne=Nn(Q,"active_profile"),te=Hh(ne),re=te?.toLowerCase();if(!re||re==="default")return Q;if(!Fh.test(re))throw Error(`Invalid Hermes profile name "${te}" in ${ne}; run \`hermes profile use <name>\` with a valid profile.`);return Nn(Q,"profiles",re)}function Hi(I){return Nn(Fi(I),"plugins",Cn)}function Mi(I){return I.startsWith(Li)}function Ui(I,q){let Q=Hi(I),ne=u(Q);if(ne&&(ne.isSymbolicLink()||!ne.isDirectory()))throw Error(`Refusing to ${q} ${Q}: not a regular directory. Move or remove it and rerun ${q==="install"?"install":"uninstall"} --hermes-agent.`);return Q}function yc(I,q){let Q=u(I);if(!Q)return;if(Q.isSymbolicLink()||!Q.isFile())throw Error(`Refusing to ${q} ${I}: not a regular file. Move or remove it.`);let ne=hc(I,"utf-8");if(!Mi(ne))throw Error(`Refusing to ${q} unmanaged file at ${I}. Move or remove it.`);return ne}function vc(I){let q=Ui(I,"install"),Q=mr(un());if(Q.map((te)=>yc(Nn(q,te.name),"overwrite")).every((te,re)=>te===Q[re]?.content))return{path:q,alreadyInstalled:!0};return $h(q,{recursive:!0}),Q.forEach((te)=>{an(Nn(q,te.name),te.content)}),{path:q,alreadyInstalled:!1}}function Bi(I){let q=Ui(I,"remove");if(!u(q))return[];return mr(un()).filter((Q)=>yc(Nn(q,Q.name),"remove")!==void 0)}function bc(I){let q=Ui(I,"remove");if(!u(q))return{path:q,alreadyInstalled:!1};let Q=Bi(I);if(Q.forEach((ne)=>{ji(Nn(q,ne.name))}),ji(Nn(q,jh),{recursive:!0,force:!0}),Dh(q).length===0)ji(q,{recursive:!0});return{path:q,alreadyInstalled:Q.length>0}}var gr="hermes-agent",wc=/^([^\s#][^:]*):/,Mh=/^\s+([A-Za-z_][\w-]*):/,kc=/^\s+-\s*(.*)$/;function Uh(I){return I.trim().replace(/^(["'])(.*)\1$/,"$2")}function Bh(I){let q=I.split(/\r?\n/),Q=q.findIndex((re)=>wc.exec(re)?.[1]?.trim()==="plugins");if(Q===-1)return[];let ne=q.slice(Q+1),te=ne.findIndex((re)=>wc.test(re));return te===-1?ne:ne.slice(0,te)}function Cc(I,q){let Q=Bh(I),ne=Q.findIndex((le)=>Mh.exec(le)?.[1]===q);if(ne===-1)return[];let te=Q.slice(ne+1),re=te.findIndex((le)=>!kc.test(le));return(re===-1?te:te.slice(0,re)).map((le)=>Uh(kc.exec(le)?.[1]??""))}function Gh(I){try{return xc(Pc(Fi(I),"config.yaml"),"utf-8")}catch{return}}function Gi(I){let q=Gh(I)??"";return Cc(q,"enabled").includes(Cn)&&!Cc(q,"disabled").includes(Cn)}function Sc(I){return/^# version:\s*(.+)$/m.exec(I)?.[1]?.trim()}function qh(I,q){let Q=u(I);if(!Q)return{error:`${q.name} is missing from ${I}; run install --hermes-agent`};if(Q.isSymbolicLink()||!Q.isFile())return{error:`${I} is a symlink or not a regular file; move or remove it`};try{let ne=xc(I,"utf-8");if(!Mi(ne))return{error:`Unmanaged ${q.name} occupies ${I}; move or remove it`};if(Sc(ne)===un()&&ne!==q.content)return{error:`Modified ${q.name} occupies ${I}; run install --hermes-agent to restore it`};return{content:ne}}catch(ne){return{error:`Failed to read ${I}: ${ne instanceof Error?ne.message:String(ne)}`}}}function Vh(I){try{return{path:Hi(I)}}catch(q){return{error:q instanceof Error?q.message:String(q)}}}function Rc(I){let q=Vh(I.environment);if("error"in q)return{platform:gr,status:"n/a",errors:[q.error]};let Q=q.path,ne=Be(gr,Q);if(ne)return ne;let te=mr(un()).map((ve)=>qh(Pc(Q,ve.name),ve)),re=te.flatMap((ve)=>("error"in ve)?[ve.error]:[]);if(re.length>0)return{platform:gr,status:"n/a",configPath:Q,errors:re};let le=te.some((ve)=>("content"in ve)&&Sc(ve.content)!==un()),ye=le?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!Gi(I.environment))return{platform:gr,status:"disabled",method:"plugin directory",configPath:Q,errors:[`${Cn} is not enabled in Hermes; run \`hermes plugins enable ${Cn}\``,...ye]};return{platform:gr,status:"configured",method:"plugin directory",configPath:Q,errors:le?ye:void 0}}import{existsSync as Kh,readFileSync as Jh}from"node:fs";import{join as Ki}from"node:path";var zh=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/,qi="cc-safety-net",go="plugin config",Wh=new Set(["event","matcher","command","timeout"]),Yh=new Set(["PreToolUse","PostToolUse","PostToolUseFailure","PermissionRequest","PermissionResult","UserPromptSubmit","UserPromptQueued","TurnStarted","Stop","StopFailure","Interrupt","SessionStart","SessionEnd","SessionHeartbeat","SubagentStart","SubagentStop","TaskStarted","PreCompact","PostCompact","Notification"]);function Ec(I){return I.env.get("KIMI_CODE_HOME")||Ki(I.home,".kimi-code")}function mo(I,q){let Q=[""],ne="",te=0;for(let re=0;re<I.length;re++){let le=I[re];if(ne!==""){let ye=ne==='"'&&le==="\\"?I[++re]??"":"";if(Q[Q.length-1]+=le+ye,ye===""&&le===ne)ne="";continue}if(le==="#"){let ye=I.indexOf(`
`,re);re=(ye===-1?I.length:ye)-1;continue}if(le===q&&te===0){Q.push("");continue}if(le==='"'||le==="'")ne=le;if(le==="["||le==="{")te++;if(le==="]"||le==="}")te--;Q[Q.length-1]+=le}return Q.map((re)=>re.trim()).filter((re)=>re!=="")}function Tc(I){let q=/^(?:"([^"]*)"|'([^']*)'|([^\s="']+))\s*=\s*([\s\S]+)$/.exec(I);return q?{key:q[1]??q[2]??q[3]??"",value:q[4]??""}:void 0}function Vi(I){return I===void 0?void 0:/^("""|'''|"|')([\s\S]*)\1$/.exec(I)?.[2]}function Zh(I){let q=I.split(/(?=^\s*\[)/m),Q=q.filter((ne)=>!/^\s*\[/.test(ne)).flatMap((ne)=>mo(ne,`
`)).map(Tc).find((ne)=>ne?.key==="hooks")?.value;if(Q!==void 0)return mo(Q.slice(1,-1),",").map((ne)=>mo(ne.slice(1,-1),","));return q.filter((ne)=>/^\s*\[\[hooks]]/.test(ne)).map((ne)=>mo(ne.replace(/^\s*\[\[hooks]]/,""),`
`))}function Xh(I){let q=I.map(Tc),Q=I.find((Ie,$e)=>q[$e]===void 0),ne=q.find((Ie)=>Ie!==void 0&&!Wh.has(Ie.key))?.key,te=q.find((Ie,$e)=>Ie!==void 0&&q.findIndex((Le)=>Le?.key===Ie.key)<$e)?.key,re=(Ie)=>q.find(($e)=>$e?.key===Ie)?.value,le=re("matcher"),ye=re("timeout"),ve=Number(ye?.replace(/(?<=[\da-f])_(?=[\da-f])/gi,""));return[[Q!==void 0,`"${Q}" is not a key = value pair`],[ne!==void 0,`unknown key "${ne}"`],[te!==void 0,`duplicate key "${te}"`],[!Yh.has(Vi(re("event"))??""),'"event" is not a Kimi Code hook event'],[le!==void 0&&Vi(le)===void 0,'"matcher" is not a string'],[!Vi(re("command")),'"command" is missing or empty'],[ye!==void 0&&!(Number.isInteger(ve)&&ve>=1&&ve<=600),'"timeout" is not an integer from 1 to 600']].find(([Ie])=>Ie)?.[1]}function Qh(I){let q=Ki(Ec(I),"plugins","installed.json"),Q=b(q);if(Q.kind==="missing")return;let ne=Q.kind==="ok"?n(Q.value,"plugins"):void 0;if(!Array.isArray(ne))return{platform:"kimi-code",status:"n/a",configPath:q,errors:[`Cannot read ${q}, so doctor cannot tell whether the Kimi Code plugin is installed`]};let te=ne.find((re)=>n(re,"id")===qi);if(te===void 0)return;if(n(te,"enabled")!==!0)return{platform:"kimi-code",status:"disabled",method:go,configPath:q,errors:[`${qi} is installed but not enabled in Kimi Code; run /plugins enable ${qi}`]};return{platform:"kimi-code",status:"configured",method:go,configPath:q}}function ho(I){let q=Ki(Ec(I.environment),"config.toml"),Q=()=>Qh(I.environment)??{platform:"kimi-code",status:"n/a",configPath:q};if(!Kh(q))return Q();let ne;try{ne=Jh(q,"utf-8")}catch(le){return{platform:"kimi-code",status:"n/a",configPath:q,errors:[`Failed to read ${q}: ${le instanceof Error?le.message:String(le)}`]}}if(!zh.test(ne))return Q();let re=(/"""|'''/.test(ne)?[]:Zh(ne)).flatMap((le,ye)=>{let ve=Xh(le);return ve===void 0?[]:[`Kimi Code ignores every hook because hooks entry ${ye+1} is invalid (${ve}); fix it in ${q}`]});return{platform:"kimi-code",status:re.length>0?"disabled":"configured",method:"hook config",configPath:q,errors:re.length>0?re:void 0}}import{readFileSync as jc}from"node:fs";import{join as yr}from"node:path";var dn="cc-safety-net",kn="index.js",Wt="openclaw.plugin.json",Yt="package.json";var yo="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as ey,lstatSync as ny,readdirSync as ty,readFileSync as ry}from"node:fs";import{dirname as Ac,join as Bn}from"node:path";import{fileURLToPath as oy}from"node:url";var Ji=Bn("openclaw",dn),st=`run \`openclaw plugins enable ${dn}\``,iy="config reload superseded by a newer runtime config source",sy=[kn,Wt,Yt];function _c(I){let q=I.env.get("OPENCLAW_HOME")?.trim();return q?W(q,I.home):I.home}function Ic(I){let q=_c(I),Q=I.env.get("OPENCLAW_STATE_DIR")?.trim();if(Q)return W(Q,q);let ne=I.env.get("OPENCLAW_CONFIG_PATH")?.trim();return ne?Ac(W(ne,q)):Bn(q,".openclaw")}function Oc(I){let q=I.env.get("OPENCLAW_CONFIG_PATH")?.trim();return q?W(q,_c(I)):Bn(Ic(I),"openclaw.json")}function hr(I){return Bn(Ic(I),"extensions",dn)}function ay(I){let q=ty(I);if(q.length===0)return!0;if(q.some((te)=>!sy.includes(te)))return!1;let Q=Bn(I,kn),ne=u(Q);return ne!==void 0&&!ne.isSymbolicLink()&&ne.isFile()&&ry(Q,"utf-8").startsWith(yo)}function zi(I){let q=hr(I),Q=u(q);if(!Q)return;if(!Q.isSymbolicLink()&&Q.isDirectory()&&ay(q))return;throw Error(`Refusing to modify ${q}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function $c(){let I=Ac(oy(import.meta.url));return[Bn(I,Ji),Bn(I,"..",Ji),Bn(I,"..","..","..","dist",Ji)]}function Wi(I=$c()){return I.find((q)=>ey(q)&&ny(q).isDirectory())}function ly(I=$c()){let q=Wi(I);if(!q)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return q}function Dc(I=ly()){return[["openclaw","plugins","install",I,"--force","--accept-capabilities"]]}function cy(I){let q=(()=>{try{return JSON.parse(I)}catch{return}})(),Q=n(n(q,"plugin"),"status");return typeof Q==="string"?Q:void 0}async function dy(){await pn(["openclaw","plugins","enable",dn]).catch((I)=>{if(!(I instanceof Error&&I.message.includes(iy)))throw I})}async function Nc(I){let q=async()=>cy(await pn(["openclaw","plugins","inspect",dn,"--runtime","--json"],{stdoutOnly:!0})),Q=await q(),ne=Q==="disabled"&&I;if(ne)await dy();let te=ne?await q():Q;if(te==="loaded")return;throw Error(`${te===void 0?`The ${dn} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:te==="disabled"?`OpenClaw reports the ${dn} plugin with status "disabled"; ${st}.`:`OpenClaw reports the ${dn} plugin with status "${te}".`} Run \`openclaw plugins inspect ${dn} --runtime\` for details.`)}var vo="openclaw";function Zt(I,q){let Q=yr(I,q),ne=u(Q);if(!ne)return{error:`${q} is missing from ${Q}; run install --openclaw`};if(ne.isSymbolicLink()||!ne.isFile())return{error:`${Q} is a symlink or not a regular file; move or remove it`};try{return{content:jc(Q,"utf-8")}}catch(te){return{error:`Failed to read ${Q}: ${te instanceof Error?te.message:String(te)}`}}}function Fc(I){try{return JSON.parse(gn(I))}catch{return}}function uy(I){let q=Zt(I,Wt);if("error"in q)return q.error;if(n(Fc(q.content),"id")===dn)return;return`${yr(I,Wt)} is not a valid ${dn} manifest; run install --openclaw`}function py(I){let q=Zt(I,Yt);if("error"in q)return q.error;let Q=n(n(Fc(q.content),"openclaw"),"extensions");if(Array.isArray(Q)&&Q.includes(`./${kn}`))return;return`${yr(I,Yt)} does not point OpenClaw at ${kn}; run install --openclaw`}function Lc(I){return Array.isArray(I)?I.filter((q)=>typeof q==="string"):[]}function fy(I){let q=Oc(I);if(!u(q))return`${dn} is not enabled; ${st}`;let Q=(()=>{try{return JSON.parse(gn(jc(q,"utf-8")))}catch{return}})();if(Q===void 0)return`Failed to read ${q}; fix it, then ${st}`;let ne=n(Q,"plugins");if(n(ne,"enabled")===!1)return`plugins.enabled is false in ${q}; no OpenClaw plugin loads`;let te=n(n(n(ne,"entries"),dn),"enabled");if(Lc(n(ne,"deny")).includes(dn)||te===!1)return`${dn} is disabled in ${q}; ${st}`;let re=Lc(n(ne,"allow"));if(re.length>0&&!re.includes(dn))return`plugins.allow in ${q} does not list ${dn}; add it, then ${st}`;if(re.includes(dn)||te===!0)return;return`${dn} is not enabled; ${st}`}function Hc(I){return/^\/\/ version:\s*(.+)$/m.exec(I)?.[1]?.trim()}function my(I,q,Q){if(Q===void 0)return[];let ne=Zt(Q,kn);if(!(("content"in ne)&&Hc(ne.content)===q))return[];return[kn,Wt,Yt].flatMap((re)=>{let le=Zt(I,re),ye=Zt(Q,re);if("error"in le||"error"in ye||le.content===ye.content)return[];return[`Modified ${re} occupies ${yr(I,re)}; run install --openclaw to restore it`]})}function Mc(I){let q=hr(I.environment),Q=Be(vo,q);if(Q)return Q;let ne=Zt(q,kn),re=["error"in ne?ne.error:ne.content.startsWith(yo)?void 0:`Unmanaged ${kn} occupies ${yr(q,kn)}; move or remove it`,uy(q),py(q)].filter((Ie)=>Ie!==void 0),le="content"in ne?Hc(ne.content):void 0,ye=re.length>0?re:my(q,le,Wi());if(ye.length>0)return{platform:vo,status:"n/a",configPath:q,errors:ye};let ve=le===un()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],Pe=fy(I.environment);if(Pe)return{platform:vo,status:"disabled",method:"plugin directory",configPath:q,errors:[Pe,...ve]};return{platform:vo,status:"configured",method:"plugin directory",configPath:q,errors:ve.length>0?ve:void 0}}import{existsSync as xy,readFileSync as Py}from"node:fs";import{basename as Sy}from"node:path";import{existsSync as bo,readFileSync as Zi,rmSync as gy}from"node:fs";import{join as Tn}from"node:path";import{pathToFileURL as hy}from"node:url";var vr="cc-safety-net",at=`${vr}@latest`,Xi=["opencode.json","opencode.jsonc"],yy=60,vy=250,Uc="CCSafetyNetPlugin",by={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function Bc(I){return Tn(I.env.get("XDG_CONFIG_HOME")||Tn(I.home,".config"),"opencode")}function Qi(I){return I.env.get("OPENCODE_CONFIG_DIR")||Bc(I)}function es(I){return Xi.map((q)=>Tn(Qi(I),q))}function ns(I){return[...new Set([Qi(I),Bc(I)])].flatMap((q)=>Xi.map((Q)=>Tn(q,Q)))}function Gc(I){return Tn(I.env.get("XDG_CACHE_HOME")||Tn(I.home,".cache"),"opencode","packages",at)}function qc(I){gy(Gc(I),{recursive:!0,force:!0})}async function Vc(I){let q=(await pn(["opencode","--version"],{stdoutOnly:!0})).trim(),Q=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(q),ne=Number(Q?.[1]),te=Number(Q?.[2]),re=Number(Q?.[3]);if(!Q||ne!==1&&ne!==2||ne===1&&(te<18||te===18&&re<29)||ne===2&&te===0&&re<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${q||"an unknown version"}.`);if(ne===2){for(let le of es(I)){if(!bo(le))continue;let ye=rs(Zi(le,"utf-8"),le);if(["plugin","plugins"].some((Pe)=>{let Ie=n(ye,Pe);return Array.isArray(Ie)&&Ie.some(($e)=>wo($e)&&(typeof $e==="string"?$e:n($e,"package"))!==at)}))throw Error(`Change the cc-safety-net package spec in ${le} to ${at}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[],afterInstall:async()=>{if((await pn(["opencode","plugin","add",at],{stdoutOnly:!0})).includes("is already configured in"))await Yi(),await pn(["opencode","plugin","update",at]);let ye=await Yi();if(!/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(ye))throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.");let ve=["--param",`location[directory]=${process.cwd()}`];await pn(["opencode","api","integration.list",...ve]);let Pe=await pn(["opencode","api","plugin.list",...ve],{stdoutOnly:!0}),Ie=ts(Pe);if(Ie)throw Error(Ie);if(!Kc(Pe).some(Jc))throw Error("OpenCode lists no active cc-safety-net for this directory. Run `opencode api plugin.list` for details.")}}}return qc(I),{commands:[["opencode","plugin","-g","-f",at]],afterInstall:()=>ky(I)}}function Kc(I){return wy(I).filter((q)=>n(q,"id")===vr||wo(n(n(q,"source"),"target"))).map((q)=>n(q,"state"))}function Jc(I){return n(I,"status")==="active"}function ts(I){let q=Kc(I);if(q.some(Jc))return;let Q=q.find((ne)=>n(ne,"status")==="failed");if(!Q)return;return`OpenCode reports cc-safety-net failed: ${String(n(Q,"error")).split(`
`)[0]}`}function wy(I){if(!I)return[];try{let q=n(JSON.parse(I),"data");return Array.isArray(q)?q:[]}catch{return[]}}async function Yi(I=1){let q=await pn(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s|\scc-safety-net@latest\s*$/m.test(q)||I===yy)return q;return await new Promise((Q)=>setTimeout(Q,vy)),Yi(I+1)}async function ky(I){let q=Tn(Gc(I),"node_modules",vr),Q=Tn(q,"package.json");if(!bo(Q))throw Error(`The OpenCode plugin cache at ${q} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${at}\` for details.`);let ne=n(JSON.parse(Zi(Q,"utf-8")),"main");if(typeof ne!=="string")throw Error(`The cached OpenCode plugin at ${q} declares no "main" entry.`);let te=Tn(q,ne);if(typeof(await import(hy(te).href))[Uc]==="function")return;throw Error(`The cached OpenCode plugin at ${te} does not export a callable ${Uc}, so OpenCode would load nothing and fail open.`)}function rs(I,q){try{return JSON.parse(gn(I))}catch(Q){if(Q instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${q}: ${Q.message}`);throw Q}}function wo(I){let q=typeof I==="string"?I:n(I,"package");return typeof q==="string"&&(q===vr||q.startsWith(`${vr}@`))}function os(I){return["plugin","plugins"].some((q)=>{let Q=n(I,q);return Array.isArray(Q)&&Q.some(wo)})}function Cy(I,q){let ne=["plugin","plugins"].flatMap((te)=>{let re=bl(I,te,by);if(!re)return[];let le=[],ye=0,ve=re.start+1,Pe=I.slice(re.start+1,re.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let Ie of Pe){if(Ie[0].startsWith("//")||Ie[0].startsWith("/*"))continue;let $e=re.start+1+Ie.index;if(ye===0)ve=$e;if(Ie[0]==="{"||Ie[0]==="[")ye++;if(Ie[0]==="}"||Ie[0]==="]")ye--;if(ye!==0||Ie[0]===",")continue;let Le=$e+Ie[0].length;if(wo(JSON.parse(gn(I.slice(ve,Le)))))le.push({start:ve,end:Le})}return le}).sort((te,re)=>te.start-re.start).reverse().reduce((te,re)=>{let le=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(te.slice(re.end));if(le?.[0].includes("/")){let ye=re.end+le[0].length-1;return te.slice(0,re.start)+te.slice(re.end,ye)+te.slice(ye+1)}return vl(te,re)},I);return rs(ne,q),ne}function zc(I){qc(I);let q=ns(I),Q=q.find((re)=>bo(re)),ne=[],te=[];for(let re of q){if(!bo(re))continue;try{let le=Zi(re,"utf-8");if(!os(rs(le,re)))continue;an(re,Cy(le,re)),te.push(re)}catch(le){ne.push(le instanceof Error?le.message:String(le))}}if(ne.length>0)throw Error(ne.join(`
`));return{path:te[0]??Q??Tn(Qi(I),Xi[0]),alreadyInstalled:te.length>0}}function Xt(I){let q=[];for(let Q of I.openCodeVersion?.startsWith("2.")?es(I.environment):ns(I.environment))if(xy(Q))try{let ne=Py(Q,"utf-8"),te=gn(ne),re=JSON.parse(te);if(os(re)){let le=ts(I.openCodePluginListOutput);if(le)return{platform:"opencode",status:"disabled",method:"opencode api plugin.list",configPath:Q,errors:[...q,le]};return{platform:"opencode",status:"configured",method:"plugin array",configPath:Q,errors:q.length>0?q:void 0}}}catch(ne){q.push(`Failed to parse ${Sy(Q)}: ${ne instanceof Error?ne.message:String(ne)}`)}return{platform:"opencode",status:"n/a",errors:q.length>0?q:void 0}}import{join as Wc}from"node:path";var Zc="dist/pi/index.js",Yc=new Set([Zc,"index.js"]),Ry=/[*?[\]{}]/;function is(I){let q=I.env.get("PI_CODING_AGENT_DIR");return Wc(q?W(q,I.home):Wc(I.home,".pi","agent"),"settings.json")}function ss(I){if(typeof I!=="string")return!1;return I==="npm:cc-safety-net"||I.startsWith("npm:cc-safety-net@")}function Ey(I){if(!Array.isArray(I)||I.length===0)return!1;if(!I.every((ne)=>typeof ne==="string"))return!1;let q=(ne)=>I.some((te)=>te.startsWith(ne)&&te.slice(1).replace(/^\.[/\\]/,"")===Zc);if(q("-"))return!1;if(q("+"))return!0;let Q=I.filter((ne)=>!/^[-+!]/.test(ne));return(Q.length===0||Q.some((ne)=>Yc.has(ne)))&&!I.some((ne)=>ne.startsWith("!")&&(Yc.has(ne.slice(1))||Ry.test(ne)))}function Xc(I){let q=is(I.environment),Q=b(q);if(Q.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(Q.kind==="missing")return{platform:"pi",status:"n/a"};let ne=n(Q.value,"packages");if(!Array.isArray(ne))return{platform:"pi",status:"n/a"};let te=ne.find((le)=>ss(typeof le==="string"?le:n(le,"source")));if(te===void 0)return{platform:"pi",status:"n/a"};let re=n(te,"extensions");if(re!==void 0&&!Ey(re))return{platform:"pi",status:"disabled",method:"package config",configPath:q,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:q}}var Ty={amp:rl,"antigravity-cli":al,"claude-code":pl,codex:ml,"copilot-cli":Ol,cursor:Ul,"deepseek-harness":Rt,devin:Wl,droid:rc,"gemini-cli":oc,"grok-build":mc,"hermes-agent":Rc,"kimi-code":ho,openclaw:Mc,opencode:Xt,pi:Xc};function Qt(I,q,Q){let ne={...Q,cwd:q,environment:I};return Or.map((te)=>Ay(Ty[te](ne)))}function Ay(I){if(I.status==="not-inspected")return{platform:I.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:I.platform,detected:I.status!=="n/a",configured:I.status==="configured",inspectionStatus:I.status!=="n/a"?"verified":I.errors&&I.errors.length>0?"failed":"not-applicable",method:I.method,configPath:I.configPath,configPaths:I.configPaths,errors:I.errors}}import{join as _y}from"node:path";var Iy=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),Oy=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),heredocDataWrappers:Object.freeze([]),commandTools:Object.freeze([]),safety:Object.freeze({level:"standard"}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),$y={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function Qc(I){let q=_y(I.tmpdir,"cc-safety-net-self-test"),Q=Iy.map((ne)=>{let te=z(I,d("self-test",{command:ne.command},{kind:"command",shell:"auto"},{configCwd:q,executionCwd:q},ne.command),{guard:{dependencies:{loadPolicySnapshot:()=>Oy,getModes:()=>$y,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),re=ne.expectBlocked?"blocked":"allowed",le=te.decision.kind==="deny"?"blocked":"allowed";return{command:ne.command,description:ne.description,expected:re,actual:le,passed:re===le,reason:te.decision.kind==="deny"?te.decision.reason:void 0,ruleId:te.decision.kind==="deny"?te.decision.ruleId:void 0}});return{passed:Q.filter((ne)=>ne.passed).length,failed:Q.filter((ne)=>!ne.passed).length,total:Q.length,results:Q}}function as(I){let q=fn({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},I);if(In(q.errors))return null;return{json:q.flags.json,skipUpdateCheck:q.flags.skipUpdateCheck}}async function ed(I,q={}){let Q=await ar(!q.json,()=>{let ne=Ny(I,q);return{ready:ne,finish:()=>ne}},()=>sr(),{loadingMessage:"Checking system status…"});if(q.json)console.log(JSON.stringify(Q,null,2));else Ly(Q);return Q.engineSelfTest.failed>0||Q.findings.some((ne)=>ne.severity==="error")?1:0}async function Ny(I,q){let Q=q.cwd??process.cwd(),ne=await Mr((Me)=>Xt({environment:I,cwd:Q,openCodeVersion:Me}).status!=="n/a",void 0,Q),te=Qt(I,Q,{ampPluginListOutput:ne.ampPluginListOutput,codexPluginListOutput:ne.codexPluginListOutput,copilotCliVersion:ne.versions["copilot-cli"],openCodeVersion:ne.versions.opencode,openCodePluginListOutput:ne.openCodePluginListOutput}),re=wa(I,Q),le=ka(I),ye=w(I,{cwd:Q}),ve=ye.policy,Pe=O(ve,I.env),Ie=X(ve,Pe.capabilities),$e=Lr(I,7),Le=Xa(I,Q),Fe=[Ut(Q),Bt(I)].filter((Me)=>Dy(Me)),Ne=q.skipUpdateCheck?{currentVersion:un(),latestVersion:null,updateAvailable:!1}:await Mn(),Ve={hooks:te,engineSelfTest:Qc(I),userConfig:re.userConfig,projectConfig:re.projectConfig,configState:nt(ye),effectiveRules:re.effectiveRules,environment:le,effectiveSafety:{selectedPreset:ve.safety.level,level:Pe.effectiveLevel,capabilities:Pe.capabilities,ruleOverrides:ve.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(Ie).filter(([,Me])=>Me.source==="rule_override"&&Me.override==="off"&&Me.inheritedEnabled&&Me.changesInherited).map(([Me])=>Me),ruleCounts:{stored:Object.keys(ve.destructiveCommandRuleOverrides).length,effective:Object.values(Ie).filter((Me)=>Me.changesInherited).length},...ye.policyScopes?{policyScopes:ye.policyScopes}:{}},...Le.length>0?{v2Leftovers:Le}:{},...Fe.length>0?{legacyConfigs:Fe}:{},posture:Na(I,re.userConfig.path),activity:$e,update:Ne,system:ne};return{...Ve,findings:xa(Ve)}}function Ly(I){console.log(),console.log(Sa(I.hooks)),console.log(),console.log(Ra(I.engineSelfTest)),console.log(),console.log(Ea(I)),console.log(),console.log(Ta(I.environment)),console.log(),console.log(Aa(I)),console.log(),console.log(_a(I.findings)),console.log(),console.log(Ia(I.activity)),console.log(),console.log($a(I.system)),console.log(),console.log(Oa(I.update)),console.log(Da(I))}import{existsSync as jy}from"node:fs";var Fy=/^[A-Za-z0-9_@%+=:,./-]+$/,ls="Usage: cc-safety-net explain [--json] [--cwd <path>] [--shell <auto|posix|powershell>] <command>",Hy=["auto","posix","powershell"];function cs(I){let q=fn({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"],shell:["--shell"]},positionals:"tail"},I);if(In(q.errors))return console.error(ls),console.error("Pass -- before a command that starts with dashes."),null;if(q.values.cwd!==void 0&&!jy(q.values.cwd))return console.error(`Error: --cwd path does not exist: ${q.values.cwd}`),null;let Q=Hy.find((te)=>te===q.values.shell);if(q.values.shell!==void 0&&!Q)return console.error(`Error: --shell must be auto, posix, or powershell, got: ${q.values.shell}`),console.error(ls),null;let ne=q.positionals.length===1?q.positionals[0]:q.positionals.map((te)=>Fy.test(te)?te:`'${te.replaceAll("'",Q==="powershell"?"''":"'\\''")}'`).join(" ");if(!ne)return console.error("Error: No command provided"),console.error(ls),null;return{json:q.flags.json,cwd:q.values.cwd,shell:Q,command:ne}}function nd(I){if(I)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function td(I,q){let ne=q-18;return[`${I.dtl}${I.dh.repeat(q)}${I.dtr}`,`${I.dv}  Command Analysis${" ".repeat(ne)}${I.dv}`,`${I.dbl}${I.dh.repeat(q)}${I.dbr}`]}function ds(I){return JSON.stringify(I)}function rd(I,q=0){return`[${I.map((ne,te)=>Pa(ne,te,q)).join(",")}]`}function br(I,q,Q=70){let ne=I.split(" "),te=[],re="";for(let le of ne)if(re&&re.length+le.length+1>Q)te.push(re),re=le;else re=re?`${re} ${le}`:le;if(re)te.push(re);return te.map((le,ye)=>ye===0?le:`${q}${le}`)}function od(I,q,Q){let ne=[];switch(I.type){case"parse":return null;case"env-strip":return ne.push(""),ne.push(`STEP ${q} ${Q.h} Strip environment variables`),ne.push(`  Removed: ${I.envVars.map((te)=>`${te}=<redacted>`).join(", ")}`),ne.push(`  Tokens:  ${ds(I.output)}`),{lines:ne,incrementStep:!0};case"leading-tokens-stripped":return ne.push(""),ne.push(`STEP ${q} ${Q.h} Strip wrappers`),ne.push(`  Removed: ${I.removed.join(", ")}`),ne.push(`  Tokens:  ${ds(I.output)}`),{lines:ne,incrementStep:!0};case"shell-wrapper":return ne.push(""),ne.push(`STEP ${q} ${Q.h} Detect shell wrapper`),ne.push(`  Wrapper: ${I.wrapper} -c`),ne.push(`  Inner:   ${I.innerCommand}`),{lines:ne,incrementStep:!0};case"interpreter":{if(ne.push(""),ne.push(`STEP ${q} ${Q.h} Detect interpreter`),ne.push(`  Interpreter: ${I.interpreter}`),ne.push(`  Code:        ${I.codeArg}`),I.paranoidBlocked)ne.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:ne,incrementStep:!0}}case"busybox":return ne.push(""),ne.push(`STEP ${q} ${Q.h} Busybox wrapper`),ne.push(`  Subcommand: ${I.subcommand}`),{lines:ne,incrementStep:!0};case"transparent-wrapper":return ne.push(""),ne.push(`STEP ${q} ${Q.h} Transparent wrapper`),ne.push(`  Wrapper: ${I.wrapper}`),ne.push(`  Tokens:  ${ds(I.output)}`),{lines:ne,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"script-file":return ne.push(""),ne.push(`STEP ${q} ${Q.h} Read script file`),ne.push(`  Path: ${I.path}`),ne.push(`  Size: ${I.bytes} bytes`),{lines:ne,incrementStep:!0};case"rule-check":{if(ne.push(""),ne.push(`STEP ${q} ${Q.h} Match rules`),ne.push(`  Rule:   ${I.rule}()`),I.matched)ne.push("  Result: MATCHED");else ne.push("  Result: No match");return{lines:ne,incrementStep:!0}}case"worktree-relaxation":return ne.push(""),ne.push(`STEP ${q} ${Q.h} Worktree relaxation`),ne.push(`  Mode:   ${r.worktree.name}`),ne.push(`  Git cwd: ${I.gitCwd}`),ne.push("  Result: Allowed local discard in linked worktree"),{lines:ne,incrementStep:!0};case"temp-root-relaxation":return ne.push(""),ne.push(`STEP ${q} ${Q.h} Temp-root relaxation`),ne.push(`  Git cwd: ${I.gitCwd}`),ne.push("  Result: Allowed git discard in a temp-root repository"),{lines:ne,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(I.embeddedCommandFound)return ne.push(""),ne.push(`STEP ${q} ${Q.h} Fallback scan`),ne.push(`  Found: ${I.embeddedCommandFound}`),{lines:ne,incrementStep:!0};return null}case"custom-rules-check":{if(I.rulesChecked){if(ne.push(""),ne.push(`STEP ${q} ${Q.h} Custom rules`),I.matched)ne.push("  Result: MATCHED");else ne.push("  Result: No match");return{lines:ne,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(I.matched)return ne.push(""),ne.push(`STEP ${q} ${Q.h} Dangerous text check`),ne.push(`  Token:  ${I.token}`),ne.push("  Result: MATCHED"),{lines:ne,incrementStep:!0};return null}case"strict-unparseable":return ne.push(""),ne.push(`STEP ${q} ${Q.h} Strict mode check`),ne.push(`  Command: ${I.rawCommand}`),ne.push("  Result:  ✗ UNPARSEABLE"),{lines:ne,incrementStep:!0};case"segment-skipped":return null;case"error":return ne.push(""),ne.push(`ERROR: ${I.message}`),{lines:ne,incrementStep:!1};default:return I}}function us(I,q){let Q=nd(q?.asciiOnly??!1),ne=58,te=[],re=1;te.push(...td(Q,58)),te.push("");let le=I.trace.steps.find((Ne)=>Ne.type==="error");if(le&&le.type==="error"){te.push("ERROR"),te.push(`  ${le.message}`),te.push(""),te.push("RESULT"),te.push(`  Status: ${I.result==="blocked"?We.red("BLOCKED"):We.green("ALLOWED")}`),te.push(""),te.push("CONFIG");let Ne=I.configSource??"none";return te.push(`  Path: ${Ne}`),te.join(`
`)}let ye=I.trace.steps.find((Ne)=>Ne.type==="parse");if(ye&&ye.type==="parse"){te.push("INPUT"),te.push(`  ${ye.input}`),te.push(""),te.push(`STEP ${re} ${Q.h} Split shell commands`),re++;for(let Ne=0;Ne<ye.segments.length;Ne++){let Ve=ye.segments[Ne];if(Ve){let Me=Math.random();te.push(`  Segment ${Ne+1}: ${rd(Ve,Me)}`)}}}let ve=I.trace.segments,Pe=ve.length>1;for(let Ne of ve){if(Pe){te.push("");let en="";if(ye&&ye.type==="parse"){let Ko=ye.segments[Ne.index];if(Ko)en=Ko.join(" ")}let on=54,ln=en,nn=` Segment ${Ne.index+1}: `,sn=" ";if(en){if(nn.length+en.length+sn.length>on){let yf=on-nn.length-sn.length;ln=`${en.substring(0,yf-1)}…`}}let Sn=en?`${nn}${ln}${sn}`:` Segment ${Ne.index+1} `,jt=en?`${nn}${We.cyan(ln)}${sn}`:Sn,zs=58-Sn.length,Ws=Math.floor(zs/2),hf=zs-Ws;te.push(`${Q.sh.repeat(Ws)}${jt}${Q.sh.repeat(hf)}`)}if(Ne.steps.find((en)=>en.type==="segment-skipped")){te.push(""),te.push("  (skipped — prior segment blocked)");continue}let Me=!1,tn=!1;for(let en of Ne.steps){let on=od(en,re,Q);if(on){if(tn=!0,en.type==="recurse"){te.push("");let ln=" RECURSING ",nn=58-ln.length-4;te.push(`  ${Q.tl}${Q.h}${ln}${Q.h.repeat(nn)}`),te.push(`  ${Q.v}`),Me=!0;continue}for(let ln of on.lines)if(Me)te.push(`  ${Q.v} ${ln}`);else te.push(ln);if(on.incrementStep)re++}}if(Me)te.push(`  ${Q.v}`),te.push(`  ${Q.bl}${Q.h.repeat(56)}`);if(!tn)te.push(""),te.push(`  ${We.green("✓")} Allowed (no matching rules)`)}if(te.push(""),te.push("RESULT"),I.result==="blocked"){if(te.push(`  Status: ${We.red("BLOCKED")}`),I.customRule){if(te.push(`  Rule: ${I.customRule.id}`),I.customRule.rulebook)te.push(`  Rulebook: ${I.customRule.rulebook.name} ${I.customRule.rulebook.version}`);if(I.customRule.source)te.push(`  Source: ${I.customRule.source}`);if(I.customRule.override)te.push(`  Override: reason ${I.customRule.override.reason}`)}if(I.reason){let Ne=br(I.reason,"          ");te.push(`  Reason: ${Ne[0]}`);for(let Ve=1;Ve<Ne.length;Ve++)te.push(Ne[Ve]??"")}}else te.push(`  Status: ${We.green("ALLOWED")}`);te.push(""),te.push("CONFIG");let Ie=I.configSource??"none",$e=I.configValid?"":" (invalid)";te.push(`  Path: ${Ie}${$e}`);let Le=I.safetyPresetScope;te.push(`  Safety preset: ${I.selectedPreset??"standard"}${Le?` (${jr(Le)})`:""}`),te.push(`  Effective capabilities: ${I.effectiveLevel}`);let Fe=Object.entries(I.destructiveCommandRuleOverrides??{});if(te.push(`  Rule customizations: ${Fe.length}`),I.ruleActivation)te.push(`  Rule activation: ${I.ruleActivation.id} — ${I.ruleActivation.enabled?"on":"off"} via ${I.ruleActivation.source}`);return te.join(`
`)}function ps(I){return JSON.stringify(I,null,2)}import{resolve as Gy}from"node:path";var id=512,sd={maxTextLength:2048,maxListLength:128,maxObjectProperties:128,maxDepth:16},My=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function gs(I){let q=0,Q={allocateSegment(){return q++},getNextSegmentIndex(){return q},branch(){let ne=I.fork(),te=gs(ne);return{trace:te,adopt(){I.replaceSegmentEvents(ne.finish().events),q=te.getNextSegmentIndex()}}},recordGlobal(ne){I.record({scope:"global",step:ne})},recordSegment(ne,te=Q.currentSegmentIndex){if(te===void 0)return;I.record({scope:"segment",segmentIndex:te,step:ne})}};return Q}function hs(I=new Set){let q=[];return{record(Q){if(q.length>=id)return;ko(Q.step,I,sd),q.push({...Q,step:fs(Q.step,sd,I)})},fork(){return hs(I)},replaceSegmentEvents(Q){q.splice(0,q.length,...[...q.filter((ne)=>ne.scope==="global"),...Q].slice(0,id))},finish(){return{events:q}}}}function ko(I,q,Q,ne=0,te=new WeakSet){if(typeof I==="string"){let ye=I.slice(0,Q.maxTextLength);if(!pt(ye))return;for(let ve of Pt(ye))for(let Pe of ve.match(/[^\s"'()$]+/g)??[])q.add(ad(Pe));return}if(!I||typeof I!=="object"||ne>=Q.maxDepth||te.has(I))return;if(te.add(I),Array.isArray(I)){let ye=Math.min(I.length,Q.maxListLength);for(let ve=0;ve<ye;ve++)ko(I[ve],q,Q,ne+1,te);return}let re=0,le=new Set;for(let ye in I){if(!Object.hasOwn(I,ye))continue;if(re>=Q.maxObjectProperties)break;re++,ko(ye,q,Q);let ve=ms(ye,Q,q);if(le.has(ve))continue;le.add(ve),ko(I[ye],q,Q,ne+1,te)}}function fs(I,q,Q,ne=0,te=new WeakSet){if(typeof I==="string")return ms(I,q,Q);if(!I||typeof I!=="object")return I;if(ne>=q.maxDepth)return;if(te.has(I))return;if(te.add(I),Array.isArray(I)){let ye=[],ve=Math.min(I.length,q.maxListLength);for(let Pe=0;Pe<ve;Pe++)ye.push(fs(I[Pe],q,Q,ne+1,te));return ye}let re={},le=0;for(let ye in I){if(!Object.hasOwn(I,ye))continue;if(le>=q.maxObjectProperties)break;le++;let ve=ms(ye,q,Q);if(Object.hasOwn(re,ve))continue;Object.defineProperty(re,ve,{value:fs(I[ye],q,Q,ne+1,te),enumerable:!0,configurable:!0,writable:!0})}return re}function ms(I,q,Q){let ne=I.slice(0,q.maxTextLength),te=pt(ne)?dt(ne):ne,re=Q.size>0?By(te,Q):te;return(Uy(re)?qe(re):re).slice(0,q.maxTextLength)}function Uy(I){return I.includes("PRIVATE KEY")||I.includes("://")||I.includes("eyJ")||I.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(I)||I.length>=14&&My.some((q)=>I.includes(q))||I.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(I)}function By(I,q){return I.replace(/[^\s"'()$]+/g,(Q)=>q.has(ad(Q))?"<redacted>":Q)}function ad(I){let q=2166136261,Q=2166136261;for(let ne=0;ne<I.length;ne++)q=Math.imul(q^I.charCodeAt(ne),16777619),Q=Math.imul(Q^I.charCodeAt(I.length-ne-1),16777619);return`${q>>>0}:${Q>>>0}:${I.length}`}function wr(I,q={},Q){let ne=Gy(q.cwd??process.cwd()),te=q.policySnapshot??w(Q,{cwd:ne,userConfigDir:q.userConfigDir}),re=O(te.policy,Q.env),le=_e({policySnapshot:te,effectiveCapabilities:re.capabilities,worktreeMode:re.worktreeMode}),ye={effectiveLevel:le.effectiveLevel,selectedPreset:te.policy.safety.level,...te.policyScopes?{safetyPresetScope:te.policyScopes.levelScope}:{},effectiveCapabilities:le.effectiveCapabilities,destructiveCommandRuleOverrides:te.policy.destructiveCommandRuleOverrides},{configSource:ve,configValid:Pe}=Vy(Q,{cwd:ne,userConfigDir:q.userConfigDir});if(!I||!I.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:ve,configValid:Pe,...ye};let Ie=q.shell??"auto",$e=C(I,Ie);if($e.status==="limited")throw new E;let Le=Ie==="auto"&&$e.dialect==="powershell"?C(I,"posix"):$e,Fe=Ft(Le),Ne=hs(),Ve=gs(Ne);Ve.recordGlobal({type:"parse",input:I,segments:Fe.map((jt)=>[...jt])});let Me=d("Bash",{command:I},{kind:"command",shell:Ie},{configCwd:ne,executionCwd:ne},I),tn=G(Me,{environment:Q,trace:Ve,dependencies:{loadPolicySnapshot:()=>te}}),en=tn.decision.kind==="deny"?tn.decision:null;if(en&&(tn.stage==="policy-protection"||tn.stage==="secret-protection"))return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:qy(en),matched:!0,reason:en.reason}]}]},result:"blocked",reason:A(en.reason),segment:A(ld(en,I)),ruleId:A(en.ruleId),configSource:ve,configValid:Pe,...ye};let on=Ve.getNextSegmentIndex();if(en&&on>0&&on<Fe.length)Ve.recordSegment({type:"segment-skipped",index:on,reason:"prior-segment-blocked"},on);let ln=Ne.finish(),nn=en?.ruleId??Ky(Me,te,re,Q),sn=Z.find((jt)=>jt.id===nn&&jt.activationCapability),Sn=sn?le.policy.effectiveDestructiveCommandRules[sn.id]:void 0;return{trace:zy(ln),result:en?"blocked":"allowed",reason:en?A(en.reason):void 0,segment:en?A(ld(en,I)):void 0,ruleId:en?A(en.ruleId):void 0,customRule:Jy(Wy(en?.ruleId,te)),configSource:ve,configValid:Pe,...ye,...sn&&Sn?{ruleActivation:{id:sn.id,...Sn}}:{}}}function ld(I,q){return I.evidence?.segment??q}function qy(I){if(I.reason===ot)return"policy-protection:findPolicyConfigMutationTargetInSemanticFacts";if(I.reason===rt)return"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts";if(I.reason===y)return"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts";return"secret-protection:findSensitiveTargetInSemanticFacts"}function Vy(I,q){let Q=D(q.cwd),ne=K(I,q),te=ie(I,{cwd:q.cwd,userConfigDir:q.userConfigDir});try{if(o(te.projectConfigTarget)!==null){if(Hn(te.projectConfigTarget).errors.length===0)return{configSource:Q,configValid:!0};return{configSource:Q,configValid:!1}}}catch(re){if(re instanceof i)return{configSource:Q,configValid:!1};throw re}try{if(o(te.userConfigTarget)!==null){let re=Hn(te.userConfigTarget);return{configSource:ne,configValid:re.errors.length===0}}return{configSource:null,configValid:!0}}catch(re){if(re instanceof i)return{configSource:ne,configValid:!1};throw re}}function Ky(I,q,Q,ne){let te=q.policy,re=Ge({...te,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...te.destructiveCommandRuleOverrides,...Object.fromEntries(Z.flatMap((ye)=>ye.activationCapability?[[ye.id,"on"]]:[]))}},q.state==="degraded"?{diagnostics:q.diagnostics,reason:q.reason}:void 0),le=G(I,{environment:ne,dependencies:{loadPolicySnapshot:()=>re,getModes:()=>({...Q,strict:!0,paranoidRm:!0,paranoidInterpreters:!0,capabilities:{fail_closed:{...Q.capabilities.fail_closed,enabled:!0},paranoid_rm:{...Q.capabilities.paranoid_rm,enabled:!0},paranoid_interpreters:{...Q.capabilities.paranoid_interpreters,enabled:!0}}}),findSensitiveTarget:()=>null}});return le.decision.kind==="deny"?le.decision.ruleId:void 0}function Jy(I){if(!I)return;return{id:A(I.id),...I.rulebook?{rulebook:{name:A(I.rulebook.name),version:A(I.rulebook.version)}}:{},...I.source?{source:A(I.source)}:{},...I.override?{override:{type:"reason",reason:A(I.override.reason)}}:{}}}function zy(I){let q=I.events.flatMap((ne)=>ne.scope==="global"?[ne.step]:[]),Q=new Map;for(let ne of I.events){if(ne.scope!=="segment")continue;let te=Q.get(ne.segmentIndex)??{index:ne.segmentIndex,steps:[]};te.steps.push(ne.step),Q.set(ne.segmentIndex,te)}return{steps:q,segments:[...Q.values()]}}function Wy(I,q){let Q=I?.replace(/^custom\./,"");if(!Q||!q.policy.rules.some((ne)=>ne.name===Q))return;return q.ruleMetadata[Q]??Object.freeze({id:Q})}function cd(I){return new Promise((q)=>{process.stdout.write(`${I}
`,()=>q())})}async function dd(I,q){let Q=cs(q);if(!Q)return 1;try{let ne=wr(Q.command,{cwd:Q.cwd,shell:Q.shell},I),te=!!process.env.NO_COLOR||!process.stdout.isTTY;return await cd(Q.json?ps(ne):us(ne,{asciiOnly:te})),0}catch(ne){let te=Yy(ne instanceof g?ne.cause:ne);if(te===void 0)throw ne;if(Q.json)return await cd(JSON.stringify({error:te})),1;return console.error(te),1}}function Yy(I){if(I instanceof E)return I.message;if(I instanceof H)return I.message;if(I instanceof h)return I.message;if(I instanceof a&&l[I.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var ud="2.7.12",Pn="  ",bt="cc-safety-net";function pd(I){return I.argument?`${I.flags} ${I.argument}`:I.flags}function Zy(I){return Math.max(...I.map((q)=>pd(q).length))}function Xy(I){return Math.max(...I.map((q)=>q.usage.length))}function Qy(I){return Math.max(...I.map((q)=>`${bt} ${q.usage}`.length))}function ev(I,q){let Q=`${bt} ${I.usage}`;return`${Pn}${Q.padEnd(q+2)}${I.description}`}function An(I,q){return`${Pn}${I.padEnd(Math.max(40,I.length+2))}${q}`}function er(I,q=console.log){let Q=[];if(Q.push(`${bt} ${I.name}`),Q.push(""),Q.push(`${Pn}${I.description}`),Q.push(""),Q.push("USAGE:"),Q.push(`${Pn}${bt} ${I.usage}`),Q.push(""),I.subcommands&&I.subcommands.length>0){Q.push("SUBCOMMANDS:");let ne=Xy(I.subcommands);for(let te of I.subcommands)Q.push(`${Pn}${te.usage.padEnd(ne+2)}${te.description}`);Q.push("")}if(I.options.length>0){Q.push("OPTIONS:");let ne=Zy(I.options);for(let te of I.options){let re=pd(te),le=te.default?`${te.description} (default: ${te.default})`:te.description;Q.push(`${Pn}${re.padEnd(ne+2)}${le}`)}Q.push("")}if(I.examples&&I.examples.length>0){Q.push("EXAMPLES:");for(let ne of I.examples)Q.push(`${Pn}${ne}`)}q(Q.join(`
`))}function ys(){let I=Qy(Dr),q=[];q.push(`${bt} v${ud}`),q.push(""),q.push("Blocks destructive commands and secret access."),q.push(""),q.push("COMMANDS:");for(let Q of Dr)q.push(ev(Q,I));q.push(""),q.push("GLOBAL OPTIONS:"),q.push(`${Pn}-h, --help       Show help (use with command for command-specific help)`),q.push(`${Pn}-V, --version    Show version`),q.push(""),q.push("HELP:"),q.push(`${Pn}${bt} help <command>     Show help for a specific command`),q.push(`${Pn}${bt} <command> --help   Show help for a specific command`),q.push(""),q.push("ENVIRONMENT VARIABLES:"),q.push(An(`${r.level.name}=standard|strict|paranoid`,"Set session safety level")),q.push(An(`${r.worktree.name}=1`,"Allow local git discards in linked worktrees")),q.push(An(`${r.debug.name}=1`,"Print diagnostic messages to stderr")),q.push(An(`${r.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),q.push(An(`${r.projectTightenOnly.name}=1`,"Ignore project policy settings that weaken the user policy")),q.push(An("CC_SAFETY_NET_HOME","Override rule config home directory")),q.push(""),q.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),q.push(An(`${r.strict.name}=1`,"Force safety.overrides.fail_closed on")),q.push(An(`${r.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),q.push(An(`${r.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),q.push(An(`${r.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),q.push(""),q.push("Documentation:        https://ccsafetynet.com/docs"),console.log(q.join(`
`))}function fd(){console.log(ud)}function kr(I,q=console.log){let Q=Nr(I);if(!Q)return!1;if(Q.name.toLowerCase()!==I.toLowerCase())return!1;return er(Q,q),!0}import{existsSync as Ao,readFileSync as bu}from"node:fs";import{join as To}from"node:path";import*as Gn from"node:readline";function nv(I){return I==="install"?"Install":"Uninstall"}function tv(I){return I==="install"?"Installing":"Uninstalling"}function rv(I){return I==="install"?"into":"from"}function hd(I){return I?.available===!0}function ov(I,q){let Q=new Set(q);return I.filter((ne)=>Q.has(ne.target)).map((ne)=>ne.target)}function md(I,q,Q){if(I.every((ne)=>!ne.available))return q;return Array.from({length:I.length},(ne,te)=>te+1).map((ne)=>(q+ne*Q+I.length)%I.length).find((ne)=>hd(I[ne]))}function iv(I,q,Q){if(Q.ctrl&&Q.name==="c")return"interrupt";if(Q.name==="escape"||q==="q")return"abort";if(I==="install"&&(q==="u"||q==="U"))return"update";if(Q.name==="up"||q==="k")return"up";if(Q.name==="down"||q==="j")return"down";if(Q.name==="space"||q===" ")return"toggle";if(Q.name==="return"||Q.name==="enter")return"confirm";return null}function sv(I){return{cursor:I.findIndex((q)=>q.available),selected:[]}}function av(I,q,Q){if(Q==="confirm"||Q==="update"||Q==="abort"||Q==="interrupt")return{state:I,done:Q};if(Q==="up")return{state:{...I,cursor:md(q,I.cursor,-1)}};if(Q==="down")return{state:{...I,cursor:md(q,I.cursor,1)}};let ne=q[I.cursor];if(!hd(ne))return{state:I};let te=I.selected.includes(ne.target)?I.selected.filter((re)=>re!==ne.target):ov(q,[...I.selected,ne.target]);return{state:{...I,selected:te}}}var yd="◉",vd="◯",bd=">",wd=" ";function lv(I,q,Q){return["",`${nv(I)} CC Safety Net ${rv(I)}:`,"",...q.map((ne,te)=>{let re=Q.selected.includes(ne.target),le=te===Q.cursor,ye=re?yd:vd,ve=le?bd:wd,Pe=ne.available?"":` (${ne.unavailableReason??"not installed"})`,Ie=`${ye} ${ne.label}${Pe}`,$e=!ne.available?We.dim(Ie):re?We.green(Ie):le?We.bold(Ie):Ie;return`${ve} ${$e}`}),"",I==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":q.some((ne)=>ne.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${I}. q/Esc: close`].join(`
`)}var gd=["global-hook","plugin"];function cv(I,q,Q={}){let ne=Q.color!==!1?We.bold:(re)=>re;return["","Install the Kimi Code integration as:","",...[`Global hook — ${q?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((re,le)=>{let ye=le===I,ve=`${ye?yd:vd} ${re}`;return`${ye?bd:wd} ${ye?ne(ve):ve}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function kd(I){let{input:q,output:Q}=I;Gn.emitKeypressEvents(q);let ne=q.isRaw===!0;q.setRawMode(!0),q.resume();let te=0,re=()=>{if(te===0)return;Gn.moveCursor(Q,0,-te),Gn.cursorTo(Q,0),Gn.clearScreenDown(Q)},le=()=>{re();let ye=I.render();Q.write(`${ye}
`),te=ye.split(`
`).length};return new Promise((ye)=>{let ve=(Ie)=>{q.off("keypress",Pe),q.setRawMode(ne),q.pause(),re(),ye(Ie)};function Pe(Ie,$e){I.onKey(Ie,$e,{finish:ve,draw:le})}q.on("keypress",Pe),le()})}function Cd(I={}){let q=0;return kd({input:I.input??process.stdin,output:I.output??process.stdout,render:()=>cv(q,I.globalHookInstalled===!0),onKey:(Q,ne,te)=>{if(ne.ctrl&&ne.name==="c"){te.finish(null),(I.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(ne.name==="escape"||Q==="q")return te.finish(null);if(ne.name==="return"||ne.name==="enter")return te.finish(gd[q]);if(ne.name==="up"||ne.name==="down"||Q==="k"||Q==="j")q=(q+1)%gd.length,te.draw()}})}function vs(I=process.stdin,q=process.stdout){return Boolean(I.isTTY&&q.isTTY&&typeof I.setRawMode==="function")}function xd(I,q,Q={}){let ne=Q.output??process.stdout,te=sv(q);return kd({input:Q.input??process.stdin,output:ne,render:()=>lv(I,q,te),onKey:(re,le,ye)=>{let ve=iv(I,re,le);if(!ve)return;let Pe=av(te,q,ve);if(te=Pe.state,Pe.done==="interrupt"){ye.finish(null),(Q.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(Pe.done==="abort")return ye.finish(null);if(Pe.done==="update")return ye.finish("update");if(Pe.done==="confirm"){if(te.selected.length===0){ne.write("\x07"),ye.draw();return}ye.finish([...te.selected]),ne.write(`${tv(I)} selected integrations...
`);return}ye.draw()}})}import{existsSync as Pd,lstatSync as uv,mkdirSync as pv,mkdtempSync as fv,readdirSync as mv,readFileSync as tr,rmSync as xo}from"node:fs";import{basename as gv,dirname as hv,join as wn}from"node:path";import{fileURLToPath as yv}from"node:url";var bs="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",kt="cc-safety-net",Et="cc-safety-net/index.ts";import{spawn as dv}from"node:child_process";var ws=(I,q)=>{let Q=Wn([...I],process.env);return new Promise((ne)=>{let te=dv(Q.cmd,Q.args,{cwd:q,stdio:["ignore","pipe","pipe"]}),re=hi(te),le=!1,ye=setTimeout(()=>{le=!0,te.kill()},120000);te.on("error",(ve)=>{clearTimeout(ye),ne({status:null,errorCode:ve.code,stdout:re.stdout,stderr:[ve.message,re.stderr].filter(Boolean).join(`
`)})}),te.on("close",(ve)=>{clearTimeout(ye),ne({status:le?null:ve,errorCode:le?"ETIMEDOUT":void 0,stdout:re.stdout,stderr:re.stderr})})})};var nr="cc-safety-net.ts",ks=wn("amp",Et);function vv(I){return wn(I.home,".config","amp","plugins","cc-safety-net.ts")}function bv(){let I=hv(yv(import.meta.url)),q=wn(I,ks),Q=wn(I,"..",ks),ne=wn(I,"..","..","..","dist",ks);return[q,Q,ne]}function wv(I=bv()){let q=I.find((Q)=>Pd(Q)&&uv(Q).isFile());if(!q)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return q}function Sd(I){try{return JSON.parse(I)}catch{return}}function Po(I){return I.subarray(0,Buffer.byteLength(bs)).toString("utf-8")===bs}async function Cr(I,q,Q){let ne=await I(q,Q);if(ne.status===0)return ne;throw Error([`Failed to run ${q.join(" ")}${ne.status===null?"":` (exit ${ne.status})`}.`,[ne.stdout,ne.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Rd(I){let q=await I(["amp","plugins","repositories","--json"]);if(q.status===null)throw Error(`${q.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${q.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${q.stderr}`.trim());if(q.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${q.status}). Sign in with "amp login" and rerun install --amp.
${[q.stdout,q.stderr].filter(Boolean).join(`
`)}`.trim());let Q=Sd(q.stdout),ne=(Array.isArray(Q)?Q:[]).filter((te)=>n(te,"scope")==="user"&&n(te,"exists")===!0&&n(te,"viewerCanWrite")===!0).map((te)=>n(te,"cloneRef")).find((te)=>typeof te==="string"&&te.length>0);if(!ne)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return ne}async function Ed(I,q,Q){let ne=fv(wn(q.tmpdir,"cc-safety-net-amp-"));try{return await Cr(I,["amp","clone","user-plugins",ne]),await Q(ne)}finally{xo(ne,{recursive:!0,force:!0})}}function Cs(I){return`rerun ${I==="overwrite"?"install":"uninstall"} --amp`}function Td(I,q,Q){let ne=wn(I,q),te=u(ne);if(!te)return;if(te.isSymbolicLink()||!te.isFile())throw Error(`Refusing to ${Q} ${q} in your Amp personal plugins repository: not a regular file. Remove it there and ${Cs(Q)}.`);let re=tr(ne);if(Po(re))return re;throw Error(`Refusing to ${Q} unmanaged file ${q} in your Amp personal plugins repository. Remove it there and ${Cs(Q)}.`)}function Ad(I,q){let Q=wn(I,kt),ne=u(Q);if(!ne)return;if(ne.isSymbolicLink()||!ne.isDirectory())throw Error(`Refusing to ${q} ${kt} in your Amp personal plugins repository: not a regular directory. Remove it there and ${Cs(q)}.`);return Td(I,Et,q)}function kv(I){let q=wn(I,nr),Q=u(q);if(!Q||Q.isSymbolicLink()||!Q.isFile())return;let ne=tr(q);return Po(ne)?ne:void 0}async function _d(I,q,Q,ne){if(await Cr(I,Q,q),(await Cr(I,["git","status","--porcelain"],q)).stdout.trim()==="")return!1;return await Cr(I,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",ne],q),await Cr(I,["git","push","origin","HEAD"],q),!0}function Co(I,q){Cv(I,q),xv(I,q)}function Id(I,q){if(q==="keep")return;throw Error(`Local Amp plugin ${I} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function Cv(I,q){let Q=vv(I),ne=u(Q);if(!ne)return;if(!ne.isSymbolicLink()&&ne.isFile()&&Po(tr(Q))){xo(Q);return}Id(Q,q)}function xv(I,q){let Q=wn(I.home,".config","amp","plugins",kt),ne=u(Q);if(!ne)return;if(!ne.isSymbolicLink()&&ne.isDirectory()&&Pv(Q)){xo(Q,{recursive:!0});return}Id(Q,q)}function Pv(I){let q=gv(Et);if(mv(I).join("\x00")!==q)return!1;let Q=wn(I,q),ne=u(Q);return!!ne&&!ne.isSymbolicLink()&&ne.isFile()&&Po(tr(Q))}function Sv(I){let q=p(I);if(!Pd(q))return"";let Q=Sd(tr(q,"utf-8"));if(!Q||typeof Q!=="object"||Array.isArray(Q))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(_(Q,I.home))};
`}async function Od(I,q=wv(),Q=ws){let ne=Buffer.concat([tr(q),Buffer.from(Sv(I),"utf-8")]),te=await Rd(Q);return Ed(Q,I,async(re)=>{let le=`${te}/${kt}`,ye=Ad(re,"overwrite"),ve=Td(re,nr,"overwrite");if(ye?.equals(ne)&&!ve)return Co(I,"fail"),{path:le,alreadyInstalled:!0};if(pv(wn(re,kt),{recursive:!0}),an(wn(re,Et),ne),ve)xo(wn(re,nr));let Pe=await _d(Q,re,["git","add","--",Et,...ve?[nr]:[]],`chore: update cc-safety-net plugin to v${un()}`);return Co(I,"fail"),{path:le,alreadyInstalled:!Pe}})}async function $d(I,q=ws){let Q=await Rd(q);return Ed(q,I,async(ne)=>{let te=Ad(ne,"remove"),re=kv(ne),le=`${Q}/${re&&!te?nr:kt}`;if(!te&&!re)return Co(I,"keep"),{path:le,alreadyInstalled:!1};return await _d(q,ne,["git","rm","--",...te?[Et]:[],...re?[nr]:[]],`chore: remove cc-safety-net plugin v${un()}`),Co(I,"keep"),{path:le,alreadyInstalled:!0}})}import{existsSync as Dd,mkdirSync as Rv,readFileSync as Ev}from"node:fs";import{dirname as Tv}from"node:path";var xs=bn["antigravity-cli"],Tt="cc-safety-net";function _t(I){return Boolean(I)&&typeof I==="object"&&!Array.isArray(I)}function Ro(){return{PreToolUse:[{hooks:[{type:"command",command:xs,timeout:30}]}]}}function Nd(I){try{let q=JSON.parse(Ev(I,"utf-8"));if(!q||typeof q!=="object"||Array.isArray(q))throw Error("Antigravity hooks config must be a JSON object");return q}catch(q){if(q instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${I}: ${q.message}`);throw q}}function Ld(I){let q=I[Tt];if(q===void 0){let ne=Ro();return I[Tt]=ne,{definition:ne,preToolUse:ne.PreToolUse??[]}}if(!_t(q))throw Error(`Antigravity hooks config entry "${Tt}" must be an object`);let Q=Array.isArray(q.PreToolUse)?q.PreToolUse:[];return q.PreToolUse=Q,{definition:q,preToolUse:Q}}function jd(I){if(!Array.isArray(I.PreToolUse))return!1;return I.PreToolUse.some((q)=>_t(q)&&Array.isArray(q.hooks)&&q.hooks.some((Q)=>_t(Q)&&Q.command===xs))}function Av(I){return Object.values(I).some((q)=>_t(q)&&q.enabled!==!1&&jd(q))}function _v(I){if(I[Tt]===void 0)return!1;let q=Ld(I);if(q.definition.enabled!==!1||!jd(q.definition))return!1;return q.definition.enabled=!0,!0}function Iv(I){if(I[Tt]===void 0){I[Tt]=Ro();return}let q=Ld(I);q.definition.enabled=!0,q.preToolUse.push(Ro().PreToolUse?.[0]??{hooks:[]})}function Ov(I){let q=!1;for(let Q of Object.values(I)){if(!_t(Q)||!Array.isArray(Q.PreToolUse))continue;Q.PreToolUse=Q.PreToolUse.flatMap((ne)=>{if(!_t(ne)||!Array.isArray(ne.hooks))return[ne];let te=ne.hooks.filter((re)=>!_t(re)||re.command!==xs);if(te.length!==ne.hooks.length)q=!0;return te.length===0?[]:[{...ne,hooks:te}]})}return q}function So(I,q){an(I,`${JSON.stringify(q,null,2)}
`)}function Fd(I){let q=lr(I.home);if(Rv(Tv(q),{recursive:!0}),!Dd(q))return So(q,{[Tt]:Ro()}),{path:q,alreadyInstalled:!1};let Q=Nd(q);if(Av(Q))return{path:q,alreadyInstalled:!0};if(_v(Q))return So(q,Q),{path:q,alreadyInstalled:!1};return Iv(Q),So(q,Q),{path:q,alreadyInstalled:!1}}function Hd(I){let q=lr(I.home);if(!Dd(q))return{path:q,alreadyInstalled:!1};let Q=Nd(q);if(!Ov(Q))return{path:q,alreadyInstalled:!1};return So(q,Q),{path:q,alreadyInstalled:!0}}import{existsSync as Rs,readlinkSync as Nv}from"node:fs";import{join as qn}from"node:path";import{spawn as $v}from"node:child_process";var _n=xn.map((I)=>({target:I.id,flag:I.flag,label:cn(I.id),probeCommand:I.probeCommand}));function Ps(I){let q=new Set(I);return _n.map((Q)=>Q.target).filter((Q)=>q.has(Q))}async function Md(I,q){for(let Q of I)await q(Q)}var Dv=5000;function xr(I,q=Dv){return new Promise((Q)=>{let ne=Wn([...I],process.env),te=$v(ne.cmd,ne.args,{env:process.env,stdio:"ignore"}),re=!1,le=(ve)=>{if(re)return;re=!0,clearTimeout(ye),Q(ve)},ye=setTimeout(()=>{te.kill(),le(!1)},q);te.on("error",()=>le(!1)),te.on("close",(ve)=>le(ve===0))})}function Ud(I=xr,q={}){let Q=new Set(q.configuredTargets??[]);return Promise.all(_n.map(async(ne)=>({target:ne.target,flag:ne.flag,label:ne.label,...Gd(q.action,await I(ne.probeCommand)||ne.target==="cursor"&&await I(aa),Q.has(ne.target))})))}function Bd(I,q){let Q=new Set(q.configuredTargets??[]);return I.map((ne)=>({...ne,...Gd(q.action,ne.available,Q.has(ne.target))}))}function Gd(I,q,Q){if(I==="uninstall")return Q?{available:!0}:{available:!1,unavailableReason:"not installed"};if(I==="install"&&Q)return{available:!1,unavailableReason:"already installed"};if(!q)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}var Vn="cc-safety-net",Jd=["npx","-y","@deepseek-ai/dsh"],qd="DeepSeek Harness",Vd=["@deepseek-ai","dsh-desktop"],zd="Quit DeepSeek Harness Desktop, then run this command again: Desktop plugins can only change while it is closed.",Ss=(I)=>`DeepSeek Harness Desktop is not in its default location, so ${I} ${Vn} from its Plugins page.`,Wd=(I,q)=>Rs(qn(De(I),q,"package.json"));function Es(I,q){let Q=q.platform??process.platform,ne=Wd(I,"desktop"),te=Q==="darwin"?[qn(I.home,"Applications"),q.systemApplications??"/Applications"].map((re)=>qn(re,`${qd}.app`,"Contents","Resources","runtime","cli","bin","dsh")):Q==="win32"?[qn(I.env.get("LOCALAPPDATA")||qn(I.home,"AppData","Local"),"Programs",qd,"resources","runtime","cli","bin","dsh.cmd")]:[];return{profile:ne,cli:ne?te.find((re)=>Rs(re)):void 0}}function Yd(I,q=process.platform){if(q==="win32")return Rs(qn(I.env.get("APPDATA")||qn(I.home,"AppData","Roaming"),...Vd,"lockfile"));let Q=Lv(qn(I.home,"Library","Application Support",...Vd,"SingletonLock")),ne=Number(/-(\d+)$/.exec(Q??"")?.[1]);return Number.isInteger(ne)&&ne>0&&jv(ne)}function Lv(I){try{return Nv(I)}catch{return}}function jv(I){try{return process.kill(I,0),!0}catch(q){return q.code==="EPERM"}}async function Zd(I,q={}){let Q=Es(I,q);if(Q.cli&&Yd(I,q.platform))throw Error(zd);let ne=!Q.cli||Wd(I,"web")||await(q.probe??xr)(zo),te=[...Q.cli?[{profile:"desktop",label:"Desktop",dsh:[Q.cli]}]:[],...ne?[{profile:"web",label:"web",dsh:Jd}]:[]];return{commands:te.map((re)=>[...re.dsh,"plugin","--profile",re.profile,"add",`${Vn}@${un()}`]),afterInstall:async()=>{let re=new Set(lt(I).filter((ye)=>ye.enabled).map((ye)=>ye.name)),le=te.filter((ye)=>!re.has(ye.profile));if(le.length>0)throw Error(`DeepSeek Harness installed ${Vn} in the ${Kd(le)} but did not enable it. Enable it from the Plugins page.`)},message:[`Added ${Vn} to the DeepSeek Harness ${Kd(te)}.`,...Q.profile&&!Q.cli?[Ss("add")]:[]].join(`
`)}}function Kd(I){return`${I.map((q)=>q.label).join(" and ")} profile${I.length>1?"s":""}`}function Xd(I,q={}){let Q=new Set(lt(I).map((re)=>re.name));if(!Q.has("desktop")&&!Q.has("web"))throw Error(`${Vn} is not installed in the DeepSeek Harness web or Desktop profile`);let ne=Q.has("desktop")?Es(I,q).cli:void 0,te=Q.has("desktop")&&!ne;if(te&&!Q.has("web"))throw Error(Ss("remove"));if(ne&&Yd(I,q.platform))throw Error(zd);return{commands:[...ne?[[ne,"plugin","--profile","desktop","remove",Vn]]:[],...Q.has("web")?[[...Jd,"plugin","--profile","web","remove",Vn]]:[]],...te?{afterUninstall:()=>{throw Error(`Removed ${Vn} from the DeepSeek Harness web profile, but ${Ss("remove")}`)}}:{}}}function Qd(I,q,Q={}){let ne=Es(q,Q).cli!==void 0;return I.map((te)=>te.target==="deepseek-harness"&&ne?{...te,available:!0,unavailableReason:void 0}:te)}import{existsSync as Fv,readdirSync as Hv,rmSync as Mv}from"node:fs";import{join as Uv}from"node:path";function eu(I,q=process.platform,Q){if(!Fv(I))return;let ne=q==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);Hv(I).filter((te)=>te!==Q&&ne.test(te)).forEach((te)=>{Mv(Uv(I,te),{recursive:!0,force:!0})})}import{existsSync as nu,readdirSync as Bv,rmSync as Gv}from"node:fs";import{join as rr}from"node:path";function Eo(I,q=process.platform){let Q=rr(I.env.get("npm_config_cache")||(q==="win32"?rr(I.env.get("LOCALAPPDATA")||rr(I.home,"AppData","Local"),"npm-cache"):rr(I.home,".npm")),"_npx");if(!nu(Q))return;Bv(Q).filter((ne)=>nu(rr(Q,ne,"node_modules","cc-safety-net"))).forEach((ne)=>{Gv(rr(Q,ne),{recursive:!0,force:!0})})}import{existsSync as au,mkdirSync as Vv,readFileSync as lu}from"node:fs";import{dirname as Kv,join as su}from"node:path";function qv(I,q){if(I[q]!=="#")return q;let Q=I.indexOf(`
`,q+1);return Q===-1?I.length:Q+1}function Ts(I,q,Q){let ne=new RegExp(`^(\\s*)${q}\\s*=\\s*\\[`),te=0;for(let re of I.split(`
`)){if(/^\s*\[/.test(re))return;let le=ne.exec(re);if(le){let ye=te+le[0].lastIndexOf("[");return{start:ye,end:fi(I,ye,{skipComment:qv,...Q})}}te+=re.length+1}return}function tu(I,q,Q){let ne=I.slice(0,q.end).trimEnd(),te=yl(I,q.end),re=te===""?"     ":`${te}  `,le=!ne.endsWith("[")&&!ne.endsWith(",");return`${ne}${le?",":""}
${re}${Q}${I.slice(q.end)}`}function ru(I,q,Q){let ne=I.indexOf(Q,q.start);if(ne===-1||ne>q.end)return I;return`${I.slice(0,ne)}${I.slice(ne+Q.length).replace(/^\s*,/,"")}`}function ou(I,q){let Q=new RegExp(`^\\s*${q}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),ne=I.split(`
`),te=ne.findIndex((ye)=>/^\s*\[/.test(ye)),re=te===-1?ne:ne.slice(0,te),le=te===-1?[]:ne.slice(te);return[...re.filter((ye)=>!Q.test(ye)),...le].join(`
`)}function iu(I,q,Q){let ne=new RegExp(`^\\s*\\[\\[${q}]]\\s*$`,"m");return I.split(/(?=^\s*\[)/m).filter((te)=>!ne.test(te)||!te.includes(Q)).join("").trimEnd()}var Pr=bn["kimi-code"],As=`[[hooks]]
event = "PreToolUse"
command = "${Pr}"`,cu=`{ event = "PreToolUse", command = "${Pr}" }`,du={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function uu(I){return su(I.env.get("KIMI_CODE_HOME")??su(I.home,".kimi-code"),"config.toml")}function Jv(I){let q=Ts(I,"hooks",du);if(q&&I.slice(q.start+1,q.end).trim())return tu(I,q,cu);let Q=ou(I,"hooks").trimEnd();if(Q==="")return`${As}
`;return`${Q}

${As}
`}function pu(I){let q=uu(I);if(Vv(Kv(q),{recursive:!0}),!au(q))return an(q,`${As}
`),{path:q,alreadyInstalled:!1};let Q=lu(q,"utf-8");if(Q.includes(Pr))return{path:q,alreadyInstalled:!0};return an(q,Jv(Q)),{path:q,alreadyInstalled:!1}}function fu(I){let q=uu(I);if(!au(q))return{path:q,alreadyInstalled:!1};let Q=lu(q,"utf-8");if(!Q.includes(Pr))return{path:q,alreadyInstalled:!1};let ne=Ts(Q,"hooks",du),te=ne?ru(Q,ne,cu):`${iu(Q,"hooks",Pr)}
`;return an(q,te),{path:q,alreadyInstalled:!0}}var _s="safety-net@cc-marketplace",mu=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),gu=new Set(["antigravity-cli","cursor","devin","droid","grok-build","hermes-agent","kimi-code"]);function Is(I){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(I??"")}function wu(I){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(I??"")}function zv(I){return/^Marketplace `cc-marketplace`\s*$/m.test(I??"")}var ku={"claude-code":{installCommands:(I)=>{let q=Yr(I,"cc-safety-net@cc-marketplace");return{commands:[...q?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...ui(I).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:Yr(I,_s)?[["claude","plugin","uninstall",_s]]:[],update:q}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(I,q)=>{let Q=q??await pn(["codex","plugin","list"]),ne=wu(Q);return{commands:[ne||zv(Q)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:Is(Q)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:ne}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:fl},"copilot-cli":{installCommands:async()=>{let I=await pn(["copilot","plugin","list"]),q=[...Sl(I)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...Rl(I)?[["copilot","plugin","uninstall",Cl]]:[]];if(xl(I))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",En]],cleanupCommands:q,update:!0};return{commands:[Pl(await pn(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",En]],cleanupCommands:q}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(I)=>{let q=$i(I);if(q.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(q.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:zi,installCommands:(I)=>{let q=!Ao(To(hr(I),kn));return{commands:Dc(),afterInstall:()=>Nc(q)}},uninstallCommands:[["openclaw","plugins","uninstall",dn,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:Vc},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]},"deepseek-harness":{installCommands:(I)=>Zd(I),uninstallCommands:(I)=>Xd(I)}};function Cu(I,q=(Q)=>Q){try{let Q=JSON.parse(q(bu(I,"utf-8")));if(!Q||typeof Q!=="object"||Array.isArray(Q))throw Error(`Settings file ${I} must be a JSON object`);return Q}catch(Q){if(Q instanceof SyntaxError)throw Error(`Failed to parse ${I}: ${Q.message}`);throw Q}}function Wv(I){let q=To(ur(I),"settings.json");if(!Ao(q))return;let Q=Cu(q,gn),ne=Q.enabledPlugins;if(!ne||typeof ne!=="object"||Array.isArray(ne))return;if(ne[En]!==!1)return;let te=bu(q,"utf-8"),re=te.replace(new RegExp(`("${En}"\\s*:\\s*)false`),"$1true");return ne[En]=!0,an(q,re!==te?re:`${JSON.stringify(Q,null,2)}
`),`Enabled ${En} plugin in ${q}`}function Yv(I){let q=is(I);if(!Ao(q))return;let Q=Cu(q);if(!Array.isArray(Q.packages))return;let ne=Q.packages.find((te)=>!!te&&typeof te==="object"&&!Array.isArray(te)&&ss(te.source)&&("extensions"in te));if(!ne)return;return delete ne.extensions,an(q,`${JSON.stringify(Q,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${q}`}function hu(I,q){let Q=fn({label:q,booleans:Object.fromEntries(_n.map((re)=>[re.target,[re.flag]]))},I),ne=Q.errors[0];if(ne)throw Error(ne);let te=_n.filter((re)=>Q.flags[re.target]).map((re)=>re.target);if(te.length!==1)throw Error(`Choose exactly one ${q} target: ${_n.map((re)=>re.flag).join(", ")}`);return te[0]}async function xu(I,q=Gt){let[Q,ne,te]=await Promise.all([q(["amp","plugins","list"],30000),q(["codex","plugin","list"],30000),q(["copilot","--binary-version"])]);return{codexPluginListOutput:ne,hooks:Qt(I,process.cwd(),{ampPluginListOutput:Q,codexPluginListOutput:ne,copilotCliVersion:te})}}async function Zv(I,q,Q=Gt){let ne=await xu(I,Q);return ne.hooks.filter((te)=>q==="install"?te.configured:te.detected&&te.method!==oo||te.inspectionStatus==="not-inspected").filter((te)=>!Ru(te)).filter((te)=>te.platform!=="codex"||!Is(ne.codexPluginListOutput)||wu(ne.codexPluginListOutput)).map((te)=>te.platform)}function Xv(I,q,Q,ne){if(Q.length>0)return{finish:async()=>[hu(Q,q)]};if(!ne.selectTargets&&!vs(ne.input,ne.output))return{finish:async()=>[hu(Q,q)]};let te=ne.detectConfiguredTargets??(()=>Zv(I,q,ne.fetchVersion)),re=Promise.all([Ud(ne.probeTargets).then((le)=>Qd(le,I)),te()]);return{ready:re,finish:async()=>{let[le,ye]=await re,ve=Bd(le,{action:q,configuredTargets:ye}),Pe=ne.selectTargets?await ne.selectTargets(q,vu(q,ve)):await xd(q,vu(q,ve),{input:ne.input,output:ne.output});if(Pe==="update")return Pe;if(!Pe||Pe.length===0)return null;return Ps(Pe)}}}async function Qv(I,q,Q=!1,ne){let te=ku[I];te.beforeInstall?.(q);let re=typeof te.installCommands==="function"?await te.installCommands(q,ne):{commands:te.installCommands};return await yi(re.commands),await $l(re.cleanupCommands??[]),await re.afterInstall?.(),[`${re.update||Q?"Updated":"Installed"} ${cn(I)} integration`,re.message??te.postInstallMessage].filter(Boolean).join(`
`)}async function eb(I,q){let Q=ku[I];if(!Q.uninstallCommands)throw Error(`${cn(I)} uninstall is not supported`);let ne=typeof Q.uninstallCommands==="function"?Q.uninstallCommands(q):{commands:Q.uninstallCommands};return await yi(ne.commands),ne.afterUninstall?.(),`Uninstalled ${cn(I)} integration`}function nb(I){let q=zc(I);return q.alreadyInstalled?`Uninstalled OpenCode plugin from ${q.path}`:`OpenCode plugin not installed in ${q.path}`}var Pu={"antigravity-cli":{install:Fd,uninstall:Hd},cursor:{install:Hl,uninstall:Ml},devin:{install:Jl,uninstall:zl},droid:{install:nc,uninstall:tc},"grok-build":{install:dc,uninstall:uc},"kimi-code":{install:pu,uninstall:fu}};function tb(I,q,Q,ne=!1){if(I==="install"&&!ne)Eo(Q);let te=Pu[q][I](Q),re=cn(q),le=I!=="install"?"Uninstalled":ne?"Updated":"Installed";return I==="install"&&te.alreadyInstalled?ne?`${re} hook up to date in ${te.path}`:`${re} hook already installed in ${te.path}`:I==="uninstall"&&!te.alreadyInstalled?`${re} hook not installed in ${te.path}`:`${le} ${re} hook ${I==="install"?"in":"from"} ${te.path}`}var Su={amp:{install:Od,uninstall:$d,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:vc,uninstall:bc,afterInstall:async(I)=>{let q=Gi(I);return await pn(["hermes","plugins","enable",Cn,"--no-allow-tool-override"]),!q},beforeUninstall:async(I)=>{Bi(I);try{await pn(["hermes","plugins","disable",Cn])}catch(q){console.warn(`${q instanceof Error?q.message:String(q)}
Removing the plugin files anyway; ${Cn} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function rb(I,q,Q,ne=!1){let te=Su[q];if(I==="uninstall")await te.beforeUninstall?.(Q);let re=I==="install"?await te.install(Q):await te.uninstall(Q),le=I==="install"&&await te.afterInstall?.(Q),ye=cn(q),ve=!le&&(I==="install"&&re.alreadyInstalled||I==="uninstall"&&!re.alreadyInstalled);return[ve?I==="install"?`${ye} plugin ${ne?"up to date":"already installed"} at ${re.path}`:`${ye} plugin not installed at ${re.path}`:`${I!=="install"?"Uninstalled":ne?"Updated":"Installed"} ${ye} plugin ${I==="install"?"at":"from"} ${re.path}`,ve?void 0:te.restartNote].filter(Boolean).join(`
`)}var ob={"copilot-cli":{afterInstall:Wv},cursor:{afterUninstall:Nl},"hermes-agent":{beforeInstall:(I,q)=>{if(!q)Eo(I)}},openclaw:{beforeUninstall:zi},pi:{afterInstall:Yv}};function ib(I){return I in Pu}function sb(I){return I in Su}var yu=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net/tree/plugin","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Ru(I){return I.platform==="kimi-code"&&I.method===go}function Eu(I){return ho({environment:I,cwd:process.cwd()}).method==="hook config"}function ab(I){if(!Eu(I))return yu;return[yu,"",We.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function vu(I,q){return q.map((Q)=>I==="install"&&Q.target==="kimi-code"&&Q.unavailableReason==="already installed"?{...Q,available:!0,unavailableReason:void 0,label:`${Q.label} (global hook installed)`}:Q)}function lb(I,q){if(I.selectKimiInstallMethod)return I.selectKimiInstallMethod();if(!vs(I.input,I.output))return Promise.resolve("global-hook");return Cd({input:I.input,output:I.output,globalHookInstalled:Eu(q)})}async function Tu(I,q,Q,ne=!1,te){let re=ob[q];if(I==="install")re?.beforeInstall?.(Q,ne);if(I==="uninstall")re?.beforeUninstall?.(Q);if(ib(q))return[tb(I,q,Q,ne),I==="uninstall"?await re?.afterUninstall?.(Q):void 0].filter(Boolean).join(`
`);if(sb(q))return rb(I,q,Q,ne);if(I==="uninstall")return q==="opencode"?nb(Q):eb(q,Q);return[await Qv(q,Q,ne,te),await re?.afterInstall?.(Q)].filter(Boolean).join(`
`)}function cb(I){let q=fn({label:"update"},I).errors[0];if(q)throw Error(q)}async function db(I,q=Gt){let Q=await xu(I,q),ne=To(ur(I),"installed-plugins");return{targets:Ps([...Q.hooks.filter((re)=>re.platform!=="copilot-cli"&&re.detected&&re.method!==oo&&re.method!==xi).map((re)=>re.platform),...[Zr,kl,wl].flatMap((re)=>Ao(To(ne,...re))?["copilot-cli"]:[]),...Yr(I,_s)?["claude-code"]:[],...Is(Q.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:Q.codexPluginListOutput,kimiPlugin:Q.hooks.some(Ru)}}async function ub(I){let q=c(),Q=I.output??process.stdout,ne=(I.scriptPath??process.argv[1]??"").split(/[\\/]/),te=ne.find((Fe)=>/^bunx-\d+-/.test(Fe)),re=te!==void 0||ne.includes("_npx")?null:(I.checkLatestVersion??Mn)(),le=async()=>{let Fe=re&&await re;if(Fe?.updateAvailable)Q.write(`
Update available: cc-safety-net ${Fe.currentVersion} → ${Fe.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},ye=db(q,I.fetchVersion??Gt).then(async(Fe)=>{let Ne=new Set(Fe.targets);return{targets:Fe.targets,codexPluginListOutput:Fe.codexPluginListOutput,kimiPlugin:Fe.kimiPlugin,available:new Map(await Promise.all(_n.filter((Ve)=>Ne.has(Ve.target)&&mu.has(Ve.target)).map(async(Ve)=>[Ve.target,await xr(Ve.probeCommand)])))}}),ve=await ar(I.showBanner??!0,()=>({ready:ye,finish:()=>ye}),()=>sr({input:I.input??process.stdin,output:Q}),{loadingMessage:"Checking installed integrations…",output:Q}),Pe=await Promise.resolve().then(()=>(eu(q.tmpdir,process.platform,te),null)).catch((Fe)=>Sr(Fe));if(ve.targets.length===0){if(Q.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),Pe!==null)console.error(Pe);return await le(),Pe===null?0:1}let Ie=ve.targets.some((Fe)=>gu.has(Fe))?await Promise.resolve().then(()=>(Eo(q),null)).catch((Fe)=>Sr(Fe)):null,$e=await Gr(Promise.all(ve.targets.map((Fe)=>{if(Fe==="kimi-code"&&ve.kimiPlugin)return Promise.resolve({message:"Kimi Code plugin skipped: update it in Kimi Code from /plugins (Installed tab, select cc-safety-net, press Enter)",failed:!1});if(mu.has(Fe)&&!ve.available.get(Fe))return Promise.resolve({message:`${cn(Fe)} not found; skipped`,failed:!1});if(Ie!==null&&gu.has(Fe))return Promise.resolve({message:Ie,failed:!0});return Tu("install",Fe,q,!0,ve.codexPluginListOutput).then((Ne)=>({message:Ne,failed:!1}),(Ne)=>({message:Sr(Ne),failed:!0}))})),{loadingMessage:`Updating ${ve.targets.length} integration${ve.targets.length===1?"":"s"}…`,output:Q}),Le=Pe===null?$e:[...$e,{message:Pe,failed:!0}];return Le.forEach((Fe)=>Fe.failed?console.error(Fe.message):Q.write(`${Fe.message}
`)),await le(),Le.some((Fe)=>Fe.failed)?1:0}function Os(I,q={}){return Promise.resolve().then(()=>cb(I)).then(()=>ub(q)).catch((Q)=>(console.error(Sr(Q)),1))}async function Rr(I,q,Q={}){try{let ne=c(),te=await ar(!0,()=>Xv(ne,I,q,Q),()=>sr({input:Q.input??process.stdin,output:Q.output??process.stdout}),{loadingMessage:I==="install"?"Checking available integrations…":"Checking installed integrations…",output:Q.output??process.stdout});if(!te)return(Q.output??process.stdout).write(`Cancelled: nothing was ${I}ed.
`),0;if(te==="update")return(Q.runUpdate??(()=>Os([],{fetchVersion:Q.fetchVersion,input:Q.input,output:Q.output,showBanner:!1})))();let re=Q.output??process.stdout;return await Md(te,async(le)=>{if(le==="kimi-code"&&I==="install"){let ve=await lb(Q,ne);if(ve===null){re.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(ve==="plugin"){re.write(`${ab(ne)}
`);return}}let ye=await Gr(Tu(I,le,ne),{loadingMessage:`${I==="install"?"Installing":"Uninstalling"} ${cn(le)} integration…`,output:re});re.write(`${ye}
`)}),0}catch(ne){return console.error(Sr(ne)),1}}function Sr(I){let q=I instanceof Error?I.message:String(I),Q=typeof I==="object"&&I!==null&&"code"in I?I.code:null;if(Q==="EACCES"||Q==="EPERM")return`${q}
Check file permissions for the target config file and parent directory.`;if(Q==="ENOENT")return`${q}
Check that the target config path and parent directory exist.`;if(Q==="ENOTDIR")return`${q}
Check that every parent path component is a directory.`;return q}import{mkdirSync as yb}from"node:fs";import{dirname as vb}from"node:path";import{createInterface as bb}from"node:readline";import{existsSync as _u,readFileSync as pb}from"node:fs";function $t(I,q){let Q=wt(I,q);return{policy:Q.policy,errors:ge(yt(Q.issues,St,(ne)=>ne.kind==="custom")," "," ")}}function Er(I,q){return $t(I,q).errors}function Au(I,q){return{"safety.level":I.safety.level,...$s("safety.overrides",I.safety.overrides),"workflow.worktree_mode":String(I.workflow.worktree_mode),"destructive_command_protection.enabled":String(I.destructive_command_protection.enabled),...$s("destructive_command_protection.overrides",I.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":Ds(I.destructive_command_protection.allow_paths),"secret_protection.enabled":String(I.secret_protection.enabled),...$s("secret_protection.overrides",I.secret_protection.overrides),"secret_protection.deny_paths":Ds(I.secret_protection.deny_paths),"secret_protection.allow_paths":Ds(I.secret_protection.allow_paths),...q?{"audit.retention_days":String(I.audit.retention_days)}:{}}}function _o(I,q,Q){let ne=Au(I,Q),te=Au(q,Q);return[...new Set([...Object.keys(ne),...Object.keys(te)])].flatMap((re)=>ne[re]===te[re]?[]:[{field:re,before:ne[re],after:te[re]}])}function Tr(I,q){let Q=p(I,q);if(!_u(Q))return{baseline:_(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,I.home),diagnostics:[]};let ne=Lt(Q),te=$t(ne.value,I.home);return{baseline:te.policy,diagnostics:ne.errors.length>0?ne.errors:te.errors}}function Lt(I){if(!_u(I))return{errors:[`${I}: file not found`]};try{return{value:JSON.parse(pb(I,"utf-8")),errors:[]}}catch(q){let Q=q instanceof Error?q.message:String(q);return{errors:[`${I}: ${q instanceof SyntaxError?`Invalid JSON: ${Q}`:Q}`]}}}function Io(I,q){let Q=fb(I)?I:{};return{version:q.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((ne)=>Q[ne]!==void 0).map((ne)=>[ne,Q[ne]]))}}function $s(I,q){return Object.fromEntries(Object.entries(q).flatMap(([Q,ne])=>ne===void 0?[]:[[`${I}.${Q}`,String(ne)]]))}function Ds(I){return I.length===0?"(none)":I.join(", ")}function fb(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}import{chmodSync as mb,existsSync as Iu,mkdirSync as gb,readFileSync as Ou}from"node:fs";import{dirname as hb}from"node:path";function $u(I,q={}){let Q=p(I,q);if(!Iu(Q))return{path:Q,exists:!1,raw:"",policy:N(),errors:[]};let ne=Ou(Q,"utf-8");if(!ne.trim())return{path:Q,exists:!0,raw:ne,policy:N(),errors:["Config file is empty"]};try{let te=$t(JSON.parse(ne),I.home);return{path:Q,exists:!0,raw:ne,policy:te.policy,errors:te.errors}}catch(te){return{path:Q,exists:!0,raw:ne,policy:N(),errors:[`Invalid JSON: ${te instanceof Error?te.message:String(te)}`]}}}function Ln(I,q,Q={}){let ne=p(I,Q),te=$t(q,I.home);if(te.errors.length>0)return{path:ne,policy:N(),errors:te.errors};let re=te.policy;return gb(hb(ne),{recursive:!0,mode:448}),v(de(ne),`${JSON.stringify(re,null,2)}
`,384),mb(ne,384),{path:ne,policy:re,errors:[]}}function Du(I,q){let Q=$t(q,I.home);if(Q.errors.length>0)return{errors:Q.errors};return{preview:Qe(Q.policy,I.env),errors:[]}}function Nu(I,q={}){let Q=p(I,q);if(!Iu(Q))return Ln(I,ae,q);let ne=Ou(Q,"utf-8");if(!ne.trim())return Ln(I,ae,q);try{return Ln(I,_(JSON.parse(ne),I.home),q)}catch{return Ln(I,ae,q)}}var Lu=new Set(["check","apply"]),ju="(unset)";async function Hu(I,q,Q={}){let ne=fn({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},q),te=ne.positionals[0],re=[...ne.errors,...te&&!Lu.has(te)?[`Unknown policy subcommand: ${te}`]:[],...te&&Lu.has(te)&&!ne.positionals[1]?[`policy ${te} requires a file`]:[],...ne.positionals.slice(2).map((Ve)=>`Unexpected policy argument: ${Ve}`)];if(re.length>0){for(let Ve of re)console.error(Ve);return 1}let le=ne.positionals[1];if(!te||!le)return er($r,console.error),1;let ye=Q.cwd??process.cwd(),ve=ne.flags.global?p(I):x(ye);if(!ne.flags.global&&L(I,{cwd:ye}))return console.error(`${ve} is the user policy, not a project policy; use --global for the user scope, or run from a project directory`),1;let Pe=Lt(le),Ie=[...Pe.errors,...Er(Pe.value,I.home).map((Ve)=>`${le}: ${Ve}`),...!ne.flags.global&&Cb(Pe.value)&&Pe.value.audit!==void 0?[`${le}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(Ie.length>0){for(let Ve of Ie)console.error(Ve);return 1}let $e=_(Pe.value,I.home);if(console.log(`Scope: ${ne.flags.global?"user":"project"} (${ve})`),console.log(`Proposal: ${le}`),ne.flags.global)Fu(_(Lt(ve).value,I.home),$e,!0);if(!ne.flags.global){let Ve=Tr(I).baseline;console.log("Effective policy (user + project merged):"),Fu(se(Ve,be(Lt(ve).value,I.home).policy).policy,se(Ve,be(Pe.value,I.home).policy).policy,!1)}if(te==="check")return 0;let Le=Q.input??process.stdin,Fe=Q.output??process.stdout;if(!Le.isTTY||!Fe.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${le}${ne.flags.global?" --global":""}`),1;if(!await wb(`Apply this policy to ${ve}? [y/N] `,Le,Fe))return console.log("Cancelled; nothing was written."),0;return kb(I,ve,Pe.value,$e,ne.flags.global),console.log(`Policy applied: ${ve}`),0}function wb(I,q,Q){let ne=bb({input:q,output:Q,terminal:!1});return new Promise((te)=>{ne.once("close",()=>te(!1)),ne.question(I,(re)=>{te(/^y(es)?$/i.test(re.trim())),ne.close()})})}function kb(I,q,Q,ne,te){if(te){Ln(I,ne);return}yb(vb(q),{recursive:!0}),yn(q,Io(Q,ne))}function Fu(I,q,Q){let ne=_o(I,q,Q);if(ne.length===0){console.log("No changes.");return}console.log(`Changes (${ne.length}):`);for(let te of ne)console.log(`  ${te.field}: ${te.before??ju} -> ${te.after??ju}`)}function Cb(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}import{join as Lw}from"node:path";var Mu="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- `caffeinate`, `exec`, `nice`, `nohup`, `setsid`, `stdbuf`, `time`, and `timeout` are built-in transparent wrappers and need no configuration. Configure only other wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n- `command_tools`: Optional array of shell tools that a plugin adds to an agent and that CC Safety Net does not know. Each entry is a tool name such as `\"ops_bash\"`, or `{ \"name\": \"ops_run_background\", \"cwd\": \"cwd\" }` when the tool takes its working directory in a named argument (otherwise `workdir`, `cwd`, or `working_directory` is read). Use `{ \"name\": \"phone_shell\", \"cwd\": false }` for a tool whose working directory is not on this machine, such as one that runs commands on a remote host: CC Safety Net reads no working-directory argument for it and checks its commands against the session directory. A call to a declared tool with a non-empty string `command` is analyzed like a built-in shell command. User and project lists merge; the user entry wins a name declared in both.\n- Built-in shell and file tools are already analyzed and cannot be declared; `rule verify` reports one declared by hand.\n- Use `cc-safety-net rule tool add ops_bash ops_run_background` to declare tools in the user config, or add `--project` for the project config. Add `--cwd-arg <name>` to name the working-directory argument, or `--no-cwd-arg` to read none.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function Oo(I,q){if(!I.ok){Ku(I);return}Gu(I,q)}function Bu(I,q,Q){if(I.ok)console.log(Q);if(!I.add){Oo(I,`Added rulebook source: ${q}`);return}if(!I.ok){Ku(I);return}if(I.add.added.length>0)console.log(`Added ${I.add.added.length} ${I.add.added.length===1?"rulebook":"rulebooks"} from ${I.add.source} at ${I.add.ref}:`),I.add.added.forEach((ne)=>{console.log(`  - ${ne}`)});if(I.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${I.add.source} at ${I.add.ref}: ${I.add.alreadyConfigured.join(", ")}`);if(I.add.commits.length>0)console.log(`Vendored at ${I.add.commits.map((ne)=>ne.slice(0,7)).join(", ")}.`);Gu(I,"Rule config updated.")}function Gu(I,q){for(let Q of I.changes??[])console.log(Q);console.log(q),console.log(""),xb(I.entries)}function xb(I){if(I.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${I.length}):`);for(let q of I)console.log(`  - ${q.name} ${q.version} (${Pb(q.ruleCount)})`),console.log(`    Source: ${q.spec}`)}function Pb(I){return`${I} ${I===1?"rule":"rules"}`}function qu(I){Kn("Active sources",I.rulebooks,(q)=>[`[${q.source}] ${q.name} ${q.version}`,`  Source: ${q.spec}`]),Kn("Active rules",I.rules,(q)=>[`[${Rb(I,q.name)}] ${q.name}`,...Sb(q),`  Reason: ${q.reason}`]),Kn("Disabled rules",Uu(I,"off"),(q)=>[q.key]),Kn("Reason overrides",Uu(I,"reason"),(q)=>[q.key,`  Reason: ${q.value.reason}`]),Kn("Transparent wrappers",I.transparent_wrappers,(q)=>[q]),Kn("Issues",I.errors,(q)=>[q]),Kn("Warnings",I.warnings,(q)=>[q])}function Vu(I){Kn("Command tools",I,(q)=>typeof q.tool==="string"?[`[${q.scope}] ${q.tool}`]:[`[${q.scope}] ${q.tool.name}`,...q.tool.cwd===void 0?[]:[`  Cwd argument: ${q.tool.cwd===!1?"none":q.tool.cwd}`]])}function Kn(I,q,Q){if(q.length===0){console.log(`${I}: (none)`);return}console.log(`${I} (${q.length}):`);for(let ne of q){let[te,...re]=Q(ne);console.log(`  - ${te}`);for(let le of re)console.log(`    ${le}`)}}function Sb(I){if(!I.match)return[`  Command: ${I.subcommand?`${I.command} ${I.subcommand}`:I.command}`,`  Block args: ${I.block_args.join(", ")}`];return[`  Command: ${[I.command,...I.match.command_path].join(" ")}`,...I.match.any_args?[`  Any args: ${I.match.any_args.join(", ")}`]:[],...I.match.exclude_args?[`  Exclude args: ${I.match.exclude_args.join(", ")}`]:[]]}function Rb(I,q){return I.rulebooks.find((Q)=>Q.rules.includes(q))?.source??"project"}function Uu(I,q){return Object.entries({...I.userConfig?.overrides,...I.projectConfig?.overrides}).filter((Q)=>{if(q==="off")return Q[1]==="off";return!!Q[1]&&typeof Q[1]==="object"}).map(([Q,ne])=>({key:Q,value:ne}))}function Ku(I){for(let q of I.errors)console.error(q)}import{dirname as gp,join as Mo}from"node:path";import{join as Fs,resolve as Fb}from"node:path";function Ar(I){let q=f(I);if(q.errors.length>0)return{ok:!1,result:{ok:!1,errors:q.errors,entries:[]}};return{ok:!0,config:q.config??me}}function Ju(I){yn(I,me)}function zu(I){yn(I,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as Lo}from"node:path";var Eb="custom.";function $o(I){if(I.rulebook_version!==2)return[];let q=I.rules.map((Q)=>({name:Q.name,command:Q.command,block_args:[],match:Q.match,reason:Q.reason,intent:Q.intent}));return(I.tests??[]).flatMap((Q,ne)=>{let te=Ns(C(Q.command));if(te.length===0)return[`tests[${ne}]: could not parse fixture command: ${Q.command}`];let re=te.reduce((le,ye)=>le??F(ye,q)?.id.slice(Eb.length),void 0);if(Q.expect==="blocked"){if(re===Q.rule)return[];let le=re?`"${re}" matched first`:"no rule matched";return[`tests[${ne}]: expected "${Q.rule}" to block "${Q.command}" but ${le}`]}return re?[`tests[${ne}]: expected "${Q.command}" to be allowed but "${re}" matched`]:[]})}function Ns(I){return I.nodes.flatMap((q)=>{if(q.kind==="group"||q.kind==="function")return Ns(q.body);if(q.kind!=="command")return[];let Q=Ae(ce(q.dialect,q.words)).words.map(t);return[...Q.length>0?[Q]:[],...q.nested.flatMap((ne)=>Ns(ne))]})}var Do=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function No(I={}){return{requests:0,responseBytes:0,maxRequests:I.maxRequests??Do.maxRequests,maxResponseBytes:I.maxResponseBytes??Do.maxResponseBytes}}function jn(I){return{controller:new AbortController,budget:No(),resolveUrl:I}}function Wu(I){return I instanceof Error&&I.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function Yu(I){if(I.requests>=I.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");I.requests++}function Zu(I,q){if(q>I.maxResponseBytes-I.responseBytes)throw I.responseBytes+=q,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");I.responseBytes+=q}var ep=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function Xu(I,q,Q=R(Lo(Lo(q)),"rules policy"),ne=jn()){if(T(I))return Ib(I,ne);return _b(I,q,Q)}async function np(I,q,Q,ne,te,re){if(!T(I))return Xu(I,q,Q,ne);let le=te?null:Tb(I,q,Q);if(le)return le;if(!te&&!re)throw Error(`${I} is not vendored; run rule update ${I} to vendor it`);return Xu(I,q,Q,ne)}function Tb(I,q,Q=R(Lo(Lo(q)),"rules policy")){let ne=j(I),te=U(q,ne.name),re=o(s(Q,te));if(re===null)return null;let le=he(Ls(re,`Invalid rulebook ${te}.`));if(le.name!==ne.name)throw Error(`rulebook name "${le.name}" in ${te} must match "${ne.name}"`);return{spec:I,rulebook:le,content:re}}async function tp(I,q={}){if(!oe(I))throw Error(`Invalid GitHub repository source: ${I}`);let[Q,ne]=I.split("/");if(!Q||!ne)throw Error(`Invalid GitHub repository source: ${I}`);if(q.ref!==void 0&&!pe(q.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${q.ref}`);let te=q.operation??jn(),re=q.ref??await Ab(Q,ne,I,te),le=await op(Q,ne,re,I,te),ye=await jo(`https://api.github.com/repos/${Q}/${ne}/git/trees/${le}?recursive=1`,"tree",te),ve=ye.response;if(!ve.ok)throw Error(`Failed to inspect ${I}: GitHub tree returned ${ve.status}`);let Pe=JSON.parse(ye.content);if(!Array.isArray(Pe?.tree))throw Error(`Failed to inspect ${I}: unexpected GitHub tree response`);let Ie=Pe.tree,$e=[...new Set(Ie.flatMap((Le)=>{if(!Le||typeof Le!=="object")return[];let Fe=Le;if(Fe.type!=="blob"||typeof Fe.path!=="string")return[];let Ne=Fe.path.match(Dt);return Ne?.[1]?[Ne[1]]:[]}))].sort();if($e.length===0)throw Error(`No rulebooks found in ${I} under ${Ce}/`);return{source:I,owner:Q,repo:ne,ref:re,commit:le,names:$e}}async function Ab(I,q,Q,ne){let te=await jo(`https://api.github.com/repos/${I}/${q}`,"metadata",ne),re=te.response;if(!re.ok)throw Error(`Failed to inspect ${Q}: GitHub returned ${re.status}`);let ye=JSON.parse(te.content)?.default_branch;if(typeof ye!=="string"||ye==="")throw Error(`Failed to inspect ${Q}: missing default branch`);if(!pe(ye))throw Error(`GitHub returned an invalid default branch: ${ye}`);return ye}function _b(I,q,Q){Nt(I);let ne=U(q,I),te=o(s(Q,ne));if(te===null)throw Error(`Rulebook source not found: ${I}`);let re=rp(Ls(te,"Invalid local rulebook source."));if(re.name!==I)throw Error(`rulebook name "${re.name}" must match local source "${I}"`);return{spec:I,rulebook:re,content:te}}async function Ib(I,q){let Q=j(I),ne=await op(Q.owner,Q.repo,Q.ref,I,q),te=await jo(`https://raw.githubusercontent.com/${Q.owner}/${Q.repo}/${ne}/${Q.path}`,"raw",q),re=te.response;if(!re.ok)throw Error(`Failed to fetch ${I}: GitHub raw returned ${re.status}`);let le=te.content,ye=rp(Ls(le,"Invalid GitHub rulebook response."));if(ye.name!==Q.name)throw Error(`rulebook name "${ye.name}" must match GitHub source "${Q.name}"`);return{spec:I,rulebook:ye,content:le}}function rp(I){let q=he(I),Q=$o(q);if(Q.length>0)throw Error(Q.join("; "));return q}function Ls(I,q){try{return JSON.parse(I)}catch{throw Error(q)}}async function op(I,q,Q,ne,te){let re=await jo(`https://api.github.com/repos/${I}/${q}/commits/${encodeURIComponent(Q)}`,"commit",te),le=re.response;if(!le.ok)throw Error(`Failed to resolve ${ne}: GitHub returned ${le.status}`);let ye=JSON.parse(re.content);if(typeof ye?.sha!=="string"||ye.sha==="")throw Error(`Failed to resolve commit for ${ne}`);return ye.sha}async function Ob(I,q,Q={}){if(Q.signal?.aborted)throw Q.signal.reason;let ne=Q.budget??No(),te=new AbortController,re=()=>te.abort(Q.signal?.reason);Q.signal?.addEventListener("abort",re,{once:!0});let le=!1,ye=setTimeout(()=>{if(te.signal.aborted)return;le=!0,te.abort()},Q.timeoutMs??ep.timeoutMs);try{if(Q.signal?.aborted)throw Q.signal.reason;Yu(ne);let ve=await fetch(I,{signal:te.signal,redirect:"error"});if(!ve.ok)return ip(ve),{response:ve,content:""};return{response:ve,content:await $b(ve,q,ne,()=>te.abort())}}catch(ve){if(le)throw Error("GitHub request timed out",{cause:ve});if(Q.signal?.aborted)throw Q.signal.reason;throw ve}finally{clearTimeout(ye),Q.signal?.removeEventListener("abort",re)}}function jo(I,q,Q){return Ob(Q.resolveUrl?.(I)??I,q,{budget:Q.budget,signal:Q.controller.signal})}async function $b(I,q,Q=No(),ne){let te=ep[`${q}Bytes`],re=Number(I.headers.get("content-length"));if(Number.isFinite(re)&&re>te)throw ip(I),Error(`GitHub ${q} response exceeds ${te} bytes`);if(!I.body)return"";let le=I.body.getReader(),ye=[],ve=0;while(!0){let Pe=await le.read();if(Pe.done)break;try{Zu(Q,Pe.value.byteLength)}catch(Ie){throw ne?.(),Qu(le),Ie}if(ve+=Pe.value.byteLength,ve>te)throw ne?.(),Qu(le),Error(`GitHub ${q} response exceeds ${te} bytes`);ye.push(Buffer.from(Pe.value))}return Buffer.concat(ye,ve).toString("utf-8")}function ip(I){if(!I.body)return;sp(()=>I.body?.cancel())}function Qu(I){sp(()=>I.cancel())}function sp(I){try{Promise.resolve(I()).catch(()=>{})}catch{}}var Db=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function ap(I,q){let Q=dp(I.rules,q);if(Q.length>0)return{ok:!0,specs:Q};return cp(I.rules,q)}function lp(I,q){let Q=dp(I,q);if(Q.length>0)return{ok:!0,specs:Q};let ne=Lb(I,q);if(ne.length>0)return{ok:!0,specs:ne};let te=jb(I,q);if(!te.ok)return te;if(te.specs.length>0)return{ok:!0,specs:te.specs};return cp(I,q)}function cp(I,q){let Q=I.filter((ne)=>js(ne)?.name===q);if(Q.length===1)return{ok:!0,specs:Q};return Nb(q,Q)}function Nb(I,q){return{ok:!1,result:{ok:!1,errors:q.length===0?[`No configured rulebook matches ${I}`]:[`Ambiguous rulebook match ${I}: ${q.join(", ")}`],entries:[]}}}function dp(I,q){return I.filter((Q)=>Q===q)}function Lb(I,q){let Q=q.match(Db),ne=Q?.[1],te=Q?.[2],re=Q?.[3];if(!ne||!te||!re||!pe(re))return[];return up(I,(le)=>le.owner===ne&&le.repo===te&&le.ref===re)}function jb(I,q){if(!oe(q))return{ok:!0,specs:[]};let[Q,ne]=q.split("/"),te=up(I,(le)=>le.owner===Q&&le.repo===ne);if(new Set(te.map((le)=>js(le)?.ref).filter((le)=>!!le)).size<2)return{ok:!0,specs:te};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${q}. Use an explicit ref:`,`  cc-safety-net rule remove ${q}#<ref>`],entries:[]}}}function js(I){try{return j(I)}catch{return null}}function up(I,q){return I.filter((Q)=>{let ne=js(Q);return ne?q(ne):!1})}async function Ho(I,q={}){return Hb(I,q,await Fo(I,q,jn()))}function Hb(I,q,Q){if(!Q.ok)return Q;let ne=hn(I,q),te=[...new Set(Y(ne.configPath,ne.filesystemScope))];if(te.length===0)return Q;return{ok:!1,errors:te,entries:Q.entries}}async function Fo(I,q,Q,ne={},te=new Set,re=new Set){try{let le=hn(I,q),ye=Ar(le.configTarget);if(!ye.ok)return ye.result;let ve=ye.config,Pe=q.only?ap(ve,q.only):{ok:!0,specs:ve.rules};if(!Pe.ok)return Pe.result;let Ie=new Set([...q.refresh?Pe.specs:[],...te]),$e=(nn)=>np(nn,le.configDir,le.filesystemScope,Q,Ie.has(nn),!q.refresh||Ie.has(nn)),Le=await Wb(ve.rules,q.refresh?(nn)=>$e(nn).then((sn)=>({ok:!0,item:sn})).catch((sn)=>{if(Wu(sn))throw sn;return{ok:!1,spec:nn,message:sn instanceof Error?sn.message:String(sn)}}):async(nn)=>({ok:!0,item:await $e(nn)}),Q),Fe=Le.filter((nn)=>!nn.ok),Ne=Le.filter((nn)=>nn.ok).map((nn)=>nn.item),Ve=Ne.flatMap((nn)=>Mb(nn,ve.rules)),Me=Ne.flatMap((nn)=>Ub(nn,re,le)),tn=new Set([...Ve,...Me].map((nn)=>nn.spec)),en=[...Fe,...Ve,...Me],on=[],ln=Gb(on,()=>Ne.flatMap((nn)=>tn.has(nn.spec)||en.length>0&&re.has(nn.spec)?[]:Bb(nn,le,ne,on)));return{ok:en.length===0,errors:en.map((nn)=>`Failed to update ${nn.spec}: ${nn.message}`),entries:Ne.map(Vb),changes:ln}}catch(le){return Ir(le)}}function Mb(I,q){if(!T(I.spec))return[];let Q=Xe(I.spec),ne=q.filter((te)=>te!==I.spec&&Xe(te).toLowerCase()===Q.toLowerCase());if(ne.length===0)return[];return[{ok:!1,spec:I.spec,message:`rulebook name "${Q}" is also claimed by ${ne.join(", ")}; rename one of them`}]}function Ub(I,q,Q){if(!q.has(I.spec)||!T(I.spec))return[];let ne=U(Q.configDir,I.rulebook.name),te=o(s(Q.filesystemScope,ne));if(te===null||te===I.content)return[];return[{ok:!1,spec:I.spec,message:`${ne} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function Bb(I,q,Q,ne){if(!T(I.spec))return[];let te=U(q.configDir,I.rulebook.name),re=s(q.filesystemScope,te),le=o(re);if(le===I.content)return[];return ne?.push({target:re,previous:le}),v(re,I.content,void 0,Q._testAfterPolicyRename),qb(I,le)}function Gb(I,q){try{return q()}catch(Q){for(let ne of[...I].reverse()){if(ne.previous===null){V(ne.target);continue}v(ne.target,ne.previous)}throw Q}}function qb(I,q){if(q===null)return[`Vendored ${I.spec} (${I.rulebook.version})`];let Q=Te(q),ne="problem"in Q?null:Q.rulebook,te=new Map(ne?.rules.map((le)=>[le.name,JSON.stringify(le)])??[]),re=new Set(I.rulebook.rules.map((le)=>le.name));return[`Updated ${I.spec} (${ne?.version??"unreadable"} -> ${I.rulebook.version})`,...[...re].filter((le)=>!te.has(le)).map((le)=>`  + ${le}`),...[...te.keys()].filter((le)=>!re.has(le)).map((le)=>`  - ${le}`),...I.rulebook.rules.filter((le)=>{let ye=te.get(le.name);return ye!==void 0&&ye!==JSON.stringify(le)}).map((le)=>`  ~ ${le.name}`)]}function Vb(I){return{spec:I.spec,name:I.rulebook.name,version:I.rulebook.version,ruleCount:I.rulebook.rules.length}}async function pp(I,q,Q={}){return Kb(I,q,Q,jn())}async function Kb(I,q,Q,ne,te={}){let re=null,le=!1;try{let ye=hn(I,Q),ve=o(ye.configTarget);re={target:ye.configTarget,content:ve};let Pe=Ar(ye.configTarget);if(!Pe.ok)return Pe.result;let Ie=Pe.config,$e=oe(q)?await tp(q,{ref:Q.ref,operation:ne}):null,Le=$e?Jb($e,Q.rulebooks):[],Fe=$e?Le.map((en)=>zb(Ie.rules,$e,en)??`${q}#${$e.ref}/${en}`):[q],Ne=Fe.filter((en)=>!Ie.rules.includes(en)),Ve=[...Ie.rules,...Ne];if(Ve.length>Ee)return Yb();if(Ve.length!==Ie.rules.length)le=!0,yn(ye.configTarget,{...Ie,rules:Ve},void 0,te._testAfterPolicyRename);let Me=await Fo(I,Q,ne,te,new Set(Ne),new Set(Ne));if(!Me.ok)_r(ye.configTarget,ve);if(!Me.ok||!$e)return Me;let tn=Le.filter((en,on)=>Ne.includes(Fe[on]??""));return{...Me,add:{source:q,ref:$e.ref,selected:Le,added:tn,alreadyConfigured:Le.filter((en)=>!tn.includes(en)),commits:Ne.length>0?[$e.commit]:[]}}}catch(ye){if(le&&re)try{_r(re.target,re.content)}catch(ve){return Ir(ve)}return Ir(ye)}}function Jb(I,q){let Q=q?[...new Set(q)]:I.names,ne=Q.filter((te)=>!I.names.includes(te));if(ne.length>0)throw Error(`Rulebooks not found in ${I.source} at ${I.ref}: ${ne.join(", ")}
Available rulebooks: ${I.names.join(", ")}`);return Q}function zb(I,q,Q){let ne=`${q.source}#${q.ref}/${Q}`;if(I.includes(ne))return ne;let te=`${q.source}#${q.commit}/${Q}`;return I.find((re)=>re===te)}async function Wb(I,q,Q=jn()){if(I.length>Ee)throw Error(ke);let ne=[],te=0,re,le=Array.from({length:Math.min(I.length,Do.concurrency)},async()=>{while(!re){let ye=te;if(ye>=I.length)return;te++;try{ne[ye]=await q(I[ye],ye,Q.controller.signal)}catch(ve){if(!re)re={value:ve},te=I.length,Q.controller.abort(ve);return}}});if(await Promise.all(le),re)throw re.value;return ne}function Yb(){return{ok:!1,errors:[ke],entries:[]}}async function fp(I,q,Q={}){try{return await Zb(I,q,Q,{})}catch(ne){return Ir(ne)}}async function Zb(I,q,Q,ne){let te=hn(I,Q),re=f(te.configTarget);if(re.errors.length>0)return{ok:!1,errors:re.errors,entries:[]};if(!re.config)return{ok:!1,errors:[`No config found at ${te.configPath}`],entries:[]};let le=lp(re.config.rules,q);if(!le.ok)return le.result;let ye=Q.deleteSource?Xb(te.configDir,le.specs,te.filesystemScope):{ok:!0,dirs:[]};if(!ye.ok)return ye.result;let ve=o(te.configTarget);if(ve===null)return Ir(Error("Rules config is unavailable."));try{yn(te.configTarget,{...re.config,rules:re.config.rules.filter(($e)=>!le.specs.includes($e))},void 0,ne._testAfterPolicyRename)}catch($e){throw _r(te.configTarget,ve),$e}let Pe=await Fo(I,Q,jn(),ne);if(!Pe.ok)return _r(te.configTarget,ve),Pe;let Ie=Qb(ye.dirs,ne,te.filesystemScope);if(!Ie.ok){_r(te.configTarget,ve);let $e=await Fo(I,Q,jn(),ne);if(!$e.ok)return{ok:!1,errors:[...Ie.result.errors,...$e.errors],entries:$e.entries};return Ie.result}return Pe}function Xb(I,q,Q){let ne=q.flatMap((ye)=>m.test(ye)?[]:["--delete-source can only delete local rulebook sources"]),te=q.map((ye)=>Fs(I,ye)),re=ne.length>0?[]:te.flatMap((ye)=>mp(ye,Q)),le=[...ne,...re];return le.length>0?{ok:!1,result:{ok:!1,errors:le,entries:[]}}:{ok:!0,dirs:te}}function mp(I,q){let Q=Fb(I),ne=s(q,Q),te=Se(ne);if(!te)return[`Local rulebook source directory not found: ${I}`];let re=te.find((le)=>le.name==="rulebook.json");if(!re)return[`Local rulebook source directory is missing rulebook.json: ${I}`];if(re.kind!=="file")throw new i(q.label);if(o(s(q,Fs(Q,"rulebook.json"))),te.length>1)return[`Local rulebook source directory contains extra files: ${I}. delete manually if you really want to remove the directory.`];return[]}function Qb(I,q,Q){let ne=I.flatMap((te)=>{try{if(!Se(s(Q,te)))return[];let re=mp(te,Q);if(re.length>0)return re;return ew(te,q,Q),[]}catch(re){return[`Failed to delete local rulebook source ${te}: ${re instanceof Error?re.message:String(re)}`]}});return ne.length>0?{ok:!1,result:{ok:!1,errors:ne,entries:[]}}:{ok:!0}}function ew(I,q,Q){if(q._testDeleteLocalSourceDir){q._testDeleteLocalSourceDir(I);return}V(s(Q,Fs(I,we))),Ot(s(Q,I))}function _r(I,q){if(q===null){V(I);return}v(I,q)}function Ir(I){return{ok:!1,errors:[I instanceof Error?I.message:String(I)],entries:[]}}var nw=".safety-net.json",tw="~/.cc-safety-net/config.json";async function vp(I,q){let Q=L(I,{cwd:q.cwd});if(Q)console.log(`Skipped the project scope: ${D(q.cwd)} is the user rule config, not a project rule config`);return[Q||await hp(I,{legacyPath:Ut(q.cwd),configPath:D(q.cwd),defaultRulebookName:"project-rules",migratedFrom:nw,cleanup:q.cleanup,syncOptions:{cwd:q.cwd}}),await hp(I,{legacyPath:Bt(I),configPath:K(I),defaultRulebookName:"user-rules",migratedFrom:tw,cleanup:q.cleanup,syncOptions:{cwd:q.cwd,global:!0}})].every((te)=>te)?0:1}async function hp(I,q){let Q=hn(I,q.syncOptions),ne=s(Q.filesystemScope,q.legacyPath),te=o(ne);if(te===null)return console.log(`No legacy config found at ${q.legacyPath}`),!0;let re=ow(te);if(!re.ok){for(let Fe of re.errors)console.error(Fe);return!1}let le=f(Q.configTarget);if(le.errors.length>0){for(let Fe of le.errors)console.error(Fe);return!1}let ye=le.config??me,ve=iw(gp(q.configPath),ye.rules,q.defaultRulebookName,q.migratedFrom,Q.filesystemScope),Pe=Mo(gp(q.configPath),ve,"rulebook.json"),Ie=s(Q.filesystemScope,Pe),$e=[yp(Q.configTarget),yp(Ie)],Le=await rw(I,q,Q.configTarget,Ie,ve,re.config.rules,{...ye,rules:ye.rules.includes(ve)?ye.rules:[...ye.rules,ve]});if(!Le.ok){lw($e);for(let Fe of Le.errors)console.error(Fe);return!1}if(!q.cleanup)return console.log(`Migrated legacy config at ${q.legacyPath}. Legacy file is no longer used.`),!0;if(!aw(Q.configTarget,Ie,ve,q.migratedFrom,re.config.rules))return console.error(`Migration cleanup verification failed for ${q.legacyPath}`),!1;return V(ne),console.log(`Deleted legacy config at ${q.legacyPath}`),!0}async function rw(I,q,Q,ne,te,re,le){try{return yn(Q,le),yn(ne,sw(te,q.migratedFrom,re)),await Ho(I,q.syncOptions)}catch(ye){return{ok:!1,errors:[ye instanceof Error?ye.message:String(ye)]}}}function ow(I){try{let q=JSON.parse(I),Q=Qo(q);if(Q.errors.length>0)return{ok:!1,errors:Q.errors};return{ok:!0,config:{version:1,rules:q.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function iw(I,q,Q,ne,te){let re=q.find((le)=>cw(s(te,Mo(I,le,"rulebook.json")))===ne);if(re)return re;if(o(s(te,Mo(I,Q,"rulebook.json")))===null)return Q;for(let le=2;;le++){let ye=`${Q}-${le}`;if(o(s(te,Mo(I,ye,"rulebook.json")))===null)return ye}}function sw(I,q,Q){return{rulebook_version:1,name:I,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:q,allowed_commands:[...new Set(Q.map((ne)=>ne.command))],rules:Q,tests:Q.map((ne)=>({command:[ne.command,ne.subcommand,ne.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:ne.name}))}}function aw(I,q,Q,ne,te){if(!f(I).config?.rules.includes(Q))return!1;try{let le=o(q);if(le===null)return!1;let ye=JSON.parse(le);return ye.migrated_from===ne&&JSON.stringify(ye.rules)===JSON.stringify(te)}catch{return!1}}function yp(I){return{target:I,content:o(I)}}function lw(I){for(let q of I){if(q.content===null){V(q.target);continue}v(q.target,q.content)}}function cw(I){let q=o(I);if(q===null)return null;try{let Q=JSON.parse(q);return typeof Q.migrated_from==="string"?Q.migrated_from:null}catch{return null}}import{mkdir as dw,readFile as uw,writeFile as pw}from"node:fs/promises";import{dirname as fw,join as mw}from"node:path";var gw=86400000,hw=604800000;async function wp(I,q=Date.now()){if(I.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let Q=ut(I);if(!Q)return null;let ne=mw(Q,".cc-safety-net","update-check.json"),te=await yw(ne,q);if(!te.lastCheck||q-te.lastCheck>gw){let ye=await Mn();if(te.lastCheck=q,ye.latestVersion)te.latestVersion=ye.latestVersion;if(!await bp(ne,te))return null;if(ye.error)return null}let re=te.latestVersion,le=un();if(!re||!ii(re,le))return null;if(te.notifiedVersion===re&&te.notifiedAt!==void 0&&q-te.notifiedAt<hw)return null;if(te.notifiedVersion=re,te.notifiedAt=q,!await bp(ne,te))return null;return`UPDATE_AVAILABLE: cc-safety-net v${re} is available (running v${le}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function yw(I,q){let Q=await uw(I,"utf8").then((re)=>JSON.parse(re)).catch(()=>{return});if(!Q||typeof Q!=="object"||Array.isArray(Q))return{};let ne=Q,te=(re)=>typeof re==="number"&&Number.isFinite(re)&&re<=q?re:void 0;return{lastCheck:te(ne.lastCheck),latestVersion:typeof ne.latestVersion==="string"?ne.latestVersion:void 0,notifiedVersion:typeof ne.notifiedVersion==="string"?ne.notifiedVersion:void 0,notifiedAt:te(ne.notifiedAt)}}async function bp(I,q){return dw(fw(I),{recursive:!0,mode:448}).then(()=>pw(I,JSON.stringify(q),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as Cw,resolve as Us}from"node:path";var kp=new Map([["Bash","posix"],["PowerShell","powershell"],["Monitor","posix"]]);var Cp=new Map([["Bash","auto"]]);var xp=new Map([["bash","auto"],["Bash","auto"],["powershell","powershell"],["PowerShell","powershell"]]);var Pp=new Map([["Shell","auto"]]);var Sp=new Map([["exec","auto"]]),Rp="write_to_process";var Ep=new Map([["Execute","auto"]]);var Tp=new Map([["run_shell_command","auto"]]);var Ap=new Map([["run_terminal_command","auto"],["run_terminal_cmd","auto"],["monitor","auto"],["bash","auto"],["Shell","auto"]]);var _p=new Map([["terminal","posix"]]);var Ip=new Map([["Bash","posix"]]);var Op="exec";var ww=[["antigravity-cli",[...il.keys(),sl]],["claude-code",[...kp.keys()]],["codex",[...Cp.keys()]],["copilot-cli",[...xp.keys()]],["cursor",[...Pp.keys()]],["deepseek-harness",[...ze.keys()]],["devin",[...Sp.keys(),Rp]],["droid",[...Ep.keys()]],["gemini-cli",[...Tp.keys()]],["grok-build",[...Ap.keys()]],["hermes-agent",[..._p.keys()]],["kimi-code",[...Ip.keys()]],["openclaw",[Op]],["opencode",[it,Oe]],["pi",[...ct.keys()]]].flatMap(([I,q])=>q.map((Q)=>({name:Q,integration:cn(I)}))),$p="and is already analyzed. Built-in tools cannot be declared.";function Uo(I){let q=He(I),Q=[...new Set(ww.filter((ne)=>He(ne.name)===q).map((ne)=>ne.integration))].sort((ne,te)=>ne.localeCompare(te));if(Q.length>0)return`"${I}" is a built-in shell tool of ${kw(Q)}, ${$p}`;if(S(I)!=="unknown")return`"${I}" is a built-in file tool, ${$p}`;return}function kw(I){return I.length===1?I[0]??"":`${I.slice(0,-1).join(", ")} and ${I.at(-1)}`}var Np="CC Safety Net Config",xw="═".repeat(Np.length),Pw="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",Sw=new Set(["rule.json","rule.lock","cache"]);function Lp(I,q={}){try{return Rw(I,q)}catch(Q){if(Q instanceof i)return console.error(Q.message),1;throw Q}}function Rw(I,q){let Q=q.cwd??process.cwd(),ne=ie(I,{cwd:Q}),te=Bt(I),re=Ut(Q),le=Us(Q,Ce),ye=s(ne.userScope,te),ve=s(ne.projectScope,re),Pe=!1,Ie=!1,$e=[],Le=[],Fe=Ew(s(ne.projectScope,le));if(Aw(),o(ne.userConfigTarget)!==null){let Ne=Hn(ne.userConfigTarget);if(Ne.errors.push(...Y(ne.userConfigPath,ne.userScope),...Dp(ne.userConfigTarget)),$e.push({scope:"User",path:ne.userConfigPath,result:Ne,schema:"rules",target:ne.userConfigTarget}),Ne.errors.length>0)Pe=!0}if(o(ye)!==null)if(Ie=!0,o(ne.userConfigTarget)!==null)Le.push(Bo("user","cleanup"));else{let Ne=ei(ye);if($e.push({scope:"User",path:te,result:Ne,schema:"legacy",inactive:!0,target:ye}),Le.push(Bo("user",Ne.errors.length>0?"fix-or-delete":"migrate")),Ne.errors.length>0)Pe=!0}if(o(ne.projectConfigTarget)!==null){let Ne=Hn(ne.projectConfigTarget);if(Ne.errors.push(...Y(ne.projectConfigPath,ne.projectScope),...Dp(ne.projectConfigTarget)),$e.push({scope:"Project",path:Us(ne.projectConfigPath),result:Ne,schema:"rules",target:ne.projectConfigTarget}),Ne.errors.length>0)Pe=!0;if(o(ve)!==null)Ie=!0,Le.push(Bo("project","cleanup"))}else if(o(ve)!==null){Ie=!0,Pe=!0;let Ne=ei(ve);$e.push({scope:"Project",path:Us(re),result:Ne,schema:"legacy",inactive:!0,target:ve}),Le.push(Bo("project",Ne.errors.length>0?"fix-or-delete":"migrate"))}if(Fe?.result.errors.length)Pe=!0;if($e.length===0&&!Fe)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Ne of $e)if(Ne.inactive)Iw(Ne.scope,Ne.path,Ne.result);else if(Ne.result.errors.length>0)Ow(Ne.scope,Ne.path,Ne.result.errors);else{if(Ne.schema==="rules"&&Nw(Ne.target))console.log(`
Added $schema to ${Ne.scope.toLowerCase()} config.`);_w(Ne.scope,Ne.path,Ne.result,Ne.schema)}for(let Ne of Le)console.error(`
${We.red(Ne)}`);if(Fe)if(Fe.result.errors.length>0)Dw(Fe.path,Fe.result.errors);else $w(Fe.path,Fe.result);if(Pe)return console.error(`
Config validation failed.`),1;return console.log(Ie?`
Configs valid with warnings.`:`
All configs valid.`),0}function Dp(I){return(f(I).config?.command_tools??[]).flatMap((q)=>Uo(typeof q==="string"?q:q.name)??[])}function Bo(I,q){let Q=`legacy ${I} config`;if(q==="cleanup")return`Warning: Legacy ${I} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(q==="migrate")return`Warning: Legacy ${I} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${I} config is no longer supported. Fix or delete the ${Q}, then run \`npx -y cc-safety-net rule migrate\`.`}function Ew(I){if(Se(I)===null)return null;let q=Tw(I);if(q.ruleNames.size===0&&q.errors.length===0)return null;return{path:I.path,result:q}}function Tw(I){let q=[],Q=new Set,ne=(Se(I)??[]).filter((te)=>!Sw.has(te.name)).sort((te,re)=>te.name.localeCompare(re.name));if(ne.length===0)return{errors:q,ruleNames:Q};for(let te of ne){if(!m.test(te.name)){q.push(`rulebook directory names must match ${m}: ${te.name}`);continue}if(te.kind!=="directory"){q.push(`${te.name} must be a rulebook directory`);continue}let re=s(I.scope,Cw(I.path,te.name,"rulebook.json")),le=o(re);if(le===null){q.push(`${te.name}/rulebook.json is required`);continue}try{let ye;try{ye=JSON.parse(le)}catch{q.push(`${te.name}/rulebook.json: invalid JSON`);continue}let ve=he(ye);if(ve.name!==te.name){q.push(`rulebook name "${ve.name}" must match folder "${te.name}"`);continue}let Pe=$o(ve);if(Pe.length>0){q.push(...Pe.map((Ie)=>`${te.name}/rulebook.json: ${Ie}`));continue}Q.add(te.name)}catch(ye){q.push(ye instanceof Error?`${te.name}/rulebook.json: ${ye.message}`:`${te.name}/rulebook.json: ${String(ye)}`)}}return{errors:q,ruleNames:Q}}function Aw(){console.log(Np),console.log(xw)}function _w(I,q,Q,ne){if(console.log(`
✓ ${I} config: ${q}`),console.log(`  Schema: ${ne==="rules"?"rulebook sources":"legacy inline rules"}`),Q.ruleNames.size>0){console.log(`  ${ne==="rules"?"Sources":"Rules"}:`);let te=1;for(let re of Q.ruleNames)console.log(`    ${te}. ${re}`),te++}else console.log(`  ${ne==="rules"?"Sources":"Rules"}: (none)`)}function Iw(I,q,Q){if(console.error(`
✗ Legacy ${I.toLowerCase()} config: ${q}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),Q.errors.length>0){console.error("  Errors:");let ne=1;for(let te of Q.errors)for(let re of te.split("; "))console.error(`    ${ne}. ${re}`),ne++;return}if(Q.ruleNames.size>0){console.error("  Rules:");let ne=1;for(let te of Q.ruleNames)console.error(`    ${ne}. ${te}`),ne++;return}console.error("  Rules: (none)")}function Ow(I,q,Q){jp(`${I} config`,q,Q)}function $w(I,q){console.log(`
✓ GitHub source rules: ${I}`),console.log("  Rulebooks:");let Q=1;for(let ne of q.ruleNames)console.log(`    ${Q}. ${ne}`),Q++}function Dw(I,q){jp("GitHub source rules",I,q)}function jp(I,q,Q){console.error(`
✗ ${I}: ${q}`),console.error("  Errors:");let ne=1;for(let te of Q)for(let re of te.split("; "))console.error(`    ${ne}. ${re}`),ne++}function Nw(I){try{let q=o(I);if(q===null)return!1;let Q=JSON.parse(q);if(Q.$schema)return!1;return v(I,JSON.stringify({$schema:Pw,...Q},null,2)),!0}catch(q){if(q instanceof i)throw q;return!1}}var Fp=new Set(["init","add","remove","update","sync","list","wrapper","tool","migrate","doc","verify"]),jw=new Set(["init","add","remove","update","sync","wrapper"]),Mp=new Set(["add","remove","list"]),Fw="cc-safety-net/rulebooks";async function Up(I,q){try{return await Hw(I,q)}catch(Q){if(Q instanceof i)return console.error(Q.message),1;throw Q}}async function Hw(I,q){let Q=Uw(q),ne=Q.help?Mw(Q.positionals):null;if(ne)return er(ne),0;if(Q.errors.length>0){for(let Pe of Q.errors)console.error(Pe);return 1}let te=Q.positionals[0];if(!te)return er(Mt,console.error),1;let re=Q.positionals[1],le={global:Q.global},ye=process.cwd();if((te==="tool"?Q.project:!Q.global&&jw.has(te)&&!(te==="wrapper"&&re==="list"))&&L(I,{cwd:ye}))return console.error(`${D(ye)} is the user rule config, not a project rule config; ${te==="tool"?"drop --project":"use --global"} for the user scope, or run from a project directory`),1;if(te==="init"){let Pe=hn(I,le);qw(Pe.configTarget);let Ie=Lw(Pe.configDir,"example-rules","rulebook.json"),$e=s(Pe.filesystemScope,Ie);if(Q.example&&o($e)===null)zu($e);let Le=Y(Pe.configPath,Pe.filesystemScope);for(let Fe of Le)console.error(Fe);if(Le.length>0)return 1;return console.log("Rule config initialized."),0}if(te==="add"){let Pe=Bp(Q);if(!Pe)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let Ie=hn(I,le),$e=await pp(I,Pe,{...le,ref:Q.ref,rulebooks:Q.only.length>0?Q.only:void 0});return Bu($e,Pe,`Scope: ${Q.global?"user":"project"} (${Ie.configDir})`),$e.ok?0:1}if(te==="remove"){if(!re)return console.error("rule remove requires a source"),1;let Pe=await fp(I,re,{...le,deleteSource:Q.deleteSource});return Oo(Pe,`Removed rulebook source: ${re}`),Pe.ok?0:1}if(te==="update"){let Pe=await Ho(I,{...le,only:re,refresh:!0});return Oo(Pe,"Rule config updated."),Pe.ok?0:1}if(te==="sync")return Za(I,{global:Q.global});if(te==="list"){let Pe=J(I,{cwd:ye});return qu(Pe),Pe.errors.length>0?1:0}if(te==="wrapper")return Vw(I,Q);if(te==="tool")return Jw(I,Q,ye);if(te==="migrate")return vp(I,{cleanup:Q.cleanup,cwd:ye});if(te==="doc"){console.log(Mu);let Pe=await wp(I);if(Pe)console.error(Pe);return 0}if(te==="verify")return Lp(I);return 1}function Mw(I){if(I.length===0)return Mt;let q=Mt.subcommands.filter((ne)=>ne.usage.split(" ")[0]===I[0]);if(q.length===0)return null;if(I.length===1&&q.length>1)return{name:`rule ${I[0]}`,description:`Subcommands of rule ${I[0]}`,usage:`rule ${I[0]} <subcommand>`,subcommands:q,options:[]};let Q=I.length===1?q[0]:q.find((ne)=>ne.usage.split(" ")[1]===I[1]);if(!Q)return null;return{name:`rule ${I[0]}`,description:Q.description,usage:`rule ${Q.usage}`,options:I[0]==="add"?Yo:[],examples:I[0]==="add"?Zo:void 0}}function Uw(I){let q=fn({label:"rule",booleans:{global:["-g","--global"],project:["--project"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"],noCwdArg:["--no-cwd-arg"]},values:{ref:["--ref"],cwdArg:["--cwd-arg"]},lists:{only:["--only"]},positionals:"list"},I),Q={...q.flags,ref:q.values.ref,cwdArg:q.values.cwdArg,only:q.lists.only??[],help:q.help,positionals:q.positionals,errors:q.errors};return Bw(Q),Q}function Bw(I){let[q]=I.positionals;if(q&&!Fp.has(q))I.errors.push(`Unknown rule subcommand: ${q}`);if(I.deleteSource&&q!=="remove")if(q&&Fp.has(q))I.errors.push(`Unknown option for rule ${q}: --delete-source`);else I.errors.push("--delete-source is only valid with 'rule remove'");if(I.cleanup&&q!=="migrate")I.errors.push(Fn(q,"--cleanup"));if(I.example&&q!=="init")I.errors.push(Fn(q,"--example"));if(I.ref&&q!=="add")I.errors.push(Fn(q,"--ref"));if(I.only.length>0&&q!=="add")I.errors.push(Fn(q,"--only"));let Q=q==="tool"?I.positionals[1]:void 0,ne=Q&&Mp.has(Q)?`tool ${Q}`:q;if(I.project&&Q!=="add"&&Q!=="remove")I.errors.push(Fn(ne,"--project"));if(I.cwdArg!==void 0&&Q!=="add")I.errors.push(Fn(ne,"--cwd-arg"));if(I.noCwdArg&&Q!=="add")I.errors.push(Fn(ne,"--no-cwd-arg"));if(I.noCwdArg&&I.cwdArg!==void 0&&Q==="add")I.errors.push("rule tool add takes --cwd-arg or --no-cwd-arg, not both");if(q==="tool"&&I.global)I.errors.push(Fn(q,"--global"));if(q==="add")Gw(I);if(q==="migrate"){if(I.global)I.errors.push(Fn(q,"--global"));if(I.positionals.length>1)I.errors.push(`Unexpected rule migrate argument: ${I.positionals[1]}`)}else if(q==="wrapper")Hp(I,"a command");else if(q==="tool")Hp(I,"a tool name");else if(I.positionals.length>2)I.errors.push(`Unexpected rule argument: ${I.positionals[2]}`);if(q==="list"&&I.global)I.errors.push("Unknown option for rule list: --global")}function Bp(I){if(I.positionals[1])return I.positionals[1];if(I.ref||I.only.length>0)return Fw;return}function Gw(I){let q=Bp(I);if(!q)return;if((I.ref||I.only.length>0)&&!oe(q)){if(I.ref)I.errors.push(`--ref can only select a ref for an owner/repo source: ${q}`);if(I.only.length>0)I.errors.push("--only can only select rulebooks from an owner/repo source");return}if(I.ref&&!pe(I.ref))I.errors.push(`--ref must use valid path segments: ${I.ref}`);let Q=I.only.filter((ne)=>!m.test(ne));if(Q.length>0)I.errors.push(`Invalid rulebook names: ${Q.join(", ")}`)}function Fn(I,q){return I?`Unknown option for rule ${I}: ${q}`:`Unknown option for rule: ${q}`}function Hp(I,q){let Q=I.positionals[0],ne=I.positionals[1],te=I.positionals[2];if(!ne){I.errors.push(`rule ${Q} requires add, remove, or list`);return}if(!Mp.has(ne)){I.errors.push(`Unknown rule ${Q} action: ${ne}`);return}if(ne==="list"){if(te)I.errors.push(`Unexpected rule ${Q} argument: ${te}`);return}if(!te){I.errors.push(`rule ${Q} ${ne} requires ${q}`);return}if(Q!=="tool"&&I.positionals.length>3)I.errors.push(`Unexpected rule ${Q} argument: ${I.positionals[3]}`)}function qw(I){if(o(I)===null){Ju(I);return}let q=f(I);if(!q.config)return;yn(I,q.config)}async function Vw(I,q){let Q=q.positionals[1],ne=q.positionals[2],te=hn(I,{global:q.global}).configTarget;if(Q==="list"){let ve=f(te);if(ve.errors.length>0){for(let Pe of ve.errors)console.error(Pe);return 1}return Kw(ve.config?.transparent_wrappers??[]),0}if(!ne||!P.test(ne))return console.error("transparent wrapper must match command pattern"),1;if(Ke(ne))return console.error(`reserved command "${ne}" cannot be a wrapper`),1;let re=f(te);if(re.errors.length>0){for(let ve of re.errors)console.error(ve);return 1}let le=re.config??me,ye=Q==="add"?[...new Set([...le.transparent_wrappers??[],ne])]:(le.transparent_wrappers??[]).filter((ve)=>ve!==ne);return yn(te,{...le,transparent_wrappers:ye}),console.log(Q==="add"?`Added transparent wrapper: ${ne}`:`Removed transparent wrapper: ${ne}`),0}function Kw(I){if(I.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${I.length}):`);for(let q of I)console.log(`  - ${q}`)}function Jw(I,q,Q){let ne=q.positionals[1],te=[...new Set(q.positionals.slice(2))];if(ne==="list")return zw(I,Q);let re=[...te.flatMap((Ie)=>{if(!Ye.test(Ie))return[`"${Ie}" is not a tool name: ${Re}.`];let $e=ne==="add"?Uo(Ie):void 0;return $e?[$e]:[]}),...q.cwdArg!==void 0&&!Ye.test(q.cwdArg)?[`"${q.cwdArg}" is not an argument name: ${Re}.`]:[]];if(re.length>0){for(let Ie of re)console.error(We.red(`Error: ${Ie}`));return 1}let le=hn(I,{global:!q.project}),ye=Ar(le.configTarget);if(!ye.ok){for(let Ie of ye.result.errors)console.error(Ie);return 1}let ve=q.noCwdArg?!1:q.cwdArg,Pe=te.reduce((Ie,$e)=>{let Le=ve===void 0?$e:{name:$e,cwd:ve},Fe=(Ne)=>(typeof Ne==="string"?Ne:Ne.name)===$e;if(ne==="remove")return Ie.filter((Ne)=>!Fe(Ne));return Ie.some(Fe)?Ie.map((Ne)=>Fe(Ne)?Le:Ne):[...Ie,Le]},ye.config.command_tools??[]);yn(le.configTarget,{...ye.config,command_tools:Pe});for(let Ie of te)console.log(ne==="add"?`Added command tool: ${Ie}${ve===void 0?"":ve===!1?" (no cwd argument)":` (cwd argument: ${ve})`}`:`Removed command tool: ${Ie}`);return console.log(`Scope: ${q.project?"project":"user"} (${le.configPath})`),0}function zw(I,q){let Q=(L(I,{cwd:q})?["user"]:["user","project"]).map((te)=>{let re=hn(I,{global:te==="user"});return{scope:te,path:re.configPath,...f(re.configTarget)}}),ne=Q.flatMap((te)=>te.errors.map((re)=>`${te.path}: ${re}`));if(ne.length>0){for(let te of ne)console.error(te);return 1}return Vu(Q.flatMap((te)=>(te.config?.command_tools??[]).map((re)=>({scope:te.scope,tool:re})))),0}import{sep as ek}from"node:path";import{existsSync as Ww,readFileSync as Yw}from"node:fs";import{join as Zw}from"node:path";async function Xw(I){if(I.isTTY)return null;return(await vt(I).catch(()=>null))?.trim()||null}function Qw(I){let q=I.env.get("CLAUDE_SETTINGS_PATH");if(q)return q;return Zw(Wr(I),"settings.json")}function Bs(I){let q=Qw(I);if(!Ww(q))return!1;try{let Q=Yw(q,"utf-8"),ne=JSON.parse(Q);if(!ne.enabledPlugins)return!1;let te="cc-safety-net@cc-marketplace";if(!(te in ne.enabledPlugins))return!1;return ne.enabledPlugins[te]===!0}catch(Q){if(k(r.debug,I.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${q}: ${Q instanceof Error?Q.message:String(Q)}`);return!1}}async function Gs(I,q=process.stdin){let Q=Bs(I),ne;if(!Q)ne="\uD83D\uDEE1️ CC Safety Net ❌";else{let re=w(I,{cwd:process.cwd()}),le=re.policy,ye=O(le,I.env),ve=Object.values(X(le,ye.capabilities)).some(($e)=>$e.changesInherited),Pe={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[ve?"custom":ye.effectiveLevel],Ie=re.policyScopes&&!re.policyScopes.weakeningsIgnored&&re.policyScopes.weakenings.length>0?"\uD83D\uDD3B":"";ne=`\uD83D\uDEE1️ CC Safety Net ${Pe}${ye.worktreeMode?"\uD83C\uDF33":""}${Ie}${re.state==="degraded"?"⚠️":""}`}let te=await Xw(q);if(te&&!te.startsWith("{"))console.log(`${te} | ${ne}`);else console.log(ne)}function Gp(I){let q=w(I,{cwd:process.cwd()}),Q=q.policy,ne=O(Q,I.env),te=!!process.env.NO_COLOR||!process.stdout.isTTY,re=Math.min(process.stdout.columns||80,100),le=te?"ok":"✔",ye=te?"OFF":"✘",ve=(Ve,Me)=>{let tn=`  ${Ve.padEnd(13)}${Me}`;return(tn.length>re?`${tn.slice(0,re-1)}…`:tn).replaceAll(ye,We.red(ye))},Pe=Object.values(X(Q,ne.capabilities)).some((Ve)=>Ve.changesInherited),Ie=(Ve)=>Ve===I.home||Ve.startsWith(`${I.home}${ek}`)?`~${Ve.slice(I.home.length)}`:Ve,$e={ready:We.green,degraded:We.yellow}[q.state],Le=q.policyScopes?.weakenings??[],Fe=[...Bs(I)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...q.diagnostics],Ne=te?"-":"·";console.log([`${te?"":"\uD83D\uDEE1️  "}CC Safety Net — ${$e(q.state)}`,"",ve("Protection",`destructive ${Q.destructiveCommandProtectionEnabled?le:ye}   secrets ${Q.secretProtection.enabled?le:ye}`),ve("Level",Pe?`${ne.effectiveLevel} (customised)`:ne.effectiveLevel),ve("Rules",Q.rules.length===0?"none active":`${Q.rules.length} active`),ve("Policy",Ie(p(I))),...q.policyScopes?[ve("Project",Ie(x(process.cwd())))]:[],...ne.worktreeMode?[ve("Worktree","relaxations active")]:[],"",...Le.length===0?[]:[q.policyScopes?.weakeningsIgnored?"  Project policy (ignored)":"  Project policy",...Le.flatMap((Ve)=>br(Ve,"      ",re-6).map((Me,tn)=>tn===0?`    ${Me}`:Me)),""],...Fe.length===0?["  Everything configured is active."]:["  Not active",...Fe.flatMap((Ve)=>br(Ve,"      ",re-6).map((Me,tn)=>tn===0?`    ${Ne} ${Me}`:Me)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as cf}from"node:child_process";import{randomBytes as dk}from"node:crypto";import{existsSync as df,mkdirSync as uk,readFileSync as pk}from"node:fs";import{createServer as fk}from"node:http";import{dirname as uf,join as mk}from"node:path";import{Writable as gk}from"node:stream";var Go=500;function nk(I){let q=I.filter((te)=>te.decision!=="allow"),Q=I.filter((te)=>te.decision==="allow"),ne=Math.min(q.length,Math.max(Go-Q.length,Math.ceil(Go/2)));return[...q.slice(0,ne),...Q.slice(0,Go-ne)]}function qp(I,q,Q=B(I)){if(Q)ee(I,Q);let ne=(Me)=>new Date(Me.getFullYear(),Me.getMonth(),Me.getDate()).getTime(),te=ne(new Date),re=new Date(te);re.setDate(re.getDate()-(q-1));let le=re.getTime(),ye=[],ve={count:0};for(let Me of Q?Jn(Q,ve):[])for(let tn of Ht(Me,ve)){let en=new Date(tn.ts).getTime();if(!Number.isFinite(en))continue;if(en>=le)ye.push(tn)}ye.sort((Me,tn)=>new Date(tn.ts).getTime()-new Date(Me.ts).getTime());let Pe=Array.from({length:q},()=>0),Ie=Array.from({length:q},()=>0),$e={},Le={},Fe={},Ne=0,Ve=0;for(let Me of ye){let tn=Me.agent||"unknown";$e[tn]=($e[tn]??0)+1;let en=Math.round((te-ne(new Date(Me.ts)))/86400000),on=q-1-en,ln=en>=0&&en<q;if(ln)Ie[on]=(Ie[on]??0)+1;if(Me.decision!=="allow"){if(Ne++,Me.ruleId)Le[Me.ruleId]=(Le[Me.ruleId]??0)+1;let nn=Jo(Me.segment||Me.command);if(nn)Fe[nn]=(Fe[nn]??0)+1;if(Me.failureStage)Ve++;if(ln)Pe[on]=(Pe[on]??0)+1}}return{days:q,logsDir:Q,homeDir:I.home,totalInWindow:ye.length,truncated:ye.length>Go,unreadable:ve.count,counts:{blocked:Ne,allowed:ye.length-Ne,agents:$e,blockedByDay:Pe,analyzedByDay:Ie,rules:Le,commands:Fe,errors:Ve},entries:nk(ye).sort((Me,tn)=>new Date(tn.ts).getTime()-new Date(Me.ts).getTime())}}import{spawn as tk}from"node:child_process";import{existsSync as rk,statSync as Vp}from"node:fs";import{delimiter as ok,join as ik}from"node:path";var sk=120000,qo="Choose the project folder",ak=`try
  return POSIX path of (choose folder with prompt "${qo}")
on error number -128
  return ""
end try`,lk=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${qo}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Kp=[{binary:"zenity",args:["--file-selection","--directory",`--title=${qo}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",qo]}],Jp=(I,q)=>(q.PATH??"").split(ok).some((Q)=>{if(Q.length===0)return!1;try{let ne=Vp(ik(Q,I));return ne.isFile()&&(ne.mode&73)!==0}catch{return!1}});function qs(I,q){if(I==="darwin"||I==="win32")return!0;if(I!=="linux")return!1;if(!q.DISPLAY&&!q.WAYLAND_DISPLAY)return!1;return Kp.some((Q)=>Jp(Q.binary,q))}function ck(I,q){if(I==="darwin")return{cmd:"osascript",args:["-e",ak]};if(I==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",lk]};let Q=Kp.find((ne)=>Jp(ne.binary,q));return Q?{cmd:Q.binary,args:Q.args}:null}function Vs(I=process.platform,q=process.env){let Q=ck(I,q);if(!Q)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((ne)=>{let te=tk(Q.cmd,Q.args,{env:q,stdio:["ignore","pipe","pipe"]}),re="",le=!1,ye=(Pe)=>{if(le)return;le=!0,clearTimeout(ve),ne(Pe)},ve=setTimeout(()=>{te.kill(),ye({error:"The folder dialog timed out"})},sk);te.stdout.on("data",(Pe)=>{re+=Pe.toString()}),te.on("error",()=>ye({error:`Could not open the folder dialog (${Q.cmd})`})),te.on("close",()=>{let Pe=re.trim().replace(/\/+$/,"");if(!Pe)return ye({cancelled:!0});if(!rk(Pe)||!Vp(Pe).isDirectory())return ye({error:"That selection is not a folder on disk"});ye({path:Pe})})})}var zp=["en","ja","zh-CN"],Wp=["light","dark"],Vo=(I,q)=>I.includes(q),Yp=(I)=>typeof I==="object"&&I!==null&&!Array.isArray(I),Zp=(I)=>{let q=Yp(I)?I:{};return{...Vo(zp,q.language)?{language:q.language}:{},...Vo(Wp,q.theme)?{theme:q.theme}:{}}},Xp=(I)=>{if(!Yp(I))return null;let q=Object.keys(I).every((te)=>te==="language"||te==="theme"),Q=I.language===void 0||Vo(zp,I.language),ne=I.theme===void 0||Vo([...Wp,"auto"],I.theme);return q&&Q&&ne?I:null},Qp=(I,q)=>{let Q=q.language??I.language,ne=q.theme==="auto"?void 0:q.theme??I.theme;return{...Q?{language:Q}:{},...ne?{theme:ne}:{}}};var ef=`<!doctype html>
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
var ruleLink = (ruleId) => ruleId.startsWith("custom.") ? \`<a class="rule-id" href="#rules?focus=\${encodeURIComponent(ruleId)}" title="\${escapeHtml(t.showCustomRule)}">\${escapeHtml(ruleId)}</a>\` : knownRuleIds().has(ruleId) ? \`<a class="rule-id" href="#policy?q=\${encodeURIComponent(ruleId)}" title="\${escapeHtml(t.showProtection)}">\${escapeHtml(ruleId)}</a>\` : \`<code class="rule-id">\${escapeHtml(ruleId)}</code>\`;
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
var renderSavebar = () => {
  qs("policy-savebar").hidden = !shared.dirty;
  qs("save").textContent = projectDraft ? t.reviewAndApply : t.save;
  if (!shared.dirty || !state)
    return;
  const changes = policyChanges(savedComparisonPolicy(), draftPolicy, ruleLabels(), t);
  qs("savebar-title").textContent = changes.length === 0 ? t.unsavedChanges : t.unsavedChangeCount(changes.length);
  qs("savebar-summary").textContent = changes.slice(0, 3).join(t.changeSeparator) + (changes.length > 3 ? t.moreChanges(changes.length - 3) : "");
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
var offCount = (off) => off > 0 ? \` · <span class="off-count">\${escapeHtml(t.offCount(off))}</span>\` : "";
var renderDestructiveCommands = () => {
  if (!state || !preview)
    return;
  const effectiveState = preview;
  const query = searchQuery();
  const disabled = !draftPolicy.destructive_command_protection.enabled;
  const catastrophicCount = state.destructiveCommandRules.filter((rule) => rule.catastrophic).length;
  qs("destructive-command-summary").textContent = disabled ? t.commandProtectionOffSummary : t.commandRuleSummary(preview.counts.enabled, preview.counts.disabled, catastrophicCount);
  qs("destructive-panel").classList.toggle("is-off", disabled);
  const visible = state.destructiveCommandRules.filter((rule) => matches(query, [rule.category, rule.label, rule.id, rule.description]) && (!showChangedOnly || destructiveChanged(rule)));
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
      note: ruleNote(rule, effective, effectiveState.capabilities, t),
      noteTone: effective.source === "rule_override" ? "changed" : effective.source === "capability_override" || effective.source === "environment" ? "" : tierForRule(rule),
      actions: \`\${override ? \`<button type="button" class="quiet small" data-use-inherited="\${escapeHtml(rule.id)}">\${escapeHtml(t.reset)}</button>\` : ""}\${projectFieldChip(\`destructive_command_protection.overrides.\${rule.id}\`)}\`,
      description: rule.description,
      info,
      disabled
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
  const offTotal = loaded.secretPatterns.filter((rule) => !secretRuleIsActive(rule, overrides)).length;
  qs("secret-summary").textContent = disabled ? t.secretProtectionOffSummary : t.secretRuleSummary(loaded.secretPatterns.length - offTotal, offTotal);
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
      note: override ? t.changedByYou : rule.defaultOff ? t.offByDefault : null,
      noteTone: override ? "changed" : "",
      actions: \`\${override ? \`<button type="button" class="quiet small" data-secret-reset="\${escapeHtml(rule.id)}">\${escapeHtml(t.reset)}</button>\` : ""}\${projectFieldChip(\`secret_protection.overrides.\${rule.id}\`)}\`,
      description: rule.description ?? (rule.paths ? t.pathCount(rule.paths.length) : ""),
      info: rule.paths ? \`<button type="button" class="info-button" data-secret-paths="\${escapeHtml(rule.id)}" aria-label="\${escapeHtml(t.protectedPathsFor(rule.label))}" aria-haspopup="dialog" aria-controls="rule-example-popover">\${icons.info}</button>\` : '<span class="info-spacer"></span>',
      disabled
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
  el.innerHTML = \`\${t.testerBlocked(ruleHtml)} \${escapeHtml(result.data.reason || "")}\${result.data.segment && result.data.segment !== command ? \`<div class="tester-segment">\${escapeHtml(t.blockedPart)} <code>\${escapeHtml(result.data.segment)}</code></div>\` : ""}\`;
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
`;var nf='<script id="ccsn-data" type="application/json">';function tf(I,q=ef){return q.replace(nf,()=>nf+JSON.stringify(I).replaceAll("<","\\u003c"))}var Js="kenryu42/cc-safety-net",hk=`https://github.com/${Js}`,pf=1e4,yk=7,vk="The project draft directory changed; reload the draft before applying.",bk="audit settings are user scope only; remove the audit section from a project proposal";async function ff(I,q={}){let Q=fn({label:"gui",booleans:{noOpen:["--no-open"]}},I),ne=q.log??console.log,te=q.error??console.error;if(Q.errors.length>0){for(let le of Q.errors)te(le);return te("Usage: cc-safety-net gui [--no-open]"),1}let re=await wk(c,q);if(ne(`CC Safety Net policy GUI: ${re.url}`),!Q.flags.noOpen)try{await(q.openBrowser??Ok)(re.url)}catch(le){te(`Failed to open browser: ${le instanceof Error?le.message:String(le)}`),te(`Open this URL manually: ${re.url}`)}if(q.keepAlive===!1)return await re.close(),0;return await Ik(re),0}async function wk(I,q={}){let Q=dk(24).toString("base64url"),ne={dir:null,revision:0},te=fk((ye,ve)=>{kk(I,ye,ve,Q,q,ne)});await new Promise((ye,ve)=>{te.once("error",ve),te.listen(0,"127.0.0.1",()=>{te.off("error",ve),ye()})});let le=`http://127.0.0.1:${te.address().port}`;return{origin:le,token:Q,url:`${le}/?token=${encodeURIComponent(Q)}`,close:()=>_k(te)}}async function kk(I,q,Q,ne,te,re){let le=I(),ye=new URL(q.url??"/","http://127.0.0.1");if(q.method==="GET"&&ye.pathname==="/favicon.ico"){Q.writeHead(204,{"cache-control":"no-store"}),Q.end();return}if(!Ek(q,ye,ne)){rn(Q,403,{error:"Forbidden"});return}if(q.method==="GET"&&ye.pathname==="/"){let ve=of(rf(le,te));await Promise.resolve(te.buildDocument?.()).then((Pe)=>Ak(Q,tf({token:ne,preferences:ve},Pe)),(Pe)=>rn(Q,500,{error:Pe instanceof Error?Pe.message:String(Pe)}));return}if(q.method==="POST"&&ye.pathname==="/api/preferences"){let ve=await or(q);if(!ve.ok){rn(Q,ve.status,{errors:[ve.error]});return}let Pe=Xp(ve.value);if(!Pe){rn(Q,400,{errors:["preferences accept only language (en, ja, zh-CN) and theme (auto, light, dark)"]});return}let Ie=rf(le,te),$e=Qp(of(Ie),Pe),Le=Ck(Ie,$e);rn(Q,Le?500:200,Le?{errors:[Le]}:{preferences:$e});return}if(q.method==="GET"&&ye.pathname==="/api/policy"){let ve=$u(le,te),Pe=w(le,Ks(te));rn(Q,200,{...ve,configState:nt(Pe),...Pe.policyScopes?{projectPolicy:{path:x(te.cwd??process.cwd()),weakenings:Pe.policyScopes.weakeningsIgnored?[]:Pe.policyScopes.weakenings}}:{},destructiveCommandRules:Z,secretPatterns:xt,version:un(),preview:ve.errors.length>0?null:Qe(ve.policy,le.env)});return}if(q.method==="POST"&&ye.pathname==="/api/policy/preview"){let ve=await or(q);if(!ve.ok){rn(Q,ve.status,{errors:[ve.error]});return}let Pe=Du(le,ve.value);rn(Q,Pe.errors.length>0?400:200,Pe);return}if(q.method==="POST"&&ye.pathname==="/api/policy/explain"){let ve=await or(q);if(!ve.ok){rn(Q,ve.status,{errors:[ve.error]});return}let Pe=ve.value;if(Pe===null||typeof Pe.command!=="string"){rn(Q,400,{errors:["command must be a string"]});return}let Ie=Er(Pe.policy,le.home);if(Ie.length>0){rn(Q,400,{errors:Ie});return}rn(Q,200,Sk(le,Pe.command,Pe.policy,te));return}if(q.method==="POST"&&ye.pathname==="/api/policy"){let ve=await or(q);if(!ve.ok){rn(Q,ve.status,{errors:[ve.error]});return}let Pe=Ln(le,ve.value,te);rn(Q,Pe.errors.length>0?400:200,Pe);return}if(q.method==="POST"&&ye.pathname==="/api/reset"){rn(Q,200,Ln(le,ae,te));return}if(q.method==="POST"&&ye.pathname==="/api/repair"){rn(Q,200,Nu(le,te));return}if(q.method==="POST"&&ye.pathname==="/api/policy/project/choose-directory"){let ve=await(te.chooseDirectory??Vs)();if("path"in ve)re.dir=ve.path,re.revision+=1;rn(Q,200,{cancelled:"cancelled"in ve,..."error"in ve?{error:ve.error}:{}});return}if(q.method==="GET"&&ye.pathname==="/api/policy/project"){let ve=mf(re,te),Pe=gf(le,ve,te),Ie=Pe?{projection:{},diagnostics:[Pe]}:sf(ve,le.home),$e=Tr(le,te);rn(Q,200,{path:x(ve),revision:re.revision,baseline:$e.baseline,userPolicyDiagnostics:$e.diagnostics,projection:Ie.projection,projectionDiagnostics:Ie.diagnostics,canPickDirectory:qs(process.platform,process.env)});return}if(q.method==="POST"&&ye.pathname==="/api/policy/project/diff"){let ve=await af(le,q,Q,re,te);if(!ve)return;let Pe=sf(ve.dir,le.home),Ie=Tr(le,te).baseline,$e=se(Ie,be(ve.proposal,le.home).policy);rn(Q,200,{rows:_o(se(Ie,Pe.projection).policy,$e.policy,!1),weakenings:$e.weakenings,existingFileDiagnostics:Pe.diagnostics});return}if(q.method==="POST"&&ye.pathname==="/api/policy/project/apply"){let ve=await af(le,q,Q,re,te);if(!ve)return;let Pe=Pk(ve.dir,ve.proposal,le.home);rn(Q,Pe.errors.length>0?500:200,Pe);return}if(q.method==="GET"&&ye.pathname==="/api/activity"){let ve=ue(le,te),Pe=Rk(ye.searchParams.get("days"),ve);if(Pe===null){rn(Q,400,{error:`days must be an integer between 1 and ${ve}`});return}rn(Q,200,qp(le,Pe,te.activityLogsDir));return}if(q.method==="POST"&&ye.pathname==="/api/rules/choose-directory"){rn(Q,200,await Vs());return}if(q.method==="GET"&&ye.pathname==="/api/rules"){let ve=J(le,Ks(te)),Pe=new Map(ve.rules.map((Ie)=>[Ie.name,Ie]));rn(Q,200,{projectPath:te.cwd??process.cwd(),canPickDirectory:qs(process.platform,process.env),rulebooks:ve.rulebooks.map((Ie)=>({source:Ie.source,spec:Ie.spec,name:Ie.name,version:Ie.version,rules:Ie.rules.flatMap(($e)=>{let Le=Pe.get($e);if(!Le)return[];return[{name:Le.name,command:Le.command,subcommand:Le.subcommand,block_args:Le.block_args,reason:Le.reason}]})})),errors:ve.errors,warnings:ve.warnings});return}if(q.method==="GET"&&ye.pathname==="/api/star/context"){rn(Q,200,await(te.fetchStarContext??(()=>Fk(le,{logsDir:te.activityLogsDir})))());return}if(q.method==="POST"&&ye.pathname==="/api/star"){let ve=await(te.starRepo??$k)();rn(Q,200,ve.ok?{ok:!0}:{ok:!1,fallbackUrl:hk});return}if(q.method==="GET"&&ye.pathname==="/api/integrations"){rn(Q,200,await(te.fetchIntegrations??(()=>Dk(le)))());return}if(q.method==="GET"&&ye.pathname==="/api/health"){rn(Q,200,await(te.fetchHealth??Lk)());return}if(q.method==="POST"&&(ye.pathname==="/api/install"||ye.pathname==="/api/uninstall")){let ve=await or(q);if(!ve.ok){rn(Q,ve.status,{errors:[ve.error]});return}let Pe=ve.value?.target;if(typeof Pe!=="string"||!_n.some(($e)=>$e.target===Pe)){rn(Q,400,{error:"unknown target"});return}let Ie=ye.pathname==="/api/install"?"install":"uninstall";rn(Q,200,await(te.runIntegration??jk)(Ie,Pe));return}rn(Q,404,{error:"Not found"})}function rf(I,q){return mk(uf(fe(I,q)),"gui.json")}function of(I){if(!df(I))return{};try{return Zp(JSON.parse(pk(I,"utf-8")))}catch{return{}}}function Ck(I,q){try{return uk(uf(I),{recursive:!0}),an(I,`${JSON.stringify(q,null,2)}
`),null}catch(Q){return Q instanceof Error?Q.message:String(Q)}}function Ks(I){return{...I,cwd:I.cwd??process.cwd()}}function mf(I,q){return I.dir??q.cwd??process.cwd()}function gf(I,q,Q){if(!L(I,{...Q,cwd:q}))return null;return`${x(q)} is the user policy, not a project policy; choose a project directory, or run the GUI from one`}function sf(I,q){let Q=x(I),ne=df(Q)?Lt(Q):{value:void 0,errors:[]},te=be(ne.value,q);return{projection:te.policy,diagnostics:[...ne.errors,...te.diagnostics]}}async function af(I,q,Q,ne,te){let re=mf(ne,te),le=ne.revision,ye=await or(q);if(!ye.ok)return rn(Q,ye.status,{errors:[ye.error]}),null;let ve=ye.value;if(typeof ve?.revision!=="number")return rn(Q,400,{errors:["revision must be a number"]}),null;if(ve.revision!==le)return rn(Q,409,{errors:[vk]}),null;let Pe=gf(I,re,te);if(Pe)return rn(Q,400,{errors:[Pe]}),null;let Ie=xk(ve.proposal,I.home);if(Ie.length>0)return rn(Q,400,{errors:Ie}),null;return{dir:re,proposal:ve.proposal}}function xk(I,q){let Q=Er(I,q);if(Q.length>0)return Q;return I?.audit===void 0?[]:[bk]}function Pk(I,q,Q){let ne=x(I),te=Io(q,_(q,Q));try{return v(s(R(I,"project policy"),ne),`${JSON.stringify(te,null,2)}
`),{path:ne,errors:[]}}catch(re){return{path:ne,errors:[re instanceof Error?re.message:String(re)]}}}function Sk(I,q,Q,ne){let te=_(Q,I.home),re=w(I,Ks(ne)),le=Ge({rules:re.policy.rules,transparentWrappers:re.policy.transparentWrappers,heredocDataWrappers:re.policy.heredocDataWrappers,commandTools:re.policy.commandTools,safety:tt(te.safety),worktreeMode:te.workflow.worktree_mode,destructiveCommandProtectionEnabled:te.destructive_command_protection.enabled,destructiveCommandRuleOverrides:te.destructive_command_protection.overrides,destructiveCommandAllowPaths:te.destructive_command_protection.allow_paths,secretProtection:{enabled:te.secret_protection.enabled,disabledRules:Ct(te.secret_protection.overrides),denyPaths:te.secret_protection.deny_paths,allowPaths:te.secret_protection.allow_paths}});return wr(q,{policySnapshot:le,cwd:ne.cwd,userConfigDir:ne.userConfigDir},I)}function Rk(I,q){if(I===null)return Math.min(yk,q);let Q=Number(I);if(!Number.isInteger(Q)||Q<1||Q>q)return null;return Q}function Ek(I,q,Q){if(q.searchParams.get("token")!==Q)return!1;if(I.method!=="POST")return!0;return I.headers["x-cc-safety-net-token"]===Q}var Tk=1048576;async function or(I){let q=[],Q=0;for await(let ne of I){let te=ne;if(Q+=te.byteLength,Q>Tk)return{ok:!1,status:413,error:"Request body is too large"};q.push(te)}try{return{ok:!0,value:JSON.parse(Buffer.concat(q).toString("utf-8")||"{}")}}catch(ne){return{ok:!1,status:400,error:`Invalid JSON: ${ne instanceof Error?ne.message:String(ne)}`}}}function Ak(I,q){I.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),I.end(q)}function rn(I,q,Q){I.writeHead(q,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),I.end(JSON.stringify(Q))}function _k(I){return new Promise((q,Q)=>{I.close((ne)=>ne?Q(ne):q())})}function Ik(I){return new Promise((q)=>{let Q=()=>{process.off("SIGINT",ne),process.off("SIGTERM",ne)},ne=()=>{Q(),I.close().then(q)};process.once("SIGINT",ne),process.once("SIGTERM",ne)})}function Ok(I){let q=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",Q=process.platform==="win32"?["/c","start","",I]:[I];return new Promise((ne,te)=>{let re=cf(q,Q,{detached:!0,stdio:"ignore"}),le=(ve)=>{re.off("spawn",ye),te(ve)},ye=()=>{re.off("error",le),re.unref(),ne()};re.once("error",le),re.once("spawn",ye)})}async function $k(I="gh",q=pf){return{ok:await Hk(I,["api","-X","PUT",`/user/starred/${Js}`],q)===0}}async function Dk(I,q={}){let Q=await Mr((te)=>Xt({environment:I,cwd:process.cwd(),openCodeVersion:te}).status!=="n/a",q.fetcher),ne=Nk(I,Q);return{targets:xn.map((te)=>{let re=ne.find((le)=>le.platform===te.id);return{target:te.id,label:cn(te.id),version:Q.versions[te.id]??null,status:re?.configured?"active":re?.detected?"disabled":re?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:Q.version,nodeVersion:Q.nodeVersion,platform:Q.platform}}}function Nk(I,q){return Qt(I,process.cwd(),{ampPluginListOutput:q.ampPluginListOutput,codexPluginListOutput:q.codexPluginListOutput,copilotCliVersion:q.versions["copilot-cli"],openCodeVersion:q.versions.opencode,openCodePluginListOutput:q.openCodePluginListOutput})}async function Lk(I={}){let q=await(I.checkUpdates??Mn)();return{update:{latestVersion:q.latestVersion??null,updateAvailable:q.updateAvailable}}}var lf=Promise.resolve();function jk(I,q,Q={}){let ne=async()=>{let re=[],{log:le,error:ye}=console;console.log=(...ve)=>re.push(ve.map(String).join(" ")),console.error=console.log;try{return{ok:await Rr(I,[],{selectTargets:async()=>[q],output:new gk({write(Pe,Ie,$e){re.push(String(Pe).replace(/\n$/,"")),$e()}}),...Q})===0,output:re.join(`
`)}}finally{console.log=le,console.error=ye}},te=lf.then(ne);return lf=te.then(()=>{return},()=>{return}),te}async function Fk(I,q={}){let[Q,ne]=await Promise.all([Mk(q.fetchRepo),Promise.resolve(Lr(I,ue(I),q.logsDir).totalBlocked)]);return{starCount:Q,blockedTotal:ne}}function Hk(I,q,Q){return new Promise((ne)=>{let te=cf(I,q,{stdio:"ignore",windowsHide:!0}),re=!1,le=setTimeout(()=>{te.kill(),ye(null)},Q),ye=(ve)=>{if(re)return;re=!0,clearTimeout(le),ne(ve)};te.once("error",()=>ye(null)),te.once("close",ye)})}async function Mk(I=fetch){try{let q=await I(`https://api.github.com/repos/${Js}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(pf)});if(!q.ok)return null;let Q=await q.json();return typeof Q.stargazers_count==="number"?Q.stargazers_count:null}catch{return null}}function Uk(I){if(I[0]!=="help")return!1;let q=I[1];if(!q)ys(),process.exit(0);if(kr(q))process.exit(0);console.error(`Unknown command: ${q}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var Bk={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),kr("hook",console.error),process.exit(1)},install:async(I)=>{process.exit(await Rr("install",I))},update:async(I)=>{process.exit(await Os(I))},uninstall:async(I)=>{process.exit(await Rr("uninstall",I))},rule:async(I)=>{process.exit(await Up(c(),I))},policy:async(I)=>{process.exit(await Hu(c(),I))},status:async(I)=>{if(In(fn({label:"status"},I).errors))process.exit(1);Gp(c())},statusline:async(I)=>{let q=fn({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},I);if(q.errors.length===0&&q.flags.claudeCode){await Gs(c());return}if(In(q.errors),!q.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");kr("statusline",console.error),process.exit(1)},doctor:async(I)=>{let q=as(I);if(!q)process.exit(1);let Q=await ed(c(),{json:q.json,skipUpdateCheck:q.skipUpdateCheck});process.exit(Q)},logs:async(I)=>{process.exit(await na(c(),I))},gui:async(I)=>{process.exit(await ff(I))},explain:async(I)=>{process.exit(await dd(c(),I))}};async function Gk(I){let q=fn({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},I);if(Uk(I))return;let Q=I[0],ne=Q?Nr(Q):void 0;if(q.help&&ne&&ne.name!=="rule")kr(ne.name),process.exit(0);if(!Q||q.help&&!ne)ys(),process.exit(0);if(q.flags.version)fd(),process.exit(0);if(ne){await Bk[ne.name](I.slice(1));return}if(Q==="--statusline"){await Gs(c());return}console.error(Q.startsWith("-")?`Unknown option: ${Q}`:`Unknown command: ${Q}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{Gk as runCli};
