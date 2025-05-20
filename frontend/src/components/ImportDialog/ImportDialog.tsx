import { useEffect, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'

import { useEvent } from '/src/hooks'
import { promptLoadFile, urlLoadFile } from '/src/hooks/useActions'
import { useProjectStore, useProjectsStore } from '/src/stores'

import { ErrorText, ImportButtonWrapper } from './importDialogStyle'
import { Button, Input, Modal, Spinner } from '/src/components'
import { Container } from '/src/pages/Share/shareStyle'
import { encodeData } from '/src/util/encoding'
import { StoredProject } from '/src/stores/useProjectStore'
import { useTranslation } from 'react-i18next'

type ImportDialogProps = {
  // This needs to be passed in from the main page
  navigateFunction: NavigateFunction
}

const ImportDialog = ({ navigateFunction }: ImportDialogProps) => {
  const navigate = navigateFunction
  const setProject = useProjectStore(s => s.set)
  const upsertProject = useProjectsStore(s => s.upsertProject)

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

  useEvent('modal:import', () => {
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

  const onData = (project: StoredProject) => {
    setProject(project)
    upsertProject(project)
  }

  return loading
    ? <Container><Spinner /></Container>
    : <Modal
      title={t('import_project.title')}
      description={t('import_project.description')}
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
            promptLoadFile(
              t,
              onData,
              t('import_project.invalid_file'),
              '.jff,.json,.ao',
              () => {
                resetModal()
                navigate('/editor')
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
      {t('import_project.from_url')}
      <ImportButtonWrapper>
        <Input
          value={urlValue}
          onChange={e => setUrlValue(e.target.value)}
          placeholder={'www.example.com/paste/raw/CoolFSA.ao'}
        />
        <Button
          disabled={loading}
          onClick={() => {
            if (urlValue.length > 0) {
              setLoading(true)
              urlLoadFile(
                urlValue,
                t,
                onData,
                t('import_project.failed_url'),
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
      {urlError ? <ErrorText>{t('import_project.no_url')}</ErrorText> : <></>}
      <hr />
      {t('import_project.from_data')}
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
              ? encodeData(JSON.parse(rawValue))
              : rawValue
            navigate(`/share/raw/${data}`)
          } else {
            setRawError(true)
          }
        }}>{t('load')}</Button>
      </ImportButtonWrapper>
      {rawError ? <ErrorText>{t('import_file.cant_load')}</ErrorText> : <></>}
    </Modal >
}

export default ImportDialog
