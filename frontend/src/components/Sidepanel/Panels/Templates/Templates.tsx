import { useTemplatesStore, useTemplateStore, useSelectionStore, useProjectStore } from '/src/stores'
import { SectionLabel, Input, Button, Preference } from '/src/components'
import { selectionToCopyTemplate } from '/src/hooks/useActions'
import { Plus } from 'lucide-react'

import { Wrapper } from './templatesStyle'
import { Description } from '/src/components/Preference/preferenceStyle'
import React, { useState } from 'react'
import { Template } from '/src/types/ProjectTypes'

const Templates = () => {
  const templates = useTemplatesStore(s => s.templates)
  const clearTemplates = useTemplatesStore(s => s.clearTemplates)
  const addTemplate = useTemplatesStore(s => s.upsertTemplate)
  const setTemplate = useTemplateStore(s => s.setTemplate)
  const selectedStatesIds = useSelectionStore(s => s.selectedStates)
  const selectedCommentsIds = useSelectionStore(s => s.selectedComments)
  const project = useProjectStore(s => s.project)
  const selectedTransitionsIds = useSelectionStore(s => s.selectedTransitions)

  const [templateNameInput, setTemplateNameInput] = useState('')

  const pickTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value
    const newTemplate = templates.find(template => template._id === id)
    setTemplate(newTemplate)
  }

  const createTemplate = () => {
    const templateName = templateNameInput
    if (selectedStatesIds.length === 0 && selectedCommentsIds.length === 0 && selectedTransitionsIds.length === 0) {
      // Temporary UI
      alert('Nothing selected, cannot make template')
      return
    }
    const temp = selectionToCopyTemplate(selectedStatesIds, selectedCommentsIds, selectedTransitionsIds, project)
    const newTemplate = temp as Template
    newTemplate._id = crypto.randomUUID()
    newTemplate.name = templateName
    addTemplate(newTemplate)
    setTemplateNameInput('')
  }

  return <>
    <SectionLabel>Create a Template</SectionLabel>
      <Wrapper>
        <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTemplateNameInput(e.target.value)
            }}
            value={templateNameInput}
            placeholder="Name your template"
          />
          <Button
          icon={<Plus />}
          onClick={createTemplate}>Add</Button>
          <Description>Template is created from selected states and transitions</Description>
      </Wrapper>
    <SectionLabel>Your Templates</SectionLabel>
      <Wrapper>
        <Button
          onClick={() => {
            console.log(templates)
          }
          }>Templates</Button>
      </Wrapper>
  </>
}

export default Templates
