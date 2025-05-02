import { ContextItems } from './contextItem'

import i18n from '/src/config/i18n'

const commentContextItems: ContextItems = [
  {
    label: i18n.t('context_menu.edit_comment', {ns: 'common'}),
    action: 'EDIT_COMMENT'
  },
  'hr',
  {
    label: i18n.t('context_menu.delete', {ns: 'common'}),
    shortcut: '⌫',
    action: 'DELETE'
  }
]

export default commentContextItems
