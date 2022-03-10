import { Button, Logo } from '/src/components'

import {
  Wrapper,
  Menu,
  Name,
  DropdownMenus,
  Actions,
  Dropdown,
} from './toolbarStyle'

const Toolbar = () => {
  return (
    <Wrapper>
      <Menu>
        <Logo />
        <div>
          <Name>Example Title</Name>
          <DropdownMenus>
            <Dropdown type="button">File</Dropdown>
            <Dropdown type="button">Edit</Dropdown>
            <Dropdown type="button">View</Dropdown>
            <Dropdown type="button">Tools</Dropdown>
            <Dropdown type="button">Help</Dropdown>
          </DropdownMenus>
        </div>
      </Menu>

      <Actions>
        <Button>Share</Button>
      </Actions>
    </Wrapper>
  )
}

export default Toolbar