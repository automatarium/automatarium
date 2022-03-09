import express from 'express'

import { dbUri, port } from 'config'
import mongoose from 'mongoose'

const app = express()

app.listen(port, async () => {
  console.log('Backend is listening')

  // Connect to database
  try {
    await mongoose.connect(dbUri)
    console.log('Connected to DB')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})
