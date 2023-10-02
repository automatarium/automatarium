import StateCircle from '/src/components/StateCircle/StateCircle'
import TransitionSet from '/src/components/TransitionSet/TransitionSet'
import { getGroupedTransitions } from './utils'
import { useProjectStore, useSelectionStore } from '/src/stores'
import { useMemo } from 'react'

const SelectedGraphContent = () => {
  const project = useProjectStore(s => s.project)
  const { transitions, states } = project ?? {}
  const selectedTransitionIds = useSelectionStore(s => s.selectedTransitions)
  const selectedStateIds = useSelectionStore(s => s.selectedStates)

  const selectedTransitions = useMemo(() => transitions.filter(t => selectedTransitionIds.includes(t.id)), [transitions])
  const selectedStates = useMemo(() => states.filter(s => selectedStateIds.includes(s.id)), [states])

  const locatedTransitions = useMemo(() =>
    getGroupedTransitions(selectedTransitions, selectedStates),
  [selectedStateIds, selectedTransitionIds])

  return <>
    {/* Render all sets of edges */}
    {locatedTransitions.map((transitions, i) => <TransitionSet
      transitions={transitions}
      isTemplate={true}
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
