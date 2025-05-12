import { TFunction } from 'i18next'
import { TranslatableContextItems } from './contextItem'

const graphContextItems: TranslatableContextItems = (t: TFunction) => {
  return [
    {
      label: t('context_menu.add_comment', { ns: 'common' }),
      action: 'CREATE_COMMENT'
    },
    'hr',
    {
      label: t('context_menu.create_state', { ns: 'common' }),
      action: 'CREATE_STATE'
    },
    'hr',
    {
      label: t('context_menu.select_all', { ns: 'common' }),
      action: 'SELECT_ALL'
    },
    {
      label: t('paste', { ns: 'common' }),
      action: 'PASTE'
    }
  ]
}

export default graphContextItems
