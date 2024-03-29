import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const earlyTimeout = {
  name: "early-timeout",
  data: {},
  status: FlowStatus.Timeout,
  run: (flow: Flow) => {
    sleep(700);
    flow.mark("step_1");
    sleep(5000);
    flow.mark("step_2");
    sleep(400);
    flow.mark("step_3");
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
      delta: 700,
      stepDelta: 700,
      sequence: 2,
      status: FlowStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: "stop",
      delta: 3000,
      stepDelta: 2300,
      sequence: 3,
      status: FlowStatus.Timeout,
      previousStep: "step_1",
      data: {},
    },
  ],
};
