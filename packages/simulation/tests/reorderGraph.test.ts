import { describe } from 'node:test'
import { UnparsedGraph } from '../src/graph'
import { reorderStates } from '../src/reorder'

describe('Reordering graph', () => {
  test('Simple graph can be rearranged', () => {
    // Only two state graph, didn't see reason for making JSON file
    const graph = {
      states: [
        {
          isFinal: true,
          x: 570,
          y: 255,
          id: 0
        },
        {
          isFinal: false,
          x: 405,
          y: 255,
          id: 1
        }
      ],
      transitions: [
        {
          from: 1,
          to: 0,
          id: 0,
          write: '',
          direction: 'R',
          read: ''
        }
      ],
      initialState: 1
    } as unknown as UnparsedGraph
    reorderStates(graph)
    expect(graph.initialState).toBe(0)

    expect(graph.states[0].id).toBe(1)
    expect(graph.states[0].isFinal).toBeTrue()

    expect(graph.states[1].id).toBe(0)
    expect(graph.states[1].isFinal).toBeFalse()

    expect(graph.transitions[0]).toMatchObject({
      from: 0,
      to: 1,
      write: '',
      direction: 'R',
      read: ''
    })
  })
})
