import express from 'express'

import config from '../config'
import mongoose from 'mongoose'

const app = express()

app.listen(config.server.port, async () => {
  console.log('Backend is listening')

  console.log(config.db)
  // Connect to database
  try {
    await mongoose.connect(config.db.url, config.db.options)
    console.log('Connected to DB')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})
