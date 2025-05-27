import React, { useState } from 'react'
import { styled } from 'goober'
import { ExampleContainer } from '../tutorialsStyle'

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
  const [step, setStep] = useState<number>(0)
  // Define tour steps
  const steps: Step[] = [
    // target - css selector
    // content - text to display in tour
    {
      target: '',
      content: 'In this guided tutorial, we will walk you through the steps of how to build a push-down automata which are machines capable of representing context-free grammars. For this tour, we will walk you through building a PDA that recognises palidromes containing the alphabet {a, b, c}'
    },

    {
      target: '',
      content: 'To begin, press on the state tool and click on the automatarium canvas to place two states. Right click on both states to initialise one of each as an initial and final state.'
    },

    {
      target: '',
      content: 'We will now create three self-loop transitions at q0 for our palindrome language {a, b, c}. Click on your state, using the transition tool. We will now define our transition loop. You will see the transition dialog box appear. "λ (read)" is for the input taken, "λ (pop)" is to pop the stack and "λ (push)" is to push the stack. For our palindrome language {a, b, c} define these as our input and push them to the stack as shown below.'
    },

    {
      target: '',
      content: 'Using the transition tool, create 4 transitions between q0 and q1. 3 transitions for popping each letter of the palidrome and an empty transition to indicate the midpoint of the palidrome.'
    },

    {
      target: '',
      content: 'We will now create three self-loop transitions at q1 for our palinrome language {a, b, c}. Click on the state, using the transition tool. In the transition dialog box, for each string in the palindrome language {a, b, c}, define a pop for their uppercase versions {A, B, C}.'
    },

    {
      target: '',
      content: 'We can now test our push-down automata. Press on the testing flask and input a palindrome that uses the language {a, b, c}. For example, take the string "abcba" and you should see that our push down automata accepts this as a palidrome, as we press the directional keys. We can also visualise our stack in the bottom right of the screen.'
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
                    <TourButton onClick={handlePrevious} disabled={step === 0}>Previous</TourButton>
                    <TourButton onClick={handleNext}>{step === steps.length - 1 ? 'Finish' : 'Next'}</TourButton>
                    <TourButton onClick={handleSkip}>Skip Tour</TourButton>
                </div>

            </TourContent>
        </TourOverlay>
  )
}

export default PDAPageTour
