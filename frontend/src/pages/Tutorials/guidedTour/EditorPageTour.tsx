import React, { useState, useEffect,ReactNode  } from 'react';

import { styled } from 'goober';
import { ToolPopup,ToolName, ToolHotkey, Animation  } from '/src/components/Toolbar/toolbarStyle';
import { Tool } from '/src/stores/useToolStore';

import Lottie from 'react-lottie-player/dist/LottiePlayerLight'
import { MousePointer2 } from 'lucide-react';
import cursorAnimation from '../../../components/Toolbar/animations/cursor.json'
import handAnimation from '../../../components/Toolbar/animations/hand.json'
import stateAnimation from '../../../components/Toolbar/animations/state.json'
import transitionAnimation from '../../../components/Toolbar/animations/transition.json'
import commentAnimation from '../../../components/Toolbar/animations/comment.json'


interface TourContentProps {
    isBannerStep: boolean;
    tourStep: number;
  }

  
interface ToolPopupType {
  visible: boolean;
  y: number;
  tool: ToolItem;
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

interface ToolItem {
  label: string
  hotkey: string
  description: string
  value: Tool
  icon: ReactNode
  animation: object
}


const EditorPageTour: React.FC<TourProps> = ({ onClose, Step  }) => {
  const [step, setStep] = useState<number>(0);
  const [step1,calledStep1Function]= useState<number>(0);
  const [toolPopup, setToolPopup] = useState<ToolPopupType>({
    visible: false,
    y: 0,
    tool: {} as ToolItem,
  });

  const toolItems: ToolItem[] = [
    {
      label: 'Cursor tool',
      hotkey: 'V',
      description: 'Select and move items',
      value: 'cursor',
      icon: <MousePointer2 />,
      animation: cursorAnimation
    },
    // Add other tool items here...
  ];
  let calledBannerStep = false;
  // Define tour steps
  const steps: Step[] = [
    {
      target: '', // CSS selector for the element to highlight
      content: 'This is the editor Page. You will get to build your Automatons here, let me step you through the built in functionality.',
    },

    {
      target: '', 
      content: 'The Cursor tool allows you to select single or multiple states at once and move them around where you please.',

    },
    {
      target: '', 
      content: 'The Hand tool allows the user to move around the screen.',
   
    
    },
    {
      target: '', 
      content: 'The State Tool (which is in the form of a cirlce) will allow the user to create states any number of times ',
   
    
    },
    {
      target: '', 
      content: 'The Transition Tool (which is the form of an arrow) will allow the user to creates transition between states ',
   
    
    },
    {
      target: '', 
      content: 'You can also add your personal comments with the Comment Tool',
   
    
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

  type ToolPopupType = {visible: boolean, y: number, tool: ToolItem}
  // const [toolPopup, setToolPopup] = useState<ToolPopupType>({} as ToolPopupType)

  return (
    <TourOverlay>

        <TourContent tourStep={step} isBannerStep={steps[step].target === '.banner'}>  
          <p>{steps[step].content}</p>
          <div className="tour-navigation">
            <button onClick={handlePrevious} disabled={step === 0}>Previous</button>

            <button onClick={handleNext}>{step === steps.length - 1 ? 'Finish' : 'Next'}</button>

            <button onClick={handleSkip} >Skip Tour</button>
          </div>

          {step === 1 && (
            <Animation>
              <Lottie loop animationData={cursorAnimation} play={true} />
            </Animation>
         )}
          {step === 2 && (
            <Animation>
              <Lottie loop animationData={handAnimation} play={true} />
            </Animation>
         )}
          {step === 3 && (
            <Animation>
              <Lottie loop animationData={stateAnimation} play={true} />
            </Animation>
         )}
         {step === 4 && (
            <Animation>
              <Lottie loop animationData={transitionAnimation} play={true} />
            </Animation>
         )}
             {step === 5 && (
            <Animation>
              <Lottie loop animationData={commentAnimation} play={true} />
            </Animation>
         )}
          
        </TourContent>
     </TourOverlay>
   
  );
};

export default EditorPageTour;

