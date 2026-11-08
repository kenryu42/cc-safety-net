import"../chunks/index-wkz4evtz.js";import{kt}from"../chunks/index-4qeck9t0.js";import{le}from"../chunks/index-e4b0v62z.js";import"../chunks/index-0cbcwwc9.js";import"../chunks/index-a5bgdg9f.js";var o="cc-safety-net",r="Operate CC Safety Net: explain blocks, rules, integrations, diagnostics",s="Help me with CC Safety Net.";function t(e){e.registerCommand(o,{description:r,handler:async(n,i)=>{e.sendUserMessage(a(n),i.isIdle()?void 0:{deliverAs:"followUp"})}})}function a(e){return`${le.slice(le.indexOf("# CC Safety Net")).trimEnd()}

## User request

${e.trim()||s}`}function m(e){kt(e),t(e)}export{m as default};
