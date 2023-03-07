import { FSAGraph, FSAState } from "./FSASearch";
import { GraphStepper } from "./Step";
import { ExecutionResult, ExecutionTrace, UnparsedFSAGraph } from "./graph";
import { Node } from "./interfaces/graph";
import { parseFSAGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";

const generateTrace = (node: Node<FSAState>): ExecutionTrace[] => {
    const trace: ExecutionTrace[] = [];
    while (node.parent) {
        trace.push({
            to: node.state.id,
            read: node.state.read,
        });
        node = node.parent;
    }
    trace.push({
        to: node.state.id,
        read: null,
    });
    return trace.reverse();
};

export const simulateFSA = (
    graph: UnparsedFSAGraph,
    input: string,
): ExecutionResult => {
    const parsedGraph = parseFSAGraph(graph);

    // Doing this find here so we don't have to deal with undefined in the class
    const initialState = parsedGraph.states.find((state) => {
        return state.id === graph.initialState;
    });

    if (!initialState) {
        return {
            accepted: false,
            remaining: input,
            trace: [],
        };
    }

    const initialNode = new Node<FSAState>(
        new FSAState(initialState.id, initialState.isFinal, null, input),
    );

    const states = parsedGraph.states.map(
        (state) => new FSAState(state.id, state.isFinal),
    );

    const problem = new FSAGraph(initialNode, states, parsedGraph.transitions);
    const result = breadthFirstSearch(problem);



    if (!result) {
        const emptyExecution: ExecutionResult = {
            trace: [{ to: 0, read: null }],
            accepted: false,
            remaining: input,
        };
        return emptyExecution;
    }

    return {
        accepted: result.state.isFinal && result.state.remaining === "",
        remaining: result.state.remaining,
        trace: generateTrace(result),
    };
};

export const graphStepper = (graph: UnparsedFSAGraph, input: string) => {
    const parsedGraph = parseFSAGraph(graph);

    const initialState = parsedGraph.states.find((state) => {
        return state.id === graph.initialState;
    });

    if (!initialState) {
        return {
            accepted: false,
            remaining: input,
            trace: [],
        };
    }

    const initialNode = new Node<FSAState>(
        new FSAState(initialState.id, initialState.isFinal, null, input),
    );

    const states = parsedGraph.states.map(
        (state) => new FSAState(state.id, state.isFinal),
    );

    const problem = new FSAGraph(initialNode, states, parsedGraph.transitions);

    return new GraphStepper(problem);
};
