import { useState, useEffect } from 'react'

const useStateDragging = ({ graphState, setGraphState }) => {
  const [draggedState, setDraggedState] = useState(null)

  const startDrag = (name, e) => {
    // Is this LMB?
    setDraggedState(name)
    e.preventDefault()
  }

  // Listen for mouse move - dragging states
  const doDrag = e => {
    if (draggedState !== null) {
      const x = e.clientX
      const y = e.clientY
      setGraphState({
        ...graphState,
        states: graphState.states.map(s => s.name === draggedState ? { ...s, x, y} : s)
      })
    }
  }

  // Listen for mouse up - stop dragging states
  useEffect(() => {
    const cb = e => {
      if (e.button === 0) {
        setDraggedState(null)
        e.preventDefault()
      }
    }
    document.addEventListener('mouseup', cb)
    return () => document.removeEventListener('mouseup', cb)
  }, [])

  return { startDrag, doDrag }
}

export default useStateDragging
