import { FlowStep, FlowStatus } from "./flow.enums";
import type { IFlowData, IFlowStep, IFlow, IFlowInfo } from "./flow.interface";
import { Timer } from "../timer";

export class Flow implements IFlow {
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

  public info(): IFlowInfo {
    const { delta, timestamp, status } = this.currentStep();
    return {
      id: this.id,
      name: this.name,
      stepCount: this.steps.length,
      steps: this.steps,
      data: this.flowData,
      delta,
      startedAt: this.timer.startedAt,
      finishedAt: !this.isActive ? timestamp : undefined,
      status: this.isActive ? undefined : status,
    };
  }

  public stop(data?: IFlowData) {
    if (!this.isActive) {
      return;
    }
    this.mark(FlowStep.Stop, data);
    this.terminate();
  }

  public fail(data?: IFlowData) {
    if (!this.isActive) {
      return;
    }
    this.mark(FlowStep.Stop, data, FlowStatus.Failure);
    this.terminate();
  }

  public mark(step: string, data?: IFlowData, status?: FlowStatus) {
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

  public pause(data?: IFlowData) {
    if (!this.isActive || this.timer.isPaused()) {
      return;
    }
    this.pauseData = data || {};
    this.timer.pause();
  }

  public resume() {
    if (!this.isActive || !this.timer.isPaused()) {
      return;
    }
    this.mark(FlowStep.Pause, this.pauseData);
    this.timer.resume();
  }

  public addFlowData(flowData: IFlowData) {
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
      previousStep: this.sequence > 1 ? this.currentStep().step : "",
    };
    this.steps.push(newStep);
    this.sequence += 1;
  }

  private currentStep() {
    return this.steps[this.steps.length - 1];
  }
}
