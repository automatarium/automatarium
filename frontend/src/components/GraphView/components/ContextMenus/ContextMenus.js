import { useEffect, useCallback, useState } from 'react'

import { Dropdown } from '/src/components'

import stateContextItems from './stateContextItems'

const ContextMenus = () => {
  const [stateContext, setStateContext] = useState({ visible: false })
  const onStateContext = useCallback(({ detail: { states, x, y } }) => {
    setStateContext({ visible: true, x, y })
  }, [])

  useEffect(() => {
    document.addEventListener('stateContext', onStateContext)
    return () => document.removeEventListener('stateContext', onStateContext)
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
    </>
  )
}

export default ContextMenus
