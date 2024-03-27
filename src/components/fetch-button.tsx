import * as React from "react";
import { useScenarioStore } from "../scenario-store";
import { Scenario } from "../scenario/scenario";

export const FetchButton: React.FC = () => {
  const scenarioStore = useScenarioStore();

  const fetch = React.useCallback(() => {
    const fetchScenario = scenarioStore.newScenario("fetchApi", 3000);
    fetchApi(fetchScenario);
  }, [scenarioStore]);

  return (
    <div>
      <button onClick={fetch}>Fetch</button>
    </div>
  );
};

const delay = async (duration: number) => {
  console.log(`await ${duration}`);
  return new Promise((resolve) => setTimeout(resolve, duration));
};

const fetchApi = async (fetchScenario: Scenario) => {
  await delay(500);
  fetchScenario.mark("fetch_complete");
  await delay(700);
  fetchScenario.pause();
  console.log("-- pause for 1000 --");
  await delay(1000);
  fetchScenario.resume();
  await delay(200);
  fetchScenario.mark("click");
  await delay(300);
  fetchScenario.pause();
  console.log("-- pause for 600 --");
  await delay(600);
  fetchScenario.resume();
  await delay(100);
  fetchScenario.stop();
  console.log(fetchScenario.info);
};

// start -> 500 -> fetch_complete -> 700 -> pause -> 1000 -> resume -> 200 -> stop
// total: 2400

/*
start || delta: 0, stepDelta: 0 
fetch_complete || delta: 500, stepDelta: 500
pause || delta: 1200, stepDelta: 1000
stop || delta: 1400, stepDelta: 200
*/
