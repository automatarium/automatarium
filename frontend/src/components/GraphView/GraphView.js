import { useState, useEffect } from 'react'
import groupBy from 'lodash.groupby'

import { StateCircle, TransitionSet } from '/src/components'
import { MarkerProvider } from '/src/providers'

const sampleInitialData = {
  states: [{
    id: 'q0', //TODO: can be int?
    name: 'q0',
    label: null,
    x: 50,
    y: 50,
    isFinal: false,
  }, {
    id: 'q1',
    name: 'q1',
    label: null,
    x: 230,
    y: 70,
    isFinal: true,
  }],
  transitions: [{
    from: 'q0',
    to: 'q1',
    read: 'a',
  }]
}


const GraphView = () => {
  const [graphState, setGraphState] = useState(sampleInitialData)
  const [draggedState, setDraggedState] = useState(null)

  // Destruct state
  const { states, transitions } = graphState

  // Group up transitions by the start&end nodes
  const locatedTransitions = transitions.map(t => locateTransition(t, states))
  const groupedTransitions = Object.values(groupBy(locatedTransitions, t => [t.from, t.to]))

  // Listen for clicking on states - start dragging states
  const handleStateMouseDown = (name, e) => {
    // Is this LMB?
    if (e.button === 0) {
      console.log(name)
      setDraggedState(name)
      e.preventDefault()
    }

    // Is this RMB?
    if (e.button === 2) {
      // TODO: bubble up to a parent for creating a context menu
      console.warn('State RMB event not implemented')
      e.preventDefault()
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

  // Listen for mouse move - dragging states
  const handleMouseMove = e => {
    if (draggedState !== null) {
      const x = e.clientX
      const y = e.clientY
      setGraphState({
        ...graphState,
        states: states.map(s => s.name === draggedState ? { ...s, x, y} : s)
      })
    }
  }

  return <svg onContextMenu={e => e.preventDefault()} onMouseMove={handleMouseMove} style={{ width: '100vw', height: '100vh' }}>
    <MarkerProvider>
      <g>
        {/* Render all sets of edges */}
        {groupedTransitions.map(transitions => <TransitionSet transitions={transitions} key={transitions} />)}

        {/* Render all states */}
        {states.map(s => <StateCircle
          key={s.name}
          name={s.name}
          cx={s.x}
          cy={s.y}
          isFinal={s.isFinal}
          onMouseDown={handleStateMouseDown}/>)}
      </g>
    </MarkerProvider>
  </svg>
}

const locateTransition = (t, states) => {
  const fromState = states.find(s => s.id === t.from)
  const toState = states.find(s => s.id === t.to)
  return {
    ...t,
    from: { x: fromState.x, y: fromState.y },
    to: { x: toState.x, y: toState.y }
  }
}

export default GraphView
