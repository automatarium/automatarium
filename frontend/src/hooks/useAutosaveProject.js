import { useState, useEffect } from 'react'
import isEqual from 'lodash.isequal'

import { useProjectsStore, useProjectStore } from '/src/stores'

const SAVE_INTERVAL = 5 * 1000

const useAutosaveProject = () => {
  const upsertProject = useProjectsStore(s => s.upsertProject)
  const [savedProject, setSavedProject] = useState()

  useEffect(() => {
    const timer = setInterval(() => {
      const currentProject = useProjectStore.getState().project
      if (!isEqual(currentProject, savedProject)) {
        const toSave = {...currentProject, meta: { ...currentProject.meta, dateEdited: new Date() }}
        upsertProject(toSave) 
        setSavedProject(toSave)
      }
    }, SAVE_INTERVAL)
    return () => clearInterval(timer)
  })
}

export default useAutosaveProject
