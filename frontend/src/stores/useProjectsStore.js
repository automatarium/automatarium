import create from 'zustand'
import { persist } from 'zustand/middleware'

const useProjectsStore = create(persist(set => ({
  projects: [],
  setProjects: projects => set({ projects })
}), {
  name: 'automatarium-projects'
}))

export default useProjectsStore
