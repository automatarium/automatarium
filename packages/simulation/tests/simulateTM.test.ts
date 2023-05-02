import a2b2a from './graphs/a2b2a.json'
import shuffleLeft from './graphs/shuffleLeft.json'
import bepsi from './graphs/bepsi.json'
import { simulateTM } from '../src/simulateTM'
import { TMExecutionResult } from '../src/graph'
import { describe } from 'node:test'
import { TMProjectGraph } from 'frontend/src/types/ProjectTypes'

// Shim to allow for structuredClone alternative (See https://github.com/jsdom/jsdom/issues/3363)
// This should work for our cases
// global.structuredClone = jest.fn(val => {
//   return JSON.parse(JSON.stringify(val))
// })

function simulate (graph, input: string): TMExecutionResult {
  return simulateTM(graph as TMProjectGraph, input)
}

describe('Machine that moves left', () => {
  test('Machine halts', () => {
    const result = simulate(shuffleLeft, 'AAAZ')
    expect(result.tape).toMatchObject({ pointer: 3, trace: ['A', 'A', 'A', 'Z'] })
    expect(result.accepted).toBeTrue()
  })
})

describe('Machine that converts A to B then resets tape', () => {
  test('Accepts AA', () => {
    const result = simulate(a2b2a, 'AA')
    expect(result.tape).toMatchObject({ pointer: 0, trace: ['A', 'A', ''] })
    expect(result.accepted).toBeTrue()
  })
})

describe('Machine that must have Bs either side and can have Cs in the middle', () => {
  test('Accepts BB', () => {
    const result = simulate(bepsi, 'BB')
    expect(result.accepted).toBeTrue()
  })

  test('Accepts BCB', () => {
    const result = simulate(bepsi, 'BB')
    expect(result.accepted).toBeTrue()
  })

  test('Tracing is correct for BCB', () => {
    const result = simulate(bepsi, 'BCB')
    expect(result.tape).toMatchObject({ pointer: 3, trace: ['B', 'C', 'A'] })
    expect(result.trace).toMatchObject([
      { to: 0, tape: { pointer: 0, trace: ['B', 'C', 'B'] } },
      { to: 1, tape: { pointer: 1, trace: ['B', 'C', 'B'] } },
      { to: 1, tape: { pointer: 2, trace: ['B', 'C', 'B'] } },
      { to: 2, tape: { pointer: 3, trace: ['B', 'C', 'A'] } }
    ])
    expect(result.accepted).toBeTrue()
  })
})
