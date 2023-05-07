import { useState, useEffect, useRef, MouseEvent } from 'react'

import { dispatchCustomEvent } from '/src/util/events'
import { useSelectionStore, useViewStore } from '/src/stores'

import { commentStyles, commentSelectedClass } from './commentRectStyle'
import { CustomEvents } from '/src/hooks/useEvent'

interface CommentRectProps {
  id: number
  x: number,
  y: number,
  text: string
}

const CommentRect = ({ id, x, y, text }: CommentRectProps) => {
  const containerRef = useRef<HTMLDivElement>()
  const [size, setSize] = useState({ height: 30, width: 30 })
  const selectedComments = useSelectionStore(s => s.selectedComments)
  const selected = selectedComments.includes(id)

  useEffect(() => {
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect()
      const { scale } = useViewStore.getState()
      setSize({
        height: bounds.height * scale,
        width: bounds.width * scale
      })
    }
  }, [containerRef?.current, text, x, y])

  const dispatchMouseEvent = (name: keyof CustomEvents) => (e: MouseEvent) =>
    dispatchCustomEvent(name, {
      originalEvent: e,
      comment: { id, text }
    })

  return <foreignObject x={x} y={y} {...size}>
    <div
      ref={containerRef}
      onMouseDown={dispatchMouseEvent('comment:mousedown')}
      onMouseUp={dispatchMouseEvent('comment:mouseup')}
      onDoubleClick={dispatchMouseEvent('comment:dblclick')}
      style={commentStyles}
      className={(selected && commentSelectedClass) || undefined}
    >{text}</div>
  </foreignObject>
}

export default CommentRect
