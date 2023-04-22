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
import { FSAProjectGraph } from 'frontend/src/types/ProjectTypes'

// Accepts dib or dip with even number of ps
describe('Automata dib_dip-even-p', () => {
  test('Accepts "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAProjectGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Rejects "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAProjectGraph, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p'])
  })

  test('Accepts "dipp" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAProjectGraph, 'dipp')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5, 6])
    expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p'])
  })

  test('Rejects "dippp" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAProjectGraph, 'dippp')
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
    const { accepted, trace } = simulateFSA(dibDipEvenp as FSAProjectGraph, 'dibb')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Accepts "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipLambdaLoop as FSAProjectGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Accepts "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipLambdaLoop as FSAProjectGraph, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5, 6])
    expect(read).toStrictEqual([null, 'd', 'i', '', 'p'])
  })

  test('Rejects "dibb"', () => {
    const { accepted } = simulateFSA(dibDipLambdaLoop as FSAProjectGraph, 'dibb')
    expect(accepted).toBeFalse()
  })

  test('Rejects "dipp"', () => {
    const { accepted } = simulateFSA(dibDipLambdaLoop as FSAProjectGraph, 'dipp')
    expect(accepted).toBeFalse()
  })
})

// Accepts dib or dip with odd number of p's
describe('Automata dib_dip-odd-p', () => {
  test('Accepts "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAProjectGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Accepts "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAProjectGraph, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p'])
  })

  test('Accepts "dippp" with corect trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAProjectGraph, 'dippp')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p', 'p'])
  })

  test('Rejects "dibb" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAProjectGraph, 'dibb')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Rejects "dipp" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibDipOddp as FSAProjectGraph, 'dipp')
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
    const { accepted, trace } = simulateFSA(dibMultipath as FSAProjectGraph, 'dib')
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
    const { accepted, trace } = simulateFSA(dibMultipath as FSAProjectGraph, 'dip')
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
    const { accepted, trace } = simulateFSA(dibOddi as FSAProjectGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Should accept "diiib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibOddi as FSAProjectGraph, 'diiib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'i', 'i', 'b'])
  })

  test('Should reject "diib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibOddi as FSAProjectGraph, 'diib')
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
    const { accepted, trace } = simulateFSA(dibSplitJoin as FSAProjectGraph, 'dib')
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
    const { accepted, trace } = simulateFSA(dibSplitJoin as FSAProjectGraph, 'diib')
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
    const { accepted, trace } = simulateFSA(dib as FSAProjectGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Reject "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib as FSAProjectGraph, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, 'd', 'i'])
  })
})

describe('Automata lambda-only', () => {
  test('Accept "" with correct trace', () => {
    const { accepted, trace } = simulateFSA(lambdaOnly as FSAProjectGraph, '')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, '', ''])
  })

  test('Reject "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(lambdaOnly as FSAProjectGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, '', ''])
  })
})

describe('Automata dib-end-lambda', () => {
  test('Accept "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibEndLambda as FSAProjectGraph, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3, 4])
    expect(read).toStrictEqual([null, 'd', 'i', 'b', ''])
  })

  test('Reject "dibbo" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibEndLambda as FSAProjectGraph, 'dibbo')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 3, 4])
    expect(read).toStrictEqual([null, 'd', 'i', 'b', ''])
  })

  test('Reject "di" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dibEndLambda as FSAProjectGraph, 'di')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, 'd', 'i'])
  })
})
