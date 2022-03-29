import express from 'express'

import { createUser, getUser } from 'controllers/user'

const app = express.Router()

app.post('/', createUser)
app.get('/:uid', getUser)

export default app