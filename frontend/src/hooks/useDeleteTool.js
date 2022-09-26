import { useState } from 'react'
import { useEvent, useStateSelection, useTransitionSelection, useCommentSelection } from '/src/hooks'
import { dispatchCustomEvent } from '/src/util/events'
import { useToolStore, useProjectStore, useSelectionStore } from '/src/stores'

//Combine the selection of a resource with their delete action ()
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

    //Selects the state the user clicks on (mouse down)
    useEvent('state:mousedown', e => {
        const selectedStateIDs = selectState(e)
        if (tool === 'delete') {
            setSelectedStates(selectedStateIDs)
        }
    })

    useEvent('transition:mousedown', e => {
        const selectedTransitionIDs = selectTransition(e)
        if (tool === 'delete') {
            setSelectedTransitions(selectedTransitionIDs)
        }
    })

    useEvent('transition:mouseup', e => {
        if (tool === 'delete') {
            removeTransitions(selectedTransitions)
            selectNone()
            commit()
        }
    })

    //On mouse up deletes the previously selected state
    useEvent('state:mouseup', e => {
        if (tool === 'delete') {
            removeStates(selectedStates)
            selectNone()
            commit()
        }
    })
}

export default useDeleteTool