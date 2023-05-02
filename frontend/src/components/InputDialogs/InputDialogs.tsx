import React, { useState, useRef, useCallback, ChangeEvent, KeyboardEvent } from 'react'
import { CornerDownLeft, MessageSquare } from 'lucide-react'

import { Dropdown, Input } from '/src/components'
import { useProjectStore, useViewStore } from '/src/stores'
import useEvent from '/src/hooks/useEvent'
import { locateTransition } from '/src/util/states'
import { lerpPoints } from '/src/util/points'

import { InputWrapper, SubmitButton } from './inputDialogsStyle'
import {
  assertType,
  AutomataState,
  PDAAutomataTransition,
  ProjectComment, TMAutomataTransition,
  TMDirection
} from '/src/types/ProjectTypes'

/**
 * The default input styling for transition inputs
 */
const TRANSITION_INPUT_STYLE = {
  width: 'calc(12ch + 3.5em)',
  margin: '0 .4em',
  paddingRight: '2.5em'
}

/**
 * All types that a dialog could be
 */
type DialogType = 'TMTransition' | 'PDATransition' | 'FSATransition' | 'comment' | 'stateName' | 'stateLabel' | 'state' | 'none'

/**
 * Represents a dialog modal that is shown on the page
 */
interface BaseDialog {
  visible: boolean
  x: number
  y: number
  id: number
  type: DialogType
}

/**
 * Any dialog that is making a transition
 */
interface TransitionDialog extends BaseDialog {
  type: 'FSATransition' | 'PDATransition' | 'TMTransition'
}

/**
 * Shown when creating a comment
 */
interface CommentDialog extends BaseDialog {
  type: 'comment'
  selectedComment: ProjectComment
}

/**
 * Used for creating and modifying states
 */
interface StateDialog extends BaseDialog {
  type: 'stateName' | 'stateLabel'
  selectedState: AutomataState
}

/** Small alias so I don't need to keep typing it **/
type InputEvent = ChangeEvent<HTMLInputElement>

/**
 * All possible dialogs. This allows for a tagged union using `type` field
 */
type Dialog = TransitionDialog | CommentDialog | StateDialog

const InputDialogs = () => {
  const [dialog, setDialog] = useState<Dialog | undefined>()
  const inputRef = useRef<HTMLInputElement>()
  const inputPopRef = useRef()
  const inputPushRef = useRef()

  const [value, setValue] = useState('')
  const [valuePop, setValuePop] = useState('')
  const [valuePush, setValuePush] = useState('')

  const inputWriteRef = useRef()
  const inputDirectionRef = useRef()
  const [read, setRead] = useState('')
  const [write, setWrite] = useState('')
  const [direction, setDirection] = useState<TMDirection | ''>('R')
  const editTransition = useProjectStore(s => s.editTransition)
  const removeTransitions = useProjectStore(s => s.removeTransitions)
  const commit = useProjectStore(s => s.commit)
  const viewToScreenSpace = useViewStore(s => s.viewToScreenSpace)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const statePrefix = useProjectStore(s => s.project.config.statePrefix)
  const projectType = useProjectStore(s => s.project.config.type)
  const hideDialog = useCallback(() => setDialog({ ...dialog, visible: false }), [dialog])
  const focusInput = useCallback(() => setTimeout(() => inputRef.current?.focus(), 100), [inputRef.current])
  const arr = [inputWriteRef.current, inputDirectionRef.current, inputRef.current]
  useEvent('editTransition', ({ detail: { id } }) => {
    const { states, transitions } = useProjectStore.getState()?.project ?? {}
    const transition = transitions.find(t => t.id === id)
    // Find midpoint of transition in screen space
    const pos = locateTransition(transition, states)
    const midPoint = lerpPoints(pos.from, pos.to, 0.5)
    const screenMidPoint = viewToScreenSpace(midPoint.x, midPoint.y)
    switch (projectType) {
      case 'TM':
        assertType<TMAutomataTransition>(transition)
        setRead(transition?.read ?? '')
        setWrite(transition?.write ?? '')
        setDirection(transition?.direction)
        setDialog({
          visible: true,
          x: screenMidPoint[0] - 100, // Hack. Not Nice.
          y: screenMidPoint[1],
          id,
          type: 'TMTransition'
        })
        break
      case 'PDA':
        assertType<PDAAutomataTransition>(transition)
        setValue(transition?.read ?? '')
        setValuePush(transition?.push ?? '')
        setValuePop(transition?.pop ?? '')
        setDialog({
          visible: true,
          x: screenMidPoint[0],
          y: screenMidPoint[1],
          id,
          type: 'PDATransition'
        })
        break
      case 'FSA':
        setValue(transition?.read ?? '')
        setDialog({
          visible: true,
          x: screenMidPoint[0],
          y: screenMidPoint[1],
          id,
          type: 'FSATransition'
        })
    }

    focusInput()
  }, arr)

  /**
   * Rearranges a read string so that all single characters come before ranges.
   * e.g. [a-b]ad[l-k] becomes ad[a-b][l-k]
   * This is just want it was like before so assuming there is a design reason
   */
  const formatRangeChars = (input: string): string => {
    const ranges = input.match(/\[(.*?)]/g)
    const chars = input.replace(/\[(.*?)]/g, '')
    return `${Array.from(new Set(chars)).join('')}${ranges ? ranges.join('') : ''}`
  }

  const saveTransition = () => {
    editTransition({
      id: dialog.id,
      read: formatRangeChars(value)
    })
    commit()
    hideDialog()
  }

  const saveTMTransition = () => {
    editTransition({ id: dialog.id, read, write, direction: direction || 'R' } as TMAutomataTransition)
    commit()
    hideDialog()
  }

  const savePDATransition = () => {
    editTransition({
      id: dialog.id,
      read: formatRangeChars(value),
      pop: formatRangeChars(valuePop),
      push: formatRangeChars(valuePush)
    } as PDAAutomataTransition)
    commit()
    hideDialog()
  }

  useEvent('editComment', ({ detail: { id, x, y } }) => {
    const selectedComment = useProjectStore.getState().project?.comments.find(cm => cm.id === id)
    setValue(selectedComment?.text ?? '')

    setDialog({
      visible: true,
      selectedComment,
      x,
      y,
      type: 'comment'
    } as CommentDialog)
    focusInput()
  }, [inputRef.current])

  const saveComment = () => {
    if (value && !/^\s*$/.test(value) && dialog.type === 'comment') {
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
      x: pos[0],
      y: pos[1],
      type: 'stateName'
    } as StateDialog)
    focusInput()
  }, [inputRef.current])

  const saveStateName = () => {
    useProjectStore.getState().updateState({
      ...(dialog as StateDialog).selectedState,
      name: (!value || /^\s*$/.test(value)) ? undefined : value
    })
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
      x: pos[0],
      y: pos[1],
      type: 'stateLabel'
    } as StateDialog)
    focusInput()
  }, [inputRef.current])

  const saveStateLabel = () => {
    useProjectStore.getState().updateState({
      ...(dialog as StateDialog).selectedState,
      label: (!value || /^\s*$/.test(value)) ? undefined : value
    })
    commit()
    hideDialog()
  }

  const save = ({
    FSATransition: saveTransition,
    TMTransition: saveTMTransition,
    PDATransition: savePDATransition,
    comment: saveComment,
    stateName: saveStateName,
    stateLabel: saveStateLabel
  } as Record<DialogType, () => void>)[dialog?.type]

  const handleReadIn = (e: InputEvent) => {
    const input = e.target.value.toString()
    setRead(input[input.length - 1] ?? '')
  }

  const handleWriteIn = (e: InputEvent) => {
    const input = e.target.value.toString()
    setWrite(input[input.length - 1] ?? '')
  }

  const handleDirectionIn = (e: InputEvent) => {
    // ^$ is regex for empty string, essentially allowing user to backspace input on top of
    // the 'r', 'l', and 's' characters
    const input = e.target.value.toString().match(/[rls]|^$/gi)
    const value = input[input.length - 1].toUpperCase()
    setDirection(value as TMDirection)
  }

  if (!dialog) return null

  /**
   * Common properties of the parent dropdown
   */
  const DROPDOWN_PROPS = {
    visible: dialog.visible,
    onClose: () => {
      hideDialog()
      if (['FSATransition', 'PDATransition', 'TMTransition'].includes(dialog.type)) {
        removeTransitions([dialog.id])
      }
    },
    style: {
      top: `${dialog.y}px`,
      left: `${dialog.x}px`
    }
  }

  /**
   * Calls `save` if the enter key is hit
   * @param e
   */
  const handleSave = (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && save()

  // Show the dialog depending on the type created
  switch (dialog.type) {
    case 'FSATransition':
      return (
        <Dropdown {...DROPDOWN_PROPS}>
          <InputWrapper>
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={handleSave}
              placeholder={'λ'}
              style={TRANSITION_INPUT_STYLE}
            />
            <SubmitButton onClick={save}>
              <CornerDownLeft size="18px" />
            </SubmitButton>
          </InputWrapper>
        </Dropdown>
      )
    case 'PDATransition':
      return (
        <Dropdown {...DROPDOWN_PROPS}>
          <InputWrapper>
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={handleSave}
              placeholder={'λ\t(read)'}
              style={TRANSITION_INPUT_STYLE}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputPopRef}
              value={valuePop}
              onChange={e => setValuePop(e.target.value)}
              onKeyUp={handleSave}
              placeholder={'λ\t(pop)'}
              style={TRANSITION_INPUT_STYLE}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputPushRef}
              value={valuePush}
              onChange={e => setValuePush(e.target.value)}
              onKeyUp={handleSave}
              placeholder={'λ\t(push)'}
              style={TRANSITION_INPUT_STYLE}
            />
            <SubmitButton onClick={save}>
              <CornerDownLeft size="18px" />
            </SubmitButton>
          </InputWrapper>
        </Dropdown>
      )
    case 'TMTransition':
      return (
        <Dropdown {...DROPDOWN_PROPS}>
          <InputWrapper>
            <Input
              ref={inputRef}
              value={read}
              onChange={handleReadIn}
              onKeyUp={handleSave}
              placeholder={'λ\t(read)'}
              style={TRANSITION_INPUT_STYLE}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputWriteRef}
              value={write}
              onChange={handleWriteIn}
              onKeyUp={handleSave}
              placeholder={'λ\t(write)'}
              style={TRANSITION_INPUT_STYLE}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputDirectionRef}
              value={direction}
              onChange={handleDirectionIn}
              onKeyUp={handleSave}
              placeholder={'↔\t(direction)'}
              style={TRANSITION_INPUT_STYLE}
            />
            <SubmitButton onClick={save}>
              <CornerDownLeft size="18px" />
            </SubmitButton>
          </InputWrapper>
        </Dropdown>
      )
    case 'comment':
    case 'stateName':
    case 'stateLabel':
      // Both comment and state altering modals are basically the same so we can stick
      // them in the same branch
      return (
        <Dropdown {...DROPDOWN_PROPS}>
         <InputWrapper>
            {dialog.type === 'comment' && <MessageSquare style={{ marginInline: '1em .6em' }}/>}
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={handleSave}
              placeholder={{
                stateName: `${statePrefix ?? 'q'}${(dialog as StateDialog).selectedState?.id ?? '0'}`,
                stateLabel: 'State label...',
                comment: 'Comment text...'
              }[dialog.type]}
              style={{
                width: 'calc(20ch + 3.5em)',
                margin: '0 .4em',
                paddingRight: '2.5em'
              }}
            />
            <SubmitButton onClick={save}>
              <CornerDownLeft size="18px" />
            </SubmitButton>
          </InputWrapper>
        </Dropdown>
      )
    default:
      return null
  }
}

export default InputDialogs
