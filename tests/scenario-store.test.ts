import { ScenarioStore } from "../src";

Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => Math.random().toString(),
  },
});

describe("ScenarioStore", () => {
  beforeEach(() => {
    ScenarioStore.clearAllScenarios();
  });

  test("findScenarioByName with 2 active scenarios", () => {
    const testScenario1 = ScenarioStore.newScenario("test-scenario-1", 5000);
    const testScenario2 = ScenarioStore.newScenario("test-scenario-2", 10000);

    expect(ScenarioStore.findScenarioByName("test-scenario-1")).toMatchObject(
      testScenario1
    );
    expect(ScenarioStore.findScenarioByName("test-scenario-2")).toMatchObject(
      testScenario2
    );
    expect(ScenarioStore.findScenarioByName("test-scenario-3")).toBe(undefined);
  });

  test("findScenarioByName before and after scenario is inactive", () => {
    const scenario = ScenarioStore.newScenario("test-scenario-1", 5000);
    expect(ScenarioStore.findScenarioByName("test-scenario-1")).toMatchObject(
      scenario
    );

    scenario.stop();

    expect(ScenarioStore.findScenarioByName("test-scenario-1")).toBe(undefined);
  });

  test("findScenarioById with 2 active scenarios", () => {
    const testScenario1 = ScenarioStore.newScenario("test-scenario-1", 5000);
    const testScenario2 = ScenarioStore.newScenario("test-scenario-2", 10000);

    expect(ScenarioStore.findScenarioById(testScenario1.id)).toMatchObject(
      testScenario1
    );
    expect(ScenarioStore.findScenarioById(testScenario2.id)).toMatchObject(
      testScenario2
    );
    expect(ScenarioStore.findScenarioById("random")).toBe(undefined);
  });

  test("findScenarioById before and after scenario is inactive", () => {
    const scenario = ScenarioStore.newScenario("test-scenario-1", 5000);
    expect(ScenarioStore.findScenarioById(scenario.id)).toMatchObject(scenario);

    scenario.stop();

    expect(ScenarioStore.findScenarioById(scenario.id)).toBe(undefined);
  });
});
