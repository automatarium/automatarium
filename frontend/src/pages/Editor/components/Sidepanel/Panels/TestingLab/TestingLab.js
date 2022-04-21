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
  const [isAccepted, setIsAccepted] = useState(false)
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
    // event.preventDefault();
    // event.persist()
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

  const handleSetTrace = () => {
    console.log('HERE');
    const { accepted, trace:hi } = simulateFSA(graph, traceInput)
    setTrace(hi)
  }

  // useEffect(() => {
  //   console.log('trace setting...', trace);
  //   const { accepted, trace:hi } = simulateFSA(graph, traceInput)
  //   setTrace(hi)
  // }, [!trace])

  return (
    <> 
      <SectionLabel>Trace</SectionLabel>
      <Wrapper>
        <TextInput
          onChange={e => {
            setTraceInput(e.target.value)
            setTrace()
            setTracerIdx(0)
          }}
          value={traceInput}
          placeholder="Enter a value to test"
        />

        <StepButtons>
          <Button icon={<SkipBack size={20} />}
            disabled={tracerIdx <= 0}
            onClick={() => {
              setTracerIdx(0)
              let newTracerIdx = 0
              setTraceOutput(`${traceInput[newTracerIdx]}: ${statePrefix}${trace[newTracerIdx]} -> ${statePrefix}${trace[newTracerIdx+1]}`)
            }} />

          <Button icon={<ChevronLeft size={23} />}
            disabled={tracerIdx <= 0}
            onClick={() => {
              setTracerIdx(tracerIdx-1)

              // // Final state reached
              // if (!traceInput[tracerIdx]) {
              //   console.log('yo');
              //   setTraceOutput(`Final State: ${statePrefix}${trace[tracerIdx]}`)
              // // End of input reached
              // } else 
              if (!trace[tracerIdx+1]) {
                setTraceOutput(`${traceInput[tracerIdx]}: ${statePrefix}${trace[tracerIdx]} -> |`)
              // There is more input
              } else {
                setTraceOutput(`${traceInput[tracerIdx]}: ${statePrefix}${trace[tracerIdx]} -> ${statePrefix}${trace[tracerIdx+1]}`)
              }


            }} />

          {/* <Button icon={<Play size={20} />} 
            onClick={() => handleRun(traceInput)}/> */}

          <Button icon={<ChevronRight size={23} />}
            disabled={tracerIdx >= trace?.length && tracerIdx != 0}
            onClick={() => {
              let newTrace
              // No trace is found (input was recently changed)
              if (!trace) {
                console.log('a');
                const { trace: output } = simulateFSA(graph, traceInput)
                newTrace = output
                setTrace(newTrace)
              // Input has not changed
              } else {
                console.log('b');
                newTrace = trace
              }
              // if (!trace) {
              //   const { accepted, trace: output } = simulateFSA(graph, traceInput)
              //   setTrace(output)
              // }
              // console.log('HELLO', trace);

              // Final state reached
              if (!traceInput[tracerIdx]) {
                console.log('yo');
                setTraceOutput(`Final State: ${statePrefix}${newTrace[tracerIdx]}`)
              // End of input reached
              } else if (!newTrace[tracerIdx+1]) {
                setTraceOutput(`${traceInput[tracerIdx]}: ${statePrefix}${newTrace[tracerIdx]} -> |`)
              // There is more input
              } else {
                setTraceOutput(`${traceInput[tracerIdx]}: ${statePrefix}${newTrace[tracerIdx]} -> ${statePrefix}${newTrace[tracerIdx+1]}`)
              }

              // Increment tracer index
              setTracerIdx(tracerIdx+1)
            }} />

          <Button icon={<SkipForward size={20} />}
            // disabled={tracerIdx == traceInput.length}
            disabled={tracerIdx == trace?.length && tracerIdx != 0}
            onClick={() => {
              let newTrace
              let output = ''
              let a
              // No trace is found (input was recently changed)
              if (!trace) {
                console.log('a');
                const { accepted, trace: output } = simulateFSA(graph, traceInput)
                newTrace = output
                a = accepted
                setIsAccepted(accepted)
                setTrace(newTrace)
              // Input has not changed
              } else {
                console.log('b');
                newTrace = trace
                a = isAccepted
              }


              for (let i = 0; i < newTrace.length; i++) {
                // Final state reached
                // if (!traceInput[i]) {
                //   // output += `Final State: ${statePrefix}${newTrace[i]}\n\n`
                //   output += '\n'
                // // End of input reached
                // } else 
                if (!newTrace[i+1]) {
                  output += `${traceInput[i]}: ${statePrefix}${newTrace[i]} -> |\n`
                // There is more input
                } else {
                  output += `${traceInput[i]}: ${statePrefix}${newTrace[i]} -> ${statePrefix}${newTrace[i+1]}\n`
                }

                setTracerIdx(tracerIdx+1)
              }

              if (a) {
                output += '\nSUCCESS'
              } else {
                output += '\nREJECTED'
              }

              setTraceOutput(output)

              // Increment tracer index
              setTracerIdx(newTrace.length)







              // let newTrace
              // let isAccepted
              // // No trace is found (input was recently changed)
              // if (!trace) {
              //   const { accepted, trace: output } = simulateFSA(graph, traceInput)
              //   newTrace = output
              //   isAccepted = accepted
              //   setTrace(newTrace)
              // // Input has not changed
              // } else {
              //   newTrace = trace
              // }

              // // No trace for the input exists - run the automaton
              // // handleRun()
              // let output = ''

              // // Rejected output
              // if (!isAccepted) {
              //   setTraceOutput('REJECTED')
              //   return
              // }

              // // Calculate transitions taken in trace and set output
              // for (let i = 0; i < traceInput.length; i++) {
              //   output += `${traceInput[i]}: ${statePrefix}${newTrace[i]} -> ${statePrefix}${newTrace[i+1]}\n`
              // }
              // output += `\nSUCCESS`
              // setTraceOutput(output)
              // // setTracerIdx(0)

              // setTracerIdx(newTrace.length)
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