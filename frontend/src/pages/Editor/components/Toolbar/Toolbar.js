import { useState, useRef } from 'react'

import { MousePointer2, Hand, MessageSquare, Circle, ChevronDown } from 'lucide-react'

import { Sidebar } from '../../components'
import { Dropdown } from '/src/components'

const tools = [
  {
    label: 'Cursor',
    icon: <MousePointer2 />,
  },
  {
    label: 'Hand',
    icon: <Hand />,
  },
  {
    label: 'Transition',
    icon: <Circle />,
  },
  {
    label: 'Comment',
    icon: <MessageSquare />,
  },
]

const Toolbar = ({
  onChange,
  value,
}) => {
  const zoomButtonRect = useRef()
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false)

  useEffect

  return (
    <Sidebar $tools>
      {tools.map(tool => (
        <Sidebar.Button
          key={tool.label}
          onClick={() => onChange(tool.label)}
          $active={value === tool.label}
        >
          {tool.icon}
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