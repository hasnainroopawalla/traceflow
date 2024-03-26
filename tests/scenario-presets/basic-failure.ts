import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const basicFailure = {
  name: "basic-failure",
  run: (scenario: Scenario) => {
    sleep(200);
    scenario.mark("step_1");
    sleep(400);
    scenario.mark("step_2");
    sleep(1500);
    scenario.fail();
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
      delta: 200,
      stepDelta: 200,
      sequence: 2,
      status: ScenarioStatus.Success,
      previousStep: "start",
    },
    {
      step: "step_2",
      delta: 600,
      stepDelta: 400,
      sequence: 3,
      status: ScenarioStatus.Success,
      previousStep: "step_1",
    },
    {
      step: ScenarioStep.Stop,
      delta: 2100,
      stepDelta: 1500,
      sequence: 4,
      status: ScenarioStatus.Failure,
      previousStep: "step_2",
    },
  ],
};
