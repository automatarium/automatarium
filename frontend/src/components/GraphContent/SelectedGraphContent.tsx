import { getGroupedTransitions } from './utils'
import CommentRect from '/src/components/CommentRect/CommentRect'
import StateCircle from '/src/components/StateCircle/StateCircle'
import TransitionSet from '/src/components/TransitionSet/TransitionSet'
import { useProjectStore, useSelectionStore } from '/src/stores'

const SelectedGraphContent = () => {
  const project = useProjectStore(s => s.project)
  const { transitions, states, comments } = project ?? {}
  const selectedTransitionIds = useSelectionStore(s => s.selectedTransitions)
  const selectedStateIds = useSelectionStore(s => s.selectedStates)
  const selectedCommentsIds = useSelectionStore(s => s.selectedComments)

  const selectedTransitions = transitions.filter(t => selectedTransitionIds.includes(t.id))
  const selectedStates = states.filter(s => selectedStateIds.includes(s.id))
  const selectedComments = comments.filter(c => selectedCommentsIds.includes(c.id))

  const locatedTransitions = getGroupedTransitions(selectedTransitions, selectedStates)

  return <>
    {/* Render all sets of edges */}
    {!!locatedTransitions && locatedTransitions.map((transitions, i) => <TransitionSet
      transitions={transitions}
      isTemplate={true}
      key={i}
    />)}

    {/* Render all states */}
    {!!selectedStates && selectedStates.map(s => <StateCircle
      key={s.id}
      id={s.id}
      name={s.name}
      label={s.label}
      cx={s.x}
      cy={s.y}
      isFinal={s.isFinal}
      selected={false}
      stepped={false}
    />)}

    {/* Render all comments */}
    {!!selectedComments && selectedComments.map(c => <CommentRect
      key={c.id}
      id={c.id}
      x={c.x}
      y={c.y}
      text={c.text}
    />)}
  </>
}

export default SelectedGraphContent
