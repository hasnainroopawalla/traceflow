import { ScenarioStore } from "../src/scenario-store";
import { scenarioPresets } from "./scenario-presets/presets";
import { validateScenarioSteps } from "./test-utils";

Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => "123",
  },
});

describe("Scenario", () => {
  let scenarioStore: ScenarioStore;

  beforeEach(() => {
    scenarioStore = ScenarioStore.getInstance();
    jest.useFakeTimers();
    Date.now = jest.fn(() => jest.now());
  });

  test.each(scenarioPresets)("$name", (scenarioPreset) => {
    const scenario = scenarioStore.newScenario(scenarioPreset.name, 3000);

    scenarioPreset.run(scenario);

    expect(scenario.info.name).toBe(scenarioPreset.name);
    validateScenarioSteps(scenario.steps, scenarioPreset.expectedSteps);
  });
});
