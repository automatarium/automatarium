import { useState, useEffect, useRef, useMemo } from 'react'

import { Button, Logo, Dropdown } from '/src/components'
import { useProjectStore, useSelectionStore } from '/src/stores'

import {
  Wrapper,
  Menu,
  Name,
  DropdownMenus,
  Actions,
  DropdownButtonWrapper,
} from './menubarStyle'

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
  const undo = useProjectStore(s => s.undo)
  const redo = useProjectStore(s => s.redo)
  const setSelectedStates = useSelectionStore(s => s.set)

  const menus = [
    {
      label: 'File',
      items: [
        {
          label: 'New...',
          action: 'NEW_FILE',
          onClick: () => console.log('New File'),
        },
        {
          label: 'Open...',
          action: 'OPEN_FILE',
          onClick: () => console.log('Open File'),
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
          onClick: () => console.log('Save'),
        },
        {
          label: 'Save as...',
          action: 'SAVE_FILE_AS',
          onClick: () => console.log('Save File As'),
        },
        'hr',
        {
          label: 'Export',
          items: [
            {
              label: 'Export as PNG',
              action: 'EXPORT_AS_PNG',
              onClick: () => console.log('Export PNG'),
            },
            {
              label: 'Export as SVG',
              action: 'EXPORT_AS_SVG',
              onClick: () => console.log('Export SVG'),
            },
            {
              label: 'Export as JPG',
              onClick: () => console.log('Export JPG'),
            },
            'hr',
            {
              label: 'Export as a JFLAP file',
              onClick: () => console.log('Export JFLAP'),
            },
          ],
        },
        {
          label: 'Share...',
          onClick: () => console.log('Share'),
        },
        'hr',
        {
          label: 'Preferences',
          action: 'OPEN_PREFERENCES',
          onClick: () => console.log('Preferences'),
        },
      ]
    },
    {
      label: 'Edit',
      items: [
        {
          label: 'Undo',
          action: 'UNDO',
          onClick: undo,
        },
        {
          label: 'Redo',
          action: 'REDO',
          onClick: redo,
        },
        'hr',
        {
          label: 'Copy',
          action: 'COPY',
          onClick: () => console.log('Copy'),
        },
        {
          label: 'Paste',
          action: 'PASTE',
          onClick: () => console.log('Paste'),
        },
        {
          label: 'Select All',
          action: 'SELECT_ALL',
          onClick: () => {
            // TODO
          },
        },
        {
          label: 'Clear Selection',
          action: 'SELECT_NONE',
          onClick: () => setSelectedStates([]),
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
          action: 'ZOOM_IN',
          onClick: () => console.log('Zoom In'),
        },
        {
          label: 'Zoom out',
          action: 'ZOOM_OUT',
          onClick: () => console.log('Zoom Out'),
        },
        {
          label: 'Zoom to 100%',
          action: 'ZOOM_100',
          onClick: () => console.log('Zoom to 100%'),
        },
        {
          label: 'Zoom to fit',
          action: 'ZOOM_FIT',
          onClick: () => console.log('Zoom to fit'),
        },
        'hr',
        {
          label: 'Fullscreen',
          shortcut: 'F11',
          onClick: () => console.log('Fullscreen'),
        },
        'hr',
        {
          label: 'Testing lab',
          action: 'TESTING_LAB',
          onClick: () => console.log('Testing Lab'),
        },
        {
          label: 'File info',
          action: 'FILE_INFO',
          onClick: () => console.log('File Info'),
        },
        {
          label: 'File options',
          action: 'FILE_OPTIONS',
          onClick: () => console.log('File Options'),
        },
      ]
    },
    {
      label: 'Tools',
      items: [
        {
          label: 'Convert to DFA',
          onClick: () => console.log('Convert to DFA'),
        },
        {
          label: 'Minimize DFA',
          onClick: () => console.log('Minimize DFA'),
        },
        'hr',
        {
          label: 'Auto layout',
          onClick: () => console.log('Auto Layout'),
        },
      ]
    },
    {
      label: 'Help',
      items: [
        {
          label: 'View documentation',
          onClick: () => console.log('View Documentation'),
        },
        {
          label: 'Keyboard shortcuts',
          action: 'KEYBOARD_SHORTCUTS',
          onClick: () => console.log('Keyboard shortcuts'),
        },
        'hr',
        {
          label: 'Privacy policy',
          onClick: () => console.log('Privacy Policy'),
        },
        {
          label: 'About Automatarium',
          onClick: () => console.log('About Automatarium'),
        },
        'hr',
        {
          label: 'Version 1.2.6',
        },
      ]
    },
  ]

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
