import { useContext } from 'react'
import { useProjectStore } from '../../stores'
import { MarkerContext } from '/src/providers'
import { STATE_CIRCLE_RADIUS, TRANSITION_SEPERATION, REFLEXIVE_Y_OFFSET, REFLEXIVE_X_OFFSET } from '/src/config/rendering'
import { movePointTowards, lerpPoints, size } from '/src/util/points'
import { dispatchCustomEvent } from '/src/util/events'
import { useSelectionStore } from '/src/stores'
import { pathStyles, pathSelectedClass } from './transitionSetStyle'
import { PositionedTransition } from '/src/util/states'
import { Coordinate, ProjectType } from '/src/types/ProjectTypes'

// const projectType = useProjectStore(s => s.project.config.type)

/**
 * Creates the transition text depending on the project type. Uses the following notation
 * - TM:  read,write;direction
 * - PDA: read,pop;direction
 * - FSA: read
 */
const makeTransitionText = (type: ProjectType, t: PositionedTransition): string => {
  switch (type) {
    case 'TM':
      return `${t.read || 'λ'},${t.write || 'λ'};${t.direction || 'λ'}`
    case 'PDA':
      return `${t.read || 'λ'},${t.pop || 'λ'};${t.push || 'λ'}`
    case 'FSA':
      return t.read || 'λ'
  }
}

/**
 * Return if transition b is to the right of a.
 * It is considered "to the right" if the a.x > b.x but if they are equal then it compares y coordinates
 * (It solved a lot of edge cases having it this way)
 */
const toRightOf = (a: Coordinate, b: Coordinate) => {
  return a.x === b.x ? a.y < b.y : a.x > b.x
}

// Direction that a transition can bend
type BendDirection = 'over' | 'under' | 'straight'

const TransitionSet = ({ transitions } : {transitions: PositionedTransition[]}) => {
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
    return <Transition
      transitions={toRender}
      from={first.from}
      to={first.to}
      id={first.id}
      key={first.id}
      bendDirection={bend}
      projectType={projectType}
    />
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

const Transition = ({
  id,
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

  // Test if the transitions go in both directions. The transitions are sorted by direction, so we only need to check
  // if first and last transition aren't in the same direction

  // We want transitions going from left to right to be bending like a hill and in the other direction bending like
  // a valley
  const bendValue = {
    straight: 0,
    over: -0.5,
    under: 0.5
  }[bendDirection] * TRANSITION_SEPERATION
  // Calculate path
  const { pathData, textPathData, control, normal } = calculateTransitionPath(from, to, bendValue, fullWidth)
  // Convert the normal to degrees
  const degrees = Math.acos(normal.x) * RAD2DEG - 90
  const isReflexive = from.x === to.x && from.y === to.y
  // Generate a unique id for this path
  // -- used to place the text on the same path
  const pathID = `${from.x}${from.y}${to.x}${to.y}`

  // Callbacks for individual transitions
  const handleTransitionMouseUp = (t: PositionedTransition) => e =>
    dispatchCustomEvent('transition:mouseup', {
      originalEvent: e,
      transition: t
    })
  const handleTransitionMouseDown = (t: PositionedTransition) => e =>
    dispatchCustomEvent('transition:mousedown', {
      originalEvent: e,
      transition: t
    })
  const handleTransitionDoubleClick = (t: PositionedTransition) => e =>
    dispatchCustomEvent('editTransition', { id: t.id })

  // Callbacks for the edge

  const handleEdgeMouseDown = e =>
    dispatchCustomEvent('edge:mousedown', { originalEvent: e, transitions })

  // Calculate text offset. We want transitions that curve under to extend downwards and over/straight to extend
  // upwards.
  const offsetDirection = bendDirection === 'under' ? 1 : -1
  const textOffset = (1.2 * offsetDirection) + 'em'
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
      strokeWidth={20}
    />}

    {/*
      Create the text for each transition. We have it grouped under one element to make rotation easier.
      The Y coordinate needs to be lowered to the edge since by default it would appear very high
     */}
    <text
      x={control.x}
      transform={rotate(degrees, control)}
      textAnchor="middle"
      y={control.y + (isReflexive ? REFLEXIVE_Y_OFFSET / 3 : 0)}>
      {transitions.map((t, i) => {
        return <tspan
          dy={bendDirection === 'over' && i === 0 ? '0em' : textOffset}
          key={t.id}
          fill={selectedTransitions.includes(t.id) ? 'var(--primary)' : 'var(--stroke)'}
          onMouseDown={handleTransitionMouseDown(t)}
          onMouseUp={handleTransitionMouseUp(t)}
          onDoubleClick={handleTransitionDoubleClick(t)}
          x={control.x}>
            {makeTransitionText(projectType, t)}
        </tspan>
      })}
    </text>
  </g>
}

const calculateTransitionPath = (
  from: Coordinate, to: Coordinate,
  bendValue: number, fullWidth: boolean): {pathData: string, textPathData: string, control: Coordinate, normal: Coordinate} => {
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
    normal
  }
}

TransitionSet.Transition = Transition

export default TransitionSet