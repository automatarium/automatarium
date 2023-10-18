import { ContextItems } from './contextItem'

const transitionContextItems: ContextItems = [
  {
    label: 'Edit transition',
    action: 'EDIT_TRANSITION'
  },
  {
    label: 'Flip selected transitions',
    action: 'FLIP_TRANSITION'
  },
  'hr',
  {
    label: 'Delete',
    shortcut: '⌫',
    action: 'DELETE'
  }
]

export default transitionContextItems
