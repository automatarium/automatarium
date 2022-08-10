import api from '.'

export const getProject = async pid => {
  const res = await api.get(`/projects/${pid}`)
  return res.data
}

export const getProjects = async () => {
  const res = await api.get('/projects')
  return res.data
}

export const createProject = async projectDetails => {
  const res = await api.post('/projects', projectDetails)
  return res.data
}

export const deleteProject = async pid => {
  const res = await api.delete(`/projects/${pid}`)
  return res.data
}

export const updateProject = async ({ _id: pid, ...projectDetails }) => {
  const res = await api.post(`/projects/${pid}`, projectDetails)
  return res.data
}
