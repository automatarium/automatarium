import { GrammarProjectGraph, FSAProjectGraph, AutomataState, FSAAutomataTransition } from '../types/ProjectTypes'

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

export function detectType(grammar: GrammarProjectGraph): "regular (right-linear)" | "regular (left-linear)" | "context-free" | "context-sensitive" | "unrestricted" | "none" {
  if (grammar.productions.length == 0) {
    return "none"
  }
    //assume the grammar is valid for all types until proven otherwise
    let isRegular = true
    let isContextFree = true
    let isContextSensitive = true
    let rightLinear = null

    for (const prod of grammar.productions) { //iterate through each production rule
      const left = prod.left
      for (const rule of prod.right) {
        //regular grammar check (only one non-terminal on LHS, and RHS is either a single terminal or a terminal + non-terminal)
        if (!(left.length === 1 && left >= "A" && left <= "Z")) {
          isRegular = false
        } else {
          if (rule !== "") {
            const isSingleTerminal = rule.length === 1 && rule[0] >= "a" && rule[0] <= "z";
            const isRightLinearForm = rule.length === 2 && rule[0] >= "a" && rule[0] <= "z" && rule[1] >= "A" && rule[1] <= "Z";
            const isLeftLinearForm = rule.length === 2 && rule[0] >= "A" && rule[0] <= "Z" && rule[1] >= "a" && rule[1] <= "z";
            if (!(isSingleTerminal || isRightLinearForm || isLeftLinearForm)) {
              isRegular = false;
            } else {
              //determin left or right linear format
              if (isRightLinearForm) {
                if (rightLinear === false) {
                  isRegular = false; //mixed linearity can't be regular
                } else {
                  rightLinear = true;
                }
              } else if (isLeftLinearForm) {
                if (rightLinear === true) {
                  isRegular = false; //mixed linearity can't be regular
                } else {
                  rightLinear = false;
                }
              }
            }
          }
        }

      //context-free grammar check (only one non-terminal on LHS)
      if (!(left.length === 1 && left >= "A" && left <= "Z")) { 
        isContextFree = false
      }
    
      //context-sensitive grammar check (length of RHS must be >= length of LHS, except for the case of start symbol producing empty string)
      if (rule.length < left.length && !(left === grammar.startSymbol && rule === "")) {
        isContextSensitive = false
      }
    }
  }

  if (isRegular) return `regular (${rightLinear ? "right-linear" : "left-linear"})`;
  if (isContextFree) return "context-free"
  if (isContextSensitive) return "context-sensitive"
  return "unrestricted"
}



let stateCounter = 0
const genId = () => stateCounter++

export function convertToAutomata(grammar: GrammarProjectGraph, type: string) {
  if (type !== "regular") {
      console.warn("Only regular grammars can be converted so far.")
      return null
  }
  stateCounter = 0
  const stateMap = new Map<string, number>()
  const states: AutomataState[] = []
  const transitions: FSAAutomataTransition[] = []
  for (const prod of grammar.productions) {
    if (!stateMap.has(prod.left)) {
      const id = genId()
      stateMap.set(prod.left, id)
      states.push({
        id,
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
        isFinal: false,
        name: prod.left
      })
    }
  }

  const finalStateId = genId()
  states.push({
    id: finalStateId,
    x: 500,
    y: 250,
    isFinal: true,
    name: 'F'
  })

  for (const prod of grammar.productions) {
    const fromId = stateMap.get(prod.left)!
    for (const rule of prod.right) {
      if (rule === "") {
        const state = states.find(s => s.id === fromId)
        if (state) state.isFinal = true
      } 
      else if (rule.length === 1 && rule >= "a" && rule <= "z") {
        transitions.push({
          id: genId(),
          from: fromId,
          read: rule,
          to: finalStateId
        })
      } 
      else if (rule.length === 2) {
        const [a, B] = rule
        if (a >= "a" && a <= "z" && B >= "A" && B <= "Z") {
          const toId = stateMap.get(B)
          if (toId !== undefined) {
            transitions.push({
              id: genId(),
              from: fromId,
              read: a,
              to: toId
            })
          }
        } else if (a >= "A" && a <= "Z" && B >= "a" && B <= "z") {
          const toId = stateMap.get(a)
          if (toId !== undefined) {
            transitions.push({
              id: genId(),
              from: toId,
              read: B,
              to: fromId
            })
          }
        }
      }
    }
  }


  const automaton: FSAProjectGraph = {
    projectType: 'FSA',
    states,
    transitions,
    initialState: stateMap.get(grammar.startSymbol) ?? null
  }

  return automaton


}