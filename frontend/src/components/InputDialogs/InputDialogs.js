import { useState, useRef, useCallback } from 'react'
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
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const statePrefix = useProjectStore(s => s.project.config.statePrefix)

  const hideDialog = useCallback(() => setDialog({ ...dialog, visible: false }), [dialog])
  const focusInput = useCallback(() => setTimeout(() => inputRef.current?.focus(), 100), [inputRef.current])

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
    focusInput()
  }, [inputRef.current])

  const saveTransition = () => {
    // Remove duplicate characters
    const ranges = value.match(/\[(.*?)\]/g)
    const chars = value.replace(/\[(.*?)\]/g, '')
    editTransition(dialog.id, `${Array.from(new Set(chars)).join('')}${ranges ? ranges.join('') : ''}`)
    commit()
    hideDialog()
  }

  useEvent('editComment', ({ detail: { id, x, y } }) => {
    const selectedComment = useProjectStore.getState().project?.comments.find(cm => cm.id === id)
    setValue(selectedComment?.text ?? '')

    setDialog({
      visible: true,
      selectedComment,
      x, y,
      type: 'comment',
    })
    focusInput()
  }, [inputRef.current])

  const saveComment = () => {
    if (value && !/^\s*$/.test(value)) {
      if (dialog.selectedComment === undefined) {
        const pos = screenToViewSpace(dialog.x, dialog.y)
        useProjectStore.getState().createComment({ x: pos[0], y: pos[1], text: value.trim() })
      } else {
        useProjectStore.getState().updateComment({ ...dialog.selectedComment, text: value.trim() })
      }
      commit()
    }
    hideDialog()
  }

  useEvent('editStateName', ({ detail: { id } }) => {
    const selectedState = useProjectStore.getState().project?.states.find(s => s.id === id)
    setValue(selectedState.name ?? '')
    const pos = viewToScreenSpace(selectedState.x, selectedState.y)

    setDialog({
      visible: true,
      selectedState,
      x: pos[0], y: pos[1],
      type: 'stateName',
    })
    focusInput()
  }, [inputRef.current])

  const saveStateName = () => {
    useProjectStore.getState().updateState({ ...dialog.selectedState, name: (!value || /^\s*$/.test(value)) ? undefined : value })
    commit()
    hideDialog()
  }

  useEvent('editStateLabel', ({ detail: { id } }) => {
    const selectedState = useProjectStore.getState().project?.states.find(s => s.id === id)
    setValue(selectedState.label ?? '')
    const pos = viewToScreenSpace(selectedState.x, selectedState.y)

    setDialog({
      visible: true,
      selectedState,
      x: pos[0], y: pos[1],
      type: 'stateLabel',
    })
    focusInput()
  }, [inputRef.current])

  const saveStateLabel = () => {
    useProjectStore.getState().updateState({ ...dialog.selectedState, label: (!value || /^\s*$/.test(value)) ? undefined : value })
    commit()
    hideDialog()
  }

  const save = {
    transition: saveTransition,
    comment: saveComment,
    stateName: saveStateName,
    stateLabel: saveStateLabel,
  }[dialog.type]

  return (
    <Dropdown
      visible={dialog.visible}
      onClose={() => {
        hideDialog()
        // Delete transitions if not new
        if (dialog.type === 'transition' && dialog.previousValue === undefined) {
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
            stateName: `${statePrefix ?? 'q'}${dialog.selectedState?.id ?? '0'}`,
            stateLabel: 'State label...',
          }[dialog.type]}
          style={{
            width: `calc(${dialog.type === 'comment' ? '20ch' : '12ch'} + 2.5em)`,
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
