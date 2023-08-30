import { useState } from 'react'
import { NavigateFunction } from 'react-router-dom'
import Button from '../Button/Button'
import Input from '../Input/Input'
import Modal from '../Modal/Modal'
import Spinner from '../Spinner/Spinner'
import { useEvent } from '/src/hooks'
import { promptLoadFile, urlLoadFile } from '/src/hooks/useActions'
import { useProjectStore } from '/src/stores'

type ImportDialogProps = {
  // This needs to be passed in from the main page
  navigateFunction: NavigateFunction
}

const ImportDialog = ({ navigateFunction }: ImportDialogProps) => {
  const navigate = navigateFunction
  const setProject = useProjectStore(s => s.set)

  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [urlValue, setUrlValue] = useState('')
  const [rawValue, setRawValue] = useState('')

  useEvent('modal:import', () => {
    setModalOpen(true)
    setLoading(false)
  })

  const resetModal = () => {
    setUrlValue('')
    setRawValue('')
    setLoading(false)
    setModalOpen(false)
  }

  return loading
    ? <Spinner />
    : <Modal
        title='Import Project'
        description='Import an existing project.'
        isOpen={modalOpen}
        onClose={resetModal}
        actions={<Button secondary onClick={resetModal}>Close</Button>}
      >
        From your computer
        <Button
          onClick={() => {
            setLoading(true)
            promptLoadFile(
              setProject,
              'The file format provided is not valid. Please only open Automatarium .json or JFLAP .jff file formats.',
              '.jff,.json',
              () => {
                resetModal()
                navigate('/editor')
              })
          }}
        >
          Browse...
        </Button>
        <hr/>
        From URL (raw/plaintext)
        <Input
          value={urlValue}
          onChange={e => setUrlValue(e.target.value)}
          placeholder={'https://www.example.com/paste/raw/myMachine.json'}
        />
        <Button
          onClick={() => {
            setLoading(true)
            urlLoadFile(
              urlValue,
              setProject,
              'Automatarium failed to load a project from provided URL.',
              () => {
                resetModal()
                navigate('/editor')
              }
            )
          }}
        >Import</Button>
        <hr/>
        From raw data
        <Input
          value={rawValue}
          onChange={e => setRawValue(e.target.value)}
          placeholder={'Enter raw .json file here'}
        />
        <Button>Load</Button>
      </Modal>
}

export default ImportDialog
