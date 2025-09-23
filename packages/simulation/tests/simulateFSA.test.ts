/// <reference types="jest-extended" />

import { simulateFSA } from '../../simulation/src'

import dibDipEvenp from './graphs/dib_dip-even-p.json'
import dibDipLambdaLoop from './graphs/dib_dip-lambdaloop.json'
import dibDipOddp from './graphs/dib_dip-odd-p.json'
import dibMultipath from './graphs/dib-multipath.json'
import dibOddi from './graphs/dib-odd-i.json'
import dibSplitJoin from './graphs/dib-split-join.json'
import dib from './graphs/dib.json'
import lambdaOnly from './graphs/lambda-only.json'
import dibEndLambda from './graphs/dib-end-lambda.json'
import exclusionTransitions from './graphs/exclusionTransitions.json'
import keyCollision from './graphs/fsaKeyCollision.json'
import { FSAModuleGraph } from 'frontend/src/types/ProjectTypes'

// Accepts dib or dip with even number of ps
describe('Automata dib_dip-even-p', () => {
  test('Accepts "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAModuleGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Rejects "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAModuleGraph, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p'])
  })

  test('Accepts "dipp" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAModuleGraph, 'dipp')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5, 6])
    expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p'])
  })

  test('Rejects "dippp" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAModuleGraph, 'dippp')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 4, 5, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p', 'p'])
  })
})

// Accepts dib or dip (with implicit lambda loop on p path)
describe('Automata dib_dip-lambdaloop', () => {
  test('Rejects "dibb" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAModuleGraph, 'dibb')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Accepts "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipLambdaLoop as FSAModuleGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Accepts "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipLambdaLoop as FSAModuleGraph, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5, 6])
    expect(read).toStrictEqual([null, 'd', 'i', '', 'p'])
  })

  test('Rejects "dibb"', () => {
    const { accepted } = simulateFSA(dibDipLambdaLoop as FSAModuleGraph, 'dibb')
    expect(accepted).toBeFalse()
  })

  test('Rejects "dipp"', () => {
    const { accepted } = simulateFSA(dibDipLambdaLoop as FSAModuleGraph, 'dipp')
    expect(accepted).toBeFalse()
  })
})

// Accepts dib or dip with odd number of p's
describe('Automata dib_dip-odd-p', () => {
  test('Accepts "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAModuleGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Accepts "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAModuleGraph, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p'])
  })

  test('Accepts "dippp" with corect trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAModuleGraph, 'dippp')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p', 'p'])
  })

  test('Rejects "dibb" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAModuleGraph, 'dibb')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Rejects "dipp" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAModuleGraph, 'dipp')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 4, 5, 4])
    expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p'])
  })
})

// Accepts dib - has multiple paths
describe('Automata dib_multipath', () => {
  test('Should accept "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibMultipath as FSAModuleGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toBeOneOf([
      [0, 1, 4, 5],
      [0, 1, 2, 3]
    ])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Should reject "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibMultipath as FSAModuleGraph, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toBeOneOf([
      [0, 1, 2],
      [0, 1, 4]
    ])
    expect(read).toStrictEqual([null, 'd', 'i'])
  })
})

// Accepts dib with an odd number of i's
describe('Automata dib_odd_i', () => {
  test('Should accept "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibOddi as FSAModuleGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Should accept "diiib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibOddi as FSAModuleGraph, 'diiib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'i', 'i', 'b'])
  })

  test('Should reject "diib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibOddi as FSAModuleGraph, 'diib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 1])
    expect(read).toStrictEqual([null, 'd', 'i', 'i'])
  })
})

// Accepts dib - splits and rejoins at accepting state
describe('Automata dib_split_join', () => {
  test('Accept "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibSplitJoin as FSAModuleGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toBeOneOf([
      [0, 1, 4, 3],
      [0, 1, 2, 3]
    ])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Reject "diib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibSplitJoin as FSAModuleGraph, 'diib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toBeOneOf([
      [0, 1, 4],
      [0, 1, 2]
    ])
    expect(read).toStrictEqual([null, 'd', 'i'])
  })
})

describe('Automata dib', () => {
  test('Accept "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib as FSAModuleGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Reject "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib as FSAModuleGraph, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, 'd', 'i'])
  })
})

describe('Automata lambda-only', () => {
  test('Accept "" with correct trace', () => {
    const { accepted, trace } = simulateFSA(lambdaOnly as FSAModuleGraph, '')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, '', ''])
  })

  test('Reject "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(lambdaOnly as FSAModuleGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, '', ''])
  })
})

describe('Automata dib-end-lambda', () => {
  test('Accept "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibEndLambda as FSAModuleGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3, 4])
    expect(read).toStrictEqual([null, 'd', 'i', 'b', ''])
  })

  test('Reject "dibbo" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibEndLambda as FSAModuleGraph, 'dibbo')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 3, 4])
    expect(read).toStrictEqual([null, 'd', 'i', 'b', ''])
  })

  test('Reject "di" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibEndLambda as FSAModuleGraph, 'di')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, 'd', 'i'])
  })
})

// Accepts 3-character strings not starting with 'a', without '123' as the second character,
// and ending in a non-alphabetical character
describe('Exclusion automata', () => {
  test('Rejects "abc" with correct trace', () => {
    const { accepted, trace } = simulateFSA(exclusionTransitions as FSAModuleGraph, 'abc')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0])
    expect(read).toStrictEqual([null])
  })

  test('Rejects "b100" with correct trace', () => {
    const { accepted, trace } = simulateFSA(exclusionTransitions as FSAModuleGraph, 'b100')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1])
    expect(read).toStrictEqual([null, 'b'])
  })

  test('Rejects "123" with correct trace', () => {
    const { accepted, trace } = simulateFSA(exclusionTransitions as FSAModuleGraph, '123')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1])
    expect(read).toStrictEqual([null, '1'])
  })

  test('Rejects "fsa" with correct trace', () => {
    const { accepted, trace } = simulateFSA(exclusionTransitions as FSAModuleGraph, 'fsa')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, 'f', 's'])
  })

  test('Accepts "101" with correct trace', () => {
    const { accepted, trace } = simulateFSA(exclusionTransitions as FSAModuleGraph, '101')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, '1', '0', '1'])
  })

  test("id and remaining don't create key collisions", () => {
    const { accepted } = simulateFSA(keyCollision as FSAModuleGraph, '000')
    expect(accepted).toBeTrue()
  })
})
