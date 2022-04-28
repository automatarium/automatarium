import { useEffect, useCallback, useState } from 'react'

import { Dropdown } from '/src/components'

import graphContextItems from './graphContextItems'
import stateContextItems from './stateContextItems'
import transitionContextItems from './transitionContextItems'

const ContextMenus = () => {
  const [context, setContext] = useState({ visible: false })

  const onGraphContext = useCallback(({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: graphContextItems })
  }, [])

  const onStateContext = useCallback(({ detail: { states, x, y } }) => {
    setContext({ visible: true, x, y, items: stateContextItems })
  }, [])

  const onTransitionContext = useCallback(({ detail: { transitions, x, y } }) => {
    setContext({ visible: true, x, y, items: transitionContextItems })
  }, [])

  useEffect(() => {
    document.addEventListener('graphContext', onGraphContext)
    document.addEventListener('stateContext', onStateContext)
    document.addEventListener('transitionContext', onTransitionContext)
    return () => {
      document.removeEventListener('graphContext', onGraphContext)
      document.removeEventListener('stateContext', onStateContext)
      document.removeEventListener('transitionContext', onTransitionContext)
    }
  }, [])

  return (
    <Dropdown
      visible={context.visible}
      onClose={() => setContext({ ...context, visible: false })}
      style={{
        top: `${context.y}px`,
        left: `${context.x}px`,
      }}
      items={context.items}
    />
  )
}

export default ContextMenus
