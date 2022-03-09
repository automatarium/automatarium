import { useState, useEffect } from 'react'
import groupBy from 'lodash.groupby'

import { StateCircle, TransitionSet } from '/src/components'
import { MarkerProvider } from '/src/providers'
import { useStateDragging } from '/src/hooks'
import { locateTransition } from '/src/util/states'

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
  const { startDrag, doDrag } = useStateDragging({ graphState, setGraphState })

  // Destruct state
  const { states, transitions } = graphState

  // Group up transitions by the start&end nodes
  const locatedTransitions = transitions.map(t => locateTransition(t, states))
  const groupedTransitions = Object.values(groupBy(locatedTransitions, t => [t.from, t.to]))

  const handleStateMouseDown = (name, e) => {
    if (e.button === 0)
      startDrag(name, e)

    // Is this RMB?
    if (e.button === 2) {
      // TODO: bubble up to a parent for creating a context menu
      console.warn('State RMB event not implemented')
    }
  }

  return <svg onContextMenu={e => e.preventDefault()} onMouseMove={doDrag} style={{ width: '100vw', height: '100vh' }}>
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

export default GraphView
