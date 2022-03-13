import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import config from './config'
import finiteStateAutomatonRoutes from 'routes/finiteStateAutomaton'

const app = express()

/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/fsa', finiteStateAutomatonRoutes)

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