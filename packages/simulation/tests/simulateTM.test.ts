import a2b2a from './graphs/a2b2a.json'
import shuffleLeft from './graphs/shuffleLeft.json'
import { simulateTM } from '../src/simulateTM'
import { TMExecutionResult, TMGraphIn } from '../src/graph'
import { describe } from 'node:test'

// Shim to allow for structuredClone alternative (See https://github.com/jsdom/jsdom/issues/3363)
// This should work for our cases
global.structuredClone = jest.fn(val => {
  return JSON.parse(JSON.stringify(val))
})

function simulate (graph: TMGraphIn, input: string): TMExecutionResult {
  return simulateTM(graph, { pointer: 0, trace: input ? input.split('') : [''] })
}

describe('Machine that moves left', () => {
  test('Machine halts', () => {
    const result = simulate(shuffleLeft, 'AAAZ')
    expect(result.tape).toMatchObject({ pointer: 3, trace: ['A', 'A', 'A', 'Z'] })
    expect(result.halted).toBeTrue()
  })
})

describe('Turing machine that converts A to B then resets tape', () => {
  test('Accepts AA', () => {
    const result = simulate(a2b2a, 'AA')
    expect(result.tape).toMatchObject({ pointer: 0, trace: ['A', 'A', ''] })
    expect(result.halted).toBeTrue()
  })
})
