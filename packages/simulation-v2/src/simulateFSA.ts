import { FSAGraphNode, FSAGraphProblem } from "./FSAGraph";
import { ExecutionResult, ExecutionTrace, UnparsedFSAGraph } from "./graph";
import { parseGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";

const generateTrace = (node: FSAGraphNode): ExecutionTrace[] => {
    const trace: ExecutionTrace[] = [];
    while (node.parent) {
        trace.push({
            to: node.state.stateID,
            read: node.state.readSymbol,
        });
        node = node.parent;
    }
    trace.push({
        to: node.state.stateID,
        read: null,
    });
    return trace.reverse();
};

export const simulateFSA = (graph: UnparsedFSAGraph, input: string) => {
    const parsedGraph = parseGraph(graph);
    const problem = new FSAGraphProblem(parsedGraph, input);
    const result = breadthFirstSearch(problem);

    if (!result) {
        const emptyExecution: ExecutionResult = {
            trace: [{ to: 0, read: null }],
            accepted: false,
            remaining: input,
        };
        return emptyExecution;
    }

    console.log("The result is ...!", result);

    const executionResult: ExecutionResult = {
        accepted: result.state.isFinalState && result.state.remainingInput === "",
        remaining: result.state.remainingInput,
        trace: generateTrace(result),
    };

    return executionResult;
};

// export const graphStepper = (graph: UnparsedFSAGraph, input: string) => {
//     const parsedGraph = parseGraph(graph);
//     const problem = new FSAGraphProblem(parsedGraph, input);
//     const stepper = new GraphStepper(problem);
//     return stepper;
// };
