import { useTemplatesStore, useTemplateStore, useSelectionStore, useProjectStore } from '/src/stores'
import { SectionLabel, Input, Button, ProjectCard } from '/src/components'
import { CardList } from '/src/pages/NewFile/components'
import { selectionToCopyTemplate } from '/src/hooks/useActions'
import { Plus } from 'lucide-react'
import dayjs from 'dayjs'

import { Wrapper } from './templatesStyle'
import { Description } from '/src/components/Preference/preferenceStyle'
import React, { useState } from 'react'
import { Template } from '/src/types/ProjectTypes'
import { TEMPLATE_THUMBNAIL_WIDTH } from '/src/config/rendering'


const Templates = () => {
  const project = useProjectStore(s => s.project)
  const templates = (useTemplatesStore(s => s.templates)).filter(temp => temp.projectType === project.projectType)
  const clearTemplates = useTemplatesStore(s => s.clearTemplates)
  const addTemplate = useTemplatesStore(s => s.upsertTemplate)
  const setTemplate = useTemplateStore(s => s.setTemplate)
  const template = useTemplateStore(s => s.template)
  const selectedStatesIds = useSelectionStore(s => s.selectedStates)
  const selectedCommentsIds = useSelectionStore(s => s.selectedComments)
  const selectedTransitionsIds = useSelectionStore(s => s.selectedTransitions)

  const [templateNameInput, setTemplateNameInput] = useState('')

  // clearTemplates()

  const pickTemplate = (id: string, e: MouseEvent) => {
    // Deselect if template already selected
    const thumbnailContainer = e.currentTarget as HTMLElement
    const thumbnail = thumbnailContainer.children[0] as HTMLElement
    if(template!== null && template._id === id) {
      setTemplate(null)
      thumbnail.style.boxShadow = 'none'
      return
    }
    // If template isn't yet selected, select it
    setTemplate(templates.find(template => template._id === id))
    thumbnail.style.boxShadow = '0 0 0 3px var(--primary)'
  }

  const createTemplate = () => {
    const templateName = templateNameInput
    if (selectedStatesIds.length === 0 && selectedCommentsIds.length === 0 && selectedTransitionsIds.length === 0) {
      // Temporary UI
      alert("Please select states and/or transitions before clicking 'Add'")
      return
    }
    // TODO: Check name isn't already taken
    const temp = selectionToCopyTemplate(selectedStatesIds, selectedCommentsIds, selectedTransitionsIds, project)
    const newTemplate = temp as Template
    newTemplate._id = crypto.randomUUID()
    newTemplate.name = templateName
    newTemplate.date = new Date().getTime()
    addTemplate(newTemplate)
    setTemplateNameInput('')
  }

  const removeBorder = (e: FocusEvent) => {
    console.log(e.relatedTarget)
    if (e.relatedTarget !== null) {
      const thumbnail = e.target as HTMLElement
      thumbnail.style.boxShadow = 'none'
    }
  }

  return <>
    <SectionLabel>Create a Template</SectionLabel>
    {/* TODO: Add tooltip */}
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
    <SectionLabel>Insert Templates</SectionLabel>
      <Wrapper>
          {/* TODO: Only show projects of relevant type */}
          <CardList title='Your templates' style={{ gap: '1em 1em' }}>
            {templates.sort((a, b) => b.date - a.date).map((temp) => (
              <ProjectCard
                key={temp._id}
                name={temp.name}
                date={dayjs(temp.date)}
                projectId={temp.projectSource}
                width={TEMPLATE_THUMBNAIL_WIDTH}
                isSelectedTemplate={template && template._id === temp._id}
                showKebab={false}
                onClick={(e: MouseEvent) => pickTemplate(temp._id, e)}
                onBlur={(e: FocusEvent) => removeBorder(e)}
              />
            ))}
          </CardList>
      </Wrapper>
  </>
}

export default Templates
