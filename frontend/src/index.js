import ReactDOM from 'react-dom'
import { createElement } from 'react'
import { setup } from 'goober'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import * as Pages from './pages'

import { GraphView, Main } from '/src/components'

// Set up goober to use React
setup(
  createElement,
  undefined, undefined,
  // Remove transient props from the DOM
  props => Object.keys(props).forEach(p => p[0] === '$' && delete props[p])
)

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main>
        <h1>Automatarium</h1>
        <Link to="/editor" style={{color: 'inherit'}}>Editor</Link><br />
        <Link to="/svg" style={{color: 'inherit'}}>SVG Demo</Link>
      </Main>} />
      <Route path="/editor" element={<Pages.Editor />} />
      <Route path="/svg" element={<GraphView style={{ width: '100vw', height: '100vh' }} />} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('app')
)
