import { useEffect, useState } from 'react'
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
import useProjectStore from '/src/stores/useProjectStore'
import { simulateFSA } from '@automatarium/simulation'

const TestingLab = () => {
  const [traceInput, setTraceInput] = useState('')
  const [traceOutput, setTraceOutput] = useState('')
  const [tracerIdx, setTracerIdx] = useState(0)
  const [trace, setTrace] = useState([])
  const [multiTraceInput, setMultiTraceInput] = useState([[]])

  const graph = {
    states: useProjectStore(s => s.project.states),
    transitions: useProjectStore(s => s.project.transitions),
    initialState: useProjectStore(s => s.project.initialState)
  }
  const statePrefix = useProjectStore(s => s.project.config.statePrefix)

  const handleAddMultiTrace = () => setMultiTraceInput(prev => [...prev, []])

  const handleRemoveMultiTrace = index => {
    setMultiTraceInput((prev) => prev.filter((item) => item !== prev[index]));
  }

  const onMultiTraceInputChange = (index, event) => {
    event.preventDefault();
    event.persist()
    // console.log(event)
    const { accepted } = simulateFSA(graph, event.target.value)

    setMultiTraceInput(prev => {
      return prev.map((item, i) => {
        if (i !== index) return item;
        return [
          event.target.value,
          accepted
        ]
      })
    })
  }
  
  const handleRunMultiTrace = () => {
  }

  const handleRun = (input) => {
    let output = ''
    const { accepted, trace } = simulateFSA(graph, input)
    setTrace(trace)

    // Rejected output
    if (!accepted) {
      setTraceOutput('REJECTED')
      return
    }

    // Calculate transitions taken in trace and set output
    for (let i = 0; i < input.length; i++) {
      output += `${input[i]}: ${statePrefix}${trace[i]} -> ${statePrefix}${trace[i+1]}\n`
    }
    output += `\nSUCCESS`
    setTraceOutput(output)
    setTracerIdx(0)
  }

  // useEffect(() => {
  //   console.log(tracerIdx, traceInput[tracerIdx], trace[tracerIdx-1], trace[tracerIdx]);
  // }, [tracerIdx])

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
          <Button icon={<SkipBack size={20} />}
            disabled={tracerIdx <= 0}
            onClick={() => setTracerIdx(0)} />

          <Button icon={<ChevronLeft size={22} />}
            disabled={tracerIdx <= 0}
            onClick={() => {
              setTracerIdx(tracerIdx-1)
            }} />

          <Button icon={<Play size={20} />} 
            onClick={() => handleRun(traceInput)}/>

          <Button icon={<ChevronRight size={22} />}
            disabled={tracerIdx >= traceInput.length || !trace?.length}
            onClick={() => {
              setTraceOutput(`${traceInput[tracerIdx]}: ${statePrefix}${trace[tracerIdx]} -> ${statePrefix}${trace[tracerIdx+1]}`)
              setTracerIdx(tracerIdx+1)
            }} />

          <Button icon={<SkipForward size={20} />}
            disabled={tracerIdx >= traceInput.length || !trace?.length}
            onClick={() => {
              setTracerIdx(traceInput.length)
            }} />
        </StepButtons>

        {traceOutput ? <TraceConsole><pre>{traceOutput}</pre></TraceConsole> : null}
      </Wrapper>

      <SectionLabel>Multi-run</SectionLabel>
        <Wrapper>
          {multiTraceInput.map( (item, index) => (
              <MultiTraceWrapper key={index}>
                <MultiTraceInput
                  spellCheck={false}
                  onChange={(e) => onMultiTraceInputChange(index, e)}
                  value={item[0]}
                  accepted={item[1]}
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