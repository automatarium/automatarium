import { useState } from 'react'
import { Button, Modal } from '/src/components'
import { useEvent } from '/src/hooks'
import { useTemplatesStore, useThumbnailStore } from '/src/stores'

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
  const removeThumbnail = useThumbnailStore(s => s.removeThumbnail)

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
            removeThumbnail(`tmp${tid}-light`)
            removeThumbnail(`tmp${tid}-dark`)
            setClose()
          }}>Confirm</Button>
        </>}
    />
  )
}

export default TemplateDelConfDialog
