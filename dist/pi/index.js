import"../chunks/index-zygft7h5.js";import{kt}from"../chunks/index-gvq1a5p3.js";import{le}from"../chunks/index-e4b0v62z.js";import"../chunks/index-30w1rck7.js";import"../chunks/index-ks7wvc41.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${le.slice(le.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){kt(e),t(e)}export{m as default};
