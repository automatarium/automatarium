import { useTemplatesStore, useTemplateStore } from '/src/stores'
import { SectionLabel, Input } from '/src/components'

import { Wrapper } from './templatesStyle'

const Templates = () => {
  const templates = useTemplatesStore(s => s.templates)
  const setTemplate = useTemplateStore(s => s.setTemplate)

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
          <option value={temp._id} key={key}>{temp._id}</option>
        ))}
      </Input>
      </Wrapper>
  </>
}

export default Templates
