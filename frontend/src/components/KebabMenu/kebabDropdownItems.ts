import { TFunction } from 'i18next'
import { ContextItems, TranslatableContextItems } from '../ContextMenus/contextItem'


const kebabContextItems: TranslatableContextItems = (t: TFunction) => [
  {
    label: t('rename', {ns: 'common'}),
    action: 'RENAME_PROJECT'
  },
  {
    label: t('copy', {ns: 'common'}),
    action: 'COPY_PROJECT'
  },
  'hr',
  {
    label: t('delete', {ns: 'common'}),
    action: 'DELETE_PROJECT'
  }
]

export default kebabContextItems
