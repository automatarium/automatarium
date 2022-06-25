import { useState, useRef } from 'react'
import { CornerDownLeft, MessageSquare } from 'lucide-react'

import { Dropdown, Input } from '/src/components'

import { useProjectStore, useViewStore } from '/src/stores'
import { useEvent } from '/src/hooks'
import { locateTransition } from '/src/util/states'
import { lerpPoints } from '/src/util/points'

import { InputWrapper, SubmitButton } from './inputDialogsStyle'

const InputDialogs = () => {
  const [dialog, setDialog] = useState({ visible: false })
  const inputRef = useRef()

  const [value, setValue] = useState('')
  const editTransition = useProjectStore(s => s.editTransition)
  const removeTransitions = useProjectStore(s => s.removeTransitions)
  const commit = useProjectStore(s => s.commit)
  const viewToScreenSpace = useViewStore(s => s.viewToScreenSpace)

  useEvent('editTransition', ({ detail: { id } }) => {
    const { states, transitions } = useProjectStore.getState()?.project ?? {}
    const transition = transitions.find(t => t.id === id)
    setValue(transition?.read ?? '')

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
      type: 'transition',
    })
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [inputRef.current])

  const saveTransition = () => {
    // Remove duplicate characters
    const ranges = value.match(/\[(.*?)\]/g)
    const chars = value.replace(/\[(.*?)\]/g, '')
    editTransition(dialog.id, `${Array.from(new Set(chars)).join('')}${ranges ? ranges.join('') : ''}`)
    commit()
    setDialog({ ...dialog, visible: false })
  }

  useEvent('editComment', ({ detail: { id, x, y } }) => {
    const selectedComment = useProjectStore.getState().project?.comments.find(cm => cm.id === id)
    setValue(selectedComment?.text ?? '')

    setDialog({
      visible: true,
      selectedComment,
      x, y,
      previousValue: selectedComment?.text,
      type: 'comment',
    })
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [inputRef.current])

  const saveComment = () => {
    if (value && !/^\s*$/.test(value)) {
      if (dialog.selectedComment === undefined) {
        useProjectStore.getState().createComment({ x: dialog.x, y: dialog.y, text: value.trim() })
      } else {
        useProjectStore.getState().updateComment({ ...dialog.selectedComment, text: value.trim() })
      }
      commit()
    }
    setDialog({ ...dialog, visible: false })
  }

  const save = {
    transition: saveTransition,
    comment: saveComment,
  }[dialog.type]

  return (
    <Dropdown
      visible={dialog.visible}
      onClose={() => {
        setDialog({ ...dialog, visible: false })
        // Delete transitions if not new
        if (dialog.previousValue === undefined && dialog.type === 'transition') {
          removeTransitions([dialog.id])
        }
      }}
      style={{
        top: `${dialog.y}px`,
        left: `${dialog.x}px`,
      }}
    >
      <InputWrapper>
        {dialog.type === 'comment' && <MessageSquare style={{ marginInline: '1em .6em' }} />}
        <Input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyUp={e => e.key === 'Enter' && save()}
          placeholder={{
            transition: 'λ',
            comment: 'Comment text...',
          }[dialog.type]}
          style={{
            width: `calc(${{
                transition: '10ch',
                comment: '20ch',
              }[dialog.type]} + 2.5em)`,
            margin: '0 .4em',
            paddingRight: '2.5em',
          }}
        />
        <SubmitButton onClick={save}>
          <CornerDownLeft size="18px" />
        </SubmitButton>
      </InputWrapper>
    </Dropdown>
  )
}

export default InputDialogs
