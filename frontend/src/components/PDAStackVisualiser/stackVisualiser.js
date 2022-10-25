/* eslint-disable react/jsx-key */
import { createContext, useContext, useEffect, useState } from "react";
// import { usePDAVisualiserStore } from "../../stores";
import { useProjectStore, usePDAVisualiserStore } from "/src/stores";
import { useTMSimResultStore } from "/src/stores";
import "./stackVisualiser.css";
import { current } from "immer";
// import {result} from '../Sidepanel/Panels/TestingLab'

const StackContext = createContext();


const PDAStackVisualiser = () => {
  // Closes and shows the PDA stack visualiser.
  const [showStackTab, setShowStackTab] = useState(true);
  const traceIDx = useTMSimResultStore(s => s.traceIDx);
  
  // Variables to save values
  const [popValue, setPopValue] = useState("DOES IT SAVE");
  const [pushValue, setPushValue] = useState("DOES IT SAVE");

  const stackInfo = usePDAVisualiserStore((s) => s.stack);
  // String
  const stackList = JSON.stringify(stackInfo);
  // console.log(`this is current stack info ${stackInfo}`)
  console.log(`this is current stack with stringify ${stackList}`);

  const projectType = useProjectStore(s => s.project.config.type)

  // I will need to retrieve these values, maybe I can loop through them using a for loop
  Object.keys(stackInfo).map((i) => {
    let stackValue = i;
    if (stackValue == "trace") {
      for (const e in stackInfo[i]) {
        console.log("VALUES I NEED: ", stackInfo[i][e]);
      }
    }
  });

  // Saved values and then prints it
  function Component1() {
    return (
      <StackContext.Provider value={popValue}>
        {/* <h1>{`Hello ${popValue}!`}</h1> */}
      </StackContext.Provider>
    );
  }

  // Push stack values using the current trace ID
  let stack = [];

  let currentStack;

  if (stackInfo.trace) {
    currentStack = stackInfo.trace[traceIDx].currentStack;
    for (let i = 0; i < currentStack.length; i++) {
      stack.push({element: currentStack[i], key: i});
    }
  }

  // removes first element from the stack
  function addToStack() {
    console.log("HELLO");
    stack.push({ element: "a" });
    console.log(`push: ${stack}`);
  }

  function removeStack() {
    console.log("HELLO");
    stack.shift();
    console.log(`pop: ${stack}`);
  }

  // Maybe put a useEffect here and it re renders the 'stack'
  function displayStack() {
    return stack
      .slice(0)
      .reverse()
      .map((x) => {
        return <div className="stack-item">{x.element}</div>;
      });
  }

  // if button is clicked, I want to change the array and re-render displayStack, so maybe I need a useEffect

  const [show, setShow] = useState();

  return (
    projectType === "PDA" && (
      <div className="content-container">
        {/* =========== Title and Tab button =========== */}
        Display Stack{" "}
        <button
          className="close-stack-btn"
          onClick={() => setShowStackTab((e) => !e)}
        >
          x
        </button>
        {/* =========== TEMPORARY =========== */}
        <Component1 />
        {console.log(`Stack info: ${stackInfo}`)}
        {Object.keys(stackInfo).map((i) => {
          let stackValue = i;

          if (stackValue == "trace") {
            for (const e in stackInfo[i]) {
              console.log("Info for stack: ", stackInfo[i][e]);
            }
          }

          {
            console.log(`Value: ${stackValue}`);
          }

          // {stackValue == 'trace' ? console.log(`Trace info for: ${stackInfo[i][2].currentStack}`) : console.log()}

          // {console.log(`Getting value from object: ${JSON.parse(stackValue)}`)}
          // {console.log(`Getting value from object: ${stackValue[2]}`)}
        })}
        {/* =========== Displays the stack =========== */}
        {showStackTab ? (
          <div className="stack-container">
            {/* <button onClick={() => setShow((s) => !s)}>show stack</button> */}
            <h3>Stack</h3>
            <div className="stack-container">
              {show ? "no show" : displayStack()}
            </div>

            {/* <div className="stack-container">
              <p>(temp)dummy buttons</p>
              <button onClick={removeStack}>popStack</button>
              <button onClick={addToStack}>push</button>
            </div> */}
          </div>
        ) : null}
      </div>
    )
  );
};

export default PDAStackVisualiser;
