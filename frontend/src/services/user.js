import api from '../services'

export const getUser = async uid => {
  const res = await api.get(`/user/${uid}`)
  return res.data
}

export const createUser = async userDetails => {
  console.log(userDetails)
  const res = await api.post(`/user`, userDetails)
  return res.data
}