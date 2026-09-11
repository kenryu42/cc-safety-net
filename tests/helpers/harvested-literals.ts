import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const HARVESTED_LITERALS: readonly string[] = JSON.parse(
  readFileSync(join(import.meta.dir, '..', 'fixtures', 'gate', 'harvested-literals.json'), 'utf-8'),
);

export const HARVESTED_LITERAL_COUNT = HARVESTED_LITERALS.length;
