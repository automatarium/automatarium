/// <reference types="jest-extended" />

import { closureWithPredicate, resolveGraph, State } from '../src'
import dib from './graphs/dib.json'
import dib_multipath from './graphs/dib-multipath.json'
import dib_dip_lambdaloop from './graphs/dib_dip-lambdaloop.json'
import abba from './graphs/abba.json'
import disconnected from './graphs/disconnected.json'

describe('Automata dib', () => {
  const graph = resolveGraph(dib)
  
  test('Include all transitions', () => {
    const startID = 0
    const closure = closureWithPredicate(graph, startID, () => true)
    const stateIDs = Array.from(closure).map(([state, path]) => state)
    expect(stateIDs).toIncludeSameMembers(graph.states.map(s => s.id).filter(id => id !== startID))
  })

  test('Include all transitions with correct traces', () => {
    const startID = 0
    const closure = closureWithPredicate(graph, startID, () => true)
    const stateTracePairs = Array.from(closure).map(([state, path]) => [state, path.map(tr => tr.read).join('')])
    expect(stateTracePairs).toIncludeSameMembers([
      [1, 'd'],
      [2, 'di'],
      [3, 'dib']
    ])
  })
  
  test('Restrict by specific read value', () => {
    const startID = 0
    const closure = closureWithPredicate(graph, startID, transition => transition.read.includes('d'))
    const stateIDs = Array.from(closure).map(([state, path]) => state)
    expect(stateIDs).toIncludeSameMembers([1])
  })
})

describe('Automata dib-multipath', () => {
  const graph = resolveGraph(dib_multipath)
  
  test('Include all transitions', () => {
    const startID = 0
    const closure = closureWithPredicate(graph, startID, () => true)
    const stateIDs = Array.from(closure).map(([state, path]) => state)
    expect(stateIDs).toIncludeSameMembers(graph.states.map(s => s.id).filter(id => id !== startID))
  })

  test('Include bottom path only', () => {
    const startID = 4
    const closure = closureWithPredicate(graph, startID, () => true)
    const stateIDs = Array.from(closure).map(([state, path]) => state)
    expect(stateIDs).toIncludeSameMembers([5])
  })

  test('Include all transitions with correct traces', () => {
    const startID = 0
    const closure = closureWithPredicate(graph, startID, () => true)
    const stateTracePairs = Array.from(closure).map(([state, path]) => [state, path.map(tr => tr.read).join('')])
    expect(stateTracePairs).toIncludeSameMembers([
      [1, 'd'],
      [2, 'di'],
      [3, 'dib'],
      [4, 'di'],
      [5, 'dib'],
    ])
  })
})

describe('Automata dib_dip-lambdaloop', () => {
  const graph = resolveGraph(dib_dip_lambdaloop)
  
  test('Include all transitions', () => {
    const startID = 0
    const closure = closureWithPredicate(graph, startID, () => true)
    const stateIDs = new Set(Array.from(closure).map(([state, path]) => state))
    expect(Array.from(stateIDs)).toIncludeSameMembers(graph.states.map(s => s.id).filter(id => id !== startID))
  })
})

describe('Reachability', () => {
  test('Unreachable final states', () => {
    const graph = resolveGraph(disconnected)
    const closure = closureWithPredicate(graph, 0, () => true)
    const states = Array.from(closure).map(([stateID, path]) => graph.states.find(s => s.id === stateID) as State)
    expect(states.some(s => s.isFinal)).toBeFalse()
  })

  test('Unreachable final states due to predicate', () => {
    const graph = resolveGraph(abba) 
    const closure = closureWithPredicate(graph, 0, transition => !transition.read.includes('b'))
    const states = Array.from(closure).map(([stateID, path]) => graph.states.find(s => s.id === stateID) as State)
    expect(states.some(s => s.isFinal)).toBeFalse()
  })
})
