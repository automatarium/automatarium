import { MouseEvent, useEffect, useMemo, useState } from 'react'

import { BOX_HANDLE_SIZE } from '/src/config/rendering'
import { useProjectStore } from '/src/stores'
import { Coordinate } from '/src/types/ProjectTypes'
import { dispatchCustomEvent } from '/src/util/events'

import { handleStyle } from './changeTransitionHandleStyle'

type TransitionChangeHandleProps = {
  edges: Coordinate[]
  selectedTransitions: number[]
  isReflexive: boolean
}

type HandleCoordinates = { start: Coordinate, end: Coordinate }

const ChangeTransitionHandlebars = ({ edges, selectedTransitions, isReflexive, ...props }: TransitionChangeHandleProps) => {
  const [isSameEdge, setIsSameEdge] = useState(true)
  const [from, setFrom] = useState<number>()
  const [to, setTo] = useState<number>()

  const { transitions } = useProjectStore.getState()?.project ?? {}

  const calcEdgeUnitVector = (t: HandleCoordinates) => {
    const vec = [t.end.x - t.start.x, t.end.y - t.start.y]
    const mag = Math.sqrt(vec[0] ** 2 + vec[1] ** 2)
    return [vec[0] / mag, vec[1] / mag]
  }

  useEffect(() => {
    const transitionsScope = transitions.filter(t => selectedTransitions.includes(t.id))
    setIsSameEdge(transitionsScope.every(t => t.from === transitionsScope[0].from && t.to === transitionsScope[0].to))
    setFrom(transitionsScope[0].from)
    setTo(transitionsScope[0].to)
  }, [transitions, selectedTransitions])

  const handleStartMouseDown = (e: MouseEvent) => {
    if (isSameEdge) {
      dispatchCustomEvent('transitionhandle:mousedown', {
        originalEvent: e,
        transitionInfo: {
          transitionIds: selectedTransitions,
          fromId: from,
          toId: to,
          isMovingStart: true,
          otherPosition: t.end
        }
      })
    }
  }

  const handleEndMouseDown = (e: MouseEvent) => {
    if (isSameEdge) {
      dispatchCustomEvent('transitionhandle:mousedown', {
        originalEvent: e,
        transitionInfo: {
          transitionIds: selectedTransitions,
          fromId: from,
          toId: to,
          isMovingStart: false,
          otherPosition: t.start
        }
      })
    }
  }

  // Middle-ise co-ordinates
  const t = useMemo<HandleCoordinates>(() => {
    return {
      start: {
        x: edges[0].x,
        y: edges[0].y
      },
      end: {
        x: edges[1].x,
        y: edges[1].y
      }
    }
  }, [edges])

  const tc = useMemo<HandleCoordinates>(() => {
    const m = 4
    if (isReflexive) {
      return {
        start: { x: t.start.x, y: t.start.y - m },
        end: { x: t.end.x, y: t.end.y - m }
      }
    } else {
      const uv = calcEdgeUnitVector(t)
      return {
        start: { x: t.start.x + m * uv[0], y: t.start.y + m * uv[1] },
        end: { x: t.end.x - m * uv[0], y: t.end.y - m * uv[1] }
      }
    }
  }, [t])

  return isSameEdge && <g {...props}>
    <circle
      transform={`translate(${tc.start.x}, ${tc.start.y})`}
      r={BOX_HANDLE_SIZE}
      style={handleStyle}
      onMouseDown={handleStartMouseDown} />
    <circle
      transform={`translate(${tc.end.x}, ${tc.end.y})`}
      r={BOX_HANDLE_SIZE}
      style={handleStyle}
      onMouseDown={handleEndMouseDown} />
  </g>
}

export default ChangeTransitionHandlebars
