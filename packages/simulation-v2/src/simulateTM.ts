import { TMGraphNode, TMGraph } from "./TMSearch";
import { TMGraphIn } from "./graph"
import {
  Tape,
  TMExecutionResult,
  TMExecutionTrace,
} from "./graph";
import { parseGraph } from "./parse-graph";
import { breadthFirstSearch } from "./search";

const generateTrace = (node: TMGraphNode): TMExecutionTrace[] => {
  const trace: TMExecutionTrace[] = [];
  while (node.parent) {
    trace.push({
      to: node.state.id,
      tape: node.state.tape,
    });
    node = node.parent;
  }
  trace.push({
    to: node.state.id,
    tape: node.state.tape,
  });
  return trace.reverse();
};

export const simulateTM = (
    graph: TMGraphIn,
    // This forces front end to hand over tape
    inputTape: Tape,
): TMExecutionResult => {

  // Doing this find here so we don't have to deal with undefined in the class
  const initialState = graph.states.find((state) => {
    return state.id === graph.initialState;
  });

  if (!initialState) {
    return {
      halted: false,
      tape: inputTape,
      trace: [],
    };
  }

  initialState.tape = inputTape;

  const problem = new TMGraph(new TMGraphNode(initialState), graph.states, graph.transitions);
  const result = breadthFirstSearch(problem);

  if (!result) {
    const emptyExecution: TMExecutionResult = {
      trace: [{ to: 0, tape: null }],
      halted: false,
      tape: inputTape,
    };
    return emptyExecution;
  }
  return {
    halted: result.state.isFinal,
    tape: result.state.tape,
    trace: generateTrace(result),
  };
};

