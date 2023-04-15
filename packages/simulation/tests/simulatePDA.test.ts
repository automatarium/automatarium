import evenAs from './graphs/evenAs.json'
import { simulatePDA } from '../src'

describe('Automata that accepts an even number of A', () => {
  test('Accepts lambda', () => {
    const result = simulatePDA(evenAs, '')
    expect(result.accepted).toBeTrue()
  })

  test('Accepts AA', () => {
    const result = simulatePDA(evenAs, 'AA')
    expect(result.trace.map(it => it.currentStack)).toEqual([
      [], // Initial
      ['A'], // First A read
      ['A'], // Lambda transition
      [] // Second A read
    ])
    expect(result.accepted).toBeTrue()
  })

  test('Rejects AAA', () => {
    const result = simulatePDA(evenAs, 'AAA')
    expect(result.accepted).toBeFalse()
  })
})
