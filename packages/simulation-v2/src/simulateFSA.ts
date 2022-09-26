import { FSAGraphNode, FSAGraph } from "./FSASearch";
import {
    ExecutionResult,
    ExecutionTrace,
    UnparsedFSAGraph,
} from "./graph";
import { parseGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";

const generateTrace = (node: FSAGraphNode): ExecutionTrace[] => {
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
    const parsedGraph = parseGraph(graph);

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

    initialState.read = null;
    initialState.remaining = input;

    const problem = new FSAGraph(input, new FSAGraphNode(initialState), parsedGraph.states, parsedGraph.transitions);
    const result = breadthFirstSearch(problem);

    console.log(result);

    if (!result) {
        const emptyExecution: ExecutionResult = {
            trace: [{ to: 0, read: null }],
            accepted: false,
            remaining: input,
        };
        return emptyExecution;
    }

    return {
        accepted:
            result.state.isFinal && result.state.remaining === "",
        remaining: result.state.remaining,
        trace: generateTrace(result),
    };
};

// export const graphStepper = (graph: UnparsedFSAGraph, input: string) => {
//     const parsedGraph = parseGraph(graph);
//     const problem = new FSAGraphProblem(parsedGraph, input);
//     // const stepper = new GraphStepper(problem);
//     // return stepper;
// };
