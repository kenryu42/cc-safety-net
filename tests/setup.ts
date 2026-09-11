import { afterAll } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { removeCanonicalStub } from './helpers/fake-bin';

if (process.platform === 'darwin') {
  mkdirSync('/tmp/ccsn', { recursive: true });
  process.env.TMPDIR = '/tmp/ccsn';
}

const testHome = mkdtempSync(
  join(process.env.CC_SAFETY_NET_TEST_TMPDIR ?? tmpdir(), 'cc-safety-net-test-home-'),
);
process.env.CC_SAFETY_NET_AUDIT_HOME = join(testHome, 'audit-home');
process.env.CC_SAFETY_NET_HOME ??= join(testHome, 'safety-net-home');
process.env.CC_SAFETY_NET_NO_UPDATE_CHECK = '1';
process.env.NO_COLOR = '1';
delete process.env.CLAUDECODE;
delete process.env.CLAUDE_CODE_ENTRYPOINT;
delete process.env.npm_config_cache;
delete process.env.HERMES_HOME;
delete process.env.OPENCLAW_STATE_DIR;
delete process.env.OPENCLAW_CONFIG_PATH;
delete process.env.XDG_CONFIG_HOME;
delete process.env.XDG_CACHE_HOME;

afterAll(() => {
  removeCanonicalStub();
  rmSync(testHome, { recursive: true, force: true });
});
