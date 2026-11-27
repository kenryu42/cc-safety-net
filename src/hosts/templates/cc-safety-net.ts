import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const CC_SAFETY_NET_SKILL = readFileSync(
  join(import.meta.dir, '..', '..', '..', 'skills', 'cc-safety-net', 'SKILL.md'),
  'utf-8',
).replace(/\r\n/g, '\n');

export const CC_SAFETY_NET_TEMPLATE = `\n${CC_SAFETY_NET_SKILL.slice(CC_SAFETY_NET_SKILL.indexOf('# CC Safety Net'))}`;
