import React, { useState, useEffect  } from 'react';

import { styled } from 'goober';

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
`;

const TourContent = styled('div')<TourContentProps>`
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    max-width: 50%;
    max-height: 80%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 1);

    ${({tourStep }) => (tourStep===1) && `
    position: absolute;
    top: 170px;
    right:20px;
    width: 200px;
    
   `}
    ${({tourStep }) => (tourStep===2) && `
    position: absolute;
    right:100px;
    width: 330px;
    
    `}
    ${({tourStep }) => (tourStep===3) && `
    position: absolute;
    left:400px;
    top:10px;
    width:300px;

    `}
    ${({tourStep }) => (tourStep===4) && `
    position: absolute;
    right:100px;
    width:200px;

    `}
    ${({tourStep }) => (tourStep===5) && `
    position: absolute;
    right:100px;
    width:200px;

    `}
    ${({tourStep }) => (tourStep===6) && `
    position: absolute;
    right:px;
    width:200px;

    `}
`;

const Banner = styled('banner')`
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    float: right;
    colour:orange;

`;
const Arrow = styled('div')`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
`;

const LeftArrow = styled(Arrow)`
  border-width: 10px 0 10px 15px;
  border-color: transparent transparent transparent #fff;
  
  top: 50%;
  transform: translateY(-50%);

`;

const RightArrow = styled(Arrow)`
  border-width: 10px 15px 10px 0;
  border-color: transparent #fff transparent transparent;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 20px;
  border-left: 1px solid #fff; 
`;




interface Step {
  target: string;
  content: string;
}

interface TourProps {
  onClose: () => void;
  Step: (step: number) => void;
}


const NewPageTour: React.FC<TourProps> = ({ onClose, Step  }) => {
  const [step, setStep] = useState<number>(0);
  const [step1,calledStep1Function]= useState<number>(0);
  let calledBannerStep = false;
  // Define tour steps
  const steps: Step[] = [
    {
      target: '', // CSS selector for the element to highlight
      content: 'Here you get to choose what type of project you want to create ',
    },

    {
      target: '', 
      content: 'You can choose from three types of automatons to create: Finite State Automaton, Push Down Automaton and Turing Machine',
   
    
    },
    {
      target: '', 
      content: 'Here you can select your previous saved projects',
   
    
    },
    {
      target: '', 
      content: 'You can also import a project from your local drive, through an Url or simply through raw data (note this can be done from the export section when creating your automataon or your json file)',
   
    
    },
   
   
    // Add more steps as needed
  ];
  useEffect(() => {
   Step(step)  

  }, [step, Step]);

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

        <TourContent tourStep={step} isBannerStep={steps[step].target === '.banner'}>  
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

export default NewPageTour;

