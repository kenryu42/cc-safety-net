import type { AmpRunner } from '@/hosts/amp/run';
import { snapshotTree, type TreeEntry, type TreeSpec, writeTree } from './fixture-tree';

export const AMP_CLONE_REF = 'amp://user-plugins';

const SUCCESS = { status: 0, stdout: '', stderr: '' };

const repositoriesJson = (viewerCanWrite: boolean) =>
  JSON.stringify([{ scope: 'user', exists: true, viewerCanWrite, cloneRef: AMP_CLONE_REF }]);

export type AmpScript = {
  repositories?:
    | { status: number | null; stdout?: string; stderr?: string; errorCode?: string }
    | 'none-writable';
  seed?: TreeSpec;
  porcelain?: string;
  failing?: readonly string[];
};

export function createScriptedAmpRunner(script: AmpScript = {}) {
  const calls: { command: string[]; cwd?: string }[] = [];
  const snapshots: Record<string, TreeEntry[]> = {};
  const run: AmpRunner = (command, cwd) => {
    const line = command.join(' ');
    calls.push({ command: [...command], cwd });
    if (line === 'amp plugins repositories --json') return repositoriesResult(script.repositories);
    if (script.failing?.includes(line))
      return { status: 1, stdout: '', stderr: 'scripted failure' };
    if (line.startsWith('amp clone ')) {
      writeTree(command[command.length - 1] ?? '', script.seed ?? {});
      return SUCCESS;
    }
    if (line === 'git status --porcelain')
      return { status: 0, stdout: script.porcelain ?? ' M cc-safety-net/index.ts\n', stderr: '' };
    if (cwd && (line.startsWith('git add ') || line.startsWith('git rm ')))
      snapshots[line] = snapshotTree(cwd);
    return SUCCESS;
  };
  return { run, calls, snapshots };
}

function repositoriesResult(repositories: AmpScript['repositories']) {
  if (repositories === undefined) return { status: 0, stdout: repositoriesJson(true), stderr: '' };
  if (repositories === 'none-writable')
    return { status: 0, stdout: repositoriesJson(false), stderr: '' };
  return {
    status: repositories.status,
    stdout: repositories.stdout ?? '',
    stderr: repositories.stderr ?? '',
    errorCode: repositories.errorCode,
  };
}
