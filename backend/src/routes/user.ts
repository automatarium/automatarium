import express from 'express'

import { createUser, getUser } from 'controllers/user'
import { isAuthenticated } from 'middleware'

const app = express.Router()

app.post('', createUser)
app.get('', isAuthenticated, getUser)

export default app
