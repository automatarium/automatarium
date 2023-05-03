import { useProjectStore } from '/src/stores'

import useResourceDragging, { ResourceDraggingHook } from './useResourceDragging'
import { AutomataState } from '/src/types/ProjectTypes'

// Setup state interactivity deps
const statesFromIDs = (IDs: number[]): AutomataState[] => {
  const states = useProjectStore.getState()?.project?.states ?? []
  return states.filter(state => IDs.includes(state.id))
}
const makeUpdateState = () => useProjectStore(s => s.updateState)

export default useResourceDragging.bind(null, statesFromIDs, makeUpdateState) as () => ResourceDraggingHook
