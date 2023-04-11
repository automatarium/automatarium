import { useEffect, useCallback, DependencyList } from 'react'

/**
 * Specifies what a function should look like that handles an event.
 * This saves us specifying the `detail` parameter everywhere and makes some logic simplier
 */
type EventHandler<T> = (arg: {detail: T}) => void

/**
 * Mapping of events to what data the event accepts.
 * If making a custom event just add it here first
 */
export interface Events {
  'editTransition': {id: number},
  'editComment': {id: number, x: number, y: number},
  'editStateName': {id: number},
  'editStateLabel': {id: number},
}

interface EventOptions {
  target: Document,
  options?: any // boolean | AddEventListenerOptions
}

const useEvent = <T extends keyof Events>(name: T, handler: EventHandler<Events[T]>,
  dependencies?: DependencyList, {
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
