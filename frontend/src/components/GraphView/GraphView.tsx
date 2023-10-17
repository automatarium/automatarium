import React, { useEffect, useRef, useCallback, HTMLAttributes, ReactNode, useState } from 'react'

import { MarkerProvider } from '/src/providers'
import { useViewStore, useToolStore, usePreferencesStore, useProjectStore } from '/src/stores'
import { useImageExport } from '/src/hooks'
import { GRID_SNAP } from '/src/config/interactions'
import COLORS from '/src/config/colors'
import { dispatchCustomEvent } from '/src/util/events'

import { Wrapper, Svg } from './graphViewStyle'
import { useViewDragging } from './hooks'
import { calculateZoomFit } from '/src/hooks/useActions'

interface GraphViewProps extends HTMLAttributes<SVGElement>{
  children: ReactNode
  $selectedOnly?: boolean
}

const GraphView = ({ children, $selectedOnly: $isTemplate = false, ...props }: GraphViewProps) => {
  const wrapperRef = useRef<HTMLDivElement>()
  const svgRef = useRef<SVGSVGElement>()
  const { position, size, scale, setViewSize, setSvgElement, screenToViewSpace } = useViewStore()
  const projectColor = useProjectStore(state => state.project?.config.color)
  const colorPref = usePreferencesStore(state => state.preferences.color)
  const tool = useToolStore(state => state.tool)
  const setViewPositionAndScale = useViewStore(s => s.setViewPositionAndScale)
  const [resizeView, setResizeView] = useState(true)
  useViewDragging(svgRef)
  useImageExport()

  // Update width and height on resize
  const onContainerResize = useCallback(() => {
    const b = wrapperRef.current?.getBoundingClientRect()
    if (!b) return
    setViewSize({ width: b.width, height: b.height })
    // Check if we are able to zoom fit and if we are meant to zoom fit.
    // This only needs to run once, but we need to check multiple times
    // since the SVG doesn't load initially
    const zoomFit = calculateZoomFit()
    if (resizeView && zoomFit) {
      const { scale, x, y } = zoomFit
      // Set a min scale so it doesn't zoom in too much (Smaller scale means more zoomed in)
      setViewPositionAndScale({ x, y }, Math.max(scale, 1))
      setResizeView(false)
    }
  }, [])

  const onContainerMouseDown = useCallback((e: MouseEvent) => {
    const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
    dispatchCustomEvent('svg:mousedown', {
      originalEvent: e as unknown as React.MouseEvent,
      didTargetSVG: e.target === svgRef?.current,
      viewX,
      viewY,
      ctx: null
    })
  }, [])

  const onContainerMouseUp = useCallback((e: MouseEvent) => {
    const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
    dispatchCustomEvent('svg:mouseup', {
      originalEvent: e as unknown as React.MouseEvent,
      didTargetSVG: e.target === svgRef?.current,
      viewX,
      viewY,
      ctx: null
    })
  }, [])

  const onContainerMouseMove = useCallback((e: MouseEvent) => {
    const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
    dispatchCustomEvent('svg:mousemove', {
      originalEvent: e as unknown as React.MouseEvent,
      didTargetSVG: e.target === svgRef?.current,
      viewX,
      viewY,
      ctx: null
    })
  }, [])

  // Keep track of resizes
  !$isTemplate && useEffect(() => {
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
  !$isTemplate && useEffect(() => {
    if (wrapperRef.current) {
      const resizeObserver = new ResizeObserver(onContainerResize)
      resizeObserver.observe(wrapperRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [wrapperRef.current])

  // Set color theme
  useEffect(() => {
    const color = COLORS[(projectColor !== '' && projectColor) || 'orange']
    svgRef.current.style.setProperty('--primary-h', color.h.toString())
    svgRef.current.style.setProperty('--primary-s', color.s + '%')
    svgRef.current.style.setProperty('--primary-l', color.l + '%')
  }, [projectColor, colorPref])

  // Determine svg background (grid)
  const backgroundPosition = `${-position.x / scale}px ${-position.y / scale}px`
  const backgroundSize = `${1 / scale * GRID_SNAP * 2}px ${1 / scale * GRID_SNAP * 2}px`
  const gridVisible = usePreferencesStore(state => state.preferences.showGrid)

  const viewBox = `${position.x} ${position.y} ${scale * size.width} ${scale * size.height}`
  const svgId = $isTemplate ? 'selected-graph' : 'automatarium-graph'
  return (
    <Wrapper ref={wrapperRef} id='editor-panel-wrapper'>
      <Svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        id={svgId}

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
          ...props.style
        }}>
        <MarkerProvider>
          <g>{children}</g>
        </MarkerProvider>
      </Svg>
    </Wrapper>
  )
}

export default GraphView
