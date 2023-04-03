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
  const inputPopRef = useRef()
  const inputPushRef = useRef()

  const [value, setValue] = useState('')
  const [valuePop, setValuePop] = useState('')
  const [valuePush, setValuePush] = useState('')

  const inputWriteRef = useRef()
  const inputDirectionRef = useRef()
  const [read, setRead] = useState('')
  const [write, setWrite] = useState('')
  const [direction, setDirection] = useState('')
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
    setRead(transition?.read ?? '')
    setValue(transition?.read ?? '')
    setValuePop(transition?.pop ?? '')
    setValuePush(transition?.push ?? '')

    // Find midpoint of transition in screen space
    const pos = locateTransition(transition, states)
    const midPoint = lerpPoints(pos.from, pos.to, 0.5)
    const screenMidPoint = viewToScreenSpace(midPoint.x, midPoint.y)
    if (projectType === 'TM') {
      setWrite(transition?.write ?? '')
      setDirection(transition?.direction ?? '')

      setDialog({
        visible: true,
        x: screenMidPoint[0] - 100, // Hack. Not Nice.
        y: screenMidPoint[1],
        id,
        previousReadValue: transition?.read,
        previousWriteValue: transition?.write,
        previousDirectionValue: transition?.direction,
        type: 'TMtransition'
      })
    } else {
      setDialog({
        visible: true,
        x: screenMidPoint[0],
        y: screenMidPoint[1],
        id,
        previousValue: transition?.read,
        type: 'transition'
      })
    }

    focusInput()
  }, arr)

  const saveTransition = () => {
    // Remove duplicate characters
    const ranges = value.match(/\[(.*?)\]/g)
    const chars = value.replace(/\[(.*?)\]/g, '')
    const rangesPop = valuePop.match(/\[(.*?)\]/g)
    const charsPop = valuePop.replace(/\[(.*?)\]/g, '')
    const rangesPush = valuePush.match(/\[(.*?)\]/g)
    const charsPush = valuePush.replace(/\[(.*?)\]/g, '')
    editTransition({
      id: dialog.id,
      read: `${Array.from(new Set(chars)).join('')}${ranges ? ranges.join('') : ''}`,
      pop: `${Array.from(new Set(charsPop)).join('')}${rangesPop ? rangesPop.join('') : ''}`,
      push: `${Array.from(new Set(charsPush)).join('')}${rangesPush ? rangesPush.join('') : ''}`
    })
    commit()
    hideDialog()
  }

  const saveTMTransition = () => {
    editTransition({ id: dialog.id, read, write, direction })
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
      x: pos[0],
      y: pos[1],
      type: 'stateName'
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
      x: pos[0],
      y: pos[1],
      type: 'stateLabel'
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
    TMtransition: saveTMTransition,
    comment: saveComment,
    stateName: saveStateName,
    stateLabel: saveStateLabel
  }[dialog.type]

  function handleReadIn (e) {
    const input = e.target.value.toString()
    setRead(input[input.length - 1] ?? '')
  }

  function handleWriteIn (e) {
    const input = e.target.value.toString()
    setWrite(input[input.length - 1] ?? '')
  }

  function handleDirectionIn (e) {
    const input = e.target.value.toString().match(/[rls]/gi)
    const value = input[input.length - 1].toUpperCase()
    setDirection(value)
  }

  const isTM = projectType === 'TM'
  const isPDA = projectType === 'PDA'
  // If the project type if a TM, then do the following
  if (isTM) {
    // Determine whether dialog type is TMtransition, comment, or state, and act accordingly.
    // If it is none of these just return null.
    if (dialog.type === 'TMtransition') {
      return (
        <Dropdown
          visible={dialog.visible}
          onClose={() => {
            hideDialog()
            if (dialog.previousValue === undefined) {
              removeTransitions([dialog.id])
            }
          }}
          style={{
            top: `${dialog.y}px`,
            left: `${dialog.x}px`
          }}
        >
          <InputWrapper>
            <Input
              ref={inputRef}
              value={read}
              onChange={e => handleReadIn(e)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'λ\t(read)'}
              style={{
                width: 'calc(12ch + 3.5em)',
                margin: '0 .4em',
                paddingRight: '2.5em'
              }}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputWriteRef}
              value={write}
              onChange={handleWriteIn}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'λ\t(write)'}
              style={{
                width: 'calc(12ch + 3.5em)',
                margin: '0 .4em',
                paddingRight: '2.5em'
              }}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputDirectionRef}
              value={direction}
              onChange={handleDirectionIn}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'↔\t(direction)'}
              style={{
                width: 'calc(12ch + 3.5em)',
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
    } else if (dialog.type === 'comment') {
      return (
        <Dropdown
          visible={dialog.visible}
          onClose={() => {
            hideDialog()
          }}
          style={{
            top: `${dialog.y}px`,
            left: `${dialog.x}px`
          }}
        >
          <InputWrapper>
            <MessageSquare style={{ marginInline: '1em .6em' }} />
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'Comment text...'}
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
    } else if (dialog.type === 'state') {
      return (
        <Dropdown
          visible={dialog.visible}
          onClose={() => {
            hideDialog()
          }}
          style={{
            top: `${dialog.y}px`,
            left: `${dialog.x}px`
          }}
        >
          <InputWrapper>
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={{
                stateName: `${statePrefix ?? 'q'}${dialog.selectedState?.id ?? '0'}`,
                stateLabel: 'State label...'
              }[dialog.placeholderType]}
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
    } else {
      return null
    }
    // Else if the project type is a PDA, do the following
  } else if (isPDA) {
    // Determine whether dialog type is transition, comment, or state, and act accordingly.
    // If it is none of these just return null.
    if (dialog.type === 'transition') {
      return (
        <Dropdown
          visible={dialog.visible}
          onClose={() => {
            hideDialog()
            if (dialog.previousValue === undefined) {
              removeTransitions([dialog.id])
            }
          }}
          style={{
            top: `${dialog.y}px`,
            left: `${dialog.x}px`
          }}
        >
          <InputWrapper>
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'λ\t(read)'}
              style={{
                width: 'calc(12ch + 3.5em)',
                margin: '0 .4em',
                paddingRight: '2.5em'
              }}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputPopRef}
              value={valuePop}
              onChange={e => setValuePop(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'λ\t(pop)'}
              style={{
                width: 'calc(12ch + 3.5em)',
                margin: '0 .4em',
                paddingRight: '2.5em'
              }}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              ref={inputPushRef}
              value={valuePush}
              onChange={e => setValuePush(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'λ\t(push)'}
              style={{
                width: 'calc(12ch + 3.5em)',
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
    } else if (dialog.type === 'comment') {
      return (
        <Dropdown
          visible={dialog.visible}
          onClose={() => {
            hideDialog()
          }}
          style={{
            top: `${dialog.y}px`,
            left: `${dialog.x}px`
          }}
        >
          <InputWrapper>
            <MessageSquare style={{ marginInline: '1em .6em' }} />
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'Comment text...'}
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
    } else if (dialog.type === 'state') {
      return (
        <Dropdown
          visible={dialog.visible}
          onClose={() => {
            hideDialog()
          }}
          style={{
            top: `${dialog.y}px`,
            left: `${dialog.x}px`
          }}
        >
          <InputWrapper>
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={{
                stateName: `${statePrefix ?? 'q'}${dialog.selectedState?.id ?? '0'}`,
                stateLabel: 'State label...'
              }[dialog.placeholderType]}
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
    } else {
      return null
    }
    // Else we assume the project type is a FSA, if we're adding more automaton then we will have to make more if statements, one for each automaton to define the logic and formatting of transitions and comments.
  } else {
    if (dialog.type === 'transition') {
      return (
        <Dropdown
          visible={dialog.visible}
          onClose={() => {
            hideDialog()
            if (dialog.previousValue === undefined) {
              removeTransitions([dialog.id])
            }
          }}
          style={{
            top: `${dialog.y}px`,
            left: `${dialog.x}px`
          }}
        >
          <InputWrapper>
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'λ'}
              style={{
                width: 'calc(12ch + 3.5em)',
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
    } else if (dialog.type === 'comment') {
      return (
        <Dropdown
          visible={dialog.visible}
          onClose={() => {
            hideDialog()
          }}
          style={{
            top: `${dialog.y}px`,
            left: `${dialog.x}px`
          }}
        >
          <InputWrapper>
            <MessageSquare style={{ marginInline: '1em .6em' }} />
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={'Comment text...'}
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
    } else if (dialog.type === 'state') {
      return (
        <Dropdown
          visible={dialog.visible}
          onClose={() => {
            hideDialog()
          }}
          style={{
            top: `${dialog.y}px`,
            left: `${dialog.x}px`
          }}
        >
          <InputWrapper>
            <Input
              ref={inputRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyUp={e => e.key === 'Enter' && save()}
              placeholder={{
                stateName: `${statePrefix ?? 'q'}${dialog.selectedState?.id ?? '0'}`,
                stateLabel: 'State label...'
              }[dialog.placeholderType]}
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
    } else {
      return null
    }
  }
}

export default InputDialogs
