import axios from 'axios'
import { createToken } from '../auth'
import config from '../config'

export const instance = axios.create({
  baseURL: config.API,
  timeout: 1000 * 300,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(async (config) => {
  const token = await createToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

const api = {
  get: (endpoint, data) =>
    instance.get(endpoint, { params: data }),

  post: (endpoint, data, type = 'application/json') =>
    instance.post(endpoint, data, {
      headers: {
        'Content-Type': type,
      },
    }),

  patch: (endpoint, data, type = 'application/json') =>
  instance.patch(endpoint, data, {
    headers: {
      'Content-Type': type,
    },
  }),

  delete: (endpoint, config) =>
  instance.delete(endpoint, config)
}

export * from './user'
export * from './project'

export default api
