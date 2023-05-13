import { ContextItems } from './contextItem'

const graphContextItems: ContextItems = [
  {
    label: 'Add comment',
    action: 'CREATE_COMMENT'
  },
  'hr',
  {
    label: 'Create state here',
    action: 'CREATE_STATE'
  },
  {
    label: 'Reorder graph',
    action: 'REORDER_GRAPH'
  },
  'hr',
  {
    label: 'Select all',
    action: 'SELECT_ALL'
  },
  {
    label: 'Paste',
    action: 'PASTE'
  }
]

export default graphContextItems
