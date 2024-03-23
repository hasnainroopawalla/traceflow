export type IPauseInfo =
  | {
      isPaused: true;
      pausedAt: number;
      remainingTime: number;
    }
  | { isPaused: false; lastResumedAt: number };

// TODO: rename
export type ITimestampInfo = {
  timestamp: number;
  delta: number;
  stepDelta: number;
};

export type IPauseHistory = {
  pausedAt: number;
  remainingTime: number;
  duration?: number;
  resumedAt?: number;
};

export type ITimerState = {
  isPaused: boolean;
};
