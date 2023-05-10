import groupBy from 'lodash.groupby'

import { StateCircle, TransitionSet, InitialStateArrow, CommentRect } from '/src/components'
import { useProjectStore, useSelectionStore, useSteppingStore } from '/src/stores'
import { locateTransition, PositionedTransition } from '/src/util/states'
import { AutomataTransition } from '/src/types/ProjectTypes'

const GraphContent = () => {
  const project = useProjectStore(s => s.project)
  const selectedStates = useSelectionStore(s => s.selectedStates)
  const steppedStateIDs = useSteppingStore(s => s.steppedStates)

  // Destructure project to get state
  const states = project?.states ?? []
  const transitions = project?.transitions ?? []
  const comments = project?.comments ?? []
  const initialState = project?.initialState

  // Group up transitions by the start and end nodes
  // We sort the IDs in the pair to make direction not impact grouping
  const groupedTransitions = Object.values(groupBy(transitions, t => [t.from, t.to].sort((a, b) => b - a))) as AutomataTransition[][]
  const locatedTransitions = groupedTransitions
    .map(transitions => transitions
      .map((t): PositionedTransition => locateTransition(t, states)) // Resolve location of transition states
      // Sort by direction. If the x coordinates are the same then compare by Y axis
      .sort((t1, t2) => (t2.from.x === t1.from.x ? t2.from.y < t1.from.y : t2.from.x < t1.from.x) ? 1 : -1))

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
      stepped={steppedStateIDs.includes(s.id)}
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
