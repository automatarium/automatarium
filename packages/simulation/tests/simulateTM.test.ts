import a2b2a from './graphs/a2b2a.json'
import { simulateTM } from '../src/simulateTM'
import { TMExecutionResult, TMGraphIn } from '../src/graph'

function simulate (graph: TMGraphIn, input: string): TMExecutionResult {
  return simulateTM(graph, { pointer: 0, trace: input ? input.split('') : [''] })
}
const result = simulate(a2b2a, 'AA')

describe('Turing machine that converts A to B then resets tape', () => {
  test('Accepts AA', () => {
    expect(result.halted).toBeTrue()
  })
})
