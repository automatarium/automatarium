import { useState, useRef, useCallback, ChangeEvent, KeyboardEvent } from 'react'
import { CornerDownLeft, MessageSquare } from 'lucide-react'

import { Dropdown, Input } from '/src/components'
import { useProjectStore, useViewStore } from '/src/stores'
import useEvent from '/src/hooks/useEvent'
import { locateTransition } from '/src/util/states'
import { lerpPoints } from '/src/util/points'
import { formatInput, formatOutput } from '/src/util/stringManipulations'
import { DirectionRadioButtons } from '/src/components/Button/DirectionRadioButtons'

import {
  InputWrapper,
  SubmitButton,
  TMSubmitButton,
  TransitionInputStyle,
  TMInputStyle,
  RadioWrapper
} from './inputDialogsStyle'

import {
  assertType,
  AutomataState,
  PDAAutomataTransition,
  ProjectComment, TMAutomataTransition,
  TMDirection
} from '/src/types/ProjectTypes'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('common')

  const [value, setValue] = useState('')
  const [valuePop, setValuePop] = useState('')
  const [valuePush, setValuePush] = useState('')

  const inputWriteRef = useRef()
  const inputDirectionRef = useRef()
  const [write, setWrite] = useState('')
  const [direction, setDirection] = useState<TMDirection>('R')
  const editTransition = useProjectStore(s => s.editTransition)
  const removeTransitions = useProjectStore(s => s.removeTransitions)
  const commit = useProjectStore(s => s.commit)
  const viewToScreenSpace = useViewStore(s => s.viewToScreenSpace)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const statePrefix = useProjectStore(s => s.project.config.statePrefix)
  const projectType = useProjectStore(s => s.project.config.type)
  const orOperator = useProjectStore(s => s.project.config.orOperator) ?? '|'
  const hideDialog = useCallback(() => setDialog({ ...dialog, visible: false }), [dialog])
  const focusInput = useCallback(() => setTimeout(() => inputRef.current?.focus(), 100), [inputRef.current])
  const [isNew, setIsNew] = useState(true)
  const arr = [inputWriteRef.current, inputDirectionRef.current, inputRef.current]

  useEvent('editTransition', ({ detail: { id, new: isNewTransition } }) => {
    const { states, transitions } = useProjectStore.getState()?.project ?? {}
    const transition = transitions.find(t => t.id === id)
    // Find midpoint of transition in screen space
    const pos = locateTransition(transition, states)
    const midPoint = lerpPoints(pos.from, pos.to, 0.5)
    const screenMidPoint = viewToScreenSpace(midPoint.x, midPoint.y)
    setIsNew(isNewTransition ?? true) // Default a.k.a. previous functionality assumes new
    switch (projectType) {
      case 'TM':
        assertType<TMAutomataTransition>(transition)
        setValue(formatOutput(transition?.read, orOperator) ?? '')
        setWrite(transition?.write ?? '')
        setDirection(transition?.direction ?? 'R')
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
        setValue(formatOutput(transition?.read, orOperator) ?? '')
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
        setValue(formatOutput(transition?.read, orOperator) ?? '')
        setDialog({
          visible: true,
          x: screenMidPoint[0],
          y: screenMidPoint[1],
          id,
          type: 'FSATransition'
        })
    }

    focusInput()
  }, [arr, orOperator])

  const saveTransition = () => {
    editTransition({
      id: dialog.id,
      read: formatInput(value, orOperator)
    })
    commit()
    hideDialog()
  }

  const saveTMTransition = () => {
    editTransition({
      id: dialog.id,
      read: formatInput(value, orOperator),
      write,
      direction: direction || 'R'
    } as TMAutomataTransition)
    commit()
    hideDialog()
  }

  const savePDATransition = () => {
    editTransition({
      id: dialog.id,
      read: formatInput(value, orOperator),
      pop: valuePop,
      push: valuePush
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

  const handleWriteIn = (e: InputEvent) => {
    const input = e.target.value.toString()
    setWrite(input[input.length - 1] ?? '')
  }

  if (!dialog) return null

  /**
   * Common properties of the parent dropdown
   */
  const DROPDOWN_PROPS = {
    visible: dialog.visible,
    onClose: () => {
      hideDialog()
      if (isNew && ['FSATransition', 'PDATransition', 'TMTransition'].includes(dialog.type)) {
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
              style={TransitionInputStyle}
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
              placeholder={t('input_dialog.read')}
              style={TransitionInputStyle}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputPopRef}
              value={valuePop}
              onChange={e => setValuePop(e.target.value)}
              onKeyUp={handleSave}
              placeholder={t('input_dialog.pop')}
              style={TransitionInputStyle}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputPushRef}
              value={valuePush}
              onChange={e => setValuePush(e.target.value)}
              onKeyUp={handleSave}
              placeholder={t('input_dialog.push')}
              style={TransitionInputStyle}
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
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyUp={handleSave}
              placeholder={t('input_dialog.read')}
              style={TMInputStyle}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputWriteRef}
              value={write}
              onChange={handleWriteIn}
              onKeyUp={handleSave}
              placeholder={t('input_dialog.write')}
              style={TMInputStyle}
            />
          </InputWrapper>
          <InputWrapper>
            <RadioWrapper>
              <DirectionRadioButtons
                direction={direction}
                setDirection={setDirection}
                handleSave={handleSave}
                name={`transition-${dialog.id}`}
              />
            </RadioWrapper>
            <TMSubmitButton onClick={save}>
              <CornerDownLeft size="18px" />
            </TMSubmitButton>
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
                stateLabel: t('input_dialog.state_label'),
                comment: t('input_dialog.comment_text')
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
