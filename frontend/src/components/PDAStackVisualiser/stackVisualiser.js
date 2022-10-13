/* eslint-disable react/jsx-key */
import { createContext, useContext, useEffect, useState } from "react";
// import { usePDAVisualiserStore } from "../../stores";
import { usePDAVisualiserStore } from "/src/stores";
import "./stackVisualiser.css";
// import {result} from '../Sidepanel/Panels/TestingLab'

const StackContext = createContext();

const PDAStackVisualiser = () => {
  // Closes and shows the PDA stack visualiser.
  const [showStackTab, setShowStackTab] = useState(true);
  // Variables to save values
  const [popValue, setPopValue] = useState("DOES IT SAVE");
  const [pushValue, setPushValue] = useState("DOES IT SAVE");

  const stackInfo = usePDAVisualiserStore((s) => s.stack);
  // String
  const stackList = JSON.stringify(stackInfo);
  // console.log(`this is current stack info ${stackInfo}`)
  console.log(`this is current stack with stringify ${stackList}`);

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
        <h1>{`Hello ${popValue}!`}</h1>
      </StackContext.Provider>
    );
  }

  // TEMPORARY: Hardcoded variables for testing.
  let stack = [];
  stack.push({ element: "g" });
  stack.push({ element: "b" });
  stack.push({ element: "k" });
  stack.push({ element: "k" });

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

  console.log(stack);

  return (
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
  );
};

export default PDAStackVisualiser;
