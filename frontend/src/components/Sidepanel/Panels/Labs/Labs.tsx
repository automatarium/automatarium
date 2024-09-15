import { SectionLabel, Preference, Switch, Button } from '/src/components'
import { useState } from 'react'
import { useLabStore } from '/src/stores'

import {
  Wrapper,
} from './labsStyle'

const Labs = () => {
  const { lab, showLabWindow, setShowLabWindow } = useLabStore()


// echo text 
  const [description, setDescription] = useState('This is description of Assessment');
    // switch on / off the button 
    const [isEditing , setIsEditing ] = useState(false)
    const handleEditClick =()=>{
        if(isEditing){
            setIsEditing(false)
        }else{
            setIsEditing(true)
        }
    }
    //save edited text
    const handleDescription = (event) =>{
        setDescription(event.target.value)
    }




  if (showLabWindow) {
    console.log("Opened lab window")
  }

  return (<>
    <SectionLabel>Current Assessment</SectionLabel>
        {!lab && <>
        <Wrapper>You're not working on a lab right now</Wrapper>
        </>}
        {lab && <>
    <Wrapper>
    
    {/* input of title  */}
   
            <input  // enter the title of assessment 
            // onChange={ }
            // value={TitleInput}
            placeholder='Assessment Title'
            />
            <br />

    {/* input of description   <descAssessment>  */}
            <textarea name="description of assessment"
                value={description} 
                onChange={handleDescription}
                id="descAssessment" 
                rows={4} 
                cols={50}
                readOnly></textarea>

            <button 
            onClick={handleEditClick}
            >Edit</button>


    </Wrapper>
    <SectionLabel>Lab Setting</SectionLabel>
    <Wrapper>
      <Preference
        label={'Open questions to the left'}
        style={{ marginBlock: 0 }}
      >
        <Switch
          type="checkbox"
          checked={showLabWindow}
          disabled={!lab}
          onChange={e => setShowLabWindow(e.target.checked)}
        />
      </Preference>
    </Wrapper>
    <SectionLabel>Questions</SectionLabel>
    <Wrapper>
        
    </Wrapper>
    <SectionLabel>Export</SectionLabel>
    <Wrapper>
    <Button 
      onClick={() => {console.log("Button Click")}}>
        Export as Automatrium lab file
    </Button>
    <Button 
      onClick={() => {console.log("Button Click")}}>
        Export as URL
    </Button>
    </Wrapper>
    </>
    }
  </>
  )
}

export default Labs