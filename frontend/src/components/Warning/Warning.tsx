import { useState } from 'react'
import { useEvent } from '/src/hooks'
import { Modal, Button } from '/src/components'
import { dispatchCustomEvent } from '/src/util/events'

// This is the warning modal that will use the prebuilt modal defined in 'Modal' to display
// a warning under certain circumstances (such as incorrect input, or anything else that could be
// considered as an invalid action by the user)
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

// This function is intended to dispatch a custom event 'showWarning' to essentially approve of
// the warning modal, allowing it to be shown
export function showWarning (msg: string) {
  dispatchCustomEvent('showWarning', msg)
}
