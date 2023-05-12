import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { useAuth } from '/src/hooks'
import { useProjectStore } from '/src/stores'
import { getProject } from '/src/services/project'

const useSyncCurrentProject = () => {
  const { user, loading: userLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [fetchedProject, setFetchedProject] = useState(false)

  // Ensure project is syncronised with the backend before showing editor page
  // This prevents situation where user updates local copy of project before its overriden by backend sync
  useEffect(() => {
    if (!userLoading && !fetchedProject) {
      if (!user) {
        // If not logged in, just show what is stored
        setLoading(false)
      } else {
        // If logged in, attempt to update stored project from backend before showing it
        const projectStore = useProjectStore.getState()
        const { project: currentProject, set: setProject } = projectStore

        // Get project from BE
        setFetchedProject(true)
        getProject(currentProject._id)
          .then(({ project }) => {
            if (project && dayjs(project.meta.dateEdited).isAfter(currentProject.meta.dateEdited)) {
              setProject(project)
            }
          })
          .then(() => setLoading(false))
          .catch(e => { console.warn(e); setLoading(false) })
      }
    }
  }, [user, userLoading])

  return loading
}

export default useSyncCurrentProject
