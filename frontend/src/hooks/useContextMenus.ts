import { useCallback } from 'react'
import useEvent, {
  CommentEventData,
  CustomEvents,
  EdgeEventData,
  StateEventData,
  SVGMouseEventData,
  TransitionEventData
} from '/src/hooks/useEvent'
import { dispatchCustomEvent } from '/src/util/events'
import useContextStore from '../stores/useContextStore'

const useContextMenus = () => {
  const setContext = useContextStore(ctx => ctx.setContext)
  type EventData = CustomEvent<StateEventData | SVGMouseEventData | TransitionEventData | CommentEventData | EdgeEventData>
  const showContext = (name: keyof CustomEvents) => useCallback((e: EventData) => {
    setContext(e.detail.ctx)
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
  useEvent('edge:mouseup', showContext('ctx:edge'))
}

export default useContextMenus
