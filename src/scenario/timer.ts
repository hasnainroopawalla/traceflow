export class Timer {
  public startedAt: number;

  constructor() {
    this.startedAt = Date.now();
  }

  public static computeStepDelta(
    currentTimestamp: number,
    previousStepTimestamp: number
  ) {
    return currentTimestamp - previousStepTimestamp;
  }

  public elapsedTimeInMs(currentTimestamp: number) {
    return currentTimestamp - this.startedAt;
  }

  public now() {
    return Date.now();
  }

  public computeStepTimestamps(previousStepTimestamp?: number) {
    const currentTimestamp = this.now();

    const delta = this.elapsedTimeInMs(currentTimestamp);

    const stepDelta = previousStepTimestamp
      ? Timer.computeStepDelta(currentTimestamp, previousStepTimestamp)
      : 0;

    return {
      timestamp: currentTimestamp,
      delta,
      stepDelta,
    };
  }
}
