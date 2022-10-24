import { useState, useRef } from 'react'
import { MousePointer2, Hand, MessageSquare, Circle, ArrowUpRight, ChevronDown, Skull } from 'lucide-react'
import Lottie from 'react-lottie-player/dist/LottiePlayerLight'

import { useToolStore } from '/src/stores'
import { Dropdown } from '/src/components'
import { Sidebar } from '/src/components'
import useViewStore from '/src/stores/useViewStore'

import { ToolPopup, ToolName, ToolHotkey, Animation } from './toolbarStyle'

import cursorAnimation from './animations/cursor.json'
import handAnimation from './animations/hand.json'
import stateAnimation from './animations/state.json'
import transitionAnimation from './animations/transition.json'
import commentAnimation from './animations/comment.json'
import deleteAnimation from './animations/delete.json'

const tools = [
  {
    label: 'Cursor tool',
    hotkey: 'V',
    description: 'Select and move items',
    value: 'cursor',
    icon: <MousePointer2 />,
    animation: cursorAnimation,
  },
  {
    label: 'Hand tool',
    hotkey: 'H',
    description: 'Drag to pan around your automaton',
    value: 'hand',
    icon: <Hand />,
    animation: handAnimation,
  },
  {
    label: 'State tool',
    hotkey: 'S',
    description: 'Create states by clicking',
    value: 'state',
    icon: <Circle />,
    animation: stateAnimation,
  },
  {
    label: 'Transition tool',
    hotkey: 'T',
    description: 'Drag between states to create transitions',
    value: 'transition',
    icon: <ArrowUpRight />,
    animation: transitionAnimation,
  },
  {
    label: 'Comment tool',
    hotkey: 'C',
    description: 'Add comments to your automaton',
    value: 'comment',
    icon: <MessageSquare />,
    animation: commentAnimation,
  },
  {
    label: 'Delete tool',
    hotkey: 'D', 
    description: 'Delete states, transitions and comments from your automaton',
    value: 'delete',
    icon: <Skull />,
    animation: deleteAnimation,
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
