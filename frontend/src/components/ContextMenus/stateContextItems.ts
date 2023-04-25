import { ContextItems } from './contextItem'

const stateContextItems: ContextItems = [
  {
    label: 'Set as initial',
    action: 'SET_STATE_INITIAL'
  },
  {
    label: 'Toggle is final',
    action: 'TOGGLE_STATES_FINAL'
  },
  'hr',
  {
    label: 'Align Horizontally',
    action: 'ALIGN_STATES_HORIZONTAL'
  },
  {
    label: 'Align Vertically',
    action: 'ALIGN_STATES_VERTICAL'
  },
  'hr',
  {
    label: 'Set label',
    action: 'SET_STATE_LABEL'
  },
  {
    label: 'Change name',
    action: 'SET_STATE_NAME'
  },
  'hr',
  {
    label: 'Copy',
    action: 'COPY'
  },
  {
    label: 'Paste',
    action: 'PASTE'
  },
  'hr',
  {
    label: 'Delete',
    shortcut: '⌫',
    action: 'DELETE'
  }
]

export default stateContextItems
