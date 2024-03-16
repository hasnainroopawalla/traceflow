export type IScenarioData = { [key: string]: unknown };

export enum ScenarioStatus {
  Success = "success",
  Failure = "failure",
  Timeout = "timeout",
}

export type IScenarioStep = {
  step: string;
  status: ScenarioStatus;
  delta: number;
  stepDelta: number;
  sequence: number;
  previousStep: string;
};
