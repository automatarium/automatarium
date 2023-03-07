import { useMemo, Fragment, useState } from 'react'

import { SectionLabel, Modal } from '/src/components'
import { useActions, useEvent } from '/src/hooks'
import { formatHotkey } from '/src/hooks/useActions'

import { Section, Shortcut } from './shortcutGuideStyle'

const shortcuts = [
  {
    title: 'Application',
    items: [
      {
        label: 'Preferences',
        action: 'OPEN_PREFERENCES'
      },
      {
        label: 'Keyboard shortcuts',
        action: 'KEYBOARD_SHORTCUTS'
      }
    ]
  },
  {
    title: 'Tools',
    items: [
      {
        label: 'Cursor tool',
        action: 'TOOL_CURSOR'
      },
      {
        label: 'Hand tool',
        action: 'TOOL_HAND'
      },
      {
        label: 'State tool',
        action: 'TOOL_STATE'
      },
      {
        label: 'Transition tool',
        action: 'TOOL_TRANSITION'
      },
      {
        label: 'Comment tool',
        action: 'TOOL_COMMENT'
      }
    ]
  },
  {
    title: 'File',
    items: [
      {
        label: 'Import Automatarium project',
        action: 'IMPORT_AUTOMATARIUM_PROJECT'
      },
      {
        label: 'Import JFLAP project',
        action: 'IMPORT_JFLAP_PROJECT'
      },
      {
        label: 'Save file',
        action: 'SAVE_FILE'
      },
      {
        label: 'Export as Automatarium project',
        action: 'SAVE_FILE_AS'
      },
      {
        label: 'Export image',
        action: 'EXPORT'
      },
      {
        label: 'Quick export as PNG',
        action: 'EXPORT_AS_PNG'
      },
      {
        label: 'Quick export as SVG',
        action: 'EXPORT_AS_SVG'
      },
      {
        label: 'Quick copy to clipboard',
        action: 'EXPORT_TO_CLIPBOARD'
      }
    ]
  },
  {
    title: 'Edit',
    items: [
      {
        label: 'Undo',
        action: 'UNDO'
      },
      {
        label: 'Redo',
        action: 'REDO'
      },
      {
        label: 'Copy',
        action: 'COPY'
      },
      {
        label: 'Paste',
        action: 'PASTE'
      },
      {
        label: 'Select all',
        action: 'SELECT_ALL'
      },
      {
        label: 'Clear selection',
        action: 'SELECT_NONE'
      },
      {
        label: 'Select multiple',
        hotkeys: [...formatHotkey({ shift: true })]
      },
      {
        label: 'Delete',
        hotkeys: ['⌫']
      }
    ]
  },
  {
    title: 'View',
    items: [
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
      {
        label: 'Fullscreen',
        hotkeys: ['F11']
      },
      {
        label: 'Testing lab',
        action: 'TESTING_LAB'
      },
      {
        label: 'File info',
        action: 'FILE_INFO'
      },
      {
        label: 'File options',
        action: 'FILE_OPTIONS'
      },
      {
        label: 'Move view',
        hotkeys: ['←', '↑', '→', '↓']
      },
      {
        label: 'Drag without snapping',
        hotkeys: formatHotkey({ alt: true })
      }
    ]
  },
  {
    title: 'Testing lab',
    items: [
      {
        label: 'Move between multi-run cells',
        hotkeys: ['↑', '↓']
      },
      {
        label: 'Create multi-run cell',
        hotkeys: ['Enter']
      },
      {
        label: 'Delete multi-run cell',
        hotkeys: ['⌫']
      },
      {
        label: 'Execute multi-run',
        hotkeys: [...formatHotkey({ meta: true }), 'Enter']
      }
    ]
  }
]

const ShortcutGuide = () => {
  const [isOpen, setIsOpen] = useState(false)
  useEvent('modal:shortcuts', () => setIsOpen(true), [])

  const actions = useActions()

  return (
    <Modal
      title="Keyboard Shortcuts"
      description="Become an Automatarium master"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      style={{ paddingInline: 0 }}
    >
      {useMemo(() => shortcuts.map(category => <Fragment key={category.title}>
        {category.title && <SectionLabel>{category.title}</SectionLabel>}
        <Section>{category.items.map(item => (
          <Shortcut key={item.label}>
            <label>{item.label}</label>
            {((item.action && formatHotkey(actions[item.action].hotkey)) || item.hotkeys)?.map(key => <kbd key={key}>{key}</kbd>)}
          </Shortcut>
        ))}</Section>
      </Fragment>), [actions])}
    </Modal>
  )
}

export default ShortcutGuide
