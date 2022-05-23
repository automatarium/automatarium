import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'

import config from './config'
import projectRoutes from 'routes/project'
import userRoutes from 'routes/user'
import { decodeToken } from 'middleware'

const app = express()

// Cors configuration
app.use(cors())

// Configure middleware
app.use(decodeToken)

// Parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Configure routes
app.use('/projects', projectRoutes)
app.use('/users', userRoutes)

// Start server
app.listen(config.server.port, async () => {
  console.log(`🚢 Listening on port ${config.server.port}`)

  // Connect to database
  try {
    await mongoose.connect(config.db.url, config.db.options)
    console.log('📦 Connected to DB')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})
