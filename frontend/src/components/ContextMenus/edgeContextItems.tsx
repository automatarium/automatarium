import { TFunction } from 'i18next'
import { TranslatableContextItems } from './contextItem'

const edgeContextItems: TranslatableContextItems = (t: TFunction) => {
  return [
    {
      label: t('context_menu.edit_transitions_group', { ns: 'common' }),
      action: 'EDIT_TRANSITIONS_GROUP'
    },
    {
      label: t('context_menu.flip_edge', { ns: 'common' }),
      action: 'FLIP_EDGE'
    },
    'hr',
    {
      label: t('context_menu.edit_first_transition', { ns: 'common' }),
      action: 'EDIT_FIRST'
    },
    'hr',
    {
      label: t('context_menu.delete_edge', { ns: 'common' }),
      action: 'DELETE_EDGE'
    }
  ]
}

export default edgeContextItems
