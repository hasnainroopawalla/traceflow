import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const timeoutBeforeStop = {
  name: "timeout-before-stop",
  data: {},
  status: ScenarioStatus.Timeout,
  run: (scenario: Scenario) => {
    sleep(200);
    scenario.mark("step_1");
    sleep(1300);
    scenario.mark("step_2");
    sleep(4000);
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
      delta: 200,
      stepDelta: 200,
      sequence: 2,
      status: ScenarioStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: "step_2",
      delta: 1500,
      stepDelta: 1300,
      sequence: 3,
      status: ScenarioStatus.Success,
      previousStep: "step_1",
      data: {},
    },
    {
      step: ScenarioStep.Stop,
      delta: 3000,
      stepDelta: 1500,
      sequence: 4,
      status: ScenarioStatus.Timeout,
      previousStep: "step_2",
      data: {},
    },
  ],
};
