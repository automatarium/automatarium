import { useCallback } from 'react'
import useEvent, {
  CommentEventData,
  CustomEvents,
  StateEventData,
  SVGMouseEventData,
  TransitionEventData
} from '/src/hooks/useEvent'
import { dispatchCustomEvent } from '/src/util/events'

const useContextMenus = () => {
  type EventData = CustomEvent<StateEventData | SVGMouseEventData | TransitionEventData | CommentEventData>
  const showContext = (name: keyof CustomEvents) => useCallback((e: EventData) => {
    if (e.detail.originalEvent.button === 2) {
      dispatchCustomEvent(name, {
        x: e.detail.originalEvent.clientX,
        y: e.detail.originalEvent.clientY
      })
    }
  }, [])

  // Set context handlers
  useEvent('svg:mouseup', showContext('ctx:svg'))
  useEvent('state:mouseup', showContext('ctx:state'))
  useEvent('transition:mouseup', showContext('ctx:transition'))
  useEvent('comment:mouseup', showContext('ctx:comment'))
}

export default useContextMenus
