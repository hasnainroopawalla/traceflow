import { type IScenarioStep, Scenario } from "../../src/scenario";
import { basic } from "./basic";
import { singlePause } from "./single-pause";
import { earlyTimeout } from "./early-timeout";
import { timeoutBeforeStop } from "./timeout-before-stop";
import { singlePauseTimeout } from "./single-pause-timeout";
import { doublePause } from "./double-pause";
import { doublePauseTimeout } from "./double-pause-timeout";
import { immediateTimeout } from "./immediate-timeout";
// import { singlePauseRepeated } from "./single-pause-repeated";

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
  singlePauseTimeout,
  doublePause,
  doublePauseTimeout,
  immediateTimeout,
  // singlePauseRepeated,
];
