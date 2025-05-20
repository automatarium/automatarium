import { useProjectStore } from '/src/stores'
import { SectionLabel, Preference, Input } from '/src/components'

import { Wrapper } from './optionsStyle'
import { ColourName } from '/src/config'
import { useTranslation } from 'react-i18next'

const Options = () => {
  const statePrefix = useProjectStore(s => s.project?.config?.statePrefix)
  const orOperator = useProjectStore(s => s.project?.config?.orOperator)
  const projectColor = useProjectStore(s => s.project?.config?.color)
  const updateConfig = useProjectStore(s => s.updateConfig)
  const { t } = useTranslation('common')

  return <>
    <SectionLabel>{t('options.states')}</SectionLabel>
    <Wrapper>
      <Preference
        label={t('options.identifier')}
        description={t('options.identifier_desc')}
      >
        <Input
          small
          style={{ width: '8ch' }}
          value={statePrefix ?? 'q'}
          onChange={e => updateConfig({ statePrefix: e.target.value })}
        />
      </Preference>
    </Wrapper>

    <SectionLabel>{t('options.operators')}</SectionLabel>
    <Wrapper>
      <Preference
        label={t('options.or_operator')}
        description={t('options.or_desc')}
      >
        <Input
          type="select"
          small
          value={(orOperator === '' || !orOperator) ? '|' : orOperator}
          onChange={e => updateConfig({ orOperator: e.target.value })}
        >
          <option value="∣">∣</option>
          <option value="∥">∥</option>
          <option value="＋">＋</option>
          <option value="∨">v</option>
          <option value="OR">{t('OR')}</option>
          <option value=" ">{t('options.none')}</option>
        </Input>
      </Preference>
    </Wrapper>

    <SectionLabel>{t('options.theme')}</SectionLabel>
    <Wrapper>
      <Preference
        label={t('options.colour')}
        description={t('options.colour_desc')}
      >
        <Input
          type="select"
          small
          value={(projectColor === '' || !projectColor) ? 'orange' : projectColor}
          onChange={e => updateConfig({ color: e.target.value as ColourName })}
        >
          <option value="red">{t('colours.red')}</option>
          <option value="orange">{t('colours.orange')}</option>
          <option value="green">{t('colours.green')}</option>
          <option value="teal">{t('colours.teal')}</option>
          <option value="blue">{t('colours.blue')}</option>
          <option value="purple">{t('colours.purple')}</option>
          <option value="pink">{t('colours.pink')}</option>
        </Input>
      </Preference>
    </Wrapper>
  </>
}

export default Options
