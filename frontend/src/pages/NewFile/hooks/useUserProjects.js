import create from 'zustand'
import { persist } from 'zustand/middleware'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

import { useAuth } from '/src/hooks'
import { getProjects, updateProject } from '/src/services/project'

const useProjectsStore = create(persist(set => ({
  projects: [],
  setProjects: projects => set({ projects })
}), {
  name: 'automatarium-projects'
}))

const useUserProjects = () => {
  const { user } = useAuth()
  const { projects, setProjects } = useProjectsStore()
  
  // Update projects from backend (if authenticated)
  useEffect(() => {
    if (user) {
      getProjects()
        .then(({ projects: backendProjects }) => {
          // Find projects that exist only on backend or local storage (but not both)
          const isolatedBackendProjects = backendProjects.filter(bp => !projects.find(lp => lp._id === bp._id))
          const isolatedLocalProjects = projects.filter(lp => !backendProjects.find(bp => lp._id === bp._id))
          const isolatedProjects = [...isolatedBackendProjects, ...isolatedLocalProjects]
          
          // Find and resolve projects that exist on both backend and local storage
          const resolvedProjects = backendProjects
            .filter(bp => !isolatedProjects.find(ip => ip._id === bp._id))
            .map(bp => {
              const localProject = projects.find(lp => lp._id === bp._id)
              const localDate = dayjs(localProject.meta.editedAt)
              const remoteDate = dayjs(bp.meta.editedAt)
              return remoteDate.isAfter(localDate)
                ? bp
                : localProject
            })

          // Update projects state
          const updatedProjects = [...isolatedProjects, ...resolvedProjects]
          setProjects(updatedProjects)

          // Update backend with resolved projects
          Promise.all(updatedProjects.map(p => updateProject(p)))
        })
    }
  }, [user])

  return projects
}

export default useUserProjects
