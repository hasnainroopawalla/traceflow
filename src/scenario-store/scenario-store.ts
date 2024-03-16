import { Scenario } from "../scenario";

export class ScenarioStore {
  private static instance: ScenarioStore;
  private scenarios: Scenario[];

  private constructor() {
    this.scenarios = [];
  }

  public static getInstance(): ScenarioStore {
    if (!ScenarioStore.instance) {
      ScenarioStore.instance = new ScenarioStore();
    }
    return ScenarioStore.instance;
  }

  public findScenario() {}

  public newScenario() {
    const scenario = new Scenario();
    this.scenarios.push(scenario);
    return scenario;
  }
}
