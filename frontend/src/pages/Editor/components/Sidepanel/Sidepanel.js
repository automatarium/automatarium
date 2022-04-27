import { useState } from 'react'
import { ChevronRight, FlaskConical, Info, Settings2 } from 'lucide-react'

import { Sidebar } from '..'

import { Wrapper, Panel, Heading, CloseButton } from './sidepanelStyle'
import { TestingLab } from './Panels'

const panels = [
  {
    label: 'Testing Lab',
    value: 'test',
    icon: <FlaskConical />,
    element: <TestingLab />,
  },
  {
    label: 'About Your Automaton',
    value: 'about',
    icon: <Info />,
  },
  {
    label: 'File Options',
    value: 'options',
    icon: <Settings2 />,
  },
]

const Sidepanel = () => {
  const [activePanel, setActivePanel] = useState()

  return (
    <Wrapper>
      {activePanel && (
        <>
          <CloseButton
            onClick={() => setActivePanel(undefined)}
          ><ChevronRight /></CloseButton>
          <Panel>
            <Heading>{activePanel?.label}</Heading>
            {activePanel?.element}
          </Panel>
        </>
      )}

      <Sidebar>
        {panels.map(panel => (
          <Sidebar.Button
            key={panel.value}
            onClick={() => setActivePanel(activePanel?.value === panel.value ? undefined : panel)}
            $active={activePanel?.value === panel.value}
            title={panel.label}
          >
            {panel.icon}
          </Sidebar.Button>
        ))}
      </Sidebar>
    </Wrapper>
  )
}

export default Sidepanel
