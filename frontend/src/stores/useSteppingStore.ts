import { create } from 'zustand'
import { Node, State } from '@automatarium/simulation'
import { FSAState } from '@automatarium/simulation/src/FSASearch'
import { PDAState } from '@automatarium/simulation/src/PDASearch'

interface SteppingStore<S extends State> {
  steppedStates: Node<S>[]
  setSteppedStates: (states: Node<S>[]) => void
}

const useSteppingStore = create<SteppingStore<FSAState> | SteppingStore<PDAState>>((set) => ({
  steppedStates: [],

  /* Update graph step state */
  setSteppedStates: (steppedStates) => {
    const ids = steppedStates.map((s) => s.state.id)
    set({ steppedStates: ids })
  }
}))

export default useSteppingStore
