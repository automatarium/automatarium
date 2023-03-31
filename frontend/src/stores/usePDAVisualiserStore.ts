import create, { SetState } from 'zustand'

interface PDAVisualiserStore {
  stack: Record<string, string[]>
  setStack: (stack: Record<string, string[]>) => void
  clearStack: () => void
}

const usePDAVisualiserStore = create<PDAVisualiserStore>((set: SetState<PDAVisualiserStore>) => ({
  stack: {},
  setStack: (stack: Record<string, string[]>) => set({ stack }),
  clearStack: () => set({ stack: {} })
}))

export default usePDAVisualiserStore
