const BUMP_VALUES = ['major', 'minor', 'patch'] as const;

export type Bump = (typeof BUMP_VALUES)[number];

export function parseBump(value: string | undefined): Bump | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (BUMP_VALUES.includes(value as Bump)) {
    return value as Bump;
  }
  throw new Error(`BUMP must be one of: ${BUMP_VALUES.join(', ')}`);
}
