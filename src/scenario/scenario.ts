import { ScenarioStep, ScenarioStatus } from "./scenario.enums";
import {
  type IScenarioData,
  type IScenarioStep,
  type IScenario,
} from "./scenario.interface";
import { Timer } from "../timer";

export class Scenario {
  public id: string;
  public name: string;
  public steps: IScenarioStep[];
  public scenarioData: IScenarioData;
  public sequence: number;
  public isActive: boolean;

  private pauseData: IScenarioData;

  private timer: Timer;

  constructor(scenarioName: string, timeoutInMs: number) {
    this.name = scenarioName;
    this.id = crypto.randomUUID();
    this.steps = [];
    this.scenarioData = {};
    this.sequence = 1;
    this.isActive = true;
    this.timer = new Timer(() => this.timeout(), timeoutInMs);
    this.pauseData = {};
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

  public stop(data?: IScenarioData): void {
    if (!this.isActive) {
      return;
    }
    this.mark(ScenarioStep.Stop, data);
    this.terminate();
  }

  public fail(data?: IScenarioData): void {
    if (!this.isActive) {
      return;
    }
    this.mark(ScenarioStep.Stop, data, ScenarioStatus.Failure);
    this.terminate();
  }

  public mark(
    step: string,
    data?: IScenarioData,
    status?: ScenarioStatus
  ): void {
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
      data: data || {},
    });
  }

  public pause(data?: IScenarioData): void {
    if (!this.isActive || this.timer.isPaused()) {
      return;
    }
    this.pauseData = data || {};
    this.timer.pause();
  }

  public resume(): void {
    if (!this.isActive || !this.timer.isPaused()) {
      return;
    }
    this.mark(ScenarioStep.Pause, this.pauseData);
    this.timer.resume();
  }

  public addScenarioData(scenarioData: IScenarioData): void {
    if (!this.isActive) {
      return;
    }
    this.scenarioData = { ...this.scenarioData, ...scenarioData };
  }

  public terminate() {
    this.isActive = false;
    this.timer.destroy();
  }

  private timeout(): void {
    this.mark(ScenarioStep.Stop, undefined, ScenarioStatus.Timeout);
    this.terminate();
  }

  private createNewStep(
    props: Omit<IScenarioStep, "sequence" | "previousStep">
  ) {
    const newStep = {
      ...props,
      sequence: this.sequence,
      previousStep: this.sequence > 1 ? this.currentStep.step : undefined,
    };
    // TODO: add verbose control
    // console.log(
    //   `-> ${newStep.step} || delta: ${newStep.delta}, stepDelta: ${newStep.stepDelta}, timestamp: ${newStep.timestamp}`
    // );
    this.steps.push(newStep);
    this.sequence += 1;
  }
}
