import { ScenarioStore } from "../src/scenario-store";

Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => Math.random().toString(),
  },
});

describe("ScenarioStore", () => {
  let scenarioStore: ScenarioStore;

  beforeEach(() => {
    ScenarioStore.resetInstance();
    scenarioStore = ScenarioStore.getInstance();
  });

  test("findScenarioByName with 2 active scenarios", () => {
    const testScenario1 = scenarioStore.newScenario("test-scenario-1", 5000);
    const testScenario2 = scenarioStore.newScenario("test-scenario-2", 10000);

    expect(scenarioStore.findScenarioByName("test-scenario-1")).toMatchObject(
      testScenario1
    );
    expect(scenarioStore.findScenarioByName("test-scenario-2")).toMatchObject(
      testScenario2
    );
    expect(scenarioStore.findScenarioByName("test-scenario-3")).toBe(undefined);
  });

  test("findScenarioByName before and after scenario is inactive", () => {
    const scenario = scenarioStore.newScenario("test-scenario-1", 5000);
    expect(scenarioStore.findScenarioByName("test-scenario-1")).toMatchObject(
      scenario
    );

    scenario.stop();

    expect(scenarioStore.findScenarioByName("test-scenario-1")).toBe(undefined);
  });

  test("findScenarioById with 2 active scenarios", () => {
    const testScenario1 = scenarioStore.newScenario("test-scenario-1", 5000);
    const testScenario2 = scenarioStore.newScenario("test-scenario-2", 10000);

    expect(scenarioStore.findScenarioById(testScenario1.id)).toMatchObject(
      testScenario1
    );
    expect(scenarioStore.findScenarioById(testScenario2.id)).toMatchObject(
      testScenario2
    );
    expect(scenarioStore.findScenarioById("random")).toBe(undefined);
  });

  test("findScenarioById before and after scenario is inactive", () => {
    const scenario = scenarioStore.newScenario("test-scenario-1", 5000);
    expect(scenarioStore.findScenarioById(scenario.id)).toMatchObject(scenario);

    scenario.stop();

    expect(scenarioStore.findScenarioById(scenario.id)).toBe(undefined);
  });
});
