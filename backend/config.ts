import {config } from 'dotenv'

// Init config
config()

// Determine env
const env = process.env.NODE_ENV || 'production'
console.log('Using config for environment: ', env)

// DB connection params
export const dbUri = process.env.DB_URI ?? 'mongodb://127.0.0.1:27017/'
export const dbName = process.env.DB_NAME ?? 'automatarium'

// 
export const port = process.env.PORT ?? 3001