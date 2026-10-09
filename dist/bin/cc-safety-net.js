#!/usr/bin/env node
'use strict';
const { enableCompileCache } = require('node:module');
if (enableCompileCache !== undefined) {
  const { join } = require('node:path');
  enableCompileCache(
    join(
      process.env.CC_SAFETY_NET_HOME || join(require('node:os').homedir(), '.cc-safety-net'),
      'compile-cache',
    ),
  );
}
require('./hook.js');
