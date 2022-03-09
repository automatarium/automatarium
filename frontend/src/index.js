import ReactDOM from 'react-dom'
import { createElement } from 'react'
import { setup } from 'goober'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import * as Pages from './pages'

// Set up goober to use React
setup(createElement)

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<main>
        <Link to="/editor">Editor</Link>
      </main>} />

      <Route path="/editor" element={<Pages.Editor />} />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('app')
)