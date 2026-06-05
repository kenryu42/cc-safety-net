import { analyzeCommandInternal } from '@/core/analyze/analyze-command';
import { loadConfig } from '@/core/config';
import type { AnalyzeOptions, AnalyzeResult } from '@/types';

export function analyzeCommand(
  command: string,
  options: AnalyzeOptions = {},
): AnalyzeResult | null {
  const config = options.config ?? loadConfig(options.cwd);
  return analyzeCommandInternal(command, 0, { ...options, config });
}

export { loadConfig };
