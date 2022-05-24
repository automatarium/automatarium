import { Link } from 'react-router-dom'

import { Container, FooterItem } from './footerStyle'

const Footer = () => 
  <Container>
    <FooterItem><Link to='/about'>About</Link></FooterItem>
    <FooterItem><Link to='/privacy'>Privacy Policy</Link></FooterItem>
    <FooterItem><a href='https://github.com/automatarium/automatarium' target='_blank'>Source Code</a></FooterItem>
    <FooterItem $right>Licensed under MIT</FooterItem>
  </Container>

export default Footer
