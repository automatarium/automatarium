import groupBy from 'lodash.groupby'

import { AutomataState, AutomataTransition, BaseAutomataTransition } from '/src/types/ProjectTypes'
import { PositionedTransition, locateTransition } from '/src/util/states'

/** Group up transitions by the start and end nodes
 *  We sort the IDs in the pair to make direction not impact grouping
 */
export const getGroupedTransitions = (transitions: BaseAutomataTransition[], states: AutomataState[]) => {
  const groupedTransitions = Object.values(groupBy(transitions, t => [t.from, t.to].sort((a, b) => b - a))) as AutomataTransition[][]
  return groupedTransitions
    .map(transitions => transitions
      .map((t): PositionedTransition => locateTransition(t, states)) // Resolve location of transition states
      // Sort by direction. If the x coordinates are the same then compare by Y axis
      .sort((t1, t2) => (t2.from.x === t1.from.x ? t2.from.y < t1.from.y : t2.from.x < t1.from.x) ? 1 : -1))
}
