import { useState } from 'react'
import { ChevronRight, FlaskConical, Pause, Info as InfoIcon, Settings2 } from 'lucide-react'

import { Sidebar } from '..'
import { useEvent } from '/src/hooks'

import { Wrapper, Panel, Heading, CloseButton } from './bottomPanelStyle'
import { TMTapeLab } from './Panels'
import TMTapeLab from "./Panels/TMTapeLab/TMTapeLab";

const panels = [
        {
        label: 'TMTapeLab',
        value: 'tmTape',
        // icon: <FlaskConical />,
        element: <TMTapeLab />
        }
    ]

const BottomPanel = () => {
    const [activePanel, setActivePanel] = useState()

    // Open panel via event
    useEvent('bottomPanel:open', e => {
        const panel = panels.find(p => p.value === e.detail.panel)
        setActivePanel(activePanel?.value === panel.value ? undefined : panel)
    }, [activePanel])

    use

    return (
        <Wrapper>
            {activePanel && (
                <>
                    <Panel>
                        <div>
                            <Heading>{activePanel?.label}</Heading>
                            {activePanel?.element}
                        </div>
                    </Panel>
                </>
            )}

            {/*<Sidebar>*/}
            {/*    {panels.map(panel => (*/}
            {/*        <Sidebar.Button*/}
            {/*            key={panel.value}*/}
            {/*            onClick={() => setActivePanel(activePanel?.value === panel.value ? undefined : panel)}*/}
            {/*            $active={activePanel?.value === panel.value}*/}
            {/*            title={panel.label}*/}
            {/*        >*/}
            {/*            {panel.icon}*/}
            {/*        </Sidebar.Button>*/}
            {/*    ))}*/}
            {/*</Sidebar>*/}
        </Wrapper>
    )
}

export default BottomPanel
