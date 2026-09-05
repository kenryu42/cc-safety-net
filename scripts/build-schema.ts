#!/usr/bin/env bun
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as z from 'zod';
import { getRulesConfigSchema as portedRulesConfigSchema } from '../next/core/policy/schema';
import { getRulesConfigSchema as shippedRulesConfigSchema } from '../src/policy/schema';
import { resolveLayout, SHIPPED_LAYOUT } from './build-layout';

const SCHEMA_OUTPUT_PATH = 'assets/cc-safety-net.schema.json';

/** @internal */
export async function writeRulesConfigJsonSchema(schema: z.core.$ZodType, outputPath: string) {
  const jsonSchema = z.toJSONSchema(schema, {
    io: 'input',
    target: 'draft-7',
  }) as Record<string, unknown>;
  setUniqueItems(jsonSchema, 'transparent_wrappers');

  const finalSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://raw.githubusercontent.com/kenryu42/cc-safety-net/main/assets/cc-safety-net.schema.json',
    title: 'CC Safety Net Configuration',
    description: 'Configuration file for cc-safety-net rulebook sources and local policy',
    ...jsonSchema,
  };

  await Bun.write(outputPath, `${JSON.stringify(finalSchema, null, 2)}\n`);

  // Format with Biome to ensure consistent formatting with the linter
  return Bun.spawnSync(['bunx', 'biome', 'format', '--write', outputPath]);
}

async function main(): Promise<void> {
  const layout = resolveLayout(process.argv);
  console.log('Generating JSON Schema...');

  // The committed asset is generated from the shipped schema until cutover; every other
  // layout is checked against it.
  if (layout === SHIPPED_LAYOUT) {
    const result = await writeRulesConfigJsonSchema(shippedRulesConfigSchema(), SCHEMA_OUTPUT_PATH);
    if (result.exitCode !== 0) {
      console.error('Failed to format schema:', result.stderr.toString());
      process.exit(1);
    }
    console.log(`✓ JSON Schema generated: ${SCHEMA_OUTPUT_PATH}`);
    return;
  }

  const directory = mkdtempSync(join(tmpdir(), 'cc-safety-net-schema-'));
  const outputPath = join(directory, 'cc-safety-net.schema.json');
  const result = await writeRulesConfigJsonSchema(portedRulesConfigSchema(), outputPath);
  if (result.exitCode !== 0) {
    console.error('Failed to format schema:', result.stderr.toString());
    process.exit(1);
  }
  const generated = readFileSync(outputPath, 'utf8');
  rmSync(directory, { recursive: true, force: true });
  if (generated !== readFileSync(SCHEMA_OUTPUT_PATH, 'utf8')) {
    console.error('Ported schema differs from assets/cc-safety-net.schema.json');
    process.exit(1);
  }
  console.log(`✓ JSON Schema matches ${SCHEMA_OUTPUT_PATH}`);
}

function setUniqueItems(schema: Record<string, unknown>, propertyName: string): void {
  if (!schema.properties || typeof schema.properties !== 'object') return;

  const property = (schema.properties as Record<string, unknown>)[propertyName];
  if (!property || typeof property !== 'object') return;

  (property as Record<string, unknown>).uniqueItems = true;
}

if (import.meta.main) await main();
