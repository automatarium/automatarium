import { ContextItems } from '../ContextMenus/contextItem'

const kebabContextItems: ContextItems = [
  {
    label: 'Rename',
    action: 'RENAME_PROJECT'
  },
  {
    label: 'Copy',
    action: 'COPY_PROJECT'
  },
  'hr',
  {
    label: 'Delete',
    action: 'DELETE_PROJECT'
  }
]

export default kebabContextItems
