import create from 'zustand'
// import produce, { current } from "immer";

const useSteppingStore = create((set) => ({
  steppedStates: [],

  /* Update graph step state */
  setSteppedStates: (steppedStates) => {
    const ids = steppedStates.map((s) => s._state.id)
    set({ steppedStates: ids })
  }
}))

export default useSteppingStore
