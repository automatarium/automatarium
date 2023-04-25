import { Link, To } from 'react-router-dom'

import { Logo } from '/src/components'

import { HeaderContainer } from './headerStyle'

const content = <><Logo /><h1>Automatarium</h1></>

const Header = ({ center, linkTo }: {center?: boolean, linkTo?: To}) => linkTo
  ? (
  <HeaderContainer $center={center}><Link to={linkTo}>{content}</Link></HeaderContainer>
    )
  : (
  <HeaderContainer $center={center}>{content}</HeaderContainer>
    )

export default Header
