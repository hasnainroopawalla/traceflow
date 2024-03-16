import {
  ScenarioStatus,
  type IScenarioData,
  type IScenarioStep,
} from "./scenario.interface";
import { Timer } from "./timer";

export class Scenario {
  public id: string;
  public name: string;
  public steps: IScenarioStep[];
  public data: IScenarioData;
  public sequence: number;

  private timer: Timer;

  constructor(scenarioName: string) {
    this.name = scenarioName;
    this.id = crypto.randomUUID();
    this.steps = [];
    this.data = {};
    this.sequence = 1;
    this.timer = new Timer();
    this.start();
  }

  public mark(step: string) {
    const newStep = {
      step,
      status: ScenarioStatus.Success,
      delta: 0,
      stepDelta: 0,
      sequence: this.sequence,
      previousStep: this.steps[this.steps.length - 1]?.step || "",
    };
    console.log(newStep);
    this.steps.push(newStep);
    this.sequence += 1;
  }

  public stop() {}

  public fail() {}

  public pause() {}

  public resume() {}

  public addScenarioData(scenarioData: IScenarioData) {
    this.data = { ...this.data, scenarioData };
  }

  private start() {
    this.mark("start");
  }
}
