import { useState } from 'react'
import { Button, Modal } from '/src/components'
import { useEvent } from '/src/hooks'
import { useTemplatesStore } from '/src/stores'

type EditorConfirmationProps = {
  isOpen: boolean
  setOpen: () => void
  setClose: () => void
}

const TemplateDelConfDialog = ({ isOpen, setOpen, setClose }: EditorConfirmationProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tid, setTid] = useState<string>()
  const deleteTemplate = useTemplatesStore(s => s.deleteTemplate)

  useEvent('modal:editorConfirmation', ({ detail: { title, description, tid } }) => {
    setTitle(title)
    setDescription(description)
    setTid(tid)
    window.setTimeout(() => setOpen(), 50)
  }, [])

  return (
    <Modal
        title={title}
        description={description}
        isOpen={isOpen}
        onClose={setClose}
        role='alertdialog'
        actions={<>
          <Button secondary onClick={setClose}>Cancel</Button>
          <Button onClick={() => {
            deleteTemplate(tid)
            setClose()
          }}>Confirm</Button>
        </>}
    />
  )
}

export default TemplateDelConfDialog
