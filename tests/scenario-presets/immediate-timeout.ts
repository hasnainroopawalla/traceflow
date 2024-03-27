import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const immediateTimeout = {
  name: "immediate-timeout",
  run: (scenario: Scenario) => {
    sleep(5000);
    scenario.mark("step_1");
    sleep(700);
    scenario.mark("step_2");
    sleep(1000);
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
      step: ScenarioStep.Stop,
      delta: 3000,
      stepDelta: 3000,
      sequence: 2,
      status: ScenarioStatus.Timeout,
      previousStep: "start",
    },
  ],
};
