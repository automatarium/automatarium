import { useState } from 'react'

import { useEvent } from '/src/hooks'
import { useProjectStore, useToolStore, useViewStore } from '/src/stores'
import { AutomataState, Coordinate } from '/src/types/ProjectTypes'
import { dispatchCustomEvent } from '/src/util/events'

const useTransitionCreation = (): { createTransitionStart: Coordinate, createTransitionEnd: Coordinate } => {
  const createTransition = useProjectStore(s => s.createTransition)
  const moveTransition = useProjectStore(s => s.moveTransition)
  const commit = useProjectStore(s => s.commit)
  const tool = useToolStore(s => s.tool)

  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  // Alias for whats used in the next states
  type PosTuple = [number, number] | null
  const [createTransitionStart, setCreateTransitionStart] = useState<PosTuple>(null)
  const [createTransitionState, setCreateTransitionState] = useState<AutomataState>(null)
  const [createTransitionEnd, setCreateTransitionEnd] = useState<PosTuple>(null)
  const [moveTransitionState, setMoveTransitionState] = useState<AutomataState>(null)
  const [isMoveStart, setIsMoveStart] = useState(false)
  const [transitionsToUpdate, setTransitionsToUpdate] = useState<number[]>(null)

  const reattachTransitions = (updateTransitionIds: number[], from: number, to: number) => {
    const { transitions } = useProjectStore.getState()?.project ?? {}
    const transitionsScope = transitions.filter(t => updateTransitionIds.includes(t.id))
    transitionsScope.forEach(t => {
      moveTransition({ id: t.id, from, to })
    })
    // Update state
    commit()
  }

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
    if (moveTransitionState && transitionsToUpdate && e.detail.originalEvent.button === 0) {
      const otherId = e.detail.state.id
      if (isMoveStart) {
        reattachTransitions(transitionsToUpdate, otherId, moveTransitionState.id)
      } else {
        reattachTransitions(transitionsToUpdate, moveTransitionState.id, otherId)
      }
      setMoveTransitionState(null)
      setTransitionsToUpdate(null)
      setCreateTransitionStart(null)
      setCreateTransitionEnd(null)
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
      } else {
        setCreateTransitionEnd([e.detail.viewX, e.detail.viewY])
      }
    }
  }, [tool, moveTransitionState])

  useEvent('svg:mouseup', e => {
    if (e.detail.didTargetSVG) {
      setCreateTransitionEnd(null)
      setCreateTransitionStart(null)
      setCreateTransitionState(null)
      setMoveTransitionState(null)
    }
  }, [])

  useEvent('transitionhandle:mousedown', e => {
    const isMovingStart = e.detail.transitionInfo.isMovingStart
    setIsMoveStart(isMovingStart)
    setTransitionsToUpdate(e.detail.transitionInfo.transitionIds)
    const states = useProjectStore.getState().project?.states ?? []
    if (isMovingStart) {
      setMoveTransitionState(states.find(s => s.id === e.detail.transitionInfo.toId))
      setCreateTransitionEnd([e.detail.transitionInfo.otherPosition.x, e.detail.transitionInfo.otherPosition.y])
    } else {
      setMoveTransitionState(states.find(s => s.id === e.detail.transitionInfo.fromId))
      setCreateTransitionStart([e.detail.transitionInfo.otherPosition.x, e.detail.transitionInfo.otherPosition.y])
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
