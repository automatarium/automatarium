import { useState } from 'react'

import { Dropdown } from '/src/components'
import { useEvent } from '/src/hooks'

import graphContextItems from './graphContextItems'
import stateContextItems from './stateContextItems'
import transitionContextItems from './transitionContextItems'
import commentContextItems from './commentContextItems'
import edgeContextItems from './edgeContextItems'
import { ContextItems } from './contextItem'

const ContextMenus = () => {
  const [context, setContext] = useState<{visible: boolean, x: number, y: number, items: ContextItems}>()

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

  useEvent('ctx:edge', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: edgeContextItems })
  }, [])

  useEvent('ctx:close', () => {
    setContext({ ...context, visible: false })
  }, [])

  if (!context?.visible) return null
  return (
    <Dropdown
      visible={context.visible}
      onClose={() => setContext({ ...context, visible: false })}
      style={{
        top: `${context.y}px`,
        left: `${context.x}px`
      }}
      items={context.items}
    />
  )
}

export default ContextMenus
