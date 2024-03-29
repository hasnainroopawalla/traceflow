import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const noSteps = {
  name: "no-steps",
  data: {},
  status: FlowStatus.Success,
  run: (flow: Flow) => {
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
      delta: 1000,
      stepDelta: 1000,
      sequence: 2,
      status: FlowStatus.Success,
      previousStep: "start",
      data: {},
    },
  ],
};
