import { useState } from 'react'
import { useEvent } from '/src/hooks'
import { Modal, Button } from '/src/components'

export const Warning = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  useEvent('showWarning', e => {
    setMessage(e.detail)
    setIsOpen(true)
  })
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
      description={message}
    >
    </Modal>
  )
}
