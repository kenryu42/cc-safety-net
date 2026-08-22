import { statSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
import { findDotGitInAncestors, resolveDotGitFileTargets } from '@/analyzer/git/worktree';
import {
  createPathCanonicalizationContext,
  type PathCanonicalizationContext,
} from '@/analyzer/path-canonicalization';
import { stripWrappersForPathScan } from '@/analyzer/wrapper-prelude';
import {
  expandTrackedShellVariables,
  extractMvOperandPaths,
  findProtectedPathMutationInCommand,
  isAssignmentOnlySegment,
  normalizeProtectedPathCandidate,
  type ProtectedPathShellState,
} from '@/guards/protected-path-scanner';
import { getCommandSyntaxFact } from '@/guards/semantic-facts';
import type { ProtectedGitMetadata } from '@/ir/analysis';
import { createProcessEnvironment } from '@/ir/environment';
import type { SemanticFacts } from '@/ir/semantic-facts';
import { getBasename } from '@/parser/shell';
import { isReadOnlyTool } from '@/parser/tool-input';

export const REASON_GIT_METADATA_PROTECTION =
  'Git metadata and hooks are protected. Ask the user before modifying them.';

type GitMetadataTarget = Readonly<{ target: string }>;

export function findGitMetadataMutationTargetInSemanticFacts(
  facts: SemanticFacts,
  metadata = resolveProtectedGitMetadata([
    facts.invocation.context.executionCwd,
    facts.invocation.context.configCwd,
  ]),
): GitMetadataTarget | null {
  const context = createPathCanonicalizationContext(createProcessEnvironment());
  const cwd = facts.invocation.context.executionCwd;
  if (!metadata) return null;

  if (
    facts.invocation.route.kind === 'patch' ||
    facts.invocation.route.kind === 'path' ||
    facts.invocation.route.kind === 'unknown'
  ) {
    if (isReadOnlyTool(facts.invocation.toolName)) return null;
    const target = facts.paths.find((path) =>
      isProtectedGitWriteTarget(path, cwd, metadata, context),
    );
    return target ? { target } : null;
  }
  if (facts.invocation.route.kind !== 'command') return null;

  const command = getCommandSyntaxFact(facts, 'input-candidate');
  if (!command) return null;
  const target = findProtectedPathMutationInCommand(command.shell, cwd, context, {
    findSegmentTarget: (segment, state) =>
      findGitMetadataMoveTarget(segment, state, metadata, context),
    isRedirectionTarget: (target, state) =>
      isProtectedGitRedirectionTarget(target, state.cwd, metadata, context),
    findMalformedTarget: () => null,
    normalizeCwd: normalizeProtectedPathCandidate,
  });
  return target ? { target } : null;
}

export function resolveProtectedGitMetadata(
  cwds: readonly (string | undefined)[],
  context = createPathCanonicalizationContext(createProcessEnvironment()),
): ProtectedGitMetadata | null {
  const anchors = [
    ...new Map(
      cwds
        .filter((cwd): cwd is string => typeof cwd === 'string' && cwd !== '')
        .flatMap((cwd) => {
          const dotGitPath = findDotGitInAncestors(
            normalizeProtectedPathCandidate(cwd, cwd, context),
          );
          return dotGitPath ? [[comparePath(dotGitPath), { dotGitPath, cwd }] as const] : [];
        }),
    ).values(),
  ].flatMap((anchor) => resolveGitMetadataAnchor(anchor.dotGitPath, anchor.cwd, context));
  if (anchors.length === 0) return null;
  return Object.freeze({
    entries: Object.freeze([...new Set(anchors.map((anchor) => anchor.entry))]),
    markerFiles: Object.freeze([
      ...new Set(anchors.flatMap((anchor) => (anchor.markerFile ? [anchor.markerFile] : []))),
    ]),
    directories: Object.freeze([...new Set(anchors.flatMap((anchor) => anchor.directories))]),
    hooksDirectories: Object.freeze([
      ...new Set(anchors.flatMap((anchor) => anchor.hooksDirectories)),
    ]),
  });
}

type GitMetadataAnchor = Readonly<{
  entry: string;
  markerFile: string | null;
  directories: readonly string[];
  hooksDirectories: readonly string[];
}>;

function resolveGitMetadataAnchor(
  dotGitPath: string,
  cwd: string,
  context: PathCanonicalizationContext,
): GitMetadataAnchor[] {
  try {
    const entry = normalizeProtectedPathCandidate(dotGitPath, cwd, context);
    const stat = statSync(dotGitPath);
    const markerFile = stat.isFile() ? entry : null;
    const fileTargets = stat.isFile() ? resolveDotGitFileTargets(dotGitPath) : null;
    const canonicalDirectories = (
      stat.isDirectory() ? [entry] : [fileTargets?.gitDir, fileTargets?.commonDir]
    ).flatMap((path) =>
      path ? [comparePath(normalizeProtectedPathCandidate(path, cwd, context))] : [],
    );
    // A symlinked .git directory canonicalizes to its external target, so keep
    // the lexical entry too — deleting the repository unlinks the control plane.
    const directories = [
      ...new Set(
        stat.isDirectory()
          ? [comparePath(dotGitPath.replace(/\\/g, '/')), ...canonicalDirectories]
          : canonicalDirectories,
      ),
    ];
    return [
      {
        entry: comparePath(entry),
        markerFile: markerFile ? comparePath(markerFile) : null,
        directories,
        // Keep both the lexical hooks path and its canonical target so a
        // symlinked hooks directory stays protected on either alias.
        hooksDirectories: [
          ...new Set(
            directories.flatMap((directory) => {
              const lexical = comparePath(join(directory, 'hooks'));
              return [lexical, comparePath(normalizeProtectedPathCandidate(lexical, cwd, context))];
            }),
          ),
        ],
      },
    ];
  } catch {
    return [];
  }
}

export function isProtectedGitDeleteTarget(
  target: string,
  cwd: string,
  metadata: ProtectedGitMetadata | null,
  recursive: boolean,
  context: PathCanonicalizationContext,
  dotEntryGlobs = false,
): boolean {
  if (!metadata) return false;
  const candidate = comparePath(normalizeProtectedPathCandidate(target, cwd, context));
  const globBase = candidate.replace(/(\/\.?\*+)+$/, '');
  if (globBase !== candidate && globBase !== '') {
    if (isProtectedExactOrHookTarget(globBase, metadata)) return true;
    // POSIX `*` skips dot entries; `.*` globs and PowerShell wildcards do not.
    const matchesHidden = dotEntryGlobs || candidate.slice(globBase.length).includes('/.');
    const covers = (path: string) =>
      matchesHidden ? isEqualOrWithin(path, globBase) : isGlobVisibleDescendant(path, globBase);
    if (metadata.markerFiles.some(covers)) return true;
    return recursive && protectedRoots(metadata).some(covers);
  }
  if (isProtectedExactOrHookTarget(candidate, metadata)) return true;
  return recursive && protectedRoots(metadata).some((path) => isEqualOrWithin(path, candidate));
}

// A trailing all-star glob deletes the base's children, but `*` does not match
// dot-entries, so a protected root is only covered when its first path segment
// below the base is not hidden (e.g. `.git/worktrees/*` covers a linked gitdir
// while `./*` at the repository root does not cover `.git`).
function isGlobVisibleDescendant(target: string, base: string): boolean {
  const path = relative(base, target);
  if (path === '' || path.startsWith('..') || isAbsolute(path)) return false;
  return !path.split(/[\\/]/)[0]?.startsWith('.');
}

function isProtectedGitMoveSource(
  target: string,
  cwd: string,
  metadata: ProtectedGitMetadata | null,
  context: PathCanonicalizationContext,
): boolean {
  return isProtectedGitDeleteTarget(target, cwd, metadata, true, context);
}

function isProtectedGitMoveDestination(
  target: string,
  cwd: string,
  metadata: ProtectedGitMetadata | null,
  context: PathCanonicalizationContext,
): boolean {
  if (!metadata) return false;
  return isProtectedExactOrHookTarget(
    comparePath(normalizeProtectedPathCandidate(target, cwd, context)),
    metadata,
  );
}

function isProtectedGitWriteTarget(
  target: string,
  cwd: string,
  metadata: ProtectedGitMetadata | null,
  context: PathCanonicalizationContext,
): boolean {
  if (!metadata) return false;
  return isProtectedGitWriteLikeTarget(target, cwd, metadata, context, metadata.entries);
}

function isProtectedGitRedirectionTarget(
  target: string,
  cwd: string,
  metadata: ProtectedGitMetadata | null,
  context: PathCanonicalizationContext,
): boolean {
  if (!metadata) return false;
  return isProtectedGitWriteLikeTarget(target, cwd, metadata, context, metadata.markerFiles);
}

function isProtectedGitWriteLikeTarget(
  target: string,
  cwd: string,
  metadata: ProtectedGitMetadata,
  context: PathCanonicalizationContext,
  exactTargets: readonly string[],
): boolean {
  const candidate = comparePath(normalizeProtectedPathCandidate(target, cwd, context));
  return exactTargets.includes(candidate) || isProtectedHookTarget(candidate, metadata);
}

export function isProtectedGitHookNameSelection(
  startingPoints: readonly string[],
  cwd: string,
  metadata: ProtectedGitMetadata | null,
  context: PathCanonicalizationContext,
): boolean {
  if (!metadata) return false;
  return metadata.hooksDirectories.some((hooks) =>
    startingPoints.some((target) =>
      isEqualOrWithin(hooks, comparePath(normalizeProtectedPathCandidate(target, cwd, context))),
    ),
  );
}

function isProtectedExactOrHookTarget(candidate: string, metadata: ProtectedGitMetadata): boolean {
  return (
    metadata.entries.includes(candidate) ||
    metadata.directories.includes(candidate) ||
    isProtectedHookTarget(candidate, metadata)
  );
}

function isProtectedHookTarget(candidate: string, metadata: ProtectedGitMetadata): boolean {
  return metadata.hooksDirectories.some((hooks) => isEqualOrWithin(candidate, hooks));
}

function protectedRoots(metadata: ProtectedGitMetadata): readonly string[] {
  // Hooks directories can be symlinked outside the Git directory, so ancestor
  // deletion must also cover their canonical targets.
  return [...metadata.entries, ...metadata.directories, ...metadata.hooksDirectories];
}

function isEqualOrWithin(target: string, root: string): boolean {
  const path = relative(root, target);
  return path === '' || (!/^\.\.(?:[\\/]|$)/.test(path) && !isAbsolute(path));
}

function comparePath(path: string): string {
  return process.platform === 'win32' ? path.toLowerCase() : path;
}

function findGitMetadataMoveTarget(
  segment: readonly string[],
  state: ProtectedPathShellState,
  metadata: ProtectedGitMetadata,
  context: PathCanonicalizationContext,
): string | null {
  if (isAssignmentOnlySegment(segment)) return null;
  const stripped = stripWrappersForPathScan([...segment], context.environment);
  if (getBasename(stripped[0] ?? '').toLowerCase() !== 'mv') return null;
  const operands = extractMvOperandPaths(stripped.slice(1));
  const source = operands.sources.find((target) =>
    isProtectedGitMoveSource(
      expandTrackedShellVariables(target, state.variables),
      state.cwd,
      metadata,
      context,
    ),
  );
  if (source) return source;
  return operands.destination &&
    isProtectedGitMoveDestination(
      expandTrackedShellVariables(operands.destination, state.variables),
      state.cwd,
      metadata,
      context,
    )
    ? operands.destination
    : null;
}
