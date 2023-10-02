import StateCircle from '/src/components/StateCircle/StateCircle'
import TransitionSet from '/src/components/TransitionSet/TransitionSet'
import { getGroupedTransitions } from './utils'
import { useProjectStore, useSelectionStore } from '/src/stores'

const SelectedGraphContent = () => {
  const project = useProjectStore(s => s.project)
  const { transitions, states } = project ?? {}
  const selectedTransitionIds = useSelectionStore(s => s.selectedTransitions)
  const selectedStateIds = useSelectionStore(s => s.selectedStates)

  const selectedTransitions = transitions.filter(t => selectedTransitionIds.includes(t.id))
  const selectedStates = states.filter(s => selectedStateIds.includes(s.id))

  const locatedTransitions = getGroupedTransitions(selectedTransitions, selectedStates)

  return <>
    {/* Render all sets of edges */}
    {locatedTransitions.map((transitions, i) => <TransitionSet
      transitions={transitions}
      key={i}
    />)}

    {/* Render all states */}
    {selectedStates.map(s => <StateCircle
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
  </>
}

export default SelectedGraphContent
