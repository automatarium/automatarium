import { parseRead } from '../src'

test('Parse literals', () => {
  expect(parseRead("abc")).toEqual([{
    kind: 'literal', value: 'a'
  }, {
    kind: 'literal', value: 'b'
  }, {
    kind: 'literal', value: 'c'
  }])
})

test('Parse range', () => {
  expect(parseRead("[a-z]")).toEqual([{
    kind: 'range',
    start: 'a',
    stop: 'z'
  }])
})

test('Parse range and literals', () => {
  expect(parseRead("a[b-z]")).toEqual([{
    kind: 'literal',
    value: 'a',
  }, {
    kind: 'range',
    start: 'b',
    stop: 'z'
  }])
})

test('Parse empty', () => {
  expect(parseRead("")).toEqual([])
})

test('Invalid range syntax', () => {
  expect(() => parseRead("][")).toThrow()
  expect(() => parseRead("-9]")).toThrow()
  expect(() => parseRead("[-]")).toThrow()
  expect(() => parseRead("[a-")).toThrow()
})

test('Invalid range order', () => {
  expect(() => parseRead("[z-a]")).toThrow()
  expect(() => parseRead("[9-0]")).toThrow()
})

test('Invalid duplicated symbols in range', () => {
  expect(() => parseRead("[a-a]")).toThrow()
})
