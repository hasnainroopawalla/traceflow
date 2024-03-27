import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const stopDuringPause = {
  name: "stop-during-pause",
  data: {},
  run: (scenario: Scenario) => {
    sleep(400);
    scenario.mark("step_1");
    sleep(700);
    scenario.pause();
    sleep(1000);
    scenario.stop();
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
      data: {},
    },
    {
      step: "step_1",
      delta: 400,
      stepDelta: 400,
      sequence: 2,
      status: ScenarioStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: ScenarioStep.Stop,
      delta: 2100,
      stepDelta: 1000,
      sequence: 3,
      status: ScenarioStatus.Success,
      previousStep: "step_1",
      data: {},
    },
  ],
};
