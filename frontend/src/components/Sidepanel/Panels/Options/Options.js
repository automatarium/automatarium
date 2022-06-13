import { useProjectStore } from '/src/stores'
import { SectionLabel, Preference, Input } from '/src/components'

import { Wrapper } from './optionsStyle'

const Options = () => {
  const statePrefix = useProjectStore(s => s.project?.config?.statePrefix) ?? 'q'
  const projectColor = useProjectStore(s => s.project?.config?.color) ?? 'orange'
  const updateConfig = useProjectStore(s => s.updateConfig)

  return <>
    <SectionLabel>States</SectionLabel>
    <Wrapper>
      <Preference
        label="State identifier"
        description="Used to denote a state"
        htmlFor="state_identifier"
      >
        <Input
          id="state_identifier"
          small
          style={{ width: '8ch' }}
          value={statePrefix}
          onChange={e => updateConfig({ statePrefix: e.target.value })}
        />
      </Preference>
    </Wrapper>

    <SectionLabel>Theme</SectionLabel>
    <Wrapper>
      <Preference
        label="Project colour"
        description="Set the theme for this automaton"
        htmlFor="project_color"
      >
        <Input
          id="project_color"
          type="select"
          small
          value={projectColor === '' ? 'orange' : projectColor}
          onChange={e => updateConfig({ color: e.target.value })}
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
