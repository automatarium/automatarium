import { useProjectStore, useTemplatesStore, useTemplateStore } from '/src/stores'
import { SectionLabel, Preference, Input, Button } from '/src/components'

import { Wrapper } from './templatesStyle'

const Templates = () => {
  const statePrefix = useProjectStore(s => s.project?.config?.statePrefix)
  const projectColor = useProjectStore(s => s.project?.config?.color)
  const updateConfig = useProjectStore(s => s.updateConfig)
  const templates = useTemplatesStore(s => s.templates)
  const setTemplate = useTemplateStore(s => s.setTemplate)
  const setIsInserting = useTemplateStore(s => s.setIsInserting)
  const isInserting = useTemplateStore(s => s.isInserting)
  console.log(isInserting)

  const pickTemplate = (e) => {
    const id = e.target.value
    const newTemplate = templates.find(template => template._id === id)
    setTemplate(newTemplate)
  }

  return <>
    <SectionLabel>Your templates</SectionLabel>
      <Wrapper>
      <Input type="select" onChange={(e) => pickTemplate(e)}>
        {templates.map((temp, key) => (
          <option value={temp._id}>{temp._id}</option>
        ))}
      </Input>
      <Button onClick={() => setIsInserting(true)}>Start insert template</Button>
      <Button onClick={() => setIsInserting(false)}>Stop insert template</Button>
      </Wrapper>
  </>
}

export default Templates
