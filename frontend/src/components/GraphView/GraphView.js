import { useState } from 'react'
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
  const { states, transitions } = graphState

  // Group up transitions by the start&end nodes
  const locatedTransitions = transitions.map(t => locateTransition(t, states))
  const groupedTransitions = Object.values(groupBy(locatedTransitions, t => [t.from, t.to]))

  const handleStateMouseDown = (name, e) => {
    console.log(`State ${name} was clicked`)
  }

  return <svg>
    <MarkerProvider>
      <g>
        {/* Render all sets of edges */}
        {groupedTransitions.map(transitions => <TransitionSet transitions={transitions} key={transitions} />)}

        {/* Then render all states */}
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
