import { type Layout, SHIPPED_LAYOUT } from './build-layout';

interface BuildOutput {
  path: string;
  size: number;
}

export function getBundledOutputs(outputs: BuildOutput[], layout: Layout = SHIPPED_LAYOUT) {
  return {
    indexOutput: outputs.find((output) =>
      normalizeBuildPath(output.path).endsWith(`${layout.outdir}/index.js`),
    ),
    binOutput: outputs.find((output) =>
      normalizeBuildPath(output.path).endsWith(`${layout.outdir}/${layout.emitted.bin}`),
    ),
    piOutput: outputs.find((output) =>
      normalizeBuildPath(output.path).endsWith(`${layout.outdir}/${layout.emitted.pi}`),
    ),
  };
}

export function isPublicDeclarationOutput(path: string, layout: Layout = SHIPPED_LAYOUT): boolean {
  return layout.emitted.declarations
    .map((declaration) => `${layout.outdir}/${declaration}`)
    .includes(normalizeBuildPath(path));
}

function normalizeBuildPath(path: string): string {
  return path.replaceAll('\\', '/');
}
