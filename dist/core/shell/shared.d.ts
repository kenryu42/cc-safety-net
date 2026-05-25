import type { ParseEntry } from 'shell-quote';
export declare const ENV_PROXY: {};
export declare function hasUnclosedQuotes(command: string): boolean;
export declare function getCommandTokenText(token: ParseEntry | undefined): string | null;
