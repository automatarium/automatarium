import { Link } from 'react-router-dom'

import { Container, FooterItem } from './footerStyle'
import { useTranslation } from 'react-i18next'

const Footer = () => {

  const { t } = useTranslation('common')

  return (
    <Container>
      <FooterItem><Link to="/about">{t('about')}</Link></FooterItem>
      <FooterItem><Link to="/privacy">{t('privacy_policy')}</Link></FooterItem>
      <FooterItem><a href="https://github.com/automatarium/automatarium" target="_blank" rel="noreferrer nofollow">{t('source_code')}</a></FooterItem>

      <div style={{ flex: 1 }} />

      <FooterItem>{t('licensed_mit')}</FooterItem>
    </Container>
  )
}

export default Footer
