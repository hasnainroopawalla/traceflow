import React from "react";
import ReactDOM from "react-dom/client";
import { MyCounter } from "./components";

console.log("HII");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <div>
    <h2>Default counter</h2>
    <MyCounter initialValue={8} />
  </div>
);
