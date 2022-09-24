import { StateID } from "../graph";

export interface IGraphNode {
    depth: number;
    key(): string;
}

export interface IGraphState {
    id: StateID;
    isFinal: boolean;
    key(): string;
}

export interface IProblem<T extends IGraphNode> {
    getInitialState(): T | null;
    getSuccessors(node: T): T[];
    isFinalState(node: T): boolean;
}