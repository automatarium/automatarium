import { simulateFSA } from '../src'
import dibnfa1 from './graphs/dib-nfa.json'
import dibnfa2 from './graphs/dib-nfa2.json'
import dibnfa3 from './graphs/dib-nfa3.json'
import dibnfa4 from './graphs/dib-nfa4.json'

test('dib-nfa - Accepts: dib - Multiple paths for i - Input: dib', () => {
  const result = simulateFSA(dibnfa1, 'dib')
  expect(result.accepted).toBe(true)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2', 'q3'])
})

test('dib-nfa - Accepts: dib - Multiple paths for i - Input: di', () => {
  const result = simulateFSA(dibnfa1, 'di')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2'])
})

test('dib-nfa - Accepts: dib - Multiple paths for i - Input: dibs', () => {
  const result = simulateFSA(dibnfa1, 'dibs')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2', 'q3'])
})

test('dib-nfa - Accepts: dib - Multiple paths for i - Input: a', () => {
  const result = simulateFSA(dibnfa1, 'a')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0'])
})

test('dib-nfa - Accepts: dib - Multiple paths for i - Input: ', () => {
  const result = simulateFSA(dibnfa1, '')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0'])
})

test('dib-nfa2 - Accepts: dib - Multiple paths for i and b - Input: dib', () => {
  const result = simulateFSA(dibnfa2, 'dib')
  expect(result.accepted).toBe(true)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2', 'q3'])
})

test('dib-nfa2 - Accepts: dib - Multiple paths for i and b - Input: diib', () => {
  const result = simulateFSA(dibnfa2, 'diib')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2'])
})

test('dib-nfa2 - Accepts: dib - Multiple paths for i and b - Input: di', () => {
  const result = simulateFSA(dibnfa2, 'di')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2'])
})

test("dib-nfa3 - Accepts: dib or dip with an odd number of p's - Input: dib", () => {
  const result = simulateFSA(dibnfa3, 'dib')
  expect(result.accepted).toBe(true)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2', 'q3'])
})

test("dib-nfa3 - Accepts: dib or dip with an odd number of p's - Input: di", () => {
  const result = simulateFSA(dibnfa3, 'di')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2'])
})

test("dib-nfa3 - Accepts: dib or dip with an odd number of p's - Input: dip", () => {
  const result = simulateFSA(dibnfa3, 'dip')
  expect(result.accepted).toBe(true)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q4', 'q5'])
})

test("dib-nfa3 - Accepts: dib or dip with an odd number of p's - Input: dip", () => {
  const result = simulateFSA(dibnfa3, 'dip')
  expect(result.accepted).toBe(true)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q4', 'q5'])
})

test("dib-nfa3 - Accepts: dib or dip with an odd number of p's - Input: dipp", () => {
  const result = simulateFSA(dibnfa3, 'dipp')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q4', 'q5', 'q4'])
})

test("dib-nfa3 - Accepts: dib or dip with an odd number of p's - Input: dippp", () => {
  const result = simulateFSA(dibnfa3, 'dippp')
  expect(result.accepted).toBe(true)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q4', 'q5', 'q4', 'q5'])
})

test("dib-nfa4 - Accepts: dib or dip with an even number of p's - Input: di", () => {
  const result = simulateFSA(dibnfa4, 'di')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2'])
})

test("dib-nfa4 - Accepts: dib or dip with an even number of p's - Input: dib", () => {
  const result = simulateFSA(dibnfa4, 'dib')
  expect(result.accepted).toBe(true)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q2', 'q3'])
})

test("dib-nfa4 - Accepts: dib or dip with an even number of p's greater than 0 - Input: dip", () => {
  const result = simulateFSA(dibnfa4, 'dip')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q4', 'q5'])
})

test("dib-nfa4 - Accepts: dib or dip with an even number of p's greater than 0 - Input: dipp", () => {
  const result = simulateFSA(dibnfa4, 'dipp')
  expect(result.accepted).toBe(true)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q4', 'q5', 'q6'])
})

test("dib-nfa4 - Accepts: dib or dip with an even number of p's greater than 0 - Input: dippp", () => {
  const result = simulateFSA(dibnfa4, 'dippp')
  expect(result.accepted).toBe(false)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q4', 'q5', 'q4', 'q5'])
})

test("dib-nfa4 - Accepts: dib or dip with an even number of p's greater than 0 - Input: dipppp", () => {
  const result = simulateFSA(dibnfa4, 'dipppp')
  expect(result.accepted).toBe(true)
  expect(result.trace).toStrictEqual(['q0', 'q1', 'q4', 'q5', 'q4', 'q5', 'q6'])
})
