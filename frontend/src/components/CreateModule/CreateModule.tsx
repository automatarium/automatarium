import { useState } from 'react'
import { useEvent } from '/src/hooks'
import { Button, Modal, Input, TextArea } from '/src/components'
import { useProjectStore, useModuleStore } from '/src/stores'
import { ProjectType } from '/src/types/ProjectTypes'
import { createNewModule, createNewModuleProject, ModuleProject } from 'src/stores/useModuleStore'
import { useNavigate } from 'react-router-dom'
import { ColourName } from '/src/config'
import { useTranslation } from 'react-i18next'
import i18n from '/src/config/i18n'

const CreateModule = () => {
  const navigate = useNavigate()
  const setProject = useProjectStore(s => s.set)
  const setModule = useModuleStore(s => s.setModule)
  const addModuleProject = useModuleStore(s => s.upsertProject)
  const getModuleProject = useModuleStore(s => s.getProject)
  const addQuestion = useModuleStore(s => s.upsertQuestion)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)
  const currentProject = useProjectStore(s => s.project)
  const [isModalOpen, setModalOpen] = useState(false)
  const [newModuleType, setModuleType] = useState<ProjectType>('FSA')
  const [moduleName, setModuleName] = useState('')
  const [moduleDescription, setModuleDescription] = useState('')
  const [project, setProjectforModule] = useState(false)
  const { t } = useTranslation('common')  

  useEvent('modal:createModule', e => {
    setModalOpen(true)
    setModuleType('FSA')
    setModuleName('')
    setModuleDescription('')
    setProjectforModule(e.detail.project)
  })

  const handleNewModuleFile = (project: ModuleProject) => {
    // Create a new module and module project
    const newModule = createNewModule()
    const newModuleProject = project ? JSON.parse(JSON.stringify(project)) : createNewModuleProject(newModuleType, moduleName)

    const pink: ColourName = 'pink'

    newModuleProject._id = crypto.randomUUID()
    newModuleProject.config.color = pink

    if (moduleName === '') {
      newModule.meta.name = i18n.t('create_module.untitled', {ns: 'common'})
      newModuleProject.meta.name = i18n.t('create_module.untitled', {ns: 'common'})
    } else {
      newModule.meta.name = moduleName
      newModuleProject.meta.name = moduleName
    }

    newModule.description = moduleDescription

    // Set the new module and module project
    setModule(newModule)
    addModuleProject(newModuleProject)

    // Add question to module
    addQuestion(newModuleProject._id, '')

    // Set module project for editor
    setProject(getModuleProject(0))

    // Show module window when navigating to editor
    if (showModuleWindow === false) {
      setShowModuleWindow(true)
    }
    setModalOpen(false)
    // Go to the editor
    navigate('/editor')
  }

  return <>
  <Modal
    title={t('create_module.create_new')}
    isOpen={isModalOpen}
    onClose= {() => setModalOpen(false)}
    actions={
      <>
      <Button secondary onClick= {() => setModalOpen(false)}>{t('cancel')}</Button>
      <Button
            onClick={() => {
              if (!project) {
                handleNewModuleFile(null)
              } else {
                handleNewModuleFile(currentProject)
              }
            }}
          > {t('create')} </Button>
      </>
    }
    >
        {!project &&
        <>
          {t('create_module.select_type')}
          <Input type="select" value={newModuleType} onChange={(e) => setModuleType(e.target.value as ProjectType)}>
            <option value='FSA'>{t('create_module.fsa')}</option>
            <option value='PDA'>{t('create_module.pda')}</option>
            <option value='TM'>{t('create_module.tm')}</option>
          </Input>
        </>
        }
        {t('create_module.name')}
        <Input
          type='text'
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          placeholder={t('create_module.name_placeholder')}
        />
        {t('create_module.description')}
        <TextArea
          value={moduleDescription}
          onChange={(e) => setModuleDescription(e.target.value)}
          placeholder={t('create_module.description_placeholder')}
        />
  </Modal>
  </>
}

export default CreateModule
