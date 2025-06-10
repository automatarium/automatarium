import { useState, useCallback, useMemo, useEffect } from 'react'
import { SkipBack, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import { simulateFSA } from '@automatarium/simulation'

import { Input, Button, TracePreview } from '/src/components'

import { Wrapper, StepButtons, TraceConsole } from './testingLabStyle'
import { FSAExecutionResult } from '@automatarium/simulation/src/graph'
import { FSAProjectGraph } from '/src/types/ProjectTypes'
import { useTranslation } from 'react-i18next'

// Example automaton graph
const graph: FSAProjectGraph = {
  projectType: 'FSA',
  states: [
    { id: 0, isFinal: false, x: 0, y: 0 },
    { id: 1, isFinal: false, x: 0, y: 0 },
    { id: 2, isFinal: true, x: 0, y: 0 }
  ],
  transitions: [
    { id: 0, from: 0, to: 1, read: 'a' },
    { id: 1, from: 1, to: 2, read: 'b' }
  ],
  initialState: 0
}

const TestingLab = ({ Step }) => {
  const { t } = useTranslation('landing')
  const [input, setInput] = useState('ab')
  const [idx, setIdx] = useState(0)
  const [result, setResult] = useState<FSAExecutionResult & {transitionCount: number}>()

  const simulateGraph = useCallback(() => {
    const { accepted, trace, remaining } = simulateFSA(graph, input ?? '')
    const result = {
      accepted,
      remaining,
      trace: trace.map(step => ({
        to: step.to,
        read: step.read === '' ? 'λ' : step.read
      })),
      transitionCount: Math.max(1, trace.length - (accepted ? 1 : 0))
    }
    setResult(result)
    return result
  }, [input])

  const trace = useMemo(() => {
    if (!result) return ''

    const { trace, accepted, remaining, transitionCount } = result

    if (trace.length < 2) {
      if (idx > 0) return accepted ? t('component.testing_lab.accepted') : t('component.testing_lab.rejected')
      return null
    }

    const transitions = trace
      .slice(0, -1)
      .map((_, i) => [trace[i + 1]?.read, trace[i]?.to, trace[i + 1]?.to])
      .map(([read, start, end]) => `${read}: q${start} -> q${end}`)
      .filter((_x, i) => i < idx)

    const transitionsWithRejected = !accepted && idx === trace.length
      ? [...transitions,
          remaining[0]
            ? `${remaining[0]}: q${trace[trace.length - 1].to} ->|`
            : `\nq${trace[trace.length - 1].to} ->|`]
      : transitions

    return `${transitionsWithRejected.join('\n')}${(idx === transitionCount) ? '\n\n' + (accepted ? t('component.testing_lab.accepted') : t('component.testing_lab.rejected')) : ''}`
  }, [input, result, idx])

  useEffect(() => {
    const r = simulateGraph()
    setIdx(r.trace.length - (r.accepted ? 1 : 0))
  }, [])

  return (
    <Wrapper>
      <Input
        onChange={e => {
          setInput(e.target.value)
          setIdx(0)
          setResult(undefined)
        }}
        value={input}
        placeholder={t('component.testing_lab.input_placeholder')}
      />

      <StepButtons>
        <Button
          icon={<SkipBack size={20} />}
          disabled={idx <= 0}
          onClick={() => setIdx(0)}
        />

        <Button
        style={{
          backgroundColor: (Step === 4) ? '#90EE90' : '',
          color: (Step === 4) ? 'green' : 'white'
        }}
          icon={<ChevronLeft size={23} />}
          disabled={idx <= 0}
          onClick={() => setIdx(idx - 1)}
        />

        <Button
          style={{
            backgroundColor: (Step === 4) ? '#90EE90' : '',
            color: (Step === 4) ? 'green' : 'white'
          } }
          icon={<ChevronRight size={23} />}
          disabled={idx >= result?.transitionCount}

          onClick={() => {
            if (!result) {
              simulateGraph()
            }
            setIdx(idx + 1)
          }}
        />

        <Button
          style={{
            backgroundColor: (Step === 5) ? '#90EE90' : '',
            color: (Step === 5) ? 'green' : 'white'
          } }
          icon={<SkipForward size={20} />}
          disabled={idx === result?.transitionCount && idx !== 0}
          onClick={() => {
            // Increment tracer index
            const r = result ?? simulateGraph()
            setIdx(r.trace.length - (r.accepted ? 1 : 0))
          }}
        />
      </StepButtons>

      {trace && (
        <div>
          <TracePreview result={result} step={idx} states={graph.states} />
          <TraceConsole><pre>{trace}</pre></TraceConsole>

        </div>

      )}
    </Wrapper>
  )
}

export default TestingLab
