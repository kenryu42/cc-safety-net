import"../chunks/index-zymgyc5s.js";import{Tt}from"../chunks/index-y6st2q2n.js";import{le}from"../chunks/index-5pj5qdma.js";import"../chunks/index-d64dnara.js";import"../chunks/index-fdxc3nnj.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${le.slice(le.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){Tt(e),t(e)}export{m as default};
