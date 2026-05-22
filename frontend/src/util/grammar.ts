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

/** Breadth First Search for determining if a string can be derived from a grammar
 * Prevents infinite loops by keeping track of visited strings. Does not limit the number of derivation steps, 
 * but will return false if it encounters a string it has already seen (indicating a loop).
 */
function derives(
  grammar: GrammarProjectGraph,
  current: string,
  input: string,
  maxSteps: number = 1000
): boolean {
  // Base case
  if (current === input) return true;
 
  const visited = new Set<string>();
  const queue: Array<[string, number]> = [[current, 0]];
  visited.add(current);
 
  while (queue.length > 0) {
    const [currState, stepCount] = queue.shift()!;
 
    // Stop if we've taken too many steps
    if (stepCount >= maxSteps) {
      continue;
    }
 
    // For every production rule
    for (const prod of grammar.productions) {
      const left = prod.left;
      for (const right of prod.right) {
        // Find all occurrences of 'left' inside 'currState'
        let index = currState.indexOf(left);
        while (index !== -1) {
          // Replace that occurrence and form a new string
          const next =
            currState.slice(0, index) +
            right +
            currState.slice(index + left.length);
 
          // Found the target
          if (next === input) return true;
 
          // Decide whether to explore this branch
          let shouldExplore = false;

          if (!visited.has(next)) {
            // RULE 1: Always allow empty productions (shrinking)
            if (right.length < left.length) {
              // This is a shrinking rule - always explore
              shouldExplore = true;
            }
            // RULE 2: Only allow growth if result is at or below target length
            else if (next.length <= input.length) {
              // This is growth or neutral - only explore if not exceeding target
              shouldExplore = true;
            }
            // RULE 3: Reject if this would grow beyond target
            // (unless it's a shrinking rule covered by RULE 1)
            if (shouldExplore) {
              visited.add(next);
              queue.push([next, stepCount + 1]);
            }
          }
 
          // Check for another occurrence later in the string
          index = currState.indexOf(left, index + 1);
        }
      }
    }
  }
 
  return false;
}
 
/**
 * Function based on derives() but returns the actual derivation steps.
 * Uses length-aware pruning to prevent queue explosion.
 */
export function showDerivations(
  grammar: GrammarProjectGraph,
  current: string,
  input: string,
  maxSteps: number = 1000
): DerivationStep[] {
  // Base case: if current equals input, we've successfully derived it
  if (current === input) {
    return [];
  }
 
  // Track visited forms to avoid processing the same state twice
  // Also track the path (parent and transition) for reconstruction
  const visited = new Map<string, { from: string; step: DerivationStep } | null>();
  visited.set(current, null); // Current has no parent
 
  const queue: Array<[string, number]> = [[current, 0]];
 
  while (queue.length > 0) {
    const [currState, stepCount] = queue.shift()!;
 
    // Stop if we've taken too many steps
    if (stepCount >= maxSteps) {
      continue;
    }
 
    // Try all production rules
    for (const prod of grammar.productions) {
      const left = prod.left;
      for (const right of prod.right) {
        // Find all occurrences of 'left' inside 'currState'
        let index = currState.indexOf(left);
        while (index !== -1) {
          // Replace that occurrence and form a new string
          const next =
            currState.slice(0, index) +
            right +
            currState.slice(index + left.length);
 
          // Create the derivation step for this transition
          const step: DerivationStep = {
            from: currState,
            to: next,
            ruleLeft: left,
            ruleRight: right === "" ? "ε" : right,
            replacementIndex: index,
            replacementLength: left.length,
            insertedLength: right.length
          };
 
          // Found the target - reconstruct the full derivation path
          if (next === input) {
            return reconstructPath(visited, currState, step);
          }
 
          // Decide whether to explore this branch (same logic as derives())
          let shouldExplore = false;
 
          if (!visited.has(next)) {
            // RULE 1: Always allow shrinking rules (empty productions)
            if (right.length < left.length) {
              shouldExplore = true;
            }
            // RULE 2: Only allow growth if result is at or below target length
            else if (next.length <= input.length) {
              shouldExplore = true;
            }
 
            if (shouldExplore) {
              visited.set(next, { from: currState, step });
              queue.push([next, stepCount + 1]);
            }
          } 
          // Check for another occurrence later in the string
          index = currState.indexOf(left, index + 1);
        }
      }
    }
  }
 
  return [];
}
 
/**
 * Reconstruct derivation path from visited map by backtracking
 */
function reconstructPath(
  visited: Map<string, { from: string; step: DerivationStep } | null>,
  lastForm: string,
  finalStep: DerivationStep
): DerivationStep[] {
  const path: DerivationStep[] = [];
  let current = lastForm;
 
  // Backtrack from current form to the start
  while (visited.has(current)) {
    const entry = visited.get(current);
    if (!entry) {
      // Reached the start (entry is null)
      break;
    }
    path.unshift(entry.step);
    current = entry.from;
  }
 
  // Add the final step
  path.push(finalStep);
  return path;
}

export type FailedDerivationResult = {
  steps: DerivationStep[]
  finalString: string
  failureReason: string
}

function partialDerivationScore(current: string, target: string): number {
  let prefix = 0
  while (
    prefix < current.length &&
    prefix < target.length &&
    current[prefix] === target[prefix]
  ) {
    prefix++
  }
  return prefix * 1000 + current.length
}

function makeDerivationStep(
  current: string,
  next: string,
  left: string,
  right: string,
  index: number
): DerivationStep {
  return {
    from: current,
    to: next,
    ruleLeft: left,
    ruleRight: right === "" ? "ε" : right,
    replacementIndex: index,
    replacementLength: left.length,
    insertedLength: right.length,
  }
}

function explainDerivationFailure(
  current: string,
  input: string,
  grammar: GrammarProjectGraph
): string {
  if (current === input) {
    return `The derived string matches "${input}", but no complete derivation was found.`
  }

  let canApplyRule = false
  for (const prod of grammar.productions) {
    if (!prod.left) continue
    if (current.includes(prod.left)) {
      canApplyRule = true
      break
    }
  }

  let prefix = 0
  while (
    prefix < current.length &&
    prefix < input.length &&
    current[prefix] === input[prefix]
  ) {
    prefix++
  }

  if (prefix === input.length && current.length > input.length) {
    const extra = current.slice(input.length)
    return `Derived "${current}" but the test string is "${input}" — cannot remove extra "${extra}".`
  }

  if (prefix === current.length && current.length < input.length) {
    const missing = input.slice(current.length)
    return `Derived "${current}" but the test string is "${input}" — cannot produce missing "${missing}".`
  }

  if (prefix > 0 && prefix < current.length && prefix < input.length) {
    return `Derived "${current}" but the test string is "${input}" — differs at position ${prefix + 1} ("${current[prefix]}" vs "${input[prefix]}").`
  }

  if (!canApplyRule) {
    return `Derived "${current}" but the test string is "${input}". No production rule can be applied.`
  }

  return `Derived "${current}" but the test string is "${input}". No complete derivation exists from this string.`
}

/** Longest partial derivation toward input when the string cannot be derived. */
export function showFailedDerivation(
  grammar: GrammarProjectGraph,
  start: string,
  input: string,
  maxSteps: number = 1000 
): FailedDerivationResult {
  let bestSteps: DerivationStep[] = []
  let bestFinal = start
  let bestScore = partialDerivationScore(start, input)

   const visited = new Map<string, { from: string; step: DerivationStep } | null>()
  visited.set(start, null) // Starting form has no parent
 
  // Queue stores: [current_string, step_count]
  const queue: Array<[string, number]> = [[start, 0]]
 
  while (queue.length > 0) {
    const [currState, stepCount] = queue.shift()!
 
    // Respect the max steps boundary
    if (stepCount >= maxSteps) {
      continue
    }
 
    // Update best if this state is better (longer path or better score at same length)
    const currScore = partialDerivationScore(currState, input)
    if (
      bestSteps.length === 0 ||
      stepCount > bestSteps.length ||
      (stepCount === bestSteps.length && currScore > bestScore)
    ) {
      bestSteps = reconstructPathFromVisited(visited, currState)
      bestFinal = currState
      bestScore = currScore
    }
 
    // Try all production rules
    for (const prod of grammar.productions) {
      const left = prod.left
      if (!left) continue
 
      for (const right of prod.right) {
        // Find all occurrences of 'left' inside 'currState'
        let index = currState.indexOf(left)
        
        while (index !== -1) {
          // Replace that occurrence and form a new string
          const next =
            currState.slice(0, index) +
            right +
            currState.slice(index + left.length)
 
          // Only explore unvisited states
          if (!visited.has(next)) {
            // Apply length-aware pruning rules (same as showDerivations)
            let shouldExplore = false
 
            // RULE 1: Always allow shrinking rules (right.length < left.length)
            if (right.length < left.length) {
              shouldExplore = true
            }
            // RULE 2: Allow growth/neutral only if not exceeding target length
            else if (next.length <= input.length) {
              shouldExplore = true
            }
            // RULE 3: Reject if growing beyond target (implicit: shouldExplore stays false)
 
            if (shouldExplore) {
              // Create the derivation step
              const step = makeDerivationStep(currState, next, left, right, index)
              
              // Record in visited map for path reconstruction
              visited.set(next, { from: currState, step })
              
              // Add to queue for processing
              queue.push([next, stepCount + 1])
            }
          }
 
          // Check for another occurrence of 'left' later in the string
          index = currState.indexOf(left, index + 1)
        }
      }
    }
  }
 
  return {
    steps: bestSteps,
    finalString: bestFinal,
    failureReason: explainDerivationFailure(bestFinal, input, grammar),
  }
}

// Helper to reconstruct path from visited map when we only have the final string
function reconstructPathFromVisited(
  visited: Map<string, { from: string; step: DerivationStep } | null>,
  terminal: string
): DerivationStep[] {
  const path: DerivationStep[] = []
  let current = terminal
 
  // Backtrack from terminal to the start
  while (visited.has(current)) {
    const entry = visited.get(current)
    if (!entry) {
      // Reached the start (entry is null)
      break
    }
    path.unshift(entry.step)
    current = entry.from
  }
 
  return path
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
if (type !== "regular" && type !== "context-free") {
  console.warn("Only regular grammars can be converted so far.")
  return null
  }
  if (type == "regular") {
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
  
  else if (type == "context-free") {

  stateCounter = 0

  const states: AutomataState[] = []
  const transitions: PDAAutomataTransition[] = []

  // States
  const q0 = genId()
  const q1 = genId()
  const qLoop = genId()
  const qF = genId()

  states.push(
    {
      id: q0,
      x: 100,
      y: 200,
      isFinal: false,
      name: "q0"
    },
    {
      id: q1,
      x: 250,
      y: 200,
      isFinal: false,
      name: "q1"
    },
    {
      id: qLoop,
      x: 450,
      y: 200,
      isFinal: false,
      name: "qloop"
    },
    {
      id: qF,
      x: 700,
      y: 200,
      isFinal: true,
      name: "qF"
    }
  )

  // Step 1:
  // Push bottom stack marker $
  transitions.push({
    id: genId(),
    from: q0,
    to: q1,
    read: "",
    pop: "",
    push: "$"
  })

  // Step 2:
  // Push start symbol
  transitions.push({
    id: genId(),
    from: q1,
    to: qLoop,
    read: "",
    pop: "",
    push: grammar.startSymbol
  })

  // Production transitions
  for (const prod of grammar.productions) {

    for (const rule of prod.right) {

      let pushString = ""

      // ε production
      if (rule === "") {
        pushString = ""
      } else {
        // Reverse RHS for stack order
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

  // Terminal matching transitions
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

  // Final transition:
  // Pop bottom marker $
  transitions.push({
    id: genId(),
    from: qLoop,
    to: qF,
    read: "",
    pop: "$",
    push: ""
  })

  const automaton: PDAProjectGraph = {
    projectType: 'PDA',
    states,
    transitions,
    initialState: q0
  }

  return automaton
}
}