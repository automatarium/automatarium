import { useState } from 'react'

import { useProjectStore, useViewStore, useSelectionStore, useToolStore } from '/src/stores'
import { useEvent } from '/src/hooks'
import { locateTransition } from '/src/util/states'

const SelectionBox = () => {
  const tool = useToolStore(s => s.tool)
  const toolActive = tool === 'cursor'
  const states = useProjectStore(s => s.project?.states)
  const transitions = useProjectStore(s => s.project?.transitions)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const svgElement = useViewStore(s => s.svgElement)
  const setSelectedStates = useSelectionStore(s => s.setStates)
  const setSelectedTransitions = useSelectionStore(s => s.setTransitions)
  const [dragStart, setDragStart] = useState(null)
  const [mousePos, setMousePos] = useState(null)

  useEvent('mousemove', e => {
      setMousePos(screenToViewSpace(e.clientX, e.clientY))
  }, [])

  // TODO: use custom events nistead
  useEvent('svg:mousedown', e => {
    if (e.detail.didTargetSVG && toolActive) {
      setDragStart([e.detail.viewX, e.detail.viewY])
    }
  }, [toolActive, svgElement])

  useEvent('svg:mouseup', () => {
    if (dragStart !== null && toolActive) {
      // Calculate drag bounds
      const startX = Math.min(dragStart[0], mousePos[0])
      const startY = Math.min(dragStart[1], mousePos[1])
      const endX = Math.max(dragStart[0], mousePos[0])
      const endY = Math.max(dragStart[1], mousePos[1])

      // Determine selected states
      const selectedStates = states.filter(state =>
        state.x >= startX &&
        state.x <= endX &&
        state.y >= startY &&
        state.y <= endY).map(s => s.id)

      // Determine selected transitions
      const selectedTransitions = transitions.map(t => locateTransition(t, states)).filter(transition =>
        transition.from.x  >= startX &&
        transition.from.x <= endX &&
        transition.from.y >= startY &&
        transition.from.y <= endY &&
        transition.to.x >= startX &&
        transition.to.x <= endX &&
        transition.to.y >= startY &&
        transition.to.y <= endY).map(t => t.id)

      // Update state
      setSelectedStates(selectedStates)
      setSelectedTransitions(selectedTransitions)
      setDragStart(null)
    }
  }, [toolActive, dragStart, mousePos, states])

  if (!dragStart || !mousePos || !toolActive)
    return null

  const startX = Math.min(dragStart[0], mousePos[0])
  const startY = Math.min(dragStart[1], mousePos[1])
  const endX = Math.max(dragStart[0], mousePos[0])
  const endY = Math.max(dragStart[1], mousePos[1])

  return <rect
    x={startX}
    y={startY}
    width={endX - startX}
    height={endY - startY}
    fill='var(--selection-fill)'
    stroke='var(--black)'
    strokeWidth='1.75'
  />
}

export default SelectionBox
