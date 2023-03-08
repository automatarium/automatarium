import { useState } from 'react'
import { useEvent, useStateSelection, useTransitionSelection, useCommentSelection } from '/src/hooks'
import { useToolStore, useProjectStore, useSelectionStore } from '/src/stores'

// Combine the selection of a resource with their delete action ()
const useDeleteTool = () => {
  const tool = useToolStore(s => s.tool)
  const { select: selectState } = useStateSelection()
  const { select: selectTransition } = useTransitionSelection()
  const { select: selectComment } = useCommentSelection()

  const [selectedStates, setSelectedStates] = useState([])
  const [selectedTransitions, setSelectedTransitions] = useState([])
  const [selectedComments, setSelectedComments] = useState([])
  const selectNone = useSelectionStore(s => s.selectNone)

  const commit = useProjectStore(s => s.commit)
  const removeStates = useProjectStore(s => s.removeStates)
  const removeTransitions = useProjectStore(s => s.removeTransitions)
  const removeComments = useProjectStore(s => s.removeComments)

  // Selects the state the user clicks on (mouse down)
  useEvent('state:mousedown', e => {
    const selectedStateIDs = selectState(e)
    if (tool === 'delete') {
      setSelectedStates(selectedStateIDs)
    }
  })

  // On mouse up deletes the previously selected state
  useEvent('state:mouseup', e => {
    if (tool === 'delete') {
      removeStates(selectedStates)
      selectNone()
      commit()
    }
  })

  // Uses custom transition event to detect mousedown then stores the selected transition
  useEvent('transition:mousedown', e => {
    const selectedTransitionIDs = selectTransition(e)
    if (tool === 'delete') {
      setSelectedTransitions(selectedTransitionIDs)
    }
  })

  // On mouseup deletes the previously selected (mousedown) transition
  useEvent('transition:mouseup', e => {
    if (tool === 'delete') {
      removeTransitions(selectedTransitions)
      selectNone()
      commit()
    }
  })

  useEvent('comment:mousedown', e => {
    const selectedCommentIDs = selectComment(e)
    if (tool === 'delete') setSelectedComments(selectedCommentIDs)
  })

  useEvent('comment:mouseup', e => {
    if (tool === 'delete') {
      removeComments(selectedComments)
      selectNone()
      commit()
    }
  })
}

export default useDeleteTool
