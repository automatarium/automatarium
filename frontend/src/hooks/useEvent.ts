import { useEffect, useCallback, DependencyList } from 'react'

/**
 * Mapping of events to what the handler should look like.
 * Add another item into here when making an event
 */
export interface Events {
  'test': (a: number) => void
}

interface EventOptions {
  target: Document,
  options?: any // boolean | AddEventListenerOptions
}

const useEvent = <T extends keyof Events>(name: T, handler: Events[T], dependencies?: DependencyList, {
  target = document,
  options
} = {} as EventOptions) => {
  const callback = useCallback(handler, dependencies)
  useEffect(() => {
    // Callbacks need to be converted to 'any' since we are using our own events, not browser defined ones
    target.addEventListener(name, callback as any, options)
    return () => target.removeEventListener(name, callback as any, options)
  }, [callback])
}

export default useEvent
