import { ContextItems } from './contextItem'

const edgeContextItems: ContextItems = [
  {
    label: 'Edit transitions group',
    action: 'EDIT_TRANSITIONS_GROUP'
  },
  {
    label: 'Flip edge',
    action: 'FLIP_EDGE'
  },
  'hr',
  {
    label: 'Edit first transition',
    action: 'EDIT_FIRST'
  },
  'hr',
  {
    label: 'Delete edge',
    action: 'DELETE_EDGE'
  }
]

export default edgeContextItems
