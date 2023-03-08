import { createContext } from 'react'

import { ARROWHEAD_ANGLE as a, ARROWHEAD_LENGTH as l } from '/src/config/rendering'

export const MarkerContext = createContext('marker')

const MarkerProvider = ({ children }) => {
  // Define marker ids
  const standardArrowHead = 'standard-arrow-head'
  const selectedArrowHead = 'selected-arrow-head'
  const lineArrowHead = 'line-arrow-head'

  // Calculate marker bounding box
  const markerWidth = 30
  const markerHeight = 30
  const markerRefX = markerWidth - 1
  const markerRefY = markerHeight / 2

  // Calculate arrow verts
  const arrowStart = `M${markerRefX}, ${markerRefY}`
  const arrowTopLeft = `L${markerRefX - l * Math.cos(a)} ${markerRefY - l * Math.sin(a)}`
  const arrowBottomLeft = `L${markerRefX - l * Math.cos(-a)} ${markerRefY - l * Math.sin(-a)}`

  return <>
    {/* SVG Definitions */}
    <defs>
      {/* Standard Arrowhead Definition */}
      <marker
        id={standardArrowHead}
        markerWidth={markerWidth}
        markerHeight={markerHeight}
        refX={markerRefX}
        refY={markerRefY}
        orient="auto"
        markerUnits="strokeWidth">
        <path d={`${arrowStart} ${arrowTopLeft} ${arrowBottomLeft} z`} fill="var(--stroke)" />
      </marker>

      {/* Selected Arrowhead Definition */}
      <marker
        id={selectedArrowHead}
        markerWidth={markerWidth}
        markerHeight={markerHeight}
        refX={markerRefX}
        refY={markerRefY}
        orient="auto"
        markerUnits="strokeWidth">
        <path d={`${arrowStart} ${arrowTopLeft} ${arrowBottomLeft} z`} fill="var(--primary)" />

      </marker>
      {/* Line Arrowhead Definition */}
      <marker
        id={lineArrowHead}
        markerWidth={markerWidth}
        markerHeight={markerHeight}
        refX={markerRefX}
        refY={markerRefY}
        orient="auto"
        markerUnits="strokeWidth">
      <path d={`${arrowStart} ${arrowTopLeft} ${arrowStart} ${arrowBottomLeft}`} stroke="var(--stroke)" />
      </marker>
    </defs>

    {/* Provide context to children */}
    <MarkerContext.Provider value={{ standardArrowHead, selectedArrowHead, lineArrowHead }}>
      { children }
    </MarkerContext.Provider>
  </>
}

export default MarkerProvider
