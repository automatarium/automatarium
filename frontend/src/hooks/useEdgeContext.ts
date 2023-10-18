import { useContextStore, useProjectStore } from '/src/stores'

const useEdgeContext = () => {
  const projectTransitions = useProjectStore.getState().project?.transitions ?? []

  const transitionFromCtx = () => {
    const ctx = useContextStore.getState().context
    if (ctx === null) return undefined
    return projectTransitions.find(t => t.id === ctx)
  }

  const transitionsFromCtx = () => {
    const transitionCtx = transitionFromCtx()
    if (transitionCtx === undefined) return undefined
    return projectTransitions.filter(t => t.from === transitionCtx.from && t.to === transitionCtx.to)
  }

  return {
    getTransitionFromContext: transitionFromCtx,
    getTransitionsFromContext: transitionsFromCtx
  }
}

export default useEdgeContext
