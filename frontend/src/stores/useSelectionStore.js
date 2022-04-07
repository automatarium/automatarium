import create from 'zustand'

import { useProjectStore } from '/src/stores'

const useSelectionStore = create(set => ({
  selectedStates: [],
  set: selectedStates => set({ selectedStates }),
  add: state => set(s => ({ selectedStates: [...s.selectedStates, state]})),
  selectNone: () => set({ selectedStates: [] }),
  selectAll: () => set({
    selectedStates: useProjectStore
      .getState()
      .project
      ?.states
      ?.map(s => s.id) ?? []
  })
}))

export default useSelectionStore
