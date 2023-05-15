import groupBy from 'lodash.groupby'

import { AutomataTransition, Coordinate, Template } from '/src/types/ProjectTypes'
import { moveStatesToMouse } from '/src/hooks/useTemplateInsert'
import StateCircle from '../StateCircle/StateCircle'
import TransitionSet from '../TransitionSet/TransitionSet'
import { PositionedTransition, locateTransition } from '/src/util/states'

const TemplateGhost = ({ template, mousePos }: {template: Template, mousePos: Coordinate}) => {
  const templateCopy = structuredClone(template)
  moveStatesToMouse(mousePos, templateCopy.states)
  // Next few lines are from GraphContent.tsx, perhaps should make this its own function?
  const groupedTransitions = Object.values(groupBy(templateCopy.transitions, t => [t.from, t.to].sort((a, b) => b - a))) as AutomataTransition[][]
  const locatedTransitions = groupedTransitions
    .map(transitions => transitions
      .map((t): PositionedTransition => locateTransition(t, templateCopy.states)) // Resolve location of transition states
      // Sort by direction. If the x coordinates are the same then compare by Y axis
      .sort((t1, t2) => (t2.from.x === t1.from.x ? t2.from.y < t1.from.y : t2.from.x < t1.from.x) ? 1 : -1))
  return <>
    {templateCopy.states.map((state, key) => (
        <StateCircle.Ghost key={key} cx={state.x} cy={state.y} />
    ))}
    {locatedTransitions.map((transitions, i) => <TransitionSet
      transitions={transitions}
      isGhost={true}
      key={i}
    />)}
  </>
}

export default TemplateGhost
