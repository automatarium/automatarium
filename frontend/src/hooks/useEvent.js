import { useEffect, useCallback } from 'react'

const useEvent = (name, handler, dependencies, target=document) => {
  const callback = useCallback(handler, dependencies)
  useEffect(() => {
    target.addEventListener(name, callback)
    return () => target.removeEventListener(name, callback)
  }, [callback])
}

export default useEvent
