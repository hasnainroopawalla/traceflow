import { FlowStep, FlowStatus } from "./flow.enums";
import type { IFlowData, IFlowStep, IFlow } from "./flow.interface";
import { Timer } from "../timer";

/**
 * A Flow to track a scenario using markers.
 * @param flowName - The name of the Flow/scenario
 * @param timeoutInMs - The timeout in milliseconds after which the Flow automatically times out
 */
export class Flow {
  public id: string;
  public name: string;
  public isActive: boolean;

  private steps: IFlowStep[];
  private pauseData: IFlowData;
  private timer: Timer;
  private sequence: number;
  private flowData: IFlowData;

  constructor(flowName: string, timeoutInMs: number) {
    this.name = flowName;
    this.id = crypto.randomUUID();
    this.steps = [];
    this.flowData = {};
    this.sequence = 1;
    this.isActive = true;
    this.timer = new Timer(() => this.timeout(), timeoutInMs);
    this.pauseData = {};
    this.mark(FlowStep.Start);
  }

  /**
   * Returns an IFlow object containing all information about the Flow.
   * @remarks
   * This getter should ideally be called only for inactive Flows.
   * @returns The IFlow object
   */
  public get info(): IFlow {
    return {
      id: this.id,
      name: this.name,
      stepCount: this.steps.length,
      steps: this.steps,
      data: this.flowData,
      delta: this.currentStep.delta,
      startedAt: this.timer.startedAt,
      finishedAt: !this.isActive ? undefined : this.currentStep.timestamp,
      status: this.isActive ? undefined : this.currentStep.status,
    };
  }

  private get currentStep(): IFlowStep {
    return this.steps[this.steps.length - 1];
  }

  /**
   * Stops the Flow with the `success` status.
   * @remarks
   * Stops the Flow only if its active.
   * @param data - [optional] data to append to the `stop` step
   */
  public stop(data?: IFlowData): void {
    if (!this.isActive) {
      return;
    }
    this.mark(FlowStep.Stop, data);
    this.terminate();
  }

  /**
   * Stops the Flow with the `failure` status.
   * @remarks
   * Stops the Flow only if its active.
   * @param data - [optional] data to append to the `fail` step
   */
  public fail(data?: IFlowData): void {
    if (!this.isActive) {
      return;
    }
    this.mark(FlowStep.Stop, data, FlowStatus.Failure);
    this.terminate();
  }

  /**
   * Creates a marker/step on the Flow with the current timestamp and other computed fields.
   * @remarks
   * Creates a marker only if the Flow is active.
   * @param step - The name of the marker
   * @param data - [optional] Data to append to the step
   * @param status - [optional] Override the default `success` status of the step
   */
  public mark(step: string, data?: IFlowData, status?: FlowStatus): void {
    if (!this.isActive) {
      return;
    }

    const { timestamp, stepDelta, delta } = this.timer.mark(
      step === FlowStep.Pause
    );

    this.createNewStep({
      step,
      timestamp,
      delta,
      stepDelta,
      status: status || FlowStatus.Success,
      data: data || {},
    });
  }

  /**
   * Pauses the Flow for indefinite amount of time until resumed.
   * The `pause` step marker is created when the Flow is resumed.
   * @remarks
   * Pauses the Flow only if its active and not already in a paused state.
   * The ongoing timer is paused after this method is called.
   * @param data - [optional] Data to append to the `pause` step
   */
  public pause(data?: IFlowData): void {
    if (!this.isActive || this.timer.isPaused()) {
      return;
    }
    this.pauseData = data || {};
    this.timer.pause();
  }

  /**
   * Resumes the Flow and continues the paused timer.
   * The `pause` step marker is created here.
   * @remarks
   * Pauses the Flow only if its active and in a paused state.
   */
  public resume(): void {
    if (!this.isActive || !this.timer.isPaused()) {
      return;
    }
    this.mark(FlowStep.Pause, this.pauseData);
    this.timer.resume();
  }

  /**
   * Adds data to the Flow.
   * @remarks
   * Adds data to the Flow only if its active.
   * @param data - Data to append to the Flow
   */
  public addFlowData(flowData: IFlowData): void {
    if (!this.isActive) {
      return;
    }
    this.flowData = { ...this.flowData, ...flowData };
  }

  private terminate() {
    this.isActive = false;
    this.timer.destroy();
  }

  private timeout(): void {
    this.mark(FlowStep.Stop, undefined, FlowStatus.Timeout);
    this.terminate();
  }

  private createNewStep(props: Omit<IFlowStep, "sequence" | "previousStep">) {
    const newStep = {
      ...props,
      sequence: this.sequence,
      previousStep: this.sequence > 1 ? this.currentStep.step : "",
    };
    this.steps.push(newStep);
    this.sequence += 1;
  }
}
