import { Link } from 'react-router-dom'

import { Logo } from '/src/components'

import { HeaderContainer } from './headerStyle'

const content = <><Logo /><h1>Automatarium</h1></>

const Header = ({ center, linkTo }) => linkTo ? (
  <HeaderContainer $center={center}><Link to={linkTo}>{content}</Link></HeaderContainer>
) : (
  <HeaderContainer $center={center}>{content}</HeaderContainer>
)

export default Header
