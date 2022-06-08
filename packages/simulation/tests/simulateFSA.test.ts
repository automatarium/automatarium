/// <reference types="jest-extended" />

import { simulateFSA } from '../src'

import dib_dip_even_p from './graphs/dib_dip-even-p.json'
import dib_dip_lambdaloop from './graphs/dib_dip-lambdaloop.json'
import dib_dip_odd_p from './graphs/dib_dip-odd-p.json'
import dib_multipath from './graphs/dib-multipath.json'
import dib_odd_i from './graphs/dib-odd-i.json'
import dib_split_join from './graphs/dib-split-join.json'
import dib from './graphs/dib.json'
import lambda_only from './graphs/lambda-only.json'
import dib_end_lambda from './graphs/dib-end-lambda.json'

// Accepts dib or dip with even number of ps
describe('Automata dib_dip-even-p', () => {
  test('Accepts "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Rejects "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p'])
  })

  test('Accepts "dipp" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dipp')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5, 6])
    expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p'])
  })

  test('Rejects "dippp" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dippp')
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
    const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dibb')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Accepts "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_lambdaloop, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Accepts "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_lambdaloop, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5, 6])
    expect(read).toStrictEqual([null, 'd', 'i', '', 'p'])
  })

  test('Rejects "dibb"', () => {
    const { accepted } = simulateFSA(dib_dip_lambdaloop, 'dibb')
    expect(accepted).toBeFalse()
  })

  test('Rejects "dipp"', () => {
    const { accepted } = simulateFSA(dib_dip_lambdaloop, 'dipp')
    expect(accepted).toBeFalse()
  })
})

// Accepts dib or dip with odd number of p's
describe('Automata dib_dip-odd-p', () => {
  test('Accepts "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Accepts "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p'])
  })

  test('Accepts "dippp" with corect trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dippp')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 4, 5, 4, 5])
    expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p', 'p'])
  })

  test('Rejects "dibb" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dibb')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Rejects "dipp" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dipp')
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
    const { accepted, trace } = simulateFSA(dib_multipath, 'dib')
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
    const { accepted, trace } = simulateFSA(dib_multipath, 'dip')
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
    const { accepted, trace } = simulateFSA(dib_odd_i, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Should accept "diiib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_odd_i, 'diiib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'i', 'i', 'b'])
  })

  test('Should reject "diib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_odd_i, 'diib')
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
    const { accepted, trace } = simulateFSA(dib_split_join, 'dib')
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
    const { accepted, trace } = simulateFSA(dib_split_join, 'diib')
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
    const { accepted, trace } = simulateFSA(dib, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3])
    expect(read).toStrictEqual([null, 'd', 'i', 'b'])
  })

  test('Reject "dip" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib, 'dip')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, 'd', 'i'])
  })
})

describe('Automata lambda-only', () => {
  test('Accept "" with correct trace', () => {
    const { accepted, trace } = simulateFSA(lambda_only, '')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, '', '']) 
  })

  test('Reject "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(lambda_only, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, '', ''])
  })
})

describe('Automata dib-end-lambda', () => {
  test('Accept "dib" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_end_lambda, 'dib')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeTrue()
    expect(to).toStrictEqual([0, 1, 2, 3, 4])
    expect(read).toStrictEqual([null, 'd', 'i', 'b', '']) 
  })

  test('Reject "dibbo" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_end_lambda, 'dibbo')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2, 3, 4])
    expect(read).toStrictEqual([null, 'd', 'i', 'b', '']) 
  })

  test('Reject "di" with correct trace', () => {
    const { accepted, trace } = simulateFSA(dib_end_lambda, 'di')
    const to = trace.map(step => step.to)
    const read = trace.map(step => step.read)
    expect(accepted).toBeFalse()
    expect(to).toStrictEqual([0, 1, 2])
    expect(read).toStrictEqual([null, 'd', 'i']) 
  })
})
