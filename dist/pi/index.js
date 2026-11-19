import"../chunks/index-8bgbz4n0.js";import{It}from"../chunks/index-0es15fmm.js";import{le}from"../chunks/index-5pj5qdma.js";import"../chunks/index-vg8121k3.js";import"../chunks/index-nwz5r27j.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${le.slice(le.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){It(e),t(e)}export{m as default};
