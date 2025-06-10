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
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

interface ToolItem {
  label: string
  hotkey: string
  description: string
  value: Tool
  icon: ReactNode
  animation: object
}

type TranslatableToolItems = (t: TFunction) => ToolItem[]

const tools: TranslatableToolItems = (t: TFunction) => [
  {
    label: t('tools.cursor'),
    hotkey: 'V',
    description: t('tools.cursor_desc'),
    value: 'cursor',
    icon: <MousePointer2 />,
    animation: cursorAnimation
  },
  {
    label: t('tools.hand'),
    hotkey: 'H',
    description: t('tools.hand_desc'),
    value: 'hand',
    icon: <Hand />,
    animation: handAnimation
  },
  {
    label: t('tools.state'),
    hotkey: 'S',
    description: t('tools.state_desc'),
    value: 'state',
    icon: <Circle />,
    animation: stateAnimation
  },
  {
    label: t('tools.transition'),
    hotkey: 'T',
    description: t('tools.transition_desc'),
    value: 'transition',
    icon: <ArrowUpRight />,
    animation: transitionAnimation
  },
  {
    label: t('tools.comment'),
    hotkey: 'C',
    description: t('tools.comment_desc'),
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
  const { t } = useTranslation('common')

  return (
    <Sidebar $tools>
      {tools(t).map(toolOption => (
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
              setToolPopup({ visible: true, y: box.y, tool: tools(t).find(t => t.value === toolOption.value) })
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
            label: t('menus.zoom_in'),
            action: 'ZOOM_IN'
          },
          {
            label: t('menus.zoom_out'),
            action: 'ZOOM_OUT'
          },
          {
            label: t('menus.zoom_100'),
            action: 'ZOOM_100'
          },
          {
            label: t('menus.zoom_fit'),
            action: 'ZOOM_FIT'
          },
          'hr',
          {
            label: t('menus.fullscreen'),
            shortcut: 'F11',
            action: 'FULLSCREEN'
          }
        ]}
      />
    </Sidebar>
  )
}

export default Toolbar
