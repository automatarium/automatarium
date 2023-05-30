import api from '../services'

export const getUser = async (uid: string) => {
  const res = await api.get(`/users/${uid}`)
  return res.data
}

export const createUser = async userDetails => {
  const res = await api.post('/users', userDetails)
  return res.data
}
