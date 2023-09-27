export const possibleOrOperators = (orOperator: string): string[] => {
  switch (orOperator) {
    case '+':
    case '＋':
      return ['+', '＋']

    case '∣':
    case '|':
      return ['∣', '|', '|']

    case '∥':
    case '||':
    case '∣∣':
      return ['∥', '||']

    case '∨':
    case 'v':
    case 'V':
      return ['∨', 'v', 'V']

    case ' ':
    case '':
      return [' ', '']

    default:
      return [orOperator]
  }
}

// If the read length is greater than 1, add OR symbols between each character
export const splitCharsWithOr = (text: string, orOperator: string): string => {
  if (!text || text.length <= 1) return text
  let joinStr = ' '
  if (orOperator !== ' ') { joinStr = ` ${orOperator} ` }

  const parts = text.match(/(\[.*?])|(![^!])|([^!])/g)
  return parts ? parts.join(joinStr) : ''
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

// Exclusions are denoted with ! followed by the character to exclude
export const extractAndRemoveExclusions = (input: string): [string, string] => {
  const exclusionMatches = input.match(/!+([^!])/g) || []
  for (const match of exclusionMatches) {
    input = input.replace(match, '')
  }
  input = input.replace(/!+/g, '')
  const uniqueExclusions = Array.from(new Set(exclusionMatches.map(match => '!' + match[match.length - 1]))).join('')
  return [input, uniqueExclusions]
}

// Extracts ranges and exclusion pairs to readd to return value
// Removes whitespace, or operators, and duplicates
// If the input is 'a[w-z]a!!b', the output will be 'a!b[w-z]'
export const formatInput = (input: string, orOperator: string): string => {
  const [inputWithoutRanges, ranges] = extractRanges(input)
  const [inputWithoutExclusions, uniqueExclusions] = extractAndRemoveExclusions(inputWithoutRanges)
  input = removeWhitespace(inputWithoutExclusions)
  input = removeOrOperators(input, orOperator)
  input = removeDuplicateChars(input)

  return `${input}${uniqueExclusions}${ranges.join('')}`
}
