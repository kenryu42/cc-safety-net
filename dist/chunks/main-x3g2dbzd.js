import{n,a,Ye,ft,N,St,mt,c,r,gt,M,_,$e,xt,u,Fe,m,i,A,s,V,o,x,Re,Z,Lt,kt,h,Pe,_e,Et,q,ue,Ce,T,Rt,H,R,Ae,W,y,X,yt,vt,K,I,U,pe,Te,Qe,Pt,w,e,C,et,je,bt,wt,Se,Ge,xe,tt,fe,Q,He,nt,Ie,We,ee,Ct,Ue,Be,ze,Ve,De,Oe,te,me,ge,Le,S,ne,rt,it,st,D,at,qe,lt,L,t,he,Ne,E,P,O,_t,ct,dt,g,re}from"./index-x4fcfd3g.js";import{d,oe,Ke,ut,ke,B,p}from"../bin/cc-safety-net.js";import{ve,ie,pt,Y,j}from"./index-ve725rh2.js";import{readdirSync as uu,statSync as Yi,unlinkSync as pu}from"node:fs";import{basename as Zi,dirname as fu,isAbsolute as mu,join as gu,relative as hu,resolve as yu,sep as vu}from"node:path";import{existsSync as iu,readdirSync as su,readFileSync as au}from"node:fs";import{join as lu}from"node:path";var Ji=(l)=>{let f=Date.now()-new Date(l).getTime();if(!Number.isFinite(f))return"";let v=Math.floor(f/60000),b=Math.floor(v/60),k=Math.floor(b/24);if(k>0)return`${k}d ago`;if(b>0)return`${b}h ago`;if(v>0)return`${v}m ago`;return"just now"},dr=(l)=>{let f=(l??"").trim().split(/\s+/).filter((k)=>k&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(k)),v=f[0]?.split("/").pop();if(!v)return null;let b=f[1];return b&&/^[a-z][a-z0-9-]*$/.test(b)?`${v} ${b}`:v};function dn(l,f){try{return su(l,{withFileTypes:!0,encoding:"utf8"}).flatMap((v)=>{let b=lu(l,v.name);if(v.isDirectory())return dn(b,f);if(v.name.endsWith(".jsonl"))return[b];return[]})}catch{if(f&&iu(l))f.count++;return[]}}function Wi(l){let f=(k)=>`${k.sessionId}
${dr(k.segment||k.command)}`,v=l.filter((k)=>k.decision!=="allow"),b=v.filter((k)=>k.sessionId).reduce((k,F)=>k.set(f(F),(k.get(f(F))??0)+1),new Map);return new Set(v.filter((k)=>k.failureStage||(b.get(f(k))??0)>=2))}var cu=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function du(l){if(!l||typeof l!=="object"||Array.isArray(l))return!1;let f=l;if(typeof f.ts!=="string"||typeof f.command!=="string")return!1;return cu.every((v)=>f[v]===void 0||typeof f[v]==="string")}function Sn(l,f){try{return au(l,"utf-8").split(`
`).filter(Boolean).flatMap((v)=>{try{let b=JSON.parse(v);if(!du(b)){if(f)f.count++;return[]}return[b]}catch{if(f)f.count++;return[]}})}catch{if(f)f.count++;return[]}}function jt(l){return Array.from(l,(f)=>{let v=f.charCodeAt(0);if(v<=31||v>=127&&v<=159)return`\\x${v.toString(16).padStart(2,"0")}`;return f}).join("")}function bu(l,f){let v=ve(l),b=d({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},f);if(oe(b.errors))return null;if(b.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(b.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let k=b.values.limit===void 0?20:Ki(b.values.limit);if(k===null)return console.error("--limit must be a positive number"),null;let F=b.values.since===void 0?Math.min(30,v):Ki(b.values.since);if(F===null||F>v)return console.error(`--since must be a positive number of days no greater than ${v}`),null;let G={limit:k,limitExplicit:b.values.limit!==void 0,since:F,sinceExplicit:b.values.since!==void 0,all:b.flags.all,json:b.flags.json,suspect:b.flags.suspect,pruneLegacy:b.flags.pruneLegacy,dryRun:b.flags.dryRun,id:b.values.id,agent:b.values.agent,rule:b.values.rule,session:b.values.session,project:b.values.project===void 0?void 0:yu(b.values.project)};if(G.id&&(G.agent!==void 0||G.rule!==void 0||G.session!==void 0||G.project!==void 0||G.suspect||G.sinceExplicit||G.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(G.pruneLegacy&&(G.id!==void 0||G.agent!==void 0||G.rule!==void 0||G.session!==void 0||G.project!==void 0||G.suspect||G.all||G.sinceExplicit||G.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(G.dryRun&&!G.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return G}async function Xi(l,f,v={}){let b=bu(l,f);if(!b)return 1;let k=v.logsDir??Y(l);if(b.pruneLegacy)return Lu(k,b.json,b.dryRun);if(!k)return console.log(b.json?"[]":b.id?`No retained audit log entry found for id ${jt(b.id)}.`:"No audit log entries found."),0;ie(l,k);let F={count:0},G=dn(k,F).flatMap((le)=>Sn(le,F).map((be)=>({entry:be,file:le})));if(F.count>0)console.error(`warning: ${F.count} audit log ${F.count===1?"source":"sources"} could not be read; these results are incomplete`);if(b.id)return Su(G,b,v.timeZone);let z=Date.now()-b.since*24*60*60*1000,J=G.filter((le)=>Cu(le,b,k,z)),se=b.suspect?Wi(J.map((le)=>le.entry)):null,ae=(se?J.filter((le)=>se.has(le.entry)):J).sort((le,be)=>Date.parse(be.entry.ts)-Date.parse(le.entry.ts)).slice(0,b.limit);if(b.json)return console.log(JSON.stringify(ae.map((le)=>le.entry),null,2)),0;if(ae.length===0)return console.log("No audit log entries found."),0;for(let le of ae)console.log(Eu(le.entry,v.timeZone));return 0}function Lu(l,f,v){let b=l?ku(l).map((z)=>gu(l,z)):[];if(v)return wu(b,f);let k=[],F=0,G=0;for(let z of b){let J=Yi(z,{throwIfNoEntry:!1})?.size??0,se=xu(z);if(se){k.push(`${Zi(z)}: ${se}`);continue}F++,G+=J}if(f)return console.log(JSON.stringify({removedFiles:F,removedBytes:G,failedFiles:k.length})),k.length===0?0:1;console.log(F===0&&k.length===0?"No legacy audit log files found.":`Removed ${F} legacy audit log ${F===1?"file":"files"} (${Qi(G)}).`);for(let z of k)console.error(`Could not remove ${jt(z)}`);if(console.log("Nested v2 audit logs were not changed."),F>0)console.log("This deletion cannot be undone.");return k.length===0?0:1}function wu(l,f){let v=l.reduce((b,k)=>b+(Yi(k,{throwIfNoEntry:!1})?.size??0),0);if(f)return console.log(JSON.stringify({dryRun:!0,files:l.length,bytes:v})),0;if(console.log(l.length===0?"No legacy audit log files found.":`Would remove ${l.length} legacy audit log ${l.length===1?"file":"files"} (${Qi(v)}).`),console.log("Nested v2 audit logs are not included."),l.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function ku(l){try{return uu(l,{withFileTypes:!0}).filter((f)=>f.isFile()&&f.name.endsWith(".jsonl")).map((f)=>f.name)}catch{return[]}}function xu(l){try{return pu(l),null}catch(f){return f instanceof Error?f.message:String(f)}}function Qi(l){let f=["B","KiB","MiB","GiB"],v=Math.min(Math.floor(Math.log2(Math.max(l,1))/10),f.length-1);return`${Math.round(l/1024**v*10)/10} ${f[v]}`}function Su(l,f,v){let b=l.filter((F)=>F.entry.id===f.id);if(b.length>1)return console.error(`Multiple audit log entries found for id ${jt(f.id??"")}.`),1;if(f.json)return console.log(JSON.stringify(b.map((F)=>F.entry),null,2)),0;let k=b[0];if(!k)return console.log(`No retained audit log entry found for id ${jt(f.id??"")}.`),0;return console.log(Du(k.entry,v)),0}function Cu(l,f,v,b){if(!f.all&&l.entry.decision==="allow")return!1;if(Date.parse(l.entry.ts)<b)return!1;if(f.agent!==void 0&&l.entry.agent!==f.agent)return!1;if(f.rule!==void 0&&l.entry.ruleId!==f.rule)return!1;if(f.session!==void 0&&!Ru(l,v,f.session))return!1;if(f.project!==void 0&&!Pu(l.entry.cwd,f.project))return!1;return!0}function Ru(l,f,v){if(l.entry.sessionId===v)return!0;return fu(l.file)===f&&Zi(l.file,".jsonl")===v}function Pu(l,f){if(!l)return!1;let v=hu(f,l);return v!==".."&&!v.startsWith(`..${vu}`)&&!mu(v)}function Eu(l,f){let v=jt(l.id??"-"),b=jt(l.decision??"deny"),k=l.cwd?`  [${jt(l.cwd)}]`:"",F=l.segment||l.command,G=F===l.command?"":"↳ ",z=F.length>50?`${F.slice(0,50)}…`:F;return`${v.padEnd(16)}  ${jt(es(l.ts,f))}  ${b.padEnd(5)}  ${jt(l.agent??"-").padEnd(15)}  ${jt(l.ruleId??"-").padEnd(20)}  ${G}${jt(z)}${k}`}function Du(l,f){let v=(k)=>jt(k===void 0||k===null||k===""?"-":k),b=l.shape?`${l.agent??"-"} (shape: ${l.shape})`:l.agent??"-";return[`id:        ${v(l.id)}`,`ts:        ${v(es(l.ts,f))}`,`decision:  ${v(l.decision)}`,`agent:     ${v(b)}`,`level:     ${v(l.level)}`,`tool:      ${v(l.toolName)}`,`rule:      ${v(l.ruleId)}`,`intent:    ${v(l.intent)}`,`stage:     ${v(l.failureStage)}`,`error:     ${v(l.errorCode)}`,`session:   ${v(l.sessionId)}`,`cwd:       ${v(l.cwd)}`,`version:   ${v(l.v)}`,`truncated: ${v(l.truncated===!0?"yes":void 0)}`,`reason:    ${v(l.reason)}`,`command:   ${v(l.command)}`,`segment:   ${v(l.segment)}`].join(`
`)}function es(l,f){let v=new Date(l);if(Number.isNaN(v.getTime()))return l;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:f}).format(v)}function Ki(l){let f=Number(l);return Number.isFinite(f)&&f>0?f:null}var ts={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var ns={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var rs={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var Au=ke.map((l)=>({flags:l.flags.join(", "),description:l.description})),_u=ke.flatMap((l)=>l.flags.map((f)=>`cc-safety-net hook ${f}`)),os={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Au,{flags:"-h, --help",description:"Show this help"}],examples:_u};var is={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...B.map((l)=>({flags:l.flag,description:`Install ${p(l.id)} ${l.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...B.map((l)=>`cc-safety-net install ${l.flag}`)]},ss={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...B.map((l)=>({flags:l.flag,description:`Uninstall ${p(l.id)} ${l.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...B.map((l)=>`cc-safety-net uninstall ${l.flag}`)]},as={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var ls={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var ur={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var mo=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],go=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],Cn={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},...mo.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk",...go,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var cs={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var ds={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var pr=[cs,ts,ls,ns,Cn,ur,is,as,ss,os,rs,ds];function $u(l){return l.aliases??[]}function fr(l){let f=l.toLowerCase();return pr.find((v)=>v.name.toLowerCase()===f||$u(v).some((b)=>b.toLowerCase()===f))}import{basename as Tu}from"node:path";function mr(l,f=7,v=Y(l)){let b=Date.now()-f*24*60*60*1000,k=[],F=new Set,G=0,z,J,se,ae;if(v)ie(l,v);let le={count:0},be=v?dn(v,le):[];for(let de of be)for(let ce of Sn(de,le)){if(ce.decision==="allow")continue;let we=new Date(ce.ts).getTime();if(we>=b){if(G++,F.add(ce.sessionId??Tu(de,".jsonl")),J===void 0||we<=J)z=ce.ts,J=we;if(ae===void 0||we>ae)se=ce.ts,ae=we;Iu(k,ce,we)}}let ye=k.map((de)=>({timestamp:de.ts,command:de.command,reason:de.reason,relativeTime:Ji(new Date(de.ts))}));return{totalBlocked:G,sessionCount:F.size,recentEntries:ye,oldestEntry:z,newestEntry:se,unreadable:le.count}}function Iu(l,f,v){let b=l.findIndex((k)=>v>new Date(k.ts).getTime());if(b===-1){if(l.length<3)l.push(f);return}if(l.splice(b,0,f),l.length>3)l.pop()}import{dirname as zu}from"node:path";import{dirname as Ou,join as ju,resolve as Fu}from"node:path";var Nu="config.json";function Nt(l,f,v,b){x(Mu(l),`${JSON.stringify(f,null,2)}
`,v,b)}function Mu(l){return typeof l==="string"?V(l):l}function yo(l){return{errors:Se(Uu(l),": "," "),ruleNames:new Set(tt(l).map((f)=>f.toLowerCase()))}}var Hu="must match pattern (letters, numbers, hyphens, underscores; max 64 chars)",us="must match pattern (letters, numbers, hyphens, underscores)";function Uu(l){if(!ps(l))return[e([],"Config must be an object")];return[...l.version===1?[]:[e(["version"],"must be 1")],...Gu(l.rules)]}function Gu(l){if(l===void 0)return[];if(!Array.isArray(l))return[e(["rules"],"must be an array")];return[...l.flatMap((f,v)=>ps(f)?Bu(f,["rules",v]):[e(["rules",v],"must be an object")]),...et(l)]}function Bu(l,f){return[...ho(l.name,[...f,"name"],"required string",h,Hu),...ho(l.command,[...f,"command"],"required string",I,us),...l.subcommand===void 0?[]:ho(l.subcommand,[...f,"subcommand"],"must be a string if provided",I,us),...qu(l.block_args,[...f,"block_args"]),...Vu(l.reason,[...f,"reason"]),...l.intent===void 0||Ge(l.intent)?[]:[e([...f,"intent"],je)]]}function ho(l,f,v,b,k){if(typeof l!=="string")return[e(f,v)];return b.test(l)?[]:[e(f,k)]}function qu(l,f){if(!Array.isArray(l))return[e(f,"required array")];if(l.length===0)return[e(f,"must have at least one element")];return l.flatMap((v,b)=>{if(typeof v!=="string")return[e([...f,b],"must be a string")];return v===""?[e([...f,b],"must not be empty")]:[]})}function Vu(l,f){if(typeof l!=="string")return[e(f,"required string")];if(l==="")return[e(f,"must not be empty")];return l.length>U?[e(f,`must be at most ${U} characters`)]:[]}function ps(l){return!!l&&typeof l==="object"&&!Array.isArray(l)}function vo(l){let f=fs(l);if(!f.ok)return f.result;return yo(f.parsed)}function fs(l){let f=[],v=new Set;try{let b=typeof l==="string"?V(l):l,k=o(b);if(k===null)return f.push(`File not found: ${b.path}`),{ok:!1,result:{errors:f,ruleNames:v}};if(!k.trim())return f.push("Config file is empty"),{ok:!1,result:{errors:f,ruleNames:v}};return{ok:!0,parsed:JSON.parse(k)}}catch(b){if(b instanceof i)return f.push(b.message),{ok:!1,result:{errors:f,ruleNames:v}};let k=b instanceof Error?b.message:String(b);return f.push(b instanceof SyntaxError?"Invalid JSON":k),{ok:!1,result:{errors:f,ruleNames:v}}}}function ms(l){return Fu(l,".safety-net.json")}function rn(l){let f=fs(l);if(!f.ok)return f.result;let v=bt(f.parsed);return{errors:v.errors,ruleNames:v.sources}}function gr(l,f={}){return ju(Ou(Ae(l,f)),Nu)}function gs(l,f,v){let b;try{if(o(f)===null)return{path:l,exists:!1,valid:!1,ruleCount:0};b=rn(f),b.errors.push(...Q(l,v))}catch(k){if(!(k instanceof i))throw k;b={errors:[k.message],ruleNames:new Set}}return{path:l,exists:!0,valid:b.errors.length===0,ruleCount:b.ruleNames.size,...b.errors.length>0?{errors:b.errors}:{}}}function Ju(l,f){return{source:f,name:l.name,command:l.command,subcommand:l.subcommand,blockArgs:[...l.block_args],reason:l.reason}}function hs(l,f,v){let b=v?.userConfigPath??W(l),k=v?.projectConfigPath??H(f),F=zu(b),G=fe(l,{cwd:f,userConfigPath:b,projectConfigPath:k,userConfigDir:F}),z=X(l,{cwd:f,userConfigPath:b,projectConfigPath:k,userConfigDir:F}),J=new Map(G.rulebooks.flatMap((se)=>se.rules.map((ae)=>[ae,se.source])));return{userConfig:gs(b,z.userConfigTarget,z.userScope),projectConfig:gs(k,z.projectConfigTarget,z.projectScope),effectiveRules:G.rules.map((se)=>Ju(se,J.get(se.name)??"project")),shadowedRules:[]}}var Wu=[{flag:r.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:r.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:r.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:r.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:r.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:r.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:r.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:r.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"}];function ys(l){return[...Wu.map((f)=>({name:f.flag.name,value:$e(f.flag,l.env),isSet:xt(f.flag,l.env),legacyName:f.flag.legacyName,legacyValue:f.flag.legacyName?l.env.get(f.flag.legacyName):void 0,legacyIsSet:f.flag.legacyName?l.env.get(f.flag.legacyName)!==void 0:void 0,description:f.description,defaultBehavior:f.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:l.env.get("CC_SAFETY_NET_HOME"),isSet:l.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var vs={error:0,warning:1,info:2},Ku=["policy","config","audit"];function Yu(l){return l.map((f)=>{if(f==="ownership")return"is not owned by the current user";if(f==="permissions")return"has unsafe permissions";if(f==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var Zu=[{derive:(l)=>l.hooks.length>0&&l.hooks.every((f)=>!f.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(l)=>l.hooks.filter((f)=>f.inspectionStatus==="failed").map((f)=>{let v=p(f.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${v} inspection failed`,detail:`Doctor could not verify the ${v} integration configuration.`,fixHint:`Correct the reported ${v} configuration error, then run \`cc-safety-net doctor\` again.`,integration:f.platform}})},{derive:(l)=>l.userConfig.exists&&!l.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:l.userConfig.path}]:[]},{derive:(l)=>l.projectConfig.exists&&!l.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:l.projectConfig.path}]:[]},{derive:(l)=>l.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${l.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(l)=>l.v2Leftovers&&l.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${l.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(l)=>{let f=l.environment.find((v)=>v.name==="CC_SAFETY_NET_AUDIT_SCOPE");return gt(f?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...Ku.map((l)=>({derive:(f)=>f.posture.directories.filter((v)=>v.kind===l&&v.status==="unsafe").map((v)=>({checkId:`posture.${l}-directory-unsafe`,severity:"error",title:`${l[0]?.toUpperCase()}${l.slice(1)} directory is unsafe`,detail:`The ${l} directory ${Yu(v.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...v.path?{path:v.path}:{}}))})),{derive:(l)=>{let f=[...l.effectiveSafety.weakenedRuleOverrides].sort();return f.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${f.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${f.join(", ")}.`}]:[]}}];function bs(l){return Zu.flatMap((f,v)=>f.derive(l).map((b,k)=>({finding:b,catalogOrder:v,occurrence:k}))).sort((f,v)=>vs[f.finding.severity]-vs[v.finding.severity]||f.catalogOrder-v.catalogOrder||f.occurrence-v.occurrence).map((f)=>f.finding)}function Jt(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var Xu=(l)=>Jt()?`\x1B[32m${l}\x1B[0m`:l,Qu=(l)=>Jt()?`\x1B[33m${l}\x1B[0m`:l,ep=(l)=>Jt()?`\x1B[34m${l}\x1B[0m`:l,tp=(l)=>Jt()?`\x1B[35m${l}\x1B[0m`:l,np=(l)=>Jt()?`\x1B[36m${l}\x1B[0m`:l,rp=(l)=>Jt()?`\x1B[31m${l}\x1B[0m`:l,op=(l)=>Jt()?`\x1B[2m${l}\x1B[0m`:l,ip=(l)=>Jt()?`\x1B[1m${l}\x1B[0m`:l,Je={green:Xu,yellow:Qu,blue:ep,magenta:tp,cyan:np,red:rp,dim:op,bold:ip},sp="\x1B[0m",ap=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function lp(l){let f=l;return()=>(f=(f*1664525+1013904223)%4294967296,f/4294967296)}function cp(l){let f=[...ap],v=lp(l);for(let b=f.length-1;b>0;b--){let k=Math.floor(v()*(b+1)),F=f[b];f[b]=f[k],f[k]=F}return f}function dp(l,f=0){if(!Jt())return"";let v=cp(f);return`\x1B[38;5;${v[l%v.length]}m`}function Ls(l,f,v=0){if(!Jt())return`"${l}"`;return`${dp(f,v)}"${l}"${sp}`}function hr(l){return l==="default"?"built-in default":`${l} policy`}var up=new RegExp("\x1B\\[[0-9;]*m","g"),bo=(l)=>l.replace(up,"").length;function un(l){let f=(l.headers??l.rows[0]??[]).map((G,z)=>{let J=Math.max(...l.rows.map((se)=>bo(se[z]??"")));return Math.max(bo(G),J)}),v=(G,z)=>G+" ".repeat(Math.max(0,z-bo(G))),b=(G,z)=>z[0]+f.map((J)=>G.repeat(J+2)).join(z[1])+z[2],k=(G)=>`│ ${G.map((z,J)=>v(z,f[J]??0)).join(" │ ")} │`,F=l.headers?[`   ${k(l.headers)}`,`   ${b("─",["├","┼","┤"])}`]:[];return[`   ${b("─",["┌","┬","┐"])}`,...F,...l.rows.map((G)=>`   ${k(G)}`),`   ${b("─",["└","┴","┘"])}`].join(`
`)}function ws(l){let f=[];f.push("Hook Integration"),f.push(pp(l));let v=[],b=[];for(let k of l){let F=p(k.platform);if(k.errors&&k.errors.length>0)for(let G of k.errors)if(k.configured)v.push({platform:F,message:G});else b.push({platform:F,message:G})}for(let k of v)f.push(`   Warning (${k.platform}): ${k.message}`);for(let k of b)f.push(Je.red(`   Error (${k.platform}): ${k.message}`));return f.join(`
`)}function pp(l){let f=["Platform","Discovery","Configuration","Inspection"],v=l.map((b)=>{let k=p(b.platform);if(b.inspectionStatus==="not-inspected"){let J=Je.dim("Not inspected");return[k,J,J,J]}let F=b.detected?Je.green("Detected"):b.inspectionStatus==="failed"?Je.red("Unknown"):Je.dim("Not detected"),G=b.configured?Je.green("Configured"):b.detected?Je.yellow("Not configured"):b.inspectionStatus==="failed"?Je.red("Unknown"):Je.dim("Not applicable"),z=b.inspectionStatus==="verified"?Je.green("Verified"):b.inspectionStatus==="failed"?Je.red("Failed"):Je.dim("Not applicable");return[k,F,G,z]});return un({headers:f,rows:v})}function ks(l){let v=["Guard Engine Verification",`   Synthetic self-test: ${l.failed>0?Je.red(`${l.passed}/${l.total} FAIL`):Je.green(`${l.passed}/${l.total} passed`)}`],b=l.results.filter((k)=>!k.passed);if(b.length>0){v.push(""),v.push(Je.red("   Failures:"));for(let k of b)v.push(Je.red(`   • ${k.description}`)),v.push(Je.red(`     expected ${k.expected}, got ${k.actual}`))}return v.join(`
`)}function fp(l){if(l.length===0)return"   (no custom rules)";let f=["Source","Name","Command","Block Args"],v=l.map((b)=>[b.source,b.name,b.subcommand?`${b.command} ${b.subcommand}`:b.command,b.blockArgs.join(", ")]);return un({headers:f,rows:v})}function xs(l){let f=[];if(f.push("Configuration"),f.push(mp(l.userConfig,l.projectConfig)),f.push(""),l.effectiveRules.length>0)f.push(`   Effective rules (${l.effectiveRules.length} total):`),f.push(fp(l.effectiveRules));else f.push("   Effective rules: (none - using built-in rules only)");for(let v of l.shadowedRules)f.push(""),f.push(`   Note: Project rule "${v.name}" shadows user rule with same name`);return f.join(`
`)}function mp(l,f){let v=["Scope","Status"],b=(F)=>{if(!F.exists)return Je.dim("N/A");if(!F.valid)return Je.red(`Invalid (${F.errors?.[0]??"unknown error"})`);return Je.green("Configured")},k=[["User",b(l)],["Project",b(f)]];return un({headers:v,rows:k})}function Ss(l){let f=[];return f.push("Environment"),f.push(gp(l)),f.join(`
`)}function Cs(l){let f=l.effectiveSafety.policyScopes,v=["Effective Safety",`   Selected preset: ${l.effectiveSafety.selectedPreset}${f?` (${hr(f.levelScope)})`:""}`,`   Effective: ${l.effectiveSafety.level}`],b=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[k,F]of b){let G=l.effectiveSafety.capabilities[k],z=G.enabled?Je.green("ON"):Je.dim("OFF"),J=G.sources.length>0?` (${G.sources.join(", ")})`:"";v.push(`   ${F}: ${z} via ${G.source}${J}`)}if(f&&f.weakenings.length>0){v.push("   Project policy deltas:");for(let k of f.weakenings)v.push(`      ${k}`)}v.push(`   Stored rule customizations: ${l.effectiveSafety.ruleCounts.stored}`),v.push(`   Effective rule customizations: ${l.effectiveSafety.ruleCounts.effective}`);for(let[k,F]of Object.entries(l.effectiveSafety.ruleOverrides))v.push(`   ${k}: ${F}`);return v.join(`
`)}function Rs(l){let f=["Findings"];if(l.length===0)return f.push("   No findings from inspected doctor facts."),f.join(`
`);for(let v of l){let b=`[${v.severity.toUpperCase()}] ${v.checkId}: ${jt(v.title)}`,k=v.severity==="error"?Je.red:v.severity==="warning"?Je.yellow:Je.blue;if(f.push(`   ${k(b)}`),f.push(`      ${jt(v.detail)}`),v.path)f.push(`      Path: ${jt(v.path)}`);if(v.fixHint)f.push(`      Fix: ${jt(v.fixHint)}`)}return f.join(`
`)}function gp(l){let f=["Variable","Status","Legacy"],v=l.map((b)=>{let k=b.isSet?Je.green("✓"):Je.dim("✗"),F=b.legacyName&&b.legacyIsSet?`${b.legacyName} ${Je.green("✓")}`:b.legacyName??"";return[b.name,k,F]});return un({headers:f,rows:v})}function Ps(l){let f=[];if(l.totalBlocked===0)f.push("Recent Activity"),f.push("   No blocked commands in the last 7 days"),f.push("   Tip: This is normal for new installations");else f.push(`Recent Activity · last 7 days (${l.totalBlocked} blocked / ${l.sessionCount} sessions)`),f.push(hp(l.recentEntries));if(l.unreadable>0)f.push(`   Warning: ${l.unreadable} audit log ${l.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return f.join(`
`)}function hp(l){let f=["Time","Command"],v=l.map((b)=>{let k=jt(b.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),F=k.length>40?`${k.slice(0,37)}...`:k;return[b.relativeTime,F]});return un({headers:f,rows:v})}function Es(l){let f=[];if(f.push("Update Check"),l.latestVersion===null&&!l.error)return f.push(yr([["Status",Je.dim("Skipped")],["Installed",l.currentVersion]])),f.join(`
`);if(l.error)return f.push(yr([["Status",`${Je.yellow("⚠")} Error`],["Installed",l.currentVersion],["Error",Je.dim(l.error)]])),f.join(`
`);if(l.updateAvailable)return f.push(yr([["Status",`${Je.yellow("⚠")} Update Available`],["Current",l.currentVersion],["Latest",Je.green(l.latestVersion??"")]])),f.push(""),f.push("   Run: bunx cc-safety-net@latest doctor"),f.push("   Or:  npx cc-safety-net@latest doctor"),f.join(`
`);return f.push(yr([["Status",`${Je.green("✓")} Up to date`],["Version",l.currentVersion]])),f.join(`
`)}function yr(l){return un({rows:l})}function Ds(l){let f=[];return f.push("System Info"),f.push(yp(l)),f.join(`
`)}function yp(l){let f=["Component","Version"],v=(F)=>{if(F===null)return Je.dim("not found");return F},k=[{label:"cc-safety-net",value:l.version},...ut.map((F)=>({label:p(F),value:l.versions[F]??null})),{label:"Node.js",value:l.nodeVersion},{label:"npm",value:l.npmVersion},{label:"Bun",value:l.bunVersion},{label:"Platform",value:l.platform}].map((F)=>[F.label,v(F.value)]);return un({headers:f,rows:k})}function As(l){if(l.findings.length===0)return Je.green(`
No findings from inspected doctor facts.`);let f={error:l.findings.filter((F)=>F.severity==="error").length,warning:l.findings.filter((F)=>F.severity==="warning").length,info:l.findings.filter((F)=>F.severity==="info").length},v=["error","warning","info"].filter((F)=>f[F]>0).map((F)=>`${f[F]} ${F}`),b=l.findings.length===1?"finding":"findings",k=`
${l.findings.length} ${b}: ${v.join(", ")}.`;if(f.error>0)return Je.red(k);if(f.warning>0)return Je.yellow(k);return Je.blue(k)}import{lstatSync as vp}from"node:fs";import{dirname as Lo}from"node:path";function wo(l,f){try{let v=vp(f);if(v.isSymbolicLink())return{kind:l,path:f,status:"unsafe",issues:["symlink"]};if(!v.isDirectory())return{kind:l,path:f,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:l,path:f,status:"unknown",issues:[]};let b=[...v.uid!==process.getuid()?["ownership"]:[],...(v.mode&18)!==0?["permissions"]:[]];return{kind:l,path:f,status:b.length>0?"unsafe":"safe",issues:b}}catch(v){if(typeof v==="object"&&v!==null&&"code"in v&&v.code==="ENOENT")return{kind:l,path:f,status:"not-applicable",issues:[]};return{kind:l,path:f,status:"unknown",issues:[]}}}function _s(l,f){let v=Y(l);return{directories:[wo("policy",Lo(Lo(f))),wo("config",Lo(f)),...v?[wo("audit",v)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as bp}from"node:child_process";import{existsSync as $s}from"node:fs";import{delimiter as Lp,extname as wp,join as kp}from"node:path";import{stripVTControlCharacters as Ts}from"node:util";var Os="2.3.4",xp=5000,Sp="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function It(){return Os}function ko(l,f){let v=l[f];if(v)return v;let b=Object.keys(l).find((k)=>k.toLowerCase()===f.toLowerCase()&&!!l[k]);return b?l[b]:v}function Cp(l){return(ko(l,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((f)=>f.length>0)}function Rp(l,f){let v=wp(l)?[l]:[...Cp(f).map((b)=>`${l}${b}`),l];if(l.includes("/")||l.includes("\\"))return v.find((b)=>$s(b))??l;return(ko(f,"PATH")??"").split(Lp).flatMap((b)=>v.map((k)=>kp(b,k))).find((b)=>$s(b))??l}function Is(l){if(!/[\s"&|<>^]/.test(l))return l;return`"${l.replace(/"/g,'""')}"`}function pn(l,f){let[v,...b]=l,k=f[Sp]==="win32"?"win32":process.platform;if(!v||k!=="win32")return{cmd:v??"",args:b};let F=Rp(v,f);if(!/\.(?:bat|cmd)$/i.test(F))return{cmd:F,args:b};return{cmd:ko(f,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",Is(F),...b.map(Is)].join(" ")]}}var Rn=async(l,f=xp)=>{let v=await Pp(l,{timeoutMs:f});if(v.code!==0)return null;return Ts(v.stdout).trim()||Ts(v.stderr).trim()||null};function Pp(l,f){let[v,...b]=l;if(!v)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((k)=>{try{let F=pn([v,...b],process.env),G=bp(F.cmd,F.args,{stdio:["ignore","pipe","pipe"]}),z=!1,J="",se="";G.stdout.on("data",(be)=>{J+=be.toString()}),G.stderr.on("data",(be)=>{se+=be.toString()});let ae=(be)=>{if(z)return;z=!0,clearTimeout(le),k(be)},le=setTimeout(()=>{G.kill(),ae({code:null,stdout:J,stderr:se})},f.timeoutMs);G.on("close",(be)=>{ae({code:be,stdout:J,stderr:se})}),G.on("error",()=>{ae({code:null,stdout:J,stderr:se})})}catch{k({code:null,stdout:"",stderr:""})}})}function vr(l){if(!l)return null;let f=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(l);if(f)return f[1]??null;let v=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(l);if(v)return v[1]??null;return l.split(`
`)[0]?.trim()||null}async function Un(l=Rn){let[f,v,b,k,F,G]=await Promise.all([Promise.all(B.map(async(z)=>[z.id,vr(await l([...z.probeCommand]))])),l(["codex","plugin","list"],30000),l(["amp","plugins","list"],30000),l(["node","--version"]),l(["npm","--version"]),l(["bun","--version"])]);return{version:Os,versions:Object.fromEntries(f),codexPluginListOutput:v,ampPluginListOutput:b,nodeVersion:vr(k),npmVersion:vr(F),bunVersion:vr(G),platform:`${process.platform} ${process.arch}`}}function xo(l,f){if(f==="dev")return!1;let v=l.split(".").map(Number),b=f.split(".").map(Number),[k=0,F=0,G=0]=v,[z=0,J=0,se=0]=b;if(k!==z)return k>z;if(F!==J)return F>J;return G>se}async function on(){let l=It(),f=new AbortController,v=setTimeout(()=>f.abort(),3000);try{let b=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:f.signal});if(!b.ok)return{currentVersion:l,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${b.status}`};let k=await b.json(),F=xo(k.version,l);return{currentVersion:l,latestVersion:k.version,updateAvailable:F}}catch(b){return{currentVersion:l,latestVersion:null,updateAvailable:!1,error:b instanceof Error?b.message:"Network error"}}finally{clearTimeout(v)}}import*as Bs from"node:readline";var Ms=(l)=>`\x1B[${l}B`,Ep=(l)=>`\x1B[${l}A`;var js=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function Dp(l){return new Promise((f)=>setTimeout(f,l))}function Ap(l,f,v){if(!v)return f(l);if(v.aborted)return Promise.resolve();return new Promise((b,k)=>{let F=()=>v.removeEventListener("abort",G),G=()=>{F(),b()};v.addEventListener("abort",G,{once:!0}),f(l).then(()=>{F(),b()},(z)=>{F(),k(z)})})}function Gn(l,f){return l&&l>0?l:f}function br(l){return Math.max(0,Math.min(1,l))}function Pn(l){return Math.max(0,Math.min(255,Math.round(l)))}function So(l){return l<=0.0031308?12.92*l:1.055*l**0.4166666666666667-0.055}function _p(l,f,v){let b=v*Math.PI/180,k=f*Math.cos(b),F=f*Math.sin(b),G=(l+0.3963377774*k+0.2158037573*F)**3,z=(l-0.1055613458*k-0.0638541728*F)**3,J=(l-0.0894841775*k-1.291485548*F)**3;return{blue:Pn(So(br(-0.0041960863*G-0.7034186147*z+1.707614701*J))*255),green:Pn(So(br(-1.2684380046*G+2.6097574011*z-0.3413193965*J))*255),red:Pn(So(br(4.0767416621*G-3.3077115913*z+0.2309699292*J))*255)}}function Co(l,f){let v=(f*l*180/Math.PI%360+360)%360;return _p(0.72,0.15,v)}function Hs(l,f=0.1){let v=Co(f,l);return`\x1B[38;2;${v.red};${v.green};${v.blue}m`}function $p(l,f){return{blue:Pn(l.blue+(255-l.blue)*f),green:Pn(l.green+(255-l.green)*f),red:Pn(l.red+(255-l.red)*f)}}function Us(l,f,v){let b=Math.imul(l+2654435769,2246822507)^Math.imul(f+3266489909,668265263)^Math.imul(v+374761393,2654435761),k=b^b>>>15,F=Math.imul(k,739982445),G=F^F>>>12,z=Math.imul(G,695872825);return((z^z>>>15)>>>0)/4294967296}function Tp(l,f,v){let b=Math.floor(Us(l,f,v)*js.length);return js[b]??"░"}function Fs(l){let f=br(l);return f*f*f*(f*(f*6-15)+10)}function Ip(l){if(l.length===0)return"";let f=[],v=!1,b="";for(let k of l){let F=`${k.red};${k.green};${k.blue}`;if(k.bold!==v)f.push(k.bold?"\x1B[1m":"\x1B[22m"),v=k.bold;if(F!==b)f.push(`\x1B[38;2;${F}m`),b=F;f.push(k.character)}return`${f.join("")}\x1B[22m\x1B[39m`}function Op(l,f,v,b,k){return l.map((F,G)=>({...Co(v,b+f+G/k),bold:!1,character:F}))}function jp(l,f,v,b,k,F,G,z){let J=Math.max(1,b*0.75),se=Math.min(1,v/J),ae=k*Fs(se),le=Math.max(0,(v-J)/Math.max(1,b-J)),be=(1-Fs(v/b))*z*2,ye=0.35*Math.max(0,1-le*2),de=se>=1,ce=Math.min(l.length,Math.ceil(ae+2+1));return l.slice(0,ce).map((we,Ze)=>{let Me=Co(F,G+f+Ze/z+be),Ee=Ze+Us(f,Ze,7919)*2-1;if(Ee>ae+2)return{...Me,bold:!1,character:" "};let ht=ae-Ee,Xe=0.8*Math.exp(-(ht*ht)/12.5),At=Math.min(0.9,Xe+ye),cn=!de&&Ee>ae-4;return{...$p(Me,At),bold:At>0.3,character:cn?Tp(f,Ze,v):we}})}function Ns(l){return`\x1B[?2026h${l.map((f,v)=>`\x1B8${v>0?Ms(v):""}${Ip(f)}`).join("")}\x1B[?2026l`}async function Ro(l,f={}){if(!l)return;let v=f.output??process.stdout,b=f.sleep??Dp,k=Gn(f.frequency,0.1),F=f.seed??0,G=Gn(f.speed,40),z=Gn(f.spread,3),J=Gn(f.frameRate,60),se=Math.max(1,Math.floor(Gn(f.duration,12))),ae=l.split(`
`).map((ce)=>Array.from(ce)),le=Math.max(...ae.map((ce)=>ce.length)),be=1000*se*ae.filter((ce)=>ce.length>0).length/G,ye=le>0?Math.max(1,Math.ceil(be/(1000/J))):0,de=ye>0?be/ye:0;v.write(`\x1B[?25l${ae.length>1?`${`
`.repeat(ae.length-1)}${Ep(ae.length-1)}`:""}\x1B7`);try{for(let ce=1;ce<=ye;ce+=1){if(f.signal?.aborted)break;v.write(Ns(ae.map((we,Ze)=>jp(we,Ze,ce,ye,le,k,F,z)))),await Ap(de,b,f.signal)}}finally{if(v.write(Ns(ae.map((ce,we)=>Op(ce,we,k,F,z)))),v.write("\x1B8"),ae.length>1)v.write(Ms(ae.length-1));v.write(`
\x1B[0m\x1B[?25h`)}}var Gs=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function Fp(l){return Boolean(l.isTTY)}async function Bn(l={}){let f=l.output??process.stdout;if(!Fp(f))return;let v=l.input??process.stdin,b={duration:l.duration,frequency:l.frequency,output:f,seed:l.seed??Math.random()*8192,sleep:l.sleep,speed:l.speed,spread:l.spread};if(!v.isTTY||typeof v.setRawMode!=="function"){await Ro(Gs,b);return}let k=new AbortController,F=v.readableFlowing===!0,G=v.isRaw===!0,z=!1,J=(se,ae)=>{if(ae.ctrl&&ae.name==="c")z=!0;if(z||ae.name==="return"||ae.name==="enter")k.abort()};Bs.emitKeypressEvents(v),v.on("keypress",J),v.setRawMode(!0),v.resume();try{await Ro(Gs,{...b,signal:k.signal})}finally{if(v.off("keypress",J),v.setRawMode(G),!F)v.pause()}if(!z)return;if(l.onInterrupt){l.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as Gp}from"node:crypto";import{existsSync as zs}from"node:fs";import{dirname as Lr,join as Js}from"node:path";import{dirname as qs,join as Np,resolve as Mp}from"node:path";var Hp="rule.lock";function Up(l){return Np(qs(l),Hp)}function Vs(l={}){return Mp(l.cwd??process.cwd(),".safety-net.json")}function Mt(l,f){let v=f.global?f.userConfigPath??W(l,f):f.projectConfigPath??H(f.cwd??process.cwd()),b=f.global?yt(l,f):vt(v,f.cwd??process.cwd()),k=Up(v);return{configDir:qs(v),configPath:v,lockPath:k,filesystemScope:b,configTarget:s(b,v),lockTarget:s(b,k)}}var Bp="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",qp="cache",Vp="rulebooks";function Ws(l,f={}){let v=Mt(l,f),b=s(v.filesystemScope,Ys(v.configDir)),k=o(v.lockTarget);if(console.log(Bp),k===null&&!zs(b.path))return console.log(`No v2 lock or cache leftovers found in ${Lr(v.configDir)}; nothing to migrate.`),0;let F=Yp(k),G=w(v.configTarget);if(!G.config&&(o(v.configTarget)!==null||F.size>0))return console.error(`Cannot migrate: the rules config in ${Lr(v.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let z=G.config?.rules??[];for(let J of z.flatMap((se)=>zp(se,F,v,b,f.global===!0)))console.log(J);return Z(v.lockTarget),Lt(b),console.log(`Removed the v2 lock and cache under ${Lr(v.configDir)}.`),0}function Ks(l,f){return[...new Set([{cwd:f},{cwd:f,global:!0}].flatMap((v)=>{let b=Mt(l,v);return[b.lockPath,Ys(b.configDir)]}))].filter((v)=>zs(v))}function zp(l,f,v,b,k){if(!T(l))return[];let F=q(l).name,G=s(v.filesystemScope,K(v.configDir,F)),z=o(G);if(z!==null&&Jp(z,F))return[];let J=f.get(l),se=J?Wp(J,F,b.path,v.filesystemScope):null;if(se===null)return[`Could not migrate ${l} from the v2 cache. Run \`cc-safety-net rule update ${l}${k?" --global":""}\` to vendor it.`];if(x(G,se),z!==null)return[`Restored ${l} from the v2 cache over an invalid file.`];return[`Vendored ${l} from the v2 cache.`]}function Jp(l,f){let v=Ie(l);return!("problem"in v)&&v.rulebook.name===f}function Wp(l,f,v,b){let k=Js(v,Vp,`${Kp(l)}--${l.digest.replace("sha256:","").slice(0,12)}`,Pe),F=o(s(b,k));if(F===null||Qp(F)!==l.digest)return null;let G=Ie(F);if("problem"in G||G.rulebook.name!==f)return null;return F}function Ys(l){return Js(Lr(l),qp)}function Kp(l){return([l.owner,l.repo,l.display_ref,l.name].every((b)=>typeof b==="string"&&b!=="")?`${l.owner}/${l.repo}#${l.display_ref}/${l.name}`:l.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function Yp(l){let f=l===null?null:Xp(l),v=Zs(f)&&Array.isArray(f.rulebooks)?f.rulebooks:[];return new Map(v.filter(Zp).map((b)=>[b.spec,b]))}function Zp(l){return Zs(l)&&typeof l.spec==="string"&&typeof l.digest==="string"}function Zs(l){return!!l&&typeof l==="object"}function Xp(l){try{return JSON.parse(l)}catch{return null}}function Qp(l){return`sha256:${Gp("sha256").update(l).digest("hex")}`}var Xs="\r\x1B[2K",e2="\x1B[?25l",t2="\x1B[39m",n2="\x1B[?25h",r2=100,o2=0.55,i2=80,Qs=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function s2(l){return new Promise((f)=>setTimeout(f,l))}async function wr(l,f={}){let v=f.output??process.stdout;if(!v.isTTY)return l;let b=f.sleep??s2,k=!1,F=l.then((z)=>(k=!0,z),(z)=>{throw k=!0,z});if(await Promise.race([F.then(()=>!0),b(r2).then(()=>!1)]))return F;v.write(e2);try{for(let z=0;!k;z+=1)v.write(`${Xs}${Hs(z*o2)}${Qs[z%Qs.length]}${t2} ${f.loadingMessage??"Loading…"}`),await Promise.race([F,b(i2)]);return await F}finally{v.write(`${Xs}${n2}`)}}async function qn(l,f,v,b={}){let k=f();if(l)await v();if(l&&k.ready)await wr(k.ready,b);return k.finish()}import{stripVTControlCharacters as a2}from"node:util";var kr="amp plugins list",l2=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function ea(l){if(!l.ampPluginListOutput)return{platform:"amp",status:"n/a"};let f=a2(l.ampPluginListOutput).split(`
`).map((v)=>l2.exec(v)?.[1]).find((v)=>v!==void 0);if(!f)return{platform:"amp",status:"n/a"};if(f!=="active")return{platform:"amp",status:"disabled",method:kr,configPath:kr,errors:[`Amp personal plugin cc-safety-net is ${f}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:kr,configPath:kr}}import{existsSync as c2,readFileSync as d2}from"node:fs";var u2=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function p2(l){if(!l||typeof l!=="object"||Array.isArray(l))return[];return Object.values(l).flatMap((f)=>{if(!f||typeof f!=="object"||Array.isArray(f))return[];let v=f,b=v.PreToolUse;if(!Array.isArray(b))return[];return b.flatMap((k)=>{if(!k||typeof k!=="object"||Array.isArray(k))return[];let F=k.hooks;if(!Array.isArray(F))return[];return F.flatMap((G)=>{if(!G||typeof G!=="object"||Array.isArray(G))return[];let z=G.command;if(typeof z!=="string"||!u2.test(z))return[];return[{command:z,enabled:v.enabled!==!1}]})})})}function ta(l){let f=Ke(l.environment.home);if(!c2(f))return{platform:"antigravity-cli",status:"n/a",configPath:f};let v;try{v=p2(JSON.parse(d2(f,"utf-8")))}catch(b){return{platform:"antigravity-cli",status:"n/a",configPath:f,errors:[`Failed to parse Antigravity hooks config ${f}: ${b instanceof Error?b.message:String(b)}`]}}if(v.some((b)=>b.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:f};if(v.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:f};return{platform:"antigravity-cli",status:"n/a",configPath:f}}import{join as na}from"node:path";import{existsSync as f2,lstatSync as m2,readFileSync as g2}from"node:fs";function Wt(l,f=(v)=>v){if(!f2(l))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(f(g2(l,"utf-8")))}}catch{return{kind:"unreadable"}}}function Tt(l){try{return m2(l)}catch{return}}function xr(l,f){let v=Tt(f);if(!v)return{platform:l,status:"n/a",configPath:f};if(!v.isSymbolicLink()&&v.isDirectory())return;return{platform:l,status:"n/a",configPath:f,errors:[`${f} is a symlink or not a directory; move or remove it before installing`]}}function ot(l,f){return typeof l==="object"&&l!==null?l[f]:void 0}var Po="cc-safety-net@cc-marketplace";function ra(l){return na(l.home,".claude","plugins","installed_plugins.json")}function oa(l,f){let v=ot(ot(l,"plugins"),f);return Array.isArray(v)&&v.length>0}function Sr(l,f){let v=Wt(ra(l));return v.kind==="ok"&&oa(v.value,f)}function Eo(l){let f=ra(l),v=Wt(f);if(v.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(v.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!oa(v.value,Po))return{platform:"claude-code",status:"n/a"};let b=na(l.home,".claude","settings.json"),k=Wt(b);if(k.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(k.kind==="ok"&&ot(ot(k.value,"enabledPlugins"),Po)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:b,errors:[`${Po} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:f}}function ia(l){return Eo(l.environment)}function sa(l){if(!l.codexPluginListOutput)return{platform:"codex",status:"n/a"};let f=l.codexPluginListOutput.split(`
`).find((v)=>v.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!f)return{platform:"codex",status:"n/a"};if(!f.includes("installed,"))return{platform:"codex",status:"n/a"};if(!f.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list"}}import{existsSync as Ar,readdirSync as h2,readFileSync as y2}from"node:fs";import{join as Ft}from"node:path";function Ut(l){let f="",v=0,b=!1,k=!1,F=-1;while(v<l.length){let G=l[v],z=l[v+1];if(k){f+=G,k=!1,v++;continue}if(G==='"'&&!b){b=!0,F=-1,f+=G,v++;continue}if(G==='"'&&b){b=!1,f+=G,v++;continue}if(G==="\\"&&b){k=!0,f+=G,v++;continue}if(b){f+=G,v++;continue}if(G==="/"&&z==="/"){while(v<l.length&&l[v]!==`
`)v++;continue}if(G==="/"&&z==="*"){v+=2;while(v<l.length-1){if(l[v]==="*"&&l[v+1]==="/"){v+=2;break}v++}continue}if(G===","){F=f.length,f+=G,v++;continue}if(G==="}"||G==="]"){if(F!==-1){let J=f.slice(F+1);if(/^\s*$/.test(J))f=f.slice(0,F)+J}F=-1,f+=G,v++;continue}if(!/\s/.test(G))F=-1;f+=G,v++}return f}function Do(l,f,v){let b=f+1,k=!1;while(b<l.length){if(k){k=!1,b++;continue}if(l[b]==="\\"){k=!0,b++;continue}if(l[b]==='"')return b+1;b++}throw Error(v)}function Ao(l,f,v){let b=l[f],k=b==="["?"]":"}",F=0,G=f;while(G<l.length){let z=v.skipComment?.(l,G)??G;if(z!==G){G=z;continue}if(l[G]==='"'){G=Do(l,G,v.stringError);continue}if(l[G]===b)F++;if(l[G]===k){if(F--,F===0)return G}G++}throw Error(v.bracketError)}function la(l,f){let v=l.lastIndexOf(`
`,f)+1;return/^[ \t]*/.exec(l.slice(v))?.[0]??""}function Rr(l,f){let v=f.end+(/^\s*/.exec(l.slice(f.end))?.[0].length??0);if(l[v]===","){let G=l[v+1]===`
`?v+2:v+1;return`${l.slice(0,f.start)}${l.slice(G)}`}let b=l.slice(0,f.start).search(/\s*$/)-1;if(l[b]!==",")return`${l.slice(0,f.start)}${l.slice(f.end)}`;let k=l.lastIndexOf(`
`,b-1),F=k!==-1&&/^\s*$/.test(l.slice(k+1,b))?k:b;return`${l.slice(0,F)}${l.slice(f.end)}`}function Cr(l,f){if(l.startsWith("//",f)){let v=l.indexOf(`
`,f+2);return v===-1?l.length:v+1}if(l.startsWith("/*",f)){let v=l.indexOf("*/",f+2);return v===-1?l.length:v+2}return f}function aa(l,f){let v=f;while(v<l.length){if(/\s/.test(l[v]??"")){v++;continue}let b=Cr(l,v);if(b===v)return v;v=b}return v}function ca(l,f,v){let b=0,k=0;while(k<l.length){let F=Cr(l,k);if(F!==k){k=F;continue}if(l[k]==='"'){let G=Do(l,k,v.stringError);if(b===1&&JSON.parse(l.slice(k,G))===f){let z=aa(l,G),J=aa(l,z+1);if(l[z]===":"&&l[J]==="[")return{start:J,end:Ao(l,J,{skipComment:Cr,...v})}}k=G;continue}if(l[k]==="{"||l[k]==="[")b++;if(l[k]==="}"||l[k]==="]")b--;k++}return}function da(l,f,v){let b=[],k=f.start+1;while(k<f.end){let F=Cr(l,k);if(F!==k){k=F;continue}if(l[k]==='"'){let G=Do(l,k,v),z=JSON.parse(l.slice(k,G));if(typeof z==="string")b.push({range:{start:k,end:G},value:z});k=G;continue}k++}return b}var Kt="cc-safety-net@cc-marketplace",Pr=["cc-marketplace","cc-safety-net"],ua=["_direct","copilot-safety-net"],pa=["cc-marketplace","safety-net"],fa="safety-net@cc-marketplace";function Er(l,f){let v=f.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${v}([^a-z0-9-]|$)`,"m").test(l??"")}function ma(l){return Er(l,"cc-safety-net@cc-marketplace")}function ga(l){return Er(l,"cc-marketplace")}function ha(l){return Er(l,"copilot-safety-net")}function ya(l){return Er(l,"safety-net@cc-marketplace")}function _o(l){if(!l?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(l)}function ba(l,f){if(!l)return null;let v=l.match(/(\d+)\.(\d+)\.(\d+)/);if(!v)return null;let b=[Number(v[1]),Number(v[2]),Number(v[3])];for(let k=0;k<f.length;k++){let F=b[k]??0,G=f[k]??0;if(F!==G)return F>G}return!0}function v2(l){return ba(l,[0,0,422])}function b2(l){return ba(l,[1,0,8])}function Vn(l){return l.env.get("COPILOT_HOME")||Ft(l.home,".copilot")}function $o(l){return(l.hooks?.preToolUse??[]).some((v)=>{if(v.type!=="command")return!1;return _o(v.command)||_o(v.bash)||_o(v.powershell)})}function Dr(l){return l===void 0||typeof l==="string"}function L2(l){if(!l||typeof l!=="object"||Array.isArray(l))return!1;let f=l;if(f.disableAllHooks!==void 0&&typeof f.disableAllHooks!=="boolean")return!1;if(f.hooks===void 0)return!0;if(!f.hooks||typeof f.hooks!=="object"||Array.isArray(f.hooks))return!1;let v=f.hooks.preToolUse;if(v===void 0)return!0;return Array.isArray(v)&&v.every((b)=>b!==null&&typeof b==="object"&&!Array.isArray(b)&&Dr(b.type)&&Dr(b.command)&&Dr(b.bash)&&Dr(b.powershell))}function To(l,f){try{let v=JSON.parse(Ut(y2(l,"utf-8")));if(!L2(v)){f?.push(`Invalid hook config ${l}: hooks.preToolUse must be an array of hook objects`);return}return v}catch(v){f?.push(`Failed to parse ${l}: ${v instanceof Error?v.message:String(v)}`);return}}function La(l,f){try{return h2(l).filter((v)=>v.endsWith(".json")).sort((v,b)=>v.localeCompare(b))}catch(v){return f?.push(`Failed to read ${l}: ${v instanceof Error?v.message:String(v)}`),[]}}function w2(l,f){if(!Ar(l))return[];let v=[];for(let b of La(l,f)){let k=Ft(l,b),F=To(k,f);if(F&&$o(F))v.push(k)}return v}function En(l,f){if(!Ar(l))return;let v=To(l,f);if(!v)return;return{path:l,config:v}}function va(l,f,v,b){if(f){l.push(`GitHub Copilot CLI ${f} does not support ${v}; requires ${b}+`);return}l.push(`GitHub Copilot CLI version unavailable; skipping ${v} because it requires ${b}+`)}function k2(l){for(let f of l){if(f?.config.disableAllHooks===!0)return f.path;if(f?.config.disableAllHooks===!1)return}return}function x2(l,f,v,b){let k=Vn(l),F=Ft(f,".github","hooks"),G=Ft(k,"hooks"),z=Ft(f,".github","copilot"),J=Ft(f,".claude"),se=b2(v),ae=se===!0?b:void 0,le=[En(Ft(z,"settings.local.json"),ae),En(Ft(z,"settings.json"),ae),En(Ft(J,"settings.local.json"),ae),En(Ft(J,"settings.json"),ae)],be=[En(Ft(k,"settings.json"),ae),En(Ft(k,"config.json"),ae)];if(se!==!1){let ht=k2([...le,...be]);if(ht){if(se===null)b.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${ht} as active`);return{activeConfigPaths:[],disabledBy:ht}}}let ye=w2(F,b),de=v2(v),ce=de===!0?b:void 0,we=Ar(G)?La(G,ce):[],Ze=[];for(let ht of we){let Xe=Ft(G,ht),At=To(Xe,ce);if(At&&$o(At))Ze.push(Xe)}if(de!==!0&&Ze.length>0)va(b,v,`user hook files in ${G}`,"0.0.422"),Ze.length=0;let Me=[];for(let ht of[...le,...be]){if(!ht)continue;if(!$o(ht.config))continue;if(se===!0){Me.push(ht);continue}va(b,v,"inline hook definitions in Copilot config files","1.0.8");break}let Ee=(ht)=>ht.filter((Xe)=>!!Xe&&Me.includes(Xe)).map((Xe)=>Xe.path);return{activeConfigPaths:[...Ee(le),...ye,...Ee(be),...Ze]}}function wa(l){let f=[],v=x2(l.environment,l.cwd,l.copilotCliVersion,f);if(v.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:v.disabledBy,configPaths:[v.disabledBy],errors:f.length>0?f:void 0};let b=Vn(l.environment),k=Ft(b,"installed-plugins",...Pr),F=Ar(k),G=Ft(b,"settings.json"),z=Wt(G,Ut);if(F&&z.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};if(F&&z.kind==="ok"&&ot(ot(z.value,"enabledPlugins"),Kt)===!1)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:G,errors:[`${Kt} is installed but not enabled in Copilot CLI`]};if(F||v.activeConfigPaths.length>0){let J=F,se=v.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:J?"plugin config":"hook config",configPath:se??(J?k:void 0),configPaths:v.activeConfigPaths.length>0?v.activeConfigPaths:void 0,errors:f.length>0?f:void 0}}return{platform:"copilot-cli",status:"n/a",errors:f.length>0?f:void 0}}import{existsSync as T2,readFileSync as I2}from"node:fs";import{existsSync as ka,mkdirSync as R2,readFileSync as P2}from"node:fs";import{dirname as E2,join as D2}from"node:path";import{renameSync as S2,writeFileSync as C2}from"node:fs";function Ot(l,f){let v=`${l}.${process.pid}.tmp`;C2(v,f),S2(v,l)}var Yt=Object.fromEntries(ke.map((l)=>[l.id,`npx -y cc-safety-net hook ${l.flags[1]}`]));var zn=Yt.cursor,xa=30;function $r(l){return D2(l.home,".cursor","hooks.json")}function fn(l){return typeof l==="object"&&l!==null&&!Array.isArray(l)}function Io(){return{command:zn,timeout:xa,failClosed:!0}}function _r(l){return fn(l)&&l.command===zn}function A2(l){return Object.keys(l).length===3&&l.command===zn&&l.timeout===xa&&l.failClosed===!0}function _2(l){try{return JSON.parse(P2(l,"utf-8"))}catch(f){if(f instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${l}: ${f.message}`);throw f}}function Sa(l){let f=_2(l);if(!fn(f))throw Error(`Cursor hooks config ${l} must be a JSON object`);if(f.version!==1)throw Error(`Cursor hooks config ${l} must set "version": 1`);if(f.hooks!==void 0&&!fn(f.hooks))throw Error(`Cursor hooks config ${l} "hooks" must be an object`);let v=fn(f.hooks)?f.hooks.preToolUse:void 0;if(v!==void 0&&!Array.isArray(v))throw Error(`Cursor hooks config ${l} "hooks.preToolUse" must be an array`);return f}function Ca(l){let f=fn(l.hooks)?l.hooks.preToolUse:void 0;return Array.isArray(f)?f:[]}function $2(l){if(!l.some(_r))return[...l,Io()];return l.reduce((f,v)=>{if(!_r(v))return f.result.push(v),f;if(!f.inserted)f.result.push(Io()),f.inserted=!0;return f},{result:[],inserted:!1}).result}function Ra(l,f,v){let b=fn(f.hooks)?f.hooks:{},k={...f,hooks:{...b,preToolUse:v}};Ot(l,`${JSON.stringify(k,null,2)}
`)}function Pa(l){let f=$r(l);if(!ka(f))return R2(E2(f),{recursive:!0}),Ot(f,`${JSON.stringify({version:1,hooks:{preToolUse:[Io()]}},null,2)}
`),{path:f,alreadyInstalled:!1};let v=Sa(f),b=Ca(v),k=b.filter(_r);if(fn(v.hooks)&&Array.isArray(v.hooks.preToolUse)&&k.length===1&&k[0]!==void 0&&A2(k[0]))return{path:f,alreadyInstalled:!0};return Ra(f,v,$2(b)),{path:f,alreadyInstalled:!1}}function Ea(l){let f=$r(l);if(!ka(f))return{path:f,alreadyInstalled:!1};let v=Sa(f),b=Ca(v),k=b.filter((F)=>!_r(F));if(k.length===b.length)return{path:f,alreadyInstalled:!1};return Ra(f,v,k),{path:f,alreadyInstalled:!0}}function O2(l){if(!l||typeof l!=="object"||Array.isArray(l))return[];let f=l.hooks;if(!f||typeof f!=="object"||Array.isArray(f))return[];let v=f.preToolUse;if(!Array.isArray(v))return[];return v.filter((b)=>!!b&&typeof b==="object"&&!Array.isArray(b)&&b.command===zn)}function j2(l){let f=[];if(l.length>1)f.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let v=l[0];if(v&&v.failClosed!==!0)f.push('Managed hook is missing "failClosed": true; reinstall to repair');if(v&&v.timeout!==30)f.push('Managed hook "timeout" is not 30; reinstall to repair');return f}function Da(l){let f=$r(l.environment);if(!T2(f))return{platform:"cursor",status:"n/a",configPath:f};let v;try{v=JSON.parse(I2(f,"utf-8"))}catch(F){return{platform:"cursor",status:"n/a",configPath:f,errors:[`Failed to parse Cursor hooks config ${f}: ${F instanceof Error?F.message:String(F)}`]}}let b=O2(v);if(b.length===0)return{platform:"cursor",status:"n/a",configPath:f};let k=j2(b);return{platform:"cursor",status:"configured",method:"hook config",configPath:f,errors:k.length>0?k:void 0}}import{existsSync as F2}from"node:fs";import{join as Oo}from"node:path";var jo="gemini-safety-net";function Fo(l){let f=Oo(l.home,".gemini","extensions"),v=Oo(f,jo);if(!F2(v))return{platform:"gemini-cli",status:"n/a"};let b=Oo(f,"extension-enablement.json"),k=Wt(b);if(k.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let F=k.kind==="ok"?ot(ot(k.value,jo),"overrides"):void 0;if(Array.isArray(F)&&F.some((z)=>typeof z==="string"&&z.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:b,errors:[`${jo} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:v}}function Aa(l){return Fo(l.environment)}import{existsSync as U2,readFileSync as G2}from"node:fs";import{existsSync as $a,mkdirSync as N2,readFileSync as Ta,rmSync as M2}from"node:fs";import{dirname as H2,join as _a}from"node:path";var Jn=Yt["grok-build"],Or=30;function jr(l){return _a(l.env.get("GROK_HOME")??_a(l.home,".grok"),"hooks","cc-safety-net.json")}function mn(l){return typeof l==="object"&&l!==null&&!Array.isArray(l)}function Tr(){return{hooks:[{type:"command",command:Jn,timeout:Or}]}}function Ia(l){return mn(l)&&l.command===Jn}function Oa(l){return l.flatMap((f)=>{if(!mn(f)||!Array.isArray(f.hooks))return[f];let v=f.hooks.filter((b)=>!Ia(b));if(v.length===f.hooks.length)return[f];return v.length===0?[]:[{...f,hooks:v}]})}function ja(l){try{let f=JSON.parse(l);return mn(f)?f:null}catch{return null}}function Fa(l){let f=mn(l.hooks)?l.hooks.PreToolUse:void 0;return Array.isArray(f)?f:[]}function Ir(l,f,v){let b=mn(f.hooks)?f.hooks:{};Ot(l,`${JSON.stringify({...f,hooks:{...b,PreToolUse:v}},null,2)}
`)}function Na(l){let f=jr(l);if(!$a(f))return N2(H2(f),{recursive:!0}),Ir(f,{},[Tr()]),{path:f,alreadyInstalled:!1};let v=ja(Ta(f,"utf-8"));if(!v)return Ir(f,{},[Tr()]),{path:f,alreadyInstalled:!1};let b=Fa(v),k=b.filter((F)=>mn(F)&&Array.isArray(F.hooks)&&F.hooks.some(Ia));if(k.length===1&&JSON.stringify(k[0])===JSON.stringify(Tr()))return{path:f,alreadyInstalled:!0};return Ir(f,v,[...Oa(b),Tr()]),{path:f,alreadyInstalled:!1}}function Ma(l){let f=jr(l);if(!$a(f))return{path:f,alreadyInstalled:!1};let v=ja(Ta(f,"utf-8"));if(!v)return{path:f,alreadyInstalled:!1};let b=Fa(v),k=Oa(b);if(JSON.stringify(k)===JSON.stringify(b))return{path:f,alreadyInstalled:!1};let F=mn(v.hooks)?v.hooks:{};if(k.length===0&&Object.keys(v).length===1&&Object.keys(F).length===1)return M2(f),{path:f,alreadyInstalled:!0};return Ir(f,v,k),{path:f,alreadyInstalled:!0}}function Wn(l){return!!l&&typeof l==="object"&&!Array.isArray(l)}function B2(l){if(!Wn(l)||!Wn(l.hooks))return[];let f=l.hooks.PreToolUse;if(!Array.isArray(f))return[];return f.filter((v)=>Wn(v)&&Array.isArray(v.hooks)&&v.hooks.some((b)=>Wn(b)&&b.command===Jn))}function q2(l){let v=(Array.isArray(l.hooks)?l.hooks.filter(Wn):[]).find((b)=>b.command===Jn);return[...l.matcher===void 0||l.matcher===""||l.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...v?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...v?.timeout===Or?[]:[`Managed hook "timeout" is not ${Or}; reinstall to repair`]]}function Ha(l){let f=jr(l.environment);if(!U2(f))return{platform:"grok-build",status:"n/a",configPath:f};let v;try{v=JSON.parse(G2(f,"utf-8"))}catch(F){return{platform:"grok-build",status:"n/a",configPath:f,errors:[`Failed to parse Grok Build hooks config ${f}: ${F instanceof Error?F.message:String(F)}`]}}let b=B2(v)[0];if(!b)return{platform:"grok-build",status:"n/a",configPath:f};let k=q2(b);return{platform:"grok-build",status:"configured",method:"hook config",configPath:f,errors:k.length>0?k:void 0}}import{readFileSync as Wa}from"node:fs";import{join as Ka}from"node:path";var Gt="cc-safety-net",No="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",V2=30;function Ua(l){return`${No}
# version: ${l}
`}function z2(l){return`${Ua(l)}name: ${Gt}
version: "${l}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function J2(l){return`${Ua(l)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${Yt["hermes-agent"].split(" ").map((f)=>`"${f}"`).join(", ")}]
TIMEOUT_SECONDS = ${V2}


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
`}function Kn(l){return[{name:"__init__.py",content:J2(l)},{name:"plugin.yaml",content:z2(l)}]}import{mkdirSync as W2,readdirSync as K2,readFileSync as Y2,rmSync as Mo}from"node:fs";import{join as gn}from"node:path";var Z2="__pycache__";function Ho(l){let f=l.env.get("HERMES_HOME")?.trim();return f?f:gn(l.home,".hermes")}function Uo(l){return gn(Ho(l),"plugins",Gt)}function Go(l){return l.startsWith(No)}function Bo(l,f){let v=Uo(l),b=Tt(v);if(b&&(b.isSymbolicLink()||!b.isDirectory()))throw Error(`Refusing to ${f} ${v}: not a regular directory. Move or remove it and rerun ${f==="install"?"install":"uninstall"} --hermes-agent.`);return v}function Ga(l,f){let v=Tt(l);if(!v)return;if(v.isSymbolicLink()||!v.isFile())throw Error(`Refusing to ${f} ${l}: not a regular file. Move or remove it.`);let b=Y2(l,"utf-8");if(!Go(b))throw Error(`Refusing to ${f} unmanaged file at ${l}. Move or remove it.`);return b}function Ba(l){let f=Bo(l,"install"),v=Kn(It());if(v.map((k)=>Ga(gn(f,k.name),"overwrite")).every((k,F)=>k===v[F]?.content))return{path:f,alreadyInstalled:!0};return W2(f,{recursive:!0}),v.forEach((k)=>{Ot(gn(f,k.name),k.content)}),{path:f,alreadyInstalled:!1}}function qo(l){let f=Bo(l,"remove");if(!Tt(f))return[];return Kn(It()).filter((v)=>Ga(gn(f,v.name),"remove")!==void 0)}function qa(l){let f=Bo(l,"remove");if(!Tt(f))return{path:f,alreadyInstalled:!1};let v=qo(l);if(v.forEach((b)=>{Mo(gn(f,b.name))}),Mo(gn(f,Z2),{recursive:!0,force:!0}),K2(f).length===0)Mo(f,{recursive:!0});return{path:f,alreadyInstalled:v.length>0}}var Fr="hermes-agent",Va=/^([^\s#][^:]*):/,X2=/^\s+([A-Za-z_][\w-]*):/,za=/^\s+-\s*(.*)$/;function Q2(l){return l.trim().replace(/^(["'])(.*)\1$/,"$2")}function ef(l){let f=l.split(/\r?\n/),v=f.findIndex((F)=>Va.exec(F)?.[1]?.trim()==="plugins");if(v===-1)return[];let b=f.slice(v+1),k=b.findIndex((F)=>Va.test(F));return k===-1?b:b.slice(0,k)}function Ja(l,f){let v=ef(l),b=v.findIndex((G)=>X2.exec(G)?.[1]===f);if(b===-1)return[];let k=v.slice(b+1),F=k.findIndex((G)=>!za.test(G));return(F===-1?k:k.slice(0,F)).map((G)=>Q2(za.exec(G)?.[1]??""))}function tf(l){try{return Wa(Ka(Ho(l),"config.yaml"),"utf-8")}catch{return}}function Vo(l){let f=tf(l)??"";return Ja(f,"enabled").includes(Gt)&&!Ja(f,"disabled").includes(Gt)}function Ya(l){return/^# version:\s*(.+)$/m.exec(l)?.[1]?.trim()}function nf(l,f){let v=Tt(l);if(!v)return{error:`${f.name} is missing from ${l}; run install --hermes-agent`};if(v.isSymbolicLink()||!v.isFile())return{error:`${l} is a symlink or not a regular file; move or remove it`};try{let b=Wa(l,"utf-8");if(!Go(b))return{error:`Unmanaged ${f.name} occupies ${l}; move or remove it`};if(Ya(b)===It()&&b!==f.content)return{error:`Modified ${f.name} occupies ${l}; run install --hermes-agent to restore it`};return{content:b}}catch(b){return{error:`Failed to read ${l}: ${b instanceof Error?b.message:String(b)}`}}}function Za(l){let f=Uo(l.environment),v=xr(Fr,f);if(v)return v;let b=Kn(It()).map((z)=>nf(Ka(f,z.name),z)),k=b.flatMap((z)=>("error"in z)?[z.error]:[]);if(k.length>0)return{platform:Fr,status:"n/a",configPath:f,errors:k};let F=b.some((z)=>("content"in z)&&Ya(z.content)!==It()),G=F?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!Vo(l.environment))return{platform:Fr,status:"disabled",method:"plugin directory",configPath:f,errors:[`${Gt} is not enabled in Hermes; run \`hermes plugins enable ${Gt}\``,...G]};return{platform:Fr,status:"configured",method:"plugin directory",configPath:f,errors:F?G:void 0}}import{existsSync as rf,readFileSync as of}from"node:fs";import{join as Xa}from"node:path";var sf=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;function af(l){return Xa(l.env.get("KIMI_CODE_HOME")||Xa(l.home,".kimi-code"),"config.toml")}function Yn(l){let f=af(l.environment);if(!rf(f))return{platform:"kimi-code",status:"n/a",configPath:f};try{if(!sf.test(of(f,"utf-8")))return{platform:"kimi-code",status:"n/a",configPath:f}}catch(v){return{platform:"kimi-code",status:"n/a",configPath:f,errors:[`Failed to read ${f}: ${v instanceof Error?v.message:String(v)}`]}}return{platform:"kimi-code",status:"configured",method:"hook config",configPath:f}}import{readFileSync as ll}from"node:fs";import{join as Xn}from"node:path";var $t="cc-safety-net",Bt="index.js",Dn="openclaw.plugin.json",An="package.json";var Nr="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as df,lstatSync as uf,readdirSync as pf,readFileSync as ff}from"node:fs";import{dirname as tl,join as sn}from"node:path";import{fileURLToPath as mf}from"node:url";import{spawn as lf}from"node:child_process";function cf(l){return l.join(" ")}function zo(l,f,v){return[`Failed to run ${cf(l)}${f===null?"":` (exit ${f})`}.`,v.trim()].filter(Boolean).join(`
`)}function Jo(l){let f={stdout:"",stderr:""};return l.stdout.setEncoding("utf-8"),l.stderr.setEncoding("utf-8"),l.stdout.on("data",(v)=>{f.stdout+=v}),l.stderr.on("data",(v)=>{f.stderr+=v}),f}function Zt(l,f){return new Promise((v,b)=>{let k=pn([...l],process.env),F=lf(k.cmd,k.args,{stdio:["ignore","pipe","pipe"]}),G=Jo(F),z=()=>[G.stdout,G.stderr].filter(Boolean).join(`
`),J=f?.timeoutMs??120000,se=setTimeout(()=>{F.kill(),b(Error(zo(l,null,`Timed out after ${J}ms.
${z()}`.trim())))},J);F.on("error",(ae)=>{clearTimeout(se),b(Error(zo(l,null,`${ae.message}
${z()}`.trim())))}),F.on("close",(ae)=>{if(clearTimeout(se),ae!==0){b(Error(zo(l,ae,z())));return}v(f?.stdoutOnly?G.stdout:z())})})}async function Wo(l){for(let f of l)await Zt(f)}async function Qa(l){for(let f of l)try{await Zt(f)}catch(v){console.warn(v instanceof Error?v.message:String(v))}}var el=sn("openclaw",$t),gf=[Bt,Dn,An];function Ko(l,f){if(l==="~")return f;if(l.startsWith("~/")||l.startsWith("~\\"))return sn(f,l.slice(2));return l}function nl(l){let f=l.env.get("OPENCLAW_STATE_DIR")?.trim();if(f)return Ko(f,l.home);let v=l.env.get("OPENCLAW_CONFIG_PATH")?.trim();return v?tl(Ko(v,l.home)):sn(l.home,".openclaw")}function rl(l){let f=l.env.get("OPENCLAW_CONFIG_PATH")?.trim();return f?Ko(f,l.home):sn(nl(l),"openclaw.json")}function Yo(l){return sn(nl(l),"extensions",$t)}function hf(l){let f=pf(l);if(f.length===0)return!0;if(f.some((k)=>!gf.includes(k)))return!1;let v=sn(l,Bt),b=Tt(v);return b!==void 0&&!b.isSymbolicLink()&&b.isFile()&&ff(v,"utf-8").startsWith(Nr)}function Zo(l){let f=Yo(l),v=Tt(f);if(!v)return;if(!v.isSymbolicLink()&&v.isDirectory()&&hf(f))return;throw Error(`Refusing to modify ${f}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function ol(){let l=tl(mf(import.meta.url));return[sn(l,"..",el),sn(l,"..","..","..","dist",el)]}function Xo(l=ol()){return l.find((f)=>df(f)&&uf(f).isDirectory())}function yf(l=ol()){let f=Xo(l);if(!f)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return f}function il(l=yf()){return[["openclaw","plugins","install",l,"--force"],["openclaw","plugins","enable",$t]]}function vf(l){let f=(()=>{try{return JSON.parse(l)}catch{return}})(),v=ot(ot(f,"plugin"),"status");return typeof v==="string"?v:void 0}async function sl(){let l=vf(await Zt(["openclaw","plugins","inspect",$t,"--runtime","--json"],{stdoutOnly:!0}));if(l==="loaded")return;throw Error(`${l===void 0?`The ${$t} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:`OpenClaw reports the ${$t} plugin with status "${l}".`} Run \`openclaw plugins inspect ${$t} --runtime\` for details.`)}var Mr="openclaw",Zn=`run \`openclaw plugins enable ${$t}\``;function _n(l,f){let v=Xn(l,f),b=Tt(v);if(!b)return{error:`${f} is missing from ${v}; run install --openclaw`};if(b.isSymbolicLink()||!b.isFile())return{error:`${v} is a symlink or not a regular file; move or remove it`};try{return{content:ll(v,"utf-8")}}catch(k){return{error:`Failed to read ${v}: ${k instanceof Error?k.message:String(k)}`}}}function cl(l){try{return JSON.parse(Ut(l))}catch{return}}function bf(l){let f=_n(l,Dn);if("error"in f)return f.error;if(ot(cl(f.content),"id")===$t)return;return`${Xn(l,Dn)} is not a valid ${$t} manifest; run install --openclaw`}function Lf(l){let f=_n(l,An);if("error"in f)return f.error;let v=ot(ot(cl(f.content),"openclaw"),"extensions");if(Array.isArray(v)&&v.includes(`./${Bt}`))return;return`${Xn(l,An)} does not point OpenClaw at ${Bt}; run install --openclaw`}function al(l){return Array.isArray(l)?l.filter((f)=>typeof f==="string"):[]}function wf(l){let f=rl(l);if(!Tt(f))return`${$t} is not enabled; ${Zn}`;let v=(()=>{try{return JSON.parse(Ut(ll(f,"utf-8")))}catch{return}})();if(v===void 0)return`Failed to read ${f}; fix it, then ${Zn}`;let b=ot(v,"plugins");if(ot(b,"enabled")===!1)return`plugins.enabled is false in ${f}; no OpenClaw plugin loads`;let k=ot(ot(ot(b,"entries"),$t),"enabled");if(al(ot(b,"deny")).includes($t)||k===!1)return`${$t} is disabled in ${f}; ${Zn}`;let F=al(ot(b,"allow"));if(F.length>0&&!F.includes($t))return`plugins.allow in ${f} does not list ${$t}; add it, then ${Zn}`;if(F.includes($t)||k===!0)return;return`${$t} is not enabled; ${Zn}`}function dl(l){return/^\/\/ version:\s*(.+)$/m.exec(l)?.[1]?.trim()}function kf(l,f,v){if(v===void 0)return[];let b=_n(v,Bt);if("error"in b||dl(b.content)!==f)return[];return[Bt,Dn,An].flatMap((k)=>{let F=_n(l,k),G=_n(v,k);if("error"in F||"error"in G||F.content===G.content)return[];return[`Modified ${k} occupies ${Xn(l,k)}; run install --openclaw to restore it`]})}function ul(l){let f=Yo(l.environment),v=xr(Mr,f);if(v)return v;let b=_n(f,Bt),F=["error"in b?b.error:b.content.startsWith(Nr)?void 0:`Unmanaged ${Bt} occupies ${Xn(f,Bt)}; move or remove it`,bf(f),Lf(f)].filter((ae)=>ae!==void 0),G="content"in b?dl(b.content):void 0,z=F.length>0?F:kf(f,G,Xo());if(z.length>0)return{platform:Mr,status:"n/a",configPath:f,errors:z};let J=G===It()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],se=wf(l.environment);if(se)return{platform:Mr,status:"disabled",method:"plugin directory",configPath:f,errors:[se,...J]};return{platform:Mr,status:"configured",method:"plugin directory",configPath:f,errors:J.length>0?J:void 0}}import{existsSync as Df,readFileSync as Af}from"node:fs";import{join as _f}from"node:path";import{existsSync as Qo,readFileSync as ml,rmSync as xf}from"node:fs";import{join as Qt}from"node:path";import{pathToFileURL as Sf}from"node:url";var Hr="cc-safety-net",gl=`${Hr}@latest`,hl=["opencode.json","opencode.jsonc"],pl="CCSafetyNetPlugin",fl={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function Ur(l){return Qt(l.env.get("XDG_CONFIG_HOME")||Qt(l.home,".config"),"opencode")}function Cf(l){return Qt(Ur(l),hl[0])}function Rf(l){return hl.map((f)=>Qt(Ur(l),f))}function yl(l){return Qt(l.env.get("XDG_CACHE_HOME")||Qt(l.home,".cache"),"opencode","packages",gl)}function ei(l){xf(yl(l),{recursive:!0,force:!0})}async function vl(l){let f=Qt(yl(l),"node_modules",Hr),v=Qt(f,"package.json");if(!Qo(v))throw Error(`The OpenCode plugin cache at ${f} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${gl}\` for details.`);let b=ot(JSON.parse(ml(v,"utf-8")),"main");if(typeof b!=="string")throw Error(`The cached OpenCode plugin at ${f} declares no "main" entry.`);let k=Qt(f,b);if(typeof(await import(Sf(k).href))[pl]==="function")return;throw Error(`The cached OpenCode plugin at ${k} does not export a callable ${pl}, so OpenCode would load nothing and fail open.`)}function bl(l,f){try{return JSON.parse(Ut(l))}catch(v){if(v instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${f}: ${v.message}`);throw v}}function Pf(l){if(!l||typeof l!=="object"||Array.isArray(l))return!1;let f=l.plugin;if(!Array.isArray(f))return!1;return f.some((v)=>typeof v==="string"&&v.includes(Hr))}function Ef(l,f){let v=ca(l,"plugin",fl);if(!v)throw Error(`Failed to locate OpenCode plugin array in ${f}`);let b=da(l,v,fl.stringError).filter((k)=>k.value.includes(Hr)).map((k)=>k.range).reverse().reduce(Rr,l);return bl(b,f),b}function Ll(l){ei(l);let f=Rf(l),v=f.find((k)=>Qo(k)),b=[];for(let k of f){if(!Qo(k))continue;try{let F=ml(k,"utf-8");if(!Pf(bl(F,k)))continue;return Ot(k,Ef(F,k)),{path:k,alreadyInstalled:!0}}catch(F){b.push(F instanceof Error?F.message:String(F))}}if(b.length>0)throw Error(b.join(`
`));return{path:v??Cf(l),alreadyInstalled:!1}}function wl(l){let f=[],v=Ur(l.environment),b=["opencode.json","opencode.jsonc"];for(let k of b){let F=_f(v,k);if(Df(F))try{let G=Af(F,"utf-8"),z=Ut(G);if((JSON.parse(z).plugin??[]).some((le)=>le.includes("cc-safety-net")))return{platform:"opencode",status:"configured",method:"plugin array",configPath:F,errors:f.length>0?f:void 0}}catch(G){f.push(`Failed to parse ${k}: ${G instanceof Error?G.message:String(G)}`)}}return{platform:"opencode",status:"n/a",errors:f.length>0?f:void 0}}import{join as $f}from"node:path";function ti(l){return $f(l.home,".pi","agent","settings.json")}function ni(l){if(typeof l!=="string")return!1;return l==="npm:cc-safety-net"||l.startsWith("npm:cc-safety-net@")}function kl(l){let f=ti(l.environment),v=Wt(f);if(v.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(v.kind==="missing")return{platform:"pi",status:"n/a"};let b=ot(v.value,"packages");if(!Array.isArray(b))return{platform:"pi",status:"n/a"};let k=b.find((z)=>ni(typeof z==="string"?z:ot(z,"source")));if(k===void 0)return{platform:"pi",status:"n/a"};let F=ot(k,"extensions");if(Array.isArray(F)&&F.some((z)=>typeof z==="string"&&z.startsWith("-")))return{platform:"pi",status:"disabled",method:"package config",configPath:f,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:f}}var Tf={amp:ea,"antigravity-cli":ta,"claude-code":ia,codex:sa,"copilot-cli":wa,cursor:Da,"gemini-cli":Aa,"grok-build":Ha,"hermes-agent":Za,"kimi-code":Yn,openclaw:ul,opencode:wl,pi:kl};function $n(l,f,v){let b={...v,cwd:f,environment:l};return ut.map((k)=>If(Tf[k](b)))}function If(l){if(l.status==="not-inspected")return{platform:l.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:l.platform,detected:l.status!=="n/a",configured:l.status==="configured",inspectionStatus:l.status!=="n/a"?"verified":l.errors&&l.errors.length>0?"failed":"not-applicable",method:l.method,configPath:l.configPath,configPaths:l.configPaths,errors:l.errors}}import{join as Of}from"node:path";var jf=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),Ff=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),safety:Object.freeze({}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),Nf={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function xl(l){let f=Of(l.tmpdir,"cc-safety-net-self-test"),v=jf.map((b)=>{let k=j(l,m("self-test",{command:b.command},{kind:"command",shell:"auto"},{configCwd:f,executionCwd:f},b.command),{guard:{dependencies:{loadPolicySnapshot:()=>Ff,getModes:()=>Nf,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),F=b.expectBlocked?"blocked":"allowed",G=k.decision.kind==="deny"?"blocked":"allowed";return{command:b.command,description:b.description,expected:F,actual:G,passed:F===G,reason:k.decision.kind==="deny"?k.decision.reason:void 0,ruleId:k.decision.kind==="deny"?k.decision.ruleId:void 0}});return{passed:v.filter((b)=>b.passed).length,failed:v.filter((b)=>!b.passed).length,total:v.length,results:v}}function ri(l){let f=d({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},l);if(oe(f.errors))return null;return{json:f.flags.json,skipUpdateCheck:f.flags.skipUpdateCheck}}async function Sl(l,f={}){let v=await qn(!f.json,()=>{let b=Mf(l,f);return{ready:b,finish:()=>b}},()=>Bn(),{loadingMessage:"Checking system status…"});if(f.json)console.log(JSON.stringify(v,null,2));else Hf(v);return v.engineSelfTest.failed>0||v.findings.some((b)=>b.severity==="error")?1:0}async function Mf(l,f){let v=f.cwd??process.cwd(),b=await Un(),k=$n(l,v,{ampPluginListOutput:b.ampPluginListOutput,codexPluginListOutput:b.codexPluginListOutput,copilotCliVersion:b.versions["copilot-cli"]}),F=hs(l,v),G=ys(l),z=D(l,{cwd:v}),J=z.policy,se=M(J,l.env),ae=te(J,se.capabilities),le=mr(l,7),be=Ks(l,v),ye=f.skipUpdateCheck?{currentVersion:It(),latestVersion:null,updateAvailable:!1}:await on(),de={hooks:k,engineSelfTest:xl(l),userConfig:F.userConfig,projectConfig:F.projectConfig,configState:at(z),effectiveRules:F.effectiveRules,shadowedRules:F.shadowedRules,environment:G,effectiveSafety:{selectedPreset:J.safety.level??"standard",level:se.effectiveLevel,capabilities:se.capabilities,ruleOverrides:J.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(ae).filter(([,ce])=>ce.source==="rule_override"&&ce.override==="off"&&ce.inheritedEnabled&&ce.changesInherited).map(([ce])=>ce),ruleCounts:{stored:Object.keys(J.destructiveCommandRuleOverrides).length,effective:Object.values(ae).filter((ce)=>ce.changesInherited).length},...z.policyScopes?{policyScopes:z.policyScopes}:{}},...be.length>0?{v2Leftovers:be}:{},posture:_s(l,F.userConfig.path),activity:le,update:ye,system:b};return{...de,findings:bs(de)}}function Hf(l){console.log(),console.log(ws(l.hooks)),console.log(),console.log(ks(l.engineSelfTest)),console.log(),console.log(xs(l)),console.log(),console.log(Ss(l.environment)),console.log(),console.log(Cs(l)),console.log(),console.log(Rs(l.findings)),console.log(),console.log(Ps(l.activity)),console.log(),console.log(Ds(l.system)),console.log(),console.log(Es(l.update)),console.log(As(l))}import{existsSync as Uf}from"node:fs";var Gf=/^[A-Za-z0-9_@%+=:,./-]+$/,Cl="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function oi(l){let f=d({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},l);if(oe(f.errors))return console.error(Cl),console.error("Pass -- before a command that starts with dashes."),null;if(f.values.cwd!==void 0&&!Uf(f.values.cwd))return console.error(`Error: --cwd path does not exist: ${f.values.cwd}`),null;let v=f.positionals.length===1?f.positionals[0]:f.positionals.map((b)=>Gf.test(b)?b:`'${b.replaceAll("'","'\\''")}'`).join(" ");if(!v)return console.error("Error: No command provided"),console.error(Cl),null;return{json:f.flags.json,cwd:f.values.cwd,command:v}}function Rl(l){if(l)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function Pl(l,f){let b=f-18;return[`${l.dtl}${l.dh.repeat(f)}${l.dtr}`,`${l.dv}  Command Analysis${" ".repeat(b)}${l.dv}`,`${l.dbl}${l.dh.repeat(f)}${l.dbr}`]}function ii(l){return JSON.stringify(l)}function El(l,f=0){return`[${l.map((b,k)=>Ls(b,k,f)).join(",")}]`}function Qn(l,f,v=70){let b=l.split(" "),k=[],F="";for(let G of b)if(F&&F.length+G.length+1>v)k.push(F),F=G;else F=F?`${F} ${G}`:G;if(F)k.push(F);return k.map((G,z)=>z===0?G:`${f}${G}`)}function Dl(l,f,v){let b=[];switch(l.type){case"parse":return null;case"env-strip":return b.push(""),b.push(`STEP ${f} ${v.h} Strip environment variables`),b.push(`  Removed: ${l.envVars.map((k)=>`${k}=<redacted>`).join(", ")}`),b.push(`  Tokens:  ${ii(l.output)}`),{lines:b,incrementStep:!0};case"leading-tokens-stripped":return b.push(""),b.push(`STEP ${f} ${v.h} Strip wrappers`),b.push(`  Removed: ${l.removed.join(", ")}`),b.push(`  Tokens:  ${ii(l.output)}`),{lines:b,incrementStep:!0};case"shell-wrapper":return b.push(""),b.push(`STEP ${f} ${v.h} Detect shell wrapper`),b.push(`  Wrapper: ${l.wrapper} -c`),b.push(`  Inner:   ${l.innerCommand}`),{lines:b,incrementStep:!0};case"interpreter":{if(b.push(""),b.push(`STEP ${f} ${v.h} Detect interpreter`),b.push(`  Interpreter: ${l.interpreter}`),b.push(`  Code:        ${l.codeArg}`),l.paranoidBlocked)b.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:b,incrementStep:!0}}case"busybox":return b.push(""),b.push(`STEP ${f} ${v.h} Busybox wrapper`),b.push(`  Subcommand: ${l.subcommand}`),{lines:b,incrementStep:!0};case"transparent-wrapper":return b.push(""),b.push(`STEP ${f} ${v.h} Transparent wrapper`),b.push(`  Wrapper: ${l.wrapper}`),b.push(`  Tokens:  ${ii(l.output)}`),{lines:b,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(b.push(""),b.push(`STEP ${f} ${v.h} Match rules`),b.push(`  Rule:   ${l.rule}()`),l.matched)b.push("  Result: MATCHED");else b.push("  Result: No match");return{lines:b,incrementStep:!0}}case"worktree-relaxation":return b.push(""),b.push(`STEP ${f} ${v.h} Worktree relaxation`),b.push(`  Mode:   ${r.worktree.name}`),b.push(`  Git cwd: ${l.gitCwd}`),b.push("  Result: Allowed local discard in linked worktree"),{lines:b,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(l.embeddedCommandFound)return b.push(""),b.push(`STEP ${f} ${v.h} Fallback scan`),b.push(`  Found: ${l.embeddedCommandFound}`),{lines:b,incrementStep:!0};return null}case"custom-rules-check":{if(l.rulesChecked){if(b.push(""),b.push(`STEP ${f} ${v.h} Custom rules`),l.matched)b.push("  Result: MATCHED");else b.push("  Result: No match");return{lines:b,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(l.matched)return b.push(""),b.push(`STEP ${f} ${v.h} Dangerous text check`),b.push(`  Token:  ${l.token}`),b.push("  Result: MATCHED"),{lines:b,incrementStep:!0};return null}case"strict-unparseable":return b.push(""),b.push(`STEP ${f} ${v.h} Strict mode check`),b.push(`  Command: ${l.rawCommand}`),b.push("  Result:  ✗ UNPARSEABLE"),{lines:b,incrementStep:!0};case"segment-skipped":return null;case"error":return b.push(""),b.push(`ERROR: ${l.message}`),{lines:b,incrementStep:!1};default:return l}}function si(l,f){let v=Rl(f?.asciiOnly??!1),b=58,k=[],F=1;k.push(...Pl(v,58)),k.push("");let G=l.trace.steps.find((de)=>de.type==="error");if(G&&G.type==="error"){k.push("ERROR"),k.push(`  ${G.message}`),k.push(""),k.push("RESULT"),k.push(`  Status: ${l.result==="blocked"?Je.red("BLOCKED"):Je.green("ALLOWED")}`),k.push(""),k.push("CONFIG");let de=l.configSource??"none";return k.push(`  Path: ${de}`),k.join(`
`)}let z=l.trace.steps.find((de)=>de.type==="parse");if(z&&z.type==="parse"){k.push("INPUT"),k.push(`  ${z.input}`),k.push(""),k.push(`STEP ${F} ${v.h} Split shell commands`),F++;for(let de=0;de<z.segments.length;de++){let ce=z.segments[de];if(ce){let we=Math.random();k.push(`  Segment ${de+1}: ${El(ce,we)}`)}}}let J=l.trace.segments,se=J.length>1;for(let de of J){if(se){k.push("");let Me="";if(z&&z.type==="parse"){let fo=z.segments[de.index];if(fo)Me=fo.join(" ")}let Ee=54,ht=Me,Xe=` Segment ${de.index+1}: `,At=" ";if(Me){if(Xe.length+Me.length+At.length>Ee){let ou=Ee-Xe.length-At.length;ht=`${Me.substring(0,ou-1)}…`}}let cn=Me?`${Xe}${ht}${At}`:` Segment ${de.index+1} `,zt=Me?`${Xe}${Je.cyan(ht)}${At}`:cn,Vi=58-cn.length,zi=Math.floor(Vi/2),ru=Vi-zi;k.push(`${v.sh.repeat(zi)}${zt}${v.sh.repeat(ru)}`)}if(de.steps.find((Me)=>Me.type==="segment-skipped")){k.push(""),k.push("  (skipped — prior segment blocked)");continue}let we=!1,Ze=!1;for(let Me of de.steps){let Ee=Dl(Me,F,v);if(Ee){if(Ze=!0,Me.type==="recurse"){k.push("");let ht=" RECURSING ",Xe=58-ht.length-4;k.push(`  ${v.tl}${v.h}${ht}${v.h.repeat(Xe)}`),k.push(`  ${v.v}`),we=!0;continue}for(let ht of Ee.lines)if(we)k.push(`  ${v.v} ${ht}`);else k.push(ht);if(Ee.incrementStep)F++}}if(we)k.push(`  ${v.v}`),k.push(`  ${v.bl}${v.h.repeat(56)}`),we=!1;if(!Ze)k.push(""),k.push(`  ${Je.green("✓")} Allowed (no matching rules)`)}if(k.push(""),k.push("RESULT"),l.result==="blocked"){if(k.push(`  Status: ${Je.red("BLOCKED")}`),l.customRule){if(k.push(`  Rule: ${l.customRule.id}`),l.customRule.rulebook)k.push(`  Rulebook: ${l.customRule.rulebook.name} ${l.customRule.rulebook.version}`);if(l.customRule.source)k.push(`  Source: ${l.customRule.source}`);if(l.customRule.override)k.push(`  Override: reason ${l.customRule.override.reason}`)}if(l.reason){let de=Qn(l.reason,"          ");k.push(`  Reason: ${de[0]}`);for(let ce=1;ce<de.length;ce++)k.push(de[ce]??"")}}else k.push(`  Status: ${Je.green("ALLOWED")}`);k.push(""),k.push("CONFIG");let ae=l.configSource??"none",le=l.configValid?"":" (invalid)";k.push(`  Path: ${ae}${le}`);let be=l.safetyPresetScope;k.push(`  Safety preset: ${l.selectedPreset??"standard"}${be?` (${hr(be)})`:""}`),k.push(`  Effective capabilities: ${l.effectiveLevel}`);let ye=Object.entries(l.destructiveCommandRuleOverrides??{});if(k.push(`  Rule customizations: ${ye.length}`),l.ruleActivation)k.push(`  Rule activation: ${l.ruleActivation.id} — ${l.ruleActivation.enabled?"on":"off"} via ${l.ruleActivation.source}`);return k.join(`
`)}function ai(l){return JSON.stringify(l,null,2)}import{resolve as Wf}from"node:path";var Bf=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function Al(l){let f=0,v={allocateSegment(){return f++},getNextSegmentIndex(){return f},recordGlobal(b){l.record({kind:"step",scope:"global",step:b})},recordSegment(b,k=v.currentSegmentIndex){if(k===void 0)return;l.record({kind:"step",scope:"segment",segmentIndex:k,step:b})}};return v}function _l(l={}){let f=[],v=l.maxEvents??512,b={maxTextLength:l.maxTextLength??2048,maxListLength:l.maxListLength??128,maxObjectProperties:l.maxObjectProperties??l.maxListLength??128,maxDepth:l.maxDepth??16},k=0,F,G=new Set;return{record(z){if(F)return;try{if(!z||f.length>=v){k++;return}f.push(ci(qf(z,b,G)))}catch{k++}},finish(z){if(F)return F;try{F=ci({events:Object.freeze(f),droppedEvents:k,terminal:Vf(z,b,G)})}catch{k++,F=Object.freeze({events:Object.freeze(f),droppedEvents:k,terminal:Object.freeze({result:"blocked",reason:"trace unavailable".slice(0,b.maxTextLength),segment:"trace unavailable".slice(0,b.maxTextLength)})})}return F}}}function qf(l,f,v){if(l.kind!=="step")throw TypeError("invalid trace event");let{scope:b,step:k}=l;Gr(k,v,f);let F=Tn(k,f,v);if(b==="global")return{kind:"step",scope:"global",step:F};if(b!=="segment")throw TypeError("invalid trace event scope");return{kind:"step",scope:"segment",segmentIndex:l.segmentIndex,step:F}}function Vf(l,f,v){let b=l.result;if(b==="allowed")return Object.freeze({result:"allowed"});if(b!=="blocked")throw TypeError("invalid trace terminal");let k=l.ruleId;return Object.freeze({result:"blocked",reason:Tn(l.reason,f,v),segment:Tn(l.segment,f,v),...k?{ruleId:Tn(k,f,v)}:{}})}function Gr(l,f,v,b=0,k=new WeakSet){if(typeof l==="string"){let z=l.slice(0,v.maxTextLength);if(!mt(z))return;for(let J of St(z))for(let se of J.match(/[^\s"'()$]+/g)??[])f.add($l(se));return}if(!l||typeof l!=="object"||b>=v.maxDepth||k.has(l))return;if(k.add(l),Array.isArray(l)){let z=Math.min(l.length,v.maxListLength);for(let J=0;J<z;J++)Gr(l[J],f,v,b+1,k);return}let F=0,G=new Set;for(let z in l){if(!Object.hasOwn(l,z))continue;if(F>=v.maxObjectProperties)break;F++,Gr(z,f,v);let J=li(z,v,f);if(G.has(J))continue;G.add(J),Gr(l[z],f,v,b+1,k)}}function Tn(l,f,v,b=0,k=new WeakSet){if(typeof l==="string")return li(l,f,v);if(!l||typeof l!=="object")return l;if(b>=f.maxDepth)return;if(k.has(l))return;if(k.add(l),Array.isArray(l)){let z=[],J=Math.min(l.length,f.maxListLength);for(let se=0;se<J;se++)z.push(Tn(l[se],f,v,b+1,k));return z}let F={},G=0;for(let z in l){if(!Object.hasOwn(l,z))continue;if(G>=f.maxObjectProperties)break;G++;let J=li(z,f,v);if(Object.hasOwn(F,J))continue;Object.defineProperty(F,J,{value:Tn(l[z],f,v,b+1,k),enumerable:!0,configurable:!0,writable:!0})}return F}function li(l,f,v){let b=l.slice(0,f.maxTextLength),k=mt(b)?ft(b):b,F=v.size>0?Jf(k,v):k;return(zf(F)?Ye(F):F).slice(0,f.maxTextLength)}function zf(l){return l.includes("PRIVATE KEY")||l.includes("://")||l.includes("eyJ")||l.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(l)||l.length>=14&&Bf.some((f)=>l.includes(f))||l.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(l)}function Jf(l,f){return l.replace(/[^\s"'()$]+/g,(v)=>f.has($l(v))?"<redacted>":v)}function $l(l){let f=2166136261,v=2166136261;for(let b=0;b<l.length;b++)f=Math.imul(f^l.charCodeAt(b),16777619),v=Math.imul(v^l.charCodeAt(l.length-b-1),16777619);return`${f>>>0}:${v>>>0}:${l.length}`}function ci(l){if(l&&typeof l==="object"&&!Object.isFrozen(l)){for(let f of Object.values(l))ci(f);Object.freeze(l)}return l}function er(l,f={},v){let b=Wf(f.cwd??process.cwd()),k=f.policySnapshot??D(v,{cwd:b,userConfigDir:f.userConfigDir}),F=M(k.policy,v.env),G=f.strict,z=lt({policySnapshot:k,effectiveCapabilities:F.capabilities,strict:G??F.strict,paranoidRm:F.paranoidRm,paranoidInterpreters:F.paranoidInterpreters,worktreeMode:F.worktreeMode}),J={effectiveLevel:z.effectiveLevel,selectedPreset:k.policy.safety.level??"standard",...k.policyScopes?{safetyPresetScope:k.policyScopes.levelScope}:{},effectiveCapabilities:z.effectiveCapabilities,destructiveCommandRuleOverrides:k.policy.destructiveCommandRuleOverrides},{configSource:se,configValid:ae}=Yf(v,{cwd:b,userConfigDir:f.userConfigDir});if(!l||!l.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:se,configValid:ae,...J};let le=L(l,"auto");if(le.status==="limited")throw new E;let be=le.dialect==="powershell"?L(l,"posix"):le,ye=_t(be),de=_l(),ce=Al(de);ce.recordGlobal({type:"parse",input:l,segments:ye.map((zt)=>[...zt])});let we=m("Bash",{command:l},{kind:"command",shell:"auto"},{configCwd:b,executionCwd:b},l),Ze=re(we,{environment:v,trace:ce,dependencies:{loadPolicySnapshot:()=>k,...G===void 0?{}:{getModes:()=>({...F,strict:G})}}}),Me=Ze.decision.kind==="deny"?Ze.decision:null;if(Me&&(Ze.stage==="policy-protection"||Ze.stage==="secret-protection")){let zt=Kf(Me);return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:zt.rule,matched:!0,reason:Me.reason}]}]},result:"blocked",reason:N(Me.reason),segment:N(di(Me,l)),...zt.ruleId?{ruleId:N(zt.ruleId)}:{},configSource:se,configValid:ae,...J}}let Ee=ce.getNextSegmentIndex();if(Me&&Ee>0&&Ee<ye.length)ce.recordSegment({type:"segment-skipped",index:Ee,reason:"prior-segment-blocked"},Ee);let ht=de.finish(Me?{result:"blocked",reason:Me.reason,segment:di(Me,l),...Me.ruleId?{ruleId:Me.ruleId}:{}}:{result:"allowed"}),Xe=Me?.ruleId??Zf(we,k,F,v),At=ee.find((zt)=>zt.id===Xe&&zt.activationCapability),cn=At?z.policy.effectiveDestructiveCommandRules[At.id]:void 0;return{trace:Qf(ht),result:Me?"blocked":"allowed",reason:Me?N(Me.reason):void 0,segment:Me?N(di(Me,l)):void 0,ruleId:Me?.ruleId?N(Me.ruleId):void 0,customRule:Xf(em(Me?.ruleId,k)),configSource:se,configValid:ae,...J,...At&&cn?{ruleActivation:{id:At.id,...cn}}:{}}}function di(l,f){return l.evidence.find((v)=>v.kind==="command")?.segment??f}function Kf(l){if(l.reason===dt)return{ruleId:"policy-protection",rule:"policy-protection:findPolicyConfigMutationTargetInSemanticFacts"};if(l.reason===ct)return{ruleId:"policy-apply-protection",rule:"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts"};if(l.reason===P)return{ruleId:"git-metadata-protection",rule:"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts"};return{ruleId:l.ruleId,rule:"secret-protection:findSensitiveTargetInSemanticFacts"}}function Yf(l,f){let v=H(f.cwd),b=f.userConfigPath??W(l,f),k=X(l,{cwd:f.cwd,userConfigDir:f.userConfigDir,userConfigPath:f.userConfigPath});try{if(o(k.projectConfigTarget)!==null){if(rn(k.projectConfigTarget).errors.length===0)return{configSource:v,configValid:!0};return{configSource:v,configValid:!1}}}catch(F){if(F instanceof i)return{configSource:v,configValid:!1};throw F}try{if(o(k.userConfigTarget)!==null){let F=rn(k.userConfigTarget);return{configSource:b,configValid:F.errors.length===0}}return{configSource:null,configValid:!0}}catch(F){if(F instanceof i)return{configSource:b,configValid:!1};throw F}}function Zf(l,f,v,b){let k=f.policy,F=qe({...k,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...k.destructiveCommandRuleOverrides,...Object.fromEntries(ee.flatMap((z)=>z.activationCapability?[[z.id,"on"]]:[]))}},f.state==="degraded"?{diagnostics:f.diagnostics,reason:f.reason}:void 0),G=re(l,{environment:b,dependencies:{loadPolicySnapshot:()=>F,getModes:()=>({...v,strict:!0,paranoidRm:!0,paranoidInterpreters:!0}),findSensitiveTarget:()=>null}});return G.decision.kind==="deny"?G.decision.ruleId:void 0}function Xf(l){if(!l)return;return{id:N(l.id),...l.rulebook?{rulebook:{name:N(l.rulebook.name),version:N(l.rulebook.version)}}:{},...l.source?{source:N(l.source)}:{},...l.override?{override:{type:"reason",reason:N(l.override.reason)}}:{}}}function Qf(l){let f=l.events.flatMap((b)=>b.kind==="step"&&b.scope==="global"?[b.step]:[]),v=new Map;for(let b of l.events){if(b.kind!=="step"||b.scope!=="segment")continue;let k=v.get(b.segmentIndex)??{index:b.segmentIndex,steps:[]};k.steps.push(b.step),v.set(b.segmentIndex,k)}return{steps:f,segments:[...v.values()]}}function em(l,f){let v=l?.replace(/^custom\./,"");if(!v||!f.policy.rules.some((b)=>b.name===v))return;return f.ruleMetadata[v]??Object.freeze({id:v})}function Tl(l){return new Promise((f)=>{process.stdout.write(`${l}
`,()=>f())})}async function Il(l,f){let v=oi(f);if(!v)return 1;try{let b=er(v.command,{cwd:v.cwd},l),k=!!process.env.NO_COLOR||!process.stdout.isTTY;return await Tl(v.json?ai(b):si(b,{asciiOnly:k})),0}catch(b){let k=tm(b instanceof g?b.cause:b);if(k===void 0)throw b;if(v.json)return await Tl(JSON.stringify({error:k})),1;return console.error(k),1}}function tm(l){if(l instanceof E)return l.message;if(l instanceof u)return l.message;if(l instanceof a&&n[l.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var Ol="2.3.4",qt="  ",hn="cc-safety-net";function jl(l){return l.argument?`${l.flags} ${l.argument}`:l.flags}function nm(l){return Math.max(...l.map((f)=>jl(f).length))}function rm(l){return Math.max(...l.map((f)=>f.usage.length))}function om(l){return Math.max(...l.map((f)=>`${hn} ${f.usage}`.length))}function im(l,f){let v=`${hn} ${l.usage}`;return`${qt}${v.padEnd(f+2)}${l.description}`}function en(l,f){return`${qt}${l.padEnd(Math.max(40,l.length+2))}${f}`}function In(l,f=console.log){let v=[];if(v.push(`${hn} ${l.name}`),v.push(""),v.push(`${qt}${l.description}`),v.push(""),v.push("USAGE:"),v.push(`${qt}${hn} ${l.usage}`),v.push(""),l.subcommands&&l.subcommands.length>0){v.push("SUBCOMMANDS:");let b=rm(l.subcommands);for(let k of l.subcommands)v.push(`${qt}${k.usage.padEnd(b+2)}${k.description}`);v.push("")}if(l.options.length>0){v.push("OPTIONS:");let b=nm(l.options);for(let k of l.options){let F=jl(k),G=k.default?`${k.description} (default: ${k.default})`:k.description;v.push(`${qt}${F.padEnd(b+2)}${G}`)}v.push("")}if(l.examples&&l.examples.length>0){v.push("EXAMPLES:");for(let b of l.examples)v.push(`${qt}${b}`)}f(v.join(`
`))}function ui(){let l=om(pr),f=[];f.push(`${hn} v${Ol}`),f.push(""),f.push("Blocks destructive commands and secret access."),f.push(""),f.push("COMMANDS:");for(let v of pr)f.push(im(v,l));f.push(""),f.push("GLOBAL OPTIONS:"),f.push(`${qt}-h, --help       Show help (use with command for command-specific help)`),f.push(`${qt}-V, --version    Show version`),f.push(""),f.push("HELP:"),f.push(`${qt}${hn} help <command>     Show help for a specific command`),f.push(`${qt}${hn} <command> --help   Show help for a specific command`),f.push(""),f.push("ENVIRONMENT VARIABLES:"),f.push(en(`${r.level.name}=standard|strict|paranoid`,"Set session safety level")),f.push(en(`${r.worktree.name}=1`,"Allow local git discards in linked worktrees")),f.push(en(`${r.debug.name}=1`,"Print diagnostic messages to stderr")),f.push(en(`${r.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),f.push(en("CC_SAFETY_NET_HOME","Override rule config home directory")),f.push(""),f.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),f.push(en(`${r.strict.name}=1`,"Force safety.overrides.fail_closed on")),f.push(en(`${r.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),f.push(en(`${r.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),f.push(en(`${r.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),f.push(""),f.push("Documentation:        https://ccsafetynet.com/docs"),console.log(f.join(`
`))}function Fl(){console.log(Ol)}function tr(l,f=console.log){let v=fr(l);if(!v)return!1;if(v.name.toLowerCase()!==l.toLowerCase())return!1;return In(v,f),!0}import{existsSync as xi,readFileSync as Ic}from"node:fs";import{join as wi}from"node:path";import*as an from"node:readline";function sm(l){return l==="install"?"Install":"Uninstall"}function am(l){return l==="install"?"Installing":"Uninstalling"}function lm(l){return l==="install"?"into":"from"}function Hl(l){return l?.available===!0}function cm(l,f){let v=new Set(f);return l.filter((b)=>v.has(b.target)).map((b)=>b.target)}function Nl(l,f,v){if(l.length===0||l.every((b)=>!b.available))return f;return Array.from({length:l.length},(b,k)=>k+1).map((b)=>(f+b*v+l.length)%l.length).find((b)=>Hl(l[b]))}function dm(l,f,v){if(v.ctrl&&v.name==="c")return"interrupt";if(v.name==="escape"||f==="q")return"abort";if(l==="install"&&(f==="u"||f==="U"))return"update";if(v.name==="up"||f==="k")return"up";if(v.name==="down"||f==="j")return"down";if(v.name==="space"||f===" ")return"toggle";if(v.name==="return"||v.name==="enter")return"confirm";return null}function um(l){return{cursor:l.findIndex((f)=>f.available),selected:[]}}function pm(l,f,v){if(v==="confirm"||v==="update"||v==="abort"||v==="interrupt")return{state:l,done:v};if(v==="up")return{state:{...l,cursor:Nl(f,l.cursor,-1)}};if(v==="down")return{state:{...l,cursor:Nl(f,l.cursor,1)}};let b=f[l.cursor];if(!Hl(b))return{state:l};let k=l.selected.includes(b.target)?l.selected.filter((F)=>F!==b.target):cm(f,[...l.selected,b.target]);return{state:{...l,selected:k}}}var Ul="◉",Gl="◯",Bl=">",ql=" ";function fm(l,f,v,b={}){let k=b.color!==!1,F=k?Je.dim:(J)=>J,G=k?Je.green:(J)=>J,z=k?Je.bold:(J)=>J;return["",`${sm(l)} CC Safety Net ${lm(l)}:`,"",...f.map((J,se)=>{let ae=v.selected.includes(J.target),le=se===v.cursor,be=ae?Ul:Gl,ye=le?Bl:ql,de=J.available?"":` (${J.unavailableReason??"not installed"})`,ce=`${be} ${J.label}${de}`,we=!J.available?F(ce):ae?G(ce):le?z(ce):ce;return`${ye} ${we}`}),"",l==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":f.some((J)=>J.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${l}. q/Esc: close`].join(`
`)}var Ml=["global-hook","plugin"];function mm(l,f,v={}){let b=v.color!==!1?Je.bold:(F)=>F;return["","Install the Kimi Code integration as:","",...[`Global hook — ${f?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((F,G)=>{let z=G===l,J=`${z?Ul:Gl} ${F}`;return`${z?Bl:ql} ${z?b(J):J}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function Vl(l){let{input:f,output:v}=l;an.emitKeypressEvents(f);let b=f.isRaw===!0;f.setRawMode(!0),f.resume();let k=0,F=()=>{if(k===0)return;an.moveCursor(v,0,-k),an.cursorTo(v,0),an.clearScreenDown(v)},G=()=>{F();let z=l.render();v.write(`${z}
`),k=z.split(`
`).length};return new Promise((z)=>{let J=(ae)=>{f.off("keypress",se),f.setRawMode(b),f.pause(),F(),z(ae)};function se(ae,le){l.onKey(ae,le,{finish:J,draw:G})}f.on("keypress",se),G()})}function zl(l={}){let f=0;return Vl({input:l.input??process.stdin,output:l.output??process.stdout,render:()=>mm(f,l.globalHookInstalled===!0),onKey:(v,b,k)=>{if(b.ctrl&&b.name==="c"){k.finish(null),(l.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(b.name==="escape"||v==="q")return k.finish(null);if(b.name==="return"||b.name==="enter")return k.finish(Ml[f]);if(b.name==="up"||b.name==="down"||v==="k"||v==="j")f=(f+1)%Ml.length,k.draw()}})}function pi(l=process.stdin,f=process.stdout){return Boolean(l.isTTY&&f.isTTY&&typeof l.setRawMode==="function")}function Jl(l,f,v={}){let b=v.output??process.stdout,k=um(f);return Vl({input:v.input??process.stdin,output:b,render:()=>fm(l,f,k),onKey:(F,G,z)=>{let J=dm(l,F,G);if(!J)return;let se=pm(k,f,J);if(k=se.state,se.done==="interrupt"){z.finish(null),(v.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(se.done==="abort")return z.finish(null);if(se.done==="update")return z.finish("update");if(se.done==="confirm"){if(k.selected.length===0){b.write("\x07"),z.draw();return}z.finish([...k.selected]),b.write(`${am(l)} selected integrations...
`);return}z.draw()}})}import{existsSync as Kl,lstatSync as hm,mkdirSync as ym,mkdtempSync as vm,readdirSync as bm,readFileSync as jn,rmSync as qr}from"node:fs";import{basename as Lm,dirname as wm,join as Ht}from"node:path";import{fileURLToPath as km}from"node:url";var fi="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",yn="cc-safety-net",vn="cc-safety-net/index.ts";import{spawn as gm}from"node:child_process";var mi=(l,f)=>{let v=pn([...l],process.env);return new Promise((b)=>{let k=gm(v.cmd,v.args,{cwd:f,stdio:["ignore","pipe","pipe"]}),F=Jo(k),G=!1,z=setTimeout(()=>{G=!0,k.kill()},120000);k.on("error",(J)=>{clearTimeout(z),b({status:null,errorCode:J.code,stdout:F.stdout,stderr:[J.message,F.stderr].filter(Boolean).join(`
`)})}),k.on("close",(J)=>{clearTimeout(z),b({status:G?null:J,errorCode:G?"ETIMEDOUT":void 0,stdout:F.stdout,stderr:F.stderr})})})};var On="cc-safety-net.ts",Wl=Ht("amp",vn);function xm(l){return Ht(l.home,".config","amp","plugins","cc-safety-net.ts")}function Sm(){let l=wm(km(import.meta.url));return[Ht(l,"..",Wl),Ht(l,"..","..","..","dist",Wl)]}function Cm(l=Sm()){let f=l.find((v)=>Kl(v)&&hm(v).isFile());if(!f)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return f}function Yl(l){try{return JSON.parse(l)}catch{return}}function Vr(l){return l.subarray(0,Buffer.byteLength(fi)).toString("utf-8")===fi}async function nr(l,f,v){let b=await l(f,v);if(b.status===0)return b;throw Error([`Failed to run ${f.join(" ")}${b.status===null?"":` (exit ${b.status})`}.`,[b.stdout,b.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function Zl(l){let f=await l(["amp","plugins","repositories","--json"]);if(f.status===null)throw Error(`${f.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${f.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${f.stderr}`.trim());if(f.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${f.status}). Sign in with "amp login" and rerun install --amp.
${[f.stdout,f.stderr].filter(Boolean).join(`
`)}`.trim());let v=Yl(f.stdout),b=(Array.isArray(v)?v:[]).filter((k)=>ot(k,"scope")==="user"&&ot(k,"exists")===!0&&ot(k,"viewerCanWrite")===!0).map((k)=>ot(k,"cloneRef")).find((k)=>typeof k==="string"&&k.length>0);if(!b)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return b}async function Xl(l,f,v){let b=vm(Ht(f.tmpdir,"cc-safety-net-amp-"));try{return await nr(l,["amp","clone","user-plugins",b]),await v(b)}finally{qr(b,{recursive:!0,force:!0})}}function gi(l){return`rerun ${l==="overwrite"?"install":"uninstall"} --amp`}function Ql(l,f,v){let b=Ht(l,f),k=Tt(b);if(!k)return;if(k.isSymbolicLink()||!k.isFile())throw Error(`Refusing to ${v} ${f} in your Amp personal plugins repository: not a regular file. Remove it there and ${gi(v)}.`);let F=jn(b);if(Vr(F))return F;throw Error(`Refusing to ${v} unmanaged file ${f} in your Amp personal plugins repository. Remove it there and ${gi(v)}.`)}function ec(l,f){let v=Ht(l,yn),b=Tt(v);if(!b)return;if(b.isSymbolicLink()||!b.isDirectory())throw Error(`Refusing to ${f} ${yn} in your Amp personal plugins repository: not a regular directory. Remove it there and ${gi(f)}.`);return Ql(l,vn,f)}function Rm(l){let f=Ht(l,On),v=Tt(f);if(!v||v.isSymbolicLink()||!v.isFile())return;let b=jn(f);return Vr(b)?b:void 0}async function tc(l,f,v,b){if(await nr(l,v,f),(await nr(l,["git","status","--porcelain"],f)).stdout.trim()==="")return!1;return await nr(l,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",b],f),await nr(l,["git","push","origin","HEAD"],f),!0}function Br(l,f){Pm(l,f),Em(l,f)}function nc(l,f){if(f==="keep")return;throw Error(`Local Amp plugin ${l} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function Pm(l,f){let v=xm(l),b=Tt(v);if(!b)return;if(!b.isSymbolicLink()&&b.isFile()&&Vr(jn(v))){qr(v);return}nc(v,f)}function Em(l,f){let v=Ht(l.home,".config","amp","plugins",yn),b=Tt(v);if(!b)return;if(!b.isSymbolicLink()&&b.isDirectory()&&Dm(v)){qr(v,{recursive:!0});return}nc(v,f)}function Dm(l){let f=Lm(vn);if(bm(l).join("\x00")!==f)return!1;let v=Ht(l,f),b=Tt(v);return!!b&&!b.isSymbolicLink()&&b.isFile()&&Vr(jn(v))}function Am(l){let f=y(l);if(!Kl(f))return"";let v=Yl(jn(f,"utf-8"));if(!v||typeof v!=="object"||Array.isArray(v))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(S(v,l.home))};
`}async function rc(l,f=Cm(),v=mi){let b=Buffer.concat([jn(f),Buffer.from(Am(l),"utf-8")]),k=await Zl(v);return Xl(v,l,async(F)=>{let G=`${k}/${yn}`,z=ec(F,"overwrite"),J=Ql(F,On,"overwrite");if(z?.equals(b)&&!J)return Br(l,"fail"),{path:G,alreadyInstalled:!0};if(ym(Ht(F,yn),{recursive:!0}),Ot(Ht(F,vn),b),J)qr(Ht(F,On));let se=await tc(v,F,["git","add","--",vn,...J?[On]:[]],`chore: update cc-safety-net plugin to v${It()}`);return Br(l,"fail"),{path:G,alreadyInstalled:!se}})}async function oc(l,f=mi){let v=await Zl(f);return Xl(f,l,async(b)=>{let k=ec(b,"remove"),F=Rm(b),G=`${v}/${F&&!k?On:yn}`;if(!k&&!F)return Br(l,"keep"),{path:G,alreadyInstalled:!1};return await tc(f,b,["git","rm","--",...k?[vn]:[],...F?[On]:[]],`chore: remove cc-safety-net plugin v${It()}`),Br(l,"keep"),{path:G,alreadyInstalled:!0}})}import{existsSync as ic,mkdirSync as _m,readFileSync as $m}from"node:fs";import{dirname as Tm}from"node:path";var hi=Yt["antigravity-cli"],bn="cc-safety-net";function Ln(l){return Boolean(l)&&typeof l==="object"&&!Array.isArray(l)}function Jr(){return{PreToolUse:[{hooks:[{type:"command",command:hi,timeout:30}]}]}}function sc(l){try{let f=JSON.parse($m(l,"utf-8"));if(!f||typeof f!=="object"||Array.isArray(f))throw Error("Antigravity hooks config must be a JSON object");return f}catch(f){if(f instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${l}: ${f.message}`);throw f}}function ac(l){let f=l[bn];if(f===void 0){let b=Jr();return l[bn]=b,{definition:b,preToolUse:b.PreToolUse??[]}}if(!Ln(f))throw Error(`Antigravity hooks config entry "${bn}" must be an object`);let v=Array.isArray(f.PreToolUse)?f.PreToolUse:[];return f.PreToolUse=v,{definition:f,preToolUse:v}}function lc(l){if(!Array.isArray(l.PreToolUse))return!1;return l.PreToolUse.some((f)=>Ln(f)&&Array.isArray(f.hooks)&&f.hooks.some((v)=>Ln(v)&&v.command===hi))}function Im(l){return Object.values(l).some((f)=>Ln(f)&&f.enabled!==!1&&lc(f))}function Om(l){if(l[bn]===void 0)return!1;let f=ac(l);if(f.definition.enabled!==!1||!lc(f.definition))return!1;return f.definition.enabled=!0,!0}function jm(l){if(l[bn]===void 0){l[bn]=Jr();return}let f=ac(l);f.definition.enabled=!0,f.preToolUse.push(Jr().PreToolUse?.[0]??{hooks:[]})}function Fm(l){let f=!1;for(let v of Object.values(l)){if(!Ln(v)||!Array.isArray(v.PreToolUse))continue;v.PreToolUse=v.PreToolUse.flatMap((b)=>{if(!Ln(b)||!Array.isArray(b.hooks))return[b];let k=b.hooks.filter((F)=>!Ln(F)||F.command!==hi);if(k.length!==b.hooks.length)f=!0;return k.length===0?[]:[{...b,hooks:k}]})}return f}function zr(l,f){Ot(l,`${JSON.stringify(f,null,2)}
`)}function cc(l){let f=Ke(l.home);if(_m(Tm(f),{recursive:!0}),!ic(f))return zr(f,{[bn]:Jr()}),{path:f,alreadyInstalled:!1};let v=sc(f);if(Im(v))return{path:f,alreadyInstalled:!0};if(Om(v))return zr(f,v),{path:f,alreadyInstalled:!1};return jm(v),zr(f,v),{path:f,alreadyInstalled:!1}}function dc(l){let f=Ke(l.home);if(!ic(f))return{path:f,alreadyInstalled:!1};let v=sc(f);if(!Fm(v))return{path:f,alreadyInstalled:!1};return zr(f,v),{path:f,alreadyInstalled:!0}}import{existsSync as Nm,readdirSync as Mm,rmSync as Hm}from"node:fs";import{join as Um}from"node:path";function uc(l,f=process.platform,v){if(!Nm(l))return;let b=f==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);Mm(l).filter((k)=>k!==v&&b.test(k)).forEach((k)=>{Hm(Um(l,k),{recursive:!0,force:!0})})}import{spawn as Gm}from"node:child_process";var Xt=B.map((l)=>({target:l.id,flag:l.flag,label:p(l.id),probeCommand:l.probeCommand}));function yi(l){let f=new Set(l);return Xt.map((v)=>v.target).filter((v)=>f.has(v))}async function pc(l,f){for(let v of l)await f(v)}var Bm=5000;function vi(l,f=Bm){return new Promise((v)=>{let b=pn([...l],process.env),k=Gm(b.cmd,b.args,{env:process.env,stdio:"ignore"}),F=!1,G=(J)=>{if(F)return;F=!0,clearTimeout(z),v(J)},z=setTimeout(()=>{k.kill(),G(!1)},f);k.on("error",()=>G(!1)),k.on("close",(J)=>G(J===0))})}function fc(l=vi,f={}){let v=new Set(f.configuredTargets??[]);return Promise.all(Xt.map(async(b)=>({target:b.target,flag:b.flag,label:b.label,...gc(f.action,await l(b.probeCommand),v.has(b.target))})))}function mc(l,f){let v=new Set(f.configuredTargets??[]);return l.map((b)=>({...b,...gc(f.action,b.available,v.has(b.target))}))}function gc(l,f,v){if(l==="uninstall")return v?{available:!0}:{available:!1,unavailableReason:"not installed"};if(l==="install"&&v)return{available:!1,unavailableReason:"already installed"};if(!f)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}import{existsSync as hc,readdirSync as qm,rmSync as Vm}from"node:fs";import{join as Fn}from"node:path";function Wr(l,f=process.platform){let v=Fn(l.env.get("npm_config_cache")||(f==="win32"?Fn(l.env.get("LOCALAPPDATA")||Fn(l.home,"AppData","Local"),"npm-cache"):Fn(l.home,".npm")),"_npx");if(!hc(v))return;qm(v).filter((b)=>hc(Fn(v,b,"node_modules","cc-safety-net"))).forEach((b)=>{Vm(Fn(v,b),{recursive:!0,force:!0})})}import{existsSync as kc,mkdirSync as Jm,readFileSync as xc}from"node:fs";import{dirname as Wm,join as wc}from"node:path";function zm(l,f){if(l[f]!=="#")return f;let v=l.indexOf(`
`,f+1);return v===-1?l.length:v+1}function bi(l,f,v){let b=new RegExp(`^(\\s*)${f}\\s*=\\s*\\[`),k=0;for(let F of l.split(`
`)){if(/^\s*\[/.test(F))return;let G=b.exec(F);if(G){let z=k+G[0].lastIndexOf("[");return{start:z,end:Ao(l,z,{skipComment:zm,...v})}}k+=F.length+1}return}function yc(l,f,v){let b=l.slice(0,f.end).trimEnd(),k=la(l,f.end),F=k===""?"     ":`${k}  `,G=!b.endsWith("[")&&!b.endsWith(",");return`${b}${G?",":""}
${F}${v}${l.slice(f.end)}`}function vc(l,f,v){let b=l.indexOf(v,f.start);if(b===-1||b>f.end)return l;return Rr(l,{start:b,end:b+v.length})}function bc(l,f){let v=new RegExp(`^\\s*${f}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),b=l.split(`
`),k=b.findIndex((z)=>/^\s*\[/.test(z)),F=k===-1?b:b.slice(0,k),G=k===-1?[]:b.slice(k);return[...F.filter((z)=>!v.test(z)),...G].join(`
`)}function Lc(l,f,v){let b=new RegExp(`^\\s*\\[\\[${f}]]\\s*$`,"m");return l.split(/(?=^\s*\[)/m).filter((k)=>!b.test(k)||!k.includes(v)).join("").trimEnd()}var rr=Yt["kimi-code"],Li=`[[hooks]]
event = "PreToolUse"
command = "${rr}"`,Sc=`{ event = "PreToolUse", command = "${rr}" }`,Cc={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function Rc(l){return wc(l.env.get("KIMI_CODE_HOME")??wc(l.home,".kimi-code"),"config.toml")}function Km(l){let f=bi(l,"hooks",Cc);if(f&&l.slice(f.start+1,f.end).trim())return yc(l,f,Sc);let v=bc(l,"hooks").trimEnd();if(v==="")return`${Li}
`;return`${v}

${Li}
`}function Pc(l){let f=Rc(l);if(Jm(Wm(f),{recursive:!0}),!kc(f))return Ot(f,`${Li}
`),{path:f,alreadyInstalled:!1};let v=xc(f,"utf-8");if(v.includes(rr))return{path:f,alreadyInstalled:!0};return Ot(f,Km(v)),{path:f,alreadyInstalled:!1}}function Ec(l){let f=Rc(l);if(!kc(f))return{path:f,alreadyInstalled:!1};let v=xc(f,"utf-8");if(!v.includes(rr))return{path:f,alreadyInstalled:!1};let b=bi(v,"hooks",Cc),k=b?vc(v,b,Sc):`${Lc(v,"hooks",rr)}
`;return Ot(f,k),{path:f,alreadyInstalled:!0}}var ki="safety-net@cc-marketplace",Dc=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),Ac=new Set(["antigravity-cli","cursor","grok-build","hermes-agent","kimi-code"]);function Si(l){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(l??"")}function Oc(l){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(l??"")}function Ym(l){return/^Marketplace `cc-marketplace`\s*$/m.test(l??"")}var jc={"claude-code":{installCommands:(l)=>{let f=Sr(l,"cc-safety-net@cc-marketplace");return{commands:[...f?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...Eo(l).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:Sr(l,ki)?[["claude","plugin","uninstall",ki]]:[],update:f}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(l,f)=>{let v=f??await Zt(["codex","plugin","list"]),b=Oc(v);return{commands:[b||Ym(v)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:Si(v)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:b}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:"Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."},"copilot-cli":{installCommands:async()=>{let l=await Zt(["copilot","plugin","list"]),f=[...ha(l)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...ya(l)?[["copilot","plugin","uninstall",fa]]:[]];if(ma(l))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",Kt]],cleanupCommands:f,update:!0};return{commands:[ga(await Zt(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",Kt]],cleanupCommands:f}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(l)=>{let f=Fo(l);if(f.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(f.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:Zo,installCommands:()=>({commands:il()}),uninstallCommands:[["openclaw","plugins","uninstall",$t,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{beforeInstall:ei,installCommands:[["opencode","plugin","-g","-f","cc-safety-net@latest"]]},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]}};function Fc(l,f=(v)=>v){try{let v=JSON.parse(f(Ic(l,"utf-8")));if(!v||typeof v!=="object"||Array.isArray(v))throw Error(`Settings file ${l} must be a JSON object`);return v}catch(v){if(v instanceof SyntaxError)throw Error(`Failed to parse ${l}: ${v.message}`);throw v}}function Zm(l){let f=wi(Vn(l),"settings.json");if(!xi(f))return;let v=Fc(f,Ut),b=v.enabledPlugins;if(!b||typeof b!=="object"||Array.isArray(b))return;if(b[Kt]!==!1)return;let k=Ic(f,"utf-8"),F=k.replace(new RegExp(`("${Kt}"\\s*:\\s*)false`),"$1true");return b[Kt]=!0,Ot(f,F!==k?F:`${JSON.stringify(v,null,2)}
`),`Enabled ${Kt} plugin in ${f}`}function Xm(l){let f=ti(l);if(!xi(f))return;let v=Fc(f);if(!Array.isArray(v.packages))return;let b=v.packages.find((k)=>!!k&&typeof k==="object"&&!Array.isArray(k)&&ni(k.source)&&("extensions"in k));if(!b)return;return delete b.extensions,Ot(f,`${JSON.stringify(v,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${f}`}function _c(l,f){let v=d({label:f,booleans:Object.fromEntries(Xt.map((F)=>[F.target,[F.flag]]))},l),b=v.errors[0];if(b)throw Error(b);let k=Xt.filter((F)=>v.flags[F.target]).map((F)=>F.target);if(k.length!==1)throw Error(`Choose exactly one ${f} target: ${Xt.map((F)=>F.flag).join(", ")}`);return k[0]}async function Nc(l,f=Rn){let[v,b,k]=await Promise.all([f(["amp","plugins","list"],30000),f(["codex","plugin","list"],30000),f(["copilot","--binary-version"])]);return{codexPluginListOutput:b,hooks:$n(l,process.cwd(),{ampPluginListOutput:v,codexPluginListOutput:b,copilotCliVersion:k})}}async function Qm(l,f,v=Rn){let b=await Nc(l,v);return b.hooks.filter((k)=>f==="install"?k.configured:k.detected||k.inspectionStatus==="not-inspected").filter((k)=>k.platform!=="codex"||!Si(b.codexPluginListOutput)||Oc(b.codexPluginListOutput)).map((k)=>k.platform)}function eg(l,f,v,b){if(v.length>0)return{finish:async()=>[_c(v,f)]};if(!b.selectTargets&&!pi(b.input,b.output))return{finish:async()=>[_c(v,f)]};let k=b.detectConfiguredTargets??(()=>Qm(l,f,b.fetchVersion)),F=Promise.all([fc(b.probeTargets),k()]);return{ready:F,finish:async()=>{let[G,z]=await F,J=mc(G,{action:f,configuredTargets:z}),se=b.selectTargets?await b.selectTargets(f,Tc(f,J)):await Jl(f,Tc(f,J),{input:b.input,output:b.output});if(se==="update")return se;if(!se||se.length===0)return null;return yi(se)}}}async function wn(l,f,v=!1,b){let k=jc[l];k.beforeInstall?.(f);let F=typeof k.installCommands==="function"?await k.installCommands(f,b):{commands:k.installCommands};return await Wo(F.commands),await Qa(F.cleanupCommands??[]),[`${F.update||v?"Updated":"Installed"} ${p(l)} integration`,k.postInstallMessage].filter(Boolean).join(`
`)}async function Nn(l){let f=jc[l];if(!f.uninstallCommands)throw Error(`${p(l)} uninstall is not supported`);return await Wo(f.uninstallCommands),`Uninstalled ${p(l)} integration`}function tg(l){let f=Ll(l);return f.alreadyInstalled?`Uninstalled OpenCode plugin from ${f.path}`:`OpenCode plugin not installed in ${f.path}`}var ng={"antigravity-cli":{install:cc,uninstall:dc},cursor:{install:Pa,uninstall:Ea},"grok-build":{install:Na,uninstall:Ma},"kimi-code":{install:Pc,uninstall:Ec}};function ln(l,f,v,b=!1){if(l==="install"&&!b)Wr(v);let k=ng[f][l](v),F=p(f),G=l!=="install"?"Uninstalled":b?"Updated":"Installed";return l==="install"&&k.alreadyInstalled?b?`${F} hook up to date in ${k.path}`:`${F} hook already installed in ${k.path}`:l==="uninstall"&&!k.alreadyInstalled?`${F} hook not installed in ${k.path}`:`${G} ${F} hook ${l==="install"?"in":"from"} ${k.path}`}var rg={amp:{install:rc,uninstall:oc,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:Ba,uninstall:qa,afterInstall:async(l)=>{let f=Vo(l);return await Zt(["hermes","plugins","enable",Gt,"--no-allow-tool-override"]),!f},beforeUninstall:async(l)=>{qo(l);try{await Zt(["hermes","plugins","disable",Gt])}catch(f){console.warn(`${f instanceof Error?f.message:String(f)}
Removing the plugin files anyway; ${Gt} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function Kr(l,f,v,b=!1){let k=rg[f];if(l==="uninstall")await k.beforeUninstall?.(v);let F=l==="install"?await k.install(v):await k.uninstall(v),G=l==="install"&&await k.afterInstall?.(v),z=p(f),J=!G&&(l==="install"&&F.alreadyInstalled||l==="uninstall"&&!F.alreadyInstalled);return[J?l==="install"?`${z} plugin ${b?"up to date":"already installed"} at ${F.path}`:`${z} plugin not installed at ${F.path}`:`${l!=="install"?"Uninstalled":b?"Updated":"Installed"} ${z} plugin ${l==="install"?"at":"from"} ${F.path}`,J?void 0:k.restartNote].filter(Boolean).join(`
`)}var og={amp:{install:(l,f)=>Kr("install","amp",l,f),uninstall:(l)=>Kr("uninstall","amp",l)},"antigravity-cli":{install:(l,f)=>ln("install","antigravity-cli",l,f),uninstall:(l)=>ln("uninstall","antigravity-cli",l)},"claude-code":{install:(l,f)=>wn("claude-code",l,f),uninstall:()=>Nn("claude-code")},codex:{install:(l,f,v)=>wn("codex",l,f,v),uninstall:()=>Nn("codex")},"copilot-cli":{install:async(l,f)=>[await wn("copilot-cli",l,f),Zm(l)].filter(Boolean).join(`
`),uninstall:()=>Nn("copilot-cli")},cursor:{install:(l,f)=>ln("install","cursor",l,f),uninstall:(l)=>ln("uninstall","cursor",l)},"gemini-cli":{install:(l,f)=>wn("gemini-cli",l,f),uninstall:()=>Nn("gemini-cli")},"grok-build":{install:(l,f)=>ln("install","grok-build",l,f),uninstall:(l)=>ln("uninstall","grok-build",l)},"hermes-agent":{install:(l,f)=>{if(!f)Wr(l);return Kr("install","hermes-agent",l,f)},uninstall:(l)=>Kr("uninstall","hermes-agent",l)},"kimi-code":{install:(l,f)=>ln("install","kimi-code",l,f),uninstall:(l)=>ln("uninstall","kimi-code",l)},openclaw:{install:async(l,f)=>{let v=await wn("openclaw",l,f);return await sl(),v},uninstall:(l)=>(Zo(l),Nn("openclaw"))},opencode:{install:async(l,f)=>{let v=await wn("opencode",l,f);return await vl(l),v},uninstall:(l)=>tg(l)},pi:{install:async(l,f)=>[await wn("pi",l,f),Xm(l)].filter(Boolean).join(`
`),uninstall:()=>Nn("pi")}},$c=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function ig(l){if(Yn({environment:l,cwd:process.cwd()}).status!=="configured")return $c;return[$c,"",Je.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function Tc(l,f){return f.map((v)=>l==="install"&&v.target==="kimi-code"&&v.unavailableReason==="already installed"?{...v,available:!0,unavailableReason:void 0,label:`${v.label} (global hook installed)`}:v)}function sg(l,f){if(l.selectKimiInstallMethod)return l.selectKimiInstallMethod();if(!pi(l.input,l.output))return Promise.resolve("global-hook");return zl({input:l.input,output:l.output,globalHookInstalled:Yn({environment:f,cwd:process.cwd()}).status==="configured"})}async function Mc(l,f,v,b=!1,k){return og[f][l](v,b,k)}function ag(l){let f=d({label:"update"},l).errors[0];if(f)throw Error(f)}async function lg(l,f=Rn){let v=await Nc(l,f),b=wi(Vn(l),"installed-plugins");return{targets:yi([...v.hooks.filter((F)=>F.platform!=="copilot-cli"&&F.detected).map((F)=>F.platform),...[Pr,pa,ua].flatMap((F)=>xi(wi(b,...F))?["copilot-cli"]:[]),...Sr(l,ki)?["claude-code"]:[],...Si(v.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:v.codexPluginListOutput}}async function cg(l){let f=c(),v=l.output??process.stdout,b=(l.scriptPath??process.argv[1]??"").split(/[\\/]/),k=b.find((ye)=>/^bunx-\d+-/.test(ye)),F=k!==void 0||b.includes("_npx")?null:(l.checkLatestVersion??on)(),G=async()=>{let ye=F&&await F;if(ye?.updateAvailable)v.write(`
Update available: cc-safety-net ${ye.currentVersion} → ${ye.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},z=lg(f,l.fetchVersion??Rn).then(async(ye)=>{let de=new Set(ye.targets);return{targets:ye.targets,codexPluginListOutput:ye.codexPluginListOutput,available:new Map(await Promise.all(Xt.filter((ce)=>de.has(ce.target)&&Dc.has(ce.target)).map(async(ce)=>[ce.target,await vi(ce.probeCommand)])))}}),J=await qn(l.showBanner??!0,()=>({ready:z,finish:()=>z}),()=>Bn({input:l.input??process.stdin,output:v}),{loadingMessage:"Checking installed integrations…",output:v}),se=await Promise.resolve().then(()=>(uc(f.tmpdir,process.platform,k),null)).catch((ye)=>or(ye));if(J.targets.length===0){if(v.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),se!==null)console.error(se);return await G(),se===null?0:1}let ae=J.targets.some((ye)=>Ac.has(ye))?await Promise.resolve().then(()=>(Wr(f),null)).catch((ye)=>or(ye)):null,le=await wr(Promise.all(J.targets.map((ye)=>{if(Dc.has(ye)&&!J.available.get(ye))return Promise.resolve({message:`${p(ye)} not found; skipped`,failed:!1});if(ae!==null&&Ac.has(ye))return Promise.resolve({message:ae,failed:!0});return Mc("install",ye,f,!0,J.codexPluginListOutput).then((de)=>({message:de,failed:!1}),(de)=>({message:or(de),failed:!0}))})),{loadingMessage:`Updating ${J.targets.length} integration${J.targets.length===1?"":"s"}…`,output:v}),be=se===null?le:[...le,{message:se,failed:!0}];return be.forEach((ye)=>{ye.failed?console.error(ye.message):v.write(`${ye.message}
`)}),await G(),be.some((ye)=>ye.failed)?1:0}function Ci(l,f={}){return Promise.resolve().then(()=>ag(l)).then(()=>cg(f)).catch((v)=>(console.error(or(v)),1))}async function ir(l,f,v={}){try{let b=c(),k=await qn(!0,()=>eg(b,l,f,v),()=>Bn({input:v.input??process.stdin,output:v.output??process.stdout}),{loadingMessage:l==="install"?"Checking available integrations…":"Checking installed integrations…",output:v.output??process.stdout});if(!k)return(v.output??process.stdout).write(`Cancelled: nothing was ${l}ed.
`),0;if(k==="update")return(v.runUpdate??(()=>Ci([],{fetchVersion:v.fetchVersion,input:v.input,output:v.output,showBanner:!1})))();let F=v.output??process.stdout;return await pc(k,async(G)=>{if(G==="kimi-code"&&l==="install"){let J=await sg(v,b);if(J===null){F.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(J==="plugin"){F.write(`${ig(b)}
`);return}}let z=await wr(Mc(l,G,b),{loadingMessage:`${l==="install"?"Installing":"Uninstalling"} ${p(G)} integration…`,output:F});F.write(`${z}
`)}),0}catch(b){return console.error(or(b)),1}}function or(l){let f=l instanceof Error?l.message:String(l),v=typeof l==="object"&&l!==null&&"code"in l?l.code:null;if(v==="EACCES"||v==="EPERM")return`${f}
Check file permissions for the target config file and parent directory.`;if(v==="ENOENT")return`${f}
Check that the target config path and parent directory exist.`;if(v==="ENOTDIR")return`${f}
Check that every parent path component is a directory.`;return f}import{mkdirSync as bg}from"node:fs";import{dirname as Lg}from"node:path";import{createInterface as wg}from"node:readline";import{existsSync as zc,readFileSync as mg}from"node:fs";var Gc=["version","safety","workflow","destructive_command_protection","secret_protection","audit"],dg=["standard","strict","paranoid"],Bc="must be an object if provided",ug=`must be an integer between ${De} and ${Oe}`;function Vt(l,f){return Se(wt(pg(l,f),Gc,(v)=>v.kind==="custom")," "," ")}function pg(l,f){if(!Pi(l))return[e([],"Config must be an object")];return[...l.version===1?[]:[e(["version"],"must be 1")],...Mn(l.safety,["safety"],["level","overrides"],(v)=>[...v.level===void 0||typeof v.level==="string"&&dg.includes(v.level)?[]:[e(["safety","level"],'must be "standard", "strict", or "paranoid"')],...Mn(v.overrides,["safety","overrides"],Hc,(b)=>Hc.flatMap((k)=>Yr(b[k],["safety","overrides",k])))]),...Mn(l.workflow,["workflow"],["worktree_mode"],(v)=>Yr(v.worktree_mode,["workflow","worktree_mode"])),...Mn(l.destructive_command_protection,["destructive_command_protection"],["enabled","overrides","allow_paths"],(v)=>[...Yr(v.enabled,["destructive_command_protection","enabled"]),...Uc(v.overrides,["destructive_command_protection","overrides"],We,"destructive command"),...Ri(v.allow_paths,["destructive_command_protection","allow_paths"],Be,f)]),...Mn(l.secret_protection,["secret_protection"],["enabled","overrides","deny_paths","allow_paths"],(v)=>[...Yr(v.enabled,["secret_protection","enabled"]),...Uc(v.overrides,["secret_protection","overrides"],Ue,"secret protection"),...Ri(v.deny_paths,["secret_protection","deny_paths"],ze,f),...Ri(v.allow_paths,["secret_protection","allow_paths"],Ve,f)]),...Mn(l.audit,["audit"],["retention_days"],(v)=>fg(v.retention_days)?[]:[e(["audit","retention_days"],ug)]),...Object.keys(l).filter((v)=>!Gc.includes(v)).map((v)=>qc([],v))]}var Hc=["fail_closed","paranoid_rm","paranoid_interpreters"];function Mn(l,f,v,b){if(l===void 0)return[];if(!Pi(l))return[e(f,Bc)];return[...b(l),...Object.keys(l).filter((k)=>!v.includes(k)).map((k)=>qc(f,k))]}function Yr(l,f){return l===void 0||typeof l==="boolean"?[]:[e(f,"must be a boolean")]}function Uc(l,f,v,b){if(l===void 0)return[];if(!Pi(l))return[e(f,Bc)];return[...Object.keys(l).filter((k)=>!v.has(k)).map((k)=>({path:[...f,k],message:`unknown ${b} rule id "${k}"`,kind:"key"})),...Object.keys(l).filter((k)=>l[k]!=="on"&&l[k]!=="off").map((k)=>e([...f,k],'must be "on" or "off"'))]}function Ri(l,f,v,b){if(l===void 0)return[];if(!Array.isArray(l))return[e(f,"must be an array of paths")];return l.flatMap((k,F)=>{if(typeof k!=="string")return[e([...f,F],"must be a non-empty path string")];let G=v(k,b);return G===null?[]:[C([...f,F],G)]})}function fg(l){if(l===void 0)return!0;if(typeof l!=="number"||!Number.isInteger(l))return!1;return l>=De&&l<=Oe}var qc=(l,f)=>({path:l,message:f,kind:"unknownKeys"});function Pi(l){return!!l&&typeof l==="object"&&!Array.isArray(l)}function Vc(l,f){return{"safety.level":l.safety.level,...Ei("safety.overrides",l.safety.overrides),"workflow.worktree_mode":String(l.workflow.worktree_mode),"destructive_command_protection.enabled":String(l.destructive_command_protection.enabled),...Ei("destructive_command_protection.overrides",l.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":Di(l.destructive_command_protection.allow_paths),"secret_protection.enabled":String(l.secret_protection.enabled),...Ei("secret_protection.overrides",l.secret_protection.overrides),"secret_protection.deny_paths":Di(l.secret_protection.deny_paths),"secret_protection.allow_paths":Di(l.secret_protection.allow_paths),...f?{"audit.retention_days":String(l.audit.retention_days)}:{}}}function Zr(l,f,v){let b=Vc(l,v),k=Vc(f,v);return[...new Set([...Object.keys(b),...Object.keys(k)])].flatMap((F)=>b[F]===k[F]?[]:[{field:F,before:b[F],after:k[F]}])}function sr(l,f){let v=y(l,f);if(!zc(v))return{baseline:S(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,l.home),diagnostics:[]};let b=kn(v);return{baseline:S(b.value,l.home),diagnostics:b.errors.length>0?b.errors:Vt(b.value,l.home)}}function kn(l){if(!zc(l))return{errors:[`${l}: file not found`]};try{return{value:JSON.parse(mg(l,"utf-8")),errors:[]}}catch(f){let v=f instanceof Error?f.message:String(f);return{errors:[`${l}: ${f instanceof SyntaxError?`Invalid JSON: ${v}`:v}`]}}}function Xr(l,f){let v=gg(l)?l:{};return{version:f.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((b)=>v[b]!==void 0).map((b)=>[b,v[b]]))}}function Ei(l,f){return Object.fromEntries(Object.entries(f).flatMap(([v,b])=>b===void 0?[]:[[`${l}.${v}`,String(b)]]))}function Di(l){return l.length===0?"(none)":l.join(", ")}function gg(l){return!!l&&typeof l==="object"&&!Array.isArray(l)}import{chmodSync as hg,existsSync as Jc,mkdirSync as yg,readFileSync as Wc}from"node:fs";import{dirname as vg}from"node:path";function Kc(l,f={}){let v=y(l,f);if(!Jc(v))return{path:v,exists:!1,raw:"",policy:ne(),errors:[]};let b=Wc(v,"utf-8");if(!b.trim())return{path:v,exists:!0,raw:b,policy:ne(),errors:["Config file is empty"]};try{let k=JSON.parse(b),F=Vt(k,l.home);return{path:v,exists:!0,raw:b,policy:S(k,l.home),errors:F}}catch(k){return{path:v,exists:!0,raw:b,policy:ne(),errors:[`Invalid JSON: ${k instanceof Error?k.message:String(k)}`]}}}function tn(l,f,v={}){let b=y(l,v),k=Vt(f,l.home),F=k.length>0?ne():S(f,l.home);if(k.length>0)return{path:b,policy:F,errors:k};return yg(vg(b),{recursive:!0,mode:448}),x(V(b),`${JSON.stringify(F,null,2)}
`,384),hg(b,384),{path:b,policy:F,errors:[]}}function Yc(l,f){let v=Vt(f,l.home);if(v.length>0)return{errors:v};return{preview:rt(S(f,l.home),l.env),errors:[]}}function Zc(l,f={}){let v=y(l,f);if(!Jc(v))return tn(l,ge,f);let b=Wc(v,"utf-8");if(!b.trim())return tn(l,ge,f);try{return tn(l,S(JSON.parse(b),l.home),f)}catch{return tn(l,ge,f)}}var Xc=new Set(["check","apply"]),Qc="(unset)";async function td(l,f,v={}){let b=d({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},f),k=b.positionals[0],F=[...b.errors,...k&&!Xc.has(k)?[`Unknown policy subcommand: ${k}`]:[],...k&&Xc.has(k)&&!b.positionals[1]?[`policy ${k} requires a file`]:[],...b.positionals.slice(2).map((de)=>`Unexpected policy argument: ${de}`)];if(F.length>0){for(let de of F)console.error(de);return 1}let G=b.positionals[1];if(!k||!G)return In(ur,console.error),1;let z=b.flags.global?y(l):R(v.cwd??process.cwd()),J=kn(G),se=[...J.errors,...Vt(J.value,l.home).map((de)=>`${G}: ${de}`),...!b.flags.global&&Sg(J.value)&&J.value.audit!==void 0?[`${G}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(se.length>0){for(let de of se)console.error(de);return 1}let ae=S(J.value,l.home);if(console.log(`Scope: ${b.flags.global?"user":"project"} (${z})`),console.log(`Proposal: ${G}`),b.flags.global)ed(S(kn(z).value,l.home),ae,!0);if(!b.flags.global){let de=sr(l).baseline;console.log("Effective policy (user + project merged):"),ed(me(de,Le(kn(z).value,l.home).policy).policy,me(de,Le(J.value,l.home).policy).policy,!1)}if(k==="check")return 0;let le=v.input??process.stdin,be=v.output??process.stdout;if(!le.isTTY||!be.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${G}${b.flags.global?" --global":""}`),1;if(!await kg(`Apply this policy to ${z}? [y/N] `,le,be))return console.log("Cancelled; nothing was written."),0;return xg(l,z,J.value,ae,b.flags.global),console.log(`Policy applied: ${z}`),0}function kg(l,f,v){let b=wg({input:f,output:v,terminal:!1});return new Promise((k)=>{b.once("close",()=>k(!1)),b.question(l,(F)=>{k(/^y(es)?$/i.test(F.trim())),b.close()})})}function xg(l,f,v,b,k){if(k){tn(l,b);return}bg(Lg(f),{recursive:!0}),Nt(f,Xr(v,b))}function ed(l,f,v){let b=Zr(l,f,v);if(b.length===0){console.log("No changes.");return}console.log(`Changes (${b.length}):`);for(let k of b)console.log(`  ${k.field}: ${k.before??Qc} -> ${k.after??Qc}`)}function Sg(l){return!!l&&typeof l==="object"&&!Array.isArray(l)}import{join as Nh}from"node:path";var nd="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- Transparent wrappers have no built-in defaults. Configure only wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function Qr(l,f){if(!l.ok){ad(l);return}id(l,f)}function od(l,f,v){if(l.ok)console.log(v);if(!l.add){Qr(l,`Added rulebook source: ${f}`);return}if(!l.ok){ad(l);return}if(l.add.added.length>0)console.log(`Added ${l.add.added.length} ${l.add.added.length===1?"rulebook":"rulebooks"} from ${l.add.source} at ${l.add.ref}:`),l.add.added.forEach((b)=>{console.log(`  - ${b}`)});if(l.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${l.add.source} at ${l.add.ref}: ${l.add.alreadyConfigured.join(", ")}`);if(l.add.commits.length>0)console.log(`Vendored at ${l.add.commits.map((b)=>b.slice(0,7)).join(", ")}.`);id(l,"Rule config updated.")}function id(l,f){for(let v of l.changes??[])console.log(v);console.log(f),console.log(""),Cg(l.entries)}function Cg(l){if(l.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${l.length}):`);for(let f of l)console.log(`  - ${f.name} ${f.version} (${Rg(f.ruleCount)})`),console.log(`    Source: ${f.spec}`)}function Rg(l){return`${l} ${l===1?"rule":"rules"}`}function sd(l){xn("Active sources",l.rulebooks,(f)=>[`[${f.source}] ${f.name} ${f.version}`,`  Source: ${f.spec}`]),xn("Active rules",l.rules,(f)=>[`[${Eg(l,f.name)}] ${f.name}`,...Pg(f),`  Reason: ${f.reason}`]),xn("Disabled rules",rd(l,"off"),(f)=>[f.key]),xn("Reason overrides",rd(l,"reason"),(f)=>[f.key,`  Reason: ${f.value.reason}`]),xn("Transparent wrappers",l.transparent_wrappers,(f)=>[f]),xn("Issues",l.errors,(f)=>[f]),xn("Warnings",l.warnings,(f)=>[f])}function xn(l,f,v){if(f.length===0){console.log(`${l}: (none)`);return}console.log(`${l} (${f.length}):`);for(let b of f){let[k,...F]=v(b);console.log(`  - ${k}`);for(let G of F)console.log(`    ${G}`)}}function Pg(l){if(!l.match)return[`  Command: ${l.subcommand?`${l.command} ${l.subcommand}`:l.command}`,`  Block args: ${l.block_args.join(", ")}`];return[`  Command: ${[l.command,...l.match.command_path].join(" ")}`,...l.match.any_args?[`  Any args: ${l.match.any_args.join(", ")}`]:[],...l.match.exclude_args?[`  Exclude args: ${l.match.exclude_args.join(", ")}`]:[]]}function Eg(l,f){return l.rulebooks.find((v)=>v.rules.includes(f))?.source??"project"}function rd(l,f){return Object.entries({...l.userConfig?.overrides??{},...l.projectConfig?.overrides??{}}).filter((v)=>{if(f==="off")return v[1]==="off";return!!v[1]&&typeof v[1]==="object"}).map(([v,b])=>({key:v,value:b}))}function ad(l){for(let f of l.errors)console.error(f)}import{dirname as Ad,join as ao}from"node:path";import{join as Oi,resolve as Hg}from"node:path";function Ai(l){let f=w(l);if(f.errors.length>0)return{ok:!1,result:{ok:!1,errors:f.errors,entries:[]}};return{ok:!0,config:f.config??Pt}}function ld(l,f=[]){Nt(l,{version:1,rules:f,overrides:{},transparent_wrappers:[]})}function cd(l,f="project-rules"){Nt(l,{rulebook_version:1,name:f,version:"1.0.0",description:f==="project-rules"?"Project-specific CC Safety Net rules.":"User-specific CC Safety Net rules.",author:f==="project-rules"?"project":"user",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as ro}from"node:path";var Dg="custom.";function eo(l){if(l.rulebook_version!==2)return[];let f=l.rules.map((v)=>({name:v.name,command:v.command,block_args:[],match:v.match,reason:v.reason,intent:v.intent}));return(l.tests??[]).flatMap((v,b)=>{let k=_i(L(v.command));if(k.length===0)return[`tests[${b}]: could not parse fixture command: ${v.command}`];let F=k.reduce((G,z)=>G??O(z,f)?.id.slice(Dg.length),void 0);if(v.expect==="blocked"){if(F===v.rule)return[];let G=F?`"${F}" matched first`:"no rule matched";return[`tests[${b}]: expected "${v.rule}" to block "${v.command}" but ${G}`]}return F?[`tests[${b}]: expected "${v.command}" to be allowed but "${F}" matched`]:[]})}function _i(l){return l.nodes.flatMap((f)=>{if(f.kind==="group"||f.kind==="function")return _i(f.body);if(f.kind!=="command")return[];let v=Ne(he(f.dialect,f.words)).words.map(t);return[...v.length>0?[v]:[],...f.nested.flatMap((b)=>_i(b))]})}var $i="Rule synchronization exceeds CC Safety Net's safe resource limits.",to=Object.freeze({maxSources:pe,concurrency:4,maxRequests:131,maxResponseBytes:67108864});function no(l={}){return{requests:0,responseBytes:0,maxRequests:l.maxRequests??to.maxRequests,maxResponseBytes:l.maxResponseBytes??to.maxResponseBytes}}function nn(l){return{controller:new AbortController,budget:no(),resolveUrl:l}}function dd(l){return l instanceof Error&&l.message===$i}function ud(l){if(l.requests>=l.maxRequests)throw Error($i);l.requests++}function pd(l,f){if(f>l.maxResponseBytes-l.responseBytes)throw l.responseBytes+=f,Error($i);l.responseBytes+=f}var gd=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function fd(l,f,v=A(ro(ro(f)),"rules policy"),b=nn()){if(T(l))return Tg(l,b);return $g(l,f,v)}async function hd(l,f,v,b,k,F){if(!T(l))return fd(l,f,v,b);let G=k?null:Ag(l,f,v);if(G)return G;if(!k&&!F)throw Error(`${l} is not vendored; run rule update ${l} to vendor it`);return fd(l,f,v,b)}function Ag(l,f,v=A(ro(ro(f)),"rules policy")){let b=q(l),k=K(f,b.name),F=o(s(v,k));if(F===null)return null;let G=xe(Ti(F,`Invalid rulebook ${k}.`));if(G.name!==b.name)throw Error(`rulebook name "${G.name}" in ${k} must match "${b.name}"`);return{spec:l,rulebook:G,content:F}}async function yd(l,f={}){if(!ue(l))throw Error(`Invalid GitHub repository source: ${l}`);let[v,b]=l.split("/");if(!v||!b)throw Error(`Invalid GitHub repository source: ${l}`);if(f.ref!==void 0&&!Ce(f.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${f.ref}`);let k=f.operation??nn(),F=f.ref??await _g(v,b,l,k),G=await bd(v,b,F,l,k),z=await oo(`https://api.github.com/repos/${v}/${b}/git/trees/${G}?recursive=1`,"tree",k),J=z.response;if(!J.ok)throw Error(`Failed to inspect ${l}: GitHub tree returned ${J.status}`);let se=JSON.parse(z.content);if(!Array.isArray(se?.tree))throw Error(`Failed to inspect ${l}: unexpected GitHub tree response`);let ae=se.tree,le=[...new Set(ae.flatMap((be)=>{if(!be||typeof be!=="object")return[];let ye=be;if(ye.type!=="blob"||typeof ye.path!=="string")return[];let de=ye.path.match(Et);return de?.[1]?[de[1]]:[]}))].sort();if(le.length===0)throw Error(`No rulebooks found in ${l} under ${_e}/`);return{source:l,owner:v,repo:b,ref:F,commit:G,names:le}}async function _g(l,f,v,b){let k=await oo(`https://api.github.com/repos/${l}/${f}`,"metadata",b),F=k.response;if(!F.ok)throw Error(`Failed to inspect ${v}: GitHub returned ${F.status}`);let z=JSON.parse(k.content)?.default_branch;if(typeof z!=="string"||z==="")throw Error(`Failed to inspect ${v}: missing default branch`);if(!Ce(z))throw Error(`GitHub returned an invalid default branch: ${z}`);return z}function $g(l,f,v){Rt(l);let b=K(f,l),k=o(s(v,b));if(k===null)throw Error(`Rulebook source not found: ${l}`);let F=vd(Ti(k,"Invalid local rulebook source."));if(F.name!==l)throw Error(`rulebook name "${F.name}" must match local source "${l}"`);return{spec:l,rulebook:F,content:k}}async function Tg(l,f){let v=q(l),b=await bd(v.owner,v.repo,v.ref,l,f),k=await oo(`https://raw.githubusercontent.com/${v.owner}/${v.repo}/${b}/${v.path}`,"raw",f),F=k.response;if(!F.ok)throw Error(`Failed to fetch ${l}: GitHub raw returned ${F.status}`);let G=k.content,z=vd(Ti(G,"Invalid GitHub rulebook response."));if(z.name!==v.name)throw Error(`rulebook name "${z.name}" must match GitHub source "${v.name}"`);return{spec:l,rulebook:z,content:G}}function vd(l){let f=xe(l),v=eo(f);if(v.length>0)throw Error(v.join("; "));return f}function Ti(l,f){try{return JSON.parse(l)}catch{throw Error(f)}}async function bd(l,f,v,b,k){let F=await oo(`https://api.github.com/repos/${l}/${f}/commits/${encodeURIComponent(v)}`,"commit",k),G=F.response;if(!G.ok)throw Error(`Failed to resolve ${b}: GitHub returned ${G.status}`);let z=JSON.parse(F.content);if(typeof z?.sha!=="string"||z.sha==="")throw Error(`Failed to resolve commit for ${b}`);return z.sha}async function Ig(l,f,v={}){if(v.signal?.aborted)throw v.signal.reason;let b=v.budget??no(),k=new AbortController,F=()=>k.abort(v.signal?.reason);v.signal?.addEventListener("abort",F,{once:!0});let G=!1,z=setTimeout(()=>{if(k.signal.aborted)return;G=!0,k.abort()},v.timeoutMs??gd.timeoutMs);try{if(v.signal?.aborted)throw v.signal.reason;ud(b);let J=await(v.fetch??fetch)(l,{signal:k.signal,redirect:"error"});if(!J.ok)return Ld(J),{response:J,content:""};return{response:J,content:await Og(J,f,b,()=>k.abort())}}catch(J){if(G)throw Error("GitHub request timed out",{cause:J});if(v.signal?.aborted)throw v.signal.reason;throw J}finally{clearTimeout(z),v.signal?.removeEventListener("abort",F)}}function oo(l,f,v){return Ig(v.resolveUrl?.(l)??l,f,{budget:v.budget,signal:v.controller.signal})}async function Og(l,f,v=no(),b){let k=gd[`${f}Bytes`],F=Number(l.headers.get("content-length"));if(Number.isFinite(F)&&F>k)throw Ld(l),Error(`GitHub ${f} response exceeds ${k} bytes`);if(!l.body)return"";let G=l.body.getReader(),z=[],J=0;while(!0){let se=await G.read();if(se.done)break;try{pd(v,se.value.byteLength)}catch(ae){throw b?.(),md(G),ae}if(J+=se.value.byteLength,J>k)throw b?.(),md(G),Error(`GitHub ${f} response exceeds ${k} bytes`);z.push(Buffer.from(se.value))}return Buffer.concat(z,J).toString("utf-8")}function Ld(l){if(!l.body)return;wd(()=>l.body?.cancel())}function md(l){wd(()=>l.cancel())}function wd(l){try{Promise.resolve(l()).catch(()=>{})}catch{}}var jg=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function kd(l,f){let v=Cd(l.rules,f);if(v.length>0)return{ok:!0,specs:v};return Sd(l.rules,f)}function xd(l,f){let v=Cd(l,f);if(v.length>0)return{ok:!0,specs:v};let b=Ng(l,f);if(b.length>0)return{ok:!0,specs:b};let k=Mg(l,f);if(!k.ok)return k;if(k.specs.length>0)return{ok:!0,specs:k.specs};return Sd(l,f)}function Sd(l,f){let v=l.filter((b)=>Ii(b)?.name===f);if(v.length===1)return{ok:!0,specs:v};return Fg(f,v)}function Fg(l,f){return{ok:!1,result:{ok:!1,errors:f.length===0?[`No configured rulebook matches ${l}`]:[`Ambiguous rulebook match ${l}: ${f.join(", ")}`],entries:[]}}}function Cd(l,f){return l.filter((v)=>v===f)}function Ng(l,f){let v=f.match(jg),b=v?.[1],k=v?.[2],F=v?.[3];if(!b||!k||!F||!Ce(F))return[];return Rd(l,(G)=>G.owner===b&&G.repo===k&&G.ref===F)}function Mg(l,f){if(!ue(f))return{ok:!0,specs:[]};let[v,b]=f.split("/"),k=Rd(l,(G)=>G.owner===v&&G.repo===b);if(new Set(k.map((G)=>Ii(G)?.ref).filter((G)=>!!G)).size<2)return{ok:!0,specs:k};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${f}. Use an explicit ref:`,`  cc-safety-net rule remove ${f}#<ref>`],entries:[]}}}function Ii(l){try{return q(l)}catch{return null}}function Rd(l,f){return l.filter((v)=>{let b=Ii(v);return b?f(b):!1})}async function so(l,f={}){let v=ji(f);return Ug(l,v,await io(l,v,nn()))}function Ug(l,f,v){if(!v.ok)return v;let b=Mt(l,f),k=[...new Set(Q(b.configPath,b.filesystemScope))];if(k.length===0)return v;return{ok:!1,errors:k,entries:v.entries}}async function io(l,f,v,b={},k=new Set,F=new Set){try{let G=Mt(l,f),z=Ai(G.configTarget);if(!z.ok)return z.result;let J=z.config;if(f.check)return rh(J,G,f);let se=f.only?kd(J,f.only):{ok:!0,specs:J.rules};if(!se.ok)return se.result;let ae=new Set([...f.refresh?se.specs:[],...k]),le=(Xe)=>hd(Xe,G.configDir,G.filesystemScope,v,ae.has(Xe),!f.refresh||ae.has(Xe)),be=await Xg(J.rules,f.refresh?(Xe)=>le(Xe).then((At)=>({ok:!0,item:At})).catch((At)=>{if(dd(At))throw At;return{ok:!1,spec:Xe,message:At instanceof Error?At.message:String(At)}}):async(Xe)=>({ok:!0,item:await le(Xe)}),v),ye=be.filter((Xe)=>!Xe.ok),de=be.filter((Xe)=>Xe.ok).map((Xe)=>Xe.item),ce=de.flatMap((Xe)=>Gg(Xe,J.rules)),we=de.flatMap((Xe)=>Bg(Xe,F,G)),Ze=new Set([...ce,...we].map((Xe)=>Xe.spec)),Me=[...ye,...ce,...we],Ee=[],ht=Vg(Ee,()=>de.flatMap((Xe)=>Ze.has(Xe.spec)||Me.length>0&&F.has(Xe.spec)?[]:qg(Xe,G,b,Ee)));return{ok:Me.length===0,errors:Me.map((Xe)=>`Failed to update ${Xe.spec}: ${Xe.message}`),entries:de.map(Jg),changes:ht}}catch(G){return lr(G)}}function Gg(l,f){if(!T(l.spec))return[];let v=nt(l.spec),b=f.filter((k)=>k!==l.spec&&nt(k).toLowerCase()===v.toLowerCase());if(b.length===0)return[];return[{ok:!1,spec:l.spec,message:`rulebook name "${v}" is also claimed by ${b.join(", ")}; rename one of them`}]}function Bg(l,f,v){if(!f.has(l.spec)||!T(l.spec))return[];let b=K(v.configDir,l.rulebook.name),k=o(s(v.filesystemScope,b));if(k===null||k===l.content)return[];return[{ok:!1,spec:l.spec,message:`${b} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function qg(l,f,v,b){if(!T(l.spec))return[];let k=K(f.configDir,l.rulebook.name),F=s(f.filesystemScope,k),G=o(F);if(G===l.content)return[];return b?.push({target:F,previous:G}),x(F,l.content,void 0,v._testAfterPolicyRename),zg(l,G)}function Vg(l,f){try{return f()}catch(v){for(let b of[...l].reverse()){if(b.previous===null){Z(b.target);continue}x(b.target,b.previous)}throw v}}function zg(l,f){if(f===null)return[`Vendored ${l.spec} (${l.rulebook.version})`];let v=Ie(f),b="problem"in v?null:v.rulebook,k=new Map(b?.rules.map((G)=>[G.name,JSON.stringify(G)])??[]),F=new Set(l.rulebook.rules.map((G)=>G.name));return[`Updated ${l.spec} (${b?.version??"unreadable"} -> ${l.rulebook.version})`,...[...F].filter((G)=>!k.has(G)).map((G)=>`  + ${G}`),...[...k.keys()].filter((G)=>!F.has(G)).map((G)=>`  - ${G}`),...l.rulebook.rules.filter((G)=>{let z=k.get(G.name);return z!==void 0&&z!==JSON.stringify(G)}).map((G)=>`  ~ ${G.name}`)]}function Jg(l){return{spec:l.spec,name:l.rulebook.name,version:l.rulebook.version,ruleCount:l.rulebook.rules.length}}async function Pd(l,f,v={}){return Wg(l,f,eh(v),nn())}async function Wg(l,f,v,b,k={}){let F=null,G=!1;try{let z=Mt(l,v),J=o(z.configTarget);F={target:z.configTarget,content:J};let se=Ai(z.configTarget);if(!se.ok)return se.result;let ae=se.config,le=ue(f);Kg(f,v,le);let be=le?await yd(f,{ref:v.ref,operation:b}):null,ye=be?Yg(be,v.rulebooks):[],de=be?ye.map((Ee)=>Zg(ae.rules,be,Ee)??`${f}#${be.ref}/${Ee}`):[f],ce=de.filter((Ee)=>!ae.rules.includes(Ee)),we=[...ae.rules,...ce];if(we.length>pe)return Qg();if(we.length!==ae.rules.length)G=!0,Nt(z.configTarget,{version:1,rules:we,overrides:ae.overrides??{},transparent_wrappers:ae.transparent_wrappers??[]},void 0,k._testAfterPolicyRename);let Ze=await io(l,v,b,k,new Set(ce),new Set(ce));if(!Ze.ok)ar(z.configTarget,J);if(!Ze.ok||!be)return Ze;let Me=ye.filter((Ee,ht)=>ce.includes(de[ht]??""));return{...Ze,add:{source:f,ref:be.ref,selected:ye,added:Me,alreadyConfigured:ye.filter((Ee)=>!Me.includes(Ee)),commits:ce.length>0?[be.commit]:[]}}}catch(z){if(G&&F)try{ar(F.target,F.content)}catch(J){return lr(J)}return lr(z)}}function Kg(l,f,v){if(!v&&f.rulebooks!==void 0)throw Error("--only can only select rulebooks from an owner/repo source");if(!v&&f.ref)throw Error(`--ref can only select a ref for an owner/repo source: ${l}`);if(f.rulebooks?.length===0)throw Error("--only requires at least one rulebook name");let b=f.rulebooks?.filter((k)=>!h.test(k))??[];if(b.length>0)throw Error(`Invalid rulebook names: ${b.join(", ")}`)}function Yg(l,f){let v=f?[...new Set(f)]:l.names,b=v.filter((k)=>!l.names.includes(k));if(b.length>0)throw Error(`Rulebooks not found in ${l.source} at ${l.ref}: ${b.join(", ")}
Available rulebooks: ${l.names.join(", ")}`);return v}function Zg(l,f,v){let b=`${f.source}#${f.ref}/${v}`;if(l.includes(b))return b;let k=`${f.source}#${f.commit}/${v}`;return l.find((F)=>F===k)}async function Xg(l,f,v=nn()){if(l.length>pe)throw Error(Te);let b=Array(l.length),k=0,F,G=Array.from({length:Math.min(l.length,to.concurrency)},async()=>{while(!F){let z=k;if(z>=l.length)return;k++;try{b[z]=await f(l[z],z,v.controller.signal)}catch(J){if(!F)F={value:J},k=l.length,v.controller.abort(J);return}}});if(await Promise.all(G),F)throw F.value;return b}function Qg(){return{ok:!1,errors:[Te],entries:[]}}function ji(l){return{cwd:l.cwd,userConfigDir:l.userConfigDir,userConfigPath:l.userConfigPath,projectConfigPath:l.projectConfigPath,global:l.global,check:l.check,only:l.only,refresh:l.refresh}}function eh(l){return{...ji(l),ref:l.ref,rulebooks:l.rulebooks}}function th(l){return{...ji(l),deleteSource:l.deleteSource}}async function Ed(l,f,v={}){try{return await nh(l,f,th(v),{})}catch(b){return lr(b)}}async function nh(l,f,v,b){let k=Mt(l,v),F=w(k.configTarget);if(F.errors.length>0)return{ok:!1,errors:F.errors,entries:[]};if(!F.config)return{ok:!1,errors:[`No config found at ${k.configPath}`],entries:[]};let G=xd(F.config.rules,f);if(!G.ok)return G.result;let z=v.deleteSource?oh(k.configDir,G.specs,k.filesystemScope):{ok:!0,dirs:[]};if(!z.ok)return z.result;let J=o(k.configTarget);if(J===null)return lr(Error("Rules config is unavailable."));try{Nt(k.configTarget,{version:1,rules:F.config.rules.filter((le)=>!G.specs.includes(le)),overrides:F.config.overrides??{},transparent_wrappers:F.config.transparent_wrappers??[]},void 0,b._testAfterPolicyRename)}catch(le){throw ar(k.configTarget,J),le}let se=await io(l,v,nn(),b);if(!se.ok)return ar(k.configTarget,J),se;let ae=ih(z.dirs,b,k.filesystemScope);if(!ae.ok){ar(k.configTarget,J);let le=await io(l,v,nn(),b);if(!le.ok)return{ok:!1,errors:[...ae.result.errors,...le.errors],entries:le.entries};return ae.result}return se}async function rh(l,f,v){let b=He(l,f.configDir,v.global?"user":"project",f.filesystemScope);return{ok:b.errors.length===0&&b.warnings.length===0,errors:[...b.errors,...b.warnings],entries:b.entries}}function oh(l,f,v){let b=f.flatMap((z)=>h.test(z)?[]:["--delete-source can only delete local rulebook sources"]),k=f.map((z)=>Oi(l,z)),F=b.length>0?[]:k.flatMap((z)=>Dd(z,v)),G=[...b,...F];return G.length>0?{ok:!1,result:{ok:!1,errors:G,entries:[]}}:{ok:!0,dirs:k}}function Dd(l,f){let v=Hg(l),b=s(f,v),k=Re(b);if(!k)return[`Local rulebook source directory not found: ${l}`];let F=k.find((G)=>G.name==="rulebook.json");if(!F)return[`Local rulebook source directory is missing rulebook.json: ${l}`];if(F.kind!=="file")throw new i(f.label);if(o(s(f,Oi(v,"rulebook.json"))),k.length>1)return[`Local rulebook source directory contains extra files: ${l}. delete manually if you really want to remove the directory.`];return[]}function ih(l,f,v){let b=l.flatMap((k)=>{try{if(!Re(s(v,k)))return[];let F=Dd(k,v);if(F.length>0)return F;return sh(k,f,v),[]}catch(F){return[`Failed to delete local rulebook source ${k}: ${F instanceof Error?F.message:String(F)}`]}});return b.length>0?{ok:!1,result:{ok:!1,errors:b,entries:[]}}:{ok:!0}}function sh(l,f,v){if(f._testDeleteLocalSourceDir){f._testDeleteLocalSourceDir(l);return}Z(s(v,Oi(l,Pe))),kt(s(v,l))}function ar(l,f){if(f===null){Z(l);return}x(l,f)}function lr(l){return{ok:!1,errors:[l instanceof Error?l.message:String(l)],entries:[]}}var ah=".safety-net.json",lh="~/.cc-safety-net/config.json";async function Td(l,f){return[await _d(l,{legacyPath:Vs({cwd:f.cwd}),configPath:H(f.cwd),defaultRulebookName:"project-rules",migratedFrom:ah,cleanup:f.cleanup,syncOptions:{cwd:f.cwd}}),await _d(l,{legacyPath:gr(l),configPath:W(l),defaultRulebookName:"user-rules",migratedFrom:lh,cleanup:f.cleanup,syncOptions:{cwd:f.cwd,global:!0}})].every((b)=>b)?0:1}async function _d(l,f){let v=Mt(l,f.syncOptions),b=s(v.filesystemScope,f.legacyPath),k=o(b);if(k===null)return console.log(`No legacy config found at ${f.legacyPath}`),!0;let F=dh(k);if(!F.ok){for(let ye of F.errors)console.error(ye);return!1}let G=w(v.configTarget);if(G.errors.length>0){for(let ye of G.errors)console.error(ye);return!1}let z=G.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},J=uh(Ad(f.configPath),z.rules,f.defaultRulebookName,f.migratedFrom,v.filesystemScope),se=ao(Ad(f.configPath),J,"rulebook.json"),ae=s(v.filesystemScope,se),le=[$d(v.configTarget),$d(ae)],be=await ch(l,f,v.configTarget,ae,J,F.config.rules,z.rules.includes(J)?z.rules:[...z.rules,J],z.overrides??{},z.transparent_wrappers??[]);if(!be.ok){mh(le);for(let ye of be.errors)console.error(ye);return!1}if(!f.cleanup)return console.log(`Migrated legacy config at ${f.legacyPath}. Legacy file is no longer used.`),!0;if(!fh(v.configTarget,ae,J,f.migratedFrom,F.config.rules))return console.error(`Migration cleanup verification failed for ${f.legacyPath}`),!1;return Z(b),console.log(`Deleted legacy config at ${f.legacyPath}`),!0}async function ch(l,f,v,b,k,F,G,z,J){try{return Nt(v,{version:1,rules:G,overrides:z,transparent_wrappers:J}),Nt(b,ph(k,f.migratedFrom,F)),await so(l,f.syncOptions)}catch(se){return{ok:!1,errors:[se instanceof Error?se.message:String(se)]}}}function dh(l){try{let f=JSON.parse(l),v=yo(f);if(v.errors.length>0)return{ok:!1,errors:v.errors};return{ok:!0,config:{version:1,rules:f.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function uh(l,f,v,b,k){let F=f.find((G)=>gh(s(k,ao(l,G,"rulebook.json")))===b);if(F)return F;if(o(s(k,ao(l,v,"rulebook.json")))===null)return v;for(let G=2;;G++){let z=`${v}-${G}`;if(o(s(k,ao(l,z,"rulebook.json")))===null)return z}}function ph(l,f,v){return{rulebook_version:1,name:l,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:f,allowed_commands:[...new Set(v.map((b)=>b.command))],rules:v,tests:v.map((b)=>({command:[b.command,b.subcommand,b.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:b.name}))}}function fh(l,f,v,b,k){if(!w(l).config?.rules.includes(v))return!1;try{let G=o(f);if(G===null)return!1;let z=JSON.parse(G);return z.migrated_from===b&&JSON.stringify(z.rules)===JSON.stringify(k)}catch{return!1}}function $d(l){return{target:l,content:o(l)}}function mh(l){for(let f of l){if(f.content===null){Z(f.target);continue}x(f.target,f.content)}}function gh(l){let f=o(l);if(f===null)return null;try{let v=JSON.parse(f);return typeof v.migrated_from==="string"?v.migrated_from:null}catch{return null}}import{mkdir as hh,readFile as yh,writeFile as vh}from"node:fs/promises";import{dirname as bh,join as Lh}from"node:path";var wh=86400000,kh=604800000;async function Od(l,f=Date.now()){if(l.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let v=pt(l);if(!v)return null;let b=Lh(v,".cc-safety-net","update-check.json"),k=await xh(b,f);if(!k.lastCheck||f-k.lastCheck>wh){let z=await on();if(k.lastCheck=f,z.latestVersion)k.latestVersion=z.latestVersion;if(!await Id(b,k))return null;if(z.error)return null}let F=k.latestVersion,G=It();if(!F||!xo(F,G))return null;if(k.notifiedVersion===F&&k.notifiedAt!==void 0&&f-k.notifiedAt<kh)return null;if(k.notifiedVersion=F,k.notifiedAt=f,!await Id(b,k))return null;return`UPDATE_AVAILABLE: cc-safety-net v${F} is available (running v${G}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function xh(l,f){let v=await yh(l,"utf8").then((F)=>JSON.parse(F)).catch(()=>{return});if(!v||typeof v!=="object"||Array.isArray(v))return{};let b=v,k=(F)=>typeof F==="number"&&Number.isFinite(F)&&F<=f?F:void 0;return{lastCheck:k(b.lastCheck),latestVersion:typeof b.latestVersion==="string"?b.latestVersion:void 0,notifiedVersion:typeof b.notifiedVersion==="string"?b.notifiedVersion:void 0,notifiedAt:k(b.notifiedAt)}}async function Id(l,f){return hh(bh(l),{recursive:!0,mode:448}).then(()=>vh(l,JSON.stringify(f),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as Sh,resolve as Fi}from"node:path";var jd="CC Safety Net Config",Ch="═".repeat(jd.length),Rh="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",Ph=new Set(["rule.json","rule.lock","cache"]);function Fd(l,f={}){try{return Eh(l,f)}catch(v){if(v instanceof i)return console.error(v.message),1;throw v}}function Eh(l,f){let v=f.cwd??process.cwd(),b=f.userConfigPath??W(l),k=f.projectConfigPath??H(v),F=f.legacyUserConfigPath??gr(l),G=f.legacyProjectConfigPath??ms(v),z=Fi(v,_e),J=X(l,{cwd:v,userConfigPath:b,projectConfigPath:k}),se=X(l,{cwd:v}),ae=s(J.userScope,b),le=s(J.projectScope,k),be=f.legacyUserConfigPath?V(f.legacyUserConfigPath,"user policy"):s(se.userScope,F),ye=f.legacyProjectConfigPath?V(f.legacyProjectConfigPath,"project policy"):s(se.projectScope,G),de=!1,ce=!1,we=[],Ze=[],Me=Dh(s(se.projectScope,z));if(_h(),o(ae)!==null){let Ee=rn(ae);if(Ee.errors.push(...Q(b,J.userScope)),we.push({scope:"User",path:b,result:Ee,schema:"rules",target:ae}),Ee.errors.length>0)de=!0}if(o(be)!==null)if(ce=!0,o(ae)!==null)Ze.push(lo("user","cleanup"));else{let Ee=vo(be);if(we.push({scope:"User",path:F,result:Ee,schema:"legacy",inactive:!0,target:be}),Ze.push(lo("user",Ee.errors.length>0?"fix-or-delete":"migrate")),Ee.errors.length>0)de=!0}if(o(le)!==null){let Ee=rn(le);if(Ee.errors.push(...Q(k,J.projectScope)),we.push({scope:"Project",path:Fi(k),result:Ee,schema:"rules",target:le}),Ee.errors.length>0)de=!0;if(o(ye)!==null)ce=!0,Ze.push(lo("project","cleanup"))}else if(o(ye)!==null){ce=!0,de=!0;let Ee=vo(ye);we.push({scope:"Project",path:Fi(G),result:Ee,schema:"legacy",inactive:!0,target:ye}),Ze.push(lo("project",Ee.errors.length>0?"fix-or-delete":"migrate"))}if(Me?.result.errors.length)de=!0;if(we.length===0&&!Me)return console.log(`
No config files found. Using built-in rules only.`),0;for(let Ee of we)if(Ee.inactive)Th(Ee.scope,Ee.path,Ee.result);else if(Ee.result.errors.length>0)Ih(Ee.scope,Ee.path,Ee.result.errors);else{if(Ee.schema==="rules"&&Fh(Ee.target))console.log(`
Added $schema to ${Ee.scope.toLowerCase()} config.`);$h(Ee.scope,Ee.path,Ee.result,Ee.schema)}for(let Ee of Ze)console.error(`
${Je.red(Ee)}`);if(Me)if(Me.result.errors.length>0)jh(Me.path,Me.result.errors);else Oh(Me.path,Me.result);if(de)return console.error(`
Config validation failed.`),1;return console.log(ce?`
Configs valid with warnings.`:`
All configs valid.`),0}function lo(l,f){let v=`legacy ${l} config`;if(f==="cleanup")return`Warning: Legacy ${l} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(f==="migrate")return`Warning: Legacy ${l} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${l} config is no longer supported. Fix or delete the ${v}, then run \`npx -y cc-safety-net rule migrate\`.`}function Dh(l){if(Re(l)===null)return null;let f=Ah(l);if(f.ruleNames.size===0&&f.errors.length===0)return null;return{path:l.path,result:f}}function Ah(l){let f=[],v=new Set,b=(Re(l)??[]).filter((k)=>!Ph.has(k.name)).sort((k,F)=>k.name.localeCompare(F.name));if(b.length===0)return{errors:f,ruleNames:v};for(let k of b){if(!h.test(k.name)){f.push(`rulebook directory names must match ${h}: ${k.name}`);continue}if(k.kind!=="directory"){f.push(`${k.name} must be a rulebook directory`);continue}let F=s(l.scope,Sh(l.path,k.name,"rulebook.json")),G=o(F);if(G===null){f.push(`${k.name}/rulebook.json is required`);continue}try{let z;try{z=JSON.parse(G)}catch{f.push(`${k.name}/rulebook.json: invalid JSON`);continue}let J=xe(z);if(J.name!==k.name){f.push(`rulebook name "${J.name}" must match folder "${k.name}"`);continue}let se=eo(J);if(se.length>0){f.push(...se.map((ae)=>`${k.name}/rulebook.json: ${ae}`));continue}v.add(k.name)}catch(z){f.push(z instanceof Error?`${k.name}/rulebook.json: ${z.message}`:`${k.name}/rulebook.json: ${String(z)}`)}}return{errors:f,ruleNames:v}}function _h(){console.log(jd),console.log(Ch)}function $h(l,f,v,b){if(console.log(`
✓ ${l} config: ${f}`),console.log(`  Schema: ${b==="rules"?"rulebook sources":"legacy inline rules"}`),v.ruleNames.size>0){console.log(`  ${b==="rules"?"Sources":"Rules"}:`);let k=1;for(let F of v.ruleNames)console.log(`    ${k}. ${F}`),k++}else console.log(`  ${b==="rules"?"Sources":"Rules"}: (none)`)}function Th(l,f,v){if(console.error(`
✗ Legacy ${l.toLowerCase()} config: ${f}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),v.errors.length>0){console.error("  Errors:");let b=1;for(let k of v.errors)for(let F of k.split("; "))console.error(`    ${b}. ${F}`),b++;return}if(v.ruleNames.size>0){console.error("  Rules:");let b=1;for(let k of v.ruleNames)console.error(`    ${b}. ${k}`),b++;return}console.error("  Rules: (none)")}function Ih(l,f,v){Nd(`${l} config`,f,v)}function Oh(l,f){console.log(`
✓ GitHub source rules: ${l}`),console.log("  Rulebooks:");let v=1;for(let b of f.ruleNames)console.log(`    ${v}. ${b}`),v++}function jh(l,f){Nd("GitHub source rules",l,f)}function Nd(l,f,v){console.error(`
✗ ${l}: ${f}`),console.error("  Errors:");let b=1;for(let k of v)for(let F of k.split("; "))console.error(`    ${b}. ${F}`),b++}function Fh(l){try{let f=o(l);if(f===null)return!1;let v=JSON.parse(f);if(v.$schema)return!1;return x(l,JSON.stringify({$schema:Rh,...v},null,2)),!0}catch(f){if(f instanceof i)throw f;return!1}}var Md=new Set(["init","add","remove","update","sync","list","wrapper","migrate","doc","verify"]),Mh=new Set(["add","remove","list"]),Hh="cc-safety-net/rulebooks";async function Hd(l,f){try{return await Uh(l,f)}catch(v){if(v instanceof i)return console.error(v.message),1;throw v}}async function Uh(l,f){let v=Bh(f),b=v.help?Gh(v.positionals):null;if(b)return In(b),0;if(v.errors.length>0){for(let z of v.errors)console.error(z);return 1}let k=v.positionals[0];if(!k)return In(Cn,console.error),1;let F=v.positionals[1],G={global:v.global};if(k==="init"){let z=Mt(l,G);Jh(z.configTarget);let J=Nh(z.configDir,"example-rules","rulebook.json"),se=s(z.filesystemScope,J);if(v.example&&o(se)===null)cd(se,"example-rules");let ae=Q(z.configPath,z.filesystemScope);for(let le of ae)console.error(le);if(ae.length>0)return 1;return console.log("Rule config initialized."),0}if(k==="add"){let z=Ud(v);if(!z)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let J=Mt(l,G),se=await Pd(l,z,{...G,ref:v.ref,rulebooks:v.only.length>0?v.only:void 0});return od(se,z,`Scope: ${v.global?"user":"project"} (${J.configDir})`),se.ok?0:1}if(k==="remove"){if(!F)return console.error("rule remove requires a source"),1;let z=await Ed(l,F,{...G,deleteSource:v.deleteSource});return Qr(z,`Removed rulebook source: ${F}`),z.ok?0:1}if(k==="update"){let z=await so(l,{...G,only:F,refresh:!0});return Qr(z,"Rule config updated."),z.ok?0:1}if(k==="sync")return Ws(l,{global:v.global});if(k==="list"){let z=fe(l,{cwd:process.cwd()});return sd(z),z.errors.length>0?1:0}if(k==="wrapper")return Wh(l,v);if(k==="migrate")return Td(l,{cleanup:v.cleanup,cwd:process.cwd()});if(k==="doc"){console.log(nd);let z=await Od(l);if(z)console.error(z);return 0}if(k==="verify")return Fd(l);return 1}function Gh(l){if(l.length===0)return Cn;let f=Cn.subcommands.filter((b)=>b.usage.split(" ")[0]===l[0]);if(f.length===0)return null;if(l.length===1&&f.length>1)return{name:`rule ${l[0]}`,description:`Subcommands of rule ${l[0]}`,usage:`rule ${l[0]} <subcommand>`,subcommands:f,options:[]};let v=l.length===1?f[0]:f.find((b)=>b.usage.split(" ")[1]===l[1]);if(!v)return null;return{name:`rule ${l[0]}`,description:v.description,usage:`rule ${v.usage}`,options:l[0]==="add"?mo:[],examples:l[0]==="add"?go:void 0}}function Bh(l){let f=d({label:"rule",booleans:{global:["-g","--global"],check:["--check"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"]},lists:{only:["--only"]},positionals:"list"},l),v={...f.flags,ref:f.values.ref,only:f.lists.only??[],help:f.help,positionals:f.positionals,errors:f.errors};return qh(v),v}function qh(l){let[f]=l.positionals;if(f&&!Md.has(f))l.errors.push(`Unknown rule subcommand: ${f}`);if(l.deleteSource&&f!=="remove")if(f&&Md.has(f))l.errors.push(`Unknown option for rule ${f}: --delete-source`);else l.errors.push("--delete-source is only valid with 'rule remove'");if(l.check&&f)l.errors.push(Hn(f,"--check"));if(l.cleanup&&f!=="migrate")l.errors.push(Hn(f,"--cleanup"));if(l.example&&f!=="init")l.errors.push(Hn(f,"--example"));if(l.ref&&f!=="add")l.errors.push(Hn(f,"--ref"));if(l.only.length>0&&f!=="add")l.errors.push(Hn(f,"--only"));if(f==="add")Vh(l);if(f==="migrate"){if(l.global)l.errors.push(Hn(f,"--global"));if(l.positionals.length>1)l.errors.push(`Unexpected rule migrate argument: ${l.positionals[1]}`)}else if(f==="wrapper")zh(l);else if(l.positionals.length>2)l.errors.push(`Unexpected rule argument: ${l.positionals[2]}`);if(f==="list"&&l.global)l.errors.push("Unknown option for rule list: --global")}function Ud(l){if(l.positionals[1])return l.positionals[1];if(l.ref||l.only.length>0)return Hh;return}function Vh(l){let f=Ud(l);if(!f)return;if((l.ref||l.only.length>0)&&!ue(f)){if(l.ref)l.errors.push(`--ref can only select a ref for an owner/repo source: ${f}`);if(l.only.length>0)l.errors.push("--only can only select rulebooks from an owner/repo source");return}if(l.ref&&!Ce(l.ref))l.errors.push(`--ref must use valid path segments: ${l.ref}`);let v=l.only.filter((b)=>!h.test(b));if(v.length>0)l.errors.push(`Invalid rulebook names: ${v.join(", ")}`)}function Hn(l,f){return l?`Unknown option for rule ${l}: ${f}`:`Unknown option for rule: ${f}`}function zh(l){let f=l.positionals[1],v=l.positionals[2];if(!f){l.errors.push("rule wrapper requires add, remove, or list");return}if(!Mh.has(f)){l.errors.push(`Unknown rule wrapper action: ${f}`);return}if(f==="list"){if(v)l.errors.push(`Unexpected rule wrapper argument: ${v}`);return}if(!v){l.errors.push(`rule wrapper ${f} requires a command`);return}if(l.positionals.length>3)l.errors.push(`Unexpected rule wrapper argument: ${l.positionals[3]}`)}function Jh(l){if(o(l)===null){ld(l);return}let f=w(l);if(!f.config)return;Nt(l,{version:1,rules:f.config.rules,overrides:f.config.overrides??{},transparent_wrappers:f.config.transparent_wrappers??[]})}async function Wh(l,f){let v=f.positionals[1],b=f.positionals[2],k=Mt(l,{global:f.global}).configTarget;if(v==="list"){let J=w(k);if(J.errors.length>0){for(let se of J.errors)console.error(se);return 1}return Kh(J.config?.transparent_wrappers??[]),0}if(!b||!I.test(b))return console.error("transparent wrapper must match command pattern"),1;if(Qe(b))return console.error(`reserved command "${b}" cannot be a wrapper`),1;let F=w(k);if(F.errors.length>0){for(let J of F.errors)console.error(J);return 1}let G=F.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},z=v==="add"?[...new Set([...G.transparent_wrappers??[],b])]:(G.transparent_wrappers??[]).filter((J)=>J!==b);return Nt(k,{version:1,rules:G.rules,overrides:G.overrides??{},transparent_wrappers:z}),console.log(v==="add"?`Added transparent wrapper: ${b}`:`Removed transparent wrapper: ${b}`),0}function Kh(l){if(l.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${l.length}):`);for(let f of l)console.log(`  - ${f}`)}import{sep as t0}from"node:path";import{existsSync as Yh,readFileSync as Zh}from"node:fs";import{join as Xh}from"node:path";async function Qh(l){if(l.isTTY)return null;return(await Fe(l).catch(()=>null))?.trim()||null}function e0(l){let f=l.env.get("CLAUDE_SETTINGS_PATH");if(f)return f;return Xh(l.home,".claude","settings.json")}function Ni(l){let f=e0(l);if(!Yh(f))return!1;try{let v=Zh(f,"utf-8"),b=JSON.parse(v);if(!b.enabledPlugins)return!1;let k="cc-safety-net@cc-marketplace";if(!(k in b.enabledPlugins))return!1;return b.enabledPlugins[k]===!0}catch(v){if(_(r.debug,l.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${f}: ${v instanceof Error?v.message:String(v)}`);return!1}}async function Mi(l,f=process.stdin){let v=Ni(l),b;if(!v)b="\uD83D\uDEE1️ CC Safety Net ❌";else{let F=D(l,{cwd:process.cwd()}),G=F.policy,z=M(G,l.env),J=Object.values(te(G,z.capabilities)).some((le)=>le.changesInherited),se={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[J?"custom":z.effectiveLevel],ae=(F.policyScopes?.weakenings.length??0)>0?"\uD83D\uDD3B":"";b=`\uD83D\uDEE1️ CC Safety Net ${se}${z.worktreeMode?"\uD83C\uDF33":""}${ae}${F.state==="degraded"?"⚠️":""}`}let k=await Qh(f);if(k&&!k.startsWith("{"))console.log(`${k} | ${b}`);else console.log(b)}function Gd(l){let f=D(l,{cwd:process.cwd()}),v=f.policy,b=M(v,l.env),k=!!process.env.NO_COLOR||!process.stdout.isTTY,F=Math.min(process.stdout.columns||80,100),G=k?"ok":"✔",z=k?"OFF":"✘",J=(ce,we)=>{let Ze=`  ${ce.padEnd(13)}${we}`;return(Ze.length>F?`${Ze.slice(0,F-1)}…`:Ze).replaceAll(z,Je.red(z))},se=Object.values(te(v,b.capabilities)).some((ce)=>ce.changesInherited),ae=(ce)=>ce===l.home||ce.startsWith(`${l.home}${t0}`)?`~${ce.slice(l.home.length)}`:ce,le={ready:Je.green,degraded:Je.yellow}[f.state],be=f.policyScopes?.weakenings??[],ye=[...Ni(l)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...f.diagnostics],de=k?"-":"·";console.log([`${k?"":"\uD83D\uDEE1️  "}CC Safety Net — ${le(f.state)}`,"",J("Protection",`destructive ${v.destructiveCommandProtectionEnabled?G:z}   secrets ${v.secretProtection.enabled?G:z}`),J("Level",se?`${b.effectiveLevel} (customised)`:b.effectiveLevel),J("Rules",v.rules.length===0?"none active":`${v.rules.length} active`),J("Policy",ae(y(l))),...f.policyScopes?[J("Project",ae(R(process.cwd())))]:[],...b.worktreeMode?[J("Worktree","relaxations active")]:[],"",...be.length===0?[]:["  Project policy",...be.flatMap((ce)=>Qn(ce,"      ",F-6).map((we,Ze)=>Ze===0?`    ${we}`:we)),""],...ye.length===0?["  Everything configured is active."]:["  Not active",...ye.flatMap((ce)=>Qn(ce,"      ",F-6).map((we,Ze)=>Ze===0?`    ${de} ${we}`:we)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as Qd}from"node:child_process";import{randomBytes as u0}from"node:crypto";import{existsSync as p0}from"node:fs";import{createServer as f0}from"node:http";import{Writable as m0}from"node:stream";var co=500;function n0(l){let f=l.filter((k)=>k.decision!=="allow"),v=l.filter((k)=>k.decision==="allow"),b=Math.min(f.length,Math.max(co-v.length,Math.ceil(co/2)));return[...f.slice(0,b),...v.slice(0,co-b)]}function Bd(l,f,v=Y(l)){if(v)ie(l,v);let b=(we)=>new Date(we.getFullYear(),we.getMonth(),we.getDate()).getTime(),k=b(new Date),F=new Date(k);F.setDate(F.getDate()-(f-1));let G=F.getTime(),z=[],J={count:0};for(let we of v?dn(v,J):[])for(let Ze of Sn(we,J)){if(!Ze||typeof Ze.ts!=="string"||typeof Ze.command!=="string")continue;let Me=new Date(Ze.ts).getTime();if(!Number.isFinite(Me))continue;if(Me>=G)z.push(Ze)}z.sort((we,Ze)=>new Date(Ze.ts).getTime()-new Date(we.ts).getTime());let se=Array.from({length:f},()=>0),ae=Array.from({length:f},()=>0),le={},be={},ye={},de=0,ce=0;for(let we of z){let Ze=we.agent||"unknown";le[Ze]=(le[Ze]??0)+1;let Me=Math.round((k-b(new Date(we.ts)))/86400000),Ee=f-1-Me,ht=Me>=0&&Me<f;if(ht)ae[Ee]=(ae[Ee]??0)+1;if(we.decision!=="allow"){if(de++,we.ruleId)be[we.ruleId]=(be[we.ruleId]??0)+1;let Xe=dr(we.segment||we.command);if(Xe)ye[Xe]=(ye[Xe]??0)+1;if(we.failureStage)ce++;if(ht)se[Ee]=(se[Ee]??0)+1}}return{days:f,logsDir:v,homeDir:l.home,totalInWindow:z.length,truncated:z.length>co,unreadable:J.count,counts:{blocked:de,allowed:z.length-de,agents:le,blockedByDay:se,analyzedByDay:ae,rules:be,commands:ye,errors:ce},entries:n0(z).sort((we,Ze)=>new Date(Ze.ts).getTime()-new Date(we.ts).getTime())}}import{spawn as r0}from"node:child_process";import{existsSync as o0,statSync as qd}from"node:fs";import{delimiter as i0,join as s0}from"node:path";var a0=120000,uo="Choose the project folder",l0=`try
  return POSIX path of (choose folder with prompt "${uo}")
on error number -128
  return ""
end try`,c0=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${uo}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Vd=[{binary:"zenity",args:["--file-selection","--directory",`--title=${uo}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",uo]}],zd=(l,f)=>(f.PATH??"").split(i0).some((v)=>{if(v.length===0)return!1;try{let b=qd(s0(v,l));return b.isFile()&&(b.mode&73)!==0}catch{return!1}});function Hi(l,f){if(l==="darwin"||l==="win32")return!0;if(l!=="linux")return!1;if(!f.DISPLAY&&!f.WAYLAND_DISPLAY)return!1;return Vd.some((v)=>zd(v.binary,f))}function d0(l,f){if(l==="darwin")return{cmd:"osascript",args:["-e",l0]};if(l==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",c0]};let v=Vd.find((b)=>zd(b.binary,f));return v?{cmd:v.binary,args:v.args}:null}function Ui(l=process.platform,f=process.env){let v=d0(l,f);if(!v)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((b)=>{let k=r0(v.cmd,v.args,{env:f,stdio:["ignore","pipe","pipe"]}),F="",G=!1,z=(se)=>{if(G)return;G=!0,clearTimeout(J),b(se)},J=setTimeout(()=>{k.kill(),z({error:"The folder dialog timed out"})},a0);k.stdout.on("data",(se)=>{F+=se.toString()}),k.on("error",()=>z({error:`Could not open the folder dialog (${v.cmd})`})),k.on("close",()=>{let se=F.trim().replace(/\/+$/,"");if(!se)return z({cancelled:!0});if(!o0(se)||!qd(se).isDirectory())return z({error:"That selection is not a folder on disk"});z({path:se})})})}var Jd=`<!doctype html>
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
/* cc-safety-net-gui-custom-css */
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

  /* Both track tones clear 3:1 against --surface so an off switch, and the knob
     inside it, stay visible without relying on the accent. */
  --switch-track: light-dark(#8b929c, #626973);
  --switch-track-hover: #767d87;
  --switch-knob: #ffffff;

  /* Neutral, not accent-tinted: the ring is a position indicator, not a state.
     Solid rather than a translucent mix so its contrast does not depend on
     whichever surface the focused control happens to sit on. */
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

/* One step above the hover fill, so the selected item stays readable while a
   sibling is hovered. */
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

/* Everything clickable gets the pointer cursor. Links already get it from the
   user agent; buttons, selects, and the label rows that wrap a control do not. */
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

/* Borderless ghost buttons with a soft filled-square hover. */
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

/* States the window once for the row, so each tile label stays a single word. */
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

/* Count and label stack on the left, series on the right: seven bars stretched
   across a half-width tile read as blocks rather than a trend. */
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

/* minmax(0, 1fr), not the implicit auto track: rule IDs are nowrap, and their
   min-content would otherwise widen the whole Overview grid past the viewport. */
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

/* The panel stacks bare .field blocks rather than wrapping them in a gapped
   grid, so each label would otherwise sit flush against the control above it. */
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

/* Picked, not typed: the value is a dialog result, so it reads as a fact rather
   than an editable field until the picker turns out to be unusable. */
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

/* minmax(0, 1fr), not the implicit auto track: nowrap custom.<name> ids would
   otherwise widen the card past the viewport. */
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

/* The jumped-to rule is scrolled to the middle of a list of near-identical
   rows, so the marker needs an edge, not just a surface shade. */
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

/* button.rule-id drops to font: inherit, and the tester renders a custom rule
   id as a button next to a <code> built-in id, so the face has to be restored
   or the same slot changes typeface with the rule that fired. */
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

/* .feed-toggle is sized for its usual slot below the command. In .feed-meta it
   has to drop to the row's 11px and stop overriding the row's centre alignment. */
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

/* Full-height hover column so short bars are easy to target; the visible bar
   sits at the bottom and the tooltip anchors at a consistent height. */
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

/* The before/after rows need more room than a text-only confirmation. */
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

/* Says whose value a control is showing: the project's, or the one it inherits
   from each member's own user policy. */
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

/* An inherited control is showing someone else's value, so it reads quieter. */
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

/* The picker is the most consequential control in the console, and it named
   the same three tiers the rule sections below already color. The selected
   card now speaks that vocabulary; unselected cards stay neutral. */
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

/* The secret group head carries a bulk action, so the collapse control is a
   button inside the head rather than the head itself. The negative margin
   cancels the head's padding and the stretch spans the taller switch beside it,
   so the button covers the whole head band and the layout stays where it was;
   without them the head's padding is a dead zone. */
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

/* A thin track with a knob that overhangs it. The rule switches are a filled
   pill, so the group control does not read as one more rule. */
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

/* Above the track, which paints later in the pseudo-element order. */
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

/* The tiers that can be switched off carried the only hues, leaving the tier
   that can never be switched off as the quietest thing on the panel. */
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

/* Text fields carry no focus ring. \`outline: none\` is load-bearing rather than
   redundant: without it these fall back to the browser's default focus-visible
   outline. Buttons, links, and the sparkline columns keep theirs. */
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

/* !important and the pseudo-element selectors are load-bearing: the universal
   selector loses to every class-level transition in this file, and does not
   match the switch knob's ::before at all. */
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

  /* The bar's six nav items sit at their minimum width, so the wordmark is
     what has to give for the row to fit a 320px viewport. */
  .brand-logo svg {
    height: 20px;
  }

  .topbar {
    position: static;
    z-index: auto;
  }

  /* On views with a search, the top bar becomes a slim sticky search row
     pinned directly below the nav bar. */
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

  /* Vertical padding fills the bar for a taller touch target; the horizontal
     side stays tight because the row already has no width to spare at 320px. */
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

  /* The counts wrap to their own line below the label. The destructive tiers
     and secret groups nest the label and counts inside .tier-collapse, so the
     wrap must be enabled there as well, not only on the head. */
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
`;var Wd='<script id="ccsn-data" type="application/json">';function Kd(l){return Jd.replace(Wd,()=>Wd+JSON.stringify({token:l}).replaceAll("<","\\u003c"))}var po="kenryu42/cc-safety-net",g0=`https://github.com/${po}`,qi=1e4,h0=7,y0="The project draft directory changed; reload the draft before applying.",v0="audit settings are user scope only; remove the audit section from a project proposal";async function eu(l,f={}){let v=d({label:"gui",booleans:{noOpen:["--no-open"]}},l),b=f.log??console.log,k=f.error??console.error;if(v.errors.length>0){for(let G of v.errors)k(G);return k("Usage: cc-safety-net gui [--no-open]"),1}let F=await b0(c,f);if(b(`CC Safety Net policy GUI: ${F.url}`),!v.flags.noOpen)try{await(f.openBrowser??A0)(F.url)}catch(G){k(`Failed to open browser: ${G instanceof Error?G.message:String(G)}`),k(`Open this URL manually: ${F.url}`)}if(f.keepAlive===!1)return await F.close(),0;return await D0(F),0}async function b0(l,f={}){let v=u0(24).toString("base64url"),b={dir:null,revision:0},k=f0((z,J)=>{L0(l,z,J,v,f,b)});await new Promise((z,J)=>{k.once("error",J),k.listen(0,"127.0.0.1",()=>{k.off("error",J),z()})});let G=`http://127.0.0.1:${k.address().port}`;return{origin:G,token:v,url:`${G}/?token=${encodeURIComponent(v)}`,close:()=>E0(k)}}async function L0(l,f,v,b,k,F){let G=l(),z=new URL(f.url??"/","http://127.0.0.1");if(f.method==="GET"&&z.pathname==="/favicon.ico"){v.writeHead(204,{"cache-control":"no-store"}),v.end();return}if(!C0(f,z,b)){Dt(v,403,{error:"Forbidden"});return}if(f.method==="GET"&&z.pathname==="/"){P0(v,Kd(b));return}if(f.method==="GET"&&z.pathname==="/api/policy"){let J=Kc(G,k),se=D(G,Gi(k));Dt(v,200,{...J,configState:at(se),...se.policyScopes?{projectPolicy:{path:R(k.cwd??process.cwd()),weakenings:se.policyScopes.weakenings}}:{},destructiveCommandRules:ee,secretPatterns:Ct,version:It(),preview:J.errors.length>0?null:rt(J.policy,G.env)});return}if(f.method==="POST"&&z.pathname==="/api/policy/preview"){let J=await cr(f);if(!J.ok){Dt(v,J.status,{errors:[J.error]});return}let se=Yc(G,J.value);Dt(v,se.errors.length>0?400:200,se);return}if(f.method==="POST"&&z.pathname==="/api/policy/explain"){let J=await cr(f);if(!J.ok){Dt(v,J.status,{errors:[J.error]});return}let se=J.value;if(se===null||typeof se.command!=="string"){Dt(v,400,{errors:["command must be a string"]});return}let ae=Vt(se.policy,G.home);if(ae.length>0){Dt(v,400,{errors:ae});return}Dt(v,200,x0(G,se.command,se.policy,k));return}if(f.method==="POST"&&z.pathname==="/api/policy"){let J=await cr(f);if(!J.ok){Dt(v,J.status,{errors:[J.error]});return}let se=tn(G,J.value,k);Dt(v,se.errors.length>0?400:200,se);return}if(f.method==="POST"&&z.pathname==="/api/reset"){Dt(v,200,tn(G,ge,k));return}if(f.method==="POST"&&z.pathname==="/api/repair"){Dt(v,200,Zc(G,k));return}if(f.method==="POST"&&z.pathname==="/api/policy/project/choose-directory"){let J=await(k.chooseDirectory??Ui)();if("path"in J)F.dir=J.path,F.revision+=1;Dt(v,200,{cancelled:"cancelled"in J,..."error"in J?{error:J.error}:{}});return}if(f.method==="GET"&&z.pathname==="/api/policy/project"){let J=tu(F,k),se=Yd(J,G.home),ae=sr(G,k);Dt(v,200,{dir:J,path:R(J),revision:F.revision,baseline:ae.baseline,userPolicyDiagnostics:ae.diagnostics,projection:se.projection,projectionDiagnostics:se.diagnostics,canPickDirectory:Hi(process.platform,process.env)});return}if(f.method==="POST"&&z.pathname==="/api/policy/project/diff"){let J=await Zd(G,f,v,F,k);if(!J)return;let se=Yd(J.dir,G.home),ae=sr(G,k).baseline,le=me(ae,Le(J.proposal,G.home).policy);Dt(v,200,{rows:Zr(me(ae,se.projection).policy,le.policy,!1),weakenings:le.weakenings,existingFileDiagnostics:se.diagnostics,errors:[]});return}if(f.method==="POST"&&z.pathname==="/api/policy/project/apply"){let J=await Zd(G,f,v,F,k);if(!J)return;let se=k0(J.dir,J.proposal,G.home);Dt(v,se.errors.length>0?500:200,se);return}if(f.method==="GET"&&z.pathname==="/api/activity"){let J=ve(G,k),se=S0(z.searchParams.get("days"),J);if(se===null){Dt(v,400,{error:`days must be an integer between 1 and ${J}`});return}Dt(v,200,Bd(G,se,k.activityLogsDir));return}if(f.method==="POST"&&z.pathname==="/api/rules/choose-directory"){Dt(v,200,await Ui());return}if(f.method==="GET"&&z.pathname==="/api/rules"){let J=fe(G,Gi(k)),se=new Map(J.rules.map((ae)=>[ae.name,ae]));Dt(v,200,{projectPath:k.cwd??process.cwd(),canPickDirectory:Hi(process.platform,process.env),rulebooks:J.rulebooks.map((ae)=>({source:ae.source,spec:ae.spec,name:ae.name,version:ae.version,rules:ae.rules.flatMap((le)=>{let be=se.get(le);if(!be)return[];return[{name:be.name,command:be.command,subcommand:be.subcommand,block_args:be.block_args,reason:be.reason}]})})),errors:J.errors,warnings:J.warnings});return}if(f.method==="GET"&&z.pathname==="/api/star/context"){Dt(v,200,await(k.fetchStarContext??(()=>O0(G,{logsDir:k.activityLogsDir})))());return}if(f.method==="POST"&&z.pathname==="/api/star"){let J=await(k.starRepo??_0)();Dt(v,200,J.ok?{ok:!0}:{ok:!1,fallbackUrl:g0});return}if(f.method==="GET"&&z.pathname==="/api/integrations"){Dt(v,200,await(k.fetchIntegrations??(()=>$0(G)))());return}if(f.method==="GET"&&z.pathname==="/api/health"){Dt(v,200,await(k.fetchHealth??(()=>T0(G)))());return}if(f.method==="POST"&&(z.pathname==="/api/install"||z.pathname==="/api/uninstall")){let J=await cr(f);if(!J.ok){Dt(v,J.status,{errors:[J.error]});return}let se=J.value?.target;if(typeof se!=="string"||!Xt.some((le)=>le.target===se)){Dt(v,400,{error:"unknown target"});return}let ae=z.pathname==="/api/install"?"install":"uninstall";Dt(v,200,await(k.runIntegration??I0)(ae,se));return}Dt(v,404,{error:"Not found"})}function Gi(l){return{...l,cwd:l.cwd??process.cwd()}}function tu(l,f){return l.dir??f.cwd??process.cwd()}function Yd(l,f){let v=R(l),b=p0(v)?kn(v):{value:void 0,errors:[]},k=Le(b.value,f);return{projection:k.policy,diagnostics:[...b.errors,...k.diagnostics]}}async function Zd(l,f,v,b,k){let F=tu(b,k),G=b.revision,z=await cr(f);if(!z.ok)return Dt(v,z.status,{errors:[z.error]}),null;let J=z.value;if(typeof J?.revision!=="number")return Dt(v,400,{errors:["revision must be a number"]}),null;if(J.revision!==G)return Dt(v,409,{errors:[y0]}),null;let se=w0(J.proposal,l.home);if(se.length>0)return Dt(v,400,{errors:se}),null;return{dir:F,proposal:J.proposal}}function w0(l,f){let v=Vt(l,f);if(v.length>0)return v;return l?.audit===void 0?[]:[v0]}function k0(l,f,v){let b=R(l),k=Xr(f,S(f,v));try{return x(s(A(l,"project policy"),b),`${JSON.stringify(k,null,2)}
`),{path:b,errors:[]}}catch(F){return{path:b,errors:[F instanceof Error?F.message:String(F)]}}}function x0(l,f,v,b){let k=S(v,l.home),F=D(l,Gi(b)),G=qe({rules:F.policy.rules,transparentWrappers:F.policy.transparentWrappers,safety:st(k.safety),worktreeMode:k.workflow.worktree_mode,destructiveCommandProtectionEnabled:k.destructive_command_protection.enabled,destructiveCommandRuleOverrides:k.destructive_command_protection.overrides,destructiveCommandAllowPaths:k.destructive_command_protection.allow_paths,secretProtection:{enabled:k.secret_protection.enabled,disabledRules:it(k.secret_protection.overrides),denyPaths:k.secret_protection.deny_paths,allowPaths:k.secret_protection.allow_paths}});return er(f,{policySnapshot:G,cwd:b.cwd,userConfigDir:b.userConfigDir},l)}function S0(l,f){if(l===null)return Math.min(h0,f);let v=Number(l);if(!Number.isInteger(v)||v<1||v>f)return null;return v}function C0(l,f,v){if(f.searchParams.get("token")!==v)return!1;if(l.method!=="POST")return!0;return l.headers["x-cc-safety-net-token"]===v}var R0=1048576;async function cr(l){let f=[],v=0;for await(let b of l){let k=b;if(v+=k.byteLength,v>R0)return{ok:!1,status:413,error:"Request body is too large"};f.push(k)}try{return{ok:!0,value:JSON.parse(Buffer.concat(f).toString("utf-8")||"{}")}}catch(b){return{ok:!1,status:400,error:`Invalid JSON: ${b instanceof Error?b.message:String(b)}`}}}function P0(l,f){l.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),l.end(f)}function Dt(l,f,v){l.writeHead(f,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),l.end(JSON.stringify(v))}function E0(l){return new Promise((f,v)=>{l.close((b)=>b?v(b):f())})}function D0(l){return new Promise((f)=>{let v=()=>{process.off("SIGINT",b),process.off("SIGTERM",b)},b=()=>{v(),l.close().then(f)};process.once("SIGINT",b),process.once("SIGTERM",b)})}function A0(l){let f=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",v=process.platform==="win32"?["/c","start","",l]:[l];return new Promise((b,k)=>{let F=Qd(f,v,{detached:!0,stdio:"ignore"}),G=(J)=>{F.off("spawn",z),k(J)},z=()=>{F.off("error",G),F.unref(),b()};F.once("error",G),F.once("spawn",z)})}async function _0(l="gh",f=qi){return{ok:await Bi(l,["api","-X","PUT",`/user/starred/${po}`],f)===0}}async function $0(l,f={}){let v=await Un(f.fetcher),b=nu(l,v);return{targets:B.map((k)=>{let F=b.find((G)=>G.platform===k.id);return{target:k.id,label:p(k.id),version:v.versions[k.id]??null,status:F?.configured?"active":F?.detected?"disabled":F?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:v.version,nodeVersion:v.nodeVersion,platform:v.platform}}}function nu(l,f){return $n(l,process.cwd(),{ampPluginListOutput:f.ampPluginListOutput,codexPluginListOutput:f.codexPluginListOutput,copilotCliVersion:f.versions["copilot-cli"]})}async function T0(l,f={}){let[v,b]=await Promise.all([Un(f.fetcher),(f.checkUpdates??on)()]);return{hooks:nu(l,v).filter((k)=>k.detected).map((k)=>({platform:k.platform,label:p(k.platform),configured:k.configured})),update:{currentVersion:b.currentVersion,latestVersion:b.latestVersion??null,updateAvailable:b.updateAvailable}}}var Xd=Promise.resolve();function I0(l,f,v={}){let b=async()=>{let F=[],{log:G,error:z}=console;console.log=(...J)=>F.push(J.map(String).join(" ")),console.error=console.log;try{return{ok:await ir(l,[],{selectTargets:async()=>[f],output:new m0({write(se,ae,le){F.push(String(se).replace(/\n$/,"")),le()}}),...v})===0,output:F.join(`
`)}}finally{console.log=G,console.error=z}},k=Xd.then(b);return Xd=k.then(()=>{return},()=>{return}),k}async function O0(l,f={}){let[v,b,k]=await Promise.all([j0(f.command),F0(f.fetchRepo),Promise.resolve(mr(l,ve(l),f.logsDir).totalBlocked)]);return{starred:v,starCount:b,blockedTotal:k}}async function j0(l="gh",f=qi){if(await Bi(l,["auth","status"],f)!==0)return null;let v=await Bi(l,["api",`/user/starred/${po}`],f);if(v===0)return!0;if(v===null)return null;return!1}function Bi(l,f,v){return new Promise((b)=>{let k=Qd(l,f,{stdio:"ignore",windowsHide:!0}),F=!1,G,z=(J)=>{if(F)return;if(F=!0,G)clearTimeout(G);b(J)};k.once("error",()=>z(null)),k.once("close",z),G=setTimeout(()=>{k.kill(),z(null)},v)})}async function F0(l=fetch){try{let f=await l(`https://api.github.com/repos/${po}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(qi)});if(!f.ok)return null;let v=await f.json();return typeof v.stargazers_count==="number"?v.stargazers_count:null}catch{return null}}function N0(l){if(l[0]!=="help")return!1;let f=l[1];if(!f)ui(),process.exit(0);if(tr(f))process.exit(0);console.error(`Unknown command: ${f}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var M0={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),tr("hook",console.error),process.exit(1)},install:async(l)=>{process.exit(await ir("install",l))},update:async(l)=>{process.exit(await Ci(l))},uninstall:async(l)=>{process.exit(await ir("uninstall",l))},rule:async(l)=>{process.exit(await Hd(c(),l))},policy:async(l)=>{process.exit(await td(c(),l))},status:async(l)=>{if(oe(d({label:"status"},l).errors))process.exit(1);Gd(c())},statusline:async(l)=>{let f=d({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},l);if(f.errors.length===0&&f.flags.claudeCode){await Mi(c());return}if(oe(f.errors),!f.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");tr("statusline",console.error),process.exit(1)},doctor:async(l)=>{let f=ri(l);if(!f)process.exit(1);let v=await Sl(c(),{json:f.json,skipUpdateCheck:f.skipUpdateCheck});process.exit(v)},logs:async(l)=>{process.exit(await Xi(c(),l))},gui:async(l)=>{process.exit(await eu(l))},explain:async(l)=>{process.exit(await Il(c(),l))}};async function JS(l){let f=d({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},l);if(N0(l))return;let v=l[0],b=v?fr(v):void 0;if(f.help&&b&&b.name!=="rule")tr(b.name),process.exit(0);if(!v||f.help&&!b)ui(),process.exit(0);if(f.flags.version)Fl(),process.exit(0);if(b){await M0[b.name](l.slice(1));return}if(v==="--statusline"){await Mi(c());return}console.error(v.startsWith("-")?`Unknown option: ${v}`:`Unknown command: ${v}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{JS as runCli};
