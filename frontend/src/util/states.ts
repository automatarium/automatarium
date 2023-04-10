// Quantify the position of a transition using a list of states
export const locateTransition = (t, states) => {
  const fromState = states.find(s => s.id === t.from)
  const toState = states.find(s => s.id === t.to)
  return {
    ...t,
    from: { x: fromState.x, y: fromState.y },
    to: { x: toState.x, y: toState.y }
  }
}
