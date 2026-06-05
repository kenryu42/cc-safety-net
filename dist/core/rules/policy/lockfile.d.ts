import type { RulesLockfile } from './types';
export declare function readLockfile(path: string): {
    lock: RulesLockfile | null;
    errors: string[];
};
