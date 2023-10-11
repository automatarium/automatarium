import { expandReadSymbols } from '@automatarium/simulation/src/parseGraph'

const EXCL_PARENTHESES_REG = /!\(([^&)]+&)+[^&)]+\)/g
const RANGE_REG = /\[(.*?)]/g
const SPLIT_CHAR_REG = /(\[.*?])|(![^ ]+)|([^! ])/g
const SYMBOLS_TO_EXCLUDE_REG = /(!\.)|(!\(([^&)]+&)*[^&)]*\))|(!\[[^\]]+\])|(![^()[\]]+)|!\(|!\[/g

export const possibleOrOperators = (orOperator: string): string[] => {
  switch (orOperator) {
    case '+':
    case '＋':
      return ['+', '＋']

    case '∣':
    case '|':
      return ['∣', '|']

    case '∥':
    case '||':
    case '∣∣':
      return ['∥', '||', '∣∣']

    case '∨':
    case 'v':
    case 'V':
      return ['∨', 'v', 'V']

    case ' ':
    case '':
    case '  ':
      return [' ', '', '  ']

    default:
      return [orOperator]
  }
}

export const formatOutput = (text: string, orOperator: string): string => {
  if (!text) return text
  text = splitCharsWithOr(text, orOperator)
  return addSpaces(text)
}

export const splitCharsWithOr = (text: string, orOperator: string): string => {
  if (text.length <= 1) return text

  const joinStr = orOperator !== ' ' ? ` ${orOperator} ` : ' '
  const parts = text.match(SPLIT_CHAR_REG) || []

  return parts.join(joinStr)
}

// Inserts spaces between values within parentheses for exclusion inputs
// e.g. !(a&b&c) -> !(a & b & c)
export const addSpaces = (input: string): string => {
  const matches = input.match(EXCL_PARENTHESES_REG)

  if (!matches) return input

  for (const match of matches) {
    const formattedMatch = match.replace(/&/g, ' & ')
    input = input.replace(match, formattedMatch)
  }
  return input
}

// Gets symbols that are preceded by an exclusion operator (!)
export const extractSymbolsToExclude = (input: string): string[] => {
  const matches = input.match(SYMBOLS_TO_EXCLUDE_REG) || []

  return matches.flatMap((match: string) => {
    if (match.startsWith('!(')) {
      if (match === '!(') return ['(']
      return match.slice(2, -1).split('&').flatMap(s => s.length > 1 ? s.split('') : s)
    } else if (match.startsWith('![')) {
      return expandReadSymbols(match.slice(1)).split('')
    } else if (match === '![') {
      return ['[']
    } else if (match.startsWith('!')) {
      return match.slice(1).split('')
    }
    return []
  })
}

export const removeWhitespace = (input: string): string => {
  return input.replace(/\s+/g, '')
}

export const removeOrOperators = (input: string, orOperator: string): string => {
  for (const op of possibleOrOperators(orOperator)) {
    input = input.split(op).join('')
  }
  return input
}

export const removeDuplicateChars = (input: string): string => {
  return Array.from(new Set(input.split(''))).join('')
}

export const extractRanges = (input: string): [string, string[]] => {
  const ranges = input.match(RANGE_REG) || []
  input = input.replace(RANGE_REG, '')
  return [input, ranges]
}

// Exclusions are denoted with ! followed by the character(s) to exclude
export const exclusionInput = (input: string): string => {
  // For more than one character to exclude, they should be enclosed in parentheses and separated by &
  const exclamationWithParentheses = input.match(EXCL_PARENTHESES_REG)
  // Or they should be enclosed within square brackets to denote a range
  const exclamationWithRange = input.match(/!\[[^\]]+]/)
  const singleExclamation = input.match(/!./)

  // Check if the pattern inside parentheses strictly adheres to single characters separated by &
  if (exclamationWithParentheses) {
    const content = exclamationWithParentheses[0]
      .slice(2, -1)
      .split('&')
      // Trim whitespace
      .map(p => p.trim())
    if (content.every(part => part.length === 1)) {
      return '!(' + content.join('&') + ')'
    } else {
      return '!('
    }
  }

  if (exclamationWithRange) { return exclamationWithRange[0] }

  if (singleExclamation) {
    if (singleExclamation[0] === '!!') { return '!' }
    return `!${singleExclamation[0][1]}`
  }
  return null
}

// Extracts ranges to readd to return value
// Removes whitespace, or operators, and duplicates
// If the input is 'a[w-z]ab!', the output will be 'ab![w-z]'
export const formatInput = (input: string, orOperator: string): string => {
  // If there are any exclusion operators proceeded by anything, only that expression is returned
  const exclusion = exclusionInput(input)
  if (exclusion) { return exclusion }

  const [inputWithoutRanges, ranges] = extractRanges(input)
  input = removeWhitespace(inputWithoutRanges)
  input = removeOrOperators(input, orOperator)
  input = removeDuplicateChars(input)

  return `${input}${ranges.join('')}`
}
