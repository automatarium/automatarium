import { useEffect, useCallback, DependencyList } from 'react'

/**
 * Mapping of events to what data the event accepts.
 * If making a custom event just add it here first
 */
export interface Events {
  'editTransition': {id: number},
  'editComment': {id: number, x: number, y: number},
  'editStateName': {id: number},
  'editStateLabel': {id: number},
  'svg:mousedown': {originalEvent: MouseEvent, didTargetSVG: boolean, viewX: number, viewY: number}
  'svg:mouseup': {originalEvent: MouseEvent, didTargetSVG: boolean, viewX: number, viewY: number}

}

/**
 * We need to account for the two types of events that can be handled.
 * Depending on which event map it comes from we need to change the paramter type to that
 */
// eslint-disable-next-line no-undef
type EventHandler<T> = (e: T extends keyof Events ? CustomEvent<Events[T]> : T extends keyof DocumentEventMap ? DocumentEventMap[T]: never) => void

interface EventOptions {
  target?: Document,
  // eslint-disable-next-line no-undef
  options?: boolean | AddEventListenerOptions
}

// eslint-disable-next-line no-undef
const useEvent = <T extends keyof HTMLElementEventMap | keyof Events>(name: T, handler: EventHandler<T>,
  dependencies?: DependencyList, {
    target = document,
    options
  } = {} as EventOptions) => {
  const callback = useCallback(handler, dependencies)
  useEffect(() => {
    target.addEventListener(name as string, callback, options)
    return () => target.removeEventListener(name as string, callback, options)
  }, [callback])
}

export default useEvent
