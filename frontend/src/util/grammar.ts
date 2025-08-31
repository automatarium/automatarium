import { GrammarProjectGraph } from '../types/ProjectTypes'

function derives(grammar: GrammarProjectGraph, current: string, input: string): boolean {
    if (current === "" && input === "") return true
    if (current === "" || input === "") return false

    const symbol = current[0]
    const rest = current.slice(1)

    if (symbol >= "A" && symbol <= "Z") {
        const prod = grammar.productions.find(p => p.left === symbol)
        if (!prod) return false

        for (let rule of prod.right) {
            if (derives(grammar, rule + rest, input)) return true
        }
        return false
    } else {
        if (symbol === input[0]) {
            return derives(grammar, rest, input.slice(1))
        }
        return false
    }
}

export function testString(grammar: GrammarProjectGraph, str: string): boolean {
    return derives(grammar, grammar.startSymbol, str)
}
