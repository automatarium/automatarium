import ReactDOM from 'react-dom'
import { createElement } from 'react'
import { setup } from 'goober'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { GraphView } from '/src/components'

// Set up goober to use React
setup(createElement)

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<h1>Automatarium</h1>} />
      <Route path="/svg" element={<GraphView />} />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('app')
)
