export type TextRange = {
    start: number;
    end: number;
};
export declare function skipWhitespace(content: string, index: number): number;
export declare function skipWhitespaceAndComments(content: string, index: number): number;
export declare function skipString(content: string, index: number, errorMessage: string): number;
export declare function skipJsonComment(content: string, index: number): number;
export declare function findMatchingBracket(content: string, openIndex: number, options: {
    skipComment?: (content: string, index: number) => number;
    stringError: string;
    bracketError: string;
}): number;
export declare function getLineIndent(content: string, index: number): string;
export declare function removeArrayRangeItem(content: string, item: TextRange): string;
