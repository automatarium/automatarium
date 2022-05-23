import { Link } from 'react-router-dom'

import { Container, FooterItem } from './footerStyle'

const Footer = () => 
  <Container>
    <FooterItem><Link to='/about'>About</Link></FooterItem>
    <FooterItem><Link to='/privacy'>Privacy Policy</Link></FooterItem>
    <FooterItem><a href='https://github.com/automatarium/automatarium'>Source Code</a></FooterItem>
    <FooterItem style={{marginLeft: 'auto'}}>Licensed under MIT</FooterItem>
  </Container>

export default Footer
