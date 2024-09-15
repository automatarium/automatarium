import { SectionLabel, Preference, Switch, Button } from '/src/components'
import { useState } from 'react'
import { useLabStore } from '/src/stores'

import {
  Wrapper,
} from './labsStyle'

const SteppingLab = () => {
  const [showLabWindow, setShowLabWindow] = useState(false)
  const lab = useLabStore(s => s.lab)

  if (showLabWindow) {
    console.log("Opened lab window")
  }

  return (<>
    <SectionLabel>Current Assessment</SectionLabel>
    {!lab && <>
    <Wrapper>You're not working on a lab right now</Wrapper>
    </>}
    {lab && <>
    <Wrapper></Wrapper>
    <SectionLabel>Lab Setting</SectionLabel>
    <Wrapper>
      <Preference
        label={'Open questions to the left'}
        style={{ marginBlock: 0 }}
      >
        <Switch
          type="checkbox"
          checked={showLabWindow}
          onChange={e => setShowLabWindow(e.target.checked)}
        />
      </Preference>
    </Wrapper>
    <SectionLabel>Questions</SectionLabel>
    <Wrapper></Wrapper>
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

export default SteppingLab