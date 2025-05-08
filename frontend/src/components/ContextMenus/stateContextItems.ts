import { TFunction } from 'i18next'
import { TranslatableContextItems } from './contextItem'

const stateContextItems: TranslatableContextItems = (t: TFunction) => {
  return [
    {
      label: t('context_menu.set_initial', { ns: 'common' }),
      action: 'SET_STATE_INITIAL'
    },
    {
      label: t('context_menu.toggle_final', { ns: 'common' }),
      action: 'TOGGLE_STATES_FINAL'
    },
    'hr',
    {
      label: t('context_menu.align_horizontally', { ns: 'common' }),
      action: 'ALIGN_STATES_HORIZONTAL'
    },
    {
      label: t('context_menu.align_vertically', { ns: 'common' }),
      action: 'ALIGN_STATES_VERTICAL'
    },
    'hr',
    {
      label: t('context_menu.set_label', { ns: 'common' }),
      action: 'SET_STATE_LABEL'
    },
    {
      label: t('context_menu.change_name', { ns: 'common' }),
      action: 'SET_STATE_NAME'
    },
    'hr',
    {
      label: t('context_menu.copy', { ns: 'common' }),
      action: 'COPY'
    },
    {
      label: t('context_menu.paste', { ns: 'common' }),
      action: 'PASTE'
    },
    'hr',
    {
      label: t('context_menu.delete', { ns: 'common' }),
      shortcut: '⌫',
      action: 'DELETE'
    }
  ]
}

export default stateContextItems
