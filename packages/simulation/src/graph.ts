import { TMDirection } from 'frontend/src/types/ProjectTypes'

export type ReadSymbol = string;
export type StateID = number;

export type Tape ={
    pointer: number
    trace: string[]
}

export type FSAExecutionTrace = {
    read: string | null;
    to: StateID;
};

export type FSAExecutionResult = {
    accepted: boolean;
    remaining: string;
    trace: FSAExecutionTrace[];
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
    read: string | null
    write: string | null
    direction: TMDirection | null
}

export type TMExecutionResult = {
    accepted: boolean // Halted is the correct term, but accepted makes life easier
    tape: Tape
    trace: TMExecutionTrace[]
}

// Union of all possible execution results
export type ExecutionResult = FSAExecutionResult | PDAExecutionResult | TMExecutionResult
