import { create } from 'zustand'
import produce from 'immer'
// import produce, { current } from "immer";

const useTMSimResultStore = create((set) => ({
  traceIDx: 0,
  simResults: [],

  setSimResults: simResults => set(produce((state) => {
    state.simResults = simResults
    state.traceIDx = 0
  })),

  clearSimResults: () => set(produce((state) => {
    state.simResults = []
    state.traceIDx = 0
  })),

  setTraceIDx: (IDx) => set(produce((state) => {
    state.traceIDx = IDx
  }))
}))

export default useTMSimResultStore
