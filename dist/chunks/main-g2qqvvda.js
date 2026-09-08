import{t,s,Ve,ct,N,bt,ut,l,n,dt,M,P,$e,wt,u,Ne,f,o,A,i,B,r,C,_e,J,xt,Ct,g,Le,Ee,St,Je,V,ue,we,T,kt,G,E,Re,H,h,Y,ft,mt,Z,_,I,Me,O,de,Pe,_t,w,gt,ht,yt,xe,Ye,pe,X,Fe,Xe,Ae,ze,Q,vt,je,Ge,He,Ue,Te,Ie,ee,fe,me,Ce,x,te,Qe,tt,nt,D,rt,We,ot,S,e,ge,Oe,L,R,y,Lt,it,st,m,ne}from"./index-h1ac1wtn.js";import{c,re,Be,at,Se,U,d}from"../bin/cc-safety-net.js";import{ye,oe,lt,q,z}from"./index-5knv3wba.js";import{readdirSync as Ng,statSync as ja,unlinkSync as zg}from"node:fs";import{basename as Na,dirname as Fg,isAbsolute as Mg,join as Ug,relative as Hg,resolve as Zg,sep as Gg}from"node:path";import{existsSync as Dg,readdirSync as Ag,readFileSync as Tg}from"node:fs";import{join as Ig}from"node:path";var Ta=(a)=>{let p=Date.now()-new Date(a).getTime();if(!Number.isFinite(p))return"";let v=Math.floor(p/60000),b=Math.floor(v/60),k=Math.floor(b/24);if(k>0)return`${k}d ago`;if(b>0)return`${b}h ago`;if(v>0)return`${v}m ago`;return"just now"},Vr=(a)=>{let p=(a??"").trim().split(/\s+/).filter((k)=>k&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(k)),v=p[0]?.split("/").pop();if(!v)return null;let b=p[1];return b&&/^[a-z][a-z0-9-]*$/.test(b)?`${v} ${b}`:v};function $n(a,p){try{return Ag(a,{withFileTypes:!0,encoding:"utf8"}).flatMap((v)=>{let b=Ig(a,v.name);if(v.isDirectory())return $n(b,p);if(v.name.endsWith(".jsonl"))return[b];return[]})}catch{if(p&&Dg(a))p.count++;return[]}}function Ia(a){let p=(k)=>`${k.sessionId}
${Vr(k.segment||k.command)}`,v=a.filter((k)=>k.decision!=="allow"),b=v.filter((k)=>k.sessionId).reduce((k,j)=>k.set(p(j),(k.get(p(j))??0)+1),new Map);return new Set(v.filter((k)=>k.failureStage||(b.get(p(k))??0)>=2))}var Og=["segment","reason","sessionId","decision","agent","ruleId","failureStage"];function jg(a){if(!a||typeof a!=="object"||Array.isArray(a))return!1;let p=a;if(typeof p.ts!=="string"||typeof p.command!=="string")return!1;return Og.every((v)=>p[v]===void 0||typeof p[v]==="string")}function Jn(a,p){try{return Tg(a,"utf-8").split(`
`).filter(Boolean).flatMap((v)=>{try{let b=JSON.parse(v);if(!jg(b)){if(p)p.count++;return[]}return[b]}catch{if(p)p.count++;return[]}})}catch{if(p)p.count++;return[]}}function Mt(a){return Array.from(a,(p)=>{let v=p.charCodeAt(0);if(v<=31||v>=127&&v<=159)return`\\x${v.toString(16).padStart(2,"0")}`;return p}).join("")}function Bg(a,p){let v=ye(a),b=c({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},p);if(re(b.errors))return null;if(b.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(b.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let k=b.values.limit===void 0?20:Oa(b.values.limit);if(k===null)return console.error("--limit must be a positive number"),null;let j=b.values.since===void 0?Math.min(30,v):Oa(b.values.since);if(j===null||j>v)return console.error(`--since must be a positive number of days no greater than ${v}`),null;let F={limit:k,limitExplicit:b.values.limit!==void 0,since:j,sinceExplicit:b.values.since!==void 0,all:b.flags.all,json:b.flags.json,suspect:b.flags.suspect,pruneLegacy:b.flags.pruneLegacy,dryRun:b.flags.dryRun,id:b.values.id,agent:b.values.agent,rule:b.values.rule,session:b.values.session,project:b.values.project===void 0?void 0:Zg(b.values.project)};if(F.id&&(F.agent!==void 0||F.rule!==void 0||F.session!==void 0||F.project!==void 0||F.suspect||F.sinceExplicit||F.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(F.pruneLegacy&&(F.id!==void 0||F.agent!==void 0||F.rule!==void 0||F.session!==void 0||F.project!==void 0||F.suspect||F.all||F.sinceExplicit||F.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(F.dryRun&&!F.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return F}async function za(a,p,v={}){let b=Bg(a,p);if(!b)return 1;let k=v.logsDir??q(a);if(b.pruneLegacy)return qg(k,b.json,b.dryRun);if(!k)return console.log(b.json?"[]":b.id?`No retained audit log entry found for id ${Mt(b.id)}.`:"No audit log entries found."),0;oe(a,k);let j={count:0},F=$n(k,j).flatMap((ae)=>Jn(ae,j).map((le)=>({entry:le,file:ae})));if(j.count>0)console.error(`warning: ${j.count} audit log ${j.count===1?"source":"sources"} could not be read; these results are incomplete`);if(b.id)return Kg(F,b,v.timeZone);let W=Date.now()-b.since*24*60*60*1000,K=F.filter((ae)=>Yg(ae,b,k,W)),se=b.suspect?Ia(K.map((ae)=>ae.entry)):null,ie=(se?K.filter((ae)=>se.has(ae.entry)):K).sort((ae,le)=>Date.parse(le.entry.ts)-Date.parse(ae.entry.ts)).slice(0,b.limit);if(b.json)return console.log(JSON.stringify(ie.map((ae)=>ae.entry),null,2)),0;if(ie.length===0)return console.log("No audit log entries found."),0;for(let ae of ie)console.log(eh(ae.entry,v.timeZone));return 0}function qg(a,p,v){let b=a?Jg(a).map((W)=>Ug(a,W)):[];if(v)return Vg(b,p);let k=[],j=0,F=0;for(let W of b){let K=ja(W,{throwIfNoEntry:!1})?.size??0,se=Wg(W);if(se){k.push(`${Na(W)}: ${se}`);continue}j++,F+=K}if(p)return console.log(JSON.stringify({removedFiles:j,removedBytes:F,failedFiles:k.length})),k.length===0?0:1;console.log(j===0&&k.length===0?"No legacy audit log files found.":`Removed ${j} legacy audit log ${j===1?"file":"files"} (${Fa(F)}).`);for(let W of k)console.error(`Could not remove ${Mt(W)}`);if(console.log("Nested v2 audit logs were not changed."),j>0)console.log("This deletion cannot be undone.");return k.length===0?0:1}function Vg(a,p){let v=a.reduce((b,k)=>b+(ja(k,{throwIfNoEntry:!1})?.size??0),0);if(p)return console.log(JSON.stringify({dryRun:!0,files:a.length,bytes:v})),0;if(console.log(a.length===0?"No legacy audit log files found.":`Would remove ${a.length} legacy audit log ${a.length===1?"file":"files"} (${Fa(v)}).`),console.log("Nested v2 audit logs are not included."),a.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function Jg(a){try{return Ng(a,{withFileTypes:!0}).filter((p)=>p.isFile()&&p.name.endsWith(".jsonl")).map((p)=>p.name)}catch{return[]}}function Wg(a){try{return zg(a),null}catch(p){return p instanceof Error?p.message:String(p)}}function Fa(a){let p=["B","KiB","MiB","GiB"],v=Math.min(Math.floor(Math.log2(Math.max(a,1))/10),p.length-1);return`${Math.round(a/1024**v*10)/10} ${p[v]}`}function Kg(a,p,v){let b=a.filter((j)=>j.entry.id===p.id);if(b.length>1)return console.error(`Multiple audit log entries found for id ${Mt(p.id??"")}.`),1;if(p.json)return console.log(JSON.stringify(b.map((j)=>j.entry),null,2)),0;let k=b[0];if(!k)return console.log(`No retained audit log entry found for id ${Mt(p.id??"")}.`),0;return console.log(th(k.entry,v)),0}function Yg(a,p,v,b){if(!p.all&&a.entry.decision==="allow")return!1;if(Date.parse(a.entry.ts)<b)return!1;if(p.agent!==void 0&&a.entry.agent!==p.agent)return!1;if(p.rule!==void 0&&a.entry.ruleId!==p.rule)return!1;if(p.session!==void 0&&!Xg(a,v,p.session))return!1;if(p.project!==void 0&&!Qg(a.entry.cwd,p.project))return!1;return!0}function Xg(a,p,v){if(a.entry.sessionId===v)return!0;return Fg(a.file)===p&&Na(a.file,".jsonl")===v}function Qg(a,p){if(!a)return!1;let v=Hg(p,a);return v!==".."&&!v.startsWith(`..${Gg}`)&&!Mg(v)}function eh(a,p){let v=Mt(a.id??"-"),b=Mt(a.decision??"deny"),k=a.cwd?`  [${Mt(a.cwd)}]`:"",j=a.segment||a.command,F=j===a.command?"":"↳ ",W=j.length>50?`${j.slice(0,50)}…`:j;return`${v.padEnd(16)}  ${Mt(Ma(a.ts,p))}  ${b.padEnd(5)}  ${Mt(a.agent??"-").padEnd(15)}  ${Mt(a.ruleId??"-").padEnd(20)}  ${F}${Mt(W)}${k}`}function th(a,p){let v=(k)=>Mt(k===void 0||k===null||k===""?"-":k),b=a.shape?`${a.agent??"-"} (shape: ${a.shape})`:a.agent??"-";return[`id:        ${v(a.id)}`,`ts:        ${v(Ma(a.ts,p))}`,`decision:  ${v(a.decision)}`,`agent:     ${v(b)}`,`level:     ${v(a.level)}`,`tool:      ${v(a.toolName)}`,`rule:      ${v(a.ruleId)}`,`intent:    ${v(a.intent)}`,`stage:     ${v(a.failureStage)}`,`error:     ${v(a.errorCode)}`,`session:   ${v(a.sessionId)}`,`cwd:       ${v(a.cwd)}`,`version:   ${v(a.v)}`,`truncated: ${v(a.truncated===!0?"yes":void 0)}`,`reason:    ${v(a.reason)}`,`command:   ${v(a.command)}`,`segment:   ${v(a.segment)}`].join(`
`)}function Ma(a,p){let v=new Date(a);if(Number.isNaN(v.getTime()))return a;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:p}).format(v)}function Oa(a){let p=Number(a);return Number.isFinite(p)&&p>0?p:null}var Ua={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var Ha={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var Za={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};var nh=Se.map((a)=>({flags:a.flags.join(", "),description:a.description})),rh=Se.flatMap((a)=>a.flags.map((p)=>`cc-safety-net hook ${p}`)),Ga={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...nh,{flags:"-h, --help",description:"Show this help"}],examples:rh};var Ba={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...U.map((a)=>({flags:a.flag,description:`Install ${d(a.id)} ${a.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...U.map((a)=>`cc-safety-net install ${a.flag}`)]},qa={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...U.map((a)=>({flags:a.flag,description:`Uninstall ${d(a.id)} ${a.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...U.map((a)=>`cc-safety-net uninstall ${a.flag}`)]},Va={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var Ja={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var Jr={name:"policy",description:"Check and apply project or user policy proposals",usage:"policy <subcommand>",subcommands:[{usage:"check <file>",description:"Validate a policy proposal and print its diff"},{usage:"apply <file>",description:"Apply a proposal after confirming in a terminal"}],options:[{flags:"-g, --global",description:"Use the user-scope policy instead of the project one"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net policy check proposal.json","cc-safety-net policy apply proposal.json","cc-safety-net policy apply proposal.json --global"]};var ws=[{flags:"--ref",argument:"<ref>",description:"Use a branch, tag, or commit"},{flags:"--only",argument:"<rulebook...>",description:"Add only these repository rulebooks"},{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"-h, --help",description:"Show this help"}],xs=["cc-safety-net rule add project-rules","cc-safety-net rule add acme/safety-rules","cc-safety-net rule add acme/safety-rules --only aws gcloud","cc-safety-net rule add acme/safety-rules --ref v2 --only aws","cc-safety-net rule add --only terraform aws"],Wn={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add [source] [--ref <ref>] [--only <rulebook...>]",description:"Add rulebook sources and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Re-fetch and vendor remote rulebooks"},{usage:"sync",description:"Deprecated: migrate lock and cache leftovers"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},...ws.slice(0,2),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk",...xs,"cc-safety-net rule update","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var Wa={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var Ka={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var Wr=[Wa,Ua,Ja,Ha,Wn,Jr,Ba,Va,qa,Ga,Za,Ka];function oh(a){return a.aliases??[]}function Kr(a){let p=a.toLowerCase();return Wr.find((v)=>v.name.toLowerCase()===p||oh(v).some((b)=>b.toLowerCase()===p))}import{basename as sh}from"node:path";function Yr(a,p=7,v=q(a)){let b=Date.now()-p*24*60*60*1000,k=[],j=new Set,F=0,W,K,se,ie;if(v)oe(a,v);let ae={count:0},le=v?$n(v,ae):[];for(let be of le)for(let ve of Jn(be,ae)){if(ve.decision==="allow")continue;let ke=new Date(ve.ts).getTime();if(ke>=b){if(F++,j.add(ve.sessionId??sh(be,".jsonl")),K===void 0||ke<=K)W=ve.ts,K=ke;if(ie===void 0||ke>ie)se=ve.ts,ie=ke;ih(k,ve,ke)}}let he=k.map((be)=>({timestamp:be.ts,command:be.command,reason:be.reason,relativeTime:Ta(new Date(be.ts))}));return{totalBlocked:F,sessionCount:j.size,recentEntries:he,oldestEntry:W,newestEntry:se,unreadable:ae.count}}function ih(a,p,v){let b=a.findIndex((k)=>v>new Date(k.ts).getTime());if(b===-1){if(a.length<3)a.push(p);return}if(a.splice(b,0,p),a.length>3)a.pop()}import{dirname as Ny}from"node:path";import{dirname as Ay,join as Ty,resolve as Iy}from"node:path";var h3=Object.freeze({status:"aborted"});function ce(a,p,v){function b(W,K){if(!W._zod)Object.defineProperty(W,"_zod",{value:{def:K,constr:F,traits:new Set},enumerable:!1});if(W._zod.traits.has(a))return;W._zod.traits.add(a),p(W,K);let se=F.prototype,ie=Object.keys(se);for(let ae=0;ae<ie.length;ae++){let le=ie[ae];if(!(le in W))W[le]=se[le].bind(W)}}let k=v?.Parent??Object;class j extends k{}Object.defineProperty(j,"name",{value:a});function F(W){var K;let se=v?.Parent?new j:this;b(se,W),(K=se._zod).deferred??(K.deferred=[]);for(let ie of se._zod.deferred)ie();return se}return Object.defineProperty(F,"init",{value:b}),Object.defineProperty(F,Symbol.hasInstance,{value:(W)=>{if(v?.Parent&&W instanceof v.Parent)return!0;return W?._zod?.traits?.has(a)}}),Object.defineProperty(F,"name",{value:a}),F}var y3=Symbol("zod_brand");class pn extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}}class pr extends Error{constructor(a){super(`Encountered unidirectional transform during encode: ${a}`);this.name="ZodEncodeError"}}var Xr={};function tn(a){if(a)Object.assign(Xr,a);return Xr}function eo(a){let p=Object.values(a).filter((b)=>typeof b==="number");return Object.entries(a).filter(([b,k])=>p.indexOf(+b)===-1).map(([b,k])=>k)}function mr(a,p){if(typeof p==="bigint")return p.toString();return p}function to(a){return{get value(){{let v=a();return Object.defineProperty(this,"value",{value:v}),v}throw Error("cached value already set")}}}function no(a){return a===null||a===void 0}function ro(a){let p=a.startsWith("^")?1:0,v=a.endsWith("$")?a.length-1:a.length;return a.slice(p,v)}function Xa(a,p){let v=(a.toString().split(".")[1]||"").length,b=p.toString(),k=(b.split(".")[1]||"").length;if(k===0&&/\d?e-\d?/.test(b)){let K=b.match(/\d?e-(\d?)/);if(K?.[1])k=Number.parseInt(K[1])}let j=v>k?v:k,F=Number.parseInt(a.toFixed(j).replace(".","")),W=Number.parseInt(p.toFixed(j).replace(".",""));return F%W/10**j}var Ya=Symbol("evaluating");function Rt(a,p,v){let b=void 0;Object.defineProperty(a,p,{get(){if(b===Ya)return;if(b===void 0)b=Ya,b=v();return b},set(k){Object.defineProperty(a,p,{value:k})},configurable:!0})}function En(a,p,v){Object.defineProperty(a,p,{value:v,writable:!0,enumerable:!0,configurable:!0})}function yn(...a){let p={};for(let v of a){let b=Object.getOwnPropertyDescriptors(v);Object.assign(p,b)}return Object.defineProperties({},p)}function _s(a){return JSON.stringify(a)}function Qa(a){return a.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}var Ss="captureStackTrace"in Error?Error.captureStackTrace:(...a)=>{};function fr(a){return typeof a==="object"&&a!==null&&!Array.isArray(a)}var ec=to(()=>{if(typeof navigator<"u"&&navigator?.userAgent?.includes("Cloudflare"))return!1;try{return new Function(""),!0}catch(a){return!1}});function Rn(a){if(fr(a)===!1)return!1;let p=a.constructor;if(p===void 0)return!0;if(typeof p!=="function")return!0;let v=p.prototype;if(fr(v)===!1)return!1;if(Object.prototype.hasOwnProperty.call(v,"isPrototypeOf")===!1)return!1;return!0}function Cs(a){if(Rn(a))return{...a};if(Array.isArray(a))return[...a];return a}var tc=new Set(["string","number","symbol"]);function vn(a){return a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function nn(a,p,v){let b=new a._zod.constr(p??a._zod.def);if(!p||v?.parent)b._zod.parent=a;return b}function pt(a){let p=a;if(!p)return{};if(typeof p==="string")return{error:()=>p};if(p?.message!==void 0){if(p?.error!==void 0)throw Error("Cannot specify both `message` and `error` params");p.error=p.message}if(delete p.message,typeof p.error==="string")return{...p,error:()=>p.error};return p}function nc(a){return Object.keys(a).filter((p)=>a[p]._zod.optin==="optional"&&a[p]._zod.optout==="optional")}var rc={safeint:[Number.MIN_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],int32:[-2147483648,2147483647],uint32:[0,4294967295],float32:[-340282346638528860000000000000000000000,340282346638528860000000000000000000000],float64:[-Number.MAX_VALUE,Number.MAX_VALUE]};function ah(a,p){let v=a._zod.def,b=v.checks;if(b&&b.length>0)throw Error(".pick() cannot be used on object schemas containing refinements");let j=yn(a._zod.def,{get shape(){let F={};for(let W in p){if(!(W in v.shape))throw Error(`Unrecognized key: "${W}"`);if(!p[W])continue;F[W]=v.shape[W]}return En(this,"shape",F),F},checks:[]});return nn(a,j)}function ch(a,p){let v=a._zod.def,b=v.checks;if(b&&b.length>0)throw Error(".omit() cannot be used on object schemas containing refinements");let j=yn(a._zod.def,{get shape(){let F={...a._zod.def.shape};for(let W in p){if(!(W in v.shape))throw Error(`Unrecognized key: "${W}"`);if(!p[W])continue;delete F[W]}return En(this,"shape",F),F},checks:[]});return nn(a,j)}function lh(a,p){if(!Rn(p))throw Error("Invalid input to extend: expected a plain object");let v=a._zod.def.checks;if(v&&v.length>0){let j=a._zod.def.shape;for(let F in p)if(Object.getOwnPropertyDescriptor(j,F)!==void 0)throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}let k=yn(a._zod.def,{get shape(){let j={...a._zod.def.shape,...p};return En(this,"shape",j),j}});return nn(a,k)}function uh(a,p){if(!Rn(p))throw Error("Invalid input to safeExtend: expected a plain object");let v=yn(a._zod.def,{get shape(){let b={...a._zod.def.shape,...p};return En(this,"shape",b),b}});return nn(a,v)}function dh(a,p){let v=yn(a._zod.def,{get shape(){let b={...a._zod.def.shape,...p._zod.def.shape};return En(this,"shape",b),b},get catchall(){return p._zod.def.catchall},checks:[]});return nn(a,v)}function ph(a,p,v){let k=p._zod.def.checks;if(k&&k.length>0)throw Error(".partial() cannot be used on object schemas containing refinements");let F=yn(p._zod.def,{get shape(){let W=p._zod.def.shape,K={...W};if(v)for(let se in v){if(!(se in W))throw Error(`Unrecognized key: "${se}"`);if(!v[se])continue;K[se]=a?new a({type:"optional",innerType:W[se]}):W[se]}else for(let se in W)K[se]=a?new a({type:"optional",innerType:W[se]}):W[se];return En(this,"shape",K),K},checks:[]});return nn(p,F)}function fh(a,p,v){let b=yn(p._zod.def,{get shape(){let k=p._zod.def.shape,j={...k};if(v)for(let F in v){if(!(F in j))throw Error(`Unrecognized key: "${F}"`);if(!v[F])continue;j[F]=new a({type:"nonoptional",innerType:k[F]})}else for(let F in k)j[F]=new a({type:"nonoptional",innerType:k[F]});return En(this,"shape",j),j}});return nn(p,b)}function Dn(a,p=0){if(a.aborted===!0)return!0;for(let v=p;v<a.issues.length;v++)if(a.issues[v]?.continue!==!0)return!0;return!1}function bn(a,p){return p.map((v)=>{var b;return(b=v).path??(b.path=[]),v.path.unshift(a),v})}function Qr(a){return typeof a==="string"?a:a?.message}function rn(a,p,v){let b={...a,path:a.path??[]};if(!a.message){let k=Qr(a.inst?._zod.def?.error?.(a))??Qr(p?.error?.(a))??Qr(v.customError?.(a))??Qr(v.localeError?.(a))??"Invalid input";b.message=k}if(delete b.inst,delete b.continue,!p?.reportInput)delete b.input;return b}function oo(a){if(Array.isArray(a))return"array";if(typeof a==="string")return"string";return"unknown"}function An(...a){let[p,v,b]=a;if(typeof p==="string")return{message:p,code:"custom",input:v,inst:b};return{...p}}var oc=(a,p)=>{a.name="$ZodError",Object.defineProperty(a,"_zod",{value:a._zod,enumerable:!1}),Object.defineProperty(a,"issues",{value:p,enumerable:!1}),a.message=JSON.stringify(p,mr,2),Object.defineProperty(a,"toString",{value:()=>a.message,enumerable:!1})},so=ce("$ZodError",oc),Ps=ce("$ZodError",oc,{Parent:Error});function sc(a,p=(v)=>v.message){let v={},b=[];for(let k of a.issues)if(k.path.length>0)v[k.path[0]]=v[k.path[0]]||[],v[k.path[0]].push(p(k));else b.push(p(k));return{formErrors:b,fieldErrors:v}}function ic(a,p=(v)=>v.message){let v={_errors:[]},b=(k)=>{for(let j of k.issues)if(j.code==="invalid_union"&&j.errors.length)j.errors.map((F)=>b({issues:F}));else if(j.code==="invalid_key")b({issues:j.issues});else if(j.code==="invalid_element")b({issues:j.issues});else if(j.path.length===0)v._errors.push(p(j));else{let F=v,W=0;while(W<j.path.length){let K=j.path[W];if(W!==j.path.length-1)F[K]=F[K]||{_errors:[]};else F[K]=F[K]||{_errors:[]},F[K]._errors.push(p(j));F=F[K],W++}}};return b(a),v}var io=(a)=>(p,v,b,k)=>{let j=b?Object.assign(b,{async:!1}):{async:!1},F=p._zod.run({value:v,issues:[]},j);if(F instanceof Promise)throw new pn;if(F.issues.length){let W=new(k?.Err??a)(F.issues.map((K)=>rn(K,j,tn())));throw Ss(W,k?.callee),W}return F.value};var ao=(a)=>async(p,v,b,k)=>{let j=b?Object.assign(b,{async:!0}):{async:!0},F=p._zod.run({value:v,issues:[]},j);if(F instanceof Promise)F=await F;if(F.issues.length){let W=new(k?.Err??a)(F.issues.map((K)=>rn(K,j,tn())));throw Ss(W,k?.callee),W}return F.value};var gr=(a)=>(p,v,b)=>{let k=b?{...b,async:!1}:{async:!1},j=p._zod.run({value:v,issues:[]},k);if(j instanceof Promise)throw new pn;return j.issues.length?{success:!1,error:new(a??so)(j.issues.map((F)=>rn(F,k,tn())))}:{success:!0,data:j.value}},ac=gr(Ps),hr=(a)=>async(p,v,b)=>{let k=b?Object.assign(b,{async:!0}):{async:!0},j=p._zod.run({value:v,issues:[]},k);if(j instanceof Promise)j=await j;return j.issues.length?{success:!1,error:new a(j.issues.map((F)=>rn(F,k,tn())))}:{success:!0,data:j.value}},cc=hr(Ps),lc=(a)=>(p,v,b)=>{let k=b?Object.assign(b,{direction:"backward"}):{direction:"backward"};return io(a)(p,v,k)};var uc=(a)=>(p,v,b)=>io(a)(p,v,b);var dc=(a)=>async(p,v,b)=>{let k=b?Object.assign(b,{direction:"backward"}):{direction:"backward"};return ao(a)(p,v,k)};var pc=(a)=>async(p,v,b)=>ao(a)(p,v,b);var fc=(a)=>(p,v,b)=>{let k=b?Object.assign(b,{direction:"backward"}):{direction:"backward"};return gr(a)(p,v,k)};var mc=(a)=>(p,v,b)=>gr(a)(p,v,b);var gc=(a)=>async(p,v,b)=>{let k=b?Object.assign(b,{direction:"backward"}):{direction:"backward"};return hr(a)(p,v,k)};var hc=(a)=>async(p,v,b)=>hr(a)(p,v,b);var yc=/^[cC][^\s-]{8,}$/,vc=/^[0-9a-z]+$/,bc=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,Lc=/^[0-9a-vA-V]{20}$/,wc=/^[A-Za-z0-9]{27}$/,xc=/^[a-zA-Z0-9_-]{21}$/,kc=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;var _c=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,$s=(a)=>{if(!a)return/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${a}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`)};var Sc=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;var gh="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function Cc(){return new RegExp(gh,"u")}var Pc=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,$c=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;var Ec=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Rc=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Dc=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,Es=/^[A-Za-z0-9_-]*$/;var Ac=/^\+[1-9]\d{6,14}$/,Tc="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",Ic=new RegExp(`^${Tc}$`);function Oc(a){return typeof a.precision==="number"?a.precision===-1?"(?:[01]\\d|2[0-3]):[0-5]\\d":a.precision===0?"(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d":`(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{${a.precision}}`:"(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?"}function jc(a){return new RegExp(`^${Oc(a)}$`)}function Nc(a){let p=Oc({precision:a.precision}),v=["Z"];if(a.local)v.push("");if(a.offset)v.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");let b=`${p}(?:${v.join("|")})`;return new RegExp(`^${Tc}T(?:${b})$`)}var zc=(a)=>{let p=a?`[\\s\\S]{${a?.minimum??0},${a?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${p}$`)};var Fc=/^-?\d+$/,Rs=/^-?\d+(?:\.\d+)?$/,Mc=/^(?:true|false)$/i;var Uc=/^[^A-Z]*$/,Hc=/^[^a-z]*$/;var Ht=ce("$ZodCheck",(a,p)=>{var v;a._zod??(a._zod={}),a._zod.def=p,(v=a._zod).onattach??(v.onattach=[])}),Zc={number:"number",bigint:"bigint",object:"date"},Ds=ce("$ZodCheckLessThan",(a,p)=>{Ht.init(a,p);let v=Zc[typeof p.value];a._zod.onattach.push((b)=>{let k=b._zod.bag,j=(p.inclusive?k.maximum:k.exclusiveMaximum)??Number.POSITIVE_INFINITY;if(p.value<j)if(p.inclusive)k.maximum=p.value;else k.exclusiveMaximum=p.value}),a._zod.check=(b)=>{if(p.inclusive?b.value<=p.value:b.value<p.value)return;b.issues.push({origin:v,code:"too_big",maximum:typeof p.value==="object"?p.value.getTime():p.value,input:b.value,inclusive:p.inclusive,inst:a,continue:!p.abort})}}),As=ce("$ZodCheckGreaterThan",(a,p)=>{Ht.init(a,p);let v=Zc[typeof p.value];a._zod.onattach.push((b)=>{let k=b._zod.bag,j=(p.inclusive?k.minimum:k.exclusiveMinimum)??Number.NEGATIVE_INFINITY;if(p.value>j)if(p.inclusive)k.minimum=p.value;else k.exclusiveMinimum=p.value}),a._zod.check=(b)=>{if(p.inclusive?b.value>=p.value:b.value>p.value)return;b.issues.push({origin:v,code:"too_small",minimum:typeof p.value==="object"?p.value.getTime():p.value,input:b.value,inclusive:p.inclusive,inst:a,continue:!p.abort})}}),Gc=ce("$ZodCheckMultipleOf",(a,p)=>{Ht.init(a,p),a._zod.onattach.push((v)=>{var b;(b=v._zod.bag).multipleOf??(b.multipleOf=p.value)}),a._zod.check=(v)=>{if(typeof v.value!==typeof p.value)throw Error("Cannot mix number and bigint in multiple_of check.");if(typeof v.value==="bigint"?v.value%p.value===BigInt(0):Xa(v.value,p.value)===0)return;v.issues.push({origin:typeof v.value,code:"not_multiple_of",divisor:p.value,input:v.value,inst:a,continue:!p.abort})}}),Bc=ce("$ZodCheckNumberFormat",(a,p)=>{Ht.init(a,p),p.format=p.format||"float64";let v=p.format?.includes("int"),b=v?"int":"number",[k,j]=rc[p.format];a._zod.onattach.push((F)=>{let W=F._zod.bag;if(W.format=p.format,W.minimum=k,W.maximum=j,v)W.pattern=Fc}),a._zod.check=(F)=>{let W=F.value;if(v){if(!Number.isInteger(W)){F.issues.push({expected:b,format:p.format,code:"invalid_type",continue:!1,input:W,inst:a});return}if(!Number.isSafeInteger(W)){if(W>0)F.issues.push({input:W,code:"too_big",maximum:Number.MAX_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:a,origin:b,inclusive:!0,continue:!p.abort});else F.issues.push({input:W,code:"too_small",minimum:Number.MIN_SAFE_INTEGER,note:"Integers must be within the safe integer range.",inst:a,origin:b,inclusive:!0,continue:!p.abort});return}}if(W<k)F.issues.push({origin:"number",input:W,code:"too_small",minimum:k,inclusive:!0,inst:a,continue:!p.abort});if(W>j)F.issues.push({origin:"number",input:W,code:"too_big",maximum:j,inclusive:!0,inst:a,continue:!p.abort})}});var qc=ce("$ZodCheckMaxLength",(a,p)=>{var v;Ht.init(a,p),(v=a._zod.def).when??(v.when=(b)=>{let k=b.value;return!no(k)&&k.length!==void 0}),a._zod.onattach.push((b)=>{let k=b._zod.bag.maximum??Number.POSITIVE_INFINITY;if(p.maximum<k)b._zod.bag.maximum=p.maximum}),a._zod.check=(b)=>{let k=b.value;if(k.length<=p.maximum)return;let F=oo(k);b.issues.push({origin:F,code:"too_big",maximum:p.maximum,inclusive:!0,input:k,inst:a,continue:!p.abort})}}),Vc=ce("$ZodCheckMinLength",(a,p)=>{var v;Ht.init(a,p),(v=a._zod.def).when??(v.when=(b)=>{let k=b.value;return!no(k)&&k.length!==void 0}),a._zod.onattach.push((b)=>{let k=b._zod.bag.minimum??Number.NEGATIVE_INFINITY;if(p.minimum>k)b._zod.bag.minimum=p.minimum}),a._zod.check=(b)=>{let k=b.value;if(k.length>=p.minimum)return;let F=oo(k);b.issues.push({origin:F,code:"too_small",minimum:p.minimum,inclusive:!0,input:k,inst:a,continue:!p.abort})}}),Jc=ce("$ZodCheckLengthEquals",(a,p)=>{var v;Ht.init(a,p),(v=a._zod.def).when??(v.when=(b)=>{let k=b.value;return!no(k)&&k.length!==void 0}),a._zod.onattach.push((b)=>{let k=b._zod.bag;k.minimum=p.length,k.maximum=p.length,k.length=p.length}),a._zod.check=(b)=>{let k=b.value,j=k.length;if(j===p.length)return;let F=oo(k),W=j>p.length;b.issues.push({origin:F,...W?{code:"too_big",maximum:p.length}:{code:"too_small",minimum:p.length},inclusive:!0,exact:!0,input:b.value,inst:a,continue:!p.abort})}}),yr=ce("$ZodCheckStringFormat",(a,p)=>{var v,b;if(Ht.init(a,p),a._zod.onattach.push((k)=>{let j=k._zod.bag;if(j.format=p.format,p.pattern)j.patterns??(j.patterns=new Set),j.patterns.add(p.pattern)}),p.pattern)(v=a._zod).check??(v.check=(k)=>{if(p.pattern.lastIndex=0,p.pattern.test(k.value))return;k.issues.push({origin:"string",code:"invalid_format",format:p.format,input:k.value,...p.pattern?{pattern:p.pattern.toString()}:{},inst:a,continue:!p.abort})});else(b=a._zod).check??(b.check=()=>{})}),Wc=ce("$ZodCheckRegex",(a,p)=>{yr.init(a,p),a._zod.check=(v)=>{if(p.pattern.lastIndex=0,p.pattern.test(v.value))return;v.issues.push({origin:"string",code:"invalid_format",format:"regex",input:v.value,pattern:p.pattern.toString(),inst:a,continue:!p.abort})}}),Kc=ce("$ZodCheckLowerCase",(a,p)=>{p.pattern??(p.pattern=Uc),yr.init(a,p)}),Yc=ce("$ZodCheckUpperCase",(a,p)=>{p.pattern??(p.pattern=Hc),yr.init(a,p)}),Xc=ce("$ZodCheckIncludes",(a,p)=>{Ht.init(a,p);let v=vn(p.includes),b=new RegExp(typeof p.position==="number"?`^.{${p.position}}${v}`:v);p.pattern=b,a._zod.onattach.push((k)=>{let j=k._zod.bag;j.patterns??(j.patterns=new Set),j.patterns.add(b)}),a._zod.check=(k)=>{if(k.value.includes(p.includes,p.position))return;k.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:p.includes,input:k.value,inst:a,continue:!p.abort})}}),Qc=ce("$ZodCheckStartsWith",(a,p)=>{Ht.init(a,p);let v=new RegExp(`^${vn(p.prefix)}.*`);p.pattern??(p.pattern=v),a._zod.onattach.push((b)=>{let k=b._zod.bag;k.patterns??(k.patterns=new Set),k.patterns.add(v)}),a._zod.check=(b)=>{if(b.value.startsWith(p.prefix))return;b.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:p.prefix,input:b.value,inst:a,continue:!p.abort})}}),el=ce("$ZodCheckEndsWith",(a,p)=>{Ht.init(a,p);let v=new RegExp(`.*${vn(p.suffix)}$`);p.pattern??(p.pattern=v),a._zod.onattach.push((b)=>{let k=b._zod.bag;k.patterns??(k.patterns=new Set),k.patterns.add(v)}),a._zod.check=(b)=>{if(b.value.endsWith(p.suffix))return;b.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:p.suffix,input:b.value,inst:a,continue:!p.abort})}});var tl=ce("$ZodCheckOverwrite",(a,p)=>{Ht.init(a,p),a._zod.check=(v)=>{v.value=p.tx(v.value)}});class Ts{constructor(a=[]){if(this.content=[],this.indent=0,this)this.args=a}indented(a){this.indent+=1,a(this),this.indent-=1}write(a){if(typeof a==="function"){a(this,{execution:"sync"}),a(this,{execution:"async"});return}let v=a.split(`
`).filter((j)=>j),b=Math.min(...v.map((j)=>j.length-j.trimStart().length)),k=v.map((j)=>j.slice(b)).map((j)=>" ".repeat(this.indent*2)+j);for(let j of k)this.content.push(j)}compile(){let a=Function,p=this?.args,b=[...(this?.content??[""]).map((k)=>`  ${k}`)];return new a(...p,b.join(`
`))}}var rl={major:4,minor:3,patch:5};var Tt=ce("$ZodType",(a,p)=>{var v;a??(a={}),a._zod.def=p,a._zod.bag=a._zod.bag||{},a._zod.version=rl;let b=[...a._zod.def.checks??[]];if(a._zod.traits.has("$ZodCheck"))b.unshift(a);for(let k of b)for(let j of k._zod.onattach)j(a);if(b.length===0)(v=a._zod).deferred??(v.deferred=[]),a._zod.deferred?.push(()=>{a._zod.run=a._zod.parse});else{let k=(F,W,K)=>{let se=Dn(F),ie;for(let ae of W){if(ae._zod.def.when){if(!ae._zod.def.when(F))continue}else if(se)continue;let le=F.issues.length,he=ae._zod.check(F);if(he instanceof Promise&&K?.async===!1)throw new pn;if(ie||he instanceof Promise)ie=(ie??Promise.resolve()).then(async()=>{if(await he,F.issues.length===le)return;if(!se)se=Dn(F,le)});else{if(F.issues.length===le)continue;if(!se)se=Dn(F,le)}}if(ie)return ie.then(()=>F);return F},j=(F,W,K)=>{if(Dn(F))return F.aborted=!0,F;let se=k(W,b,K);if(se instanceof Promise){if(K.async===!1)throw new pn;return se.then((ie)=>a._zod.parse(ie,K))}return a._zod.parse(se,K)};a._zod.run=(F,W)=>{if(W.skipChecks)return a._zod.parse(F,W);if(W.direction==="backward"){let se=a._zod.parse({value:F.value,issues:[]},{...W,skipChecks:!0});if(se instanceof Promise)return se.then((ie)=>j(ie,F,W));return j(se,F,W)}let K=a._zod.parse(F,W);if(K instanceof Promise){if(W.async===!1)throw new pn;return K.then((se)=>k(se,b,W))}return k(K,b,W)}}Rt(a,"~standard",()=>({validate:(k)=>{try{let j=ac(a,k);return j.success?{value:j.data}:{issues:j.error?.issues}}catch(j){return cc(a,k).then((F)=>F.success?{value:F.data}:{issues:F.error?.issues})}},vendor:"zod",version:1}))}),po=ce("$ZodString",(a,p)=>{Tt.init(a,p),a._zod.pattern=[...a?._zod.bag?.patterns??[]].pop()??zc(a._zod.bag),a._zod.parse=(v,b)=>{if(p.coerce)try{v.value=String(v.value)}catch(k){}if(typeof v.value==="string")return v;return v.issues.push({expected:"string",code:"invalid_type",input:v.value,inst:a}),v}}),Dt=ce("$ZodStringFormat",(a,p)=>{yr.init(a,p),po.init(a,p)}),pl=ce("$ZodGUID",(a,p)=>{p.pattern??(p.pattern=_c),Dt.init(a,p)}),fl=ce("$ZodUUID",(a,p)=>{if(p.version){let b={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[p.version];if(b===void 0)throw Error(`Invalid UUID version: "${p.version}"`);p.pattern??(p.pattern=$s(b))}else p.pattern??(p.pattern=$s());Dt.init(a,p)}),ml=ce("$ZodEmail",(a,p)=>{p.pattern??(p.pattern=Sc),Dt.init(a,p)}),gl=ce("$ZodURL",(a,p)=>{Dt.init(a,p),a._zod.check=(v)=>{try{let b=v.value.trim(),k=new URL(b);if(p.hostname){if(p.hostname.lastIndex=0,!p.hostname.test(k.hostname))v.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:p.hostname.source,input:v.value,inst:a,continue:!p.abort})}if(p.protocol){if(p.protocol.lastIndex=0,!p.protocol.test(k.protocol.endsWith(":")?k.protocol.slice(0,-1):k.protocol))v.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:p.protocol.source,input:v.value,inst:a,continue:!p.abort})}if(p.normalize)v.value=k.href;else v.value=b;return}catch(b){v.issues.push({code:"invalid_format",format:"url",input:v.value,inst:a,continue:!p.abort})}}}),hl=ce("$ZodEmoji",(a,p)=>{p.pattern??(p.pattern=Cc()),Dt.init(a,p)}),yl=ce("$ZodNanoID",(a,p)=>{p.pattern??(p.pattern=xc),Dt.init(a,p)}),vl=ce("$ZodCUID",(a,p)=>{p.pattern??(p.pattern=yc),Dt.init(a,p)}),bl=ce("$ZodCUID2",(a,p)=>{p.pattern??(p.pattern=vc),Dt.init(a,p)}),Ll=ce("$ZodULID",(a,p)=>{p.pattern??(p.pattern=bc),Dt.init(a,p)}),wl=ce("$ZodXID",(a,p)=>{p.pattern??(p.pattern=Lc),Dt.init(a,p)}),xl=ce("$ZodKSUID",(a,p)=>{p.pattern??(p.pattern=wc),Dt.init(a,p)}),kl=ce("$ZodISODateTime",(a,p)=>{p.pattern??(p.pattern=Nc(p)),Dt.init(a,p)}),_l=ce("$ZodISODate",(a,p)=>{p.pattern??(p.pattern=Ic),Dt.init(a,p)}),Sl=ce("$ZodISOTime",(a,p)=>{p.pattern??(p.pattern=jc(p)),Dt.init(a,p)}),Cl=ce("$ZodISODuration",(a,p)=>{p.pattern??(p.pattern=kc),Dt.init(a,p)}),Pl=ce("$ZodIPv4",(a,p)=>{p.pattern??(p.pattern=Pc),Dt.init(a,p),a._zod.bag.format="ipv4"}),$l=ce("$ZodIPv6",(a,p)=>{p.pattern??(p.pattern=$c),Dt.init(a,p),a._zod.bag.format="ipv6",a._zod.check=(v)=>{try{new URL(`http://[${v.value}]`)}catch{v.issues.push({code:"invalid_format",format:"ipv6",input:v.value,inst:a,continue:!p.abort})}}});var El=ce("$ZodCIDRv4",(a,p)=>{p.pattern??(p.pattern=Ec),Dt.init(a,p)}),Rl=ce("$ZodCIDRv6",(a,p)=>{p.pattern??(p.pattern=Rc),Dt.init(a,p),a._zod.check=(v)=>{let b=v.value.split("/");try{if(b.length!==2)throw Error();let[k,j]=b;if(!j)throw Error();let F=Number(j);if(`${F}`!==j)throw Error();if(F<0||F>128)throw Error();new URL(`http://[${k}]`)}catch{v.issues.push({code:"invalid_format",format:"cidrv6",input:v.value,inst:a,continue:!p.abort})}}});function Dl(a){if(a==="")return!0;if(a.length%4!==0)return!1;try{return atob(a),!0}catch{return!1}}var Al=ce("$ZodBase64",(a,p)=>{p.pattern??(p.pattern=Dc),Dt.init(a,p),a._zod.bag.contentEncoding="base64",a._zod.check=(v)=>{if(Dl(v.value))return;v.issues.push({code:"invalid_format",format:"base64",input:v.value,inst:a,continue:!p.abort})}});function hh(a){if(!Es.test(a))return!1;let p=a.replace(/[-_]/g,(b)=>b==="-"?"+":"/"),v=p.padEnd(Math.ceil(p.length/4)*4,"=");return Dl(v)}var Tl=ce("$ZodBase64URL",(a,p)=>{p.pattern??(p.pattern=Es),Dt.init(a,p),a._zod.bag.contentEncoding="base64url",a._zod.check=(v)=>{if(hh(v.value))return;v.issues.push({code:"invalid_format",format:"base64url",input:v.value,inst:a,continue:!p.abort})}}),Il=ce("$ZodE164",(a,p)=>{p.pattern??(p.pattern=Ac),Dt.init(a,p)});function yh(a,p=null){try{let v=a.split(".");if(v.length!==3)return!1;let[b]=v;if(!b)return!1;let k=JSON.parse(atob(b));if("typ"in k&&k?.typ!=="JWT")return!1;if(!k.alg)return!1;if(p&&(!("alg"in k)||k.alg!==p))return!1;return!0}catch{return!1}}var Ol=ce("$ZodJWT",(a,p)=>{Dt.init(a,p),a._zod.check=(v)=>{if(yh(v.value,p.alg))return;v.issues.push({code:"invalid_format",format:"jwt",input:v.value,inst:a,continue:!p.abort})}});var Os=ce("$ZodNumber",(a,p)=>{Tt.init(a,p),a._zod.pattern=a._zod.bag.pattern??Rs,a._zod.parse=(v,b)=>{if(p.coerce)try{v.value=Number(v.value)}catch(F){}let k=v.value;if(typeof k==="number"&&!Number.isNaN(k)&&Number.isFinite(k))return v;let j=typeof k==="number"?Number.isNaN(k)?"NaN":!Number.isFinite(k)?"Infinity":void 0:void 0;return v.issues.push({expected:"number",code:"invalid_type",input:k,inst:a,...j?{received:j}:{}}),v}}),jl=ce("$ZodNumberFormat",(a,p)=>{Bc.init(a,p),Os.init(a,p)}),Nl=ce("$ZodBoolean",(a,p)=>{Tt.init(a,p),a._zod.pattern=Mc,a._zod.parse=(v,b)=>{if(p.coerce)try{v.value=Boolean(v.value)}catch(j){}let k=v.value;if(typeof k==="boolean")return v;return v.issues.push({expected:"boolean",code:"invalid_type",input:k,inst:a}),v}});var zl=ce("$ZodUnknown",(a,p)=>{Tt.init(a,p),a._zod.parse=(v)=>v}),Fl=ce("$ZodNever",(a,p)=>{Tt.init(a,p),a._zod.parse=(v,b)=>(v.issues.push({expected:"never",code:"invalid_type",input:v.value,inst:a}),v)});function ol(a,p,v){if(a.issues.length)p.issues.push(...bn(v,a.issues));p.value[v]=a.value}var Ml=ce("$ZodArray",(a,p)=>{Tt.init(a,p),a._zod.parse=(v,b)=>{let k=v.value;if(!Array.isArray(k))return v.issues.push({expected:"array",code:"invalid_type",input:k,inst:a}),v;v.value=Array(k.length);let j=[];for(let F=0;F<k.length;F++){let W=k[F],K=p.element._zod.run({value:W,issues:[]},b);if(K instanceof Promise)j.push(K.then((se)=>ol(se,v,F)));else ol(K,v,F)}if(j.length)return Promise.all(j).then(()=>v);return v}});function uo(a,p,v,b,k){if(a.issues.length){if(k&&!(v in b))return;p.issues.push(...bn(v,a.issues))}if(a.value===void 0){if(v in b)p.value[v]=void 0}else p.value[v]=a.value}function Ul(a){let p=Object.keys(a.shape);for(let b of p)if(!a.shape?.[b]?._zod?.traits?.has("$ZodType"))throw Error(`Invalid element at key "${b}": expected a Zod schema`);let v=nc(a.shape);return{...a,keys:p,keySet:new Set(p),numKeys:p.length,optionalKeys:new Set(v)}}function Hl(a,p,v,b,k,j){let F=[],W=k.keySet,K=k.catchall._zod,se=K.def.type,ie=K.optout==="optional";for(let ae in p){if(W.has(ae))continue;if(se==="never"){F.push(ae);continue}let le=K.run({value:p[ae],issues:[]},b);if(le instanceof Promise)a.push(le.then((he)=>uo(he,v,ae,p,ie)));else uo(le,v,ae,p,ie)}if(F.length)v.issues.push({code:"unrecognized_keys",keys:F,input:p,inst:j});if(!a.length)return v;return Promise.all(a).then(()=>v)}var vh=ce("$ZodObject",(a,p)=>{if(Tt.init(a,p),!Object.getOwnPropertyDescriptor(p,"shape")?.get){let W=p.shape;Object.defineProperty(p,"shape",{get:()=>{let K={...W};return Object.defineProperty(p,"shape",{value:K}),K}})}let b=to(()=>Ul(p));Rt(a._zod,"propValues",()=>{let W=p.shape,K={};for(let se in W){let ie=W[se]._zod;if(ie.values){K[se]??(K[se]=new Set);for(let ae of ie.values)K[se].add(ae)}}return K});let k=fr,j=p.catchall,F;a._zod.parse=(W,K)=>{F??(F=b.value);let se=W.value;if(!k(se))return W.issues.push({expected:"object",code:"invalid_type",input:se,inst:a}),W;W.value={};let ie=[],ae=F.shape;for(let le of F.keys){let he=ae[le],be=he._zod.optout==="optional",ve=he._zod.run({value:se[le],issues:[]},K);if(ve instanceof Promise)ie.push(ve.then((ke)=>uo(ke,W,le,se,be)));else uo(ve,W,le,se,be)}if(!j)return ie.length?Promise.all(ie).then(()=>W):W;return Hl(ie,se,W,K,b.value,a)}}),Zl=ce("$ZodObjectJIT",(a,p)=>{vh.init(a,p);let v=a._zod.parse,b=to(()=>Ul(p)),k=(le)=>{let he=new Ts(["shape","payload","ctx"]),be=b.value,ve=(De)=>{let Pt=_s(De);return`shape[${Pt}]._zod.run({ value: input[${Pt}], issues: [] }, ctx)`};he.write("const input = payload.value;");let ke=Object.create(null),qe=0;for(let De of be.keys)ke[De]=`key_${qe++}`;he.write("const newResult = {};");for(let De of be.keys){let Pt=ke[De],Ke=_s(De),dn=le[De]?._zod?.optout==="optional";if(he.write(`const ${Pt} = ${ve(De)};`),dn)he.write(`
        if (${Pt}.issues.length) {
          if (${Ke} in input) {
            payload.issues = payload.issues.concat(${Pt}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${Ke}, ...iss.path] : [${Ke}]
            })));
          }
        }
        
        if (${Pt}.value === undefined) {
          if (${Ke} in input) {
            newResult[${Ke}] = undefined;
          }
        } else {
          newResult[${Ke}] = ${Pt}.value;
        }
        
      `);else he.write(`
        if (${Pt}.issues.length) {
          payload.issues = payload.issues.concat(${Pt}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${Ke}, ...iss.path] : [${Ke}]
          })));
        }
        
        if (${Pt}.value === undefined) {
          if (${Ke} in input) {
            newResult[${Ke}] = undefined;
          }
        } else {
          newResult[${Ke}] = ${Pt}.value;
        }
        
      `)}he.write("payload.value = newResult;"),he.write("return payload;");let Ze=he.compile();return(De,Pt)=>Ze(le,De,Pt)},j,F=fr,W=!Xr.jitless,se=W&&ec.value,ie=p.catchall,ae;a._zod.parse=(le,he)=>{ae??(ae=b.value);let be=le.value;if(!F(be))return le.issues.push({expected:"object",code:"invalid_type",input:be,inst:a}),le;if(W&&se&&he?.async===!1&&he.jitless!==!0){if(!j)j=k(p.shape);if(le=j(le,he),!ie)return le;return Hl([],be,le,he,ae,a)}return v(le,he)}});function sl(a,p,v,b){for(let j of a)if(j.issues.length===0)return p.value=j.value,p;let k=a.filter((j)=>!Dn(j));if(k.length===1)return p.value=k[0].value,k[0];return p.issues.push({code:"invalid_union",input:p.value,inst:v,errors:a.map((j)=>j.issues.map((F)=>rn(F,b,tn())))}),p}var Gl=ce("$ZodUnion",(a,p)=>{Tt.init(a,p),Rt(a._zod,"optin",()=>p.options.some((k)=>k._zod.optin==="optional")?"optional":void 0),Rt(a._zod,"optout",()=>p.options.some((k)=>k._zod.optout==="optional")?"optional":void 0),Rt(a._zod,"values",()=>{if(p.options.every((k)=>k._zod.values))return new Set(p.options.flatMap((k)=>Array.from(k._zod.values)));return}),Rt(a._zod,"pattern",()=>{if(p.options.every((k)=>k._zod.pattern)){let k=p.options.map((j)=>j._zod.pattern);return new RegExp(`^(${k.map((j)=>ro(j.source)).join("|")})$`)}return});let v=p.options.length===1,b=p.options[0]._zod.run;a._zod.parse=(k,j)=>{if(v)return b(k,j);let F=!1,W=[];for(let K of p.options){let se=K._zod.run({value:k.value,issues:[]},j);if(se instanceof Promise)W.push(se),F=!0;else{if(se.issues.length===0)return se;W.push(se)}}if(!F)return sl(W,k,a,j);return Promise.all(W).then((K)=>sl(K,k,a,j))}});var Bl=ce("$ZodIntersection",(a,p)=>{Tt.init(a,p),a._zod.parse=(v,b)=>{let k=v.value,j=p.left._zod.run({value:k,issues:[]},b),F=p.right._zod.run({value:k,issues:[]},b);if(j instanceof Promise||F instanceof Promise)return Promise.all([j,F]).then(([K,se])=>il(v,K,se));return il(v,j,F)}});function Is(a,p){if(a===p)return{valid:!0,data:a};if(a instanceof Date&&p instanceof Date&&+a===+p)return{valid:!0,data:a};if(Rn(a)&&Rn(p)){let v=Object.keys(p),b=Object.keys(a).filter((j)=>v.indexOf(j)!==-1),k={...a,...p};for(let j of b){let F=Is(a[j],p[j]);if(!F.valid)return{valid:!1,mergeErrorPath:[j,...F.mergeErrorPath]};k[j]=F.data}return{valid:!0,data:k}}if(Array.isArray(a)&&Array.isArray(p)){if(a.length!==p.length)return{valid:!1,mergeErrorPath:[]};let v=[];for(let b=0;b<a.length;b++){let k=a[b],j=p[b],F=Is(k,j);if(!F.valid)return{valid:!1,mergeErrorPath:[b,...F.mergeErrorPath]};v.push(F.data)}return{valid:!0,data:v}}return{valid:!1,mergeErrorPath:[]}}function il(a,p,v){let b=new Map,k;for(let W of p.issues)if(W.code==="unrecognized_keys"){k??(k=W);for(let K of W.keys){if(!b.has(K))b.set(K,{});b.get(K).l=!0}}else a.issues.push(W);for(let W of v.issues)if(W.code==="unrecognized_keys")for(let K of W.keys){if(!b.has(K))b.set(K,{});b.get(K).r=!0}else a.issues.push(W);let j=[...b].filter(([,W])=>W.l&&W.r).map(([W])=>W);if(j.length&&k)a.issues.push({...k,keys:j});if(Dn(a))return a;let F=Is(p.value,v.value);if(!F.valid)throw Error(`Unmergable intersection. Error path: ${JSON.stringify(F.mergeErrorPath)}`);return a.value=F.data,a}var ql=ce("$ZodRecord",(a,p)=>{Tt.init(a,p),a._zod.parse=(v,b)=>{let k=v.value;if(!Rn(k))return v.issues.push({expected:"record",code:"invalid_type",input:k,inst:a}),v;let j=[],F=p.keyType._zod.values;if(F){v.value={};let W=new Set;for(let se of F)if(typeof se==="string"||typeof se==="number"||typeof se==="symbol"){W.add(typeof se==="number"?se.toString():se);let ie=p.valueType._zod.run({value:k[se],issues:[]},b);if(ie instanceof Promise)j.push(ie.then((ae)=>{if(ae.issues.length)v.issues.push(...bn(se,ae.issues));v.value[se]=ae.value}));else{if(ie.issues.length)v.issues.push(...bn(se,ie.issues));v.value[se]=ie.value}}let K;for(let se in k)if(!W.has(se))K=K??[],K.push(se);if(K&&K.length>0)v.issues.push({code:"unrecognized_keys",input:k,inst:a,keys:K})}else{v.value={};for(let W of Reflect.ownKeys(k)){if(W==="__proto__")continue;let K=p.keyType._zod.run({value:W,issues:[]},b);if(K instanceof Promise)throw Error("Async schemas not supported in object keys currently");if(typeof W==="string"&&Rs.test(W)&&K.issues.length&&K.issues.some((ae)=>ae.code==="invalid_type"&&ae.expected==="number")){let ae=p.keyType._zod.run({value:Number(W),issues:[]},b);if(ae instanceof Promise)throw Error("Async schemas not supported in object keys currently");if(ae.issues.length===0)K=ae}if(K.issues.length){if(p.mode==="loose")v.value[W]=k[W];else v.issues.push({code:"invalid_key",origin:"record",issues:K.issues.map((ae)=>rn(ae,b,tn())),input:W,path:[W],inst:a});continue}let ie=p.valueType._zod.run({value:k[W],issues:[]},b);if(ie instanceof Promise)j.push(ie.then((ae)=>{if(ae.issues.length)v.issues.push(...bn(W,ae.issues));v.value[K.value]=ae.value}));else{if(ie.issues.length)v.issues.push(...bn(W,ie.issues));v.value[K.value]=ie.value}}}if(j.length)return Promise.all(j).then(()=>v);return v}});var Vl=ce("$ZodEnum",(a,p)=>{Tt.init(a,p);let v=eo(p.entries),b=new Set(v);a._zod.values=b,a._zod.pattern=new RegExp(`^(${v.filter((k)=>tc.has(typeof k)).map((k)=>typeof k==="string"?vn(k):k.toString()).join("|")})$`),a._zod.parse=(k,j)=>{let F=k.value;if(b.has(F))return k;return k.issues.push({code:"invalid_value",values:v,input:F,inst:a}),k}}),Jl=ce("$ZodLiteral",(a,p)=>{if(Tt.init(a,p),p.values.length===0)throw Error("Cannot create literal schema with no valid values");let v=new Set(p.values);a._zod.values=v,a._zod.pattern=new RegExp(`^(${p.values.map((b)=>typeof b==="string"?vn(b):b?vn(b.toString()):String(b)).join("|")})$`),a._zod.parse=(b,k)=>{let j=b.value;if(v.has(j))return b;return b.issues.push({code:"invalid_value",values:p.values,input:j,inst:a}),b}});var Wl=ce("$ZodTransform",(a,p)=>{Tt.init(a,p),a._zod.parse=(v,b)=>{if(b.direction==="backward")throw new pr(a.constructor.name);let k=p.transform(v.value,v);if(b.async)return(k instanceof Promise?k:Promise.resolve(k)).then((F)=>(v.value=F,v));if(k instanceof Promise)throw new pn;return v.value=k,v}});function al(a,p){if(a.issues.length&&p===void 0)return{issues:[],value:void 0};return a}var js=ce("$ZodOptional",(a,p)=>{Tt.init(a,p),a._zod.optin="optional",a._zod.optout="optional",Rt(a._zod,"values",()=>p.innerType._zod.values?new Set([...p.innerType._zod.values,void 0]):void 0),Rt(a._zod,"pattern",()=>{let v=p.innerType._zod.pattern;return v?new RegExp(`^(${ro(v.source)})?$`):void 0}),a._zod.parse=(v,b)=>{if(p.innerType._zod.optin==="optional"){let k=p.innerType._zod.run(v,b);if(k instanceof Promise)return k.then((j)=>al(j,v.value));return al(k,v.value)}if(v.value===void 0)return v;return p.innerType._zod.run(v,b)}}),Kl=ce("$ZodExactOptional",(a,p)=>{js.init(a,p),Rt(a._zod,"values",()=>p.innerType._zod.values),Rt(a._zod,"pattern",()=>p.innerType._zod.pattern),a._zod.parse=(v,b)=>p.innerType._zod.run(v,b)}),Yl=ce("$ZodNullable",(a,p)=>{Tt.init(a,p),Rt(a._zod,"optin",()=>p.innerType._zod.optin),Rt(a._zod,"optout",()=>p.innerType._zod.optout),Rt(a._zod,"pattern",()=>{let v=p.innerType._zod.pattern;return v?new RegExp(`^(${ro(v.source)}|null)$`):void 0}),Rt(a._zod,"values",()=>p.innerType._zod.values?new Set([...p.innerType._zod.values,null]):void 0),a._zod.parse=(v,b)=>{if(v.value===null)return v;return p.innerType._zod.run(v,b)}}),Xl=ce("$ZodDefault",(a,p)=>{Tt.init(a,p),a._zod.optin="optional",Rt(a._zod,"values",()=>p.innerType._zod.values),a._zod.parse=(v,b)=>{if(b.direction==="backward")return p.innerType._zod.run(v,b);if(v.value===void 0)return v.value=p.defaultValue,v;let k=p.innerType._zod.run(v,b);if(k instanceof Promise)return k.then((j)=>cl(j,p));return cl(k,p)}});function cl(a,p){if(a.value===void 0)a.value=p.defaultValue;return a}var Ql=ce("$ZodPrefault",(a,p)=>{Tt.init(a,p),a._zod.optin="optional",Rt(a._zod,"values",()=>p.innerType._zod.values),a._zod.parse=(v,b)=>{if(b.direction==="backward")return p.innerType._zod.run(v,b);if(v.value===void 0)v.value=p.defaultValue;return p.innerType._zod.run(v,b)}}),eu=ce("$ZodNonOptional",(a,p)=>{Tt.init(a,p),Rt(a._zod,"values",()=>{let v=p.innerType._zod.values;return v?new Set([...v].filter((b)=>b!==void 0)):void 0}),a._zod.parse=(v,b)=>{let k=p.innerType._zod.run(v,b);if(k instanceof Promise)return k.then((j)=>ll(j,a));return ll(k,a)}});function ll(a,p){if(!a.issues.length&&a.value===void 0)a.issues.push({code:"invalid_type",expected:"nonoptional",input:a.value,inst:p});return a}var tu=ce("$ZodCatch",(a,p)=>{Tt.init(a,p),Rt(a._zod,"optin",()=>p.innerType._zod.optin),Rt(a._zod,"optout",()=>p.innerType._zod.optout),Rt(a._zod,"values",()=>p.innerType._zod.values),a._zod.parse=(v,b)=>{if(b.direction==="backward")return p.innerType._zod.run(v,b);let k=p.innerType._zod.run(v,b);if(k instanceof Promise)return k.then((j)=>{if(v.value=j.value,j.issues.length)v.value=p.catchValue({...v,error:{issues:j.issues.map((F)=>rn(F,b,tn()))},input:v.value}),v.issues=[];return v});if(v.value=k.value,k.issues.length)v.value=p.catchValue({...v,error:{issues:k.issues.map((j)=>rn(j,b,tn()))},input:v.value}),v.issues=[];return v}});var nu=ce("$ZodPipe",(a,p)=>{Tt.init(a,p),Rt(a._zod,"values",()=>p.in._zod.values),Rt(a._zod,"optin",()=>p.in._zod.optin),Rt(a._zod,"optout",()=>p.out._zod.optout),Rt(a._zod,"propValues",()=>p.in._zod.propValues),a._zod.parse=(v,b)=>{if(b.direction==="backward"){let j=p.out._zod.run(v,b);if(j instanceof Promise)return j.then((F)=>lo(F,p.in,b));return lo(j,p.in,b)}let k=p.in._zod.run(v,b);if(k instanceof Promise)return k.then((j)=>lo(j,p.out,b));return lo(k,p.out,b)}});function lo(a,p,v){if(a.issues.length)return a.aborted=!0,a;return p._zod.run({value:a.value,issues:a.issues},v)}var ru=ce("$ZodReadonly",(a,p)=>{Tt.init(a,p),Rt(a._zod,"propValues",()=>p.innerType._zod.propValues),Rt(a._zod,"values",()=>p.innerType._zod.values),Rt(a._zod,"optin",()=>p.innerType?._zod?.optin),Rt(a._zod,"optout",()=>p.innerType?._zod?.optout),a._zod.parse=(v,b)=>{if(b.direction==="backward")return p.innerType._zod.run(v,b);let k=p.innerType._zod.run(v,b);if(k instanceof Promise)return k.then(ul);return ul(k)}});function ul(a){return a.value=Object.freeze(a.value),a}var ou=ce("$ZodCustom",(a,p)=>{Ht.init(a,p),Tt.init(a,p),a._zod.parse=(v,b)=>v,a._zod.check=(v)=>{let b=v.value,k=p.fn(b);if(k instanceof Promise)return k.then((j)=>dl(j,v,b,a));dl(k,v,b,a);return}});function dl(a,p,v,b){if(!a){let k={code:"custom",input:v,inst:b,path:[...b._zod.def.path??[]],continue:!b._zod.def.abort};if(b._zod.def.params)k.params=b._zod.def.params;p.issues.push(An(k))}}var su,N3=Symbol("ZodOutput"),z3=Symbol("ZodInput");class iu{constructor(){this._map=new WeakMap,this._idmap=new Map}add(a,...p){let v=p[0];if(this._map.set(a,v),v&&typeof v==="object"&&"id"in v)this._idmap.set(v.id,a);return this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(a){let p=this._map.get(a);if(p&&typeof p==="object"&&"id"in p)this._idmap.delete(p.id);return this._map.delete(a),this}get(a){let p=a._zod.parent;if(p){let v={...this.get(p)??{}};delete v.id;let b={...v,...this._map.get(a)};return Object.keys(b).length?b:void 0}return this._map.get(a)}has(a){return this._map.has(a)}}function bh(){return new iu}(su=globalThis).__zod_globalRegistry??(su.__zod_globalRegistry=bh());var vr=globalThis.__zod_globalRegistry;function au(a,p){return new a({type:"string",...pt(p)})}function cu(a,p){return new a({type:"string",format:"email",check:"string_format",abort:!1,...pt(p)})}function Ns(a,p){return new a({type:"string",format:"guid",check:"string_format",abort:!1,...pt(p)})}function lu(a,p){return new a({type:"string",format:"uuid",check:"string_format",abort:!1,...pt(p)})}function uu(a,p){return new a({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...pt(p)})}function du(a,p){return new a({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...pt(p)})}function pu(a,p){return new a({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...pt(p)})}function fu(a,p){return new a({type:"string",format:"url",check:"string_format",abort:!1,...pt(p)})}function mu(a,p){return new a({type:"string",format:"emoji",check:"string_format",abort:!1,...pt(p)})}function gu(a,p){return new a({type:"string",format:"nanoid",check:"string_format",abort:!1,...pt(p)})}function hu(a,p){return new a({type:"string",format:"cuid",check:"string_format",abort:!1,...pt(p)})}function yu(a,p){return new a({type:"string",format:"cuid2",check:"string_format",abort:!1,...pt(p)})}function vu(a,p){return new a({type:"string",format:"ulid",check:"string_format",abort:!1,...pt(p)})}function bu(a,p){return new a({type:"string",format:"xid",check:"string_format",abort:!1,...pt(p)})}function Lu(a,p){return new a({type:"string",format:"ksuid",check:"string_format",abort:!1,...pt(p)})}function wu(a,p){return new a({type:"string",format:"ipv4",check:"string_format",abort:!1,...pt(p)})}function xu(a,p){return new a({type:"string",format:"ipv6",check:"string_format",abort:!1,...pt(p)})}function ku(a,p){return new a({type:"string",format:"cidrv4",check:"string_format",abort:!1,...pt(p)})}function _u(a,p){return new a({type:"string",format:"cidrv6",check:"string_format",abort:!1,...pt(p)})}function Su(a,p){return new a({type:"string",format:"base64",check:"string_format",abort:!1,...pt(p)})}function Cu(a,p){return new a({type:"string",format:"base64url",check:"string_format",abort:!1,...pt(p)})}function Pu(a,p){return new a({type:"string",format:"e164",check:"string_format",abort:!1,...pt(p)})}function $u(a,p){return new a({type:"string",format:"jwt",check:"string_format",abort:!1,...pt(p)})}function Eu(a,p){return new a({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...pt(p)})}function Ru(a,p){return new a({type:"string",format:"date",check:"string_format",...pt(p)})}function Du(a,p){return new a({type:"string",format:"time",check:"string_format",precision:null,...pt(p)})}function Au(a,p){return new a({type:"string",format:"duration",check:"string_format",...pt(p)})}function Tu(a,p){return new a({type:"number",checks:[],...pt(p)})}function Iu(a,p){return new a({type:"number",check:"number_format",abort:!1,format:"safeint",...pt(p)})}function Ou(a,p){return new a({type:"boolean",...pt(p)})}function ju(a){return new a({type:"unknown"})}function Nu(a,p){return new a({type:"never",...pt(p)})}function fo(a,p){return new Ds({check:"less_than",...pt(p),value:a,inclusive:!1})}function br(a,p){return new Ds({check:"less_than",...pt(p),value:a,inclusive:!0})}function mo(a,p){return new As({check:"greater_than",...pt(p),value:a,inclusive:!1})}function Lr(a,p){return new As({check:"greater_than",...pt(p),value:a,inclusive:!0})}function go(a,p){return new Gc({check:"multiple_of",...pt(p),value:a})}function ho(a,p){return new qc({check:"max_length",...pt(p),maximum:a})}function Kn(a,p){return new Vc({check:"min_length",...pt(p),minimum:a})}function yo(a,p){return new Jc({check:"length_equals",...pt(p),length:a})}function zs(a,p){return new Wc({check:"string_format",format:"regex",...pt(p),pattern:a})}function Fs(a){return new Kc({check:"string_format",format:"lowercase",...pt(a)})}function Ms(a){return new Yc({check:"string_format",format:"uppercase",...pt(a)})}function Us(a,p){return new Xc({check:"string_format",format:"includes",...pt(p),includes:a})}function Hs(a,p){return new Qc({check:"string_format",format:"starts_with",...pt(p),prefix:a})}function Zs(a,p){return new el({check:"string_format",format:"ends_with",...pt(p),suffix:a})}function wn(a){return new tl({check:"overwrite",tx:a})}function Gs(a){return wn((p)=>p.normalize(a))}function Bs(){return wn((a)=>a.trim())}function qs(){return wn((a)=>a.toLowerCase())}function Vs(){return wn((a)=>a.toUpperCase())}function Js(){return wn((a)=>Qa(a))}function zu(a,p,v){return new a({type:"array",element:p,...pt(v)})}function Fu(a,p,v){return new a({type:"custom",check:"custom",fn:p,...pt(v)})}function Mu(a){let p=Lh((v)=>(v.addIssue=(b)=>{if(typeof b==="string")v.issues.push(An(b,v.value,p._zod.def));else{let k=b;if(k.fatal)k.continue=!1;k.code??(k.code="custom"),k.input??(k.input=v.value),k.inst??(k.inst=p),k.continue??(k.continue=!p._zod.def.abort),v.issues.push(An(k))}},a(v.value,v)));return p}function Lh(a,p){let v=new Ht({check:"custom",...pt(p)});return v._zod.check=a,v}var Ws=()=>{throw Error("JSON Schema conversion is not bundled into this plugin artifact")},Uu=()=>Ws,Ks=()=>Ws;var Ut=Ws;var wh={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},Hu=(a,p,v,b)=>{let k=v;k.type="string";let{minimum:j,maximum:F,format:W,patterns:K,contentEncoding:se}=a._zod.bag;if(typeof j==="number")k.minLength=j;if(typeof F==="number")k.maxLength=F;if(W){if(k.format=wh[W]??W,k.format==="")delete k.format;if(W==="time")delete k.format}if(se)k.contentEncoding=se;if(K&&K.size>0){let ie=[...K];if(ie.length===1)k.pattern=ie[0].source;else if(ie.length>1)k.allOf=[...ie.map((ae)=>({...p.target==="draft-07"||p.target==="draft-04"||p.target==="openapi-3.0"?{type:"string"}:{},pattern:ae.source}))]}},Zu=(a,p,v,b)=>{let k=v,{minimum:j,maximum:F,format:W,multipleOf:K,exclusiveMaximum:se,exclusiveMinimum:ie}=a._zod.bag;if(typeof W==="string"&&W.includes("int"))k.type="integer";else k.type="number";if(typeof ie==="number")if(p.target==="draft-04"||p.target==="openapi-3.0")k.minimum=ie,k.exclusiveMinimum=!0;else k.exclusiveMinimum=ie;if(typeof j==="number"){if(k.minimum=j,typeof ie==="number"&&p.target!=="draft-04")if(ie>=j)delete k.minimum;else delete k.exclusiveMinimum}if(typeof se==="number")if(p.target==="draft-04"||p.target==="openapi-3.0")k.maximum=se,k.exclusiveMaximum=!0;else k.exclusiveMaximum=se;if(typeof F==="number"){if(k.maximum=F,typeof se==="number"&&p.target!=="draft-04")if(se<=F)delete k.maximum;else delete k.exclusiveMaximum}if(typeof K==="number")k.multipleOf=K},Gu=(a,p,v,b)=>{v.type="boolean"};var Bu=(a,p,v,b)=>{v.not={}};var qu=(a,p,v,b)=>{};var Vu=(a,p,v,b)=>{let k=a._zod.def,j=eo(k.entries);if(j.every((F)=>typeof F==="number"))v.type="number";if(j.every((F)=>typeof F==="string"))v.type="string";v.enum=j},Ju=(a,p,v,b)=>{let k=a._zod.def,j=[];for(let F of k.values)if(F===void 0){if(p.unrepresentable==="throw")throw Error("Literal `undefined` cannot be represented in JSON Schema")}else if(typeof F==="bigint")if(p.unrepresentable==="throw")throw Error("BigInt literals cannot be represented in JSON Schema");else j.push(Number(F));else j.push(F);if(j.length===0);else if(j.length===1){let F=j[0];if(v.type=F===null?"null":typeof F,p.target==="draft-04"||p.target==="openapi-3.0")v.enum=[F];else v.const=F}else{if(j.every((F)=>typeof F==="number"))v.type="number";if(j.every((F)=>typeof F==="string"))v.type="string";if(j.every((F)=>typeof F==="boolean"))v.type="boolean";if(j.every((F)=>F===null))v.type="null";v.enum=j}};var Wu=(a,p,v,b)=>{if(p.unrepresentable==="throw")throw Error("Custom types cannot be represented in JSON Schema")};var Ku=(a,p,v,b)=>{if(p.unrepresentable==="throw")throw Error("Transforms cannot be represented in JSON Schema")};var Yu=(a,p,v,b)=>{let k=v,j=a._zod.def,{minimum:F,maximum:W}=a._zod.bag;if(typeof F==="number")k.minItems=F;if(typeof W==="number")k.maxItems=W;k.type="array",k.items=Ut(j.element,p,{...b,path:[...b.path,"items"]})},Xu=(a,p,v,b)=>{let k=v,j=a._zod.def;k.type="object",k.properties={};let F=j.shape;for(let se in F)k.properties[se]=Ut(F[se],p,{...b,path:[...b.path,"properties",se]});let W=new Set(Object.keys(F)),K=new Set([...W].filter((se)=>{let ie=j.shape[se]._zod;if(p.io==="input")return ie.optin===void 0;else return ie.optout===void 0}));if(K.size>0)k.required=Array.from(K);if(j.catchall?._zod.def.type==="never")k.additionalProperties=!1;else if(!j.catchall){if(p.io==="output")k.additionalProperties=!1}else if(j.catchall)k.additionalProperties=Ut(j.catchall,p,{...b,path:[...b.path,"additionalProperties"]})},Qu=(a,p,v,b)=>{let k=a._zod.def,j=k.inclusive===!1,F=k.options.map((W,K)=>Ut(W,p,{...b,path:[...b.path,j?"oneOf":"anyOf",K]}));if(j)v.oneOf=F;else v.anyOf=F},ed=(a,p,v,b)=>{let k=a._zod.def,j=Ut(k.left,p,{...b,path:[...b.path,"allOf",0]}),F=Ut(k.right,p,{...b,path:[...b.path,"allOf",1]}),W=(se)=>("allOf"in se)&&Object.keys(se).length===1,K=[...W(j)?j.allOf:[j],...W(F)?F.allOf:[F]];v.allOf=K};var td=(a,p,v,b)=>{let k=v,j=a._zod.def;k.type="object";let F=j.keyType,K=F._zod.bag?.patterns;if(j.mode==="loose"&&K&&K.size>0){let ie=Ut(j.valueType,p,{...b,path:[...b.path,"patternProperties","*"]});k.patternProperties={};for(let ae of K)k.patternProperties[ae.source]=ie}else{if(p.target==="draft-07"||p.target==="draft-2020-12")k.propertyNames=Ut(j.keyType,p,{...b,path:[...b.path,"propertyNames"]});k.additionalProperties=Ut(j.valueType,p,{...b,path:[...b.path,"additionalProperties"]})}let se=F._zod.values;if(se){let ie=[...se].filter((ae)=>typeof ae==="string"||typeof ae==="number");if(ie.length>0)k.required=ie}},nd=(a,p,v,b)=>{let k=a._zod.def,j=Ut(k.innerType,p,b),F=p.seen.get(a);if(p.target==="openapi-3.0")F.ref=k.innerType,v.nullable=!0;else v.anyOf=[j,{type:"null"}]},rd=(a,p,v,b)=>{let k=a._zod.def;Ut(k.innerType,p,b);let j=p.seen.get(a);j.ref=k.innerType},od=(a,p,v,b)=>{let k=a._zod.def;Ut(k.innerType,p,b);let j=p.seen.get(a);j.ref=k.innerType,v.default=JSON.parse(JSON.stringify(k.defaultValue))},sd=(a,p,v,b)=>{let k=a._zod.def;Ut(k.innerType,p,b);let j=p.seen.get(a);if(j.ref=k.innerType,p.io==="input")v._prefault=JSON.parse(JSON.stringify(k.defaultValue))},id=(a,p,v,b)=>{let k=a._zod.def;Ut(k.innerType,p,b);let j=p.seen.get(a);j.ref=k.innerType;let F;try{F=k.catchValue(void 0)}catch{throw Error("Dynamic catch values are not supported in JSON Schema")}v.default=F},ad=(a,p,v,b)=>{let k=a._zod.def,j=p.io==="input"?k.in._zod.def.type==="transform"?k.out:k.in:k.out;Ut(j,p,b);let F=p.seen.get(a);F.ref=j},cd=(a,p,v,b)=>{let k=a._zod.def;Ut(k.innerType,p,b);let j=p.seen.get(a);j.ref=k.innerType,v.readOnly=!0};var Ys=(a,p,v,b)=>{let k=a._zod.def;Ut(k.innerType,p,b);let j=p.seen.get(a);j.ref=k.innerType};var $h=ce("ZodISODateTime",(a,p)=>{kl.init(a,p),It.init(a,p)});function ld(a){return Eu($h,a)}var Eh=ce("ZodISODate",(a,p)=>{_l.init(a,p),It.init(a,p)});function ud(a){return Ru(Eh,a)}var Rh=ce("ZodISOTime",(a,p)=>{Sl.init(a,p),It.init(a,p)});function dd(a){return Du(Rh,a)}var Dh=ce("ZodISODuration",(a,p)=>{Cl.init(a,p),It.init(a,p)});function pd(a){return Au(Dh,a)}var fd=(a,p)=>{so.init(a,p),a.name="ZodError",Object.defineProperties(a,{format:{value:(v)=>ic(a,v)},flatten:{value:(v)=>sc(a,v)},addIssue:{value:(v)=>{a.issues.push(v),a.message=JSON.stringify(a.issues,mr,2)}},addIssues:{value:(v)=>{a.issues.push(...v),a.message=JSON.stringify(a.issues,mr,2)}},isEmpty:{get(){return a.issues.length===0}}})},yk=ce("ZodError",fd),qt=ce("ZodError",fd,{Parent:Error});var md=io(qt),gd=ao(qt),hd=gr(qt),yd=hr(qt),vd=lc(qt),bd=uc(qt),Ld=dc(qt),wd=pc(qt),xd=fc(qt),kd=mc(qt),_d=gc(qt),Sd=hc(qt);var Ot=ce("ZodType",(a,p)=>(Tt.init(a,p),Object.assign(a["~standard"],{jsonSchema:{input:Ks(a,"input"),output:Ks(a,"output")}}),a.toJSONSchema=Uu(a,{}),a.def=p,a.type=p.type,Object.defineProperty(a,"_def",{value:p}),a.check=(...v)=>a.clone(yn(p,{checks:[...p.checks??[],...v.map((b)=>typeof b==="function"?{_zod:{check:b,def:{check:"custom"},onattach:[]}}:b)]}),{parent:!0}),a.with=a.check,a.clone=(v,b)=>nn(a,v,b),a.brand=()=>a,a.register=(v,b)=>(v.add(a,b),a),a.parse=(v,b)=>md(a,v,b,{callee:a.parse}),a.safeParse=(v,b)=>hd(a,v,b),a.parseAsync=async(v,b)=>gd(a,v,b,{callee:a.parseAsync}),a.safeParseAsync=async(v,b)=>yd(a,v,b),a.spa=a.safeParseAsync,a.encode=(v,b)=>vd(a,v,b),a.decode=(v,b)=>bd(a,v,b),a.encodeAsync=async(v,b)=>Ld(a,v,b),a.decodeAsync=async(v,b)=>wd(a,v,b),a.safeEncode=(v,b)=>xd(a,v,b),a.safeDecode=(v,b)=>kd(a,v,b),a.safeEncodeAsync=async(v,b)=>_d(a,v,b),a.safeDecodeAsync=async(v,b)=>Sd(a,v,b),a.refine=(v,b)=>a.check(ky(v,b)),a.superRefine=(v)=>a.check(wo(v)),a.overwrite=(v)=>a.check(wn(v)),a.optional=()=>$d(a),a.exactOptional=()=>uy(a),a.nullable=()=>Ed(a),a.nullish=()=>$d(Ed(a)),a.nonoptional=(v)=>hy(a,v),a.array=()=>In(a),a.or=(v)=>ei([a,v]),a.and=(v)=>ti(a,v),a.transform=(v)=>Qs(a,Od(v)),a.default=(v)=>fy(a,v),a.prefault=(v)=>gy(a,v),a.catch=(v)=>vy(a,v),a.pipe=(v)=>Qs(a,v),a.readonly=()=>wy(a),a.describe=(v)=>{let b=a.clone();return vr.add(b,{description:v}),b},Object.defineProperty(a,"description",{get(){return vr.get(a)?.description},configurable:!0}),a.meta=(...v)=>{if(v.length===0)return vr.get(a);let b=a.clone();return vr.add(b,v[0]),b},a.isOptional=()=>a.safeParse(void 0).success,a.isNullable=()=>a.safeParse(null).success,a.apply=(v)=>v(a),a)),Rd=ce("_ZodString",(a,p)=>{po.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(b,k,j)=>Hu(a,b,k,j);let v=a._zod.bag;a.format=v.format??null,a.minLength=v.minimum??null,a.maxLength=v.maximum??null,a.regex=(...b)=>a.check(zs(...b)),a.includes=(...b)=>a.check(Us(...b)),a.startsWith=(...b)=>a.check(Hs(...b)),a.endsWith=(...b)=>a.check(Zs(...b)),a.min=(...b)=>a.check(Kn(...b)),a.max=(...b)=>a.check(ho(...b)),a.length=(...b)=>a.check(yo(...b)),a.nonempty=(...b)=>a.check(Kn(1,...b)),a.lowercase=(b)=>a.check(Fs(b)),a.uppercase=(b)=>a.check(Ms(b)),a.trim=()=>a.check(Bs()),a.normalize=(...b)=>a.check(Gs(...b)),a.toLowerCase=()=>a.check(qs()),a.toUpperCase=()=>a.check(Vs()),a.slugify=()=>a.check(Js())}),Oh=ce("ZodString",(a,p)=>{po.init(a,p),Rd.init(a,p),a.email=(v)=>a.check(cu(jh,v)),a.url=(v)=>a.check(fu(Nh,v)),a.jwt=(v)=>a.check($u(Xh,v)),a.emoji=(v)=>a.check(mu(zh,v)),a.guid=(v)=>a.check(Ns(Cd,v)),a.uuid=(v)=>a.check(lu(bo,v)),a.uuidv4=(v)=>a.check(uu(bo,v)),a.uuidv6=(v)=>a.check(du(bo,v)),a.uuidv7=(v)=>a.check(pu(bo,v)),a.nanoid=(v)=>a.check(gu(Fh,v)),a.guid=(v)=>a.check(Ns(Cd,v)),a.cuid=(v)=>a.check(hu(Mh,v)),a.cuid2=(v)=>a.check(yu(Uh,v)),a.ulid=(v)=>a.check(vu(Hh,v)),a.base64=(v)=>a.check(Su(Wh,v)),a.base64url=(v)=>a.check(Cu(Kh,v)),a.xid=(v)=>a.check(bu(Zh,v)),a.ksuid=(v)=>a.check(Lu(Gh,v)),a.ipv4=(v)=>a.check(wu(Bh,v)),a.ipv6=(v)=>a.check(xu(qh,v)),a.cidrv4=(v)=>a.check(ku(Vh,v)),a.cidrv6=(v)=>a.check(_u(Jh,v)),a.e164=(v)=>a.check(Pu(Yh,v)),a.datetime=(v)=>a.check(ld(v)),a.date=(v)=>a.check(ud(v)),a.time=(v)=>a.check(dd(v)),a.duration=(v)=>a.check(pd(v))});function Vt(a){return au(Oh,a)}var It=ce("ZodStringFormat",(a,p)=>{Dt.init(a,p),Rd.init(a,p)}),jh=ce("ZodEmail",(a,p)=>{ml.init(a,p),It.init(a,p)});var Cd=ce("ZodGUID",(a,p)=>{pl.init(a,p),It.init(a,p)});var bo=ce("ZodUUID",(a,p)=>{fl.init(a,p),It.init(a,p)});var Nh=ce("ZodURL",(a,p)=>{gl.init(a,p),It.init(a,p)});var zh=ce("ZodEmoji",(a,p)=>{hl.init(a,p),It.init(a,p)});var Fh=ce("ZodNanoID",(a,p)=>{yl.init(a,p),It.init(a,p)});var Mh=ce("ZodCUID",(a,p)=>{vl.init(a,p),It.init(a,p)});var Uh=ce("ZodCUID2",(a,p)=>{bl.init(a,p),It.init(a,p)});var Hh=ce("ZodULID",(a,p)=>{Ll.init(a,p),It.init(a,p)});var Zh=ce("ZodXID",(a,p)=>{wl.init(a,p),It.init(a,p)});var Gh=ce("ZodKSUID",(a,p)=>{xl.init(a,p),It.init(a,p)});var Bh=ce("ZodIPv4",(a,p)=>{Pl.init(a,p),It.init(a,p)});var qh=ce("ZodIPv6",(a,p)=>{$l.init(a,p),It.init(a,p)});var Vh=ce("ZodCIDRv4",(a,p)=>{El.init(a,p),It.init(a,p)});var Jh=ce("ZodCIDRv6",(a,p)=>{Rl.init(a,p),It.init(a,p)});var Wh=ce("ZodBase64",(a,p)=>{Al.init(a,p),It.init(a,p)});var Kh=ce("ZodBase64URL",(a,p)=>{Tl.init(a,p),It.init(a,p)});var Yh=ce("ZodE164",(a,p)=>{Il.init(a,p),It.init(a,p)});var Xh=ce("ZodJWT",(a,p)=>{Ol.init(a,p),It.init(a,p)});var Dd=ce("ZodNumber",(a,p)=>{Os.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(b,k,j)=>Zu(a,b,k,j),a.gt=(b,k)=>a.check(mo(b,k)),a.gte=(b,k)=>a.check(Lr(b,k)),a.min=(b,k)=>a.check(Lr(b,k)),a.lt=(b,k)=>a.check(fo(b,k)),a.lte=(b,k)=>a.check(br(b,k)),a.max=(b,k)=>a.check(br(b,k)),a.int=(b)=>a.check(Pd(b)),a.safe=(b)=>a.check(Pd(b)),a.positive=(b)=>a.check(mo(0,b)),a.nonnegative=(b)=>a.check(Lr(0,b)),a.negative=(b)=>a.check(fo(0,b)),a.nonpositive=(b)=>a.check(br(0,b)),a.multipleOf=(b,k)=>a.check(go(b,k)),a.step=(b,k)=>a.check(go(b,k)),a.finite=()=>a;let v=a._zod.bag;a.minValue=Math.max(v.minimum??Number.NEGATIVE_INFINITY,v.exclusiveMinimum??Number.NEGATIVE_INFINITY)??null,a.maxValue=Math.min(v.maximum??Number.POSITIVE_INFINITY,v.exclusiveMaximum??Number.POSITIVE_INFINITY)??null,a.isInt=(v.format??"").includes("int")||Number.isSafeInteger(v.multipleOf??0.5),a.isFinite=!0,a.format=v.format??null});function Ad(a){return Tu(Dd,a)}var Qh=ce("ZodNumberFormat",(a,p)=>{jl.init(a,p),Dd.init(a,p)});function Pd(a){return Iu(Qh,a)}var ey=ce("ZodBoolean",(a,p)=>{Nl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Gu(a,v,b,k)});function Tn(a){return Ou(ey,a)}var ty=ce("ZodUnknown",(a,p)=>{zl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>qu(a,v,b,k)});function Yn(){return ju(ty)}var ny=ce("ZodNever",(a,p)=>{Fl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Bu(a,v,b,k)});function Td(a){return Nu(ny,a)}var ry=ce("ZodArray",(a,p)=>{Ml.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Yu(a,v,b,k),a.element=p.element,a.min=(v,b)=>a.check(Kn(v,b)),a.nonempty=(v)=>a.check(Kn(1,v)),a.max=(v,b)=>a.check(ho(v,b)),a.length=(v,b)=>a.check(yo(v,b)),a.unwrap=()=>a.element});function In(a,p){return zu(ry,a,p)}var Id=ce("ZodObject",(a,p)=>{Zl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Xu(a,v,b,k),Rt(a,"shape",()=>p.shape),a.keyof=()=>xr(Object.keys(a._zod.def.shape)),a.catchall=(v)=>a.clone({...a._zod.def,catchall:v}),a.passthrough=()=>a.clone({...a._zod.def,catchall:Yn()}),a.loose=()=>a.clone({...a._zod.def,catchall:Yn()}),a.strict=()=>a.clone({...a._zod.def,catchall:Td()}),a.strip=()=>a.clone({...a._zod.def,catchall:void 0}),a.extend=(v)=>lh(a,v),a.safeExtend=(v)=>uh(a,v),a.merge=(v)=>dh(a,v),a.pick=(v)=>ah(a,v),a.omit=(v)=>ch(a,v),a.partial=(...v)=>ph(jd,a,v[0]),a.required=(...v)=>fh(Nd,a,v[0])});function xn(a,p){return new Id({type:"object",shape:a,catchall:Td(),...pt(p)})}function wr(a,p){return new Id({type:"object",shape:a,catchall:Yn(),...pt(p)})}var oy=ce("ZodUnion",(a,p)=>{Gl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Qu(a,v,b,k),a.options=p.options});function ei(a,p){return new oy({type:"union",options:a,...pt(p)})}var sy=ce("ZodIntersection",(a,p)=>{Bl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>ed(a,v,b,k)});function ti(a,p){return new sy({type:"intersection",left:a,right:p})}var iy=ce("ZodRecord",(a,p)=>{ql.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>td(a,v,b,k),a.keyType=p.keyType,a.valueType=p.valueType});function Lo(a,p,v){return new iy({type:"record",keyType:a,valueType:p,...pt(v)})}var Xs=ce("ZodEnum",(a,p)=>{Vl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(b,k,j)=>Vu(a,b,k,j),a.enum=p.entries,a.options=Object.values(p.entries);let v=new Set(Object.keys(p.entries));a.extract=(b,k)=>{let j={};for(let F of b)if(v.has(F))j[F]=p.entries[F];else throw Error(`Key ${F} not found in enum`);return new Xs({...p,checks:[],...pt(k),entries:j})},a.exclude=(b,k)=>{let j={...p.entries};for(let F of b)if(v.has(F))delete j[F];else throw Error(`Key ${F} not found in enum`);return new Xs({...p,checks:[],...pt(k),entries:j})}});function xr(a,p){let v=Array.isArray(a)?Object.fromEntries(a.map((b)=>[b,b])):a;return new Xs({type:"enum",entries:v,...pt(p)})}var ay=ce("ZodLiteral",(a,p)=>{Jl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Ju(a,v,b,k),a.values=new Set(p.values),Object.defineProperty(a,"value",{get(){if(p.values.length>1)throw Error("This schema contains multiple valid literal values. Use `.values` instead.");return p.values[0]}})});function kr(a,p){return new ay({type:"literal",values:Array.isArray(a)?a:[a],...pt(p)})}var cy=ce("ZodTransform",(a,p)=>{Wl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Ku(a,v,b,k),a._zod.parse=(v,b)=>{if(b.direction==="backward")throw new pr(a.constructor.name);v.addIssue=(j)=>{if(typeof j==="string")v.issues.push(An(j,v.value,p));else{let F=j;if(F.fatal)F.continue=!1;F.code??(F.code="custom"),F.input??(F.input=v.value),F.inst??(F.inst=a),v.issues.push(An(F))}};let k=p.transform(v.value,v);if(k instanceof Promise)return k.then((j)=>(v.value=j,v));return v.value=k,v}});function Od(a){return new cy({type:"transform",transform:a})}var jd=ce("ZodOptional",(a,p)=>{js.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Ys(a,v,b,k),a.unwrap=()=>a._zod.def.innerType});function $d(a){return new jd({type:"optional",innerType:a})}var ly=ce("ZodExactOptional",(a,p)=>{Kl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Ys(a,v,b,k),a.unwrap=()=>a._zod.def.innerType});function uy(a){return new ly({type:"optional",innerType:a})}var dy=ce("ZodNullable",(a,p)=>{Yl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>nd(a,v,b,k),a.unwrap=()=>a._zod.def.innerType});function Ed(a){return new dy({type:"nullable",innerType:a})}var py=ce("ZodDefault",(a,p)=>{Xl.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>od(a,v,b,k),a.unwrap=()=>a._zod.def.innerType,a.removeDefault=a.unwrap});function fy(a,p){return new py({type:"default",innerType:a,get defaultValue(){return typeof p==="function"?p():Cs(p)}})}var my=ce("ZodPrefault",(a,p)=>{Ql.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>sd(a,v,b,k),a.unwrap=()=>a._zod.def.innerType});function gy(a,p){return new my({type:"prefault",innerType:a,get defaultValue(){return typeof p==="function"?p():Cs(p)}})}var Nd=ce("ZodNonOptional",(a,p)=>{eu.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>rd(a,v,b,k),a.unwrap=()=>a._zod.def.innerType});function hy(a,p){return new Nd({type:"nonoptional",innerType:a,...pt(p)})}var yy=ce("ZodCatch",(a,p)=>{tu.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>id(a,v,b,k),a.unwrap=()=>a._zod.def.innerType,a.removeCatch=a.unwrap});function vy(a,p){return new yy({type:"catch",innerType:a,catchValue:typeof p==="function"?p:()=>p})}var by=ce("ZodPipe",(a,p)=>{nu.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>ad(a,v,b,k),a.in=p.in,a.out=p.out});function Qs(a,p){return new by({type:"pipe",in:a,out:p})}var Ly=ce("ZodReadonly",(a,p)=>{ru.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>cd(a,v,b,k),a.unwrap=()=>a._zod.def.innerType});function wy(a){return new Ly({type:"readonly",innerType:a})}var xy=ce("ZodCustom",(a,p)=>{ou.init(a,p),Ot.init(a,p),a._zod.processJSONSchema=(v,b,k)=>Wu(a,v,b,k)});function ky(a,p={}){return Fu(xy,a,p)}function wo(a){return Mu(a)}function ni(a,p){return Qs(Od(a),p)}var zd,_y=Array(O+1).fill("over-limit"),Fd=/^[^/]+\/[^/]+$/,xo=`must be an integer between ${Te} and ${Ie}`;var Sy=["version","safety","workflow","destructive_command_protection","secret_protection","audit"],ri=(a)=>{let p=wo(a);return p._zod.def.when=()=>!0,p};function Md(a){if(!ko(a)||!Array.isArray(a.rules)||a.rules.length<=O)return a;return{$schema:a.$schema,version:a.version,rules:_y,overrides:a.overrides,transparent_wrappers:a.transparent_wrappers}}function Cy(){let a=xr(Me),p=ei([kr("off"),wr({reason:Vt({error:"required non-empty string"}).min(1,"required non-empty string").max(I,`must be at most ${I} characters`).describe("Replacement block reason"),intent:a.optional()})],{error:'must be "off" or an object'}).describe("Disable a rule or replace its block reason and intent."),v=Vt({error:"must be a rulebook source string"}).min(1,"must be a non-empty rulebook source string"),b=Vt({error:"must be a command string"}).regex(_,"must match command pattern").describe("Command name such as 'git', 'docker', or 'rtk'."),k=wr({$schema:Yn().optional().describe("JSON Schema reference for IDE support"),version:kr(1).describe("Schema version (must be 1)"),rules:In(v,{error:"must be an array of rulebook source strings"}).max(O,de).default([]).describe("Rulebook source strings such as project-rules or owner/repo#main/team-rules"),overrides:Lo(Vt().meta({pattern:Fd.source}),p).default({}).describe("Rule overrides by id"),transparent_wrappers:In(b,{error:"must be an array of command strings"}).default([]).describe("Commands that transparently execute a visible protected child command")}),j=(le,he)=>{if(!ko(le))return;if(Array.isArray(le.rules)&&le.rules.length<=O){let ve=new Set;le.rules.forEach((ke,qe)=>{if(typeof ke!=="string"||ke==="")return;if(ke.trim()===""){he.addIssue({code:"custom",message:"must be a non-empty rulebook source string",path:["rules",qe]});return}let Ze=Je(ke);if(Ze){he.addIssue({code:"custom",message:Ze,path:["rules",qe]});return}if(ve.has(ke)){he.addIssue({code:"custom",message:`duplicate rulebook source "${ke}"`,path:["rules",qe]});return}ve.add(ke)})}if(ko(le.overrides))for(let ve of Object.keys(le.overrides)){if(Fd.test(ve))continue;he.addIssue({code:"custom",message:"must use <rulebook-name>/<rule-name>",path:["overrides",ve]})}if(!Array.isArray(le.transparent_wrappers))return;let be=new Set;le.transparent_wrappers.forEach((ve,ke)=>{if(typeof ve!=="string"||!_.test(ve))return;if(be.has(ve)){he.addIssue({code:"custom",message:`duplicate command "${ve}"`,path:["transparent_wrappers",ke]});return}if(Pe(ve)){he.addIssue({code:"custom",message:`reserved command "${ve}" cannot be a wrapper`,path:["transparent_wrappers",ke]});return}be.add(ve)})},F=ni(Md,k.check(wo(j))),W=ni(Md,k.check(ri(j))),K=(le,he)=>{if(!Array.isArray(le))return;let be=new Set;le.forEach((ve,ke)=>{let qe=ko(ve)?ve.name:void 0;if(typeof qe!=="string")return;if(be.has(qe.toLowerCase())){he.addIssue({code:"custom",message:`duplicate rule name "${qe}"`,path:[ke,"name"]});return}be.add(qe.toLowerCase())})},se="must match pattern (letters, numbers, hyphens, underscores)",ie=wr({name:Vt({error:"required string"}).regex(g,"must match pattern (letters, numbers, hyphens, underscores; max 64 chars)"),command:Vt({error:"required string"}).regex(_,"must match pattern (letters, numbers, hyphens, underscores)"),subcommand:Vt({error:"must be a string if provided"}).regex(_,"must match pattern (letters, numbers, hyphens, underscores)").optional(),block_args:In(Vt({error:"must be a string"}).refine((le)=>le!=="",{error:"must not be empty"}),{error:"required array"}).refine((le)=>le.length>0,{error:"must have at least one element"}),reason:Vt({error:"required string"}).refine((le)=>le!=="",{error:"must not be empty"}).refine((le)=>le.length<=I,{error:`must be at most ${I} characters`}),intent:a.optional()},{error:"must be an object"}),ae=wr({version:kr(1),rules:In(ie,{error:"must be an array"}).check(ri(K)).optional()});return{RulesConfigSchema:F,RulesConfigDiagnosticSchema:W,LegacyConfigSchema:ae}}function Py(a){let p=xn({fail_closed:Tn().optional(),paranoid_rm:Tn().optional(),paranoid_interpreters:Tn().optional()}),v=(k,j)=>ti(Lo(Vt().refine((F)=>k.has(F),{error:(F)=>`unknown ${j} rule id "${String(F.input)}"`}),Yn()),Lo(Vt(),xr(["on","off"]))),b=(k)=>In(Vt({error:"must be a non-empty path string"}),{error:"must be an array of paths"}).check(ri((j,F)=>{if(!Array.isArray(j))return;j.forEach((W,K)=>{if(typeof W!=="string")return;let se=k(W,a);if(se)F.addIssue({code:"custom",message:se,path:[K]})})}));return xn({version:kr(1),safety:xn({level:xr(["standard","strict","paranoid"]).optional(),overrides:p.optional()}).optional(),workflow:xn({worktree_mode:Tn().optional()}).optional(),destructive_command_protection:xn({enabled:Tn().optional(),overrides:v(ze,"destructive command").optional(),allow_paths:b(Ge).optional()}).optional(),secret_protection:xn({enabled:Tn().optional(),overrides:v(je,"secret protection").optional(),deny_paths:b(He).optional(),allow_paths:b(Ue).optional()}).optional(),audit:xn({retention_days:Ad({error:xo}).int(xo).min(Te,xo).max(Ie,xo).optional().describe("Days of audit log history to keep before the sweep deletes it")}).optional()})}function $y(){return zd??=Cy(),zd}function Ey(a){return Py(a)}function Ud(){return $y().LegacyConfigSchema}function Yt(a,p){let v=Ey(p).safeParse(a);if(v.success)return[];return oi(ht(v.error.issues,Sy,(b)=>b.code==="custom")," ")}function oi(a,p=": ",v=" "){return[...new Set(a.flatMap((b)=>Hd(b,p,v,[])))]}function Hd(a,p,v,b){let k=[...b,...a.path],j=yt(k);if(a.code==="unrecognized_keys")return a.keys.map((F)=>`${j?`${j}.`:""}unknown field "${F}"`);if(a.code==="invalid_key")return a.issues.map((F)=>F.message);if(a.code==="invalid_union"){let F=a.errors.flat().filter((W)=>W.path.length>0);if(F.length>0)return F.flatMap((W)=>Hd(W,p,v,k))}if(k.length===0)return[a.code==="invalid_type"?"Config must be an object":a.message];if(k.length===1&&(a.code==="too_big"||a.code==="too_small")&&a.origin==="array")return[a.message];return[`${j}${k.length===1?v:p}${Ry(a)}`]}function Ry(a){if(a.code==="invalid_value")return`must be ${Dy(a.values)}`;if(a.code!=="invalid_type"||!a.message.startsWith("Invalid input:"))return a.message;if(a.expected==="object"||a.expected==="record")return"must be an object if provided";return a.expected==="boolean"?"must be a boolean":a.message}function Dy(a){if(a.length>3)return`one of ${a.join(", ")}`;let p=a.map((v)=>typeof v==="string"?`"${v}"`:String(v));if(p.length<2)return`${p[0]}`;return`${p.slice(0,-1).join(", ")}${p.length>2?",":""} or ${p.at(-1)}`}function ko(a){return!!a&&typeof a==="object"&&!Array.isArray(a)}var Oy="config.json";function Gt(a,p,v,b){C(jy(a),`${JSON.stringify(p,null,2)}
`,v,b)}function jy(a){return typeof a==="string"?B(a):a}function si(a){let p=Ud().safeParse(a);return{errors:p.success?[]:oi(p.error.issues),ruleNames:new Set(Ye(a).map((v)=>v.toLowerCase()))}}function ii(a){let p=Zd(a);if(!p.ok)return p.result;return si(p.parsed)}function Zd(a){let p=[],v=new Set;try{let b=typeof a==="string"?B(a):a,k=r(b);if(k===null)return p.push(`File not found: ${b.path}`),{ok:!1,result:{errors:p,ruleNames:v}};if(!k.trim())return p.push("Config file is empty"),{ok:!1,result:{errors:p,ruleNames:v}};return{ok:!0,parsed:JSON.parse(k)}}catch(b){if(b instanceof o)return p.push(b.message),{ok:!1,result:{errors:p,ruleNames:v}};let k=b instanceof Error?b.message:String(b);return p.push(b instanceof SyntaxError?"Invalid JSON":k),{ok:!1,result:{errors:p,ruleNames:v}}}}function Gd(a){return Iy(a,".safety-net.json")}function kn(a){let p=Zd(a);if(!p.ok)return p.result;let v=gt(p.parsed);return{errors:v.errors,ruleNames:v.sources}}function _o(a,p={}){return Ty(Ay(Re(a,p)),Oy)}function Bd(a,p,v){let b;try{if(r(p)===null)return{path:a,exists:!1,valid:!1,ruleCount:0};b=kn(p),b.errors.push(...X(a,v))}catch(k){if(!(k instanceof o))throw k;b={errors:[k.message],ruleNames:new Set}}return{path:a,exists:!0,valid:b.errors.length===0,ruleCount:b.ruleNames.size,...b.errors.length>0?{errors:b.errors}:{}}}function zy(a,p){return{source:p,name:a.name,command:a.command,subcommand:a.subcommand,blockArgs:[...a.block_args],reason:a.reason}}function qd(a,p,v){let b=v?.userConfigPath??H(a),k=v?.projectConfigPath??G(p),j=Ny(b),F=pe(a,{cwd:p,userConfigPath:b,projectConfigPath:k,userConfigDir:j}),W=Y(a,{cwd:p,userConfigPath:b,projectConfigPath:k,userConfigDir:j}),K=new Map(F.rulebooks.flatMap((se)=>se.rules.map((ie)=>[ie,se.source])));return{userConfig:Bd(b,W.userConfigTarget,W.userScope),projectConfig:Bd(k,W.projectConfigTarget,W.projectScope),effectiveRules:F.rules.map((se)=>zy(se,K.get(se.name)??"project")),shadowedRules:[]}}var Fy=[{flag:n.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:n.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:n.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:n.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:n.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:n.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:n.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:n.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"}];function Vd(a){return[...Fy.map((p)=>({name:p.flag.name,value:$e(p.flag,a.env),isSet:wt(p.flag,a.env),legacyName:p.flag.legacyName,legacyValue:p.flag.legacyName?a.env.get(p.flag.legacyName):void 0,legacyIsSet:p.flag.legacyName?a.env.get(p.flag.legacyName)!==void 0:void 0,description:p.description,defaultBehavior:p.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:a.env.get("CC_SAFETY_NET_HOME"),isSet:a.env.get("CC_SAFETY_NET_HOME")!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var Jd={error:0,warning:1,info:2},My=["policy","config","audit"];function Uy(a){return a.map((p)=>{if(p==="ownership")return"is not owned by the current user";if(p==="permissions")return"has unsafe permissions";if(p==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var Hy=[{derive:(a)=>a.hooks.length>0&&a.hooks.every((p)=>!p.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(a)=>a.hooks.filter((p)=>p.inspectionStatus==="failed").map((p)=>{let v=d(p.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${v} inspection failed`,detail:`Doctor could not verify the ${v} integration configuration.`,fixHint:`Correct the reported ${v} configuration error, then run \`cc-safety-net doctor\` again.`,integration:p.platform}})},{derive:(a)=>a.userConfig.exists&&!a.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:a.userConfig.path}]:[]},{derive:(a)=>a.projectConfig.exists&&!a.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:a.projectConfig.path}]:[]},{derive:(a)=>a.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${a.configState.reason}`,fixHint:"Fix the file named in the reason, or run `cc-safety-net rule update` to vendor a remote source, then rerun doctor."}]:[]},{derive:(a)=>a.v2Leftovers&&a.v2Leftovers.length>0?[{checkId:"config.v2-leftovers",severity:"info",title:"Rulebook lock and cache leftovers detected",detail:`Files an earlier version left behind are no longer read: ${a.v2Leftovers.join(", ")}.`,fixHint:"Run `cc-safety-net rule sync` (add `--global` for user scope) to migrate them, then rerun doctor."}]:[]},{derive:(a)=>{let p=a.environment.find((v)=>v.name==="CC_SAFETY_NET_AUDIT_SCOPE");return dt(p?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...My.map((a)=>({derive:(p)=>p.posture.directories.filter((v)=>v.kind===a&&v.status==="unsafe").map((v)=>({checkId:`posture.${a}-directory-unsafe`,severity:"error",title:`${a[0]?.toUpperCase()}${a.slice(1)} directory is unsafe`,detail:`The ${a} directory ${Uy(v.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...v.path?{path:v.path}:{}}))})),{derive:(a)=>{let p=[...a.effectiveSafety.weakenedRuleOverrides].sort();return p.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${p.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${p.join(", ")}.`}]:[]}}];function Wd(a){return Hy.flatMap((p,v)=>p.derive(a).map((b,k)=>({finding:b,catalogOrder:v,occurrence:k}))).sort((p,v)=>Jd[p.finding.severity]-Jd[v.finding.severity]||p.catalogOrder-v.catalogOrder||p.occurrence-v.occurrence).map((p)=>p.finding)}function on(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var Zy=(a)=>on()?`\x1B[32m${a}\x1B[0m`:a,Gy=(a)=>on()?`\x1B[33m${a}\x1B[0m`:a,By=(a)=>on()?`\x1B[34m${a}\x1B[0m`:a,qy=(a)=>on()?`\x1B[35m${a}\x1B[0m`:a,Vy=(a)=>on()?`\x1B[36m${a}\x1B[0m`:a,Jy=(a)=>on()?`\x1B[31m${a}\x1B[0m`:a,Wy=(a)=>on()?`\x1B[2m${a}\x1B[0m`:a,Ky=(a)=>on()?`\x1B[1m${a}\x1B[0m`:a,et={green:Zy,yellow:Gy,blue:By,magenta:qy,cyan:Vy,red:Jy,dim:Wy,bold:Ky},Yy="\x1B[0m",Xy=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function Qy(a){let p=a;return()=>(p=(p*1664525+1013904223)%4294967296,p/4294967296)}function e0(a){let p=[...Xy],v=Qy(a);for(let b=p.length-1;b>0;b--){let k=Math.floor(v()*(b+1)),j=p[b];p[b]=p[k],p[k]=j}return p}function t0(a,p=0){if(!on())return"";let v=e0(p);return`\x1B[38;5;${v[a%v.length]}m`}function Kd(a,p,v=0){if(!on())return`"${a}"`;return`${t0(p,v)}"${a}"${Yy}`}function So(a){return a==="default"?"built-in default":`${a} policy`}var n0=new RegExp("\x1B\\[[0-9;]*m","g"),ai=(a)=>a.replace(n0,"").length;function On(a){let p=(a.headers??a.rows[0]??[]).map((F,W)=>{let K=Math.max(...a.rows.map((se)=>ai(se[W]??"")));return Math.max(ai(F),K)}),v=(F,W)=>F+" ".repeat(Math.max(0,W-ai(F))),b=(F,W)=>W[0]+p.map((K)=>F.repeat(K+2)).join(W[1])+W[2],k=(F)=>`│ ${F.map((W,K)=>v(W,p[K]??0)).join(" │ ")} │`,j=a.headers?[`   ${k(a.headers)}`,`   ${b("─",["├","┼","┤"])}`]:[];return[`   ${b("─",["┌","┬","┐"])}`,...j,...a.rows.map((F)=>`   ${k(F)}`),`   ${b("─",["└","┴","┘"])}`].join(`
`)}function Yd(a){let p=[];p.push("Hook Integration"),p.push(r0(a));let v=[],b=[];for(let k of a){let j=d(k.platform);if(k.errors&&k.errors.length>0)for(let F of k.errors)if(k.configured)v.push({platform:j,message:F});else b.push({platform:j,message:F})}for(let k of v)p.push(`   Warning (${k.platform}): ${k.message}`);for(let k of b)p.push(et.red(`   Error (${k.platform}): ${k.message}`));return p.join(`
`)}function r0(a){let p=["Platform","Discovery","Configuration","Inspection"],v=a.map((b)=>{let k=d(b.platform);if(b.inspectionStatus==="not-inspected"){let K=et.dim("Not inspected");return[k,K,K,K]}let j=b.detected?et.green("Detected"):b.inspectionStatus==="failed"?et.red("Unknown"):et.dim("Not detected"),F=b.configured?et.green("Configured"):b.detected?et.yellow("Not configured"):b.inspectionStatus==="failed"?et.red("Unknown"):et.dim("Not applicable"),W=b.inspectionStatus==="verified"?et.green("Verified"):b.inspectionStatus==="failed"?et.red("Failed"):et.dim("Not applicable");return[k,j,F,W]});return On({headers:p,rows:v})}function Xd(a){let v=["Guard Engine Verification",`   Synthetic self-test: ${a.failed>0?et.red(`${a.passed}/${a.total} FAIL`):et.green(`${a.passed}/${a.total} passed`)}`],b=a.results.filter((k)=>!k.passed);if(b.length>0){v.push(""),v.push(et.red("   Failures:"));for(let k of b)v.push(et.red(`   • ${k.description}`)),v.push(et.red(`     expected ${k.expected}, got ${k.actual}`))}return v.join(`
`)}function o0(a){if(a.length===0)return"   (no custom rules)";let p=["Source","Name","Command","Block Args"],v=a.map((b)=>[b.source,b.name,b.subcommand?`${b.command} ${b.subcommand}`:b.command,b.blockArgs.join(", ")]);return On({headers:p,rows:v})}function Qd(a){let p=[];if(p.push("Configuration"),p.push(s0(a.userConfig,a.projectConfig)),p.push(""),a.effectiveRules.length>0)p.push(`   Effective rules (${a.effectiveRules.length} total):`),p.push(o0(a.effectiveRules));else p.push("   Effective rules: (none - using built-in rules only)");for(let v of a.shadowedRules)p.push(""),p.push(`   Note: Project rule "${v.name}" shadows user rule with same name`);return p.join(`
`)}function s0(a,p){let v=["Scope","Status"],b=(j)=>{if(!j.exists)return et.dim("N/A");if(!j.valid)return et.red(`Invalid (${j.errors?.[0]??"unknown error"})`);return et.green("Configured")},k=[["User",b(a)],["Project",b(p)]];return On({headers:v,rows:k})}function ep(a){let p=[];return p.push("Environment"),p.push(i0(a)),p.join(`
`)}function tp(a){let p=a.effectiveSafety.policyScopes,v=["Effective Safety",`   Selected preset: ${a.effectiveSafety.selectedPreset}${p?` (${So(p.levelScope)})`:""}`,`   Effective: ${a.effectiveSafety.level}`],b=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[k,j]of b){let F=a.effectiveSafety.capabilities[k],W=F.enabled?et.green("ON"):et.dim("OFF"),K=F.sources.length>0?` (${F.sources.join(", ")})`:"";v.push(`   ${j}: ${W} via ${F.source}${K}`)}if(p&&p.weakenings.length>0){v.push("   Project policy deltas:");for(let k of p.weakenings)v.push(`      ${k}`)}v.push(`   Stored rule customizations: ${a.effectiveSafety.ruleCounts.stored}`),v.push(`   Effective rule customizations: ${a.effectiveSafety.ruleCounts.effective}`);for(let[k,j]of Object.entries(a.effectiveSafety.ruleOverrides))v.push(`   ${k}: ${j}`);return v.join(`
`)}function np(a){let p=["Findings"];if(a.length===0)return p.push("   No findings from inspected doctor facts."),p.join(`
`);for(let v of a){let b=`[${v.severity.toUpperCase()}] ${v.checkId}: ${Mt(v.title)}`,k=v.severity==="error"?et.red:v.severity==="warning"?et.yellow:et.blue;if(p.push(`   ${k(b)}`),p.push(`      ${Mt(v.detail)}`),v.path)p.push(`      Path: ${Mt(v.path)}`);if(v.fixHint)p.push(`      Fix: ${Mt(v.fixHint)}`)}return p.join(`
`)}function i0(a){let p=["Variable","Status","Legacy"],v=a.map((b)=>{let k=b.isSet?et.green("✓"):et.dim("✗"),j=b.legacyName&&b.legacyIsSet?`${b.legacyName} ${et.green("✓")}`:b.legacyName??"";return[b.name,k,j]});return On({headers:p,rows:v})}function rp(a){let p=[];if(a.totalBlocked===0)p.push("Recent Activity"),p.push("   No blocked commands in the last 7 days"),p.push("   Tip: This is normal for new installations");else p.push(`Recent Activity · last 7 days (${a.totalBlocked} blocked / ${a.sessionCount} sessions)`),p.push(a0(a.recentEntries));if(a.unreadable>0)p.push(`   Warning: ${a.unreadable} audit log ${a.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return p.join(`
`)}function a0(a){let p=["Time","Command"],v=a.map((b)=>{let k=Mt(b.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),j=k.length>40?`${k.slice(0,37)}...`:k;return[b.relativeTime,j]});return On({headers:p,rows:v})}function op(a){let p=[];if(p.push("Update Check"),a.latestVersion===null&&!a.error)return p.push(Co([["Status",et.dim("Skipped")],["Installed",a.currentVersion]])),p.join(`
`);if(a.error)return p.push(Co([["Status",`${et.yellow("⚠")} Error`],["Installed",a.currentVersion],["Error",et.dim(a.error)]])),p.join(`
`);if(a.updateAvailable)return p.push(Co([["Status",`${et.yellow("⚠")} Update Available`],["Current",a.currentVersion],["Latest",et.green(a.latestVersion??"")]])),p.push(""),p.push("   Run: bunx cc-safety-net@latest doctor"),p.push("   Or:  npx cc-safety-net@latest doctor"),p.join(`
`);return p.push(Co([["Status",`${et.green("✓")} Up to date`],["Version",a.currentVersion]])),p.join(`
`)}function Co(a){return On({rows:a})}function sp(a){let p=[];return p.push("System Info"),p.push(c0(a)),p.join(`
`)}function c0(a){let p=["Component","Version"],v=(j)=>{if(j===null)return et.dim("not found");return j},k=[{label:"cc-safety-net",value:a.version},...at.map((j)=>({label:d(j),value:a.versions[j]??null})),{label:"Node.js",value:a.nodeVersion},{label:"npm",value:a.npmVersion},{label:"Bun",value:a.bunVersion},{label:"Platform",value:a.platform}].map((j)=>[j.label,v(j.value)]);return On({headers:p,rows:k})}function ip(a){if(a.findings.length===0)return et.green(`
No findings from inspected doctor facts.`);let p={error:a.findings.filter((j)=>j.severity==="error").length,warning:a.findings.filter((j)=>j.severity==="warning").length,info:a.findings.filter((j)=>j.severity==="info").length},v=["error","warning","info"].filter((j)=>p[j]>0).map((j)=>`${p[j]} ${j}`),b=a.findings.length===1?"finding":"findings",k=`
${a.findings.length} ${b}: ${v.join(", ")}.`;if(p.error>0)return et.red(k);if(p.warning>0)return et.yellow(k);return et.blue(k)}import{lstatSync as l0}from"node:fs";import{dirname as ci}from"node:path";function li(a,p){try{let v=l0(p);if(v.isSymbolicLink())return{kind:a,path:p,status:"unsafe",issues:["symlink"]};if(!v.isDirectory())return{kind:a,path:p,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:a,path:p,status:"unknown",issues:[]};let b=[...v.uid!==process.getuid()?["ownership"]:[],...(v.mode&18)!==0?["permissions"]:[]];return{kind:a,path:p,status:b.length>0?"unsafe":"safe",issues:b}}catch(v){if(typeof v==="object"&&v!==null&&"code"in v&&v.code==="ENOENT")return{kind:a,path:p,status:"not-applicable",issues:[]};return{kind:a,path:p,status:"unknown",issues:[]}}}function ap(a,p){let v=q(a);return{directories:[li("policy",ci(ci(p))),li("config",ci(p)),...v?[li("audit",v)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as u0}from"node:child_process";import{existsSync as cp}from"node:fs";import{delimiter as d0,extname as p0,join as f0}from"node:path";import{stripVTControlCharacters as lp}from"node:util";var dp="2.3.4",m0=5000,g0="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function zt(){return dp}function ui(a,p){let v=a[p];if(v)return v;let b=Object.keys(a).find((k)=>k.toLowerCase()===p.toLowerCase()&&!!a[k]);return b?a[b]:v}function h0(a){return(ui(a,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((p)=>p.length>0)}function y0(a,p){let v=p0(a)?[a]:[...h0(p).map((b)=>`${a}${b}`),a];if(a.includes("/")||a.includes("\\"))return v.find((b)=>cp(b))??a;return(ui(p,"PATH")??"").split(d0).flatMap((b)=>v.map((k)=>f0(b,k))).find((b)=>cp(b))??a}function up(a){if(!/[\s"&|<>^]/.test(a))return a;return`"${a.replace(/"/g,'""')}"`}function jn(a,p){let[v,...b]=a,k=p[g0]==="win32"?"win32":process.platform;if(!v||k!=="win32")return{cmd:v??"",args:b};let j=y0(v,p);if(!/\.(?:bat|cmd)$/i.test(j))return{cmd:j,args:b};return{cmd:ui(p,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",up(j),...b.map(up)].join(" ")]}}var Xn=async(a,p=m0)=>{let v=await v0(a,{timeoutMs:p});if(v.code!==0)return null;return lp(v.stdout).trim()||lp(v.stderr).trim()||null};function v0(a,p){let[v,...b]=a;if(!v)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((k)=>{try{let j=jn([v,...b],process.env),F=u0(j.cmd,j.args,{stdio:["ignore","pipe","pipe"]}),W=!1,K="",se="";F.stdout.on("data",(le)=>{K+=le.toString()}),F.stderr.on("data",(le)=>{se+=le.toString()});let ie=(le)=>{if(W)return;W=!0,clearTimeout(ae),k(le)},ae=setTimeout(()=>{F.kill(),ie({code:null,stdout:K,stderr:se})},p.timeoutMs);F.on("close",(le)=>{ie({code:le,stdout:K,stderr:se})}),F.on("error",()=>{ie({code:null,stdout:K,stderr:se})})}catch{k({code:null,stdout:"",stderr:""})}})}function Po(a){if(!a)return null;let p=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(a);if(p)return p[1]??null;let v=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(a);if(v)return v[1]??null;return a.split(`
`)[0]?.trim()||null}async function _r(a=Xn){let[p,v,b,k,j,F]=await Promise.all([Promise.all(U.map(async(W)=>[W.id,Po(await a([...W.probeCommand]))])),a(["codex","plugin","list"],30000),a(["amp","plugins","list"],30000),a(["node","--version"]),a(["npm","--version"]),a(["bun","--version"])]);return{version:dp,versions:Object.fromEntries(p),codexPluginListOutput:v,ampPluginListOutput:b,nodeVersion:Po(k),npmVersion:Po(j),bunVersion:Po(F),platform:`${process.platform} ${process.arch}`}}function di(a,p){if(p==="dev")return!1;let v=a.split(".").map(Number),b=p.split(".").map(Number),[k=0,j=0,F=0]=v,[W=0,K=0,se=0]=b;if(k!==W)return k>W;if(j!==K)return j>K;return F>se}async function _n(){let a=zt(),p=new AbortController,v=setTimeout(()=>p.abort(),3000);try{let b=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:p.signal});if(!b.ok)return{currentVersion:a,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${b.status}`};let k=await b.json(),j=di(k.version,a);return{currentVersion:a,latestVersion:k.version,updateAvailable:j}}catch(b){return{currentVersion:a,latestVersion:null,updateAvailable:!1,error:b instanceof Error?b.message:"Network error"}}finally{clearTimeout(v)}}import*as bp from"node:readline";var gp=(a)=>`\x1B[${a}B`,b0=(a)=>`\x1B[${a}A`;var pp=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function L0(a){return new Promise((p)=>setTimeout(p,a))}function w0(a,p,v){if(!v)return p(a);if(v.aborted)return Promise.resolve();return new Promise((b,k)=>{let j=()=>v.removeEventListener("abort",F),F=()=>{j(),b()};v.addEventListener("abort",F,{once:!0}),p(a).then(()=>{j(),b()},(W)=>{j(),k(W)})})}function Sr(a,p){return a&&a>0?a:p}function $o(a){return Math.max(0,Math.min(1,a))}function Qn(a){return Math.max(0,Math.min(255,Math.round(a)))}function pi(a){return a<=0.0031308?12.92*a:1.055*a**0.4166666666666667-0.055}function x0(a,p,v){let b=v*Math.PI/180,k=p*Math.cos(b),j=p*Math.sin(b),F=(a+0.3963377774*k+0.2158037573*j)**3,W=(a-0.1055613458*k-0.0638541728*j)**3,K=(a-0.0894841775*k-1.291485548*j)**3;return{blue:Qn(pi($o(-0.0041960863*F-0.7034186147*W+1.707614701*K))*255),green:Qn(pi($o(-1.2684380046*F+2.6097574011*W-0.3413193965*K))*255),red:Qn(pi($o(4.0767416621*F-3.3077115913*W+0.2309699292*K))*255)}}function fi(a,p){let v=(p*a*180/Math.PI%360+360)%360;return x0(0.72,0.15,v)}function hp(a,p=0.1){let v=fi(p,a);return`\x1B[38;2;${v.red};${v.green};${v.blue}m`}function k0(a,p){return{blue:Qn(a.blue+(255-a.blue)*p),green:Qn(a.green+(255-a.green)*p),red:Qn(a.red+(255-a.red)*p)}}function yp(a,p,v){let b=Math.imul(a+2654435769,2246822507)^Math.imul(p+3266489909,668265263)^Math.imul(v+374761393,2654435761),k=b^b>>>15,j=Math.imul(k,739982445),F=j^j>>>12,W=Math.imul(F,695872825);return((W^W>>>15)>>>0)/4294967296}function _0(a,p,v){let b=Math.floor(yp(a,p,v)*pp.length);return pp[b]??"░"}function fp(a){let p=$o(a);return p*p*p*(p*(p*6-15)+10)}function S0(a){if(a.length===0)return"";let p=[],v=!1,b="";for(let k of a){let j=`${k.red};${k.green};${k.blue}`;if(k.bold!==v)p.push(k.bold?"\x1B[1m":"\x1B[22m"),v=k.bold;if(j!==b)p.push(`\x1B[38;2;${j}m`),b=j;p.push(k.character)}return`${p.join("")}\x1B[22m\x1B[39m`}function C0(a,p,v,b,k){return a.map((j,F)=>({...fi(v,b+p+F/k),bold:!1,character:j}))}function P0(a,p,v,b,k,j,F,W){let K=Math.max(1,b*0.75),se=Math.min(1,v/K),ie=k*fp(se),ae=Math.max(0,(v-K)/Math.max(1,b-K)),le=(1-fp(v/b))*W*2,he=0.35*Math.max(0,1-ae*2),be=se>=1,ve=Math.min(a.length,Math.ceil(ie+2+1));return a.slice(0,ve).map((ke,qe)=>{let Ze=fi(j,F+p+qe/W+le),De=qe+yp(p,qe,7919)*2-1;if(De>ie+2)return{...Ze,bold:!1,character:" "};let Pt=ie-De,Ke=0.8*Math.exp(-(Pt*Pt)/12.5),At=Math.min(0.9,Ke+he),dn=!be&&De>ie-4;return{...k0(Ze,At),bold:At>0.3,character:dn?_0(p,qe,v):ke}})}function mp(a){return`\x1B[?2026h${a.map((p,v)=>`\x1B8${v>0?gp(v):""}${S0(p)}`).join("")}\x1B[?2026l`}async function mi(a,p={}){if(!a)return;let v=p.output??process.stdout,b=p.sleep??L0,k=Sr(p.frequency,0.1),j=p.seed??0,F=Sr(p.speed,40),W=Sr(p.spread,3),K=Sr(p.frameRate,60),se=Math.max(1,Math.floor(Sr(p.duration,12))),ie=a.split(`
`).map((ve)=>Array.from(ve)),ae=Math.max(...ie.map((ve)=>ve.length)),le=1000*se*ie.filter((ve)=>ve.length>0).length/F,he=ae>0?Math.max(1,Math.ceil(le/(1000/K))):0,be=he>0?le/he:0;v.write(`\x1B[?25l${ie.length>1?`${`
`.repeat(ie.length-1)}${b0(ie.length-1)}`:""}\x1B7`);try{for(let ve=1;ve<=he;ve+=1){if(p.signal?.aborted)break;v.write(mp(ie.map((ke,qe)=>P0(ke,qe,ve,he,ae,k,j,W)))),await w0(be,b,p.signal)}}finally{if(v.write(mp(ie.map((ve,ke)=>C0(ve,ke,k,j,W)))),v.write("\x1B8"),ie.length>1)v.write(gp(ie.length-1));v.write(`
\x1B[0m\x1B[?25h`)}}var vp=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function $0(a){return Boolean(a.isTTY)}async function Cr(a={}){let p=a.output??process.stdout;if(!$0(p))return;let v=a.input??process.stdin,b={duration:a.duration,frequency:a.frequency,output:p,seed:a.seed??Math.random()*8192,sleep:a.sleep,speed:a.speed,spread:a.spread};if(!v.isTTY||typeof v.setRawMode!=="function"){await mi(vp,b);return}let k=new AbortController,j=v.readableFlowing===!0,F=v.isRaw===!0,W=!1,K=(se,ie)=>{if(ie.ctrl&&ie.name==="c")W=!0;if(W||ie.name==="return"||ie.name==="enter")k.abort()};bp.emitKeypressEvents(v),v.on("keypress",K),v.setRawMode(!0),v.resume();try{await mi(vp,{...b,signal:k.signal})}finally{if(v.off("keypress",K),v.setRawMode(F),!j)v.pause()}if(!W)return;if(a.onInterrupt){a.onInterrupt();return}process.kill(process.pid,"SIGINT")}import{createHash as T0}from"node:crypto";import{existsSync as xp}from"node:fs";import{dirname as Eo,join as kp}from"node:path";import{dirname as Lp,join as E0,resolve as R0}from"node:path";var D0="rule.lock";function A0(a){return E0(Lp(a),D0)}function wp(a={}){return R0(a.cwd??process.cwd(),".safety-net.json")}function Bt(a,p){let v=p.global?p.userConfigPath??H(a,p):p.projectConfigPath??G(p.cwd??process.cwd()),b=p.global?ft(a,p):mt(v,p.cwd??process.cwd()),k=A0(v);return{configDir:Lp(v),configPath:v,lockPath:k,filesystemScope:b,configTarget:i(b,v),lockTarget:i(b,k)}}var I0="`cc-safety-net rule sync` is deprecated: rulebooks are live files that need no synchronization. This run only migrates the lock and cache an earlier version left behind.",O0="cache",j0="rulebooks";function _p(a,p={}){let v=Bt(a,p),b=i(v.filesystemScope,Cp(v.configDir)),k=r(v.lockTarget);if(console.log(I0),k===null&&!xp(b.path))return console.log(`No v2 lock or cache leftovers found in ${Eo(v.configDir)}; nothing to migrate.`),0;let j=U0(k),F=w(v.configTarget);if(!F.config&&(r(v.configTarget)!==null||j.size>0))return console.error(`Cannot migrate: the rules config in ${Eo(v.configDir)} is missing or unreadable while v2 leftovers remain. Restore rule.json, then re-run rule sync.`),1;let W=F.config?.rules??[];for(let K of W.flatMap((se)=>N0(se,j,v,b,p.global===!0)))console.log(K);return J(v.lockTarget),xt(b),console.log(`Removed the v2 lock and cache under ${Eo(v.configDir)}.`),0}function Sp(a,p){return[...new Set([{cwd:p},{cwd:p,global:!0}].flatMap((v)=>{let b=Bt(a,v);return[b.lockPath,Cp(b.configDir)]}))].filter((v)=>xp(v))}function N0(a,p,v,b,k){if(!T(a))return[];let j=V(a).name,F=i(v.filesystemScope,Z(v.configDir,j)),W=r(F);if(W!==null&&z0(W,j))return[];let K=p.get(a),se=K?F0(K,j,b.path,v.filesystemScope):null;if(se===null)return[`Could not migrate ${a} from the v2 cache. Run \`cc-safety-net rule update ${a}${k?" --global":""}\` to vendor it.`];if(C(F,se),W!==null)return[`Restored ${a} from the v2 cache over an invalid file.`];return[`Vendored ${a} from the v2 cache.`]}function z0(a,p){let v=Ae(a);return!("problem"in v)&&v.rulebook.name===p}function F0(a,p,v,b){let k=kp(v,j0,`${M0(a)}--${a.digest.replace("sha256:","").slice(0,12)}`,Le),j=r(i(b,k));if(j===null||G0(j)!==a.digest)return null;let F=Ae(j);if("problem"in F||F.rulebook.name!==p)return null;return j}function Cp(a){return kp(Eo(a),O0)}function M0(a){return([a.owner,a.repo,a.display_ref,a.name].every((b)=>typeof b==="string"&&b!=="")?`${a.owner}/${a.repo}#${a.display_ref}/${a.name}`:a.spec).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rulebook"}function U0(a){let p=a===null?null:Z0(a),v=Pp(p)&&Array.isArray(p.rulebooks)?p.rulebooks:[];return new Map(v.filter(H0).map((b)=>[b.spec,b]))}function H0(a){return Pp(a)&&typeof a.spec==="string"&&typeof a.digest==="string"}function Pp(a){return!!a&&typeof a==="object"}function Z0(a){try{return JSON.parse(a)}catch{return null}}function G0(a){return`sha256:${T0("sha256").update(a).digest("hex")}`}var $p="\r\x1B[2K",B0="\x1B[?25l",q0="\x1B[39m",V0="\x1B[?25h",J0=100,W0=0.55,K0=80,Ep=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function Y0(a){return new Promise((p)=>setTimeout(p,a))}async function Ro(a,p={}){let v=p.output??process.stdout;if(!v.isTTY)return a;let b=p.sleep??Y0,k=!1,j=a.then((W)=>(k=!0,W),(W)=>{throw k=!0,W});if(await Promise.race([j.then(()=>!0),b(J0).then(()=>!1)]))return j;v.write(B0);try{for(let W=0;!k;W+=1)v.write(`${$p}${hp(W*W0)}${Ep[W%Ep.length]}${q0} ${p.loadingMessage??"Loading…"}`),await Promise.race([j,b(K0)]);return await j}finally{v.write(`${$p}${V0}`)}}async function Pr(a,p,v,b={}){let k=p();if(a)await v();if(a&&k.ready)await Ro(k.ready,b);return k.finish()}import{stripVTControlCharacters as X0}from"node:util";var Do="amp plugins list",Q0=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function Rp(a){if(!a.ampPluginListOutput)return{platform:"amp",status:"n/a"};let p=X0(a.ampPluginListOutput).split(`
`).map((v)=>Q0.exec(v)?.[1]).find((v)=>v!==void 0);if(!p)return{platform:"amp",status:"n/a"};if(p!=="active")return{platform:"amp",status:"disabled",method:Do,configPath:Do,errors:[`Amp personal plugin cc-safety-net is ${p}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:Do,configPath:Do}}import{existsSync as e1,readFileSync as t1}from"node:fs";var n1=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function r1(a){if(!a||typeof a!=="object"||Array.isArray(a))return[];return Object.values(a).flatMap((p)=>{if(!p||typeof p!=="object"||Array.isArray(p))return[];let v=p,b=v.PreToolUse;if(!Array.isArray(b))return[];return b.flatMap((k)=>{if(!k||typeof k!=="object"||Array.isArray(k))return[];let j=k.hooks;if(!Array.isArray(j))return[];return j.flatMap((F)=>{if(!F||typeof F!=="object"||Array.isArray(F))return[];let W=F.command;if(typeof W!=="string"||!n1.test(W))return[];return[{command:W,enabled:v.enabled!==!1}]})})})}function Dp(a){let p=Be(a.environment.home);if(!e1(p))return{platform:"antigravity-cli",status:"n/a",configPath:p};let v;try{v=r1(JSON.parse(t1(p,"utf-8")))}catch(b){return{platform:"antigravity-cli",status:"n/a",configPath:p,errors:[`Failed to parse Antigravity hooks config ${p}: ${b instanceof Error?b.message:String(b)}`]}}if(v.some((b)=>b.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:p};if(v.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:p};return{platform:"antigravity-cli",status:"n/a",configPath:p}}import{join as Ap}from"node:path";import{existsSync as o1,lstatSync as s1,readFileSync as i1}from"node:fs";function sn(a,p=(v)=>v){if(!o1(a))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(p(i1(a,"utf-8")))}}catch{return{kind:"unreadable"}}}function Nt(a){try{return s1(a)}catch{return}}function Ao(a,p){let v=Nt(p);if(!v)return{platform:a,status:"n/a",configPath:p};if(!v.isSymbolicLink()&&v.isDirectory())return;return{platform:a,status:"n/a",configPath:p,errors:[`${p} is a symlink or not a directory; move or remove it before installing`]}}function $t(a,p){return typeof a==="object"&&a!==null?a[p]:void 0}var gi="cc-safety-net@cc-marketplace";function Tp(a){return Ap(a.home,".claude","plugins","installed_plugins.json")}function Ip(a,p){let v=$t($t(a,"plugins"),p);return Array.isArray(v)&&v.length>0}function To(a,p){let v=sn(Tp(a));return v.kind==="ok"&&Ip(v.value,p)}function hi(a){let p=Tp(a),v=sn(p);if(v.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(v.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!Ip(v.value,gi))return{platform:"claude-code",status:"n/a"};let b=Ap(a.home,".claude","settings.json"),k=sn(b);if(k.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(k.kind==="ok"&&$t($t(k.value,"enabledPlugins"),gi)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:b,errors:[`${gi} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:p}}function Op(a){return hi(a.environment)}function jp(a){if(!a.codexPluginListOutput)return{platform:"codex",status:"n/a"};let p=a.codexPluginListOutput.split(`
`).find((v)=>v.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!p)return{platform:"codex",status:"n/a"};if(!p.includes("installed,"))return{platform:"codex",status:"n/a"};if(!p.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list"}}import{existsSync as Fo,readdirSync as a1,readFileSync as c1}from"node:fs";import{join as Zt}from"node:path";function Wt(a){let p="",v=0,b=!1,k=!1,j=-1;while(v<a.length){let F=a[v],W=a[v+1];if(k){p+=F,k=!1,v++;continue}if(F==='"'&&!b){b=!0,j=-1,p+=F,v++;continue}if(F==='"'&&b){b=!1,p+=F,v++;continue}if(F==="\\"&&b){k=!0,p+=F,v++;continue}if(b){p+=F,v++;continue}if(F==="/"&&W==="/"){while(v<a.length&&a[v]!==`
`)v++;continue}if(F==="/"&&W==="*"){v+=2;while(v<a.length-1){if(a[v]==="*"&&a[v+1]==="/"){v+=2;break}v++}continue}if(F===","){j=p.length,p+=F,v++;continue}if(F==="}"||F==="]"){if(j!==-1){let K=p.slice(j+1);if(/^\s*$/.test(K))p=p.slice(0,j)+K}j=-1,p+=F,v++;continue}if(!/\s/.test(F))j=-1;p+=F,v++}return p}function yi(a,p,v){let b=p+1,k=!1;while(b<a.length){if(k){k=!1,b++;continue}if(a[b]==="\\"){k=!0,b++;continue}if(a[b]==='"')return b+1;b++}throw Error(v)}function vi(a,p,v){let b=a[p],k=b==="["?"]":"}",j=0,F=p;while(F<a.length){let W=v.skipComment?.(a,F)??F;if(W!==F){F=W;continue}if(a[F]==='"'){F=yi(a,F,v.stringError);continue}if(a[F]===b)j++;if(a[F]===k){if(j--,j===0)return F}F++}throw Error(v.bracketError)}function zp(a,p){let v=a.lastIndexOf(`
`,p)+1;return/^[ \t]*/.exec(a.slice(v))?.[0]??""}function Oo(a,p){let v=p.end+(/^\s*/.exec(a.slice(p.end))?.[0].length??0);if(a[v]===","){let F=a[v+1]===`
`?v+2:v+1;return`${a.slice(0,p.start)}${a.slice(F)}`}let b=a.slice(0,p.start).search(/\s*$/)-1;if(a[b]!==",")return`${a.slice(0,p.start)}${a.slice(p.end)}`;let k=a.lastIndexOf(`
`,b-1),j=k!==-1&&/^\s*$/.test(a.slice(k+1,b))?k:b;return`${a.slice(0,j)}${a.slice(p.end)}`}function Io(a,p){if(a.startsWith("//",p)){let v=a.indexOf(`
`,p+2);return v===-1?a.length:v+1}if(a.startsWith("/*",p)){let v=a.indexOf("*/",p+2);return v===-1?a.length:v+2}return p}function Np(a,p){let v=p;while(v<a.length){if(/\s/.test(a[v]??"")){v++;continue}let b=Io(a,v);if(b===v)return v;v=b}return v}function Fp(a,p,v){let b=0,k=0;while(k<a.length){let j=Io(a,k);if(j!==k){k=j;continue}if(a[k]==='"'){let F=yi(a,k,v.stringError);if(b===1&&JSON.parse(a.slice(k,F))===p){let W=Np(a,F),K=Np(a,W+1);if(a[W]===":"&&a[K]==="[")return{start:K,end:vi(a,K,{skipComment:Io,...v})}}k=F;continue}if(a[k]==="{"||a[k]==="[")b++;if(a[k]==="}"||a[k]==="]")b--;k++}return}function Mp(a,p,v){let b=[],k=p.start+1;while(k<p.end){let j=Io(a,k);if(j!==k){k=j;continue}if(a[k]==='"'){let F=yi(a,k,v),W=JSON.parse(a.slice(k,F));if(typeof W==="string")b.push({range:{start:k,end:F},value:W});k=F;continue}k++}return b}var an="cc-safety-net@cc-marketplace",jo=["cc-marketplace","cc-safety-net"],Up=["_direct","copilot-safety-net"],Hp=["cc-marketplace","safety-net"],Zp="safety-net@cc-marketplace";function No(a,p){let v=p.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${v}([^a-z0-9-]|$)`,"m").test(a??"")}function Gp(a){return No(a,"cc-safety-net@cc-marketplace")}function Bp(a){return No(a,"cc-marketplace")}function qp(a){return No(a,"copilot-safety-net")}function Vp(a){return No(a,"safety-net@cc-marketplace")}function bi(a){if(!a?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(a)}function Wp(a,p){if(!a)return null;let v=a.match(/(\d+)\.(\d+)\.(\d+)/);if(!v)return null;let b=[Number(v[1]),Number(v[2]),Number(v[3])];for(let k=0;k<p.length;k++){let j=b[k]??0,F=p[k]??0;if(j!==F)return j>F}return!0}function l1(a){return Wp(a,[0,0,422])}function u1(a){return Wp(a,[1,0,8])}function $r(a){return a.env.get("COPILOT_HOME")||Zt(a.home,".copilot")}function Li(a){return(a.hooks?.preToolUse??[]).some((v)=>{if(v.type!=="command")return!1;return bi(v.command)||bi(v.bash)||bi(v.powershell)})}function zo(a){return a===void 0||typeof a==="string"}function d1(a){if(!a||typeof a!=="object"||Array.isArray(a))return!1;let p=a;if(p.disableAllHooks!==void 0&&typeof p.disableAllHooks!=="boolean")return!1;if(p.hooks===void 0)return!0;if(!p.hooks||typeof p.hooks!=="object"||Array.isArray(p.hooks))return!1;let v=p.hooks.preToolUse;if(v===void 0)return!0;return Array.isArray(v)&&v.every((b)=>b!==null&&typeof b==="object"&&!Array.isArray(b)&&zo(b.type)&&zo(b.command)&&zo(b.bash)&&zo(b.powershell))}function wi(a,p){try{let v=JSON.parse(Wt(c1(a,"utf-8")));if(!d1(v)){p?.push(`Invalid hook config ${a}: hooks.preToolUse must be an array of hook objects`);return}return v}catch(v){p?.push(`Failed to parse ${a}: ${v instanceof Error?v.message:String(v)}`);return}}function Kp(a,p){try{return a1(a).filter((v)=>v.endsWith(".json")).sort((v,b)=>v.localeCompare(b))}catch(v){return p?.push(`Failed to read ${a}: ${v instanceof Error?v.message:String(v)}`),[]}}function p1(a,p){if(!Fo(a))return[];let v=[];for(let b of Kp(a,p)){let k=Zt(a,b),j=wi(k,p);if(j&&Li(j))v.push(k)}return v}function er(a,p){if(!Fo(a))return;let v=wi(a,p);if(!v)return;return{path:a,config:v}}function Jp(a,p,v,b){if(p){a.push(`GitHub Copilot CLI ${p} does not support ${v}; requires ${b}+`);return}a.push(`GitHub Copilot CLI version unavailable; skipping ${v} because it requires ${b}+`)}function f1(a){for(let p of a){if(p?.config.disableAllHooks===!0)return p.path;if(p?.config.disableAllHooks===!1)return}return}function m1(a,p,v,b){let k=$r(a),j=Zt(p,".github","hooks"),F=Zt(k,"hooks"),W=Zt(p,".github","copilot"),K=Zt(p,".claude"),se=u1(v),ie=se===!0?b:void 0,ae=[er(Zt(W,"settings.local.json"),ie),er(Zt(W,"settings.json"),ie),er(Zt(K,"settings.local.json"),ie),er(Zt(K,"settings.json"),ie)],le=[er(Zt(k,"settings.json"),ie),er(Zt(k,"config.json"),ie)];if(se!==!1){let Pt=f1([...ae,...le]);if(Pt){if(se===null)b.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${Pt} as active`);return{activeConfigPaths:[],disabledBy:Pt}}}let he=p1(j,b),be=l1(v),ve=be===!0?b:void 0,ke=Fo(F)?Kp(F,ve):[],qe=[];for(let Pt of ke){let Ke=Zt(F,Pt),At=wi(Ke,ve);if(At&&Li(At))qe.push(Ke)}if(be!==!0&&qe.length>0)Jp(b,v,`user hook files in ${F}`,"0.0.422"),qe.length=0;let Ze=[];for(let Pt of[...ae,...le]){if(!Pt)continue;if(!Li(Pt.config))continue;if(se===!0){Ze.push(Pt);continue}Jp(b,v,"inline hook definitions in Copilot config files","1.0.8");break}let De=(Pt)=>Pt.filter((Ke)=>!!Ke&&Ze.includes(Ke)).map((Ke)=>Ke.path);return{activeConfigPaths:[...De(ae),...he,...De(le),...qe]}}function Yp(a){let p=[],v=m1(a.environment,a.cwd,a.copilotCliVersion,p);if(v.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:v.disabledBy,configPaths:[v.disabledBy],errors:p.length>0?p:void 0};let b=$r(a.environment),k=Zt(b,"installed-plugins",...jo),j=Fo(k),F=Zt(b,"settings.json"),W=sn(F,Wt);if(j&&W.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};if(j&&W.kind==="ok"&&$t($t(W.value,"enabledPlugins"),an)===!1)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:F,errors:[`${an} is installed but not enabled in Copilot CLI`]};if(j||v.activeConfigPaths.length>0){let K=j,se=v.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:K?"plugin config":"hook config",configPath:se??(K?k:void 0),configPaths:v.activeConfigPaths.length>0?v.activeConfigPaths:void 0,errors:p.length>0?p:void 0}}return{platform:"copilot-cli",status:"n/a",errors:p.length>0?p:void 0}}import{existsSync as _1,readFileSync as S1}from"node:fs";import{existsSync as Xp,mkdirSync as y1,readFileSync as v1}from"node:fs";import{dirname as b1,join as L1}from"node:path";import{renameSync as g1,writeFileSync as h1}from"node:fs";function Ft(a,p){let v=`${a}.${process.pid}.tmp`;h1(v,p),g1(v,a)}var cn=Object.fromEntries(Se.map((a)=>[a.id,`npx -y cc-safety-net hook ${a.flags[1]}`]));var Er=cn.cursor,Qp=30;function Uo(a){return L1(a.home,".cursor","hooks.json")}function Nn(a){return typeof a==="object"&&a!==null&&!Array.isArray(a)}function xi(){return{command:Er,timeout:Qp,failClosed:!0}}function Mo(a){return Nn(a)&&a.command===Er}function w1(a){return Object.keys(a).length===3&&a.command===Er&&a.timeout===Qp&&a.failClosed===!0}function x1(a){try{return JSON.parse(v1(a,"utf-8"))}catch(p){if(p instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${a}: ${p.message}`);throw p}}function ef(a){let p=x1(a);if(!Nn(p))throw Error(`Cursor hooks config ${a} must be a JSON object`);if(p.version!==1)throw Error(`Cursor hooks config ${a} must set "version": 1`);if(p.hooks!==void 0&&!Nn(p.hooks))throw Error(`Cursor hooks config ${a} "hooks" must be an object`);let v=Nn(p.hooks)?p.hooks.preToolUse:void 0;if(v!==void 0&&!Array.isArray(v))throw Error(`Cursor hooks config ${a} "hooks.preToolUse" must be an array`);return p}function tf(a){let p=Nn(a.hooks)?a.hooks.preToolUse:void 0;return Array.isArray(p)?p:[]}function k1(a){if(!a.some(Mo))return[...a,xi()];return a.reduce((p,v)=>{if(!Mo(v))return p.result.push(v),p;if(!p.inserted)p.result.push(xi()),p.inserted=!0;return p},{result:[],inserted:!1}).result}function nf(a,p,v){let b=Nn(p.hooks)?p.hooks:{},k={...p,hooks:{...b,preToolUse:v}};Ft(a,`${JSON.stringify(k,null,2)}
`)}function rf(a){let p=Uo(a);if(!Xp(p))return y1(b1(p),{recursive:!0}),Ft(p,`${JSON.stringify({version:1,hooks:{preToolUse:[xi()]}},null,2)}
`),{path:p,alreadyInstalled:!1};let v=ef(p),b=tf(v),k=b.filter(Mo);if(Nn(v.hooks)&&Array.isArray(v.hooks.preToolUse)&&k.length===1&&k[0]!==void 0&&w1(k[0]))return{path:p,alreadyInstalled:!0};return nf(p,v,k1(b)),{path:p,alreadyInstalled:!1}}function of(a){let p=Uo(a);if(!Xp(p))return{path:p,alreadyInstalled:!1};let v=ef(p),b=tf(v),k=b.filter((j)=>!Mo(j));if(k.length===b.length)return{path:p,alreadyInstalled:!1};return nf(p,v,k),{path:p,alreadyInstalled:!0}}function C1(a){if(!a||typeof a!=="object"||Array.isArray(a))return[];let p=a.hooks;if(!p||typeof p!=="object"||Array.isArray(p))return[];let v=p.preToolUse;if(!Array.isArray(v))return[];return v.filter((b)=>!!b&&typeof b==="object"&&!Array.isArray(b)&&b.command===Er)}function P1(a){let p=[];if(a.length>1)p.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let v=a[0];if(v&&v.failClosed!==!0)p.push('Managed hook is missing "failClosed": true; reinstall to repair');if(v&&v.timeout!==30)p.push('Managed hook "timeout" is not 30; reinstall to repair');return p}function sf(a){let p=Uo(a.environment);if(!_1(p))return{platform:"cursor",status:"n/a",configPath:p};let v;try{v=JSON.parse(S1(p,"utf-8"))}catch(j){return{platform:"cursor",status:"n/a",configPath:p,errors:[`Failed to parse Cursor hooks config ${p}: ${j instanceof Error?j.message:String(j)}`]}}let b=C1(v);if(b.length===0)return{platform:"cursor",status:"n/a",configPath:p};let k=P1(b);return{platform:"cursor",status:"configured",method:"hook config",configPath:p,errors:k.length>0?k:void 0}}import{existsSync as $1}from"node:fs";import{join as ki}from"node:path";var _i="gemini-safety-net";function Si(a){let p=ki(a.home,".gemini","extensions"),v=ki(p,_i);if(!$1(v))return{platform:"gemini-cli",status:"n/a"};let b=ki(p,"extension-enablement.json"),k=sn(b);if(k.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let j=k.kind==="ok"?$t($t(k.value,_i),"overrides"):void 0;if(Array.isArray(j)&&j.some((W)=>typeof W==="string"&&W.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:b,errors:[`${_i} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:v}}function af(a){return Si(a.environment)}import{existsSync as A1,readFileSync as T1}from"node:fs";import{existsSync as lf,mkdirSync as E1,readFileSync as uf,rmSync as R1}from"node:fs";import{dirname as D1,join as cf}from"node:path";var Rr=cn["grok-build"],Go=30;function Bo(a){return cf(a.env.get("GROK_HOME")??cf(a.home,".grok"),"hooks","cc-safety-net.json")}function zn(a){return typeof a==="object"&&a!==null&&!Array.isArray(a)}function Ho(){return{hooks:[{type:"command",command:Rr,timeout:Go}]}}function df(a){return zn(a)&&a.command===Rr}function pf(a){return a.flatMap((p)=>{if(!zn(p)||!Array.isArray(p.hooks))return[p];let v=p.hooks.filter((b)=>!df(b));if(v.length===p.hooks.length)return[p];return v.length===0?[]:[{...p,hooks:v}]})}function ff(a){try{let p=JSON.parse(a);return zn(p)?p:null}catch{return null}}function mf(a){let p=zn(a.hooks)?a.hooks.PreToolUse:void 0;return Array.isArray(p)?p:[]}function Zo(a,p,v){let b=zn(p.hooks)?p.hooks:{};Ft(a,`${JSON.stringify({...p,hooks:{...b,PreToolUse:v}},null,2)}
`)}function gf(a){let p=Bo(a);if(!lf(p))return E1(D1(p),{recursive:!0}),Zo(p,{},[Ho()]),{path:p,alreadyInstalled:!1};let v=ff(uf(p,"utf-8"));if(!v)return Zo(p,{},[Ho()]),{path:p,alreadyInstalled:!1};let b=mf(v),k=b.filter((j)=>zn(j)&&Array.isArray(j.hooks)&&j.hooks.some(df));if(k.length===1&&JSON.stringify(k[0])===JSON.stringify(Ho()))return{path:p,alreadyInstalled:!0};return Zo(p,v,[...pf(b),Ho()]),{path:p,alreadyInstalled:!1}}function hf(a){let p=Bo(a);if(!lf(p))return{path:p,alreadyInstalled:!1};let v=ff(uf(p,"utf-8"));if(!v)return{path:p,alreadyInstalled:!1};let b=mf(v),k=pf(b);if(JSON.stringify(k)===JSON.stringify(b))return{path:p,alreadyInstalled:!1};let j=zn(v.hooks)?v.hooks:{};if(k.length===0&&Object.keys(v).length===1&&Object.keys(j).length===1)return R1(p),{path:p,alreadyInstalled:!0};return Zo(p,v,k),{path:p,alreadyInstalled:!0}}function Dr(a){return!!a&&typeof a==="object"&&!Array.isArray(a)}function I1(a){if(!Dr(a)||!Dr(a.hooks))return[];let p=a.hooks.PreToolUse;if(!Array.isArray(p))return[];return p.filter((v)=>Dr(v)&&Array.isArray(v.hooks)&&v.hooks.some((b)=>Dr(b)&&b.command===Rr))}function O1(a){let v=(Array.isArray(a.hooks)?a.hooks.filter(Dr):[]).find((b)=>b.command===Rr);return[...a.matcher===void 0||a.matcher===""||a.matcher==="*"?[]:['Managed hook has a "matcher" that narrows coverage; reinstall to repair'],...v?.type==="command"?[]:['Managed hook "type" is not "command"; reinstall to repair'],...v?.timeout===Go?[]:[`Managed hook "timeout" is not ${Go}; reinstall to repair`]]}function yf(a){let p=Bo(a.environment);if(!A1(p))return{platform:"grok-build",status:"n/a",configPath:p};let v;try{v=JSON.parse(T1(p,"utf-8"))}catch(j){return{platform:"grok-build",status:"n/a",configPath:p,errors:[`Failed to parse Grok Build hooks config ${p}: ${j instanceof Error?j.message:String(j)}`]}}let b=I1(v)[0];if(!b)return{platform:"grok-build",status:"n/a",configPath:p};let k=O1(b);return{platform:"grok-build",status:"configured",method:"hook config",configPath:p,errors:k.length>0?k:void 0}}import{readFileSync as Sf}from"node:fs";import{join as Cf}from"node:path";var Kt="cc-safety-net",Ci="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent",j1=30;function vf(a){return`${Ci}
# version: ${a}
`}function N1(a){return`${vf(a)}name: ${Kt}
version: "${a}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function z1(a){return`${vf(a)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = [${cn["hermes-agent"].split(" ").map((p)=>`"${p}"`).join(", ")}]
TIMEOUT_SECONDS = ${j1}


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
`}function Ar(a){return[{name:"__init__.py",content:z1(a)},{name:"plugin.yaml",content:N1(a)}]}import{mkdirSync as F1,readdirSync as M1,readFileSync as U1,rmSync as Pi}from"node:fs";import{join as Fn}from"node:path";var H1="__pycache__";function $i(a){let p=a.env.get("HERMES_HOME")?.trim();return p?p:Fn(a.home,".hermes")}function Ei(a){return Fn($i(a),"plugins",Kt)}function Ri(a){return a.startsWith(Ci)}function Di(a,p){let v=Ei(a),b=Nt(v);if(b&&(b.isSymbolicLink()||!b.isDirectory()))throw Error(`Refusing to ${p} ${v}: not a regular directory. Move or remove it and rerun ${p==="install"?"install":"uninstall"} --hermes-agent.`);return v}function bf(a,p){let v=Nt(a);if(!v)return;if(v.isSymbolicLink()||!v.isFile())throw Error(`Refusing to ${p} ${a}: not a regular file. Move or remove it.`);let b=U1(a,"utf-8");if(!Ri(b))throw Error(`Refusing to ${p} unmanaged file at ${a}. Move or remove it.`);return b}function Lf(a){let p=Di(a,"install"),v=Ar(zt());if(v.map((k)=>bf(Fn(p,k.name),"overwrite")).every((k,j)=>k===v[j]?.content))return{path:p,alreadyInstalled:!0};return F1(p,{recursive:!0}),v.forEach((k)=>{Ft(Fn(p,k.name),k.content)}),{path:p,alreadyInstalled:!1}}function Ai(a){let p=Di(a,"remove");if(!Nt(p))return[];return Ar(zt()).filter((v)=>bf(Fn(p,v.name),"remove")!==void 0)}function wf(a){let p=Di(a,"remove");if(!Nt(p))return{path:p,alreadyInstalled:!1};let v=Ai(a);if(v.forEach((b)=>{Pi(Fn(p,b.name))}),Pi(Fn(p,H1),{recursive:!0,force:!0}),M1(p).length===0)Pi(p,{recursive:!0});return{path:p,alreadyInstalled:v.length>0}}var qo="hermes-agent",xf=/^([^\s#][^:]*):/,Z1=/^\s+([A-Za-z_][\w-]*):/,kf=/^\s+-\s*(.*)$/;function G1(a){return a.trim().replace(/^(["'])(.*)\1$/,"$2")}function B1(a){let p=a.split(/\r?\n/),v=p.findIndex((j)=>xf.exec(j)?.[1]?.trim()==="plugins");if(v===-1)return[];let b=p.slice(v+1),k=b.findIndex((j)=>xf.test(j));return k===-1?b:b.slice(0,k)}function _f(a,p){let v=B1(a),b=v.findIndex((F)=>Z1.exec(F)?.[1]===p);if(b===-1)return[];let k=v.slice(b+1),j=k.findIndex((F)=>!kf.test(F));return(j===-1?k:k.slice(0,j)).map((F)=>G1(kf.exec(F)?.[1]??""))}function q1(a){try{return Sf(Cf($i(a),"config.yaml"),"utf-8")}catch{return}}function Ti(a){let p=q1(a)??"";return _f(p,"enabled").includes(Kt)&&!_f(p,"disabled").includes(Kt)}function Pf(a){return/^# version:\s*(.+)$/m.exec(a)?.[1]?.trim()}function V1(a,p){let v=Nt(a);if(!v)return{error:`${p.name} is missing from ${a}; run install --hermes-agent`};if(v.isSymbolicLink()||!v.isFile())return{error:`${a} is a symlink or not a regular file; move or remove it`};try{let b=Sf(a,"utf-8");if(!Ri(b))return{error:`Unmanaged ${p.name} occupies ${a}; move or remove it`};if(Pf(b)===zt()&&b!==p.content)return{error:`Modified ${p.name} occupies ${a}; run install --hermes-agent to restore it`};return{content:b}}catch(b){return{error:`Failed to read ${a}: ${b instanceof Error?b.message:String(b)}`}}}function $f(a){let p=Ei(a.environment),v=Ao(qo,p);if(v)return v;let b=Ar(zt()).map((W)=>V1(Cf(p,W.name),W)),k=b.flatMap((W)=>("error"in W)?[W.error]:[]);if(k.length>0)return{platform:qo,status:"n/a",configPath:p,errors:k};let j=b.some((W)=>("content"in W)&&Pf(W.content)!==zt()),F=j?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!Ti(a.environment))return{platform:qo,status:"disabled",method:"plugin directory",configPath:p,errors:[`${Kt} is not enabled in Hermes; run \`hermes plugins enable ${Kt}\``,...F]};return{platform:qo,status:"configured",method:"plugin directory",configPath:p,errors:j?F:void 0}}import{existsSync as J1,readFileSync as W1}from"node:fs";import{join as Ef}from"node:path";var K1=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;function Y1(a){return Ef(a.env.get("KIMI_CODE_HOME")||Ef(a.home,".kimi-code"),"config.toml")}function Tr(a){let p=Y1(a.environment);if(!J1(p))return{platform:"kimi-code",status:"n/a",configPath:p};try{if(!K1.test(W1(p,"utf-8")))return{platform:"kimi-code",status:"n/a",configPath:p}}catch(v){return{platform:"kimi-code",status:"n/a",configPath:p,errors:[`Failed to read ${p}: ${v instanceof Error?v.message:String(v)}`]}}return{platform:"kimi-code",status:"configured",method:"hook config",configPath:p}}import{readFileSync as Ff}from"node:fs";import{join as Or}from"node:path";var jt="cc-safety-net",Xt="index.js",tr="openclaw.plugin.json",nr="package.json";var Vo="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as ev,lstatSync as tv,readdirSync as nv,readFileSync as rv}from"node:fs";import{dirname as Af,join as Sn}from"node:path";import{fileURLToPath as ov}from"node:url";import{spawn as X1}from"node:child_process";function Q1(a){return a.join(" ")}function Ii(a,p,v){return[`Failed to run ${Q1(a)}${p===null?"":` (exit ${p})`}.`,v.trim()].filter(Boolean).join(`
`)}function Oi(a){let p={stdout:"",stderr:""};return a.stdout.setEncoding("utf-8"),a.stderr.setEncoding("utf-8"),a.stdout.on("data",(v)=>{p.stdout+=v}),a.stderr.on("data",(v)=>{p.stderr+=v}),p}function ln(a,p){return new Promise((v,b)=>{let k=jn([...a],process.env),j=X1(k.cmd,k.args,{stdio:["ignore","pipe","pipe"]}),F=Oi(j),W=()=>[F.stdout,F.stderr].filter(Boolean).join(`
`),K=p?.timeoutMs??120000,se=setTimeout(()=>{j.kill(),b(Error(Ii(a,null,`Timed out after ${K}ms.
${W()}`.trim())))},K);j.on("error",(ie)=>{clearTimeout(se),b(Error(Ii(a,null,`${ie.message}
${W()}`.trim())))}),j.on("close",(ie)=>{if(clearTimeout(se),ie!==0){b(Error(Ii(a,ie,W())));return}v(p?.stdoutOnly?F.stdout:W())})})}async function ji(a){for(let p of a)await ln(p)}async function Rf(a){for(let p of a)try{await ln(p)}catch(v){console.warn(v instanceof Error?v.message:String(v))}}var Df=Sn("openclaw",jt),sv=[Xt,tr,nr];function Ni(a,p){if(a==="~")return p;if(a.startsWith("~/")||a.startsWith("~\\"))return Sn(p,a.slice(2));return a}function Tf(a){let p=a.env.get("OPENCLAW_STATE_DIR")?.trim();if(p)return Ni(p,a.home);let v=a.env.get("OPENCLAW_CONFIG_PATH")?.trim();return v?Af(Ni(v,a.home)):Sn(a.home,".openclaw")}function If(a){let p=a.env.get("OPENCLAW_CONFIG_PATH")?.trim();return p?Ni(p,a.home):Sn(Tf(a),"openclaw.json")}function zi(a){return Sn(Tf(a),"extensions",jt)}function iv(a){let p=nv(a);if(p.length===0)return!0;if(p.some((k)=>!sv.includes(k)))return!1;let v=Sn(a,Xt),b=Nt(v);return b!==void 0&&!b.isSymbolicLink()&&b.isFile()&&rv(v,"utf-8").startsWith(Vo)}function Fi(a){let p=zi(a),v=Nt(p);if(!v)return;if(!v.isSymbolicLink()&&v.isDirectory()&&iv(p))return;throw Error(`Refusing to modify ${p}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function Of(){let a=Af(ov(import.meta.url));return[Sn(a,"..",Df),Sn(a,"..","..","..","dist",Df)]}function Mi(a=Of()){return a.find((p)=>ev(p)&&tv(p).isDirectory())}function av(a=Of()){let p=Mi(a);if(!p)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return p}function jf(a=av()){return[["openclaw","plugins","install",a,"--force"],["openclaw","plugins","enable",jt]]}function cv(a){let p=(()=>{try{return JSON.parse(a)}catch{return}})(),v=$t($t(p,"plugin"),"status");return typeof v==="string"?v:void 0}async function Nf(){let a=cv(await ln(["openclaw","plugins","inspect",jt,"--runtime","--json"],{stdoutOnly:!0}));if(a==="loaded")return;throw Error(`${a===void 0?`The ${jt} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:`OpenClaw reports the ${jt} plugin with status "${a}".`} Run \`openclaw plugins inspect ${jt} --runtime\` for details.`)}var Jo="openclaw",Ir=`run \`openclaw plugins enable ${jt}\``;function rr(a,p){let v=Or(a,p),b=Nt(v);if(!b)return{error:`${p} is missing from ${v}; run install --openclaw`};if(b.isSymbolicLink()||!b.isFile())return{error:`${v} is a symlink or not a regular file; move or remove it`};try{return{content:Ff(v,"utf-8")}}catch(k){return{error:`Failed to read ${v}: ${k instanceof Error?k.message:String(k)}`}}}function Mf(a){try{return JSON.parse(Wt(a))}catch{return}}function lv(a){let p=rr(a,tr);if("error"in p)return p.error;if($t(Mf(p.content),"id")===jt)return;return`${Or(a,tr)} is not a valid ${jt} manifest; run install --openclaw`}function uv(a){let p=rr(a,nr);if("error"in p)return p.error;let v=$t($t(Mf(p.content),"openclaw"),"extensions");if(Array.isArray(v)&&v.includes(`./${Xt}`))return;return`${Or(a,nr)} does not point OpenClaw at ${Xt}; run install --openclaw`}function zf(a){return Array.isArray(a)?a.filter((p)=>typeof p==="string"):[]}function dv(a){let p=If(a);if(!Nt(p))return`${jt} is not enabled; ${Ir}`;let v=(()=>{try{return JSON.parse(Wt(Ff(p,"utf-8")))}catch{return}})();if(v===void 0)return`Failed to read ${p}; fix it, then ${Ir}`;let b=$t(v,"plugins");if($t(b,"enabled")===!1)return`plugins.enabled is false in ${p}; no OpenClaw plugin loads`;let k=$t($t($t(b,"entries"),jt),"enabled");if(zf($t(b,"deny")).includes(jt)||k===!1)return`${jt} is disabled in ${p}; ${Ir}`;let j=zf($t(b,"allow"));if(j.length>0&&!j.includes(jt))return`plugins.allow in ${p} does not list ${jt}; add it, then ${Ir}`;if(j.includes(jt)||k===!0)return;return`${jt} is not enabled; ${Ir}`}function Uf(a){return/^\/\/ version:\s*(.+)$/m.exec(a)?.[1]?.trim()}function pv(a,p,v){if(v===void 0)return[];let b=rr(v,Xt);if("error"in b||Uf(b.content)!==p)return[];return[Xt,tr,nr].flatMap((k)=>{let j=rr(a,k),F=rr(v,k);if("error"in j||"error"in F||j.content===F.content)return[];return[`Modified ${k} occupies ${Or(a,k)}; run install --openclaw to restore it`]})}function Hf(a){let p=zi(a.environment),v=Ao(Jo,p);if(v)return v;let b=rr(p,Xt),j=["error"in b?b.error:b.content.startsWith(Vo)?void 0:`Unmanaged ${Xt} occupies ${Or(p,Xt)}; move or remove it`,lv(p),uv(p)].filter((ie)=>ie!==void 0),F="content"in b?Uf(b.content):void 0,W=j.length>0?j:pv(p,F,Mi());if(W.length>0)return{platform:Jo,status:"n/a",configPath:p,errors:W};let K=F===zt()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],se=dv(a.environment);if(se)return{platform:Jo,status:"disabled",method:"plugin directory",configPath:p,errors:[se,...K]};return{platform:Jo,status:"configured",method:"plugin directory",configPath:p,errors:K.length>0?K:void 0}}import{existsSync as bv,readFileSync as Lv}from"node:fs";import{join as wv}from"node:path";import{existsSync as Ui,readFileSync as Bf,rmSync as fv}from"node:fs";import{join as fn}from"node:path";import{pathToFileURL as mv}from"node:url";var Wo="cc-safety-net",qf=`${Wo}@latest`,Vf=["opencode.json","opencode.jsonc"],Zf="CCSafetyNetPlugin",Gf={stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"};function Ko(a){return fn(a.env.get("XDG_CONFIG_HOME")||fn(a.home,".config"),"opencode")}function gv(a){return fn(Ko(a),Vf[0])}function hv(a){return Vf.map((p)=>fn(Ko(a),p))}function Jf(a){return fn(a.env.get("XDG_CACHE_HOME")||fn(a.home,".cache"),"opencode","packages",qf)}function Hi(a){fv(Jf(a),{recursive:!0,force:!0})}async function Wf(a){let p=fn(Jf(a),"node_modules",Wo),v=fn(p,"package.json");if(!Ui(v))throw Error(`The OpenCode plugin cache at ${p} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${qf}\` for details.`);let b=$t(JSON.parse(Bf(v,"utf-8")),"main");if(typeof b!=="string")throw Error(`The cached OpenCode plugin at ${p} declares no "main" entry.`);let k=fn(p,b);if(typeof(await import(mv(k).href))[Zf]==="function")return;throw Error(`The cached OpenCode plugin at ${k} does not export a callable ${Zf}, so OpenCode would load nothing and fail open.`)}function Kf(a,p){try{return JSON.parse(Wt(a))}catch(v){if(v instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${p}: ${v.message}`);throw v}}function yv(a){if(!a||typeof a!=="object"||Array.isArray(a))return!1;let p=a.plugin;if(!Array.isArray(p))return!1;return p.some((v)=>typeof v==="string"&&v.includes(Wo))}function vv(a,p){let v=Fp(a,"plugin",Gf);if(!v)throw Error(`Failed to locate OpenCode plugin array in ${p}`);let b=Mp(a,v,Gf.stringError).filter((k)=>k.value.includes(Wo)).map((k)=>k.range).reverse().reduce(Oo,a);return Kf(b,p),b}function Yf(a){Hi(a);let p=hv(a),v=p.find((k)=>Ui(k)),b=[];for(let k of p){if(!Ui(k))continue;try{let j=Bf(k,"utf-8");if(!yv(Kf(j,k)))continue;return Ft(k,vv(j,k)),{path:k,alreadyInstalled:!0}}catch(j){b.push(j instanceof Error?j.message:String(j))}}if(b.length>0)throw Error(b.join(`
`));return{path:v??gv(a),alreadyInstalled:!1}}function Xf(a){let p=[],v=Ko(a.environment),b=["opencode.json","opencode.jsonc"];for(let k of b){let j=wv(v,k);if(bv(j))try{let F=Lv(j,"utf-8"),W=Wt(F);if((JSON.parse(W).plugin??[]).some((ae)=>ae.includes("cc-safety-net")))return{platform:"opencode",status:"configured",method:"plugin array",configPath:j,errors:p.length>0?p:void 0}}catch(F){p.push(`Failed to parse ${k}: ${F instanceof Error?F.message:String(F)}`)}}return{platform:"opencode",status:"n/a",errors:p.length>0?p:void 0}}import{join as xv}from"node:path";function Zi(a){return xv(a.home,".pi","agent","settings.json")}function Gi(a){if(typeof a!=="string")return!1;return a==="npm:cc-safety-net"||a.startsWith("npm:cc-safety-net@")}function Qf(a){let p=Zi(a.environment),v=sn(p);if(v.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(v.kind==="missing")return{platform:"pi",status:"n/a"};let b=$t(v.value,"packages");if(!Array.isArray(b))return{platform:"pi",status:"n/a"};let k=b.find((W)=>Gi(typeof W==="string"?W:$t(W,"source")));if(k===void 0)return{platform:"pi",status:"n/a"};let j=$t(k,"extensions");if(Array.isArray(j)&&j.some((W)=>typeof W==="string"&&W.startsWith("-")))return{platform:"pi",status:"disabled",method:"package config",configPath:p,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:p}}var kv={amp:Rp,"antigravity-cli":Dp,"claude-code":Op,codex:jp,"copilot-cli":Yp,cursor:sf,"gemini-cli":af,"grok-build":yf,"hermes-agent":$f,"kimi-code":Tr,openclaw:Hf,opencode:Xf,pi:Qf};function or(a,p,v){let b={...v,cwd:p,environment:a};return at.map((k)=>_v(kv[k](b)))}function _v(a){if(a.status==="not-inspected")return{platform:a.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:a.platform,detected:a.status!=="n/a",configured:a.status==="configured",inspectionStatus:a.status!=="n/a"?"verified":a.errors&&a.errors.length>0?"failed":"not-applicable",method:a.method,configPath:a.configPath,configPaths:a.configPaths,errors:a.errors}}import{join as Sv}from"node:path";var Cv=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),Pv=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),safety:Object.freeze({}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),$v={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function em(a){let p=Sv(a.tmpdir,"cc-safety-net-self-test"),v=Cv.map((b)=>{let k=z(a,f("self-test",{command:b.command},{kind:"command",shell:"auto"},{configCwd:p,executionCwd:p},b.command),{guard:{dependencies:{loadPolicySnapshot:()=>Pv,getModes:()=>$v,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),j=b.expectBlocked?"blocked":"allowed",F=k.decision.kind==="deny"?"blocked":"allowed";return{command:b.command,description:b.description,expected:j,actual:F,passed:j===F,reason:k.decision.kind==="deny"?k.decision.reason:void 0,ruleId:k.decision.kind==="deny"?k.decision.ruleId:void 0}});return{passed:v.filter((b)=>b.passed).length,failed:v.filter((b)=>!b.passed).length,total:v.length,results:v}}function Bi(a){let p=c({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},a);if(re(p.errors))return null;return{json:p.flags.json,skipUpdateCheck:p.flags.skipUpdateCheck}}async function tm(a,p={}){let v=await Pr(!p.json,()=>{let b=Ev(a,p);return{ready:b,finish:()=>b}},()=>Cr(),{loadingMessage:"Checking system status…"});if(p.json)console.log(JSON.stringify(v,null,2));else Rv(v);return v.engineSelfTest.failed>0||v.findings.some((b)=>b.severity==="error")?1:0}async function Ev(a,p){let v=p.cwd??process.cwd(),b=await _r(),k=or(a,v,{ampPluginListOutput:b.ampPluginListOutput,codexPluginListOutput:b.codexPluginListOutput,copilotCliVersion:b.versions["copilot-cli"]}),j=qd(a,v),F=Vd(a),W=D(a,{cwd:v}),K=W.policy,se=M(K,a.env),ie=ee(K,se.capabilities),ae=Yr(a,7),le=Sp(a,v),he=p.skipUpdateCheck?{currentVersion:zt(),latestVersion:null,updateAvailable:!1}:await _n(),be={hooks:k,engineSelfTest:em(a),userConfig:j.userConfig,projectConfig:j.projectConfig,configState:rt(W),effectiveRules:j.effectiveRules,shadowedRules:j.shadowedRules,environment:F,effectiveSafety:{selectedPreset:K.safety.level??"standard",level:se.effectiveLevel,capabilities:se.capabilities,ruleOverrides:K.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(ie).filter(([,ve])=>ve.source==="rule_override"&&ve.override==="off"&&ve.inheritedEnabled&&ve.changesInherited).map(([ve])=>ve),ruleCounts:{stored:Object.keys(K.destructiveCommandRuleOverrides).length,effective:Object.values(ie).filter((ve)=>ve.changesInherited).length},...W.policyScopes?{policyScopes:W.policyScopes}:{}},...le.length>0?{v2Leftovers:le}:{},posture:ap(a,j.userConfig.path),activity:ae,update:he,system:b};return{...be,findings:Wd(be)}}function Rv(a){console.log(),console.log(Yd(a.hooks)),console.log(),console.log(Xd(a.engineSelfTest)),console.log(),console.log(Qd(a)),console.log(),console.log(ep(a.environment)),console.log(),console.log(tp(a)),console.log(),console.log(np(a.findings)),console.log(),console.log(rp(a.activity)),console.log(),console.log(sp(a.system)),console.log(),console.log(op(a.update)),console.log(ip(a))}import{existsSync as Dv}from"node:fs";var Av=/^[A-Za-z0-9_@%+=:,./-]+$/,nm="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function qi(a){let p=c({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},a);if(re(p.errors))return console.error(nm),console.error("Pass -- before a command that starts with dashes."),null;if(p.values.cwd!==void 0&&!Dv(p.values.cwd))return console.error(`Error: --cwd path does not exist: ${p.values.cwd}`),null;let v=p.positionals.length===1?p.positionals[0]:p.positionals.map((b)=>Av.test(b)?b:`'${b.replaceAll("'","'\\''")}'`).join(" ");if(!v)return console.error("Error: No command provided"),console.error(nm),null;return{json:p.flags.json,cwd:p.values.cwd,command:v}}function rm(a){if(a)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function om(a,p){let b=p-18;return[`${a.dtl}${a.dh.repeat(p)}${a.dtr}`,`${a.dv}  Command Analysis${" ".repeat(b)}${a.dv}`,`${a.dbl}${a.dh.repeat(p)}${a.dbr}`]}function Vi(a){return JSON.stringify(a)}function sm(a,p=0){return`[${a.map((b,k)=>Kd(b,k,p)).join(",")}]`}function jr(a,p,v=70){let b=a.split(" "),k=[],j="";for(let F of b)if(j&&j.length+F.length+1>v)k.push(j),j=F;else j=j?`${j} ${F}`:F;if(j)k.push(j);return k.map((F,W)=>W===0?F:`${p}${F}`)}function im(a,p,v){let b=[];switch(a.type){case"parse":return null;case"env-strip":return b.push(""),b.push(`STEP ${p} ${v.h} Strip environment variables`),b.push(`  Removed: ${a.envVars.map((k)=>`${k}=<redacted>`).join(", ")}`),b.push(`  Tokens:  ${Vi(a.output)}`),{lines:b,incrementStep:!0};case"leading-tokens-stripped":return b.push(""),b.push(`STEP ${p} ${v.h} Strip wrappers`),b.push(`  Removed: ${a.removed.join(", ")}`),b.push(`  Tokens:  ${Vi(a.output)}`),{lines:b,incrementStep:!0};case"shell-wrapper":return b.push(""),b.push(`STEP ${p} ${v.h} Detect shell wrapper`),b.push(`  Wrapper: ${a.wrapper} -c`),b.push(`  Inner:   ${a.innerCommand}`),{lines:b,incrementStep:!0};case"interpreter":{if(b.push(""),b.push(`STEP ${p} ${v.h} Detect interpreter`),b.push(`  Interpreter: ${a.interpreter}`),b.push(`  Code:        ${a.codeArg}`),a.paranoidBlocked)b.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:b,incrementStep:!0}}case"busybox":return b.push(""),b.push(`STEP ${p} ${v.h} Busybox wrapper`),b.push(`  Subcommand: ${a.subcommand}`),{lines:b,incrementStep:!0};case"transparent-wrapper":return b.push(""),b.push(`STEP ${p} ${v.h} Transparent wrapper`),b.push(`  Wrapper: ${a.wrapper}`),b.push(`  Tokens:  ${Vi(a.output)}`),{lines:b,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(b.push(""),b.push(`STEP ${p} ${v.h} Match rules`),b.push(`  Rule:   ${a.rule}()`),a.matched)b.push("  Result: MATCHED");else b.push("  Result: No match");return{lines:b,incrementStep:!0}}case"worktree-relaxation":return b.push(""),b.push(`STEP ${p} ${v.h} Worktree relaxation`),b.push(`  Mode:   ${n.worktree.name}`),b.push(`  Git cwd: ${a.gitCwd}`),b.push("  Result: Allowed local discard in linked worktree"),{lines:b,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(a.embeddedCommandFound)return b.push(""),b.push(`STEP ${p} ${v.h} Fallback scan`),b.push(`  Found: ${a.embeddedCommandFound}`),{lines:b,incrementStep:!0};return null}case"custom-rules-check":{if(a.rulesChecked){if(b.push(""),b.push(`STEP ${p} ${v.h} Custom rules`),a.matched)b.push("  Result: MATCHED");else b.push("  Result: No match");return{lines:b,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(a.matched)return b.push(""),b.push(`STEP ${p} ${v.h} Dangerous text check`),b.push(`  Token:  ${a.token}`),b.push("  Result: MATCHED"),{lines:b,incrementStep:!0};return null}case"strict-unparseable":return b.push(""),b.push(`STEP ${p} ${v.h} Strict mode check`),b.push(`  Command: ${a.rawCommand}`),b.push("  Result:  ✗ UNPARSEABLE"),{lines:b,incrementStep:!0};case"segment-skipped":return null;case"error":return b.push(""),b.push(`ERROR: ${a.message}`),{lines:b,incrementStep:!1};default:return a}}function Ji(a,p){let v=rm(p?.asciiOnly??!1),b=58,k=[],j=1;k.push(...om(v,58)),k.push("");let F=a.trace.steps.find((be)=>be.type==="error");if(F&&F.type==="error"){k.push("ERROR"),k.push(`  ${F.message}`),k.push(""),k.push("RESULT"),k.push(`  Status: ${a.result==="blocked"?et.red("BLOCKED"):et.green("ALLOWED")}`),k.push(""),k.push("CONFIG");let be=a.configSource??"none";return k.push(`  Path: ${be}`),k.join(`
`)}let W=a.trace.steps.find((be)=>be.type==="parse");if(W&&W.type==="parse"){k.push("INPUT"),k.push(`  ${W.input}`),k.push(""),k.push(`STEP ${j} ${v.h} Split shell commands`),j++;for(let be=0;be<W.segments.length;be++){let ve=W.segments[be];if(ve){let ke=Math.random();k.push(`  Segment ${be+1}: ${sm(ve,ke)}`)}}}let K=a.trace.segments,se=K.length>1;for(let be of K){if(se){k.push("");let Ze="";if(W&&W.type==="parse"){let Ls=W.segments[be.index];if(Ls)Ze=Ls.join(" ")}let De=54,Pt=Ze,Ke=` Segment ${be.index+1}: `,At=" ";if(Ze){if(Ke.length+Ze.length+At.length>De){let Rg=De-Ke.length-At.length;Pt=`${Ze.substring(0,Rg-1)}…`}}let dn=Ze?`${Ke}${Pt}${At}`:` Segment ${be.index+1} `,en=Ze?`${Ke}${et.cyan(Pt)}${At}`:dn,Da=58-dn.length,Aa=Math.floor(Da/2),Eg=Da-Aa;k.push(`${v.sh.repeat(Aa)}${en}${v.sh.repeat(Eg)}`)}if(be.steps.find((Ze)=>Ze.type==="segment-skipped")){k.push(""),k.push("  (skipped — prior segment blocked)");continue}let ke=!1,qe=!1;for(let Ze of be.steps){let De=im(Ze,j,v);if(De){if(qe=!0,Ze.type==="recurse"){k.push("");let Pt=" RECURSING ",Ke=58-Pt.length-4;k.push(`  ${v.tl}${v.h}${Pt}${v.h.repeat(Ke)}`),k.push(`  ${v.v}`),ke=!0;continue}for(let Pt of De.lines)if(ke)k.push(`  ${v.v} ${Pt}`);else k.push(Pt);if(De.incrementStep)j++}}if(ke)k.push(`  ${v.v}`),k.push(`  ${v.bl}${v.h.repeat(56)}`),ke=!1;if(!qe)k.push(""),k.push(`  ${et.green("✓")} Allowed (no matching rules)`)}if(k.push(""),k.push("RESULT"),a.result==="blocked"){if(k.push(`  Status: ${et.red("BLOCKED")}`),a.customRule){if(k.push(`  Rule: ${a.customRule.id}`),a.customRule.rulebook)k.push(`  Rulebook: ${a.customRule.rulebook.name} ${a.customRule.rulebook.version}`);if(a.customRule.source)k.push(`  Source: ${a.customRule.source}`);if(a.customRule.override)k.push(`  Override: reason ${a.customRule.override.reason}`)}if(a.reason){let be=jr(a.reason,"          ");k.push(`  Reason: ${be[0]}`);for(let ve=1;ve<be.length;ve++)k.push(be[ve]??"")}}else k.push(`  Status: ${et.green("ALLOWED")}`);k.push(""),k.push("CONFIG");let ie=a.configSource??"none",ae=a.configValid?"":" (invalid)";k.push(`  Path: ${ie}${ae}`);let le=a.safetyPresetScope;k.push(`  Safety preset: ${a.selectedPreset??"standard"}${le?` (${So(le)})`:""}`),k.push(`  Effective capabilities: ${a.effectiveLevel}`);let he=Object.entries(a.destructiveCommandRuleOverrides??{});if(k.push(`  Rule customizations: ${he.length}`),a.ruleActivation)k.push(`  Rule activation: ${a.ruleActivation.id} — ${a.ruleActivation.enabled?"on":"off"} via ${a.ruleActivation.source}`);return k.join(`
`)}function Wi(a){return JSON.stringify(a,null,2)}import{resolve as zv}from"node:path";var Tv=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function am(a){let p=0,v={allocateSegment(){return p++},getNextSegmentIndex(){return p},recordGlobal(b){a.record({kind:"step",scope:"global",step:b})},recordSegment(b,k=v.currentSegmentIndex){if(k===void 0)return;a.record({kind:"step",scope:"segment",segmentIndex:k,step:b})}};return v}function cm(a={}){let p=[],v=a.maxEvents??512,b={maxTextLength:a.maxTextLength??2048,maxListLength:a.maxListLength??128,maxObjectProperties:a.maxObjectProperties??a.maxListLength??128,maxDepth:a.maxDepth??16},k=0,j,F=new Set;return{record(W){if(j)return;try{if(!W||p.length>=v){k++;return}p.push(Yi(Iv(W,b,F)))}catch{k++}},finish(W){if(j)return j;try{j=Yi({events:Object.freeze(p),droppedEvents:k,terminal:Ov(W,b,F)})}catch{k++,j=Object.freeze({events:Object.freeze(p),droppedEvents:k,terminal:Object.freeze({result:"blocked",reason:"trace unavailable".slice(0,b.maxTextLength),segment:"trace unavailable".slice(0,b.maxTextLength)})})}return j}}}function Iv(a,p,v){if(a.kind!=="step")throw TypeError("invalid trace event");let{scope:b,step:k}=a;Yo(k,v,p);let j=sr(k,p,v);if(b==="global")return{kind:"step",scope:"global",step:j};if(b!=="segment")throw TypeError("invalid trace event scope");return{kind:"step",scope:"segment",segmentIndex:a.segmentIndex,step:j}}function Ov(a,p,v){let b=a.result;if(b==="allowed")return Object.freeze({result:"allowed"});if(b!=="blocked")throw TypeError("invalid trace terminal");let k=a.ruleId;return Object.freeze({result:"blocked",reason:sr(a.reason,p,v),segment:sr(a.segment,p,v),...k?{ruleId:sr(k,p,v)}:{}})}function Yo(a,p,v,b=0,k=new WeakSet){if(typeof a==="string"){let W=a.slice(0,v.maxTextLength);if(!ut(W))return;for(let K of bt(W))for(let se of K.match(/[^\s"'()$]+/g)??[])p.add(lm(se));return}if(!a||typeof a!=="object"||b>=v.maxDepth||k.has(a))return;if(k.add(a),Array.isArray(a)){let W=Math.min(a.length,v.maxListLength);for(let K=0;K<W;K++)Yo(a[K],p,v,b+1,k);return}let j=0,F=new Set;for(let W in a){if(!Object.hasOwn(a,W))continue;if(j>=v.maxObjectProperties)break;j++,Yo(W,p,v);let K=Ki(W,v,p);if(F.has(K))continue;F.add(K),Yo(a[W],p,v,b+1,k)}}function sr(a,p,v,b=0,k=new WeakSet){if(typeof a==="string")return Ki(a,p,v);if(!a||typeof a!=="object")return a;if(b>=p.maxDepth)return;if(k.has(a))return;if(k.add(a),Array.isArray(a)){let W=[],K=Math.min(a.length,p.maxListLength);for(let se=0;se<K;se++)W.push(sr(a[se],p,v,b+1,k));return W}let j={},F=0;for(let W in a){if(!Object.hasOwn(a,W))continue;if(F>=p.maxObjectProperties)break;F++;let K=Ki(W,p,v);if(Object.hasOwn(j,K))continue;Object.defineProperty(j,K,{value:sr(a[W],p,v,b+1,k),enumerable:!0,configurable:!0,writable:!0})}return j}function Ki(a,p,v){let b=a.slice(0,p.maxTextLength),k=ut(b)?ct(b):b,j=v.size>0?Nv(k,v):k;return(jv(j)?Ve(j):j).slice(0,p.maxTextLength)}function jv(a){return a.includes("PRIVATE KEY")||a.includes("://")||a.includes("eyJ")||a.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(a)||a.length>=14&&Tv.some((p)=>a.includes(p))||a.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(a)}function Nv(a,p){return a.replace(/[^\s"'()$]+/g,(v)=>p.has(lm(v))?"<redacted>":v)}function lm(a){let p=2166136261,v=2166136261;for(let b=0;b<a.length;b++)p=Math.imul(p^a.charCodeAt(b),16777619),v=Math.imul(v^a.charCodeAt(a.length-b-1),16777619);return`${p>>>0}:${v>>>0}:${a.length}`}function Yi(a){if(a&&typeof a==="object"&&!Object.isFrozen(a)){for(let p of Object.values(a))Yi(p);Object.freeze(a)}return a}function Nr(a,p={},v){let b=zv(p.cwd??process.cwd()),k=p.policySnapshot??D(v,{cwd:b,userConfigDir:p.userConfigDir}),j=M(k.policy,v.env),F=p.strict,W=ot({policySnapshot:k,effectiveCapabilities:j.capabilities,strict:F??j.strict,paranoidRm:j.paranoidRm,paranoidInterpreters:j.paranoidInterpreters,worktreeMode:j.worktreeMode}),K={effectiveLevel:W.effectiveLevel,selectedPreset:k.policy.safety.level??"standard",...k.policyScopes?{safetyPresetScope:k.policyScopes.levelScope}:{},effectiveCapabilities:W.effectiveCapabilities,destructiveCommandRuleOverrides:k.policy.destructiveCommandRuleOverrides},{configSource:se,configValid:ie}=Mv(v,{cwd:b,userConfigDir:p.userConfigDir});if(!a||!a.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:se,configValid:ie,...K};let ae=S(a,"auto");if(ae.status==="limited")throw new L;let le=ae.dialect==="powershell"?S(a,"posix"):ae,he=Lt(le),be=cm(),ve=am(be);ve.recordGlobal({type:"parse",input:a,segments:he.map((en)=>[...en])});let ke=f("Bash",{command:a},{kind:"command",shell:"auto"},{configCwd:b,executionCwd:b},a),qe=ne(ke,{environment:v,trace:ve,dependencies:{loadPolicySnapshot:()=>k,...F===void 0?{}:{getModes:()=>({...j,strict:F})}}}),Ze=qe.decision.kind==="deny"?qe.decision:null;if(Ze&&(qe.stage==="policy-protection"||qe.stage==="secret-protection")){let en=Fv(Ze);return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:en.rule,matched:!0,reason:Ze.reason}]}]},result:"blocked",reason:N(Ze.reason),segment:N(Xi(Ze,a)),...en.ruleId?{ruleId:N(en.ruleId)}:{},configSource:se,configValid:ie,...K}}let De=ve.getNextSegmentIndex();if(Ze&&De>0&&De<he.length)ve.recordSegment({type:"segment-skipped",index:De,reason:"prior-segment-blocked"},De);let Pt=be.finish(Ze?{result:"blocked",reason:Ze.reason,segment:Xi(Ze,a),...Ze.ruleId?{ruleId:Ze.ruleId}:{}}:{result:"allowed"}),Ke=Ze?.ruleId??Uv(ke,k,j,v),At=Q.find((en)=>en.id===Ke&&en.activationCapability),dn=At?W.policy.effectiveDestructiveCommandRules[At.id]:void 0;return{trace:Zv(Pt),result:Ze?"blocked":"allowed",reason:Ze?N(Ze.reason):void 0,segment:Ze?N(Xi(Ze,a)):void 0,ruleId:Ze?.ruleId?N(Ze.ruleId):void 0,customRule:Hv(Gv(Ze?.ruleId,k)),configSource:se,configValid:ie,...K,...At&&dn?{ruleActivation:{id:At.id,...dn}}:{}}}function Xi(a,p){return a.evidence.find((v)=>v.kind==="command")?.segment??p}function Fv(a){if(a.reason===st)return{ruleId:"policy-protection",rule:"policy-protection:findPolicyConfigMutationTargetInSemanticFacts"};if(a.reason===it)return{ruleId:"policy-apply-protection",rule:"policy-apply-protection:findPolicyApplyInvocationInSemanticFacts"};if(a.reason===R)return{ruleId:"git-metadata-protection",rule:"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts"};return{ruleId:a.ruleId,rule:"secret-protection:findSensitiveTargetInSemanticFacts"}}function Mv(a,p){let v=G(p.cwd),b=p.userConfigPath??H(a,p),k=Y(a,{cwd:p.cwd,userConfigDir:p.userConfigDir,userConfigPath:p.userConfigPath});try{if(r(k.projectConfigTarget)!==null){if(kn(k.projectConfigTarget).errors.length===0)return{configSource:v,configValid:!0};return{configSource:v,configValid:!1}}}catch(j){if(j instanceof o)return{configSource:v,configValid:!1};throw j}try{if(r(k.userConfigTarget)!==null){let j=kn(k.userConfigTarget);return{configSource:b,configValid:j.errors.length===0}}return{configSource:null,configValid:!0}}catch(j){if(j instanceof o)return{configSource:b,configValid:!1};throw j}}function Uv(a,p,v,b){let k=p.policy,j=We({...k,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...k.destructiveCommandRuleOverrides,...Object.fromEntries(Q.flatMap((W)=>W.activationCapability?[[W.id,"on"]]:[]))}},p.state==="degraded"?{diagnostics:p.diagnostics,reason:p.reason}:void 0),F=ne(a,{environment:b,dependencies:{loadPolicySnapshot:()=>j,getModes:()=>({...v,strict:!0,paranoidRm:!0,paranoidInterpreters:!0}),findSensitiveTarget:()=>null}});return F.decision.kind==="deny"?F.decision.ruleId:void 0}function Hv(a){if(!a)return;return{id:N(a.id),...a.rulebook?{rulebook:{name:N(a.rulebook.name),version:N(a.rulebook.version)}}:{},...a.source?{source:N(a.source)}:{},...a.override?{override:{type:"reason",reason:N(a.override.reason)}}:{}}}function Zv(a){let p=a.events.flatMap((b)=>b.kind==="step"&&b.scope==="global"?[b.step]:[]),v=new Map;for(let b of a.events){if(b.kind!=="step"||b.scope!=="segment")continue;let k=v.get(b.segmentIndex)??{index:b.segmentIndex,steps:[]};k.steps.push(b.step),v.set(b.segmentIndex,k)}return{steps:p,segments:[...v.values()]}}function Gv(a,p){let v=a?.replace(/^custom\./,"");if(!v||!p.policy.rules.some((b)=>b.name===v))return;return p.ruleMetadata[v]??Object.freeze({id:v})}function um(a){return new Promise((p)=>{process.stdout.write(`${a}
`,()=>p())})}async function dm(a,p){let v=qi(p);if(!v)return 1;try{let b=Nr(v.command,{cwd:v.cwd},a),k=!!process.env.NO_COLOR||!process.stdout.isTTY;return await um(v.json?Wi(b):Ji(b,{asciiOnly:k})),0}catch(b){let k=Bv(b instanceof m?b.cause:b);if(k===void 0)throw b;if(v.json)return await um(JSON.stringify({error:k})),1;return console.error(k),1}}function Bv(a){if(a instanceof L)return a.message;if(a instanceof u)return a.message;if(a instanceof s&&t[a.kind].errorCode==="path-canonicalization-limit")return"Path canonicalization work limit exceeded.";return}var pm="2.3.4",Qt="  ",Mn="cc-safety-net";function fm(a){return a.argument?`${a.flags} ${a.argument}`:a.flags}function qv(a){return Math.max(...a.map((p)=>fm(p).length))}function Vv(a){return Math.max(...a.map((p)=>p.usage.length))}function Jv(a){return Math.max(...a.map((p)=>`${Mn} ${p.usage}`.length))}function Wv(a,p){let v=`${Mn} ${a.usage}`;return`${Qt}${v.padEnd(p+2)}${a.description}`}function mn(a,p){return`${Qt}${a.padEnd(Math.max(40,a.length+2))}${p}`}function ir(a,p=console.log){let v=[];if(v.push(`${Mn} ${a.name}`),v.push(""),v.push(`${Qt}${a.description}`),v.push(""),v.push("USAGE:"),v.push(`${Qt}${Mn} ${a.usage}`),v.push(""),a.subcommands&&a.subcommands.length>0){v.push("SUBCOMMANDS:");let b=Vv(a.subcommands);for(let k of a.subcommands)v.push(`${Qt}${k.usage.padEnd(b+2)}${k.description}`);v.push("")}if(a.options.length>0){v.push("OPTIONS:");let b=qv(a.options);for(let k of a.options){let j=fm(k),F=k.default?`${k.description} (default: ${k.default})`:k.description;v.push(`${Qt}${j.padEnd(b+2)}${F}`)}v.push("")}if(a.examples&&a.examples.length>0){v.push("EXAMPLES:");for(let b of a.examples)v.push(`${Qt}${b}`)}p(v.join(`
`))}function Qi(){let a=Jv(Wr),p=[];p.push(`${Mn} v${pm}`),p.push(""),p.push("Blocks destructive commands and secret access."),p.push(""),p.push("COMMANDS:");for(let v of Wr)p.push(Wv(v,a));p.push(""),p.push("GLOBAL OPTIONS:"),p.push(`${Qt}-h, --help       Show help (use with command for command-specific help)`),p.push(`${Qt}-V, --version    Show version`),p.push(""),p.push("HELP:"),p.push(`${Qt}${Mn} help <command>     Show help for a specific command`),p.push(`${Qt}${Mn} <command> --help   Show help for a specific command`),p.push(""),p.push("ENVIRONMENT VARIABLES:"),p.push(mn(`${n.level.name}=standard|strict|paranoid`,"Set session safety level")),p.push(mn(`${n.worktree.name}=1`,"Allow local git discards in linked worktrees")),p.push(mn(`${n.debug.name}=1`,"Print diagnostic messages to stderr")),p.push(mn(`${n.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),p.push(mn("CC_SAFETY_NET_HOME","Override rule config home directory")),p.push(""),p.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),p.push(mn(`${n.strict.name}=1`,"Force safety.overrides.fail_closed on")),p.push(mn(`${n.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),p.push(mn(`${n.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),p.push(mn(`${n.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),p.push(""),p.push("Documentation:        https://ccsafetynet.com/docs"),console.log(p.join(`
`))}function mm(){console.log(pm)}function zr(a,p=console.log){let v=Kr(a);if(!v)return!1;if(v.name.toLowerCase()!==a.toLowerCase())return!1;return ir(v,p),!0}import{existsSync as da,readFileSync as d2}from"node:fs";import{join as la}from"node:path";import*as Cn from"node:readline";function Kv(a){return a==="install"?"Install":"Uninstall"}function Yv(a){return a==="install"?"Installing":"Uninstalling"}function Xv(a){return a==="install"?"into":"from"}function ym(a){return a?.available===!0}function Qv(a,p){let v=new Set(p);return a.filter((b)=>v.has(b.target)).map((b)=>b.target)}function gm(a,p,v){if(a.length===0||a.every((b)=>!b.available))return p;return Array.from({length:a.length},(b,k)=>k+1).map((b)=>(p+b*v+a.length)%a.length).find((b)=>ym(a[b]))}function eb(a,p,v){if(v.ctrl&&v.name==="c")return"interrupt";if(v.name==="escape"||p==="q")return"abort";if(a==="install"&&(p==="u"||p==="U"))return"update";if(v.name==="up"||p==="k")return"up";if(v.name==="down"||p==="j")return"down";if(v.name==="space"||p===" ")return"toggle";if(v.name==="return"||v.name==="enter")return"confirm";return null}function tb(a){return{cursor:a.findIndex((p)=>p.available),selected:[]}}function nb(a,p,v){if(v==="confirm"||v==="update"||v==="abort"||v==="interrupt")return{state:a,done:v};if(v==="up")return{state:{...a,cursor:gm(p,a.cursor,-1)}};if(v==="down")return{state:{...a,cursor:gm(p,a.cursor,1)}};let b=p[a.cursor];if(!ym(b))return{state:a};let k=a.selected.includes(b.target)?a.selected.filter((j)=>j!==b.target):Qv(p,[...a.selected,b.target]);return{state:{...a,selected:k}}}var vm="◉",bm="◯",Lm=">",wm=" ";function rb(a,p,v,b={}){let k=b.color!==!1,j=k?et.dim:(K)=>K,F=k?et.green:(K)=>K,W=k?et.bold:(K)=>K;return["",`${Kv(a)} CC Safety Net ${Xv(a)}:`,"",...p.map((K,se)=>{let ie=v.selected.includes(K.target),ae=se===v.cursor,le=ie?vm:bm,he=ae?Lm:wm,be=K.available?"":` (${K.unavailableReason??"not installed"})`,ve=`${le} ${K.label}${be}`,ke=!K.available?j(ve):ie?F(ve):ae?W(ve):ve;return`${he} ${ke}`}),"",a==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":p.some((K)=>K.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${a}. q/Esc: close`].join(`
`)}var hm=["global-hook","plugin"];function ob(a,p,v={}){let b=v.color!==!1?et.bold:(j)=>j;return["","Install the Kimi Code integration as:","",...[`Global hook — ${p?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((j,F)=>{let W=F===a,K=`${W?vm:bm} ${j}`;return`${W?Lm:wm} ${W?b(K):K}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function xm(a){let{input:p,output:v}=a;Cn.emitKeypressEvents(p);let b=p.isRaw===!0;p.setRawMode(!0),p.resume();let k=0,j=()=>{if(k===0)return;Cn.moveCursor(v,0,-k),Cn.cursorTo(v,0),Cn.clearScreenDown(v)},F=()=>{j();let W=a.render();v.write(`${W}
`),k=W.split(`
`).length};return new Promise((W)=>{let K=(ie)=>{p.off("keypress",se),p.setRawMode(b),p.pause(),j(),W(ie)};function se(ie,ae){a.onKey(ie,ae,{finish:K,draw:F})}p.on("keypress",se),F()})}function km(a={}){let p=0;return xm({input:a.input??process.stdin,output:a.output??process.stdout,render:()=>ob(p,a.globalHookInstalled===!0),onKey:(v,b,k)=>{if(b.ctrl&&b.name==="c"){k.finish(null),(a.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(b.name==="escape"||v==="q")return k.finish(null);if(b.name==="return"||b.name==="enter")return k.finish(hm[p]);if(b.name==="up"||b.name==="down"||v==="k"||v==="j")p=(p+1)%hm.length,k.draw()}})}function ea(a=process.stdin,p=process.stdout){return Boolean(a.isTTY&&p.isTTY&&typeof a.setRawMode==="function")}function _m(a,p,v={}){let b=v.output??process.stdout,k=tb(p);return xm({input:v.input??process.stdin,output:b,render:()=>rb(a,p,k),onKey:(j,F,W)=>{let K=eb(a,j,F);if(!K)return;let se=nb(k,p,K);if(k=se.state,se.done==="interrupt"){W.finish(null),(v.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(se.done==="abort")return W.finish(null);if(se.done==="update")return W.finish("update");if(se.done==="confirm"){if(k.selected.length===0){b.write("\x07"),W.draw();return}W.finish([...k.selected]),b.write(`${Yv(a)} selected integrations...
`);return}W.draw()}})}import{existsSync as Cm,lstatSync as ib,mkdirSync as ab,mkdtempSync as cb,readdirSync as lb,readFileSync as cr,rmSync as Qo}from"node:fs";import{basename as ub,dirname as db,join as Jt}from"node:path";import{fileURLToPath as pb}from"node:url";var ta="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",Un="cc-safety-net",Hn="cc-safety-net/index.ts";import{spawn as sb}from"node:child_process";var na=(a,p)=>{let v=jn([...a],process.env);return new Promise((b)=>{let k=sb(v.cmd,v.args,{cwd:p,stdio:["ignore","pipe","pipe"]}),j=Oi(k),F=!1,W=setTimeout(()=>{F=!0,k.kill()},120000);k.on("error",(K)=>{clearTimeout(W),b({status:null,errorCode:K.code,stdout:j.stdout,stderr:[K.message,j.stderr].filter(Boolean).join(`
`)})}),k.on("close",(K)=>{clearTimeout(W),b({status:F?null:K,errorCode:F?"ETIMEDOUT":void 0,stdout:j.stdout,stderr:j.stderr})})})};var ar="cc-safety-net.ts",Sm=Jt("amp",Hn);function fb(a){return Jt(a.home,".config","amp","plugins","cc-safety-net.ts")}function mb(){let a=db(pb(import.meta.url));return[Jt(a,"..",Sm),Jt(a,"..","..","..","dist",Sm)]}function gb(a=mb()){let p=a.find((v)=>Cm(v)&&ib(v).isFile());if(!p)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return p}function Pm(a){try{return JSON.parse(a)}catch{return}}function es(a){return a.subarray(0,Buffer.byteLength(ta)).toString("utf-8")===ta}async function Fr(a,p,v){let b=await a(p,v);if(b.status===0)return b;throw Error([`Failed to run ${p.join(" ")}${b.status===null?"":` (exit ${b.status})`}.`,[b.stdout,b.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function $m(a){let p=await a(["amp","plugins","repositories","--json"]);if(p.status===null)throw Error(`${p.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${p.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${p.stderr}`.trim());if(p.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${p.status}). Sign in with "amp login" and rerun install --amp.
${[p.stdout,p.stderr].filter(Boolean).join(`
`)}`.trim());let v=Pm(p.stdout),b=(Array.isArray(v)?v:[]).filter((k)=>$t(k,"scope")==="user"&&$t(k,"exists")===!0&&$t(k,"viewerCanWrite")===!0).map((k)=>$t(k,"cloneRef")).find((k)=>typeof k==="string"&&k.length>0);if(!b)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return b}async function Em(a,p,v){let b=cb(Jt(p.tmpdir,"cc-safety-net-amp-"));try{return await Fr(a,["amp","clone","user-plugins",b]),await v(b)}finally{Qo(b,{recursive:!0,force:!0})}}function ra(a){return`rerun ${a==="overwrite"?"install":"uninstall"} --amp`}function Rm(a,p,v){let b=Jt(a,p),k=Nt(b);if(!k)return;if(k.isSymbolicLink()||!k.isFile())throw Error(`Refusing to ${v} ${p} in your Amp personal plugins repository: not a regular file. Remove it there and ${ra(v)}.`);let j=cr(b);if(es(j))return j;throw Error(`Refusing to ${v} unmanaged file ${p} in your Amp personal plugins repository. Remove it there and ${ra(v)}.`)}function Dm(a,p){let v=Jt(a,Un),b=Nt(v);if(!b)return;if(b.isSymbolicLink()||!b.isDirectory())throw Error(`Refusing to ${p} ${Un} in your Amp personal plugins repository: not a regular directory. Remove it there and ${ra(p)}.`);return Rm(a,Hn,p)}function hb(a){let p=Jt(a,ar),v=Nt(p);if(!v||v.isSymbolicLink()||!v.isFile())return;let b=cr(p);return es(b)?b:void 0}async function Am(a,p,v,b){if(await Fr(a,v,p),(await Fr(a,["git","status","--porcelain"],p)).stdout.trim()==="")return!1;return await Fr(a,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",b],p),await Fr(a,["git","push","origin","HEAD"],p),!0}function Xo(a,p){yb(a,p),vb(a,p)}function Tm(a,p){if(p==="keep")return;throw Error(`Local Amp plugin ${a} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function yb(a,p){let v=fb(a),b=Nt(v);if(!b)return;if(!b.isSymbolicLink()&&b.isFile()&&es(cr(v))){Qo(v);return}Tm(v,p)}function vb(a,p){let v=Jt(a.home,".config","amp","plugins",Un),b=Nt(v);if(!b)return;if(!b.isSymbolicLink()&&b.isDirectory()&&bb(v)){Qo(v,{recursive:!0});return}Tm(v,p)}function bb(a){let p=ub(Hn);if(lb(a).join("\x00")!==p)return!1;let v=Jt(a,p),b=Nt(v);return!!b&&!b.isSymbolicLink()&&b.isFile()&&es(cr(v))}function Lb(a){let p=h(a);if(!Cm(p))return"";let v=Pm(cr(p,"utf-8"));if(!v||typeof v!=="object"||Array.isArray(v))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(x(v,a.home))};
`}async function Im(a,p=gb(),v=na){let b=Buffer.concat([cr(p),Buffer.from(Lb(a),"utf-8")]),k=await $m(v);return Em(v,a,async(j)=>{let F=`${k}/${Un}`,W=Dm(j,"overwrite"),K=Rm(j,ar,"overwrite");if(W?.equals(b)&&!K)return Xo(a,"fail"),{path:F,alreadyInstalled:!0};if(ab(Jt(j,Un),{recursive:!0}),Ft(Jt(j,Hn),b),K)Qo(Jt(j,ar));let se=await Am(v,j,["git","add","--",Hn,...K?[ar]:[]],`chore: update cc-safety-net plugin to v${zt()}`);return Xo(a,"fail"),{path:F,alreadyInstalled:!se}})}async function Om(a,p=na){let v=await $m(p);return Em(p,a,async(b)=>{let k=Dm(b,"remove"),j=hb(b),F=`${v}/${j&&!k?ar:Un}`;if(!k&&!j)return Xo(a,"keep"),{path:F,alreadyInstalled:!1};return await Am(p,b,["git","rm","--",...k?[Hn]:[],...j?[ar]:[]],`chore: remove cc-safety-net plugin v${zt()}`),Xo(a,"keep"),{path:F,alreadyInstalled:!0}})}import{existsSync as jm,mkdirSync as wb,readFileSync as xb}from"node:fs";import{dirname as kb}from"node:path";var oa=cn["antigravity-cli"],Zn="cc-safety-net";function Gn(a){return Boolean(a)&&typeof a==="object"&&!Array.isArray(a)}function ns(){return{PreToolUse:[{hooks:[{type:"command",command:oa,timeout:30}]}]}}function Nm(a){try{let p=JSON.parse(xb(a,"utf-8"));if(!p||typeof p!=="object"||Array.isArray(p))throw Error("Antigravity hooks config must be a JSON object");return p}catch(p){if(p instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${a}: ${p.message}`);throw p}}function zm(a){let p=a[Zn];if(p===void 0){let b=ns();return a[Zn]=b,{definition:b,preToolUse:b.PreToolUse??[]}}if(!Gn(p))throw Error(`Antigravity hooks config entry "${Zn}" must be an object`);let v=Array.isArray(p.PreToolUse)?p.PreToolUse:[];return p.PreToolUse=v,{definition:p,preToolUse:v}}function Fm(a){if(!Array.isArray(a.PreToolUse))return!1;return a.PreToolUse.some((p)=>Gn(p)&&Array.isArray(p.hooks)&&p.hooks.some((v)=>Gn(v)&&v.command===oa))}function _b(a){return Object.values(a).some((p)=>Gn(p)&&p.enabled!==!1&&Fm(p))}function Sb(a){if(a[Zn]===void 0)return!1;let p=zm(a);if(p.definition.enabled!==!1||!Fm(p.definition))return!1;return p.definition.enabled=!0,!0}function Cb(a){if(a[Zn]===void 0){a[Zn]=ns();return}let p=zm(a);p.definition.enabled=!0,p.preToolUse.push(ns().PreToolUse?.[0]??{hooks:[]})}function Pb(a){let p=!1;for(let v of Object.values(a)){if(!Gn(v)||!Array.isArray(v.PreToolUse))continue;v.PreToolUse=v.PreToolUse.flatMap((b)=>{if(!Gn(b)||!Array.isArray(b.hooks))return[b];let k=b.hooks.filter((j)=>!Gn(j)||j.command!==oa);if(k.length!==b.hooks.length)p=!0;return k.length===0?[]:[{...b,hooks:k}]})}return p}function ts(a,p){Ft(a,`${JSON.stringify(p,null,2)}
`)}function Mm(a){let p=Be(a.home);if(wb(kb(p),{recursive:!0}),!jm(p))return ts(p,{[Zn]:ns()}),{path:p,alreadyInstalled:!1};let v=Nm(p);if(_b(v))return{path:p,alreadyInstalled:!0};if(Sb(v))return ts(p,v),{path:p,alreadyInstalled:!1};return Cb(v),ts(p,v),{path:p,alreadyInstalled:!1}}function Um(a){let p=Be(a.home);if(!jm(p))return{path:p,alreadyInstalled:!1};let v=Nm(p);if(!Pb(v))return{path:p,alreadyInstalled:!1};return ts(p,v),{path:p,alreadyInstalled:!0}}import{existsSync as $b,readdirSync as Eb,rmSync as Rb}from"node:fs";import{join as Db}from"node:path";function Hm(a,p=process.platform,v){if(!$b(a))return;let b=p==="win32"?/^bunx-\d+-cc-safety-net@/:new RegExp(`^bunx-${process.getuid?.()??0}-cc-safety-net@`);Eb(a).filter((k)=>k!==v&&b.test(k)).forEach((k)=>{Rb(Db(a,k),{recursive:!0,force:!0})})}import{spawn as Ab}from"node:child_process";var un=U.map((a)=>({target:a.id,flag:a.flag,label:d(a.id),probeCommand:a.probeCommand}));function sa(a){let p=new Set(a);return un.map((v)=>v.target).filter((v)=>p.has(v))}async function Zm(a,p){for(let v of a)await p(v)}var Tb=5000;function ia(a){return new Promise((p)=>{let v=jn([...a],process.env),b=Ab(v.cmd,v.args,{env:process.env,stdio:"ignore"}),k=!1,j=(W)=>{if(k)return;k=!0,clearTimeout(F),p(W)},F=setTimeout(()=>{b.kill(),j(!1)},Tb);b.on("error",()=>j(!1)),b.on("close",(W)=>j(W===0))})}function Gm(a=ia,p={}){let v=new Set(p.configuredTargets??[]);return Promise.all(un.map(async(b)=>({target:b.target,flag:b.flag,label:b.label,...qm(p.action,await a(b.probeCommand),v.has(b.target))})))}function Bm(a,p){let v=new Set(p.configuredTargets??[]);return a.map((b)=>({...b,...qm(p.action,b.available,v.has(b.target))}))}function qm(a,p,v){if(a==="uninstall")return v?{available:!0}:{available:!1,unavailableReason:"not installed"};if(a==="install"&&v)return{available:!1,unavailableReason:"already installed"};if(!p)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}import{existsSync as Vm,readdirSync as Ib,rmSync as Ob}from"node:fs";import{join as lr}from"node:path";function rs(a,p=process.platform){let v=lr(a.env.get("npm_config_cache")||(p==="win32"?lr(a.env.get("LOCALAPPDATA")||lr(a.home,"AppData","Local"),"npm-cache"):lr(a.home,".npm")),"_npx");if(!Vm(v))return;Ib(v).filter((b)=>Vm(lr(v,b,"node_modules","cc-safety-net"))).forEach((b)=>{Ob(lr(v,b),{recursive:!0,force:!0})})}import{existsSync as Qm,mkdirSync as Nb,readFileSync as e2}from"node:fs";import{dirname as zb,join as Xm}from"node:path";function jb(a,p){if(a[p]!=="#")return p;let v=a.indexOf(`
`,p+1);return v===-1?a.length:v+1}function aa(a,p,v){let b=new RegExp(`^(\\s*)${p}\\s*=\\s*\\[`),k=0;for(let j of a.split(`
`)){if(/^\s*\[/.test(j))return;let F=b.exec(j);if(F){let W=k+F[0].lastIndexOf("[");return{start:W,end:vi(a,W,{skipComment:jb,...v})}}k+=j.length+1}return}function Jm(a,p,v){let b=a.slice(0,p.end).trimEnd(),k=zp(a,p.end),j=k===""?"     ":`${k}  `,F=!b.endsWith("[")&&!b.endsWith(",");return`${b}${F?",":""}
${j}${v}${a.slice(p.end)}`}function Wm(a,p,v){let b=a.indexOf(v,p.start);if(b===-1||b>p.end)return a;return Oo(a,{start:b,end:b+v.length})}function Km(a,p){let v=new RegExp(`^\\s*${p}\\s*=\\s*\\[\\s*]\\s*(?:#.*)?$`),b=a.split(`
`),k=b.findIndex((W)=>/^\s*\[/.test(W)),j=k===-1?b:b.slice(0,k),F=k===-1?[]:b.slice(k);return[...j.filter((W)=>!v.test(W)),...F].join(`
`)}function Ym(a,p,v){let b=new RegExp(`^\\s*\\[\\[${p}]]\\s*$`,"m");return a.split(/(?=^\s*\[)/m).filter((k)=>!b.test(k)||!k.includes(v)).join("").trimEnd()}var Mr=cn["kimi-code"],ca=`[[hooks]]
event = "PreToolUse"
command = "${Mr}"`,t2=`{ event = "PreToolUse", command = "${Mr}" }`,n2={stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"};function r2(a){return Xm(a.env.get("KIMI_CODE_HOME")??Xm(a.home,".kimi-code"),"config.toml")}function Fb(a){let p=aa(a,"hooks",n2);if(p&&a.slice(p.start+1,p.end).trim())return Jm(a,p,t2);let v=Km(a,"hooks").trimEnd();if(v==="")return`${ca}
`;return`${v}

${ca}
`}function o2(a){let p=r2(a);if(Nb(zb(p),{recursive:!0}),!Qm(p))return Ft(p,`${ca}
`),{path:p,alreadyInstalled:!1};let v=e2(p,"utf-8");if(v.includes(Mr))return{path:p,alreadyInstalled:!0};return Ft(p,Fb(v)),{path:p,alreadyInstalled:!1}}function s2(a){let p=r2(a);if(!Qm(p))return{path:p,alreadyInstalled:!1};let v=e2(p,"utf-8");if(!v.includes(Mr))return{path:p,alreadyInstalled:!1};let b=aa(v,"hooks",n2),k=b?Wm(v,b,t2):`${Ym(v,"hooks",Mr)}
`;return Ft(p,k),{path:p,alreadyInstalled:!0}}var ua="safety-net@cc-marketplace",i2=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),a2=new Set(["antigravity-cli","cursor","grok-build","hermes-agent","kimi-code"]);function pa(a){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(a??"")}function p2(a){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(a??"")}function Mb(a){return/^Marketplace `cc-marketplace`\s*$/m.test(a??"")}var f2={"claude-code":{installCommands:(a)=>{let p=To(a,"cc-safety-net@cc-marketplace");return{commands:[...p?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...hi(a).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:To(a,ua)?[["claude","plugin","uninstall",ua]]:[],update:p}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(a,p)=>{let v=p??await ln(["codex","plugin","list"]),b=p2(v);return{commands:[b||Mb(v)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:pa(v)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:b}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:"Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."},"copilot-cli":{installCommands:async()=>{let a=await ln(["copilot","plugin","list"]),p=[...qp(a)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...Vp(a)?[["copilot","plugin","uninstall",Zp]]:[]];if(Gp(a))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",an]],cleanupCommands:p,update:!0};return{commands:[Bp(await ln(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",an]],cleanupCommands:p}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(a)=>{let p=Si(a);if(p.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(p.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:Fi,installCommands:()=>({commands:jf()}),uninstallCommands:[["openclaw","plugins","uninstall",jt,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{beforeInstall:Hi,installCommands:[["opencode","plugin","-g","-f","cc-safety-net@latest"]]},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]}};function m2(a,p=(v)=>v){try{let v=JSON.parse(p(d2(a,"utf-8")));if(!v||typeof v!=="object"||Array.isArray(v))throw Error(`Settings file ${a} must be a JSON object`);return v}catch(v){if(v instanceof SyntaxError)throw Error(`Failed to parse ${a}: ${v.message}`);throw v}}function Ub(a){let p=la($r(a),"settings.json");if(!da(p))return;let v=m2(p,Wt),b=v.enabledPlugins;if(!b||typeof b!=="object"||Array.isArray(b))return;if(b[an]!==!1)return;let k=d2(p,"utf-8"),j=k.replace(new RegExp(`("${an}"\\s*:\\s*)false`),"$1true");return b[an]=!0,Ft(p,j!==k?j:`${JSON.stringify(v,null,2)}
`),`Enabled ${an} plugin in ${p}`}function Hb(a){let p=Zi(a);if(!da(p))return;let v=m2(p);if(!Array.isArray(v.packages))return;let b=v.packages.find((k)=>!!k&&typeof k==="object"&&!Array.isArray(k)&&Gi(k.source)&&("extensions"in k));if(!b)return;return delete b.extensions,Ft(p,`${JSON.stringify(v,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${p}`}function c2(a,p){let v=c({label:p,booleans:Object.fromEntries(un.map((j)=>[j.target,[j.flag]]))},a),b=v.errors[0];if(b)throw Error(b);let k=un.filter((j)=>v.flags[j.target]).map((j)=>j.target);if(k.length!==1)throw Error(`Choose exactly one ${p} target: ${un.map((j)=>j.flag).join(", ")}`);return k[0]}async function g2(a,p=Xn){let[v,b,k]=await Promise.all([p(["amp","plugins","list"],30000),p(["codex","plugin","list"],30000),p(["copilot","--binary-version"])]);return{codexPluginListOutput:b,hooks:or(a,process.cwd(),{ampPluginListOutput:v,codexPluginListOutput:b,copilotCliVersion:k})}}async function Zb(a,p,v=Xn){let b=await g2(a,v);return b.hooks.filter((k)=>p==="install"?k.configured:k.detected||k.inspectionStatus==="not-inspected").filter((k)=>k.platform!=="codex"||!pa(b.codexPluginListOutput)||p2(b.codexPluginListOutput)).map((k)=>k.platform)}function Gb(a,p,v,b){if(v.length>0)return{finish:async()=>[c2(v,p)]};if(!b.selectTargets&&!ea(b.input,b.output))return{finish:async()=>[c2(v,p)]};let k=b.detectConfiguredTargets??(()=>Zb(a,p,b.fetchVersion)),j=Promise.all([Gm(b.probeTargets),k()]);return{ready:j,finish:async()=>{let[F,W]=await j,K=Bm(F,{action:p,configuredTargets:W}),se=b.selectTargets?await b.selectTargets(p,u2(p,K)):await _m(p,u2(p,K),{input:b.input,output:b.output});if(se==="update")return se;if(!se||se.length===0)return null;return sa(se)}}}async function Bn(a,p,v=!1,b){let k=f2[a];k.beforeInstall?.(p);let j=typeof k.installCommands==="function"?await k.installCommands(p,b):{commands:k.installCommands};return await ji(j.commands),await Rf(j.cleanupCommands??[]),[`${j.update||v?"Updated":"Installed"} ${d(a)} integration`,k.postInstallMessage].filter(Boolean).join(`
`)}async function ur(a){let p=f2[a];if(!p.uninstallCommands)throw Error(`${d(a)} uninstall is not supported`);return await ji(p.uninstallCommands),`Uninstalled ${d(a)} integration`}function Bb(a){let p=Yf(a);return p.alreadyInstalled?`Uninstalled OpenCode plugin from ${p.path}`:`OpenCode plugin not installed in ${p.path}`}var qb={"antigravity-cli":{install:Mm,uninstall:Um},cursor:{install:rf,uninstall:of},"grok-build":{install:gf,uninstall:hf},"kimi-code":{install:o2,uninstall:s2}};function Pn(a,p,v,b=!1){if(a==="install"&&!b)rs(v);let k=qb[p][a](v),j=d(p),F=a!=="install"?"Uninstalled":b?"Updated":"Installed";return a==="install"&&k.alreadyInstalled?b?`${j} hook up to date in ${k.path}`:`${j} hook already installed in ${k.path}`:a==="uninstall"&&!k.alreadyInstalled?`${j} hook not installed in ${k.path}`:`${F} ${j} hook ${a==="install"?"in":"from"} ${k.path}`}var Vb={amp:{install:Im,uninstall:Om,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:Lf,uninstall:wf,afterInstall:async(a)=>{let p=Ti(a);return await ln(["hermes","plugins","enable",Kt,"--no-allow-tool-override"]),!p},beforeUninstall:async(a)=>{Ai(a);try{await ln(["hermes","plugins","disable",Kt])}catch(p){console.warn(`${p instanceof Error?p.message:String(p)}
Removing the plugin files anyway; ${Kt} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function os(a,p,v,b=!1){let k=Vb[p];if(a==="uninstall")await k.beforeUninstall?.(v);let j=a==="install"?await k.install(v):await k.uninstall(v),F=a==="install"&&await k.afterInstall?.(v),W=d(p),K=!F&&(a==="install"&&j.alreadyInstalled||a==="uninstall"&&!j.alreadyInstalled);return[K?a==="install"?`${W} plugin ${b?"up to date":"already installed"} at ${j.path}`:`${W} plugin not installed at ${j.path}`:`${a!=="install"?"Uninstalled":b?"Updated":"Installed"} ${W} plugin ${a==="install"?"at":"from"} ${j.path}`,K?void 0:k.restartNote].filter(Boolean).join(`
`)}var Jb={amp:{install:(a,p)=>os("install","amp",a,p),uninstall:(a)=>os("uninstall","amp",a)},"antigravity-cli":{install:(a,p)=>Pn("install","antigravity-cli",a,p),uninstall:(a)=>Pn("uninstall","antigravity-cli",a)},"claude-code":{install:(a,p)=>Bn("claude-code",a,p),uninstall:()=>ur("claude-code")},codex:{install:(a,p,v)=>Bn("codex",a,p,v),uninstall:()=>ur("codex")},"copilot-cli":{install:async(a,p)=>[await Bn("copilot-cli",a,p),Ub(a)].filter(Boolean).join(`
`),uninstall:()=>ur("copilot-cli")},cursor:{install:(a,p)=>Pn("install","cursor",a,p),uninstall:(a)=>Pn("uninstall","cursor",a)},"gemini-cli":{install:(a,p)=>Bn("gemini-cli",a,p),uninstall:()=>ur("gemini-cli")},"grok-build":{install:(a,p)=>Pn("install","grok-build",a,p),uninstall:(a)=>Pn("uninstall","grok-build",a)},"hermes-agent":{install:(a,p)=>{if(!p)rs(a);return os("install","hermes-agent",a,p)},uninstall:(a)=>os("uninstall","hermes-agent",a)},"kimi-code":{install:(a,p)=>Pn("install","kimi-code",a,p),uninstall:(a)=>Pn("uninstall","kimi-code",a)},openclaw:{install:async(a,p)=>{let v=await Bn("openclaw",a,p);return await Nf(),v},uninstall:(a)=>(Fi(a),ur("openclaw"))},opencode:{install:async(a,p)=>{let v=await Bn("opencode",a,p);return await Wf(a),v},uninstall:(a)=>Bb(a)},pi:{install:async(a,p)=>[await Bn("pi",a,p),Hb(a)].filter(Boolean).join(`
`),uninstall:()=>ur("pi")}},l2=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function Wb(a){if(Tr({environment:a,cwd:process.cwd()}).status!=="configured")return l2;return[l2,"",et.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function u2(a,p){return p.map((v)=>a==="install"&&v.target==="kimi-code"&&v.unavailableReason==="already installed"?{...v,available:!0,unavailableReason:void 0,label:`${v.label} (global hook installed)`}:v)}function Kb(a,p){if(a.selectKimiInstallMethod)return a.selectKimiInstallMethod();if(!ea(a.input,a.output))return Promise.resolve("global-hook");return km({input:a.input,output:a.output,globalHookInstalled:Tr({environment:p,cwd:process.cwd()}).status==="configured"})}async function h2(a,p,v,b=!1,k){return Jb[p][a](v,b,k)}function Yb(a){let p=c({label:"update"},a).errors[0];if(p)throw Error(p)}async function Xb(a,p=Xn){let v=await g2(a,p),b=la($r(a),"installed-plugins");return{targets:sa([...v.hooks.filter((j)=>j.platform!=="copilot-cli"&&j.detected).map((j)=>j.platform),...[jo,Hp,Up].flatMap((j)=>da(la(b,...j))?["copilot-cli"]:[]),...To(a,ua)?["claude-code"]:[],...pa(v.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:v.codexPluginListOutput}}async function Qb(a){let p=l(),v=a.output??process.stdout,b=(a.scriptPath??process.argv[1]??"").split(/[\\/]/),k=b.find((he)=>/^bunx-\d+-/.test(he)),j=k!==void 0||b.includes("_npx")?null:(a.checkLatestVersion??_n)(),F=async()=>{let he=j&&await j;if(he?.updateAvailable)v.write(`
Update available: cc-safety-net ${he.currentVersion} → ${he.latestVersion}. Update this CLI with your package manager, e.g. \`npm i -g cc-safety-net@latest\` for a global install.
`)},W=Xb(p,a.fetchVersion??Xn).then(async(he)=>{let be=new Set(he.targets);return{targets:he.targets,codexPluginListOutput:he.codexPluginListOutput,available:new Map(await Promise.all(un.filter((ve)=>be.has(ve.target)&&i2.has(ve.target)).map(async(ve)=>[ve.target,await ia(ve.probeCommand)])))}}),K=await Pr(a.showBanner??!0,()=>({ready:W,finish:()=>W}),()=>Cr({input:a.input??process.stdin,output:v}),{loadingMessage:"Checking installed integrations…",output:v}),se=await Promise.resolve().then(()=>(Hm(p.tmpdir,process.platform,k),null)).catch((he)=>Ur(he));if(K.targets.length===0){if(v.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),se!==null)console.error(se);return await F(),se===null?0:1}let ie=K.targets.some((he)=>a2.has(he))?await Promise.resolve().then(()=>(rs(p),null)).catch((he)=>Ur(he)):null,ae=await Ro(Promise.all(K.targets.map((he)=>{if(i2.has(he)&&!K.available.get(he))return Promise.resolve({message:`${d(he)} not found; skipped`,failed:!1});if(ie!==null&&a2.has(he))return Promise.resolve({message:ie,failed:!0});return h2("install",he,p,!0,K.codexPluginListOutput).then((be)=>({message:be,failed:!1}),(be)=>({message:Ur(be),failed:!0}))})),{loadingMessage:`Updating ${K.targets.length} integration${K.targets.length===1?"":"s"}…`,output:v}),le=se===null?ae:[...ae,{message:se,failed:!0}];return le.forEach((he)=>{he.failed?console.error(he.message):v.write(`${he.message}
`)}),await F(),le.some((he)=>he.failed)?1:0}function fa(a,p={}){return Promise.resolve().then(()=>Yb(a)).then(()=>Qb(p)).catch((v)=>(console.error(Ur(v)),1))}async function Hr(a,p,v={}){try{let b=l(),k=await Pr(!0,()=>Gb(b,a,p,v),()=>Cr({input:v.input??process.stdin,output:v.output??process.stdout}),{loadingMessage:a==="install"?"Checking available integrations…":"Checking installed integrations…",output:v.output??process.stdout});if(!k)return(v.output??process.stdout).write(`Cancelled: nothing was ${a}ed.
`),0;if(k==="update")return(v.runUpdate??(()=>fa([],{fetchVersion:v.fetchVersion,input:v.input,output:v.output,showBanner:!1})))();let j=v.output??process.stdout;return await Zm(k,async(F)=>{if(F==="kimi-code"&&a==="install"){let K=await Kb(v,b);if(K===null){j.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(K==="plugin"){j.write(`${Wb(b)}
`);return}}let W=await Ro(h2(a,F,b),{loadingMessage:`${a==="install"?"Installing":"Uninstalling"} ${d(F)} integration…`,output:j});j.write(`${W}
`)}),0}catch(b){return console.error(Ur(b)),1}}function Ur(a){let p=a instanceof Error?a.message:String(a),v=typeof a==="object"&&a!==null&&"code"in a?a.code:null;if(v==="EACCES"||v==="EPERM")return`${p}
Check file permissions for the target config file and parent directory.`;if(v==="ENOENT")return`${p}
Check that the target config path and parent directory exist.`;if(v==="ENOTDIR")return`${p}
Check that every parent path component is a directory.`;return p}import{mkdirSync as sL}from"node:fs";import{dirname as iL}from"node:path";import{createInterface as aL}from"node:readline";import{existsSync as v2,readFileSync as eL}from"node:fs";function y2(a,p){return{"safety.level":a.safety.level,...ma("safety.overrides",a.safety.overrides),"workflow.worktree_mode":String(a.workflow.worktree_mode),"destructive_command_protection.enabled":String(a.destructive_command_protection.enabled),...ma("destructive_command_protection.overrides",a.destructive_command_protection.overrides),"destructive_command_protection.allow_paths":ga(a.destructive_command_protection.allow_paths),"secret_protection.enabled":String(a.secret_protection.enabled),...ma("secret_protection.overrides",a.secret_protection.overrides),"secret_protection.deny_paths":ga(a.secret_protection.deny_paths),"secret_protection.allow_paths":ga(a.secret_protection.allow_paths),...p?{"audit.retention_days":String(a.audit.retention_days)}:{}}}function ss(a,p,v){let b=y2(a,v),k=y2(p,v);return[...new Set([...Object.keys(b),...Object.keys(k)])].flatMap((j)=>b[j]===k[j]?[]:[{field:j,before:b[j],after:k[j]}])}function Zr(a,p){let v=h(a,p);if(!v2(v))return{baseline:x(globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__,a.home),diagnostics:[]};let b=qn(v);return{baseline:x(b.value,a.home),diagnostics:b.errors.length>0?b.errors:Yt(b.value,a.home)}}function qn(a){if(!v2(a))return{errors:[`${a}: file not found`]};try{return{value:JSON.parse(eL(a,"utf-8")),errors:[]}}catch(p){let v=p instanceof Error?p.message:String(p);return{errors:[`${a}: ${p instanceof SyntaxError?`Invalid JSON: ${v}`:v}`]}}}function is(a,p){let v=tL(a)?a:{};return{version:p.version,...Object.fromEntries(["safety","workflow","destructive_command_protection","secret_protection"].filter((b)=>v[b]!==void 0).map((b)=>[b,v[b]]))}}function ma(a,p){return Object.fromEntries(Object.entries(p).flatMap(([v,b])=>b===void 0?[]:[[`${a}.${v}`,String(b)]]))}function ga(a){return a.length===0?"(none)":a.join(", ")}function tL(a){return!!a&&typeof a==="object"&&!Array.isArray(a)}import{chmodSync as nL,existsSync as b2,mkdirSync as rL,readFileSync as L2}from"node:fs";import{dirname as oL}from"node:path";function w2(a,p={}){let v=h(a,p);if(!b2(v))return{path:v,exists:!1,raw:"",policy:te(),errors:[]};let b=L2(v,"utf-8");if(!b.trim())return{path:v,exists:!0,raw:b,policy:te(),errors:["Config file is empty"]};try{let k=JSON.parse(b),j=Yt(k,a.home);return{path:v,exists:!0,raw:b,policy:x(k,a.home),errors:j}}catch(k){return{path:v,exists:!0,raw:b,policy:te(),errors:[`Invalid JSON: ${k instanceof Error?k.message:String(k)}`]}}}function gn(a,p,v={}){let b=h(a,v),k=Yt(p,a.home),j=k.length>0?te():x(p,a.home);if(k.length>0)return{path:b,policy:j,errors:k};return rL(oL(b),{recursive:!0,mode:448}),C(B(b),`${JSON.stringify(j,null,2)}
`,384),nL(b,384),{path:b,policy:j,errors:[]}}function x2(a,p){let v=Yt(p,a.home);if(v.length>0)return{errors:v};return{preview:Qe(x(p,a.home),a.env),errors:[]}}function k2(a,p={}){let v=h(a,p);if(!b2(v))return gn(a,me,p);let b=L2(v,"utf-8");if(!b.trim())return gn(a,me,p);try{return gn(a,x(JSON.parse(b),a.home),p)}catch{return gn(a,me,p)}}var _2=new Set(["check","apply"]),S2="(unset)";async function P2(a,p,v={}){let b=c({label:"policy",booleans:{global:["-g","--global"]},positionals:"list"},p),k=b.positionals[0],j=[...b.errors,...k&&!_2.has(k)?[`Unknown policy subcommand: ${k}`]:[],...k&&_2.has(k)&&!b.positionals[1]?[`policy ${k} requires a file`]:[],...b.positionals.slice(2).map((be)=>`Unexpected policy argument: ${be}`)];if(j.length>0){for(let be of j)console.error(be);return 1}let F=b.positionals[1];if(!k||!F)return ir(Jr,console.error),1;let W=b.flags.global?h(a):E(v.cwd??process.cwd()),K=qn(F),se=[...K.errors,...Yt(K.value,a.home).map((be)=>`${F}: ${be}`),...!b.flags.global&&uL(K.value)&&K.value.audit!==void 0?[`${F}: audit settings are user scope only; remove the audit section from a project proposal`]:[]];if(se.length>0){for(let be of se)console.error(be);return 1}let ie=x(K.value,a.home);if(console.log(`Scope: ${b.flags.global?"user":"project"} (${W})`),console.log(`Proposal: ${F}`),b.flags.global)C2(x(qn(W).value,a.home),ie,!0);if(!b.flags.global){let be=Zr(a).baseline;console.log("Effective policy (user + project merged):"),C2(fe(be,Ce(qn(W).value,a.home).policy).policy,fe(be,Ce(K.value,a.home).policy).policy,!1)}if(k==="check")return 0;let ae=v.input??process.stdin,le=v.output??process.stdout;if(!ae.isTTY||!le.isTTY)return console.error("policy apply confirms interactively; run this yourself in a terminal:"),console.error(`  cc-safety-net policy apply ${F}${b.flags.global?" --global":""}`),1;if(!await cL(`Apply this policy to ${W}? [y/N] `,ae,le))return console.log("Cancelled; nothing was written."),0;return lL(a,W,K.value,ie,b.flags.global),console.log(`Policy applied: ${W}`),0}function cL(a,p,v){let b=aL({input:p,output:v,terminal:!1});return new Promise((k)=>{b.once("close",()=>k(!1)),b.question(a,(j)=>{k(/^y(es)?$/i.test(j.trim())),b.close()})})}function lL(a,p,v,b,k){if(k){gn(a,b);return}sL(iL(p),{recursive:!0}),Gt(p,is(v,b))}function C2(a,p,v){let b=ss(a,p,v);if(b.length===0){console.log("No changes.");return}console.log(`Changes (${b.length}):`);for(let k of b)console.log(`  ${k.field}: ${k.before??S2} -> ${k.after??S2}`)}function uL(a){return!!a&&typeof a==="object"&&!Array.isArray(a)}import{join as _w}from"node:path";var $2="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Priority |\n|-------|-------------|---------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | Second |\n| GitHub source | Listed in a local `rule.json` | Vendored into the consumer's `<rulebook-name>/rulebook.json` by `rule add` | Source order |\n\nEvery rulebook is a live file: the runtime reads it on each tool call, so an edit applies to the next command with no publishing step.\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule verify` reports the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- Transparent wrappers have no built-in defaults. Configure only wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- Run `cc-safety-net rule add owner/repo` to add every rulebook currently present on the repository's default branch.\n- Use `--only` to select one or more rulebooks while preserving their order: `cc-safety-net rule add owner/repo --only aws gcloud`.\n- Use `--ref` to select a branch, tag, or commit instead of the default branch: `cc-safety-net rule add owner/repo --ref v2 --only aws`.\n- GitHub sources are stored in canonical form as `owner/repo#ref/<rulebook-name>`. That form remains valid in `rule.json` and as direct CLI input.\n- GitHub refs may contain `/`-separated path segments, such as `feature/rulebook-v2`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` or `2` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Rule Fields (`rulebook_version` 2)\n\nVersion 2 replaces `subcommand` and `block_args` with an exact-token `match` object. Version 1 rulebooks keep their fields and their behavior; a client that does not support version 2 rejects the rulebook instead of applying broader version 1 semantics.\n\n```json\n{\n  \"name\": \"block-terraform-apply-destroy\",\n  \"command\": \"terraform\",\n  \"match\": {\n    \"command_path\": [\"apply\"],\n    \"any_args\": [\"-destroy\", \"--destroy\"]\n  },\n  \"reason\": \"Review a destroy plan first with 'terraform plan -destroy'.\",\n  \"intent\": \"use_alternative\"\n}\n```\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Same as version 1 |\n| `command` | Yes | Same as version 1 |\n| `match.command_path` | Yes | Non-empty array of non-empty command words |\n| `match.any_args` | No | Non-empty array of unique non-empty argument tokens |\n| `match.exclude_args` | No | Non-empty array of unique non-empty argument tokens |\n| `intent` | No | Same as version 1 |\n| `reason` | Yes | Same as version 1 |\n\n### Matching Behavior (`rulebook_version` 2)\n\n- **Command**: Normalized to lowercase basename, as in version 1.\n- **Command path**: After recognized global options and their values are skipped, the next command words must equal `command_path` exactly. AWS, gcloud, and Azure CLI value-taking global options are built in; Terraform's `-chdir=dir` is `=`-joined and is skipped with its own token.\n- **Unrecognized options**: A token starting with `-` that is not a recognized global option is skipped without consuming a value, so an unlisted value-taking option with a separate value (`--newflag value`) makes the rule miss. This fails open deliberately; document such gaps in the rulebook.\n- **`any_args`**: At least one listed token must appear literally among the arguments.\n- **`exclude_args`**: Any listed token appearing literally among the arguments prevents the match, which is how a safe preview such as `aws s3 rm --dryrun` stays allowed.\n- **No short-option expansion**: Arguments compare as exact tokens, so list every accepted spelling (`\"-destroy\"` and `\"--destroy\"`).\n- **Literal and case-sensitive**: No regex, glob, or substring matching. The first matching rule wins.\n- Release channels are separate rules: `gcloud beta compute instances delete` needs its own `command_path`.\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Version 1 fixtures are shape-validated only. Version 2 fixtures are evaluated against the rulebook's own rules when a source is fetched by `rule add` or `rule update`, and by `rule verify`; a failing fixture rejects that source before it is written. Loading a rulebook does not re-evaluate fixtures. CC Safety Net never executes fixture commands; they are analyzer inputs only.\n\n## Matching Behavior\n\nThe subcommand, argument, and option rules below describe `rulebook_version` 1 rules; version 2 rules match as described in Matching Behavior (`rulebook_version` 2). Execution order and transparent wrappers apply to both.\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; add `--only <rulebook...>` or `--ref <ref>` for repository selection. The command adds the selected sources and syncs them.\n5. Edit a local rulebook whenever you like: the edit is enforced on the next command, so there is nothing to run afterwards.\n6. Run `cc-safety-net rule update [source]` to re-fetch remote sources and rewrite the vendored copies; the command prints what changed. A source with an ordinary update failure keeps its vendored copy while the other selected sources still update. Resource-limit failures remain fatal for the whole update.\n7. Run `cc-safety-net rule verify` to validate config, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n8. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nA missing or invalid rulebook file makes that source inactive, and an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Fix the file named in the diagnostic, or run `cc-safety-net rule update` when a remote source has not been vendored yet. Run `cc-safety-net status` to see degraded sources.\n";function as(a,p){if(!a.ok){T2(a);return}D2(a,p)}function R2(a,p,v){if(a.ok)console.log(v);if(!a.add){as(a,`Added rulebook source: ${p}`);return}if(!a.ok){T2(a);return}if(a.add.added.length>0)console.log(`Added ${a.add.added.length} ${a.add.added.length===1?"rulebook":"rulebooks"} from ${a.add.source} at ${a.add.ref}:`),a.add.added.forEach((b)=>{console.log(`  - ${b}`)});if(a.add.alreadyConfigured.length>0)console.log(`Rulebooks already configured from ${a.add.source} at ${a.add.ref}: ${a.add.alreadyConfigured.join(", ")}`);if(a.add.commits.length>0)console.log(`Vendored at ${a.add.commits.map((b)=>b.slice(0,7)).join(", ")}.`);D2(a,"Rule config updated.")}function D2(a,p){for(let v of a.changes??[])console.log(v);console.log(p),console.log(""),dL(a.entries)}function dL(a){if(a.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${a.length}):`);for(let p of a)console.log(`  - ${p.name} ${p.version} (${pL(p.ruleCount)})`),console.log(`    Source: ${p.spec}`)}function pL(a){return`${a} ${a===1?"rule":"rules"}`}function A2(a){Vn("Active sources",a.rulebooks,(p)=>[`[${p.source}] ${p.name} ${p.version}`,`  Source: ${p.spec}`]),Vn("Active rules",a.rules,(p)=>[`[${mL(a,p.name)}] ${p.name}`,...fL(p),`  Reason: ${p.reason}`]),Vn("Disabled rules",E2(a,"off"),(p)=>[p.key]),Vn("Reason overrides",E2(a,"reason"),(p)=>[p.key,`  Reason: ${p.value.reason}`]),Vn("Transparent wrappers",a.transparent_wrappers,(p)=>[p]),Vn("Issues",a.errors,(p)=>[p]),Vn("Warnings",a.warnings,(p)=>[p])}function Vn(a,p,v){if(p.length===0){console.log(`${a}: (none)`);return}console.log(`${a} (${p.length}):`);for(let b of p){let[k,...j]=v(b);console.log(`  - ${k}`);for(let F of j)console.log(`    ${F}`)}}function fL(a){if(!a.match)return[`  Command: ${a.subcommand?`${a.command} ${a.subcommand}`:a.command}`,`  Block args: ${a.block_args.join(", ")}`];return[`  Command: ${[a.command,...a.match.command_path].join(" ")}`,...a.match.any_args?[`  Any args: ${a.match.any_args.join(", ")}`]:[],...a.match.exclude_args?[`  Exclude args: ${a.match.exclude_args.join(", ")}`]:[]]}function mL(a,p){return a.rulebooks.find((v)=>v.rules.includes(p))?.source??"project"}function E2(a,p){return Object.entries({...a.userConfig?.overrides??{},...a.projectConfig?.overrides??{}}).filter((v)=>{if(p==="off")return v[1]==="off";return!!v[1]&&typeof v[1]==="object"}).map(([v,b])=>({key:v,value:b}))}function T2(a){for(let p of a.errors)console.error(p)}import{dirname as ng,join as gs}from"node:path";import{join as wa,resolve as CL}from"node:path";function ha(a){let p=w(a);if(p.errors.length>0)return{ok:!1,result:{ok:!1,errors:p.errors,entries:[]}};return{ok:!0,config:p.config??_t}}function I2(a,p=[]){Gt(a,{version:1,rules:p,overrides:{},transparent_wrappers:[]})}function O2(a,p="project-rules"){Gt(a,{rulebook_version:1,name:p,version:"1.0.0",description:p==="project-rules"?"Project-specific CC Safety Net rules.":"User-specific CC Safety Net rules.",author:p==="project-rules"?"project":"user",allowed_commands:["docker"],rules:[{name:"block-docker-system-prune",command:"docker",subcommand:"system",block_args:["prune"],reason:"Use targeted cleanup instead."}],tests:[{command:"docker system prune",expect:"blocked",rule:"block-docker-system-prune"}]})}import{dirname as ds}from"node:path";var gL="custom.";function cs(a){if(a.rulebook_version!==2)return[];let p=a.rules.map((v)=>({name:v.name,command:v.command,block_args:[],match:v.match,reason:v.reason,intent:v.intent}));return(a.tests??[]).flatMap((v,b)=>{let k=ya(S(v.command));if(k.length===0)return[`tests[${b}]: could not parse fixture command: ${v.command}`];let j=k.reduce((F,W)=>F??y(W,p)?.id.slice(gL.length),void 0);if(v.expect==="blocked"){if(j===v.rule)return[];let F=j?`"${j}" matched first`:"no rule matched";return[`tests[${b}]: expected "${v.rule}" to block "${v.command}" but ${F}`]}return j?[`tests[${b}]: expected "${v.command}" to be allowed but "${j}" matched`]:[]})}function ya(a){return a.nodes.flatMap((p)=>{if(p.kind==="group"||p.kind==="function")return ya(p.body);if(p.kind!=="command")return[];let v=Oe(ge(p.dialect,p.words)).words.map(e);return[...v.length>0?[v]:[],...p.nested.flatMap((b)=>ya(b))]})}var va="Rule synchronization exceeds CC Safety Net's safe resource limits.",ls=Object.freeze({maxSources:O,concurrency:4,maxRequests:131,maxResponseBytes:67108864});function us(a={}){return{requests:0,responseBytes:0,maxRequests:a.maxRequests??ls.maxRequests,maxResponseBytes:a.maxResponseBytes??ls.maxResponseBytes}}function hn(a){return{controller:new AbortController,budget:us(),resolveUrl:a}}function j2(a){return a instanceof Error&&a.message===va}function N2(a){if(a.requests>=a.maxRequests)throw Error(va);a.requests++}function z2(a,p){if(p>a.maxResponseBytes-a.responseBytes)throw a.responseBytes+=p,Error(va);a.responseBytes+=p}var U2=Object.freeze({timeoutMs:15000,metadataBytes:524288,commitBytes:262144,treeBytes:16777216,rawBytes:4194304});async function F2(a,p,v=A(ds(ds(p)),"rules policy"),b=hn()){if(T(a))return bL(a,b);return vL(a,p,v)}async function H2(a,p,v,b,k,j){if(!T(a))return F2(a,p,v,b);let F=k?null:hL(a,p,v);if(F)return F;if(!k&&!j)throw Error(`${a} is not vendored; run rule update ${a} to vendor it`);return F2(a,p,v,b)}function hL(a,p,v=A(ds(ds(p)),"rules policy")){let b=V(a),k=Z(p,b.name),j=r(i(v,k));if(j===null)return null;let F=xe(ba(j,`Invalid rulebook ${k}.`));if(F.name!==b.name)throw Error(`rulebook name "${F.name}" in ${k} must match "${b.name}"`);return{spec:a,rulebook:F,content:j}}async function Z2(a,p={}){if(!ue(a))throw Error(`Invalid GitHub repository source: ${a}`);let[v,b]=a.split("/");if(!v||!b)throw Error(`Invalid GitHub repository source: ${a}`);if(p.ref!==void 0&&!we(p.ref))throw Error(`GitHub rulebook refs must use valid path segments: ${p.ref}`);let k=p.operation??hn(),j=p.ref??await yL(v,b,a,k),F=await B2(v,b,j,a,k),W=await ps(`https://api.github.com/repos/${v}/${b}/git/trees/${F}?recursive=1`,"tree",k),K=W.response;if(!K.ok)throw Error(`Failed to inspect ${a}: GitHub tree returned ${K.status}`);let se=JSON.parse(W.content);if(!Array.isArray(se?.tree))throw Error(`Failed to inspect ${a}: unexpected GitHub tree response`);let ie=se.tree,ae=[...new Set(ie.flatMap((le)=>{if(!le||typeof le!=="object")return[];let he=le;if(he.type!=="blob"||typeof he.path!=="string")return[];let be=he.path.match(St);return be?.[1]?[be[1]]:[]}))].sort();if(ae.length===0)throw Error(`No rulebooks found in ${a} under ${Ee}/`);return{source:a,owner:v,repo:b,ref:j,commit:F,names:ae}}async function yL(a,p,v,b){let k=await ps(`https://api.github.com/repos/${a}/${p}`,"metadata",b),j=k.response;if(!j.ok)throw Error(`Failed to inspect ${v}: GitHub returned ${j.status}`);let W=JSON.parse(k.content)?.default_branch;if(typeof W!=="string"||W==="")throw Error(`Failed to inspect ${v}: missing default branch`);if(!we(W))throw Error(`GitHub returned an invalid default branch: ${W}`);return W}function vL(a,p,v){kt(a);let b=Z(p,a),k=r(i(v,b));if(k===null)throw Error(`Rulebook source not found: ${a}`);let j=G2(ba(k,"Invalid local rulebook source."));if(j.name!==a)throw Error(`rulebook name "${j.name}" must match local source "${a}"`);return{spec:a,rulebook:j,content:k}}async function bL(a,p){let v=V(a),b=await B2(v.owner,v.repo,v.ref,a,p),k=await ps(`https://raw.githubusercontent.com/${v.owner}/${v.repo}/${b}/${v.path}`,"raw",p),j=k.response;if(!j.ok)throw Error(`Failed to fetch ${a}: GitHub raw returned ${j.status}`);let F=k.content,W=G2(ba(F,"Invalid GitHub rulebook response."));if(W.name!==v.name)throw Error(`rulebook name "${W.name}" must match GitHub source "${v.name}"`);return{spec:a,rulebook:W,content:F}}function G2(a){let p=xe(a),v=cs(p);if(v.length>0)throw Error(v.join("; "));return p}function ba(a,p){try{return JSON.parse(a)}catch{throw Error(p)}}async function B2(a,p,v,b,k){let j=await ps(`https://api.github.com/repos/${a}/${p}/commits/${encodeURIComponent(v)}`,"commit",k),F=j.response;if(!F.ok)throw Error(`Failed to resolve ${b}: GitHub returned ${F.status}`);let W=JSON.parse(j.content);if(typeof W?.sha!=="string"||W.sha==="")throw Error(`Failed to resolve commit for ${b}`);return W.sha}async function LL(a,p,v={}){if(v.signal?.aborted)throw v.signal.reason;let b=v.budget??us(),k=new AbortController,j=()=>k.abort(v.signal?.reason);v.signal?.addEventListener("abort",j,{once:!0});let F=!1,W=setTimeout(()=>{if(k.signal.aborted)return;F=!0,k.abort()},v.timeoutMs??U2.timeoutMs);try{if(v.signal?.aborted)throw v.signal.reason;N2(b);let K=await(v.fetch??fetch)(a,{signal:k.signal,redirect:"error"});if(!K.ok)return q2(K),{response:K,content:""};return{response:K,content:await wL(K,p,b,()=>k.abort())}}catch(K){if(F)throw Error("GitHub request timed out",{cause:K});if(v.signal?.aborted)throw v.signal.reason;throw K}finally{clearTimeout(W),v.signal?.removeEventListener("abort",j)}}function ps(a,p,v){return LL(v.resolveUrl?.(a)??a,p,{budget:v.budget,signal:v.controller.signal})}async function wL(a,p,v=us(),b){let k=U2[`${p}Bytes`],j=Number(a.headers.get("content-length"));if(Number.isFinite(j)&&j>k)throw q2(a),Error(`GitHub ${p} response exceeds ${k} bytes`);if(!a.body)return"";let F=a.body.getReader(),W=[],K=0;while(!0){let se=await F.read();if(se.done)break;try{z2(v,se.value.byteLength)}catch(ie){throw b?.(),M2(F),ie}if(K+=se.value.byteLength,K>k)throw b?.(),M2(F),Error(`GitHub ${p} response exceeds ${k} bytes`);W.push(Buffer.from(se.value))}return Buffer.concat(W,K).toString("utf-8")}function q2(a){if(!a.body)return;V2(()=>a.body?.cancel())}function M2(a){V2(()=>a.cancel())}function V2(a){try{Promise.resolve(a()).catch(()=>{})}catch{}}var xL=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#(.+)$/;function J2(a,p){let v=Y2(a.rules,p);if(v.length>0)return{ok:!0,specs:v};return K2(a.rules,p)}function W2(a,p){let v=Y2(a,p);if(v.length>0)return{ok:!0,specs:v};let b=_L(a,p);if(b.length>0)return{ok:!0,specs:b};let k=SL(a,p);if(!k.ok)return k;if(k.specs.length>0)return{ok:!0,specs:k.specs};return K2(a,p)}function K2(a,p){let v=a.filter((b)=>La(b)?.name===p);if(v.length===1)return{ok:!0,specs:v};return kL(p,v)}function kL(a,p){return{ok:!1,result:{ok:!1,errors:p.length===0?[`No configured rulebook matches ${a}`]:[`Ambiguous rulebook match ${a}: ${p.join(", ")}`],entries:[]}}}function Y2(a,p){return a.filter((v)=>v===p)}function _L(a,p){let v=p.match(xL),b=v?.[1],k=v?.[2],j=v?.[3];if(!b||!k||!j||!we(j))return[];return X2(a,(F)=>F.owner===b&&F.repo===k&&F.ref===j)}function SL(a,p){if(!ue(p))return{ok:!0,specs:[]};let[v,b]=p.split("/"),k=X2(a,(F)=>F.owner===v&&F.repo===b);if(new Set(k.map((F)=>La(F)?.ref).filter((F)=>!!F)).size<2)return{ok:!0,specs:k};return{ok:!1,result:{ok:!1,errors:[`Multiple refs are configured for ${p}. Use an explicit ref:`,`  cc-safety-net rule remove ${p}#<ref>`],entries:[]}}}function La(a){try{return V(a)}catch{return null}}function X2(a,p){return a.filter((v)=>{let b=La(v);return b?p(b):!1})}async function ms(a,p={}){let v=xa(p);return PL(a,v,await fs(a,v,hn()))}function PL(a,p,v){if(!v.ok)return v;let b=Bt(a,p),k=[...new Set(X(b.configPath,b.filesystemScope))];if(k.length===0)return v;return{ok:!1,errors:k,entries:v.entries}}async function fs(a,p,v,b={},k=new Set,j=new Set){try{let F=Bt(a,p),W=ha(F.configTarget);if(!W.ok)return W.result;let K=W.config;if(p.check)return ZL(K,F,p);let se=p.only?J2(K,p.only):{ok:!0,specs:K.rules};if(!se.ok)return se.result;let ie=new Set([...p.refresh?se.specs:[],...k]),ae=(Ke)=>H2(Ke,F.configDir,F.filesystemScope,v,ie.has(Ke),!p.refresh||ie.has(Ke)),le=await zL(K.rules,p.refresh?(Ke)=>ae(Ke).then((At)=>({ok:!0,item:At})).catch((At)=>{if(j2(At))throw At;return{ok:!1,spec:Ke,message:At instanceof Error?At.message:String(At)}}):async(Ke)=>({ok:!0,item:await ae(Ke)}),v),he=le.filter((Ke)=>!Ke.ok),be=le.filter((Ke)=>Ke.ok).map((Ke)=>Ke.item),ve=be.flatMap((Ke)=>$L(Ke,K.rules)),ke=be.flatMap((Ke)=>EL(Ke,j,F)),qe=new Set([...ve,...ke].map((Ke)=>Ke.spec)),Ze=[...he,...ve,...ke],De=[],Pt=DL(De,()=>be.flatMap((Ke)=>qe.has(Ke.spec)||Ze.length>0&&j.has(Ke.spec)?[]:RL(Ke,F,b,De)));return{ok:Ze.length===0,errors:Ze.map((Ke)=>`Failed to update ${Ke.spec}: ${Ke.message}`),entries:be.map(TL),changes:Pt}}catch(F){return Br(F)}}function $L(a,p){if(!T(a.spec))return[];let v=Xe(a.spec),b=p.filter((k)=>k!==a.spec&&Xe(k).toLowerCase()===v.toLowerCase());if(b.length===0)return[];return[{ok:!1,spec:a.spec,message:`rulebook name "${v}" is also claimed by ${b.join(", ")}; rename one of them`}]}function EL(a,p,v){if(!p.has(a.spec)||!T(a.spec))return[];let b=Z(v.configDir,a.rulebook.name),k=r(i(v.filesystemScope,b));if(k===null||k===a.content)return[];return[{ok:!1,spec:a.spec,message:`${b} already exists and no configured source claims it; remove or rename the file, then re-run rule add`}]}function RL(a,p,v,b){if(!T(a.spec))return[];let k=Z(p.configDir,a.rulebook.name),j=i(p.filesystemScope,k),F=r(j);if(F===a.content)return[];return b?.push({target:j,previous:F}),C(j,a.content,void 0,v._testAfterPolicyRename),AL(a,F)}function DL(a,p){try{return p()}catch(v){for(let b of[...a].reverse()){if(b.previous===null){J(b.target);continue}C(b.target,b.previous)}throw v}}function AL(a,p){if(p===null)return[`Vendored ${a.spec} (${a.rulebook.version})`];let v=Ae(p),b="problem"in v?null:v.rulebook,k=new Map(b?.rules.map((F)=>[F.name,JSON.stringify(F)])??[]),j=new Set(a.rulebook.rules.map((F)=>F.name));return[`Updated ${a.spec} (${b?.version??"unreadable"} -> ${a.rulebook.version})`,...[...j].filter((F)=>!k.has(F)).map((F)=>`  + ${F}`),...[...k.keys()].filter((F)=>!j.has(F)).map((F)=>`  - ${F}`),...a.rulebook.rules.filter((F)=>{let W=k.get(F.name);return W!==void 0&&W!==JSON.stringify(F)}).map((F)=>`  ~ ${F.name}`)]}function TL(a){return{spec:a.spec,name:a.rulebook.name,version:a.rulebook.version,ruleCount:a.rulebook.rules.length}}async function Q2(a,p,v={}){return IL(a,p,ML(v),hn())}async function IL(a,p,v,b,k={}){let j=null,F=!1;try{let W=Bt(a,v),K=r(W.configTarget);j={target:W.configTarget,content:K};let se=ha(W.configTarget);if(!se.ok)return se.result;let ie=se.config,ae=ue(p);OL(p,v,ae);let le=ae?await Z2(p,{ref:v.ref,operation:b}):null,he=le?jL(le,v.rulebooks):[],be=le?he.map((De)=>NL(ie.rules,le,De)??`${p}#${le.ref}/${De}`):[p],ve=be.filter((De)=>!ie.rules.includes(De)),ke=[...ie.rules,...ve];if(ke.length>O)return FL();if(ke.length!==ie.rules.length)F=!0,Gt(W.configTarget,{version:1,rules:ke,overrides:ie.overrides??{},transparent_wrappers:ie.transparent_wrappers??[]},void 0,k._testAfterPolicyRename);let qe=await fs(a,v,b,k,new Set(ve),new Set(ve));if(!qe.ok)Gr(W.configTarget,K);if(!qe.ok||!le)return qe;let Ze=he.filter((De,Pt)=>ve.includes(be[Pt]??""));return{...qe,add:{source:p,ref:le.ref,selected:he,added:Ze,alreadyConfigured:he.filter((De)=>!Ze.includes(De)),commits:ve.length>0?[le.commit]:[]}}}catch(W){if(F&&j)try{Gr(j.target,j.content)}catch(K){return Br(K)}return Br(W)}}function OL(a,p,v){if(!v&&p.rulebooks!==void 0)throw Error("--only can only select rulebooks from an owner/repo source");if(!v&&p.ref)throw Error(`--ref can only select a ref for an owner/repo source: ${a}`);if(p.rulebooks?.length===0)throw Error("--only requires at least one rulebook name");let b=p.rulebooks?.filter((k)=>!g.test(k))??[];if(b.length>0)throw Error(`Invalid rulebook names: ${b.join(", ")}`)}function jL(a,p){let v=p?[...new Set(p)]:a.names,b=v.filter((k)=>!a.names.includes(k));if(b.length>0)throw Error(`Rulebooks not found in ${a.source} at ${a.ref}: ${b.join(", ")}
Available rulebooks: ${a.names.join(", ")}`);return v}function NL(a,p,v){let b=`${p.source}#${p.ref}/${v}`;if(a.includes(b))return b;let k=`${p.source}#${p.commit}/${v}`;return a.find((j)=>j===k)}async function zL(a,p,v=hn()){if(a.length>O)throw Error(de);let b=Array(a.length),k=0,j,F=Array.from({length:Math.min(a.length,ls.concurrency)},async()=>{while(!j){let W=k;if(W>=a.length)return;k++;try{b[W]=await p(a[W],W,v.controller.signal)}catch(K){if(!j)j={value:K},k=a.length,v.controller.abort(K);return}}});if(await Promise.all(F),j)throw j.value;return b}function FL(){return{ok:!1,errors:[de],entries:[]}}function xa(a){return{cwd:a.cwd,userConfigDir:a.userConfigDir,userConfigPath:a.userConfigPath,projectConfigPath:a.projectConfigPath,global:a.global,check:a.check,only:a.only,refresh:a.refresh}}function ML(a){return{...xa(a),ref:a.ref,rulebooks:a.rulebooks}}function UL(a){return{...xa(a),deleteSource:a.deleteSource}}async function eg(a,p,v={}){try{return await HL(a,p,UL(v),{})}catch(b){return Br(b)}}async function HL(a,p,v,b){let k=Bt(a,v),j=w(k.configTarget);if(j.errors.length>0)return{ok:!1,errors:j.errors,entries:[]};if(!j.config)return{ok:!1,errors:[`No config found at ${k.configPath}`],entries:[]};let F=W2(j.config.rules,p);if(!F.ok)return F.result;let W=v.deleteSource?GL(k.configDir,F.specs,k.filesystemScope):{ok:!0,dirs:[]};if(!W.ok)return W.result;let K=r(k.configTarget);if(K===null)return Br(Error("Rules config is unavailable."));try{Gt(k.configTarget,{version:1,rules:j.config.rules.filter((ae)=>!F.specs.includes(ae)),overrides:j.config.overrides??{},transparent_wrappers:j.config.transparent_wrappers??[]},void 0,b._testAfterPolicyRename)}catch(ae){throw Gr(k.configTarget,K),ae}let se=await fs(a,v,hn(),b);if(!se.ok)return Gr(k.configTarget,K),se;let ie=BL(W.dirs,b,k.filesystemScope);if(!ie.ok){Gr(k.configTarget,K);let ae=await fs(a,v,hn(),b);if(!ae.ok)return{ok:!1,errors:[...ie.result.errors,...ae.errors],entries:ae.entries};return ie.result}return se}async function ZL(a,p,v){let b=Fe(a,p.configDir,v.global?"user":"project",p.filesystemScope);return{ok:b.errors.length===0&&b.warnings.length===0,errors:[...b.errors,...b.warnings],entries:b.entries}}function GL(a,p,v){let b=p.flatMap((W)=>g.test(W)?[]:["--delete-source can only delete local rulebook sources"]),k=p.map((W)=>wa(a,W)),j=b.length>0?[]:k.flatMap((W)=>tg(W,v)),F=[...b,...j];return F.length>0?{ok:!1,result:{ok:!1,errors:F,entries:[]}}:{ok:!0,dirs:k}}function tg(a,p){let v=CL(a),b=i(p,v),k=_e(b);if(!k)return[`Local rulebook source directory not found: ${a}`];let j=k.find((F)=>F.name==="rulebook.json");if(!j)return[`Local rulebook source directory is missing rulebook.json: ${a}`];if(j.kind!=="file")throw new o(p.label);if(r(i(p,wa(v,"rulebook.json"))),k.length>1)return[`Local rulebook source directory contains extra files: ${a}. delete manually if you really want to remove the directory.`];return[]}function BL(a,p,v){let b=a.flatMap((k)=>{try{if(!_e(i(v,k)))return[];let j=tg(k,v);if(j.length>0)return j;return qL(k,p,v),[]}catch(j){return[`Failed to delete local rulebook source ${k}: ${j instanceof Error?j.message:String(j)}`]}});return b.length>0?{ok:!1,result:{ok:!1,errors:b,entries:[]}}:{ok:!0}}function qL(a,p,v){if(p._testDeleteLocalSourceDir){p._testDeleteLocalSourceDir(a);return}J(i(v,wa(a,Le))),Ct(i(v,a))}function Gr(a,p){if(p===null){J(a);return}C(a,p)}function Br(a){return{ok:!1,errors:[a instanceof Error?a.message:String(a)],entries:[]}}var VL=".safety-net.json",JL="~/.cc-safety-net/config.json";async function sg(a,p){return[await rg(a,{legacyPath:wp({cwd:p.cwd}),configPath:G(p.cwd),defaultRulebookName:"project-rules",migratedFrom:VL,cleanup:p.cleanup,syncOptions:{cwd:p.cwd}}),await rg(a,{legacyPath:_o(a),configPath:H(a),defaultRulebookName:"user-rules",migratedFrom:JL,cleanup:p.cleanup,syncOptions:{cwd:p.cwd,global:!0}})].every((b)=>b)?0:1}async function rg(a,p){let v=Bt(a,p.syncOptions),b=i(v.filesystemScope,p.legacyPath),k=r(b);if(k===null)return console.log(`No legacy config found at ${p.legacyPath}`),!0;let j=KL(k);if(!j.ok){for(let he of j.errors)console.error(he);return!1}let F=w(v.configTarget);if(F.errors.length>0){for(let he of F.errors)console.error(he);return!1}let W=F.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},K=YL(ng(p.configPath),W.rules,p.defaultRulebookName,p.migratedFrom,v.filesystemScope),se=gs(ng(p.configPath),K,"rulebook.json"),ie=i(v.filesystemScope,se),ae=[og(v.configTarget),og(ie)],le=await WL(a,p,v.configTarget,ie,K,j.config.rules,W.rules.includes(K)?W.rules:[...W.rules,K],W.overrides??{},W.transparent_wrappers??[]);if(!le.ok){ew(ae);for(let he of le.errors)console.error(he);return!1}if(!p.cleanup)return console.log(`Migrated legacy config at ${p.legacyPath}. Legacy file is no longer used.`),!0;if(!QL(v.configTarget,ie,K,p.migratedFrom,j.config.rules))return console.error(`Migration cleanup verification failed for ${p.legacyPath}`),!1;return J(b),console.log(`Deleted legacy config at ${p.legacyPath}`),!0}async function WL(a,p,v,b,k,j,F,W,K){try{return Gt(v,{version:1,rules:F,overrides:W,transparent_wrappers:K}),Gt(b,XL(k,p.migratedFrom,j)),await ms(a,p.syncOptions)}catch(se){return{ok:!1,errors:[se instanceof Error?se.message:String(se)]}}}function KL(a){try{let p=JSON.parse(a),v=si(p);if(v.errors.length>0)return{ok:!1,errors:v.errors};return{ok:!0,config:{version:1,rules:p.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function YL(a,p,v,b,k){let j=p.find((F)=>tw(i(k,gs(a,F,"rulebook.json")))===b);if(j)return j;if(r(i(k,gs(a,v,"rulebook.json")))===null)return v;for(let F=2;;F++){let W=`${v}-${F}`;if(r(i(k,gs(a,W,"rulebook.json")))===null)return W}}function XL(a,p,v){return{rulebook_version:1,name:a,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:p,allowed_commands:[...new Set(v.map((b)=>b.command))],rules:v,tests:v.map((b)=>({command:[b.command,b.subcommand,b.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:b.name}))}}function QL(a,p,v,b,k){if(!w(a).config?.rules.includes(v))return!1;try{let F=r(p);if(F===null)return!1;let W=JSON.parse(F);return W.migrated_from===b&&JSON.stringify(W.rules)===JSON.stringify(k)}catch{return!1}}function og(a){return{target:a,content:r(a)}}function ew(a){for(let p of a){if(p.content===null){J(p.target);continue}C(p.target,p.content)}}function tw(a){let p=r(a);if(p===null)return null;try{let v=JSON.parse(p);return typeof v.migrated_from==="string"?v.migrated_from:null}catch{return null}}import{mkdir as nw,readFile as rw,writeFile as ow}from"node:fs/promises";import{dirname as sw,join as iw}from"node:path";var aw=86400000,cw=604800000;async function ag(a,p=Date.now()){if(a.env.get("CC_SAFETY_NET_NO_UPDATE_CHECK"))return null;let v=lt(a);if(!v)return null;let b=iw(v,".cc-safety-net","update-check.json"),k=await lw(b,p);if(!k.lastCheck||p-k.lastCheck>aw){let W=await _n();if(k.lastCheck=p,W.latestVersion)k.latestVersion=W.latestVersion;if(!await ig(b,k))return null;if(W.error)return null}let j=k.latestVersion,F=zt();if(!j||!di(j,F))return null;if(k.notifiedVersion===j&&k.notifiedAt!==void 0&&p-k.notifiedAt<cw)return null;if(k.notifiedVersion=j,k.notifiedAt=p,!await ig(b,k))return null;return`UPDATE_AVAILABLE: cc-safety-net v${j} is available (running v${F}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function lw(a,p){let v=await rw(a,"utf8").then((j)=>JSON.parse(j)).catch(()=>{return});if(!v||typeof v!=="object"||Array.isArray(v))return{};let b=v,k=(j)=>typeof j==="number"&&Number.isFinite(j)&&j<=p?j:void 0;return{lastCheck:k(b.lastCheck),latestVersion:typeof b.latestVersion==="string"?b.latestVersion:void 0,notifiedVersion:typeof b.notifiedVersion==="string"?b.notifiedVersion:void 0,notifiedAt:k(b.notifiedAt)}}async function ig(a,p){return nw(sw(a),{recursive:!0,mode:448}).then(()=>ow(a,JSON.stringify(p),{mode:384})).then(()=>!0).catch(()=>!1)}import{join as uw,resolve as ka}from"node:path";var cg="CC Safety Net Config",dw="═".repeat(cg.length),pw="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",fw=new Set(["rule.json","rule.lock","cache"]);function lg(a,p={}){try{return mw(a,p)}catch(v){if(v instanceof o)return console.error(v.message),1;throw v}}function mw(a,p){let v=p.cwd??process.cwd(),b=p.userConfigPath??H(a),k=p.projectConfigPath??G(v),j=p.legacyUserConfigPath??_o(a),F=p.legacyProjectConfigPath??Gd(v),W=ka(v,Ee),K=Y(a,{cwd:v,userConfigPath:b,projectConfigPath:k}),se=Y(a,{cwd:v}),ie=i(K.userScope,b),ae=i(K.projectScope,k),le=p.legacyUserConfigPath?B(p.legacyUserConfigPath,"user policy"):i(se.userScope,j),he=p.legacyProjectConfigPath?B(p.legacyProjectConfigPath,"project policy"):i(se.projectScope,F),be=!1,ve=!1,ke=[],qe=[],Ze=gw(i(se.projectScope,W));if(yw(),r(ie)!==null){let De=kn(ie);if(De.errors.push(...X(b,K.userScope)),ke.push({scope:"User",path:b,result:De,schema:"rules",target:ie}),De.errors.length>0)be=!0}if(r(le)!==null)if(ve=!0,r(ie)!==null)qe.push(hs("user","cleanup"));else{let De=ii(le);if(ke.push({scope:"User",path:j,result:De,schema:"legacy",inactive:!0,target:le}),qe.push(hs("user",De.errors.length>0?"fix-or-delete":"migrate")),De.errors.length>0)be=!0}if(r(ae)!==null){let De=kn(ae);if(De.errors.push(...X(k,K.projectScope)),ke.push({scope:"Project",path:ka(k),result:De,schema:"rules",target:ae}),De.errors.length>0)be=!0;if(r(he)!==null)ve=!0,qe.push(hs("project","cleanup"))}else if(r(he)!==null){ve=!0,be=!0;let De=ii(he);ke.push({scope:"Project",path:ka(F),result:De,schema:"legacy",inactive:!0,target:he}),qe.push(hs("project",De.errors.length>0?"fix-or-delete":"migrate"))}if(Ze?.result.errors.length)be=!0;if(ke.length===0&&!Ze)return console.log(`
No config files found. Using built-in rules only.`),0;for(let De of ke)if(De.inactive)bw(De.scope,De.path,De.result);else if(De.result.errors.length>0)Lw(De.scope,De.path,De.result.errors);else{if(De.schema==="rules"&&kw(De.target))console.log(`
Added $schema to ${De.scope.toLowerCase()} config.`);vw(De.scope,De.path,De.result,De.schema)}for(let De of qe)console.error(`
${et.red(De)}`);if(Ze)if(Ze.result.errors.length>0)xw(Ze.path,Ze.result.errors);else ww(Ze.path,Ze.result);if(be)return console.error(`
Config validation failed.`),1;return console.log(ve?`
Configs valid with warnings.`:`
All configs valid.`),0}function hs(a,p){let v=`legacy ${a} config`;if(p==="cleanup")return`Warning: Legacy ${a} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(p==="migrate")return`Warning: Legacy ${a} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${a} config is no longer supported. Fix or delete the ${v}, then run \`npx -y cc-safety-net rule migrate\`.`}function gw(a){if(_e(a)===null)return null;let p=hw(a);if(p.ruleNames.size===0&&p.errors.length===0)return null;return{path:a.path,result:p}}function hw(a){let p=[],v=new Set,b=(_e(a)??[]).filter((k)=>!fw.has(k.name)).sort((k,j)=>k.name.localeCompare(j.name));if(b.length===0)return{errors:p,ruleNames:v};for(let k of b){if(!g.test(k.name)){p.push(`rulebook directory names must match ${g}: ${k.name}`);continue}if(k.kind!=="directory"){p.push(`${k.name} must be a rulebook directory`);continue}let j=i(a.scope,uw(a.path,k.name,"rulebook.json")),F=r(j);if(F===null){p.push(`${k.name}/rulebook.json is required`);continue}try{let W;try{W=JSON.parse(F)}catch{p.push(`${k.name}/rulebook.json: invalid JSON`);continue}let K=xe(W);if(K.name!==k.name){p.push(`rulebook name "${K.name}" must match folder "${k.name}"`);continue}let se=cs(K);if(se.length>0){p.push(...se.map((ie)=>`${k.name}/rulebook.json: ${ie}`));continue}v.add(k.name)}catch(W){p.push(W instanceof Error?`${k.name}/rulebook.json: ${W.message}`:`${k.name}/rulebook.json: ${String(W)}`)}}return{errors:p,ruleNames:v}}function yw(){console.log(cg),console.log(dw)}function vw(a,p,v,b){if(console.log(`
✓ ${a} config: ${p}`),console.log(`  Schema: ${b==="rules"?"rulebook sources":"legacy inline rules"}`),v.ruleNames.size>0){console.log(`  ${b==="rules"?"Sources":"Rules"}:`);let k=1;for(let j of v.ruleNames)console.log(`    ${k}. ${j}`),k++}else console.log(`  ${b==="rules"?"Sources":"Rules"}: (none)`)}function bw(a,p,v){if(console.error(`
✗ Legacy ${a.toLowerCase()} config: ${p}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),v.errors.length>0){console.error("  Errors:");let b=1;for(let k of v.errors)for(let j of k.split("; "))console.error(`    ${b}. ${j}`),b++;return}if(v.ruleNames.size>0){console.error("  Rules:");let b=1;for(let k of v.ruleNames)console.error(`    ${b}. ${k}`),b++;return}console.error("  Rules: (none)")}function Lw(a,p,v){ug(`${a} config`,p,v)}function ww(a,p){console.log(`
✓ GitHub source rules: ${a}`),console.log("  Rulebooks:");let v=1;for(let b of p.ruleNames)console.log(`    ${v}. ${b}`),v++}function xw(a,p){ug("GitHub source rules",a,p)}function ug(a,p,v){console.error(`
✗ ${a}: ${p}`),console.error("  Errors:");let b=1;for(let k of v)for(let j of k.split("; "))console.error(`    ${b}. ${j}`),b++}function kw(a){try{let p=r(a);if(p===null)return!1;let v=JSON.parse(p);if(v.$schema)return!1;return C(a,JSON.stringify({$schema:pw,...v},null,2)),!0}catch(p){if(p instanceof o)throw p;return!1}}var dg=new Set(["init","add","remove","update","sync","list","wrapper","migrate","doc","verify"]),Sw=new Set(["add","remove","list"]),Cw="cc-safety-net/rulebooks";async function pg(a,p){try{return await Pw(a,p)}catch(v){if(v instanceof o)return console.error(v.message),1;throw v}}async function Pw(a,p){let v=Ew(p),b=v.help?$w(v.positionals):null;if(b)return ir(b),0;if(v.errors.length>0){for(let W of v.errors)console.error(W);return 1}let k=v.positionals[0];if(!k)return ir(Wn,console.error),1;let j=v.positionals[1],F={global:v.global};if(k==="init"){let W=Bt(a,F);Tw(W.configTarget);let K=_w(W.configDir,"example-rules","rulebook.json"),se=i(W.filesystemScope,K);if(v.example&&r(se)===null)O2(se,"example-rules");let ie=X(W.configPath,W.filesystemScope);for(let ae of ie)console.error(ae);if(ie.length>0)return 1;return console.log("Rule config initialized."),0}if(k==="add"){let W=fg(v);if(!W)return console.error("rule add requires a source (pass --only <rulebook...> to select from cc-safety-net/rulebooks)"),1;let K=Bt(a,F),se=await Q2(a,W,{...F,ref:v.ref,rulebooks:v.only.length>0?v.only:void 0});return R2(se,W,`Scope: ${v.global?"user":"project"} (${K.configDir})`),se.ok?0:1}if(k==="remove"){if(!j)return console.error("rule remove requires a source"),1;let W=await eg(a,j,{...F,deleteSource:v.deleteSource});return as(W,`Removed rulebook source: ${j}`),W.ok?0:1}if(k==="update"){let W=await ms(a,{...F,only:j,refresh:!0});return as(W,"Rule config updated."),W.ok?0:1}if(k==="sync")return _p(a,{global:v.global});if(k==="list"){let W=pe(a,{cwd:process.cwd()});return A2(W),W.errors.length>0?1:0}if(k==="wrapper")return Iw(a,v);if(k==="migrate")return sg(a,{cleanup:v.cleanup,cwd:process.cwd()});if(k==="doc"){console.log($2);let W=await ag(a);if(W)console.error(W);return 0}if(k==="verify")return lg(a);return 1}function $w(a){if(a.length===0)return Wn;let p=Wn.subcommands.filter((b)=>b.usage.split(" ")[0]===a[0]);if(p.length===0)return null;if(a.length===1&&p.length>1)return{name:`rule ${a[0]}`,description:`Subcommands of rule ${a[0]}`,usage:`rule ${a[0]} <subcommand>`,subcommands:p,options:[]};let v=a.length===1?p[0]:p.find((b)=>b.usage.split(" ")[1]===a[1]);if(!v)return null;return{name:`rule ${a[0]}`,description:v.description,usage:`rule ${v.usage}`,options:a[0]==="add"?ws:[],examples:a[0]==="add"?xs:void 0}}function Ew(a){let p=c({label:"rule",booleans:{global:["-g","--global"],check:["--check"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},values:{ref:["--ref"]},lists:{only:["--only"]},positionals:"list"},a),v={...p.flags,ref:p.values.ref,only:p.lists.only??[],help:p.help,positionals:p.positionals,errors:p.errors};return Rw(v),v}function Rw(a){let[p]=a.positionals;if(p&&!dg.has(p))a.errors.push(`Unknown rule subcommand: ${p}`);if(a.deleteSource&&p!=="remove")if(p&&dg.has(p))a.errors.push(`Unknown option for rule ${p}: --delete-source`);else a.errors.push("--delete-source is only valid with 'rule remove'");if(a.check&&p)a.errors.push(dr(p,"--check"));if(a.cleanup&&p!=="migrate")a.errors.push(dr(p,"--cleanup"));if(a.example&&p!=="init")a.errors.push(dr(p,"--example"));if(a.ref&&p!=="add")a.errors.push(dr(p,"--ref"));if(a.only.length>0&&p!=="add")a.errors.push(dr(p,"--only"));if(p==="add")Dw(a);if(p==="migrate"){if(a.global)a.errors.push(dr(p,"--global"));if(a.positionals.length>1)a.errors.push(`Unexpected rule migrate argument: ${a.positionals[1]}`)}else if(p==="wrapper")Aw(a);else if(a.positionals.length>2)a.errors.push(`Unexpected rule argument: ${a.positionals[2]}`);if(p==="list"&&a.global)a.errors.push("Unknown option for rule list: --global")}function fg(a){if(a.positionals[1])return a.positionals[1];if(a.ref||a.only.length>0)return Cw;return}function Dw(a){let p=fg(a);if(!p)return;if((a.ref||a.only.length>0)&&!ue(p)){if(a.ref)a.errors.push(`--ref can only select a ref for an owner/repo source: ${p}`);if(a.only.length>0)a.errors.push("--only can only select rulebooks from an owner/repo source");return}if(a.ref&&!we(a.ref))a.errors.push(`--ref must use valid path segments: ${a.ref}`);let v=a.only.filter((b)=>!g.test(b));if(v.length>0)a.errors.push(`Invalid rulebook names: ${v.join(", ")}`)}function dr(a,p){return a?`Unknown option for rule ${a}: ${p}`:`Unknown option for rule: ${p}`}function Aw(a){let p=a.positionals[1],v=a.positionals[2];if(!p){a.errors.push("rule wrapper requires add, remove, or list");return}if(!Sw.has(p)){a.errors.push(`Unknown rule wrapper action: ${p}`);return}if(p==="list"){if(v)a.errors.push(`Unexpected rule wrapper argument: ${v}`);return}if(!v){a.errors.push(`rule wrapper ${p} requires a command`);return}if(a.positionals.length>3)a.errors.push(`Unexpected rule wrapper argument: ${a.positionals[3]}`)}function Tw(a){if(r(a)===null){I2(a);return}let p=w(a);if(!p.config)return;Gt(a,{version:1,rules:p.config.rules,overrides:p.config.overrides??{},transparent_wrappers:p.config.transparent_wrappers??[]})}async function Iw(a,p){let v=p.positionals[1],b=p.positionals[2],k=Bt(a,{global:p.global}).configTarget;if(v==="list"){let K=w(k);if(K.errors.length>0){for(let se of K.errors)console.error(se);return 1}return Ow(K.config?.transparent_wrappers??[]),0}if(!b||!_.test(b))return console.error("transparent wrapper must match command pattern"),1;if(Pe(b))return console.error(`reserved command "${b}" cannot be a wrapper`),1;let j=w(k);if(j.errors.length>0){for(let K of j.errors)console.error(K);return 1}let F=j.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},W=v==="add"?[...new Set([...F.transparent_wrappers??[],b])]:(F.transparent_wrappers??[]).filter((K)=>K!==b);return Gt(k,{version:1,rules:F.rules,overrides:F.overrides??{},transparent_wrappers:W}),console.log(v==="add"?`Added transparent wrapper: ${b}`:`Removed transparent wrapper: ${b}`),0}function Ow(a){if(a.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${a.length}):`);for(let p of a)console.log(`  - ${p}`)}import{sep as Uw}from"node:path";import{existsSync as jw,readFileSync as Nw}from"node:fs";import{join as zw}from"node:path";async function Fw(a){if(a.isTTY)return null;return(await Ne(a).catch(()=>null))?.trim()||null}function Mw(a){let p=a.env.get("CLAUDE_SETTINGS_PATH");if(p)return p;return zw(a.home,".claude","settings.json")}function _a(a){let p=Mw(a);if(!jw(p))return!1;try{let v=Nw(p,"utf-8"),b=JSON.parse(v);if(!b.enabledPlugins)return!1;let k="cc-safety-net@cc-marketplace";if(!(k in b.enabledPlugins))return!1;return b.enabledPlugins[k]===!0}catch(v){if(P(n.debug,a.env))console.error(`CC Safety Net debug: failed to read Claude settings: ${p}: ${v instanceof Error?v.message:String(v)}`);return!1}}async function Sa(a,p=process.stdin){let v=_a(a),b;if(!v)b="\uD83D\uDEE1️ CC Safety Net ❌";else{let j=D(a,{cwd:process.cwd()}),F=j.policy,W=M(F,a.env),K=Object.values(ee(F,W.capabilities)).some((ae)=>ae.changesInherited),se={standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[K?"custom":W.effectiveLevel],ie=(j.policyScopes?.weakenings.length??0)>0?"\uD83D\uDD3B":"";b=`\uD83D\uDEE1️ CC Safety Net ${se}${W.worktreeMode?"\uD83C\uDF33":""}${ie}${j.state==="degraded"?"⚠️":""}`}let k=await Fw(p);if(k&&!k.startsWith("{"))console.log(`${k} | ${b}`);else console.log(b)}function mg(a){let p=D(a,{cwd:process.cwd()}),v=p.policy,b=M(v,a.env),k=!!process.env.NO_COLOR||!process.stdout.isTTY,j=Math.min(process.stdout.columns||80,100),F=k?"ok":"✔",W=k?"OFF":"✘",K=(ve,ke)=>{let qe=`  ${ve.padEnd(13)}${ke}`;return(qe.length>j?`${qe.slice(0,j-1)}…`:qe).replaceAll(W,et.red(W))},se=Object.values(ee(v,b.capabilities)).some((ve)=>ve.changesInherited),ie=(ve)=>ve===a.home||ve.startsWith(`${a.home}${Uw}`)?`~${ve.slice(a.home.length)}`:ve,ae={ready:et.green,degraded:et.yellow}[p.state],le=p.policyScopes?.weakenings??[],he=[..._a(a)?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...p.diagnostics],be=k?"-":"·";console.log([`${k?"":"\uD83D\uDEE1️  "}CC Safety Net — ${ae(p.state)}`,"",K("Protection",`destructive ${v.destructiveCommandProtectionEnabled?F:W}   secrets ${v.secretProtection.enabled?F:W}`),K("Level",se?`${b.effectiveLevel} (customised)`:b.effectiveLevel),K("Rules",v.rules.length===0?"none active":`${v.rules.length} active`),K("Policy",ie(h(a))),...p.policyScopes?[K("Project",ie(E(process.cwd())))]:[],...b.worktreeMode?[K("Worktree","relaxations active")]:[],"",...le.length===0?[]:["  Project policy",...le.flatMap((ve)=>jr(ve,"      ",j-6).map((ke,qe)=>qe===0?`    ${ke}`:ke)),""],...he.length===0?["  Everything configured is active."]:["  Not active",...he.flatMap((ve)=>jr(ve,"      ",j-6).map((ke,qe)=>qe===0?`    ${be} ${ke}`:ke)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as Sg}from"node:child_process";import{randomBytes as Yw}from"node:crypto";import{existsSync as Xw}from"node:fs";import{createServer as Qw}from"node:http";import{Writable as ex}from"node:stream";var ys=500;function Hw(a){let p=a.filter((k)=>k.decision!=="allow"),v=a.filter((k)=>k.decision==="allow"),b=Math.min(p.length,Math.max(ys-v.length,Math.ceil(ys/2)));return[...p.slice(0,b),...v.slice(0,ys-b)]}function gg(a,p,v=q(a)){if(v)oe(a,v);let b=(ke)=>new Date(ke.getFullYear(),ke.getMonth(),ke.getDate()).getTime(),k=b(new Date),j=new Date(k);j.setDate(j.getDate()-(p-1));let F=j.getTime(),W=[],K={count:0};for(let ke of v?$n(v,K):[])for(let qe of Jn(ke,K)){if(!qe||typeof qe.ts!=="string"||typeof qe.command!=="string")continue;let Ze=new Date(qe.ts).getTime();if(!Number.isFinite(Ze))continue;if(Ze>=F)W.push(qe)}W.sort((ke,qe)=>new Date(qe.ts).getTime()-new Date(ke.ts).getTime());let se=Array.from({length:p},()=>0),ie=Array.from({length:p},()=>0),ae={},le={},he={},be=0,ve=0;for(let ke of W){let qe=ke.agent||"unknown";ae[qe]=(ae[qe]??0)+1;let Ze=Math.round((k-b(new Date(ke.ts)))/86400000),De=p-1-Ze,Pt=Ze>=0&&Ze<p;if(Pt)ie[De]=(ie[De]??0)+1;if(ke.decision!=="allow"){if(be++,ke.ruleId)le[ke.ruleId]=(le[ke.ruleId]??0)+1;let Ke=Vr(ke.segment||ke.command);if(Ke)he[Ke]=(he[Ke]??0)+1;if(ke.failureStage)ve++;if(Pt)se[De]=(se[De]??0)+1}}return{days:p,logsDir:v,homeDir:a.home,totalInWindow:W.length,truncated:W.length>ys,unreadable:K.count,counts:{blocked:be,allowed:W.length-be,agents:ae,blockedByDay:se,analyzedByDay:ie,rules:le,commands:he,errors:ve},entries:Hw(W).sort((ke,qe)=>new Date(qe.ts).getTime()-new Date(ke.ts).getTime())}}import{spawn as Zw}from"node:child_process";import{existsSync as Gw,statSync as hg}from"node:fs";import{delimiter as Bw,join as qw}from"node:path";var Vw=120000,vs="Choose the project folder",Jw=`try
  return POSIX path of (choose folder with prompt "${vs}")
on error number -128
  return ""
end try`,Ww=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${vs}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,yg=[{binary:"zenity",args:["--file-selection","--directory",`--title=${vs}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",vs]}],vg=(a,p)=>(p.PATH??"").split(Bw).some((v)=>{if(v.length===0)return!1;try{let b=hg(qw(v,a));return b.isFile()&&(b.mode&73)!==0}catch{return!1}});function Ca(a,p){if(a==="darwin"||a==="win32")return!0;if(a!=="linux")return!1;if(!p.DISPLAY&&!p.WAYLAND_DISPLAY)return!1;return yg.some((v)=>vg(v.binary,p))}function Kw(a,p){if(a==="darwin")return{cmd:"osascript",args:["-e",Jw]};if(a==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",Ww]};let v=yg.find((b)=>vg(b.binary,p));return v?{cmd:v.binary,args:v.args}:null}function Pa(a=process.platform,p=process.env){let v=Kw(a,p);if(!v)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((b)=>{let k=Zw(v.cmd,v.args,{env:p,stdio:["ignore","pipe","pipe"]}),j="",F=!1,W=(se)=>{if(F)return;F=!0,clearTimeout(K),b(se)},K=setTimeout(()=>{k.kill(),W({error:"The folder dialog timed out"})},Vw);k.stdout.on("data",(se)=>{j+=se.toString()}),k.on("error",()=>W({error:`Could not open the folder dialog (${v.cmd})`})),k.on("close",()=>{let se=j.trim().replace(/\/+$/,"");if(!se)return W({cancelled:!0});if(!Gw(se)||!hg(se).isDirectory())return W({error:"That selection is not a folder on disk"});W({path:se})})})}var bg=`<!doctype html>
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
`;var Lg='<script id="ccsn-data" type="application/json">';function wg(a){return bg.replace(Lg,()=>Lg+JSON.stringify({token:a}).replaceAll("<","\\u003c"))}var bs="kenryu42/cc-safety-net",tx=`https://github.com/${bs}`,Ra=1e4,nx=7,rx="The project draft directory changed; reload the draft before applying.",ox="audit settings are user scope only; remove the audit section from a project proposal";async function Cg(a,p={}){let v=c({label:"gui",booleans:{noOpen:["--no-open"]}},a),b=p.log??console.log,k=p.error??console.error;if(v.errors.length>0){for(let F of v.errors)k(F);return k("Usage: cc-safety-net gui [--no-open]"),1}let j=await sx(l,p);if(b(`CC Safety Net policy GUI: ${j.url}`),!v.flags.noOpen)try{await(p.openBrowser??hx)(j.url)}catch(F){k(`Failed to open browser: ${F instanceof Error?F.message:String(F)}`),k(`Open this URL manually: ${j.url}`)}if(p.keepAlive===!1)return await j.close(),0;return await gx(j),0}async function sx(a,p={}){let v=Yw(24).toString("base64url"),b={dir:null,revision:0},k=Qw((W,K)=>{ix(a,W,K,v,p,b)});await new Promise((W,K)=>{k.once("error",K),k.listen(0,"127.0.0.1",()=>{k.off("error",K),W()})});let F=`http://127.0.0.1:${k.address().port}`;return{origin:F,token:v,url:`${F}/?token=${encodeURIComponent(v)}`,close:()=>mx(k)}}async function ix(a,p,v,b,k,j){let F=a(),W=new URL(p.url??"/","http://127.0.0.1");if(p.method==="GET"&&W.pathname==="/favicon.ico"){v.writeHead(204,{"cache-control":"no-store"}),v.end();return}if(!dx(p,W,b)){Et(v,403,{error:"Forbidden"});return}if(p.method==="GET"&&W.pathname==="/"){fx(v,wg(b));return}if(p.method==="GET"&&W.pathname==="/api/policy"){let K=w2(F,k),se=D(F,$a(k));Et(v,200,{...K,configState:rt(se),...se.policyScopes?{projectPolicy:{path:E(k.cwd??process.cwd()),weakenings:se.policyScopes.weakenings}}:{},destructiveCommandRules:Q,secretPatterns:vt,version:zt(),preview:K.errors.length>0?null:Qe(K.policy,F.env)});return}if(p.method==="POST"&&W.pathname==="/api/policy/preview"){let K=await qr(p);if(!K.ok){Et(v,K.status,{errors:[K.error]});return}let se=x2(F,K.value);Et(v,se.errors.length>0?400:200,se);return}if(p.method==="POST"&&W.pathname==="/api/policy/explain"){let K=await qr(p);if(!K.ok){Et(v,K.status,{errors:[K.error]});return}let se=K.value;if(se===null||typeof se.command!=="string"){Et(v,400,{errors:["command must be a string"]});return}let ie=Yt(se.policy,F.home);if(ie.length>0){Et(v,400,{errors:ie});return}Et(v,200,lx(F,se.command,se.policy,k));return}if(p.method==="POST"&&W.pathname==="/api/policy"){let K=await qr(p);if(!K.ok){Et(v,K.status,{errors:[K.error]});return}let se=gn(F,K.value,k);Et(v,se.errors.length>0?400:200,se);return}if(p.method==="POST"&&W.pathname==="/api/reset"){Et(v,200,gn(F,me,k));return}if(p.method==="POST"&&W.pathname==="/api/repair"){Et(v,200,k2(F,k));return}if(p.method==="POST"&&W.pathname==="/api/policy/project/choose-directory"){let K=await(k.chooseDirectory??Pa)();if("path"in K)j.dir=K.path,j.revision+=1;Et(v,200,{cancelled:"cancelled"in K,..."error"in K?{error:K.error}:{}});return}if(p.method==="GET"&&W.pathname==="/api/policy/project"){let K=Pg(j,k),se=xg(K,F.home),ie=Zr(F,k);Et(v,200,{dir:K,path:E(K),revision:j.revision,baseline:ie.baseline,userPolicyDiagnostics:ie.diagnostics,projection:se.projection,projectionDiagnostics:se.diagnostics,canPickDirectory:Ca(process.platform,process.env)});return}if(p.method==="POST"&&W.pathname==="/api/policy/project/diff"){let K=await kg(F,p,v,j,k);if(!K)return;let se=xg(K.dir,F.home),ie=Zr(F,k).baseline,ae=fe(ie,Ce(K.proposal,F.home).policy);Et(v,200,{rows:ss(fe(ie,se.projection).policy,ae.policy,!1),weakenings:ae.weakenings,existingFileDiagnostics:se.diagnostics,errors:[]});return}if(p.method==="POST"&&W.pathname==="/api/policy/project/apply"){let K=await kg(F,p,v,j,k);if(!K)return;let se=cx(K.dir,K.proposal,F.home);Et(v,se.errors.length>0?500:200,se);return}if(p.method==="GET"&&W.pathname==="/api/activity"){let K=ye(F,k),se=ux(W.searchParams.get("days"),K);if(se===null){Et(v,400,{error:`days must be an integer between 1 and ${K}`});return}Et(v,200,gg(F,se,k.activityLogsDir));return}if(p.method==="POST"&&W.pathname==="/api/rules/choose-directory"){Et(v,200,await Pa());return}if(p.method==="GET"&&W.pathname==="/api/rules"){let K=pe(F,$a(k)),se=new Map(K.rules.map((ie)=>[ie.name,ie]));Et(v,200,{projectPath:k.cwd??process.cwd(),canPickDirectory:Ca(process.platform,process.env),rulebooks:K.rulebooks.map((ie)=>({source:ie.source,spec:ie.spec,name:ie.name,version:ie.version,rules:ie.rules.flatMap((ae)=>{let le=se.get(ae);if(!le)return[];return[{name:le.name,command:le.command,subcommand:le.subcommand,block_args:le.block_args,reason:le.reason}]})})),errors:K.errors,warnings:K.warnings});return}if(p.method==="GET"&&W.pathname==="/api/star/context"){Et(v,200,await(k.fetchStarContext??(()=>wx(F,{logsDir:k.activityLogsDir})))());return}if(p.method==="POST"&&W.pathname==="/api/star"){let K=await(k.starRepo??yx)();Et(v,200,K.ok?{ok:!0}:{ok:!1,fallbackUrl:tx});return}if(p.method==="GET"&&W.pathname==="/api/integrations"){Et(v,200,await(k.fetchIntegrations??(()=>vx(F)))());return}if(p.method==="GET"&&W.pathname==="/api/health"){Et(v,200,await(k.fetchHealth??(()=>bx(F)))());return}if(p.method==="POST"&&(W.pathname==="/api/install"||W.pathname==="/api/uninstall")){let K=await qr(p);if(!K.ok){Et(v,K.status,{errors:[K.error]});return}let se=K.value?.target;if(typeof se!=="string"||!un.some((ae)=>ae.target===se)){Et(v,400,{error:"unknown target"});return}let ie=W.pathname==="/api/install"?"install":"uninstall";Et(v,200,await(k.runIntegration??Lx)(ie,se));return}Et(v,404,{error:"Not found"})}function $a(a){return{...a,cwd:a.cwd??process.cwd()}}function Pg(a,p){return a.dir??p.cwd??process.cwd()}function xg(a,p){let v=E(a),b=Xw(v)?qn(v):{value:void 0,errors:[]},k=Ce(b.value,p);return{projection:k.policy,diagnostics:[...b.errors,...k.diagnostics]}}async function kg(a,p,v,b,k){let j=Pg(b,k),F=b.revision,W=await qr(p);if(!W.ok)return Et(v,W.status,{errors:[W.error]}),null;let K=W.value;if(typeof K?.revision!=="number")return Et(v,400,{errors:["revision must be a number"]}),null;if(K.revision!==F)return Et(v,409,{errors:[rx]}),null;let se=ax(K.proposal,a.home);if(se.length>0)return Et(v,400,{errors:se}),null;return{dir:j,proposal:K.proposal}}function ax(a,p){let v=Yt(a,p);if(v.length>0)return v;return a?.audit===void 0?[]:[ox]}function cx(a,p,v){let b=E(a),k=is(p,x(p,v));try{return C(i(A(a,"project policy"),b),`${JSON.stringify(k,null,2)}
`),{path:b,errors:[]}}catch(j){return{path:b,errors:[j instanceof Error?j.message:String(j)]}}}function lx(a,p,v,b){let k=x(v,a.home),j=D(a,$a(b)),F=We({rules:j.policy.rules,transparentWrappers:j.policy.transparentWrappers,safety:nt(k.safety),worktreeMode:k.workflow.worktree_mode,destructiveCommandProtectionEnabled:k.destructive_command_protection.enabled,destructiveCommandRuleOverrides:k.destructive_command_protection.overrides,destructiveCommandAllowPaths:k.destructive_command_protection.allow_paths,secretProtection:{enabled:k.secret_protection.enabled,disabledRules:tt(k.secret_protection.overrides),denyPaths:k.secret_protection.deny_paths,allowPaths:k.secret_protection.allow_paths}});return Nr(p,{policySnapshot:F,cwd:b.cwd,userConfigDir:b.userConfigDir},a)}function ux(a,p){if(a===null)return Math.min(nx,p);let v=Number(a);if(!Number.isInteger(v)||v<1||v>p)return null;return v}function dx(a,p,v){if(p.searchParams.get("token")!==v)return!1;if(a.method!=="POST")return!0;return a.headers["x-cc-safety-net-token"]===v}var px=1048576;async function qr(a){let p=[],v=0;for await(let b of a){let k=b;if(v+=k.byteLength,v>px)return{ok:!1,status:413,error:"Request body is too large"};p.push(k)}try{return{ok:!0,value:JSON.parse(Buffer.concat(p).toString("utf-8")||"{}")}}catch(b){return{ok:!1,status:400,error:`Invalid JSON: ${b instanceof Error?b.message:String(b)}`}}}function fx(a,p){a.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),a.end(p)}function Et(a,p,v){a.writeHead(p,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),a.end(JSON.stringify(v))}function mx(a){return new Promise((p,v)=>{a.close((b)=>b?v(b):p())})}function gx(a){return new Promise((p)=>{let v=()=>{process.off("SIGINT",b),process.off("SIGTERM",b)},b=()=>{v(),a.close().then(p)};process.once("SIGINT",b),process.once("SIGTERM",b)})}function hx(a){let p=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",v=process.platform==="win32"?["/c","start","",a]:[a];return new Promise((b,k)=>{let j=Sg(p,v,{detached:!0,stdio:"ignore"}),F=(K)=>{j.off("spawn",W),k(K)},W=()=>{j.off("error",F),j.unref(),b()};j.once("error",F),j.once("spawn",W)})}async function yx(a="gh",p=Ra){return{ok:await Ea(a,["api","-X","PUT",`/user/starred/${bs}`],p)===0}}async function vx(a,p={}){let v=await _r(p.fetcher),b=$g(a,v);return{targets:U.map((k)=>{let j=b.find((F)=>F.platform===k.id);return{target:k.id,label:d(k.id),version:v.versions[k.id]??null,status:j?.configured?"active":j?.detected?"disabled":j?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:v.version,nodeVersion:v.nodeVersion,platform:v.platform}}}function $g(a,p){return or(a,process.cwd(),{ampPluginListOutput:p.ampPluginListOutput,codexPluginListOutput:p.codexPluginListOutput,copilotCliVersion:p.versions["copilot-cli"]})}async function bx(a,p={}){let[v,b]=await Promise.all([_r(p.fetcher),(p.checkUpdates??_n)()]);return{hooks:$g(a,v).filter((k)=>k.detected).map((k)=>({platform:k.platform,label:d(k.platform),configured:k.configured})),update:{currentVersion:b.currentVersion,latestVersion:b.latestVersion??null,updateAvailable:b.updateAvailable}}}var _g=Promise.resolve();function Lx(a,p,v={}){let b=async()=>{let j=[],{log:F,error:W}=console;console.log=(...K)=>j.push(K.map(String).join(" ")),console.error=console.log;try{return{ok:await Hr(a,[],{selectTargets:async()=>[p],output:new ex({write(se,ie,ae){j.push(String(se).replace(/\n$/,"")),ae()}}),...v})===0,output:j.join(`
`)}}finally{console.log=F,console.error=W}},k=_g.then(b);return _g=k.then(()=>{return},()=>{return}),k}async function wx(a,p={}){let[v,b,k]=await Promise.all([xx(p.command),kx(p.fetchRepo),Promise.resolve(Yr(a,ye(a),p.logsDir).totalBlocked)]);return{starred:v,starCount:b,blockedTotal:k}}async function xx(a="gh",p=Ra){if(await Ea(a,["auth","status"],p)!==0)return null;let v=await Ea(a,["api",`/user/starred/${bs}`],p);if(v===0)return!0;if(v===null)return null;return!1}function Ea(a,p,v){return new Promise((b)=>{let k=Sg(a,p,{stdio:"ignore",windowsHide:!0}),j=!1,F,W=(K)=>{if(j)return;if(j=!0,F)clearTimeout(F);b(K)};k.once("error",()=>W(null)),k.once("close",W),F=setTimeout(()=>{k.kill(),W(null)},v)})}async function kx(a=fetch){try{let p=await a(`https://api.github.com/repos/${bs}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(Ra)});if(!p.ok)return null;let v=await p.json();return typeof v.stargazers_count==="number"?v.stargazers_count:null}catch{return null}}function _x(a){if(a[0]!=="help")return!1;let p=a[1];if(!p)Qi(),process.exit(0);if(zr(p))process.exit(0);console.error(`Unknown command: ${p}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var Sx={hook:async()=>{console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),zr("hook",console.error),process.exit(1)},install:async(a)=>{process.exit(await Hr("install",a))},update:async(a)=>{process.exit(await fa(a))},uninstall:async(a)=>{process.exit(await Hr("uninstall",a))},rule:async(a)=>{process.exit(await pg(l(),a))},policy:async(a)=>{process.exit(await P2(l(),a))},status:async(a)=>{if(re(c({label:"status"},a).errors))process.exit(1);mg(l())},statusline:async(a)=>{let p=c({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},a);if(p.errors.length===0&&p.flags.claudeCode){await Sa(l());return}if(re(p.errors),!p.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");zr("statusline",console.error),process.exit(1)},doctor:async(a)=>{let p=Bi(a);if(!p)process.exit(1);let v=await tm(l(),{json:p.json,skipUpdateCheck:p.skipUpdateCheck});process.exit(v)},logs:async(a)=>{process.exit(await za(l(),a))},gui:async(a)=>{process.exit(await Cg(a))},explain:async(a)=>{process.exit(await dm(l(),a))}};async function X5(a){let p=c({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},a);if(_x(a))return;let v=a[0],b=v?Kr(v):void 0;if(p.help&&b&&b.name!=="rule")zr(b.name),process.exit(0);if(!v||p.help&&!b)Qi(),process.exit(0);if(p.flags.version)mm(),process.exit(0);if(b){await Sx[b.name](a.slice(1));return}if(v==="--statusline"){await Sa(l());return}console.error(v.startsWith("-")?`Unknown option: ${v}`:`Unknown command: ${v}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}export{X5 as runCli};
