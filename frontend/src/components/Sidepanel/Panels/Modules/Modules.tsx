import { SectionLabel, Preference, Switch, Button, Input, Modal } from '/src/components'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'
import { createNewModuleProject, ModuleProject } from 'src/stores/useModuleStore'
import { Wrapper, RemoveButton, EditButton, TextArea, Table, TitleSection, ButtonContainer, FieldWrapper, DescriptionText } from './modulesStyle'
import { exportModuleFile } from '/src/hooks/useActions'
import { dispatchCustomEvent } from '/src/util/events'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
// Import enum from ProjectTypes
import type { ProjectType } from '../../../../types/ProjectTypes'

const Modules = () => {
  const setModuleProjects = useModuleStore(s => s.setProjects)
  const setModuleDescription = useModuleStore(s => s.setModuleDescription)
  const setModuleName = useModuleStore(s => s.setName)
  const deleteQuestionFromModule = useModuleStore(s => s.deleteQuestion)
  const addQuestionToModule = useModuleStore(s => s.upsertQuestion)
  const deleteProjectFromModule = useModuleStore(s => s.deleteProject)
  const updateProjectToModule = useModuleStore(s => s.upsertProject)
  const currentModule = useModuleStore(s => s.module)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)
  const updateModule = useModulesStore(s => s.upsertModule)
  const setProject = useProjectStore(s => s.set)
  const currentProject = useProjectStore(s => s.project)
  const setAllProjectNames = useModuleStore(s => s.setAllProjectNames)
  const setProjectName = useProjectStore(s => s.setName)
  const { t } = useTranslation('common')

  // Current assessment description and title
  const [isTitleEditing, setTitleIsEditing] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [titleDescription, setTitleDescription] = useState('')

  // Modal-related state management
  const [isModalOpen, setIsModalOpen] = useState(false) // Controls modal visibility

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ModuleProject | null>(null)

  // Load module values into local state when module changes
  useEffect(() => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '') // Populate title input
      setTitleDescription(currentModule.description || '') // Populate description input
    }
  }, [currentModule])

  // Open edit mode and reset the input fields
  const handleEditClick = () => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '') // Reset title input
      setTitleDescription(currentModule.description || '') // Reset description input
    }
    setTitleIsEditing(true) // Enable edit mode
  }

  // Save the new title and description to the store
  const handleEditSaveClick = () => {
    setModuleName(titleInput)
    setModuleDescription(titleDescription)
    setProjectName(titleInput) // Save title to current project
    setAllProjectNames(titleInput) // Save title to all projects stored in module
    setTitleIsEditing(false) // Exit edit mode after saving
    saveModule()
  }

  // Cancel editing and reset the input fields to the stored values
  const handleCancelClick = () => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '') // Reset title input
      setTitleDescription(currentModule.description || '') // Reset description input
    }
    setTitleIsEditing(false) // Exit edit mode without saving
  }

  // Save changes to module
  const saveModule = () => {
    const project = useProjectStore.getState().project
    updateProjectToModule({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
    updateModule(currentModule)
  }

  // Function to open the modal
  const handleAddQuestionClick = () => {
    setIsModalOpen(true)
  }

  // Form handling using react-hook-form
  const { register, handleSubmit } = useForm<{ questionType: ProjectType }>({ 
      defaultValues: { questionType: 'FSA' } 
  })
  const handleAddQuestion = (data) => {
    const newModuleProject = createNewModuleProject(data.questionType, currentModule.meta.name)
    updateProjectToModule(newModuleProject) // Save new project with selected type
    addQuestionToModule(newModuleProject._id, '') // Add new question
    setProject(newModuleProject) // Set the project for editing
    setIsModalOpen(false) // Close the modal
  }

  const handleEditQuestion = (_project: ModuleProject) => {
    // Save current changes before moving to another question
    saveModule()
    // Set the project for the editor
    setProject(_project)
    // Open module window
    if (showModuleWindow === false) {
      setShowModuleWindow(true)
    }
  }

  const handleOpenQuestion = (_project: ModuleProject) => {
    // Save current changes before moving to another question
    saveModule()
    // Set the project for the editor
    setProject(_project)
  }

  // Show delete confirmation modal
  const handleDeleteQuestion = (_project: ModuleProject) => {
    setProjectToDelete(_project)
    setIsDeleteModalOpen(true)
  }

  // Perform actual deletion after confirmation
  const confirmDeleteQuestion = () => {
    if (!projectToDelete) return

    // Delete project from current module
    deleteProjectFromModule(projectToDelete._id)
    // Delete question from current module
    deleteQuestionFromModule(projectToDelete._id)

    if (projectToDelete._id === currentProject._id && currentModule) {
      const remainingProjects = currentModule.projects.filter((proj) => proj._id !== projectToDelete._id)

      setProject(remainingProjects[0]) // Set the first remaining project as the current project
    }

    // Close the modal and reset projectToDelete
    setIsDeleteModalOpen(false)
    setProjectToDelete(null)
  }

  // Drag and drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null) // Track the index of the dragged item

  const handleDragStart = (index: number) => {
    setDraggedIndex(index) // Store the index of the dragged question
  }

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return // Avoid rearranging if the index hasn't changed

    const updatedProjects = [...currentModule.projects] // Clone projects array
    const [movedProject] = updatedProjects.splice(draggedIndex, 1) // Remove dragged project
    updatedProjects.splice(dropIndex, 0, movedProject) // Insert it at the drop location

    setModuleProjects(updatedProjects) // Update the project order
    setDraggedIndex(null) // Reset dragged index
  }

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault() // Allow drop by preventing the default behavior
  }

  // Export
  const handleExportModule = () => {
    exportModuleFile()
  }

  const handleCreateModule = () => {
    dispatchCustomEvent('modal:createModule', { project: true })
  }

  return (
    <>
      <SectionLabel>{t('module_panel.current')}</SectionLabel>
      {!currentModule && <>
        <Wrapper>{t('module_panel.not_working')}
        <Button icon={<Plus/>} onClick={handleCreateModule}>{t('module_panel.modularise')}</Button>
        </Wrapper>
      </>}
      {currentModule && <>
        <Wrapper>
        {isTitleEditing
          ? (
            <>
              <TitleSection>
                <TextArea
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  rows={1}
                  placeholder={t('module_panel.placeholder_title')}
                  maxLength={30} // character limit on input field
                />
              </TitleSection>
              <TextArea
                value={titleDescription}
                onChange={(e) => setTitleDescription(e.target.value)}
                rows={4}
                placeholder={t('module_panel.placeholder_desc')}
              />
              <ButtonContainer>
                <Button onClick={handleCancelClick}>{t('cancel')}</Button>
                <Button onClick={handleEditSaveClick}>{t('save')}</Button>
              </ButtonContainer>
            </>
            )
          : (
            <>
              <TitleSection>
                <h2>{currentModule?.meta.name || t('create_module.untitled')}</h2> {/* Display current lab title */}
              </TitleSection>
              <DescriptionText>{currentModule?.description || ''}</DescriptionText> {/* Display current lab description */}
              <Button onClick={handleEditClick}>{t('menus.edit')}</Button> {/* Toggle edit mode */}
            </>
            )}

        </Wrapper>

        <SectionLabel>{t('module_panel.settings')}</SectionLabel>
        <Wrapper>
          <Preference label={t('module_panel.open_questions')}>
            <Switch type="checkbox" checked={showModuleWindow} onChange={() => setShowModuleWindow(!showModuleWindow)} />
          </Preference>
        </Wrapper>
        <>
          <SectionLabel>{t('module_panel.questions')}</SectionLabel>
          <Wrapper>
            <Table>
              <thead>
                <tr>
                  <th>{t('module_panel.question')}</th>
                  <th>{t('module_panel.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentModule.projects.map((q, index) => (
                  <tr
                    key={q._id}
                    style={{
                      backgroundColor: currentProject && currentProject._id === q._id ? 'var(--toolbar)' : 'transparent' // Highlight if it's the current project
                    }}
                    draggable={currentProject && currentProject._id === q._id}
                    onDragStart={() => handleDragStart(index)}
                    onDrop={() => handleDrop(index)}
                    onDragOver={handleDragOver}
                  >
                    <td onClick={() => handleOpenQuestion(q)}>{t('module_panel.question_id', { id: index + 1 })}</td>
                    <td>
                      <EditButton onClick={() => handleEditQuestion(q)}>{t('menus.edit')}</EditButton>

                      <RemoveButton
                        onClick={() => handleDeleteQuestion(q)}
                        disabled={currentModule.projects.length <= 1}
                      >
                        {t('module_panel.remove')}
                      </RemoveButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button icon={<Plus/>} onClick={handleAddQuestionClick}>{t('module_panel.add_question')}</Button>
          </Wrapper>

          {/* Question Type Modal */}
          <Modal
            title={t('module_panel.add_question_title')}
            description={t('module_panel.add_question_desc')}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            actions={
              <>
                <Button secondary onClick={() => setIsModalOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" form="question_type_form">{t('save')}</Button>
              </>
            }
            style={{ paddingInline: 0 }}
          >
            <form id="question_type_form" onSubmit={handleSubmit(handleAddQuestion)}>
              <SectionLabel>{t('module_panel.question_type')}</SectionLabel>
              <FieldWrapper>
                <span>{t('module_panel.select_type')}</span>
                <Input type="select" small {...register('questionType')}>
                  <option value="FSA">{t('fsa_short')}</option>
                  <option value="PDA">{t('pda_short')}</option>
                  <option value="TM">{t('tm_short')}</option>
                </Input>
              </FieldWrapper>
            </form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            title={t('module_panel.delete_question_title')}
            description={t('module_panel.delete_question_desc')}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false)
              setProjectToDelete(null)
            }}
            actions={
              <>
                <Button
                  secondary
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setProjectToDelete(null)
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button onClick={confirmDeleteQuestion}>{t('delete')}</Button>
              </>
            }
          />
        </>
        <SectionLabel>{t('export')}</SectionLabel>
        <Wrapper>
          <Button onClick={handleExportModule}>{t('module_panel.export_automatarium')}</Button>
          <Button onClick={() => dispatchCustomEvent('showModuleSharing', null)}>{t('module_panel.export_url')}</Button>
        </Wrapper>
      </>
      }
    </>
  )
}

export default Modules
