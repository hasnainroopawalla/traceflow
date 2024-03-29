import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const basicFailure = {
  name: "basic-failure",
  data: {},
  status: FlowStatus.Failure,
  run: (flow: Flow) => {
    sleep(200);
    flow.mark("step_1");
    sleep(400);
    flow.mark("step_2");
    sleep(1500);
    flow.fail({
      error: "not found",
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
      delta: 200,
      stepDelta: 200,
      sequence: 2,
      status: FlowStatus.Success,
      previousStep: "start",
      data: {},
    },
    {
      step: "step_2",
      delta: 600,
      stepDelta: 400,
      sequence: 3,
      status: FlowStatus.Success,
      previousStep: "step_1",
      data: {},
    },
    {
      step: FlowStep.Stop,
      delta: 2100,
      stepDelta: 1500,
      sequence: 4,
      status: FlowStatus.Failure,
      previousStep: "step_2",
      data: {
        error: "not found",
      },
    },
  ],
};
