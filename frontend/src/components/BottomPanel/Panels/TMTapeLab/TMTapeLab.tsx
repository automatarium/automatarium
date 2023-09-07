import { SectionLabel } from '/src/components'
import TMTraceStepWindow from '/src/components/TMTraceStepWindow/TMTraceStepWindow'
import { useTMSimResultStore, useProjectStore } from '/src/stores'
import { Wrapper } from './tmTapeLabStyle'

const TMTapeLab = () => {
  const traceIDx = useTMSimResultStore(s => s.traceIDx)
  const traceInput = useProjectStore((s) => s.project.tests.single)

  const simResults = useTMSimResultStore(s => s.simResults)

  return (
    <>
    <SectionLabel>Turing Machine Tape</SectionLabel>
        {(simResults.length !== 0) && (
        <Wrapper >
            {simResults.map((result, index) => {
              const trace = result.trace[traceIDx] ?? {
                tape: {
                  pointer: 0,
                  trace: (traceInput || ' ').split('')
                },
                to: 0
              }
              return <TMTraceStepWindow key={index} trace={trace.tape.trace}
                                   pointer={trace.tape.pointer} accepted={result.accepted}
                                   isEnd={traceIDx === result.trace.length - 1}/>
            })}
        </Wrapper>
        )}
    </>
  )
}

export default TMTapeLab
