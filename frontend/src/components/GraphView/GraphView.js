import { useEffect, useRef, useCallback } from 'react'

import { MarkerProvider } from '/src/providers'
import { useViewStore, useToolStore, usePreferencesStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'
import { dispatchCustomEvent } from '/src/util/events'

import { Wrapper, Svg } from './graphViewStyle'
import { useViewDragging, useImageExport } from './hooks'

const GraphView = ({ children, ...props }) => {
  const wrapperRef = useRef()
  const svgRef = useRef()
  const { position, size, scale, setViewSize, setSvgElement, screenToViewSpace } = useViewStore()
  const tool = useToolStore(state => state.tool)
  useViewDragging(svgRef)
  useImageExport(svgRef)

  // Update width and height on resize
  const onContainerResize = useCallback(() => {
    const b = wrapperRef.current?.getBoundingClientRect()
    b && setViewSize({ width: b.width, height: b.height })
  }, [])

  const onContainerMouseDown = useCallback(e => {
    const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
    dispatchCustomEvent('svg:mousedown', {
      originalEvent: e,
      didTargetSVG: e.target === svgRef?.current,
      viewX, viewY
    })
  }, [])

  const onContainerMouseUp = useCallback(e => {
    const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
    dispatchCustomEvent('svg:mouseup', {
      originalEvent: e,
      didTargetSVG: e.target === svgRef?.current,
      viewX, viewY
    })
  }, [])

  const onContainerMouseMove = useCallback(e => {
    const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
    dispatchCustomEvent('svg:mousemove', {
      originalEvent: e,
      didTargetSVG: e.target === svgRef?.current,
      viewX, viewY
    })
  }, [])

  // Keep track of resizes
  useEffect(() => {
    if (svgRef.current) {
      // Update reference
      setSvgElement(svgRef.current)

      // Manage resizing of view
      onContainerResize()
      window.addEventListener('resize', onContainerResize)

      // Setup handlers
      svgRef.current.addEventListener('mousedown', onContainerMouseDown)
      svgRef.current.addEventListener('mouseup', onContainerMouseUp)
      svgRef.current.addEventListener('mousemove', onContainerMouseMove)

      // Unset handlers
      return () => {
        window.removeEventListener('resize', onContainerResize)
        svgRef.current?.removeEventListener('mousedown', onContainerMouseDown)
        svgRef.current?.removeEventListener('mouseup', onContainerMouseUp)
        svgRef.current?.removeEventListener('mousedown', onContainerMouseMove)
      }
    }
  }, [svgRef.current])

  // Add a resize observer to the wrapper div
  useEffect(() => {
    if (wrapperRef.current) {
      const resizeObserver = new ResizeObserver(onContainerResize)
      resizeObserver.observe(wrapperRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [wrapperRef.current])

  // Determine svg background (grid)
  const backgroundPosition = `${-position.x / scale}px ${-position.y / scale}px`
  const backgroundSize = `${1 / scale * GRID_SNAP * 2}px ${1 / scale * GRID_SNAP * 2}px`
  const gridVisible = usePreferencesStore(state => state.preferences.showGrid)

  const viewBox = `${position.x} ${position.y} ${scale*size.width} ${scale*size.height}`
  return (
    <Wrapper ref={wrapperRef}>
      <Svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"

        onContextMenu={e => e.preventDefault()}
        viewBox={viewBox}
        ref={svgRef}
        $showGrid={gridVisible}
        $tool={tool}
        {...props}
        style={{
          strokeLinejoin: 'round',
          strokeLinecap: 'round',
          strokeWidth: '2px',
          backgroundSize,
          backgroundPosition,
          ...props.style,
        }}>
        <MarkerProvider>
          <g id="automatarium-graph">{children}</g>
        </MarkerProvider>
      </Svg>
    </Wrapper>
  )
}

export default GraphView
