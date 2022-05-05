import { useEffect, useCallback, useState } from 'react'

import { useProjectStore, useViewStore, useToolStore } from '/src/stores'

const useTransitionCreation = ({ containerRef }) => {
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const createTransition = useProjectStore(s => s.createTransition)
  const tool = useToolStore(s => s.tool)
  const toolActive = tool === 'transition'

  const [createTransitionStart, setCreateTransitionStart] = useState(null)
  const [createTransitionState, setCreateTransitionState] = useState(null)
  const [mousePos, setMousePos] = useState(null)

  const startEdgeCreate = useCallback((state, e) => {
    const [x, y] = screenToViewSpace(e.clientX, e.clientY, containerRef?.current)
    setCreateTransitionState(state)
    setCreateTransitionStart([x, y])
  }, [containerRef?.current])

  const stopEdgeCreate = useCallback(state => {
    if (createTransitionState) {
      const id = createTransition({ from: createTransitionState.id, to: state.id })
      setCreateTransitionStart(null)
      setCreateTransitionState(null)
      window.setTimeout(() => document.dispatchEvent(new CustomEvent('editTransition', { detail: { id }})), 100)
    }
  }, [createTransitionState])

  const handleMouseMove = useCallback(e => {
    if (toolActive && createTransitionState) {
      const [x, y] = screenToViewSpace(e.clientX, e.clientY, containerRef?.current)
      setMousePos([x, y])
    }
  }, [toolActive, createTransitionState])

  const handleMouseUp = useCallback(e => {
    setMousePos(null)
    if (e.target === containerRef?.current) {
      setCreateTransitionStart(null)
      setCreateTransitionState(null)
    }
  }, [containerRef?.current])

  // Setup event listeners
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove)
      containerRef.current.addEventListener('mouseup', handleMouseUp)
      return () => {
        containerRef.current.removeEventListener('mousemove', handleMouseMove)
        containerRef.current.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [containerRef?.current, handleMouseMove])

  return {
    startEdgeCreate,
    stopEdgeCreate,
    createTransitionStart: createTransitionStart && {
      x: createTransitionStart[0],
      y: createTransitionStart[1]
    },
    mousePos: mousePos && {
      x: mousePos[0],
      y: mousePos[1],
    }
  }
}

export default useTransitionCreation
