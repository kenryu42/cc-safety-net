import { extractFlagArg } from '@/core/analyze/shell-wrappers';
import { DANGEROUS_PATTERNS } from '@/types';

const INTERPRETER_CODE_FLAGS = ['-c', '-e'] as const;

export function extractInterpreterCodeArg(tokens: readonly string[]): string | null {
  return extractFlagArg(tokens, INTERPRETER_CODE_FLAGS);
}

export function containsDangerousCode(code: string): boolean {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return true;
    }
  }
  return false;
}
