import { useEffect, useCallback, DependencyList } from 'react'
import { SidePanelKey } from '/src/components/Sidepanel/Panels'

/**
 * Specifies what a function should look like that handles an event.
 * This saves us specifying the `detail` parameter everywhere and makes some logic simplier
 */
type EventHandler<T> = (arg: CustomEvent<T>) => void

/**
 * Mapping of events to what data the event accepts.
 * If making a custom event just add it here first
 */
export interface Events {
  'editTransition': {id: number},
  'editComment': {id?: number, x: number, y: number},
  'editStateName': {id: number},
  'editStateLabel': {id: number},
  'modal:preferences': null,
  'exportImage': {type: string, clipboard?: boolean} | null,
  /**
   * Event to open a side panel.
   * @see SidePanelKey for available panels
   */
  'sidepanel:open': {panel: SidePanelKey},
  'modal:shortcuts': null,
  'svg:mouseup': {didTargetSVG: boolean, originalEvent: MouseEvent}
}

interface EventOptions {
  target?: Document,
  // eslint-disable-next-line no-undef
  options?: boolean | AddEventListenerOptions
}

const useEvent = <T extends keyof Events>(name: T, handler: EventHandler<Events[T]>,
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
