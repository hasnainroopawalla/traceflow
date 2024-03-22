const TIMEOUT_MS = 3000;

type IPauseInfo =
  | {
      isPaused: true;
      pausedAt: number;
      remainingTime: number;
    }
  | { isPaused: false; lastResumedAt: number };

// TODO: rename
type ITimestampInfo = {
  timestamp: number;
  delta: number;
  stepDelta: number;
};

export class Timer {
  public startedAt: number;
  private timerId: NodeJS.Timeout;
  private onTimeout: () => void;
  private pauseInfo: IPauseInfo;

  constructor(onTimeout: () => void) {
    this.startedAt = this.now();
    this.onTimeout = onTimeout;
    this.pauseInfo = {
      isPaused: false,
      lastResumedAt: this.startedAt,
    };
    this.startTimer(TIMEOUT_MS);
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

  // TODO: consider renaming and making previousStepTimestamp a mandatory arg
  public genericStepTemporalInfo(
    previousStepTimestamp?: number,
    previousStepPauseStepDelta = 0
  ): ITimestampInfo {
    const currentTimestamp = this.now();

    const delta =
      this.elapsedTimeInMs(currentTimestamp) - previousStepPauseStepDelta;

    const stepDelta = previousStepTimestamp
      ? Timer.computeStepDelta(
          currentTimestamp,
          previousStepPauseStepDelta
            ? this.pauseInfo.lastResumedAt
            : previousStepTimestamp
        )
      : 0;

    return {
      timestamp: currentTimestamp,
      delta,
      stepDelta,
    };
  }

  public pauseStepTemporalInfo(): ITimestampInfo {
    if (!this.pauseInfo.isPaused) {
      return;
    }

    const currentTimestamp = this.now();

    const pauseDuration = Timer.computeStepDelta(
      currentTimestamp,
      this.pauseInfo.pausedAt
    );

    const delta = this.elapsedTimeInMs(currentTimestamp) - pauseDuration;

    return {
      timestamp: this.pauseInfo.pausedAt,
      stepDelta: pauseDuration,
      delta,
    };
  }

  public pause(): void {
    // console.log("TIMER pause", this.timerId);
    const pausedAt = this.now();

    this.stopTimer();
    const remainingTime = TIMEOUT_MS - this.elapsedTimeInMs(pausedAt);

    this.pauseInfo = {
      isPaused: true,
      pausedAt,
      remainingTime,
    };
  }

  public resume(): void {
    // console.log("TIMER resume", this.timerId);
    if (!this.pauseInfo.isPaused) {
      return;
    }
    console.log("resume", TIMEOUT_MS, this.pauseInfo.pausedAt);
    this.startTimer(this.pauseInfo.remainingTime);
    this.pauseInfo = { isPaused: false, lastResumedAt: this.now() };
  }

  public destroy() {
    // console.log("TIMER destroy");
    this.stopTimer();
  }

  private now() {
    return Date.now();
  }

  private startTimer(duration: number) {
    console.log("duration", duration);
    this.timerId = setTimeout(() => this.onTimeout(), duration);
    // console.log("TIMER startTimer", this.timerId, duration);
  }

  private stopTimer() {
    // console.log("TIMER stopTimer", this.timerId);
    clearTimeout(this.timerId);
  }
}
