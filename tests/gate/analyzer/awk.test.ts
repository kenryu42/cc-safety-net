import { describe, expect, test } from 'bun:test';
import type { DestructiveCommandRuleMatch } from '@/core/rules/types';
import type { AwkArgvMetadata } from '@/gate/analyzer/awk';
import {
  AWK_EXECUTABLE_SOURCE_SELECTORS,
  analyzeAwkSystemCallMatch,
  extractAwkExecutableSources,
  extractAwkSystemCommands,
  parseAwkArgv,
  REASON_AWK_SYSTEM_DYNAMIC,
} from '@/gate/analyzer/awk';

function nestedAnalyzer(command: string) {
  return command.includes('rm -rf')
    ? { id: 'awk.system-dynamic', reason: `nested ${command}`, intent: 'manual_only' as const }
    : null;
}

const DYNAMIC_MATCH: DestructiveCommandRuleMatch = {
  id: 'awk.system-dynamic',
  reason: REASON_AWK_SYSTEM_DYNAMIC,
  intent: 'stop_and_explain',
};

describe('awk argv scanning', () => {
  test('the selector table names each executable-source option and how it carries its value', () => {
    expect(
      AWK_EXECUTABLE_SOURCE_SELECTORS.map((entry) => [entry.selector, entry.kind, entry.valueForm]),
    ).toStrictEqual([
      ['-e', 'inline-code', 'attached-or-separate'],
      ['--source', 'inline-code', 'equals-or-separate'],
      ['-f', 'program-file', 'attached-or-separate'],
      ['--file', 'program-file', 'equals-or-separate'],
    ]);
  });

  test('parseAwkArgv reports the executable sources and whether options are still open', () => {
    const rows: readonly { readonly argv: readonly string[]; readonly parsed: AwkArgvMetadata }[] =
      [
        { argv: ['awk'], parsed: { sources: [], optionsOpen: true } },
        {
          argv: ['awk', '{ print }', 'file'],
          parsed: {
            sources: [{ tokenIndex: 1, kind: 'main-program', value: '{ print }' }],
            optionsOpen: false,
          },
        },
        {
          argv: ['awk', '-f', 'prog.awk', 'file'],
          parsed: {
            sources: [{ tokenIndex: 2, kind: 'program-file', value: 'prog.awk' }],
            optionsOpen: false,
          },
        },
        {
          argv: ['awk', '-fprog.awk', 'file'],
          parsed: {
            sources: [{ tokenIndex: 1, kind: 'program-file', value: 'prog.awk' }],
            optionsOpen: false,
          },
        },
        {
          argv: ['awk', '--file=prog.awk'],
          parsed: {
            sources: [{ tokenIndex: 1, kind: 'program-file', value: 'prog.awk' }],
            optionsOpen: true,
          },
        },
        {
          argv: ['awk', '--source', 'BEGIN{system("id")}'],
          parsed: {
            sources: [{ tokenIndex: 2, kind: 'inline-code', value: 'BEGIN{system("id")}' }],
            optionsOpen: true,
          },
        },
        {
          argv: ['awk', '-eBEGIN{system("id")}'],
          parsed: {
            sources: [{ tokenIndex: 1, kind: 'inline-code', value: 'BEGIN{system("id")}' }],
            optionsOpen: true,
          },
        },
        {
          argv: ['gawk', '-e', 'BEGIN{system("a")}', '-e', 'BEGIN{system("b")}'],
          parsed: {
            sources: [
              { tokenIndex: 2, kind: 'inline-code', value: 'BEGIN{system("a")}' },
              { tokenIndex: 4, kind: 'inline-code', value: 'BEGIN{system("b")}' },
            ],
            optionsOpen: true,
          },
        },
        {
          argv: ['awk', '-F', ':', '{print $1}'],
          parsed: {
            sources: [{ tokenIndex: 3, kind: 'main-program', value: '{print $1}' }],
            optionsOpen: false,
          },
        },
        {
          argv: ['awk', '-v', '{print}'],
          parsed: { sources: [], optionsOpen: true },
        },
        {
          argv: ['awk', '-W', 'interactive', '{print}'],
          parsed: {
            sources: [{ tokenIndex: 2, kind: 'main-program', value: 'interactive' }],
            optionsOpen: false,
          },
        },
        {
          argv: ['awk', '--', '{print}'],
          parsed: {
            sources: [{ tokenIndex: 2, kind: 'main-program', value: '{print}' }],
            optionsOpen: false,
          },
        },
        {
          argv: ['awk', '-'],
          parsed: {
            sources: [{ tokenIndex: 1, kind: 'main-program', value: '-' }],
            optionsOpen: false,
          },
        },
        {
          argv: ['awk', '-f'],
          parsed: { sources: [], optionsOpen: false },
        },
        { argv: ['awk', '-e'], parsed: { sources: [], optionsOpen: false } },
      ];
    for (const row of rows) {
      const parsed = parseAwkArgv(row.argv);
      expect(parsed, row.argv.join(' ')).toStrictEqual(row.parsed);
      expect(extractAwkExecutableSources(row.argv), row.argv.join(' ')).toStrictEqual(
        row.parsed.sources,
      );
    }
  });
});

describe('awk program scanning', () => {
  test('extractAwkSystemCommands recovers literal system() commands and flags the rest', () => {
    const rows: readonly {
      readonly code: string;
      readonly extracted: { dynamic: boolean; commands: string[] } | null;
    }[] = [
      { code: '{ print }', extracted: null },
      { code: 'BEGIN { mysystem("id") }', extracted: null },
      { code: '# system("rm -rf /")\n{ print }', extracted: null },
      { code: '{ print "system(\\"rm\\")" }', extracted: null },
      { code: 'BEGIN { system("echo ok") }', extracted: { dynamic: false, commands: ['echo ok'] } },
      {
        code: 'BEGIN { system ( "spaced" ) }',
        extracted: { dynamic: false, commands: ['spaced'] },
      },
      {
        code: '{ system("echo hi"); system("echo there") }',
        extracted: { dynamic: false, commands: ['echo hi', 'echo there'] },
      },
      {
        code: 'BEGIN { system("esc\\"aped") }',
        extracted: { dynamic: false, commands: ['esc"aped'] },
      },
      {
        code: 'BEGIN { system("rm\\x20-rf\\040/") }',
        extracted: { dynamic: false, commands: ['rm -rf /'] },
      },
      { code: 'BEGIN { system($0) }', extracted: { dynamic: true, commands: [] } },
      { code: 'BEGIN { system() }', extracted: { dynamic: true, commands: [] } },
      { code: 'BEGIN { system("unterminated }', extracted: { dynamic: true, commands: [] } },
      { code: 'BEGIN { system("rm " $1) }', extracted: { dynamic: true, commands: [] } },
      { code: 'BEGIN { system("a" "b") }', extracted: { dynamic: true, commands: [] } },
    ];
    for (const row of rows) {
      expect(extractAwkSystemCommands(row.code), row.code).toStrictEqual(row.extracted);
    }
  });

  test('a program scan charges its length once against the scan-work counter', () => {
    const work = { units: 0 };
    expect(extractAwkSystemCommands('{ print }', work)).toBeNull();
    expect(work.units).toBe('{ print }'.length);
  });

  test('analyzeAwkSystemCallMatch hands literal commands to the nested analyzer and fails closed', () => {
    const rows: readonly {
      readonly argv: readonly string[];
      readonly match: DestructiveCommandRuleMatch | null;
    }[] = [
      { argv: ['awk'], match: null },
      { argv: ['awk', '{ print }'], match: null },
      { argv: ['awk', 'BEGIN { subsystem("rm -rf /") }'], match: null },
      { argv: ['awk', 'BEGIN { system("echo ok") }'], match: null },
      { argv: ['awk', '-f', 'prog.awk'], match: null },
      { argv: ['awk', '{ "date" | getline d }'], match: null },
      {
        argv: ['awk', 'BEGIN { system("rm -rf /") }'],
        match: { id: 'awk.system-dynamic', reason: 'nested rm -rf /', intent: 'manual_only' },
      },
      {
        argv: ['awk', '{ print $0 | "sh -c \'rm -rf /\'" }'],
        match: {
          id: 'awk.system-dynamic',
          reason: "nested sh -c 'rm -rf /'",
          intent: 'manual_only',
        },
      },
      { argv: ['awk', 'BEGIN { system($0) }'], match: DYNAMIC_MATCH },
      { argv: ['awk', 'BEGIN { system("unterminated }'], match: DYNAMIC_MATCH },
      { argv: ['awk', 'BEGIN { system("rm " $1) }'], match: DYNAMIC_MATCH },
      { argv: ['awk', 'BEGIN { system("echo {}") }'], match: DYNAMIC_MATCH },
      { argv: ['awk', 'BEGIN { system("echo $HOME") }'], match: DYNAMIC_MATCH },
      { argv: ['awk', '{ cmd | getline line }'], match: DYNAMIC_MATCH },
    ];
    for (const row of rows) {
      expect(analyzeAwkSystemCallMatch(row.argv, nestedAnalyzer), row.argv.join(' ')).toStrictEqual(
        row.match,
      );
    }
  });

  test('analyzeAwkSystemCallMatch works without a scan-work counter', () => {
    expect(analyzeAwkSystemCallMatch(['awk', 'BEGIN { system($0) }'], nestedAnalyzer)?.id).toBe(
      'awk.system-dynamic',
    );
  });
});
