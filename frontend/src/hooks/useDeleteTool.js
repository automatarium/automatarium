import { useEvent } from '/src/hooks'
import { dispatchCustomEvent } from '/src/util/events'
import { useToolStore } from '/src/stores'


//Combine the selection of a resource with their delete action ()
const useDeleteTool = () => {
    const tool = useToolStore(s=> s.tool)

    useEvent('')

}

export default useDeleteTool