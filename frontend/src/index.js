import { StrictMode, createElement } from 'react'
import ReactDOM from 'react-dom'
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
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main>
          <h1>Automatarium</h1>
          <Link to="/editor" style={{color: 'inherit'}}>Editor</Link><br />
          <Link to="/svg" style={{color: 'inherit'}}>SVG Demo</Link>
          <Link to="/login" style={{color: 'inherit'}}>Login</Link><br />
          <Link to="/signup" style={{color: 'inherit'}}>Signup</Link><br />
          <Link to="/logout" style={{color: 'inherit'}}>Logout</Link>
        </Main>} />
        <Route path="/editor" element={<Pages.Editor />} />
        <Route path="/svg" element={<GraphView style={{ width: '100vw', height: '100vh' }} />} />
        <Route path="/login" element={<Pages.Login />} />
        <Route path="/signup" element={<Pages.Signup />} />
        <Route path="/logout" element={<Pages.Logout />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('app')
)
