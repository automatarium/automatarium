import { useEffect, useCallback, useState, useRef } from 'react'

import { Dropdown, TextInput } from '/src/components'

import { useProjectStore } from '/src/stores'

const InputDialogs = () => {
  const [dialog, setDialog] = useState({ visible: false })
  const inputRef = useRef()

  const [editTransitionValue, setEditTransitionValue] = useState('')
  const project = useProjectStore(s => s.project)
  const transitions = project?.transitions ?? []
  const editTransition = useProjectStore(s => s.editTransition)
  const removeTransitions = useProjectStore(s => s.removeTransitions)

  const onEditTransition = useCallback(({ detail: { id } }) => {
    setEditTransitionValue(transitions.find(t => t.id === id) ?? '')

    setDialog({ visible: true, x:200, y:200, id })
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [transitions, inputRef.current])

  useEffect(() => {
    document.addEventListener('editTransition', onEditTransition)
    return () => document.removeEventListener('editTransition', onEditTransition)
  }, [])

  return (
    <Dropdown
      visible={dialog.visible}
      onClose={() => {
        setDialog({ ...dialog, visible: false })
        // Delete transitions if not new
        removeTransitions([dialog.id])
        //TODO: cancel edit if not new
      }}
      style={{
        top: `${dialog.y}px`,
        left: `${dialog.x}px`,
      }}
    >
      <TextInput
        ref={inputRef}
        value={editTransitionValue}
        onChange={e => setEditTransitionValue(e.target.value)}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            // Edit transition
            editTransition(dialog.id, editTransitionValue)
            setDialog({ ...dialog, visible: false })
          }
        }}
        style={{ width: '5em', textAlign: 'center', margin: '0 .4em' }}
      />
    </Dropdown>
  )
}

export default InputDialogs
