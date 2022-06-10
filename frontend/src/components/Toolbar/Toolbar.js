import { useState, useRef } from 'react'
import { MousePointer2, Hand, MessageSquare, Circle, ArrowUpRight, ChevronDown } from 'lucide-react'

import { useToolStore } from '/src/stores'
import { Dropdown } from '/src/components'
import { Sidebar } from '/src/components'
import useViewStore from '/src/stores/useViewStore'

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
  const viewScale = useViewStore(s => s.scale)

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
        onClick={e => { setZoomMenuOpen(true); e.stopPropagation() }}
        ref={r => zoomButtonRect.current = r?.getBoundingClientRect()}
        $active={zoomMenuOpen}
      >
        <span>{Math.floor(1/viewScale * 100)}%</span>
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
            action: 'ZOOM_IN',
          },
          {
            label: 'Zoom out',
            action: 'ZOOM_OUT',
          },
          {
            label: 'Zoom to 100%',
            action: 'ZOOM_100',
          },
          {
            label: 'Zoom to fit',
            action: 'ZOOM_FIT',
          },
          'hr',
          {
            label: 'Fullscreen',
            shortcut: 'F11',
          },
        ]}
      />
    </Sidebar>
  )
}

export default Toolbar
