import { StateCircle, TransitionSet } from '/src/components'
import { MarkerProvider } from '/src/providers'

const GraphView = () => {
  return <svg>
    <MarkerProvider>
      <g>
        {/* Render all edges */}
        <TransitionSet transitions={[[{cx: 50, cy: 50}, {cx: 230, cy: 70}]]} />

        {/* Then render all states */}
        <StateCircle label='q1' cx={50} cy={50} />
        <StateCircle label='q2' isFinal={true} cx={230} cy={70} />
      </g>
    </MarkerProvider>
  </svg>
}

export default GraphView
