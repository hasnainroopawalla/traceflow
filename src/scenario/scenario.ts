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
      // console.log("INACTIVE");
      return;
      // throw new Error("Scenario is not active");
    }

    const { timestamp, stepDelta, delta } =
      this.currentStep.step === ScenarioStep.Pause
        ? this.timer.previousPause(this.currentStep.delta)
        : this.timer.generateTemporalInfo(
            this.currentStep.timestamp,
            this.currentStep.delta
          );

    const newStep = this.buildNewStep({
      step,
      timestamp,
      delta,
      stepDelta,
      status: status || ScenarioStatus.Success,
    });

    this.addStepToScenario(newStep);
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
    this.timer.pause(this.currentStep.timestamp, this.currentStep.delta);
  }

  public resume(): void {
    if (!this.isActive) {
      return;
    }
    // console.log("SCENARIO resume");
    // this.mark(ScenarioStep.Pause);
    const { timestamp, stepDelta, delta } = this.timer.generatePauseStepInfo(
      this.currentStep.timestamp,
      this.currentStep.delta
    );

    const startStep = this.buildNewStep({
      step: ScenarioStep.Pause,
      timestamp,
      delta,
      stepDelta,
      status: ScenarioStatus.Success,
    });

    this.addStepToScenario(startStep);

    this.timer.resume();
  }

  public addScenarioData(scenarioData: IScenarioData): void {
    this.scenarioData = { ...this.scenarioData, scenarioData };
  }

  private buildNewStep(
    props: Pick<
      IScenarioStep,
      "step" | "status" | "timestamp" | "delta" | "stepDelta"
    >
  ): IScenarioStep {
    return {
      step: props.step,
      status: props.status,
      timestamp: props.timestamp,
      delta: props.delta,
      stepDelta: props.stepDelta,
      sequence: this.sequence,
      previousStep: this.sequence > 1 ? this.currentStep.step : undefined,
    };
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
    // console.log("CLEANED UP");
  }

  private start(): void {
    const startStep = this.buildNewStep({
      step: ScenarioStep.Start,
      timestamp: this.timer.now(),
      delta: 0,
      stepDelta: 0,
      status: ScenarioStatus.Success,
    });

    this.addStepToScenario(startStep);
  }

  private timeout(): void {
    console.log("SCENARIO timeout");
    this.mark(ScenarioStep.Stop, ScenarioStatus.Timeout);
    this.cleanupOnTermination();
  }
}
