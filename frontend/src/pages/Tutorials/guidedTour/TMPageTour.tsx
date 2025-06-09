import React, { useState } from 'react'
import { styled } from 'goober'
import { ExampleContainer } from '../tutorialsStyle'
import { useTranslation } from 'react-i18next'

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

const TMPageTour: React.FC<TourProps> = ({ onClose }) => {
  const { t } = useTranslation(['common', 'tutorials'])
  const [step, setStep] = useState<number>(0)
  // Define tour steps
  const steps: Step[] = [
    // target - css selector
    // content - text to display in tour
    {
      target: '',
      content: t('tm_tour.step1', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('tm_tour.step2', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('tm_tour.step3', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('tm_tour.step4', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('tm_tour.step5', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('tm_tour.step6', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('tm_tour.step7', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('tm_tour.step8', { ns: 'tutorials' })
    },

    {
      target: '',
      content: t('tm_tour.step9', { ns: 'tutorials' })
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

  const TMgifs = ['https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXF0eHB6anF1d2k5ZHpzcHkzNDFzOHhmbzdiMTZ5aHJtc3N3bmhhZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BfG7jCKbBaFFqXtguF/giphy.gif',
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmNscHFpMGR2dWhvZjFvYWsxcXJiMDk3c2ZvYnkzYTdvNXFrNjNudyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/N4kbu1oD7yBjpqJ3Ds/giphy.gif',
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzZkdHN4Y3NsejdkMHY0YTlwOTRrZHIxb3NodThsa2U5eDA2N3pubCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/09m2R4ygCMmKaqgsMu/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzY1cDl2ZnVqeHVjMThnYW05cnlzZXlkbXB1cWF3Z3d0OTFlZmx1dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qa6Lla3yz0N9BpuVts/giphy.gif',
    'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3hkc250bWF1bXdnNmoybm04dXU1N2tuNDVhNHB6OXFsaGVnM2U5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kyFHjOElupMGiMJFGX/giphy.gif',
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExanhseG8waDZtcGN4ODdldnU0YzY0a3JkM2JyeWxhNjZmYjNubWlwNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ouqp9MIKu1Mn8xuDks/giphy.gif',
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXdmMjhsOWVidGRsbHFyMWI1eGg5Y3kyeGpqNnJjOXN0OW0waHdjcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f4uDAsTo18z15yo5Jt/giphy.gif',
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExajN6ZnR3OThyZmQ1ZjM4a2E4N2FvMTkzdTZ0a2Y5YzVkaG5sbnByZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bThh2HbFg7bVY3Nfnp/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzlxdm81aGJqZjJqdjd4MzNhd3RnZDFqNjczNG9kZThtOHB2ZHhidCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MLHMaIrBGcOABkZuLN/giphy.gif'
  ]
  return (

        <TourOverlay>
            <TourContent tourStep={step} isBannerStep={steps[step].target === '.banner'}>
                <p>{steps[step].content}</p>

                {/* Place GIF here  */}
                <ExampleContainer>
                    <img src={TMgifs[step]}/>
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

export default TMPageTour
