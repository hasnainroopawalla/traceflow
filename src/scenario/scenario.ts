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
    this.start();
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

  public mark(step: string, status?: ScenarioStatus): void {
    if (!this.isActive) {
      return;
      // throw new Error("Scenario is not active");
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

  public stop(): void {
    if (!this.isActive) {
      return;
    }
    this.mark(ScenarioStep.Stop);
    this.cleanupOnTermination();
  }

  public fail(): void {
    if (!this.isActive) {
      return;
    }
    this.mark(ScenarioStep.Stop, ScenarioStatus.Failure);
    this.cleanupOnTermination();
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
    this.scenarioData = { ...this.scenarioData, scenarioData };
  }

  private createNewStep(
    props: Pick<
      IScenarioStep,
      "step" | "status" | "timestamp" | "delta" | "stepDelta"
    >
  ) {
    const step = {
      ...props,
      sequence: this.sequence,
      previousStep: this.sequence > 1 ? this.currentStep.step : undefined,
    };
    this.addStepToScenario(step);
  }

  private addStepToScenario(scenarioStep: IScenarioStep) {
    console.log(
      `-> ${scenarioStep.step} || delta: ${scenarioStep.delta}, stepDelta: ${scenarioStep.stepDelta}, timestamp: ${scenarioStep.timestamp}`
    );
    this.steps.push(scenarioStep);
    this.sequence += 1;
  }

  private cleanupOnTermination() {
    this.isActive = false;
    this.timer.destroy();
  }

  private start(): void {
    this.createNewStep({
      step: ScenarioStep.Start,
      timestamp: Date.now(),
      delta: 0,
      stepDelta: 0,
      status: ScenarioStatus.Success,
    });
  }

  private timeout(): void {
    this.mark(ScenarioStep.Stop, ScenarioStatus.Timeout);
    this.cleanupOnTermination();
  }
}
