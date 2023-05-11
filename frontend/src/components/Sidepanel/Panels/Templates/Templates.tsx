import { useTemplatesStore, useTemplateStore, useSelectionStore, useProjectStore } from '/src/stores'
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

import { showWarning } from '/src/components/Warning/Warning'


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
  const [error, setError] = useState('')

  // clearTemplates()

  const pickTemplate = (id: string, e: MouseEvent) => {
    // Deselect if template already selected
    const thumbnailContainer = e.currentTarget as HTMLElement
    const thumbnail = thumbnailContainer.children[0] as HTMLElement
    if(template!== null && template._id === id) {
      setTemplate(null)
      thumbnail.style.boxShadow = ''
      return
    }
    // If template isn't yet selected, select it
    setTemplate(templates.find(template => template._id === id))
    thumbnail.style.boxShadow = '0 0 0 3px var(--primary)'
  }

  const createTemplate = () => {
    const templateName = templateNameInput
    // Show error if nothing selected
    if (selectedStatesIds.length === 0 && selectedCommentsIds.length === 0 && selectedTransitionsIds.length === 0) {
      setError("Please select states and/or transitions before clicking 'Add'")
      return
    }
    if (templateName === '') {
      setError("Template name cannot be empty.")
      return
    }
    if(templates.map(temp => temp.name).includes(templateName)) {
      setError(`A template named '${templateName}' already exists. Please choose another name.`)
      return
    }
    // Check that name isn't already taken
    const temp = selectionToCopyTemplate(selectedStatesIds, selectedCommentsIds, selectedTransitionsIds, project)
    const newTemplate = temp as Template
    newTemplate._id = crypto.randomUUID()
    newTemplate.name = templateName
    newTemplate.date = new Date().getTime()
    addTemplate(newTemplate)
    setTemplateNameInput('')
    setError('')
  }

  const removeBorder = (e: FocusEvent) => {
    const thumbnailContainer = e.currentTarget as HTMLElement
    const thumbnail = thumbnailContainer.children[0] as HTMLElement
    thumbnail.style.boxShadow = ''
  }

  const deleteTemplate = (e: KeyboardEvent) => {
    if(e.key === 'a') {
      console.log("Deleting")
    }
  }

  return <>
    <SectionLabel>Create a Template</SectionLabel>
    {/* TODO: Add tooltip */}
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
    <SectionLabel>Insert Templates</SectionLabel>
      <Wrapper>
          <CardList title='' style={{ gap: '1em 1em' }}>
            {templates.sort((a, b) => b.date - a.date).map((temp) => (
              <ProjectCard
                key={temp._id}
                name={temp.name}
                date={dayjs(temp.date)}
                projectId={temp.projectSource}
                width={TEMPLATE_THUMBNAIL_WIDTH}
                istemplate='true'
                showKebab={false}
                isSelectedTemplate={template && template._id === temp._id}
                onClick={(e: MouseEvent) => pickTemplate(temp._id, e)}
                onBlur={(e: FocusEvent) => { 
                  if(e.relatedTarget !== null) {
                    removeBorder(e)
                  }
                }}
                onKeyPress={(e: KeyboardEvent) => deleteTemplate(e)}
              />
            ))}
          </CardList>
      </Wrapper>
  </>
}

export default Templates
