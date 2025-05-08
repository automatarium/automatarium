import { useState } from 'react'

import { Dropdown } from '/src/components'
import { useEvent } from '/src/hooks'
import { useTranslation } from 'react-i18next'

import graphContextItems from './graphContextItems'
import stateContextItems from './stateContextItems'
import transitionContextItems from './transitionContextItems'
import commentContextItems from './commentContextItems'
import edgeContextItems from './edgeContextItems'
import { ContextItems } from './contextItem'

const ContextMenus = () => {
  const { t } = useTranslation('common')
  const [context, setContext] = useState<{visible: boolean, x: number, y: number, items: ContextItems}>()

  useEvent('ctx:svg', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: graphContextItems(t) })
  }, [])

  useEvent('ctx:state', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: stateContextItems(t) })
  }, [])

  useEvent('ctx:transition', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: transitionContextItems(t) })
  }, [])

  useEvent('ctx:comment', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: commentContextItems(t) })
  }, [])

  useEvent('ctx:edge', ({ detail: { x, y } }) => {
    setContext({ visible: true, x, y, items: edgeContextItems(t) })
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
