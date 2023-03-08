import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SectionLabel, Input, Button, Preference, Modal, Switch } from '/src/components'
import { usePreferencesStore } from '/src/stores'
import { useEvent } from '/src/hooks'

import { Section } from './preferencesStyle'

const defaultValues = {
  theme: 'system',
  color: 'match',
  showGrid: true,
  ctrlZoom: true
}

const Preferences = () => {
  const [isOpen, setIsOpen] = useState(false)

  const preferences = usePreferencesStore(state => state.preferences)
  const setPreferences = usePreferencesStore(state => state.setPreferences)

  const { register, handleSubmit, reset } = useForm({ defaultValues })

  const onSubmit = values => {
    setPreferences(values)
    setIsOpen(false)
  }

  useEffect(() => {
    reset(preferences)
  }, [preferences, isOpen])

  useEvent('modal:preferences', () => setIsOpen(true), [])

  return (
    <Modal
      title="Preferences"
      description="Your Automatarium preferences are saved to your browser"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      role="alertdialog" // Prevents closing by clicking away
      actions={<>
        <Button secondary onClick={() => setIsOpen(false)}>Close without saving</Button>
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
          >
            <Input type="select" small {...register('theme')}>
              <option value="system">Match system</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Input>
          </Preference>

          <Preference
            label="Colour accent"
            description="Roses are red, Automatarium is blue"
          >
            <Input type="select" small {...register('color')}>
              <option value="match">Match file theme</option>
              <option value="red">Red</option>
              <option value="orange">Orange</option>
              <option value="green">Green</option>
              <option value="teal">Teal</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
            </Input>
          </Preference>
        </Section>

        <SectionLabel>Behaviour</SectionLabel>
        <Section>
          <Preference
            label="Enable grid"
            description="This also enables snapping"
          >
            <Switch type="checkbox" {...register('showGrid')} />
          </Preference>

          <Preference
            label="Zoom with the control key"
            description="Allows panning using a trackpad"
          >
            <Switch type="checkbox" {...register('ctrlZoom')} />
          </Preference>
        </Section>
      </form>
    </Modal>
  )
}

export default Preferences
