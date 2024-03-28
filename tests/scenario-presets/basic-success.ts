import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const basicSuccess = {
  name: "basic-success",
  data: {},
  status: ScenarioStatus.Success,
  run: (scenario: Scenario) => {
    sleep(500);
    scenario.mark("step_1");
    sleep(700);
    scenario.mark("step_2", {
      reason: "custom-reason",
    });
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
      previousStep: "",
      data: {},
    },
    {
      step: "step_1",
      delta: 500,
      stepDelta: 500,
      sequence: 2,
      status: ScenarioStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: "step_2",
      delta: 1200,
      stepDelta: 700,
      sequence: 3,
      status: ScenarioStatus.Success,
      previousStep: "step_1",
      data: {
        reason: "custom-reason",
      },
    },
    {
      step: ScenarioStep.Stop,
      delta: 2200,
      stepDelta: 1000,
      sequence: 4,
      status: ScenarioStatus.Success,
      previousStep: "step_2",
      data: {},
    },
  ],
};
