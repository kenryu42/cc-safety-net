#!/usr/bin/env node
import { findHookIntegrationByFlag, findLegacyTopLevelHookIntegration } from './hook-integrations';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const commandName = args[0];

  if (commandName === 'hook') {
    const integration = findHookIntegrationByFlag(args.slice(1));
    if (integration) {
      await integration.run();
      return;
    }
    console.error(
      'hook requires exactly one integration flag. Try: cc-safety-net hook --kimi-code',
    );
    process.exit(1);
  }

  const legacyIntegration = findLegacyTopLevelHookIntegration(commandName);
  if (legacyIntegration) {
    await legacyIntegration.run();
    return;
  }

  console.error(
    `cc-safety-net: only the hook command is available in this build (got ${commandName ?? 'no command'})`,
  );
  process.exit(1);
}

main().catch((error: unknown) => {
  console.error('CC Safety Net error:', error);
  process.exit(1);
});
