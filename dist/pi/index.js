import"../chunks/index-wxgrf1hd.js";import{_t}from"../chunks/index-rgvabt91.js";import{se}from"../chunks/index-znx5ctps.js";import"../chunks/index-5p0dys6a.js";import"../chunks/index-qj90th93.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${se.slice(se.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){_t(e),t(e)}export{m as default};
