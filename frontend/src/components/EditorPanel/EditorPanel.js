import { GraphContent, GraphView, SelectionBox, TransitionSet, ContextMenus, InputDialogs } from '/src/components'
import {
  useEvent,
  useStateDragging,
  useStateCreation,
  useTransitionCreation,
  useStateSelection,
  useTransitionSelection,
  useContextMenus,
} from '/src/hooks'

const EditorPanel = () => {
  // Interactivity hooks
  const { selectState } = useStateSelection()
  const { selectTransition } = useTransitionSelection()
  const { startDrag } = useStateDragging()
  const { createTransitionStart, createTransitionEnd } = useTransitionCreation()
  useStateCreation()
  useContextMenus()

  // Events
  useEvent('state:mousedown', e => {
    const selectedStateIDs = selectState(e)
    if (e.detail.originalEvent.button === 0)
      startDrag(e, selectedStateIDs)
  })

  useEvent('transition:mousedown', e => {
    selectTransition(e)
  })

  return <>
    <GraphView>
      {/* Render in-creation transition */}
      {createTransitionStart && createTransitionEnd && <TransitionSet.Transition
        fullWidth
        suppressEvents
        from={createTransitionStart}
        to={createTransitionEnd}
        count={1}
      />}
      
      {/* Render states and transitions */}
      <GraphContent />
      
      {/* Render selection marquee */}
      <SelectionBox />
    </GraphView> 
    <ContextMenus />
    <InputDialogs />
  </>
}

export default EditorPanel
