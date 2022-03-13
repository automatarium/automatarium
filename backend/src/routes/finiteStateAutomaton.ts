import express from 'express'

import { createFiniteStateAutomaton, getFiniteStateAutomaton } from 'controllers/finiteStateAutomaton'

const app = express.Router()

app.post('/', createFiniteStateAutomaton)
app.get('/:fsaid', getFiniteStateAutomaton)

export default app