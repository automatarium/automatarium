import { useState } from 'react'
import { useProjectStore, usePDAVisualiserStore, useTMSimResultStore } from '/src/stores'
import './stackVisualiser.css'

const PDAStackVisualiser = () => {
  // Closes and shows the PDA stack visualiser.
  const [showStackTab, setShowStackTab] = useState(true)

  const traceIDx = useTMSimResultStore((s) => s.traceIDx)
  const stackInfo = usePDAVisualiserStore((s) => s.stack)
  const projectType = useProjectStore((s) => s.project.config.type)

  // Stack
  const stack = []
  let currentStack

  // Stores stack variables
  if (stackInfo?.trace) {
    if (stackInfo.trace[traceIDx]) {
      currentStack = stackInfo.trace[traceIDx].currentStack
      for (let i = 0; i < currentStack.length; i++) {
        stack.push({ element: currentStack[i], key: i })
      }
    }
  }

  // Displays the stack
  function displayStack () {
    return stack
      .slice(0)
      .reverse()
      .map((x) => {
        return <div key={x.key} className="stack-item">{x.element}</div>
      })
  }

  return (
    projectType === 'PDA' && (
      <div className="content-container">
        {/* =========== Title and Tab button =========== */}
        Display Stack{' '}
        <button
          className="close-stack-btn"
          onClick={() => setShowStackTab((e) => !e)}
        >
          {showStackTab ? '-' : '+' }
        </button>
        {/* =========== Displays the stack =========== */}
        {showStackTab
          ? (
          <div className="stack-container">
            <h3>Stack</h3>
            <div className="stack-container">
              {displayStack()}
            </div>
          </div>
            )
          : null}
      </div>
    )
  )
}

export default PDAStackVisualiser
