export type TextRange = {
    start: number;
    end: number;
};
export declare function findMatchingBracket(content: string, openIndex: number, options: {
    skipComment?: (content: string, index: number) => number;
    stringError: string;
    bracketError: string;
}): number;
export declare function getLineIndent(content: string, index: number): string;
export declare function removeArrayRangeItem(content: string, item: TextRange): string;
