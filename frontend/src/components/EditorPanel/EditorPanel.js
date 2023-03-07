import StateCircle from '../StateCircle/StateCircle'
import { GraphContent, GraphView, SelectionBox, TransitionSet, ContextMenus, InputDialogs } from '/src/components'
import {
  useEvent,
  useStateDragging,
  useCommentDragging,
  useCommentSelection,
  useStateCreation,
  useTransitionCreation,
  useCommentCreation,
  useStateSelection,
  useTransitionSelection,
  useContextMenus,
  useDeleteTool,
} from '/src/hooks'

const EditorPanel = () => {
  // Interactivity hooks
  const { select: selectState } = useStateSelection()
  const { select: selectTransition } = useTransitionSelection()
  const { select: selectComment } = useCommentSelection()
  const { startDrag: startStateDrag } = useStateDragging()
  const { startDrag: startCommentDrag } = useCommentDragging()
  const { createTransitionStart, createTransitionEnd } = useTransitionCreation()
  const { ghostState } = useStateCreation()

  useDeleteTool();
  useCommentCreation()
  useContextMenus()

  useEvent('state:mousedown', e => {
    const selectedStateIDs = selectState(e)
    if (e.detail.originalEvent.button === 0) {
      startStateDrag(e, selectedStateIDs)
    }
  })

  useEvent('comment:mousedown', e => {
    const selectedCommentIDs = selectComment(e)
    if (e.detail.originalEvent.button === 0)
      startCommentDrag(e, selectedCommentIDs)
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

      {/* Ghost State */}
      {ghostState && <StateCircle.Ghost cx={ghostState.x} cy={ghostState.y} /> }

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
