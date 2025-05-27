import { useState, useRef, ReactNode } from 'react'
import { MousePointer2, Hand, MessageSquare, Circle, ArrowUpRight, ChevronDown } from 'lucide-react'
import Lottie from 'react-lottie-player/dist/LottiePlayerLight'

import { useToolStore, useTemplateStore } from '/src/stores'
import { Dropdown, Sidebar } from '/src/components'
import useViewStore from '/src/stores/useViewStore'

import { ToolPopup, ToolName, ToolHotkey, Animation } from './toolbarStyle'

import cursorAnimation from './animations/cursor.json'
import handAnimation from './animations/hand.json'
import stateAnimation from './animations/state.json'
import transitionAnimation from './animations/transition.json'
import commentAnimation from './animations/comment.json'
import { SidebarButton } from '../Sidebar/Sidebar'
import { Tool } from '/src/stores/useToolStore'

interface ToolItem {
  label: string
  hotkey: string
  description: string
  value: Tool
  icon: ReactNode
  animation: object
}

const tools: ToolItem[] = [
  {
    label: 'Cursor tool',
    hotkey: 'V',
    description: 'Select and move items',
    value: 'cursor',
    icon: <MousePointer2 />,
    animation: cursorAnimation
  },
  {
    label: 'Hand tool',
    hotkey: 'H',
    description: 'Drag to pan around your automaton',
    value: 'hand',
    icon: <Hand />,
    animation: handAnimation
  },
  {
    label: 'State tool',
    hotkey: 'S',
    description: 'Create states by clicking',
    value: 'state',
    icon: <Circle />,
    animation: stateAnimation
  },
  {
    label: 'Transition tool',
    hotkey: 'T',
    description: 'Drag between states to create transitions',
    value: 'transition',
    icon: <ArrowUpRight />,
    animation: transitionAnimation
  },
  {
    label: 'Comment tool',
    hotkey: 'C',
    description: 'Add comments to your automaton',
    value: 'comment',
    icon: <MessageSquare />,
    animation: commentAnimation
  }
]

type ToolHoverType = {value?: string, timeout?: number, visible: boolean}
type ToolPopupType = {visible: boolean, y: number, tool: ToolItem}

const Toolbar = () => {
  const { tool, setTool } = useToolStore()
  const setTemplate = useTemplateStore(s => s.setTemplate)
  const zoomButtonRect = useRef<DOMRect>()
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false)
  const viewScale = useViewStore(s => s.scale)
  const [toolPopup, setToolPopup] = useState<ToolPopupType>({} as ToolPopupType)
  const toolPopupHover = useRef<ToolHoverType>({} as ToolHoverType)

  return (
    <Sidebar $tools>
      {tools.map(toolOption => (
        <SidebarButton
          key={toolOption.label}
          onClick={() => {
            setTool(toolOption.value)
            setTemplate(null)
          }}
          $active={tool === toolOption.value}
          onMouseEnter={e => {
            toolPopupHover.current = { ...toolPopupHover.current, value: toolOption.value }
            window.setTimeout(() => {
              if (toolPopupHover.current.value !== toolOption.value) return
              const box = (e.target as HTMLElement).getBoundingClientRect()
              setToolPopup({ visible: true, y: box.y, tool: tools.find(t => t.value === toolOption.value) })
            }, toolPopupHover.current.timeout || 1000)
          }}
          onMouseLeave={e => {
            toolPopupHover.current = { value: undefined, timeout: ((e.relatedTarget as HTMLElement).tagName === 'BUTTON' && toolPopup.visible) && 10 } as ToolHoverType
            setToolPopup({ ...toolPopup, visible: false })
          }}
        >
          {toolOption.icon}
        </SidebarButton>
      ))}

      <ToolPopup $y={toolPopup.y} className={toolPopup.visible ? 'visible' : ''}>
        {!!toolPopup.tool?.animation && (
          <Animation>
            <Lottie loop animationData={toolPopup.tool.animation} play={toolPopup.visible} />
          </Animation>
        )}
        <div>
          <ToolName>
            <span>{toolPopup.tool?.label}</span>
            <ToolHotkey>{toolPopup.tool?.hotkey}</ToolHotkey>
          </ToolName>
          <span>{toolPopup.tool?.description}</span>
        </div>
      </ToolPopup>

      <div style={{ flex: 1 }} />

      <SidebarButton
        style={{
          aspectRatio: 'initial',
          fontSize: '.9em',
          padding: '.8em 0'
        }}
        onClick={e => { setZoomMenuOpen(true); e.stopPropagation() }}
        ref={r => {
          zoomButtonRect.current = r?.getBoundingClientRect()
          return zoomButtonRect.current
        }}
        $active={zoomMenuOpen}
      >
        <span>{Math.floor(1 / viewScale * 100)}%</span>
        <ChevronDown size="1.1em" />
      </SidebarButton>

      <Dropdown
        visible={zoomMenuOpen}
        style={{
          left: `${zoomButtonRect.current?.x + zoomButtonRect.current?.width + 4}px`,
          bottom: 0
        }}
        onClose={() => setZoomMenuOpen(false)}
        items={[
          {
            label: 'Zoom in',
            action: 'ZOOM_IN'
          },
          {
            label: 'Zoom out',
            action: 'ZOOM_OUT'
          },
          {
            label: 'Zoom to 100%',
            action: 'ZOOM_100'
          },
          {
            label: 'Zoom to fit',
            action: 'ZOOM_FIT'
          },
          'hr',
          {
            label: 'Toggle Fullscreen',
            shortcut: 'F11',
            action: 'FULLSCREEN'
          }
        ]}
      />
    </Sidebar>
  )
}

export default Toolbar
