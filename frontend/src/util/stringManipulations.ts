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

export const removeWhitespace = (input: string): string => {
  return input.replace(/\s+/g, '');
}

export const removeOrOperators = (input: string, orOperator: string): string => {
  for (const op of possibleOrOperators(orOperator)) {
    input = input.split(op).join('');
  }
  return input;
}

export const removeDuplicateChars = (input: string): string => {
  return Array.from(new Set(input.split(''))).join('');
}

export const extractRanges = (input: string): [string, string[]] => {
  const ranges = input.match(/\[(.*?)]/g) || [];
  input = input.replace(/\[(.*?)]/g, '');
  return [input, ranges];
}

// Exclusions are denoted with ! followed by the character to exclude
export const extractAndRemoveExclusions = (input: string): [string, string] => {
  const exclusionMatches = input.match(/!+([^!])/g) || [];
  for (const match of exclusionMatches) {
    input = input.replace(match, '');
  }
  input = input.replace(/!+/g, '');
  const uniqueExclusions = Array.from(new Set(exclusionMatches.map(match => '!' + match[match.length - 1]))).join('');
  return [input, uniqueExclusions];
}


// If the input is 'a[w-z]a!!b', the output will be 'a!b[w-z]'
export const formatInput = (input: string, orOperator: string): string => {
  input = removeWhitespace(input);
  input = removeOrOperators(input, orOperator);
  input = removeDuplicateChars(input)
  const [inputWithoutRanges, ranges] = extractRanges(input);
  const [finalInput, uniqueExclusions] = extractAndRemoveExclusions(inputWithoutRanges);
  return `${finalInput}${uniqueExclusions}${ranges.join('')}`;
}