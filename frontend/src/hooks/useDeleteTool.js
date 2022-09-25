import { useState } from 'react'
import { useEvent, useStateSelection } from '/src/hooks'
import { dispatchCustomEvent } from '/src/util/events'
import { useToolStore, useProjectStore, useSelectionStore } from '/src/stores'

//Combine the selection of a resource with their delete action ()
const useDeleteTool = () => {
    const tool = useToolStore(s => s.tool)
    const { select: selectState } = useStateSelection()
    const [selectedStates, setSelectedStates] = useState([])
    const selectNone = useSelectionStore(s => s.selectNone)
    
    const commit = useProjectStore(s => s.commit)
    const removeStates = useProjectStore(s => s.removeStates)
    
    //Selects the state the user clicks on (mouse down)
    useEvent('state:mousedown', e => {
        const selectedStateIDs = selectState(e)
        if (tool === 'delete') {
            setSelectedStates(selectedStateIDs)
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