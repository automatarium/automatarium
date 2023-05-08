import { useState } from 'react'
import { useEvent } from '/src/hooks'
import { Modal, Button } from '/src/components'

const Warning = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [message, setMessage] = useState('')
  useEvent('showWarning', e => setMessage(e.detail))
  return (
    <Modal
      title="Warning"
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
      role="alertdialog" // Prevents closing by clicking away
      actions={
        <Button onClick={() => setIsOpen(false)}>OK</Button>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}