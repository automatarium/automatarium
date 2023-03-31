import { createContext, useState, useCallback, useMemo, useEffect } from 'react'
import { SkipBack, ChevronLeft, ChevronRight, SkipForward, Plus, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

import { useDibEgg } from '/src/hooks'
import { SectionLabel, Button, Input, TracePreview, TraceStepBubble, Preference, Switch } from '/src/components'
import { useProjectStore, usePDAVisualiserStore } from '/src/stores'
import { closureWithPredicate, resolveGraph, simulateFSA, simulatePDA } from '@automatarium/simulation'

import { simulateTM } from '@automatarium/simulation/src/simulateTM'
import useTMSimResultStore from '../../../../stores/useTMSimResultStore'
import { dispatchCustomEvent } from '/src/util/events'

import {
  StepButtons,
  MultiTraceRow,
  RemoveButton,
  Wrapper,
  TraceConsole,
  StatusIcon,
  WarningLabel
} from './testingLabStyle'

export const ThemeContext = createContext({})

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
  const setProjectSimResults = useTMSimResultStore(s => s.setSimResults)
  // eslint-disable-next-line no-unused-vars
  const clearProjectSimResults = useTMSimResultStore(s => s.clearSimResults)
  const setProjectSimTraceIDx = useTMSimResultStore(s => s.setTraceIDx)
  const traceInput = useProjectStore(s => s.project.tests.single)
  const setTraceInput = useProjectStore(s => s.setSingleTest)
  const multiTraceInput = useProjectStore(s => s.project.tests.batch)
  const addMultiTraceInput = useProjectStore(s => s.addBatchTest)
  const updateMultiTraceInput = useProjectStore(s => s.updateBatchTest)
  const removeMultiTraceInput = useProjectStore(s => s.removeBatchTest)
  const lastChangeDate = useProjectStore(s => s.lastChangeDate)
  const projectType = useProjectStore(s => s.project.config.type)
  const setPDAVisualiser = usePDAVisualiserStore(state => state.setStack)
  // const stackInfo = usePDAVisualiserStore(s=>s.stack)

  /**
   * Runs the correct simulation result for a trace input and returns the result.
   * The simulation function to use depends on the project name
   */
  const runSimulation = (input) => {
    if (projectType === 'TM') {
      const tapeTrace = input ? input.split('') : ['']
      const tapePointer = 0 // This is hard coded for now. Future development available

      const { halted, trace, tape } = simulateTM(graph, { pointer: tapePointer, trace: tapeTrace })

      return {
        accepted: halted,
        tape,
        trace: trace.map(step => ({
          to: step.to,
          read: step.tape
        })),
        transitionCount: Math.max(1, trace.length - (halted ? 1 : 0))
      }
    } else if (['PDA', 'FSA'].includes(projectType)) {
      const { accepted, trace, remaining } =
            projectType === 'PDA'
              ? simulatePDA(graph, input ?? '')
              : simulateFSA(graph, input ?? '')

      return {
        accepted,
        remaining,
        trace: trace.map(step => ({
          to: step.to,
          read: step.read === '' ? 'λ' : step.read,
          pop: step.pop === '' ? 'λ' : step.pop,
          push: step.push === '' ? 'λ' : step.push,
          currentStack: step.currentStack
        })),
        transitionCount: Math.max(1, trace.length - (accepted ? 1 : 0))
      }
    } else {
      throw new Error(`${projectType} is not supported`)
    }
  }

  /** Runs all multi trace inputs and updates the output */
  const rerunMultiTraceInput = () => {
    setMultiTraceOutput(multiTraceInput.map(input => runSimulation(input)))
  }

  // Execute graph
  const simulateGraph = useCallback(() => {
    const result = runSimulation(traceInput)
    if (projectType === 'TM') {
      setSimulationResult(result)
      setProjectSimResults([result]) // Currently for just a single simulation result. (DTM. Not yet NDTM).
    } else {
      setSimulationResult(result)
      // Adds result to PDA visualiser
      setPDAVisualiser(result)
    }
    return result
  }, [graph, traceInput])

  const getStateName = useCallback(id => graph.states.find(s => s.id === id)?.name, [graph.states])

  const traceOutput = useMemo(() => {
    // No output before simulating
    if (!simulationResult) { return '' }

    const { trace, accepted, remaining, transitionCount } = simulationResult
    // Return null if not enough states in trace to render transitions
    if (trace.length < 2) {
      if (traceIdx > 0) { return accepted ? 'ACCEPTED' : 'REJECTED' }
      return null
    }

    // Represent transitions as strings of form start -> end
    const transitions = trace
      .slice(0, -1)
      .map((_, i) => [trace[i + 1]?.read, trace[i]?.to, trace[i + 1]?.to])
      .map(([read, start, end]) => `${read}: ${getStateName(start) ?? statePrefix + start} -> ${getStateName(end) ?? statePrefix + end}`)
      .filter((_x, i) => i < traceIdx)

    // Add rejecting transition if applicable
    const transitionsWithRejected = !accepted && traceIdx === trace.length && remaining !== undefined
      ? [...transitions,
          remaining[0]
            ? `${remaining[0]}: ${getStateName(trace[trace.length - 1].to) ?? statePrefix + trace[trace.length - 1].to} ->|`
            : `\n${getStateName(trace[trace.length - 1].to) ?? statePrefix + trace[trace.length - 1].to} ->|`]
      : transitions

    // Add 'REJECTED'/'ACCEPTED' label
    return `${transitionsWithRejected.join('\n')}${(traceIdx === transitionCount) ? '\n\n' + (accepted ? 'ACCEPTED' : 'REJECTED') : ''}`
  }, [traceInput, simulationResult, statePrefix, traceIdx, getStateName])

  useEffect(() => {
    simulateGraph()
    setMultiTraceOutput()
    setTraceIdx(0)
  }, [lastChangeDate])

  // Set the trace IDx to be passed through store to TMTapeLab component
  useEffect(() => {
    if (projectType === 'TM') setProjectSimTraceIDx(traceIdx)
    else if (projectType === 'PDA') setProjectSimTraceIDx(traceIdx)
    // Try this for PDA as well - stack display
  }, [traceIdx])

  // Show bottom panel with TM Tape Lab
  useEffect(() => {
    if (projectType === 'TM') {
      if (showTraceTape) {
        dispatchCustomEvent('bottomPanel:open', { panel: 'tmTape' })
      } else {
        dispatchCustomEvent('bottomPanel:close', {})
      }
    }
  }, [showTraceTape])

  // const proxyMultiTraceOnMount = (input) => {
  //   if input
  //   setMultiTraceOutput(multiTraceInput.map(input => simulateTM(graph, input)))
  // }

  // Update warnings
  const noInitialState = [null, undefined].includes(graph?.initialState) || !graph?.states.find(s => s.id === graph?.initialState)
  const noFinalState = !graph?.states.find(s => s.isFinal)
  const warnings = []
  if (noInitialState) { warnings.push('There is no initial state') }
  if (noFinalState) { warnings.push('There are no final states') }

  // Update disconnected warning
  const pathToFinal = useMemo(() => {
    const resolvedGraph = resolveGraph(graph)
    const closure = closureWithPredicate(resolvedGraph, resolvedGraph.initialState, () => true)
    return Array.from(closure).some(([stateID]) => resolvedGraph.states.find(s => s.id === stateID)?.isFinal)
  }, [graph])
  if (!pathToFinal && !noInitialState && !noFinalState) { warnings.push('There is no path to a final state') }

  // :^)
  const dibEgg = useDibEgg()

  // Determine input position
  const currentTrace = simulationResult?.trace.slice(0, traceIdx + 1) ?? []
  const inputIdx = currentTrace.map(tr => tr.read && tr.read !== 'λ').reduce((a, b) => a + b, 0) ?? 0
  const currentStateID = currentTrace?.[currentTrace.length - 1]?.to ?? graph?.initialState
  const lastTraceIdx = (simulationResult?.trace?.length ?? 0) - 1

  return (
    <>
      {(showTraceTape && traceInput !== '' && traceInput && projectType !== 'TM') && <TraceStepBubble input={traceInput} index={inputIdx} stateID={currentStateID} />}
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
            disabled={traceIdx <= 0 ||
            (projectType === 'TM' && !showTraceTape)
            }
            onClick={() => {
              setTraceIdx(0)
            }} />

          <Button icon={<ChevronLeft size={23} />}
            disabled={traceIdx <= 0 ||
            (projectType === 'TM' && !showTraceTape)
            }
            onClick={() => {
              setTraceIdx(traceIdx - 1)
            }} />

          <Button icon={<ChevronRight size={23} />}
            disabled={
              traceIdx >= lastTraceIdx ||
              noInitialState ||
              (projectType === 'TM' && !showTraceTape)
            }
            onClick={() => {
              if (!simulationResult) {
                simulateGraph()
              }
              setTraceIdx(traceIdx + 1)
            }} />

          <Button icon={<SkipForward size={20} />}
            // eslint-disable-next-line no-mixed-operators
            disabled={
                traceIdx >= lastTraceIdx ||
                noInitialState ||
                (projectType === 'TM' && !showTraceTape)
            }
            onClick={() => {
              // Increment tracer index
              const result = simulationResult ?? simulateGraph()
              setTraceIdx(result.trace.length - (result.accepted ? 1 : 0))
              dibEgg(traceInput, result.accepted)
            }} />
        </StepButtons>
        {traceOutput && projectType !== 'TM' && <div>
          <TracePreview trace={simulationResult} step={traceIdx} statePrefix={statePrefix} states={graph.states} />
          <TraceConsole><pre>{traceOutput}</pre></TraceConsole>
        </div>}
        <Preference
          label={useMemo(() => Math.random() < 0.001 ? 'Trace buddy' : 'Trace tape', [])}
          style={{ marginBlock: 0 }}
        >
          <Switch
            type="checkbox"
            checked={showTraceTape}
            disabled={((projectType === 'TM') && (!traceInput))}
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
                      rerunMultiTraceInput()
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
            rerunMultiTraceInput()
          }}>Run</Button>
      </Wrapper>
    </>
  )
}

export default TestingLab
