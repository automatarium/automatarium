import { CornerDownLeft, X } from 'lucide-react'
import {
  ChangeEvent,
  KeyboardEvent,
  Ref,
  RefObject,
  createRef,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  InputSeparator,
  InputSpacingWrapper,
  Heading
} from './inputTransitionGroupStyle'
import Button from '/src/components/Button/Button'
import { DirectionRadioButtons } from '../Button/DirectionRadioButtons'
import Input from '/src/components/Input/Input'
import {
  InputWrapper,
  SubmitButton,
  TMSubmitButton
} from '/src/components/InputDialogs/inputDialogsStyle'
import Modal from '/src/components/Modal/Modal'
import { useEvent } from '/src/hooks'
import { useProjectStore } from '/src/stores'
import {
  BaseAutomataTransition,
  FSAAutomataTransition,
  PDAAutomataTransition,
  TMAutomataTransition,
  TMDirection,
  assertType
} from '/src/types/ProjectTypes'
import { splitCharsWithOr, formatInput } from '/src/util/orOperators'

const InputTransitionGroup = () => {
  const inputRef = useRef<HTMLInputElement>()
  const [transitionListRef, setTransitionListRef] =
    useState<Array<Ref<HTMLInputElement>>>()
  // selectIndex === -1 is the new transition field, others is the index
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const [fromState, setFromState] = useState<number>()
  const [toState, setToState] = useState<number>()
  const [transitionsList, setTransitionsList] = useState<
    Array<BaseAutomataTransition> | undefined
  >()

  const [fromName, setFromName] = useState<string>()
  const [toName, setToName] = useState<string>()

  const [modalOpen, setModalOpen] = useState(false)

  const [idList, setIdList] = useState([])

  // For the new transition
  const [readValue, setReadValue] = useState('')
  const [popValue, setPopValue] = useState('')
  const [pushValue, setPushValue] = useState('')
  const [writeValue, setWriteValue] = useState('')
  const [dirValue, setDirValue] = useState('R')

  const statePrefix = useProjectStore((s) => s.project.config.statePrefix)
  const projectType = useProjectStore((s) => s.project.config.type)
  const orOperator = useProjectStore((s) => s.project.config.orOperator)

  const editTransition = useProjectStore((s) => s.editTransition)
  const createTransition = useProjectStore((s) => s.createTransition)
  const removeTransitions = useProjectStore((s) => s.removeTransitions)
  const commit = useProjectStore((s) => s.commit)
  // Get data from event dispatch
  useEvent(
    'editTransitionGroup',
    ({ detail: { ids } }) => {
      // Get transitions from store
      const { transitions, states } = useProjectStore.getState()?.project ?? {}
      // Do preliminary store updates
      setIdList([...ids])
      const transitionsScope = transitions.filter((t) => ids.includes(t.id))
      // Somehow you can select nothing sometimes. This prevents a crash
      if (transitionsScope.length === 0) return null
      // All of these should be part of the same transition edge
      const f = transitionsScope[0].from
      const t = transitionsScope[0].to
      const fName = states.find((s) => s.id === f).name ?? '' + statePrefix + f
      const tName = states.find((s) => s.id === t).name ?? '' + statePrefix + t
      setFromState(f)
      setToState(t)
      setFromName(fName)
      setToName(tName)
      setTransitionsList(transitionsScope)
      // Update ID list to include *ALL* transitions on this edge, including unselected
      // This will run the side effect of re-retrieving the updated id list when done
      const allIdList = transitions
        .filter(
          (t) =>
            t.from === transitionsScope[0].from &&
            t.to === transitionsScope[0].to
        )
        .map((t) => t.id)
      setIdList([...allIdList])
      setModalOpen(true)
    },
    [orOperator]
  )

  const retrieveTransitions = () => {
    const { transitions } = useProjectStore.getState()?.project ?? {}
    const transitionsScope = transitions.filter((t) => idList.includes(t.id))
    setTransitionsList([...transitionsScope])
  }

  // Re-retrieve transitions when the id list changes (i.e. on new transition)
  useEffect(() => {
    retrieveTransitions()
    setTransitionListRef(
      Array.from({ length: transitionsList?.length ?? 0 }, () =>
        createRef<HTMLInputElement>()
      )
    )
  }, [idList])

  const resetInputFields = () => {
    setReadValue('')
    setPopValue('')
    setPushValue('')
    setWriteValue('')
    setDirValue('R')
  }

  const createNewTransition = () => {
    const newId = createTransition({ from: fromState, to: toState })
    setIdList([...idList, newId])
    return newId
  }

  const deleteTransition = (index: number) => {
    const delId = idList[index]
    removeTransitions([delId])
    setIdList(idList.filter((_, i) => i !== index))
  }

  const handleIndexDown = () => {
    const nextIndex = selectedIndex < 0 ? -1 : selectedIndex - 1
    const nextInputRef =
      nextIndex >= 0 ? transitionListRef[nextIndex] : inputRef
    const ro = nextInputRef as RefObject<HTMLInputElement>
    setSelectedIndex(nextIndex)
    ro?.current.focus()
  }

  const handleIndexUp = () => {
    if (selectedIndex < transitionListRef?.length - 1) {
      const prevIndex =
        selectedIndex === transitionListRef?.length - 1 ?? 0
          ? transitionListRef?.length - 1 ?? 0
          : selectedIndex + 1
      const prevInputRef = transitionListRef[prevIndex]
      const ro = prevInputRef as RefObject<HTMLInputElement>
      setSelectedIndex(prevIndex)
      ro?.current.focus()
    }
  }

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        if (selectedIndex === -1) {
          saveNewTransition()
        } else {
          handleIndexDown()
        }
        break
      case 'ArrowDown':
        handleIndexDown()
        break
      case 'ArrowUp':
        handleIndexUp()
        break
    }
  }

  /**
   * Functions for FSAs
   */
  const saveFSATransition = ({ id, read }) => {
    editTransition({ id, read })
    retrieveTransitions()
  }

  const saveNewFSATransition = () => {
    const newId = createNewTransition()
    editTransition({
      id: newId,
      read: formatInput(readValue, orOperator)
    } as FSAAutomataTransition)
    resetInputFields()
  }

  const blankFSAInput = () => (
    <InputWrapper>
      <Input
        ref={inputRef}
        value={readValue}
        onChange={(e) => setReadValue(e.target.value)}
        onClick={() => setSelectedIndex(-1)}
        onKeyUp={handleKeyUp}
        onFocus={(e) => e.target.select()}
        placeholder={'λ (New transition)'}
      />
      <SubmitButton onClick={saveNewTransition}>
        <CornerDownLeft size="18px" />
      </SubmitButton>
    </InputWrapper>
  )

  /**
   * Functions for PDAs
   */
  const savePDATransition = ({ id, read, pop, push }) => {
    editTransition({ id, read, pop, push } as PDAAutomataTransition)
    retrieveTransitions()
  }

  const saveNewPDATransition = () => {
    const newId = createNewTransition()
    editTransition({
      id: newId,
      read: formatInput(readValue, orOperator),
      pop: popValue,
      push: pushValue
    } as PDAAutomataTransition)
    resetInputFields()
  }

  const blankPDAInput = () => (
    <InputWrapper>
      <InputSpacingWrapper>
        <Input
          ref={inputRef}
          value={readValue}
          onChange={(e) => setReadValue(e.target.value)}
          onClick={() => setSelectedIndex(-1)}
          onKeyUp={handleKeyUp}
          onFocus={(e) => e.target.select()}
          placeholder={'λ\t(read)'}
        />
      </InputSpacingWrapper>
      <InputSeparator>,</InputSeparator>
      <InputSpacingWrapper>
        <Input
          value={popValue}
          onChange={(e) => setPopValue(e.target.value)}
          onClick={() => setSelectedIndex(-1)}
          onKeyUp={handleKeyUp}
          onFocus={(e) => e.target.select()}
          placeholder={'λ\t(pop)'}
        />
      </InputSpacingWrapper>
      <InputSeparator>;</InputSeparator>
      <InputSpacingWrapper>
        <Input
          value={pushValue}
          onChange={(e) => setPushValue(e.target.value)}
          onClick={() => setSelectedIndex(-1)}
          onKeyUp={handleKeyUp}
          onFocus={(e) => e.target.select()}
          placeholder={'λ\t(push)'}
        />
      </InputSpacingWrapper>
      <SubmitButton onClick={saveNewTransition}>
        <CornerDownLeft size="18px" />
      </SubmitButton>
    </InputWrapper>
  )

  /**
   * Functions for TMs
   */
  const saveTMTransition = ({ id, read, write, direction }) => {
    editTransition({
      id,
      read,
      write,
      direction: direction || 'R'
    } as TMAutomataTransition)
    retrieveTransitions()
  }

  const saveNewTMTransition = () => {
    const newId = createNewTransition()
    editTransition({
      id: newId,
      read: formatInput(readValue, orOperator),
      write: writeValue,
      direction: dirValue || 'R'
    } as TMAutomataTransition)
    resetInputFields()
  }

  /** TMs operate with the assumption of writing one character */
  const tmWriteValidate = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toString()
    return input[input.length - 1] ?? ''
  }

  const blankTMInput = () => (
    <InputWrapper>
      <InputSpacingWrapper>
        <Input
          ref={inputRef}
          value={readValue}
          onChange={(e) => {
            const r = tmWriteValidate(e)
            setReadValue(r)
          }}
          onClick={() => setSelectedIndex(-1)}
          onKeyUp={handleKeyUp}
          onFocus={(e) => e.target.select()}
          placeholder={'λ\t(read)'}
        />
      </InputSpacingWrapper>
      <InputSeparator>,</InputSeparator>
      <InputSpacingWrapper>
        <Input
          value={writeValue}
          onChange={(e) => {
            const w = tmWriteValidate(e)
            setWriteValue(w)
          }}
          onClick={() => setSelectedIndex(-1)}
          onKeyUp={handleKeyUp}
          onFocus={(e) => e.target.select()}
          placeholder={'λ\t(write)'}
        />
      </InputSpacingWrapper>
      <InputSeparator>;</InputSeparator>
      <InputSpacingWrapper>
        <DirectionRadioButtons
          direction={dirValue as TMDirection}
          setDirection={setDirValue}
          handleSave={handleKeyUp}
          name={'new-TM-transition'}
        />
      </InputSpacingWrapper>
      <InputSpacingWrapper>
        <TMSubmitButton onClick={saveNewTransition}>
          <CornerDownLeft size="18px" />
        </TMSubmitButton>
      </InputSpacingWrapper>
    </InputWrapper>
  )

  const saveNewTransition = () => {
    switch (projectType) {
      case 'FSA':
        saveNewFSATransition()
        break
      case 'PDA':
        saveNewPDATransition()
        break
      case 'TM':
        saveNewTMTransition()
        break
    }
    inputRef.current.focus()
  }

  /**
   * Modal contents
   */

  if (!transitionsList) return null

  const contents = () => {
    switch (projectType) {
      case 'FSA':
        assertType<Array<FSAAutomataTransition>>(transitionsList)
        return (
          <>
            {transitionsList
              .map((t, i) => (
                <InputWrapper key={i}>
                  <Input
                    ref={transitionListRef[i] ?? null}
                    value={splitCharsWithOr(t.read, orOperator)}
                    onChange={(e) => {
                      saveFSATransition({
                        id: t.id,
                        read: formatInput(e.target.value, orOperator)
                      })
                      setSelectedIndex(i)
                    }}
                    onClick={() => setSelectedIndex(i)}
                    onKeyUp={handleKeyUp}
                    onFocus={(e) => e.target.select()}
                    placeholder={'λ'}
                  />
                  <SubmitButton onClick={() => deleteTransition(i)}>
                    <X size="18px" />
                  </SubmitButton>
                </InputWrapper>
              ))
              .reverse()}
            <hr />
            Add a new transition?
            {blankFSAInput()}
          </>
        )
      case 'PDA':
        assertType<Array<PDAAutomataTransition>>(transitionsList)
        return (
          <>
            {transitionsList
              .map((t, i) => (
                <InputWrapper key={i}>
                  <InputSpacingWrapper>
                    <Input
                      ref={transitionListRef[i] ?? null}
                      value={splitCharsWithOr(t.read, orOperator)}
                      onChange={(e) => {
                        savePDATransition({
                          id: t.id,
                          read: formatInput(e.target.value, orOperator),
                          pop: t.pop,
                          push: t.push
                        })
                        setSelectedIndex(i)
                      }}
                      onClick={() => setSelectedIndex(i)}
                      onKeyUp={handleKeyUp}
                      onFocus={(e) => e.target.select()}
                      placeholder={'λ'}
                    />
                  </InputSpacingWrapper>
                  <InputSeparator>,</InputSeparator>
                  <InputSpacingWrapper>
                    <Input
                      value={t.pop}
                      onChange={(e) => {
                        savePDATransition({
                          id: t.id,
                          read: t.read,
                          pop: e.target.value,
                          push: t.push
                        })
                        setSelectedIndex(i)
                      }}
                      onClick={() => setSelectedIndex(i)}
                      onKeyUp={handleKeyUp}
                      onFocus={(e) => e.target.select()}
                      placeholder={'λ'}
                    />
                  </InputSpacingWrapper>
                  <InputSeparator>;</InputSeparator>
                  <InputSpacingWrapper>
                    <Input
                      value={t.push}
                      onChange={(e) => {
                        savePDATransition({
                          id: t.id,
                          read: t.read,
                          pop: t.pop,
                          push: e.target.value
                        })
                        setSelectedIndex(i)
                      }}
                      onClick={() => setSelectedIndex(i)}
                      onKeyUp={handleKeyUp}
                      onFocus={(e) => e.target.select()}
                      placeholder={'λ'}
                    />
                  </InputSpacingWrapper>
                  <SubmitButton onClick={() => deleteTransition(i)}>
                    <X size="18px" />
                  </SubmitButton>
                </InputWrapper>
              ))
              .reverse()}
            <hr />
            <Heading>Add a new transition?</Heading>
            {blankPDAInput()}
          </>
        )
      case 'TM':
        assertType<Array<TMAutomataTransition>>(transitionsList)
        return (
          <>
            {transitionsList
              .map((t, i) => (
                <InputWrapper key={i}>
                  <InputSpacingWrapper>
                    <Input
                      ref={transitionListRef[i] ?? null}
                      value={splitCharsWithOr(t.read, orOperator)}
                      onChange={(e) => {
                        saveTMTransition({
                          id: t.id,
                          read: formatInput(e.target.value, orOperator),
                          write: t.write,
                          direction: t.direction
                        })
                        setSelectedIndex(i)
                      }}
                      onClick={() => setSelectedIndex(i)}
                      onKeyUp={handleKeyUp}
                      onFocus={(e) => e.target.select()}
                      placeholder={'λ'}
                    />
                  </InputSpacingWrapper>
                  <InputSeparator>,</InputSeparator>
                  <InputSpacingWrapper>
                    <Input
                      value={t.write}
                      onChange={(e) => {
                        const w = tmWriteValidate(e)
                        saveTMTransition({
                          id: t.id,
                          read: t.read,
                          write: w,
                          direction: t.direction
                        })
                        setSelectedIndex(i)
                      }}
                      onClick={() => setSelectedIndex(i)}
                      onKeyUp={handleKeyUp}
                      onFocus={(e) => e.target.select()}
                      placeholder={'λ'}
                    />
                  </InputSpacingWrapper>
                  <InputSeparator>;</InputSeparator>
                  <InputSpacingWrapper>
                    <DirectionRadioButtons
                      direction={t.direction}
                      setDirection={(newDirection) => {
                        saveTMTransition({
                          id: t.id,
                          read: t.read,
                          write: t.write,
                          direction: newDirection
                        })
                        setSelectedIndex(i)
                      }}
                      name={`transition-group-${t.id}`}
                      handleSave={handleKeyUp}
                    />
                  </InputSpacingWrapper>
                  <InputSpacingWrapper>
                    <TMSubmitButton onClick={() => deleteTransition(i)}>
                      <X size="18px" />
                    </TMSubmitButton>
                  </InputSpacingWrapper>
                </InputWrapper>
              ))
              .reverse()}
            <hr />
            <Heading>Add a new transition?</Heading>
            {blankTMInput()}
          </>
        )
    }
  }

  return (
    <Modal
      title="Transition Edge Editor"
      description={
        'Editing transition from ' + fromName + ' to ' + toName + '.'
      }
      isOpen={modalOpen}
      onClose={() => {
        commit()
        setModalOpen(false)
        resetInputFields()
      }}
      actions={
        <Button
          onClick={() => {
            commit()
            setModalOpen(false)
            resetInputFields()
          }}
        >
          Done
        </Button>
      }
    >
      {contents()}
    </Modal>
  )
}

export default InputTransitionGroup
