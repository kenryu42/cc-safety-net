#!/usr/bin/env node
import{$ as gr,$a as Xn,A as gt,Aa as Go,B as dc,Ba as Bo,C as ee,Ca as fr,D as J,Da as qo,E as rr,Ea as Vo,F as Kn,Fa as Y,G as Bt,Ga as Zn,H as Wn,Ha as or,I as Je,Ia as ir,J as ke,Ja as Z,K as sr,Ka as Oc,L as ue,La as vt,M as Di,Ma as $c,N as mr,Na as Ro,O as qt,Oa as Nc,P as Ri,Pa as Fc,Q as Ai,Qa as Hc,R as Se,Ra as wn,S as zt,Sa as Mc,T as wt,Ta as jc,U as xt,Ua as fi,V as si,Va as mi,W as ht,Wa as gi,X as De,Xa as hi,Y as ar,Ya as mc,Z as pe,Za as ti,_ as Ei,_a as ni,aa as Ii,ab as ri,b as Io,ba as _i,bb as oi,c as _o,ca as lr,cb as Le,d as G,da as ai,db as Ce,e as Oo,ea as Ho,eb as ce,f as Bn,fa as li,fb as ii,g as N,ga as ci,gb as B,h as k,ha as di,hb as bt,i as pt,ia as cr,ib as yt,j as x,ja as Mo,jb as Ti,k as xe,ka as S,kb as Ae,l as Jo,la as dr,lb as fe,m as Be,ma as Pi,mb as ji,n as ft,na as de,nb as Vt,o as vc,oa as Lt,p as zn,pa as ur,q as Yo,qa as pr,r as mt,ra as ui,s as Zo,sa as pi,t as nr,ta as jo,u as Xo,ua as Ke,v as Qo,va as Jn,w as X,wa as Yn,x as Q,xa as ei,y as Ve,ya as Ue,z as ze,za as _c}from"../chunks/index-a7sadmgy.js";var zc=["-h","--help"];function T(e,t){let n=Object.entries(e.booleans??{}),r=Object.entries(e.values??{}),o=Object.fromEntries(n.map(([d])=>[d,!1])),i={},s=[],a=[],l=!1,c=-1;for(let[d,p]of t.entries()){if(d<=c)continue;if(p==="--"){s.push(...t.slice(d+1));break}if(zc.includes(p)){l=!0;continue}let m=n.find(([,h])=>h.includes(p));if(m){o[m[0]]=!0;continue}let u=r.find(([,h])=>h.includes(p));if(u){let h=t[d+1];if(h===void 0||h.startsWith("-")){a.push(`${p} requires a value`);continue}i[u[0]]=h,c=d+1;continue}if(p.startsWith("-")){a.push(`Unknown option for ${e.label}: ${p}`);continue}if(e.positionals==="tail"){s.push(...t.slice(d));break}s.push(p)}if(e.positionals!=="list"&&e.positionals!=="tail")a.push(...s.map((d)=>`Unexpected argument for ${e.label}: ${d}`));return{flags:o,values:i,positionals:s,help:l,errors:a}}function ae(e){for(let t of e)console.error(t);return e.length>0}import{readdirSync as Td,statSync as Li,unlinkSync as Id}from"node:fs";import{basename as vi,dirname as _d,join as Od,resolve as $d}from"node:path";function I(e){return Array.from(e,(t)=>{let n=t.charCodeAt(0);if(n<=31||n>=127&&n<=159)return`\\x${n.toString(16).padStart(2,"0")}`;return t}).join("")}var Mn=(e)=>{let t=Date.now()-new Date(e).getTime();if(!Number.isFinite(t))return"";let n=Math.floor(t/60000),r=Math.floor(n/60),o=Math.floor(r/24);if(o>0)return`${o}d ago`;if(r>0)return`${r}h ago`;if(n>0)return`${n}m ago`;return"just now"},He=(e)=>{let t=(e??"").trim().split(/\s+/).filter((o)=>o&&!/^[A-Za-z_][A-Za-z0-9_]*=/.test(o)),n=t[0]?.split("/").pop();if(!n)return null;let r=t[1];return r&&/^[a-z][a-z0-9-]*$/.test(r)?`${n} ${r}`:n};import{existsSync as Kc,readdirSync as Wc,readFileSync as Jc}from"node:fs";import{join as Yc}from"node:path";function ye(e,t){try{return Wc(e,{withFileTypes:!0,encoding:"utf8"}).flatMap((n)=>{let r=Yc(e,n.name);if(n.isDirectory())return ye(r,t);if(n.name.endsWith(".jsonl"))return[r];return[]})}catch{if(t&&Kc(e))t.count++;return[]}}function jn(e){let t=(o)=>`${o.sessionId}
${He(o.segment||o.command)}`,n=e.filter((o)=>o.decision!=="allow"),r=n.filter((o)=>o.sessionId).reduce((o,i)=>o.set(t(i),(o.get(t(i))??0)+1),new Map);return new Set(n.filter((o)=>o.failureStage||(r.get(t(o))??0)>=2))}function ut(e,t){try{return Jc(e,"utf-8").split(`
`).filter(Boolean).flatMap((n)=>{try{return[JSON.parse(n)]}catch{if(t)t.count++;return[]}})}catch{if(t)t.count++;return[]}}import{resolve as Cd}from"node:path";var Zc=["AKIA","ASIA","ghp_","gho_","ghu_","ghs_","ghr_","github_pat_","glpat-","xox","npm_","pypi-","rk_","sk-","sk_","gsk_","xai-","pplx-","bastn_","tgp_v1_","flp_","wfr_","fw_","fwp_","tp-","psk-"];function $o(e){let t=0,n={allocateSegment(){return t++},getNextSegmentIndex(){return t},recordGlobal(r){e.record({kind:"step",scope:"global",step:r})},recordSegment(r,o=n.currentSegmentIndex){if(o===void 0)return;e.record({kind:"step",scope:"segment",segmentIndex:o,step:r})}};return n}function No(e={}){let t=[],n=e.maxEvents??512,r={maxTextLength:e.maxTextLength??2048,maxListLength:e.maxListLength??128,maxObjectProperties:e.maxObjectProperties??e.maxListLength??128,maxDepth:e.maxDepth??16},o=0,i,s=new Set;return{record(a){if(i)return;try{if(!a||t.length>=n){o++;return}t.push(Gn(Xc(a,r,s)))}catch{o++}},finish(a){if(i)return i;try{i=Gn({events:Object.freeze(t),droppedEvents:o,terminal:Qc(a,r,s)})}catch{o++,i=Object.freeze({events:Object.freeze(t),droppedEvents:o,terminal:Object.freeze({result:"blocked",reason:"trace unavailable".slice(0,r.maxTextLength),segment:"trace unavailable".slice(0,r.maxTextLength)})})}return i}}}function Xc(e,t,n){if(e.kind!=="step")throw TypeError("invalid trace event");let{scope:r,step:o}=e;jt(o,n,t);let i=Me(o,t,n);if(r==="global")return{kind:"step",scope:"global",step:i};if(r!=="segment")throw TypeError("invalid trace event scope");return{kind:"step",scope:"segment",segmentIndex:e.segmentIndex,step:i}}function Qc(e,t,n){let r=e.result;if(r==="allowed")return Object.freeze({result:"allowed"});if(r!=="blocked")throw TypeError("invalid trace terminal");let o=e.ruleId;return Object.freeze({result:"blocked",reason:Me(e.reason,t,n),segment:Me(e.segment,t,n),...o?{ruleId:Me(o,t,n)}:{}})}function jt(e,t,n,r=0,o=new WeakSet){if(typeof e==="string"){let a=e.slice(0,n.maxTextLength);if(!Bn(a))return;for(let l of Oo(a))for(let c of l.match(/[^\s"'()$]+/g)??[])t.add(Fo(c));return}if(!e||typeof e!=="object"||r>=n.maxDepth||o.has(e))return;if(o.add(e),Array.isArray(e)){let a=Math.min(e.length,n.maxListLength);for(let l=0;l<a;l++)jt(e[l],t,n,r+1,o);return}let i=0,s=new Set;for(let a in e){if(!Object.hasOwn(e,a))continue;if(i>=n.maxObjectProperties)break;i++,jt(a,t,n);let l=Un(a,n,t);if(s.has(l))continue;s.add(l),jt(e[a],t,n,r+1,o)}}function Me(e,t,n,r=0,o=new WeakSet){if(typeof e==="string")return Un(e,t,n);if(!e||typeof e!=="object")return e;if(r>=t.maxDepth)return;if(o.has(e))return;if(o.add(e),Array.isArray(e)){let a=[],l=Math.min(e.length,t.maxListLength);for(let c=0;c<l;c++)a.push(Me(e[c],t,n,r+1,o));return a}let i={},s=0;for(let a in e){if(!Object.hasOwn(e,a))continue;if(s>=t.maxObjectProperties)break;s++;let l=Un(a,t,n);if(Object.hasOwn(i,l))continue;Object.defineProperty(i,l,{value:Me(e[a],t,n,r+1,o),enumerable:!0,configurable:!0,writable:!0})}return i}function Un(e,t,n){let r=e.slice(0,t.maxTextLength),o=Bn(r)?_o(r):r,i=n.size>0?td(o,n):o;return(ed(i)?Io(i):i).slice(0,t.maxTextLength)}function ed(e){return e.includes("PRIVATE KEY")||e.includes("://")||e.includes("eyJ")||e.includes(":")&&/(?:authorization|cookie|x-api-key|api-key|(?:^|\s)(?:-u|--user)(?:\s|=))/i.test(e)||e.length>=14&&Zc.some((t)=>e.includes(t))||e.length>=49&&/\b[a-f0-9]{32}\.[A-Za-z0-9]{16}\b/.test(e)}function td(e,t){return e.replace(/[^\s"'()$]+/g,(n)=>t.has(Fo(n))?"<redacted>":n)}function Fo(e){let t=2166136261,n=2166136261;for(let r=0;r<e.length;r++)t=Math.imul(t^e.charCodeAt(r),16777619),n=Math.imul(n^e.charCodeAt(e.length-r-1),16777619);return`${t>>>0}:${n>>>0}:${e.length}`}function Gn(e){if(e&&typeof e==="object"&&!Object.isFrozen(e)){for(let t of Object.values(e))Gn(t);Object.freeze(e)}return e}function Uo(e,t,n){let r=n??Ho(),o=r.getCommandProgram(e,t.shell??"auto"),i=No(),s=$o(i),a=o.dialect==="powershell"?r.getCommandProgram(e,"posix"):o,l=Mo(a);s.recordGlobal({type:"parse",input:e,segments:l.map((p)=>[...p])});let c=jo(e,{...t,analyzePartialProgram:!0,trace:s},o,r),d=s.getNextSegmentIndex();if(c&&d>0&&d<l.length)s.recordSegment({type:"segment-skipped",index:d,reason:"prior-segment-blocked"},d);return Object.freeze({decision:c,trace:i.finish(c?{result:"blocked",reason:c.reason,segment:c.evidence.find((p)=>p.kind==="command")?.segment??e,...c.ruleId?{ruleId:c.ruleId}:{}}:{result:"allowed"}),program:o})}import{resolve as nd}from"node:path";function qn(e){let t=Go().safeParse(e);return{errors:t.success?[]:qo(t.error.issues),ruleNames:new Set(Bo(e).map((n)=>n.toLowerCase()))}}function Vn(e){let t=zo(e);if(!t.ok)return t.result;return qn(t.parsed)}function zo(e){let t=[],n=new Set;try{let r=typeof e==="string"?pt(e):e,o=x(r);if(o===null)return t.push(`File not found: ${r.path}`),{ok:!1,result:{errors:t,ruleNames:n}};if(!o.trim())return t.push("Config file is empty"),{ok:!1,result:{errors:t,ruleNames:n}};return{ok:!0,parsed:JSON.parse(o)}}catch(r){if(r instanceof N)return t.push(r.message),{ok:!1,result:{errors:t,ruleNames:n}};let o=r instanceof Error?r.message:String(r);return t.push(r instanceof SyntaxError?"Invalid JSON":o),{ok:!1,result:{errors:t,ruleNames:n}}}}function Ko(e){return nd(e??process.cwd(),".safety-net.json")}function le(e){let t=zo(e);if(!t.ok)return t.result;let n=Vo(t.parsed);return{errors:n.errors,ruleNames:n.sources}}import{isAbsolute as rd,join as Ut,relative as od,resolve as Wo,sep as id}from"node:path";async function qe(e={}){let t=er(e);return sd(t,await Gt(t,Ue()))}function sd(e,t){if(!t.ok)return t;let n=J(e),r=[...new Set(ce(n.configPath,n.lockPath,e,n.filesystemScope))];if(r.length===0)return t;return{ok:!1,errors:r,warnings:t.warnings,entries:t.entries}}async function Gt(e,t,n,r={}){let o=null,i=!1;try{let s=J(e),a=Zn(s.configTarget);if(!a.ok)return a.result;let l=a.config;if(e.check)return pd(l,s,e);o={target:s.lockTarget,content:x(s.lockTarget)};let c=Xn(s.lockTarget);if(c.errors.some((L)=>L.startsWith("Unable to access ")))return{ok:!1,errors:c.errors,warnings:[],entries:[]};if(e.only&&c.errors.length>0)return{ok:!1,errors:c.errors,warnings:[],entries:[]};let d=c.errors.length>0?null:c.lock,p=e.only?ti(l,d,e.only):{ok:!0,specs:l.rules};if(!p.ok)return p.result;if(e.only&&!d&&p.specs.length<l.rules.length)return{ok:!1,errors:[`No lockfile available for partial update; run ${Qo}`],warnings:[],entries:[]};let m=(await ld(p.specs,(L)=>ri(L,s.configDir,e,d,s.filesystemScope,t),t)).map((L)=>fd(L,d,n));for(let L of m)hd(L.content,L.entry,s.configDir,e,s.filesystemScope);let u=e.only?md(l,d,m):m.map((L)=>L.entry);i=!0,Z(s.lockTarget,{version:1,rulebooks:u},void 0,r._testAfterPolicyRename);let h=new Map(m.map((L)=>[L.entry.spec,L.rulebook.rules.length])),f=yd(u,s.configDir,e,s.filesystemScope,r);return{ok:!0,errors:[],warnings:f,entries:u.map((L)=>gd(L,h))}}catch(s){if(i&&o)try{je(o.target,o.content)}catch(a){return Ge(a)}return Ge(s)}}async function Qn(e,t={}){return ad(e,er(t),Ue())}async function ad(e,t,n,r={}){let o=null,i=!1;try{let s=J(t),a=x(s.configTarget);o={target:s.configTarget,content:a};let l=Zn(s.configTarget);if(!l.ok)return l.result;let c=l.config,d=Xo(e)?await oi(e,n):[{spec:e}],p=d.map((h)=>h.spec),m=[...new Set([...c.rules,...p])];if(m.length>Jn)return cd();if(m.length!==c.rules.length)i=!0,Z(s.configTarget,{version:1,rules:m,overrides:c.overrides??{},transparent_wrappers:c.transparent_wrappers??[]},void 0,r._testAfterPolicyRename);let u=await Gt(t,n,new Map(d.filter((h)=>!!h.display_ref).map((h)=>[h.spec,h.display_ref])),r);if(!u.ok)je(s.configTarget,a);return u}catch(s){if(i&&o)try{je(o.target,o.content)}catch(a){return Ge(a)}return Ge(s)}}async function ld(e,t,n=Ue()){if(e.length>Jn)throw Error(Yn);let r=Array(e.length),o=0,i,s=Array.from({length:Math.min(e.length,ei.concurrency)},async()=>{while(!i){let a=o;if(a>=e.length)return;o++;try{r[a]=await t(e[a],a,n.controller.signal)}catch(l){if(!i)i={value:l},o=e.length,n.controller.abort(l);return}}});if(await Promise.all(s),i)throw i.value;return r}function cd(){return{ok:!1,errors:[Yn],warnings:[],entries:[]}}function er(e){return{cwd:e.cwd,cacheConfigDir:e.cacheConfigDir,userConfigDir:e.userConfigDir,userConfigPath:e.userConfigPath,projectConfigPath:e.projectConfigPath,global:e.global,check:e.check,only:e.only,refresh:e.refresh}}function dd(e){return{...er(e),deleteSource:e.deleteSource}}async function tr(e,t={}){try{return await ud(e,dd(t),{})}catch(n){return Ge(n)}}async function ud(e,t,n){let r=J(t),o=Y(r.configTarget);if(o.errors.length>0)return{ok:!1,errors:o.errors,warnings:[],entries:[]};if(!o.config)return{ok:!1,errors:[`No config found at ${r.configPath}`],warnings:[],entries:[]};let i=Xn(r.lockTarget);if(i.errors.length>0)return{ok:!1,errors:i.errors,warnings:[],entries:[]};let s=ni(o.config.rules,i.lock,e);if(!s.ok)return s.result;let a=t.deleteSource?Ld(r.configDir,s.specs,i.lock,r.filesystemScope):{ok:!0,dirs:[]};if(!a.ok)return a.result;let l=x(r.configTarget);if(l===null)return Ge(Error("Rules config is unavailable."));try{Z(r.configTarget,{version:1,rules:o.config.rules.filter((p)=>!s.specs.includes(p)),overrides:o.config.overrides??{},transparent_wrappers:o.config.transparent_wrappers??[]},void 0,n._testAfterPolicyRename)}catch(p){throw je(r.configTarget,l),p}let c=await Gt(t,Ue(),void 0,n);if(!c.ok)return je(r.configTarget,l),c;let d=bd(a.dirs,n,r.filesystemScope);if(!d.ok){je(r.configTarget,l);let p=await Gt(t,Ue(),void 0,n);if(!p.ok)return{ok:!1,errors:[...d.result.errors,...p.errors],warnings:p.warnings,entries:p.entries};return d.result}return c}async function pd(e,t,n){let r=ii(e,t.lockPath,t.configDir,n,n.global?"user":"project",t.filesystemScope);return{ok:r.errors.length===0&&r.warnings.length===0,errors:[...r.errors,...r.warnings],warnings:[],entries:r.entries}}function fd(e,t,n){let r=t?.rulebooks.find((i)=>i.spec===e.entry.spec&&i.kind==="github"),o=n?.get(e.entry.spec)??(r?.kind==="github"?r.display_ref:void 0);if(!o||e.entry.kind!=="github")return e;return{...e,entry:{...e.entry,display_ref:o}}}function md(e,t,n){let r=new Set(e.rules),o=new Set(t?.rulebooks.map((s)=>s.spec)??[]),i=new Map(n.map((s)=>[s.entry.spec,s.entry]));return[...(t?.rulebooks.filter((s)=>r.has(s.spec))??[]).map((s)=>i.get(s.spec)??s),...n.filter((s)=>!o.has(s.entry.spec)).map((s)=>s.entry)]}function gd(e,t){return{...e,ruleCount:t.get(e.spec)}}function hd(e,t,n,r,o){let i=Kn(t,Wn(n,r));xe(k(o,i),e)}function yd(e,t,n,r,o){let i=Wn(t,n),s=Bt(i),a=k(r,s),l=Be(a);if(!l)return[];let c=e.map((p)=>k(r,Kn(p,i))),d=l.filter((p)=>p.kind==="directory").map((p)=>({directory:k(r,Ut(s,p.name)),identity:k(r,Ut(s,p.name,Zo))})).filter((p)=>!c.some((m)=>Jo(p.identity,m))).map((p)=>p.directory);for(let p of d)Yo(p);return d.flatMap((p)=>{try{return wd(p,o),[]}catch{return["Unable to prune rules policy cache safely."]}})}function Ld(e,t,n,r){let o=new Map(n?.rulebooks.map((c)=>[c.spec,c])??[]),i=t.flatMap((c)=>{let d=o.get(c);if(!d)return mt.test(c)?[]:["--delete-source can only delete local rulebook sources"];return d.kind==="local-directory"?[]:["--delete-source can only delete local rulebook sources"]}),s=t.map((c)=>{let d=o.get(c);return Ut(e,d?.kind==="local-directory"?d.path:c)}),a=i.length>0?[]:s.flatMap((c)=>vd(e,c,r)),l=[...i,...a];return l.length>0?{ok:!1,result:{ok:!1,errors:l,warnings:[],entries:[]}}:{ok:!0,dirs:s}}function vd(e,t,n){let r=Wo(e),o=Wo(t),i=od(r,o);if(i===""||i===".."||i.startsWith(`..${id}`)||rd(i))return[`Refusing to delete local rulebook source outside ${e}: ${t}`];let s=k(n,o),a=Be(s);if(!a)return[`Local rulebook source directory not found: ${t}`];let l=a.find((c)=>c.name==="rulebook.json");if(!l)return[`Local rulebook source directory is missing rulebook.json: ${t}`];if(l.kind!=="file")throw new N(n.label);if(x(k(n,Ut(o,"rulebook.json"))),a.length>1)return[`Local rulebook source directory contains extra files: ${t}. delete manually if you really want to remove the directory.`];return[]}function bd(e,t,n){let r=e.flatMap((o)=>{try{return xd(k(n,o),t),[]}catch(i){return[`Failed to delete local rulebook source ${o}: ${i instanceof Error?i.message:String(i)}`]}});return r.length>0?{ok:!1,result:{ok:!1,errors:r,warnings:[],entries:[]}}:{ok:!0}}function wd(e,t){if(t._testPruneRulebookCacheDir){t._testPruneRulebookCacheDir(e.path);return}zn(e)}function xd(e,t){if(t._testDeleteLocalSourceDir){t._testDeleteLocalSourceDir(e.path);return}zn(e)}function je(e,t){if(t===null){ft(e);return}xe(e,t)}function Ge(e){return{ok:!1,errors:[e instanceof Error?e.message:String(e)],warnings:[],entries:[]}}function We(e,t){let n=Sd(t),r=ui(n),o={effectiveLevel:r.effectiveLevel,selectedPreset:n.policySnapshot.policy.safety.level??"standard",effectiveCapabilities:r.effectiveCapabilities,destructiveCommandRuleOverrides:n.policySnapshot.policy.destructiveCommandRuleOverrides},{configSource:i,configValid:s}=kd({cwd:t?.cwd,userConfigDir:t?.userConfigDir});if(!e||!e.trim())return{trace:{steps:[{type:"error",message:"No command provided"}],segments:[]},result:"allowed",configSource:i,configValid:s,...o};let a=Dd(e,n);if(a)return{trace:{steps:[],segments:[{index:0,steps:[{type:"rule-check",rule:a.rule,matched:!0,reason:a.reason}]}]},result:"blocked",reason:G(a.reason),segment:G(a.target),...a.ruleId?{ruleId:G(a.ruleId)}:{},configSource:i,configValid:s,...o};let l=Uo(e,n),c=l.decision,d=c?.ruleId??Rd(e,n),p=ht.find((u)=>u.id===d&&u.activationCapability),m=p?r.policy.effectiveDestructiveCommandRules[p.id]:void 0;return{trace:Ed(l.trace),result:c?"blocked":"allowed",reason:c?G(c.reason):void 0,segment:c?G(c.evidence.find((u)=>u.kind==="command")?.segment??e):void 0,ruleId:c?.ruleId?G(c.ruleId):void 0,customRule:Ad(Pd(c?.ruleId,n.policySnapshot)),configSource:i,configValid:s,...o,...p&&m?{ruleActivation:{id:p.id,...m}}:{}}}function kd(e){let t=X(e?.cwd),n=e?.userConfigPath??Q(e),r=ee({cwd:e?.cwd,userConfigDir:e?.userConfigDir,userConfigPath:e?.userConfigPath});try{if(x(r.projectConfigTarget)!==null){if(le(r.projectConfigTarget).errors.length===0)return{configSource:t,configValid:!0};return{configSource:t,configValid:!1}}}catch(o){if(o instanceof N)return{configSource:t,configValid:!1};throw o}try{if(x(r.userConfigTarget)!==null){let o=le(r.userConfigTarget);return{configSource:n,configValid:o.errors.length===0}}return{configSource:null,configValid:!0}}catch(o){if(o instanceof N)return{configSource:n,configValid:!1};throw o}}function Sd(e){let t=Cd(e?.cwd??process.cwd()),n=e?.policySnapshot??B({cwd:t,userConfigDir:e?.userConfigDir}),r=de(n.policy);return{cwd:t,effectiveCwd:t,policySnapshot:n,environment:si(),protectedGitMetadata:di([t]),effectiveCapabilities:r.capabilities,strict:e?.strict??r.strict,paranoidRm:r.paranoidRm,paranoidInterpreters:r.paranoidInterpreters,worktreeMode:r.worktreeMode}}function Dd(e,t){let n=t.cwd??process.cwd(),r=ai(Ke("",{command:e},{kind:"command",shell:"posix"},{executionCwd:n,configCwd:n},e)),o=mi(r);if(o)return{reason:fi,target:o.target,ruleId:"policy-protection",rule:"policy-protection:findPolicyConfigMutationTargetInSemanticFacts"};let i=ci(r,t.protectedGitMetadata);if(i)return{reason:li,target:i.target,ruleId:"git-metadata-protection",rule:"git-metadata-protection:findGitMetadataMutationTargetInSemanticFacts"};let s=t.policySnapshot.policy,a=s.secretProtection.enabled===!1?null:hi(r,s.secretProtection,{strict:t.strict});if(a)return{reason:gi,target:a.target,ruleId:a.ruleId,rule:"secret-protection:findSensitiveTargetInSemanticFacts"};return null}function Rd(e,t){let n=t.policySnapshot.policy,r=yt({...n,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:{...n.destructiveCommandRuleOverrides,...Object.fromEntries(ht.flatMap((o)=>o.activationCapability?[[o.id,"on"]]:[]))}},t.policySnapshot.state==="degraded"?{diagnostics:t.policySnapshot.diagnostics,reason:t.policySnapshot.reason}:void 0);return pi(e,{...t,policySnapshot:r,strict:!0,paranoidRm:!0,paranoidInterpreters:!0})?.ruleId}function Ad(e){if(!e)return;return{id:G(e.id),...e.rulebook?{rulebook:{name:G(e.rulebook.name),version:G(e.rulebook.version)}}:{},...e.source?{source:G(e.source)}:{},...e.override?{override:{type:"reason",reason:G(e.override.reason)}}:{}}}function Ed(e){let t=e.events.flatMap((r)=>r.kind==="step"&&r.scope==="global"?[r.step]:[]),n=new Map;for(let r of e.events){if(r.kind!=="step"||r.scope!=="segment")continue;let o=n.get(r.segmentIndex)??{index:r.segmentIndex,steps:[]};o.steps.push(r.step),n.set(r.segmentIndex,o)}return{steps:t,segments:[...n.values()]}}function Pd(e,t){let n=e?.replace(/^custom\./,"");if(!n||!t.policy.rules.some((r)=>r.name===n))return;return t.ruleMetadata[n]??Object.freeze({id:n})}function Nd(e){let t=Je(),n=T({label:"logs",booleans:{all:["--all"],suspect:["--suspect"],json:["--json"],pruneLegacy:["--prune-legacy"],dryRun:["--dry-run"]},values:{id:["--id"],limit:["--limit"],since:["--since"],agent:["--agent"],rule:["--rule"],session:["--session"],project:["--project"]}},e);if(ae(n.errors))return null;if(n.values.id!==void 0&&!/^[a-f0-9]{16}$/.test(n.values.id))return console.error("--id must be 16 hexadecimal characters"),null;let r=n.values.limit===void 0?20:yi(n.values.limit);if(r===null)return console.error("--limit must be a positive number"),null;let o=n.values.since===void 0?Math.min(30,t):yi(n.values.since);if(o===null||o>t)return console.error(`--since must be a positive number of days no greater than ${t}`),null;let i={limit:r,limitExplicit:n.values.limit!==void 0,since:o,sinceExplicit:n.values.since!==void 0,all:n.flags.all,json:n.flags.json,suspect:n.flags.suspect,pruneLegacy:n.flags.pruneLegacy,dryRun:n.flags.dryRun,id:n.values.id,agent:n.values.agent,rule:n.values.rule,session:n.values.session,project:n.values.project===void 0?void 0:$d(n.values.project)};if(i.id&&(i.agent!==void 0||i.rule!==void 0||i.session!==void 0||i.project!==void 0||i.suspect||i.sinceExplicit||i.limitExplicit))return console.error("--id cannot be combined with --agent, --rule, --session, --project, --suspect, --since, or --limit"),null;if(i.pruneLegacy&&(i.id!==void 0||i.agent!==void 0||i.rule!==void 0||i.session!==void 0||i.project!==void 0||i.suspect||i.all||i.sinceExplicit||i.limitExplicit))return console.error("--prune-legacy cannot be combined with --id, --agent, --rule, --session, --project, --suspect, --all, --since, or --limit"),null;if(i.dryRun&&!i.pruneLegacy)return console.error("--dry-run requires --prune-legacy"),null;return i}async function bi(e,t={}){let n=Nd(e);if(!n)return 1;let r=t.logsDir??ue();if(n.pruneLegacy)return Fd(r,n.json,n.dryRun);if(!r)return console.log(n.json?"[]":n.id?`No retained audit log entry found for id ${I(n.id)}.`:"No audit log entries found."),0;ke(r);let o={count:0},i=ye(r,o).flatMap((d)=>ut(d,o).map((p)=>({entry:p,file:d})));if(o.count>0)console.error(`warning: ${o.count} audit log ${o.count===1?"source":"sources"} could not be read; these results are incomplete`);if(n.id)return Ud(i,n,t.timeZone);let s=Date.now()-n.since*24*60*60*1000,a=i.filter((d)=>Gd(d,n,r,s)),l=n.suspect?jn(a.map((d)=>d.entry)):null,c=(l?a.filter((d)=>l.has(d.entry)):a).sort((d,p)=>Date.parse(p.entry.ts)-Date.parse(d.entry.ts)).slice(0,n.limit);if(n.json)return console.log(JSON.stringify(c.map((d)=>d.entry),null,2)),0;if(c.length===0)return console.log("No audit log entries found."),0;for(let d of c)console.log(Vd(d.entry,t.timeZone));return 0}function Fd(e,t,n){let r=e?Md(e).map((a)=>Od(e,a)):[];if(n)return Hd(r,t);let o=[],i=0,s=0;for(let a of r){let l=Li(a,{throwIfNoEntry:!1})?.size??0,c=jd(a);if(c){o.push(`${vi(a)}: ${c}`);continue}i++,s+=l}if(t)return console.log(JSON.stringify({removedFiles:i,removedBytes:s,failedFiles:o.length})),o.length===0?0:1;console.log(i===0&&o.length===0?"No legacy audit log files found.":`Removed ${i} legacy audit log ${i===1?"file":"files"} (${wi(s)}).`);for(let a of o)console.error(`Could not remove ${I(a)}`);if(console.log("Nested v2 audit logs were not changed."),i>0)console.log("This deletion cannot be undone.");return o.length===0?0:1}function Hd(e,t){let n=e.reduce((r,o)=>r+(Li(o,{throwIfNoEntry:!1})?.size??0),0);if(t)return console.log(JSON.stringify({dryRun:!0,files:e.length,bytes:n})),0;if(console.log(e.length===0?"No legacy audit log files found.":`Would remove ${e.length} legacy audit log ${e.length===1?"file":"files"} (${wi(n)}).`),console.log("Nested v2 audit logs are not included."),e.length>0)console.log("Run the same command without --dry-run to delete them.");return 0}function Md(e){try{return Td(e,{withFileTypes:!0}).filter((t)=>t.isFile()&&t.name.endsWith(".jsonl")).map((t)=>t.name)}catch{return[]}}function jd(e){try{return Id(e),null}catch(t){return t instanceof Error?t.message:String(t)}}function wi(e){let t=["B","KiB","MiB","GiB"],n=Math.min(Math.floor(Math.log2(Math.max(e,1))/10),t.length-1);return`${Math.round(e/1024**n*10)/10} ${t[n]}`}function Ud(e,t,n){let r=e.filter((i)=>i.entry.id===t.id);if(r.length>1)return console.error(`Multiple audit log entries found for id ${I(t.id??"")}.`),1;if(t.json)return console.log(JSON.stringify(r.map((i)=>i.entry),null,2)),0;let o=r[0];if(!o)return console.log(`No retained audit log entry found for id ${I(t.id??"")}.`),0;return console.log(zd(o.entry,n)),0}function Gd(e,t,n,r){if(!t.all&&e.entry.decision==="allow")return!1;if(Date.parse(e.entry.ts)<r)return!1;if(t.agent!==void 0&&e.entry.agent!==t.agent)return!1;if(t.rule!==void 0&&e.entry.ruleId!==t.rule)return!1;if(t.session!==void 0&&!Bd(e,n,t.session))return!1;if(t.project!==void 0&&!qd(e.entry.cwd,t.project))return!1;return!0}function Bd(e,t,n){if(e.entry.sessionId===n)return!0;return _d(e.file)===t&&vi(e.file,".jsonl")===n}function qd(e,t){if(!e)return!1;return e===t||e.startsWith(`${t}/`)}function Vd(e,t){let n=I(e.id??"-"),r=I(e.decision??"deny"),o=e.cwd?`  [${I(e.cwd)}]`:"",i=e.segment||e.command,s=i===e.command?"":"↳ ",a=i.length>50?`${i.slice(0,50)}…`:i;return`${n.padEnd(16)}  ${I(xi(e.ts,t))}  ${r.padEnd(5)}  ${I(e.agent??"-").padEnd(15)}  ${I(e.ruleId??"-").padEnd(20)}  ${s}${I(a)}${o}`}function zd(e,t){let n=(o)=>I(o===void 0||o===null||o===""?"-":o),r=e.shape?`${e.agent??"-"} (shape: ${e.shape})`:e.agent??"-";return[`id:        ${n(e.id)}`,`ts:        ${n(xi(e.ts,t))}`,`decision:  ${n(e.decision)}`,`agent:     ${n(r)}`,`level:     ${n(e.level)}`,`tool:      ${n(e.toolName)}`,`rule:      ${n(e.ruleId)}`,`intent:    ${n(e.intent)}`,`stage:     ${n(e.failureStage)}`,`error:     ${n(e.errorCode)}`,`session:   ${n(e.sessionId)}`,`cwd:       ${n(e.cwd)}`,`version:   ${n(e.v)}`,`truncated: ${n(e.truncated===!0?"yes":void 0)}`,`reason:    ${n(e.reason)}`,`command:   ${n(e.command)}`,`segment:   ${n(e.segment)}`].join(`
`)}function xi(e,t){let n=new Date(e);if(Number.isNaN(n.getTime()))return e;return new Intl.DateTimeFormat("sv-SE",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",timeZone:t}).format(n)}function yi(e){let t=Number(e);return Number.isFinite(t)&&t>0?t:null}var Ci={name:"doctor",aliases:["--doctor"],description:"Run diagnostic checks to verify installation and configuration",usage:"doctor [options]",options:[{flags:"--json",description:"Output diagnostics as JSON"},{flags:"--skip-update-check",description:"Skip npm registry version check"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net doctor","cc-safety-net doctor --json","cc-safety-net doctor --skip-update-check"]};var ki={name:"explain",description:"Show step-by-step analysis trace of how a command would be analyzed",usage:"explain [options] <command>",argument:"<command>",options:[{flags:"--json",description:"Output analysis as JSON"},{flags:"--cwd",argument:"<path>",description:"Use custom working directory"},{flags:"-h, --help",description:"Show this help"}],examples:['cc-safety-net explain "git reset --hard"','cc-safety-net explain --json "rm -rf /"','cc-safety-net explain --cwd /tmp "git status"']};var Si={name:"gui",description:"Open the local policy editor GUI",usage:"gui [options]",options:[{flags:"--no-open",description:"Print the URL without opening a browser"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net gui","cc-safety-net gui --no-open"]};import{isAbsolute as Oi,join as ru,relative as ou}from"node:path";var Kd=8388608;function Wd(e,t){console.log(JSON.stringify(e(Ri(t))))}async function Jd(e){let t;try{t=(await hr(process.stdin)).trim()}catch{e({reason:"Failed to parse hook input JSON."});return}if(!t){e({reason:"Missing hook input JSON."});return}return yr(t,e,"Failed to parse hook input JSON.")}async function hr(e){let t=[],n=0;for await(let r of e){let o=typeof r==="string"?Buffer.from(r,"utf-8"):Buffer.from(r.buffer,r.byteOffset,r.byteLength);if(n+=o.byteLength,n>Kd)throw Yd(e),Error("hook input byte limit exceeded");t.push(o)}return Buffer.concat(t,n).toString("utf-8")}function Yd(e){let t=e.destroy??e.cancel;if(!t)return;try{Promise.resolve(t.call(e)).catch(()=>{})}catch{}}function yr(e,t,n){try{return JSON.parse(e)}catch{t({reason:n});return}}function M(e,t){let n=t.get(e);return n?{kind:"command",shell:n}:{kind:Ei(e)}}function te(e,t,n,r){let o=e===void 0?process.cwd():e,i=typeof o==="string"&&o.trim()!==""?fe([o]):void 0;if(i)return{configCwd:i,executionCwd:i};return O(r,t,n,eu(o)),null}function O(e,t,n,r){let o;try{o=gr(t)}catch(i){if(!(i instanceof pe))throw i}e(qt({command:o,segment:r,toolName:n}))}async function Zd(e){let t=await Jd(e.outputDeny);if(t===void 0)return;if(!t||typeof t!=="object"||Array.isArray(t)){O(e.outputDeny);return}if(!e.isSupported(t))return;let n=e.getAgent?.(t)??e.agent,r=e.agent===n?void 0:e.agent,o=nu(t),i=(u,h)=>{Di(u,()=>e.getSessionId(t),{agent:n,shape:r,toolName:h,cwd:o}),e.outputDeny(u)},s=e.getToolName(t);if(typeof s!=="string"||s.trim()===""){O((u)=>i(u),tu(t));return}let a=s,l=(u)=>i(u,a),c;try{c=e.getToolInput(t,a,l)}catch(u){if(!(u instanceof pe))throw u;O(l,void 0,a);return}if(!c.ok)return;let d=e.getContext(t,c.input,a,l);if(!d)return;let p;try{p=gr(c.input)}catch(u){if(!(u instanceof pe))throw u;O(l,void 0,a);return}let m=Ke(a,c.input,c.route,d,p??null);try{let u=Vt(m,{guard:{auditAllowed:Pi(),dependencies:e.guardDependencies},audit:{agent:n,shape:r,getSessionId:()=>e.getSessionId(t)}}),h=mr(u,{includeEvidence:!0,toolName:u.stage==="command-analysis"?void 0:a});if(h){e.outputDeny(h);return}e.outputAllow?.()}catch(u){if(!(u instanceof Ti))throw u;Xd(u);let h=mr(u.evaluation,{includeEvidence:!0,toolName:u.evaluation.stage==="command-analysis"?void 0:a});if(h)e.outputDeny(h);return}}function Xd(e){if(!Lt(S.debug))return;console.error(`CC Safety Net debug: ${Qd(e.stage)}: ${Ai(e.cause)}`)}function Qd(e){if(e==="policy-protection")return"hook policy protection failed";if(e==="config-load")return"hook config loading failed";if(e==="secret-protection")return"hook secret protection failed";return"hook analysis failed"}function eu(e){return typeof e==="string"?e:void 0}function tu(e){if(!e||typeof e!=="object"||Array.isArray(e))return;if(Object.hasOwn(e,"tool_input"))return e.tool_input;let t=e.toolCall;if(t&&typeof t==="object"&&!Array.isArray(t))return t.args;return}function nu(e){if(!e||typeof e!=="object"||Array.isArray(e))return null;let t=e.cwd;if(typeof t==="string")return t;let n=e.toolCall;if(!n||typeof n!=="object"||Array.isArray(n))return null;let r=n.args;if(!r||typeof r!=="object"||Array.isArray(r))return null;let o=r.Cwd;return typeof o==="string"?o:null}async function j(e){let t=(o)=>Wd(e.createDenyOutput,o),n=e.createAllowOutput;await Zd({...e,outputDeny:t,outputAllow:n?()=>console.log(JSON.stringify(n())):void 0})}function Ct(e){return ru(e,".gemini","config","hooks.json")}var iu=new Map([["run_command","auto"]]),su=new Set(["absolutepath","directorypath","file_path","filepath","path","searchdirectory","searchpath","target_file","targetfile"]);function $i(e){return M(e,iu)}async function Ni(){await j({agent:"antigravity-cli",createDenyOutput:(e)=>({decision:"deny",reason:e}),isSupported:()=>!0,getToolName:(e)=>e.toolCall?.name,getToolInput:(e,t)=>({ok:!0,input:uu(e.toolCall?.args,t),route:$i(t)}),getContext:au,getSessionId:(e)=>e.conversationId})}function au(e,t,n,r){let i=du(e).flatMap((c)=>{let d=fe([c]);return d?[d]:[]});if(!i[0])return Re(r,t,n),null;if(n!=="run_command"){let c;try{c=lu(t,n,i)}catch(d){if(d instanceof pe)return Re(r,void 0,n),null;if(!(d instanceof Se))throw d;return Re(r,t,n),null}if(!c)return Re(r,t,n),null;return{configCwd:c,executionCwd:c}}let s=e.toolCall?.args;if(!s||!Object.hasOwn(s,"Cwd"))return{configCwd:i[0],executionCwd:i[0]};let a=s.Cwd;if(typeof a!=="string"||a.trim()==="")return Re(r,t,n),null;let l=Ae(a,i);if(l){let c=Fi(l,i);if(!c)return Re(r,t,n,a),null;return{configCwd:c,executionCwd:l}}return Re(r,t,n,a),null}function lu(e,t,n){let r=$i(t),o=[...Ii(e,su),...r.kind==="patch"?_i(e):[]].filter(Oi),i=zt(),s=new Set(o.flatMap((a)=>{let l=Fi(wt(a,xt,i),n);return l?[l]:[]}));if(s.size>1)return null;return[...s][0]??n[0]??null}function Fi(e,t){return t.filter((n)=>cu(e,n)).reduce((n,r)=>r.length>n.length?r:n,"")||null}function cu(e,t){let n=ou(t,e);return n===""||!n.startsWith("..")&&!Oi(n)}function Re(e,t,n,r){let o=t&&typeof t==="object"?t.command:void 0;e(qt({command:typeof o==="string"?o:void 0,segment:r,toolName:n}))}function du(e){if(e.workspacePaths===void 0)return[process.cwd()];let t=Array.isArray(e.workspacePaths)?e.workspacePaths.filter((n)=>typeof n==="string"&&n.trim()!==""):[];return fe(t)?t:[]}function uu(e,t){if(!e)return;if(t!=="run_command")return e;return{...e,command:typeof e.CommandLine==="string"&&e.CommandLine!==""?e.CommandLine:void 0}}var kt=[{id:"antigravity-cli",displayName:"Antigravity CLI",doctorOrder:3,runtime:{order:1,flags:["-ac","--agy-cli"],description:"Run as Antigravity CLI PreToolUse hook",legacyTopLevelFlags:[]},install:{order:2,flag:"--agy-cli",artifactKind:"hook config",probeCommand:["agy","--version"]}},{id:"claude-code",displayName:"Claude Code",doctorOrder:1,runtime:{order:2,displayName:"Coding CLI",flags:["-cc","--coding-cli"],legacyFlags:["--claude-code"],description:"Run as Coding CLI PreToolUse hook",legacyTopLevelFlags:["-cc","--claude-code"]},install:{order:3,flag:"--claude-code",artifactKind:"plugin",probeCommand:["claude","--version"]}},{id:"codex",displayName:"Codex",doctorOrder:4,install:{order:4,flag:"--codex",artifactKind:"plugin",probeCommand:["codex","--version"]}},{id:"copilot-cli",displayName:"GitHub Copilot CLI",doctorOrder:7,runtime:{order:5,flags:["-cp","--copilot-cli"],description:"Run as GitHub Copilot CLI PreToolUse hook",legacyTopLevelFlags:["-cp","--copilot-cli"]},install:{order:7,flag:"--copilot-cli",artifactKind:"plugin",probeCommand:["copilot","--binary-version"]}},{id:"gemini-cli",displayName:"Gemini CLI",doctorOrder:6,runtime:{order:4,flags:["-gc","--gemini-cli"],description:"Run as Gemini CLI BeforeTool hook",legacyTopLevelFlags:["-gc","--gemini-cli"]},install:{order:6,flag:"--gemini-cli",artifactKind:"extension",probeCommand:["gemini","--version"]}},{id:"hermes-agent",displayName:"Hermes Agent",doctorOrder:8,runtime:{order:6,flags:["-ha","--hermes-agent"],description:"Run as Hermes Agent pre_tool_call hook",legacyTopLevelFlags:[]},install:{order:8,flag:"--hermes-agent",artifactKind:"plugin",probeCommand:["hermes","--version"]}},{id:"kimi-code",displayName:"Kimi Code",doctorOrder:9,runtime:{order:7,flags:["-kc","--kimi-code"],description:"Run as Kimi Code PreToolUse hook",legacyTopLevelFlags:[]},install:{order:9,flag:"--kimi-code",artifactKind:"hook config",probeCommand:["kimi","--version"]}},{id:"openclaw",displayName:"OpenClaw",doctorOrder:10,install:{order:10,flag:"--openclaw",artifactKind:"plugin",probeCommand:["openclaw","--version"]}},{id:"opencode",displayName:"OpenCode",doctorOrder:11,install:{order:11,flag:"--opencode",artifactKind:"plugin",probeCommand:["opencode","--version"]}},{id:"pi",displayName:"Pi",doctorOrder:12,install:{order:12,flag:"--pi",artifactKind:"package",probeCommand:["pi","--version"]}},{id:"cursor",displayName:"Cursor",doctorOrder:5,runtime:{order:3,flags:["-cu","--cursor"],description:"Run as Cursor preToolUse hook",legacyTopLevelFlags:[]},install:{order:5,flag:"--cursor",artifactKind:"hook config",probeCommand:["cursor","--version"]}},{id:"amp",displayName:"Amp Code",doctorOrder:2,install:{order:1,flag:"--amp",artifactKind:"plugin",probeCommand:["amp","--version"]}}],Kt=kt.slice().sort((e,t)=>e.doctorOrder-t.doctorOrder).map((e)=>e.id),Hi=kt.filter((e)=>("runtime"in e)).slice().sort((e,t)=>e.runtime.order-t.runtime.order).map((e)=>({id:e.id,displayName:"displayName"in e.runtime?e.runtime.displayName:e.displayName,flags:e.runtime.flags,legacyFlags:"legacyFlags"in e.runtime?e.runtime.legacyFlags:[],description:e.runtime.description,legacyTopLevelFlags:e.runtime.legacyTopLevelFlags})),V=kt.slice().sort((e,t)=>e.install.order-t.install.order).map((e)=>({id:e.id,...e.install})).map(({order:e,...t})=>t),K0=Object.fromEntries(kt.map((e)=>[e.id,e.displayName]));function R(e){return kt.find((t)=>t.id===e)?.displayName??e}import{homedir as pu}from"node:os";import{isAbsolute as Mi,join as Lr}from"node:path";function Ui(e){if(e!==void 0&&e!==null&&!Mi(e))return"unknown";try{let t=zt(),n=e?wt(e,xt,t):void 0,r=process.env.HOME||pu(),o=[["codex",process.env.CODEX_HOME||Lr(r,".codex")],["copilot-cli",process.env.COPILOT_HOME||Lr(r,".copilot")],["claude-code",process.env.CLAUDE_CONFIG_DIR||Lr(r,".claude")]],i=n?o.flatMap(([s,a])=>{if(!Mi(a))return[];return ji(n,wt(a,xt,t))?[s]:[]}):[];if(i.length===1)return i[0]??"unknown";if(i.length>1)return"unknown"}catch(t){if(t instanceof Se)return"unknown";return"unknown"}if(process.env.CLAUDECODE==="1"||Boolean(process.env.CLAUDE_CODE_ENTRYPOINT))return"claude-code";return"unknown"}var vr="PreToolUse",Gi="BeforeTool",Bi="pre_tool_call",br="PreToolUse";var fu=new Map([["Bash","posix"],["PowerShell","powershell"]]);function mu(e){return M(e,fu)}async function qi(){await j({agent:"claude-code",getAgent:(e)=>Ui(e.transcript_path),createDenyOutput:(e)=>({hookSpecificOutput:{hookEventName:vr,permissionDecision:"deny",permissionDecisionReason:e}}),isSupported:(e)=>e.hook_event_name===vr,getToolName:(e)=>e.tool_name,getToolInput:(e,t)=>({ok:!0,input:e.tool_input,route:mu(t)}),getContext:(e,t,n,r)=>te(e.cwd,t,n,r),getSessionId:(e)=>e.session_id})}var gu=new Map([["bash","auto"],["Bash","auto"],["powershell","powershell"],["PowerShell","powershell"]]);function hu(e){return M(e,gu)}async function Vi(){await j({agent:"copilot-cli",createDenyOutput:(e)=>({permissionDecision:"deny",permissionDecisionReason:e}),isSupported:()=>!0,getToolName:(e)=>e.toolName,getToolInput:(e,t,n)=>{if(typeof e.toolArgs!=="string")return n({reason:"Failed to parse toolArgs JSON."}),{ok:!1};let r=yr(e.toolArgs,n,"Failed to parse toolArgs JSON.");if(r===void 0)return{ok:!1};return{ok:!0,input:r,route:hu(t)}},getContext:(e,t,n,r)=>te(e.cwd,t,n,r),getSessionId:(e)=>typeof e.sessionId==="string"&&e.sessionId.trim()?e.sessionId:void 0})}var yu=new Map([["Shell","auto"]]);function Lu(e){return M(e,yu)}async function zi(){await j({agent:"cursor",createDenyOutput:(e)=>({permission:"deny",user_message:e,agent_message:e}),createAllowOutput:()=>({permission:"allow"}),isSupported:()=>!0,getToolName:(e)=>e.tool_name,getToolInput:(e,t)=>({ok:!0,input:e.tool_input,route:Lu(t)}),getContext:vu,getSessionId:(e)=>e.conversation_id})}function vu(e,t,n,r){let o=bu(e);if(!o[0])return O(r,t,n),null;let i=Ae(xu(e.cwd),o);if(!i)return O(r,t,n,typeof e.cwd==="string"?e.cwd:void 0),null;if(t===null||typeof t!=="object"||Array.isArray(t))return{configCwd:i,executionCwd:i};if(!Object.hasOwn(t,"working_directory"))return{configCwd:i,executionCwd:i};let s=t.working_directory;if(typeof s!=="string"||s.trim()==="")return O(r,t,n),null;let a=Ae(s,o);if(!a)return O(r,t,n,s),null;return{configCwd:i,executionCwd:a}}function bu(e){return wu(e).flatMap((t)=>{let n=fe([t]);return n?[n]:[]})}function wu(e){if(e.workspace_roots===void 0)return typeof e.cwd==="string"&&e.cwd.trim()!==""?[e.cwd]:[];if(!Array.isArray(e.workspace_roots))return[];return e.workspace_roots.filter((t)=>typeof t==="string"&&t.trim()!=="")}function xu(e){return typeof e==="string"&&e.trim()!==""?e:"."}var Cu=new Map([["run_shell_command","auto"]]);function ku(e){return M(e,Cu)}async function Ki(){await j({agent:"gemini-cli",createDenyOutput:(e)=>({decision:"deny",reason:e,systemMessage:e}),isSupported:(e)=>e.hook_event_name===Gi,getToolName:(e)=>e.tool_name,getToolInput:(e,t)=>({ok:!0,input:e.tool_input,route:ku(t)}),getContext:(e,t,n,r)=>te(e.cwd,t,n,r),getSessionId:(e)=>e.session_id})}import{resolve as Su}from"node:path";var Du=new Map([["terminal","posix"]]);async function Wi(){await j({agent:"hermes-agent",createDenyOutput:(e)=>({action:"block",message:e}),isSupported:(e)=>e.hook_event_name===Bi,getToolName:(e)=>e.tool_name,getToolInput:(e,t)=>({ok:!0,input:e.tool_input,route:M(t,Du)}),getContext:Ru,getSessionId:(e)=>e.session_id})}function Ru(e,t,n,r){let o=te(e.cwd,t,n,r);if(!o)return null;if(!t||typeof t!=="object"||Array.isArray(t))return o;if(!Object.hasOwn(t,"workdir"))return o;let i=t.workdir;if(typeof i!=="string"||i.trim()==="")return O(r,t,n),null;let s=fe([Su(o.configCwd,i)]);if(!s)return O(r,t,n,i),null;return{...o,executionCwd:s}}var Ji=new Map([["Bash","posix"]]);function Au(e){return M(e,Ji)}async function Yi(){await j({agent:"kimi-code",createDenyOutput:(e)=>({hookSpecificOutput:{hookEventName:br,permissionDecision:"deny",permissionDecisionReason:e}}),isSupported:(e)=>e.hook_event_name===br,getToolName:(e)=>e.tool_name,getToolInput:(e,t)=>({ok:!0,input:e.tool_input,route:Au(t)}),getContext:(e,t,n,r)=>{let o=te(e.cwd,t,n,r);if(!o)return null;let i=e.tool_input;if(!Ji.has(n)||!i||!Object.hasOwn(i,"cwd"))return o;let s=i.cwd;if(typeof s!=="string"||s.trim()==="")return O(r,t,n),null;let a=Ae(s,[o.configCwd]);if(!a)return O(r,t,n,s),null;return{configCwd:o.configCwd,executionCwd:a}},getSessionId:(e)=>e.session_id})}var Eu={"antigravity-cli":Ni,"claude-code":qi,"copilot-cli":Vi,cursor:zi,"gemini-cli":Ki,"hermes-agent":Wi,"kimi-code":Yi},Ye=Hi.map((e)=>({...e,run:Eu[e.id]}));function Zi(e){let t=T({label:"hook",booleans:Object.fromEntries(Ye.map((r)=>[r.id,[...r.flags,...r.legacyFlags]]))},e);if(t.errors.length>0)return;let n=Ye.filter((r)=>t.flags[r.id]);return n.length===1?n[0]:void 0}function Xi(e){return Ye.find((t)=>t.legacyTopLevelFlags.some((n)=>n===e))}var Pu=Ye.map((e)=>({flags:e.flags.join(", "),description:e.description})),Tu=Ye.flatMap((e)=>e.flags.map((t)=>`cc-safety-net hook ${t}`)),Qi={name:"hook",description:"Run as an agent CLI hook (reads JSON from stdin)",usage:"hook INTEGRATION_FLAG",options:[...Pu,{flags:"-h, --help",description:"Show this help"}],examples:Tu};var es={name:"install",description:"Install CC Safety Net into a coding agent CLI",usage:"install [TARGET_FLAG]",options:[...V.map((e)=>({flags:e.flag,description:`Install ${R(e.id)} ${e.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net install",...V.map((e)=>`cc-safety-net install ${e.flag}`)]},ts={name:"uninstall",description:"Uninstall CC Safety Net from a coding agent CLI",usage:"uninstall [TARGET_FLAG]",options:[...V.map((e)=>({flags:e.flag,description:`Uninstall ${R(e.id)} ${e.artifactKind}`})),{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net uninstall",...V.map((e)=>`cc-safety-net uninstall ${e.flag}`)]},ns={name:"update",description:"Update every installed CC Safety Net integration to the latest version",usage:"update",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net update"]};var rs={name:"logs",description:"Browse audit log entries recorded by hooks",usage:"logs [options]",options:[{flags:"--id",argument:"<id>",description:"Show one entry from retained history by its 16-character id (not guaranteed once it is older than the configured retention)"},{flags:"--limit",argument:"<n>",description:"Maximum entries to print",default:"20"},{flags:"--since",argument:"<days>",description:"Only include entries newer than this many days (max: the configured audit retention, 1-365)",default:"30"},{flags:"--agent",argument:"<name>",description:"Filter by agent name"},{flags:"--rule",argument:"<ruleId>",description:"Filter by rule id"},{flags:"--session",argument:"<id>",description:"Filter by session id"},{flags:"--project",argument:"<path>",description:"Filter by project path"},{flags:"--suspect",description:"Only denials that look like false positives"},{flags:"--all",description:"Include allow entries"},{flags:"--prune-legacy",description:"Permanently delete all legacy root-level logs; nested logs are untouched"},{flags:"--dry-run",description:"With --prune-legacy, report what would be deleted and delete nothing"},{flags:"--json",description:"Output entries as JSON"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net logs --id 3fa9c2d1a70e8b42","cc-safety-net logs --agent claude-code","cc-safety-net logs --project . --since 7","cc-safety-net logs --suspect --since 7","cc-safety-net logs --json","cc-safety-net logs --prune-legacy --dry-run","cc-safety-net logs --prune-legacy"]};var Ze={name:"rule",description:"Manage CC Safety Net rule config and rulebook sources",usage:"rule <subcommand>",subcommands:[{usage:"init [--example]",description:"Create inert rule config"},{usage:"add <source>",description:"Add a rulebook source and sync"},{usage:"remove <source>",description:"Remove a rulebook source and sync"},{usage:"update [source]",description:"Refresh rulebook lock/cache state"},{usage:"sync",description:"Sync configured rulebooks"},{usage:"list",description:"List active rulebooks"},{usage:"wrapper add <command>",description:"Trust a transparent command wrapper"},{usage:"wrapper remove <command>",description:"Remove a transparent command wrapper"},{usage:"wrapper list",description:"List transparent command wrappers"},{usage:"migrate [--cleanup]",description:"Migrate legacy inline rules"},{usage:"doc",description:"Print the rulebook authoring guide"},{usage:"verify",description:"Validate rule config files"}],options:[{flags:"-g, --global",description:"Use user-scope rule config"},{flags:"--check",description:"Check without changing lock/cache state"},{flags:"--cleanup",description:"Delete legacy files after rule migrate verifies them"},{flags:"--delete-source",description:"Delete clean local source directory on remove"},{flags:"--example",description:"Create an inactive example rulebook with rule init"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net rule init","cc-safety-net rule init --example","cc-safety-net rule wrapper add rtk","cc-safety-net rule add project-rules","cc-safety-net rule sync","cc-safety-net rule migrate --cleanup","cc-safety-net rule verify"]};var os={name:"status",description:"Show what the runtime is enforcing right now",usage:"status",options:[{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net status"]};var is={name:"statusline",description:"Print status line with mode indicators for shell integration",usage:"statusline --claude-code",options:[{flags:"-cc, --claude-code",description:"Print status line for Claude Code"},{flags:"-h, --help",description:"Show this help"}],examples:["cc-safety-net statusline -cc","cc-safety-net statusline --claude-code"]};var Wt=[os,Ci,rs,ki,Ze,es,ns,ts,Qi,Si,is];function Iu(e){return e.aliases??[]}function Jt(e){let t=e.toLowerCase();return Wt.find((n)=>n.name.toLowerCase()===t||Iu(n).some((r)=>r.toLowerCase()===t))}import{readFileSync as _u}from"node:fs";import{basename as Ou}from"node:path";function Yt(e=7,t=ue()){let n=Date.now()-e*24*60*60*1000,r=[],o=new Set,i=0,s,a,l,c;if(t)ke(t);let d={count:0},p=t?ye(t,d):[];for(let u of p)try{let f=_u(u,"utf-8").trim().split(`
`).filter(Boolean);for(let L of f)try{let v=JSON.parse(L);if(v.decision==="allow")continue;let w=new Date(v.ts).getTime();if(w>=n){if(i++,o.add(v.sessionId??Ou(u,".jsonl")),a===void 0||w<=a)s=v.ts,a=w;if(c===void 0||w>c)l=v.ts,c=w;$u(r,v,w)}}catch{d.count++}}catch{d.count++}let m=r.map((u)=>({timestamp:u.ts,command:u.command,reason:u.reason,relativeTime:Mn(new Date(u.ts))}));return{totalBlocked:i,sessionCount:o.size,recentEntries:m,oldestEntry:s,newestEntry:l,unreadable:d.count}}function $u(e,t,n){let r=e.findIndex((o)=>n>new Date(o.ts).getTime());if(r===-1){if(e.length<3)e.push(t);return}if(e.splice(r,0,t),e.length>3)e.pop()}import{dirname as Nu}from"node:path";function ss(e,t,n,r,o){let i;try{if(x(r)===null)return{path:e,exists:!1,valid:!1,ruleCount:0};i=le(r),i.errors.push(...ce(e,t,{userConfigDir:n},o))}catch(s){if(!(s instanceof N))throw s;i={errors:[s.message],ruleNames:new Set}}return{path:e,exists:!0,valid:i.errors.length===0,ruleCount:i.ruleNames.size,...i.errors.length>0?{errors:i.errors}:{}}}function Fu(e,t){return{source:t,name:e.name,command:e.command,subcommand:e.subcommand,blockArgs:[...e.block_args],reason:e.reason}}function as(e,t){let n=t?.userConfigPath??Q(),r=t?.projectConfigPath??X(e),o=Nu(n),i=Le({cwd:e,userConfigPath:n,projectConfigPath:r,userConfigDir:o}),s=ee({cwd:e,userConfigPath:n,projectConfigPath:r,userConfigDir:o}),a=new Map(i.rulebooks.flatMap((l)=>l.rules.map((c)=>[c,l.source])));return{userConfig:ss(n,Ve({userConfigPath:n}),o,s.userConfigTarget,s.userScope),projectConfig:ss(r,ze(r),o,s.projectConfigTarget,s.projectScope),effectiveRules:i.rules.map((l)=>Fu(l,a.get(l.name)??"project")),shadowedRules:[]}}var Hu=[{flag:S.level,description:"Safety level preset: standard, strict, or paranoid",defaultBehavior:"standard"},{flag:S.strict,description:"Legacy; equivalent to safety.overrides.fail_closed",defaultBehavior:"permissive"},{flag:S.paranoid,description:"Legacy; equivalent to safety.overrides.paranoid_rm and paranoid_interpreters",defaultBehavior:"off"},{flag:S.paranoidRm,description:"Legacy; equivalent to safety.overrides.paranoid_rm",defaultBehavior:"off"},{flag:S.paranoidInterpreters,description:"Legacy; equivalent to safety.overrides.paranoid_interpreters",defaultBehavior:"off"},{flag:S.worktree,description:"Allow local git discards in linked worktrees",defaultBehavior:"off"},{flag:S.debug,description:"Print diagnostic messages to stderr",defaultBehavior:"off"},{flag:S.auditScope,description:"Command decisions recorded: all, or blocked (privacy-minimizing, denials only)",defaultBehavior:"all"}];function ls(){return[...Hu.map((e)=>({name:e.flag.name,value:ur(e.flag),isSet:pr(e.flag),legacyName:e.flag.legacyName,legacyValue:e.flag.legacyName?process.env[e.flag.legacyName]:void 0,legacyIsSet:e.flag.legacyName?process.env[e.flag.legacyName]!==void 0:void 0,description:e.description,defaultBehavior:e.defaultBehavior})),{name:"CC_SAFETY_NET_HOME",value:process.env.CC_SAFETY_NET_HOME,isSet:process.env.CC_SAFETY_NET_HOME!==void 0,description:"Override user-scope config/cache directory",defaultBehavior:"~/.cc-safety-net"}]}var cs={error:0,warning:1,info:2},Mu=["policy","config","audit"];function ju(e){return e.map((t)=>{if(t==="ownership")return"is not owned by the current user";if(t==="permissions")return"has unsafe permissions";if(t==="symlink")return"is a symbolic link";return"is not a directory"}).join(" and ")}var Uu=[{derive:(e)=>e.hooks.length>0&&e.hooks.every((t)=>!t.configured)?[{checkId:"integration.none-configured",severity:"error",title:"No integration configured",detail:"CC Safety Net is not connected to any supported coding-agent integration.",fixHint:"Run `cc-safety-net install` and configure at least one integration."}]:[]},{derive:(e)=>e.hooks.filter((t)=>t.inspectionStatus==="failed").map((t)=>{let n=R(t.platform);return{checkId:"integration.inspection-failed",severity:"error",title:`${n} inspection failed`,detail:`Doctor could not verify the ${n} integration configuration.`,fixHint:`Correct the reported ${n} configuration error, then run \`cc-safety-net doctor\` again.`,integration:t.platform}})},{derive:(e)=>e.userConfig.exists&&!e.userConfig.valid?[{checkId:"config.user-invalid",severity:"error",title:"User configuration is invalid",detail:"Doctor could not load a valid user rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:e.userConfig.path}]:[]},{derive:(e)=>e.projectConfig.exists&&!e.projectConfig.valid?[{checkId:"config.project-invalid",severity:"error",title:"Project configuration is invalid",detail:"Doctor could not load a valid project rules configuration.",fixHint:"Run `cc-safety-net rule verify`, correct the reported error, then rerun doctor.",path:e.projectConfig.path}]:[]},{derive:(e)=>e.configState.state==="degraded"?[{checkId:"config.runtime-degraded",severity:"warning",title:"Runtime is enforcing a fallback configuration",detail:`The rejected candidate configuration is not active: ${e.configState.reason}`,fixHint:"Correct the named source, run `cc-safety-net rule sync` for a rule source, then rerun doctor."}]:[]},{derive:(e)=>{let t=e.environment.find((n)=>n.name==="CC_SAFETY_NET_AUDIT_SCOPE");return dr(t?.value)==="invalid"?[{checkId:"environment.audit-scope-invalid",severity:"warning",title:"Audit scope value is invalid",detail:"CC_SAFETY_NET_AUDIT_SCOPE is not `all` or `blocked`, so allowed command decisions are not recorded.",fixHint:"Set CC_SAFETY_NET_AUDIT_SCOPE to `all` or `blocked`, then restart the integration."}]:[]}},...Mu.map((e)=>({derive:(t)=>t.posture.directories.filter((n)=>n.kind===e&&n.status==="unsafe").map((n)=>({checkId:`posture.${e}-directory-unsafe`,severity:"error",title:`${e[0]?.toUpperCase()}${e.slice(1)} directory is unsafe`,detail:`The ${e} directory ${ju(n.issues)}.`,fixHint:"Ensure this is a real directory owned by the current user with no group or other write access, then rerun doctor.",...n.path?{path:n.path}:{}}))})),{derive:(e)=>{let t=[...e.effectiveSafety.weakenedRuleOverrides].sort();return t.length>0?[{checkId:"posture.rule-overrides-weaken-preset",severity:"warning",title:"Rule overrides weaken the selected preset",detail:`Explicit overrides disable rules the resolved preset would enable: ${t.join(", ")}.`,fixHint:`Remove these \`off\` overrides or set them to \`on\`: ${t.join(", ")}.`}]:[]}}];function ds(e){return Uu.flatMap((t,n)=>t.derive(e).map((r,o)=>({finding:r,catalogOrder:n,occurrence:o}))).sort((t,n)=>cs[t.finding.severity]-cs[n.finding.severity]||t.catalogOrder-n.catalogOrder||t.occurrence-n.occurrence).map((t)=>t.finding)}function ne(){return Boolean(process.stdout.isTTY&&!process.env.NO_COLOR)}var Gu=(e)=>ne()?`\x1B[32m${e}\x1B[0m`:e,Bu=(e)=>ne()?`\x1B[33m${e}\x1B[0m`:e,qu=(e)=>ne()?`\x1B[34m${e}\x1B[0m`:e,Vu=(e)=>ne()?`\x1B[35m${e}\x1B[0m`:e,zu=(e)=>ne()?`\x1B[36m${e}\x1B[0m`:e,Ku=(e)=>ne()?`\x1B[31m${e}\x1B[0m`:e,Wu=(e)=>ne()?`\x1B[2m${e}\x1B[0m`:e,Ju=(e)=>ne()?`\x1B[1m${e}\x1B[0m`:e,g={green:Gu,yellow:Bu,blue:qu,magenta:Vu,cyan:zu,red:Ku,dim:Wu,bold:Ju},Yu="\x1B[0m",Zu=[39,82,198,226,208,51,196,46,201,214,93,154,220,27,49,190,200,33,129,227,45,160,63,118,123,202];function Xu(e){let t=e;return()=>(t=(t*1664525+1013904223)%4294967296,t/4294967296)}function Qu(e){let t=[...Zu],n=Xu(e);for(let r=t.length-1;r>0;r--){let o=Math.floor(n()*(r+1)),i=t[r];t[r]=t[o],t[o]=i}return t}function ep(e,t=0){if(!ne())return"";let n=Qu(t);return`\x1B[38;5;${n[e%n.length]}m`}function us(e,t,n=0){if(!ne())return`"${e}"`;return`${ep(t,n)}"${e}"${Yu}`}var tp=new RegExp("\x1B\\[[0-9;]*m","g"),wr=(e)=>e.replace(tp,"").length;function Ee(e){let t=(e.headers??e.rows[0]??[]).map((s,a)=>{let l=Math.max(...e.rows.map((c)=>wr(c[a]??"")));return Math.max(wr(s),l)}),n=(s,a)=>s+" ".repeat(Math.max(0,a-wr(s))),r=(s,a)=>a[0]+t.map((l)=>s.repeat(l+2)).join(a[1])+a[2],o=(s)=>`│ ${s.map((a,l)=>n(a,t[l]??0)).join(" │ ")} │`,i=e.headers?[`   ${o(e.headers)}`,`   ${r("─",["├","┼","┤"])}`]:[];return[`   ${r("─",["┌","┬","┐"])}`,...i,...e.rows.map((s)=>`   ${o(s)}`),`   ${r("─",["└","┴","┘"])}`].join(`
`)}function ps(e){let t=[];t.push("Hook Integration"),t.push(np(e));let n=[],r=[];for(let o of e){let i=R(o.platform);if(o.errors&&o.errors.length>0)for(let s of o.errors)if(o.configured)n.push({platform:i,message:s});else r.push({platform:i,message:s})}for(let o of n)t.push(`   Warning (${o.platform}): ${o.message}`);for(let o of r)t.push(g.red(`   Error (${o.platform}): ${o.message}`));return t.join(`
`)}function np(e){let t=["Platform","Discovery","Configuration","Inspection"],n=e.map((r)=>{let o=R(r.platform);if(r.inspectionStatus==="not-inspected"){let l=g.dim("Not inspected");return[o,l,l,l]}let i=r.detected?g.green("Detected"):r.inspectionStatus==="failed"?g.red("Unknown"):g.dim("Not detected"),s=r.configured?g.green("Configured"):r.detected?g.yellow("Not configured"):r.inspectionStatus==="failed"?g.red("Unknown"):g.dim("Not applicable"),a=r.inspectionStatus==="verified"?g.green("Verified"):r.inspectionStatus==="failed"?g.red("Failed"):g.dim("Not applicable");return[o,i,s,a]});return Ee({headers:t,rows:n})}function fs(e){let n=["Guard Engine Verification",`   Synthetic self-test: ${e.failed>0?g.red(`${e.passed}/${e.total} FAIL`):g.green(`${e.passed}/${e.total} passed`)}`],r=e.results.filter((o)=>!o.passed);if(r.length>0){n.push(""),n.push(g.red("   Failures:"));for(let o of r)n.push(g.red(`   • ${o.description}`)),n.push(g.red(`     expected ${o.expected}, got ${o.actual}`))}return n.join(`
`)}function rp(e){if(e.length===0)return"   (no custom rules)";let t=["Source","Name","Command","Block Args"],n=e.map((r)=>[r.source,r.name,r.subcommand?`${r.command} ${r.subcommand}`:r.command,r.blockArgs.join(", ")]);return Ee({headers:t,rows:n})}function ms(e){let t=[];if(t.push("Configuration"),t.push(op(e.userConfig,e.projectConfig)),t.push(""),e.effectiveRules.length>0)t.push(`   Effective rules (${e.effectiveRules.length} total):`),t.push(rp(e.effectiveRules));else t.push("   Effective rules: (none - using built-in rules only)");for(let n of e.shadowedRules)t.push(""),t.push(`   Note: Project rule "${n.name}" shadows user rule with same name`);return t.join(`
`)}function op(e,t){let n=["Scope","Status"],r=(i)=>{if(!i.exists)return g.dim("N/A");if(!i.valid)return g.red(`Invalid (${i.errors?.[0]??"unknown error"})`);return g.green("Configured")},o=[["User",r(e)],["Project",r(t)]];return Ee({headers:n,rows:o})}function gs(e){let t=[];return t.push("Environment"),t.push(ip(e)),t.join(`
`)}function hs(e){let t=["Effective Safety",`   Selected preset: ${e.effectiveSafety.selectedPreset}`,`   Effective: ${e.effectiveSafety.level}`],n=[["fail_closed","fail_closed"],["paranoid_rm","paranoid_rm"],["paranoid_interpreters","paranoid_interpreters"]];for(let[r,o]of n){let i=e.effectiveSafety.capabilities[r],s=i.enabled?g.green("ON"):g.dim("OFF"),a=i.sources.length>0?` (${i.sources.join(", ")})`:"";t.push(`   ${o}: ${s} via ${i.source}${a}`)}t.push(`   Stored rule customizations: ${e.effectiveSafety.ruleCounts.stored}`),t.push(`   Effective rule customizations: ${e.effectiveSafety.ruleCounts.effective}`);for(let[r,o]of Object.entries(e.effectiveSafety.ruleOverrides))t.push(`   ${r}: ${o}`);return t.join(`
`)}function ys(e){let t=["Findings"];if(e.length===0)return t.push("   No findings from inspected doctor facts."),t.join(`
`);for(let n of e){let r=`[${n.severity.toUpperCase()}] ${n.checkId}: ${I(n.title)}`,o=n.severity==="error"?g.red:n.severity==="warning"?g.yellow:g.blue;if(t.push(`   ${o(r)}`),t.push(`      ${I(n.detail)}`),n.path)t.push(`      Path: ${I(n.path)}`);if(n.fixHint)t.push(`      Fix: ${I(n.fixHint)}`)}return t.join(`
`)}function ip(e){let t=["Variable","Status","Legacy"],n=e.map((r)=>{let o=r.isSet?g.green("✓"):g.dim("✗"),i=r.legacyName&&r.legacyIsSet?`${r.legacyName} ${g.green("✓")}`:r.legacyName??"";return[r.name,o,i]});return Ee({headers:t,rows:n})}function Ls(e){let t=[];if(e.totalBlocked===0)t.push("Recent Activity"),t.push("   No blocked commands in the last 7 days"),t.push("   Tip: This is normal for new installations");else t.push(`Recent Activity · last 7 days (${e.totalBlocked} blocked / ${e.sessionCount} sessions)`),t.push(sp(e.recentEntries));if(e.unreadable>0)t.push(`   Warning: ${e.unreadable} audit log ${e.unreadable===1?"source":"sources"} could not be read; this summary is incomplete`);return t.join(`
`)}function sp(e){let t=["Time","Command"],n=e.map((r)=>{let o=I(r.command.replace(/\r\n|\r|\n/g," ↵ ").replace(/\t/g," ")),i=o.length>40?`${o.slice(0,37)}...`:o;return[r.relativeTime,i]});return Ee({headers:t,rows:n})}function vs(e){let t=[];if(t.push("Update Check"),e.latestVersion===null&&!e.error)return t.push(Zt([["Status",g.dim("Skipped")],["Installed",e.currentVersion]])),t.join(`
`);if(e.error)return t.push(Zt([["Status",`${g.yellow("⚠")} Error`],["Installed",e.currentVersion],["Error",g.dim(e.error)]])),t.join(`
`);if(e.updateAvailable)return t.push(Zt([["Status",`${g.yellow("⚠")} Update Available`],["Current",e.currentVersion],["Latest",g.green(e.latestVersion??"")]])),t.push(""),t.push("   Run: bunx cc-safety-net@latest doctor"),t.push("   Or:  npx cc-safety-net@latest doctor"),t.join(`
`);return t.push(Zt([["Status",`${g.green("✓")} Up to date`],["Version",e.currentVersion]])),t.join(`
`)}function Zt(e){return Ee({rows:e})}function bs(e){let t=[];return t.push("System Info"),t.push(ap(e)),t.join(`
`)}function ap(e){let t=["Component","Version"],n=(i)=>{if(i===null)return g.dim("not found");return i},o=[{label:"cc-safety-net",value:e.version},...Kt.map((i)=>({label:R(i),value:e.versions[i]??null})),{label:"Node.js",value:e.nodeVersion},{label:"npm",value:e.npmVersion},{label:"Bun",value:e.bunVersion},{label:"Platform",value:e.platform}].map((i)=>[i.label,n(i.value)]);return Ee({headers:t,rows:o})}function ws(e){if(e.findings.length===0)return g.green(`
No findings from inspected doctor facts.`);let t={error:e.findings.filter((i)=>i.severity==="error").length,warning:e.findings.filter((i)=>i.severity==="warning").length,info:e.findings.filter((i)=>i.severity==="info").length},n=["error","warning","info"].filter((i)=>t[i]>0).map((i)=>`${t[i]} ${i}`),r=e.findings.length===1?"finding":"findings",o=`
${e.findings.length} ${r}: ${n.join(", ")}.`;if(t.error>0)return g.red(o);if(t.warning>0)return g.yellow(o);return g.blue(o)}import{lstatSync as lp}from"node:fs";import{dirname as xr}from"node:path";function Cr(e,t){try{let n=lp(t);if(n.isSymbolicLink())return{kind:e,path:t,status:"unsafe",issues:["symlink"]};if(!n.isDirectory())return{kind:e,path:t,status:"unsafe",issues:["not-directory"]};if(process.platform==="win32"||typeof process.getuid!=="function")return{kind:e,path:t,status:"unknown",issues:[]};let r=[...n.uid!==process.getuid()?["ownership"]:[],...(n.mode&18)!==0?["permissions"]:[]];return{kind:e,path:t,status:r.length>0?"unsafe":"safe",issues:r}}catch(n){if(typeof n==="object"&&n!==null&&"code"in n&&n.code==="ENOENT")return{kind:e,path:t,status:"not-applicable",issues:[]};return{kind:e,path:t,status:"unknown",issues:[]}}}function xs(e){let t=ue();return{directories:[Cr("policy",xr(xr(e))),Cr("config",xr(e)),...t?[Cr("audit",t)]:[{kind:"audit",status:"unknown",issues:[]}]]}}import{spawn as cp}from"node:child_process";import{existsSync as Cs}from"node:fs";import{delimiter as dp,extname as up,join as pp}from"node:path";import{stripVTControlCharacters as ks}from"node:util";var Ds="2.0.10",fp=5000,mp="_CC_SAFETY_NET_TEST_SPAWN_PLATFORM";function P(){return Ds}function kr(e,t){let n=e[t];if(n)return n;let r=Object.keys(e).find((o)=>o.toLowerCase()===t.toLowerCase()&&!!e[o]);return r?e[r]:n}function gp(e){return(kr(e,"PATHEXT")||".COM;.EXE;.BAT;.CMD").split(";").filter((t)=>t.length>0)}function hp(e,t){let n=up(e)?[e]:[...gp(t).map((r)=>`${e}${r}`),e];if(e.includes("/")||e.includes("\\"))return n.find((r)=>Cs(r))??e;return(kr(t,"PATH")??"").split(dp).flatMap((r)=>n.map((o)=>pp(r,o))).find((r)=>Cs(r))??e}function Ss(e){if(!/[\s"&|<>^]/.test(e))return e;return`"${e.replace(/"/g,'""')}"`}function Pe(e,t){let[n,...r]=e,o=t[mp]==="win32"?"win32":process.platform;if(!n||o!=="win32")return{cmd:n??"",args:r};let i=hp(n,t);if(!/\.(?:bat|cmd)$/i.test(i))return{cmd:i,args:r};return{cmd:kr(t,"COMSPEC")??"cmd.exe",args:["/d","/c",["call",Ss(i),...r.map(Ss)].join(" ")]}}var Xe=async(e,t=fp)=>{let n=await yp(e,{timeoutMs:t});if(n.code!==0)return null;return ks(n.stdout).trim()||ks(n.stderr).trim()||null};function yp(e,t){let[n,...r]=e;if(!n)return Promise.resolve({code:null,stdout:"",stderr:""});return new Promise((o)=>{try{let i=Pe([n,...r],process.env),s=cp(i.cmd,i.args,{stdio:["ignore","pipe","pipe"]}),a=!1,l="",c="";s.stdout.on("data",(m)=>{l+=m.toString()}),s.stderr.on("data",(m)=>{c+=m.toString()});let d=(m)=>{if(a)return;a=!0,clearTimeout(p),o(m)},p=setTimeout(()=>{s.kill(),d({code:null,stdout:l,stderr:c})},t.timeoutMs);s.on("close",(m)=>{d({code:m,stdout:l,stderr:c})}),s.on("error",()=>{d({code:null,stdout:l,stderr:c})})}catch{o({code:null,stdout:"",stderr:""})}})}function Xt(e){if(!e)return null;let t=/Claude Code\s+(\d+\.\d+\.\d+)/i.exec(e);if(t)return t[1]??null;let n=/v?(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/i.exec(e);if(n)return n[1]??null;return e.split(`
`)[0]?.trim()||null}async function St(e=Xe){let[t,n,r,o,i,s]=await Promise.all([Promise.all(V.map(async(a)=>[a.id,Xt(await e([...a.probeCommand]))])),e(["codex","plugin","list"],30000),e(["amp","plugins","list"],30000),e(["node","--version"]),e(["npm","--version"]),e(["bun","--version"])]);return{version:Ds,versions:Object.fromEntries(t),codexPluginListOutput:n,ampPluginListOutput:r,nodeVersion:Xt(o),npmVersion:Xt(i),bunVersion:Xt(s),platform:`${process.platform} ${process.arch}`}}function Sr(e,t){if(t==="dev")return!1;let n=e.split(".").map(Number),r=t.split(".").map(Number),[o=0,i=0,s=0]=n,[a=0,l=0,c=0]=r;if(o!==a)return o>a;if(i!==l)return i>l;return s>c}async function Qe(){let e=P(),t=new AbortController,n=setTimeout(()=>t.abort(),3000);try{let r=await fetch("https://registry.npmjs.org/cc-safety-net/latest",{signal:t.signal});if(!r.ok)return{currentVersion:e,latestVersion:null,updateAvailable:!1,error:`npm registry returned ${r.status}`};let o=await r.json(),i=Sr(o.version,e);return{currentVersion:e,latestVersion:o.version,updateAvailable:i}}catch(r){return{currentVersion:e,latestVersion:null,updateAvailable:!1,error:r instanceof Error?r.message:"Network error"}}finally{clearTimeout(n)}}import*as Os from"node:readline";var Ps=(e)=>`\x1B[${e}B`,Lp=(e)=>`\x1B[${e}A`;var Rs=["░","▒","▓","╱","╲","┃","━","┏","┓","┗","┛","╋"];function vp(e){return new Promise((t)=>setTimeout(t,e))}function bp(e,t,n){if(!n)return t(e);if(n.aborted)return Promise.resolve();return new Promise((r,o)=>{let i=()=>n.removeEventListener("abort",s),s=()=>{i(),r()};n.addEventListener("abort",s,{once:!0}),t(e).then(()=>{i(),r()},(a)=>{i(),o(a)})})}function Dt(e,t){return e&&e>0?e:t}function Qt(e){return Math.max(0,Math.min(1,e))}function et(e){return Math.max(0,Math.min(255,Math.round(e)))}function Dr(e){return e<=0.0031308?12.92*e:1.055*e**0.4166666666666667-0.055}function wp(e,t,n){let r=n*Math.PI/180,o=t*Math.cos(r),i=t*Math.sin(r),s=(e+0.3963377774*o+0.2158037573*i)**3,a=(e-0.1055613458*o-0.0638541728*i)**3,l=(e-0.0894841775*o-1.291485548*i)**3;return{blue:et(Dr(Qt(-0.0041960863*s-0.7034186147*a+1.707614701*l))*255),green:et(Dr(Qt(-1.2684380046*s+2.6097574011*a-0.3413193965*l))*255),red:et(Dr(Qt(4.0767416621*s-3.3077115913*a+0.2309699292*l))*255)}}function Rr(e,t){let n=(t*e*180/Math.PI%360+360)%360;return wp(0.72,0.15,n)}function Ts(e,t=0.1){let n=Rr(t,e);return`\x1B[38;2;${n.red};${n.green};${n.blue}m`}function xp(e,t){return{blue:et(e.blue+(255-e.blue)*t),green:et(e.green+(255-e.green)*t),red:et(e.red+(255-e.red)*t)}}function Is(e,t,n){let r=Math.imul(e+2654435769,2246822507)^Math.imul(t+3266489909,668265263)^Math.imul(n+374761393,2654435761),o=r^r>>>15,i=Math.imul(o,739982445),s=i^i>>>12,a=Math.imul(s,695872825);return((a^a>>>15)>>>0)/4294967296}function Cp(e,t,n){let r=Math.floor(Is(e,t,n)*Rs.length);return Rs[r]??"░"}function As(e){let t=Qt(e);return t*t*t*(t*(t*6-15)+10)}function kp(e){if(e.length===0)return"";let t=[],n=!1,r="";for(let o of e){let i=`${o.red};${o.green};${o.blue}`;if(o.bold!==n)t.push(o.bold?"\x1B[1m":"\x1B[22m"),n=o.bold;if(i!==r)t.push(`\x1B[38;2;${i}m`),r=i;t.push(o.character)}return`${t.join("")}\x1B[22m\x1B[39m`}function Sp(e,t,n,r,o){return e.map((i,s)=>({...Rr(n,r+t+s/o),bold:!1,character:i}))}function Dp(e,t,n,r,o,i,s,a){let l=Math.max(1,r*0.75),c=Math.min(1,n/l),d=o*As(c),p=Math.max(0,(n-l)/Math.max(1,r-l)),m=(1-As(n/r))*a*2,u=0.35*Math.max(0,1-p*2),h=c>=1,f=Math.min(e.length,Math.ceil(d+2+1));return e.slice(0,f).map((L,v)=>{let w=Rr(i,s+t+v/a+m),y=v+Is(t,v,7919)*2-1;if(y>d+2)return{...w,bold:!1,character:" "};let C=d-y,H=0.8*Math.exp(-(C*C)/12.5),he=Math.min(0.9,H+u),Fn=!h&&y>d-4;return{...xp(w,he),bold:he>0.3,character:Fn?Cp(t,v,n):L}})}function Es(e){return`\x1B[?2026h${e.map((t,n)=>`\x1B8${n>0?Ps(n):""}${kp(t)}`).join("")}\x1B[?2026l`}async function Ar(e,t={}){if(!e)return;let n=t.output??process.stdout,r=t.sleep??vp,o=Dt(t.frequency,0.1),i=t.seed??0,s=Dt(t.speed,40),a=Dt(t.spread,3),l=Dt(t.frameRate,60),c=Math.max(1,Math.floor(Dt(t.duration,12))),d=e.split(`
`).map((f)=>Array.from(f)),p=Math.max(...d.map((f)=>f.length)),m=1000*c*d.filter((f)=>f.length>0).length/s,u=p>0?Math.max(1,Math.ceil(m/(1000/l))):0,h=u>0?m/u:0;n.write(`\x1B[?25l${d.length>1?`${`
`.repeat(d.length-1)}${Lp(d.length-1)}`:""}\x1B7`);try{for(let f=1;f<=u;f+=1){if(t.signal?.aborted)break;n.write(Es(d.map((L,v)=>Dp(L,v,f,u,p,o,i,a)))),await bp(h,r,t.signal)}}finally{if(n.write(Es(d.map((f,L)=>Sp(f,L,o,i,a)))),n.write("\x1B8"),d.length>1)n.write(Ps(d.length-1));n.write(`
\x1B[0m\x1B[?25h`)}}var _s=["┏━┛┏━┛  ┏━┛┏━┃┏━┛┏━┛━┏┛┃ ┃  ┏━ ┏━┛━┏┛","┃  ┃    ━━┃┏━┃┏━┛┏━┛ ┃ ━┏┛  ┃ ┃┏━┛ ┃ ","━━┛━━┛  ━━┛┛ ┛┛  ━━┛ ┛  ┛   ┛ ┛━━┛ ┛ "].join(`
`);function Rp(e){return Boolean(e.isTTY)}async function Rt(e={}){let t=e.output??process.stdout;if(!Rp(t))return;let n=e.input??process.stdin,r={duration:e.duration,frequency:e.frequency,output:t,seed:e.seed??Math.random()*8192,sleep:e.sleep,speed:e.speed,spread:e.spread};if(!n.isTTY||typeof n.setRawMode!=="function"){await Ar(_s,r);return}let o=new AbortController,i=n.readableFlowing===!0,s=n.isRaw===!0,a=!1,l=(c,d)=>{if(d.ctrl&&d.name==="c")a=!0;if(a||d.name==="return"||d.name==="enter")o.abort()};Os.emitKeypressEvents(n),n.on("keypress",l),n.setRawMode(!0),n.resume();try{await Ar(_s,{...r,signal:o.signal})}finally{if(n.off("keypress",l),n.setRawMode(s),!i)n.pause()}if(!a)return;if(e.onInterrupt){e.onInterrupt();return}process.kill(process.pid,"SIGINT")}var $s="\r\x1B[2K",Ap="\x1B[?25l",Ep="\x1B[39m",Pp="\x1B[?25h",Tp=100,Ip=0.55,_p=80,Ns=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];function Op(e){return new Promise((t)=>setTimeout(t,e))}async function en(e,t={}){let n=t.output??process.stdout;if(!n.isTTY)return e;let r=t.sleep??Op,o=!1,i=e.then((a)=>(o=!0,a),(a)=>{throw o=!0,a});if(await Promise.race([i.then(()=>!0),r(Tp).then(()=>!1)]))return i;n.write(Ap);try{for(let a=0;!o;a+=1)n.write(`${$s}${Ts(a*Ip)}${Ns[a%Ns.length]}${Ep} ${t.loadingMessage??"Loading…"}`),await Promise.race([i,r(_p)]);return await i}finally{n.write(`${$s}${Pp}`)}}async function At(e,t,n,r={}){let o=t();if(e)await n();if(e&&o.ready)await en(o.ready,r);return o.finish()}import{homedir as tf}from"node:os";import{stripVTControlCharacters as $p}from"node:util";var tn="amp plugins list",Np=/^\s*[✓✗]\s+cc-safety-net(?:\.ts)?\s+\(User Plugins\)\s+(\S+)\s*$/;function Fs(e){if(!e.ampPluginListOutput)return{platform:"amp",status:"n/a"};let t=$p(e.ampPluginListOutput).split(`
`).map((n)=>Np.exec(n)?.[1]).find((n)=>n!==void 0);if(!t)return{platform:"amp",status:"n/a"};if(t!=="active")return{platform:"amp",status:"disabled",method:tn,configPath:tn,errors:[`Amp personal plugin cc-safety-net is ${t}; run "plugins: reload" in Amp or reinstall with install --amp`]};return{platform:"amp",status:"configured",method:tn,configPath:tn}}import{existsSync as Fp,readFileSync as Hp}from"node:fs";var Mp=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*(?:--agy-cli|-ac)(\s|["']|$)/;function jp(e){if(!e||typeof e!=="object"||Array.isArray(e))return[];return Object.values(e).flatMap((t)=>{if(!t||typeof t!=="object"||Array.isArray(t))return[];let n=t,r=n.PreToolUse;if(!Array.isArray(r))return[];return r.flatMap((o)=>{if(!o||typeof o!=="object"||Array.isArray(o))return[];let i=o.hooks;if(!Array.isArray(i))return[];return i.flatMap((s)=>{if(!s||typeof s!=="object"||Array.isArray(s))return[];let a=s.command;if(typeof a!=="string"||!Mp.test(a))return[];return[{command:a,enabled:n.enabled!==!1}]})})})}function Hs(e){let t=Ct(e.homeDir);if(!Fp(t))return{platform:"antigravity-cli",status:"n/a",configPath:t};let n;try{n=jp(JSON.parse(Hp(t,"utf-8")))}catch(r){return{platform:"antigravity-cli",status:"n/a",configPath:t,errors:[`Failed to parse Antigravity hooks config ${t}: ${r instanceof Error?r.message:String(r)}`]}}if(n.some((r)=>r.enabled))return{platform:"antigravity-cli",status:"configured",method:"hook config",configPath:t};if(n.length>0)return{platform:"antigravity-cli",status:"disabled",method:"hook config",configPath:t};return{platform:"antigravity-cli",status:"n/a",configPath:t}}import{join as Ms}from"node:path";import{existsSync as Up,lstatSync as Gp,readFileSync as Bp}from"node:fs";function re(e,t=(n)=>n){if(!Up(e))return{kind:"missing"};try{return{kind:"ok",value:JSON.parse(t(Bp(e,"utf-8")))}}catch{return{kind:"unreadable"}}}function E(e){try{return Gp(e)}catch{return}}function nn(e,t){let n=E(t);if(!n)return{platform:e,status:"n/a",configPath:t};if(!n.isSymbolicLink()&&n.isDirectory())return;return{platform:e,status:"n/a",configPath:t,errors:[`${t} is a symlink or not a directory; move or remove it before installing`]}}function b(e,t){return typeof e==="object"&&e!==null?e[t]:void 0}var Er="cc-safety-net@cc-marketplace";function js(e){return Ms(e,".claude","plugins","installed_plugins.json")}function Us(e,t){let n=b(b(e,"plugins"),t);return Array.isArray(n)&&n.length>0}function rn(e,t){let n=re(js(e));return n.kind==="ok"&&Us(n.value,t)}function Pr(e){let t=js(e),n=re(t);if(n.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(n.kind==="missing")return{platform:"claude-code",status:"n/a"};if(!Us(n.value,Er))return{platform:"claude-code",status:"n/a"};let r=Ms(e,".claude","settings.json"),o=re(r);if(o.kind==="unreadable")return{platform:"claude-code",status:"not-inspected"};if(!(o.kind==="ok"&&b(b(o.value,"enabledPlugins"),Er)===!0))return{platform:"claude-code",status:"disabled",method:"plugin config",configPath:r,errors:[`${Er} is installed but not enabled in Claude Code`]};return{platform:"claude-code",status:"configured",method:"plugin config",configPath:t}}function Gs(e){return Pr(e.homeDir)}function Bs(e){if(!e.codexPluginListOutput)return{platform:"codex",status:"n/a"};let t=e.codexPluginListOutput.split(`
`).find((n)=>n.includes("https://github.com/kenryu42/cc-safety-net.git"));if(!t)return{platform:"codex",status:"n/a"};if(!t.includes("installed,"))return{platform:"codex",status:"n/a"};if(!t.includes("installed, enabled"))return{platform:"codex",status:"disabled",method:"codex plugin list",configPath:"codex plugin list",errors:["Codex plugin line for https://github.com/kenryu42/cc-safety-net.git must contain installed, enabled."]};return{platform:"codex",status:"configured",method:"codex plugin list",configPath:"codex plugin list"}}import{existsSync as an,readdirSync as qp,readFileSync as Vp}from"node:fs";import{join as F}from"node:path";var oe="cc-safety-net@cc-marketplace",on=["cc-marketplace","cc-safety-net"],qs=["_direct","copilot-safety-net"],Vs=["cc-marketplace","safety-net"],zs="safety-net@cc-marketplace";function sn(e,t){let n=t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");return new RegExp(`(^|[^a-z0-9-])${n}([^a-z0-9-]|$)`,"m").test(e??"")}function Ks(e){return sn(e,"cc-safety-net@cc-marketplace")}function Ws(e){return sn(e,"cc-marketplace")}function Js(e){return sn(e,"copilot-safety-net")}function Ys(e){return sn(e,"safety-net@cc-marketplace")}function q(e){let t="",n=0,r=!1,o=!1,i=-1;while(n<e.length){let s=e[n],a=e[n+1];if(o){t+=s,o=!1,n++;continue}if(s==='"'&&!r){r=!0,i=-1,t+=s,n++;continue}if(s==='"'&&r){r=!1,t+=s,n++;continue}if(s==="\\"&&r){o=!0,t+=s,n++;continue}if(r){t+=s,n++;continue}if(s==="/"&&a==="/"){while(n<e.length&&e[n]!==`
`)n++;continue}if(s==="/"&&a==="*"){n+=2;while(n<e.length-1){if(e[n]==="*"&&e[n+1]==="/"){n+=2;break}n++}continue}if(s===","){i=t.length,t+=s,n++;continue}if(s==="}"||s==="]"){if(i!==-1){let l=t.slice(i+1);if(/^\s*$/.test(l))t=t.slice(0,i)+l}i=-1,t+=s,n++;continue}if(!/\s/.test(s))i=-1;t+=s,n++}return t}function Tr(e){if(!e?.includes("cc-safety-net"))return!1;return/(^|\s)hook\s+(?:[^\s]+\s+)*(--copilot-cli|-cp)(\s|$)/.test(e)}function Xs(e,t){if(!e)return null;let n=e.match(/(\d+)\.(\d+)\.(\d+)/);if(!n)return null;let r=[Number(n[1]),Number(n[2]),Number(n[3])];for(let o=0;o<t.length;o++){let i=r[o]??0,s=t[o]??0;if(i!==s)return i>s}return!0}function zp(e){return Xs(e,[0,0,422])}function Kp(e){return Xs(e,[1,0,8])}function Et(e){return process.env.COPILOT_HOME||F(e,".copilot")}function Ir(e){return(e.hooks?.preToolUse??[]).some((n)=>{if(n.type!=="command")return!1;return Tr(n.command)||Tr(n.bash)||Tr(n.powershell)})}function _r(e,t){try{return JSON.parse(q(Vp(e,"utf-8")))}catch(n){t?.push(`Failed to parse ${e}: ${n instanceof Error?n.message:String(n)}`);return}}function Qs(e,t){try{return qp(e).filter((n)=>n.endsWith(".json")).sort((n,r)=>n.localeCompare(r))}catch(n){return t?.push(`Failed to read ${e}: ${n instanceof Error?n.message:String(n)}`),[]}}function Wp(e,t){if(!an(e))return[];let n=[];for(let r of Qs(e,t)){let o=F(e,r),i=_r(o,t);if(i&&Ir(i))n.push(o)}return n}function tt(e,t){if(!an(e))return;let n=_r(e,t);if(!n)return;return{path:e,config:n}}function Zs(e,t,n,r){if(t){e.push(`GitHub Copilot CLI ${t} does not support ${n}; requires ${r}+`);return}e.push(`GitHub Copilot CLI version unavailable; skipping ${n} because it requires ${r}+`)}function Jp(e){for(let t of e){if(t?.config.disableAllHooks===!0)return t.path;if(t?.config.disableAllHooks===!1)return}return}function Yp(e,t,n,r){let o=Et(e),i=F(t,".github","hooks"),s=F(o,"hooks"),a=F(t,".github","copilot"),l=F(t,".claude"),c=Kp(n),d=c===!0?r:void 0,p=[tt(F(a,"settings.local.json"),d),tt(F(a,"settings.json"),d),tt(F(l,"settings.local.json"),d),tt(F(l,"settings.json"),d)],m=[tt(F(o,"settings.json"),d),tt(F(o,"config.json"),d)];if(c!==!1){let C=Jp([...p,...m]);if(C){if(c===null)r.push(`GitHub Copilot CLI version unavailable; treating disableAllHooks in ${C} as active`);return{activeConfigPaths:[],disabledBy:C}}}let u=Wp(i,r),h=zp(n),f=h===!0?r:void 0,L=an(s)?Qs(s,f):[],v=[];for(let C of L){let H=F(s,C),he=_r(H,f);if(he&&Ir(he))v.push(H)}if(h!==!0&&v.length>0)Zs(r,n,`user hook files in ${s}`,"0.0.422"),v.length=0;let w=[];for(let C of[...p,...m]){if(!C)continue;if(!Ir(C.config))continue;if(c===!0){w.push(C);continue}Zs(r,n,"inline hook definitions in Copilot config files","1.0.8");break}let y=(C)=>C.filter((H)=>!!H&&w.includes(H)).map((H)=>H.path);return{activeConfigPaths:[...y(p),...u,...y(m),...v]}}function ea(e){let t=[],n=Yp(e.homeDir,e.cwd,e.copilotCliVersion,t);if(n.disabledBy)return{platform:"copilot-cli",status:"disabled",method:"hook config",configPath:n.disabledBy,configPaths:[n.disabledBy],errors:t.length>0?t:void 0};let r=Et(e.homeDir),o=F(r,"installed-plugins",...on),i=an(o),s=F(r,"settings.json"),a=re(s,q);if(i&&a.kind==="unreadable")return{platform:"copilot-cli",status:"not-inspected"};if(i&&a.kind==="ok"&&b(b(a.value,"enabledPlugins"),oe)===!1)return{platform:"copilot-cli",status:"disabled",method:"plugin config",configPath:s,errors:[`${oe} is installed but not enabled in Copilot CLI`]};if(i||n.activeConfigPaths.length>0){let l=i,c=n.activeConfigPaths[0];return{platform:"copilot-cli",status:"configured",method:l?"plugin config":"hook config",configPath:c??(l?o:void 0),configPaths:n.activeConfigPaths.length>0?n.activeConfigPaths:void 0,errors:t.length>0?t:void 0}}return{platform:"copilot-cli",status:"n/a",errors:t.length>0?t:void 0}}import{existsSync as s2,readFileSync as a2}from"node:fs";import{existsSync as ta,mkdirSync as Qp,readFileSync as e2}from"node:fs";import{dirname as t2,join as n2}from"node:path";import{renameSync as Zp,writeFileSync as Xp}from"node:fs";function _(e,t){let n=`${e}.${process.pid}.tmp`;Xp(n,t),Zp(n,e)}var Pt="npx -y cc-safety-net hook --cursor",na=30;function cn(e){return n2(e,".cursor","hooks.json")}function Te(e){return typeof e==="object"&&e!==null&&!Array.isArray(e)}function Or(){return{command:Pt,timeout:na,failClosed:!0}}function ln(e){return Te(e)&&e.command===Pt}function r2(e){return Object.keys(e).length===3&&e.command===Pt&&e.timeout===na&&e.failClosed===!0}function o2(e){try{return JSON.parse(e2(e,"utf-8"))}catch(t){if(t instanceof SyntaxError)throw Error(`Failed to parse Cursor hooks config ${e}: ${t.message}`);throw t}}function ra(e){let t=o2(e);if(!Te(t))throw Error(`Cursor hooks config ${e} must be a JSON object`);if(t.version!==1)throw Error(`Cursor hooks config ${e} must set "version": 1`);if(t.hooks!==void 0&&!Te(t.hooks))throw Error(`Cursor hooks config ${e} "hooks" must be an object`);let n=Te(t.hooks)?t.hooks.preToolUse:void 0;if(n!==void 0&&!Array.isArray(n))throw Error(`Cursor hooks config ${e} "hooks.preToolUse" must be an array`);return t}function oa(e){let t=Te(e.hooks)?e.hooks.preToolUse:void 0;return Array.isArray(t)?t:[]}function i2(e){if(!e.some(ln))return[...e,Or()];return e.reduce((t,n)=>{if(!ln(n))return t.result.push(n),t;if(!t.inserted)t.result.push(Or()),t.inserted=!0;return t},{result:[],inserted:!1}).result}function ia(e,t,n){let r=Te(t.hooks)?t.hooks:{},o={...t,hooks:{...r,preToolUse:n}};_(e,`${JSON.stringify(o,null,2)}
`)}function sa(e){let t=cn(e);if(!ta(t))return Qp(t2(t),{recursive:!0}),_(t,`${JSON.stringify({version:1,hooks:{preToolUse:[Or()]}},null,2)}
`),{path:t,alreadyInstalled:!1};let n=ra(t),r=oa(n),o=r.filter(ln);if(Te(n.hooks)&&Array.isArray(n.hooks.preToolUse)&&o.length===1&&o[0]!==void 0&&r2(o[0]))return{path:t,alreadyInstalled:!0};return ia(t,n,i2(r)),{path:t,alreadyInstalled:!1}}function aa(e){let t=cn(e);if(!ta(t))return{path:t,alreadyInstalled:!1};let n=ra(t),r=oa(n),o=r.filter((i)=>!ln(i));if(o.length===r.length)return{path:t,alreadyInstalled:!1};return ia(t,n,o),{path:t,alreadyInstalled:!0}}function l2(e){if(!e||typeof e!=="object"||Array.isArray(e))return[];let t=e.hooks;if(!t||typeof t!=="object"||Array.isArray(t))return[];let n=t.preToolUse;if(!Array.isArray(n))return[];return n.filter((r)=>!!r&&typeof r==="object"&&!Array.isArray(r)&&r.command===Pt)}function c2(e){let t=[];if(e.length>1)t.push("Multiple managed cc-safety-net hooks found; reinstall to collapse duplicates");let n=e[0];if(n&&n.failClosed!==!0)t.push('Managed hook is missing "failClosed": true; reinstall to repair');if(n&&n.timeout!==30)t.push('Managed hook "timeout" is not 30; reinstall to repair');return t}function la(e){let t=cn(e.homeDir);if(!s2(t))return{platform:"cursor",status:"n/a",configPath:t};let n;try{n=JSON.parse(a2(t,"utf-8"))}catch(i){return{platform:"cursor",status:"n/a",configPath:t,errors:[`Failed to parse Cursor hooks config ${t}: ${i instanceof Error?i.message:String(i)}`]}}let r=l2(n);if(r.length===0)return{platform:"cursor",status:"n/a",configPath:t};let o=c2(r);return{platform:"cursor",status:"configured",method:"hook config",configPath:t,errors:o.length>0?o:void 0}}import{existsSync as d2}from"node:fs";import{join as $r}from"node:path";var Nr="gemini-safety-net";function Fr(e){let t=$r(e,".gemini","extensions"),n=$r(t,Nr);if(!d2(n))return{platform:"gemini-cli",status:"n/a"};let r=$r(t,"extension-enablement.json"),o=re(r);if(o.kind==="unreadable")return{platform:"gemini-cli",status:"not-inspected"};let i=o.kind==="ok"?b(b(o.value,Nr),"overrides"):void 0;if(Array.isArray(i)&&i.some((a)=>typeof a==="string"&&a.startsWith("!")))return{platform:"gemini-cli",status:"disabled",method:"extension config",configPath:r,errors:[`${Nr} is disabled in Gemini CLI`]};return{platform:"gemini-cli",status:"configured",method:"extension config",configPath:n}}function ca(e){return Fr(e.homeDir)}import{readFileSync as La}from"node:fs";import{join as va}from"node:path";var z="cc-safety-net",da="# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent";function ua(e){return`# cc-safety-net managed Hermes Agent plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --hermes-agent
# version: ${e}
`}function u2(e){return`${ua(e)}name: cc-safety-net
version: "${e}"
description: "Block destructive commands and secret-file access before Hermes runs a tool."
author: "cc-safety-net"
provides_hooks:
  - pre_tool_call
`}function p2(e){return`${ua(e)}"""CC Safety Net guard for Hermes Agent.

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
ANALYZER = ["npx", "-y", "cc-safety-net", "hook", "--hermes-agent"]
TIMEOUT_SECONDS = ${"30"}


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
            # outlive a kill aimed at npx alone and keep holding the pipes captured here.
            start_new_session=True,
        )
    except OSError as error:
        return _block("analysis could not start (%s)." % error)

    try:
        stdout, _ = process.communicate(payload, timeout=TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except OSError:
            pass
        try:
            process.communicate(timeout=TIMEOUT_SECONDS)
        except subprocess.TimeoutExpired:
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
`}function Tt(e){return[{name:"__init__.py",content:p2(e)},{name:"plugin.yaml",content:u2(e)}]}import{mkdirSync as f2,readdirSync as m2,readFileSync as g2,rmSync as Hr}from"node:fs";import{join as Ie}from"node:path";var h2="__pycache__";function Mr(e){let t=process.env.HERMES_HOME?.trim();return t?t:Ie(e,".hermes")}function jr(e){return Ie(Mr(e),"plugins",z)}function Ur(e){return e.startsWith(da)}function Gr(e,t){let n=jr(e),r=E(n);if(r&&(r.isSymbolicLink()||!r.isDirectory()))throw Error(`Refusing to ${t} ${n}: not a regular directory. Move or remove it and rerun ${t==="install"?"install":"uninstall"} --hermes-agent.`);return n}function pa(e,t){let n=E(e);if(!n)return;if(n.isSymbolicLink()||!n.isFile())throw Error(`Refusing to ${t} ${e}: not a regular file. Move or remove it.`);let r=g2(e,"utf-8");if(!Ur(r))throw Error(`Refusing to ${t} unmanaged file at ${e}. Move or remove it.`);return r}function fa(e){let t=Gr(e,"install"),n=Tt(P());if(n.map((o)=>pa(Ie(t,o.name),"overwrite")).every((o,i)=>o===n[i]?.content))return{path:t,alreadyInstalled:!0};return f2(t,{recursive:!0}),n.forEach((o)=>{_(Ie(t,o.name),o.content)}),{path:t,alreadyInstalled:!1}}function Br(e){let t=Gr(e,"remove");if(!E(t))return[];return Tt(P()).filter((n)=>pa(Ie(t,n.name),"remove")!==void 0)}function ma(e){let t=Gr(e,"remove");if(!E(t))return{path:t,alreadyInstalled:!1};let n=Br(e);if(n.forEach((r)=>{Hr(Ie(t,r.name))}),Hr(Ie(t,h2),{recursive:!0,force:!0}),m2(t).length===0)Hr(t,{recursive:!0});return{path:t,alreadyInstalled:n.length>0}}var dn="hermes-agent",ga=/^([^\s#][^:]*):/,y2=/^\s+([A-Za-z_][\w-]*):/,ha=/^\s+-\s*(.*)$/;function L2(e){return e.trim().replace(/^(["'])(.*)\1$/,"$2")}function v2(e){let t=e.split(/\r?\n/),n=t.findIndex((i)=>ga.exec(i)?.[1]?.trim()==="plugins");if(n===-1)return[];let r=t.slice(n+1),o=r.findIndex((i)=>ga.test(i));return o===-1?r:r.slice(0,o)}function ya(e,t){let n=v2(e),r=n.findIndex((s)=>y2.exec(s)?.[1]===t);if(r===-1)return[];let o=n.slice(r+1),i=o.findIndex((s)=>!ha.test(s));return(i===-1?o:o.slice(0,i)).map((s)=>L2(ha.exec(s)?.[1]??""))}function b2(e){try{return La(va(Mr(e),"config.yaml"),"utf-8")}catch{return}}function qr(e){let t=b2(e)??"";return ya(t,"enabled").includes(z)&&!ya(t,"disabled").includes(z)}function ba(e){return/^# version:\s*(.+)$/m.exec(e)?.[1]?.trim()}function w2(e,t){let n=E(e);if(!n)return{error:`${t.name} is missing from ${e}; run install --hermes-agent`};if(n.isSymbolicLink()||!n.isFile())return{error:`${e} is a symlink or not a regular file; move or remove it`};try{let r=La(e,"utf-8");if(!Ur(r))return{error:`Unmanaged ${t.name} occupies ${e}; move or remove it`};if(ba(r)===P()&&r!==t.content)return{error:`Modified ${t.name} occupies ${e}; run install --hermes-agent to restore it`};return{content:r}}catch(r){return{error:`Failed to read ${e}: ${r instanceof Error?r.message:String(r)}`}}}function wa(e){let t=jr(e.homeDir),n=nn(dn,t);if(n)return n;let r=Tt(P()).map((a)=>w2(va(t,a.name),a)),o=r.flatMap((a)=>("error"in a)?[a.error]:[]);if(o.length>0)return{platform:dn,status:"n/a",configPath:t,errors:o};let i=r.some((a)=>("content"in a)&&ba(a.content)!==P()),s=i?["Installed Hermes Agent plugin is outdated; run install --hermes-agent to update"]:[];if(!qr(e.homeDir))return{platform:dn,status:"disabled",method:"plugin directory",configPath:t,errors:[`${z} is not enabled in Hermes; run \`hermes plugins enable ${z}\``,...s]};return{platform:dn,status:"configured",method:"plugin directory",configPath:t,errors:i?s:void 0}}import{existsSync as x2,readFileSync as C2}from"node:fs";import{join as xa}from"node:path";var k2=/cc-safety-net\s+hook\s+(?:[^\s]+\s+)*--kimi-code(\s|["']|$)/;function S2(e){return xa(process.env.KIMI_CODE_HOME||xa(e,".kimi-code"),"config.toml")}function It(e){let t=S2(e.homeDir);if(!x2(t))return{platform:"kimi-code",status:"n/a",configPath:t};try{if(!k2.test(C2(t,"utf-8")))return{platform:"kimi-code",status:"n/a",configPath:t}}catch(n){return{platform:"kimi-code",status:"n/a",configPath:t,errors:[`Failed to read ${t}: ${n instanceof Error?n.message:String(n)}`]}}return{platform:"kimi-code",status:"configured",method:"hook config",configPath:t}}import{readFileSync as Ia}from"node:fs";import{join as Ot}from"node:path";var A="cc-safety-net",K="index.js",nt="openclaw.plugin.json",rt="package.json";var un="// cc-safety-net managed OpenClaw plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --openclaw";import{existsSync as A2,lstatSync as E2,readdirSync as P2,readFileSync as T2}from"node:fs";import{dirname as Sa,join as ve}from"node:path";import{fileURLToPath as I2}from"node:url";import{spawn as D2}from"node:child_process";function R2(e){return e.join(" ")}function Vr(e,t,n){return[`Failed to run ${R2(e)}${t===null?"":` (exit ${t})`}.`,n.trim()].filter(Boolean).join(`
`)}function zr(e){let t={stdout:"",stderr:""};return e.stdout.setEncoding("utf-8"),e.stderr.setEncoding("utf-8"),e.stdout.on("data",(n)=>{t.stdout+=n}),e.stderr.on("data",(n)=>{t.stderr+=n}),t}function ie(e,t){return new Promise((n,r)=>{let o=Pe([...e],process.env),i=D2(o.cmd,o.args,{stdio:["ignore","pipe","pipe"]}),s=zr(i),a=()=>[s.stdout,s.stderr].filter(Boolean).join(`
`),l=t?.timeoutMs??120000,c=setTimeout(()=>{i.kill(),r(Error(Vr(e,null,`Timed out after ${l}ms.
${a()}`.trim())))},l);i.on("error",(d)=>{clearTimeout(c),r(Error(Vr(e,null,`${d.message}
${a()}`.trim())))}),i.on("close",(d)=>{if(clearTimeout(c),d!==0){r(Error(Vr(e,d,a())));return}n(t?.stdoutOnly?s.stdout:a())})})}async function Kr(e){for(let t of e)await ie(t)}async function Ca(e){for(let t of e)try{await ie(t)}catch(n){console.warn(n instanceof Error?n.message:String(n))}}var ka=ve("openclaw",A),_2=[K,nt,rt];function Wr(e,t){if(e==="~")return t;if(e.startsWith("~/")||e.startsWith("~\\"))return ve(t,e.slice(2));return e}function Da(e){let t=process.env.OPENCLAW_STATE_DIR?.trim();if(t)return Wr(t,e);let n=process.env.OPENCLAW_CONFIG_PATH?.trim();return n?Sa(Wr(n,e)):ve(e,".openclaw")}function Ra(e){let t=process.env.OPENCLAW_CONFIG_PATH?.trim();return t?Wr(t,e):ve(Da(e),"openclaw.json")}function Jr(e){return ve(Da(e),"extensions",A)}function O2(e){let t=P2(e);if(t.length===0)return!0;if(t.some((o)=>!_2.includes(o)))return!1;let n=ve(e,K),r=E(n);return r!==void 0&&!r.isSymbolicLink()&&r.isFile()&&T2(n,"utf-8").startsWith(un)}function Yr(e){let t=Jr(e),n=E(t);if(!n)return;if(!n.isSymbolicLink()&&n.isDirectory()&&O2(t))return;throw Error(`Refusing to modify ${t}: it does not hold a cc-safety-net managed OpenClaw plugin. Move or remove it, then run the command again.`)}function Aa(){let e=Sa(I2(import.meta.url));return[ve(e,"..",ka),ve(e,"..","..","..","dist",ka)]}function Zr(e=Aa()){return e.find((t)=>A2(t)&&E2(t).isDirectory())}function $2(e=Aa()){let t=Zr(e);if(!t)throw Error("Packaged OpenClaw plugin directory not found. Reinstall cc-safety-net and try again.");return t}function Ea(e=$2()){return[["openclaw","plugins","install",e,"--force"],["openclaw","plugins","enable",A]]}function N2(e){let t=(()=>{try{return JSON.parse(e)}catch{return}})(),n=b(b(t,"plugin"),"status");return typeof n==="string"?n:void 0}async function Pa(){let e=N2(await ie(["openclaw","plugins","inspect",A,"--runtime","--json"],{stdoutOnly:!0}));if(e==="loaded")return;throw Error(`${e===void 0?`The ${A} plugin's load state could not be verified: OpenClaw's runtime inspect report was unreadable.`:`OpenClaw reports the ${A} plugin with status "${e}".`} Run \`openclaw plugins inspect ${A} --runtime\` for details.`)}var pn="openclaw",_t=`run \`openclaw plugins enable ${A}\``;function ot(e,t){let n=Ot(e,t),r=E(n);if(!r)return{error:`${t} is missing from ${n}; run install --openclaw`};if(r.isSymbolicLink()||!r.isFile())return{error:`${n} is a symlink or not a regular file; move or remove it`};try{return{content:Ia(n,"utf-8")}}catch(o){return{error:`Failed to read ${n}: ${o instanceof Error?o.message:String(o)}`}}}function _a(e){try{return JSON.parse(q(e))}catch{return}}function F2(e){let t=ot(e,nt);if("error"in t)return t.error;if(b(_a(t.content),"id")===A)return;return`${Ot(e,nt)} is not a valid ${A} manifest; run install --openclaw`}function H2(e){let t=ot(e,rt);if("error"in t)return t.error;let n=b(b(_a(t.content),"openclaw"),"extensions");if(Array.isArray(n)&&n.includes(`./${K}`))return;return`${Ot(e,rt)} does not point OpenClaw at ${K}; run install --openclaw`}function Ta(e){return Array.isArray(e)?e.filter((t)=>typeof t==="string"):[]}function M2(e){let t=Ra(e);if(!E(t))return`${A} is not enabled; ${_t}`;let n=(()=>{try{return JSON.parse(q(Ia(t,"utf-8")))}catch{return}})();if(n===void 0)return`Failed to read ${t}; fix it, then ${_t}`;let r=b(n,"plugins");if(b(r,"enabled")===!1)return`plugins.enabled is false in ${t}; no OpenClaw plugin loads`;let o=b(b(b(r,"entries"),A),"enabled");if(Ta(b(r,"deny")).includes(A)||o===!1)return`${A} is disabled in ${t}; ${_t}`;let i=Ta(b(r,"allow"));if(i.length>0&&!i.includes(A))return`plugins.allow in ${t} does not list ${A}; add it, then ${_t}`;if(i.includes(A)||o===!0)return;return`${A} is not enabled; ${_t}`}function Oa(e){return/^\/\/ version:\s*(.+)$/m.exec(e)?.[1]?.trim()}function j2(e,t,n){if(n===void 0)return[];let r=ot(n,K);if("error"in r||Oa(r.content)!==t)return[];return[K,nt,rt].flatMap((o)=>{let i=ot(e,o),s=ot(n,o);if("error"in i||"error"in s||i.content===s.content)return[];return[`Modified ${o} occupies ${Ot(e,o)}; run install --openclaw to restore it`]})}function $a(e){let t=Jr(e.homeDir),n=nn(pn,t);if(n)return n;let r=ot(t,K),i=["error"in r?r.error:r.content.startsWith(un)?void 0:`Unmanaged ${K} occupies ${Ot(t,K)}; move or remove it`,F2(t),H2(t)].filter((d)=>d!==void 0),s="content"in r?Oa(r.content):void 0,a=i.length>0?i:j2(t,s,Zr());if(a.length>0)return{platform:pn,status:"n/a",configPath:t,errors:a};let l=s===P()?[]:["Installed OpenClaw plugin is outdated; run install --openclaw to update"],c=M2(e.homeDir);if(c)return{platform:pn,status:"disabled",method:"plugin directory",configPath:t,errors:[c,...l]};return{platform:pn,status:"configured",method:"plugin directory",configPath:t,errors:l.length>0?l:void 0}}import{existsSync as Z2,readFileSync as X2}from"node:fs";import{join as Q2}from"node:path";import{existsSync as Xr,readFileSync as ja,rmSync as G2}from"node:fs";import{join as me}from"node:path";import{pathToFileURL as B2}from"node:url";function Na(e){return e!==void 0&&/\s/.test(e)}function U2(e,t,n){let r=t+1,o=!1;while(r<e.length){let i=e[r];if(o){o=!1,r++;continue}if(i==="\\"){o=!0,r++;continue}if(i==='"')return r+1;r++}throw Error(n)}function fn(e,t,n){let r=e[t],o=r==="["?"]":"}",i=0,s=t;while(s<e.length){let a=n.skipComment?.(e,s)??s;if(a!==s){s=a;continue}if(e[s]==='"'){s=U2(e,s,n.stringError);continue}if(e[s]===r)i++;if(e[s]===o){if(i--,i===0)return s}s++}throw Error(n.bracketError)}function Fa(e,t){let n=e.lastIndexOf(`
`,t)+1;return/^[ \t]*/.exec(e.slice(n))?.[0]??""}function mn(e,t){let{start:n,end:r,end:o}=t;while(Na(e[o]))o++;if(e[o]===","){if(r=o+1,e[r]===`
`)r++;return`${e.slice(0,n)}${e.slice(r)}`}o=t.start-1;while(Na(e[o]))o--;if(e[o]===","){n=o;let i=e.lastIndexOf(`
`,n-1);if(i!==-1&&/^\s*$/.test(e.slice(i+1,n)))n=i}return`${e.slice(0,n)}${e.slice(r)}`}var gn="cc-safety-net",Ua=`${gn}@latest`,Ga=["opencode.json","opencode.jsonc"],Ha="CCSafetyNetPlugin";function hn(e){return me(process.env.XDG_CONFIG_HOME||me(e,".config"),"opencode")}function q2(e){return me(hn(e),Ga[0])}function V2(e){return Ga.map((t)=>me(hn(e),t))}function Ba(e){return me(process.env.XDG_CACHE_HOME||me(e,".cache"),"opencode","packages",Ua)}function Qr(e){G2(Ba(e),{recursive:!0,force:!0})}async function qa(e){let t=me(Ba(e),"node_modules",gn),n=me(t,"package.json");if(!Xr(n))throw Error(`The OpenCode plugin cache at ${t} is missing its package, so OpenCode would load nothing and fail open. Run \`opencode plugin -g -f ${Ua}\` for details.`);let r=b(JSON.parse(ja(n,"utf-8")),"main");if(typeof r!=="string")throw Error(`The cached OpenCode plugin at ${t} declares no "main" entry.`);let o=me(t,r);if(typeof(await import(B2(o).href))[Ha]==="function")return;throw Error(`The cached OpenCode plugin at ${o} does not export a callable ${Ha}, so OpenCode would load nothing and fail open.`)}function yn(e,t){if(e[t]==="/"&&e[t+1]==="/"){let n=e.indexOf(`
`,t+2);return n===-1?e.length:n+1}if(e[t]==="/"&&e[t+1]==="*"){let n=e.indexOf("*/",t+2);return n===-1?e.length:n+2}return t}function Ma(e,t){let n=t;while(n<e.length){if(/\s/.test(e[n]??"")){n++;continue}let r=yn(e,n);if(r===n)return n;n=r}return n}function Va(e,t){let n=t+1,r=!1;while(n<e.length){if(r){r=!1,n++;continue}if(e[n]==="\\"){r=!0,n++;continue}if(e[n]==='"')return n+1;n++}throw Error("Unterminated string in OpenCode config")}function za(e,t,n){return JSON.parse(e.slice(t,n))}function z2(e,t){return fn(e,t,{skipComment:yn,stringError:"Unterminated string in OpenCode config",bracketError:"Unmatched plugin array in OpenCode config"})}function K2(e){let t=0,n=0;while(n<e.length){let r=yn(e,n);if(r!==n){n=r;continue}if(e[n]==='"'){let o=Va(e,n);if(t===1&&za(e,n,o)==="plugin"){let i=Ma(e,o),s=Ma(e,i+1);if(e[i]===":"&&e[s]==="[")return{start:s,end:z2(e,s)}}n=o;continue}if(e[n]==="{"||e[n]==="[")t++;if(e[n]==="}"||e[n]==="]")t--;n++}return}function W2(e,t){let n=[],r=t.start+1;while(r<t.end){let o=yn(e,r);if(o!==r){r=o;continue}if(e[r]==='"'){let i=Va(e,r),s=za(e,r,i);if(typeof s==="string"&&s.includes(gn))n.push({start:r,end:i});r=i;continue}r++}return n}function Ka(e,t){try{return JSON.parse(q(e))}catch(n){if(n instanceof SyntaxError)throw Error(`Failed to parse OpenCode config ${t}: ${n.message}`);throw n}}function J2(e){if(!e||typeof e!=="object"||Array.isArray(e))return!1;let t=e.plugin;if(!Array.isArray(t))return!1;return t.some((n)=>typeof n==="string"&&n.includes(gn))}function Y2(e,t){let n=K2(e);if(!n)throw Error(`Failed to locate OpenCode plugin array in ${t}`);let r=[...W2(e,n)].reverse().reduce(mn,e);return Ka(r,t),r}function Wa(e){Qr(e);let t=V2(e),n=t.find((o)=>Xr(o)),r=[];for(let o of t){if(!Xr(o))continue;try{let i=ja(o,"utf-8");if(!J2(Ka(i,o)))continue;return _(o,Y2(i,o)),{path:o,alreadyInstalled:!0}}catch(i){r.push(i instanceof Error?i.message:String(i))}}if(r.length>0)throw Error(r.join(`
`));return{path:n??q2(e),alreadyInstalled:!1}}function Ja(e){let t=[],n=hn(e.homeDir),r=["opencode.json","opencode.jsonc"];for(let o of r){let i=Q2(n,o);if(Z2(i))try{let s=X2(i,"utf-8"),a=q(s);if((JSON.parse(a).plugin??[]).some((p)=>p.includes("cc-safety-net")))return{platform:"opencode",status:"configured",method:"plugin array",configPath:i,errors:t.length>0?t:void 0}}catch(s){t.push(`Failed to parse ${o}: ${s instanceof Error?s.message:String(s)}`)}}return{platform:"opencode",status:"n/a",errors:t.length>0?t:void 0}}import{join as ef}from"node:path";function eo(e){return ef(e,".pi","agent","settings.json")}function to(e){if(typeof e!=="string")return!1;return e==="npm:cc-safety-net"||e.startsWith("npm:cc-safety-net@")}function Ya(e){let t=eo(e.homeDir),n=re(t);if(n.kind==="unreadable")return{platform:"pi",status:"not-inspected"};if(n.kind==="missing")return{platform:"pi",status:"n/a"};let r=b(n.value,"packages");if(!Array.isArray(r))return{platform:"pi",status:"n/a"};let o=r.find((a)=>to(typeof a==="string"?a:b(a,"source")));if(o===void 0)return{platform:"pi",status:"n/a"};let i=b(o,"extensions");if(Array.isArray(i)&&i.some((a)=>typeof a==="string"&&a.startsWith("-")))return{platform:"pi",status:"disabled",method:"package config",configPath:t,errors:["npm:cc-safety-net is installed but its extension is disabled in Pi settings"]};return{platform:"pi",status:"configured",method:"package config",configPath:t}}var nf={amp:Fs,"antigravity-cli":Hs,"claude-code":Gs,codex:Bs,"copilot-cli":ea,cursor:la,"gemini-cli":ca,"hermes-agent":wa,"kimi-code":It,openclaw:$a,opencode:Ja,pi:Ya};function it(e,t){let n={...t,cwd:e,homeDir:t?.homeDir??tf()};return Kt.map((r)=>rf(nf[r](n)))}function rf(e){if(e.status==="not-inspected")return{platform:e.platform,detected:!1,configured:!1,inspectionStatus:"not-inspected"};return{platform:e.platform,detected:e.status!=="n/a",configured:e.status==="configured",inspectionStatus:e.status!=="n/a"?"verified":e.errors&&e.errors.length>0?"failed":"not-applicable",method:e.method,configPath:e.configPath,configPaths:e.configPaths,errors:e.errors}}import{tmpdir as of}from"node:os";import{join as sf}from"node:path";var af=Object.freeze([{command:"git reset --hard",description:"git reset --hard",expectBlocked:!0},{command:"rm -rf /",description:"rm -rf /",expectBlocked:!0},{command:"rm -rf ./node_modules",description:"rm in cwd (safe)",expectBlocked:!1}]),lf=Object.freeze({state:"ready",diagnostics:Object.freeze([]),ruleMetadata:Object.freeze({}),policy:Object.freeze({rules:Object.freeze([]),transparentWrappers:Object.freeze([]),safety:Object.freeze({}),worktreeMode:!1,destructiveCommandProtectionEnabled:!0,destructiveCommandRuleOverrides:Object.freeze({}),destructiveCommandAllowPaths:Object.freeze([]),secretProtection:Object.freeze({enabled:!0,disabledRules:Object.freeze([]),denyPaths:Object.freeze([]),allowPaths:Object.freeze([])})})}),cf={strict:!1,paranoidRm:!1,paranoidInterpreters:!1,worktreeMode:!1,effectiveLevel:"standard",capabilities:{fail_closed:{enabled:!1,source:"preset",sources:[]},paranoid_rm:{enabled:!1,source:"preset",sources:[]},paranoid_interpreters:{enabled:!1,source:"preset",sources:[]}}};function Za(){let e=sf(of(),"cc-safety-net-self-test"),t=af.map((n)=>{let r=Vt(Ke("self-test",{command:n.command},{kind:"command",shell:"auto"},{configCwd:e,executionCwd:e},n.command),{guard:{dependencies:{loadPolicySnapshot:()=>lf,getModes:()=>cf,findPolicyMutation:()=>null}},audit:{agent:"self-test",getSessionId:()=>{return}}}),o=n.expectBlocked?"blocked":"allowed",i=r.decision.kind==="deny"?"blocked":"allowed";return{command:n.command,description:n.description,expected:o,actual:i,passed:o===i,reason:r.decision.kind==="deny"?r.decision.reason:void 0,ruleId:r.decision.kind==="deny"?r.decision.ruleId:void 0}});return{passed:t.filter((n)=>n.passed).length,failed:t.filter((n)=>!n.passed).length,total:t.length,results:t}}function no(e){let t=T({label:"doctor",booleans:{json:["--json"],skipUpdateCheck:["--skip-update-check"]}},e);if(ae(t.errors))return null;return{json:t.flags.json,skipUpdateCheck:t.flags.skipUpdateCheck}}async function Xa(e={}){let t=await At(!e.json,()=>{let n=df(e);return{ready:n,finish:()=>n}},()=>Rt(),{loadingMessage:"Checking system status…"});if(e.json)console.log(JSON.stringify(t,null,2));else pf(t);return uf(t.hooks,t.engineSelfTest,{userConfig:t.userConfig,projectConfig:t.projectConfig})?1:0}async function df(e){let t=e.cwd??process.cwd(),n=await St(),r=it(t,{ampPluginListOutput:n.ampPluginListOutput,codexPluginListOutput:n.codexPluginListOutput,copilotCliVersion:n.versions["copilot-cli"]}),o=as(t),i=ls(),s=B({cwd:t}),a=s.policy,l=de(a),c=De(a,l.capabilities),d=Yt(7),p=e.skipUpdateCheck?{currentVersion:P(),latestVersion:null,updateAvailable:!1}:await Qe(),m={hooks:r,engineSelfTest:Za(),userConfig:o.userConfig,projectConfig:o.projectConfig,configState:bt(s),effectiveRules:o.effectiveRules,shadowedRules:o.shadowedRules,environment:i,effectiveSafety:{selectedPreset:a.safety.level??"standard",level:l.effectiveLevel,capabilities:l.capabilities,ruleOverrides:a.destructiveCommandRuleOverrides,weakenedRuleOverrides:Object.entries(c).filter(([,u])=>u.source==="rule_override"&&u.override==="off"&&u.inheritedEnabled&&u.changesInherited).map(([u])=>u),ruleCounts:{stored:Object.keys(a.destructiveCommandRuleOverrides).length,effective:Object.values(c).filter((u)=>u.changesInherited).length}},posture:xs(o.userConfig.path),activity:d,update:p,system:n};return{...m,findings:ds(m)}}function uf(e,t,n){return e.length>0&&e.every((r)=>!r.configured)||e.some((r)=>r.inspectionStatus==="failed")||t.failed>0||n.userConfig.exists&&!n.userConfig.valid||n.projectConfig.exists&&!n.projectConfig.valid}function pf(e){console.log(),console.log(ps(e.hooks)),console.log(),console.log(fs(e.engineSelfTest)),console.log(),console.log(ms(e)),console.log(),console.log(gs(e.environment)),console.log(),console.log(hs(e)),console.log(),console.log(ys(e.findings)),console.log(),console.log(Ls(e.activity)),console.log(),console.log(bs(e.system)),console.log(),console.log(vs(e.update)),console.log(ws(e))}import{existsSync as ff}from"node:fs";var mf=/^[A-Za-z0-9_@%+=:,./-]+$/,Qa="Usage: cc-safety-net explain [--json] [--cwd <path>] <command>";function ro(e){let t=T({label:"explain",booleans:{json:["--json"]},values:{cwd:["--cwd"]},positionals:"tail"},e);if(ae(t.errors))return console.error(Qa),console.error("Pass -- before a command that starts with dashes."),null;if(t.values.cwd!==void 0&&!ff(t.values.cwd))return console.error(`Error: --cwd path does not exist: ${t.values.cwd}`),null;let n=t.positionals.length===1?t.positionals[0]:t.positionals.map((r)=>mf.test(r)?r:`'${r.replaceAll("'","'\\''")}'`).join(" ");if(!n)return console.error("Error: No command provided"),console.error(Qa),null;return{json:t.flags.json,cwd:t.values.cwd,command:n}}function el(e){if(e)return{dh:"=",dv:"|",dtl:"+",dtr:"+",dbl:"+",dbr:"+",h:"-",v:"|",tl:"+",tr:"+",bl:"+",br:"+",sh:"="};return{dh:"═",dv:"║",dtl:"╔",dtr:"╗",dbl:"╚",dbr:"╝",h:"─",v:"│",tl:"┌",tr:"┐",bl:"└",br:"┘",sh:"━"}}function tl(e,t){let r=t-18;return[`${e.dtl}${e.dh.repeat(t)}${e.dtr}`,`${e.dv}  Command Analysis${" ".repeat(r)}${e.dv}`,`${e.dbl}${e.dh.repeat(t)}${e.dbr}`]}function oo(e){return JSON.stringify(e)}function nl(e,t=0){return`[${e.map((r,o)=>us(r,o,t)).join(",")}]`}function Ln(e,t,n=70){let r=e.split(" "),o=[],i="";for(let s of r)if(i&&i.length+s.length+1>n)o.push(i),i=s;else i=i?`${i} ${s}`:s;if(i)o.push(i);return o.map((s,a)=>a===0?s:`${t}${s}`)}function rl(e,t,n){let r=[];switch(e.type){case"parse":return null;case"env-strip":return r.push(""),r.push(`STEP ${t} ${n.h} Strip environment variables`),r.push(`  Removed: ${e.envVars.map((o)=>`${o}=<redacted>`).join(", ")}`),r.push(`  Tokens:  ${oo(e.output)}`),{lines:r,incrementStep:!0};case"leading-tokens-stripped":return r.push(""),r.push(`STEP ${t} ${n.h} Strip wrappers`),r.push(`  Removed: ${e.removed.join(", ")}`),r.push(`  Tokens:  ${oo(e.output)}`),{lines:r,incrementStep:!0};case"shell-wrapper":return r.push(""),r.push(`STEP ${t} ${n.h} Detect shell wrapper`),r.push(`  Wrapper: ${e.wrapper} -c`),r.push(`  Inner:   ${e.innerCommand}`),{lines:r,incrementStep:!0};case"interpreter":{if(r.push(""),r.push(`STEP ${t} ${n.h} Detect interpreter`),r.push(`  Interpreter: ${e.interpreter}`),r.push(`  Code:        ${e.codeArg}`),e.paranoidBlocked)r.push("  Result:      ✗ BLOCKED (paranoid mode)");return{lines:r,incrementStep:!0}}case"busybox":return r.push(""),r.push(`STEP ${t} ${n.h} Busybox wrapper`),r.push(`  Subcommand: ${e.subcommand}`),{lines:r,incrementStep:!0};case"transparent-wrapper":return r.push(""),r.push(`STEP ${t} ${n.h} Transparent wrapper`),r.push(`  Wrapper: ${e.wrapper}`),r.push(`  Tokens:  ${oo(e.output)}`),{lines:r,incrementStep:!0};case"recurse":return{lines:[],incrementStep:!1};case"rule-check":{if(r.push(""),r.push(`STEP ${t} ${n.h} Match rules`),r.push(`  Rule:   ${e.rule}()`),e.matched)r.push("  Result: MATCHED");else r.push("  Result: No match");return{lines:r,incrementStep:!0}}case"worktree-relaxation":return r.push(""),r.push(`STEP ${t} ${n.h} Worktree relaxation`),r.push(`  Mode:   ${S.worktree.name}`),r.push(`  Git cwd: ${e.gitCwd}`),r.push("  Result: Allowed local discard in linked worktree"),{lines:r,incrementStep:!0};case"tmpdir-check":return null;case"fallback-scan":{if(e.embeddedCommandFound)return r.push(""),r.push(`STEP ${t} ${n.h} Fallback scan`),r.push(`  Found: ${e.embeddedCommandFound}`),{lines:r,incrementStep:!0};return null}case"custom-rules-check":{if(e.rulesChecked){if(r.push(""),r.push(`STEP ${t} ${n.h} Custom rules`),e.matched)r.push("  Result: MATCHED");else r.push("  Result: No match");return{lines:r,incrementStep:!0}}return null}case"cwd-change":return null;case"dangerous-text":{if(e.matched)return r.push(""),r.push(`STEP ${t} ${n.h} Dangerous text check`),r.push(`  Token:  ${e.token}`),r.push("  Result: MATCHED"),{lines:r,incrementStep:!0};return null}case"strict-unparseable":return r.push(""),r.push(`STEP ${t} ${n.h} Strict mode check`),r.push(`  Command: ${e.rawCommand}`),r.push("  Result:  ✗ UNPARSEABLE"),{lines:r,incrementStep:!0};case"segment-skipped":return null;case"error":return r.push(""),r.push(`ERROR: ${e.message}`),{lines:r,incrementStep:!1};default:return null}}function io(e,t){let n=el(t?.asciiOnly??!1),r=58,o=[],i=1;o.push(...tl(n,58)),o.push("");let s=e.trace.steps.find((u)=>u.type==="error");if(s&&s.type==="error"){o.push("ERROR"),o.push(`  ${s.message}`),o.push(""),o.push("RESULT"),o.push(`  Status: ${e.result==="blocked"?g.red("BLOCKED"):g.green("ALLOWED")}`),o.push(""),o.push("CONFIG");let u=e.configSource??"none";return o.push(`  Path: ${u}`),o.join(`
`)}let a=e.trace.steps.find((u)=>u.type==="parse");if(a&&a.type==="parse"){o.push("INPUT"),o.push(`  ${a.input}`),o.push(""),o.push(`STEP ${i} ${n.h} Split shell commands`),i++;for(let u=0;u<a.segments.length;u++){let h=a.segments[u];if(h){let f=Math.random();o.push(`  Segment ${u+1}: ${nl(h,f)}`)}}}let l=e.trace.segments,c=l.length>1;for(let u of l){if(c){o.push("");let v="";if(a&&a.type==="parse"){let Hn=a.segments[u.index];if(Hn)v=Hn.join(" ")}let w=54,y=v,C=` Segment ${u.index+1}: `,H=" ";if(v){if(C.length+v.length+H.length>w){let Vc=w-C.length-H.length;y=`${v.substring(0,Vc-1)}…`}}let he=v?`${C}${y}${H}`:` Segment ${u.index+1} `,Fn=v?`${C}${g.cyan(y)}${H}`:he,Po=58-he.length,To=Math.floor(Po/2),qc=Po-To;o.push(`${n.sh.repeat(To)}${Fn}${n.sh.repeat(qc)}`)}if(u.steps.find((v)=>v.type==="segment-skipped")){o.push(""),o.push("  (skipped — prior segment blocked)");continue}let f=!1,L=!1;for(let v of u.steps){let w=rl(v,i,n);if(w){if(L=!0,v.type==="recurse"){o.push("");let y=" RECURSING ",C=58-y.length-4;o.push(`  ${n.tl}${n.h}${y}${n.h.repeat(C)}`),o.push(`  ${n.v}`),f=!0;continue}for(let y of w.lines)if(f)o.push(`  ${n.v} ${y}`);else o.push(y);if(w.incrementStep)i++}}if(f)o.push(`  ${n.v}`),o.push(`  ${n.bl}${n.h.repeat(56)}`),f=!1;if(!L)o.push(""),o.push(`  ${g.green("✓")} Allowed (no matching rules)`)}if(o.push(""),o.push("RESULT"),e.result==="blocked"){if(o.push(`  Status: ${g.red("BLOCKED")}`),e.customRule){if(o.push(`  Rule: ${e.customRule.id}`),e.customRule.rulebook)o.push(`  Rulebook: ${e.customRule.rulebook.name} ${e.customRule.rulebook.version}`);if(e.customRule.source)o.push(`  Source: ${e.customRule.source}`);if(e.customRule.override)o.push(`  Override: reason ${e.customRule.override.reason}`)}if(e.reason){let u=Ln(e.reason,"          ");o.push(`  Reason: ${u[0]}`);for(let h=1;h<u.length;h++)o.push(u[h]??"")}}else o.push(`  Status: ${g.green("ALLOWED")}`);o.push(""),o.push("CONFIG");let d=e.configSource??"none",p=e.configValid?"":" (invalid)";o.push(`  Path: ${d}${p}`),o.push(`  Safety preset: ${e.selectedPreset??"standard"}`),o.push(`  Effective capabilities: ${e.effectiveLevel}`);let m=Object.entries(e.destructiveCommandRuleOverrides??{});if(o.push(`  Rule customizations: ${m.length}`),e.ruleActivation)o.push(`  Rule activation: ${e.ruleActivation.id} — ${e.ruleActivation.enabled?"on":"off"} via ${e.ruleActivation.source}`);return o.join(`
`)}function so(e){return JSON.stringify(e,null,2)}function ol(e){return new Promise((t)=>{process.stdout.write(`${e}
`,()=>t())})}async function il(e){let t=ro(e);if(!t)return 1;try{let n=We(t.command,{cwd:t.cwd}),r=!!process.env.NO_COLOR||!process.stdout.isTTY;return await ol(t.json?so(n):io(n,{asciiOnly:r})),0}catch(n){if(!(n instanceof lr)&&!(n instanceof Se)&&!(n instanceof pe))throw n;if(t.json)return await ol(JSON.stringify({error:n.message})),1;return console.error(n.message),1}}var sl="2.0.10",W="  ",_e="cc-safety-net";function al(e){return e.argument?`${e.flags} ${e.argument}`:e.flags}function gf(e){return Math.max(...e.map((t)=>al(t).length))}function hf(e){return Math.max(...e.map((t)=>t.usage.length))}function yf(e){return Math.max(...e.map((t)=>`${_e} ${t.usage}`.length))}function Lf(e,t){let n=`${_e} ${e.usage}`;return`${W}${n.padEnd(t+2)}${e.description}`}function ge(e,t){return`${W}${e.padEnd(Math.max(40,e.length+2))}${t}`}function vn(e,t=console.log){let n=[];if(n.push(`${_e} ${e.name}`),n.push(""),n.push(`${W}${e.description}`),n.push(""),n.push("USAGE:"),n.push(`${W}${_e} ${e.usage}`),n.push(""),e.subcommands&&e.subcommands.length>0){n.push("SUBCOMMANDS:");let r=hf(e.subcommands);for(let o of e.subcommands)n.push(`${W}${o.usage.padEnd(r+2)}${o.description}`);n.push("")}if(e.options.length>0){n.push("OPTIONS:");let r=gf(e.options);for(let o of e.options){let i=al(o),s=o.default?`${o.description} (default: ${o.default})`:o.description;n.push(`${W}${i.padEnd(r+2)}${s}`)}n.push("")}if(e.examples&&e.examples.length>0){n.push("EXAMPLES:");for(let r of e.examples)n.push(`${W}${r}`)}t(n.join(`
`))}function ao(){let e=yf(Wt),t=[];t.push(`${_e} v${sl}`),t.push(""),t.push("Blocks destructive commands and secret access."),t.push(""),t.push("COMMANDS:");for(let n of Wt)t.push(Lf(n,e));t.push(""),t.push("GLOBAL OPTIONS:"),t.push(`${W}-h, --help       Show help (use with command for command-specific help)`),t.push(`${W}-V, --version    Show version`),t.push(""),t.push("HELP:"),t.push(`${W}${_e} help <command>     Show help for a specific command`),t.push(`${W}${_e} <command> --help   Show help for a specific command`),t.push(""),t.push("ENVIRONMENT VARIABLES:"),t.push(ge(`${S.level.name}=standard|strict|paranoid`,"Set session safety level")),t.push(ge(`${S.worktree.name}=1`,"Allow local git discards in linked worktrees")),t.push(ge(`${S.debug.name}=1`,"Print diagnostic messages to stderr")),t.push(ge(`${S.auditScope.name}=all|blocked`,"Record all command decisions, or denials only")),t.push(ge("CC_SAFETY_NET_HOME","Override rule config home directory")),t.push(""),t.push("LEGACY ENVIRONMENT VARIABLES (STILL SUPPORTED):"),t.push(ge(`${S.strict.name}=1`,"Force safety.overrides.fail_closed on")),t.push(ge(`${S.paranoid.name}=1`,"Force paranoid_rm and paranoid_interpreters on")),t.push(ge(`${S.paranoidRm.name}=1`,"Force safety.overrides.paranoid_rm on")),t.push(ge(`${S.paranoidInterpreters.name}=1`,"Force safety.overrides.paranoid_interpreters on")),t.push(""),t.push("Documentation:        https://ccsafetynet.com/docs"),console.log(t.join(`
`))}function ll(){console.log(sl)}function $t(e,t=console.log){let n=Jt(e);if(!n)return!1;if(n.name.toLowerCase()!==e.toLowerCase())return!1;return vn(n,t),!0}import{existsSync as bo,readFileSync as Ql}from"node:fs";import{homedir as um}from"node:os";import{join as Lo}from"node:path";import*as be from"node:readline";function vf(e){return e==="install"?"Install":"Uninstall"}function bf(e){return e==="install"?"Installing":"Uninstalling"}function wf(e){return e==="install"?"into":"from"}function ul(e){return e?.available===!0}function xf(e,t){let n=new Set(t);return e.filter((r)=>n.has(r.target)).map((r)=>r.target)}function cl(e,t,n){if(e.length===0||e.every((r)=>!r.available))return t;return Array.from({length:e.length},(r,o)=>o+1).map((r)=>(t+r*n+e.length)%e.length).find((r)=>ul(e[r]))}function Cf(e,t,n){if(n.ctrl&&n.name==="c")return"interrupt";if(n.name==="escape"||t==="q")return"abort";if(e==="install"&&(t==="u"||t==="U"))return"update";if(n.name==="up"||t==="k")return"up";if(n.name==="down"||t==="j")return"down";if(n.name==="space"||t===" ")return"toggle";if(n.name==="return"||n.name==="enter")return"confirm";return null}function kf(e){return{cursor:e.findIndex((t)=>t.available),selected:[]}}function Sf(e,t,n){if(n==="confirm"||n==="update"||n==="abort"||n==="interrupt")return{state:e,done:n};if(n==="up")return{state:{...e,cursor:cl(t,e.cursor,-1)}};if(n==="down")return{state:{...e,cursor:cl(t,e.cursor,1)}};let r=t[e.cursor];if(!ul(r))return{state:e};let o=e.selected.includes(r.target)?e.selected.filter((i)=>i!==r.target):xf(t,[...e.selected,r.target]);return{state:{...e,selected:o}}}var pl="◉",fl="◯",ml=">",gl=" ";function Df(e,t,n,r={}){let o=r.color!==!1,i=o?g.dim:(l)=>l,s=o?g.green:(l)=>l,a=o?g.bold:(l)=>l;return["",`${vf(e)} CC Safety Net ${wf(e)}:`,"",...t.map((l,c)=>{let d=n.selected.includes(l.target),p=c===n.cursor,m=d?pl:fl,u=p?ml:gl,h=l.available?"":` (${l.unavailableReason??"not installed"})`,f=`${m} ${l.label}${h}`,L=!l.available?i(f):d?s(f):p?a(f):f;return`${u} ${L}`}),"",e==="install"?"Space: select  Enter: confirm  u: update installed  Up/Down: move  q/Esc: cancel":t.some((l)=>l.available)?"Space: select  Enter: confirm  Up/Down: move  q/Esc: cancel":`No selectable integrations found for ${e}. q/Esc: close`].join(`
`)}var dl=["global-hook","plugin"];function Rf(e,t,n={}){let r=n.color!==!1?g.bold:(i)=>i;return["","Install the Kimi Code integration as:","",...[`Global hook — ${t?"already installed; selecting it reports the current state":"write the hook into ~/.kimi-code/config.toml now"}`,"Native Kimi plugin — print the steps to run inside Kimi Code"].map((i,s)=>{let a=s===e,l=`${a?pl:fl} ${i}`;return`${a?ml:gl} ${a?r(l):l}`}),"","Enter: confirm  Up/Down: move  q/Esc: cancel"].join(`
`)}function hl(e){let{input:t,output:n}=e;be.emitKeypressEvents(t);let r=t.isRaw===!0;t.setRawMode(!0),t.resume();let o=0,i=()=>{if(o===0)return;be.moveCursor(n,0,-o),be.cursorTo(n,0),be.clearScreenDown(n)},s=()=>{i();let a=e.render();n.write(`${a}
`),o=a.split(`
`).length};return new Promise((a)=>{let l=(d)=>{t.off("keypress",c),t.setRawMode(r),t.pause(),i(),a(d)};function c(d,p){e.onKey(d,p,{finish:l,draw:s})}t.on("keypress",c),s()})}function yl(e={}){let t=0;return hl({input:e.input??process.stdin,output:e.output??process.stdout,render:()=>Rf(t,e.globalHookInstalled===!0),onKey:(n,r,o)=>{if(r.ctrl&&r.name==="c"){o.finish(null),(e.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(r.name==="escape"||n==="q")return o.finish(null);if(r.name==="return"||r.name==="enter")return o.finish(dl[t]);if(r.name==="up"||r.name==="down"||n==="k"||n==="j")t=(t+1)%dl.length,o.draw()}})}function lo(e=process.stdin,t=process.stdout){return Boolean(e.isTTY&&t.isTTY&&typeof e.setRawMode==="function")}function Ll(e,t,n={}){let r=n.output??process.stdout,o=kf(t);return hl({input:n.input??process.stdin,output:r,render:()=>Df(e,t,o),onKey:(i,s,a)=>{let l=Cf(e,i,s);if(!l)return;let c=Sf(o,t,l);if(o=c.state,c.done==="interrupt"){a.finish(null),(n.onInterrupt??(()=>process.kill(process.pid,"SIGINT")))();return}if(c.done==="abort")return a.finish(null);if(c.done==="update")return a.finish("update");if(c.done==="confirm"){if(o.selected.length===0){r.write("\x07"),a.draw();return}a.finish([...o.selected]),r.write(`${bf(e)} selected integrations...
`);return}a.draw()}})}import{existsSync as bl,lstatSync as Ef,mkdirSync as Pf,mkdtempSync as Tf,readdirSync as If,readFileSync as at,rmSync as xn}from"node:fs";import{tmpdir as _f}from"node:os";import{basename as Of,dirname as $f,join as U}from"node:path";import{fileURLToPath as Nf}from"node:url";var co="// cc-safety-net managed Amp plugin. Do not edit. Reinstall with: npx -y cc-safety-net install --amp",Oe="cc-safety-net",$e="cc-safety-net/index.ts";import{spawn as Af}from"node:child_process";var uo=(e,t)=>{let n=Pe([...e],process.env);return new Promise((r)=>{let o=Af(n.cmd,n.args,{cwd:t,stdio:["ignore","pipe","pipe"]}),i=zr(o),s=!1,a=setTimeout(()=>{s=!0,o.kill()},120000);o.on("error",(l)=>{clearTimeout(a),r({status:null,errorCode:l.code,stdout:i.stdout,stderr:[l.message,i.stderr].filter(Boolean).join(`
`)})}),o.on("close",(l)=>{clearTimeout(a),r({status:s?null:l,errorCode:s?"ETIMEDOUT":void 0,stdout:i.stdout,stderr:i.stderr})})})};var st="cc-safety-net.ts",vl=U("amp",$e);function Ff(e){return U(e,".config","amp","plugins","cc-safety-net.ts")}function Hf(){let e=$f(Nf(import.meta.url));return[U(e,"..",vl),U(e,"..","..","..","dist",vl)]}function Mf(e=Hf()){let t=e.find((n)=>bl(n)&&Ef(n).isFile());if(!t)throw Error("Packaged Amp plugin artifact not found. Reinstall cc-safety-net and try again.");return t}function wl(e){try{return JSON.parse(e)}catch{return}}function Cn(e){return e.subarray(0,Buffer.byteLength(co)).toString("utf-8")===co}async function Nt(e,t,n){let r=await e(t,n);if(r.status===0)return r;throw Error([`Failed to run ${t.join(" ")}${r.status===null?"":` (exit ${r.status})`}.`,[r.stdout,r.stderr].filter(Boolean).join(`
`).trim()].filter(Boolean).join(`
`))}async function xl(e){let t=await e(["amp","plugins","repositories","--json"]);if(t.status===null)throw Error(`${t.errorCode==="ENOENT"?'Amp CLI not found. Install the amp CLI, sign in with "amp login", and rerun install --amp.':`amp plugins repositories --json did not finish (${t.errorCode??"terminated"}). Check that the amp CLI responds and rerun install --amp.`}
${t.stderr}`.trim());if(t.status!==0)throw Error(`Failed to run amp plugins repositories --json (exit ${t.status}). Sign in with "amp login" and rerun install --amp.
${[t.stdout,t.stderr].filter(Boolean).join(`
`)}`.trim());let n=wl(t.stdout),r=(Array.isArray(n)?n:[]).filter((o)=>b(o,"scope")==="user"&&b(o,"exists")===!0&&b(o,"viewerCanWrite")===!0).map((o)=>b(o,"cloneRef")).find((o)=>typeof o==="string"&&o.length>0);if(!r)throw Error('Your Amp account has no writable Personal Plugins repository. Sign in with "amp login", open Amp once to create it, and rerun install --amp.');return r}async function Cl(e,t){let n=Tf(U(_f(),"cc-safety-net-amp-"));try{return await Nt(e,["amp","clone","user-plugins",n]),await t(n)}finally{xn(n,{recursive:!0,force:!0})}}function po(e){return`rerun ${e==="overwrite"?"install":"uninstall"} --amp`}function kl(e,t,n){let r=U(e,t),o=E(r);if(!o)return;if(o.isSymbolicLink()||!o.isFile())throw Error(`Refusing to ${n} ${t} in your Amp personal plugins repository: not a regular file. Remove it there and ${po(n)}.`);let i=at(r);if(Cn(i))return i;throw Error(`Refusing to ${n} unmanaged file ${t} in your Amp personal plugins repository. Remove it there and ${po(n)}.`)}function Sl(e,t){let n=U(e,Oe),r=E(n);if(!r)return;if(r.isSymbolicLink()||!r.isDirectory())throw Error(`Refusing to ${t} ${Oe} in your Amp personal plugins repository: not a regular directory. Remove it there and ${po(t)}.`);return kl(e,$e,t)}function jf(e){let t=U(e,st),n=E(t);if(!n||n.isSymbolicLink()||!n.isFile())return;let r=at(t);return Cn(r)?r:void 0}async function Dl(e,t,n,r){if(await Nt(e,n,t),(await Nt(e,["git","status","--porcelain"],t)).stdout.trim()==="")return!1;return await Nt(e,["git","-c","commit.gpgsign=false","-c","user.name=cc-safety-net","-c","user.email=cc-safety-net@localhost","commit","-m",r],t),await Nt(e,["git","push","origin","HEAD"],t),!0}function bn(e,t){Uf(e,t),Gf(e,t)}function Rl(e,t){if(t==="keep")return;throw Error(`Local Amp plugin ${e} is not a managed copy and masks the personal plugin. Remove it and rerun install --amp.`)}function Uf(e,t){let n=Ff(e),r=E(n);if(!r)return;if(!r.isSymbolicLink()&&r.isFile()&&Cn(at(n))){xn(n);return}Rl(n,t)}function Gf(e,t){let n=U(e,".config","amp","plugins",Oe),r=E(n);if(!r)return;if(!r.isSymbolicLink()&&r.isDirectory()&&Bf(n)){xn(n,{recursive:!0});return}Rl(n,t)}function Bf(e){let t=Of($e);if(If(e).join("\x00")!==t)return!1;let n=U(e,t),r=E(n);return!!r&&!r.isSymbolicLink()&&r.isFile()&&Cn(at(n))}function qf(){let e=vt();if(!bl(e))return"";let t=wl(at(e,"utf-8"));if(!t||typeof t!=="object"||Array.isArray(t))return"";return`;globalThis.__CC_SAFETY_NET_EMBEDDED_POLICY__ = ${JSON.stringify(wn(t))};
`}async function Al(e,t=Mf(),n=uo){let r=Buffer.concat([at(t),Buffer.from(qf(),"utf-8")]),o=await xl(n);return Cl(n,async(i)=>{let s=`${o}/${Oe}`,a=Sl(i,"overwrite"),l=kl(i,st,"overwrite");if(a?.equals(r)&&!l)return bn(e,"fail"),{path:s,alreadyInstalled:!0};if(Pf(U(i,Oe),{recursive:!0}),_(U(i,$e),r),l)xn(U(i,st));let c=await Dl(n,i,["git","add","--",$e,...l?[st]:[]],`chore: update cc-safety-net plugin to v${P()}`);return bn(e,"fail"),{path:s,alreadyInstalled:!c}})}async function El(e,t=uo){let n=await xl(t);return Cl(t,async(r)=>{let o=Sl(r,"remove"),i=jf(r),s=`${n}/${i&&!o?st:Oe}`;if(!o&&!i)return bn(e,"keep"),{path:s,alreadyInstalled:!1};return await Dl(t,r,["git","rm","--",...o?[$e]:[],...i?[st]:[]],`chore: remove cc-safety-net plugin v${P()}`),bn(e,"keep"),{path:s,alreadyInstalled:!0}})}import{existsSync as Pl,mkdirSync as Vf,readFileSync as zf}from"node:fs";import{dirname as Kf}from"node:path";var fo="npx -y cc-safety-net hook --agy-cli",we="cc-safety-net";function Sn(){return{PreToolUse:[{hooks:[{type:"command",command:fo,timeout:30}]}]}}function Tl(e){try{let t=JSON.parse(zf(e,"utf-8"));if(!t||typeof t!=="object"||Array.isArray(t))throw Error("Antigravity hooks config must be a JSON object");return t}catch(t){if(t instanceof SyntaxError)throw Error(`Failed to parse Antigravity hooks config ${e}: ${t.message}`);throw t}}function Il(e){let t=e[we];if(t===void 0)return e[we]=Sn(),e[we];if(!t||typeof t!=="object"||Array.isArray(t))throw Error(`Antigravity hooks config entry "${we}" must be an object`);if(!Array.isArray(t.PreToolUse))t.PreToolUse=[];return t}function _l(e){if(!Array.isArray(e.PreToolUse))return!1;return e.PreToolUse.some((t)=>Array.isArray(t.hooks)&&t.hooks.some((n)=>n.command===fo))}function Wf(e){return Object.values(e).some((t)=>t.enabled!==!1&&_l(t))}function Jf(e){if(e[we]===void 0)return!1;let t=Il(e);if(t.enabled!==!1||!_l(t))return!1;return t.enabled=!0,!0}function Yf(e){if(e[we]===void 0){e[we]=Sn();return}let t=Il(e);t.PreToolUse??=[],t.enabled=!0,t.PreToolUse.push(Sn().PreToolUse?.[0]??{hooks:[]})}function Zf(e){let t=!1;for(let n of Object.values(e)){if(!Array.isArray(n.PreToolUse))continue;n.PreToolUse=n.PreToolUse.flatMap((r)=>{if(!Array.isArray(r.hooks))return[r];let o=r.hooks.filter((i)=>i.command!==fo);if(o.length!==r.hooks.length)t=!0;return o.length===0?[]:[{...r,hooks:o}]})}return t}function kn(e,t){_(e,`${JSON.stringify(t,null,2)}
`)}function Ol(e){let t=Ct(e);if(Vf(Kf(t),{recursive:!0}),!Pl(t))return kn(t,{[we]:Sn()}),{path:t,alreadyInstalled:!1};let n=Tl(t);if(Wf(n))return{path:t,alreadyInstalled:!0};if(Jf(n))return kn(t,n),{path:t,alreadyInstalled:!1};return Yf(n),kn(t,n),{path:t,alreadyInstalled:!1}}function $l(e){let t=Ct(e);if(!Pl(t))return{path:t,alreadyInstalled:!1};let n=Tl(t);if(!Zf(n))return{path:t,alreadyInstalled:!1};return kn(t,n),{path:t,alreadyInstalled:!0}}import{spawn as Xf}from"node:child_process";var se=V.map((e)=>({target:e.id,flag:e.flag,label:R(e.id),probeCommand:e.probeCommand}));function mo(e){let t=new Set(e);return se.map((n)=>n.target).filter((n)=>t.has(n))}async function Nl(e,t){for(let n of e)await t(n)}var Qf=5000;function go(e){return new Promise((t)=>{let n=Pe([...e],process.env),r=Xf(n.cmd,n.args,{env:process.env,stdio:"ignore"}),o=!1,i=(a)=>{if(o)return;o=!0,clearTimeout(s),t(a)},s=setTimeout(()=>{r.kill(),i(!1)},Qf);r.on("error",()=>i(!1)),r.on("close",(a)=>i(a===0))})}function Fl(e=go,t={}){let n=new Set(t.configuredTargets??[]);return Promise.all(se.map(async(r)=>({target:r.target,flag:r.flag,label:r.label,...Ml(t.action,await e(r.probeCommand),n.has(r.target))})))}function Hl(e,t){let n=new Set(t.configuredTargets??[]);return e.map((r)=>({...r,...Ml(t.action,r.available,n.has(r.target))}))}function Ml(e,t,n){if(e==="uninstall")return n?{available:!0}:{available:!1,unavailableReason:"not installed"};if(e==="install"&&n)return{available:!1,unavailableReason:"already installed"};if(!t)return{available:!1,unavailableReason:"CLI not installed"};return{available:!0}}import{existsSync as jl,readdirSync as em,rmSync as tm}from"node:fs";import{join as lt}from"node:path";function Dn(e,t=process.platform){let n=lt(process.env.npm_config_cache||(t==="win32"?lt(process.env.LOCALAPPDATA||lt(e,"AppData","Local"),"npm-cache"):lt(e,".npm")),"_npx");if(!jl(n))return;em(n).filter((r)=>jl(lt(n,r,"node_modules","cc-safety-net"))).forEach((r)=>{tm(lt(n,r),{recursive:!0,force:!0})})}import{existsSync as Gl,mkdirSync as nm,readFileSync as Bl}from"node:fs";import{dirname as rm,join as Ul}from"node:path";var Ft="npx -y cc-safety-net hook --kimi-code",ho=`[[hooks]]
event = "PreToolUse"
command = "${Ft}"`,yo=`{ event = "PreToolUse", command = "${Ft}" }`;function ql(e){return Ul(process.env.KIMI_CODE_HOME??Ul(e,".kimi-code"),"config.toml")}function om(e){return e.split(`
`).reduce((n,r)=>{if(/^\s*\[/.test(r))return n.activeTable=!0,n.lines.push(r),n;if(!n.activeTable&&/^\s*hooks\s*=\s*\[\s*]\s*(?:#.*)?$/.test(r))return n;return n.lines.push(r),n},{activeTable:!1,lines:[]}).lines.join(`
`)}function im(e,t){if(e[t]!=="#")return t;let n=e.indexOf(`
`,t+1);return n===-1?e.length:n+1}function sm(e,t){return fn(e,t,{skipComment:im,stringError:"Unterminated string in Kimi Code config",bracketError:"Unmatched hooks array in Kimi Code config"})}function Vl(e){let t=!1,n=0;while(n<e.length){let r=e.indexOf(`
`,n),o=r===-1?e.length:r,i=e.slice(n,o);if(/^\s*\[/.test(i))t=!0;if(!t){let s=/^(\s*)hooks\s*=\s*\[/.exec(i);if(s){let a=n+s[0].lastIndexOf("[");return{start:a,end:sm(e,a)}}}n=r===-1?e.length:r+1}return}function am(e,t){let n=e.slice(0,t.end).trimEnd(),r=Fa(e,t.end),o=r===""?"     ":`${r}  `,i=!n.endsWith("[")&&!n.endsWith(",");return`${n}${i?",":""}
${o}${yo}${e.slice(t.end)}`}function lm(e){let t=Vl(e);if(t&&e.slice(t.start+1,t.end).trim())return am(e,t);let n=om(e).trimEnd();if(n==="")return`${ho}
`;return`${n}

${ho}
`}function cm(e){return e.split(/(?=^\s*\[)/m).filter((n)=>!/^\s*\[\[hooks]]\s*$/m.test(n)||!n.includes(Ft)).join("").trimEnd()}function dm(e,t){let n=e.indexOf(yo,t.start);if(n===-1||n>t.end)return e;return mn(e,{start:n,end:n+yo.length})}function zl(e){let t=ql(e);if(nm(rm(t),{recursive:!0}),!Gl(t))return _(t,`${ho}
`),{path:t,alreadyInstalled:!1};let n=Bl(t,"utf-8");if(n.includes(Ft))return{path:t,alreadyInstalled:!0};return _(t,lm(n)),{path:t,alreadyInstalled:!1}}function Kl(e){let t=ql(e);if(!Gl(t))return{path:t,alreadyInstalled:!1};let n=Bl(t,"utf-8");if(!n.includes(Ft))return{path:t,alreadyInstalled:!1};let r=Vl(n),o=r?dm(n,r):`${cm(n)}
`;return _(t,o),{path:t,alreadyInstalled:!0}}var vo="safety-net@cc-marketplace",Wl=new Set(["claude-code","codex","copilot-cli","gemini-cli","hermes-agent","openclaw","opencode","pi"]),Jl=new Set(["antigravity-cli","cursor","hermes-agent","kimi-code"]);function wo(e){return/^\s*safety-net@cc-marketplace[^a-z0-9-][^\n]*installed,/m.test(e??"")}function ec(e){return/^\s*cc-safety-net[^a-z0-9-][^\n]*installed,/m.test(e??"")}function pm(e){return/^Marketplace `cc-marketplace`\s*$/m.test(e??"")}var tc={"claude-code":{installCommands:(e)=>{let t=rn(e,"cc-safety-net@cc-marketplace");return{commands:[...t?[["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","update","cc-safety-net@cc-marketplace"]]:[["claude","plugin","marketplace","add","kenryu42/cc-marketplace"],["claude","plugin","marketplace","update","cc-marketplace"],["claude","plugin","install","cc-safety-net@cc-marketplace"]],...Pr(e).status==="disabled"?[["claude","plugin","enable","cc-safety-net@cc-marketplace"]]:[]],cleanupCommands:rn(e,vo)?[["claude","plugin","uninstall",vo]]:[],update:t}},uninstallCommands:[["claude","plugin","uninstall","cc-safety-net@cc-marketplace"],["claude","plugin","marketplace","remove","cc-marketplace"]]},codex:{installCommands:async(e,t)=>{let n=t??await ie(["codex","plugin","list"]),r=ec(n);return{commands:[r||pm(n)?["codex","plugin","marketplace","upgrade","cc-marketplace"]:["codex","plugin","marketplace","add","kenryu42/cc-marketplace"],["codex","plugin","add","cc-safety-net@cc-marketplace"]],cleanupCommands:wo(n)?[["codex","plugin","remove","safety-net@cc-marketplace"]]:[],update:r}},uninstallCommands:[["codex","plugin","remove","cc-safety-net@cc-marketplace"],["codex","plugin","marketplace","remove","cc-marketplace"]],postInstallMessage:"Start Codex, open `/hooks`, select the cc-safety-net PreToolUse hook, and press `t` to trust it."},"copilot-cli":{installCommands:async()=>{let e=await ie(["copilot","plugin","list"]),t=[...Js(e)?[["copilot","plugin","uninstall","copilot-safety-net"]]:[],...Ys(e)?[["copilot","plugin","uninstall",zs]]:[]];if(Ks(e))return{commands:[["copilot","plugin","marketplace","update","cc-marketplace"],["copilot","plugin","update",oe]],cleanupCommands:t,update:!0};return{commands:[Ws(await ie(["copilot","plugin","marketplace","list"]))?["copilot","plugin","marketplace","update","cc-marketplace"]:["copilot","plugin","marketplace","add","kenryu42/cc-marketplace"],["copilot","plugin","install",oe]],cleanupCommands:t}},uninstallCommands:[["copilot","plugin","uninstall","cc-safety-net@cc-marketplace"],["copilot","plugin","marketplace","remove","cc-marketplace"]]},"gemini-cli":{installCommands:(e)=>{let t=Fr(e);if(t.status==="configured")return{commands:[["gemini","extensions","update","gemini-safety-net"]],update:!0};if(t.status==="disabled")return{commands:[["gemini","extensions","update","gemini-safety-net"],["gemini","extensions","enable","gemini-safety-net"]],update:!0};return{commands:[["gemini","extensions","install","https://github.com/kenryu42/gemini-safety-net","--consent"]]}},uninstallCommands:[["gemini","extensions","uninstall","gemini-safety-net"]]},openclaw:{beforeInstall:Yr,installCommands:()=>({commands:Ea()}),uninstallCommands:[["openclaw","plugins","uninstall",A,"--force"]],postInstallMessage:["Restart the OpenClaw Gateway to apply the change.","If plugins.allow is set in openclaw.json, it must also list cc-safety-net."].join(`
`)},opencode:{beforeInstall:Qr,installCommands:[["opencode","plugin","-g","-f","cc-safety-net@latest"]]},pi:{installCommands:[["pi","install","npm:cc-safety-net"]],uninstallCommands:[["pi","uninstall","npm:cc-safety-net"]]}};function En(){return process.env.HOME??um()}function nc(e,t=(n)=>n){try{let n=JSON.parse(t(Ql(e,"utf-8")));if(!n||typeof n!=="object"||Array.isArray(n))throw Error(`Settings file ${e} must be a JSON object`);return n}catch(n){if(n instanceof SyntaxError)throw Error(`Failed to parse ${e}: ${n.message}`);throw n}}function fm(e){let t=Lo(Et(e),"settings.json");if(!bo(t))return;let n=nc(t,q),r=n.enabledPlugins;if(!r||typeof r!=="object"||Array.isArray(r))return;if(r[oe]!==!1)return;let o=Ql(t,"utf-8"),i=o.replace(new RegExp(`("${oe}"\\s*:\\s*)false`),"$1true");return r[oe]=!0,_(t,i!==o?i:`${JSON.stringify(n,null,2)}
`),`Enabled ${oe} plugin in ${t}`}function mm(e){let t=eo(e);if(!bo(t))return;let n=nc(t);if(!Array.isArray(n.packages))return;let r=n.packages.find((o)=>!!o&&typeof o==="object"&&!Array.isArray(o)&&to(o.source)&&("extensions"in o));if(!r)return;return delete r.extensions,_(t,`${JSON.stringify(n,null,2)}
`),`Enabled npm:cc-safety-net extensions in ${t}`}function Yl(e,t){let n=T({label:t,booleans:Object.fromEntries(se.map((i)=>[i.target,[i.flag]]))},e),r=n.errors[0];if(r)throw Error(r);let o=se.filter((i)=>n.flags[i.target]).map((i)=>i.target);if(o.length!==1)throw Error(`Choose exactly one ${t} target: ${se.map((i)=>i.flag).join(", ")}`);return o[0]}async function rc(e=En(),t=Xe){let[n,r,o]=await Promise.all([t(["amp","plugins","list"],30000),t(["codex","plugin","list"],30000),t(["copilot","--binary-version"])]);return{codexPluginListOutput:r,hooks:it(process.cwd(),{homeDir:e,ampPluginListOutput:n,codexPluginListOutput:r,copilotCliVersion:o})}}async function gm(e,t=Xe){let n=await rc(En(),t);return n.hooks.filter((r)=>e==="install"?r.configured:r.detected||r.inspectionStatus==="not-inspected").filter((r)=>r.platform!=="codex"||!wo(n.codexPluginListOutput)||ec(n.codexPluginListOutput)).map((r)=>r.platform)}function hm(e,t,n){if(t.length>0)return{finish:async()=>[Yl(t,e)]};if(!n.selectTargets&&!lo(n.input,n.output))return{finish:async()=>[Yl(t,e)]};let r=n.detectConfiguredTargets??(()=>gm(e,n.fetchVersion)),o=Promise.all([Fl(n.probeTargets),r()]);return{ready:o,finish:async()=>{let[i,s]=await o,a=Hl(i,{action:e,configuredTargets:s}),l=n.selectTargets?await n.selectTargets(e,Xl(e,a)):await Ll(e,Xl(e,a),{input:n.input,output:n.output});if(l==="update")return l;if(!l||l.length===0)return null;return mo(l)}}}async function Ne(e,t,n=!1,r){let o=tc[e];o.beforeInstall?.(t);let i=typeof o.installCommands==="function"?await o.installCommands(t,r):{commands:o.installCommands};return await Kr(i.commands),await Ca(i.cleanupCommands??[]),[`${i.update||n?"Updated":"Installed"} ${R(e)} integration`,o.postInstallMessage].filter(Boolean).join(`
`)}async function ct(e){let t=tc[e];if(!t.uninstallCommands)throw Error(`${R(e)} uninstall is not supported`);return await Kr(t.uninstallCommands),`Uninstalled ${R(e)} integration`}function ym(e){let t=Wa(e);return t.alreadyInstalled?`Uninstalled OpenCode plugin from ${t.path}`:`OpenCode plugin not installed in ${t.path}`}var Lm={"antigravity-cli":{install:Ol,uninstall:$l},cursor:{install:sa,uninstall:aa},"kimi-code":{install:zl,uninstall:Kl}};function dt(e,t,n,r=!1){if(e==="install"&&!r)Dn(n);let o=Lm[t][e](n),i=R(t),s=e!=="install"?"Uninstalled":r?"Updated":"Installed";return e==="install"&&o.alreadyInstalled?r?`${i} hook up to date in ${o.path}`:`${i} hook already installed in ${o.path}`:e==="uninstall"&&!o.alreadyInstalled?`${i} hook not installed in ${o.path}`:`${s} ${i} hook ${e==="install"?"in":"from"} ${o.path}`}var vm={amp:{install:Al,uninstall:El,restartNote:'Amp personal plugins apply to every Amp session, including Orb threads. Restart Amp or run "plugins: reload" to apply the change.'},"hermes-agent":{install:fa,uninstall:ma,afterInstall:async(e)=>{let t=qr(e);return await ie(["hermes","plugins","enable",z,"--no-allow-tool-override"]),!t},beforeUninstall:async(e)=>{Br(e);try{await ie(["hermes","plugins","disable",z])}catch(t){console.warn(`${t instanceof Error?t.message:String(t)}
Removing the plugin files anyway; ${z} may still be listed in the Hermes config.`)}},restartNote:"Restart Hermes to apply the change."}};async function Rn(e,t,n,r=!1){let o=vm[t];if(e==="uninstall")await o.beforeUninstall?.(n);let i=e==="install"?await o.install(n):await o.uninstall(n),s=e==="install"&&await o.afterInstall?.(n),a=R(t),l=!s&&(e==="install"&&i.alreadyInstalled||e==="uninstall"&&!i.alreadyInstalled);return[l?e==="install"?`${a} plugin ${r?"up to date":"already installed"} at ${i.path}`:`${a} plugin not installed at ${i.path}`:`${e!=="install"?"Uninstalled":r?"Updated":"Installed"} ${a} plugin ${e==="install"?"at":"from"} ${i.path}`,l?void 0:o.restartNote].filter(Boolean).join(`
`)}var bm={amp:{install:(e,t)=>Rn("install","amp",e,t),uninstall:(e)=>Rn("uninstall","amp",e)},"antigravity-cli":{install:(e,t)=>dt("install","antigravity-cli",e,t),uninstall:(e)=>dt("uninstall","antigravity-cli",e)},"claude-code":{install:(e,t)=>Ne("claude-code",e,t),uninstall:()=>ct("claude-code")},codex:{install:(e,t,n)=>Ne("codex",e,t,n),uninstall:()=>ct("codex")},"copilot-cli":{install:async(e,t)=>[await Ne("copilot-cli",e,t),fm(e)].filter(Boolean).join(`
`),uninstall:()=>ct("copilot-cli")},cursor:{install:(e,t)=>dt("install","cursor",e,t),uninstall:(e)=>dt("uninstall","cursor",e)},"gemini-cli":{install:(e,t)=>Ne("gemini-cli",e,t),uninstall:()=>ct("gemini-cli")},"hermes-agent":{install:(e,t)=>{if(!t)Dn(e);return Rn("install","hermes-agent",e,t)},uninstall:(e)=>Rn("uninstall","hermes-agent",e)},"kimi-code":{install:(e,t)=>dt("install","kimi-code",e,t),uninstall:(e)=>dt("uninstall","kimi-code",e)},openclaw:{install:async(e,t)=>{let n=await Ne("openclaw",e,t);return await Pa(),n},uninstall:(e)=>(Yr(e),ct("openclaw"))},opencode:{install:async(e,t)=>{let n=await Ne("opencode",e,t);return await qa(e),n},uninstall:(e)=>ym(e)},pi:{install:async(e,t)=>[await Ne("pi",e,t),mm(e)].filter(Boolean).join(`
`),uninstall:()=>ct("pi")}},Zl=["Install CC Safety Net as a native Kimi Code plugin:","","  1. Start Kimi Code and run: /plugins install https://github.com/kenryu42/cc-safety-net","     Confirm the trust prompt; it defaults to cancel.","  2. Run /reload, or start a new session.","","Note: Kimi Code hooks are fail-open. When the hook process cannot start, crashes, or times","out, Kimi Code allows the tool call."].join(`
`);function wm(e){if(It({homeDir:e,cwd:process.cwd()}).status!=="configured")return Zl;return[Zl,"",g.red(["CAUTION: the global Kimi Code hook is installed and will run alongside the plugin.","After the plugin is active, remove it with: cc-safety-net uninstall --kimi-code"].join(`
`))].join(`
`)}function Xl(e,t){return t.map((n)=>e==="install"&&n.target==="kimi-code"&&n.unavailableReason==="already installed"?{...n,available:!0,unavailableReason:void 0,label:`${n.label} (global hook installed)`}:n)}function xm(e,t){if(e.selectKimiInstallMethod)return e.selectKimiInstallMethod();if(!lo(e.input,e.output))return Promise.resolve("global-hook");return yl({input:e.input,output:e.output,globalHookInstalled:It({homeDir:t,cwd:process.cwd()}).status==="configured"})}async function oc(e,t,n,r=!1,o){return bm[t][e](n,r,o)}function Cm(e){let t=T({label:"update"},e).errors[0];if(t)throw Error(t)}async function km(e,t=Xe){let n=await rc(e,t),r=Lo(Et(e),"installed-plugins");return{targets:mo([...n.hooks.filter((i)=>i.platform!=="copilot-cli"&&i.detected).map((i)=>i.platform),...[on,Vs,qs].flatMap((i)=>bo(Lo(r,...i))?["copilot-cli"]:[]),...rn(e,vo)?["claude-code"]:[],...wo(n.codexPluginListOutput)?["codex"]:[]]),codexPluginListOutput:n.codexPluginListOutput}}async function Sm(e){let t=En(),n=e.output??process.stdout,r=km(t,e.fetchVersion??Xe).then(async(a)=>{let l=new Set(a.targets);return{targets:a.targets,codexPluginListOutput:a.codexPluginListOutput,available:new Map(await Promise.all(se.filter((c)=>l.has(c.target)&&Wl.has(c.target)).map(async(c)=>[c.target,await go(c.probeCommand)])))}}),o=await At(e.showBanner??!0,()=>({ready:r,finish:()=>r}),()=>Rt({input:e.input??process.stdin,output:n}),{loadingMessage:"Checking installed integrations…",output:n});if(o.targets.length===0)return n.write("No installed integrations found. Run `cc-safety-net install` to set one up.\n"),0;let i=o.targets.some((a)=>Jl.has(a))?await Promise.resolve().then(()=>(Dn(t),null)).catch((a)=>An(a)):null,s=await en(Promise.all(o.targets.map((a)=>{if(Wl.has(a)&&!o.available.get(a))return Promise.resolve({message:`${R(a)} not found; skipped`,failed:!1});if(i!==null&&Jl.has(a))return Promise.resolve({message:i,failed:!0});return oc("install",a,t,!0,o.codexPluginListOutput).then((l)=>({message:l,failed:!1}),(l)=>({message:An(l),failed:!0}))})),{loadingMessage:`Updating ${o.targets.length} integration${o.targets.length===1?"":"s"}…`,output:n});return s.forEach((a)=>{a.failed?console.error(a.message):n.write(`${a.message}
`)}),s.some((a)=>a.failed)?1:0}function xo(e,t={}){return Promise.resolve().then(()=>Cm(e)).then(()=>Sm(t)).catch((n)=>(console.error(An(n)),1))}async function Ht(e,t,n={}){try{let r=await At(!0,()=>hm(e,t,n),()=>Rt({input:n.input??process.stdin,output:n.output??process.stdout}),{loadingMessage:e==="install"?"Checking available integrations…":"Checking installed integrations…",output:n.output??process.stdout});if(!r)return(n.output??process.stdout).write(`Cancelled: nothing was ${e}ed.
`),0;if(r==="update")return(n.runUpdate??(()=>xo([],{fetchVersion:n.fetchVersion,input:n.input,output:n.output,showBanner:!1})))();let o=En(),i=n.output??process.stdout;return await Nl(r,async(s)=>{if(s==="kimi-code"&&e==="install"){let l=await xm(n,o);if(l===null){i.write(`Cancelled: Kimi Code integration was not installed.
`);return}if(l==="plugin"){i.write(`${wm(o)}
`);return}}let a=await en(oc(e,s,o),{loadingMessage:`${e==="install"?"Installing":"Uninstalling"} ${R(s)} integration…`,output:i});i.write(`${a}
`)}),0}catch(r){return console.error(An(r)),1}}function An(e){let t=e instanceof Error?e.message:String(e),n=typeof e==="object"&&e!==null&&"code"in e?e.code:null;if(n==="EACCES"||n==="EPERM")return`${t}
Check file permissions for the target config file and parent directory.`;if(n==="ENOENT")return`${t}
Check that the target config path and parent directory exist.`;if(n==="ENOTDIR")return`${t}
Check that every parent path component is a directory.`;return t}import{join as cg}from"node:path";var ic="# Custom Rules Reference\n\nAgent reference for generating CC Safety Net rulebook configuration.\n\n## Config Locations\n\n| Scope | Config path | Rulebook path | Cache path | Priority |\n|-------|-------------|---------------|------------|----------|\n| User | `~/.cc-safety-net/rules/rule.json` | `~/.cc-safety-net/rules/<rulebook-name>/rulebook.json` | `~/.cc-safety-net/cache/rulebooks/` | First |\n| Project | `.cc-safety-net/rules/rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` | `.cc-safety-net/cache/rulebooks/` | Second |\n| GitHub source | Listed in a local `rule.json` | `.cc-safety-net/rules/<rulebook-name>/rulebook.json` in the source repository | Consumer local cache | Source order |\n\nUser scope is evaluated before project scope; within a scope, sources apply in `rules` array order. A duplicate active rulebook name keeps the first claim and ignores the later rulebook with a warning, so a user-scoped name shadows a project-scoped one.\n\nUse `cc-safety-net rule init` to create an inert local config. Use `--global` for user scope. Use `cc-safety-net rule init --example` to also create an inactive example rulebook. `CC_SAFETY_NET_HOME` overrides the `~/.cc-safety-net` user root.\n\nLegacy inline `.safety-net.json` and `~/.cc-safety-net/config.json` files are not loaded at runtime. Convert them with `cc-safety-net rule migrate`.\n\n## rule.json Schema\n\n```json\n{\n  \"version\": 1,\n  \"rules\": [\"project-rules\", \"owner/repo#main/team-rules\"],\n  \"overrides\": {\n    \"project-rules/block-docker-system-prune\": {\n      \"reason\": \"Use targeted Docker cleanup commands.\"\n    },\n    \"team-rules/block-npm-global\": \"off\"\n  },\n  \"transparent_wrappers\": [\"rtk\"]\n}\n```\n\n- `version`: Required. Must be `1`.\n- `$schema`: Optional. `cc-safety-net rule verify` inserts it into a valid `rule.json` that lacks it.\n- `rules`: Optional array of rulebook source strings. Missing `rules` is treated as `[]`.\n- `overrides`: Optional object keyed by `<rulebook-name>/<rule-name>`.\n- `overrides` values are either `\"off\"` to disable a rule or an object with a required `reason` (replacement block reason) and an optional `intent` (one of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain`).\n- A project override cannot target a user-scoped rule: only that override is ignored, the user rule keeps its configured state, and `rule sync`/`rule verify` report the diagnostic as a failure.\n- `transparent_wrappers`: Optional array of command names that transparently execute a visible child command.\n- Transparent wrappers have no built-in defaults. Configure only wrappers you intentionally trust, such as `\"rtk\"`.\n- Use `cc-safety-net rule wrapper add rtk` to configure RTK without manually editing `rule.json`.\n\n## Rulebook Sources\n\n- Local sources are bare rulebook names such as `project-rules`; the rulebook file is `.cc-safety-net/rules/project-rules/rulebook.json`.\n- GitHub sources use `owner/repo#ref/<rulebook-name>`.\n- GitHub refs must be one path segment, such as a tag, SHA, or branch name without `/`.\n- The GitHub source name, the repository directory name, and the rulebook `name` must match exactly.\n- Rulebook source strings must be unique in a config.\n\n## rulebook.json Schema\n\n```json\n{\n  \"rulebook_version\": 1,\n  \"name\": \"project-rules\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Project-specific CC Safety Net rules.\",\n  \"author\": \"project\",\n  \"allowed_commands\": [\"docker\"],\n  \"rules\": [\n    {\n      \"name\": \"block-docker-system-prune\",\n      \"command\": \"docker\",\n      \"subcommand\": \"system\",\n      \"block_args\": [\"prune\"],\n      \"reason\": \"Use targeted cleanup instead.\"\n    }\n  ],\n  \"tests\": [\n    {\n      \"command\": \"docker system prune\",\n      \"expect\": \"blocked\",\n      \"rule\": \"block-docker-system-prune\"\n    },\n    {\n      \"command\": \"docker ps\",\n      \"expect\": \"allowed\"\n    }\n  ]\n}\n```\n\n### Rulebook Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `rulebook_version` | Yes | Must be `1` |\n| `name` | Yes | `^[a-zA-Z][a-zA-Z0-9_-]{0,63}$` |\n| `version` | Yes | Non-empty string |\n| `description` | No | Free text; not type-checked at runtime |\n| `author` | No | Free text; not type-checked at runtime |\n| `allowed_commands` | Yes | Unique command names matching `^[a-zA-Z][a-zA-Z0-9_-]*$` |\n| `rules` | Yes | Array of rule objects |\n| `tests` | No | Array of fixtures |\n\n### Rule Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `name` | Yes | Unique within the rulebook (case-insensitive); same pattern as rulebook `name` |\n| `command` | Yes | Must be listed in `allowed_commands`; basename only, not path |\n| `subcommand` | No | Same pattern as `command`; omit to match any subcommand |\n| `intent` | No | One of `hard_stop`, `use_alternative`, `scope_down`, `manual_only`, `stop_and_explain` |\n| `block_args` | Yes | Non-empty array of non-empty strings |\n| `reason` | Yes | Non-empty string, max 256 chars |\n\n### Test Fixture Fields\n\n| Field | Required | Constraints |\n|-------|----------|-------------|\n| `command` | Yes | Non-empty shell command string |\n| `expect` | Yes | `\"blocked\"` or `\"allowed\"` |\n| `rule` | Required for blocked fixtures | Rule name expected to block the command |\n\nFixtures are optional documentation of intended behavior. Fixtures are shape-validated only; CC Safety Net does not execute them.\n\n## Matching Behavior\n\n- **Command**: Normalized to lowercase basename with any trailing `.exe` removed (`/usr/bin/git` → `git`).\n- **Subcommand**: The first command token after recognized Git and Docker global options and their values; `--` ends option parsing. An unrecognized option without `=` may consume the following token as its value.\n- **Arguments**: Each `block_args` value is compared literally against every command token, including expanded short options. The command is blocked if **any** item matches.\n- **Short options**: Expanded (`-Ap` matches `-A`).\n- **Long options**: Exact match (`--all-files` does not match `--all`).\n- **Execution order**: Built-in rules first, then custom rulebooks. Custom rules only add restrictions.\n- **Transparent wrappers**: A configured wrapper such as `rtk` lets `rtk git commit` be analyzed as `git commit` only when `git` is protected by built-in analyzers or active custom rules. `rtk -- git commit` is also supported.\n\n## Workflow\n\n1. Run `cc-safety-net rule init` or create `rule.json` manually.\n2. Optionally run `cc-safety-net rule init --example` to create an inactive example rulebook.\n3. Use `cc-safety-net rule wrapper add rtk` for trusted transparent wrappers.\n4. Run `cc-safety-net rule add <source>` after creating or choosing a rulebook source; it adds the source and syncs it.\n5. Run `cc-safety-net rule sync` after manual `rule.json` changes or local rulebook edits.\n6. Run `cc-safety-net rule verify` to validate config, lock/cache state, local rulebooks, and shareable GitHub-source rulebook directories in the current repository (it does not fetch remote content).\n7. Run `cc-safety-net rule list` to inspect active rulebooks and transparent wrappers.\n\nAn edited or invalid local rulebook keeps its last synced, digest-verified cached version enforced until `cc-safety-net rule sync` validates the edit. A missing lock entry or cache, a cache digest mismatch, or an invalid cached rulebook makes that source inactive; a missing lockfile or an unreadable or invalid `rule.json` makes every source in its scope inactive. Inactive sources stop applying their rules while other custom rules and all built-in protections stay active. Repair the reported condition, then run `cc-safety-net rule sync`. Run `cc-safety-net status` to see degraded sources.\n";function Mt(e,t){if(!e.ok){Em(e);return}Pm(e),console.log(t),console.log("Rule config synced."),console.log(""),Dm(e.entries)}function Dm(e){if(e.length===0){console.log("Active rulebooks: (none)");return}console.log(`Active rulebooks (${e.length}):`);for(let t of e)console.log(`  - ${t.name} ${t.version} (${Rm(t.ruleCount??0)})`),console.log(`    Source: ${rr(t)}`)}function Rm(e){return`${e} ${e===1?"rule":"rules"}`}function ac(e,t){Fe("Active sources",e.rulebooks,(n)=>[`[${n.source}] ${n.name} ${n.version}`,`  Source: ${t[n.source].get(n.spec)??n.spec}`]),Fe("Active rules",e.rules,(n)=>[`[${Am(e,n.name)}] ${n.name}`,`  Command: ${n.subcommand?`${n.command} ${n.subcommand}`:n.command}`,`  Block args: ${n.block_args.join(", ")}`,`  Reason: ${n.reason}`]),Fe("Disabled rules",sc(e,"off"),(n)=>[n.key]),Fe("Reason overrides",sc(e,"reason"),(n)=>[n.key,`  Reason: ${n.value.reason}`]),Fe("Transparent wrappers",e.transparent_wrappers,(n)=>[n]),Fe("Issues",e.errors,(n)=>[n]),Fe("Warnings",e.warnings,(n)=>[n])}function Fe(e,t,n){if(t.length===0){console.log(`${e}: (none)`);return}console.log(`${e} (${t.length}):`);for(let r of t){let[o,...i]=n(r);console.log(`  - ${o}`);for(let s of i)console.log(`    ${s}`)}}function Am(e,t){return e.rulebooks.find((n)=>n.rules.includes(t))?.source??"project"}function sc(e,t){return Object.entries({...e.userConfig?.overrides??{},...e.projectConfig?.overrides??{}}).filter((n)=>{if(t==="off")return n[1]==="off";return!!n[1]&&typeof n[1]==="object"}).map(([n,r])=>({key:n,value:r}))}function Em(e){for(let t of e.errors)console.error(t)}function Pm(e){if(!e.warnings||e.warnings.length===0)return;for(let t of e.warnings)console.warn(t)}import{dirname as lc,join as Pn}from"node:path";var Tm=".safety-net.json",Im="~/.cc-safety-net/config.json";async function uc(e){return[await cc({legacyPath:dc({cwd:e.cwd}),configPath:X(e.cwd),defaultRulebookName:"project-rules",migratedFrom:Tm,cleanup:e.cleanup,syncOptions:{cwd:e.cwd}}),await cc({legacyPath:gt(),configPath:Q(),defaultRulebookName:"user-rules",migratedFrom:Im,cleanup:e.cleanup,syncOptions:{cwd:e.cwd,global:!0}})].every((n)=>n)?0:1}async function cc(e){let t=J(e.syncOptions),n=k(t.filesystemScope,e.legacyPath),r=x(n);if(r===null)return console.log(`No legacy config found at ${e.legacyPath}`),!0;let o=Om(r);if(!o.ok){for(let m of o.errors)console.error(m);return!1}let i=Y(t.configTarget);if(i.errors.length>0){for(let m of i.errors)console.error(m);return!1}let s=i.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},a=$m(lc(e.configPath),s.rules,e.defaultRulebookName,e.migratedFrom,t.filesystemScope),l=Pn(lc(e.configPath),a,"rulebook.json"),c=k(t.filesystemScope,l),d=[Co(t.configTarget),Co(c),Co(t.lockTarget)],p=await _m(e,t.configTarget,c,a,o.config.rules,s.rules.includes(a)?s.rules:[...s.rules,a],s.overrides??{},s.transparent_wrappers??[]);if(!p.ok){Hm(d);for(let m of p.errors)console.error(m);return!1}if(!e.cleanup)return console.log(`Migrated legacy config at ${e.legacyPath}. Legacy file is no longer used.`),!0;if(!Fm(t.configTarget,c,a,e.migratedFrom,o.config.rules))return console.error(`Migration cleanup verification failed for ${e.legacyPath}`),!1;return ft(n),console.log(`Deleted legacy config at ${e.legacyPath}`),!0}async function _m(e,t,n,r,o,i,s,a){try{return Z(t,{version:1,rules:i,overrides:s,transparent_wrappers:a}),Z(n,Nm(r,e.migratedFrom,o)),await qe(e.syncOptions)}catch(l){return{ok:!1,errors:[l instanceof Error?l.message:String(l)]}}}function Om(e){try{let t=JSON.parse(e),n=qn(t);if(n.errors.length>0)return{ok:!1,errors:n.errors};return{ok:!0,config:{version:1,rules:t.rules??[]}}}catch{return{ok:!1,errors:["Invalid JSON"]}}}function $m(e,t,n,r,o){let i=t.find((s)=>Mm(k(o,Pn(e,s,"rulebook.json")))===r);if(i)return i;if(x(k(o,Pn(e,n,"rulebook.json")))===null)return n;for(let s=2;;s++){let a=`${n}-${s}`;if(x(k(o,Pn(e,a,"rulebook.json")))===null)return a}}function Nm(e,t,n){return{rulebook_version:1,name:e,version:"1.0.0",description:"Migrated CC Safety Net rules.",author:"project",migrated_from:t,allowed_commands:[...new Set(n.map((r)=>r.command))],rules:n,tests:n.map((r)=>({command:[r.command,r.subcommand,r.block_args[0]].filter(Boolean).join(" "),expect:"blocked",rule:r.name}))}}function Fm(e,t,n,r,o){if(!Y(e).config?.rules.includes(n))return!1;try{let s=x(t);if(s===null)return!1;let a=JSON.parse(s);return a.migrated_from===r&&JSON.stringify(a.rules)===JSON.stringify(o)}catch{return!1}}function Co(e){return{target:e,content:x(e)}}function Hm(e){for(let t of e){if(t.content===null){ft(t.target);continue}xe(t.target,t.content)}}function Mm(e){let t=x(e);if(t===null)return null;try{let n=JSON.parse(t);return typeof n.migrated_from==="string"?n.migrated_from:null}catch{return null}}import{mkdir as jm,readFile as Um,writeFile as Gm}from"node:fs/promises";import{dirname as Bm,join as qm}from"node:path";var Vm=86400000,zm=604800000;async function fc(e=Date.now()){if(process.env.CC_SAFETY_NET_NO_UPDATE_CHECK)return null;let t=sr();if(!t)return null;let n=qm(t,".cc-safety-net","update-check.json"),r=await Km(n,e);if(!r.lastCheck||e-r.lastCheck>Vm){let s=await Qe();if(r.lastCheck=e,s.latestVersion)r.latestVersion=s.latestVersion;if(!await pc(n,r))return null;if(s.error)return null}let o=r.latestVersion,i=P();if(!o||!Sr(o,i))return null;if(r.notifiedVersion===o&&r.notifiedAt!==void 0&&e-r.notifiedAt<zm)return null;if(r.notifiedVersion=o,r.notifiedAt=e,!await pc(n,r))return null;return`UPDATE_AVAILABLE: cc-safety-net v${o} is available (running v${i}). Ask the user once whether to run \`npx -y cc-safety-net@latest update\`; continue the current task either way and do not raise this again.`}async function Km(e,t){let n=await Um(e,"utf8").then((i)=>JSON.parse(i)).catch(()=>{return});if(!n||typeof n!=="object"||Array.isArray(n))return{};let r=n,o=(i)=>typeof i==="number"&&Number.isFinite(i)&&i<=t?i:void 0;return{lastCheck:o(r.lastCheck),latestVersion:typeof r.latestVersion==="string"?r.latestVersion:void 0,notifiedVersion:typeof r.notifiedVersion==="string"?r.notifiedVersion:void 0,notifiedAt:o(r.notifiedAt)}}async function pc(e,t){return jm(Bm(e),{recursive:!0,mode:448}).then(()=>Gm(e,JSON.stringify(t),{mode:384})).then(()=>!0).catch(()=>!1)}import{dirname as Wm,join as Jm,resolve as ko}from"node:path";var gc="CC Safety Net Config",Ym="═".repeat(gc.length),Zm="https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json",Xm=new Set(["rule.json","rule.lock","cache"]);function hc(e={}){try{return Qm(e)}catch(t){if(t instanceof N)return console.error(t.message),1;throw t}}function Qm(e){let t=e.cwd??process.cwd(),n=e.userConfigPath??Q(),r=e.projectConfigPath??X(t),o=e.legacyUserConfigPath??gt(),i=e.legacyProjectConfigPath??Ko(t),s=ko(t,nr),a=Wm(n),l=ee({cwd:t,userConfigPath:n,projectConfigPath:r}),c=ee({cwd:t}),d=k(l.userScope,n),p=k(l.projectScope,r),m=e.legacyUserConfigPath?pt(e.legacyUserConfigPath,"user policy"):k(c.userScope,o),u=e.legacyProjectConfigPath?pt(e.legacyProjectConfigPath,"project policy"):k(c.projectScope,i),h=!1,f=!1,L=[],v=[],w=eg(k(c.projectScope,s));if(ng(),x(d)!==null){let y=le(d);if(y.errors.push(...ce(n,Ve({userConfigDir:a}),{userConfigDir:a},l.userScope)),L.push({scope:"User",path:n,result:y,schema:"rules",sourceDisplayMap:Ce(n,l.userScope),target:d}),y.errors.length>0)h=!0}if(x(m)!==null)if(f=!0,x(d)!==null)v.push(Tn("user","cleanup"));else{let y=Vn(m);if(L.push({scope:"User",path:o,result:y,schema:"legacy",sourceDisplayMap:new Map,inactive:!0,target:m}),v.push(Tn("user",y.errors.length>0?"fix-or-delete":"migrate")),y.errors.length>0)h=!0}if(x(p)!==null){let y=le(p);if(y.errors.push(...ce(r,ze(r),{userConfigDir:a},l.projectScope)),L.push({scope:"Project",path:ko(r),result:y,schema:"rules",sourceDisplayMap:Ce(r,l.projectScope),target:p}),y.errors.length>0)h=!0;if(x(u)!==null)f=!0,v.push(Tn("project","cleanup"))}else if(x(u)!==null){f=!0,h=!0;let y=Vn(u);L.push({scope:"Project",path:ko(i),result:y,schema:"legacy",sourceDisplayMap:new Map,inactive:!0,target:u}),v.push(Tn("project",y.errors.length>0?"fix-or-delete":"migrate"))}if(w?.result.errors.length)h=!0;if(L.length===0&&!w)return console.log(`
No config files found. Using built-in rules only.`),0;for(let y of L)if(y.inactive)og(y.scope,y.path,y.result,y.sourceDisplayMap);else if(y.result.errors.length>0)ig(y.scope,y.path,y.result.errors);else{if(y.schema==="rules"&&lg(y.target))console.log(`
Added $schema to ${y.scope.toLowerCase()} config.`);rg(y.scope,y.path,y.result,y.schema,y.sourceDisplayMap)}for(let y of v)console.error(`
${g.red(y)}`);if(w)if(w.result.errors.length>0)ag(w.path,w.result.errors);else sg(w.path,w.result);if(h)return console.error(`
Config validation failed.`),1;return console.log(f?`
Configs valid with warnings.`:`
All configs valid.`),0}function Tn(e,t){let n=`legacy ${e} config`;if(t==="cleanup")return`Warning: Legacy ${e} config is no longer needed. Run \`npx -y cc-safety-net rule migrate --cleanup\` to clean it up safely.`;if(t==="migrate")return`Warning: Legacy ${e} config is ignored by CC Safety Net. Run \`npx -y cc-safety-net rule migrate\`.`;return`Warning: Legacy ${e} config is no longer supported. Fix or delete the ${n}, then run \`npx -y cc-safety-net rule migrate\`.`}function eg(e){if(Be(e)===null)return null;let t=tg(e);if(t.ruleNames.size===0&&t.errors.length===0)return null;return{path:e.path,result:t}}function tg(e){let t=[],n=new Set,r=(Be(e)??[]).filter((o)=>!Xm.has(o.name)).sort((o,i)=>o.name.localeCompare(i.name));if(r.length===0)return{errors:t,ruleNames:n};for(let o of r){if(!mt.test(o.name)){t.push(`rulebook directory names must match ${mt}: ${o.name}`);continue}if(o.kind!=="directory"){t.push(`${o.name} must be a rulebook directory`);continue}let i=k(e.scope,Jm(e.path,o.name,"rulebook.json")),s=x(i);if(s===null){t.push(`${o.name}/rulebook.json is required`);continue}try{let a;try{a=JSON.parse(s)}catch{t.push(`${o.name}/rulebook.json: invalid JSON`);continue}let l=mc(a);if(l.name!==o.name){t.push(`rulebook name "${l.name}" must match folder "${o.name}"`);continue}n.add(o.name)}catch(a){t.push(a instanceof Error?`${o.name}/rulebook.json: ${a.message}`:`${o.name}/rulebook.json: ${String(a)}`)}}return{errors:t,ruleNames:n}}function ng(){console.log(gc),console.log(Ym)}function rg(e,t,n,r,o){if(console.log(`
✓ ${e} config: ${t}`),console.log(`  Schema: ${r==="rules"?"rulebook sources":"legacy inline rules"}`),n.ruleNames.size>0){console.log(`  ${r==="rules"?"Sources":"Rules"}:`);let i=1;for(let s of n.ruleNames)console.log(`    ${i}. ${o.get(s)??s}`),i++}else console.log(`  ${r==="rules"?"Sources":"Rules"}: (none)`)}function og(e,t,n,r){if(console.error(`
✗ Legacy ${e.toLowerCase()} config: ${t}`),console.error("  Schema: legacy inline rules"),console.error("  Status: ignored by CC Safety Net"),n.errors.length>0){console.error("  Errors:");let o=1;for(let i of n.errors)for(let s of i.split("; "))console.error(`    ${o}. ${s}`),o++;return}if(n.ruleNames.size>0){console.error("  Rules:");let o=1;for(let i of n.ruleNames)console.error(`    ${o}. ${r.get(i)??i}`),o++;return}console.error("  Rules: (none)")}function ig(e,t,n){yc(`${e} config`,t,n)}function sg(e,t){console.log(`
✓ GitHub source rules: ${e}`),console.log("  Rulebooks:");let n=1;for(let r of t.ruleNames)console.log(`    ${n}. ${r}`),n++}function ag(e,t){yc("GitHub source rules",e,t)}function yc(e,t,n){console.error(`
✗ ${e}: ${t}`),console.error("  Errors:");let r=1;for(let o of n)for(let i of o.split("; "))console.error(`    ${r}. ${i}`),r++}function lg(e){try{let t=x(e);if(t===null)return!1;let n=JSON.parse(t);if(n.$schema)return!1;return xe(e,JSON.stringify({$schema:Zm,...n},null,2)),!0}catch(t){if(t instanceof N)throw t;return!1}}var Lc=new Set(["init","add","remove","update","sync","list","wrapper","migrate","doc","verify"]),dg=new Set(["add","remove","list"]);async function bc(e){try{return await ug(e)}catch(t){if(t instanceof N)return console.error(t.message),1;throw t}}async function ug(e){let t=fg(e),n=t.help?pg(t.positionals):null;if(n)return vn(n),0;if(t.errors.length>0){for(let s of t.errors)console.error(s);return 1}let r=t.positionals[0];if(!r)return vn(Ze,console.error),1;let o=t.positionals[1],i={global:t.global,check:t.check};if(r==="init"){let s=J(i),a=s.configDir;hg(s.configTarget),vc(k(s.filesystemScope,Bt({...i,cacheConfigDir:a})));let l=cg(a,"example-rules","rulebook.json"),c=k(s.filesystemScope,l);if(t.example&&x(c)===null)ir(c,"example-rules");let d=await qe(i);return Mt(d,"Rule config initialized."),d.ok?0:1}if(r==="add"){if(!o)return console.error("rule add requires a source"),1;let s=await Qn(o,i);return Mt(s,`Added rulebook source: ${o}`),s.ok?0:1}if(r==="remove"){if(!o)return console.error("rule remove requires a source"),1;let s=await tr(o,{...i,deleteSource:t.deleteSource});return Mt(s,`Removed rulebook source: ${o}`),s.ok?0:1}if(r==="update"||r==="sync"){let s=await qe({...i,only:r==="update"?o:void 0});return Mt(s,t.check?"Rule config checked.":"Rule config synced."),s.ok?0:1}if(r==="list"){let s=Le(),a=ee({});return ac(s,{user:Ce(s.userConfigPath,a.userScope),project:Ce(s.projectConfigPath,a.projectScope)}),s.errors.length>0?1:0}if(r==="wrapper")return yg(t);if(r==="migrate")return uc({cleanup:t.cleanup,cwd:process.cwd()});if(r==="doc"){console.log(ic);let s=await fc();if(s)console.error(s);return 0}if(r==="verify")return hc();return 1}function pg(e){if(e.length===0)return Ze;let t=Ze.subcommands.filter((r)=>r.usage.split(" ")[0]===e[0]);if(t.length===0)return null;if(e.length===1&&t.length>1)return{name:`rule ${e[0]}`,description:`Subcommands of rule ${e[0]}`,usage:`rule ${e[0]} <subcommand>`,subcommands:t,options:[]};let n=e.length===1?t[0]:t.find((r)=>r.usage.split(" ")[1]===e[1]);if(!n)return null;return{name:`rule ${e[0]}`,description:n.description,usage:`rule ${n.usage}`,options:[]}}function fg(e){let t=T({label:"rule",booleans:{global:["-g","--global"],check:["--check"],cleanup:["--cleanup"],deleteSource:["--delete-source"],example:["--example"]},positionals:"list"},e),n={...t.flags,help:t.help,positionals:t.positionals,errors:t.errors};return mg(n),n}function mg(e){let[t]=e.positionals;if(t&&!Lc.has(t))e.errors.push(`Unknown rule subcommand: ${t}`);if(e.deleteSource&&t!=="remove")if(t&&Lc.has(t))e.errors.push(`Unknown option for rule ${t}: --delete-source`);else e.errors.push("--delete-source is only valid with 'rule remove'");if(e.cleanup&&t!=="migrate")e.errors.push(In(t,"--cleanup"));if(e.example&&t!=="init")e.errors.push(In(t,"--example"));if(t==="migrate"){if(e.global)e.errors.push(In(t,"--global"));if(e.check)e.errors.push(In(t,"--check"));if(e.positionals.length>1)e.errors.push(`Unexpected rule migrate argument: ${e.positionals[1]}`)}else if(t==="wrapper")gg(e);else if(e.positionals.length>2)e.errors.push(`Unexpected rule argument: ${e.positionals[2]}`);if(t==="list"&&e.global)e.errors.push("Unknown option for rule list: --global")}function In(e,t){return e?`Unknown option for rule ${e}: ${t}`:`Unknown option for rule: ${t}`}function gg(e){let t=e.positionals[1],n=e.positionals[2];if(!t){e.errors.push("rule wrapper requires add, remove, or list");return}if(!dg.has(t)){e.errors.push(`Unknown rule wrapper action: ${t}`);return}if(t==="list"){if(n)e.errors.push(`Unexpected rule wrapper argument: ${n}`);return}if(!n){e.errors.push(`rule wrapper ${t} requires a command`);return}if(e.positionals.length>3)e.errors.push(`Unexpected rule wrapper argument: ${e.positionals[3]}`)}function hg(e){if(x(e)===null){or(e);return}let t=Y(e);if(!t.config)return;Z(e,{version:1,rules:t.config.rules,overrides:t.config.overrides??{},transparent_wrappers:t.config.transparent_wrappers??[]})}async function yg(e){let t=e.positionals[1],n=e.positionals[2],r=J({global:e.global}).configTarget;if(t==="list"){let a=Y(r);if(a.errors.length>0){for(let l of a.errors)console.error(l);return 1}return Lg(a.config?.transparent_wrappers??[]),0}if(!n||!ar.test(n))return console.error("transparent wrapper must match command pattern"),1;if(cr(n))return console.error(`reserved command "${n}" cannot be a wrapper`),1;let o=Y(r);if(o.errors.length>0){for(let a of o.errors)console.error(a);return 1}let i=o.config??{version:1,rules:[],overrides:{},transparent_wrappers:[]},s=t==="add"?[...new Set([...i.transparent_wrappers??[],n])]:(i.transparent_wrappers??[]).filter((a)=>a!==n);return Z(r,{version:1,rules:i.rules,overrides:i.overrides??{},transparent_wrappers:s}),console.log(t==="add"?`Added transparent wrapper: ${n}`:`Removed transparent wrapper: ${n}`),0}function Lg(e){if(e.length===0){console.log("Transparent wrappers: (none)");return}console.log(`Transparent wrappers (${e.length}):`);for(let t of e)console.log(`  - ${t}`)}import{homedir as wc}from"node:os";import{existsSync as vg,readFileSync as bg}from"node:fs";import{homedir as wg}from"node:os";import{join as xg}from"node:path";async function Cg(e){if(e.isTTY)return null;return(await hr(e).catch(()=>null))?.trim()||null}function kg(){if(process.env.CLAUDE_SETTINGS_PATH)return process.env.CLAUDE_SETTINGS_PATH;return xg(wg(),".claude","settings.json")}function So(){let e=kg();if(!vg(e))return!1;try{let t=bg(e,"utf-8"),n=JSON.parse(t);if(!n.enabledPlugins)return!1;let r="cc-safety-net@cc-marketplace";if(!(r in n.enabledPlugins))return!1;return n.enabledPlugins[r]===!0}catch(t){if(Lt(S.debug))console.error(`CC Safety Net debug: failed to read Claude settings: ${e}: ${t instanceof Error?t.message:String(t)}`);return!1}}async function Do(e=process.stdin){let t=So(),n;if(!t)n="\uD83D\uDEE1️ CC Safety Net ❌";else{let o=B({cwd:process.cwd()}),i=o.policy,s=de(i),a=Object.values(De(i,s.capabilities)).some((c)=>c.changesInherited);n=`\uD83D\uDEE1️ CC Safety Net ${{standard:"✅",strict:"\uD83D\uDD12",paranoid:"\uD83D\uDC41️",custom:"\uD83D\uDD27"}[a?"custom":s.effectiveLevel]}${s.worktreeMode?"\uD83C\uDF33":""}${o.state==="degraded"?"⚠️":""}`}let r=await Cg(e);if(r&&!r.startsWith("{"))console.log(`${r} | ${n}`);else console.log(n)}function xc(){let e=B({cwd:process.cwd()}),t=e.policy,n=de(t),r=!!process.env.NO_COLOR||!process.stdout.isTTY,o=Math.min(process.stdout.columns||80,100),i=r?"ok":"✔",s=r?"OFF":"✘",a=(u,h)=>{let f=`  ${u.padEnd(13)}${h}`;return(f.length>o?`${f.slice(0,o-1)}…`:f).replaceAll(s,g.red(s))},l=Object.values(De(t,n.capabilities)).some((u)=>u.changesInherited),c=vt(),d={ready:g.green,degraded:g.yellow}[e.state],p=[...So()?[]:["plugin cc-safety-net@cc-marketplace is disabled in Claude Code; nothing is enforced in Claude Code until it is re-enabled. Other integrations are not affected."],...e.diagnostics],m=r?"-":"·";console.log([`${r?"":"\uD83D\uDEE1️  "}CC Safety Net — ${d(e.state)}`,"",a("Protection",`destructive ${t.destructiveCommandProtectionEnabled?i:s}   secrets ${t.secretProtection.enabled?i:s}`),a("Level",l?`${n.effectiveLevel} (customised)`:n.effectiveLevel),a("Rules",t.rules.length===0?"none active":`${t.rules.length} active`),a("Policy",c.startsWith(wc())?`~${c.slice(wc().length)}`:c),...n.worktreeMode?[a("Worktree","relaxations active")]:[],"",...p.length===0?["  Everything configured is active."]:["  Not active",...p.flatMap((u)=>Ln(u,"      ",o-6).map((h,f)=>f===0?`    ${m} ${h}`:h)),"","  Full report: cc-safety-net doctor"]].join(`
`))}import{spawn as Uc}from"node:child_process";import{randomBytes as $g}from"node:crypto";import{createServer as Ng}from"node:http";import{Writable as Fg}from"node:stream";import{homedir as Sg}from"node:os";var _n=500;function Dg(e){let t=e.filter((o)=>o.decision!=="allow"),n=e.filter((o)=>o.decision==="allow"),r=Math.min(t.length,Math.max(_n-n.length,Math.ceil(_n/2)));return[...t.slice(0,r),...n.slice(0,_n-r)]}function Cc(e,t=ue()){if(t)ke(t);let n=(f)=>new Date(f.getFullYear(),f.getMonth(),f.getDate()).getTime(),r=n(new Date),o=new Date(r);o.setDate(o.getDate()-(e-1));let i=o.getTime(),s=[],a={count:0};for(let f of t?ye(t,a):[])for(let L of ut(f,a)){if(!L||typeof L.ts!=="string"||typeof L.command!=="string")continue;let v=new Date(L.ts).getTime();if(!Number.isFinite(v))continue;if(v>=i)s.push(L)}s.sort((f,L)=>new Date(L.ts).getTime()-new Date(f.ts).getTime());let l=Array.from({length:e},()=>0),c=Array.from({length:e},()=>0),d={},p={},m={},u=0,h=0;for(let f of s){let L=f.agent||"unknown";d[L]=(d[L]??0)+1;let v=Math.round((r-n(new Date(f.ts)))/86400000),w=e-1-v,y=v>=0&&v<e;if(y)c[w]=(c[w]??0)+1;if(f.decision!=="allow"){if(u++,f.ruleId)p[f.ruleId]=(p[f.ruleId]??0)+1;let C=He(f.segment||f.command);if(C)m[C]=(m[C]??0)+1;if(f.failureStage)h++;if(y)l[w]=(l[w]??0)+1}}return{days:e,logsDir:t,homeDir:Sg(),totalInWindow:s.length,truncated:s.length>_n,unreadable:a.count,counts:{blocked:u,allowed:s.length-u,agents:d,blockedByDay:l,analyzedByDay:c,rules:p,commands:m,errors:h},entries:Dg(s).sort((f,L)=>new Date(L.ts).getTime()-new Date(f.ts).getTime())}}import{spawn as Rg}from"node:child_process";import{existsSync as kc,statSync as Ag}from"node:fs";import{delimiter as Eg,join as Pg}from"node:path";var Tg=120000,On="Choose the project folder",Ig=`try
  return POSIX path of (choose folder with prompt "${On}")
on error number -128
  return ""
end try`,_g=`Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = '${On}'
if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { [Console]::Out.Write($dialog.SelectedPath) }`,Sc=[{binary:"zenity",args:["--file-selection","--directory",`--title=${On}`]},{binary:"kdialog",args:["--getexistingdirectory",".","--title",On]}],Dc=(e,t)=>(t.PATH??"").split(Eg).some((n)=>n.length>0&&kc(Pg(n,e)));function Rc(e,t){if(e==="darwin"||e==="win32")return!0;if(e!=="linux")return!1;if(!t.DISPLAY&&!t.WAYLAND_DISPLAY)return!1;return Sc.some((n)=>Dc(n.binary,t))}function Og(e,t){if(e==="darwin")return{cmd:"osascript",args:["-e",Ig]};if(e==="win32")return{cmd:"powershell.exe",args:["-NoProfile","-STA","-Command",_g]};let n=Sc.find((r)=>Dc(r.binary,t));return n?{cmd:n.binary,args:n.args}:null}function Ac(e=process.platform,t=process.env){let n=Og(e,t);if(!n)return Promise.resolve({error:"No folder dialog is available on this system"});return new Promise((r)=>{let o=Rg(n.cmd,n.args,{env:t,stdio:["ignore","pipe","pipe"]}),i="",s=!1,a=(c)=>{if(s)return;s=!0,clearTimeout(l),r(c)},l=setTimeout(()=>{o.kill(),a({error:"The folder dialog timed out"})},Tg);o.stdout.on("data",(c)=>{i+=c.toString()}),o.on("error",()=>a({error:`Could not open the folder dialog (${n.cmd})`})),o.on("close",()=>{let c=i.trim().replace(/\/+$/,"");if(!c)return a({cancelled:!0});if(!kc(c)||!Ag(c).isDirectory())return a({error:"That selection is not a folder on disk"});a({path:c})})})}var Ec=`<!doctype html>
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
          <div class="view-head">
            <p class="panel-sub muted">Choose what CC Safety Net blocks. Changes apply after you save.</p>
          </div>
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
              <small id="rules-composer-hint">Rules match a command, an optional subcommand, and exact arguments - not file paths or patterns.</small>
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
              <div class="info-row"><span>Audit logs</span><code id="logs-path"></code></div>
            </div>
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
            <div class="panel-head raw-json-head">
              <div class="panel-title">
                <h2>Policy JSON</h2>
                <p class="panel-sub muted" id="raw-source">Read-only mirror of the policy controls.</p>
              </div>
              <button class="icon-button" id="raw-copy" type="button" aria-label="Copy raw JSON to clipboard"></button>
            </div>
            <textarea id="raw" aria-label="Raw policy JSON" aria-describedby="raw-source" readonly></textarea>
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
// src/engine/audit-display.ts
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
// src/integrations/catalog.ts
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
      order: 5,
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
      order: 4,
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
    id: "hermes-agent",
    displayName: "Hermes Agent",
    doctorOrder: 8,
    runtime: {
      order: 6,
      flags: ["-ha", "--hermes-agent"],
      description: "Run as Hermes Agent pre_tool_call hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 8,
      flag: "--hermes-agent",
      artifactKind: "plugin",
      probeCommand: ["hermes", "--version"]
    }
  },
  {
    id: "kimi-code",
    displayName: "Kimi Code",
    doctorOrder: 9,
    runtime: {
      order: 7,
      flags: ["-kc", "--kimi-code"],
      description: "Run as Kimi Code PreToolUse hook",
      legacyTopLevelFlags: []
    },
    install: {
      order: 9,
      flag: "--kimi-code",
      artifactKind: "hook config",
      probeCommand: ["kimi", "--version"]
    }
  },
  {
    id: "openclaw",
    displayName: "OpenClaw",
    doctorOrder: 10,
    install: {
      order: 10,
      flag: "--openclaw",
      artifactKind: "plugin",
      probeCommand: ["openclaw", "--version"]
    }
  },
  {
    id: "opencode",
    displayName: "OpenCode",
    doctorOrder: 11,
    install: {
      order: 11,
      flag: "--opencode",
      artifactKind: "plugin",
      probeCommand: ["opencode", "--version"]
    }
  },
  {
    id: "pi",
    displayName: "Pi",
    doctorOrder: 12,
    install: {
      order: 12,
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
      order: 3,
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
var requestPolicyPreview = (policy = collectFormPolicy()) => requestJson("/api/policy/preview", {
  method: "POST",
  body: JSON.stringify(policy)
});
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
  const customized = state.preview.counts.effectiveCustomizations > 0 || Object.entries(policy.safety.overrides).some(([key, value]) => value !== levelCapabilities(policy.safety.level)[key]);
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
    const busy2 = integrationBusy.has(row.target);
    const version = row.version === null ? '<span class="muted">not detected</span>' : \`<span class="agent-badge">v\${escapeHtml(row.version)}</span>\`;
    const status = row.status === "active" ? '<span class="state-active">Installed</span>' : row.status === "disabled" ? '<span class="state-disabled">Disabled</span>' : row.status === "not-inspected" ? \`<span class="muted" title="This runtime's state file could not be read, so its status is unknown.">Not inspected</span>\` : '<span class="muted">Not installed</span>';
    const uninstall = row.status === "active";
    const busyLabel = uninstall ? "Uninstalling…" : "Installing…";
    const action = row.version === null ? "" : \`<button type="button" class="\${uninstall ? "danger" : "primary"}" data-integration-action="\${uninstall ? "uninstall" : "install"}" data-integration-target="\${escapeHtml(row.target)}"\${busy2 ? " disabled" : ""}>\${busy2 ? busyLabel : uninstall ? "Uninstall" : row.status === "disabled" ? "Enable" : "Install"}</button>\`;
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
  qs("raw").value = formatPolicy(collectFormPolicy());
  updateRawSource();
};
var updateDirtyStatus = () => {
  if (!state || state.errors.length)
    return;
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
  let adding = false;
  const add = async (value) => {
    if (adding)
      return;
    const entries = [...new Set(pathLines(value))];
    if (entries.length === 0)
      return;
    const submitted = qs(\`\${prefix}-input\`).value;
    const additions = entries.filter((entry) => !config.getPaths().includes(entry));
    if (config.validateAdditions && additions.length) {
      adding = true;
      try {
        const error = await config.validateAdditions([...config.getPaths(), ...additions]);
        if (error) {
          setHint(\`Not added: \${additions.join(", ")} — \${error}\`);
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
var setSecretOverride = (rule, active) => {
  if (active === !rule.defaultOff) {
    delete draftPolicy.secret_protection.overrides[rule.id];
    return;
  }
  draftPolicy.secret_protection.overrides[rule.id] = active ? "on" : "off";
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
      if (!rule.paths) {
        return \`<label class="row \${disabled ? "row-disabled" : ""}">\${control}</label>\`;
      }
      return \`<div class="row rule-row \${disabled ? "row-disabled" : ""}">
            <label class="rule-control">\${control}</label>
            <button type="button" class="rule-example-button" data-secret-paths="\${escapeHtml(rule.id)}" aria-label="\${escapeHtml(\`Show protected paths for \${rule.label}\`)}" aria-haspopup="dialog" aria-controls="rule-example-popover">?</button>
          </div>\`;
    }).join("")}</div>
        </div>
      </section>
    \`;
  }).join("");
};
var levelCapabilities = (level) => ({
  fail_closed: level === "strict" || level === "paranoid",
  paranoid_rm: level === "paranoid",
  paranoid_interpreters: level === "paranoid"
});
var presetName = () => safetyLevels[draftPolicy.safety.level][0];
var renderPresetStatus = () => {
  if (!preview)
    return;
  const customized = preview.counts.effectiveCustomizations > 0 || Object.entries(draftPolicy.safety.overrides).some(([key, value]) => value !== levelCapabilities(draftPolicy.safety.level)[key]);
  qs("safety-preset-status").textContent = customized ? \`\${presetName()} · Customized\` : "";
  qs("safety-preset-status").classList.toggle("customized", customized);
};
var renderSafety = () => {
  const environmentSources = preview ? [
    ...new Set(Object.values(preview.capabilities).filter((capability) => capability.source === "environment").flatMap((capability) => capability.sources.filter((source) => source.startsWith("env "))))
  ] : [];
  qs("environment-overrides").hidden = environmentSources.length === 0;
  qs("environment-overrides").textContent = environmentSources.length ? \`Environment-raised protection: \${environmentSources.join(", ")}\` : "";
  qs("safety-level").innerHTML = Object.entries(safetyLevels).map(([level, meta]) => \`<label class="row preset-\${level}"><input type="radio" name="safety-level" value="\${level}" \${checkbox(draftPolicy.safety.level === level)}><span><strong>\${meta[0]}</strong><small>\${meta[1]}</small></span></label>\`).join("");
  const inherited = levelCapabilities(draftPolicy.safety.level);
  qs("safety-overrides").innerHTML = Object.entries(safetyOverrides).map(([key, meta]) => {
    const value = draftPolicy.safety.overrides[key];
    const inheritedText = inherited[key] ? "on" : "off";
    return \`<label class="row safety-override-row"><span><strong>\${meta[0]}</strong><small>\${meta[1]}</small></span><select data-safety-override="\${key}">
      <option value="inherit" \${value === undefined ? "selected" : ""}>Inherit from preset (\${inheritedText})</option>
      <option value="true" \${value === true ? "selected" : ""}>Force on</option>
      <option value="false" \${value === false ? "selected" : ""}>Force off</option>
    </select></label>\`;
  }).join("");
  qs("workflow").innerHTML = \`<label class="row"><input type="checkbox" data-workflow-worktree \${checkbox(draftPolicy.workflow.worktree_mode)}><span><strong>Allow discarding local changes in linked git worktrees</strong><small>Only relaxes linked worktree discard checks.</small></span></label>\`;
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
              </div>\`;
    }).join("")}</div>
          </section>\`).join("")}
        </div>
      </section>\`;
  }).join("");
};
var refreshPolicyPreview = async () => {
  const requestId = ++previewRequestId;
  const result = await requestPolicyPreview();
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
    body: JSON.stringify({ command, policy: collectFormPolicy() })
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
  qs("app-version").textContent = state.version;
  renderSafety();
  qs("destructive-command").innerHTML = '<label class="row master"><input type="checkbox" data-destructive-command-enabled ' + checkbox(state.policy.destructive_command_protection.enabled) + '><span><strong>Destructive command protection</strong><small>Block configurable destructive git, filesystem, and execution patterns. Catastrophic and custom rules remain active when disabled.</small></span><span class="master-badge">' + (state.policy.destructive_command_protection.enabled ? "On" : "Off") + "</span></label>" + '<div id="destructive-command-rules"></div>' + '<section class="rule-tier">' + '<button type="button" class="rule-tier-head" aria-expanded="false" aria-controls="allow-paths-content"><span class="panel-chevron" aria-hidden="true"></span><span class="tier-label"><strong id="allow-paths-label">Allow paths</strong><small>Recursive deletes targeting these paths are not blocked, like /tmp. The home directory, or any path containing it, is rejected.</small></span><span class="tier-counts" id="allow-paths-count"></span></button>' + '<div class="tier-content paths-content" id="allow-paths-content" hidden>' + '<p class="muted">Use an absolute path or a ~/ path. Paste multiple lines to add several paths at once.</p>' + '<div class="paths-add"><input type="text" id="allow-paths-input" data-path-input="allow-paths" autocomplete="off" spellcheck="false" placeholder="/absolute/path or ~/path" aria-labelledby="allow-paths-label"><button type="button" class="icon-button" id="allow-paths-add-button" data-path-add="allow-paths" aria-label="Add allow path">' + pathListIcons.add + "</button></div>" + '<p class="paths-hint" id="allow-paths-hint" hidden></p>' + '<ul class="paths-list" id="allow-paths-list"></ul>' + "</div></section>";
  qs("secret").innerHTML = '<label class="row master"><input type="checkbox" id="secret-enabled" ' + checkbox(state.policy.secret_protection.enabled) + '><span><strong>Secret protection</strong><small>Block default sensitive paths, coding CLI credential locations, and configured deny paths.</small></span><span class="master-badge">' + (state.policy.secret_protection.enabled ? "On" : "Off") + "</span></label>" + '<div id="secret-patterns"></div>' + '<section class="rule-tier">' + '<button type="button" class="rule-tier-head" aria-expanded="false" aria-controls="deny-paths-content"><span class="panel-chevron" aria-hidden="true"></span><span class="tier-label"><strong id="deny-paths-label">Deny paths</strong><small>Configured paths and everything inside them are blocked while Secret protection is on.</small></span><span class="tier-counts" id="deny-paths-count"></span></button>' + '<div class="tier-content paths-content" id="deny-paths-content" hidden>' + '<p class="muted">Paste multiple lines to add several paths at once.</p>' + '<div class="paths-add"><input type="text" id="deny-paths-input" data-path-input="deny-paths" autocomplete="off" spellcheck="false" placeholder="path/to/protect" aria-labelledby="deny-paths-label"><button type="button" class="icon-button" id="deny-paths-add-button" data-path-add="deny-paths" aria-label="Add deny path">' + pathListIcons.add + "</button></div>" + '<p class="paths-hint" id="deny-paths-hint" hidden></p>' + '<ul class="paths-list" id="deny-paths-list"></ul>' + "</div></section>" + '<section class="rule-tier">' + '<button type="button" class="rule-tier-head" aria-expanded="false" aria-controls="secret-allow-paths-content"><span class="panel-chevron" aria-hidden="true"></span><span class="tier-label"><strong id="secret-allow-paths-label">Allow paths</strong><small>Configured files and subtrees are exempt from the pattern rules. Deny paths and coding CLI protections still apply. Entries covering the home directory are rejected, and glob patterns are not supported.</small></span><span class="tier-counts" id="secret-allow-paths-count"></span></button>' + '<div class="tier-content paths-content" id="secret-allow-paths-content" hidden>' + '<p class="muted">Paste multiple lines to add several paths at once.</p>' + '<div class="paths-add"><input type="text" id="secret-allow-paths-input" data-path-input="secret-allow-paths" autocomplete="off" spellcheck="false" placeholder="~/project/.env.test or ~/project/fixtures" aria-labelledby="secret-allow-paths-label"><button type="button" class="icon-button" id="secret-allow-paths-add-button" data-path-add="secret-allow-paths" aria-label="Add allow path">' + pathListIcons.add + "</button></div>" + '<p class="paths-hint" id="secret-allow-paths-hint" hidden></p>' + '<ul class="paths-list" id="secret-allow-paths-list"></ul>' + "</div></section>";
  qs("raw").value = state.errors.length ? state.raw : formatPolicy(draftPolicy);
  qs("policy-search").value = "";
  syncSearchState();
  renderDestructiveCommands();
  renderSecretPatterns();
  pathLists["deny-paths"].render();
  pathLists["secret-allow-paths"].render();
  pathLists["allow-paths"].render();
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
  const isPolicyShape = [
    "safety",
    "workflow",
    "destructive_command_protection",
    "secret_protection",
    "audit"
  ].every((key) => parsed && typeof parsed[key] === "object" && parsed[key] !== null);
  if (!isPolicyShape || stored === JSON.stringify(state.policy)) {
    sessionStorage.removeItem("cc-safety-net-draft");
    return;
  }
  parsed.secret_protection.allow_paths ??= [];
  draftPolicy = parsed;
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
  syncRawFromForm();
  updateDirtyStatus();
  refreshPolicyPreview();
  setAppStatus("Restored unsaved draft", "ok");
};
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
    renderSafety();
    syncRawFromForm();
    updateDirtyStatus();
    refreshPolicyPreview();
    return;
  }
  if (control.dataset?.safetyOverride) {
    if (control.value === "inherit")
      delete draftPolicy.safety.overrides[control.dataset.safetyOverride];
    if (control.value === "true")
      draftPolicy.safety.overrides[control.dataset.safetyOverride] = true;
    if (control.value === "false")
      draftPolicy.safety.overrides[control.dataset.safetyOverride] = false;
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
      if (input.checked === effectiveState.rules[rule.id]?.inheritedEnabled) {
        delete draftPolicy.destructive_command_protection.overrides[rule.id];
        return;
      }
      draftPolicy.destructive_command_protection.overrides[rule.id] = input.checked ? "on" : "off";
    });
    syncRawFromForm();
    updateDirtyStatus();
    refreshPolicyPreview();
    return;
  }
  if (input.dataset?.destructiveCommandActive) {
    const ruleId = input.dataset.destructiveCommandActive;
    if (input.checked === preview?.rules[ruleId]?.inheritedEnabled)
      delete draftPolicy.destructive_command_protection.overrides[ruleId];
    else
      draftPolicy.destructive_command_protection.overrides[ruleId] = input.checked ? "on" : "off";
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
    delete draftPolicy.destructive_command_protection.overrides[inheritedButton.dataset.useInherited ?? ""];
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
      draftPolicy.secret_protection.overrides = {};
      renderSecretPatterns();
      syncRawFromForm();
      updateDirtyStatus();
      refreshPolicyPreview();
    })();
    return;
  }
  if (target.closest("#discard-changes")) {
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
`;var Pc='<script id="ccsn-data" type="application/json">';function Tc(e){return Ec.replace(Pc,()=>Pc+JSON.stringify({token:e}).replaceAll("<","\\u003c"))}var Nn="kenryu42/cc-safety-net",Hg=`https://github.com/${Nn}`,Eo=1e4,Mg=7;async function Gc(e,t={}){let n=T({label:"gui",booleans:{noOpen:["--no-open"]}},e),r=t.log??console.log,o=t.error??console.error;if(n.errors.length>0){for(let s of n.errors)o(s);return o("Usage: cc-safety-net gui [--no-open]"),1}let i=await jg(t);if(r(`CC Safety Net policy GUI: ${i.url}`),!n.flags.noOpen)try{await(t.openBrowser??Wg)(i.url)}catch(s){o(`Failed to open browser: ${s instanceof Error?s.message:String(s)}`),o(`Open this URL manually: ${i.url}`)}if(t.keepAlive===!1)return await i.close(),0;return await Kg(i),0}async function jg(e={}){let t=$g(24).toString("base64url"),n=Ng((i,s)=>{Ug(i,s,t,e)});await new Promise((i,s)=>{n.once("error",s),n.listen(0,"127.0.0.1",()=>{n.off("error",s),i()})});let o=`http://127.0.0.1:${n.address().port}`;return{origin:o,token:t,url:`${o}/?token=${encodeURIComponent(t)}`,close:()=>zg(n)}}async function Ug(e,t,n,r){let o=new URL(e.url??"/","http://127.0.0.1");if(e.method==="GET"&&o.pathname==="/favicon.ico"){t.writeHead(204,{"cache-control":"no-store"}),t.end();return}if(!qg(e,o,n)){D(t,403,{error:"Forbidden"});return}if(e.method==="GET"&&o.pathname==="/"){Vg(t,Tc(n));return}if(e.method==="GET"&&o.pathname==="/api/policy"){let i=$c(r);D(t,200,{...i,configState:bt(B(r)),destructiveCommandRules:ht,secretPatterns:_c,version:P(),preview:i.errors.length>0?null:Fc(i.policy)});return}if(e.method==="POST"&&o.pathname==="/api/policy/preview"){let i=await $n(e);if(!i.ok){D(t,400,{errors:[i.error]});return}let s=Nc(i.value);D(t,s.errors.length>0?400:200,s);return}if(e.method==="POST"&&o.pathname==="/api/policy/explain"){let i=await $n(e);if(!i.ok){D(t,400,{errors:[i.error]});return}let s=i.value;if(s===null||typeof s.command!=="string"){D(t,400,{errors:["command must be a string"]});return}let a=fr(s.policy);if(a.length>0){D(t,400,{errors:a});return}D(t,200,Gg(s.command,s.policy,r));return}if(e.method==="POST"&&o.pathname==="/api/policy"){let i=await $n(e);if(!i.ok){D(t,400,{errors:[i.error]});return}let s=Ro(i.value,r);D(t,s.errors.length>0?400:200,s);return}if(e.method==="POST"&&o.pathname==="/api/reset"){D(t,200,Ro(Oc,r));return}if(e.method==="POST"&&o.pathname==="/api/repair"){D(t,200,Hc(r));return}if(e.method==="GET"&&o.pathname==="/api/activity"){let i=Je(r),s=Bg(o.searchParams.get("days"),i);if(s===null){D(t,400,{error:`days must be an integer between 1 and ${i}`});return}D(t,200,Cc(s,r.activityLogsDir));return}if(e.method==="POST"&&o.pathname==="/api/rules/choose-directory"){D(t,200,await Ac());return}if(e.method==="GET"&&o.pathname==="/api/rules"){let i=Le(r),s=new Map(i.rules.map((a)=>[a.name,a]));D(t,200,{projectPath:r.cwd??process.cwd(),canPickDirectory:Rc(process.platform,process.env),rulebooks:i.rulebooks.map((a)=>({source:a.source,spec:a.spec,name:a.name,version:a.version,rules:a.rules.flatMap((l)=>{let c=s.get(l);if(!c)return[];return[{name:c.name,command:c.command,subcommand:c.subcommand,block_args:c.block_args,reason:c.reason}]})})),errors:i.errors,warnings:i.warnings});return}if(e.method==="GET"&&o.pathname==="/api/star/context"){D(t,200,await(r.fetchStarContext??(()=>Qg({logsDir:r.activityLogsDir})))());return}if(e.method==="POST"&&o.pathname==="/api/star"){let i=await(r.starRepo??Jg)();D(t,200,i.ok?{ok:!0}:{ok:!1,fallbackUrl:Hg});return}if(e.method==="GET"&&o.pathname==="/api/integrations"){D(t,200,await(r.fetchIntegrations??Yg)());return}if(e.method==="GET"&&o.pathname==="/api/health"){D(t,200,await(r.fetchHealth??Zg)());return}if(e.method==="POST"&&(o.pathname==="/api/install"||o.pathname==="/api/uninstall")){let i=await $n(e);if(!i.ok){D(t,400,{errors:[i.error]});return}let s=i.value?.target;if(typeof s!=="string"||!se.some((l)=>l.target===s)){D(t,400,{error:"unknown target"});return}let a=o.pathname==="/api/install"?"install":"uninstall";D(t,200,await(r.runIntegration??Xg)(a,s));return}D(t,404,{error:"Not found"})}function Gg(e,t,n){let r=wn(t),o=B(n),i=yt({rules:o.policy.rules,transparentWrappers:o.policy.transparentWrappers,safety:jc(r.safety),worktreeMode:r.workflow.worktree_mode,destructiveCommandProtectionEnabled:r.destructive_command_protection.enabled,destructiveCommandRuleOverrides:r.destructive_command_protection.overrides,destructiveCommandAllowPaths:r.destructive_command_protection.allow_paths,secretProtection:{enabled:r.secret_protection.enabled,disabledRules:Mc(r.secret_protection.overrides),denyPaths:r.secret_protection.deny_paths,allowPaths:r.secret_protection.allow_paths}});return We(e,{policySnapshot:i,cwd:n.cwd,userConfigDir:n.userConfigDir})}function Bg(e,t){if(e===null)return Math.min(Mg,t);let n=Number(e);if(!Number.isInteger(n)||n<1||n>t)return null;return n}function qg(e,t,n){if(t.searchParams.get("token")!==n)return!1;if(e.method!=="POST")return!0;return e.headers["x-cc-safety-net-token"]===n}async function $n(e){let t=[];for await(let n of e)t.push(n);try{return{ok:!0,value:JSON.parse(Buffer.concat(t).toString("utf-8")||"{}")}}catch(n){return{ok:!1,error:`Invalid JSON: ${n instanceof Error?n.message:String(n)}`}}}function Vg(e,t){e.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}),e.end(t)}function D(e,t,n){e.writeHead(t,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),e.end(JSON.stringify(n))}function zg(e){return new Promise((t,n)=>{e.close((r)=>r?n(r):t())})}function Kg(e){return new Promise((t)=>{let n=()=>{process.off("SIGINT",r),process.off("SIGTERM",r)},r=()=>{n(),e.close().then(t)};process.once("SIGINT",r),process.once("SIGTERM",r)})}function Wg(e){let t=process.platform==="darwin"?"open":process.platform==="win32"?"cmd":"xdg-open",n=process.platform==="win32"?["/c","start","",e]:[e];return new Promise((r,o)=>{let i=Uc(t,n,{detached:!0,stdio:"ignore"}),s=(l)=>{i.off("spawn",a),o(l)},a=()=>{i.off("error",s),i.unref(),r()};i.once("error",s),i.once("spawn",a)})}async function Jg(e="gh",t=Eo){return{ok:await Ao(e,["api","-X","PUT",`/user/starred/${Nn}`],t)===0}}async function Yg(e={}){let t=await St(e.fetcher),n=Bc(t,e.homeDir);return{targets:V.map((r)=>{let o=n.find((i)=>i.platform===r.id);return{target:r.id,label:R(r.id),version:t.versions[r.id]??null,status:o?.configured?"active":o?.detected?"disabled":o?.inspectionStatus==="not-inspected"?"not-inspected":"not-installed"}}),system:{version:t.version,nodeVersion:t.nodeVersion,platform:t.platform}}}function Bc(e,t){return it(process.cwd(),{homeDir:t,ampPluginListOutput:e.ampPluginListOutput,codexPluginListOutput:e.codexPluginListOutput,copilotCliVersion:e.versions["copilot-cli"]})}async function Zg(e={}){let[t,n]=await Promise.all([St(e.fetcher),(e.checkUpdates??Qe)()]);return{hooks:Bc(t,e.homeDir).filter((r)=>r.detected).map((r)=>({platform:r.platform,label:R(r.platform),configured:r.configured})),update:{currentVersion:n.currentVersion,latestVersion:n.latestVersion??null,updateAvailable:n.updateAvailable}}}var Ic=Promise.resolve();function Xg(e,t,n={}){let r=async()=>{let i=[],s=console.log,a=console.error;console.log=(...l)=>i.push(l.map(String).join(" ")),console.error=console.log;try{return{ok:await Ht(e,[],{selectTargets:async()=>[t],output:new Fg({write(c,d,p){i.push(String(c).replace(/\n$/,"")),p()}}),...n})===0,output:i.join(`
`)}}finally{console.log=s,console.error=a}},o=Ic.then(r);return Ic=o.then(()=>{return},()=>{return}),o}async function Qg(e={}){let[t,n,r]=await Promise.all([e1(e.command),t1(e.fetchRepo),Promise.resolve(Yt(Je(),e.logsDir).totalBlocked)]);return{starred:t,starCount:n,blockedTotal:r}}async function e1(e="gh",t=Eo){if(await Ao(e,["auth","status"],t)!==0)return null;let n=await Ao(e,["api",`/user/starred/${Nn}`],t);if(n===0)return!0;if(n===null)return null;return!1}function Ao(e,t,n){return new Promise((r)=>{let o=Uc(e,t,{stdio:"ignore",windowsHide:!0}),i=!1,s,a=(l)=>{if(i)return;if(i=!0,s)clearTimeout(s);r(l)};o.once("error",()=>a(null)),o.once("close",a),s=setTimeout(()=>{o.kill(),a(null)},n)})}async function t1(e=fetch){try{let t=await e(`https://api.github.com/repos/${Nn}`,{headers:{accept:"application/vnd.github+json"},signal:AbortSignal.timeout(Eo)});if(!t.ok)return null;let n=await t.json();return typeof n.stargazers_count==="number"?n.stargazers_count:null}catch{return null}}function n1(e){if(e[0]!=="help")return!1;let t=e[1];if(!t)ao(),process.exit(0);if($t(t))process.exit(0);console.error(`Unknown command: ${t}`),console.error("Run 'cc-safety-net --help' for available commands."),process.exit(1)}var r1={hook:async(e)=>{let t=Zi(e);if(t){await t.run();return}console.error("hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code"),$t("hook",console.error),process.exit(1)},install:async(e)=>{process.exit(await Ht("install",e))},update:async(e)=>{process.exit(await xo(e))},uninstall:async(e)=>{process.exit(await Ht("uninstall",e))},rule:async(e)=>{process.exit(await bc(e))},status:async(e)=>{if(ae(T({label:"status"},e).errors))process.exit(1);xc()},statusline:async(e)=>{let t=T({label:"statusline",booleans:{claudeCode:["-cc","--claude-code"]}},e);if(t.errors.length===0&&t.flags.claudeCode){await Do();return}if(ae(t.errors),!t.flags.claudeCode)console.error("statusline requires --claude-code (-cc)");$t("statusline",console.error),process.exit(1)},doctor:async(e)=>{let t=no(e);if(!t)process.exit(1);let n=await Xa({json:t.json,skipUpdateCheck:t.skipUpdateCheck});process.exit(n)},logs:async(e)=>{process.exit(await bi(e))},gui:async(e)=>{process.exit(await Gc(e))},explain:async(e)=>{process.exit(await il(e))}};async function o1(){let e=process.argv.slice(2),t=T({label:"cc-safety-net",booleans:{version:["-V","--version"]},positionals:"list"},e);if(n1(e))return;let n=e[0],r=n?Jt(n):void 0;if(t.help&&r&&r.name!=="rule")$t(r.name),process.exit(0);if(!n||t.help&&!r)ao(),process.exit(0);if(t.flags.version)ll(),process.exit(0);if(r){await r1[r.name](e.slice(1));return}let o=Xi(n);if(o){await o.run();return}if(n==="--statusline"){await Do();return}console.error(n.startsWith("-")?`Unknown option: ${n}`:`Unknown command: ${n}`),console.error("Run 'cc-safety-net --help' for usage."),process.exit(1)}o1().catch((e)=>{console.error("CC Safety Net error:",e),process.exit(1)});
