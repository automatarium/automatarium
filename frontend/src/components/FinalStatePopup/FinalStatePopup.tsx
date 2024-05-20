import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Modal, SectionLabel, Preference, Switch } from '/src/components'
import { useEvent } from '/src/hooks'
import { usePopupsStore, usePreferencesStore } from '/src/stores'

import { Section } from './finalStatePopupStyle'
import { Preferences } from '/src/stores/usePreferencesStore'

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
    setPopups({ showFinalState: false })  // Don't show popup again after submitting
    setIsOpen(false)
  }

  useEffect(() => {
    console.log(preferences)
    reset({pauseTM: preferences.pauseTM})
  }, [preferences, isOpen])

  useEvent('modal:finalstate', () => {setIsOpen(true)}, [])

  return (
    <Modal
      title="IMPORTANT"
      description="The default Turing Machine behaviour is to halt upon reaching a final state. You can modify this setting below this text or by accessing the preferences menu at any time."
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      role="alertdialog" // Prevents closing by clicking away
      actions={<>
        <Button secondary onClick={() => setIsOpen(false)}>Close without saving</Button>
        <Button type="submit" form="popups_form">Save preference</Button>
      </>}
      style={{ paddingInline: 0 }}
    >
      <form id="popups_form" onSubmit={handleSubmit(onSubmit)}>
        <SectionLabel>Behaviour</SectionLabel>
        <Section>
          <Preference
            label="TM Pause on Final State 2"
            description="Toggles pausing for trace step for TM 2"
          >
            <Switch type="checkbox" {...register('pauseTM')} />
          </Preference>
        </Section>
      </form>
    </Modal>
  )
}

export default FinalStatePopup
