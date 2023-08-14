import { MouseEvent, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useProjectsStore, useProjectStore, useSelectionStore, useToolStore, useViewStore, useTemplatesStore, useTemplateStore } from '/src/stores'
import { SCROLL_MAX, SCROLL_MIN, VIEW_MOVE_STEP, COPY_DATA_KEY } from '/src/config/interactions'
import { convertJFLAPXML } from '@automatarium/jflap-translator'
import { haveInputFocused } from '/src/util/actions'
import { dispatchCustomEvent } from '/src/util/events'
import { InsertGroupResponseType, StoredProject, createNewProject } from '/src/stores/useProjectStore'
import { reorderStates } from '@automatarium/simulation/src/reorder'
import { convertNFAtoDFA } from '@automatarium/simulation/src/convert'
import { CopyData, FSAProjectGraph } from '/src/types/ProjectTypes'
import { showWarning } from '/src/components/Warning/Warning'
import { stopTemplateInsert } from '/src/components/Sidepanel/Panels/Templates/Templates'

/**
 * Combination of keys. Used to call an action
 */
export type HotKey = {key: string, meta?: boolean, shift?: boolean, alt?: boolean}

/**
 * Represents an action handler
 */
interface Handler {
  handler: (e?: KeyboardEvent | MouseEvent) => void
  hotkeys?: HotKey[]
  disabled?: () => boolean
}

const isWindows = /Win/.test(navigator.platform)
export const formatHotkey = (hotkey: HotKey): string => [
  hotkey.meta && (isWindows ? (isWindows ? 'Ctrl' : '⌃') : '⌘'),
  hotkey.alt && (isWindows ? 'Alt' : '⌥'),
  hotkey.shift && (isWindows ? 'Shift' : '⇧'),
  hotkey.key?.toUpperCase()
].filter(Boolean).join(isWindows ? '+' : ' ')

/**
 * Calculates the coodinates and scale in order to zoom the viewing window to the project
 */
export const calculateZoomFit = () => {
  // Get state
  const view = useViewStore.getState()

  // Margin around view
  const border = 40

  // Get the bounding box of the SVG group
  const b = (document.querySelector('#automatarium-graph > g') as SVGGElement).getBBox()
  // Bail if the bounding box is too small
  if (Math.max(Math.abs(b.width), Math.abs(b.height)) < border) return
  const [x, y, width, height] = [b.x - border, b.y - border, b.width + border * 2, b.height + border * 2]
  // Calculate fit region
  const desiredScale = Math.max(width / view.size.width, height / view.size.height)
  // Calculate x and y to centre graph
  return {
    scale: desiredScale,
    x: x + (width - view.size.width * desiredScale) / 2,
    y: y + (height - view.size.height * desiredScale) / 2
  }
}

const useActions = (registerHotkeys = false) => {
  const undo = useProjectStore(s => s.undo)
  const redo = useProjectStore(s => s.redo)
  const selectNone = useSelectionStore(s => s.selectNone)
  const selectAll = useSelectionStore(s => s.selectAll)
  const selectedStatesIds = useSelectionStore(s => s.selectedStates)
  const selectedCommentsIds = useSelectionStore(s => s.selectedComments)
  const selectedTransitionsIds = useSelectionStore(s => s.selectedTransitions)
  const selectStates = useSelectionStore(s => s.setStates)
  const selectTransitions = useSelectionStore(s => s.setTransitions)
  const selectComments = useSelectionStore(s => s.setComments)
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
  const createState = useProjectStore(s => s.createState)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const setTool = useToolStore(s => s.setTool)
  const project = useProjectStore(s => s.project)
  const insertGroup = useProjectStore(s => s.insertGroup)
  const updateGraph = useProjectStore(s => s.updateGraph)
  const projectType = useProjectStore(s => s.project.config.type)
  const setViewPositionAndScale = useViewStore(s => s.setViewPositionAndScale)
  const template = useTemplateStore(s => s.template)
  const setTemplate = useTemplateStore(s => s.setTemplate)
  const deleteTemplate = useTemplatesStore(s => s.deleteTemplate)

  const navigate = useNavigate()

  const nothingSelected = selectedCommentsIds.length === 0 && selectedStatesIds.length === 0 && selectedTransitionsIds.length === 0

  // TODO: memoize
  const actions: Record<string, Handler> = {
    NEW_FILE: {
      handler: () => navigate('/new')
    },
    IMPORT_AUTOMATARIUM_PROJECT: {
      hotkeys: [{ key: 'i', meta: true }],
      handler: async () => {
        if (window.confirm('Importing will override your current project. Continue anyway?')) { promptLoadFile(JSON.parse, setProject, 'Failed to open automatarium project', '.json') }
      }
    },
    IMPORT_JFLAP_PROJECT: {
      hotkeys: [{ key: 'i', meta: true, shift: true }],
      handler: async () => {
        if (window.confirm('Importing will override your current project. Continue anyway?')) { promptLoadFile(convertJFLAPXML, setProject, 'Failed to open JFLAP project', '.jff') }
      }
    },
    SAVE_FILE: {
      hotkeys: [{ key: 's', meta: true }],
      handler: () => {
        const project = useProjectStore.getState().project
        const toSave = { ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } }
        upsertProject(toSave)
        setLastSaveDate(new Date().getTime())
      }
    },
    SAVE_FILE_AS: {
      hotkeys: [{ key: 's', shift: true, meta: true }],
      handler: () => {
        // Pull project state
        const project = useProjectStore.getState().project

        // Create a download link and use it
        const a = document.createElement('a')
        const file = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
        a.href = URL.createObjectURL(file)
        // File extension explicitly added to allow for file names with dots
        a.download = project.meta.name.replace(/[#%&{}\\<>*?/$!'":@+`|=]/g, '') + '.json'
        a.click()
      }
    },
    EXPORT: {
      hotkeys: [{ key: 'e', meta: true }],
      handler: () => dispatchCustomEvent('exportImage', null)
    },
    EXPORT_AS_PNG: {
      hotkeys: [{ key: 'e', shift: true, meta: true }],
      handler: () => dispatchCustomEvent('exportImage', { type: 'png' })
    },
    EXPORT_AS_SVG: {
      hotkeys: [{ key: 'e', shift: true, alt: true, meta: true }],
      handler: () => dispatchCustomEvent('exportImage', { type: 'svg' })
    },
    EXPORT_TO_CLIPBOARD: {
      hotkeys: [{ key: 'c', shift: true, meta: true }],
      handler: () => dispatchCustomEvent('exportImage', { type: 'png', clipboard: true })
    },
    EXPORT_AS_JFLAP: {
      disabled: () => true,
      handler: () => console.log('Export JFLAP')
    },
    OPEN_PREFERENCES: {
      hotkeys: [{ key: ',', meta: true }],
      handler: () => dispatchCustomEvent('modal:preferences', null)
    },
    UNDO: {
      hotkeys: [{ key: 'z', meta: true }],
      handler: undo
    },
    REDO: {
      hotkeys: [{ key: 'y', meta: true }],
      handler: redo
    },
    COPY: {
      hotkeys: [{ key: 'c', meta: true }],
      handler: () => {
        // This will use the CopyData type defined in ProjectTypes
        const copyData = selectionToCopyTemplate(selectedStatesIds, selectedCommentsIds, selectedTransitionsIds, project)
        localStorage.setItem(COPY_DATA_KEY, JSON.stringify(copyData))
      }
    },
    PASTE: {
      hotkeys: [{ key: 'v', meta: true }],
      handler: () => {
        const pasteData = JSON.parse(localStorage.getItem(COPY_DATA_KEY)) as CopyData
        if (pasteData === null) {
          // Copy has not been executed
          return
        }
        const insertResponse = insertGroup(pasteData)
        if (insertResponse.type === InsertGroupResponseType.SUCCESS) {
          selectComments(insertResponse.body.comments.map(comment => comment.id))
          selectStates(insertResponse.body.states.map(state => state.id))
          selectTransitions(insertResponse.body.transitions.map(transition => transition.id))
          commit()
        } else if (insertResponse.type === InsertGroupResponseType.FAIL) {
          alert(insertResponse.body)
        }
      }

    },
    SELECT_ALL: {
      hotkeys: [{ key: 'a', meta: true }],
      handler: selectAll
    },
    DELETE: {
      hotkeys: [{ key: 'Delete' }, { key: 'Backspace' }],
      handler: () => {
        // If a template is selected and nothing else is, delete the template
        if (template !== null && nothingSelected) {
          if (window.confirm(`Are you sure you want to delete your template '${template.name}'?`)) {
            deleteTemplate(template._id)
            stopTemplateInsert(setTemplate, setTool)
          }
        } else if (!nothingSelected) {
          // Otherwise, delete selection
          removeStates(selectedStatesIds)
          removeTransitions(selectedTransitionsIds)
          removeComments(selectedCommentsIds)
          selectNone()
          commit()
        }
      }
    },
    DELETE_EDGE: {
      disabled: () => useSelectionStore.getState()?.selectedTransitions?.length === 0,
      handler: () => {
        const tIds = selectedTransitionsIds
        const { transitions } = useProjectStore.getState()?.project ?? {}
        const oneTransitionOnEdge = transitions.find(t => tIds.includes(t.id))
        // Expand IDs to include ALL on the edge
        const allTransitionIdsOnEdge = transitions.filter(
          t => t.from === oneTransitionOnEdge.from && t.to === oneTransitionOnEdge.to
        ).map(t => t.id)
        removeTransitions(allTransitionIdsOnEdge)
        selectNone()
        commit()
      }
    },
    ZOOM_IN: {
      hotkeys: [{ key: '=', meta: true }],
      handler: () => zoomViewTo(useViewStore.getState().scale - 0.1)
    },
    ZOOM_OUT: {
      hotkeys: [{ key: '-', meta: true }],
      handler: () => zoomViewTo(useViewStore.getState().scale + 0.1)
    },
    ZOOM_100: {
      hotkeys: [{ key: '0', meta: true }],
      handler: () => { zoomViewTo(1) }
    },
    ZOOM_FIT: {
      hotkeys: [{ key: 'f', shift: true }],
      handler: () => {
        const values = calculateZoomFit()
        if (values) {
          setViewPositionAndScale({ x: values.x, y: values.y }, values.scale)
        }
      }
    },
    FULLSCREEN: {
      handler: () => document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen()
    },
    TESTING_LAB: {
      hotkeys: [{ key: '1', shift: true }],
      handler: () => dispatchCustomEvent('sidepanel:open', { panel: 'test' })
    },
    FILE_INFO: {
      hotkeys: [{ key: '2', shift: true }],
      handler: () => dispatchCustomEvent('sidepanel:open', { panel: 'about' })
    },
    FILE_OPTIONS: {
      hotkeys: [{ key: '3', shift: true }],
      handler: () => dispatchCustomEvent('sidepanel:open', { panel: 'options' })
    },
    CONVERT_TO_DFA: {
      disabled: () => projectType !== 'FSA' || project.initialState === null,
      handler: () => {
        updateGraph(convertNFAtoDFA(project as FSAProjectGraph))
        commit()
      }
    },
    AUTO_LAYOUT: {
      disabled: () => true,
      handler: () => console.log('Auto Layout')
    },
    OPEN_DOCS: {
      handler: () => window.open('https://github.com/automatarium/automatarium/wiki', '_blank')
    },
    KEYBOARD_SHORTCUTS: {
      hotkeys: [{ key: '/', meta: true }],
      handler: () => dispatchCustomEvent('modal:shortcuts', null)
    },
    PRIVACY_POLICY: {
      handler: () => window.open('/privacy', '_blank')
    },
    OPEN_ABOUT: {
      handler: () => window.open('/about', '_blank')
    },
    MOVE_VIEW_LEFT: {
      hotkeys: [{ key: 'ArrowLeft' }],
      handler: () => moveView({ x: -VIEW_MOVE_STEP })
    },
    MOVE_VIEW_RIGHT: {
      hotkeys: [{ key: 'ArrowRight' }],
      handler: () => moveView({ x: VIEW_MOVE_STEP })
    },
    MOVE_VIEW_UP: {
      hotkeys: [{ key: 'ArrowUp' }],
      handler: () => moveView({ y: -VIEW_MOVE_STEP })
    },
    MOVE_VIEW_DOWN: {
      hotkeys: [{ key: 'ArrowDown' }],
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
      disabled: () => useSelectionStore.getState()?.selectedStates?.length === 0,
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
      handler: (e: MouseEvent) => {
        const selectedCommentID = useSelectionStore.getState().selectedComments?.[0]
        if (selectedCommentID === undefined) return
        window.setTimeout(() => dispatchCustomEvent('editComment', { x: e.clientX, y: e.clientY, id: selectedCommentID }), 100)
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
    EDIT_TRANSITIONS_GROUP: {
      disabled: () => useSelectionStore.getState()?.selectedTransitions?.length === 0,
      handler: () => {
        const selectedTransitions = useSelectionStore.getState().selectedTransitions
        if (selectedTransitions === undefined) return
        window.setTimeout(() => dispatchCustomEvent('editTransitionGroup', { ids: selectedTransitions }), 100)
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
      handler: (e: MouseEvent) => window.setTimeout(() => dispatchCustomEvent('editComment', { x: e.clientX, y: e.clientY }), 100)
    },
    SET_STATE_NAME: {
      handler: () => {
        const selectedStateID = useSelectionStore.getState().selectedStates?.[0]
        if (selectedStateID === undefined) return
        window.setTimeout(() => dispatchCustomEvent('editStateName', { id: selectedStateID }), 100)
      }
    },
    SET_STATE_LABEL: {
      handler: () => {
        const selectedStateID = useSelectionStore.getState().selectedStates?.[0]
        if (selectedStateID === undefined) return
        window.setTimeout(() => dispatchCustomEvent('editStateLabel', { id: selectedStateID }), 100)
      }
    },
    CREATE_STATE: {
      handler: (e: MouseEvent) => {
        const [viewX, viewY] = screenToViewSpace(e.clientX, e.clientY)
        createState({ x: viewX, y: viewY })
        commit()
      }
    },
    ALIGN_STATES_HORIZONTAL: {
      disabled: () => useSelectionStore.getState()?.selectedStates?.length <= 1,
      handler: () => {
        const selected = useSelectionStore.getState().selectedStates
        const storeState = useProjectStore.getState()
        const states = storeState?.project?.states?.filter(s => selected.includes(s.id))
        if (states && states.length > 1) {
          const meanY = states.map(state => state.y).reduce((a, b) => a + b) / states.length
          storeState.updateStates(states.map(state => ({ ...state, y: meanY })))
          commit()
        }
      }
    },
    ALIGN_STATES_VERTICAL: {
      disabled: () => useSelectionStore.getState()?.selectedStates?.length <= 1,
      handler: () => {
        const selected = useSelectionStore.getState().selectedStates
        const storeState = useProjectStore.getState()
        const states = storeState?.project?.states?.filter(s => selected.includes(s.id))
        if (states && states.length > 1) {
          const meanX = states.map(state => state.x).reduce((a, b) => a + b) / states.length
          storeState.updateStates(states.map(state => ({ ...state, x: meanX })))
          commit()
        }
      }
    },
    TOOL_CURSOR: {
      hotkeys: [{ key: 'V' }],
      handler: () => setTool('cursor')
    },
    TOOL_HAND: {
      hotkeys: [{ key: 'H' }],
      handler: () => setTool('hand')
    },
    TOOL_STATE: {
      hotkeys: [{ key: 'S' }],
      handler: () => setTool('state')
    },
    TOOL_TRANSITION: {
      hotkeys: [{ key: 'T' }],
      handler: () => setTool('transition')
    },
    TOOL_COMMENT: {
      hotkeys: [{ key: 'C' }],
      handler: () => setTool('comment')
    },
    TOOL_DELETE: {
      hotkeys: [{ key: 'D' }],
      handler: () => {
        setTool('delete')
      }
    },
    REORDER_GRAPH: {
      disabled: () => project.initialState === null,
      handler: () => {
        updateGraph(reorderStates(project))
        commit()
      }
    }
  }

  // Register action hotkeys
  useEffect(() => {
    if (registerHotkeys) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Hotkeys are disabled if an input is focused
        if (haveInputFocused(e)) return
        // Check hotkeys

        for (const action of Object.values(actions)) {
          // Skip if no hotkey
          if (!action.hotkeys) { continue }

          // Skip if disabled
          if (action.disabled && action.disabled()) { continue }

          const hotkeys = action.hotkeys
          const activeHotkey = hotkeys.find(hotkey => {
            // Guard against other keys
            const letterMatch = e.code === `Key${hotkey.key.toUpperCase()}`
            const digitMatch = e.code === `Digit${hotkey.key}`
            const keyMatch = e.key === hotkey.key
            if (!(letterMatch || digitMatch || keyMatch)) { return false }

            // Check augmenting keys
            // The !! is to force the type to be a boolean so that the equality check passess correctly
            // i.e. Without it, if meta is undefined then it wont equal false
            if (!!hotkey.meta !== (e.metaKey || e.ctrlKey)) { return false }
            if (!!hotkey.alt !== e.altKey) { return false }
            return !!hotkey.shift === e.shiftKey
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
  return useMemo(() => Object.fromEntries(Object.entries(actions).map(([key, action]) => ([key, {
    ...action,
    label: action.hotkeys ? formatHotkey(action.hotkeys[0]) : null
  }]))), [actions])
}

const zoomViewTo = (to: number) => {
  const view = useViewStore.getState()
  if (view.scale === to) { return }
  const newScale = Math.min(SCROLL_MAX, Math.max(SCROLL_MIN, to))
  const scrollAmount = newScale - view.scale
  if (Math.abs(scrollAmount) < 1e-3) {
    view.setViewScale(to < 1 ? SCROLL_MIN : SCROLL_MAX)
  } else {
    view.setViewPosition({
      x: view.position.x - view.size.width / 2 * scrollAmount,
      y: view.position.y - view.size.height / 2 * scrollAmount
    })
    view.setViewScale(newScale)
  }
}

const promptLoadFile = <T>(parse: (text: ArrayBuffer | string) => T, onData: (val: T) => void, errorMessage = 'Failed to parse file', accept: string) => {
  // Prompt user for file input
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = accept
  input.onchange = () => {
    // Read file data
    const reader = new FileReader()
    reader.onloadend = () => {
      try {
        const fileData = parse(reader.result)
        const project = {
          ...createNewProject(),
          ...fileData
        }
        onData({
          ...project,
          meta: {
            ...project.meta,
            name: input.files[0]?.name.split('.').slice(0, -1).join('.')
          }
        })
      } catch (error) {
        showWarning(`${errorMessage}\n${error}`)
        console.error(error)
      }
    }
    reader.readAsText(input.files[0])
  }
  input.click()
}

// Takes in the IDs of states, comments, and transitions
// Parameters also include  the current project and whether a template is being created
// Outputs a CopyData to be copied or Template object to be created into a template
export const selectionToCopyTemplate = (stateIds: number[], commentIds: number[], transitionIds: number[], project: StoredProject): CopyData => {
  const selectedStates = project.states.filter(state => stateIds.includes(state.id))
  const selectedComments = project.comments.filter(comment => commentIds.includes(comment.id))
  const selectedTransitions = project.transitions.filter(transition => transitionIds.includes(transition.id))
  const isInitialSelected = stateIds.includes(project.initialState)
  return {
    states: selectedStates,
    comments: selectedComments,
    transitions: selectedTransitions,
    projectSource: project._id,
    projectType: project.projectType,
    initialStateId: isInitialSelected ? project.initialState : null
  }
}

export default useActions
