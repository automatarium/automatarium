import { useState, useCallback, useMemo, useEffect } from 'react'
import { SkipBack, ChevronLeft, ChevronRight, SkipForward, Plus, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

import { useDibEgg } from '/src/hooks'
import { SectionLabel, Button, Input, TracePreview } from '/src/components'
import useProjectStore from '/src/stores/useProjectStore'
import { simulateFSA } from '@automatarium/simulation'

import {
  StepButtons,
  MultiTraceRow,
  RemoveButton,
  Wrapper,
  TraceConsole,
  StatusIcon,
  WarningLabel,
} from './testingLabStyle'

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
  const updateMultiTraceInput = useProjectStore(s => s.updateBatchTest)
  const removeMultiTraceInput = useProjectStore(s => s.removeBatchTest)
  const lastChangeDate = useProjectStore(s => s.lastChangeDate)

  // Execute graph
  const simulateGraph = useCallback(() => {
    const { accepted, trace, remaining } = simulateFSA(graph, traceInput ?? '')
    const result = {
      accepted,
      remaining,
      trace: trace.map(step => ({
        to: step.to,
        read: step.read === '' ? 'λ' : step.read
      })),
      transitionCount: Math.max(1, trace.length - (accepted ? 1 : 0))
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
      if (traceIdx > 0)
        return accepted ? 'ACCEPTED' : 'REJECTED'
      return null
    }

    // Represent transitions as strings of form start -> end
    const transitions = trace
      .slice(0, -1)
      .map((_, i) => [trace[i+1]?.read, trace[i]?.to, trace[i+1]?.to])
      .map(([read, start, end]) => `${read}: ${statePrefix}${start} -> ${statePrefix}${end}`)
      .filter((_x, i) => i < traceIdx)

    // Add rejecting transition if applicable
    const transitionsWithRejected = !accepted && traceIdx === trace.length
      ? [...transitions,
        remaining[0] ?
          `${remaining[0]}: ${statePrefix}${trace[trace.length-1].to} ->|`
          : `\n${statePrefix}${trace[trace.length-1].to} ->|`]
      : transitions

    // Add 'REJECTED'/'ACCEPTED' label
    return `${transitionsWithRejected.join('\n')}${(traceIdx === transitionCount) ? `\n\n` + (accepted ? 'ACCEPTED' : 'REJECTED' ) : ''}`
  }, [traceInput, simulationResult, statePrefix, traceIdx])

  useEffect(() => {
    setMultiTraceOutput(multiTraceInput.map(input => simulateFSA(graph, input)))
  }, [])

  useEffect(() => {
    simulateGraph()
    setMultiTraceOutput()
    setTraceIdx(0)
  }, [lastChangeDate])

  // Update warnings
  const noInitialState = [null, undefined].includes(graph?.initialState) || !graph?.states.find(s => s.id === graph?.initialState)
  const warnings = []
  if (noInitialState)
    warnings.push('There is no initial state')
  if (!graph?.states.find(s => s.isFinal))
    warnings.push('There are no final states')

  // :^)
  const dibEgg = useDibEgg()

  return (
    <>
      {warnings.length > 0 && <>
        <SectionLabel>Warnings</SectionLabel>
        {warnings.map(warning => <WarningLabel key={warning}>
          <AlertTriangle />
          {warning}
        </WarningLabel>)}
      </>}
      <SectionLabel>Trace</SectionLabel>
      <Wrapper>
        <Input
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
            disabled={traceIdx >= simulationResult?.transitionCount || noInitialState}
            onClick={() => {
              if (!simulationResult) {
                simulateGraph()
              }
              setTraceIdx(traceIdx+1)
            }} />

          <Button icon={<SkipForward size={20} />}
            disabled={traceIdx === simulationResult?.transitionCount && traceIdx != 0 || noInitialState}
            onClick={() => {
              // Increment tracer index
              const result = simulationResult ?? simulateGraph()
              setTraceIdx(result.trace.length - (result.accepted ? 1 : 0))
              dibEgg(traceInput, result.accepted)
            }} />
        </StepButtons>

        {traceOutput && <div>
          <TracePreview trace={simulationResult} step={traceIdx} />
          <TraceConsole><pre>{traceOutput}</pre></TraceConsole>
        </div>}
      </Wrapper>

      <SectionLabel>Multi-run</SectionLabel>
        <Wrapper>
          {multiTraceInput.map((value, index) => (
            <MultiTraceRow key={index}>
              {multiTraceOutput?.[index]?.accepted !== undefined && (
                <StatusIcon $accepted={multiTraceOutput[index].accepted}>
                  {multiTraceOutput[index].accepted ? <CheckCircle2 /> : <XCircle />}
                </StatusIcon>
              )}
              <Input
                onChange={e => {
                  updateMultiTraceInput(index, e.target.value)
                  setMultiTraceOutput([])
                }}
                value={value}
                color={multiTraceOutput?.[index]?.accepted !== undefined ? (multiTraceOutput[index].accepted ? 'success' : 'error') : undefined}
                onPaste={e => {
                  const paste = (e.clipboardData || window.clipboardData).getData('text')
                  if (!paste.includes('\n')) return

                  e.preventDefault()
                  const lines = paste.split(/\r?\n/).filter(l => l !== '')
                  lines.forEach((l, i) => i === 0 ? updateMultiTraceInput(index, l) : addMultiTraceInput(l))
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.repeat) {
                    if (e.metaKey || e.ctrlKey) {
                      // Run shortcut
                      setMultiTraceOutput(multiTraceInput.map(input => simulateFSA(graph, input)))
                    } else {
                      addMultiTraceInput()
                      window.setTimeout(() => e.target.closest('div').parentElement?.querySelector('div:last-of-type > input')?.focus(), 50)
                    }
                  }
                  if (e.key === 'Backspace' && value === '' && !e.repeat) {
                    e.preventDefault()
                    e.target?.focus()
                    if (e.target.closest('div').parentElement?.querySelector('div:last-of-type > input') === e.target) {
                      e.target?.closest('div')?.previousSibling?.querySelector('input')?.focus()
                    }
                    removeMultiTraceInput(index)
                    setMultiTraceOutput([])
                  }
                  if (e.key === 'ArrowUp') {
                    e.target?.closest('div')?.previousSibling?.querySelector('input')?.focus()
                  }
                  if (e.key === 'ArrowDown') {
                    e.target?.closest('div')?.nextSibling?.querySelector('input')?.focus()
                  }
                }}
              />
              <RemoveButton
                onClick={e => {
                  const container = e.target.closest('div')
                  const next = container?.nextSibling?.tagName === 'DIV' ? container : container?.previousSibling
                  next?.querySelector('input')?.focus()
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
