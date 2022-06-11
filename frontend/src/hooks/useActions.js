import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useProjectStore, useProjectsStore, useSelectionStore, useViewStore } from '/src/stores'
import { VIEW_MOVE_STEP, SCROLL_MAX, SCROLL_MIN } from '/src/config/interactions'
import { convertJFLAPXML } from '@automatarium/jflap-translator'
import { haveInputFocused } from '/src/util/actions'
import { dispatchCustomEvent } from '/src/util/events'

const isWindows = navigator.platform.match(/Win/)
const formatHotkey = ({ key, meta, alt, shift, showCtrl = isWindows }) => [
  meta && (showCtrl ? (isWindows ? 'Ctrl' : '⌃') : '⌘'),
  alt && (isWindows ? 'Alt' : '⌥'),
  shift && (isWindows ? 'Shift' : '⇧'),
  key.toUpperCase(),
].filter(Boolean).join(isWindows ? '+' : ' ')

const useActions = (registerHotkeys=false) => {
  const undo = useProjectStore(s => s.undo)
  const redo = useProjectStore(s => s.redo)
  const selectNone = useSelectionStore(s => s.selectNone)
  const selectAll = useSelectionStore(s => s.selectAll)
  const setStateInitial = useProjectStore(s => s.setStateInitial)
  const toggleStatesFinal = useProjectStore(s => s.toggleStatesFinal)
  const flipTransitions = useProjectStore(s => s.flipTransitions)
  const removeStates = useProjectStore(s => s.removeStates)
  const removeComments = useProjectStore(s => s.removeComments)
  const removeTransitions = useProjectStore(s => s.removeTransitions)
  const commit = useProjectStore(s => s.commit)
  const setProject = useProjectStore(s => s.set)
  const setLastSaveDate = useProjectStore(s => s.setLastSaveDate)
  const upsertProject = useProjectsStore(s => s.upsertProject)
  const moveView = useViewStore(s => s.moveViewPosition)
  const createComment = useProjectStore(s => s.createComment)
  const createState = useProjectStore(s => s.createState)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)

  const navigate = useNavigate()

  // TODO: memoize
  const actions = {
    NEW_FILE: {
      hotkey: { key: 'n', meta: true, showCtrl: true },
      handler: () => navigate('/new'),
    },
    IMPORT_AUTOMATARIUM_PROJECT: {
      hotkey: { key: 'i', meta: true },
      handler: async () => {
        if (window.confirm('Importing will override your current project. Continue anyway?'))
          promptLoadFile(JSON.parse, setProject, 'Failed to open automatarium project')
     },
    },
    IMPORT_JFLAP_PROJECT: {
      hotkey: { key: 'i', meta: true, shift: true },
      handler: async () => {
        if (window.confirm('Importing will override your current project. Continue anyway?'))
          promptLoadFile(convertJFLAPXML, setProject, 'Failed to open JFLAP project')
     },
    },
    SAVE_FILE: {
      hotkey: { key: 's', meta: true },
      handler: () => {
        const project = useProjectStore.getState().project
        const toSave = {...project, meta: { ...project.meta, dateEdited: new Date() }}
        upsertProject(toSave)
        setLastSaveDate(new Date())
      },
    },
    SAVE_FILE_AS: {
      hotkey: { key: 's', shift: true, meta: true },
      handler: () => {
        const fileName = window.prompt('What would you like to name this automaton?') // TODO: better prompt
        if (fileName) {
          // Pull project state
          const { project } = useProjectStore.getState()

          // Create a download link and use it
          const a = document.createElement('a')
          const file = new Blob([JSON.stringify(project, null, 2)], {type: 'application/json'})
          a.href = URL.createObjectURL(file)
          a.download = fileName // TODO: prompt file location - might not be possible?
          a.click()
        }
      },
    },
    EXPORT_AS_PNG: {
      hotkey: { key: 'e', shift: true, meta: true, showCtrl: true },
      //handler: () => console.log('Export PNG'),
    },
    EXPORT_AS_SVG: {
      hotkey: { key: 'e', shift: true, alt: true, meta: true},
      //handler: () => console.log('Export SVG'),
    },
    EXPORT_AS_JPG: {
      //handler: () => console.log('Export JPG'),
    },
    EXPORT_AS_JFLAP: {
      //handler: () => console.log('Export JFLAP'),
    },
    OPEN_PREFERENCES: {
      hotkey: { key: ',', meta: true },
      handler: () => dispatchCustomEvent('modal:preferences'),
    },
    UNDO: {
      hotkey: { key: 'z', meta: true },
      handler: undo,
    },
    REDO: {
      hotkey: { key: 'y', meta: true },
      handler: redo,
    },
    COPY: {
      hotkey: { key: 'c', meta: true },
      //handler: () => console.log('Copy'),
    },
    PASTE: {
      hotkey: { key: 'v', meta: true },
      //handler: () => console.log('Paste'),
    },
    SELECT_ALL: {
      hotkey: { key: 'a', meta: true },
      handler: selectAll,
    },
    SELECT_NONE: {
      hotkey: { key: 'd', meta: true },
      handler: selectNone,
    },
    DELETE: {
      hotkey: [{ key: 'Delete' }, { key: 'Backspace' }],
      handler: () => {
        const selectionState = useSelectionStore.getState()
        const selectedStateIDs = selectionState.selectedStates
        const selectedTransitionIDs = selectionState.selectedTransitions
        const selectedCommentIDs = selectionState.selectedComments
        if (selectedStateIDs.length > 0 || selectedTransitionIDs.length > 0 || selectedCommentIDs.length > 0) {
          removeStates(selectedStateIDs)
          removeTransitions(selectedTransitionIDs)
          removeComments(selectedCommentIDs)
          selectNone()
          commit()
        }
      },
    },
    ZOOM_IN: {
      hotkey: { key: '=', meta: true },
      handler: () => zoomViewTo(useViewStore.getState().scale - .1),
    },
    ZOOM_OUT: {
      hotkey: { key: '-', meta: true },
      handler: () => zoomViewTo(useViewStore.getState().scale + .1),
    },
    ZOOM_100: {
      hotkey: { key: '0', meta: true },
      handler: () => { zoomViewTo(1) },
    },
    ZOOM_FIT: {
      hotkey: { key: '1', shift: true },
      handler: () => {
        // Get state
        const view = useViewStore.getState()
        const states = useProjectStore.getState()?.project.states ?? []
        if (states.length === 0)
          return

        // Calculate fit region
        const border = 100
        const minX = states.reduce((acc, s) => s.x < acc ? s.x : acc, Infinity) - border
        const maxX = states.reduce((acc, s) => s.x > acc ? s.x : acc, -Infinity) + border
        const minY = states.reduce((acc, s) => s.y < acc ? s.y : acc, Infinity) - border
        const maxY = states.reduce((acc, s) => s.y > acc ? s.y : acc, -Infinity) + border
        const [regionWidth, regionHeight] = [maxX - minX, maxY - minY]
        const desiredScale = Math.max(regionWidth / view.size.width, regionHeight / view.size.height)
        view.setViewScale(desiredScale)
        view.setViewPosition({ x: minX, y: minY })
      },
    },
    FULLSCREEN: {
      handler: () => document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen(),
    },
    TESTING_LAB: {
      hotkey: { key: 't', meta: true, showCtrl: true },
      handler: () => dispatchCustomEvent('sidepanel:open', { panel: 'test' }),
    },
    FILE_INFO: {
      handler: () => dispatchCustomEvent('sidepanel:open', { panel: 'about' }),
    },
    FILE_OPTIONS: {
      hotkey: { key: 'u', meta: true },
      handler: () => dispatchCustomEvent('sidepanel:open', { panel: 'options' }),
    },
    CONVERT_TO_DFA: {
      //handler: () => console.log('Convert to DFA'),
    },
    MINIMIZE_DFA: {
      //handler: () => console.log('Minimize DFA'),
    },
    AUTO_LAYOUT: {
      //handler: () => console.log('Auto Layout'),
    },
    OPEN_DOCS: {
      //handler: () => console.log('View Documentation'),
    },
    KEYBOARD_SHORTCUTS: {
      hotkey: { key: '/', meta: true },
      //handler: () => console.log('Keyboard shortcuts'),
    },
    PRIVACY_POLICY: {
      handler: () => navigate('/privacy'),
    },
    OPEN_ABOUT: {
      handler: () => navigate('/about'),
    },
    MOVE_VIEW_LEFT: {
      hotkey: { key: 'ArrowLeft' },
      handler: () => moveView({ x: -VIEW_MOVE_STEP })
    },
    MOVE_VIEW_RIGHT: {
      hotkey: { key: 'ArrowRight' },
      handler: () => moveView({ x: VIEW_MOVE_STEP })
    },
    MOVE_VIEW_UP: {
      hotkey: { key: 'ArrowUp' },
      handler: () => moveView({ y: -VIEW_MOVE_STEP })
    },
    MOVE_VIEW_DOWN: {
      hotkey: { key: 'ArrowDown' },
      handler: () => moveView({ y: VIEW_MOVE_STEP })
    },
    SET_STATE_INITIAL: {
      disabled: () => useSelectionStore.getState()?.selectedStates?.length !== 1,
      handler: () => {
        const selectedState = useSelectionStore.getState().selectedStates?.[0]
        if (selectedState !== undefined) {
          setStateInitial(selectedState)
          commit()
        }
      }
    },
    TOGGLE_STATES_FINAL: {
      handler: () => {
        const selectedStateIDs = useSelectionStore.getState().selectedStates
        if (selectedStateIDs.length > 0) {
          toggleStatesFinal(selectedStateIDs)
          commit()
        }
      }
    },
    EDIT_COMMENT: {
      disabled: () => useSelectionStore.getState()?.selectedComments?.length !== 1,
      handler: () => {
        const selectedCommentID = useSelectionStore.getState().selectedComments?.[0]
        const selectedComment = useProjectStore.getState().project?.comments.find(cm => cm.id === selectedCommentID)
        if (selectedCommentID === undefined || selectedComment === undefined) return
        const text = window.prompt('New text for comment?', selectedComment.text)
        useProjectStore.getState().updateComment({ ...selectedComment, text })
      }
    },
    EDIT_TRANSITION: {
      disabled: () => useSelectionStore.getState()?.selectedTransitions?.length !== 1,
      handler: () => {
        const selectedTransition = useSelectionStore.getState().selectedTransitions?.[0]
        if (selectedTransition === undefined) return
        window.setTimeout(() => dispatchCustomEvent('editTransition', { id: selectedTransition }), 100)
      }
    },
    FLIP_TRANSITION: {
      handler: () => {
        const selectedTransitions = useSelectionStore.getState().selectedTransitions
        if (selectedTransitions === undefined || selectedTransitions?.length === 0) return
        flipTransitions(selectedTransitions)
        commit()
      }
    },
    CREATE_COMMENT: {
      handler: e => {
        const text = window.prompt('Text of comment?')
        const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
        createComment({ x: viewX, y: viewY, text })
        commit()
      }
    },
    CREATE_STATE: {
      handler: e => {
        const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
        createState({ x: viewX, y: viewY })
        commit()
      }
    },
  }

  // Register action hotkeys
  useEffect(() => {
    if (registerHotkeys) {
      const handleKeyDown = e => {
        // Hotkeys are disabled if an input is focused
        if (haveInputFocused(e)) return

        // Check hotkeys
        for (let action of Object.values(actions)) {
          // Skip if no hotkey
          if (!action.hotkey)
            continue

          // Skip if disabled
          if (action.disabled && action.disabled())
            continue

          const hotkeys = Array.isArray(action.hotkey) ? action.hotkey : [action.hotkey]
          const activeHotkey = hotkeys.find(hotkey => {
            // Guard against other keys
            const letterMatch = e.code === `Key${hotkey.key.toUpperCase()}`
            const digitMatch = e.code === `Digit${hotkey.key}`
            const keyMatch = e.key === hotkey.key
            if (!(letterMatch || digitMatch || keyMatch))
                return false

            // Check augmenting keys
            if ((hotkey.meta || false) !== (e.metaKey || e.ctrlKey))
              return false
            if ((hotkey.alt || false) !== e.altKey)
              return false
            if ((hotkey.shift || false) !== e.shiftKey)
              return false

            return true
          })

          // Prevent default and exec callback
          if (activeHotkey) {
            e.preventDefault()
            e.stopPropagation()
            action.handler(e)
            break
          }
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
    label: action.hotkey ? formatHotkey(Array.isArray(action.hotkey) ? action.hotkey[0] : action.hotkey) : null
  }]))), [actions])

  return actionsWithLabels
}

const zoomViewTo = to => {
  const view = useViewStore.getState()
  if (view.scale === to)
    return
  const newScale = Math.min(SCROLL_MAX, Math.max(SCROLL_MIN, to))
  const scrollAmount = newScale - view.scale
  if (Math.abs(scrollAmount) < 1e-3) {
    view.setViewScale(to < 1 ? SCROLL_MIN : SCROLL_MAX)
    return
  } else {
    view.setViewPosition({
      x: view.position.x - view.size.width/2 * scrollAmount,
      y: view.position.y - view.size.height/2 * scrollAmount,
    })
    view.setViewScale(newScale)
  }
}


const promptLoadFile = (parse, onData, errorMessage='Failed to parse file') => {
  // Prompt user for file input
  const input = document.createElement('input')
  input.type = 'file'
  input.onchange = () => {
    // Read file data
    const reader = new FileReader()
    reader.onloadend = () => {
      try {
        const data = parse(reader.result)
        onData(data)
      } catch (error) {
        window.alert(errorMessage)
        console.error(error)
      }
    }
    reader.readAsText(input.files[0])
  }
  input.click()
}

export default useActions
