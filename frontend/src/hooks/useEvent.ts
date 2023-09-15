import { useEffect, useCallback, DependencyList, MouseEvent } from 'react'
import { SidePanelKey } from '/src/components/Sidepanel/Panels'
import { PositionedTransition } from '/src/util/states'

import { Coordinate } from '/src/types/ProjectTypes'

/**
 * Mouse event that includes the original event but also adds extra info like where in the view the click was
 * and if it was clicking the SVG
 */
export type SVGMouseEventData = { originalEvent: MouseEvent, didTargetSVG: boolean, viewX: number, viewY: number }

export type StateEventData = { originalEvent: MouseEvent, state: { id: number, name: string, cx: number, cy: number } }

export type CommentEventData = { originalEvent: MouseEvent, comment: { id: number, text: string } }
/**
 * Contains information about the click along with the transition that was clicked
 */
export type TransitionEventData = { originalEvent: MouseEvent, transition: PositionedTransition }
export type EdgeEventData = { originalEvent: MouseEvent, transitions: PositionedTransition[] }
/**
 * Mapping of events to what data the event accepts.
 * If making a custom event just add it here first
 */
export interface CustomEvents {
  'editTransition': { id: number },
  'editComment': { id?: number, x: number, y: number },
  'editStateName': { id: number },
  'editStateLabel': { id: number },
  'modal:preferences': null,
  'exportImage': { type: string, clipboard?: boolean } | null,
  'editTransitionGroup': { ids: Array<number> },
  /**
   * Event to open a side panel.
   * @see SidePanelKey for available panels
   */
  'sidepanel:open': { panel: SidePanelKey },
  'modal:shortcuts': null,
  'svg:mousedown': SVGMouseEventData,
  'svg:mouseup': SVGMouseEventData,
  'svg:mousemove': SVGMouseEventData,
  'state:mouseup': StateEventData,
  'state:mousedown': StateEventData,
  'state:dblclick': StateEventData
  'transition:mouseup': TransitionEventData,
  'transition:mousedown': TransitionEventData,
  'transition:dblclick': TransitionEventData,
  /**
   * Context menu events
   */
  'ctx:svg': Coordinate,
  'ctx:state': Coordinate,
  'ctx:transition': Coordinate,
  'ctx:comment': Coordinate,
  'ctx:edge': Coordinate,
  'bottomPanel:open': { panel: string },
  'bottomPanel:close': null,
  'comment:mousedown': CommentEventData,
  'comment:mouseup': CommentEventData,
  'comment:dblclick': CommentEventData,
  /**
   * Called when an edge (The line joining two states) is called. It contains
   * all the transitions that use that edge
   */
  'edge:mousedown': EdgeEventData,
  'edge:mouseup': EdgeEventData,
  'edge:dblclick': EdgeEventData,
  'showWarning': string,
  'modal:deleteConfirm': null,
  'modal:import': null,
  'showSharing': null,
  'stackVisualiser:toggle': { state: boolean }
}

/**
 * The mapping of all available events.
 * It is a combination of our custom events along with DOM events
 */
export type Events = { [K in keyof CustomEvents]: CustomEvent<CustomEvents[K]> } & DocumentEventMap & WindowEventMap

/**
 * What a function that handles an event should look like
 */
type EventHandler<T extends keyof Events> = (e: Events[T]) => void

interface EventOptions {
  target?: Document | Window,
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
