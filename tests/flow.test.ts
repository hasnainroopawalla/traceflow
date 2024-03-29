import { FlowStore } from "../src";
import { flowPresets } from "./flow-presets/presets";
import { validateFlowSteps } from "./test-utils";
import { Timer } from "../src/timer";

Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => "123",
  },
});

describe("Flow", () => {
  let timerDestroySpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    timerDestroySpy = jest.spyOn(Timer.prototype, "destroy");
    jest.useFakeTimers();
    Date.now = jest.fn(() => jest.now());
  });

  test.each(flowPresets)("$name", (flowPreset) => {
    const flow = FlowStore.newFlow(flowPreset.name, 3000);
    flowPreset.run(flow);

    expect(flow.info.name).toBe(flowPreset.name);
    expect(flow.info.data).toMatchObject(flowPreset.data);
    expect(flow.info.status).toBe(flowPreset.status);
    validateFlowSteps(flow.info.steps, flowPreset.expectedSteps);
    expect(timerDestroySpy).toHaveBeenCalledTimes(1);
  });
});
