import { PDAGraphNode, PDAGraphProblem } from "./PDAGraph";
import { ExecutionResult, ExecutionTrace, UnparsedPDAGraph } from "./graph";
import { parsePDAGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";

const generateTrace = (node: PDAGraphNode): ExecutionTrace[] => {
    console.log("Generating PDA trace...")
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

export const simulatePDA = (graph: UnparsedPDAGraph, input: string) => {
    const parsedGraph = parsePDAGraph(graph);
    const problem = new PDAGraphProblem(parsedGraph, input);
    const result = breadthFirstSearch(problem);
    console.log("Result of PDA simulation is: " + result)
    if (!result) {
        const emptyExecution: ExecutionResult = {
            trace: [{ to: 0, read: null }],
            accepted: false,
            remaining: input,
        };
        console.log("Simulating PDA...")
        return emptyExecution;
    }

    console.log("The PDA result is ...!", result);

    const executionResult: ExecutionResult = {
        accepted: result.state.isFinalState && result.state.remainingInput === "",
        remaining: result.state.remainingInput,
        trace: generateTrace(result),
    };

    return executionResult;
};

// export const graphStepper = (graph: UnparsedPDAGraph, input: string) => {
//     const parsedGraph = parseGraph(graph);
//     const problem = new PDAGraphProblem(parsedGraph, input);
//     const stepper = new GraphStepper(problem);
//     return stepper;
// };
