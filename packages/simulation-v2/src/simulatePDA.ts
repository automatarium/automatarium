import { PDAGraphNode, PDAGraph } from "./PDAGraph";
import { ExecutionResult, ExecutionTrace, UnparsedPDAGraph } from "./graph";
import { parsePDAGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";

const generateTrace = (node: PDAGraphNode): ExecutionTrace[] => {
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

export const simulatePDA = (
    graph: UnparsedPDAGraph,
    input: string,
): ExecutionResult => {
    const parsedGraph = parsePDAGraph(graph);

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

    const problem = new PDAGraph(input, new PDAGraphNode(initialState), parsedGraph.states, parsedGraph.transitions);
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

// export const graphStepper = (graph: UnparsedPDAGraph, input: string) => {
//     const parsedGraph = parseGraph(graph);
//     const problem = new PDAGraphProblem(parsedGraph, input);
//     const stepper = new GraphStepper(problem);
//     return stepper;
// };
