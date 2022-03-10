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
          {/* TODO: Make the title editable */}
          <Name>Example Title</Name>

          <DropdownMenus>
            {['File', 'Edit', 'View', 'Tools', 'Help'].map(label => (
              <Dropdown
                type="button"
                key={label}
                onClick={() => console.log('You clicked', label)}
              >{label}</Dropdown>
            ))}
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