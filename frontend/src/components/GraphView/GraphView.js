import { useState, useRef } from 'react'
import groupBy from 'lodash.groupby'

import { StateCircle, TransitionSet, InitialStateArrow } from '/src/components'
import { MarkerProvider } from '/src/providers'
import { useStateDragging } from '/src/hooks'
import { locateTransition } from '/src/util/states'

import { Svg } from './graphViewStyle'

const sampleInitialData = {
  initialState: 0,
  states: [{
    id: 0, //TODO: can be int?
    name: 'q0',
    label: null,
    x: 150,
    y: 150,
    isFinal: false,
  }, {
    id: 1,
    name: 'q1',
    label: null,
    x: 330,
    y: 170,
    isFinal: false,
  },{
    id: 2,
    name: 'q2',
    label: null,
    x: 150,
    y: 350,
    isFinal: false,
  }, {
    id: 3,
    name: 'q3',
    label: null,
    x: 530,
    y: 350,
    isFinal: true,
  }],
  transitions: [{
    from: 0,
    to: 1,
    read: 'a',
  }, {
    from: 1,
    to: 2,
    read: 'z',
  },{
    from: 2,
    to: 3,
    read: 'a'
  }, {
    from: 2,
    to: 3,
    read: 'b'
  }, {
    from: 2,
    to: 3,
    read: 'c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t',
  }]
}


const GraphView = props => {
  const [graphState, setGraphState] = useState(sampleInitialData)
  const containerRef = useRef()
  const { startDrag, doDrag } = useStateDragging({ graphState, setGraphState, containerRef })

  // Destruct state
  const { states, transitions, initialState } = graphState

  // Group up transitions by the start&end nodes
  const groupedTransitions = Object.values(groupBy(transitions, t => [t.from, t.to]))
  const locatedTransitions = groupedTransitions.map(transitions => transitions.map(t => locateTransition(t, states)))

  const handleStateMouseDown = (state, e) => {
    if (e.button === 0)
      startDrag(state, e)

    // Is this RMB?
    if (e.button === 2) {
      // TODO: bubble up to a parent for creating a context menu
      console.warn('State RMB event not implemented')
    }
  }

  return (
    <Svg onContextMenu={e => e.preventDefault()} onMouseMove={doDrag} {...props} ref={containerRef}>
      <MarkerProvider>
        <g>
          {/* Render arrow on initial state */}
          <InitialStateArrow states={states} initialState={initialState}/>

          {/* Render all sets of edges */}
          {locatedTransitions.map((transitions, i) => <TransitionSet transitions={transitions} key={i} />)}

          {/* Render all states */}
          {states.map(s => <StateCircle
            key={s.name}
            name={s.name}
            cx={s.x}
            cy={s.y}
            isFinal={s.isFinal}
            onMouseDown={e => handleStateMouseDown(s, e)}/>)}
        </g>
      </MarkerProvider>
    </Svg>
  )
}

export default GraphView
