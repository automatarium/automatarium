import { ContextItems } from './contextItem'

import i18n from '/src/config/i18n'

const transitionContextItems: ContextItems = [
  {
    label: i18n.t('context_menu.edit_transition', {ns: 'common'}),
    action: 'EDIT_TRANSITION'
  },
  {
    label: i18n.t('context_menu.flip_selected_transitions', {ns: 'common'}),
    action: 'FLIP_TRANSITION'
  },
  'hr',
  {
    label: i18n.t('context_menu.delete', {ns: 'common'}),
    shortcut: '⌫',
    action: 'DELETE'
  }
]

export default transitionContextItems
