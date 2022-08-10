import { useState } from 'react'

import { Dropdown } from '/src/components'
import { useEvent } from '/src/hooks'

import graphContextItems from './graphContextItems'
import stateContextItems from './stateContextItems'
import transitionContextItems from './transitionContextItems'
import commentContextItems from './commentContextItems'

const ContextMenus = () => {
  const [context, setContext] = useState({ visible: false })

  useEvent('ctx:svg', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: graphContextItems })
  }, [])

  useEvent('ctx:state', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: stateContextItems })
  }, [])

  useEvent('ctx:transition', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: transitionContextItems })
  }, [])

  useEvent('ctx:comment', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: commentContextItems })
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
