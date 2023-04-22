export type ReadSymbol = string;
export type StateID = number;

export type Tape ={
    pointer: number
    trace: string[]
}

export type ExecutionTrace = {
    read: string | null;
    to: StateID;
};

export type ExecutionResult = {
    accepted: boolean;
    remaining: string;
    trace: ExecutionTrace[];
};

export type Stack = string[];

export type PDAExecutionTrace = {
    read: string | null;
    to: StateID;
    pop: string;
    push: string;
    currentStack: Stack;
    invalidPop: boolean;
};

export type PDAExecutionResult = {
    accepted: boolean;
    remaining: string;
    trace: PDAExecutionTrace[];
    stack: Stack;
}

export type TMExecutionTrace = {
    tape: Tape | null
    to: StateID
}

export type TMExecutionResult = {
    halted: boolean
    tape: Tape
    trace: TMExecutionTrace[]
}
