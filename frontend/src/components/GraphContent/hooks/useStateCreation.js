import { useEffect, useCallback } from 'react'

import { useProjectStore, useViewStore, useToolStore } from '/src/stores'

const useStateCreation = ({ containerRef }) => {
  const tool = useToolStore(s => s.tool)
  const toolActive = tool === 'state'
  const createState = useProjectStore(s => s.createState)
  const commit = useProjectStore(s => s.commit)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)

  const handleMouseDown = useCallback(e => {
    if (e.target === containerRef.current && toolActive) {
      const [vx, vy] = screenToViewSpace(e.clientX, e.clientY, containerRef.current)
      createState({ x: vx, y: vy })
      commit()
    }
  }, [toolActive, containerRef?.current])

  // Setup event listeners
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.addEventListener('mousedown', handleMouseDown)
      return () => containerRef.current.removeEventListener('mousedown', handleMouseDown)
    }
  }, [containerRef?.current, handleMouseDown])
}

export default useStateCreation
