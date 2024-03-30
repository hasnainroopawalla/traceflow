import { Flow, FlowStatus, FlowStep } from "../../src";
import { sleep } from "../test-utils";

export const multiplePauses = {
  name: "multiple-pauses",
  data: {},
  status: FlowStatus.Success,
  run: (flow: Flow) => {
    sleep(400);
    flow.mark("step_1");
    sleep(700);
    flow.pause();
    flow.pause();
    flow.pause();
    flow.pause();
    sleep(1000);
    flow.resume();
    sleep(300);
    flow.mark("step_2");
    sleep(200);
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
      previousStep: "step_2",
      data: {},
    },
  ],
};
