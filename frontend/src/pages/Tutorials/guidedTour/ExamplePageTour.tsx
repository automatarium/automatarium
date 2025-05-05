import React, { useState } from 'react'
import { styled } from 'goober'

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
      content: 'Welcome to the Finite State Automaton Example. In this example, we will walk you through the steps of how to build a Finite State Automata for the set of all strings that start with A and end with B'
    },

    {
      target: '',
      content: 'To begin, press on the state tool and click on the automatarium canvas to place your state.'
    },

    {
      target: '',
      content: 'Right clicking a state will open up a state menu. Set q0 as an initial state and q1 as a final state. Our states are now set up properly.'
    },

    {
      target: '',
      content: 'We can now create transitions for our automata. Click on the transition tool and select and drag from q0 to q1 to create a transition between the two.'
    },

    {
      target: '',
      content: 'When you have created a transition between q0 and q1, you will prompt a dialog box where the transition can be labeled. Press input a. As we are making an automata that takes the set of all strings must start with A.'
    },

    {
      target: '',
      content: 'Using the selection tool, please click on q1 to make a transition loop. We will then label our transition from the range [a-z], as we can accept all characters so long as the string ends with B. '
    },

    {
      target: '',
      content: 'Now create a transition between q1 and q2, labelling our transition b, to ensure that our automata accepts strings that end with B.'
    },

    {
      target: '',
      content: 'We have now successfully created our finite state automata. We can test the automata by clicking on the flask icon, inputting a string and using the directional buttons to see the output.'
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
