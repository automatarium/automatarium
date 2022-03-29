import create from 'zustand'

const useSelectionStore = create(set => ({
  selectedStates: [],
  set: selectedStates => set({ selectedStates }),
  add: state => set(s => ({ selectedStates: [...s.selectedStates, state]})),
  reset: () => set({ selectedStates: [] }),
}))

export default useSelectionStore
