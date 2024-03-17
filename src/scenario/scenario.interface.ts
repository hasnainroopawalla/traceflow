export type IScenarioData = { [key: string]: unknown };

export enum Status {
  Success = "success",
  Failure = "failure",
  Timeout = "timeout",
}

export type IScenarioStep = {
  step: string;
  status: Status;
  timestamp: number;
  delta: number;
  stepDelta: number;
  sequence: number;
  previousStep?: string;
};

export type IScenario = {
  id: string;
  name: string;
  stepCount: number;
  steps: IScenarioStep[];
  data: IScenarioData;
  startedAt: number;
  delta?: number;
};
