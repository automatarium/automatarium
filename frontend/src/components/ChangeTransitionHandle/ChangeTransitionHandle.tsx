import { MouseEvent, useEffect, useState } from 'react'
import { handleStyle } from './changeTransitionHandleStyle'
import { BOX_HANDLE_SIZE } from '/src/config/rendering'
import { useProjectStore } from '/src/stores'
import { Coordinate } from '/src/types/ProjectTypes'
import { dispatchCustomEvent } from '/src/util/events'

type TransitionChangeHandleProps = {
  edges: Coordinate[]
  selectedTransitions: number[]
}

type RectCoords = { start: Coordinate, end: Coordinate }

const ChangeTransitionHandlebars = ({ edges, selectedTransitions, ...props }: TransitionChangeHandleProps) => {
  const [isSameEdge, setIsSameEdge] = useState(true)
  const [from, setFrom] = useState<number>()
  const [to, setTo] = useState<number>()

  // Middle-ise co-ordinates
  const t: RectCoords = {
    start: {
      x: edges[0].x,
      y: edges[0].y
    },
    end: {
      x: edges[1].x,
      y: edges[1].y
    }
  }

  useEffect(() => {
    const { transitions } = useProjectStore.getState()?.project ?? {}
    const transitionsScope = transitions.filter(t => selectedTransitions.includes(t.id))
    setIsSameEdge(transitionsScope.every(t => t.from === transitionsScope[0].from && t.to === transitionsScope[0].to))
    setFrom(transitionsScope[0].from)
    setTo(transitionsScope[0].to)
  }, [selectedTransitions])

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

  return <g {...props}>
    <circle
      transform={`translate(${t.start.x}, ${t.start.y})`}
      r={BOX_HANDLE_SIZE}
      style={handleStyle}
      onMouseDown={handleStartMouseDown} />
    <circle
      transform={`translate(${t.end.x}, ${t.end.y})`}
      r={BOX_HANDLE_SIZE}
      style={handleStyle}
      onMouseDown={handleEndMouseDown} />
  </g>
}

export default ChangeTransitionHandlebars
