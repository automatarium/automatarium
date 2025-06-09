import React, { useState } from 'react'
import { styled } from 'goober'
import { ExampleContainer } from '../tutorialsStyle'
import { useTranslation } from 'react-i18next';

// Make interface for tourStep - current step and isBannerStep - boolean prop for styling/behavior
interface TourContentProps {
    isBannerStep: boolean;
    tourStep: number;
}

// Define styled components
const TourOverlay = styled('div')`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
`

const TourContent = styled('div')<TourContentProps>`
    pointer-events: auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    max-width: 50%;
    max-height: 80%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 1);
`

const TourButton = styled('button')`
  padding: 10px 20px;
  background-color: #cbccc6;
  color: #black; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px; 

  &:hover {
    background-color: #fbfcfa; /* Darker blue color on hover */
  }

  &:disabled {
    background-color: #26261f; 
    color: white;
    cursor: not-allowed;
  }

`

interface Step {
    target: string;
    content: string;
}

interface TourProps {
    onClose: () => void;
}

const PDAPageTour: React.FC<TourProps> = ({ onClose }) => {
  const { t } = useTranslation(['common', 'tutorials'])
  const [step, setStep] = useState<number>(0)
  // Define tour steps
  const steps: Step[] = [
    // target - css selector
    // content - text to display in tour
    {
      target: '',
      content: t('pda_tour.step1', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('pda_tour.step2', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('pda_tour.step3', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('pda_tour.step4', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('pda_tour.step5', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('pda_tour.step6', { ns: 'tutorials' })
    }
  ]

  // Next button
  const handleNext = () => {
    // Set step state, if all steps are not complete
    if (step < steps.length - 1) {
      setStep(step + 1)
    // If all steps complete, close tour
    } else {
      onClose()
    }
  }

  // Skip tour button
  const handleSkip = () => {
    onClose() // Close tour
  }

  // Previous button
  const handlePrevious = () => {
    // If previous step exists, set step state
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const PDAgifs = ['https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYndtZGVwdzJubnFuejNxeG9ybG4zYm9leGZleThrMDJveTA5eDc2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/uD4qr1AGOaKaJQrFXG/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExenBzYjJ1a3VyYml5bHViMXdtenh1bXVuMHRicHB5cjYxaWhscWd0ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NMgNDytfx6PQDc3EmP/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczNmbTllbjhpcmpqbTJ4Z2FkcTdod3p0MWs3cW9nMGxnNmRscWJ6ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/whdDzqi05KxOYIf5wu/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXNoOGswc2k3NTYxeWw2ODBkZHR0dXNocDVtejZybWFmbzFqNmVqNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5LzPcMx9Tfk1lTC6TN/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3AydjU0Z2s1cTJhMmNsZ25jMzgyMHdrZzBrZDU0M3k4OWVyZjVzdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IH0xajIIS5dZ9J68WW/giphy.gif',
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2l5MXNxcWZxMjYyNTdmNmtzMDJieHhnbXFpcDR1ODkyNnJqN2RobSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FDc1LxcmwaNpalpgKH/giphy.gif'

  ]
  return (

        <TourOverlay>
            <TourContent tourStep={step} isBannerStep={steps[step].target === '.banner'}>
                <p>{steps[step].content}</p>

                {/* Place GIF here  */}
                <ExampleContainer>
                    <img src={PDAgifs[step]}/>
                </ExampleContainer>

                <div className="tour-navigation">
                    <TourButton onClick={handlePrevious} disabled={step === 0}>{t('tour.previous', { ns: 'common' })}</TourButton>
                    <TourButton onClick={handleNext}>{step === steps.length - 1 ? t('tour.finish', { ns: 'common' }) : t('tour.next', { ns: 'common' })}</TourButton>
                    <TourButton onClick={handleSkip}>{t('tour.skip', { ns: 'common' })}</TourButton>
                </div>

            </TourContent>
        </TourOverlay>
  )
}

export default PDAPageTour
