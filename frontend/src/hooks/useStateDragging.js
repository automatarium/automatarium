import { useProjectStore } from '/src/stores'

import useResourceDragging from './useResourceDragging'

// Setup state interactivity deps
const statesFromIDs = IDs => {
  const states = useProjectStore.getState()?.project?.states ?? []
  return IDs
    .map(id => states.find(state => state.id === id))
}
const makeUpdateState = () => useProjectStore(s => s.updateState)

export default useResourceDragging.bind(null, statesFromIDs, makeUpdateState)
