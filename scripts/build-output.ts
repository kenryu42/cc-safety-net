interface BuildOutput {
  path: string;
  size: number;
}

export function getBundledOutputs(outputs: BuildOutput[]) {
  return {
    indexOutput: outputs.find((output) =>
      normalizeBuildPath(output.path).endsWith('dist/index.js'),
    ),
    binOutput: outputs.find((output) =>
      normalizeBuildPath(output.path).endsWith('dist/bin/cc-safety-net.js'),
    ),
    piOutput: outputs.find((output) =>
      normalizeBuildPath(output.path).endsWith('dist/pi/index.js'),
    ),
  };
}

function normalizeBuildPath(path: string): string {
  return path.replaceAll('\\', '/');
}
