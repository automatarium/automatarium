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

// The initial states and project store calls, along with the display of the current input trace,
// could be made its own component, and the Testing Lab could switch between the two using a
// Switch component. For demonstrative purposes, I've made this a separate component for now, which
// means there's some repetition.

const SteppingLab = () => {
  // Graph state
  const graph = {
    states: useProjectStore((s) => s.project.states),
    transitions: useProjectStore((s) => s.project.transitions),
    initialState: useProjectStore((s) => s.project.initialState),
  };

  const traceInput = useProjectStore((s) => s.project.tests.single);
  const setTraceInput = useProjectStore((s) => s.setSingleTest);

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
          <Button icon={<SkipBack size={20} />} onClick={() => {}} />
          <Button icon={<ChevronLeft size={23} />} onClick={() => {}} />
          <Button icon={<ChevronRight size={23} />} onClick={() => {}} />
        </ButtonRow>
        <ButtonRow>
          <Button icon={<Snowflake size={20} />} onClick={() => {}} />
          <Button icon={<Flame size={23} />} onClick={() => {}} />
          <Button icon={<XCircle size={23} />} onClick={() => {}} />
        </ButtonRow>
      </Wrapper>
    </>
  );
};

export default SteppingLab;
