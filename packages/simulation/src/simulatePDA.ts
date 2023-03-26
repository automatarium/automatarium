import { PDAGraph, PDAState } from './PDASearch'
import { GraphStepper } from './Step'
import { PDAExecutionResult, PDAExecutionTrace, PDAGraphIn, Stack, UnparsedGraph } from './graph'
import { Node } from './interfaces/graph'
import { resolveGraph } from './parseGraph'
import { breadthFirstSearch } from './search'

const generateTrace = (node: Node<PDAState>): PDAExecutionTrace[] => {
  const trace: PDAExecutionTrace[] = []
  while (node.parent) {
    trace.push({
      to: node.state.id,
      read: node.state.read,
      pop: node.state.pop,
      push: node.state.push,
      currentStack: [],
      invalidPop: false
    })
    node = node.parent
  }
  trace.push({
    to: node.state.id,
    read: null,
    pop: '',
    push: '',
    currentStack: [],
    invalidPop: false
  })
  return trace.reverse()
}

// TODO: Make this take a PDAGraph instead of UnparsedGraph
export const simulatePDA = (
  graph: UnparsedGraph,
  input: string
): PDAExecutionResult => {
  const tempStack: Stack = []
  const parsedGraph = resolveGraph(graph) as PDAGraphIn
  // Doing this find here so we don't have to deal with undefined in the class
  const initialState = parsedGraph.states.find((state) => {
    return state.id === graph.initialState
  })

  if (!initialState) {
    return {
      accepted: false,
      remaining: input,
      trace: [],
      stack: []
    }
  }

  const initialNode = new Node<PDAState>(
    new PDAState(initialState.id, initialState.isFinal, null, input)//, stack ),//, initialState.stack),
  )

  const states = parsedGraph.states.map(
    (state) => new PDAState(state.id, state.isFinal)
  )

  const problem = new PDAGraph(initialNode, states, parsedGraph.transitions)
  const result = breadthFirstSearch(problem)

  if (!result) {
    return {
      trace: [{ to: 0, read: null, pop: '', push: '', currentStack: [], invalidPop: false }],
      accepted: false, // empty stack is part of accepted condition
      remaining: input,
      stack: []
    }
  }
  // Simulate stack operations
  /*
    *  Note:- this was a workaround for when BFS didn't consider the stack
    *       - It's a double up now but the PDAStackVisualiser still uses it
    */
  const trace = generateTrace(result)
  for (let i = 0; i < trace.length; i++) {
    // Handle pop symbol first
    if (trace[i].pop !== '') {
      // Pop if symbol matches top of stack
      if (trace[i].pop === tempStack[tempStack.length - 1]) {
        tempStack.pop()
      } else if (tempStack.length === 0) {
        // Else operation is invalid
        // Empty stack case
        // Consider providing feedback to user during the trace
        trace[i].invalidPop = true
      } else if (trace[i].pop !== tempStack[tempStack.length - 1]) {
        // Non-matching symbol case
        // Consider providing feedback to user during the trace
        trace[i].invalidPop = true
      }
    }
    // Handle push symbol if it exists
    if (trace[i].push !== '') {
      tempStack.push(trace[i].push)
    }
    trace[i].currentStack = JSON.parse(JSON.stringify(tempStack))
  }
  const stack = tempStack

  return {
    accepted: result.state.isFinal && result.state.remaining === '' && stack.length === 0,
    remaining: result.state.remaining,
    trace,
    stack
  }
}

export const graphStepperPDA = (graph: UnparsedGraph, input: string) => {
  const parsedGraph = resolveGraph(graph)

  const initialState = parsedGraph.states.find((state) => {
    return state.id === graph.initialState
  })

  if (!initialState) {
    return {
      accepted: false,
      remaining: input,
      trace: []
    }
  }

  const initialNode = new Node<PDAState>(
    new PDAState(initialState.id, initialState.isFinal, null, input)//, initialState.stack),//, initialState.stack),
  )

  const states = parsedGraph.states.map(
    (state) => new PDAState(state.id, state.isFinal)//, state.stack),
  )

  const problem = new PDAGraph(initialNode, states, parsedGraph.transitions)

  return new GraphStepper(problem)
}
