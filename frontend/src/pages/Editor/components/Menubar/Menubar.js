import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Logo, Dropdown } from '/src/components'
import { useAuth } from '/src/hooks'

import {
  Wrapper,
  Menu,
  Name,
  DropdownMenus,
  Actions,
  ButtonGroup,
  DropdownButtonWrapper,
} from './menubarStyle'

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
      {
        label: 'Open recent',
        items: [
          // { label: 'Test file' },
          // { label: 'Another test file' },
          // { label: 'Best NFA' },
          // { label: 'Turing machine' },
        ],
      },
      'hr',
      {
        label: 'Save',
        action: 'SAVE_FILE',
      },
      {
        label: 'Save as...',
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

const DropdownButton = ({ item, dropdown, setDropdown, ...props }) => {
  const buttonRef = useRef()
  const [rect, setRect] = useState({})

  useEffect(() => {
    buttonRef.current && setRect(buttonRef.current.getBoundingClientRect())
  }, [buttonRef.current])

  return (
    <>
      <DropdownButtonWrapper
        type="button"
        ref={buttonRef}
        $active={dropdown === item.label}
        {...props}
      >{item.label}</DropdownButtonWrapper>

      <Dropdown
        style={{
          top: `${rect.y + rect.height + 10}px`,
          left: `${rect.x}px`,
        }}
        items={item.items}
        visible={dropdown === item.label}
        onClose={() => setDropdown(undefined)}
      />
    </>
  )
}

const Menubar = () => {
  const navigate = useNavigate()
  const { user, loading: userLoading } = useAuth()
  const [dropdown, setDropdown] = useState()

  return (
    <>
      <Wrapper>
        <Menu>
          <Logo />

          <div>
            {/* TODO: Make the title editable */}
            <Name>Example Title</Name>

            <DropdownMenus>
              {menus.map(item => (
                <DropdownButton
                  key={item.label}
                  item={item}
                  dropdown={dropdown}
                  setDropdown={setDropdown}
                  onClick={() => setDropdown(dropdown === item.label ? undefined : item.label)}
                  onMouseEnter={() => dropdown !== undefined && setDropdown(item.label)}
                />
              ))}
            </DropdownMenus>
          </div>
        </Menu>

        <Actions>
          {!userLoading && !user && <ButtonGroup>
            <Button secondary surface onClick={() => confirm('You will lose any unsaved work. Continue?') && navigate('/login')}>Log In</Button>
            <span>or</span>
            <Button onClick={() => confirm('You will lose any unsaved work. Continue?') && navigate('/signup')}>Sign Up</Button>
          </ButtonGroup>}
          {!userLoading && user && <Button>Share</Button>}
        </Actions>
      </Wrapper>
    </>
  )
}

export default Menubar
