import { StoreApi, create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ContextStore {
  context: number | null
  setContext: (id: number | null) => void
  clearContext: () => void
}

// The app has no way to know on which item the user right-clicked on after the context menu is fired
// This aims to solve that issue
const useContextStore = create<ContextStore>()(persist((set: StoreApi<ContextStore>['setState']) => ({
  context: null as number,
  setContext: (id: number | null) => set({ context: id }),
  clearContext: () => set({ context: null })
}), {
  name: 'automatarium-context'
}))

export default useContextStore
