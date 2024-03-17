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
