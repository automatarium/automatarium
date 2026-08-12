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

export type FailedDerivationResult = {
  steps: DerivationStep[]
  finalString: string
  failureReason: string
}

export type DerivationPathResult = {
  accepted: boolean
  steps: DerivationStep[]
  finalString: string
  failureReason?: string
}

function derives(grammar: GrammarProjectGraph, current: string, input: string): boolean {
  if (current === input) return true

  for (const prod of grammar.productions) {
    const left = prod.left
    for (const right of prod.right) {
      let index = current.indexOf(left)

      while (index !== -1) {
        const next =
          current.slice(0, index) + right + current.slice(index + left.length)

        if (derives(grammar, next, input)) return true

        index = current.indexOf(left, index + 1)
      }
    }
  }

  return false
}

export function showDerivations(
  grammar: GrammarProjectGraph,
  current: string,
  input: string,
  visited = new Set<string>()
): DerivationStep[] {
  if (current === input) {
    return []
  }

  if (visited.has(current)) {
    return []
  }

  const nextVisited = new Set(visited)
  nextVisited.add(current)

  for (const prod of grammar.productions) {
    const left = prod.left

    for (const right of prod.right) {
      let index = current.indexOf(left)

      while (index !== -1) {
        const next =
          current.slice(0, index) + right + current.slice(index + left.length)

        const restDerivations = showDerivations(grammar, next, input, nextVisited)

        if (restDerivations.length > 0 || next === input) {
          return [
            makeDerivationStep(current, next, left, right, index),
            ...restDerivations
          ]
        }

        index = current.indexOf(left, index + 1)
      }
    }
  }

  return []
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
    ruleRight: right === '' ? 'ε' : right,
    replacementIndex: index,
    replacementLength: left.length,
    insertedLength: right.length
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

export function showFailedDerivation(
  grammar: GrammarProjectGraph,
  start: string,
  input: string
): FailedDerivationResult {
  let bestSteps: DerivationStep[] = []
  let bestFinal = start
  let bestScore = partialDerivationScore(start, input)

  const considerPath = (path: DerivationStep[], final: string) => {
    const score = partialDerivationScore(final, input)

    if (
      path.length > bestSteps.length ||
      (path.length === bestSteps.length && score > bestScore)
    ) {
      bestSteps = path
      bestFinal = final
      bestScore = score
    }
  }

  const search = (
    current: string,
    path: DerivationStep[],
    visited: Set<string>
  ) => {
    if (current === input) return

    if (visited.has(current)) {
      considerPath(path, current)
      return
    }

    const nextVisited = new Set(visited)
    nextVisited.add(current)

    let expanded = false

    for (const prod of grammar.productions) {
      const left = prod.left
      if (!left) continue

      for (const right of prod.right) {
        let index = current.indexOf(left)

        while (index !== -1) {
          expanded = true

          const next =
            current.slice(0, index) + right + current.slice(index + left.length)

          const step = makeDerivationStep(current, next, left, right, index)

          search(next, [...path, step], nextVisited)

          index = current.indexOf(left, index + 1)
        }
      }
    }

    if (!expanded) {
      considerPath(path, current)
    }
  }

  search(start, [], new Set())

  return {
    steps: bestSteps,
    finalString: bestFinal,
    failureReason: explainDerivationFailure(bestFinal, input, grammar)
  }
}

export function showMultipleDerivations(
  grammar: GrammarProjectGraph,
  start: string,
  input: string,
  maxResults = 5
): DerivationPathResult[] {
  const results: DerivationPathResult[] = []

  const search = (
    current: string,
    path: DerivationStep[],
    visited: Set<string>
  ) => {
    if (results.length >= maxResults) return

    if (current === input) {
      results.push({
        accepted: true,
        steps: path,
        finalString: current
      })
      return
    }

    if (visited.has(current)) {
      results.push({
        accepted: false,
        steps: path,
        finalString: current,
        failureReason: explainDerivationFailure(current, input, grammar)
      })
      return
    }

    const nextVisited = new Set(visited)
    nextVisited.add(current)

    let expanded = false

    for (const prod of grammar.productions) {
      const left = prod.left
      if (!left) continue

      for (const right of prod.right) {
        let index = current.indexOf(left)

        while (index !== -1) {
          expanded = true

          const next =
            current.slice(0, index) + right + current.slice(index + left.length)

          const step = makeDerivationStep(current, next, left, right, index)

          search(next, [...path, step], nextVisited)

          index = current.indexOf(left, index + 1)
        }
      }
    }

    if (!expanded) {
      results.push({
        accepted: false,
        steps: path,
        finalString: current,
        failureReason: explainDerivationFailure(current, input, grammar)
      })
    }
  }

  search(start, [], new Set())

  return results
}

export function testString(grammar: GrammarProjectGraph, str: string): boolean {
  return derives(grammar, grammar.startSymbol, str)
}

export function detectType(grammar: GrammarProjectGraph): 'regular (right-linear)' | 'regular (left-linear)' | 'context-free' | 'context-sensitive' | 'unrestricted' | 'none' {
  if (grammar.productions.length === 0) {
    return 'none'
  }

  let isRegular = true
  let isContextFree = true
  let isContextSensitive = true
  let rightLinear = null

  for (const prod of grammar.productions) {
    const left = prod.left

    for (const rule of prod.right) {
      if (!(left.length === 1 && left >= 'A' && left <= 'Z')) {
        isRegular = false
      } else {
        if (rule !== '') {
          const isSingleTerminal = rule.length === 1 && rule[0] >= 'a' && rule[0] <= 'z'
          const isRightLinearForm = rule.length === 2 && rule[0] >= 'a' && rule[0] <= 'z' && rule[1] >= 'A' && rule[1] <= 'Z'
          const isLeftLinearForm = rule.length === 2 && rule[0] >= 'A' && rule[0] <= 'Z' && rule[1] >= 'a' && rule[1] <= 'z'

          if (!(isSingleTerminal || isRightLinearForm || isLeftLinearForm)) {
            isRegular = false
          } else {
            if (isRightLinearForm) {
              if (rightLinear === false) {
                isRegular = false
              } else {
                rightLinear = true
              }
            } else if (isLeftLinearForm) {
              if (rightLinear === true) {
                isRegular = false
              } else {
                rightLinear = false
              }
            }
          }
        }
      }

      if (!(left.length === 1 && left >= 'A' && left <= 'Z')) {
        isContextFree = false
      }

      if (rule.length < left.length && !(left === grammar.startSymbol && rule === '')) {
        isContextSensitive = false
      }
    }
  }

  if (isRegular) return `regular (${rightLinear ? 'right-linear' : 'left-linear'})`
  if (isContextFree) return 'context-free'
  if (isContextSensitive) return 'context-sensitive'

  return 'unrestricted'
}

let stateCounter = 0
const genId = () => stateCounter++

export function convertToAutomata(grammar: GrammarProjectGraph, type: string) {
  if (type !== 'regular' && type !== 'context-free') {
    console.warn('Only regular grammars can be converted so far.')
    return null
  }

  if (type === 'regular') {
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
        if (rule === '') {
          const state = states.find(s => s.id === fromId)
          if (state) state.isFinal = true
        } else if (rule.length === 1 && rule >= 'a' && rule <= 'z') {
          transitions.push({
            id: genId(),
            from: fromId,
            read: rule,
            to: finalStateId
          })
        } else if (rule.length === 2) {
          const [a, B] = rule

          if (a >= 'a' && a <= 'z' && B >= 'A' && B <= 'Z') {
            const toId = stateMap.get(B)

            if (toId !== undefined) {
              transitions.push({
                id: genId(),
                from: fromId,
                read: a,
                to: toId
              })
            }
          } else if (a >= 'A' && a <= 'Z' && B >= 'a' && B <= 'z') {
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

  if (type === 'context-free') {
    stateCounter = 0

    const states: AutomataState[] = []
    const transitions: PDAAutomataTransition[] = []

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
        name: 'q0'
      },
      {
        id: q1,
        x: 250,
        y: 200,
        isFinal: false,
        name: 'q1'
      },
      {
        id: qLoop,
        x: 450,
        y: 200,
        isFinal: false,
        name: 'qloop'
      },
      {
        id: qF,
        x: 700,
        y: 200,
        isFinal: true,
        name: 'qF'
      }
    )

    transitions.push({
      id: genId(),
      from: q0,
      to: q1,
      read: '',
      pop: '',
      push: '$'
    })

    transitions.push({
      id: genId(),
      from: q1,
      to: qLoop,
      read: '',
      pop: '',
      push: grammar.startSymbol
    })

    for (const prod of grammar.productions) {
      for (const rule of prod.right) {
        let pushString = ''

        if (rule === '') {
          pushString = ''
        } else {
          pushString = rule.split('').reverse().join('')
        }

        transitions.push({
          id: genId(),
          from: qLoop,
          to: qLoop,
          read: '',
          pop: prod.left,
          push: pushString
        })
      }
    }

    const terminals = new Set<string>()

    for (const prod of grammar.productions) {
      for (const rule of prod.right) {
        for (const ch of rule) {
          if (ch >= 'a' && ch <= 'z') {
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
        push: ''
      })
    }

    transitions.push({
      id: genId(),
      from: qLoop,
      to: qF,
      read: '',
      pop: '$',
      push: ''
    })

    const automaton: PDAProjectGraph = {
      projectType: 'PDA',
      states,
      transitions,
      initialState: q0
    }

    return automaton
  }

  return null
}