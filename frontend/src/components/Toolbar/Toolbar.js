import { useState, useRef } from 'react'
import { MousePointer2, Hand, MessageSquare, Circle, ArrowUpRight, ChevronDown } from 'lucide-react'

import { useToolStore } from '/src/stores'
import { Dropdown } from '/src/components'
import { Sidebar } from '/src/components'
import useViewStore from '/src/stores/useViewStore'

import { ToolPopup, ToolName, ToolHotkey } from './toolbarStyle'

const tools = [
  {
    label: 'Cursor tool',
    hotkey: 'V',
    description: 'Select and move items',
    value: 'cursor',
    icon: <MousePointer2 />,
  },
  {
    label: 'Hand tool',
    hotkey: 'H',
    description: 'Drag to pan around your automaton',
    value: 'hand',
    icon: <Hand />,
  },
  {
    label: 'State tool',
    hotkey: 'S',
    description: 'Create states by clicking',
    value: 'state',
    icon: <Circle />,
  },
  {
    label: 'Transition tool',
    hotkey: 'T',
    description: 'Drag between states to create transitions',
    value: 'transition',
    icon: <ArrowUpRight />,
  },
  {
    label: 'Comment tool',
    hotkey: 'C',
    description: 'Add comments to your automaton',
    value: 'comment',
    icon: <MessageSquare />,
  },
]

const Toolbar = () => {
  const { tool, setTool } = useToolStore()
  const zoomButtonRect = useRef()
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false)
  const viewScale = useViewStore(s => s.scale)
  const [toolPopup, setToolPopup] = useState({})
  const toolPopupHover = useRef({})

  return (
    <Sidebar $tools>
      {tools.map(toolOption => (
        <Sidebar.Button
          key={toolOption.label}
          onClick={() => setTool(toolOption.value)}
          $active={tool === toolOption.value}
          onMouseEnter={e => {
            toolPopupHover.current = { ...toolPopupHover.current, value: toolOption.value }
            window.setTimeout(() => {
              if (toolPopupHover.current.value !== toolOption.value) return
              const box = e.target.getBoundingClientRect()
              setToolPopup({ visible: true, y: box.y, tool: tools.find(t => t.value === toolOption.value) })
            }, toolPopupHover.current.timeout || 1000)
          }}
          onMouseLeave={e => {
            toolPopupHover.current = { value: undefined, timeout: (e.relatedTarget.tagName === 'BUTTON' && toolPopup.visible) && 10 }
            setToolPopup({ ...toolPopup, visible: false })
          }}
        >
          {toolOption.icon}
        </Sidebar.Button>
      ))}

      <ToolPopup $y={toolPopup.y} className={toolPopup.visible ? 'visible' : ''}>
        {/* <img src={toolPopup.tool?.image} alt="" /> TODO: animated image */}
        <div>
          <ToolName>
            <span>{toolPopup.tool?.label}</span>
            <ToolHotkey>{toolPopup.tool?.hotkey}</ToolHotkey>
          </ToolName>
          <span>{toolPopup.tool?.description}</span>
        </div>
      </ToolPopup>

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
            action: 'FULLSCREEN',
          },
        ]}
      />
    </Sidebar>
  )
}

export default Toolbar
