import StateCircle from '../StateCircle/StateCircle'
import { GraphContent, GraphView, SelectionBox, TransitionSet, ContextMenus, InputDialogs, InputTransitionGroup } from '/src/components'
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
  useTemplateInsert,
  useContextMenus
} from '/src/hooks'
import { SelectionEvent } from '/src/hooks/useResourceSelection'
import { useSelectionStore, useTemplateStore } from '/src/stores'
import { CommentEventData, EdgeEventData, StateEventData, TransitionEventData } from '/src/hooks/useEvent'
import TemplateGhost from '../Template/TemplateGhost'

const EditorPanel = () => {
  // Interactivity hooks
  const { select: selectState } = useStateSelection()
  const { select: selectTransition } = useTransitionSelection()
  const { select: selectComment } = useCommentSelection()
  const { startDrag: startStateDrag } = useStateDragging()
  const { startDrag: startCommentDrag } = useCommentDragging()
  const { createTransitionStart, createTransitionEnd } = useTransitionCreation()
  const { ghostState } = useStateCreation()
  const { ghostTemplate } = useTemplateInsert()

  let selectedStates = useSelectionStore(s => s.selectedStates)
  let selectedComments = useSelectionStore(s => s.selectedComments)

  const setStates = useSelectionStore(s => s.setStates)
  const setComments = useSelectionStore(s => s.setComments)
  const setTransitions = useSelectionStore(s => s.setTransitions)

  const template = useTemplateStore(s => s.template)

  useCommentCreation()
  useContextMenus()

  const handleDragging = (e: SelectionEvent) => {
    const isLeftClick = e.detail.originalEvent.button === 0
    // When the user isn't holding shift and is just clicking then we need to check if we
    // need to clear their selection.
    if (!e.detail.originalEvent.shiftKey && isLeftClick) {
      // Runs a test to see if the item being selected in the event is already selected.
      // If it isn't then we forget what we have selected before
      const testEvent = (eventKey: string, ids: number[]) => {
        if (eventKey in e.detail) {
          if (!ids.includes(e.detail[eventKey].id)) {
            selectedComments = []
            selectedStates = []
          }
        }
      }
      testEvent('comment', selectedComments)
      testEvent('state', selectedStates)
    }
    // Only try and check if the user is selecting a new resource if the event correlates with that.
    // Else just use the previous value from the store.
    const selStates = e.type === 'state:mousedown' ? selectState(e) : selectedStates
    const selComments = e.type === 'comment:mousedown' ? selectComment(e) : selectedComments
    if (isLeftClick) {
      // Only drag if a left click.
      // We still allow selecting via right click so the user can directly click + edit something
      startStateDrag(e, selStates)
      startCommentDrag(e, selComments)
    }
  }

  // Setup dragging for comments and states
  useEvent('state:mousedown', handleDragging)
  useEvent('comment:mousedown', handleDragging)

  useEvent('transition:mousedown', selectTransition)

  const handleDoubleClick = (e: CustomEvent<StateEventData | TransitionEventData | CommentEventData>) => {
    // Return array of selected item. If event isn't for the key then just return empty so it unselects
    const getOrEmpty = (key: string): number[] => key in e.detail ? [e.detail[key].id] : []
    setStates(getOrEmpty('state'))
    setTransitions(getOrEmpty('transition'))
    setComments(getOrEmpty('comment'))
  }

  useEvent('state:dblclick', handleDoubleClick)
  useEvent('comment:dblclick', handleDoubleClick)
  useEvent('transition:dblclick', handleDoubleClick)

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
  useEvent('edge:dblclick', (e: CustomEvent<EdgeEventData>) => {
    setStates([])
    setComments([])
    setTransitions(e.detail.transitions.map(t => t.id))
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

      {/* Ghost template */}
      {ghostTemplate && <TemplateGhost template={template} mousePos={{ x: ghostTemplate.x, y: ghostTemplate.y }} />}

      {/* Render states and transitions */}
      <GraphContent />

      {/* Render selection marquee */}
      <SelectionBox />
    </GraphView>
    <ContextMenus />
    <InputDialogs />
    <InputTransitionGroup />
  </>
}

export default EditorPanel
