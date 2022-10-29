import { Wrapper, ButtonRow } from "./steppingLabStyle";
import { SectionLabel, Input, Button } from "/src/components";
import { useProjectStore, useSteppingStore } from "/src/stores";
import {
  SkipBack,
  ChevronRight,
  ChevronLeft,
  Snowflake,
  Flame,
  XCircle,
} from "lucide-react";

import { graphStepper, graphStepperPDA } from "@automatarium/simulation-v2";
import { useEffect, useMemo, useState } from "react";

// The initial states and project store calls, along with the display of the current input trace,
// could be made its own component, and the Testing Lab could switch between the two using a
// Switch component. For demonstrative purposes, I've made this a separate component for now, which
// means there's some repetition.
const SteppingLab = () => {
  const [frontier, setFrontier] = useState([]);
  const projectType = useProjectStore(s => s.project.config.type);
  const states = useProjectStore((s) => s.project.states);
  const transitions = useProjectStore((s) => s.project.transitions);
  const initialState = useProjectStore((s) => s.project.initialState);

  const traceInput = useProjectStore((s) => s.project.tests.single);
  const setTraceInput = useProjectStore((s) => s.setSingleTest);

  const setSteppedStates = useSteppingStore((s) => s.setSteppedStates);

  const graph = useMemo(() => {
    return {
      states,
      transitions,
      initialState,
    };
  }, [states, transitions, initialState]);

  const stepper = useMemo(() => {
    // Graph stepper for PDA currently requires changes to BFS stack logic 
    // to handle non-determinism so branching stops on the first rejected transition.
    if(projectType==='PDA') {
      return graphStepperPDA(graph, traceInput);
    }
    // Graph stepper for FSA/NFA
    else {
      return graphStepper(graph, traceInput);
    }
  }, [graph, traceInput]);

  const handleStep = (newFrontier) => {
    setFrontier(newFrontier);
    setSteppedStates(newFrontier);
  };

  return (
    <>
      <SectionLabel>Trace</SectionLabel>
      <Wrapper>
        <Input
          onChange={(e) => {
            setTraceInput(e.target.value);
          }}
          value={traceInput ?? ""}
          placeholder="Enter a value to test"
        />
        <ButtonRow>
          <Button
            icon={<SkipBack size={23} />}
            onClick={() => handleStep(stepper.reset())}
          />
          <Button
            icon={<ChevronLeft size={25} />}
            onClick={() => handleStep(stepper.backward())}
          />
          <Button
            icon={<ChevronRight size={25} />}
            onClick={() => handleStep(stepper.forward())}
          />
        </ButtonRow>
        <ButtonRow>
          <Button icon={<Snowflake size={23} />} onClick={() => {}} />
          <Button icon={<Flame size={23} />} onClick={() => {}} />
          <Button icon={<XCircle size={23} />} onClick={() => {}} />
        </ButtonRow>
      </Wrapper>
    </>
  );
};

export default SteppingLab;
