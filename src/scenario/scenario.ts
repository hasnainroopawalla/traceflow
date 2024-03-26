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

  constructor(scenarioName: string, timeoutInMs: number) {
    this.name = scenarioName;
    this.id = crypto.randomUUID();
    this.steps = [];
    this.scenarioData = {};
    this.sequence = 1;
    this.isActive = true;
    this.timer = new Timer(() => this.timeout(), timeoutInMs);
    this.mark(ScenarioStep.Start);
  }

  public get info(): IScenario {
    return {
      id: this.id,
      name: this.name,
      stepCount: this.steps.length,
      steps: this.steps,
      data: this.scenarioData,
      delta: this.currentStep.delta,
      startedAt: this.timer.startedAt,
      // TODO: finishedAt, status
    };
  }

  public get currentStep(): IScenarioStep {
    return this.steps[this.steps.length - 1];
  }

  public stop(): void {
    if (!this.isActive) {
      return;
    }
    this.mark(ScenarioStep.Stop);
    this.terminate();
  }

  public fail(): void {
    if (!this.isActive) {
      return;
    }
    this.mark(ScenarioStep.Stop, ScenarioStatus.Failure);
    this.terminate();
  }

  public mark(step: string, status?: ScenarioStatus): void {
    if (!this.isActive) {
      return;
    }
    const { timestamp, stepDelta, delta } = this.timer.mark(
      step === ScenarioStep.Pause
    );

    this.createNewStep({
      step,
      timestamp,
      delta,
      stepDelta,
      status: status || ScenarioStatus.Success,
    });
  }

  // TODO: add reason/context
  public pause(): void {
    if (!this.isActive) {
      return;
    }
    this.timer.pause();
  }

  public resume(): void {
    if (!this.isActive) {
      return;
    }
    this.mark(ScenarioStep.Pause);
    this.timer.resume();
  }

  public addScenarioData(scenarioData: IScenarioData): void {
    if (!this.isActive) {
      return;
    }
    this.scenarioData = { ...this.scenarioData, scenarioData };
  }

  public terminate() {
    this.isActive = false;
    this.timer.destroy();
  }

  private timeout(): void {
    this.mark(ScenarioStep.Stop, ScenarioStatus.Timeout);
    this.terminate();
  }

  private createNewStep(
    props: Pick<
      IScenarioStep,
      "step" | "status" | "timestamp" | "delta" | "stepDelta"
    >
  ) {
    const newStep = {
      ...props,
      sequence: this.sequence,
      previousStep: this.sequence > 1 ? this.currentStep.step : undefined,
    };
    console.log(
      `-> ${newStep.step} || delta: ${newStep.delta}, stepDelta: ${newStep.stepDelta}, timestamp: ${newStep.timestamp}`
    );
    this.steps.push(newStep);
    this.sequence += 1;
  }
}
