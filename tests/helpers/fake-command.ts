import { appendFileSync, cpSync, readFileSync } from 'node:fs';
import type { FakeScriptEntry } from './fake-bin';

const [name = '', ...args] = process.argv.slice(2);

const logged = process.platform === 'win32' ? args.join(' ').replaceAll('"', '') : args.join(' ');

appendFileSync(process.env.CC_SAFETY_NET_FAKE_LOG ?? '', `${name} ${logged}\t${process.cwd()}\n`);

const script = JSON.parse(
  readFileSync(process.env.CC_SAFETY_NET_FAKE_SCRIPT ?? '', 'utf-8'),
) as FakeScriptEntry[];

const match = script.find(
  (entry) =>
    entry.command === name && (entry.args ?? []).every((arg, index) => args[index] === arg),
);

if (!match) {
  process.stderr.write(`fake ${name}: unscripted ${args.join(' ')}\n`);
  process.exit(1);
}

if (match.seedDir) {
  cpSync(match.seedDir, match.seedInto ?? args[args.length - 1] ?? '.', { recursive: true });
}
if (match.snapshotTo) cpSync(process.cwd(), match.snapshotTo, { recursive: true });
if (match.stdout) process.stdout.write(match.stdout);
if (match.stderr) process.stderr.write(match.stderr);
if (match.delayMs) await new Promise((resolve) => setTimeout(resolve, match.delayMs));
process.exit(match.exit ?? 0);
