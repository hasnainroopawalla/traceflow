import { type IScenarioStep, Scenario } from "../../src/scenario";
import { basic } from "./basic";
import { singlePause } from "./single-pause";
import { earlyTimeout } from "./early-timeout";
import { timeoutBeforeStop } from "./timeout-before-stop";
// import { singlePauseTimeout } from "./single-pause-timeout";
import { doublePause } from "./double-pause";

type IScenarioPreset = {
  name: string;
  run: (scenario: Scenario) => void;
  expectedSteps: Omit<IScenarioStep, "timestamp">[];
};

export const scenarioPresets: IScenarioPreset[] = [
  basic,
  timeoutBeforeStop,
  earlyTimeout,
  singlePause,
  // singlePauseTimeout,
  doublePause,
];
