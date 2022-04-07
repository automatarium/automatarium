import { useState } from 'react'
import { SkipBack, ChevronLeft, Play, ChevronRight, SkipForward } from 'lucide-react'

import { SectionLabel, Button, TextInput } from '/src/components'

const traceOutput = `a: q0 -> q1
b: q1 -> q2

SUCCESS`

import { 
  StepButtons,
  AddMultiTraceButton,
  MultiTraceInput,
  MultiTraceWrapper,
  RemoveMultiTraceInputButton,
  RunMultiTraceInputButton,
  Wrapper,
  TraceConsole,
} from './testingLabStyle'

const TestingLab = () => {
  const [traceInput, setTraceInput] = useState('')
  const [multiTraceInput, setMultiTraceInput] = useState([[]])

  const handleAddMultiTrace = () => setMultiTraceInput(prev => [...prev, []])

  const handleRemoveMultiTrace = index => {
    setMultiTraceInput((prev) => prev.filter((item) => item !== prev[index]));
  }

  const onMultiTraceInputChange = (index, event) => {
    event.preventDefault();
    event.persist()
    console.log(event)
    setMultiTraceInput(prev => {
      return prev.map((item, i) => {
        if (i !== index) return item;  
        return [
          event.target.value
        ]
      })
    })
  }
  
  const handleRunMultiTrace = () => {

  }

  return (
    <> 
      <SectionLabel>Trace</SectionLabel>
      <Wrapper>
        <TextInput
          onChange={e => setTraceInput(e.target.value)}
          value={traceInput}
          placeholder="Enter a value to test"
        />

        <StepButtons>
          <Button icon={<SkipBack />} />
          <Button icon={<ChevronLeft />} />
          <Button icon={<Play />} />
          <Button icon={<ChevronRight />} />
          <Button icon={<SkipForward />} />
        </StepButtons>

        <TraceConsole><pre>{traceOutput}</pre></TraceConsole>
      </Wrapper>

      <SectionLabel>Multi-run</SectionLabel>
      {multiTraceInput.map( (item, index) => (
        <MultiTraceWrapper key={index}>
          <MultiTraceInput
          onChange={(e) => onMultiTraceInputChange(index, e)}
          value={item}
          /> 
          <RemoveMultiTraceInputButton onClick={() => handleRemoveMultiTrace(index)}/>
        </MultiTraceWrapper>
      ))}
      <AddMultiTraceButton onClick={handleAddMultiTrace}/>
      <RunMultiTraceInputButton onClick={handleRunMultiTrace}/>
    </>
  )
}

export default TestingLab