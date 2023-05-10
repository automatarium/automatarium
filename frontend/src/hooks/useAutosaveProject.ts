import { useEffect } from 'react'

import { useProjectsStore, useProjectStore } from '/src/stores'
import dayjs from 'dayjs'

const SAVE_INTERVAL = 5 * 1000

/**
 * Use this to save the project on an interval. The project will only save if there are changes
 * and there are items in the project
 * @see SAVE_INTERVAL
 */
const useAutosaveProject = () => {
  const upsertProject = useProjectsStore(s => s.upsertProject)
  const lastChangeDate = useProjectStore(s => s.lastChangeDate)
  const lastSaveDate = useProjectStore(s => s.lastSaveDate)
  const setLastSaveDate = useProjectStore(s => s.setLastSaveDate)

  useEffect(() => {
    const timer = setInterval(() => {
      const currP = useProjectStore.getState().project
      const totalItems = currP.comments.length + currP.states.length + currP.transitions.length
      // Only save if there has been a change and there is something in the project
      if ((!lastSaveDate || dayjs(lastChangeDate).isAfter(lastSaveDate)) && totalItems > 0) {
        const toSave = { ...currP, meta: { ...currP.meta, dateEdited: new Date().getTime() } }
        upsertProject(toSave)
        setLastSaveDate(new Date().getTime())
      }
    }, SAVE_INTERVAL)
    return () => clearInterval(timer)
  })
}

export default useAutosaveProject
