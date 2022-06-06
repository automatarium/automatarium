const RANGE_REG = /\[(\w-\w)\]/g
const LITERAL_REG = /[\S]/
const RANGE_VALS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

type Symbol = string

const makeCharRange = (start:Symbol, stop:Symbol): Symbol[] => {
  const startChar = RANGE_VALS.indexOf(start)
  const stopChar = RANGE_VALS.indexOf(stop)
  return Array.from({ length: stopChar - startChar + 1 })
    .map((_, i) => RANGE_VALS[startChar + i])
}

const parseRead = (read:string): Symbol[] => {
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
