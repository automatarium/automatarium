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
  const readRef = useRef()
  const writeRef = useRef()
  const directionRef = useRef()
  const [read, setRead] = useState()
  const [write, setWrite] = useState()
  const [direction, setDirection] = useState()
  const editTransition = useProjectStore(s => s.editTransition)
  const removeTransitions = useProjectStore(s => s.removeTransitions)
  const commit = useProjectStore(s => s.commit)
  const viewToScreenSpace = useViewStore(s => s.viewToScreenSpace)
  const screenToViewSpace = useViewStore(s => s.screenToViewSpace)
  const statePrefix = useProjectStore(s => s.project.config.statePrefix)
  const projectType = useProjectStore(s => s.project.config.type)
  const hideDialog = useCallback(() => setDialog({ ...dialog, visible: false }), [dialog])
  const focusInput = useCallback(() => setTimeout(() => readRef.current['read']?.focus(), 100), [readRef.current])
  const arr = [readRef.current, writeRef.current, directionRef.current]


  useEvent('editTransition', ({ detail: { id } }) => {
    const { states, transitions } = useProjectStore.getState()?.project ?? {}
    const transition = transitions.find(t => t.id === id)
    setRead(transition?.read ?? '')
    // Find midpoint of transition in screen space
    const pos = locateTransition(transition, states)
    const midPoint = lerpPoints(pos.from, pos.to, .5)
    const screenMidPoint = viewToScreenSpace(midPoint.x, midPoint.y)
    if (projectType === 'TM') {
      setWrite(transition?.write ?? '')
      setDirection(transition?.direction ?? '')

      setDialog({
        visible: true,
        x: screenMidPoint[0]-100, //Hack. Not Nice.
        y: screenMidPoint[1],
        id,
        previousReadValue: transition?.read,
        previousWriteValue: transition?.write,
        previousDirectionValue: transition?.direction,
        type: 'TMtransition'
      })
    }
    else {
      setDialog({
        visible: true,
        x: screenMidPoint[0],
        y: screenMidPoint[1],
        id,
        previousValue: transition?.read,
        type: 'transition',
      })
    }

    focusInput()
  }, arr)

  const saveTransition = () => {
    // Remove duplicate characters
    const ranges = read.match(/\[(.*?)\]/g)
    const chars = read.replace(/\[(.*?)\]/g, '')
    editTransition(dialog.id, `${Array.from(new Set(chars)).join('')}${ranges ? ranges.join('') : ''}`)
    commit()
    hideDialog()
  }


  useEvent('editComment', ({ detail: { id, x, y } }) => {
    const selectedComment = useProjectStore.getState().project?.comments.find(cm => cm.id === id)
    setRead(selectedComment?.text ?? '')

    setDialog({
      visible: true,
      selectedComment,
      x, y,
      type: 'comment',
    })
    focusInput()
  }, arr)

  const saveComment = () => {
    if (read && !/^\s*$/.test(read)) {
      if (dialog.selectedComment === undefined) {
        const pos = screenToViewSpace(dialog.x, dialog.y)
        useProjectStore.getState().createComment({ x: pos[0], y: pos[1], text: read.trim() })
      } else {
        useProjectStore.getState().updateComment({ ...dialog.selectedComment, text: read.trim() })
      }
      commit()
    }
    hideDialog()
  }

  useEvent('editStateName', ({ detail: { id } }) => {
    const selectedState = useProjectStore.getState().project?.states.find(s => s.id === id)
    setRead(selectedState.name ?? '')
    const pos = viewToScreenSpace(selectedState.x, selectedState.y)

    setDialog({
      visible: true,
      selectedState,
      x: pos[0], y: pos[1],
      type: 'stateName',
    })
    focusInput()
  }, arr)

  const saveStateName = () => {
    useProjectStore.getState().updateState({ ...dialog.selectedState, name: (!read || /^\s*$/.test(read)) ? undefined : read })
    commit()
    hideDialog()
  }

  useEvent('editStateLabel', ({ detail: { id } }) => {
    const selectedState = useProjectStore.getState().project?.states.find(s => s.id === id)
    setRead(selectedState.label ?? '')
    const pos = viewToScreenSpace(selectedState.x, selectedState.y)

    setDialog({
      visible: true,
      selectedState,
      x: pos[0], y: pos[1],
      type: 'stateLabel',
    })
    focusInput()
  }, arr)

  const saveStateLabel = () => {
    useProjectStore.getState().updateState({ ...dialog.selectedState, label: (!read || /^\s*$/.test(read)) ? undefined : read })
    commit()
    hideDialog()
  }

  const saveTMTransition = () => {
    const lowerDirection = direction
    editTransition(dialog.id, read, write, direction)
    commit()
    hideDialog()
  }

  const save = {
    transition: saveTransition,
    TMtransition: saveTMTransition,
    comment: saveComment,
    stateName: saveStateName,
    stateLabel: saveStateLabel,
  }[dialog.type]

  function handleReadIn(e){
    const input = e.target.value.toString()
    setRead(input[input.length-1]?? '')
  }
  function handleWriteIn(e){
    const input = e.target.value.toString()
    setWrite(input[input.length-1]?? '')
  }
  function handleDirectionIn(e){
    const input = e.target.value.toString().match(/(R|r|L|l)/g)
    if (input) {setDirection(input[input.length-1].toUpperCase())}
  }



  if (projectType === 'TM') {
    return (
        <Dropdown
            visible={dialog.visible}
            onClose={() => {
              hideDialog()
              // Delete transitions if not new
              if (dialog.type === 'TMtransition' && dialog.previousValue === undefined) {
                removeTransitions([dialog.id])
              }
            }}
            style={{
              top: `${dialog.y}px`,
              left: `${dialog.x}px`,
              display: 'flex',
              flexDirection: 'row'
            }}
        >
          <InputWrapper>
            <Input
                ref={readRef}
                value={read}
                onChange={handleReadIn}
                onKeyUp={e => e.key === 'Enter' && save}
                placeholder={'λ'}
                style={{
                  width: `8ch`,
                  margin: '0 .4em',
                  paddingRight: '2.5em',
                }}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
                ref={writeRef}
                value={write}
                onChange={handleWriteIn}
                onKeyUp={e => e.key === 'Enter' && save}
                placeholder={'λ'}
                style={{
                  width: `8ch`,
                  margin: '0 .4em',
                  paddingRight: '2.5em',
                }}
            />

          </InputWrapper>
          <InputWrapper>
            {/*{dialog.type === 'comment' && <MessageSquare style={{ marginInline: '1em .6em' }} />}*/}
            <Input
                ref={directionRef}
                value={direction}
                onChange={handleDirectionIn}
                onKeyUp={e => e.key === 'Enter' && save}
                placeholder={'R'}
                style={{
                  width: `8ch`,
                  margin: '0 .4em',
                  paddingRight: '2.5em',
                }}
            />

          </InputWrapper>
          <SubmitButton onClick={save}>
            <CornerDownLeft size="18px" />
          </SubmitButton>
        </Dropdown>
    )
  }

  else {
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
            {dialog.type === 'comment' && <MessageSquare style={{marginInline: '1em .6em'}}/>}
            <Input
                ref={readRef}
                value={read}
                onChange={e => setRead(e.target.value)}
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
              <CornerDownLeft size="18px"/>
            </SubmitButton>
          </InputWrapper>
        </Dropdown>
    )
  }
}

export default InputDialogs
