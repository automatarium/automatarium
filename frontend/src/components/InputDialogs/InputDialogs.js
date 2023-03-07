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

  const readRef = useRef()
  const writeRef = useRef()
  const directionRef = useRef()
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
  const arr = [readRef.current, writeRef.current, directionRef.current, inputRef.current]


  useEvent('editTransition', ({ detail: { id } }) => {
    const { states, transitions } = useProjectStore.getState()?.project ?? {}
    const transition = transitions.find(t => t.id === id)
    setRead(transition?.read ?? '')
    setValue(transition?.read ?? '')
    setValuePop(transition?.pop ?? '')
    setValuePush(transition?.push ?? '')

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
    const ranges = value.match(/\[(.*?)\]/g)
    const chars = value.replace(/\[(.*?)\]/g, '')
    const rangesPop = valuePop.match(/\[(.*?)\]/g)
    const charsPop = valuePop.replace(/\[(.*?)\]/g, '')
    const rangesPush = valuePush.match(/\[(.*?)\]/g)
    const charsPush = valuePush.replace(/\[(.*?)\]/g, '')
    editTransition({id: dialog.id,
      read: `${Array.from(new Set(chars)).join('')}${ranges ? ranges.join('') : ''}`,
      pop: `${Array.from(new Set(charsPop)).join('')}${rangesPop ? rangesPop.join('') : ''}`,
      push: `${Array.from(new Set(charsPush)).join('')}${rangesPush ? rangesPush.join('') : ''}`
    })
    commit()
    hideDialog()
  }


  const saveTMTransition = () => {
    editTransition({id: dialog.id, read: read, write: write, direction: direction})
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
    if ((e.target.value.toString() === "") || e.target.value.toString() === " ") {setDirection("S")}
    else {
      const input = e.target.value.toString().match(/(R|r|L|l|S|s)/g)
      if (input) {
        setDirection(input[input.length - 1].toUpperCase())
      }
    }
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
                placeholder={'↔'}
                style={{
                  width: `8ch`,
                  margin: '0 .4em',
                  paddingRight: '2.5em',
                }}
            />

          </InputWrapper>
          <SubmitButton onClick={save} disabled={!direction}>
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
                ref={inputRef}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyUp={e => e.key === 'Enter' && save()}
                placeholder={{
                  transition: (projectType === 'PDA') ? 'λ\t(read)' : 'λ',
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
            {!projectType === 'PDA' &&
            <SubmitButton onClick={save}>
              <CornerDownLeft size="18px"/>
            </SubmitButton>}
          </InputWrapper>
          { /* Additional input #1 - PDA pop value */}
          {projectType === 'PDA' &&
          <InputWrapper>
            <Input
                ref={inputPopRef}
                value={valuePop}
                onChange={e => setValuePop(e.target.value)}
                onKeyUp={e => e.key === 'Enter' && save()}
                placeholder={{
                  transition: 'λ\t(pop)',
                }[dialog.type]}
                style={{
                  width: `calc(${dialog.type === 'comment' ? '20ch' : '12ch'} + 2.5em)`,
                  margin: '0 .4em',
                  paddingRight: '2.5em',
                }}
            />
          </InputWrapper>}
          { /* Additional input #2 - PDA push value */}
          {projectType === 'PDA' &&
          <InputWrapper>
            <Input
                ref={inputPushRef}
                value={valuePush}
                onChange={e => setValuePush(e.target.value)}
                onKeyUp={e => e.key === 'Enter' && save()}
                placeholder={{
                  transition: 'λ\t(push)',
                }[dialog.type]}
                style={{
                  width: `calc(${dialog.type === 'comment' ? '20ch' : '12ch'} + 2.5em)`,
                  margin: '0 .4em',
                  paddingRight: '2.5em',
                }}
            />
            {/* {console.log("valueRead is: ", value)}
          {console.log("valuePop is: ", valuePop)}
          {console.log("valuePush is: ", valuePush)} */}
            <SubmitButton onClick={save}>
              <CornerDownLeft size="18px"/>
            </SubmitButton>
          </InputWrapper>}
        </Dropdown>
    )
  }
}

export default InputDialogs
