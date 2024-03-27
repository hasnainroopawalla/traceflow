import { Scenario, ScenarioStatus, ScenarioStep } from "../../src/scenario";
import { sleep } from "../test-utils";

export const doublePause = {
  name: "double-pause",
  data: {
    user: "user1",
    context: "context-A",
    selectedId: "abc",
  },
  run: (scenario: Scenario) => {
    sleep(200);
    scenario.mark("step_1");
    sleep(700);
    scenario.addScenarioData({
      user: "user1",
    });
    scenario.pause({
      reason: "pause-1",
    });
    sleep(1000);
    scenario.resume();
    sleep(300);
    scenario.mark("step_2");
    scenario.addScenarioData({
      context: "context-A",
      selectedId: "abc",
    });
    sleep(500);
    scenario.pause({
      reason: "pause-2",
    });
    sleep(5500);
    scenario.resume();
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
      data: {
        reason: "pause-1",
      },
    },
    {
      step: "step_2",
      delta: 1200,
      stepDelta: 300,
      sequence: 4,
      status: ScenarioStatus.Success,
      previousStep: "pause",
      data: {},
    },
    {
      step: ScenarioStep.Pause,
      delta: 1700,
      stepDelta: 5500,
      sequence: 5,
      status: ScenarioStatus.Success,
      previousStep: "step_2",
      data: {
        reason: "pause-2",
      },
    },
    {
      step: ScenarioStep.Stop,
      delta: 2500,
      stepDelta: 800,
      sequence: 6,
      status: ScenarioStatus.Success,
      previousStep: "pause",
      data: {},
    },
  ],
};
