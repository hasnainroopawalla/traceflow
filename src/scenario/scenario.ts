import {
  Status,
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
  public isActive: boolean;

  private timer: Timer;

  constructor(scenarioName: string) {
    this.name = scenarioName;
    this.id = crypto.randomUUID();
    this.steps = [];
    this.data = {};
    this.sequence = 1;
    this.isActive = true;
    this.timer = new Timer();
    this.start();
  }

  public get currentStep(): IScenarioStep | undefined {
    return this.steps[this.steps.length - 1];
  }

  public mark(step: string) {
    const { timestamp, delta, stepDelta } = this.timer.computeStepTimestamps(
      this.currentStep?.timestamp
    );

    const newStep = {
      step,
      status: Status.Success,
      timestamp,
      delta,
      stepDelta,
      sequence: this.sequence,
      previousStep: this.currentStep?.step,
    };
    console.log(newStep);
    this.steps.push(newStep);
    this.sequence += 1;
  }

  public stop() {
    this.mark("stop");
    this.isActive = false;
  }

  public fail() {
    this.mark("failure");
    this.isActive = false;
  }

  public pause() {}

  public resume() {}

  public addScenarioData(scenarioData: IScenarioData) {
    this.data = { ...this.data, scenarioData };
  }

  private start() {
    this.mark("start");
  }
}
