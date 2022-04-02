import { useEffect, useMemo } from 'react'
import { useProjectStore, useSelectionStore } from '/src/stores'

const isWindows = navigator.platform.match(/Win/)
const formatHotkey = ({ letter, meta, alt, shift, showCtrl = isWindows }) => [
  meta && (showCtrl ? (isWindows ? 'Ctrl' : '⌃') : '⌘'),
  alt && (isWindows ? 'Alt' : '⌥'),
  shift && (isWindows ? 'Shift' : '⇧'),
  letter.toUpperCase(),
].filter(Boolean).join(isWindows ? '+' : ' ')

const useActions = (registerHotkeys=false) => {
  const undo = useProjectStore(s => s.undo)
  const redo = useProjectStore(s => s.redo)
  const selectNoStates = useSelectionStore(s => s.selectNone)
  const selectAllStates = useSelectionStore(s => s.selectAll)

  // TODO: memoize
  const actions = {
    NEW_FILE: {
      hotkey: { letter: 'n', meta: true, showCtrl: true },
      handler: () => console.log('New File'),
    },
    OPEN_FILE: {
     hotkey: { letter: 'o', meta: true },
     handler: () => console.log('Open File'),
    },
    SAVE_FILE: {
      hotkey: { letter: 's', meta: true },
      handler: () => console.log('Save'),
    },
    SAVE_FILE_AS: {
      hotkey: { letter: 's', shift: true, meta: true },
      handler: () => console.log('Save File As'),
    },
    EXPORT_AS_PNG: {
      hotkey: { letter: 'e', shift: true, meta: true, showCtrl: true },
      handler: () => console.log('Export PNG'),
    },
    EXPORT_AS_SVG: {
      hotkey: { letter: 'e', shift: true, alt: true, meta: true},
      handler: () => console.log('Export SVG'),
    },
    EXPORT_AS_JPG: {
      handler: () => console.log('Export JPG'),
    },
    EXPORT_AS_JFLAP: {
      handler: () => console.log('Export JFLAP'),
    },
    SHARE: {
      handler: () => console.log('Share'),
    },
    OPEN_PREFERENCES: {
      hotkey: { letter: ',', meta: true },
      handler: () => console.log('Preferences'),
    },
    UNDO: {
      hotkey: { letter: 'z', meta: true },
      handler: undo,
    },
    REDO: {
      hotkey: { letter: 'y', meta: true },
      handler: redo,
    },
    COPY: {
      hotkey: { letter: 'c', meta: true },
      handler: () => console.log('Copy'),
    },
    PASTE: {
      hotkey: { letter: 'p', meta: true },
      handler: () => console.log('Paste'),
    },
    SELECT_ALL: {
      hotkey: { letter: 'a', meta: true },
      handler: selectAllStates,
    },
    SELECT_NONE: {
      hotkey: { letter: 'd', meta: true },
      handler: selectNoStates,
    },
    ZOOM_IN: {
      hotkey: { letter: '=', meta: true },
      handler: () => console.log('Zoom In'),
    },
    ZOOM_OUT: {
      hotkey: { letter: '-', meta: true },
      handler: () => console.log('Zoom Out'),
    },
    ZOOM_100: {
      hotkey: { letter: '0', meta: true },
      handler: () => console.log('Zoom to 100%'),
    },
    ZOOM_FIT: {
      hotkey: { letter: '1', shift: true },
      handler: () => console.log('Zoom to fit'),
    },
    TESTING_LAB: {
      hotkey: { letter: 't', meta: true, showCtrl: true },
      handler: () => console.log('Testing Lab'),
    },
    FILE_INFO: {
      hotkey: { letter: 'i', meta: true },
      handler: () => console.log('File Info'),
    },
    FILE_OPTIONS: {
      hotkey: { letter: 'u', meta: true },
      handler: () => console.log('File Options'),
    },
    CONVERT_TO_DFA: {
      handler: () => console.log('Convert to DFA'),
    },
    MINIMIZE_DFA: {
      handler: () => console.log('Minimize DFA'),
    },
    AUTO_LAYOUT: {
      handler: () => console.log('Auto Layout'),
    },
    OPEN_DOCS: {
      handler: () => console.log('View Documentation'),
    },
    KEYBOARD_SHORTCUTS: {
      hotkey: { letter: '/', meta: true },
      handler: () => console.log('Keyboard shortcuts'),
    },
    PRIVACY_POLICY: {
      handler: () => console.log('Privacy Policy'),
    },
    OPEN_ABOUT: {
      handler: () => console.log('About Automatarium'),
    },
  }

  // Register action hotkeys
  useEffect(() => {
    if (registerHotkeys) {
      const handleKeyDown = e => {
        for (let action of Object.values(actions)) {
          // Skip if no hotkey
          if (!action.hotkey)
            continue
          
          // Guard against other keys 
          const keyMatch = e.code === `Key${action.hotkey.letter.toUpperCase()}`
          const digitMatch = e.code === `Digit${action.hotkey.letter}`
          const letterMatch = e.key === action.hotkey.letter
          if (!(keyMatch || digitMatch || letterMatch))
              continue

          // Check augmenting keys
          if ((action.hotkey.meta || false) !== (e.metaKey || e.ctrlKey))
            continue
          if ((action.hotkey.alt || false) !== e.altKey)
            continue
          if ((action.hotkey.shift || false) !== e.shiftKey)
            continue

          // Prevent default and exec callback
          e.preventDefault()
          e.stopPropagation()
          action.handler(e)
          break
        }
      }
      
      // Add listener
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [actions])

  // Add formatted hotkeys to actions
  const actionsWithLabels = useMemo(() => Object.fromEntries(Object.entries(actions).map(([key, action]) => ([key, {
    ...action,
    label: action.hotkey ? formatHotkey(action.hotkey) : null
  }]))), [actions])

  return actionsWithLabels
}

export default useActions
