import { FlowStatus } from "./flow.enums";

export type IFlowData = { [key: string]: unknown };

export type IFlowStep = {
  step: string;
  status: FlowStatus;
  timestamp: number;
  delta: number;
  stepDelta: number;
  sequence: number;
  previousStep?: string;
  data: IFlowData;
};

export type IFlowInfo = {
  id: string;
  name: string;
  stepCount: number;
  steps: IFlowStep[];
  data: IFlowData;
  startedAt: number;
  finishedAt?: number;
  delta?: number;
  status?: FlowStatus;
};

/**
 * A Flow to track a scenario using markers.
 *
 * @param flowName - The name of the Flow/scenario
 * @param timeoutInMs - The timeout in milliseconds after which the Flow automatically times out
 */
export type IFlow = {
  /**
   * Stops the Flow with the `success` status.
   *
   * @remarks
   * Stops the Flow only if its active.
   * @param data - [optional] Data to append to the `stop` step
   */
  stop: (data?: IFlowData) => void;

  /**
   * Stops the Flow with the `failure` status.
   *
   * @remarks
   * Stops the Flow only if its active.
   * @param data - [optional] Data to append to the `fail` step
   */
  fail: (data?: IFlowData) => void;

  /**
   * Creates a marker/step on the Flow with the current timestamp and other computed fields.
   *
   * @remarks
   * Creates a marker only if the Flow is active.
   * @param step - The name of the marker
   * @param data - [optional] Data to append to the step
   * @param status - [optional] Override the default `success` status of the step
   */
  mark: (step: string, data?: IFlowData, status?: FlowStatus) => void;

  /**
   * Pauses the Flow for indefinite amount of time until resumed.
   * The `pause` step marker is created when the Flow is resumed.
   *
   * @remarks
   * Pauses the Flow only if its active and not already in a paused state.
   * The ongoing timer is paused after this method is called.
   * @param data - [optional] Data to append to the `pause` step
   */
  pause: (data?: IFlowData) => void;

  /**
   * Resumes the Flow and continues the paused timer.
   * The `pause` step marker is created here.
   *
   * @remarks
   * Pauses the Flow only if its active and in a paused state.
   */
  resume: () => void;

  /**
   * Adds data to the Flow.
   *
   * @remarks
   * Adds data to the Flow only if its active.
   * @param data - Data to append to the Flow
   */
  addFlowData: (flowData: IFlowData) => void;

  /**
   * Returns an IFlowInfo object containing all information about the Flow.
   *
   * @remarks
   * This method should ideally be called only for completed Flows.
   * @returns The IFlowInfo object
   */
  info: () => IFlowInfo;
};
