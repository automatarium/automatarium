import { StrictMode, createElement, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { setup } from 'goober'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import * as Pages from './pages'

import { useEgg, useSyncProjects } from '/src/hooks'
import { usePreferencesStore, useProjectStore } from '/src/stores'
import COLORS from '/src/config/colors'
import { Footer } from '/src/components'
import { config } from 'process'

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

  // Set color theme
  const colorPref = usePreferencesStore(state => state.preferences.color)
  const projectColor = useProjectStore(state => state.project?.config.color)
  useEffect(() => {
    const computedColor = (projectColor !== '' && projectColor) || 'orange'
    const color = colorPref === 'match' ? COLORS[computedColor] : COLORS[colorPref]
    document.documentElement.style.setProperty('--primary-h', color.h)
    document.documentElement.style.setProperty('--primary-s', color.s + '%')
    document.documentElement.style.setProperty('--primary-l', color.l + '%')
  }, [colorPref, projectColor])

  // Set light/dark mode
  const themePref = usePreferencesStore(state => state.preferences.theme)
  useEffect(() => {
    document.body.classList.toggle('light', themePref === 'light')
    document.body.classList.toggle('dark', themePref === 'dark')
  }, [themePref])

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
      <Route path="/share/:pid" element={<Pages.Share />} />
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
