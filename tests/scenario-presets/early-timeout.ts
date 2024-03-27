import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const earlyTimeout = {
  name: "early-timeout",
  data: {},
  run: (scenario: Scenario) => {
    sleep(700);
    scenario.mark("step_1");
    sleep(5000);
    scenario.mark("step_2");
    sleep(400);
    scenario.mark("step_3");
    sleep(800);
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
      data: {},
    },
    {
      step: "step_1",
      delta: 700,
      stepDelta: 700,
      sequence: 2,
      status: ScenarioStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: "stop",
      delta: 3000,
      stepDelta: 2300,
      sequence: 3,
      status: ScenarioStatus.Timeout,
      previousStep: "step_1",
      data: {},
    },
  ],
};
