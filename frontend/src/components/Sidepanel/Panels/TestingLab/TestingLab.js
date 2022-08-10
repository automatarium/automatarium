import { useState, useCallback, useMemo, useEffect } from 'react'
import { SkipBack, ChevronLeft, ChevronRight, SkipForward, Plus, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

import { useDibEgg } from '/src/hooks'
import { SectionLabel, Button, Input, TracePreview, TraceStepBubble, Preference, Switch } from '/src/components'
import { useProjectStore } from '/src/stores'
import { closureWithPredicate, resolveGraph, simulateFSA } from '@automatarium/simulation'

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
  const [showTraceTape, setShowTraceTape] = useState(false)

  // Graph state
  const graph = {
    states: useProjectStore(s => s.project.states),
    transitions: useProjectStore(s => s.project.transitions),
    initialState: useProjectStore(s => s.project.initialState)
  }
  const statePrefix = useProjectStore(s => s.project.config?.statePrefix)

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

  const getStateName = useCallback(id => graph.states.find(s => s.id === id)?.name, [graph.states])

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
      .map(([read, start, end]) => `${read}: ${getStateName(start) ?? statePrefix+start} -> ${getStateName(end) ?? statePrefix+end}`)
      .filter((_x, i) => i < traceIdx)

    // Add rejecting transition if applicable
    const transitionsWithRejected = !accepted && traceIdx === trace.length
      ? [...transitions,
        remaining[0] ?
          `${remaining[0]}: ${getStateName(trace[trace.length-1].to) ?? statePrefix+trace[trace.length-1].to} ->|`
          : `\n${getStateName(trace[trace.length-1].to) ?? statePrefix+trace[trace.length-1].to} ->|`]
      : transitions

    // Add 'REJECTED'/'ACCEPTED' label
    return `${transitionsWithRejected.join('\n')}${(traceIdx === transitionCount) ? `\n\n` + (accepted ? 'ACCEPTED' : 'REJECTED' ) : ''}`
  }, [traceInput, simulationResult, statePrefix, traceIdx, getStateName])

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
  const noFinalState = !graph?.states.find(s => s.isFinal)
  const warnings = []
  if (noInitialState)
    warnings.push('There is no initial state')
  if (noFinalState)
    warnings.push('There are no final states')

  // Update disconnected warning
  const pathToFinal = useMemo(() => {
    const resolvedGraph = resolveGraph(graph)
    const closure = closureWithPredicate(resolvedGraph, resolvedGraph.initialState, () => true)
    return Array.from(closure).some(([stateID]) => resolvedGraph.states.find(s => s.id === stateID)?.isFinal)
  }, [graph])
  if (!pathToFinal && !noInitialState && !noFinalState)
    warnings.push('There is no path to a final state')

  // :^)
  const dibEgg = useDibEgg()

  // Determine input position
  const currentTrace = simulationResult?.trace.slice(0, traceIdx+1) ?? []
  const inputIdx = currentTrace.map(tr => tr.read && tr.read !== 'λ').reduce((a, b) => a + b, 0) ?? 0
  const currentStateID = currentTrace?.[currentTrace.length - 1]?.to ?? graph?.initialState

  return (
    <>
      {(showTraceTape && traceInput !== '' && traceInput) && <TraceStepBubble input={traceInput} index={inputIdx} stateID={currentStateID} />}
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
          value={traceInput ?? ''}
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
          <TracePreview trace={simulationResult} step={traceIdx} statePrefix={statePrefix} states={graph.states} />
          <TraceConsole><pre>{traceOutput}</pre></TraceConsole>
        </div>}
        <Preference
          label={useMemo(() => Math.random() < .001 ? "Trace buddy" : "Trace tape", [])}
          style={{ marginBlock: 0 }}
        >
          <Switch
            type="checkbox"
            checked={showTraceTape}
            onChange={e => setShowTraceTape(e.target.checked)}
          />
        </Preference>
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
                placeholder="λ"
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
                    if (multiTraceInput.length === 1) return
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
                  const next = (container?.nextSibling?.tagName === 'DIV' || multiTraceInput.length === 1) ? container : container?.previousSibling
                  if (multiTraceInput.length === 1) {
                    updateMultiTraceInput(index, '')
                  } else {
                    removeMultiTraceInput(index)
                  }
                  next?.querySelector('input')?.focus()
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
