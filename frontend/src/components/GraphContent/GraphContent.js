import groupBy from 'lodash.groupby'

import { StateCircle, TransitionSet, InitialStateArrow } from '/src/components'
import { useProjectStore, useSelectionStore, useToolStore } from '/src/stores'
import { locateTransition } from '/src/util/states'
import { useStateDragging, useStateCreation, useTransitionCreation } from './hooks'

const GraphContent = ({ containerRef }) => {
  const tool = useToolStore(s => s.tool)
  const project = useProjectStore(s => s.project)
  const selectedStates = useSelectionStore(s => s.selectedStates)
  const setSelectedStates = useSelectionStore(s => s.set)
  const { startDrag } = useStateDragging({ containerRef })
  const { startEdgeCreate, stopEdgeCreate, createTransitionStart, mousePos } = useTransitionCreation({ containerRef })
  useStateCreation({ containerRef })

  const states = project?.states ?? []
  const transitions = project?.transitions ?? []
  const initialState = project?.initialState

  // Group up transitions by the start&end nodes
  const groupedTransitions = Object.values(groupBy(transitions, t => [t.from, t.to].sort((a, b) => b - a)))
  const locatedTransitions = groupedTransitions.map(transitions => transitions.map(t => locateTransition(t, states)))

  console.log(groupedTransitions)

  const handleStateMouseDown = (state, e) => {
    if (e.button === 0) {
      // Select things and then drag
      if (tool === 'cursor') {
        const newSelected = selectedStates.includes(state.id)
          ? selectedStates
          : e.shiftKey
            ? [...selectedStates, state.id]
            : [state.id]
        setSelectedStates(newSelected)
        
        // Drag things
        startDrag(newSelected.map(id => states.find(state => state.id === id)), e)
      }

      if (tool === 'transition') {
        startEdgeCreate(state, e)
      }
    }
  }

  const handleStateMouseUp = (state, e) => {
    if (e.button === 0) {
      if (tool === 'transition') {
        stopEdgeCreate(state, e)
      }
    }

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

    {/* Render in-creation transition */}
    {createTransitionStart && mousePos && <TransitionSet.Transition fullWidth from={createTransitionStart} to={mousePos} count={1} text=''/> }

    {/* Render all states */}
    {states.map(s => <StateCircle
      key={s.id}
      id={s.id}
      name={s.name}
      cx={s.x}
      cy={s.y}
      isFinal={s.isFinal}
      selected={selectedStates.includes(s.id)}
      onMouseDown={e => handleStateMouseDown(s, e)}
      onMouseUp={e => handleStateMouseUp(s, e)}/>)}
    </g>
}

export default GraphContent
