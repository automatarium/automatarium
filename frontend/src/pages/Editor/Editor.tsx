import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Content, EditorContent } from './editorStyle'
import { BottomPanel, EditorPanel, Menubar, Sidepanel, Toolbar, ExportImage, ImportDialog, ShareUrl, ShortcutGuide, FinalStatePopup } from '/src/components'
import { useActions, useEvent } from '/src/hooks'
import { useExportStore, useLabStore, useProjectStore, useToolStore, useViewStore } from '/src/stores'
import { haveInputFocused } from '/src/util/actions'

import PDAStackVisualiser from '../../components/PDAStackVisualiser/stackVisualiser'
import LabWindow from './components/LabWindow/LabWindow'
import { useAutosaveProject } from '../../hooks'
import TemplateDelConfDialog from './components/TemplateDelConfDialog/TemplateDelConfDialog'
import { Tool } from '/src/stores/useToolStore'
import EditorPageTour from '../Tutorials/guidedTour/EditorPageTour'

const Editor = () => {
  const navigate = useNavigate()
  const { tool, setTool } = useToolStore()
  const [priorTool, setPriorTool] = useState<Tool>()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const resetExportSettings = useExportStore(s => s.reset)
  const setViewPositionAndScale = useViewStore(s => s.setViewPositionAndScale)
  const project = useProjectStore(s => s.project)
  const [instructions, setInstructions] = useState<string>('Instructions will be shown here.')
  const [showTour, setShowTour] = useState(false)
  const closeTour = () => {
    setShowTour(false)
  }
  const lab = useLabStore(s => s.lab)
  const getProjectinLab = useLabStore(s => s.getProjectById)
  const setLab = useLabStore(s => s.setLab)
  const showLabWindow = useLabStore(s => s.showLabWindow)
  const setShowLabWindow = useLabStore(s => s.setShowLabWindow)
  

  useEffect(() => {
    const tourShown = localStorage.getItem('tourEditorShown')
    if (!tourShown) {
      const timeoutId = setTimeout(() => {
        setShowTour(true)
      }, 1000)
      localStorage.setItem('tourEditorShown', 'true')
      return () => clearTimeout(timeoutId)
    }
  }, [])

  if (!project) {
    navigate('/new')
    return null
  }

  if (lab && getProjectinLab(project._id) === undefined) {
    setLab(null)
    setShowLabWindow(false)
  }


  const projectType = project.config.type

  const isSaving = useAutosaveProject()


  useActions(true)

  useEffect(() => {
    resetExportSettings()
    setViewPositionAndScale({ x: 0, y: 0 }, 1)
  }, [])

  useEvent('keydown', e => {
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
      <Menubar isSaving={isSaving} />
      <Content>
        <Toolbar />
        {showLabWindow && lab && <LabWindow/>
      }
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

      <FinalStatePopup />

      <ExportImage />
      <ShareUrl />

      <TemplateDelConfDialog
        isOpen={confirmDialogOpen}
        setOpen={() => setConfirmDialogOpen(true)}
        setClose={() => setConfirmDialogOpen(false)}
      />

      <ImportDialog navigateFunction={navigate} />
      {showTour && <EditorPageTour onClose={closeTour}/>}
    </>
  )
}

export default Editor