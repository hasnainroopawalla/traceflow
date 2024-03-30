import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const timeoutBeforeStop = {
  name: "timeout-before-stop",
  data: {},
  status: FlowStatus.Timeout,
  run: (flow: Flow) => {
    sleep(200);
    flow.mark("step_1");
    sleep(1300);
    flow.mark("step_2");
    sleep(4000);
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
      step: "step_2",
      delta: 1500,
      stepDelta: 1300,
      sequence: 3,
      status: FlowStatus.Success,
      previousStep: "step_1",
      data: {},
    },
    {
      step: FlowStep.Stop,
      delta: 3000,
      stepDelta: 1500,
      sequence: 4,
      status: FlowStatus.Timeout,
      previousStep: "step_2",
      data: {},
    },
  ],
};
