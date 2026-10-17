import"../chunks/index-z14g58a6.js";import{ht}from"../chunks/index-3cvh9qs5.js";import{oe}from"../chunks/index-wkjncmhg.js";import"../chunks/index-amr728xf.js";import"../chunks/index-p6xns5ed.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${oe.slice(oe.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){ht(e),t(e)}export{m as default};
