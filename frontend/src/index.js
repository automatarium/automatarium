import ReactDOM from 'react-dom'
import { createElement } from 'react'
import { setup } from 'goober'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import * as Pages from './pages'

import { GraphView } from '/src/components'

// Set up goober to use React
setup(createElement)

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<main>
        <h1>Automatarium</h1>
        <Link to="/editor">Editor</Link>
        <Link to="/svg">SVG Demo</Link>
      </main>} />
      <Route path="/editor" element={<Pages.Editor />} />
      <Route path="/svg" element={<GraphView />} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('app')
)
