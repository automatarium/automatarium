import create, { SetState } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project } from '../types/ProjectTypes'

interface ProjectsStore {
  projects: Project[],
  setProjects: (projects: Project[]) => void,
  clearProjects: () => void,
  upsertProject: (project: Project) => void,
  deleteProject: (pid: string) => void,
}

const useProjectsStore = create<ProjectsStore>(persist((set: SetState<ProjectsStore>) => ({
  projects: [] as Project[],
  setProjects: (projects: Project[]) => set({ projects }),
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
