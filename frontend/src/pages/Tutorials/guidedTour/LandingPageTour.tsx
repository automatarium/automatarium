import React, { useState, useEffect } from 'react'

import { styled } from 'goober'
import { useTranslation } from 'react-i18next'
import { ButtonContainer, TourOverlay } from './tourStyles'
import { Button } from '/src/components'

const TourContent = styled('div')<TourContentProps>`
    pointer-events: auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    max-width: 50%;
    max-height: 80%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 1);

    ${({ tourStep }) => (tourStep === 1) && `
    position: absolute;
    left:100px;
    width: 400px;
    
   `}
    ${({ tourStep }) => (tourStep === 2) && `
    position: absolute;
    left:100px;
    width: 400px;
    
    `}
    ${({ tourStep }) => (tourStep === 3) && `
    position: absolute;
    right:10px;
    width:200px;

    `}
    ${({ tourStep }) => (tourStep === 4) && `
    position: absolute;
    right:10px;
    width:200px;

    `}
    ${({ tourStep }) => (tourStep === 5) && `
    position: absolute;
    right:10px;
    width:200px;

    `}
    ${({ tourStep }) => (tourStep === 6) && `
    position: absolute;
    right:10px;
    width:200px;

    `}
`

interface TourProps {
  onClose: () => void;
  Step: (step: number) => void;
}

const LandingPageTour: React.FC<TourProps> = ({ onClose, Step }) => {
  const { t } = useTranslation(['common', 'tutorials'])
  const [step, setStep] = useState<number>(0)
  // Define tour steps
  const steps: Step[] = [
    {
      target: '.text', // CSS selector for the element to highlight
      content: t('landing_tour.step1', { ns: 'tutorials' }),
      gifUrl: null,
    },
    {
      target: '.banner',
      content: t('landing_tour.step2', { ns: 'tutorials' }),
      gifUrl: null,
    },
    {
      target: '',
      content: t('landing_tour.step3', { ns: 'tutorials' }),
      gifUrl: null,
    },
    {
      target: '',
      content: t('landing_tour.step4', { ns: 'tutorials' }),
      gifUrl: null,
    },
    {
      target: '',
      content: t('landing_tour.step5', { ns: 'tutorials' }),
      gifUrl: null,
    },
    {
      target: '',
      content: t('landing_tour.step6', { ns: 'tutorials' }),
      gifUrl: null,
    },
    {
      target: '',
      content: t('landing_tour.step7', { ns: 'tutorials' }),
      gifUrl: null,
    }

    // Add more steps as needed
  ]
  useEffect(() => {
    Step(step)
  }, [step, Step])

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      // End the tour if it reaches the last step
      onClose()
    }
  }

  const handleSkip = () => {
    onClose() // Close the tour
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <TourOverlay>
        <TourContent tourStep={step} isBannerStep={steps[step].target === '.banner'}>
          <p>{steps[step].content}</p>
          <ButtonContainer>
            <Button onClick={handlePrevious} disabled={step === 0}>{t('tour.previous', { ns: 'common' })}</Button>
            <Button onClick={handleNext}>{step === steps.length - 1 ? t('tour.finish', { ns: 'common' }) : t('tour.next', { ns: 'common' })}</Button>
            <Button secondary onClick={handleSkip}>{t('tour.skip', { ns: 'common' })}</Button>
          </ButtonContainer>
        </TourContent>
     </TourOverlay>
  )
}

export default LandingPageTour
