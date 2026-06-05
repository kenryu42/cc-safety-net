import { type CustomRule, type ValidationResult } from '@/types';
export interface RulebookFixture {
    command: string;
    expect: 'blocked' | 'allowed';
    rule?: string;
}
export interface Rulebook {
    rulebook_version: 1;
    name: string;
    version: string;
    description?: string;
    author?: string;
    allowed_commands: string[];
    rules: CustomRule[];
    tests: RulebookFixture[];
}
/** @internal - exported for test coverage */
export interface RulebookFixtureFailure {
    command: string;
    message: string;
    trace: string[];
}
export interface RulebookFixtureResult {
    ok: boolean;
    failures: RulebookFixtureFailure[];
}
/** @internal - exported for test coverage */
export declare function validateRulebook(rulebook: unknown): ValidationResult;
export declare function runRulebookFixtures(rulebook: Rulebook): RulebookFixtureResult;
export declare function assertValidRulebook(rulebook: unknown): Rulebook;
