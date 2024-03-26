import { ifActive, terminalStep } from "./decorators";
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

  @ifActive
  @terminalStep
  public stop(): void {
    this.mark(ScenarioStep.Stop);
  }

  @ifActive
  @terminalStep
  public fail(): void {
    this.mark(ScenarioStep.Stop, ScenarioStatus.Failure);
  }

  @ifActive
  public mark(step: string, status?: ScenarioStatus): void {
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
  @ifActive
  public pause(): void {
    this.timer.pause();
  }

  @ifActive
  public resume(): void {
    this.mark(ScenarioStep.Pause);
    this.timer.resume();
  }

  @ifActive
  public addScenarioData(scenarioData: IScenarioData): void {
    this.scenarioData = { ...this.scenarioData, scenarioData };
  }

  @ifActive
  @terminalStep
  private timeout(): void {
    this.mark(ScenarioStep.Stop, ScenarioStatus.Timeout);
  }

  public cleanupOnTermination() {
    this.isActive = false;
    this.timer.destroy();
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
