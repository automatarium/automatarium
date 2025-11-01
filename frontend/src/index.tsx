import { StrictMode, Suspense, createElement, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { setup } from 'goober'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'

import * as Pages from './pages'

import { useEgg } from '/src/hooks'
import { usePreferencesStore, useProjectStore } from '/src/stores'
import COLORS from '/src/config/colors'
import { Footer } from '/src/components'
import { Warning } from '/src/components/Warning/Warning'

import '/src/config/i18n'

import favicon from 'bundle-text:/public/logo.svg'
import { UpdateToast } from './components/Toast/UpdateToast/UpdateToast'
import { OfflineReadyToast } from './components/Toast/OfflineReadyToast/OfflineReadyToast'

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
    document.documentElement.style.setProperty('--primary-h', color.h.toString())
    document.documentElement.style.setProperty('--primary-s', color.s + '%')
    document.documentElement.style.setProperty('--primary-l', color.l + '%')

    // Set favicon
    const link = document.querySelector('head link[rel=icon]')
    link.setAttribute(
      'href',
      'data:image/svg+xml,' +
      encodeURIComponent(favicon
        .replace(/var\(--primary,.*?\)/, `hsl(${color.h} ${color.s}% ${color.l}%)`)
        .replace(/var\(--state-bg,.*?\)/, `hsl(${color.h} ${color.s}% 75%)`)
      )
    )
  }, [colorPref, projectColor])

  // Set light/dark mode
  const themePref = usePreferencesStore(state => state.preferences.theme)
  useEffect(() => {
    document.body.classList.toggle('light', themePref === 'light')
    document.body.classList.toggle('dark', themePref === 'dark')
  }, [themePref])

  // Check if the pauseTM preference is missing
  const preferences = usePreferencesStore(state => state.preferences)
  const setPreferences = usePreferencesStore(state => state.setPreferences)
  if (typeof preferences.pauseTM === 'undefined') {
    // Add the pauseTM preference with a default value
    setPreferences({ ...preferences, pauseTM: true })
  }

  // Check for update toast event
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  useEffect(() => {
    const handleSWUpdate = () => {
      setShowUpdateToast(true);
    };

    window.addEventListener("sw-update-available", handleSWUpdate);
    return () => window.removeEventListener("sw-update-available", handleSWUpdate);
  }, []);

  // Check for offline ready toast event
  const [showOfflineReadyToast, setShowOfflineReadyToast] = useState(false);
  useEffect(() => {
    const handleOfflineReady = () => {
      setShowOfflineReadyToast(true);
    };

    window.addEventListener("sw-offline-ready", handleOfflineReady);
    return () => window.removeEventListener("sw-offline-ready", handleOfflineReady);
  }, []);

  useEgg()

  return <>
    <Routes>
      <Route path="/" element={<Pages.Landing />} />
      <Route path="/editor" element={<Pages.Editor />} />
      <Route path="/about" element={<Pages.About />} />
      <Route path="/privacy" element={<Pages.Privacy />} />
      <Route path="/new" element={<Pages.NewFile />} />
      <Route path="/share/:type/:data" element={<Pages.Share />} />
      <Route path="/tutorials" element={<Pages.TutorialsPage />} />
      <Route path="/example" element={<Pages.Example/>} />
      <Route path="*" element={<Pages.NotFound />} />
    </Routes>
    {!hideFooter && <Footer />}
    {showUpdateToast && <UpdateToast />}
    {showOfflineReadyToast && <OfflineReadyToast />}
    <Warning />
    <Pages.Preferences />
  </>
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    // Don't register if dev server
    if (process.env.NODE_ENV !== 'development') {

      // Check if SW exists
      const hasController = !!navigator.serviceWorker.controller;

      const registration = await navigator.serviceWorker.register(new URL('../public/service-worker.js', import.meta.url), { type: 'module' })

      // Display offline ready when SW completes installation
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "OFFLINE_READY") {
          window.dispatchEvent(new Event('sw-offline-ready'));
        }
      });

      // Display offline ready if SW already exists. 
      navigator.serviceWorker.ready.then(() => {
        // If there's an active controller, the app is already cached
        if (navigator.serviceWorker.controller) {
          window.dispatchEvent(new Event('sw-offline-ready'));
        }
      });
      
      // Display update toast if previous controller exists and is updated.
      if (hasController) {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "activated") {
              window.dispatchEvent(new Event('sw-update-available'));
            }
          });
        });
      }
    }
  });
}

// Render the app
ReactDOM.render(
  <StrictMode>
    <Suspense fallback={<div>Loading</div>}>
      <HashRouter>
        <App />
      </HashRouter>
    </Suspense>
  </StrictMode>,
  document.getElementById('app')
)
