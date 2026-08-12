import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  CircleDot,
  ListTree,
  Tags,
  FlaskConical,
  Route,
  FolderOpen
} from 'lucide-react'
import { Button } from '/src/components'
import { ButtonContainer, TourOverlay, TourContent } from './tourStyles'
import { Step } from './ProjectTour'

interface TourProps {
  onClose: () => void
}

const GrammarPageTour: React.FC<TourProps> = ({ onClose }) => {
  const { t } = useTranslation(['common', 'tutorials'])
  const [step, setStep] = useState(0)

  const steps: Step[] = [
    { target: '', content: t('grammar_tour.step1', { ns: 'tutorials' }) },
    { target: '', content: t('grammar_tour.step2', { ns: 'tutorials' }) },
    { target: '', content: t('grammar_tour.step3', { ns: 'tutorials' }) },
    { target: '', content: t('grammar_tour.step4', { ns: 'tutorials' }) },
    { target: '', content: t('grammar_tour.step5', { ns: 'tutorials' }) },
    { target: '', content: t('grammar_tour.step6', { ns: 'tutorials' }) },
    { target: '', content: t('grammar_tour.step7', { ns: 'tutorials' }) }
  ]

  const icons = [
    <BookOpen key="welcome" size={28} />,
    <CircleDot key="start" size={28} />,
    <ListTree key="productions" size={28} />,
    <Tags key="detect" size={28} />,
    <FlaskConical key="test" size={28} />,
    <Route key="derivation" size={28} />,
    <FolderOpen key="file" size={28} />
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onClose()
    }
  }

  const handleSkip = () => onClose()

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <TourOverlay>
      <TourContent>
        {icons[step]}
        <p>{steps[step].content}</p>
        <ButtonContainer>
          <Button secondary onClick={handleSkip}>
            {t('tour.skip', { ns: 'common' })}
          </Button>
          <Button onClick={handlePrevious} disabled={step === 0}>
            {t('tour.previous', { ns: 'common' })}
          </Button>
          <Button onClick={handleNext}>
            {step === steps.length - 1
              ? t('tour.finish', { ns: 'common' })
              : t('tour.next', { ns: 'common' })}
          </Button>
        </ButtonContainer>
      </TourContent>
    </TourOverlay>
  )
}

export default GrammarPageTour
