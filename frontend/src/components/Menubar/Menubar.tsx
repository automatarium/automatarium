import { useState, useEffect, useRef, HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Button, Logo, Dropdown } from '/src/components'
import { useEvent } from '/src/hooks'
import { useProjectStore, useProjectsStore, useModuleStore, useModulesStore } from '/src/stores'
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
import { useTranslation } from 'react-i18next'

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

const Menubar = ({ isSaving }: { isSaving: boolean }) => {
  const navigate = useNavigate()
  const [dropdown, setDropdown] = useState<string>()

  const titleRef = useRef<HTMLInputElement>()
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState('')

  const projectName = useProjectStore(s => s.project?.meta?.name)
  const setProjectName = useProjectStore(s => s.setName)
  const lastChangeDate = useProjectStore(s => s.lastChangeDate)
  const lastSaveDate = useProjectStore(s => s.lastSaveDate)
  const setLastSaveDate = useProjectStore(s => s.setLastSaveDate)
  const upsertProject = useProjectsStore(s => s.upsertProject)
  const deleteProject = useProjectsStore(s => s.deleteProject)
  const { t } = useTranslation('common')

  // Modules
  const upsertModuleProject = useModuleStore(s => s.upsertProject)
  const upsertModule = useModulesStore(s => s.upsertModule)
  const currentModule = useModuleStore(s => s.module)

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

  const saveLabProject = () => {
    const project = useProjectStore.getState().project
    upsertModuleProject({ ...project, meta: { ...project.meta, dateEdited: new Date().getTime() } })
  }

  const saveLab = () => {
    upsertModule(currentModule)
  }

  const handleSaveProjectName = () => {
    if (titleValue && !/^\s*$/.test(titleValue)) {
      setProjectName(titleValue)
      saveProject()
    }
    setEditingTitle(false)
  }

  useEvent('beforeunload', e => {
    if (lastSaveDate > lastChangeDate) return
    e.preventDefault()
    return t('menubar.not_saved')
  }, [lastSaveDate, lastChangeDate], { options: { capture: true }, target: window })

  return (
    <>
      <Wrapper>
        <Menu>
          <a href="/new" onClick={e => {
            e.preventDefault()
            const project = useProjectStore.getState().project
            const totalItems = project.comments.length + project.states.length + project.transitions.length
            if (totalItems > 0) {
              if (currentModule != null) {
                saveLabProject()
                saveLab()
              } else {
                saveProject()
              }
            } else {
              deleteProject(project._id)
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
                  disabled={currentModule != null}
                />
                  )
                : (
                <Name onClick={handleEditProjectName} title={t('menubar.edit_title')}>{projectName ?? t('menubar.untitled')}</Name>
                  )}
              <SaveStatus $show={isSaving}>{t('menubar.saving')}</SaveStatus>
            </NameRow>

            <DropdownMenus>
              {menus(t).map((item: ContextItem) => (
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
          {<Button onClick={() => dispatchCustomEvent('showSharing', null)}>{t('share')}</Button>}
        </Actions>
      </Wrapper>
    </>
  )
}

export default Menubar
