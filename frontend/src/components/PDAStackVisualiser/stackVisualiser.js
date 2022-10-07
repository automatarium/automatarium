/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import './stackVisualiser.css';

const PDAStackVisualiser = () => {
// const PDAStackVisualiser = ({ elements }) => {
  let stack = [];
  const [stackSymbols, setStackSymbols] = useState([]);

  stack.push({ element: "a" });
  stack.push({ element: "b" });
  stack.push({ element: "c" });
  stack.push({ element: "d" });
  stack.push({ element: "e" });

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
    <div className="">
      <button onClick={() => setShow((s) => !s)}>show stack</button>
      <div className="stack-container">{show ? "no show" : displayStack()}</div>

      <div className="stack-container">
        <p>dummy buttons</p>
        <button onClick={removeStack}>popStack</button>
        <button onClick={addToStack}>push</button>
      </div>

      hello
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
