import { FSAGraph, ReadSymbol, UnresolvedFSAGraph } from './types'

const RANGE_REG = /\[(\w-\w)\]/g
const LITERAL_REG = /[\S]/
export const RANGE_VALS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/**
 * Resolve a graph by expanding and de-duping transitions read strings.
 *
 * @param graph - FSA Graph object to resolve.
 * @returns The resolved graph
 */
export const resolveGraph = (graph: UnresolvedFSAGraph): FSAGraph => {
  // Resolve graph transitions
  const transitions = graph.transitions
    .filter(transition => transition !== undefined && transition.read !== undefined)
    .map(transition => ({...transition, read: expandReadSymbols(transition.read)}))
  return { ...graph, transitions }
}

/**
 * Create an array of characters in between the two characters. Uses 0-9a-zA-Z ordering.
 *
 * @param start - Character used as start of range
 * @param stop - Character used as end of range
 * @returns Array of characters in range. Includes the start and stop characters.
 * 
 * @example Create list of all digit characters
 * ```ts
 * const digits = makeCharRange('0', '9')
 * ```
 * 
 * @example Create list of all lowercase and uppercase letters
 * ```ts
 * const letters = makeCharRange('a', 'Z')
 * ```
 * 
 * @internal
 */
const makeCharRange = (start:ReadSymbol, stop:ReadSymbol): ReadSymbol[] => {
  const startChar = RANGE_VALS.indexOf(start)
  const stopChar = RANGE_VALS.indexOf(stop)
  return Array.from({ length: stopChar - startChar + 1 })
    .map((_, i) => RANGE_VALS[startChar + i])
}

/**
 * Expands and de-dupes the symbols represented by a read string.
 * 
 * @param read - the string to expand
 * @returns The set of unique symbols represented by the read string
 * 
 * @example Expand a string representing a run of lowercase letters
 * ```ts
 * const symbols = expandReadSymbols('[a-e]')
 * console.log(symbols) // ['a', 'b', 'c', 'd', 'e']
 * ```
 * 
 * @example Expand and de-dupe a string representing specific letters and a run of digits
 * ```ts
 * const symbols = expandReadSymbols('abb[3-5]')
 * console.log(symbols) // ['a', 'b', '3', '4', '5']
 * ```
 */
export const expandReadSymbols = (read:string): ReadSymbol[] => {
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
