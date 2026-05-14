import { convertJFLAPXML } from '../src'
import { readFileSync } from 'fs'
import {
  Project,
  FSAProjectGraph,
  PDAProjectGraph,
  TMProjectGraph,
  GrammarProjectGraph
} from 'frontend/src/types/ProjectTypes'

type AutomataProject = Project & (FSAProjectGraph | PDAProjectGraph | TMProjectGraph)
type GrammarProject = Project & GrammarProjectGraph

const readProject = (name: string): AutomataProject => {
  return convertJFLAPXML(
    readFileSync('tests/sample-jflap-data/' + name + '.jff').toString()
  ) as AutomataProject
}

const readGrammarProject = (name: string): GrammarProject => {
  return convertJFLAPXML(
    readFileSync('tests/sample-jflap-data/' + name + '.jff').toString()
  ) as GrammarProject
}

describe('Importing single attribute', () => {
  const machine = readProject('single-attribute')

  test('Config is correct', () => {
    expect(machine.config).toMatchObject({
      type: 'FSA',
      statePrefix: 'q',
      color: 'orange',
      orOperator: '|'
    })
  })

  test('States are imported', () => {
    expect(machine.states).toMatchObject([
      {
        id: 0,
        label: '',
        name: 'q0',
        x: 162,
        y: 139,
        isFinal: true
      }
    ])

    expect(machine.initialState).toBe(0)
  })

  test('Transitions are imported', () => {
    expect(machine.transitions).toMatchObject([
      {
        id: 0,
        from: 0,
        to: 0,
        read: ''
      },
      {
        id: 1,
        from: 0,
        to: 0,
        read: 'a'
      }
    ])
  })

  test('Comments are imported', () => {
    expect(machine.comments).toMatchObject([
      {
        id: 0,
        text: 'test note',
        x: 245.0,
        y: 134.0
      }
    ])
  })
})

describe('Import single attribute multiple states', () => {
  const machine = readProject('single-attribute-multiple-states')

  test('States are imported', () => {
    expect(machine.states).toMatchObject([
      {
        id: 0,
        label: '',
        name: 'q0',
        x: 162,
        y: 139,
        isFinal: true
      },
      {
        id: 1,
        label: '',
        name: 'q1',
        x: 238,
        y: 261,
        isFinal: false
      }
    ])

    expect(machine.initialState).toBe(0)
  })

  test('Transitions are imported', () => {
    expect(machine.transitions).toMatchObject([
      {
        id: 0,
        from: 0,
        to: 0,
        read: ''
      },
      {
        id: 1,
        from: 0,
        to: 0,
        read: 'a'
      },
      {
        id: 2,
        from: 0,
        to: 1,
        read: 'd'
      }
    ])
  })
})

describe('Import a PDA', function () {
  const machine = readProject('simple-pda')

  test('Config is correct', () => {
    expect(machine.config).toMatchObject({
      type: 'PDA',
      statePrefix: 'q',
      color: 'red',
      orOperator: '|'
    })
  })

  test('Transitions are imported', () => {
    expect(machine.transitions).toMatchObject([
      {
        id: 0,
        from: 0,
        to: 0,
        read: 'A',
        push: 'A',
        pop: ''
      },
      {
        id: 1,
        from: 0,
        to: 0,
        read: 'B',
        push: '',
        pop: 'A'
      }
    ])
  })

  test('Error when importing multi character PDA', () => {
    expect(() => readProject('multicharacter-pda')).toThrow(Error)
  })
})

describe('Import a TM', () => {
  const machine = readProject('simple-tm')

  test('Config is correct', () => {
    expect(machine.config).toMatchObject({
      type: 'TM',
      statePrefix: 'q',
      color: 'purple',
      orOperator: '|'
    })
  })

  test('Transitions are imported', () => {
    expect(machine.transitions).toMatchObject([
      {
        id: 0,
        from: 0,
        to: 0,
        read: 'A',
        write: 'A',
        direction: 'S'
      },
      {
        id: 1,
        from: 0,
        to: 0,
        read: 'A',
        write: 'B',
        direction: 'L'
      }
    ])
  })

  // New Grammar tests
  describe('Import a Grammar', () => {
    const grammar = readGrammarProject('simple-grammar')
 
    test('Config is correct', () => {
      expect(grammar.config).toMatchObject({
        type: 'GRAMMAR',
        orOperator: '|',
        color: 'green'
      })
    })
  
    test('Grammar data is imported', () => {
      expect(grammar.startSymbol).toBe('S')
      expect(grammar.productions).toMatchObject([
        {
          left: 'S',
          right: ['aA', 'b']
        },
        {
          left: 'A',
          right: ['a']
        }
      ])
    })
  })
})