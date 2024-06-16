import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Modal, SectionLabel, Preference, Switch } from '/src/components'
import { useEvent } from '/src/hooks'
import { usePopupsStore, usePreferencesStore } from '/src/stores'

import { Section } from './finalStatePopupStyle'

const defaultValues = {
  pauseTM: true
}

interface PauseOption {
  pauseTM: boolean
}

const FinalStatePopup = () => {
  const [isOpen, setIsOpen] = useState(false)

  const setPopups = usePopupsStore(state => state.setPopups)
  const preferences = usePreferencesStore(state => state.preferences)
  const setPreferences = usePreferencesStore(state => state.setPreferences)

  const { register, handleSubmit, reset } = useForm({ defaultValues })

  const onSubmit = (values: PauseOption) => {
    // Get current preferences and modify only pauseTM
    const newPreferences = { ...preferences, pauseTM: values.pauseTM }
    setPreferences(newPreferences)
    setPopups({ showFinalState: false })// Don't show popup again after submitting
    setIsOpen(false)
  }

  useEffect(() => {
    console.log(preferences)
    reset({ pauseTM: preferences.pauseTM })
  }, [preferences, isOpen])

  useEvent('modal:finalstate', () => setIsOpen(true), [])

  return (
    <Modal
      title="IMPORTANT"
      description="Default Turing Machine behaviour is to halt upon reaching a final state. Modify below or in the preferences menu."
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      role="alertdialog" // Prevents closing by clicking away
      actions={<>
        <Button secondary onClick={() => setIsOpen(false)}>Close without saving</Button>
        <Button type="submit" form="popups_form">Save and don't show again</Button>
      </>}
      style={{ paddingInline: 0 }}
    >
      <form id="popups_form" onSubmit={handleSubmit(onSubmit)}>
        <SectionLabel>Behaviour</SectionLabel>
        <Section>
          <Preference
            label="TM Halt on Final State"
            description="Toggles halting for trace step for TM"
          >
            <Switch type="checkbox" {...register('pauseTM')} />
          </Preference>
        </Section>
      </form>
    </Modal>
  )
}

export default FinalStatePopup
