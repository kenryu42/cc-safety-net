import"../chunks/index-20jqjjx0.js";import{_t}from"../chunks/index-xs8mpj4d.js";import{se}from"../chunks/index-znx5ctps.js";import"../chunks/index-mtbcg915.js";import"../chunks/index-a7f08f86.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${se.slice(se.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){_t(e),t(e)}export{m as default};
