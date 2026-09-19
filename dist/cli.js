import{a,s,ke,Ue,k,Ze,Ge,c,o,He,L,R,ve,Qe,f,We,d,r,v,i,re,n,g,le,N,tt,nt,l,ue,de,rt,A,q,oe,S,ot,F,b,Se,M,u,K,Be,ze,I,w,T,pe,fe,Re,it,m,e,Te,we,Ve,qe,ie,Ce,se,_e,J,j,Pe,me,U,Ke,G,Y,Z,ae,Je,Ye,C,H,Ae,Oe,De,E,Ne,Ee,Fe,h,t,X,ge,y,x,_,st,Me,$e,p,W}from"./chunks/index-cnqbzd01.js";import{ee,B,je,O,D}from"./chunks/index-w180j6f3.js";var Ud=["-h","--help"];function xt(P,V){let z=Object.entries(P.booleans??{}),Q=Object.entries(P.values??{}),te=Object.entries(P.lists??{}),ne=Object.fromEntries(z.map(([Xe])=>[Xe,!1])),ce={},ye=Object.fromEntries(te.map(([Xe])=>[Xe,[]])),he=[],be=[],Le=!1,Ie=-1;for(let[Xe,et]of V.entries()){if(Xe<=Ie)continue;if(et==="--"){he.push(...V.slice(Xe+1));break}if(Ud.includes(et)){Le=!0;continue}let xe=z.find(([,lt])=>lt.includes(et));if(xe){ne[xe[0]]=!0;continue}let at=Q.find(([,lt])=>lt.includes(et));if(at){let lt=V[Xe+1];if(lt===void 0||lt.startsWith("-")){be.push(`${et} requires a value`);continue}ce[at[0]]=lt,Ie=Xe+1;continue}let ct=te.find(([,lt])=>lt.includes(et));if(ct){let lt=V.slice(Xe+1),pt=lt.findIndex((gt)=>gt.startsWith("-")),mt=lt.slice(0,pt===-1?lt.length:pt);if(mt.length===0){be.push(`${et} requires at least one value`);continue}ye[ct[0]]=[...ye[ct[0]]??[],...mt],Ie=Xe+mt.length;continue}if(et.startsWith("-")){be.push(`Unknown option for ${P.label}: ${et}`);continue}if(P.positionals==="tail"){he.push(...V.slice(Xe));break}he.push(et)}if(P.positionals!=="list"&&P.positionals!=="tail")be.push(...he.map((Xe)=>`Unexpected argument for ${P.label}: ${Xe}`));return{flags:ne,values:ce,lists:ye,positionals:he,help:Le,errors:be}}function Ht(P){for(let V of P)console.error(V);return P.length>0}import{readdirSync as Wd,statSync as Ni,unlinkSync as Kd}from"node:fs";import{basename as Mi,dirname as Yd,isAbsolute as Zd,join as Xd,relative as Qd,resolve as eu,sep as tu}from"node:path";var Oi=(P)=>{let V=Date.now()-new Date(P).getTime();if(!Number.isFinite(V))return"";let z=Math.floor(V/60000),Q=Math.floor(z/60),te=Math.floor(Q/24);if(te>0)return`${te}d ago`;if(Q>0)return`${Q}h ago`;if(z>0)return`${z}m ago`;return"just now"},Qr=(P)=>{let V=(P??"").trim().split(/\s+/).filter((te)=>te&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(te)),z=V[0]?.split("/").pop();if(!z)return null;let Q=V[1];return Q&&/^[a-z][a-z0-9-]*$/.test(Q)?`${z} ${Q}`:z};function Fi(P){let V=(te)=>`${te.sessionId}
${Qr(te.segment||te.command)}`,z=P.filter((te)=>te.decision!=="allow"),Q=z.filter((te)=>te.sessionId).reduce((te,ne)=>te.set(V(ne),(te.get(V(ne))??0)+1),new Map);return new Set(z.filter((te)=>te.failureStage||(Q.get(V(te))??0)>=2))}import{existsSync as Gd,readdirSync as Bd,readFileSync as qd}from"node:fs";import{join as Vd}from"node:path";function Yt(P,V){try{return Bd(P,{withFileTypes:!0,encoding:"utf8"}).flatMap((z)=>{let Q=Vd(P,z.name);if(z.isDirectory())return Yt(Q,V);if(z.name.endsWith(".jsonl"))return[Q];return[]})}catch{if(V&&Gd(P))V.count++;return[]}}var zd=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function Jd(P){if(!P||typeof P!=="object"||Array.isArray(P))return!1;let V=P;if(typeof V.ts!=="string"||typeof V.command!=="string")return!1;return zd.every((z)=>V[z]===void 0||typeof V[z]==="string")}function pn(P,V){try{return qd(P,"utf-8").split(`
`).filter(Boolean).flatMap((z)=>{try{let Q=JSON.parse(z);if(!Jd(Q)){if(V)V.count++;return[]}return[Q]}catch{if(V)V.count++;return[]}})}catch{if(V)V.count++;return[]}}function Ct(P){return Array.from(P,(V)=>{let z=V.charCodeAt(0);if(z<=31||z>=127&&z<=159)return`\\x${z.toString(16).padStart(2,"0")}`;return V}).join("")}function nu(P,V){let z=ee(P),Q=xt({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},V);if(Ht(Q.errors))return null;if(Q.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(Q.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let te=Q.values.limit===void 0?20:ji(Q.values.limit);if(te===null)return console.error("--limit must be a positive number"),null;let ne=Q.values.since===void 0?Math.min(30,z):ji(Q.values.since);if(ne===null||ne>z)return console.error(`--since must be a positive number of days no greater than ${z}`),null;let ce={limit:te,limitExplicit:Q.values.limit!==void 0,since:ne,sinceExplicit:Q.values.since!==void 0,all:Q.flags.all,json:Q.flags.json,suspect:Q.flags.suspect,pruneLegacy:Q.flags.pruneLegacy,dryRun:Q.flags.dryRun,id:Q.values.id,agent:Q.values.agent,rule:Q.values.rule,session:Q.values.session,project:Q.values.project===void 0?void 0:eu(Q.values.project)};if(ce.id&&(ce.agent!==void 0||ce.rule!==void 0||ce.session!==void 0||ce.project!==void 0||ce.suspect||ce.sinceExplicit||ce.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(ce.pruneLegacy&&(ce.id!==void 0||ce.agent!==void 0||ce.rule!==void 0||ce.session!==void 0||ce.project!==void 0||ce.suspect||ce.all||ce.sinceExplicit||ce.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(ce.dryRun&&!ce.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return ce}async function Hi(P,V,z={}){let Q=nu(P,V);if(!Q)return 1;let te=z.logsDir??O(P);if(Q.pruneLegacy)return ru(te,Q.json,Q.dryRun);if(!te)return console.log(Q.json?"[]":Q.id?`No retained audit log entry found for id ${Ct(Q.id)}.`:"No audit log entries found."),0;B(P,te);let ne={count:0},ce=Yt(te,ne).flatMap((Ie)=>pn(Ie,ne).map((Xe)=>({entry:Xe,file:Ie})));if(ne.count>0)console.error(`warning: ${ne.count} audit log ${ne.count===1?"source":"sources"} could not be read; these results are incomplete`);if(Q.id)return au(ce,Q,z.timeZone);let ye=Date.now()-Q.since*24*60*60*1000,he=ce.filter((Ie)=>lu(Ie,Q,te,ye)),be=Q.suspect?Fi(he.map((Ie)=>Ie.entry)):null,Le=(be?he.filter((Ie)=>be.has(Ie.entry)):he).sort((Ie,Xe)=>Date.parse(Xe.entry.ts)-Date.parse(Ie.entry.ts)).slice(0,Q.limit);if(Q.json)return console.log(JSON.stringify(Le.map((Ie)=>Ie.entry),null,2)),0;if(Le.length===0)return console.log("No audit log entries found."),0;for(let Ie of Le)console.log(uu(Ie.entry,z.timeZone));return 0}function ru(P,V,z){let Q=P?iu(P).map((ye)=>Xd(P,ye)):[];if(z)return ou(Q,V);let te=[],ne=0,ce=0;for(let ye of Q){let he=Ni(ye,{throwIfNoEntry:!1})?.size??0,be=su(ye);if(be){te.push(`${Mi(ye)}: ${be}`);continue}ne++,ce+=he}if(V)return console.log(JSON.stringify({removedFiles:ne,removedBytes:ce,failedFiles:te.length})),te.length===0?0:1;console.log(ne===0&&te.length===0?"No legacy audit log files found.":`Removed ${ne} legacy audit log ${ne===1?"file":"files"} (${Ui(ce)}).`);for(let ye of te)console.error(`Could not remove ${Ct(ye)}`);if(console.log("Nested v2 audit logs were not changed."),ne>0)console.log("This deletion cannot be undone.");return te.length===0?0:1}function ou(P,V){let z=P.reduce((Q,te)=>Q+(Ni(te,{throwIfNoEntry:!1})?.size??0),0);if(V)return console.log(JSON.stringify({dryRun:!0,files:P.length,bytes:z})),0;if(console.log(P.length===0?"No legacy audit log files found.":`Would remove ${P.length} legacy audit log ${P.length===1?"file":"files"} (${Ui(z)}).`),console.log("Nested v2 audit logs are not included."),P.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function iu(P){try{return Wd(P,{withFileTypes:!0}).filter((V)=>V.isFile()&&V.name.endsWith(".jsonl")).map((V)=>V.name)}catch{return[]}}function su(P){try{return Kd(P),null}catch(V){return V instanceof Error?V.message:String(V)}}function Ui(P){let V=["B","KiB","MiB","GiB"],z=Math.min(Math.floor(Math.log2(Math.max(P,1))/10),V.length-1);return`${Math.round(P/1024**z*10)/10} ${V[z]}`}function au(P,V,z){let Q=P.filter((ne)=>ne.entry.id===V.id);if(Q.length>1)return console.error(`Multiple audit log entries found for id ${Ct(V.id??"")}.`),1;if(V.json)return console.log(JSON.stringify(Q.map((ne)=>ne.entry),null,2)),0;let te=Q[0];if(!te)return console.log(`No retained audit log entry found for id ${Ct(V.id??"")}.`),0;return console.log(pu(te.entry,z)),0}function lu(P,V,z,Q){if(!V.all&&P.entry.decision==="allow")return!1;if(Date.parse(P.entry.ts)<Q)return!1;if(V.agent!==void 0&&P.entry.agent!==V.agent)return!1;if(V.rule!==void 0&&P.entry.ruleId!==V.rule)return!1;if(V.session!==void 0&&!cu(P,z,V.session))return!1;if(V.project!==void 0&&!du(P.entry.cwd,V.project))return!1;return!0}function cu(P,V,z){if(P.entry.sessionId===z)return!0;return Yd(P.file)===V&&Mi(P.file,".jsonl")===z}function du(P,V){if(!P)return!1;let z=Qd(V,P);return z!==".."&&!z.startsWith(`..${tu}`)&&!Zd(z)}function uu(P,V){let z=Ct(P.id??"-"),Q=Ct(P.decision??"deny"),te=P.cwd?`  [${Ct(P.cwd)}]`:"",ne=P.segment||P.command,ce=ne===P.command?"":"↳ ",ye=ne.length>50?`${ne.slice(0,50)}…`:ne;return`${z.padEnd(16)}  ${Ct(Gi(P.ts,V))}  ${Q.padEnd(5)}  ${Ct(P.agent??"-").padEnd(15)}  ${Ct(P.ruleId??"-").padEnd(20)}  ${ce}${Ct(ye)}${te}`}function pu(P,V){let z=(te)=>Ct(te===void 0||te===null||te===""?"-":te),Q=P.shape?`${P.agent??"-"} (shape: ${P.shape})`:P.agent??"-";return[`id:        ${z(P.id)}`,`ts:        ${z(Gi(P.ts,V))}`,`decision:  ${z(P.decision)}`,`agent:     ${z(Q)}`,`level:     ${z(P.level)}`,`tool:      ${z(P.toolName)}`,`rule:      ${z(P.ruleId)}`,`intent:    ${z(P.intent)}`,`stage:     ${z(P.failureStage)}`,`error:     ${z(P.errorCode)}`,`session:   ${z(P.sessionId)}`,`cwd:       ${z(P.cwd)}`,`version:   ${z(P.v)}`,`truncated: ${z(P.truncated===!0?"yes":void 0)}`,`reason:    ${z(P.reason)}`,`command:   ${z(P.command)}`,`segment:   ${z(P.segment)}`].join(`
`)}function Gi(P,V){let z=new Date(P);if(Number.isNaN(z.getTime()))return P;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:V}).format(z)}function ji(P){let V=Number(P);return Number.isFinite(V)&&V>0?V:null}var Bi={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var qi={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var Vi={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var Yn=[{id:"antigravity-cli",displayName:"Antigravity CLI",doctorOrder:3,runtime:{order:1,flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:2,flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",doctorOrder:1,runtime:{order:2,displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{order:3,flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",doctorOrder:4,runtime:{order:3,flags:["-cx","--codex"],description:"Run as a Codex PreToolUse hook",legacyTopLevelFlags:[]},install:{order:4,flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",doctorOrder:7,runtime:{order:6,flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{order:7,flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",doctorOrder:6,runtime:{order:5,flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{order:6,flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"grok-build",displayName:"Grok Build",doctorOrder:8,runtime:{order:7,flags:["-gb","--grok-build"],description:"Run as Grok Build PreToolUse hook",legacyTopLevelFlags:[]},install:{order:8,flag:"--grok-build",artifactKind:"hook config",probeCommand:["grok","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",doctorOrder:9,runtime:{order:8,flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{order:9,flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",doctorOrder:10,runtime:{order:9,flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{order:10,flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",doctorOrder:11,install:{order:11,flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",doctorOrder:12,install:{order:12,flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",doctorOrder:13,install:{order:13,flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",doctorOrder:5,runtime:{order:4,flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{order:5,flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"amp",displayName:"Amp Code",doctorOrder:2,install:{order:1,flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],Zn=Yn.slice().sort((P,V)=>P.doctorOrder-V.doctorOrder).map((P)=>P.id),Sn=Yn.filter((P)=>("runtime"in P)).slice().sort((P,V)=>P.runtime.order-V.runtime.order).map((P)=>({id:P.id,displayName:"displayName"in P.runtime?P.runtime.displayName:P.displayName,flags:P.runtime.flags,legacyFlags:"legacyFlags"in P.runtime?P.runtime.legacyFlags:[],description:P.runtime.description,legacyTopLevelFlags:P.runtime.legacyTopLevelFlags})),$t=Yn.slice().sort((P,V)=>P.install.order-V.install.order).map((P)=>({id:P.id,...P.install})).map(({order:P,...V})=>V),fu=Object.fromEntries(Yn.map((P)=>[P.id,P.displayName]));function bt(P){return fu[P]}var mu=Sn.map((P)=>({flags:P.flags.join(", "),description:P.description})),gu=Sn.flatMap((P)=>P.flags.map((V)=>`cc-safety-net hook ${V}`)),zi={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...mu,{flags:"-h, --help",description:"Show this help"}],examples:gu};var Ji={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...$t.map((P)=>({flags:P.flag,description:`Install ${bt(P.id)} ${P.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...$t.map((P)=>`cc-safety-net install ${P.flag}`)]},Wi={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...$t.map((P)=>({flags:P.flag,description:`Uninstall ${bt(P.id)} ${P.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...$t.map((P)=>`cc-safety-net uninstall ${P.flag}`)]},Ki={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var Yi={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var Xn={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var eo=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],to=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],fn={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},...eo.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk",...to,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var Zi={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var Xi={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var Qn=[Zi,Bi,Yi,qi,fn,Xn,Ji,Ki,Wi,zi,Vi,Xi];function yu(P){return P.aliases??[]}function er(P){let V=P.toLowerCase();return Qn.find((z)=>z.name.toLowerCase()===V||yu(z).some((Q)=>Q.toLowerCase()===V))}import{basename as hu}from"node:path";function tr(P,V=7,z=O(P)){let Q=Date.now()-V*24*60*60*1000,te=[],ne=new Set,ce=0,ye,he,be,Le;if(z)B(P,z);let Ie={count:0},Xe=z?Yt(z,Ie):[];for(let xe of Xe)for(let at of pn(xe,Ie)){if(at.decision==="allow")continue;let ct=new Date(at.ts).getTime();if(ct>=Q){if(ce++,ne.add(at.sessionId??hu(xe,".jsonl")),he===void 0||ct<=he)ye=at.ts,he=ct;if(Le===void 0||ct>Le)be=at.ts,Le=ct;vu(te,at,ct)}}let et=te.map((xe)=>({timestamp:xe.ts,command:xe.command,reason:xe.reason,relativeTime:Oi(new Date(xe.ts))}));return{totalBlocked:ce,sessionCount:ne.size,recentEntries:et,oldestEntry:ye,newestEntry:be,unreadable:Ie.count}}function vu(P,V,z){let Q=P.findIndex((te)=>z>new Date(te.ts).getTime());if(Q===-1){if(P.length<3)P.push(V);return}if(P.splice(Q,0,V),P.length>3)P.pop()}import{dirname as Au}from"node:path";import{dirname as bu,join as Lu,resolve as wu}from"node:path";var ku="config.json";function Rt(P,V,z,Q){g(xu(P),`${JSON.stringify(V,null,2)}
`,z,Q)}function xu(P){return typeof P==="string"?re(P):P}function ro(P){return{errors:ie(Su(P),": "," "),ruleNames:new Set(_e(P).map((V)=>V.toLowerCase()))}}var Cu="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",Qi="must match pattern (letters, numbers, hyphens, underscores)";function Su(P){if(!es(P))return[e([],"Config must be an object")];return[...P.version===1?[]:[e(["version"],"must be 1")],...Ru(P.rules)]}function Ru(P){if(P===void 0)return[];if(!Array.isArray(P))return[e(["rules"],"must be an array")];return[...P.flatMap((V,z)=>es(V)?Pu(V,["rules",z]):[e(["rules",z],"must be an object")]),...Te(P)]}function Pu(P,V){return[...no(P.name,[...V,"name"],"required string",l,Cu),...no(P.command,[...V,"command"],"required string",w,Qi),...P.subcommand===void 0?[]:no(P.subcommand,[...V,"subcommand"],"must be a string if provided",w,Qi),...Eu(P.block_args,[...V,"block_args"]),...Du(P.reason,[...V,"reason"]),...P.intent===void 0||Ce(P.intent)?[]:[e([...V,"intent"],we)]]}function no(P,V,z,Q,te){if(typeof P!=="string")return[e(V,z)];return Q.test(P)?[]:[e(V,te)]}function Eu(P,V){if(!Array.isArray(P))return[e(V,"required array")];if(P.length===0)return[e(V,"must have at least one element")];return P.flatMap((z,Q)=>{if(typeof z!=="string")return[e([...V,Q],"must be a string")];return z===""?[e([...V,Q],"must not be empty")]:[]})}function Du(P,V){if(typeof P!=="string")return[e(V,"required string")];if(P==="")return[e(V,"must not be empty")];return P.length>T?[e(V,`must be at most ${T} characters`)]:[]}function es(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}function oo(P){let V=ts(P);if(!V.ok)return V.result;return ro(V.parsed)}function ts(P){let V=[],z=new Set;try{let Q=typeof P==="string"?re(P):P,te=n(Q);if(te===null)return V.push(`File not found: ${Q.path}`),{ok:!1,result:{errors:V,ruleNames:z}};if(!te.trim())return V.push("Config file is empty"),{ok:!1,result:{errors:V,ruleNames:z}};return{ok:!0,parsed:JSON.parse(te)}}catch(Q){if(Q instanceof r)return V.push(Q.message),{ok:!1,result:{errors:V,ruleNames:z}};let te=Q instanceof Error?Q.message:String(Q);return V.push(Q instanceof SyntaxError?"Invalid JSON":te),{ok:!1,result:{errors:V,ruleNames:z}}}}function ns(P){return wu(P,".safety-net.json")}function Jt(P){let V=ts(P);if(!V.ok)return V.result;let z=Ve(V.parsed);return{errors:z.errors,ruleNames:z.sources}}function nr(P,V={}){return Lu(bu(Se(P,V)),ku)}function rs(P,V,z){let Q;try{if(n(V)===null)return{path:P,exists:!1,valid:!1,ruleCount:0};Q=Jt(V),Q.errors.push(...j(P,z))}catch(te){if(!(te instanceof r))throw te;Q={errors:[te.message],ruleNames:new Set}}return{path:P,exists:!0,valid:Q.errors.length===0,ruleCount:Q.ruleNames.size,...Q.errors.length>0?{errors:Q.errors}:{}}}function _u(P,V){return{source:V,name:P.name,command:P.command,subcommand:P.subcommand,blockArgs:[...P.block_args],reason:P.reason}}function os(P,V){let z=M(P),Q=F(V),te=Au(z),ne=J(P,{cwd:V,userConfigPath:z,projectConfigPath:Q,userConfigDir:te}),ce=K(P,{cwd:V,userConfigPath:z,projectConfigPath:Q,userConfigDir:te}),ye=new Map(ne.rulebooks.flatMap((he)=>he.rules.map((be)=>[be,he.source])));return{userConfig:rs(z,ce.userConfigTarget,ce.userScope),projectConfig:rs(Q,ce.projectConfigTarget,ce.projectScope),effectiveRules:ne.rules.map((he)=>_u(he,ye.get(he.name)??"project"))}}var Tu=[{flag:o.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:o.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:o.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:o.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:o.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:o.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:o.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:o.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"}];function is(P){return[...Tu.map((V)=>({name:V.flag.name,value:ve(V.flag,P.env),isSet:Qe(V.flag,P.env),legacyName:V.flag.legacyName,legacyValue:V.flag.legacyName?P.env.get(V.flag.legacyName):void 0,legacyIsSet:V.flag.legacyName?P.env.get(V.flag.legacyName)!==void 0:void 0,description:V.description,defaultBehavior:V.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:P.env.get("CC_SAFETY_NET_HOME"),isSet:P.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var ss={error:0,warning:1,info:2},$u=["policy","config","audit"];function Iu(P){return P.map((V)=>{if(V==="ownership")return"is not owned by the current user";if(V==="permissions")return"has unsafe permissions";if(V==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var Ou=[{derive:(P)=>P.hooks.length>0&&P.hooks.every((V)=>!V.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(P)=>P.hooks.filter((V)=>V.inspectionStatus==="failed").map((V)=>{let z=bt(V.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${z} inspection failed`,detail:`Doctor could not verify the ${z} integration configuration.`,fixHint:`Correct the reported ${z} configuration error, then run \`cc-safety-net doctor\` again.`,integration:V.platform}})},{derive:(P)=>P.userConfig.exists&&!P.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:P.userConfig.path}]:[]},{derive:(P)=>P.projectConfig.exists&&!P.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:P.projectConfig.path}]:[]},{derive:(P)=>P.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${P.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(P)=>P.v2Leftovers&&P.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${P.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(P)=>{let V=P.environment.find((z)=>z.name==="CC_SAFETY_NET_AUDIT_SCOPE");return He(V?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...$u.map((P)=>({derive:(V)=>V.posture.directories.filter((z)=>z.kind===P&&z.status==="unsafe").map((z)=>({checkId:`posture.${P}-directory-unsafe`,severity:"error",title:`${P[0]?.toUpperCase()}${P.slice(1)} directory is unsafe`,detail:`The ${P} directory ${Iu(z.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...z.path?{path:z.path}:{}}))})),{derive:(P)=>{let V=[...P.effectiveSafety.weakenedRuleOverrides].sort();return V.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${V.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${V.join(", ")}.`}]:[]}}];function as(P){return Ou.flatMap((V,z)=>V.derive(P).map((Q,te)=>({finding:Q,catalogOrder:z,occurrence:te}))).sort((V,z)=>ss[V.finding.severity]-ss[z.finding.severity]||V.catalogOrder-z.catalogOrder||V.occurrence-z.occurrence).map((V)=>V.finding)}function Ut(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var Fu=(P)=>Ut()?`\x1B[32m${P}\x1B[0m`:P,ju=(P)=>Ut()?`\x1B[33m${P}\x1B[0m`:P,Nu=(P)=>Ut()?`\x1B[34m${P}\x1B[0m`:P,Mu=(P)=>Ut()?`\x1B[36m${P}\x1B[0m`:P,Hu=(P)=>Ut()?`\x1B[31m${P}\x1B[0m`:P,Uu=(P)=>Ut()?`\x1B[2m${P}\x1B[0m`:P,Gu=(P)=>Ut()?`\x1B[1m${P}\x1B[0m`:P,dt={green:Fu,yellow:ju,blue:Nu,cyan:Mu,red:Hu,dim:Uu,bold:Gu},Bu="\x1B[0m",qu=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function Vu(P){let V=P;return()=>(V=(V*1664525+1013904223)%4294967296,V/4294967296)}function zu(P){let V=[...qu],z=Vu(P);for(let Q=V.length-1;Q>0;Q--){let te=Math.floor(z()*(Q+1)),ne=V[Q];V[Q]=V[te],V[te]=ne}return V}function Ju(P,V=0){if(!Ut())return"";let z=zu(V);return`\x1B[38;5;${z[P%z.length]}m`}function ls(P,V,z=0){if(!Ut())return`"${P}"`;return`${Ju(V,z)}"${P}"${Bu}`}function rr(P){return P==="default"?"built-in default":`${P} policy`}var Wu=new RegExp("\x1B\\[[0-9;]*m","g"),io=(P)=>P.replace(Wu,"").length;function Zt(P){let V=(P.headers??P.rows[0]??[]).map((ce,ye)=>{let he=Math.max(...P.rows.map((be)=>io(be[ye]??"")));return Math.max(io(ce),he)}),z=(ce,ye)=>ce+" ".repeat(Math.max(0,ye-io(ce))),Q=(ce,ye)=>ye[0]+V.map((he)=>ce.repeat(he+2)).join(ye[1])+ye[2],te=(ce)=>`│ ${ce.map((ye,he)=>z(ye,V[he]??0)).join(" │ ")} │`,ne=P.headers?[`   ${te(P.headers)}`,`   ${Q("─",["├","┼","┤"])}`]:[];return[`   ${Q("─",["┌","┬","┐"])}`,...ne,...P.rows.map((ce)=>`   ${te(ce)}`),`   ${Q("─",["└","┴","┘"])}`].join(`
`)}function cs(P){let V=[];V.push("Hook Integration"),V.push(Ku(P));let z=[],Q=[];for(let te of P){let ne=bt(te.platform);if(te.errors&&te.errors.length>0)for(let ce of te.errors)if(te.configured)z.push({platform:ne,message:ce});else Q.push({platform:ne,message:ce})}for(let te of z)V.push(`   Warning (${te.platform}): ${te.message}`);for(let te of Q)V.push(dt.red(`   Error (${te.platform}): ${te.message}`));return V.join(`
`)}function Ku(P){let V=["Platform","Discovery","Configuration","Inspection"],z=P.map((Q)=>{let te=bt(Q.platform);if(Q.inspectionStatus==="not-inspected"){let he=dt.dim("Not inspected");return[te,he,he,he]}let ne=Q.detected?dt.green("Detected"):Q.inspectionStatus==="failed"?dt.red("Unknown"):dt.dim("Not detected"),ce=Q.configured?dt.green("Configured"):Q.detected?dt.yellow("Not configured"):Q.inspectionStatus==="failed"?dt.red("Unknown"):dt.dim("Not applicable"),ye=Q.inspectionStatus==="verified"?dt.green("Verified"):Q.inspectionStatus==="failed"?dt.red("Failed"):dt.dim("Not applicable");return[te,ne,ce,ye]});return Zt({headers:V,rows:z})}function ds(P){let z=["Guard Engine Verification",`   Synthetic self-test: ${P.failed>0?dt.red(`${P.passed}/${P.total} FAIL`):dt.green(`${P.passed}/${P.total} passed`)}`],Q=P.results.filter((te)=>!te.passed);if(Q.length>0){z.push(""),z.push(dt.red("   Failures:"));for(let te of Q)z.push(dt.red(`   • ${te.description}`)),z.push(dt.red(`     expected ${te.expected}, got ${te.actual}`))}return z.join(`
`)}function Yu(P){if(P.length===0)return"   (no custom rules)";let V=["Source","Name","Command","Block Args"],z=P.map((Q)=>[Q.source,Q.name,Q.subcommand?`${Q.command} ${Q.subcommand}`:Q.command,Q.blockArgs.join(", ")]);return Zt({headers:V,rows:z})}function us(P){let V=[];if(V.push("Configuration"),V.push(Zu(P.userConfig,P.projectConfig)),V.push(""),P.effectiveRules.length>0)V.push(`   Effective rules (${P.effectiveRules.length} total):`),V.push(Yu(P.effectiveRules));else V.push("   Effective rules: (none - using built-in rules only)");return V.join(`
`)}function Zu(P,V){let z=["Scope","Status"],Q=(ne)=>{if(!ne.exists)return dt.dim("N/A");if(!ne.valid)return dt.red(`Invalid (${ne.errors?.[0]??"unknown error"})`);return dt.green("Configured")},te=[["User",Q(P)],["Project",Q(V)]];return Zt({headers:z,rows:te})}function ps(P){let V=[];return V.push("Environment"),V.push(Xu(P)),V.join(`
`)}function fs(P){let V=P.effectiveSafety.policyScopes,z=["Effective Safety",`   Selected preset: ${P.effectiveSafety.selectedPreset}${V?` (${rr(V.levelScope)})`:""}`,`   Effective: ${P.effectiveSafety.level}`],Q=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[te,ne]of Q){let ce=P.effectiveSafety.capabilities[te],ye=ce.enabled?dt.green("ON"):dt.dim("OFF"),he=ce.sources.length>0?` (${ce.sources.join(", ")})`:"";z.push(`   ${ne}: ${ye} via ${ce.source}${he}`)}if(V&&V.weakenings.length>0){z.push("   Project policy deltas:");for(let te of V.weakenings)z.push(`      ${te}`)}z.push(`   Stored rule customizations: ${P.effectiveSafety.ruleCounts.stored}`),z.push(`   Effective rule customizations: ${P.effectiveSafety.ruleCounts.effective}`);for(let[te,ne]of Object.entries(P.effectiveSafety.ruleOverrides))z.push(`   ${te}: ${ne}`);return z.join(`
`)}function ms(P){let V=["Findings"];if(P.length===0)return V.push("   No findings from inspected doctor facts."),V.join(`
`);for(let z of P){let Q=`[${z.severity.toUpperCase()}] ${z.checkId}: ${Ct(z.title)}`,te=z.severity==="error"?dt.red:z.severity==="warning"?dt.yellow:dt.blue;if(V.push(`   ${te(Q)}`),V.push(`      ${Ct(z.detail)}`),z.path)V.push(`      Path: ${Ct(z.path)}`);if(z.fixHint)V.push(`      Fix: ${Ct(z.fixHint)}`)}return V.join(`
`)}function Xu(P){let V=["Variable","Status","Legacy"],z=P.map((Q)=>{let te=Q.isSet?dt.green("✓"):dt.dim("✗"),ne=Q.legacyName&&Q.legacyIsSet?`${Q.legacyName} ${dt.green("✓")}`:Q.legacyName??"";return[Q.name,te,ne]});return Zt({headers:V,rows:z})}function gs(P){let V=[];if(P.totalBlocked===0)V.push("Recent Activity"),V.push("   No blocked commands in the last 7 days"),V.push("   Tip: This is normal for new installations");else V.push(`Recent Activity · last 7 days (${P.totalBlocked} blocked / ${P.sessionCount} sessions)`),V.push(Qu(P.recentEntries));if(P.unreadable>0)V.push(`   Warning: ${P.unreadable} audit log ${P.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return V.join(`
`)}function Qu(P){let V=["Time","Command"],z=P.map((Q)=>{let te=Ct(Q.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),ne=te.length>40?`${te.slice(0,37)}...`:te;return[Q.relativeTime,ne]});return Zt({headers:V,rows:z})}function ys(P){let V=[];if(V.push("Update Check"),P.latestVersion===null&&!P.error)return V.push(or([["Status",dt.dim("Skipped")],["Installed",P.currentVersion]])),V.join(`
`);if(P.error)return V.push(or([["Status",`${dt.yellow("⚠")} Error`],["Installed",P.currentVersion],["Error",dt.dim(P.error)]])),V.join(`
`);if(P.updateAvailable)return V.push(or([["Status",`${dt.yellow("⚠")} Update Available`],["Current",P.currentVersion],["Latest",dt.green(P.latestVersion??"")]])),V.push(""),V.push("   Run: bunx cc-safety-net@latest doctor"),V.push("   Or:  npx cc-safety-net@latest doctor"),V.join(`
`);return V.push(or([["Status",`${dt.green("✓")} Up to date`],["Version",P.currentVersion]])),V.join(`
`)}function or(P){return Zt({rows:P})}function hs(P){let V=[];return V.push("System Info"),V.push(ep(P)),V.join(`
`)}function ep(P){let V=["Component","Version"],z=(ne)=>{if(ne===null)return dt.dim("not found");return ne},te=[{label:"cc-safety-net",value:P.version},...Zn.map((ne)=>({label:bt(ne),value:P.versions[ne]??null})),{label:"Node.js",value:P.nodeVersion},{label:"npm",value:P.npmVersion},{label:"Bun",value:P.bunVersion},{label:"Platform",value:P.platform}].map((ne)=>[ne.label,z(ne.value)]);return Zt({headers:V,rows:te})}function vs(P){if(P.findings.length===0)return dt.green(`
No findings from inspected doctor facts.`);let V={error:P.findings.filter((ne)=>ne.severity==="error").length,warning:P.findings.filter((ne)=>ne.severity==="warning").length,info:P.findings.filter((ne)=>ne.severity==="info").length},z=["error","warning","info"].filter((ne)=>V[ne]>0).map((ne)=>`${V[ne]} ${ne}`),Q=P.findings.length===1?"finding":"findings",te=`
${P.findings.length} ${Q}: ${z.join(", ")}.`;if(V.error>0)return dt.red(te);if(V.warning>0)return dt.yellow(te);return dt.blue(te)}import{lstatSync as tp}from"node:fs";import{dirname as so}from"node:path";function ao(P,V){try{let z=tp(V);if(z.isSymbolicLink())return{kind:P,path:V,status:"unsafe",issues:["symlink"]};if(!z.isDirectory())return{kind:P,path:V,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:P,path:V,status:"unknown",issues:[]};let Q=[...z.uid!==process.getuid()?["ownership"]:[],...(z.mode&18)!==0?["permissions"]:[]];return{kind:P,path:V,status:Q.length>0?"unsafe":"safe",issues:Q}}catch(z){if(typeof z==="object"&&z!==null&&"code"in z&&z.code==="ENOENT")return{kind:P,path:V,status:"not-applicable",issues:[]};return{kind:P,path:V,status:"unknown",issues:[]}}}function bs(P,V){let z=O(P);return{directories:[ao("policy",so(so(V))),ao("config",so(V)),...z?[ao("audit",z)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as np}from"node:child_process";import{existsSync as Ls}from"node:fs";import{delimiter as rp,extname as op,join as ip}from"node:path";import{stripVTControlCharacters as ws}from"node:util";var xs="2.4.3",sp=5000,ap="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function wt(){return xs}function lo(P,V){let z=P[V];if(z)return z;let Q=Object.keys(P).find((te)=>te.toLowerCase()===V.toLowerCase()&&!!P[te]);return Q?P[Q]:z}function lp(P){return(lo(P,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((V)=>V.length>0)}function cp(P,V){let z=op(P)?[P]:[...lp(V).map((Q)=>`${P}${Q}`),P];if(P.includes("/")||P.includes("\\"))return z.find((Q)=>Ls(Q))??P;return(lo(V,"PATH")??"").split(rp).flatMap((Q)=>z.map((te)=>ip(Q,te))).find((Q)=>Ls(Q))??P}function ks(P){if(!/[\s"&|<>^]/.test(P))return P;return`"${P.replace(/"/g,'""')}"`}function Xt(P,V){let[z,...Q]=P,te=V[ap]==="win32"?"win32":process.platform;if(!z||te!=="win32")return{cmd:z??"",args:Q};let ne=cp(z,V);if(!/\.(?:bat|cmd)$/i.test(ne))return{cmd:ne,args:Q};return{cmd:lo(V,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",ks(ne),...Q.map(ks)].join(" ")]}}var mn=async(P,V=sp)=>{let z=await dp(P,{timeoutMs:V});if(z.code!==0)return null;return ws(z.stdout).trim()||ws(z.stderr).trim()||null};function dp(P,V){let[z,...Q]=P;if(!z)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((te)=>{try{let ne=Xt([z,...Q],process.env),ce=np(ne.cmd,ne.args,{stdio:["ignore","pipe","pipe"]}),ye=!1,he="",be="";ce.stdout.on("data",(Xe)=>{he+=Xe.toString()}),ce.stderr.on("data",(Xe)=>{be+=Xe.toString()});let Le=(Xe)=>{if(ye)return;ye=!0,clearTimeout(Ie),te(Xe)},Ie=setTimeout(()=>{ce.kill(),Le({code:null,stdout:he,stderr:be})},V.timeoutMs);ce.on("close",(Xe)=>{Le({code:Xe,stdout:he,stderr:be})}),ce.on("error",()=>{Le({code:null,stdout:he,stderr:be})})}catch{te({code:null,stdout:"",stderr:""})}})}function ir(P){if(!P)return null;let V=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(P);if(V)return V[1]??null;let z=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(P);if(z)return z[1]??null;return P.split(`
`)[0]?.trim()||null}async function sr(P=mn){let[V,z,Q,te,ne,ce]=await Promise.all([Promise.all($t.map(async(ye)=>[ye.id,ir(await P([...ye.probeCommand]))])),P(["codex","plugin","list"],30000),P(["amp","plugins","list"],30000),P(["node","--version"]),P(["npm","--version"]),P(["bun","--version"])]);return{version:xs,versions:Object.fromEntries(V),codexPluginListOutput:z,ampPluginListOutput:Q,nodeVersion:ir(te),npmVersion:ir(ne),bunVersion:ir(ce),platform:`${process.platform} ${process.arch}`}}function co(P,V){if(V==="dev")return!1;let z=P.split(".").map(Number),Q=V.split(".").map(Number),[te=0,ne=0,ce=0]=z,[ye=0,he=0,be=0]=Q;if(te!==ye)return te>ye;if(ne!==he)return ne>he;return ce>be}async function Wt(){let P=wt(),V=new AbortController,z=setTimeout(()=>V.abort(),3000);try{let Q=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:V.signal});if(!Q.ok)return{currentVersion:P,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${Q.status}`};let te=await Q.json(),ne=co(te.version,P);return{currentVersion:P,latestVersion:te.version,updateAvailable:ne}}catch(Q){return{currentVersion:P,latestVersion:null,updateAvailable:!1,error:Q instanceof Error?Q.message:"Network error"}}finally{clearTimeout(z)}}import*as _s from"node:readline";var Ps=(P)=>`\x1B[${P}B`,up=(P)=>`\x1B[${P}A`;var Cs=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function pp(P){return new Promise((V)=>setTimeout(V,P))}function fp(P,V,z){if(!z)return V(P);if(z.aborted)return Promise.resolve();return new Promise((Q,te)=>{let ne=()=>z.removeEventListener("abort",ce),ce=()=>{ne(),Q()};z.addEventListener("abort",ce,{once:!0}),V(P).then(()=>{ne(),Q()},(ye)=>{ne(),te(ye)})})}function ar(P){return Math.max(0,Math.min(1,P))}function gn(P){return Math.max(0,Math.min(255,Math.round(P)))}function uo(P){return P<=0.0031308?12.92*P:1.055*P**0.4166666666666667-0.055}function mp(P,V,z){let Q=z*Math.PI/180,te=V*Math.cos(Q),ne=V*Math.sin(Q),ce=(P+0.3963377774*te+0.2158037573*ne)**3,ye=(P-0.1055613458*te-0.0638541728*ne)**3,he=(P-0.0894841775*te-1.291485548*ne)**3;return{blue:gn(uo(ar(-0.0041960863*ce-0.7034186147*ye+1.707614701*he))*255),green:gn(uo(ar(-1.2684380046*ce+2.6097574011*ye-0.3413193965*he))*255),red:gn(uo(ar(4.0767416621*ce-3.3077115913*ye+0.2309699292*he))*255)}}function po(P,V){let z=(V*P*180/Math.PI%360+360)%360;return mp(0.72,0.15,z)}function Es(P,V=0.1){let z=po(V,P);return`\x1B[38;2;${z.red};${z.green};${z.blue}m`}function gp(P,V){return{blue:gn(P.blue+(255-P.blue)*V),green:gn(P.green+(255-P.green)*V),red:gn(P.red+(255-P.red)*V)}}function Ds(P,V,z){let Q=Math.imul(P+2654435769,2246822507)^Math.imul(V+3266489909,668265263)^Math.imul(z+374761393,2654435761),te=Q^Q>>>15,ne=Math.imul(te,739982445),ce=ne^ne>>>12,ye=Math.imul(ce,695872825);return((ye^ye>>>15)>>>0)/4294967296}function yp(P,V,z){let Q=Math.floor(Ds(P,V,z)*Cs.length);return Cs[Q]??"░"}function Ss(P){let V=ar(P);return V*V*V*(V*(V*6-15)+10)}function hp(P){if(P.length===0)return"";let V=[],z=!1,Q="";for(let te of P){let ne=`${te.red};${te.green};${te.blue}`;if(te.bold!==z)V.push(te.bold?"\x1B[1m":"\x1B[22m"),z=te.bold;if(ne!==Q)V.push(`\x1B[38;2;${ne}m`),Q=ne;V.push(te.character)}return`${V.join("")}\x1B[22m\x1B[39m`}function vp(P,V,z,Q,te){return P.map((ne,ce)=>({...po(z,Q+V+ce/te),bold:!1,character:ne}))}function bp(P,V,z,Q,te,ne,ce,ye){let he=Math.max(1,Q*0.75),be=Math.min(1,z/he),Le=te*Ss(be),Ie=Math.max(0,(z-he)/Math.max(1,Q-he)),Xe=(1-Ss(z/Q))*ye*2,et=0.35*Math.max(0,1-Ie*2),xe=be>=1,at=Math.min(P.length,Math.ceil(Le+2+1));return P.slice(0,at).map((ct,lt)=>{let pt=po(ne,ce+V+lt/ye+Xe),mt=lt+Ds(V,lt,7919)*2-1;if(mt>Le+2)return{...pt,bold:!1,character:" "};let gt=Le-mt,ut=0.8*Math.exp(-(gt*gt)/12.5),vt=Math.min(0.9,ut+et),Dt=!xe&&mt>Le-4;return{...gp(pt,vt),bold:vt>0.3,character:Dt?yp(V,lt,z):ct}})}function Rs(P){return`\x1B[?2026h${P.map((V,z)=>`\x1B8${z>0?Ps(z):""}${hp(V)}`).join("")}\x1B[?2026l`}async function fo(P,V={}){if(!P)return;let z=V.output??process.stdout,Q=V.sleep??pp,te=V.seed??0,ne=P.split(`
`).map((Le)=>Array.from(Le)),ce=Math.max(...ne.map((Le)=>Le.length)),ye=12000*ne.filter((Le)=>Le.length>0).length/40,he=ce>0?Math.max(1,Math.ceil(ye/16.666666666666668)):0,be=he>0?ye/he:0;z.write(`\x1B[?25l${ne.length>1?`${`
`.repeat(ne.length-1)}${up(ne.length-1)}`:""}\x1B7`);try{for(let Le=1;Le<=he;Le+=1){if(V.signal?.aborted)break;z.write(Rs(ne.map((Ie,Xe)=>bp(Ie,Xe,Le,he,ce,0.1,te,3)))),await fp(be,Q,V.signal)}}finally{if(z.write(Rs(ne.map((Le,Ie)=>vp(Le,Ie,0.1,te,3)))),z.write("\x1B8"),ne.length>1)z.write(Ps(ne.length-1));z.write(`
\x1B[0m\x1B[?25h`)}}var As=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function Lp(P){return Boolean(P.isTTY)}async function Rn(P={}){let V=P.output??process.stdout;if(!Lp(V))return;let z=P.input??process.stdin,Q={output:V,seed:P.seed??Math.random()*8192,sleep:P.sleep};if(!z.isTTY||typeof z.setRawMode!=="function"){await fo(As,Q);return}let te=new AbortController,ne=z.readableFlowing===!0,ce=z.isRaw===!0,ye=!1,he=(be,Le)=>{if(Le.ctrl&&Le.name==="c")ye=!0;if(ye||Le.name==="return"||Le.name==="enter")te.abort()};_s.emitKeypressEvents(z),z.on("keypress",he),z.setRawMode(!0),z.resume();try{await fo(As,{...Q,signal:te.signal})}finally{if(z.off("keypress",he),z.setRawMode(ce),!ne)z.pause()}if(!ye)return;if(P.onInterrupt){P.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as Sp}from"node:crypto";import{existsSync as Is}from"node:fs";import{dirname as lr,join as Os}from"node:path";import{dirname as Ts,join as wp,resolve as kp}from"node:path";var xp="rule.lock";function Cp(P){return wp(Ts(P),xp)}function $s(P={}){return kp(P.cwd??process.cwd(),".safety-net.json")}function Pt(P,V){let z=V.global?V.userConfigPath??M(P,V):V.projectConfigPath??F(V.cwd??process.cwd()),Q=V.global?Be(P,V):ze(z,V.cwd??process.cwd()),te=Cp(z);return{configDir:Ts(z),configPath:z,lockPath:te,filesystemScope:Q,configTarget:i(Q,z),lockTarget:i(Q,te)}}var Rp="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",Pp="cache",Ep="rulebooks";function Fs(P,V={}){let z=Pt(P,V),Q=i(z.filesystemScope,Ns(z.configDir)),te=n(z.lockTarget);if(console.log(Rp),te===null&&!Is(Q.path))return console.log(`No v2 lock or cache leftovers found in ${lr(z.configDir)}; nothing to migrate.`),0;let ne=$p(te),ce=m(z.configTarget);if(!ce.config&&(n(z.configTarget)!==null||ne.size>0))return console.error(`Cannot migrate: the rules config in ${lr(z.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let ye=ce.config?.rules??[];for(let he of ye.flatMap((be)=>Dp(be,ne,z,Q,V.global===!0)))console.log(he);return N(z.lockTarget),tt(Q),console.log(`Removed the v2 lock and cache under ${lr(z.configDir)}.`),0}function js(P,V){return[...new Set([{cwd:V},{cwd:V,global:!0}].flatMap((z)=>{let Q=Pt(P,z);return[Q.lockPath,Ns(Q.configDir)]}))].filter((z)=>Is(z))}function Dp(P,V,z,Q,te){if(!S(P))return[];let ne=A(P).name,ce=i(z.filesystemScope,I(z.configDir,ne)),ye=n(ce);if(ye!==null&&Ap(ye,ne))return[];let he=V.get(P),be=he?_p(he,ne,Q.path,z.filesystemScope):null;if(be===null)return[`Could not migrate ${P} from the v2 cache. Run \`cc-safety-net rule update ${P}${te?" --global":""}\` to vendor it.`];if(g(ce,be),ye!==null)return[`Restored ${P} from the v2 cache over an invalid file.`];return[`Vendored ${P} from the v2 cache.`]}function Ap(P,V){let z=me(P);return!("problem"in z)&&z.rulebook.name===V}function _p(P,V,z,Q){let te=Os(z,Ep,`${Tp(P)}--${P.digest.replace("sha256:","").slice(0,12)}`,ue),ne=n(i(Q,te));if(ne===null||Fp(ne)!==P.digest)return null;let ce=me(ne);if("problem"in ce||ce.rulebook.name!==V)return null;return ne}function Ns(P){return Os(lr(P),Pp)}function Tp(P){return([P.owner,P.repo,P.display_ref,P.name].every((Q)=>typeof Q==="string"&&Q!=="")?`${P.owner}/${P.repo}#${P.display_ref}/${P.name}`:P.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function $p(P){let V=P===null?null:Op(P),z=Ms(V)&&Array.isArray(V.rulebooks)?V.rulebooks:[];return new Map(z.filter(Ip).map((Q)=>[Q.spec,Q]))}function Ip(P){return Ms(P)&&typeof P.spec==="string"&&typeof P.digest==="string"}function Ms(P){return!!P&&typeof P==="object"}function Op(P){try{return JSON.parse(P)}catch{return null}}function Fp(P){return`sha256:${Sp("sha256").update(P).digest("hex")}`}var Hs="\r\x1B[2K",jp="\x1B[?25l",Np="\x1B[39m",Mp="\x1B[?25h",Hp=100,Up=0.55,Gp=80,Us=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function Bp(P){return new Promise((V)=>setTimeout(V,P))}async function cr(P,V={}){let z=V.output??process.stdout;if(!z.isTTY)return P;let Q=V.sleep??Bp,te=!1,ne=P.then((ye)=>(te=!0,ye),(ye)=>{throw te=!0,ye});if(await Promise.race([ne.then(()=>!0),Q(Hp).then(()=>!1)]))return ne;z.write(jp);try{for(let ye=0;!te;ye+=1)z.write(`${Hs}${Es(ye*Up)}${Us[ye%Us.length]}${Np} ${V.loadingMessage??"Loading…"}`),await Promise.race([ne,Q(Gp)]);return await ne}finally{z.write(`${Hs}${Mp}`)}}async function Pn(P,V,z,Q={}){let te=V();if(P)await z();if(P&&te.ready)await cr(te.ready,Q);return te.finish()}import{stripVTControlCharacters as qp}from"node:util";var dr="amp plugins list",Vp=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function Gs(P){if(!P.ampPluginListOutput)return{platform:"amp",status:"n/a"};let V=qp(P.ampPluginListOutput).split(`
`).map((z)=>Vp.exec(z)?.[1]).find((z)=>z!==void 0);if(!V)return{platform:"amp",status:"n/a"};if(V!=="active")return{platform:"amp",status:"disabled",method:dr,configPath:dr,errors:[`Amp personal plugin cc-safety-net is ${V}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:dr,configPath:dr}}import{existsSync as Wp,readFileSync as Kp}from"node:fs";import{isAbsolute as Y1,join as Jp,relative as Z1}from"node:path";function En(P){return Jp(P,".gemini","config","hooks.json")}var Yp=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function Zp(P){if(!P||typeof P!=="object"||Array.isArray(P))return[];return Object.values(P).flatMap((V)=>{if(!V||typeof V!=="object"||Array.isArray(V))return[];let z=V,Q=z.PreToolUse;if(!Array.isArray(Q))return[];return Q.flatMap((te)=>{if(!te||typeof te!=="object"||Array.isArray(te))return[];let ne=te.hooks;if(!Array.isArray(ne))return[];return ne.flatMap((ce)=>{if(!ce||typeof ce!=="object"||Array.isArray(ce))return[];let ye=ce.command;if(typeof ye!=="string"||!Yp.test(ye))return[];return[{command:ye,enabled:z.enabled!==!1}]})})})}function Bs(P){let V=En(P.environment.home);if(!Wp(V))return{platform:"antigravity-cli",status:"n/a",configPath:V};let z;try{z=Zp(JSON.parse(Kp(V,"utf-8")))}catch(Q){return{platform:"antigravity-cli",status:"n/a",configPath:V,errors:[`Failed to parse Antigravity hooks config ${V}: ${Q instanceof Error?Q.message:String(Q)}`]}}if(z.some((Q)=>Q.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:V};if(z.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:V};return{platform:"antigravity-cli",status:"n/a",configPath:V}}import{join as qs}from"node:path";import{existsSync as Xp,lstatSync as Qp,readFileSync as e2}from"node:fs";function Ft(P,V=(z)=>z){if(!Xp(P))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(V(e2(P,"utf-8")))}}catch{return{kind:"unreadable"}}}function Lt(P){try{return Qp(P)}catch{return}}function ur(P,V){let z=Lt(V);if(!z)return{platform:P,status:"n/a",configPath:V};if(!z.isSymbolicLink()&&z.isDirectory())return;return{platform:P,status:"n/a",configPath:V,errors:[`${V} is a symlink or not a directory; move or remove it before installing`]}}function ft(P,V){return typeof P==="object"&&P!==null?P[V]:void 0}var mo="cc-safety-net@cc-marketplace";function Vs(P){return qs(P.home,".claude","plugins","installed_plugins.json")}function zs(P,V){let z=ft(ft(P,"plugins"),V);return Array.isArray(z)&&z.length>0}function pr(P,V){let z=Ft(Vs(P));return z.kind==="ok"&&zs(z.value,V)}function go(P){let V=Vs(P),z=Ft(V);if(z.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(z.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!zs(z.value,mo))return{platform:"claude-code",status:"n/a"};let Q=qs(P.home,".claude","settings.json"),te=Ft(Q);if(te.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(te.kind==="ok"&&ft(ft(te.value,"enabledPlugins"),mo)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:Q,errors:[`${mo} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:V}}function Js(P){return go(P.environment)}function Ws(P){if(!P.codexPluginListOutput)return{platform:"codex",status:"n/a"};let V=P.codexPluginListOutput.split(`
`).find((z)=>z.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!V)return{platform:"codex",status:"n/a"};if(!V.includes("installed,"))return{platform:"codex",status:"n/a"};if(!V.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list"}}import{existsSync as hr,readdirSync as t2,readFileSync as n2}from"node:fs";import{join as St}from"node:path";function At(P){let V="",z=0,Q=!1,te=!1,ne=-1;while(z<P.length){let ce=P[z],ye=P[z+1];if(te){V+=ce,te=!1,z++;continue}if(ce==='"'&&!Q){Q=!0,ne=-1,V+=ce,z++;continue}if(ce==='"'&&Q){Q=!1,V+=ce,z++;continue}if(ce==="\\"&&Q){te=!0,V+=ce,z++;continue}if(Q){V+=ce,z++;continue}if(ce==="/"&&ye==="/"){while(z<P.length&&P[z]!==`
`)z++;continue}if(ce==="/"&&ye==="*"){z+=2;while(z<P.length-1){if(P[z]==="*"&&P[z+1]==="/"){z+=2;break}z++}continue}if(ce===","){ne=V.length,V+=ce,z++;continue}if(ce==="}"||ce==="]"){if(ne!==-1){let he=V.slice(ne+1);if(/^\s*$/.test(he))V=V.slice(0,ne)+he}ne=-1,V+=ce,z++;continue}if(!/\s/.test(ce))ne=-1;V+=ce,z++}return V}function Ys(P,V,z){let Q=V+1,te=!1;while(Q<P.length){if(te){te=!1,Q++;continue}if(P[Q]==="\\"){te=!0,Q++;continue}if(P[Q]==='"')return Q+1;Q++}throw Error(z)}function ho(P,V,z){let Q=P[V],te=Q==="["?"]":"}",ne=0,ce=V;while(ce<P.length){let ye=z.skipComment?.(P,ce)??ce;if(ye!==ce){ce=ye;continue}if(P[ce]==='"'){ce=Ys(P,ce,z.stringError);continue}if(P[ce]===Q)ne++;if(P[ce]===te){if(ne--,ne===0)return ce}ce++}throw Error(z.bracketError)}function Zs(P,V){let z=P.lastIndexOf(`
`,V)+1;return/^[ \t]*/.exec(P.slice(z))?.[0]??""}function fr(P,V){let z=V.end+(/^\s*/.exec(P.slice(V.end))?.[0].length??0);if(P[z]===","){let ce=P[z+1]===`
`?z+2:z+1;return`${P.slice(0,V.start)}${P.slice(ce)}`}let Q=P.slice(0,V.start).search(/\s*$/)-1;if(P[Q]!==",")return`${P.slice(0,V.start)}${P.slice(V.end)}`;let te=P.lastIndexOf(`
`,Q-1),ne=te!==-1&&/^\s*$/.test(P.slice(te+1,Q))?te:Q;return`${P.slice(0,ne)}${P.slice(V.end)}`}function yo(P,V){if(P.startsWith("//",V)){let z=P.indexOf(`
`,V+2);return z===-1?P.length:z+1}if(P.startsWith("/*",V)){let z=P.indexOf("*/",V+2);return z===-1?P.length:z+2}return V}function Ks(P,V){let z=V;while(z<P.length){if(/\s/.test(P[z]??"")){z++;continue}let Q=yo(P,z);if(Q===z)return z;z=Q}return z}function Xs(P,V,z){let Q=0,te=0;while(te<P.length){let ne=yo(P,te);if(ne!==te){te=ne;continue}if(P[te]==='"'){let ce=Ys(P,te,z.stringError);if(Q===1&&JSON.parse(P.slice(te,ce))===V){let ye=Ks(P,ce),he=Ks(P,ye+1);if(P[ye]===":"&&P[he]==="[")return{start:he,end:ho(P,he,{skipComment:yo,...z})}}te=ce;continue}if(P[te]==="{"||P[te]==="[")Q++;if(P[te]==="}"||P[te]==="]")Q--;te++}return}var jt="cc-safety-net@cc-marketplace",mr=["cc-marketplace","cc-safety-net"],Qs=["_direct","copilot-safety-net"],ea=["cc-marketplace","safety-net"],ta="safety-net@cc-marketplace";function gr(P,V){let z=V.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${z}([^a-z0-9-]|$)`,"m").test(P??"")}function na(P){return gr(P,"cc-safety-net@cc-marketplace")}function ra(P){return gr(P,"cc-marketplace")}function oa(P){return gr(P,"copilot-safety-net")}function ia(P){return gr(P,"safety-net@cc-marketplace")}function vo(P){if(!P?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(P)}function aa(P,V){if(!P)return null;let z=P.match(/(\d+)\.(\d+)\.(\d+)/);if(!z)return null;let Q=[Number(z[1]),Number(z[2]),Number(z[3])];for(let te=0;te<V.length;te++){let ne=Q[te]??0,ce=V[te]??0;if(ne!==ce)return ne>ce}return!0}function r2(P){return aa(P,[0,0,422])}function o2(P){return aa(P,[1,0,8])}function Dn(P){return P.env.get("COPILOT_HOME")||St(P.home,".copilot")}function bo(P){return(P.hooks?.preToolUse??[]).some((z)=>{if(z.type!=="command")return!1;return vo(z.command)||vo(z.bash)||vo(z.powershell)})}function yr(P){return P===void 0||typeof P==="string"}function i2(P){if(!P||typeof P!=="object"||Array.isArray(P))return!1;let V=P;if(V.disableAllHooks!==void 0&&typeof V.disableAllHooks!=="boolean")return!1;if(V.hooks===void 0)return!0;if(!V.hooks||typeof V.hooks!=="object"||Array.isArray(V.hooks))return!1;let z=V.hooks.preToolUse;if(z===void 0)return!0;return Array.isArray(z)&&z.every((Q)=>Q!==null&&typeof Q==="object"&&!Array.isArray(Q)&&yr(Q.type)&&yr(Q.command)&&yr(Q.bash)&&yr(Q.powershell))}function Lo(P,V){try{let z=JSON.parse(At(n2(P,"utf-8")));if(!i2(z)){V?.push(`Invalid hook config ${P}: hooks.preToolUse must be an array of hook objects`);return}return z}catch(z){V?.push(`Failed to parse ${P}: ${z instanceof Error?z.message:String(z)}`);return}}function la(P,V){try{return t2(P).filter((z)=>z.endsWith(".json")).sort((z,Q)=>z.localeCompare(Q))}catch(z){return V?.push(`Failed to read ${P}: ${z instanceof Error?z.message:String(z)}`),[]}}function s2(P,V){if(!hr(P))return[];let z=[];for(let Q of la(P,V)){let te=St(P,Q),ne=Lo(te,V);if(ne&&bo(ne))z.push(te)}return z}function yn(P,V){if(!hr(P))return;let z=Lo(P,V);if(!z)return;return{path:P,config:z}}function sa(P,V,z,Q){if(V){P.push(`GitHub Copilot CLI ${V} does not support ${z}; requires ${Q}+`);return}P.push(`GitHub Copilot CLI version unavailable; skipping ${z} because it requires ${Q}+`)}function a2(P){for(let V of P){if(V?.config.disableAllHooks===!0)return V.path;if(V?.config.disableAllHooks===!1)return}return}function l2(P,V,z,Q){let te=Dn(P),ne=St(V,".github","hooks"),ce=St(te,"hooks"),ye=St(V,".github","copilot"),he=St(V,".claude"),be=o2(z),Le=be===!0?Q:void 0,Ie=[yn(St(ye,"settings.local.json"),Le),yn(St(ye,"settings.json"),Le),yn(St(he,"settings.local.json"),Le),yn(St(he,"settings.json"),Le)],Xe=[yn(St(te,"settings.json"),Le),yn(St(te,"config.json"),Le)];if(be!==!1){let gt=a2([...Ie,...Xe]);if(gt){if(be===null)Q.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${gt} as active`);return{activeConfigPaths:[],disabledBy:gt}}}let et=s2(ne,Q),xe=r2(z),at=xe===!0?Q:void 0,ct=hr(ce)?la(ce,at):[],lt=[];for(let gt of ct){let ut=St(ce,gt),vt=Lo(ut,at);if(vt&&bo(vt))lt.push(ut)}if(xe!==!0&&lt.length>0)sa(Q,z,`user hook files in ${ce}`,"0.0.422"),lt.length=0;let pt=[];for(let gt of[...Ie,...Xe]){if(!gt)continue;if(!bo(gt.config))continue;if(be===!0){pt.push(gt);continue}sa(Q,z,"inline hook definitions in Copilot config files","1.0.8");break}let mt=(gt)=>gt.filter((ut)=>!!ut&&pt.includes(ut)).map((ut)=>ut.path);return{activeConfigPaths:[...mt(Ie),...et,...mt(Xe),...lt]}}function ca(P){let V=[],z=l2(P.environment,P.cwd,P.copilotCliVersion,V);if(z.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:z.disabledBy,configPaths:[z.disabledBy],errors:V.length>0?V:void 0};let Q=Dn(P.environment),te=St(Q,"installed-plugins",...mr),ne=hr(te),ce=St(Q,"settings.json"),ye=Ft(ce,At);if(ne&&ye.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};if(ne&&ye.kind==="ok"&&ft(ft(ye.value,"enabledPlugins"),jt)===!1)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:ce,errors:[`${jt} is installed but not enabled in Copilot CLI`]};if(ne||z.activeConfigPaths.length>0){let he=ne,be=z.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:he?"plugin config":"hook config",configPath:be??(he?te:void 0),configPaths:z.activeConfigPaths.length>0?z.activeConfigPaths:void 0,errors:V.length>0?V:void 0}}return{platform:"copilot-cli",status:"n/a",errors:V.length>0?V:void 0}}import{existsSync as v2,readFileSync as b2}from"node:fs";import{existsSync as da,mkdirSync as u2,readFileSync as p2}from"node:fs";import{dirname as f2,join as m2}from"node:path";import{renameSync as c2,writeFileSync as d2}from"node:fs";function kt(P,V){let z=`${P}.${process.pid}.tmp`;d2(z,V),c2(z,P)}var Nt=Object.fromEntries(Sn.map((P)=>[P.id,`npx -y cc-safety-net hook ${P.flags[1]}`]));var An=Nt.cursor,ua=30;function br(P){return m2(P.home,".cursor","hooks.json")}function Qt(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function wo(){return{command:An,timeout:ua,failClosed:!0}}function vr(P){return Qt(P)&&P.command===An}function g2(P){return Object.keys(P).length===3&&P.command===An&&P.timeout===ua&&P.failClosed===!0}function y2(P){try{return JSON.parse(p2(P,"utf-8"))}catch(V){if(V instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${P}: ${V.message}`);throw V}}function pa(P){let V=y2(P);if(!Qt(V))throw Error(`Cursor hooks config ${P} must be a JSON object`);if(V.version!==1)throw Error(`Cursor hooks config ${P} must set "version": 1`);if(V.hooks!==void 0&&!Qt(V.hooks))throw Error(`Cursor hooks config ${P} "hooks" must be an object`);let z=Qt(V.hooks)?V.hooks.preToolUse:void 0;if(z!==void 0&&!Array.isArray(z))throw Error(`Cursor hooks config ${P} "hooks.preToolUse" must be an array`);return V}function fa(P){let V=Qt(P.hooks)?P.hooks.preToolUse:void 0;return Array.isArray(V)?V:[]}function h2(P){if(!P.some(vr))return[...P,wo()];return P.reduce((V,z)=>{if(!vr(z))return V.result.push(z),V;if(!V.inserted)V.result.push(wo()),V.inserted=!0;return V},{result:[],inserted:!1}).result}function ma(P,V,z){let Q=Qt(V.hooks)?V.hooks:{},te={...V,hooks:{...Q,preToolUse:z}};kt(P,`${JSON.stringify(te,null,2)}
`)}function ga(P){let V=br(P);if(!da(V))return u2(f2(V),{recursive:!0}),kt(V,`${JSON.stringify({version:1,hooks:{preToolUse:[wo()]}},null,2)}
`),{path:V,alreadyInstalled:!1};let z=pa(V),Q=fa(z),te=Q.filter(vr);if(Qt(z.hooks)&&Array.isArray(z.hooks.preToolUse)&&te.length===1&&te[0]!==void 0&&g2(te[0]))return{path:V,alreadyInstalled:!0};return ma(V,z,h2(Q)),{path:V,alreadyInstalled:!1}}function ya(P){let V=br(P);if(!da(V))return{path:V,alreadyInstalled:!1};let z=pa(V),Q=fa(z),te=Q.filter((ne)=>!vr(ne));if(te.length===Q.length)return{path:V,alreadyInstalled:!1};return ma(V,z,te),{path:V,alreadyInstalled:!0}}function L2(P){if(!P||typeof P!=="object"||Array.isArray(P))return[];let V=P.hooks;if(!V||typeof V!=="object"||Array.isArray(V))return[];let z=V.preToolUse;if(!Array.isArray(z))return[];return z.filter((Q)=>!!Q&&typeof Q==="object"&&!Array.isArray(Q)&&Q.command===An)}function w2(P){let V=[];if(P.length>1)V.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let z=P[0];if(z&&z.failClosed!==!0)V.push('Managed hook is missing "failClosed": true; reinstall to repair');if(z&&z.timeout!==30)V.push('Managed hook "timeout" is not 30; reinstall to repair');return V}function ha(P){let V=br(P.environment);if(!v2(V))return{platform:"cursor",status:"n/a",configPath:V};let z;try{z=JSON.parse(b2(V,"utf-8"))}catch(ne){return{platform:"cursor",status:"n/a",configPath:V,errors:[`Failed to parse Cursor hooks config ${V}: ${ne instanceof Error?ne.message:String(ne)}`]}}let Q=L2(z);if(Q.length===0)return{platform:"cursor",status:"n/a",configPath:V};let te=w2(Q);return{platform:"cursor",status:"configured",method:"hook config",configPath:V,errors:te.length>0?te:void 0}}import{existsSync as k2}from"node:fs";import{join as ko}from"node:path";var xo="gemini-safety-net";function Co(P){let V=ko(P.home,".gemini","extensions"),z=ko(V,xo);if(!k2(z))return{platform:"gemini-cli",status:"n/a"};let Q=ko(V,"extension-enablement.json"),te=Ft(Q);if(te.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let ne=te.kind==="ok"?ft(ft(te.value,xo),"overrides"):void 0;if(Array.isArray(ne)&&ne.some((ye)=>typeof ye==="string"&&ye.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:Q,errors:[`${xo} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:z}}function va(P){return Co(P.environment)}import{existsSync as R2,readFileSync as P2}from"node:fs";import{existsSync as La,mkdirSync as x2,readFileSync as wa,rmSync as C2}from"node:fs";import{dirname as S2,join as ba}from"node:path";var _n=Nt["grok-build"],kr=30;function xr(P){return ba(P.env.get("GROK_HOME")??ba(P.home,".grok"),"hooks","cc-safety-net.json")}function en(P){return typeof P==="object"&&P!==null&&!Array.isArray(P)}function Lr(){return{hooks:[{type:"command",command:_n,timeout:kr}]}}function ka(P){return en(P)&&P.command===_n}function xa(P){return P.flatMap((V)=>{if(!en(V)||!Array.isArray(V.hooks))return[V];let z=V.hooks.filter((Q)=>!ka(Q));if(z.length===V.hooks.length)return[V];return z.length===0?[]:[{...V,hooks:z}]})}function Ca(P){try{let V=JSON.parse(P);return en(V)?V:null}catch{return null}}function Sa(P){let V=en(P.hooks)?P.hooks.PreToolUse:void 0;return Array.isArray(V)?V:[]}function wr(P,V,z){let Q=en(V.hooks)?V.hooks:{};kt(P,`${JSON.stringify({...V,hooks:{...Q,PreToolUse:z}},null,2)}
`)}function Ra(P){let V=xr(P);if(!La(V))return x2(S2(V),{recursive:!0}),wr(V,{},[Lr()]),{path:V,alreadyInstalled:!1};let z=Ca(wa(V,"utf-8"));if(!z)return wr(V,{},[Lr()]),{path:V,alreadyInstalled:!1};let Q=Sa(z),te=Q.filter((ne)=>en(ne)&&Array.isArray(ne.hooks)&&ne.hooks.some(ka));if(te.length===1&&JSON.stringify(te[0])===JSON.stringify(Lr()))return{path:V,alreadyInstalled:!0};return wr(V,z,[...xa(Q),Lr()]),{path:V,alreadyInstalled:!1}}function Pa(P){let V=xr(P);if(!La(V))return{path:V,alreadyInstalled:!1};let z=Ca(wa(V,"utf-8"));if(!z)return{path:V,alreadyInstalled:!1};let Q=Sa(z),te=xa(Q);if(JSON.stringify(te)===JSON.stringify(Q))return{path:V,alreadyInstalled:!1};let ne=en(z.hooks)?z.hooks:{};if(te.length===0&&Object.keys(z).length===1&&Object.keys(ne).length===1)return C2(V),{path:V,alreadyInstalled:!0};return wr(V,z,te),{path:V,alreadyInstalled:!0}}function Tn(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}function E2(P){if(!Tn(P)||!Tn(P.hooks))return[];let V=P.hooks.PreToolUse;if(!Array.isArray(V))return[];return V.filter((z)=>Tn(z)&&Array.isArray(z.hooks)&&z.hooks.some((Q)=>Tn(Q)&&Q.command===_n))}function D2(P){let z=(Array.isArray(P.hooks)?P.hooks.filter(Tn):[]).find((Q)=>Q.command===_n);return[...P.matcher===void 0||P.matcher===""||P.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...z?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...z?.timeout===kr?[]:[`Managed hook "timeout" is not ${kr}; reinstall to repair`]]}function Ea(P){let V=xr(P.environment);if(!R2(V))return{platform:"grok-build",status:"n/a",configPath:V};let z;try{z=JSON.parse(P2(V,"utf-8"))}catch(ne){return{platform:"grok-build",status:"n/a",configPath:V,errors:[`Failed to parse Grok Build hooks config ${V}: ${ne instanceof Error?ne.message:String(ne)}`]}}let Q=E2(z)[0];if(!Q)return{platform:"grok-build",status:"n/a",configPath:V};let te=D2(Q);return{platform:"grok-build",status:"configured",method:"hook config",configPath:V,errors:te.length>0?te:void 0}}import{readFileSync as Fa}from"node:fs";import{join as ja}from"node:path";var Tt="cc-safety-net",So="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",A2=30;function Da(P){return`${So}
# version: ${P}
`}function _2(P){return`${Da(P)}name: ${Tt}
version: "${P}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function T2(P){return`${Da(P)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${Nt["hermes-agent"].split(" ").map((V)=>`"${V}"`).join(", ")}]
TIMEOUT_SECONDS = ${A2}


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
`}function $n(P){return[{name:"__init__.py",content:T2(P)},{name:"plugin.yaml",content:_2(P)}]}import{mkdirSync as $2,readdirSync as I2,readFileSync as O2,rmSync as Ro}from"node:fs";import{join as tn}from"node:path";var F2="__pycache__";function Po(P){let V=P.env.get("HERMES_HOME")?.trim();return V?V:tn(P.home,".hermes")}function Eo(P){return tn(Po(P),"plugins",Tt)}function Do(P){return P.startsWith(So)}function Ao(P,V){let z=Eo(P),Q=Lt(z);if(Q&&(Q.isSymbolicLink()||!Q.isDirectory()))throw Error(`Refusing to ${V} ${z}: not a regular directory. Move or remove it and rerun ${V==="install"?"install":"uninstall"} --hermes-agent.`);return z}function Aa(P,V){let z=Lt(P);if(!z)return;if(z.isSymbolicLink()||!z.isFile())throw Error(`Refusing to ${V} ${P}: not a regular file. Move or remove it.`);let Q=O2(P,"utf-8");if(!Do(Q))throw Error(`Refusing to ${V} unmanaged file at ${P}. Move or remove it.`);return Q}function _a(P){let V=Ao(P,"install"),z=$n(wt());if(z.map((te)=>Aa(tn(V,te.name),"overwrite")).every((te,ne)=>te===z[ne]?.content))return{path:V,alreadyInstalled:!0};return $2(V,{recursive:!0}),z.forEach((te)=>{kt(tn(V,te.name),te.content)}),{path:V,alreadyInstalled:!1}}function _o(P){let V=Ao(P,"remove");if(!Lt(V))return[];return $n(wt()).filter((z)=>Aa(tn(V,z.name),"remove")!==void 0)}function Ta(P){let V=Ao(P,"remove");if(!Lt(V))return{path:V,alreadyInstalled:!1};let z=_o(P);if(z.forEach((Q)=>{Ro(tn(V,Q.name))}),Ro(tn(V,F2),{recursive:!0,force:!0}),I2(V).length===0)Ro(V,{recursive:!0});return{path:V,alreadyInstalled:z.length>0}}var Cr="hermes-agent",$a=/^([^\s#][^:]*):/,j2=/^\s+([A-Za-z_][\w-]*):/,Ia=/^\s+-\s*(.*)$/;function N2(P){return P.trim().replace(/^(["'])(.*)\1$/,"$2")}function M2(P){let V=P.split(/\r?\n/),z=V.findIndex((ne)=>$a.exec(ne)?.[1]?.trim()==="plugins");if(z===-1)return[];let Q=V.slice(z+1),te=Q.findIndex((ne)=>$a.test(ne));return te===-1?Q:Q.slice(0,te)}function Oa(P,V){let z=M2(P),Q=z.findIndex((ce)=>j2.exec(ce)?.[1]===V);if(Q===-1)return[];let te=z.slice(Q+1),ne=te.findIndex((ce)=>!Ia.test(ce));return(ne===-1?te:te.slice(0,ne)).map((ce)=>N2(Ia.exec(ce)?.[1]??""))}function H2(P){try{return Fa(ja(Po(P),"config.yaml"),"utf-8")}catch{return}}function To(P){let V=H2(P)??"";return Oa(V,"enabled").includes(Tt)&&!Oa(V,"disabled").includes(Tt)}function Na(P){return/^# version:\s*(.+)$/m.exec(P)?.[1]?.trim()}function U2(P,V){let z=Lt(P);if(!z)return{error:`${V.name} is missing from ${P}; run install --hermes-agent`};if(z.isSymbolicLink()||!z.isFile())return{error:`${P} is a symlink or not a regular file; move or remove it`};try{let Q=Fa(P,"utf-8");if(!Do(Q))return{error:`Unmanaged ${V.name} occupies ${P}; move or remove it`};if(Na(Q)===wt()&&Q!==V.content)return{error:`Modified ${V.name} occupies ${P}; run install --hermes-agent to restore it`};return{content:Q}}catch(Q){return{error:`Failed to read ${P}: ${Q instanceof Error?Q.message:String(Q)}`}}}function Ma(P){let V=Eo(P.environment),z=ur(Cr,V);if(z)return z;let Q=$n(wt()).map((ye)=>U2(ja(V,ye.name),ye)),te=Q.flatMap((ye)=>("error"in ye)?[ye.error]:[]);if(te.length>0)return{platform:Cr,status:"n/a",configPath:V,errors:te};let ne=Q.some((ye)=>("content"in ye)&&Na(ye.content)!==wt()),ce=ne?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!To(P.environment))return{platform:Cr,status:"disabled",method:"plugin directory",configPath:V,errors:[`${Tt} is not enabled in Hermes; run \`hermes plugins enable ${Tt}\``,...ce]};return{platform:Cr,status:"configured",method:"plugin directory",configPath:V,errors:ne?ce:void 0}}import{existsSync as G2,readFileSync as B2}from"node:fs";import{join as Ha}from"node:path";var q2=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;function V2(P){return Ha(P.env.get("KIMI_CODE_HOME")||Ha(P.home,".kimi-code"),"config.toml")}function In(P){let V=V2(P.environment);if(!G2(V))return{platform:"kimi-code",status:"n/a",configPath:V};try{if(!q2.test(B2(V,"utf-8")))return{platform:"kimi-code",status:"n/a",configPath:V}}catch(z){return{platform:"kimi-code",status:"n/a",configPath:V,errors:[`Failed to read ${V}: ${z instanceof Error?z.message:String(z)}`]}}return{platform:"kimi-code",status:"configured",method:"hook config",configPath:V}}import{readFileSync as Ka}from"node:fs";import{join as Fn}from"node:path";var ht="cc-safety-net",It="index.js",hn="openclaw.plugin.json",vn="package.json";var Sr="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as W2,lstatSync as K2,readdirSync as Y2,readFileSync as Z2}from"node:fs";import{dirname as Ga,join as Gt}from"node:path";import{fileURLToPath as X2}from"node:url";import{spawn as z2}from"node:child_process";function J2(P){return P.join(" ")}function $o(P,V,z){return[`Failed to run ${J2(P)}${V===null?"":` (exit ${V})`}.`,z.trim()].filter(Boolean).join(`
`)}function Io(P){let V={stdout:"",stderr:""};return P.stdout.setEncoding("utf-8"),P.stderr.setEncoding("utf-8"),P.stdout.on("data",(z)=>{V.stdout+=z}),P.stderr.on("data",(z)=>{V.stderr+=z}),V}function _t(P,V){return new Promise((z,Q)=>{let te=Xt([...P],process.env),ne=z2(te.cmd,te.args,{stdio:["ignore","pipe","pipe"]}),ce=Io(ne),ye=()=>[ce.stdout,ce.stderr].filter(Boolean).join(`
`),he=V?.timeoutMs??120000,be=setTimeout(()=>{ne.kill(),Q(Error($o(P,null,`Timed out after ${he}ms.
${ye()}`.trim())))},he);ne.on("error",(Le)=>{clearTimeout(be),Q(Error($o(P,null,`${Le.message}
${ye()}`.trim())))}),ne.on("close",(Le)=>{if(clearTimeout(be),Le!==0){Q(Error($o(P,Le,ye())));return}z(V?.stdoutOnly?ce.stdout:ye())})})}async function Oo(P){for(let V of P)await _t(V)}async function Ua(P){for(let V of P)try{await _t(V)}catch(z){console.warn(z instanceof Error?z.message:String(z))}}var Fo=Gt("openclaw",ht),Q2=[It,hn,vn];function jo(P,V){if(P==="~")return V;if(P.startsWith("~/")||P.startsWith("~\\"))return Gt(V,P.slice(2));return P}function Ba(P){let V=P.env.get("OPENCLAW_STATE_DIR")?.trim();if(V)return jo(V,P.home);let z=P.env.get("OPENCLAW_CONFIG_PATH")?.trim();return z?Ga(jo(z,P.home)):Gt(P.home,".openclaw")}function qa(P){let V=P.env.get("OPENCLAW_CONFIG_PATH")?.trim();return V?jo(V,P.home):Gt(Ba(P),"openclaw.json")}function No(P){return Gt(Ba(P),"extensions",ht)}function ef(P){let V=Y2(P);if(V.length===0)return!0;if(V.some((te)=>!Q2.includes(te)))return!1;let z=Gt(P,It),Q=Lt(z);return Q!==void 0&&!Q.isSymbolicLink()&&Q.isFile()&&Z2(z,"utf-8").startsWith(Sr)}function Mo(P){let V=No(P),z=Lt(V);if(!z)return;if(!z.isSymbolicLink()&&z.isDirectory()&&ef(V))return;throw Error(`Refusing to modify ${V}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function Va(){let P=Ga(X2(import.meta.url));return[Gt(P,Fo),Gt(P,"..",Fo),Gt(P,"..","..","..","dist",Fo)]}function Ho(P=Va()){return P.find((V)=>W2(V)&&K2(V).isDirectory())}function tf(P=Va()){let V=Ho(P);if(!V)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return V}function za(P=tf()){return[["openclaw","plugins","install",P,"--force"],["openclaw","plugins","enable",ht]]}function nf(P){let V=(()=>{try{return JSON.parse(P)}catch{return}})(),z=ft(ft(V,"plugin"),"status");return typeof z==="string"?z:void 0}async function Ja(){let P=nf(await _t(["openclaw","plugins","inspect",ht,"--runtime","--json"],{stdoutOnly:!0}));if(P==="loaded")return;throw Error(`${P===void 0?`The ${ht} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:`OpenClaw reports the ${ht} plugin with status "${P}".`} Run \`openclaw plugins inspect ${ht} --runtime\` for details.`)}var Rr="openclaw",On=`run \`openclaw plugins enable ${ht}\``;function bn(P,V){let z=Fn(P,V),Q=Lt(z);if(!Q)return{error:`${V} is missing from ${z}; run install --openclaw`};if(Q.isSymbolicLink()||!Q.isFile())return{error:`${z} is a symlink or not a regular file; move or remove it`};try{return{content:Ka(z,"utf-8")}}catch(te){return{error:`Failed to read ${z}: ${te instanceof Error?te.message:String(te)}`}}}function Ya(P){try{return JSON.parse(At(P))}catch{return}}function rf(P){let V=bn(P,hn);if("error"in V)return V.error;if(ft(Ya(V.content),"id")===ht)return;return`${Fn(P,hn)} is not a valid ${ht} manifest; run install --openclaw`}function of(P){let V=bn(P,vn);if("error"in V)return V.error;let z=ft(ft(Ya(V.content),"openclaw"),"extensions");if(Array.isArray(z)&&z.includes(`./${It}`))return;return`${Fn(P,vn)} does not point OpenClaw at ${It}; run install --openclaw`}function Wa(P){return Array.isArray(P)?P.filter((V)=>typeof V==="string"):[]}function sf(P){let V=qa(P);if(!Lt(V))return`${ht} is not enabled; ${On}`;let z=(()=>{try{return JSON.parse(At(Ka(V,"utf-8")))}catch{return}})();if(z===void 0)return`Failed to read ${V}; fix it, then ${On}`;let Q=ft(z,"plugins");if(ft(Q,"enabled")===!1)return`plugins.enabled is false in ${V}; no OpenClaw plugin loads`;let te=ft(ft(ft(Q,"entries"),ht),"enabled");if(Wa(ft(Q,"deny")).includes(ht)||te===!1)return`${ht} is disabled in ${V}; ${On}`;let ne=Wa(ft(Q,"allow"));if(ne.length>0&&!ne.includes(ht))return`plugins.allow in ${V} does not list ${ht}; add it, then ${On}`;if(ne.includes(ht)||te===!0)return;return`${ht} is not enabled; ${On}`}function Za(P){return/^\/\/ version:\s*(.+)$/m.exec(P)?.[1]?.trim()}function af(P,V,z){if(z===void 0)return[];let Q=bn(z,It);if("error"in Q||Za(Q.content)!==V)return[];return[It,hn,vn].flatMap((te)=>{let ne=bn(P,te),ce=bn(z,te);if("error"in ne||"error"in ce||ne.content===ce.content)return[];return[`Modified ${te} occupies ${Fn(P,te)}; run install --openclaw to restore it`]})}function Xa(P){let V=No(P.environment),z=ur(Rr,V);if(z)return z;let Q=bn(V,It),ne=["error"in Q?Q.error:Q.content.startsWith(Sr)?void 0:`Unmanaged ${It} occupies ${Fn(V,It)}; move or remove it`,rf(V),of(V)].filter((Le)=>Le!==void 0),ce="content"in Q?Za(Q.content):void 0,ye=ne.length>0?ne:af(V,ce,Ho());if(ye.length>0)return{platform:Rr,status:"n/a",configPath:V,errors:ye};let he=ce===wt()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],be=sf(P.environment);if(be)return{platform:Rr,status:"disabled",method:"plugin directory",configPath:V,errors:[be,...he]};return{platform:Rr,status:"configured",method:"plugin directory",configPath:V,errors:he.length>0?he:void 0}}import{existsSync as mf,readFileSync as gf}from"node:fs";import{join as yf}from"node:path";import{existsSync as Pr,readFileSync as Uo,rmSync as lf}from"node:fs";import{join as Bt}from"node:path";import{pathToFileURL as cf}from"node:url";var Er="cc-safety-net",nn=`${Er}@latest`,el=["opencode.json","opencode.jsonc"],Qa="CCSafetyNetPlugin",df={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function Dr(P){return P.env.get("OPENCODE_CONFIG_DIR")??Bt(P.env.get("XDG_CONFIG_HOME")||Bt(P.home,".config"),"opencode")}function uf(P){return Bt(Dr(P),el[0])}function tl(P){return el.map((V)=>Bt(Dr(P),V))}function nl(P){return Bt(P.env.get("XDG_CACHE_HOME")||Bt(P.home,".cache"),"opencode","packages",nn)}function rl(P){lf(nl(P),{recursive:!0,force:!0})}async function ol(P){let V=(await _t(["opencode","--version"],{stdoutOnly:!0})).trim(),z=/^(?:opencode\s+)?v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/.exec(V),Q=Number(z?.[1]),te=Number(z?.[2]),ne=Number(z?.[3]);if(!z||Q!==1&&Q!==2||Q===1&&(te<18||te===18&&ne<29)||Q===2&&te===0&&ne<6)throw Error(`OpenCode 1.18.29+ or 2.0.6+ is required; found ${V||"an unknown version"}.`);if(Q===2){for(let ce of tl(P)){if(!Pr(ce))continue;let ye=Go(Uo(ce,"utf-8"),ce);if(["plugin","plugins"].some((be)=>{let Le=ft(ye,be);return Array.isArray(Le)&&Le.some((Ie)=>Bo(Ie)&&(typeof Ie==="string"?Ie:ft(Ie,"package"))!==nn)}))throw Error(`Change the cc-safety-net package spec in ${ce} to ${nn}, preserving its options, then retry. Adding another spec would create a duplicate plugin ID.`)}return{commands:[["opencode","plugin","add",nn],["opencode","plugin","update",nn]],afterInstall:async()=>{let ce=await _t(["opencode","plugin","list"],{stdoutOnly:!0});if(/^cc-safety-net\s+\S+\s+cc-safety-net@latest\s*$/m.test(ce))return;throw Error("OpenCode did not load cc-safety-net from cc-safety-net@latest. Run `opencode plugin list` for details.")}}}return rl(P),{commands:[["opencode","plugin","-g","-f",nn]],afterInstall:()=>pf(P)}}async function pf(P){let V=Bt(nl(P),"node_modules",Er),z=Bt(V,"package.json");if(!Pr(z))throw Error(`The OpenCode plugin cache at ${V} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${nn}\` for details.`);let Q=ft(JSON.parse(Uo(z,"utf-8")),"main");if(typeof Q!=="string")throw Error(`The cached OpenCode plugin at ${V} declares no "main" entry.`);let te=Bt(V,Q);if(typeof(await import(cf(te).href))[Qa]==="function")return;throw Error(`The cached OpenCode plugin at ${te} does not export a callable ${Qa}, so OpenCode would load nothing and fail open.`)}function Go(P,V){try{return JSON.parse(At(P))}catch(z){if(z instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${V}: ${z.message}`);throw z}}function Bo(P){let V=typeof P==="string"?P:ft(P,"package");return typeof V==="string"&&(V===Er||V.startsWith(`${Er}@`))}function qo(P){return["plugin","plugins"].some((V)=>{let z=ft(P,V);return Array.isArray(z)&&z.some(Bo)})}function ff(P,V){let Q=["plugin","plugins"].flatMap((te)=>{let ne=Xs(P,te,df);if(!ne)return[];let ce=[],ye=0,he=ne.start+1,be=P.slice(ne.start+1,ne.end).matchAll(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|[^"\s{}[\],/]+|[{}[\],]/g);for(let Le of be){if(Le[0].startsWith("//")||Le[0].startsWith("/*"))continue;let Ie=ne.start+1+Le.index;if(ye===0)he=Ie;if(Le[0]==="{"||Le[0]==="[")ye++;if(Le[0]==="}"||Le[0]==="]")ye--;if(ye!==0||Le[0]===",")continue;let Xe=Ie+Le[0].length;if(Bo(JSON.parse(At(P.slice(he,Xe)))))ce.push({start:he,end:Xe})}return ce}).sort((te,ne)=>te.start-ne.start).reverse().reduce((te,ne)=>{let ce=/^(?:\s|\/\/[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)*,/.exec(te.slice(ne.end));if(ce?.[0].includes("/")){let ye=ne.end+ce[0].length-1;return te.slice(0,ne.start)+te.slice(ne.end,ye)+te.slice(ye+1)}return fr(te,ne)},P);return Go(Q,V),Q}function il(P){rl(P);let V=tl(P),z=V.find((ne)=>Pr(ne)),Q=[],te=[];for(let ne of V){if(!Pr(ne))continue;try{let ce=Uo(ne,"utf-8");if(!qo(Go(ce,ne)))continue;kt(ne,ff(ce,ne)),te.push(ne)}catch(ce){Q.push(ce instanceof Error?ce.message:String(ce))}}if(Q.length>0)throw Error(Q.join(`
`));return{path:te[0]??z??uf(P),alreadyInstalled:te.length>0}}function sl(P){let V=[],z=Dr(P.environment),Q=["opencode.json","opencode.jsonc"];for(let te of Q){let ne=yf(z,te);if(mf(ne))try{let ce=gf(ne,"utf-8"),ye=At(ce),he=JSON.parse(ye);if(qo(he))return{platform:"opencode",status:"configured",method:"plugin array",configPath:ne,errors:V.length>0?V:void 0}}catch(ce){V.push(`Failed to parse ${te}: ${ce instanceof Error?ce.message:String(ce)}`)}}return{platform:"opencode",status:"n/a",errors:V.length>0?V:void 0}}import{join as hf}from"node:path";function Vo(P){return hf(P.home,".pi","agent","settings.json")}function zo(P){if(typeof P!=="string")return!1;return P==="npm:cc-safety-net"||P.startsWith("npm:cc-safety-net@")}function al(P){let V=Vo(P.environment),z=Ft(V);if(z.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(z.kind==="missing")return{platform:"pi",status:"n/a"};let Q=ft(z.value,"packages");if(!Array.isArray(Q))return{platform:"pi",status:"n/a"};let te=Q.find((ye)=>zo(typeof ye==="string"?ye:ft(ye,"source")));if(te===void 0)return{platform:"pi",status:"n/a"};let ne=ft(te,"extensions");if(Array.isArray(ne)&&ne.some((ye)=>typeof ye==="string"&&ye.startsWith("-")))return{platform:"pi",status:"disabled",method:"package config",configPath:V,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:V}}var vf={amp:Gs,"antigravity-cli":Bs,"claude-code":Js,codex:Ws,"copilot-cli":ca,cursor:ha,"gemini-cli":va,"grok-build":Ea,"hermes-agent":Ma,"kimi-code":In,openclaw:Xa,opencode:sl,pi:al};function Ln(P,V,z){let Q={...z,cwd:V,environment:P};return Zn.map((te)=>bf(vf[te](Q)))}function bf(P){if(P.status==="not-inspected")return{platform:P.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:P.platform,detected:P.status!=="n/a",configured:P.status==="configured",inspectionStatus:P.status!=="n/a"?"verified":P.errors&&P.errors.length>0?"failed":"not-applicable",method:P.method,configPath:P.configPath,configPaths:P.configPaths,errors:P.errors}}import{join as Lf}from"node:path";var wf=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),kf=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),safety:Object.freeze({}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),xf={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function ll(P){let V=Lf(P.tmpdir,"cc-safety-net-self-test"),z=wf.map((Q)=>{let te=D(P,d("self-test",{command:Q.command},{kind:"command",shell:"auto"},{configCwd:V,executionCwd:V},Q.command),{guard:{dependencies:{loadPolicySnapshot:()=>kf,getModes:()=>xf,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),ne=Q.expectBlocked?"blocked":"allowed",ce=te.decision.kind==="deny"?"blocked":"allowed";return{command:Q.command,description:Q.description,expected:ne,actual:ce,passed:ne===ce,reason:te.decision.kind==="deny"?te.decision.reason:void 0,ruleId:te.decision.kind==="deny"?te.decision.ruleId:void 0}});return{passed:z.filter((Q)=>Q.passed).length,failed:z.filter((Q)=>!Q.passed).length,total:z.length,results:z}}function Jo(P){let V=xt({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},P);if(Ht(V.errors))return null;return{json:V.flags.json,skipUpdateCheck:V.flags.skipUpdateCheck}}async function cl(P,V={}){let z=await Pn(!V.json,()=>{let Q=Cf(P,V);return{ready:Q,finish:()=>Q}},()=>Rn(),{loadingMessage:"Checking system status…"});if(V.json)console.log(JSON.stringify(z,null,2));else Sf(z);return z.engineSelfTest.failed>0||z.findings.some((Q)=>Q.severity==="error")?1:0}async function Cf(P,V){let z=V.cwd??process.cwd(),Q=await sr(),te=Ln(P,z,{ampPluginListOutput:Q.ampPluginListOutput,codexPluginListOutput:Q.codexPluginListOutput,copilotCliVersion:Q.versions["copilot-cli"]}),ne=os(P,z),ce=is(P),ye=E(P,{cwd:z}),he=ye.policy,be=L(he,P.env),Le=G(he,be.capabilities),Ie=tr(P,7),Xe=js(P,z),et=V.skipUpdateCheck?{currentVersion:wt(),latestVersion:null,updateAvailable:!1}:await Wt(),xe={hooks:te,engineSelfTest:ll(P),userConfig:ne.userConfig,projectConfig:ne.projectConfig,configState:Ne(ye),effectiveRules:ne.effectiveRules,environment:ce,effectiveSafety:{selectedPreset:he.safety.level??"standard",level:be.effectiveLevel,capabilities:be.capabilities,ruleOverrides:he.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(Le).filter(([,at])=>at.source==="rule_override"&&at.override==="off"&&at.inheritedEnabled&&at.changesInherited).map(([at])=>at),ruleCounts:{stored:Object.keys(he.destructiveCommandRuleOverrides).length,effective:Object.values(Le).filter((at)=>at.changesInherited).length},...ye.policyScopes?{policyScopes:ye.policyScopes}:{}},...Xe.length>0?{v2Leftovers:Xe}:{},posture:bs(P,ne.userConfig.path),activity:Ie,update:et,system:Q};return{...xe,findings:as(xe)}}function Sf(P){console.log(),console.log(cs(P.hooks)),console.log(),console.log(ds(P.engineSelfTest)),console.log(),console.log(us(P)),console.log(),console.log(ps(P.environment)),console.log(),console.log(fs(P)),console.log(),console.log(ms(P.findings)),console.log(),console.log(gs(P.activity)),console.log(),console.log(hs(P.system)),console.log(),console.log(ys(P.update)),console.log(vs(P))}import{existsSync as Rf}from"node:fs";var Pf=/^[A-Za-z0-9_@%+=:,./-]+$/,dl="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function Wo(P){let V=xt({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},P);if(Ht(V.errors))return console.error(dl),console.error("Pass -- before a command that starts with dashes."),null;if(V.values.cwd!==void 0&&!Rf(V.values.cwd))return console.error(`Error: --cwd path does not exist: ${V.values.cwd}`),null;let z=V.positionals.length===1?V.positionals[0]:V.positionals.map((Q)=>Pf.test(Q)?Q:`'${Q.replaceAll("'","'\\''")}'`).join(" ");if(!z)return console.error("Error: No command provided"),console.error(dl),null;return{json:V.flags.json,cwd:V.values.cwd,command:z}}function ul(P){if(P)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function pl(P,V){let Q=V-18;return[`${P.dtl}${P.dh.repeat(V)}${P.dtr}`,`${P.dv}  Command Analysis${" ".repeat(Q)}${P.dv}`,`${P.dbl}${P.dh.repeat(V)}${P.dbr}`]}function Ko(P){return JSON.stringify(P)}function fl(P,V=0){return`[${P.map((Q,te)=>ls(Q,te,V)).join(",")}]`}function jn(P,V,z=70){let Q=P.split(" "),te=[],ne="";for(let ce of Q)if(ne&&ne.length+ce.length+1>z)te.push(ne),ne=ce;else ne=ne?`${ne} ${ce}`:ce;if(ne)te.push(ne);return te.map((ce,ye)=>ye===0?ce:`${V}${ce}`)}function ml(P,V,z){let Q=[];switch(P.type){case"parse":return null;case"env-strip":return Q.push(""),Q.push(`STEP ${V} ${z.h} Strip environment variables`),Q.push(`  Removed: ${P.envVars.map((te)=>`${te}=<redacted>`).join(", ")}`),Q.push(`  Tokens:  ${Ko(P.output)}`),{lines:Q,incrementStep:!0};case"leading-tokens-stripped":return Q.push(""),Q.push(`STEP ${V} ${z.h} Strip wrappers`),Q.push(`  Removed: ${P.removed.join(", ")}`),Q.push(`  Tokens:  ${Ko(P.output)}`),{lines:Q,incrementStep:!0};case"shell-wrapper":return Q.push(""),Q.push(`STEP ${V} ${z.h} Detect shell wrapper`),Q.push(`  Wrapper: ${P.wrapper} -c`),Q.push(`  Inner:   ${P.innerCommand}`),{lines:Q,incrementStep:!0};case"interpreter":{if(Q.push(""),Q.push(`STEP ${V} ${z.h} Detect interpreter`),Q.push(`  Interpreter: ${P.interpreter}`),Q.push(`  Code:        ${P.codeArg}`),P.paranoidBlocked)Q.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:Q,incrementStep:!0}}case"busybox":return Q.push(""),Q.push(`STEP ${V} ${z.h} Busybox wrapper`),Q.push(`  Subcommand: ${P.subcommand}`),{lines:Q,incrementStep:!0};case"transparent-wrapper":return Q.push(""),Q.push(`STEP ${V} ${z.h} Transparent wrapper`),Q.push(`  Wrapper: ${P.wrapper}`),Q.push(`  Tokens:  ${Ko(P.output)}`),{lines:Q,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(Q.push(""),Q.push(`STEP ${V} ${z.h} Match rules`),Q.push(`  Rule:   ${P.rule}()`),P.matched)Q.push("  Result: MATCHED");else Q.push("  Result: No match");return{lines:Q,incrementStep:!0}}case"worktree-relaxation":return Q.push(""),Q.push(`STEP ${V} ${z.h} Worktree relaxation`),Q.push(`  Mode:   ${o.worktree.name}`),Q.push(`  Git cwd: ${P.gitCwd}`),Q.push("  Result: Allowed local discard in linked worktree"),{lines:Q,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(P.embeddedCommandFound)return Q.push(""),Q.push(`STEP ${V} ${z.h} Fallback scan`),Q.push(`  Found: ${P.embeddedCommandFound}`),{lines:Q,incrementStep:!0};return null}case"custom-rules-check":{if(P.rulesChecked){if(Q.push(""),Q.push(`STEP ${V} ${z.h} Custom rules`),P.matched)Q.push("  Result: MATCHED");else Q.push("  Result: No match");return{lines:Q,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(P.matched)return Q.push(""),Q.push(`STEP ${V} ${z.h} Dangerous text check`),Q.push(`  Token:  ${P.token}`),Q.push("  Result: MATCHED"),{lines:Q,incrementStep:!0};return null}case"strict-unparseable":return Q.push(""),Q.push(`STEP ${V} ${z.h} Strict mode check`),Q.push(`  Command: ${P.rawCommand}`),Q.push("  Result:  ✗ UNPARSEABLE"),{lines:Q,incrementStep:!0};case"segment-skipped":return null;case"error":return Q.push(""),Q.push(`ERROR: ${P.message}`),{lines:Q,incrementStep:!1};default:return P}}function Yo(P,V){let z=ul(V?.asciiOnly??!1),Q=58,te=[],ne=1;te.push(...pl(z,58)),te.push("");let ce=P.trace.steps.find((xe)=>xe.type==="error");if(ce&&ce.type==="error"){te.push("ERROR"),te.push(`  ${ce.message}`),te.push(""),te.push("RESULT"),te.push(`  Status: ${P.result==="blocked"?dt.red("BLOCKED"):dt.green("ALLOWED")}`),te.push(""),te.push("CONFIG");let xe=P.configSource??"none";return te.push(`  Path: ${xe}`),te.join(`
`)}let ye=P.trace.steps.find((xe)=>xe.type==="parse");if(ye&&ye.type==="parse"){te.push("INPUT"),te.push(`  ${ye.input}`),te.push(""),te.push(`STEP ${ne} ${z.h} Split shell commands`),ne++;for(let xe=0;xe<ye.segments.length;xe++){let at=ye.segments[xe];if(at){let ct=Math.random();te.push(`  Segment ${xe+1}: ${fl(at,ct)}`)}}}let he=P.trace.segments,be=he.length>1;for(let xe of he){if(be){te.push("");let pt="";if(ye&&ye.type==="parse"){let Xr=ye.segments[xe.index];if(Xr)pt=Xr.join(" ")}let mt=54,gt=pt,ut=` Segment ${xe.index+1}: `,vt=" ";if(pt){if(ut.length+pt.length+vt.length>mt){let Hd=mt-ut.length-vt.length;gt=`${pt.substring(0,Hd-1)}…`}}let Dt=pt?`${ut}${gt}${vt}`:` Segment ${xe.index+1} `,Nd=pt?`${ut}${dt.cyan(gt)}${vt}`:Dt,$i=58-Dt.length,Ii=Math.floor($i/2),Md=$i-Ii;te.push(`${z.sh.repeat(Ii)}${Nd}${z.sh.repeat(Md)}`)}if(xe.steps.find((pt)=>pt.type==="segment-skipped")){te.push(""),te.push("  (skipped — prior segment blocked)");continue}let ct=!1,lt=!1;for(let pt of xe.steps){let mt=ml(pt,ne,z);if(mt){if(lt=!0,pt.type==="recurse"){te.push("");let gt=" RECURSING ",ut=58-gt.length-4;te.push(`  ${z.tl}${z.h}${gt}${z.h.repeat(ut)}`),te.push(`  ${z.v}`),ct=!0;continue}for(let gt of mt.lines)if(ct)te.push(`  ${z.v} ${gt}`);else te.push(gt);if(mt.incrementStep)ne++}}if(ct)te.push(`  ${z.v}`),te.push(`  ${z.bl}${z.h.repeat(56)}`),ct=!1;if(!lt)te.push(""),te.push(`  ${dt.green("✓")} Allowed (no matching rules)`)}if(te.push(""),te.push("RESULT"),P.result==="blocked"){if(te.push(`  Status: ${dt.red("BLOCKED")}`),P.customRule){if(te.push(`  Rule: ${P.customRule.id}`),P.customRule.rulebook)te.push(`  Rulebook: ${P.customRule.rulebook.name} ${P.customRule.rulebook.version}`);if(P.customRule.source)te.push(`  Source: ${P.customRule.source}`);if(P.customRule.override)te.push(`  Override: reason ${P.customRule.override.reason}`)}if(P.reason){let xe=jn(P.reason,"          ");te.push(`  Reason: ${xe[0]}`);for(let at=1;at<xe.length;at++)te.push(xe[at]??"")}}else te.push(`  Status: ${dt.green("ALLOWED")}`);te.push(""),te.push("CONFIG");let Le=P.configSource??"none",Ie=P.configValid?"":" (invalid)";te.push(`  Path: ${Le}${Ie}`);let Xe=P.safetyPresetScope;te.push(`  Safety preset: ${P.selectedPreset??"standard"}${Xe?` (${rr(Xe)})`:""}`),te.push(`  Effective capabilities: ${P.effectiveLevel}`);let et=Object.entries(P.destructiveCommandRuleOverrides??{});if(te.push(`  Rule customizations: ${et.length}`),P.ruleActivation)te.push(`  Rule activation: ${P.ruleActivation.id} — ${P.ruleActivation.enabled?"on":"off"} via ${P.ruleActivation.source}`);return te.join(`
`)}function Zo(P){return JSON.stringify(P,null,2)}import{resolve as Tf}from"node:path";var Ef=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function gl(P){let V=0,z={allocateSegment(){return V++},getNextSegmentIndex(){return V},recordGlobal(Q){P.record({kind:"step",scope:"global",step:Q})},recordSegment(Q,te=z.currentSegmentIndex){if(te===void 0)return;P.record({kind:"step",scope:"segment",segmentIndex:te,step:Q})}};return z}function yl(P={}){let V=[],z=P.maxEvents??512,Q={maxTextLength:P.maxTextLength??2048,maxListLength:P.maxListLength??128,maxObjectProperties:P.maxObjectProperties??P.maxListLength??128,maxDepth:P.maxDepth??16},te,ne=new Set;return{record(ce){if(te)return;if(!ce||V.length>=z)return;try{V.push(ei(Df(ce,Q,ne)))}catch{}},finish(){if(te)return te;return te=ei({events:Object.freeze(V)}),te}}}function Df(P,V,z){if(P.kind!=="step")throw TypeError("invalid trace event");let{scope:Q,step:te}=P;Ar(te,z,V);let ne=Xo(te,V,z);if(Q==="global")return{kind:"step",scope:"global",step:ne};if(Q!=="segment")throw TypeError("invalid trace event scope");return{kind:"step",scope:"segment",segmentIndex:P.segmentIndex,step:ne}}function Ar(P,V,z,Q=0,te=new WeakSet){if(typeof P==="string"){let ye=P.slice(0,z.maxTextLength);if(!Ge(ye))return;for(let he of Ze(ye))for(let be of he.match(/[^\s"'()$]+/g)??[])V.add(hl(be));return}if(!P||typeof P!=="object"||Q>=z.maxDepth||te.has(P))return;if(te.add(P),Array.isArray(P)){let ye=Math.min(P.length,z.maxListLength);for(let he=0;he<ye;he++)Ar(P[he],V,z,Q+1,te);return}let ne=0,ce=new Set;for(let ye in P){if(!Object.hasOwn(P,ye))continue;if(ne>=z.maxObjectProperties)break;ne++,Ar(ye,V,z);let he=Qo(ye,z,V);if(ce.has(he))continue;ce.add(he),Ar(P[ye],V,z,Q+1,te)}}function Xo(P,V,z,Q=0,te=new WeakSet){if(typeof P==="string")return Qo(P,V,z);if(!P||typeof P!=="object")return P;if(Q>=V.maxDepth)return;if(te.has(P))return;if(te.add(P),Array.isArray(P)){let ye=[],he=Math.min(P.length,V.maxListLength);for(let be=0;be<he;be++)ye.push(Xo(P[be],V,z,Q+1,te));return ye}let ne={},ce=0;for(let ye in P){if(!Object.hasOwn(P,ye))continue;if(ce>=V.maxObjectProperties)break;ce++;let he=Qo(ye,V,z);if(Object.hasOwn(ne,he))continue;Object.defineProperty(ne,he,{value:Xo(P[ye],V,z,Q+1,te),enumerable:!0,configurable:!0,writable:!0})}return ne}function Qo(P,V,z){let Q=P.slice(0,V.maxTextLength),te=Ge(Q)?Ue(Q):Q,ne=z.size>0?_f(te,z):te;return(Af(ne)?ke(ne):ne).slice(0,V.maxTextLength)}function Af(P){return P.includes("PRIVATE KEY")||P.includes("://")||P.includes("eyJ")||P.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(P)||P.length>=14&&Ef.some((V)=>P.includes(V))||P.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(P)}function _f(P,V){return P.replace(/[^\s"'()$]+/g,(z)=>V.has(hl(z))?"<redacted>":z)}function hl(P){let V=2166136261,z=2166136261;for(let Q=0;Q<P.length;Q++)V=Math.imul(V^P.charCodeAt(Q),16777619),z=Math.imul(z^P.charCodeAt(P.length-Q-1),16777619);return`${V>>>0}:${z>>>0}:${P.length}`}function ei(P){if(P&&typeof P==="object"&&!Object.isFrozen(P)){for(let V of Object.values(P))ei(V);Object.freeze(P)}return P}function Nn(P,V={},z){let Q=Tf(V.cwd??process.cwd()),te=V.policySnapshot??E(z,{cwd:Q,userConfigDir:V.userConfigDir}),ne=L(te.policy,z.env),ce=Fe({policySnapshot:te,effectiveCapabilities:ne.capabilities,strict:ne.strict,paranoidRm:ne.paranoidRm,paranoidInterpreters:ne.paranoidInterpreters,worktreeMode:ne.worktreeMode}),ye={effectiveLevel:ce.effectiveLevel,selectedPreset:te.policy.safety.level??"standard",...te.policyScopes?{safetyPresetScope:te.policyScopes.levelScope}:{},effectiveCapabilities:ce.effectiveCapabilities,destructiveCommandRuleOverrides:te.policy.destructiveCommandRuleOverrides},{configSource:he,configValid:be}=If(z,{cwd:Q,userConfigDir:V.userConfigDir});if(!P||!P.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:he,configValid:be,...ye};let Le=h(P,"auto");if(Le.status==="limited")throw new y;let Ie=Le.dialect==="powershell"?h(P,"posix"):Le,Xe=st(Ie),et=yl(),xe=gl(et);xe.recordGlobal({type:"parse",input:P,segments:Xe.map((Dt)=>[...Dt])});let at=d("Bash",{command:P},{kind:"command",shell:"auto"},{configCwd:Q,executionCwd:Q},P),ct=W(at,{environment:z,trace:xe,dependencies:{loadPolicySnapshot:()=>te}}),lt=ct.decision.kind==="deny"?ct.decision:null;if(lt&&(ct.stage==="policy-protection"||ct.stage==="secret-protection")){let Dt=$f(lt);return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:Dt.rule,matched:!0,reason:lt.reason}]}]},result:"blocked",reason:k(lt.reason),segment:k(vl(lt,P)),...Dt.ruleId?{ruleId:k(Dt.ruleId)}:{},configSource:he,configValid:be,...ye}}let pt=xe.getNextSegmentIndex();if(lt&&pt>0&&pt<Xe.length)xe.recordSegment({type:"segment-skipped",index:pt,reason:"prior-segment-blocked"},pt);let mt=et.finish(),gt=lt?.ruleId??Of(at,te,ne,z),ut=U.find((Dt)=>Dt.id===gt&&Dt.activationCapability),vt=ut?ce.policy.effectiveDestructiveCommandRules[ut.id]:void 0;return{trace:jf(mt),result:lt?"blocked":"allowed",reason:lt?k(lt.reason):void 0,segment:lt?k(vl(lt,P)):void 0,ruleId:lt?.ruleId?k(lt.ruleId):void 0,customRule:Ff(Nf(lt?.ruleId,te)),configSource:he,configValid:be,...ye,...ut&&vt?{ruleActivation:{id:ut.id,...vt}}:{}}}function vl(P,V){return P.evidence?.segment??V}function $f(P){if(P.reason===$e)return{ruleId:"policy-protection",rule:"policy-protection:findPolicyConfigMutationTargetInSemanticFacts"};if(P.reason===Me)return{ruleId:"policy-apply-protection",rule:"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts"};if(P.reason===x)return{ruleId:"git-metadata-protection",rule:"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts"};return{ruleId:P.ruleId,rule:"secret-protection:findSensitiveTargetInSemanticFacts"}}function If(P,V){let z=F(V.cwd),Q=M(P,V),te=K(P,{cwd:V.cwd,userConfigDir:V.userConfigDir});try{if(n(te.projectConfigTarget)!==null){if(Jt(te.projectConfigTarget).errors.length===0)return{configSource:z,configValid:!0};return{configSource:z,configValid:!1}}}catch(ne){if(ne instanceof r)return{configSource:z,configValid:!1};throw ne}try{if(n(te.userConfigTarget)!==null){let ne=Jt(te.userConfigTarget);return{configSource:Q,configValid:ne.errors.length===0}}return{configSource:null,configValid:!0}}catch(ne){if(ne instanceof r)return{configSource:Q,configValid:!1};throw ne}}function Of(P,V,z,Q){let te=V.policy,ne=Ee({...te,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...te.destructiveCommandRuleOverrides,...Object.fromEntries(U.flatMap((ye)=>ye.activationCapability?[[ye.id,"on"]]:[]))}},V.state==="degraded"?{diagnostics:V.diagnostics,reason:V.reason}:void 0),ce=W(P,{environment:Q,dependencies:{loadPolicySnapshot:()=>ne,getModes:()=>({...z,strict:!0,paranoidRm:!0,paranoidInterpreters:!0}),findSensitiveTarget:()=>null}});return ce.decision.kind==="deny"?ce.decision.ruleId:void 0}function Ff(P){if(!P)return;return{id:k(P.id),...P.rulebook?{rulebook:{name:k(P.rulebook.name),version:k(P.rulebook.version)}}:{},...P.source?{source:k(P.source)}:{},...P.override?{override:{type:"reason",reason:k(P.override.reason)}}:{}}}function jf(P){let V=P.events.flatMap((Q)=>Q.kind==="step"&&Q.scope==="global"?[Q.step]:[]),z=new Map;for(let Q of P.events){if(Q.kind!=="step"||Q.scope!=="segment")continue;let te=z.get(Q.segmentIndex)??{index:Q.segmentIndex,steps:[]};te.steps.push(Q.step),z.set(Q.segmentIndex,te)}return{steps:V,segments:[...z.values()]}}function Nf(P,V){let z=P?.replace(/^custom\./,"");if(!z||!V.policy.rules.some((Q)=>Q.name===z))return;return V.ruleMetadata[z]??Object.freeze({id:z})}function bl(P){return new Promise((V)=>{process.stdout.write(`${P}
`,()=>V())})}async function Ll(P,V){let z=Wo(V);if(!z)return 1;try{let Q=Nn(z.command,{cwd:z.cwd},P),te=!!process.env.NO_COLOR||!process.stdout.isTTY;return await bl(z.json?Zo(Q):Yo(Q,{asciiOnly:te})),0}catch(Q){let te=Mf(Q instanceof p?Q.cause:Q);if(te===void 0)throw Q;if(z.json)return await bl(JSON.stringify({error:te})),1;return console.error(te),1}}function Mf(P){if(P instanceof y)return P.message;if(P instanceof f)return P.message;if(P instanceof s&&a[P.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var wl="2.4.3",Ot="  ",rn="cc-safety-net";function kl(P){return P.argument?`${P.flags} ${P.argument}`:P.flags}function Hf(P){return Math.max(...P.map((V)=>kl(V).length))}function Uf(P){return Math.max(...P.map((V)=>V.usage.length))}function Gf(P){return Math.max(...P.map((V)=>`${rn} ${V.usage}`.length))}function Bf(P,V){let z=`${rn} ${P.usage}`;return`${Ot}${z.padEnd(V+2)}${P.description}`}function qt(P,V){return`${Ot}${P.padEnd(Math.max(40,P.length+2))}${V}`}function wn(P,V=console.log){let z=[];if(z.push(`${rn} ${P.name}`),z.push(""),z.push(`${Ot}${P.description}`),z.push(""),z.push("USAGE:"),z.push(`${Ot}${rn} ${P.usage}`),z.push(""),P.subcommands&&P.subcommands.length>0){z.push("SUBCOMMANDS:");let Q=Uf(P.subcommands);for(let te of P.subcommands)z.push(`${Ot}${te.usage.padEnd(Q+2)}${te.description}`);z.push("")}if(P.options.length>0){z.push("OPTIONS:");let Q=Hf(P.options);for(let te of P.options){let ne=kl(te),ce=te.default?`${te.description} (default: ${te.default})`:te.description;z.push(`${Ot}${ne.padEnd(Q+2)}${ce}`)}z.push("")}if(P.examples&&P.examples.length>0){z.push("EXAMPLES:");for(let Q of P.examples)z.push(`${Ot}${Q}`)}V(z.join(`
`))}function ti(){let P=Gf(Qn),V=[];V.push(`${rn} v${wl}`),V.push(""),V.push("Blocks destructive commands and secret access."),V.push(""),V.push("COMMANDS:");for(let z of Qn)V.push(Bf(z,P));V.push(""),V.push("GLOBAL OPTIONS:"),V.push(`${Ot}-h, --help       Show help (use with command for command-specific help)`),V.push(`${Ot}-V, --version    Show version`),V.push(""),V.push("HELP:"),V.push(`${Ot}${rn} help <command>     Show help for a specific command`),V.push(`${Ot}${rn} <command> --help   Show help for a specific command`),V.push(""),V.push("ENVIRONMENT VARIABLES:"),V.push(qt(`${o.level.name}=standard|strict|paranoid`,"Set session safety level")),V.push(qt(`${o.worktree.name}=1`,"Allow local git discards in linked worktrees")),V.push(qt(`${o.debug.name}=1`,"Print diagnostic messages to stderr")),V.push(qt(`${o.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),V.push(qt("CC_SAFETY_NET_HOME","Override rule config home directory")),V.push(""),V.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),V.push(qt(`${o.strict.name}=1`,"Force safety.overrides.fail_closed on")),V.push(qt(`${o.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),V.push(qt(`${o.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),V.push(qt(`${o.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),V.push(""),V.push("Documentation:        https://ccsafetynet.com/docs"),console.log(V.join(`
`))}function xl(){console.log(wl)}function Mn(P,V=console.log){let z=er(P);if(!z)return!1;if(z.name.toLowerCase()!==P.toLowerCase())return!1;return wn(z,V),!0}import{existsSync as mi,readFileSync as bc}from"node:fs";import{join as pi}from"node:path";import*as Kt from"node:readline";function qf(P){return P==="install"?"Install":"Uninstall"}function Vf(P){return P==="install"?"Installing":"Uninstalling"}function zf(P){return P==="install"?"into":"from"}function Rl(P){return P?.available===!0}function Jf(P,V){let z=new Set(V);return P.filter((Q)=>z.has(Q.target)).map((Q)=>Q.target)}function Cl(P,V,z){if(P.length===0||P.every((Q)=>!Q.available))return V;return Array.from({length:P.length},(Q,te)=>te+1).map((Q)=>(V+Q*z+P.length)%P.length).find((Q)=>Rl(P[Q]))}function Wf(P,V,z){if(z.ctrl&&z.name==="c")return"interrupt";if(z.name==="escape"||V==="q")return"abort";if(P==="install"&&(V==="u"||V==="U"))return"update";if(z.name==="up"||V==="k")return"up";if(z.name==="down"||V==="j")return"down";if(z.name==="space"||V===" ")return"toggle";if(z.name==="return"||z.name==="enter")return"confirm";return null}function Kf(P){return{cursor:P.findIndex((V)=>V.available),selected:[]}}function Yf(P,V,z){if(z==="confirm"||z==="update"||z==="abort"||z==="interrupt")return{state:P,done:z};if(z==="up")return{state:{...P,cursor:Cl(V,P.cursor,-1)}};if(z==="down")return{state:{...P,cursor:Cl(V,P.cursor,1)}};let Q=V[P.cursor];if(!Rl(Q))return{state:P};let te=P.selected.includes(Q.target)?P.selected.filter((ne)=>ne!==Q.target):Jf(V,[...P.selected,Q.target]);return{state:{...P,selected:te}}}var Pl="◉",El="◯",Dl=">",Al=" ";function Zf(P,V,z,Q={}){let te=Q.color!==!1,ne=te?dt.dim:(he)=>he,ce=te?dt.green:(he)=>he,ye=te?dt.bold:(he)=>he;return["",`${qf(P)} CC Safety Net ${zf(P)}:`,"",...V.map((he,be)=>{let Le=z.selected.includes(he.target),Ie=be===z.cursor,Xe=Le?Pl:El,et=Ie?Dl:Al,xe=he.available?"":` (${he.unavailableReason??"not installed"})`,at=`${Xe} ${he.label}${xe}`,ct=!he.available?ne(at):Le?ce(at):Ie?ye(at):at;return`${et} ${ct}`}),"",P==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":V.some((he)=>he.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${P}. q/Esc: close`].join(`
`)}var Sl=["global-hook","plugin"];function Xf(P,V,z={}){let Q=z.color!==!1?dt.bold:(ne)=>ne;return["","Install the Kimi Code integration as:","",...[`Global hook — ${V?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((ne,ce)=>{let ye=ce===P,he=`${ye?Pl:El} ${ne}`;return`${ye?Dl:Al} ${ye?Q(he):he}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function _l(P){let{input:V,output:z}=P;Kt.emitKeypressEvents(V);let Q=V.isRaw===!0;V.setRawMode(!0),V.resume();let te=0,ne=()=>{if(te===0)return;Kt.moveCursor(z,0,-te),Kt.cursorTo(z,0),Kt.clearScreenDown(z)},ce=()=>{ne();let ye=P.render();z.write(`${ye}
`),te=ye.split(`
`).length};return new Promise((ye)=>{let he=(Le)=>{V.off("keypress",be),V.setRawMode(Q),V.pause(),ne(),ye(Le)};function be(Le,Ie){P.onKey(Le,Ie,{finish:he,draw:ce})}V.on("keypress",be),ce()})}function Tl(P={}){let V=0;return _l({input:P.input??process.stdin,output:P.output??process.stdout,render:()=>Xf(V,P.globalHookInstalled===!0),onKey:(z,Q,te)=>{if(Q.ctrl&&Q.name==="c"){te.finish(null),(P.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(Q.name==="escape"||z==="q")return te.finish(null);if(Q.name==="return"||Q.name==="enter")return te.finish(Sl[V]);if(Q.name==="up"||Q.name==="down"||z==="k"||z==="j")V=(V+1)%Sl.length,te.draw()}})}function ni(P=process.stdin,V=process.stdout){return Boolean(P.isTTY&&V.isTTY&&typeof P.setRawMode==="function")}function $l(P,V,z={}){let Q=z.output??process.stdout,te=Kf(V);return _l({input:z.input??process.stdin,output:Q,render:()=>Zf(P,V,te),onKey:(ne,ce,ye)=>{let he=Wf(P,ne,ce);if(!he)return;let be=Yf(te,V,he);if(te=be.state,be.done==="interrupt"){ye.finish(null),(z.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(be.done==="abort")return ye.finish(null);if(be.done==="update")return ye.finish("update");if(be.done==="confirm"){if(te.selected.length===0){Q.write("\x07"),ye.draw();return}ye.finish([...te.selected]),Q.write(`${Vf(P)} selected integrations...
`);return}ye.draw()}})}import{existsSync as Il,lstatSync as em,mkdirSync as tm,mkdtempSync as nm,readdirSync as rm,readFileSync as xn,rmSync as Tr}from"node:fs";import{basename as om,dirname as im,join as Et}from"node:path";import{fileURLToPath as sm}from"node:url";var ri="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",on="cc-safety-net",sn="cc-safety-net/index.ts";import{spawn as Qf}from"node:child_process";var oi=(P,V)=>{let z=Xt([...P],process.env);return new Promise((Q)=>{let te=Qf(z.cmd,z.args,{cwd:V,stdio:["ignore","pipe","pipe"]}),ne=Io(te),ce=!1,ye=setTimeout(()=>{ce=!0,te.kill()},120000);te.on("error",(he)=>{clearTimeout(ye),Q({status:null,errorCode:he.code,stdout:ne.stdout,stderr:[he.message,ne.stderr].filter(Boolean).join(`
`)})}),te.on("close",(he)=>{clearTimeout(ye),Q({status:ce?null:he,errorCode:ce?"ETIMEDOUT":void 0,stdout:ne.stdout,stderr:ne.stderr})})})};var kn="cc-safety-net.ts",ii=Et("amp",sn);function am(P){return Et(P.home,".config","amp","plugins","cc-safety-net.ts")}function lm(){let P=im(sm(import.meta.url));return[Et(P,ii),Et(P,"..",ii),Et(P,"..","..","..","dist",ii)]}function cm(P=lm()){let V=P.find((z)=>Il(z)&&em(z).isFile());if(!V)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return V}function Ol(P){try{return JSON.parse(P)}catch{return}}function $r(P){return P.subarray(0,Buffer.byteLength(ri)).toString("utf-8")===ri}async function Hn(P,V,z){let Q=await P(V,z);if(Q.status===0)return Q;throw Error([`Failed to run ${V.join(" ")}${Q.status===null?"":` (exit ${Q.status})`}.`,[Q.stdout,Q.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Fl(P){let V=await P(["amp","plugins","repositories","--json"]);if(V.status===null)throw Error(`${V.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${V.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${V.stderr}`.trim());if(V.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${V.status}). Sign in with "amp login" and rerun install --amp.
${[V.stdout,V.stderr].filter(Boolean).join(`
`)}`.trim());let z=Ol(V.stdout),Q=(Array.isArray(z)?z:[]).filter((te)=>ft(te,"scope")==="user"&&ft(te,"exists")===!0&&ft(te,"viewerCanWrite")===!0).map((te)=>ft(te,"cloneRef")).find((te)=>typeof te==="string"&&te.length>0);if(!Q)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return Q}async function jl(P,V,z){let Q=nm(Et(V.tmpdir,"cc-safety-net-amp-"));try{return await Hn(P,["amp","clone","user-plugins",Q]),await z(Q)}finally{Tr(Q,{recursive:!0,force:!0})}}function si(P){return`rerun ${P==="overwrite"?"install":"uninstall"} --amp`}function Nl(P,V,z){let Q=Et(P,V),te=Lt(Q);if(!te)return;if(te.isSymbolicLink()||!te.isFile())throw Error(`Refusing to ${z} ${V} in your Amp personal plugins repository: not a regular file. Remove it there and ${si(z)}.`);let ne=xn(Q);if($r(ne))return ne;throw Error(`Refusing to ${z} unmanaged file ${V} in your Amp personal plugins repository. Remove it there and ${si(z)}.`)}function Ml(P,V){let z=Et(P,on),Q=Lt(z);if(!Q)return;if(Q.isSymbolicLink()||!Q.isDirectory())throw Error(`Refusing to ${V} ${on} in your Amp personal plugins repository: not a regular directory. Remove it there and ${si(V)}.`);return Nl(P,sn,V)}function dm(P){let V=Et(P,kn),z=Lt(V);if(!z||z.isSymbolicLink()||!z.isFile())return;let Q=xn(V);return $r(Q)?Q:void 0}async function Hl(P,V,z,Q){if(await Hn(P,z,V),(await Hn(P,["git","status","--porcelain"],V)).stdout.trim()==="")return!1;return await Hn(P,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",Q],V),await Hn(P,["git","push","origin","HEAD"],V),!0}function _r(P,V){um(P,V),pm(P,V)}function Ul(P,V){if(V==="keep")return;throw Error(`Local Amp plugin ${P} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function um(P,V){let z=am(P),Q=Lt(z);if(!Q)return;if(!Q.isSymbolicLink()&&Q.isFile()&&$r(xn(z))){Tr(z);return}Ul(z,V)}function pm(P,V){let z=Et(P.home,".config","amp","plugins",on),Q=Lt(z);if(!Q)return;if(!Q.isSymbolicLink()&&Q.isDirectory()&&fm(z)){Tr(z,{recursive:!0});return}Ul(z,V)}function fm(P){let V=om(sn);if(rm(P).join("\x00")!==V)return!1;let z=Et(P,V),Q=Lt(z);return!!Q&&!Q.isSymbolicLink()&&Q.isFile()&&$r(xn(z))}function mm(P){let V=u(P);if(!Il(V))return"";let z=Ol(xn(V,"utf-8"));if(!z||typeof z!=="object"||Array.isArray(z))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(C(z,P.home))};
`}async function Gl(P,V=cm(),z=oi){let Q=Buffer.concat([xn(V),Buffer.from(mm(P),"utf-8")]),te=await Fl(z);return jl(z,P,async(ne)=>{let ce=`${te}/${on}`,ye=Ml(ne,"overwrite"),he=Nl(ne,kn,"overwrite");if(ye?.equals(Q)&&!he)return _r(P,"fail"),{path:ce,alreadyInstalled:!0};if(tm(Et(ne,on),{recursive:!0}),kt(Et(ne,sn),Q),he)Tr(Et(ne,kn));let be=await Hl(z,ne,["git","add","--",sn,...he?[kn]:[]],`chore: update cc-safety-net plugin to v${wt()}`);return _r(P,"fail"),{path:ce,alreadyInstalled:!be}})}async function Bl(P,V=oi){let z=await Fl(V);return jl(V,P,async(Q)=>{let te=Ml(Q,"remove"),ne=dm(Q),ce=`${z}/${ne&&!te?kn:on}`;if(!te&&!ne)return _r(P,"keep"),{path:ce,alreadyInstalled:!1};return await Hl(V,Q,["git","rm","--",...te?[sn]:[],...ne?[kn]:[]],`chore: remove cc-safety-net plugin v${wt()}`),_r(P,"keep"),{path:ce,alreadyInstalled:!0}})}import{existsSync as ql,mkdirSync as gm,readFileSync as ym}from"node:fs";import{dirname as hm}from"node:path";var ai=Nt["antigravity-cli"],an="cc-safety-net";function ln(P){return Boolean(P)&&typeof P==="object"&&!Array.isArray(P)}function Or(){return{PreToolUse:[{hooks:[{type:"command",command:ai,timeout:30}]}]}}function Vl(P){try{let V=JSON.parse(ym(P,"utf-8"));if(!V||typeof V!=="object"||Array.isArray(V))throw Error("Antigravity hooks config must be a JSON object");return V}catch(V){if(V instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${P}: ${V.message}`);throw V}}function zl(P){let V=P[an];if(V===void 0){let Q=Or();return P[an]=Q,{definition:Q,preToolUse:Q.PreToolUse??[]}}if(!ln(V))throw Error(`Antigravity hooks config entry "${an}" must be an object`);let z=Array.isArray(V.PreToolUse)?V.PreToolUse:[];return V.PreToolUse=z,{definition:V,preToolUse:z}}function Jl(P){if(!Array.isArray(P.PreToolUse))return!1;return P.PreToolUse.some((V)=>ln(V)&&Array.isArray(V.hooks)&&V.hooks.some((z)=>ln(z)&&z.command===ai))}function vm(P){return Object.values(P).some((V)=>ln(V)&&V.enabled!==!1&&Jl(V))}function bm(P){if(P[an]===void 0)return!1;let V=zl(P);if(V.definition.enabled!==!1||!Jl(V.definition))return!1;return V.definition.enabled=!0,!0}function Lm(P){if(P[an]===void 0){P[an]=Or();return}let V=zl(P);V.definition.enabled=!0,V.preToolUse.push(Or().PreToolUse?.[0]??{hooks:[]})}function wm(P){let V=!1;for(let z of Object.values(P)){if(!ln(z)||!Array.isArray(z.PreToolUse))continue;z.PreToolUse=z.PreToolUse.flatMap((Q)=>{if(!ln(Q)||!Array.isArray(Q.hooks))return[Q];let te=Q.hooks.filter((ne)=>!ln(ne)||ne.command!==ai);if(te.length!==Q.hooks.length)V=!0;return te.length===0?[]:[{...Q,hooks:te}]})}return V}function Ir(P,V){kt(P,`${JSON.stringify(V,null,2)}
`)}function Wl(P){let V=En(P.home);if(gm(hm(V),{recursive:!0}),!ql(V))return Ir(V,{[an]:Or()}),{path:V,alreadyInstalled:!1};let z=Vl(V);if(vm(z))return{path:V,alreadyInstalled:!0};if(bm(z))return Ir(V,z),{path:V,alreadyInstalled:!1};return Lm(z),Ir(V,z),{path:V,alreadyInstalled:!1}}function Kl(P){let V=En(P.home);if(!ql(V))return{path:V,alreadyInstalled:!1};let z=Vl(V);if(!wm(z))return{path:V,alreadyInstalled:!1};return Ir(V,z),{path:V,alreadyInstalled:!0}}import{existsSync as km,readdirSync as xm,rmSync as Cm}from"node:fs";import{join as Sm}from"node:path";function Yl(P,V=process.platform,z){if(!km(P))return;let Q=V==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);xm(P).filter((te)=>te!==z&&Q.test(te)).forEach((te)=>{Cm(Sm(P,te),{recursive:!0,force:!0})})}import{spawn as Rm}from"node:child_process";var Mt=$t.map((P)=>({target:P.id,flag:P.flag,label:bt(P.id),probeCommand:P.probeCommand}));function li(P){let V=new Set(P);return Mt.map((z)=>z.target).filter((z)=>V.has(z))}async function Zl(P,V){for(let z of P)await V(z)}var Pm=5000;function ci(P,V=Pm){return new Promise((z)=>{let Q=Xt([...P],process.env),te=Rm(Q.cmd,Q.args,{env:process.env,stdio:"ignore"}),ne=!1,ce=(he)=>{if(ne)return;ne=!0,clearTimeout(ye),z(he)},ye=setTimeout(()=>{te.kill(),ce(!1)},V);te.on("error",()=>ce(!1)),te.on("close",(he)=>ce(he===0))})}function Xl(P=ci,V={}){let z=new Set(V.configuredTargets??[]);return Promise.all(Mt.map(async(Q)=>({target:Q.target,flag:Q.flag,label:Q.label,...ec(V.action,await P(Q.probeCommand),z.has(Q.target))})))}function Ql(P,V){let z=new Set(V.configuredTargets??[]);return P.map((Q)=>({...Q,...ec(V.action,Q.available,z.has(Q.target))}))}function ec(P,V,z){if(P==="uninstall")return z?{available:!0}:{available:!1,unavailableReason:"not installed"};if(P==="install"&&z)return{available:!1,unavailableReason:"already installed"};if(!V)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}import{existsSync as tc,readdirSync as Em,rmSync as Dm}from"node:fs";import{join as Cn}from"node:path";function Fr(P,V=process.platform){let z=Cn(P.env.get("npm_config_cache")||(V==="win32"?Cn(P.env.get("LOCALAPPDATA")||Cn(P.home,"AppData","Local"),"npm-cache"):Cn(P.home,".npm")),"_npx");if(!tc(z))return;Em(z).filter((Q)=>tc(Cn(z,Q,"node_modules","cc-safety-net"))).forEach((Q)=>{Dm(Cn(z,Q),{recursive:!0,force:!0})})}import{existsSync as ac,mkdirSync as _m,readFileSync as lc}from"node:fs";import{dirname as Tm,join as sc}from"node:path";function Am(P,V){if(P[V]!=="#")return V;let z=P.indexOf(`
`,V+1);return z===-1?P.length:z+1}function di(P,V,z){let Q=new RegExp(`^(\\s*)${V}\\s*=\\s*\\[`),te=0;for(let ne of P.split(`
`)){if(/^\s*\[/.test(ne))return;let ce=Q.exec(ne);if(ce){let ye=te+ce[0].lastIndexOf("[");return{start:ye,end:ho(P,ye,{skipComment:Am,...z})}}te+=ne.length+1}return}function nc(P,V,z){let Q=P.slice(0,V.end).trimEnd(),te=Zs(P,V.end),ne=te===""?"     ":`${te}  `,ce=!Q.endsWith("[")&&!Q.endsWith(",");return`${Q}${ce?",":""}
${ne}${z}${P.slice(V.end)}`}function rc(P,V,z){let Q=P.indexOf(z,V.start);if(Q===-1||Q>V.end)return P;return fr(P,{start:Q,end:Q+z.length})}function oc(P,V){let z=new RegExp(`^\\s*${V}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),Q=P.split(`
`),te=Q.findIndex((ye)=>/^\s*\[/.test(ye)),ne=te===-1?Q:Q.slice(0,te),ce=te===-1?[]:Q.slice(te);return[...ne.filter((ye)=>!z.test(ye)),...ce].join(`
`)}function ic(P,V,z){let Q=new RegExp(`^\\s*\\[\\[${V}]]\\s*$`,"m");return P.split(/(?=^\s*\[)/m).filter((te)=>!Q.test(te)||!te.includes(z)).join("").trimEnd()}var Un=Nt["kimi-code"],ui=`[[hooks]]
event = "PreToolUse"
command = "${Un}"`,cc=`{ event = "PreToolUse", command = "${Un}" }`,dc={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function uc(P){return sc(P.env.get("KIMI_CODE_HOME")??sc(P.home,".kimi-code"),"config.toml")}function $m(P){let V=di(P,"hooks",dc);if(V&&P.slice(V.start+1,V.end).trim())return nc(P,V,cc);let z=oc(P,"hooks").trimEnd();if(z==="")return`${ui}
`;return`${z}

${ui}
`}function pc(P){let V=uc(P);if(_m(Tm(V),{recursive:!0}),!ac(V))return kt(V,`${ui}
`),{path:V,alreadyInstalled:!1};let z=lc(V,"utf-8");if(z.includes(Un))return{path:V,alreadyInstalled:!0};return kt(V,$m(z)),{path:V,alreadyInstalled:!1}}function fc(P){let V=uc(P);if(!ac(V))return{path:V,alreadyInstalled:!1};let z=lc(V,"utf-8");if(!z.includes(Un))return{path:V,alreadyInstalled:!1};let Q=di(z,"hooks",dc),te=Q?rc(z,Q,cc):`${ic(z,"hooks",Un)}
`;return kt(V,te),{path:V,alreadyInstalled:!0}}var fi="safety-net@cc-marketplace",mc=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),gc=new Set(["antigravity-cli","cursor","grok-build","hermes-agent","kimi-code"]);function gi(P){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(P??"")}function Lc(P){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(P??"")}function Im(P){return/^Marketplace `cc-marketplace`\s*$/m.test(P??"")}var wc={"claude-code":{installCommands:(P)=>{let V=pr(P,"cc-safety-net@cc-marketplace");return{commands:[...V?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...go(P).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:pr(P,fi)?[["claude","plugin","uninstall",fi]]:[],update:V}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(P,V)=>{let z=V??await _t(["codex","plugin","list"]),Q=Lc(z);return{commands:[Q||Im(z)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:gi(z)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:Q}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:"Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."},"copilot-cli":{installCommands:async()=>{let P=await _t(["copilot","plugin","list"]),V=[...oa(P)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...ia(P)?[["copilot","plugin","uninstall",ta]]:[]];if(na(P))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",jt]],cleanupCommands:V,update:!0};return{commands:[ra(await _t(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",jt]],cleanupCommands:V}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(P)=>{let V=Co(P);if(V.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(V.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:Mo,installCommands:()=>({commands:za()}),uninstallCommands:[["openclaw","plugins","uninstall",ht,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{installCommands:ol},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]}};function kc(P,V=(z)=>z){try{let z=JSON.parse(V(bc(P,"utf-8")));if(!z||typeof z!=="object"||Array.isArray(z))throw Error(`Settings file ${P} must be a JSON object`);return z}catch(z){if(z instanceof SyntaxError)throw Error(`Failed to parse ${P}: ${z.message}`);throw z}}function Om(P){let V=pi(Dn(P),"settings.json");if(!mi(V))return;let z=kc(V,At),Q=z.enabledPlugins;if(!Q||typeof Q!=="object"||Array.isArray(Q))return;if(Q[jt]!==!1)return;let te=bc(V,"utf-8"),ne=te.replace(new RegExp(`("${jt}"\\s*:\\s*)false`),"$1true");return Q[jt]=!0,kt(V,ne!==te?ne:`${JSON.stringify(z,null,2)}
`),`Enabled ${jt} plugin in ${V}`}function Fm(P){let V=Vo(P);if(!mi(V))return;let z=kc(V);if(!Array.isArray(z.packages))return;let Q=z.packages.find((te)=>!!te&&typeof te==="object"&&!Array.isArray(te)&&zo(te.source)&&("extensions"in te));if(!Q)return;return delete Q.extensions,kt(V,`${JSON.stringify(z,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${V}`}function yc(P,V){let z=xt({label:V,booleans:Object.fromEntries(Mt.map((ne)=>[ne.target,[ne.flag]]))},P),Q=z.errors[0];if(Q)throw Error(Q);let te=Mt.filter((ne)=>z.flags[ne.target]).map((ne)=>ne.target);if(te.length!==1)throw Error(`Choose exactly one ${V} target: ${Mt.map((ne)=>ne.flag).join(", ")}`);return te[0]}async function xc(P,V=mn){let[z,Q,te]=await Promise.all([V(["amp","plugins","list"],30000),V(["codex","plugin","list"],30000),V(["copilot","--binary-version"])]);return{codexPluginListOutput:Q,hooks:Ln(P,process.cwd(),{ampPluginListOutput:z,codexPluginListOutput:Q,copilotCliVersion:te})}}async function jm(P,V,z=mn){let Q=await xc(P,z);return Q.hooks.filter((te)=>V==="install"?te.configured:te.detected||te.inspectionStatus==="not-inspected").filter((te)=>te.platform!=="codex"||!gi(Q.codexPluginListOutput)||Lc(Q.codexPluginListOutput)).map((te)=>te.platform)}function Nm(P,V,z,Q){if(z.length>0)return{finish:async()=>[yc(z,V)]};if(!Q.selectTargets&&!ni(Q.input,Q.output))return{finish:async()=>[yc(z,V)]};let te=Q.detectConfiguredTargets??(()=>jm(P,V,Q.fetchVersion)),ne=Promise.all([Xl(Q.probeTargets),te()]);return{ready:ne,finish:async()=>{let[ce,ye]=await ne,he=Ql(ce,{action:V,configuredTargets:ye}),be=Q.selectTargets?await Q.selectTargets(V,vc(V,he)):await $l(V,vc(V,he),{input:Q.input,output:Q.output});if(be==="update")return be;if(!be||be.length===0)return null;return li(be)}}}async function Mm(P,V,z=!1,Q){let te=wc[P];te.beforeInstall?.(V);let ne=typeof te.installCommands==="function"?await te.installCommands(V,Q):{commands:te.installCommands};return await Oo(ne.commands),await Ua(ne.cleanupCommands??[]),await ne.afterInstall?.(),[`${ne.update||z?"Updated":"Installed"} ${bt(P)} integration`,te.postInstallMessage].filter(Boolean).join(`
`)}async function Hm(P){let V=wc[P];if(!V.uninstallCommands)throw Error(`${bt(P)} uninstall is not supported`);return await Oo(V.uninstallCommands),`Uninstalled ${bt(P)} integration`}function Um(P){let V=il(P);return V.alreadyInstalled?`Uninstalled OpenCode plugin from ${V.path}`:`OpenCode plugin not installed in ${V.path}`}var Cc={"antigravity-cli":{install:Wl,uninstall:Kl},cursor:{install:ga,uninstall:ya},"grok-build":{install:Ra,uninstall:Pa},"kimi-code":{install:pc,uninstall:fc}};function Gm(P,V,z,Q=!1){if(P==="install"&&!Q)Fr(z);let te=Cc[V][P](z),ne=bt(V),ce=P!=="install"?"Uninstalled":Q?"Updated":"Installed";return P==="install"&&te.alreadyInstalled?Q?`${ne} hook up to date in ${te.path}`:`${ne} hook already installed in ${te.path}`:P==="uninstall"&&!te.alreadyInstalled?`${ne} hook not installed in ${te.path}`:`${ce} ${ne} hook ${P==="install"?"in":"from"} ${te.path}`}var Sc={amp:{install:Gl,uninstall:Bl,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:_a,uninstall:Ta,afterInstall:async(P)=>{let V=To(P);return await _t(["hermes","plugins","enable",Tt,"--no-allow-tool-override"]),!V},beforeUninstall:async(P)=>{_o(P);try{await _t(["hermes","plugins","disable",Tt])}catch(V){console.warn(`${V instanceof Error?V.message:String(V)}
Removing the plugin files anyway; ${Tt} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function Bm(P,V,z,Q=!1){let te=Sc[V];if(P==="uninstall")await te.beforeUninstall?.(z);let ne=P==="install"?await te.install(z):await te.uninstall(z),ce=P==="install"&&await te.afterInstall?.(z),ye=bt(V),he=!ce&&(P==="install"&&ne.alreadyInstalled||P==="uninstall"&&!ne.alreadyInstalled);return[he?P==="install"?`${ye} plugin ${Q?"up to date":"already installed"} at ${ne.path}`:`${ye} plugin not installed at ${ne.path}`:`${P!=="install"?"Uninstalled":Q?"Updated":"Installed"} ${ye} plugin ${P==="install"?"at":"from"} ${ne.path}`,he?void 0:te.restartNote].filter(Boolean).join(`
`)}var qm={"copilot-cli":{afterInstall:Om},"hermes-agent":{beforeInstall:(P,V)=>{if(!V)Fr(P)}},openclaw:{afterInstall:async()=>{await Ja();return},beforeUninstall:Mo},pi:{afterInstall:Fm}};function Vm(P){return P in Cc}function zm(P){return P in Sc}var hc=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Jm(P){if(In({environment:P,cwd:process.cwd()}).status!=="configured")return hc;return[hc,"",dt.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function vc(P,V){return V.map((z)=>P==="install"&&z.target==="kimi-code"&&z.unavailableReason==="already installed"?{...z,available:!0,unavailableReason:void 0,label:`${z.label} (global hook installed)`}:z)}function Wm(P,V){if(P.selectKimiInstallMethod)return P.selectKimiInstallMethod();if(!ni(P.input,P.output))return Promise.resolve("global-hook");return Tl({input:P.input,output:P.output,globalHookInstalled:In({environment:V,cwd:process.cwd()}).status==="configured"})}async function Rc(P,V,z,Q=!1,te){let ne=qm[V];if(P==="install")ne?.beforeInstall?.(z,Q);if(P==="uninstall")ne?.beforeUninstall?.(z);if(Vm(V))return Gm(P,V,z,Q);if(zm(V))return Bm(P,V,z,Q);if(P==="uninstall")return V==="opencode"?Um(z):Hm(V);return[await Mm(V,z,Q,te),await ne?.afterInstall?.(z)].filter(Boolean).join(`
`)}function Km(P){let V=xt({label:"update"},P).errors[0];if(V)throw Error(V)}async function Ym(P,V=mn){let z=await xc(P,V),Q=pi(Dn(P),"installed-plugins");return{targets:li([...z.hooks.filter((ne)=>ne.platform!=="copilot-cli"&&ne.detected).map((ne)=>ne.platform),...[mr,ea,Qs].flatMap((ne)=>mi(pi(Q,...ne))?["copilot-cli"]:[]),...pr(P,fi)?["claude-code"]:[],...gi(z.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:z.codexPluginListOutput}}async function Zm(P){let V=c(),z=P.output??process.stdout,Q=(P.scriptPath??process.argv[1]??"").split(/[\\/]/),te=Q.find((et)=>/^bunx-\d+-/.test(et)),ne=te!==void 0||Q.includes("_npx")?null:(P.checkLatestVersion??Wt)(),ce=async()=>{let et=ne&&await ne;if(et?.updateAvailable)z.write(`
Update available: cc-safety-net ${et.currentVersion} → ${et.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},ye=Ym(V,P.fetchVersion??mn).then(async(et)=>{let xe=new Set(et.targets);return{targets:et.targets,codexPluginListOutput:et.codexPluginListOutput,available:new Map(await Promise.all(Mt.filter((at)=>xe.has(at.target)&&mc.has(at.target)).map(async(at)=>[at.target,await ci(at.probeCommand)])))}}),he=await Pn(P.showBanner??!0,()=>({ready:ye,finish:()=>ye}),()=>Rn({input:P.input??process.stdin,output:z}),{loadingMessage:"Checking installed integrations…",output:z}),be=await Promise.resolve().then(()=>(Yl(V.tmpdir,process.platform,te),null)).catch((et)=>Gn(et));if(he.targets.length===0){if(z.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),be!==null)console.error(be);return await ce(),be===null?0:1}let Le=he.targets.some((et)=>gc.has(et))?await Promise.resolve().then(()=>(Fr(V),null)).catch((et)=>Gn(et)):null,Ie=await cr(Promise.all(he.targets.map((et)=>{if(mc.has(et)&&!he.available.get(et))return Promise.resolve({message:`${bt(et)} not found; skipped`,failed:!1});if(Le!==null&&gc.has(et))return Promise.resolve({message:Le,failed:!0});return Rc("install",et,V,!0,he.codexPluginListOutput).then((xe)=>({message:xe,failed:!1}),(xe)=>({message:Gn(xe),failed:!0}))})),{loadingMessage:`Updating ${he.targets.length} integration${he.targets.length===1?"":"s"}…`,output:z}),Xe=be===null?Ie:[...Ie,{message:be,failed:!0}];return Xe.forEach((et)=>{et.failed?console.error(et.message):z.write(`${et.message}
`)}),await ce(),Xe.some((et)=>et.failed)?1:0}function yi(P,V={}){return Promise.resolve().then(()=>Km(P)).then(()=>Zm(V)).catch((z)=>(console.error(Gn(z)),1))}async function Bn(P,V,z={}){try{let Q=c(),te=await Pn(!0,()=>Nm(Q,P,V,z),()=>Rn({input:z.input??process.stdin,output:z.output??process.stdout}),{loadingMessage:P==="install"?"Checking available integrations…":"Checking installed integrations…",output:z.output??process.stdout});if(!te)return(z.output??process.stdout).write(`Cancelled: nothing was ${P}ed.
`),0;if(te==="update")return(z.runUpdate??(()=>yi([],{fetchVersion:z.fetchVersion,input:z.input,output:z.output,showBanner:!1})))();let ne=z.output??process.stdout;return await Zl(te,async(ce)=>{if(ce==="kimi-code"&&P==="install"){let he=await Wm(z,Q);if(he===null){ne.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(he==="plugin"){ne.write(`${Jm(Q)}
`);return}}let ye=await cr(Rc(P,ce,Q),{loadingMessage:`${P==="install"?"Installing":"Uninstalling"} ${bt(ce)} integration…`,output:ne});ne.write(`${ye}
`)}),0}catch(Q){return console.error(Gn(Q)),1}}function Gn(P){let V=P instanceof Error?P.message:String(P),z=typeof P==="object"&&P!==null&&"code"in P?P.code:null;if(z==="EACCES"||z==="EPERM")return`${V}
Check file permissions for the target config file and parent directory.`;if(z==="ENOENT")return`${V}
Check that the target config path and parent directory exist.`;if(z==="ENOTDIR")return`${V}
Check that every parent path component is a directory.`;return V}import{mkdirSync as rg}from"node:fs";import{dirname as og}from"node:path";import{createInterface as ig}from"node:readline";import{existsSync as Ec,readFileSync as Xm}from"node:fs";function cn(P,V){let z=Ye(P,V);return{policy:z.policy,errors:ie(qe(z.issues,Je,(Q)=>Q.kind==="custom")," "," ")}}function qn(P,V){return cn(P,V).errors}function Pc(P,V){return{"safety.level":P.safety.level,...hi("safety.overrides",P.safety.overrides),"workflow.worktree_mode":String(P.workflow.worktree_mode),"destructive_command_protection.enabled":String(P.destructive_command_protection.enabled),...hi("destructive_command_protection.overrides",P.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":vi(P.destructive_command_protection.allow_paths),"secret_protection.enabled":String(P.secret_protection.enabled),...hi("secret_protection.overrides",P.secret_protection.overrides),"secret_protection.deny_paths":vi(P.secret_protection.deny_paths),"secret_protection.allow_paths":vi(P.secret_protection.allow_paths),...V?{"audit.retention_days":String(P.audit.retention_days)}:{}}}function jr(P,V,z){let Q=Pc(P,z),te=Pc(V,z);return[...new Set([...Object.keys(Q),...Object.keys(te)])].flatMap((ne)=>Q[ne]===te[ne]?[]:[{field:ne,before:Q[ne],after:te[ne]}])}function Vn(P,V){let z=u(P,V);if(!Ec(z))return{baseline:C(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,P.home),diagnostics:[]};let Q=dn(z),te=cn(Q.value,P.home);return{baseline:te.policy,diagnostics:Q.errors.length>0?Q.errors:te.errors}}function dn(P){if(!Ec(P))return{errors:[`${P}: file not found`]};try{return{value:JSON.parse(Xm(P,"utf-8")),errors:[]}}catch(V){let z=V instanceof Error?V.message:String(V);return{errors:[`${P}: ${V instanceof SyntaxError?`Invalid JSON: ${z}`:z}`]}}}function Nr(P,V){let z=Qm(P)?P:{};return{version:V.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((Q)=>z[Q]!==void 0).map((Q)=>[Q,z[Q]]))}}function hi(P,V){return Object.fromEntries(Object.entries(V).flatMap(([z,Q])=>Q===void 0?[]:[[`${P}.${z}`,String(Q)]]))}function vi(P){return P.length===0?"(none)":P.join(", ")}function Qm(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}import{chmodSync as eg,existsSync as Dc,mkdirSync as tg,readFileSync as Ac}from"node:fs";import{dirname as ng}from"node:path";function _c(P,V={}){let z=u(P,V);if(!Dc(z))return{path:z,exists:!1,raw:"",policy:H(),errors:[]};let Q=Ac(z,"utf-8");if(!Q.trim())return{path:z,exists:!0,raw:Q,policy:H(),errors:["Config file is empty"]};try{let te=cn(JSON.parse(Q),P.home);return{path:z,exists:!0,raw:Q,policy:te.policy,errors:te.errors}}catch(te){return{path:z,exists:!0,raw:Q,policy:H(),errors:[`Invalid JSON: ${te instanceof Error?te.message:String(te)}`]}}}function Vt(P,V,z={}){let Q=u(P,z),te=cn(V,P.home);if(te.errors.length>0)return{path:Q,policy:H(),errors:te.errors};let ne=te.policy;return tg(ng(Q),{recursive:!0,mode:448}),g(re(Q),`${JSON.stringify(ne,null,2)}
`,384),eg(Q,384),{path:Q,policy:ne,errors:[]}}function Tc(P,V){let z=cn(V,P.home);if(z.errors.length>0)return{errors:z.errors};return{preview:Ae(z.policy,P.env),errors:[]}}function $c(P,V={}){let z=u(P,V);if(!Dc(z))return Vt(P,Z,V);let Q=Ac(z,"utf-8");if(!Q.trim())return Vt(P,Z,V);try{return Vt(P,C(JSON.parse(Q),P.home),V)}catch{return Vt(P,Z,V)}}var Ic=new Set(["check","apply"]),Oc="(unset)";async function jc(P,V,z={}){let Q=xt({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},V),te=Q.positionals[0],ne=[...Q.errors,...te&&!Ic.has(te)?[`Unknown policy subcommand: ${te}`]:[],...te&&Ic.has(te)&&!Q.positionals[1]?[`policy ${te} requires a file`]:[],...Q.positionals.slice(2).map((xe)=>`Unexpected policy argument: ${xe}`)];if(ne.length>0){for(let xe of ne)console.error(xe);return 1}let ce=Q.positionals[1];if(!te||!ce)return wn(Xn,console.error),1;let ye=Q.flags.global?u(P):b(z.cwd??process.cwd()),he=dn(ce),be=[...he.errors,...qn(he.value,P.home).map((xe)=>`${ce}: ${xe}`),...!Q.flags.global&&lg(he.value)&&he.value.audit!==void 0?[`${ce}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(be.length>0){for(let xe of be)console.error(xe);return 1}let Le=C(he.value,P.home);if(console.log(`Scope: ${Q.flags.global?"user":"project"} (${ye})`),console.log(`Proposal: ${ce}`),Q.flags.global)Fc(C(dn(ye).value,P.home),Le,!0);if(!Q.flags.global){let xe=Vn(P).baseline;console.log("Effective policy (user + project merged):"),Fc(Y(xe,ae(dn(ye).value,P.home).policy).policy,Y(xe,ae(he.value,P.home).policy).policy,!1)}if(te==="check")return 0;let Ie=z.input??process.stdin,Xe=z.output??process.stdout;if(!Ie.isTTY||!Xe.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${ce}${Q.flags.global?" --global":""}`),1;if(!await sg(`Apply this policy to ${ye}? [y/N] `,Ie,Xe))return console.log("Cancelled; nothing was written."),0;return ag(P,ye,he.value,Le,Q.flags.global),console.log(`Policy applied: ${ye}`),0}function sg(P,V,z){let Q=ig({input:V,output:z,terminal:!1});return new Promise((te)=>{Q.once("close",()=>te(!1)),Q.question(P,(ne)=>{te(/^y(es)?$/i.test(ne.trim())),Q.close()})})}function ag(P,V,z,Q,te){if(te){Vt(P,Q);return}rg(og(V),{recursive:!0}),Rt(V,Nr(z,Q))}function Fc(P,V,z){let Q=jr(P,V,z);if(Q.length===0){console.log("No changes.");return}console.log(`Changes (${Q.length}):`);for(let te of Q)console.log(`  ${te.field}: ${te.before??Oc} -> ${te.after??Oc}`)}function lg(P){return!!P&&typeof P==="object"&&!Array.isArray(P)}import{join as wy}from"node:path";var Nc="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- Transparent wrappers have no built-in defaults. Configure only wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function Mr(P,V){if(!P.ok){Bc(P);return}Uc(P,V)}function Hc(P,V,z){if(P.ok)console.log(z);if(!P.add){Mr(P,`Added rulebook source: ${V}`);return}if(!P.ok){Bc(P);return}if(P.add.added.length>0)console.log(`Added ${P.add.added.length} ${P.add.added.length===1?"rulebook":"rulebooks"} from ${P.add.source} at ${P.add.ref}:`),P.add.added.forEach((Q)=>{console.log(`  - ${Q}`)});if(P.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${P.add.source} at ${P.add.ref}: ${P.add.alreadyConfigured.join(", ")}`);if(P.add.commits.length>0)console.log(`Vendored at ${P.add.commits.map((Q)=>Q.slice(0,7)).join(", ")}.`);Uc(P,"Rule config updated.")}function Uc(P,V){for(let z of P.changes??[])console.log(z);console.log(V),console.log(""),cg(P.entries)}function cg(P){if(P.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${P.length}):`);for(let V of P)console.log(`  - ${V.name} ${V.version} (${dg(V.ruleCount)})`),console.log(`    Source: ${V.spec}`)}function dg(P){return`${P} ${P===1?"rule":"rules"}`}function Gc(P){un("Active sources",P.rulebooks,(V)=>[`[${V.source}] ${V.name} ${V.version}`,`  Source: ${V.spec}`]),un("Active rules",P.rules,(V)=>[`[${pg(P,V.name)}] ${V.name}`,...ug(V),`  Reason: ${V.reason}`]),un("Disabled rules",Mc(P,"off"),(V)=>[V.key]),un("Reason overrides",Mc(P,"reason"),(V)=>[V.key,`  Reason: ${V.value.reason}`]),un("Transparent wrappers",P.transparent_wrappers,(V)=>[V]),un("Issues",P.errors,(V)=>[V]),un("Warnings",P.warnings,(V)=>[V])}function un(P,V,z){if(V.length===0){console.log(`${P}: (none)`);return}console.log(`${P} (${V.length}):`);for(let Q of V){let[te,...ne]=z(Q);console.log(`  - ${te}`);for(let ce of ne)console.log(`    ${ce}`)}}function ug(P){if(!P.match)return[`  Command: ${P.subcommand?`${P.command} ${P.subcommand}`:P.command}`,`  Block args: ${P.block_args.join(", ")}`];return[`  Command: ${[P.command,...P.match.command_path].join(" ")}`,...P.match.any_args?[`  Any args: ${P.match.any_args.join(", ")}`]:[],...P.match.exclude_args?[`  Exclude args: ${P.match.exclude_args.join(", ")}`]:[]]}function pg(P,V){return P.rulebooks.find((z)=>z.rules.includes(V))?.source??"project"}function Mc(P,V){return Object.entries({...P.userConfig?.overrides??{},...P.projectConfig?.overrides??{}}).filter((z)=>{if(V==="off")return z[1]==="off";return!!z[1]&&typeof z[1]==="object"}).map(([z,Q])=>({key:z,value:Q}))}function Bc(P){for(let V of P.errors)console.error(V)}import{dirname as pd,join as Jr}from"node:path";import{join as xi,resolve as Cg}from"node:path";function bi(P){let V=m(P);if(V.errors.length>0)return{ok:!1,result:{ok:!1,errors:V.errors,entries:[]}};return{ok:!0,config:V.config??it}}function qc(P){Rt(P,{version:1,rules:[],overrides:{},transparent_wrappers:[]})}function Vc(P){Rt(P,{rulebook_version:1,name:"example-rules",version:"1.0.0",description:"Project-specific CC Safety Net rules.",author:"project",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as Br}from"node:path";var fg="custom.";function Hr(P){if(P.rulebook_version!==2)return[];let V=P.rules.map((z)=>({name:z.name,command:z.command,block_args:[],match:z.match,reason:z.reason,intent:z.intent}));return(P.tests??[]).flatMap((z,Q)=>{let te=Li(h(z.command));if(te.length===0)return[`tests[${Q}]: could not parse fixture command: ${z.command}`];let ne=te.reduce((ce,ye)=>ce??_(ye,V)?.id.slice(fg.length),void 0);if(z.expect==="blocked"){if(ne===z.rule)return[];let ce=ne?`"${ne}" matched first`:"no rule matched";return[`tests[${Q}]: expected "${z.rule}" to block "${z.command}" but ${ce}`]}return ne?[`tests[${Q}]: expected "${z.command}" to be allowed but "${ne}" matched`]:[]})}function Li(P){return P.nodes.flatMap((V)=>{if(V.kind==="group"||V.kind==="function")return Li(V.body);if(V.kind!=="command")return[];let z=ge(X(V.dialect,V.words)).words.map(t);return[...z.length>0?[z]:[],...V.nested.flatMap((Q)=>Li(Q))]})}var Ur=Object.freeze({concurrency:4,maxRequests:131,maxResponseBytes:67108864});function Gr(P={}){return{requests:0,responseBytes:0,maxRequests:P.maxRequests??Ur.maxRequests,maxResponseBytes:P.maxResponseBytes??Ur.maxResponseBytes}}function zt(P){return{controller:new AbortController,budget:Gr(),resolveUrl:P}}function zc(P){return P instanceof Error&&P.message==="Rule synchronization exceeds CC Safety Net's safe resource limits."}function Jc(P){if(P.requests>=P.maxRequests)throw Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");P.requests++}function Wc(P,V){if(V>P.maxResponseBytes-P.responseBytes)throw P.responseBytes+=V,Error("Rule synchronization exceeds CC Safety Net's safe resource limits.");P.responseBytes+=V}var Zc=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function Kc(P,V,z=v(Br(Br(V)),"rules policy"),Q=zt()){if(S(P))return hg(P,Q);return yg(P,V,z)}async function Xc(P,V,z,Q,te,ne){if(!S(P))return Kc(P,V,z,Q);let ce=te?null:mg(P,V,z);if(ce)return ce;if(!te&&!ne)throw Error(`${P} is not vendored; run rule update ${P} to vendor it`);return Kc(P,V,z,Q)}function mg(P,V,z=v(Br(Br(V)),"rules policy")){let Q=A(P),te=I(V,Q.name),ne=n(i(z,te));if(ne===null)return null;let ce=se(wi(ne,`Invalid rulebook ${te}.`));if(ce.name!==Q.name)throw Error(`rulebook name "${ce.name}" in ${te} must match "${Q.name}"`);return{spec:P,rulebook:ce,content:ne}}async function Qc(P,V={}){if(!q(P))throw Error(`Invalid GitHub repository source: ${P}`);let[z,Q]=P.split("/");if(!z||!Q)throw Error(`Invalid GitHub repository source: ${P}`);if(V.ref!==void 0&&!oe(V.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${V.ref}`);let te=V.operation??zt(),ne=V.ref??await gg(z,Q,P,te),ce=await td(z,Q,ne,P,te),ye=await qr(`https://api.github.com/repos/${z}/${Q}/git/trees/${ce}?recursive=1`,"tree",te),he=ye.response;if(!he.ok)throw Error(`Failed to inspect ${P}: GitHub tree returned ${he.status}`);let be=JSON.parse(ye.content);if(!Array.isArray(be?.tree))throw Error(`Failed to inspect ${P}: unexpected GitHub tree response`);let Le=be.tree,Ie=[...new Set(Le.flatMap((Xe)=>{if(!Xe||typeof Xe!=="object")return[];let et=Xe;if(et.type!=="blob"||typeof et.path!=="string")return[];let xe=et.path.match(rt);return xe?.[1]?[xe[1]]:[]}))].sort();if(Ie.length===0)throw Error(`No rulebooks found in ${P} under ${de}/`);return{source:P,owner:z,repo:Q,ref:ne,commit:ce,names:Ie}}async function gg(P,V,z,Q){let te=await qr(`https://api.github.com/repos/${P}/${V}`,"metadata",Q),ne=te.response;if(!ne.ok)throw Error(`Failed to inspect ${z}: GitHub returned ${ne.status}`);let ye=JSON.parse(te.content)?.default_branch;if(typeof ye!=="string"||ye==="")throw Error(`Failed to inspect ${z}: missing default branch`);if(!oe(ye))throw Error(`GitHub returned an invalid default branch: ${ye}`);return ye}function yg(P,V,z){ot(P);let Q=I(V,P),te=n(i(z,Q));if(te===null)throw Error(`Rulebook source not found: ${P}`);let ne=ed(wi(te,"Invalid local rulebook source."));if(ne.name!==P)throw Error(`rulebook name "${ne.name}" must match local source "${P}"`);return{spec:P,rulebook:ne,content:te}}async function hg(P,V){let z=A(P),Q=await td(z.owner,z.repo,z.ref,P,V),te=await qr(`https://raw.githubusercontent.com/${z.owner}/${z.repo}/${Q}/${z.path}`,"raw",V),ne=te.response;if(!ne.ok)throw Error(`Failed to fetch ${P}: GitHub raw returned ${ne.status}`);let ce=te.content,ye=ed(wi(ce,"Invalid GitHub rulebook response."));if(ye.name!==z.name)throw Error(`rulebook name "${ye.name}" must match GitHub source "${z.name}"`);return{spec:P,rulebook:ye,content:ce}}function ed(P){let V=se(P),z=Hr(V);if(z.length>0)throw Error(z.join("; "));return V}function wi(P,V){try{return JSON.parse(P)}catch{throw Error(V)}}async function td(P,V,z,Q,te){let ne=await qr(`https://api.github.com/repos/${P}/${V}/commits/${encodeURIComponent(z)}`,"commit",te),ce=ne.response;if(!ce.ok)throw Error(`Failed to resolve ${Q}: GitHub returned ${ce.status}`);let ye=JSON.parse(ne.content);if(typeof ye?.sha!=="string"||ye.sha==="")throw Error(`Failed to resolve commit for ${Q}`);return ye.sha}async function vg(P,V,z={}){if(z.signal?.aborted)throw z.signal.reason;let Q=z.budget??Gr(),te=new AbortController,ne=()=>te.abort(z.signal?.reason);z.signal?.addEventListener("abort",ne,{once:!0});let ce=!1,ye=setTimeout(()=>{if(te.signal.aborted)return;ce=!0,te.abort()},z.timeoutMs??Zc.timeoutMs);try{if(z.signal?.aborted)throw z.signal.reason;Jc(Q);let he=await fetch(P,{signal:te.signal,redirect:"error"});if(!he.ok)return nd(he),{response:he,content:""};return{response:he,content:await bg(he,V,Q,()=>te.abort())}}catch(he){if(ce)throw Error("GitHub request timed out",{cause:he});if(z.signal?.aborted)throw z.signal.reason;throw he}finally{clearTimeout(ye),z.signal?.removeEventListener("abort",ne)}}function qr(P,V,z){return vg(z.resolveUrl?.(P)??P,V,{budget:z.budget,signal:z.controller.signal})}async function bg(P,V,z=Gr(),Q){let te=Zc[`${V}Bytes`],ne=Number(P.headers.get("content-length"));if(Number.isFinite(ne)&&ne>te)throw nd(P),Error(`GitHub ${V} response exceeds ${te} bytes`);if(!P.body)return"";let ce=P.body.getReader(),ye=[],he=0;while(!0){let be=await ce.read();if(be.done)break;try{Wc(z,be.value.byteLength)}catch(Le){throw Q?.(),Yc(ce),Le}if(he+=be.value.byteLength,he>te)throw Q?.(),Yc(ce),Error(`GitHub ${V} response exceeds ${te} bytes`);ye.push(Buffer.from(be.value))}return Buffer.concat(ye,he).toString("utf-8")}function nd(P){if(!P.body)return;rd(()=>P.body?.cancel())}function Yc(P){rd(()=>P.cancel())}function rd(P){try{Promise.resolve(P()).catch(()=>{})}catch{}}var Lg=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function od(P,V){let z=ad(P.rules,V);if(z.length>0)return{ok:!0,specs:z};return sd(P.rules,V)}function id(P,V){let z=ad(P,V);if(z.length>0)return{ok:!0,specs:z};let Q=kg(P,V);if(Q.length>0)return{ok:!0,specs:Q};let te=xg(P,V);if(!te.ok)return te;if(te.specs.length>0)return{ok:!0,specs:te.specs};return sd(P,V)}function sd(P,V){let z=P.filter((Q)=>ki(Q)?.name===V);if(z.length===1)return{ok:!0,specs:z};return wg(V,z)}function wg(P,V){return{ok:!1,result:{ok:!1,errors:V.length===0?[`No configured rulebook matches ${P}`]:[`Ambiguous rulebook match ${P}: ${V.join(", ")}`],entries:[]}}}function ad(P,V){return P.filter((z)=>z===V)}function kg(P,V){let z=V.match(Lg),Q=z?.[1],te=z?.[2],ne=z?.[3];if(!Q||!te||!ne||!oe(ne))return[];return ld(P,(ce)=>ce.owner===Q&&ce.repo===te&&ce.ref===ne)}function xg(P,V){if(!q(V))return{ok:!0,specs:[]};let[z,Q]=V.split("/"),te=ld(P,(ce)=>ce.owner===z&&ce.repo===Q);if(new Set(te.map((ce)=>ki(ce)?.ref).filter((ce)=>!!ce)).size<2)return{ok:!0,specs:te};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${V}. Use an explicit ref:`,`  cc-safety-net rule remove ${V}#<ref>`],entries:[]}}}function ki(P){try{return A(P)}catch{return null}}function ld(P,V){return P.filter((z)=>{let Q=ki(z);return Q?V(Q):!1})}async function zr(P,V={}){let z=Ci(V);return Sg(P,z,await Vr(P,z,zt()))}function Sg(P,V,z){if(!z.ok)return z;let Q=Pt(P,V),te=[...new Set(j(Q.configPath,Q.filesystemScope))];if(te.length===0)return z;return{ok:!1,errors:te,entries:z.entries}}async function Vr(P,V,z,Q={},te=new Set,ne=new Set){try{let ce=Pt(P,V),ye=bi(ce.configTarget);if(!ye.ok)return ye.result;let he=ye.config,be=V.only?od(he,V.only):{ok:!0,specs:he.rules};if(!be.ok)return be.result;let Le=new Set([...V.refresh?be.specs:[],...te]),Ie=(ut)=>Xc(ut,ce.configDir,ce.filesystemScope,z,Le.has(ut),!V.refresh||Le.has(ut)),Xe=await Fg(he.rules,V.refresh?(ut)=>Ie(ut).then((vt)=>({ok:!0,item:vt})).catch((vt)=>{if(zc(vt))throw vt;return{ok:!1,spec:ut,message:vt instanceof Error?vt.message:String(vt)}}):async(ut)=>({ok:!0,item:await Ie(ut)}),z),et=Xe.filter((ut)=>!ut.ok),xe=Xe.filter((ut)=>ut.ok).map((ut)=>ut.item),at=xe.flatMap((ut)=>Rg(ut,he.rules)),ct=xe.flatMap((ut)=>Pg(ut,ne,ce)),lt=new Set([...at,...ct].map((ut)=>ut.spec)),pt=[...et,...at,...ct],mt=[],gt=Dg(mt,()=>xe.flatMap((ut)=>lt.has(ut.spec)||pt.length>0&&ne.has(ut.spec)?[]:Eg(ut,ce,Q,mt)));return{ok:pt.length===0,errors:pt.map((ut)=>`Failed to update ${ut.spec}: ${ut.message}`),entries:xe.map(_g),changes:gt}}catch(ce){return Jn(ce)}}function Rg(P,V){if(!S(P.spec))return[];let z=Pe(P.spec),Q=V.filter((te)=>te!==P.spec&&Pe(te).toLowerCase()===z.toLowerCase());if(Q.length===0)return[];return[{ok:!1,spec:P.spec,message:`rulebook name "${z}" is also claimed by ${Q.join(", ")}; rename one of them`}]}function Pg(P,V,z){if(!V.has(P.spec)||!S(P.spec))return[];let Q=I(z.configDir,P.rulebook.name),te=n(i(z.filesystemScope,Q));if(te===null||te===P.content)return[];return[{ok:!1,spec:P.spec,message:`${Q} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function Eg(P,V,z,Q){if(!S(P.spec))return[];let te=I(V.configDir,P.rulebook.name),ne=i(V.filesystemScope,te),ce=n(ne);if(ce===P.content)return[];return Q?.push({target:ne,previous:ce}),g(ne,P.content,void 0,z._testAfterPolicyRename),Ag(P,ce)}function Dg(P,V){try{return V()}catch(z){for(let Q of[...P].reverse()){if(Q.previous===null){N(Q.target);continue}g(Q.target,Q.previous)}throw z}}function Ag(P,V){if(V===null)return[`Vendored ${P.spec} (${P.rulebook.version})`];let z=me(V),Q="problem"in z?null:z.rulebook,te=new Map(Q?.rules.map((ce)=>[ce.name,JSON.stringify(ce)])??[]),ne=new Set(P.rulebook.rules.map((ce)=>ce.name));return[`Updated ${P.spec} (${Q?.version??"unreadable"} -> ${P.rulebook.version})`,...[...ne].filter((ce)=>!te.has(ce)).map((ce)=>`  + ${ce}`),...[...te.keys()].filter((ce)=>!ne.has(ce)).map((ce)=>`  - ${ce}`),...P.rulebook.rules.filter((ce)=>{let ye=te.get(ce.name);return ye!==void 0&&ye!==JSON.stringify(ce)}).map((ce)=>`  ~ ${ce.name}`)]}function _g(P){return{spec:P.spec,name:P.rulebook.name,version:P.rulebook.version,ruleCount:P.rulebook.rules.length}}async function cd(P,V,z={}){return Tg(P,V,Ng(z),zt())}async function Tg(P,V,z,Q,te={}){let ne=null,ce=!1;try{let ye=Pt(P,z),he=n(ye.configTarget);ne={target:ye.configTarget,content:he};let be=bi(ye.configTarget);if(!be.ok)return be.result;let Le=be.config,Ie=q(V);$g(V,z,Ie);let Xe=Ie?await Qc(V,{ref:z.ref,operation:Q}):null,et=Xe?Ig(Xe,z.rulebooks):[],xe=Xe?et.map((mt)=>Og(Le.rules,Xe,mt)??`${V}#${Xe.ref}/${mt}`):[V],at=xe.filter((mt)=>!Le.rules.includes(mt)),ct=[...Le.rules,...at];if(ct.length>pe)return jg();if(ct.length!==Le.rules.length)ce=!0,Rt(ye.configTarget,{version:1,rules:ct,overrides:Le.overrides??{},transparent_wrappers:Le.transparent_wrappers??[]},void 0,te._testAfterPolicyRename);let lt=await Vr(P,z,Q,te,new Set(at),new Set(at));if(!lt.ok)zn(ye.configTarget,he);if(!lt.ok||!Xe)return lt;let pt=et.filter((mt,gt)=>at.includes(xe[gt]??""));return{...lt,add:{source:V,ref:Xe.ref,selected:et,added:pt,alreadyConfigured:et.filter((mt)=>!pt.includes(mt)),commits:at.length>0?[Xe.commit]:[]}}}catch(ye){if(ce&&ne)try{zn(ne.target,ne.content)}catch(he){return Jn(he)}return Jn(ye)}}function $g(P,V,z){if(!z&&V.rulebooks!==void 0)throw Error("--only can only select rulebooks from an owner/repo source");if(!z&&V.ref)throw Error(`--ref can only select a ref for an owner/repo source: ${P}`);if(V.rulebooks?.length===0)throw Error("--only requires at least one rulebook name");let Q=V.rulebooks?.filter((te)=>!l.test(te))??[];if(Q.length>0)throw Error(`Invalid rulebook names: ${Q.join(", ")}`)}function Ig(P,V){let z=V?[...new Set(V)]:P.names,Q=z.filter((te)=>!P.names.includes(te));if(Q.length>0)throw Error(`Rulebooks not found in ${P.source} at ${P.ref}: ${Q.join(", ")}
Available rulebooks: ${P.names.join(", ")}`);return z}function Og(P,V,z){let Q=`${V.source}#${V.ref}/${z}`;if(P.includes(Q))return Q;let te=`${V.source}#${V.commit}/${z}`;return P.find((ne)=>ne===te)}async function Fg(P,V,z=zt()){if(P.length>pe)throw Error(fe);let Q=Array(P.length),te=0,ne,ce=Array.from({length:Math.min(P.length,Ur.concurrency)},async()=>{while(!ne){let ye=te;if(ye>=P.length)return;te++;try{Q[ye]=await V(P[ye],ye,z.controller.signal)}catch(he){if(!ne)ne={value:he},te=P.length,z.controller.abort(he);return}}});if(await Promise.all(ce),ne)throw ne.value;return Q}function jg(){return{ok:!1,errors:[fe],entries:[]}}function Ci(P){return{cwd:P.cwd,userConfigDir:P.userConfigDir,userConfigPath:P.userConfigPath,projectConfigPath:P.projectConfigPath,global:P.global,only:P.only,refresh:P.refresh}}function Ng(P){return{...Ci(P),ref:P.ref,rulebooks:P.rulebooks}}function Mg(P){return{...Ci(P),deleteSource:P.deleteSource}}async function dd(P,V,z={}){try{return await Hg(P,V,Mg(z),{})}catch(Q){return Jn(Q)}}async function Hg(P,V,z,Q){let te=Pt(P,z),ne=m(te.configTarget);if(ne.errors.length>0)return{ok:!1,errors:ne.errors,entries:[]};if(!ne.config)return{ok:!1,errors:[`No config found at ${te.configPath}`],entries:[]};let ce=id(ne.config.rules,V);if(!ce.ok)return ce.result;let ye=z.deleteSource?Ug(te.configDir,ce.specs,te.filesystemScope):{ok:!0,dirs:[]};if(!ye.ok)return ye.result;let he=n(te.configTarget);if(he===null)return Jn(Error("Rules config is unavailable."));try{Rt(te.configTarget,{version:1,rules:ne.config.rules.filter((Ie)=>!ce.specs.includes(Ie)),overrides:ne.config.overrides??{},transparent_wrappers:ne.config.transparent_wrappers??[]},void 0,Q._testAfterPolicyRename)}catch(Ie){throw zn(te.configTarget,he),Ie}let be=await Vr(P,z,zt(),Q);if(!be.ok)return zn(te.configTarget,he),be;let Le=Gg(ye.dirs,Q,te.filesystemScope);if(!Le.ok){zn(te.configTarget,he);let Ie=await Vr(P,z,zt(),Q);if(!Ie.ok)return{ok:!1,errors:[...Le.result.errors,...Ie.errors],entries:Ie.entries};return Le.result}return be}function Ug(P,V,z){let Q=V.flatMap((ye)=>l.test(ye)?[]:["--delete-source can only delete local rulebook sources"]),te=V.map((ye)=>xi(P,ye)),ne=Q.length>0?[]:te.flatMap((ye)=>ud(ye,z)),ce=[...Q,...ne];return ce.length>0?{ok:!1,result:{ok:!1,errors:ce,entries:[]}}:{ok:!0,dirs:te}}function ud(P,V){let z=Cg(P),Q=i(V,z),te=le(Q);if(!te)return[`Local rulebook source directory not found: ${P}`];let ne=te.find((ce)=>ce.name==="rulebook.json");if(!ne)return[`Local rulebook source directory is missing rulebook.json: ${P}`];if(ne.kind!=="file")throw new r(V.label);if(n(i(V,xi(z,"rulebook.json"))),te.length>1)return[`Local rulebook source directory contains extra files: ${P}. delete manually if you really want to remove the directory.`];return[]}function Gg(P,V,z){let Q=P.flatMap((te)=>{try{if(!le(i(z,te)))return[];let ne=ud(te,z);if(ne.length>0)return ne;return Bg(te,V,z),[]}catch(ne){return[`Failed to delete local rulebook source ${te}: ${ne instanceof Error?ne.message:String(ne)}`]}});return Q.length>0?{ok:!1,result:{ok:!1,errors:Q,entries:[]}}:{ok:!0}}function Bg(P,V,z){if(V._testDeleteLocalSourceDir){V._testDeleteLocalSourceDir(P);return}N(i(z,xi(P,ue))),nt(i(z,P))}function zn(P,V){if(V===null){N(P);return}g(P,V)}function Jn(P){return{ok:!1,errors:[P instanceof Error?P.message:String(P)],entries:[]}}var qg=".safety-net.json",Vg="~/.cc-safety-net/config.json";async function gd(P,V){return[await fd(P,{legacyPath:$s({cwd:V.cwd}),configPath:F(V.cwd),defaultRulebookName:"project-rules",migratedFrom:qg,cleanup:V.cleanup,syncOptions:{cwd:V.cwd}}),await fd(P,{legacyPath:nr(P),configPath:M(P),defaultRulebookName:"user-rules",migratedFrom:Vg,cleanup:V.cleanup,syncOptions:{cwd:V.cwd,global:!0}})].every((Q)=>Q)?0:1}async function fd(P,V){let z=Pt(P,V.syncOptions),Q=i(z.filesystemScope,V.legacyPath),te=n(Q);if(te===null)return console.log(`No legacy config found at ${V.legacyPath}`),!0;let ne=Jg(te);if(!ne.ok){for(let et of ne.errors)console.error(et);return!1}let ce=m(z.configTarget);if(ce.errors.length>0){for(let et of ce.errors)console.error(et);return!1}let ye=ce.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},he=Wg(pd(V.configPath),ye.rules,V.defaultRulebookName,V.migratedFrom,z.filesystemScope),be=Jr(pd(V.configPath),he,"rulebook.json"),Le=i(z.filesystemScope,be),Ie=[md(z.configTarget),md(Le)],Xe=await zg(P,V,z.configTarget,Le,he,ne.config.rules,ye.rules.includes(he)?ye.rules:[...ye.rules,he],ye.overrides??{},ye.transparent_wrappers??[]);if(!Xe.ok){Zg(Ie);for(let et of Xe.errors)console.error(et);return!1}if(!V.cleanup)return console.log(`Migrated legacy config at ${V.legacyPath}. Legacy file is no longer used.`),!0;if(!Yg(z.configTarget,Le,he,V.migratedFrom,ne.config.rules))return console.error(`Migration cleanup verification failed for ${V.legacyPath}`),!1;return N(Q),console.log(`Deleted legacy config at ${V.legacyPath}`),!0}async function zg(P,V,z,Q,te,ne,ce,ye,he){try{return Rt(z,{version:1,rules:ce,overrides:ye,transparent_wrappers:he}),Rt(Q,Kg(te,V.migratedFrom,ne)),await zr(P,V.syncOptions)}catch(be){return{ok:!1,errors:[be instanceof Error?be.message:String(be)]}}}function Jg(P){try{let V=JSON.parse(P),z=ro(V);if(z.errors.length>0)return{ok:!1,errors:z.errors};return{ok:!0,config:{version:1,rules:V.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function Wg(P,V,z,Q,te){let ne=V.find((ce)=>Xg(i(te,Jr(P,ce,"rulebook.json")))===Q);if(ne)return ne;if(n(i(te,Jr(P,z,"rulebook.json")))===null)return z;for(let ce=2;;ce++){let ye=`${z}-${ce}`;if(n(i(te,Jr(P,ye,"rulebook.json")))===null)return ye}}function Kg(P,V,z){return{rulebook_version:1,name:P,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:V,allowed_commands:[...new Set(z.map((Q)=>Q.command))],rules:z,tests:z.map((Q)=>({command:[Q.command,Q.subcommand,Q.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:Q.name}))}}function Yg(P,V,z,Q,te){if(!m(P).config?.rules.includes(z))return!1;try{let ce=n(V);if(ce===null)return!1;let ye=JSON.parse(ce);return ye.migrated_from===Q&&JSON.stringify(ye.rules)===JSON.stringify(te)}catch{return!1}}function md(P){return{target:P,content:n(P)}}function Zg(P){for(let V of P){if(V.content===null){N(V.target);continue}g(V.target,V.content)}}function Xg(P){let V=n(P);if(V===null)return null;try{let z=JSON.parse(V);return typeof z.migrated_from==="string"?z.migrated_from:null}catch{return null}}import{mkdir as Qg,readFile as ey,writeFile as ty}from"node:fs/promises";import{dirname as ny,join as ry}from"node:path";var oy=86400000,iy=604800000;async function hd(P,V=Date.now()){if(P.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let z=je(P);if(!z)return null;let Q=ry(z,".cc-safety-net","update-check.json"),te=await sy(Q,V);if(!te.lastCheck||V-te.lastCheck>oy){let ye=await Wt();if(te.lastCheck=V,ye.latestVersion)te.latestVersion=ye.latestVersion;if(!await yd(Q,te))return null;if(ye.error)return null}let ne=te.latestVersion,ce=wt();if(!ne||!co(ne,ce))return null;if(te.notifiedVersion===ne&&te.notifiedAt!==void 0&&V-te.notifiedAt<iy)return null;if(te.notifiedVersion=ne,te.notifiedAt=V,!await yd(Q,te))return null;return`UPDATE_AVAILABLE: cc-safety-net v${ne} is available (running v${ce}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function sy(P,V){let z=await ey(P,"utf8").then((ne)=>JSON.parse(ne)).catch(()=>{return});if(!z||typeof z!=="object"||Array.isArray(z))return{};let Q=z,te=(ne)=>typeof ne==="number"&&Number.isFinite(ne)&&ne<=V?ne:void 0;return{lastCheck:te(Q.lastCheck),latestVersion:typeof Q.latestVersion==="string"?Q.latestVersion:void 0,notifiedVersion:typeof Q.notifiedVersion==="string"?Q.notifiedVersion:void 0,notifiedAt:te(Q.notifiedAt)}}async function yd(P,V){return Qg(ny(P),{recursive:!0,mode:448}).then(()=>ty(P,JSON.stringify(V),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as ay,resolve as Si}from"node:path";var vd="CC Safety Net Config",ly="═".repeat(vd.length),cy="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",dy=new Set(["rule.json","rule.lock","cache"]);function bd(P,V={}){try{return uy(P,V)}catch(z){if(z instanceof r)return console.error(z.message),1;throw z}}function uy(P,V){let z=V.cwd??process.cwd(),Q=K(P,{cwd:z}),te=nr(P),ne=ns(z),ce=Si(z,de),ye=i(Q.userScope,te),he=i(Q.projectScope,ne),be=!1,Le=!1,Ie=[],Xe=[],et=py(i(Q.projectScope,ce));if(my(),n(Q.userConfigTarget)!==null){let xe=Jt(Q.userConfigTarget);if(xe.errors.push(...j(Q.userConfigPath,Q.userScope)),Ie.push({scope:"User",path:Q.userConfigPath,result:xe,schema:"rules",target:Q.userConfigTarget}),xe.errors.length>0)be=!0}if(n(ye)!==null)if(Le=!0,n(Q.userConfigTarget)!==null)Xe.push(Wr("user","cleanup"));else{let xe=oo(ye);if(Ie.push({scope:"User",path:te,result:xe,schema:"legacy",inactive:!0,target:ye}),Xe.push(Wr("user",xe.errors.length>0?"fix-or-delete":"migrate")),xe.errors.length>0)be=!0}if(n(Q.projectConfigTarget)!==null){let xe=Jt(Q.projectConfigTarget);if(xe.errors.push(...j(Q.projectConfigPath,Q.projectScope)),Ie.push({scope:"Project",path:Si(Q.projectConfigPath),result:xe,schema:"rules",target:Q.projectConfigTarget}),xe.errors.length>0)be=!0;if(n(he)!==null)Le=!0,Xe.push(Wr("project","cleanup"))}else if(n(he)!==null){Le=!0,be=!0;let xe=oo(he);Ie.push({scope:"Project",path:Si(ne),result:xe,schema:"legacy",inactive:!0,target:he}),Xe.push(Wr("project",xe.errors.length>0?"fix-or-delete":"migrate"))}if(et?.result.errors.length)be=!0;if(Ie.length===0&&!et)return console.log(`
No config files found. Using built-in rules only.`),0;for(let xe of Ie)if(xe.inactive)yy(xe.scope,xe.path,xe.result);else if(xe.result.errors.length>0)hy(xe.scope,xe.path,xe.result.errors);else{if(xe.schema==="rules"&&Ly(xe.target))console.log(`
Added $schema to ${xe.scope.toLowerCase()} config.`);gy(xe.scope,xe.path,xe.result,xe.schema)}for(let xe of Xe)console.error(`
${dt.red(xe)}`);if(et)if(et.result.errors.length>0)by(et.path,et.result.errors);else vy(et.path,et.result);if(be)return console.error(`
Config validation failed.`),1;return console.log(Le?`
Configs valid with warnings.`:`
All configs valid.`),0}function Wr(P,V){let z=`legacy ${P} config`;if(V==="cleanup")return`Warning: Legacy ${P} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(V==="migrate")return`Warning: Legacy ${P} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${P} config is no longer supported. Fix or delete the ${z}, then run \`npx -y cc-safety-net rule migrate\`.`}function py(P){if(le(P)===null)return null;let V=fy(P);if(V.ruleNames.size===0&&V.errors.length===0)return null;return{path:P.path,result:V}}function fy(P){let V=[],z=new Set,Q=(le(P)??[]).filter((te)=>!dy.has(te.name)).sort((te,ne)=>te.name.localeCompare(ne.name));if(Q.length===0)return{errors:V,ruleNames:z};for(let te of Q){if(!l.test(te.name)){V.push(`rulebook directory names must match ${l}: ${te.name}`);continue}if(te.kind!=="directory"){V.push(`${te.name} must be a rulebook directory`);continue}let ne=i(P.scope,ay(P.path,te.name,"rulebook.json")),ce=n(ne);if(ce===null){V.push(`${te.name}/rulebook.json is required`);continue}try{let ye;try{ye=JSON.parse(ce)}catch{V.push(`${te.name}/rulebook.json: invalid JSON`);continue}let he=se(ye);if(he.name!==te.name){V.push(`rulebook name "${he.name}" must match folder "${te.name}"`);continue}let be=Hr(he);if(be.length>0){V.push(...be.map((Le)=>`${te.name}/rulebook.json: ${Le}`));continue}z.add(te.name)}catch(ye){V.push(ye instanceof Error?`${te.name}/rulebook.json: ${ye.message}`:`${te.name}/rulebook.json: ${String(ye)}`)}}return{errors:V,ruleNames:z}}function my(){console.log(vd),console.log(ly)}function gy(P,V,z,Q){if(console.log(`
✓ ${P} config: ${V}`),console.log(`  Schema: ${Q==="rules"?"rulebook sources":"legacy inline rules"}`),z.ruleNames.size>0){console.log(`  ${Q==="rules"?"Sources":"Rules"}:`);let te=1;for(let ne of z.ruleNames)console.log(`    ${te}. ${ne}`),te++}else console.log(`  ${Q==="rules"?"Sources":"Rules"}: (none)`)}function yy(P,V,z){if(console.error(`
✗ Legacy ${P.toLowerCase()} config: ${V}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),z.errors.length>0){console.error("  Errors:");let Q=1;for(let te of z.errors)for(let ne of te.split("; "))console.error(`    ${Q}. ${ne}`),Q++;return}if(z.ruleNames.size>0){console.error("  Rules:");let Q=1;for(let te of z.ruleNames)console.error(`    ${Q}. ${te}`),Q++;return}console.error("  Rules: (none)")}function hy(P,V,z){Ld(`${P} config`,V,z)}function vy(P,V){console.log(`
✓ GitHub source rules: ${P}`),console.log("  Rulebooks:");let z=1;for(let Q of V.ruleNames)console.log(`    ${z}. ${Q}`),z++}function by(P,V){Ld("GitHub source rules",P,V)}function Ld(P,V,z){console.error(`
✗ ${P}: ${V}`),console.error("  Errors:");let Q=1;for(let te of z)for(let ne of te.split("; "))console.error(`    ${Q}. ${ne}`),Q++}function Ly(P){try{let V=n(P);if(V===null)return!1;let z=JSON.parse(V);if(z.$schema)return!1;return g(P,JSON.stringify({$schema:cy,...z},null,2)),!0}catch(V){if(V instanceof r)throw V;return!1}}var wd=new Set(["init","add","remove","update","sync","list","wrapper","migrate","doc","verify"]),ky=new Set(["add","remove","list"]),xy="cc-safety-net/rulebooks";async function kd(P,V){try{return await Cy(P,V)}catch(z){if(z instanceof r)return console.error(z.message),1;throw z}}async function Cy(P,V){let z=Ry(V),Q=z.help?Sy(z.positionals):null;if(Q)return wn(Q),0;if(z.errors.length>0){for(let ye of z.errors)console.error(ye);return 1}let te=z.positionals[0];if(!te)return wn(fn,console.error),1;let ne=z.positionals[1],ce={global:z.global};if(te==="init"){let ye=Pt(P,ce);Ay(ye.configTarget);let he=wy(ye.configDir,"example-rules","rulebook.json"),be=i(ye.filesystemScope,he);if(z.example&&n(be)===null)Vc(be);let Le=j(ye.configPath,ye.filesystemScope);for(let Ie of Le)console.error(Ie);if(Le.length>0)return 1;return console.log("Rule config initialized."),0}if(te==="add"){let ye=xd(z);if(!ye)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let he=Pt(P,ce),be=await cd(P,ye,{...ce,ref:z.ref,rulebooks:z.only.length>0?z.only:void 0});return Hc(be,ye,`Scope: ${z.global?"user":"project"} (${he.configDir})`),be.ok?0:1}if(te==="remove"){if(!ne)return console.error("rule remove requires a source"),1;let ye=await dd(P,ne,{...ce,deleteSource:z.deleteSource});return Mr(ye,`Removed rulebook source: ${ne}`),ye.ok?0:1}if(te==="update"){let ye=await zr(P,{...ce,only:ne,refresh:!0});return Mr(ye,"Rule config updated."),ye.ok?0:1}if(te==="sync")return Fs(P,{global:z.global});if(te==="list"){let ye=J(P,{cwd:process.cwd()});return Gc(ye),ye.errors.length>0?1:0}if(te==="wrapper")return _y(P,z);if(te==="migrate")return gd(P,{cleanup:z.cleanup,cwd:process.cwd()});if(te==="doc"){console.log(Nc);let ye=await hd(P);if(ye)console.error(ye);return 0}if(te==="verify")return bd(P);return 1}function Sy(P){if(P.length===0)return fn;let V=fn.subcommands.filter((Q)=>Q.usage.split(" ")[0]===P[0]);if(V.length===0)return null;if(P.length===1&&V.length>1)return{name:`rule ${P[0]}`,description:`Subcommands of rule ${P[0]}`,usage:`rule ${P[0]} <subcommand>`,subcommands:V,options:[]};let z=P.length===1?V[0]:V.find((Q)=>Q.usage.split(" ")[1]===P[1]);if(!z)return null;return{name:`rule ${P[0]}`,description:z.description,usage:`rule ${z.usage}`,options:P[0]==="add"?eo:[],examples:P[0]==="add"?to:void 0}}function Ry(P){let V=xt({label:"rule",booleans:{global:["-g","--global"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"]},lists:{only:["--only"]},positionals:"list"},P),z={...V.flags,ref:V.values.ref,only:V.lists.only??[],help:V.help,positionals:V.positionals,errors:V.errors};return Py(z),z}function Py(P){let[V]=P.positionals;if(V&&!wd.has(V))P.errors.push(`Unknown rule subcommand: ${V}`);if(P.deleteSource&&V!=="remove")if(V&&wd.has(V))P.errors.push(`Unknown option for rule ${V}: --delete-source`);else P.errors.push("--delete-source is only valid with 'rule remove'");if(P.cleanup&&V!=="migrate")P.errors.push(Wn(V,"--cleanup"));if(P.example&&V!=="init")P.errors.push(Wn(V,"--example"));if(P.ref&&V!=="add")P.errors.push(Wn(V,"--ref"));if(P.only.length>0&&V!=="add")P.errors.push(Wn(V,"--only"));if(V==="add")Ey(P);if(V==="migrate"){if(P.global)P.errors.push(Wn(V,"--global"));if(P.positionals.length>1)P.errors.push(`Unexpected rule migrate argument: ${P.positionals[1]}`)}else if(V==="wrapper")Dy(P);else if(P.positionals.length>2)P.errors.push(`Unexpected rule argument: ${P.positionals[2]}`);if(V==="list"&&P.global)P.errors.push("Unknown option for rule list: --global")}function xd(P){if(P.positionals[1])return P.positionals[1];if(P.ref||P.only.length>0)return xy;return}function Ey(P){let V=xd(P);if(!V)return;if((P.ref||P.only.length>0)&&!q(V)){if(P.ref)P.errors.push(`--ref can only select a ref for an owner/repo source: ${V}`);if(P.only.length>0)P.errors.push("--only can only select rulebooks from an owner/repo source");return}if(P.ref&&!oe(P.ref))P.errors.push(`--ref must use valid path segments: ${P.ref}`);let z=P.only.filter((Q)=>!l.test(Q));if(z.length>0)P.errors.push(`Invalid rulebook names: ${z.join(", ")}`)}function Wn(P,V){return P?`Unknown option for rule ${P}: ${V}`:`Unknown option for rule: ${V}`}function Dy(P){let V=P.positionals[1],z=P.positionals[2];if(!V){P.errors.push("rule wrapper requires add, remove, or list");return}if(!ky.has(V)){P.errors.push(`Unknown rule wrapper action: ${V}`);return}if(V==="list"){if(z)P.errors.push(`Unexpected rule wrapper argument: ${z}`);return}if(!z){P.errors.push(`rule wrapper ${V} requires a command`);return}if(P.positionals.length>3)P.errors.push(`Unexpected rule wrapper argument: ${P.positionals[3]}`)}function Ay(P){if(n(P)===null){qc(P);return}let V=m(P);if(!V.config)return;Rt(P,{version:1,rules:V.config.rules,overrides:V.config.overrides??{},transparent_wrappers:V.config.transparent_wrappers??[]})}async function _y(P,V){let z=V.positionals[1],Q=V.positionals[2],te=Pt(P,{global:V.global}).configTarget;if(z==="list"){let he=m(te);if(he.errors.length>0){for(let be of he.errors)console.error(be);return 1}return Ty(he.config?.transparent_wrappers??[]),0}if(!Q||!w.test(Q))return console.error("transparent wrapper must match command pattern"),1;if(Re(Q))return console.error(`reserved command "${Q}" cannot be a wrapper`),1;let ne=m(te);if(ne.errors.length>0){for(let he of ne.errors)console.error(he);return 1}let ce=ne.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},ye=z==="add"?[...new Set([...ce.transparent_wrappers??[],Q])]:(ce.transparent_wrappers??[]).filter((he)=>he!==Q);return Rt(te,{version:1,rules:ce.rules,overrides:ce.overrides??{},transparent_wrappers:ye}),console.log(z==="add"?`Added transparent wrapper: ${Q}`:`Removed transparent wrapper: ${Q}`),0}function Ty(P){if(P.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${P.length}):`);for(let V of P)console.log(`  - ${V}`)}import{sep as Ny}from"node:path";import{existsSync as $y,readFileSync as Iy}from"node:fs";import{join as Oy}from"node:path";async function Fy(P){if(P.isTTY)return null;return(await We(P).catch(()=>null))?.trim()||null}function jy(P){let V=P.env.get("CLAUDE_SETTINGS_PATH");if(V)return V;return Oy(P.home,".claude","settings.json")}function Ri(P){let V=jy(P);if(!$y(V))return!1;try{let z=Iy(V,"utf-8"),Q=JSON.parse(z);if(!Q.enabledPlugins)return!1;let te="cc-safety-net@cc-marketplace";if(!(te in Q.enabledPlugins))return!1;return Q.enabledPlugins[te]===!0}catch(z){if(R(o.debug,P.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${V}: ${z instanceof Error?z.message:String(z)}`);return!1}}async function Pi(P,V=process.stdin){let z=Ri(P),Q;if(!z)Q="\uD83D\uDEE1️ CC Safety Net ❌";else{let ne=E(P,{cwd:process.cwd()}),ce=ne.policy,ye=L(ce,P.env),he=Object.values(G(ce,ye.capabilities)).some((Ie)=>Ie.changesInherited),be={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[he?"custom":ye.effectiveLevel],Le=(ne.policyScopes?.weakenings.length??0)>0?"\uD83D\uDD3B":"";Q=`\uD83D\uDEE1️ CC Safety Net ${be}${ye.worktreeMode?"\uD83C\uDF33":""}${Le}${ne.state==="degraded"?"⚠️":""}`}let te=await Fy(V);if(te&&!te.startsWith("{"))console.log(`${te} | ${Q}`);else console.log(Q)}function Cd(P){let V=E(P,{cwd:process.cwd()}),z=V.policy,Q=L(z,P.env),te=!!process.env.NO_COLOR||!process.stdout.isTTY,ne=Math.min(process.stdout.columns||80,100),ce=te?"ok":"✔",ye=te?"OFF":"✘",he=(at,ct)=>{let lt=`  ${at.padEnd(13)}${ct}`;return(lt.length>ne?`${lt.slice(0,ne-1)}…`:lt).replaceAll(ye,dt.red(ye))},be=Object.values(G(z,Q.capabilities)).some((at)=>at.changesInherited),Le=(at)=>at===P.home||at.startsWith(`${P.home}${Ny}`)?`~${at.slice(P.home.length)}`:at,Ie={ready:dt.green,degraded:dt.yellow}[V.state],Xe=V.policyScopes?.weakenings??[],et=[...Ri(P)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...V.diagnostics],xe=te?"-":"·";console.log([`${te?"":"\uD83D\uDEE1️  "}CC Safety Net — ${Ie(V.state)}`,"",he("Protection",`destructive ${z.destructiveCommandProtectionEnabled?ce:ye}   secrets ${z.secretProtection.enabled?ce:ye}`),he("Level",be?`${Q.effectiveLevel} (customised)`:Q.effectiveLevel),he("Rules",z.rules.length===0?"none active":`${z.rules.length} active`),he("Policy",Le(u(P))),...V.policyScopes?[he("Project",Le(b(process.cwd())))]:[],...Q.worktreeMode?[he("Worktree","relaxations active")]:[],"",...Xe.length===0?[]:["  Project policy",...Xe.flatMap((at)=>jn(at,"      ",ne-6).map((ct,lt)=>lt===0?`    ${ct}`:ct)),""],...et.length===0?["  Everything configured is active."]:["  Not active",...et.flatMap((at)=>jn(at,"      ",ne-6).map((ct,lt)=>lt===0?`    ${xe} ${ct}`:ct)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as Od}from"node:child_process";import{randomBytes as Wy}from"node:crypto";import{existsSync as Ky}from"node:fs";import{createServer as Yy}from"node:http";import{Writable as Zy}from"node:stream";var Kr=500;function My(P){let V=P.filter((te)=>te.decision!=="allow"),z=P.filter((te)=>te.decision==="allow"),Q=Math.min(V.length,Math.max(Kr-z.length,Math.ceil(Kr/2)));return[...V.slice(0,Q),...z.slice(0,Kr-Q)]}function Sd(P,V,z=O(P)){if(z)B(P,z);let Q=(ct)=>new Date(ct.getFullYear(),ct.getMonth(),ct.getDate()).getTime(),te=Q(new Date),ne=new Date(te);ne.setDate(ne.getDate()-(V-1));let ce=ne.getTime(),ye=[],he={count:0};for(let ct of z?Yt(z,he):[])for(let lt of pn(ct,he)){let pt=new Date(lt.ts).getTime();if(!Number.isFinite(pt))continue;if(pt>=ce)ye.push(lt)}ye.sort((ct,lt)=>new Date(lt.ts).getTime()-new Date(ct.ts).getTime());let be=Array.from({length:V},()=>0),Le=Array.from({length:V},()=>0),Ie={},Xe={},et={},xe=0,at=0;for(let ct of ye){let lt=ct.agent||"unknown";Ie[lt]=(Ie[lt]??0)+1;let pt=Math.round((te-Q(new Date(ct.ts)))/86400000),mt=V-1-pt,gt=pt>=0&&pt<V;if(gt)Le[mt]=(Le[mt]??0)+1;if(ct.decision!=="allow"){if(xe++,ct.ruleId)Xe[ct.ruleId]=(Xe[ct.ruleId]??0)+1;let ut=Qr(ct.segment||ct.command);if(ut)et[ut]=(et[ut]??0)+1;if(ct.failureStage)at++;if(gt)be[mt]=(be[mt]??0)+1}}return{days:V,logsDir:z,homeDir:P.home,totalInWindow:ye.length,truncated:ye.length>Kr,unreadable:he.count,counts:{blocked:xe,allowed:ye.length-xe,agents:Ie,blockedByDay:be,analyzedByDay:Le,rules:Xe,commands:et,errors:at},entries:My(ye).sort((ct,lt)=>new Date(lt.ts).getTime()-new Date(ct.ts).getTime())}}import{spawn as Hy}from"node:child_process";import{existsSync as Uy,statSync as Rd}from"node:fs";import{delimiter as Gy,join as By}from"node:path";var qy=120000,Yr="Choose the project folder",Vy=`try
  return POSIX path of (choose folder with prompt "${Yr}")
on error number -128
  return ""
end try`,zy=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${Yr}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Pd=[{binary:"zenity",args:["--file-selection","--directory",`--title=${Yr}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",Yr]}],Ed=(P,V)=>(V.PATH??"").split(Gy).some((z)=>{if(z.length===0)return!1;try{let Q=Rd(By(z,P));return Q.isFile()&&(Q.mode&73)!==0}catch{return!1}});function Ei(P,V){if(P==="darwin"||P==="win32")return!0;if(P!=="linux")return!1;if(!V.DISPLAY&&!V.WAYLAND_DISPLAY)return!1;return Pd.some((z)=>Ed(z.binary,V))}function Jy(P,V){if(P==="darwin")return{cmd:"osascript",args:["-e",Vy]};if(P==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",zy]};let z=Pd.find((Q)=>Ed(Q.binary,V));return z?{cmd:z.binary,args:z.args}:null}function Di(P=process.platform,V=process.env){let z=Jy(P,V);if(!z)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((Q)=>{let te=Hy(z.cmd,z.args,{env:V,stdio:["ignore","pipe","pipe"]}),ne="",ce=!1,ye=(be)=>{if(ce)return;ce=!0,clearTimeout(he),Q(be)},he=setTimeout(()=>{te.kill(),ye({error:"The folder dialog timed out"})},qy);te.stdout.on("data",(be)=>{ne+=be.toString()}),te.on("error",()=>ye({error:`Could not open the folder dialog (${z.cmd})`})),te.on("close",()=>{let be=ne.trim().replace(/\/+$/,"");if(!be)return ye({cancelled:!0});if(!Uy(be)||!Rd(be).isDirectory())return ye({error:"That selection is not a folder on disk"});ye({path:be})})})}var Dd=`<!doctype html>
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
`;var Ad='<script id="ccsn-data" type="application/json">';function _d(P){return Dd.replace(Ad,()=>Ad+JSON.stringify({token:P}).replaceAll("<","\\u003c"))}var Zr="kenryu42/cc-safety-net",Xy=`https://github.com/${Zr}`,Ti=1e4,Qy=7,eh="The project draft directory changed; reload the draft before applying.",th="audit settings are user scope only; remove the audit section from a project proposal";async function Fd(P,V={}){let z=xt({label:"gui",booleans:{noOpen:["--no-open"]}},P),Q=V.log??console.log,te=V.error??console.error;if(z.errors.length>0){for(let ce of z.errors)te(ce);return te("Usage: cc-safety-net gui [--no-open]"),1}let ne=await nh(c,V);if(Q(`CC Safety Net policy GUI: ${ne.url}`),!z.flags.noOpen)try{await(V.openBrowser??fh)(ne.url)}catch(ce){te(`Failed to open browser: ${ce instanceof Error?ce.message:String(ce)}`),te(`Open this URL manually: ${ne.url}`)}if(V.keepAlive===!1)return await ne.close(),0;return await ph(ne),0}async function nh(P,V={}){let z=Wy(24).toString("base64url"),Q={dir:null,revision:0},te=Yy((ye,he)=>{rh(P,ye,he,z,V,Q)});await new Promise((ye,he)=>{te.once("error",he),te.listen(0,"127.0.0.1",()=>{te.off("error",he),ye()})});let ce=`http://127.0.0.1:${te.address().port}`;return{origin:ce,token:z,url:`${ce}/?token=${encodeURIComponent(z)}`,close:()=>uh(te)}}async function rh(P,V,z,Q,te,ne){let ce=P(),ye=new URL(V.url??"/","http://127.0.0.1");if(V.method==="GET"&&ye.pathname==="/favicon.ico"){z.writeHead(204,{"cache-control":"no-store"}),z.end();return}if(!lh(V,ye,Q)){yt(z,403,{error:"Forbidden"});return}if(V.method==="GET"&&ye.pathname==="/"){dh(z,_d(Q));return}if(V.method==="GET"&&ye.pathname==="/api/policy"){let he=_c(ce,te),be=E(ce,Ai(te));yt(z,200,{...he,configState:Ne(be),...be.policyScopes?{projectPolicy:{path:b(te.cwd??process.cwd()),weakenings:be.policyScopes.weakenings}}:{},destructiveCommandRules:U,secretPatterns:Ke,version:wt(),preview:he.errors.length>0?null:Ae(he.policy,ce.env)});return}if(V.method==="POST"&&ye.pathname==="/api/policy/preview"){let he=await Kn(V);if(!he.ok){yt(z,he.status,{errors:[he.error]});return}let be=Tc(ce,he.value);yt(z,be.errors.length>0?400:200,be);return}if(V.method==="POST"&&ye.pathname==="/api/policy/explain"){let he=await Kn(V);if(!he.ok){yt(z,he.status,{errors:[he.error]});return}let be=he.value;if(be===null||typeof be.command!=="string"){yt(z,400,{errors:["command must be a string"]});return}let Le=qn(be.policy,ce.home);if(Le.length>0){yt(z,400,{errors:Le});return}yt(z,200,sh(ce,be.command,be.policy,te));return}if(V.method==="POST"&&ye.pathname==="/api/policy"){let he=await Kn(V);if(!he.ok){yt(z,he.status,{errors:[he.error]});return}let be=Vt(ce,he.value,te);yt(z,be.errors.length>0?400:200,be);return}if(V.method==="POST"&&ye.pathname==="/api/reset"){yt(z,200,Vt(ce,Z,te));return}if(V.method==="POST"&&ye.pathname==="/api/repair"){yt(z,200,$c(ce,te));return}if(V.method==="POST"&&ye.pathname==="/api/policy/project/choose-directory"){let he=await(te.chooseDirectory??Di)();if("path"in he)ne.dir=he.path,ne.revision+=1;yt(z,200,{cancelled:"cancelled"in he,..."error"in he?{error:he.error}:{}});return}if(V.method==="GET"&&ye.pathname==="/api/policy/project"){let he=jd(ne,te),be=Td(he,ce.home),Le=Vn(ce,te);yt(z,200,{path:b(he),revision:ne.revision,baseline:Le.baseline,userPolicyDiagnostics:Le.diagnostics,projection:be.projection,projectionDiagnostics:be.diagnostics,canPickDirectory:Ei(process.platform,process.env)});return}if(V.method==="POST"&&ye.pathname==="/api/policy/project/diff"){let he=await $d(ce,V,z,ne,te);if(!he)return;let be=Td(he.dir,ce.home),Le=Vn(ce,te).baseline,Ie=Y(Le,ae(he.proposal,ce.home).policy);yt(z,200,{rows:jr(Y(Le,be.projection).policy,Ie.policy,!1),weakenings:Ie.weakenings,existingFileDiagnostics:be.diagnostics});return}if(V.method==="POST"&&ye.pathname==="/api/policy/project/apply"){let he=await $d(ce,V,z,ne,te);if(!he)return;let be=ih(he.dir,he.proposal,ce.home);yt(z,be.errors.length>0?500:200,be);return}if(V.method==="GET"&&ye.pathname==="/api/activity"){let he=ee(ce,te),be=ah(ye.searchParams.get("days"),he);if(be===null){yt(z,400,{error:`days must be an integer between 1 and ${he}`});return}yt(z,200,Sd(ce,be,te.activityLogsDir));return}if(V.method==="POST"&&ye.pathname==="/api/rules/choose-directory"){yt(z,200,await Di());return}if(V.method==="GET"&&ye.pathname==="/api/rules"){let he=J(ce,Ai(te)),be=new Map(he.rules.map((Le)=>[Le.name,Le]));yt(z,200,{projectPath:te.cwd??process.cwd(),canPickDirectory:Ei(process.platform,process.env),rulebooks:he.rulebooks.map((Le)=>({source:Le.source,spec:Le.spec,name:Le.name,version:Le.version,rules:Le.rules.flatMap((Ie)=>{let Xe=be.get(Ie);if(!Xe)return[];return[{name:Xe.name,command:Xe.command,subcommand:Xe.subcommand,block_args:Xe.block_args,reason:Xe.reason}]})})),errors:he.errors,warnings:he.warnings});return}if(V.method==="GET"&&ye.pathname==="/api/star/context"){yt(z,200,await(te.fetchStarContext??(()=>bh(ce,{logsDir:te.activityLogsDir})))());return}if(V.method==="POST"&&ye.pathname==="/api/star"){let he=await(te.starRepo??mh)();yt(z,200,he.ok?{ok:!0}:{ok:!1,fallbackUrl:Xy});return}if(V.method==="GET"&&ye.pathname==="/api/integrations"){yt(z,200,await(te.fetchIntegrations??(()=>gh(ce)))());return}if(V.method==="GET"&&ye.pathname==="/api/health"){yt(z,200,await(te.fetchHealth??hh)());return}if(V.method==="POST"&&(ye.pathname==="/api/install"||ye.pathname==="/api/uninstall")){let he=await Kn(V);if(!he.ok){yt(z,he.status,{errors:[he.error]});return}let be=he.value?.target;if(typeof be!=="string"||!Mt.some((Ie)=>Ie.target===be)){yt(z,400,{error:"unknown target"});return}let Le=ye.pathname==="/api/install"?"install":"uninstall";yt(z,200,await(te.runIntegration??vh)(Le,be));return}yt(z,404,{error:"Not found"})}function Ai(P){return{...P,cwd:P.cwd??process.cwd()}}function jd(P,V){return P.dir??V.cwd??process.cwd()}function Td(P,V){let z=b(P),Q=Ky(z)?dn(z):{value:void 0,errors:[]},te=ae(Q.value,V);return{projection:te.policy,diagnostics:[...Q.errors,...te.diagnostics]}}async function $d(P,V,z,Q,te){let ne=jd(Q,te),ce=Q.revision,ye=await Kn(V);if(!ye.ok)return yt(z,ye.status,{errors:[ye.error]}),null;let he=ye.value;if(typeof he?.revision!=="number")return yt(z,400,{errors:["revision must be a number"]}),null;if(he.revision!==ce)return yt(z,409,{errors:[eh]}),null;let be=oh(he.proposal,P.home);if(be.length>0)return yt(z,400,{errors:be}),null;return{dir:ne,proposal:he.proposal}}function oh(P,V){let z=qn(P,V);if(z.length>0)return z;return P?.audit===void 0?[]:[th]}function ih(P,V,z){let Q=b(P),te=Nr(V,C(V,z));try{return g(i(v(P,"project policy"),Q),`${JSON.stringify(te,null,2)}
`),{path:Q,errors:[]}}catch(ne){return{path:Q,errors:[ne instanceof Error?ne.message:String(ne)]}}}function sh(P,V,z,Q){let te=C(z,P.home),ne=E(P,Ai(Q)),ce=Ee({rules:ne.policy.rules,transparentWrappers:ne.policy.transparentWrappers,safety:De(te.safety),worktreeMode:te.workflow.worktree_mode,destructiveCommandProtectionEnabled:te.destructive_command_protection.enabled,destructiveCommandRuleOverrides:te.destructive_command_protection.overrides,destructiveCommandAllowPaths:te.destructive_command_protection.allow_paths,secretProtection:{enabled:te.secret_protection.enabled,disabledRules:Oe(te.secret_protection.overrides),denyPaths:te.secret_protection.deny_paths,allowPaths:te.secret_protection.allow_paths}});return Nn(V,{policySnapshot:ce,cwd:Q.cwd,userConfigDir:Q.userConfigDir},P)}function ah(P,V){if(P===null)return Math.min(Qy,V);let z=Number(P);if(!Number.isInteger(z)||z<1||z>V)return null;return z}function lh(P,V,z){if(V.searchParams.get("token")!==z)return!1;if(P.method!=="POST")return!0;return P.headers["x-cc-safety-net-token"]===z}var ch=1048576;async function Kn(P){let V=[],z=0;for await(let Q of P){let te=Q;if(z+=te.byteLength,z>ch)return{ok:!1,status:413,error:"Request body is too large"};V.push(te)}try{return{ok:!0,value:JSON.parse(Buffer.concat(V).toString("utf-8")||"{}")}}catch(Q){return{ok:!1,status:400,error:`Invalid JSON: ${Q instanceof Error?Q.message:String(Q)}`}}}function dh(P,V){P.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),P.end(V)}function yt(P,V,z){P.writeHead(V,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),P.end(JSON.stringify(z))}function uh(P){return new Promise((V,z)=>{P.close((Q)=>Q?z(Q):V())})}function ph(P){return new Promise((V)=>{let z=()=>{process.off("SIGINT",Q),process.off("SIGTERM",Q)},Q=()=>{z(),P.close().then(V)};process.once("SIGINT",Q),process.once("SIGTERM",Q)})}function fh(P){let V=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",z=process.platform==="win32"?["/c","start","",P]:[P];return new Promise((Q,te)=>{let ne=Od(V,z,{detached:!0,stdio:"ignore"}),ce=(he)=>{ne.off("spawn",ye),te(he)},ye=()=>{ne.off("error",ce),ne.unref(),Q()};ne.once("error",ce),ne.once("spawn",ye)})}async function mh(P="gh",V=Ti){return{ok:await _i(P,["api","-X","PUT",`/user/starred/${Zr}`],V)===0}}async function gh(P,V={}){let z=await sr(V.fetcher),Q=yh(P,z);return{targets:$t.map((te)=>{let ne=Q.find((ce)=>ce.platform===te.id);return{target:te.id,label:bt(te.id),version:z.versions[te.id]??null,status:ne?.configured?"active":ne?.detected?"disabled":ne?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:z.version,nodeVersion:z.nodeVersion,platform:z.platform}}}function yh(P,V){return Ln(P,process.cwd(),{ampPluginListOutput:V.ampPluginListOutput,codexPluginListOutput:V.codexPluginListOutput,copilotCliVersion:V.versions["copilot-cli"]})}async function hh(P={}){let V=await(P.checkUpdates??Wt)();return{update:{latestVersion:V.latestVersion??null,updateAvailable:V.updateAvailable}}}var Id=Promise.resolve();function vh(P,V,z={}){let Q=async()=>{let ne=[],{log:ce,error:ye}=console;console.log=(...he)=>ne.push(he.map(String).join(" ")),console.error=console.log;try{return{ok:await Bn(P,[],{selectTargets:async()=>[V],output:new Zy({write(be,Le,Ie){ne.push(String(be).replace(/\n$/,"")),Ie()}}),...z})===0,output:ne.join(`
`)}}finally{console.log=ce,console.error=ye}},te=Id.then(Q);return Id=te.then(()=>{return},()=>{return}),te}async function bh(P,V={}){let[z,Q,te]=await Promise.all([Lh(V.command),wh(V.fetchRepo),Promise.resolve(tr(P,ee(P),V.logsDir).totalBlocked)]);return{starred:z,starCount:Q,blockedTotal:te}}async function Lh(P="gh",V=Ti){if(await _i(P,["auth","status"],V)!==0)return null;let z=await _i(P,["api",`/user/starred/${Zr}`],V);if(z===0)return!0;if(z===null)return null;return!1}function _i(P,V,z){return new Promise((Q)=>{let te=Od(P,V,{stdio:"ignore",windowsHide:!0}),ne=!1,ce,ye=(he)=>{if(ne)return;if(ne=!0,ce)clearTimeout(ce);Q(he)};te.once("error",()=>ye(null)),te.once("close",ye),ce=setTimeout(()=>{te.kill(),ye(null)},z)})}async function wh(P=fetch){try{let V=await P(`https://api.github.com/repos/${Zr}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(Ti)});if(!V.ok)return null;let z=await V.json();return typeof z.stargazers_count==="number"?z.stargazers_count:null}catch{return null}}function kh(P){if(P[0]!=="help")return!1;let V=P[1];if(!V)ti(),process.exit(0);if(Mn(V))process.exit(0);console.error(`Unknown command: ${V}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var xh={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),Mn("hook",console.error),process.exit(1)},install:async(P)=>{process.exit(await Bn("install",P))},update:async(P)=>{process.exit(await yi(P))},uninstall:async(P)=>{process.exit(await Bn("uninstall",P))},rule:async(P)=>{process.exit(await kd(c(),P))},policy:async(P)=>{process.exit(await jc(c(),P))},status:async(P)=>{if(Ht(xt({label:"status"},P).errors))process.exit(1);Cd(c())},statusline:async(P)=>{let V=xt({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},P);if(V.errors.length===0&&V.flags.claudeCode){await Pi(c());return}if(Ht(V.errors),!V.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");Mn("statusline",console.error),process.exit(1)},doctor:async(P)=>{let V=Jo(P);if(!V)process.exit(1);let z=await cl(c(),{json:V.json,skipUpdateCheck:V.skipUpdateCheck});process.exit(z)},logs:async(P)=>{process.exit(await Hi(c(),P))},gui:async(P)=>{process.exit(await Fd(P))},explain:async(P)=>{process.exit(await Ll(c(),P))}};async function Ch(P){let V=xt({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},P);if(kh(P))return;let z=P[0],Q=z?er(z):void 0;if(V.help&&Q&&Q.name!=="rule")Mn(Q.name),process.exit(0);if(!z||V.help&&!Q)ti(),process.exit(0);if(V.flags.version)xl(),process.exit(0);if(Q){await xh[Q.name](P.slice(1));return}if(z==="--statusline"){await Pi(c());return}console.error(z.startsWith("-")?`Unknown option: ${z}`:`Unknown command: ${z}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{Ch as runCli};
