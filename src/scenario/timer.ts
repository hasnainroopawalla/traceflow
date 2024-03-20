const TIMEOUT_MS = 3000;

type IPauseInfo =
  | { isPaused: true; pausedAt: number; remainingTime: number }
  | { isPaused: false };

export class Timer {
  public startedAt: number;
  private timerId: NodeJS.Timeout;
  private onTimeout: () => void;
  private pauseInfo: IPauseInfo;

  constructor(onTimeout: () => void) {
    this.startedAt = this.now();
    this.timerId = this.startTimer(TIMEOUT_MS);
    this.onTimeout = onTimeout;
    this.pauseInfo = {
      isPaused: false,
    };
  }

  public static computeStepDelta(
    currentTimestamp: number,
    previousStepTimestamp: number
  ) {
    return currentTimestamp - previousStepTimestamp;
  }

  public elapsedTimeInMs(fromTimestamp: number) {
    return fromTimestamp - this.startedAt;
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

  public pause(): void {
    const pausedAt = this.now();
    this.stopTimer();
    const remainingTime = TIMEOUT_MS - this.elapsedTimeInMs(pausedAt);
    console.log(remainingTime);
    this.pauseInfo = {
      isPaused: true,
      pausedAt,
      remainingTime,
    };
  }

  public resume(): void {
    this.pauseInfo.isPaused &&
      this.startTimer(TIMEOUT_MS - this.pauseInfo.pausedAt);
  }

  public destroy() {
    this.stopTimer();
  }

  private now() {
    return Date.now();
  }

  private startTimer(duration: number) {
    return setTimeout(this.onTimeout, duration);
  }

  private stopTimer() {
    clearTimeout(this.timerId);
  }
}
