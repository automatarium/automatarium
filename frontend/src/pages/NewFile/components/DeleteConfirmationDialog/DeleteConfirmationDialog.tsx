import { useTranslation } from 'react-i18next'
import { Button, Modal } from '/src/components'
import { useEvent } from '/src/hooks'

const DeleteConfirmationDialog = ({ ...props }) => {
  const { t } = useTranslation(['common', 'newfile'])
  useEvent('modal:deleteConfirm', () => props.isOpenReducer(true), [])

  return (
    <Modal
        title={t('component.delete_dialog.title', { ns: 'newfile' })}
        description={t('component.delete_dialog.description', { ns: 'newfile', projectName: props.projectName })}
        isOpen={props.isOpen}
        onClose={props.onClose}
        role='alertdialog'
        actions={<>
          <Button secondary onClick={() => props.isOpenReducer(false)}>{t('cancel', { ns: 'common' })}</Button>
          <Button onClick={props.onConfirm}>{t('delete', { ns: 'common' })}</Button>
        </>}
    />
  )
}

export default DeleteConfirmationDialog
