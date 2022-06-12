import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { SectionLabel, SelectInput, Button, Preference, Modal } from '/src/components'
import { usePreferencesStore } from '/src/stores'

import { Section } from './preferencesStyle'

const defaultValues = {
  theme: 'system',
  color: 'match',
  showGrid: true,
}

const Preferences = ({ isOpen, onClose }) => {
  const preferences = usePreferencesStore(state => state.preferences)
  const setPreferences = usePreferencesStore(state => state.setPreferences)

  const { register, handleSubmit, reset } = useForm({ defaultValues })

  const onSubmit = values => {
    setPreferences(values)
    onClose()
  }

  useEffect(() => {
    reset(preferences)
  }, [preferences, isOpen])

  return (
    <Modal
      title="Preferences"
      description="Your Automatarium preferences are saved to your browser"
      isOpen={isOpen}
      onClose={onClose}
      role="alertdialog" // Prevents closing by clicking away
      actions={<>
        <Button secondary onClick={onClose}>Close without saving</Button>
        <Button type="submit" form="preferences_form">Save changes</Button>
      </>}
      style={{ paddingInline: 0 }}
    >
      <form id="preferences_form" onSubmit={handleSubmit(onSubmit)}>
        <SectionLabel>Appearance</SectionLabel>
        <Section>
          <Preference
            label="Theme"
            description="Up late? Switch to dark mode"
            htmlFor="theme"
          >
            <SelectInput id="theme" {...register('theme')}>
              <option value="system">Match system</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </SelectInput>
          </Preference>
          <Preference
            label="Colour accent"
            description="Roses are red, Automatarium is blue"
            htmlFor="color"
          >
            <SelectInput id="color" {...register('color')}>
              <option value="match">Match file theme</option>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="green">Green</option>
              <option value="teal">Teal</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
            </SelectInput>
          </Preference>
        </Section>

        <SectionLabel>Behaviour</SectionLabel>
        <Section>
          <Preference
            label="Enable grid"
            description="This also enables snapping"
            htmlFor="showGrid"
          >
            <input id="showGrid" type="checkbox" {...register('showGrid')} />
          </Preference>
        </Section>
      </form>
    </Modal>
  )
}

export default Preferences
