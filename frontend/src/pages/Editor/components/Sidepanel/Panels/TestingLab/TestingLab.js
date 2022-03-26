import { useState } from 'react'
import { SkipBack, ChevronLeft, Play, ChevronRight, SkipForward } from 'lucide-react'

import { TraceOutput } from '/src/components/'
import { 
  Title, 
  Subtitle, 
  TraceInput, 
  TraceButton, 
  TraceButtonContainer, 
  AddMultiTraceButton, 
  MultiTraceInput, 
  MultiTraceWrapper, 
  RemoveMultiTraceInputButton, 
  RunMultiTraceInputButton 
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
      <Title>Testing Lab</Title>
      <Subtitle>TRACE</Subtitle>
      <TraceInput onChange={event => setTraceInput(event.target.value)} />
      <TraceButtonContainer>
        <TraceButton $active={true}><SkipBack size={20}/></TraceButton>
        <TraceButton $active={true}><ChevronLeft size={20}/></TraceButton>
        <TraceButton $active={true}><Play size={20}/></TraceButton>
        <TraceButton $active={true}><ChevronRight size={20}/></TraceButton>
        <TraceButton $active={true}><SkipForward size={20}/></TraceButton>
      </TraceButtonContainer>
      <TraceOutput/>
      <Subtitle>MULTI-RUN</Subtitle>
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