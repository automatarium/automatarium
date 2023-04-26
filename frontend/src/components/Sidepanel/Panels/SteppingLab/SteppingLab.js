import { Wrapper, ButtonRow } from './steppingLabStyle'
import { SectionLabel, Input, Button } from '/src/components'
import { useProjectStore, useSteppingStore } from '/src/stores'
import {
  SkipBack,
  ChevronRight,
  ChevronLeft,
  Snowflake,
  Flame,
  XCircle
} from 'lucide-react'

import { graphStepper } from '@automatarium/simulation'
import { useMemo, useState } from 'react'

// The initial states and project store calls, along with the display of the current input trace,
// could be made its own component, and the Testing Lab could switch between the two using a
// Switch component. For demonstrative purposes, I've made this a separate component for now, which
// means there's some repetition.
const SteppingLab = () => {
  const [, setFrontier] = useState([])
  const traceInput = useProjectStore((s) => s.project.tests.single)
  const setTraceInput = useProjectStore((s) => s.setSingleTest)

  const setSteppedStates = useSteppingStore((s) => s.setSteppedStates)

  const graph = useProjectStore(s => s.getGraph())

  const stepper = useMemo(() => {
    // Graph stepper for PDA currently requires changes to BFS stack logic
    // to handle non-determinism so branching stops on the first rejected transition.
    return graphStepper(graph, traceInput)
  }, [graph, traceInput])

  const handleStep = (newFrontier) => {
    setFrontier(newFrontier)
    setSteppedStates(newFrontier)
  }
  const noStepper = stepper === null
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
            onClick={() => handleStep(stepper.reset())}
          />
          <Button
            icon={<ChevronLeft size={25} />}
            disabled={noStepper}
            onClick={() => handleStep(stepper.backward())}
          />
          <Button
            icon={<ChevronRight size={25} />}
            disabled={noStepper}
            onClick={() => handleStep(stepper.forward())}
          />
        </ButtonRow>
        <ButtonRow>
          <Button icon={<Snowflake size={23} />}/>
          <Button icon={<Flame size={23} />} />
          <Button icon={<XCircle size={23} />}/>
        </ButtonRow>
      </Wrapper>
    </>
  )
}

export default SteppingLab
