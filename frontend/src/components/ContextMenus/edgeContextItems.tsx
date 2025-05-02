import { ContextItems } from './contextItem'

import i18n from '/src/config/i18n'

const edgeContextItems: ContextItems = [
  {
    label: i18n.t('context_menu.edit_transitions_group', {ns: 'common'}),
    action: 'EDIT_TRANSITIONS_GROUP'
  },
  {
    label: i18n.t('context_menu.flip_edge', {ns: 'common'}),
    action: 'FLIP_EDGE'
  },
  'hr',
  {
    label: i18n.t('context_menu.edit_first_transition', {ns: 'common'}),
    action: 'EDIT_FIRST'
  },
  'hr',
  {
    label: i18n.t('context_menu.delete_edge', {ns: 'common'}),
    action: 'DELETE_EDGE'
  }
]

export default edgeContextItems
