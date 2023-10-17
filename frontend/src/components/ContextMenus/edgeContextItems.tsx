import { ContextItems } from './contextItem'

const edgeContextItems: ContextItems = [
  {
    label: 'Edit transitions group',
    action: 'EDIT_TRANSITIONS_GROUP'
  },
  'hr',
  {
    label: 'Delete edge',
    shortcut: '⌫',
    action: 'DELETE_EDGE'
  }
]

export default edgeContextItems
