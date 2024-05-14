import React, { useState, useEffect,ReactNode  } from 'react';

import { styled } from 'goober';
import { ToolPopup,ToolName, ToolHotkey, Animation  } from '/src/components/Toolbar/toolbarStyle';
import { Tool } from '/src/stores/useToolStore';

import Lottie from 'react-lottie-player/dist/LottiePlayerLight'
import cursorAnimation from '../../../components/Toolbar/animations/cursor.json'
import handAnimation from '../../../components/Toolbar/animations/hand.json'
import stateAnimation from '../../../components/Toolbar/animations/state.json'
import transitionAnimation from '../../../components/Toolbar/animations/transition.json'
import commentAnimation from '../../../components/Toolbar/animations/comment.json'

import { MousePointer2, Hand, MessageSquare, Circle, ArrowUpRight, ChevronDown } from 'lucide-react'
import { ChevronRight, FlaskConical, Pause, Info as InfoIcon, Settings2, Star } from 'lucide-react'
import { Info } from '/src/components/Sidepanel/Panels';


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
      content: 'This is the editor Page. You will get to build your Automatons here, here is a quick guide to the tools you will use.',
    },

    {
      target: '', 
      content: 'The Cursor tool allows you to select single or multiple states at once and move them around where you please.',

    },
    {
      target: '', 
      content: 'The Hand tool allows you to move around the screen.',
   
    
    },
    {
      target: '', 
      content: 'The State Tool will allow you to create states, which can be done any number of times.',
   
    
    },
    {
      target: '', 
      content: 'The Transition Tool will allow you to create transition between states. ',
   
    
    },
    {
      target: '', 
      content: 'You can also add your personal comments with the Comment Tool.',
   
    
    },
    {
      target: '', 
      content: 'The testing lab will alow you to test your automaton with different inputs.',
   
    
    },
    {
      target: '', 
      content: 'The "About Your Automaton Feature will showcase detailed information about your automaton. ',
   
    
    },
    {
      target: '', 
      content: 'The File options will allow you to change any preferences to State Identifiers, Operators and Project themes.',
   
    
    },
    {
      target: '', 
      content: 'The Template option will allow you to save a template of states for future use. Here you can also access your saved templates.',
   
    
    }

   
   
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
  const icons = [<MousePointer2 />, <Hand />, <Circle />, <ArrowUpRight />, <MessageSquare />,<FlaskConical/>,<InfoIcon/>,<Settings2/>,<Star/>];
  const other = [<Info/>]
  const animations = [cursorAnimation, handAnimation, stateAnimation, transitionAnimation, commentAnimation];


  return (
    <TourOverlay>

        <TourContent tourStep={step} isBannerStep={steps[step].target === '.banner'}>  
         
          
           {/* Render the icon based on the step */}
      {icons[step - 1]}

      {step === 7 &&
      (other[0])}
      
      <p>{steps[step].content}</p>
      
      {/* Render the animation based on the step */}
      {step >= 1 && step <= 5 && (
        <Animation>
          <Lottie loop animationData={animations[step - 1]} play={true} />
        </Animation>
      )}
      
      <div className="tour-navigation">
        <TourButton onClick={handlePrevious} disabled={step === 0}>Previous</TourButton>
        <TourButton onClick={handleNext}>{step === steps.length - 1 ? 'Finish' : 'Next'}</TourButton>
        <TourButton onClick={handleSkip}>Skip Tour</TourButton>
      </div>
        </TourContent>
     </TourOverlay>
   
  );
};

export default EditorPageTour;

