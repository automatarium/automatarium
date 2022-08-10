import { useState, useEffect, useRef } from 'react'

import { dispatchCustomEvent } from '/src/util/events'
import { useSelectionStore, useViewStore } from '/src/stores'

import { commentStyles, commentSelectedClass } from './commentRectStyle'

const CommentRect = ({ id, x, y, text }) => {
  const containerRef = useRef()
  const [size, setSize] = useState({ height: 30, width: 30 })
  const selectedComments = useSelectionStore(s => s.selectedComments)
  const selected = selectedComments.includes(id)

  useEffect(() => {
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect()
      const { scale } = useViewStore.getState()
      setSize({
        height: bounds.height*scale,
        width: bounds.width*scale,
      })
    }
  }, [containerRef?.current, text, x, y])

  const handleMouseDown = e =>
    dispatchCustomEvent('comment:mousedown', {
      originalEvent: e,
      comment: { id, text },
    })
  const handleMouseUp = e =>
    dispatchCustomEvent('comment:mouseup', {
      originalEvent: e,
      comment: { id, text },
    })

  return <foreignObject x={x} y={y} {...size}>
    <div
      xmlns="http://www.w3.org/1999/xhtml"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={commentStyles}
      className={(selected && commentSelectedClass) || undefined}
    >{text}</div>
  </foreignObject>
}

export default CommentRect
