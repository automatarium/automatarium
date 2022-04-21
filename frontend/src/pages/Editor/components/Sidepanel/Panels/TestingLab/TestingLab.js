import { useState, useCallback, useMemo } from 'react'
import { SkipBack, ChevronLeft, ChevronRight, SkipForward, Plus } from 'lucide-react'

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
  const [simulationResult, setSimulationResult] = useState()
  const [traceInput, setTraceInput] = useState('')
  const [traceIdx, setTraceIdx] = useState(0)
  const [multiTraceInput, setMultiTraceInput] = useState([[]])

  // Graph state
  const graph = {
    states: useProjectStore(s => s.project.states),
    transitions: useProjectStore(s => s.project.transitions),
    initialState: useProjectStore(s => s.project.initialState)
  }
  const statePrefix = useProjectStore(s => s.project.config.statePrefix)

  // Multi Trace
  const handleRemoveMultiTrace = index => {
    setMultiTraceInput((prev) => prev.filter((item) => item !== prev[index]));
  }

  const handleAddMultiTrace = () => setMultiTraceInput(prev => [...prev, []])

  const handleRunMultiTrace = () => {
  }

  const onMultiTraceInputChange = (index, event) => {
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

  // Execute graph
  const simulateGraph = useCallback(() => {
    const result = simulateFSA(graph, traceInput)
    setSimulationResult(result)
    return result
  }, [graph, traceInput])

  const traceOutput = useMemo(() => {
    // No output before simulating
    if (!simulationResult)
      return ''

    const { trace, accepted } = simulationResult
    const transitions = trace
      .map((state, i, states) => traceInput[i]
        && `${traceInput[i]}: ${statePrefix}${state} -${(states[i+1] ? `> ${statePrefix}${states[i+1]}` : '|')}`)
      .filter((x, i) => i < traceIdx && x)

    return `${transitions.join('\n')}${(traceIdx === trace.length) ? `\n\n` + (accepted ? 'ACCEPTED' : 'REJECTED' ) : ''}`
  }, [traceInput, simulationResult, statePrefix, traceIdx]) 

  return (
    <> 
      <SectionLabel>Trace</SectionLabel>
      <Wrapper>
        <TextInput
          onChange={e => {
            setTraceInput(e.target.value)
            setTraceIdx(0)
            setSimulationResult()
          }}
          value={traceInput}
          placeholder="Enter a value to test"
        />

        <StepButtons>
          <Button icon={<SkipBack size={20} />}
            disabled={traceIdx <= 0}
            onClick={() => {
              setTraceIdx(0)
            }} />

          <Button icon={<ChevronLeft size={23} />}
            disabled={traceIdx <= 0}
            onClick={() => {
              setTraceIdx(traceIdx-1)
            }} />

          <Button icon={<ChevronRight size={23} />}
            disabled={traceIdx >= simulationResult?.trace?.length}
            onClick={() => {
              if (!simulationResult) {
                simulateGraph()
              }
              setTraceIdx(traceIdx+1)
            }} />

          <Button icon={<SkipForward size={20} />}
            disabled={traceIdx === simulationResult?.trace?.length && traceIdx != 0}
            onClick={() => {
              // Increment tracer index
              const result = simulationResult ?? simulateGraph()
              setTraceIdx(result.trace.length)
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
