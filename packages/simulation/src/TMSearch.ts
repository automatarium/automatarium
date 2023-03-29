import { TMTransition, Tape } from './graph'
import { Graph, Node, State } from './interfaces/graph'

export class TMState extends State {
  constructor (
    _id: number,
    _isFinal: boolean,
        private _tape: Tape
  ) {
    super(_id, _isFinal)
    this._tape = _tape
  }

  key () {
    const traceAdd = this._tape.trace.toString() ?? ''
    return String(this.id + ',' + this._tape.pointer + ',' + traceAdd)
  }

  get tape () {
    return this._tape
  }

  set tape (tape: Tape) {
    this._tape = tape
  }
}

export class TMGraph extends Graph<TMState, TMTransition> {
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
      const nextTape = this.progressTape(node, transition)

      // If there is no next state
      if (
        nextState === undefined || (!transition.read.includes(symbol)) || nextTape.pointer < 0
      ) {
        continue
      }
      if (transition.read === symbol) {
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

  private progressTape (node: Node<TMState>, transition: TMTransition) {
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
