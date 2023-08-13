import { useState } from 'react'
import { useEvent } from '/src/hooks'
import { useProjectStore } from '/src/stores'
import { BaseAutomataTransition, FSAAutomataTransition, PDAAutomataTransition, TMAutomataTransition, assertType } from '/src/types/ProjectTypes'
import Modal from '/src/components/Modal/Modal'
import Button from '/src/components/Button/Button'
import Input from '/src/components/Input/Input'
import { InputWrapper } from '/src/components/InputDialogs/inputDialogsStyle'

const InputTransitionGroup = () => {
  const [fromState, setFromState] = useState<number>()
  const [toState, setToState] = useState<number>()
  const [transitionsList, setTransitionsList] = useState<Array<BaseAutomataTransition> | undefined>()

  const [modalOpen, setModalOpen] = useState(false)

  const [idList, setIdList] = useState([])

  const statePrefix = useProjectStore(s => s.project.config.statePrefix)
  const projectType = useProjectStore(s => s.project.config.type)

  const editTransition = useProjectStore(s => s.editTransition)
  const commit = useProjectStore(s => s.commit)
  // Get data from event dispatch
  useEvent('editTransitionGroup', ({ detail: { ids } }) => {
    // Get transitions from store
    const { transitions } = useProjectStore.getState()?.project ?? {}
    setIdList([...ids])
    const transitionsScope = transitions.filter(t => ids.includes(t.id))
    // All of these should be part of the same transition edge
    setFromState(transitionsScope[0].from)
    setToState(transitionsScope[0].to)
    setTransitionsList(transitionsScope)
    setModalOpen(true)
  })

  const retrieveTransitions = () => {
    const { transitions } = useProjectStore.getState()?.project ?? {}
    const transitionsScope = transitions.filter(t => idList.includes(t.id))
    setTransitionsList([...transitionsScope])
  }

  const saveFSATransition = ({ id, read }) => {
    editTransition({ id, read })
    commit()
    retrieveTransitions()
  }

  const savePDATransition = ({ id, read, pop, push }) => {
    editTransition({ id, read, pop, push } as PDAAutomataTransition)
    commit()
    retrieveTransitions()
  }

  const saveTMTransition = ({ id, read, write, direction }) => {
    editTransition({ id, read, write, direction: direction || 'R' } as TMAutomataTransition)
    commit()
    retrieveTransitions()
  }

  if (!transitionsList) return null

  function contents () {
    switch (projectType) {
      case 'FSA':
        assertType<Array<FSAAutomataTransition>>(transitionsList)
        return transitionsList.map((t, i) => <Input
          key={i}
          value={t.read}
          onChange={e => saveFSATransition({ id: t.id, read: e.target.value })}
          placeholder={'λ'}
        />
        )
      case 'PDA':
        assertType<Array<PDAAutomataTransition>>(transitionsList)
        return transitionsList.map((t, i) => <InputWrapper key={i}>
            <Input
              value={t.read}
              onChange={e => savePDATransition({
                id: t.id,
                read: e.target.value,
                pop: t.pop,
                push: t.push
              })}
              placeholder={'λ\t(read)'}
              />
            <Input
              value={t.pop}
              onChange={e => savePDATransition({
                id: t.id,
                read: t.read,
                pop: e.target.value,
                push: t.push
              })}
              placeholder={'λ\t(pop)'}
              />
            <Input
              value={t.push}
              onChange={e => savePDATransition({
                id: t.id,
                read: t.read,
                pop: t.pop,
                push: e.target.value
              })}
              placeholder={'λ\t(push)'}
            />
          </InputWrapper>)
      case 'TM':
        assertType<Array<TMAutomataTransition>>(transitionsList)
        return transitionsList.map((t, i) => <InputWrapper key={i}>
          <Input
            value={t.read}
            onChange={e => saveTMTransition({
              id: t.id,
              read: e.target.value,
              write: t.write,
              direction: t.direction
            })}
            placeholder={'λ\t(read)'}
          />
          <Input
            value={t.write}
            onChange={e => saveTMTransition({
              id: t.id,
              read: t.read,
              write: e.target.value,
              direction: t.direction
            })}
            placeholder={'λ\t(write)'}
          />
          <Input
            value={t.direction}
            onChange={e => saveTMTransition({
              id: t.id,
              read: t.read,
              write: t.write,
              direction: e.target.value
            })}
            placeholder={'↔\t(direction)'}
          />
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
    {contents()}
  </Modal>
}

export default InputTransitionGroup
