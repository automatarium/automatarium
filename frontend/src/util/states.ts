// Quantify the position of a transition using a list of states
import { AutomataState, AutomataTransition, Coordinate } from '/src/types/ProjectTypes'

/**
 * Like normal AutomataTransition except the `from` and `to` properties have been expanded
 * into full coordinates
 */
export interface PositionedTransition extends Omit<AutomataTransition, 'from' | 'to'> {
  from: Coordinate,
  to: Coordinate
}

export const locateTransition = (t: AutomataTransition, states: AutomataState[]): PositionedTransition => {
  const fromState = states.find(s => s.id === t.from)
  const toState = states.find(s => s.id === t.to)
  return {
    ...t,
    from: { x: fromState.x, y: fromState.y },
    to: { x: toState.x, y: toState.y }
  }
}
