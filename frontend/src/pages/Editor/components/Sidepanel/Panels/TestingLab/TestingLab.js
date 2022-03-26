import { useState } from 'react'
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
        <TraceButton/>
        <TraceButton/>
        <TraceButton/>
        <TraceButton/>
        <TraceButton/>
      </TraceButtonContainer>
      <TraceOutput/>
      <Subtitle>MULTI-RUN</Subtitle>
      { multiTraceInput.map( (item, index) => (
        <MultiTraceWrapper key={index}>
          <MultiTraceInput
          onChange={(e) => onMultiTraceInputChange(index, e)}
          value={item}
          /> 
          <RemoveMultiTraceInputButton onClick={(e) => handleRemoveMultiTrace(index)}/>
        </MultiTraceWrapper>
      ))}
      <AddMultiTraceButton onClick={handleAddMultiTrace}/>
      <RunMultiTraceInputButton onClick={handleRunMultiTrace}/>
    </>
  )
}

export default TestingLab