import { SectionLabel } from '/src/components'
import TMTraceStepWindow from '/src/components/TMTraceStepWindow/TMTraceStepWindow'
import { useTMSimResultStore } from '/src/stores'
import { Wrapper } from './tmTapeLabStyle'

const TMTapeLab = () => {
  const traceIDx = useTMSimResultStore(s => s.traceIDx)
  const simResults = useTMSimResultStore(s => s.simResults)
  return (
      <>
      <SectionLabel>Turing Machine Tapes</SectionLabel>
          {(simResults.length !== 0) && (
          <Wrapper >
              {simResults.map((result, index) => {
                const trace = result.trace[traceIDx]
                return <TMTraceStepWindow key={index} trace={trace.read.trace}
                                     pointer={trace.read.pointer} accepted={result.accepted}
                                     isEnd={traceIDx === result.trace.length - 1}/>
              })}
          </Wrapper>
          )}
      </>
  )
}

export default TMTapeLab
