import { ReadSymbol } from './types'

const RANGE_REG = /\[(\w-\w)\]/g
const LITERAL_REG = /[\S]/
const RANGE_VALS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const makeCharRange = (start:ReadSymbol, stop:ReadSymbol): ReadSymbol[] => {
  const startChar = RANGE_VALS.indexOf(start)
  const stopChar = RANGE_VALS.indexOf(stop)
  return Array.from({ length: stopChar - startChar + 1 })
    .map((_, i) => RANGE_VALS[startChar + i])
}

const parseRead = (read:string): ReadSymbol[] => {
  // Find ranges
  const rangeStrings = read.match(RANGE_REG) ?? []
  read = read.replace(RANGE_REG, '')
  const ranges = rangeStrings
    .map(str => {
      const [start, stop] = str.split('-')
      return makeCharRange(start.slice(1), stop.slice(0, -1))
    })
  const rangeSymbols = ranges
    .reduce((acc, v) => [...acc, ...v], [])
  
  // Find literals
  const symbols = read
    .split('')
    .filter(s => LITERAL_REG.test(s))

  return Array.from(new Set([
    ...symbols,
    ...rangeSymbols,
  ])).sort()
}

export default parseRead
