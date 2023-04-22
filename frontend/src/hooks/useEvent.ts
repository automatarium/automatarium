import { useEffect, useCallback, DependencyList } from 'react'
import { SidePanelKey } from '/src/components/Sidepanel/Panels'

/**
 * Mouse event that includes the original event but also adds extra info like where in the view the click was
 * and if it was clicking the SVG
 */
type ExtraMouseEvent = {originalEvent: MouseEvent, didTargetSVG: boolean, viewX: number, viewY: number}

/**
 * Mapping of events to what data the event accepts.
 * If making a custom event just add it here first
 */
export interface CustomEvents {
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
  'svg:mousedown': ExtraMouseEvent
  'svg:mouseup': ExtraMouseEvent
  'state:mouseup': ExtraMouseEvent
  'transition:mouseup': ExtraMouseEvent,
  'comment:mouseup': ExtraMouseEvent,
  'ctx:svg': ExtraMouseEvent,
  'ctx:state': ExtraMouseEvent,
  'ctx:transition': ExtraMouseEvent,
  'ctx:comment': ExtraMouseEvent,
  'bottomPanel:open': { panel: string },
  'bottomPanel:close': null
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
