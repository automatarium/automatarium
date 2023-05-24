import { ReactNode, useState, useEffect } from 'react'
import { ChevronRight, FlaskConical, Pause, Info as InfoIcon, Settings2 } from 'lucide-react'

import { Sidebar } from '..'
import { useEvent } from '/src/hooks'
import { useProjectStore } from '/src/stores'

import { Wrapper, Panel, Heading, CloseButton } from './sidepanelStyle'
import { TestingLab, SteppingLab, Info, Options } from './Panels'
import { SidebarButton } from '/src/components/Sidebar/Sidebar'

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
  }
]

const Sidepanel = () => {
  const [activePanel, setActivePanel] = useState<PanelItem>()
  const [showTuringTape, setShowTuringTape] = useState(false)

  const projectType = useProjectStore(s => s.project.config.type)

  // Open panel via event
  useEvent('sidepanel:open', e => {
    const panel = panels.find(p => p.value === e.detail.panel)
    setActivePanel(activePanel?.value === panel.value ? undefined : panel)
    setShowTuringTape(true)
  }, [activePanel])

  useEffect(() => {
    if (activePanel === undefined) {
      setShowTuringTape(false)
    }
  }, [activePanel])

  // Show bottom panel with TM Tape Lab
  useEffect(() => {
    if (projectType === 'TM') {
      if (showTuringTape) {
        dispatchCustomEvent('bottomPanel:open', { panel: 'tmTape' })
      } else {
        dispatchCustomEvent('bottomPanel:close', null)
      }
    }
  }, [showTuringTape])

  return (
    <Wrapper>
      {activePanel && (
        <>
          <CloseButton
            onClick={() => setActivePanel(undefined)}
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
