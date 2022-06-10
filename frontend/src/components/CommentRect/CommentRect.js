import { useCallback, useState, useEffect, useRef } from 'react'

import { dispatchCustomEvent } from '/src/util/events'

import { CommentContainer } from './commentRectStyle'

const CommentRect = ({ id, x, y, text }) => {
  const containerRef = useRef()
  const [height, setHeight] = useState(150)
  
  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.getBoundingClientRect().height)
    }
  }, [containerRef?.current])
  
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
  
  return <foreignObject x={x} y={y} width={150*1.7} height={height}>
    <CommentContainer
      xmlns="http://www.w3.org/1999/xhtml"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}>
        {text}
    </CommentContainer>
  </foreignObject>
}

export default CommentRect
