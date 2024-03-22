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
    this.timer = new Timer(() => this.timeout());
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
      // TODO: finishedAt, status
    };
  }

  public get currentStep(): IScenarioStep | undefined {
    return this.steps[this.steps.length - 1];
  }

  public mark(step: string, status?: ScenarioStatus): void {
    if (!this.isActive) {
      return;
    }

    const { timestamp, delta, stepDelta } =
      step === ScenarioStep.Pause
        ? this.timer.pauseStepTemporalInfo()
        : this.timer.genericStepTemporalInfo(
            this.currentStep?.timestamp,
            this.currentStep?.step === ScenarioStep.Pause
              ? this.currentStep?.stepDelta
              : 0
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

    console.log(
      `-> ${newStep.step} || delta: ${newStep.delta}, stepDelta: ${newStep.stepDelta}, timestamp: ${newStep.timestamp}`
    );
    this.steps.push(newStep);
    this.sequence += 1;
  }

  public stop(): void {
    // console.log("SCENARIO stop");
    this.mark(ScenarioStep.Stop);
    this.cleanupOnTermination();
  }

  public fail(): void {
    this.mark(ScenarioStep.Stop, ScenarioStatus.Failure);
    this.cleanupOnTermination();
  }

  // TODO: add reason/context
  public pause(): void {
    console.log("-> pause", Date.now());
    this.timer.pause();
  }

  public resume(): void {
    // console.log("SCENARIO resume");
    this.mark(ScenarioStep.Pause);
    this.timer.resume();
  }

  public addScenarioData(scenarioData: IScenarioData): void {
    this.scenarioData = { ...this.scenarioData, scenarioData };
  }

  private cleanupOnTermination() {
    // console.log("cleanup");
    this.isActive = false;
    this.timer.destroy();
  }

  private start(): void {
    // console.log("SCENARIO start");
    this.mark(ScenarioStep.Start);
  }

  private timeout(): void {
    // console.log("SCENARIO timeout");
    this.mark(ScenarioStep.Stop, ScenarioStatus.Timeout);
    this.cleanupOnTermination();
  }
}
