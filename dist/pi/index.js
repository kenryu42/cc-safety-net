import"../chunks/index-2q0vv0q1.js";import{kt}from"../chunks/index-nfv4gh1d.js";import{le}from"../chunks/index-e4b0v62z.js";import"../chunks/index-cs9x1dct.js";import"../chunks/index-dq1359b6.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${le.slice(le.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){kt(e),t(e)}export{m as default};
