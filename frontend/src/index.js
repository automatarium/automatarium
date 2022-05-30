import { StrictMode, createElement } from 'react'
import ReactDOM from 'react-dom'
import { setup } from 'goober'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'

import * as Pages from './pages'

import { useEgg } from '/src/hooks'
import { Footer } from '/src/components'
import useSyncProjects from '/src/hooks/useSyncProjects'

// Set up goober to use React
setup(
  createElement,
  undefined, undefined,
  // Remove transient props from the DOM
  props => Object.keys(props).forEach(p => p[0] === '$' && delete props[p])
)

const App = () => {
  const location = useLocation()
  const hideFooter = location.pathname.match('/editor')

  useEgg()
  useSyncProjects()

  return <>
    <Routes>
      <Route path="/" element={<Pages.Landing />} />
      <Route path="/editor" element={<Pages.Editor />} />
      <Route path="/logout" element={<Pages.Logout />} />
      <Route path="/about" element={<Pages.About />} />
      <Route path="/privacy" element={<Pages.Privacy />} />
      <Route path="/new" element={<Pages.NewFile />} />
      <Route path="*" element={<Pages.NotFound />} />
    </Routes>
    {!hideFooter && <Footer/>}
  </>
}

// Render the app
ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('app')
)
