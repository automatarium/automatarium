import { StateCircle, TransitionSet, InitialStateArrow, CommentRect } from '/src/components'
import { useProjectStore, useSelectionStore, useSteppingStore } from '/src/stores'
import { getGroupedTransitions } from './utils'

const GraphContent = () => {
  const project = useProjectStore(s => s.project)
  const selectedStates = useSelectionStore(s => s.selectedStates)
  const steppedStateIDs = useSteppingStore(s => s.steppedStates)

  // Destructure project to get state
  const states = project?.states ?? []
  const transitions = project?.transitions ?? []
  const comments = project?.comments ?? []
  const initialState = project?.initialState

  const locatedTransitions = getGroupedTransitions(transitions, states)

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
