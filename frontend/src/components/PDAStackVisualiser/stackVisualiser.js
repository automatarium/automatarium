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
  // Variable to display stack
  const [show, setShow] = useState();

  const traceIDx = useTMSimResultStore((s) => s.traceIDx);
  const stackInfo = usePDAVisualiserStore((s) => s.stack);
  const projectType = useProjectStore((s) => s.project.config.type);

  // Stack
  let stack = [];
  let currentStack;

  // Stores stack variables
  if (stackInfo.trace) {
    if (stackInfo.trace[traceIDx]) {
      currentStack = stackInfo.trace[traceIDx].currentStack;
      for (let i = 0; i < currentStack.length; i++) {
        stack.push({ element: currentStack[i], key: i });
      }
    }
  }

  // Displays the stack
  function displayStack() {
    return stack
      .slice(0)
      .reverse()
      .map((x) => {
        return <div key={x.key} className="stack-item">{x.element}</div>;
      });
  }

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
        {/* =========== Displays the stack =========== */}
        {showStackTab ? (
          <div className="stack-container">
            <h3>Stack</h3>
            <div className="stack-container">
              {show ? "no show" : displayStack()}
            </div>
          </div>
        ) : null}
      </div>
    )
  );
};

export default PDAStackVisualiser;
