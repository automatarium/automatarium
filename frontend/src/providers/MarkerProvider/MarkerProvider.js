import { useEffect, useRef, createContext } from 'react'

export const MarkerContext = createContext('marker')

const MarkerProvider = ({ children }) => {
  const standardArrowHead = 'standard-arrow-head'

  return <>
    {/*SVG Definitions*/}
    <defs>
      {/*Standard Arrowhead Definition*/}
      <marker
        id={standardArrowHead}
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        orient="auto"
        markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="black" />
      </marker>
    </defs>

    {/*Provide context to children*/}
    <MarkerContext.Provider value={{ standardArrowHead }}>
      { children }
    </MarkerContext.Provider>
    
  </>
}

export default MarkerProvider
