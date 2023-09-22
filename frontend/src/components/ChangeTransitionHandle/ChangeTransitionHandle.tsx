import { MouseEvent, useEffect, useState } from 'react'
import { handleStyle } from './changeTransitionHandleStyle'
import { BOX_HANDLE_SIZE } from '/src/config/rendering'
import { dispatchCustomEvent } from '/src/util/events'
import { Coordinate } from '/src/types/ProjectTypes'
import { useProjectStore, useToolStore, useViewStore } from '/src/stores'
import { useEvent } from '/src/hooks'
import TransitionSet from '../TransitionSet/TransitionSet'

type TransitionChangeHandleProps = {
  edges: Coordinate[]
  selectedTransitions: number[]
}

type RectCoords = { start: Coordinate, end: Coordinate }

const ChangeTransitionHandlebars = ({ edges, selectedTransitions, ...props }: TransitionChangeHandleProps) => {
  const tool = useToolStore(s => s.tool)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)

  const [isSameEdge, setIsSameEdge] = useState(true)
  const [from, setFrom] = useState<number>()
  const [to, setTo] = useState<number>()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Coordinate>(null)
  const [dragCursor, setDragCursor] = useState<[number, number]>(null)

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

  useEffect(() => {
    const { transitions } = useProjectStore.getState()?.project ?? {}
    const transitionsScope = transitions.filter(t => selectedTransitions.includes(t.id))
    setIsSameEdge(transitions.every(t => t.from === transitionsScope[0].from && t.to === transitionsScope[0].to))
    setFrom(transitionsScope[0].from)
    setTo(transitionsScope[0].to)
  }, [selectedTransitions])

  const handleStartMouseDown = (e: MouseEvent) => {
    setDragStart(t.start)
    if (isSameEdge) {
      setIsDragging(true)
      dispatchCustomEvent('transitionhandle:mousedown', {
        originalEvent: e,
        transitionInfo: {
          transitionIds: selectedTransitions,
          fromId: from,
          toId: to,
          isStart: true
        }
      })
    }
  }

  useEvent('transitionhandle:mousedown', e => {
    setDragCursor(screenToViewSpace(e.detail.originalEvent.clientX, e.detail.originalEvent.clientY))
  })

  useEvent('state:mouseup', e => {
    if (tool === 'cursor' && e.detail.originalEvent.button === 0 && isDragging) {
      console.log(e.detail)
      setIsDragging(false)
      // dispatchCustomEvent('transitionhandle:mouseup', {
      //   originalEvent: e,
      //   transitionInfo: {
      //     transitionIds: selectedTransitions,
      //     fromId: from,
      //     toId: to,
      //     isStart: false
      //   }
      // })
    }
    setDragStart(null)
    setDragCursor(null)
  }, [tool, isDragging])

  const handleEndMouseDown = (e: MouseEvent) => {
    setDragStart(t.end)
    if (isSameEdge) {
      setIsDragging(true)
      dispatchCustomEvent('transitionhandle:mousedown', {
        originalEvent: e,
        transitionInfo: {
          transitionIds: selectedTransitions,
          fromId: from,
          toId: to,
          isStart: false
        }
      })
    }
  }

  useEvent('svg:mousemove', e => {
    setDragCursor([e.detail.viewX, e.detail.viewY])
  }, [tool, isDragging, dragStart])

  return <>
    <g {...props}>
      <rect
        transform={`translate(${t.start.x}, ${t.start.y})`}
        width={BOX_HANDLE_SIZE}
        height={BOX_HANDLE_SIZE}
        style={handleStyle}
        onMouseDown={handleStartMouseDown} />
      <rect
        transform={`translate(${t.end.x}, ${t.end.y})`}
        width={BOX_HANDLE_SIZE}
        height={BOX_HANDLE_SIZE}
        style={handleStyle}
        onMouseDown={handleEndMouseDown} />
    </g>
    {dragStart && dragCursor && <TransitionSet.Transition
      fullWidth
      suppressEvents
      from={dragStart}
      to={{ x: dragCursor[0], y: dragCursor[1] }}
      projectType='FSA'
      id={-1}
      transitions={[]}
    />}
  </>
}

export default ChangeTransitionHandlebars
