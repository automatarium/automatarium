import { useState, useEffect, useRef, useMemo, HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Button, Logo, Dropdown } from '/src/components'
import { useEvent } from '/src/hooks'
import { useProjectStore, useProjectsStore } from '/src/stores'
import { dispatchCustomEvent } from '/src/util/events'

import {
  Wrapper,
  Menu,
  Name,
  NameRow,
  SaveStatus,
  DropdownMenus,
  Actions,
  DropdownButtonWrapper,
  NameInput
} from './menubarStyle'

import menus from './menus'
import { ContextItem } from '/src/components/ContextMenus/contextItem'

// Extend dayjs
dayjs.extend(relativeTime)

interface DropdownButton extends HTMLAttributes<HTMLButtonElement> {
  item: ContextItem
  dropdown: string
  setDropdown: (x: undefined) => void
}

const DropdownButton = ({ item, dropdown, setDropdown, ...props }: DropdownButton) => {
  const buttonRef = useRef<HTMLButtonElement>()
  const [rect, setRect] = useState<DOMRect>()

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
          top: `${rect?.y + rect?.height + 10}px`,
          left: `${rect?.x}px`
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
  const [dropdown, setDropdown] = useState<string>()

  const titleRef = useRef<HTMLInputElement>()
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState('')

  const projectName = useProjectStore(s => s.project?.meta?.name)
  const setProjectName = useProjectStore(s => s.setName)
  const setLastSaveDate = useProjectStore(s => s.setLastSaveDate)
  const upsertProject = useProjectsStore(s => s.upsertProject)

  const lastSaveDate = useProjectStore(s => s.lastSaveDate)
  const lastChangeDate = useProjectStore(s => s.lastChangeDate)
  // Determine whether saving
  const isSaving = useMemo(() => !(!lastChangeDate || dayjs(lastSaveDate).isAfter(lastChangeDate)), [lastChangeDate, lastSaveDate])

  const handleEditProjectName = () => {
    setTitleValue(projectName ?? '')
    setEditingTitle(true)
    window.setTimeout(() => titleRef.current?.select(), 50)
  }

  const saveProject = () => {
    const project = useProjectStore.getState().project
    upsertProject({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
    setLastSaveDate(new Date().getTime())
  }

  const handleSaveProjectName = () => {
    if (titleValue && !/^\s*$/.test(titleValue)) {
      setProjectName(titleValue)
      saveProject()
    }
    setEditingTitle(false)
  }

  useEvent('beforeunload', e => {
    if (!isSaving) return
    e.preventDefault()
    return 'Your project isn\'t saved yet, are you sure you want to leave?'
  }, [isSaving], { options: { capture: true }, target: window })

  return (
    <>
      <Wrapper>
        <Menu>
          <a href="/new" onClick={e => {
            e.preventDefault()
            if (isSaving) {
              // If there are unsaved changes, save and then navigate
              saveProject()
            }
            navigate('/new')
          }}>
            <Logo />
          </a>

          <div>
            <NameRow>
              {editingTitle
                ? (
                <NameInput
                  value={titleValue}
                  onChange={e => setTitleValue(e.target.value)}
                  onBlur={handleSaveProjectName}
                  onKeyDown={e => e.code === 'Enter' && handleSaveProjectName()}
                  ref={titleRef}
                />
                  )
                : (
                <Name onClick={handleEditProjectName} title="Edit title">{projectName ?? 'Untitled Project'}</Name>
                  )}
              <SaveStatus $show={isSaving}>Saving...</SaveStatus>
            </NameRow>

            <DropdownMenus>
              {menus.map((item: ContextItem) => (
                <DropdownButton
                  key={item.label}
                  item={item}
                  dropdown={dropdown}
                  setDropdown={setDropdown}
                  onClick={e => { setDropdown(dropdown === item.label ? undefined : item.label); e.stopPropagation() }}
                  onMouseEnter={() => dropdown !== undefined && setDropdown(item.label)}
                />
              ))}
            </DropdownMenus>
          </div>
        </Menu>

        <Actions>
          {<Button onClick={() => dispatchCustomEvent('showSharing', null)}>Share</Button>}
        </Actions>
      </Wrapper>
    </>
  )
}

export default Menubar
