import { useEffect, useRef, useCallback, useState } from 'react'

import { GraphContent, SelectionBox, Dropdown } from '/src/components'
import { MarkerProvider } from '/src/providers'
import { useViewStore } from '/src/stores'
import { VIEW_MOVE_STEP, GRID_SNAP } from '/src/config/interactions'

import { Svg } from './graphViewStyle'
import { useViewDragging } from './hooks'

const stateContextItems = [
  {
    label: 'Set as initial',
    action: 'SET_STATE_INITIAL',
  },
  {
    label: 'Set as final',
    action: 'SET_STATE_FINAL',
  },
  'hr',
  {
    label: 'Set  label',
    action: 'SET_STATE_LABEL',
  },
  'hr',
  {
    label: 'Change name',
    action: 'SET_STATE_NAME',
  },
  'hr',
  {
    label: 'Copy',
    action: 'COPY',
  },
  {
    label: 'Paste',
    action: 'PASTE',
  },
  'hr',
  {
    label: 'Delete',
    shortcut: '⌫',
    action: 'DELETE'
  },
]

const GraphView = props => {
  const containerRef = useRef()
  const { position, size, scale, setViewSize, moveViewPosition } = useViewStore()
  useViewDragging(containerRef)

  // Update width and height on resize
  const onContainerResize = useCallback(() => {
    const b = containerRef.current.getBoundingClientRect()
    setViewSize({ width: b.width, height: b.height })
  }, [])

  // Keep track of resizes
  // TODO: use onResize of container
  useEffect(() => {
    if (containerRef.current) {
      onContainerResize()
      window.addEventListener('resize', onContainerResize)
      return () => window.removeEventListener('resize', onContainerResize)
    }
  }, [])

  // Keyboard commands for view control
  const onKeyDown = useCallback(e => {
    if (e.code === 'ArrowRight')
      moveViewPosition({ x: VIEW_MOVE_STEP })
    if (e.code === 'ArrowLeft')
      moveViewPosition({ x: -VIEW_MOVE_STEP })
    if (e.code === 'ArrowDown')
      moveViewPosition({ y: VIEW_MOVE_STEP })
    if (e.code === 'ArrowUp')
      moveViewPosition({ y: -VIEW_MOVE_STEP })
  })

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // TODO: Move this and the context menu to a separate file
  const [stateContext, setStateContext] = useState({ visible: false })
  const onStateContext = useCallback(({ detail: { states, x, y } }) => {
    setStateContext({ visible: true, x, y })
  }, [])

  useEffect(() => {
    document.addEventListener('stateContext', onStateContext)
    return () => document.removeEventListener('stateContext', onStateContext)
  }, [])

  // Determine svg background (grid)
  const backgroundPosition = `${-position.x / scale}px ${-position.y / scale}px`
  const backgroundSize = `${1 / scale * GRID_SNAP * 2}px ${1 / scale * GRID_SNAP * 2}px`
  const showGrid = true

  const viewBox = `${position.x} ${position.y} ${scale*size.width} ${scale*size.height}`
  return (
    <>
      <Svg
        onContextMenu={e => e.preventDefault()}
        viewBox={viewBox}
        ref={containerRef}
        $showGrid={showGrid}
        {...props}
        style={{ backgroundSize, backgroundPosition, ...props.style }}>
        <MarkerProvider>
          <g>
            {/* Graph states and transitions */}
            <GraphContent containerRef={containerRef} />

            {/* Selection Drag Box */}
            <SelectionBox containerRef={containerRef} />
          </g>
        </MarkerProvider>
      </Svg>

      <Dropdown
        visible={stateContext.visible}
        onClose={() => setStateContext({ visible: false })}
        style={{
          top: `${stateContext.y}px`,
          left: `${stateContext.x}px`,
        }}
        items={stateContextItems}
      />
    </>
  )
}

export default GraphView
