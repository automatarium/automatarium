import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useActions, useEvent } from '/src/hooks'
import { useToolStore, useProjectStore, useExportStore, useViewStore } from '/src/stores'
import { haveInputFocused } from '/src/util/actions'
import { Menubar, Sidepanel, Toolbar, EditorPanel, BottomPanel } from '/src/components'
import { ShortcutGuide, ExportImage, ShareUrl, ImportDialog } from '/src/pages'
import { Content, EditorContent } from './editorStyle'

import PDAStackVisualiser from '../../components/PDAStackVisualiser/stackVisualiser'
import { useAutosaveProject } from '../../hooks'
import { Tool } from '/src/stores/useToolStore'

const Editor = () => {
  const navigate = useNavigate()
  const { tool, setTool } = useToolStore()
  const [priorTool, setPriorTool] = useState<Tool>()
  const resetExportSettings = useExportStore(s => s.reset)
  const setViewPositionAndScale = useViewStore(s => s.setViewPositionAndScale)
  const project = useProjectStore(s => s.project)
  // Check the user has selected a project, navigate to creation page if not
  if (!project) {
    navigate('/new')
    return null
  }
  const projectType = project.config.type

  // Auto save project as its edited
  useAutosaveProject()

  // Register action hotkey
  useActions(true)

  // Project must be set
  useEffect(() => {
    resetExportSettings()
    setViewPositionAndScale({ x: 0, y: 0 }, 1)
  }, [])
  // Change tool when holding certain keys
  useEvent('keydown', e => {
    // Hotkeys are disabled if an input is focused
    if (haveInputFocused(e)) return

    if (!priorTool && e.code === 'Space') {
      setPriorTool(tool)
      setTool('hand')
    }
    if (e.code === 'Space') {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [tool, priorTool])

  useEvent('keyup', e => {
    // Hotkeys are disabled if an input is focused
    if (haveInputFocused(e)) return

    if (priorTool && e.code === 'Space') {
      setTool(priorTool)
      setPriorTool(undefined)
    }
    if (e.code === 'Space') {
      e.preventDefault()
      e.stopPropagation()
    }
  }, [tool, priorTool])

  // Middle mouse pan
  useEvent('svg:mousedown', e => {
    if (!priorTool && e.detail.originalEvent.button === 1) {
      setPriorTool(tool)
      setTool('hand')
    }
  }, [tool, priorTool])

  useEvent('svg:mouseup', e => {
    if (priorTool && e.detail.originalEvent.button === 1) {
      setTool(priorTool)
      setPriorTool(undefined)
    }
  }, [tool, priorTool])

  return (
    <>
      <Menubar />
      <Content>
        <Toolbar />
        <EditorContent>
          <EditorPanel />
          <BottomPanel />
        </EditorContent>
        {(projectType === 'PDA') &&
          <PDAStackVisualiser />
        }
        <Sidepanel />

      </Content>

      <ShortcutGuide />

      <ExportImage />

      <ShareUrl />

      <ImportDialog navigateFunction={navigate} />

    </>
  )
}

export default Editor
