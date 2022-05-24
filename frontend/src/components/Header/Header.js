import { Logo } from '/src/components'

import { HeaderContainer } from './headerStyle'

const Header = ({ center }) => <HeaderContainer $center={center}>
  <Logo />
  <h1>Automatarium</h1>
</HeaderContainer>

export default Header
