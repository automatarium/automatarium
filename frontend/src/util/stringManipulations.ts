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

export const splitCharsWithOr = (text: string, orOperator: string): string => {
  if (!text || text.length <= 1) return text

  const joinStr = orOperator !== ' ' ? ` ${orOperator} ` : ' '

  const parts = text.match(/(\[.*?])|(![^!]*)|(.)+/g) || []

  return parts.map(part =>
    (part.length === 1 && part !== '!') || part.startsWith('!') ? part : part.split('').join(joinStr)
  ).join(joinStr)
}

// Gets symbols that are preceded by an exclusion operator (!)
export const extractSymbolsToExclude = (input: string): string[] => {
  const matches = input.match(/(!\.)|(!\(([^&)]+&)*[^&)]*\))|(![^()[\]]+)|!\(|!\[/g) || []

  return matches.flatMap((match: string) => {
    if (match.startsWith('!(')) {
      if (match === '!(') return ['(']
      return match.slice(2, -1).split('&').flatMap(s => s.length > 1 ? s.split('') : s)
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
  const ranges = input.match(/\[(.*?)]/g) || []
  input = input.replace(/\[(.*?)]/g, '')
  return [input, ranges]
}

// Exclusions are denoted with ! followed by the character(s) to exclude
export const exclusionInput = (input: string): string => {
  // For more than one character to exclude, they should be enclosed in parentheses and separated by &
  const exclamationWithParentheses = input.match(/!\(([^&)]+&)+[^&)]+\)/)
  // Or they should be enclosed within square brackets to denote a range
  const exclamationWithRange = input.match(/!\[[^\]]+]/)
  const singleExclamation = input.match(/!./)

  // Check if the pattern inside parentheses strictly adheres to single characters separated by &
  if (exclamationWithParentheses) {
    const content = exclamationWithParentheses[0].slice(2, -1)
    if (content.split('&').every(part => part.length === 1)) {
      return exclamationWithParentheses[0]
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
