import { useEffect, useState } from 'react'
import { useEvent } from '/src/hooks'
import { NavigateFunction } from 'react-router-dom'

import { promptLoadModuleFile } from '/src/hooks/useActions'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'

import { ErrorText, ImportButtonWrapper } from './importModuleDialogStyle'
import { Button, Input, Modal, Spinner } from '/src/components'
import { Container } from '/src/pages/Share/shareStyle'
import { StoredModule } from '/src/stores/useModuleStore'


type ImportDialogProps = {
    // This needs to be passed in from the main page
    navigateFunction: NavigateFunction
  }

const ImportModuleDialog = ({ navigateFunction }: ImportDialogProps) => {
  const navigate = navigateFunction
  const setProject = useProjectStore(s => s.set)
  const setModule = useModuleStore(s => s.setModule)
  const getModuleProject = useModuleStore(s => s.getProject)
  const upsertModule = useModulesStore(s => s.upsertModule)
  const showModuleWindow = useModuleStore(s => s.showModuleWindow)
  const setShowModuleWindow = useModuleStore(s => s.setShowModuleWindow)

  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [urlValue, setUrlValue] = useState('')
  const [rawValue, setRawValue] = useState('')

  const [rawError, setRawError] = useState(false)
  const [urlError, setUrlError] = useState(false)


  useEvent('modal:importModule', () => {
      setModalOpen(true)
      setLoading(false)
      setRawError(false)
      setUrlError(false)
  })

  const resetModal = () => {
      setUrlValue('')
      setRawValue('')
      setLoading(false)
      setModalOpen(false)
      setRawError(false)
      setUrlError(false)
    }

  const onData = (module: StoredModule) => {
    setModule(module)
    upsertModule(module)
  }

  const loadModule = () => {
    setProject(getModuleProject(0))
    if (showModuleWindow === false) {
      setShowModuleWindow(true)
    }
    navigate('/editor')
  }

  return loading
  ? <Container><Spinner /></Container>
  : <Modal
      title='Import Module'
      description='Have an existing module?'
      isOpen={modalOpen}
      onClose={resetModal}
      actions={<Button secondary onClick={resetModal}>Close</Button>}
  >
    <ImportButtonWrapper>
      From your computer
      <Button
        disabled={loading}
        onClick={() => {
            setLoading(true)
            promptLoadModuleFile(
            onData,
            'The file format provided is not valid. Please only open Automatarium .aom',
            '.aom',
            () => {
                resetModal()
                loadModule()
            },
            () => {
                setLoading(false)
            }
            )
        }}
      >
        Browse...
      </Button>
    </ImportButtonWrapper>
  </Modal>
}

export default ImportModuleDialog