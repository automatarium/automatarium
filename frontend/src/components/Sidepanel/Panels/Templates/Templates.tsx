import { useTemplatesStore, useTemplateStore, useSelectionStore, useProjectStore, useToolStore } from '/src/stores'
import { SectionLabel, Input, Button, ProjectCard } from '/src/components'
import { CardList } from '/src/pages/NewFile/components'
import { selectionToCopyTemplate } from '/src/hooks/useActions'
import { Plus, AlertTriangle } from 'lucide-react'
import dayjs from 'dayjs'

import { Wrapper } from './templatesStyle'
import { Description } from '/src/components/Preference/preferenceStyle'
import React, { useState } from 'react'
import { Template } from '/src/types/ProjectTypes'
import { TEMPLATE_THUMBNAIL_WIDTH } from '/src/config/rendering'
import { WarningLabel } from '../TestingLab/testingLabStyle'
import { Tool } from '/src/stores/useToolStore'

export const stopTemplateInsert = (setTemplate: (template: Template) => void, setTool: (tool: Tool) => void) => {
  setTemplate(null)
  setTool('cursor')
}

const Templates = () => {
  const project = useProjectStore(s => s.project)
  const templates = (useTemplatesStore(s => s.templates)).filter(temp => temp.projectType === project.projectType)
  const addTemplate = useTemplatesStore(s => s.upsertTemplate)
  const setTemplate = useTemplateStore(s => s.setTemplate)
  const template = useTemplateStore(s => s.template)
  const selectedStatesIds = useSelectionStore(s => s.selectedStates)
  const selectedCommentsIds = useSelectionStore(s => s.selectedComments)
  const selectedTransitionsIds = useSelectionStore(s => s.selectedTransitions)
  const setTool = useToolStore(s => s.setTool)

  const [templateNameInput, setTemplateNameInput] = useState('')
  const [error, setError] = useState('')

  const pickTemplate = (id: string) => {
    // Deselect if template already selected
    if (template !== null && template._id === id) {
      stopTemplateInsert(setTemplate, setTool)
      return
    }
    // If template isn't yet selected, select it
    setTemplate(templates.find(template => template._id === id))
    setTool(null)
  }

  const createTemplate = () => {
    const templateName = templateNameInput
    // Show errors
    if (selectedStatesIds.length === 0 && selectedCommentsIds.length === 0 && selectedTransitionsIds.length === 0) {
      setError('Please select states and/or transitions before clicking "Add".')
      return
    }
    if (templateName === '') {
      setError('Template name cannot be empty.')
      return
    }
    if (templates.map(temp => temp.name).includes(templateName)) {
      setError(`A template named '${templateName}' already exists. Please choose another name.`)
      return
    }
    const temp = selectionToCopyTemplate(selectedStatesIds, selectedCommentsIds, selectedTransitionsIds, project)
    const newTemplate = temp as Template
    // Set template attributes
    newTemplate._id = crypto.randomUUID()
    newTemplate.name = templateName
    newTemplate.date = new Date().getTime()
    addTemplate(newTemplate)
    setTemplateNameInput('')
    setError('')
  }

  return <>
    <SectionLabel>Create a Template</SectionLabel>
      {error !== '' && <>
        <WarningLabel>
          <AlertTriangle />
          {error}
        </WarningLabel>
      </>}
      <Wrapper>
        <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTemplateNameInput(e.target.value)
              setError('')
            }}
            value={templateNameInput}
            placeholder="Name your template"
          />
          <Button
          icon={<Plus />}
          onClick={createTemplate}>Add</Button>
          <Description>Template is created from selected states and transitions</Description>
      </Wrapper>
    {/* TODO: Add tooltip explaining how to insert templates */}
    <SectionLabel>Insert Templates</SectionLabel>
      <Wrapper>
          <CardList title='' style={{ gap: '1em 1em' }}>
            {templates.sort((a, b) => b.date - a.date).map((temp) => (
              <ProjectCard
                key={temp._id}
                name={temp.name}
                date={dayjs(temp.date)}
                width={TEMPLATE_THUMBNAIL_WIDTH}
                $istemplate={true}
                isSelectedTemplate={template && template._id === temp._id}
                onClick={() => pickTemplate(temp._id)}
              />
            ))}
          </CardList>
      </Wrapper>
  </>
}

export default Templates
