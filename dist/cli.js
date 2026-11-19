import{l,a,Ve,mt,I,Ot,gt,c,r,ht,O,k,xe,Nt,i,R,s,de,o,b,Se,q,Lt,Mt,m,we,Ce,$t,j,oe,pe,T,Ft,D,x,fe,K,p,L,ie,yt,vt,U,_,M,Ee,ke,Ke,me,f,e,Je,je,Ye,Re,bt,xt,ge,Ue,he,Ze,J,Y,Xe,Te,h,He,S,wt,d,Z,Ct,X,se,ae,Et,Qe,ve,kt,Rt,P,N,et,Tt,nt,w,rt,Ge,Pe,C,t,ce,Ie,E,H,y,F,Ht,ot,it,st,at,g,G}from"./chunks/index-0k4mdsdm.js";import{dt}from"./chunks/index-x4py8bwb.js";import{ct,Oe}from"./chunks/index-b1px95rj.js";import{v,B,u,We,n,De,pt,It,ze}from"./chunks/index-ezetrx6f.js";import"./chunks/index-b4r0brkc.js";import{ue,ee,ft,W,z}from"./chunks/index-9kawkz8z.js";var xf=["-h","--help"];function fn(A,V){let Q=Object.entries(A.booleans??{}),ne=Object.entries(A.values??{}),te=Object.entries(A.lists??{}),re=Object.fromEntries(Q.map(([Le])=>[Le,!1])),le={},ye=Object.fromEntries(te.map(([Le])=>[Le,[]])),be=[],_e=[],Ae=!1,$e=-1;for(let[Le,Fe]of V.entries()){if(Le<=$e)continue;if(Fe==="--"){be.push(...V.slice(Le+1));break}if(xf.includes(Fe)){Ae=!0;continue}let Ne=Q.find(([,tn])=>tn.includes(Fe));if(Ne){re[Ne[0]]=!0;continue}let Me=ne.find(([,tn])=>tn.includes(Fe));if(Me){let tn=V[Le+1];if(tn===void 0||tn.startsWith("-")){_e.push(`${Fe} requires a value`);continue}le[Me[0]]=tn,$e=Le+1;continue}let Be=te.find(([,tn])=>tn.includes(Fe));if(Be){let tn=V.slice(Le+1),en=tn.findIndex((ln)=>ln.startsWith("-")),on=tn.slice(0,en===-1?tn.length:en);if(on.length===0){_e.push(`${Fe} requires at least one value`);continue}ye[Be[0]]=[...ye[Be[0]]??[],...on],$e=Le+on.length;continue}if(Fe.startsWith("-")){_e.push(`Unknown option for ${A.label}: ${Fe}`);continue}if(A.positionals==="tail"){be.push(...V.slice(Le));break}be.push(Fe)}if(A.positionals!=="list"&&A.positionals!=="tail")_e.push(...be.map((Le)=>`Unexpected argument for ${A.label}: ${Le}`));return{flags:re,values:le,lists:ye,positionals:be,help:Ae,errors:_e}}function In(A){for(let V of A)console.error(V);return A.length>0}import{readdirSync as Af,statSync as ra,unlinkSync as If}from"node:fs";import{basename as oa,dirname as Of,isAbsolute as $f,join as Df,relative as Nf,resolve as Lf,sep as jf}from"node:path";var ea=(A)=>{let V=Date.now()-new Date(A).getTime();if(!Number.isFinite(V))return"";let Q=Math.floor(V/60000),ne=Math.floor(Q/60),te=Math.floor(ne/24);if(te>0)return`${te}d ago`;if(ne>0)return`${ne}h ago`;if(Q>0)return`${Q}m ago`;return"just now"},Xo=(A)=>{let V=(A??"").trim().split(/\s+/).filter((te)=>te&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(te)),Q=V[0]?.split("/").pop();if(!Q)return null;let ne=V[1];return ne&&/^[a-z][a-z0-9-]*$/.test(ne)?`${Q} ${ne}`:Q};function na(A){let V=(te)=>`${te.sessionId}
${Xo(te.segment||te.command)}`,Q=A.filter((te)=>te.decision!=="allow"),ne=Q.filter((te)=>te.sessionId).reduce((te,re)=>te.set(V(re),(te.get(V(re))??0)+1),new Map);return new Set(Q.filter((te)=>te.failureStage||(ne.get(V(te))??0)>=2))}import{existsSync as Sf,readdirSync as Pf,readFileSync as Rf}from"node:fs";import{join as Ef}from"node:path";function zn(A,V){try{return Pf(A,{withFileTypes:!0,encoding:"utf8"}).flatMap((Q)=>{let ne=Ef(A,Q.name);if(Q.isDirectory())return zn(ne,V);if(Q.name.endsWith(".jsonl"))return[ne];return[]})}catch{if(V&&Sf(A))V.count++;return[]}}var Tf=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function _f(A){if(!A||typeof A!=="object"||Array.isArray(A))return!1;let V=A;if(typeof V.ts!=="string"||typeof V.command!=="string")return!1;return Tf.every((Q)=>V[Q]===void 0||typeof V[Q]==="string")}function Gt(A,V){try{return Rf(A,"utf-8").split(`
`).filter(Boolean).flatMap((Q)=>{try{let ne=JSON.parse(Q);if(!_f(ne)){if(V)V.count++;return[]}return[ne]}catch{if(V)V.count++;return[]}})}catch{if(V)V.count++;return[]}}function mn(A){return Array.from(A,(V)=>{let Q=V.charCodeAt(0);if(Q<=31||Q>=127&&Q<=159)return`\\x${Q.toString(16).padStart(2,"0")}`;return V}).join("")}function Hf(A,V){let Q=ue(A),ne=fn({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},V);if(In(ne.errors))return null;if(ne.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(ne.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let te=ne.values.limit===void 0?20:ta(ne.values.limit);if(te===null)return console.error("--limit must be a positive number"),null;let re=ne.values.since===void 0?Math.min(30,Q):ta(ne.values.since);if(re===null||re>Q)return console.error(`--since must be a positive number of days no greater than ${Q}`),null;let le={limit:te,limitExplicit:ne.values.limit!==void 0,since:re,sinceExplicit:ne.values.since!==void 0,all:ne.flags.all,json:ne.flags.json,suspect:ne.flags.suspect,pruneLegacy:ne.flags.pruneLegacy,dryRun:ne.flags.dryRun,id:ne.values.id,agent:ne.values.agent,rule:ne.values.rule,session:ne.values.session,project:ne.values.project===void 0?void 0:Lf(ne.values.project)};if(le.id&&(le.agent!==void 0||le.rule!==void 0||le.session!==void 0||le.project!==void 0||le.suspect||le.sinceExplicit||le.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(le.pruneLegacy&&(le.id!==void 0||le.agent!==void 0||le.rule!==void 0||le.session!==void 0||le.project!==void 0||le.suspect||le.all||le.sinceExplicit||le.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(le.dryRun&&!le.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return le}async function sa(A,V,Q={}){let ne=Hf(A,V);if(!ne)return 1;let te=Q.logsDir??W(A);if(ne.pruneLegacy)return Ff(te,ne.json,ne.dryRun);if(!te)return console.log(ne.json?"[]":ne.id?`No retained audit log entry found for id ${mn(ne.id)}.`:"No audit log entries found."),0;ee(A,te);let re={count:0},le=zn(te,re).flatMap(($e)=>Gt($e,re).map((Le)=>({entry:Le,file:$e})));if(re.count>0)console.error(`warning: ${re.count} audit log ${re.count===1?"source":"sources"} could not be read; these results are incomplete`);if(ne.id)return Gf(le,ne,Q.timeZone);let ye=Date.now()-ne.since*24*60*60*1000,be=le.filter(($e)=>qf($e,ne,te,ye)),_e=ne.suspect?na(be.map(($e)=>$e.entry)):null,Ae=(_e?be.filter(($e)=>_e.has($e.entry)):be).sort(($e,Le)=>Date.parse(Le.entry.ts)-Date.parse($e.entry.ts)).slice(0,ne.limit);if(ne.json)return console.log(JSON.stringify(Ae.map(($e)=>$e.entry),null,2)),0;if(Ae.length===0)return console.log("No audit log entries found."),0;for(let $e of Ae)console.log(zf($e.entry,Q.timeZone));return 0}function Ff(A,V,Q){let ne=A?Uf(A).map((ye)=>Df(A,ye)):[];if(Q)return Mf(ne,V);let te=[],re=0,le=0;for(let ye of ne){let be=ra(ye,{throwIfNoEntry:!1})?.size??0,_e=Bf(ye);if(_e){te.push(`${oa(ye)}: ${_e}`);continue}re++,le+=be}if(V)return console.log(JSON.stringify({removedFiles:re,removedBytes:le,failedFiles:te.length})),te.length===0?0:1;console.log(re===0&&te.length===0?"No legacy audit log files found.":`Removed ${re} legacy audit log ${re===1?"file":"files"} (${ia(le)}).`);for(let ye of te)console.error(`Could not remove ${mn(ye)}`);if(console.log("Nested v2 audit logs were not changed."),re>0)console.log("This deletion cannot be undone.");return te.length===0?0:1}function Mf(A,V){let Q=A.reduce((ne,te)=>ne+(ra(te,{throwIfNoEntry:!1})?.size??0),0);if(V)return console.log(JSON.stringify({dryRun:!0,files:A.length,bytes:Q})),0;if(console.log(A.length===0?"No legacy audit log files found.":`Would remove ${A.length} legacy audit log ${A.length===1?"file":"files"} (${ia(Q)}).`),console.log("Nested v2 audit logs are not included."),A.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function Uf(A){try{return Af(A,{withFileTypes:!0}).filter((V)=>V.isFile()&&V.name.endsWith(".jsonl")).map((V)=>V.name)}catch{return[]}}function Bf(A){try{return If(A),null}catch(V){return V instanceof Error?V.message:String(V)}}function ia(A){let V=["B","KiB","MiB","GiB"],Q=Math.min(Math.floor(Math.log2(Math.max(A,1))/10),V.length-1);return`${Math.round(A/1024**Q*10)/10} ${V[Q]}`}function Gf(A,V,Q){let ne=A.filter((re)=>re.entry.id===V.id);if(ne.length>1)return console.error(`Multiple audit log entries found for id ${mn(V.id??"")}.`),1;if(V.json)return console.log(JSON.stringify(ne.map((re)=>re.entry),null,2)),0;let te=ne[0];if(!te)return console.log(`No retained audit log entry found for id ${mn(V.id??"")}.`),0;return console.log(Jf(te.entry,Q)),0}function qf(A,V,Q,ne){if(!V.all&&A.entry.decision==="allow")return!1;if(Date.parse(A.entry.ts)<ne)return!1;if(V.agent!==void 0&&A.entry.agent!==V.agent)return!1;if(V.rule!==void 0&&A.entry.ruleId!==V.rule)return!1;if(V.session!==void 0&&!Vf(A,Q,V.session))return!1;if(V.project!==void 0&&!Kf(A.entry.cwd,V.project))return!1;return!0}function Vf(A,V,Q){if(A.entry.sessionId===Q)return!0;return Of(A.file)===V&&oa(A.file,".jsonl")===Q}function Kf(A,V){if(!A)return!1;let Q=Nf(V,A);return Q!==".."&&!Q.startsWith(`..${jf}`)&&!$f(Q)}function zf(A,V){let Q=mn(A.id??"-"),ne=mn(A.decision??"deny"),te=A.cwd?`  [${mn(A.cwd)}]`:"",re=A.segment||A.command,le=re===A.command?"":"↳ ",ye=re.length>50?`${re.slice(0,50)}…`:re;return`${Q.padEnd(16)}  ${mn(aa(A.ts,V))}  ${ne.padEnd(5)}  ${mn(A.agent??"-").padEnd(15)}  ${mn(A.ruleId??"-").padEnd(20)}  ${le}${mn(ye)}${te}`}function Jf(A,V){let Q=(te)=>mn(te===void 0||te===null||te===""?"-":te),ne=A.shape?`${A.agent??"-"} (shape: ${A.shape})`:A.agent??"-";return[`id:        ${Q(A.id)}`,`ts:        ${Q(aa(A.ts,V))}`,`decision:  ${Q(A.decision)}`,`agent:     ${Q(ne)}`,`level:     ${Q(A.level)}`,`tool:      ${Q(A.toolName)}`,`rule:      ${Q(A.ruleId)}`,`intent:    ${Q(A.intent)}`,`stage:     ${Q(A.failureStage)}`,`error:     ${Q(A.errorCode)}`,`session:   ${Q(A.sessionId)}`,`cwd:       ${Q(A.cwd)}`,`version:   ${Q(A.v)}`,`truncated: ${Q(A.truncated===!0?"yes":void 0)}`,`reason:    ${Q(A.reason)}`,`command:   ${Q(A.command)}`,`segment:   ${Q(A.segment)}`].join(`
`)}function aa(A,V){let Q=new Date(A);if(Number.isNaN(Q.getTime()))return A;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:V}).format(Q)}function ta(A){let V=Number(A);return Number.isFinite(V)&&V>0?V:null}var la={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var ca={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"--shell",argument:"<auto|posix|powershell>",description:"Parse the command as this shell (default: auto)"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"',"cc-safety-net explain --shell posix 'rmdir /s /q d:\\'"]};var da={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var Qo=["npx","--offline","--no-install","@deepseek-ai/dsh","--version"],ua=["cursor-agent","--version"],pa=[{id:"antigravity-cli",displayName:"Antigravity CLI",runtime:{flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",runtime:{displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",runtime:{flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",runtime:{flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",runtime:{flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",runtime:{flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",runtime:{flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",runtime:{flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",install:{flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",install:{flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",install:{flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",runtime:{flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"deepseek-harness",displayName:"DeepSeek Harness",install:{flag:"--deepseek-harness",artifactKind:"package",probeCommand:Qo}},{id:"devin",displayName:"Devin CLI",runtime:{flags:["-dv","--devin"],description:"Run as Devin CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--devin",artifactKind:"hook config",probeCommand:["devin","--version"]}},{id:"droid",displayName:"Factory Droid",runtime:{flags:["-fd","--droid"],description:"Run as Factory Droid PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--droid",artifactKind:"hook config",probeCommand:["droid","--version"]}},{id:"amp",displayName:"Amp Code",install:{flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],es=pa.slice().sort((A,V)=>A.displayName.localeCompare(V.displayName,"en")),Lr=es.map((A)=>A.id).sort((A,V)=>Number(V==="claude-code")-Number(A==="claude-code")),cr=es.filter((A)=>("runtime"in A)).map((A)=>({id:A.id,displayName:"displayName"in A.runtime?A.runtime.displayName:A.displayName,flags:A.runtime.flags,legacyFlags:"legacyFlags"in A.runtime?A.runtime.legacyFlags:[],description:A.runtime.description,legacyTopLevelFlags:A.runtime.legacyTopLevelFlags})),xn=es.map((A)=>({id:A.id,...A.install})),Wf=Object.fromEntries(pa.map((A)=>[A.id,A.displayName]));function cn(A){return Wf[A]}var Yf=cr.map((A)=>({flags:A.flags.join(", "),description:A.description})),Zf=cr.flatMap((A)=>A.flags.map((V)=>`cc-safety-net hook ${V}`)),fa={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Yf,{flags:"-h, --help",description:"Show this help"}],examples:Zf};var ma={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...xn.map((A)=>({flags:A.flag,description:`Install ${cn(A.id)} ${A.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...xn.map((A)=>`cc-safety-net install ${A.flag}`)]},ga={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...xn.map((A)=>({flags:A.flag,description:`Uninstall ${cn(A.id)} ${A.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...xn.map((A)=>`cc-safety-net uninstall ${A.flag}`)]},ha={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var ya={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var jr={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var ns=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],ts=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],qt={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"tool add <name...> [--cwd-arg <name> | --no-cwd-arg] [--project]",description:"Analyze community shell tools (user scope by default)"},{usage:"tool remove <name...> [--project]",description:"Stop analyzing declared tools"},{usage:"tool list",description:"List declared command tools in both scopes"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},{flags:"--project",description:"Use project-scope rule config with rule tool"},{flags:"--cwd-arg",argument:"<name>",description:"Name the working-directory argument with rule tool add"},{flags:"--no-cwd-arg",description:"Read no working-directory argument with rule tool add, for a remote tool"},...ns.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk","cc-safety-net rule tool add ops_bash","cc-safety-net rule tool add ops_run_background --cwd-arg cwd --project","cc-safety-net rule tool add phone_shell --no-cwd-arg",...ts,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var va={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var ba={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var Hr=[va,la,ya,ca,qt,jr,ma,ha,ga,fa,da,ba];function Xf(A){return A.aliases??[]}function Fr(A){let V=A.toLowerCase();return Hr.find((Q)=>Q.name.toLowerCase()===V||Xf(Q).some((ne)=>ne.toLowerCase()===V))}import{existsSync as Fy}from"node:fs";import{basename as Qf}from"node:path";function Mr(A,V=7,Q=W(A)){let ne=Date.now()-V*24*60*60*1000,te=[],re=new Set,le=0,ye,be,_e,Ae;if(Q)ee(A,Q);let $e={count:0},Le=Q?zn(Q,$e):[];for(let Ne of Le)for(let Me of Gt(Ne,$e)){if(Me.decision==="allow")continue;let Be=new Date(Me.ts).getTime();if(Be>=ne){if(le++,re.add(Me.sessionId??Qf(Ne,".jsonl")),be===void 0||Be<=be)ye=Me.ts,be=Be;if(Ae===void 0||Be>Ae)_e=Me.ts,Ae=Be;em(te,Me,Be)}}let Fe=te.map((Ne)=>({timestamp:Ne.ts,command:Ne.command,reason:Ne.reason,relativeTime:ea(new Date(Ne.ts))}));return{totalBlocked:le,sessionCount:re.size,recentEntries:Fe,oldestEntry:ye,newestEntry:_e,unreadable:$e.count}}function em(A,V,Q){let ne=A.findIndex((te)=>Q>new Date(te.ts).getTime());if(ne===-1){if(A.length<3)A.push(V);return}if(A.splice(ne,0,V),A.length>3)A.pop()}import{dirname as pm}from"node:path";import{dirname as nm,join as tm,resolve as rm}from"node:path";var om="config.json";function yn(A,V,Q,ne){b(sm(A),`${JSON.stringify(V,null,2)}
`,Q,ne)}function sm(A){return typeof A==="string"?de(A):A}function os(A){return{errors:ge(am(A),": "," "),ruleNames:new Set(Ze(A).map((V)=>V.toLowerCase()))}}var im="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",wa="must match pattern (letters, numbers, hyphens, underscores)";function am(A){if(!ka(A))return[e([],"Config must be an object")];return[...A.version===1?[]:[e(["version"],"must be 1")],...lm(A.rules)]}function lm(A){if(A===void 0)return[];if(!Array.isArray(A))return[e(["rules"],"must be an array")];return[...A.flatMap((V,Q)=>ka(V)?cm(V,["rules",Q]):[e(["rules",Q],"must be an object")]),...Je(A)]}function cm(A,V){return[...rs(A.name,[...V,"name"],"required string",m,im),...rs(A.command,[...V,"command"],"required string",_,wa),...A.subcommand===void 0?[]:rs(A.subcommand,[...V,"subcommand"],"must be a string if provided",_,wa),...dm(A.block_args,[...V,"block_args"]),...um(A.reason,[...V,"reason"]),...A.intent===void 0||Ue(A.intent)?[]:[e([...V,"intent"],je)]]}function rs(A,V,Q,ne,te){if(typeof A!=="string")return[e(V,Q)];return ne.test(A)?[]:[e(V,te)]}function dm(A,V){if(!Array.isArray(A))return[e(V,"required array")];if(A.length===0)return[e(V,"must have at least one element")];return A.flatMap((Q,ne)=>{if(typeof Q!=="string")return[e([...V,ne],"must be a string")];return Q===""?[e([...V,ne],"must not be empty")]:[]})}function um(A,V){if(typeof A!=="string")return[e(V,"required string")];if(A==="")return[e(V,"must not be empty")];return A.length>M?[e(V,`must be at most ${M} characters`)]:[]}function ka(A){return!!A&&typeof A==="object"&&!Array.isArray(A)}function ss(A){let V=Ca(A);if(!V.ok)return V.result;return os(V.parsed)}function Ca(A){let V=[],Q=new Set;try{let ne=typeof A==="string"?de(A):A,te=o(ne);if(te===null)return V.push(`File not found: ${ne.path}`),{ok:!1,result:{errors:V,ruleNames:Q}};if(!te.trim())return V.push("Config file is empty"),{ok:!1,result:{errors:V,ruleNames:Q}};return{ok:!0,parsed:JSON.parse(te)}}catch(ne){if(ne instanceof i)return V.push(ne.message),{ok:!1,result:{errors:V,ruleNames:Q}};let te=ne instanceof Error?ne.message:String(ne);return V.push(ne instanceof SyntaxError?"Invalid JSON":te),{ok:!1,result:{errors:V,ruleNames:Q}}}}function Vt(A){return rm(A,".safety-net.json")}function Fn(A){let V=Ca(A);if(!V.ok)return V.result;let Q=bt(V.parsed);return{errors:Q.errors,ruleNames:Q.sources}}function Kt(A,V={}){return tm(nm(fe(A,V)),om)}function xa(A,V,Q){let ne;try{if(o(V)===null)return{path:A,exists:!1,valid:!1,ruleCount:0};ne=Fn(V),ne.errors.push(...Y(A,Q))}catch(te){if(!(te instanceof i))throw te;ne={errors:[te.message],ruleNames:new Set}}return{path:A,exists:!0,valid:ne.errors.length===0,ruleCount:ne.ruleNames.size,...ne.errors.length>0?{errors:ne.errors}:{}}}function fm(A,V){return{source:V,name:A.name,command:A.command,subcommand:A.subcommand,blockArgs:[...A.block_args],reason:A.reason}}function Sa(A,V){let Q=K(A),ne=D(V),te=pm(Q),re=J(A,{cwd:V,userConfigPath:Q,projectConfigPath:ne,userConfigDir:te}),le=ie(A,{cwd:V,userConfigPath:Q,projectConfigPath:ne,userConfigDir:te}),ye=new Map(re.rulebooks.flatMap((be)=>be.rules.map((_e)=>[_e,be.source])));return{userConfig:xa(Q,le.userConfigTarget,le.userScope),projectConfig:xa(ne,le.projectConfigTarget,le.projectScope),effectiveRules:re.rules.map((be)=>fm(be,ye.get(be.name)??"project"))}}var mm=[{flag:r.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:r.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:r.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:r.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:r.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:r.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:r.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:r.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"},{flag:r.projectTightenOnly,description:"Ignore project policy settings that weaken the user policy",defaultBehavior:"off"}];function Pa(A){return[...mm.map((V)=>({name:V.flag.name,value:xe(V.flag,A.env),isSet:Nt(V.flag,A.env),legacyName:V.flag.legacyName,legacyValue:V.flag.legacyName?A.env.get(V.flag.legacyName):void 0,legacyIsSet:V.flag.legacyName?A.env.get(V.flag.legacyName)!==void 0:void 0,description:V.description,defaultBehavior:V.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:A.env.get("CC_SAFETY_NET_HOME"),isSet:A.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var Ra={error:0,warning:1,info:2},gm=["policy","config","audit"];function hm(A){return A.map((V)=>{if(V==="ownership")return"is not owned by the current user";if(V==="permissions")return"has unsafe permissions";if(V==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var ym=[{derive:(A)=>A.hooks.length>0&&A.hooks.every((V)=>!V.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(A)=>A.hooks.filter((V)=>V.inspectionStatus==="failed").map((V)=>{let Q=cn(V.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${Q} inspection failed`,detail:`Doctor could not verify the ${Q} integration configuration.`,fixHint:`Correct the reported ${Q} configuration error, then run \`cc-safety-net doctor\` again.`,integration:V.platform}})},{derive:(A)=>A.userConfig.exists&&!A.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:A.userConfig.path}]:[]},{derive:(A)=>A.projectConfig.exists&&!A.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:A.projectConfig.path}]:[]},{derive:(A)=>A.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${A.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(A)=>A.v2Leftovers&&A.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${A.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(A)=>A.legacyConfigs&&A.legacyConfigs.length>0?[{checkId:"config.legacy-ignored",severity:"warning",title:"Legacy inline rule configs are ignored",detail:`CC Safety Net no longer loads these files, so their rules enforce nothing: ${A.legacyConfigs.join(", ")}.`,fixHint:"Run `cc-safety-net rule migrate` to convert them (add `--cleanup` to delete each file once it is converted), then rerun doctor."}]:[]},{derive:(A)=>{let V=A.environment.find((Q)=>Q.name==="CC_SAFETY_NET_AUDIT_SCOPE");return ht(V?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...gm.map((A)=>({derive:(V)=>V.posture.directories.filter((Q)=>Q.kind===A&&Q.status==="unsafe").map((Q)=>({checkId:`posture.${A}-directory-unsafe`,severity:"error",title:`${A[0]?.toUpperCase()}${A.slice(1)} directory is unsafe`,detail:`The ${A} directory ${hm(Q.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...Q.path?{path:Q.path}:{}}))})),{derive:(A)=>{let V=[...A.effectiveSafety.weakenedRuleOverrides].sort();return V.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${V.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${V.join(", ")}.`}]:[]}}];function Ea(A){return ym.flatMap((V,Q)=>V.derive(A).map((ne,te)=>({finding:ne,catalogOrder:Q,occurrence:te}))).sort((V,Q)=>Ra[V.finding.severity]-Ra[Q.finding.severity]||V.catalogOrder-Q.catalogOrder||V.occurrence-Q.occurrence).map((V)=>V.finding)}function On(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var vm=(A)=>On()?`\x1B[32m${A}\x1B[0m`:A,bm=(A)=>On()?`\x1B[33m${A}\x1B[0m`:A,wm=(A)=>On()?`\x1B[34m${A}\x1B[0m`:A,km=(A)=>On()?`\x1B[36m${A}\x1B[0m`:A,Cm=(A)=>On()?`\x1B[31m${A}\x1B[0m`:A,xm=(A)=>On()?`\x1B[2m${A}\x1B[0m`:A,Sm=(A)=>On()?`\x1B[1m${A}\x1B[0m`:A,qe={green:vm,yellow:bm,blue:wm,cyan:km,red:Cm,dim:xm,bold:Sm},Pm="\x1B[0m",Rm=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function Em(A){let V=A;return()=>(V=(V*1664525+1013904223)%4294967296,V/4294967296)}function Tm(A){let V=[...Rm],Q=Em(A);for(let ne=V.length-1;ne>0;ne--){let te=Math.floor(Q()*(ne+1)),re=V[ne];V[ne]=V[te],V[te]=re}return V}function _m(A,V=0){if(!On())return"";let Q=Tm(V);return`\x1B[38;5;${Q[A%Q.length]}m`}function Ta(A,V,Q=0){if(!On())return`"${A}"`;return`${_m(V,Q)}"${A}"${Pm}`}function Ur(A){return A==="default"?"built-in default":`${A} policy`}var Am=new RegExp("\x1B\\[[0-9;]*m","g"),is=(A)=>A.replace(Am,"").length;function Jn(A){let V=(A.headers??A.rows[0]??[]).map((le,ye)=>{let be=Math.max(...A.rows.map((_e)=>is(_e[ye]??"")));return Math.max(is(le),be)}),Q=(le,ye)=>le+" ".repeat(Math.max(0,ye-is(le))),ne=(le,ye)=>ye[0]+V.map((be)=>le.repeat(be+2)).join(ye[1])+ye[2],te=(le)=>`│ ${le.map((ye,be)=>Q(ye,V[be]??0)).join(" │ ")} │`,re=A.headers?[`   ${te(A.headers)}`,`   ${ne("─",["├","┼","┤"])}`]:[];return[`   ${ne("─",["┌","┬","┐"])}`,...re,...A.rows.map((le)=>`   ${te(le)}`),`   ${ne("─",["└","┴","┘"])}`].join(`
`)}function _a(A){let V=[];V.push("Hook Integration"),V.push(Im(A));let Q=[],ne=[];for(let te of A){let re=cn(te.platform);if(te.errors&&te.errors.length>0)for(let le of te.errors)if(te.configured)Q.push({platform:re,message:le});else ne.push({platform:re,message:le})}for(let te of Q)V.push(`   Warning (${te.platform}): ${te.message}`);for(let te of ne)V.push(qe.red(`   Error (${te.platform}): ${te.message}`));return V.join(`
`)}function Im(A){let V=["Platform","Discovery","Configuration","Inspection"],Q=A.map((ne)=>{let te=cn(ne.platform);if(ne.inspectionStatus==="not-inspected"){let be=qe.dim("Not inspected");return[te,be,be,be]}let re=ne.detected?qe.green("Detected"):ne.inspectionStatus==="failed"?qe.red("Unknown"):qe.dim("Not detected"),le=ne.configured?qe.green("Configured"):ne.detected?qe.yellow("Not configured"):ne.inspectionStatus==="failed"?qe.red("Unknown"):qe.dim("Not applicable"),ye=ne.inspectionStatus==="verified"?qe.green("Verified"):ne.inspectionStatus==="failed"?qe.red("Failed"):qe.dim("Not applicable");return[te,re,le,ye]});return Jn({headers:V,rows:Q})}function Aa(A){let Q=["Guard Engine Verification",`   Synthetic self-test: ${A.failed>0?qe.red(`${A.passed}/${A.total} FAIL`):qe.green(`${A.passed}/${A.total} passed`)}`],ne=A.results.filter((te)=>!te.passed);if(ne.length>0){Q.push(""),Q.push(qe.red("   Failures:"));for(let te of ne)Q.push(qe.red(`   • ${te.description}`)),Q.push(qe.red(`     expected ${te.expected}, got ${te.actual}`))}return Q.join(`
`)}function Om(A){if(A.length===0)return"   (no custom rules)";let V=["Source","Name","Command","Block Args"],Q=A.map((ne)=>[ne.source,ne.name,ne.subcommand?`${ne.command} ${ne.subcommand}`:ne.command,ne.blockArgs.join(", ")]);return Jn({headers:V,rows:Q})}function Ia(A){let V=[];if(V.push("Configuration"),V.push($m(A.userConfig,A.projectConfig)),V.push(""),A.effectiveRules.length>0)V.push(`   Effective rules (${A.effectiveRules.length} total):`),V.push(Om(A.effectiveRules));else V.push("   Effective rules: (none - using built-in rules only)");return V.join(`
`)}function $m(A,V){let Q=["Scope","Status"],ne=(re)=>{if(!re.exists)return qe.dim("N/A");if(!re.valid)return qe.red(`Invalid (${re.errors?.[0]??"unknown error"})`);return qe.green("Configured")},te=[["User",ne(A)],["Project",ne(V)]];return Jn({headers:Q,rows:te})}function Oa(A){let V=[];return V.push("Environment"),V.push(Dm(A)),V.join(`
`)}function $a(A){let V=A.effectiveSafety.policyScopes,Q=["Effective Safety",`   Selected preset: ${A.effectiveSafety.selectedPreset}${V?` (${Ur(V.levelScope)})`:""}`,`   Effective: ${A.effectiveSafety.level}`],ne=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[te,re]of ne){let le=A.effectiveSafety.capabilities[te],ye=le.enabled?qe.green("ON"):qe.dim("OFF"),be=le.sources.length>0?` (${le.sources.join(", ")})`:"";Q.push(`   ${re}: ${ye} via ${le.source}${be}`)}if(V&&V.weakenings.length>0){Q.push(`   Project policy deltas${V.weakeningsIgnored?" (ignored)":""}:`);for(let te of V.weakenings)Q.push(`      ${te}`)}Q.push(`   Stored rule customizations: ${A.effectiveSafety.ruleCounts.stored}`),Q.push(`   Effective rule customizations: ${A.effectiveSafety.ruleCounts.effective}`);for(let[te,re]of Object.entries(A.effectiveSafety.ruleOverrides))Q.push(`   ${te}: ${re}`);return Q.join(`
`)}function Da(A){let V=["Findings"];if(A.length===0)return V.push("   No findings from inspected doctor facts."),V.join(`
`);for(let Q of A){let ne=`[${Q.severity.toUpperCase()}] ${Q.checkId}: ${mn(Q.title)}`,te=Q.severity==="error"?qe.red:Q.severity==="warning"?qe.yellow:qe.blue;if(V.push(`   ${te(ne)}`),V.push(`      ${mn(Q.detail)}`),Q.path)V.push(`      Path: ${mn(Q.path)}`);if(Q.fixHint)V.push(`      Fix: ${mn(Q.fixHint)}`)}return V.join(`
`)}function Dm(A){let V=["Variable","Status","Legacy"],Q=A.map((ne)=>{let te=ne.isSet?qe.green("✓"):qe.dim("✗"),re=ne.legacyName&&ne.legacyIsSet?`${ne.legacyName} ${qe.green("✓")}`:ne.legacyName??"";return[ne.name,te,re]});return Jn({headers:V,rows:Q})}function Na(A){let V=[];if(A.totalBlocked===0)V.push("Recent Activity"),V.push("   No blocked commands in the last 7 days"),V.push("   Tip: This is normal for new installations");else V.push(`Recent Activity · last 7 days (${A.totalBlocked} blocked / ${A.sessionCount} sessions)`),V.push(Nm(A.recentEntries));if(A.unreadable>0)V.push(`   Warning: ${A.unreadable} audit log ${A.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return V.join(`
`)}function Nm(A){let V=["Time","Command"],Q=A.map((ne)=>{let te=mn(ne.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),re=te.length>40?`${te.slice(0,37)}...`:te;return[ne.relativeTime,re]});return Jn({headers:V,rows:Q})}function La(A){let V=[];if(V.push("Update Check"),A.latestVersion===null&&!A.error)return V.push(Br([["Status",qe.dim("Skipped")],["Installed",A.currentVersion]])),V.join(`
`);if(A.error)return V.push(Br([["Status",`${qe.yellow("⚠")} Error`],["Installed",A.currentVersion],["Error",qe.dim(A.error)]])),V.join(`
`);if(A.updateAvailable)return V.push(Br([["Status",`${qe.yellow("⚠")} Update Available`],["Current",A.currentVersion],["Latest",qe.green(A.latestVersion??"")]])),V.push(""),V.push("   Run: bunx cc-safety-net@latest doctor"),V.push("   Or:  npx cc-safety-net@latest doctor"),V.join(`
`);return V.push(Br([["Status",`${qe.green("✓")} Up to date`],["Version",A.currentVersion]])),V.join(`
`)}function Br(A){return Jn({rows:A})}function ja(A){let V=[];return V.push("System Info"),V.push(Lm(A)),V.join(`
`)}function Lm(A){let V=["Component","Version"],Q=(re)=>{if(re===null)return qe.dim("not found");return re},te=[{label:"cc-safety-net",value:A.version},...Lr.map((re)=>({label:cn(re),value:A.versions[re]??null})),{label:"Node.js",value:A.nodeVersion},{label:"npm",value:A.npmVersion},{label:"Bun",value:A.bunVersion},{label:"Platform",value:A.platform}].map((re)=>[re.label,Q(re.value)]);return Jn({headers:V,rows:te})}function Ha(A){if(A.findings.length===0)return qe.green(`
No findings from inspected doctor facts.`);let V={error:A.findings.filter((re)=>re.severity==="error").length,warning:A.findings.filter((re)=>re.severity==="warning").length,info:A.findings.filter((re)=>re.severity==="info").length},Q=["error","warning","info"].filter((re)=>V[re]>0).map((re)=>`${V[re]} ${re}`),ne=A.findings.length===1?"finding":"findings",te=`
${A.findings.length} ${ne}: ${Q.join(", ")}.`;if(V.error>0)return qe.red(te);if(V.warning>0)return qe.yellow(te);return qe.blue(te)}import{lstatSync as jm}from"node:fs";import{dirname as as}from"node:path";function ls(A,V){try{let Q=jm(V);if(Q.isSymbolicLink())return{kind:A,path:V,status:"unsafe",issues:["symlink"]};if(!Q.isDirectory())return{kind:A,path:V,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:A,path:V,status:"unknown",issues:[]};let ne=[...Q.uid!==process.getuid()?["ownership"]:[],...(Q.mode&18)!==0?["permissions"]:[]];return{kind:A,path:V,status:ne.length>0?"unsafe":"safe",issues:ne}}catch(Q){if(typeof Q==="object"&&Q!==null&&"code"in Q&&Q.code==="ENOENT")return{kind:A,path:V,status:"not-applicable",issues:[]};return{kind:A,path:V,status:"unknown",issues:[]}}}function Fa(A,V){let Q=W(A);return{directories:[ls("policy",as(as(V))),ls("config",as(V)),...Q?[ls("audit",Q)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as Hm}from"node:child_process";import{existsSync as Ma}from"node:fs";import{delimiter as Fm,extname as Mm,join as Um}from"node:path";import{stripVTControlCharacters as Ua}from"node:util";var Ga="2.7.15",Bm=5000,Gm="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function un(){return Ga}function cs(A,V){let Q=A[V];if(Q)return Q;let ne=Object.keys(A).find((te)=>te.toLowerCase()===V.toLowerCase()&&!!A[te]);return ne?A[ne]:Q}function qm(A){return(cs(A,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((V)=>V.length>0)}function Vm(A,V){let Q=Mm(A)?[A]:[...qm(V).map((ne)=>`${A}${ne}`),A];if(A.includes("/")||A.includes("\\"))return Q.find((ne)=>Ma(ne))??A;return(cs(V,"PATH")??"").split(Fm).flatMap((ne)=>Q.map((te)=>Um(ne,te))).find((ne)=>Ma(ne))??A}function Ba(A){if(!/[\s"&|<>^]/.test(A))return A;return`"${A.replace(/"/g,'""')}"`}function Wn(A,V){let[Q,...ne]=A,te=V[Gm]==="win32"?"win32":process.platform;if(!Q||te!=="win32")return{cmd:Q??"",args:ne};let re=Vm(Q,V);if(!/\.(?:bat|cmd)$/i.test(re))return{cmd:re,args:ne};return{cmd:cs(V,"COMSPEC")??"cmd.exe",args:["/d","/s","/c",`"${["call",Ba(re),...ne.map(Ba)].join(" ")}"`],windowsVerbatimArguments:!0}}var zt=async(A,V=Bm)=>{let Q=await Km(A,{timeoutMs:V});if(Q.code!==0)return null;return Ua(Q.stdout).trim()||Ua(Q.stderr).trim()||null};function Km(A,V){let[Q,...ne]=A;if(!Q)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((te)=>{try{let re=Wn([Q,...ne],process.env),le=Hm(re.cmd,re.args,{stdio:["ignore","pipe","pipe"],windowsVerbatimArguments:re.windowsVerbatimArguments}),ye=!1,be="",_e="";le.stdout.on("data",(Le)=>{be+=Le.toString()}),le.stderr.on("data",(Le)=>{_e+=Le.toString()});let Ae=(Le)=>{if(ye)return;ye=!0,clearTimeout($e),te(Le)},$e=setTimeout(()=>{le.kill(),Ae({code:null,stdout:be,stderr:_e})},V.timeoutMs);le.on("close",(Le)=>{Ae({code:Le,stdout:be,stderr:_e})}),le.on("error",()=>{Ae({code:null,stdout:be,stderr:_e})})}catch{te({code:null,stdout:"",stderr:""})}})}function Gr(A){if(!A)return null;let V=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(A);if(V)return V[1]??null;let Q=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(A);if(Q)return Q[1]??null;return A.split(`
`)[0]?.trim()||null}async function qr(A,V=zt,Q=process.cwd()){let ne=Promise.all(xn.map(async($e)=>[$e.id,Gr(await V([...$e.probeCommand]))])),[te,re,le,ye,be,_e,Ae]=await Promise.all([ne,ne.then(async($e)=>{let Le=$e.find(([Me])=>Me==="opencode")?.[1];if(!Le?.startsWith("2.")||!A(Le))return null;let Fe=["--param",`location[directory]=${Q}`],Ne=["opencode","api","integration.list",...Fe];return await V(Ne,30000),V(["opencode","api","plugin.list",...Fe],30000)}),V(["codex","plugin","list"],30000),V(["amp","plugins","list"],30000),V(["node","--version"]),V(["npm","--version"]),V(["bun","--version"])]);return{version:Ga,versions:Object.fromEntries(te),codexPluginListOutput:le,ampPluginListOutput:ye,openCodePluginListOutput:re,nodeVersion:Gr(be),npmVersion:Gr(_e),bunVersion:Gr(Ae),platform:`${process.platform} ${process.arch}`}}function ds(A,V){if(V==="dev")return!1;let Q=A.split(".").map(Number),ne=V.split(".").map(Number),[te=0,re=0,le=0]=Q,[ye=0,be=0,_e=0]=ne;if(te!==ye)return te>ye;if(re!==be)return re>be;return le>_e}async function Mn(){let A=un(),V=new AbortController,Q=setTimeout(()=>V.abort(),3000);try{let ne=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:V.signal});if(!ne.ok)return{currentVersion:A,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${ne.status}`};let te=await ne.json(),re=ds(te.version,A);return{currentVersion:A,latestVersion:te.version,updateAvailable:re}}catch(ne){return{currentVersion:A,latestVersion:null,updateAvailable:!1,error:ne instanceof Error?ne.message:"Network error"}}finally{clearTimeout(Q)}}import*as Za from"node:readline";var za=(A)=>`\x1B[${A}B`,zm=(A)=>`\x1B[${A}A`;var qa=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Jm(A){return new Promise((V)=>setTimeout(V,A))}function Wm(A,V,Q){if(!Q)return V(A);if(Q.aborted)return Promise.resolve();return new Promise((ne,te)=>{let re=()=>Q.removeEventListener("abort",le),le=()=>{re(),ne()};Q.addEventListener("abort",le,{once:!0}),V(A).then(()=>{re(),ne()},(ye)=>{re(),te(ye)})})}function Vr(A){return Math.max(0,Math.min(1,A))}function Jt(A){return Math.max(0,Math.min(255,Math.round(A)))}function us(A){return A<=0.0031308?12.92*A:1.055*A**0.4166666666666667-0.055}function Ym(A,V,Q){let ne=Q*Math.PI/180,te=V*Math.cos(ne),re=V*Math.sin(ne),le=(A+0.3963377774*te+0.2158037573*re)**3,ye=(A-0.1055613458*te-0.0638541728*re)**3,be=(A-0.0894841775*te-1.291485548*re)**3;return{blue:Jt(us(Vr(-0.0041960863*le-0.7034186147*ye+1.707614701*be))*255),green:Jt(us(Vr(-1.2684380046*le+2.6097574011*ye-0.3413193965*be))*255),red:Jt(us(Vr(4.0767416621*le-3.3077115913*ye+0.2309699292*be))*255)}}function ps(A,V){let Q=(V*A*180/Math.PI%360+360)%360;return Ym(0.72,0.15,Q)}function Ja(A,V=0.1){let Q=ps(V,A);return`\x1B[38;2;${Q.red};${Q.green};${Q.blue}m`}function Zm(A,V){return{blue:Jt(A.blue+(255-A.blue)*V),green:Jt(A.green+(255-A.green)*V),red:Jt(A.red+(255-A.red)*V)}}function Wa(A,V,Q){let ne=Math.imul(A+2654435769,2246822507)^Math.imul(V+3266489909,668265263)^Math.imul(Q+374761393,2654435761),te=ne^ne>>>15,re=Math.imul(te,739982445),le=re^re>>>12,ye=Math.imul(le,695872825);return((ye^ye>>>15)>>>0)/4294967296}function Xm(A,V,Q){let ne=Math.floor(Wa(A,V,Q)*qa.length);return qa[ne]??"░"}function Va(A){let V=Vr(A);return V*V*V*(V*(V*6-15)+10)}function Qm(A){if(A.length===0)return"";let V=[],Q=!1,ne="";for(let te of A){let re=`${te.red};${te.green};${te.blue}`;if(te.bold!==Q)V.push(te.bold?"\x1B[1m":"\x1B[22m"),Q=te.bold;if(re!==ne)V.push(`\x1B[38;2;${re}m`),ne=re;V.push(te.character)}return`${V.join("")}\x1B[22m\x1B[39m`}function eg(A,V,Q,ne,te){return A.map((re,le)=>({...ps(Q,ne+V+le/te),bold:!1,character:re}))}function ng(A,V,Q,ne,te,re,le,ye){let be=Math.max(1,ne*0.75),_e=Math.min(1,Q/be),Ae=te*Va(_e),$e=Math.max(0,(Q-be)/Math.max(1,ne-be)),Le=(1-Va(Q/ne))*ye*2,Fe=0.35*Math.max(0,1-$e*2),Ne=_e>=1,Me=Math.min(A.length,Math.ceil(Ae+2+1));return A.slice(0,Me).map((Be,tn)=>{let en=ps(re,le+V+tn/ye+Le),on=tn+Wa(V,tn,7919)*2-1;if(on>Ae+2)return{...en,bold:!1,character:" "};let ln=Ae-on,nn=0.8*Math.exp(-(ln*ln)/12.5),sn=Math.min(0.9,nn+Fe),Pn=!Ne&&on>Ae-4;return{...Zm(en,sn),bold:sn>0.3,character:Pn?Xm(V,tn,Q):Be}})}function Ka(A){return`\x1B[?2026h${A.map((V,Q)=>`\x1B8${Q>0?za(Q):""}${Qm(V)}`).join("")}\x1B[?2026l`}async function fs(A,V={}){if(!A)return;let Q=V.output??process.stdout,ne=V.sleep??Jm,te=V.seed??0,re=A.split(`
`).map((Ae)=>Array.from(Ae)),le=Math.max(...re.map((Ae)=>Ae.length)),ye=12000*re.filter((Ae)=>Ae.length>0).length/40,be=le>0?Math.max(1,Math.ceil(ye/16.666666666666668)):0,_e=be>0?ye/be:0;Q.write(`\x1B[?25l${re.length>1?`${`
`.repeat(re.length-1)}${zm(re.length-1)}`:""}\x1B7`);try{for(let Ae=1;Ae<=be;Ae+=1){if(V.signal?.aborted)break;Q.write(Ka(re.map(($e,Le)=>ng($e,Le,Ae,be,le,0.1,te,3)))),await Wm(_e,ne,V.signal)}}finally{if(Q.write(Ka(re.map((Ae,$e)=>eg(Ae,$e,0.1,te,3)))),Q.write("\x1B8"),re.length>1)Q.write(za(re.length-1));Q.write(`
\x1B[0m\x1B[?25h`)}}var Ya=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function tg(A){return Boolean(A.isTTY)}async function dr(A={}){let V=A.output??process.stdout;if(!tg(V))return;let Q=A.input??process.stdin,ne={output:V,seed:A.seed??Math.random()*8192,sleep:A.sleep};if(!Q.isTTY||typeof Q.setRawMode!=="function"){await fs(Ya,ne);return}let te=new AbortController,re=Q.readableFlowing===!0,le=Q.isRaw===!0,ye=!1,be=(_e,Ae)=>{if(Ae.ctrl&&Ae.name==="c")ye=!0;if(ye||Ae.name==="return"||Ae.name==="enter")te.abort()};Za.emitKeypressEvents(Q),Q.on("keypress",be),Q.setRawMode(!0),Q.resume();try{await fs(Ya,{...ne,signal:te.signal})}finally{if(Q.off("keypress",be),Q.setRawMode(le),!re)Q.pause()}if(!ye)return;if(A.onInterrupt){A.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as ig}from"node:crypto";import{existsSync as Qa}from"node:fs";import{dirname as Kr,join as el}from"node:path";import{dirname as Xa,join as rg}from"node:path";var og="rule.lock";function sg(A){return rg(Xa(A),og)}function hn(A,V){let Q=V.global?V.userConfigPath??K(A,V):V.projectConfigPath??D(V.cwd??process.cwd()),ne=V.global?yt(A,V):vt(Q,V.cwd??process.cwd()),te=sg(Q);return{configDir:Xa(Q),configPath:Q,lockPath:te,filesystemScope:ne,configTarget:s(ne,Q),lockTarget:s(ne,te)}}var ag="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",lg="cache",cg="rulebooks";function nl(A,V={}){let Q=hn(A,V),ne=s(Q.filesystemScope,rl(Q.configDir)),te=o(Q.lockTarget);if(console.log(ag),te===null&&!Qa(ne.path))return console.log(`No v2 lock or cache leftovers found in ${Kr(Q.configDir)}; nothing to migrate.`),0;let re=mg(te),le=f(Q.configTarget);if(!le.config&&(o(Q.configTarget)!==null||re.size>0))return console.error(`Cannot migrate: the rules config in ${Kr(Q.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let ye=le.config?.rules??[];for(let be of ye.flatMap((_e)=>dg(_e,re,Q,ne,V.global===!0)))console.log(be);return q(Q.lockTarget),Lt(ne),console.log(`Removed the v2 lock and cache under ${Kr(Q.configDir)}.`),0}function tl(A,V){return[...new Set([{cwd:V},{cwd:V,global:!0}].flatMap((Q)=>{let ne=hn(A,Q);return[ne.lockPath,rl(ne.configDir)]}))].filter((Q)=>Qa(Q))}function dg(A,V,Q,ne,te){if(!T(A))return[];let re=j(A).name,le=s(Q.filesystemScope,U(Q.configDir,re)),ye=o(le);if(ye!==null&&ug(ye,re))return[];let be=V.get(A),_e=be?pg(be,re,ne.path,Q.filesystemScope):null;if(_e===null)return[`Could not migrate ${A} from the v2 cache. Run \`cc-safety-net rule update ${A}${te?" --global":""}\` to vendor it.`];if(b(le,_e),ye!==null)return[`Restored ${A} from the v2 cache over an invalid file.`];return[`Vendored ${A} from the v2 cache.`]}function ug(A,V){let Q=Te(A);return!("problem"in Q)&&Q.rulebook.name===V}function pg(A,V,Q,ne){let te=el(Q,cg,`${fg(A)}--${A.digest.replace("sha256:","").slice(0,12)}`,we),re=o(s(ne,te));if(re===null||yg(re)!==A.digest)return null;let le=Te(re);if("problem"in le||le.rulebook.name!==V)return null;return re}function rl(A){return el(Kr(A),lg)}function fg(A){return([A.owner,A.repo,A.display_ref,A.name].every((ne)=>typeof ne==="string"&&ne!=="")?`${A.owner}/${A.repo}#${A.display_ref}/${A.name}`:A.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function mg(A){let V=A===null?null:hg(A),Q=ol(V)&&Array.isArray(V.rulebooks)?V.rulebooks:[];return new Map(Q.filter(gg).map((ne)=>[ne.spec,ne]))}function gg(A){return ol(A)&&typeof A.spec==="string"&&typeof A.digest==="string"}function ol(A){return!!A&&typeof A==="object"}function hg(A){try{return JSON.parse(A)}catch{return null}}function yg(A){return`sha256:${ig("sha256").update(A).digest("hex")}`}var sl="\r\x1B[2K",vg="\x1B[?25l",bg="\x1B[39m",wg="\x1B[?25h",kg=100,Cg=0.55,xg=80,il=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function Sg(A){return new Promise((V)=>setTimeout(V,A))}async function zr(A,V={}){let Q=V.output??process.stdout;if(!Q.isTTY)return A;let ne=V.sleep??Sg,te=!1,re=A.then((ye)=>(te=!0,ye),(ye)=>{throw te=!0,ye});if(await Promise.race([re.then(()=>!0),ne(kg).then(()=>!1)]))return re;Q.write(vg);try{for(let ye=0;!te;ye+=1)Q.write(`${sl}${Ja(ye*Cg)}${il[ye%il.length]}${bg} ${V.loadingMessage??"Loading…"}`),await Promise.race([re,ne(xg)]);return await re}finally{Q.write(`${sl}${wg}`)}}async function ur(A,V,Q,ne={}){let te=V();if(A)await Q();if(A&&te.ready)await zr(te.ready,ne);return te.finish()}import{stripVTControlCharacters as Pg}from"node:util";var Jr="amp plugins list",Rg=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function al(A){if(!A.ampPluginListOutput)return{platform:"amp",status:"n/a"};let V=Pg(A.ampPluginListOutput).split(`
`).map((Q)=>Rg.exec(Q)?.[1]).find((Q)=>Q!==void 0);if(!V)return{platform:"amp",status:"n/a"};if(V!=="active")return{platform:"amp",status:"disabled",method:Jr,configPath:Jr,errors:[`Amp personal plugin cc-safety-net is ${V}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:Jr,configPath:Jr}}import{existsSync as $g,readFileSync as Dg}from"node:fs";import{isAbsolute as mS,join as Og}from"node:path";function pr(A){return Og(A,".gemini","config","hooks.json")}var cl=new Map([["run_command","auto"]]),dl="manage_task";var Ng=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function Lg(A){if(!A||typeof A!=="object"||Array.isArray(A))return[];return Object.values(A).flatMap((V)=>{if(!V||typeof V!=="object"||Array.isArray(V))return[];let Q=V,ne=Q.PreToolUse;if(!Array.isArray(ne))return[];return ne.flatMap((te)=>{if(!te||typeof te!=="object"||Array.isArray(te))return[];let re=te.hooks;if(!Array.isArray(re))return[];return re.flatMap((le)=>{if(!le||typeof le!=="object"||Array.isArray(le))return[];let ye=le.command;if(typeof ye!=="string"||!Ng.test(ye))return[];return[{command:ye,enabled:Q.enabled!==!1}]})})})}function ul(A){let V=pr(A.environment.home);if(!$g(V))return{platform:"antigravity-cli",status:"n/a",configPath:V};let Q;try{Q=Lg(JSON.parse(Dg(V,"utf-8")))}catch(ne){return{platform:"antigravity-cli",status:"n/a",configPath:V,errors:[`Failed to parse Antigravity hooks config ${V}: ${ne instanceof Error?ne.message:String(ne)}`]}}if(Q.some((ne)=>ne.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:V};if(Q.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:V};return{platform:"antigravity-cli",status:"n/a",configPath:V}}import{existsSync as jg}from"node:fs";import{join as $n}from"node:path";var Xr="cc-safety-net@cc-marketplace";function Qr(A){return A.env.get("CLAUDE_CONFIG_DIR")||$n(A.home,".claude")}function pl(A){return $n(A.env.get("CLAUDE_CODE_PLUGIN_CACHE_DIR")||$n(Qr(A),"plugins"),"installed_plugins.json")}function fl(A,V){let Q=n(n(A,"plugins"),V);return Array.isArray(Q)&&Q.length>0}function eo(A,V){let Q=v(pl(A));return Q.kind==="ok"&&fl(Q.value,V)}function hs(A){return ml(pl(A),$n(Qr(A),"settings.json"))}function ml(A,V){let Q=v(A);if(Q.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(Q.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!fl(Q.value,Xr))return{platform:"claude-code",status:"n/a"};let ne=v(V);if(ne.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(ne.kind==="ok"&&n(n(ne.value,"enabledPlugins"),Xr)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:V,errors:[`${Xr} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:A}}function gl(A){let V=$n(A.home,".claude"),Q=$n(V,"plugins","installed_plugins.json");if(ml(Q,$n(V,"settings.json")).status!=="configured")return;let ne=v(Q),te=ne.kind==="ok"?n(n(ne.value,"plugins"),Xr):void 0,re=(Array.isArray(te)?te:[]).filter((_e)=>n(_e,"scope")==="user").map((_e)=>n(_e,"installPath")).find((_e)=>typeof _e==="string");if(!re)return;let le=$n(re,".cursor-plugin","plugin.json"),ye=v(le),be=ye.kind==="ok"?n(ye.value,"hooks"):void 0;return typeof be==="string"&&jg($n(re,be))?le:void 0}function hl(A){return hs(A.environment)}var yl="Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.";function vl(A){if(!A.codexPluginListOutput)return{platform:"codex",status:"n/a"};let V=A.codexPluginListOutput.split(`
`).find((Q)=>Q.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!V)return{platform:"codex",status:"n/a"};if(!V.includes("installed,"))return{platform:"codex",status:"n/a"};if(!V.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex runs only trusted hooks, and doctor cannot check trust. Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."]}}import{existsSync as oo,readdirSync as Hg,readFileSync as Fg}from"node:fs";import{join as vn}from"node:path";function gn(A){let V="",Q=0,ne=!1,te=!1,re=-1;while(Q<A.length){let le=A[Q],ye=A[Q+1];if(te){V+=le,te=!1,Q++;continue}if(le==='"'&&!ne){ne=!0,re=-1,V+=le,Q++;continue}if(le==='"'&&ne){ne=!1,V+=le,Q++;continue}if(le==="\\"&&ne){te=!0,V+=le,Q++;continue}if(ne){V+=le,Q++;continue}if(le==="/"&&ye==="/"){while(Q<A.length&&A[Q]!==`
`)Q++;continue}if(le==="/"&&ye==="*"){Q+=2;while(Q<A.length-1){if(A[Q]==="*"&&A[Q+1]==="/"){Q+=2;break}Q++}continue}if(le===","){re=V.length,V+=le,Q++;continue}if(le==="}"||le==="]"){if(re!==-1){let be=V.slice(re+1);if(/^\s*$/.test(be))V=V.slice(0,re)+be}re=-1,V+=le,Q++;continue}if(!/\s/.test(le))re=-1;V+=le,Q++}return V}function wl(A,V,Q){let ne=V+1,te=!1;while(ne<A.length){if(te){te=!1,ne++;continue}if(A[ne]==="\\"){te=!0,ne++;continue}if(A[ne]==='"')return ne+1;ne++}throw Error(Q)}function vs(A,V,Q){let ne=A[V],te=ne==="["?"]":"}",re=0,le=V;while(le<A.length){let ye=Q.skipComment?.(A,le)??le;if(ye!==le){le=ye;continue}if(A[le]==='"'){le=wl(A,le,Q.stringError);continue}if(A[le]===ne)re++;if(A[le]===te){if(re--,re===0)return le}le++}throw Error(Q.bracketError)}function kl(A,V){let Q=A.lastIndexOf(`
`,V)+1;return/^[ \t]*/.exec(A.slice(Q))?.[0]??""}function Cl(A,V){let Q=V.end+(/^\s*/.exec(A.slice(V.end))?.[0].length??0);if(A[Q]===","){let le=A[Q+1]===`
`?Q+2:Q+1;return`${A.slice(0,V.start)}${A.slice(le)}`}let ne=A.slice(0,V.start).search(/\s*$/)-1;if(A[ne]!==",")return`${A.slice(0,V.start)}${A.slice(V.end)}`;let te=A.lastIndexOf(`
`,ne-1),re=te!==-1&&/^\s*$/.test(A.slice(te+1,ne))?te:ne;return`${A.slice(0,re)}${A.slice(V.end)}`}function ys(A,V){if(A.startsWith("//",V)){let Q=A.indexOf(`
`,V+2);return Q===-1?A.length:Q+1}if(A.startsWith("/*",V)){let Q=A.indexOf("*/",V+2);return Q===-1?A.length:Q+2}return V}function bl(A,V){let Q=V;while(Q<A.length){if(/\s/.test(A[Q]??"")){Q++;continue}let ne=ys(A,Q);if(ne===Q)return Q;Q=ne}return Q}function xl(A,V,Q){let ne=0,te=0;while(te<A.length){let re=ys(A,te);if(re!==te){te=re;continue}if(A[te]==='"'){let le=wl(A,te,Q.stringError);if(ne===1&&JSON.parse(A.slice(te,le))===V){let ye=bl(A,le),be=bl(A,ye+1);if(A[ye]===":"&&A[be]==="[")return{start:be,end:vs(A,be,{skipComment:ys,...Q})}}te=le;continue}if(A[te]==="{"||A[te]==="[")ne++;if(A[te]==="}"||A[te]==="]")ne--;te++}return}var En="cc-safety-net@cc-marketplace",no=["cc-marketplace","cc-safety-net"],Sl=["_direct","copilot-safety-net"],Pl=["cc-marketplace","safety-net"],Rl="safety-net@cc-marketplace";function to(A,V){let Q=V.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${Q}([^a-z0-9-]|$)`,"m").test(A??"")}function El(A){return to(A,"cc-safety-net@cc-marketplace")}function Tl(A){return to(A,"cc-marketplace")}function _l(A){return to(A,"copilot-safety-net")}function Al(A){return to(A,"safety-net@cc-marketplace")}function ro(A){if(!A?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(A)}function Ol(A,V){if(!A)return null;let Q=A.match(/(\d+)\.(\d+)\.(\d+)/);if(!Q)return null;let ne=[Number(Q[1]),Number(Q[2]),Number(Q[3])];for(let te=0;te<V.length;te++){let re=ne[te]??0,le=V[te]??0;if(re!==le)return re>le}return!0}function Mg(A){return Ol(A,[0,0,422])}function Ug(A){return Ol(A,[1,0,8])}function gr(A){return A.env.get("COPILOT_HOME")||vn(A.home,".copilot")}function $l(A){return A.disableAllHooks!==!0&&Dl(A)}function Dl(A){return(A.hooks?.preToolUse??[]).some((Q)=>{if(Q.type!==void 0&&Q.type!=="command")return!1;return ro(Q.command)||ro(Q.bash)||ro(Q.powershell)||ro(Q.exec&&[Q.exec,...Q.args??[]].join(" "))})}function fr(A){return A===void 0||typeof A==="string"}function Bg(A){return A===void 0||Array.isArray(A)&&A.every((V)=>typeof V==="string")}function Gg(A){if(!A||typeof A!=="object"||Array.isArray(A))return!1;let V=A;if(V.disableAllHooks!==void 0&&typeof V.disableAllHooks!=="boolean")return!1;if(V.hooks===void 0)return!0;if(!V.hooks||typeof V.hooks!=="object"||Array.isArray(V.hooks))return!1;let Q=V.hooks.preToolUse;if(Q===void 0)return!0;return Array.isArray(Q)&&Q.every((ne)=>ne!==null&&typeof ne==="object"&&!Array.isArray(ne)&&fr(ne.type)&&fr(ne.command)&&fr(ne.bash)&&fr(ne.powershell)&&fr(ne.exec)&&Bg(ne.args))}function bs(A,V){try{let Q=JSON.parse(gn(Fg(A,"utf-8")));if(!Gg(Q)){V?.push(`Invalid hook config ${A}: hooks.preToolUse must be an array of hook objects`);return}return Q}catch(Q){V?.push(`Failed to parse ${A}: ${Q instanceof Error?Q.message:String(Q)}`);return}}function Nl(A,V){try{return Hg(A).filter((Q)=>Q.endsWith(".json")).sort((Q,ne)=>Q.localeCompare(ne))}catch(Q){return V?.push(`Failed to read ${A}: ${Q instanceof Error?Q.message:String(Q)}`),[]}}function qg(A,V){if(!oo(A))return[];let Q=[];for(let ne of Nl(A,V)){let te=vn(A,ne),re=bs(te,V);if(re&&$l(re))Q.push(te)}return Q}function mr(A,V){if(!oo(A))return;let Q=bs(A,V);if(!Q)return;return{path:A,config:Q}}function Il(A,V,Q,ne){if(V){A.push(`GitHub Copilot CLI ${V} does not support ${Q}; requires ${ne}+`);return}A.push(`GitHub Copilot CLI version unavailable; skipping ${Q} because it requires ${ne}+`)}function Vg(A){for(let V of A){if(V?.config.disableAllHooks===!0)return V.path;if(V?.config.disableAllHooks===!1)return}return}function Kg(A,V,Q,ne){let te=gr(A),re=vn(V,".github","hooks"),le=vn(te,"hooks"),ye=vn(V,".github","copilot"),be=vn(V,".claude"),_e=Ug(Q),Ae=_e===!0?ne:void 0,$e=[mr(vn(ye,"settings.local.json"),Ae),mr(vn(ye,"settings.json"),Ae),mr(vn(be,"settings.local.json"),Ae),mr(vn(be,"settings.json"),Ae)],Le=mr(vn(te,"settings.json"),Ae),Fe=[Le?.config.disableAllHooks===!0?void 0:Le];if(_e!==!1){let nn=Vg($e);if(nn){if(_e===null)ne.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${nn} as active`);return{activeConfigPaths:[],repoInlineSources:$e,disabledBy:nn}}}let Ne=qg(re,ne),Me=Mg(Q),Be=Me===!0?ne:void 0,tn=oo(le)?Nl(le,Be):[],en=[];for(let nn of tn){let sn=vn(le,nn),Pn=bs(sn,Be);if(Pn&&$l(Pn))en.push(sn)}if(Me!==!0&&en.length>0)Il(ne,Q,`user hook files in ${le}`,"0.0.422"),en.length=0;let on=[];for(let nn of[...$e,...Fe]){if(!nn)continue;if(!Dl(nn.config))continue;if(_e===!0){on.push(nn);continue}Il(ne,Q,"inline hook definitions in Copilot config files","1.0.8");break}let ln=(nn)=>nn.filter((sn)=>!!sn&&on.includes(sn)).map((sn)=>sn.path);return{activeConfigPaths:[...ln($e),...Ne,...ln(Fe),...en],repoInlineSources:$e}}function Ll(A){let V=[],Q=Kg(A.environment,A.cwd,A.copilotCliVersion,V);if(Q.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:Q.disabledBy,configPaths:[Q.disabledBy],errors:V.length>0?V:void 0};let ne=gr(A.environment),te=vn(ne,"installed-plugins",...no),re=oo(te),le=vn(ne,"settings.json"),ye=v(le,gn),be=(Fe)=>n(n(Fe,"enabledPlugins"),En),_e=Q.repoInlineSources.find((Fe)=>typeof be(Fe?.config)==="boolean"),Ae=_e??(ye.kind==="ok"?{path:le,config:ye.value}:void 0);if(re&&!_e&&ye.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};let $e=re&&Ae!==void 0&&be(Ae.config)===!1;if($e&&Q.activeConfigPaths.length===0)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:Ae.path,errors:[`${En} is installed but not enabled in Copilot CLI`]};let Le=re&&!$e;if(Le||Q.activeConfigPaths.length>0){let Fe=Q.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:Le?"plugin config":"hook config",configPath:Fe??(Le?te:void 0),configPaths:Q.activeConfigPaths.length>0?Q.activeConfigPaths:void 0,errors:V.length>0?V:void 0}}return{platform:"copilot-cli",status:"n/a",errors:V.length>0?V:void 0}}import{existsSync as Es,readdirSync as ih,readFileSync as ah}from"node:fs";import{join as Rs}from"node:path";import{existsSync as Ss,mkdirSync as Qg,readFileSync as eh,rmSync as nh}from"node:fs";import{dirname as th,join as so}from"node:path";import{existsSync as zg,renameSync as Jg,statSync as Wg,writeFileSync as Yg}from"node:fs";function an(A,V){let Q=`${A}.${process.pid}.tmp`;Yg(Q,V,zg(A)?{mode:Wg(A).mode&511}:{}),Jg(Q,A)}import{spawn as Zg}from"node:child_process";function Xg(A){return A.join(" ")}function ws(A,V,Q){return[`Failed to run ${Xg(A)}${V===null?"":` (exit ${V})`}.`,Q.trim()].filter(Boolean).join(`
`)}function ks(A){let V={stdout:"",stderr:""};return A.stdout.setEncoding("utf-8"),A.stderr.setEncoding("utf-8"),A.stdout.on("data",(Q)=>{V.stdout+=Q}),A.stderr.on("data",(Q)=>{V.stderr+=Q}),V}function pn(A,V){return new Promise((Q,ne)=>{let te=Wn([...A],process.env),re=Zg(te.cmd,te.args,{stdio:["ignore","pipe","pipe"],windowsVerbatimArguments:te.windowsVerbatimArguments}),le=ks(re),ye=()=>[le.stdout,le.stderr].filter(Boolean).join(`
`),be=V?.timeoutMs??120000,_e=setTimeout(()=>{re.kill(),ne(Error(ws(A,null,`Timed out after ${be}ms.
${ye()}`.trim())))},be);re.on("error",(Ae)=>{clearTimeout(_e),ne(Error(ws(A,null,`${Ae.message}
${ye()}`.trim())))}),re.on("close",(Ae)=>{if(clearTimeout(_e),Ae!==0){ne(Error(ws(A,Ae,ye())));return}Q(V?.stdoutOnly?le.stdout:ye())})})}async function Cs(A){for(let V of A)await pn(V)}async function jl(A){for(let V of A)try{await pn(V)}catch(Q){console.warn(Q instanceof Error?Q.message:String(Q))}}var bn=Object.fromEntries(cr.map((A)=>[A.id,`npx -y cc-safety-net hook ${A.flags[1]}`]));var yr=bn.cursor,Hl=30;function ao(A){return so(A.home,".cursor","hooks.json")}var hr="cc-safety-net";function Ps(A){let V=so(A.home,".cursor","plugins");return{cache:so(V,"cache",hr),marketplaceClone:so(V,"marketplaces","github.com","kenryu42","cc-safety-net")}}async function Fl(A){let V=Object.values(Ps(A));if(!V.some((ne)=>Ss(ne)))return;let Q="No marketplace matches";return await pn(["cursor-agent","plugin","marketplace","remove",hr]).catch((ne)=>{if(!(ne instanceof Error&&ne.message.includes(Q)))throw ne}),V.forEach((ne)=>nh(ne,{recursive:!0,force:!0})),[`Removed the ${hr} marketplace from your Cursor account.`,"If /plugins in cursor-agent still lists CC Safety Net as installed, uninstall it there."].join(`
`)}function Zn(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function xs(){return{command:yr,timeout:Hl,failClosed:!0}}function io(A){return Zn(A)&&A.command===yr}function rh(A){return Object.keys(A).length===3&&A.command===yr&&A.timeout===Hl&&A.failClosed===!0}function oh(A){try{return JSON.parse(eh(A,"utf-8"))}catch(V){if(V instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${A}: ${V.message}`);throw V}}function Ml(A){let V=oh(A);if(!Zn(V))throw Error(`Cursor hooks config ${A} must be a JSON object`);if(V.version!==1)throw Error(`Cursor hooks config ${A} must set "version": 1`);if(V.hooks!==void 0&&!Zn(V.hooks))throw Error(`Cursor hooks config ${A} "hooks" must be an object`);let Q=Zn(V.hooks)?V.hooks.preToolUse:void 0;if(Q!==void 0&&!Array.isArray(Q))throw Error(`Cursor hooks config ${A} "hooks.preToolUse" must be an array`);return V}function Ul(A){let V=Zn(A.hooks)?A.hooks.preToolUse:void 0;return Array.isArray(V)?V:[]}function sh(A){if(!A.some(io))return[...A,xs()];return A.reduce((V,Q)=>{if(!io(Q))return V.result.push(Q),V;if(!V.inserted)V.result.push(xs()),V.inserted=!0;return V},{result:[],inserted:!1}).result}function Bl(A,V,Q){let ne=Zn(V.hooks)?V.hooks:{},te={...V,hooks:{...ne,preToolUse:Q}};an(A,`${JSON.stringify(te,null,2)}
`)}function Gl(A){let V=ao(A);if(!Ss(V))return Qg(th(V),{recursive:!0}),an(V,`${JSON.stringify({version:1,hooks:{preToolUse:[xs()]}},null,2)}
`),{path:V,alreadyInstalled:!1};let Q=Ml(V),ne=Ul(Q),te=ne.filter(io);if(Zn(Q.hooks)&&Array.isArray(Q.hooks.preToolUse)&&te.length===1&&te[0]!==void 0&&rh(te[0]))return{path:V,alreadyInstalled:!0};return Bl(V,Q,sh(ne)),{path:V,alreadyInstalled:!1}}function ql(A){let V=ao(A);if(!Ss(V))return{path:V,alreadyInstalled:!1};let Q=Ml(V),ne=Ul(Q),te=ne.filter((re)=>!io(re));if(te.length===ne.length)return{path:V,alreadyInstalled:!1};return Bl(V,Q,te),{path:V,alreadyInstalled:!0}}function lh(A){if(!A||typeof A!=="object"||Array.isArray(A))return[];let V=A.hooks;if(!V||typeof V!=="object"||Array.isArray(V))return[];let Q=V.preToolUse;if(!Array.isArray(Q))return[];return Q.filter((ne)=>!!ne&&typeof ne==="object"&&!Array.isArray(ne)&&ne.command===yr)}function ch(A){let V=[];if(A.length>1)V.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let Q=A[0];if(Q&&Q.failClosed!==!0)V.push('Managed hook is missing "failClosed": true; reinstall to repair');if(Q&&Q.timeout!==30)V.push('Managed hook "timeout" is not 30; reinstall to repair');return V}var lo="Claude Code plugin",Ts="Cursor plugin";function dh(A){let V=Rs(Ps(A).cache,hr);if(!Es(V))return{};try{return{version:ih(V).map((Q)=>Rs(V,Q)).find((Q)=>Es(Rs(Q,".cache-complete")))}}catch{return{unreadable:V}}}function uh(A,V){if(V){let te=["Cursor records enabled plugins on your Cursor account, which doctor cannot check, and keeps a plugin's files after it is uninstalled.","Cursor pins marketplace plugins to the commit they were added at, so `cc-safety-net update` cannot update this plugin, while the npx hook (`cc-safety-net install --cursor`) stays current."].join(" ");return{method:Ts,configPath:V,duplicate:`The Cursor plugin also runs this check, so every tool call is checked twice. ${te} If the plugin is installed, run \`cc-safety-net uninstall --cursor\`, uninstall CC Safety Net from /plugins in cursor-agent, then run \`cc-safety-net install --cursor\`.`,alone:`${te} If /plugins in cursor-agent does not list CC Safety Net as installed, run \`cc-safety-net install --cursor\`.`}}let Q=gl(A);if(!Q)return;let ne="Cursor runs the Claude Code plugin only while it imports Claude Code plugins, which doctor cannot check.";return{method:lo,configPath:Q,duplicate:`The Claude Code plugin also runs this check in Cursor, so every tool call is checked twice. ${ne} If Cursor runs it, run \`cc-safety-net uninstall --cursor\` to remove this hook.`,alone:`${ne} If it stops, run \`cc-safety-net install --cursor\`.`}}function Vl(A){let V=ph(A),Q=dh(A.environment);if(Q.unreadable)return V.status==="configured"?{...V,errors:[...V.errors??[],`Cannot read ${Q.unreadable}, so doctor cannot tell whether the Cursor plugin also runs this check.`]}:{platform:"cursor",status:"not-inspected"};let ne=uh(A.environment,Q.version);if(!ne)return V;if(V.status==="configured")return{...V,errors:[...V.errors??[],ne.duplicate]};return{platform:"cursor",status:"configured",method:ne.method,configPath:ne.configPath,errors:[...V.errors??[],ne.alone]}}function ph(A){let V=ao(A.environment);if(!Es(V))return{platform:"cursor",status:"n/a",configPath:V};let Q;try{Q=JSON.parse(ah(V,"utf-8"))}catch(re){return{platform:"cursor",status:"n/a",configPath:V,errors:[`Failed to parse Cursor hooks config ${V}: ${re instanceof Error?re.message:String(re)}`]}}let ne=lh(Q);if(ne.length===0)return{platform:"cursor",status:"n/a",configPath:V};let te=ch(ne);return{platform:"cursor",status:"configured",method:"hook config",configPath:V,errors:te.length>0?te:void 0}}import{existsSync as vh}from"node:fs";import{existsSync as Jl,mkdirSync as fh,readFileSync as mh}from"node:fs";import{dirname as gh,join as Is}from"node:path";function _s(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function As(A,V){return _s(A)&&A.command===V}function Kl(A,V){return _s(A)&&Array.isArray(A.hooks)&&A.hooks.some((Q)=>As(Q,V))}function Xn(A,V){return{hooks:[{type:"command",command:A,timeout:V}]}}function Dn(A,V){return A.flatMap((Q)=>{if(!_s(Q)||!Array.isArray(Q.hooks))return[Q];let ne=Q.hooks.filter((te)=>!As(te,V));if(ne.length===Q.hooks.length)return[Q];return ne.length===0?[]:[{...Q,hooks:ne}]})}function Wt(A,V,Q){let ne=A.filter((te)=>Kl(te,V));return ne.length===1&&JSON.stringify(ne[0])===JSON.stringify(Xn(V,Q))}function Yt(A,V){return A.find((Q)=>Kl(Q,V))}function Zt(A,V,Q){let ne=Array.isArray(A.hooks)?A.hooks.find((te)=>As(te,V)):void 0;return[...A.matcher===void 0||A.matcher===""||A.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...ne?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...ne?.timeout===Q?[]:[`Managed hook "timeout" is not ${Q}; reinstall to repair`]]}var Qn=bn.devin,co=30,hh={config:{},hooks:{},preToolUse:[]};function uo(A,V=process.platform){let Q=V==="win32"?A.env.get("APPDATA")||Is(A.home,"AppData","Roaming"):A.env.get("XDG_CONFIG_HOME")||Is(A.home,".config");return Is(Q,"devin","config.json")}function zl(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function yh(A){try{return{ok:!0,value:JSON.parse(gn(mh(A,"utf-8")))}}catch(V){return{ok:!1,message:V instanceof Error?V.message:String(V)}}}function Os(A){let V=yh(A);if(!V.ok)return`Failed to parse Devin CLI config ${A}: ${V.message}`;let Q=V.value;if(!zl(Q))return`Devin CLI config ${A} must be a JSON object`;let ne=Q.hooks===void 0?{}:Q.hooks;if(!zl(ne))return`Devin CLI config ${A} "hooks" must be an object`;let te=ne.PreToolUse===void 0?[]:ne.PreToolUse;if(!Array.isArray(te))return`Devin CLI config ${A} "hooks.PreToolUse" must be an array`;return{config:Q,hooks:ne,preToolUse:te}}function Wl(A){let V=Os(A);if(typeof V==="string")throw Error(V);return V}function Yl(A,V,Q){let ne={...V.config,hooks:{...V.hooks,PreToolUse:Q}};an(A,`${JSON.stringify(ne,null,2)}
`)}function Zl(A){let V=uo(A),Q=Jl(V)?Wl(V):hh;if(Wt(Q.preToolUse,Qn,co))return{path:V,alreadyInstalled:!0};return fh(gh(V),{recursive:!0}),Yl(V,Q,[...Dn(Q.preToolUse,Qn),Xn(Qn,co)]),{path:V,alreadyInstalled:!1}}function Xl(A){let V=uo(A);if(!Jl(V))return{path:V,alreadyInstalled:!1};let Q=Wl(V),ne=Dn(Q.preToolUse,Qn);if(JSON.stringify(ne)===JSON.stringify(Q.preToolUse))return{path:V,alreadyInstalled:!1};return Yl(V,Q,ne),{path:V,alreadyInstalled:!0}}function Ql(A){let V=uo(A.environment);if(!vh(V))return{platform:"devin",status:"n/a",configPath:V};let Q=Os(V);if(typeof Q==="string")return{platform:"devin",status:"n/a",configPath:V,errors:[Q]};let ne=Yt(Q.preToolUse,Qn);if(!ne)return{platform:"devin",status:"n/a",configPath:V};let te=Zt(ne,Qn,co);return{platform:"devin",status:"configured",method:"hook config",configPath:V,errors:te.length>0?te:void 0}}import{existsSync as Ph,readFileSync as Rh}from"node:fs";import{existsSync as Xt,mkdirSync as bh,readFileSync as wh,rmSync as kh}from"node:fs";import{dirname as Ch,join as Ds}from"node:path";var tt=bn.droid,po=30;function fo(A){return Ds(A.home,".factory","hooks.json")}function ec(A){return Ds(A.home,".factory","settings.json")}function nc(A){return Ds(A.home,".factory","hooks","hooks.json")}function $s(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function tc(A){try{return JSON.parse(gn(wh(A,"utf-8")))}catch(V){if(V instanceof SyntaxError)throw Error(`Failed to parse Factory Droid hooks config ${A}: ${V.message}`);throw V}}function Ns(A){let V=tc(A);if(!$s(V))throw Error(`Factory Droid hooks config ${A} must be a JSON object`);if(V.PreToolUse===void 0||Array.isArray(V.PreToolUse))return V;throw Error(`Factory Droid hooks config ${A} "PreToolUse" must be an array`)}function xh(A){if(!Xt(A))return{};let V=tc(A);return $s(V)&&$s(V.hooks)&&V.hooks.PreToolUse!==void 0?{PreToolUse:V.hooks.PreToolUse}:{}}function Sh(A){let V=nc(A);return{...xh(ec(A)),...Xt(V)?Ns(V):{}}}function rc(A){return Array.isArray(A.PreToolUse)?A.PreToolUse:[]}function oc(A,V,Q){an(A,`${JSON.stringify({...V,PreToolUse:Q},null,2)}
`)}function sc(A){let V=fo(A),Q=Xt(V),ne=Q?Ns(V):Sh(A),te=rc(ne);if(Q&&Wt(te,tt,po))return{path:V,alreadyInstalled:!0};return bh(Ch(V),{recursive:!0}),oc(V,ne,[...Dn(te,tt),Xn(tt,po)]),{path:V,alreadyInstalled:!1}}function ic(A){let V=fo(A);if(!Xt(V))return{path:V,alreadyInstalled:!1};let Q=Ns(V),ne=rc(Q),te=Dn(ne,tt);if(JSON.stringify(te)===JSON.stringify(ne))return{path:V,alreadyInstalled:!1};let re=Xt(ec(A))||Xt(nc(A));if(te.length===0&&Object.keys(Q).length===1&&!re)return kh(V),{path:V,alreadyInstalled:!0};return oc(V,Q,te),{path:V,alreadyInstalled:!0}}function ac(A){let V=fo(A.environment);if(!Ph(V))return{platform:"droid",status:"n/a",configPath:V};let Q;try{Q=JSON.parse(gn(Rh(V,"utf-8")))}catch(le){return{platform:"droid",status:"n/a",configPath:V,errors:[`Failed to parse Factory Droid hooks config ${V}: ${le instanceof Error?le.message:String(le)}`]}}let ne=typeof Q==="object"&&Q!==null&&"PreToolUse"in Q?Q.PreToolUse:void 0,te=Yt(Array.isArray(ne)?ne:[],tt);if(!te)return{platform:"droid",status:"n/a",configPath:V};let re=[...te.commandRegex===void 0||te.commandRegex===""?[]:['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair'],...Zt(te,tt,po)];return{platform:"droid",status:"configured",method:"hook config",configPath:V,errors:re.length>0?re:void 0}}import{existsSync as Eh}from"node:fs";import{join as Ls}from"node:path";var js="gemini-safety-net";function Hs(A){let V=Ls(A.home,".gemini","extensions"),Q=Ls(V,js);if(!Eh(Q))return{platform:"gemini-cli",status:"n/a"};let ne=Ls(V,"extension-enablement.json"),te=v(ne);if(te.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let re=te.kind==="ok"?n(n(te.value,js),"overrides"):void 0;if(Array.isArray(re)&&re.some((ye)=>typeof ye==="string"&&ye.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:ne,errors:[`${js} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:Q}}function lc(A){return Hs(A.environment)}import{existsSync as Ih,readFileSync as yc,statSync as Oh}from"node:fs";import{dirname as hc,join as $h}from"node:path";import{existsSync as dc,mkdirSync as Th,readFileSync as uc,rmSync as _h}from"node:fs";import{dirname as Ah,join as cc}from"node:path";var Un=bn["grok-build"],go=30,Fs=Xn(Un,go);function ho(A){return cc(A.env.get("GROK_HOME")??cc(A.home,".grok"),"hooks","cc-safety-net.json")}function yo(A){return typeof A==="object"&&A!==null&&!Array.isArray(A)}function pc(A){try{let V=JSON.parse(A);return yo(V)?V:null}catch{return null}}function fc(A){let V=yo(A.hooks)?A.hooks.PreToolUse:void 0;return Array.isArray(V)?V:[]}function mo(A,V,Q){let ne=yo(V.hooks)?V.hooks:{};an(A,`${JSON.stringify({...V,hooks:{...ne,PreToolUse:Q}},null,2)}
`)}function mc(A){let V=ho(A);if(!dc(V))return Th(Ah(V),{recursive:!0}),mo(V,{},[Fs]),{path:V,alreadyInstalled:!1};let Q=pc(uc(V,"utf-8"));if(!Q)return mo(V,{},[Fs]),{path:V,alreadyInstalled:!1};let ne=fc(Q);if(Wt(ne,Un,go))return{path:V,alreadyInstalled:!0};return mo(V,Q,[...Dn(ne,Un),Fs]),{path:V,alreadyInstalled:!1}}function gc(A){let V=ho(A);if(!dc(V))return{path:V,alreadyInstalled:!1};let Q=pc(uc(V,"utf-8"));if(!Q)return{path:V,alreadyInstalled:!1};let ne=fc(Q),te=Dn(ne,Un);if(JSON.stringify(te)===JSON.stringify(ne))return{path:V,alreadyInstalled:!1};let re=yo(Q.hooks)?Q.hooks:{};if(te.length===0&&Object.keys(Q).length===1&&Object.keys(re).length===1)return _h(V),{path:V,alreadyInstalled:!0};return mo(V,Q,te),{path:V,alreadyInstalled:!0}}function Ms(A){return!!A&&typeof A==="object"&&!Array.isArray(A)}function Dh(A){try{return Oh(A,{throwIfNoEntry:!1})?.isFile()===!0?yc(A,"utf-8"):""}catch{return}}function vc(A){let V=ho(A.environment);if(!Ih(V))return{platform:"grok-build",status:"n/a",configPath:V};let Q;try{Q=JSON.parse(yc(V,"utf-8"))}catch($e){return{platform:"grok-build",status:"n/a",configPath:V,errors:[`Failed to parse Grok Build hooks config ${V}: ${$e instanceof Error?$e.message:String($e)}`]}}let ne=Ms(Q)&&Ms(Q.hooks)&&Array.isArray(Q.hooks.PreToolUse)?Q.hooks.PreToolUse:[],te=Yt(ne,Un);if(!te)return{platform:"grok-build",status:"n/a",configPath:V};let re=Array.isArray(te.hooks)?te.hooks.findIndex(($e)=>Ms($e)&&$e.command===Un):-1,le=`global/cc-safety-net:pre_tool_use[${ne.indexOf(te)}].hooks[${re}]`,ye=$h(hc(hc(V)),"disabled-hooks"),be=Dh(ye),_e=be?.split(`
`).some(($e)=>$e.trim()===le)===!0,Ae=[...be===void 0?[`Cannot read ${ye}, so doctor cannot tell whether Grok Build skips the hook`]:[],..._e?[`Grok Build skips the hook: ${le} is listed in ${ye}; enable it in /hooks`]:[],...Zt(te,Un,go)];return{platform:"grok-build",status:_e?"disabled":"configured",method:"hook config",configPath:V,errors:Ae.length>0?Ae:void 0}}import{readFileSync as Ec}from"node:fs";import{join as Tc}from"node:path";var Cn="cc-safety-net",Us="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",Nh=30;function bc(A){return`${Us}
# version: ${A}
`}function Lh(A){return`${bc(A)}name: ${Cn}
version: "${A}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function jh(A){return`${bc(A)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${bn["hermes-agent"].split(" ").map((V)=>`"${V}"`).join(", ")}]
TIMEOUT_SECONDS = ${Nh}


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
`}function vr(A){return[{name:"__init__.py",content:jh(A)},{name:"plugin.yaml",content:Lh(A)}]}import{mkdirSync as Hh,readdirSync as Fh,readFileSync as wc,rmSync as Bs}from"node:fs";import{basename as Mh,dirname as Uh,join as Nn}from"node:path";var Bh="__pycache__",Gh=/^[a-z0-9][a-z0-9_-]{0,63}$/;function qh(A){try{return wc(A,"utf-8").trim()}catch{return}}function Gs(A){let V=A.env.get("HERMES_HOME")?.trim();if(V&&Mh(Uh(V))==="profiles")return V;let Q=V||Nn(A.home,".hermes"),ne=Nn(Q,"active_profile"),te=qh(ne),re=te?.toLowerCase();if(!re||re==="default")return Q;if(!Gh.test(re))throw Error(`Invalid Hermes profile name "${te}" in ${ne}; run \`hermes profile use <name>\` with a valid profile.`);return Nn(Q,"profiles",re)}function qs(A){return Nn(Gs(A),"plugins",Cn)}function Vs(A){return A.startsWith(Us)}function Ks(A,V){let Q=qs(A),ne=u(Q);if(ne&&(ne.isSymbolicLink()||!ne.isDirectory()))throw Error(`Refusing to ${V} ${Q}: not a regular directory. Move or remove it and rerun ${V==="install"?"install":"uninstall"} --hermes-agent.`);return Q}function kc(A,V){let Q=u(A);if(!Q)return;if(Q.isSymbolicLink()||!Q.isFile())throw Error(`Refusing to ${V} ${A}: not a regular file. Move or remove it.`);let ne=wc(A,"utf-8");if(!Vs(ne))throw Error(`Refusing to ${V} unmanaged file at ${A}. Move or remove it.`);return ne}function Cc(A){let V=Ks(A,"install"),Q=vr(un());if(Q.map((te)=>kc(Nn(V,te.name),"overwrite")).every((te,re)=>te===Q[re]?.content))return{path:V,alreadyInstalled:!0};return Hh(V,{recursive:!0}),Q.forEach((te)=>{an(Nn(V,te.name),te.content)}),{path:V,alreadyInstalled:!1}}function zs(A){let V=Ks(A,"remove");if(!u(V))return[];return vr(un()).filter((Q)=>kc(Nn(V,Q.name),"remove")!==void 0)}function xc(A){let V=Ks(A,"remove");if(!u(V))return{path:V,alreadyInstalled:!1};let Q=zs(A);if(Q.forEach((ne)=>{Bs(Nn(V,ne.name))}),Bs(Nn(V,Bh),{recursive:!0,force:!0}),Fh(V).length===0)Bs(V,{recursive:!0});return{path:V,alreadyInstalled:Q.length>0}}var br="hermes-agent",Sc=/^([^\s#][^:]*):/,Vh=/^\s+([A-Za-z_][\w-]*):/,Pc=/^\s+-\s*(.*)$/;function Kh(A){return A.trim().replace(/^(["'])(.*)\1$/,"$2")}function zh(A){let V=A.split(/\r?\n/),Q=V.findIndex((re)=>Sc.exec(re)?.[1]?.trim()==="plugins");if(Q===-1)return[];let ne=V.slice(Q+1),te=ne.findIndex((re)=>Sc.test(re));return te===-1?ne:ne.slice(0,te)}function Rc(A,V){let Q=zh(A),ne=Q.findIndex((le)=>Vh.exec(le)?.[1]===V);if(ne===-1)return[];let te=Q.slice(ne+1),re=te.findIndex((le)=>!Pc.test(le));return(re===-1?te:te.slice(0,re)).map((le)=>Kh(Pc.exec(le)?.[1]??""))}function Jh(A){try{return Ec(Tc(Gs(A),"config.yaml"),"utf-8")}catch{return}}function Js(A){let V=Jh(A)??"";return Rc(V,"enabled").includes(Cn)&&!Rc(V,"disabled").includes(Cn)}function _c(A){return/^# version:\s*(.+)$/m.exec(A)?.[1]?.trim()}function Wh(A,V){let Q=u(A);if(!Q)return{error:`${V.name} is missing from ${A}; run install --hermes-agent`};if(Q.isSymbolicLink()||!Q.isFile())return{error:`${A} is a symlink or not a regular file; move or remove it`};try{let ne=Ec(A,"utf-8");if(!Vs(ne))return{error:`Unmanaged ${V.name} occupies ${A}; move or remove it`};if(_c(ne)===un()&&ne!==V.content)return{error:`Modified ${V.name} occupies ${A}; run install --hermes-agent to restore it`};return{content:ne}}catch(ne){return{error:`Failed to read ${A}: ${ne instanceof Error?ne.message:String(ne)}`}}}function Yh(A){try{return{path:qs(A)}}catch(V){return{error:V instanceof Error?V.message:String(V)}}}function Ac(A){let V=Yh(A.environment);if("error"in V)return{platform:br,status:"n/a",errors:[V.error]};let Q=V.path,ne=We(br,Q);if(ne)return ne;let te=vr(un()).map((be)=>Wh(Tc(Q,be.name),be)),re=te.flatMap((be)=>("error"in be)?[be.error]:[]);if(re.length>0)return{platform:br,status:"n/a",configPath:Q,errors:re};let le=te.some((be)=>("content"in be)&&_c(be.content)!==un()),ye=le?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!Js(A.environment))return{platform:br,status:"disabled",method:"plugin directory",configPath:Q,errors:[`${Cn} is not enabled in Hermes; run \`hermes plugins enable ${Cn}\``,...ye]};return{platform:br,status:"configured",method:"plugin directory",configPath:Q,errors:le?ye:void 0}}import{existsSync as Zh,readFileSync as Xh}from"node:fs";import{join as Zs}from"node:path";var Qh=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/,Ws="cc-safety-net",bo="plugin config",ey=new Set(["event","matcher","command","timeout"]),ny=new Set(["PreToolUse","PostToolUse","PostToolUseFailure","PermissionRequest","PermissionResult","UserPromptSubmit","UserPromptQueued","TurnStarted","Stop","StopFailure","Interrupt","SessionStart","SessionEnd","SessionHeartbeat","SubagentStart","SubagentStop","TaskStarted","PreCompact","PostCompact","Notification"]);function Ic(A){return A.env.get("KIMI_CODE_HOME")||Zs(A.home,".kimi-code")}function vo(A,V){let Q=[""],ne="",te=0;for(let re=0;re<A.length;re++){let le=A[re];if(ne!==""){let ye=ne==='"'&&le==="\\"?A[++re]??"":"";if(Q[Q.length-1]+=le+ye,ye===""&&le===ne)ne="";continue}if(le==="#"){let ye=A.indexOf(`
`,re);re=(ye===-1?A.length:ye)-1;continue}if(le===V&&te===0){Q.push("");continue}if(le==='"'||le==="'")ne=le;if(le==="["||le==="{")te++;if(le==="]"||le==="}")te--;Q[Q.length-1]+=le}return Q.map((re)=>re.trim()).filter((re)=>re!=="")}function Oc(A){let V=/^(?:"([^"]*)"|'([^']*)'|([^\s="']+))\s*=\s*([\s\S]+)$/.exec(A);return V?{key:V[1]??V[2]??V[3]??"",value:V[4]??""}:void 0}function Ys(A){return A===void 0?void 0:/^("""|'''|"|')([\s\S]*)\1$/.exec(A)?.[2]}function ty(A){let V=A.split(/(?=^\s*\[)/m),Q=V.filter((ne)=>!/^\s*\[/.test(ne)).flatMap((ne)=>vo(ne,`
`)).map(Oc).find((ne)=>ne?.key==="hooks")?.value;if(Q!==void 0)return vo(Q.slice(1,-1),",").map((ne)=>vo(ne.slice(1,-1),","));return V.filter((ne)=>/^\s*\[\[hooks]]/.test(ne)).map((ne)=>vo(ne.replace(/^\s*\[\[hooks]]/,""),`
`))}function ry(A){let V=A.map(Oc),Q=A.find((Ae,$e)=>V[$e]===void 0),ne=V.find((Ae)=>Ae!==void 0&&!ey.has(Ae.key))?.key,te=V.find((Ae,$e)=>Ae!==void 0&&V.findIndex((Le)=>Le?.key===Ae.key)<$e)?.key,re=(Ae)=>V.find(($e)=>$e?.key===Ae)?.value,le=re("matcher"),ye=re("timeout"),be=Number(ye?.replace(/(?<=[\da-f])_(?=[\da-f])/gi,""));return[[Q!==void 0,`"${Q}" is not a key = value pair`],[ne!==void 0,`unknown key "${ne}"`],[te!==void 0,`duplicate key "${te}"`],[!ny.has(Ys(re("event"))??""),'"event" is not a Kimi Code hook event'],[le!==void 0&&Ys(le)===void 0,'"matcher" is not a string'],[!Ys(re("command")),'"command" is missing or empty'],[ye!==void 0&&!(Number.isInteger(be)&&be>=1&&be<=600),'"timeout" is not an integer from 1 to 600']].find(([Ae])=>Ae)?.[1]}function oy(A){let V=Zs(Ic(A),"plugins","installed.json"),Q=v(V);if(Q.kind==="missing")return;let ne=Q.kind==="ok"?n(Q.value,"plugins"):void 0;if(!Array.isArray(ne))return{platform:"kimi-code",status:"n/a",configPath:V,errors:[`Cannot read ${V}, so doctor cannot tell whether the Kimi Code plugin is installed`]};let te=ne.find((re)=>n(re,"id")===Ws);if(te===void 0)return;if(n(te,"enabled")!==!0)return{platform:"kimi-code",status:"disabled",method:bo,configPath:V,errors:[`${Ws} is installed but not enabled in Kimi Code; run /plugins enable ${Ws}`]};return{platform:"kimi-code",status:"configured",method:bo,configPath:V}}function wo(A){let V=Zs(Ic(A.environment),"config.toml"),Q=()=>oy(A.environment)??{platform:"kimi-code",status:"n/a",configPath:V};if(!Zh(V))return Q();let ne;try{ne=Xh(V,"utf-8")}catch(le){return{platform:"kimi-code",status:"n/a",configPath:V,errors:[`Failed to read ${V}: ${le instanceof Error?le.message:String(le)}`]}}if(!Qh.test(ne))return Q();let re=(/"""|'''/.test(ne)?[]:ty(ne)).flatMap((le,ye)=>{let be=ry(le);return be===void 0?[]:[`Kimi Code ignores every hook because hooks entry ${ye+1} is invalid (${be}); fix it in ${V}`]});return{platform:"kimi-code",status:re.length>0?"disabled":"configured",method:"hook config",configPath:V,errors:re.length>0?re:void 0}}import{readFileSync as Uc}from"node:fs";import{join as kr}from"node:path";var dn="cc-safety-net",kn="index.js",Qt="openclaw.plugin.json",er="package.json";var ko="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as sy,lstatSync as iy,readdirSync as ay,readFileSync as ly}from"node:fs";import{dirname as $c,join as Bn}from"node:path";import{fileURLToPath as cy}from"node:url";var Xs=Bn("openclaw",dn),lt=`run \`openclaw plugins enable ${dn}\``,dy="config reload superseded by a newer runtime config source",uy=[kn,Qt,er];function Dc(A){let V=A.env.get("OPENCLAW_HOME")?.trim();return V?B(V,A.home):A.home}function Nc(A){let V=Dc(A),Q=A.env.get("OPENCLAW_STATE_DIR")?.trim();if(Q)return B(Q,V);let ne=A.env.get("OPENCLAW_CONFIG_PATH")?.trim();return ne?$c(B(ne,V)):Bn(V,".openclaw")}function Lc(A){let V=A.env.get("OPENCLAW_CONFIG_PATH")?.trim();return V?B(V,Dc(A)):Bn(Nc(A),"openclaw.json")}function wr(A){return Bn(Nc(A),"extensions",dn)}function py(A){let V=ay(A);if(V.length===0)return!0;if(V.some((te)=>!uy.includes(te)))return!1;let Q=Bn(A,kn),ne=u(Q);return ne!==void 0&&!ne.isSymbolicLink()&&ne.isFile()&&ly(Q,"utf-8").startsWith(ko)}function Qs(A){let V=wr(A),Q=u(V);if(!Q)return;if(!Q.isSymbolicLink()&&Q.isDirectory()&&py(V))return;throw Error(`Refusing to modify ${V}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function jc(){let A=$c(cy(import.meta.url));return[Bn(A,Xs),Bn(A,"..",Xs),Bn(A,"..","..","..","dist",Xs)]}function ei(A=jc()){return A.find((V)=>sy(V)&&iy(V).isDirectory())}function fy(A=jc()){let V=ei(A);if(!V)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return V}function Hc(A=fy()){return[["openclaw","plugins","install",A,"--force","--accept-capabilities"]]}function my(A){let V=(()=>{try{return JSON.parse(A)}catch{return}})(),Q=n(n(V,"plugin"),"status");return typeof Q==="string"?Q:void 0}async function gy(){await pn(["openclaw","plugins","enable",dn]).catch((A)=>{if(!(A instanceof Error&&A.message.includes(dy)))throw A})}async function Fc(A){let V=async()=>my(await pn(["openclaw","plugins","inspect",dn,"--runtime","--json"],{stdoutOnly:!0})),Q=await V(),ne=Q==="disabled"&&A;if(ne)await gy();let te=ne?await V():Q;if(te==="loaded")return;throw Error(`${te===void 0?`The ${dn} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:te==="disabled"?`OpenClaw reports the ${dn} plugin with status "disabled"; ${lt}.`:`OpenClaw reports the ${dn} plugin with status "${te}".`} Run \`openclaw plugins inspect ${dn} --runtime\` for details.`)}var Co="openclaw";function nr(A,V){let Q=kr(A,V),ne=u(Q);if(!ne)return{error:`${V} is missing from ${Q}; run install --openclaw`};if(ne.isSymbolicLink()||!ne.isFile())return{error:`${Q} is a symlink or not a regular file; move or remove it`};try{return{content:Uc(Q,"utf-8")}}catch(te){return{error:`Failed to read ${Q}: ${te instanceof Error?te.message:String(te)}`}}}function Bc(A){try{return JSON.parse(gn(A))}catch{return}}function hy(A){let V=nr(A,Qt);if("error"in V)return V.error;if(n(Bc(V.content),"id")===dn)return;return`${kr(A,Qt)} is not a valid ${dn} manifest; run install --openclaw`}function yy(A){let V=nr(A,er);if("error"in V)return V.error;let Q=n(n(Bc(V.content),"openclaw"),"extensions");if(Array.isArray(Q)&&Q.includes(`./${kn}`))return;return`${kr(A,er)} does not point OpenClaw at ${kn}; run install --openclaw`}function Mc(A){return Array.isArray(A)?A.filter((V)=>typeof V==="string"):[]}function vy(A){let V=Lc(A);if(!u(V))return`${dn} is not enabled; ${lt}`;let Q=(()=>{try{return JSON.parse(gn(Uc(V,"utf-8")))}catch{return}})();if(Q===void 0)return`Failed to read ${V}; fix it, then ${lt}`;let ne=n(Q,"plugins");if(n(ne,"enabled")===!1)return`plugins.enabled is false in ${V}; no OpenClaw plugin loads`;let te=n(n(n(ne,"entries"),dn),"enabled");if(Mc(n(ne,"deny")).includes(dn)||te===!1)return`${dn} is disabled in ${V}; ${lt}`;let re=Mc(n(ne,"allow"));if(re.length>0&&!re.includes(dn))return`plugins.allow in ${V} does not list ${dn}; add it, then ${lt}`;if(re.includes(dn)||te===!0)return;return`${dn} is not enabled; ${lt}`}function Gc(A){return/^\/\/ version:\s*(.+)$/m.exec(A)?.[1]?.trim()}function by(A,V,Q){if(Q===void 0)return[];let ne=nr(Q,kn);if(!(("content"in ne)&&Gc(ne.content)===V))return[];return[kn,Qt,er].flatMap((re)=>{let le=nr(A,re),ye=nr(Q,re);if("error"in le||"error"in ye||le.content===ye.content)return[];return[`Modified ${re} occupies ${kr(A,re)}; run install --openclaw to restore it`]})}function qc(A){let V=wr(A.environment),Q=We(Co,V);if(Q)return Q;let ne=nr(V,kn),re=["error"in ne?ne.error:ne.content.startsWith(ko)?void 0:`Unmanaged ${kn} occupies ${kr(V,kn)}; move or remove it`,hy(V),yy(V)].filter((Ae)=>Ae!==void 0),le="content"in ne?Gc(ne.content):void 0,ye=re.length>0?re:by(V,le,ei());if(ye.length>0)return{platform:Co,status:"n/a",configPath:V,errors:ye};let be=le===un()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],_e=vy(A.environment);if(_e)return{platform:Co,status:"disabled",method:"plugin directory",configPath:V,errors:[_e,...be]};return{platform:Co,status:"configured",method:"plugin directory",configPath:V,errors:be.length>0?be:void 0}}import{existsSync as Ty,readFileSync as _y}from"node:fs";import{basename as Ay}from"node:path";import{existsSync as xo,readFileSync as ti,rmSync as wy}from"node:fs";import{join as Tn}from"node:path";import{pathToFileURL as ky}from"node:url";var Cr="cc-safety-net",ut=`${Cr}@latest`,ri=["opencode.json","opencode.jsonc"],Cy=60,xy=250,Vc="CCSafetyNetPlugin",Sy={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function Kc(A){return Tn(A.env.get("XDG_CONFIG_HOME")||Tn(A.home,".config"),"opencode")}function oi(A){return A.env.get("OPENCODE_CONFIG_DIR")||Kc(A)}function si(A){return ri.map((V)=>Tn(oi(A),V))}function ii(A){return[...new Set([oi(A),Kc(A)])].flatMap((V)=>ri.map((Q)=>Tn(V,Q)))}function zc(A){return Tn(A.env.get("XDG_CACHE_HOME")||Tn(A.home,".cache"),"opencode","packages",ut)}function Jc(A){wy(zc(A),{recursive:!0,force:!0})}async function Wc(A){let V=(await pn(["opencode","--version"],{stdoutOnly:!0})).trim(),Q=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(V),ne=Number(Q?.[1]),te=Number(Q?.[2]),re=Number(Q?.[3]);if(!Q||ne!==1&&ne!==2||ne===1&&(te<18||te===18&&re<29)||ne===2&&te===0&&re<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${V||"an unknown version"}.`);if(ne===2){for(let le of si(A)){if(!xo(le))continue;let ye=li(ti(le,"utf-8"),le);if(["plugin","plugins"].some((_e)=>{let Ae=n(ye,_e);return Array.isArray(Ae)&&Ae.some(($e)=>So($e)&&(typeof $e==="string"?$e:n($e,"package"))!==ut)}))throw Error(`Change the cc-safety-net package spec in ${le} to ${ut}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[],afterInstall:async()=>{if((await pn(["opencode","plugin","add",ut],{stdoutOnly:!0})).includes("is already configured in"))await ni(),await pn(["opencode","plugin","update",ut]);let ye=await ni();if(!/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(ye))throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.");let be=["--param",`location[directory]=${process.cwd()}`];await pn(["opencode","api","integration.list",...be]);let _e=await pn(["opencode","api","plugin.list",...be],{stdoutOnly:!0}),Ae=ai(_e);if(Ae)throw Error(Ae);if(!Yc(_e).some(Zc))throw Error("OpenCode lists no active cc-safety-net for this directory. Run `opencode api plugin.list` for details.")}}}return Jc(A),{commands:[["opencode","plugin","-g","-f",ut]],afterInstall:()=>Ry(A)}}function Yc(A){return Py(A).filter((V)=>n(V,"id")===Cr||So(n(n(V,"source"),"target"))).map((V)=>n(V,"state"))}function Zc(A){return n(A,"status")==="active"}function ai(A){let V=Yc(A);if(V.some(Zc))return;let Q=V.find((ne)=>n(ne,"status")==="failed");if(!Q)return;return`OpenCode reports cc-safety-net failed: ${String(n(Q,"error")).split(`
`)[0]}`}function Py(A){if(!A)return[];try{let V=n(JSON.parse(A),"data");return Array.isArray(V)?V:[]}catch{return[]}}async function ni(A=1){let V=await pn(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s|\scc-safety-net@latest\s*$/m.test(V)||A===Cy)return V;return await new Promise((Q)=>setTimeout(Q,xy)),ni(A+1)}async function Ry(A){let V=Tn(zc(A),"node_modules",Cr),Q=Tn(V,"package.json");if(!xo(Q))throw Error(`The OpenCode plugin cache at ${V} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${ut}\` for details.`);let ne=n(JSON.parse(ti(Q,"utf-8")),"main");if(typeof ne!=="string")throw Error(`The cached OpenCode plugin at ${V} declares no "main" entry.`);let te=Tn(V,ne);if(typeof(await import(ky(te).href))[Vc]==="function")return;throw Error(`The cached OpenCode plugin at ${te} does not export a callable ${Vc}, so OpenCode would load nothing and fail open.`)}function li(A,V){try{return JSON.parse(gn(A))}catch(Q){if(Q instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${V}: ${Q.message}`);throw Q}}function So(A){let V=typeof A==="string"?A:n(A,"package");return typeof V==="string"&&(V===Cr||V.startsWith(`${Cr}@`))}function ci(A){return["plugin","plugins"].some((V)=>{let Q=n(A,V);return Array.isArray(Q)&&Q.some(So)})}function Ey(A,V){let ne=["plugin","plugins"].flatMap((te)=>{let re=xl(A,te,Sy);if(!re)return[];let le=[],ye=0,be=re.start+1,_e=A.slice(re.start+1,re.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let Ae of _e){if(Ae[0].startsWith("//")||Ae[0].startsWith("/*"))continue;let $e=re.start+1+Ae.index;if(ye===0)be=$e;if(Ae[0]==="{"||Ae[0]==="[")ye++;if(Ae[0]==="}"||Ae[0]==="]")ye--;if(ye!==0||Ae[0]===",")continue;let Le=$e+Ae[0].length;if(So(JSON.parse(gn(A.slice(be,Le)))))le.push({start:be,end:Le})}return le}).sort((te,re)=>te.start-re.start).reverse().reduce((te,re)=>{let le=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(te.slice(re.end));if(le?.[0].includes("/")){let ye=re.end+le[0].length-1;return te.slice(0,re.start)+te.slice(re.end,ye)+te.slice(ye+1)}return Cl(te,re)},A);return li(ne,V),ne}function Xc(A){Jc(A);let V=ii(A),Q=V.find((re)=>xo(re)),ne=[],te=[];for(let re of V){if(!xo(re))continue;try{let le=ti(re,"utf-8");if(!ci(li(le,re)))continue;an(re,Ey(le,re)),te.push(re)}catch(le){ne.push(le instanceof Error?le.message:String(le))}}if(ne.length>0)throw Error(ne.join(`
`));return{path:te[0]??Q??Tn(oi(A),ri[0]),alreadyInstalled:te.length>0}}function tr(A){let V=[];for(let Q of A.openCodeVersion?.startsWith("2.")?si(A.environment):ii(A.environment))if(Ty(Q))try{let ne=_y(Q,"utf-8"),te=gn(ne),re=JSON.parse(te);if(ci(re)){let le=ai(A.openCodePluginListOutput);if(le)return{platform:"opencode",status:"disabled",method:"opencode api plugin.list",configPath:Q,errors:[...V,le]};return{platform:"opencode",status:"configured",method:"plugin array",configPath:Q,errors:V.length>0?V:void 0}}}catch(ne){V.push(`Failed to parse ${Ay(Q)}: ${ne instanceof Error?ne.message:String(ne)}`)}return{platform:"opencode",status:"n/a",errors:V.length>0?V:void 0}}import{join as Qc}from"node:path";var nd="dist/pi/index.js",ed=new Set([nd,"index.js"]),Iy=/[*?[\]{}]/;function di(A){let V=A.env.get("PI_CODING_AGENT_DIR");return Qc(V?B(V,A.home):Qc(A.home,".pi","agent"),"settings.json")}function ui(A){if(typeof A!=="string")return!1;return A==="npm:cc-safety-net"||A.startsWith("npm:cc-safety-net@")}function Oy(A){if(!Array.isArray(A)||A.length===0)return!1;if(!A.every((ne)=>typeof ne==="string"))return!1;let V=(ne)=>A.some((te)=>te.startsWith(ne)&&te.slice(1).replace(/^\.[/\\]/,"")===nd);if(V("-"))return!1;if(V("+"))return!0;let Q=A.filter((ne)=>!/^[-+!]/.test(ne));return(Q.length===0||Q.some((ne)=>ed.has(ne)))&&!A.some((ne)=>ne.startsWith("!")&&(ed.has(ne.slice(1))||Iy.test(ne)))}function td(A){let V=di(A.environment),Q=v(V);if(Q.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(Q.kind==="missing")return{platform:"pi",status:"n/a"};let ne=n(Q.value,"packages");if(!Array.isArray(ne))return{platform:"pi",status:"n/a"};let te=ne.find((le)=>ui(typeof le==="string"?le:n(le,"source")));if(te===void 0)return{platform:"pi",status:"n/a"};let re=n(te,"extensions");if(re!==void 0&&!Oy(re))return{platform:"pi",status:"disabled",method:"package config",configPath:V,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:V}}var $y={amp:al,"antigravity-cli":ul,"claude-code":hl,codex:vl,"copilot-cli":Ll,cursor:Vl,"deepseek-harness":It,devin:Ql,droid:ac,"gemini-cli":lc,"grok-build":vc,"hermes-agent":Ac,"kimi-code":wo,openclaw:qc,opencode:tr,pi:td};function rr(A,V,Q){let ne={...Q,cwd:V,environment:A};return Lr.map((te)=>Dy($y[te](ne)))}function Dy(A){if(A.status==="not-inspected")return{platform:A.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:A.platform,detected:A.status!=="n/a",configured:A.status==="configured",inspectionStatus:A.status!=="n/a"?"verified":A.errors&&A.errors.length>0?"failed":"not-applicable",method:A.method,configPath:A.configPath,configPaths:A.configPaths,errors:A.errors}}import{join as Ny}from"node:path";var Ly=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),jy=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),heredocDataWrappers:Object.freeze([]),commandTools:Object.freeze([]),safety:Object.freeze({level:"standard"}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),Hy={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function rd(A){let V=Ny(A.tmpdir,"cc-safety-net-self-test"),Q=Ly.map((ne)=>{let te=z(A,d("self-test",{command:ne.command},{kind:"command",shell:"auto"},{configCwd:V,executionCwd:V},ne.command),{guard:{dependencies:{loadPolicySnapshot:()=>jy,getModes:()=>Hy,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),re=ne.expectBlocked?"blocked":"allowed",le=te.decision.kind==="deny"?"blocked":"allowed";return{command:ne.command,description:ne.description,expected:re,actual:le,passed:re===le,reason:te.decision.kind==="deny"?te.decision.reason:void 0,ruleId:te.decision.kind==="deny"?te.decision.ruleId:void 0}});return{passed:Q.filter((ne)=>ne.passed).length,failed:Q.filter((ne)=>!ne.passed).length,total:Q.length,results:Q}}function pi(A){let V=fn({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},A);if(In(V.errors))return null;return{json:V.flags.json,skipUpdateCheck:V.flags.skipUpdateCheck}}async function od(A,V={}){let Q=await ur(!V.json,()=>{let ne=My(A,V);return{ready:ne,finish:()=>ne}},()=>dr(),{loadingMessage:"Checking system status…"});if(V.json)console.log(JSON.stringify(Q,null,2));else Uy(Q);return Q.engineSelfTest.failed>0||Q.findings.some((ne)=>ne.severity==="error")?1:0}async function My(A,V){let Q=V.cwd??process.cwd(),ne=await qr((Be)=>tr({environment:A,cwd:Q,openCodeVersion:Be}).status!=="n/a",void 0,Q),te=rr(A,Q,{ampPluginListOutput:ne.ampPluginListOutput,codexPluginListOutput:ne.codexPluginListOutput,copilotCliVersion:ne.versions["copilot-cli"],openCodeVersion:ne.versions.opencode,openCodePluginListOutput:ne.openCodePluginListOutput}),re=Sa(A,Q),le=Pa(A),ye=w(A,{cwd:Q}),be=ye.policy,_e=O(be,A.env),Ae=X(be,_e.capabilities),$e=Mr(A,7),Le=tl(A,Q),Fe=[Vt(Q),Kt(A)].filter((Be)=>Fy(Be)),Ne=V.skipUpdateCheck?{currentVersion:un(),latestVersion:null,updateAvailable:!1}:await Mn(),Me={hooks:te,engineSelfTest:rd(A),userConfig:re.userConfig,projectConfig:re.projectConfig,configState:rt(ye),effectiveRules:re.effectiveRules,environment:le,effectiveSafety:{selectedPreset:be.safety.level,level:_e.effectiveLevel,capabilities:_e.capabilities,ruleOverrides:be.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(Ae).filter(([,Be])=>Be.source==="rule_override"&&Be.override==="off"&&Be.inheritedEnabled&&Be.changesInherited).map(([Be])=>Be),ruleCounts:{stored:Object.keys(be.destructiveCommandRuleOverrides).length,effective:Object.values(Ae).filter((Be)=>Be.changesInherited).length},...ye.policyScopes?{policyScopes:ye.policyScopes}:{}},...Le.length>0?{v2Leftovers:Le}:{},...Fe.length>0?{legacyConfigs:Fe}:{},posture:Fa(A,re.userConfig.path),activity:$e,update:Ne,system:ne};return{...Me,findings:Ea(Me)}}function Uy(A){console.log(),console.log(_a(A.hooks)),console.log(),console.log(Aa(A.engineSelfTest)),console.log(),console.log(Ia(A)),console.log(),console.log(Oa(A.environment)),console.log(),console.log($a(A)),console.log(),console.log(Da(A.findings)),console.log(),console.log(Na(A.activity)),console.log(),console.log(ja(A.system)),console.log(),console.log(La(A.update)),console.log(Ha(A))}import{existsSync as By}from"node:fs";var Gy=/^[A-Za-z0-9_@%+=:,./-]+$/,fi="Usage: cc-safety-net explain [--json] [--cwd <path>] [--shell <auto|posix|powershell>] <command>",qy=["auto","posix","powershell"];function mi(A){let V=fn({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"],shell:["--shell"]},positionals:"tail"},A);if(In(V.errors))return console.error(fi),console.error("Pass -- before a command that starts with dashes."),null;if(V.values.cwd!==void 0&&!By(V.values.cwd))return console.error(`Error: --cwd path does not exist: ${V.values.cwd}`),null;let Q=qy.find((te)=>te===V.values.shell);if(V.values.shell!==void 0&&!Q)return console.error(`Error: --shell must be auto, posix, or powershell, got: ${V.values.shell}`),console.error(fi),null;let ne=V.positionals.length===1?V.positionals[0]:V.positionals.map((te)=>Gy.test(te)?te:`'${te.replaceAll("'",Q==="powershell"?"''":"'\\''")}'`).join(" ");if(!ne)return console.error("Error: No command provided"),console.error(fi),null;return{json:V.flags.json,cwd:V.values.cwd,shell:Q,command:ne}}function sd(A){if(A)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function id(A,V){let ne=V-18;return[`${A.dtl}${A.dh.repeat(V)}${A.dtr}`,`${A.dv}  Command Analysis${" ".repeat(ne)}${A.dv}`,`${A.dbl}${A.dh.repeat(V)}${A.dbr}`]}function gi(A){return JSON.stringify(A)}function ad(A,V=0){return`[${A.map((ne,te)=>Ta(ne,te,V)).join(",")}]`}function xr(A,V,Q=70){let ne=A.split(" "),te=[],re="";for(let le of ne)if(re&&re.length+le.length+1>Q)te.push(re),re=le;else re=re?`${re} ${le}`:le;if(re)te.push(re);return te.map((le,ye)=>ye===0?le:`${V}${le}`)}function ld(A,V,Q){let ne=[];switch(A.type){case"parse":return null;case"env-strip":return ne.push(""),ne.push(`STEP ${V} ${Q.h} Strip environment variables`),ne.push(`  Removed: ${A.envVars.map((te)=>`${te}=<redacted>`).join(", ")}`),ne.push(`  Tokens:  ${gi(A.output)}`),{lines:ne,incrementStep:!0};case"leading-tokens-stripped":return ne.push(""),ne.push(`STEP ${V} ${Q.h} Strip wrappers`),ne.push(`  Removed: ${A.removed.join(", ")}`),ne.push(`  Tokens:  ${gi(A.output)}`),{lines:ne,incrementStep:!0};case"shell-wrapper":return ne.push(""),ne.push(`STEP ${V} ${Q.h} Detect shell wrapper`),ne.push(`  Wrapper: ${A.wrapper} -c`),ne.push(`  Inner:   ${A.innerCommand}`),{lines:ne,incrementStep:!0};case"interpreter":{if(ne.push(""),ne.push(`STEP ${V} ${Q.h} Detect interpreter`),ne.push(`  Interpreter: ${A.interpreter}`),ne.push(`  Code:        ${A.codeArg}`),A.paranoidBlocked)ne.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:ne,incrementStep:!0}}case"busybox":return ne.push(""),ne.push(`STEP ${V} ${Q.h} Busybox wrapper`),ne.push(`  Subcommand: ${A.subcommand}`),{lines:ne,incrementStep:!0};case"transparent-wrapper":return ne.push(""),ne.push(`STEP ${V} ${Q.h} Transparent wrapper`),ne.push(`  Wrapper: ${A.wrapper}`),ne.push(`  Tokens:  ${gi(A.output)}`),{lines:ne,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"script-file":return ne.push(""),ne.push(`STEP ${V} ${Q.h} Read script file`),ne.push(`  Path: ${A.path}`),ne.push(`  Size: ${A.bytes} bytes`),{lines:ne,incrementStep:!0};case"rule-check":{if(ne.push(""),ne.push(`STEP ${V} ${Q.h} Match rules`),ne.push(`  Rule:   ${A.rule}()`),A.matched)ne.push("  Result: MATCHED");else ne.push("  Result: No match");return{lines:ne,incrementStep:!0}}case"worktree-relaxation":return ne.push(""),ne.push(`STEP ${V} ${Q.h} Worktree relaxation`),ne.push(`  Mode:   ${r.worktree.name}`),ne.push(`  Git cwd: ${A.gitCwd}`),ne.push("  Result: Allowed local discard in linked worktree"),{lines:ne,incrementStep:!0};case"temp-root-relaxation":return ne.push(""),ne.push(`STEP ${V} ${Q.h} Temp-root relaxation`),ne.push(`  Git cwd: ${A.gitCwd}`),ne.push("  Result: Allowed git discard in a temp-root repository"),{lines:ne,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(A.embeddedCommandFound)return ne.push(""),ne.push(`STEP ${V} ${Q.h} Fallback scan`),ne.push(`  Found: ${A.embeddedCommandFound}`),{lines:ne,incrementStep:!0};return null}case"custom-rules-check":{if(A.rulesChecked){if(ne.push(""),ne.push(`STEP ${V} ${Q.h} Custom rules`),A.matched)ne.push("  Result: MATCHED");else ne.push("  Result: No match");return{lines:ne,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(A.matched)return ne.push(""),ne.push(`STEP ${V} ${Q.h} Dangerous text check`),ne.push(`  Token:  ${A.token}`),ne.push("  Result: MATCHED"),{lines:ne,incrementStep:!0};return null}case"strict-unparseable":return ne.push(""),ne.push(`STEP ${V} ${Q.h} Strict mode check`),ne.push(`  Command: ${A.rawCommand}`),ne.push("  Result:  ✗ UNPARSEABLE"),{lines:ne,incrementStep:!0};case"segment-skipped":return null;case"error":return ne.push(""),ne.push(`ERROR: ${A.message}`),{lines:ne,incrementStep:!1};default:return A}}function hi(A,V){let Q=sd(V?.asciiOnly??!1),ne=58,te=[],re=1;te.push(...id(Q,58)),te.push("");let le=A.trace.steps.find((Ne)=>Ne.type==="error");if(le&&le.type==="error"){te.push("ERROR"),te.push(`  ${le.message}`),te.push(""),te.push("RESULT"),te.push(`  Status: ${A.result==="blocked"?qe.red("BLOCKED"):qe.green("ALLOWED")}`),te.push(""),te.push("CONFIG");let Ne=A.configSource??"none";return te.push(`  Path: ${Ne}`),te.join(`
`)}let ye=A.trace.steps.find((Ne)=>Ne.type==="parse");if(ye&&ye.type==="parse"){te.push("INPUT"),te.push(`  ${ye.input}`),te.push(""),te.push(`STEP ${re} ${Q.h} Split shell commands`),re++;for(let Ne=0;Ne<ye.segments.length;Ne++){let Me=ye.segments[Ne];if(Me){let Be=Math.random();te.push(`  Segment ${Ne+1}: ${ad(Me,Be)}`)}}}let be=A.trace.segments,_e=be.length>1;for(let Ne of be){if(_e){te.push("");let en="";if(ye&&ye.type==="parse"){let Zo=ye.segments[Ne.index];if(Zo)en=Zo.join(" ")}let on=54,ln=en,nn=` Segment ${Ne.index+1}: `,sn=" ";if(en){if(nn.length+en.length+sn.length>on){let Cf=on-nn.length-sn.length;ln=`${en.substring(0,Cf-1)}…`}}let Pn=en?`${nn}${ln}${sn}`:` Segment ${Ne.index+1} `,Bt=en?`${nn}${qe.cyan(ln)}${sn}`:Pn,Xi=58-Pn.length,Qi=Math.floor(Xi/2),kf=Xi-Qi;te.push(`${Q.sh.repeat(Qi)}${Bt}${Q.sh.repeat(kf)}`)}if(Ne.steps.find((en)=>en.type==="segment-skipped")){te.push(""),te.push("  (skipped — prior segment blocked)");continue}let Be=!1,tn=!1;for(let en of Ne.steps){let on=ld(en,re,Q);if(on){if(tn=!0,en.type==="recurse"){te.push("");let ln=" RECURSING ",nn=58-ln.length-4;te.push(`  ${Q.tl}${Q.h}${ln}${Q.h.repeat(nn)}`),te.push(`  ${Q.v}`),Be=!0;continue}for(let ln of on.lines)if(Be)te.push(`  ${Q.v} ${ln}`);else te.push(ln);if(on.incrementStep)re++}}if(Be)te.push(`  ${Q.v}`),te.push(`  ${Q.bl}${Q.h.repeat(56)}`);if(!tn)te.push(""),te.push(`  ${qe.green("✓")} Allowed (no matching rules)`)}if(te.push(""),te.push("RESULT"),A.result==="blocked"){if(te.push(`  Status: ${qe.red("BLOCKED")}`),A.customRule){if(te.push(`  Rule: ${A.customRule.id}`),A.customRule.rulebook)te.push(`  Rulebook: ${A.customRule.rulebook.name} ${A.customRule.rulebook.version}`);if(A.customRule.source)te.push(`  Source: ${A.customRule.source}`);if(A.customRule.override)te.push(`  Override: reason ${A.customRule.override.reason}`)}if(A.reason){let Ne=xr(A.reason,"          ");te.push(`  Reason: ${Ne[0]}`);for(let Me=1;Me<Ne.length;Me++)te.push(Ne[Me]??"")}}else te.push(`  Status: ${qe.green("ALLOWED")}`);te.push(""),te.push("CONFIG");let Ae=A.configSource??"none",$e=A.configValid?"":" (invalid)";te.push(`  Path: ${Ae}${$e}`);let Le=A.safetyPresetScope;te.push(`  Safety preset: ${A.selectedPreset??"standard"}${Le?` (${Ur(Le)})`:""}`),te.push(`  Effective capabilities: ${A.effectiveLevel}`);let Fe=Object.entries(A.destructiveCommandRuleOverrides??{});if(te.push(`  Rule customizations: ${Fe.length}`),A.ruleActivation)te.push(`  Rule activation: ${A.ruleActivation.id} — ${A.ruleActivation.enabled?"on":"off"} via ${A.ruleActivation.source}`);return te.join(`
`)}function yi(A){return JSON.stringify(A,null,2)}import{resolve as Jy}from"node:path";var cd=512,dd={maxTextLength:2048,maxListLength:128,maxObjectProperties:128,maxDepth:16},Vy=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function wi(A){let V=0,Q={allocateSegment(){return V++},getNextSegmentIndex(){return V},branch(){let ne=A.fork(),te=wi(ne);return{trace:te,adopt(){A.replaceSegmentEvents(ne.finish().events),V=te.getNextSegmentIndex()}}},recordGlobal(ne){A.record({scope:"global",step:ne})},recordSegment(ne,te=Q.currentSegmentIndex){if(te===void 0)return;A.record({scope:"segment",segmentIndex:te,step:ne})}};return Q}function ki(A=new Set){let V=[];return{record(Q){if(V.length>=cd)return;Po(Q.step,A,dd),V.push({...Q,step:vi(Q.step,dd,A)})},fork(){return ki(A)},replaceSegmentEvents(Q){V.splice(0,V.length,...[...V.filter((ne)=>ne.scope==="global"),...Q].slice(0,cd))},finish(){return{events:V}}}}function Po(A,V,Q,ne=0,te=new WeakSet){if(typeof A==="string"){let ye=A.slice(0,Q.maxTextLength);if(!gt(ye))return;for(let be of Ot(ye))for(let _e of be.match(/[^\s"'()$]+/g)??[])V.add(ud(_e));return}if(!A||typeof A!=="object"||ne>=Q.maxDepth||te.has(A))return;if(te.add(A),Array.isArray(A)){let ye=Math.min(A.length,Q.maxListLength);for(let be=0;be<ye;be++)Po(A[be],V,Q,ne+1,te);return}let re=0,le=new Set;for(let ye in A){if(!Object.hasOwn(A,ye))continue;if(re>=Q.maxObjectProperties)break;re++,Po(ye,V,Q);let be=bi(ye,Q,V);if(le.has(be))continue;le.add(be),Po(A[ye],V,Q,ne+1,te)}}function vi(A,V,Q,ne=0,te=new WeakSet){if(typeof A==="string")return bi(A,V,Q);if(!A||typeof A!=="object")return A;if(ne>=V.maxDepth)return;if(te.has(A))return;if(te.add(A),Array.isArray(A)){let ye=[],be=Math.min(A.length,V.maxListLength);for(let _e=0;_e<be;_e++)ye.push(vi(A[_e],V,Q,ne+1,te));return ye}let re={},le=0;for(let ye in A){if(!Object.hasOwn(A,ye))continue;if(le>=V.maxObjectProperties)break;le++;let be=bi(ye,V,Q);if(Object.hasOwn(re,be))continue;Object.defineProperty(re,be,{value:vi(A[ye],V,Q,ne+1,te),enumerable:!0,configurable:!0,writable:!0})}return re}function bi(A,V,Q){let ne=A.slice(0,V.maxTextLength),te=gt(ne)?mt(ne):ne,re=Q.size>0?zy(te,Q):te;return(Ky(re)?Ve(re):re).slice(0,V.maxTextLength)}function Ky(A){return A.includes("PRIVATE KEY")||A.includes("://")||A.includes("eyJ")||A.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(A)||A.length>=14&&Vy.some((V)=>A.includes(V))||A.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(A)}function zy(A,V){return A.replace(/[^\s"'()$]+/g,(Q)=>V.has(ud(Q))?"<redacted>":Q)}function ud(A){let V=2166136261,Q=2166136261;for(let ne=0;ne<A.length;ne++)V=Math.imul(V^A.charCodeAt(ne),16777619),Q=Math.imul(Q^A.charCodeAt(A.length-ne-1),16777619);return`${V>>>0}:${Q>>>0}:${A.length}`}function Sr(A,V={},Q){let ne=Jy(V.cwd??process.cwd()),te=V.policySnapshot??w(Q,{cwd:ne,userConfigDir:V.userConfigDir}),re=O(te.policy,Q.env),le=Pe({policySnapshot:te,effectiveCapabilities:re.capabilities,worktreeMode:re.worktreeMode}),ye={effectiveLevel:le.effectiveLevel,selectedPreset:te.policy.safety.level,...te.policyScopes?{safetyPresetScope:te.policyScopes.levelScope}:{},effectiveCapabilities:le.effectiveCapabilities,destructiveCommandRuleOverrides:te.policy.destructiveCommandRuleOverrides},{configSource:be,configValid:_e}=Yy(Q,{cwd:ne,userConfigDir:V.userConfigDir});if(!A||!A.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:be,configValid:_e,...ye};let Ae=V.shell??"auto",$e=C(A,Ae);if($e.status==="limited")throw new E;let Le=Ae==="auto"&&$e.dialect==="powershell"?C(A,"posix"):$e,Fe=Ht(Le),Ne=ki(),Me=wi(Ne);Me.recordGlobal({type:"parse",input:A,segments:Fe.map((Bt)=>[...Bt])});let Be=d("Bash",{command:A},{kind:"command",shell:Ae},{configCwd:ne,executionCwd:ne},A),tn=G(Be,{environment:Q,trace:Me,dependencies:{loadPolicySnapshot:()=>te}}),en=tn.decision.kind==="deny"?tn.decision:null;if(en&&(tn.stage==="policy-protection"||tn.stage==="secret-protection"))return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:Wy(en),matched:!0,reason:en.reason}]}]},result:"blocked",reason:I(en.reason),segment:I(pd(en,A)),ruleId:I(en.ruleId),configSource:be,configValid:_e,...ye};let on=Me.getNextSegmentIndex();if(en&&on>0&&on<Fe.length)Me.recordSegment({type:"segment-skipped",index:on,reason:"prior-segment-blocked"},on);let ln=Ne.finish(),nn=en?.ruleId??Zy(Be,te,re,Q),sn=Z.find((Bt)=>Bt.id===nn&&Bt.activationCapability),Pn=sn?le.policy.effectiveDestructiveCommandRules[sn.id]:void 0;return{trace:Qy(ln),result:en?"blocked":"allowed",reason:en?I(en.reason):void 0,segment:en?I(pd(en,A)):void 0,ruleId:en?I(en.ruleId):void 0,customRule:Xy(ev(en?.ruleId,te)),configSource:be,configValid:_e,...ye,...sn&&Pn?{ruleActivation:{id:sn.id,...Pn}}:{}}}function pd(A,V){return A.evidence?.segment??V}function Wy(A){if(A.reason===it)return"policy-protection:findPolicyConfigMutationTargetInSemanticFacts";if(A.reason===ot)return"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts";if(A.reason===y)return"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts";return"secret-protection:findSensitiveTargetInSemanticFacts"}function Yy(A,V){let Q=D(V.cwd),ne=K(A,V),te=ie(A,{cwd:V.cwd,userConfigDir:V.userConfigDir});try{if(o(te.projectConfigTarget)!==null){if(Fn(te.projectConfigTarget).errors.length===0)return{configSource:Q,configValid:!0};return{configSource:Q,configValid:!1}}}catch(re){if(re instanceof i)return{configSource:Q,configValid:!1};throw re}try{if(o(te.userConfigTarget)!==null){let re=Fn(te.userConfigTarget);return{configSource:ne,configValid:re.errors.length===0}}return{configSource:null,configValid:!0}}catch(re){if(re instanceof i)return{configSource:ne,configValid:!1};throw re}}function Zy(A,V,Q,ne){let te=V.policy,re=Ge({...te,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...te.destructiveCommandRuleOverrides,...Object.fromEntries(Z.flatMap((ye)=>ye.activationCapability?[[ye.id,"on"]]:[]))}},V.state==="degraded"?{diagnostics:V.diagnostics,reason:V.reason}:void 0),le=G(A,{environment:ne,dependencies:{loadPolicySnapshot:()=>re,getModes:()=>({...Q,strict:!0,paranoidRm:!0,paranoidInterpreters:!0,capabilities:{fail_closed:{...Q.capabilities.fail_closed,enabled:!0},paranoid_rm:{...Q.capabilities.paranoid_rm,enabled:!0},paranoid_interpreters:{...Q.capabilities.paranoid_interpreters,enabled:!0}}}),findSensitiveTarget:()=>null}});return le.decision.kind==="deny"?le.decision.ruleId:void 0}function Xy(A){if(!A)return;return{id:I(A.id),...A.rulebook?{rulebook:{name:I(A.rulebook.name),version:I(A.rulebook.version)}}:{},...A.source?{source:I(A.source)}:{},...A.override?{override:{type:"reason",reason:I(A.override.reason)}}:{}}}function Qy(A){let V=A.events.flatMap((ne)=>ne.scope==="global"?[ne.step]:[]),Q=new Map;for(let ne of A.events){if(ne.scope!=="segment")continue;let te=Q.get(ne.segmentIndex)??{index:ne.segmentIndex,steps:[]};te.steps.push(ne.step),Q.set(ne.segmentIndex,te)}return{steps:V,segments:[...Q.values()]}}function ev(A,V){let Q=A?.replace(/^custom\./,"");if(!Q||!V.policy.rules.some((ne)=>ne.name===Q))return;return V.ruleMetadata[Q]??Object.freeze({id:Q})}function fd(A){return new Promise((V)=>{process.stdout.write(`${A}
`,()=>V())})}async function md(A,V){let Q=mi(V);if(!Q)return 1;try{let ne=Sr(Q.command,{cwd:Q.cwd,shell:Q.shell},A),te=!!process.env.NO_COLOR||!process.stdout.isTTY;return await fd(Q.json?yi(ne):hi(ne,{asciiOnly:te})),0}catch(ne){let te=nv(ne instanceof g?ne.cause:ne);if(te===void 0)throw ne;if(Q.json)return await fd(JSON.stringify({error:te})),1;return console.error(te),1}}function nv(A){if(A instanceof E)return A.message;if(A instanceof H)return A.message;if(A instanceof h)return A.message;if(A instanceof a&&l[A.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var gd="2.7.15",Sn="  ",St="cc-safety-net";function hd(A){return A.argument?`${A.flags} ${A.argument}`:A.flags}function tv(A){return Math.max(...A.map((V)=>hd(V).length))}function rv(A){return Math.max(...A.map((V)=>V.usage.length))}function ov(A){return Math.max(...A.map((V)=>`${St} ${V.usage}`.length))}function sv(A,V){let Q=`${St} ${A.usage}`;return`${Sn}${Q.padEnd(V+2)}${A.description}`}function _n(A,V){return`${Sn}${A.padEnd(Math.max(40,A.length+2))}${V}`}function or(A,V=console.log){let Q=[];if(Q.push(`${St} ${A.name}`),Q.push(""),Q.push(`${Sn}${A.description}`),Q.push(""),Q.push("USAGE:"),Q.push(`${Sn}${St} ${A.usage}`),Q.push(""),A.subcommands&&A.subcommands.length>0){Q.push("SUBCOMMANDS:");let ne=rv(A.subcommands);for(let te of A.subcommands)Q.push(`${Sn}${te.usage.padEnd(ne+2)}${te.description}`);Q.push("")}if(A.options.length>0){Q.push("OPTIONS:");let ne=tv(A.options);for(let te of A.options){let re=hd(te),le=te.default?`${te.description} (default: ${te.default})`:te.description;Q.push(`${Sn}${re.padEnd(ne+2)}${le}`)}Q.push("")}if(A.examples&&A.examples.length>0){Q.push("EXAMPLES:");for(let ne of A.examples)Q.push(`${Sn}${ne}`)}V(Q.join(`
`))}function Ci(){let A=ov(Hr),V=[];V.push(`${St} v${gd}`),V.push(""),V.push("Blocks destructive commands and secret access."),V.push(""),V.push("COMMANDS:");for(let Q of Hr)V.push(sv(Q,A));V.push(""),V.push("GLOBAL OPTIONS:"),V.push(`${Sn}-h, --help       Show help (use with command for command-specific help)`),V.push(`${Sn}-V, --version    Show version`),V.push(""),V.push("HELP:"),V.push(`${Sn}${St} help <command>     Show help for a specific command`),V.push(`${Sn}${St} <command> --help   Show help for a specific command`),V.push(""),V.push("ENVIRONMENT VARIABLES:"),V.push(_n(`${r.level.name}=standard|strict|paranoid`,"Set session safety level")),V.push(_n(`${r.worktree.name}=1`,"Allow local git discards in linked worktrees")),V.push(_n(`${r.debug.name}=1`,"Print diagnostic messages to stderr")),V.push(_n(`${r.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),V.push(_n(`${r.projectTightenOnly.name}=1`,"Ignore project policy settings that weaken the user policy")),V.push(_n("CC_SAFETY_NET_HOME","Override rule config home directory")),V.push(""),V.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),V.push(_n(`${r.strict.name}=1`,"Force safety.overrides.fail_closed on")),V.push(_n(`${r.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),V.push(_n(`${r.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),V.push(_n(`${r.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),V.push(""),V.push("Documentation:        https://ccsafetynet.com/docs"),console.log(V.join(`
`))}function yd(){console.log(gd)}function Pr(A,V=console.log){let Q=Fr(A);if(!Q)return!1;if(Q.name.toLowerCase()!==A.toLowerCase())return!1;return or(Q,V),!0}import{existsSync as $o,readFileSync as xu}from"node:fs";import{join as Oo}from"node:path";import*as Gn from"node:readline";function iv(A){return A==="install"?"Install":"Uninstall"}function av(A){return A==="install"?"Installing":"Uninstalling"}function lv(A){return A==="install"?"into":"from"}function wd(A){return A?.available===!0}function cv(A,V){let Q=new Set(V);return A.filter((ne)=>Q.has(ne.target)).map((ne)=>ne.target)}function vd(A,V,Q){if(A.every((ne)=>!ne.available))return V;return Array.from({length:A.length},(ne,te)=>te+1).map((ne)=>(V+ne*Q+A.length)%A.length).find((ne)=>wd(A[ne]))}function dv(A,V,Q){if(Q.ctrl&&Q.name==="c")return"interrupt";if(Q.name==="escape"||V==="q")return"abort";if(A==="install"&&(V==="u"||V==="U"))return"update";if(Q.name==="up"||V==="k")return"up";if(Q.name==="down"||V==="j")return"down";if(Q.name==="space"||V===" ")return"toggle";if(Q.name==="return"||Q.name==="enter")return"confirm";return null}function uv(A){return{cursor:A.findIndex((V)=>V.available),selected:[]}}function pv(A,V,Q){if(Q==="confirm"||Q==="update"||Q==="abort"||Q==="interrupt")return{state:A,done:Q};if(Q==="up")return{state:{...A,cursor:vd(V,A.cursor,-1)}};if(Q==="down")return{state:{...A,cursor:vd(V,A.cursor,1)}};let ne=V[A.cursor];if(!wd(ne))return{state:A};let te=A.selected.includes(ne.target)?A.selected.filter((re)=>re!==ne.target):cv(V,[...A.selected,ne.target]);return{state:{...A,selected:te}}}var kd="◉",Cd="◯",xd=">",Sd=" ";function fv(A,V,Q){return["",`${iv(A)} CC Safety Net ${lv(A)}:`,"",...V.map((ne,te)=>{let re=Q.selected.includes(ne.target),le=te===Q.cursor,ye=re?kd:Cd,be=le?xd:Sd,_e=ne.available?"":` (${ne.unavailableReason??"not installed"})`,Ae=`${ye} ${ne.label}${_e}`,$e=!ne.available?qe.dim(Ae):re?qe.green(Ae):le?qe.bold(Ae):Ae;return`${be} ${$e}`}),"",A==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":V.some((ne)=>ne.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${A}. q/Esc: close`].join(`
`)}var bd=["global-hook","plugin"];function mv(A,V,Q={}){let ne=Q.color!==!1?qe.bold:(re)=>re;return["","Install the Kimi Code integration as:","",...[`Global hook — ${V?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((re,le)=>{let ye=le===A,be=`${ye?kd:Cd} ${re}`;return`${ye?xd:Sd} ${ye?ne(be):be}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function Pd(A){let{input:V,output:Q}=A;Gn.emitKeypressEvents(V);let ne=V.isRaw===!0;V.setRawMode(!0),V.resume();let te=0,re=()=>{if(te===0)return;Gn.moveCursor(Q,0,-te),Gn.cursorTo(Q,0),Gn.clearScreenDown(Q)},le=()=>{re();let ye=A.render();Q.write(`${ye}
`),te=ye.split(`
`).length};return new Promise((ye)=>{let be=(Ae)=>{V.off("keypress",_e),V.setRawMode(ne),V.pause(),re(),ye(Ae)};function _e(Ae,$e){A.onKey(Ae,$e,{finish:be,draw:le})}V.on("keypress",_e),le()})}function Rd(A={}){let V=0;return Pd({input:A.input??process.stdin,output:A.output??process.stdout,render:()=>mv(V,A.globalHookInstalled===!0),onKey:(Q,ne,te)=>{if(ne.ctrl&&ne.name==="c"){te.finish(null),(A.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(ne.name==="escape"||Q==="q")return te.finish(null);if(ne.name==="return"||ne.name==="enter")return te.finish(bd[V]);if(ne.name==="up"||ne.name==="down"||Q==="k"||Q==="j")V=(V+1)%bd.length,te.draw()}})}function xi(A=process.stdin,V=process.stdout){return Boolean(A.isTTY&&V.isTTY&&typeof A.setRawMode==="function")}function Ed(A,V,Q={}){let ne=Q.output??process.stdout,te=uv(V);return Pd({input:Q.input??process.stdin,output:ne,render:()=>fv(A,V,te),onKey:(re,le,ye)=>{let be=dv(A,re,le);if(!be)return;let _e=pv(te,V,be);if(te=_e.state,_e.done==="interrupt"){ye.finish(null),(Q.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(_e.done==="abort")return ye.finish(null);if(_e.done==="update")return ye.finish("update");if(_e.done==="confirm"){if(te.selected.length===0){ne.write("\x07"),ye.draw();return}ye.finish([...te.selected]),ne.write(`${av(A)} selected integrations...
`);return}ye.draw()}})}import{existsSync as Td,lstatSync as hv,mkdirSync as yv,mkdtempSync as vv,readdirSync as bv,readFileSync as ir,rmSync as Eo}from"node:fs";import{basename as wv,dirname as kv,join as wn}from"node:path";import{fileURLToPath as Cv}from"node:url";var Si="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",Pt="cc-safety-net",_t="cc-safety-net/index.ts";import{spawn as gv}from"node:child_process";var Pi=(A,V)=>{let Q=Wn([...A],process.env);return new Promise((ne)=>{let te=gv(Q.cmd,Q.args,{cwd:V,stdio:["ignore","pipe","pipe"],windowsVerbatimArguments:Q.windowsVerbatimArguments}),re=ks(te),le=!1,ye=setTimeout(()=>{le=!0,te.kill()},120000);te.on("error",(be)=>{clearTimeout(ye),ne({status:null,errorCode:be.code,stdout:re.stdout,stderr:[be.message,re.stderr].filter(Boolean).join(`
`)})}),te.on("close",(be)=>{clearTimeout(ye),ne({status:le?null:be,errorCode:le?"ETIMEDOUT":void 0,stdout:re.stdout,stderr:re.stderr})})})};var sr="cc-safety-net.ts",Ri=wn("amp",_t);function xv(A){return wn(A.home,".config","amp","plugins","cc-safety-net.ts")}function Sv(){let A=kv(Cv(import.meta.url)),V=wn(A,Ri),Q=wn(A,"..",Ri),ne=wn(A,"..","..","..","dist",Ri);return[V,Q,ne]}function Pv(A=Sv()){let V=A.find((Q)=>Td(Q)&&hv(Q).isFile());if(!V)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return V}function _d(A){try{return JSON.parse(A)}catch{return}}function To(A){return A.subarray(0,Buffer.byteLength(Si)).toString("utf-8")===Si}async function Rr(A,V,Q){let ne=await A(V,Q);if(ne.status===0)return ne;throw Error([`Failed to run ${V.join(" ")}${ne.status===null?"":` (exit ${ne.status})`}.`,[ne.stdout,ne.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Ad(A){let V=await A(["amp","plugins","repositories","--json"]);if(V.status===null)throw Error(`${V.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${V.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${V.stderr}`.trim());if(V.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${V.status}). Sign in with "amp login" and rerun install --amp.
${[V.stdout,V.stderr].filter(Boolean).join(`
`)}`.trim());let Q=_d(V.stdout),ne=(Array.isArray(Q)?Q:[]).filter((te)=>n(te,"scope")==="user"&&n(te,"exists")===!0&&n(te,"viewerCanWrite")===!0).map((te)=>n(te,"cloneRef")).find((te)=>typeof te==="string"&&te.length>0);if(!ne)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return ne}async function Id(A,V,Q){let ne=vv(wn(V.tmpdir,"cc-safety-net-amp-"));try{return await Rr(A,["amp","clone","user-plugins",ne]),await Q(ne)}finally{Eo(ne,{recursive:!0,force:!0})}}function Ei(A){return`rerun ${A==="overwrite"?"install":"uninstall"} --amp`}function Od(A,V,Q){let ne=wn(A,V),te=u(ne);if(!te)return;if(te.isSymbolicLink()||!te.isFile())throw Error(`Refusing to ${Q} ${V} in your Amp personal plugins repository: not a regular file. Remove it there and ${Ei(Q)}.`);let re=ir(ne);if(To(re))return re;throw Error(`Refusing to ${Q} unmanaged file ${V} in your Amp personal plugins repository. Remove it there and ${Ei(Q)}.`)}function $d(A,V){let Q=wn(A,Pt),ne=u(Q);if(!ne)return;if(ne.isSymbolicLink()||!ne.isDirectory())throw Error(`Refusing to ${V} ${Pt} in your Amp personal plugins repository: not a regular directory. Remove it there and ${Ei(V)}.`);return Od(A,_t,V)}function Rv(A){let V=wn(A,sr),Q=u(V);if(!Q||Q.isSymbolicLink()||!Q.isFile())return;let ne=ir(V);return To(ne)?ne:void 0}async function Dd(A,V,Q,ne){if(await Rr(A,Q,V),(await Rr(A,["git","status","--porcelain"],V)).stdout.trim()==="")return!1;return await Rr(A,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",ne],V),await Rr(A,["git","push","origin","HEAD"],V),!0}function Ro(A,V){Ev(A,V),Tv(A,V)}function Nd(A,V){if(V==="keep")return;throw Error(`Local Amp plugin ${A} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function Ev(A,V){let Q=xv(A),ne=u(Q);if(!ne)return;if(!ne.isSymbolicLink()&&ne.isFile()&&To(ir(Q))){Eo(Q);return}Nd(Q,V)}function Tv(A,V){let Q=wn(A.home,".config","amp","plugins",Pt),ne=u(Q);if(!ne)return;if(!ne.isSymbolicLink()&&ne.isDirectory()&&_v(Q)){Eo(Q,{recursive:!0});return}Nd(Q,V)}function _v(A){let V=wv(_t);if(bv(A).join("\x00")!==V)return!1;let Q=wn(A,V),ne=u(Q);return!!ne&&!ne.isSymbolicLink()&&ne.isFile()&&To(ir(Q))}function Av(A){let V=p(A);if(!Td(V))return"";let Q=_d(ir(V,"utf-8"));if(!Q||typeof Q!=="object"||Array.isArray(Q))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(P(Q,A.home))};
`}async function Ld(A,V=Pv(),Q=Pi){let ne=Buffer.concat([ir(V),Buffer.from(Av(A),"utf-8")]),te=await Ad(Q);return Id(Q,A,async(re)=>{let le=`${te}/${Pt}`,ye=$d(re,"overwrite"),be=Od(re,sr,"overwrite");if(ye?.equals(ne)&&!be)return Ro(A,"fail"),{path:le,alreadyInstalled:!0};if(yv(wn(re,Pt),{recursive:!0}),an(wn(re,_t),ne),be)Eo(wn(re,sr));let _e=await Dd(Q,re,["git","add","--",_t,...be?[sr]:[]],`chore: update cc-safety-net plugin to v${un()}`);return Ro(A,"fail"),{path:le,alreadyInstalled:!_e}})}async function jd(A,V=Pi){let Q=await Ad(V);return Id(V,A,async(ne)=>{let te=$d(ne,"remove"),re=Rv(ne),le=`${Q}/${re&&!te?sr:Pt}`;if(!te&&!re)return Ro(A,"keep"),{path:le,alreadyInstalled:!1};return await Dd(V,ne,["git","rm","--",...te?[_t]:[],...re?[sr]:[]],`chore: remove cc-safety-net plugin v${un()}`),Ro(A,"keep"),{path:le,alreadyInstalled:!0}})}import{existsSync as Hd,mkdirSync as Iv,readFileSync as Ov}from"node:fs";import{dirname as $v}from"node:path";var Ti=bn["antigravity-cli"],At="cc-safety-net";function Dt(A){return Boolean(A)&&typeof A==="object"&&!Array.isArray(A)}function Ao(){return{PreToolUse:[{hooks:[{type:"command",command:Ti,timeout:30}]}]}}function Fd(A){try{let V=JSON.parse(Ov(A,"utf-8"));if(!V||typeof V!=="object"||Array.isArray(V))throw Error("Antigravity hooks config must be a JSON object");return V}catch(V){if(V instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${A}: ${V.message}`);throw V}}function Md(A){let V=A[At];if(V===void 0){let ne=Ao();return A[At]=ne,{definition:ne,preToolUse:ne.PreToolUse??[]}}if(!Dt(V))throw Error(`Antigravity hooks config entry "${At}" must be an object`);let Q=Array.isArray(V.PreToolUse)?V.PreToolUse:[];return V.PreToolUse=Q,{definition:V,preToolUse:Q}}function Ud(A){if(!Array.isArray(A.PreToolUse))return!1;return A.PreToolUse.some((V)=>Dt(V)&&Array.isArray(V.hooks)&&V.hooks.some((Q)=>Dt(Q)&&Q.command===Ti))}function Dv(A){return Object.values(A).some((V)=>Dt(V)&&V.enabled!==!1&&Ud(V))}function Nv(A){if(A[At]===void 0)return!1;let V=Md(A);if(V.definition.enabled!==!1||!Ud(V.definition))return!1;return V.definition.enabled=!0,!0}function Lv(A){if(A[At]===void 0){A[At]=Ao();return}let V=Md(A);V.definition.enabled=!0,V.preToolUse.push(Ao().PreToolUse?.[0]??{hooks:[]})}function jv(A){let V=!1;for(let Q of Object.values(A)){if(!Dt(Q)||!Array.isArray(Q.PreToolUse))continue;Q.PreToolUse=Q.PreToolUse.flatMap((ne)=>{if(!Dt(ne)||!Array.isArray(ne.hooks))return[ne];let te=ne.hooks.filter((re)=>!Dt(re)||re.command!==Ti);if(te.length!==ne.hooks.length)V=!0;return te.length===0?[]:[{...ne,hooks:te}]})}return V}function _o(A,V){an(A,`${JSON.stringify(V,null,2)}
`)}function Bd(A){let V=pr(A.home);if(Iv($v(V),{recursive:!0}),!Hd(V))return _o(V,{[At]:Ao()}),{path:V,alreadyInstalled:!1};let Q=Fd(V);if(Dv(Q))return{path:V,alreadyInstalled:!0};if(Nv(Q))return _o(V,Q),{path:V,alreadyInstalled:!1};return Lv(Q),_o(V,Q),{path:V,alreadyInstalled:!1}}function Gd(A){let V=pr(A.home);if(!Hd(V))return{path:V,alreadyInstalled:!1};let Q=Fd(V);if(!jv(Q))return{path:V,alreadyInstalled:!1};return _o(V,Q),{path:V,alreadyInstalled:!0}}import{existsSync as Ii,readlinkSync as Mv}from"node:fs";import{join as qn}from"node:path";import{spawn as Hv}from"node:child_process";var An=xn.map((A)=>({target:A.id,flag:A.flag,label:cn(A.id),probeCommand:A.probeCommand}));function _i(A){let V=new Set(A);return An.map((Q)=>Q.target).filter((Q)=>V.has(Q))}async function qd(A,V){for(let Q of A)await V(Q)}var Fv=5000;function Er(A,V=Fv){return new Promise((Q)=>{let ne=Wn([...A],process.env),te=Hv(ne.cmd,ne.args,{env:process.env,stdio:"ignore",windowsVerbatimArguments:ne.windowsVerbatimArguments}),re=!1,le=(be)=>{if(re)return;re=!0,clearTimeout(ye),Q(be)},ye=setTimeout(()=>{te.kill(),le(!1)},V);te.on("error",()=>le(!1)),te.on("close",(be)=>le(be===0))})}function Vd(A=Er,V={}){let Q=new Set(V.configuredTargets??[]);return Promise.all(An.map(async(ne)=>({target:ne.target,flag:ne.flag,label:ne.label,...zd(V.action,await A(ne.probeCommand)||ne.target==="cursor"&&await A(ua),Q.has(ne.target))})))}function Kd(A,V){let Q=new Set(V.configuredTargets??[]);return A.map((ne)=>({...ne,...zd(V.action,ne.available,Q.has(ne.target))}))}function zd(A,V,Q){if(A==="uninstall")return Q?{available:!0}:{available:!1,unavailableReason:"not installed"};if(A==="install"&&Q)return{available:!1,unavailableReason:"already installed"};if(!V)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}var Vn="cc-safety-net",Zd=["npx","-y","@deepseek-ai/dsh"],Jd="DeepSeek Harness",Wd=["@deepseek-ai","dsh-desktop"],Xd="Quit DeepSeek Harness Desktop, then run this command again: Desktop plugins can only change while it is closed.",Ai=(A)=>`DeepSeek Harness Desktop is not in its default location, so ${A} ${Vn} from its Plugins page.`,Qd=(A,V)=>Ii(qn(De(A),V,"package.json"));function Oi(A,V){let Q=V.platform??process.platform,ne=Qd(A,"desktop"),te=Q==="darwin"?[qn(A.home,"Applications"),V.systemApplications??"/Applications"].map((re)=>qn(re,`${Jd}.app`,"Contents","Resources","runtime","cli","bin","dsh")):Q==="win32"?[qn(A.env.get("LOCALAPPDATA")||qn(A.home,"AppData","Local"),"Programs",Jd,"resources","runtime","cli","bin","dsh.cmd")]:[];return{profile:ne,cli:ne?te.find((re)=>Ii(re)):void 0}}function eu(A,V=process.platform){if(V==="win32")return Ii(qn(A.env.get("APPDATA")||qn(A.home,"AppData","Roaming"),...Wd,"lockfile"));let Q=Uv(qn(A.home,"Library","Application Support",...Wd,"SingletonLock")),ne=Number(/-(\d+)$/.exec(Q??"")?.[1]);return Number.isInteger(ne)&&ne>0&&Bv(ne)}function Uv(A){try{return Mv(A)}catch{return}}function Bv(A){try{return process.kill(A,0),!0}catch(V){return V.code==="EPERM"}}async function nu(A,V={}){let Q=Oi(A,V);if(Q.cli&&eu(A,V.platform))throw Error(Xd);let ne=!Q.cli||Qd(A,"web")||await(V.probe??Er)(Qo),te=[...Q.cli?[{profile:"desktop",label:"Desktop",dsh:[Q.cli]}]:[],...ne?[{profile:"web",label:"web",dsh:Zd}]:[]];return{commands:te.map((re)=>[...re.dsh,"plugin","--profile",re.profile,"add",`${Vn}@${un()}`]),afterInstall:async()=>{let re=new Set(pt(A).filter((ye)=>ye.enabled).map((ye)=>ye.name)),le=te.filter((ye)=>!re.has(ye.profile));if(le.length>0)throw Error(`DeepSeek Harness installed ${Vn} in the ${Yd(le)} but did not enable it. Enable it from the Plugins page.`)},message:[`Added ${Vn} to the DeepSeek Harness ${Yd(te)}.`,...Q.profile&&!Q.cli?[Ai("add")]:[]].join(`
`)}}function Yd(A){return`${A.map((V)=>V.label).join(" and ")} profile${A.length>1?"s":""}`}function tu(A,V={}){let Q=new Set(pt(A).map((re)=>re.name));if(!Q.has("desktop")&&!Q.has("web"))throw Error(`${Vn} is not installed in the DeepSeek Harness web or Desktop profile`);let ne=Q.has("desktop")?Oi(A,V).cli:void 0,te=Q.has("desktop")&&!ne;if(te&&!Q.has("web"))throw Error(Ai("remove"));if(ne&&eu(A,V.platform))throw Error(Xd);return{commands:[...ne?[[ne,"plugin","--profile","desktop","remove",Vn]]:[],...Q.has("web")?[[...Zd,"plugin","--profile","web","remove",Vn]]:[]],...te?{afterUninstall:()=>{throw Error(`Removed ${Vn} from the DeepSeek Harness web profile, but ${Ai("remove")}`)}}:{}}}function ru(A,V,Q={}){let ne=Oi(V,Q).cli!==void 0;return A.map((te)=>te.target==="deepseek-harness"&&ne?{...te,available:!0,unavailableReason:void 0}:te)}import{existsSync as Gv,readdirSync as qv,rmSync as Vv}from"node:fs";import{join as Kv}from"node:path";function ou(A,V=process.platform,Q){if(!Gv(A))return;let ne=V==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);qv(A).filter((te)=>te!==Q&&ne.test(te)).forEach((te)=>{Vv(Kv(A,te),{recursive:!0,force:!0})})}import{existsSync as su,readdirSync as zv,rmSync as Jv}from"node:fs";import{join as ar}from"node:path";function Io(A,V=process.platform){let Q=ar(A.env.get("npm_config_cache")||(V==="win32"?ar(A.env.get("LOCALAPPDATA")||ar(A.home,"AppData","Local"),"npm-cache"):ar(A.home,".npm")),"_npx");if(!su(Q))return;zv(Q).filter((ne)=>su(ar(Q,ne,"node_modules","cc-safety-net"))).forEach((ne)=>{Jv(ar(Q,ne),{recursive:!0,force:!0})})}import{existsSync as uu,mkdirSync as Yv,readFileSync as pu}from"node:fs";import{dirname as Zv,join as du}from"node:path";function Wv(A,V){if(A[V]!=="#")return V;let Q=A.indexOf(`
`,V+1);return Q===-1?A.length:Q+1}function $i(A,V,Q){let ne=new RegExp(`^(\\s*)${V}\\s*=\\s*\\[`),te=0;for(let re of A.split(`
`)){if(/^\s*\[/.test(re))return;let le=ne.exec(re);if(le){let ye=te+le[0].lastIndexOf("[");return{start:ye,end:vs(A,ye,{skipComment:Wv,...Q})}}te+=re.length+1}return}function iu(A,V,Q){let ne=A.slice(0,V.end).trimEnd(),te=kl(A,V.end),re=te===""?"     ":`${te}  `,le=!ne.endsWith("[")&&!ne.endsWith(",");return`${ne}${le?",":""}
${re}${Q}${A.slice(V.end)}`}function au(A,V,Q){let ne=A.indexOf(Q,V.start);if(ne===-1||ne>V.end)return A;return`${A.slice(0,ne)}${A.slice(ne+Q.length).replace(/^\s*,/,"")}`}function lu(A,V){let Q=new RegExp(`^\\s*${V}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),ne=A.split(`
`),te=ne.findIndex((ye)=>/^\s*\[/.test(ye)),re=te===-1?ne:ne.slice(0,te),le=te===-1?[]:ne.slice(te);return[...re.filter((ye)=>!Q.test(ye)),...le].join(`
`)}function cu(A,V,Q){let ne=new RegExp(`^\\s*\\[\\[${V}]]\\s*$`,"m");return A.split(/(?=^\s*\[)/m).filter((te)=>!ne.test(te)||!te.includes(Q)).join("").trimEnd()}var Tr=bn["kimi-code"],Di=`[[hooks]]
event = "PreToolUse"
command = "${Tr}"`,fu=`{ event = "PreToolUse", command = "${Tr}" }`,mu={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function gu(A){return du(A.env.get("KIMI_CODE_HOME")??du(A.home,".kimi-code"),"config.toml")}function Xv(A){let V=$i(A,"hooks",mu);if(V&&A.slice(V.start+1,V.end).trim())return iu(A,V,fu);let Q=lu(A,"hooks").trimEnd();if(Q==="")return`${Di}
`;return`${Q}

${Di}
`}function hu(A){let V=gu(A);if(Yv(Zv(V),{recursive:!0}),!uu(V))return an(V,`${Di}
`),{path:V,alreadyInstalled:!1};let Q=pu(V,"utf-8");if(Q.includes(Tr))return{path:V,alreadyInstalled:!0};return an(V,Xv(Q)),{path:V,alreadyInstalled:!1}}function yu(A){let V=gu(A);if(!uu(V))return{path:V,alreadyInstalled:!1};let Q=pu(V,"utf-8");if(!Q.includes(Tr))return{path:V,alreadyInstalled:!1};let ne=$i(Q,"hooks",mu),te=ne?au(Q,ne,fu):`${cu(Q,"hooks",Tr)}
`;return an(V,te),{path:V,alreadyInstalled:!0}}var Ni="safety-net@cc-marketplace",vu=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),bu=new Set(["antigravity-cli","cursor","devin","droid","grok-build","hermes-agent","kimi-code"]);function Li(A){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(A??"")}function Su(A){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(A??"")}function Qv(A){return/^Marketplace `cc-marketplace`\s*$/m.test(A??"")}var Pu={"claude-code":{installCommands:(A)=>{let V=eo(A,"cc-safety-net@cc-marketplace");return{commands:[...V?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...hs(A).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:eo(A,Ni)?[["claude","plugin","uninstall",Ni]]:[],update:V}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(A,V)=>{let Q=V??await pn(["codex","plugin","list"]),ne=Su(Q);return{commands:[ne||Qv(Q)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:Li(Q)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:ne}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:yl},"copilot-cli":{installCommands:async()=>{let A=await pn(["copilot","plugin","list"]),V=[..._l(A)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...Al(A)?[["copilot","plugin","uninstall",Rl]]:[]];if(El(A))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",En]],cleanupCommands:V,update:!0};return{commands:[Tl(await pn(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",En]],cleanupCommands:V}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(A)=>{let V=Hs(A);if(V.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(V.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:Qs,installCommands:(A)=>{let V=!$o(Oo(wr(A),kn));return{commands:Hc(),afterInstall:()=>Fc(V)}},uninstallCommands:[["openclaw","plugins","uninstall",dn,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:Wc},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]},"deepseek-harness":{installCommands:(A)=>nu(A),uninstallCommands:(A)=>tu(A)}};function Ru(A,V=(Q)=>Q){try{let Q=JSON.parse(V(xu(A,"utf-8")));if(!Q||typeof Q!=="object"||Array.isArray(Q))throw Error(`Settings file ${A} must be a JSON object`);return Q}catch(Q){if(Q instanceof SyntaxError)throw Error(`Failed to parse ${A}: ${Q.message}`);throw Q}}function eb(A){let V=Oo(gr(A),"settings.json");if(!$o(V))return;let Q=Ru(V,gn),ne=Q.enabledPlugins;if(!ne||typeof ne!=="object"||Array.isArray(ne))return;if(ne[En]!==!1)return;let te=xu(V,"utf-8"),re=te.replace(new RegExp(`("${En}"\\s*:\\s*)false`),"$1true");return ne[En]=!0,an(V,re!==te?re:`${JSON.stringify(Q,null,2)}
`),`Enabled ${En} plugin in ${V}`}function nb(A){let V=di(A);if(!$o(V))return;let Q=Ru(V);if(!Array.isArray(Q.packages))return;let ne=Q.packages.find((te)=>!!te&&typeof te==="object"&&!Array.isArray(te)&&ui(te.source)&&("extensions"in te));if(!ne)return;return delete ne.extensions,an(V,`${JSON.stringify(Q,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${V}`}function wu(A,V){let Q=fn({label:V,booleans:Object.fromEntries(An.map((re)=>[re.target,[re.flag]]))},A),ne=Q.errors[0];if(ne)throw Error(ne);let te=An.filter((re)=>Q.flags[re.target]).map((re)=>re.target);if(te.length!==1)throw Error(`Choose exactly one ${V} target: ${An.map((re)=>re.flag).join(", ")}`);return te[0]}async function Eu(A,V=zt){let[Q,ne,te]=await Promise.all([V(["amp","plugins","list"],30000),V(["codex","plugin","list"],30000),V(["copilot","--binary-version"])]);return{codexPluginListOutput:ne,hooks:rr(A,process.cwd(),{ampPluginListOutput:Q,codexPluginListOutput:ne,copilotCliVersion:te})}}async function tb(A,V,Q=zt){let ne=await Eu(A,Q);return ne.hooks.filter((te)=>V==="install"?te.configured:te.detected&&te.method!==lo||te.inspectionStatus==="not-inspected").filter((te)=>!Au(te)).filter((te)=>te.platform!=="codex"||!Li(ne.codexPluginListOutput)||Su(ne.codexPluginListOutput)).map((te)=>te.platform)}function rb(A,V,Q,ne){if(Q.length>0)return{finish:async()=>[wu(Q,V)]};if(!ne.selectTargets&&!xi(ne.input,ne.output))return{finish:async()=>[wu(Q,V)]};let te=ne.detectConfiguredTargets??(()=>tb(A,V,ne.fetchVersion)),re=Promise.all([Vd(ne.probeTargets).then((le)=>ru(le,A)),te()]);return{ready:re,finish:async()=>{let[le,ye]=await re,be=Kd(le,{action:V,configuredTargets:ye}),_e=ne.selectTargets?await ne.selectTargets(V,Cu(V,be)):await Ed(V,Cu(V,be),{input:ne.input,output:ne.output});if(_e==="update")return _e;if(!_e||_e.length===0)return null;return _i(_e)}}}async function ob(A,V,Q=!1,ne){let te=Pu[A];te.beforeInstall?.(V);let re=typeof te.installCommands==="function"?await te.installCommands(V,ne):{commands:te.installCommands};return await Cs(re.commands),await jl(re.cleanupCommands??[]),await re.afterInstall?.(),[`${re.update||Q?"Updated":"Installed"} ${cn(A)} integration`,re.message??te.postInstallMessage].filter(Boolean).join(`
`)}async function sb(A,V){let Q=Pu[A];if(!Q.uninstallCommands)throw Error(`${cn(A)} uninstall is not supported`);let ne=typeof Q.uninstallCommands==="function"?Q.uninstallCommands(V):{commands:Q.uninstallCommands};return await Cs(ne.commands),ne.afterUninstall?.(),`Uninstalled ${cn(A)} integration`}function ib(A){let V=Xc(A);return V.alreadyInstalled?`Uninstalled OpenCode plugin from ${V.path}`:`OpenCode plugin not installed in ${V.path}`}var Tu={"antigravity-cli":{install:Bd,uninstall:Gd},cursor:{install:Gl,uninstall:ql},devin:{install:Zl,uninstall:Xl},droid:{install:sc,uninstall:ic},"grok-build":{install:mc,uninstall:gc},"kimi-code":{install:hu,uninstall:yu}};function ab(A,V,Q,ne=!1){if(A==="install"&&!ne)Io(Q);let te=Tu[V][A](Q),re=cn(V),le=A!=="install"?"Uninstalled":ne?"Updated":"Installed";return A==="install"&&te.alreadyInstalled?ne?`${re} hook up to date in ${te.path}`:`${re} hook already installed in ${te.path}`:A==="uninstall"&&!te.alreadyInstalled?`${re} hook not installed in ${te.path}`:`${le} ${re} hook ${A==="install"?"in":"from"} ${te.path}`}var _u={amp:{install:Ld,uninstall:jd,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:Cc,uninstall:xc,afterInstall:async(A)=>{let V=Js(A);return await pn(["hermes","plugins","enable",Cn,"--no-allow-tool-override"]),!V},beforeUninstall:async(A)=>{zs(A);try{await pn(["hermes","plugins","disable",Cn])}catch(V){console.warn(`${V instanceof Error?V.message:String(V)}
Removing the plugin files anyway; ${Cn} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function lb(A,V,Q,ne=!1){let te=_u[V];if(A==="uninstall")await te.beforeUninstall?.(Q);let re=A==="install"?await te.install(Q):await te.uninstall(Q),le=A==="install"&&await te.afterInstall?.(Q),ye=cn(V),be=!le&&(A==="install"&&re.alreadyInstalled||A==="uninstall"&&!re.alreadyInstalled);return[be?A==="install"?`${ye} plugin ${ne?"up to date":"already installed"} at ${re.path}`:`${ye} plugin not installed at ${re.path}`:`${A!=="install"?"Uninstalled":ne?"Updated":"Installed"} ${ye} plugin ${A==="install"?"at":"from"} ${re.path}`,be?void 0:te.restartNote].filter(Boolean).join(`
`)}var cb={"copilot-cli":{afterInstall:eb},cursor:{afterUninstall:Fl},"hermes-agent":{beforeInstall:(A,V)=>{if(!V)Io(A)}},openclaw:{beforeUninstall:Qs},pi:{afterInstall:nb}};function db(A){return A in Tu}function ub(A){return A in _u}var ku=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net/tree/plugin","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Au(A){return A.platform==="kimi-code"&&A.method===bo}function Iu(A){return wo({environment:A,cwd:process.cwd()}).method==="hook config"}function pb(A){if(!Iu(A))return ku;return[ku,"",qe.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function Cu(A,V){return V.map((Q)=>A==="install"&&Q.target==="kimi-code"&&Q.unavailableReason==="already installed"?{...Q,available:!0,unavailableReason:void 0,label:`${Q.label} (global hook installed)`}:Q)}function fb(A,V){if(A.selectKimiInstallMethod)return A.selectKimiInstallMethod();if(!xi(A.input,A.output))return Promise.resolve("global-hook");return Rd({input:A.input,output:A.output,globalHookInstalled:Iu(V)})}async function Ou(A,V,Q,ne=!1,te){let re=cb[V];if(A==="install")re?.beforeInstall?.(Q,ne);if(A==="uninstall")re?.beforeUninstall?.(Q);if(db(V))return[ab(A,V,Q,ne),A==="uninstall"?await re?.afterUninstall?.(Q):void 0].filter(Boolean).join(`
`);if(ub(V))return lb(A,V,Q,ne);if(A==="uninstall")return V==="opencode"?ib(Q):sb(V,Q);return[await ob(V,Q,ne,te),await re?.afterInstall?.(Q)].filter(Boolean).join(`
`)}function mb(A){let V=fn({label:"update"},A).errors[0];if(V)throw Error(V)}async function gb(A,V=zt){let Q=await Eu(A,V),ne=Oo(gr(A),"installed-plugins");return{targets:_i([...Q.hooks.filter((re)=>re.platform!=="copilot-cli"&&re.detected&&re.method!==lo&&re.method!==Ts).map((re)=>re.platform),...[no,Pl,Sl].flatMap((re)=>$o(Oo(ne,...re))?["copilot-cli"]:[]),...eo(A,Ni)?["claude-code"]:[],...Li(Q.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:Q.codexPluginListOutput,kimiPlugin:Q.hooks.some(Au)}}async function hb(A){let V=c(),Q=A.output??process.stdout,ne=(A.scriptPath??process.argv[1]??"").split(/[\\/]/),te=ne.find((Fe)=>/^bunx-\d+-/.test(Fe)),re=te!==void 0||ne.includes("_npx")?null:(A.checkLatestVersion??Mn)(),le=async()=>{let Fe=re&&await re;if(Fe?.updateAvailable)Q.write(`
Update available: cc-safety-net ${Fe.currentVersion} → ${Fe.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},ye=gb(V,A.fetchVersion??zt).then(async(Fe)=>{let Ne=new Set(Fe.targets);return{targets:Fe.targets,codexPluginListOutput:Fe.codexPluginListOutput,kimiPlugin:Fe.kimiPlugin,available:new Map(await Promise.all(An.filter((Me)=>Ne.has(Me.target)&&vu.has(Me.target)).map(async(Me)=>[Me.target,await Er(Me.probeCommand)])))}}),be=await ur(A.showBanner??!0,()=>({ready:ye,finish:()=>ye}),()=>dr({input:A.input??process.stdin,output:Q}),{loadingMessage:"Checking installed integrations…",output:Q}),_e=await Promise.resolve().then(()=>(ou(V.tmpdir,process.platform,te),null)).catch((Fe)=>_r(Fe));if(be.targets.length===0){if(Q.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),_e!==null)console.error(_e);return await le(),_e===null?0:1}let Ae=be.targets.some((Fe)=>bu.has(Fe))?await Promise.resolve().then(()=>(Io(V),null)).catch((Fe)=>_r(Fe)):null,$e=await zr(Promise.all(be.targets.map((Fe)=>{if(Fe==="kimi-code"&&be.kimiPlugin)return Promise.resolve({message:"Kimi Code plugin skipped: update it in Kimi Code from /plugins (Installed tab, select cc-safety-net, press Enter)",failed:!1});if(vu.has(Fe)&&!be.available.get(Fe))return Promise.resolve({message:`${cn(Fe)} not found; skipped`,failed:!1});if(Ae!==null&&bu.has(Fe))return Promise.resolve({message:Ae,failed:!0});return Ou("install",Fe,V,!0,be.codexPluginListOutput).then((Ne)=>({message:Ne,failed:!1}),(Ne)=>({message:_r(Ne),failed:!0}))})),{loadingMessage:`Updating ${be.targets.length} integration${be.targets.length===1?"":"s"}…`,output:Q}),Le=_e===null?$e:[...$e,{message:_e,failed:!0}];return Le.forEach((Fe)=>Fe.failed?console.error(Fe.message):Q.write(`${Fe.message}
`)),await le(),Le.some((Fe)=>Fe.failed)?1:0}function ji(A,V={}){return Promise.resolve().then(()=>mb(A)).then(()=>hb(V)).catch((Q)=>(console.error(_r(Q)),1))}async function Ar(A,V,Q={}){try{let ne=c(),te=await ur(!0,()=>rb(ne,A,V,Q),()=>dr({input:Q.input??process.stdin,output:Q.output??process.stdout}),{loadingMessage:A==="install"?"Checking available integrations…":"Checking installed integrations…",output:Q.output??process.stdout});if(!te)return(Q.output??process.stdout).write(`Cancelled: nothing was ${A}ed.
`),0;if(te==="update")return(Q.runUpdate??(()=>ji([],{fetchVersion:Q.fetchVersion,input:Q.input,output:Q.output,showBanner:!1})))();let re=Q.output??process.stdout;return await qd(te,async(le)=>{if(le==="kimi-code"&&A==="install"){let be=await fb(Q,ne);if(be===null){re.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(be==="plugin"){re.write(`${pb(ne)}
`);return}}let ye=await zr(Ou(A,le,ne),{loadingMessage:`${A==="install"?"Installing":"Uninstalling"} ${cn(le)} integration…`,output:re});re.write(`${ye}
`)}),0}catch(ne){return console.error(_r(ne)),1}}function _r(A){let V=A instanceof Error?A.message:String(A),Q=typeof A==="object"&&A!==null&&"code"in A?A.code:null;if(Q==="EACCES"||Q==="EPERM")return`${V}
Check file permissions for the target config file and parent directory.`;if(Q==="ENOENT")return`${V}
Check that the target config path and parent directory exist.`;if(Q==="ENOTDIR")return`${V}
Check that every parent path component is a directory.`;return V}import{mkdirSync as Cb}from"node:fs";import{dirname as xb}from"node:path";import{createInterface as Sb}from"node:readline";import{existsSync as Nu,readFileSync as yb}from"node:fs";function jt(A,V){let Q=Rt(A,V);return{policy:Q.policy,errors:ge(xt(Q.issues,kt,(ne)=>ne.kind==="custom")," "," ")}}function Ir(A,V){return jt(A,V).errors}function $u(A,V){return{"safety.level":A.safety.level,...Do("safety.overrides",A.safety.overrides),"workflow.worktree_mode":String(A.workflow.worktree_mode),"destructive_command_protection.enabled":String(A.destructive_command_protection.enabled),...Do("destructive_command_protection.overrides",A.destructive_command_protection.overrides),...Du("destructive_command_protection.messages",A.destructive_command_protection.messages),"destructive_command_protection.allow_paths":Hi(A.destructive_command_protection.allow_paths),"secret_protection.enabled":String(A.secret_protection.enabled),...Do("secret_protection.overrides",A.secret_protection.overrides),...Du("secret_protection.messages",A.secret_protection.messages),"secret_protection.deny_paths":Hi(A.secret_protection.deny_paths),"secret_protection.allow_paths":Hi(A.secret_protection.allow_paths),...V?{"audit.retention_days":String(A.audit.retention_days)}:{}}}function No(A,V,Q){let ne=$u(A,Q),te=$u(V,Q);return[...new Set([...Object.keys(ne),...Object.keys(te)])].flatMap((re)=>ne[re]===te[re]?[]:[{field:re,before:ne[re],after:te[re]}])}function Or(A,V){let Q=p(A,V);if(!Nu(Q))return{baseline:P(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,A.home),diagnostics:[]};let ne=Ut(Q),te=jt(ne.value,A.home);return{baseline:te.policy,diagnostics:ne.errors.length>0?ne.errors:te.errors}}function Ut(A){if(!Nu(A))return{errors:[`${A}: file not found`]};try{return{value:JSON.parse(yb(A,"utf-8")),errors:[]}}catch(V){let Q=V instanceof Error?V.message:String(V);return{errors:[`${A}: ${V instanceof SyntaxError?`Invalid JSON: ${Q}`:Q}`]}}}function Lo(A,V){let Q=vb(A)?A:{};return{version:V.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((ne)=>Q[ne]!==void 0).map((ne)=>[ne,Q[ne]]))}}function Do(A,V){return Object.fromEntries(Object.entries(V).flatMap(([Q,ne])=>ne===void 0?[]:[[`${A}.${Q}`,String(ne)]]))}function Du(A,V={}){return Do(A,Object.fromEntries(Object.entries(V).map(([Q,ne])=>[Q,JSON.stringify(ne)])))}function Hi(A){return A.length===0?"(none)":A.join(", ")}function vb(A){return!!A&&typeof A==="object"&&!Array.isArray(A)}import{chmodSync as bb,existsSync as Lu,mkdirSync as wb,readFileSync as ju}from"node:fs";import{dirname as kb}from"node:path";function Hu(A,V={}){let Q=p(A,V);if(!Lu(Q))return{path:Q,exists:!1,raw:"",policy:N(),errors:[]};let ne=ju(Q,"utf-8");if(!ne.trim())return{path:Q,exists:!0,raw:ne,policy:N(),errors:["Config file is empty"]};try{let te=jt(JSON.parse(ne),A.home);return{path:Q,exists:!0,raw:ne,policy:te.policy,errors:te.errors}}catch(te){return{path:Q,exists:!0,raw:ne,policy:N(),errors:[`Invalid JSON: ${te instanceof Error?te.message:String(te)}`]}}}function Ln(A,V,Q={}){let ne=p(A,Q),te=jt(V,A.home);if(te.errors.length>0)return{path:ne,policy:N(),errors:te.errors};let re=te.policy;return wb(kb(ne),{recursive:!0,mode:448}),b(de(ne),`${JSON.stringify(re,null,2)}
`,384),bb(ne,384),{path:ne,policy:re,errors:[]}}function Fu(A,V){let Q=jt(V,A.home);if(Q.errors.length>0)return{errors:Q.errors};return{preview:et(Q.policy,A.env),errors:[]}}function Mu(A,V={}){let Q=p(A,V);if(!Lu(Q))return Ln(A,ae,V);let ne=ju(Q,"utf-8");if(!ne.trim())return Ln(A,ae,V);try{return Ln(A,P(JSON.parse(ne),A.home),V)}catch{return Ln(A,ae,V)}}var Uu=new Set(["check","apply"]),Bu="(unset)";async function qu(A,V,Q={}){let ne=fn({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},V),te=ne.positionals[0],re=[...ne.errors,...te&&!Uu.has(te)?[`Unknown policy subcommand: ${te}`]:[],...te&&Uu.has(te)&&!ne.positionals[1]?[`policy ${te} requires a file`]:[],...ne.positionals.slice(2).map((Me)=>`Unexpected policy argument: ${Me}`)];if(re.length>0){for(let Me of re)console.error(Me);return 1}let le=ne.positionals[1];if(!te||!le)return or(jr,console.error),1;let ye=Q.cwd??process.cwd(),be=ne.flags.global?p(A):x(ye);if(!ne.flags.global&&L(A,{cwd:ye}))return console.error(`${be} is the user policy, not a project policy; use --global for the user scope, or run from a project directory`),1;let _e=Ut(le),Ae=[..._e.errors,...Ir(_e.value,A.home).map((Me)=>`${le}: ${Me}`),...!ne.flags.global&&Eb(_e.value)&&_e.value.audit!==void 0?[`${le}: audit settings are user scope only; remove the audit section from a project proposal`]:[],...(ne.flags.global?[]:Qe(_e.value)).map((Me)=>`${le}: ${Me}`)];if(Ae.length>0){for(let Me of Ae)console.error(Me);return 1}let $e=P(_e.value,A.home);if(console.log(`Scope: ${ne.flags.global?"user":"project"} (${be})`),console.log(`Proposal: ${le}`),ne.flags.global)Gu(P(Ut(be).value,A.home),$e,!0);if(!ne.flags.global){let Me=Or(A).baseline;console.log("Effective policy (user + project merged):"),Gu(se(Me,ve(Ut(be).value,A.home).policy).policy,se(Me,ve(_e.value,A.home).policy).policy,!1)}if(te==="check")return 0;let Le=Q.input??process.stdin,Fe=Q.output??process.stdout;if(!Le.isTTY||!Fe.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${le}${ne.flags.global?" --global":""}`),1;if(!await Pb(`Apply this policy to ${be}? [y/N] `,Le,Fe))return console.log("Cancelled; nothing was written."),0;return Rb(A,be,_e.value,$e,ne.flags.global),console.log(`Policy applied: ${be}`),0}function Pb(A,V,Q){let ne=Sb({input:V,output:Q,terminal:!1});return new Promise((te)=>{ne.once("close",()=>te(!1)),ne.question(A,(re)=>{te(/^y(es)?$/i.test(re.trim())),ne.close()})})}function Rb(A,V,Q,ne,te){if(te){Ln(A,ne);return}Cb(xb(V),{recursive:!0}),yn(V,Lo(Q,ne))}function Gu(A,V,Q){let ne=No(A,V,Q);if(ne.length===0){console.log("No changes.");return}console.log(`Changes (${ne.length}):`);for(let te of ne)console.log(`  ${te.field}: ${te.before??Bu} -> ${te.after??Bu}`)}function Eb(A){return!!A&&typeof A==="object"&&!Array.isArray(A)}import{join as Uw}from"node:path";var Vu="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- `caffeinate`, `exec`, `nice`, `nohup`, `setsid`, `stdbuf`, `time`, and `timeout` are built-in transparent wrappers and need no configuration. Configure only other wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n- `command_tools`: Optional array of shell tools that a plugin adds to an agent and that CC Safety Net does not know. Each entry is a tool name such as `\"ops_bash\"`, or `{ \"name\": \"ops_run_background\", \"cwd\": \"cwd\" }` when the tool takes its working directory in a named argument (otherwise `workdir`, `cwd`, or `working_directory` is read). Use `{ \"name\": \"phone_shell\", \"cwd\": false }` for a tool whose working directory is not on this machine, such as one that runs commands on a remote host: CC Safety Net reads no working-directory argument for it and checks its commands against the session directory. A call to a declared tool with a non-empty string `command` is analyzed like a built-in shell command. User and project lists merge; the user entry wins a name declared in both.\n- Built-in shell and file tools are already analyzed and cannot be declared; `rule verify` reports one declared by hand.\n- Use `cc-safety-net rule tool add ops_bash ops_run_background` to declare tools in the user config, or add `--project` for the project config. Add `--cwd-arg <name>` to name the working-directory argument, or `--no-cwd-arg` to read none.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function jo(A,V){if(!A.ok){Zu(A);return}Ju(A,V)}function zu(A,V,Q){if(A.ok)console.log(Q);if(!A.add){jo(A,`Added rulebook source: ${V}`);return}if(!A.ok){Zu(A);return}if(A.add.added.length>0)console.log(`Added ${A.add.added.length} ${A.add.added.length===1?"rulebook":"rulebooks"} from ${A.add.source} at ${A.add.ref}:`),A.add.added.forEach((ne)=>{console.log(`  - ${ne}`)});if(A.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${A.add.source} at ${A.add.ref}: ${A.add.alreadyConfigured.join(", ")}`);if(A.add.commits.length>0)console.log(`Vendored at ${A.add.commits.map((ne)=>ne.slice(0,7)).join(", ")}.`);Ju(A,"Rule config updated.")}function Ju(A,V){for(let Q of A.changes??[])console.log(Q);console.log(V),console.log(""),Tb(A.entries)}function Tb(A){if(A.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${A.length}):`);for(let V of A)console.log(`  - ${V.name} ${V.version} (${_b(V.ruleCount)})`),console.log(`    Source: ${V.spec}`)}function _b(A){return`${A} ${A===1?"rule":"rules"}`}function Wu(A){Kn("Active sources",A.rulebooks,(V)=>[`[${V.source}] ${V.name} ${V.version}`,`  Source: ${V.spec}`]),Kn("Active rules",A.rules,(V)=>[`[${Ib(A,V.name)}] ${V.name}`,...Ab(V),`  Reason: ${V.reason}`]),Kn("Disabled rules",Ku(A,"off"),(V)=>[V.key]),Kn("Reason overrides",Ku(A,"reason"),(V)=>[V.key,`  Reason: ${V.value.reason}`]),Kn("Transparent wrappers",A.transparent_wrappers,(V)=>[V]),Kn("Issues",A.errors,(V)=>[V]),Kn("Warnings",A.warnings,(V)=>[V])}function Yu(A){Kn("Command tools",A,(V)=>typeof V.tool==="string"?[`[${V.scope}] ${V.tool}`]:[`[${V.scope}] ${V.tool.name}`,...V.tool.cwd===void 0?[]:[`  Cwd argument: ${V.tool.cwd===!1?"none":V.tool.cwd}`]])}function Kn(A,V,Q){if(V.length===0){console.log(`${A}: (none)`);return}console.log(`${A} (${V.length}):`);for(let ne of V){let[te,...re]=Q(ne);console.log(`  - ${te}`);for(let le of re)console.log(`    ${le}`)}}function Ab(A){if(!A.match)return[`  Command: ${A.subcommand?`${A.command} ${A.subcommand}`:A.command}`,`  Block args: ${A.block_args.join(", ")}`];return[`  Command: ${[A.command,...A.match.command_path].join(" ")}`,...A.match.any_args?[`  Any args: ${A.match.any_args.join(", ")}`]:[],...A.match.exclude_args?[`  Exclude args: ${A.match.exclude_args.join(", ")}`]:[]]}function Ib(A,V){return A.rulebooks.find((Q)=>Q.rules.includes(V))?.source??"project"}function Ku(A,V){return Object.entries({...A.userConfig?.overrides,...A.projectConfig?.overrides}).filter((Q)=>{if(V==="off")return Q[1]==="off";return!!Q[1]&&typeof Q[1]==="object"}).map(([Q,ne])=>({key:Q,value:ne}))}function Zu(A){for(let V of A.errors)console.error(V)}import{dirname as wp,join as Vo}from"node:path";import{join as Bi,resolve as Gb}from"node:path";function $r(A){let V=f(A);if(V.errors.length>0)return{ok:!1,result:{ok:!1,errors:V.errors,entries:[]}};return{ok:!0,config:V.config??me}}function Xu(A){yn(A,me)}function Qu(A){yn(A,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as Uo}from"node:path";var Ob="custom.";function Ho(A){if(A.rulebook_version!==2)return[];let V=A.rules.map((Q)=>({name:Q.name,command:Q.command,block_args:[],match:Q.match,reason:Q.reason,intent:Q.intent}));return(A.tests??[]).flatMap((Q,ne)=>{let te=Fi(C(Q.command));if(te.length===0)return[`tests[${ne}]: could not parse fixture command: ${Q.command}`];let re=te.reduce((le,ye)=>le??F(ye,V)?.id.slice(Ob.length),void 0);if(Q.expect==="blocked"){if(re===Q.rule)return[];let le=re?`"${re}" matched first`:"no rule matched";return[`tests[${ne}]: expected "${Q.rule}" to block "${Q.command}" but ${le}`]}return re?[`tests[${ne}]: expected "${Q.command}" to be allowed but "${re}" matched`]:[]})}function Fi(A){return A.nodes.flatMap((V)=>{if(V.kind==="group"||V.kind==="function")return Fi(V.body);if(V.kind!=="command")return[];let Q=Ie(ce(V.dialect,V.words)).words.map(t);return[...Q.length>0?[Q]:[],...V.nested.flatMap((ne)=>Fi(ne))]})}var Fo=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function Mo(A={}){return{requests:0,responseBytes:0,maxRequests:A.maxRequests??Fo.maxRequests,maxResponseBytes:A.maxResponseBytes??Fo.maxResponseBytes}}function jn(A){return{controller:new AbortController,budget:Mo(),resolveUrl:A}}function ep(A){return A instanceof Error&&A.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function np(A){if(A.requests>=A.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");A.requests++}function tp(A,V){if(V>A.maxResponseBytes-A.responseBytes)throw A.responseBytes+=V,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");A.responseBytes+=V}var sp=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function rp(A,V,Q=R(Uo(Uo(V)),"rules policy"),ne=jn()){if(T(A))return Lb(A,ne);return Nb(A,V,Q)}async function ip(A,V,Q,ne,te,re){if(!T(A))return rp(A,V,Q,ne);let le=te?null:$b(A,V,Q);if(le)return le;if(!te&&!re)throw Error(`${A} is not vendored; run rule update ${A} to vendor it`);return rp(A,V,Q,ne)}function $b(A,V,Q=R(Uo(Uo(V)),"rules policy")){let ne=j(A),te=U(V,ne.name),re=o(s(Q,te));if(re===null)return null;let le=he(Mi(re,`Invalid rulebook ${te}.`));if(le.name!==ne.name)throw Error(`rulebook name "${le.name}" in ${te} must match "${ne.name}"`);return{spec:A,rulebook:le,content:re}}async function ap(A,V={}){if(!oe(A))throw Error(`Invalid GitHub repository source: ${A}`);let[Q,ne]=A.split("/");if(!Q||!ne)throw Error(`Invalid GitHub repository source: ${A}`);if(V.ref!==void 0&&!pe(V.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${V.ref}`);let te=V.operation??jn(),re=V.ref??await Db(Q,ne,A,te),le=await cp(Q,ne,re,A,te),ye=await Bo(`https://api.github.com/repos/${Q}/${ne}/git/trees/${le}?recursive=1`,"tree",te),be=ye.response;if(!be.ok)throw Error(`Failed to inspect ${A}: GitHub tree returned ${be.status}`);let _e=JSON.parse(ye.content);if(!Array.isArray(_e?.tree))throw Error(`Failed to inspect ${A}: unexpected GitHub tree response`);let Ae=_e.tree,$e=[...new Set(Ae.flatMap((Le)=>{if(!Le||typeof Le!=="object")return[];let Fe=Le;if(Fe.type!=="blob"||typeof Fe.path!=="string")return[];let Ne=Fe.path.match($t);return Ne?.[1]?[Ne[1]]:[]}))].sort();if($e.length===0)throw Error(`No rulebooks found in ${A} under ${Ce}/`);return{source:A,owner:Q,repo:ne,ref:re,commit:le,names:$e}}async function Db(A,V,Q,ne){let te=await Bo(`https://api.github.com/repos/${A}/${V}`,"metadata",ne),re=te.response;if(!re.ok)throw Error(`Failed to inspect ${Q}: GitHub returned ${re.status}`);let ye=JSON.parse(te.content)?.default_branch;if(typeof ye!=="string"||ye==="")throw Error(`Failed to inspect ${Q}: missing default branch`);if(!pe(ye))throw Error(`GitHub returned an invalid default branch: ${ye}`);return ye}function Nb(A,V,Q){Ft(A);let ne=U(V,A),te=o(s(Q,ne));if(te===null)throw Error(`Rulebook source not found: ${A}`);let re=lp(Mi(te,"Invalid local rulebook source."));if(re.name!==A)throw Error(`rulebook name "${re.name}" must match local source "${A}"`);return{spec:A,rulebook:re,content:te}}async function Lb(A,V){let Q=j(A),ne=await cp(Q.owner,Q.repo,Q.ref,A,V),te=await Bo(`https://raw.githubusercontent.com/${Q.owner}/${Q.repo}/${ne}/${Q.path}`,"raw",V),re=te.response;if(!re.ok)throw Error(`Failed to fetch ${A}: GitHub raw returned ${re.status}`);let le=te.content,ye=lp(Mi(le,"Invalid GitHub rulebook response."));if(ye.name!==Q.name)throw Error(`rulebook name "${ye.name}" must match GitHub source "${Q.name}"`);return{spec:A,rulebook:ye,content:le}}function lp(A){let V=he(A),Q=Ho(V);if(Q.length>0)throw Error(Q.join("; "));return V}function Mi(A,V){try{return JSON.parse(A)}catch{throw Error(V)}}async function cp(A,V,Q,ne,te){let re=await Bo(`https://api.github.com/repos/${A}/${V}/commits/${encodeURIComponent(Q)}`,"commit",te),le=re.response;if(!le.ok)throw Error(`Failed to resolve ${ne}: GitHub returned ${le.status}`);let ye=JSON.parse(re.content);if(typeof ye?.sha!=="string"||ye.sha==="")throw Error(`Failed to resolve commit for ${ne}`);return ye.sha}async function jb(A,V,Q={}){if(Q.signal?.aborted)throw Q.signal.reason;let ne=Q.budget??Mo(),te=new AbortController,re=()=>te.abort(Q.signal?.reason);Q.signal?.addEventListener("abort",re,{once:!0});let le=!1,ye=setTimeout(()=>{if(te.signal.aborted)return;le=!0,te.abort()},Q.timeoutMs??sp.timeoutMs);try{if(Q.signal?.aborted)throw Q.signal.reason;np(ne);let be=await fetch(A,{signal:te.signal,redirect:"error"});if(!be.ok)return dp(be),{response:be,content:""};return{response:be,content:await Hb(be,V,ne,()=>te.abort())}}catch(be){if(le)throw Error("GitHub request timed out",{cause:be});if(Q.signal?.aborted)throw Q.signal.reason;throw be}finally{clearTimeout(ye),Q.signal?.removeEventListener("abort",re)}}function Bo(A,V,Q){return jb(Q.resolveUrl?.(A)??A,V,{budget:Q.budget,signal:Q.controller.signal})}async function Hb(A,V,Q=Mo(),ne){let te=sp[`${V}Bytes`],re=Number(A.headers.get("content-length"));if(Number.isFinite(re)&&re>te)throw dp(A),Error(`GitHub ${V} response exceeds ${te} bytes`);if(!A.body)return"";let le=A.body.getReader(),ye=[],be=0;while(!0){let _e=await le.read();if(_e.done)break;try{tp(Q,_e.value.byteLength)}catch(Ae){throw ne?.(),op(le),Ae}if(be+=_e.value.byteLength,be>te)throw ne?.(),op(le),Error(`GitHub ${V} response exceeds ${te} bytes`);ye.push(Buffer.from(_e.value))}return Buffer.concat(ye,be).toString("utf-8")}function dp(A){if(!A.body)return;up(()=>A.body?.cancel())}function op(A){up(()=>A.cancel())}function up(A){try{Promise.resolve(A()).catch(()=>{})}catch{}}var Fb=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function pp(A,V){let Q=gp(A.rules,V);if(Q.length>0)return{ok:!0,specs:Q};return mp(A.rules,V)}function fp(A,V){let Q=gp(A,V);if(Q.length>0)return{ok:!0,specs:Q};let ne=Ub(A,V);if(ne.length>0)return{ok:!0,specs:ne};let te=Bb(A,V);if(!te.ok)return te;if(te.specs.length>0)return{ok:!0,specs:te.specs};return mp(A,V)}function mp(A,V){let Q=A.filter((ne)=>Ui(ne)?.name===V);if(Q.length===1)return{ok:!0,specs:Q};return Mb(V,Q)}function Mb(A,V){return{ok:!1,result:{ok:!1,errors:V.length===0?[`No configured rulebook matches ${A}`]:[`Ambiguous rulebook match ${A}: ${V.join(", ")}`],entries:[]}}}function gp(A,V){return A.filter((Q)=>Q===V)}function Ub(A,V){let Q=V.match(Fb),ne=Q?.[1],te=Q?.[2],re=Q?.[3];if(!ne||!te||!re||!pe(re))return[];return hp(A,(le)=>le.owner===ne&&le.repo===te&&le.ref===re)}function Bb(A,V){if(!oe(V))return{ok:!0,specs:[]};let[Q,ne]=V.split("/"),te=hp(A,(le)=>le.owner===Q&&le.repo===ne);if(new Set(te.map((le)=>Ui(le)?.ref).filter((le)=>!!le)).size<2)return{ok:!0,specs:te};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${V}. Use an explicit ref:`,`  cc-safety-net rule remove ${V}#<ref>`],entries:[]}}}function Ui(A){try{return j(A)}catch{return null}}function hp(A,V){return A.filter((Q)=>{let ne=Ui(Q);return ne?V(ne):!1})}async function qo(A,V={}){return qb(A,V,await Go(A,V,jn()))}function qb(A,V,Q){if(!Q.ok)return Q;let ne=hn(A,V),te=[...new Set(Y(ne.configPath,ne.filesystemScope))];if(te.length===0)return Q;return{ok:!1,errors:te,entries:Q.entries}}async function Go(A,V,Q,ne={},te=new Set,re=new Set){try{let le=hn(A,V),ye=$r(le.configTarget);if(!ye.ok)return ye.result;let be=ye.config,_e=V.only?pp(be,V.only):{ok:!0,specs:be.rules};if(!_e.ok)return _e.result;let Ae=new Set([...V.refresh?_e.specs:[],...te]),$e=(nn)=>ip(nn,le.configDir,le.filesystemScope,Q,Ae.has(nn),!V.refresh||Ae.has(nn)),Le=await ew(be.rules,V.refresh?(nn)=>$e(nn).then((sn)=>({ok:!0,item:sn})).catch((sn)=>{if(ep(sn))throw sn;return{ok:!1,spec:nn,message:sn instanceof Error?sn.message:String(sn)}}):async(nn)=>({ok:!0,item:await $e(nn)}),Q),Fe=Le.filter((nn)=>!nn.ok),Ne=Le.filter((nn)=>nn.ok).map((nn)=>nn.item),Me=Ne.flatMap((nn)=>Vb(nn,be.rules)),Be=Ne.flatMap((nn)=>Kb(nn,re,le)),tn=new Set([...Me,...Be].map((nn)=>nn.spec)),en=[...Fe,...Me,...Be],on=[],ln=Jb(on,()=>Ne.flatMap((nn)=>tn.has(nn.spec)||en.length>0&&re.has(nn.spec)?[]:zb(nn,le,ne,on)));return{ok:en.length===0,errors:en.map((nn)=>`Failed to update ${nn.spec}: ${nn.message}`),entries:Ne.map(Yb),changes:ln}}catch(le){return Nr(le)}}function Vb(A,V){if(!T(A.spec))return[];let Q=Xe(A.spec),ne=V.filter((te)=>te!==A.spec&&Xe(te).toLowerCase()===Q.toLowerCase());if(ne.length===0)return[];return[{ok:!1,spec:A.spec,message:`rulebook name "${Q}" is also claimed by ${ne.join(", ")}; rename one of them`}]}function Kb(A,V,Q){if(!V.has(A.spec)||!T(A.spec))return[];let ne=U(Q.configDir,A.rulebook.name),te=o(s(Q.filesystemScope,ne));if(te===null||te===A.content)return[];return[{ok:!1,spec:A.spec,message:`${ne} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function zb(A,V,Q,ne){if(!T(A.spec))return[];let te=U(V.configDir,A.rulebook.name),re=s(V.filesystemScope,te),le=o(re);if(le===A.content)return[];return ne?.push({target:re,previous:le}),b(re,A.content,void 0,Q._testAfterPolicyRename),Wb(A,le)}function Jb(A,V){try{return V()}catch(Q){for(let ne of[...A].reverse()){if(ne.previous===null){q(ne.target);continue}b(ne.target,ne.previous)}throw Q}}function Wb(A,V){if(V===null)return[`Vendored ${A.spec} (${A.rulebook.version})`];let Q=Te(V),ne="problem"in Q?null:Q.rulebook,te=new Map(ne?.rules.map((le)=>[le.name,JSON.stringify(le)])??[]),re=new Set(A.rulebook.rules.map((le)=>le.name));return[`Updated ${A.spec} (${ne?.version??"unreadable"} -> ${A.rulebook.version})`,...[...re].filter((le)=>!te.has(le)).map((le)=>`  + ${le}`),...[...te.keys()].filter((le)=>!re.has(le)).map((le)=>`  - ${le}`),...A.rulebook.rules.filter((le)=>{let ye=te.get(le.name);return ye!==void 0&&ye!==JSON.stringify(le)}).map((le)=>`  ~ ${le.name}`)]}function Yb(A){return{spec:A.spec,name:A.rulebook.name,version:A.rulebook.version,ruleCount:A.rulebook.rules.length}}async function yp(A,V,Q={}){return Zb(A,V,Q,jn())}async function Zb(A,V,Q,ne,te={}){let re=null,le=!1;try{let ye=hn(A,Q),be=o(ye.configTarget);re={target:ye.configTarget,content:be};let _e=$r(ye.configTarget);if(!_e.ok)return _e.result;let Ae=_e.config,$e=oe(V)?await ap(V,{ref:Q.ref,operation:ne}):null,Le=$e?Xb($e,Q.rulebooks):[],Fe=$e?Le.map((en)=>Qb(Ae.rules,$e,en)??`${V}#${$e.ref}/${en}`):[V],Ne=Fe.filter((en)=>!Ae.rules.includes(en)),Me=[...Ae.rules,...Ne];if(Me.length>Ee)return nw();if(Me.length!==Ae.rules.length)le=!0,yn(ye.configTarget,{...Ae,rules:Me},void 0,te._testAfterPolicyRename);let Be=await Go(A,Q,ne,te,new Set(Ne),new Set(Ne));if(!Be.ok)Dr(ye.configTarget,be);if(!Be.ok||!$e)return Be;let tn=Le.filter((en,on)=>Ne.includes(Fe[on]??""));return{...Be,add:{source:V,ref:$e.ref,selected:Le,added:tn,alreadyConfigured:Le.filter((en)=>!tn.includes(en)),commits:Ne.length>0?[$e.commit]:[]}}}catch(ye){if(le&&re)try{Dr(re.target,re.content)}catch(be){return Nr(be)}return Nr(ye)}}function Xb(A,V){let Q=V?[...new Set(V)]:A.names,ne=Q.filter((te)=>!A.names.includes(te));if(ne.length>0)throw Error(`Rulebooks not found in ${A.source} at ${A.ref}: ${ne.join(", ")}
Available rulebooks: ${A.names.join(", ")}`);return Q}function Qb(A,V,Q){let ne=`${V.source}#${V.ref}/${Q}`;if(A.includes(ne))return ne;let te=`${V.source}#${V.commit}/${Q}`;return A.find((re)=>re===te)}async function ew(A,V,Q=jn()){if(A.length>Ee)throw Error(ke);let ne=[],te=0,re,le=Array.from({length:Math.min(A.length,Fo.concurrency)},async()=>{while(!re){let ye=te;if(ye>=A.length)return;te++;try{ne[ye]=await V(A[ye],ye,Q.controller.signal)}catch(be){if(!re)re={value:be},te=A.length,Q.controller.abort(be);return}}});if(await Promise.all(le),re)throw re.value;return ne}function nw(){return{ok:!1,errors:[ke],entries:[]}}async function vp(A,V,Q={}){try{return await tw(A,V,Q,{})}catch(ne){return Nr(ne)}}async function tw(A,V,Q,ne){let te=hn(A,Q),re=f(te.configTarget);if(re.errors.length>0)return{ok:!1,errors:re.errors,entries:[]};if(!re.config)return{ok:!1,errors:[`No config found at ${te.configPath}`],entries:[]};let le=fp(re.config.rules,V);if(!le.ok)return le.result;let ye=Q.deleteSource?rw(te.configDir,le.specs,te.filesystemScope):{ok:!0,dirs:[]};if(!ye.ok)return ye.result;let be=o(te.configTarget);if(be===null)return Nr(Error("Rules config is unavailable."));try{yn(te.configTarget,{...re.config,rules:re.config.rules.filter(($e)=>!le.specs.includes($e))},void 0,ne._testAfterPolicyRename)}catch($e){throw Dr(te.configTarget,be),$e}let _e=await Go(A,Q,jn(),ne);if(!_e.ok)return Dr(te.configTarget,be),_e;let Ae=ow(ye.dirs,ne,te.filesystemScope);if(!Ae.ok){Dr(te.configTarget,be);let $e=await Go(A,Q,jn(),ne);if(!$e.ok)return{ok:!1,errors:[...Ae.result.errors,...$e.errors],entries:$e.entries};return Ae.result}return _e}function rw(A,V,Q){let ne=V.flatMap((ye)=>m.test(ye)?[]:["--delete-source can only delete local rulebook sources"]),te=V.map((ye)=>Bi(A,ye)),re=ne.length>0?[]:te.flatMap((ye)=>bp(ye,Q)),le=[...ne,...re];return le.length>0?{ok:!1,result:{ok:!1,errors:le,entries:[]}}:{ok:!0,dirs:te}}function bp(A,V){let Q=Gb(A),ne=s(V,Q),te=Se(ne);if(!te)return[`Local rulebook source directory not found: ${A}`];let re=te.find((le)=>le.name==="rulebook.json");if(!re)return[`Local rulebook source directory is missing rulebook.json: ${A}`];if(re.kind!=="file")throw new i(V.label);if(o(s(V,Bi(Q,"rulebook.json"))),te.length>1)return[`Local rulebook source directory contains extra files: ${A}. delete manually if you really want to remove the directory.`];return[]}function ow(A,V,Q){let ne=A.flatMap((te)=>{try{if(!Se(s(Q,te)))return[];let re=bp(te,Q);if(re.length>0)return re;return sw(te,V,Q),[]}catch(re){return[`Failed to delete local rulebook source ${te}: ${re instanceof Error?re.message:String(re)}`]}});return ne.length>0?{ok:!1,result:{ok:!1,errors:ne,entries:[]}}:{ok:!0}}function sw(A,V,Q){if(V._testDeleteLocalSourceDir){V._testDeleteLocalSourceDir(A);return}q(s(Q,Bi(A,we))),Mt(s(Q,A))}function Dr(A,V){if(V===null){q(A);return}b(A,V)}function Nr(A){return{ok:!1,errors:[A instanceof Error?A.message:String(A)],entries:[]}}var iw=".safety-net.json",aw="~/.cc-safety-net/config.json";async function xp(A,V){let Q=L(A,{cwd:V.cwd});if(Q)console.log(`Skipped the project scope: ${D(V.cwd)} is the user rule config, not a project rule config`);return[Q||await kp(A,{legacyPath:Vt(V.cwd),configPath:D(V.cwd),defaultRulebookName:"project-rules",migratedFrom:iw,cleanup:V.cleanup,syncOptions:{cwd:V.cwd}}),await kp(A,{legacyPath:Kt(A),configPath:K(A),defaultRulebookName:"user-rules",migratedFrom:aw,cleanup:V.cleanup,syncOptions:{cwd:V.cwd,global:!0}})].every((te)=>te)?0:1}async function kp(A,V){let Q=hn(A,V.syncOptions),ne=s(Q.filesystemScope,V.legacyPath),te=o(ne);if(te===null)return console.log(`No legacy config found at ${V.legacyPath}`),!0;let re=cw(te);if(!re.ok){for(let Fe of re.errors)console.error(Fe);return!1}let le=f(Q.configTarget);if(le.errors.length>0){for(let Fe of le.errors)console.error(Fe);return!1}let ye=le.config??me,be=dw(wp(V.configPath),ye.rules,V.defaultRulebookName,V.migratedFrom,Q.filesystemScope),_e=Vo(wp(V.configPath),be,"rulebook.json"),Ae=s(Q.filesystemScope,_e),$e=[Cp(Q.configTarget),Cp(Ae)],Le=await lw(A,V,Q.configTarget,Ae,be,re.config.rules,{...ye,rules:ye.rules.includes(be)?ye.rules:[...ye.rules,be]});if(!Le.ok){fw($e);for(let Fe of Le.errors)console.error(Fe);return!1}if(!V.cleanup)return console.log(`Migrated legacy config at ${V.legacyPath}. Legacy file is no longer used.`),!0;if(!pw(Q.configTarget,Ae,be,V.migratedFrom,re.config.rules))return console.error(`Migration cleanup verification failed for ${V.legacyPath}`),!1;return q(ne),console.log(`Deleted legacy config at ${V.legacyPath}`),!0}async function lw(A,V,Q,ne,te,re,le){try{return yn(Q,le),yn(ne,uw(te,V.migratedFrom,re)),await qo(A,V.syncOptions)}catch(ye){return{ok:!1,errors:[ye instanceof Error?ye.message:String(ye)]}}}function cw(A){try{let V=JSON.parse(A),Q=os(V);if(Q.errors.length>0)return{ok:!1,errors:Q.errors};return{ok:!0,config:{version:1,rules:V.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function dw(A,V,Q,ne,te){let re=V.find((le)=>mw(s(te,Vo(A,le,"rulebook.json")))===ne);if(re)return re;if(o(s(te,Vo(A,Q,"rulebook.json")))===null)return Q;for(let le=2;;le++){let ye=`${Q}-${le}`;if(o(s(te,Vo(A,ye,"rulebook.json")))===null)return ye}}function uw(A,V,Q){return{rulebook_version:1,name:A,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:V,allowed_commands:[...new Set(Q.map((ne)=>ne.command))],rules:Q,tests:Q.map((ne)=>({command:[ne.command,ne.subcommand,ne.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:ne.name}))}}function pw(A,V,Q,ne,te){if(!f(A).config?.rules.includes(Q))return!1;try{let le=o(V);if(le===null)return!1;let ye=JSON.parse(le);return ye.migrated_from===ne&&JSON.stringify(ye.rules)===JSON.stringify(te)}catch{return!1}}function Cp(A){return{target:A,content:o(A)}}function fw(A){for(let V of A){if(V.content===null){q(V.target);continue}b(V.target,V.content)}}function mw(A){let V=o(A);if(V===null)return null;try{let Q=JSON.parse(V);return typeof Q.migrated_from==="string"?Q.migrated_from:null}catch{return null}}import{mkdir as gw,readFile as hw,writeFile as yw}from"node:fs/promises";import{dirname as vw,join as bw}from"node:path";var ww=86400000,kw=604800000;async function Pp(A,V=Date.now()){if(A.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let Q=ft(A);if(!Q)return null;let ne=bw(Q,".cc-safety-net","update-check.json"),te=await Cw(ne,V);if(!te.lastCheck||V-te.lastCheck>ww){let ye=await Mn();if(te.lastCheck=V,ye.latestVersion)te.latestVersion=ye.latestVersion;if(!await Sp(ne,te))return null;if(ye.error)return null}let re=te.latestVersion,le=un();if(!re||!ds(re,le))return null;if(te.notifiedVersion===re&&te.notifiedAt!==void 0&&V-te.notifiedAt<kw)return null;if(te.notifiedVersion=re,te.notifiedAt=V,!await Sp(ne,te))return null;return`UPDATE_AVAILABLE: cc-safety-net v${re} is available (running v${le}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function Cw(A,V){let Q=await hw(A,"utf8").then((re)=>JSON.parse(re)).catch(()=>{return});if(!Q||typeof Q!=="object"||Array.isArray(Q))return{};let ne=Q,te=(re)=>typeof re==="number"&&Number.isFinite(re)&&re<=V?re:void 0;return{lastCheck:te(ne.lastCheck),latestVersion:typeof ne.latestVersion==="string"?ne.latestVersion:void 0,notifiedVersion:typeof ne.notifiedVersion==="string"?ne.notifiedVersion:void 0,notifiedAt:te(ne.notifiedAt)}}async function Sp(A,V){return gw(vw(A),{recursive:!0,mode:448}).then(()=>yw(A,JSON.stringify(V),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as Ew,resolve as Vi}from"node:path";var Rp=new Map([["Bash","posix"],["PowerShell","powershell"],["Monitor","posix"]]);var Ep=new Map([["Bash","auto"]]);var Tp=new Map([["bash","auto"],["Bash","auto"],["powershell","powershell"],["PowerShell","powershell"]]);var _p=new Map([["Shell","auto"]]);var Ap=new Map([["exec","auto"]]),Ip="write_to_process";var Op=new Map([["Execute","auto"]]);var $p=new Map([["run_shell_command","auto"]]);var Dp=new Map([["run_terminal_command","auto"],["run_terminal_cmd","auto"],["monitor","auto"],["bash","auto"],["Shell","auto"]]);var Np=new Map([["terminal","posix"]]);var Lp=new Map([["Bash","posix"]]);var jp="exec";var Pw=[["antigravity-cli",[...cl.keys(),dl]],["claude-code",[...Rp.keys()]],["codex",[...Ep.keys()]],["copilot-cli",[...Tp.keys()]],["cursor",[..._p.keys()]],["deepseek-harness",[...ze.keys()]],["devin",[...Ap.keys(),Ip]],["droid",[...Op.keys()]],["gemini-cli",[...$p.keys()]],["grok-build",[...Dp.keys()]],["hermes-agent",[...Np.keys()]],["kimi-code",[...Lp.keys()]],["openclaw",[jp]],["opencode",[ct,Oe]],["pi",[...dt.keys()]]].flatMap(([A,V])=>V.map((Q)=>({name:Q,integration:cn(A)}))),Hp="and is already analyzed. Built-in tools cannot be declared.";function Ko(A){let V=He(A),Q=[...new Set(Pw.filter((ne)=>He(ne.name)===V).map((ne)=>ne.integration))].sort((ne,te)=>ne.localeCompare(te));if(Q.length>0)return`"${A}" is a built-in shell tool of ${Rw(Q)}, ${Hp}`;if(S(A)!=="unknown")return`"${A}" is a built-in file tool, ${Hp}`;return}function Rw(A){return A.length===1?A[0]??"":`${A.slice(0,-1).join(", ")} and ${A.at(-1)}`}var Mp="CC Safety Net Config",Tw="═".repeat(Mp.length),_w="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",Aw=new Set(["rule.json","rule.lock","cache"]);function Up(A,V={}){try{return Iw(A,V)}catch(Q){if(Q instanceof i)return console.error(Q.message),1;throw Q}}function Iw(A,V){let Q=V.cwd??process.cwd(),ne=ie(A,{cwd:Q}),te=Kt(A),re=Vt(Q),le=Vi(Q,Ce),ye=s(ne.userScope,te),be=s(ne.projectScope,re),_e=!1,Ae=!1,$e=[],Le=[],Fe=Ow(s(ne.projectScope,le));if(Dw(),o(ne.userConfigTarget)!==null){let Ne=Fn(ne.userConfigTarget);if(Ne.errors.push(...Y(ne.userConfigPath,ne.userScope),...Fp(ne.userConfigTarget)),$e.push({scope:"User",path:ne.userConfigPath,result:Ne,schema:"rules",target:ne.userConfigTarget}),Ne.errors.length>0)_e=!0}if(o(ye)!==null)if(Ae=!0,o(ne.userConfigTarget)!==null)Le.push(zo("user","cleanup"));else{let Ne=ss(ye);if($e.push({scope:"User",path:te,result:Ne,schema:"legacy",inactive:!0,target:ye}),Le.push(zo("user",Ne.errors.length>0?"fix-or-delete":"migrate")),Ne.errors.length>0)_e=!0}if(o(ne.projectConfigTarget)!==null){let Ne=Fn(ne.projectConfigTarget);if(Ne.errors.push(...Y(ne.projectConfigPath,ne.projectScope),...Fp(ne.projectConfigTarget)),$e.push({scope:"Project",path:Vi(ne.projectConfigPath),result:Ne,schema:"rules",target:ne.projectConfigTarget}),Ne.errors.length>0)_e=!0;if(o(be)!==null)Ae=!0,Le.push(zo("project","cleanup"))}else if(o(be)!==null){Ae=!0,_e=!0;let Ne=ss(be);$e.push({scope:"Project",path:Vi(re),result:Ne,schema:"legacy",inactive:!0,target:be}),Le.push(zo("project",Ne.errors.length>0?"fix-or-delete":"migrate"))}if(Fe?.result.errors.length)_e=!0;if($e.length===0&&!Fe)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Ne of $e)if(Ne.inactive)Lw(Ne.scope,Ne.path,Ne.result);else if(Ne.result.errors.length>0)jw(Ne.scope,Ne.path,Ne.result.errors);else{if(Ne.schema==="rules"&&Mw(Ne.target))console.log(`
Added $schema to ${Ne.scope.toLowerCase()} config.`);Nw(Ne.scope,Ne.path,Ne.result,Ne.schema)}for(let Ne of Le)console.error(`
${qe.red(Ne)}`);if(Fe)if(Fe.result.errors.length>0)Fw(Fe.path,Fe.result.errors);else Hw(Fe.path,Fe.result);if(_e)return console.error(`
Config validation failed.`),1;return console.log(Ae?`
Configs valid with warnings.`:`
All configs valid.`),0}function Fp(A){return(f(A).config?.command_tools??[]).flatMap((V)=>Ko(typeof V==="string"?V:V.name)??[])}function zo(A,V){let Q=`legacy ${A} config`;if(V==="cleanup")return`Warning: Legacy ${A} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(V==="migrate")return`Warning: Legacy ${A} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${A} config is no longer supported. Fix or delete the ${Q}, then run \`npx -y cc-safety-net rule migrate\`.`}function Ow(A){if(Se(A)===null)return null;let V=$w(A);if(V.ruleNames.size===0&&V.errors.length===0)return null;return{path:A.path,result:V}}function $w(A){let V=[],Q=new Set,ne=(Se(A)??[]).filter((te)=>!Aw.has(te.name)).sort((te,re)=>te.name.localeCompare(re.name));if(ne.length===0)return{errors:V,ruleNames:Q};for(let te of ne){if(!m.test(te.name)){V.push(`rulebook directory names must match ${m}: ${te.name}`);continue}if(te.kind!=="directory"){V.push(`${te.name} must be a rulebook directory`);continue}let re=s(A.scope,Ew(A.path,te.name,"rulebook.json")),le=o(re);if(le===null){V.push(`${te.name}/rulebook.json is required`);continue}try{let ye;try{ye=JSON.parse(le)}catch{V.push(`${te.name}/rulebook.json: invalid JSON`);continue}let be=he(ye);if(be.name!==te.name){V.push(`rulebook name "${be.name}" must match folder "${te.name}"`);continue}let _e=Ho(be);if(_e.length>0){V.push(..._e.map((Ae)=>`${te.name}/rulebook.json: ${Ae}`));continue}Q.add(te.name)}catch(ye){V.push(ye instanceof Error?`${te.name}/rulebook.json: ${ye.message}`:`${te.name}/rulebook.json: ${String(ye)}`)}}return{errors:V,ruleNames:Q}}function Dw(){console.log(Mp),console.log(Tw)}function Nw(A,V,Q,ne){if(console.log(`
✓ ${A} config: ${V}`),console.log(`  Schema: ${ne==="rules"?"rulebook sources":"legacy inline rules"}`),Q.ruleNames.size>0){console.log(`  ${ne==="rules"?"Sources":"Rules"}:`);let te=1;for(let re of Q.ruleNames)console.log(`    ${te}. ${re}`),te++}else console.log(`  ${ne==="rules"?"Sources":"Rules"}: (none)`)}function Lw(A,V,Q){if(console.error(`
✗ Legacy ${A.toLowerCase()} config: ${V}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),Q.errors.length>0){console.error("  Errors:");let ne=1;for(let te of Q.errors)for(let re of te.split("; "))console.error(`    ${ne}. ${re}`),ne++;return}if(Q.ruleNames.size>0){console.error("  Rules:");let ne=1;for(let te of Q.ruleNames)console.error(`    ${ne}. ${te}`),ne++;return}console.error("  Rules: (none)")}function jw(A,V,Q){Bp(`${A} config`,V,Q)}function Hw(A,V){console.log(`
✓ GitHub source rules: ${A}`),console.log("  Rulebooks:");let Q=1;for(let ne of V.ruleNames)console.log(`    ${Q}. ${ne}`),Q++}function Fw(A,V){Bp("GitHub source rules",A,V)}function Bp(A,V,Q){console.error(`
✗ ${A}: ${V}`),console.error("  Errors:");let ne=1;for(let te of Q)for(let re of te.split("; "))console.error(`    ${ne}. ${re}`),ne++}function Mw(A){try{let V=o(A);if(V===null)return!1;let Q=JSON.parse(V);if(Q.$schema)return!1;return b(A,JSON.stringify({$schema:_w,...Q},null,2)),!0}catch(V){if(V instanceof i)throw V;return!1}}var Gp=new Set(["init","add","remove","update","sync","list","wrapper","tool","migrate","doc","verify"]),Bw=new Set(["init","add","remove","update","sync","wrapper"]),Vp=new Set(["add","remove","list"]),Gw="cc-safety-net/rulebooks";async function Kp(A,V){try{return await qw(A,V)}catch(Q){if(Q instanceof i)return console.error(Q.message),1;throw Q}}async function qw(A,V){let Q=Kw(V),ne=Q.help?Vw(Q.positionals):null;if(ne)return or(ne),0;if(Q.errors.length>0){for(let _e of Q.errors)console.error(_e);return 1}let te=Q.positionals[0];if(!te)return or(qt,console.error),1;let re=Q.positionals[1],le={global:Q.global},ye=process.cwd();if((te==="tool"?Q.project:!Q.global&&Bw.has(te)&&!(te==="wrapper"&&re==="list"))&&L(A,{cwd:ye}))return console.error(`${D(ye)} is the user rule config, not a project rule config; ${te==="tool"?"drop --project":"use --global"} for the user scope, or run from a project directory`),1;if(te==="init"){let _e=hn(A,le);Ww(_e.configTarget);let Ae=Uw(_e.configDir,"example-rules","rulebook.json"),$e=s(_e.filesystemScope,Ae);if(Q.example&&o($e)===null)Qu($e);let Le=Y(_e.configPath,_e.filesystemScope);for(let Fe of Le)console.error(Fe);if(Le.length>0)return 1;return console.log("Rule config initialized."),0}if(te==="add"){let _e=zp(Q);if(!_e)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let Ae=hn(A,le),$e=await yp(A,_e,{...le,ref:Q.ref,rulebooks:Q.only.length>0?Q.only:void 0});return zu($e,_e,`Scope: ${Q.global?"user":"project"} (${Ae.configDir})`),$e.ok?0:1}if(te==="remove"){if(!re)return console.error("rule remove requires a source"),1;let _e=await vp(A,re,{...le,deleteSource:Q.deleteSource});return jo(_e,`Removed rulebook source: ${re}`),_e.ok?0:1}if(te==="update"){let _e=await qo(A,{...le,only:re,refresh:!0});return jo(_e,"Rule config updated."),_e.ok?0:1}if(te==="sync")return nl(A,{global:Q.global});if(te==="list"){let _e=J(A,{cwd:ye});return Wu(_e),_e.errors.length>0?1:0}if(te==="wrapper")return Yw(A,Q);if(te==="tool")return Xw(A,Q,ye);if(te==="migrate")return xp(A,{cleanup:Q.cleanup,cwd:ye});if(te==="doc"){console.log(Vu);let _e=await Pp(A);if(_e)console.error(_e);return 0}if(te==="verify")return Up(A);return 1}function Vw(A){if(A.length===0)return qt;let V=qt.subcommands.filter((ne)=>ne.usage.split(" ")[0]===A[0]);if(V.length===0)return null;if(A.length===1&&V.length>1)return{name:`rule ${A[0]}`,description:`Subcommands of rule ${A[0]}`,usage:`rule ${A[0]} <subcommand>`,subcommands:V,options:[]};let Q=A.length===1?V[0]:V.find((ne)=>ne.usage.split(" ")[1]===A[1]);if(!Q)return null;return{name:`rule ${A[0]}`,description:Q.description,usage:`rule ${Q.usage}`,options:A[0]==="add"?ns:[],examples:A[0]==="add"?ts:void 0}}function Kw(A){let V=fn({label:"rule",booleans:{global:["-g","--global"],project:["--project"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"],noCwdArg:["--no-cwd-arg"]},values:{ref:["--ref"],cwdArg:["--cwd-arg"]},lists:{only:["--only"]},positionals:"list"},A),Q={...V.flags,ref:V.values.ref,cwdArg:V.values.cwdArg,only:V.lists.only??[],help:V.help,positionals:V.positionals,errors:V.errors};return zw(Q),Q}function zw(A){let[V]=A.positionals;if(V&&!Gp.has(V))A.errors.push(`Unknown rule subcommand: ${V}`);if(A.deleteSource&&V!=="remove")if(V&&Gp.has(V))A.errors.push(`Unknown option for rule ${V}: --delete-source`);else A.errors.push("--delete-source is only valid with 'rule remove'");if(A.cleanup&&V!=="migrate")A.errors.push(Hn(V,"--cleanup"));if(A.example&&V!=="init")A.errors.push(Hn(V,"--example"));if(A.ref&&V!=="add")A.errors.push(Hn(V,"--ref"));if(A.only.length>0&&V!=="add")A.errors.push(Hn(V,"--only"));let Q=V==="tool"?A.positionals[1]:void 0,ne=Q&&Vp.has(Q)?`tool ${Q}`:V;if(A.project&&Q!=="add"&&Q!=="remove")A.errors.push(Hn(ne,"--project"));if(A.cwdArg!==void 0&&Q!=="add")A.errors.push(Hn(ne,"--cwd-arg"));if(A.noCwdArg&&Q!=="add")A.errors.push(Hn(ne,"--no-cwd-arg"));if(A.noCwdArg&&A.cwdArg!==void 0&&Q==="add")A.errors.push("rule tool add takes --cwd-arg or --no-cwd-arg, not both");if(V==="tool"&&A.global)A.errors.push(Hn(V,"--global"));if(V==="add")Jw(A);if(V==="migrate"){if(A.global)A.errors.push(Hn(V,"--global"));if(A.positionals.length>1)A.errors.push(`Unexpected rule migrate argument: ${A.positionals[1]}`)}else if(V==="wrapper")qp(A,"a command");else if(V==="tool")qp(A,"a tool name");else if(A.positionals.length>2)A.errors.push(`Unexpected rule argument: ${A.positionals[2]}`);if(V==="list"&&A.global)A.errors.push("Unknown option for rule list: --global")}function zp(A){if(A.positionals[1])return A.positionals[1];if(A.ref||A.only.length>0)return Gw;return}function Jw(A){let V=zp(A);if(!V)return;if((A.ref||A.only.length>0)&&!oe(V)){if(A.ref)A.errors.push(`--ref can only select a ref for an owner/repo source: ${V}`);if(A.only.length>0)A.errors.push("--only can only select rulebooks from an owner/repo source");return}if(A.ref&&!pe(A.ref))A.errors.push(`--ref must use valid path segments: ${A.ref}`);let Q=A.only.filter((ne)=>!m.test(ne));if(Q.length>0)A.errors.push(`Invalid rulebook names: ${Q.join(", ")}`)}function Hn(A,V){return A?`Unknown option for rule ${A}: ${V}`:`Unknown option for rule: ${V}`}function qp(A,V){let Q=A.positionals[0],ne=A.positionals[1],te=A.positionals[2];if(!ne){A.errors.push(`rule ${Q} requires add, remove, or list`);return}if(!Vp.has(ne)){A.errors.push(`Unknown rule ${Q} action: ${ne}`);return}if(ne==="list"){if(te)A.errors.push(`Unexpected rule ${Q} argument: ${te}`);return}if(!te){A.errors.push(`rule ${Q} ${ne} requires ${V}`);return}if(Q!=="tool"&&A.positionals.length>3)A.errors.push(`Unexpected rule ${Q} argument: ${A.positionals[3]}`)}function Ww(A){if(o(A)===null){Xu(A);return}let V=f(A);if(!V.config)return;yn(A,V.config)}async function Yw(A,V){let Q=V.positionals[1],ne=V.positionals[2],te=hn(A,{global:V.global}).configTarget;if(Q==="list"){let be=f(te);if(be.errors.length>0){for(let _e of be.errors)console.error(_e);return 1}return Zw(be.config?.transparent_wrappers??[]),0}if(!ne||!_.test(ne))return console.error("transparent wrapper must match command pattern"),1;if(Ke(ne))return console.error(`reserved command "${ne}" cannot be a wrapper`),1;let re=f(te);if(re.errors.length>0){for(let be of re.errors)console.error(be);return 1}let le=re.config??me,ye=Q==="add"?[...new Set([...le.transparent_wrappers??[],ne])]:(le.transparent_wrappers??[]).filter((be)=>be!==ne);return yn(te,{...le,transparent_wrappers:ye}),console.log(Q==="add"?`Added transparent wrapper: ${ne}`:`Removed transparent wrapper: ${ne}`),0}function Zw(A){if(A.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${A.length}):`);for(let V of A)console.log(`  - ${V}`)}function Xw(A,V,Q){let ne=V.positionals[1],te=[...new Set(V.positionals.slice(2))];if(ne==="list")return Qw(A,Q);let re=[...te.flatMap((Ae)=>{if(!Ye.test(Ae))return[`"${Ae}" is not a tool name: ${Re}.`];let $e=ne==="add"?Ko(Ae):void 0;return $e?[$e]:[]}),...V.cwdArg!==void 0&&!Ye.test(V.cwdArg)?[`"${V.cwdArg}" is not an argument name: ${Re}.`]:[]];if(re.length>0){for(let Ae of re)console.error(qe.red(`Error: ${Ae}`));return 1}let le=hn(A,{global:!V.project}),ye=$r(le.configTarget);if(!ye.ok){for(let Ae of ye.result.errors)console.error(Ae);return 1}let be=V.noCwdArg?!1:V.cwdArg,_e=te.reduce((Ae,$e)=>{let Le=be===void 0?$e:{name:$e,cwd:be},Fe=(Ne)=>(typeof Ne==="string"?Ne:Ne.name)===$e;if(ne==="remove")return Ae.filter((Ne)=>!Fe(Ne));return Ae.some(Fe)?Ae.map((Ne)=>Fe(Ne)?Le:Ne):[...Ae,Le]},ye.config.command_tools??[]);yn(le.configTarget,{...ye.config,command_tools:_e});for(let Ae of te)console.log(ne==="add"?`Added command tool: ${Ae}${be===void 0?"":be===!1?" (no cwd argument)":` (cwd argument: ${be})`}`:`Removed command tool: ${Ae}`);return console.log(`Scope: ${V.project?"project":"user"} (${le.configPath})`),0}function Qw(A,V){let Q=(L(A,{cwd:V})?["user"]:["user","project"]).map((te)=>{let re=hn(A,{global:te==="user"});return{scope:te,path:re.configPath,...f(re.configTarget)}}),ne=Q.flatMap((te)=>te.errors.map((re)=>`${te.path}: ${re}`));if(ne.length>0){for(let te of ne)console.error(te);return 1}return Yu(Q.flatMap((te)=>(te.config?.command_tools??[]).map((re)=>({scope:te.scope,tool:re})))),0}import{sep as sk}from"node:path";import{existsSync as ek,readFileSync as nk}from"node:fs";import{join as tk}from"node:path";async function rk(A){if(A.isTTY)return null;return(await wt(A).catch(()=>null))?.trim()||null}function ok(A){let V=A.env.get("CLAUDE_SETTINGS_PATH");if(V)return V;return tk(Qr(A),"settings.json")}function Ki(A){let V=ok(A);if(!ek(V))return!1;try{let Q=nk(V,"utf-8"),ne=JSON.parse(Q);if(!ne.enabledPlugins)return!1;let te="cc-safety-net@cc-marketplace";if(!(te in ne.enabledPlugins))return!1;return ne.enabledPlugins[te]===!0}catch(Q){if(k(r.debug,A.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${V}: ${Q instanceof Error?Q.message:String(Q)}`);return!1}}async function zi(A,V=process.stdin){let Q=Ki(A),ne;if(!Q)ne="\uD83D\uDEE1️ CC Safety Net ❌";else{let re=w(A,{cwd:process.cwd()}),le=re.policy,ye=O(le,A.env),be=Object.values(X(le,ye.capabilities)).some(($e)=>$e.changesInherited),_e={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[be?"custom":ye.effectiveLevel],Ae=re.policyScopes&&!re.policyScopes.weakeningsIgnored&&re.policyScopes.weakenings.length>0?"\uD83D\uDD3B":"";ne=`\uD83D\uDEE1️ CC Safety Net ${_e}${ye.worktreeMode?"\uD83C\uDF33":""}${Ae}${re.state==="degraded"?"⚠️":""}`}let te=await rk(V);if(te&&!te.startsWith("{"))console.log(`${te} | ${ne}`);else console.log(ne)}function Jp(A){let V=w(A,{cwd:process.cwd()}),Q=V.policy,ne=O(Q,A.env),te=!!process.env.NO_COLOR||!process.stdout.isTTY,re=Math.min(process.stdout.columns||80,100),le=te?"ok":"✔",ye=te?"OFF":"✘",be=(Me,Be)=>{let tn=`  ${Me.padEnd(13)}${Be}`;return(tn.length>re?`${tn.slice(0,re-1)}…`:tn).replaceAll(ye,qe.red(ye))},_e=Object.values(X(Q,ne.capabilities)).some((Me)=>Me.changesInherited),Ae=(Me)=>Me===A.home||Me.startsWith(`${A.home}${sk}`)?`~${Me.slice(A.home.length)}`:Me,$e={ready:qe.green,degraded:qe.yellow}[V.state],Le=V.policyScopes?.weakenings??[],Fe=[...Ki(A)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...V.diagnostics],Ne=te?"-":"·";console.log([`${te?"":"\uD83D\uDEE1️  "}CC Safety Net — ${$e(V.state)}`,"",be("Protection",`destructive ${Q.destructiveCommandProtectionEnabled?le:ye}   secrets ${Q.secretProtection.enabled?le:ye}`),be("Level",_e?`${ne.effectiveLevel} (customised)`:ne.effectiveLevel),be("Rules",Q.rules.length===0?"none active":`${Q.rules.length} active`),be("Policy",Ae(p(A))),...V.policyScopes?[be("Project",Ae(x(process.cwd())))]:[],...ne.worktreeMode?[be("Worktree","relaxations active")]:[],"",...Le.length===0?[]:[V.policyScopes?.weakeningsIgnored?"  Project policy (ignored)":"  Project policy",...Le.flatMap((Me)=>xr(Me,"      ",re-6).map((Be,tn)=>tn===0?`    ${Be}`:Be)),""],...Fe.length===0?["  Everything configured is active."]:["  Not active",...Fe.flatMap((Me)=>xr(Me,"      ",re-6).map((Be,tn)=>tn===0?`    ${Ne} ${Be}`:Be)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as mf}from"node:child_process";import{randomBytes as gk}from"node:crypto";import{existsSync as gf,mkdirSync as hk,readFileSync as yk}from"node:fs";import{createServer as vk}from"node:http";import{dirname as hf,join as bk}from"node:path";import{Writable as wk}from"node:stream";var Jo=500;function ik(A){let V=A.filter((te)=>te.decision!=="allow"),Q=A.filter((te)=>te.decision==="allow"),ne=Math.min(V.length,Math.max(Jo-Q.length,Math.ceil(Jo/2)));return[...V.slice(0,ne),...Q.slice(0,Jo-ne)]}function Wp(A,V,Q=W(A)){if(Q)ee(A,Q);let ne=(Be)=>new Date(Be.getFullYear(),Be.getMonth(),Be.getDate()).getTime(),te=ne(new Date),re=new Date(te);re.setDate(re.getDate()-(V-1));let le=re.getTime(),ye=[],be={count:0};for(let Be of Q?zn(Q,be):[])for(let tn of Gt(Be,be)){let en=new Date(tn.ts).getTime();if(!Number.isFinite(en))continue;if(en>=le)ye.push(tn)}ye.sort((Be,tn)=>new Date(tn.ts).getTime()-new Date(Be.ts).getTime());let _e=Array.from({length:V},()=>0),Ae=Array.from({length:V},()=>0),$e={},Le={},Fe={},Ne=0,Me=0;for(let Be of ye){let tn=Be.agent||"unknown";$e[tn]=($e[tn]??0)+1;let en=Math.round((te-ne(new Date(Be.ts)))/86400000),on=V-1-en,ln=en>=0&&en<V;if(ln)Ae[on]=(Ae[on]??0)+1;if(Be.decision!=="allow"){if(Ne++,Be.ruleId)Le[Be.ruleId]=(Le[Be.ruleId]??0)+1;let nn=Xo(Be.segment||Be.command);if(nn)Fe[nn]=(Fe[nn]??0)+1;if(Be.failureStage)Me++;if(ln)_e[on]=(_e[on]??0)+1}}return{days:V,logsDir:Q,homeDir:A.home,totalInWindow:ye.length,truncated:ye.length>Jo,unreadable:be.count,counts:{blocked:Ne,allowed:ye.length-Ne,agents:$e,blockedByDay:_e,analyzedByDay:Ae,rules:Le,commands:Fe,errors:Me},entries:ik(ye).sort((Be,tn)=>new Date(tn.ts).getTime()-new Date(Be.ts).getTime())}}import{spawn as ak}from"node:child_process";import{existsSync as lk,statSync as Yp}from"node:fs";import{delimiter as ck,join as dk}from"node:path";var uk=120000,Wo="Choose the project folder",pk=`try
  return POSIX path of (choose folder with prompt "${Wo}")
on error number -128
  return ""
end try`,fk=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${Wo}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Zp=[{binary:"zenity",args:["--file-selection","--directory",`--title=${Wo}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",Wo]}],Xp=(A,V)=>(V.PATH??"").split(ck).some((Q)=>{if(Q.length===0)return!1;try{let ne=Yp(dk(Q,A));return ne.isFile()&&(ne.mode&73)!==0}catch{return!1}});function Ji(A,V){if(A==="darwin"||A==="win32")return!0;if(A!=="linux")return!1;if(!V.DISPLAY&&!V.WAYLAND_DISPLAY)return!1;return Zp.some((Q)=>Xp(Q.binary,V))}function mk(A,V){if(A==="darwin")return{cmd:"osascript",args:["-e",pk]};if(A==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",fk]};let Q=Zp.find((ne)=>Xp(ne.binary,V));return Q?{cmd:Q.binary,args:Q.args}:null}function Wi(A=process.platform,V=process.env){let Q=mk(A,V);if(!Q)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((ne)=>{let te=ak(Q.cmd,Q.args,{env:V,stdio:["ignore","pipe","pipe"]}),re="",le=!1,ye=(_e)=>{if(le)return;le=!0,clearTimeout(be),ne(_e)},be=setTimeout(()=>{te.kill(),ye({error:"The folder dialog timed out"})},uk);te.stdout.on("data",(_e)=>{re+=_e.toString()}),te.on("error",()=>ye({error:`Could not open the folder dialog (${Q.cmd})`})),te.on("close",()=>{let _e=re.trim().replace(/\/+$/,"");if(!_e)return ye({cancelled:!0});if(!lk(_e)||!Yp(_e).isDirectory())return ye({error:"That selection is not a folder on disk"});ye({path:_e})})})}var Qp=["en","ja","zh-CN"],ef=["light","dark"],Yo=(A,V)=>A.includes(V),nf=(A)=>typeof A==="object"&&A!==null&&!Array.isArray(A),tf=(A)=>{let V=nf(A)?A:{};return{...Yo(Qp,V.language)?{language:V.language}:{},...Yo(ef,V.theme)?{theme:V.theme}:{}}},rf=(A)=>{if(!nf(A))return null;let V=Object.keys(A).every((te)=>te==="language"||te==="theme"),Q=A.language===void 0||Yo(Qp,A.language),ne=A.theme===void 0||Yo([...ef,"auto"],A.theme);return V&&Q&&ne?A:null},of=(A,V)=>{let Q=V.language??A.language,ne=V.theme==="auto"?void 0:V.theme??A.theme;return{...Q?{language:Q}:{},...ne?{theme:ne}:{}}};var sf=`<!doctype html>
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
`;var af='<script id="ccsn-data" type="application/json">';function lf(A,V=sf){return V.replace(af,()=>af+JSON.stringify(A).replaceAll("<","\\u003c"))}var Zi="kenryu42/cc-safety-net",kk=`https://github.com/${Zi}`,yf=1e4,Ck=7,xk="The project draft directory changed; reload the draft before applying.",Sk="audit settings are user scope only; remove the audit section from a project proposal";async function vf(A,V={}){let Q=fn({label:"gui",booleans:{noOpen:["--no-open"]}},A),ne=V.log??console.log,te=V.error??console.error;if(Q.errors.length>0){for(let le of Q.errors)te(le);return te("Usage: cc-safety-net gui [--no-open]"),1}let re=await Pk(c,V);if(ne(`CC Safety Net policy GUI: ${re.url}`),!Q.flags.noOpen)try{await(V.openBrowser??jk)(re.url)}catch(le){te(`Failed to open browser: ${le instanceof Error?le.message:String(le)}`),te(`Open this URL manually: ${re.url}`)}if(V.keepAlive===!1)return await re.close(),0;return await Lk(re),0}async function Pk(A,V={}){let Q=gk(24).toString("base64url"),ne={dir:null,revision:0},te=vk((ye,be)=>{Rk(A,ye,be,Q,V,ne)});await new Promise((ye,be)=>{te.once("error",be),te.listen(0,"127.0.0.1",()=>{te.off("error",be),ye()})});let le=`http://127.0.0.1:${te.address().port}`;return{origin:le,token:Q,url:`${le}/?token=${encodeURIComponent(Q)}`,close:()=>Nk(te)}}async function Rk(A,V,Q,ne,te,re){let le=A(),ye=new URL(V.url??"/","http://127.0.0.1");if(V.method==="GET"&&ye.pathname==="/favicon.ico"){Q.writeHead(204,{"cache-control":"no-store"}),Q.end();return}if(!Ok(V,ye,ne)){rn(Q,403,{error:"Forbidden"});return}if(V.method==="GET"&&ye.pathname==="/"){let be=df(cf(le,te));await Promise.resolve(te.buildDocument?.()).then((_e)=>Dk(Q,lf({token:ne,preferences:be},_e)),(_e)=>rn(Q,500,{error:_e instanceof Error?_e.message:String(_e)}));return}if(V.method==="POST"&&ye.pathname==="/api/preferences"){let be=await lr(V);if(!be.ok){rn(Q,be.status,{errors:[be.error]});return}let _e=rf(be.value);if(!_e){rn(Q,400,{errors:["preferences accept only language (en, ja, zh-CN) and theme (auto, light, dark)"]});return}let Ae=cf(le,te),$e=of(df(Ae),_e),Le=Ek(Ae,$e);rn(Q,Le?500:200,Le?{errors:[Le]}:{preferences:$e});return}if(V.method==="GET"&&ye.pathname==="/api/policy"){let be=Hu(le,te),_e=w(le,Yi(te));rn(Q,200,{...be,configState:rt(_e),..._e.policyScopes?{projectPolicy:{path:x(te.cwd??process.cwd()),weakenings:_e.policyScopes.weakeningsIgnored?[]:_e.policyScopes.weakenings}}:{},destructiveCommandRules:Z,secretPatterns:Ct,secretDenial:{reason:st,intent:at},version:un(),preview:be.errors.length>0?null:et(be.policy,le.env)});return}if(V.method==="POST"&&ye.pathname==="/api/policy/preview"){let be=await lr(V);if(!be.ok){rn(Q,be.status,{errors:[be.error]});return}let _e=Fu(le,be.value);rn(Q,_e.errors.length>0?400:200,_e);return}if(V.method==="POST"&&ye.pathname==="/api/policy/explain"){let be=await lr(V);if(!be.ok){rn(Q,be.status,{errors:[be.error]});return}let _e=be.value;if(_e===null||typeof _e.command!=="string"){rn(Q,400,{errors:["command must be a string"]});return}let Ae=Ir(_e.policy,le.home);if(Ae.length>0){rn(Q,400,{errors:Ae});return}rn(Q,200,Ak(le,_e.command,_e.policy,te));return}if(V.method==="POST"&&ye.pathname==="/api/policy"){let be=await lr(V);if(!be.ok){rn(Q,be.status,{errors:[be.error]});return}let _e=Ln(le,be.value,te);rn(Q,_e.errors.length>0?400:200,_e);return}if(V.method==="POST"&&ye.pathname==="/api/reset"){rn(Q,200,Ln(le,ae,te));return}if(V.method==="POST"&&ye.pathname==="/api/repair"){rn(Q,200,Mu(le,te));return}if(V.method==="POST"&&ye.pathname==="/api/policy/project/choose-directory"){let be=await(te.chooseDirectory??Wi)();if("path"in be)re.dir=be.path,re.revision+=1;rn(Q,200,{cancelled:"cancelled"in be,..."error"in be?{error:be.error}:{}});return}if(V.method==="GET"&&ye.pathname==="/api/policy/project"){let be=bf(re,te),_e=wf(le,be,te),Ae=_e?{projection:{},diagnostics:[_e]}:uf(be,le.home),$e=Or(le,te);rn(Q,200,{path:x(be),revision:re.revision,baseline:$e.baseline,userPolicyDiagnostics:$e.diagnostics,projection:Ae.projection,projectionDiagnostics:Ae.diagnostics,canPickDirectory:Ji(process.platform,process.env)});return}if(V.method==="POST"&&ye.pathname==="/api/policy/project/diff"){let be=await pf(le,V,Q,re,te);if(!be)return;let _e=uf(be.dir,le.home),Ae=Or(le,te).baseline,$e=se(Ae,ve(be.proposal,le.home).policy);rn(Q,200,{rows:No(se(Ae,_e.projection).policy,$e.policy,!1),weakenings:$e.weakenings,existingFileDiagnostics:_e.diagnostics});return}if(V.method==="POST"&&ye.pathname==="/api/policy/project/apply"){let be=await pf(le,V,Q,re,te);if(!be)return;let _e=_k(be.dir,be.proposal,le.home);rn(Q,_e.errors.length>0?500:200,_e);return}if(V.method==="GET"&&ye.pathname==="/api/activity"){let be=ue(le,te),_e=Ik(ye.searchParams.get("days"),be);if(_e===null){rn(Q,400,{error:`days must be an integer between 1 and ${be}`});return}rn(Q,200,Wp(le,_e,te.activityLogsDir));return}if(V.method==="POST"&&ye.pathname==="/api/rules/choose-directory"){rn(Q,200,await Wi());return}if(V.method==="GET"&&ye.pathname==="/api/rules"){let be=J(le,Yi(te)),_e=new Map(be.rules.map((Ae)=>[Ae.name,Ae]));rn(Q,200,{projectPath:te.cwd??process.cwd(),canPickDirectory:Ji(process.platform,process.env),rulebooks:be.rulebooks.map((Ae)=>({source:Ae.source,spec:Ae.spec,name:Ae.name,version:Ae.version,rules:Ae.rules.flatMap(($e)=>{let Le=_e.get($e);if(!Le)return[];return[{name:Le.name,command:Le.command,subcommand:Le.subcommand,block_args:Le.block_args,reason:Le.reason}]})})),errors:be.errors,warnings:be.warnings});return}if(V.method==="GET"&&ye.pathname==="/api/star/context"){rn(Q,200,await(te.fetchStarContext??(()=>Gk(le,{logsDir:te.activityLogsDir})))());return}if(V.method==="POST"&&ye.pathname==="/api/star"){let be=await(te.starRepo??Hk)();rn(Q,200,be.ok?{ok:!0}:{ok:!1,fallbackUrl:kk});return}if(V.method==="GET"&&ye.pathname==="/api/integrations"){rn(Q,200,await(te.fetchIntegrations??(()=>Fk(le)))());return}if(V.method==="GET"&&ye.pathname==="/api/health"){rn(Q,200,await(te.fetchHealth??Uk)());return}if(V.method==="POST"&&(ye.pathname==="/api/install"||ye.pathname==="/api/uninstall")){let be=await lr(V);if(!be.ok){rn(Q,be.status,{errors:[be.error]});return}let _e=be.value?.target;if(typeof _e!=="string"||!An.some(($e)=>$e.target===_e)){rn(Q,400,{error:"unknown target"});return}let Ae=ye.pathname==="/api/install"?"install":"uninstall";rn(Q,200,await(te.runIntegration??Bk)(Ae,_e));return}rn(Q,404,{error:"Not found"})}function cf(A,V){return bk(hf(fe(A,V)),"gui.json")}function df(A){if(!gf(A))return{};try{return tf(JSON.parse(yk(A,"utf-8")))}catch{return{}}}function Ek(A,V){try{return hk(hf(A),{recursive:!0}),an(A,`${JSON.stringify(V,null,2)}
`),null}catch(Q){return Q instanceof Error?Q.message:String(Q)}}function Yi(A){return{...A,cwd:A.cwd??process.cwd()}}function bf(A,V){return A.dir??V.cwd??process.cwd()}function wf(A,V,Q){if(!L(A,{...Q,cwd:V}))return null;return`${x(V)} is the user policy, not a project policy; choose a project directory, or run the GUI from one`}function uf(A,V){let Q=x(A),ne=gf(Q)?Ut(Q):{value:void 0,errors:[]},te=ve(ne.value,V);return{projection:te.policy,diagnostics:[...ne.errors,...te.diagnostics]}}async function pf(A,V,Q,ne,te){let re=bf(ne,te),le=ne.revision,ye=await lr(V);if(!ye.ok)return rn(Q,ye.status,{errors:[ye.error]}),null;let be=ye.value;if(typeof be?.revision!=="number")return rn(Q,400,{errors:["revision must be a number"]}),null;if(be.revision!==le)return rn(Q,409,{errors:[xk]}),null;let _e=wf(A,re,te);if(_e)return rn(Q,400,{errors:[_e]}),null;let Ae=Tk(be.proposal,A.home);if(Ae.length>0)return rn(Q,400,{errors:Ae}),null;return{dir:re,proposal:be.proposal}}function Tk(A,V){let Q=Ir(A,V);if(Q.length>0)return Q;return[...A?.audit===void 0?[]:[Sk],...Qe(A)]}function _k(A,V,Q){let ne=x(A),te=Lo(V,P(V,Q));try{return b(s(R(A,"project policy"),ne),`${JSON.stringify(te,null,2)}
`),{path:ne,errors:[]}}catch(re){return{path:ne,errors:[re instanceof Error?re.message:String(re)]}}}function Ak(A,V,Q,ne){let te=P(Q,A.home),re=w(A,Yi(ne)),le=Ge({rules:re.policy.rules,transparentWrappers:re.policy.transparentWrappers,heredocDataWrappers:re.policy.heredocDataWrappers,commandTools:re.policy.commandTools,safety:nt(te.safety),worktreeMode:te.workflow.worktree_mode,destructiveCommandProtectionEnabled:te.destructive_command_protection.enabled,destructiveCommandRuleOverrides:te.destructive_command_protection.overrides,destructiveCommandAllowPaths:te.destructive_command_protection.allow_paths,secretProtection:{enabled:te.secret_protection.enabled,disabledRules:Tt(te.secret_protection.overrides),denyPaths:te.secret_protection.deny_paths,allowPaths:te.secret_protection.allow_paths},ruleMessages:Et(te)});return Sr(V,{policySnapshot:le,cwd:ne.cwd,userConfigDir:ne.userConfigDir},A)}function Ik(A,V){if(A===null)return Math.min(Ck,V);let Q=Number(A);if(!Number.isInteger(Q)||Q<1||Q>V)return null;return Q}function Ok(A,V,Q){if(V.searchParams.get("token")!==Q)return!1;if(A.method!=="POST")return!0;return A.headers["x-cc-safety-net-token"]===Q}var $k=1048576;async function lr(A){let V=[],Q=0;for await(let ne of A){let te=ne;if(Q+=te.byteLength,Q>$k)return{ok:!1,status:413,error:"Request body is too large"};V.push(te)}try{return{ok:!0,value:JSON.parse(Buffer.concat(V).toString("utf-8")||"{}")}}catch(ne){return{ok:!1,status:400,error:`Invalid JSON: ${ne instanceof Error?ne.message:String(ne)}`}}}function Dk(A,V){A.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),A.end(V)}function rn(A,V,Q){A.writeHead(V,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),A.end(JSON.stringify(Q))}function Nk(A){return new Promise((V,Q)=>{A.close((ne)=>ne?Q(ne):V())})}function Lk(A){return new Promise((V)=>{let Q=()=>{process.off("SIGINT",ne),process.off("SIGTERM",ne)},ne=()=>{Q(),A.close().then(V)};process.once("SIGINT",ne),process.once("SIGTERM",ne)})}function jk(A){let V=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",Q=process.platform==="win32"?["/c","start","",A]:[A];return new Promise((ne,te)=>{let re=mf(V,Q,{detached:!0,stdio:"ignore"}),le=(be)=>{re.off("spawn",ye),te(be)},ye=()=>{re.off("error",le),re.unref(),ne()};re.once("error",le),re.once("spawn",ye)})}async function Hk(A="gh",V=yf){return{ok:await qk(A,["api","-X","PUT",`/user/starred/${Zi}`],V)===0}}async function Fk(A,V={}){let Q=await qr((te)=>tr({environment:A,cwd:process.cwd(),openCodeVersion:te}).status!=="n/a",V.fetcher),ne=Mk(A,Q);return{targets:xn.map((te)=>{let re=ne.find((le)=>le.platform===te.id);return{target:te.id,label:cn(te.id),version:Q.versions[te.id]??null,status:re?.configured?"active":re?.detected?"disabled":re?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:Q.version,nodeVersion:Q.nodeVersion,platform:Q.platform}}}function Mk(A,V){return rr(A,process.cwd(),{ampPluginListOutput:V.ampPluginListOutput,codexPluginListOutput:V.codexPluginListOutput,copilotCliVersion:V.versions["copilot-cli"],openCodeVersion:V.versions.opencode,openCodePluginListOutput:V.openCodePluginListOutput})}async function Uk(A={}){let V=await(A.checkUpdates??Mn)();return{update:{latestVersion:V.latestVersion??null,updateAvailable:V.updateAvailable}}}var ff=Promise.resolve();function Bk(A,V,Q={}){let ne=async()=>{let re=[],{log:le,error:ye}=console;console.log=(...be)=>re.push(be.map(String).join(" ")),console.error=console.log;try{return{ok:await Ar(A,[],{selectTargets:async()=>[V],output:new wk({write(_e,Ae,$e){re.push(String(_e).replace(/\n$/,"")),$e()}}),...Q})===0,output:re.join(`
`)}}finally{console.log=le,console.error=ye}},te=ff.then(ne);return ff=te.then(()=>{return},()=>{return}),te}async function Gk(A,V={}){let[Q,ne]=await Promise.all([Vk(V.fetchRepo),Promise.resolve(Mr(A,ue(A),V.logsDir).totalBlocked)]);return{starCount:Q,blockedTotal:ne}}function qk(A,V,Q){return new Promise((ne)=>{let te=mf(A,V,{stdio:"ignore",windowsHide:!0}),re=!1,le=setTimeout(()=>{te.kill(),ye(null)},Q),ye=(be)=>{if(re)return;re=!0,clearTimeout(le),ne(be)};te.once("error",()=>ye(null)),te.once("close",ye)})}async function Vk(A=fetch){try{let V=await A(`https://api.github.com/repos/${Zi}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(yf)});if(!V.ok)return null;let Q=await V.json();return typeof Q.stargazers_count==="number"?Q.stargazers_count:null}catch{return null}}function Kk(A){if(A[0]!=="help")return!1;let V=A[1];if(!V)Ci(),process.exit(0);if(Pr(V))process.exit(0);console.error(`Unknown command: ${V}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var zk={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),Pr("hook",console.error),process.exit(1)},install:async(A)=>{process.exit(await Ar("install",A))},update:async(A)=>{process.exit(await ji(A))},uninstall:async(A)=>{process.exit(await Ar("uninstall",A))},rule:async(A)=>{process.exit(await Kp(c(),A))},policy:async(A)=>{process.exit(await qu(c(),A))},status:async(A)=>{if(In(fn({label:"status"},A).errors))process.exit(1);Jp(c())},statusline:async(A)=>{let V=fn({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},A);if(V.errors.length===0&&V.flags.claudeCode){await zi(c());return}if(In(V.errors),!V.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");Pr("statusline",console.error),process.exit(1)},doctor:async(A)=>{let V=pi(A);if(!V)process.exit(1);let Q=await od(c(),{json:V.json,skipUpdateCheck:V.skipUpdateCheck});process.exit(Q)},logs:async(A)=>{process.exit(await sa(c(),A))},gui:async(A)=>{process.exit(await vf(A))},explain:async(A)=>{process.exit(await md(c(),A))}};async function Jk(A){let V=fn({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},A);if(Kk(A))return;let Q=A[0],ne=Q?Fr(Q):void 0;if(V.help&&ne&&ne.name!=="rule")Pr(ne.name),process.exit(0);if(!Q||V.help&&!ne)Ci(),process.exit(0);if(V.flags.version)yd(),process.exit(0);if(ne){await zk[ne.name](A.slice(1));return}if(Q==="--statusline"){await zi(c());return}console.error(Q.startsWith("-")?`Unknown option: ${Q}`:`Unknown command: ${Q}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{Jk as runCli};
