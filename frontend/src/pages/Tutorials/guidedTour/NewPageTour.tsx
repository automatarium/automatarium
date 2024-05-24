import React, { useState, useEffect } from 'react'

import { styled } from 'goober'

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
    top: 140px;
    right:20px;
    width: 200px;
    
   `}
    ${({ tourStep }) => (tourStep === 2) && `
    position: absolute;
    right:100px;
    width: 330px;
    
    `}
    ${({ tourStep }) => (tourStep === 3) && `
    position: absolute;
    left:400px;
    top:10px;
    width:300px;

    `}
    ${({ tourStep }) => (tourStep === 4) && `
    position: absolute;
    right:100px;
    width:200px;

    `}
    ${({ tourStep }) => (tourStep === 5) && `
    position: absolute;
    right:100px;
    width:200px;

    `}
    ${({ tourStep }) => (tourStep === 6) && `
    position: absolute;
    right:px;
    width:200px;

    `}
`

interface Step {
  target: string;
  content: string;
}

interface TourProps {
  onClose: () => void;
  Step: (step: number) => void;
}

const NewPageTour: React.FC<TourProps> = ({ onClose, Step }) => {
  const [step, setStep] = useState<number>(0)
  // Define tour steps
  const steps: Step[] = [
    {
      target: '', // CSS selector for the element to highlight
      content: 'Here you get to choose what type of projects you want to create.'
    },

    {
      target: '',
      content: 'You can choose from three types of automatons: Finite State Automaton, Push Down Automaton or a Turing Machine.'

    },
    {
      target: '',
      content: 'Here you can select your previous saved projects.'

    },
    {
      target: '',
      content: 'You can also import a project from your local drive, via Url or simply through raw data from a Json file (note a file to be imported can be created from the export section when creating your automaton).'

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
          <div className="tour-navigation">
              <TourButton onClick={handlePrevious} disabled={step === 0}>Previous</TourButton>
              <TourButton onClick={handleNext}>{step === steps.length - 1 ? 'Finish' : 'Next'}</TourButton>
              <TourButton onClick={handleSkip}>Skip Tour</TourButton>
          </div>

        </TourContent>
     </TourOverlay>

  )
}

export default NewPageTour
