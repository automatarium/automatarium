import { useState } from 'react'
import { FlaskConical, Info, Settings2 } from 'lucide-react'

import { Sidebar } from '..'

import { Wrapper, Panel } from './sidepanelStyle'

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
          Mr Sidepanel
        </Panel>
      )}

      <Sidebar>
        {panels.map(panel => (
          <Sidebar.Button
            key={panel.label}
            onClick={() => setActivePanel(activePanel === panel.label ? undefined : panel.label)}
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