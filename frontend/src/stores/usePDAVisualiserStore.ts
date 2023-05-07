import { create, SetState } from 'zustand'
import { PDAExecutionResult } from '@automatarium/simulation/src/graph'

interface PDAVisualiserStore {
  stack: PDAExecutionResult
  setStack: (stack: PDAExecutionResult) => void
  clearStack: () => void
}

const usePDAVisualiserStore = create<PDAVisualiserStore>((set: SetState<PDAVisualiserStore>) => ({
  stack: null,
  setStack: stack => set({ stack }),
  clearStack: () => set({ stack: null })
}))

export default usePDAVisualiserStore
