import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const doublePause = {
  name: "double-pause",
  data: {
    user: "user1",
    context: "context-A",
    selectedId: "abc",
  },
  status: FlowStatus.Success,
  run: (flow: Flow) => {
    sleep(200);
    flow.mark("step_1");
    sleep(700);
    flow.addFlowData({
      user: "user1",
    });
    flow.pause({
      reason: "pause-1",
    });
    sleep(1000);
    flow.resume();
    sleep(300);
    flow.mark("step_2");
    flow.addFlowData({
      context: "context-A",
      selectedId: "abc",
    });
    sleep(500);
    flow.pause({
      reason: "pause-2",
    });
    sleep(5500);
    flow.resume();
    sleep(800);
    flow.stop();
  },
  expectedSteps: [
    {
      step: FlowStep.Start,
      delta: 0,
      stepDelta: 0,
      sequence: 1,
      status: FlowStatus.Success,
      previousStep: "",
      data: {},
    },
    {
      step: "step_1",
      delta: 200,
      stepDelta: 200,
      sequence: 2,
      status: FlowStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: FlowStep.Pause,
      delta: 900,
      stepDelta: 1000,
      sequence: 3,
      status: FlowStatus.Success,
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
      status: FlowStatus.Success,
      previousStep: "pause",
      data: {},
    },
    {
      step: FlowStep.Pause,
      delta: 1700,
      stepDelta: 5500,
      sequence: 5,
      status: FlowStatus.Success,
      previousStep: "step_2",
      data: {
        reason: "pause-2",
      },
    },
    {
      step: FlowStep.Stop,
      delta: 2500,
      stepDelta: 800,
      sequence: 6,
      status: FlowStatus.Success,
      previousStep: "pause",
      data: {},
    },
  ],
};
