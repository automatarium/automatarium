import React, { useState } from 'react';

import { styled } from 'goober';

interface TourContentProps {
    isBannerStep: boolean;
  }

// Define styled components
const TourOverlay = styled('div')`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TourContent = styled('div')<TourContentProps>`
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    max-width: 50%;
    max-height: 80%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 1);

    ${({ isBannerStep }) => isBannerStep && `
    position: absolute;
    left:100px;
    width: 300px;
  `}
`;

const Banner = styled('banner')`
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    float: right;
    colour:orange;

`;


interface Step {
  target: string;
  content: string;
}

interface TourProps {
  onClose: () => void;
}


const LandingPageTour: React.FC<TourProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(0);

  // Define tour steps
  const steps: Step[] = [
    {
      target: '.text', // CSS selector for the element to highlight
      content: 'Welcome! Would you like to have tour of the landing page?',
    },

    {
      target: '.banner', 
      content: 'Automatarium is a tool that allows the user to visualize concepts of Formal languages and Automata Theory, to get started you can select the start building button ',
   
    
    },
    // Add more steps as needed
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // End the tour if it reaches the last step
      onClose();
    }
  };

  const handleSkip = () => {
    onClose(); // Close the tour
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <TourOverlay>
            <TourContent  isBannerStep={steps[step].target === '.banner'}>
        <p>{steps[step].content}</p>
        <div className="tour-navigation">
          
          <button onClick={handlePrevious} disabled={step === 0}>Previous</button>

          <button onClick={handleNext}>{step === steps.length - 1 ? 'Finish' : 'Next'}</button>

          <button onClick={handleSkip} >Skip Tour</button>
         </div>
        </TourContent>
     </TourOverlay>
   
  );
};

export default LandingPageTour;

