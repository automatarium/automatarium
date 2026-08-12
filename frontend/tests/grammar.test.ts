import { GrammarProjectGraph } from '../src/types/ProjectTypes'
import { convertToAutomata, detectType, showDerivations, testString } from '../src/util/grammar'

describe('grammar util', () => {
  describe('testString', () => {
    it('accepts a regular derivation', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'S', right: ['aA', 'b'] },
          { left: 'A', right: ['a'] }
        ]
      }

      expect(testString(grammar, 'aa')).toBe(true)
      expect(testString(grammar, 'b')).toBe(true)
      expect(testString(grammar, 'aba')).toBe(false)
    })

    it('accepts epsilon using an empty right-hand rule', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'S', right: [''] }
        ]
      }

      expect(testString(grammar, '')).toBe(true)
      expect(testString(grammar, 'a')).toBe(false)
    })
  })

  describe('showDerivations', () => {
    it('returns the derivation steps for a successful derivation', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'S', right: ['aA'] },
          { left: 'A', right: ['b'] }
        ]
      }

      const steps = showDerivations(grammar, 'S', 'ab')

      expect(steps).toEqual([
        {
          from: 'S',
          to: 'aA',
          ruleLeft: 'S',
          ruleRight: 'aA',
          replacementIndex: 0,
          replacementLength: 1,
          insertedLength: 2
        },
        {
          from: 'aA',
          to: 'ab',
          ruleLeft: 'A',
          ruleRight: 'b',
          replacementIndex: 1,
          replacementLength: 1,
          insertedLength: 1
        }
      ])
    })

    it('returns a step with ε for an empty production', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'S', right: [''] }
        ]
      }

      const steps = showDerivations(grammar, 'S', '')

      expect(steps).toEqual([
        {
          from: 'S',
          to: '',
          ruleLeft: 'S',
          ruleRight: 'ε',
          replacementIndex: 0,
          replacementLength: 1,
          insertedLength: 0
        }
      ])
    })

    it('returns an empty array when the start and target strings are equal', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'S', right: ['a'] }
        ]
      }

      expect(showDerivations(grammar, 'a', 'a')).toEqual([])
    })
  })

  describe('detectType', () => {
    it('detects regular right-linear grammars', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'S', right: ['aA', 'b'] },
          { left: 'A', right: ['a'] }
        ]
      }

      expect(detectType(grammar)).toBe('regular (right-linear)')
    })

    it('detects regular left-linear grammars', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'S', right: ['Aa', 'b'] },
          { left: 'A', right: ['b'] }
        ]
      }

      expect(detectType(grammar)).toBe('regular (left-linear)')
    })

    it('detects context-free grammars that are not regular', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'S', right: ['AB'] },
          { left: 'A', right: ['a'] },
          { left: 'B', right: ['b'] }
        ]
      }

      expect(detectType(grammar)).toBe('context-free')
    })

    it('detects context-sensitive grammars', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'AB', right: ['CD'] }
        ]
      }

      expect(detectType(grammar)).toBe('context-sensitive')
    })

    it('detects unrestricted grammars', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'AB', right: ['a'] }
        ]
      }

      expect(detectType(grammar)).toBe('unrestricted')
    })

    it('detects none when there are no productions', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: []
      }

      expect(detectType(grammar)).toBe('none')
    })
  })

  describe('convertToAutomata', () => {
    it('converts a regular grammar into an FSA graph', () => {
      const grammar: GrammarProjectGraph = {
        projectType: 'GRAMMAR',
        startSymbol: 'S',
        productions: [
          { left: 'S', right: ['aA', ''] },
          { left: 'A', right: ['b'] }
        ]
      }

      const automaton = convertToAutomata(grammar, 'regular')

      expect(automaton).not.toBeNull()
      expect(automaton.initialState).toBeGreaterThanOrEqual(0)
      expect(automaton.states.map(state => state.name)).toEqual(expect.arrayContaining(['S', 'A', 'F']))
      expect(automaton.states.find(state => state.name === 'F')?.isFinal).toBe(true)
      expect(automaton.transitions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ read: 'a', to: expect.any(Number) }),
          expect.objectContaining({ read: 'b', to: expect.any(Number) })
        ])
      )
    })
  })
})
