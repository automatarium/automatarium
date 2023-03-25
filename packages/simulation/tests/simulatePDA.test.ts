import evenAs from './graphs/evenAs.json'
import { simulatePDA } from '../src'

describe('Automata that accept even number of A', () => {
  test('Accepts lambda', () => {
    const result = simulatePDA(evenAs, '')
    expect(result.accepted).toBeTrue()
  })

  test('Accepts AA', () => {
    const result = simulatePDA(evenAs, 'AA')
    expect(result.accepted).toBeTrue()
  })

  test('Rejects AAA', () => {
    const result = simulatePDA(evenAs, 'AAA')
    expect(result.accepted).toBeFalse()
  })
})
