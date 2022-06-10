import { useState, useEffect, useRef } from 'react'

import { dispatchCustomEvent } from '/src/util/events'
import { useSelectionStore } from '/src/stores'

import { CommentContainer } from './commentRectStyle'

const CommentRect = ({ id, x, y, text }) => {
  const containerRef = useRef()
  const [height, setHeight] = useState(150)
  const selectedComments = useSelectionStore(s => s.selectedComments)
  const selected = selectedComments.includes(id)
  
  useEffect(() => {
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect()
      setHeight(bounds.height + 10)
    }
  }, [containerRef?.current, text])
  
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
  
  return <foreignObject x={x} y={y} width={255} height={height}>
    <CommentContainer
      xmlns="http://www.w3.org/1999/xhtml"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      $selected={selected}>
        {text}
    </CommentContainer>
  </foreignObject>
}

export default CommentRect
