import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const skill = readFileSync(
  join(import.meta.dir, '..', '..', '..', 'skills', 'cc-safety-net', 'SKILL.md'),
  'utf-8',
).replace(/\r\n/g, '\n');

export const CC_SAFETY_NET_TEMPLATE = `\n${skill.slice(skill.indexOf('# CC Safety Net'))}`;
