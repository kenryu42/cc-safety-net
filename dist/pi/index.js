import"../chunks/index-2eppn4ys.js";import{It}from"../chunks/index-anzamj3y.js";import{le}from"../chunks/index-5pj5qdma.js";import"../chunks/index-awgh4e1z.js";import"../chunks/index-65wrbg1t.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${le.slice(le.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){It(e),t(e)}export{m as default};
