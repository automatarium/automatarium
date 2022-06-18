import { useEffect } from 'react'

import { useProjectsStore, useProjectStore } from '/src/stores'
import dayjs from 'dayjs'

const SAVE_INTERVAL = 5 * 1000

const useAutosaveProject = () => {
  const upsertProject = useProjectsStore(s => s.upsertProject)
  const lastChangeDate = useProjectStore(s => s.lastChangeDate)
  const lastSaveDate = useProjectStore(s => s.lastSaveDate)
  const setLastSaveDate = useProjectStore(s => s.setLastSaveDate)

  useEffect(() => {
    const timer = setInterval(() => {
      const currentProject = useProjectStore.getState().project
      if (!lastSaveDate || dayjs(lastChangeDate).isAfter(lastSaveDate)) {
        const toSave = {...currentProject, meta: { ...currentProject.meta, dateEdited: new Date().getTime() }}
        upsertProject(toSave)
        setLastSaveDate(new Date().getTime())
      }
    }, SAVE_INTERVAL)
    return () => clearInterval(timer)
  })
}

export default useAutosaveProject
