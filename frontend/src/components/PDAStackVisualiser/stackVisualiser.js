/* eslint-disable react/jsx-key */
import { createContext, useContext, useEffect, useState } from "react";
// import { usePDAVisualiserStore } from "../../stores";
import { usePDAVisualiserStore } from "/src/stores";
import "./stackVisualiser.css";
// import {result} from '../Sidepanel/Panels/TestingLab'

const UserContext = createContext();

function Component1() {
  const [user, setUser] = useState("DOES IT SAVE");

  return (
    <UserContext.Provider value={user}>
      <h1>{`Hello ${user}!`}</h1>
      
    </UserContext.Provider>
  );
}



const PDAStackVisualiser = () => {
  // const PDAStackVisualiser = ({ elements }) => {
  let stack = [];
  // Closes and shows stack
  const [showStackTab, setShowStackTab] = useState(true);
  const [stackSymbols, setStackSymbols] = useState([]);

  const stackInfo = usePDAVisualiserStore((s) => s.stack);
  // String
  const stackList = JSON.stringify(stackInfo);
  // console.log(`this is current stack info ${stackInfo}`)
  console.log(`this is current stack with stringify ${stackList}`);

  // console.log(`this is stack ${Object.values(stackInfo)}`)
  stack.push({ element: "g" });
  stack.push({ element: "b" });
  stack.push({ element: "k" });
  stack.push({ element: "k" });

  //   setStackSymbols(stackSymbols => [...stackSymbols, stack])

  console.log(stackSymbols);

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

  // if button is clicked, I want to change the array and re-render displayStack

  const [show, setShow] = useState();

  console.log(stack);

  return (
    <div className="content-container">
      Display Stack{" "}
      <button
        className="close-stack-btn"
        onClick={() => setShowStackTab((e) => !e)}
      >
        x
      </button>
      {/* {stackInfo.map((obj) => {
            return <p>{obj.trace}</p>
        })} */}
      
      <Component1/>
      {console.log(`Stack info: ${stackInfo}`)}
      {Object.keys(stackInfo).map((i) => {
        // <p> key={stackInfo.trace}</p>

        let stackValue = i;
        // <p>This is a value{typeof(stackValue)}</p>
        // {console.log(`This is the stringified stack value: ${JSON.stringify(stackValue)}`)}

        // {}

        // if (stackValue=='trace') { for (element in stackInfo[i]) { variable add element.currentStack }}

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

{
  /* <button onClick={() => { 
                setItems(e => e.length ? stack : stack )}}>
                {stack.length ? 'hide stack' : 'show stack'}
                </button>
            <p>hello</p>
            <div className="container">
                {items ? stack.slice(0).reverse().map(x=>{
                    return (
                        <div className="stack-item">{x.element}</div>
                    )
                }) : ''}
            </div> */
}
