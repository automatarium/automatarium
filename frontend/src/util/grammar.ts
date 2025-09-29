import { GrammarProjectGraph } from '../types/ProjectTypes'

function derives(grammar: GrammarProjectGraph, current: string, input: string): boolean { //recursive function to check if rules can derive the input string from the current string
    if (current === "" && input === "") return true //base case for if both strings are empty
    if (current === "" || input === "") return false //base case for if one string is empty and the other isn't

    const symbol = current[0] //first symbol of the current string
    const rest = current.slice(1) //rest of the current string

    if (symbol >= "A" && symbol <= "Z") {  //if the symbol is a non-terminal (capital letters are non-terminals)
        const prod = grammar.productions.find(p => p.left === symbol) //find the production rule for that non-terminal
        if (!prod) return false //if no production rule exists for that non-terminal, return false as it is not a valid symbol

        for (let rule of prod.right) { //for each production rule for that non-terminal
            if (derives(grammar, rule + rest, input)) return true //recursively check if the rest of the string can derive the input string
        }
        return false //if none of the production rules worked, return false
    } else {
        if (symbol === input[0]) { //if the symbol is a terminal (lowercase letters are terminals)
            return derives(grammar, rest, input.slice(1)) //recursively check the rest of the string and the rest of the input
        }
        return false //if the symbol does not match the input, return false
    }
}

export function testString(grammar: GrammarProjectGraph, str: string): boolean { //starter for the recursive function
    return derives(grammar, grammar.startSymbol, str)
}
