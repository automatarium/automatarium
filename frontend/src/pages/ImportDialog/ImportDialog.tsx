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
      title='Import Project'
      description='Have an existing project?'
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
            promptLoadFile(
              onData,
              'The file format provided is not valid. Please only open Automatarium .json or JFLAP .jff file formats.',
              '.jff,.json',
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
          Browse...
        </Button>
      </ImportButtonWrapper>
      <hr />
      From URL (raw/plaintext)
      <ImportButtonWrapper>
        <Input
          value={urlValue}
          onChange={e => setUrlValue(e.target.value)}
          placeholder={'www.example.com/paste/raw/CoolFSA.json'}
        />
        <Button
          disabled={loading}
          onClick={() => {
            if (urlValue.length > 0) {
              setLoading(true)
              urlLoadFile(
                urlValue,
                onData,
                'Automatarium failed to load a project from provided URL.',
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
        >Import</Button>
      </ImportButtonWrapper>
      {urlError ? <ErrorText>No URL specified!</ErrorText> : <></>}
      <hr />
      From raw data (from the export or your json file)
      <ImportButtonWrapper>
        <Input
          value={rawValue}
          onChange={e => setRawValue(e.target.value)}
          placeholder={'Enter raw data here'}
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
        }}>Load</Button>
      </ImportButtonWrapper>
      {rawError ? <ErrorText>Can't load nothing!</ErrorText> : <></>}
    </Modal >
}

export default ImportDialog
