import { useProjectStore } from '/src/stores'

import useResourceDragging from './useResourceDragging'
import { AutomataState } from '/src/types/ProjectTypes'

// Setup state interactivity deps
const statesFromIDs = (IDs: number[]): AutomataState[] => {
  const states = useProjectStore.getState()?.project?.states ?? []
  return states.filter(state => IDs.includes(state.id))
}
const makeUpdateStates = () => useProjectStore(s => s.updateStates)

export default () => useResourceDragging(statesFromIDs, makeUpdateStates)
