import * as matchers from 'jest-extended'
expect.extend(matchers)
import { simulateFSA } from '../src'
import dib_dip_even_p from './graphs/dib_dip-even-p.json'
import dib_dip_lambdaloop from './graphs/dib_dip-lambdaloop.json'
import dib_dip_odd_p from './graphs/dib_dip-odd-p.json'
import dib_multipath from './graphs/dib-multipath.json'
import dib_odd_i from './graphs/dib-odd-i.json'
import dib_split_join from './graphs/dib-split-join.json'
import dib from './graphs/dib.json'

// Accepts dib or dip with even number of p's
test('dib_dip-even-p - Input: dib', () => {
  const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dib')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 2, 3])
  expect(read).toStrictEqual([null, 'd', 'i', 'b'])
})

test('dib_dip-even-p - Input: dip', () => {
  const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dip')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeFalse()
  expect(to).toStrictEqual([0, 1, 4, 5])
  expect(read).toStrictEqual([null, 'd', 'i', 'p'])
})

test('dib_dip-even-p - Input: dipp', () => {
  const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dipp')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 4, 5, 6])
  expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p'])
})

test('dib_dip-even-p - Input: dippp', () => {
  const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dippp')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeFalse()
  expect(to).toStrictEqual([0, 1, 4, 5, 4, 5])
  expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p', 'p'])
})

test('dib_dip-lambdaloop - Input: dibb', () => {
  const { accepted, trace } = simulateFSA(dib_dip_even_p, 'dibb')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeFalse()
  expect(to).toStrictEqual([0, 1, 2, 3])
  expect(read).toStrictEqual([null, 'd', 'i', 'b'])
})


// Accepts dib or dip (with implicit lambda loop on p path)
test('dib_dip-lambdaloop - Input: dib', () => {
  const { accepted, trace } = simulateFSA(dib_dip_lambdaloop, 'dib')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 2, 3])
  expect(read).toStrictEqual([null, 'd', 'i', 'b'])
})

test('dib_dip-lambdaloop - Input: dip', () => {
  const { accepted, trace } = simulateFSA(dib_dip_lambdaloop, 'dip')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 4, 5, 6])
  expect(read).toStrictEqual([null, 'd', 'i', '', 'p'])
})

test('dib_dip-lambdaloop - Input: dibb', () => {
  const { accepted, trace } = simulateFSA(dib_dip_lambdaloop, 'dibb')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeFalse()
  // Loops lambda in attempt to find possible transition 100 times
  // expect(to).toStrictEqual([0, 1, 2, 3])
  // expect(read).toStrictEqual([null, 'd', 'i', 'b'])
})

test('dib_dip-lambdaloop - Input: dipp', () => {
  const { accepted, trace } = simulateFSA(dib_dip_lambdaloop, 'dipp')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeFalse()
  // Loops lambda in attempt to find possible transition 100 times
  // expect(to).toStrictEqual([0, 1, 4, 5, 6])
  // expect(read).toStrictEqual([null, 'd', 'i', '', 'p'])
})

// Accepts dib or dip with odd number of p's
test('dib_dip-odd-p - Input: dib', () => {
  const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dib')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 2, 3])
  expect(read).toStrictEqual([null, 'd', 'i', 'b'])
})

test('dib_dip-odd-p - Input: dip', () => {
  const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dip')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 4, 5])
  expect(read).toStrictEqual([null, 'd', 'i', 'p'])
})

test('dib_dip-odd-p - Input: dippp', () => {
  const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dippp')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 4, 5, 4, 5])
  expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p', 'p'])
})

test('dib_dip-odd-p - Input: dibb', () => {
  const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dibb')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeFalse()
  expect(to).toStrictEqual([0, 1, 2, 3])
  expect(read).toStrictEqual([null, 'd', 'i', 'b'])
})

test('dib_dip-odd-p - Input: dipp', () => {
  const { accepted, trace } = simulateFSA(dib_dip_odd_p, 'dipp')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeFalse()
  expect(to).toStrictEqual([0, 1, 4, 5, 4])
  expect(read).toStrictEqual([null, 'd', 'i', 'p', 'p'])
})

// Accepts dib - has multiple paths
test('dib_multipath - Input: dib', () => {
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

test('dib_multipath - Input: dip', () => {
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


// Accepts dib with an odd number of i's
test('dib_odd_i - Input: dib', () => {
  const { accepted, trace } = simulateFSA(dib_odd_i, 'dib')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 2, 3])
  expect(read).toStrictEqual([null, 'd', 'i', 'b'])
})

test('dib_odd_i - Input: diiib', () => {
  const { accepted, trace } = simulateFSA(dib_odd_i, 'diiib')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 2, 1, 2, 3])
  expect(read).toStrictEqual([null, 'd', 'i', 'i', 'i', 'b'])
})

test('dib_odd_i - Input: diib', () => {
  const { accepted, trace } = simulateFSA(dib_odd_i, 'diib')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeFalse()
  expect(to).toStrictEqual([0, 1, 2, 1])
  expect(read).toStrictEqual([null, 'd', 'i', 'i'])
})

// Accepts dib - splits and rejoins at accepting state
test('dib_split_join - Input: dib', () => {
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

test('dib_split_join - Input: diib', () => {
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

// Accepts dib
test('dib - Input: dib', () => {
  const { accepted, trace } = simulateFSA(dib, 'dib')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeTrue()
  expect(to).toStrictEqual([0, 1, 2, 3])
  expect(read).toStrictEqual([null, 'd', 'i', 'b'])
})

test('dib - Input: dip', () => {
  const { accepted, trace } = simulateFSA(dib, 'dip')
  const to = trace.map(step => step.to)
  const read = trace.map(step => step.read)
  expect(accepted).toBeFalse()
  expect(to).toStrictEqual([0, 1, 2])
  expect(read).toStrictEqual([null, 'd', 'i'])
})