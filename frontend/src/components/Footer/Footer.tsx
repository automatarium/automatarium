import { Link } from 'react-router-dom'

import { Container, FooterItem } from './footerStyle'
import { locales } from '/src/config/i18n'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t, i18n } = useTranslation('common')

  return (
    <Container>
      <FooterItem><Link to="/about">{t('about')}</Link></FooterItem>
      <FooterItem><Link to="/privacy">{t('privacy_policy')}</Link></FooterItem>
      <FooterItem><a href="https://github.com/automatarium/automatarium" target="_blank" rel="noreferrer nofollow">{t('source_code')}</a></FooterItem>

      <div style={{ flex: 1 }} />

      <FooterItem>
        <label htmlFor="languageSelector" style={{ marginRight: 2 }}>{t('language')}</label>
        <select
          id="languageSelector"
          value={i18n.resolvedLanguage}
          onChange={(event) => i18n.changeLanguage(event.target.value)}
          style={{ borderRadius: 6, padding: 2 }}
        >
          {Object.entries(locales).map(([localeCode, localeName]) => (
            <option key={localeCode} value={localeCode} style={{ zIndex: 1 }}>{localeName}</option>
          ))}
        </select>
      </FooterItem>
      <FooterItem>{t('licensed_mit')}</FooterItem>
    </Container>
  )
}

export default Footer
