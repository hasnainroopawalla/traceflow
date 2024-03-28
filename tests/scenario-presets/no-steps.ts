import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const noSteps = {
  name: "no-steps",
  data: {},
  status: ScenarioStatus.Success,
  run: (scenario: Scenario) => {
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
      step: ScenarioStep.Stop,
      delta: 1000,
      stepDelta: 1000,
      sequence: 2,
      status: ScenarioStatus.Success,
      previousStep: "start",
      data: {},
    },
  ],
};
