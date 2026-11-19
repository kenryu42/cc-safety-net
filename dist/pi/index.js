import"../chunks/index-0k4mdsdm.js";import{Pt}from"../chunks/index-x4py8bwb.js";import{le}from"../chunks/index-5pj5qdma.js";import"../chunks/index-b4r0brkc.js";import"../chunks/index-9kawkz8z.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${le.slice(le.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){Pt(e),t(e)}export{m as default};
