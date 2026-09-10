/**
 * The CLI behind the bin's one dynamic import. The bin ships as a CommonJS bundle so the hook
 * path skips Node's ES module loader; this ESM entry shares the runtime chunks with the other
 * published entries and is what that bundle loads for any verb but `hook`.
 */
export { runCli } from '@/cli/main';
