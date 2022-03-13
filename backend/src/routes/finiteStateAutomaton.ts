import express from 'express'

import { createFiniteStateAutomaton, getFiniteStateAutomaton } from 'controllers/finiteStateAutomaton'

const app = express.Router()

app.post('/', createFiniteStateAutomaton)
app.get('/:faid', getFiniteStateAutomaton)

export default app