import { Node } from '../src'
import { resolveGraph } from '../src/parseGraph'
import { FSAGraph, FSAState } from '../src/FSASearch'

import dibDipLambdaloop from './graphs/dib_dip-lambdaloop.json'
import { FSATransition, StateID, UnparsedGraph } from '../src/graph'

/**
 * Checks if a graph running a single step returns some transitions
 * @param g Graph to test
 * @param fromID The initial state to be in
 * @param has Input string that you want to feed
 * @param transitions Transitions to expect
 */
function doesTransitions (g: FSAGraph, fromID: StateID, has: string, transitions: FSATransition[]) {
  const valid = g.getSuccessors(new Node(new FSAState(fromID, false, null, has))).map(it => ({
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
    // Shouldn't skip past lambdas
    doesTransitions(testGraph, 1, 'b', [testGraph.transitions[1]])
  })
})

describe('Automata dib_dip-lambdaloop', () => {
  test('Valid states from q4', () => {
    const fullGraph = resolveGraph(dibDipLambdaloop as UnparsedGraph)
    const graph = new FSAGraph(
      new Node<FSAState>(new FSAState(fullGraph.initialState, false)),
      fullGraph.states.map(it => new FSAState(it.id, it.isFinal)),
      fullGraph.transitions
    )
    doesTransitions(graph, 4, 'p', [
      {
        id: 0,
        from: 4,
        to: 5,
        read: ['']
      }
    ])
  })
})
