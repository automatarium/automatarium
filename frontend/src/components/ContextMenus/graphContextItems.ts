import { ContextItems } from './contextItem'

import i18n from '/src/config/i18n'

const graphContextItems: ContextItems = [
  {
    label: i18n.t('context_menu.add_comment', {ns: 'common'}),
    action: 'CREATE_COMMENT'
  },
  'hr',
  {
    label: i18n.t('context_menu.create_state', {ns: 'common'}),
    action: 'CREATE_STATE'
  },
  'hr',
  {
    label: i18n.t('context_menu.select_all', {ns: 'common'}),
    action: 'SELECT_ALL'
  },
  {
    label: i18n.t('context_menu.paste', {ns: 'common'}),
    action: 'PASTE'
  }
]

export default graphContextItems
