import React, { useState } from 'react'
import { ExampleContainer } from '../tutorialsStyle'
import { useTranslation } from 'react-i18next'
import { Button } from '/src/components';
import { ButtonContainer, TourContent, TourOverlay } from './tourStyles';

interface TourProps {
    onClose: () => void;
    steps: Step[]
}

export interface TourContentProps {
  isBannerStep: boolean
  tourStep: number
}

export interface Step {
  target: string
  content: string
  gifUrl?: string
}

const ProjectTour: React.FC<TourProps> = ({ steps, onClose }) => {
  const { t } = useTranslation(['common', 'tutorials'])
  const [step, setStep] = useState<number>(0)
  // Define tour steps

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

  return (
    <TourOverlay>
      <TourContent tourStep={step} isBannerStep={steps[step].target === ".banner"}>
        <p>{steps[step].content}</p>
        <ExampleContainer>
          <img src={steps[step].gifUrl} />
        </ExampleContainer>
        <ButtonContainer>
          <Button secondary onClick={handleSkip}>
            {t("tour.skip", { ns: "common" })}
          </Button>
          <Button onClick={handlePrevious} disabled={step === 0}>
            {t("tour.previous", { ns: "common" })}
          </Button>
          <Button onClick={handleNext}>
            {step === steps.length - 1 ? t("tour.finish", { ns: "common" }) : t("tour.next", { ns: "common" })}
          </Button>
        </ButtonContainer>
      </TourContent>
    </TourOverlay>
  )
}

export default ProjectTour
