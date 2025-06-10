import { useMemo, Fragment, useState } from 'react'

import { SectionLabel, Modal } from '/src/components'
import { useActions, useEvent } from '/src/hooks'
import { formatHotkey, HotKey } from '/src/hooks/useActions'

import { Section, Shortcut } from './shortcutGuideStyle'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'

interface ActionShortcut {
  label: string
  action: string
}

interface HotkeyShortcut {
  label: string
  hotkeys: HotKey[]
}

interface Category {
  title: string
  items: (ActionShortcut | HotkeyShortcut)[]
}

type TranslatableCategories = (t: TFunction) => Category[]

const shortcuts: TranslatableCategories = (t: TFunction) => [
  {
    title: t('shortcuts.application'),
    items: [
      {
        label: t('menus.preferences'),
        action: 'OPEN_PREFERENCES'
      },
      {
        label: t('menus.keyboard_shortcuts'),
        action: 'KEYBOARD_SHORTCUTS'
      }
    ]
  },
  {
    title: t('menus.tools'),
    items: [
      {
        label: t('tools.cursor'),
        action: 'TOOL_CURSOR'
      },
      {
        label: t('tools.hand'),
        action: 'TOOL_HAND'
      },
      {
        label: t('tools.state'),
        action: 'TOOL_STATE'
      },
      {
        label: t('tools.transition'),
        action: 'TOOL_TRANSITION'
      },
      {
        label: t('tools.comment'),
        action: 'TOOL_COMMENT'
      }
    ]
  },
  {
    title: t('menus.file'),
    items: [
      {
        label: t('shortcuts.import_automatarium'),
        action: 'IMPORT_AUTOMATARIUM_PROJECT'
      },
      {
        label: t('shortcuts.import_jflap'),
        action: 'IMPORT_JFLAP_PROJECT'
      },
      {
        label: t('shortcuts.save_file'),
        action: 'SAVE_FILE'
      },
      {
        label: t('shortcuts.export_automatarium'),
        action: 'SAVE_FILE_AS'
      },
      {
        label: t('shortcuts.export_image'),
        action: 'EXPORT'
      },
      {
        label: t('menus.export_png'),
        action: 'EXPORT_AS_PNG'
      },
      {
        label: t('menus.export_svg'),
        action: 'EXPORT_AS_SVG'
      },
      {
        label: t('menus.export_clipboard'),
        action: 'EXPORT_TO_CLIPBOARD'
      }
    ]
  },
  {
    title: t('menus.edit'),
    items: [
      {
        label: t('menus.undo'),
        action: 'UNDO'
      },
      {
        label: t('menus.redo'),
        action: 'REDO'
      },
      {
        label: t('copy'),
        action: 'COPY'
      },
      {
        label: t('paste'),
        action: 'PASTE'
      },
      {
        label: t('menus.select_all'),
        action: 'SELECT_ALL'
      },
      {
        label: t('menus.clear_selection'),
        action: 'SELECT_NONE'
      },
      {
        label: t('shortcuts.select_multiple'),
        hotkeys: [{ shift: true, key: '' }]
      },
      {
        label: t('delete'),
        hotkeys: [{ key: '⌫' }]
      }
    ]
  },
  {
    title: t('menus.view'),
    items: [
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
      {
        label: t('menus.fullscreen'),
        hotkeys: [{ key: 'F11' }]
      },
      {
        label: t('menus.testing_lab'),
        action: 'TESTING_LAB'
      },
      /*
      {
        label: 'Stepping lab',
        action: 'STEPPING_LAB'
      },
      */
      {
        label: t('menus.file_info'),
        action: 'FILE_INFO'
      },
      {
        label: t('menus.file_options'),
        action: 'FILE_OPTIONS'
      },
      {
        label: t('menus.templates'),
        action: 'TEMPLATES'
      },
      {
        label: t('menus.modules'),
        action: 'MODULES'
      },
      {
        label: t('shortcuts.move_view'),
        hotkeys: [{ key: '←' }, { key: '↑' }, { key: '→' }, { key: '↓' }]
      },
      {
        label: t('shortcuts.no_snapping'),
        hotkeys: [{ alt: true, key: '' }]
      }
    ]
  },
  {
    title: t('menus.testing_lab'),
    items: [
      {
        label: t('shortcuts.move_cells'),
        hotkeys: [{ key: '↑' }, { key: '↓' }]
      },
      {
        label: t('shortcuts.create_cell'),
        hotkeys: [{ key: 'Enter' }]
      },
      {
        label: t('shortcuts.delete_cell'),
        hotkeys: [{ key: '⌫' }]
      },
      {
        label: t('shortcuts.execute_multirun'),
        hotkeys: [{ meta: true, key: 'Enter' }]
      }
    ]
  }
]

const ShortcutGuide = () => {
  const [isOpen, setIsOpen] = useState(false)
  useEvent('modal:shortcuts', () => setIsOpen(true), [])
  const { t } = useTranslation('common')

  const actions = useActions()

  return (
    <Modal
      title={t('shortcuts.title')}
      description={t('shortcuts.description')}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      style={{ paddingInline: 0 }}
    >
      {useMemo(() => shortcuts(t).map(category => <Fragment key={category.title}>
        {category.title && <SectionLabel>{category.title}</SectionLabel>}
        <Section>{category.items.map(item => (
          <Shortcut key={item.label}>
            <label>{item.label}</label>
            {(('action' in item && actions[item.action]?.hotkeys) || (item as HotkeyShortcut).hotkeys)?.map(hotkey => {
              const key = formatHotkey(hotkey)
              return <kbd key={key}>{key}</kbd>
            })}
          </Shortcut>
        ))}</Section>
      </Fragment>), [actions])}
    </Modal>
  )
}

export default ShortcutGuide
