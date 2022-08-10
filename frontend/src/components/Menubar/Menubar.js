import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Button, Logo, Dropdown } from '/src/components'
import { useAuth, useEvent } from '/src/hooks'
import { useProjectStore, useProjectsStore } from '/src/stores'
import LoginPage from '/src/pages/Login/Login'
import SignupPage from '/src/pages/Signup/Signup'
import ShareModal from './components/ShareModal/ShareModal'

import {
  Wrapper,
  Menu,
  Name,
  NameRow,
  SaveStatus,
  DropdownMenus,
  Actions,
  DropdownButtonWrapper,
  NameInput,
} from './menubarStyle'

import menus from './menus'

// Extend dayjs
dayjs.extend(relativeTime)

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
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [signupModalVisible, setSignupModalVisible] = useState(false)
  const [shareModalVisible, setShareModalVisible] = useState(false)

  const titleRef = useRef()
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState('')

  const projectName = useProjectStore(s => s.project?.meta?.name)
  const projectId = useProjectStore(s => s.project?._id)
  const setProjectName = useProjectStore(s => s.setName)
  const setLastSaveDate = useProjectStore(s => s.setLastSaveDate)
  const upsertProject = useProjectsStore(s => s.upsertProject)

  const lastSaveDate = useProjectStore(s => s.lastSaveDate)
  const lastChangeDate = useProjectStore(s => s.lastChangeDate)
  // Determine whether saving
  const isSaving = useMemo(() => user && !(!lastChangeDate || dayjs(lastSaveDate).isAfter(lastChangeDate)), [user, lastChangeDate, lastSaveDate])

  const handleEditProjectName = () => {
    setTitleValue(projectName ?? '')
    setEditingTitle(true)
    window.setTimeout(() => titleRef.current?.select(), 50)
  }
  const handleSaveProjectName = () => {
    if (titleValue && !/^\s*$/.test(titleValue)) {
      setProjectName(titleValue)
    }
    setEditingTitle(false)
  }

  useEvent('beforeunload', e => {
    if (!isSaving) return
    e.preventDefault()
    return e.returnValue = 'Your project isn\'t saved yet, are you sure you want to leave?'
  }, [isSaving], { options: { capture: true }, target: window })

  return (
    <>
      <Wrapper>
        <Menu>
          <a href="/new" onClick={e => {
            e.preventDefault()
            if (isSaving) {
              // If there are unsaved changes, save and then navigate
              const project = useProjectStore.getState().project
              upsertProject({...project, meta: { ...project.meta, dateEdited: new Date().getTime() }})
              setLastSaveDate(new Date().getTime())
            }
            navigate('/new')
          }}>
            <Logo />
          </a>

          <div>
            <NameRow>
              {editingTitle ? (
                <NameInput
                  value={titleValue}
                  onChange={e => setTitleValue(e.target.value)}
                  onBlur={handleSaveProjectName}
                  onKeyDown={e => e.code === 'Enter' && handleSaveProjectName()}
                  ref={titleRef}
                />
              ) : (
                <Name onClick={handleEditProjectName} title="Edit title">{projectName ?? 'Untitled Project'}</Name>
              )}
              <SaveStatus $show={isSaving}>Saving...</SaveStatus>
            </NameRow>

            <DropdownMenus>
              {menus.map(item => (
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
          {!userLoading && !user && <>
            <Button secondary surface onClick={() => setLoginModalVisible(true)}>Log In</Button>
            <Button onClick={() => setSignupModalVisible(true)}>Sign Up</Button>
          </>}

          {user && <Button secondary surface onClick={() => confirm('Are you sure? You will lose unsaved work.') && navigate('/logout')}>Logout</Button>}
          {user && <Button disabled={userLoading} onClick={() => setShareModalVisible(true)}>Share</Button>}
        </Actions>

        <LoginPage.Modal isOpen={loginModalVisible} onClose={() => setLoginModalVisible(false)} />
        <SignupPage.Modal isOpen={signupModalVisible} onClose={() => setSignupModalVisible(false)} />
        <ShareModal isOpen={shareModalVisible} projectId={projectId} onClose={() => setShareModalVisible(false)} />
      </Wrapper>
    </>
  )
}

export default Menubar
