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
      content: 'We can now create transitions for our automata. Click on the transition tool and select and drag from q0 to q1 to create a transition between the two. A prompt will appear to label your transition between q1 and q0. As our finite state automata accepts languages that start with A, input a.'
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

  const FSAgifs = ['https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnBqMHcybWt0b240eHgyeGoxNnVnN3ZkamJ4NGR1aGxoZ2FmOXhzeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CEhv9ob2WWq2aUHWcK/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExamF0bWd6OW1mYXRhemF5am5pamE5cWx1cmRqZzkycnBybWM4azIxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gz6AZuHqdW620z78Cf/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmRlNDYzcmx0YjM0YW9hdGUzMnF4eWZ1dGI0d3RncWpscmU4Z2l5NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8gxgNz6BWWzNb7yMO9/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXl2OTN6N2FobDZ6anYwYTMwZHNpdmQ3a2I0OHVkazdrem9vNzNpcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lqAP4be6RHzicbwP4b/giphy.gif',
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXI2cDF0MWNjcGJnZ3pveWEwZnRmY3RuYXJvZzh5dWN4MGVzcDdxMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kNNU6jziwCCs7jRl4V/giphy.gif',
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGVhc3RqM2owZ2s3MHRqNnNncW11dTNiemVwY3hzYjJpdGdzN3NkZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F71XE0yKbDGzp7uSQj/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDk1cTV4ZnBsa2Z0ZWs3cmc5bno5cGdna2RsZm9nYTk2ZTdndXF3MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vK75iMbo4P3pewcg0j/giphy.gif'
  ]
  return (

        <TourOverlay>
            <TourContent tourStep={step} isBannerStep={steps[step].target === '.banner'}>
                <p>{steps[step].content}</p>

                {/* Place GIF here  */}
                <ExampleContainer>
                    <img src={FSAgifs[step]}/>
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

export default ExamplePageTour
