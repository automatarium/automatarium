import { ReactNode, useState } from 'react'
import { ChevronRight, FlaskConical, Pause, Info as InfoIcon, Settings2, Star } from 'lucide-react'

import { Sidebar } from '..'
import { useEvent } from '/src/hooks'

import { Wrapper, Panel, Heading, CloseButton } from './sidepanelStyle'
import { TestingLab, SteppingLab, Info, Options, Templates } from './Panels'
import { SidebarButton } from '/src/components/Sidebar/Sidebar'

import { useTemplateStore } from '/src/stores'

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
    label: 'Templates',
    value: 'templates',
    icon: <Star />,
    element: <Templates />
  }
]

const Sidepanel = () => {
  const [activePanel, setActivePanel] = useState<PanelItem>()
  const setTemplate = useTemplateStore(s => s.setTemplate)

  // Open panel via event
  useEvent('sidepanel:open', e => {
    const panel = panels.find(p => p.value === e.detail.panel)
    setActivePanel(activePanel?.value === panel.value ? undefined : panel)
  }, [activePanel])

  return (
    <Wrapper>
      {activePanel && (
        <>
          <CloseButton
            onClick={() => { 
              setActivePanel(undefined)
              // Stop template insertion mode
              setTemplate(null)
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
            onClick={() => setActivePanel(activePanel?.value === panel.value ? undefined : panel)}
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
