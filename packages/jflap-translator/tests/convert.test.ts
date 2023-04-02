import { convertJFLAPXML } from '../src/index'
import { readFileSync } from 'fs'
import { FrontendGraph } from '../src/convertJFLAP'

const readProject = (name: string): FrontendGraph => {
  return convertJFLAPXML(readFileSync('tests/sample-data/' + name + '.jff').toString())
}

describe('Importing single attribute', () => {
  const machine = readProject('single-attribute')

  test('Config is correct', () => {
    expect(machine.config).toMatchObject({
      type: 'FSA',
      statePrefix: 'q'
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
