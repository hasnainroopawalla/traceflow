import { Pauser } from "./pauser";

type ITimerMarker = {
  timestamp: number;
  delta: number;
  stepDelta: number;
};

export class Timer {
  public startedAt: number;
  private timerId: NodeJS.Timeout;
  private onTimeout: () => void;
  private timeoutInMs: number;
  private markers: ITimerMarker[];

  private pauser: Pauser;

  constructor(onTimeout: () => void, timeoutInMs: number) {
    this.timeoutInMs = timeoutInMs;
    this.startedAt = Date.now();
    this.onTimeout = onTimeout;
    this.pauser = new Pauser();
    this.markers = [];
    this.startTimer(timeoutInMs);
  }

  public mark(isResumeStep = false) {
    const marker = this.computeDeltas(isResumeStep);
    this.markers.push(marker);
    return marker;
  }

  public pause(): void {
    this.pauser.pause();
    this.stopTimer();
    this.mark();
  }

  public resume(): void {
    const { pauseDuration, resumedAt } = this.pauser.resume();

    const { delta } = this.latestMarker();

    const remainingTime = this.timeoutInMs - delta;

    this.startTimer(remainingTime);

    this.markers.push({
      timestamp: resumedAt,
      delta,
      stepDelta: pauseDuration,
    });
  }

  public destroy() {
    this.stopTimer();
  }

  private startTimer(duration: number) {
    this.timerId = setTimeout(() => this.onTimeout(), duration);
  }

  private stopTimer() {
    clearTimeout(this.timerId);
  }

  private computeDeltas(isResumeStep = false) {
    const { delta: prevDelta, timestamp: prevTimestamp } = this.latestMarker();

    const now = isResumeStep ? this.pauser.pausedAt() : Date.now();
    const stepDelta = now - prevTimestamp;
    const delta = prevDelta + stepDelta;

    return {
      timestamp: now,
      delta,
      stepDelta: isResumeStep ? this.pauser.pauseDuration() : stepDelta,
    };
  }

  private latestMarker(): ITimerMarker {
    return (
      this.markers[this.markers.length - 1] || {
        timestamp: this.startedAt,
        delta: 0,
        stepDelta: 0,
      }
    );
  }
}
