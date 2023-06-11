import { create } from 'zustand'
import { Node, State, TMState, FSAState, PDAState } from '@automatarium/simulation'

interface SteppingStore<S extends State> {
  steppedStates: number[]
  setSteppedStates: (states: Node<S>[]) => void
}

const useSteppingStore = create<SteppingStore<FSAState | PDAState | TMState>>((set) => ({
  steppedStates: [],

  /* Update graph step state */
  setSteppedStates: <S extends State>(steppedStates: Node<S>[]) => {
    const ids = steppedStates.map((s) => s.state.id)
    set({ steppedStates: ids })
  }
}))

export default useSteppingStore
