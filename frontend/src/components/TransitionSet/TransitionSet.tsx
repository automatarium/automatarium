import { MouseEvent, useContext } from 'react'
import { useProjectStore } from '../../stores'
import { MarkerContext } from '/src/providers'
import { STATE_CIRCLE_RADIUS, TRANSITION_SEPERATION, REFLEXIVE_Y_OFFSET, REFLEXIVE_X_OFFSET } from '/src/config/rendering'
import { movePointTowards, lerpPoints, size } from '/src/util/points'
import { dispatchCustomEvent } from '/src/util/events'
import { useSelectionStore } from '/src/stores'
import { pathStyles, pathSelectedClass, ghostStyles } from './transitionSetStyle'
import { PositionedTransition } from '/src/util/states'
import { assertType, Coordinate, PDAAutomataTransition, ProjectType, TMAutomataTransition } from '/src/types/ProjectTypes'

/**
 * Creates the transition text depending on the project type. Uses the following notation
 * - TM:  read,write;direction
 * - PDA: read,pop;direction
 * - FSA: read
 */
const makeTransitionText = (type: ProjectType, t: PositionedTransition): string => {
  // Since the type can't be narrowed, we need to narrow ourselves inside the blocks
  switch (type) {
    case 'TM':
      assertType<TMAutomataTransition>(t)
      return `${t.read || 'λ'},${t.write || 'λ'};${t.direction || 'λ'}`
    case 'PDA':
      assertType<PDAAutomataTransition>(t)
      return `${t.read || 'λ'},${t.pop || 'λ'};${t.push || 'λ'}`
    case 'FSA':
      return t.read || 'λ'
  }
}

// Direction that a transition can bend
type BendDirection = 'over' | 'under' | 'straight'

const getBendValue = (direction: BendDirection): number => (
  {
    straight: 0,
    over: -0.5,
    under: 0.5
  }[direction] * TRANSITION_SEPERATION
)

/**
 * Return if transition b is to the right of a.
 * It is considered "to the right" if the a.x > b.x but if they are equal then it compares y coordinates
 * (It solved a lot of edge cases having it this way)
 */
const toRightOf = (a: Coordinate, b: Coordinate) => {
  return a.x === b.x ? a.y < b.y : a.x > b.x
}

const TransitionSet = ({ transitions, isGhost = false } : {transitions: PositionedTransition[], isGhost?: boolean}) => {
  const projectType = useProjectStore(s => s.project.config.type)
  // Split the transitions into the two directions (left->right and right->left)
  // This makes the code easier since we don't need to handle direction changes
  // Named over and under since
  const over = [] as PositionedTransition[]
  const under = [] as PositionedTransition[]
  transitions.forEach(t => {
    if (toRightOf(t.from, t.to)) under.push(t)
    else over.push(t)
  })

  const renderTransition = (toRender: PositionedTransition[], bend: BendDirection) => {
    // The transitions sent should all start and end the same, so we only need to get the values
    // from the first transition
    const first = toRender[0]
    const props = { from: first.from, to: first.to, key: first.id, bendDirection: bend }
    if (isGhost) {
      return <TransitionSet.Ghost {...props}/>
    } else {
      return <Transition
        transitions={toRender}
        id={first.id}
        projectType={projectType}
        {...props}
      />
    }
  }
  // We don't bend the transition if only rendering in one direction
  const isStraight = (over.length === 0 && under.length > 0) || (over.length > 0 && under.length === 0) ? 'straight' : ''
  // Now render both over and under sets of transitions
  return <>
    {over.length > 0 && renderTransition(over, isStraight || 'over')}
    {under.length > 0 && renderTransition(under, isStraight || 'under')}
  </>
}

type TransitionProps = {
  id: number,
  transitions: PositionedTransition[],
  count?: number,
  from: Coordinate,
  to: Coordinate,
  projectType: ProjectType,
  fullWidth?: boolean,
  bendDirection?: BendDirection,
  suppressEvents?: boolean
}

/**
 * Returns the transform text to rotate an SVG element
 */
const rotate = (degrees: number, centre: Coordinate): string => `rotate(${degrees}, ${centre.x}, ${centre.y})`

const RAD2DEG = 180 / Math.PI

/**
 * Calculates the coordinate of a point along a quadratic curve
 * @param a The first point to use (This will be a point on a state circle)
 * @param b The control point (This is the midpoint between the two states)
 * @param c Third point to use (Will also be a point on a state circle)
 * @param t Value in range 0-1 of where to get point (0 being left, 0.5 middle, etc)
 */
const calcPoint = (a: Coordinate, b: Coordinate, c: Coordinate, t: number): Coordinate => {
  /**
   * Calculate the coordinate along one axis (X or Y).
   * From here: https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B%C3%A9zier_curves
   */
  const forAxis = (a: number, b: number, c: number): number =>
    Math.pow(1 - t, 2) * a + 2 * (1 - t) * t * b + Math.pow(t, 2) * c
  return {
    x: forAxis(a.x, b.x, c.x),
    y: forAxis(a.y, b.y, c.y)
  }
}

const Transition = ({
  transitions = [],
  from,
  to,
  projectType,
  bendDirection = 'straight',
  fullWidth = false,
  suppressEvents = false
} : TransitionProps) => {
  const { standardArrowHead, selectedArrowHead } = useContext(MarkerContext)

  const selectedTransitions = useSelectionStore(s => s.selectedTransitions)
  const setSelected = transitions.some(t => selectedTransitions.includes(t.id))

  // We want transitions going from left to right to be bending like a hill and in the other direction bending like
  // a valley
  const bendValue = getBendValue(bendDirection)
  // Calculate path
  const { pathData, textPathData, control, normal, edges } = calculateTransitionPath(from, to, bendValue, fullWidth)
  // Convert the normal to degrees
  const degrees = Math.acos(normal.x) * RAD2DEG - 90
  const isReflexive = from.x === to.x && from.y === to.y
  // Generate a unique id for this path
  const pathID = `${from.x}${from.y}${to.x}${to.y}`
  // Calculate the midpoint of the curve which is where we will place the text
  const midPoint = calcPoint(edges[0], control, edges[1], 0.5)

  // Callbacks for individual transitions
  const handleTransitionMouseUp = (t: PositionedTransition) => (e: MouseEvent) =>
    dispatchCustomEvent('transition:mouseup', {
      originalEvent: e,
      transition: t
    })
  const handleTransitionMouseDown = (t: PositionedTransition) => (e: MouseEvent) =>
    dispatchCustomEvent('transition:mousedown', {
      originalEvent: e,
      transition: t
    })
  const handleTransitionDoubleClick = (t: PositionedTransition) => (e: MouseEvent) => {
    dispatchCustomEvent('editTransition', { id: t.id })
    // Needs to be a different event since this takes the whole transition object but editTransition only supports IDs
    // The need for the whole object is so that it is inline with the other events
    dispatchCustomEvent('transition:dblclick', { originalEvent: e, transition: t })
  }

  // Callbacks for the edge

  const handleEdgeMouseDown = (e: MouseEvent) =>
    dispatchCustomEvent('edge:mousedown', { originalEvent: e, transitions })

  const handleEdgeDoubleClick = (e: MouseEvent) =>
    dispatchCustomEvent('edge:dblclick', { originalEvent: e, transitions })

  // Calculate text offset. We want transitions that curve under to extend downwards and over/straight to extend
  // upwards.
  const offsetDirection = bendDirection === 'under' ? 1 : -1
  // The offset for each transition label from each other
  const textOffset = (1.2 * offsetDirection) + 'em'
  // Offset of the first transition label from the edge.
  // 'under' transitions require more spacing
  const initialOffset = ((bendDirection === 'under' ? 1 : 0.3) * offsetDirection) + 'em'

  return <g>
    {/* The edge itself */}
    <path
      id={pathID}
      d={pathData}
      key={pathID}
      markerEnd={`url(#${setSelected || (isReflexive && setSelected) ? selectedArrowHead : standardArrowHead})`}
      style={pathStyles}
      className={((setSelected || (isReflexive && setSelected)) && pathSelectedClass) || undefined}
    />

    {/* Invisible path used to place text */}
    <path id={`${pathID}-text`} d={textPathData} key={`${pathID}-text`} stroke='none' fill='none' />

    {/* Thicker invisible path used to select the transition */}
    {!suppressEvents && <path
      id={pathID}
      d={pathData}
      key={`${pathID}-selection`}
      stroke='transparent'
      fill='none'
      onMouseDown={handleEdgeMouseDown}
      onDoubleClick={handleEdgeDoubleClick}
      strokeWidth={20}
    />}

    <text
      {...midPoint}
      transform={rotate(degrees, midPoint)}
      textAnchor="middle">
        {transitions.map((t, i) => {
          return <tspan
            dy={i === 0 ? initialOffset : textOffset}
            key={t.id}
            fill={selectedTransitions.includes(t.id) ? 'var(--primary)' : 'var(--stroke)'}
            onMouseDown={handleTransitionMouseDown(t)}
            onMouseUp={handleTransitionMouseUp(t)}
            onDoubleClick={handleTransitionDoubleClick(t)}
            x={midPoint.x}>
              {makeTransitionText(projectType, t)}
          </tspan>
        })}
    </text>
  </g>
}

const calculateTransitionPath = (
  from: Coordinate, to: Coordinate,
  bendValue: number, fullWidth: boolean): {pathData: string, textPathData: string, control: Coordinate, normal: Coordinate, edges: Coordinate[]} => {
  // Is this path reflexive
  const isReflexive = from.x === to.x && from.y === to.y

  // Determine control position
  // -- this is determined by moving along the normal to the difference between the states
  // -- with the distance moved controlled by the `bend` value
  const [left, right] = toRightOf(from, to) ? [from, to] : [to, from]
  const center = lerpPoints(left, right, 0.5)
  const tangent = { x: left.x - right.x, y: left.y - right.y }
  const a = Math.PI / 2
  const orth = { x: tangent.x * Math.cos(a) - tangent.y * Math.sin(a), y: tangent.x * Math.sin(a) + tangent.y * Math.cos(a) }
  const normal = size(orth) > 0 ? { x: orth.x / size(orth), y: orth.y / size(orth) } : { x: 0, y: 0 }
  const control = isReflexive
    ? { x: left.x, y: left.y - REFLEXIVE_Y_OFFSET }
    : { x: center.x + bendValue * normal.x, y: center.y + bendValue * normal.y }

  // Translate control points (Used for reflexive paths)
  const translatedControl1 = !isReflexive ? control : { ...control, x: control.x - REFLEXIVE_X_OFFSET }
  const translatedControl2 = !isReflexive ? control : { ...control, x: control.x + REFLEXIVE_X_OFFSET }

  // We connect the edge to the closest point on each circle from the control point
  // (If fullWidth is set we move it just far enough to prevent accidental click events)
  const edge1 = fullWidth
    ? movePointTowards(from, translatedControl1, 2)
    : movePointTowards(from, translatedControl1, STATE_CIRCLE_RADIUS)
  const edge2 = fullWidth
    ? movePointTowards(to, translatedControl2, 2)
    : movePointTowards(to, translatedControl2, STATE_CIRCLE_RADIUS)

  // Generate the path data
  const pathData = `M${edge1.x}, ${edge1.y} Q${control.x}, ${control.y} ${edge2.x}, ${edge2.y}`
  const pathReversed = `M${edge2.x}, ${edge2.y} Q${control.x}, ${control.y} ${edge1.x}, ${edge1.y}`

  // Calculate the angle of the line
  const angle = Math.atan2(edge2.y - edge1.y, edge2.x - edge1.x) * 180 / Math.PI

  return {
    pathData,
    textPathData: (angle > 90 || angle <= -90) ? pathReversed : pathData,
    control,
    normal,
    edges: [edge1, edge2]
  }
}

TransitionSet.Transition = Transition

TransitionSet.Ghost = ({ from, to, bendDirection }) => {
  const pathID = `${from.x}${from.y}${to.x}${to.y}`
  const bendValue = getBendValue(bendDirection)
  const { pathData } = calculateTransitionPath(from, to, bendValue, false)
  return <path
    id={pathID}
    d={pathData}
    key={pathID}
    style={ghostStyles}
  />
}

export default TransitionSet
