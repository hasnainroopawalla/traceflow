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

export type IFlow = {
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
