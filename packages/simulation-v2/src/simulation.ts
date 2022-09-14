import { ExecutionResult, ExecutionTrace, FSAGraphProblem, UnparsedFSAGraph } from "./graph";
import { parseGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";

export const simulateFSA = (graph: UnparsedFSAGraph, input: string) => {
    const parsedGraph = parseGraph(graph);
    const problem = new FSAGraphProblem(parsedGraph, input);
    const finalNode = breadthFirstSearch(problem);
    if (!finalNode) {
        return false;
    }

    return null;
}