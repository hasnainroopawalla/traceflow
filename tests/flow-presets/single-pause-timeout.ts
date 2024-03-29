import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const singlePauseTimeout = {
  name: "single-pause-timeout",
  data: {},
  status: FlowStatus.Timeout,
  run: (flow: Flow) => {
    sleep(400);
    flow.mark("step_1");
    sleep(700);
    flow.pause();
    sleep(1000);
    flow.resume();
    sleep(4000);
    flow.mark("step_2");
    sleep(300);
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
      delta: 400,
      stepDelta: 400,
      sequence: 2,
      status: FlowStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: FlowStep.Pause,
      delta: 1100,
      stepDelta: 1000,
      sequence: 3,
      status: FlowStatus.Success,
      previousStep: "step_1",
      data: {},
    },
    {
      step: FlowStep.Stop,
      delta: 3000,
      stepDelta: 1900,
      sequence: 4,
      status: FlowStatus.Timeout,
      previousStep: "pause",
      data: {},
    },
  ],
};
