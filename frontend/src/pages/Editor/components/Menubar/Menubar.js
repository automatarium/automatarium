import { useState, useEffect, useRef } from 'react'

import { Button, Logo, Dropdown } from '/src/components'

import {
  Wrapper,
  Menu,
  Name,
  DropdownMenus,
  Actions,
  DropdownButtonWrapper,
} from './menubarStyle'

const menus = [
  {
    label: 'File',
    items: [
      {
        label: 'New...',
        shortcut: '⌘ N',
      },
      {
        label: 'Open...',
        shortcut: '⌘ O',
      },
      {
        label: 'Open recent',
        items: [
          { label: 'Test file' },
          { label: 'Another test file' },
          { label: 'Best NFA' },
          { label: 'Turing machine' },
        ],
      },
      'hr',
      {
        label: 'Save',
        shortcut: '⌘ S',
      },
      {
        label: 'Save as...',
        shortcut: '⇧ ⌘ S',
      },
      'hr',
      {
        label: 'Export',
        items: [
          {
            label: 'Export as PNG',
            shortcut: '⇧ ⌘ E',
          },
          {
            label: 'Export as SVG',
            shortcut: '⇧ ⌥ ⌘ E',
          },
          {
            label: 'Export as JPG',
          },
          'hr',
          {
            label: 'Export as a JFLAP file',
          },
        ],
      },
      {
        label: 'Share...',
      },
      'hr',
      {
        label: 'Preferences',
        shortcut: '⌘ ,',
      },
    ]
  },
  {
    label: 'Edit',
    items: [
      {
        label: 'Undo',
        shortcut: '⌘ Z',
      },
      {
        label: 'Redo',
        shortcut: '⌘ Y',
      },
      'hr',
      {
        label: 'Copy',
        shortcut: '⌘ C',
      },
      {
        label: 'Paste',
        shortcut: '⌘ V',
      },
      'hr',
      {
        label: 'Delete',
        shortcut: '⌫',
      },
    ]
  },
  {
    label: 'View',
    items: [
      {
        label: 'Zoom in',
        shortcut: '⌘ =',
      },
      {
        label: 'Zoom out',
        shortcut: '⌘ -',
      },
      {
        label: 'Zoom to 100%',
        shortcut: '⌘ 0',
      },
      {
        label: 'Zoom to fit',
        shortcut: '⇧ 1',
      },
      'hr',
      {
        label: 'Fullscreen',
        shortcut: 'F11',
      },
      'hr',
      {
        label: 'Testing lab',
        shortcut: '⌘ T',
      },
      {
        label: 'File info',
        shortcut: '⌘ I',
      },
      {
        label: 'File options',
        shortcut: '⌘ U',
      },
    ]
  },
  {
    label: 'Tools',
    items: [
      {
        label: 'Convert to DFA',
      },
      {
        label: 'Minimize DFA',
      },
      'hr',
      {
        label: 'Auto layout',
      },
    ]
  },
  {
    label: 'Help',
    items: [
      {
        label: 'View documentation',
      },
      {
        label: 'Keyboard shortcuts',
        shortcut: '⌘ /',
      },
      'hr',
      {
        label: 'Privacy policy',
      },
      {
        label: 'About Automatarium',
      },
      'hr',
      {
        label: 'Version 1.2.6',
      },
    ]
  },
]

const DropdownButton = ({ item, dropdown, ...props }) => {
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
        x={rect.x} y={rect.y + rect.height + 10}
        items={item.items}
        visible={dropdown === item.label}
      />
    </>
  )
}

const Menubar = () => {
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
                  onClick={() => setDropdown(dropdown === item.label ? undefined : item.label)}
                  onMouseEnter={() => dropdown !== undefined && setDropdown(item.label)}
                />
              ))}
            </DropdownMenus>
          </div>
        </Menu>

        <Actions>
          <Button>Share</Button>
        </Actions>
      </Wrapper>
    </>
  )
}

export default Menubar