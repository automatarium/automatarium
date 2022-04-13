import { useState } from 'react'
import { SkipBack, ChevronLeft, Play, ChevronRight, SkipForward, Plus } from 'lucide-react'

import { SectionLabel, Button, TextInput } from '/src/components'
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
import useProjectStore from '../../../../../../stores/useProjectStore'
import simulateFSA from '@automatarium/simulation'

const traceOutput = `a: q0 -> q1
b: q1 -> q2

SUCCESS`

const TestingLab = () => {
  const [traceInput, setTraceInput] = useState('')
  const [multiTraceInput, setMultiTraceInput] = useState([[]])
  const graph = {
    states: useProjectStore(s => s.project.states),
    transitions: useProjectStore(s => s.project.transitions),
    initialState: useProjectStore(s => s.project.initialState)
  }

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

  const handleRun = (input) => {
    const x = simulateFSA({
      initialState: 0,
      states: [{
        id: 0, //TODO: can be int?
        label: null,
        x: 150,
        y: 150,
        isFinal: false,
      }, {
        id: 1,
        label: null,
        x: 330,
        y: 150,
        isFinal: false,
      },{
        id: 2,
        label: null,
        x: 150,
        y: 350,
        isFinal: false,
      }, {
        id: 3,
        label: null,
        x: 550,
        y: 350,
        isFinal: true,
      }],
      transitions: [{
        from: 0,
        to: 1,
        read: 'a',
      }, {
        from: 1,
        to: 2,
        read: 'z',
      },{
        from: 2,
        to: 3,
        read: 'a'
      }, {
        from: 2,
        to: 3,
        read: 'b'
      }, {
        from: 2,
        to: 3,
        read: 'c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t',
      }]}, 'azb')
    // console.log(graph);
    // console.log(input);
    // const output = simulateFSA(graph, input)
    console.log(x);
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
          <Button icon={<SkipBack size={20} />} />
          <Button icon={<ChevronLeft size={22} />} />
          <Button icon={<Play size={20} />} onClick={() => handleRun(traceInput)}/>
          <Button icon={<ChevronRight size={22} />} />
          <Button icon={<SkipForward size={20} />} />
        </StepButtons>

        <TraceConsole><pre>{traceOutput}</pre></TraceConsole>
      </Wrapper>

      <SectionLabel>Multi-run</SectionLabel>
        <Wrapper>
          {multiTraceInput.map( (item, index) => (
              <MultiTraceWrapper key={index}>
                <MultiTraceInput
                spellCheck={false}
                onChange={(e) => onMultiTraceInputChange(index, e)}
                value={item}
                /> 
                <RemoveMultiTraceInputButton onClick={() => handleRemoveMultiTrace(index)}/>
              </MultiTraceWrapper>
          ))}
          <AddMultiTraceButton onClick={handleAddMultiTrace}>
            <Plus />
          </AddMultiTraceButton>
          <RunMultiTraceInputButton onClick={handleRunMultiTrace}>Run</RunMultiTraceInputButton>
      </Wrapper>
    </>
  )
}

export default TestingLab