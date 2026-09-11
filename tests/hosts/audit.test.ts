import { afterAll, afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { IntegrationDenial } from '@/core/denial';
import { createProcessEnvironment, type Environment } from '@/core/environment';
import { evaluateGuard as portedEvaluateGuard } from '@/gate/pipeline';
import {
  projectGuardAudit as portedProjectGuardAudit,
  writeIntegrationDenialAudit as portedWriteDenialAudit,
  writeGuardAudit as portedWriteGuardAudit,
} from '@/hosts/audit';
import { withEnv } from '../helpers';
import { bashCall, createGateTree } from '../helpers/gate-differential';
import { readAuditEntries } from '../helpers/hook-capture';
import { auditDirnameFolds, normalize, rootFolds } from '../helpers/temp-home';

const tree = createGateTree('next-hosts-audit-');

const FOLDS = [...rootFolds(tree.root), ...auditDirnameFolds(tree.root, '<root>')];

afterAll(() => {
  tree.remove();
});

const environment = createProcessEnvironment();
const SESSION = 'hosts-audit-1';
const FAILURE = { stage: 'command-analysis', errorCode: 'unexpected-error' } as const;
const DENIAL: IntegrationDenial = {
  reason: 'Blocked by a preflight check.',
  ruleId: 'rm.recursive-force-root',
  intent: 'hard_stop',
  command: 'rm -rf /',
  segment: 'rm -rf /',
  toolName: 'Bash',
};

function evaluatedRow(command: string, failing = false) {
  const call = bashCall(command, tree.workspace);
  const dependencies = failing
    ? {
        analyzeCommand: () => {
          throw new Error('injected analyzer failure');
        },
      }
    : {};
  return {
    command,
    call,
    failure: failing ? FAILURE : undefined,
    ported: evaluationOf(() => portedEvaluateGuard(call, { environment, dependencies })),
  };
}

const DENIED = evaluatedRow('git push --force origin main');
const ROWS = [
  evaluatedRow('git status'),
  DENIED,
  evaluatedRow('cat ~/.ssh/id_rsa'),
  evaluatedRow('echo ok', true),
];

test('the rows carry one allow and three denials on both sides', () => {
  const kinds = ['allow', 'deny', 'deny', 'deny'] as const;
  expect(ROWS.map((row) => row.ported.decision.kind)).toStrictEqual([...kinds]);
});

const DESCRIPTORS: Readonly<Record<string, Record<string, unknown>>> = {
  'git status': {
    decision: 'allow',
    command: 'git status',
    segment: 'git status',
    reason: 'allowed',
    cwd: tree.workspace,
    toolName: 'Bash',
    level: 'standard',
  },
  'git push --force origin main': {
    decision: 'deny',
    command: 'git push --force origin main',
    segment: 'git push --force origin main',
    reason:
      'git push --force destroys remote history. Use --force-with-lease for safer force push.',
    cwd: tree.workspace,
    toolName: 'Bash',
    level: 'standard',
    ruleId: 'git.push-force',
    intent: 'use_alternative',
  },
  'cat ~/.ssh/id_rsa': {
    decision: 'deny',
    command: 'cat ~/.ssh/id_rsa',
    segment: '~/.ssh/id_rsa',
    reason: 'Access to a sensitive path is not allowed.',
    cwd: tree.workspace,
    toolName: 'Bash',
    level: 'standard',
    ruleId: 'secret.home.ssh',
    intent: 'hard_stop',
  },
  'echo ok': {
    decision: 'deny',
    command: 'echo ok',
    segment: 'echo ok',
    reason:
      'CC Safety Net failed closed because command analysis failed unexpectedly. This is not caused by your command. Report it to the user.',
    cwd: tree.workspace,
    toolName: 'Bash',
    intent: 'stop_and_explain',
  },
};

describe('an evaluation projected as an audit descriptor', () => {
  for (const row of ROWS) {
    for (const auditAllowed of [true, false]) {
      for (const includeCommand of [true, false]) {
        for (const failure of [undefined, FAILURE]) {
          test(`${row.command} (allowed ${auditAllowed}, command ${includeCommand}, failure ${failure !== undefined})`, () => {
            const projected = portedProjectGuardAudit(
              row.call,
              row.ported,
              auditAllowed,
              includeCommand,
              failure,
            );
            const descriptor = DESCRIPTORS[row.command];

            if (descriptor?.decision === 'allow') {
              expect(projected).toEqual((auditAllowed ? descriptor : undefined) as never);
              return;
            }
            expect(projected).toEqual({
              ...descriptor,
              failureStage: failure?.stage,
              errorCode: failure?.errorCode,
            } as never);
          });
        }
      }
    }
  }
});

const descriptorOf = (row: (typeof ROWS)[number]) =>
  portedProjectGuardAudit(row.call, row.ported, true, true, row.failure);

const refuseSession = () => {
  throw new Error('session lookup failed');
};

const stamped = { sessionId: SESSION, v: 'dev', agent: 'hosts-test', shape: 'claude-code' };

const WRITE_ROWS: readonly {
  name: string;
  run: (host: Environment) => void;
  entries: Record<string, unknown>[];
  directory?: string;
}[] = [
  ...ROWS.map((row) => ({
    name: `guard audit for ${row.command}`,
    run: (host: Environment) =>
      portedWriteGuardAudit(host, descriptorOf(row), () => SESSION, {
        agent: 'hosts-test',
        shape: 'claude-code',
      }),
    entries: [
      {
        ...stamped,
        ...DESCRIPTORS[row.command],
        ...(row.failure
          ? { failureStage: row.failure.stage, errorCode: row.failure.errorCode }
          : {}),
      },
    ],
    directory: '<root>-workspace',
  })),
  {
    name: 'preflight denial without a cwd',
    run: (host: Environment) =>
      portedWriteDenialAudit(host, DENIAL, () => SESSION, {
        agent: 'hosts-test',
        toolName: 'Bash',
        cwd: null,
      }),
    entries: [
      {
        sessionId: SESSION,
        v: 'dev',
        agent: 'hosts-test',
        decision: 'deny',
        command: DENIAL.command,
        segment: DENIAL.segment,
        reason: DENIAL.reason,
        ruleId: DENIAL.ruleId,
        intent: DENIAL.intent,
        toolName: 'Bash',
        cwd: null,
      },
    ],
    directory: 'no-cwd',
  },
  {
    name: 'preflight denial under a shape and a cwd',
    run: (host: Environment) =>
      portedWriteDenialAudit(host, { reason: DENIAL.reason }, () => SESSION, {
        agent: 'codex',
        shape: 'claude-code',
        cwd: tree.workspace,
      }),
    entries: [
      {
        sessionId: SESSION,
        v: 'dev',
        agent: 'codex',
        shape: 'claude-code',
        decision: 'deny',
        command: '',
        segment: '',
        reason: DENIAL.reason,
        cwd: tree.workspace,
      },
    ],
    directory: '<root>-workspace',
  },
  {
    name: 'a session lookup that throws',
    run: (host: Environment) => {
      portedWriteGuardAudit(host, descriptorOf(DENIED), refuseSession, { agent: 'hosts-test' });
      portedWriteDenialAudit(host, DENIAL, refuseSession, { agent: 'hosts-test', cwd: null });
    },
    entries: [],
  },
  {
    name: 'a blank or missing session id',
    run: (host: Environment) => {
      portedWriteGuardAudit(host, descriptorOf(DENIED), () => '   ', { agent: 'hosts-test' });
      portedWriteDenialAudit(host, DENIAL, () => undefined, { agent: 'hosts-test', cwd: null });
    },
    entries: [],
  },
];

describe('a descriptor written to the audit log', () => {
  let auditHome: string;

  beforeEach(() => {
    auditHome = mkdtempSync(
      join(process.env.CC_SAFETY_NET_TEST_TMPDIR ?? tmpdir(), 'next-hosts-audit-home-'),
    );
  });

  afterEach(() => {
    rmSync(auditHome, { recursive: true, force: true });
  });

  for (const row of WRITE_ROWS) {
    test(row.name, () => {
      const written = withEnv({ CC_SAFETY_NET_AUDIT_HOME: auditHome }, () => {
        row.run(createProcessEnvironment());
        return readAuditEntries(auditHome);
      });
      const day = new Date().toISOString().slice(0, 10);

      expect(written.map((line) => line.entry)).toEqual(row.entries);
      expect(written.map((line) => normalize(line.file, FOLDS))).toEqual(
        row.entries.map(() => join(`${row.directory}`, day.slice(0, 7), `${day}-${SESSION}.jsonl`)),
      );
    });
  }
});

function evaluationOf<E>(run: () => E): E {
  try {
    return run();
  } catch (error) {
    const evaluation = (error as { evaluation?: E }).evaluation;
    if (evaluation) return evaluation;
    throw error;
  }
}
