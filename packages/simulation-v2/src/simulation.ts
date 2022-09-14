import { ExecutionResult, ExecutionTrace, FSAGraphProblem, GraphNode, UnparsedFSAGraph } from "./graph";
import { parseGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";

const generateTrace = (node: GraphNode): ExecutionTrace[] => {
    return []
}

export const simulateFSA = (graph: UnparsedFSAGraph, input: string) => {
    const parsedGraph = parseGraph(graph);
    const problem = new FSAGraphProblem(parsedGraph, input);
    const result = breadthFirstSearch(problem);

    const executionResult: ExecutionResult = {
        accepted: result.state.isFinal,
        remaining: result.state.read,
        trace: generateTrace(result)
    }

    return executionResult;
}