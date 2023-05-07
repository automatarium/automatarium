import { ContextItems } from './contextItem'

const commentContextItems: ContextItems = [
  {
    label: 'Edit comment',
    action: 'EDIT_COMMENT'
  },
  'hr',
  {
    label: 'Delete',
    shortcut: '⌫',
    action: 'DELETE'
  }
]

export default commentContextItems
