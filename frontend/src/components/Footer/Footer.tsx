import { Link } from 'react-router-dom'

import { Container, FooterItem } from './footerStyle'

const Footer = () =>
  <Container>
    <FooterItem><Link to="/about">About</Link></FooterItem>
    <FooterItem><Link to="/privacy">Privacy Policy</Link></FooterItem>
    <FooterItem><a href="https://github.com/automatarium/automatarium" target="_blank" rel="noreferrer nofollow">Source Code</a></FooterItem>

    <div style={{ flex: 1 }} />

    <FooterItem>Licensed under MIT</FooterItem>
  </Container>

export default Footer
