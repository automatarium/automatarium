/// <reference types="jest-extended" />

import { expandReadSymbols } from '../src'

const expectExpansion = (input: string, expected: string) => {
  expect(expandReadSymbols(input)).toEqual(expected)
}

describe('Expand literals', () => {
  test('Should pass through abc', () => {
    expectExpansion('abc', 'abc')
  })

  test('Should de-dupe abb', () => {
    expectExpansion('abb', 'ab')
  })

  test('Should pass through !@#$%^&*()_+-=', () => {
    expectExpansion('!@#$%^&*()_+-=', '!#$%&()*+-=@^_')
  })

  test('Return empty for zero-length string', () => {
    expectExpansion('', '')
  })
})

describe('Expand ranges', () => {
  test('Should expand [a-z]', () => {
    expectExpansion('[a-z]', 'abcdefghijklmnopqrstuvwxyz')
  })

  test('Should expand [a-Z]', () => {
    expectExpansion('[a-Z]', 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  })

  test('Should expand [a-c][e-g]', () => {
    expectExpansion('[a-c][e-g]', 'abcefg')
  })

  test('Should expand [a-z][A-Z]', () => {
    expectExpansion('[a-z][A-Z]', 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  })

  test('Should expand [z-a]', () => {
    expectExpansion('[z-a]', '')
  })

  test('Should expand [a-a]', () => {
    expectExpansion('[a-a]', 'a')
  })

  test('Should expand aa', () => {
    expectExpansion('aa', 'a')
  })

  test('Should expand a[a-z]', () => {
    expectExpansion('a[a-z]', 'abcdefghijklmnopqrstuvwxyz')
  })

  test('Should expand a[a-z]a', () => {
    expectExpansion('a[a-z]a', 'abcdefghijklmnopqrstuvwxyz')
  })

  test('Should expand [0-9]', () => {
    expectExpansion('[0-9]', '0123456789')
  })

  test('Should expand [0-5]', () => {
    expectExpansion('[0-5]', '012345')
  })

  test('Should expand [0-3][5-7]', () => {
    expectExpansion('[0-3][5-7]', '0123567')
  })

  test('Should expand [0-3][0-4]', () => {
    expectExpansion('[0-3][0-4]', '01234')
  })

  test('Should expand [9-0]', () => {
    expectExpansion('[9-0]', '')
  })

  test('Should expand 0[9-0]', () => {
    expectExpansion('0[9-0]', '0')
  })

  test('Should expand [0-9][a-Z]', () => {
    expectExpansion('[0-9][a-Z]', '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  })

  test('Should expand [0-z]', () => {
    expectExpansion('[0-z]', '0123456789abcdefghijklmnopqrstuvwxyz')
  })

  test('Should expand [0-Z]', () => {
    expectExpansion('[0-Z]', '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  })

  test('Should expand empty string', () => {
    expectExpansion('', '')
  })
})
