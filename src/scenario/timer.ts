import type { IPauseInfo, ITemporalInfo } from "./timer.interface";

export class Timer {
  public startedAt: number;
  private timerId: NodeJS.Timeout;
  private onTimeout: () => void;
  private timeoutInMs: number;

  private pauseInfo: IPauseInfo;

  constructor(onTimeout: () => void, timeoutInMs: number) {
    this.timeoutInMs = timeoutInMs;
    this.startedAt = this.now();
    this.onTimeout = onTimeout;
    this.pauseInfo = { isPaused: false, lastResumedAt: this.startedAt };
    this.startTimer(timeoutInMs);
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

  public previousPause(previousDelta: number) {
    const currentTimestamp = this.now();

    if (this.pauseInfo.isPaused) {
      throw new Error("Previous step pause");
    }

    const stepDelta = currentTimestamp - this.pauseInfo.lastResumedAt;

    console.log(
      "previousPause",
      previousDelta,
      currentTimestamp,
      this.pauseInfo.lastResumedAt
    );

    const delta = stepDelta + previousDelta;

    return {
      timestamp: currentTimestamp,
      delta,
      stepDelta,
    };
  }

  // consider renaming and making previousStepTimestamp a mandatory arg
  public generateTemporalInfo(
    previousStepTimestamp: number,
    previousDelta: number
  ): ITemporalInfo {
    const currentTimestamp = this.now();

    const stepDelta = currentTimestamp - previousStepTimestamp;

    const delta = stepDelta + previousDelta;

    return {
      timestamp: currentTimestamp,
      delta,
      stepDelta,
    };
  }

  public generatePauseStepInfo(
    previousStepTimestamp: number,
    previousDelta: number
  ): ITemporalInfo {
    if (!this.pauseInfo.isPaused) {
      throw new Error("Not paused");
    }

    const currentTimestamp = this.now();
    // const ongoingPauseInfo = this.getLatestPauseInfo();

    const pauseDuration = currentTimestamp - this.pauseInfo.pausedAt;

    const delta =
      previousDelta + this.pauseInfo.pausedAt - previousStepTimestamp;

    return {
      timestamp: this.pauseInfo.pausedAt,
      stepDelta: pauseDuration,
      delta,
    };
  }

  public pause(previousStepTimestamp: number, previousStepDelta: number): void {
    const pausedAt = this.now();

    this.stopTimer();

    const remainingTime =
      this.timeoutInMs -
      (previousStepDelta + (pausedAt - previousStepTimestamp));
    console.log(
      "TIMER pause",
      pausedAt,
      previousStepTimestamp,
      this.timeoutInMs - (pausedAt - previousStepTimestamp)
    );

    this.pauseInfo = {
      isPaused: true,
      pausedAt,
      remainingTime,
    };
  }

  public resume(): void {
    if (!this.pauseInfo.isPaused) {
      return;
    }

    console.log("TIMER resume", this.pauseInfo.remainingTime);

    this.startTimer(this.pauseInfo.remainingTime);

    this.pauseInfo = {
      isPaused: false,
      lastResumedAt: this.now(),
    };
  }

  public destroy() {
    this.stopTimer();
  }

  public now() {
    return Date.now();
  }

  private startTimer(duration: number) {
    this.timerId = setTimeout(() => this.onTimeout(), duration);
    console.log("TIMER startTimer", duration);
  }

  private stopTimer() {
    clearTimeout(this.timerId);
  }
}
