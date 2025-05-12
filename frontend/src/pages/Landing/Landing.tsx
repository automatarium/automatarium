import React, { useState } from 'react'
import { Github, HelpCircle } from 'lucide-react'

import { Sections, Section, Banner } from './landingStyle'
import { Main, Button, Header, Table, ProjectCard } from '/src/components'
import TourButton from '/src/components/TourButton/TourButton'

import ExampleAutomaton from './components/ExampleAutomaton'
import TestingLab from './components/TestingLab'

import { PROJECT_THUMBNAIL_WIDTH } from '/src/config/rendering'
import LandingPageTour from '../Tutorials/guidedTour/LandingPageTour'
import { useTranslation } from 'react-i18next'

const Landing = () => {
  const { t } = useTranslation('landing')
  // creating booleans for tour
  const [showTour, setShowTour] = useState(false)
  const [Step, setStep] = useState(0)

  const scrollToArea = (step: number) => {
    // const element = document.getElementById('start-build');
    // if (element) {
    //   element.scrollIntoView({   behavior: 'smooth', block: 'start' });
    // }
    if (step === 1) {
      window.scrollTo({ top: 10, behavior: 'smooth' })
    } else if (step === 2) {
      window.scrollTo({ top: 10, behavior: 'smooth' })
    } else if (step === 3) {
      window.scrollTo({ top: 600, behavior: 'smooth' })
    } else if (step === 4) {
      window.scrollTo({ top: 600, behavior: 'smooth' })
    } else if (step === 5) {
      window.scrollTo({ top: 600, behavior: 'smooth' })
    } else if (step === 6) {
      window.scrollTo({ top: 1200, behavior: 'smooth' })
    }
  }

  const handleBannerStep = (step: number) => {
    // Define the behavior when the tour reaches the banner step
    if (step) {
      // setIsBannerStep(true);
      scrollToArea(step)
      setStep(step)
    }
  }

  const startTour = () => {
    setShowTour(true)
  }

  const closeTour = () => {
    setShowTour(false)
    setStep(0)
  }

  return (
  <Main fullWidth style={{ paddingBottom: 0 }}>
    <Header center />
    <Sections>
      <Section>
        <ExampleAutomaton />
        <div className="text">
          <p>{t('section1.description.paragraph1')}</p>
          <p>{t('section1.description.paragraph2')}</p>
          <p>{t('section1.description.paragraph3')}</p>
          <Button id="start-build" to="/new"
            style={{
              backgroundColor: (Step === 1) ? '#90EE90' : '',
              color: (Step === 1) ? 'green' : 'white'
            } }
          >{t('section1.button.start_building')}</Button>
          <p>{t('section1.description.paragraph4')}</p>
          <Button to='/tutorials'
          style={{
            backgroundColor: (Step === 2) ? '#90EE90' : '',
            color: (Step === 2) ? 'green' : 'white'

          } }>{t('section1.button.tutorials')}</Button>
        </div>
      </Section>

      <Banner>
        <h3>{t('banner1.description.heading')}</h3>
        <p>{t('banner1.description.paragraph1')}</p>
        <Button
          icon={<Github />}
          href="https://github.com/automatarium/automatarium"
          target="_blank"
          rel="nofollow noreferrer"
        >{t('banner1.button.visit_github')}</Button>
      </Banner>

      <Section $reverse>
        <TestingLab Step={Step} />
        <div className="text">
          <h3>{t('section2.description.heading')}</h3>
          <p>{t('section2.description.paragraph1')}</p>
          <p>{t('section2.description.paragraph2')}</p>
        </div>
      </Section>

      <Section>
        <Table>
          <tbody>
            <tr><th>&delta;</th><th>a</th><th>b</th></tr>
            <tr><th>q0</th><td>q1</td><td>-</td></tr>
            <tr><th>q1</th><td>-</td><td>q2</td></tr>
            <tr><th>q2</th><td>-</td><td>-</td></tr>
          </tbody>
        </Table>
        <div className="text">
          <h3>{t('section3.description.heading')}</h3>
          <p>{t('section3.description.paragraph1')}</p>
        </div>
      </Section>

      <Section $reverse>
        <ProjectCard name={t('section4.project_name')} type="FSA" date="2 days ago" disabled width={PROJECT_THUMBNAIL_WIDTH} $istemplate={false}/>
        <div className="text">
          <h3>{t('section4.description.heading')}</h3>
          <p>{t('section4.description.paragraph1')}</p>
        </div>
      </Section>

    <Banner>
          <h3>{t('banner2.description.heading')}</h3>
          <p>{t('banner2.description.paragraph1')}</p>
          <Button to="/new">{t('banner2.button.start_building')}</Button>
    </Banner>
    </Sections>

    <TourButton
      icon={<HelpCircle />}
      onClick={startTour}>
    </TourButton>

    {/* Render the tour if showTour is true */}
    {showTour && <LandingPageTour onClose={closeTour} Step={handleBannerStep} />}
    </Main>
  )
}

export default Landing
