import { useState, useRef } from 'react'
import { MousePointer2, Hand, MessageSquare, Circle, ArrowUpRight, ChevronDown } from 'lucide-react'

import { useToolStore } from '/src/stores'
import { Dropdown } from '/src/components'
import { Sidebar } from '../../components'

const tools = [
  {
    label: 'Cursor',
    value: 'cursor',
    icon: <MousePointer2 />,
  },
  {
    label: 'Hand',
    value: 'hand',
    icon: <Hand />,
  },
  {
    label: 'State',
    value: 'state',
    icon: <Circle />,
  },
  {
    label: 'Transition',
    value: 'transition',
    icon: <ArrowUpRight />,
  },
  {
    label: 'Comment',
    value: 'comment',
    icon: <MessageSquare />,
  },
]

const Toolbar = () => {
  const { tool, setTool } = useToolStore()
  const zoomButtonRect = useRef()
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false)

  return (
    <Sidebar $tools>
      {tools.map(toolOption => (
        <Sidebar.Button
          key={toolOption.label}
          onClick={() => setTool(toolOption.value)}
          $active={tool === toolOption.value}
        >
          {toolOption.icon}
        </Sidebar.Button>
      ))}

      <div style={{ flex: 1 }} />

      <Sidebar.Button
        style={{
          aspectRatio: 'initial',
          fontSize: '.9em',
          padding: '.8em 0',
        }}
        onClick={() => setZoomMenuOpen(true)}
        ref={r => zoomButtonRect.current = r?.getBoundingClientRect()}
        $active={zoomMenuOpen}
      >
        <span>100%</span>
        <ChevronDown size="1.1em" />
      </Sidebar.Button>

      <Dropdown
        visible={zoomMenuOpen}
        style={{
          left: `${zoomButtonRect.current?.x + zoomButtonRect.current?.width + 4}px`,
          bottom: 0,
        }}
        onClose={() => setZoomMenuOpen(false)}
        items={[
          {
            label: 'Zoom in',
            shortcut: '⌘ =',
            onClick: () => {},
          },
          {
            label: 'Zoom out',
            shortcut: '⌘ -',
            onClick: () => {},
          },
          {
            label: 'Zoom to 100%',
            shortcut: '⌘ 0',
            onClick: () => {},
          },
          {
            label: 'Zoom to fit',
            shortcut: '⇧ 1',
            onClick: () => {},
          },
          'hr',
          {
            label: 'Fullscreen',
            shortcut: 'F11',
            onClick: () => {},
          },
        ]}
      />
    </Sidebar>
  )
}

export default Toolbar
