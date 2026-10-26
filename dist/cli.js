import{l,a,ze,dt,A,Pt,pt,c,r,ft,O,k,xe,At,h,$e,b,gt,d,i,R,s,pe,o,x,we,V,Ot,Dt,m,Ce,Ee,Nt,j,re,fe,T,Lt,D,S,me,K,p,L,oe,ht,yt,U,P,M,ke,Re,Ve,ge,f,e,Ke,je,Je,Te,vt,bt,he,Ue,ye,Ye,ie,J,Ze,Pe,Y,xt,Z,se,ae,ve,St,wt,_,N,Xe,Ct,et,w,tt,He,nt,C,t,ce,_e,E,H,y,F,Mt,rt,ot,g,G}from"./chunks/index-cgv3d50b.js";import{ct}from"./chunks/index-pvb226ap.js";import{it,Ie}from"./chunks/index-6599c3e0.js";import{v,B,u,Be,n,Oe,lt,Rt,We}from"./chunks/index-bwwa10z2.js";import"./chunks/index-kv376pgv.js";import{ue,Q,ut,W,z}from"./chunks/index-xzrghv7z.js";var vf=["-h","--help"];function pn(I,q){let X=Object.entries(I.booleans??{}),ee=Object.entries(I.values??{}),ne=Object.entries(I.lists??{}),te=Object.fromEntries(X.map(([Le])=>[Le,!1])),le={},de=Object.fromEntries(ne.map(([Le])=>[Le,[]])),be=[],Se=[],Ae=!1,De=-1;for(let[Le,Ne]of q.entries()){if(Le<=De)continue;if(Ne==="--"){be.push(...q.slice(Le+1));break}if(vf.includes(Ne)){Ae=!0;continue}let Fe=X.find(([,nn])=>nn.includes(Ne));if(Fe){te[Fe[0]]=!0;continue}let Ge=ee.find(([,nn])=>nn.includes(Ne));if(Ge){let nn=q[Le+1];if(nn===void 0||nn.startsWith("-")){Se.push(`${Ne} requires a value`);continue}le[Ge[0]]=nn,De=Le+1;continue}let Me=ne.find(([,nn])=>nn.includes(Ne));if(Me){let nn=q.slice(Le+1),Qe=nn.findIndex((an)=>an.startsWith("-")),rn=nn.slice(0,Qe===-1?nn.length:Qe);if(rn.length===0){Se.push(`${Ne} requires at least one value`);continue}de[Me[0]]=[...de[Me[0]]??[],...rn],De=Le+rn.length;continue}if(Ne.startsWith("-")){Se.push(`Unknown option for ${I.label}: ${Ne}`);continue}if(I.positionals==="tail"){be.push(...q.slice(Le));break}be.push(Ne)}if(I.positionals!=="list"&&I.positionals!=="tail")Se.push(...be.map((Le)=>`Unexpected argument for ${I.label}: ${Le}`));return{flags:te,values:le,lists:de,positionals:be,help:Ae,errors:Se}}function _n(I){for(let q of I)console.error(q);return I.length>0}import{readdirSync as Sf,statSync as Qs,unlinkSync as Rf}from"node:fs";import{basename as ea,dirname as Ef,isAbsolute as Tf,join as Af,relative as _f,resolve as If,sep as Of}from"node:path";var Ys=(I)=>{let q=Date.now()-new Date(I).getTime();if(!Number.isFinite(q))return"";let X=Math.floor(q/60000),ee=Math.floor(X/60),ne=Math.floor(ee/24);if(ne>0)return`${ne}d ago`;if(ee>0)return`${ee}h ago`;if(X>0)return`${X}m ago`;return"just now"},Jo=(I)=>{let q=(I??"").trim().split(/\s+/).filter((ne)=>ne&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(ne)),X=q[0]?.split("/").pop();if(!X)return null;let ee=q[1];return ee&&/^[a-z][a-z0-9-]*$/.test(ee)?`${X} ${ee}`:X};function Zs(I){let q=(ne)=>`${ne.sessionId}
${Jo(ne.segment||ne.command)}`,X=I.filter((ne)=>ne.decision!=="allow"),ee=X.filter((ne)=>ne.sessionId).reduce((ne,te)=>ne.set(q(te),(ne.get(q(te))??0)+1),new Map);return new Set(X.filter((ne)=>ne.failureStage||(ee.get(q(ne))??0)>=2))}import{existsSync as bf,readdirSync as wf,readFileSync as kf}from"node:fs";import{join as Cf}from"node:path";function Kn(I,q){try{return wf(I,{withFileTypes:!0,encoding:"utf8"}).flatMap((X)=>{let ee=Cf(I,X.name);if(X.isDirectory())return Kn(ee,q);if(X.name.endsWith(".jsonl"))return[ee];return[]})}catch{if(q&&bf(I))q.count++;return[]}}var xf=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function Pf(I){if(!I||typeof I!=="object"||Array.isArray(I))return!1;let q=I;if(typeof q.ts!=="string"||typeof q.command!=="string")return!1;return xf.every((X)=>q[X]===void 0||typeof q[X]==="string")}function Ft(I,q){try{return kf(I,"utf-8").split(`
`).filter(Boolean).flatMap((X)=>{try{let ee=JSON.parse(X);if(!Pf(ee)){if(q)q.count++;return[]}return[ee]}catch{if(q)q.count++;return[]}})}catch{if(q)q.count++;return[]}}function fn(I){return Array.from(I,(q)=>{let X=q.charCodeAt(0);if(X<=31||X>=127&&X<=159)return`\\x${X.toString(16).padStart(2,"0")}`;return q}).join("")}function $f(I,q){let X=ue(I),ee=pn({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},q);if(_n(ee.errors))return null;if(ee.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(ee.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let ne=ee.values.limit===void 0?20:Xs(ee.values.limit);if(ne===null)return console.error("--limit must be a positive number"),null;let te=ee.values.since===void 0?Math.min(30,X):Xs(ee.values.since);if(te===null||te>X)return console.error(`--since must be a positive number of days no greater than ${X}`),null;let le={limit:ne,limitExplicit:ee.values.limit!==void 0,since:te,sinceExplicit:ee.values.since!==void 0,all:ee.flags.all,json:ee.flags.json,suspect:ee.flags.suspect,pruneLegacy:ee.flags.pruneLegacy,dryRun:ee.flags.dryRun,id:ee.values.id,agent:ee.values.agent,rule:ee.values.rule,session:ee.values.session,project:ee.values.project===void 0?void 0:If(ee.values.project)};if(le.id&&(le.agent!==void 0||le.rule!==void 0||le.session!==void 0||le.project!==void 0||le.suspect||le.sinceExplicit||le.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(le.pruneLegacy&&(le.id!==void 0||le.agent!==void 0||le.rule!==void 0||le.session!==void 0||le.project!==void 0||le.suspect||le.all||le.sinceExplicit||le.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(le.dryRun&&!le.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return le}async function na(I,q,X={}){let ee=$f(I,q);if(!ee)return 1;let ne=X.logsDir??W(I);if(ee.pruneLegacy)return Df(ne,ee.json,ee.dryRun);if(!ne)return console.log(ee.json?"[]":ee.id?`No retained audit log entry found for id ${fn(ee.id)}.`:"No audit log entries found."),0;Q(I,ne);let te={count:0},le=Kn(ne,te).flatMap((De)=>Ft(De,te).map((Le)=>({entry:Le,file:De})));if(te.count>0)console.error(`warning: ${te.count} audit log ${te.count===1?"source":"sources"} could not be read; these results are incomplete`);if(ee.id)return Ff(le,ee,X.timeZone);let de=Date.now()-ee.since*24*60*60*1000,be=le.filter((De)=>Hf(De,ee,ne,de)),Se=ee.suspect?Zs(be.map((De)=>De.entry)):null,Ae=(Se?be.filter((De)=>Se.has(De.entry)):be).sort((De,Le)=>Date.parse(Le.entry.ts)-Date.parse(De.entry.ts)).slice(0,ee.limit);if(ee.json)return console.log(JSON.stringify(Ae.map((De)=>De.entry),null,2)),0;if(Ae.length===0)return console.log("No audit log entries found."),0;for(let De of Ae)console.log(Bf(De.entry,X.timeZone));return 0}function Df(I,q,X){let ee=I?Lf(I).map((de)=>Af(I,de)):[];if(X)return Nf(ee,q);let ne=[],te=0,le=0;for(let de of ee){let be=Qs(de,{throwIfNoEntry:!1})?.size??0,Se=jf(de);if(Se){ne.push(`${ea(de)}: ${Se}`);continue}te++,le+=be}if(q)return console.log(JSON.stringify({removedFiles:te,removedBytes:le,failedFiles:ne.length})),ne.length===0?0:1;console.log(te===0&&ne.length===0?"No legacy audit log files found.":`Removed ${te} legacy audit log ${te===1?"file":"files"} (${ta(le)}).`);for(let de of ne)console.error(`Could not remove ${fn(de)}`);if(console.log("Nested v2 audit logs were not changed."),te>0)console.log("This deletion cannot be undone.");return ne.length===0?0:1}function Nf(I,q){let X=I.reduce((ee,ne)=>ee+(Qs(ne,{throwIfNoEntry:!1})?.size??0),0);if(q)return console.log(JSON.stringify({dryRun:!0,files:I.length,bytes:X})),0;if(console.log(I.length===0?"No legacy audit log files found.":`Would remove ${I.length} legacy audit log ${I.length===1?"file":"files"} (${ta(X)}).`),console.log("Nested v2 audit logs are not included."),I.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function Lf(I){try{return Sf(I,{withFileTypes:!0}).filter((q)=>q.isFile()&&q.name.endsWith(".jsonl")).map((q)=>q.name)}catch{return[]}}function jf(I){try{return Rf(I),null}catch(q){return q instanceof Error?q.message:String(q)}}function ta(I){let q=["B","KiB","MiB","GiB"],X=Math.min(Math.floor(Math.log2(Math.max(I,1))/10),q.length-1);return`${Math.round(I/1024**X*10)/10} ${q[X]}`}function Ff(I,q,X){let ee=I.filter((te)=>te.entry.id===q.id);if(ee.length>1)return console.error(`Multiple audit log entries found for id ${fn(q.id??"")}.`),1;if(q.json)return console.log(JSON.stringify(ee.map((te)=>te.entry),null,2)),0;let ne=ee[0];if(!ne)return console.log(`No retained audit log entry found for id ${fn(q.id??"")}.`),0;return console.log(Gf(ne.entry,X)),0}function Hf(I,q,X,ee){if(!q.all&&I.entry.decision==="allow")return!1;if(Date.parse(I.entry.ts)<ee)return!1;if(q.agent!==void 0&&I.entry.agent!==q.agent)return!1;if(q.rule!==void 0&&I.entry.ruleId!==q.rule)return!1;if(q.session!==void 0&&!Mf(I,X,q.session))return!1;if(q.project!==void 0&&!Uf(I.entry.cwd,q.project))return!1;return!0}function Mf(I,q,X){if(I.entry.sessionId===X)return!0;return Ef(I.file)===q&&ea(I.file,".jsonl")===X}function Uf(I,q){if(!I)return!1;let X=_f(q,I);return X!==".."&&!X.startsWith(`..${Of}`)&&!Tf(X)}function Bf(I,q){let X=fn(I.id??"-"),ee=fn(I.decision??"deny"),ne=I.cwd?`  [${fn(I.cwd)}]`:"",te=I.segment||I.command,le=te===I.command?"":"↳ ",de=te.length>50?`${te.slice(0,50)}…`:te;return`${X.padEnd(16)}  ${fn(ra(I.ts,q))}  ${ee.padEnd(5)}  ${fn(I.agent??"-").padEnd(15)}  ${fn(I.ruleId??"-").padEnd(20)}  ${le}${fn(de)}${ne}`}function Gf(I,q){let X=(ne)=>fn(ne===void 0||ne===null||ne===""?"-":ne),ee=I.shape?`${I.agent??"-"} (shape: ${I.shape})`:I.agent??"-";return[`id:        ${X(I.id)}`,`ts:        ${X(ra(I.ts,q))}`,`decision:  ${X(I.decision)}`,`agent:     ${X(ee)}`,`level:     ${X(I.level)}`,`tool:      ${X(I.toolName)}`,`rule:      ${X(I.ruleId)}`,`intent:    ${X(I.intent)}`,`stage:     ${X(I.failureStage)}`,`error:     ${X(I.errorCode)}`,`session:   ${X(I.sessionId)}`,`cwd:       ${X(I.cwd)}`,`version:   ${X(I.v)}`,`truncated: ${X(I.truncated===!0?"yes":void 0)}`,`reason:    ${X(I.reason)}`,`command:   ${X(I.command)}`,`segment:   ${X(I.segment)}`].join(`
`)}function ra(I,q){let X=new Date(I);if(Number.isNaN(X.getTime()))return I;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:q}).format(X)}function Xs(I){let q=Number(I);return Number.isFinite(q)&&q>0?q:null}var oa={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var ia={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"--shell",argument:"<auto|posix|powershell>",description:"Parse the command as this shell (default: auto)"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"',"cc-safety-net explain --shell posix 'rmdir /s /q d:\\'"]};var sa={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var zo=["npx","--offline","--no-install","@deepseek-ai/dsh","--version"],aa=["cursor-agent","--version"],la=[{id:"antigravity-cli",displayName:"Antigravity CLI",runtime:{flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",runtime:{displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",runtime:{flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",runtime:{flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",runtime:{flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",runtime:{flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",runtime:{flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",runtime:{flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",install:{flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",install:{flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",install:{flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",runtime:{flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"deepseek-harness",displayName:"DeepSeek Harness",install:{flag:"--deepseek-harness",artifactKind:"package",probeCommand:zo}},{id:"devin",displayName:"Devin CLI",runtime:{flags:["-dv","--devin"],description:"Run as Devin CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--devin",artifactKind:"hook config",probeCommand:["devin","--version"]}},{id:"droid",displayName:"Factory Droid",runtime:{flags:["-fd","--droid"],description:"Run as Factory Droid PreToolUse hook",legacyTopLevelFlags:[]},install:{flag:"--droid",artifactKind:"hook config",probeCommand:["droid","--version"]}},{id:"amp",displayName:"Amp Code",install:{flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],Wo=la.slice().sort((I,q)=>I.displayName.localeCompare(q.displayName,"en")),Or=Wo.map((I)=>I.id).sort((I,q)=>Number(q==="claude-code")-Number(I==="claude-code")),ir=Wo.filter((I)=>("runtime"in I)).map((I)=>({id:I.id,displayName:"displayName"in I.runtime?I.runtime.displayName:I.displayName,flags:I.runtime.flags,legacyFlags:"legacyFlags"in I.runtime?I.runtime.legacyFlags:[],description:I.runtime.description,legacyTopLevelFlags:I.runtime.legacyTopLevelFlags})),Cn=Wo.map((I)=>({id:I.id,...I.install})),qf=Object.fromEntries(la.map((I)=>[I.id,I.displayName]));function ln(I){return qf[I]}var Vf=ir.map((I)=>({flags:I.flags.join(", "),description:I.description})),Kf=ir.flatMap((I)=>I.flags.map((q)=>`cc-safety-net hook ${q}`)),ca={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Vf,{flags:"-h, --help",description:"Show this help"}],examples:Kf};var da={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...Cn.map((I)=>({flags:I.flag,description:`Install ${ln(I.id)} ${I.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...Cn.map((I)=>`cc-safety-net install ${I.flag}`)]},ua={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...Cn.map((I)=>({flags:I.flag,description:`Uninstall ${ln(I.id)} ${I.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...Cn.map((I)=>`cc-safety-net uninstall ${I.flag}`)]},pa={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var fa={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var $r={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var Yo=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],Zo=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],Ht={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"tool add <name...> [--cwd-arg <name>] [--project]",description:"Analyze community shell tools (user scope by default)"},{usage:"tool remove <name...> [--project]",description:"Stop analyzing declared tools"},{usage:"tool list",description:"List declared command tools in both scopes"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},{flags:"--project",description:"Use project-scope rule config with rule tool"},{flags:"--cwd-arg",argument:"<name>",description:"Name the working-directory argument with rule tool add"},...Yo.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk","cc-safety-net rule tool add ops_bash","cc-safety-net rule tool add ops_run_background --cwd-arg cwd --project",...Zo,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var ma={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var ga={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var Dr=[ma,oa,fa,ia,Ht,$r,da,pa,ua,ca,sa,ga];function Jf(I){return I.aliases??[]}function Nr(I){let q=I.toLowerCase();return Dr.find((X)=>X.name.toLowerCase()===q||Jf(X).some((ee)=>ee.toLowerCase()===q))}import{existsSync as Dy}from"node:fs";import{basename as zf}from"node:path";function Lr(I,q=7,X=W(I)){let ee=Date.now()-q*24*60*60*1000,ne=[],te=new Set,le=0,de,be,Se,Ae;if(X)Q(I,X);let De={count:0},Le=X?Kn(X,De):[];for(let Fe of Le)for(let Ge of Ft(Fe,De)){if(Ge.decision==="allow")continue;let Me=new Date(Ge.ts).getTime();if(Me>=ee){if(le++,te.add(Ge.sessionId??zf(Fe,".jsonl")),be===void 0||Me<=be)de=Ge.ts,be=Me;if(Ae===void 0||Me>Ae)Se=Ge.ts,Ae=Me;Wf(ne,Ge,Me)}}let Ne=ne.map((Fe)=>({timestamp:Fe.ts,command:Fe.command,reason:Fe.reason,relativeTime:Ys(new Date(Fe.ts))}));return{totalBlocked:le,sessionCount:te.size,recentEntries:Ne,oldestEntry:de,newestEntry:Se,unreadable:De.count}}function Wf(I,q,X){let ee=I.findIndex((ne)=>X>new Date(ne.ts).getTime());if(ee===-1){if(I.length<3)I.push(q);return}if(I.splice(ee,0,q),I.length>3)I.pop()}import{dirname as am}from"node:path";import{dirname as Yf,join as Zf,resolve as Xf}from"node:path";var Qf="config.json";function hn(I,q,X,ee){x(em(I),`${JSON.stringify(q,null,2)}
`,X,ee)}function em(I){return typeof I==="string"?pe(I):I}function Qo(I){return{errors:he(tm(I),": "," "),ruleNames:new Set(Ye(I).map((q)=>q.toLowerCase()))}}var nm="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",ha="must match pattern (letters, numbers, hyphens, underscores)";function tm(I){if(!ya(I))return[e([],"Config must be an object")];return[...I.version===1?[]:[e(["version"],"must be 1")],...rm(I.rules)]}function rm(I){if(I===void 0)return[];if(!Array.isArray(I))return[e(["rules"],"must be an array")];return[...I.flatMap((q,X)=>ya(q)?om(q,["rules",X]):[e(["rules",X],"must be an object")]),...Ke(I)]}function om(I,q){return[...Xo(I.name,[...q,"name"],"required string",m,nm),...Xo(I.command,[...q,"command"],"required string",P,ha),...I.subcommand===void 0?[]:Xo(I.subcommand,[...q,"subcommand"],"must be a string if provided",P,ha),...im(I.block_args,[...q,"block_args"]),...sm(I.reason,[...q,"reason"]),...I.intent===void 0||Ue(I.intent)?[]:[e([...q,"intent"],je)]]}function Xo(I,q,X,ee,ne){if(typeof I!=="string")return[e(q,X)];return ee.test(I)?[]:[e(q,ne)]}function im(I,q){if(!Array.isArray(I))return[e(q,"required array")];if(I.length===0)return[e(q,"must have at least one element")];return I.flatMap((X,ee)=>{if(typeof X!=="string")return[e([...q,ee],"must be a string")];return X===""?[e([...q,ee],"must not be empty")]:[]})}function sm(I,q){if(typeof I!=="string")return[e(q,"required string")];if(I==="")return[e(q,"must not be empty")];return I.length>M?[e(q,`must be at most ${M} characters`)]:[]}function ya(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}function ei(I){let q=va(I);if(!q.ok)return q.result;return Qo(q.parsed)}function va(I){let q=[],X=new Set;try{let ee=typeof I==="string"?pe(I):I,ne=o(ee);if(ne===null)return q.push(`File not found: ${ee.path}`),{ok:!1,result:{errors:q,ruleNames:X}};if(!ne.trim())return q.push("Config file is empty"),{ok:!1,result:{errors:q,ruleNames:X}};return{ok:!0,parsed:JSON.parse(ne)}}catch(ee){if(ee instanceof i)return q.push(ee.message),{ok:!1,result:{errors:q,ruleNames:X}};let ne=ee instanceof Error?ee.message:String(ee);return q.push(ee instanceof SyntaxError?"Invalid JSON":ne),{ok:!1,result:{errors:q,ruleNames:X}}}}function Ut(I){return Xf(I,".safety-net.json")}function jn(I){let q=va(I);if(!q.ok)return q.result;let X=vt(q.parsed);return{errors:X.errors,ruleNames:X.sources}}function Bt(I,q={}){return Zf(Yf(me(I,q)),Qf)}function ba(I,q,X){let ee;try{if(o(q)===null)return{path:I,exists:!1,valid:!1,ruleCount:0};ee=jn(q),ee.errors.push(...J(I,X))}catch(ne){if(!(ne instanceof i))throw ne;ee={errors:[ne.message],ruleNames:new Set}}return{path:I,exists:!0,valid:ee.errors.length===0,ruleCount:ee.ruleNames.size,...ee.errors.length>0?{errors:ee.errors}:{}}}function lm(I,q){return{source:q,name:I.name,command:I.command,subcommand:I.subcommand,blockArgs:[...I.block_args],reason:I.reason}}function wa(I,q){let X=K(I),ee=D(q),ne=am(X),te=ie(I,{cwd:q,userConfigPath:X,projectConfigPath:ee,userConfigDir:ne}),le=oe(I,{cwd:q,userConfigPath:X,projectConfigPath:ee,userConfigDir:ne}),de=new Map(te.rulebooks.flatMap((be)=>be.rules.map((Se)=>[Se,be.source])));return{userConfig:ba(X,le.userConfigTarget,le.userScope),projectConfig:ba(ee,le.projectConfigTarget,le.projectScope),effectiveRules:te.rules.map((be)=>lm(be,de.get(be.name)??"project"))}}var cm=[{flag:r.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:r.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:r.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:r.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:r.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:r.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:r.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:r.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"},{flag:r.projectTightenOnly,description:"Ignore project policy settings that weaken the user policy",defaultBehavior:"off"}];function ka(I){return[...cm.map((q)=>({name:q.flag.name,value:xe(q.flag,I.env),isSet:At(q.flag,I.env),legacyName:q.flag.legacyName,legacyValue:q.flag.legacyName?I.env.get(q.flag.legacyName):void 0,legacyIsSet:q.flag.legacyName?I.env.get(q.flag.legacyName)!==void 0:void 0,description:q.description,defaultBehavior:q.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:I.env.get("CC_SAFETY_NET_HOME"),isSet:I.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var Ca={error:0,warning:1,info:2},dm=["policy","config","audit"];function um(I){return I.map((q)=>{if(q==="ownership")return"is not owned by the current user";if(q==="permissions")return"has unsafe permissions";if(q==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var pm=[{derive:(I)=>I.hooks.length>0&&I.hooks.every((q)=>!q.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(I)=>I.hooks.filter((q)=>q.inspectionStatus==="failed").map((q)=>{let X=ln(q.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${X} inspection failed`,detail:`Doctor could not verify the ${X} integration configuration.`,fixHint:`Correct the reported ${X} configuration error, then run \`cc-safety-net doctor\` again.`,integration:q.platform}})},{derive:(I)=>I.userConfig.exists&&!I.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:I.userConfig.path}]:[]},{derive:(I)=>I.projectConfig.exists&&!I.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:I.projectConfig.path}]:[]},{derive:(I)=>I.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${I.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(I)=>I.v2Leftovers&&I.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${I.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(I)=>I.legacyConfigs&&I.legacyConfigs.length>0?[{checkId:"config.legacy-ignored",severity:"warning",title:"Legacy inline rule configs are ignored",detail:`CC Safety Net no longer loads these files, so their rules enforce nothing: ${I.legacyConfigs.join(", ")}.`,fixHint:"Run `cc-safety-net rule migrate` to convert them (add `--cleanup` to delete each file once it is converted), then rerun doctor."}]:[]},{derive:(I)=>{let q=I.environment.find((X)=>X.name==="CC_SAFETY_NET_AUDIT_SCOPE");return ft(q?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...dm.map((I)=>({derive:(q)=>q.posture.directories.filter((X)=>X.kind===I&&X.status==="unsafe").map((X)=>({checkId:`posture.${I}-directory-unsafe`,severity:"error",title:`${I[0]?.toUpperCase()}${I.slice(1)} directory is unsafe`,detail:`The ${I} directory ${um(X.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...X.path?{path:X.path}:{}}))})),{derive:(I)=>{let q=[...I.effectiveSafety.weakenedRuleOverrides].sort();return q.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${q.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${q.join(", ")}.`}]:[]}}];function xa(I){return pm.flatMap((q,X)=>q.derive(I).map((ee,ne)=>({finding:ee,catalogOrder:X,occurrence:ne}))).sort((q,X)=>Ca[q.finding.severity]-Ca[X.finding.severity]||q.catalogOrder-X.catalogOrder||q.occurrence-X.occurrence).map((q)=>q.finding)}function In(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var fm=(I)=>In()?`\x1B[32m${I}\x1B[0m`:I,mm=(I)=>In()?`\x1B[33m${I}\x1B[0m`:I,gm=(I)=>In()?`\x1B[34m${I}\x1B[0m`:I,hm=(I)=>In()?`\x1B[36m${I}\x1B[0m`:I,ym=(I)=>In()?`\x1B[31m${I}\x1B[0m`:I,vm=(I)=>In()?`\x1B[2m${I}\x1B[0m`:I,bm=(I)=>In()?`\x1B[1m${I}\x1B[0m`:I,qe={green:fm,yellow:mm,blue:gm,cyan:hm,red:ym,dim:vm,bold:bm},wm="\x1B[0m",km=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function Cm(I){let q=I;return()=>(q=(q*1664525+1013904223)%4294967296,q/4294967296)}function xm(I){let q=[...km],X=Cm(I);for(let ee=q.length-1;ee>0;ee--){let ne=Math.floor(X()*(ee+1)),te=q[ee];q[ee]=q[ne],q[ne]=te}return q}function Pm(I,q=0){if(!In())return"";let X=xm(q);return`\x1B[38;5;${X[I%X.length]}m`}function Pa(I,q,X=0){if(!In())return`"${I}"`;return`${Pm(q,X)}"${I}"${wm}`}function jr(I){return I==="default"?"built-in default":`${I} policy`}var Sm=new RegExp("\x1B\\[[0-9;]*m","g"),ni=(I)=>I.replace(Sm,"").length;function Jn(I){let q=(I.headers??I.rows[0]??[]).map((le,de)=>{let be=Math.max(...I.rows.map((Se)=>ni(Se[de]??"")));return Math.max(ni(le),be)}),X=(le,de)=>le+" ".repeat(Math.max(0,de-ni(le))),ee=(le,de)=>de[0]+q.map((be)=>le.repeat(be+2)).join(de[1])+de[2],ne=(le)=>`│ ${le.map((de,be)=>X(de,q[be]??0)).join(" │ ")} │`,te=I.headers?[`   ${ne(I.headers)}`,`   ${ee("─",["├","┼","┤"])}`]:[];return[`   ${ee("─",["┌","┬","┐"])}`,...te,...I.rows.map((le)=>`   ${ne(le)}`),`   ${ee("─",["└","┴","┘"])}`].join(`
`)}function Sa(I){let q=[];q.push("Hook Integration"),q.push(Rm(I));let X=[],ee=[];for(let ne of I){let te=ln(ne.platform);if(ne.errors&&ne.errors.length>0)for(let le of ne.errors)if(ne.configured)X.push({platform:te,message:le});else ee.push({platform:te,message:le})}for(let ne of X)q.push(`   Warning (${ne.platform}): ${ne.message}`);for(let ne of ee)q.push(qe.red(`   Error (${ne.platform}): ${ne.message}`));return q.join(`
`)}function Rm(I){let q=["Platform","Discovery","Configuration","Inspection"],X=I.map((ee)=>{let ne=ln(ee.platform);if(ee.inspectionStatus==="not-inspected"){let be=qe.dim("Not inspected");return[ne,be,be,be]}let te=ee.detected?qe.green("Detected"):ee.inspectionStatus==="failed"?qe.red("Unknown"):qe.dim("Not detected"),le=ee.configured?qe.green("Configured"):ee.detected?qe.yellow("Not configured"):ee.inspectionStatus==="failed"?qe.red("Unknown"):qe.dim("Not applicable"),de=ee.inspectionStatus==="verified"?qe.green("Verified"):ee.inspectionStatus==="failed"?qe.red("Failed"):qe.dim("Not applicable");return[ne,te,le,de]});return Jn({headers:q,rows:X})}function Ra(I){let X=["Guard Engine Verification",`   Synthetic self-test: ${I.failed>0?qe.red(`${I.passed}/${I.total} FAIL`):qe.green(`${I.passed}/${I.total} passed`)}`],ee=I.results.filter((ne)=>!ne.passed);if(ee.length>0){X.push(""),X.push(qe.red("   Failures:"));for(let ne of ee)X.push(qe.red(`   • ${ne.description}`)),X.push(qe.red(`     expected ${ne.expected}, got ${ne.actual}`))}return X.join(`
`)}function Em(I){if(I.length===0)return"   (no custom rules)";let q=["Source","Name","Command","Block Args"],X=I.map((ee)=>[ee.source,ee.name,ee.subcommand?`${ee.command} ${ee.subcommand}`:ee.command,ee.blockArgs.join(", ")]);return Jn({headers:q,rows:X})}function Ea(I){let q=[];if(q.push("Configuration"),q.push(Tm(I.userConfig,I.projectConfig)),q.push(""),I.effectiveRules.length>0)q.push(`   Effective rules (${I.effectiveRules.length} total):`),q.push(Em(I.effectiveRules));else q.push("   Effective rules: (none - using built-in rules only)");return q.join(`
`)}function Tm(I,q){let X=["Scope","Status"],ee=(te)=>{if(!te.exists)return qe.dim("N/A");if(!te.valid)return qe.red(`Invalid (${te.errors?.[0]??"unknown error"})`);return qe.green("Configured")},ne=[["User",ee(I)],["Project",ee(q)]];return Jn({headers:X,rows:ne})}function Ta(I){let q=[];return q.push("Environment"),q.push(Am(I)),q.join(`
`)}function Aa(I){let q=I.effectiveSafety.policyScopes,X=["Effective Safety",`   Selected preset: ${I.effectiveSafety.selectedPreset}${q?` (${jr(q.levelScope)})`:""}`,`   Effective: ${I.effectiveSafety.level}`],ee=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[ne,te]of ee){let le=I.effectiveSafety.capabilities[ne],de=le.enabled?qe.green("ON"):qe.dim("OFF"),be=le.sources.length>0?` (${le.sources.join(", ")})`:"";X.push(`   ${te}: ${de} via ${le.source}${be}`)}if(q&&q.weakenings.length>0){X.push(`   Project policy deltas${q.weakeningsIgnored?" (ignored)":""}:`);for(let ne of q.weakenings)X.push(`      ${ne}`)}X.push(`   Stored rule customizations: ${I.effectiveSafety.ruleCounts.stored}`),X.push(`   Effective rule customizations: ${I.effectiveSafety.ruleCounts.effective}`);for(let[ne,te]of Object.entries(I.effectiveSafety.ruleOverrides))X.push(`   ${ne}: ${te}`);return X.join(`
`)}function _a(I){let q=["Findings"];if(I.length===0)return q.push("   No findings from inspected doctor facts."),q.join(`
`);for(let X of I){let ee=`[${X.severity.toUpperCase()}] ${X.checkId}: ${fn(X.title)}`,ne=X.severity==="error"?qe.red:X.severity==="warning"?qe.yellow:qe.blue;if(q.push(`   ${ne(ee)}`),q.push(`      ${fn(X.detail)}`),X.path)q.push(`      Path: ${fn(X.path)}`);if(X.fixHint)q.push(`      Fix: ${fn(X.fixHint)}`)}return q.join(`
`)}function Am(I){let q=["Variable","Status","Legacy"],X=I.map((ee)=>{let ne=ee.isSet?qe.green("✓"):qe.dim("✗"),te=ee.legacyName&&ee.legacyIsSet?`${ee.legacyName} ${qe.green("✓")}`:ee.legacyName??"";return[ee.name,ne,te]});return Jn({headers:q,rows:X})}function Ia(I){let q=[];if(I.totalBlocked===0)q.push("Recent Activity"),q.push("   No blocked commands in the last 7 days"),q.push("   Tip: This is normal for new installations");else q.push(`Recent Activity · last 7 days (${I.totalBlocked} blocked / ${I.sessionCount} sessions)`),q.push(_m(I.recentEntries));if(I.unreadable>0)q.push(`   Warning: ${I.unreadable} audit log ${I.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return q.join(`
`)}function _m(I){let q=["Time","Command"],X=I.map((ee)=>{let ne=fn(ee.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),te=ne.length>40?`${ne.slice(0,37)}...`:ne;return[ee.relativeTime,te]});return Jn({headers:q,rows:X})}function Oa(I){let q=[];if(q.push("Update Check"),I.latestVersion===null&&!I.error)return q.push(Fr([["Status",qe.dim("Skipped")],["Installed",I.currentVersion]])),q.join(`
`);if(I.error)return q.push(Fr([["Status",`${qe.yellow("⚠")} Error`],["Installed",I.currentVersion],["Error",qe.dim(I.error)]])),q.join(`
`);if(I.updateAvailable)return q.push(Fr([["Status",`${qe.yellow("⚠")} Update Available`],["Current",I.currentVersion],["Latest",qe.green(I.latestVersion??"")]])),q.push(""),q.push("   Run: bunx cc-safety-net@latest doctor"),q.push("   Or:  npx cc-safety-net@latest doctor"),q.join(`
`);return q.push(Fr([["Status",`${qe.green("✓")} Up to date`],["Version",I.currentVersion]])),q.join(`
`)}function Fr(I){return Jn({rows:I})}function $a(I){let q=[];return q.push("System Info"),q.push(Im(I)),q.join(`
`)}function Im(I){let q=["Component","Version"],X=(te)=>{if(te===null)return qe.dim("not found");return te},ne=[{label:"cc-safety-net",value:I.version},...Or.map((te)=>({label:ln(te),value:I.versions[te]??null})),{label:"Node.js",value:I.nodeVersion},{label:"npm",value:I.npmVersion},{label:"Bun",value:I.bunVersion},{label:"Platform",value:I.platform}].map((te)=>[te.label,X(te.value)]);return Jn({headers:q,rows:ne})}function Da(I){if(I.findings.length===0)return qe.green(`
No findings from inspected doctor facts.`);let q={error:I.findings.filter((te)=>te.severity==="error").length,warning:I.findings.filter((te)=>te.severity==="warning").length,info:I.findings.filter((te)=>te.severity==="info").length},X=["error","warning","info"].filter((te)=>q[te]>0).map((te)=>`${q[te]} ${te}`),ee=I.findings.length===1?"finding":"findings",ne=`
${I.findings.length} ${ee}: ${X.join(", ")}.`;if(q.error>0)return qe.red(ne);if(q.warning>0)return qe.yellow(ne);return qe.blue(ne)}import{lstatSync as Om}from"node:fs";import{dirname as ti}from"node:path";function ri(I,q){try{let X=Om(q);if(X.isSymbolicLink())return{kind:I,path:q,status:"unsafe",issues:["symlink"]};if(!X.isDirectory())return{kind:I,path:q,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:I,path:q,status:"unknown",issues:[]};let ee=[...X.uid!==process.getuid()?["ownership"]:[],...(X.mode&18)!==0?["permissions"]:[]];return{kind:I,path:q,status:ee.length>0?"unsafe":"safe",issues:ee}}catch(X){if(typeof X==="object"&&X!==null&&"code"in X&&X.code==="ENOENT")return{kind:I,path:q,status:"not-applicable",issues:[]};return{kind:I,path:q,status:"unknown",issues:[]}}}function Na(I,q){let X=W(I);return{directories:[ri("policy",ti(ti(q))),ri("config",ti(q)),...X?[ri("audit",X)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as $m}from"node:child_process";import{existsSync as La}from"node:fs";import{delimiter as Dm,extname as Nm,join as Lm}from"node:path";import{stripVTControlCharacters as ja}from"node:util";var Ha="2.6.19",jm=5000,Fm="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function dn(){return Ha}function oi(I,q){let X=I[q];if(X)return X;let ee=Object.keys(I).find((ne)=>ne.toLowerCase()===q.toLowerCase()&&!!I[ne]);return ee?I[ee]:X}function Hm(I){return(oi(I,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((q)=>q.length>0)}function Mm(I,q){let X=Nm(I)?[I]:[...Hm(q).map((ee)=>`${I}${ee}`),I];if(I.includes("/")||I.includes("\\"))return X.find((ee)=>La(ee))??I;return(oi(q,"PATH")??"").split(Dm).flatMap((ee)=>X.map((ne)=>Lm(ee,ne))).find((ee)=>La(ee))??I}function Fa(I){if(!/[\s"&|<>^]/.test(I))return I;return`"${I.replace(/"/g,'""')}"`}function zn(I,q){let[X,...ee]=I,ne=q[Fm]==="win32"?"win32":process.platform;if(!X||ne!=="win32")return{cmd:X??"",args:ee};let te=Mm(X,q);if(!/\.(?:bat|cmd)$/i.test(te))return{cmd:te,args:ee};return{cmd:oi(q,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",Fa(te),...ee.map(Fa)].join(" ")]}}var Gt=async(I,q=jm)=>{let X=await Um(I,{timeoutMs:q});if(X.code!==0)return null;return ja(X.stdout).trim()||ja(X.stderr).trim()||null};function Um(I,q){let[X,...ee]=I;if(!X)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((ne)=>{try{let te=zn([X,...ee],process.env),le=$m(te.cmd,te.args,{stdio:["ignore","pipe","pipe"]}),de=!1,be="",Se="";le.stdout.on("data",(Le)=>{be+=Le.toString()}),le.stderr.on("data",(Le)=>{Se+=Le.toString()});let Ae=(Le)=>{if(de)return;de=!0,clearTimeout(De),ne(Le)},De=setTimeout(()=>{le.kill(),Ae({code:null,stdout:be,stderr:Se})},q.timeoutMs);le.on("close",(Le)=>{Ae({code:Le,stdout:be,stderr:Se})}),le.on("error",()=>{Ae({code:null,stdout:be,stderr:Se})})}catch{ne({code:null,stdout:"",stderr:""})}})}function Hr(I){if(!I)return null;let q=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(I);if(q)return q[1]??null;let X=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(I);if(X)return X[1]??null;return I.split(`
`)[0]?.trim()||null}async function Mr(I,q=Gt,X=process.cwd()){let ee=Promise.all(Cn.map(async(De)=>[De.id,Hr(await q([...De.probeCommand]))])),[ne,te,le,de,be,Se,Ae]=await Promise.all([ee,ee.then(async(De)=>{let Le=De.find(([Ge])=>Ge==="opencode")?.[1];if(!Le?.startsWith("2.")||!I(Le))return null;let Ne=["--param",`location[directory]=${X}`],Fe=["opencode","api","integration.list",...Ne];return await q(Fe,30000),q(["opencode","api","plugin.list",...Ne],30000)}),q(["codex","plugin","list"],30000),q(["amp","plugins","list"],30000),q(["node","--version"]),q(["npm","--version"]),q(["bun","--version"])]);return{version:Ha,versions:Object.fromEntries(ne),codexPluginListOutput:le,ampPluginListOutput:de,openCodePluginListOutput:te,nodeVersion:Hr(be),npmVersion:Hr(Se),bunVersion:Hr(Ae),platform:`${process.platform} ${process.arch}`}}function ii(I,q){if(q==="dev")return!1;let X=I.split(".").map(Number),ee=q.split(".").map(Number),[ne=0,te=0,le=0]=X,[de=0,be=0,Se=0]=ee;if(ne!==de)return ne>de;if(te!==be)return te>be;return le>Se}async function Fn(){let I=dn(),q=new AbortController,X=setTimeout(()=>q.abort(),3000);try{let ee=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:q.signal});if(!ee.ok)return{currentVersion:I,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${ee.status}`};let ne=await ee.json(),te=ii(ne.version,I);return{currentVersion:I,latestVersion:ne.version,updateAvailable:te}}catch(ee){return{currentVersion:I,latestVersion:null,updateAvailable:!1,error:ee instanceof Error?ee.message:"Network error"}}finally{clearTimeout(X)}}import*as Ja from"node:readline";var Ga=(I)=>`\x1B[${I}B`,Bm=(I)=>`\x1B[${I}A`;var Ma=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Gm(I){return new Promise((q)=>setTimeout(q,I))}function qm(I,q,X){if(!X)return q(I);if(X.aborted)return Promise.resolve();return new Promise((ee,ne)=>{let te=()=>X.removeEventListener("abort",le),le=()=>{te(),ee()};X.addEventListener("abort",le,{once:!0}),q(I).then(()=>{te(),ee()},(de)=>{te(),ne(de)})})}function Ur(I){return Math.max(0,Math.min(1,I))}function qt(I){return Math.max(0,Math.min(255,Math.round(I)))}function si(I){return I<=0.0031308?12.92*I:1.055*I**0.4166666666666667-0.055}function Vm(I,q,X){let ee=X*Math.PI/180,ne=q*Math.cos(ee),te=q*Math.sin(ee),le=(I+0.3963377774*ne+0.2158037573*te)**3,de=(I-0.1055613458*ne-0.0638541728*te)**3,be=(I-0.0894841775*ne-1.291485548*te)**3;return{blue:qt(si(Ur(-0.0041960863*le-0.7034186147*de+1.707614701*be))*255),green:qt(si(Ur(-1.2684380046*le+2.6097574011*de-0.3413193965*be))*255),red:qt(si(Ur(4.0767416621*le-3.3077115913*de+0.2309699292*be))*255)}}function ai(I,q){let X=(q*I*180/Math.PI%360+360)%360;return Vm(0.72,0.15,X)}function qa(I,q=0.1){let X=ai(q,I);return`\x1B[38;2;${X.red};${X.green};${X.blue}m`}function Km(I,q){return{blue:qt(I.blue+(255-I.blue)*q),green:qt(I.green+(255-I.green)*q),red:qt(I.red+(255-I.red)*q)}}function Va(I,q,X){let ee=Math.imul(I+2654435769,2246822507)^Math.imul(q+3266489909,668265263)^Math.imul(X+374761393,2654435761),ne=ee^ee>>>15,te=Math.imul(ne,739982445),le=te^te>>>12,de=Math.imul(le,695872825);return((de^de>>>15)>>>0)/4294967296}function Jm(I,q,X){let ee=Math.floor(Va(I,q,X)*Ma.length);return Ma[ee]??"░"}function Ua(I){let q=Ur(I);return q*q*q*(q*(q*6-15)+10)}function zm(I){if(I.length===0)return"";let q=[],X=!1,ee="";for(let ne of I){let te=`${ne.red};${ne.green};${ne.blue}`;if(ne.bold!==X)q.push(ne.bold?"\x1B[1m":"\x1B[22m"),X=ne.bold;if(te!==ee)q.push(`\x1B[38;2;${te}m`),ee=te;q.push(ne.character)}return`${q.join("")}\x1B[22m\x1B[39m`}function Wm(I,q,X,ee,ne){return I.map((te,le)=>({...ai(X,ee+q+le/ne),bold:!1,character:te}))}function Ym(I,q,X,ee,ne,te,le,de){let be=Math.max(1,ee*0.75),Se=Math.min(1,X/be),Ae=ne*Ua(Se),De=Math.max(0,(X-be)/Math.max(1,ee-be)),Le=(1-Ua(X/ee))*de*2,Ne=0.35*Math.max(0,1-De*2),Fe=Se>=1,Ge=Math.min(I.length,Math.ceil(Ae+2+1));return I.slice(0,Ge).map((Me,nn)=>{let Qe=ai(te,le+q+nn/de+Le),rn=nn+Va(q,nn,7919)*2-1;if(rn>Ae+2)return{...Qe,bold:!1,character:" "};let an=Ae-rn,en=0.8*Math.exp(-(an*an)/12.5),on=Math.min(0.9,en+Ne),Pn=!Fe&&rn>Ae-4;return{...Km(Qe,on),bold:on>0.3,character:Pn?Jm(q,nn,X):Me}})}function Ba(I){return`\x1B[?2026h${I.map((q,X)=>`\x1B8${X>0?Ga(X):""}${zm(q)}`).join("")}\x1B[?2026l`}async function li(I,q={}){if(!I)return;let X=q.output??process.stdout,ee=q.sleep??Gm,ne=q.seed??0,te=I.split(`
`).map((Ae)=>Array.from(Ae)),le=Math.max(...te.map((Ae)=>Ae.length)),de=12000*te.filter((Ae)=>Ae.length>0).length/40,be=le>0?Math.max(1,Math.ceil(de/16.666666666666668)):0,Se=be>0?de/be:0;X.write(`\x1B[?25l${te.length>1?`${`
`.repeat(te.length-1)}${Bm(te.length-1)}`:""}\x1B7`);try{for(let Ae=1;Ae<=be;Ae+=1){if(q.signal?.aborted)break;X.write(Ba(te.map((De,Le)=>Ym(De,Le,Ae,be,le,0.1,ne,3)))),await qm(Se,ee,q.signal)}}finally{if(X.write(Ba(te.map((Ae,De)=>Wm(Ae,De,0.1,ne,3)))),X.write("\x1B8"),te.length>1)X.write(Ga(te.length-1));X.write(`
\x1B[0m\x1B[?25h`)}}var Ka=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function Zm(I){return Boolean(I.isTTY)}async function sr(I={}){let q=I.output??process.stdout;if(!Zm(q))return;let X=I.input??process.stdin,ee={output:q,seed:I.seed??Math.random()*8192,sleep:I.sleep};if(!X.isTTY||typeof X.setRawMode!=="function"){await li(Ka,ee);return}let ne=new AbortController,te=X.readableFlowing===!0,le=X.isRaw===!0,de=!1,be=(Se,Ae)=>{if(Ae.ctrl&&Ae.name==="c")de=!0;if(de||Ae.name==="return"||Ae.name==="enter")ne.abort()};Ja.emitKeypressEvents(X),X.on("keypress",be),X.setRawMode(!0),X.resume();try{await li(Ka,{...ee,signal:ne.signal})}finally{if(X.off("keypress",be),X.setRawMode(le),!te)X.pause()}if(!de)return;if(I.onInterrupt){I.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as ng}from"node:crypto";import{existsSync as Wa}from"node:fs";import{dirname as Br,join as Ya}from"node:path";import{dirname as za,join as Xm}from"node:path";var Qm="rule.lock";function eg(I){return Xm(za(I),Qm)}function gn(I,q){let X=q.global?q.userConfigPath??K(I,q):q.projectConfigPath??D(q.cwd??process.cwd()),ee=q.global?ht(I,q):yt(X,q.cwd??process.cwd()),ne=eg(X);return{configDir:za(X),configPath:X,lockPath:ne,filesystemScope:ee,configTarget:s(ee,X),lockTarget:s(ee,ne)}}var tg="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",rg="cache",og="rulebooks";function Za(I,q={}){let X=gn(I,q),ee=s(X.filesystemScope,Qa(X.configDir)),ne=o(X.lockTarget);if(console.log(tg),ne===null&&!Wa(ee.path))return console.log(`No v2 lock or cache leftovers found in ${Br(X.configDir)}; nothing to migrate.`),0;let te=cg(ne),le=f(X.configTarget);if(!le.config&&(o(X.configTarget)!==null||te.size>0))return console.error(`Cannot migrate: the rules config in ${Br(X.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let de=le.config?.rules??[];for(let be of de.flatMap((Se)=>ig(Se,te,X,ee,q.global===!0)))console.log(be);return V(X.lockTarget),Ot(ee),console.log(`Removed the v2 lock and cache under ${Br(X.configDir)}.`),0}function Xa(I,q){return[...new Set([{cwd:q},{cwd:q,global:!0}].flatMap((X)=>{let ee=gn(I,X);return[ee.lockPath,Qa(ee.configDir)]}))].filter((X)=>Wa(X))}function ig(I,q,X,ee,ne){if(!T(I))return[];let te=j(I).name,le=s(X.filesystemScope,U(X.configDir,te)),de=o(le);if(de!==null&&sg(de,te))return[];let be=q.get(I),Se=be?ag(be,te,ee.path,X.filesystemScope):null;if(Se===null)return[`Could not migrate ${I} from the v2 cache. Run \`cc-safety-net rule update ${I}${ne?" --global":""}\` to vendor it.`];if(x(le,Se),de!==null)return[`Restored ${I} from the v2 cache over an invalid file.`];return[`Vendored ${I} from the v2 cache.`]}function sg(I,q){let X=Pe(I);return!("problem"in X)&&X.rulebook.name===q}function ag(I,q,X,ee){let ne=Ya(X,og,`${lg(I)}--${I.digest.replace("sha256:","").slice(0,12)}`,Ce),te=o(s(ee,ne));if(te===null||pg(te)!==I.digest)return null;let le=Pe(te);if("problem"in le||le.rulebook.name!==q)return null;return te}function Qa(I){return Ya(Br(I),rg)}function lg(I){return([I.owner,I.repo,I.display_ref,I.name].every((ee)=>typeof ee==="string"&&ee!=="")?`${I.owner}/${I.repo}#${I.display_ref}/${I.name}`:I.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function cg(I){let q=I===null?null:ug(I),X=el(q)&&Array.isArray(q.rulebooks)?q.rulebooks:[];return new Map(X.filter(dg).map((ee)=>[ee.spec,ee]))}function dg(I){return el(I)&&typeof I.spec==="string"&&typeof I.digest==="string"}function el(I){return!!I&&typeof I==="object"}function ug(I){try{return JSON.parse(I)}catch{return null}}function pg(I){return`sha256:${ng("sha256").update(I).digest("hex")}`}var nl="\r\x1B[2K",fg="\x1B[?25l",mg="\x1B[39m",gg="\x1B[?25h",hg=100,yg=0.55,vg=80,tl=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function bg(I){return new Promise((q)=>setTimeout(q,I))}async function Gr(I,q={}){let X=q.output??process.stdout;if(!X.isTTY)return I;let ee=q.sleep??bg,ne=!1,te=I.then((de)=>(ne=!0,de),(de)=>{throw ne=!0,de});if(await Promise.race([te.then(()=>!0),ee(hg).then(()=>!1)]))return te;X.write(fg);try{for(let de=0;!ne;de+=1)X.write(`${nl}${qa(de*yg)}${tl[de%tl.length]}${mg} ${q.loadingMessage??"Loading…"}`),await Promise.race([te,ee(vg)]);return await te}finally{X.write(`${nl}${gg}`)}}async function ar(I,q,X,ee={}){let ne=q();if(I)await X();if(I&&ne.ready)await Gr(ne.ready,ee);return ne.finish()}import{stripVTControlCharacters as wg}from"node:util";var qr="amp plugins list",kg=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function rl(I){if(!I.ampPluginListOutput)return{platform:"amp",status:"n/a"};let q=wg(I.ampPluginListOutput).split(`
`).map((X)=>kg.exec(X)?.[1]).find((X)=>X!==void 0);if(!q)return{platform:"amp",status:"n/a"};if(q!=="active")return{platform:"amp",status:"disabled",method:qr,configPath:qr,errors:[`Amp personal plugin cc-safety-net is ${q}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:qr,configPath:qr}}import{existsSync as Tg,readFileSync as Ag}from"node:fs";import{isAbsolute as cP,join as Eg}from"node:path";function lr(I){return Eg(I,".gemini","config","hooks.json")}var il=new Map([["run_command","auto"]]),sl="manage_task";var _g=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function Ig(I){if(!I||typeof I!=="object"||Array.isArray(I))return[];return Object.values(I).flatMap((q)=>{if(!q||typeof q!=="object"||Array.isArray(q))return[];let X=q,ee=X.PreToolUse;if(!Array.isArray(ee))return[];return ee.flatMap((ne)=>{if(!ne||typeof ne!=="object"||Array.isArray(ne))return[];let te=ne.hooks;if(!Array.isArray(te))return[];return te.flatMap((le)=>{if(!le||typeof le!=="object"||Array.isArray(le))return[];let de=le.command;if(typeof de!=="string"||!_g.test(de))return[];return[{command:de,enabled:X.enabled!==!1}]})})})}function al(I){let q=lr(I.environment.home);if(!Tg(q))return{platform:"antigravity-cli",status:"n/a",configPath:q};let X;try{X=Ig(JSON.parse(Ag(q,"utf-8")))}catch(ee){return{platform:"antigravity-cli",status:"n/a",configPath:q,errors:[`Failed to parse Antigravity hooks config ${q}: ${ee instanceof Error?ee.message:String(ee)}`]}}if(X.some((ee)=>ee.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:q};if(X.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:q};return{platform:"antigravity-cli",status:"n/a",configPath:q}}import{existsSync as Og}from"node:fs";import{join as On}from"node:path";var zr="cc-safety-net@cc-marketplace";function Wr(I){return I.env.get("CLAUDE_CONFIG_DIR")||On(I.home,".claude")}function ll(I){return On(I.env.get("CLAUDE_CODE_PLUGIN_CACHE_DIR")||On(Wr(I),"plugins"),"installed_plugins.json")}function cl(I,q){let X=n(n(I,"plugins"),q);return Array.isArray(X)&&X.length>0}function Yr(I,q){let X=v(ll(I));return X.kind==="ok"&&cl(X.value,q)}function ui(I){return dl(ll(I),On(Wr(I),"settings.json"))}function dl(I,q){let X=v(I);if(X.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(X.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!cl(X.value,zr))return{platform:"claude-code",status:"n/a"};let ee=v(q);if(ee.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(ee.kind==="ok"&&n(n(ee.value,"enabledPlugins"),zr)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:q,errors:[`${zr} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:I}}function ul(I){let q=On(I.home,".claude"),X=On(q,"plugins","installed_plugins.json");if(dl(X,On(q,"settings.json")).status!=="configured")return;let ee=v(X),ne=ee.kind==="ok"?n(n(ee.value,"plugins"),zr):void 0,te=(Array.isArray(ne)?ne:[]).filter((Se)=>n(Se,"scope")==="user").map((Se)=>n(Se,"installPath")).find((Se)=>typeof Se==="string");if(!te)return;let le=On(te,".cursor-plugin","plugin.json"),de=v(le),be=de.kind==="ok"?n(de.value,"hooks"):void 0;return typeof be==="string"&&Og(On(te,be))?le:void 0}function pl(I){return ui(I.environment)}var fl="Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it.";function ml(I){if(!I.codexPluginListOutput)return{platform:"codex",status:"n/a"};let q=I.codexPluginListOutput.split(`
`).find((X)=>X.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!q)return{platform:"codex",status:"n/a"};if(!q.includes("installed,"))return{platform:"codex",status:"n/a"};if(!q.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex runs only trusted hooks, and doctor cannot check trust. Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."]}}import{existsSync as eo,readdirSync as $g,readFileSync as Dg}from"node:fs";import{join as yn}from"node:path";function mn(I){let q="",X=0,ee=!1,ne=!1,te=-1;while(X<I.length){let le=I[X],de=I[X+1];if(ne){q+=le,ne=!1,X++;continue}if(le==='"'&&!ee){ee=!0,te=-1,q+=le,X++;continue}if(le==='"'&&ee){ee=!1,q+=le,X++;continue}if(le==="\\"&&ee){ne=!0,q+=le,X++;continue}if(ee){q+=le,X++;continue}if(le==="/"&&de==="/"){while(X<I.length&&I[X]!==`
`)X++;continue}if(le==="/"&&de==="*"){X+=2;while(X<I.length-1){if(I[X]==="*"&&I[X+1]==="/"){X+=2;break}X++}continue}if(le===","){te=q.length,q+=le,X++;continue}if(le==="}"||le==="]"){if(te!==-1){let be=q.slice(te+1);if(/^\s*$/.test(be))q=q.slice(0,te)+be}te=-1,q+=le,X++;continue}if(!/\s/.test(le))te=-1;q+=le,X++}return q}function hl(I,q,X){let ee=q+1,ne=!1;while(ee<I.length){if(ne){ne=!1,ee++;continue}if(I[ee]==="\\"){ne=!0,ee++;continue}if(I[ee]==='"')return ee+1;ee++}throw Error(X)}function fi(I,q,X){let ee=I[q],ne=ee==="["?"]":"}",te=0,le=q;while(le<I.length){let de=X.skipComment?.(I,le)??le;if(de!==le){le=de;continue}if(I[le]==='"'){le=hl(I,le,X.stringError);continue}if(I[le]===ee)te++;if(I[le]===ne){if(te--,te===0)return le}le++}throw Error(X.bracketError)}function yl(I,q){let X=I.lastIndexOf(`
`,q)+1;return/^[ \t]*/.exec(I.slice(X))?.[0]??""}function vl(I,q){let X=q.end+(/^\s*/.exec(I.slice(q.end))?.[0].length??0);if(I[X]===","){let le=I[X+1]===`
`?X+2:X+1;return`${I.slice(0,q.start)}${I.slice(le)}`}let ee=I.slice(0,q.start).search(/\s*$/)-1;if(I[ee]!==",")return`${I.slice(0,q.start)}${I.slice(q.end)}`;let ne=I.lastIndexOf(`
`,ee-1),te=ne!==-1&&/^\s*$/.test(I.slice(ne+1,ee))?ne:ee;return`${I.slice(0,te)}${I.slice(q.end)}`}function pi(I,q){if(I.startsWith("//",q)){let X=I.indexOf(`
`,q+2);return X===-1?I.length:X+1}if(I.startsWith("/*",q)){let X=I.indexOf("*/",q+2);return X===-1?I.length:X+2}return q}function gl(I,q){let X=q;while(X<I.length){if(/\s/.test(I[X]??"")){X++;continue}let ee=pi(I,X);if(ee===X)return X;X=ee}return X}function bl(I,q,X){let ee=0,ne=0;while(ne<I.length){let te=pi(I,ne);if(te!==ne){ne=te;continue}if(I[ne]==='"'){let le=hl(I,ne,X.stringError);if(ee===1&&JSON.parse(I.slice(ne,le))===q){let de=gl(I,le),be=gl(I,de+1);if(I[de]===":"&&I[be]==="[")return{start:be,end:fi(I,be,{skipComment:pi,...X})}}ne=le;continue}if(I[ne]==="{"||I[ne]==="[")ee++;if(I[ne]==="}"||I[ne]==="]")ee--;ne++}return}var Rn="cc-safety-net@cc-marketplace",Zr=["cc-marketplace","cc-safety-net"],wl=["_direct","copilot-safety-net"],kl=["cc-marketplace","safety-net"],Cl="safety-net@cc-marketplace";function Xr(I,q){let X=q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${X}([^a-z0-9-]|$)`,"m").test(I??"")}function xl(I){return Xr(I,"cc-safety-net@cc-marketplace")}function Pl(I){return Xr(I,"cc-marketplace")}function Sl(I){return Xr(I,"copilot-safety-net")}function Rl(I){return Xr(I,"safety-net@cc-marketplace")}function Qr(I){if(!I?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(I)}function Tl(I,q){if(!I)return null;let X=I.match(/(\d+)\.(\d+)\.(\d+)/);if(!X)return null;let ee=[Number(X[1]),Number(X[2]),Number(X[3])];for(let ne=0;ne<q.length;ne++){let te=ee[ne]??0,le=q[ne]??0;if(te!==le)return te>le}return!0}function Ng(I){return Tl(I,[0,0,422])}function Lg(I){return Tl(I,[1,0,8])}function ur(I){return I.env.get("COPILOT_HOME")||yn(I.home,".copilot")}function Al(I){return I.disableAllHooks!==!0&&_l(I)}function _l(I){return(I.hooks?.preToolUse??[]).some((X)=>{if(X.type!==void 0&&X.type!=="command")return!1;return Qr(X.command)||Qr(X.bash)||Qr(X.powershell)||Qr(X.exec&&[X.exec,...X.args??[]].join(" "))})}function cr(I){return I===void 0||typeof I==="string"}function jg(I){return I===void 0||Array.isArray(I)&&I.every((q)=>typeof q==="string")}function Fg(I){if(!I||typeof I!=="object"||Array.isArray(I))return!1;let q=I;if(q.disableAllHooks!==void 0&&typeof q.disableAllHooks!=="boolean")return!1;if(q.hooks===void 0)return!0;if(!q.hooks||typeof q.hooks!=="object"||Array.isArray(q.hooks))return!1;let X=q.hooks.preToolUse;if(X===void 0)return!0;return Array.isArray(X)&&X.every((ee)=>ee!==null&&typeof ee==="object"&&!Array.isArray(ee)&&cr(ee.type)&&cr(ee.command)&&cr(ee.bash)&&cr(ee.powershell)&&cr(ee.exec)&&jg(ee.args))}function mi(I,q){try{let X=JSON.parse(mn(Dg(I,"utf-8")));if(!Fg(X)){q?.push(`Invalid hook config ${I}: hooks.preToolUse must be an array of hook objects`);return}return X}catch(X){q?.push(`Failed to parse ${I}: ${X instanceof Error?X.message:String(X)}`);return}}function Il(I,q){try{return $g(I).filter((X)=>X.endsWith(".json")).sort((X,ee)=>X.localeCompare(ee))}catch(X){return q?.push(`Failed to read ${I}: ${X instanceof Error?X.message:String(X)}`),[]}}function Hg(I,q){if(!eo(I))return[];let X=[];for(let ee of Il(I,q)){let ne=yn(I,ee),te=mi(ne,q);if(te&&Al(te))X.push(ne)}return X}function dr(I,q){if(!eo(I))return;let X=mi(I,q);if(!X)return;return{path:I,config:X}}function El(I,q,X,ee){if(q){I.push(`GitHub Copilot CLI ${q} does not support ${X}; requires ${ee}+`);return}I.push(`GitHub Copilot CLI version unavailable; skipping ${X} because it requires ${ee}+`)}function Mg(I){for(let q of I){if(q?.config.disableAllHooks===!0)return q.path;if(q?.config.disableAllHooks===!1)return}return}function Ug(I,q,X,ee){let ne=ur(I),te=yn(q,".github","hooks"),le=yn(ne,"hooks"),de=yn(q,".github","copilot"),be=yn(q,".claude"),Se=Lg(X),Ae=Se===!0?ee:void 0,De=[dr(yn(de,"settings.local.json"),Ae),dr(yn(de,"settings.json"),Ae),dr(yn(be,"settings.local.json"),Ae),dr(yn(be,"settings.json"),Ae)],Le=dr(yn(ne,"settings.json"),Ae),Ne=[Le?.config.disableAllHooks===!0?void 0:Le];if(Se!==!1){let en=Mg(De);if(en){if(Se===null)ee.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${en} as active`);return{activeConfigPaths:[],repoInlineSources:De,disabledBy:en}}}let Fe=Hg(te,ee),Ge=Ng(X),Me=Ge===!0?ee:void 0,nn=eo(le)?Il(le,Me):[],Qe=[];for(let en of nn){let on=yn(le,en),Pn=mi(on,Me);if(Pn&&Al(Pn))Qe.push(on)}if(Ge!==!0&&Qe.length>0)El(ee,X,`user hook files in ${le}`,"0.0.422"),Qe.length=0;let rn=[];for(let en of[...De,...Ne]){if(!en)continue;if(!_l(en.config))continue;if(Se===!0){rn.push(en);continue}El(ee,X,"inline hook definitions in Copilot config files","1.0.8");break}let an=(en)=>en.filter((on)=>!!on&&rn.includes(on)).map((on)=>on.path);return{activeConfigPaths:[...an(De),...Fe,...an(Ne),...Qe],repoInlineSources:De}}function Ol(I){let q=[],X=Ug(I.environment,I.cwd,I.copilotCliVersion,q);if(X.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:X.disabledBy,configPaths:[X.disabledBy],errors:q.length>0?q:void 0};let ee=ur(I.environment),ne=yn(ee,"installed-plugins",...Zr),te=eo(ne),le=yn(ee,"settings.json"),de=v(le,mn),be=(Ne)=>n(n(Ne,"enabledPlugins"),Rn),Se=X.repoInlineSources.find((Ne)=>typeof be(Ne?.config)==="boolean"),Ae=Se??(de.kind==="ok"?{path:le,config:de.value}:void 0);if(te&&!Se&&de.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};let De=te&&Ae!==void 0&&be(Ae.config)===!1;if(De&&X.activeConfigPaths.length===0)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:Ae.path,errors:[`${Rn} is installed but not enabled in Copilot CLI`]};let Le=te&&!De;if(Le||X.activeConfigPaths.length>0){let Ne=X.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:Le?"plugin config":"hook config",configPath:Ne??(Le?ne:void 0),configPaths:X.activeConfigPaths.length>0?X.activeConfigPaths:void 0,errors:q.length>0?q:void 0}}return{platform:"copilot-cli",status:"n/a",errors:q.length>0?q:void 0}}import{existsSync as Ci,readdirSync as nh,readFileSync as th}from"node:fs";import{join as ki}from"node:path";import{existsSync as bi,mkdirSync as zg,readFileSync as Wg,rmSync as Yg}from"node:fs";import{dirname as Zg,join as no}from"node:path";import{existsSync as Bg,renameSync as Gg,statSync as qg,writeFileSync as Vg}from"node:fs";function sn(I,q){let X=`${I}.${process.pid}.tmp`;Vg(X,q,Bg(I)?{mode:qg(I).mode&511}:{}),Gg(X,I)}import{spawn as Kg}from"node:child_process";function Jg(I){return I.join(" ")}function gi(I,q,X){return[`Failed to run ${Jg(I)}${q===null?"":` (exit ${q})`}.`,X.trim()].filter(Boolean).join(`
`)}function hi(I){let q={stdout:"",stderr:""};return I.stdout.setEncoding("utf-8"),I.stderr.setEncoding("utf-8"),I.stdout.on("data",(X)=>{q.stdout+=X}),I.stderr.on("data",(X)=>{q.stderr+=X}),q}function un(I,q){return new Promise((X,ee)=>{let ne=zn([...I],process.env),te=Kg(ne.cmd,ne.args,{stdio:["ignore","pipe","pipe"]}),le=hi(te),de=()=>[le.stdout,le.stderr].filter(Boolean).join(`
`),be=q?.timeoutMs??120000,Se=setTimeout(()=>{te.kill(),ee(Error(gi(I,null,`Timed out after ${be}ms.
${de()}`.trim())))},be);te.on("error",(Ae)=>{clearTimeout(Se),ee(Error(gi(I,null,`${Ae.message}
${de()}`.trim())))}),te.on("close",(Ae)=>{if(clearTimeout(Se),Ae!==0){ee(Error(gi(I,Ae,de())));return}X(q?.stdoutOnly?le.stdout:de())})})}async function yi(I){for(let q of I)await un(q)}async function $l(I){for(let q of I)try{await un(q)}catch(X){console.warn(X instanceof Error?X.message:String(X))}}var vn=Object.fromEntries(ir.map((I)=>[I.id,`npx -y cc-safety-net hook ${I.flags[1]}`]));var fr=vn.cursor,Dl=30;function ro(I){return no(I.home,".cursor","hooks.json")}var pr="cc-safety-net";function wi(I){let q=no(I.home,".cursor","plugins");return{cache:no(q,"cache",pr),marketplaceClone:no(q,"marketplaces","github.com","kenryu42","cc-safety-net")}}async function Nl(I){let q=Object.values(wi(I));if(!q.some((ee)=>bi(ee)))return;let X="No marketplace matches";return await un(["cursor-agent","plugin","marketplace","remove",pr]).catch((ee)=>{if(!(ee instanceof Error&&ee.message.includes(X)))throw ee}),q.forEach((ee)=>Yg(ee,{recursive:!0,force:!0})),[`Removed the ${pr} marketplace from your Cursor account.`,"If /plugins in cursor-agent still lists CC Safety Net as installed, uninstall it there."].join(`
`)}function Yn(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function vi(){return{command:fr,timeout:Dl,failClosed:!0}}function to(I){return Yn(I)&&I.command===fr}function Xg(I){return Object.keys(I).length===3&&I.command===fr&&I.timeout===Dl&&I.failClosed===!0}function Qg(I){try{return JSON.parse(Wg(I,"utf-8"))}catch(q){if(q instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${I}: ${q.message}`);throw q}}function Ll(I){let q=Qg(I);if(!Yn(q))throw Error(`Cursor hooks config ${I} must be a JSON object`);if(q.version!==1)throw Error(`Cursor hooks config ${I} must set "version": 1`);if(q.hooks!==void 0&&!Yn(q.hooks))throw Error(`Cursor hooks config ${I} "hooks" must be an object`);let X=Yn(q.hooks)?q.hooks.preToolUse:void 0;if(X!==void 0&&!Array.isArray(X))throw Error(`Cursor hooks config ${I} "hooks.preToolUse" must be an array`);return q}function jl(I){let q=Yn(I.hooks)?I.hooks.preToolUse:void 0;return Array.isArray(q)?q:[]}function eh(I){if(!I.some(to))return[...I,vi()];return I.reduce((q,X)=>{if(!to(X))return q.result.push(X),q;if(!q.inserted)q.result.push(vi()),q.inserted=!0;return q},{result:[],inserted:!1}).result}function Fl(I,q,X){let ee=Yn(q.hooks)?q.hooks:{},ne={...q,hooks:{...ee,preToolUse:X}};sn(I,`${JSON.stringify(ne,null,2)}
`)}function Hl(I){let q=ro(I);if(!bi(q))return zg(Zg(q),{recursive:!0}),sn(q,`${JSON.stringify({version:1,hooks:{preToolUse:[vi()]}},null,2)}
`),{path:q,alreadyInstalled:!1};let X=Ll(q),ee=jl(X),ne=ee.filter(to);if(Yn(X.hooks)&&Array.isArray(X.hooks.preToolUse)&&ne.length===1&&ne[0]!==void 0&&Xg(ne[0]))return{path:q,alreadyInstalled:!0};return Fl(q,X,eh(ee)),{path:q,alreadyInstalled:!1}}function Ml(I){let q=ro(I);if(!bi(q))return{path:q,alreadyInstalled:!1};let X=Ll(q),ee=jl(X),ne=ee.filter((te)=>!to(te));if(ne.length===ee.length)return{path:q,alreadyInstalled:!1};return Fl(q,X,ne),{path:q,alreadyInstalled:!0}}function rh(I){if(!I||typeof I!=="object"||Array.isArray(I))return[];let q=I.hooks;if(!q||typeof q!=="object"||Array.isArray(q))return[];let X=q.preToolUse;if(!Array.isArray(X))return[];return X.filter((ee)=>!!ee&&typeof ee==="object"&&!Array.isArray(ee)&&ee.command===fr)}function oh(I){let q=[];if(I.length>1)q.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let X=I[0];if(X&&X.failClosed!==!0)q.push('Managed hook is missing "failClosed": true; reinstall to repair');if(X&&X.timeout!==30)q.push('Managed hook "timeout" is not 30; reinstall to repair');return q}var oo="Claude Code plugin",xi="Cursor plugin";function ih(I){let q=ki(wi(I).cache,pr);if(!Ci(q))return{};try{return{version:nh(q).map((X)=>ki(q,X)).find((X)=>Ci(ki(X,".cache-complete")))}}catch{return{unreadable:q}}}function sh(I,q){if(q){let ne=["Cursor records enabled plugins on your Cursor account, which doctor cannot check, and keeps a plugin's files after it is uninstalled.","Cursor pins marketplace plugins to the commit they were added at, so `cc-safety-net update` cannot update this plugin, while the npx hook (`cc-safety-net install --cursor`) stays current."].join(" ");return{method:xi,configPath:q,duplicate:`The Cursor plugin also runs this check, so every tool call is checked twice. ${ne} If the plugin is installed, run \`cc-safety-net uninstall --cursor\`, uninstall CC Safety Net from /plugins in cursor-agent, then run \`cc-safety-net install --cursor\`.`,alone:`${ne} If /plugins in cursor-agent does not list CC Safety Net as installed, run \`cc-safety-net install --cursor\`.`}}let X=ul(I);if(!X)return;let ee="Cursor runs the Claude Code plugin only while it imports Claude Code plugins, which doctor cannot check.";return{method:oo,configPath:X,duplicate:`The Claude Code plugin also runs this check in Cursor, so every tool call is checked twice. ${ee} If Cursor runs it, run \`cc-safety-net uninstall --cursor\` to remove this hook.`,alone:`${ee} If it stops, run \`cc-safety-net install --cursor\`.`}}function Ul(I){let q=ah(I),X=ih(I.environment);if(X.unreadable)return q.status==="configured"?{...q,errors:[...q.errors??[],`Cannot read ${X.unreadable}, so doctor cannot tell whether the Cursor plugin also runs this check.`]}:{platform:"cursor",status:"not-inspected"};let ee=sh(I.environment,X.version);if(!ee)return q;if(q.status==="configured")return{...q,errors:[...q.errors??[],ee.duplicate]};return{platform:"cursor",status:"configured",method:ee.method,configPath:ee.configPath,errors:[...q.errors??[],ee.alone]}}function ah(I){let q=ro(I.environment);if(!Ci(q))return{platform:"cursor",status:"n/a",configPath:q};let X;try{X=JSON.parse(th(q,"utf-8"))}catch(te){return{platform:"cursor",status:"n/a",configPath:q,errors:[`Failed to parse Cursor hooks config ${q}: ${te instanceof Error?te.message:String(te)}`]}}let ee=rh(X);if(ee.length===0)return{platform:"cursor",status:"n/a",configPath:q};let ne=oh(ee);return{platform:"cursor",status:"configured",method:"hook config",configPath:q,errors:ne.length>0?ne:void 0}}import{existsSync as fh}from"node:fs";import{existsSync as ql,mkdirSync as lh,readFileSync as ch}from"node:fs";import{dirname as dh,join as Ri}from"node:path";function Pi(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function Si(I,q){return Pi(I)&&I.command===q}function Bl(I,q){return Pi(I)&&Array.isArray(I.hooks)&&I.hooks.some((X)=>Si(X,q))}function Zn(I,q){return{hooks:[{type:"command",command:I,timeout:q}]}}function $n(I,q){return I.flatMap((X)=>{if(!Pi(X)||!Array.isArray(X.hooks))return[X];let ee=X.hooks.filter((ne)=>!Si(ne,q));if(ee.length===X.hooks.length)return[X];return ee.length===0?[]:[{...X,hooks:ee}]})}function Vt(I,q,X){let ee=I.filter((ne)=>Bl(ne,q));return ee.length===1&&JSON.stringify(ee[0])===JSON.stringify(Zn(q,X))}function Kt(I,q){return I.find((X)=>Bl(X,q))}function Jt(I,q,X){let ee=Array.isArray(I.hooks)?I.hooks.find((ne)=>Si(ne,q)):void 0;return[...I.matcher===void 0||I.matcher===""||I.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...ee?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...ee?.timeout===X?[]:[`Managed hook "timeout" is not ${X}; reinstall to repair`]]}var Xn=vn.devin,io=30,uh={config:{},hooks:{},preToolUse:[]};function so(I,q=process.platform){let X=q==="win32"?I.env.get("APPDATA")||Ri(I.home,"AppData","Roaming"):I.env.get("XDG_CONFIG_HOME")||Ri(I.home,".config");return Ri(X,"devin","config.json")}function Gl(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function ph(I){try{return{ok:!0,value:JSON.parse(mn(ch(I,"utf-8")))}}catch(q){return{ok:!1,message:q instanceof Error?q.message:String(q)}}}function Ei(I){let q=ph(I);if(!q.ok)return`Failed to parse Devin CLI config ${I}: ${q.message}`;let X=q.value;if(!Gl(X))return`Devin CLI config ${I} must be a JSON object`;let ee=X.hooks===void 0?{}:X.hooks;if(!Gl(ee))return`Devin CLI config ${I} "hooks" must be an object`;let ne=ee.PreToolUse===void 0?[]:ee.PreToolUse;if(!Array.isArray(ne))return`Devin CLI config ${I} "hooks.PreToolUse" must be an array`;return{config:X,hooks:ee,preToolUse:ne}}function Vl(I){let q=Ei(I);if(typeof q==="string")throw Error(q);return q}function Kl(I,q,X){let ee={...q.config,hooks:{...q.hooks,PreToolUse:X}};sn(I,`${JSON.stringify(ee,null,2)}
`)}function Jl(I){let q=so(I),X=ql(q)?Vl(q):uh;if(Vt(X.preToolUse,Xn,io))return{path:q,alreadyInstalled:!0};return lh(dh(q),{recursive:!0}),Kl(q,X,[...$n(X.preToolUse,Xn),Zn(Xn,io)]),{path:q,alreadyInstalled:!1}}function zl(I){let q=so(I);if(!ql(q))return{path:q,alreadyInstalled:!1};let X=Vl(q),ee=$n(X.preToolUse,Xn);if(JSON.stringify(ee)===JSON.stringify(X.preToolUse))return{path:q,alreadyInstalled:!1};return Kl(q,X,ee),{path:q,alreadyInstalled:!0}}function Wl(I){let q=so(I.environment);if(!fh(q))return{platform:"devin",status:"n/a",configPath:q};let X=Ei(q);if(typeof X==="string")return{platform:"devin",status:"n/a",configPath:q,errors:[X]};let ee=Kt(X.preToolUse,Xn);if(!ee)return{platform:"devin",status:"n/a",configPath:q};let ne=Jt(ee,Xn,io);return{platform:"devin",status:"configured",method:"hook config",configPath:q,errors:ne.length>0?ne:void 0}}import{existsSync as wh,readFileSync as kh}from"node:fs";import{existsSync as zt,mkdirSync as mh,readFileSync as gh,rmSync as hh}from"node:fs";import{dirname as yh,join as Ai}from"node:path";var Qn=vn.droid,ao=30;function lo(I){return Ai(I.home,".factory","hooks.json")}function Yl(I){return Ai(I.home,".factory","settings.json")}function Zl(I){return Ai(I.home,".factory","hooks","hooks.json")}function Ti(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function Xl(I){try{return JSON.parse(mn(gh(I,"utf-8")))}catch(q){if(q instanceof SyntaxError)throw Error(`Failed to parse Factory Droid hooks config ${I}: ${q.message}`);throw q}}function _i(I){let q=Xl(I);if(!Ti(q))throw Error(`Factory Droid hooks config ${I} must be a JSON object`);if(q.PreToolUse===void 0||Array.isArray(q.PreToolUse))return q;throw Error(`Factory Droid hooks config ${I} "PreToolUse" must be an array`)}function vh(I){if(!zt(I))return{};let q=Xl(I);return Ti(q)&&Ti(q.hooks)&&q.hooks.PreToolUse!==void 0?{PreToolUse:q.hooks.PreToolUse}:{}}function bh(I){let q=Zl(I);return{...vh(Yl(I)),...zt(q)?_i(q):{}}}function Ql(I){return Array.isArray(I.PreToolUse)?I.PreToolUse:[]}function ec(I,q,X){sn(I,`${JSON.stringify({...q,PreToolUse:X},null,2)}
`)}function nc(I){let q=lo(I),X=zt(q),ee=X?_i(q):bh(I),ne=Ql(ee);if(X&&Vt(ne,Qn,ao))return{path:q,alreadyInstalled:!0};return mh(yh(q),{recursive:!0}),ec(q,ee,[...$n(ne,Qn),Zn(Qn,ao)]),{path:q,alreadyInstalled:!1}}function tc(I){let q=lo(I);if(!zt(q))return{path:q,alreadyInstalled:!1};let X=_i(q),ee=Ql(X),ne=$n(ee,Qn);if(JSON.stringify(ne)===JSON.stringify(ee))return{path:q,alreadyInstalled:!1};let te=zt(Yl(I))||zt(Zl(I));if(ne.length===0&&Object.keys(X).length===1&&!te)return hh(q),{path:q,alreadyInstalled:!0};return ec(q,X,ne),{path:q,alreadyInstalled:!0}}function rc(I){let q=lo(I.environment);if(!wh(q))return{platform:"droid",status:"n/a",configPath:q};let X;try{X=JSON.parse(mn(kh(q,"utf-8")))}catch(le){return{platform:"droid",status:"n/a",configPath:q,errors:[`Failed to parse Factory Droid hooks config ${q}: ${le instanceof Error?le.message:String(le)}`]}}let ee=typeof X==="object"&&X!==null&&"PreToolUse"in X?X.PreToolUse:void 0,ne=Kt(Array.isArray(ee)?ee:[],Qn);if(!ne)return{platform:"droid",status:"n/a",configPath:q};let te=[...ne.commandRegex===void 0||ne.commandRegex===""?[]:['Managed hook has a "commandRegex" that narrows coverage; reinstall to repair'],...Jt(ne,Qn,ao)];return{platform:"droid",status:"configured",method:"hook config",configPath:q,errors:te.length>0?te:void 0}}import{existsSync as Ch}from"node:fs";import{join as Ii}from"node:path";var Oi="gemini-safety-net";function $i(I){let q=Ii(I.home,".gemini","extensions"),X=Ii(q,Oi);if(!Ch(X))return{platform:"gemini-cli",status:"n/a"};let ee=Ii(q,"extension-enablement.json"),ne=v(ee);if(ne.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let te=ne.kind==="ok"?n(n(ne.value,Oi),"overrides"):void 0;if(Array.isArray(te)&&te.some((de)=>typeof de==="string"&&de.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:ee,errors:[`${Oi} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:X}}function oc(I){return $i(I.environment)}import{existsSync as Rh,readFileSync as fc,statSync as Eh}from"node:fs";import{dirname as pc,join as Th}from"node:path";import{existsSync as sc,mkdirSync as xh,readFileSync as ac,rmSync as Ph}from"node:fs";import{dirname as Sh,join as ic}from"node:path";var Hn=vn["grok-build"],uo=30,Di=Zn(Hn,uo);function po(I){return ic(I.env.get("GROK_HOME")??ic(I.home,".grok"),"hooks","cc-safety-net.json")}function fo(I){return typeof I==="object"&&I!==null&&!Array.isArray(I)}function lc(I){try{let q=JSON.parse(I);return fo(q)?q:null}catch{return null}}function cc(I){let q=fo(I.hooks)?I.hooks.PreToolUse:void 0;return Array.isArray(q)?q:[]}function co(I,q,X){let ee=fo(q.hooks)?q.hooks:{};sn(I,`${JSON.stringify({...q,hooks:{...ee,PreToolUse:X}},null,2)}
`)}function dc(I){let q=po(I);if(!sc(q))return xh(Sh(q),{recursive:!0}),co(q,{},[Di]),{path:q,alreadyInstalled:!1};let X=lc(ac(q,"utf-8"));if(!X)return co(q,{},[Di]),{path:q,alreadyInstalled:!1};let ee=cc(X);if(Vt(ee,Hn,uo))return{path:q,alreadyInstalled:!0};return co(q,X,[...$n(ee,Hn),Di]),{path:q,alreadyInstalled:!1}}function uc(I){let q=po(I);if(!sc(q))return{path:q,alreadyInstalled:!1};let X=lc(ac(q,"utf-8"));if(!X)return{path:q,alreadyInstalled:!1};let ee=cc(X),ne=$n(ee,Hn);if(JSON.stringify(ne)===JSON.stringify(ee))return{path:q,alreadyInstalled:!1};let te=fo(X.hooks)?X.hooks:{};if(ne.length===0&&Object.keys(X).length===1&&Object.keys(te).length===1)return Ph(q),{path:q,alreadyInstalled:!0};return co(q,X,ne),{path:q,alreadyInstalled:!0}}function Ni(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}function Ah(I){try{return Eh(I,{throwIfNoEntry:!1})?.isFile()===!0?fc(I,"utf-8"):""}catch{return}}function mc(I){let q=po(I.environment);if(!Rh(q))return{platform:"grok-build",status:"n/a",configPath:q};let X;try{X=JSON.parse(fc(q,"utf-8"))}catch(De){return{platform:"grok-build",status:"n/a",configPath:q,errors:[`Failed to parse Grok Build hooks config ${q}: ${De instanceof Error?De.message:String(De)}`]}}let ee=Ni(X)&&Ni(X.hooks)&&Array.isArray(X.hooks.PreToolUse)?X.hooks.PreToolUse:[],ne=Kt(ee,Hn);if(!ne)return{platform:"grok-build",status:"n/a",configPath:q};let te=Array.isArray(ne.hooks)?ne.hooks.findIndex((De)=>Ni(De)&&De.command===Hn):-1,le=`global/cc-safety-net:pre_tool_use[${ee.indexOf(ne)}].hooks[${te}]`,de=Th(pc(pc(q)),"disabled-hooks"),be=Ah(de),Se=be?.split(`
`).some((De)=>De.trim()===le)===!0,Ae=[...be===void 0?[`Cannot read ${de}, so doctor cannot tell whether Grok Build skips the hook`]:[],...Se?[`Grok Build skips the hook: ${le} is listed in ${de}; enable it in /hooks`]:[],...Jt(ne,Hn,uo)];return{platform:"grok-build",status:Se?"disabled":"configured",method:"hook config",configPath:q,errors:Ae.length>0?Ae:void 0}}import{readFileSync as xc}from"node:fs";import{join as Pc}from"node:path";var kn="cc-safety-net",Li="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",_h=30;function gc(I){return`${Li}
# version: ${I}
`}function Ih(I){return`${gc(I)}name: ${kn}
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
ANALYZER = [${vn["hermes-agent"].split(" ").map((q)=>`"${q}"`).join(", ")}]
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
`}function mr(I){return[{name:"__init__.py",content:Oh(I)},{name:"plugin.yaml",content:Ih(I)}]}import{mkdirSync as $h,readdirSync as Dh,readFileSync as hc,rmSync as ji}from"node:fs";import{basename as Nh,dirname as Lh,join as Dn}from"node:path";var jh="__pycache__",Fh=/^[a-z0-9][a-z0-9_-]{0,63}$/;function Hh(I){try{return hc(I,"utf-8").trim()}catch{return}}function Fi(I){let q=I.env.get("HERMES_HOME")?.trim();if(q&&Nh(Lh(q))==="profiles")return q;let X=q||Dn(I.home,".hermes"),ee=Dn(X,"active_profile"),ne=Hh(ee),te=ne?.toLowerCase();if(!te||te==="default")return X;if(!Fh.test(te))throw Error(`Invalid Hermes profile name "${ne}" in ${ee}; run \`hermes profile use <name>\` with a valid profile.`);return Dn(X,"profiles",te)}function Hi(I){return Dn(Fi(I),"plugins",kn)}function Mi(I){return I.startsWith(Li)}function Ui(I,q){let X=Hi(I),ee=u(X);if(ee&&(ee.isSymbolicLink()||!ee.isDirectory()))throw Error(`Refusing to ${q} ${X}: not a regular directory. Move or remove it and rerun ${q==="install"?"install":"uninstall"} --hermes-agent.`);return X}function yc(I,q){let X=u(I);if(!X)return;if(X.isSymbolicLink()||!X.isFile())throw Error(`Refusing to ${q} ${I}: not a regular file. Move or remove it.`);let ee=hc(I,"utf-8");if(!Mi(ee))throw Error(`Refusing to ${q} unmanaged file at ${I}. Move or remove it.`);return ee}function vc(I){let q=Ui(I,"install"),X=mr(dn());if(X.map((ne)=>yc(Dn(q,ne.name),"overwrite")).every((ne,te)=>ne===X[te]?.content))return{path:q,alreadyInstalled:!0};return $h(q,{recursive:!0}),X.forEach((ne)=>{sn(Dn(q,ne.name),ne.content)}),{path:q,alreadyInstalled:!1}}function Bi(I){let q=Ui(I,"remove");if(!u(q))return[];return mr(dn()).filter((X)=>yc(Dn(q,X.name),"remove")!==void 0)}function bc(I){let q=Ui(I,"remove");if(!u(q))return{path:q,alreadyInstalled:!1};let X=Bi(I);if(X.forEach((ee)=>{ji(Dn(q,ee.name))}),ji(Dn(q,jh),{recursive:!0,force:!0}),Dh(q).length===0)ji(q,{recursive:!0});return{path:q,alreadyInstalled:X.length>0}}var gr="hermes-agent",wc=/^([^\s#][^:]*):/,Mh=/^\s+([A-Za-z_][\w-]*):/,kc=/^\s+-\s*(.*)$/;function Uh(I){return I.trim().replace(/^(["'])(.*)\1$/,"$2")}function Bh(I){let q=I.split(/\r?\n/),X=q.findIndex((te)=>wc.exec(te)?.[1]?.trim()==="plugins");if(X===-1)return[];let ee=q.slice(X+1),ne=ee.findIndex((te)=>wc.test(te));return ne===-1?ee:ee.slice(0,ne)}function Cc(I,q){let X=Bh(I),ee=X.findIndex((le)=>Mh.exec(le)?.[1]===q);if(ee===-1)return[];let ne=X.slice(ee+1),te=ne.findIndex((le)=>!kc.test(le));return(te===-1?ne:ne.slice(0,te)).map((le)=>Uh(kc.exec(le)?.[1]??""))}function Gh(I){try{return xc(Pc(Fi(I),"config.yaml"),"utf-8")}catch{return}}function Gi(I){let q=Gh(I)??"";return Cc(q,"enabled").includes(kn)&&!Cc(q,"disabled").includes(kn)}function Sc(I){return/^# version:\s*(.+)$/m.exec(I)?.[1]?.trim()}function qh(I,q){let X=u(I);if(!X)return{error:`${q.name} is missing from ${I}; run install --hermes-agent`};if(X.isSymbolicLink()||!X.isFile())return{error:`${I} is a symlink or not a regular file; move or remove it`};try{let ee=xc(I,"utf-8");if(!Mi(ee))return{error:`Unmanaged ${q.name} occupies ${I}; move or remove it`};if(Sc(ee)===dn()&&ee!==q.content)return{error:`Modified ${q.name} occupies ${I}; run install --hermes-agent to restore it`};return{content:ee}}catch(ee){return{error:`Failed to read ${I}: ${ee instanceof Error?ee.message:String(ee)}`}}}function Vh(I){try{return{path:Hi(I)}}catch(q){return{error:q instanceof Error?q.message:String(q)}}}function Rc(I){let q=Vh(I.environment);if("error"in q)return{platform:gr,status:"n/a",errors:[q.error]};let X=q.path,ee=Be(gr,X);if(ee)return ee;let ne=mr(dn()).map((be)=>qh(Pc(X,be.name),be)),te=ne.flatMap((be)=>("error"in be)?[be.error]:[]);if(te.length>0)return{platform:gr,status:"n/a",configPath:X,errors:te};let le=ne.some((be)=>("content"in be)&&Sc(be.content)!==dn()),de=le?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!Gi(I.environment))return{platform:gr,status:"disabled",method:"plugin directory",configPath:X,errors:[`${kn} is not enabled in Hermes; run \`hermes plugins enable ${kn}\``,...de]};return{platform:gr,status:"configured",method:"plugin directory",configPath:X,errors:le?de:void 0}}import{existsSync as Kh,readFileSync as Jh}from"node:fs";import{join as Ki}from"node:path";var zh=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/,qi="cc-safety-net",go="plugin config",Wh=new Set(["event","matcher","command","timeout"]),Yh=new Set(["PreToolUse","PostToolUse","PostToolUseFailure","PermissionRequest","PermissionResult","UserPromptSubmit","UserPromptQueued","TurnStarted","Stop","StopFailure","Interrupt","SessionStart","SessionEnd","SessionHeartbeat","SubagentStart","SubagentStop","TaskStarted","PreCompact","PostCompact","Notification"]);function Ec(I){return I.env.get("KIMI_CODE_HOME")||Ki(I.home,".kimi-code")}function mo(I,q){let X=[""],ee="",ne=0;for(let te=0;te<I.length;te++){let le=I[te];if(ee!==""){let de=ee==='"'&&le==="\\"?I[++te]??"":"";if(X[X.length-1]+=le+de,de===""&&le===ee)ee="";continue}if(le==="#"){let de=I.indexOf(`
`,te);te=(de===-1?I.length:de)-1;continue}if(le===q&&ne===0){X.push("");continue}if(le==='"'||le==="'")ee=le;if(le==="["||le==="{")ne++;if(le==="]"||le==="}")ne--;X[X.length-1]+=le}return X.map((te)=>te.trim()).filter((te)=>te!=="")}function Tc(I){let q=/^(?:"([^"]*)"|'([^']*)'|([^\s="']+))\s*=\s*([\s\S]+)$/.exec(I);return q?{key:q[1]??q[2]??q[3]??"",value:q[4]??""}:void 0}function Vi(I){return I===void 0?void 0:/^("""|'''|"|')([\s\S]*)\1$/.exec(I)?.[2]}function Zh(I){let q=I.split(/(?=^\s*\[)/m),X=q.filter((ee)=>!/^\s*\[/.test(ee)).flatMap((ee)=>mo(ee,`
`)).map(Tc).find((ee)=>ee?.key==="hooks")?.value;if(X!==void 0)return mo(X.slice(1,-1),",").map((ee)=>mo(ee.slice(1,-1),","));return q.filter((ee)=>/^\s*\[\[hooks]]/.test(ee)).map((ee)=>mo(ee.replace(/^\s*\[\[hooks]]/,""),`
`))}function Xh(I){let q=I.map(Tc),X=I.find((Ae,De)=>q[De]===void 0),ee=q.find((Ae)=>Ae!==void 0&&!Wh.has(Ae.key))?.key,ne=q.find((Ae,De)=>Ae!==void 0&&q.findIndex((Le)=>Le?.key===Ae.key)<De)?.key,te=(Ae)=>q.find((De)=>De?.key===Ae)?.value,le=te("matcher"),de=te("timeout"),be=Number(de?.replace(/(?<=[\da-f])_(?=[\da-f])/gi,""));return[[X!==void 0,`"${X}" is not a key = value pair`],[ee!==void 0,`unknown key "${ee}"`],[ne!==void 0,`duplicate key "${ne}"`],[!Yh.has(Vi(te("event"))??""),'"event" is not a Kimi Code hook event'],[le!==void 0&&Vi(le)===void 0,'"matcher" is not a string'],[!Vi(te("command")),'"command" is missing or empty'],[de!==void 0&&!(Number.isInteger(be)&&be>=1&&be<=600),'"timeout" is not an integer from 1 to 600']].find(([Ae])=>Ae)?.[1]}function Qh(I){let q=Ki(Ec(I),"plugins","installed.json"),X=v(q);if(X.kind==="missing")return;let ee=X.kind==="ok"?n(X.value,"plugins"):void 0;if(!Array.isArray(ee))return{platform:"kimi-code",status:"n/a",configPath:q,errors:[`Cannot read ${q}, so doctor cannot tell whether the Kimi Code plugin is installed`]};let ne=ee.find((te)=>n(te,"id")===qi);if(ne===void 0)return;if(n(ne,"enabled")!==!0)return{platform:"kimi-code",status:"disabled",method:go,configPath:q,errors:[`${qi} is installed but not enabled in Kimi Code; run /plugins enable ${qi}`]};return{platform:"kimi-code",status:"configured",method:go,configPath:q}}function ho(I){let q=Ki(Ec(I.environment),"config.toml"),X=()=>Qh(I.environment)??{platform:"kimi-code",status:"n/a",configPath:q};if(!Kh(q))return X();let ee;try{ee=Jh(q,"utf-8")}catch(le){return{platform:"kimi-code",status:"n/a",configPath:q,errors:[`Failed to read ${q}: ${le instanceof Error?le.message:String(le)}`]}}if(!zh.test(ee))return X();let te=(/"""|'''/.test(ee)?[]:Zh(ee)).flatMap((le,de)=>{let be=Xh(le);return be===void 0?[]:[`Kimi Code ignores every hook because hooks entry ${de+1} is invalid (${be}); fix it in ${q}`]});return{platform:"kimi-code",status:te.length>0?"disabled":"configured",method:"hook config",configPath:q,errors:te.length>0?te:void 0}}import{readFileSync as jc}from"node:fs";import{join as yr}from"node:path";var cn="cc-safety-net",wn="index.js",Wt="openclaw.plugin.json",Yt="package.json";var yo="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as ey,lstatSync as ny,readdirSync as ty,readFileSync as ry}from"node:fs";import{dirname as Ac,join as Mn}from"node:path";import{fileURLToPath as oy}from"node:url";var Ji=Mn("openclaw",cn),st=`run \`openclaw plugins enable ${cn}\``,iy="config reload superseded by a newer runtime config source",sy=[wn,Wt,Yt];function _c(I){let q=I.env.get("OPENCLAW_HOME")?.trim();return q?B(q,I.home):I.home}function Ic(I){let q=_c(I),X=I.env.get("OPENCLAW_STATE_DIR")?.trim();if(X)return B(X,q);let ee=I.env.get("OPENCLAW_CONFIG_PATH")?.trim();return ee?Ac(B(ee,q)):Mn(q,".openclaw")}function Oc(I){let q=I.env.get("OPENCLAW_CONFIG_PATH")?.trim();return q?B(q,_c(I)):Mn(Ic(I),"openclaw.json")}function hr(I){return Mn(Ic(I),"extensions",cn)}function ay(I){let q=ty(I);if(q.length===0)return!0;if(q.some((ne)=>!sy.includes(ne)))return!1;let X=Mn(I,wn),ee=u(X);return ee!==void 0&&!ee.isSymbolicLink()&&ee.isFile()&&ry(X,"utf-8").startsWith(yo)}function zi(I){let q=hr(I),X=u(q);if(!X)return;if(!X.isSymbolicLink()&&X.isDirectory()&&ay(q))return;throw Error(`Refusing to modify ${q}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function $c(){let I=Ac(oy(import.meta.url));return[Mn(I,Ji),Mn(I,"..",Ji),Mn(I,"..","..","..","dist",Ji)]}function Wi(I=$c()){return I.find((q)=>ey(q)&&ny(q).isDirectory())}function ly(I=$c()){let q=Wi(I);if(!q)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return q}function Dc(I=ly()){return[["openclaw","plugins","install",I,"--force","--accept-capabilities"]]}function cy(I){let q=(()=>{try{return JSON.parse(I)}catch{return}})(),X=n(n(q,"plugin"),"status");return typeof X==="string"?X:void 0}async function dy(){await un(["openclaw","plugins","enable",cn]).catch((I)=>{if(!(I instanceof Error&&I.message.includes(iy)))throw I})}async function Nc(I){let q=async()=>cy(await un(["openclaw","plugins","inspect",cn,"--runtime","--json"],{stdoutOnly:!0})),X=await q(),ee=X==="disabled"&&I;if(ee)await dy();let ne=ee?await q():X;if(ne==="loaded")return;throw Error(`${ne===void 0?`The ${cn} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:ne==="disabled"?`OpenClaw reports the ${cn} plugin with status "disabled"; ${st}.`:`OpenClaw reports the ${cn} plugin with status "${ne}".`} Run \`openclaw plugins inspect ${cn} --runtime\` for details.`)}var vo="openclaw";function Zt(I,q){let X=yr(I,q),ee=u(X);if(!ee)return{error:`${q} is missing from ${X}; run install --openclaw`};if(ee.isSymbolicLink()||!ee.isFile())return{error:`${X} is a symlink or not a regular file; move or remove it`};try{return{content:jc(X,"utf-8")}}catch(ne){return{error:`Failed to read ${X}: ${ne instanceof Error?ne.message:String(ne)}`}}}function Fc(I){try{return JSON.parse(mn(I))}catch{return}}function uy(I){let q=Zt(I,Wt);if("error"in q)return q.error;if(n(Fc(q.content),"id")===cn)return;return`${yr(I,Wt)} is not a valid ${cn} manifest; run install --openclaw`}function py(I){let q=Zt(I,Yt);if("error"in q)return q.error;let X=n(n(Fc(q.content),"openclaw"),"extensions");if(Array.isArray(X)&&X.includes(`./${wn}`))return;return`${yr(I,Yt)} does not point OpenClaw at ${wn}; run install --openclaw`}function Lc(I){return Array.isArray(I)?I.filter((q)=>typeof q==="string"):[]}function fy(I){let q=Oc(I);if(!u(q))return`${cn} is not enabled; ${st}`;let X=(()=>{try{return JSON.parse(mn(jc(q,"utf-8")))}catch{return}})();if(X===void 0)return`Failed to read ${q}; fix it, then ${st}`;let ee=n(X,"plugins");if(n(ee,"enabled")===!1)return`plugins.enabled is false in ${q}; no OpenClaw plugin loads`;let ne=n(n(n(ee,"entries"),cn),"enabled");if(Lc(n(ee,"deny")).includes(cn)||ne===!1)return`${cn} is disabled in ${q}; ${st}`;let te=Lc(n(ee,"allow"));if(te.length>0&&!te.includes(cn))return`plugins.allow in ${q} does not list ${cn}; add it, then ${st}`;if(te.includes(cn)||ne===!0)return;return`${cn} is not enabled; ${st}`}function Hc(I){return/^\/\/ version:\s*(.+)$/m.exec(I)?.[1]?.trim()}function my(I,q,X){if(X===void 0)return[];let ee=Zt(X,wn);if(!(("content"in ee)&&Hc(ee.content)===q))return[];return[wn,Wt,Yt].flatMap((te)=>{let le=Zt(I,te),de=Zt(X,te);if("error"in le||"error"in de||le.content===de.content)return[];return[`Modified ${te} occupies ${yr(I,te)}; run install --openclaw to restore it`]})}function Mc(I){let q=hr(I.environment),X=Be(vo,q);if(X)return X;let ee=Zt(q,wn),te=["error"in ee?ee.error:ee.content.startsWith(yo)?void 0:`Unmanaged ${wn} occupies ${yr(q,wn)}; move or remove it`,uy(q),py(q)].filter((Ae)=>Ae!==void 0),le="content"in ee?Hc(ee.content):void 0,de=te.length>0?te:my(q,le,Wi());if(de.length>0)return{platform:vo,status:"n/a",configPath:q,errors:de};let be=le===dn()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],Se=fy(I.environment);if(Se)return{platform:vo,status:"disabled",method:"plugin directory",configPath:q,errors:[Se,...be]};return{platform:vo,status:"configured",method:"plugin directory",configPath:q,errors:be.length>0?be:void 0}}import{existsSync as xy,readFileSync as Py}from"node:fs";import{basename as Sy}from"node:path";import{existsSync as bo,readFileSync as Zi,rmSync as gy}from"node:fs";import{join as En}from"node:path";import{pathToFileURL as hy}from"node:url";var vr="cc-safety-net",at=`${vr}@latest`,Xi=["opencode.json","opencode.jsonc"],yy=60,vy=250,Uc="CCSafetyNetPlugin",by={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function Bc(I){return En(I.env.get("XDG_CONFIG_HOME")||En(I.home,".config"),"opencode")}function Qi(I){return I.env.get("OPENCODE_CONFIG_DIR")||Bc(I)}function es(I){return Xi.map((q)=>En(Qi(I),q))}function ns(I){return[...new Set([Qi(I),Bc(I)])].flatMap((q)=>Xi.map((X)=>En(q,X)))}function Gc(I){return En(I.env.get("XDG_CACHE_HOME")||En(I.home,".cache"),"opencode","packages",at)}function qc(I){gy(Gc(I),{recursive:!0,force:!0})}async function Vc(I){let q=(await un(["opencode","--version"],{stdoutOnly:!0})).trim(),X=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(q),ee=Number(X?.[1]),ne=Number(X?.[2]),te=Number(X?.[3]);if(!X||ee!==1&&ee!==2||ee===1&&(ne<18||ne===18&&te<29)||ee===2&&ne===0&&te<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${q||"an unknown version"}.`);if(ee===2){for(let le of es(I)){if(!bo(le))continue;let de=rs(Zi(le,"utf-8"),le);if(["plugin","plugins"].some((Se)=>{let Ae=n(de,Se);return Array.isArray(Ae)&&Ae.some((De)=>wo(De)&&(typeof De==="string"?De:n(De,"package"))!==at)}))throw Error(`Change the cc-safety-net package spec in ${le} to ${at}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[],afterInstall:async()=>{if((await un(["opencode","plugin","add",at],{stdoutOnly:!0})).includes("is already configured in"))await Yi(),await un(["opencode","plugin","update",at]);let de=await Yi();if(!/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(de))throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.");let be=["--param",`location[directory]=${process.cwd()}`];await un(["opencode","api","integration.list",...be]);let Se=await un(["opencode","api","plugin.list",...be],{stdoutOnly:!0}),Ae=ts(Se);if(Ae)throw Error(Ae);if(!Kc(Se).some(Jc))throw Error("OpenCode lists no active cc-safety-net for this directory. Run `opencode api plugin.list` for details.")}}}return qc(I),{commands:[["opencode","plugin","-g","-f",at]],afterInstall:()=>ky(I)}}function Kc(I){return wy(I).filter((q)=>n(q,"id")===vr||wo(n(n(q,"source"),"target"))).map((q)=>n(q,"state"))}function Jc(I){return n(I,"status")==="active"}function ts(I){let q=Kc(I);if(q.some(Jc))return;let X=q.find((ee)=>n(ee,"status")==="failed");if(!X)return;return`OpenCode reports cc-safety-net failed: ${String(n(X,"error")).split(`
`)[0]}`}function wy(I){if(!I)return[];try{let q=n(JSON.parse(I),"data");return Array.isArray(q)?q:[]}catch{return[]}}async function Yi(I=1){let q=await un(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s|\scc-safety-net@latest\s*$/m.test(q)||I===yy)return q;return await new Promise((X)=>setTimeout(X,vy)),Yi(I+1)}async function ky(I){let q=En(Gc(I),"node_modules",vr),X=En(q,"package.json");if(!bo(X))throw Error(`The OpenCode plugin cache at ${q} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${at}\` for details.`);let ee=n(JSON.parse(Zi(X,"utf-8")),"main");if(typeof ee!=="string")throw Error(`The cached OpenCode plugin at ${q} declares no "main" entry.`);let ne=En(q,ee);if(typeof(await import(hy(ne).href))[Uc]==="function")return;throw Error(`The cached OpenCode plugin at ${ne} does not export a callable ${Uc}, so OpenCode would load nothing and fail open.`)}function rs(I,q){try{return JSON.parse(mn(I))}catch(X){if(X instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${q}: ${X.message}`);throw X}}function wo(I){let q=typeof I==="string"?I:n(I,"package");return typeof q==="string"&&(q===vr||q.startsWith(`${vr}@`))}function os(I){return["plugin","plugins"].some((q)=>{let X=n(I,q);return Array.isArray(X)&&X.some(wo)})}function Cy(I,q){let ee=["plugin","plugins"].flatMap((ne)=>{let te=bl(I,ne,by);if(!te)return[];let le=[],de=0,be=te.start+1,Se=I.slice(te.start+1,te.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let Ae of Se){if(Ae[0].startsWith("//")||Ae[0].startsWith("/*"))continue;let De=te.start+1+Ae.index;if(de===0)be=De;if(Ae[0]==="{"||Ae[0]==="[")de++;if(Ae[0]==="}"||Ae[0]==="]")de--;if(de!==0||Ae[0]===",")continue;let Le=De+Ae[0].length;if(wo(JSON.parse(mn(I.slice(be,Le)))))le.push({start:be,end:Le})}return le}).sort((ne,te)=>ne.start-te.start).reverse().reduce((ne,te)=>{let le=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(ne.slice(te.end));if(le?.[0].includes("/")){let de=te.end+le[0].length-1;return ne.slice(0,te.start)+ne.slice(te.end,de)+ne.slice(de+1)}return vl(ne,te)},I);return rs(ee,q),ee}function zc(I){qc(I);let q=ns(I),X=q.find((te)=>bo(te)),ee=[],ne=[];for(let te of q){if(!bo(te))continue;try{let le=Zi(te,"utf-8");if(!os(rs(le,te)))continue;sn(te,Cy(le,te)),ne.push(te)}catch(le){ee.push(le instanceof Error?le.message:String(le))}}if(ee.length>0)throw Error(ee.join(`
`));return{path:ne[0]??X??En(Qi(I),Xi[0]),alreadyInstalled:ne.length>0}}function Xt(I){let q=[];for(let X of I.openCodeVersion?.startsWith("2.")?es(I.environment):ns(I.environment))if(xy(X))try{let ee=Py(X,"utf-8"),ne=mn(ee),te=JSON.parse(ne);if(os(te)){let le=ts(I.openCodePluginListOutput);if(le)return{platform:"opencode",status:"disabled",method:"opencode api plugin.list",configPath:X,errors:[...q,le]};return{platform:"opencode",status:"configured",method:"plugin array",configPath:X,errors:q.length>0?q:void 0}}}catch(ee){q.push(`Failed to parse ${Sy(X)}: ${ee instanceof Error?ee.message:String(ee)}`)}return{platform:"opencode",status:"n/a",errors:q.length>0?q:void 0}}import{join as Wc}from"node:path";var Zc="dist/pi/index.js",Yc=new Set([Zc,"index.js"]),Ry=/[*?[\]{}]/;function is(I){let q=I.env.get("PI_CODING_AGENT_DIR");return Wc(q?B(q,I.home):Wc(I.home,".pi","agent"),"settings.json")}function ss(I){if(typeof I!=="string")return!1;return I==="npm:cc-safety-net"||I.startsWith("npm:cc-safety-net@")}function Ey(I){if(!Array.isArray(I)||I.length===0)return!1;if(!I.every((ee)=>typeof ee==="string"))return!1;let q=(ee)=>I.some((ne)=>ne.startsWith(ee)&&ne.slice(1).replace(/^\.[/\\]/,"")===Zc);if(q("-"))return!1;if(q("+"))return!0;let X=I.filter((ee)=>!/^[-+!]/.test(ee));return(X.length===0||X.some((ee)=>Yc.has(ee)))&&!I.some((ee)=>ee.startsWith("!")&&(Yc.has(ee.slice(1))||Ry.test(ee)))}function Xc(I){let q=is(I.environment),X=v(q);if(X.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(X.kind==="missing")return{platform:"pi",status:"n/a"};let ee=n(X.value,"packages");if(!Array.isArray(ee))return{platform:"pi",status:"n/a"};let ne=ee.find((le)=>ss(typeof le==="string"?le:n(le,"source")));if(ne===void 0)return{platform:"pi",status:"n/a"};let te=n(ne,"extensions");if(te!==void 0&&!Ey(te))return{platform:"pi",status:"disabled",method:"package config",configPath:q,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:q}}var Ty={amp:rl,"antigravity-cli":al,"claude-code":pl,codex:ml,"copilot-cli":Ol,cursor:Ul,"deepseek-harness":Rt,devin:Wl,droid:rc,"gemini-cli":oc,"grok-build":mc,"hermes-agent":Rc,"kimi-code":ho,openclaw:Mc,opencode:Xt,pi:Xc};function Qt(I,q,X){let ee={...X,cwd:q,environment:I};return Or.map((ne)=>Ay(Ty[ne](ee)))}function Ay(I){if(I.status==="not-inspected")return{platform:I.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:I.platform,detected:I.status!=="n/a",configured:I.status==="configured",inspectionStatus:I.status!=="n/a"?"verified":I.errors&&I.errors.length>0?"failed":"not-applicable",method:I.method,configPath:I.configPath,configPaths:I.configPaths,errors:I.errors}}import{join as _y}from"node:path";var Iy=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),Oy=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),commandTools:Object.freeze([]),safety:Object.freeze({level:"standard"}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),$y={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function Qc(I){let q=_y(I.tmpdir,"cc-safety-net-self-test"),X=Iy.map((ee)=>{let ne=z(I,d("self-test",{command:ee.command},{kind:"command",shell:"auto"},{configCwd:q,executionCwd:q},ee.command),{guard:{dependencies:{loadPolicySnapshot:()=>Oy,getModes:()=>$y,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),te=ee.expectBlocked?"blocked":"allowed",le=ne.decision.kind==="deny"?"blocked":"allowed";return{command:ee.command,description:ee.description,expected:te,actual:le,passed:te===le,reason:ne.decision.kind==="deny"?ne.decision.reason:void 0,ruleId:ne.decision.kind==="deny"?ne.decision.ruleId:void 0}});return{passed:X.filter((ee)=>ee.passed).length,failed:X.filter((ee)=>!ee.passed).length,total:X.length,results:X}}function as(I){let q=pn({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},I);if(_n(q.errors))return null;return{json:q.flags.json,skipUpdateCheck:q.flags.skipUpdateCheck}}async function ed(I,q={}){let X=await ar(!q.json,()=>{let ee=Ny(I,q);return{ready:ee,finish:()=>ee}},()=>sr(),{loadingMessage:"Checking system status…"});if(q.json)console.log(JSON.stringify(X,null,2));else Ly(X);return X.engineSelfTest.failed>0||X.findings.some((ee)=>ee.severity==="error")?1:0}async function Ny(I,q){let X=q.cwd??process.cwd(),ee=await Mr((Me)=>Xt({environment:I,cwd:X,openCodeVersion:Me}).status!=="n/a",void 0,X),ne=Qt(I,X,{ampPluginListOutput:ee.ampPluginListOutput,codexPluginListOutput:ee.codexPluginListOutput,copilotCliVersion:ee.versions["copilot-cli"],openCodeVersion:ee.versions.opencode,openCodePluginListOutput:ee.openCodePluginListOutput}),te=wa(I,X),le=ka(I),de=w(I,{cwd:X}),be=de.policy,Se=O(be,I.env),Ae=Z(be,Se.capabilities),De=Lr(I,7),Le=Xa(I,X),Ne=[Ut(X),Bt(I)].filter((Me)=>Dy(Me)),Fe=q.skipUpdateCheck?{currentVersion:dn(),latestVersion:null,updateAvailable:!1}:await Fn(),Ge={hooks:ne,engineSelfTest:Qc(I),userConfig:te.userConfig,projectConfig:te.projectConfig,configState:tt(de),effectiveRules:te.effectiveRules,environment:le,effectiveSafety:{selectedPreset:be.safety.level,level:Se.effectiveLevel,capabilities:Se.capabilities,ruleOverrides:be.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(Ae).filter(([,Me])=>Me.source==="rule_override"&&Me.override==="off"&&Me.inheritedEnabled&&Me.changesInherited).map(([Me])=>Me),ruleCounts:{stored:Object.keys(be.destructiveCommandRuleOverrides).length,effective:Object.values(Ae).filter((Me)=>Me.changesInherited).length},...de.policyScopes?{policyScopes:de.policyScopes}:{}},...Le.length>0?{v2Leftovers:Le}:{},...Ne.length>0?{legacyConfigs:Ne}:{},posture:Na(I,te.userConfig.path),activity:De,update:Fe,system:ee};return{...Ge,findings:xa(Ge)}}function Ly(I){console.log(),console.log(Sa(I.hooks)),console.log(),console.log(Ra(I.engineSelfTest)),console.log(),console.log(Ea(I)),console.log(),console.log(Ta(I.environment)),console.log(),console.log(Aa(I)),console.log(),console.log(_a(I.findings)),console.log(),console.log(Ia(I.activity)),console.log(),console.log($a(I.system)),console.log(),console.log(Oa(I.update)),console.log(Da(I))}import{existsSync as jy}from"node:fs";var Fy=/^[A-Za-z0-9_@%+=:,./-]+$/,ls="Usage: cc-safety-net explain [--json] [--cwd <path>] [--shell <auto|posix|powershell>] <command>",Hy=["auto","posix","powershell"];function cs(I){let q=pn({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"],shell:["--shell"]},positionals:"tail"},I);if(_n(q.errors))return console.error(ls),console.error("Pass -- before a command that starts with dashes."),null;if(q.values.cwd!==void 0&&!jy(q.values.cwd))return console.error(`Error: --cwd path does not exist: ${q.values.cwd}`),null;let X=Hy.find((ne)=>ne===q.values.shell);if(q.values.shell!==void 0&&!X)return console.error(`Error: --shell must be auto, posix, or powershell, got: ${q.values.shell}`),console.error(ls),null;let ee=q.positionals.length===1?q.positionals[0]:q.positionals.map((ne)=>Fy.test(ne)?ne:`'${ne.replaceAll("'",X==="powershell"?"''":"'\\''")}'`).join(" ");if(!ee)return console.error("Error: No command provided"),console.error(ls),null;return{json:q.flags.json,cwd:q.values.cwd,shell:X,command:ee}}function nd(I){if(I)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function td(I,q){let ee=q-18;return[`${I.dtl}${I.dh.repeat(q)}${I.dtr}`,`${I.dv}  Command Analysis${" ".repeat(ee)}${I.dv}`,`${I.dbl}${I.dh.repeat(q)}${I.dbr}`]}function ds(I){return JSON.stringify(I)}function rd(I,q=0){return`[${I.map((ee,ne)=>Pa(ee,ne,q)).join(",")}]`}function br(I,q,X=70){let ee=I.split(" "),ne=[],te="";for(let le of ee)if(te&&te.length+le.length+1>X)ne.push(te),te=le;else te=te?`${te} ${le}`:le;if(te)ne.push(te);return ne.map((le,de)=>de===0?le:`${q}${le}`)}function od(I,q,X){let ee=[];switch(I.type){case"parse":return null;case"env-strip":return ee.push(""),ee.push(`STEP ${q} ${X.h} Strip environment variables`),ee.push(`  Removed: ${I.envVars.map((ne)=>`${ne}=<redacted>`).join(", ")}`),ee.push(`  Tokens:  ${ds(I.output)}`),{lines:ee,incrementStep:!0};case"leading-tokens-stripped":return ee.push(""),ee.push(`STEP ${q} ${X.h} Strip wrappers`),ee.push(`  Removed: ${I.removed.join(", ")}`),ee.push(`  Tokens:  ${ds(I.output)}`),{lines:ee,incrementStep:!0};case"shell-wrapper":return ee.push(""),ee.push(`STEP ${q} ${X.h} Detect shell wrapper`),ee.push(`  Wrapper: ${I.wrapper} -c`),ee.push(`  Inner:   ${I.innerCommand}`),{lines:ee,incrementStep:!0};case"interpreter":{if(ee.push(""),ee.push(`STEP ${q} ${X.h} Detect interpreter`),ee.push(`  Interpreter: ${I.interpreter}`),ee.push(`  Code:        ${I.codeArg}`),I.paranoidBlocked)ee.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:ee,incrementStep:!0}}case"busybox":return ee.push(""),ee.push(`STEP ${q} ${X.h} Busybox wrapper`),ee.push(`  Subcommand: ${I.subcommand}`),{lines:ee,incrementStep:!0};case"transparent-wrapper":return ee.push(""),ee.push(`STEP ${q} ${X.h} Transparent wrapper`),ee.push(`  Wrapper: ${I.wrapper}`),ee.push(`  Tokens:  ${ds(I.output)}`),{lines:ee,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(ee.push(""),ee.push(`STEP ${q} ${X.h} Match rules`),ee.push(`  Rule:   ${I.rule}()`),I.matched)ee.push("  Result: MATCHED");else ee.push("  Result: No match");return{lines:ee,incrementStep:!0}}case"worktree-relaxation":return ee.push(""),ee.push(`STEP ${q} ${X.h} Worktree relaxation`),ee.push(`  Mode:   ${r.worktree.name}`),ee.push(`  Git cwd: ${I.gitCwd}`),ee.push("  Result: Allowed local discard in linked worktree"),{lines:ee,incrementStep:!0};case"temp-root-relaxation":return ee.push(""),ee.push(`STEP ${q} ${X.h} Temp-root relaxation`),ee.push(`  Git cwd: ${I.gitCwd}`),ee.push("  Result: Allowed git discard in a temp-root repository"),{lines:ee,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(I.embeddedCommandFound)return ee.push(""),ee.push(`STEP ${q} ${X.h} Fallback scan`),ee.push(`  Found: ${I.embeddedCommandFound}`),{lines:ee,incrementStep:!0};return null}case"custom-rules-check":{if(I.rulesChecked){if(ee.push(""),ee.push(`STEP ${q} ${X.h} Custom rules`),I.matched)ee.push("  Result: MATCHED");else ee.push("  Result: No match");return{lines:ee,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(I.matched)return ee.push(""),ee.push(`STEP ${q} ${X.h} Dangerous text check`),ee.push(`  Token:  ${I.token}`),ee.push("  Result: MATCHED"),{lines:ee,incrementStep:!0};return null}case"strict-unparseable":return ee.push(""),ee.push(`STEP ${q} ${X.h} Strict mode check`),ee.push(`  Command: ${I.rawCommand}`),ee.push("  Result:  ✗ UNPARSEABLE"),{lines:ee,incrementStep:!0};case"segment-skipped":return null;case"error":return ee.push(""),ee.push(`ERROR: ${I.message}`),{lines:ee,incrementStep:!1};default:return I}}function us(I,q){let X=nd(q?.asciiOnly??!1),ee=58,ne=[],te=1;ne.push(...td(X,58)),ne.push("");let le=I.trace.steps.find((Fe)=>Fe.type==="error");if(le&&le.type==="error"){ne.push("ERROR"),ne.push(`  ${le.message}`),ne.push(""),ne.push("RESULT"),ne.push(`  Status: ${I.result==="blocked"?qe.red("BLOCKED"):qe.green("ALLOWED")}`),ne.push(""),ne.push("CONFIG");let Fe=I.configSource??"none";return ne.push(`  Path: ${Fe}`),ne.join(`
`)}let de=I.trace.steps.find((Fe)=>Fe.type==="parse");if(de&&de.type==="parse"){ne.push("INPUT"),ne.push(`  ${de.input}`),ne.push(""),ne.push(`STEP ${te} ${X.h} Split shell commands`),te++;for(let Fe=0;Fe<de.segments.length;Fe++){let Ge=de.segments[Fe];if(Ge){let Me=Math.random();ne.push(`  Segment ${Fe+1}: ${rd(Ge,Me)}`)}}}let be=I.trace.segments,Se=be.length>1;for(let Fe of be){if(Se){ne.push("");let Qe="";if(de&&de.type==="parse"){let Ko=de.segments[Fe.index];if(Ko)Qe=Ko.join(" ")}let rn=54,an=Qe,en=` Segment ${Fe.index+1}: `,on=" ";if(Qe){if(en.length+Qe.length+on.length>rn){let yf=rn-en.length-on.length;an=`${Qe.substring(0,yf-1)}…`}}let Pn=Qe?`${en}${an}${on}`:` Segment ${Fe.index+1} `,jt=Qe?`${en}${qe.cyan(an)}${on}`:Pn,zs=58-Pn.length,Ws=Math.floor(zs/2),hf=zs-Ws;ne.push(`${X.sh.repeat(Ws)}${jt}${X.sh.repeat(hf)}`)}if(Fe.steps.find((Qe)=>Qe.type==="segment-skipped")){ne.push(""),ne.push("  (skipped — prior segment blocked)");continue}let Me=!1,nn=!1;for(let Qe of Fe.steps){let rn=od(Qe,te,X);if(rn){if(nn=!0,Qe.type==="recurse"){ne.push("");let an=" RECURSING ",en=58-an.length-4;ne.push(`  ${X.tl}${X.h}${an}${X.h.repeat(en)}`),ne.push(`  ${X.v}`),Me=!0;continue}for(let an of rn.lines)if(Me)ne.push(`  ${X.v} ${an}`);else ne.push(an);if(rn.incrementStep)te++}}if(Me)ne.push(`  ${X.v}`),ne.push(`  ${X.bl}${X.h.repeat(56)}`);if(!nn)ne.push(""),ne.push(`  ${qe.green("✓")} Allowed (no matching rules)`)}if(ne.push(""),ne.push("RESULT"),I.result==="blocked"){if(ne.push(`  Status: ${qe.red("BLOCKED")}`),I.customRule){if(ne.push(`  Rule: ${I.customRule.id}`),I.customRule.rulebook)ne.push(`  Rulebook: ${I.customRule.rulebook.name} ${I.customRule.rulebook.version}`);if(I.customRule.source)ne.push(`  Source: ${I.customRule.source}`);if(I.customRule.override)ne.push(`  Override: reason ${I.customRule.override.reason}`)}if(I.reason){let Fe=br(I.reason,"          ");ne.push(`  Reason: ${Fe[0]}`);for(let Ge=1;Ge<Fe.length;Ge++)ne.push(Fe[Ge]??"")}}else ne.push(`  Status: ${qe.green("ALLOWED")}`);ne.push(""),ne.push("CONFIG");let Ae=I.configSource??"none",De=I.configValid?"":" (invalid)";ne.push(`  Path: ${Ae}${De}`);let Le=I.safetyPresetScope;ne.push(`  Safety preset: ${I.selectedPreset??"standard"}${Le?` (${jr(Le)})`:""}`),ne.push(`  Effective capabilities: ${I.effectiveLevel}`);let Ne=Object.entries(I.destructiveCommandRuleOverrides??{});if(ne.push(`  Rule customizations: ${Ne.length}`),I.ruleActivation)ne.push(`  Rule activation: ${I.ruleActivation.id} — ${I.ruleActivation.enabled?"on":"off"} via ${I.ruleActivation.source}`);return ne.join(`
`)}function ps(I){return JSON.stringify(I,null,2)}import{resolve as Gy}from"node:path";var id=512,sd={maxTextLength:2048,maxListLength:128,maxObjectProperties:128,maxDepth:16},My=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function gs(I){let q=0,X={allocateSegment(){return q++},getNextSegmentIndex(){return q},branch(){let ee=I.fork(),ne=gs(ee);return{trace:ne,adopt(){I.replaceSegmentEvents(ee.finish().events),q=ne.getNextSegmentIndex()}}},recordGlobal(ee){I.record({scope:"global",step:ee})},recordSegment(ee,ne=X.currentSegmentIndex){if(ne===void 0)return;I.record({scope:"segment",segmentIndex:ne,step:ee})}};return X}function hs(I=new Set){let q=[];return{record(X){if(q.length>=id)return;ko(X.step,I,sd),q.push({...X,step:fs(X.step,sd,I)})},fork(){return hs(I)},replaceSegmentEvents(X){q.splice(0,q.length,...[...q.filter((ee)=>ee.scope==="global"),...X].slice(0,id))},finish(){return{events:q}}}}function ko(I,q,X,ee=0,ne=new WeakSet){if(typeof I==="string"){let de=I.slice(0,X.maxTextLength);if(!pt(de))return;for(let be of Pt(de))for(let Se of be.match(/[^\s"'()$]+/g)??[])q.add(ad(Se));return}if(!I||typeof I!=="object"||ee>=X.maxDepth||ne.has(I))return;if(ne.add(I),Array.isArray(I)){let de=Math.min(I.length,X.maxListLength);for(let be=0;be<de;be++)ko(I[be],q,X,ee+1,ne);return}let te=0,le=new Set;for(let de in I){if(!Object.hasOwn(I,de))continue;if(te>=X.maxObjectProperties)break;te++,ko(de,q,X);let be=ms(de,X,q);if(le.has(be))continue;le.add(be),ko(I[de],q,X,ee+1,ne)}}function fs(I,q,X,ee=0,ne=new WeakSet){if(typeof I==="string")return ms(I,q,X);if(!I||typeof I!=="object")return I;if(ee>=q.maxDepth)return;if(ne.has(I))return;if(ne.add(I),Array.isArray(I)){let de=[],be=Math.min(I.length,q.maxListLength);for(let Se=0;Se<be;Se++)de.push(fs(I[Se],q,X,ee+1,ne));return de}let te={},le=0;for(let de in I){if(!Object.hasOwn(I,de))continue;if(le>=q.maxObjectProperties)break;le++;let be=ms(de,q,X);if(Object.hasOwn(te,be))continue;Object.defineProperty(te,be,{value:fs(I[de],q,X,ee+1,ne),enumerable:!0,configurable:!0,writable:!0})}return te}function ms(I,q,X){let ee=I.slice(0,q.maxTextLength),ne=pt(ee)?dt(ee):ee,te=X.size>0?By(ne,X):ne;return(Uy(te)?ze(te):te).slice(0,q.maxTextLength)}function Uy(I){return I.includes("PRIVATE KEY")||I.includes("://")||I.includes("eyJ")||I.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(I)||I.length>=14&&My.some((q)=>I.includes(q))||I.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(I)}function By(I,q){return I.replace(/[^\s"'()$]+/g,(X)=>q.has(ad(X))?"<redacted>":X)}function ad(I){let q=2166136261,X=2166136261;for(let ee=0;ee<I.length;ee++)q=Math.imul(q^I.charCodeAt(ee),16777619),X=Math.imul(X^I.charCodeAt(I.length-ee-1),16777619);return`${q>>>0}:${X>>>0}:${I.length}`}function wr(I,q={},X){let ee=Gy(q.cwd??process.cwd()),ne=q.policySnapshot??w(X,{cwd:ee,userConfigDir:q.userConfigDir}),te=O(ne.policy,X.env),le=nt({policySnapshot:ne,effectiveCapabilities:te.capabilities,worktreeMode:te.worktreeMode}),de={effectiveLevel:le.effectiveLevel,selectedPreset:ne.policy.safety.level,...ne.policyScopes?{safetyPresetScope:ne.policyScopes.levelScope}:{},effectiveCapabilities:le.effectiveCapabilities,destructiveCommandRuleOverrides:ne.policy.destructiveCommandRuleOverrides},{configSource:be,configValid:Se}=Vy(X,{cwd:ee,userConfigDir:q.userConfigDir});if(!I||!I.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:be,configValid:Se,...de};let Ae=q.shell??"auto",De=C(I,Ae);if(De.status==="limited")throw new E;let Le=De.dialect==="powershell"?C(I,"posix"):De,Ne=Mt(Le),Fe=hs(),Ge=gs(Fe);Ge.recordGlobal({type:"parse",input:I,segments:Ne.map((jt)=>[...jt])});let Me=d("Bash",{command:I},{kind:"command",shell:Ae},{configCwd:ee,executionCwd:ee},I),nn=G(Me,{environment:X,trace:Ge,dependencies:{loadPolicySnapshot:()=>ne}}),Qe=nn.decision.kind==="deny"?nn.decision:null;if(Qe&&(nn.stage==="policy-protection"||nn.stage==="secret-protection"))return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:qy(Qe),matched:!0,reason:Qe.reason}]}]},result:"blocked",reason:A(Qe.reason),segment:A(ld(Qe,I)),ruleId:A(Qe.ruleId),configSource:be,configValid:Se,...de};let rn=Ge.getNextSegmentIndex();if(Qe&&rn>0&&rn<Ne.length)Ge.recordSegment({type:"segment-skipped",index:rn,reason:"prior-segment-blocked"},rn);let an=Fe.finish(),en=Qe?.ruleId??Ky(Me,ne,te,X),on=Y.find((jt)=>jt.id===en&&jt.activationCapability),Pn=on?le.policy.effectiveDestructiveCommandRules[on.id]:void 0;return{trace:zy(an),result:Qe?"blocked":"allowed",reason:Qe?A(Qe.reason):void 0,segment:Qe?A(ld(Qe,I)):void 0,ruleId:Qe?A(Qe.ruleId):void 0,customRule:Jy(Wy(Qe?.ruleId,ne)),configSource:be,configValid:Se,...de,...on&&Pn?{ruleActivation:{id:on.id,...Pn}}:{}}}function ld(I,q){return I.evidence?.segment??q}function qy(I){if(I.reason===ot)return"policy-protection:findPolicyConfigMutationTargetInSemanticFacts";if(I.reason===rt)return"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts";if(I.reason===y)return"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts";return"secret-protection:findSensitiveTargetInSemanticFacts"}function Vy(I,q){let X=D(q.cwd),ee=K(I,q),ne=oe(I,{cwd:q.cwd,userConfigDir:q.userConfigDir});try{if(o(ne.projectConfigTarget)!==null){if(jn(ne.projectConfigTarget).errors.length===0)return{configSource:X,configValid:!0};return{configSource:X,configValid:!1}}}catch(te){if(te instanceof i)return{configSource:X,configValid:!1};throw te}try{if(o(ne.userConfigTarget)!==null){let te=jn(ne.userConfigTarget);return{configSource:ee,configValid:te.errors.length===0}}return{configSource:null,configValid:!0}}catch(te){if(te instanceof i)return{configSource:ee,configValid:!1};throw te}}function Ky(I,q,X,ee){let ne=q.policy,te=He({...ne,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...ne.destructiveCommandRuleOverrides,...Object.fromEntries(Y.flatMap((de)=>de.activationCapability?[[de.id,"on"]]:[]))}},q.state==="degraded"?{diagnostics:q.diagnostics,reason:q.reason}:void 0),le=G(I,{environment:ee,dependencies:{loadPolicySnapshot:()=>te,getModes:()=>({...X,strict:!0,paranoidRm:!0,paranoidInterpreters:!0,capabilities:{fail_closed:{...X.capabilities.fail_closed,enabled:!0},paranoid_rm:{...X.capabilities.paranoid_rm,enabled:!0},paranoid_interpreters:{...X.capabilities.paranoid_interpreters,enabled:!0}}}),findSensitiveTarget:()=>null}});return le.decision.kind==="deny"?le.decision.ruleId:void 0}function Jy(I){if(!I)return;return{id:A(I.id),...I.rulebook?{rulebook:{name:A(I.rulebook.name),version:A(I.rulebook.version)}}:{},...I.source?{source:A(I.source)}:{},...I.override?{override:{type:"reason",reason:A(I.override.reason)}}:{}}}function zy(I){let q=I.events.flatMap((ee)=>ee.scope==="global"?[ee.step]:[]),X=new Map;for(let ee of I.events){if(ee.scope!=="segment")continue;let ne=X.get(ee.segmentIndex)??{index:ee.segmentIndex,steps:[]};ne.steps.push(ee.step),X.set(ee.segmentIndex,ne)}return{steps:q,segments:[...X.values()]}}function Wy(I,q){let X=I?.replace(/^custom\./,"");if(!X||!q.policy.rules.some((ee)=>ee.name===X))return;return q.ruleMetadata[X]??Object.freeze({id:X})}function cd(I){return new Promise((q)=>{process.stdout.write(`${I}
`,()=>q())})}async function dd(I,q){let X=cs(q);if(!X)return 1;try{let ee=wr(X.command,{cwd:X.cwd,shell:X.shell},I),ne=!!process.env.NO_COLOR||!process.stdout.isTTY;return await cd(X.json?ps(ee):us(ee,{asciiOnly:ne})),0}catch(ee){let ne=Yy(ee instanceof g?ee.cause:ee);if(ne===void 0)throw ee;if(X.json)return await cd(JSON.stringify({error:ne})),1;return console.error(ne),1}}function Yy(I){if(I instanceof E)return I.message;if(I instanceof H)return I.message;if(I instanceof h)return I.message;if(I instanceof a&&l[I.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var ud="2.6.19",xn="  ",mt="cc-safety-net";function pd(I){return I.argument?`${I.flags} ${I.argument}`:I.flags}function Zy(I){return Math.max(...I.map((q)=>pd(q).length))}function Xy(I){return Math.max(...I.map((q)=>q.usage.length))}function Qy(I){return Math.max(...I.map((q)=>`${mt} ${q.usage}`.length))}function ev(I,q){let X=`${mt} ${I.usage}`;return`${xn}${X.padEnd(q+2)}${I.description}`}function Tn(I,q){return`${xn}${I.padEnd(Math.max(40,I.length+2))}${q}`}function er(I,q=console.log){let X=[];if(X.push(`${mt} ${I.name}`),X.push(""),X.push(`${xn}${I.description}`),X.push(""),X.push("USAGE:"),X.push(`${xn}${mt} ${I.usage}`),X.push(""),I.subcommands&&I.subcommands.length>0){X.push("SUBCOMMANDS:");let ee=Xy(I.subcommands);for(let ne of I.subcommands)X.push(`${xn}${ne.usage.padEnd(ee+2)}${ne.description}`);X.push("")}if(I.options.length>0){X.push("OPTIONS:");let ee=Zy(I.options);for(let ne of I.options){let te=pd(ne),le=ne.default?`${ne.description} (default: ${ne.default})`:ne.description;X.push(`${xn}${te.padEnd(ee+2)}${le}`)}X.push("")}if(I.examples&&I.examples.length>0){X.push("EXAMPLES:");for(let ee of I.examples)X.push(`${xn}${ee}`)}q(X.join(`
`))}function ys(){let I=Qy(Dr),q=[];q.push(`${mt} v${ud}`),q.push(""),q.push("Blocks destructive commands and secret access."),q.push(""),q.push("COMMANDS:");for(let X of Dr)q.push(ev(X,I));q.push(""),q.push("GLOBAL OPTIONS:"),q.push(`${xn}-h, --help       Show help (use with command for command-specific help)`),q.push(`${xn}-V, --version    Show version`),q.push(""),q.push("HELP:"),q.push(`${xn}${mt} help <command>     Show help for a specific command`),q.push(`${xn}${mt} <command> --help   Show help for a specific command`),q.push(""),q.push("ENVIRONMENT VARIABLES:"),q.push(Tn(`${r.level.name}=standard|strict|paranoid`,"Set session safety level")),q.push(Tn(`${r.worktree.name}=1`,"Allow local git discards in linked worktrees")),q.push(Tn(`${r.debug.name}=1`,"Print diagnostic messages to stderr")),q.push(Tn(`${r.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),q.push(Tn(`${r.projectTightenOnly.name}=1`,"Ignore project policy settings that weaken the user policy")),q.push(Tn("CC_SAFETY_NET_HOME","Override rule config home directory")),q.push(""),q.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),q.push(Tn(`${r.strict.name}=1`,"Force safety.overrides.fail_closed on")),q.push(Tn(`${r.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),q.push(Tn(`${r.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),q.push(Tn(`${r.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),q.push(""),q.push("Documentation:        https://ccsafetynet.com/docs"),console.log(q.join(`
`))}function fd(){console.log(ud)}function kr(I,q=console.log){let X=Nr(I);if(!X)return!1;if(X.name.toLowerCase()!==I.toLowerCase())return!1;return er(X,q),!0}import{existsSync as Ao,readFileSync as bu}from"node:fs";import{join as To}from"node:path";import*as Un from"node:readline";function nv(I){return I==="install"?"Install":"Uninstall"}function tv(I){return I==="install"?"Installing":"Uninstalling"}function rv(I){return I==="install"?"into":"from"}function hd(I){return I?.available===!0}function ov(I,q){let X=new Set(q);return I.filter((ee)=>X.has(ee.target)).map((ee)=>ee.target)}function md(I,q,X){if(I.every((ee)=>!ee.available))return q;return Array.from({length:I.length},(ee,ne)=>ne+1).map((ee)=>(q+ee*X+I.length)%I.length).find((ee)=>hd(I[ee]))}function iv(I,q,X){if(X.ctrl&&X.name==="c")return"interrupt";if(X.name==="escape"||q==="q")return"abort";if(I==="install"&&(q==="u"||q==="U"))return"update";if(X.name==="up"||q==="k")return"up";if(X.name==="down"||q==="j")return"down";if(X.name==="space"||q===" ")return"toggle";if(X.name==="return"||X.name==="enter")return"confirm";return null}function sv(I){return{cursor:I.findIndex((q)=>q.available),selected:[]}}function av(I,q,X){if(X==="confirm"||X==="update"||X==="abort"||X==="interrupt")return{state:I,done:X};if(X==="up")return{state:{...I,cursor:md(q,I.cursor,-1)}};if(X==="down")return{state:{...I,cursor:md(q,I.cursor,1)}};let ee=q[I.cursor];if(!hd(ee))return{state:I};let ne=I.selected.includes(ee.target)?I.selected.filter((te)=>te!==ee.target):ov(q,[...I.selected,ee.target]);return{state:{...I,selected:ne}}}var yd="◉",vd="◯",bd=">",wd=" ";function lv(I,q,X){return["",`${nv(I)} CC Safety Net ${rv(I)}:`,"",...q.map((ee,ne)=>{let te=X.selected.includes(ee.target),le=ne===X.cursor,de=te?yd:vd,be=le?bd:wd,Se=ee.available?"":` (${ee.unavailableReason??"not installed"})`,Ae=`${de} ${ee.label}${Se}`,De=!ee.available?qe.dim(Ae):te?qe.green(Ae):le?qe.bold(Ae):Ae;return`${be} ${De}`}),"",I==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":q.some((ee)=>ee.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${I}. q/Esc: close`].join(`
`)}var gd=["global-hook","plugin"];function cv(I,q,X={}){let ee=X.color!==!1?qe.bold:(te)=>te;return["","Install the Kimi Code integration as:","",...[`Global hook — ${q?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((te,le)=>{let de=le===I,be=`${de?yd:vd} ${te}`;return`${de?bd:wd} ${de?ee(be):be}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function kd(I){let{input:q,output:X}=I;Un.emitKeypressEvents(q);let ee=q.isRaw===!0;q.setRawMode(!0),q.resume();let ne=0,te=()=>{if(ne===0)return;Un.moveCursor(X,0,-ne),Un.cursorTo(X,0),Un.clearScreenDown(X)},le=()=>{te();let de=I.render();X.write(`${de}
`),ne=de.split(`
`).length};return new Promise((de)=>{let be=(Ae)=>{q.off("keypress",Se),q.setRawMode(ee),q.pause(),te(),de(Ae)};function Se(Ae,De){I.onKey(Ae,De,{finish:be,draw:le})}q.on("keypress",Se),le()})}function Cd(I={}){let q=0;return kd({input:I.input??process.stdin,output:I.output??process.stdout,render:()=>cv(q,I.globalHookInstalled===!0),onKey:(X,ee,ne)=>{if(ee.ctrl&&ee.name==="c"){ne.finish(null),(I.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(ee.name==="escape"||X==="q")return ne.finish(null);if(ee.name==="return"||ee.name==="enter")return ne.finish(gd[q]);if(ee.name==="up"||ee.name==="down"||X==="k"||X==="j")q=(q+1)%gd.length,ne.draw()}})}function vs(I=process.stdin,q=process.stdout){return Boolean(I.isTTY&&q.isTTY&&typeof I.setRawMode==="function")}function xd(I,q,X={}){let ee=X.output??process.stdout,ne=sv(q);return kd({input:X.input??process.stdin,output:ee,render:()=>lv(I,q,ne),onKey:(te,le,de)=>{let be=iv(I,te,le);if(!be)return;let Se=av(ne,q,be);if(ne=Se.state,Se.done==="interrupt"){de.finish(null),(X.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(Se.done==="abort")return de.finish(null);if(Se.done==="update")return de.finish("update");if(Se.done==="confirm"){if(ne.selected.length===0){ee.write("\x07"),de.draw();return}de.finish([...ne.selected]),ee.write(`${tv(I)} selected integrations...
`);return}de.draw()}})}import{existsSync as Pd,lstatSync as uv,mkdirSync as pv,mkdtempSync as fv,readdirSync as mv,readFileSync as tr,rmSync as xo}from"node:fs";import{basename as gv,dirname as hv,join as bn}from"node:path";import{fileURLToPath as yv}from"node:url";var bs="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",kt="cc-safety-net",Et="cc-safety-net/index.ts";import{spawn as dv}from"node:child_process";var ws=(I,q)=>{let X=zn([...I],process.env);return new Promise((ee)=>{let ne=dv(X.cmd,X.args,{cwd:q,stdio:["ignore","pipe","pipe"]}),te=hi(ne),le=!1,de=setTimeout(()=>{le=!0,ne.kill()},120000);ne.on("error",(be)=>{clearTimeout(de),ee({status:null,errorCode:be.code,stdout:te.stdout,stderr:[be.message,te.stderr].filter(Boolean).join(`
`)})}),ne.on("close",(be)=>{clearTimeout(de),ee({status:le?null:be,errorCode:le?"ETIMEDOUT":void 0,stdout:te.stdout,stderr:te.stderr})})})};var nr="cc-safety-net.ts",ks=bn("amp",Et);function vv(I){return bn(I.home,".config","amp","plugins","cc-safety-net.ts")}function bv(){let I=hv(yv(import.meta.url)),q=bn(I,ks),X=bn(I,"..",ks),ee=bn(I,"..","..","..","dist",ks);return[q,X,ee]}function wv(I=bv()){let q=I.find((X)=>Pd(X)&&uv(X).isFile());if(!q)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return q}function Sd(I){try{return JSON.parse(I)}catch{return}}function Po(I){return I.subarray(0,Buffer.byteLength(bs)).toString("utf-8")===bs}async function Cr(I,q,X){let ee=await I(q,X);if(ee.status===0)return ee;throw Error([`Failed to run ${q.join(" ")}${ee.status===null?"":` (exit ${ee.status})`}.`,[ee.stdout,ee.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Rd(I){let q=await I(["amp","plugins","repositories","--json"]);if(q.status===null)throw Error(`${q.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${q.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${q.stderr}`.trim());if(q.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${q.status}). Sign in with "amp login" and rerun install --amp.
${[q.stdout,q.stderr].filter(Boolean).join(`
`)}`.trim());let X=Sd(q.stdout),ee=(Array.isArray(X)?X:[]).filter((ne)=>n(ne,"scope")==="user"&&n(ne,"exists")===!0&&n(ne,"viewerCanWrite")===!0).map((ne)=>n(ne,"cloneRef")).find((ne)=>typeof ne==="string"&&ne.length>0);if(!ee)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return ee}async function Ed(I,q,X){let ee=fv(bn(q.tmpdir,"cc-safety-net-amp-"));try{return await Cr(I,["amp","clone","user-plugins",ee]),await X(ee)}finally{xo(ee,{recursive:!0,force:!0})}}function Cs(I){return`rerun ${I==="overwrite"?"install":"uninstall"} --amp`}function Td(I,q,X){let ee=bn(I,q),ne=u(ee);if(!ne)return;if(ne.isSymbolicLink()||!ne.isFile())throw Error(`Refusing to ${X} ${q} in your Amp personal plugins repository: not a regular file. Remove it there and ${Cs(X)}.`);let te=tr(ee);if(Po(te))return te;throw Error(`Refusing to ${X} unmanaged file ${q} in your Amp personal plugins repository. Remove it there and ${Cs(X)}.`)}function Ad(I,q){let X=bn(I,kt),ee=u(X);if(!ee)return;if(ee.isSymbolicLink()||!ee.isDirectory())throw Error(`Refusing to ${q} ${kt} in your Amp personal plugins repository: not a regular directory. Remove it there and ${Cs(q)}.`);return Td(I,Et,q)}function kv(I){let q=bn(I,nr),X=u(q);if(!X||X.isSymbolicLink()||!X.isFile())return;let ee=tr(q);return Po(ee)?ee:void 0}async function _d(I,q,X,ee){if(await Cr(I,X,q),(await Cr(I,["git","status","--porcelain"],q)).stdout.trim()==="")return!1;return await Cr(I,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",ee],q),await Cr(I,["git","push","origin","HEAD"],q),!0}function Co(I,q){Cv(I,q),xv(I,q)}function Id(I,q){if(q==="keep")return;throw Error(`Local Amp plugin ${I} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function Cv(I,q){let X=vv(I),ee=u(X);if(!ee)return;if(!ee.isSymbolicLink()&&ee.isFile()&&Po(tr(X))){xo(X);return}Id(X,q)}function xv(I,q){let X=bn(I.home,".config","amp","plugins",kt),ee=u(X);if(!ee)return;if(!ee.isSymbolicLink()&&ee.isDirectory()&&Pv(X)){xo(X,{recursive:!0});return}Id(X,q)}function Pv(I){let q=gv(Et);if(mv(I).join("\x00")!==q)return!1;let X=bn(I,q),ee=u(X);return!!ee&&!ee.isSymbolicLink()&&ee.isFile()&&Po(tr(X))}function Sv(I){let q=p(I);if(!Pd(q))return"";let X=Sd(tr(q,"utf-8"));if(!X||typeof X!=="object"||Array.isArray(X))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(_(X,I.home))};
`}async function Od(I,q=wv(),X=ws){let ee=Buffer.concat([tr(q),Buffer.from(Sv(I),"utf-8")]),ne=await Rd(X);return Ed(X,I,async(te)=>{let le=`${ne}/${kt}`,de=Ad(te,"overwrite"),be=Td(te,nr,"overwrite");if(de?.equals(ee)&&!be)return Co(I,"fail"),{path:le,alreadyInstalled:!0};if(pv(bn(te,kt),{recursive:!0}),sn(bn(te,Et),ee),be)xo(bn(te,nr));let Se=await _d(X,te,["git","add","--",Et,...be?[nr]:[]],`chore: update cc-safety-net plugin to v${dn()}`);return Co(I,"fail"),{path:le,alreadyInstalled:!Se}})}async function $d(I,q=ws){let X=await Rd(q);return Ed(q,I,async(ee)=>{let ne=Ad(ee,"remove"),te=kv(ee),le=`${X}/${te&&!ne?nr:kt}`;if(!ne&&!te)return Co(I,"keep"),{path:le,alreadyInstalled:!1};return await _d(q,ee,["git","rm","--",...ne?[Et]:[],...te?[nr]:[]],`chore: remove cc-safety-net plugin v${dn()}`),Co(I,"keep"),{path:le,alreadyInstalled:!0}})}import{existsSync as Dd,mkdirSync as Rv,readFileSync as Ev}from"node:fs";import{dirname as Tv}from"node:path";var xs=vn["antigravity-cli"],Tt="cc-safety-net";function _t(I){return Boolean(I)&&typeof I==="object"&&!Array.isArray(I)}function Ro(){return{PreToolUse:[{hooks:[{type:"command",command:xs,timeout:30}]}]}}function Nd(I){try{let q=JSON.parse(Ev(I,"utf-8"));if(!q||typeof q!=="object"||Array.isArray(q))throw Error("Antigravity hooks config must be a JSON object");return q}catch(q){if(q instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${I}: ${q.message}`);throw q}}function Ld(I){let q=I[Tt];if(q===void 0){let ee=Ro();return I[Tt]=ee,{definition:ee,preToolUse:ee.PreToolUse??[]}}if(!_t(q))throw Error(`Antigravity hooks config entry "${Tt}" must be an object`);let X=Array.isArray(q.PreToolUse)?q.PreToolUse:[];return q.PreToolUse=X,{definition:q,preToolUse:X}}function jd(I){if(!Array.isArray(I.PreToolUse))return!1;return I.PreToolUse.some((q)=>_t(q)&&Array.isArray(q.hooks)&&q.hooks.some((X)=>_t(X)&&X.command===xs))}function Av(I){return Object.values(I).some((q)=>_t(q)&&q.enabled!==!1&&jd(q))}function _v(I){if(I[Tt]===void 0)return!1;let q=Ld(I);if(q.definition.enabled!==!1||!jd(q.definition))return!1;return q.definition.enabled=!0,!0}function Iv(I){if(I[Tt]===void 0){I[Tt]=Ro();return}let q=Ld(I);q.definition.enabled=!0,q.preToolUse.push(Ro().PreToolUse?.[0]??{hooks:[]})}function Ov(I){let q=!1;for(let X of Object.values(I)){if(!_t(X)||!Array.isArray(X.PreToolUse))continue;X.PreToolUse=X.PreToolUse.flatMap((ee)=>{if(!_t(ee)||!Array.isArray(ee.hooks))return[ee];let ne=ee.hooks.filter((te)=>!_t(te)||te.command!==xs);if(ne.length!==ee.hooks.length)q=!0;return ne.length===0?[]:[{...ee,hooks:ne}]})}return q}function So(I,q){sn(I,`${JSON.stringify(q,null,2)}
`)}function Fd(I){let q=lr(I.home);if(Rv(Tv(q),{recursive:!0}),!Dd(q))return So(q,{[Tt]:Ro()}),{path:q,alreadyInstalled:!1};let X=Nd(q);if(Av(X))return{path:q,alreadyInstalled:!0};if(_v(X))return So(q,X),{path:q,alreadyInstalled:!1};return Iv(X),So(q,X),{path:q,alreadyInstalled:!1}}function Hd(I){let q=lr(I.home);if(!Dd(q))return{path:q,alreadyInstalled:!1};let X=Nd(q);if(!Ov(X))return{path:q,alreadyInstalled:!1};return So(q,X),{path:q,alreadyInstalled:!0}}import{existsSync as Rs,readlinkSync as Nv}from"node:fs";import{join as Bn}from"node:path";import{spawn as $v}from"node:child_process";var An=Cn.map((I)=>({target:I.id,flag:I.flag,label:ln(I.id),probeCommand:I.probeCommand}));function Ps(I){let q=new Set(I);return An.map((X)=>X.target).filter((X)=>q.has(X))}async function Md(I,q){for(let X of I)await q(X)}var Dv=5000;function xr(I,q=Dv){return new Promise((X)=>{let ee=zn([...I],process.env),ne=$v(ee.cmd,ee.args,{env:process.env,stdio:"ignore"}),te=!1,le=(be)=>{if(te)return;te=!0,clearTimeout(de),X(be)},de=setTimeout(()=>{ne.kill(),le(!1)},q);ne.on("error",()=>le(!1)),ne.on("close",(be)=>le(be===0))})}function Ud(I=xr,q={}){let X=new Set(q.configuredTargets??[]);return Promise.all(An.map(async(ee)=>({target:ee.target,flag:ee.flag,label:ee.label,...Gd(q.action,await I(ee.probeCommand)||ee.target==="cursor"&&await I(aa),X.has(ee.target))})))}function Bd(I,q){let X=new Set(q.configuredTargets??[]);return I.map((ee)=>({...ee,...Gd(q.action,ee.available,X.has(ee.target))}))}function Gd(I,q,X){if(I==="uninstall")return X?{available:!0}:{available:!1,unavailableReason:"not installed"};if(I==="install"&&X)return{available:!1,unavailableReason:"already installed"};if(!q)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}var Gn="cc-safety-net",Jd=["npx","-y","@deepseek-ai/dsh"],qd="DeepSeek Harness",Vd=["@deepseek-ai","dsh-desktop"],zd="Quit DeepSeek Harness Desktop, then run this command again: Desktop plugins can only change while it is closed.",Ss=(I)=>`DeepSeek Harness Desktop is not in its default location, so ${I} ${Gn} from its Plugins page.`,Wd=(I,q)=>Rs(Bn(Oe(I),q,"package.json"));function Es(I,q){let X=q.platform??process.platform,ee=Wd(I,"desktop"),ne=X==="darwin"?[Bn(I.home,"Applications"),q.systemApplications??"/Applications"].map((te)=>Bn(te,`${qd}.app`,"Contents","Resources","runtime","cli","bin","dsh")):X==="win32"?[Bn(I.env.get("LOCALAPPDATA")||Bn(I.home,"AppData","Local"),"Programs",qd,"resources","runtime","cli","bin","dsh.cmd")]:[];return{profile:ee,cli:ee?ne.find((te)=>Rs(te)):void 0}}function Yd(I,q=process.platform){if(q==="win32")return Rs(Bn(I.env.get("APPDATA")||Bn(I.home,"AppData","Roaming"),...Vd,"lockfile"));let X=Lv(Bn(I.home,"Library","Application Support",...Vd,"SingletonLock")),ee=Number(/-(\d+)$/.exec(X??"")?.[1]);return Number.isInteger(ee)&&ee>0&&jv(ee)}function Lv(I){try{return Nv(I)}catch{return}}function jv(I){try{return process.kill(I,0),!0}catch(q){return q.code==="EPERM"}}async function Zd(I,q={}){let X=Es(I,q);if(X.cli&&Yd(I,q.platform))throw Error(zd);let ee=!X.cli||Wd(I,"web")||await(q.probe??xr)(zo),ne=[...X.cli?[{profile:"desktop",label:"Desktop",dsh:[X.cli]}]:[],...ee?[{profile:"web",label:"web",dsh:Jd}]:[]];return{commands:ne.map((te)=>[...te.dsh,"plugin","--profile",te.profile,"add",`${Gn}@${dn()}`]),afterInstall:async()=>{let te=new Set(lt(I).filter((de)=>de.enabled).map((de)=>de.name)),le=ne.filter((de)=>!te.has(de.profile));if(le.length>0)throw Error(`DeepSeek Harness installed ${Gn} in the ${Kd(le)} but did not enable it. Enable it from the Plugins page.`)},message:[`Added ${Gn} to the DeepSeek Harness ${Kd(ne)}.`,...X.profile&&!X.cli?[Ss("add")]:[]].join(`
`)}}function Kd(I){return`${I.map((q)=>q.label).join(" and ")} profile${I.length>1?"s":""}`}function Xd(I,q={}){let X=new Set(lt(I).map((te)=>te.name));if(!X.has("desktop")&&!X.has("web"))throw Error(`${Gn} is not installed in the DeepSeek Harness web or Desktop profile`);let ee=X.has("desktop")?Es(I,q).cli:void 0,ne=X.has("desktop")&&!ee;if(ne&&!X.has("web"))throw Error(Ss("remove"));if(ee&&Yd(I,q.platform))throw Error(zd);return{commands:[...ee?[[ee,"plugin","--profile","desktop","remove",Gn]]:[],...X.has("web")?[[...Jd,"plugin","--profile","web","remove",Gn]]:[]],...ne?{afterUninstall:()=>{throw Error(`Removed ${Gn} from the DeepSeek Harness web profile, but ${Ss("remove")}`)}}:{}}}function Qd(I,q,X={}){let ee=Es(q,X).cli!==void 0;return I.map((ne)=>ne.target==="deepseek-harness"&&ee?{...ne,available:!0,unavailableReason:void 0}:ne)}import{existsSync as Fv,readdirSync as Hv,rmSync as Mv}from"node:fs";import{join as Uv}from"node:path";function eu(I,q=process.platform,X){if(!Fv(I))return;let ee=q==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);Hv(I).filter((ne)=>ne!==X&&ee.test(ne)).forEach((ne)=>{Mv(Uv(I,ne),{recursive:!0,force:!0})})}import{existsSync as nu,readdirSync as Bv,rmSync as Gv}from"node:fs";import{join as rr}from"node:path";function Eo(I,q=process.platform){let X=rr(I.env.get("npm_config_cache")||(q==="win32"?rr(I.env.get("LOCALAPPDATA")||rr(I.home,"AppData","Local"),"npm-cache"):rr(I.home,".npm")),"_npx");if(!nu(X))return;Bv(X).filter((ee)=>nu(rr(X,ee,"node_modules","cc-safety-net"))).forEach((ee)=>{Gv(rr(X,ee),{recursive:!0,force:!0})})}import{existsSync as au,mkdirSync as Vv,readFileSync as lu}from"node:fs";import{dirname as Kv,join as su}from"node:path";function qv(I,q){if(I[q]!=="#")return q;let X=I.indexOf(`
`,q+1);return X===-1?I.length:X+1}function Ts(I,q,X){let ee=new RegExp(`^(\\s*)${q}\\s*=\\s*\\[`),ne=0;for(let te of I.split(`
`)){if(/^\s*\[/.test(te))return;let le=ee.exec(te);if(le){let de=ne+le[0].lastIndexOf("[");return{start:de,end:fi(I,de,{skipComment:qv,...X})}}ne+=te.length+1}return}function tu(I,q,X){let ee=I.slice(0,q.end).trimEnd(),ne=yl(I,q.end),te=ne===""?"     ":`${ne}  `,le=!ee.endsWith("[")&&!ee.endsWith(",");return`${ee}${le?",":""}
${te}${X}${I.slice(q.end)}`}function ru(I,q,X){let ee=I.indexOf(X,q.start);if(ee===-1||ee>q.end)return I;return`${I.slice(0,ee)}${I.slice(ee+X.length).replace(/^\s*,/,"")}`}function ou(I,q){let X=new RegExp(`^\\s*${q}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),ee=I.split(`
`),ne=ee.findIndex((de)=>/^\s*\[/.test(de)),te=ne===-1?ee:ee.slice(0,ne),le=ne===-1?[]:ee.slice(ne);return[...te.filter((de)=>!X.test(de)),...le].join(`
`)}function iu(I,q,X){let ee=new RegExp(`^\\s*\\[\\[${q}]]\\s*$`,"m");return I.split(/(?=^\s*\[)/m).filter((ne)=>!ee.test(ne)||!ne.includes(X)).join("").trimEnd()}var Pr=vn["kimi-code"],As=`[[hooks]]
event = "PreToolUse"
command = "${Pr}"`,cu=`{ event = "PreToolUse", command = "${Pr}" }`,du={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function uu(I){return su(I.env.get("KIMI_CODE_HOME")??su(I.home,".kimi-code"),"config.toml")}function Jv(I){let q=Ts(I,"hooks",du);if(q&&I.slice(q.start+1,q.end).trim())return tu(I,q,cu);let X=ou(I,"hooks").trimEnd();if(X==="")return`${As}
`;return`${X}

${As}
`}function pu(I){let q=uu(I);if(Vv(Kv(q),{recursive:!0}),!au(q))return sn(q,`${As}
`),{path:q,alreadyInstalled:!1};let X=lu(q,"utf-8");if(X.includes(Pr))return{path:q,alreadyInstalled:!0};return sn(q,Jv(X)),{path:q,alreadyInstalled:!1}}function fu(I){let q=uu(I);if(!au(q))return{path:q,alreadyInstalled:!1};let X=lu(q,"utf-8");if(!X.includes(Pr))return{path:q,alreadyInstalled:!1};let ee=Ts(X,"hooks",du),ne=ee?ru(X,ee,cu):`${iu(X,"hooks",Pr)}
`;return sn(q,ne),{path:q,alreadyInstalled:!0}}var _s="safety-net@cc-marketplace",mu=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),gu=new Set(["antigravity-cli","cursor","devin","droid","grok-build","hermes-agent","kimi-code"]);function Is(I){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(I??"")}function wu(I){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(I??"")}function zv(I){return/^Marketplace `cc-marketplace`\s*$/m.test(I??"")}var ku={"claude-code":{installCommands:(I)=>{let q=Yr(I,"cc-safety-net@cc-marketplace");return{commands:[...q?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...ui(I).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:Yr(I,_s)?[["claude","plugin","uninstall",_s]]:[],update:q}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(I,q)=>{let X=q??await un(["codex","plugin","list"]),ee=wu(X);return{commands:[ee||zv(X)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:Is(X)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:ee}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:fl},"copilot-cli":{installCommands:async()=>{let I=await un(["copilot","plugin","list"]),q=[...Sl(I)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...Rl(I)?[["copilot","plugin","uninstall",Cl]]:[]];if(xl(I))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",Rn]],cleanupCommands:q,update:!0};return{commands:[Pl(await un(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",Rn]],cleanupCommands:q}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(I)=>{let q=$i(I);if(q.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(q.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:zi,installCommands:(I)=>{let q=!Ao(To(hr(I),wn));return{commands:Dc(),afterInstall:()=>Nc(q)}},uninstallCommands:[["openclaw","plugins","uninstall",cn,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:Vc},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]},"deepseek-harness":{installCommands:(I)=>Zd(I),uninstallCommands:(I)=>Xd(I)}};function Cu(I,q=(X)=>X){try{let X=JSON.parse(q(bu(I,"utf-8")));if(!X||typeof X!=="object"||Array.isArray(X))throw Error(`Settings file ${I} must be a JSON object`);return X}catch(X){if(X instanceof SyntaxError)throw Error(`Failed to parse ${I}: ${X.message}`);throw X}}function Wv(I){let q=To(ur(I),"settings.json");if(!Ao(q))return;let X=Cu(q,mn),ee=X.enabledPlugins;if(!ee||typeof ee!=="object"||Array.isArray(ee))return;if(ee[Rn]!==!1)return;let ne=bu(q,"utf-8"),te=ne.replace(new RegExp(`("${Rn}"\\s*:\\s*)false`),"$1true");return ee[Rn]=!0,sn(q,te!==ne?te:`${JSON.stringify(X,null,2)}
`),`Enabled ${Rn} plugin in ${q}`}function Yv(I){let q=is(I);if(!Ao(q))return;let X=Cu(q);if(!Array.isArray(X.packages))return;let ee=X.packages.find((ne)=>!!ne&&typeof ne==="object"&&!Array.isArray(ne)&&ss(ne.source)&&("extensions"in ne));if(!ee)return;return delete ee.extensions,sn(q,`${JSON.stringify(X,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${q}`}function hu(I,q){let X=pn({label:q,booleans:Object.fromEntries(An.map((te)=>[te.target,[te.flag]]))},I),ee=X.errors[0];if(ee)throw Error(ee);let ne=An.filter((te)=>X.flags[te.target]).map((te)=>te.target);if(ne.length!==1)throw Error(`Choose exactly one ${q} target: ${An.map((te)=>te.flag).join(", ")}`);return ne[0]}async function xu(I,q=Gt){let[X,ee,ne]=await Promise.all([q(["amp","plugins","list"],30000),q(["codex","plugin","list"],30000),q(["copilot","--binary-version"])]);return{codexPluginListOutput:ee,hooks:Qt(I,process.cwd(),{ampPluginListOutput:X,codexPluginListOutput:ee,copilotCliVersion:ne})}}async function Zv(I,q,X=Gt){let ee=await xu(I,X);return ee.hooks.filter((ne)=>q==="install"?ne.configured:ne.detected&&ne.method!==oo||ne.inspectionStatus==="not-inspected").filter((ne)=>!Ru(ne)).filter((ne)=>ne.platform!=="codex"||!Is(ee.codexPluginListOutput)||wu(ee.codexPluginListOutput)).map((ne)=>ne.platform)}function Xv(I,q,X,ee){if(X.length>0)return{finish:async()=>[hu(X,q)]};if(!ee.selectTargets&&!vs(ee.input,ee.output))return{finish:async()=>[hu(X,q)]};let ne=ee.detectConfiguredTargets??(()=>Zv(I,q,ee.fetchVersion)),te=Promise.all([Ud(ee.probeTargets).then((le)=>Qd(le,I)),ne()]);return{ready:te,finish:async()=>{let[le,de]=await te,be=Bd(le,{action:q,configuredTargets:de}),Se=ee.selectTargets?await ee.selectTargets(q,vu(q,be)):await xd(q,vu(q,be),{input:ee.input,output:ee.output});if(Se==="update")return Se;if(!Se||Se.length===0)return null;return Ps(Se)}}}async function Qv(I,q,X=!1,ee){let ne=ku[I];ne.beforeInstall?.(q);let te=typeof ne.installCommands==="function"?await ne.installCommands(q,ee):{commands:ne.installCommands};return await yi(te.commands),await $l(te.cleanupCommands??[]),await te.afterInstall?.(),[`${te.update||X?"Updated":"Installed"} ${ln(I)} integration`,te.message??ne.postInstallMessage].filter(Boolean).join(`
`)}async function eb(I,q){let X=ku[I];if(!X.uninstallCommands)throw Error(`${ln(I)} uninstall is not supported`);let ee=typeof X.uninstallCommands==="function"?X.uninstallCommands(q):{commands:X.uninstallCommands};return await yi(ee.commands),ee.afterUninstall?.(),`Uninstalled ${ln(I)} integration`}function nb(I){let q=zc(I);return q.alreadyInstalled?`Uninstalled OpenCode plugin from ${q.path}`:`OpenCode plugin not installed in ${q.path}`}var Pu={"antigravity-cli":{install:Fd,uninstall:Hd},cursor:{install:Hl,uninstall:Ml},devin:{install:Jl,uninstall:zl},droid:{install:nc,uninstall:tc},"grok-build":{install:dc,uninstall:uc},"kimi-code":{install:pu,uninstall:fu}};function tb(I,q,X,ee=!1){if(I==="install"&&!ee)Eo(X);let ne=Pu[q][I](X),te=ln(q),le=I!=="install"?"Uninstalled":ee?"Updated":"Installed";return I==="install"&&ne.alreadyInstalled?ee?`${te} hook up to date in ${ne.path}`:`${te} hook already installed in ${ne.path}`:I==="uninstall"&&!ne.alreadyInstalled?`${te} hook not installed in ${ne.path}`:`${le} ${te} hook ${I==="install"?"in":"from"} ${ne.path}`}var Su={amp:{install:Od,uninstall:$d,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:vc,uninstall:bc,afterInstall:async(I)=>{let q=Gi(I);return await un(["hermes","plugins","enable",kn,"--no-allow-tool-override"]),!q},beforeUninstall:async(I)=>{Bi(I);try{await un(["hermes","plugins","disable",kn])}catch(q){console.warn(`${q instanceof Error?q.message:String(q)}
Removing the plugin files anyway; ${kn} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function rb(I,q,X,ee=!1){let ne=Su[q];if(I==="uninstall")await ne.beforeUninstall?.(X);let te=I==="install"?await ne.install(X):await ne.uninstall(X),le=I==="install"&&await ne.afterInstall?.(X),de=ln(q),be=!le&&(I==="install"&&te.alreadyInstalled||I==="uninstall"&&!te.alreadyInstalled);return[be?I==="install"?`${de} plugin ${ee?"up to date":"already installed"} at ${te.path}`:`${de} plugin not installed at ${te.path}`:`${I!=="install"?"Uninstalled":ee?"Updated":"Installed"} ${de} plugin ${I==="install"?"at":"from"} ${te.path}`,be?void 0:ne.restartNote].filter(Boolean).join(`
`)}var ob={"copilot-cli":{afterInstall:Wv},cursor:{afterUninstall:Nl},"hermes-agent":{beforeInstall:(I,q)=>{if(!q)Eo(I)}},openclaw:{beforeUninstall:zi},pi:{afterInstall:Yv}};function ib(I){return I in Pu}function sb(I){return I in Su}var yu=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net/tree/plugin","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Ru(I){return I.platform==="kimi-code"&&I.method===go}function Eu(I){return ho({environment:I,cwd:process.cwd()}).method==="hook config"}function ab(I){if(!Eu(I))return yu;return[yu,"",qe.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function vu(I,q){return q.map((X)=>I==="install"&&X.target==="kimi-code"&&X.unavailableReason==="already installed"?{...X,available:!0,unavailableReason:void 0,label:`${X.label} (global hook installed)`}:X)}function lb(I,q){if(I.selectKimiInstallMethod)return I.selectKimiInstallMethod();if(!vs(I.input,I.output))return Promise.resolve("global-hook");return Cd({input:I.input,output:I.output,globalHookInstalled:Eu(q)})}async function Tu(I,q,X,ee=!1,ne){let te=ob[q];if(I==="install")te?.beforeInstall?.(X,ee);if(I==="uninstall")te?.beforeUninstall?.(X);if(ib(q))return[tb(I,q,X,ee),I==="uninstall"?await te?.afterUninstall?.(X):void 0].filter(Boolean).join(`
`);if(sb(q))return rb(I,q,X,ee);if(I==="uninstall")return q==="opencode"?nb(X):eb(q,X);return[await Qv(q,X,ee,ne),await te?.afterInstall?.(X)].filter(Boolean).join(`
`)}function cb(I){let q=pn({label:"update"},I).errors[0];if(q)throw Error(q)}async function db(I,q=Gt){let X=await xu(I,q),ee=To(ur(I),"installed-plugins");return{targets:Ps([...X.hooks.filter((te)=>te.platform!=="copilot-cli"&&te.detected&&te.method!==oo&&te.method!==xi).map((te)=>te.platform),...[Zr,kl,wl].flatMap((te)=>Ao(To(ee,...te))?["copilot-cli"]:[]),...Yr(I,_s)?["claude-code"]:[],...Is(X.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:X.codexPluginListOutput,kimiPlugin:X.hooks.some(Ru)}}async function ub(I){let q=c(),X=I.output??process.stdout,ee=(I.scriptPath??process.argv[1]??"").split(/[\\/]/),ne=ee.find((Ne)=>/^bunx-\d+-/.test(Ne)),te=ne!==void 0||ee.includes("_npx")?null:(I.checkLatestVersion??Fn)(),le=async()=>{let Ne=te&&await te;if(Ne?.updateAvailable)X.write(`
Update available: cc-safety-net ${Ne.currentVersion} → ${Ne.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},de=db(q,I.fetchVersion??Gt).then(async(Ne)=>{let Fe=new Set(Ne.targets);return{targets:Ne.targets,codexPluginListOutput:Ne.codexPluginListOutput,kimiPlugin:Ne.kimiPlugin,available:new Map(await Promise.all(An.filter((Ge)=>Fe.has(Ge.target)&&mu.has(Ge.target)).map(async(Ge)=>[Ge.target,await xr(Ge.probeCommand)])))}}),be=await ar(I.showBanner??!0,()=>({ready:de,finish:()=>de}),()=>sr({input:I.input??process.stdin,output:X}),{loadingMessage:"Checking installed integrations…",output:X}),Se=await Promise.resolve().then(()=>(eu(q.tmpdir,process.platform,ne),null)).catch((Ne)=>Sr(Ne));if(be.targets.length===0){if(X.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),Se!==null)console.error(Se);return await le(),Se===null?0:1}let Ae=be.targets.some((Ne)=>gu.has(Ne))?await Promise.resolve().then(()=>(Eo(q),null)).catch((Ne)=>Sr(Ne)):null,De=await Gr(Promise.all(be.targets.map((Ne)=>{if(Ne==="kimi-code"&&be.kimiPlugin)return Promise.resolve({message:"Kimi Code plugin skipped: update it in Kimi Code from /plugins (Installed tab, select cc-safety-net, press Enter)",failed:!1});if(mu.has(Ne)&&!be.available.get(Ne))return Promise.resolve({message:`${ln(Ne)} not found; skipped`,failed:!1});if(Ae!==null&&gu.has(Ne))return Promise.resolve({message:Ae,failed:!0});return Tu("install",Ne,q,!0,be.codexPluginListOutput).then((Fe)=>({message:Fe,failed:!1}),(Fe)=>({message:Sr(Fe),failed:!0}))})),{loadingMessage:`Updating ${be.targets.length} integration${be.targets.length===1?"":"s"}…`,output:X}),Le=Se===null?De:[...De,{message:Se,failed:!0}];return Le.forEach((Ne)=>Ne.failed?console.error(Ne.message):X.write(`${Ne.message}
`)),await le(),Le.some((Ne)=>Ne.failed)?1:0}function Os(I,q={}){return Promise.resolve().then(()=>cb(I)).then(()=>ub(q)).catch((X)=>(console.error(Sr(X)),1))}async function Rr(I,q,X={}){try{let ee=c(),ne=await ar(!0,()=>Xv(ee,I,q,X),()=>sr({input:X.input??process.stdin,output:X.output??process.stdout}),{loadingMessage:I==="install"?"Checking available integrations…":"Checking installed integrations…",output:X.output??process.stdout});if(!ne)return(X.output??process.stdout).write(`Cancelled: nothing was ${I}ed.
`),0;if(ne==="update")return(X.runUpdate??(()=>Os([],{fetchVersion:X.fetchVersion,input:X.input,output:X.output,showBanner:!1})))();let te=X.output??process.stdout;return await Md(ne,async(le)=>{if(le==="kimi-code"&&I==="install"){let be=await lb(X,ee);if(be===null){te.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(be==="plugin"){te.write(`${ab(ee)}
`);return}}let de=await Gr(Tu(I,le,ee),{loadingMessage:`${I==="install"?"Installing":"Uninstalling"} ${ln(le)} integration…`,output:te});te.write(`${de}
`)}),0}catch(ee){return console.error(Sr(ee)),1}}function Sr(I){let q=I instanceof Error?I.message:String(I),X=typeof I==="object"&&I!==null&&"code"in I?I.code:null;if(X==="EACCES"||X==="EPERM")return`${q}
Check file permissions for the target config file and parent directory.`;if(X==="ENOENT")return`${q}
Check that the target config path and parent directory exist.`;if(X==="ENOTDIR")return`${q}
Check that every parent path component is a directory.`;return q}import{mkdirSync as yb}from"node:fs";import{dirname as vb}from"node:path";import{createInterface as bb}from"node:readline";import{existsSync as _u,readFileSync as pb}from"node:fs";function It(I,q){let X=wt(I,q);return{policy:X.policy,errors:he(bt(X.issues,St,(ee)=>ee.kind==="custom")," "," ")}}function Er(I,q){return It(I,q).errors}function Au(I,q){return{"safety.level":I.safety.level,...$s("safety.overrides",I.safety.overrides),"workflow.worktree_mode":String(I.workflow.worktree_mode),"destructive_command_protection.enabled":String(I.destructive_command_protection.enabled),...$s("destructive_command_protection.overrides",I.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":Ds(I.destructive_command_protection.allow_paths),"secret_protection.enabled":String(I.secret_protection.enabled),...$s("secret_protection.overrides",I.secret_protection.overrides),"secret_protection.deny_paths":Ds(I.secret_protection.deny_paths),"secret_protection.allow_paths":Ds(I.secret_protection.allow_paths),...q?{"audit.retention_days":String(I.audit.retention_days)}:{}}}function _o(I,q,X){let ee=Au(I,X),ne=Au(q,X);return[...new Set([...Object.keys(ee),...Object.keys(ne)])].flatMap((te)=>ee[te]===ne[te]?[]:[{field:te,before:ee[te],after:ne[te]}])}function Tr(I,q){let X=p(I,q);if(!_u(X))return{baseline:_(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,I.home),diagnostics:[]};let ee=$t(X),ne=It(ee.value,I.home);return{baseline:ne.policy,diagnostics:ee.errors.length>0?ee.errors:ne.errors}}function $t(I){if(!_u(I))return{errors:[`${I}: file not found`]};try{return{value:JSON.parse(pb(I,"utf-8")),errors:[]}}catch(q){let X=q instanceof Error?q.message:String(q);return{errors:[`${I}: ${q instanceof SyntaxError?`Invalid JSON: ${X}`:X}`]}}}function Io(I,q){let X=fb(I)?I:{};return{version:q.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((ee)=>X[ee]!==void 0).map((ee)=>[ee,X[ee]]))}}function $s(I,q){return Object.fromEntries(Object.entries(q).flatMap(([X,ee])=>ee===void 0?[]:[[`${I}.${X}`,String(ee)]]))}function Ds(I){return I.length===0?"(none)":I.join(", ")}function fb(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}import{chmodSync as mb,existsSync as Iu,mkdirSync as gb,readFileSync as Ou}from"node:fs";import{dirname as hb}from"node:path";function $u(I,q={}){let X=p(I,q);if(!Iu(X))return{path:X,exists:!1,raw:"",policy:N(),errors:[]};let ee=Ou(X,"utf-8");if(!ee.trim())return{path:X,exists:!0,raw:ee,policy:N(),errors:["Config file is empty"]};try{let ne=It(JSON.parse(ee),I.home);return{path:X,exists:!0,raw:ee,policy:ne.policy,errors:ne.errors}}catch(ne){return{path:X,exists:!0,raw:ee,policy:N(),errors:[`Invalid JSON: ${ne instanceof Error?ne.message:String(ne)}`]}}}function Nn(I,q,X={}){let ee=p(I,X),ne=It(q,I.home);if(ne.errors.length>0)return{path:ee,policy:N(),errors:ne.errors};let te=ne.policy;return gb(hb(ee),{recursive:!0,mode:448}),x(pe(ee),`${JSON.stringify(te,null,2)}
`,384),mb(ee,384),{path:ee,policy:te,errors:[]}}function Du(I,q){let X=It(q,I.home);if(X.errors.length>0)return{errors:X.errors};return{preview:Xe(X.policy,I.env),errors:[]}}function Nu(I,q={}){let X=p(I,q);if(!Iu(X))return Nn(I,ae,q);let ee=Ou(X,"utf-8");if(!ee.trim())return Nn(I,ae,q);try{return Nn(I,_(JSON.parse(ee),I.home),q)}catch{return Nn(I,ae,q)}}var Lu=new Set(["check","apply"]),ju="(unset)";async function Hu(I,q,X={}){let ee=pn({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},q),ne=ee.positionals[0],te=[...ee.errors,...ne&&!Lu.has(ne)?[`Unknown policy subcommand: ${ne}`]:[],...ne&&Lu.has(ne)&&!ee.positionals[1]?[`policy ${ne} requires a file`]:[],...ee.positionals.slice(2).map((Ge)=>`Unexpected policy argument: ${Ge}`)];if(te.length>0){for(let Ge of te)console.error(Ge);return 1}let le=ee.positionals[1];if(!ne||!le)return er($r,console.error),1;let de=X.cwd??process.cwd(),be=ee.flags.global?p(I):S(de);if(!ee.flags.global&&L(I,{cwd:de}))return console.error(`${be} is the user policy, not a project policy; use --global for the user scope, or run from a project directory`),1;let Se=$t(le),Ae=[...Se.errors,...Er(Se.value,I.home).map((Ge)=>`${le}: ${Ge}`),...!ee.flags.global&&Cb(Se.value)&&Se.value.audit!==void 0?[`${le}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(Ae.length>0){for(let Ge of Ae)console.error(Ge);return 1}let De=_(Se.value,I.home);if(console.log(`Scope: ${ee.flags.global?"user":"project"} (${be})`),console.log(`Proposal: ${le}`),ee.flags.global)Fu(_($t(be).value,I.home),De,!0);if(!ee.flags.global){let Ge=Tr(I).baseline;console.log("Effective policy (user + project merged):"),Fu(se(Ge,ve($t(be).value,I.home).policy).policy,se(Ge,ve(Se.value,I.home).policy).policy,!1)}if(ne==="check")return 0;let Le=X.input??process.stdin,Ne=X.output??process.stdout;if(!Le.isTTY||!Ne.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${le}${ee.flags.global?" --global":""}`),1;if(!await wb(`Apply this policy to ${be}? [y/N] `,Le,Ne))return console.log("Cancelled; nothing was written."),0;return kb(I,be,Se.value,De,ee.flags.global),console.log(`Policy applied: ${be}`),0}function wb(I,q,X){let ee=bb({input:q,output:X,terminal:!1});return new Promise((ne)=>{ee.once("close",()=>ne(!1)),ee.question(I,(te)=>{ne(/^y(es)?$/i.test(te.trim())),ee.close()})})}function kb(I,q,X,ee,ne){if(ne){Nn(I,ee);return}yb(vb(q),{recursive:!0}),hn(q,Io(X,ee))}function Fu(I,q,X){let ee=_o(I,q,X);if(ee.length===0){console.log("No changes.");return}console.log(`Changes (${ee.length}):`);for(let ne of ee)console.log(`  ${ne.field}: ${ne.before??ju} -> ${ne.after??ju}`)}function Cb(I){return!!I&&typeof I==="object"&&!Array.isArray(I)}import{join as Lw}from"node:path";var Mu="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- `caffeinate`, `exec`, `nice`, `nohup`, `setsid`, `stdbuf`, `time`, and `timeout` are built-in transparent wrappers and need no configuration. Configure only other wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n- `command_tools`: Optional array of shell tools that a plugin adds to an agent and that CC Safety Net does not know. Each entry is a tool name such as `\"ops_bash\"`, or `{ \"name\": \"ops_run_background\", \"cwd\": \"cwd\" }` when the tool takes its working directory in a named argument (otherwise `workdir`, `cwd`, or `working_directory` is read). A call to a declared tool with a non-empty string `command` is analyzed like a built-in shell command. User and project lists merge; the user entry wins a name declared in both.\n- Built-in shell and file tools are already analyzed and cannot be declared; `rule verify` reports one declared by hand.\n- Use `cc-safety-net rule tool add ops_bash ops_run_background` to declare tools in the user config, or add `--project` for the project config.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function Oo(I,q){if(!I.ok){Ku(I);return}Gu(I,q)}function Bu(I,q,X){if(I.ok)console.log(X);if(!I.add){Oo(I,`Added rulebook source: ${q}`);return}if(!I.ok){Ku(I);return}if(I.add.added.length>0)console.log(`Added ${I.add.added.length} ${I.add.added.length===1?"rulebook":"rulebooks"} from ${I.add.source} at ${I.add.ref}:`),I.add.added.forEach((ee)=>{console.log(`  - ${ee}`)});if(I.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${I.add.source} at ${I.add.ref}: ${I.add.alreadyConfigured.join(", ")}`);if(I.add.commits.length>0)console.log(`Vendored at ${I.add.commits.map((ee)=>ee.slice(0,7)).join(", ")}.`);Gu(I,"Rule config updated.")}function Gu(I,q){for(let X of I.changes??[])console.log(X);console.log(q),console.log(""),xb(I.entries)}function xb(I){if(I.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${I.length}):`);for(let q of I)console.log(`  - ${q.name} ${q.version} (${Pb(q.ruleCount)})`),console.log(`    Source: ${q.spec}`)}function Pb(I){return`${I} ${I===1?"rule":"rules"}`}function qu(I){qn("Active sources",I.rulebooks,(q)=>[`[${q.source}] ${q.name} ${q.version}`,`  Source: ${q.spec}`]),qn("Active rules",I.rules,(q)=>[`[${Rb(I,q.name)}] ${q.name}`,...Sb(q),`  Reason: ${q.reason}`]),qn("Disabled rules",Uu(I,"off"),(q)=>[q.key]),qn("Reason overrides",Uu(I,"reason"),(q)=>[q.key,`  Reason: ${q.value.reason}`]),qn("Transparent wrappers",I.transparent_wrappers,(q)=>[q]),qn("Issues",I.errors,(q)=>[q]),qn("Warnings",I.warnings,(q)=>[q])}function Vu(I){qn("Command tools",I,(q)=>typeof q.tool==="string"?[`[${q.scope}] ${q.tool}`]:[`[${q.scope}] ${q.tool.name}`,...q.tool.cwd===void 0?[]:[`  Cwd argument: ${q.tool.cwd}`]])}function qn(I,q,X){if(q.length===0){console.log(`${I}: (none)`);return}console.log(`${I} (${q.length}):`);for(let ee of q){let[ne,...te]=X(ee);console.log(`  - ${ne}`);for(let le of te)console.log(`    ${le}`)}}function Sb(I){if(!I.match)return[`  Command: ${I.subcommand?`${I.command} ${I.subcommand}`:I.command}`,`  Block args: ${I.block_args.join(", ")}`];return[`  Command: ${[I.command,...I.match.command_path].join(" ")}`,...I.match.any_args?[`  Any args: ${I.match.any_args.join(", ")}`]:[],...I.match.exclude_args?[`  Exclude args: ${I.match.exclude_args.join(", ")}`]:[]]}function Rb(I,q){return I.rulebooks.find((X)=>X.rules.includes(q))?.source??"project"}function Uu(I,q){return Object.entries({...I.userConfig?.overrides,...I.projectConfig?.overrides}).filter((X)=>{if(q==="off")return X[1]==="off";return!!X[1]&&typeof X[1]==="object"}).map(([X,ee])=>({key:X,value:ee}))}function Ku(I){for(let q of I.errors)console.error(q)}import{dirname as gp,join as Mo}from"node:path";import{join as Fs,resolve as Fb}from"node:path";function Ar(I){let q=f(I);if(q.errors.length>0)return{ok:!1,result:{ok:!1,errors:q.errors,entries:[]}};return{ok:!0,config:q.config??ge}}function Ju(I){hn(I,ge)}function zu(I){hn(I,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as Lo}from"node:path";var Eb="custom.";function $o(I){if(I.rulebook_version!==2)return[];let q=I.rules.map((X)=>({name:X.name,command:X.command,block_args:[],match:X.match,reason:X.reason,intent:X.intent}));return(I.tests??[]).flatMap((X,ee)=>{let ne=Ns(C(X.command));if(ne.length===0)return[`tests[${ee}]: could not parse fixture command: ${X.command}`];let te=ne.reduce((le,de)=>le??F(de,q)?.id.slice(Eb.length),void 0);if(X.expect==="blocked"){if(te===X.rule)return[];let le=te?`"${te}" matched first`:"no rule matched";return[`tests[${ee}]: expected "${X.rule}" to block "${X.command}" but ${le}`]}return te?[`tests[${ee}]: expected "${X.command}" to be allowed but "${te}" matched`]:[]})}function Ns(I){return I.nodes.flatMap((q)=>{if(q.kind==="group"||q.kind==="function")return Ns(q.body);if(q.kind!=="command")return[];let X=_e(ce(q.dialect,q.words)).words.map(t);return[...X.length>0?[X]:[],...q.nested.flatMap((ee)=>Ns(ee))]})}var Do=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function No(I={}){return{requests:0,responseBytes:0,maxRequests:I.maxRequests??Do.maxRequests,maxResponseBytes:I.maxResponseBytes??Do.maxResponseBytes}}function Ln(I){return{controller:new AbortController,budget:No(),resolveUrl:I}}function Wu(I){return I instanceof Error&&I.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function Yu(I){if(I.requests>=I.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");I.requests++}function Zu(I,q){if(q>I.maxResponseBytes-I.responseBytes)throw I.responseBytes+=q,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");I.responseBytes+=q}var ep=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function Xu(I,q,X=R(Lo(Lo(q)),"rules policy"),ee=Ln()){if(T(I))return Ib(I,ee);return _b(I,q,X)}async function np(I,q,X,ee,ne,te){if(!T(I))return Xu(I,q,X,ee);let le=ne?null:Tb(I,q,X);if(le)return le;if(!ne&&!te)throw Error(`${I} is not vendored; run rule update ${I} to vendor it`);return Xu(I,q,X,ee)}function Tb(I,q,X=R(Lo(Lo(q)),"rules policy")){let ee=j(I),ne=U(q,ee.name),te=o(s(X,ne));if(te===null)return null;let le=ye(Ls(te,`Invalid rulebook ${ne}.`));if(le.name!==ee.name)throw Error(`rulebook name "${le.name}" in ${ne} must match "${ee.name}"`);return{spec:I,rulebook:le,content:te}}async function tp(I,q={}){if(!re(I))throw Error(`Invalid GitHub repository source: ${I}`);let[X,ee]=I.split("/");if(!X||!ee)throw Error(`Invalid GitHub repository source: ${I}`);if(q.ref!==void 0&&!fe(q.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${q.ref}`);let ne=q.operation??Ln(),te=q.ref??await Ab(X,ee,I,ne),le=await op(X,ee,te,I,ne),de=await jo(`https://api.github.com/repos/${X}/${ee}/git/trees/${le}?recursive=1`,"tree",ne),be=de.response;if(!be.ok)throw Error(`Failed to inspect ${I}: GitHub tree returned ${be.status}`);let Se=JSON.parse(de.content);if(!Array.isArray(Se?.tree))throw Error(`Failed to inspect ${I}: unexpected GitHub tree response`);let Ae=Se.tree,De=[...new Set(Ae.flatMap((Le)=>{if(!Le||typeof Le!=="object")return[];let Ne=Le;if(Ne.type!=="blob"||typeof Ne.path!=="string")return[];let Fe=Ne.path.match(Nt);return Fe?.[1]?[Fe[1]]:[]}))].sort();if(De.length===0)throw Error(`No rulebooks found in ${I} under ${Ee}/`);return{source:I,owner:X,repo:ee,ref:te,commit:le,names:De}}async function Ab(I,q,X,ee){let ne=await jo(`https://api.github.com/repos/${I}/${q}`,"metadata",ee),te=ne.response;if(!te.ok)throw Error(`Failed to inspect ${X}: GitHub returned ${te.status}`);let de=JSON.parse(ne.content)?.default_branch;if(typeof de!=="string"||de==="")throw Error(`Failed to inspect ${X}: missing default branch`);if(!fe(de))throw Error(`GitHub returned an invalid default branch: ${de}`);return de}function _b(I,q,X){Lt(I);let ee=U(q,I),ne=o(s(X,ee));if(ne===null)throw Error(`Rulebook source not found: ${I}`);let te=rp(Ls(ne,"Invalid local rulebook source."));if(te.name!==I)throw Error(`rulebook name "${te.name}" must match local source "${I}"`);return{spec:I,rulebook:te,content:ne}}async function Ib(I,q){let X=j(I),ee=await op(X.owner,X.repo,X.ref,I,q),ne=await jo(`https://raw.githubusercontent.com/${X.owner}/${X.repo}/${ee}/${X.path}`,"raw",q),te=ne.response;if(!te.ok)throw Error(`Failed to fetch ${I}: GitHub raw returned ${te.status}`);let le=ne.content,de=rp(Ls(le,"Invalid GitHub rulebook response."));if(de.name!==X.name)throw Error(`rulebook name "${de.name}" must match GitHub source "${X.name}"`);return{spec:I,rulebook:de,content:le}}function rp(I){let q=ye(I),X=$o(q);if(X.length>0)throw Error(X.join("; "));return q}function Ls(I,q){try{return JSON.parse(I)}catch{throw Error(q)}}async function op(I,q,X,ee,ne){let te=await jo(`https://api.github.com/repos/${I}/${q}/commits/${encodeURIComponent(X)}`,"commit",ne),le=te.response;if(!le.ok)throw Error(`Failed to resolve ${ee}: GitHub returned ${le.status}`);let de=JSON.parse(te.content);if(typeof de?.sha!=="string"||de.sha==="")throw Error(`Failed to resolve commit for ${ee}`);return de.sha}async function Ob(I,q,X={}){if(X.signal?.aborted)throw X.signal.reason;let ee=X.budget??No(),ne=new AbortController,te=()=>ne.abort(X.signal?.reason);X.signal?.addEventListener("abort",te,{once:!0});let le=!1,de=setTimeout(()=>{if(ne.signal.aborted)return;le=!0,ne.abort()},X.timeoutMs??ep.timeoutMs);try{if(X.signal?.aborted)throw X.signal.reason;Yu(ee);let be=await fetch(I,{signal:ne.signal,redirect:"error"});if(!be.ok)return ip(be),{response:be,content:""};return{response:be,content:await $b(be,q,ee,()=>ne.abort())}}catch(be){if(le)throw Error("GitHub request timed out",{cause:be});if(X.signal?.aborted)throw X.signal.reason;throw be}finally{clearTimeout(de),X.signal?.removeEventListener("abort",te)}}function jo(I,q,X){return Ob(X.resolveUrl?.(I)??I,q,{budget:X.budget,signal:X.controller.signal})}async function $b(I,q,X=No(),ee){let ne=ep[`${q}Bytes`],te=Number(I.headers.get("content-length"));if(Number.isFinite(te)&&te>ne)throw ip(I),Error(`GitHub ${q} response exceeds ${ne} bytes`);if(!I.body)return"";let le=I.body.getReader(),de=[],be=0;while(!0){let Se=await le.read();if(Se.done)break;try{Zu(X,Se.value.byteLength)}catch(Ae){throw ee?.(),Qu(le),Ae}if(be+=Se.value.byteLength,be>ne)throw ee?.(),Qu(le),Error(`GitHub ${q} response exceeds ${ne} bytes`);de.push(Buffer.from(Se.value))}return Buffer.concat(de,be).toString("utf-8")}function ip(I){if(!I.body)return;sp(()=>I.body?.cancel())}function Qu(I){sp(()=>I.cancel())}function sp(I){try{Promise.resolve(I()).catch(()=>{})}catch{}}var Db=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function ap(I,q){let X=dp(I.rules,q);if(X.length>0)return{ok:!0,specs:X};return cp(I.rules,q)}function lp(I,q){let X=dp(I,q);if(X.length>0)return{ok:!0,specs:X};let ee=Lb(I,q);if(ee.length>0)return{ok:!0,specs:ee};let ne=jb(I,q);if(!ne.ok)return ne;if(ne.specs.length>0)return{ok:!0,specs:ne.specs};return cp(I,q)}function cp(I,q){let X=I.filter((ee)=>js(ee)?.name===q);if(X.length===1)return{ok:!0,specs:X};return Nb(q,X)}function Nb(I,q){return{ok:!1,result:{ok:!1,errors:q.length===0?[`No configured rulebook matches ${I}`]:[`Ambiguous rulebook match ${I}: ${q.join(", ")}`],entries:[]}}}function dp(I,q){return I.filter((X)=>X===q)}function Lb(I,q){let X=q.match(Db),ee=X?.[1],ne=X?.[2],te=X?.[3];if(!ee||!ne||!te||!fe(te))return[];return up(I,(le)=>le.owner===ee&&le.repo===ne&&le.ref===te)}function jb(I,q){if(!re(q))return{ok:!0,specs:[]};let[X,ee]=q.split("/"),ne=up(I,(le)=>le.owner===X&&le.repo===ee);if(new Set(ne.map((le)=>js(le)?.ref).filter((le)=>!!le)).size<2)return{ok:!0,specs:ne};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${q}. Use an explicit ref:`,`  cc-safety-net rule remove ${q}#<ref>`],entries:[]}}}function js(I){try{return j(I)}catch{return null}}function up(I,q){return I.filter((X)=>{let ee=js(X);return ee?q(ee):!1})}async function Ho(I,q={}){return Hb(I,q,await Fo(I,q,Ln()))}function Hb(I,q,X){if(!X.ok)return X;let ee=gn(I,q),ne=[...new Set(J(ee.configPath,ee.filesystemScope))];if(ne.length===0)return X;return{ok:!1,errors:ne,entries:X.entries}}async function Fo(I,q,X,ee={},ne=new Set,te=new Set){try{let le=gn(I,q),de=Ar(le.configTarget);if(!de.ok)return de.result;let be=de.config,Se=q.only?ap(be,q.only):{ok:!0,specs:be.rules};if(!Se.ok)return Se.result;let Ae=new Set([...q.refresh?Se.specs:[],...ne]),De=(en)=>np(en,le.configDir,le.filesystemScope,X,Ae.has(en),!q.refresh||Ae.has(en)),Le=await Wb(be.rules,q.refresh?(en)=>De(en).then((on)=>({ok:!0,item:on})).catch((on)=>{if(Wu(on))throw on;return{ok:!1,spec:en,message:on instanceof Error?on.message:String(on)}}):async(en)=>({ok:!0,item:await De(en)}),X),Ne=Le.filter((en)=>!en.ok),Fe=Le.filter((en)=>en.ok).map((en)=>en.item),Ge=Fe.flatMap((en)=>Mb(en,be.rules)),Me=Fe.flatMap((en)=>Ub(en,te,le)),nn=new Set([...Ge,...Me].map((en)=>en.spec)),Qe=[...Ne,...Ge,...Me],rn=[],an=Gb(rn,()=>Fe.flatMap((en)=>nn.has(en.spec)||Qe.length>0&&te.has(en.spec)?[]:Bb(en,le,ee,rn)));return{ok:Qe.length===0,errors:Qe.map((en)=>`Failed to update ${en.spec}: ${en.message}`),entries:Fe.map(Vb),changes:an}}catch(le){return Ir(le)}}function Mb(I,q){if(!T(I.spec))return[];let X=Ze(I.spec),ee=q.filter((ne)=>ne!==I.spec&&Ze(ne).toLowerCase()===X.toLowerCase());if(ee.length===0)return[];return[{ok:!1,spec:I.spec,message:`rulebook name "${X}" is also claimed by ${ee.join(", ")}; rename one of them`}]}function Ub(I,q,X){if(!q.has(I.spec)||!T(I.spec))return[];let ee=U(X.configDir,I.rulebook.name),ne=o(s(X.filesystemScope,ee));if(ne===null||ne===I.content)return[];return[{ok:!1,spec:I.spec,message:`${ee} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function Bb(I,q,X,ee){if(!T(I.spec))return[];let ne=U(q.configDir,I.rulebook.name),te=s(q.filesystemScope,ne),le=o(te);if(le===I.content)return[];return ee?.push({target:te,previous:le}),x(te,I.content,void 0,X._testAfterPolicyRename),qb(I,le)}function Gb(I,q){try{return q()}catch(X){for(let ee of[...I].reverse()){if(ee.previous===null){V(ee.target);continue}x(ee.target,ee.previous)}throw X}}function qb(I,q){if(q===null)return[`Vendored ${I.spec} (${I.rulebook.version})`];let X=Pe(q),ee="problem"in X?null:X.rulebook,ne=new Map(ee?.rules.map((le)=>[le.name,JSON.stringify(le)])??[]),te=new Set(I.rulebook.rules.map((le)=>le.name));return[`Updated ${I.spec} (${ee?.version??"unreadable"} -> ${I.rulebook.version})`,...[...te].filter((le)=>!ne.has(le)).map((le)=>`  + ${le}`),...[...ne.keys()].filter((le)=>!te.has(le)).map((le)=>`  - ${le}`),...I.rulebook.rules.filter((le)=>{let de=ne.get(le.name);return de!==void 0&&de!==JSON.stringify(le)}).map((le)=>`  ~ ${le.name}`)]}function Vb(I){return{spec:I.spec,name:I.rulebook.name,version:I.rulebook.version,ruleCount:I.rulebook.rules.length}}async function pp(I,q,X={}){return Kb(I,q,X,Ln())}async function Kb(I,q,X,ee,ne={}){let te=null,le=!1;try{let de=gn(I,X),be=o(de.configTarget);te={target:de.configTarget,content:be};let Se=Ar(de.configTarget);if(!Se.ok)return Se.result;let Ae=Se.config,De=re(q)?await tp(q,{ref:X.ref,operation:ee}):null,Le=De?Jb(De,X.rulebooks):[],Ne=De?Le.map((Qe)=>zb(Ae.rules,De,Qe)??`${q}#${De.ref}/${Qe}`):[q],Fe=Ne.filter((Qe)=>!Ae.rules.includes(Qe)),Ge=[...Ae.rules,...Fe];if(Ge.length>ke)return Yb();if(Ge.length!==Ae.rules.length)le=!0,hn(de.configTarget,{...Ae,rules:Ge},void 0,ne._testAfterPolicyRename);let Me=await Fo(I,X,ee,ne,new Set(Fe),new Set(Fe));if(!Me.ok)_r(de.configTarget,be);if(!Me.ok||!De)return Me;let nn=Le.filter((Qe,rn)=>Fe.includes(Ne[rn]??""));return{...Me,add:{source:q,ref:De.ref,selected:Le,added:nn,alreadyConfigured:Le.filter((Qe)=>!nn.includes(Qe)),commits:Fe.length>0?[De.commit]:[]}}}catch(de){if(le&&te)try{_r(te.target,te.content)}catch(be){return Ir(be)}return Ir(de)}}function Jb(I,q){let X=q?[...new Set(q)]:I.names,ee=X.filter((ne)=>!I.names.includes(ne));if(ee.length>0)throw Error(`Rulebooks not found in ${I.source} at ${I.ref}: ${ee.join(", ")}
Available rulebooks: ${I.names.join(", ")}`);return X}function zb(I,q,X){let ee=`${q.source}#${q.ref}/${X}`;if(I.includes(ee))return ee;let ne=`${q.source}#${q.commit}/${X}`;return I.find((te)=>te===ne)}async function Wb(I,q,X=Ln()){if(I.length>ke)throw Error(Re);let ee=[],ne=0,te,le=Array.from({length:Math.min(I.length,Do.concurrency)},async()=>{while(!te){let de=ne;if(de>=I.length)return;ne++;try{ee[de]=await q(I[de],de,X.controller.signal)}catch(be){if(!te)te={value:be},ne=I.length,X.controller.abort(be);return}}});if(await Promise.all(le),te)throw te.value;return ee}function Yb(){return{ok:!1,errors:[Re],entries:[]}}async function fp(I,q,X={}){try{return await Zb(I,q,X,{})}catch(ee){return Ir(ee)}}async function Zb(I,q,X,ee){let ne=gn(I,X),te=f(ne.configTarget);if(te.errors.length>0)return{ok:!1,errors:te.errors,entries:[]};if(!te.config)return{ok:!1,errors:[`No config found at ${ne.configPath}`],entries:[]};let le=lp(te.config.rules,q);if(!le.ok)return le.result;let de=X.deleteSource?Xb(ne.configDir,le.specs,ne.filesystemScope):{ok:!0,dirs:[]};if(!de.ok)return de.result;let be=o(ne.configTarget);if(be===null)return Ir(Error("Rules config is unavailable."));try{hn(ne.configTarget,{...te.config,rules:te.config.rules.filter((De)=>!le.specs.includes(De))},void 0,ee._testAfterPolicyRename)}catch(De){throw _r(ne.configTarget,be),De}let Se=await Fo(I,X,Ln(),ee);if(!Se.ok)return _r(ne.configTarget,be),Se;let Ae=Qb(de.dirs,ee,ne.filesystemScope);if(!Ae.ok){_r(ne.configTarget,be);let De=await Fo(I,X,Ln(),ee);if(!De.ok)return{ok:!1,errors:[...Ae.result.errors,...De.errors],entries:De.entries};return Ae.result}return Se}function Xb(I,q,X){let ee=q.flatMap((de)=>m.test(de)?[]:["--delete-source can only delete local rulebook sources"]),ne=q.map((de)=>Fs(I,de)),te=ee.length>0?[]:ne.flatMap((de)=>mp(de,X)),le=[...ee,...te];return le.length>0?{ok:!1,result:{ok:!1,errors:le,entries:[]}}:{ok:!0,dirs:ne}}function mp(I,q){let X=Fb(I),ee=s(q,X),ne=we(ee);if(!ne)return[`Local rulebook source directory not found: ${I}`];let te=ne.find((le)=>le.name==="rulebook.json");if(!te)return[`Local rulebook source directory is missing rulebook.json: ${I}`];if(te.kind!=="file")throw new i(q.label);if(o(s(q,Fs(X,"rulebook.json"))),ne.length>1)return[`Local rulebook source directory contains extra files: ${I}. delete manually if you really want to remove the directory.`];return[]}function Qb(I,q,X){let ee=I.flatMap((ne)=>{try{if(!we(s(X,ne)))return[];let te=mp(ne,X);if(te.length>0)return te;return ew(ne,q,X),[]}catch(te){return[`Failed to delete local rulebook source ${ne}: ${te instanceof Error?te.message:String(te)}`]}});return ee.length>0?{ok:!1,result:{ok:!1,errors:ee,entries:[]}}:{ok:!0}}function ew(I,q,X){if(q._testDeleteLocalSourceDir){q._testDeleteLocalSourceDir(I);return}V(s(X,Fs(I,Ce))),Dt(s(X,I))}function _r(I,q){if(q===null){V(I);return}x(I,q)}function Ir(I){return{ok:!1,errors:[I instanceof Error?I.message:String(I)],entries:[]}}var nw=".safety-net.json",tw="~/.cc-safety-net/config.json";async function vp(I,q){let X=L(I,{cwd:q.cwd});if(X)console.log(`Skipped the project scope: ${D(q.cwd)} is the user rule config, not a project rule config`);return[X||await hp(I,{legacyPath:Ut(q.cwd),configPath:D(q.cwd),defaultRulebookName:"project-rules",migratedFrom:nw,cleanup:q.cleanup,syncOptions:{cwd:q.cwd}}),await hp(I,{legacyPath:Bt(I),configPath:K(I),defaultRulebookName:"user-rules",migratedFrom:tw,cleanup:q.cleanup,syncOptions:{cwd:q.cwd,global:!0}})].every((ne)=>ne)?0:1}async function hp(I,q){let X=gn(I,q.syncOptions),ee=s(X.filesystemScope,q.legacyPath),ne=o(ee);if(ne===null)return console.log(`No legacy config found at ${q.legacyPath}`),!0;let te=ow(ne);if(!te.ok){for(let Ne of te.errors)console.error(Ne);return!1}let le=f(X.configTarget);if(le.errors.length>0){for(let Ne of le.errors)console.error(Ne);return!1}let de=le.config??ge,be=iw(gp(q.configPath),de.rules,q.defaultRulebookName,q.migratedFrom,X.filesystemScope),Se=Mo(gp(q.configPath),be,"rulebook.json"),Ae=s(X.filesystemScope,Se),De=[yp(X.configTarget),yp(Ae)],Le=await rw(I,q,X.configTarget,Ae,be,te.config.rules,{...de,rules:de.rules.includes(be)?de.rules:[...de.rules,be]});if(!Le.ok){lw(De);for(let Ne of Le.errors)console.error(Ne);return!1}if(!q.cleanup)return console.log(`Migrated legacy config at ${q.legacyPath}. Legacy file is no longer used.`),!0;if(!aw(X.configTarget,Ae,be,q.migratedFrom,te.config.rules))return console.error(`Migration cleanup verification failed for ${q.legacyPath}`),!1;return V(ee),console.log(`Deleted legacy config at ${q.legacyPath}`),!0}async function rw(I,q,X,ee,ne,te,le){try{return hn(X,le),hn(ee,sw(ne,q.migratedFrom,te)),await Ho(I,q.syncOptions)}catch(de){return{ok:!1,errors:[de instanceof Error?de.message:String(de)]}}}function ow(I){try{let q=JSON.parse(I),X=Qo(q);if(X.errors.length>0)return{ok:!1,errors:X.errors};return{ok:!0,config:{version:1,rules:q.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function iw(I,q,X,ee,ne){let te=q.find((le)=>cw(s(ne,Mo(I,le,"rulebook.json")))===ee);if(te)return te;if(o(s(ne,Mo(I,X,"rulebook.json")))===null)return X;for(let le=2;;le++){let de=`${X}-${le}`;if(o(s(ne,Mo(I,de,"rulebook.json")))===null)return de}}function sw(I,q,X){return{rulebook_version:1,name:I,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:q,allowed_commands:[...new Set(X.map((ee)=>ee.command))],rules:X,tests:X.map((ee)=>({command:[ee.command,ee.subcommand,ee.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:ee.name}))}}function aw(I,q,X,ee,ne){if(!f(I).config?.rules.includes(X))return!1;try{let le=o(q);if(le===null)return!1;let de=JSON.parse(le);return de.migrated_from===ee&&JSON.stringify(de.rules)===JSON.stringify(ne)}catch{return!1}}function yp(I){return{target:I,content:o(I)}}function lw(I){for(let q of I){if(q.content===null){V(q.target);continue}x(q.target,q.content)}}function cw(I){let q=o(I);if(q===null)return null;try{let X=JSON.parse(q);return typeof X.migrated_from==="string"?X.migrated_from:null}catch{return null}}import{mkdir as dw,readFile as uw,writeFile as pw}from"node:fs/promises";import{dirname as fw,join as mw}from"node:path";var gw=86400000,hw=604800000;async function wp(I,q=Date.now()){if(I.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let X=ut(I);if(!X)return null;let ee=mw(X,".cc-safety-net","update-check.json"),ne=await yw(ee,q);if(!ne.lastCheck||q-ne.lastCheck>gw){let de=await Fn();if(ne.lastCheck=q,de.latestVersion)ne.latestVersion=de.latestVersion;if(!await bp(ee,ne))return null;if(de.error)return null}let te=ne.latestVersion,le=dn();if(!te||!ii(te,le))return null;if(ne.notifiedVersion===te&&ne.notifiedAt!==void 0&&q-ne.notifiedAt<hw)return null;if(ne.notifiedVersion=te,ne.notifiedAt=q,!await bp(ee,ne))return null;return`UPDATE_AVAILABLE: cc-safety-net v${te} is available (running v${le}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function yw(I,q){let X=await uw(I,"utf8").then((te)=>JSON.parse(te)).catch(()=>{return});if(!X||typeof X!=="object"||Array.isArray(X))return{};let ee=X,ne=(te)=>typeof te==="number"&&Number.isFinite(te)&&te<=q?te:void 0;return{lastCheck:ne(ee.lastCheck),latestVersion:typeof ee.latestVersion==="string"?ee.latestVersion:void 0,notifiedVersion:typeof ee.notifiedVersion==="string"?ee.notifiedVersion:void 0,notifiedAt:ne(ee.notifiedAt)}}async function bp(I,q){return dw(fw(I),{recursive:!0,mode:448}).then(()=>pw(I,JSON.stringify(q),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as Cw,resolve as Us}from"node:path";var kp=new Map([["Bash","posix"],["PowerShell","powershell"],["Monitor","posix"]]);var Cp=new Map([["Bash","auto"]]);var xp=new Map([["bash","auto"],["Bash","auto"],["powershell","powershell"],["PowerShell","powershell"]]);var Pp=new Map([["Shell","auto"]]);var Sp=new Map([["exec","auto"]]),Rp="write_to_process";var Ep=new Map([["Execute","auto"]]);var Tp=new Map([["run_shell_command","auto"]]);var Ap=new Map([["run_terminal_command","auto"],["run_terminal_cmd","auto"],["monitor","auto"],["bash","auto"],["Shell","auto"]]);var _p=new Map([["terminal","posix"]]);var Ip=new Map([["Bash","posix"]]);var Op="exec";var ww=[["antigravity-cli",[...il.keys(),sl]],["claude-code",[...kp.keys()]],["codex",[...Cp.keys()]],["copilot-cli",[...xp.keys()]],["cursor",[...Pp.keys()]],["deepseek-harness",[...We.keys()]],["devin",[...Sp.keys(),Rp]],["droid",[...Ep.keys()]],["gemini-cli",[...Tp.keys()]],["grok-build",[...Ap.keys()]],["hermes-agent",[..._p.keys()]],["kimi-code",[...Ip.keys()]],["openclaw",[Op]],["opencode",[it,Ie]],["pi",[...ct.keys()]]].flatMap(([I,q])=>q.map((X)=>({name:X,integration:ln(I)}))),$p="and is already analyzed. Built-in tools cannot be declared.";function Uo(I){let q=$e(I),X=[...new Set(ww.filter((ee)=>$e(ee.name)===q).map((ee)=>ee.integration))].sort((ee,ne)=>ee.localeCompare(ne));if(X.length>0)return`"${I}" is a built-in shell tool of ${kw(X)}, ${$p}`;if(b(I)!=="unknown")return`"${I}" is a built-in file tool, ${$p}`;return}function kw(I){return I.length===1?I[0]??"":`${I.slice(0,-1).join(", ")} and ${I.at(-1)}`}var Np="CC Safety Net Config",xw="═".repeat(Np.length),Pw="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",Sw=new Set(["rule.json","rule.lock","cache"]);function Lp(I,q={}){try{return Rw(I,q)}catch(X){if(X instanceof i)return console.error(X.message),1;throw X}}function Rw(I,q){let X=q.cwd??process.cwd(),ee=oe(I,{cwd:X}),ne=Bt(I),te=Ut(X),le=Us(X,Ee),de=s(ee.userScope,ne),be=s(ee.projectScope,te),Se=!1,Ae=!1,De=[],Le=[],Ne=Ew(s(ee.projectScope,le));if(Aw(),o(ee.userConfigTarget)!==null){let Fe=jn(ee.userConfigTarget);if(Fe.errors.push(...J(ee.userConfigPath,ee.userScope),...Dp(ee.userConfigTarget)),De.push({scope:"User",path:ee.userConfigPath,result:Fe,schema:"rules",target:ee.userConfigTarget}),Fe.errors.length>0)Se=!0}if(o(de)!==null)if(Ae=!0,o(ee.userConfigTarget)!==null)Le.push(Bo("user","cleanup"));else{let Fe=ei(de);if(De.push({scope:"User",path:ne,result:Fe,schema:"legacy",inactive:!0,target:de}),Le.push(Bo("user",Fe.errors.length>0?"fix-or-delete":"migrate")),Fe.errors.length>0)Se=!0}if(o(ee.projectConfigTarget)!==null){let Fe=jn(ee.projectConfigTarget);if(Fe.errors.push(...J(ee.projectConfigPath,ee.projectScope),...Dp(ee.projectConfigTarget)),De.push({scope:"Project",path:Us(ee.projectConfigPath),result:Fe,schema:"rules",target:ee.projectConfigTarget}),Fe.errors.length>0)Se=!0;if(o(be)!==null)Ae=!0,Le.push(Bo("project","cleanup"))}else if(o(be)!==null){Ae=!0,Se=!0;let Fe=ei(be);De.push({scope:"Project",path:Us(te),result:Fe,schema:"legacy",inactive:!0,target:be}),Le.push(Bo("project",Fe.errors.length>0?"fix-or-delete":"migrate"))}if(Ne?.result.errors.length)Se=!0;if(De.length===0&&!Ne)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Fe of De)if(Fe.inactive)Iw(Fe.scope,Fe.path,Fe.result);else if(Fe.result.errors.length>0)Ow(Fe.scope,Fe.path,Fe.result.errors);else{if(Fe.schema==="rules"&&Nw(Fe.target))console.log(`
Added $schema to ${Fe.scope.toLowerCase()} config.`);_w(Fe.scope,Fe.path,Fe.result,Fe.schema)}for(let Fe of Le)console.error(`
${qe.red(Fe)}`);if(Ne)if(Ne.result.errors.length>0)Dw(Ne.path,Ne.result.errors);else $w(Ne.path,Ne.result);if(Se)return console.error(`
Config validation failed.`),1;return console.log(Ae?`
Configs valid with warnings.`:`
All configs valid.`),0}function Dp(I){return(f(I).config?.command_tools??[]).flatMap((q)=>Uo(typeof q==="string"?q:q.name)??[])}function Bo(I,q){let X=`legacy ${I} config`;if(q==="cleanup")return`Warning: Legacy ${I} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(q==="migrate")return`Warning: Legacy ${I} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${I} config is no longer supported. Fix or delete the ${X}, then run \`npx -y cc-safety-net rule migrate\`.`}function Ew(I){if(we(I)===null)return null;let q=Tw(I);if(q.ruleNames.size===0&&q.errors.length===0)return null;return{path:I.path,result:q}}function Tw(I){let q=[],X=new Set,ee=(we(I)??[]).filter((ne)=>!Sw.has(ne.name)).sort((ne,te)=>ne.name.localeCompare(te.name));if(ee.length===0)return{errors:q,ruleNames:X};for(let ne of ee){if(!m.test(ne.name)){q.push(`rulebook directory names must match ${m}: ${ne.name}`);continue}if(ne.kind!=="directory"){q.push(`${ne.name} must be a rulebook directory`);continue}let te=s(I.scope,Cw(I.path,ne.name,"rulebook.json")),le=o(te);if(le===null){q.push(`${ne.name}/rulebook.json is required`);continue}try{let de;try{de=JSON.parse(le)}catch{q.push(`${ne.name}/rulebook.json: invalid JSON`);continue}let be=ye(de);if(be.name!==ne.name){q.push(`rulebook name "${be.name}" must match folder "${ne.name}"`);continue}let Se=$o(be);if(Se.length>0){q.push(...Se.map((Ae)=>`${ne.name}/rulebook.json: ${Ae}`));continue}X.add(ne.name)}catch(de){q.push(de instanceof Error?`${ne.name}/rulebook.json: ${de.message}`:`${ne.name}/rulebook.json: ${String(de)}`)}}return{errors:q,ruleNames:X}}function Aw(){console.log(Np),console.log(xw)}function _w(I,q,X,ee){if(console.log(`
✓ ${I} config: ${q}`),console.log(`  Schema: ${ee==="rules"?"rulebook sources":"legacy inline rules"}`),X.ruleNames.size>0){console.log(`  ${ee==="rules"?"Sources":"Rules"}:`);let ne=1;for(let te of X.ruleNames)console.log(`    ${ne}. ${te}`),ne++}else console.log(`  ${ee==="rules"?"Sources":"Rules"}: (none)`)}function Iw(I,q,X){if(console.error(`
✗ Legacy ${I.toLowerCase()} config: ${q}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),X.errors.length>0){console.error("  Errors:");let ee=1;for(let ne of X.errors)for(let te of ne.split("; "))console.error(`    ${ee}. ${te}`),ee++;return}if(X.ruleNames.size>0){console.error("  Rules:");let ee=1;for(let ne of X.ruleNames)console.error(`    ${ee}. ${ne}`),ee++;return}console.error("  Rules: (none)")}function Ow(I,q,X){jp(`${I} config`,q,X)}function $w(I,q){console.log(`
✓ GitHub source rules: ${I}`),console.log("  Rulebooks:");let X=1;for(let ee of q.ruleNames)console.log(`    ${X}. ${ee}`),X++}function Dw(I,q){jp("GitHub source rules",I,q)}function jp(I,q,X){console.error(`
✗ ${I}: ${q}`),console.error("  Errors:");let ee=1;for(let ne of X)for(let te of ne.split("; "))console.error(`    ${ee}. ${te}`),ee++}function Nw(I){try{let q=o(I);if(q===null)return!1;let X=JSON.parse(q);if(X.$schema)return!1;return x(I,JSON.stringify({$schema:Pw,...X},null,2)),!0}catch(q){if(q instanceof i)throw q;return!1}}var Fp=new Set(["init","add","remove","update","sync","list","wrapper","tool","migrate","doc","verify"]),jw=new Set(["init","add","remove","update","sync","wrapper"]),Mp=new Set(["add","remove","list"]),Fw="cc-safety-net/rulebooks";async function Up(I,q){try{return await Hw(I,q)}catch(X){if(X instanceof i)return console.error(X.message),1;throw X}}async function Hw(I,q){let X=Uw(q),ee=X.help?Mw(X.positionals):null;if(ee)return er(ee),0;if(X.errors.length>0){for(let Se of X.errors)console.error(Se);return 1}let ne=X.positionals[0];if(!ne)return er(Ht,console.error),1;let te=X.positionals[1],le={global:X.global},de=process.cwd();if((ne==="tool"?X.project:!X.global&&jw.has(ne)&&!(ne==="wrapper"&&te==="list"))&&L(I,{cwd:de}))return console.error(`${D(de)} is the user rule config, not a project rule config; ${ne==="tool"?"drop --project":"use --global"} for the user scope, or run from a project directory`),1;if(ne==="init"){let Se=gn(I,le);qw(Se.configTarget);let Ae=Lw(Se.configDir,"example-rules","rulebook.json"),De=s(Se.filesystemScope,Ae);if(X.example&&o(De)===null)zu(De);let Le=J(Se.configPath,Se.filesystemScope);for(let Ne of Le)console.error(Ne);if(Le.length>0)return 1;return console.log("Rule config initialized."),0}if(ne==="add"){let Se=Bp(X);if(!Se)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let Ae=gn(I,le),De=await pp(I,Se,{...le,ref:X.ref,rulebooks:X.only.length>0?X.only:void 0});return Bu(De,Se,`Scope: ${X.global?"user":"project"} (${Ae.configDir})`),De.ok?0:1}if(ne==="remove"){if(!te)return console.error("rule remove requires a source"),1;let Se=await fp(I,te,{...le,deleteSource:X.deleteSource});return Oo(Se,`Removed rulebook source: ${te}`),Se.ok?0:1}if(ne==="update"){let Se=await Ho(I,{...le,only:te,refresh:!0});return Oo(Se,"Rule config updated."),Se.ok?0:1}if(ne==="sync")return Za(I,{global:X.global});if(ne==="list"){let Se=ie(I,{cwd:de});return qu(Se),Se.errors.length>0?1:0}if(ne==="wrapper")return Vw(I,X);if(ne==="tool")return Jw(I,X,de);if(ne==="migrate")return vp(I,{cleanup:X.cleanup,cwd:de});if(ne==="doc"){console.log(Mu);let Se=await wp(I);if(Se)console.error(Se);return 0}if(ne==="verify")return Lp(I);return 1}function Mw(I){if(I.length===0)return Ht;let q=Ht.subcommands.filter((ee)=>ee.usage.split(" ")[0]===I[0]);if(q.length===0)return null;if(I.length===1&&q.length>1)return{name:`rule ${I[0]}`,description:`Subcommands of rule ${I[0]}`,usage:`rule ${I[0]} <subcommand>`,subcommands:q,options:[]};let X=I.length===1?q[0]:q.find((ee)=>ee.usage.split(" ")[1]===I[1]);if(!X)return null;return{name:`rule ${I[0]}`,description:X.description,usage:`rule ${X.usage}`,options:I[0]==="add"?Yo:[],examples:I[0]==="add"?Zo:void 0}}function Uw(I){let q=pn({label:"rule",booleans:{global:["-g","--global"],project:["--project"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"],cwdArg:["--cwd-arg"]},lists:{only:["--only"]},positionals:"list"},I),X={...q.flags,ref:q.values.ref,cwdArg:q.values.cwdArg,only:q.lists.only??[],help:q.help,positionals:q.positionals,errors:q.errors};return Bw(X),X}function Bw(I){let[q]=I.positionals;if(q&&!Fp.has(q))I.errors.push(`Unknown rule subcommand: ${q}`);if(I.deleteSource&&q!=="remove")if(q&&Fp.has(q))I.errors.push(`Unknown option for rule ${q}: --delete-source`);else I.errors.push("--delete-source is only valid with 'rule remove'");if(I.cleanup&&q!=="migrate")I.errors.push(Vn(q,"--cleanup"));if(I.example&&q!=="init")I.errors.push(Vn(q,"--example"));if(I.ref&&q!=="add")I.errors.push(Vn(q,"--ref"));if(I.only.length>0&&q!=="add")I.errors.push(Vn(q,"--only"));let X=q==="tool"?I.positionals[1]:void 0,ee=X&&Mp.has(X)?`tool ${X}`:q;if(I.project&&X!=="add"&&X!=="remove")I.errors.push(Vn(ee,"--project"));if(I.cwdArg!==void 0&&X!=="add")I.errors.push(Vn(ee,"--cwd-arg"));if(q==="tool"&&I.global)I.errors.push(Vn(q,"--global"));if(q==="add")Gw(I);if(q==="migrate"){if(I.global)I.errors.push(Vn(q,"--global"));if(I.positionals.length>1)I.errors.push(`Unexpected rule migrate argument: ${I.positionals[1]}`)}else if(q==="wrapper")Hp(I,"a command");else if(q==="tool")Hp(I,"a tool name");else if(I.positionals.length>2)I.errors.push(`Unexpected rule argument: ${I.positionals[2]}`);if(q==="list"&&I.global)I.errors.push("Unknown option for rule list: --global")}function Bp(I){if(I.positionals[1])return I.positionals[1];if(I.ref||I.only.length>0)return Fw;return}function Gw(I){let q=Bp(I);if(!q)return;if((I.ref||I.only.length>0)&&!re(q)){if(I.ref)I.errors.push(`--ref can only select a ref for an owner/repo source: ${q}`);if(I.only.length>0)I.errors.push("--only can only select rulebooks from an owner/repo source");return}if(I.ref&&!fe(I.ref))I.errors.push(`--ref must use valid path segments: ${I.ref}`);let X=I.only.filter((ee)=>!m.test(ee));if(X.length>0)I.errors.push(`Invalid rulebook names: ${X.join(", ")}`)}function Vn(I,q){return I?`Unknown option for rule ${I}: ${q}`:`Unknown option for rule: ${q}`}function Hp(I,q){let X=I.positionals[0],ee=I.positionals[1],ne=I.positionals[2];if(!ee){I.errors.push(`rule ${X} requires add, remove, or list`);return}if(!Mp.has(ee)){I.errors.push(`Unknown rule ${X} action: ${ee}`);return}if(ee==="list"){if(ne)I.errors.push(`Unexpected rule ${X} argument: ${ne}`);return}if(!ne){I.errors.push(`rule ${X} ${ee} requires ${q}`);return}if(X!=="tool"&&I.positionals.length>3)I.errors.push(`Unexpected rule ${X} argument: ${I.positionals[3]}`)}function qw(I){if(o(I)===null){Ju(I);return}let q=f(I);if(!q.config)return;hn(I,q.config)}async function Vw(I,q){let X=q.positionals[1],ee=q.positionals[2],ne=gn(I,{global:q.global}).configTarget;if(X==="list"){let be=f(ne);if(be.errors.length>0){for(let Se of be.errors)console.error(Se);return 1}return Kw(be.config?.transparent_wrappers??[]),0}if(!ee||!P.test(ee))return console.error("transparent wrapper must match command pattern"),1;if(Ve(ee))return console.error(`reserved command "${ee}" cannot be a wrapper`),1;let te=f(ne);if(te.errors.length>0){for(let be of te.errors)console.error(be);return 1}let le=te.config??ge,de=X==="add"?[...new Set([...le.transparent_wrappers??[],ee])]:(le.transparent_wrappers??[]).filter((be)=>be!==ee);return hn(ne,{...le,transparent_wrappers:de}),console.log(X==="add"?`Added transparent wrapper: ${ee}`:`Removed transparent wrapper: ${ee}`),0}function Kw(I){if(I.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${I.length}):`);for(let q of I)console.log(`  - ${q}`)}function Jw(I,q,X){let ee=q.positionals[1],ne=[...new Set(q.positionals.slice(2))];if(ee==="list")return zw(I,X);let te=[...ne.flatMap((Se)=>{if(!Je.test(Se))return[`"${Se}" is not a tool name: ${Te}.`];let Ae=ee==="add"?Uo(Se):void 0;return Ae?[Ae]:[]}),...q.cwdArg!==void 0&&!Je.test(q.cwdArg)?[`"${q.cwdArg}" is not an argument name: ${Te}.`]:[]];if(te.length>0){for(let Se of te)console.error(qe.red(`Error: ${Se}`));return 1}let le=gn(I,{global:!q.project}),de=Ar(le.configTarget);if(!de.ok){for(let Se of de.result.errors)console.error(Se);return 1}let be=ne.reduce((Se,Ae)=>{let De=q.cwdArg===void 0?Ae:{name:Ae,cwd:q.cwdArg},Le=(Ne)=>(typeof Ne==="string"?Ne:Ne.name)===Ae;if(ee==="remove")return Se.filter((Ne)=>!Le(Ne));return Se.some(Le)?Se.map((Ne)=>Le(Ne)?De:Ne):[...Se,De]},de.config.command_tools??[]);hn(le.configTarget,{...de.config,command_tools:be});for(let Se of ne)console.log(ee==="add"?`Added command tool: ${Se}${q.cwdArg===void 0?"":` (cwd argument: ${q.cwdArg})`}`:`Removed command tool: ${Se}`);return console.log(`Scope: ${q.project?"project":"user"} (${le.configPath})`),0}function zw(I,q){let X=(L(I,{cwd:q})?["user"]:["user","project"]).map((ne)=>{let te=gn(I,{global:ne==="user"});return{scope:ne,path:te.configPath,...f(te.configTarget)}}),ee=X.flatMap((ne)=>ne.errors.map((te)=>`${ne.path}: ${te}`));if(ee.length>0){for(let ne of ee)console.error(ne);return 1}return Vu(X.flatMap((ne)=>(ne.config?.command_tools??[]).map((te)=>({scope:ne.scope,tool:te})))),0}import{sep as ek}from"node:path";import{existsSync as Ww,readFileSync as Yw}from"node:fs";import{join as Zw}from"node:path";async function Xw(I){if(I.isTTY)return null;return(await gt(I).catch(()=>null))?.trim()||null}function Qw(I){let q=I.env.get("CLAUDE_SETTINGS_PATH");if(q)return q;return Zw(Wr(I),"settings.json")}function Bs(I){let q=Qw(I);if(!Ww(q))return!1;try{let X=Yw(q,"utf-8"),ee=JSON.parse(X);if(!ee.enabledPlugins)return!1;let ne="cc-safety-net@cc-marketplace";if(!(ne in ee.enabledPlugins))return!1;return ee.enabledPlugins[ne]===!0}catch(X){if(k(r.debug,I.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${q}: ${X instanceof Error?X.message:String(X)}`);return!1}}async function Gs(I,q=process.stdin){let X=Bs(I),ee;if(!X)ee="\uD83D\uDEE1️ CC Safety Net ❌";else{let te=w(I,{cwd:process.cwd()}),le=te.policy,de=O(le,I.env),be=Object.values(Z(le,de.capabilities)).some((De)=>De.changesInherited),Se={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[be?"custom":de.effectiveLevel],Ae=te.policyScopes&&!te.policyScopes.weakeningsIgnored&&te.policyScopes.weakenings.length>0?"\uD83D\uDD3B":"";ee=`\uD83D\uDEE1️ CC Safety Net ${Se}${de.worktreeMode?"\uD83C\uDF33":""}${Ae}${te.state==="degraded"?"⚠️":""}`}let ne=await Xw(q);if(ne&&!ne.startsWith("{"))console.log(`${ne} | ${ee}`);else console.log(ee)}function Gp(I){let q=w(I,{cwd:process.cwd()}),X=q.policy,ee=O(X,I.env),ne=!!process.env.NO_COLOR||!process.stdout.isTTY,te=Math.min(process.stdout.columns||80,100),le=ne?"ok":"✔",de=ne?"OFF":"✘",be=(Ge,Me)=>{let nn=`  ${Ge.padEnd(13)}${Me}`;return(nn.length>te?`${nn.slice(0,te-1)}…`:nn).replaceAll(de,qe.red(de))},Se=Object.values(Z(X,ee.capabilities)).some((Ge)=>Ge.changesInherited),Ae=(Ge)=>Ge===I.home||Ge.startsWith(`${I.home}${ek}`)?`~${Ge.slice(I.home.length)}`:Ge,De={ready:qe.green,degraded:qe.yellow}[q.state],Le=q.policyScopes?.weakenings??[],Ne=[...Bs(I)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...q.diagnostics],Fe=ne?"-":"·";console.log([`${ne?"":"\uD83D\uDEE1️  "}CC Safety Net — ${De(q.state)}`,"",be("Protection",`destructive ${X.destructiveCommandProtectionEnabled?le:de}   secrets ${X.secretProtection.enabled?le:de}`),be("Level",Se?`${ee.effectiveLevel} (customised)`:ee.effectiveLevel),be("Rules",X.rules.length===0?"none active":`${X.rules.length} active`),be("Policy",Ae(p(I))),...q.policyScopes?[be("Project",Ae(S(process.cwd())))]:[],...ee.worktreeMode?[be("Worktree","relaxations active")]:[],"",...Le.length===0?[]:[q.policyScopes?.weakeningsIgnored?"  Project policy (ignored)":"  Project policy",...Le.flatMap((Ge)=>br(Ge,"      ",te-6).map((Me,nn)=>nn===0?`    ${Me}`:Me)),""],...Ne.length===0?["  Everything configured is active."]:["  Not active",...Ne.flatMap((Ge)=>br(Ge,"      ",te-6).map((Me,nn)=>nn===0?`    ${Fe} ${Me}`:Me)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as cf}from"node:child_process";import{randomBytes as dk}from"node:crypto";import{existsSync as df,mkdirSync as uk,readFileSync as pk}from"node:fs";import{createServer as fk}from"node:http";import{dirname as uf,join as mk}from"node:path";import{Writable as gk}from"node:stream";var Go=500;function nk(I){let q=I.filter((ne)=>ne.decision!=="allow"),X=I.filter((ne)=>ne.decision==="allow"),ee=Math.min(q.length,Math.max(Go-X.length,Math.ceil(Go/2)));return[...q.slice(0,ee),...X.slice(0,Go-ee)]}function qp(I,q,X=W(I)){if(X)Q(I,X);let ee=(Me)=>new Date(Me.getFullYear(),Me.getMonth(),Me.getDate()).getTime(),ne=ee(new Date),te=new Date(ne);te.setDate(te.getDate()-(q-1));let le=te.getTime(),de=[],be={count:0};for(let Me of X?Kn(X,be):[])for(let nn of Ft(Me,be)){let Qe=new Date(nn.ts).getTime();if(!Number.isFinite(Qe))continue;if(Qe>=le)de.push(nn)}de.sort((Me,nn)=>new Date(nn.ts).getTime()-new Date(Me.ts).getTime());let Se=Array.from({length:q},()=>0),Ae=Array.from({length:q},()=>0),De={},Le={},Ne={},Fe=0,Ge=0;for(let Me of de){let nn=Me.agent||"unknown";De[nn]=(De[nn]??0)+1;let Qe=Math.round((ne-ee(new Date(Me.ts)))/86400000),rn=q-1-Qe,an=Qe>=0&&Qe<q;if(an)Ae[rn]=(Ae[rn]??0)+1;if(Me.decision!=="allow"){if(Fe++,Me.ruleId)Le[Me.ruleId]=(Le[Me.ruleId]??0)+1;let en=Jo(Me.segment||Me.command);if(en)Ne[en]=(Ne[en]??0)+1;if(Me.failureStage)Ge++;if(an)Se[rn]=(Se[rn]??0)+1}}return{days:q,logsDir:X,homeDir:I.home,totalInWindow:de.length,truncated:de.length>Go,unreadable:be.count,counts:{blocked:Fe,allowed:de.length-Fe,agents:De,blockedByDay:Se,analyzedByDay:Ae,rules:Le,commands:Ne,errors:Ge},entries:nk(de).sort((Me,nn)=>new Date(nn.ts).getTime()-new Date(Me.ts).getTime())}}import{spawn as tk}from"node:child_process";import{existsSync as rk,statSync as Vp}from"node:fs";import{delimiter as ok,join as ik}from"node:path";var sk=120000,qo="Choose the project folder",ak=`try
  return POSIX path of (choose folder with prompt "${qo}")
on error number -128
  return ""
end try`,lk=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${qo}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Kp=[{binary:"zenity",args:["--file-selection","--directory",`--title=${qo}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",qo]}],Jp=(I,q)=>(q.PATH??"").split(ok).some((X)=>{if(X.length===0)return!1;try{let ee=Vp(ik(X,I));return ee.isFile()&&(ee.mode&73)!==0}catch{return!1}});function qs(I,q){if(I==="darwin"||I==="win32")return!0;if(I!=="linux")return!1;if(!q.DISPLAY&&!q.WAYLAND_DISPLAY)return!1;return Kp.some((X)=>Jp(X.binary,q))}function ck(I,q){if(I==="darwin")return{cmd:"osascript",args:["-e",ak]};if(I==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",lk]};let X=Kp.find((ee)=>Jp(ee.binary,q));return X?{cmd:X.binary,args:X.args}:null}function Vs(I=process.platform,q=process.env){let X=ck(I,q);if(!X)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((ee)=>{let ne=tk(X.cmd,X.args,{env:q,stdio:["ignore","pipe","pipe"]}),te="",le=!1,de=(Se)=>{if(le)return;le=!0,clearTimeout(be),ee(Se)},be=setTimeout(()=>{ne.kill(),de({error:"The folder dialog timed out"})},sk);ne.stdout.on("data",(Se)=>{te+=Se.toString()}),ne.on("error",()=>de({error:`Could not open the folder dialog (${X.cmd})`})),ne.on("close",()=>{let Se=te.trim().replace(/\/+$/,"");if(!Se)return de({cancelled:!0});if(!rk(Se)||!Vp(Se).isDirectory())return de({error:"That selection is not a folder on disk"});de({path:Se})})})}var zp=["en","ja","zh-CN"],Wp=["light","dark"],Vo=(I,q)=>I.includes(q),Yp=(I)=>typeof I==="object"&&I!==null&&!Array.isArray(I),Zp=(I)=>{let q=Yp(I)?I:{};return{...Vo(zp,q.language)?{language:q.language}:{},...Vo(Wp,q.theme)?{theme:q.theme}:{}}},Xp=(I)=>{if(!Yp(I))return null;let q=Object.keys(I).every((ne)=>ne==="language"||ne==="theme"),X=I.language===void 0||Vo(zp,I.language),ee=I.theme===void 0||Vo([...Wp,"auto"],I.theme);return q&&X&&ee?I:null},Qp=(I,q)=>{let X=q.language??I.language,ee=q.theme==="auto"?void 0:q.theme??I.theme;return{...X?{language:X}:{},...ee?{theme:ee}:{}}};var ef=`<!doctype html>
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
  presetStrictDescription: "Also blocks commands it cannot fully parse and listing sensitive paths. Occasional false positives on advanced shell.",
  presetParanoid: "Paranoid",
  presetParanoidDescription: "Also blocks rm -rf inside your project and interpreter one-liners. Expect more false positives. Use it for untrusted agents or high-stakes repos.",
  capabilityFailClosed: "Fail closed",
  capabilityFailClosedDescription: "Block commands the parser cannot fully understand.",
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
  presetStrictDescription: "完全には解析できないコマンドと機密パスの一覧表示もブロックします。高度なシェル操作でときどき誤検知があります。",
  presetParanoid: "Paranoid",
  presetParanoidDescription: "プロジェクト内の rm -rf とインタープリターの 1 行コードもブロックします。誤検知が増えるため、信頼できないエージェントや重要なリポジトリに使ってください。",
  capabilityFailClosed: "フェイルクローズ",
  capabilityFailClosedDescription: "パーサーが完全に理解できないコマンドをブロックします。",
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
  presetStrictDescription: "还会阻止无法完全解析的命令和列出敏感路径的操作。复杂的 shell 写法偶尔会误报。",
  presetParanoid: "Paranoid",
  presetParanoidDescription: "还会阻止项目内的 rm -rf 和解释器单行命令。误报会更多，适合不受信任的智能体或高风险仓库。",
  capabilityFailClosed: "Fail closed",
  capabilityFailClosedDescription: "阻止解析器无法完全理解的命令。",
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
`;var nf='<script id="ccsn-data" type="application/json">';function tf(I,q=ef){return q.replace(nf,()=>nf+JSON.stringify(I).replaceAll("<","\\u003c"))}var Js="kenryu42/cc-safety-net",hk=`https://github.com/${Js}`,pf=1e4,yk=7,vk="The project draft directory changed; reload the draft before applying.",bk="audit settings are user scope only; remove the audit section from a project proposal";async function ff(I,q={}){let X=pn({label:"gui",booleans:{noOpen:["--no-open"]}},I),ee=q.log??console.log,ne=q.error??console.error;if(X.errors.length>0){for(let le of X.errors)ne(le);return ne("Usage: cc-safety-net gui [--no-open]"),1}let te=await wk(c,q);if(ee(`CC Safety Net policy GUI: ${te.url}`),!X.flags.noOpen)try{await(q.openBrowser??Ok)(te.url)}catch(le){ne(`Failed to open browser: ${le instanceof Error?le.message:String(le)}`),ne(`Open this URL manually: ${te.url}`)}if(q.keepAlive===!1)return await te.close(),0;return await Ik(te),0}async function wk(I,q={}){let X=dk(24).toString("base64url"),ee={dir:null,revision:0},ne=fk((de,be)=>{kk(I,de,be,X,q,ee)});await new Promise((de,be)=>{ne.once("error",be),ne.listen(0,"127.0.0.1",()=>{ne.off("error",be),de()})});let le=`http://127.0.0.1:${ne.address().port}`;return{origin:le,token:X,url:`${le}/?token=${encodeURIComponent(X)}`,close:()=>_k(ne)}}async function kk(I,q,X,ee,ne,te){let le=I(),de=new URL(q.url??"/","http://127.0.0.1");if(q.method==="GET"&&de.pathname==="/favicon.ico"){X.writeHead(204,{"cache-control":"no-store"}),X.end();return}if(!Ek(q,de,ee)){tn(X,403,{error:"Forbidden"});return}if(q.method==="GET"&&de.pathname==="/"){let be=of(rf(le,ne));await Promise.resolve(ne.buildDocument?.()).then((Se)=>Ak(X,tf({token:ee,preferences:be},Se)),(Se)=>tn(X,500,{error:Se instanceof Error?Se.message:String(Se)}));return}if(q.method==="POST"&&de.pathname==="/api/preferences"){let be=await or(q);if(!be.ok){tn(X,be.status,{errors:[be.error]});return}let Se=Xp(be.value);if(!Se){tn(X,400,{errors:["preferences accept only language (en, ja, zh-CN) and theme (auto, light, dark)"]});return}let Ae=rf(le,ne),De=Qp(of(Ae),Se),Le=Ck(Ae,De);tn(X,Le?500:200,Le?{errors:[Le]}:{preferences:De});return}if(q.method==="GET"&&de.pathname==="/api/policy"){let be=$u(le,ne),Se=w(le,Ks(ne));tn(X,200,{...be,configState:tt(Se),...Se.policyScopes?{projectPolicy:{path:S(ne.cwd??process.cwd()),weakenings:Se.policyScopes.weakeningsIgnored?[]:Se.policyScopes.weakenings}}:{},destructiveCommandRules:Y,secretPatterns:xt,version:dn(),preview:be.errors.length>0?null:Xe(be.policy,le.env)});return}if(q.method==="POST"&&de.pathname==="/api/policy/preview"){let be=await or(q);if(!be.ok){tn(X,be.status,{errors:[be.error]});return}let Se=Du(le,be.value);tn(X,Se.errors.length>0?400:200,Se);return}if(q.method==="POST"&&de.pathname==="/api/policy/explain"){let be=await or(q);if(!be.ok){tn(X,be.status,{errors:[be.error]});return}let Se=be.value;if(Se===null||typeof Se.command!=="string"){tn(X,400,{errors:["command must be a string"]});return}let Ae=Er(Se.policy,le.home);if(Ae.length>0){tn(X,400,{errors:Ae});return}tn(X,200,Sk(le,Se.command,Se.policy,ne));return}if(q.method==="POST"&&de.pathname==="/api/policy"){let be=await or(q);if(!be.ok){tn(X,be.status,{errors:[be.error]});return}let Se=Nn(le,be.value,ne);tn(X,Se.errors.length>0?400:200,Se);return}if(q.method==="POST"&&de.pathname==="/api/reset"){tn(X,200,Nn(le,ae,ne));return}if(q.method==="POST"&&de.pathname==="/api/repair"){tn(X,200,Nu(le,ne));return}if(q.method==="POST"&&de.pathname==="/api/policy/project/choose-directory"){let be=await(ne.chooseDirectory??Vs)();if("path"in be)te.dir=be.path,te.revision+=1;tn(X,200,{cancelled:"cancelled"in be,..."error"in be?{error:be.error}:{}});return}if(q.method==="GET"&&de.pathname==="/api/policy/project"){let be=mf(te,ne),Se=gf(le,be,ne),Ae=Se?{projection:{},diagnostics:[Se]}:sf(be,le.home),De=Tr(le,ne);tn(X,200,{path:S(be),revision:te.revision,baseline:De.baseline,userPolicyDiagnostics:De.diagnostics,projection:Ae.projection,projectionDiagnostics:Ae.diagnostics,canPickDirectory:qs(process.platform,process.env)});return}if(q.method==="POST"&&de.pathname==="/api/policy/project/diff"){let be=await af(le,q,X,te,ne);if(!be)return;let Se=sf(be.dir,le.home),Ae=Tr(le,ne).baseline,De=se(Ae,ve(be.proposal,le.home).policy);tn(X,200,{rows:_o(se(Ae,Se.projection).policy,De.policy,!1),weakenings:De.weakenings,existingFileDiagnostics:Se.diagnostics});return}if(q.method==="POST"&&de.pathname==="/api/policy/project/apply"){let be=await af(le,q,X,te,ne);if(!be)return;let Se=Pk(be.dir,be.proposal,le.home);tn(X,Se.errors.length>0?500:200,Se);return}if(q.method==="GET"&&de.pathname==="/api/activity"){let be=ue(le,ne),Se=Rk(de.searchParams.get("days"),be);if(Se===null){tn(X,400,{error:`days must be an integer between 1 and ${be}`});return}tn(X,200,qp(le,Se,ne.activityLogsDir));return}if(q.method==="POST"&&de.pathname==="/api/rules/choose-directory"){tn(X,200,await Vs());return}if(q.method==="GET"&&de.pathname==="/api/rules"){let be=ie(le,Ks(ne)),Se=new Map(be.rules.map((Ae)=>[Ae.name,Ae]));tn(X,200,{projectPath:ne.cwd??process.cwd(),canPickDirectory:qs(process.platform,process.env),rulebooks:be.rulebooks.map((Ae)=>({source:Ae.source,spec:Ae.spec,name:Ae.name,version:Ae.version,rules:Ae.rules.flatMap((De)=>{let Le=Se.get(De);if(!Le)return[];return[{name:Le.name,command:Le.command,subcommand:Le.subcommand,block_args:Le.block_args,reason:Le.reason}]})})),errors:be.errors,warnings:be.warnings});return}if(q.method==="GET"&&de.pathname==="/api/star/context"){tn(X,200,await(ne.fetchStarContext??(()=>Fk(le,{logsDir:ne.activityLogsDir})))());return}if(q.method==="POST"&&de.pathname==="/api/star"){let be=await(ne.starRepo??$k)();tn(X,200,be.ok?{ok:!0}:{ok:!1,fallbackUrl:hk});return}if(q.method==="GET"&&de.pathname==="/api/integrations"){tn(X,200,await(ne.fetchIntegrations??(()=>Dk(le)))());return}if(q.method==="GET"&&de.pathname==="/api/health"){tn(X,200,await(ne.fetchHealth??Lk)());return}if(q.method==="POST"&&(de.pathname==="/api/install"||de.pathname==="/api/uninstall")){let be=await or(q);if(!be.ok){tn(X,be.status,{errors:[be.error]});return}let Se=be.value?.target;if(typeof Se!=="string"||!An.some((De)=>De.target===Se)){tn(X,400,{error:"unknown target"});return}let Ae=de.pathname==="/api/install"?"install":"uninstall";tn(X,200,await(ne.runIntegration??jk)(Ae,Se));return}tn(X,404,{error:"Not found"})}function rf(I,q){return mk(uf(me(I,q)),"gui.json")}function of(I){if(!df(I))return{};try{return Zp(JSON.parse(pk(I,"utf-8")))}catch{return{}}}function Ck(I,q){try{return uk(uf(I),{recursive:!0}),sn(I,`${JSON.stringify(q,null,2)}
`),null}catch(X){return X instanceof Error?X.message:String(X)}}function Ks(I){return{...I,cwd:I.cwd??process.cwd()}}function mf(I,q){return I.dir??q.cwd??process.cwd()}function gf(I,q,X){if(!L(I,{...X,cwd:q}))return null;return`${S(q)} is the user policy, not a project policy; choose a project directory, or run the GUI from one`}function sf(I,q){let X=S(I),ee=df(X)?$t(X):{value:void 0,errors:[]},ne=ve(ee.value,q);return{projection:ne.policy,diagnostics:[...ee.errors,...ne.diagnostics]}}async function af(I,q,X,ee,ne){let te=mf(ee,ne),le=ee.revision,de=await or(q);if(!de.ok)return tn(X,de.status,{errors:[de.error]}),null;let be=de.value;if(typeof be?.revision!=="number")return tn(X,400,{errors:["revision must be a number"]}),null;if(be.revision!==le)return tn(X,409,{errors:[vk]}),null;let Se=gf(I,te,ne);if(Se)return tn(X,400,{errors:[Se]}),null;let Ae=xk(be.proposal,I.home);if(Ae.length>0)return tn(X,400,{errors:Ae}),null;return{dir:te,proposal:be.proposal}}function xk(I,q){let X=Er(I,q);if(X.length>0)return X;return I?.audit===void 0?[]:[bk]}function Pk(I,q,X){let ee=S(I),ne=Io(q,_(q,X));try{return x(s(R(I,"project policy"),ee),`${JSON.stringify(ne,null,2)}
`),{path:ee,errors:[]}}catch(te){return{path:ee,errors:[te instanceof Error?te.message:String(te)]}}}function Sk(I,q,X,ee){let ne=_(X,I.home),te=w(I,Ks(ee)),le=He({rules:te.policy.rules,transparentWrappers:te.policy.transparentWrappers,commandTools:te.policy.commandTools,safety:et(ne.safety),worktreeMode:ne.workflow.worktree_mode,destructiveCommandProtectionEnabled:ne.destructive_command_protection.enabled,destructiveCommandRuleOverrides:ne.destructive_command_protection.overrides,destructiveCommandAllowPaths:ne.destructive_command_protection.allow_paths,secretProtection:{enabled:ne.secret_protection.enabled,disabledRules:Ct(ne.secret_protection.overrides),denyPaths:ne.secret_protection.deny_paths,allowPaths:ne.secret_protection.allow_paths}});return wr(q,{policySnapshot:le,cwd:ee.cwd,userConfigDir:ee.userConfigDir},I)}function Rk(I,q){if(I===null)return Math.min(yk,q);let X=Number(I);if(!Number.isInteger(X)||X<1||X>q)return null;return X}function Ek(I,q,X){if(q.searchParams.get("token")!==X)return!1;if(I.method!=="POST")return!0;return I.headers["x-cc-safety-net-token"]===X}var Tk=1048576;async function or(I){let q=[],X=0;for await(let ee of I){let ne=ee;if(X+=ne.byteLength,X>Tk)return{ok:!1,status:413,error:"Request body is too large"};q.push(ne)}try{return{ok:!0,value:JSON.parse(Buffer.concat(q).toString("utf-8")||"{}")}}catch(ee){return{ok:!1,status:400,error:`Invalid JSON: ${ee instanceof Error?ee.message:String(ee)}`}}}function Ak(I,q){I.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),I.end(q)}function tn(I,q,X){I.writeHead(q,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),I.end(JSON.stringify(X))}function _k(I){return new Promise((q,X)=>{I.close((ee)=>ee?X(ee):q())})}function Ik(I){return new Promise((q)=>{let X=()=>{process.off("SIGINT",ee),process.off("SIGTERM",ee)},ee=()=>{X(),I.close().then(q)};process.once("SIGINT",ee),process.once("SIGTERM",ee)})}function Ok(I){let q=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",X=process.platform==="win32"?["/c","start","",I]:[I];return new Promise((ee,ne)=>{let te=cf(q,X,{detached:!0,stdio:"ignore"}),le=(be)=>{te.off("spawn",de),ne(be)},de=()=>{te.off("error",le),te.unref(),ee()};te.once("error",le),te.once("spawn",de)})}async function $k(I="gh",q=pf){return{ok:await Hk(I,["api","-X","PUT",`/user/starred/${Js}`],q)===0}}async function Dk(I,q={}){let X=await Mr((ne)=>Xt({environment:I,cwd:process.cwd(),openCodeVersion:ne}).status!=="n/a",q.fetcher),ee=Nk(I,X);return{targets:Cn.map((ne)=>{let te=ee.find((le)=>le.platform===ne.id);return{target:ne.id,label:ln(ne.id),version:X.versions[ne.id]??null,status:te?.configured?"active":te?.detected?"disabled":te?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:X.version,nodeVersion:X.nodeVersion,platform:X.platform}}}function Nk(I,q){return Qt(I,process.cwd(),{ampPluginListOutput:q.ampPluginListOutput,codexPluginListOutput:q.codexPluginListOutput,copilotCliVersion:q.versions["copilot-cli"],openCodeVersion:q.versions.opencode,openCodePluginListOutput:q.openCodePluginListOutput})}async function Lk(I={}){let q=await(I.checkUpdates??Fn)();return{update:{latestVersion:q.latestVersion??null,updateAvailable:q.updateAvailable}}}var lf=Promise.resolve();function jk(I,q,X={}){let ee=async()=>{let te=[],{log:le,error:de}=console;console.log=(...be)=>te.push(be.map(String).join(" ")),console.error=console.log;try{return{ok:await Rr(I,[],{selectTargets:async()=>[q],output:new gk({write(Se,Ae,De){te.push(String(Se).replace(/\n$/,"")),De()}}),...X})===0,output:te.join(`
`)}}finally{console.log=le,console.error=de}},ne=lf.then(ee);return lf=ne.then(()=>{return},()=>{return}),ne}async function Fk(I,q={}){let[X,ee]=await Promise.all([Mk(q.fetchRepo),Promise.resolve(Lr(I,ue(I),q.logsDir).totalBlocked)]);return{starCount:X,blockedTotal:ee}}function Hk(I,q,X){return new Promise((ee)=>{let ne=cf(I,q,{stdio:"ignore",windowsHide:!0}),te=!1,le=setTimeout(()=>{ne.kill(),de(null)},X),de=(be)=>{if(te)return;te=!0,clearTimeout(le),ee(be)};ne.once("error",()=>de(null)),ne.once("close",de)})}async function Mk(I=fetch){try{let q=await I(`https://api.github.com/repos/${Js}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(pf)});if(!q.ok)return null;let X=await q.json();return typeof X.stargazers_count==="number"?X.stargazers_count:null}catch{return null}}function Uk(I){if(I[0]!=="help")return!1;let q=I[1];if(!q)ys(),process.exit(0);if(kr(q))process.exit(0);console.error(`Unknown command: ${q}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var Bk={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),kr("hook",console.error),process.exit(1)},install:async(I)=>{process.exit(await Rr("install",I))},update:async(I)=>{process.exit(await Os(I))},uninstall:async(I)=>{process.exit(await Rr("uninstall",I))},rule:async(I)=>{process.exit(await Up(c(),I))},policy:async(I)=>{process.exit(await Hu(c(),I))},status:async(I)=>{if(_n(pn({label:"status"},I).errors))process.exit(1);Gp(c())},statusline:async(I)=>{let q=pn({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},I);if(q.errors.length===0&&q.flags.claudeCode){await Gs(c());return}if(_n(q.errors),!q.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");kr("statusline",console.error),process.exit(1)},doctor:async(I)=>{let q=as(I);if(!q)process.exit(1);let X=await ed(c(),{json:q.json,skipUpdateCheck:q.skipUpdateCheck});process.exit(X)},logs:async(I)=>{process.exit(await na(c(),I))},gui:async(I)=>{process.exit(await ff(I))},explain:async(I)=>{process.exit(await dd(c(),I))}};async function Gk(I){let q=pn({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},I);if(Uk(I))return;let X=I[0],ee=X?Nr(X):void 0;if(q.help&&ee&&ee.name!=="rule")kr(ee.name),process.exit(0);if(!X||q.help&&!ee)ys(),process.exit(0);if(q.flags.version)fd(),process.exit(0);if(ee){await Bk[ee.name](I.slice(1));return}if(X==="--statusline"){await Gs(c());return}console.error(X.startsWith("-")?`Unknown option: ${X}`:`Unknown command: ${X}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{Gk as runCli};
