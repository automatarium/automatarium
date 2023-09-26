import { Tape } from './graph'
import { Graph, Node, State } from './interfaces/graph'
import { TMAutomataTransition } from 'frontend/src/types/ProjectTypes'

export class TMState extends State {
  constructor (
    id: number,
    isFinal: boolean,
    public tape?: Tape
  ) {
    super(id, isFinal)
  }

  key () {
    const traceAdd = this.tape.trace.toString() ?? ''
    return String(this.id + ',' + this.tape.pointer + ',' + traceAdd)
  }
}

export class TMGraph extends Graph<TMState, TMAutomataTransition> {
  public isFinalState (node: Node<TMState>) {
    return (
      node.state.isFinal
    )
  }

  public getSuccessors (node: Node<TMState>) {
    const transitions = this.transitions.filter(
      (transition) => transition.from === node.state.id
    )
    const successors: Node<TMState>[] = []
    for (const transition of transitions) {
      const nextState = this.states.find(
        (state) => state.id === transition.to
      )

      const tapePointer = node.state.tape.pointer
      const tapeTrace = node.state.tape.trace

      // Undefined means its out of tape bounds, so we treat that has a lambda transition
      const symbol = tapeTrace[tapePointer] ?? ''
      let nextTape = this.progressTape(node, transition)

      // If there is no next state
      if (
        nextState === undefined || (!transition.read.includes(symbol))
      ) {
        continue
      }
      // Add a lambda on the tape to the start of the known tape
      if (nextTape.pointer < 0) {
        nextTape = { pointer: 0, trace: ['', ...nextTape.trace] }
      }
      // Progress when the transition's read matches the symbol exactly
      // If it doesn't, progress only if the symbol is non-empty and contained within the read
      if (transition.read === symbol || (symbol.length > 0 && transition.read.includes(symbol))) {
        const graphState = new TMState(
          nextState.id,
          nextState.isFinal,
          nextTape
          // read: symbol
        )
        const successor = new Node(graphState, node)
        successors.push(successor)
      }
    }
    return successors
  }

  private progressTape (node: Node<TMState>, transition: TMAutomataTransition) {
    const tapeTrace = node.state.tape.trace
    const write = transition.write
    const direction = transition.direction
    let newTapePointer = structuredClone(node.state.tape.pointer)
    const newTapeTrace = structuredClone(tapeTrace)
    // Direction input handled to only be uppercase
    if (direction === 'L') {
      newTapePointer--
    } else if (direction === 'R') {
      newTapePointer++
    }
    newTapeTrace[node.state.tape.pointer] = write

    const newTape: Tape = {
      pointer: newTapePointer,
      trace: newTapeTrace
    }

    return newTape
  }
}
