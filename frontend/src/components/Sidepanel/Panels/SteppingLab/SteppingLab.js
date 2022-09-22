import { Wrapper, ButtonRow } from "./steppingLabStyle";
import { SectionLabel, Input, Button } from "/src/components";
import { useProjectStore } from "/src/stores";
import {
  SkipBack,
  ChevronRight,
  ChevronLeft,
  Snowflake,
  Flame,
  XCircle,
} from "lucide-react";

import { graphStepper } from "@automatarium/simulation-v2";
import { useMemo, useState } from "react";

// The initial states and project store calls, along with the display of the current input trace,
// could be made its own component, and the Testing Lab could switch between the two using a
// Switch component. For demonstrative purposes, I've made this a separate component for now, which
// means there's some repetition.

const SteppingLab = () => {
  const [frontier, setFrontier] = useState([]);
  const [graph] = useState({
    states: useProjectStore((s) => s.project.states),
    transitions: useProjectStore((s) => s.project.transitions),
    initialState: useProjectStore((s) => s.project.initialState),
  });
  const traceInput = useProjectStore((s) => s.project.tests.single);
  const setTraceInput = useProjectStore((s) => s.setSingleTest);

  const stepper = useMemo(() => {
    return graphStepper(graph, traceInput);
  }, [graph, traceInput]);

  console.log(frontier);

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
            onClick={() => {
              setFrontier(stepper.reset());
            }}
          />
          <Button
            icon={<ChevronLeft size={25} />}
            onClick={() => {
              setFrontier(stepper.backward());
            }}
          />
          <Button
            icon={<ChevronRight size={25} />}
            onClick={() => {
              setFrontier(stepper.forward());
            }}
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
