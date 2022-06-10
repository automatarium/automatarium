import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Button, Logo, Dropdown } from '/src/components'
import { useAuth } from '/src/hooks'
import LoginPage from '/src/pages/Login/Login'
import SignupPage from '/src/pages/Signup/Signup'

import {
  Wrapper,
  LogoWrapper,
  Menu,
  Name,
  NameRow,
  SaveStatus,
  DropdownMenus,
  Actions,
  ButtonGroup,
  DropdownButtonWrapper,
} from './menubarStyle'
import menus from './menus'
import useProjectStore from '../../stores/useProjectStore'

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

  const projectName = useProjectStore(s => s.project?.meta?.name)
  const lastSaveDate = useProjectStore(s => s.lastSaveDate)
  const lastChangeDate = useProjectStore(s => s.lastChangeDate)
  const setProjectName = useProjectStore(s => s.setName)

  const handleChangeProjectName = () => {
    const newName = prompt('Name for project?')
    if (newName) setProjectName(newName)
  }

  return (
    <>
      <Wrapper>
        <Menu>
          <LogoWrapper href='/new'>
            <Logo />
          </LogoWrapper>

          <div>
            {/* TODO: Make the title editable */}
            <NameRow>
              <Name onClick={handleChangeProjectName}>{projectName ?? 'Untitled Project'}</Name>
              <SaveStatus $show={!(!lastChangeDate || dayjs(lastSaveDate).isAfter(lastChangeDate))}>Saving...</SaveStatus>
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
          {!userLoading && !user && <ButtonGroup>
            <Button secondary surface onClick={() => setLoginModalVisible(true)}>Log In</Button>
            <span>or</span>
            <Button onClick={() => setSignupModalVisible(true)}>Sign Up</Button>
          </ButtonGroup>}
          {!userLoading && user && <Button>Share</Button>}
          {user && <Button onClick={() => confirm('Are you sure? You will lose unsaved work.') && navigate('/logout')}>Logout</Button>}
        </Actions>

        <LoginPage.Modal isOpen={loginModalVisible} onClose={() => setLoginModalVisible(false)} />
        <SignupPage.Modal isOpen={signupModalVisible} onClose={() => setSignupModalVisible(false)} />
      </Wrapper>
    </>
  )
}

export default Menubar
