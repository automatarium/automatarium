import { SectionLabel, Button, Input, Modal } from '/src/components'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'
import { createNewModuleProject, ModuleProject } from 'src/stores/useModuleStore'
import { Wrapper, ButtonContainer, FieldWrapper, DescriptionText } from './modulesStyle'
import { QuestionBlock, QuestionHeader, TextArea } from './moduleWindowStyling'
import { exportModuleFile } from '/src/hooks/useActions'
import { dispatchCustomEvent } from '/src/util/events'
import { Plus, Edit3, Save, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ProjectType } from '../../../../types/ProjectTypes'

const Modules = () => {
  const setModuleProjects = useModuleStore(s => s.setProjects)
  const setModuleDescription = useModuleStore(s => s.setModuleDescription)
  const setModuleName = useModuleStore(s => s.setName)
  const deleteQuestionFromModule = useModuleStore(s => s.deleteQuestion)
  const upsertQuestionToModule = useModuleStore(s => s.upsertQuestion)
  const deleteProjectFromModule = useModuleStore(s => s.deleteProject)
  const updateProjectToModule = useModuleStore(s => s.upsertProject)
  const currentModule = useModuleStore(s => s.module)
  const updateModule = useModulesStore(s => s.upsertModule)
  const setProject = useProjectStore(s => s.set)
  const setAllProjectNames = useModuleStore(s => s.setAllProjectNames)
  const setProjectName = useProjectStore(s => s.setName)
  const { t } = useTranslation('common')

  // Title/description editing
  const [isTitleEditing, setTitleIsEditing] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [titleDescription, setTitleDescription] = useState('')

  // Question editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<{ [id: string]: string }>({})

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Load module values
  useEffect(() => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '')
      setTitleDescription(currentModule.description || '')
      const initialDrafts: { [id: string]: string } = {}
      Object.keys(currentModule.questions).forEach(id => {
        initialDrafts[id] = currentModule.questions[id] || ''
      })
      setDrafts(initialDrafts)
    }
  }, [currentModule])

  const handleEditClick = () => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '')
      setTitleDescription(currentModule.description || '')
    }
    setTitleIsEditing(true)
  }

  const handleEditSaveClick = () => {
    setModuleName(titleInput)
    setModuleDescription(titleDescription)
    setProjectName(titleInput)
    setAllProjectNames(titleInput)
    setTitleIsEditing(false)
    saveModule()
  }

  const handleCancelClick = () => {
    if (currentModule) {
      setTitleInput(currentModule.meta.name || '')
      setTitleDescription(currentModule.description || '')
    }
    setTitleIsEditing(false)
  }

  const saveModule = () => {
    const project = useProjectStore.getState().project
    updateProjectToModule({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
    updateModule(currentModule)
  }

  const handleAddQuestionClick = () => setIsModalOpen(true)

  const { register, handleSubmit } = useForm<{ questionType: ProjectType }>({ 
    defaultValues: { questionType: 'FSA' } 
  })

  const handleAddQuestion = (data) => {
    const newModuleProject = createNewModuleProject(data.questionType, currentModule.meta.name)
    updateProjectToModule(newModuleProject)
    upsertQuestionToModule(newModuleProject._id, '')
    setProject(newModuleProject)
    setIsModalOpen(false)
  }

  const handleSaveQuestion = (id: string) => {
    upsertQuestionToModule(id, drafts[id])
    updateModule(currentModule)
    setEditingId(null)
  }

  const handleCancelQuestion = (id: string) => {
    setDrafts({ ...drafts, [id]: currentModule.questions[id] })
    setEditingId(null)
  }

  const handleDeleteQuestion = (id: string) => {
    deleteQuestionFromModule(id)
    deleteProjectFromModule(id)
    updateModule(currentModule)
  }

  const handleExportModule = () => exportModuleFile()
  const handleCreateModule = () => dispatchCustomEvent('modal:createModule', { project: true })

  return (
    <>
      <SectionLabel>{t('module_panel.current')}</SectionLabel>
      {!currentModule && (
        <Wrapper>
          {t('module_panel.not_working')}
          <Button icon={<Plus />} onClick={handleCreateModule}>
            {t('module_panel.modularise')}
          </Button>
        </Wrapper>
      )}
      {currentModule && (
        <>
          <Wrapper>
            {isTitleEditing ? (
              <>
                <TextArea
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  rows={1}
                  placeholder={t('module_panel.placeholder_title')}
                  maxLength={30}
                />
                <TextArea
                  value={titleDescription}
                  onChange={(e) => setTitleDescription(e.target.value)}
                  rows={4}
                  placeholder={t('module_panel.placeholder_desc')}
                />
                <ButtonContainer>
                  <Button secondary onClick={handleCancelClick}>{t('cancel')}</Button>
                  <Button onClick={handleEditSaveClick}>{t('save')}</Button>
                </ButtonContainer>                                                                              x
              </>
            ) : (
              <>
                <h2>{currentModule?.meta.name || t('create_module.untitled')}</h2>
                <DescriptionText>{currentModule?.description || ''}</DescriptionText>
                <Button onClick={handleEditClick}>{t('menus.edit')}</Button>
              </>
            )}
          </Wrapper>

          <SectionLabel>{t('module_panel.questions')}</SectionLabel>
          <Wrapper>
            {Object.keys(currentModule.questions).map((id, idx) => (
              <QuestionBlock key={id}>
                <QuestionHeader>
                  <strong>{t('module_panel.question_id', { id: idx + 1 })}</strong>
                  <div className="actions" style={{ display: 'flex', gap: '0.5rem' }}>
                    {editingId === id ? (
                      <>
                       <Button
  onClick={() => handleCancelQuestion(id)}
  style={{ backgroundColor: 'gray', color: 'white' }}
>
  {t('cancel')}
</Button>

                        <Button onClick={() => handleSaveQuestion(id)}>
                          <Save size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setEditingId(id)}>
                          <Edit3 size={16} />
                        </Button>
                        <Button onClick={() => handleDeleteQuestion(id)}>
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </QuestionHeader>

                {editingId === id ? (
  <TextArea
    value={drafts[id]}
    autoFocus
    onChange={(e) =>
      setDrafts({ ...drafts, [id]: e.target.value })
    }
    placeholder="Edit module instructions here"
    rows={4}
  />
) : (
  <p
    style={{ color: currentModule.questions[id] ? 'inherit' : 'gray', cursor: 'text' }}
    onClick={() => setEditingId(id)}
  >
    {currentModule.questions[id] || "Edit module instructions here"}
  </p>
)}

              </QuestionBlock>
            ))}
            <Button icon={<Plus />} onClick={handleAddQuestionClick}>
              {t('module_panel.add_question')}
            </Button>
          </Wrapper>

          {/* Add Question Modal */}
          <Modal
            title={t('module_panel.add_question_title')}
            description={t('module_panel.add_question_desc')}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            actions={
              <>
                <Button secondary onClick={() => setIsModalOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit" form="question_type_form">
                  {t('save')}
                </Button>
              </>
            }
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

          <SectionLabel>{t('export')}</SectionLabel>
          <Wrapper>
            <Button onClick={handleExportModule}>
              {t('module_panel.export_automatarium')}
            </Button>
            <Button onClick={() => dispatchCustomEvent('showModuleSharing', null)}>
              {t('module_panel.export_url')}
            </Button>
          </Wrapper>
        </>
      )}
    </>
  )
}

export default Modules
