export type CheckCommandInput = Readonly<{
    command: string;
    cwd: string;
}>;
export type CheckCommandResult = Readonly<{
    kind: 'allow';
}> | Readonly<{
    kind: 'deny';
    reason: string;
    ruleId?: string;
}>;
export declare function checkCommand(input: CheckCommandInput): CheckCommandResult;
