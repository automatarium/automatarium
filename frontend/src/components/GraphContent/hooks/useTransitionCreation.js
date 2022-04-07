import { useEffect, useCallback, useState } from 'react'

import { useProjectStore, useViewStore } from '/src/stores'

const useTransitionCreation = ({ containerRef }) => {
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const createTransition = useProjectStore(s => s.createTransition)

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
      createTransition({ from: createTransitionState.id, to: state.id })
      setCreateTransitionStart(null)
      setCreateTransitionState(null)
    }
  }, [createTransitionState])

  const handleMouseMove = useCallback(e => {
    const [x, y] = screenToViewSpace(e.clientX, e.clientY, containerRef?.current)
    setMousePos([x, y])
  }, [])

  const handleMouseUp = useCallback(e => {
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
