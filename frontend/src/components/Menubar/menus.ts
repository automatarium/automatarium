import { APP_VERSION } from '/src/config/projects'
import { TranslatableContextItems } from '/src/components/ContextMenus/contextItem'
import { TFunction } from 'i18next'

const menus: TranslatableContextItems = (t: TFunction) => [
  {
    label: t('menus.file', { ns: 'common' }),
    items: [
      {
        label: t('menus.file_new', { ns: 'common' }),
        action: 'NEW_FILE'
      },
      // TODO: Support dynamic menu items to show recent files
      // {
      //   label: 'Open recent',
      //   items: [
      //     // { label: 'Test file' },
      //     // { label: 'Another test file' },
      //     // { label: 'Best NFA' },
      //     // { label: 'Turing machine' },
      //   ],
      // },
      'hr',
      {
        label: t('import', { ns: 'common' }),
        items: [
          {
            label: t('menus.import_automatarium', { ns: 'common' }),
            action: 'IMPORT_AUTOMATARIUM_PROJECT'
          },
          {
            label: t('menus.import_jflap', { ns: 'common' }),
            action: 'IMPORT_JFLAP_PROJECT'
          },
          {
            label: t('menus.import_other', { ns: 'common' }),
            action: 'IMPORT_DIALOG'
          }
        ]
      },
      {
        label: t('export', { ns: 'common' }),
        items: [
          {
            label: t('menus.export_image', { ns: 'common' }),
            action: 'EXPORT'
          },
          {
            label: t('menus.export_png', { ns: 'common' }),
            action: 'EXPORT_AS_PNG'
          },
          {
            label: t('menus.export_svg', { ns: 'common' }),
            action: 'EXPORT_AS_SVG'
          },
          {
            label: t('menus.export_clipboard', { ns: 'common' }),
            action: 'EXPORT_TO_CLIPBOARD'
          },
          'hr',
          {
            label: t('menus.export_automatarium', { ns: 'common' }),
            action: 'SAVE_FILE_AS'
          },
          {
            label: t('menus.export_jflap', { ns: 'common' }),
            action: 'EXPORT_AS_JFLAP'
          },
          {
            label: t('menus.export_url_data', { ns: 'common' }),
            action: 'ENCODE_FILE'
          }
        ]
      },
      'hr',
      {
        label: t('menus.preferences', { ns: 'common' }),
        action: 'OPEN_PREFERENCES'
      }
    ]
  },
  {
    label: t('menus.edit', { ns: 'common' }),
    items: [
      {
        label: t('menus.undo', { ns: 'common' }),
        action: 'UNDO'
      },
      {
        label: t('menus.redo', { ns: 'common' }),
        action: 'REDO'
      },
      'hr',
      {
        label: t('copy', { ns: 'common' }),
        action: 'COPY'
      },
      {
        label: t('paste', { ns: 'common' }),
        action: 'PASTE'
      },
      {
        label: t('menus.select_all', { ns: 'common' }),
        action: 'SELECT_ALL'
      },
      {
        label: t('menus.clear_selection', { ns: 'common' }),
        action: 'SELECT_NONE'
      },
      'hr',
      {
        label: t('delete', { ns: 'common' }),
        shortcut: '⌫',
        action: 'DELETE'
      }
    ]
  },
  {
    label: t('menus.view', { ns: 'common' }),
    items: [
      {
        label: t('menus.zoom_in', { ns: 'common' }),
        action: 'ZOOM_IN'
      },
      {
        label: t('menus.zoom_out', { ns: 'common' }),
        action: 'ZOOM_OUT'
      },
      {
        label: t('menus.zoom_100', { ns: 'common' }),
        action: 'ZOOM_100'
      },
      {
        label: t('menus.zoom_fit', { ns: 'common' }),
        action: 'ZOOM_FIT'
      },
      'hr',
      {
        label: t('menus.fullscreen', { ns: 'common' }),
        shortcut: 'F11',
        action: 'FULLSCREEN'
      },
      'hr',
      {
        label: t('menus.testing_lab', { ns: 'common' }),
        action: 'TESTING_LAB'
      },
      /*
      {
        label: 'Stepping lab',
        action: 'STEPPING_LAB'
      },
      */
      {
        label: t('menus.file_info', { ns: 'common' }),
        action: 'FILE_INFO'
      },
      {
        label: t('menus.file_options', { ns: 'common' }),
        action: 'FILE_OPTIONS'
      },
      {
        label: t('menus.templates', { ns: 'common' }),
        action: 'TEMPLATES'
      },
      {
        label: t('menus.modules', { ns: 'common' }),
        action: 'MODULES'
      }
    ]
  },
  {
    label: t('menus.tools', { ns: 'common' }),
    items: [
      {
        label: t('menus.convert_dfa', { ns: 'common' }),
        action: 'CONVERT_TO_DFA'
      },
      'hr',
      {
        label: t('menus.auto_layout', { ns: 'common' }),
        action: 'AUTO_LAYOUT'
      },
      {
        label: t('menus.reorder_graph', { ns: 'common' }),
        action: 'REORDER_GRAPH'
      }
    ]
  },
  {
    label: t('menus.help', { ns: 'common' }),
    items: [
      {
        label: t('menus.start_tour', { ns: 'common' }),
        action: 'START_TOUR'
      },
      {
        label: t('menus.view_documentation', { ns: 'common' }),
        action: 'OPEN_DOCS'
      },
      {
        label: t('menus.tutorial_videos', { ns: 'common' }),
        action: 'TUTORIAL_VIDEOS'
      },
      {
        label: t('menus.keyboard_shortcuts', { ns: 'common' }),
        action: 'KEYBOARD_SHORTCUTS'
      },
      'hr',
      {
        label: t('privacy_policy', { ns: 'common' }),
        action: 'PRIVACY_POLICY'
      },
      {
        label: t('menus.about_automatarium', { ns: 'common' }),
        action: 'OPEN_ABOUT'
      },

      'hr',
      {
        label: t('menus.version', { ns: 'common', version: APP_VERSION })
      }
    ]
  }
]

export default menus
