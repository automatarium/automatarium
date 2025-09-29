import React, { useState } from 'react'

import { styled } from 'goober'
import { Animation } from '/src/components/Toolbar/toolbarStyle'

import Lottie from 'react-lottie-player/dist/LottiePlayerLight'
import cursorAnimation from '../../../components/Toolbar/animations/cursor.json'
import handAnimation from '../../../components/Toolbar/animations/hand.json'
import stateAnimation from '../../../components/Toolbar/animations/state.json'
import transitionAnimation from '../../../components/Toolbar/animations/transition.json'
import commentAnimation from '../../../components/Toolbar/animations/comment.json'

import { MousePointer2, Hand, MessageSquare, Circle, ArrowUpRight, FlaskConical, Info as InfoIcon, Settings2, Star, GraduationCap } from 'lucide-react'

import { Info } from '/src/components/Sidepanel/Panels'
import { useTranslation } from 'react-i18next'
import { ButtonContainer, TourOverlay } from './tourStyles'
import { Button } from '/src/components'
import { Step, TourContentProps } from './ProjectTour'

const TourContent = styled('div')<TourContentProps>`
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    max-width: 50%;
    max-height: 80%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 1);
`

interface TourProps {
  onClose: () => void;
}

const EditorPageTour: React.FC<TourProps> = ({ onClose }) => {
  const { t } = useTranslation(['common', 'tutorials'])
  const [step, setStep] = useState<number>(0)

  // Define tour steps
  const steps: Step[] = [
    {
      target: '', // CSS selector for the element to highlight
      content: t('editor_tour.step1', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step2', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step3', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step4', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step5', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step6', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step7', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step8', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step9', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step10', { ns: 'tutorials' }),
    },
    {
      target: '',
      content: t('editor_tour.step11', { ns: 'tutorials' }),
    }
    // Add more steps as needed
  ]

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

  const icons = [
    <MousePointer2 key="MousePointer2" />,
    <Hand key="Hand" />,
    <Circle key="Circle" />,
    <ArrowUpRight key="ArrowUpRight" />,
    <MessageSquare key="MessageSquare" />,
    <FlaskConical key="FlaskConical" />,
    <InfoIcon key="InfoIcon" />,
    <Settings2 key="Settings" />,
    <Star key="Star" />,
    <GraduationCap key="GraduationCap" />
  ]

  const other = [<Info key="Info"/>]
  const animations = [cursorAnimation, handAnimation, stateAnimation, transitionAnimation, commentAnimation]

  return (
    <TourOverlay>
      <TourContent tourStep={step} isBannerStep={steps[step].target === ".banner"}>
        {/* Render the icon based on the step */}
        {icons[step - 1]}

        {step === 7 && other[0]}

        <p>{steps[step].content}</p>

        {/* Render the animation based on the step */}
        {step >= 1 && step <= 5 && (
          <Animation>
            <Lottie loop animationData={animations[step - 1]} play={true} />
          </Animation>
        )}

        <ButtonContainer>
          <Button onClick={handlePrevious} disabled={step === 0}>
            {t("tour.previous", { ns: "common" })}
          </Button>
          <Button onClick={handleNext}>
            {step === steps.length - 1 ? t("tour.finish", { ns: "common" }) : t("tour.next", { ns: "common" })}
          </Button>
          <Button onClick={handleSkip}>{t("tour.skip", { ns: "common" })}</Button>
        </ButtonContainer>
      </TourContent>
    </TourOverlay>
  )
}

export default EditorPageTour
