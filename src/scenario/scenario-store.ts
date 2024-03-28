import { Scenario } from "./scenario";

export class ScenarioStoreFactory {
  private scenarios: Scenario[];

  constructor() {
    this.scenarios = [];
  }

  public clearAllScenarios() {
    this.scenarios = [];
  }

  public newScenario(scenarioName: string, timeoutInMs: number) {
    const scenario = new Scenario(scenarioName, timeoutInMs);
    this.scenarios.push(scenario);
    return scenario;
  }

  public findScenarioByName(scenarioName: string): Scenario | undefined {
    return this.scenarios.find(
      (scenario) => scenario.isActive && scenario.name === scenarioName
    );
  }

  public findScenarioById(scenarioId: string): Scenario | undefined {
    return this.scenarios.find(
      (scenario) => scenario.isActive && scenario.id === scenarioId
    );
  }
}

export const ScenarioStore = new ScenarioStoreFactory();
