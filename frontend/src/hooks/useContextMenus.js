import { useCallback } from 'react'

import useEvent from '/src/hooks/useEvent'
import { dispatchEvent } from '/src/util/events'

const useContextMenus = () => {
  const showContext = name => useCallback(e => {
    if (e.detail.originalEvent.button === 2) {
      dispatchEvent(name, {
        x: e.detail.originalEvent.clientX,
        y: e.detail.originalEvent.clientY,
      })
    }
  }, [])

  // Set context handlers
  useEvent('svg:mouseup', showContext('ctx:svg'))
  useEvent('state:mouseup', showContext('ctx:state'))
  useEvent('transition:mouseup', showContext('ctx:transition'))
}

export default useContextMenus
