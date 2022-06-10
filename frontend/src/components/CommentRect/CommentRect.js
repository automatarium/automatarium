import { useState, useEffect, useRef } from 'react'

import { CommentContainer } from './commentRectStyle'

const CommentRect = ({ id, x, y, text }) => {
  const containerRef = useRef()
  const [height, setHeight] = useState(150)
  
  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.getBoundingClientRect().height)
    }
  }, [containerRef?.current])
  
  return <foreignObject x={x} y={y} width={150*1.7} height={height}>
    <CommentContainer xmlns="http://www.w3.org/1999/xhtml" ref={containerRef}>
      {text}
    </CommentContainer>
  </foreignObject>
}

export default CommentRect
