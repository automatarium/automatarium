import { create } from 'zustand'

const useSteppingStore = create((set) => ({
  steppedStates: [],

  /* Update graph step state */
  setSteppedStates: (steppedStates) => {
    const ids = steppedStates.map((s) => s.state.id)
    set({ steppedStates: ids })
  }
}))

export default useSteppingStore
