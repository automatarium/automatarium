import { useState } from 'react'
import { useEvent } from '/src/hooks'
import { useProjectStore } from '/src/stores'
import { BaseAutomataTransition, FSAAutomataTransition, PDAAutomataTransition, TMAutomataTransition, assertType } from '/src/types/ProjectTypes'
import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import Input from '../Input/Input'
import { InputWrapper } from '../InputDialogs/inputDialogsStyle'

const InputTransitionGroup = () => {
  const [fromState, setFromState] = useState<number>()
  const [toState, setToState] = useState<number>()
  const [transitionsList, setTransitionsList] = useState<Array<BaseAutomataTransition> | undefined>()

  const [modalOpen, setModalOpen] = useState(false)

  const statePrefix = useProjectStore(s => s.project.config.statePrefix)
  const projectType = useProjectStore(s => s.project.config.type)
  // Get data from event dispatch
  useEvent('editTransitionGroup', ({ detail: { ids } }) => {
    // Get transitions from store
    const { transitions } = useProjectStore.getState()?.project ?? {}
    const transitionsScope = transitions.filter(t => ids.includes(t.id))
    // All of these should be part of the same transition edge
    setFromState(transitionsScope[0].from)
    setToState(transitionsScope[0].to)
    setTransitionsList(transitionsScope)
    setModalOpen(true)
  })

  if (!transitionsList) return null

  function contents () {
    switch (projectType) {
      case 'FSA':
        assertType<Array<FSAAutomataTransition>>(transitionsList)
        return transitionsList.map(t => <Input
          key={t.id}
          value={t.read}
          placeholder={'λ'}
        />
        )
      case 'PDA':
        assertType<Array<PDAAutomataTransition>>(transitionsList)
        return transitionsList.map(t => <InputWrapper key={t.id}>
            <Input value={t.read} placeholder={'λ\t(read)'} />
            <Input value={t.pop} placeholder={'λ\t(pop)'} />
            <Input value={t.push} placeholder={'λ\t(push)'} />
          </InputWrapper>)
      case 'TM':
        assertType<Array<TMAutomataTransition>>(transitionsList)
        return transitionsList.map(t => <InputWrapper key={t.id}>
          <Input value={t.read} placeholder={'λ\t(read)'} />
          <Input value={t.write} placeholder={'λ\t(write)'} />
          <Input value={t.direction} placeholder={'↔\t(direction)'} />
        </InputWrapper>)
    }
  }

  return <Modal
    title='Transition Edge Editor'
    description={
        'Editing transition from ' +
        statePrefix + fromState + ' to ' +
        statePrefix + toState + '.'
      }
    isOpen={modalOpen}
    actions={<Button onClick={() => setModalOpen(false)}>Done</Button>}
  >
    <div>{contents()}</div>
  </Modal>
}

export default InputTransitionGroup
