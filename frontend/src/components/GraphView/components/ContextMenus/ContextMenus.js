import { useEffect, useCallback, useState } from 'react'

import { Dropdown } from '/src/components'

import stateContextItems from './stateContextItems'
import transitionContextItems from './transitionContextItems'

const ContextMenus = () => {
  const [stateContext, setStateContext] = useState({ visible: false })
  const onStateContext = useCallback(({ detail: { states, x, y } }) => {
    setStateContext({ visible: true, x, y })
  }, [])

  const [transitionContext, setTransitionContext] = useState({ visible: false })
  const onTransitionContext = useCallback(({ detail: { transitions, x, y } }) => {
    setTransitionContext({ visible: true, x, y })
  }, [])

  useEffect(() => {
    document.addEventListener('stateContext', onStateContext)
    document.addEventListener('transitionContext', onTransitionContext)
    return () => {
      document.removeEventListener('stateContext', onStateContext)
      document.removeEventListener('transitionContext', onTransitionContext)
    }
  }, [])

  return (
    <>
      <Dropdown
        visible={stateContext.visible}
        onClose={() => setStateContext({ visible: false })}
        style={{
          top: `${stateContext.y}px`,
          left: `${stateContext.x}px`,
        }}
        items={stateContextItems}
      />

      <Dropdown
        visible={transitionContext.visible}
        onClose={() => setTransitionContext({ visible: false })}
        style={{
          top: `${transitionContext.y}px`,
          left: `${transitionContext.x}px`,
        }}
        items={transitionContextItems}
      />
    </>
  )
}

export default ContextMenus
