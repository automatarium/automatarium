import create from 'zustand'
import { persist } from 'zustand/middleware'

const useProjectsStore = create(persist(set => ({
  projects: [],
  setProjects: projects => set({ projects }),
  clearProjects: () => set({ projects: [] }),
  upsertProject: project => set(s => ({ projects: s.projects.find(p => p._id === project._id)
    ? s.projects.map(p => p._id === project._id ? project : p )
    : [...s.projects, project]
  })),
  deleteProject: pid => set(s => ({ projects: s.projects.filter(p => p._id !== pid) })),
}), {
  name: 'automatarium-projects'
}))

export default useProjectsStore
