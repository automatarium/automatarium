const menus = [
  {
    label: 'File',
    items: [
      {
        label: 'New...',
        action: 'NEW_FILE',
      },
      {
        label: 'Open...',
        action: 'OPEN_FILE',
      },
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
        label: 'Save',
        action: 'SAVE_FILE',
      },
      {
        label: 'Download...',
        action: 'SAVE_FILE_AS',
      },
      'hr',
      {
        label: 'Import',
        items: [
          {
            label: 'Import Automatarium Project',
            action: 'IMPORT_AUTOMATARIUM_PROJECT'
          },
          {
            label: 'Import JFLAP Project',
            action: 'IMPORT_JFLAP_PROJECT'
          },
        ],
      },
      {
        label: 'Export',
        items: [
          {
            label: 'Export as PNG',
            action: 'EXPORT_AS_PNG',
          },
          {
            label: 'Export as SVG',
            action: 'EXPORT_AS_SVG',
          },
          {
            label: 'Export as JPG',
            action: 'EXPORT_AS_JPG'
          },
          'hr',
          {
            label: 'Export as a JFLAP file',
            action: 'EXPORT_AS_JFLAP'
          },
        ],
      },
      {
        label: 'Share...',
        action: 'SHARE',
      },
      'hr',
      {
        label: 'Preferences',
        action: 'OPEN_PREFERENCES',
      },
    ]
  },
  {
    label: 'Edit',
    items: [
      {
        label: 'Undo',
        action: 'UNDO',
      },
      {
        label: 'Redo',
        action: 'REDO',
      },
      'hr',
      {
        label: 'Copy',
        action: 'COPY',
      },
      {
        label: 'Paste',
        action: 'PASTE',
      },
      {
        label: 'Select All',
        action: 'SELECT_ALL',
      },
      {
        label: 'Clear Selection',
        action: 'SELECT_NONE',
      },
      'hr',
      {
        label: 'Delete',
        shortcut: '⌫',
        action: 'DELETE',
      },
    ]
  },
  {
    label: 'View',
    items: [
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
      'hr',
      {
        label: 'Testing lab',
        action: 'TESTING_LAB',
      },
      {
        label: 'File info',
        action: 'FILE_INFO',
      },
      {
        label: 'File options',
        action: 'FILE_OPTIONS',
      },
    ]
  },
  {
    label: 'Tools',
    items: [
      {
        label: 'Convert to DFA',
        action: 'CONVERT_TO_DFA'
      },
      {
        label: 'Minimize DFA',
        action: 'MINIMIZE_DFA',
      },
      'hr',
      {
        label: 'Auto layout',
        action: 'AUTO_LAYOUT',
      },
    ]
  },
  {
    label: 'Help',
    items: [
      {
        label: 'View documentation',
        action: 'OPEN_DOCS'
      },
      {
        label: 'Keyboard shortcuts',
        action: 'KEYBOARD_SHORTCUTS',
      },
      'hr',
      {
        label: 'Privacy policy',
        action: 'PRIVACY_POLICY'
      },
      {
        label: 'About Automatarium',
        action: 'OPEN_ABOUT'
      },
      'hr',
      {
        label: 'Version 1.2.6',
      },
    ]
  },
]

export default menus
