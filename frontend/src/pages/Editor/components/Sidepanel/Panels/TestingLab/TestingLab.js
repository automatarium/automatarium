import { useState, useCallback, useMemo } from 'react'
import { SkipBack, ChevronLeft, ChevronRight, SkipForward, Plus, Trash2 } from 'lucide-react'

import { SectionLabel, Button, TextInput } from '/src/components'
import {
  StepButtons,
  MultiTraceRow,
  RemoveButton,
  Wrapper,
  TraceConsole,
} from './testingLabStyle'
import useProjectStore from '/src/stores/useProjectStore'
import { simulateFSA } from '@automatarium/simulation'

const TestingLab = () => {
  const [simulationResult, setSimulationResult] = useState()
  const [traceInput, setTraceInput] = useState('')
  const [traceIdx, setTraceIdx] = useState(0)
  const [multiTraceInput, setMultiTraceInput] = useState([''])
  const [multiTraceOutput, setMultiTraceOutput] = useState([])

  // Graph state
  const graph = {
    states: useProjectStore(s => s.project.states),
    transitions: useProjectStore(s => s.project.transitions),
    initialState: useProjectStore(s => s.project.initialState)
  }
  const statePrefix = useProjectStore(s => s.project.config.statePrefix)

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

        {traceOutput && <TraceConsole><pre>{traceOutput}</pre></TraceConsole>}
      </Wrapper>

      <SectionLabel>Multi-run</SectionLabel>
        <Wrapper>
          {multiTraceInput.map((value, index) => (
            <MultiTraceRow key={index}>
              <TextInput
                onChange={e => setMultiTraceInput(multiTraceInput.map((input, i) => i === index ? e.target.value : input))}
                value={value}
                color={multiTraceOutput?.[index]?.accepted !== undefined ? (multiTraceOutput[index].accepted ? 'success' : 'error') : undefined}
              />
              <RemoveButton
                onClick={() => setMultiTraceInput(multiTraceInput.filter((_, i) => i !== index))}
                title="Remove"
              ><Trash2 /></RemoveButton>
            </MultiTraceRow>
          ))}
          <Button
            secondary
            onClick={() => setMultiTraceInput([...multiTraceInput, ''])}
            icon={<Plus />}
          />
          <Button onClick={() => {
            setMultiTraceOutput(multiTraceInput.map(input => simulateFSA(graph, input)))
          }}>Run</Button>
      </Wrapper>
    </>
  )
}

export default TestingLab
