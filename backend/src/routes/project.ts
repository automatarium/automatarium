import express from 'express'

import { createProject, getProject } from 'controllers/project'

const app = express.Router()

app.post('/', createProject)
app.get('/:pid', getProject)

export default app