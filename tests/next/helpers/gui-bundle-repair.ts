/**
 * Importing the GUI's `assets` module runs `Bun.build` over `next/gui/frontend/main.ts` at module
 * load, exactly as the shipped module does. Under the bun this project runs on, that build leaves a
 * stale directory listing behind for the two directories it only walked through on its way to the
 * three modules it bundles — `next/core` and `next/gui` — so every later `@next/core/*` or
 * `@next/gui/*` import of a file the bundle did not itself load fails to resolve for the rest of the
 * process, and takes every test file loaded after this one with it. Reading one module from each
 * directory by path restores both listings.
 *
 * Reproduced on bun 1.3.11 with the two-file run
 * `bun test tests/next/gui/page.test.ts tests/next/core/policy/store.test.ts` (either file order):
 * without the calls below it fails with
 * `error: Cannot find module '@next/core/environment' from '<repo>/tests/next/core/policy/store.test.ts'`.
 * Phase 10 moved the freeze inside the build, but the two test files that build the ported layout
 * still import the assets module in-process through the layout's loader, so the helper stays until
 * the cutover leaves the frozen page as the only importer.
 *
 * Call this from whatever helper pulls in `@next/gui/assets`, after the import.
 */
export async function repairBundlerDirectoryCache(): Promise<void> {
  await Promise.all([
    import('../../../next/core/environment'),
    import('../../../next/gui/activity'),
  ]);
}
