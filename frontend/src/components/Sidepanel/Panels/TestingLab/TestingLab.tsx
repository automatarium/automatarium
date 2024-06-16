import { createContext, useState, useCallback, useMemo, useEffect, KeyboardEvent } from 'react'
import { SkipBack, ChevronLeft, ChevronRight, SkipForward, Plus, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

import { useDibEgg } from '/src/hooks'
import { SectionLabel, Button, Input, TracePreview, TraceStepBubble, Preference, Switch } from '/src/components'
import { useProjectStore, usePDAVisualiserStore, useSteppingStore } from '/src/stores'
import { closureWithPredicate, graphStepper, simulateFSA, simulatePDA } from '@automatarium/simulation'

import { generateTrace as generateTraceFSA } from '@automatarium/simulation/src/simulateFSA'
import { generateTrace as generateTracePDA, generateStack } from '@automatarium/simulation/src/simulatePDA'
import { simulateTM, generateTrace as generateTraceTM } from '@automatarium/simulation/src/simulateTM'
import useTMSimResultStore from '../../../../stores/useTMSimResultStore'

import {
  StepButtons,
  MultiTraceRow,
  RemoveButton,
  Wrapper,
  TraceConsole,
  StatusIcon,
  WarningLabel
} from './testingLabStyle'
import {
  ExecutionResult,
  FSAExecutionResult,
  FSAExecutionTrace,
  PDAExecutionResult,
  PDAExecutionTrace,
  TMExecutionResult,
  TMExecutionTrace
} from '@automatarium/simulation/src/graph'
import { Graph, Node, State } from '@automatarium/simulation/src/interfaces/graph'
import { FSAState } from '@automatarium/simulation/src/FSASearch'
import { PDAState } from '@automatarium/simulation/src/PDASearch'
import { TMState } from '@automatarium/simulation/src/TMSearch'
import { buildProblem } from '@automatarium/simulation/src/utils'
// import { ButtonGroup } from '/src/pages/NewFile/newFileStyle'
import { FSAProjectGraph, PDAProjectGraph, TMProjectGraph, BaseAutomataTransition, assertType } from '/src/types/ProjectTypes'

import usePreferencesStore from 'frontend/src/stores/usePreferencesStore'

type SimulationResult = ExecutionResult & {transitionCount: number}
type StepType = 'Forward' | 'Backward' | 'Reset'

export const ThemeContext = createContext({})

const TestingLab = () => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | undefined>()
  const [traceIdx, setTraceIdx] = useState(0)
  const [multiTraceOutput, setMultiTraceOutput] = useState([])
  const [showTraceTape, setShowTraceTape] = useState(false)
  const [enableManualStepping, setEnableManualStepping] = useState(false)
  const [problem, setProblem] = useState<Graph<State, BaseAutomataTransition> | undefined>()
  const [currentManualNode, setCurrentManualNode] = useState<Node<State> | undefined>()
  const [currentManualSuccessors, setCurrentManualSuccessors] = useState<Node<State>[]>([])
  // const [manualExecutionTrace, setManualExecutionTrace] = useState([])

  // Graph state
  const graph = useProjectStore(s => s.getGraph())
  const statePrefix = useProjectStore(s => s.project.config?.statePrefix)
  const setProjectSimResults = useTMSimResultStore(s => s.setSimResults)
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

  // Preference option to pause/unpause TM at Final State
  const preferences = usePreferencesStore(state => state.preferences)
  const simulateAutomata = (graph, input: string, node: Node<FSAState|PDAState|TMState> | null = null) => {
    let result
    switch (graph.projectType) {
      case ('PDA'):
        if (!enableManualStepping) {
          result = simulatePDA(graph, input ?? '')
        } else {
          assertType<Node<PDAState>>(node)
          const trace = generateTracePDA(node)
          const stack = generateStack(trace)
          result = {
            accepted: node.state.isFinal && node.state.remaining === '' && stack.length === 0,
            remaining: node.state.remaining,
            trace,
            stack
          }
        }
        break
      case ('FSA'):
        if (!enableManualStepping) {
          result = simulateFSA(graph, input ?? '')
        } else {
          assertType<Node<FSAState>>(node)
          const trace = generateTraceFSA(node)
          result = {
            accepted: node.state.isFinal && node.state.remaining === '',
            remaining: node.state.remaining,
            trace
          }
        }
        break
      case ('TM'):
        if (!enableManualStepping) {
          result = simulateTM(graph, input ?? '', preferences)
        } else {
          assertType<Node<TMState>>(node)
          const trace = generateTraceTM(node)
          result = {
            accepted: node.state.isFinal,
            tape: node.state.tape,
            trace
          }
        }
    }

    return result
  }

  // Add Stepper from (old) SteppingLab
  const stepper = useMemo(() => {
    // Graph stepper for PDA currently requires changes to BFS stack logic
    // to handle non-determinism so branching stops on the first rejected transition.
    return graphStepper(graph as FSAProjectGraph | PDAProjectGraph | TMProjectGraph, traceInput)
  }, [graph, traceInput])
  const setSteppedStates = useSteppingStore(s => s.setSteppedStates)

  const handleStep = (stepType: StepType) => {
    let frontier = []
    if (stepper) {
      switch (stepType) {
        case 'Forward':
          frontier = stepper.forward()
          break
        case 'Backward':
          frontier = stepper.backward()
          break
        case 'Reset':
          frontier = stepper.reset()
          break
        default:
          break
      }

      if (frontier && frontier.length > 0 && (!enableManualStepping)) {
        setSteppedStates(frontier)
      }
    }
  }

  useEffect(() => {
    if (enableManualStepping) {
      setSteppedStates([])
    } else if (stepper) {
      handleStep('Reset')
    }
  }, [traceInput, enableManualStepping])
  /**
   * Runs the correct simulation result for a trace input and returns the result.
   * The simulation function to use depends on the project name
   */
  const runSimulation = (input: string): SimulationResult => {
    // Find how many transitions can be shown
    // TODO: Find reasoning behind the magical -1
    const transitionCount = (res: ExecutionResult) =>
      Math.max(1, res.trace.length) - (res.accepted ? 1 : graph.projectType === 'TM' ? 1 : 0)
    if (['PDA', 'FSA', 'TM'].includes(graph.projectType)) {
      let node = null
      if (enableManualStepping) {
        let _problem = problem
        // chance problem hasn't been created yet & node hasn't been, set to defaults if not found
        if (!_problem) {
          _problem = buildProblem(graph, input ?? '')
        }
        node = currentManualNode ?? _problem.initial
        // Sets node for simulation to be next one so ui doesn't say problem in progress is rejected
        if (!_problem.isFinalState(node) && _problem.getSuccessors(node).length !== 0) {
          node = _problem.getSuccessors(node)[0]
        }
      }
      const result = simulateAutomata(graph, input ?? '', node)
      // Formats a symbol. Makes an empty symbol become a lambda
      const formatSymbol = (char?: string): string =>
        char === null || char === '' ? 'λ' : char
      return {
        ...result,
        // We need format the symbols in the trace so any empty symbols become lambdas
        trace: result.trace.map((step: FSAExecutionTrace | PDAExecutionTrace | TMExecutionTrace) => ({
          to: step.to,
          read: formatSymbol(step.read),
          // Add extra info if its a PDA trace.
          // I know this isn't needed, but it pleases typescript
          ...('currentStack' in step
            ? {
                pop: formatSymbol(step.pop),
                push: formatSymbol(step.push),
                currentStack: step.currentStack
              }
            : {}),
          // Info for TMs
          ...('tape' in step
            ? {
                tape: step.tape,
                write: formatSymbol(step.write),
                direction: step.direction
              }
            : {})

        } as FSAExecutionTrace | PDAExecutionTrace | TMExecutionTrace)),
        transitionCount: transitionCount(result)
      }
    } else {
      throw new Error(`${projectType} is not supported`)
    }
  }

  /** Runs all multi trace inputs and updates the output */
  const rerunMultiTraceInput = () => {
    setMultiTraceOutput(multiTraceInput.map(input => runSimulation(input)))
  }

  const simulateGraph = useCallback(() => {
    const result = runSimulation(traceInput)
    // The `in` is just to type narrow for TS
    if ('tape' in result) {
      setSimulationResult(result)
      setProjectSimResults([{ accepted: result.accepted, ...result }]) // Currently for just a single simulation result. (DTM. Not yet NDTM).
    } else {
      setSimulationResult(result)
      // Adds result to PDA visualiser
      if (graph.projectType === 'PDA') {
        setPDAVisualiser(result as PDAExecutionResult)
      }
    }
    return result
  }, [graph, traceInput, enableManualStepping, currentManualNode])

  // Determine last position allowed
  const lastTraceIdx = simulationResult?.transitionCount

  const getStateName = useCallback((id: number) => graph.states.find(s => s.id === id)?.name, [graph.states])

  // Returns a string representing the transition from parent to current node, or empty string if no parent
  function nodeTransitionString (node: Node<State>): string {
    if (node.parent !== null) {
      return `${node.state.toTransitionString()}: ${getStateName(node.parent.state.id) ?? statePrefix + node.parent.state.id} -> ${getStateName(node.state.id) ?? statePrefix + node.state.id}`
    } else {
      return ''
    }
  }

  // Returns array of strings representing the transitions in the trace
  function traceTransitionsString (projectType, trace) {
    let transitions
    switch (projectType) {
      case ('FSA'):
        assertType<(FSAExecutionTrace[])>(trace)
        transitions = trace
          .slice(0, -1)
          .map<[string, number, number]>((_, i) => [trace[i + 1]?.read, trace[i]?.to, trace[i + 1]?.to])
          .map(([read, start, end]) => `${read}: ${getStateName(start) ?? statePrefix + start} -> ${getStateName(end) ?? statePrefix + end}`)
          .filter((_x, i) => i < traceIdx)
        break
      case ('PDA'):
        assertType<(PDAExecutionTrace[])>(trace)
        transitions = trace
          .slice(0, -1)
          .map<[string, number, number, string, string]>((_, i) => [trace[i + 1]?.read, trace[i]?.to, trace[i + 1]?.to, trace[i + 1]?.pop, trace[i + 1]?.push])
          .map(([read, start, end, pop, push]) => `${read},${pop};${push}: ${getStateName(start) ?? statePrefix + start} -> ${getStateName(end) ?? statePrefix + end}`)
          .filter((_x, i) => i < traceIdx)
        break
      case ('TM'):
        assertType<(TMExecutionTrace[])>(trace)
        transitions = trace
          .slice(0, -1)
          .map<[string, number, number, string, string]>((_, i) => [trace[i + 1]?.read, trace[i]?.to, trace[i + 1]?.to, trace[i + 1]?.write, trace[i + 1]?.direction])
          .map(([read, start, end, write, direction]) => `${read},${write};${direction}: ${getStateName(start) ?? statePrefix + start} -> ${getStateName(end) ?? statePrefix + end}`)
          .filter((_x, i) => i < traceIdx)
    }
    return transitions
  }

  const traceOutput = useMemo(() => {
    // No output before simulating
    if (!simulationResult) { return '' }
    assertType<(FSAExecutionResult | PDAExecutionResult | TMExecutionResult) & {transitionCount: number}>(simulationResult)

    const { trace, accepted } = simulationResult
    // Return null if not enough states in trace to render transitions
    if (trace.length < 2) {
      if (traceIdx > 0) { return accepted ? 'ACCEPTED' : 'REJECTED' }
      return null
    }

    // Represent transitions as strings of form 'read: start -> end'
    const transitions = traceTransitionsString(graph.projectType, trace)

    let transitionsWithRejected = ['']
    if ('remaining' in simulationResult) {
      // Add rejecting transition if applicable
      transitionsWithRejected = !accepted && traceIdx === trace.length
        ? [...transitions,
            simulationResult.remaining[0]
              ? `${simulationResult.remaining[0]}: ${getStateName(trace[trace.length - 1].to) ?? statePrefix + trace[trace.length - 1].to} ->|`
              : `\n${getStateName(trace[trace.length - 1].to) ?? statePrefix + trace[trace.length - 1].to} ->|`]
        : transitions
    } else {
      // TODO add failed transition text for turing machines
      transitionsWithRejected = transitions
    }

    // Add 'REJECTED'/'ACCEPTED' label
    return `${transitionsWithRejected.join('\n')}${(traceIdx === lastTraceIdx || (enableManualStepping && currentManualSuccessors.length === 0)) ? '\n\n' + (accepted ? 'ACCEPTED' : 'REJECTED') : ''}`
  }, [traceInput, simulationResult, statePrefix, traceIdx, getStateName, enableManualStepping])

  // Creates problem and sets it, should run every time trace/graph changes while enableManualStepping is enabled
  useEffect(() => {
    if (enableManualStepping) {
      const _problem = buildProblem(graph, traceInput)
      if (_problem != null) {
        setProblem(_problem)
        setCurrentManualNode(_problem.initial)
        setTraceIdx(0)
      }
    } else {
      setTraceIdx(0)
    }
  }, [enableManualStepping, traceInput, lastChangeDate])

  // To move execution path back when backtracking while enableManualStepping is enabled
  useEffect(() => {
    if (enableManualStepping) {
      let nodeChainLength = 0
      let currentNode = currentManualNode
      while (currentNode) {
        nodeChainLength += 1
        currentNode = currentNode.parent
      }
      // If traceIdx is larger than nodes in manual execution, then shrink
      if (nodeChainLength > traceIdx + 1) {
        const amountToShrink = nodeChainLength - (traceIdx + 1)
        for (let i = 0; i < amountToShrink; i++) {
          setCurrentManualNode(currentManualNode.parent)
        }
      }
    }
  }, [traceIdx])

  // Runs every time new node is selected while enableManualStepping is enabled
  useEffect(() => {
    if (enableManualStepping) {
      // Updates array of successors
      if (currentManualNode != null && problem) {
        if (preferences.pauseTM && problem.isFinalState(currentManualNode)) {
          setCurrentManualSuccessors([])
        } else {
          setCurrentManualSuccessors(problem.getSuccessors(currentManualNode))
        }
      }
    }
  }, [traceInput, problem, currentManualNode])

  // To force simulation to update
  useEffect(() => {
    simulateGraph()
  }, [traceInput, enableManualStepping, currentManualNode])

  // Resets simultation on graph change
  useEffect(() => {
    simulateGraph()
    setMultiTraceOutput([])
    setTraceIdx(0)
  }, [lastChangeDate])

  // Set the trace IDx to be passed through store to TMTapeLab component
  useEffect(() => {
    if (['TM', 'PDA'].includes(graph.projectType)) {
      setProjectSimTraceIDx(traceIdx)
    }
    // Try this for PDA as well - stack display
  }, [traceIdx])

  // Update warnings
  const noInitialState = [null, undefined].includes(graph?.initialState) || !graph?.states.find(s => s.id === graph?.initialState)
  const noFinalState = !graph?.states.find(s => s.isFinal)
  const warnings = []

  // Update disconnected warning
  const pathToFinal = useMemo(() => {
    // Solution to #359 - Concat the intial state to solve the problem that a legal 1 state (both initial and final) 0 transition machine can accept λ
    const closure = closureWithPredicate(graph, graph.initialState, () => true)
    return Array.from(closure).concat({ state: graph.initialState, transitions: [] }).some(({ state }) => graph.states.find(s => s.id === state)?.isFinal)
  }, [graph])
  // Also part of #359 - No need to flag that there is a disconnection if # states <= 1
  if (noInitialState) { warnings.push('There is no initial state') }
  if (noFinalState) { warnings.push('There are no final states') } else if (!pathToFinal) { warnings.push('There is no path to final state') }

  // :^)
  const dibEgg = useDibEgg()

  // Determine input position
  const currentTrace = simulationResult?.trace.slice(0, traceIdx + 1) ?? []
  const inputIdx = currentTrace.map(tr => 'read' in tr && tr.read !== 'λ' ? 1 : 0).reduce((a, b) => a + b, 0) ?? 0
  const currentStateID = currentTrace?.[currentTrace.length - 1]?.to ?? graph?.initialState
  const automataIsInvalid = noInitialState || noFinalState || !pathToFinal

  // Display the valid transitions that could be manually chosen
  const buttonsArray:JSX.Element[] = []
  currentManualSuccessors.forEach(t => {
    // Add transition to the form of <Button>{'a,X;R: q0 -> q1'}</Button>
    buttonsArray.push(<Button onClick={() => {
      setCurrentManualNode(t)
      setTraceIdx(traceIdx + 1)
    }}>{nodeTransitionString(t)}</Button>)
  })

  return (
    <>
      {(showTraceTape && graph.projectType !== 'TM' && traceInput !== '') &&
        <TraceStepBubble input={traceInput} index={inputIdx} stateID={currentStateID} />
      }
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
            setSimulationResult(undefined)
          }}
          value={traceInput ?? ''}
          placeholder="λ"
        />

        <StepButtons>
          <Button icon={<SkipBack size={20} />}
            disabled={traceIdx <= 0 || automataIsInvalid
            }
            onClick={() => {
              setTraceIdx(0)
              handleStep('Reset')
            }} />

          <Button icon={<ChevronLeft size={23} />}
            disabled={traceIdx <= 0 || automataIsInvalid
            }
            onClick={() => {
              setTraceIdx(traceIdx - 1)
              handleStep('Backward')
            }} />

          <Button icon={<ChevronRight size={23} />}
            disabled={
              traceIdx >= lastTraceIdx || automataIsInvalid || enableManualStepping
            }
            onClick={() => {
              if (!simulationResult) {
                simulateGraph()
              }
              setTraceIdx(traceIdx + 1)
              handleStep('Forward')
            }} />

          <Button icon={<SkipForward size={20} />}
            // eslint-disable-next-line no-mixed-operators
            disabled={
                traceIdx >= lastTraceIdx || automataIsInvalid || enableManualStepping
            }
            onClick={() => {
              // Increment tracer index
              const result = simulationResult ?? simulateGraph()
              setTraceIdx(lastTraceIdx)
              dibEgg(traceInput, result.accepted)
            }} />
        </StepButtons>
        {traceOutput && <div>
          <TracePreview
              result={simulationResult as (FSAExecutionResult | PDAExecutionResult) & {transitionCount: number}}
              step={traceIdx}
              statePrefix={statePrefix}
              states={graph.states}
          />
          <TraceConsole><pre>{traceOutput}</pre></TraceConsole>
        </div>}
        {projectType !== 'TM' && (
        <Preference
          label={useMemo(() => Math.random() < 0.001 ? 'Trace buddy' : 'Trace tape', [])}
          style={{ marginBlock: 0 }}
        >
          <Switch
            type="checkbox"
            checked={showTraceTape}
            disabled={automataIsInvalid}
            onChange={e => setShowTraceTape(e.target.checked)}
          />
        </Preference>
        )}
        {(
        <Preference
          label={'Manual stepping'}
          style={{ marginBlock: 0 }}
        >
          <Switch
            type="checkbox"
            checked={enableManualStepping}
            disabled={automataIsInvalid}
            onChange={e => setEnableManualStepping(e.target.checked)}
          />
        </Preference>
        )}
      </Wrapper>

          {enableManualStepping && (currentManualSuccessors.length !== 0) && <>
              <SectionLabel>Transitions</SectionLabel>
              <Wrapper>
              {(buttonsArray)}
                        </Wrapper>
      </>}

      {!enableManualStepping && <>
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
                    const paste = e.clipboardData.getData('text')
                    if (!paste.includes('\n')) return

                    e.preventDefault()
                    const lines = paste.split(/\r?\n/).filter(l => l !== '')
                    lines.forEach((l, i) => i === 0 ? updateMultiTraceInput(index, l) : addMultiTraceInput(l))
                  }}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    assertType<HTMLElement>(e.target)
                    if (e.key === 'Enter' && !e.repeat) {
                      if (e.metaKey || e.ctrlKey) {
                        // Run shortcut
                        rerunMultiTraceInput()
                      } else {
                        addMultiTraceInput()
                        window.setTimeout(() => (e.target as HTMLElement).closest('div').parentElement?.querySelector<HTMLElement>('div:last-of-type > input')?.focus(), 50)
                      }
                    }
                    if (e.key === 'Backspace' && value === '' && !e.repeat) {
                      if (multiTraceInput.length === 1) return
                      e.preventDefault()
                      e.target?.focus()
                      if (e.target.closest('div').parentElement?.querySelector('div:last-of-type > input') === e.target) {
                        (e.target?.closest('div')?.previousSibling as HTMLElement)?.querySelector('input')?.focus()
                      }
                      removeMultiTraceInput(index)
                      setMultiTraceOutput([])
                    }
                    if (e.key === 'ArrowUp') {
                      (e.target?.closest('div')?.previousSibling as HTMLElement)?.querySelector('input')?.focus()
                    }
                    if (e.key === 'ArrowDown') {
                      (e.target?.closest('div')?.nextSibling as HTMLElement)?.querySelector('input')?.focus()
                    }
                  }}
                />
                <RemoveButton
                  onClick={e => {
                    const container = (e.target as HTMLElement).closest('div')
                    const next = (((container?.nextSibling as HTMLElement)?.tagName === 'DIV' || multiTraceInput.length === 1) ? container : container?.previousSibling) as HTMLElement
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
        </>}
    </>
  )
}

export default TestingLab
