import { GrammarProjectGraph, FSAProjectGraph, AutomataState, FSAAutomataTransition, PDAProjectGraph, PDAAutomataTransition } from '../types/ProjectTypes'

export type DerivationStep = {
  from: string
  to: string
  ruleLeft: string
  ruleRight: string
  replacementIndex: number
  replacementLength: number
  insertedLength: number
}

function derives(grammar: GrammarProjectGraph, current: string, input: string): boolean {
  if (current === input) return true;
  // Do not stop when current is longer than input, because empty productions can shrink the string.

  // For every production rule
  for (const prod of grammar.productions) {
    const left = prod.left;
    for (const right of prod.right) {
      // Find all occurrences of 'left' inside 'current'
      let index = current.indexOf(left);
      while (index !== -1) {
        // Replace that occurrence and form a new string
        const next =
          current.slice(0, index) + right + current.slice(index + left.length);
        if (derives(grammar, next, input)) return true;
        // Check for another occurrence later in the string
        index = current.indexOf(left, index + 1);
      }
    }
  }

  return false;
}

// Function based on derives() but returns the actual derivation steps
export function showDerivations(
  grammar: GrammarProjectGraph,
  current: string,
  input: string,
  visited = new Set<string>()
): DerivationStep[] {
  // Base case: if current equals input, we've successfully derived it
  if (current === input) {
    return [];
  }

  // Do not stop when current is longer than input, because empty productions can shrink the string.

  if (visited.has(current)) {
    return [];
  }

  const nextVisited = new Set(visited)
  nextVisited.add(current)

  // Try all production rules
  for (const prod of grammar.productions) {
    const left = prod.left;
    for (const right of prod.right) {
      // Find all occurrences of 'left' inside 'current'
      let index = current.indexOf(left);
      while (index !== -1) {
        // Replace that occurrence and form a new string
        const next =
          current.slice(0, index) + right + current.slice(index + left.length);

        // Recursively find the rest of the derivation
        const restDerivations = showDerivations(grammar, next, input, nextVisited);
        if (restDerivations.length > 0 || next === input) {
          // Found a complete derivation - return this step plus the rest
          return [{
            from: current,
            to: next,
            ruleLeft: left,
            ruleRight: right === "" ? "ε" : right,
            replacementIndex: index,
            replacementLength: left.length,
            insertedLength: right.length
          }, ...restDerivations];
        }

        // Check for another occurrence later in the string
        index = current.indexOf(left, index + 1);
      }
    }
  }

  return [];
}

export function testString(grammar: GrammarProjectGraph, str: string): boolean {
  return derives(grammar, grammar.startSymbol, str);
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
  // if (type !== "regular" || "context-free") {
  //     console.warn("Only regular grammars can be converted so far.")
  //     return null
  // }
  //   stateCounter = 0
  //   const stateMap = new Map<string, number>()
  //   const states: AutomataState[] = []
  //   const transitions: FSAAutomataTransition[] = []
  //   for (const prod of grammar.productions) {
  //     if (!stateMap.has(prod.left)) {
  //       const id = genId()
  //       stateMap.set(prod.left, id)
  //       states.push({
  //         id,
  //         x: Math.random() * 400 + 100,
  //         y: Math.random() * 300 + 100,
  //         isFinal: false,
  //         name: prod.left
  //       })
  //     }
  //   }

  //   const finalStateId = genId()
  //   states.push({
  //     id: finalStateId,
  //     x: 500,
  //     y: 250,
  //     isFinal: true,
  //     name: 'F'
  //   })

  //   for (const prod of grammar.productions) {
  //     const fromId = stateMap.get(prod.left)!
  //     for (const rule of prod.right) {
  //       if (rule === "") {
  //         const state = states.find(s => s.id === fromId)
  //         if (state) state.isFinal = true
  //       } 
  //       else if (rule.length === 1 && rule >= "a" && rule <= "z") {
  //         transitions.push({
  //           id: genId(),
  //           from: fromId,
  //           read: rule,
  //           to: finalStateId
  //         })
  //       } 
  //       else if (rule.length === 2) {
  //         const [a, B] = rule
  //         if (a >= "a" && a <= "z" && B >= "A" && B <= "Z") {
  //           const toId = stateMap.get(B)
  //           if (toId !== undefined) {
  //             transitions.push({
  //               id: genId(),
  //               from: fromId,
  //               read: a,
  //               to: toId
  //             })
  //           }
  //         } else if (a >= "A" && a <= "Z" && B >= "a" && B <= "z") {
  //           const toId = stateMap.get(a)
  //           if (toId !== undefined) {
  //             transitions.push({
  //               id: genId(),
  //               from: toId,
  //               read: B,
  //               to: fromId
  //             })
  //           }
  //         }
  //       }
  //     }
  //   }


  //   const automaton: FSAProjectGraph = {
  //     projectType: 'FSA',
  //     states,
  //     transitions,
  //     initialState: stateMap.get(grammar.startSymbol) ?? null
  //   }

  //   return automaton


  // }
  // if (type !== "regular" || "context-free")
  if (type !== "context-free") {
    console.warn("Only regular grammars can be converted so far.")
    return null
  }
  // if (type == "regular") {
  //   stateCounter = 0
  //   const stateMap = new Map<string, number>()
  //   const states: AutomataState[] = []
  //   const transitions: FSAAutomataTransition[] = []
  //   for (const prod of grammar.productions) {
  //     if (!stateMap.has(prod.left)) {
  //       const id = genId()
  //       stateMap.set(prod.left, id)
  //       states.push({
  //         id,
  //         x: Math.random() * 400 + 100,
  //         y: Math.random() * 300 + 100,
  //         isFinal: false,
  //         name: prod.left
  //       })
  //     }
  //   }

  //   const finalStateId = genId()
  //   states.push({
  //     id: finalStateId,
  //     x: 500,
  //     y: 250,
  //     isFinal: true,
  //     name: 'F'
  //   })

  //   for (const prod of grammar.productions) {
  //     const fromId = stateMap.get(prod.left)!
  //     for (const rule of prod.right) {
  //       if (rule === "") {
  //         const state = states.find(s => s.id === fromId)
  //         if (state) state.isFinal = true
  //       }
  //       else if (rule.length === 1 && rule >= "a" && rule <= "z") {
  //         transitions.push({
  //           id: genId(),
  //           from: fromId,
  //           read: rule,
  //           to: finalStateId
  //         })
  //       }
  //       else if (rule.length === 2) {
  //         const [a, B] = rule
  //         if (a >= "a" && a <= "z" && B >= "A" && B <= "Z") {
  //           const toId = stateMap.get(B)
  //           if (toId !== undefined) {
  //             transitions.push({
  //               id: genId(),
  //               from: fromId,
  //               read: a,
  //               to: toId
  //             })
  //           }
  //         } else if (a >= "A" && a <= "Z" && B >= "a" && B <= "z") {
  //           const toId = stateMap.get(a)
  //           if (toId !== undefined) {
  //             transitions.push({
  //               id: genId(),
  //               from: toId,
  //               read: B,
  //               to: fromId
  //             })
  //           }
  //         }
  //       }
  //     }
  //   }


  //   const automaton: FSAProjectGraph = {
  //     projectType: 'FSA',
  //     states,
  //     transitions,
  //     initialState: stateMap.get(grammar.startSymbol) ?? null
  //   }

  //   return automaton
  // }

  if (type == "context-free") {

    stateCounter = 0

    const states: AutomataState[] = []
    const transitions: PDAAutomataTransition[] = []

    const qStart = genId()
    const qLoop = genId()
    const qAccept = genId()

    states.push(
      {
        id: qStart,
        x: 100,
        y: 200,
        isFinal: false,
        name: "q_start"
      },
      {
        id: qLoop,
        x: 350,
        y: 200,
        isFinal: false,
        name: "q_loop"
      },
      {
        id: qAccept,
        x: 600,
        y: 200,
        isFinal: true,
        name: "q_accept"
      }
    )

    transitions.push({
      id: genId(),
      from: qStart,
      to: qLoop,
      read: "",
      pop: "",
      push: grammar.startSymbol
    })

    for (const prod of grammar.productions) {

      for (const rule of prod.right) {

        let pushString = ""

        if (rule === "") {
          pushString = ""
        } else {
          pushString = rule.split("").reverse().join("")
        }

        transitions.push({
          id: genId(),
          from: qLoop,
          to: qLoop,
          read: "",
          pop: prod.left,
          push: pushString
        })
      }
    }


    const terminals = new Set<string>()

    for (const prod of grammar.productions) {
      for (const rule of prod.right) {

        for (const ch of rule) {

          if (ch >= "a" && ch <= "z") {
            terminals.add(ch)
          }
        }
      }
    }

    for (const terminal of terminals) {

      transitions.push({
        id: genId(),
        from: qLoop,
        to: qLoop,
        read: terminal,
        pop: terminal,
        push: ""
      })
    }

    transitions.push({
      id: genId(),
      from: qLoop,
      to: qAccept,
      read: "",
      pop: "",
      push: ""
    })

    const automaton: PDAProjectGraph = {
      projectType: 'PDA',
      states,
      transitions,
      initialState: qStart
    }

    return automaton
  }
}