import { useProjectStore } from '/src/stores'
import { SectionLabel, Preference, Input } from '/src/components'

import { Wrapper } from './optionsStyle'
import { ColourName } from '/src/config'

const Options = () => {
  const statePrefix = useProjectStore(s => s.project?.config?.statePrefix)
  const orOperator = useProjectStore(s => s.project?.config?.orOperator)
  const projectColor = useProjectStore(s => s.project?.config?.color)
  const updateConfig = useProjectStore(s => s.updateConfig)

  return <>
    <SectionLabel>States</SectionLabel>
    <Wrapper>
      <Preference
        label="State identifier"
        description="Used to denote a state"
      >
        <Input
          small
          style={{ width: '8ch' }}
          value={statePrefix ?? 'q'}
          onChange={e => updateConfig({ statePrefix: e.target.value })}
        />
      </Preference>
    </Wrapper>

    <SectionLabel>Operators</SectionLabel>
    <Wrapper>
      <Preference
        label="OR operator"
        description="Used to separate input characters"
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
          <option value="OR">OR</option>
          <option value=" ">None</option>
        </Input>
      </Preference>
    </Wrapper>

    <SectionLabel>Theme</SectionLabel>
    <Wrapper>
      <Preference
        label="Project colour"
        description="Set the theme for this automaton"
      >
        <Input
          type="select"
          small
          value={(projectColor === '' || !projectColor) ? 'orange' : projectColor}
          onChange={e => updateConfig({ color: e.target.value as ColourName })}
        >
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="green">Green</option>
          <option value="teal">Teal</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="pink">Pink</option>
        </Input>
      </Preference>
    </Wrapper>
  </>
}

export default Options
