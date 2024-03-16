import * as React from "react";

type IMyCounterProps = {
  initialValue: number;
};

export const MyCounter: React.FC<IMyCounterProps> = () => {
  const [counter, setCounter] = React.useState(333);

  const onMinus = () => {
    setCounter((prev) => prev - 1);
    console.log("HI");
  };

  const onPlus = () => {
    setCounter((prev) => prev + 1);
  };

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={onMinus}>-</button>
      <button onClick={onPlus}>+</button>
    </div>
  );
};
