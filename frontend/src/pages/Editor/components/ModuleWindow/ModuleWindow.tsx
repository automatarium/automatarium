import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { createNewModuleProject } from 'src/stores/useModuleStore'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'
import {
  ModuleWindowWrapper,
  TextArea,
  PaginationWrapper,
  ResizeHandle,
  CloseButton,
  TitleWrapper,
  ModuleWindowTitle, // renamed here
  Content,
  ButtonContainer,
  EditButton
} from './moduleWindowStyling'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '/src/components'
import { useTranslation } from 'react-i18next'

const ModuleWindow = ({ onPanelWidthChange }) => {
  const { t } = useTranslation(['common', 'editor'])
  const currentModule = useModuleStore(s => s.module)

  const updateQuestion = useModuleStore(s => s.upsertQuestion)
  const deleteQuestionFromModule = useModuleStore(s => s.deleteQuestion)
  const deleteProjectFromModule = useModuleStore(s => s.deleteProject)
  const updateProjectToModule = useModuleStore(s => s.upsertProject)
  const updateModule = useModulesStore(s => s.upsertModule)

  const currentProject = useProjectStore(s => s.project)
  const setProject = useProjectStore(s => s.set)

  const questions = currentModule?.questions || {}
  const totalQuestions = Object.keys(questions).length
  const currentQuestionIndex = currentModule?.projects.findIndex(
    project => project._id === currentProject?._id
  )

  const currentQuestion = questions[currentProject?._id] || ''
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)

  const [panelWidth, setPanelWidth] = useState('300px')
  const panelRef = useRef<HTMLDivElement | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [question, setQuestion] = useState(currentQuestion || '')

  // --- Add/Remove support ---
  const handleAdd = () => {
    const newProject = createNewModuleProject('FSA', currentModule.meta.name)
    updateProjectToModule(newProject)
    updateQuestion(newProject._id, '')
    setProject(newProject)
    setIsEditing(true)
    setQuestion('')
  }

  const handleRemove = (projectId: string) => {
    deleteProjectFromModule(projectId)
    deleteQuestionFromModule(projectId)

    if (projectId === currentProject._id && currentModule) {
      const remaining = currentModule.projects.filter(p => p._id !== projectId)
      if (remaining.length > 0) {
        setProject(remaining[0])
      }
    }
  }

  // Resize
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

  const handleClose = () => {
    setShowModuleWindow(false)
  }

  useEffect(() => {
    if (currentModule && currentProject?._id) {
      setQuestion(questions[currentProject._id] || '')
    }
  }, [currentModule, currentProject?._id])

  const saveModule = () => {
    const project = useProjectStore.getState().project
    updateProjectToModule({
      ...project,
      meta: { ...project.meta, dateEdited: new Date().getTime() }
    })
    updateModule(currentModule)
  }

  const handleEditClick = () => {
    if (isEditing) {
      const currentQuestionId = Object.keys(questions)[currentQuestionIndex]
      updateQuestion(currentQuestionId, question)
      updateModule(currentModule)
    }
    setIsEditing(!isEditing)
  }

  const handleCancelClick = () => {
    if (currentModule) {
      setQuestion(currentQuestion || '')
    }
    setIsEditing(false)
  }

  const handlePageChange = (index: number) => {
    saveModule()
    setProject(currentModule.projects[index])
  }

  // Fallback for empty modules
  if (!questions || totalQuestions === 0 || !currentModule) {
    return (
      <ModuleWindowWrapper width={panelWidth}>
        {t('component.module.loading', { ns: 'editor' })}
        <Button onClick={handleAdd}>+ {t('module_panel.add_question')}</Button>
      </ModuleWindowWrapper>
    )
  }

  return (
    <ModuleWindowWrapper ref={panelRef} width={panelWidth}>
      <TitleWrapper>
        <ModuleWindowTitle>
          {t('component.module.title', {
            ns: 'editor',
            qNumber: currentQuestionIndex + 1
          })}
        </ModuleWindowTitle>

        {isEditing ? (
          <ButtonContainer>
            <Button onClick={handleCancelClick}>
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={handleEditClick}>
              {t('component.module.button.save', { ns: 'editor' })}
            </Button>
          </ButtonContainer>
        ) : (
          <EditButton>
            <Button onClick={handleEditClick}>
              {t('component.module.button.edit', { ns: 'editor' })}
            </Button>
            <Button
              onClick={() => handleRemove(currentProject._id)}
              disabled={currentModule.projects.length <= 1}
            >
              {t('module_panel.remove')}
            </Button>
            <Button onClick={handleAdd}>
              + {t('module_panel.add_question')}
            </Button>
          </EditButton>
        )}
      </TitleWrapper>

      <CloseButton onClick={handleClose}>
        <X />
      </CloseButton>

      <div>
        <hr />
        <Content>
          {isEditing ? (
            <TextArea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('component.module.edit_placeholder', { ns: 'editor' })}
              rows={20}
            />
          ) : (
            <ReactMarkdown>{question}</ReactMarkdown>
          )}
        </Content>
      </div>

      <PaginationWrapper>
        {currentQuestionIndex !== 0 && (
          <Button
            onClick={() => handlePageChange(currentQuestionIndex - 1)}
            style={{ margin: '0 2px', flex: 0 }}
          >
            <ChevronLeft />
          </Button>
        )}

        <Button style={{ backgroundColor: 'gray', margin: '0 2px', flex: 0 }}>
          {currentQuestionIndex + 1}
        </Button>

        {currentQuestionIndex < totalQuestions - 1 && (
          <Button
            onClick={() => handlePageChange(currentQuestionIndex + 1)}
            style={{ margin: '0 2px', flex: 0 }}
          >
            <ChevronRight />
          </Button>
        )}
      </PaginationWrapper>

      <ResizeHandle onMouseDown={handleMouseDown} />
    </ModuleWindowWrapper>
  )
}

export default ModuleWindow
