import { Trans, useTranslation } from 'react-i18next'
import { Main, Header } from '/src/components'

const About = () => {
  const { t } = useTranslation('about')
  return (
    <Main>
      <Header center linkTo="/" />
      <h2>{t('heading')}</h2>

      <p>{t('paragraph1')}</p>
      <p>
        <Trans
          ns="about"
          i18nKey="paragraph2"
          components={{ linkjflap: <a href="https://www.jflap.org/" target="_blank" rel="nofollow noreferrer" /> }}
        />
      </p>
      <p>
        <Trans
          ns="about"
          i18nKey="paragraph3"
          components={{
            linksource: <a href="https://github.com/automatarium/automatarium" target="_blank" rel="nofollow noreferrer" />,
            createissue: <a href="https://github.com/automatarium/automatarium/issues/new/choose" target="_blank" rel="nofollow noreferrer" />
          }}
        />
      </p>
    </Main>
  )
}

export default About
