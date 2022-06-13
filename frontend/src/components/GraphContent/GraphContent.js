import groupBy from 'lodash.groupby'

import { StateCircle, TransitionSet, InitialStateArrow, CommentRect } from '/src/components'
import { useProjectStore, useSelectionStore } from '/src/stores'
import { locateTransition } from '/src/util/states'

const GraphContent = () => {
  const project = useProjectStore(s => s.project)
  const selectedStates = useSelectionStore(s => s.selectedStates)

  // Destructure project to get state
  const states = project?.states ?? []
  const transitions = project?.transitions ?? []
  const comments = project?.comments ?? []
  const initialState = project?.initialState

  // Group up transitions by the start and end nodes
  // We sort the IDs in the pair to make direction not impact grouping
  const groupedTransitions = Object.values(groupBy(transitions, t => [t.from, t.to].sort((a, b) => b - a)))
  const locatedTransitions = groupedTransitions
    .map(transitions => transitions
      .map(t => locateTransition(t, states)) // Resolve location of transition states
      .sort((t1, t2) => t2.from.x < t1.from.x ? 1 : -1 )) // Sort by direction

  return <>
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
      label={s.label}
      cx={s.x}
      cy={s.y}
      isFinal={s.isFinal}
      selected={selectedStates.includes(s.id)}
    />)}

    {/* Render all comments */}
    {comments.map(c => <CommentRect
      key={c.id}
      id={c.id}
      x={c.x}
      y={c.y}
      text={c.text}
    />)}
  </>
}

export default GraphContent
