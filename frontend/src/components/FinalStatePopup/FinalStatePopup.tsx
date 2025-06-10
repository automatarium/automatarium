import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button, Modal, SectionLabel, Preference, Switch } from '/src/components'
import { useEvent } from '/src/hooks'
import { usePopupsStore, usePreferencesStore } from '/src/stores'

import { Section } from './finalStatePopupStyle'
import { useTranslation } from 'react-i18next'

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

  const { t } = useTranslation('common')

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
      title={t('final_state_popup.title')}
      description={t('final_state_popup.description')}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      role="alertdialog" // Prevents closing by clicking away
      actions={<>
        <Button secondary onClick={() => setIsOpen(false)}>{t('final_state_popup.close_nosave')}</Button>
        <Button type="submit" form="popups_form">{t('final_state_popup.close_save')}</Button>
      </>}
      style={{ paddingInline: 0 }}
    >
      <form id="popups_form" onSubmit={handleSubmit(onSubmit)}>
        <SectionLabel>{t('preferences.behaviour')}</SectionLabel>
        <Section>
          <Preference
            label={t('preferences.tm_halt')}
            description={t('preferences.tm_halt_description')}
          >
            <Switch type="checkbox" {...register('pauseTM')} />
          </Preference>
        </Section>
      </form>
    </Modal>
  )
}

export default FinalStatePopup
