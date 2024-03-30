import { FlowStore } from "../src";

Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => Math.random().toString(),
  },
});

describe("FlowStore", () => {
  beforeEach(() => {
    FlowStore.destroyAllFlows();
  });

  test("findFlowByName with 2 active flows", () => {
    const testFlow1 = FlowStore.newFlow("test-flow-1", 5000);
    const testFlow2 = FlowStore.newFlow("test-flow-2", 10000);

    expect(FlowStore.findFlowByName("test-flow-1")).toMatchObject(testFlow1);
    expect(FlowStore.findFlowByName("test-flow-2")).toMatchObject(testFlow2);
    expect(FlowStore.findFlowByName("test-flow-3")).toBe(undefined);
  });

  test("findFlowByName before and after flow is inactive", () => {
    const flow = FlowStore.newFlow("test-flow-1", 5000);
    expect(FlowStore.findFlowByName("test-flow-1")).toMatchObject(flow);

    flow.stop();

    expect(FlowStore.findFlowByName("test-flow-1")).toBe(undefined);
  });

  test("findFlowByName for 3 active flows with the same name", () => {
    const _testFlow1 = FlowStore.newFlow("test-flow", 5000);
    const _testFlow2 = FlowStore.newFlow("test-flow", 10000);
    const testFlow3 = FlowStore.newFlow("test-flow", 2000);

    expect(FlowStore.findFlowByName("test-flow")).toMatchObject(testFlow3);
  });

  test("findFlowById with 2 active flows", () => {
    const testFlow1 = FlowStore.newFlow("test-flow-1", 5000);
    const testFlow2 = FlowStore.newFlow("test-flow-2", 10000);

    expect(FlowStore.findFlowById(testFlow1.id)).toMatchObject(testFlow1);
    expect(FlowStore.findFlowById(testFlow2.id)).toMatchObject(testFlow2);
    expect(FlowStore.findFlowById("random")).toBe(undefined);
  });

  test("findFlowById before and after flow is inactive", () => {
    const flow = FlowStore.newFlow("test-flow-1", 5000);
    expect(FlowStore.findFlowById(flow.id)).toMatchObject(flow);

    flow.stop();

    expect(FlowStore.findFlowById(flow.id)).toBe(undefined);
  });
});
