import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'

import { Content, EditorContent } from './editorStyle'
import { BottomPanel, EditorPanel, Menubar, Sidepanel, Toolbar, ExportImage, ImportDialog, ShareUrl, ShortcutGuide, FinalStatePopup } from '/src/components'
import { useActions, useEvent } from '/src/hooks'
import { useExportStore, useModuleStore, useProjectStore, useToolStore, useViewStore } from '/src/stores'
import { haveInputFocused } from '/src/util/actions'

import PDAStackVisualiser from '../../components/PDAStackVisualiser/stackVisualiser'
import ModuleWindow from './components/ModuleWindow/ModuleWindow'
import { useAutosaveProject } from '../../hooks'
import TemplateDelConfDialog from './components/TemplateDelConfDialog/TemplateDelConfDialog'
import { Tool } from '/src/stores/useToolStore'
import EditorPageTour from '../Tutorials/guidedTour/EditorPageTour'
import TourButton from '/src/components/TourButton/TourButton'

const Editor = () => {
  const navigate = useNavigate()
  const { tool, setTool } = useToolStore()
  const [priorTool, setPriorTool] = useState<Tool>()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const resetExportSettings = useExportStore(s => s.reset)
  const setViewPositionAndScale = useViewStore(s => s.setViewPositionAndScale)
  const project = useProjectStore(s => s.project)
  const [showTour, setShowTour] = useState(false)

  const closeTour = () => {
    setShowTour(false)
  }

  const showTourHandler = () => {
    setShowTour(true)
  }

  const currentModule = useModuleStore(s => s.module)
  const getProjectinModule = useModuleStore(s => s.getProjectById)
  const setModule = useModuleStore(s => s.setModule)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)

  const [panelWidth, setPanelWidth] = useState(250) // Default panel width
  const handlePanelWidthChange = (newWidth) => {
    setPanelWidth(newWidth)
  }
  useEffect(() => {
    // Reset panel width when currentModule changes
    if (showModuleWindow) {
      setPanelWidth(250) // Reset to default width
    }
  }, [showModuleWindow])

  // useEffect(() => {
  //   const tourShown = localStorage.getItem('tourEditorShown')
  //   if (!tourShown) {
  //     const timeoutId = setTimeout(() => {
  //       setShowTour(true)
  //     }, 1000)
  //     localStorage.setItem('tourEditorShown', 'true')
  //     return () => clearTimeout(timeoutId)
  //   }
  // }, [])

  if (!project) {
    navigate('/new')
    return null
  }

  useEffect(() => {
    if (currentModule && getProjectinModule(project._id) === undefined) {
      setModule(null)
      setShowModuleWindow(false)
    }

    if (currentModule == null) {
      setShowModuleWindow(false)
    }
  }, [currentModule, project, getProjectinModule])

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
        {showModuleWindow && currentModule && <ModuleWindow onPanelWidthChange={handlePanelWidthChange} />
      }
        <EditorContent>
          <EditorPanel />
          <BottomPanel />
        </EditorContent>
        {(projectType === 'PDA') &&
          <PDAStackVisualiser panelWidth={panelWidth} />
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

    <TourButton
      icon={<HelpCircle />}
      onClick={showTourHandler}>
    </TourButton>

      <ImportDialog navigateFunction={navigate} />
      {showTour && <EditorPageTour onClose={closeTour}/>}
    </>
  )
}

export default Editor
