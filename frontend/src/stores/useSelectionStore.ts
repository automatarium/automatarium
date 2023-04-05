import create, { SetState } from 'zustand'
import { useProjectStore } from '/src/stores'
import {AutomataState, AutomataTransition, ProjectComment } from 'src/types/ProjectTypes'

type SelectionStore = {
  selectedStates: AutomataState[],
  selectedTransitions: AutomataTransition[],
  selectedComments: ProjectComment[],
  setComments: (selectedComments: ProjectComment[]) => void,
  setStates: (selectedStates: AutomataState[]) => void,
  addState: (state: AutomataState) => void,
  setTransitions: (selectedTransitions: AutomataTransition[]) => void,
  addTransition: (transition: AutomataTransition) => void,
  selectNone: () => void,
  selectAll: () => void,
}

const useSelectionStore = create<SelectionStore>((set: SetState<SelectionStore>) => ({
  selectedStates: [],
  selectedTransitions: [],
  selectedComments: [],
  setComments: selectedComments => set({ selectedComments }),
  setStates: selectedStates => set({ selectedStates }),
  addState: state => set(s => ({ selectedStates: [...s.selectedStates, state] })),
  setTransitions: selectedTransitions => set({ selectedTransitions }),
  addTransition: transition => set(s => ({ selectedTransitions: [...s.selectedTransitions, transition] })),
  selectNone: () => set({ selectedStates: [], selectedTransitions: [], selectedComments: [] }),
  selectAll: () => set({
    selectedStates: useProjectStore
      .getState()
      .project
      ?.states
      ?.map((s: AutomataState) => s.id) ?? [],
    selectedTransitions: useProjectStore
      .getState()
      .project
      ?.transitions
      ?.map((t: AutomataTransition) => t.id) ?? [],
    selectedComments: useProjectStore
      .getState()
      .project
      ?.comments
      ?.map((c: ProjectComment) => c.id) ?? []
  })
}))

export default useSelectionStore
