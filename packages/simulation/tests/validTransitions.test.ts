import { validTransitions, resolveGraph } from '../src'
import { FSAGraph } from '../src/types.d'

import dib_dip_lambdaloop from './graphs/dib_dip-lambdaloop.json'

describe('Non-lambda transitions', () => {
  test('Identify single transition', () => {
    const testGraph: FSAGraph = {
      initialState: 0,
      states: [{
        id: 0,
        isFinal: false
      }, {
        id: 1,
        isFinal: true
      }],
      transitions: [{
        id: 0,
        from: 0,
        to: 1,
        read: ['a'],
      }],
    }
    const valid = validTransitions(testGraph, 0, 'a').map(v => v.transition)
    expect(valid).toEqual([testGraph.transitions[0]])
  })

  test('Identify two possible transitions', () => {
    const testGraph: FSAGraph = {
      initialState: 0,
      states: [{
        id: 0,
        isFinal: false
      }, {
        id: 1,
        isFinal: true
      }],
      transitions: [{
        id: 0,
        from: 0,
        to: 1,
        read: ['a'],
      }, {
        id: 1,
        from: 0,
        to: 1,
        read: ['a', 'b']
      }],
    }
    const valid = validTransitions(testGraph, 0, 'a').map(v => v.transition)
    expect(valid).toEqual(testGraph.transitions)
  })

  test('Identify one of two possible transitions', () => {
    const testGraph: FSAGraph = {
      initialState: 0,
      states: [{
        id: 0,
        isFinal: false
      }, {
        id: 1,
        isFinal: true
      }],
      transitions: [{
        id: 0,
        from: 0,
        to: 1,
        read: ['a'],
      }, {
        id: 1,
        from: 0,
        to: 1,
        read: ['b']
      }],
    }
    const valid = validTransitions(testGraph, 0, 'a').map(v => v.transition)
    expect(valid).toEqual([testGraph.transitions[0]])
  })
})

describe('Lambda transitions', () => {
  test('Identify single indirect transition', () => {
    const testGraph: FSAGraph = {
      initialState: 0,
      states: [{
        id: 0,
        isFinal: false,
      }, {
        id: 1,
        isFinal: false,
      }, { 
        id: 2,
        isFinal: false,
      }, {
        id: 3,
        isFinal: true,
      }],
      transitions: [{
        id: 0,
        from: 0,
        to: 1,
        read: ['a'],
      }, {
        id: 1,
        from: 1,
        to: 2,
        read: [],
      }, {
        id: 2,
        from: 2,
        to: 3,
        read: ['b'],
      }],
    }
    const valid_0 = validTransitions(testGraph, 0, 'a').map(v => v.transition)
    const valid_1 = validTransitions(testGraph, 1, 'b').map(v => v.transition)
    expect(valid_0).toEqual([testGraph.transitions[0]])
    expect(valid_1).toEqual([testGraph.transitions[2]])
  })
})

describe('Automata dib_dip-lambdaloop', () => {
  test('Valid states from q4', () => {
    const graph = resolveGraph(dib_dip_lambdaloop)
    const valid = validTransitions(graph, 4, 'p')
    expect(valid).toEqual([
      {
        transition: graph.transitions.find(tr => tr.id === 6),
        trace: [{ to: 5, read: '' }, { to: 6, read: 'p' }]
      }
    ])
  })
})
