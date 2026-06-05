import { describe, expect, test } from 'bun:test';
import { analyzeCommand } from '@/core/analyze';
import type { Config } from '@/types';

const failClosedConfig: Config = {
  version: 1,
  rules: [],
  failClosedReason:
    'missing lockfile /project/.cc-safety-net/rules/rule.lock; run `cc-safety-net rule sync`.',
};

const legacyFailClosedConfig: Config = {
  version: 1,
  rules: [],
  failClosedReason:
    'legacy rules config location is no longer used; ask the user to run `npx -y cc-safety-net rule migrate`.',
};

function expectAllowed(command: string): void {
  expect(analyzeCommand(command, { config: failClosedConfig })).toBeNull();
}

function expectBlocked(command: string): void {
  expect(analyzeCommand(command, { config: failClosedConfig })?.reason).toContain(
    'missing lockfile',
  );
}

function expectLegacyBlocked(command: string): void {
  expect(analyzeCommand(command, { config: legacyFailClosedConfig })?.reason).toContain(
    'ask the user to run `npx -y cc-safety-net rule migrate`',
  );
}

describe('fail-closed repair commands', () => {
  test.each([
    'cc-safety-net rule sync',
    'cc-safety-net rule sync --global',
    'cc-safety-net rule sync -g',
    'cc-safety-net rule --global sync',
    'cc-safety-net rule -g sync',
    'npx -y cc-safety-net rule sync',
    'npx --yes cc-safety-net rule sync',
    'npx -y cc-safety-net@latest rule sync',
    'npx --yes cc-safety-net@1.2.3 rule sync -g',
    'bunx cc-safety-net rule sync',
    'bunx cc-safety-net@latest rule sync -g',
    'pnpm dlx cc-safety-net rule sync',
    'pnpm dlx cc-safety-net@1.2.3 rule --global sync',
    'pnpx cc-safety-net rule sync',
    'yarn dlx cc-safety-net rule sync',
  ])('allows exact rule sync repair command: %s', (command) => {
    expectAllowed(command);
  });

  test.each([
    'cc-safety-net rule sync && rm -rf /',
    'cc-safety-net rule sync --check',
    'cc-safety-net rule update',
    'cc-safety-net rule migrate',
    'sh -c "cc-safety-net rule sync"',
    'sudo cc-safety-net rule sync',
    'npx -y other-package rule sync',
    'npx cc-safety-net rule sync',
    'npx --yes --package cc-safety-net cc-safety-net rule sync',
    'bunx other-package rule sync',
    'bunx cc-safety-net rule sync && rm -rf /',
    'pnpm cc-safety-net rule sync',
    'pnpm dlx other-package rule sync',
    'pnpm dlx cc-safety-net rule sync && rm -rf /',
    'yarn cc-safety-net rule sync',
    'yarn dlx other-package rule sync',
    'yarn dlx cc-safety-net rule sync && rm -rf /',
  ])('blocks repair command lookalike while fail-closed: %s', (command) => {
    expectBlocked(command);
  });

  test.each([
    'cc-safety-net rule migrate',
    'npx -y cc-safety-net rule migrate',
  ])('blocks migration command while legacy config is fail-closed: %s', (command) => {
    expectLegacyBlocked(command);
  });
});
