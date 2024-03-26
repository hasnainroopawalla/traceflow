import { type IScenarioStep, Scenario } from "../../src/scenario";
import { basicSuccess } from "./basic-success";
import { basicFailure } from "./basic-failure";
import { singlePause } from "./single-pause";
import { earlyTimeout } from "./early-timeout";
import { timeoutBeforeStop } from "./timeout-before-stop";
import { singlePauseTimeout } from "./single-pause-timeout";
import { doublePause } from "./double-pause";
import { doublePauseTimeout } from "./double-pause-timeout";
import { immediateTimeout } from "./immediate-timeout";
import { noSteps } from "./no-steps";
import { noStepsTimeout } from "./no-steps-timeout";
import { basicNoStopStep } from "./basic-no-stop-step";
// import { singlePauseRepeated } from "./single-pause-repeated";

type IScenarioPreset = {
  name: string;
  run: (scenario: Scenario) => void;
  expectedSteps: Omit<IScenarioStep, "timestamp">[];
};

export const scenarioPresets: IScenarioPreset[] = [
  noSteps,
  noStepsTimeout,
  basicSuccess,
  basicFailure,
  basicNoStopStep,
  timeoutBeforeStop,
  earlyTimeout,
  singlePause,
  singlePauseTimeout,
  doublePause,
  doublePauseTimeout,
  immediateTimeout,
  // singlePauseRepeated,
];
