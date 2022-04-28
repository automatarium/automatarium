import { useEffect, useCallback, useState } from 'react'

import { Dropdown, TextInput } from '/src/components'

import { useProjectStore } from '/src/stores'

const InputDialogs = () => {
  const [dialog, setDialog] = useState({ visible: false })

  const [editTransitionValue, setEditTransitionValue] = useState('')
  const project = useProjectStore(s => s.project)
  const transitions = project?.transitions ?? []
  const editTransition = useProjectStore(s => s.editTransition)
  const onEditTransition = useCallback(({ detail: { id } }) => {
    setEditTransitionValue(transitions.find(t => t.id === id) ?? '')

    setDialog({ visible: true, x:200, y:200, content:
      <TextInput
        value={editTransitionValue}
        onChange={e => setEditTransitionValue(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'enter') {
            // Edit transition
            editTransition(id, editTransitionValue)
            setDialog({ ...dialog, visible: false })
          }
        }}
        style={{ width: '5em', textAlign: 'center', margin: '0 .4em' }}
      />
    })
  }, [])

  useEffect(() => {
    document.addEventListener('editTransition', onEditTransition)
    return () => {
      document.removeEventListener('editTransition', onEditTransition)
    }
  }, [])

  return (
    <Dropdown
      visible={dialog.visible}
      onClose={() => setDialog({ ...dialog, visible: false })}
      style={{
        top: `${dialog.y}px`,
        left: `${dialog.x}px`,
      }}
    >{dialog.content}</Dropdown>
  )
}

export default InputDialogs
