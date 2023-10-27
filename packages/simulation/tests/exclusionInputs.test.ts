/// <reference types="jest-extended" />

import { extractSymbolsToExclude, formatExclusionInput } from 'frontend/src/util/stringManipulations'

/**
 * Check that an input is expanded how we expect it to
 * @param input The string that we are testing
 * @param expected What we expect to extract from the input
 */
const expectExtraction = (input: string, expected: string[]) => {
  expect(extractSymbolsToExclude(input)).toEqual(expected)
}

const expectExclusionFormat = (input: string, expected: string) => {
  expect(formatExclusionInput(input)).toEqual(expected)
}

describe('Extract exclusion symbols', () => {
  test('Should extract letter preceded by exclusion operator into a string array', () => {
    expectExtraction('!a', ['a'])
  })

  test('Should extract number preceded by exclusion operator into a string array', () => {
    expectExtraction('!2', ['2'])
  })

  test('Should extract special character preceded by exclusion operator into a string array', () => {
    expectExtraction('!*', ['*'])
  })

  test('Should extract letters preceded by exclusion operator into a string array', () => {
    // Ranges are expanded to this format prior to being extracted
    expectExtraction('!abcd', ['a', 'b', 'c', 'd'])
  })
})

describe('Exclusion extraction edge cases', () => {
  test('Lone exclusion operator should return empty array', () => {
    expectExtraction('!', [])
  })

  test('Lambda input should return empty array', () => {
    expectExtraction('', [])
  })

  test('Exclusion operator before unpaired bracket should return array containing [', () => {
    expectExtraction('![ ', ['['])
  })
})

describe('Extract excluded symbols from range', () => {
  test('Should extract an array containing a, b, c from ![a-c]', () => {
    expectExtraction('![a-c]', ['a', 'b', 'c'])
  })

  test('Should extract an array containing 5, 6, 7, 8 from ![5-8]', () => {
    expectExtraction('![5-8]', ['5', '6', '7', '8'])
  })
})

describe('Extract excluded symbols from expression in parentheses', () => {
  test('Should extract an array containing a and b from !(a&b)', () => {
    expectExtraction('!(a&b)', ['a', 'b'])
  })

  test('Should extract an array containing a,b,c,d,e from !(a&b&c&d&e)', () => {
    expectExtraction('!(a&b&c&d&e)', ['a', 'b', 'c', 'd', 'e'])
  })
})

describe('Format exclusions', () => {
  test('Should only return the first excluded symbol', () => {
    expectExclusionFormat('!a!b', '!a')
  })

  test('No change to correctly formatted single character exclusion', () => {
    expectExclusionFormat('!x', '!x')
  })

  test('No change to correctly formatted exclusion expression', () => {
    expectExclusionFormat('!(1&2&3)', '!(1&2&3)')
  })

  test('Extraneous characters should be removed', () => {
    expectExclusionFormat('7b!a5', '!a')
  })

  test('Extraneous characters should be removed around expression', () => {
    expectExclusionFormat('7b!(8&b)a5', '!(8&b)')
  })
})

describe('Format exclusion range', () => {
  test('Exclusion operator should be kept in front of range', () => {
    expectExclusionFormat('![0-4]', '![0-4]')
  })

  test('Should remove any excluded range beyond the first', () => {
    expectExclusionFormat('![a-d]![e-g]', '![a-d]')
  })

  test('Should remove any extraneous characters around excluded range', () => {
    expectExclusionFormat('abc![x-z]*?', '![x-z]')
  })
})

describe('Format exclusion edge cases', () => {
  test('Should only return one exclusion operator when multiple are present', () => {
    expectExclusionFormat('!!!!!', '!')
  })

  test('Parentheses containing values not separated by & should return !(', () => {
    expectExclusionFormat('!(ab)', '!(')
  })

  test('Unclosed parenthesis should return !(', () => {
    expectExclusionFormat('!(a&b', '!(')
  })
})
