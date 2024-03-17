export class Timer {
  public startedAt: number;

  constructor() {
    this.startedAt = Date.now();
  }

  public elapsedTimeInMs(currentTimestamp: number) {
    return currentTimestamp - this.startedAt;
  }

  public computeStepDelta(
    currentTimestamp: number,
    previousStepTimestamp: number
  ) {
    return currentTimestamp - previousStepTimestamp;
  }

  public now() {
    return Date.now();
  }

  public computeStepTimestamps(previousStepTimestamp?: number) {
    const currentTimestamp = this.now();

    const delta = this.elapsedTimeInMs(currentTimestamp);

    const stepDelta = previousStepTimestamp
      ? this.computeStepDelta(currentTimestamp, previousStepTimestamp)
      : 0;

    return {
      timestamp: currentTimestamp,
      delta,
      stepDelta,
    };
  }
}
