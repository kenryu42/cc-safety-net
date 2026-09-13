#!/usr/bin/env node
import { parseCommandArgs } from '@/cli/args';
import { findHookIntegrationByFlag, findLegacyTopLevelHookIntegration } from './hook-integrations';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const commandName = args[0];

  const globalScan = parseCommandArgs(
    { label: 'cc-safety-net', booleans: { version: ['-V', '--version'] }, positionals: 'list' },
    args,
  );

  if (!globalScan.help && !globalScan.flags.version) {
    if (commandName?.toLowerCase() === 'hook') {
      const integration = findHookIntegrationByFlag(args.slice(1));
      if (integration) {
        await integration.run();
        return;
      }
    }
    const legacyIntegration = findLegacyTopLevelHookIntegration(commandName);
    if (legacyIntegration) {
      await legacyIntegration.run();
      return;
    }
  }

  const cli = await import('@/cli/main');
  await cli.runCli(args);
}

main().catch((error: unknown) => {
  console.error('CC Safety Net error:', error);
  process.exit(1);
});
