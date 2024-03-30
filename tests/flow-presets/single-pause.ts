import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const singlePause = {
  name: "single-pause",
  data: {},
  status: FlowStatus.Success,
  run: (flow: Flow) => {
    sleep(400);
    flow.mark("step_1", {
      reason: "custom",
      from: "component-B",
    });
    sleep(700);
    flow.pause({
      reason: "waiting for user",
    });
    sleep(1000);
    flow.resume();
    sleep(300);
    flow.mark("step_2");
    sleep(200);
    flow.stop({
      context: "stopped-from-component-A",
    });
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
      delta: 400,
      stepDelta: 400,
      sequence: 2,
      status: FlowStatus.Success,
      previousStep: "start",
      data: {
        reason: "custom",
        from: "component-B",
      },
    },
    {
      step: FlowStep.Pause,
      delta: 1100,
      stepDelta: 1000,
      sequence: 3,
      status: FlowStatus.Success,
      previousStep: "step_1",
      data: { reason: "waiting for user" },
    },
    {
      step: "step_2",
      delta: 1400,
      stepDelta: 300,
      sequence: 4,
      status: FlowStatus.Success,
      previousStep: "pause",
      data: {},
    },
    {
      step: FlowStep.Stop,
      delta: 1600,
      stepDelta: 200,
      sequence: 5,
      status: FlowStatus.Success,
      data: {
        context: "stopped-from-component-A",
      },
      previousStep: "step_2",
    },
  ],
};
