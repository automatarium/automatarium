import { SectionLabel} from '/src/components'
import TMTraceStepWindow from '/src/components/TMTraceStepWindow/TMTraceStepWindow'
import { useTMSimResultStore } from '/src/stores'
import { Wrapper } from './tmTapeLabStyle'

const TMTapeLab = () => {
  const traceIDx = useTMSimResultStore(s => s.traceIDx)
  const simResults = useTMSimResultStore(s => s.simResults)
  return (
      <>
      <SectionLabel>Turing Machine Tapes</SectionLabel>
          {(simResults.length !==0 ) && (
          <Wrapper>

              {simResults.map((result, index) => (
                <TMTraceStepWindow key={index} trace={result.trace[traceIDx].read.trace} pointer={result.trace[traceIDx].read.pointer} />
              ))}
          </Wrapper>
        )}
      </>
  )

}

export default TMTapeLab
