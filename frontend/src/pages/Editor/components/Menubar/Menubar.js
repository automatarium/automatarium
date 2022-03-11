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
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'Open...',
        shortcut: '⌘ O',
        onClick: () => console.log('Clicked'),
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
        shortcut: '⌘ S',
      },
      {
        label: 'Save as...',
        shortcut: '⇧ ⌘ S',
        onClick: () => console.log('Clicked'),
      },
      'hr',
      {
        label: 'Export',
        items: [
          {
            label: 'Export as PNG',
            shortcut: '⇧ ⌘ E',
            onClick: () => console.log('Clicked'),
          },
          {
            label: 'Export as SVG',
            shortcut: '⇧ ⌥ ⌘ E',
            onClick: () => console.log('Clicked'),
          },
          {
            label: 'Export as JPG',
            onClick: () => console.log('Clicked'),
          },
          'hr',
          {
            label: 'Export as a JFLAP file',
            onClick: () => console.log('Clicked'),
          },
        ],
      },
      {
        label: 'Share...',
        onClick: () => console.log('Clicked'),
      },
      'hr',
      {
        label: 'Preferences',
        shortcut: '⌘ ,',
        onClick: () => console.log('Clicked'),
      },
    ]
  },
  {
    label: 'Edit',
    items: [
      {
        label: 'Undo',
        shortcut: '⌘ Z',
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'Redo',
        shortcut: '⌘ Y',
      },
      'hr',
      {
        label: 'Copy',
        shortcut: '⌘ C',
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'Paste',
        shortcut: '⌘ V',
        onClick: () => console.log('Clicked'),
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
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'Zoom out',
        shortcut: '⌘ -',
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'Zoom to 100%',
        shortcut: '⌘ 0',
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'Zoom to fit',
        shortcut: '⇧ 1',
        onClick: () => console.log('Clicked'),
      },
      'hr',
      {
        label: 'Fullscreen',
        shortcut: 'F11',
        onClick: () => console.log('Clicked'),
      },
      'hr',
      {
        label: 'Testing lab',
        shortcut: '⌘ T',
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'File info',
        shortcut: '⌘ I',
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'File options',
        shortcut: '⌘ U',
        onClick: () => console.log('Clicked'),
      },
    ]
  },
  {
    label: 'Tools',
    items: [
      {
        label: 'Convert to DFA',
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'Minimize DFA',
      },
      'hr',
      {
        label: 'Auto layout',
        onClick: () => console.log('Clicked'),
      },
    ]
  },
  {
    label: 'Help',
    items: [
      {
        label: 'View documentation',
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'Keyboard shortcuts',
        shortcut: '⌘ /',
        onClick: () => console.log('Clicked'),
      },
      'hr',
      {
        label: 'Privacy policy',
        onClick: () => console.log('Clicked'),
      },
      {
        label: 'About Automatarium',
        onClick: () => console.log('Clicked'),
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
          <Button>Share</Button>
        </Actions>
      </Wrapper>
    </>
  )
}

export default Menubar