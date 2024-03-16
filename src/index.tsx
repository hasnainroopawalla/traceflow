import React from "react";
import ReactDOM from "react-dom/client";
import { FetchButton } from "./components/fetch-button";
import { ScenarioStoreProvider } from "./scenario-store/scenario-store-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ScenarioStoreProvider>
    <FetchButton />
  </ScenarioStoreProvider>
);
