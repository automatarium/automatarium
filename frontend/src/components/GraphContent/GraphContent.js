import groupBy from 'lodash.groupby'

import { StateCircle, TransitionSet, InitialStateArrow } from '/src/components'
import { useProjectStore } from '/src/stores'
import { locateTransition } from '/src/util/states'
import { useStateDragging } from './hooks'

const GraphContent = ({ containerRef }) => {
  const project = useProjectStore(s => s.project)
  const { startDrag } = useStateDragging({ containerRef })

  const states = project?.states ?? []
  const transitions = project?.transitions ?? []
  const initialState = project?.initialState

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

  return <g>
    {/* Render arrow on initial state */}
    <InitialStateArrow states={states} initialStateID={initialState}/>

    {/* Render all sets of edges */}
    {locatedTransitions.map((transitions, i) => <TransitionSet transitions={transitions} key={i} />)}

    {/* Render all states */}
    {states.map(s => <StateCircle
      key={s.id}
      name={s.name}
      cx={s.x}
      cy={s.y}
      isFinal={s.isFinal}
      onMouseDown={e => handleStateMouseDown(s, e)}/>)}
    </g>
}

export default GraphContent
