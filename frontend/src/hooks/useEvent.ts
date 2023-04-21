import { useEffect, useCallback, DependencyList } from 'react'

/**
 * Mapping of events to what data the event accepts.
 * If making a custom event just add it here first
 */
export interface CustomEvents {
  'editTransition': {id: number},
  'editComment': {id: number, x: number, y: number},
  'editStateName': {id: number},
  'editStateLabel': {id: number},
  'svg:mousedown': {originalEvent: MouseEvent, didTargetSVG: boolean, viewX: number, viewY: number}
  'svg:mouseup': {originalEvent: MouseEvent, didTargetSVG: boolean, viewX: number, viewY: number}

}

/**
 * The mapping of all available events.
 * It is a combination of our custom events along with DOM events
 */
// eslint-disable-next-line no-undef
export type Events = {[K in keyof CustomEvents]: CustomEvent<CustomEvents[K]>} & DocumentEventMap

/**
 * What a function that handles an event should look like
 */
type EventHandler<T extends keyof Events> = (e: Events[T]) => void

interface EventOptions {
  target?: Document,
  // eslint-disable-next-line no-undef
  options?: boolean | AddEventListenerOptions
}

// eslint-disable-next-line no-undef
const useEvent = <T extends keyof Events>(name: T, handler: EventHandler<T>,
  dependencies?: DependencyList, {
    target = document,
    options
  } = {} as EventOptions) => {
  const callback = useCallback(handler, dependencies)
  useEffect(() => {
    target.addEventListener(name, callback, options)
    return () => target.removeEventListener(name, callback, options)
  }, [callback])
}

export default useEvent
