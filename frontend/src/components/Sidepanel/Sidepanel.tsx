import { ReactNode, useState, useEffect } from 'react'
import { ChevronRight, FlaskConical, Pause, Info as InfoIcon, Settings2, Star } from 'lucide-react'

import { Sidebar } from '..'
import { useEvent } from '/src/hooks'

import { Wrapper, Panel, Heading, CloseButton } from './sidepanelStyle'
import { TestingLab, SteppingLab, Info, Options, Templates } from './Panels'
import { SidebarButton } from '/src/components/Sidebar/Sidebar'
import { stopTemplateInsert } from './Panels/Templates/Templates'

import { useTemplateStore, useToolStore, useProjectStore } from '/src/stores'

import { dispatchCustomEvent } from '/src/util/events'

type PanelItem = {
  label: string
  value: string
  icon: ReactNode
  element: ReactNode
}

const panels: PanelItem[] = [
  {
    label: 'Testing Lab',
    value: 'test',
    icon: <FlaskConical />,
    element: <TestingLab />
  },
  {
    label: 'Stepping Lab',
    value: 'step',
    icon: <Pause />,
    element: <SteppingLab />
  },
  {
    label: 'About Your Automaton',
    value: 'about',
    icon: <InfoIcon />,
    element: <Info />
  },
  {
    label: 'File Options',
    value: 'options',
    icon: <Settings2 />,
    element: <Options />
  },
  {
    label: 'Templates (Beta)',
    value: 'templates',
    icon: <Star />,
    element: <Templates />
  }
]

const Sidepanel = () => {
  const [activePanel, setActivePanel] = useState<PanelItem>()
  const setTemplate = useTemplateStore(s => s.setTemplate)
  const setTool = useToolStore(s => s.setTool)

  const projectType = useProjectStore(s => s.project.config.type)

  // Open panel via event
  useEvent('sidepanel:open', e => {
    const panel = panels.find(p => p.value === e.detail.panel)
    setActivePanel(activePanel?.value === panel.value ? undefined : panel)
  }, [activePanel])

  // Show bottom panel with TM Tape Lab (can make other effects for other project types if
  // the bottom panel wants to be used for something else)
  useEffect(() => {
    if (projectType === 'TM' && activePanel?.value === 'test') {
      dispatchCustomEvent('bottomPanel:open', { panel: 'tmTape' })
    } else {
      dispatchCustomEvent('bottomPanel:close', null)
    }
  }, [activePanel])

  return (
    <Wrapper>
      {activePanel && (
        <>
          <CloseButton
            onClick={() => {
              setActivePanel(undefined)
              stopTemplateInsert(setTemplate, setTool)
            }}
          ><ChevronRight /></CloseButton>
          <Panel>
            <div>
              <Heading>{activePanel?.label}</Heading>
              {activePanel?.element}
            </div>
          </Panel>
        </>
      )}

      <Sidebar>
        {panels.map(panel => (
          <SidebarButton
            key={panel.value}
            onClick={() => {
              setActivePanel(activePanel?.value === panel.value ? undefined : panel)
              stopTemplateInsert(setTemplate, setTool)
            }}
            $active={activePanel?.value === panel.value}
            title={panel.label}
          >
            {panel.icon}
          </SidebarButton>
        ))}
      </Sidebar>
    </Wrapper>
  )
}

export default Sidepanel
