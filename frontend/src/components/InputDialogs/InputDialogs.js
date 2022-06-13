import { useState, useRef } from 'react'
import { CornerDownLeft } from 'lucide-react'

import { Dropdown, TextInput } from '/src/components'

import { useProjectStore, useViewStore } from '/src/stores'
import { useEvent } from '/src/hooks'
import { locateTransition } from '/src/util/states'
import { lerpPoints } from '/src/util/points'

import { InputWrapper, SubmitButton } from './inputDialogsStyle'

const InputDialogs = () => {
  const [dialog, setDialog] = useState({ visible: false })
  const inputRef = useRef()

  const [editTransitionValue, setEditTransitionValue] = useState('')
  const editTransition = useProjectStore(s => s.editTransition)
  const removeTransitions = useProjectStore(s => s.removeTransitions)
  const commit = useProjectStore(s => s.commit)
  const viewToScreenSpace = useViewStore(s => s.viewToScreenSpace)

  useEvent('editTransition', ({ detail: { id } }) => {
    const { states, transitions } = useProjectStore.getState()?.project ?? {}
    const transition = transitions.find(t => t.id === id)
    setEditTransitionValue(transition?.read ?? '')

    // Find midpoint of transition in screen space
    const pos = locateTransition(transition, states)
    const midPoint = lerpPoints(pos.from, pos.to, .5)
    const screenMidPoint = viewToScreenSpace(midPoint.x, midPoint.y)

    setDialog({
      visible: true,
      x: screenMidPoint[0],
      y: screenMidPoint[1],
      id,
      previousValue: transition?.read,
    })
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [inputRef.current])

  const saveTransition = () => {
    // Remove duplicate characters
    const ranges = editTransitionValue.match(/\[(.*?)\]/g)
    const chars = editTransitionValue.replace(/\[(.*?)\]/g, '')
    editTransition(dialog.id, `${Array.from(new Set(chars)).join('')}${ranges ? ranges.join('') : ''}`)
    commit()
    setDialog({ ...dialog, visible: false })
  }

  return (
    <Dropdown
      visible={dialog.visible}
      onClose={() => {
        setDialog({ ...dialog, visible: false })
        // Delete transitions if not new
        if (dialog.previousValue === undefined) {
          removeTransitions([dialog.id])
        }
      }}
      style={{
        top: `${dialog.y}px`,
        left: `${dialog.x}px`,
      }}
    >
      <InputWrapper>
        <TextInput
          ref={inputRef}
          value={editTransitionValue}
          onChange={e => setEditTransitionValue(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && saveTransition()}
          placeholder="λ"
          style={{ width: 'calc(10ch + 2.5em)', margin: '0 .4em', paddingRight: '2.5em' }}
        />
        <SubmitButton onClick={saveTransition}><CornerDownLeft size="18px" /></SubmitButton>
      </InputWrapper>
    </Dropdown>
  )
}

export default InputDialogs
