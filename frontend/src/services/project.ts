import api from '.'
import { StoredProject } from '/src/stores/useProjectStore'

export const getProject = async (pid: string): Promise<{project: StoredProject}> => {
  const res = await api.get(`/projects/${pid}`)
  return res.data
}

export const getProjects = async (): Promise<{projects: StoredProject[]}> => {
  const res = await api.get('/projects')
  return res.data
}

export const createProject = async (projectDetails: StoredProject) => {
  const res = await api.post('/projects', projectDetails)
  return res.data
}

export const deleteProject = async (pid: string) => {
  const res = await api.delete(`/projects/${pid}`)
  return res.data
}

export const updateProject = async ({ _id: pid, ...projectDetails }) => {
  const res = await api.post(`/projects/${pid}`, projectDetails)
  return res.data
}
