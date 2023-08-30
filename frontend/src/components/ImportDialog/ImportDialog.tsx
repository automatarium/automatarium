import { useState } from 'react'
import Button from '../Button/Button'
import Input from '../Input/Input'
import Modal from '../Modal/Modal'
import { useEvent } from '/src/hooks'

const ImportDialog = () => {
  const [modalOpen, setModalOpen] = useState(false)

  useEvent('modal:import', () => {
    setModalOpen(true)
    console.log('import modal opened')
  })

  return <Modal
    title='Import Project'
    description='Import an existing project.'
    isOpen={modalOpen}
    onClose={() => {
      setModalOpen(false)
    }}
    actions={<Button onClick={() => {
      setModalOpen(false)
    }}>Close</Button>}
  >
    From file
    <Button>Browse...</Button>
    <hr/>
    From URL
    <Input/>
    <Button>Import</Button>
  </Modal>
}

export default ImportDialog
