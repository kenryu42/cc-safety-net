export declare const explainCommand: {
    name: "explain";
    description: string;
    usage: string;
    argument: string;
    options: ({
        flags: string;
        description: string;
        argument?: undefined;
    } | {
        flags: string;
        argument: string;
        description: string;
    })[];
    examples: string[];
};
