import { PDAGraph, PDAState } from "./PDASearch";
import { GraphStepper } from "./PDAStep";
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
        });
        node = node.parent;
    }
    trace.push({
        to: node.state.id,
        read: null,
        pop: "",
        push: "",
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
            stack: tempStack,
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
            trace: [{ to: 0, read: null, pop: '', push: '', }],
            accepted: false,  // empty stack is part of accepted condition
            remaining: input,
            stack: tempStack,
        };
        return emptyExecution;
    }
    // Simulate stack operations
    const trace = generateTrace(result);
    for (let i = 0; i < trace.length; i++) {
        // Pop first if symbol matches top of stack
        if (trace[i].pop !== '' && trace[i].pop === tempStack[tempStack.length - 1]) {
            tempStack.pop();
        }
        // For invalid pop operations (trying to pop from empty stack)
        // push a dummy value to the stack
        else if (trace[i].pop !== '' && tempStack.length === 0) {
            tempStack.push('invalidPop!');
        }
        // Push if symbol is not empty
        if (trace[i].push !== '' && trace[i].push !== null) {
            tempStack.push(trace[i].push);
        }
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
            //stack: stack,
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
