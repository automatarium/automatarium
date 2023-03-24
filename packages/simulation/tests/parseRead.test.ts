import { expandReadSymbols, RANGE_VALS } from '../src'

const ALPHABET = RANGE_VALS.slice(10, 36)

function expand (input: string): jest.JestMatchers<string[]> {
  return expect(expandReadSymbols(input))
}

describe('Expansion of read symbols', () => {
  test('Literals dont get expanded', () => {
    expand('abc').toEqual(['a', 'b', 'c'])
  })

  test('Parse range', () => {
    expand('[a-z]').toEqual(ALPHABET)
  })

  test('Parse range and literals', () => {
    expand('a[b-z]').toEqual(ALPHABET)
  })

  test('Parse empty', () => {
    expand('').toBeEmpty()
  })

  test('Edge cases', () => {
    const tests = ['][', '-9]', '[-]', '[a-']
    for (const test of tests) {
      expand(test).toIncludeSameMembers(test.split(''))
    }
  })

  test('Invalid order', () => {
    expand('[z-a]').toBeEmpty()
    expand('[9-0]').toBeEmpty()
  })

  test('Invalid duplicated symbols in range', () => {
    expand('[a-a]').toEqual(['a'])
  })
})
