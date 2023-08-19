import { Button, Modal } from '/src/components'
import { useEvent } from '/src/hooks'

const DeleteConfirmationDialog = ({ ...props }) => {
  useEvent('modal:deleteConfirm', () => props.isOpenReducer(true), [])

  return (
    <Modal
        title='Delete Project?'
        description={'This will permanently remove your project ' + props.projectName + ' from your computer.'}
        isOpen={props.isOpen}
        onClose={props.onClose}
        role='alertdialog'
        actions={<>
          <Button secondary onClick={() => props.isOpenReducer(false)}>Cancel</Button>
          <Button onClick={props.onConfirm}>Delete</Button>
        </>}
    />
  )
}

export default DeleteConfirmationDialog
