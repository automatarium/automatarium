import {
    ExecutionResult,
    ExecutionTrace,
    FSAGraphProblem,
    GraphNode,
    UnparsedFSAGraph,
} from "./graph";
import { parseGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";

const generateTrace = (node: GraphNode): ExecutionTrace[] => {
    const trace: ExecutionTrace[] = [];
    while (node.parent) {
        trace.push({
            to: node.state.id,
            read: node.read,
        });
        node = node.parent;
    }
    trace.push({
        to: node.state.id,
        read: null,
    });
    return trace.reverse();
};

export const simulateFSA = (graph: UnparsedFSAGraph, input: string) => {
    console.log("Graph: ", graph);
    const parsedGraph = parseGraph(graph);
    const problem = new FSAGraphProblem(parsedGraph, input);
    const result = breadthFirstSearch(problem);

    if (result.state.id === -1) {
        const emptyExecution: ExecutionResult = {
            trace: [{ to: 0, read: null }],
            accepted: false,
            remaining: input,
        };
        return emptyExecution;
    }

    console.log("The result is ...!", result);

    const executionResult: ExecutionResult = {
        accepted: result.state.isFinal,
        remaining: result.state.remaining,
        trace: generateTrace(result),
    };

    return executionResult;
};
