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

  // Don't insert OR symbols inside ranges or between NOT operator (!) and following character 
  const regex = /(\[.*?])|(!+[a-zA-Z])|([a-zA-Z])/g
  let matches = Array.from(text.matchAll(regex))
  let parts = matches.map(match => match[0])

  return parts.join(joinStr);
}

/**
 * Removes OR operators and rearranges the read string when a range is present
 * All single characters come before ranges
 * e.g. [a-b]ad[l-k] becomes ad[a-b][l-k]
 */
export const formatInput = (input: string, orOperator: string): string => {
  // Remove whitespace
  input = input.replace(/\s+/g, '');

  // Remove or operators
  for (const op of possibleOrOperators(orOperator)) {
    input = input.split(op).join('');
  }

  // Extract ranges
  const ranges = input.match(/\[(.*?)]/g) || [];
  input = input.replace(/\[(.*?)]/g, '');

  // Extract all valid exclusions
  const exclusionMatches = input.match(/!+([^!])/g) || [];

  // Remove those valid exclusions from the input
  for (const match of exclusionMatches) {
    input = input.replace(match, '');
  }

  // Remove all standalone `!` symbols
  input = input.replace(/!+/g, '');

  // Construct the unique exclusions
  const uniqueExclusions = Array.from(new Set(exclusionMatches.map(match => '!' + match[match.length - 1]))).join('');

  // Add back ranges
  return `${input}${uniqueExclusions}${ranges.join('')}`;
}



