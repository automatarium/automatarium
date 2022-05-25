import groupBy from 'lodash.groupby'

import { StateCircle, TransitionSet, InitialStateArrow } from '/src/components'
import { useProjectStore, useSelectionStore, useToolStore } from '/src/stores'
import { locateTransition } from '/src/util/states'

const GraphContent = () => {
  // const tool = useToolStore(s => s.tool)
  const project = useProjectStore(s => s.project)
  const selectedStates = useSelectionStore(s => s.selectedStates)
  const selectedTransitions = useSelectionStore(s => s.selectedTransitions)

  // Destructure project to get state
  const states = project?.states ?? []
  const transitions = project?.transitions ?? []
  const initialState = project?.initialState

  // Group up transitions by the start and end nodes
  const groupedTransitions = Object.values(groupBy(transitions, t => [t.from, t.to].sort((a, b) => b - a)))
  const locatedTransitions = groupedTransitions.map(transitions => transitions.map(t => locateTransition(t, states)))

  // const handleStateMouseDown = (state, e) => {
  //   let newSelected
  //   if (tool === 'cursor') {
  //     // Select states
  //     newSelected = selectedStates.includes(state.id)
  //       ? selectedStates
  //       : e.shiftKey
  //         ? [...selectedStates, state.id]
  //         : [state.id]
  //     setSelectedStates(newSelected)

  //     // Reset selected transitions?
  //     if (!selectedStates.includes(state.id) && !e.shiftKey) {
  //       setSelectedTransitions([])
  //     }
  //   }

  //   if (e.button === 0) {
  //     if (tool === 'cursor') {
  //       // Drag things
  //       startDrag(newSelected?.map(id => states.find(state => state.id === id)), e)
  //     }

  //     if (tool === 'transition') {
  //       startEdgeCreate(state, e)
  //     }
  //   }
  // }

  // const handleStateMouseUp = (state, e) => {
  //   if (e.button === 0) {
  //     if (tool === 'transition') {
  //       stopEdgeCreate(state, e)
  //     }
  //   }

  //   // Is this RMB?
  //   if (e.button === 2) {
  //     e.stopPropagation()
  //     const rightClickEvent = new CustomEvent('stateContext', { detail: {
  //       states: selectedStates,
  //       x: e.clientX,
  //       y: e.clientY,
  //     }})
  //     document.dispatchEvent(rightClickEvent)
  //   }
  // }

  // const handleTransitionMouseDown = (transitionID, e) => {
  //   if (tool === 'cursor') {
  //     // Update transition selections
  //     const newSelected = selectedTransitions.includes(transitionID)
  //       ? selectedTransitions
  //       : e.shiftKey
  //         ? [...selectedTransitions, transitionID]
  //         : [transitionID]
  //     setSelectedTransitions(newSelected)

  //     // Reset selected states?
  //     if (!selectedTransitions.includes(transitionID) && !e.shiftKey) {
  //       setSelectedStates([])
  //     }
  //   }
  // }

  // const handleTransitionMouseUp = (transitionID, e) => {
  //   // Is this RMB?
  //   if (e.button === 2) {
  //     e.stopPropagation()
  //     const rightClickEvent = new CustomEvent('transitionContext', { detail: {
  //       transitions: selectedTransitions,
  //       x: e.clientX,
  //       y: e.clientY,
  //     }})
  //     document.dispatchEvent(rightClickEvent)
  //   }
  // }

  return <g>
    {/* Render arrow on initial state */}
    <InitialStateArrow states={states} initialStateID={initialState}/>

    {/* Render all sets of edges */}
    {locatedTransitions.map((transitions, i) => <TransitionSet
      transitions={transitions}
      key={i}
    />)}

    {/* Render all states */}
    {states.map(s => <StateCircle
      key={s.id}
      id={s.id}
      name={s.name}
      cx={s.x}
      cy={s.y}
      isFinal={s.isFinal}
      selected={selectedStates.includes(s.id)}
    />)}
  </g>
}

export default GraphContent
