import { useEvent } from '/src/hooks'
import { useProjectStore, useSelectionStore, useTemplateStore, useToolStore } from '/src/stores'
import { AutomataState, ProjectComment } from '/src/types/ProjectTypes'
import { InsertGroupResponseType } from '../stores/useProjectStore'
import { snapPosition } from '/src/util/points'
import { useEffect, useState } from 'react'

const useTemplateInsert = () => {
  const selectStates = useSelectionStore(s => s.setStates)
  const selectTransitions = useSelectionStore(s => s.setTransitions)
  const selectComments = useSelectionStore(s => s.setComments)
  const commit = useProjectStore(s => s.commit)
  const insertGroup = useProjectStore(s => s.insertGroup)
  const { template, setTemplate } = useTemplateStore()
  const { tool, setTool } = useToolStore()

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showGhost, setShowGhost] = useState(false)

  useEvent('svg:mousemove', e => {
    if (template !== null) {
      setMousePos(positionFromEvent(e))
    }
  }, [template])

  useEffect(() => {
    if (tool === null && template !== null) { setShowGhost(true) }
  }, [tool, template])

  useEvent('svg:mouseup', e => {
    // Track mouseup event
    setShowGhost(false)
    if (template !== null && e.detail.didTargetSVG && e.detail.originalEvent.button === 0) {
      const copyTemplate = structuredClone(template)
      moveStatesToMouse(positionFromEvent(e), copyTemplate.states, copyTemplate.comments)
      const insertResponse = insertGroup(copyTemplate, true)
      if (insertResponse.type === InsertGroupResponseType.SUCCESS) {
        selectComments(insertResponse.body.comments.map(comment => comment.id))
        selectStates(insertResponse.body.states.map(state => state.id))
        selectTransitions(insertResponse.body.transitions.map(transition => transition.id))
        commit()
        setTool('cursor')
        setTemplate(null)
      } else if (insertResponse.type === InsertGroupResponseType.FAIL) {
        alert(insertResponse.body)
      }
    }
  }, [template])

  return { ghostTemplate: template !== null && showGhost && mousePos }
}

const positionFromEvent = (e: CustomEvent) => {
  const doSnap = !e.detail.originalEvent.altKey
  const pos = { x: e.detail.viewX, y: e.detail.viewY }
  return doSnap ? snapPosition(pos) : pos
}

export const moveStatesToMouse = (mousePos: {x: number, y: number}, states: AutomataState[], comments: ProjectComment[]) => {
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
  if (comments) {
    comments.forEach(comment => {
      comment.x += offsetX
      comment.y += offsetY
    })
  }
}

export default useTemplateInsert
