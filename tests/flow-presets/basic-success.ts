import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const basicSuccess = {
  name: "basic-success",
  data: {},
  status: FlowStatus.Success,
  run: (flow: Flow) => {
    sleep(500);
    flow.mark("step_1");
    sleep(700);
    flow.mark("step_2", {
      reason: "custom-reason",
    });
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
      step: "step_1",
      delta: 500,
      stepDelta: 500,
      sequence: 2,
      status: FlowStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: "step_2",
      delta: 1200,
      stepDelta: 700,
      sequence: 3,
      status: FlowStatus.Success,
      previousStep: "step_1",
      data: {
        reason: "custom-reason",
      },
    },
    {
      step: FlowStep.Stop,
      delta: 2200,
      stepDelta: 1000,
      sequence: 4,
      status: FlowStatus.Success,
      previousStep: "step_2",
      data: {},
    },
  ],
};
