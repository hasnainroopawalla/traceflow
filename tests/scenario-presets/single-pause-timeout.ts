import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const singlePauseTimeout = {
  name: "single-pause-timeout",
  run: (scenario: Scenario) => {
    sleep(400);
    scenario.mark("step_1");
    sleep(700);
    scenario.pause();
    sleep(1000);
    scenario.resume();
    sleep(4000);
    scenario.mark("step_2");
    sleep(300);
    scenario.stop();
  },
  expectedSteps: [
    {
      step: ScenarioStep.Start,
      delta: 0,
      stepDelta: 0,
      sequence: 1,
      status: ScenarioStatus.Success,
      previousStep: undefined,
    },
    {
      step: "step_1",
      delta: 400,
      stepDelta: 400,
      sequence: 2,
      status: ScenarioStatus.Success,
      previousStep: "start",
    },
    {
      step: ScenarioStep.Pause,
      delta: 1100,
      stepDelta: 1000,
      sequence: 3,
      status: ScenarioStatus.Success,
      previousStep: "step_1",
    },
    {
      step: ScenarioStep.Stop,
      delta: 3000,
      stepDelta: 1900,
      sequence: 4,
      status: ScenarioStatus.Timeout,
      previousStep: "pause",
    },
  ],
};
