import { useEffect, useCallback } from 'react'

const useEvent = (name, handler, dependencies, {
  target = document,
  options
} = {}) => {
  const callback = useCallback(handler, dependencies)
  useEffect(() => {
    target.addEventListener(name, callback, options)
    return () => target.removeEventListener(name, callback, options)
  }, [callback])
}

export default useEvent
