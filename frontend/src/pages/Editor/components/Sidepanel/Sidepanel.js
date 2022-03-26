import { useState } from 'react'
import { FlaskConical, Info, Settings2 } from 'lucide-react'

import { Sidebar } from '..'

import { Wrapper, Panel } from './sidepanelStyle'
import TestingLab from './Panels/TestingLab/TestingLab'

const panels = [
  {
    label: 'Testing Lab',
    icon: <FlaskConical />,
  },
  {
    label: 'About Your Automaton',
    icon: <Info />,
  },
  {
    label: 'File Options',
    icon: <Settings2 />,
  },
]

const Sidepanel = () => {
  const [activePanel, setActivePanel] = useState()

  return (
    <Wrapper>
      {activePanel && (
        <Panel>
          {activePanel == 'Testing Lab' && <TestingLab/>}
        </Panel>
      )}

      <Sidebar>
        {panels.map(panel => (
          <Sidebar.Button
            key={panel.label}
            onClick={() => {
              setActivePanel(activePanel === panel.label ? undefined : panel.label)
              console.log(activePanel)
            }}
            $active={activePanel === panel.label}
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