import React, { useState, useEffect } from 'react'

import { styled } from 'goober'
import { Animation } from '/src/components/Toolbar/toolbarStyle'

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

const ExamplePageTour: React.FC<TourProps> = ({ onClose }) => {
    const [step, setStep] = useState<number>(0)
    // Define tour steps
    const steps: Step[] = [
        // target - css selector
        // content - text to display in tour
        {
            target: '', 
            content: 'Testing1' 
        },

        {
            target: '',
            content: 'Testing2'
        }
    ]

    // Next button
    const handleNext = () => {
        // Set step state, if all steps are not complete
        if (step < steps.length - 1) {
            setStep(step + 1)
        }
        // If all steps complete, close tour
        else {
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

export default ExamplePageTour