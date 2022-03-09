import { Button, Logo } from '/src/components'

import {
  Wrapper,
  Menu,
  Name,
  DropdownMenus,
  Actions,
} from './toolbarStyle'

const Toolbar = () => {
  return (
    <Wrapper>
      <Menu>
        <Logo />
        <div>
          <Name>Example Title</Name>
          <DropdownMenus>
            <span>File</span>
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