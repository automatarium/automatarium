import { create } from 'zustand'
import produce from 'immer'
import { TMExecutionResult } from '@automatarium/simulation/src/graph'

interface TMSimResultStore {
  traceIDx: number,
  simResults: TMExecutionResult[],

  setSimResults: (results: TMExecutionResult[]) => void
  clearSimResults: () => void
  setTraceIDx: (IDx: number) => void
}

const useTMSimResultStore = create<TMSimResultStore>((set) => ({
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
