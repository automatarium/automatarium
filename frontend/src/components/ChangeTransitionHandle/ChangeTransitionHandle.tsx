import { MouseEvent } from 'react'
import { handleStyle } from './changeTransitionHandleStyle'
import { BOX_HANDLE_SIZE } from '/src/config/rendering'
import { dispatchCustomEvent } from '/src/util/events'
import { Coordinate } from '/src/types/ProjectTypes'

type TransitionChangeHandleProps = {
  edges: Coordinate[]
  selectedTransitions: number[]
}

type RectCoords = { start: Coordinate, end: Coordinate }

const ChangeTransitionHandlebars = ({ edges, selectedTransitions, ...props }: TransitionChangeHandleProps) => {
  console.log(selectedTransitions)
  const isSameEdge = true
  const id = 0
  const from = 0
  const to = 0

  const handleStartMouseUp = (e: MouseEvent) => {
    dispatchCustomEvent('transitionhandle:mouseup', {
      originalEvent: e,
      transitionInfo: {
        transitionId: id,
        fromId: from,
        toId: to,
        isStart: true
      }
    })
  }

  const handleStartMouseDown = (e: MouseEvent) => {
    dispatchCustomEvent('transitionhandle:mousedown', {
      originalEvent: e,
      transitionInfo: {
        transitionId: id,
        fromId: from,
        toId: to,
        isStart: true
      }
    })
  }

  const handleEndMouseUp = (e: MouseEvent) => {
    dispatchCustomEvent('transitionhandle:mouseup', {
      originalEvent: e,
      transitionInfo: {
        transitionId: id,
        fromId: from,
        toId: to,
        isStart: false
      }
    })
  }

  const handleEndMouseDown = (e: MouseEvent) => {
    dispatchCustomEvent('transitionhandle:mousedown', {
      originalEvent: e,
      transitionInfo: {
        transitionId: id,
        fromId: from,
        toId: to,
        isStart: false
      }
    })
  }

  // Middle-ise co-ordinates
  const t: RectCoords = {
    start: {
      x: edges[0].x - BOX_HANDLE_SIZE / 2,
      y: edges[0].y - BOX_HANDLE_SIZE / 2
    },
    end: {
      x: edges[1].x - BOX_HANDLE_SIZE / 2,
      y: edges[1].y - BOX_HANDLE_SIZE / 2
    }
  }

  return isSameEdge && <g {...props}>
    <rect
      transform={`translate(${t.start.x}, ${t.start.y})`}
      width={BOX_HANDLE_SIZE}
      height={BOX_HANDLE_SIZE}
      style={handleStyle}
      onMouseUp={handleStartMouseUp}
      onMouseDown={handleStartMouseDown} />
    <rect
      transform={`translate(${t.end.x}, ${t.end.y})`}
      width={BOX_HANDLE_SIZE}
      height={BOX_HANDLE_SIZE}
      style={handleStyle}
      onMouseUp={handleEndMouseUp}
      onMouseDown={handleEndMouseDown} />
  </g>
}

export default ChangeTransitionHandlebars
