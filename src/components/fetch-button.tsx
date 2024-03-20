import * as React from "react";
import { useScenarioStore } from "../scenario-store";
import { Scenario } from "../scenario/scenario";

export const FetchButton: React.FC = () => {
  const scenarioStore = useScenarioStore();

  const fetch = React.useCallback(() => {
    const fetchScenario = scenarioStore.newScenario("fetchApi");
    fetchApi(fetchScenario);
  }, [scenarioStore]);

  return (
    <div>
      <button onClick={fetch}>Fetch</button>
    </div>
  );
};

const delay = async (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const fetchApi = async (fetchScenario: Scenario) => {
  await delay(500);
  fetchScenario.mark("fetch complete");
  await delay(1000);
  // fetchScenario.pause();
  // await delay(700);
  // fetchScenario.resume();
  fetchScenario.stop();
  console.log(fetchScenario.info);
};
