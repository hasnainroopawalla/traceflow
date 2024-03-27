import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const basicNoStopStep = {
  name: "basic-no-stop-step",
  run: (scenario: Scenario) => {
    sleep(500);
    scenario.mark("step_1");
    sleep(700);
    scenario.mark("step_2");
    sleep(5000);
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
      delta: 500,
      stepDelta: 500,
      sequence: 2,
      status: ScenarioStatus.Success,
      previousStep: "start",
    },
    {
      step: "step_2",
      delta: 1200,
      stepDelta: 700,
      sequence: 3,
      status: ScenarioStatus.Success,
      previousStep: "step_1",
    },
    {
      step: ScenarioStep.Stop,
      delta: 3000,
      stepDelta: 1800,
      sequence: 4,
      status: ScenarioStatus.Timeout,
      previousStep: "step_2",
    },
  ],
};
