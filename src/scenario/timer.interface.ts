export type IPauseInfo =
  | {
      isPaused: true;
      pausedAt: number;
      remainingTime: number;
    }
  | { isPaused: false; lastResumedAt: number };

export type ITemporalInfo = {
  timestamp: number;
  delta: number;
  stepDelta: number;
};

export type ITimerState = {
  isPaused: boolean;
};
