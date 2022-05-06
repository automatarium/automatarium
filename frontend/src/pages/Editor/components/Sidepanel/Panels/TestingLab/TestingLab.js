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
  const [traceIdx, setTraceIdx] = useState(0)
  const [multiTraceOutput, setMultiTraceOutput] = useState([])

  // Graph state
  const graph = {
    states: useProjectStore(s => s.project.states),
    transitions: useProjectStore(s => s.project.transitions),
    initialState: useProjectStore(s => s.project.initialState)
  }
  const statePrefix = useProjectStore(s => s.project.config.statePrefix)

  const traceInput = useProjectStore(s => s.project.tests.single)
  const setTraceInput = useProjectStore(s => s.setSingleTest)
  const multiTraceInput = useProjectStore(s => s.project.tests.batch)
  const addMultiTraceInput = useProjectStore(s => s.addBatchTest)
  const setMultiTraceInput = useProjectStore(s => s.setBatchTest)
  const removeMultiTraceInput = useProjectStore(s => s.removeBatchTest)

  // Execute graph
  const simulateGraph = useCallback(() => {
    const { accepted, trace, remaining } = simulateFSA(graph, traceInput)
    result = {
      accepted,
      remaining,
      trace: trace.map(step => ({
        to: step.to,
        read: step.read === '' ? 'λ' : step.read
      })),
      transitionCount: trace.length - (accepted ? 1 : 0)
    }
    setSimulationResult(result)
    return result
  }, [graph, traceInput])

  const traceOutput = useMemo(() => {
    // No output before simulating
    if (!simulationResult)
      return ''

    const { trace, accepted, remaining, transitionCount } = simulationResult

    // Return null if not enough states in trace to render transitions 
    if (trace.length < 2) {
      return null
    }
    
    // Represent transitions as strings of form start -> end
    const transitions = trace
      .slice(0, -1)
      .map((_, i) => [trace[i+1]?.read, trace[i]?.to, trace[i+1]?.to])
      .map(([read, start, end]) => `${read}: ${statePrefix}${start} -> ${statePrefix}${end}`)
      .filter((x, i) => i < traceIdx)

    // Add rejecting transition if applicable
    const transitionsWithRejected = !accepted && traceIdx === trace.length
      ? [...transitions,
        remaining[0] && `${remaining[0]}: `,
        `${statePrefix}${trace[trace.length-1].to} ->|`]
      : transitions

    // Add 'REJECTED'/'ACCEPTED' label
    return `${transitionsWithRejected.join('\n')}${(traceIdx === transitionCount) ? `\n\n` + (accepted ? 'ACCEPTED' : 'REJECTED' ) : ''}`
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
            disabled={traceIdx >= simulationResult?.transitionCount}
            onClick={() => {
              if (!simulationResult) {
                simulateGraph()
              }
              setTraceIdx(traceIdx+1)
            }} />

          <Button icon={<SkipForward size={20} />}
            disabled={traceIdx === simulationResult?.transitionCount && traceIdx != 0}
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
                onChange={e => {
                  setMultiTraceInput(index, e.target.value)
                  setMultiTraceOutput([])
                }}
                value={value}
                color={multiTraceOutput?.[index]?.accepted !== undefined ? (multiTraceOutput[index].accepted ? 'success' : 'error') : undefined}
              />
              <RemoveButton
                onClick={() => {
                  removeMultiTraceInput(index)
                  setMultiTraceOutput([])
                }}
                title="Remove"
              ><Trash2 /></RemoveButton>
            </MultiTraceRow>
          ))}
          <Button
            secondary
            onClick={() => {
              addMultiTraceInput()
              setMultiTraceOutput([])
            }}
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
