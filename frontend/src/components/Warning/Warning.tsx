import { useState } from 'react'
import { Modal, Button } from '/src/components'

const Warning = (message: string) => {
  const [isOpen, setIsOpen] = useState(true)
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

export default Warning
