import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SectionLabel, Input, Button, Preference, Modal, Switch } from '/src/components'
import { usePreferencesStore } from '/src/stores'
import { useEvent } from '/src/hooks'

import { Section } from './preferencesStyle'
import { Preferences } from '/src/stores/usePreferencesStore'
import { useTranslation } from 'react-i18next'

const defaultValues = {
  theme: 'system',
  color: 'match',
  showGrid: true,
  ctrlZoom: true,
  pauseTM: true
}

const Preferences = () => {
  const { t } = useTranslation('preferences')
  const [isOpen, setIsOpen] = useState(false)

  const preferences = usePreferencesStore(state => state.preferences)
  const setPreferences = usePreferencesStore(state => state.setPreferences)

  const { register, handleSubmit, reset } = useForm({ defaultValues })

  const onSubmit = (values: Preferences) => {
    setPreferences(values)
    setIsOpen(false)
    window.location.reload()
  }

  useEffect(() => {
    reset(preferences)
  }, [preferences, isOpen])

  useEvent('modal:preferences', () => setIsOpen(true), [])

  return (
    <Modal
      title={t('title')}
      description={t('description')}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      role="alertdialog" // Prevents closing by clicking away
      actions={<>
        <Button secondary onClick={() => setIsOpen(false)}>{t('button.without_save')}</Button>
        <Button type="submit" form="preferences_form">{t('button.save')}</Button>
      </>}
      style={{ paddingInline: 0 }}
    >
      <form id="preferences_form" onSubmit={handleSubmit(onSubmit)}>
        <SectionLabel>{t('appearance.label')}</SectionLabel>
        <Section>
          <Preference
            label={t('appearance.theme.label')}
            description={t('appearance.theme.description')}
          >
            <Input type="select" small {...register('theme')}>
              <option value="system">{t('appearance.theme.system')}</option>
              <option value="light">{t('appearance.theme.light')}</option>
              <option value="dark">{t('appearance.theme.dark')}</option>
            </Input>
          </Preference>

          <Preference
            label={t('appearance.colour_accent.label')}
            description={t('appearance.colour_accent.description')}
          >
            <Input type="select" small {...register('color')}>
              <option value="match">{t('appearance.colour_accent.match')}</option>
              <option value="red">{t('appearance.colour_accent.red')}</option>
              <option value="orange">{t('appearance.colour_accent.orange')}</option>
              <option value="green">{t('appearance.colour_accent.green')}</option>
              <option value="teal">{t('appearance.colour_accent.teal')}</option>
              <option value="blue">{t('appearance.colour_accent.blue')}</option>
              <option value="purple">{t('appearance.colour_accent.purple')}</option>
              <option value="pink">{t('appearance.colour_accent.pink')}</option>
            </Input>
          </Preference>
        </Section>

        <SectionLabel>{t('behaviour.label')}</SectionLabel>
        <Section>
          <Preference
            label={t('behaviour.enable_grid.label')}
            description={t('behaviour.enable_grid.description')}
          >
            <Switch type="checkbox" {...register('showGrid')} />
          </Preference>

          <Preference
            label={t('behaviour.zoom_control.label')}
            description={t('behaviour.zoom_control.description')}
          >
            <Switch type="checkbox" {...register('ctrlZoom')} />
          </Preference>

          <Preference
            label={t('behaviour.tm_halt.label')}
            description={t('behaviour.tm_halt.description')}
          >
            <Switch type="checkbox" {...register('pauseTM')} />
          </Preference>
        </Section>
      </form>
    </Modal>
  )
}

export default Preferences
