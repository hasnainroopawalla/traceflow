import { Pauser } from "./pauser";

type ITimerMarker = {
  timestamp: number;
  delta: number;
};

export class Timer {
  public startedAt: number;
  private timerId: NodeJS.Timeout;
  private onTimeout: () => void;
  private timeoutInMs: number;
  private currentMarker: ITimerMarker;

  private pauser: Pauser;

  constructor(onTimeout: () => void, timeoutInMs: number) {
    this.timeoutInMs = timeoutInMs;
    this.startedAt = Date.now();
    this.onTimeout = onTimeout;
    this.currentMarker = {
      timestamp: this.startedAt,
      delta: 0,
    };
    this.pauser = new Pauser();
    this.startTimer(timeoutInMs);
  }

  public mark(isResumeStep = false) {
    const marker = this.computeDeltas(isResumeStep);
    this.currentMarker = marker;
    return marker;
  }

  public pause(): void {
    this.pauser.pause();
    this.stopTimer();
    this.mark();
  }

  public resume(): void {
    const { resumedAt } = this.pauser.resume();

    const { delta } = this.currentMarker;

    const remainingTime = this.timeoutInMs - delta;

    this.startTimer(remainingTime);

    this.currentMarker = {
      timestamp: resumedAt,
      delta,
    };
  }

  public destroy() {
    this.stopTimer();
  }

  public isPaused() {
    return this.pauser.isPaused();
  }

  private startTimer(duration: number) {
    this.timerId = setTimeout(() => this.onTimeout(), duration);
  }

  private stopTimer() {
    clearTimeout(this.timerId);
  }

  private computeDeltas(isResumeStep = false) {
    const { delta: prevDelta, timestamp: prevTimestamp } = this.currentMarker;

    const now = isResumeStep ? this.pauser.pausedAt() : Date.now();
    const stepDelta = now - prevTimestamp;
    const delta = prevDelta + stepDelta;

    return {
      timestamp: now,
      delta,
      stepDelta: isResumeStep ? this.pauser.pauseDuration() : stepDelta,
    };
  }
}
