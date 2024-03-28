import { ScenarioStore } from "../src";
import { scenarioPresets } from "./scenario-presets/presets";
import { validateScenarioSteps } from "./test-utils";
import { Timer } from "../src/timer";

Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => "123",
  },
});

describe("Scenario", () => {
  let timerDestroySpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    timerDestroySpy = jest.spyOn(Timer.prototype, "destroy");
    jest.useFakeTimers();
    Date.now = jest.fn(() => jest.now());
  });

  test.each(scenarioPresets)("$name", (scenarioPreset) => {
    const scenario = ScenarioStore.newScenario(scenarioPreset.name, 3000);
    scenarioPreset.run(scenario);

    expect(scenario.info.name).toBe(scenarioPreset.name);
    expect(scenario.info.data).toMatchObject(scenarioPreset.data);
    expect(scenario.info.status).toBe(scenarioPreset.status);
    validateScenarioSteps(scenario.steps, scenarioPreset.expectedSteps);
    expect(timerDestroySpy).toHaveBeenCalledTimes(1);
  });
});
