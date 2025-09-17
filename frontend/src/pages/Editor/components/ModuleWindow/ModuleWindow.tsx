import React, { useState, useRef } from 'react'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'
import {
  ModuleWindowWrapper,
  PaginationWrapper,
  ResizeHandle,
  CloseButton,
  TitleWrapper,
  Title
} from './moduleWindowStyling'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '/src/components'
import { useTranslation } from 'react-i18next'

const ModuleWindow = ({ onPanelWidthChange }) => {
  const { t } = useTranslation(['common', 'editor'])
  const currentModule = useModuleStore((s) => s.module)
  const currentProject = useProjectStore((s) => s.project)
  const currentQuestionIndex = currentModule.projects.findIndex(
    (project) => project._id === currentProject._id
  )
  const updateModule = useModulesStore((s) => s.upsertModule)
  const setProject = useProjectStore((s) => s.set)
  const setShowModuleWindow = useModuleStore((s) => s.setShowModuleWindow)

  const [panelWidth, setPanelWidth] = useState('300px')
  const panelRef = useRef<HTMLDivElement | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startWidth = panelRef.current ? panelRef.current.offsetWidth : 300

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth + (moveEvent.clientX - startX)
      if (newWidth > 650) newWidth = 650
      if (newWidth < 300) newWidth = 300
      setPanelWidth(`${newWidth}px`)
      onPanelWidthChange(newWidth)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleClose = () => setShowModuleWindow(false)

  const handlePageChange = (index: number) => {
    const project = useProjectStore.getState().project
    updateModule(currentModule)
    setProject(currentModule.projects[index])
  }

  if (!currentModule || !currentProject) {
    return (
      <ModuleWindowWrapper width={panelWidth}>
        {t('component.module.loading', { ns: 'editor' })}
      </ModuleWindowWrapper>
    )
  }

  return (
    <ModuleWindowWrapper ref={panelRef} width={panelWidth}>
      <TitleWrapper>
        <Title>
          {t('component.module.title', {
            ns: 'editor',
            qNumber: currentQuestionIndex + 1
          })}
        </Title>
      </TitleWrapper>

      <CloseButton onClick={handleClose}>
        <X />
      </CloseButton>

      <PaginationWrapper>
        {currentQuestionIndex !== 0 && (
          <Button
            onClick={() => handlePageChange(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft />
          </Button>
        )}

        <Button style={{ backgroundColor: 'gray' }}>
          {currentQuestionIndex + 1}
        </Button>

        {currentQuestionIndex < currentModule.projects.length - 1 && (
          <Button onClick={() => handlePageChange(currentQuestionIndex + 1)}>
            <ChevronRight />
          </Button>
        )}
      </PaginationWrapper>

      <ResizeHandle onMouseDown={handleMouseDown} />
    </ModuleWindowWrapper>
  )
}

export default ModuleWindow
