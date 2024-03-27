import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const singlePause = {
  name: "single-pause",
  data: {},
  run: (scenario: Scenario) => {
    sleep(400);
    scenario.mark("step_1", {
      reason: "custom",
      from: "component-B",
    });
    sleep(700);
    scenario.pause({
      reason: "waiting for user",
    });
    sleep(1000);
    scenario.resume();
    sleep(300);
    scenario.mark("step_2");
    sleep(200);
    scenario.stop({
      context: "stopped-from-component-A",
    });
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
      data: {
        reason: "custom",
        from: "component-B",
      },
    },
    {
      step: ScenarioStep.Pause,
      delta: 1100,
      stepDelta: 1000,
      sequence: 3,
      status: ScenarioStatus.Success,
      previousStep: "step_1",
      data: { reason: "waiting for user" },
    },
    {
      step: "step_2",
      delta: 1400,
      stepDelta: 300,
      sequence: 4,
      status: ScenarioStatus.Success,
      previousStep: "pause",
      data: {},
    },
    {
      step: ScenarioStep.Stop,
      delta: 1600,
      stepDelta: 200,
      sequence: 5,
      status: ScenarioStatus.Success,
      data: {
        context: "stopped-from-component-A",
      },
      previousStep: "step_2",
    },
  ],
};
