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
  useContextMenus
} from '/src/hooks'
import { SelectionEvent } from '/src/hooks/useResourceSelection'
import { useSelectionStore } from '/src/stores'

const EditorPanel = () => {
  // Interactivity hooks
  const { select: selectState } = useStateSelection()
  const { select: selectTransition } = useTransitionSelection()
  const { select: selectComment } = useCommentSelection()
  const { startDrag: startStateDrag } = useStateDragging()
  const { startDrag: startCommentDrag } = useCommentDragging()
  const { createTransitionStart, createTransitionEnd } = useTransitionCreation()
  const { ghostState } = useStateCreation()

  const selectedStates = useSelectionStore(s => s.selectedStates)
  const selectedComments = useSelectionStore(s => s.selectedComments)

  useCommentCreation()
  useContextMenus()

  const handleDragging = (e: SelectionEvent) => {
    if (e.detail.originalEvent.button === 0) {
      // Only try and check if the user is selecting a new resource if the event correlates with that.
      // Else just use the previous value from the store
      const selStates = e.type === 'state:mousedown' ? selectState(e) : selectedStates
      const selComments = e.type === 'comment:mousedown' ? selectComment(e) : selectedComments

      startStateDrag(e, selStates)
      startCommentDrag(e, selComments)
    }
  }

  // Setup dragging for comments and states
  useEvent('state:mousedown', handleDragging)
  useEvent('comment:mousedown', handleDragging)

  useEvent('transition:mousedown', e => {
    selectTransition(e)
  })

  useEvent('edge:mousedown', e => {
    // We want to call the selectTransition so that if holding shift and selecting two edges
    // the two sets of transitions will be selected (Instead of unselecting one and selecting the other)
    const newEvent = {
      ...e,
      detail: {
        ...e.detail,
        ids: e.detail.transitions.map(t => t.id)
      }
    }
    selectTransition(newEvent)
  })

  return <>
    <GraphView>
      {/* Render in-creation transition. Since we aren't rendering text it doesn't matter what the project is */}
      {createTransitionStart && createTransitionEnd && <TransitionSet.Transition
        fullWidth
        suppressEvents
        from={createTransitionStart}
        to={createTransitionEnd}
        count={1}
        projectType="FSA"
        id={-1}
        transitions={[]}
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
