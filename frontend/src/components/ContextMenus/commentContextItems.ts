import { TFunction } from 'i18next'
import { TranslatableContextItems } from './contextItem'

const commentContextItems: TranslatableContextItems = (t: TFunction) => {
  return [
    {
      label: t('context_menu.edit_comment', { ns: 'common' }),
      action: 'EDIT_COMMENT'
    },
    'hr',
    {
      label: t('context_menu.delete', { ns: 'common' }),
      shortcut: '⌫',
      action: 'DELETE'
    }
  ]
}

export default commentContextItems
