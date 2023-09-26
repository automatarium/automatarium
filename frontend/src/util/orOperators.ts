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

  // Don't insert OR symbols inside ranges
  return text.split(/(\[.*?])|(?=.)/g).filter(Boolean).join(joinStr)
}

/**
 * Removes OR operators and rearranges the read string when a range is present
 * All single characters come before ranges
 * e.g. [a-b]ad[l-k] becomes ad[a-b][l-k]
 */
export const formatInput = (input: string, orOperator: string): string => {
  // Remove whitespace
  input = input.replace(/\s+/g, '')

  // Remove all possible OR operators from the input
  for (const op of possibleOrOperators(orOperator)) {
    input = input.split(op).join('')
  }

  const ranges = input.match(/\[(.*?)]/g)
  const chars = input.replace(/\[(.*?)]/g, '')
  return `${Array.from(new Set(chars)).join('')}${ranges ? ranges.join('') : ''}`
}
