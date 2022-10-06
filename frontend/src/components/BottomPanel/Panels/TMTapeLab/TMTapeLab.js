import { SectionLabel} from '/src/components'
import TMTraceStepWindow from '/src/components/TMTraceStepWindow/TMTraceStepWindow'
import { useTMSimResultStore } from '/src/stores'
import { Wrapper } from './tmTapeLabStyle'
import { useRef, useEffect, useState } from 'react'

const TMTapeLab = () => {
    const traceIDx = useTMSimResultStore(s => s.traceIDx)
    const simResults = useTMSimResultStore(s => s.simResults)

    return (
      <>
      <SectionLabel>Turing Machine Tapes</SectionLabel>
          {(simResults.length !==0 ) && (
          <Wrapper >
              {simResults.map((result, index) => (
                <TMTraceStepWindow key={index} trace={result.trace[traceIDx].read.trace}
                                   pointer={result.trace[traceIDx].read.pointer} accepted={result.halted} isEnd={traceIDx===result.trace.length-1} />
              ))}
          </Wrapper>
        )}
      </>
    )

}

export default TMTapeLab
