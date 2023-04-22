import { PDAState } from './PDASearch'
import { PDAExecutionResult, PDAExecutionTrace, Stack } from './graph'
import { Node } from './interfaces/graph'
import { breadthFirstSearch } from './search'
import { PDAProjectGraph } from 'frontend/src/types/ProjectTypes'
import { buildProblem } from './utils'

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

export const simulatePDA = (
  graph: PDAProjectGraph,
  input: string
): PDAExecutionResult => {
  const tempStack: Stack = []
  const problem = buildProblem(graph, input)
  if (!problem) {
    return {
      accepted: false,
      remaining: input,
      trace: [],
      stack: []
    }
  }

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
