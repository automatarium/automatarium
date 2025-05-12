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

const TMPageTour: React.FC<TourProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(0)
  // Define tour steps
  const steps: Step[] = [
    // target - css selector
    // content - text to display in tour
    {
      target: '',
      content: 'In this guided tutorial, we will walk you through the steps of how to build a turing machine which are capable of representing recursively enumerable languages. In this example, we will create a turing machine that increments a given binary number.'
    },

    {
      target: '',
      content: 'To begin, press on the state tool and click on the automatarium canvas to place three states. Right click q0 and q2 to designate them as the initial and final state.'
    },

    {
      target: '',
      content: 'We will now create two self-loops using the transition tool. You will notice a dialog box appear. There are 3 values the transition tool can take. "λ read" which reads the head of the tape, "λ write" which is the character we can replace the tape with" and "R, L, S" which dictates the moving the head either one direction to the right or left. Otherwise s for stationary.'
    },

    {
      target: '',
      content: 'As we are creating a turing machine that increments a given binary number, using the transition tool click on q0 to create two self-loops. We want to continue looping until the input is completed. As such, we will read 0, write 0 and move the tape right (R). We will also read 1, write 1 and move the tape right (R).'
    },

    {
      target: '',
      content: 'When we reach the end of our input, we want to stop moving to the right. Using the transition tool, create a transition from q0 to q1. We will leave our read and write as λ which represents an empty string in Automatarium. We will put left (L) as our direction to move.'
    },

    {
      target: '',
      content: 'We now want to replace all trailing 1s with 0s. To do this, remember that we are currently positioned at the end of our tape. So using the transition tool, click on q1 to create a self-loop to read 1, write 0 and move left.'
    },

    {
      target: '',
      content: 'Once all the trailing 1s are replaced with 0, we need to replace the next 0 or blank we encounter with 1. To do so, use the transition tool to add two transitions between q1 and q2. The first transition should read blank, write 1 and move right (R), the second should read 0, write 1 and move right (R).'
    },

    {
      target: '',
      content: 'Our turing machine to increment a binary number is done. We can click on the testing flask and enter our binary number into trace to increment it by 1. Click on the directional keys to progress through each step. You will see the turing machine at the bottom of your screen. The example provided below is using 101 in the trace, which increments to 110.'
    },

    {
      target: '',
      content: 'Automatarium also provides a feature that allows you to inspect an overview of your turing machine. This allows you to inspect your alphabet, state transition table and transition function. You can view this by pressing the informatory button icon on the right below the flask button. '
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
                    <TourButton onClick={handlePrevious} disabled={step === 0}>Previous</TourButton>
                    <TourButton onClick={handleNext}>{step === steps.length - 1 ? 'Finish' : 'Next'}</TourButton>
                    <TourButton onClick={handleSkip}>Skip Tour</TourButton>
                </div>

            </TourContent>
        </TourOverlay>
  )
}

export default TMPageTour
