import { create, SetState } from 'zustand'
import { persist } from 'zustand/middleware'
import { StoredProject } from './useProjectStore'

interface ProjectsStore {
  projects: StoredProject[],
  setProjects: (projects: StoredProject[]) => void,
  clearProjects: () => void,
  upsertProject: (project: StoredProject) => void,
  deleteProject: (pid: string) => void,
}

const useProjectsStore = create<ProjectsStore>()(persist((set: SetState<ProjectsStore>) => ({
  projects: [] as StoredProject[],
  setProjects: (projects: StoredProject[]) => set({ projects }),
  clearProjects: () => set({ projects: [] }),
  upsertProject: project => set(s => ({
    projects: s.projects.find(p => p._id === project._id)
      ? s.projects.map(p => p._id === project._id ? project : p)
      : [...s.projects, project]
  })),
  deleteProject: pid => set(s => ({ projects: s.projects.filter(p => p._id !== pid) }))
}), {
  name: 'automatarium-projects'
}))

export default useProjectsStore
