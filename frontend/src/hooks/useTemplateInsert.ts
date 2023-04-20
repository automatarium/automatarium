import { useState } from 'react'

import { useEvent } from '/src/hooks'
import { useProjectStore, useToolStore, useTemplatesStore, useSelectionStore, useTemplateStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'
import { Template, CopyData, Project, AutomataState } from '/src/types/ProjectTypes'
import { StoredProject } from '/src/stores/useProjectStore'
import { PASTE_POSITION_OFFSET } from '/src/config/rendering'

interface TemplateStore {
    template: Template,
    set: (template: Template) => void,
    /**
     * Updates the current project. This doesn't reset the history like `set`
     * @param project
     */
    update: (template: Template) => void,
    setName: (newName: string) => void
  }
  

const useTemplateInsert = () => {
  const tool = useToolStore(s => s.tool)
  const templates = useTemplatesStore(s => s.templates)
  const [mousePos, setMousePos] = useState({x: null, y: null})
  const [showGhost, setShowGhost] = useState(false)
  const project = useProjectStore(s => s.project)
  const createState = useProjectStore(s => s.createState)
  const createComment = useProjectStore(s => s.createComment)
  const createTransition = useProjectStore(s => s.createTransition)
  const removeStates = useProjectStore(s => s.removeStates)
  const selectStates = useSelectionStore(s => s.setStates)
  const selectTransitions = useSelectionStore(s => s.setTransitions)
  const selectComments = useSelectionStore(s => s.setComments)
  const setStateInitial = useProjectStore(s => s.setStateInitial)
  const commit = useProjectStore(s => s.commit)
  // Which template to insert  
  const template = useTemplateStore((s: TemplateStore) => s.template)
//   const setTemplate = useTemplateStore(s => s.set)
  const createBatch = (createData: CopyData | Template) => {
    let isInitialStateUpdated = false
    if (createData.projectType !== project.projectType) {
      alert(`Error: you cannot insert elements from a ${createData.projectType} project into a ${project.projectType} project.`)
      return
    }
    // Perhaps this will be passed through
    const isNewProject = createData.projectSource !== project._id
    const newTransitions = structuredClone(createData.transitions)
    newTransitions.forEach(transition => {
      transition.from = null
      transition.to = null
    })
    createData.states.forEach(state => {
      // TODO: ensure position isn't out of window
      // Probably will have to take adjusting position out of this function
      console.log(`this state is ${state.id}`)
      state.x += PASTE_POSITION_OFFSET
      state.y += PASTE_POSITION_OFFSET
      const newId = createState(state)
      // Update transitions to new state id
      console.log(`replacing ${state.id} with ${newId}`)
      createData.transitions.forEach((transition, i) => {
        if (transition.from === state.id && newTransitions[i].from === null) {
          newTransitions[i].from = newId
        }
        if (transition.to === state.id && newTransitions[i].to === null) {
          newTransitions[i].to = newId
        }
      })
      // Update initial state id if applicable
      if (createData.initialStateId === state.id && !isInitialStateUpdated) {
        createData.initialStateId = newId
        isInitialStateUpdated = true
      }
      state.id = newId
    })
    // TODO: Improve this error handling
    console.log(newTransitions)
    if (newTransitions.find(transition => transition.from === null || transition.to === null)) {
      alert('Sorry, there was an error')
      removeStates(createData.states.map(state => state.id))
      return
    }
    createData.transitions = newTransitions
    selectStates(createData.states.map(state => state.id))
    createData.comments.forEach(comment => {
      // TODO: ensure position isn't out of window
      comment.x += PASTE_POSITION_OFFSET
      comment.y += PASTE_POSITION_OFFSET
      const newId = createComment(comment)
      comment.id = newId
    })
    selectComments(createData.comments.map(comment => comment.id))
    createData.transitions.forEach(transition => {
      const newId = createTransition(transition)
      transition.id = newId
    })
    selectTransitions(createData.transitions.map(transition => transition.id))
    if (isNewProject && createData.initialStateId !== null && project.initialState === null) {
      setStateInitial(createData.initialStateId)
    }
    commit()
  }
  
  const myTemplate: Template = {
    states: [{
        "x": 265,
        "y": 160,
        "isFinal": false,
        "id": 5
    }],
    transitions: [],
    comments: [],
    projectSource: '5e1250b2-bee4-48a1-88f1-ef3540b13df1',
    projectType: 'FSA',
    initialStateId: null,
    _id: 'template_id',
    name: 'my template'
  }

  useEvent('svg:mousemove', e => {
    // Keep track of the mouse position
    setMousePos(positionFromEvent(e))
  })

  useEvent('svg:mousedown', e => {
    // Make sure we are in the template tool
    if (tool === 'hand' && e.detail.didTargetSVG && e.detail.originalEvent.button === 0) {
        // Track mousedown event
        console.log('mouse down')
    }
    console.log('mouse down')
    
  })

  useEvent('svg:mouseup', e => {
    // Track mouseup event
    // setShowGhost(false)
    // if (tool === 'state' && e.detail.didTargetSVG && e.detail.originalEvent.button === 0) {
    // //   createState(positionFromEvent(e))
    //   commit()
    // }
    if (tool === 'hand' && e.detail.didTargetSVG && e.detail.originalEvent.button === 0) {
        // Track mousedown event
        // createBatch(currentTemplate)
        // console.log(currentTemplate)
    }
    // moveStatesToMouse(positionFromEvent(e), template.states)
    // createBatch(template)
    console.log('mouseup')
    console.log(template)
    
  }, [tool])

  return { ghostState: tool === 'state' && showGhost && mousePos }
}

const positionFromEvent = e => {
  const doSnap = !e.detail.originalEvent.altKey
  const pos = { x: e.detail.viewX, y: e.detail.viewY }
  return doSnap ? snapPosition(pos) : pos
}

const moveStatesToMouse = (mousePos: {x: number, y: number}, states: AutomataState[]) => {
    // Find the leftmost state (lowest x val)
    const originState = states.reduce((previous, current) => {
        return current.x < previous.x ? current : previous
    })
    const offsetX = mousePos.x - originState.x
    const offsetY = mousePos.y - originState.y
    states.forEach((state) => {
        state.x += offsetX
        state.y += offsetY
    })
}

const snapPosition = ({ x, y }) =>
  ({ x: Math.floor(x / GRID_SNAP) * GRID_SNAP, y: Math.floor(y / GRID_SNAP) * GRID_SNAP })

export default useTemplateInsert