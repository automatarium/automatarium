import { PDAGraph, PDAState } from "./PDASearch";
import { GraphStepper } from "./Step";
import { PDAExecutionResult, PDAExecutionTrace, UnparsedPDAGraph, Stack } from "./graph";
import { Node } from "./interfaces/graph";
import { parsePDAGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";


const generateTrace = (node: Node<PDAState>): PDAExecutionTrace[] => {
    const trace: PDAExecutionTrace[] = [];
    while (node.parent) {
        trace.push({
            to: node.state.id,
            read: node.state.read,
            pop: node.state.pop,
            push: node.state.push,
            currentStack: [],
            invalidPop: false,
        });
        node = node.parent;
    }
    trace.push({
        to: node.state.id,
        read: null,
        pop: "",
        push: "",
        currentStack: [],
        invalidPop: false,
    });
    return trace.reverse();
};

export const simulatePDA = (
    graph: UnparsedPDAGraph,
    input: string,
): PDAExecutionResult => {
    
    const tempStack: Stack = [];
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
            stack: [],
        };
    }

    const initialNode = new Node<PDAState>(
        new PDAState(initialState.id, initialState.isFinal, null, input)//, stack ),//, initialState.stack),
    );

    const states = parsedGraph.states.map(
        (state) => new PDAState(state.id, state.isFinal),
    );

    const problem = new PDAGraph(initialNode, states, parsedGraph.transitions);
    const result = breadthFirstSearch(problem);

    if (!result) {
        const emptyExecution: PDAExecutionResult = {
            trace: [{ to: 0, read: null, pop: '', push: '', currentStack: [], invalidPop: false}],
            accepted: false,  // empty stack is part of accepted condition
            remaining: input,
            stack: [],
        };
        return emptyExecution;
    }
    // Simulate stack operations
    /*
    *  Note:- this was a workaround for when BFS didn't consider the stack
    *       - It's a double up now but the PDAStackVisualiser still uses it
    */
    const trace = generateTrace(result);
    for (let i = 0; i < trace.length; i++) {
        // Handle pop symbol first
        if (trace[i].pop !== '') {
            // Pop if symbol matches top of stack
            if(trace[i].pop === tempStack[tempStack.length - 1]) {
                tempStack.pop();
            }
            // Else operation is invalid
            // Empty stack case
            else if (tempStack.length === 0) {
                // Consider providing feedback to user during the trace
                trace[i].invalidPop = true;
            }
            // Non-matching symbol case
            else if (trace[i].pop !== tempStack[tempStack.length - 1]) {
                // Consider providing feedback to user during the trace
                trace[i].invalidPop = true;
            }
        }
        // Handle push symbol if it exists
        if (trace[i].push !== '') {
            tempStack.push(trace[i].push);
        }
        trace[i].currentStack = JSON.parse(JSON.stringify(tempStack));
    }
    const stack = tempStack;
    
    return {
        accepted: result.state.isFinal && result.state.remaining === "" && stack.length === 0,
        remaining: result.state.remaining,
        trace,
        stack,
    };
};

export const graphStepperPDA = (graph: UnparsedPDAGraph, input: string) => {
    const parsedGraph = parsePDAGraph(graph);

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

    const initialNode = new Node<PDAState>(
        new PDAState(initialState.id, initialState.isFinal, null, input)//, initialState.stack),//, initialState.stack),
    );

    const states = parsedGraph.states.map(
        (state) => new PDAState(state.id, state.isFinal),//, state.stack),
    );

    const problem = new PDAGraph(initialNode, states, parsedGraph.transitions)

    return new GraphStepper(problem);
};
