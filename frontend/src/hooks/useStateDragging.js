import { useState, useEffect } from 'react'

const useStateDragging = ({ graphState, setGraphState, containerElement }) => {
  const [draggedState, setDraggedState] = useState(null)

  const startDrag = (name, e) => {
    // Is this LMB?
    setDraggedState(name)
    e.preventDefault()
  }

  // Listen for mouse move - dragging states
  const doDrag = e => {
    if (draggedState !== null) {
      const b = containerElement.getBoundingClientRect()
      const x = e.clientX - b.left
      const y = e.clientY - b.top
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
