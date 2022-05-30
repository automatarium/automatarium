import { useState } from 'react'

import { useEvent } from '/src/hooks'
import { useProjectStore, useToolStore, useViewStore } from '/src/stores'
import { dispatchCustomEvent } from '/src/util/events'

const useTransitionCreation = () => {
  const createTransition = useProjectStore(s => s.createTransition)
  const tool = useToolStore(s => s.tool)

  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)

  const [createTransitionStart, setCreateTransitionStart] = useState(null)
  const [createTransitionState, setCreateTransitionState] = useState(null)
  const [createTransitionEnd, setCreateTransitionEnd] = useState(null)

  useEvent('state:mousedown', e => {
    if (tool === 'transition' && e.detail.originalEvent.button === 0) {
      const [viewX, viewY] = screenToViewSpace(e.detail.originalEvent.clientX, e.detail.originalEvent.clientY)
      const states = useProjectStore.getState().project?.states ?? []
      const state = states.find(s => s.id === e.detail.state.id)
      setCreateTransitionState(state)
      setCreateTransitionStart([viewX, viewY])
    }
  }, [tool])

  useEvent('state:mouseup', e => {
    if (createTransitionState && e.detail.originalEvent.button === 0) {
      const id = createTransition({ from: createTransitionState.id, to: e.detail.state.id })
      setCreateTransitionStart(null)
      setCreateTransitionState(null)
      window.setTimeout(() => dispatchCustomEvent('editTransition', { id }), 100)
    }
  }, [createTransitionState])

  useEvent('svg:mousemove', e => {
    if (tool === 'transition' && createTransitionState) {
      setCreateTransitionEnd([e.detail.viewX, e.detail.viewY])
    }
  }, [tool, createTransitionState])

  useEvent('svg:mouseup', e => {
    if (e.detail.didTargetSVG) {
      setCreateTransitionEnd(null)
      setCreateTransitionStart(null)
      setCreateTransitionState(null)
    }
  }, [])

  return {
    createTransitionStart: createTransitionStart && {
      x: createTransitionStart[0],
      y: createTransitionStart[1]
    },
    createTransitionEnd: createTransitionEnd && {
      x: createTransitionEnd[0],
      y: createTransitionEnd[1],
    }
  }
}

export default useTransitionCreation
