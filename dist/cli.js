import{n,a,Oe,Ye,R,ot,Je,l,i,Ze,P,_,Le,st,f,Xe,u,o,S,s,D,r,y,ue,G,lt,ct,c,pe,fe,dt,O,Y,ie,x,ut,A,w,me,T,d,H,Qe,et,N,L,I,J,ge,$e,pt,m,e,g,Me,ke,tt,nt,se,Ee,ae,Fe,Z,W,Re,je,he,Pe,U,rt,_e,Ae,Te,Ie,ye,ve,B,X,Q,le,h,z,Ge,We,Ue,k,Be,De,ze,v,t,ee,be,b,C,E,ft,Ve,qe,p,V}from"./chunks/index-j05wvzsn.js";import{ne,q,Ke,M,F}from"./chunks/index-rzqrsja3.js";var su=["-h","--help"];function At(j,K){let te=Object.entries(j.booleans??{}),re=Object.entries(j.values??{}),oe=Object.entries(j.lists??{}),ce=Object.fromEntries(te.map(([He])=>[He,!1])),de={},we=Object.fromEntries(oe.map(([He])=>[He,[]])),xe=[],Ce=[],Se=!1,Ne=-1;for(let[He,at]of K.entries()){if(He<=Ne)continue;if(at==="--"){xe.push(...K.slice(He+1));break}if(su.includes(at)){Se=!0;continue}let mt=te.find(([,ht])=>ht.includes(at));if(mt){ce[mt[0]]=!0;continue}let it=re.find(([,ht])=>ht.includes(at));if(it){let ht=K[He+1];if(ht===void 0||ht.startsWith("-")){Ce.push(`${at} requires a value`);continue}de[it[0]]=ht,Ne=He+1;continue}let gt=oe.find(([,ht])=>ht.includes(at));if(gt){let ht=K.slice(He+1),vt=ht.findIndex((kt)=>kt.startsWith("-")),yt=ht.slice(0,vt===-1?ht.length:vt);if(yt.length===0){Ce.push(`${at} requires at least one value`);continue}we[gt[0]]=[...we[gt[0]]??[],...yt],Ne=He+yt.length;continue}if(at.startsWith("-")){Ce.push(`Unknown option for ${j.label}: ${at}`);continue}if(j.positionals==="tail"){xe.push(...K.slice(He));break}xe.push(at)}if(j.positionals!=="list"&&j.positionals!=="tail")Ce.push(...xe.map((He)=>`Unexpected argument for ${j.label}: ${He}`));return{flags:ce,values:de,lists:we,positionals:xe,help:Se,errors:Ce}}function Kt(j){for(let K of j)console.error(K);return j.length>0}import{readdirSync as fu,statSync as Zi,unlinkSync as mu}from"node:fs";import{basename as Xi,dirname as gu,isAbsolute as yu,join as hu,relative as vu,resolve as bu,sep as Lu}from"node:path";import{existsSync as au,readdirSync as lu,readFileSync as cu}from"node:fs";import{join as du}from"node:path";var Wi=(j)=>{let K=Date.now()-new Date(j).getTime();if(!Number.isFinite(K))return"";let te=Math.floor(K/60000),re=Math.floor(te/60),oe=Math.floor(re/24);if(oe>0)return`${oe}d ago`;if(re>0)return`${re}h ago`;if(te>0)return`${te}m ago`;return"just now"},dr=(j)=>{let K=(j??"").trim().split(/\s+/).filter((oe)=>oe&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(oe)),te=K[0]?.split("/").pop();if(!te)return null;let re=K[1];return re&&/^[a-z][a-z0-9-]*$/.test(re)?`${te} ${re}`:te};function an(j,K){try{return lu(j,{withFileTypes:!0,encoding:"utf8"}).flatMap((te)=>{let re=du(j,te.name);if(te.isDirectory())return an(re,K);if(te.name.endsWith(".jsonl"))return[re];return[]})}catch{if(K&&au(j))K.count++;return[]}}function Ki(j){let K=(oe)=>`${oe.sessionId}
${dr(oe.segment||oe.command)}`,te=j.filter((oe)=>oe.decision!=="allow"),re=te.filter((oe)=>oe.sessionId).reduce((oe,ce)=>oe.set(K(ce),(oe.get(K(ce))??0)+1),new Map);return new Set(te.filter((oe)=>oe.failureStage||(re.get(K(oe))??0)>=2))}var uu=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function pu(j){if(!j||typeof j!=="object"||Array.isArray(j))return!1;let K=j;if(typeof K.ts!=="string"||typeof K.command!=="string")return!1;return uu.every((te)=>K[te]===void 0||typeof K[te]==="string")}function wn(j,K){try{return cu(j,"utf-8").split(`
`).filter(Boolean).flatMap((te)=>{try{let re=JSON.parse(te);if(!pu(re)){if(K)K.count++;return[]}return[re]}catch{if(K)K.count++;return[]}})}catch{if(K)K.count++;return[]}}function _t(j){return Array.from(j,(K)=>{let te=K.charCodeAt(0);if(te<=31||te>=127&&te<=159)return`\\x${te.toString(16).padStart(2,"0")}`;return K}).join("")}function wu(j,K){let te=ne(j),re=At({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},K);if(Kt(re.errors))return null;if(re.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(re.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let oe=re.values.limit===void 0?20:Yi(re.values.limit);if(oe===null)return console.error("--limit must be a positive number"),null;let ce=re.values.since===void 0?Math.min(30,te):Yi(re.values.since);if(ce===null||ce>te)return console.error(`--since must be a positive number of days no greater than ${te}`),null;let de={limit:oe,limitExplicit:re.values.limit!==void 0,since:ce,sinceExplicit:re.values.since!==void 0,all:re.flags.all,json:re.flags.json,suspect:re.flags.suspect,pruneLegacy:re.flags.pruneLegacy,dryRun:re.flags.dryRun,id:re.values.id,agent:re.values.agent,rule:re.values.rule,session:re.values.session,project:re.values.project===void 0?void 0:bu(re.values.project)};if(de.id&&(de.agent!==void 0||de.rule!==void 0||de.session!==void 0||de.project!==void 0||de.suspect||de.sinceExplicit||de.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(de.pruneLegacy&&(de.id!==void 0||de.agent!==void 0||de.rule!==void 0||de.session!==void 0||de.project!==void 0||de.suspect||de.all||de.sinceExplicit||de.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(de.dryRun&&!de.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return de}async function Qi(j,K,te={}){let re=wu(j,K);if(!re)return 1;let oe=te.logsDir??M(j);if(re.pruneLegacy)return ku(oe,re.json,re.dryRun);if(!oe)return console.log(re.json?"[]":re.id?`No retained audit log entry found for id ${_t(re.id)}.`:"No audit log entries found."),0;q(j,oe);let ce={count:0},de=an(oe,ce).flatMap((Ne)=>wn(Ne,ce).map((He)=>({entry:He,file:Ne})));if(ce.count>0)console.error(`warning: ${ce.count} audit log ${ce.count===1?"source":"sources"} could not be read; these results are incomplete`);if(re.id)return Ru(de,re,te.timeZone);let we=Date.now()-re.since*24*60*60*1000,xe=de.filter((Ne)=>Pu(Ne,re,oe,we)),Ce=re.suspect?Ki(xe.map((Ne)=>Ne.entry)):null,Se=(Ce?xe.filter((Ne)=>Ce.has(Ne.entry)):xe).sort((Ne,He)=>Date.parse(He.entry.ts)-Date.parse(Ne.entry.ts)).slice(0,re.limit);if(re.json)return console.log(JSON.stringify(Se.map((Ne)=>Ne.entry),null,2)),0;if(Se.length===0)return console.log("No audit log entries found."),0;for(let Ne of Se)console.log(Au(Ne.entry,te.timeZone));return 0}function ku(j,K,te){let re=j?Cu(j).map((we)=>hu(j,we)):[];if(te)return xu(re,K);let oe=[],ce=0,de=0;for(let we of re){let xe=Zi(we,{throwIfNoEntry:!1})?.size??0,Ce=Su(we);if(Ce){oe.push(`${Xi(we)}: ${Ce}`);continue}ce++,de+=xe}if(K)return console.log(JSON.stringify({removedFiles:ce,removedBytes:de,failedFiles:oe.length})),oe.length===0?0:1;console.log(ce===0&&oe.length===0?"No legacy audit log files found.":`Removed ${ce} legacy audit log ${ce===1?"file":"files"} (${es(de)}).`);for(let we of oe)console.error(`Could not remove ${_t(we)}`);if(console.log("Nested v2 audit logs were not changed."),ce>0)console.log("This deletion cannot be undone.");return oe.length===0?0:1}function xu(j,K){let te=j.reduce((re,oe)=>re+(Zi(oe,{throwIfNoEntry:!1})?.size??0),0);if(K)return console.log(JSON.stringify({dryRun:!0,files:j.length,bytes:te})),0;if(console.log(j.length===0?"No legacy audit log files found.":`Would remove ${j.length} legacy audit log ${j.length===1?"file":"files"} (${es(te)}).`),console.log("Nested v2 audit logs are not included."),j.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function Cu(j){try{return fu(j,{withFileTypes:!0}).filter((K)=>K.isFile()&&K.name.endsWith(".jsonl")).map((K)=>K.name)}catch{return[]}}function Su(j){try{return mu(j),null}catch(K){return K instanceof Error?K.message:String(K)}}function es(j){let K=["B","KiB","MiB","GiB"],te=Math.min(Math.floor(Math.log2(Math.max(j,1))/10),K.length-1);return`${Math.round(j/1024**te*10)/10} ${K[te]}`}function Ru(j,K,te){let re=j.filter((ce)=>ce.entry.id===K.id);if(re.length>1)return console.error(`Multiple audit log entries found for id ${_t(K.id??"")}.`),1;if(K.json)return console.log(JSON.stringify(re.map((ce)=>ce.entry),null,2)),0;let oe=re[0];if(!oe)return console.log(`No retained audit log entry found for id ${_t(K.id??"")}.`),0;return console.log(_u(oe.entry,te)),0}function Pu(j,K,te,re){if(!K.all&&j.entry.decision==="allow")return!1;if(Date.parse(j.entry.ts)<re)return!1;if(K.agent!==void 0&&j.entry.agent!==K.agent)return!1;if(K.rule!==void 0&&j.entry.ruleId!==K.rule)return!1;if(K.session!==void 0&&!Eu(j,te,K.session))return!1;if(K.project!==void 0&&!Du(j.entry.cwd,K.project))return!1;return!0}function Eu(j,K,te){if(j.entry.sessionId===te)return!0;return gu(j.file)===K&&Xi(j.file,".jsonl")===te}function Du(j,K){if(!j)return!1;let te=vu(K,j);return te!==".."&&!te.startsWith(`..${Lu}`)&&!yu(te)}function Au(j,K){let te=_t(j.id??"-"),re=_t(j.decision??"deny"),oe=j.cwd?`  [${_t(j.cwd)}]`:"",ce=j.segment||j.command,de=ce===j.command?"":"↳ ",we=ce.length>50?`${ce.slice(0,50)}…`:ce;return`${te.padEnd(16)}  ${_t(ts(j.ts,K))}  ${re.padEnd(5)}  ${_t(j.agent??"-").padEnd(15)}  ${_t(j.ruleId??"-").padEnd(20)}  ${de}${_t(we)}${oe}`}function _u(j,K){let te=(oe)=>_t(oe===void 0||oe===null||oe===""?"-":oe),re=j.shape?`${j.agent??"-"} (shape: ${j.shape})`:j.agent??"-";return[`id:        ${te(j.id)}`,`ts:        ${te(ts(j.ts,K))}`,`decision:  ${te(j.decision)}`,`agent:     ${te(re)}`,`level:     ${te(j.level)}`,`tool:      ${te(j.toolName)}`,`rule:      ${te(j.ruleId)}`,`intent:    ${te(j.intent)}`,`stage:     ${te(j.failureStage)}`,`error:     ${te(j.errorCode)}`,`session:   ${te(j.sessionId)}`,`cwd:       ${te(j.cwd)}`,`version:   ${te(j.v)}`,`truncated: ${te(j.truncated===!0?"yes":void 0)}`,`reason:    ${te(j.reason)}`,`command:   ${te(j.command)}`,`segment:   ${te(j.segment)}`].join(`
`)}function ts(j,K){let te=new Date(j);if(Number.isNaN(te.getTime()))return j;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:K}).format(te)}function Yi(j){let K=Number(j);return Number.isFinite(K)&&K>0?K:null}var ns={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var rs={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var os={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var Nn=[{id:"antigravity-cli",displayName:"Antigravity CLI",doctorOrder:3,runtime:{order:1,flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:2,flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",doctorOrder:1,runtime:{order:2,displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{order:3,flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",doctorOrder:4,runtime:{order:3,flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{order:4,flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",doctorOrder:7,runtime:{order:6,flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{order:7,flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",doctorOrder:6,runtime:{order:5,flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{order:6,flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",doctorOrder:8,runtime:{order:7,flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{order:8,flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",doctorOrder:9,runtime:{order:8,flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{order:9,flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",doctorOrder:10,runtime:{order:9,flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{order:10,flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",doctorOrder:11,install:{order:11,flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",doctorOrder:12,install:{order:12,flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",doctorOrder:13,install:{order:13,flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",doctorOrder:5,runtime:{order:4,flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{order:5,flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"amp",displayName:"Amp Code",doctorOrder:2,install:{order:1,flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],ur=Nn.slice().sort((j,K)=>j.doctorOrder-K.doctorOrder).map((j)=>j.id),Mn=Nn.filter((j)=>("runtime"in j)).slice().sort((j,K)=>j.runtime.order-K.runtime.order).map((j)=>({id:j.id,displayName:"displayName"in j.runtime?j.runtime.displayName:j.displayName,flags:j.runtime.flags,legacyFlags:"legacyFlags"in j.runtime?j.runtime.legacyFlags:[],description:j.runtime.description,legacyTopLevelFlags:j.runtime.legacyTopLevelFlags})),Nt=Nn.slice().sort((j,K)=>j.install.order-K.install.order).map((j)=>({id:j.id,...j.install})).map(({order:j,...K})=>K),d0=Object.fromEntries(Nn.map((j)=>[j.id,j.displayName]));function St(j){return Nn.find((K)=>K.id===j)?.displayName??j}var Tu=Mn.map((j)=>({flags:j.flags.join(", "),description:j.description})),Iu=Mn.flatMap((j)=>j.flags.map((K)=>`cc-safety-net hook ${K}`)),is={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Tu,{flags:"-h, --help",description:"Show this help"}],examples:Iu};var ss={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...Nt.map((j)=>({flags:j.flag,description:`Install ${St(j.id)} ${j.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...Nt.map((j)=>`cc-safety-net install ${j.flag}`)]},as={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...Nt.map((j)=>({flags:j.flag,description:`Uninstall ${St(j.id)} ${j.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...Nt.map((j)=>`cc-safety-net uninstall ${j.flag}`)]},ls={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var cs={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var pr={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var go=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],yo=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],kn={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},...go.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk",...yo,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var ds={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var us={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var fr=[ds,ns,cs,rs,kn,pr,ss,ls,as,is,os,us];function $u(j){return j.aliases??[]}function mr(j){let K=j.toLowerCase();return fr.find((te)=>te.name.toLowerCase()===K||$u(te).some((re)=>re.toLowerCase()===K))}import{basename as Ou}from"node:path";function gr(j,K=7,te=M(j)){let re=Date.now()-K*24*60*60*1000,oe=[],ce=new Set,de=0,we,xe,Ce,Se;if(te)q(j,te);let Ne={count:0},He=te?an(te,Ne):[];for(let mt of He)for(let it of wn(mt,Ne)){if(it.decision==="allow")continue;let gt=new Date(it.ts).getTime();if(gt>=re){if(de++,ce.add(it.sessionId??Ou(mt,".jsonl")),xe===void 0||gt<=xe)we=it.ts,xe=gt;if(Se===void 0||gt>Se)Ce=it.ts,Se=gt;ju(oe,it,gt)}}let at=oe.map((mt)=>({timestamp:mt.ts,command:mt.command,reason:mt.reason,relativeTime:Wi(new Date(mt.ts))}));return{totalBlocked:de,sessionCount:ce.size,recentEntries:at,oldestEntry:we,newestEntry:Ce,unreadable:Ne.count}}function ju(j,K,te){let re=j.findIndex((oe)=>te>new Date(oe.ts).getTime());if(re===-1){if(j.length<3)j.push(K);return}if(j.splice(re,0,K),j.length>3)j.pop()}import{dirname as Wu}from"node:path";import{dirname as Fu,join as Nu,resolve as Mu}from"node:path";var Hu="config.json";function It(j,K,te,re){y(Uu(j),`${JSON.stringify(K,null,2)}
`,te,re)}function Uu(j){return typeof j==="string"?D(j):j}function vo(j){return{errors:se(Bu(j),": "," "),ruleNames:new Set(Fe(j).map((K)=>K.toLowerCase()))}}var Gu="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",ps="must match pattern (letters, numbers, hyphens, underscores)";function Bu(j){if(!fs(j))return[e([],"Config must be an object")];return[...j.version===1?[]:[e(["version"],"must be 1")],...qu(j.rules)]}function qu(j){if(j===void 0)return[];if(!Array.isArray(j))return[e(["rules"],"must be an array")];return[...j.flatMap((K,te)=>fs(K)?Vu(K,["rules",te]):[e(["rules",te],"must be an object")]),...Me(j)]}function Vu(j,K){return[...ho(j.name,[...K,"name"],"required string",c,Gu),...ho(j.command,[...K,"command"],"required string",L,ps),...j.subcommand===void 0?[]:ho(j.subcommand,[...K,"subcommand"],"must be a string if provided",L,ps),...zu(j.block_args,[...K,"block_args"]),...Ju(j.reason,[...K,"reason"]),...j.intent===void 0||Ee(j.intent)?[]:[e([...K,"intent"],ke)]]}function ho(j,K,te,re,oe){if(typeof j!=="string")return[e(K,te)];return re.test(j)?[]:[e(K,oe)]}function zu(j,K){if(!Array.isArray(j))return[e(K,"required array")];if(j.length===0)return[e(K,"must have at least one element")];return j.flatMap((te,re)=>{if(typeof te!=="string")return[e([...K,re],"must be a string")];return te===""?[e([...K,re],"must not be empty")]:[]})}function Ju(j,K){if(typeof j!=="string")return[e(K,"required string")];if(j==="")return[e(K,"must not be empty")];return j.length>I?[e(K,`must be at most ${I} characters`)]:[]}function fs(j){return!!j&&typeof j==="object"&&!Array.isArray(j)}function bo(j){let K=ms(j);if(!K.ok)return K.result;return vo(K.parsed)}function ms(j){let K=[],te=new Set;try{let re=typeof j==="string"?D(j):j,oe=r(re);if(oe===null)return K.push(`File not found: ${re.path}`),{ok:!1,result:{errors:K,ruleNames:te}};if(!oe.trim())return K.push("Config file is empty"),{ok:!1,result:{errors:K,ruleNames:te}};return{ok:!0,parsed:JSON.parse(oe)}}catch(re){if(re instanceof o)return K.push(re.message),{ok:!1,result:{errors:K,ruleNames:te}};let oe=re instanceof Error?re.message:String(re);return K.push(re instanceof SyntaxError?"Invalid JSON":oe),{ok:!1,result:{errors:K,ruleNames:te}}}}function gs(j){return Mu(j,".safety-net.json")}function en(j){let K=ms(j);if(!K.ok)return K.result;let te=tt(K.parsed);return{errors:te.errors,ruleNames:te.sources}}function yr(j,K={}){return Nu(Fu(me(j,K)),Hu)}function ys(j,K,te){let re;try{if(r(K)===null)return{path:j,exists:!1,valid:!1,ruleCount:0};re=en(K),re.errors.push(...W(j,te))}catch(oe){if(!(oe instanceof o))throw oe;re={errors:[oe.message],ruleNames:new Set}}return{path:j,exists:!0,valid:re.errors.length===0,ruleCount:re.ruleNames.size,...re.errors.length>0?{errors:re.errors}:{}}}function Ku(j,K){return{source:K,name:j.name,command:j.command,subcommand:j.subcommand,blockArgs:[...j.block_args],reason:j.reason}}function hs(j,K,te){let re=te?.userConfigPath??T(j),oe=te?.projectConfigPath??A(K),ce=Wu(re),de=Z(j,{cwd:K,userConfigPath:re,projectConfigPath:oe,userConfigDir:ce}),we=H(j,{cwd:K,userConfigPath:re,projectConfigPath:oe,userConfigDir:ce}),xe=new Map(de.rulebooks.flatMap((Ce)=>Ce.rules.map((Se)=>[Se,Ce.source])));return{userConfig:ys(re,we.userConfigTarget,we.userScope),projectConfig:ys(oe,we.projectConfigTarget,we.projectScope),effectiveRules:de.rules.map((Ce)=>Ku(Ce,xe.get(Ce.name)??"project")),shadowedRules:[]}}var Yu=[{flag:i.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:i.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:i.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:i.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:i.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:i.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:i.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:i.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"}];function vs(j){return[...Yu.map((K)=>({name:K.flag.name,value:Le(K.flag,j.env),isSet:st(K.flag,j.env),legacyName:K.flag.legacyName,legacyValue:K.flag.legacyName?j.env.get(K.flag.legacyName):void 0,legacyIsSet:K.flag.legacyName?j.env.get(K.flag.legacyName)!==void 0:void 0,description:K.description,defaultBehavior:K.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:j.env.get("CC_SAFETY_NET_HOME"),isSet:j.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var bs={error:0,warning:1,info:2},Zu=["policy","config","audit"];function Xu(j){return j.map((K)=>{if(K==="ownership")return"is not owned by the current user";if(K==="permissions")return"has unsafe permissions";if(K==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var Qu=[{derive:(j)=>j.hooks.length>0&&j.hooks.every((K)=>!K.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(j)=>j.hooks.filter((K)=>K.inspectionStatus==="failed").map((K)=>{let te=St(K.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${te} inspection failed`,detail:`Doctor could not verify the ${te} integration configuration.`,fixHint:`Correct the reported ${te} configuration error, then run \`cc-safety-net doctor\` again.`,integration:K.platform}})},{derive:(j)=>j.userConfig.exists&&!j.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:j.userConfig.path}]:[]},{derive:(j)=>j.projectConfig.exists&&!j.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:j.projectConfig.path}]:[]},{derive:(j)=>j.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${j.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(j)=>j.v2Leftovers&&j.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${j.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(j)=>{let K=j.environment.find((te)=>te.name==="CC_SAFETY_NET_AUDIT_SCOPE");return Ze(K?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...Zu.map((j)=>({derive:(K)=>K.posture.directories.filter((te)=>te.kind===j&&te.status==="unsafe").map((te)=>({checkId:`posture.${j}-directory-unsafe`,severity:"error",title:`${j[0]?.toUpperCase()}${j.slice(1)} directory is unsafe`,detail:`The ${j} directory ${Xu(te.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...te.path?{path:te.path}:{}}))})),{derive:(j)=>{let K=[...j.effectiveSafety.weakenedRuleOverrides].sort();return K.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${K.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${K.join(", ")}.`}]:[]}}];function Ls(j){return Qu.flatMap((K,te)=>K.derive(j).map((re,oe)=>({finding:re,catalogOrder:te,occurrence:oe}))).sort((K,te)=>bs[K.finding.severity]-bs[te.finding.severity]||K.catalogOrder-te.catalogOrder||K.occurrence-te.occurrence).map((K)=>K.finding)}function Bt(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var ep=(j)=>Bt()?`\x1B[32m${j}\x1B[0m`:j,tp=(j)=>Bt()?`\x1B[33m${j}\x1B[0m`:j,np=(j)=>Bt()?`\x1B[34m${j}\x1B[0m`:j,rp=(j)=>Bt()?`\x1B[35m${j}\x1B[0m`:j,op=(j)=>Bt()?`\x1B[36m${j}\x1B[0m`:j,ip=(j)=>Bt()?`\x1B[31m${j}\x1B[0m`:j,sp=(j)=>Bt()?`\x1B[2m${j}\x1B[0m`:j,ap=(j)=>Bt()?`\x1B[1m${j}\x1B[0m`:j,bt={green:ep,yellow:tp,blue:np,magenta:rp,cyan:op,red:ip,dim:sp,bold:ap},lp="\x1B[0m",cp=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function dp(j){let K=j;return()=>(K=(K*1664525+1013904223)%4294967296,K/4294967296)}function up(j){let K=[...cp],te=dp(j);for(let re=K.length-1;re>0;re--){let oe=Math.floor(te()*(re+1)),ce=K[re];K[re]=K[oe],K[oe]=ce}return K}function pp(j,K=0){if(!Bt())return"";let te=up(K);return`\x1B[38;5;${te[j%te.length]}m`}function ws(j,K,te=0){if(!Bt())return`"${j}"`;return`${pp(K,te)}"${j}"${lp}`}function hr(j){return j==="default"?"built-in default":`${j} policy`}var fp=new RegExp("\x1B\\[[0-9;]*m","g"),Lo=(j)=>j.replace(fp,"").length;function ln(j){let K=(j.headers??j.rows[0]??[]).map((de,we)=>{let xe=Math.max(...j.rows.map((Ce)=>Lo(Ce[we]??"")));return Math.max(Lo(de),xe)}),te=(de,we)=>de+" ".repeat(Math.max(0,we-Lo(de))),re=(de,we)=>we[0]+K.map((xe)=>de.repeat(xe+2)).join(we[1])+we[2],oe=(de)=>`│ ${de.map((we,xe)=>te(we,K[xe]??0)).join(" │ ")} │`,ce=j.headers?[`   ${oe(j.headers)}`,`   ${re("─",["├","┼","┤"])}`]:[];return[`   ${re("─",["┌","┬","┐"])}`,...ce,...j.rows.map((de)=>`   ${oe(de)}`),`   ${re("─",["└","┴","┘"])}`].join(`
`)}function ks(j){let K=[];K.push("Hook Integration"),K.push(mp(j));let te=[],re=[];for(let oe of j){let ce=St(oe.platform);if(oe.errors&&oe.errors.length>0)for(let de of oe.errors)if(oe.configured)te.push({platform:ce,message:de});else re.push({platform:ce,message:de})}for(let oe of te)K.push(`   Warning (${oe.platform}): ${oe.message}`);for(let oe of re)K.push(bt.red(`   Error (${oe.platform}): ${oe.message}`));return K.join(`
`)}function mp(j){let K=["Platform","Discovery","Configuration","Inspection"],te=j.map((re)=>{let oe=St(re.platform);if(re.inspectionStatus==="not-inspected"){let xe=bt.dim("Not inspected");return[oe,xe,xe,xe]}let ce=re.detected?bt.green("Detected"):re.inspectionStatus==="failed"?bt.red("Unknown"):bt.dim("Not detected"),de=re.configured?bt.green("Configured"):re.detected?bt.yellow("Not configured"):re.inspectionStatus==="failed"?bt.red("Unknown"):bt.dim("Not applicable"),we=re.inspectionStatus==="verified"?bt.green("Verified"):re.inspectionStatus==="failed"?bt.red("Failed"):bt.dim("Not applicable");return[oe,ce,de,we]});return ln({headers:K,rows:te})}function xs(j){let te=["Guard Engine Verification",`   Synthetic self-test: ${j.failed>0?bt.red(`${j.passed}/${j.total} FAIL`):bt.green(`${j.passed}/${j.total} passed`)}`],re=j.results.filter((oe)=>!oe.passed);if(re.length>0){te.push(""),te.push(bt.red("   Failures:"));for(let oe of re)te.push(bt.red(`   • ${oe.description}`)),te.push(bt.red(`     expected ${oe.expected}, got ${oe.actual}`))}return te.join(`
`)}function gp(j){if(j.length===0)return"   (no custom rules)";let K=["Source","Name","Command","Block Args"],te=j.map((re)=>[re.source,re.name,re.subcommand?`${re.command} ${re.subcommand}`:re.command,re.blockArgs.join(", ")]);return ln({headers:K,rows:te})}function Cs(j){let K=[];if(K.push("Configuration"),K.push(yp(j.userConfig,j.projectConfig)),K.push(""),j.effectiveRules.length>0)K.push(`   Effective rules (${j.effectiveRules.length} total):`),K.push(gp(j.effectiveRules));else K.push("   Effective rules: (none - using built-in rules only)");for(let te of j.shadowedRules)K.push(""),K.push(`   Note: Project rule "${te.name}" shadows user rule with same name`);return K.join(`
`)}function yp(j,K){let te=["Scope","Status"],re=(ce)=>{if(!ce.exists)return bt.dim("N/A");if(!ce.valid)return bt.red(`Invalid (${ce.errors?.[0]??"unknown error"})`);return bt.green("Configured")},oe=[["User",re(j)],["Project",re(K)]];return ln({headers:te,rows:oe})}function Ss(j){let K=[];return K.push("Environment"),K.push(hp(j)),K.join(`
`)}function Rs(j){let K=j.effectiveSafety.policyScopes,te=["Effective Safety",`   Selected preset: ${j.effectiveSafety.selectedPreset}${K?` (${hr(K.levelScope)})`:""}`,`   Effective: ${j.effectiveSafety.level}`],re=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[oe,ce]of re){let de=j.effectiveSafety.capabilities[oe],we=de.enabled?bt.green("ON"):bt.dim("OFF"),xe=de.sources.length>0?` (${de.sources.join(", ")})`:"";te.push(`   ${ce}: ${we} via ${de.source}${xe}`)}if(K&&K.weakenings.length>0){te.push("   Project policy deltas:");for(let oe of K.weakenings)te.push(`      ${oe}`)}te.push(`   Stored rule customizations: ${j.effectiveSafety.ruleCounts.stored}`),te.push(`   Effective rule customizations: ${j.effectiveSafety.ruleCounts.effective}`);for(let[oe,ce]of Object.entries(j.effectiveSafety.ruleOverrides))te.push(`   ${oe}: ${ce}`);return te.join(`
`)}function Ps(j){let K=["Findings"];if(j.length===0)return K.push("   No findings from inspected doctor facts."),K.join(`
`);for(let te of j){let re=`[${te.severity.toUpperCase()}] ${te.checkId}: ${_t(te.title)}`,oe=te.severity==="error"?bt.red:te.severity==="warning"?bt.yellow:bt.blue;if(K.push(`   ${oe(re)}`),K.push(`      ${_t(te.detail)}`),te.path)K.push(`      Path: ${_t(te.path)}`);if(te.fixHint)K.push(`      Fix: ${_t(te.fixHint)}`)}return K.join(`
`)}function hp(j){let K=["Variable","Status","Legacy"],te=j.map((re)=>{let oe=re.isSet?bt.green("✓"):bt.dim("✗"),ce=re.legacyName&&re.legacyIsSet?`${re.legacyName} ${bt.green("✓")}`:re.legacyName??"";return[re.name,oe,ce]});return ln({headers:K,rows:te})}function Es(j){let K=[];if(j.totalBlocked===0)K.push("Recent Activity"),K.push("   No blocked commands in the last 7 days"),K.push("   Tip: This is normal for new installations");else K.push(`Recent Activity · last 7 days (${j.totalBlocked} blocked / ${j.sessionCount} sessions)`),K.push(vp(j.recentEntries));if(j.unreadable>0)K.push(`   Warning: ${j.unreadable} audit log ${j.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return K.join(`
`)}function vp(j){let K=["Time","Command"],te=j.map((re)=>{let oe=_t(re.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),ce=oe.length>40?`${oe.slice(0,37)}...`:oe;return[re.relativeTime,ce]});return ln({headers:K,rows:te})}function Ds(j){let K=[];if(K.push("Update Check"),j.latestVersion===null&&!j.error)return K.push(vr([["Status",bt.dim("Skipped")],["Installed",j.currentVersion]])),K.join(`
`);if(j.error)return K.push(vr([["Status",`${bt.yellow("⚠")} Error`],["Installed",j.currentVersion],["Error",bt.dim(j.error)]])),K.join(`
`);if(j.updateAvailable)return K.push(vr([["Status",`${bt.yellow("⚠")} Update Available`],["Current",j.currentVersion],["Latest",bt.green(j.latestVersion??"")]])),K.push(""),K.push("   Run: bunx cc-safety-net@latest doctor"),K.push("   Or:  npx cc-safety-net@latest doctor"),K.join(`
`);return K.push(vr([["Status",`${bt.green("✓")} Up to date`],["Version",j.currentVersion]])),K.join(`
`)}function vr(j){return ln({rows:j})}function As(j){let K=[];return K.push("System Info"),K.push(bp(j)),K.join(`
`)}function bp(j){let K=["Component","Version"],te=(ce)=>{if(ce===null)return bt.dim("not found");return ce},oe=[{label:"cc-safety-net",value:j.version},...ur.map((ce)=>({label:St(ce),value:j.versions[ce]??null})),{label:"Node.js",value:j.nodeVersion},{label:"npm",value:j.npmVersion},{label:"Bun",value:j.bunVersion},{label:"Platform",value:j.platform}].map((ce)=>[ce.label,te(ce.value)]);return ln({headers:K,rows:oe})}function _s(j){if(j.findings.length===0)return bt.green(`
No findings from inspected doctor facts.`);let K={error:j.findings.filter((ce)=>ce.severity==="error").length,warning:j.findings.filter((ce)=>ce.severity==="warning").length,info:j.findings.filter((ce)=>ce.severity==="info").length},te=["error","warning","info"].filter((ce)=>K[ce]>0).map((ce)=>`${K[ce]} ${ce}`),re=j.findings.length===1?"finding":"findings",oe=`
${j.findings.length} ${re}: ${te.join(", ")}.`;if(K.error>0)return bt.red(oe);if(K.warning>0)return bt.yellow(oe);return bt.blue(oe)}import{lstatSync as Lp}from"node:fs";import{dirname as wo}from"node:path";function ko(j,K){try{let te=Lp(K);if(te.isSymbolicLink())return{kind:j,path:K,status:"unsafe",issues:["symlink"]};if(!te.isDirectory())return{kind:j,path:K,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:j,path:K,status:"unknown",issues:[]};let re=[...te.uid!==process.getuid()?["ownership"]:[],...(te.mode&18)!==0?["permissions"]:[]];return{kind:j,path:K,status:re.length>0?"unsafe":"safe",issues:re}}catch(te){if(typeof te==="object"&&te!==null&&"code"in te&&te.code==="ENOENT")return{kind:j,path:K,status:"not-applicable",issues:[]};return{kind:j,path:K,status:"unknown",issues:[]}}}function Ts(j,K){let te=M(j);return{directories:[ko("policy",wo(wo(K))),ko("config",wo(K)),...te?[ko("audit",te)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as wp}from"node:child_process";import{existsSync as Is}from"node:fs";import{delimiter as kp,extname as xp,join as Cp}from"node:path";import{stripVTControlCharacters as $s}from"node:util";var js="2.3.4",Sp=5000,Rp="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function Et(){return js}function xo(j,K){let te=j[K];if(te)return te;let re=Object.keys(j).find((oe)=>oe.toLowerCase()===K.toLowerCase()&&!!j[oe]);return re?j[re]:te}function Pp(j){return(xo(j,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((K)=>K.length>0)}function Ep(j,K){let te=xp(j)?[j]:[...Pp(K).map((re)=>`${j}${re}`),j];if(j.includes("/")||j.includes("\\"))return te.find((re)=>Is(re))??j;return(xo(K,"PATH")??"").split(kp).flatMap((re)=>te.map((oe)=>Cp(re,oe))).find((re)=>Is(re))??j}function Os(j){if(!/[\s"&|<>^]/.test(j))return j;return`"${j.replace(/"/g,'""')}"`}function cn(j,K){let[te,...re]=j,oe=K[Rp]==="win32"?"win32":process.platform;if(!te||oe!=="win32")return{cmd:te??"",args:re};let ce=Ep(te,K);if(!/\.(?:bat|cmd)$/i.test(ce))return{cmd:ce,args:re};return{cmd:xo(K,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",Os(ce),...re.map(Os)].join(" ")]}}var xn=async(j,K=Sp)=>{let te=await Dp(j,{timeoutMs:K});if(te.code!==0)return null;return $s(te.stdout).trim()||$s(te.stderr).trim()||null};function Dp(j,K){let[te,...re]=j;if(!te)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((oe)=>{try{let ce=cn([te,...re],process.env),de=wp(ce.cmd,ce.args,{stdio:["ignore","pipe","pipe"]}),we=!1,xe="",Ce="";de.stdout.on("data",(He)=>{xe+=He.toString()}),de.stderr.on("data",(He)=>{Ce+=He.toString()});let Se=(He)=>{if(we)return;we=!0,clearTimeout(Ne),oe(He)},Ne=setTimeout(()=>{de.kill(),Se({code:null,stdout:xe,stderr:Ce})},K.timeoutMs);de.on("close",(He)=>{Se({code:He,stdout:xe,stderr:Ce})}),de.on("error",()=>{Se({code:null,stdout:xe,stderr:Ce})})}catch{oe({code:null,stdout:"",stderr:""})}})}function br(j){if(!j)return null;let K=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(j);if(K)return K[1]??null;let te=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(j);if(te)return te[1]??null;return j.split(`
`)[0]?.trim()||null}async function Hn(j=xn){let[K,te,re,oe,ce,de]=await Promise.all([Promise.all(Nt.map(async(we)=>[we.id,br(await j([...we.probeCommand]))])),j(["codex","plugin","list"],30000),j(["amp","plugins","list"],30000),j(["node","--version"]),j(["npm","--version"]),j(["bun","--version"])]);return{version:js,versions:Object.fromEntries(K),codexPluginListOutput:te,ampPluginListOutput:re,nodeVersion:br(oe),npmVersion:br(ce),bunVersion:br(de),platform:`${process.platform} ${process.arch}`}}function Co(j,K){if(K==="dev")return!1;let te=j.split(".").map(Number),re=K.split(".").map(Number),[oe=0,ce=0,de=0]=te,[we=0,xe=0,Ce=0]=re;if(oe!==we)return oe>we;if(ce!==xe)return ce>xe;return de>Ce}async function tn(){let j=Et(),K=new AbortController,te=setTimeout(()=>K.abort(),3000);try{let re=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:K.signal});if(!re.ok)return{currentVersion:j,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${re.status}`};let oe=await re.json(),ce=Co(oe.version,j);return{currentVersion:j,latestVersion:oe.version,updateAvailable:ce}}catch(re){return{currentVersion:j,latestVersion:null,updateAvailable:!1,error:re instanceof Error?re.message:"Network error"}}finally{clearTimeout(te)}}import*as qs from"node:readline";var Hs=(j)=>`\x1B[${j}B`,Ap=(j)=>`\x1B[${j}A`;var Fs=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function _p(j){return new Promise((K)=>setTimeout(K,j))}function Tp(j,K,te){if(!te)return K(j);if(te.aborted)return Promise.resolve();return new Promise((re,oe)=>{let ce=()=>te.removeEventListener("abort",de),de=()=>{ce(),re()};te.addEventListener("abort",de,{once:!0}),K(j).then(()=>{ce(),re()},(we)=>{ce(),oe(we)})})}function Un(j,K){return j&&j>0?j:K}function Lr(j){return Math.max(0,Math.min(1,j))}function Cn(j){return Math.max(0,Math.min(255,Math.round(j)))}function So(j){return j<=0.0031308?12.92*j:1.055*j**0.4166666666666667-0.055}function Ip(j,K,te){let re=te*Math.PI/180,oe=K*Math.cos(re),ce=K*Math.sin(re),de=(j+0.3963377774*oe+0.2158037573*ce)**3,we=(j-0.1055613458*oe-0.0638541728*ce)**3,xe=(j-0.0894841775*oe-1.291485548*ce)**3;return{blue:Cn(So(Lr(-0.0041960863*de-0.7034186147*we+1.707614701*xe))*255),green:Cn(So(Lr(-1.2684380046*de+2.6097574011*we-0.3413193965*xe))*255),red:Cn(So(Lr(4.0767416621*de-3.3077115913*we+0.2309699292*xe))*255)}}function Ro(j,K){let te=(K*j*180/Math.PI%360+360)%360;return Ip(0.72,0.15,te)}function Us(j,K=0.1){let te=Ro(K,j);return`\x1B[38;2;${te.red};${te.green};${te.blue}m`}function $p(j,K){return{blue:Cn(j.blue+(255-j.blue)*K),green:Cn(j.green+(255-j.green)*K),red:Cn(j.red+(255-j.red)*K)}}function Gs(j,K,te){let re=Math.imul(j+2654435769,2246822507)^Math.imul(K+3266489909,668265263)^Math.imul(te+374761393,2654435761),oe=re^re>>>15,ce=Math.imul(oe,739982445),de=ce^ce>>>12,we=Math.imul(de,695872825);return((we^we>>>15)>>>0)/4294967296}function Op(j,K,te){let re=Math.floor(Gs(j,K,te)*Fs.length);return Fs[re]??"░"}function Ns(j){let K=Lr(j);return K*K*K*(K*(K*6-15)+10)}function jp(j){if(j.length===0)return"";let K=[],te=!1,re="";for(let oe of j){let ce=`${oe.red};${oe.green};${oe.blue}`;if(oe.bold!==te)K.push(oe.bold?"\x1B[1m":"\x1B[22m"),te=oe.bold;if(ce!==re)K.push(`\x1B[38;2;${ce}m`),re=ce;K.push(oe.character)}return`${K.join("")}\x1B[22m\x1B[39m`}function Fp(j,K,te,re,oe){return j.map((ce,de)=>({...Ro(te,re+K+de/oe),bold:!1,character:ce}))}function Np(j,K,te,re,oe,ce,de,we){let xe=Math.max(1,re*0.75),Ce=Math.min(1,te/xe),Se=oe*Ns(Ce),Ne=Math.max(0,(te-xe)/Math.max(1,re-xe)),He=(1-Ns(te/re))*we*2,at=0.35*Math.max(0,1-Ne*2),mt=Ce>=1,it=Math.min(j.length,Math.ceil(Se+2+1));return j.slice(0,it).map((gt,ht)=>{let vt=Ro(ce,de+K+ht/we+He),yt=ht+Gs(K,ht,7919)*2-1;if(yt>Se+2)return{...vt,bold:!1,character:" "};let kt=Se-yt,Lt=0.8*Math.exp(-(kt*kt)/12.5),Ct=Math.min(0.9,Lt+at),sn=!mt&&yt>Se-4;return{...$p(vt,Ct),bold:Ct>0.3,character:sn?Op(K,ht,te):gt}})}function Ms(j){return`\x1B[?2026h${j.map((K,te)=>`\x1B8${te>0?Hs(te):""}${jp(K)}`).join("")}\x1B[?2026l`}async function Po(j,K={}){if(!j)return;let te=K.output??process.stdout,re=K.sleep??_p,oe=Un(K.frequency,0.1),ce=K.seed??0,de=Un(K.speed,40),we=Un(K.spread,3),xe=Un(K.frameRate,60),Ce=Math.max(1,Math.floor(Un(K.duration,12))),Se=j.split(`
`).map((it)=>Array.from(it)),Ne=Math.max(...Se.map((it)=>it.length)),He=1000*Ce*Se.filter((it)=>it.length>0).length/de,at=Ne>0?Math.max(1,Math.ceil(He/(1000/xe))):0,mt=at>0?He/at:0;te.write(`\x1B[?25l${Se.length>1?`${`
`.repeat(Se.length-1)}${Ap(Se.length-1)}`:""}\x1B7`);try{for(let it=1;it<=at;it+=1){if(K.signal?.aborted)break;te.write(Ms(Se.map((gt,ht)=>Np(gt,ht,it,at,Ne,oe,ce,we)))),await Tp(mt,re,K.signal)}}finally{if(te.write(Ms(Se.map((it,gt)=>Fp(it,gt,oe,ce,we)))),te.write("\x1B8"),Se.length>1)te.write(Hs(Se.length-1));te.write(`
\x1B[0m\x1B[?25h`)}}var Bs=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function Mp(j){return Boolean(j.isTTY)}async function Gn(j={}){let K=j.output??process.stdout;if(!Mp(K))return;let te=j.input??process.stdin,re={duration:j.duration,frequency:j.frequency,output:K,seed:j.seed??Math.random()*8192,sleep:j.sleep,speed:j.speed,spread:j.spread};if(!te.isTTY||typeof te.setRawMode!=="function"){await Po(Bs,re);return}let oe=new AbortController,ce=te.readableFlowing===!0,de=te.isRaw===!0,we=!1,xe=(Ce,Se)=>{if(Se.ctrl&&Se.name==="c")we=!0;if(we||Se.name==="return"||Se.name==="enter")oe.abort()};qs.emitKeypressEvents(te),te.on("keypress",xe),te.setRawMode(!0),te.resume();try{await Po(Bs,{...re,signal:oe.signal})}finally{if(te.off("keypress",xe),te.setRawMode(de),!ce)te.pause()}if(!we)return;if(j.onInterrupt){j.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as qp}from"node:crypto";import{existsSync as Js}from"node:fs";import{dirname as wr,join as Ws}from"node:path";import{dirname as Vs,join as Hp,resolve as Up}from"node:path";var Gp="rule.lock";function Bp(j){return Hp(Vs(j),Gp)}function zs(j={}){return Up(j.cwd??process.cwd(),".safety-net.json")}function $t(j,K){let te=K.global?K.userConfigPath??T(j,K):K.projectConfigPath??A(K.cwd??process.cwd()),re=K.global?Qe(j,K):et(te,K.cwd??process.cwd()),oe=Bp(te);return{configDir:Vs(te),configPath:te,lockPath:oe,filesystemScope:re,configTarget:s(re,te),lockTarget:s(re,oe)}}var Vp="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",zp="cache",Jp="rulebooks";function Ks(j,K={}){let te=$t(j,K),re=s(te.filesystemScope,Zs(te.configDir)),oe=r(te.lockTarget);if(console.log(Vp),oe===null&&!Js(re.path))return console.log(`No v2 lock or cache leftovers found in ${wr(te.configDir)}; nothing to migrate.`),0;let ce=Xp(oe),de=m(te.configTarget);if(!de.config&&(r(te.configTarget)!==null||ce.size>0))return console.error(`Cannot migrate: the rules config in ${wr(te.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let we=de.config?.rules??[];for(let xe of we.flatMap((Ce)=>Wp(Ce,ce,te,re,K.global===!0)))console.log(xe);return G(te.lockTarget),lt(re),console.log(`Removed the v2 lock and cache under ${wr(te.configDir)}.`),0}function Ys(j,K){return[...new Set([{cwd:K},{cwd:K,global:!0}].flatMap((te)=>{let re=$t(j,te);return[re.lockPath,Zs(re.configDir)]}))].filter((te)=>Js(te))}function Wp(j,K,te,re,oe){if(!x(j))return[];let ce=O(j).name,de=s(te.filesystemScope,N(te.configDir,ce)),we=r(de);if(we!==null&&Kp(we,ce))return[];let xe=K.get(j),Ce=xe?Yp(xe,ce,re.path,te.filesystemScope):null;if(Ce===null)return[`Could not migrate ${j} from the v2 cache. Run \`cc-safety-net rule update ${j}${oe?" --global":""}\` to vendor it.`];if(y(de,Ce),we!==null)return[`Restored ${j} from the v2 cache over an invalid file.`];return[`Vendored ${j} from the v2 cache.`]}function Kp(j,K){let te=he(j);return!("problem"in te)&&te.rulebook.name===K}function Yp(j,K,te,re){let oe=Ws(te,Jp,`${Zp(j)}--${j.digest.replace("sha256:","").slice(0,12)}`,pe),ce=r(s(re,oe));if(ce===null||t2(ce)!==j.digest)return null;let de=he(ce);if("problem"in de||de.rulebook.name!==K)return null;return ce}function Zs(j){return Ws(wr(j),zp)}function Zp(j){return([j.owner,j.repo,j.display_ref,j.name].every((re)=>typeof re==="string"&&re!=="")?`${j.owner}/${j.repo}#${j.display_ref}/${j.name}`:j.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function Xp(j){let K=j===null?null:e2(j),te=Xs(K)&&Array.isArray(K.rulebooks)?K.rulebooks:[];return new Map(te.filter(Qp).map((re)=>[re.spec,re]))}function Qp(j){return Xs(j)&&typeof j.spec==="string"&&typeof j.digest==="string"}function Xs(j){return!!j&&typeof j==="object"}function e2(j){try{return JSON.parse(j)}catch{return null}}function t2(j){return`sha256:${qp("sha256").update(j).digest("hex")}`}var Qs="\r\x1B[2K",n2="\x1B[?25l",r2="\x1B[39m",o2="\x1B[?25h",i2=100,s2=0.55,a2=80,ea=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function l2(j){return new Promise((K)=>setTimeout(K,j))}async function kr(j,K={}){let te=K.output??process.stdout;if(!te.isTTY)return j;let re=K.sleep??l2,oe=!1,ce=j.then((we)=>(oe=!0,we),(we)=>{throw oe=!0,we});if(await Promise.race([ce.then(()=>!0),re(i2).then(()=>!1)]))return ce;te.write(n2);try{for(let we=0;!oe;we+=1)te.write(`${Qs}${Us(we*s2)}${ea[we%ea.length]}${r2} ${K.loadingMessage??"Loading…"}`),await Promise.race([ce,re(a2)]);return await ce}finally{te.write(`${Qs}${o2}`)}}async function Bn(j,K,te,re={}){let oe=K();if(j)await te();if(j&&oe.ready)await kr(oe.ready,re);return oe.finish()}import{stripVTControlCharacters as c2}from"node:util";var xr="amp plugins list",d2=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function ta(j){if(!j.ampPluginListOutput)return{platform:"amp",status:"n/a"};let K=c2(j.ampPluginListOutput).split(`
`).map((te)=>d2.exec(te)?.[1]).find((te)=>te!==void 0);if(!K)return{platform:"amp",status:"n/a"};if(K!=="active")return{platform:"amp",status:"disabled",method:xr,configPath:xr,errors:[`Amp personal plugin cc-safety-net is ${K}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:xr,configPath:xr}}import{existsSync as f2,readFileSync as m2}from"node:fs";import{isAbsolute as vv,join as p2,relative as bv}from"node:path";function qn(j){return p2(j,".gemini","config","hooks.json")}var g2=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function y2(j){if(!j||typeof j!=="object"||Array.isArray(j))return[];return Object.values(j).flatMap((K)=>{if(!K||typeof K!=="object"||Array.isArray(K))return[];let te=K,re=te.PreToolUse;if(!Array.isArray(re))return[];return re.flatMap((oe)=>{if(!oe||typeof oe!=="object"||Array.isArray(oe))return[];let ce=oe.hooks;if(!Array.isArray(ce))return[];return ce.flatMap((de)=>{if(!de||typeof de!=="object"||Array.isArray(de))return[];let we=de.command;if(typeof we!=="string"||!g2.test(we))return[];return[{command:we,enabled:te.enabled!==!1}]})})})}function na(j){let K=qn(j.environment.home);if(!f2(K))return{platform:"antigravity-cli",status:"n/a",configPath:K};let te;try{te=y2(JSON.parse(m2(K,"utf-8")))}catch(re){return{platform:"antigravity-cli",status:"n/a",configPath:K,errors:[`Failed to parse Antigravity hooks config ${K}: ${re instanceof Error?re.message:String(re)}`]}}if(te.some((re)=>re.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:K};if(te.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:K};return{platform:"antigravity-cli",status:"n/a",configPath:K}}import{join as ra}from"node:path";import{existsSync as h2,lstatSync as v2,readFileSync as b2}from"node:fs";function qt(j,K=(te)=>te){if(!h2(j))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(K(b2(j,"utf-8")))}}catch{return{kind:"unreadable"}}}function Pt(j){try{return v2(j)}catch{return}}function Cr(j,K){let te=Pt(K);if(!te)return{platform:j,status:"n/a",configPath:K};if(!te.isSymbolicLink()&&te.isDirectory())return;return{platform:j,status:"n/a",configPath:K,errors:[`${K} is a symlink or not a directory; move or remove it before installing`]}}function wt(j,K){return typeof j==="object"&&j!==null?j[K]:void 0}var Eo="cc-safety-net@cc-marketplace";function oa(j){return ra(j.home,".claude","plugins","installed_plugins.json")}function ia(j,K){let te=wt(wt(j,"plugins"),K);return Array.isArray(te)&&te.length>0}function Sr(j,K){let te=qt(oa(j));return te.kind==="ok"&&ia(te.value,K)}function Do(j){let K=oa(j),te=qt(K);if(te.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(te.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!ia(te.value,Eo))return{platform:"claude-code",status:"n/a"};let re=ra(j.home,".claude","settings.json"),oe=qt(re);if(oe.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(oe.kind==="ok"&&wt(wt(oe.value,"enabledPlugins"),Eo)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:re,errors:[`${Eo} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:K}}function sa(j){return Do(j.environment)}function aa(j){if(!j.codexPluginListOutput)return{platform:"codex",status:"n/a"};let K=j.codexPluginListOutput.split(`
`).find((te)=>te.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!K)return{platform:"codex",status:"n/a"};if(!K.includes("installed,"))return{platform:"codex",status:"n/a"};if(!K.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list"}}import{existsSync as _r,readdirSync as L2,readFileSync as w2}from"node:fs";import{join as Tt}from"node:path";function jt(j){let K="",te=0,re=!1,oe=!1,ce=-1;while(te<j.length){let de=j[te],we=j[te+1];if(oe){K+=de,oe=!1,te++;continue}if(de==='"'&&!re){re=!0,ce=-1,K+=de,te++;continue}if(de==='"'&&re){re=!1,K+=de,te++;continue}if(de==="\\"&&re){oe=!0,K+=de,te++;continue}if(re){K+=de,te++;continue}if(de==="/"&&we==="/"){while(te<j.length&&j[te]!==`
`)te++;continue}if(de==="/"&&we==="*"){te+=2;while(te<j.length-1){if(j[te]==="*"&&j[te+1]==="/"){te+=2;break}te++}continue}if(de===","){ce=K.length,K+=de,te++;continue}if(de==="}"||de==="]"){if(ce!==-1){let xe=K.slice(ce+1);if(/^\s*$/.test(xe))K=K.slice(0,ce)+xe}ce=-1,K+=de,te++;continue}if(!/\s/.test(de))ce=-1;K+=de,te++}return K}function Ao(j,K,te){let re=K+1,oe=!1;while(re<j.length){if(oe){oe=!1,re++;continue}if(j[re]==="\\"){oe=!0,re++;continue}if(j[re]==='"')return re+1;re++}throw Error(te)}function _o(j,K,te){let re=j[K],oe=re==="["?"]":"}",ce=0,de=K;while(de<j.length){let we=te.skipComment?.(j,de)??de;if(we!==de){de=we;continue}if(j[de]==='"'){de=Ao(j,de,te.stringError);continue}if(j[de]===re)ce++;if(j[de]===oe){if(ce--,ce===0)return de}de++}throw Error(te.bracketError)}function ca(j,K){let te=j.lastIndexOf(`
`,K)+1;return/^[ \t]*/.exec(j.slice(te))?.[0]??""}function Pr(j,K){let te=K.end+(/^\s*/.exec(j.slice(K.end))?.[0].length??0);if(j[te]===","){let de=j[te+1]===`
`?te+2:te+1;return`${j.slice(0,K.start)}${j.slice(de)}`}let re=j.slice(0,K.start).search(/\s*$/)-1;if(j[re]!==",")return`${j.slice(0,K.start)}${j.slice(K.end)}`;let oe=j.lastIndexOf(`
`,re-1),ce=oe!==-1&&/^\s*$/.test(j.slice(oe+1,re))?oe:re;return`${j.slice(0,ce)}${j.slice(K.end)}`}function Rr(j,K){if(j.startsWith("//",K)){let te=j.indexOf(`
`,K+2);return te===-1?j.length:te+1}if(j.startsWith("/*",K)){let te=j.indexOf("*/",K+2);return te===-1?j.length:te+2}return K}function la(j,K){let te=K;while(te<j.length){if(/\s/.test(j[te]??"")){te++;continue}let re=Rr(j,te);if(re===te)return te;te=re}return te}function da(j,K,te){let re=0,oe=0;while(oe<j.length){let ce=Rr(j,oe);if(ce!==oe){oe=ce;continue}if(j[oe]==='"'){let de=Ao(j,oe,te.stringError);if(re===1&&JSON.parse(j.slice(oe,de))===K){let we=la(j,de),xe=la(j,we+1);if(j[we]===":"&&j[xe]==="[")return{start:xe,end:_o(j,xe,{skipComment:Rr,...te})}}oe=de;continue}if(j[oe]==="{"||j[oe]==="[")re++;if(j[oe]==="}"||j[oe]==="]")re--;oe++}return}function ua(j,K,te){let re=[],oe=K.start+1;while(oe<K.end){let ce=Rr(j,oe);if(ce!==oe){oe=ce;continue}if(j[oe]==='"'){let de=Ao(j,oe,te),we=JSON.parse(j.slice(oe,de));if(typeof we==="string")re.push({range:{start:oe,end:de},value:we});oe=de;continue}oe++}return re}var Vt="cc-safety-net@cc-marketplace",Er=["cc-marketplace","cc-safety-net"],pa=["_direct","copilot-safety-net"],fa=["cc-marketplace","safety-net"],ma="safety-net@cc-marketplace";function Dr(j,K){let te=K.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${te}([^a-z0-9-]|$)`,"m").test(j??"")}function ga(j){return Dr(j,"cc-safety-net@cc-marketplace")}function ya(j){return Dr(j,"cc-marketplace")}function ha(j){return Dr(j,"copilot-safety-net")}function va(j){return Dr(j,"safety-net@cc-marketplace")}function To(j){if(!j?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(j)}function La(j,K){if(!j)return null;let te=j.match(/(\d+)\.(\d+)\.(\d+)/);if(!te)return null;let re=[Number(te[1]),Number(te[2]),Number(te[3])];for(let oe=0;oe<K.length;oe++){let ce=re[oe]??0,de=K[oe]??0;if(ce!==de)return ce>de}return!0}function k2(j){return La(j,[0,0,422])}function x2(j){return La(j,[1,0,8])}function Vn(j){return j.env.get("COPILOT_HOME")||Tt(j.home,".copilot")}function Io(j){return(j.hooks?.preToolUse??[]).some((te)=>{if(te.type!=="command")return!1;return To(te.command)||To(te.bash)||To(te.powershell)})}function Ar(j){return j===void 0||typeof j==="string"}function C2(j){if(!j||typeof j!=="object"||Array.isArray(j))return!1;let K=j;if(K.disableAllHooks!==void 0&&typeof K.disableAllHooks!=="boolean")return!1;if(K.hooks===void 0)return!0;if(!K.hooks||typeof K.hooks!=="object"||Array.isArray(K.hooks))return!1;let te=K.hooks.preToolUse;if(te===void 0)return!0;return Array.isArray(te)&&te.every((re)=>re!==null&&typeof re==="object"&&!Array.isArray(re)&&Ar(re.type)&&Ar(re.command)&&Ar(re.bash)&&Ar(re.powershell))}function $o(j,K){try{let te=JSON.parse(jt(w2(j,"utf-8")));if(!C2(te)){K?.push(`Invalid hook config ${j}: hooks.preToolUse must be an array of hook objects`);return}return te}catch(te){K?.push(`Failed to parse ${j}: ${te instanceof Error?te.message:String(te)}`);return}}function wa(j,K){try{return L2(j).filter((te)=>te.endsWith(".json")).sort((te,re)=>te.localeCompare(re))}catch(te){return K?.push(`Failed to read ${j}: ${te instanceof Error?te.message:String(te)}`),[]}}function S2(j,K){if(!_r(j))return[];let te=[];for(let re of wa(j,K)){let oe=Tt(j,re),ce=$o(oe,K);if(ce&&Io(ce))te.push(oe)}return te}function Sn(j,K){if(!_r(j))return;let te=$o(j,K);if(!te)return;return{path:j,config:te}}function ba(j,K,te,re){if(K){j.push(`GitHub Copilot CLI ${K} does not support ${te}; requires ${re}+`);return}j.push(`GitHub Copilot CLI version unavailable; skipping ${te} because it requires ${re}+`)}function R2(j){for(let K of j){if(K?.config.disableAllHooks===!0)return K.path;if(K?.config.disableAllHooks===!1)return}return}function P2(j,K,te,re){let oe=Vn(j),ce=Tt(K,".github","hooks"),de=Tt(oe,"hooks"),we=Tt(K,".github","copilot"),xe=Tt(K,".claude"),Ce=x2(te),Se=Ce===!0?re:void 0,Ne=[Sn(Tt(we,"settings.local.json"),Se),Sn(Tt(we,"settings.json"),Se),Sn(Tt(xe,"settings.local.json"),Se),Sn(Tt(xe,"settings.json"),Se)],He=[Sn(Tt(oe,"settings.json"),Se),Sn(Tt(oe,"config.json"),Se)];if(Ce!==!1){let kt=R2([...Ne,...He]);if(kt){if(Ce===null)re.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${kt} as active`);return{activeConfigPaths:[],disabledBy:kt}}}let at=S2(ce,re),mt=k2(te),it=mt===!0?re:void 0,gt=_r(de)?wa(de,it):[],ht=[];for(let kt of gt){let Lt=Tt(de,kt),Ct=$o(Lt,it);if(Ct&&Io(Ct))ht.push(Lt)}if(mt!==!0&&ht.length>0)ba(re,te,`user hook files in ${de}`,"0.0.422"),ht.length=0;let vt=[];for(let kt of[...Ne,...He]){if(!kt)continue;if(!Io(kt.config))continue;if(Ce===!0){vt.push(kt);continue}ba(re,te,"inline hook definitions in Copilot config files","1.0.8");break}let yt=(kt)=>kt.filter((Lt)=>!!Lt&&vt.includes(Lt)).map((Lt)=>Lt.path);return{activeConfigPaths:[...yt(Ne),...at,...yt(He),...ht]}}function ka(j){let K=[],te=P2(j.environment,j.cwd,j.copilotCliVersion,K);if(te.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:te.disabledBy,configPaths:[te.disabledBy],errors:K.length>0?K:void 0};let re=Vn(j.environment),oe=Tt(re,"installed-plugins",...Er),ce=_r(oe),de=Tt(re,"settings.json"),we=qt(de,jt);if(ce&&we.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};if(ce&&we.kind==="ok"&&wt(wt(we.value,"enabledPlugins"),Vt)===!1)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:de,errors:[`${Vt} is installed but not enabled in Copilot CLI`]};if(ce||te.activeConfigPaths.length>0){let xe=ce,Ce=te.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:xe?"plugin config":"hook config",configPath:Ce??(xe?oe:void 0),configPaths:te.activeConfigPaths.length>0?te.activeConfigPaths:void 0,errors:K.length>0?K:void 0}}return{platform:"copilot-cli",status:"n/a",errors:K.length>0?K:void 0}}import{existsSync as F2,readFileSync as N2}from"node:fs";import{existsSync as xa,mkdirSync as A2,readFileSync as _2}from"node:fs";import{dirname as T2,join as I2}from"node:path";import{renameSync as E2,writeFileSync as D2}from"node:fs";function Dt(j,K){let te=`${j}.${process.pid}.tmp`;D2(te,K),E2(te,j)}var zt=Object.fromEntries(Mn.map((j)=>[j.id,`npx -y cc-safety-net hook ${j.flags[1]}`]));var zn=zt.cursor,Ca=30;function Ir(j){return I2(j.home,".cursor","hooks.json")}function dn(j){return typeof j==="object"&&j!==null&&!Array.isArray(j)}function Oo(){return{command:zn,timeout:Ca,failClosed:!0}}function Tr(j){return dn(j)&&j.command===zn}function $2(j){return Object.keys(j).length===3&&j.command===zn&&j.timeout===Ca&&j.failClosed===!0}function O2(j){try{return JSON.parse(_2(j,"utf-8"))}catch(K){if(K instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${j}: ${K.message}`);throw K}}function Sa(j){let K=O2(j);if(!dn(K))throw Error(`Cursor hooks config ${j} must be a JSON object`);if(K.version!==1)throw Error(`Cursor hooks config ${j} must set "version": 1`);if(K.hooks!==void 0&&!dn(K.hooks))throw Error(`Cursor hooks config ${j} "hooks" must be an object`);let te=dn(K.hooks)?K.hooks.preToolUse:void 0;if(te!==void 0&&!Array.isArray(te))throw Error(`Cursor hooks config ${j} "hooks.preToolUse" must be an array`);return K}function Ra(j){let K=dn(j.hooks)?j.hooks.preToolUse:void 0;return Array.isArray(K)?K:[]}function j2(j){if(!j.some(Tr))return[...j,Oo()];return j.reduce((K,te)=>{if(!Tr(te))return K.result.push(te),K;if(!K.inserted)K.result.push(Oo()),K.inserted=!0;return K},{result:[],inserted:!1}).result}function Pa(j,K,te){let re=dn(K.hooks)?K.hooks:{},oe={...K,hooks:{...re,preToolUse:te}};Dt(j,`${JSON.stringify(oe,null,2)}
`)}function Ea(j){let K=Ir(j);if(!xa(K))return A2(T2(K),{recursive:!0}),Dt(K,`${JSON.stringify({version:1,hooks:{preToolUse:[Oo()]}},null,2)}
`),{path:K,alreadyInstalled:!1};let te=Sa(K),re=Ra(te),oe=re.filter(Tr);if(dn(te.hooks)&&Array.isArray(te.hooks.preToolUse)&&oe.length===1&&oe[0]!==void 0&&$2(oe[0]))return{path:K,alreadyInstalled:!0};return Pa(K,te,j2(re)),{path:K,alreadyInstalled:!1}}function Da(j){let K=Ir(j);if(!xa(K))return{path:K,alreadyInstalled:!1};let te=Sa(K),re=Ra(te),oe=re.filter((ce)=>!Tr(ce));if(oe.length===re.length)return{path:K,alreadyInstalled:!1};return Pa(K,te,oe),{path:K,alreadyInstalled:!0}}function M2(j){if(!j||typeof j!=="object"||Array.isArray(j))return[];let K=j.hooks;if(!K||typeof K!=="object"||Array.isArray(K))return[];let te=K.preToolUse;if(!Array.isArray(te))return[];return te.filter((re)=>!!re&&typeof re==="object"&&!Array.isArray(re)&&re.command===zn)}function H2(j){let K=[];if(j.length>1)K.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let te=j[0];if(te&&te.failClosed!==!0)K.push('Managed hook is missing "failClosed": true; reinstall to repair');if(te&&te.timeout!==30)K.push('Managed hook "timeout" is not 30; reinstall to repair');return K}function Aa(j){let K=Ir(j.environment);if(!F2(K))return{platform:"cursor",status:"n/a",configPath:K};let te;try{te=JSON.parse(N2(K,"utf-8"))}catch(ce){return{platform:"cursor",status:"n/a",configPath:K,errors:[`Failed to parse Cursor hooks config ${K}: ${ce instanceof Error?ce.message:String(ce)}`]}}let re=M2(te);if(re.length===0)return{platform:"cursor",status:"n/a",configPath:K};let oe=H2(re);return{platform:"cursor",status:"configured",method:"hook config",configPath:K,errors:oe.length>0?oe:void 0}}import{existsSync as U2}from"node:fs";import{join as jo}from"node:path";var Fo="gemini-safety-net";function No(j){let K=jo(j.home,".gemini","extensions"),te=jo(K,Fo);if(!U2(te))return{platform:"gemini-cli",status:"n/a"};let re=jo(K,"extension-enablement.json"),oe=qt(re);if(oe.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let ce=oe.kind==="ok"?wt(wt(oe.value,Fo),"overrides"):void 0;if(Array.isArray(ce)&&ce.some((we)=>typeof we==="string"&&we.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:re,errors:[`${Fo} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:te}}function _a(j){return No(j.environment)}import{existsSync as V2,readFileSync as z2}from"node:fs";import{existsSync as Ia,mkdirSync as G2,readFileSync as $a,rmSync as B2}from"node:fs";import{dirname as q2,join as Ta}from"node:path";var Jn=zt["grok-build"],jr=30;function Fr(j){return Ta(j.env.get("GROK_HOME")??Ta(j.home,".grok"),"hooks","cc-safety-net.json")}function un(j){return typeof j==="object"&&j!==null&&!Array.isArray(j)}function $r(){return{hooks:[{type:"command",command:Jn,timeout:jr}]}}function Oa(j){return un(j)&&j.command===Jn}function ja(j){return j.flatMap((K)=>{if(!un(K)||!Array.isArray(K.hooks))return[K];let te=K.hooks.filter((re)=>!Oa(re));if(te.length===K.hooks.length)return[K];return te.length===0?[]:[{...K,hooks:te}]})}function Fa(j){try{let K=JSON.parse(j);return un(K)?K:null}catch{return null}}function Na(j){let K=un(j.hooks)?j.hooks.PreToolUse:void 0;return Array.isArray(K)?K:[]}function Or(j,K,te){let re=un(K.hooks)?K.hooks:{};Dt(j,`${JSON.stringify({...K,hooks:{...re,PreToolUse:te}},null,2)}
`)}function Ma(j){let K=Fr(j);if(!Ia(K))return G2(q2(K),{recursive:!0}),Or(K,{},[$r()]),{path:K,alreadyInstalled:!1};let te=Fa($a(K,"utf-8"));if(!te)return Or(K,{},[$r()]),{path:K,alreadyInstalled:!1};let re=Na(te),oe=re.filter((ce)=>un(ce)&&Array.isArray(ce.hooks)&&ce.hooks.some(Oa));if(oe.length===1&&JSON.stringify(oe[0])===JSON.stringify($r()))return{path:K,alreadyInstalled:!0};return Or(K,te,[...ja(re),$r()]),{path:K,alreadyInstalled:!1}}function Ha(j){let K=Fr(j);if(!Ia(K))return{path:K,alreadyInstalled:!1};let te=Fa($a(K,"utf-8"));if(!te)return{path:K,alreadyInstalled:!1};let re=Na(te),oe=ja(re);if(JSON.stringify(oe)===JSON.stringify(re))return{path:K,alreadyInstalled:!1};let ce=un(te.hooks)?te.hooks:{};if(oe.length===0&&Object.keys(te).length===1&&Object.keys(ce).length===1)return B2(K),{path:K,alreadyInstalled:!0};return Or(K,te,oe),{path:K,alreadyInstalled:!0}}function Wn(j){return!!j&&typeof j==="object"&&!Array.isArray(j)}function J2(j){if(!Wn(j)||!Wn(j.hooks))return[];let K=j.hooks.PreToolUse;if(!Array.isArray(K))return[];return K.filter((te)=>Wn(te)&&Array.isArray(te.hooks)&&te.hooks.some((re)=>Wn(re)&&re.command===Jn))}function W2(j){let te=(Array.isArray(j.hooks)?j.hooks.filter(Wn):[]).find((re)=>re.command===Jn);return[...j.matcher===void 0||j.matcher===""||j.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...te?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...te?.timeout===jr?[]:[`Managed hook "timeout" is not ${jr}; reinstall to repair`]]}function Ua(j){let K=Fr(j.environment);if(!V2(K))return{platform:"grok-build",status:"n/a",configPath:K};let te;try{te=JSON.parse(z2(K,"utf-8"))}catch(ce){return{platform:"grok-build",status:"n/a",configPath:K,errors:[`Failed to parse Grok Build hooks config ${K}: ${ce instanceof Error?ce.message:String(ce)}`]}}let re=J2(te)[0];if(!re)return{platform:"grok-build",status:"n/a",configPath:K};let oe=W2(re);return{platform:"grok-build",status:"configured",method:"hook config",configPath:K,errors:oe.length>0?oe:void 0}}import{readFileSync as Ka}from"node:fs";import{join as Ya}from"node:path";var Ft="cc-safety-net",Mo="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",K2=30;function Ga(j){return`${Mo}
# version: ${j}
`}function Y2(j){return`${Ga(j)}name: ${Ft}
version: "${j}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function Z2(j){return`${Ga(j)}"""CC Safety Net guard for Hermes Agent.

Registers pre_tool_call and forwards the tool call to the packaged CC Safety Net
adapter (cc-safety-net hook --hermes-agent) over JSON stdin. The adapter prints nothing
when the call is allowed and an {"action": "block", ...} directive when it is denied.
Hermes ignores a callback that raises, so every transport and analysis failure is turned
into an explicit block here instead.
"""

import json
import os
import shutil
import signal
import subprocess

HOOK_EVENT = "pre_tool_call"
SUPPORTED_TOOLS = ("patch", "read_file", "terminal", "write_file")
ANALYZER = [${zt["hermes-agent"].split(" ").map((K)=>`"${K}"`).join(", ")}]
TIMEOUT_SECONDS = ${K2}


def _block(detail):
    return {"action": "block", "message": "CC Safety Net failed closed: " + detail}


def _terminal_cwd(task_id, process_cwd):
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
        or process_cwd
    )


def _pre_tool_call(tool_name="", args=None, session_id="", task_id="", **_):
    if tool_name not in SUPPORTED_TOOLS:
        return None

    executable = shutil.which(ANALYZER[0])
    if executable is None:
        return _block(ANALYZER[0] + " was not found on PATH.")

    try:
        cwd = os.getcwd()
    except OSError as error:
        return _block("the working directory could not be resolved (%s)." % error)

    if tool_name == "terminal":
        try:
            cwd = _terminal_cwd(task_id, cwd)
        except ImportError as error:
            # Without the session record we cannot tell which directory the command runs in,
            # and analysing the wrong one clears every path-scoped protection.
            return _block(
                "the Hermes session directory could not be read (%s). Update cc-safety-net and "
                "reinstall the plugin with: npx -y cc-safety-net install --hermes-agent." % error
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
            # UnicodeDecodeError on output it cannot read — an exception Hermes swallows by
            # allowing the tool call. "replace" turns that into unreadable output, which blocks.
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
`}function Kn(j){return[{name:"__init__.py",content:Z2(j)},{name:"plugin.yaml",content:Y2(j)}]}import{mkdirSync as X2,readdirSync as Q2,readFileSync as ef,rmSync as Ho}from"node:fs";import{join as pn}from"node:path";var tf="__pycache__";function Uo(j){let K=j.env.get("HERMES_HOME")?.trim();return K?K:pn(j.home,".hermes")}function Go(j){return pn(Uo(j),"plugins",Ft)}function Bo(j){return j.startsWith(Mo)}function qo(j,K){let te=Go(j),re=Pt(te);if(re&&(re.isSymbolicLink()||!re.isDirectory()))throw Error(`Refusing to ${K} ${te}: not a regular directory. Move or remove it and rerun ${K==="install"?"install":"uninstall"} --hermes-agent.`);return te}function Ba(j,K){let te=Pt(j);if(!te)return;if(te.isSymbolicLink()||!te.isFile())throw Error(`Refusing to ${K} ${j}: not a regular file. Move or remove it.`);let re=ef(j,"utf-8");if(!Bo(re))throw Error(`Refusing to ${K} unmanaged file at ${j}. Move or remove it.`);return re}function qa(j){let K=qo(j,"install"),te=Kn(Et());if(te.map((oe)=>Ba(pn(K,oe.name),"overwrite")).every((oe,ce)=>oe===te[ce]?.content))return{path:K,alreadyInstalled:!0};return X2(K,{recursive:!0}),te.forEach((oe)=>{Dt(pn(K,oe.name),oe.content)}),{path:K,alreadyInstalled:!1}}function Vo(j){let K=qo(j,"remove");if(!Pt(K))return[];return Kn(Et()).filter((te)=>Ba(pn(K,te.name),"remove")!==void 0)}function Va(j){let K=qo(j,"remove");if(!Pt(K))return{path:K,alreadyInstalled:!1};let te=Vo(j);if(te.forEach((re)=>{Ho(pn(K,re.name))}),Ho(pn(K,tf),{recursive:!0,force:!0}),Q2(K).length===0)Ho(K,{recursive:!0});return{path:K,alreadyInstalled:te.length>0}}var Nr="hermes-agent",za=/^([^\s#][^:]*):/,nf=/^\s+([A-Za-z_][\w-]*):/,Ja=/^\s+-\s*(.*)$/;function rf(j){return j.trim().replace(/^(["'])(.*)\1$/,"$2")}function of(j){let K=j.split(/\r?\n/),te=K.findIndex((ce)=>za.exec(ce)?.[1]?.trim()==="plugins");if(te===-1)return[];let re=K.slice(te+1),oe=re.findIndex((ce)=>za.test(ce));return oe===-1?re:re.slice(0,oe)}function Wa(j,K){let te=of(j),re=te.findIndex((de)=>nf.exec(de)?.[1]===K);if(re===-1)return[];let oe=te.slice(re+1),ce=oe.findIndex((de)=>!Ja.test(de));return(ce===-1?oe:oe.slice(0,ce)).map((de)=>rf(Ja.exec(de)?.[1]??""))}function sf(j){try{return Ka(Ya(Uo(j),"config.yaml"),"utf-8")}catch{return}}function zo(j){let K=sf(j)??"";return Wa(K,"enabled").includes(Ft)&&!Wa(K,"disabled").includes(Ft)}function Za(j){return/^# version:\s*(.+)$/m.exec(j)?.[1]?.trim()}function af(j,K){let te=Pt(j);if(!te)return{error:`${K.name} is missing from ${j}; run install --hermes-agent`};if(te.isSymbolicLink()||!te.isFile())return{error:`${j} is a symlink or not a regular file; move or remove it`};try{let re=Ka(j,"utf-8");if(!Bo(re))return{error:`Unmanaged ${K.name} occupies ${j}; move or remove it`};if(Za(re)===Et()&&re!==K.content)return{error:`Modified ${K.name} occupies ${j}; run install --hermes-agent to restore it`};return{content:re}}catch(re){return{error:`Failed to read ${j}: ${re instanceof Error?re.message:String(re)}`}}}function Xa(j){let K=Go(j.environment),te=Cr(Nr,K);if(te)return te;let re=Kn(Et()).map((we)=>af(Ya(K,we.name),we)),oe=re.flatMap((we)=>("error"in we)?[we.error]:[]);if(oe.length>0)return{platform:Nr,status:"n/a",configPath:K,errors:oe};let ce=re.some((we)=>("content"in we)&&Za(we.content)!==Et()),de=ce?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!zo(j.environment))return{platform:Nr,status:"disabled",method:"plugin directory",configPath:K,errors:[`${Ft} is not enabled in Hermes; run \`hermes plugins enable ${Ft}\``,...de]};return{platform:Nr,status:"configured",method:"plugin directory",configPath:K,errors:ce?de:void 0}}import{existsSync as lf,readFileSync as cf}from"node:fs";import{join as Qa}from"node:path";var df=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;function uf(j){return Qa(j.env.get("KIMI_CODE_HOME")||Qa(j.home,".kimi-code"),"config.toml")}function Yn(j){let K=uf(j.environment);if(!lf(K))return{platform:"kimi-code",status:"n/a",configPath:K};try{if(!df.test(cf(K,"utf-8")))return{platform:"kimi-code",status:"n/a",configPath:K}}catch(te){return{platform:"kimi-code",status:"n/a",configPath:K,errors:[`Failed to read ${K}: ${te instanceof Error?te.message:String(te)}`]}}return{platform:"kimi-code",status:"configured",method:"hook config",configPath:K}}import{readFileSync as cl}from"node:fs";import{join as Xn}from"node:path";var Rt="cc-safety-net",Mt="index.js",Rn="openclaw.plugin.json",Pn="package.json";var Mr="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as mf,lstatSync as gf,readdirSync as yf,readFileSync as hf}from"node:fs";import{dirname as nl,join as nn}from"node:path";import{fileURLToPath as vf}from"node:url";import{spawn as pf}from"node:child_process";function ff(j){return j.join(" ")}function Jo(j,K,te){return[`Failed to run ${ff(j)}${K===null?"":` (exit ${K})`}.`,te.trim()].filter(Boolean).join(`
`)}function Wo(j){let K={stdout:"",stderr:""};return j.stdout.setEncoding("utf-8"),j.stderr.setEncoding("utf-8"),j.stdout.on("data",(te)=>{K.stdout+=te}),j.stderr.on("data",(te)=>{K.stderr+=te}),K}function Jt(j,K){return new Promise((te,re)=>{let oe=cn([...j],process.env),ce=pf(oe.cmd,oe.args,{stdio:["ignore","pipe","pipe"]}),de=Wo(ce),we=()=>[de.stdout,de.stderr].filter(Boolean).join(`
`),xe=K?.timeoutMs??120000,Ce=setTimeout(()=>{ce.kill(),re(Error(Jo(j,null,`Timed out after ${xe}ms.
${we()}`.trim())))},xe);ce.on("error",(Se)=>{clearTimeout(Ce),re(Error(Jo(j,null,`${Se.message}
${we()}`.trim())))}),ce.on("close",(Se)=>{if(clearTimeout(Ce),Se!==0){re(Error(Jo(j,Se,we())));return}te(K?.stdoutOnly?de.stdout:we())})})}async function Ko(j){for(let K of j)await Jt(K)}async function el(j){for(let K of j)try{await Jt(K)}catch(te){console.warn(te instanceof Error?te.message:String(te))}}var tl=nn("openclaw",Rt),bf=[Mt,Rn,Pn];function Yo(j,K){if(j==="~")return K;if(j.startsWith("~/")||j.startsWith("~\\"))return nn(K,j.slice(2));return j}function rl(j){let K=j.env.get("OPENCLAW_STATE_DIR")?.trim();if(K)return Yo(K,j.home);let te=j.env.get("OPENCLAW_CONFIG_PATH")?.trim();return te?nl(Yo(te,j.home)):nn(j.home,".openclaw")}function ol(j){let K=j.env.get("OPENCLAW_CONFIG_PATH")?.trim();return K?Yo(K,j.home):nn(rl(j),"openclaw.json")}function Zo(j){return nn(rl(j),"extensions",Rt)}function Lf(j){let K=yf(j);if(K.length===0)return!0;if(K.some((oe)=>!bf.includes(oe)))return!1;let te=nn(j,Mt),re=Pt(te);return re!==void 0&&!re.isSymbolicLink()&&re.isFile()&&hf(te,"utf-8").startsWith(Mr)}function Xo(j){let K=Zo(j),te=Pt(K);if(!te)return;if(!te.isSymbolicLink()&&te.isDirectory()&&Lf(K))return;throw Error(`Refusing to modify ${K}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function il(){let j=nl(vf(import.meta.url));return[nn(j,"..",tl),nn(j,"..","..","..","dist",tl)]}function Qo(j=il()){return j.find((K)=>mf(K)&&gf(K).isDirectory())}function wf(j=il()){let K=Qo(j);if(!K)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return K}function sl(j=wf()){return[["openclaw","plugins","install",j,"--force"],["openclaw","plugins","enable",Rt]]}function kf(j){let K=(()=>{try{return JSON.parse(j)}catch{return}})(),te=wt(wt(K,"plugin"),"status");return typeof te==="string"?te:void 0}async function al(){let j=kf(await Jt(["openclaw","plugins","inspect",Rt,"--runtime","--json"],{stdoutOnly:!0}));if(j==="loaded")return;throw Error(`${j===void 0?`The ${Rt} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:`OpenClaw reports the ${Rt} plugin with status "${j}".`} Run \`openclaw plugins inspect ${Rt} --runtime\` for details.`)}var Hr="openclaw",Zn=`run \`openclaw plugins enable ${Rt}\``;function En(j,K){let te=Xn(j,K),re=Pt(te);if(!re)return{error:`${K} is missing from ${te}; run install --openclaw`};if(re.isSymbolicLink()||!re.isFile())return{error:`${te} is a symlink or not a regular file; move or remove it`};try{return{content:cl(te,"utf-8")}}catch(oe){return{error:`Failed to read ${te}: ${oe instanceof Error?oe.message:String(oe)}`}}}function dl(j){try{return JSON.parse(jt(j))}catch{return}}function xf(j){let K=En(j,Rn);if("error"in K)return K.error;if(wt(dl(K.content),"id")===Rt)return;return`${Xn(j,Rn)} is not a valid ${Rt} manifest; run install --openclaw`}function Cf(j){let K=En(j,Pn);if("error"in K)return K.error;let te=wt(wt(dl(K.content),"openclaw"),"extensions");if(Array.isArray(te)&&te.includes(`./${Mt}`))return;return`${Xn(j,Pn)} does not point OpenClaw at ${Mt}; run install --openclaw`}function ll(j){return Array.isArray(j)?j.filter((K)=>typeof K==="string"):[]}function Sf(j){let K=ol(j);if(!Pt(K))return`${Rt} is not enabled; ${Zn}`;let te=(()=>{try{return JSON.parse(jt(cl(K,"utf-8")))}catch{return}})();if(te===void 0)return`Failed to read ${K}; fix it, then ${Zn}`;let re=wt(te,"plugins");if(wt(re,"enabled")===!1)return`plugins.enabled is false in ${K}; no OpenClaw plugin loads`;let oe=wt(wt(wt(re,"entries"),Rt),"enabled");if(ll(wt(re,"deny")).includes(Rt)||oe===!1)return`${Rt} is disabled in ${K}; ${Zn}`;let ce=ll(wt(re,"allow"));if(ce.length>0&&!ce.includes(Rt))return`plugins.allow in ${K} does not list ${Rt}; add it, then ${Zn}`;if(ce.includes(Rt)||oe===!0)return;return`${Rt} is not enabled; ${Zn}`}function ul(j){return/^\/\/ version:\s*(.+)$/m.exec(j)?.[1]?.trim()}function Rf(j,K,te){if(te===void 0)return[];let re=En(te,Mt);if("error"in re||ul(re.content)!==K)return[];return[Mt,Rn,Pn].flatMap((oe)=>{let ce=En(j,oe),de=En(te,oe);if("error"in ce||"error"in de||ce.content===de.content)return[];return[`Modified ${oe} occupies ${Xn(j,oe)}; run install --openclaw to restore it`]})}function pl(j){let K=Zo(j.environment),te=Cr(Hr,K);if(te)return te;let re=En(K,Mt),ce=["error"in re?re.error:re.content.startsWith(Mr)?void 0:`Unmanaged ${Mt} occupies ${Xn(K,Mt)}; move or remove it`,xf(K),Cf(K)].filter((Se)=>Se!==void 0),de="content"in re?ul(re.content):void 0,we=ce.length>0?ce:Rf(K,de,Qo());if(we.length>0)return{platform:Hr,status:"n/a",configPath:K,errors:we};let xe=de===Et()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],Ce=Sf(j.environment);if(Ce)return{platform:Hr,status:"disabled",method:"plugin directory",configPath:K,errors:[Ce,...xe]};return{platform:Hr,status:"configured",method:"plugin directory",configPath:K,errors:xe.length>0?xe:void 0}}import{existsSync as If,readFileSync as $f}from"node:fs";import{join as Of}from"node:path";import{existsSync as ei,readFileSync as gl,rmSync as Pf}from"node:fs";import{join as Yt}from"node:path";import{pathToFileURL as Ef}from"node:url";var Ur="cc-safety-net",yl=`${Ur}@latest`,hl=["opencode.json","opencode.jsonc"],fl="CCSafetyNetPlugin",ml={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function Gr(j){return Yt(j.env.get("XDG_CONFIG_HOME")||Yt(j.home,".config"),"opencode")}function Df(j){return Yt(Gr(j),hl[0])}function Af(j){return hl.map((K)=>Yt(Gr(j),K))}function vl(j){return Yt(j.env.get("XDG_CACHE_HOME")||Yt(j.home,".cache"),"opencode","packages",yl)}function ti(j){Pf(vl(j),{recursive:!0,force:!0})}async function bl(j){let K=Yt(vl(j),"node_modules",Ur),te=Yt(K,"package.json");if(!ei(te))throw Error(`The OpenCode plugin cache at ${K} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${yl}\` for details.`);let re=wt(JSON.parse(gl(te,"utf-8")),"main");if(typeof re!=="string")throw Error(`The cached OpenCode plugin at ${K} declares no "main" entry.`);let oe=Yt(K,re);if(typeof(await import(Ef(oe).href))[fl]==="function")return;throw Error(`The cached OpenCode plugin at ${oe} does not export a callable ${fl}, so OpenCode would load nothing and fail open.`)}function Ll(j,K){try{return JSON.parse(jt(j))}catch(te){if(te instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${K}: ${te.message}`);throw te}}function _f(j){if(!j||typeof j!=="object"||Array.isArray(j))return!1;let K=j.plugin;if(!Array.isArray(K))return!1;return K.some((te)=>typeof te==="string"&&te.includes(Ur))}function Tf(j,K){let te=da(j,"plugin",ml);if(!te)throw Error(`Failed to locate OpenCode plugin array in ${K}`);let re=ua(j,te,ml.stringError).filter((oe)=>oe.value.includes(Ur)).map((oe)=>oe.range).reverse().reduce(Pr,j);return Ll(re,K),re}function wl(j){ti(j);let K=Af(j),te=K.find((oe)=>ei(oe)),re=[];for(let oe of K){if(!ei(oe))continue;try{let ce=gl(oe,"utf-8");if(!_f(Ll(ce,oe)))continue;return Dt(oe,Tf(ce,oe)),{path:oe,alreadyInstalled:!0}}catch(ce){re.push(ce instanceof Error?ce.message:String(ce))}}if(re.length>0)throw Error(re.join(`
`));return{path:te??Df(j),alreadyInstalled:!1}}function kl(j){let K=[],te=Gr(j.environment),re=["opencode.json","opencode.jsonc"];for(let oe of re){let ce=Of(te,oe);if(If(ce))try{let de=$f(ce,"utf-8"),we=jt(de);if((JSON.parse(we).plugin??[]).some((Ne)=>Ne.includes("cc-safety-net")))return{platform:"opencode",status:"configured",method:"plugin array",configPath:ce,errors:K.length>0?K:void 0}}catch(de){K.push(`Failed to parse ${oe}: ${de instanceof Error?de.message:String(de)}`)}}return{platform:"opencode",status:"n/a",errors:K.length>0?K:void 0}}import{join as jf}from"node:path";function ni(j){return jf(j.home,".pi","agent","settings.json")}function ri(j){if(typeof j!=="string")return!1;return j==="npm:cc-safety-net"||j.startsWith("npm:cc-safety-net@")}function xl(j){let K=ni(j.environment),te=qt(K);if(te.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(te.kind==="missing")return{platform:"pi",status:"n/a"};let re=wt(te.value,"packages");if(!Array.isArray(re))return{platform:"pi",status:"n/a"};let oe=re.find((we)=>ri(typeof we==="string"?we:wt(we,"source")));if(oe===void 0)return{platform:"pi",status:"n/a"};let ce=wt(oe,"extensions");if(Array.isArray(ce)&&ce.some((we)=>typeof we==="string"&&we.startsWith("-")))return{platform:"pi",status:"disabled",method:"package config",configPath:K,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:K}}var Ff={amp:ta,"antigravity-cli":na,"claude-code":sa,codex:aa,"copilot-cli":ka,cursor:Aa,"gemini-cli":_a,"grok-build":Ua,"hermes-agent":Xa,"kimi-code":Yn,openclaw:pl,opencode:kl,pi:xl};function Dn(j,K,te){let re={...te,cwd:K,environment:j};return ur.map((oe)=>Nf(Ff[oe](re)))}function Nf(j){if(j.status==="not-inspected")return{platform:j.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:j.platform,detected:j.status!=="n/a",configured:j.status==="configured",inspectionStatus:j.status!=="n/a"?"verified":j.errors&&j.errors.length>0?"failed":"not-applicable",method:j.method,configPath:j.configPath,configPaths:j.configPaths,errors:j.errors}}import{join as Mf}from"node:path";var Hf=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),Uf=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),safety:Object.freeze({}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),Gf={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function Cl(j){let K=Mf(j.tmpdir,"cc-safety-net-self-test"),te=Hf.map((re)=>{let oe=F(j,u("self-test",{command:re.command},{kind:"command",shell:"auto"},{configCwd:K,executionCwd:K},re.command),{guard:{dependencies:{loadPolicySnapshot:()=>Uf,getModes:()=>Gf,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),ce=re.expectBlocked?"blocked":"allowed",de=oe.decision.kind==="deny"?"blocked":"allowed";return{command:re.command,description:re.description,expected:ce,actual:de,passed:ce===de,reason:oe.decision.kind==="deny"?oe.decision.reason:void 0,ruleId:oe.decision.kind==="deny"?oe.decision.ruleId:void 0}});return{passed:te.filter((re)=>re.passed).length,failed:te.filter((re)=>!re.passed).length,total:te.length,results:te}}function oi(j){let K=At({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},j);if(Kt(K.errors))return null;return{json:K.flags.json,skipUpdateCheck:K.flags.skipUpdateCheck}}async function Sl(j,K={}){let te=await Bn(!K.json,()=>{let re=Bf(j,K);return{ready:re,finish:()=>re}},()=>Gn(),{loadingMessage:"Checking system status…"});if(K.json)console.log(JSON.stringify(te,null,2));else qf(te);return te.engineSelfTest.failed>0||te.findings.some((re)=>re.severity==="error")?1:0}async function Bf(j,K){let te=K.cwd??process.cwd(),re=await Hn(),oe=Dn(j,te,{ampPluginListOutput:re.ampPluginListOutput,codexPluginListOutput:re.codexPluginListOutput,copilotCliVersion:re.versions["copilot-cli"]}),ce=hs(j,te),de=vs(j),we=k(j,{cwd:te}),xe=we.policy,Ce=P(xe,j.env),Se=B(xe,Ce.capabilities),Ne=gr(j,7),He=Ys(j,te),at=K.skipUpdateCheck?{currentVersion:Et(),latestVersion:null,updateAvailable:!1}:await tn(),mt={hooks:oe,engineSelfTest:Cl(j),userConfig:ce.userConfig,projectConfig:ce.projectConfig,configState:Be(we),effectiveRules:ce.effectiveRules,shadowedRules:ce.shadowedRules,environment:de,effectiveSafety:{selectedPreset:xe.safety.level??"standard",level:Ce.effectiveLevel,capabilities:Ce.capabilities,ruleOverrides:xe.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(Se).filter(([,it])=>it.source==="rule_override"&&it.override==="off"&&it.inheritedEnabled&&it.changesInherited).map(([it])=>it),ruleCounts:{stored:Object.keys(xe.destructiveCommandRuleOverrides).length,effective:Object.values(Se).filter((it)=>it.changesInherited).length},...we.policyScopes?{policyScopes:we.policyScopes}:{}},...He.length>0?{v2Leftovers:He}:{},posture:Ts(j,ce.userConfig.path),activity:Ne,update:at,system:re};return{...mt,findings:Ls(mt)}}function qf(j){console.log(),console.log(ks(j.hooks)),console.log(),console.log(xs(j.engineSelfTest)),console.log(),console.log(Cs(j)),console.log(),console.log(Ss(j.environment)),console.log(),console.log(Rs(j)),console.log(),console.log(Ps(j.findings)),console.log(),console.log(Es(j.activity)),console.log(),console.log(As(j.system)),console.log(),console.log(Ds(j.update)),console.log(_s(j))}import{existsSync as Vf}from"node:fs";var zf=/^[A-Za-z0-9_@%+=:,./-]+$/,Rl="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function ii(j){let K=At({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},j);if(Kt(K.errors))return console.error(Rl),console.error("Pass -- before a command that starts with dashes."),null;if(K.values.cwd!==void 0&&!Vf(K.values.cwd))return console.error(`Error: --cwd path does not exist: ${K.values.cwd}`),null;let te=K.positionals.length===1?K.positionals[0]:K.positionals.map((re)=>zf.test(re)?re:`'${re.replaceAll("'","'\\''")}'`).join(" ");if(!te)return console.error("Error: No command provided"),console.error(Rl),null;return{json:K.flags.json,cwd:K.values.cwd,command:te}}function Pl(j){if(j)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function El(j,K){let re=K-18;return[`${j.dtl}${j.dh.repeat(K)}${j.dtr}`,`${j.dv}  Command Analysis${" ".repeat(re)}${j.dv}`,`${j.dbl}${j.dh.repeat(K)}${j.dbr}`]}function si(j){return JSON.stringify(j)}function Dl(j,K=0){return`[${j.map((re,oe)=>ws(re,oe,K)).join(",")}]`}function Qn(j,K,te=70){let re=j.split(" "),oe=[],ce="";for(let de of re)if(ce&&ce.length+de.length+1>te)oe.push(ce),ce=de;else ce=ce?`${ce} ${de}`:de;if(ce)oe.push(ce);return oe.map((de,we)=>we===0?de:`${K}${de}`)}function Al(j,K,te){let re=[];switch(j.type){case"parse":return null;case"env-strip":return re.push(""),re.push(`STEP ${K} ${te.h} Strip environment variables`),re.push(`  Removed: ${j.envVars.map((oe)=>`${oe}=<redacted>`).join(", ")}`),re.push(`  Tokens:  ${si(j.output)}`),{lines:re,incrementStep:!0};case"leading-tokens-stripped":return re.push(""),re.push(`STEP ${K} ${te.h} Strip wrappers`),re.push(`  Removed: ${j.removed.join(", ")}`),re.push(`  Tokens:  ${si(j.output)}`),{lines:re,incrementStep:!0};case"shell-wrapper":return re.push(""),re.push(`STEP ${K} ${te.h} Detect shell wrapper`),re.push(`  Wrapper: ${j.wrapper} -c`),re.push(`  Inner:   ${j.innerCommand}`),{lines:re,incrementStep:!0};case"interpreter":{if(re.push(""),re.push(`STEP ${K} ${te.h} Detect interpreter`),re.push(`  Interpreter: ${j.interpreter}`),re.push(`  Code:        ${j.codeArg}`),j.paranoidBlocked)re.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:re,incrementStep:!0}}case"busybox":return re.push(""),re.push(`STEP ${K} ${te.h} Busybox wrapper`),re.push(`  Subcommand: ${j.subcommand}`),{lines:re,incrementStep:!0};case"transparent-wrapper":return re.push(""),re.push(`STEP ${K} ${te.h} Transparent wrapper`),re.push(`  Wrapper: ${j.wrapper}`),re.push(`  Tokens:  ${si(j.output)}`),{lines:re,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(re.push(""),re.push(`STEP ${K} ${te.h} Match rules`),re.push(`  Rule:   ${j.rule}()`),j.matched)re.push("  Result: MATCHED");else re.push("  Result: No match");return{lines:re,incrementStep:!0}}case"worktree-relaxation":return re.push(""),re.push(`STEP ${K} ${te.h} Worktree relaxation`),re.push(`  Mode:   ${i.worktree.name}`),re.push(`  Git cwd: ${j.gitCwd}`),re.push("  Result: Allowed local discard in linked worktree"),{lines:re,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(j.embeddedCommandFound)return re.push(""),re.push(`STEP ${K} ${te.h} Fallback scan`),re.push(`  Found: ${j.embeddedCommandFound}`),{lines:re,incrementStep:!0};return null}case"custom-rules-check":{if(j.rulesChecked){if(re.push(""),re.push(`STEP ${K} ${te.h} Custom rules`),j.matched)re.push("  Result: MATCHED");else re.push("  Result: No match");return{lines:re,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(j.matched)return re.push(""),re.push(`STEP ${K} ${te.h} Dangerous text check`),re.push(`  Token:  ${j.token}`),re.push("  Result: MATCHED"),{lines:re,incrementStep:!0};return null}case"strict-unparseable":return re.push(""),re.push(`STEP ${K} ${te.h} Strict mode check`),re.push(`  Command: ${j.rawCommand}`),re.push("  Result:  ✗ UNPARSEABLE"),{lines:re,incrementStep:!0};case"segment-skipped":return null;case"error":return re.push(""),re.push(`ERROR: ${j.message}`),{lines:re,incrementStep:!1};default:return j}}function ai(j,K){let te=Pl(K?.asciiOnly??!1),re=58,oe=[],ce=1;oe.push(...El(te,58)),oe.push("");let de=j.trace.steps.find((mt)=>mt.type==="error");if(de&&de.type==="error"){oe.push("ERROR"),oe.push(`  ${de.message}`),oe.push(""),oe.push("RESULT"),oe.push(`  Status: ${j.result==="blocked"?bt.red("BLOCKED"):bt.green("ALLOWED")}`),oe.push(""),oe.push("CONFIG");let mt=j.configSource??"none";return oe.push(`  Path: ${mt}`),oe.join(`
`)}let we=j.trace.steps.find((mt)=>mt.type==="parse");if(we&&we.type==="parse"){oe.push("INPUT"),oe.push(`  ${we.input}`),oe.push(""),oe.push(`STEP ${ce} ${te.h} Split shell commands`),ce++;for(let mt=0;mt<we.segments.length;mt++){let it=we.segments[mt];if(it){let gt=Math.random();oe.push(`  Segment ${mt+1}: ${Dl(it,gt)}`)}}}let xe=j.trace.segments,Ce=xe.length>1;for(let mt of xe){if(Ce){oe.push("");let vt="";if(we&&we.type==="parse"){let mo=we.segments[mt.index];if(mo)vt=mo.join(" ")}let yt=54,kt=vt,Lt=` Segment ${mt.index+1}: `,Ct=" ";if(vt){if(Lt.length+vt.length+Ct.length>yt){let iu=yt-Lt.length-Ct.length;kt=`${vt.substring(0,iu-1)}…`}}let sn=vt?`${Lt}${kt}${Ct}`:` Segment ${mt.index+1} `,Gt=vt?`${Lt}${bt.cyan(kt)}${Ct}`:sn,zi=58-sn.length,Ji=Math.floor(zi/2),ou=zi-Ji;oe.push(`${te.sh.repeat(Ji)}${Gt}${te.sh.repeat(ou)}`)}if(mt.steps.find((vt)=>vt.type==="segment-skipped")){oe.push(""),oe.push("  (skipped — prior segment blocked)");continue}let gt=!1,ht=!1;for(let vt of mt.steps){let yt=Al(vt,ce,te);if(yt){if(ht=!0,vt.type==="recurse"){oe.push("");let kt=" RECURSING ",Lt=58-kt.length-4;oe.push(`  ${te.tl}${te.h}${kt}${te.h.repeat(Lt)}`),oe.push(`  ${te.v}`),gt=!0;continue}for(let kt of yt.lines)if(gt)oe.push(`  ${te.v} ${kt}`);else oe.push(kt);if(yt.incrementStep)ce++}}if(gt)oe.push(`  ${te.v}`),oe.push(`  ${te.bl}${te.h.repeat(56)}`),gt=!1;if(!ht)oe.push(""),oe.push(`  ${bt.green("✓")} Allowed (no matching rules)`)}if(oe.push(""),oe.push("RESULT"),j.result==="blocked"){if(oe.push(`  Status: ${bt.red("BLOCKED")}`),j.customRule){if(oe.push(`  Rule: ${j.customRule.id}`),j.customRule.rulebook)oe.push(`  Rulebook: ${j.customRule.rulebook.name} ${j.customRule.rulebook.version}`);if(j.customRule.source)oe.push(`  Source: ${j.customRule.source}`);if(j.customRule.override)oe.push(`  Override: reason ${j.customRule.override.reason}`)}if(j.reason){let mt=Qn(j.reason,"          ");oe.push(`  Reason: ${mt[0]}`);for(let it=1;it<mt.length;it++)oe.push(mt[it]??"")}}else oe.push(`  Status: ${bt.green("ALLOWED")}`);oe.push(""),oe.push("CONFIG");let Se=j.configSource??"none",Ne=j.configValid?"":" (invalid)";oe.push(`  Path: ${Se}${Ne}`);let He=j.safetyPresetScope;oe.push(`  Safety preset: ${j.selectedPreset??"standard"}${He?` (${hr(He)})`:""}`),oe.push(`  Effective capabilities: ${j.effectiveLevel}`);let at=Object.entries(j.destructiveCommandRuleOverrides??{});if(oe.push(`  Rule customizations: ${at.length}`),j.ruleActivation)oe.push(`  Rule activation: ${j.ruleActivation.id} — ${j.ruleActivation.enabled?"on":"off"} via ${j.ruleActivation.source}`);return oe.join(`
`)}function li(j){return JSON.stringify(j,null,2)}import{resolve as Xf}from"node:path";var Jf=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function _l(j){let K=0,te={allocateSegment(){return K++},getNextSegmentIndex(){return K},recordGlobal(re){j.record({kind:"step",scope:"global",step:re})},recordSegment(re,oe=te.currentSegmentIndex){if(oe===void 0)return;j.record({kind:"step",scope:"segment",segmentIndex:oe,step:re})}};return te}function Tl(j={}){let K=[],te=j.maxEvents??512,re={maxTextLength:j.maxTextLength??2048,maxListLength:j.maxListLength??128,maxObjectProperties:j.maxObjectProperties??j.maxListLength??128,maxDepth:j.maxDepth??16},oe=0,ce,de=new Set;return{record(we){if(ce)return;try{if(!we||K.length>=te){oe++;return}K.push(di(Wf(we,re,de)))}catch{oe++}},finish(we){if(ce)return ce;try{ce=di({events:Object.freeze(K),droppedEvents:oe,terminal:Kf(we,re,de)})}catch{oe++,ce=Object.freeze({events:Object.freeze(K),droppedEvents:oe,terminal:Object.freeze({result:"blocked",reason:"trace unavailable".slice(0,re.maxTextLength),segment:"trace unavailable".slice(0,re.maxTextLength)})})}return ce}}}function Wf(j,K,te){if(j.kind!=="step")throw TypeError("invalid trace event");let{scope:re,step:oe}=j;Br(oe,te,K);let ce=An(oe,K,te);if(re==="global")return{kind:"step",scope:"global",step:ce};if(re!=="segment")throw TypeError("invalid trace event scope");return{kind:"step",scope:"segment",segmentIndex:j.segmentIndex,step:ce}}function Kf(j,K,te){let re=j.result;if(re==="allowed")return Object.freeze({result:"allowed"});if(re!=="blocked")throw TypeError("invalid trace terminal");let oe=j.ruleId;return Object.freeze({result:"blocked",reason:An(j.reason,K,te),segment:An(j.segment,K,te),...oe?{ruleId:An(oe,K,te)}:{}})}function Br(j,K,te,re=0,oe=new WeakSet){if(typeof j==="string"){let we=j.slice(0,te.maxTextLength);if(!Je(we))return;for(let xe of ot(we))for(let Ce of xe.match(/[^\s"'()$]+/g)??[])K.add(Il(Ce));return}if(!j||typeof j!=="object"||re>=te.maxDepth||oe.has(j))return;if(oe.add(j),Array.isArray(j)){let we=Math.min(j.length,te.maxListLength);for(let xe=0;xe<we;xe++)Br(j[xe],K,te,re+1,oe);return}let ce=0,de=new Set;for(let we in j){if(!Object.hasOwn(j,we))continue;if(ce>=te.maxObjectProperties)break;ce++,Br(we,K,te);let xe=ci(we,te,K);if(de.has(xe))continue;de.add(xe),Br(j[we],K,te,re+1,oe)}}function An(j,K,te,re=0,oe=new WeakSet){if(typeof j==="string")return ci(j,K,te);if(!j||typeof j!=="object")return j;if(re>=K.maxDepth)return;if(oe.has(j))return;if(oe.add(j),Array.isArray(j)){let we=[],xe=Math.min(j.length,K.maxListLength);for(let Ce=0;Ce<xe;Ce++)we.push(An(j[Ce],K,te,re+1,oe));return we}let ce={},de=0;for(let we in j){if(!Object.hasOwn(j,we))continue;if(de>=K.maxObjectProperties)break;de++;let xe=ci(we,K,te);if(Object.hasOwn(ce,xe))continue;Object.defineProperty(ce,xe,{value:An(j[we],K,te,re+1,oe),enumerable:!0,configurable:!0,writable:!0})}return ce}function ci(j,K,te){let re=j.slice(0,K.maxTextLength),oe=Je(re)?Ye(re):re,ce=te.size>0?Zf(oe,te):oe;return(Yf(ce)?Oe(ce):ce).slice(0,K.maxTextLength)}function Yf(j){return j.includes("PRIVATE KEY")||j.includes("://")||j.includes("eyJ")||j.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(j)||j.length>=14&&Jf.some((K)=>j.includes(K))||j.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(j)}function Zf(j,K){return j.replace(/[^\s"'()$]+/g,(te)=>K.has(Il(te))?"<redacted>":te)}function Il(j){let K=2166136261,te=2166136261;for(let re=0;re<j.length;re++)K=Math.imul(K^j.charCodeAt(re),16777619),te=Math.imul(te^j.charCodeAt(j.length-re-1),16777619);return`${K>>>0}:${te>>>0}:${j.length}`}function di(j){if(j&&typeof j==="object"&&!Object.isFrozen(j)){for(let K of Object.values(j))di(K);Object.freeze(j)}return j}function er(j,K={},te){let re=Xf(K.cwd??process.cwd()),oe=K.policySnapshot??k(te,{cwd:re,userConfigDir:K.userConfigDir}),ce=P(oe.policy,te.env),de=K.strict,we=ze({policySnapshot:oe,effectiveCapabilities:ce.capabilities,strict:de??ce.strict,paranoidRm:ce.paranoidRm,paranoidInterpreters:ce.paranoidInterpreters,worktreeMode:ce.worktreeMode}),xe={effectiveLevel:we.effectiveLevel,selectedPreset:oe.policy.safety.level??"standard",...oe.policyScopes?{safetyPresetScope:oe.policyScopes.levelScope}:{},effectiveCapabilities:we.effectiveCapabilities,destructiveCommandRuleOverrides:oe.policy.destructiveCommandRuleOverrides},{configSource:Ce,configValid:Se}=em(te,{cwd:re,userConfigDir:K.userConfigDir});if(!j||!j.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:Ce,configValid:Se,...xe};let Ne=v(j,"auto");if(Ne.status==="limited")throw new b;let He=Ne.dialect==="powershell"?v(j,"posix"):Ne,at=ft(He),mt=Tl(),it=_l(mt);it.recordGlobal({type:"parse",input:j,segments:at.map((Gt)=>[...Gt])});let gt=u("Bash",{command:j},{kind:"command",shell:"auto"},{configCwd:re,executionCwd:re},j),ht=V(gt,{environment:te,trace:it,dependencies:{loadPolicySnapshot:()=>oe,...de===void 0?{}:{getModes:()=>({...ce,strict:de})}}}),vt=ht.decision.kind==="deny"?ht.decision:null;if(vt&&(ht.stage==="policy-protection"||ht.stage==="secret-protection")){let Gt=Qf(vt);return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:Gt.rule,matched:!0,reason:vt.reason}]}]},result:"blocked",reason:R(vt.reason),segment:R(ui(vt,j)),...Gt.ruleId?{ruleId:R(Gt.ruleId)}:{},configSource:Ce,configValid:Se,...xe}}let yt=it.getNextSegmentIndex();if(vt&&yt>0&&yt<at.length)it.recordSegment({type:"segment-skipped",index:yt,reason:"prior-segment-blocked"},yt);let kt=mt.finish(vt?{result:"blocked",reason:vt.reason,segment:ui(vt,j),...vt.ruleId?{ruleId:vt.ruleId}:{}}:{result:"allowed"}),Lt=vt?.ruleId??tm(gt,oe,ce,te),Ct=U.find((Gt)=>Gt.id===Lt&&Gt.activationCapability),sn=Ct?we.policy.effectiveDestructiveCommandRules[Ct.id]:void 0;return{trace:rm(kt),result:vt?"blocked":"allowed",reason:vt?R(vt.reason):void 0,segment:vt?R(ui(vt,j)):void 0,ruleId:vt?.ruleId?R(vt.ruleId):void 0,customRule:nm(om(vt?.ruleId,oe)),configSource:Ce,configValid:Se,...xe,...Ct&&sn?{ruleActivation:{id:Ct.id,...sn}}:{}}}function ui(j,K){return j.evidence.find((te)=>te.kind==="command")?.segment??K}function Qf(j){if(j.reason===qe)return{ruleId:"policy-protection",rule:"policy-protection:findPolicyConfigMutationTargetInSemanticFacts"};if(j.reason===Ve)return{ruleId:"policy-apply-protection",rule:"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts"};if(j.reason===C)return{ruleId:"git-metadata-protection",rule:"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts"};return{ruleId:j.ruleId,rule:"secret-protection:findSensitiveTargetInSemanticFacts"}}function em(j,K){let te=A(K.cwd),re=K.userConfigPath??T(j,K),oe=H(j,{cwd:K.cwd,userConfigDir:K.userConfigDir,userConfigPath:K.userConfigPath});try{if(r(oe.projectConfigTarget)!==null){if(en(oe.projectConfigTarget).errors.length===0)return{configSource:te,configValid:!0};return{configSource:te,configValid:!1}}}catch(ce){if(ce instanceof o)return{configSource:te,configValid:!1};throw ce}try{if(r(oe.userConfigTarget)!==null){let ce=en(oe.userConfigTarget);return{configSource:re,configValid:ce.errors.length===0}}return{configSource:null,configValid:!0}}catch(ce){if(ce instanceof o)return{configSource:re,configValid:!1};throw ce}}function tm(j,K,te,re){let oe=K.policy,ce=De({...oe,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...oe.destructiveCommandRuleOverrides,...Object.fromEntries(U.flatMap((we)=>we.activationCapability?[[we.id,"on"]]:[]))}},K.state==="degraded"?{diagnostics:K.diagnostics,reason:K.reason}:void 0),de=V(j,{environment:re,dependencies:{loadPolicySnapshot:()=>ce,getModes:()=>({...te,strict:!0,paranoidRm:!0,paranoidInterpreters:!0}),findSensitiveTarget:()=>null}});return de.decision.kind==="deny"?de.decision.ruleId:void 0}function nm(j){if(!j)return;return{id:R(j.id),...j.rulebook?{rulebook:{name:R(j.rulebook.name),version:R(j.rulebook.version)}}:{},...j.source?{source:R(j.source)}:{},...j.override?{override:{type:"reason",reason:R(j.override.reason)}}:{}}}function rm(j){let K=j.events.flatMap((re)=>re.kind==="step"&&re.scope==="global"?[re.step]:[]),te=new Map;for(let re of j.events){if(re.kind!=="step"||re.scope!=="segment")continue;let oe=te.get(re.segmentIndex)??{index:re.segmentIndex,steps:[]};oe.steps.push(re.step),te.set(re.segmentIndex,oe)}return{steps:K,segments:[...te.values()]}}function om(j,K){let te=j?.replace(/^custom\./,"");if(!te||!K.policy.rules.some((re)=>re.name===te))return;return K.ruleMetadata[te]??Object.freeze({id:te})}function $l(j){return new Promise((K)=>{process.stdout.write(`${j}
`,()=>K())})}async function Ol(j,K){let te=ii(K);if(!te)return 1;try{let re=er(te.command,{cwd:te.cwd},j),oe=!!process.env.NO_COLOR||!process.stdout.isTTY;return await $l(te.json?li(re):ai(re,{asciiOnly:oe})),0}catch(re){let oe=im(re instanceof p?re.cause:re);if(oe===void 0)throw re;if(te.json)return await $l(JSON.stringify({error:oe})),1;return console.error(oe),1}}function im(j){if(j instanceof b)return j.message;if(j instanceof f)return j.message;if(j instanceof a&&n[j.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var jl="2.3.4",Ht="  ",fn="cc-safety-net";function Fl(j){return j.argument?`${j.flags} ${j.argument}`:j.flags}function sm(j){return Math.max(...j.map((K)=>Fl(K).length))}function am(j){return Math.max(...j.map((K)=>K.usage.length))}function lm(j){return Math.max(...j.map((K)=>`${fn} ${K.usage}`.length))}function cm(j,K){let te=`${fn} ${j.usage}`;return`${Ht}${te.padEnd(K+2)}${j.description}`}function Zt(j,K){return`${Ht}${j.padEnd(Math.max(40,j.length+2))}${K}`}function _n(j,K=console.log){let te=[];if(te.push(`${fn} ${j.name}`),te.push(""),te.push(`${Ht}${j.description}`),te.push(""),te.push("USAGE:"),te.push(`${Ht}${fn} ${j.usage}`),te.push(""),j.subcommands&&j.subcommands.length>0){te.push("SUBCOMMANDS:");let re=am(j.subcommands);for(let oe of j.subcommands)te.push(`${Ht}${oe.usage.padEnd(re+2)}${oe.description}`);te.push("")}if(j.options.length>0){te.push("OPTIONS:");let re=sm(j.options);for(let oe of j.options){let ce=Fl(oe),de=oe.default?`${oe.description} (default: ${oe.default})`:oe.description;te.push(`${Ht}${ce.padEnd(re+2)}${de}`)}te.push("")}if(j.examples&&j.examples.length>0){te.push("EXAMPLES:");for(let re of j.examples)te.push(`${Ht}${re}`)}K(te.join(`
`))}function pi(){let j=lm(fr),K=[];K.push(`${fn} v${jl}`),K.push(""),K.push("Blocks destructive commands and secret access."),K.push(""),K.push("COMMANDS:");for(let te of fr)K.push(cm(te,j));K.push(""),K.push("GLOBAL OPTIONS:"),K.push(`${Ht}-h, --help       Show help (use with command for command-specific help)`),K.push(`${Ht}-V, --version    Show version`),K.push(""),K.push("HELP:"),K.push(`${Ht}${fn} help <command>     Show help for a specific command`),K.push(`${Ht}${fn} <command> --help   Show help for a specific command`),K.push(""),K.push("ENVIRONMENT VARIABLES:"),K.push(Zt(`${i.level.name}=standard|strict|paranoid`,"Set session safety level")),K.push(Zt(`${i.worktree.name}=1`,"Allow local git discards in linked worktrees")),K.push(Zt(`${i.debug.name}=1`,"Print diagnostic messages to stderr")),K.push(Zt(`${i.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),K.push(Zt("CC_SAFETY_NET_HOME","Override rule config home directory")),K.push(""),K.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),K.push(Zt(`${i.strict.name}=1`,"Force safety.overrides.fail_closed on")),K.push(Zt(`${i.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),K.push(Zt(`${i.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),K.push(Zt(`${i.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),K.push(""),K.push("Documentation:        https://ccsafetynet.com/docs"),console.log(K.join(`
`))}function Nl(){console.log(jl)}function tr(j,K=console.log){let te=mr(j);if(!te)return!1;if(te.name.toLowerCase()!==j.toLowerCase())return!1;return _n(te,K),!0}import{existsSync as Ci,readFileSync as Oc}from"node:fs";import{join as ki}from"node:path";import*as rn from"node:readline";function dm(j){return j==="install"?"Install":"Uninstall"}function um(j){return j==="install"?"Installing":"Uninstalling"}function pm(j){return j==="install"?"into":"from"}function Ul(j){return j?.available===!0}function fm(j,K){let te=new Set(K);return j.filter((re)=>te.has(re.target)).map((re)=>re.target)}function Ml(j,K,te){if(j.length===0||j.every((re)=>!re.available))return K;return Array.from({length:j.length},(re,oe)=>oe+1).map((re)=>(K+re*te+j.length)%j.length).find((re)=>Ul(j[re]))}function mm(j,K,te){if(te.ctrl&&te.name==="c")return"interrupt";if(te.name==="escape"||K==="q")return"abort";if(j==="install"&&(K==="u"||K==="U"))return"update";if(te.name==="up"||K==="k")return"up";if(te.name==="down"||K==="j")return"down";if(te.name==="space"||K===" ")return"toggle";if(te.name==="return"||te.name==="enter")return"confirm";return null}function gm(j){return{cursor:j.findIndex((K)=>K.available),selected:[]}}function ym(j,K,te){if(te==="confirm"||te==="update"||te==="abort"||te==="interrupt")return{state:j,done:te};if(te==="up")return{state:{...j,cursor:Ml(K,j.cursor,-1)}};if(te==="down")return{state:{...j,cursor:Ml(K,j.cursor,1)}};let re=K[j.cursor];if(!Ul(re))return{state:j};let oe=j.selected.includes(re.target)?j.selected.filter((ce)=>ce!==re.target):fm(K,[...j.selected,re.target]);return{state:{...j,selected:oe}}}var Gl="◉",Bl="◯",ql=">",Vl=" ";function hm(j,K,te,re={}){let oe=re.color!==!1,ce=oe?bt.dim:(xe)=>xe,de=oe?bt.green:(xe)=>xe,we=oe?bt.bold:(xe)=>xe;return["",`${dm(j)} CC Safety Net ${pm(j)}:`,"",...K.map((xe,Ce)=>{let Se=te.selected.includes(xe.target),Ne=Ce===te.cursor,He=Se?Gl:Bl,at=Ne?ql:Vl,mt=xe.available?"":` (${xe.unavailableReason??"not installed"})`,it=`${He} ${xe.label}${mt}`,gt=!xe.available?ce(it):Se?de(it):Ne?we(it):it;return`${at} ${gt}`}),"",j==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":K.some((xe)=>xe.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${j}. q/Esc: close`].join(`
`)}var Hl=["global-hook","plugin"];function vm(j,K,te={}){let re=te.color!==!1?bt.bold:(ce)=>ce;return["","Install the Kimi Code integration as:","",...[`Global hook — ${K?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((ce,de)=>{let we=de===j,xe=`${we?Gl:Bl} ${ce}`;return`${we?ql:Vl} ${we?re(xe):xe}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function zl(j){let{input:K,output:te}=j;rn.emitKeypressEvents(K);let re=K.isRaw===!0;K.setRawMode(!0),K.resume();let oe=0,ce=()=>{if(oe===0)return;rn.moveCursor(te,0,-oe),rn.cursorTo(te,0),rn.clearScreenDown(te)},de=()=>{ce();let we=j.render();te.write(`${we}
`),oe=we.split(`
`).length};return new Promise((we)=>{let xe=(Se)=>{K.off("keypress",Ce),K.setRawMode(re),K.pause(),ce(),we(Se)};function Ce(Se,Ne){j.onKey(Se,Ne,{finish:xe,draw:de})}K.on("keypress",Ce),de()})}function Jl(j={}){let K=0;return zl({input:j.input??process.stdin,output:j.output??process.stdout,render:()=>vm(K,j.globalHookInstalled===!0),onKey:(te,re,oe)=>{if(re.ctrl&&re.name==="c"){oe.finish(null),(j.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(re.name==="escape"||te==="q")return oe.finish(null);if(re.name==="return"||re.name==="enter")return oe.finish(Hl[K]);if(re.name==="up"||re.name==="down"||te==="k"||te==="j")K=(K+1)%Hl.length,oe.draw()}})}function fi(j=process.stdin,K=process.stdout){return Boolean(j.isTTY&&K.isTTY&&typeof j.setRawMode==="function")}function Wl(j,K,te={}){let re=te.output??process.stdout,oe=gm(K);return zl({input:te.input??process.stdin,output:re,render:()=>hm(j,K,oe),onKey:(ce,de,we)=>{let xe=mm(j,ce,de);if(!xe)return;let Ce=ym(oe,K,xe);if(oe=Ce.state,Ce.done==="interrupt"){we.finish(null),(te.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(Ce.done==="abort")return we.finish(null);if(Ce.done==="update")return we.finish("update");if(Ce.done==="confirm"){if(oe.selected.length===0){re.write("\x07"),we.draw();return}we.finish([...oe.selected]),re.write(`${um(j)} selected integrations...
`);return}we.draw()}})}import{existsSync as Yl,lstatSync as Lm,mkdirSync as wm,mkdtempSync as km,readdirSync as xm,readFileSync as In,rmSync as Vr}from"node:fs";import{basename as Cm,dirname as Sm,join as Ot}from"node:path";import{fileURLToPath as Rm}from"node:url";var mi="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",mn="cc-safety-net",gn="cc-safety-net/index.ts";import{spawn as bm}from"node:child_process";var gi=(j,K)=>{let te=cn([...j],process.env);return new Promise((re)=>{let oe=bm(te.cmd,te.args,{cwd:K,stdio:["ignore","pipe","pipe"]}),ce=Wo(oe),de=!1,we=setTimeout(()=>{de=!0,oe.kill()},120000);oe.on("error",(xe)=>{clearTimeout(we),re({status:null,errorCode:xe.code,stdout:ce.stdout,stderr:[xe.message,ce.stderr].filter(Boolean).join(`
`)})}),oe.on("close",(xe)=>{clearTimeout(we),re({status:de?null:xe,errorCode:de?"ETIMEDOUT":void 0,stdout:ce.stdout,stderr:ce.stderr})})})};var Tn="cc-safety-net.ts",Kl=Ot("amp",gn);function Pm(j){return Ot(j.home,".config","amp","plugins","cc-safety-net.ts")}function Em(){let j=Sm(Rm(import.meta.url));return[Ot(j,"..",Kl),Ot(j,"..","..","..","dist",Kl)]}function Dm(j=Em()){let K=j.find((te)=>Yl(te)&&Lm(te).isFile());if(!K)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return K}function Zl(j){try{return JSON.parse(j)}catch{return}}function zr(j){return j.subarray(0,Buffer.byteLength(mi)).toString("utf-8")===mi}async function nr(j,K,te){let re=await j(K,te);if(re.status===0)return re;throw Error([`Failed to run ${K.join(" ")}${re.status===null?"":` (exit ${re.status})`}.`,[re.stdout,re.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Xl(j){let K=await j(["amp","plugins","repositories","--json"]);if(K.status===null)throw Error(`${K.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${K.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${K.stderr}`.trim());if(K.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${K.status}). Sign in with "amp login" and rerun install --amp.
${[K.stdout,K.stderr].filter(Boolean).join(`
`)}`.trim());let te=Zl(K.stdout),re=(Array.isArray(te)?te:[]).filter((oe)=>wt(oe,"scope")==="user"&&wt(oe,"exists")===!0&&wt(oe,"viewerCanWrite")===!0).map((oe)=>wt(oe,"cloneRef")).find((oe)=>typeof oe==="string"&&oe.length>0);if(!re)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return re}async function Ql(j,K,te){let re=km(Ot(K.tmpdir,"cc-safety-net-amp-"));try{return await nr(j,["amp","clone","user-plugins",re]),await te(re)}finally{Vr(re,{recursive:!0,force:!0})}}function yi(j){return`rerun ${j==="overwrite"?"install":"uninstall"} --amp`}function ec(j,K,te){let re=Ot(j,K),oe=Pt(re);if(!oe)return;if(oe.isSymbolicLink()||!oe.isFile())throw Error(`Refusing to ${te} ${K} in your Amp personal plugins repository: not a regular file. Remove it there and ${yi(te)}.`);let ce=In(re);if(zr(ce))return ce;throw Error(`Refusing to ${te} unmanaged file ${K} in your Amp personal plugins repository. Remove it there and ${yi(te)}.`)}function tc(j,K){let te=Ot(j,mn),re=Pt(te);if(!re)return;if(re.isSymbolicLink()||!re.isDirectory())throw Error(`Refusing to ${K} ${mn} in your Amp personal plugins repository: not a regular directory. Remove it there and ${yi(K)}.`);return ec(j,gn,K)}function Am(j){let K=Ot(j,Tn),te=Pt(K);if(!te||te.isSymbolicLink()||!te.isFile())return;let re=In(K);return zr(re)?re:void 0}async function nc(j,K,te,re){if(await nr(j,te,K),(await nr(j,["git","status","--porcelain"],K)).stdout.trim()==="")return!1;return await nr(j,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",re],K),await nr(j,["git","push","origin","HEAD"],K),!0}function qr(j,K){_m(j,K),Tm(j,K)}function rc(j,K){if(K==="keep")return;throw Error(`Local Amp plugin ${j} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function _m(j,K){let te=Pm(j),re=Pt(te);if(!re)return;if(!re.isSymbolicLink()&&re.isFile()&&zr(In(te))){Vr(te);return}rc(te,K)}function Tm(j,K){let te=Ot(j.home,".config","amp","plugins",mn),re=Pt(te);if(!re)return;if(!re.isSymbolicLink()&&re.isDirectory()&&Im(te)){Vr(te,{recursive:!0});return}rc(te,K)}function Im(j){let K=Cm(gn);if(xm(j).join("\x00")!==K)return!1;let te=Ot(j,K),re=Pt(te);return!!re&&!re.isSymbolicLink()&&re.isFile()&&zr(In(te))}function $m(j){let K=d(j);if(!Yl(K))return"";let te=Zl(In(K,"utf-8"));if(!te||typeof te!=="object"||Array.isArray(te))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(h(te,j.home))};
`}async function oc(j,K=Dm(),te=gi){let re=Buffer.concat([In(K),Buffer.from($m(j),"utf-8")]),oe=await Xl(te);return Ql(te,j,async(ce)=>{let de=`${oe}/${mn}`,we=tc(ce,"overwrite"),xe=ec(ce,Tn,"overwrite");if(we?.equals(re)&&!xe)return qr(j,"fail"),{path:de,alreadyInstalled:!0};if(wm(Ot(ce,mn),{recursive:!0}),Dt(Ot(ce,gn),re),xe)Vr(Ot(ce,Tn));let Ce=await nc(te,ce,["git","add","--",gn,...xe?[Tn]:[]],`chore: update cc-safety-net plugin to v${Et()}`);return qr(j,"fail"),{path:de,alreadyInstalled:!Ce}})}async function ic(j,K=gi){let te=await Xl(K);return Ql(K,j,async(re)=>{let oe=tc(re,"remove"),ce=Am(re),de=`${te}/${ce&&!oe?Tn:mn}`;if(!oe&&!ce)return qr(j,"keep"),{path:de,alreadyInstalled:!1};return await nc(K,re,["git","rm","--",...oe?[gn]:[],...ce?[Tn]:[]],`chore: remove cc-safety-net plugin v${Et()}`),qr(j,"keep"),{path:de,alreadyInstalled:!0}})}import{existsSync as sc,mkdirSync as Om,readFileSync as jm}from"node:fs";import{dirname as Fm}from"node:path";var hi=zt["antigravity-cli"],yn="cc-safety-net";function hn(j){return Boolean(j)&&typeof j==="object"&&!Array.isArray(j)}function Wr(){return{PreToolUse:[{hooks:[{type:"command",command:hi,timeout:30}]}]}}function ac(j){try{let K=JSON.parse(jm(j,"utf-8"));if(!K||typeof K!=="object"||Array.isArray(K))throw Error("Antigravity hooks config must be a JSON object");return K}catch(K){if(K instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${j}: ${K.message}`);throw K}}function lc(j){let K=j[yn];if(K===void 0){let re=Wr();return j[yn]=re,{definition:re,preToolUse:re.PreToolUse??[]}}if(!hn(K))throw Error(`Antigravity hooks config entry "${yn}" must be an object`);let te=Array.isArray(K.PreToolUse)?K.PreToolUse:[];return K.PreToolUse=te,{definition:K,preToolUse:te}}function cc(j){if(!Array.isArray(j.PreToolUse))return!1;return j.PreToolUse.some((K)=>hn(K)&&Array.isArray(K.hooks)&&K.hooks.some((te)=>hn(te)&&te.command===hi))}function Nm(j){return Object.values(j).some((K)=>hn(K)&&K.enabled!==!1&&cc(K))}function Mm(j){if(j[yn]===void 0)return!1;let K=lc(j);if(K.definition.enabled!==!1||!cc(K.definition))return!1;return K.definition.enabled=!0,!0}function Hm(j){if(j[yn]===void 0){j[yn]=Wr();return}let K=lc(j);K.definition.enabled=!0,K.preToolUse.push(Wr().PreToolUse?.[0]??{hooks:[]})}function Um(j){let K=!1;for(let te of Object.values(j)){if(!hn(te)||!Array.isArray(te.PreToolUse))continue;te.PreToolUse=te.PreToolUse.flatMap((re)=>{if(!hn(re)||!Array.isArray(re.hooks))return[re];let oe=re.hooks.filter((ce)=>!hn(ce)||ce.command!==hi);if(oe.length!==re.hooks.length)K=!0;return oe.length===0?[]:[{...re,hooks:oe}]})}return K}function Jr(j,K){Dt(j,`${JSON.stringify(K,null,2)}
`)}function dc(j){let K=qn(j.home);if(Om(Fm(K),{recursive:!0}),!sc(K))return Jr(K,{[yn]:Wr()}),{path:K,alreadyInstalled:!1};let te=ac(K);if(Nm(te))return{path:K,alreadyInstalled:!0};if(Mm(te))return Jr(K,te),{path:K,alreadyInstalled:!1};return Hm(te),Jr(K,te),{path:K,alreadyInstalled:!1}}function uc(j){let K=qn(j.home);if(!sc(K))return{path:K,alreadyInstalled:!1};let te=ac(K);if(!Um(te))return{path:K,alreadyInstalled:!1};return Jr(K,te),{path:K,alreadyInstalled:!0}}import{existsSync as Gm,readdirSync as Bm,rmSync as qm}from"node:fs";import{join as Vm}from"node:path";function pc(j,K=process.platform,te){if(!Gm(j))return;let re=K==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);Bm(j).filter((oe)=>oe!==te&&re.test(oe)).forEach((oe)=>{qm(Vm(j,oe),{recursive:!0,force:!0})})}import{spawn as zm}from"node:child_process";var Wt=Nt.map((j)=>({target:j.id,flag:j.flag,label:St(j.id),probeCommand:j.probeCommand}));function vi(j){let K=new Set(j);return Wt.map((te)=>te.target).filter((te)=>K.has(te))}async function fc(j,K){for(let te of j)await K(te)}var Jm=5000;function bi(j,K=Jm){return new Promise((te)=>{let re=cn([...j],process.env),oe=zm(re.cmd,re.args,{env:process.env,stdio:"ignore"}),ce=!1,de=(xe)=>{if(ce)return;ce=!0,clearTimeout(we),te(xe)},we=setTimeout(()=>{oe.kill(),de(!1)},K);oe.on("error",()=>de(!1)),oe.on("close",(xe)=>de(xe===0))})}function mc(j=bi,K={}){let te=new Set(K.configuredTargets??[]);return Promise.all(Wt.map(async(re)=>({target:re.target,flag:re.flag,label:re.label,...yc(K.action,await j(re.probeCommand),te.has(re.target))})))}function gc(j,K){let te=new Set(K.configuredTargets??[]);return j.map((re)=>({...re,...yc(K.action,re.available,te.has(re.target))}))}function yc(j,K,te){if(j==="uninstall")return te?{available:!0}:{available:!1,unavailableReason:"not installed"};if(j==="install"&&te)return{available:!1,unavailableReason:"already installed"};if(!K)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}import{existsSync as hc,readdirSync as Wm,rmSync as Km}from"node:fs";import{join as $n}from"node:path";function Kr(j,K=process.platform){let te=$n(j.env.get("npm_config_cache")||(K==="win32"?$n(j.env.get("LOCALAPPDATA")||$n(j.home,"AppData","Local"),"npm-cache"):$n(j.home,".npm")),"_npx");if(!hc(te))return;Wm(te).filter((re)=>hc($n(te,re,"node_modules","cc-safety-net"))).forEach((re)=>{Km($n(te,re),{recursive:!0,force:!0})})}import{existsSync as xc,mkdirSync as Zm,readFileSync as Cc}from"node:fs";import{dirname as Xm,join as kc}from"node:path";function Ym(j,K){if(j[K]!=="#")return K;let te=j.indexOf(`
`,K+1);return te===-1?j.length:te+1}function Li(j,K,te){let re=new RegExp(`^(\\s*)${K}\\s*=\\s*\\[`),oe=0;for(let ce of j.split(`
`)){if(/^\s*\[/.test(ce))return;let de=re.exec(ce);if(de){let we=oe+de[0].lastIndexOf("[");return{start:we,end:_o(j,we,{skipComment:Ym,...te})}}oe+=ce.length+1}return}function vc(j,K,te){let re=j.slice(0,K.end).trimEnd(),oe=ca(j,K.end),ce=oe===""?"     ":`${oe}  `,de=!re.endsWith("[")&&!re.endsWith(",");return`${re}${de?",":""}
${ce}${te}${j.slice(K.end)}`}function bc(j,K,te){let re=j.indexOf(te,K.start);if(re===-1||re>K.end)return j;return Pr(j,{start:re,end:re+te.length})}function Lc(j,K){let te=new RegExp(`^\\s*${K}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),re=j.split(`
`),oe=re.findIndex((we)=>/^\s*\[/.test(we)),ce=oe===-1?re:re.slice(0,oe),de=oe===-1?[]:re.slice(oe);return[...ce.filter((we)=>!te.test(we)),...de].join(`
`)}function wc(j,K,te){let re=new RegExp(`^\\s*\\[\\[${K}]]\\s*$`,"m");return j.split(/(?=^\s*\[)/m).filter((oe)=>!re.test(oe)||!oe.includes(te)).join("").trimEnd()}var rr=zt["kimi-code"],wi=`[[hooks]]
event = "PreToolUse"
command = "${rr}"`,Sc=`{ event = "PreToolUse", command = "${rr}" }`,Rc={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function Pc(j){return kc(j.env.get("KIMI_CODE_HOME")??kc(j.home,".kimi-code"),"config.toml")}function Qm(j){let K=Li(j,"hooks",Rc);if(K&&j.slice(K.start+1,K.end).trim())return vc(j,K,Sc);let te=Lc(j,"hooks").trimEnd();if(te==="")return`${wi}
`;return`${te}

${wi}
`}function Ec(j){let K=Pc(j);if(Zm(Xm(K),{recursive:!0}),!xc(K))return Dt(K,`${wi}
`),{path:K,alreadyInstalled:!1};let te=Cc(K,"utf-8");if(te.includes(rr))return{path:K,alreadyInstalled:!0};return Dt(K,Qm(te)),{path:K,alreadyInstalled:!1}}function Dc(j){let K=Pc(j);if(!xc(K))return{path:K,alreadyInstalled:!1};let te=Cc(K,"utf-8");if(!te.includes(rr))return{path:K,alreadyInstalled:!1};let re=Li(te,"hooks",Rc),oe=re?bc(te,re,Sc):`${wc(te,"hooks",rr)}
`;return Dt(K,oe),{path:K,alreadyInstalled:!0}}var xi="safety-net@cc-marketplace",Ac=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),_c=new Set(["antigravity-cli","cursor","grok-build","hermes-agent","kimi-code"]);function Si(j){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(j??"")}function jc(j){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(j??"")}function eg(j){return/^Marketplace `cc-marketplace`\s*$/m.test(j??"")}var Fc={"claude-code":{installCommands:(j)=>{let K=Sr(j,"cc-safety-net@cc-marketplace");return{commands:[...K?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...Do(j).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:Sr(j,xi)?[["claude","plugin","uninstall",xi]]:[],update:K}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(j,K)=>{let te=K??await Jt(["codex","plugin","list"]),re=jc(te);return{commands:[re||eg(te)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:Si(te)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:re}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:"Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."},"copilot-cli":{installCommands:async()=>{let j=await Jt(["copilot","plugin","list"]),K=[...ha(j)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...va(j)?[["copilot","plugin","uninstall",ma]]:[]];if(ga(j))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",Vt]],cleanupCommands:K,update:!0};return{commands:[ya(await Jt(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",Vt]],cleanupCommands:K}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(j)=>{let K=No(j);if(K.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(K.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:Xo,installCommands:()=>({commands:sl()}),uninstallCommands:[["openclaw","plugins","uninstall",Rt,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{beforeInstall:ti,installCommands:[["opencode","plugin","-g","-f","cc-safety-net@latest"]]},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]}};function Nc(j,K=(te)=>te){try{let te=JSON.parse(K(Oc(j,"utf-8")));if(!te||typeof te!=="object"||Array.isArray(te))throw Error(`Settings file ${j} must be a JSON object`);return te}catch(te){if(te instanceof SyntaxError)throw Error(`Failed to parse ${j}: ${te.message}`);throw te}}function tg(j){let K=ki(Vn(j),"settings.json");if(!Ci(K))return;let te=Nc(K,jt),re=te.enabledPlugins;if(!re||typeof re!=="object"||Array.isArray(re))return;if(re[Vt]!==!1)return;let oe=Oc(K,"utf-8"),ce=oe.replace(new RegExp(`("${Vt}"\\s*:\\s*)false`),"$1true");return re[Vt]=!0,Dt(K,ce!==oe?ce:`${JSON.stringify(te,null,2)}
`),`Enabled ${Vt} plugin in ${K}`}function ng(j){let K=ni(j);if(!Ci(K))return;let te=Nc(K);if(!Array.isArray(te.packages))return;let re=te.packages.find((oe)=>!!oe&&typeof oe==="object"&&!Array.isArray(oe)&&ri(oe.source)&&("extensions"in oe));if(!re)return;return delete re.extensions,Dt(K,`${JSON.stringify(te,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${K}`}function Tc(j,K){let te=At({label:K,booleans:Object.fromEntries(Wt.map((ce)=>[ce.target,[ce.flag]]))},j),re=te.errors[0];if(re)throw Error(re);let oe=Wt.filter((ce)=>te.flags[ce.target]).map((ce)=>ce.target);if(oe.length!==1)throw Error(`Choose exactly one ${K} target: ${Wt.map((ce)=>ce.flag).join(", ")}`);return oe[0]}async function Mc(j,K=xn){let[te,re,oe]=await Promise.all([K(["amp","plugins","list"],30000),K(["codex","plugin","list"],30000),K(["copilot","--binary-version"])]);return{codexPluginListOutput:re,hooks:Dn(j,process.cwd(),{ampPluginListOutput:te,codexPluginListOutput:re,copilotCliVersion:oe})}}async function rg(j,K,te=xn){let re=await Mc(j,te);return re.hooks.filter((oe)=>K==="install"?oe.configured:oe.detected||oe.inspectionStatus==="not-inspected").filter((oe)=>oe.platform!=="codex"||!Si(re.codexPluginListOutput)||jc(re.codexPluginListOutput)).map((oe)=>oe.platform)}function og(j,K,te,re){if(te.length>0)return{finish:async()=>[Tc(te,K)]};if(!re.selectTargets&&!fi(re.input,re.output))return{finish:async()=>[Tc(te,K)]};let oe=re.detectConfiguredTargets??(()=>rg(j,K,re.fetchVersion)),ce=Promise.all([mc(re.probeTargets),oe()]);return{ready:ce,finish:async()=>{let[de,we]=await ce,xe=gc(de,{action:K,configuredTargets:we}),Ce=re.selectTargets?await re.selectTargets(K,$c(K,xe)):await Wl(K,$c(K,xe),{input:re.input,output:re.output});if(Ce==="update")return Ce;if(!Ce||Ce.length===0)return null;return vi(Ce)}}}async function vn(j,K,te=!1,re){let oe=Fc[j];oe.beforeInstall?.(K);let ce=typeof oe.installCommands==="function"?await oe.installCommands(K,re):{commands:oe.installCommands};return await Ko(ce.commands),await el(ce.cleanupCommands??[]),[`${ce.update||te?"Updated":"Installed"} ${St(j)} integration`,oe.postInstallMessage].filter(Boolean).join(`
`)}async function On(j){let K=Fc[j];if(!K.uninstallCommands)throw Error(`${St(j)} uninstall is not supported`);return await Ko(K.uninstallCommands),`Uninstalled ${St(j)} integration`}function ig(j){let K=wl(j);return K.alreadyInstalled?`Uninstalled OpenCode plugin from ${K.path}`:`OpenCode plugin not installed in ${K.path}`}var sg={"antigravity-cli":{install:dc,uninstall:uc},cursor:{install:Ea,uninstall:Da},"grok-build":{install:Ma,uninstall:Ha},"kimi-code":{install:Ec,uninstall:Dc}};function on(j,K,te,re=!1){if(j==="install"&&!re)Kr(te);let oe=sg[K][j](te),ce=St(K),de=j!=="install"?"Uninstalled":re?"Updated":"Installed";return j==="install"&&oe.alreadyInstalled?re?`${ce} hook up to date in ${oe.path}`:`${ce} hook already installed in ${oe.path}`:j==="uninstall"&&!oe.alreadyInstalled?`${ce} hook not installed in ${oe.path}`:`${de} ${ce} hook ${j==="install"?"in":"from"} ${oe.path}`}var ag={amp:{install:oc,uninstall:ic,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:qa,uninstall:Va,afterInstall:async(j)=>{let K=zo(j);return await Jt(["hermes","plugins","enable",Ft,"--no-allow-tool-override"]),!K},beforeUninstall:async(j)=>{Vo(j);try{await Jt(["hermes","plugins","disable",Ft])}catch(K){console.warn(`${K instanceof Error?K.message:String(K)}
Removing the plugin files anyway; ${Ft} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function Yr(j,K,te,re=!1){let oe=ag[K];if(j==="uninstall")await oe.beforeUninstall?.(te);let ce=j==="install"?await oe.install(te):await oe.uninstall(te),de=j==="install"&&await oe.afterInstall?.(te),we=St(K),xe=!de&&(j==="install"&&ce.alreadyInstalled||j==="uninstall"&&!ce.alreadyInstalled);return[xe?j==="install"?`${we} plugin ${re?"up to date":"already installed"} at ${ce.path}`:`${we} plugin not installed at ${ce.path}`:`${j!=="install"?"Uninstalled":re?"Updated":"Installed"} ${we} plugin ${j==="install"?"at":"from"} ${ce.path}`,xe?void 0:oe.restartNote].filter(Boolean).join(`
`)}var lg={amp:{install:(j,K)=>Yr("install","amp",j,K),uninstall:(j)=>Yr("uninstall","amp",j)},"antigravity-cli":{install:(j,K)=>on("install","antigravity-cli",j,K),uninstall:(j)=>on("uninstall","antigravity-cli",j)},"claude-code":{install:(j,K)=>vn("claude-code",j,K),uninstall:()=>On("claude-code")},codex:{install:(j,K,te)=>vn("codex",j,K,te),uninstall:()=>On("codex")},"copilot-cli":{install:async(j,K)=>[await vn("copilot-cli",j,K),tg(j)].filter(Boolean).join(`
`),uninstall:()=>On("copilot-cli")},cursor:{install:(j,K)=>on("install","cursor",j,K),uninstall:(j)=>on("uninstall","cursor",j)},"gemini-cli":{install:(j,K)=>vn("gemini-cli",j,K),uninstall:()=>On("gemini-cli")},"grok-build":{install:(j,K)=>on("install","grok-build",j,K),uninstall:(j)=>on("uninstall","grok-build",j)},"hermes-agent":{install:(j,K)=>{if(!K)Kr(j);return Yr("install","hermes-agent",j,K)},uninstall:(j)=>Yr("uninstall","hermes-agent",j)},"kimi-code":{install:(j,K)=>on("install","kimi-code",j,K),uninstall:(j)=>on("uninstall","kimi-code",j)},openclaw:{install:async(j,K)=>{let te=await vn("openclaw",j,K);return await al(),te},uninstall:(j)=>(Xo(j),On("openclaw"))},opencode:{install:async(j,K)=>{let te=await vn("opencode",j,K);return await bl(j),te},uninstall:(j)=>ig(j)},pi:{install:async(j,K)=>[await vn("pi",j,K),ng(j)].filter(Boolean).join(`
`),uninstall:()=>On("pi")}},Ic=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function cg(j){if(Yn({environment:j,cwd:process.cwd()}).status!=="configured")return Ic;return[Ic,"",bt.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function $c(j,K){return K.map((te)=>j==="install"&&te.target==="kimi-code"&&te.unavailableReason==="already installed"?{...te,available:!0,unavailableReason:void 0,label:`${te.label} (global hook installed)`}:te)}function dg(j,K){if(j.selectKimiInstallMethod)return j.selectKimiInstallMethod();if(!fi(j.input,j.output))return Promise.resolve("global-hook");return Jl({input:j.input,output:j.output,globalHookInstalled:Yn({environment:K,cwd:process.cwd()}).status==="configured"})}async function Hc(j,K,te,re=!1,oe){return lg[K][j](te,re,oe)}function ug(j){let K=At({label:"update"},j).errors[0];if(K)throw Error(K)}async function pg(j,K=xn){let te=await Mc(j,K),re=ki(Vn(j),"installed-plugins");return{targets:vi([...te.hooks.filter((ce)=>ce.platform!=="copilot-cli"&&ce.detected).map((ce)=>ce.platform),...[Er,fa,pa].flatMap((ce)=>Ci(ki(re,...ce))?["copilot-cli"]:[]),...Sr(j,xi)?["claude-code"]:[],...Si(te.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:te.codexPluginListOutput}}async function fg(j){let K=l(),te=j.output??process.stdout,re=(j.scriptPath??process.argv[1]??"").split(/[\\/]/),oe=re.find((at)=>/^bunx-\d+-/.test(at)),ce=oe!==void 0||re.includes("_npx")?null:(j.checkLatestVersion??tn)(),de=async()=>{let at=ce&&await ce;if(at?.updateAvailable)te.write(`
Update available: cc-safety-net ${at.currentVersion} → ${at.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},we=pg(K,j.fetchVersion??xn).then(async(at)=>{let mt=new Set(at.targets);return{targets:at.targets,codexPluginListOutput:at.codexPluginListOutput,available:new Map(await Promise.all(Wt.filter((it)=>mt.has(it.target)&&Ac.has(it.target)).map(async(it)=>[it.target,await bi(it.probeCommand)])))}}),xe=await Bn(j.showBanner??!0,()=>({ready:we,finish:()=>we}),()=>Gn({input:j.input??process.stdin,output:te}),{loadingMessage:"Checking installed integrations…",output:te}),Ce=await Promise.resolve().then(()=>(pc(K.tmpdir,process.platform,oe),null)).catch((at)=>or(at));if(xe.targets.length===0){if(te.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),Ce!==null)console.error(Ce);return await de(),Ce===null?0:1}let Se=xe.targets.some((at)=>_c.has(at))?await Promise.resolve().then(()=>(Kr(K),null)).catch((at)=>or(at)):null,Ne=await kr(Promise.all(xe.targets.map((at)=>{if(Ac.has(at)&&!xe.available.get(at))return Promise.resolve({message:`${St(at)} not found; skipped`,failed:!1});if(Se!==null&&_c.has(at))return Promise.resolve({message:Se,failed:!0});return Hc("install",at,K,!0,xe.codexPluginListOutput).then((mt)=>({message:mt,failed:!1}),(mt)=>({message:or(mt),failed:!0}))})),{loadingMessage:`Updating ${xe.targets.length} integration${xe.targets.length===1?"":"s"}…`,output:te}),He=Ce===null?Ne:[...Ne,{message:Ce,failed:!0}];return He.forEach((at)=>{at.failed?console.error(at.message):te.write(`${at.message}
`)}),await de(),He.some((at)=>at.failed)?1:0}function Ri(j,K={}){return Promise.resolve().then(()=>ug(j)).then(()=>fg(K)).catch((te)=>(console.error(or(te)),1))}async function ir(j,K,te={}){try{let re=l(),oe=await Bn(!0,()=>og(re,j,K,te),()=>Gn({input:te.input??process.stdin,output:te.output??process.stdout}),{loadingMessage:j==="install"?"Checking available integrations…":"Checking installed integrations…",output:te.output??process.stdout});if(!oe)return(te.output??process.stdout).write(`Cancelled: nothing was ${j}ed.
`),0;if(oe==="update")return(te.runUpdate??(()=>Ri([],{fetchVersion:te.fetchVersion,input:te.input,output:te.output,showBanner:!1})))();let ce=te.output??process.stdout;return await fc(oe,async(de)=>{if(de==="kimi-code"&&j==="install"){let xe=await dg(te,re);if(xe===null){ce.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(xe==="plugin"){ce.write(`${cg(re)}
`);return}}let we=await kr(Hc(j,de,re),{loadingMessage:`${j==="install"?"Installing":"Uninstalling"} ${St(de)} integration…`,output:ce});ce.write(`${we}
`)}),0}catch(re){return console.error(or(re)),1}}function or(j){let K=j instanceof Error?j.message:String(j),te=typeof j==="object"&&j!==null&&"code"in j?j.code:null;if(te==="EACCES"||te==="EPERM")return`${K}
Check file permissions for the target config file and parent directory.`;if(te==="ENOENT")return`${K}
Check that the target config path and parent directory exist.`;if(te==="ENOTDIR")return`${K}
Check that every parent path component is a directory.`;return K}import{mkdirSync as xg}from"node:fs";import{dirname as Cg}from"node:path";import{createInterface as Sg}from"node:readline";import{existsSync as Jc,readFileSync as vg}from"node:fs";var Bc=["version","safety","workflow","destructive_command_protection","secret_protection","audit"],mg=["standard","strict","paranoid"],qc="must be an object if provided",gg=`must be an integer between ${ye} and ${ve}`;function Ut(j,K){return se(nt(yg(j,K),Bc,(te)=>te.kind==="custom")," "," ")}function yg(j,K){if(!Ei(j))return[e([],"Config must be an object")];return[...j.version===1?[]:[e(["version"],"must be 1")],...jn(j.safety,["safety"],["level","overrides"],(te)=>[...te.level===void 0||typeof te.level==="string"&&mg.includes(te.level)?[]:[e(["safety","level"],'must be "standard", "strict", or "paranoid"')],...jn(te.overrides,["safety","overrides"],Uc,(re)=>Uc.flatMap((oe)=>Zr(re[oe],["safety","overrides",oe])))]),...jn(j.workflow,["workflow"],["worktree_mode"],(te)=>Zr(te.worktree_mode,["workflow","worktree_mode"])),...jn(j.destructive_command_protection,["destructive_command_protection"],["enabled","overrides","allow_paths"],(te)=>[...Zr(te.enabled,["destructive_command_protection","enabled"]),...Gc(te.overrides,["destructive_command_protection","overrides"],Pe,"destructive command"),...Pi(te.allow_paths,["destructive_command_protection","allow_paths"],Ae,K)]),...jn(j.secret_protection,["secret_protection"],["enabled","overrides","deny_paths","allow_paths"],(te)=>[...Zr(te.enabled,["secret_protection","enabled"]),...Gc(te.overrides,["secret_protection","overrides"],_e,"secret protection"),...Pi(te.deny_paths,["secret_protection","deny_paths"],Te,K),...Pi(te.allow_paths,["secret_protection","allow_paths"],Ie,K)]),...jn(j.audit,["audit"],["retention_days"],(te)=>hg(te.retention_days)?[]:[e(["audit","retention_days"],gg)]),...Object.keys(j).filter((te)=>!Bc.includes(te)).map((te)=>Vc([],te))]}var Uc=["fail_closed","paranoid_rm","paranoid_interpreters"];function jn(j,K,te,re){if(j===void 0)return[];if(!Ei(j))return[e(K,qc)];return[...re(j),...Object.keys(j).filter((oe)=>!te.includes(oe)).map((oe)=>Vc(K,oe))]}function Zr(j,K){return j===void 0||typeof j==="boolean"?[]:[e(K,"must be a boolean")]}function Gc(j,K,te,re){if(j===void 0)return[];if(!Ei(j))return[e(K,qc)];return[...Object.keys(j).filter((oe)=>!te.has(oe)).map((oe)=>({path:[...K,oe],message:`unknown ${re} rule id "${oe}"`,kind:"key"})),...Object.keys(j).filter((oe)=>j[oe]!=="on"&&j[oe]!=="off").map((oe)=>e([...K,oe],'must be "on" or "off"'))]}function Pi(j,K,te,re){if(j===void 0)return[];if(!Array.isArray(j))return[e(K,"must be an array of paths")];return j.flatMap((oe,ce)=>{if(typeof oe!=="string")return[e([...K,ce],"must be a non-empty path string")];let de=te(oe,re);return de===null?[]:[g([...K,ce],de)]})}function hg(j){if(j===void 0)return!0;if(typeof j!=="number"||!Number.isInteger(j))return!1;return j>=ye&&j<=ve}var Vc=(j,K)=>({path:j,message:K,kind:"unknownKeys"});function Ei(j){return!!j&&typeof j==="object"&&!Array.isArray(j)}function zc(j,K){return{"safety.level":j.safety.level,...Di("safety.overrides",j.safety.overrides),"workflow.worktree_mode":String(j.workflow.worktree_mode),"destructive_command_protection.enabled":String(j.destructive_command_protection.enabled),...Di("destructive_command_protection.overrides",j.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":Ai(j.destructive_command_protection.allow_paths),"secret_protection.enabled":String(j.secret_protection.enabled),...Di("secret_protection.overrides",j.secret_protection.overrides),"secret_protection.deny_paths":Ai(j.secret_protection.deny_paths),"secret_protection.allow_paths":Ai(j.secret_protection.allow_paths),...K?{"audit.retention_days":String(j.audit.retention_days)}:{}}}function Xr(j,K,te){let re=zc(j,te),oe=zc(K,te);return[...new Set([...Object.keys(re),...Object.keys(oe)])].flatMap((ce)=>re[ce]===oe[ce]?[]:[{field:ce,before:re[ce],after:oe[ce]}])}function sr(j,K){let te=d(j,K);if(!Jc(te))return{baseline:h(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,j.home),diagnostics:[]};let re=bn(te);return{baseline:h(re.value,j.home),diagnostics:re.errors.length>0?re.errors:Ut(re.value,j.home)}}function bn(j){if(!Jc(j))return{errors:[`${j}: file not found`]};try{return{value:JSON.parse(vg(j,"utf-8")),errors:[]}}catch(K){let te=K instanceof Error?K.message:String(K);return{errors:[`${j}: ${K instanceof SyntaxError?`Invalid JSON: ${te}`:te}`]}}}function Qr(j,K){let te=bg(j)?j:{};return{version:K.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((re)=>te[re]!==void 0).map((re)=>[re,te[re]]))}}function Di(j,K){return Object.fromEntries(Object.entries(K).flatMap(([te,re])=>re===void 0?[]:[[`${j}.${te}`,String(re)]]))}function Ai(j){return j.length===0?"(none)":j.join(", ")}function bg(j){return!!j&&typeof j==="object"&&!Array.isArray(j)}import{chmodSync as Lg,existsSync as Wc,mkdirSync as wg,readFileSync as Kc}from"node:fs";import{dirname as kg}from"node:path";function Yc(j,K={}){let te=d(j,K);if(!Wc(te))return{path:te,exists:!1,raw:"",policy:z(),errors:[]};let re=Kc(te,"utf-8");if(!re.trim())return{path:te,exists:!0,raw:re,policy:z(),errors:["Config file is empty"]};try{let oe=JSON.parse(re),ce=Ut(oe,j.home);return{path:te,exists:!0,raw:re,policy:h(oe,j.home),errors:ce}}catch(oe){return{path:te,exists:!0,raw:re,policy:z(),errors:[`Invalid JSON: ${oe instanceof Error?oe.message:String(oe)}`]}}}function Xt(j,K,te={}){let re=d(j,te),oe=Ut(K,j.home),ce=oe.length>0?z():h(K,j.home);if(oe.length>0)return{path:re,policy:ce,errors:oe};return wg(kg(re),{recursive:!0,mode:448}),y(D(re),`${JSON.stringify(ce,null,2)}
`,384),Lg(re,384),{path:re,policy:ce,errors:[]}}function Zc(j,K){let te=Ut(K,j.home);if(te.length>0)return{errors:te};return{preview:Ge(h(K,j.home),j.env),errors:[]}}function Xc(j,K={}){let te=d(j,K);if(!Wc(te))return Xt(j,Q,K);let re=Kc(te,"utf-8");if(!re.trim())return Xt(j,Q,K);try{return Xt(j,h(JSON.parse(re),j.home),K)}catch{return Xt(j,Q,K)}}var Qc=new Set(["check","apply"]),ed="(unset)";async function nd(j,K,te={}){let re=At({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},K),oe=re.positionals[0],ce=[...re.errors,...oe&&!Qc.has(oe)?[`Unknown policy subcommand: ${oe}`]:[],...oe&&Qc.has(oe)&&!re.positionals[1]?[`policy ${oe} requires a file`]:[],...re.positionals.slice(2).map((mt)=>`Unexpected policy argument: ${mt}`)];if(ce.length>0){for(let mt of ce)console.error(mt);return 1}let de=re.positionals[1];if(!oe||!de)return _n(pr,console.error),1;let we=re.flags.global?d(j):w(te.cwd??process.cwd()),xe=bn(de),Ce=[...xe.errors,...Ut(xe.value,j.home).map((mt)=>`${de}: ${mt}`),...!re.flags.global&&Eg(xe.value)&&xe.value.audit!==void 0?[`${de}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(Ce.length>0){for(let mt of Ce)console.error(mt);return 1}let Se=h(xe.value,j.home);if(console.log(`Scope: ${re.flags.global?"user":"project"} (${we})`),console.log(`Proposal: ${de}`),re.flags.global)td(h(bn(we).value,j.home),Se,!0);if(!re.flags.global){let mt=sr(j).baseline;console.log("Effective policy (user + project merged):"),td(X(mt,le(bn(we).value,j.home).policy).policy,X(mt,le(xe.value,j.home).policy).policy,!1)}if(oe==="check")return 0;let Ne=te.input??process.stdin,He=te.output??process.stdout;if(!Ne.isTTY||!He.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${de}${re.flags.global?" --global":""}`),1;if(!await Rg(`Apply this policy to ${we}? [y/N] `,Ne,He))return console.log("Cancelled; nothing was written."),0;return Pg(j,we,xe.value,Se,re.flags.global),console.log(`Policy applied: ${we}`),0}function Rg(j,K,te){let re=Sg({input:K,output:te,terminal:!1});return new Promise((oe)=>{re.once("close",()=>oe(!1)),re.question(j,(ce)=>{oe(/^y(es)?$/i.test(ce.trim())),re.close()})})}function Pg(j,K,te,re,oe){if(oe){Xt(j,re);return}xg(Cg(K),{recursive:!0}),It(K,Qr(te,re))}function td(j,K,te){let re=Xr(j,K,te);if(re.length===0){console.log("No changes.");return}console.log(`Changes (${re.length}):`);for(let oe of re)console.log(`  ${oe.field}: ${oe.before??ed} -> ${oe.after??ed}`)}function Eg(j){return!!j&&typeof j==="object"&&!Array.isArray(j)}import{join as Gy}from"node:path";var rd="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- Transparent wrappers have no built-in defaults. Configure only wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function eo(j,K){if(!j.ok){ld(j);return}sd(j,K)}function id(j,K,te){if(j.ok)console.log(te);if(!j.add){eo(j,`Added rulebook source: ${K}`);return}if(!j.ok){ld(j);return}if(j.add.added.length>0)console.log(`Added ${j.add.added.length} ${j.add.added.length===1?"rulebook":"rulebooks"} from ${j.add.source} at ${j.add.ref}:`),j.add.added.forEach((re)=>{console.log(`  - ${re}`)});if(j.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${j.add.source} at ${j.add.ref}: ${j.add.alreadyConfigured.join(", ")}`);if(j.add.commits.length>0)console.log(`Vendored at ${j.add.commits.map((re)=>re.slice(0,7)).join(", ")}.`);sd(j,"Rule config updated.")}function sd(j,K){for(let te of j.changes??[])console.log(te);console.log(K),console.log(""),Dg(j.entries)}function Dg(j){if(j.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${j.length}):`);for(let K of j)console.log(`  - ${K.name} ${K.version} (${Ag(K.ruleCount)})`),console.log(`    Source: ${K.spec}`)}function Ag(j){return`${j} ${j===1?"rule":"rules"}`}function ad(j){Ln("Active sources",j.rulebooks,(K)=>[`[${K.source}] ${K.name} ${K.version}`,`  Source: ${K.spec}`]),Ln("Active rules",j.rules,(K)=>[`[${Tg(j,K.name)}] ${K.name}`,..._g(K),`  Reason: ${K.reason}`]),Ln("Disabled rules",od(j,"off"),(K)=>[K.key]),Ln("Reason overrides",od(j,"reason"),(K)=>[K.key,`  Reason: ${K.value.reason}`]),Ln("Transparent wrappers",j.transparent_wrappers,(K)=>[K]),Ln("Issues",j.errors,(K)=>[K]),Ln("Warnings",j.warnings,(K)=>[K])}function Ln(j,K,te){if(K.length===0){console.log(`${j}: (none)`);return}console.log(`${j} (${K.length}):`);for(let re of K){let[oe,...ce]=te(re);console.log(`  - ${oe}`);for(let de of ce)console.log(`    ${de}`)}}function _g(j){if(!j.match)return[`  Command: ${j.subcommand?`${j.command} ${j.subcommand}`:j.command}`,`  Block args: ${j.block_args.join(", ")}`];return[`  Command: ${[j.command,...j.match.command_path].join(" ")}`,...j.match.any_args?[`  Any args: ${j.match.any_args.join(", ")}`]:[],...j.match.exclude_args?[`  Exclude args: ${j.match.exclude_args.join(", ")}`]:[]]}function Tg(j,K){return j.rulebooks.find((te)=>te.rules.includes(K))?.source??"project"}function od(j,K){return Object.entries({...j.userConfig?.overrides??{},...j.projectConfig?.overrides??{}}).filter((te)=>{if(K==="off")return te[1]==="off";return!!te[1]&&typeof te[1]==="object"}).map(([te,re])=>({key:te,value:re}))}function ld(j){for(let K of j.errors)console.error(K)}import{dirname as _d,join as lo}from"node:path";import{join as ji,resolve as qg}from"node:path";function _i(j){let K=m(j);if(K.errors.length>0)return{ok:!1,result:{ok:!1,errors:K.errors,entries:[]}};return{ok:!0,config:K.config??pt}}function cd(j,K=[]){It(j,{version:1,rules:K,overrides:{},transparent_wrappers:[]})}function dd(j,K="project-rules"){It(j,{rulebook_version:1,name:K,version:"1.0.0",description:K==="project-rules"?"Project-specific CC Safety Net rules.":"User-specific CC Safety Net rules.",author:K==="project-rules"?"project":"user",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as oo}from"node:path";var Ig="custom.";function to(j){if(j.rulebook_version!==2)return[];let K=j.rules.map((te)=>({name:te.name,command:te.command,block_args:[],match:te.match,reason:te.reason,intent:te.intent}));return(j.tests??[]).flatMap((te,re)=>{let oe=Ti(v(te.command));if(oe.length===0)return[`tests[${re}]: could not parse fixture command: ${te.command}`];let ce=oe.reduce((de,we)=>de??E(we,K)?.id.slice(Ig.length),void 0);if(te.expect==="blocked"){if(ce===te.rule)return[];let de=ce?`"${ce}" matched first`:"no rule matched";return[`tests[${re}]: expected "${te.rule}" to block "${te.command}" but ${de}`]}return ce?[`tests[${re}]: expected "${te.command}" to be allowed but "${ce}" matched`]:[]})}function Ti(j){return j.nodes.flatMap((K)=>{if(K.kind==="group"||K.kind==="function")return Ti(K.body);if(K.kind!=="command")return[];let te=be(ee(K.dialect,K.words)).words.map(t);return[...te.length>0?[te]:[],...K.nested.flatMap((re)=>Ti(re))]})}var Ii="Rule synchronization exceeds CC Safety Net's safe resource limits.",no=Object.freeze({maxSources:J,concurrency:4,maxRequests:131,maxResponseBytes:67108864});function ro(j={}){return{requests:0,responseBytes:0,maxRequests:j.maxRequests??no.maxRequests,maxResponseBytes:j.maxResponseBytes??no.maxResponseBytes}}function Qt(j){return{controller:new AbortController,budget:ro(),resolveUrl:j}}function ud(j){return j instanceof Error&&j.message===Ii}function pd(j){if(j.requests>=j.maxRequests)throw Error(Ii);j.requests++}function fd(j,K){if(K>j.maxResponseBytes-j.responseBytes)throw j.responseBytes+=K,Error(Ii);j.responseBytes+=K}var yd=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function md(j,K,te=S(oo(oo(K)),"rules policy"),re=Qt()){if(x(j))return Fg(j,re);return jg(j,K,te)}async function hd(j,K,te,re,oe,ce){if(!x(j))return md(j,K,te,re);let de=oe?null:$g(j,K,te);if(de)return de;if(!oe&&!ce)throw Error(`${j} is not vendored; run rule update ${j} to vendor it`);return md(j,K,te,re)}function $g(j,K,te=S(oo(oo(K)),"rules policy")){let re=O(j),oe=N(K,re.name),ce=r(s(te,oe));if(ce===null)return null;let de=ae($i(ce,`Invalid rulebook ${oe}.`));if(de.name!==re.name)throw Error(`rulebook name "${de.name}" in ${oe} must match "${re.name}"`);return{spec:j,rulebook:de,content:ce}}async function vd(j,K={}){if(!Y(j))throw Error(`Invalid GitHub repository source: ${j}`);let[te,re]=j.split("/");if(!te||!re)throw Error(`Invalid GitHub repository source: ${j}`);if(K.ref!==void 0&&!ie(K.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${K.ref}`);let oe=K.operation??Qt(),ce=K.ref??await Og(te,re,j,oe),de=await Ld(te,re,ce,j,oe),we=await io(`https://api.github.com/repos/${te}/${re}/git/trees/${de}?recursive=1`,"tree",oe),xe=we.response;if(!xe.ok)throw Error(`Failed to inspect ${j}: GitHub tree returned ${xe.status}`);let Ce=JSON.parse(we.content);if(!Array.isArray(Ce?.tree))throw Error(`Failed to inspect ${j}: unexpected GitHub tree response`);let Se=Ce.tree,Ne=[...new Set(Se.flatMap((He)=>{if(!He||typeof He!=="object")return[];let at=He;if(at.type!=="blob"||typeof at.path!=="string")return[];let mt=at.path.match(dt);return mt?.[1]?[mt[1]]:[]}))].sort();if(Ne.length===0)throw Error(`No rulebooks found in ${j} under ${fe}/`);return{source:j,owner:te,repo:re,ref:ce,commit:de,names:Ne}}async function Og(j,K,te,re){let oe=await io(`https://api.github.com/repos/${j}/${K}`,"metadata",re),ce=oe.response;if(!ce.ok)throw Error(`Failed to inspect ${te}: GitHub returned ${ce.status}`);let we=JSON.parse(oe.content)?.default_branch;if(typeof we!=="string"||we==="")throw Error(`Failed to inspect ${te}: missing default branch`);if(!ie(we))throw Error(`GitHub returned an invalid default branch: ${we}`);return we}function jg(j,K,te){ut(j);let re=N(K,j),oe=r(s(te,re));if(oe===null)throw Error(`Rulebook source not found: ${j}`);let ce=bd($i(oe,"Invalid local rulebook source."));if(ce.name!==j)throw Error(`rulebook name "${ce.name}" must match local source "${j}"`);return{spec:j,rulebook:ce,content:oe}}async function Fg(j,K){let te=O(j),re=await Ld(te.owner,te.repo,te.ref,j,K),oe=await io(`https://raw.githubusercontent.com/${te.owner}/${te.repo}/${re}/${te.path}`,"raw",K),ce=oe.response;if(!ce.ok)throw Error(`Failed to fetch ${j}: GitHub raw returned ${ce.status}`);let de=oe.content,we=bd($i(de,"Invalid GitHub rulebook response."));if(we.name!==te.name)throw Error(`rulebook name "${we.name}" must match GitHub source "${te.name}"`);return{spec:j,rulebook:we,content:de}}function bd(j){let K=ae(j),te=to(K);if(te.length>0)throw Error(te.join("; "));return K}function $i(j,K){try{return JSON.parse(j)}catch{throw Error(K)}}async function Ld(j,K,te,re,oe){let ce=await io(`https://api.github.com/repos/${j}/${K}/commits/${encodeURIComponent(te)}`,"commit",oe),de=ce.response;if(!de.ok)throw Error(`Failed to resolve ${re}: GitHub returned ${de.status}`);let we=JSON.parse(ce.content);if(typeof we?.sha!=="string"||we.sha==="")throw Error(`Failed to resolve commit for ${re}`);return we.sha}async function Ng(j,K,te={}){if(te.signal?.aborted)throw te.signal.reason;let re=te.budget??ro(),oe=new AbortController,ce=()=>oe.abort(te.signal?.reason);te.signal?.addEventListener("abort",ce,{once:!0});let de=!1,we=setTimeout(()=>{if(oe.signal.aborted)return;de=!0,oe.abort()},te.timeoutMs??yd.timeoutMs);try{if(te.signal?.aborted)throw te.signal.reason;pd(re);let xe=await(te.fetch??fetch)(j,{signal:oe.signal,redirect:"error"});if(!xe.ok)return wd(xe),{response:xe,content:""};return{response:xe,content:await Mg(xe,K,re,()=>oe.abort())}}catch(xe){if(de)throw Error("GitHub request timed out",{cause:xe});if(te.signal?.aborted)throw te.signal.reason;throw xe}finally{clearTimeout(we),te.signal?.removeEventListener("abort",ce)}}function io(j,K,te){return Ng(te.resolveUrl?.(j)??j,K,{budget:te.budget,signal:te.controller.signal})}async function Mg(j,K,te=ro(),re){let oe=yd[`${K}Bytes`],ce=Number(j.headers.get("content-length"));if(Number.isFinite(ce)&&ce>oe)throw wd(j),Error(`GitHub ${K} response exceeds ${oe} bytes`);if(!j.body)return"";let de=j.body.getReader(),we=[],xe=0;while(!0){let Ce=await de.read();if(Ce.done)break;try{fd(te,Ce.value.byteLength)}catch(Se){throw re?.(),gd(de),Se}if(xe+=Ce.value.byteLength,xe>oe)throw re?.(),gd(de),Error(`GitHub ${K} response exceeds ${oe} bytes`);we.push(Buffer.from(Ce.value))}return Buffer.concat(we,xe).toString("utf-8")}function wd(j){if(!j.body)return;kd(()=>j.body?.cancel())}function gd(j){kd(()=>j.cancel())}function kd(j){try{Promise.resolve(j()).catch(()=>{})}catch{}}var Hg=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function xd(j,K){let te=Rd(j.rules,K);if(te.length>0)return{ok:!0,specs:te};return Sd(j.rules,K)}function Cd(j,K){let te=Rd(j,K);if(te.length>0)return{ok:!0,specs:te};let re=Gg(j,K);if(re.length>0)return{ok:!0,specs:re};let oe=Bg(j,K);if(!oe.ok)return oe;if(oe.specs.length>0)return{ok:!0,specs:oe.specs};return Sd(j,K)}function Sd(j,K){let te=j.filter((re)=>Oi(re)?.name===K);if(te.length===1)return{ok:!0,specs:te};return Ug(K,te)}function Ug(j,K){return{ok:!1,result:{ok:!1,errors:K.length===0?[`No configured rulebook matches ${j}`]:[`Ambiguous rulebook match ${j}: ${K.join(", ")}`],entries:[]}}}function Rd(j,K){return j.filter((te)=>te===K)}function Gg(j,K){let te=K.match(Hg),re=te?.[1],oe=te?.[2],ce=te?.[3];if(!re||!oe||!ce||!ie(ce))return[];return Pd(j,(de)=>de.owner===re&&de.repo===oe&&de.ref===ce)}function Bg(j,K){if(!Y(K))return{ok:!0,specs:[]};let[te,re]=K.split("/"),oe=Pd(j,(de)=>de.owner===te&&de.repo===re);if(new Set(oe.map((de)=>Oi(de)?.ref).filter((de)=>!!de)).size<2)return{ok:!0,specs:oe};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${K}. Use an explicit ref:`,`  cc-safety-net rule remove ${K}#<ref>`],entries:[]}}}function Oi(j){try{return O(j)}catch{return null}}function Pd(j,K){return j.filter((te)=>{let re=Oi(te);return re?K(re):!1})}async function ao(j,K={}){let te=Fi(K);return Vg(j,te,await so(j,te,Qt()))}function Vg(j,K,te){if(!te.ok)return te;let re=$t(j,K),oe=[...new Set(W(re.configPath,re.filesystemScope))];if(oe.length===0)return te;return{ok:!1,errors:oe,entries:te.entries}}async function so(j,K,te,re={},oe=new Set,ce=new Set){try{let de=$t(j,K),we=_i(de.configTarget);if(!we.ok)return we.result;let xe=we.config;if(K.check)return ay(xe,de,K);let Ce=K.only?xd(xe,K.only):{ok:!0,specs:xe.rules};if(!Ce.ok)return Ce.result;let Se=new Set([...K.refresh?Ce.specs:[],...oe]),Ne=(Lt)=>hd(Lt,de.configDir,de.filesystemScope,te,Se.has(Lt),!K.refresh||Se.has(Lt)),He=await ny(xe.rules,K.refresh?(Lt)=>Ne(Lt).then((Ct)=>({ok:!0,item:Ct})).catch((Ct)=>{if(ud(Ct))throw Ct;return{ok:!1,spec:Lt,message:Ct instanceof Error?Ct.message:String(Ct)}}):async(Lt)=>({ok:!0,item:await Ne(Lt)}),te),at=He.filter((Lt)=>!Lt.ok),mt=He.filter((Lt)=>Lt.ok).map((Lt)=>Lt.item),it=mt.flatMap((Lt)=>zg(Lt,xe.rules)),gt=mt.flatMap((Lt)=>Jg(Lt,ce,de)),ht=new Set([...it,...gt].map((Lt)=>Lt.spec)),vt=[...at,...it,...gt],yt=[],kt=Kg(yt,()=>mt.flatMap((Lt)=>ht.has(Lt.spec)||vt.length>0&&ce.has(Lt.spec)?[]:Wg(Lt,de,re,yt)));return{ok:vt.length===0,errors:vt.map((Lt)=>`Failed to update ${Lt.spec}: ${Lt.message}`),entries:mt.map(Zg),changes:kt}}catch(de){return lr(de)}}function zg(j,K){if(!x(j.spec))return[];let te=je(j.spec),re=K.filter((oe)=>oe!==j.spec&&je(oe).toLowerCase()===te.toLowerCase());if(re.length===0)return[];return[{ok:!1,spec:j.spec,message:`rulebook name "${te}" is also claimed by ${re.join(", ")}; rename one of them`}]}function Jg(j,K,te){if(!K.has(j.spec)||!x(j.spec))return[];let re=N(te.configDir,j.rulebook.name),oe=r(s(te.filesystemScope,re));if(oe===null||oe===j.content)return[];return[{ok:!1,spec:j.spec,message:`${re} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function Wg(j,K,te,re){if(!x(j.spec))return[];let oe=N(K.configDir,j.rulebook.name),ce=s(K.filesystemScope,oe),de=r(ce);if(de===j.content)return[];return re?.push({target:ce,previous:de}),y(ce,j.content,void 0,te._testAfterPolicyRename),Yg(j,de)}function Kg(j,K){try{return K()}catch(te){for(let re of[...j].reverse()){if(re.previous===null){G(re.target);continue}y(re.target,re.previous)}throw te}}function Yg(j,K){if(K===null)return[`Vendored ${j.spec} (${j.rulebook.version})`];let te=he(K),re="problem"in te?null:te.rulebook,oe=new Map(re?.rules.map((de)=>[de.name,JSON.stringify(de)])??[]),ce=new Set(j.rulebook.rules.map((de)=>de.name));return[`Updated ${j.spec} (${re?.version??"unreadable"} -> ${j.rulebook.version})`,...[...ce].filter((de)=>!oe.has(de)).map((de)=>`  + ${de}`),...[...oe.keys()].filter((de)=>!ce.has(de)).map((de)=>`  - ${de}`),...j.rulebook.rules.filter((de)=>{let we=oe.get(de.name);return we!==void 0&&we!==JSON.stringify(de)}).map((de)=>`  ~ ${de.name}`)]}function Zg(j){return{spec:j.spec,name:j.rulebook.name,version:j.rulebook.version,ruleCount:j.rulebook.rules.length}}async function Ed(j,K,te={}){return Xg(j,K,oy(te),Qt())}async function Xg(j,K,te,re,oe={}){let ce=null,de=!1;try{let we=$t(j,te),xe=r(we.configTarget);ce={target:we.configTarget,content:xe};let Ce=_i(we.configTarget);if(!Ce.ok)return Ce.result;let Se=Ce.config,Ne=Y(K);Qg(K,te,Ne);let He=Ne?await vd(K,{ref:te.ref,operation:re}):null,at=He?ey(He,te.rulebooks):[],mt=He?at.map((yt)=>ty(Se.rules,He,yt)??`${K}#${He.ref}/${yt}`):[K],it=mt.filter((yt)=>!Se.rules.includes(yt)),gt=[...Se.rules,...it];if(gt.length>J)return ry();if(gt.length!==Se.rules.length)de=!0,It(we.configTarget,{version:1,rules:gt,overrides:Se.overrides??{},transparent_wrappers:Se.transparent_wrappers??[]},void 0,oe._testAfterPolicyRename);let ht=await so(j,te,re,oe,new Set(it),new Set(it));if(!ht.ok)ar(we.configTarget,xe);if(!ht.ok||!He)return ht;let vt=at.filter((yt,kt)=>it.includes(mt[kt]??""));return{...ht,add:{source:K,ref:He.ref,selected:at,added:vt,alreadyConfigured:at.filter((yt)=>!vt.includes(yt)),commits:it.length>0?[He.commit]:[]}}}catch(we){if(de&&ce)try{ar(ce.target,ce.content)}catch(xe){return lr(xe)}return lr(we)}}function Qg(j,K,te){if(!te&&K.rulebooks!==void 0)throw Error("--only can only select rulebooks from an owner/repo source");if(!te&&K.ref)throw Error(`--ref can only select a ref for an owner/repo source: ${j}`);if(K.rulebooks?.length===0)throw Error("--only requires at least one rulebook name");let re=K.rulebooks?.filter((oe)=>!c.test(oe))??[];if(re.length>0)throw Error(`Invalid rulebook names: ${re.join(", ")}`)}function ey(j,K){let te=K?[...new Set(K)]:j.names,re=te.filter((oe)=>!j.names.includes(oe));if(re.length>0)throw Error(`Rulebooks not found in ${j.source} at ${j.ref}: ${re.join(", ")}
Available rulebooks: ${j.names.join(", ")}`);return te}function ty(j,K,te){let re=`${K.source}#${K.ref}/${te}`;if(j.includes(re))return re;let oe=`${K.source}#${K.commit}/${te}`;return j.find((ce)=>ce===oe)}async function ny(j,K,te=Qt()){if(j.length>J)throw Error(ge);let re=Array(j.length),oe=0,ce,de=Array.from({length:Math.min(j.length,no.concurrency)},async()=>{while(!ce){let we=oe;if(we>=j.length)return;oe++;try{re[we]=await K(j[we],we,te.controller.signal)}catch(xe){if(!ce)ce={value:xe},oe=j.length,te.controller.abort(xe);return}}});if(await Promise.all(de),ce)throw ce.value;return re}function ry(){return{ok:!1,errors:[ge],entries:[]}}function Fi(j){return{cwd:j.cwd,userConfigDir:j.userConfigDir,userConfigPath:j.userConfigPath,projectConfigPath:j.projectConfigPath,global:j.global,check:j.check,only:j.only,refresh:j.refresh}}function oy(j){return{...Fi(j),ref:j.ref,rulebooks:j.rulebooks}}function iy(j){return{...Fi(j),deleteSource:j.deleteSource}}async function Dd(j,K,te={}){try{return await sy(j,K,iy(te),{})}catch(re){return lr(re)}}async function sy(j,K,te,re){let oe=$t(j,te),ce=m(oe.configTarget);if(ce.errors.length>0)return{ok:!1,errors:ce.errors,entries:[]};if(!ce.config)return{ok:!1,errors:[`No config found at ${oe.configPath}`],entries:[]};let de=Cd(ce.config.rules,K);if(!de.ok)return de.result;let we=te.deleteSource?ly(oe.configDir,de.specs,oe.filesystemScope):{ok:!0,dirs:[]};if(!we.ok)return we.result;let xe=r(oe.configTarget);if(xe===null)return lr(Error("Rules config is unavailable."));try{It(oe.configTarget,{version:1,rules:ce.config.rules.filter((Ne)=>!de.specs.includes(Ne)),overrides:ce.config.overrides??{},transparent_wrappers:ce.config.transparent_wrappers??[]},void 0,re._testAfterPolicyRename)}catch(Ne){throw ar(oe.configTarget,xe),Ne}let Ce=await so(j,te,Qt(),re);if(!Ce.ok)return ar(oe.configTarget,xe),Ce;let Se=cy(we.dirs,re,oe.filesystemScope);if(!Se.ok){ar(oe.configTarget,xe);let Ne=await so(j,te,Qt(),re);if(!Ne.ok)return{ok:!1,errors:[...Se.result.errors,...Ne.errors],entries:Ne.entries};return Se.result}return Ce}async function ay(j,K,te){let re=Re(j,K.configDir,te.global?"user":"project",K.filesystemScope);return{ok:re.errors.length===0&&re.warnings.length===0,errors:[...re.errors,...re.warnings],entries:re.entries}}function ly(j,K,te){let re=K.flatMap((we)=>c.test(we)?[]:["--delete-source can only delete local rulebook sources"]),oe=K.map((we)=>ji(j,we)),ce=re.length>0?[]:oe.flatMap((we)=>Ad(we,te)),de=[...re,...ce];return de.length>0?{ok:!1,result:{ok:!1,errors:de,entries:[]}}:{ok:!0,dirs:oe}}function Ad(j,K){let te=qg(j),re=s(K,te),oe=ue(re);if(!oe)return[`Local rulebook source directory not found: ${j}`];let ce=oe.find((de)=>de.name==="rulebook.json");if(!ce)return[`Local rulebook source directory is missing rulebook.json: ${j}`];if(ce.kind!=="file")throw new o(K.label);if(r(s(K,ji(te,"rulebook.json"))),oe.length>1)return[`Local rulebook source directory contains extra files: ${j}. delete manually if you really want to remove the directory.`];return[]}function cy(j,K,te){let re=j.flatMap((oe)=>{try{if(!ue(s(te,oe)))return[];let ce=Ad(oe,te);if(ce.length>0)return ce;return dy(oe,K,te),[]}catch(ce){return[`Failed to delete local rulebook source ${oe}: ${ce instanceof Error?ce.message:String(ce)}`]}});return re.length>0?{ok:!1,result:{ok:!1,errors:re,entries:[]}}:{ok:!0}}function dy(j,K,te){if(K._testDeleteLocalSourceDir){K._testDeleteLocalSourceDir(j);return}G(s(te,ji(j,pe))),ct(s(te,j))}function ar(j,K){if(K===null){G(j);return}y(j,K)}function lr(j){return{ok:!1,errors:[j instanceof Error?j.message:String(j)],entries:[]}}var uy=".safety-net.json",py="~/.cc-safety-net/config.json";async function $d(j,K){return[await Td(j,{legacyPath:zs({cwd:K.cwd}),configPath:A(K.cwd),defaultRulebookName:"project-rules",migratedFrom:uy,cleanup:K.cleanup,syncOptions:{cwd:K.cwd}}),await Td(j,{legacyPath:yr(j),configPath:T(j),defaultRulebookName:"user-rules",migratedFrom:py,cleanup:K.cleanup,syncOptions:{cwd:K.cwd,global:!0}})].every((re)=>re)?0:1}async function Td(j,K){let te=$t(j,K.syncOptions),re=s(te.filesystemScope,K.legacyPath),oe=r(re);if(oe===null)return console.log(`No legacy config found at ${K.legacyPath}`),!0;let ce=my(oe);if(!ce.ok){for(let at of ce.errors)console.error(at);return!1}let de=m(te.configTarget);if(de.errors.length>0){for(let at of de.errors)console.error(at);return!1}let we=de.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},xe=gy(_d(K.configPath),we.rules,K.defaultRulebookName,K.migratedFrom,te.filesystemScope),Ce=lo(_d(K.configPath),xe,"rulebook.json"),Se=s(te.filesystemScope,Ce),Ne=[Id(te.configTarget),Id(Se)],He=await fy(j,K,te.configTarget,Se,xe,ce.config.rules,we.rules.includes(xe)?we.rules:[...we.rules,xe],we.overrides??{},we.transparent_wrappers??[]);if(!He.ok){vy(Ne);for(let at of He.errors)console.error(at);return!1}if(!K.cleanup)return console.log(`Migrated legacy config at ${K.legacyPath}. Legacy file is no longer used.`),!0;if(!hy(te.configTarget,Se,xe,K.migratedFrom,ce.config.rules))return console.error(`Migration cleanup verification failed for ${K.legacyPath}`),!1;return G(re),console.log(`Deleted legacy config at ${K.legacyPath}`),!0}async function fy(j,K,te,re,oe,ce,de,we,xe){try{return It(te,{version:1,rules:de,overrides:we,transparent_wrappers:xe}),It(re,yy(oe,K.migratedFrom,ce)),await ao(j,K.syncOptions)}catch(Ce){return{ok:!1,errors:[Ce instanceof Error?Ce.message:String(Ce)]}}}function my(j){try{let K=JSON.parse(j),te=vo(K);if(te.errors.length>0)return{ok:!1,errors:te.errors};return{ok:!0,config:{version:1,rules:K.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function gy(j,K,te,re,oe){let ce=K.find((de)=>by(s(oe,lo(j,de,"rulebook.json")))===re);if(ce)return ce;if(r(s(oe,lo(j,te,"rulebook.json")))===null)return te;for(let de=2;;de++){let we=`${te}-${de}`;if(r(s(oe,lo(j,we,"rulebook.json")))===null)return we}}function yy(j,K,te){return{rulebook_version:1,name:j,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:K,allowed_commands:[...new Set(te.map((re)=>re.command))],rules:te,tests:te.map((re)=>({command:[re.command,re.subcommand,re.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:re.name}))}}function hy(j,K,te,re,oe){if(!m(j).config?.rules.includes(te))return!1;try{let de=r(K);if(de===null)return!1;let we=JSON.parse(de);return we.migrated_from===re&&JSON.stringify(we.rules)===JSON.stringify(oe)}catch{return!1}}function Id(j){return{target:j,content:r(j)}}function vy(j){for(let K of j){if(K.content===null){G(K.target);continue}y(K.target,K.content)}}function by(j){let K=r(j);if(K===null)return null;try{let te=JSON.parse(K);return typeof te.migrated_from==="string"?te.migrated_from:null}catch{return null}}import{mkdir as Ly,readFile as wy,writeFile as ky}from"node:fs/promises";import{dirname as xy,join as Cy}from"node:path";var Sy=86400000,Ry=604800000;async function jd(j,K=Date.now()){if(j.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let te=Ke(j);if(!te)return null;let re=Cy(te,".cc-safety-net","update-check.json"),oe=await Py(re,K);if(!oe.lastCheck||K-oe.lastCheck>Sy){let we=await tn();if(oe.lastCheck=K,we.latestVersion)oe.latestVersion=we.latestVersion;if(!await Od(re,oe))return null;if(we.error)return null}let ce=oe.latestVersion,de=Et();if(!ce||!Co(ce,de))return null;if(oe.notifiedVersion===ce&&oe.notifiedAt!==void 0&&K-oe.notifiedAt<Ry)return null;if(oe.notifiedVersion=ce,oe.notifiedAt=K,!await Od(re,oe))return null;return`UPDATE_AVAILABLE: cc-safety-net v${ce} is available (running v${de}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function Py(j,K){let te=await wy(j,"utf8").then((ce)=>JSON.parse(ce)).catch(()=>{return});if(!te||typeof te!=="object"||Array.isArray(te))return{};let re=te,oe=(ce)=>typeof ce==="number"&&Number.isFinite(ce)&&ce<=K?ce:void 0;return{lastCheck:oe(re.lastCheck),latestVersion:typeof re.latestVersion==="string"?re.latestVersion:void 0,notifiedVersion:typeof re.notifiedVersion==="string"?re.notifiedVersion:void 0,notifiedAt:oe(re.notifiedAt)}}async function Od(j,K){return Ly(xy(j),{recursive:!0,mode:448}).then(()=>ky(j,JSON.stringify(K),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as Ey,resolve as Ni}from"node:path";var Fd="CC Safety Net Config",Dy="═".repeat(Fd.length),Ay="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",_y=new Set(["rule.json","rule.lock","cache"]);function Nd(j,K={}){try{return Ty(j,K)}catch(te){if(te instanceof o)return console.error(te.message),1;throw te}}function Ty(j,K){let te=K.cwd??process.cwd(),re=K.userConfigPath??T(j),oe=K.projectConfigPath??A(te),ce=K.legacyUserConfigPath??yr(j),de=K.legacyProjectConfigPath??gs(te),we=Ni(te,fe),xe=H(j,{cwd:te,userConfigPath:re,projectConfigPath:oe}),Ce=H(j,{cwd:te}),Se=s(xe.userScope,re),Ne=s(xe.projectScope,oe),He=K.legacyUserConfigPath?D(K.legacyUserConfigPath,"user policy"):s(Ce.userScope,ce),at=K.legacyProjectConfigPath?D(K.legacyProjectConfigPath,"project policy"):s(Ce.projectScope,de),mt=!1,it=!1,gt=[],ht=[],vt=Iy(s(Ce.projectScope,we));if(Oy(),r(Se)!==null){let yt=en(Se);if(yt.errors.push(...W(re,xe.userScope)),gt.push({scope:"User",path:re,result:yt,schema:"rules",target:Se}),yt.errors.length>0)mt=!0}if(r(He)!==null)if(it=!0,r(Se)!==null)ht.push(co("user","cleanup"));else{let yt=bo(He);if(gt.push({scope:"User",path:ce,result:yt,schema:"legacy",inactive:!0,target:He}),ht.push(co("user",yt.errors.length>0?"fix-or-delete":"migrate")),yt.errors.length>0)mt=!0}if(r(Ne)!==null){let yt=en(Ne);if(yt.errors.push(...W(oe,xe.projectScope)),gt.push({scope:"Project",path:Ni(oe),result:yt,schema:"rules",target:Ne}),yt.errors.length>0)mt=!0;if(r(at)!==null)it=!0,ht.push(co("project","cleanup"))}else if(r(at)!==null){it=!0,mt=!0;let yt=bo(at);gt.push({scope:"Project",path:Ni(de),result:yt,schema:"legacy",inactive:!0,target:at}),ht.push(co("project",yt.errors.length>0?"fix-or-delete":"migrate"))}if(vt?.result.errors.length)mt=!0;if(gt.length===0&&!vt)return console.log(`
No config files found. Using built-in rules only.`),0;for(let yt of gt)if(yt.inactive)Fy(yt.scope,yt.path,yt.result);else if(yt.result.errors.length>0)Ny(yt.scope,yt.path,yt.result.errors);else{if(yt.schema==="rules"&&Uy(yt.target))console.log(`
Added $schema to ${yt.scope.toLowerCase()} config.`);jy(yt.scope,yt.path,yt.result,yt.schema)}for(let yt of ht)console.error(`
${bt.red(yt)}`);if(vt)if(vt.result.errors.length>0)Hy(vt.path,vt.result.errors);else My(vt.path,vt.result);if(mt)return console.error(`
Config validation failed.`),1;return console.log(it?`
Configs valid with warnings.`:`
All configs valid.`),0}function co(j,K){let te=`legacy ${j} config`;if(K==="cleanup")return`Warning: Legacy ${j} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(K==="migrate")return`Warning: Legacy ${j} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${j} config is no longer supported. Fix or delete the ${te}, then run \`npx -y cc-safety-net rule migrate\`.`}function Iy(j){if(ue(j)===null)return null;let K=$y(j);if(K.ruleNames.size===0&&K.errors.length===0)return null;return{path:j.path,result:K}}function $y(j){let K=[],te=new Set,re=(ue(j)??[]).filter((oe)=>!_y.has(oe.name)).sort((oe,ce)=>oe.name.localeCompare(ce.name));if(re.length===0)return{errors:K,ruleNames:te};for(let oe of re){if(!c.test(oe.name)){K.push(`rulebook directory names must match ${c}: ${oe.name}`);continue}if(oe.kind!=="directory"){K.push(`${oe.name} must be a rulebook directory`);continue}let ce=s(j.scope,Ey(j.path,oe.name,"rulebook.json")),de=r(ce);if(de===null){K.push(`${oe.name}/rulebook.json is required`);continue}try{let we;try{we=JSON.parse(de)}catch{K.push(`${oe.name}/rulebook.json: invalid JSON`);continue}let xe=ae(we);if(xe.name!==oe.name){K.push(`rulebook name "${xe.name}" must match folder "${oe.name}"`);continue}let Ce=to(xe);if(Ce.length>0){K.push(...Ce.map((Se)=>`${oe.name}/rulebook.json: ${Se}`));continue}te.add(oe.name)}catch(we){K.push(we instanceof Error?`${oe.name}/rulebook.json: ${we.message}`:`${oe.name}/rulebook.json: ${String(we)}`)}}return{errors:K,ruleNames:te}}function Oy(){console.log(Fd),console.log(Dy)}function jy(j,K,te,re){if(console.log(`
✓ ${j} config: ${K}`),console.log(`  Schema: ${re==="rules"?"rulebook sources":"legacy inline rules"}`),te.ruleNames.size>0){console.log(`  ${re==="rules"?"Sources":"Rules"}:`);let oe=1;for(let ce of te.ruleNames)console.log(`    ${oe}. ${ce}`),oe++}else console.log(`  ${re==="rules"?"Sources":"Rules"}: (none)`)}function Fy(j,K,te){if(console.error(`
✗ Legacy ${j.toLowerCase()} config: ${K}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),te.errors.length>0){console.error("  Errors:");let re=1;for(let oe of te.errors)for(let ce of oe.split("; "))console.error(`    ${re}. ${ce}`),re++;return}if(te.ruleNames.size>0){console.error("  Rules:");let re=1;for(let oe of te.ruleNames)console.error(`    ${re}. ${oe}`),re++;return}console.error("  Rules: (none)")}function Ny(j,K,te){Md(`${j} config`,K,te)}function My(j,K){console.log(`
✓ GitHub source rules: ${j}`),console.log("  Rulebooks:");let te=1;for(let re of K.ruleNames)console.log(`    ${te}. ${re}`),te++}function Hy(j,K){Md("GitHub source rules",j,K)}function Md(j,K,te){console.error(`
✗ ${j}: ${K}`),console.error("  Errors:");let re=1;for(let oe of te)for(let ce of oe.split("; "))console.error(`    ${re}. ${ce}`),re++}function Uy(j){try{let K=r(j);if(K===null)return!1;let te=JSON.parse(K);if(te.$schema)return!1;return y(j,JSON.stringify({$schema:Ay,...te},null,2)),!0}catch(K){if(K instanceof o)throw K;return!1}}var Hd=new Set(["init","add","remove","update","sync","list","wrapper","migrate","doc","verify"]),By=new Set(["add","remove","list"]),qy="cc-safety-net/rulebooks";async function Ud(j,K){try{return await Vy(j,K)}catch(te){if(te instanceof o)return console.error(te.message),1;throw te}}async function Vy(j,K){let te=Jy(K),re=te.help?zy(te.positionals):null;if(re)return _n(re),0;if(te.errors.length>0){for(let we of te.errors)console.error(we);return 1}let oe=te.positionals[0];if(!oe)return _n(kn,console.error),1;let ce=te.positionals[1],de={global:te.global};if(oe==="init"){let we=$t(j,de);Zy(we.configTarget);let xe=Gy(we.configDir,"example-rules","rulebook.json"),Ce=s(we.filesystemScope,xe);if(te.example&&r(Ce)===null)dd(Ce,"example-rules");let Se=W(we.configPath,we.filesystemScope);for(let Ne of Se)console.error(Ne);if(Se.length>0)return 1;return console.log("Rule config initialized."),0}if(oe==="add"){let we=Gd(te);if(!we)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let xe=$t(j,de),Ce=await Ed(j,we,{...de,ref:te.ref,rulebooks:te.only.length>0?te.only:void 0});return id(Ce,we,`Scope: ${te.global?"user":"project"} (${xe.configDir})`),Ce.ok?0:1}if(oe==="remove"){if(!ce)return console.error("rule remove requires a source"),1;let we=await Dd(j,ce,{...de,deleteSource:te.deleteSource});return eo(we,`Removed rulebook source: ${ce}`),we.ok?0:1}if(oe==="update"){let we=await ao(j,{...de,only:ce,refresh:!0});return eo(we,"Rule config updated."),we.ok?0:1}if(oe==="sync")return Ks(j,{global:te.global});if(oe==="list"){let we=Z(j,{cwd:process.cwd()});return ad(we),we.errors.length>0?1:0}if(oe==="wrapper")return Xy(j,te);if(oe==="migrate")return $d(j,{cleanup:te.cleanup,cwd:process.cwd()});if(oe==="doc"){console.log(rd);let we=await jd(j);if(we)console.error(we);return 0}if(oe==="verify")return Nd(j);return 1}function zy(j){if(j.length===0)return kn;let K=kn.subcommands.filter((re)=>re.usage.split(" ")[0]===j[0]);if(K.length===0)return null;if(j.length===1&&K.length>1)return{name:`rule ${j[0]}`,description:`Subcommands of rule ${j[0]}`,usage:`rule ${j[0]} <subcommand>`,subcommands:K,options:[]};let te=j.length===1?K[0]:K.find((re)=>re.usage.split(" ")[1]===j[1]);if(!te)return null;return{name:`rule ${j[0]}`,description:te.description,usage:`rule ${te.usage}`,options:j[0]==="add"?go:[],examples:j[0]==="add"?yo:void 0}}function Jy(j){let K=At({label:"rule",booleans:{global:["-g","--global"],check:["--check"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"]},lists:{only:["--only"]},positionals:"list"},j),te={...K.flags,ref:K.values.ref,only:K.lists.only??[],help:K.help,positionals:K.positionals,errors:K.errors};return Wy(te),te}function Wy(j){let[K]=j.positionals;if(K&&!Hd.has(K))j.errors.push(`Unknown rule subcommand: ${K}`);if(j.deleteSource&&K!=="remove")if(K&&Hd.has(K))j.errors.push(`Unknown option for rule ${K}: --delete-source`);else j.errors.push("--delete-source is only valid with 'rule remove'");if(j.check&&K)j.errors.push(Fn(K,"--check"));if(j.cleanup&&K!=="migrate")j.errors.push(Fn(K,"--cleanup"));if(j.example&&K!=="init")j.errors.push(Fn(K,"--example"));if(j.ref&&K!=="add")j.errors.push(Fn(K,"--ref"));if(j.only.length>0&&K!=="add")j.errors.push(Fn(K,"--only"));if(K==="add")Ky(j);if(K==="migrate"){if(j.global)j.errors.push(Fn(K,"--global"));if(j.positionals.length>1)j.errors.push(`Unexpected rule migrate argument: ${j.positionals[1]}`)}else if(K==="wrapper")Yy(j);else if(j.positionals.length>2)j.errors.push(`Unexpected rule argument: ${j.positionals[2]}`);if(K==="list"&&j.global)j.errors.push("Unknown option for rule list: --global")}function Gd(j){if(j.positionals[1])return j.positionals[1];if(j.ref||j.only.length>0)return qy;return}function Ky(j){let K=Gd(j);if(!K)return;if((j.ref||j.only.length>0)&&!Y(K)){if(j.ref)j.errors.push(`--ref can only select a ref for an owner/repo source: ${K}`);if(j.only.length>0)j.errors.push("--only can only select rulebooks from an owner/repo source");return}if(j.ref&&!ie(j.ref))j.errors.push(`--ref must use valid path segments: ${j.ref}`);let te=j.only.filter((re)=>!c.test(re));if(te.length>0)j.errors.push(`Invalid rulebook names: ${te.join(", ")}`)}function Fn(j,K){return j?`Unknown option for rule ${j}: ${K}`:`Unknown option for rule: ${K}`}function Yy(j){let K=j.positionals[1],te=j.positionals[2];if(!K){j.errors.push("rule wrapper requires add, remove, or list");return}if(!By.has(K)){j.errors.push(`Unknown rule wrapper action: ${K}`);return}if(K==="list"){if(te)j.errors.push(`Unexpected rule wrapper argument: ${te}`);return}if(!te){j.errors.push(`rule wrapper ${K} requires a command`);return}if(j.positionals.length>3)j.errors.push(`Unexpected rule wrapper argument: ${j.positionals[3]}`)}function Zy(j){if(r(j)===null){cd(j);return}let K=m(j);if(!K.config)return;It(j,{version:1,rules:K.config.rules,overrides:K.config.overrides??{},transparent_wrappers:K.config.transparent_wrappers??[]})}async function Xy(j,K){let te=K.positionals[1],re=K.positionals[2],oe=$t(j,{global:K.global}).configTarget;if(te==="list"){let xe=m(oe);if(xe.errors.length>0){for(let Ce of xe.errors)console.error(Ce);return 1}return Qy(xe.config?.transparent_wrappers??[]),0}if(!re||!L.test(re))return console.error("transparent wrapper must match command pattern"),1;if($e(re))return console.error(`reserved command "${re}" cannot be a wrapper`),1;let ce=m(oe);if(ce.errors.length>0){for(let xe of ce.errors)console.error(xe);return 1}let de=ce.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},we=te==="add"?[...new Set([...de.transparent_wrappers??[],re])]:(de.transparent_wrappers??[]).filter((xe)=>xe!==re);return It(oe,{version:1,rules:de.rules,overrides:de.overrides??{},transparent_wrappers:we}),console.log(te==="add"?`Added transparent wrapper: ${re}`:`Removed transparent wrapper: ${re}`),0}function Qy(j){if(j.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${j.length}):`);for(let K of j)console.log(`  - ${K}`)}import{sep as ih}from"node:path";import{existsSync as eh,readFileSync as th}from"node:fs";import{join as nh}from"node:path";async function rh(j){if(j.isTTY)return null;return(await Xe(j).catch(()=>null))?.trim()||null}function oh(j){let K=j.env.get("CLAUDE_SETTINGS_PATH");if(K)return K;return nh(j.home,".claude","settings.json")}function Mi(j){let K=oh(j);if(!eh(K))return!1;try{let te=th(K,"utf-8"),re=JSON.parse(te);if(!re.enabledPlugins)return!1;let oe="cc-safety-net@cc-marketplace";if(!(oe in re.enabledPlugins))return!1;return re.enabledPlugins[oe]===!0}catch(te){if(_(i.debug,j.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${K}: ${te instanceof Error?te.message:String(te)}`);return!1}}async function Hi(j,K=process.stdin){let te=Mi(j),re;if(!te)re="\uD83D\uDEE1️ CC Safety Net ❌";else{let ce=k(j,{cwd:process.cwd()}),de=ce.policy,we=P(de,j.env),xe=Object.values(B(de,we.capabilities)).some((Ne)=>Ne.changesInherited),Ce={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[xe?"custom":we.effectiveLevel],Se=(ce.policyScopes?.weakenings.length??0)>0?"\uD83D\uDD3B":"";re=`\uD83D\uDEE1️ CC Safety Net ${Ce}${we.worktreeMode?"\uD83C\uDF33":""}${Se}${ce.state==="degraded"?"⚠️":""}`}let oe=await rh(K);if(oe&&!oe.startsWith("{"))console.log(`${oe} | ${re}`);else console.log(re)}function Bd(j){let K=k(j,{cwd:process.cwd()}),te=K.policy,re=P(te,j.env),oe=!!process.env.NO_COLOR||!process.stdout.isTTY,ce=Math.min(process.stdout.columns||80,100),de=oe?"ok":"✔",we=oe?"OFF":"✘",xe=(it,gt)=>{let ht=`  ${it.padEnd(13)}${gt}`;return(ht.length>ce?`${ht.slice(0,ce-1)}…`:ht).replaceAll(we,bt.red(we))},Ce=Object.values(B(te,re.capabilities)).some((it)=>it.changesInherited),Se=(it)=>it===j.home||it.startsWith(`${j.home}${ih}`)?`~${it.slice(j.home.length)}`:it,Ne={ready:bt.green,degraded:bt.yellow}[K.state],He=K.policyScopes?.weakenings??[],at=[...Mi(j)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...K.diagnostics],mt=oe?"-":"·";console.log([`${oe?"":"\uD83D\uDEE1️  "}CC Safety Net — ${Ne(K.state)}`,"",xe("Protection",`destructive ${te.destructiveCommandProtectionEnabled?de:we}   secrets ${te.secretProtection.enabled?de:we}`),xe("Level",Ce?`${re.effectiveLevel} (customised)`:re.effectiveLevel),xe("Rules",te.rules.length===0?"none active":`${te.rules.length} active`),xe("Policy",Se(d(j))),...K.policyScopes?[xe("Project",Se(w(process.cwd())))]:[],...re.worktreeMode?[xe("Worktree","relaxations active")]:[],"",...He.length===0?[]:["  Project policy",...He.flatMap((it)=>Qn(it,"      ",ce-6).map((gt,ht)=>ht===0?`    ${gt}`:gt)),""],...at.length===0?["  Everything configured is active."]:["  Not active",...at.flatMap((it)=>Qn(it,"      ",ce-6).map((gt,ht)=>ht===0?`    ${mt} ${gt}`:gt)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as eu}from"node:child_process";import{randomBytes as gh}from"node:crypto";import{existsSync as yh}from"node:fs";import{createServer as hh}from"node:http";import{Writable as vh}from"node:stream";var uo=500;function sh(j){let K=j.filter((oe)=>oe.decision!=="allow"),te=j.filter((oe)=>oe.decision==="allow"),re=Math.min(K.length,Math.max(uo-te.length,Math.ceil(uo/2)));return[...K.slice(0,re),...te.slice(0,uo-re)]}function qd(j,K,te=M(j)){if(te)q(j,te);let re=(gt)=>new Date(gt.getFullYear(),gt.getMonth(),gt.getDate()).getTime(),oe=re(new Date),ce=new Date(oe);ce.setDate(ce.getDate()-(K-1));let de=ce.getTime(),we=[],xe={count:0};for(let gt of te?an(te,xe):[])for(let ht of wn(gt,xe)){if(!ht||typeof ht.ts!=="string"||typeof ht.command!=="string")continue;let vt=new Date(ht.ts).getTime();if(!Number.isFinite(vt))continue;if(vt>=de)we.push(ht)}we.sort((gt,ht)=>new Date(ht.ts).getTime()-new Date(gt.ts).getTime());let Ce=Array.from({length:K},()=>0),Se=Array.from({length:K},()=>0),Ne={},He={},at={},mt=0,it=0;for(let gt of we){let ht=gt.agent||"unknown";Ne[ht]=(Ne[ht]??0)+1;let vt=Math.round((oe-re(new Date(gt.ts)))/86400000),yt=K-1-vt,kt=vt>=0&&vt<K;if(kt)Se[yt]=(Se[yt]??0)+1;if(gt.decision!=="allow"){if(mt++,gt.ruleId)He[gt.ruleId]=(He[gt.ruleId]??0)+1;let Lt=dr(gt.segment||gt.command);if(Lt)at[Lt]=(at[Lt]??0)+1;if(gt.failureStage)it++;if(kt)Ce[yt]=(Ce[yt]??0)+1}}return{days:K,logsDir:te,homeDir:j.home,totalInWindow:we.length,truncated:we.length>uo,unreadable:xe.count,counts:{blocked:mt,allowed:we.length-mt,agents:Ne,blockedByDay:Ce,analyzedByDay:Se,rules:He,commands:at,errors:it},entries:sh(we).sort((gt,ht)=>new Date(ht.ts).getTime()-new Date(gt.ts).getTime())}}import{spawn as ah}from"node:child_process";import{existsSync as lh,statSync as Vd}from"node:fs";import{delimiter as ch,join as dh}from"node:path";var uh=120000,po="Choose the project folder",ph=`try
  return POSIX path of (choose folder with prompt "${po}")
on error number -128
  return ""
end try`,fh=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${po}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,zd=[{binary:"zenity",args:["--file-selection","--directory",`--title=${po}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",po]}],Jd=(j,K)=>(K.PATH??"").split(ch).some((te)=>{if(te.length===0)return!1;try{let re=Vd(dh(te,j));return re.isFile()&&(re.mode&73)!==0}catch{return!1}});function Ui(j,K){if(j==="darwin"||j==="win32")return!0;if(j!=="linux")return!1;if(!K.DISPLAY&&!K.WAYLAND_DISPLAY)return!1;return zd.some((te)=>Jd(te.binary,K))}function mh(j,K){if(j==="darwin")return{cmd:"osascript",args:["-e",ph]};if(j==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",fh]};let te=zd.find((re)=>Jd(re.binary,K));return te?{cmd:te.binary,args:te.args}:null}function Gi(j=process.platform,K=process.env){let te=mh(j,K);if(!te)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((re)=>{let oe=ah(te.cmd,te.args,{env:K,stdio:["ignore","pipe","pipe"]}),ce="",de=!1,we=(Ce)=>{if(de)return;de=!0,clearTimeout(xe),re(Ce)},xe=setTimeout(()=>{oe.kill(),we({error:"The folder dialog timed out"})},uh);oe.stdout.on("data",(Ce)=>{ce+=Ce.toString()}),oe.on("error",()=>we({error:`Could not open the folder dialog (${te.cmd})`})),oe.on("close",()=>{let Ce=ce.trim().replace(/\/+$/,"");if(!Ce)return we({cancelled:!0});if(!lh(Ce)||!Vd(Ce).isDirectory())return we({error:"That selection is not a folder on disk"});we({path:Ce})})})}var Wd=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CC Safety Net</title>
  <link rel="icon" href="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%0A%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221254%22%20height%3D%221254%22%20viewBox%3D%2254%2023%201140%201140%22%20role%3D%22img%22%20aria-label%3D%22Safety%20net%20logo%20mesh%20variant%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22spot-0%22%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23f8fafc%22%20stop-opacity%3D%220.68%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2256%25%22%20stop-color%3D%22%23f8fafc%22%20stop-opacity%3D%220.29%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23f8fafc%22%20stop-opacity%3D%220%22%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22spot-1%22%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%237dd3fc%22%20stop-opacity%3D%220.58%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2256%25%22%20stop-color%3D%22%237dd3fc%22%20stop-opacity%3D%220.24%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%237dd3fc%22%20stop-opacity%3D%220%22%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22spot-2%22%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%2364748b%22%20stop-opacity%3D%220.7%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2256%25%22%20stop-color%3D%22%2364748b%22%20stop-opacity%3D%220.29%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%2364748b%22%20stop-opacity%3D%220%22%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3CradialGradient%20id%3D%22spot-3%22%20cx%3D%2250%25%22%20cy%3D%2250%25%22%20r%3D%2250%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230f172a%22%20stop-opacity%3D%220.9%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2256%25%22%20stop-color%3D%22%230f172a%22%20stop-opacity%3D%220.38%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%230f172a%22%20stop-opacity%3D%220%22%2F%3E%0A%20%20%20%20%3C%2FradialGradient%3E%0A%20%20%20%20%3ClinearGradient%20id%3D%22edge%22%20x1%3D%2214%25%22%20y1%3D%228%25%22%20x2%3D%2288%25%22%20y2%3D%2294%25%22%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ffffff%22%20stop-opacity%3D%220.7%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23bae6fd%22%20stop-opacity%3D%220.24%22%2F%3E%0A%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231e293b%22%20stop-opacity%3D%220.86%22%2F%3E%0A%20%20%20%20%3C%2FlinearGradient%3E%0A%20%20%20%20%3Cmask%20id%3D%22net-mask%22%20maskUnits%3D%22userSpaceOnUse%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%221254%22%20height%3D%221254%22%20fill%3D%22black%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-46.32%22%20y%3D%22-47.38%22%20width%3D%2292.63%22%20height%3D%2294.75%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(628.75%20127.25)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-66.82%22%20y%3D%22-41.01%22%20width%3D%22133.64%22%20height%3D%2282.02%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(713.75%20230.25)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.95%22%20y%3D%22-134.00%22%20width%3D%2279.90%22%20height%3D%22267.99%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(588.00%20275.50)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.60%22%20y%3D%22-65.05%22%20width%3D%2279.20%22%20height%3D%22130.11%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(444.50%20320.50)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-133.29%22%20y%3D%22-40.31%22%20width%3D%22266.58%22%20height%3D%2280.61%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(759.75%20369.25)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-77.07%22%20y%3D%22-39.24%22%20width%3D%22154.15%22%20height%3D%2278.49%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(533.25%20407.25)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-67.10%22%20y%3D%22-39.74%22%20width%3D%22134.21%22%20height%3D%2279.48%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(895.22%20413.86)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.84%22%20y%3D%22-134.04%22%20width%3D%2279.68%22%20height%3D%22268.08%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(401.36%20461.24)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.60%22%20y%3D%22-74.60%22%20width%3D%2279.20%22%20height%3D%22149.20%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(812.25%20500.25)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.60%22%20y%3D%22-77.43%22%20width%3D%2279.20%22%20height%3D%22154.86%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(625.75%20500.75)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.24%22%20y%3D%22-67.18%22%20width%3D%2278.49%22%20height%3D%22134.35%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(263.25%20505.75)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-133.28%22%20y%3D%22-40.02%22%20width%3D%22266.56%22%20height%3D%2280.04%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(941.36%20551.76)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-54.80%22%20y%3D%22-53.74%22%20width%3D%22109.60%22%20height%3D%22107.48%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(1096.75%20593.25)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-77.43%22%20y%3D%22-40.31%22%20width%3D%22154.86%22%20height%3D%2280.61%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(719.75%20594.25)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-51.97%22%20y%3D%22-54.45%22%20width%3D%22103.94%22%20height%3D%22108.89%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(155.25%20594.75)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-76.37%22%20y%3D%22-40.31%22%20width%3D%22152.74%22%20height%3D%2280.61%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(534.50%20595.50)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-135.12%22%20y%3D%22-40.16%22%20width%3D%22270.23%22%20height%3D%2280.32%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(307.96%20634.94)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-40.02%22%20y%3D%22-70.64%22%20width%3D%2280.05%22%20height%3D%22141.27%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(989.66%20680.72)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-38.90%22%20y%3D%22-77.27%22%20width%3D%2277.80%22%20height%3D%22154.54%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(442.49%20687.00)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.95%22%20y%3D%22-77.43%22%20width%3D%2279.90%22%20height%3D%22154.86%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(628.50%20689.00)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.40%22%20y%3D%22-134.46%22%20width%3D%2278.80%22%20height%3D%22268.92%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(853.69%20727.31)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-69.65%22%20y%3D%22-38.18%22%20width%3D%22139.30%22%20height%3D%2276.37%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(353.25%20771.75)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-78.44%22%20y%3D%22-39.44%22%20width%3D%22156.88%22%20height%3D%2278.88%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(720.61%20782.02)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-133.77%22%20y%3D%22-39.86%22%20width%3D%22267.53%22%20height%3D%2279.71%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(493.85%20820.81)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.24%22%20y%3D%22-66.82%22%20width%3D%2278.49%22%20height%3D%22133.64%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(806.50%20868.00)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-40.02%22%20y%3D%22-133.39%22%20width%3D%2280.05%22%20height%3D%22266.79%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(666.35%20914.10)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-67.18%22%20y%3D%22-39.60%22%20width%3D%22134.35%22%20height%3D%2279.20%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(540.00%20960.00)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-49.85%22%20y%3D%22-49.50%22%20width%3D%2299.70%22%20height%3D%2298.99%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(627.25%201064.75)%20rotate(-45.00)%22%20fill%3D%22white%22%2F%3E%0A%20%20%20%20%3C%2Fmask%3E%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Cg%3E%0A%20%20%20%20%3Cg%20mask%3D%22url(%23net-mask)%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%221254%22%20height%3D%221254%22%20fill%3D%22%2307090d%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%22360%22%20cy%3D%22240%22%20r%3D%22430%22%20fill%3D%22url(%23spot-0)%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%22820%22%20cy%3D%22300%22%20r%3D%22430%22%20fill%3D%22url(%23spot-1)%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%22760%22%20cy%3D%22830%22%20r%3D%22500%22%20fill%3D%22url(%23spot-2)%22%2F%3E%0A%20%20%20%20%20%20%3Ccircle%20cx%3D%22300%22%20cy%3D%22780%22%20r%3D%22390%22%20fill%3D%22url(%23spot-3)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%221254%22%20height%3D%221254%22%20fill%3D%22url(%23edge)%22%20opacity%3D%220.18%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20stroke%3D%22url(%23edge)%22%20stroke-width%3D%2214%22%20stroke-linejoin%3D%22round%22%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-46.32%22%20y%3D%22-47.38%22%20width%3D%2292.63%22%20height%3D%2294.75%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(628.75%20127.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-66.82%22%20y%3D%22-41.01%22%20width%3D%22133.64%22%20height%3D%2282.02%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(713.75%20230.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.95%22%20y%3D%22-134.00%22%20width%3D%2279.90%22%20height%3D%22267.99%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(588.00%20275.50)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.60%22%20y%3D%22-65.05%22%20width%3D%2279.20%22%20height%3D%22130.11%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(444.50%20320.50)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-133.29%22%20y%3D%22-40.31%22%20width%3D%22266.58%22%20height%3D%2280.61%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(759.75%20369.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-77.07%22%20y%3D%22-39.24%22%20width%3D%22154.15%22%20height%3D%2278.49%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(533.25%20407.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-67.10%22%20y%3D%22-39.74%22%20width%3D%22134.21%22%20height%3D%2279.48%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(895.22%20413.86)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.84%22%20y%3D%22-134.04%22%20width%3D%2279.68%22%20height%3D%22268.08%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(401.36%20461.24)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.60%22%20y%3D%22-74.60%22%20width%3D%2279.20%22%20height%3D%22149.20%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(812.25%20500.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.60%22%20y%3D%22-77.43%22%20width%3D%2279.20%22%20height%3D%22154.86%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(625.75%20500.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.24%22%20y%3D%22-67.18%22%20width%3D%2278.49%22%20height%3D%22134.35%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(263.25%20505.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-133.28%22%20y%3D%22-40.02%22%20width%3D%22266.56%22%20height%3D%2280.04%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(941.36%20551.76)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-54.80%22%20y%3D%22-53.74%22%20width%3D%22109.60%22%20height%3D%22107.48%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(1096.75%20593.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-77.43%22%20y%3D%22-40.31%22%20width%3D%22154.86%22%20height%3D%2280.61%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(719.75%20594.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-51.97%22%20y%3D%22-54.45%22%20width%3D%22103.94%22%20height%3D%22108.89%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(155.25%20594.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-76.37%22%20y%3D%22-40.31%22%20width%3D%22152.74%22%20height%3D%2280.61%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(534.50%20595.50)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-135.12%22%20y%3D%22-40.16%22%20width%3D%22270.23%22%20height%3D%2280.32%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(307.96%20634.94)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-40.02%22%20y%3D%22-70.64%22%20width%3D%2280.05%22%20height%3D%22141.27%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(989.66%20680.72)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-38.90%22%20y%3D%22-77.27%22%20width%3D%2277.80%22%20height%3D%22154.54%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(442.49%20687.00)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.95%22%20y%3D%22-77.43%22%20width%3D%2279.90%22%20height%3D%22154.86%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(628.50%20689.00)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.40%22%20y%3D%22-134.46%22%20width%3D%2278.80%22%20height%3D%22268.92%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(853.69%20727.31)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-69.65%22%20y%3D%22-38.18%22%20width%3D%22139.30%22%20height%3D%2276.37%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(353.25%20771.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-78.44%22%20y%3D%22-39.44%22%20width%3D%22156.88%22%20height%3D%2278.88%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(720.61%20782.02)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-133.77%22%20y%3D%22-39.86%22%20width%3D%22267.53%22%20height%3D%2279.71%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(493.85%20820.81)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.24%22%20y%3D%22-66.82%22%20width%3D%2278.49%22%20height%3D%22133.64%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(806.50%20868.00)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-40.02%22%20y%3D%22-133.39%22%20width%3D%2280.05%22%20height%3D%22266.79%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(666.35%20914.10)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-67.18%22%20y%3D%22-39.60%22%20width%3D%22134.35%22%20height%3D%2279.20%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(540.00%20960.00)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-49.85%22%20y%3D%22-49.50%22%20width%3D%2299.70%22%20height%3D%2298.99%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(627.25%201064.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3Cg%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-opacity%3D%220.2%22%20stroke-width%3D%225%22%20stroke-linejoin%3D%22round%22%20transform%3D%22translate(-10%20-14)%22%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-46.32%22%20y%3D%22-47.38%22%20width%3D%2292.63%22%20height%3D%2294.75%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(628.75%20127.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-66.82%22%20y%3D%22-41.01%22%20width%3D%22133.64%22%20height%3D%2282.02%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(713.75%20230.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.95%22%20y%3D%22-134.00%22%20width%3D%2279.90%22%20height%3D%22267.99%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(588.00%20275.50)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.60%22%20y%3D%22-65.05%22%20width%3D%2279.20%22%20height%3D%22130.11%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(444.50%20320.50)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-133.29%22%20y%3D%22-40.31%22%20width%3D%22266.58%22%20height%3D%2280.61%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(759.75%20369.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-77.07%22%20y%3D%22-39.24%22%20width%3D%22154.15%22%20height%3D%2278.49%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(533.25%20407.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-67.10%22%20y%3D%22-39.74%22%20width%3D%22134.21%22%20height%3D%2279.48%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(895.22%20413.86)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.84%22%20y%3D%22-134.04%22%20width%3D%2279.68%22%20height%3D%22268.08%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(401.36%20461.24)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.60%22%20y%3D%22-74.60%22%20width%3D%2279.20%22%20height%3D%22149.20%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(812.25%20500.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.60%22%20y%3D%22-77.43%22%20width%3D%2279.20%22%20height%3D%22154.86%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(625.75%20500.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.24%22%20y%3D%22-67.18%22%20width%3D%2278.49%22%20height%3D%22134.35%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(263.25%20505.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-133.28%22%20y%3D%22-40.02%22%20width%3D%22266.56%22%20height%3D%2280.04%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(941.36%20551.76)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-54.80%22%20y%3D%22-53.74%22%20width%3D%22109.60%22%20height%3D%22107.48%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(1096.75%20593.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-77.43%22%20y%3D%22-40.31%22%20width%3D%22154.86%22%20height%3D%2280.61%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(719.75%20594.25)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-51.97%22%20y%3D%22-54.45%22%20width%3D%22103.94%22%20height%3D%22108.89%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(155.25%20594.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-76.37%22%20y%3D%22-40.31%22%20width%3D%22152.74%22%20height%3D%2280.61%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(534.50%20595.50)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-135.12%22%20y%3D%22-40.16%22%20width%3D%22270.23%22%20height%3D%2280.32%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(307.96%20634.94)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-40.02%22%20y%3D%22-70.64%22%20width%3D%2280.05%22%20height%3D%22141.27%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(989.66%20680.72)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-38.90%22%20y%3D%22-77.27%22%20width%3D%2277.80%22%20height%3D%22154.54%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(442.49%20687.00)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.95%22%20y%3D%22-77.43%22%20width%3D%2279.90%22%20height%3D%22154.86%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(628.50%20689.00)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.40%22%20y%3D%22-134.46%22%20width%3D%2278.80%22%20height%3D%22268.92%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(853.69%20727.31)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-69.65%22%20y%3D%22-38.18%22%20width%3D%22139.30%22%20height%3D%2276.37%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(353.25%20771.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-78.44%22%20y%3D%22-39.44%22%20width%3D%22156.88%22%20height%3D%2278.88%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(720.61%20782.02)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-133.77%22%20y%3D%22-39.86%22%20width%3D%22267.53%22%20height%3D%2279.71%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(493.85%20820.81)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-39.24%22%20y%3D%22-66.82%22%20width%3D%2278.49%22%20height%3D%22133.64%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(806.50%20868.00)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-40.02%22%20y%3D%22-133.39%22%20width%3D%2280.05%22%20height%3D%22266.79%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(666.35%20914.10)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-67.18%22%20y%3D%22-39.60%22%20width%3D%22134.35%22%20height%3D%2279.20%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(540.00%20960.00)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%20%20%3Crect%20x%3D%22-49.85%22%20y%3D%22-49.50%22%20width%3D%2299.70%22%20height%3D%2298.99%22%20rx%3D%2212.00%22%20ry%3D%2212.00%22%20transform%3D%22translate(627.25%201064.75)%20rotate(-45.00)%22%2F%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A">
  <script>
    (() => {
      const stored = localStorage.getItem('cc-safety-net-theme');
      if (stored === 'light' || stored === 'dark') document.documentElement.style.colorScheme = stored;
    })();
  </script>
  <style>
:root {
  color-scheme: light dark;

  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
  color: var(--ink);
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

.sidenav a[aria-current="page"] {
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
input[type="checkbox"]:not(:disabled),
input[type="radio"]:not(:disabled) {
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
    "value spark"
    "label spark";
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

button.chip[aria-pressed="true"] {
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

.panel-toggle[aria-expanded="false"] .panel-chevron,
:is(.rule-tier-head, .tier-collapse)[aria-expanded="false"] .panel-chevron {
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

:is(label.row, .rule-control) input[type="checkbox"] {
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

:is(label.row, .rule-control) input[type="checkbox"]::before {
  content: "";
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

:is(label.row, .rule-control) input[type="checkbox"]:checked {
  background: var(--accent);
  border-color: var(--accent);
}

:is(label.row, .rule-control) input[type="checkbox"]:checked::before {
  transform: translateX(14px);
}

:is(label.row, .rule-control):hover input[type="checkbox"]:not(:checked) {
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
  content: "";
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
  content: "";
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
  content: "";
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

label.row.master input[type="checkbox"] {
  margin: 0;
  width: 44px;
  height: 24px;
}

label.row.master input[type="checkbox"]:checked {
  background: var(--master);
  border-color: var(--master);
}

label.row.master input[type="checkbox"]::before {
  width: 18px;
  height: 18px;
}

label.row.master input[type="checkbox"]:checked::before {
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

input[type="search"],
input[type="text"],
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

input[type="search"]:hover,
input[type="text"]:hover,
textarea:hover {
  border-color: var(--muted);
}

input[type="search"]:focus,
input[type="text"]:focus,
textarea:focus {
  border-color: var(--muted);
  outline: none;
}

input[type="text"]:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.tester-row {
  display: flex;
  gap: 8px;
}

.tester-row input[type="text"] {
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

.paths-add input[type="text"] {
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
    /* biome-ignore lint/complexity/noImportantStyles: reduced-motion must win over every class-level transition */
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
  body[data-view="overview"] main,
  body[data-view="overview"] .topbar-row {
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
        <h1 class="brand-logo"><a class="brand-home" href="#overview" title="Overview"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 512" role="img" aria-label="CC Safety Net">
  <path d="M 1439 165 L 1411 165 L 1409 166 L 1408 168 L 1403 173 L 1403 174 L 1398 179 L 1398 180 L 1395 183 L 1394 183 L 1394 184 L 1385 194 L 1385 195 L 1381 199 L 1381 200 L 1378 202 L 1378 203 L 1374 207 L 1374 208 L 1367 215 L 1367 216 L 1358 226 L 1358 227 L 1352 233 L 1352 234 L 1347 239 L 1347 240 L 1341 246 L 1341 247 L 1336 252 L 1336 253 L 1332 257 L 1332 258 L 1325 265 L 1325 266 L 1319 272 L 1319 273 L 1314 278 L 1314 279 L 1309 284 L 1309 285 L 1303 291 L 1303 292 L 1299 296 L 1299 297 L 1294 302 L 1291 299 L 1290 300 L 1290 301 L 1293 301 L 1294 302 L 1288 309 L 1287 308 L 1288 309 L 1286 312 L 1285 311 L 1285 306 L 1286 305 L 1286 303 L 1288 299 L 1288 296 L 1289 295 L 1289 292 L 1290 291 L 1290 287 L 1291 286 L 1291 284 L 1293 280 L 1293 277 L 1294 276 L 1294 272 L 1295 271 L 1295 269 L 1297 265 L 1297 262 L 1298 261 L 1298 258 L 1299 257 L 1299 253 L 1300 252 L 1300 250 L 1301 249 L 1301 247 L 1303 243 L 1303 238 L 1304 237 L 1304 235 L 1305 234 L 1305 232 L 1307 228 L 1307 224 L 1308 223 L 1308 221 L 1309 220 L 1309 217 L 1310 216 L 1310 214 L 1312 210 L 1312 205 L 1314 202 L 1314 199 L 1316 195 L 1317 188 L 1318 187 L 1318 185 L 1319 184 L 1319 182 L 1321 178 L 1321 173 L 1323 169 L 1323 166 L 1296 166 L 1296 168 L 1294 171 L 1294 174 L 1293 175 L 1293 178 L 1292 179 L 1291 186 L 1290 187 L 1290 189 L 1289 190 L 1289 192 L 1287 196 L 1287 200 L 1285 204 L 1285 207 L 1283 211 L 1283 215 L 1282 216 L 1282 218 L 1281 219 L 1281 222 L 1279 226 L 1279 229 L 1278 230 L 1278 234 L 1277 235 L 1277 237 L 1276 238 L 1276 240 L 1274 244 L 1274 249 L 1273 250 L 1273 252 L 1271 256 L 1271 259 L 1270 260 L 1270 263 L 1269 264 L 1269 268 L 1268 269 L 1268 271 L 1266 275 L 1266 278 L 1265 279 L 1265 284 L 1264 285 L 1264 287 L 1262 291 L 1262 294 L 1261 295 L 1261 298 L 1260 299 L 1259 306 L 1258 307 L 1258 309 L 1257 310 L 1257 313 L 1256 314 L 1256 318 L 1254 322 L 1254 325 L 1273 325 L 1274 327 L 1273 328 L 1272 327 L 1273 328 L 1269 332 L 1269 333 L 1265 337 L 1265 338 L 1261 341 L 1261 342 L 1252 352 L 1252 353 L 1247 358 L 1247 359 L 1242 364 L 1242 365 L 1239 367 L 1239 368 L 1224 385 L 1224 386 L 1220 390 L 1220 391 L 1216 395 L 1216 396 L 1214 397 L 1214 399 L 1247 399 L 1249 397 L 1249 396 L 1259 385 L 1259 384 L 1263 380 L 1263 379 L 1265 377 L 1266 377 L 1266 376 L 1271 371 L 1271 370 L 1278 363 L 1278 362 L 1283 357 L 1283 356 L 1294 344 L 1294 343 L 1298 339 L 1298 338 L 1305 331 L 1305 330 L 1309 326 L 1309 325 L 1312 323 L 1313 320 L 1315 319 L 1316 317 L 1321 312 L 1322 312 L 1321 311 L 1330 301 L 1330 300 L 1335 295 L 1335 294 L 1337 292 L 1338 292 L 1339 289 L 1342 287 L 1342 286 L 1346 282 L 1346 281 L 1352 275 L 1352 274 L 1361 264 L 1361 263 L 1370 253 L 1370 252 L 1375 247 L 1375 246 L 1380 241 L 1380 240 L 1387 233 L 1387 232 L 1402 215 L 1402 214 L 1406 210 L 1406 209 L 1408 207 L 1409 207 L 1409 206 L 1413 202 L 1413 201 L 1418 196 L 1418 195 L 1422 191 L 1422 190 L 1427 185 L 1427 184 L 1431 180 L 1431 179 L 1440 169 L 1441 167 Z
M 1129 179 L 1126 178 L 1125 176 L 1124 176 L 1116 170 L 1114 170 L 1107 166 L 1105 166 L 1104 165 L 1101 165 L 1100 164 L 1096 164 L 1095 163 L 1091 163 L 1090 162 L 1081 162 L 1080 161 L 1076 161 L 1075 162 L 1066 162 L 1065 163 L 1061 163 L 1060 164 L 1057 164 L 1056 165 L 1051 165 L 1050 166 L 1045 167 L 1040 170 L 1038 170 L 1028 175 L 1023 179 L 1021 179 L 1017 183 L 1016 183 L 1012 187 L 1011 187 L 999 199 L 999 200 L 996 203 L 996 204 L 994 205 L 993 208 L 990 211 L 981 229 L 981 231 L 980 232 L 980 234 L 979 235 L 979 237 L 977 241 L 977 244 L 976 245 L 976 254 L 975 255 L 975 265 L 976 266 L 976 273 L 977 274 L 977 277 L 980 283 L 981 288 L 984 292 L 985 295 L 988 298 L 989 301 L 998 310 L 1001 311 L 1004 314 L 1007 315 L 1009 317 L 1013 319 L 1015 319 L 1018 321 L 1020 321 L 1024 323 L 1027 323 L 1028 324 L 1035 324 L 1036 325 L 1054 325 L 1055 324 L 1062 324 L 1063 323 L 1067 323 L 1068 322 L 1071 322 L 1077 319 L 1080 319 L 1087 315 L 1089 315 L 1093 313 L 1095 311 L 1098 310 L 1103 306 L 1106 305 L 1116 296 L 1117 296 L 1115 292 L 1113 290 L 1112 290 L 1111 288 L 1109 286 L 1108 286 L 1107 284 L 1100 278 L 1098 279 L 1090 286 L 1089 286 L 1086 289 L 1074 295 L 1072 295 L 1068 297 L 1065 297 L 1064 298 L 1061 298 L 1060 299 L 1041 299 L 1040 298 L 1037 298 L 1036 297 L 1031 296 L 1028 294 L 1026 294 L 1024 292 L 1020 290 L 1010 280 L 1008 275 L 1006 273 L 1005 271 L 1005 268 L 1004 267 L 1004 264 L 1003 263 L 1003 248 L 1004 247 L 1005 238 L 1008 233 L 1008 231 L 1010 227 L 1012 225 L 1013 222 L 1018 216 L 1018 215 L 1030 203 L 1031 203 L 1044 194 L 1046 194 L 1053 190 L 1056 190 L 1057 189 L 1060 189 L 1061 188 L 1064 188 L 1065 187 L 1071 187 L 1072 186 L 1076 186 L 1077 187 L 1083 187 L 1084 188 L 1087 188 L 1088 189 L 1090 189 L 1091 190 L 1096 191 L 1100 194 L 1103 195 L 1106 198 L 1107 198 L 1109 200 L 1109 201 L 1114 206 L 1114 207 L 1116 209 L 1118 213 L 1118 216 L 1120 220 L 1120 225 L 1116 227 L 1111 227 L 1110 228 L 1103 228 L 1102 229 L 1097 229 L 1096 230 L 1091 230 L 1090 231 L 1086 231 L 1085 232 L 1077 232 L 1076 233 L 1072 233 L 1071 234 L 1066 234 L 1065 235 L 1061 235 L 1060 236 L 1053 236 L 1052 237 L 1047 237 L 1047 240 L 1046 241 L 1046 243 L 1045 244 L 1045 247 L 1044 248 L 1044 250 L 1043 251 L 1043 254 L 1042 255 L 1042 260 L 1041 261 L 1041 263 L 1044 263 L 1045 262 L 1050 262 L 1051 261 L 1058 261 L 1059 260 L 1063 260 L 1064 259 L 1068 259 L 1069 258 L 1073 258 L 1074 257 L 1080 257 L 1081 256 L 1086 256 L 1087 255 L 1092 255 L 1093 254 L 1097 254 L 1098 253 L 1103 253 L 1104 252 L 1111 252 L 1112 251 L 1116 251 L 1117 250 L 1121 250 L 1122 249 L 1126 249 L 1127 248 L 1133 248 L 1134 247 L 1139 247 L 1140 246 L 1144 246 L 1146 243 L 1146 240 L 1147 239 L 1147 231 L 1148 230 L 1148 220 L 1147 219 L 1147 211 L 1146 210 L 1146 207 L 1144 204 L 1144 202 L 1143 201 L 1143 199 L 1141 195 L 1139 193 L 1138 190 L 1134 186 L 1133 183 L 1132 183 L 1129 180 Z
M 1779 171 L 1767 165 L 1765 165 L 1764 164 L 1762 164 L 1758 162 L 1755 162 L 1754 161 L 1747 161 L 1746 160 L 1729 160 L 1728 161 L 1722 161 L 1721 162 L 1718 162 L 1717 163 L 1715 163 L 1711 165 L 1707 165 L 1687 175 L 1685 177 L 1681 179 L 1672 187 L 1671 187 L 1661 197 L 1661 198 L 1657 202 L 1657 203 L 1652 209 L 1651 212 L 1649 214 L 1644 224 L 1643 229 L 1640 235 L 1640 238 L 1639 239 L 1639 244 L 1638 245 L 1638 250 L 1637 251 L 1637 267 L 1638 268 L 1638 273 L 1639 274 L 1639 278 L 1640 279 L 1640 282 L 1648 298 L 1652 302 L 1652 303 L 1655 306 L 1657 307 L 1657 308 L 1659 310 L 1660 310 L 1663 313 L 1669 316 L 1671 318 L 1673 319 L 1675 319 L 1676 320 L 1678 320 L 1684 323 L 1688 323 L 1689 324 L 1696 324 L 1697 325 L 1715 325 L 1716 324 L 1723 324 L 1724 323 L 1728 323 L 1729 322 L 1732 322 L 1738 319 L 1741 319 L 1748 315 L 1750 315 L 1754 313 L 1758 310 L 1759 311 L 1760 309 L 1761 309 L 1764 306 L 1765 306 L 1771 301 L 1772 301 L 1778 295 L 1761 278 L 1760 278 L 1756 282 L 1755 282 L 1751 286 L 1750 286 L 1745 290 L 1737 294 L 1732 295 L 1729 297 L 1726 297 L 1725 298 L 1721 298 L 1720 299 L 1703 299 L 1702 298 L 1698 298 L 1697 297 L 1692 296 L 1684 292 L 1682 290 L 1681 290 L 1673 282 L 1671 278 L 1668 275 L 1668 273 L 1667 272 L 1667 270 L 1666 269 L 1666 267 L 1664 263 L 1664 246 L 1665 245 L 1665 242 L 1666 241 L 1666 239 L 1668 235 L 1668 232 L 1670 228 L 1672 226 L 1673 224 L 1673 222 L 1680 214 L 1680 213 L 1690 203 L 1691 203 L 1694 200 L 1695 200 L 1700 196 L 1712 190 L 1715 190 L 1716 189 L 1718 189 L 1722 187 L 1725 187 L 1726 186 L 1744 186 L 1745 187 L 1747 187 L 1748 188 L 1750 188 L 1751 189 L 1756 190 L 1758 191 L 1761 194 L 1764 195 L 1773 204 L 1773 205 L 1777 210 L 1777 212 L 1778 213 L 1778 215 L 1780 219 L 1780 223 L 1781 225 L 1780 226 L 1775 226 L 1774 227 L 1768 227 L 1767 228 L 1759 228 L 1758 229 L 1753 229 L 1752 230 L 1747 230 L 1746 231 L 1742 231 L 1741 232 L 1733 232 L 1732 233 L 1727 233 L 1726 234 L 1722 234 L 1721 235 L 1717 235 L 1716 236 L 1709 236 L 1707 238 L 1707 241 L 1706 242 L 1706 246 L 1705 247 L 1705 250 L 1703 254 L 1703 258 L 1702 259 L 1702 262 L 1706 262 L 1707 261 L 1714 261 L 1715 260 L 1724 259 L 1725 258 L 1728 258 L 1729 257 L 1735 257 L 1736 256 L 1742 256 L 1743 255 L 1747 255 L 1748 254 L 1752 254 L 1753 253 L 1757 253 L 1758 252 L 1765 252 L 1766 251 L 1771 251 L 1772 250 L 1776 250 L 1777 249 L 1781 249 L 1782 248 L 1789 248 L 1790 247 L 1794 247 L 1795 246 L 1804 245 L 1805 243 L 1805 240 L 1806 239 L 1807 240 L 1807 243 L 1809 244 L 1809 241 L 1808 241 L 1806 238 L 1806 232 L 1807 231 L 1807 217 L 1806 216 L 1806 210 L 1805 209 L 1805 206 L 1802 200 L 1802 198 L 1800 194 L 1798 192 L 1797 189 L 1790 181 L 1790 180 L 1788 179 Z
M 714 187 L 712 189 L 712 190 L 708 193 L 708 194 L 704 198 L 704 199 L 700 203 L 700 204 L 695 210 L 695 212 L 693 214 L 690 220 L 690 222 L 686 229 L 686 233 L 684 237 L 684 240 L 683 241 L 683 245 L 682 246 L 682 268 L 683 269 L 683 273 L 684 274 L 684 276 L 686 280 L 686 283 L 692 295 L 699 303 L 699 304 L 701 306 L 702 306 L 704 308 L 704 309 L 707 310 L 711 314 L 716 316 L 718 318 L 720 319 L 722 319 L 725 321 L 730 322 L 731 323 L 734 323 L 735 324 L 740 324 L 741 325 L 749 325 L 750 326 L 759 326 L 760 325 L 767 325 L 768 324 L 775 324 L 776 323 L 780 323 L 788 319 L 791 319 L 792 318 L 794 318 L 798 315 L 800 315 L 810 309 L 812 310 L 812 313 L 811 314 L 811 319 L 810 320 L 809 325 L 836 325 L 839 319 L 839 316 L 840 315 L 840 310 L 841 309 L 841 307 L 842 306 L 842 303 L 844 299 L 844 295 L 845 294 L 846 287 L 847 286 L 847 284 L 849 280 L 849 275 L 850 274 L 850 271 L 851 270 L 851 268 L 853 264 L 854 255 L 855 254 L 855 252 L 856 251 L 856 248 L 857 247 L 857 244 L 858 243 L 858 217 L 857 216 L 857 212 L 854 206 L 853 201 L 851 197 L 849 195 L 849 193 L 846 190 L 844 186 L 835 177 L 834 177 L 831 174 L 830 174 L 825 170 L 823 170 L 814 165 L 811 165 L 808 163 L 805 163 L 804 162 L 800 162 L 799 161 L 793 161 L 792 160 L 773 160 L 772 161 L 765 161 L 764 162 L 757 163 L 753 165 L 750 165 L 743 169 L 741 169 L 735 172 L 733 174 L 730 175 L 728 177 L 724 179 L 715 187 Z
M 806 192 L 808 194 L 811 195 L 815 199 L 816 199 L 822 206 L 822 207 L 824 209 L 827 215 L 827 217 L 829 221 L 829 226 L 830 227 L 830 240 L 829 241 L 829 246 L 828 247 L 828 250 L 827 251 L 827 253 L 825 256 L 825 258 L 823 262 L 821 264 L 820 267 L 817 270 L 817 271 L 808 281 L 807 281 L 803 285 L 799 287 L 796 290 L 794 290 L 788 294 L 786 294 L 785 295 L 783 295 L 782 296 L 780 296 L 776 298 L 773 298 L 772 299 L 748 299 L 747 298 L 744 298 L 743 297 L 738 296 L 735 294 L 733 294 L 731 292 L 727 290 L 717 280 L 717 279 L 715 277 L 712 271 L 712 269 L 710 265 L 710 262 L 709 261 L 709 245 L 710 244 L 710 240 L 711 239 L 711 237 L 712 236 L 713 231 L 717 223 L 719 221 L 720 218 L 724 214 L 724 213 L 734 203 L 735 203 L 739 199 L 742 198 L 744 196 L 756 190 L 758 190 L 762 188 L 765 188 L 766 187 L 769 187 L 770 186 L 788 186 L 789 187 L 792 187 L 796 189 L 799 189 L 800 190 L 802 190 Z
M 1192 121 L 1190 122 L 1190 124 L 1189 125 L 1189 129 L 1188 130 L 1188 132 L 1186 136 L 1186 139 L 1185 140 L 1184 147 L 1183 148 L 1183 150 L 1181 154 L 1181 157 L 1180 158 L 1180 162 L 1179 163 L 1179 165 L 1178 166 L 1178 168 L 1176 172 L 1176 176 L 1175 177 L 1175 179 L 1173 183 L 1173 186 L 1172 187 L 1171 194 L 1170 195 L 1170 197 L 1168 201 L 1168 204 L 1167 205 L 1167 209 L 1166 210 L 1166 212 L 1164 216 L 1164 219 L 1163 220 L 1162 227 L 1160 231 L 1160 234 L 1159 235 L 1158 242 L 1157 243 L 1157 245 L 1155 249 L 1155 252 L 1154 253 L 1154 259 L 1153 260 L 1153 276 L 1154 277 L 1154 282 L 1155 283 L 1155 286 L 1158 292 L 1158 294 L 1161 298 L 1162 301 L 1173 313 L 1174 313 L 1182 319 L 1184 319 L 1189 322 L 1191 322 L 1195 324 L 1199 324 L 1200 325 L 1236 325 L 1236 323 L 1237 322 L 1237 319 L 1238 318 L 1238 315 L 1239 314 L 1239 311 L 1240 310 L 1240 307 L 1241 306 L 1241 303 L 1242 302 L 1242 300 L 1241 299 L 1209 299 L 1208 298 L 1205 298 L 1195 293 L 1187 285 L 1186 282 L 1183 278 L 1183 275 L 1182 274 L 1182 271 L 1181 270 L 1181 257 L 1182 256 L 1182 253 L 1183 252 L 1183 248 L 1184 247 L 1184 245 L 1186 241 L 1186 238 L 1187 237 L 1187 233 L 1188 232 L 1188 230 L 1189 229 L 1189 227 L 1191 223 L 1191 220 L 1192 219 L 1192 215 L 1193 214 L 1193 211 L 1195 207 L 1195 204 L 1196 203 L 1196 199 L 1197 198 L 1197 195 L 1198 194 L 1198 192 L 1200 190 L 1278 190 L 1279 189 L 1279 187 L 1281 183 L 1281 180 L 1282 179 L 1282 177 L 1283 176 L 1283 174 L 1285 170 L 1285 166 L 1286 165 L 1285 164 L 1269 164 L 1268 165 L 1239 165 L 1238 164 L 1221 164 L 1220 165 L 1210 165 L 1209 164 L 1207 164 L 1206 163 L 1207 162 L 1207 159 L 1209 155 L 1209 152 L 1210 151 L 1210 147 L 1211 146 L 1211 144 L 1213 140 L 1214 133 L 1216 129 L 1217 122 L 1216 121 Z
M 997 121 L 978 121 L 977 122 L 960 122 L 959 123 L 952 124 L 948 126 L 945 126 L 938 130 L 936 130 L 931 134 L 928 135 L 925 138 L 922 139 L 917 144 L 916 144 L 907 153 L 907 154 L 903 158 L 903 159 L 897 166 L 888 184 L 888 186 L 886 190 L 886 193 L 884 197 L 884 200 L 882 204 L 882 209 L 881 210 L 881 213 L 880 214 L 880 216 L 878 220 L 878 224 L 877 225 L 876 232 L 875 233 L 875 235 L 873 239 L 873 244 L 871 248 L 871 251 L 869 255 L 869 259 L 868 260 L 868 263 L 867 264 L 867 266 L 866 267 L 866 270 L 864 274 L 864 279 L 863 280 L 863 282 L 862 283 L 862 285 L 860 289 L 860 294 L 859 295 L 859 298 L 857 301 L 857 304 L 856 305 L 856 308 L 855 309 L 855 313 L 854 314 L 854 316 L 853 317 L 853 320 L 851 324 L 852 325 L 878 325 L 879 324 L 879 322 L 880 321 L 880 317 L 881 316 L 881 314 L 883 310 L 883 307 L 884 306 L 885 299 L 887 295 L 887 292 L 888 291 L 889 284 L 891 280 L 891 277 L 892 276 L 892 273 L 893 272 L 894 265 L 896 261 L 896 258 L 897 257 L 897 254 L 898 253 L 898 249 L 899 248 L 899 246 L 901 242 L 901 239 L 902 238 L 903 231 L 905 227 L 905 224 L 906 223 L 906 219 L 907 218 L 908 211 L 910 207 L 910 204 L 911 203 L 911 199 L 912 198 L 912 196 L 914 194 L 980 194 L 982 192 L 982 188 L 983 187 L 984 180 L 986 176 L 986 173 L 988 172 L 987 170 L 987 168 L 930 168 L 929 167 L 937 159 L 938 159 L 941 156 L 942 156 L 944 154 L 946 154 L 948 152 L 952 150 L 955 150 L 956 149 L 959 149 L 960 148 L 964 148 L 965 147 L 992 147 L 993 146 L 993 144 L 995 140 L 995 136 L 996 135 L 996 130 L 998 126 L 998 122 Z
M 1844 120 L 1842 124 L 1842 127 L 1841 128 L 1841 131 L 1840 132 L 1840 136 L 1839 137 L 1839 140 L 1838 141 L 1838 144 L 1837 145 L 1837 149 L 1835 153 L 1835 157 L 1834 158 L 1834 161 L 1832 165 L 1832 168 L 1831 169 L 1831 173 L 1830 174 L 1830 177 L 1828 181 L 1828 184 L 1827 185 L 1827 188 L 1826 189 L 1826 193 L 1824 197 L 1824 200 L 1823 201 L 1823 204 L 1822 205 L 1822 209 L 1821 210 L 1821 213 L 1820 214 L 1820 216 L 1819 217 L 1819 220 L 1818 221 L 1818 224 L 1817 225 L 1817 230 L 1815 234 L 1815 237 L 1813 241 L 1813 245 L 1812 246 L 1812 249 L 1811 250 L 1811 253 L 1810 254 L 1810 259 L 1809 260 L 1809 275 L 1810 276 L 1810 280 L 1811 281 L 1811 284 L 1812 285 L 1812 287 L 1813 288 L 1814 293 L 1817 297 L 1818 300 L 1821 303 L 1821 304 L 1831 314 L 1834 315 L 1839 319 L 1841 319 L 1849 323 L 1852 323 L 1853 324 L 1858 324 L 1859 325 L 1890 325 L 1891 324 L 1891 321 L 1892 320 L 1892 317 L 1893 316 L 1893 313 L 1894 312 L 1894 309 L 1895 308 L 1896 299 L 1865 299 L 1864 298 L 1861 298 L 1854 294 L 1852 294 L 1848 290 L 1847 290 L 1846 288 L 1842 284 L 1841 281 L 1839 279 L 1837 275 L 1837 270 L 1836 269 L 1836 258 L 1837 257 L 1837 250 L 1838 249 L 1838 246 L 1840 242 L 1840 239 L 1841 238 L 1841 235 L 1842 234 L 1842 230 L 1844 226 L 1844 223 L 1845 222 L 1845 219 L 1846 218 L 1846 214 L 1847 213 L 1847 210 L 1848 209 L 1848 207 L 1849 206 L 1849 203 L 1850 202 L 1850 199 L 1851 198 L 1851 193 L 1853 189 L 1924 189 L 1925 188 L 1925 185 L 1926 184 L 1926 180 L 1927 179 L 1927 176 L 1928 175 L 1928 172 L 1929 171 L 1930 164 L 1929 163 L 1860 163 L 1859 162 L 1860 161 L 1861 154 L 1862 153 L 1862 151 L 1863 150 L 1863 147 L 1864 146 L 1864 141 L 1865 140 L 1865 138 L 1866 137 L 1866 134 L 1868 130 L 1868 126 L 1869 125 L 1869 120 Z
M 675 120 L 575 120 L 574 121 L 567 121 L 566 122 L 563 122 L 562 123 L 559 123 L 558 124 L 556 124 L 555 125 L 550 126 L 538 132 L 536 134 L 532 136 L 528 140 L 527 140 L 526 142 L 522 145 L 522 146 L 518 150 L 516 154 L 513 157 L 513 159 L 508 168 L 508 173 L 507 174 L 507 177 L 506 178 L 506 194 L 507 195 L 508 202 L 510 205 L 510 207 L 512 209 L 514 214 L 517 217 L 517 218 L 520 221 L 521 221 L 522 223 L 523 223 L 529 228 L 533 230 L 535 230 L 538 232 L 543 233 L 544 234 L 551 234 L 552 235 L 615 235 L 616 234 L 618 234 L 619 235 L 624 235 L 625 236 L 627 236 L 635 240 L 641 247 L 643 251 L 643 253 L 644 254 L 644 267 L 643 268 L 643 271 L 642 272 L 642 274 L 641 276 L 639 278 L 637 282 L 630 289 L 629 289 L 627 291 L 626 291 L 622 294 L 620 294 L 616 296 L 613 296 L 612 297 L 487 297 L 485 299 L 485 302 L 483 306 L 483 310 L 482 311 L 482 314 L 481 315 L 481 319 L 480 320 L 480 325 L 607 325 L 608 324 L 614 324 L 615 323 L 619 323 L 627 319 L 630 319 L 634 317 L 636 315 L 638 315 L 640 313 L 641 313 L 649 306 L 650 306 L 653 303 L 654 301 L 655 301 L 655 300 L 662 292 L 662 290 L 664 288 L 667 282 L 667 280 L 668 279 L 668 277 L 670 273 L 670 270 L 671 269 L 671 248 L 670 247 L 670 244 L 669 243 L 668 238 L 665 232 L 662 229 L 661 226 L 655 220 L 654 220 L 648 215 L 640 211 L 638 211 L 637 210 L 633 210 L 632 209 L 627 209 L 626 208 L 553 208 L 552 207 L 550 207 L 544 204 L 537 197 L 535 193 L 534 188 L 533 187 L 533 180 L 534 179 L 534 176 L 537 170 L 537 168 L 539 166 L 539 165 L 549 155 L 554 153 L 558 150 L 561 150 L 562 149 L 565 149 L 566 148 L 570 148 L 571 147 L 670 147 L 671 146 L 671 141 L 672 140 L 672 137 L 674 133 L 674 129 L 675 128 L 675 124 L 676 123 L 676 121 Z
M 333 132 L 331 134 L 328 135 L 326 137 L 321 139 L 311 148 L 310 148 L 296 163 L 296 164 L 290 172 L 288 177 L 286 179 L 286 181 L 282 188 L 281 193 L 279 196 L 279 198 L 277 202 L 277 206 L 276 207 L 276 212 L 275 213 L 275 220 L 274 221 L 274 237 L 275 238 L 275 244 L 276 245 L 277 254 L 278 255 L 279 260 L 281 263 L 282 268 L 286 276 L 288 278 L 289 281 L 294 287 L 294 288 L 305 300 L 306 300 L 311 305 L 315 307 L 318 310 L 320 310 L 323 313 L 327 315 L 329 315 L 336 319 L 339 319 L 340 320 L 342 320 L 343 321 L 345 321 L 349 323 L 353 323 L 354 324 L 363 324 L 364 325 L 434 325 L 435 324 L 435 319 L 436 318 L 436 309 L 437 308 L 437 301 L 438 300 L 438 298 L 437 297 L 364 297 L 363 296 L 354 295 L 348 292 L 346 292 L 340 289 L 338 287 L 335 286 L 332 283 L 331 283 L 322 275 L 322 274 L 315 266 L 312 260 L 310 258 L 310 256 L 306 249 L 306 245 L 305 244 L 305 241 L 304 240 L 304 237 L 303 236 L 303 216 L 304 215 L 304 211 L 305 210 L 306 203 L 315 185 L 317 183 L 319 179 L 324 174 L 324 173 L 326 172 L 329 168 L 330 168 L 334 164 L 337 163 L 340 160 L 345 158 L 347 156 L 351 154 L 356 153 L 359 151 L 361 151 L 362 150 L 367 150 L 368 149 L 373 149 L 374 148 L 445 148 L 447 144 L 447 136 L 448 135 L 448 124 L 449 122 L 447 120 L 378 120 L 377 121 L 367 121 L 366 122 L 362 122 L 361 123 L 358 123 L 357 124 L 350 125 L 342 129 L 340 129 L 337 131 L 335 131 Z
M 181 132 L 179 134 L 174 136 L 172 138 L 168 140 L 165 143 L 164 143 L 159 148 L 158 148 L 156 150 L 156 151 L 154 152 L 152 154 L 152 155 L 147 160 L 147 161 L 143 165 L 143 166 L 139 171 L 138 174 L 136 176 L 130 188 L 130 190 L 129 191 L 129 193 L 128 194 L 128 196 L 126 200 L 126 203 L 125 204 L 125 208 L 124 209 L 124 213 L 123 214 L 123 222 L 122 223 L 122 232 L 123 233 L 123 241 L 124 242 L 124 246 L 125 247 L 125 252 L 126 253 L 126 256 L 129 262 L 130 267 L 135 277 L 137 279 L 138 282 L 144 289 L 144 290 L 156 302 L 157 302 L 160 305 L 164 307 L 167 310 L 167 311 L 169 310 L 174 314 L 176 315 L 178 315 L 185 319 L 188 319 L 189 320 L 191 320 L 195 322 L 198 322 L 199 323 L 204 323 L 205 324 L 214 324 L 215 325 L 286 325 L 287 324 L 287 319 L 288 318 L 288 302 L 289 301 L 289 298 L 288 297 L 214 297 L 213 296 L 208 296 L 207 295 L 200 294 L 195 291 L 193 291 L 189 289 L 187 287 L 184 286 L 178 281 L 177 281 L 168 272 L 168 271 L 164 267 L 163 264 L 159 259 L 159 257 L 155 250 L 155 248 L 154 247 L 154 243 L 152 239 L 152 233 L 151 232 L 151 221 L 152 220 L 152 214 L 153 213 L 153 210 L 154 209 L 154 205 L 157 199 L 157 197 L 159 194 L 159 192 L 163 187 L 163 185 L 167 181 L 168 178 L 170 177 L 171 175 L 184 163 L 185 163 L 190 159 L 200 154 L 202 154 L 205 152 L 207 152 L 210 150 L 215 150 L 216 149 L 222 149 L 223 148 L 295 148 L 296 147 L 296 140 L 297 139 L 297 128 L 298 127 L 298 121 L 297 120 L 227 120 L 226 121 L 215 121 L 214 122 L 209 122 L 208 123 L 205 123 L 201 125 L 198 125 L 197 126 L 192 127 L 185 131 L 183 131 Z
M 1506 121 L 1499 127 L 1497 131 L 1497 138 L 1496 139 L 1496 143 L 1495 144 L 1495 147 L 1494 148 L 1494 151 L 1493 152 L 1493 155 L 1492 156 L 1491 163 L 1489 167 L 1489 170 L 1488 171 L 1488 175 L 1487 176 L 1487 179 L 1485 183 L 1485 186 L 1484 187 L 1484 190 L 1483 191 L 1483 195 L 1482 196 L 1482 199 L 1481 200 L 1481 202 L 1480 203 L 1480 206 L 1479 207 L 1479 212 L 1478 213 L 1478 216 L 1476 220 L 1476 223 L 1475 224 L 1475 227 L 1474 228 L 1474 232 L 1473 233 L 1472 240 L 1470 244 L 1470 249 L 1469 250 L 1468 257 L 1466 261 L 1466 265 L 1465 266 L 1465 270 L 1464 271 L 1464 274 L 1463 275 L 1463 277 L 1462 278 L 1462 281 L 1461 282 L 1461 287 L 1460 288 L 1460 290 L 1459 291 L 1459 294 L 1457 298 L 1456 307 L 1455 308 L 1455 311 L 1454 312 L 1454 314 L 1453 315 L 1453 318 L 1452 319 L 1452 325 L 1478 325 L 1479 324 L 1479 321 L 1481 317 L 1481 312 L 1482 311 L 1482 308 L 1483 307 L 1483 304 L 1484 303 L 1484 300 L 1485 299 L 1485 296 L 1486 295 L 1486 290 L 1488 286 L 1488 283 L 1489 282 L 1489 279 L 1490 278 L 1490 274 L 1491 273 L 1491 270 L 1492 269 L 1492 267 L 1493 266 L 1493 263 L 1494 262 L 1495 253 L 1496 252 L 1496 249 L 1497 248 L 1497 245 L 1498 244 L 1498 241 L 1499 240 L 1499 235 L 1500 234 L 1500 232 L 1502 228 L 1502 225 L 1503 224 L 1503 220 L 1504 219 L 1504 216 L 1506 212 L 1506 209 L 1507 208 L 1507 205 L 1508 204 L 1508 199 L 1509 198 L 1509 195 L 1511 191 L 1511 188 L 1512 187 L 1512 183 L 1513 182 L 1513 179 L 1515 175 L 1516 168 L 1517 167 L 1519 169 L 1519 171 L 1520 172 L 1521 170 L 1521 167 L 1519 165 L 1518 167 L 1517 166 L 1518 159 L 1520 156 L 1522 159 L 1522 162 L 1523 163 L 1524 170 L 1525 171 L 1525 173 L 1527 177 L 1527 180 L 1528 181 L 1528 183 L 1530 187 L 1530 190 L 1532 194 L 1532 197 L 1533 198 L 1533 200 L 1534 201 L 1534 203 L 1536 207 L 1536 211 L 1537 212 L 1537 215 L 1538 216 L 1538 218 L 1539 219 L 1539 221 L 1541 225 L 1541 229 L 1542 230 L 1542 232 L 1543 233 L 1543 235 L 1545 239 L 1546 246 L 1547 247 L 1547 249 L 1548 250 L 1548 252 L 1550 256 L 1550 261 L 1551 262 L 1551 264 L 1552 265 L 1552 267 L 1554 271 L 1555 278 L 1556 279 L 1556 281 L 1558 285 L 1558 288 L 1559 289 L 1560 296 L 1561 297 L 1561 299 L 1563 303 L 1563 307 L 1564 308 L 1564 310 L 1566 314 L 1568 316 L 1568 317 L 1570 319 L 1571 319 L 1573 321 L 1577 323 L 1579 323 L 1580 324 L 1595 324 L 1596 323 L 1598 323 L 1606 318 L 1610 310 L 1610 306 L 1612 302 L 1612 299 L 1613 298 L 1613 296 L 1614 295 L 1614 292 L 1615 291 L 1615 287 L 1616 286 L 1616 284 L 1617 283 L 1617 280 L 1619 276 L 1619 272 L 1620 271 L 1620 269 L 1621 268 L 1621 265 L 1623 261 L 1623 258 L 1624 257 L 1624 253 L 1625 252 L 1625 250 L 1627 246 L 1627 243 L 1628 242 L 1628 238 L 1629 237 L 1629 235 L 1631 231 L 1631 228 L 1632 227 L 1632 223 L 1633 222 L 1633 220 L 1634 219 L 1634 216 L 1635 215 L 1635 213 L 1637 209 L 1637 205 L 1638 204 L 1638 202 L 1639 201 L 1639 198 L 1641 194 L 1641 190 L 1642 189 L 1642 186 L 1643 185 L 1643 183 L 1645 179 L 1646 172 L 1647 171 L 1647 169 L 1648 168 L 1648 165 L 1650 161 L 1650 157 L 1651 156 L 1651 154 L 1652 153 L 1652 151 L 1654 147 L 1654 144 L 1655 143 L 1655 139 L 1656 138 L 1656 136 L 1657 135 L 1657 133 L 1659 129 L 1659 125 L 1661 122 L 1661 120 L 1660 119 L 1635 119 L 1632 123 L 1632 125 L 1631 126 L 1631 129 L 1630 130 L 1630 134 L 1629 135 L 1629 137 L 1627 141 L 1627 144 L 1626 145 L 1626 149 L 1625 150 L 1625 152 L 1624 153 L 1624 155 L 1622 159 L 1622 162 L 1621 163 L 1621 167 L 1620 168 L 1620 170 L 1618 174 L 1618 177 L 1617 178 L 1617 182 L 1616 183 L 1616 185 L 1614 189 L 1614 192 L 1612 196 L 1612 200 L 1611 201 L 1611 203 L 1610 204 L 1610 207 L 1608 211 L 1608 215 L 1606 219 L 1606 222 L 1604 226 L 1604 229 L 1603 230 L 1602 237 L 1600 241 L 1600 244 L 1599 245 L 1599 249 L 1598 250 L 1598 253 L 1597 254 L 1597 256 L 1595 260 L 1595 264 L 1594 265 L 1594 268 L 1592 272 L 1592 275 L 1590 278 L 1588 274 L 1587 274 L 1587 277 L 1590 281 L 1590 284 L 1588 288 L 1586 287 L 1586 285 L 1585 284 L 1585 281 L 1583 277 L 1583 273 L 1582 272 L 1582 270 L 1581 269 L 1581 267 L 1579 263 L 1579 260 L 1578 259 L 1578 256 L 1577 255 L 1577 253 L 1575 249 L 1575 246 L 1574 245 L 1573 238 L 1572 237 L 1572 235 L 1570 231 L 1569 224 L 1568 223 L 1568 221 L 1566 217 L 1565 210 L 1564 209 L 1564 207 L 1562 203 L 1562 200 L 1561 199 L 1560 192 L 1559 191 L 1559 189 L 1557 185 L 1557 182 L 1556 181 L 1556 179 L 1555 178 L 1555 176 L 1553 172 L 1552 165 L 1550 161 L 1550 158 L 1548 154 L 1548 151 L 1547 150 L 1547 147 L 1545 143 L 1545 140 L 1544 139 L 1543 134 L 1541 130 L 1534 123 L 1530 121 L 1528 121 L 1524 119 L 1513 119 L 1512 120 L 1509 120 L 1508 121 Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
</svg>
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

// src/core/policy/safety-level.ts
var SAFETY_LEVEL_CAPABILITIES = {
  standard: { fail_closed: false, paranoid_rm: false, paranoid_interpreters: false },
  strict: { fail_closed: true, paranoid_rm: false, paranoid_interpreters: false },
  paranoid: { fail_closed: true, paranoid_rm: true, paranoid_interpreters: true }
};

// src/hosts/catalog.ts
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
    doctorOrder: 7,
    runtime: {
      order: 6,
      flags: ["-cp", "--copilot-cli"],
      description: "Run as GitHub Copilot CLI PreToolUse hook",
      legacyTopLevelFlags: ["-cp", "--copilot-cli"]
    },
    install: {
      order: 7,
      flag: "--copilot-cli",
      artifactKind: "plugin",
      probeCommand: ["copilot", "--binary-version"]
    }
  },
  {
    id: "gemini-cli",
    displayName: "Gemini CLI",
    doctorOrder: 6,
    runtime: {
      order: 5,
      flags: ["-gc", "--gemini-cli"],
      description: "Run as Gemini CLI BeforeTool hook",
      legacyTopLevelFlags: ["-gc", "--gemini-cli"]
    },
    install: {
      order: 6,
      flag: "--gemini-cli",
      artifactKind: "extension",
      probeCommand: ["gemini", "--version"]
    }
  },
  {
    id: "grok-build",
    displayName: "Grok Build",
    doctorOrder: 8,
    runtime: {
      order: 7,
      flags: ["-gb", "--grok-build"],
      description: "Run as Grok Build PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 8,
      flag: "--grok-build",
      artifactKind: "hook config",
      probeCommand: ["grok", "--version"]
    }
  },
  {
    id: "hermes-agent",
    displayName: "Hermes Agent",
    doctorOrder: 9,
    runtime: {
      order: 8,
      flags: ["-ha", "--hermes-agent"],
      description: "Run as Hermes Agent pre_tool_call hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 9,
      flag: "--hermes-agent",
      artifactKind: "plugin",
      probeCommand: ["hermes", "--version"]
    }
  },
  {
    id: "kimi-code",
    displayName: "Kimi Code",
    doctorOrder: 10,
    runtime: {
      order: 9,
      flags: ["-kc", "--kimi-code"],
      description: "Run as Kimi Code PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 10,
      flag: "--kimi-code",
      artifactKind: "hook config",
      probeCommand: ["kimi", "--version"]
    }
  },
  {
    id: "openclaw",
    displayName: "OpenClaw",
    doctorOrder: 11,
    install: {
      order: 11,
      flag: "--openclaw",
      artifactKind: "plugin",
      probeCommand: ["openclaw", "--version"]
    }
  },
  {
    id: "opencode",
    displayName: "OpenCode",
    doctorOrder: 12,
    install: {
      order: 12,
      flag: "--opencode",
      artifactKind: "plugin",
      probeCommand: ["opencode", "--version"]
    }
  },
  {
    id: "pi",
    displayName: "Pi",
    doctorOrder: 13,
    install: {
      order: 13,
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
var DEFAULT_RETENTION_DAYS = 30;
var MAX_RETENTION_DAYS = 365;
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
var integrationsRequested = false;
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
    ...init.headers || {}
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
var clonePolicy = (policy) => JSON.parse(JSON.stringify(policy));
var pathLines = (value) => value.split(\`
\`).map((line) => line.trim()).filter(Boolean);
var formatPolicy = (policy) => \`\${JSON.stringify(policy, null, 2)}
\`;
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
  if (view === "integrations" && !integrationsRequested) {
    integrationsRequested = true;
    loadIntegrations();
  }
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
var retentionDays = () => state?.policy?.audit?.retention_days ?? DEFAULT_RETENTION_DAYS;
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
var findSuspects = (entries) => {
  const signatureKey = (entry) => \`\${entry.sessionId}
\${commandSignature(entry.segment || entry.command)}\`;
  const repeats = entries.filter((entry) => entry.decision !== "allow" && entry.sessionId).reduce((counts, entry) => {
    const key = signatureKey(entry);
    return counts.set(key, (counts.get(key) ?? 0) + 1);
  }, new Map);
  return new Set(entries.filter((entry) => entry.decision !== "allow" && (entry.failureStage || (repeats.get(signatureKey(entry)) ?? 0) >= 2)));
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
  suspects = findSuspects(activity.entries);
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
var loadHealth = async () => {
  const result = await requestJson("/api/health");
  if (!result.ok || !Array.isArray(result.data?.hooks))
    return;
  const active = result.data.hooks.filter((hook) => hook.configured);
  const inactive = result.data.hooks.filter((hook) => !hook.configured);
  const attention = inactive.length > 0 || active.length === 0;
  const parts = [];
  const labelHtml = (hook) => \`<strong>\${escapeHtml(hook.label)}</strong>\`;
  if (active.length)
    parts.push(\`Hook active in \${active.map(labelHtml).join(", ")}\`);
  if (inactive.length)
    parts.push(\`\${inactive.map(labelHtml).join(", ")} detected without an active hook\`);
  if (!parts.length)
    parts.push("No agent hooks detected");
  if (result.data.update?.updateAvailable)
    parts.push(\`v\${escapeHtml(result.data.update.latestVersion)} available\`);
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
    integrationsRequested = false;
    return;
  }
  integrations = result.data;
  renderIntegrations();
  qs("integrations-pkg-version").textContent = result.data.system.version;
  qs("integrations-node-version").textContent = result.data.system.nodeVersion ?? "unknown";
  qs("integrations-platform").textContent = result.data.system.platform;
  qs("integrations-system").hidden = false;
};
var refreshIntegrations = () => runRefresh("integrations-refresh", () => {
  integrationsRequested = true;
  return loadIntegrations();
});
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
var rulePromptText = () => {
  const names = rulesData?.rulebooks.map((rulebook) => rulebook.name) ?? [];
  return [
    "Use the cc-safety-net skill for this request.",
    "If that skill is not available, run \`npx -y cc-safety-net rule doc\` first and treat its output as the source of truth for schema, paths, and validation.",
    "",
    rulesScope === "project" ? \`Scope: this project - \${qs("rules-project-path").value.trim()}\` : "Scope: all projects (user scope)",
    \`Existing rulebooks (names must stay unique across both scopes): \${names.length > 0 ? names.join(", ") : "none"}\`,
    "",
    qs("rules-composer-input").value.trim()
  ].join(\`
\`);
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
    await navigator.clipboard.writeText(rulePromptText());
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
    if (config.validateAdditions && additions.length) {
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
  qs("secret").innerHTML = '<label class="row master"><input type="checkbox" id="secret-enabled" ' + checkbox(state.policy.secret_protection.enabled) + '><span><strong>Secret protection</strong><small>Block default sensitive paths, coding CLI credential locations, and configured deny paths.</small></span><span class="master-badge">' + (state.policy.secret_protection.enabled ? "On" : "Off") + '</span><span class="project-chip-slot" id="secret-enabled-chip"></span></label>' + '<div id="secret-patterns"></div>' + '<section class="rule-tier">' + '<button type="button" class="rule-tier-head" aria-expanded="false" aria-controls="deny-paths-content"><span class="panel-chevron" aria-hidden="true"></span><span class="tier-label"><strong id="deny-paths-label">Deny paths</strong><small>Configured paths and everything inside them are blocked while Secret protection is on.</small></span><span class="tier-counts" id="deny-paths-count"></span></button>' + '<div class="tier-content paths-content" id="deny-paths-content" hidden>' + '<p class="muted">Paste multiple lines to add several paths at once.</p>' + '<div class="paths-add"><input type="text" id="deny-paths-input" data-path-input="deny-paths" autocomplete="off" spellcheck="false" placeholder="path/to/protect" aria-labelledby="deny-paths-label"><button type="button" class="icon-button" id="deny-paths-add-button" data-path-add="deny-paths" aria-label="Add deny path">' + pathListIcons.add + "</button></div>" + '<p class="paths-hint" id="deny-paths-hint" hidden></p>' + '<span class="project-chip-slot" id="deny-paths-chip"></span>' + '<ul class="paths-list" id="deny-paths-list"></ul>' + "</div></section>" + '<section class="rule-tier">' + '<button type="button" class="rule-tier-head" aria-expanded="false" aria-controls="secret-allow-paths-content"><span class="panel-chevron" aria-hidden="true"></span><span class="tier-label"><strong id="secret-allow-paths-label">Allow paths</strong><small>Configured files and subtrees are exempt from the pattern rules. Deny paths and coding CLI protections still apply. Entries covering the home directory are rejected, and glob patterns are not supported.</small></span><span class="tier-counts" id="secret-allow-paths-count"></span></button>' + '<div class="tier-content paths-content" id="secret-allow-paths-content" hidden>' + '<p class="muted">Paste multiple lines to add several paths at once.</p>' + '<div class="paths-add"><input type="text" id="secret-allow-paths-input" data-path-input="secret-allow-paths" autocomplete="off" spellcheck="false" placeholder="~/project/.env.test or ~/project/fixtures" aria-labelledby="secret-allow-paths-label"><button type="button" class="icon-button" id="secret-allow-paths-add-button" data-path-add="secret-allow-paths" aria-label="Add allow path">' + pathListIcons.add + "</button></div>" + '<p class="paths-hint" id="secret-allow-paths-hint" hidden></p>' + '<span class="project-chip-slot" id="secret-allow-paths-chip"></span>' + '<ul class="paths-list" id="secret-allow-paths-list"></ul>' + "</div></section>";
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
    dir: result.data.dir,
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
  if (!Number.isInteger(days) || days < 1 || days > MAX_RETENTION_DAYS) {
    qs("retention-days").value = String(current);
    setAppStatus("Retention unchanged", "error");
    setDetailStatus(\`Error: retention must be a whole number of days from 1 to \${MAX_RETENTION_DAYS}.\`, "error");
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
loadHealth();
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
`;var Kd='<script id="ccsn-data" type="application/json">';function Yd(j){return Wd.replace(Kd,()=>Kd+JSON.stringify({token:j}).replaceAll("<","\\u003c"))}var fo="kenryu42/cc-safety-net",bh=`https://github.com/${fo}`,Vi=1e4,Lh=7,wh="The project draft directory changed; reload the draft before applying.",kh="audit settings are user scope only; remove the audit section from a project proposal";async function tu(j,K={}){let te=At({label:"gui",booleans:{noOpen:["--no-open"]}},j),re=K.log??console.log,oe=K.error??console.error;if(te.errors.length>0){for(let de of te.errors)oe(de);return oe("Usage: cc-safety-net gui [--no-open]"),1}let ce=await xh(l,K);if(re(`CC Safety Net policy GUI: ${ce.url}`),!te.flags.noOpen)try{await(K.openBrowser??$h)(ce.url)}catch(de){oe(`Failed to open browser: ${de instanceof Error?de.message:String(de)}`),oe(`Open this URL manually: ${ce.url}`)}if(K.keepAlive===!1)return await ce.close(),0;return await Ih(ce),0}async function xh(j,K={}){let te=gh(24).toString("base64url"),re={dir:null,revision:0},oe=hh((we,xe)=>{Ch(j,we,xe,te,K,re)});await new Promise((we,xe)=>{oe.once("error",xe),oe.listen(0,"127.0.0.1",()=>{oe.off("error",xe),we()})});let de=`http://127.0.0.1:${oe.address().port}`;return{origin:de,token:te,url:`${de}/?token=${encodeURIComponent(te)}`,close:()=>Th(oe)}}async function Ch(j,K,te,re,oe,ce){let de=j(),we=new URL(K.url??"/","http://127.0.0.1");if(K.method==="GET"&&we.pathname==="/favicon.ico"){te.writeHead(204,{"cache-control":"no-store"}),te.end();return}if(!Dh(K,we,re)){xt(te,403,{error:"Forbidden"});return}if(K.method==="GET"&&we.pathname==="/"){_h(te,Yd(re));return}if(K.method==="GET"&&we.pathname==="/api/policy"){let xe=Yc(de,oe),Ce=k(de,Bi(oe));xt(te,200,{...xe,configState:Be(Ce),...Ce.policyScopes?{projectPolicy:{path:w(oe.cwd??process.cwd()),weakenings:Ce.policyScopes.weakenings}}:{},destructiveCommandRules:U,secretPatterns:rt,version:Et(),preview:xe.errors.length>0?null:Ge(xe.policy,de.env)});return}if(K.method==="POST"&&we.pathname==="/api/policy/preview"){let xe=await cr(K);if(!xe.ok){xt(te,xe.status,{errors:[xe.error]});return}let Ce=Zc(de,xe.value);xt(te,Ce.errors.length>0?400:200,Ce);return}if(K.method==="POST"&&we.pathname==="/api/policy/explain"){let xe=await cr(K);if(!xe.ok){xt(te,xe.status,{errors:[xe.error]});return}let Ce=xe.value;if(Ce===null||typeof Ce.command!=="string"){xt(te,400,{errors:["command must be a string"]});return}let Se=Ut(Ce.policy,de.home);if(Se.length>0){xt(te,400,{errors:Se});return}xt(te,200,Ph(de,Ce.command,Ce.policy,oe));return}if(K.method==="POST"&&we.pathname==="/api/policy"){let xe=await cr(K);if(!xe.ok){xt(te,xe.status,{errors:[xe.error]});return}let Ce=Xt(de,xe.value,oe);xt(te,Ce.errors.length>0?400:200,Ce);return}if(K.method==="POST"&&we.pathname==="/api/reset"){xt(te,200,Xt(de,Q,oe));return}if(K.method==="POST"&&we.pathname==="/api/repair"){xt(te,200,Xc(de,oe));return}if(K.method==="POST"&&we.pathname==="/api/policy/project/choose-directory"){let xe=await(oe.chooseDirectory??Gi)();if("path"in xe)ce.dir=xe.path,ce.revision+=1;xt(te,200,{cancelled:"cancelled"in xe,..."error"in xe?{error:xe.error}:{}});return}if(K.method==="GET"&&we.pathname==="/api/policy/project"){let xe=nu(ce,oe),Ce=Zd(xe,de.home),Se=sr(de,oe);xt(te,200,{dir:xe,path:w(xe),revision:ce.revision,baseline:Se.baseline,userPolicyDiagnostics:Se.diagnostics,projection:Ce.projection,projectionDiagnostics:Ce.diagnostics,canPickDirectory:Ui(process.platform,process.env)});return}if(K.method==="POST"&&we.pathname==="/api/policy/project/diff"){let xe=await Xd(de,K,te,ce,oe);if(!xe)return;let Ce=Zd(xe.dir,de.home),Se=sr(de,oe).baseline,Ne=X(Se,le(xe.proposal,de.home).policy);xt(te,200,{rows:Xr(X(Se,Ce.projection).policy,Ne.policy,!1),weakenings:Ne.weakenings,existingFileDiagnostics:Ce.diagnostics,errors:[]});return}if(K.method==="POST"&&we.pathname==="/api/policy/project/apply"){let xe=await Xd(de,K,te,ce,oe);if(!xe)return;let Ce=Rh(xe.dir,xe.proposal,de.home);xt(te,Ce.errors.length>0?500:200,Ce);return}if(K.method==="GET"&&we.pathname==="/api/activity"){let xe=ne(de,oe),Ce=Eh(we.searchParams.get("days"),xe);if(Ce===null){xt(te,400,{error:`days must be an integer between 1 and ${xe}`});return}xt(te,200,qd(de,Ce,oe.activityLogsDir));return}if(K.method==="POST"&&we.pathname==="/api/rules/choose-directory"){xt(te,200,await Gi());return}if(K.method==="GET"&&we.pathname==="/api/rules"){let xe=Z(de,Bi(oe)),Ce=new Map(xe.rules.map((Se)=>[Se.name,Se]));xt(te,200,{projectPath:oe.cwd??process.cwd(),canPickDirectory:Ui(process.platform,process.env),rulebooks:xe.rulebooks.map((Se)=>({source:Se.source,spec:Se.spec,name:Se.name,version:Se.version,rules:Se.rules.flatMap((Ne)=>{let He=Ce.get(Ne);if(!He)return[];return[{name:He.name,command:He.command,subcommand:He.subcommand,block_args:He.block_args,reason:He.reason}]})})),errors:xe.errors,warnings:xe.warnings});return}if(K.method==="GET"&&we.pathname==="/api/star/context"){xt(te,200,await(oe.fetchStarContext??(()=>Mh(de,{logsDir:oe.activityLogsDir})))());return}if(K.method==="POST"&&we.pathname==="/api/star"){let xe=await(oe.starRepo??Oh)();xt(te,200,xe.ok?{ok:!0}:{ok:!1,fallbackUrl:bh});return}if(K.method==="GET"&&we.pathname==="/api/integrations"){xt(te,200,await(oe.fetchIntegrations??(()=>jh(de)))());return}if(K.method==="GET"&&we.pathname==="/api/health"){xt(te,200,await(oe.fetchHealth??(()=>Fh(de)))());return}if(K.method==="POST"&&(we.pathname==="/api/install"||we.pathname==="/api/uninstall")){let xe=await cr(K);if(!xe.ok){xt(te,xe.status,{errors:[xe.error]});return}let Ce=xe.value?.target;if(typeof Ce!=="string"||!Wt.some((Ne)=>Ne.target===Ce)){xt(te,400,{error:"unknown target"});return}let Se=we.pathname==="/api/install"?"install":"uninstall";xt(te,200,await(oe.runIntegration??Nh)(Se,Ce));return}xt(te,404,{error:"Not found"})}function Bi(j){return{...j,cwd:j.cwd??process.cwd()}}function nu(j,K){return j.dir??K.cwd??process.cwd()}function Zd(j,K){let te=w(j),re=yh(te)?bn(te):{value:void 0,errors:[]},oe=le(re.value,K);return{projection:oe.policy,diagnostics:[...re.errors,...oe.diagnostics]}}async function Xd(j,K,te,re,oe){let ce=nu(re,oe),de=re.revision,we=await cr(K);if(!we.ok)return xt(te,we.status,{errors:[we.error]}),null;let xe=we.value;if(typeof xe?.revision!=="number")return xt(te,400,{errors:["revision must be a number"]}),null;if(xe.revision!==de)return xt(te,409,{errors:[wh]}),null;let Ce=Sh(xe.proposal,j.home);if(Ce.length>0)return xt(te,400,{errors:Ce}),null;return{dir:ce,proposal:xe.proposal}}function Sh(j,K){let te=Ut(j,K);if(te.length>0)return te;return j?.audit===void 0?[]:[kh]}function Rh(j,K,te){let re=w(j),oe=Qr(K,h(K,te));try{return y(s(S(j,"project policy"),re),`${JSON.stringify(oe,null,2)}
`),{path:re,errors:[]}}catch(ce){return{path:re,errors:[ce instanceof Error?ce.message:String(ce)]}}}function Ph(j,K,te,re){let oe=h(te,j.home),ce=k(j,Bi(re)),de=De({rules:ce.policy.rules,transparentWrappers:ce.policy.transparentWrappers,safety:Ue(oe.safety),worktreeMode:oe.workflow.worktree_mode,destructiveCommandProtectionEnabled:oe.destructive_command_protection.enabled,destructiveCommandRuleOverrides:oe.destructive_command_protection.overrides,destructiveCommandAllowPaths:oe.destructive_command_protection.allow_paths,secretProtection:{enabled:oe.secret_protection.enabled,disabledRules:We(oe.secret_protection.overrides),denyPaths:oe.secret_protection.deny_paths,allowPaths:oe.secret_protection.allow_paths}});return er(K,{policySnapshot:de,cwd:re.cwd,userConfigDir:re.userConfigDir},j)}function Eh(j,K){if(j===null)return Math.min(Lh,K);let te=Number(j);if(!Number.isInteger(te)||te<1||te>K)return null;return te}function Dh(j,K,te){if(K.searchParams.get("token")!==te)return!1;if(j.method!=="POST")return!0;return j.headers["x-cc-safety-net-token"]===te}var Ah=1048576;async function cr(j){let K=[],te=0;for await(let re of j){let oe=re;if(te+=oe.byteLength,te>Ah)return{ok:!1,status:413,error:"Request body is too large"};K.push(oe)}try{return{ok:!0,value:JSON.parse(Buffer.concat(K).toString("utf-8")||"{}")}}catch(re){return{ok:!1,status:400,error:`Invalid JSON: ${re instanceof Error?re.message:String(re)}`}}}function _h(j,K){j.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),j.end(K)}function xt(j,K,te){j.writeHead(K,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),j.end(JSON.stringify(te))}function Th(j){return new Promise((K,te)=>{j.close((re)=>re?te(re):K())})}function Ih(j){return new Promise((K)=>{let te=()=>{process.off("SIGINT",re),process.off("SIGTERM",re)},re=()=>{te(),j.close().then(K)};process.once("SIGINT",re),process.once("SIGTERM",re)})}function $h(j){let K=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",te=process.platform==="win32"?["/c","start","",j]:[j];return new Promise((re,oe)=>{let ce=eu(K,te,{detached:!0,stdio:"ignore"}),de=(xe)=>{ce.off("spawn",we),oe(xe)},we=()=>{ce.off("error",de),ce.unref(),re()};ce.once("error",de),ce.once("spawn",we)})}async function Oh(j="gh",K=Vi){return{ok:await qi(j,["api","-X","PUT",`/user/starred/${fo}`],K)===0}}async function jh(j,K={}){let te=await Hn(K.fetcher),re=ru(j,te);return{targets:Nt.map((oe)=>{let ce=re.find((de)=>de.platform===oe.id);return{target:oe.id,label:St(oe.id),version:te.versions[oe.id]??null,status:ce?.configured?"active":ce?.detected?"disabled":ce?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:te.version,nodeVersion:te.nodeVersion,platform:te.platform}}}function ru(j,K){return Dn(j,process.cwd(),{ampPluginListOutput:K.ampPluginListOutput,codexPluginListOutput:K.codexPluginListOutput,copilotCliVersion:K.versions["copilot-cli"]})}async function Fh(j,K={}){let[te,re]=await Promise.all([Hn(K.fetcher),(K.checkUpdates??tn)()]);return{hooks:ru(j,te).filter((oe)=>oe.detected).map((oe)=>({platform:oe.platform,label:St(oe.platform),configured:oe.configured})),update:{currentVersion:re.currentVersion,latestVersion:re.latestVersion??null,updateAvailable:re.updateAvailable}}}var Qd=Promise.resolve();function Nh(j,K,te={}){let re=async()=>{let ce=[],{log:de,error:we}=console;console.log=(...xe)=>ce.push(xe.map(String).join(" ")),console.error=console.log;try{return{ok:await ir(j,[],{selectTargets:async()=>[K],output:new vh({write(Ce,Se,Ne){ce.push(String(Ce).replace(/\n$/,"")),Ne()}}),...te})===0,output:ce.join(`
`)}}finally{console.log=de,console.error=we}},oe=Qd.then(re);return Qd=oe.then(()=>{return},()=>{return}),oe}async function Mh(j,K={}){let[te,re,oe]=await Promise.all([Hh(K.command),Uh(K.fetchRepo),Promise.resolve(gr(j,ne(j),K.logsDir).totalBlocked)]);return{starred:te,starCount:re,blockedTotal:oe}}async function Hh(j="gh",K=Vi){if(await qi(j,["auth","status"],K)!==0)return null;let te=await qi(j,["api",`/user/starred/${fo}`],K);if(te===0)return!0;if(te===null)return null;return!1}function qi(j,K,te){return new Promise((re)=>{let oe=eu(j,K,{stdio:"ignore",windowsHide:!0}),ce=!1,de,we=(xe)=>{if(ce)return;if(ce=!0,de)clearTimeout(de);re(xe)};oe.once("error",()=>we(null)),oe.once("close",we),de=setTimeout(()=>{oe.kill(),we(null)},te)})}async function Uh(j=fetch){try{let K=await j(`https://api.github.com/repos/${fo}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(Vi)});if(!K.ok)return null;let te=await K.json();return typeof te.stargazers_count==="number"?te.stargazers_count:null}catch{return null}}function Gh(j){if(j[0]!=="help")return!1;let K=j[1];if(!K)pi(),process.exit(0);if(tr(K))process.exit(0);console.error(`Unknown command: ${K}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var Bh={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),tr("hook",console.error),process.exit(1)},install:async(j)=>{process.exit(await ir("install",j))},update:async(j)=>{process.exit(await Ri(j))},uninstall:async(j)=>{process.exit(await ir("uninstall",j))},rule:async(j)=>{process.exit(await Ud(l(),j))},policy:async(j)=>{process.exit(await nd(l(),j))},status:async(j)=>{if(Kt(At({label:"status"},j).errors))process.exit(1);Bd(l())},statusline:async(j)=>{let K=At({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},j);if(K.errors.length===0&&K.flags.claudeCode){await Hi(l());return}if(Kt(K.errors),!K.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");tr("statusline",console.error),process.exit(1)},doctor:async(j)=>{let K=oi(j);if(!K)process.exit(1);let te=await Sl(l(),{json:K.json,skipUpdateCheck:K.skipUpdateCheck});process.exit(te)},logs:async(j)=>{process.exit(await Qi(l(),j))},gui:async(j)=>{process.exit(await tu(j))},explain:async(j)=>{process.exit(await Ol(l(),j))}};async function qh(j){let K=At({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},j);if(Gh(j))return;let te=j[0],re=te?mr(te):void 0;if(K.help&&re&&re.name!=="rule")tr(re.name),process.exit(0);if(!te||K.help&&!re)pi(),process.exit(0);if(K.flags.version)Nl(),process.exit(0);if(re){await Bh[re.name](j.slice(1));return}if(te==="--statusline"){await Hi(l());return}console.error(te.startsWith("-")?`Unknown option: ${te}`:`Unknown command: ${te}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{qh as runCli};
