import {
  type IScenarioData,
  type IScenarioStep,
  type IScenario,
  ScenarioStep,
  ScenarioStatus,
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
    this.timer = new Timer(this.timeout);
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

  public mark(step: string, status?: ScenarioStatus): void {
    const { timestamp, delta, stepDelta } = this.timer.computeStepTimestamps(
      this.currentStep?.timestamp
    );

    const newStep: IScenarioStep = {
      step,
      status: status || ScenarioStatus.Success,
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

  public stop(): void {
    this.mark(ScenarioStep.Stop);
    this.cleanupOnTermination();
  }

  public fail(): void {
    this.mark(ScenarioStep.Stop, ScenarioStatus.Failure);
    this.cleanupOnTermination();
  }

  // TODO: add reason/context
  public pause(): void {
    this.timer.pause();
  }

  public resume(): void {
    this.mark(ScenarioStep.Pause);
    this.timer.resume();
  }

  public addScenarioData(scenarioData: IScenarioData): void {
    this.scenarioData = { ...this.scenarioData, scenarioData };
  }

  private cleanupOnTermination() {
    console.log("cleanup");
    this.isActive = false;
    this.timer.destroy();
  }

  private start(): void {
    this.mark(ScenarioStep.Start);
  }

  private timeout(): void {
    // use enums for start, stop, timeout
    this.mark(ScenarioStep.Stop, ScenarioStatus.Timeout);
  }
}
