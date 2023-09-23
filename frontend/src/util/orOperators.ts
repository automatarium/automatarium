
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
