import {
  Status,
  type IScenarioData,
  type IScenarioStep,
  type IScenario,
} from "./scenario.interface";
import { Timer } from "./timer";

export class Scenario {
  public id: string;
  public name: string;
  public steps: IScenarioStep[];
  public scenarioData: IScenarioData;
  public sequence: number;
  public isActive: boolean;

  private timer: Timer;

  constructor(scenarioName: string) {
    this.name = scenarioName;
    this.id = crypto.randomUUID();
    this.steps = [];
    this.scenarioData = {};
    this.sequence = 1;
    this.isActive = true;
    this.timer = new Timer();
    this.start();
  }

  public get info(): IScenario {
    return {
      id: this.id,
      name: this.name,
      stepCount: this.steps.length,
      steps: this.steps,
      data: this.scenarioData,
      delta: this.currentStep?.delta,
      startedAt: this.timer.startedAt,
      // TODO: finishedAt
    };
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
    this.scenarioData = { ...this.scenarioData, scenarioData };
  }

  private start() {
    this.mark("start");
  }
}
