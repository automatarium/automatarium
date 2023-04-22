import { useEvent } from '/src/hooks'
import { useProjectStore, useToolStore, useSelectionStore, useTemplateStore } from '/src/stores'
import { GRID_SNAP } from '/src/config/interactions'
import { AutomataState } from '/src/types/ProjectTypes'
import { InsertGroupResponseType } from '../stores/useProjectStore'

const useTemplateInsert = () => {
  const tool = useToolStore(s => s.tool)
  const selectStates = useSelectionStore(s => s.setStates)
  const selectTransitions = useSelectionStore(s => s.setTransitions)
  const selectComments = useSelectionStore(s => s.setComments)
  const commit = useProjectStore(s => s.commit)
  const insertGroup = useProjectStore(s => s.insertGroup)
  const template = useTemplateStore(s => s.template)

  useEvent('svg:mousemove', e => {
    // Keep track of the mouse position
  })

  useEvent('svg:mousedown', e => {
    // Track mousedown event
    // Showing ghost template will go here
  })

  useEvent('svg:mouseup', e => {
    // Track mouseup event
    if (tool === 'template' && e.detail.didTargetSVG && e.detail.originalEvent.button === 0) {
      const copyTemplate = structuredClone(template)
      moveStatesToMouse(positionFromEvent(e), copyTemplate.states)
      const insertResponse = insertGroup(copyTemplate)
      console.log(insertResponse)
      if (insertResponse.type === InsertGroupResponseType.SUCCESS) {
        selectComments(insertResponse.body.comments.map(comment => comment.id))
        selectStates(insertResponse.body.states.map(state => state.id))
        selectTransitions(insertResponse.body.transitions.map(transition => transition.id))
        commit()
      } else if (insertResponse.type === InsertGroupResponseType.FAIL) {
        alert(insertResponse.body)
      }
    }
  }, [template, tool])
}

const positionFromEvent = (e: CustomEvent) => {
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
