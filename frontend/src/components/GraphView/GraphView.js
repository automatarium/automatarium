import { useState, useEffect } from 'react'
import groupBy from 'lodash.groupby'

import { StateCircle, TransitionSet, InitialStateArrow } from '/src/components'
import { MarkerProvider } from '/src/providers'
import { useStateDragging } from '/src/hooks'
import { locateTransition } from '/src/util/states'

const sampleInitialData = {
  initialState: 0,
  states: [{
    id: 0, //TODO: can be int?
    name: 'q0',
    label: null,
    x: 50,
    y: 50,
    isFinal: false,
  }, {
    id: 1,
    name: 'q1',
    label: null,
    x: 230,
    y: 70,
    isfinal: true,
  },{
    id: 3,
    name: 'q3',
    label: null,
    x: 50,
    y: 250,
    isfinal: true,
  }, {
    id: 4,
    name: 'q4',
    label: null,
    x: 230,
    y: 250,
    isfinal: true,
  }],
  transitions: [{
    from: 0,
    to: 1,
    read: 'a',
  }, {
    from: 3,
    to: 4,
    read: 'a'
  }, {
    from: 3,
    to: 4,
    read: 'b'
  }, {
    from: 3,
    to: 4,
    read: 'c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t',
  }]
}


const GraphView = () => {
  const [graphState, setGraphState] = useState(sampleInitialData)
  const { startDrag, doDrag } = useStateDragging({ graphState, setGraphState })

  // Destruct state
  const { states, transitions, initialState } = graphState

  // Group up transitions by the start&end nodes
  const groupedTransitions = Object.values(groupBy(transitions, t => [t.from, t.to]))
  const locatedTransitions = groupedTransitions.map(transitions => transitions.map(t => locateTransition(t, states)))

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
        {/* Render arrow on initial state */}
        <InitialStateArrow states={states} initialState={initialState}/>

        {/* Render all sets of edges */}
        {locatedTransitions.map(transitions => <TransitionSet transitions={transitions} key={transitions} />)}

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
