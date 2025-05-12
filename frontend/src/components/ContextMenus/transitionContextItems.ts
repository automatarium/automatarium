import { TFunction } from 'i18next'
import { TranslatableContextItems } from './contextItem'

const transitionContextItems: TranslatableContextItems = (t: TFunction) => {
  return [
    {
      label: t('context_menu.edit_transition', { ns: 'common' }),
      action: 'EDIT_TRANSITION'
    },
    {
      label: t('context_menu.flip_selected_transitions', { ns: 'common' }),
      action: 'FLIP_TRANSITION'
    },
    'hr',
    {
      label: t('delete', { ns: 'common' }),
      shortcut: '⌫',
      action: 'DELETE'
    }
  ]
}

export default transitionContextItems
