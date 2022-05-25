import { GraphContent, GraphView, SelectionBox, TransitionSet } from '/src/components'
import { useEvent } from '/src/hooks'

import { ContextMenus, InputDialogs } from '../'
import {
  useStateDragging,
  useStateCreation,
  useTransitionCreation,
  useStateSelection,
  useTransitionSelection
} from '../../hooks'

const EditorPanel = () => {
  // Selection hooks
  const { selectState } = useStateSelection()
  const { selectTransition } = useTransitionSelection()

  // Dragging hooks
  const { startDrag } = useStateDragging()

  // Creation hooks
  const { createTransitionStart, createTransitionEnd } = useTransitionCreation()
  useStateCreation()

  // Events
  useEvent('state:mousedown', e => {
    const selectedStateIDs = selectState(e)
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
