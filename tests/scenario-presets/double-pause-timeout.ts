import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const doublePauseTimeout = {
  name: "double-pause-timeout",
  data: {},
  run: (scenario: Scenario) => {
    sleep(200);
    scenario.mark("step_1");
    sleep(700);
    scenario.pause();
    sleep(1000);
    scenario.resume();
    sleep(500);
    scenario.mark("step_2");
    sleep(300);
    scenario.pause();
    sleep(900);
    scenario.resume();
    sleep(8000);
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
      delta: 200,
      stepDelta: 200,
      sequence: 2,
      status: ScenarioStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: ScenarioStep.Pause,
      delta: 900,
      stepDelta: 1000,
      sequence: 3,
      status: ScenarioStatus.Success,
      previousStep: "step_1",
      data: {},
    },
    {
      step: "step_2",
      delta: 1400,
      stepDelta: 500,
      sequence: 4,
      status: ScenarioStatus.Success,
      previousStep: "pause",
      data: {},
    },
    {
      step: ScenarioStep.Pause,
      delta: 1700,
      stepDelta: 900,
      sequence: 5,
      status: ScenarioStatus.Success,
      previousStep: "step_2",
      data: {},
    },
    {
      step: ScenarioStep.Stop,
      delta: 3000,
      stepDelta: 1300,
      sequence: 6,
      status: ScenarioStatus.Timeout,
      previousStep: "pause",
      data: {},
    },
  ],
};
