import { ScenarioStore } from "../src/scenario-store";
import { scenarioPresets } from "./scenario-presets/presets";
import { validateScenarioSteps } from "./test-utils";
import { Timer } from "../src/scenario/timer";

Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => "123",
  },
});

describe("Scenario", () => {
  let scenarioStore: ScenarioStore;
  let timerDestroySpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    timerDestroySpy = jest.spyOn(Timer.prototype, "destroy");
    scenarioStore = ScenarioStore.getInstance();
    jest.useFakeTimers();
    Date.now = jest.fn(() => jest.now());
  });

  test.each(scenarioPresets)("$name", (scenarioPreset) => {
    const scenario = scenarioStore.newScenario(scenarioPreset.name, 3000);
    scenarioPreset.run(scenario);

    expect(scenario.info.name).toBe(scenarioPreset.name);
    validateScenarioSteps(scenario.steps, scenarioPreset.expectedSteps);
    expect(timerDestroySpy).toHaveBeenCalledTimes(1);
  });
});
