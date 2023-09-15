import { Wrapper, ButtonRow } from './steppingLabStyle'
import { SectionLabel, Input, Button } from '/src/components'
import { useProjectStore, useSteppingStore } from '/src/stores'
import {
  SkipBack,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

import { graphStepper } from '@automatarium/simulation'
import { useMemo, useEffect } from 'react'
import { FSAProjectGraph, PDAProjectGraph, TMProjectGraph } from '/src/types/ProjectTypes'

type StepType = 'Forward' | 'Backward' | 'Reset'

// The initial states and project store calls, along with the display of the current input trace,
// could be made its own component, and the Testing Lab could switch between the two using a
// Switch component. For demonstrative purposes, I've made this a separate component for now, which
// means there's some repetition.
const SteppingLab = () => {
  const traceInput = useProjectStore(s => s.project.tests.single)
  const setTraceInput = useProjectStore(s => s.setSingleTest)
  const setSteppedStates = useSteppingStore(s => s.setSteppedStates)

  const graph = useProjectStore(s => s.getGraph())

  const stepper = useMemo(() => {
    // Graph stepper for PDA currently requires changes to BFS stack logic
    // to handle non-determinism so branching stops on the first rejected transition.
    return graphStepper(graph as FSAProjectGraph | PDAProjectGraph | TMProjectGraph, traceInput)
  }, [graph, traceInput])

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

      if (frontier && frontier.length > 0) {
        setSteppedStates(frontier)
      }
    }
  }

  useEffect(() => {
    if (stepper) {
      handleStep('Reset')
    }
  }, [traceInput])

  const noStepper = stepper === null && false

  return (
    <>
      <SectionLabel>Trace</SectionLabel>
      <Wrapper>
        <Input
          onChange={(e) => {
            setTraceInput(e.target.value)
          }}
          value={traceInput ?? ''}
          placeholder="Enter a value to test"
        />
        <ButtonRow>
          <Button
            icon={<SkipBack size={23} />}
            disabled={noStepper}
            onClick={() => handleStep('Reset')}
          />
          <Button
            icon={<ChevronLeft size={25} />}
            disabled={noStepper}
            onClick={() => handleStep('Backward')}
          />
          <Button
            icon={<ChevronRight size={25} />}
            disabled={noStepper}
            onClick={() => {
              if (stepper.canMoveForward()) {
                handleStep('Forward')
              }
            }}
          />
        </ButtonRow>
      </Wrapper>
    </>
  )
}

export default SteppingLab
