import { ScenarioStatus } from "./scenario.enums";

export type IScenarioData = { [key: string]: unknown };

export type IScenarioStep = {
  step: string;
  status: ScenarioStatus;
  timestamp: number;
  delta: number;
  stepDelta: number;
  sequence: number;
  previousStep?: string;
  data: IScenarioData;
};

export type IScenario = {
  id: string;
  name: string;
  stepCount: number;
  steps: IScenarioStep[];
  data: IScenarioData;
  startedAt: number;
  finishedAt?: number;
  delta?: number;
  status?: ScenarioStatus;
};
