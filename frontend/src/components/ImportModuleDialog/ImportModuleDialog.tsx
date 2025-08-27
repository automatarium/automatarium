import { useEffect, useState } from 'react'
import { useEvent } from '/src/hooks'
import { NavigateFunction } from 'react-router-dom'

import { promptLoadModuleFile, urlLoadModuleFile } from '/src/hooks/useActions'
import { useModuleStore, useModulesStore, useProjectStore } from '/src/stores'

import { ErrorText, ImportButtonWrapper } from './importModuleDialogStyle'
import { Button, Input, Modal, Spinner } from '/src/components'
import { Container } from '/src/pages/Share/shareStyle'
import { StoredModule } from '/src/stores/useModuleStore'
import { encodeModule } from '/src/util/encoding'
import { useTranslation } from 'react-i18next'

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

  const { t } = useTranslation('common')

  useEffect(() => {
    const timeout = setTimeout(() => setRawError(false), 3000)
    return () => clearTimeout(timeout)
  }, [rawError])

  useEffect(() => {
    const timeout = setTimeout(() => setUrlError(false), 3000)
    return () => clearTimeout(timeout)
  }, [urlError])

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
      title={t('import_module.title')}
      description={t('import_module.description')}
      isOpen={modalOpen}
      onClose={resetModal}
      actions={<Button secondary onClick={resetModal}>{t('close')}</Button>}
  >
    <ImportButtonWrapper>
      {t('import_project.from_computer')}
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true)
          promptLoadModuleFile(
            t,
            onData,
            t('import_module.invalid_file'),
            '.json',
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
        {t('import_project.browse')}
      </Button>
    </ImportButtonWrapper>
    <hr />
      {t('import_module.from_url')}
      <ImportButtonWrapper>
        <Input
          value={urlValue}
          onChange={e => setUrlValue(e.target.value)}
          placeholder={'www.example.com/paste/module/CoolFSA.json'}
        />
        <Button
          disabled={loading}
          onClick={() => {
            if (urlValue.length > 0) {
              setLoading(true)
              urlLoadModuleFile(
                urlValue,
                t,
                onData,
                t('import_module.failed_url'),
                () => {
                  resetModal()
                  navigate('/editor')
                },
                () => {
                  setLoading(false)
                }
              )
            } else {
              setUrlError(true)
            }
          }}
        >{t('import')}</Button>
      </ImportButtonWrapper>
      {urlError && <ErrorText>{t('import_project.no_url')}</ErrorText>}
      <hr />
      {t('import_module.from_data')}
      <ImportButtonWrapper>
        <Input
          value={rawValue}
          onChange={e => setRawValue(e.target.value)}
          placeholder={t('import_project.enter_data')}
        />
        <Button disabled={loading} onClick={() => {
          if (rawValue.length > 0) {
            const data = rawValue[0] === '{'
              // This is a json file. It might not fit on the URL
              ? encodeModule(JSON.parse(rawValue))
              : rawValue
            navigate(`/share/module/${data}`)
          } else {
            setRawError(true)
          }
        }}>{t('load')}</Button>
      </ImportButtonWrapper>
      {rawError && <ErrorText>{t('import_project.cant_load')}</ErrorText>}
  </Modal>
}

export default ImportModuleDialog
