import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const immediateTimeout = {
  name: "immediate-timeout",
  data: {},
  status: FlowStatus.Timeout,
  run: (flow: Flow) => {
    sleep(5000);
    flow.mark("step_1");
    sleep(700);
    flow.mark("step_2");
    sleep(1000);
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
      step: FlowStep.Stop,
      delta: 3000,
      stepDelta: 3000,
      sequence: 2,
      status: FlowStatus.Timeout,
      previousStep: "start",

      data: {},
    },
  ],
};
