import { validTransitions, Node } from '../src'
import { parseFSAGraph } from '../src/parse-graph'
import { FSAGraph, FSAState } from '../src/FSASearch'

import dibDipLambdaloop from './graphs/dib_dip-lambdaloop.json'
import { FSATransition, StateID, UnparsedFSAGraph } from '../src/graph'

type SimpleTransition = {
  from: StateID,
  to: StateID
}

/**
 * Converts a list of node transitions into a simple from-to pair.
 * The returned transitions always have ID of 0
 */
function toTransition (x: Node<FSAState>[]): SimpleTransition[] {
  return x.map(it => ({
    from: it.parent.state.id,
    to: it.state.id
  }))
}

/**
 * Checks if a graph running a single step returns some transitions
 * @param g Graph to test
 * @param fromID The initial state to be in
 * @param has Input string that you want to feed
 * @param transitions Transitions to expect
 */
function doesTransitions (g: FSAGraph, fromID: StateID, has: string, transitions: FSATransition[]) {
  const valid = g.getSuccessors(new Node(new FSAState(0, false, null, has))).map(it => ({
    from: it.parent.state.id,
    to: it.state.id
  }))

  expect(valid).toEqual(transitions.map(it => ({
    from: it.from,
    to: it.to
  })))
}

describe('Non-lambda transitions', () => {
  test('Identify single transition', () => {
    const testGraph = new FSAGraph(
      new Node(new FSAState(0, false)),
      [
        new FSAState(0, false),
        new FSAState(1, true)
      ],
      [{
        id: 0,
        from: 0,
        to: 1,
        read: ['a']
      }]
    )
    doesTransitions(testGraph, 0, 'a', [testGraph.transitions[0]])
  })

  test('Identify two possible transitions', () => {
    const testGraph = new FSAGraph(
      new Node(new FSAState(0, false)),
      [
        new FSAState(0, false),
        new FSAState(1, true)
      ],
      [{
        id: 0,
        from: 0,
        to: 1,
        read: ['a']
      }, {
        id: 0,
        from: 0,
        to: 1,
        read: ['a', 'b']
      }]
    )
    doesTransitions(testGraph, 0, 'a', testGraph.transitions)
  })

  test('Identify one of two possible transitions', () => {
    const testGraph = new FSAGraph(
      new Node<FSAState>(new FSAState(0, false)),
      [
        new FSAState(0, false),
        new FSAState(1, true)
      ],
      [{
        id: 0,
        from: 0,
        to: 1,
        read: ['a']
      }, {
        id: 0,
        from: 0,
        to: 1,
        read: ['b']
      }]
    )
    doesTransitions(testGraph, 0, 'a', [testGraph.transitions[0]])
  })
})

describe('Lambda transitions', () => {
  test('Identify single indirect transition', () => {
    const testGraph = new FSAGraph(
      new Node<FSAState>(new FSAState(0, false)),
      [
        new FSAState(0, false),
        new FSAState(1, false),
        new FSAState(2, false),
        new FSAState(3, true)
      ],
      [{
        id: 0,
        from: 0,
        to: 1,
        read: ['a']
      }, {
        id: 0,
        from: 1,
        to: 2,
        read: []
      }, {
        id: 0,
        from: 2,
        to: 3,
        read: ['b']
      }]
    )
    doesTransitions(testGraph, 0, 'a', [testGraph.transitions[0]])
    doesTransitions(testGraph, 1, 'b', [testGraph.transitions[2]])
  })
})

describe('Automata dib_dip-lambdaloop', () => {
  test('Valid states from q4', () => {
    const graph = parseFSAGraph(dibDipLambdaloop as unknown as UnparsedFSAGraph)
    const valid = validTransitions(graph, 4, 'p')
    expect(valid).toEqual([
      {
        transition: graph.transitions.find(tr => tr.id === 6),
        trace: [{ to: 5, read: '' }, { to: 6, read: 'p' }]
      }
    ])
  })
})
