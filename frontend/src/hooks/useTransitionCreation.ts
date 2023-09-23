import { useState } from 'react'

import { useEvent } from '/src/hooks'
import { useProjectStore, useToolStore, useViewStore } from '/src/stores'
import { AutomataState, Coordinate } from '/src/types/ProjectTypes'
import { dispatchCustomEvent } from '/src/util/events'

const useTransitionCreation = (): { createTransitionStart: Coordinate, createTransitionEnd: Coordinate } => {
  const createTransition = useProjectStore(s => s.createTransition)
  const tool = useToolStore(s => s.tool)

  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  // Alias for whats used in the next states
  type PosTuple = [number, number] | null
  const [createTransitionStart, setCreateTransitionStart] = useState<PosTuple>(null)
  const [createTransitionState, setCreateTransitionState] = useState<AutomataState>(null)
  const [createTransitionEnd, setCreateTransitionEnd] = useState<PosTuple>(null)
  const [moveTransitionState, setMoveTransitionState] = useState<AutomataState>(null)
  const [isMoveStart, setIsMoveStart] = useState(false)

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

  useEvent('state:mouseup', e => {
    if (moveTransitionState && e.detail.originalEvent.button === 0) {
      const otherId = e.detail.state.id
      let movedTransitionId = -1
      if (isMoveStart) {
        movedTransitionId = createTransition({ from: moveTransitionState.id, to: otherId })
      } else {
        movedTransitionId = createTransition({ from: otherId, to: moveTransitionState.id })
      }
      console.log(movedTransitionId)
    }
  }, [moveTransitionState])

  useEvent('svg:mousemove', e => {
    if (tool === 'transition' && createTransitionState) {
      setCreateTransitionEnd([e.detail.viewX, e.detail.viewY])
    }
  }, [tool, createTransitionState])

  useEvent('svg:mousemove', e => {
    if (tool === 'cursor' && moveTransitionState) {
      if (isMoveStart) {
        setCreateTransitionStart([e.detail.viewX, e.detail.viewY])
      }
    }
  }, [tool, moveTransitionState])

  useEvent('svg:mouseup', e => {
    if (e.detail.didTargetSVG) {
      setCreateTransitionEnd(null)
      setCreateTransitionStart(null)
      setCreateTransitionState(null)
    }
  }, [])

  useEvent('transitionhandle:mousedown', e => {
    const isMovingStart = e.detail.transitionInfo.isMovingStart
    setIsMoveStart(isMovingStart)
    const states = useProjectStore.getState().project?.states ?? []
    if (isMovingStart) {
      setMoveTransitionState(states.find(s => s.id === e.detail.transitionInfo.fromId))
      setCreateTransitionStart(screenToViewSpace(e.detail.originalEvent.clientX, e.detail.originalEvent.clientY))
    } else {
      setMoveTransitionState(states.find(s => s.id === e.detail.transitionInfo.toId))
      setCreateTransitionEnd(screenToViewSpace(e.detail.originalEvent.clientX, e.detail.originalEvent.clientY))
    }
  })

  return {
    createTransitionStart: createTransitionStart && {
      x: createTransitionStart[0],
      y: createTransitionStart[1]
    },
    createTransitionEnd: createTransitionEnd && {
      x: createTransitionEnd[0],
      y: createTransitionEnd[1]
    }
  }
}

export default useTransitionCreation
